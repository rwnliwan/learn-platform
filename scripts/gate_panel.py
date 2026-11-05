#!/usr/bin/env python3
"""Gate tambahan G1: panel 'Poin penting' WAJIB berisi di LANGKAH 1
(aturan dari bug on-device 2026-10-15) + 0 pageerror, di lesson lama
target patch dan lesson G1 baru."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3111"
SLUGS = [
    "fr6-feature-engineering",      # lesson lama, lokasi bug dilaporkan
    "aml17-fusion-center",          # 1 dari 10 file yang ditambah summary
    "wqb22-margin-kapasitas",       # G1 + file yang diperbaiki parent (tasks)
    "hd21-farmakovigilans",         # G1 Fokus
    "bcd16-stablecoin-analytics",   # G1 Fokus (RISIKO RANTAI)
    # --- sampel G2/G3 (gerbang 2026-10-15 siang) ---
    "aie17-visual-retrieval",
    "mk21-server-side",
    "dba15-schema-change",
    "bcd18-restaking",
    "a317-quantile-regression",
    "dle16-multimodal-clip",
    "pm-d9-cppi",
    "de20-access-control",
    "biz18-excel-lanjut",
    "c21-duckdb",
    "mr26-tail-risk-hedging",
    "mle21-ann-vector-search",
]
MISI = [
    "misi-dbd-surveilans",
    "misi-jejak-dana-blockchain",
    "misi-lab-sampel-tertukar",
    "misi-var-backtest",
    "misi-stress-korelasi",
    "misi-rekonsiliasi-laporan",
    "misi-laporan-dua-sumber",
    "misi-pinjaman-pertama",
    "misi-npl-tersembunyi",
    "misi-kartu-hantu",
    "misi-jaring-mule",
    "misi-audit-imunisasi-who",
    "misi-kontaminasi-platform",
    "misi-orakel-buta-blockchain",
    "misi-dashboard-regulator",
    "misi-dua-definisi-revenue",
    "misi-pipeline-kotor-python",
    "misi-kegagalan-diam-pipeline",
    "misi-laporan-bulanan-sql",
    "misi-dua-sumber-tidak-cocok",
    "misi-katalog-data-hilang",
    "misi-lineage-terputus",
    "misi-etl-telat-backfill",
    "misi-kontrak-skema-retak",
    "misi-migrasi-tanpa-downtime",
    "misi-indeks-hantu",
    "misi-diagnosa-overfitting",
    "misi-kebocoran-fitur",
    "misi-neuron-mati",
    "misi-jadwal-lr",
    "misi-drift-produksi",
    "misi-pipeline-tak-reproduksibel",
    "misi-biaya-inferensi",
    "misi-halusinasi-monitor",
    "misi-grounding-rag",
    "misi-chunking-buruk",
    "misi-audit-agen",
    "misi-loop-tak-berujung",
    "misi-triage-alpha",
    "misi-turnover-trap",
    "misi-sampel-menyanjung",
    "misi-taman-p-hack",
    "misi-bayes-terbalik",
    "misi-kehancuran-penjudi",
    "misi-kurva-menipu",
    "misi-arbitrase-rapi",
    "misi-markowitz-optimis",
    "misi-rebalance-frenesi",
    "misi-atribusi-menipu",
    "misi-ab-berhenti-dini",
    "misi-gabung-berkas-ganda",
    "misi-gabung-jejak-lapis",
    "misi-gabung-stress-portofolio",
    "misi-gabung-dashboard-auditor",
    "misi-gabung-uji-ab-jujur",
    "misi-gabung-monte-carlo",
    "misi-gabung-rebalance-krisis",
    "misi-gabung-anggaran-risiko",
    "misi-gabung-jembatan-lintas",
    "misi-gabung-pipeline-kotor",
    "misi-gabung-query-ke-dashboard",
    "misi-gabung-lineage-governance",
    "misi-gabung-feature-store",
    "misi-gabung-migrasi-warisan",
    "misi-gabung-dashboard-jujur",
    "misi-gabung-surveilans-genomik",
    "misi-gabung-vcf-ke-laporan",
    "misi-gabung-atribusi-model",
    "misi-gabung-notebook-produksi",
    "misi-gabung-training-skala",
    "misi-gabung-serving-llm",
    "misi-gabung-evaluasi-agen",
    "misi-gabung-rag-agen",
    "misi-gabung-biaya-agen",
    "misi-gabung-pipeline-alpha",
]

fails = 0
with sync_playwright() as pw:
    b = pw.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    for slug in SLUGS:
        pg.goto(f"{BASE}/v2/learn/{slug}", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        # panel kanan: cari elemen berisi teks 'Poin penting', hitung <li> di panelnya
        res = pg.evaluate("""() => {
          const heads = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Poin penting');
          if (!heads.length) return {found: false, n: 0};
          let panel = heads[0];
          for (let i = 0; i < 6 && panel.parentElement; i++) {
            panel = panel.parentElement;
            const lis = panel.querySelectorAll('li');
            if (lis.length) return {found: true, n: lis.length};
          }
          return {found: true, n: 0};
        }""")
        ok = res["found"] and res["n"] >= 3
        print(("PASS" if ok else "FAIL"), slug, "-> poin di langkah 1:", res["n"])
        if not ok:
            fails += 1
    # --- misi: galeri render + runner terbuka + briefing tampil, 0 pageerror ---
    pg.goto(f"{BASE}/v2/misi", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    gal = pg.evaluate("() => document.body.innerText.includes('misi-dbd') || document.body.innerText.length > 200")
    print(("PASS" if gal else "FAIL"), "galeri /v2/misi render")
    if not gal:
        fails += 1
    for slug in MISI:
        pg.goto(f"{BASE}/v2/misi/{slug}", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(3000)
        res = pg.evaluate("""() => {
          const heads = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Poin penting');
          let n = 0;
          if (heads.length) {
            let panel = heads[0];
            for (let i = 0; i < 6 && panel.parentElement; i++) { panel = panel.parentElement; const lis = panel.querySelectorAll('li'); if (lis.length) { n = lis.length; break; } }
          }
          return {panel: heads.length > 0, n, text: document.body.innerText.length};
        }""")
        ok = res["text"] > 300 and res["panel"] and res["n"] >= 3
        print(("PASS" if ok else "FAIL"), slug, "-> runner, panel poin:", res["n"], "teks:", res["text"])
        if not ok:
            fails += 1
    print("pageerrors:", len(errors), errors[:2])
    if errors:
        fails += 1
    b.close()
print("=== PANEL GATE:", "ALL PASS" if fails == 0 else f"{fails} FAIL")
sys.exit(1 if fails else 0)
