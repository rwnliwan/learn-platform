#!/usr/bin/env python3
import pathlib
from playwright.sync_api import sync_playwright

CDN_DIR = pathlib.Path(__file__).parent / "cdn"
PYODIDE_DIR = CDN_DIR / "pyodide"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm", ".zip": "application/zip"}

def mock_cdn(page):
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
    pg.on("console", lambda m: msgs.append(f"{m.type}: {m.text[:200]}"))
    pg.on("pageerror", lambda e: msgs.append(f"PAGEERROR: {str(e)[:250]}"))
    pg.on("requestfailed", lambda r: msgs.append(f"REQFAIL: {r.url[:110]}"))
    pg.on("response", lambda r: msgs.append(f"RESP {r.status}: {r.url[:110]}") if "jsdelivr" in r.url else None)
    pg.goto("http://localhost:3444/v2/learn/a11-tipe-data", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_timeout(45000)
    st = pg.locator(".pane-right .status")
    print("status count:", st.count(), flush=True)
    for i in range(st.count()):
        print("status", i, ":", st.nth(i).inner_text()[:150], flush=True)
    print("--- net/console ---", flush=True)
    for m in msgs[-30:]:
        print(m, flush=True)
    b.close()
