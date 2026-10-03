# webpage_project for ASTM

ASTM 회사 홈페이지 (http://astm-eng.com) 소스. 정적 HTML이고, 한·영·일 전환은 `assets/js/i18n.js`가 한다.

## 운영 구성

| 항목 | 서비스 | 메모 |
|---|---|---|
| 도메인 등록 | **가비아** | astm-eng.com, 만료 2027-10-10 |
| 네임서버(DNS) | **Cafe24** | 가비아에서 네임서버를 `ns1/ns2.cafe24.com`(.co.kr)으로 지정. DNS 레코드는 Cafe24에서 관리 |
| 호스팅 | **Cafe24 웹호스팅** | 10G 광아우토반 FullSSD Plus, PHP 7.4. 서버 `203.245.44.31`, 홈페이지 폴더 `~/www`. **만료 2026-11-01 (자동연장 꺼짐)** |
| 문의 폼 | **Web3Forms** | 회사 업무용 Gmail로 로그인해 만든 폼 "ASTM 홈페이지 문의". 무료 월 250건 |
| SSL(https) | 미설정 | https로 접속하면 `*.cafe24.com` 인증서가 나와 오류. Cafe24에서 인증서 신청 필요 |

## 배포

```bash
./deploy.sh
```

main의 커밋된 파일만 올린다. 서버 `www`를 `~/deploy_backups/`에 백업(최근 3개)하고, 바뀔 목록을 보여 준 뒤 `y`를 눌러야 올린다.
Cafe24 서버에는 rsync, md5sum이 없어서 perl(Digest::MD5)로 파일을 비교하고 tar를 ssh로 보낸다. 비밀번호는 Cafe24 FTP/SSH 비밀번호다.

## 문의 폼 (Web3Forms)

- `contact.html`의 폼이 `https://api.web3forms.com/submit`으로 보내고, Web3Forms가 메일로 전달한다. 서버 코드(PHP)는 쓰지 않는다.
- `access_key`는 페이지에 공개되는 값이라 레포에 있어도 된다. 키를 바꾸려면 Web3Forms 대시보드에서 새로 받아 `contact.html`만 고친다.
- 스팸 방지: 숨긴 체크박스 `botcheck`(허니팟) + hCaptcha. 캡차를 안 풀면 `validate.js`가 전송을 막는다.
- 응답은 JSON(`success`, `message`)이고 `assets/vendor/php-email-form/validate.js`가 처리한다.

## 변경 이력

- 2026-10-03: 문의 폼을 Web3Forms로 교체 (#27). 템플릿 PHP 폼(`forms/contact.php`)은 받는 주소가 `contact@example.com`이고 라이브러리가 없어 처음부터 동작하지 않았다(실사이트 502). PHP를 쓰지 않고 스팸도 막으려고 Web3Forms + 허니팟 + hCaptcha를 골랐다. `forms/` 폴더 삭제.
- 2026-10-03: 배포 스크립트 `deploy.sh` 추가 (#28). 그 전에는 파일을 손으로 올렸다.
- 2026-10-03 확인: 이 시점에 레포 main과 실사이트 파일이 같았다 (#26 하모닉 R&D 페이지까지 반영).
