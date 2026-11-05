#!/usr/bin/env python3
import pathlib
from playwright.sync_api import sync_playwright

CDN_DIR = pathlib.Path(__file__).parent / "cdn"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm"}

def mock_cdn(page):
    def handle(route):
        url = route.request.url
        name = url.rsplit("/", 1)[-1].split("?")[0]
        p = CDN_DIR / name
        if p.is_file():
            route.fulfill(path=str(p), content_type=_MIME.get(p.suffix, "application/octet-stream"))
        else:
            print("UNMAPPED:", url[:110], flush=True)
            route.abort()
    page.route("https://cdn.jsdelivr.net/**", handle)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 375, "height": 844})
    mock_cdn(pg)
    pg.on("pageerror", lambda e: print("PAGEERROR:", str(e)[:200], flush=True))
    pg.goto("http://localhost:3444/v2/lab-demo", wait_until="domcontentloaded", timeout=60000)
    for i in range(10):
        pg.wait_for_timeout(5000)
        try:
            sts = pg.locator(".sqllab .status").all_inner_texts()
        except Exception as e:
            print("read err", str(e)[:80], flush=True)
            continue
        print(f"t={(i+1)*5}s:", [s[:60] for s in sts], flush=True)
        if sts and all("SQL siap" in s for s in sts):
            break
    b.close()
