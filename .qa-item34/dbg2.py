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
    pg.goto("http://localhost:3222/v2/lab-demo", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_function("() => !!window.echarts", timeout=60000)
    pg.wait_for_timeout(3000)
    for i in range(3):
        c = pg.locator(".echart-canvas").nth(i)
        n = c.locator("canvas").count()
        print(f"container {i}: {n} canvas(es)", flush=True)
        kids = c.evaluate("(el) => el.innerHTML.length")
        print(f"  innerHTML len: {kids}", flush=True)
    # info chart instances
    print(pg.evaluate("() => { const els = document.querySelectorAll('.echart-canvas'); return [...els].map(e => !!e.__echarts_instance__); }"), flush=True)
    b.close()
