#!/usr/bin/env python3
"""Screenshot /v2/lab-demo (desktop + mobile) dengan konten nyata."""
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

SQL = """SELECT n.segmen AS segmen, COUNT(*) AS total_pinjaman,
       SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) AS npl,
       1.0 * SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) / COUNT(*) AS npl_rate
FROM pinjaman p JOIN nasabah n ON n.id = p.nasabah_id
GROUP BY n.segmen ORDER BY n.segmen;"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for width, tag in [(1280, "desktop"), (375, "mobile")]:
        pg = b.new_page(viewport={"width": width, "height": 900})
        mock_cdn(pg)
        pg.goto(BASE + "/v2/lab-demo", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_function(
            "() => [...document.querySelectorAll('.sqllab .status')].every(s => s.textContent.includes('SQL siap'))",
            timeout=90000)
        pg.wait_for_function("() => !!window.echarts", timeout=60000)
        pg.wait_for_timeout(2500)
        sec = pg.locator('section[aria-label="Lab SQL"]')
        sec.locator("textarea").fill(SQL)
        sec.get_by_role("button", name="Periksa").click()
        pg.wait_for_selector('section[aria-label="Lab SQL"] .feedback.pass', timeout=30000)
        # screenshot 1: lab SQL dengan hasil + feedback Benar
        sec.screenshot(path=str(CDN_DIR.parent / f"shot-{tag}-sqllab.png"))
        # screenshot 2: area chart (scroll ke ECharts)
        pg.locator(".efig").first.scroll_into_view_if_needed()
        pg.wait_for_timeout(800)
        pg.locator('section[aria-label="ECharts"]').screenshot(path=str(CDN_DIR.parent / f"shot-{tag}-echarts.png"))
        print(f"saved shot-{tag}-*.png", flush=True)
        pg.close()
    b.close()
