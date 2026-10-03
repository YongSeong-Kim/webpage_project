#!/usr/bin/env bash
# astm-eng.com 배포 스크립트 (Cafe24 웹호스팅)
#
# 사용법:  ./deploy.sh
#
# 하는 일:
#   1. main 브랜치이고, 커밋 안 된 변경이 없고, GitHub과 같은지 확인
#   2. 커밋된 파일만 임시 폴더로 꺼냄 (커밋 안 된 파일은 절대 올라가지 않음)
#   3. 서버의 www 를 압축 백업 (최근 3개만 보관)
#   4. 서버와 파일 내용(md5)을 비교해 바뀔 목록을 보여주고, y 를 눌러야 실제로 올림
#
# Cafe24 서버에는 rsync, md5sum이 없다. 그래서 perl(Digest::MD5)로 파일 지문을 비교하고
# tar(ssh로 전송)로 올린다.
# 비밀번호는 처음에 한 번만 묻는다.
set -euo pipefail

HOST="tedsskim01@203.245.44.31"
REMOTE_DIR="www"
BACKUP_DIR="deploy_backups"   # 홈 폴더 아래, www 밖이라 외부에서 안 보임
KEEP_BACKUPS=3

# 레포에는 있지만 홈페이지에는 올리지 않는 것
# + 서버에만 있고 지우면 안 되는 것 (.htaccess, SSL 인증용 .well-known 등)
# 경로 앞부분이 일치하면 제외한다.
EXCLUDES=(
  ".git/" ".gitignore" "README.md" "deploy.sh" "docs/"
  ".htaccess" ".user.ini" ".well-known/"
)

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
die()   { red "✗ $*"; exit 1; }

cd "$(dirname "$0")"

# ---- 1. git 상태 확인 ----
bold "[1/4] git 상태 확인"
[ "$(git branch --show-current)" = "main" ] || die "main 브랜치에서만 배포한다. 'git checkout main' 후 다시 실행."
[ -z "$(git status --porcelain --untracked-files=no)" ] || die "커밋 안 된 변경이 있다. 커밋하거나 되돌린 뒤 다시 실행."
git fetch -q origin
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || die "GitHub main과 다르다. 'git pull' (또는 push) 후 다시 실행."
COMMIT="$(git log -1 --format='%h %s')"
green "  ✓ main: $COMMIT"

# ---- 커밋된 파일만 꺼내기 ----
WORK="$(mktemp -d)"
SRC="$WORK/site"
mkdir -p "$SRC"
SOCK="$(mktemp -u /tmp/astm-deploy.XXXXXX)"
SSH=(ssh -o ControlMaster=auto -o ControlPath="$SOCK" -o ControlPersist=300 "$HOST")
cleanup() {
  ssh -o ControlPath="$SOCK" -O exit "$HOST" 2>/dev/null || true
  rm -rf "$WORK"
}
trap cleanup EXIT
git archive HEAD | tar -x -C "$SRC"

# ---- 2. 서버 접속 ----
bold "[2/4] 서버 접속 (비밀번호를 한 번 입력)"
"${SSH[@]}" "test -d $REMOTE_DIR" || die "서버에 $REMOTE_DIR 폴더가 없다."
for cmd in perl tar xargs; do
  "${SSH[@]}" "command -v $cmd >/dev/null" || die "서버에 $cmd 가 없다. Claude에게 알려 주기."
done
"${SSH[@]}" "perl -MDigest::MD5 -MFile::Find -e 1" || die "서버 perl에 Digest::MD5가 없다. Claude에게 알려 주기."
green "  ✓ 접속됨"

# ---- 3. 백업 ----
bold "[3/4] 서버 백업"
STAMP="$(date +%Y%m%d_%H%M%S)"
"${SSH[@]}" "
  mkdir -p $BACKUP_DIR &&
  tar -czf $BACKUP_DIR/www_$STAMP.tar.gz $REMOTE_DIR &&
  ls -1t $BACKUP_DIR/www_*.tar.gz | tail -n +$((KEEP_BACKUPS + 1)) | xargs rm -f
" || die "백업 실패. 아무것도 바꾸지 않았다."
green "  ✓ ~/$BACKUP_DIR/www_$STAMP.tar.gz"

# ---- 4. 비교 → 미리보기 → 확인 → 올리기 ----
bold "[4/4] 바뀔 내용 미리보기"
# 서버 www 의 모든 파일 md5 ("hash  ./경로"). perl 프로그램은 stdin으로 보낸다
"${SSH[@]}" "cd $REMOTE_DIR && perl -" > "$WORK/remote.md5" <<'PERL'
use strict; use Digest::MD5; use File::Find;
find({ no_chdir => 1, wanted => sub {
  return unless -f $_;
  open(my $f, '<', $_) or return; binmode $f;
  print Digest::MD5->new->addfile($f)->hexdigest, "  $_\n";
}}, '.');
PERL
(cd "$SRC" && find . -type f -print0 | xargs -0 md5 -r) > "$WORK/local.md5"

# 비교해서 올릴 목록(upload.lst), 지울 목록(delete.lst), 지울 빈 폴더(rmdir.lst)를 만든다 (모두 NUL 구분)
python3 - "$WORK" "${EXCLUDES[@]}" <<'PY'
import os, sys
work, excludes = sys.argv[1], sys.argv[2:]

def load(path):
    out = {}
    for line in open(path, encoding="utf-8", errors="surrogateescape"):
        line = line.rstrip("\n")
        if not line:
            continue
        h, p = line.split(" ", 1)
        p = p.lstrip(" *")          # 서버: "hash  ./p", 로컬 md5 -r: "hash ./p"
        if p.startswith("./"):
            p = p[2:]
        if any(p == e.rstrip("/") or p.startswith(e.rstrip("/") + "/") for e in excludes):
            continue
        if os.path.basename(p) == ".DS_Store":
            continue
        out[p] = h
    return out

local, remote = load(f"{work}/local.md5"), load(f"{work}/remote.md5")
added   = sorted(p for p in local if p not in remote)
changed = sorted(p for p in local if p in remote and local[p] != remote[p])
deleted = sorted(p for p in remote if p not in local)

all_local_dirs = set()
for p in local:
    d = os.path.dirname(p)
    while d:
        all_local_dirs.add(d)
        d = os.path.dirname(d)
rmdirs = set()
for p in deleted:
    d = os.path.dirname(p)
    while d and d not in all_local_dirs:
        rmdirs.add(d)
        d = os.path.dirname(d)

def write(name, items):
    with open(f"{work}/{name}", "wb") as f:
        for p in items:
            f.write(p.encode("utf-8", "surrogateescape") + b"\0")

write("upload.lst", added + changed)
write("delete.lst", deleted)
write("rmdir.lst", sorted(rmdirs, key=lambda d: -d.count("/")))   # 깊은 폴더부터

R, G, Z = "\033[31m", "\033[32m", "\033[0m"
for p in added:   print(f"  {G}추가  {p}{Z}")
for p in changed: print(f"  수정  {p}")
for p in deleted: print(f"  {R}삭제  {p}{Z}")
with open(f"{work}/count", "w") as f:
    f.write(str(len(added) + len(changed) + len(deleted)))
PY

if [ "$(cat "$WORK/count")" = "0" ]; then
  green "  ✓ 서버가 이미 최신이다. 올릴 것이 없다."
  exit 0
fi
echo
read -r -p "위 내용으로 astm-eng.com 에 올릴까요? (y/N) " ANSWER
[ "$ANSWER" = "y" ] || [ "$ANSWER" = "Y" ] || die "취소했다. 서버는 그대로다."

if [ -s "$WORK/upload.lst" ]; then
  # COPYFILE_DISABLE: macOS가 ._파일(메타데이터)을 tar에 끼워 넣지 않게
  COPYFILE_DISABLE=1 tar --no-xattrs --no-mac-metadata -C "$SRC" --null -T "$WORK/upload.lst" -czf - \
    | "${SSH[@]}" "tar -xzf - -C $REMOTE_DIR" || die "업로드 실패. 되돌리기는 아래 백업 사용."
fi
if [ -s "$WORK/delete.lst" ]; then
  "${SSH[@]}" "cd $REMOTE_DIR && xargs -0 rm -f --" < "$WORK/delete.lst"
fi
if [ -s "$WORK/rmdir.lst" ]; then
  "${SSH[@]}" "cd $REMOTE_DIR && xargs -0 rmdir -- 2>/dev/null || true" < "$WORK/rmdir.lst"
fi

green "✓ 배포 완료: $COMMIT"
echo "  확인: http://astm-eng.com  (안 바뀌어 보이면 Cmd+Shift+R)"
echo "  되돌리기: ssh $HOST 후"
echo "    rm -rf $REMOTE_DIR && tar -xzf $BACKUP_DIR/www_$STAMP.tar.gz"
