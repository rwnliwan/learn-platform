#!/usr/bin/env python3
"""Regresi fokus: lab Pyodide di /v2/learn/a11-tipe-data tetap jalan."""
import sys
import pathlib
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3444"
CDN_DIR = pathlib.Path(__file__).parent / "cdn"
PYODIDE_DIR = CDN_DIR / "pyodide"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm",
         ".zip": "application/zip", ".json": "application/json"}

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

results = []
def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" - {detail}" if detail else ""), flush=True)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    mock_cdn(pg)
    perrs = []
    pg.on("pageerror", lambda e: perrs.append(str(e)))
    pg.goto(BASE + "/v2/learn/a11-tipe-data", wait_until="domcontentloaded", timeout=120000)
    # polling ringan (hindari wait_for_selector ketat saat renderer sibuk)
    import time
    for _ in range(40):
        try:
            if pg.locator(".pane-right").count() > 0:
                break
        except Exception:
            pass
        time.sleep(3)
    check("halaman lesson me-render (.pane-right ada)", pg.locator(".pane-right").count() > 0)
    try:
        pg.wait_for_function(
            "() => [...document.querySelectorAll('.pane-right .status')].some(s => s.textContent.includes('Python siap'))",
            timeout=240000,
        )
        check("Pyodide 'Python siap'", True)
    except Exception:
        st = pg.locator(".pane-right .status").first.text_content(timeout=5000)
        check("Pyodide 'Python siap'", False, f"status: {(st or '')[:120]}")
        print(f"\n{len(results)-1}/{len(results)} lolos", flush=True)
        sys.exit(1)
    pg.locator(".v2ed-area").fill(
        'rata = sum(skor) / len(skor)\nmacet = skor.count(5) / len(skor)\n\nprint(f"rata={rata}  macet={macet}")'
    )
    pg.get_by_role("button", name="Jalankan").first.click()
    pg.wait_for_function(
        "() => { const el = document.querySelector('.pane-right .console-body .out, .pane-right .console-body .out-err'); return el && el.textContent.includes('rata='); }",
        timeout=60000,
    )
    out = pg.locator(".pane-right .console-body").inner_text()
    check("Pyodide run -> rata=1.5 macet=0.1", "rata=1.5" in out and "macet=0.1" in out, out[:100])
    pg.get_by_role("button", name="Periksa").first.click()
    pg.wait_for_selector(".pane-right .feedback", timeout=60000)
    fbpy = pg.locator(".pane-right .feedback").inner_text()
    check("Pyodide Periksa -> Benar", "Benar" in fbpy, fbpy[:80])
    check("tidak ada pageerror", len(perrs) == 0, "; ".join(perrs[:3]))
    b.close()

fails = [r for r in results if not r[1]]
print(f"\n{len(results) - len(fails)}/{len(results)} lolos", flush=True)
sys.exit(1 if fails else 0)
