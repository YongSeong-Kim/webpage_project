/**
 * Simple i18n (language pack) for static HTML
 * - Stores language in localStorage key: astm_lang
 * - Applies translations to elements with [data-i18n]
 * - Optional: [data-i18n-attr="placeholder,title,aria-label"] to translate attributes
 */
(function () {
  "use strict";

  const STORAGE_KEY = "astm_lang";
  const SUPPORTED = ["en", "ko", "ja"];

  // Language packs (can be moved to JSON fetch later; kept inline to work on file://)
  const DICT = {
    en: {
      // 자동화 섹션 (2026-10-22)
      "section.automation": "Automation",
      "auto.headline": "20 years of machining. Now we add automatic part feeding to CNC machines.",
      "auto.lead": "For 20 years we have made machined and sheet metal parts in Incheon, Korea. Now we are adding a drawer-type automatic part feeder for CNC lathes and machining centers: a cobot takes raw parts from the drawers, loads the machine and puts finished parts back, so the machine keeps running without an operator standing next to it.",
      "auto.video.caption": "Automatic part feeder and CNC cell concept, virtual factory simulation (2 min)",
      "auto.pf.title": "Drawer-type automatic part feeder",
      "auto.pf.b1": "Raw parts and finished parts sit in stacked drawers right next to the machine.",
      "auto.pf.b2": "A cobot loads the chuck and puts each finished part back in the drawer.",
      "auto.pf.b3": "When a drawer is finished, the next one slides out automatically.",
      "auto.pf.b4": "Works with CNC lathes and machining centers, and with different robot brands.",
      "auto.pf.note": "We are a machine shop ourselves, and we plan each cell in a virtual factory with real dimensions before installing.",
      "auto.pf.ask": "Ask about the part feeder",
      "auto.cards.title": "How it runs in the cell",
      "auto.c1.title": "Robot loading",
      "auto.c1.text": "The robot opens the door, loads the chuck and starts the cycle.",
      "auto.c2.title": "Automatic drawer change",
      "auto.c2.text": "The finished drawer goes in and the next one slides out, with no operator needed.",
      "auto.c3.title": "Any robot brand",
      "auto.c3.text": "The same feeder and process run with FAIRINO, Universal Robots and Doosan Robotics arms.",
      "auto.c4.title": "Live data at the machine",
      "auto.c4.text": "Each machine shows its step, output, cycle time and the parts left in the drawers.",
      "auto.c5.title": "Operator on call",
      "auto.c5.text": "When a cell alarms, the operator is called, resets it, and the cell restarts.",
      "auto.c6.title": "Live data in the office",
      "auto.c6.text": "Output, cycle time, availability and alarms for every cell on one screen.",
      "auto.roadmap.title": "Where we are going",
      "auto.s1.when": "20 years",
      "auto.s1.status": "Today",
      "auto.s1.title": "Precision parts",
      "auto.s1.text": "CNC turning, machining centers and gun drilling at ASTM, sheet metal at BSTM, for customers in Japan, the US and the UK.",
      "auto.s2.when": "Adding",
      "auto.s2.status": "In preparation",
      "auto.s2.title": "Automatic part feeder",
      "auto.s2.text": "A drawer-type part feeder for CNC lathes and machining centers, used with a cobot.",
      "auto.s3.when": "Next",
      "auto.s3.status": "Planned",
      "auto.s3.title": "Full CNC automation cells",
      "auto.s3.text": "Robots, AMR logistics and live monitoring for whole cells, as in the simulation above.",
      "auto.cta.title": "Want longer unattended runs on your CNC machines?",
      "auto.cta.body": "Tell us about your machines and parts. We will tell you honestly whether an automatic part feeder fits.",
      "auto.cta.talk": "Ask about the part feeder",
      "auto.cta.quote": "Request a parts quote",
      "ui.language": "Language",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.product": "Product",
      "nav.research": "R&D",
      "nav.equipment": "Equipment",
      "nav.contact": "Contact",

      "section.about_us": "About Us",
      "section.products": "Products",
      "section.research": "Research & Development",
      "section.equipments": "Equipments",
      "section.clients": "Clients",

      "hero.welcome": "Welcome to ASTM & BSTM",
      // NOTE: Keep this as a single quoted string. Use <br> for line breaks (index.html uses data-i18n-html).
      "hero.subtitle":
        "Our company specializes in metal manufacturing, meeting diverse customer demands through advanced production and processing.<br><strong>ASTM Engineering</strong> delivers precision CNC machining and CNC turning solutions.<br><strong>BSTM Sheet Metal</strong> provides sheet metal fabrication, welding, and painting.",
      "cta.quote": "Contact Us",
      "hero2.title": "Building parts with our customers for 20 years",
      "hero2.subtitle":
        "From CNC turning, machining center milling and gun drilling to laser cutting, bending and welding.<br>We make machined parts and sheet metal parts in one place, so schedules and quality are managed together.<br>With 20 years of experience, we build every part with care, including the first one you send us.",
      "hero.read_more": "Read More",

      "index.about.vision":
        "Our vision is to become a leader in innovation and quality in the global manufacturing industry. We aim to gain our customers' trust through a customer-centric approach and cutting-edge technology, leading industrial innovation, and pursuing sustainable growth.",
      "index.about.b1": "Maximize Customer Satisfaction",
      "index.about.b2": "Improve Production Efficiency",
      "index.about.b3": "Innovative Product Development",

      "index.equip.cnc": "For CNC",
      "index.equip.machining": "For Machining",
      "index.equip.gundrill": "For Gundrill",
      "index.equip.pega357": "AMADA PEGA-357",
      "index.equip.rg100": "AMADA RG-100",

      "footer.address": "Address",
      "footer.address_value": "140-25, Neungheodae-ro 625beon-gil, Namdong-gu<br>Incheon, Republic of Korea",
      "footer.contact": "Contact",
      "footer.opening_hours": "Opening Hours",
      "footer.follow_us": "Follow Us",
      "footer.phone": "Phone",
      "footer.email": "Email",
      "footer.mon_sun": "Mon-Sun",
      "footer.rights": "All Rights Reserved",

      "breadcrumb.about": "About",
      "breadcrumb.product": "Product",
      "breadcrumb.research": "Research & Development",
      "breadcrumb.equipment": "Equipment",
      "breadcrumb.contact": "Contact",

      "research.intro.title": "Precision Gear R&D",
      "research.intro.body":
        "We design and develop precision gear and reducer assemblies—harmonic, cycloid, and planetary—to meet demanding industrial applications.",
      "research.filter.harmonic": "Harmonic Gear",
      "research.filter.cycloid": "Cycloid Gear",
      "research.filter.planetary": "Planetary Gear",
      "research.desc.harmonic":
        "<p>A harmonic gear creates reduction through the interaction of a wave generator, flexspline, and circular spline. Even in a small envelope, it can deliver a high reduction ratio with very low backlash.</p>" +
        "<p>That combination makes it a strong fit for robot joints, CNC axes, and other precision actuators where compact size and positioning accuracy matter together. With proper preload and lubrication, motion stays smooth and highly repeatable.</p>" +
        "<p>Our R&D focuses on stiffness, duty life, and interface design—so the reducer is not only accurate on paper, but practical to assemble, seal, and manufacture for industrial use.</p>",
      "research.desc.cycloid":
        "<p>A cycloid reducer transmits motion through cycloidal discs and a pin-roller mechanism. Load is shared across many contact points, which gives the drive strong shock resistance and stable torque capacity.</p>" +
        "<p>Its short axial length is useful in tight layouts, while controlled backlash supports accurate indexing and reverse operation. Typical applications include automation arms, heavy-duty actuators, and intermittent high-torque systems.</p>" +
        "<p>We refine disc profiles, pin arrangements, materials, and housing design together—balancing durability, efficiency, and long service life under demanding duty cycles.</p>",
      "research.desc.planetary":
        "<p>A planetary gear train places a sun gear, planet gears, and ring gear on a common axis. Because several planets share the load, high torque can be delivered from a relatively small diameter.</p>" +
        "<p>Coaxial input and output simplify motor alignment, and staged combinations allow a wide range of reduction ratios. It remains a proven choice for gearmotors, conveyors, and compact industrial drive modules.</p>" +
        "<p>Our development work centers on ratio, backlash, and bearing/carrier stiffness—keeping production quality consistent while matching each design to its continuous and peak load requirements.</p>",

      "about.intro.title": "About",
      "about.intro.body":
        "Our company is a manufacturing firm that specializes in meeting various customer demands by producing and processing parts for various applications. We utilize a range of techniques, including sheet metal fabrication and machining, to create high-quality components and provide customized solutions for our customers' projects. With our expertise and know-how, we establish efficient and precise production processes to support our customers' business success. We are committed to quality and innovation, driving continuous growth and development in the manufacturing sector.",
      "about.quality.title": "Quality Policy",
      "about.quality.1.title": "Customer-Centric Quality",
      "about.quality.1.body":
        "Our company places the customer at the forefront of our operations, striving to manufacture products that meet and exceed their expectations. Quality is one of our core values.",
      "about.quality.2.title": "Adherence to Stringent Quality Standards",
      "about.quality.2.body":
        "All products undergo rigorous testing and inspection to comply with strict quality standards and regulations. This ensures the delivery of reliable products to our customers and prevents unnecessary defects.",
      "about.quality.3.title": "Continuous Quality Improvement",
      "about.quality.3.body":
        "We are committed to the continuous improvement of quality. We promote research and development to enhance products and processes, leveraging customer feedback to enhance quality.",

      "product.filter.all": "All",
      "product.filter.astm": "ASTM",
      "product.filter.bstm": "BSTM",
      "product.category.sheet_metal": "Sheet Metal",

      "contact.title": "Contact",
      "contact.our_address": "Our Address",
      "contact.address_line": "140-25, Neungheodae-ro 625beon-gil, Namdong-gu, Incheon, Republic of Korea",
      "contact.email_us": "Email Us",
      "contact.call_us": "Call Us",
      "contact.opening_hours": "Opening Hours",
      "contact.form.name": "Your Name",
      "contact.form.email": "Your Email",
      "contact.form.subject": "Subject",
      "contact.form.message": "Message",
      "contact.form.loading": "Loading",
      "contact.form.sent": "Your message has been sent. Thank you!",
      "contact.form.captcha": "Please complete the captcha.",
      "contact.form.send": "Send Message",
    },
    ko: {
      // 자동화 섹션 (2026-10-22)
      "section.automation": "자동화",
      "auto.headline": "가공 20년, 이제 CNC에 자동 소재 공급을 더합니다",
      "auto.lead": "인천에서 20년 동안 가공·판금 부품을 만들어 왔습니다. 여기에 CNC 선반·머시닝센터용 서랍식 자동 소재 공급 장치를 더합니다. 협동로봇이 서랍에서 소재를 꺼내 기계에 넣고 완성품을 다시 서랍에 넣어, 작업자가 옆에 없어도 기계가 계속 돌아갑니다.",
      "auto.video.caption": "자동 소재 공급 장치와 CNC 자동화 셀 구상, 가상 공장 시뮬레이션 (2분)",
      "auto.pf.title": "서랍식 자동 소재 공급 장치",
      "auto.pf.b1": "소재와 완성품을 기계 바로 옆 여러 층 서랍에 담습니다.",
      "auto.pf.b2": "협동로봇이 척에 소재를 물리고, 완성품은 다시 서랍에 넣습니다.",
      "auto.pf.b3": "서랍 하나를 다 쓰면 다음 서랍이 자동으로 나옵니다.",
      "auto.pf.b4": "CNC 선반·머시닝센터 모두, 여러 회사 로봇과 함께 쓸 수 있습니다.",
      "auto.pf.note": "저희도 매일 CNC를 돌리는 가공 공장입니다. 설치 전에 실제 치수로 만든 가상 공장에서 셀을 먼저 확인합니다.",
      "auto.pf.ask": "자동 소재 공급 장치 문의",
      "auto.cards.title": "셀에서 이렇게 돌아갑니다",
      "auto.c1.title": "로봇 투입",
      "auto.c1.text": "로봇이 문을 열고 척에 소재를 물린 뒤 가공을 시작합니다.",
      "auto.c2.title": "서랍 자동 교체",
      "auto.c2.text": "다 쓴 서랍이 들어가고 다음 서랍이 나옵니다. 작업자가 필요 없습니다.",
      "auto.c3.title": "어느 로봇이든",
      "auto.c3.text": "같은 장치와 공정을 FAIRINO, Universal Robots, 두산로보틱스 로봇으로 돌립니다.",
      "auto.c4.title": "기계 위 실시간 현황",
      "auto.c4.text": "기계마다 공정 단계, 생산 수, 사이클 타임, 서랍에 남은 소재를 보여 줍니다.",
      "auto.c5.title": "작업자 호출",
      "auto.c5.text": "셀에 알람이 나면 작업자를 부르고, 해제하면 셀이 다시 돌아갑니다.",
      "auto.c6.title": "사무실에서 실시간 확인",
      "auto.c6.text": "생산 수, 사이클 타임, 가동률, 알람을 셀마다 한 화면에서 봅니다.",
      "auto.roadmap.title": "앞으로의 계획",
      "auto.s1.when": "20년",
      "auto.s1.status": "지금",
      "auto.s1.title": "정밀 부품",
      "auto.s1.text": "ASTM은 CNC 선반·머시닝센터·건드릴, BSTM은 판금. 일본·미국·영국 고객에게 납품합니다.",
      "auto.s2.when": "더하는 것",
      "auto.s2.status": "준비 중",
      "auto.s2.title": "자동 소재 공급 장치",
      "auto.s2.text": "협동로봇과 함께 쓰는 CNC 선반·머시닝센터용 서랍식 자동 소재 공급 장치.",
      "auto.s3.when": "다음",
      "auto.s3.status": "계획",
      "auto.s3.title": "CNC 자동화 셀 전체",
      "auto.s3.text": "위 시뮬레이션처럼 로봇, AMR 운반, 실시간 모니터링까지 갖춘 셀 전체.",
      "auto.cta.title": "CNC를 사람 없이 더 오래 돌리고 싶으신가요?",
      "auto.cta.body": "기계와 부품을 알려 주시면, 자동 소재 공급 장치가 맞는지 솔직하게 말씀드립니다.",
      "auto.cta.talk": "자동 소재 공급 장치 문의",
      "auto.cta.quote": "가공 견적 문의",
      "ui.language": "언어",
      "nav.home": "홈",
      "nav.about": "회사소개",
      "nav.product": "제품",
      "nav.research": "연구개발",
      "nav.equipment": "설비",
      "nav.contact": "문의",

      "section.about_us": "회사 소개",
      "section.products": "제품",
      "section.research": "연구개발",
      "section.equipments": "설비",
      "section.clients": "고객사",

      "hero.welcome": "ASTM & BSTM에 오신 것을 환영합니다",
      "hero.subtitle":
        "당사는 금속 생산·가공 전문 기업으로, 첨단 생산 및 가공 기술을 통해 다양한 고객 요구에 대응합니다.<br><strong>ASTM Engineering</strong>은 정밀 CNC 머시닝 및 CNC 선반(턴닝) 솔루션을 제공합니다.<br><strong>BSTM Sheet Metal</strong>은 판금 가공, 용접, 도장을 제공합니다.",
      "cta.quote": "문의하기",
      "hero2.title": "20년 동안 고객과 함께 만들어 왔습니다",
      "hero2.subtitle":
        "CNC 선반, 머시닝센터, 건드릴 가공부터 레이저 절단, 절곡, 용접까지.<br>가공 부품과 판금 부품을 한 곳에서 만들기 때문에 일정과 품질을 함께 챙깁니다.<br>20년 동안 쌓아 온 경험으로, 처음 맡기시는 부품도 꼼꼼하게 만듭니다.",
      "hero.read_more": "더 보기",

      "index.about.vision":
        "당사의 비전은 글로벌 제조 산업에서 혁신과 품질을 선도하는 기업이 되는 것입니다. 고객 중심의 접근과 첨단 기술을 바탕으로 신뢰를 쌓고, 산업 혁신을 이끌며 지속 가능한 성장을 추구합니다.",
      "index.about.b1": "고객 만족 극대화",
      "index.about.b2": "생산 효율 향상",
      "index.about.b3": "혁신적인 제품 개발",

      "index.equip.cnc": "CNC용",
      "index.equip.machining": "가공용",
      "index.equip.gundrill": "건드릴용",
      "index.equip.pega357": "AMADA PEGA-357",
      "index.equip.rg100": "AMADA RG-100",

      "footer.address": "주소",
      "footer.address_value": "대한민국 인천광역시 남동구<br>능허대로625번길 140-25",
      "footer.contact": "연락처",
      "footer.opening_hours": "운영 시간",
      "footer.follow_us": "소셜",
      "footer.phone": "전화",
      "footer.email": "이메일",
      "footer.mon_sun": "월-일",
      "footer.rights": "모든 권리 보유",

      "breadcrumb.about": "회사소개",
      "breadcrumb.product": "제품",
      "breadcrumb.research": "연구개발",
      "breadcrumb.equipment": "설비",
      "breadcrumb.contact": "문의",

      "research.intro.title": "정밀 기어 연구개발",
      "research.intro.body":
        "하모닉, 사이클로이드, 유성 기어 등 정밀 기어·감속기 구조를 설계하고 개발하여 다양한 산업 요구에 대응합니다.",
      "research.filter.harmonic": "하모닉 기어",
      "research.filter.cycloid": "사이클로이드 기어",
      "research.filter.planetary": "유성 기어",
      "research.desc.harmonic":
        "<p>하모닉 기어는 웨이브 제너레이터, 플렉스스플라인, 서큘러 스플라인의 상호작용으로 감속을 만듭니다. 작은 공간에서도 높은 감속비와 매우 낮은 백래시를 동시에 확보할 수 있는 구조입니다.</p>" +
        "<p>그래서 로봇 관절, CNC 축처럼 소형화와 위치 정밀도가 함께 중요한 구동부에 잘 맞습니다. 예압과 윤활만 적절하면 부드럽고 반복성 높은 운전을 기대할 수 있습니다.</p>" +
        "<p>당사 R&D는 강성, 수명, 조립·실링 인터페이스까지 함께 다룹니다. 도면상 정밀도뿐 아니라, 실제 생산과 현장 운용까지 고려한 감속기 구성을 목표로 합니다.</p>",
      "research.desc.cycloid":
        "<p>사이클로이드 감속기는 사이클로이드 디스크와 핀·롤러 기구로 동력을 전달합니다. 여러 접촉점이 하중을 나누어 받기 때문에 충격에 강하고 토크 전달이 안정적입니다.</p>" +
        "<p>축방향 길이가 짧아 컴팩트한 설비에 넣기 쉽고, 백래시를 작게 관리하면 정확한 역전·인덱싱 운전에도 유리합니다. 자동화 암이나 단속 고토크 구동부에 자주 쓰입니다.</p>" +
        "<p>디스크 형상, 핀 배치, 소재와 하우징을 함께 다듬어 내구성과 효율, 긴 수명의 균형을 맞추는 방향으로 연구합니다.</p>",
      "research.desc.planetary":
        "<p>유성 기어는 선 기어, 유성 기어, 링 기어를 같은 축 위에 배치한 구조입니다. 여러 유성 기어가 하중을 나눠 받기 때문에 비교적 작은 직경에서도 높은 토크를 낼 수 있습니다.</p>" +
        "<p>입·출력이 동심이라 모터 연결이 쉽고, 단수 조합으로 감속비 폭도 넓습니다. 기어모터, 컨베이어, 산업용 드라이브 모듈에서 검증된 방식입니다.</p>" +
        "<p>당사는 감속비와 백래시, 캐리어·베어링 강성을 중심으로 설계합니다. 양산 품질을 유지하면서도 연속·피크 부하 조건에 맞는 실용적인 유성 감속기를 지향합니다.</p>",

      "about.intro.title": "회사소개",
      "about.intro.body":
        "당사는 다양한 산업용 부품을 생산·가공하여 고객의 요구에 맞는 솔루션을 제공하는 제조 기업입니다. 판금 및 정밀 가공 등 다양한 공정을 활용해 고품질 부품을 제작하며, 축적된 기술과 노하우로 효율적이고 정밀한 생산 공정을 구축하여 고객 비즈니스의 성공을 지원합니다. 품질과 혁신을 최우선 가치로 삼아 지속적인 성장과 발전을 이어가고 있습니다.",
      "about.quality.title": "품질 방침",
      "about.quality.1.title": "고객 중심의 품질",
      "about.quality.1.body":
        "고객을 최우선으로 두고 기대를 충족하고 뛰어넘는 제품을 만들기 위해 노력합니다. 품질은 당사의 핵심 가치 중 하나입니다.",
      "about.quality.2.title": "엄격한 품질 기준 준수",
      "about.quality.2.body":
        "모든 제품은 엄격한 품질 기준과 규정을 준수하기 위해 철저한 시험 및 검사를 거칩니다. 이를 통해 신뢰할 수 있는 제품을 제공하고 불필요한 결함을 예방합니다.",
      "about.quality.3.title": "지속적인 품질 개선",
      "about.quality.3.body":
        "지속적인 품질 개선을 위해 연구개발을 추진하고, 고객 피드백을 반영하여 제품과 공정을 개선합니다.",

      "product.filter.all": "전체",
      "product.filter.astm": "ASTM",
      "product.filter.bstm": "BSTM",
      "product.category.sheet_metal": "판금",

      "contact.title": "문의",
      "contact.our_address": "주소",
      "contact.address_line": "대한민국 인천광역시 남동구 능허대로625번길 140-25",
      "contact.email_us": "이메일",
      "contact.call_us": "전화",
      "contact.opening_hours": "운영 시간",
      "contact.form.name": "이름",
      "contact.form.email": "이메일",
      "contact.form.subject": "제목",
      "contact.form.message": "내용",
      "contact.form.loading": "전송 중",
      "contact.form.sent": "메시지가 전송되었습니다. 감사합니다!",
      "contact.form.captcha": "자동 입력 방지(캡차)를 확인해 주세요.",
      "contact.form.send": "메시지 보내기",
    },
    ja: {
      // 자동화 섹션 (2026-10-22)
      "section.automation": "自動化",
      "auto.headline": "加工20年、CNCに自動素材供給をプラスします",
      "auto.lead": "仁川で20年間、切削加工部品と板金部品を作ってきました。そこに、CNC旋盤・マシニングセンタ用の引き出し式自動素材供給装置を加えます。協働ロボットが引き出しから素材を取り出して機械に投入し、完成品を引き出しに戻すため、作業者がそばにいなくても機械は動き続けます。",
      "auto.video.caption": "自動素材供給装置とCNC自動化セルの構想、仮想工場シミュレーション(2分)",
      "auto.pf.title": "引き出し式自動素材供給装置",
      "auto.pf.b1": "素材と完成品を、機械のすぐ横の多段引き出しに収めます。",
      "auto.pf.b2": "協働ロボットがチャックに素材を取り付け、完成品は引き出しに戻します。",
      "auto.pf.b3": "引き出しを使い終わると、次の引き出しが自動で出てきます。",
      "auto.pf.b4": "CNC旋盤・マシニングセンタのどちらにも、さまざまなメーカーのロボットと使えます。",
      "auto.pf.note": "私たちも毎日CNCを動かす加工工場です。設置前に、実寸の仮想工場でセルを確認します。",
      "auto.pf.ask": "自動素材供給装置のお問い合わせ",
      "auto.cards.title": "セルではこう動きます",
      "auto.c1.title": "ロボット投入",
      "auto.c1.text": "ロボットが扉を開け、チャックに素材を取り付けて加工を開始します。",
      "auto.c2.title": "引き出しの自動交換",
      "auto.c2.text": "使い終わった引き出しが戻り、次の引き出しが出てきます。作業者は不要です。",
      "auto.c3.title": "ロボットメーカーを問わず",
      "auto.c3.text": "同じ装置と工程を FAIRINO、Universal Robots、Doosan Robotics のロボットで動かします。",
      "auto.c4.title": "機械上のリアルタイム表示",
      "auto.c4.text": "機械ごとに工程、生産数、サイクルタイム、引き出しの残り素材を表示します。",
      "auto.c5.title": "作業者呼び出し",
      "auto.c5.text": "セルでアラームが出ると作業者を呼び、解除するとセルが再び動き出します。",
      "auto.c6.title": "事務所でリアルタイム確認",
      "auto.c6.text": "生産数、サイクルタイム、稼働率、アラームをセルごとに一画面で確認できます。",
      "auto.roadmap.title": "これからの計画",
      "auto.s1.when": "20年",
      "auto.s1.status": "現在",
      "auto.s1.title": "精密部品",
      "auto.s1.text": "ASTMはCNC旋盤・マシニングセンタ・ガンドリル、BSTMは板金。日本・米国・英国のお客様に納品しています。",
      "auto.s2.when": "追加",
      "auto.s2.status": "準備中",
      "auto.s2.title": "自動素材供給装置",
      "auto.s2.text": "協働ロボットと使う、CNC旋盤・マシニングセンタ用の引き出し式自動素材供給装置。",
      "auto.s3.when": "次",
      "auto.s3.status": "計画",
      "auto.s3.title": "CNC自動化セル全体",
      "auto.s3.text": "上のシミュレーションのように、ロボット、AMR搬送、リアルタイム監視までそろえたセル全体。",
      "auto.cta.title": "CNCを無人でもっと長く動かしたいですか?",
      "auto.cta.body": "機械と部品について教えてください。自動素材供給装置が合うかどうか、正直にお伝えします。",
      "auto.cta.talk": "自動素材供給装置のお問い合わせ",
      "auto.cta.quote": "加工の見積もり依頼",
      "ui.language": "言語",
      "nav.home": "ホーム",
      "nav.about": "会社紹介",
      "nav.product": "製品",
      "nav.research": "研究開発",
      "nav.equipment": "設備",
      "nav.contact": "お問い合わせ",

      "section.about_us": "会社概要",
      "section.products": "製品",
      "section.research": "研究開発",
      "section.equipments": "設備",
      "section.clients": "取引先",

      "hero.welcome": "ASTM & BSTMへようこそ",
      "hero.subtitle":
        "当社は金属製造の専門企業として、先進的な生産・加工により多様なお客様のニーズに対応します。<br><strong>ASTM Engineering</strong>は高精度のCNCマシニングおよびCNC旋盤ソリューションを提供します。<br><strong>BSTM Sheet Metal</strong>は板金加工、溶接、塗装を提供します。",
      "cta.quote": "お問い合わせ",
      "hero2.title": "20年間、お客様とともにものづくりを続けてきました",
      "hero2.subtitle":
        "CNC旋盤、マシニングセンタ、ガンドリル加工から、レーザー切断、曲げ、溶接まで。<br>切削部品と板金部品を一か所でつくるため、納期と品質をまとめて管理します。<br>20年の経験で、初めてご依頼いただく部品も丁寧におつくりします。",
      "hero.read_more": "もっと見る",

      "index.about.vision":
        "当社のビジョンは、世界の製造業において革新と品質をリードする企業になることです。顧客中心の姿勢と先端技術により信頼を獲得し、産業革新を推進しながら持続的な成長を目指します。",
      "index.about.b1": "顧客満足の最大化",
      "index.about.b2": "生産効率の向上",
      "index.about.b3": "革新的な製品開発",

      "index.equip.cnc": "CNC用",
      "index.equip.machining": "加工用",
      "index.equip.gundrill": "ガンドリル用",
      "index.equip.pega357": "AMADA PEGA-357",
      "index.equip.rg100": "AMADA RG-100",

      "footer.address": "住所",
      "footer.address_value": "大韓民国 仁川広域市 南洞区<br>能許大路625番ギル 140-25",
      "footer.contact": "連絡先",
      "footer.opening_hours": "営業時間",
      "footer.follow_us": "フォロー",
      "footer.phone": "電話",
      "footer.email": "メール",
      "footer.mon_sun": "月-日",
      "footer.rights": "無断転載を禁じます",

      "breadcrumb.about": "会社紹介",
      "breadcrumb.product": "製品",
      "breadcrumb.research": "研究開発",
      "breadcrumb.equipment": "設備",
      "breadcrumb.contact": "お問い合わせ",

      "research.intro.title": "精密ギアの研究開発",
      "research.intro.body":
        "ハーモニック、サイクロイド、プラネタリなど精密ギア・減速機の構造を設計・開発し、多様な産業ニーズに応えます。",
      "research.filter.harmonic": "ハーモニックギア",
      "research.filter.cycloid": "サイクロイドギア",
      "research.filter.planetary": "プラネタリギア",
      "research.desc.harmonic":
        "<p>ハーモニックギアは、ウェーブジェネレータ・フレクススプライン・サーキュラスプラインの相互作用で減速を生み出します。小さな空間でも高い減速比と極めて低いバックラッシを両立できる点が特長です。</p>" +
        "<p>そのため、ロボット関節やCNC軸のように、小型化と位置精度が同時に求められる駆動部に適しています。予圧と潤滑が適切なら、滑らかで繰り返し性の高い運転が期待できます。</p>" +
        "<p>当社のR&Dは剛性、寿命、組立・シール界面まで含めて検討します。図面の精度だけでなく、実際の生産と現場運用まで見据えた減速機構成を目指します。</p>",
      "research.desc.cycloid":
        "<p>サイクロイド減速機は、サイクロイドディスクとピン・ローラ機構で動力を伝えます。多数の接触点で荷重を分担するため、衝撃に強く、トルク伝達も安定しやすい構造です。</p>" +
        "<p>軸方向が短いのでコンパクトな装置にも組み込みやすく、バックラッシを抑えれば正確な逆転・割出しにも向きます。自動化アームや断続高トルク駆動などでよく使われます。</p>" +
        "<p>ディスク形状、ピン配置、材料、ハウジングを一体で磨き、耐久性・効率・長寿命のバランスを取る方向で研究しています。</p>",
      "research.desc.planetary":
        "<p>プラネタリギアは、サンギア・プラネットギア・リングギアを同軸に配置した構造です。複数のプラネットが荷重を分担するため、比較的小さな径でも高いトルクを出せます。</p>" +
        "<p>入出力が同軸なのでモータ接続がしやすく、段数の組み合わせで減速比の幅も広げられます。ギアモータやコンベヤ、産業用ドライブモジュールで実績のある方式です。</p>" +
        "<p>当社は減速比とバックラッシ、キャリア・軸受剛性を中心に設計します。量産品質を保ちつつ、連続・ピーク負荷に合う実用的なプラネタリ減速機を目指します。</p>",

      "about.intro.title": "会社紹介",
      "about.intro.body":
        "当社はさまざまな用途向け部品の製造・加工を通じて、お客様の多様な要求に応える製造会社です。板金加工や切削加工など幅広い技術を活用し、高品質な部品を製作するとともに、お客様のプロジェクトに合わせたカスタムソリューションを提供します。蓄積された技術とノウハウにより、効率的で高精度な生産プロセスを構築し、お客様のビジネス成功を支援します。品質と革新を重視し、継続的な成長と発展を推進しています。",
      "about.quality.title": "品質方針",
      "about.quality.1.title": "顧客中心の品質",
      "about.quality.1.body":
        "お客様を最優先に考え、期待を満たし、それを超える製品づくりに努めます。品質は当社の中核価値の一つです。",
      "about.quality.2.title": "厳格な品質基準の遵守",
      "about.quality.2.body":
        "すべての製品は厳格な品質基準および規制に適合するため、厳密な試験・検査を実施します。これにより信頼性の高い製品を提供し、不必要な不良を防止します。",
      "about.quality.3.title": "継続的な品質改善",
      "about.quality.3.body":
        "品質の継続的改善に取り組み、研究開発を推進し、お客様のフィードバックを活用して製品とプロセスを改善します。",

      "product.filter.all": "すべて",
      "product.filter.astm": "ASTM",
      "product.filter.bstm": "BSTM",
      "product.category.sheet_metal": "板金",

      "contact.title": "お問い合わせ",
      "contact.our_address": "住所",
      "contact.address_line": "大韓民国 仁川広域市 南洞区 能許大路625番ギル 140-25",
      "contact.email_us": "メール",
      "contact.call_us": "電話",
      "contact.opening_hours": "営業時間",
      "contact.form.name": "お名前",
      "contact.form.email": "メールアドレス",
      "contact.form.subject": "件名",
      "contact.form.message": "本文",
      "contact.form.loading": "送信中",
      "contact.form.sent": "メッセージを送信しました。ありがとうございます。",
      "contact.form.captcha": "キャプチャを完了してください。",
      "contact.form.send": "送信",
    },
  };

  function normalizeLang(lang) {
    if (!lang) return "en";
    const lower = String(lang).toLowerCase();
    if (SUPPORTED.includes(lower)) return lower;
    // e.g. "en-US" -> "en"
    const base = lower.split("-")[0];
    return SUPPORTED.includes(base) ? base : "en";
  }

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeLang(saved);
    return normalizeLang(navigator.language || "en");
  }

  function t(lang, key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.en && DICT.en[key]) || null;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(lang, key);
      if (value == null) return;

      // If element explicitly requests HTML insertion
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const attrList = el.getAttribute("data-i18n-attr");
      const key = el.getAttribute("data-i18n");
      const value = t(lang, key);
      if (!attrList || value == null) return;

      attrList
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((attr) => el.setAttribute(attr, value));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const value = t(lang, key);
      if (value == null) return;
      el.setAttribute("title", value);
      el.setAttribute("data-title", value);
    });
  }

  function setLanguage(lang) {
    const normalized = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, normalized);
    applyTranslations(normalized);
    window.dispatchEvent(new CustomEvent("astm:langchange", { detail: { lang: normalized } }));
  }

  function wireLanguageMenu() {
    document.querySelectorAll("[data-set-lang]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setLanguage(a.getAttribute("data-set-lang"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = getInitialLang();
    applyTranslations(lang);
    wireLanguageMenu();
  });

  // Expose minimal API for debugging/manual use
  window.ASTM_I18N = { setLanguage };
})();


