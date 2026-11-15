# webpage_project for ASTM

ASTM 회사 홈페이지 (https://astm-eng.com) 소스. 정적 HTML이고, 한·영·일 전환은 `assets/js/i18n.js`가 한다.

## 운영 구성

| 항목 | 서비스 | 메모 |
|---|---|---|
| 도메인 등록 | **가비아** | astm-eng.com, 만료 2027-10-10 |
| 네임서버(DNS) | **Cloudflare** (무료) | 가비아에서 네임서버를 Cloudflare로 지정. 메일 MX는 그대로 Cafe24 메일(`mw-002.cafe24.com`). 예전에는 Cafe24 네임서버 |
| 호스팅 | **Cloudflare Pages** (무료) | 프로젝트 `astm-eng`. 예전 Cafe24 웹호스팅(서버 `203.245.44.31`, `~/www`)은 만료 때까지 백업으로 두고 연장하지 않는다 |
| 문의 폼 | **Web3Forms** | 회사 업무용 Gmail로 로그인해 만든 폼 "ASTM 홈페이지 문의". 무료 월 250건 |
| SSL(https) | **Cloudflare** (무료) | 인증서 자동 발급·갱신. http로 오면 https로 넘긴다 |

## 배포

main에 올리면 GitHub Actions(`.github/workflows/deploy.yml`)가 Cloudflare Pages로 배포한다. 시크릿 `CLOUDFLARE_API_TOKEN`(Pages 편집 권한)이 필요하다. 계정 ID는 워크플로에 적혀 있다. 올리지 않는 파일: `.github/`, `.gitignore`, `README.md`, `deploy.sh`, `docs/`.

`deploy.sh`는 예전 Cafe24 서버용이다. Cafe24 호스팅이 끝나면 지운다.

## 문의 폼 (Web3Forms)

- `contact.html`의 폼이 `https://api.web3forms.com/submit`으로 보내고, Web3Forms가 메일로 전달한다. 서버 코드(PHP)는 쓰지 않는다.
- `access_key`는 페이지에 공개되는 값이라 레포에 있어도 된다. 키를 바꾸려면 Web3Forms 대시보드에서 새로 받아 `contact.html`만 고친다.
- 스팸 방지: 숨긴 체크박스 `botcheck`(허니팟) + hCaptcha. 캡차를 안 풀면 `validate.js`가 전송을 막는다.
- 응답은 JSON(`success`, `message`)이고 `assets/vendor/php-email-form/validate.js`가 처리한다.

## 변경 이력

- 2026-11-15: 검색으로 손님이 들어오게 가공 분야별 페이지 5개를 한·영으로 추가 (`cnc-turning`, `mct-machining`, `gun-drilling`, `sheet-metal`, `machining-and-sheet-metal`, 영어는 `-en.html`). TW하이텍이 11/12 홈페이지 문의 양식으로 들어온 것을 보고, 검색어마다 페이지를 늘리기로 함. 한국어 본문을 HTML에 그대로 써서 검색에 잡히게 했고(i18n 전환 안 씀), hreflang으로 한·영을 묶음. 내용은 홈페이지·회사소개에 이미 있는 사실만 씀. 페이지는 `docs/gen_service_pages.py`로 만든다(product.html의 머리·꼬리를 가져옴). 홈·제품 페이지에 링크 띠, sitemap·llms.txt에 추가. 같은 날 사용자 의견("들어가기 힘들다")으로 고침: 상단 메뉴에 '가공 분야'(services.html·services-en.html, 메뉴 키 nav.services), 홈·제품의 알약 링크 띠를 사진 카드로(`<!-- svc-cards:start/end -->` 사이를 생성기가 채움), 분야 페이지는 큰 사진 + 소개 + 견적 버튼을 맨 위에. 11/16: 일본어(-ja.html) 추가, 오른쪽 위 언어 메뉴를 누르면 짝 페이지로 이동(i18n.js가 `<meta name="astm-page-lang">`·hreflang을 보고 옮김, 고른 언어를 기억), 홈·제품 카드는 언어별 세 벌(only-ko/en/ja), 사이트 메일 주소를 sskim@astm-eng.com으로(문의 양식은 그대로 회사 Gmail로 감).
- 2026-10-19: 무료로 https를 쓰려고 Cloudflare(DNS·Pages)로 옮김. 사이트 안의 주소를 모두 https로 바꿈. Firebase Hosting도 비교했지만 전송량 제한(월 10GB)이 있고, 메일 전달·Workers를 같은 곳에서 무료로 쓸 수 있어 Cloudflare로 정함.
- 2026-10-03: 문의 폼을 Web3Forms로 교체 (#27). 템플릿 PHP 폼(`forms/contact.php`)은 받는 주소가 `contact@example.com`이고 라이브러리가 없어 처음부터 동작하지 않았다(실사이트 502). PHP를 쓰지 않고 스팸도 막으려고 Web3Forms + 허니팟 + hCaptcha를 골랐다. `forms/` 폴더 삭제.
- 2026-10-03: 배포 스크립트 `deploy.sh` 추가 (#28). 그 전에는 파일을 손으로 올렸다.
- 2026-10-03 확인: 이 시점에 레포 main과 실사이트 파일이 같았다 (#26 하모닉 R&D 페이지까지 반영).
