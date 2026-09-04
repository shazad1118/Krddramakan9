#!/usr/bin/env python3
"""
KRDDramakan — سێرڤەری سادەی لۆکاڵی
بۆ ڕاکردن:  python3 server.py
پاشان بڕۆ بۆ:  http://localhost:8000
"""
import http.server
import socketserver
import os
import sys
import json
import shutil

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DRAMA_JSON  = os.path.join(DIRECTORY, "json", "drama.json")
ADMIN_JSON  = os.path.join(DIRECTORY, "json", "admin.json")
DRAMA_BACKUP = os.path.join(DIRECTORY, "json", "drama.backup.json")

# فایلە ستاتیکەکان — بۆ ئەوانە کاش دەبن
CACHE_LONG  = {"sw.js", "manifest.json"}          # ئەوانە هەمیشە نوێ بێن
CACHE_SHORT = {".html", ".css", ".js", ".json"}   # کاشی کورت

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        path = self.path.split("?")[0].split("#")[0]
        fname = os.path.basename(path)
        ext   = os.path.splitext(fname)[1].lower()

        # CORS — بۆ ئەوەی PWA و SW باش کاربکەن
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

        # SW و manifest هەمیشە نوێ بێن
        if fname in ("sw.js", "manifest.json"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Service-Worker-Allowed", "/")
        # drama.json هەمیشە نوێ بهێنرێتەوە
        elif fname == "drama.json":
            self.send_header("Cache-Control", "no-store")
        # فایلە ستاتیکەکانی تر — کاشی کورت (5 خولەک)
        elif ext in CACHE_SHORT:
            self.send_header("Cache-Control", "public, max-age=300")
        else:
            self.send_header("Cache-Control", "no-store")

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path == "/api/save-dramas":
            try:
                length = int(self.headers.get("Content-Length", 0))
                raw    = self.rfile.read(length) if length else b""
                body   = json.loads(raw.decode("utf-8")) if raw else {}
            except Exception:
                self._send_json(400, {"ok": False, "error": "JSON نادروستە"})
                return

            code   = body.get("code")
            dramas = body.get("dramas")

            if not isinstance(dramas, list):
                self._send_json(400, {"ok": False, "error": "دراماکان دروست نین"})
                return

            try:
                with open(ADMIN_JSON, "r", encoding="utf-8") as f:
                    admin_data = json.load(f)
            except Exception:
                admin_data = {}

            if not code or code != admin_data.get("code"):
                self._send_json(403, {"ok": False, "error": "کۆدی ئەدمین هەڵەیە"})
                return

            try:
                os.makedirs(os.path.dirname(DRAMA_JSON), exist_ok=True)
                if os.path.exists(DRAMA_JSON):
                    shutil.copyfile(DRAMA_JSON, DRAMA_BACKUP)
                with open(DRAMA_JSON, "w", encoding="utf-8") as f:
                    json.dump(dramas, f, ensure_ascii=False, indent=2)
                self._send_json(200, {"ok": True, "count": len(dramas)})
            except Exception as e:
                self._send_json(500, {"ok": False, "error": str(e)})
            return

        self._send_json(404, {"ok": False, "error": "ڕێگا نەدۆزرایەوە"})

    def log_message(self, fmt, *args):
        # تەنها هەڵەکان نیشان بدە — output پاکتر
        if args and str(args[1]) not in ("200", "204", "304"):
            super().log_message(fmt, *args)


def main():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ KRDDramakan ڕادەکات لەسەر: http://localhost:{PORT}")
        print("بۆ وەستاندنی سێرڤەرەکە: Ctrl+C")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nسێرڤەر وەستێنرا.")


if __name__ == "__main__":
    main()
