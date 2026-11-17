"""홈페이지 정적 검사 (파이썬 기본 모듈만 씀, 설치 필요 없음).

    python3 tests/check_site.py            # 검사
    python3 tests/check_site.py --update   # 보이는 글이 바뀐 게 맞으면 스냅샷 갱신

검사하는 것
1. 링크·사진·CSS·JS 파일이 실제로 있는지
2. 검색엔진 설정: 제목·설명·canonical(.html 없는 주소)·사이트맵과 파일 짝
3. 언어별 페이지(한·영·일): hreflang 짝이 서로 맞는지, 페이지 언어 표시
4. 위쪽 메뉴가 모든 페이지에서 같은지, 메뉴 번역이 세 언어 모두 있는지
5. 보이는 글·링크·사진 스냅샷 (tests/snapshots/) — 바뀌면 어디가 바뀌었는지 보여 줌
"""
import difflib
import re
import sys
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / "tests" / "snapshots"
SITE = "https://astm-eng.com"
UPDATE = "--update" in sys.argv

# 검색에 안 내보내는 페이지
NOT_INDEXED = {"sample-inner-page.html", "privacy.html"}
VERIFY_FILES = re.compile(r"^(google[0-9a-f]+|naver[0-9a-f]+)\.html$")
PAGES = sorted(p.name for p in ROOT.glob("*.html") if not VERIFY_FILES.match(p.name))
INDEXABLE = [p for p in PAGES if p not in NOT_INDEXED]
SUPPORTED = ("ko", "en", "ja")


def clean_url(page):
    """파일 이름 → 실제 사이트 주소 (Cloudflare Pages는 .html을 뗀 주소로 보여 줌)"""
    return SITE + "/" if page == "index.html" else f"{SITE}/{page[:-5]}"


class Page(HTMLParser):
    SKIP = {"script", "style", "noscript", "head", "template"}

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []          # (tag, attrs dict)
        self.texts = []
        self.links = []         # (tag, attr, value)
        self.nav = []           # (href, data-i18n) in <nav id="navbar">
        self._skip = 0
        self._in_nav = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append((tag, a))
        if tag in self.SKIP:
            self._skip += 1
        if tag == "nav" and a.get("id") == "navbar":
            self._in_nav = 1
        elif tag == "nav" and self._in_nav:
            self._in_nav += 1
        for attr in ("href", "src"):
            if a.get(attr):
                self.links.append((tag, attr, a[attr]))
        if tag == "img" and a.get("alt") is not None and not self._skip:
            self.texts.append(f"[사진 {a.get('src', '')} | {a['alt']}]")
        if self._in_nav and tag == "a" and a.get("href") and a.get("data-i18n"):
            self.nav.append((a["href"], a["data-i18n"]))

    def handle_endtag(self, tag):
        if tag in self.SKIP and self._skip:
            self._skip -= 1
        if tag == "nav" and self._in_nav:
            self._in_nav -= 1

    def handle_data(self, data):
        if not self._skip:
            s = " ".join(data.split())
            if s:
                self.texts.append(s)

    def meta(self, **match):
        for tag, a in self.tags:
            if tag == "meta" and all(a.get(k) == v for k, v in match.items()):
                return a.get("content")
        return None

    def links_rel(self, rel):
        return [a for t, a in self.tags if t == "link" and a.get("rel") == rel]

    def title(self):
        raw = (ROOT / self._name).read_text(encoding="utf-8") if hasattr(self, "_name") else ""
        m = re.search(r"<title>(.*?)</title>", raw, re.S)
        return m.group(1).strip() if m else ""


_cache = {}


def page(name):
    if name not in _cache:
        p = Page((ROOT / name).read_text(encoding="utf-8"))
        p._name = name
        _cache[name] = p
    return _cache[name]


def local_target(ref):
    """사이트 안 파일을 가리키면 그 경로, 바깥 주소·앵커·메일이면 None"""
    if not ref or ref.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None
    u = urlparse(ref)
    if u.scheme in ("http", "https") or ref.startswith("//"):
        if u.netloc not in ("astm-eng.com", "www.astm-eng.com"):
            return None
        path = u.path.lstrip("/") or "index.html"
        if not Path(path).suffix:
            path += ".html"
        return path
    return u.path.lstrip("/") or None


def i18n_keys():
    js = (ROOT / "assets/js/i18n.js").read_text(encoding="utf-8")
    body = js.split("const DICT = {", 1)[1]
    out = {}
    starts = {lang: re.search(rf"^\s+{lang}: \{{", body, re.M) for lang in SUPPORTED}
    order = sorted(SUPPORTED, key=lambda l: starts[l].start())
    for i, lang in enumerate(order):
        end = starts[order[i + 1]].start() if i + 1 < len(order) else body.index("\n  };")
        chunk = body[starts[lang].end():end]
        out[lang] = set(re.findall(r'^\s+"([^"]+)":', chunk, re.M))
    return out


class Files(unittest.TestCase):
    def test_local_links_exist(self):
        missing = []
        for name in PAGES:
            for tag, attr, ref in page(name).links:
                path = local_target(ref)
                if path and not (ROOT / path).exists():
                    missing.append(f"{name}: <{tag} {attr}=\"{ref}\">")
        self.assertEqual(missing, [], "없는 파일을 가리키는 링크·사진")

    def test_css_url_files_exist(self):
        missing = []
        for css in ROOT.glob("assets/css/*.css"):
            for ref in re.findall(r"url\(['\"]?([^'\")]+)", css.read_text(encoding="utf-8")):
                if ref.startswith(("data:", "http", "#")):
                    continue
                if not (css.parent / ref.split("?")[0].split("#")[0]).resolve().exists():
                    missing.append(f"{css.name}: {ref}")
        self.assertEqual(missing, [])


class Seo(unittest.TestCase):
    def sitemap(self):
        return re.findall(r"<loc>([^<]+)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8"))

    def test_title_and_description(self):
        bad = [n for n in INDEXABLE if not page(n).title() or not page(n).meta(name="description")]
        self.assertEqual(bad, [], "제목이나 설명이 없는 페이지")

    def test_canonical_is_clean_url(self):
        bad = []
        for n in INDEXABLE:
            c = page(n).links_rel("canonical")
            if len(c) != 1 or c[0].get("href") != clean_url(n):
                bad.append(f"{n}: {[x.get('href') for x in c]} (기대: {clean_url(n)})")
        self.assertEqual(bad, [])

    def test_no_absolute_html_urls(self):
        """Cloudflare가 x.html을 x로 넘기므로 검색엔진용 절대 주소에 .html이 붙으면 안 됨"""
        bad = []
        for f in [*map(ROOT.joinpath, PAGES), ROOT / "sitemap.xml", ROOT / "llms.txt"]:
            for m in re.findall(r"https://astm-eng\.com/[A-Za-z0-9_-]+\.html", f.read_text(encoding="utf-8")):
                bad.append(f"{f.name}: {m}")
        self.assertEqual(bad, [])

    def test_sitemap_matches_pages(self):
        locs = self.sitemap()
        self.assertEqual(len(locs), len(set(locs)), "사이트맵에 같은 주소가 두 번")
        expected = {clean_url(n) for n in INDEXABLE}
        self.assertEqual(sorted(expected - set(locs)), [], "사이트맵에 빠진 페이지")
        self.assertEqual(sorted(set(locs) - expected), [], "사이트맵에 있는데 파일이 없는 주소")

    def test_robots_points_to_sitemap(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn(f"Sitemap: {SITE}/sitemap.xml", robots)
        self.assertNotRegex(robots, r"(?m)^Disallow:\s*/\s*$", "사이트 전체를 막으면 안 됨")

    def test_no_noindex(self):
        bad = [n for n in INDEXABLE if "noindex" in (page(n).meta(name="robots") or "")]
        self.assertEqual(bad, [])


class Languages(unittest.TestCase):
    LANG_PAGES = [n for n in PAGES if page(n).meta(name="astm-page-lang")]

    def test_there_are_language_pages(self):
        self.assertGreater(len(self.LANG_PAGES), 0)

    def test_page_lang_matches_html_and_hreflang(self):
        bad = []
        for n in self.LANG_PAGES:
            p = page(n)
            lang = p.meta(name="astm-page-lang")
            html_lang = next((a.get("lang") for t, a in p.tags if t == "html"), None)
            alts = {a.get("hreflang"): a.get("href") for a in p.links_rel("alternate")}
            if lang not in SUPPORTED:
                bad.append(f"{n}: astm-page-lang={lang}")
            if html_lang != lang:
                bad.append(f"{n}: <html lang={html_lang}> vs 페이지 언어 {lang}")
            if alts.get(lang) != clean_url(n):
                bad.append(f"{n}: 자기 언어 hreflang={alts.get(lang)}")
            for l in (*SUPPORTED, "x-default"):
                if l not in alts:
                    bad.append(f"{n}: hreflang {l} 없음")
        self.assertEqual(bad, [])

    def test_hreflang_pairs_are_reciprocal(self):
        """한국어판이 영어판을 가리키면, 영어판도 한국어판을 가리켜야 함"""
        by_url = {clean_url(n): n for n in PAGES}
        bad = []
        for n in self.LANG_PAGES:
            alts = {a.get("hreflang"): a.get("href") for a in page(n).links_rel("alternate")}
            for l in SUPPORTED:
                target = by_url.get(alts.get(l))
                if not target:
                    bad.append(f"{n}: hreflang {l} → {alts.get(l)} 파일 없음")
                    continue
                back = {a.get("hreflang"): a.get("href") for a in page(target).links_rel("alternate")}
                if back.get(page(n).meta(name="astm-page-lang")) != clean_url(n):
                    bad.append(f"{n} ↔ {target} 짝이 안 맞음")
        self.assertEqual(bad, [])

    def test_i18n_keys_in_all_languages(self):
        keys = i18n_keys()
        used = set()
        for n in PAGES:
            for t, a in page(n).tags:
                for attr in ("data-i18n", "data-i18n-title"):
                    if a.get(attr):
                        used.add(a[attr])
        bad = [f"{k}: {l} 없음" for k in sorted(used) for l in SUPPORTED if k not in keys[l]]
        self.assertEqual(bad, [], "번역이 빠진 문구 (그 언어로 바꾸면 다른 언어 글이 보임)")

    def test_language_menu_on_every_page(self):
        bad = []
        for n in INDEXABLE:
            langs = {a.get("data-set-lang") for t, a in page(n).tags if a.get("data-set-lang")}
            if langs != set(SUPPORTED):
                bad.append(f"{n}: {sorted(x for x in langs if x)}")
        self.assertEqual(bad, [], "언어 메뉴(Kor·Eng·Ja)가 없거나 빠진 페이지")


class Menu(unittest.TestCase):
    def test_same_menu_on_every_page(self):
        ref = page("index.html").nav
        self.assertGreater(len(ref), 3)
        ref_keys = [k for _, k in ref]
        bad = [f"{n}: {[k for _, k in page(n).nav]}" for n in INDEXABLE if [k for _, k in page(n).nav] != ref_keys]
        self.assertEqual(bad, [], f"메뉴 순서·항목이 홈과 다름 (홈: {ref_keys})")

    def test_contact_email(self):
        bad = [n for n in INDEXABLE if "sskim@astm-eng.com" not in (ROOT / n).read_text(encoding="utf-8")]
        self.assertEqual(bad, [], "회사 메일 주소가 없는 페이지")


class Snapshot(unittest.TestCase):
    """보이는 글·사진·링크가 바뀌면 실패. 바뀐 게 맞으면 --update로 갱신해서 같이 올린다."""

    def render(self, name):
        p = page(name)
        out = [f"# {name}", f"제목: {p.title()}", f"설명: {p.meta(name='description')}", "", "## 글"]
        out += p.texts
        out += ["", "## 링크"]
        out += sorted({ref for tag, attr, ref in p.links if tag == "a"})
        return "\n".join(out) + "\n"

    def test_snapshots(self):
        SNAP.mkdir(parents=True, exist_ok=True)
        changed = []
        for n in PAGES:
            f = SNAP / (n[:-5] + ".txt")
            now = self.render(n)
            if UPDATE or not f.exists():
                f.write_text(now, encoding="utf-8")
                continue
            before = f.read_text(encoding="utf-8")
            if before != now:
                diff = "".join(list(difflib.unified_diff(
                    before.splitlines(True), now.splitlines(True), f"이전/{f.name}", f"지금/{f.name}", n=1))[:60])
                changed.append(diff)
        for f in SNAP.glob("*.txt"):
            if f.stem + ".html" not in PAGES:
                if UPDATE:
                    f.unlink()
                else:
                    changed.append(f"없어진 페이지: {f.stem}.html")
        self.assertEqual(changed, [], "\n보이는 내용이 바뀌었습니다. 의도한 것이면 python3 tests/check_site.py --update\n")


if __name__ == "__main__":
    argv = [a for a in sys.argv if a != "--update"]
    unittest.main(argv=argv, verbosity=1)
