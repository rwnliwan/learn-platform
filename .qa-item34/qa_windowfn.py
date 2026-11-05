#!/usr/bin/env python3
"""Bukti: sql.js mendukung window function (argumen sql.js cukup, tak perlu duckdb)."""
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
            route.abort()
    page.route("https://cdn.jsdelivr.net/**", handle)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    mock_cdn(pg)
    pg.goto("http://localhost:3444/v2/lab-demo", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_function(
        "() => [...document.querySelectorAll('.sqllab .status')].every(s => s.textContent.includes('SQL siap'))",
        timeout=90000)
    sec = pg.locator('section[aria-label="Lab SQL"]')
    sec.locator("textarea").fill(
        "SELECT id, nominal, SUM(nominal) OVER (PARTITION BY jenis ORDER BY id) AS running_total "
        "FROM transaksi LIMIT 3;")
    sec.get_by_role("button", name="Jalankan").click()
    pg.wait_for_selector(".sqlres tbody tr", timeout=30000)
    rows = sec.locator(".sqlres tbody tr").count()
    txt = sec.locator(".sqlres tbody").inner_text()[:120]
    print(f"window function -> {rows} baris:", txt.replace("\n", " | "), flush=True)
    print("PASS window function didukung" if rows == 3 else "FAIL", flush=True)
    b.close()
