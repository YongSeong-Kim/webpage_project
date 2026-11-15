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
      title="인천 CNC 선반 가공 - ASTM엔지니어링",
      desc="인천 남동공단 ASTM엔지니어링. CNC 선반으로 축, 핀, 부싱, 플랜지 등 원형 부품 가공. 도면 주시면 견적드립니다.",
      h1="CNC 선반 가공", crumb="CNC 선반",
      lead="CNC 선반으로 축, 핀, 부싱, 플랜지 등 원형 부품을 가공합니다. 선반 후 MCT 2차 가공, 건드릴 작업까지 저희 공장에서 같이 합니다.",
      sections=[
        ("주요 가공품", ["축, 핀, 부싱", "플랜지, 커버, 링", "선반 + MCT 복합 가공품"]),
        ("연계 작업", ["MCT 가공", "건드릴 가공", "판금 (BSTM)"]),
      ]),
    ja={'title': 'CNC旋盤加工（韓国・仁川）- ASTMエンジニアリング', 'desc': '韓国・仁川のASTMエンジニアリング。CNC旋盤でシャフト、ピン、ブッシュ、フランジなどの丸物部品を加工します。図面をお送りいただければお見積りします。', 'h1': 'CNC旋盤加工', 'crumb': 'CNC旋盤', 'lead': 'CNC旋盤でシャフト、ピン、ブッシュ、フランジなどの丸物部品を加工します。旋盤後のマシニング二次加工やガンドリル加工も自社工場で行います。', 'sections': [('主な加工品', ['シャフト、ピン、ブッシュ', 'フランジ、カバー、リング', '旋盤＋マシニング複合加工品']), ('関連作業', ['マシニング加工', 'ガンドリル加工', '板金（BSTM）'])]},
    en=dict(
      title="CNC Turning in Incheon, Korea - ASTM Engineering",
      desc="ASTM Engineering, Incheon, Korea. CNC turning of shafts, pins, bushings and flanges. Send us your drawing for a quote.",
      h1="CNC Turning", crumb="CNC Turning",
      lead="We turn shafts, pins, bushings, flanges and other round parts. Second operations on our machining centers and gun drilling are done in the same shop.",
      sections=[
        ("Typical parts", ["Shafts, pins, bushings", "Flanges, covers, rings", "Turned and milled parts"]),
        ("Also in house", ["CNC milling", "Gun drilling", "Sheet metal (BSTM)"]),
      ])),
  dict(slug="mct-machining", photos=["product/MCT/4.jpg", "product/MCT/3.jpg", "product/MCT/5.jpg", "product/MCT/8.jpg", "factory/cnc_row.jpg"],
    ko=dict(
      title="인천 MCT 가공 · 알루미늄 가공 - ASTM엔지니어링",
      desc="인천 남동공단 ASTM엔지니어링. 머시닝센터(MCT)로 알루미늄 하우징, 블록, 브래킷, 플레이트 가공. 도면 주시면 견적드립니다.",
      h1="MCT 가공", crumb="MCT",
      lead="머시닝센터로 하우징, 블록, 브래킷, 플레이트 등을 가공합니다. 알루미늄 하우징과 포켓·홀이 많은 판재 가공을 주로 하고 있습니다.",
      sections=[
        ("주요 가공품", ["알루미늄 하우징, 케이스", "블록, 브래킷, 베이스 플레이트", "포켓·홀 많은 판재", "자동화 장비 부품"]),
        ("연계 작업", ["CNC 선반 가공", "건드릴 가공", "판금 프레임·함체 (BSTM)"]),
      ]),
    ja={'title': 'マシニング加工・アルミ加工（韓国・仁川）- ASTMエンジニアリング', 'desc': '韓国・仁川のASTMエンジニアリング。マシニングセンタでアルミハウジング、ブロック、ブラケット、プレートを加工します。図面をお送りいただければお見積りします。', 'h1': 'マシニング加工', 'crumb': 'マシニング', 'lead': 'マシニングセンタでハウジング、ブロック、ブラケット、プレートなどを加工します。アルミハウジングやポケット・穴の多いプレートの加工が中心です。', 'sections': [('主な加工品', ['アルミハウジング、ケース', 'ブロック、ブラケット、ベースプレート', 'ポケット・穴の多いプレート', '自動化装置の部品']), ('関連作業', ['CNC旋盤加工', 'ガンドリル加工', '板金フレーム・筐体（BSTM）'])]},
    en=dict(
      title="CNC Milling in Incheon, Korea - ASTM Engineering",
      desc="ASTM Engineering, Incheon, Korea. CNC milling of aluminum housings, blocks, brackets and plates on machining centers. Send us your drawing for a quote.",
      h1="CNC Milling", crumb="CNC Milling",
      lead="We mill housings, blocks, brackets and plates on machining centers. A lot of our work is aluminum housings and plates with many pockets and holes.",
      sections=[
        ("Typical parts", ["Aluminum housings and cases", "Blocks, brackets, base plates", "Plates with many pockets and holes", "Parts for automation equipment"]),
        ("Also in house", ["CNC turning", "Gun drilling", "Sheet metal frames and enclosures (BSTM)"]),
      ])),
  dict(slug="gun-drilling", photos=["product/Gundrill/1.jpg", "product/Gundrill/2.jpg", "equipment/gundrill.jpg"],
    ko=dict(
      title="인천 건드릴 가공 · 심공 가공 - ASTM엔지니어링",
      desc="인천 남동공단 ASTM엔지니어링. 건드릴 전용기로 플레이트, 블록, 축의 길고 깊은 구멍 가공. 도면 주시면 견적드립니다.",
      h1="건드릴 가공", crumb="건드릴",
      lead="건드릴 전용기로 길고 깊은 구멍을 가공합니다. 긴 플레이트나 블록에 길이 방향으로 구멍 내는 작업을 하고 있고, 건드릴 후 MCT로 나머지 가공까지 합니다.",
      sections=[
        ("주요 가공품", ["긴 플레이트 길이 방향 홀", "블록, 축 심공", "건드릴 + MCT 복합 가공품"]),
        ("연계 작업", ["MCT 가공", "CNC 선반 가공", "판금 (BSTM)"]),
      ]),
    ja={'title': 'ガンドリル加工・深穴加工（韓国）- ASTMエンジニアリング', 'desc': '韓国・仁川のASTMエンジニアリング。ガンドリル専用機でプレート、ブロック、シャフトの長く深い穴を加工します。図面をお送りいただければお見積りします。', 'h1': 'ガンドリル加工', 'crumb': 'ガンドリル', 'lead': 'ガンドリル専用機で長く深い穴を加工します。長いプレートやブロックの長手方向の穴あけを行っており、ガンドリル後の残りの加工もマシニングで行います。', 'sections': [('主な加工品', ['長いプレートの長手方向の穴', 'ブロック、シャフトの深穴', 'ガンドリル＋マシニング複合加工品']), ('関連作業', ['マシニング加工', 'CNC旋盤加工', '板金（BSTM）'])]},
    en=dict(
      title="Gun Drilling in Korea - ASTM Engineering",
      desc="ASTM Engineering, Incheon, Korea. Deep hole gun drilling in plates, blocks and shafts. Send us your drawing for a quote.",
      h1="Gun Drilling", crumb="Gun Drilling",
      lead="We drill long, deep holes on a gun drilling machine, for example along the length of long plates and blocks. The rest of the part can be finished on our machining centers.",
      sections=[
        ("Typical parts", ["Long plates drilled end to end", "Deep holes in blocks and shafts", "Gun drilled and milled parts"]),
        ("Also in house", ["CNC milling", "CNC turning", "Sheet metal (BSTM)"]),
      ])),
  dict(slug="sheet-metal", photos=["factory/pega357.jpg", "equipment/amada-rg-100.png", "equipment/trumpf-laser_machine.png", "product/sheet-metal/wireless_repeater_enclosure.jpg"],
    ko=dict(
      title="인천 판금 가공 · 레이저 절단 · 절곡 - BSTM",
      desc="인천 남동공단 BSTM 판금. TRUMPF 레이저, AMADA PEGA-357 펀칭, AMADA RG-100 절곡, PEM 압입, 용접 로봇. 함체, 랙, 장비 프레임 제작.",
      h1="판금 가공 (BSTM)", crumb="판금",
      lead="BSTM에서 레이저 절단, 펀칭, 절곡, PEM 압입, 용접까지 판금 작업을 합니다. 함체, 랙, 장비 프레임 등을 도면대로 제작합니다.",
      sections=[
        ("보유 설비", ["TRUMPF 레이저", "AMADA PEGA-357 펀칭", "AMADA RG-100 절곡기", "PEM 프레스", "용접 로봇"]),
        ("제작 실적", ["서버 랙, 수냉 랙", "무선 중계기 함체", "무인 택배함", "자동화 장비 프레임", "압력 용기"]),
        ("연계 작업", ["CNC 선반, MCT, 건드릴 가공 (ASTM엔지니어링)"]),
      ]),
    ja={'title': '板金加工・レーザー切断・曲げ（韓国・仁川）- BSTM', 'desc': '韓国・仁川のBSTM板金。TRUMPFレーザー、AMADA PEGA-357パンチング、AMADA RG-100曲げ、PEM圧入、溶接ロボット。筐体、ラック、装置フレームを製作します。', 'h1': '板金加工（BSTM）', 'crumb': '板金', 'lead': 'BSTMではレーザー切断、パンチング、曲げ、PEM圧入、溶接まで板金作業を行います。筐体、ラック、装置フレームなどを図面どおりに製作します。', 'sections': [('保有設備', ['TRUMPFレーザー', 'AMADA PEGA-357 パンチング', 'AMADA RG-100 ベンダー', 'PEMプレス', '溶接ロボット']), ('製作実績', ['サーバーラック、水冷ラック', '無線中継器の筐体', '宅配ロッカー', '自動化装置のフレーム', '圧力容器']), ('関連作業', ['CNC旋盤、マシニング、ガンドリル加工（ASTMエンジニアリング）'])]},
    en=dict(
      title="Sheet Metal Fabrication in Korea - BSTM",
      desc="BSTM Sheet Metal, Incheon, Korea. TRUMPF laser cutting, AMADA PEGA-357 punching, AMADA RG-100 bending, PEM insertion, robotic welding. Enclosures, racks, machine frames.",
      h1="Sheet Metal (BSTM)", crumb="Sheet Metal",
      lead="BSTM does laser cutting, punching, bending, PEM insertion and welding. We build enclosures, racks and machine frames to drawing.",
      sections=[
        ("Equipment", ["TRUMPF laser", "AMADA PEGA-357 punch", "AMADA RG-100 press brake", "PEM press", "Welding robot"]),
        ("Past work", ["Server racks, liquid cooling racks", "Wireless repeater enclosures", "Parcel lockers", "Automation machine frames", "Pressure vessels"]),
        ("Also in house", ["CNC turning, milling, gun drilling (ASTM Engineering)"]),
      ])),
  dict(slug="machining-and-sheet-metal", photos=["product/MCT/automation_equipment.png", "product/sheet-metal/automation_machine_frame.png", "product/sheet-metal/server_rack.jpg", "factory/floor.jpg"],
    ko=dict(
      title="가공 · 판금 일괄 제작 - ASTM엔지니어링 · BSTM",
      desc="인천 남동공단 ASTM엔지니어링(가공)과 BSTM(판금). 장비 프레임, 랙, 함체처럼 가공품과 판금품이 같이 들어가는 제품을 일괄 제작합니다.",
      h1="가공 · 판금 일괄 제작", crumb="일괄 제작",
      lead="가공품과 판금품이 같이 들어가는 장비는 ASTM(가공)과 BSTM(판금)에서 같이 제작합니다. 같은 곳에서 만들기 때문에 조립 맞춤을 바로 확인하고 함께 납품합니다.",
      sections=[
        ("제작 실적", ["자동화 장비 프레임 및 부품", "서버 랙, 수냉 랙", "통신 장비 함체"]),
        ("작업 범위", ["CNC 선반, MCT, 건드릴", "레이저, 펀칭, 절곡, PEM 압입, 용접", "조립 확인 후 일괄 납품"]),
      ]),
    ja={'title': '加工・板金の一括製作 - ASTMエンジニアリング・BSTM', 'desc': '韓国・仁川のASTMエンジニアリング（機械加工）とBSTM（板金）。装置フレーム、ラック、筐体など、加工品と板金品の両方が入る製品を一括で製作します。', 'h1': '加工・板金の一括製作', 'crumb': '一括製作', 'lead': '加工品と板金品の両方が入る装置は、ASTM（機械加工）とBSTM（板金）で一緒に製作します。同じ場所で作るので、組み付けの確認をしてからまとめて納品します。', 'sections': [('製作実績', ['自動化装置のフレームと部品', 'サーバーラック、水冷ラック', '通信機器の筐体']), ('作業範囲', ['CNC旋盤、マシニング、ガンドリル', 'レーザー、パンチング、曲げ、PEM圧入、溶接', '組み付け確認後に一括納品'])]},
    en=dict(
      title="Machining and Sheet Metal from One Shop - ASTM Engineering · BSTM",
      desc="ASTM Engineering (machining) and BSTM (sheet metal), Incheon, Korea. Machine frames, racks and enclosures with both machined and sheet metal parts, made and shipped together.",
      h1="Machining + Sheet Metal", crumb="Machining + Sheet Metal",
      lead="When a machine needs both machined and sheet metal parts, ASTM (machining) and BSTM (sheet metal) make them together. Because it is the same place, we check the fit before shipping and send everything at once.",
      sections=[
        ("Past work", ["Automation machine frames and parts", "Server racks, liquid cooling racks", "Telecom enclosures"]),
        ("Scope", ["CNC turning, milling, gun drilling", "Laser cutting, punching, bending, PEM, welding", "Fit check, then one shipment"]),
      ])),
]

NAV = {
  "ko": dict(hub="가공 분야", hub_title="가공 분야 - ASTM엔지니어링 · BSTM", hub_desc="인천 남동공단 ASTM엔지니어링·BSTM. CNC 선반, MCT, 건드릴, 판금, 가공·판금 일괄 제작.", hub_lead="ASTM엔지니어링(가공)과 BSTM(판금)에서 하는 작업입니다.", more="자세히 보기", home="홈", product="제품", others="다른 작업", quote_h="견적 문의",
             quote_steps=["도면(PDF, DWG, STEP 등), 수량, 납기를 메일로 보내 주시면 검토 후 견적드립니다."],
             quote_btn="견적 문의하기", mail="메일", phone="전화", other_lang="English", inlang="ko"),
  "en": dict(hub="Services", hub_title="Services - ASTM Engineering · BSTM", hub_desc="ASTM Engineering and BSTM, Incheon, Korea. CNC turning, CNC milling, gun drilling, sheet metal, machining and sheet metal together.", hub_lead="What we do at ASTM Engineering (machining) and BSTM (sheet metal).", more="See more", home="Home", product="Products", others="Other services", quote_h="Request a quote",
             quote_steps=["Email us your drawing (PDF, DWG, STEP etc.), quantity and delivery date. We will check it and send a quote."],
             quote_btn="Request a quote", mail="Email", phone="Phone", other_lang="한국어", inlang="en"),
  "ja": dict(hub="加工分野", hub_title="加工分野 - ASTMエンジニアリング・BSTM", hub_desc="韓国・仁川のASTMエンジニアリング・BSTM。CNC旋盤、マシニング、ガンドリル、板金、加工・板金の一括製作。", hub_lead="ASTMエンジニアリング（機械加工）とBSTM（板金）で行っている作業です。", more="詳しく見る", home="ホーム", product="製品", others="その他の作業", quote_h="お見積り",
             quote_steps=["図面（PDF、DWG、STEPなど）、数量、納期をメールでお送りください。確認のうえお見積りします。"],
             quote_btn="お見積り依頼", mail="メール", phone="電話", other_lang="", inlang="ja"),
}

CARD_TEXT = {  # 카드에 쓰는 짧은 설명
  "cnc-turning": ("축, 핀, 부싱, 플랜지", "Shafts, pins, bushings, flanges", "シャフト、ピン、ブッシュ、フランジ"),
  "mct-machining": ("알루미늄 하우징, 블록, 브래킷", "Aluminum housings, blocks, brackets", "アルミハウジング、ブロック、ブラケット"),
  "gun-drilling": ("길고 깊은 구멍", "Long, deep holes", "長く深い穴"),
  "sheet-metal": ("레이저, 펀칭, 절곡, 용접", "Laser, punching, bending, welding", "レーザー、パンチング、曲げ、溶接"),
  "machining-and-sheet-metal": ("장비 프레임, 랙, 함체", "Machine frames, racks, enclosures", "装置フレーム、ラック、筐体"),
}

def url(slug, lang):
    return f"{slug}.html" if lang == "ko" else f"{slug}-{lang}.html"

def esc(s): return html.escape(s, quote=True)

def cards(lang, exclude=None):
    """가공 분야 사진 카드 (홈·제품·분야 안내 페이지에서 같이 씀)"""
    out = []
    for q in PAGES:
        if q["slug"] == exclude: continue
        name = q[lang]["h1"]; sub = CARD_TEXT[q["slug"]][{"ko": 0, "en": 1, "ja": 2}[lang]]
        out.append(f"""          <div class="col-6 col-md-4 col-lg">
            <a class="svc-tile" href="{url(q['slug'], lang)}">
              <span class="svc-tile-img"><img src="assets/img/{q['photos'][0]}" alt="{esc(name)}" loading="lazy"></span>
              <span class="svc-tile-body"><strong>{esc(name)}</strong><small>{esc(sub)}</small><em>{esc(NAV[lang]['more'])} &rsaquo;</em></span>
            </a>
          </div>""")
    return '        <div class="row g-3 svc-tiles">\n' + "\n".join(out) + "\n        </div>"

NAV_OLD = '<li><a href="product.html" data-i18n="nav.product">'
def nav_with_services(s, lang):
    link = f'<li><a href="{url("services", lang)}" data-i18n="nav.services">{ {"ko": "가공 분야", "en": "Services", "ja": "加工分野"}[lang] }</a></li>\n          '
    if 'data-i18n="nav.services">' in s.split('<nav id="navbar"', 1)[-1].split("</nav>", 1)[0]: return s
    return s.replace(NAV_OLD, link + NAV_OLD, 1)

def page_head(lang, title, desc, me, ko_u, en_u, og_img, ld):
    return f"""<!DOCTYPE html>
<html lang="{lang}">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>{esc(title)}</title>
  <meta content="{esc(desc)}" name="description">
  <link rel="canonical" href="{SITE}{me}">
  <link rel="alternate" hreflang="ko" href="{ko_u}">
  <link rel="alternate" hreflang="en" href="{en_u}">
  <link rel="alternate" hreflang="ja" href="{ko_u[:-5]}-ja.html">
  <link rel="alternate" hreflang="x-default" href="{en_u}">
  <meta name="astm-page-lang" content="{lang}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ASTM엔지니어링 · BSTM">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{SITE}{me}">
  <meta property="og:image" content="{og_img}">

{head_assets}  <link href="assets/css/service.css?v=20261116" rel="stylesheet">

  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>

"""

def crumbs(lang, h1, items):
    lis = "\n".join(f'            <li><a href="{u}">{esc(n)}</a></li>' if u else f"            <li>{esc(n)}</li>" for n, u in items)
    return f"""    <div class="breadcrumbs">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="svc-h1">{esc(h1)}</h1>
          <ol>
{lis}
          </ol>
        </div>
      </div>
    </div><!-- End Breadcrumbs -->
"""

def quote_box(lang):
    n = NAV[lang]
    steps = " ".join(esc(s) for s in n["quote_steps"])
    return f"""        <div class="svc-quote">
          <h2>{esc(n['quote_h'])}</h2>
          <p>{steps}</p>
          <p class="svc-contact">{esc(n['mail'])}: <a href="mailto:sskim@astm-eng.com">sskim@astm-eng.com</a> · {esc(n['phone'])}: <a href="tel:+821090772445">{'010-9077-2445' if lang == 'ko' else '+82 10 9077 2445'}</a></p>
          <a class="svc-btn" href="contact.html#contact-form">{esc(n['quote_btn'])}</a>
        </div>"""

def provider():
    return {"@type": "LocalBusiness", "name": "ASTM엔지니어링 (ASTM Engineering)",
            "alternateName": ["ASTM Engineering", "BSTM Sheet Metal"], "url": SITE,
            "email": "sskim@astm-eng.com", "address": ADDR}

def build(p, lang):
    c = p[lang]; n = NAV[lang]; other = "en" if lang == "ko" else "ko"
    me, alt = url(p["slug"], lang), url(p["slug"], other)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "name": c["h1"], "serviceType": c["crumb"], "description": c["desc"], "url": SITE + me,
         "areaServed": "Worldwide", "provider": provider()},
        {"@type": "BreadcrumbList", "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": n["home"], "item": SITE},
          {"@type": "ListItem", "position": 2, "name": n["hub"], "item": SITE + url("services", lang)},
          {"@type": "ListItem", "position": 3, "name": c["crumb"], "item": SITE + me}]}]}
    head = page_head(lang, c["title"], c["desc"], me, SITE + url(p["slug"], "ko"), SITE + url(p["slug"], "en"),
                     SITE + "assets/img/" + p["photos"][0], ld)
    main_ph, rest = p["photos"][0], p["photos"][1:4]
    photos = "\n".join(
      f'          <div class="col-4"><a href="assets/img/{ph}" class="glightbox svc-photo"><img src="assets/img/{ph}" alt="{esc(c["h1"])} - ASTM" loading="lazy"></a></div>'
      for ph in rest)
    secs = "\n".join(
      f"""          <div class="col-md-6 col-lg">
            <div class="svc-card">
              <h2>{esc(h)}</h2>
              <ul>
{chr(10).join(f'                <li>{esc(i)}</li>' for i in items)}
              </ul>
            </div>
          </div>""" for h, items in c["sections"])
    main = f"""  <main id="main">

{crumbs(lang, c['h1'], [(n['home'], 'index.html'), (n['hub'], url('services', lang)), (c['crumb'], None)])}
    <section class="svc">
      <div class="container">

        <div class="row g-4 align-items-center svc-top">
          <div class="col-lg-6">
            <a href="assets/img/{main_ph}" class="glightbox svc-photo svc-photo-main"><img src="assets/img/{main_ph}" alt="{esc(c['h1'])} - ASTM"></a>
          </div>
          <div class="col-lg-6">
            <p class="svc-lead">{esc(c['lead'])}</p>
            <a class="svc-btn" href="contact.html#contact-form">{esc(n['quote_btn'])}</a>
          </div>
        </div>

        <div class="row g-3 svc-photos">
{photos}
        </div>

        <div class="row g-4 svc-sections">
{secs}
        </div>

{quote_box(lang)}

        <div class="svc-others">
          <h2>{esc(n['others'])}</h2>
{cards(lang, exclude=p['slug'])}
        </div>

      </div>
    </section>

  </main><!-- End #main -->

"""
    return head + nav_with_services(body_top, lang) + main + footer + "</body>\n\n</html>\n"

def build_hub(lang):
    n = NAV[lang]; other = "en" if lang == "ko" else "ko"
    me, alt = url("services", lang), url("services", other)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "ItemList", "name": n["hub"], "itemListElement": [
          {"@type": "ListItem", "position": i + 1, "name": q[lang]["h1"], "url": SITE + url(q["slug"], lang)} for i, q in enumerate(PAGES)]},
        {"@type": "BreadcrumbList", "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": n["home"], "item": SITE},
          {"@type": "ListItem", "position": 2, "name": n["hub"], "item": SITE + me}]}]}
    head = page_head(lang, n["hub_title"], n["hub_desc"], me, SITE + url("services", "ko"), SITE + url("services", "en"),
                     SITE + "assets/img/factory/floor.jpg", ld)
    main = f"""  <main id="main">

{crumbs(lang, n['hub'], [(n['home'], 'index.html'), (n['hub'], None)])}
    <section class="svc">
      <div class="container">
        <p class="svc-lead">{esc(n['hub_lead'])}</p>
{cards(lang)}
{quote_box(lang)}
      </div>
    </section>

  </main><!-- End #main -->

"""
    return head + nav_with_services(body_top, lang) + main + footer + "</body>\n\n</html>\n"

if __name__ == "__main__":
    for p_ in PAGES:
        for lang in ("ko", "en", "ja"):
            (ROOT / url(p_["slug"], lang)).write_text(build(p_, lang), encoding="utf-8")
    for lang in ("ko", "en", "ja"):
        (ROOT / url("services", lang)).write_text(build_hub(lang), encoding="utf-8")
    # 다른 페이지: 메뉴에 '가공 분야' 넣기, 홈·제품의 카드 영역 갈아 끼우기
    for f in ["index.html", "about.html", "product.html", "equipment.html", "research.html", "contact.html"]:
        fp = ROOT / f; s = fp.read_text(encoding="utf-8")
        s = nav_with_services(s, "ko")
        both = cards("ko").replace('class="row g-3 svc-tiles"', 'class="row g-3 svc-tiles only-ko"', 1) + "\n" + \
               cards("en").replace('class="row g-3 svc-tiles"', 'class="row g-3 svc-tiles only-en"', 1) + "\n" + \
               cards("ja").replace('class="row g-3 svc-tiles"', 'class="row g-3 svc-tiles only-ja"', 1)
        s = re.sub(r"( *<!-- svc-cards:start -->\n).*?( *<!-- svc-cards:end -->)",
                   lambda m: m.group(1) + both + "\n" + m.group(2), s, flags=re.S)
        s = s.replace('service.css?v=20261115', 'service.css?v=20261116')
        fp.write_text(s, encoding="utf-8")
    print("done")
