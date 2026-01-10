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
      "nav.home": "Home",
      "nav.about": "About",
      "nav.product": "Product",
      "nav.equipment": "Equipment",
      "nav.contact": "Contact",

      "section.about_us": "About Us",
      "section.products": "Products",
      "section.equipments": "Equipments",
      "section.clients": "Clients",

      "hero.welcome": "Welcome to ASTM & BSTM",
      // NOTE: Keep this as a single quoted string. Use <br> for line breaks (index.html uses data-i18n-html).
      "hero.subtitle":
        "Our company specializes in metal manufacturing, meeting diverse customer demands through advanced production and processing.<br><strong>ASTM Engineering</strong> delivers precision CNC machining and CNC turning solutions.<br><strong>BSTM Sheet Metal</strong> provides sheet metal fabrication, welding, and painting.",
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
      "breadcrumb.equipment": "Equipment",
      "breadcrumb.contact": "Contact",

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
      "contact.form.send": "Send Message",
    },
    ko: {
      "ui.language": "언어",
      "nav.home": "홈",
      "nav.about": "회사소개",
      "nav.product": "제품",
      "nav.equipment": "설비",
      "nav.contact": "문의",

      "section.about_us": "회사 소개",
      "section.products": "제품",
      "section.equipments": "설비",
      "section.clients": "고객사",

      "hero.welcome": "ASTM & BSTM에 오신 것을 환영합니다",
      "hero.subtitle":
        "당사는 금속 생산·가공 전문 기업으로, 첨단 생산 및 가공 기술을 통해 다양한 고객 요구에 대응합니다.<br><strong>ASTM Engineering</strong>은 정밀 CNC 머시닝 및 CNC 선반(턴닝) 솔루션을 제공합니다.<br><strong>BSTM Sheet Metal</strong>은 판금 가공, 용접, 도장을 제공합니다.",
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
      "breadcrumb.equipment": "설비",
      "breadcrumb.contact": "문의",

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
      "contact.form.send": "메시지 보내기",
    },
    ja: {
      "ui.language": "言語",
      "nav.home": "ホーム",
      "nav.about": "会社紹介",
      "nav.product": "製品",
      "nav.equipment": "設備",
      "nav.contact": "お問い合わせ",

      "section.about_us": "会社概要",
      "section.products": "製品",
      "section.equipments": "設備",
      "section.clients": "取引先",

      "hero.welcome": "ASTM & BSTMへようこそ",
      "hero.subtitle":
        "当社は金属製造の専門企業として、先進的な生産・加工により多様なお客様のニーズに対応します。<br><strong>ASTM Engineering</strong>は高精度のCNCマシニングおよびCNC旋盤ソリューションを提供します。<br><strong>BSTM Sheet Metal</strong>は板金加工、溶接、塗装を提供します。",
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
      "breadcrumb.equipment": "設備",
      "breadcrumb.contact": "お問い合わせ",

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
  }

  function setLanguage(lang) {
    const normalized = normalizeLang(lang);
    localStorage.setItem(STORAGE_KEY, normalized);
    applyTranslations(normalized);
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


