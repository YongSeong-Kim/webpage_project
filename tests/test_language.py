"""실제 브라우저(Chromium)로 언어 전환을 눌러 보는 시험. GitHub Actions에서 배포 전에 돈다.

맥에서 직접 돌리려면 (선택, 브라우저를 받아서 무거움):
    pip install playwright && python -m playwright install chromium
    python3 tests/test_language.py

예전에 고장 났던 것을 그대로 시험한다.
- PR #38: .html 없는 주소에서 언어 페이지끼리 계속 새로고침
- PR #39: 영어 페이지인데 메뉴·연락처가 한국어
- PR #40: 한국어 분야 페이지 → 연구개발로 가면 영어로 바뀜
"""
import re
import sys
import threading
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from pages_server import serve  # noqa: E402

PORT = 8799
BASE = f"http://127.0.0.1:{PORT}"
ROOT = Path(__file__).resolve().parent.parent
NAV_RESEARCH = {"ko": "연구개발", "en": "R&D", "ja": "研究開発"}
SERVICE_SLUGS = ["cnc-turning", "mct-machining", "gun-drilling", "sheet-metal", "machining-and-sheet-metal", "services"]


def sitemap_paths():
    locs = re.findall(r"<loc>https://astm-eng\.com([^<]*)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8"))
    return [p or "/" for p in locs]


class LanguageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = serve(PORT)
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.httpd.shutdown()

    def setUp(self):
        # 처음 온 사람 (저장된 언어 없음, 브라우저 언어 영어)
        self.ctx = self.browser.new_context(locale="en-US")
        self.page = self.ctx.new_page()
        self.errors = []
        self.navs = []
        self.page.on("pageerror", lambda e: self.errors.append(str(e)))
        self.page.on("framenavigated", lambda f: f == self.page.main_frame and self.navs.append(f.url))
        # 바깥 주소(글꼴·유튜브·문의 양식 등)는 막아서 시험이 인터넷에 흔들리지 않게
        self.ctx.route(re.compile(r"^https?://(?!127\.0\.0\.1)"), lambda r: r.abort())

    def tearDown(self):
        self.ctx.close()

    # ---- 도우미 ----
    def open(self, path):
        self.navs.clear()
        self.page.goto(BASE + path, wait_until="load")
        self.page.wait_for_timeout(1200)   # 스크립트가 옮기는 것까지 기다림
        self.page.wait_for_load_state("load")

    def path(self):
        return self.page.url.replace(BASE, "") or "/"

    def lang(self):
        return self.page.evaluate("document.documentElement.lang")

    def saved(self):
        return self.page.evaluate("localStorage.getItem('astm_lang')")

    def nav_research(self):
        return self.page.locator('#navbar [data-i18n="nav.research"]').first.inner_text().strip()

    def assert_lang(self, lang):
        self.assertEqual(self.lang(), lang, f"{self.path()} 페이지 언어")
        self.assertEqual(self.nav_research(), NAV_RESEARCH[lang], f"{self.path()} 메뉴 글자")

    def assert_no_loop(self, limit=2):
        self.assertLessEqual(len(self.navs), limit, f"페이지가 계속 바뀜: {self.navs}")

    def click_lang(self, lang):
        self.navs.clear()
        self.page.locator(f'[data-set-lang="{lang}"]').first.dispatch_event("click")
        self.page.wait_for_timeout(1200)
        self.page.wait_for_load_state("load")

    # ---- 시험 ----
    def test_korean_service_page_first_visit(self):
        for slug in SERVICE_SLUGS:
            with self.subTest(slug=slug):
                self.page.evaluate("localStorage.clear()") if self.page.url.startswith(BASE) else None
                self.open(f"/{slug}")
                self.assertEqual(self.path(), f"/{slug}")
                self.assert_lang("ko")
                self.assert_no_loop(1)
                self.assertEqual(self.saved(), "ko")

    def test_korean_stays_on_other_menus(self):
        """PR #40: 한국어 분야 페이지에서 연구개발로 가도 한국어"""
        self.open("/cnc-turning")
        for p in ("/research", "/about", "/", "/contact"):
            with self.subTest(page=p):
                self.open(p)
                self.assert_lang("ko")

    def test_english_page_menu_is_english(self):
        """PR #39: 영어 분야 페이지는 메뉴도 영어"""
        self.open("/sheet-metal-en")
        self.assertEqual(self.path(), "/sheet-metal-en")
        self.assert_lang("en")
        self.assert_no_loop(1)

    def test_language_menu_moves_to_pair_page(self):
        self.open("/cnc-turning")
        self.click_lang("en")
        self.assertEqual(self.path(), "/cnc-turning-en")
        self.assert_lang("en")
        self.click_lang("ja")
        self.assertEqual(self.path(), "/cnc-turning-ja")
        self.assert_lang("ja")
        self.click_lang("ko")
        self.assertEqual(self.path(), "/cnc-turning")
        self.assert_lang("ko")
        self.assert_no_loop(2)

    def test_saved_language_redirects_once(self):
        """PR #38: 영어를 고른 사람이 한국어 분야 주소로 오면 영어판으로 한 번만 옮김"""
        self.open("/?lang=en")
        self.assert_lang("en")
        for slug in SERVICE_SLUGS:
            with self.subTest(slug=slug):
                self.open(f"/{slug}")
                self.assertEqual(self.path(), f"/{slug}-en")
                self.assert_lang("en")
                self.assert_no_loop(2)

    def test_old_html_links_still_work(self):
        self.open("/cnc-turning.html")
        self.assertEqual(self.path(), "/cnc-turning")
        self.assert_lang("ko")
        self.assert_no_loop(2)

    def test_plain_pages_switch_in_place(self):
        self.open("/about")
        self.click_lang("ko")
        self.assertEqual(self.path(), "/about")
        self.assert_lang("ko")
        self.click_lang("ja")
        self.assertEqual(self.path(), "/about")
        self.assert_lang("ja")

    def test_query_lang_link(self):
        self.open("/research?lang=ja")
        self.assert_lang("ja")
        self.open("/research?lang=ko")
        self.assert_lang("ko")

    def test_every_page_loads_without_script_errors(self):
        for p in sitemap_paths():
            with self.subTest(page=p):
                self.errors.clear()
                self.page.evaluate("localStorage.clear()") if self.page.url.startswith(BASE) else None
                self.open(p)
                self.assertEqual(self.errors, [], f"{p} 스크립트 오류")
                self.assert_no_loop(1)
                self.assertTrue(self.page.locator("#navbar").count(), f"{p} 메뉴 없음")


if __name__ == "__main__":
    unittest.main(verbosity=2)
