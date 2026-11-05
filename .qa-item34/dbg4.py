#!/usr/bin/env python3
import pathlib
from playwright.sync_api import sync_playwright

CDN_DIR = pathlib.Path(__file__).parent / "cdn"
PYODIDE_DIR = CDN_DIR / "pyodide"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm", ".zip": "application/zip"}

def mock_cdn(page, log):
    def handle(route):
        url = route.request.url
        name = url.rsplit("/", 1)[-1].split("?")[0]
        cands = [CDN_DIR / name]
        if url.startswith("https://cdn.jsdelivr.net/pyodide/"):
            cands.insert(0, PYODIDE_DIR / name)
        for p in cands:
            if p.is_file():
                log.append(f"SERVED {name} ({p.stat().st_size}b)")
                route.fulfill(path=str(p), content_type=_MIME.get(p.suffix, "application/octet-stream"))
                return
        log.append(f"ABORT {url[:100]}")
        route.abort()
    page.route("https://cdn.jsdelivr.net/**", handle)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    log = []
    mock_cdn(pg, log)
    pg.on("console", lambda m: log.append(f"CONSOLE {m.type}: {m.text[:160]}"))
    pg.on("pageerror", lambda e: log.append(f"PAGEERROR: {str(e)[:200]}"))
    # 1) fetch langsung (uji route)
    pg.goto("http://localhost:3444/v2/lab-demo", wait_until="domcontentloaded", timeout=90000)
    st = pg.evaluate(
        "() => fetch('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js')"
        ".then(r => 'fetch-status:' + r.status).catch(e => 'fetch-ERR:' + e)"
    )
    print("direct fetch:", st, flush=True)
    # 2) worker importScripts seperti pyodide.worker.ts
    wres = pg.evaluate(
        """() => new Promise((resolve) => {
          const w = new Worker(URL.createObjectURL(new Blob([`
            try {
              importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
              postMessage('importScripts-ok loadPyodide=' + (typeof loadPyodide));
            } catch (e) { postMessage('importScripts-ERR: ' + e); }
          `], {type: 'text/javascript'})));
          const to = setTimeout(() => resolve('worker-timeout'), 30000);
          w.onmessage = (e) => { clearTimeout(to); resolve(e.data); };
          w.onerror = (e) => { clearTimeout(to); resolve('worker-onerror: ' + e.message); };
        })"""
    )
    print("worker importScripts:", wres, flush=True)
    # 3) loadPyodide penuh (seperti worker) — ukur waktu
    lres = pg.evaluate(
        """() => new Promise((resolve) => {
          const w = new Worker(URL.createObjectURL(new Blob([`
            try {
              importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
              const t0 = Date.now();
              loadPyodide().then(() => postMessage('loadPyodide-ok ' + (Date.now()-t0) + 'ms'))
                .catch(e => postMessage('loadPyodide-ERR: ' + (e && e.message)));
            } catch (e) { postMessage('importScripts-ERR: ' + e); }
          `], {type: 'text/javascript'})));
          const to = setTimeout(() => resolve('loadPyodide-timeout-60s'), 60000);
          w.onmessage = (e) => { clearTimeout(to); resolve(e.data); };
          w.onerror = (e) => { clearTimeout(to); resolve('worker-onerror: ' + e.message); };
        })"""
    )
    print("loadPyodide:", lres, flush=True)
    print("--- route log ---", flush=True)
    for l in log:
        print(l, flush=True)
    b.close()
