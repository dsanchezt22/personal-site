#!/usr/bin/env python3
"""Loopback static server for the private site preview."""

import mimetypes
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "dist"
PORT = int(os.environ.get("PORT", "8790"))

mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("image/svg+xml", ".svg")


class Handler(SimpleHTTPRequestHandler):
    server_version = "personal-site"
    sys_version = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def version_string(self):
        return self.server_version

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path.startswith("/.") or "/." in path:
            self.send_error(404)
            return
        super().do_GET()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    server.serve_forever()
