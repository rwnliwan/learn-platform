#!/usr/bin/env python3
import pathlib
from playwright.sync_api import sync_playwright

CDN_DIR = pathlib.Path(__file__).parent / "cdn"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm"}

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 375, "height": 844})
    def handle(route):
        url = route.request.url
        name = url.rsplit("/", 1)[-1].split("?")[0]
        pp = CDN_DIR / name
        print(f"ROUTE {name} -> {'FULFILL' if pp.is_file() else 'ABORT'}", flush=True)
        if pp.is_file():
            route.fulfill(path=str(pp), content_type=_MIME.get(pp.suffix, "application/octet-stream"))
        else:
            route.abort()
    pg.route("https://cdn.jsdelivr.net/**", handle)
    pg.on("requestfinished", lambda r: print("FINISHED", r.url.rsplit("/",1)[-1][:40], flush=True) if "jsdelivr" in r.url else None)
    pg.on("requestfailed", lambda r: print("FAILED", r.url.rsplit("/",1)[-1][:40], r.failure, flush=True) if "jsdelivr" in r.url else None)
    pg.on("console", lambda m: print("CONSOLE", m.type, m.text[:120], flush=True) if m.type in ("error","warning") else None)
    pg.goto("http://localhost:3444/v2/lab-demo", wait_until="domcontentloaded", timeout=60000)
    # uji manual: buat script tag sendiri dan lihat onload/onerror
    r = pg.evaluate("""() => new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/sql.js@1/dist/sql-wasm.js';
      s.onload = () => resolve('onload initSqlJs=' + typeof window.initSqlJs);
      s.onerror = () => resolve('onerror');
      setTimeout(() => resolve('timeout-neither'), 20000);
      document.head.appendChild(s);
    })""")
    print("manual script tag:", r, flush=True)
    b.close()
