#!/usr/bin/env python3
"""astm-eng.com 가공 분야별 페이지(한/영) 생성. product.html의 머리·꼬리를 그대로 가져다 쓴다.
사용: python3 gen_pages.py <webpage_project 경로>
"""
import json, re, sys, html
from pathlib import Path

ROOT = Path(sys.argv[1])
src = (ROOT / "product.html").read_text(encoding="utf-8")

head_assets = src[src.index("  <!-- Favicons -->"):src.index("  <!-- =======================================================")]
body_top = src[src.index("<body>"):src.index('  <main id="main">')]
footer = src[src.index('  <footer id="footer"'):src.index("</body>")]

SITE = "https://astm-eng.com/"
ADDR = {"@type": "PostalAddress", "streetAddress": "140-25, Neungheodae-ro 625beon-gil",
        "addressLocality": "Namdong-gu", "addressRegion": "Incheon", "addressCountry": "KR"}

# ---------------- 페이지 내용 (홈페이지·회사소개 문서에 이미 있는 사실만) ----------------
PAGES = [
  dict(slug="cnc-turning", photos=["product/CNC/3.jpg", "product/CNC/2.jpg", "product/CNC/1.jpg", "factory/lathe.jpg"],
    ko=dict(
      title="인천 CNC 선반 가공 | 축·핀·부싱 정밀가공 - ASTM엔지니어링",
      desc="인천 남동구 ASTM엔지니어링의 CNC 선반 가공. 축, 핀, 부싱, 플랜지 같은 회전체 부품을 도면대로 가공합니다. 20년 가공 경력, 판금(BSTM)까지 한 곳에서.",
      h1="CNC 선반 가공", crumb="CNC 선반 가공",
      lead="축, 핀, 부싱, 플랜지처럼 둥근 부품을 CNC 선반으로 가공합니다. 인천 남동구에서 20년 동안 고객 도면대로 부품을 만들어 왔습니다.",
      sections=[
        ("이런 부품을 만듭니다", ["축(샤프트), 핀, 부싱", "플랜지, 커버, 링 같은 회전체 부품", "선반 가공 뒤 머시닝센터(MCT)로 구멍·홈을 더하는 복합 부품", "길고 깊은 구멍이 필요하면 건드릴 가공까지 한 곳에서"]),
        ("함께 맡길 수 있는 일", ["머시닝센터(MCT) 가공", "건드릴(깊은 구멍) 가공", "판금 부품(레이저 절단·절곡·용접, BSTM)"]),
      ]),
    en=dict(
      title="CNC Turning in Incheon, Korea | Shafts, Pins, Bushings - ASTM Engineering",
      desc="CNC turning service in Incheon, Korea. ASTM Engineering machines shafts, pins, bushings and flanges to your drawing. 20 years in machining, sheet metal (BSTM) in the same place.",
      h1="CNC Turning", crumb="CNC Turning",
      lead="We turn round parts like shafts, pins, bushings and flanges on CNC lathes. We have made parts to customer drawings in Incheon, Korea for 20 years.",
      sections=[
        ("Parts we make", ["Shafts, pins and bushings", "Flanges, covers, rings and other round parts", "Turned parts that also need milled holes and slots on our machining centers", "Gun drilling for long, deep holes, in the same shop"]),
        ("Also from us", ["Machining center (MCT) milling", "Gun drilling", "Sheet metal parts: laser cutting, bending, welding (BSTM)"]),
      ])),
  dict(slug="mct-machining", photos=["product/MCT/4.jpg", "product/MCT/3.jpg", "product/MCT/5.jpg", "product/MCT/8.jpg", "factory/cnc_row.jpg"],
    ko=dict(
      title="인천 MCT 가공 · 알루미늄 정밀가공 | 하우징·블록·브래킷 - ASTM엔지니어링",
      desc="인천 남동구 ASTM엔지니어링의 머시닝센터(MCT) 가공. 알루미늄 하우징, 블록, 브래킷, 플레이트 같은 각형 부품을 도면대로 정밀가공합니다.",
      h1="머시닝센터(MCT) 가공", crumb="MCT 가공",
      lead="하우징, 블록, 브래킷, 플레이트 같은 각형 부품을 머시닝센터로 가공합니다. 알루미늄 하우징, 포켓과 구멍이 많은 판재 부품 등을 만들어 왔습니다.",
      sections=[
        ("이런 부품을 만듭니다", ["알루미늄 하우징, 케이스", "블록, 브래킷, 베이스 플레이트", "구멍·포켓이 많은 판재 부품", "자동화 장비에 들어가는 가공 부품"]),
        ("함께 맡길 수 있는 일", ["CNC 선반 가공", "건드릴(깊은 구멍) 가공", "장비 프레임·함체 같은 판금 부품(BSTM). 가공 부품과 판금 부품을 같은 곳에서 맞춰 보고 한 번에 납품합니다"]),
      ]),
    en=dict(
      title="CNC Milling / Machining Center in Korea | Aluminum Housings, Blocks - ASTM Engineering",
      desc="CNC milling on machining centers (MCT) in Incheon, Korea. ASTM Engineering machines aluminum housings, blocks, brackets and plates to your drawing.",
      h1="CNC Milling (Machining Center)", crumb="CNC Milling",
      lead="We mill prismatic parts like housings, blocks, brackets and plates on machining centers. Our work includes aluminum housings and plates with many pockets and holes.",
      sections=[
        ("Parts we make", ["Aluminum housings and cases", "Blocks, brackets and base plates", "Plates with many holes and pockets", "Machined parts for automation equipment"]),
        ("Also from us", ["CNC turning", "Gun drilling", "Sheet metal frames and enclosures (BSTM). Machined and sheet metal parts are checked together and shipped on one schedule"]),
      ])),
  dict(slug="gun-drilling", photos=["product/Gundrill/1.jpg", "product/Gundrill/2.jpg", "equipment/gundrill.jpg"],
    ko=dict(
      title="인천 건드릴 가공 | 깊은 구멍·긴 구멍 가공 - ASTM엔지니어링",
      desc="인천 남동구 ASTM엔지니어링의 건드릴 가공. 일반 드릴로 어려운 길고 깊은 구멍을 건드릴 전용 장비로 가공합니다. 긴 플레이트·블록·축의 깊은 구멍.",
      h1="건드릴 가공 (깊은 구멍)", crumb="건드릴 가공",
      lead="일반 드릴로 뚫기 어려운 길고 깊은 구멍을 건드릴 전용 장비로 가공합니다. 긴 플레이트나 블록에 길이 방향으로 구멍을 내는 일을 해 왔습니다.",
      sections=[
        ("이런 부품을 만듭니다", ["길이 방향으로 깊은 구멍이 들어가는 긴 플레이트", "긴 구멍이 필요한 블록·축", "건드릴 뒤 머시닝센터로 나머지 형상까지 가공하는 부품"]),
        ("함께 맡길 수 있는 일", ["머시닝센터(MCT) 가공", "CNC 선반 가공", "판금 부품(BSTM)"]),
      ]),
    en=dict(
      title="Gun Drilling in Korea | Deep Hole Drilling - ASTM Engineering",
      desc="Gun drilling (deep hole drilling) in Incheon, Korea. ASTM Engineering drills long, deep holes on a dedicated gun drill machine, in long plates, blocks and shafts.",
      h1="Gun Drilling (Deep Holes)", crumb="Gun Drilling",
      lead="We drill long, deep holes that normal drills cannot do well, on a dedicated gun drill machine. We have drilled holes along the length of long plates and blocks.",
      sections=[
        ("Parts we make", ["Long plates with deep holes along their length", "Blocks and shafts with long holes", "Parts that are gun drilled first and then finished on our machining centers"]),
        ("Also from us", ["Machining center (MCT) milling", "CNC turning", "Sheet metal parts (BSTM)"]),
      ])),
  dict(slug="sheet-metal", photos=["factory/pega357.jpg", "factory/press_brake.jpg", "equipment/trumpf-laser_machine.png", "product/sheet-metal/wireless_repeater_enclosure.jpg"],
    ko=dict(
      title="인천 판금 가공 | 레이저 절단·펀칭·절곡·용접 - BSTM",
      desc="인천 남동구 BSTM의 판금 가공. TRUMPF 레이저 절단, AMADA PEGA-357 펀칭, AMADA RG-100 절곡, PEM 너트 압입, 용접 로봇. 함체, 랙, 장비 프레임 제작.",
      h1="판금 가공 (BSTM)", crumb="판금 가공",
      lead="BSTM은 레이저 절단부터 펀칭, 절곡, 너트 압입, 용접까지 판금 제작을 합니다. 함체, 랙, 장비 프레임처럼 판금으로 만드는 제품을 도면대로 만듭니다.",
      sections=[
        ("설비", ["TRUMPF 레이저 절단기", "AMADA PEGA-357 펀칭", "AMADA RG-100 절곡기", "PEM 프레스 (너트·스터드 압입)", "용접 로봇"]),
        ("만들어 온 것", ["서버 랙, 수냉 랙", "무선 중계기 함체", "무인 택배함", "자동화 장비 프레임", "압력 용기"]),
        ("함께 맡길 수 있는 일", ["가공 부품(CNC 선반·MCT·건드릴, ASTM엔지니어링). 판금과 가공 부품을 같은 곳에서 맞춰 보고 한 번에 납품합니다"]),
      ]),
    en=dict(
      title="Sheet Metal Fabrication in Korea | Laser Cutting, Punching, Bending, Welding - BSTM",
      desc="Sheet metal fabrication in Incheon, Korea by BSTM: TRUMPF laser cutting, AMADA PEGA-357 punching, AMADA RG-100 bending, PEM insertion and robotic welding. Enclosures, racks, machine frames.",
      h1="Sheet Metal Fabrication (BSTM)", crumb="Sheet Metal",
      lead="BSTM does sheet metal work from laser cutting to punching, bending, PEM insertion and welding. We build enclosures, racks and machine frames to your drawing.",
      sections=[
        ("Equipment", ["TRUMPF laser cutting machine", "AMADA PEGA-357 punch press", "AMADA RG-100 press brake", "PEM press (self-clinching nuts and studs)", "Welding robot"]),
        ("What we have made", ["Server racks and liquid cooling racks", "Wireless repeater enclosures", "Parcel lockers", "Frames for automation equipment", "Pressure vessels"]),
        ("Also from us", ["Machined parts: CNC turning, milling, gun drilling (ASTM Engineering). Sheet metal and machined parts are checked together and shipped on one schedule"]),
      ])),
  dict(slug="machining-and-sheet-metal", photos=["product/sheet-metal/automation_machine_frame.png", "product/sheet-metal/server_rack.jpg", "product/MCT/automation_machine.png", "factory/floor.jpg"],
    ko=dict(
      title="가공 + 판금 한 곳에서 | 장비 프레임·랙·함체 제작 - ASTM엔지니어링 · BSTM",
      desc="정밀가공(ASTM엔지니어링)과 판금(BSTM)을 인천 남동구 한 곳에서. 자동화 장비 프레임, 서버 랙, 함체처럼 가공·판금 부품이 함께 들어가는 제품을 한 업체에 맡기세요.",
      h1="가공과 판금을 한 곳에서", crumb="가공 + 판금",
      lead="장비 한 대에는 가공 부품과 판금 부품이 함께 들어갑니다. 따로 맡기면 업체 사이에서 치수와 일정을 맞추느라 시간이 듭니다. ASTM엔지니어링(가공)과 BSTM(판금)은 같은 곳에서 만들기 때문에, 맞물리는 부품을 바로 맞춰 보고 한 번에 납품합니다.",
      sections=[
        ("이런 제품에 맞습니다", ["자동화 장비 프레임과 부품", "서버 랙, 수냉 랙", "통신 장비 함체", "판금 몸체에 가공 부품이 붙는 장비"]),
        ("한 곳에서 하는 일", ["CNC 선반, 머시닝센터(MCT), 건드릴 가공", "레이저 절단, 펀칭, 절곡, PEM 압입, 용접", "가공 부품과 판금 부품 조립 확인 후 함께 납품"]),
      ]),
    en=dict(
      title="Machining and Sheet Metal Under One Roof | Frames, Racks, Enclosures - ASTM Engineering · BSTM",
      desc="Precision machining (ASTM Engineering) and sheet metal fabrication (BSTM) in one place in Incheon, Korea. Machine frames, server racks and enclosures that need both, from one supplier.",
      h1="Machining and Sheet Metal in One Place", crumb="Machining + Sheet Metal",
      lead="Most machines have both machined parts and sheet metal parts. With two suppliers, time is lost matching dimensions and schedules between them. ASTM Engineering (machining) and BSTM (sheet metal) work side by side, so mating parts are checked against each other directly and shipped together.",
      sections=[
        ("Good fit for", ["Frames and parts for automation equipment", "Server racks and liquid cooling racks", "Enclosures for telecom equipment", "Equipment with a sheet metal body and machined parts"]),
        ("Done in one place", ["CNC turning, machining center (MCT) milling, gun drilling", "Laser cutting, punching, bending, PEM insertion, welding", "Fit check of machined and sheet metal parts, then one shipment"]),
      ])),
]

NAV = {
  "ko": dict(home="홈", product="가공 제품", others="다른 가공 분야", quote_h="견적 받는 방법",
             quote_steps=["도면(PDF, DWG, STEP 등)과 수량, 원하는 납기를 보내 주세요.", "도면을 보고 가공 방법과 금액을 검토해 회신드립니다.", "가공과 판금이 함께 필요한 제품도 한 번에 견적드립니다."],
             quote_btn="도면 보내고 견적 받기", mail="메일", phone="전화", other_lang="English", inlang="ko"),
  "en": dict(home="Home", product="Products", others="Other services", quote_h="How to get a quote",
             quote_steps=["Send us your drawing (PDF, DWG, STEP etc.), quantity and the delivery date you need.", "We review the drawing and reply with our price and how we will make it.", "If your product needs both machined and sheet metal parts, we quote them together."],
             quote_btn="Send a drawing for a quote", mail="Email", phone="Phone", other_lang="한국어", inlang="en"),
}

def url(slug, lang):
    return f"{slug}.html" if lang == "ko" else f"{slug}-en.html"

def esc(s): return html.escape(s, quote=True)

def build(p, lang):
    c = p[lang]; n = NAV[lang]; other = "en" if lang == "ko" else "ko"
    me, alt = url(p["slug"], lang), url(p["slug"], other)
    ko_u, en_u = SITE + url(p["slug"], "ko"), SITE + url(p["slug"], "en")
    og_img = SITE + "assets/img/" + p["photos"][0]
    ld = {
      "@context": "https://schema.org",
      "@graph": [
        {"@type": "Service", "name": c["h1"], "serviceType": c["crumb"], "description": c["desc"], "url": SITE + me,
         "areaServed": "Worldwide",
         "provider": {"@type": "LocalBusiness", "name": "ASTM엔지니어링 (ASTM Engineering)",
                      "alternateName": ["ASTM Engineering", "BSTM Sheet Metal"], "url": SITE,
                      "email": "astmengineering1@gmail.com", "address": ADDR}},
        {"@type": "BreadcrumbList", "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": n["home"], "item": SITE},
          {"@type": "ListItem", "position": 2, "name": c["crumb"], "item": SITE + me}]},
      ]}
    head = f"""<!DOCTYPE html>
<html lang="{lang}">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>{esc(c['title'])}</title>
  <meta content="{esc(c['desc'])}" name="description">
  <link rel="canonical" href="{SITE}{me}">
  <link rel="alternate" hreflang="ko" href="{ko_u}">
  <link rel="alternate" hreflang="en" href="{en_u}">
  <link rel="alternate" hreflang="x-default" href="{en_u}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ASTM엔지니어링 · BSTM">
  <meta property="og:title" content="{esc(c['title'])}">
  <meta property="og:description" content="{esc(c['desc'])}">
  <meta property="og:url" content="{SITE}{me}">
  <meta property="og:image" content="{og_img}">

{head_assets}  <link href="assets/css/service.css?v=20261115" rel="stylesheet">

  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>

"""
    # 사진
    alt_base = c["h1"]
    photos = "\n".join(
      f'          <div class="col-6 col-lg-3"><a href="assets/img/{ph}" class="glightbox svc-photo"><img src="assets/img/{ph}" alt="{esc(alt_base)} - ASTM" loading="lazy"></a></div>'
      for ph in p["photos"][:4])
    secs = "\n".join(
      f"""          <div class="col-lg-{12 // max(1, min(3, len(c['sections'])))}">
            <div class="svc-card">
              <h2>{esc(h)}</h2>
              <ul>
{chr(10).join(f'                <li>{esc(i)}</li>' for i in items)}
              </ul>
            </div>
          </div>""" for h, items in c["sections"])
    others = "\n".join(
      f'            <li><a href="{url(q["slug"], lang)}">{esc(q[lang]["crumb"])}</a></li>'
      for q in PAGES if q["slug"] != p["slug"])
    steps = "\n".join(f"                <li>{esc(s)}</li>" for s in n["quote_steps"])
    main = f"""  <main id="main">

    <!-- ======= Breadcrumbs ======= -->
    <div class="breadcrumbs">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="svc-h1">{esc(c['h1'])}</h1>
          <ol>
            <li><a href="index.html">{esc(n['home'])}</a></li>
            <li><a href="product.html">{esc(n['product'])}</a></li>
            <li>{esc(c['crumb'])}</li>
          </ol>
        </div>
      </div>
    </div><!-- End Breadcrumbs -->

    <section class="svc">
      <div class="container">

        <p class="svc-lead">{esc(c['lead'])}</p>
        <p class="svc-lang"><a href="{alt}" hreflang="{other}">{esc(n['other_lang'])}</a></p>

        <div class="row g-3 svc-photos">
{photos}
        </div>

        <div class="row g-4 mt-2">
{secs}
        </div>

        <div class="svc-quote mt-5">
          <h2>{esc(n['quote_h'])}</h2>
          <ol>
{steps}
          </ol>
          <p class="svc-contact">{esc(n['mail'])}: <a href="mailto:astmengineering1@gmail.com">astmengineering1@gmail.com</a> · {esc(n['phone'])}: <a href="tel:+821090772445">+82 10 9077 2445</a></p>
          <a class="btn-book-a-table svc-btn" href="contact.html#contact-form">{esc(n['quote_btn'])}</a>
        </div>

        <div class="svc-others mt-5">
          <h2>{esc(n['others'])}</h2>
          <ul>
{others}
          </ul>
        </div>

      </div>
    </section>

  </main><!-- End #main -->

"""
    return head + body_top + main + footer + "</body>\n\n</html>\n"

for p in PAGES:
    for lang in ("ko", "en"):
        (ROOT / url(p["slug"], lang)).write_text(build(p, lang), encoding="utf-8")
        print("wrote", url(p["slug"], lang))

# 다른 곳에서 쓰도록 목록 출력
print(json.dumps([[p["slug"], p["ko"]["crumb"], p["en"]["crumb"]] for p in PAGES], ensure_ascii=False))
