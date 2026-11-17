"""Cloudflare Pages처럼 동작하는 작은 로컬 서버 (언어 전환 시험용).

- /x.html  → 308 /x   (index.html → /), 뒤의 ?lang= 등은 그대로
- /x       → x.html 내용
- 없는 주소 → index.html (Pages는 404.html이 없으면 이렇게 함)

    python3 tests/pages_server.py 8799
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        u = urlsplit(self.path)
        path = u.path
        q = f"?{u.query}" if u.query else ""
        if path.endswith(".html"):
            target = path[:-5]
            if target.endswith("/index"):
                target = target[:-5]
            self.send_response(308)
            self.send_header("Location", (target or "/") + q)
            self.end_headers()
            return
        rel = path.lstrip("/")
        if rel == "" or rel.endswith("/"):
            rel += "index.html"
        f = ROOT / rel
        if not f.is_file() and (ROOT / (rel + ".html")).is_file():
            rel += ".html"
        elif not f.is_file():
            rel = "index.html"
        self.path = "/" + rel
        return super().do_GET()


def serve(port):
    httpd = ThreadingHTTPServer(("127.0.0.1", port), partial(Handler, directory=str(ROOT)))
    return httpd


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8799
    print(f"http://127.0.0.1:{port}")
    serve(port).serve_forever()
