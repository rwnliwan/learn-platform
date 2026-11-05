#!/usr/bin/env python3
"""Screenshot ECharts dalam mode gelap (data-theme=dark)."""
import pathlib
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3444"
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
            route.abort()
    page.route("https://cdn.jsdelivr.net/**", handle)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    mock_cdn(pg)
    pg.goto(BASE + "/v2/lab-demo", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_function("() => !!window.echarts", timeout=60000)
    pg.wait_for_timeout(2500)
    pg.evaluate("document.documentElement.setAttribute('data-theme', 'dark')")
    pg.wait_for_timeout(2000)  # beri waktu re-init chart
    pg.locator(".efig").first.scroll_into_view_if_needed()
    pg.wait_for_timeout(500)
    pg.locator('section[aria-label="ECharts"]').screenshot(path=str(CDN_DIR.parent / "shot-dark-echarts.png"))
    print("saved shot-dark-echarts.png", flush=True)
    b.close()
