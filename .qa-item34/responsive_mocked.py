#!/usr/bin/env python3
"""Responsive sweep /v2/lab-demo di 375/390/768/1280 — replika logika
scripts/responsive_check.py, ditambah mock CDN agar konten (tabel SQL, chart)
hadir saat diukur. Syarat Septian 2026-10-14 23:08.
Usage: responsive_mocked.py [base_url]"""
import json
import sys
import pathlib
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3444"
PATH = "/v2/lab-demo"
VIEWPORTS = [(375, "mobile-375"), (390, "mobile-390"), (768, "tablet-768"), (1280, "desktop-1280")]

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

CHECK_JS = """() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const out = [];
  const isHidden = (el) => {
    const cs = getComputedStyle(el);
    return cs.display === 'none' || cs.visibility === 'hidden' || el.offsetParent === null && cs.position !== 'fixed';
  };
  document.querySelectorAll('*').forEach((el) => {
    if (isHidden(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right > vw + 1 || r.left < -1) {
      out.push({tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined) ? String(el.className.baseVal || '') : String(el.className || ''),
        left: Math.round(r.left), right: Math.round(r.right),
        text: (el.innerText || '').slice(0, 50).replace(/\\s+/g, ' ')});
    }
  });
  const ctrls = [];
  document.querySelectorAll('button, a, input, select, textarea, [role="button"]').forEach((el) => {
    if (isHidden(el)) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1 || r.width === 0) {
      ctrls.push({tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.value || el.getAttribute('aria-label') || '').slice(0, 50).replace(/\\s+/g, ' ')});
    }
  });
  return {viewport: vw, scrollWidth: sw, horizontalOverflow: sw > vw + 1,
          overflowingElements: out.slice(0, 20), unreachableControls: ctrls.slice(0, 20)};
}"""

SQL_FILL = """SELECT n.segmen AS segmen, COUNT(*) AS total_pinjaman,
       SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) AS npl
FROM pinjaman p JOIN nasabah n ON n.id = p.nasabah_id
GROUP BY n.segmen ORDER BY n.segmen;"""

def sweep_viewport(browser, width, name):
    last_err = ""
    for attempt in range(2):
        page = browser.new_page(viewport={"width": width, "height": 844})
        mock_cdn(page)
        try:
            page.goto(BASE + PATH, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_function(
                "() => [...document.querySelectorAll('.sqllab .status')].every(s => s.textContent.includes('SQL siap'))",
                timeout=90000)
            page.wait_for_function("() => !!window.echarts", timeout=60000)
            page.wait_for_timeout(2500)
            secs = page.locator(".sqllab")
            for i in range(secs.count()):
                secs.nth(i).locator("textarea").fill(SQL_FILL)
                secs.nth(i).get_by_role("button", name="Jalankan").click()
            page.wait_for_timeout(1500)
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(800)
            page.evaluate("window.scrollTo(0, 0)")
            r = page.evaluate(CHECK_JS)
            page.close()
            return r, ""
        except Exception as e:
            last_err = str(e)[:150]
            print(f"{name}: attempt {attempt+1} gagal: {last_err[:90]}", flush=True)
            page.close()
    return None, last_err

results, defects = {}, 0
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, name in VIEWPORTS:
        r, err = sweep_viewport(browser, width, name)
        if r is None:
            results[name] = {"loadError": err}
            defects += 1
            print(f"{name}: GAGAL", flush=True)
        else:
            n_over = len(r["overflowingElements"]) + len(r["unreachableControls"])
            if r["horizontalOverflow"] or n_over:
                defects += 1
            results[name] = r
            print(f"{name}: overflow={r['horizontalOverflow']} bad_elements={n_over}", flush=True)
    browser.close()

print(json.dumps({"defects": defects, "results": results}, indent=1)[:5000])
sys.exit(1 if defects else 0)
