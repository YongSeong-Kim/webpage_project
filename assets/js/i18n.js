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
      "ui.language": "Language",
      "ui.theme": "Light / dark",
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

      // Home page (2026-11 redesign)
      "home.hero.eyebrow": "Incheon, Korea · 20 years in metal parts",
      "home.hero.title": "CNC machining and sheet metal.<br>One shop, one quote.",
      "home.hero.lead": "Turning, milling and gun drilling at ASTM Engineering. Laser cutting, bending, welding and painting at our sister company BSTM. Send one drawing and get one price for the whole part.",
      "home.btn.drawing": "Send a drawing for a quote",
      "home.btn.tour": "Watch the 3-minute factory tour",
      "home.stat.years": "years making precision parts",
      "home.stat.shops": "shops (machining + sheet metal) on one site",
      "home.stat.machines": "types of main machines",
      "home.stat.city": "Incheon",
      "home.stat.port": "Near Incheon port and airport",
      "home.about.kicker": "About us",
      "home.about.title": "Two shops, one quote",
      "home.about.lead": "We make machined parts and sheet metal parts in the same place, so schedules line up and parts fit together. With 20 years of experience, we build every part with care, including the first one you send us.",
      "home.about.astm.title": "ASTM Engineering · Precision machining",
      "home.about.astm.body": "CNC turning, machining centers (MCT) and gun drilling for housings, shafts and deep-hole parts.",
      "home.about.bstm.title": "BSTM · Sheet metal",
      "home.about.bstm.body": "Laser cutting, turret punching, bending, PEM hardware, welding and painting for enclosures, racks, frames and welded structures.",
      "home.about.more": "More about us →",
      "home.products.kicker": "Products",
      "home.products.title": "Parts we make",
      "home.prod.housing": "Shafts",
      "home.prod.reel": "Turned parts",
      "home.prod.plate": "Machined plate",
      "home.prod.copper": "Copper block, deep holes",
      "home.prod.box": "Aluminum housing",
      "home.prod.boat": "Welded aluminum boat",
      "home.prod.enclosure": "Wireless repeater enclosure",
      "home.prod.vessel": "Large pressure vessel",
      "home.products.more": "See all products →",
      "home.equip.kicker": "Equipment",
      "home.equip.title": "Our machines",
      "home.eq.cnc": "CNC turning center",
      "home.eq.mct": "Machining center",
      "home.eq.gundrill": "Gun drill",
      "home.eq.laser": "TRUMPF laser",
      "home.eq.pem": "PEM press",
      "home.eq.weld": "Welding robot",
      "home.equip.more": "See all equipment →",
      "home.next.kicker": "What's next",
      "home.next.title": "What we are working on",
      "home.next.s1.tag": "Today",
      "home.next.s1.title": "Precision machining + sheet metal",
      "home.next.s1.body": "What we have done for 20 years, for customers in Japan, the US and the UK.",
      "home.next.s2.tag": "In preparation",
      "home.next.s2.title": "Automation in our own shop",
      "home.next.s2.body": "Collaborative robots loading and unloading our own CNC machines, run first in our own shop.",
      "home.next.s3.tag": "Next",
      "home.next.s3.title": "Automation for other machine shops",
      "home.next.s3.body": "Then we offer the automation proven in our shop to other machine shops.",
      "home.rnd.title": "R&D: precision reducers",
      "home.rnd.body": "We design and prototype harmonic, cycloid and planetary reducers for robot joints and precision actuators.",
      "home.rnd.more": "See our R&D →",
      "home.tour.kicker": "Factory tour",
      "home.tour.title": "Walk the shop in 3 minutes",
      "home.tour.body": "See the machining floor, the sheet metal line and parts in progress before you send your first drawing.",
      "home.cta.title": "Have a drawing? Get a price.",
      "home.cta.body": "Send your drawing (PDF, STEP or DXF) with quantity and material. The owner replies to you directly.",
      "home.cta.btn": "Request a quote",
      "home.loc.title": "Location",
      // Inner pages (2026-11 redesign)
      "page.about.lead": "Two companies on one site: machining at ASTM Engineering and sheet metal at BSTM, making precision parts for 20 years.",
      "page.product.lead": "Parts made with CNC turning, machining centers, gun drilling and sheet metal. Pick a category to filter.",
      "page.equipment.lead": "The main machines at ASTM (machining) and BSTM (sheet metal).",
      "page.research.lead": "We design and prototype reducers for robot joints and precision actuators.",
      "page.contact.lead": "Send your drawing (PDF, STEP or DXF) with quantity and material. The owner replies to you directly.",
      "about.photos.title": "Inside the shop",
      "about.photos.lead": "Photos taken at our Incheon shop in October 2026.",
      "about.photos.cnc": "CNC machining floor",
      "about.photos.lathe": "Inside a CNC lathe",
      "about.photos.brake": "AMADA press brake",
      "product.cat.mct": "MCT machined part",
      "product.cat.cnc": "CNC turned part",
      "product.cat.gundrill": "Gun-drilled part",
      // Owner (2026-11)
      "about.owner.kicker": "Who you talk to",
      "about.owner.title": "Run by the owner. Answered by the owner.",
      "about.owner.body": "Seung Soo Kim runs both ASTM Engineering and BSTM himself. He answers quote requests and technical questions personally, so when you send a drawing you talk straight to the person who decides.",
      "about.owner.name": "Seung Soo Kim · CEO",
      "home.owner.line": "Runs both shops and answers quote requests himself.",
    },
    ko: {
      "ui.language": "언어",
      "ui.theme": "밝은 화면 / 어두운 화면",
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

      // Home page (2026-11 redesign)
      "home.hero.eyebrow": "인천 남동구 · 20년 금속 가공",
      "home.hero.title": "CNC 가공과 판금,<br>한 곳에서 한 번에 견적",
      "home.hero.lead": "선반·머시닝센터·건드릴 가공은 ASTM엔지니어링, 레이저·절곡·용접·도장은 자매 회사 BSTM에서. 도면 한 장을 보내 주시면 부품 전체를 한 번에 견적 드립니다.",
      "home.btn.drawing": "도면 보내고 견적 받기",
      "home.btn.tour": "3분 공장 투어 보기",
      "home.stat.years": "년 동안 정밀 부품 생산",
      "home.stat.shops": "개 공장 (가공 + 판금), 같은 단지",
      "home.stat.machines": "종류 주요 설비",
      "home.stat.city": "인천",
      "home.stat.port": "인천항·인천공항과 가까운 남동구",
      "home.about.kicker": "회사 소개",
      "home.about.title": "두 회사, 하나의 견적",
      "home.about.lead": "가공 부품과 판금 부품을 같은 곳에서 만들기 때문에, 따로 맡길 때 생기는 일정 차이와 조립 문제를 줄입니다. 20년 동안 쌓은 경험으로 처음 맡기시는 부품도 꼼꼼하게 만듭니다.",
      "home.about.astm.title": "ASTM엔지니어링 · 정밀 가공",
      "home.about.astm.body": "CNC 선반, 머시닝센터(MCT), 건드릴 가공. 하우징, 축, 깊은 구멍이 있는 부품을 만듭니다.",
      "home.about.bstm.title": "BSTM · 판금",
      "home.about.bstm.body": "레이저 절단, 터렛 펀칭, 절곡, PEM 압입, 용접, 도장. 함체, 랙, 프레임, 용접 구조물을 만듭니다.",
      "home.about.more": "회사 소개 더 보기 →",
      "home.products.kicker": "제품",
      "home.products.title": "이런 부품을 만듭니다",
      "home.prod.housing": "축 부품",
      "home.prod.reel": "회전 부품",
      "home.prod.plate": "가공 플레이트",
      "home.prod.copper": "동 블록 (깊은 구멍)",
      "home.prod.box": "알루미늄 함체",
      "home.prod.boat": "알루미늄 용접 보트",
      "home.prod.enclosure": "무선 중계기 함체",
      "home.prod.vessel": "대형 압력 용기",
      "home.products.more": "제품 전체 보기 →",
      "home.equip.kicker": "설비",
      "home.equip.title": "보유 설비",
      "home.eq.cnc": "CNC 선반",
      "home.eq.mct": "머시닝센터",
      "home.eq.gundrill": "건드릴",
      "home.eq.laser": "TRUMPF 레이저",
      "home.eq.pem": "PEM 프레스",
      "home.eq.weld": "용접 로봇",
      "home.equip.more": "설비 자세히 보기 →",
      "home.next.kicker": "앞으로",
      "home.next.title": "지금 준비하고 있는 일",
      "home.next.s1.tag": "지금",
      "home.next.s1.title": "정밀 가공 + 판금",
      "home.next.s1.body": "20년 동안 해 온 일. 일본·미국·영국 고객사에 부품을 만들어 보냅니다.",
      "home.next.s2.tag": "준비 중",
      "home.next.s2.title": "우리 공장 자동화",
      "home.next.s2.body": "협동로봇으로 우리 CNC 기계에 소재를 넣고 빼는 자동화를 먼저 우리 공장에서 운영합니다.",
      "home.next.s3.tag": "다음",
      "home.next.s3.title": "다른 가공 업체에 자동화 제공",
      "home.next.s3.body": "우리 공장에서 검증한 자동화를 다른 가공 업체에도 제공합니다.",
      "home.rnd.title": "연구 개발: 정밀 감속기",
      "home.rnd.body": "로봇 관절과 정밀 구동부에 쓰이는 하모닉·사이클로이드·유성 감속기를 설계하고 시제품을 만들고 있습니다.",
      "home.rnd.more": "연구 개발 보기 →",
      "home.tour.kicker": "공장 투어",
      "home.tour.title": "3분 만에 공장 둘러보기",
      "home.tour.body": "가공 현장과 판금 라인, 만들고 있는 부품을 영상으로 먼저 보세요.",
      "home.cta.title": "도면이 있으신가요? 견적을 받아 보세요.",
      "home.cta.body": "도면(PDF, STEP, DXF)과 수량, 재질을 보내 주시면 대표가 직접 답장 드립니다.",
      "home.cta.btn": "견적 문의하기",
      "home.loc.title": "오시는 길",
      // Inner pages (2026-11 redesign)
      "page.about.lead": "가공(ASTM엔지니어링)과 판금(BSTM), 두 회사가 같은 곳에서 20년 동안 정밀 부품을 만들어 왔습니다.",
      "page.product.lead": "CNC 선반, 머시닝센터, 건드릴, 판금으로 만든 부품들입니다. 종류를 눌러 골라 보세요.",
      "page.equipment.lead": "ASTM(가공)과 BSTM(판금)이 보유한 주요 설비입니다.",
      "page.research.lead": "로봇 관절과 정밀 구동부에 쓰이는 감속기를 설계하고 시제품을 만들고 있습니다.",
      "page.contact.lead": "도면(PDF, STEP, DXF)과 수량, 재질을 보내 주시면 대표가 직접 답장 드립니다.",
      "about.photos.title": "공장 모습",
      "about.photos.lead": "인천 남동구 공장에서 2026년 10월에 찍은 사진입니다.",
      "about.photos.cnc": "CNC 가공 현장",
      "about.photos.lathe": "CNC 선반 내부",
      "about.photos.brake": "AMADA 절곡기",
      "product.cat.mct": "MCT 가공 부품",
      "product.cat.cnc": "CNC 선반 가공 부품",
      "product.cat.gundrill": "건드릴 가공 부품",
      // Owner (2026-11)
      "about.owner.kicker": "대표",
      "about.owner.title": "대표가 직접 운영하고, 직접 답합니다",
      "about.owner.body": "김승수 대표가 ASTM엔지니어링과 BSTM을 직접 운영합니다. 견적 문의와 기술 질문에는 대표가 직접 답장 드리므로, 도면을 보내 주시면 중간 단계 없이 바로 이야기할 수 있습니다.",
      "about.owner.name": "김승수 · 대표",
      "home.owner.line": "두 회사를 직접 운영하고, 견적 문의에 직접 답합니다.",
    },
    ja: {
      "ui.language": "言語",
      "ui.theme": "ライト / ダーク",
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

      // Home page (2026-11 redesign)
      "home.hero.eyebrow": "韓国・仁川 · 金属加工20年",
      "home.hero.title": "CNC加工と板金を<br>一か所で、一度に見積り",
      "home.hero.lead": "旋盤・マシニングセンタ・ガンドリル加工はASTMエンジニアリング、レーザー・曲げ・溶接・塗装は姉妹会社BSTMで行います。図面を1枚お送りいただければ、部品全体をまとめてお見積りします。",
      "home.btn.drawing": "図面を送って見積り",
      "home.btn.tour": "3分の工場ツアーを見る",
      "home.stat.years": "年間、精密部品を製造",
      "home.stat.shops": "工場（加工＋板金）を同じ敷地に",
      "home.stat.machines": "種類の主要設備",
      "home.stat.city": "仁川",
      "home.stat.port": "仁川港・仁川空港の近く",
      "home.about.kicker": "会社紹介",
      "home.about.title": "2つの工場、1つの見積り",
      "home.about.lead": "加工部品と板金部品を同じ場所で作るため、別々に依頼するときに起きる納期のずれや組立の問題を減らします。20年の経験で、初めてご依頼いただく部品も丁寧に製作します。",
      "home.about.astm.title": "ASTMエンジニアリング · 精密加工",
      "home.about.astm.body": "CNC旋盤、マシニングセンタ（MCT）、ガンドリル加工。ハウジング、シャフト、深穴部品を製作します。",
      "home.about.bstm.title": "BSTM · 板金",
      "home.about.bstm.body": "レーザー切断、タレットパンチ、曲げ、PEM圧入、溶接、塗装。筐体、ラック、フレーム、溶接構造物を製作します。",
      "home.about.more": "会社紹介を見る →",
      "home.products.kicker": "製品",
      "home.products.title": "このような部品を作っています",
      "home.prod.housing": "シャフト部品",
      "home.prod.reel": "旋削部品",
      "home.prod.plate": "加工プレート",
      "home.prod.copper": "銅ブロック（深穴）",
      "home.prod.box": "アルミ筐体",
      "home.prod.boat": "アルミ溶接ボート",
      "home.prod.enclosure": "無線中継器の筐体",
      "home.prod.vessel": "大型圧力容器",
      "home.products.more": "製品一覧を見る →",
      "home.equip.kicker": "設備",
      "home.equip.title": "保有設備",
      "home.eq.cnc": "CNC旋盤",
      "home.eq.mct": "マシニングセンタ",
      "home.eq.gundrill": "ガンドリル",
      "home.eq.laser": "TRUMPFレーザー",
      "home.eq.pem": "PEMプレス",
      "home.eq.weld": "溶接ロボット",
      "home.equip.more": "設備の詳細を見る →",
      "home.next.kicker": "これから",
      "home.next.title": "いま準備していること",
      "home.next.s1.tag": "現在",
      "home.next.s1.title": "精密加工 + 板金",
      "home.next.s1.body": "20年続けてきた仕事。日本・米国・英国のお客様に部品をお届けしています。",
      "home.next.s2.tag": "準備中",
      "home.next.s2.title": "自社工場の自動化",
      "home.next.s2.body": "協働ロボットで自社のCNC機械に材料を出し入れする自動化を、まず自社工場で運用します。",
      "home.next.s3.tag": "次に",
      "home.next.s3.title": "他の加工会社へ自動化を提供",
      "home.next.s3.body": "自社工場で検証した自動化を、他の加工会社にも提供します。",
      "home.rnd.title": "研究開発：精密減速機",
      "home.rnd.body": "ロボット関節や精密駆動部に使われるハーモニック・サイクロイド・遊星減速機を設計し、試作しています。",
      "home.rnd.more": "研究開発を見る →",
      "home.tour.kicker": "工場ツアー",
      "home.tour.title": "3分で工場を見学",
      "home.tour.body": "加工現場、板金ライン、製作中の部品を、まず動画でご覧ください。",
      "home.cta.title": "図面はありますか？お見積りします。",
      "home.cta.body": "図面（PDF、STEP、DXF）と数量、材質をお送りください。代表が直接ご返信します。",
      "home.cta.btn": "見積りを依頼する",
      "home.loc.title": "アクセス",
      // Inner pages (2026-11 redesign)
      "page.about.lead": "加工（ASTMエンジニアリング）と板金（BSTM）の2社が同じ場所で、20年間精密部品を作ってきました。",
      "page.product.lead": "CNC旋盤、マシニングセンタ、ガンドリル、板金で製作した部品です。種類を選んで絞り込めます。",
      "page.equipment.lead": "ASTM（加工）とBSTM（板金）の主要設備です。",
      "page.research.lead": "ロボット関節や精密駆動部に使われる減速機を設計し、試作しています。",
      "page.contact.lead": "図面（PDF、STEP、DXF）と数量、材質をお送りください。代表が直接ご返信します。",
      "about.photos.title": "工場の様子",
      "about.photos.lead": "2026年10月に仁川の工場で撮影した写真です。",
      "about.photos.cnc": "CNC加工の現場",
      "about.photos.lathe": "CNC旋盤の内部",
      "about.photos.brake": "AMADA曲げ機",
      "product.cat.mct": "MCT加工部品",
      "product.cat.cnc": "CNC旋盤加工部品",
      "product.cat.gundrill": "ガンドリル加工部品",
      // Owner (2026-11)
      "about.owner.kicker": "代表",
      "about.owner.title": "代表が自ら運営し、自ら返信します",
      "about.owner.body": "キム・スンス代表がASTMエンジニアリングとBSTMを自ら運営しています。見積りや技術的なご質問には代表が直接お答えするので、図面をお送りいただければ、間に人を挟まずにすぐご相談いただけます。",
      "about.owner.name": "キム・スンス · 代表",
      "home.owner.line": "2社を自ら運営し、見積りのお問い合わせに直接お答えします。",
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


