#!/usr/bin/env python3
"""QA fungsional ITEM 3 (SqlLab) + ITEM 4 (EChartFigure) di /v2/lab-demo,
plus regresi lab Pyodide di /v2/learn/a11-tipe-data."""
import sys
from playwright.sync_api import sync_playwright
import pathlib
CDN_DIR = pathlib.Path(__file__).parent / "cdn"
PYODIDE_DIR = CDN_DIR / "pyodide"
_MIME = {".js": "application/javascript", ".wasm": "application/wasm", ".zip": "application/zip"}

def mock_cdn(page):
    """Sajikan file CDN dari disk lokal (browser sandbox tak bisa keluar via proxy).
    Kode produksi tetap memakai URL CDN — ini murni test-double QA."""
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


BASE = "http://localhost:3444"
results = []

def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" - {detail}" if detail else ""), flush=True)

SQL1_SOLUTION = """SELECT n.segmen AS segmen,
       COUNT(*) AS total_pinjaman,
       SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) AS npl,
       1.0 * SUM(CASE WHEN p.status IN ('diragukan', 'macet') THEN 1 ELSE 0 END) / COUNT(*) AS npl_rate
FROM pinjaman p
JOIN nasabah n ON n.id = p.nasabah_id
GROUP BY n.segmen
ORDER BY n.segmen;"""

SQL2_SOLUTION = """SELECT t.nasabah_id AS nasabah_id,
       n.nama AS nama,
       SUM(t.nominal) AS total_debit
FROM transaksi t
JOIN nasabah n ON n.id = t.nasabah_id
WHERE t.jenis = 'debit'
  AND t.channel = 'mobile'
  AND t.tanggal LIKE '2025%'
GROUP BY t.nasabah_id, n.nama
ORDER BY total_debit DESC, t.nasabah_id ASC
LIMIT 5;"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    mock_cdn(pg)
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))

    pg.goto(BASE + "/v2/lab-demo", wait_until="domcontentloaded", timeout=90000)
    pg.wait_for_function(
        "() => document.querySelectorAll('.sqllab').length === 2 && "
        "[...document.querySelectorAll('.sqllab .status')].every(s => s.textContent.includes('SQL siap'))",
        timeout=120000,
    )
    check("sql.js termuat (2 lab 'SQL siap')", True)

    sec1 = pg.locator('section[aria-label="Lab SQL"]')
    sec2 = pg.locator('section[aria-label="Lab SQL lanjutan"]')

    # --- ITEM 3a: query BENAR -> Periksa PASS + tabel tampil ---
    sec1.locator("textarea").fill(SQL1_SOLUTION)
    sec1.get_by_role("button", name="Periksa").click()
    pg.wait_for_function(
        "() => document.querySelector('section[aria-label=\"Lab SQL\"] .feedback') !== null",
        timeout=30000,
    )
    fb = sec1.locator(".feedback")
    fbtext = fb.inner_text()
    check("query benar -> 'Benar'", "Benar" in fbtext, fbtext[:80])
    check("feedback punya class pass", "pass" in (fb.get_attribute("class") or ""))
    ths = sec1.locator(".sqlres thead th")
    check("tabel hasil 4 kolom", ths.count() == 4, f"count={ths.count()}")
    check("nama kolom sesuai", [ths.nth(i).inner_text() for i in range(4)] == ["segmen", "total_pinjaman", "npl", "npl_rate"])
    rows = sec1.locator(".sqlres tbody tr")
    check("tabel hasil 3 baris (segmen)", rows.count() == 3, f"count={rows.count()}")
    r1 = rows.nth(0).inner_text()
    check("baris pertama = segmen Mikro (4 sel)", "Mikro" in r1 and len(r1.split("\t")) == 4, r1[:60])

    # --- ITEM 3b: query SALAH -> ditolak dengan pesan jelas ---
    sec2.locator("textarea").fill("SELECT id, nama FROM nasabah LIMIT 5;")
    sec2.get_by_role("button", name="Periksa").click()
    pg.wait_for_function(
        "() => document.querySelector('section[aria-label=\"Lab SQL lanjutan\"] .feedback') !== null",
        timeout=30000,
    )
    fb2 = sec2.locator(".feedback").inner_text()
    check("query salah -> 'Belum tepat'", "Belum tepat" in fb2, fb2[:100])
    check("pesan jelas menyebut kolom/baris", ("Kolom" in fb2 or "kolom" in fb2 or "baris" in fb2), fb2[:120])

    # --- ITEM 3c: DDL diblokir dengan pesan ramah ---
    sec2.locator("textarea").fill("DROP TABLE nasabah;")
    sec2.get_by_role("button", name="Jalankan").click()
    err2 = sec2.locator(".out-err").inner_text()
    check("DROP TABLE ditolak ramah", "tidak diizinkan" in err2 and "DDL" in err2, err2[:80])

    # --- ITEM 3d: query benar tugas 2 (orderMatters) ---
    sec2.locator("textarea").fill(SQL2_SOLUTION)
    sec2.get_by_role("button", name="Periksa").click()
    pg.wait_for_function(
        "() => document.querySelector('section[aria-label=\"Lab SQL lanjutan\"] .feedback.pass') !== null",
        timeout=30000,
    )
    check("tugas 2 (ORDER/LIMIT) -> Benar", True)

    # --- ITEM 3e: syntax error SQLite tampil jelas ---
    sec1.locator("textarea").fill("SELECT FROM WHERE")
    sec1.get_by_role("button", name="Jalankan").click()
    err1 = sec1.locator(".out-err").inner_text()
    check("syntax error tampil", "SQLite" in err1 or "syntax" in err1.lower(), err1[:80])

    # --- ITEM 4: ECharts ter-render ---
    pg.wait_for_function("() => !!window.echarts", timeout=60000)
    check("window.echarts ada", True)
    figs = pg.locator(".echart-canvas")
    check("3 container EChartFigure", figs.count() == 3, f"count={figs.count()}")
    pg.wait_for_timeout(2500)
    canvases = pg.locator(".echart-canvas canvas")
    per = [pg.locator(".echart-canvas").nth(i).locator("canvas").count() for i in range(3)]
    check("tiap chart render >=1 <canvas>", all(n >= 1 for n in per), f"per-container={per}")
    sizes = [canvases.nth(i).bounding_box() for i in range(3)]
    check("canvas berukuran nyata", all(s and s["width"] > 200 and s["height"] > 200 for s in sizes),
          str([(round(s["width"]), round(s["height"])) for s in sizes if s]))
    caps = pg.locator(".efig figcaption")
    check("3 caption tampil", caps.count() == 3)

    check("tidak ada pageerror JS", len(errs) == 0, "; ".join(errs[:3]))

    # --- REGRESI: lab Pyodide tetap jalan ---
    pg2 = b.new_page(viewport={"width": 1280, "height": 900})
    mock_cdn(pg2)
    perrs = []
    pg2.on("pageerror", lambda e: perrs.append(str(e)))
    pg2.goto(BASE + "/v2/learn/a11-tipe-data", wait_until="domcontentloaded", timeout=90000)
    pg2.wait_for_selector(".pane-right", timeout=30000)
    pg2.wait_for_function(
        "() => [...document.querySelectorAll('.pane-right .status')].some(s => s.textContent.includes('Python siap'))",
        timeout=240000,
    )
    check("Pyodide 'Python siap' di lesson a11", True)
    pg2.locator(".v2ed-area").fill(
        'rata = sum(skor) / len(skor)\nmacet = skor.count(5) / len(skor)\n\nprint(f"rata={rata}  macet={macet}")'
    )
    pg2.get_by_role("button", name="Jalankan").first.click()
    pg2.wait_for_function(
        "() => { const el = document.querySelector('.pane-right .console-body .out, .pane-right .console-body .out-err'); return el && el.textContent.includes('rata='); }",
        timeout=60000,
    )
    out = pg2.locator(".pane-right .console-body").inner_text()
    check("Pyodide run -> output rata=1.5 macet=0.1", "rata=1.5" in out and "macet=0.1" in out, out[:100])
    pg2.get_by_role("button", name="Periksa").first.click()
    pg2.wait_for_selector(".pane-right .feedback", timeout=60000)
    fbpy = pg2.locator(".pane-right .feedback").inner_text()
    check("Pyodide Periksa -> Benar", "Benar" in fbpy, fbpy[:80])
    check("regresi: tidak ada pageerror", len(perrs) == 0, "; ".join(perrs[:3]))
    b.close()

fails = [r for r in results if not r[1]]
print(f"\n{len(results) - len(fails)}/{len(results)} lolos", flush=True)
sys.exit(1 if fails else 0)
