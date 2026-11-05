#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import pathlib
CDN_DIR = pathlib.Path(__file__).parent / "cdn"
PYODIDE_DIR = CDN_DIR / "pyodide"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm", ".zip": "application/zip"}

def mock_cdn(page):
    """Sajikan file CDN dari disk lokal (browser sandbox tak bisa keluar via proxy).
    Kode produksi tetap memakai URL CDN — ini murni test-double QA."""
    def handle(route):
        url = route.request.url
        name = url.rsplit("/", 1)[-1].split("?")[0]
        cands = [CDN_DIR / name]
        if url.startswith("https://cdn.jsdelivr.net/pyodide/"):
            cands.insert(0, PYODIDE_DIR / name)
        for p in cands:
            if p.is_file():
                route.fulfill(path=str(p), content_type=_MIME.get(p.suffix, "application/octet-stream"))
                return
        route.abort()
    page.route("https://cdn.jsdelivr.net/**", handle)


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    mock_cdn(pg)
    msgs = []
    pg.on("console", lambda m: msgs.append(f"{m.type}: {m.text[:220]}"))
    pg.on("pageerror", lambda e: msgs.append(f"PAGEERROR: {str(e)[:300]}"))
    pg.on("requestfailed", lambda r: msgs.append(f"REQFAIL: {r.url[:130]} :: {r.failure}"))
    pg.goto("http://localhost:3222/v2/lab-demo", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_timeout(25000)
    print("sqllab count:", pg.locator(".sqllab").count(), flush=True)
    for i in range(pg.locator(".sqllab .status").count()):
        print("status", i, ":", pg.locator(".sqllab .status").nth(i).inner_text()[:150], flush=True)
    print("initSqlJs:", pg.evaluate("typeof window.initSqlJs"), flush=True)
    print("--- console/network ---", flush=True)
    for m in msgs[-30:]:
        print(m, flush=True)
    b.close()
