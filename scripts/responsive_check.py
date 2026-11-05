#!/usr/bin/env python3
"""Responsive sweep WAJIB untuk item upgrade Learn v2 (syarat Septian 2026-10-14 23:08).

Usage:
    .venv-qa/bin/python scripts/responsive_check.py <base_url> <url_path> [url_path ...]

Untuk tiap URL: load di viewport 375, 390 (mobile), 768 (tablet), 1280 (desktop),
lalu laporkan:
  - document.scrollWidth vs viewport width (overflow horizontal = cacat)
  - elemen yang terpotong keluar viewport horizontal (boundingBox)
  - kontrol interaktif (button/a/input/select/textarea/[role=button]) yang
    boundingBox-nya keluar viewport horizontal atau tidak terlihat = tak terjangkau

Exit code 0 = semua bersih, 1 = ada cacat (daftar di stdout JSON).

Catatan: server dev harus sudah jalan (next dev / next start) sebelum memanggil.
"""
import json
import sys
from playwright.sync_api import sync_playwright

VIEWPORTS = [(375, "mobile-375"), (390, "mobile-390"), (768, "tablet-768"), (1280, "desktop-1280")]

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
    // melebar ke kanan melampaui viewport
    if (r.right > vw + 1 || r.left < -1) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined) ? String(el.className.baseVal || '') : String(el.className || ''),
        id: el.id || '',
        left: Math.round(r.left), right: Math.round(r.right),
        text: (el.innerText || '').slice(0, 60).replace(/\\s+/g, ' '),
      });
    }
  });
  const ctrls = [];
  document.querySelectorAll('button, a, input, select, textarea, [role="button"]').forEach((el) => {
    if (isHidden(el)) return;
    const r = el.getBoundingClientRect();
    const unreachable = r.right > vw + 1 || r.left < -1 || r.width === 0;
    if (unreachable) {
      ctrls.push({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.value || el.getAttribute('aria-label') || '').slice(0, 60).replace(/\\s+/g, ' '),
        left: Math.round(r.left), right: Math.round(r.right),
      });
    }
  });
  return { viewport: vw, scrollWidth: sw, horizontalOverflow: sw > vw + 1,
           overflowingElements: out.slice(0, 25), unreachableControls: ctrls.slice(0, 25) };
}"""

def main():
    if len(sys.argv) < 3:
        print("usage: responsive_check.py <base_url> <url_path> [url_path ...]", file=sys.stderr)
        sys.exit(2)
    base, paths = sys.argv[1], sys.argv[2:]
    results, defects = {}, 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for path in paths:
            url = base + path
            results[url] = {}
            for width, name in VIEWPORTS:
                page = browser.new_page(viewport={"width": width, "height": 844})
                try:
                    page.goto(url, wait_until="networkidle", timeout=30000)
                except Exception as e:  # noqa: BLE001
                    results[url][name] = {"loadError": str(e)[:200]}
                    page.close()
                    continue
                page.wait_for_timeout(1200)  # biarkan hydration selesai
                rep = page.evaluate(CHECK_JS)
                rep["clean"] = (not rep["horizontalOverflow"]
                                and not rep["overflowingElements"]
                                and not rep["unreachableControls"])
                if not rep["clean"]:
                    defects += 1
                results[url][name] = rep
                page.close()
        browser.close()
    print(json.dumps({"defects": defects, "results": results}, indent=1, ensure_ascii=False))
    sys.exit(1 if defects else 0)

if __name__ == "__main__":
    main()
