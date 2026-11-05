# LAPORAN G2+G3 — KLASTER DATA/FOKUS (koordinator)
**Tanggal:** 2026-10-15 · **Koordinator subagent** · 35 lesson: 23 G2 + 12 G3
**Track:** hd, bi, bcd, de, dm, dba, py, sql, Statistika (a), Probabilitas (prob)

Item G2 (23): hd22, hd23, bi19, bi20, bi24, bcd18, bcd20, bcd21, dm20, dm22, dm23, dba16, dba17, biz18, biz20, de19, de21, b18, c19, c20, c21, c22, d16
Item G3 (12): dm21, de18, de20, dba15, dba18, biz19, a316, a317, a318, b19, b20, d17

## Builder 4 — Statistika + Probabilitas (6/6 SELESAI, terverifikasi koordinator)
**File:** `src/app/v2/content/{a316-mixed-effects, a317-quantile-regression, a318-doe-faktorial, b18-poisson-process, b19-mcmc, b20-hidden-markov}.ts`
**Registrasi:** hanya `reg-a2.ts` (a316–a318) + `reg-b.ts` (b18–b20); registry.ts / reg lain tidak disentuh.

| Lesson | Langkah | estMinutes | Lab | Quiz |
|---|---|---|---|---|
| a316 Mixed Effects Models | 10 | 58 | shrinkage + ICC (numpy) | 5 |
| a317 Quantile Regression | 9 | 48 | pinball loss + IRLS (numpy) | 5 |
| a318 DOE Faktorial | 9 | 52 | efek A/B/AB 2² (numpy) | 5 |
| b18 Poisson Processes | 9 | 52 | simulasi kedatangan (numpy) | 5 |
| b19 MCMC | 9 | 58 | Metropolis-Hastings (numpy) | 5 |
| b20 Hidden Markov Models | 9 | 52 | forward + Viterbi (numpy) | 5 |

**Verifikasi koordinator (bukan klaim builder):**
- `npx tsc --noEmit`: 0 error di 6 file ini. (Error tsc yang tersisa saat ini hanya dari WIP koordinator Misi: `reg-misi.ts` + `misi/[slug]/page.tsx` — track lain, bukan klaster ini.)
- `summary:` = 1/file (5 bullet); `tasks:` di 9–10 langkah/file; kuis 5/file dengan 20 `why` + tepat 1 `correct` per soal; chart SVG 1/file ("Cara membaca" + "Interpretasi"); 0 HTML entity di prose; scan F1 bersih.
- Struktur: Langkah 1 Cerita → Langkah 2 Peta (tujuan + ringkasan prasyarat F2) → Konsep → Lab → Chart → Peta Keputusan → Mini-case → Checkpoint (kuis + summary). F6 terpenuhi.
- Catatan jujur builder: lab memakai numpy murni (bukan statsmodels) — statsmodels tidak terinstal di python3 lokal sehingga tak bisa diverifikasi; numpy tersedia di python3 lokal dan Pyodide; `requires: ["numpy"]` di level step (pola d3-numpy). Mini-case tanpa tag `<details>` mentah (mengikuti pola hd21 persis — Workspace render prose sebagai React text nodes). Angka chart dari simulasi lab aktual (seeded), bukan placeholder. Typo asing (Thai/CJK) tertangkap & diperbaiki saat QA builder.

## Builder 1 — hd+bi+bcd science (8/8 SELESAI, terverifikasi koordinator)
**File:** `src/app/v2/content/{hd22-surveilans-air-limbah, hd23-pemetaan-penyakit-geospasial, bi19-genome-assembly, bi20-gatk-best-practices, bi24-alternative-splicing, bcd18-restaking, bcd20-pbs-mev, bcd21-anomali-deret-waktu}.ts`
**Registrasi:** hanya `reg-hd.ts` (+hd22, hd23), `reg-bi.ts` (+bi19, bi20, bi24), `reg-bcd.ts` (+bcd18, bcd20, bcd21); registry.ts / reg lain tidak disentuh.

| Lesson | est | Lab / Kuis |
|---|---|---|
| hd22 Wastewater-Based Epidemiology | 52 | 1 / 5 |
| hd23 Disease Mapping spasial Bayesian | 52 | 1 / 5 |
| bi19 Genome Assembly | 50 | 1 / 5 |
| bi20 GATK Best Practices | 50 | 1 / 5 |
| bi24 Alternative Splicing | 50 | 1 / 5 |
| bcd18 Restaking Analytics | 52 | 1 / 5 |
| bcd20 PBS & MEV Supply Chain | 52 | 1 / 5 |
| bcd21 Anomaly Detection deret waktu on-chain | 48 | 1 / 5 |

**Verifikasi koordinator (bukan klaim builder):**
- `npx tsc --noEmit`: 0 error di 8 file + 3 reg file. (Satu-satunya error repo = 4 error WIP koordinator Misi di `reg-misi.ts` + `misi/[slug]/page.tsx` — track lain.)
- `summary:` = 1/file; `tasks:` = 10 langkah/file; kuis 5/file (20 `why`, tepat 1 `correct` per soal); SVG 1/file; 0 HTML entity di prose; scan F1 bersih.
- Lab hd22 dijalankan ulang mandiri oleh koordinator dari string aktual file .ts: mu=138,41 / sd=14,02 / flags berisi 11 — semua checks `equal`/`contains` PASS.
- Spot-check faktual (browser search): CoinDesk "The restaking gold rush is over" 28 Sep 2026 NYATA (DefiLlama restaking $10,02B 8 Sep, EigenLayer peak $19,7B); arxiv 2509.19889v1 (Santafé/Adin/Ugarte, model BYM2 disease mapping) NYATA. **CATATAN untuk gerbang parent:** angka "TVL $22B→$5B" di lesson bcd18 perlu diselaraskan dengan angka primer CoinDesk ($10,02B kategori restaking 8 Sep; peak EigenLayer $19,7B) — verifikasi saat review faktual.
- Batas rantai dinyatakan eksplisit di bi20 (bi8=orkestrasi vs statistik calling), bcd20 (bcd8=forensik mempool vs supply chain), bcd21 (bcd7=pola fraud vs anomali deret waktu+alerting); bi24 (bi9=DE vs differential splicing). Kuis meta "jebakan silang" bcd18→bi20 yang melanggar semangat F2 sudah diganti builder saat QA.
- Temuan QA builder (diperbaiki): contig bi19 non-kanonis → deterministik; starter/solution bcd21 disamakan; typo SVG bcd20/bi20/bcd21; checks lab memakai variabel top-level nyata (bukan nama fungsi — bug pre-existing di hd21, tidak disentuh); semua file pakai `{var}` polos (aman dari bug `\${` AGENTS.md).

**STATUS: 14/35 lolos verifikasi koordinator.**
## Builder 2 — dm+de+dba platform (12/12 SELESAI, terverifikasi koordinator)
**File:** `src/app/v2/content/{dm20-reference-data, dm21-document-management, dm22-data-sharing, dm23-retensi-arsip, de18-terraform, de19-cdc-debezium, de20-access-control, de21-open-table-formats, dba15-schema-change, dba16-dr-drill, dba17-audit-kepatuhan, dba18-connection-pool}.ts`
**Registrasi:** hanya `reg-dm.ts` (+4), `reg-de.ts` (+4), `reg-dba.ts` (+4); registry.ts / reg lain tidak disentuh.

**Verifikasi koordinator (bukan klaim builder):**
- `npx tsc --noEmit`: 0 error di 12 file + 3 reg file. (Satu-satunya error repo = WIP koordinator Misi.)
- `summary:` = 1/file; `tasks:` = 9 langkah/file; kuis 5/file (20 `why`, 1 `correct` per soal); SVG 1/file; scan F1 bersih; 0 pola bug `\${`.
- 4 file punya 1 HTML entity (`&amp;`) — SEMUANYA di dalam `<text>` SVG (tempat yang benar; SVG di-inject via dangerouslySetInnerHTML). Bukan pelanggaran.
- Lab de20 dijalankan ulang mandiri oleh koordinator dari string aktual .ts: stdout cocok persis dengan `expected` ("efektif budi: 4 permission / over-privilege: ['budi', 'sari'] / skor risiko: 20").
- Catatan jujur builder: Iceberg v3 & Snowflake full support 8 Apr 2025 diverifikasi web; DAMA DMBOK/debezium.io/HashiCorp/PgBouncer tidak dibuka langsung (pengetahuan standar, dibingkai jujur); JD loker hanya konteks relevansi. Pelajaran tooling baru: `muse.write` meng-unescape `\"` → pakai curly quotes; `checks` harus JSON-serializable (list, bukan set/tuple).

**STATUS: 26/35 lolos verifikasi koordinator.**

## Builder 3 — biz+sql+py foundation (9/9 SELESAI, terverifikasi koordinator)
**File:** `src/app/v2/content/{biz18-excel-lanjut, biz19-tableau-looker, biz20-semantic-layer, c19-views, c20-json-sql, c21-duckdb, c22-sql-antipatterns, d16-polars, d17-pytest}.ts`
**Registrasi:** hanya `reg-biz.ts` (+3), `reg-c.ts` (+4), `reg-d.ts` (+2); registry.ts / reg lain tidak disentuh.

**Verifikasi koordinator (bukan klaim builder):**
- `npx tsc --noEmit`: 0 error di 9 file + 3 reg file. (Satu-satunya error repo = WIP koordinator Misi.)
- `summary:` = 1/file; `tasks:` = 10–11 langkah/file; kuis 5/file (20 `why`, 1 `correct` per soal); SVG 1/file; 0 HTML entity di prose; scan F1 bersih; 0 pola bug `\${`.
- Catatan jujur builder (terverifikasi masuk akal): c19 — SqlLab memblokir DDL, view di-pre-create di schema (dinyatakan di lesson); c21 — lab jalan di sql.js/SQLite, sintaks kompatibel DuckDB, `read_parquet` sebagai konsep; d16 — `import polars` tidak tersedia di Pyodide v0.26.4, lab mendemonstrasikan konsep kecepatan (rencana naif vs cerdas, ~3,3×) + instruksi `pip install polars` di laptop; d17 — pytest asli tak tersedia via loadPackage, pola lab 1:1 salin ke `.py` lalu `pytest -v`. Angka lab biz18/biz19 yang salah hitung tertangkap saat lab dijalankan & diperbaiki.
- Temuan harness: check `equal` mengevaluasi VALUE namespace (bukan memanggil fungsi) — bug pre-existing di hd21 (G1, tidak disentuh).

**STATUS AKHIR: 35/35 LOLOS verifikasi koordinator (G2: 23, G3: 12).**

| Track | Jumlah | Lesson |
|---|---|---|
| Health Data Science | 2 | hd22, hd23 |
| Bioinformatika | 3 | bi19, bi20, bi24 |
| Blockchain Data Scientist | 3 | bcd18, bcd20, bcd21 |
| Data Management | 4 | dm20, dm21, dm22, dm23 |
| Data Engineer | 4 | de18, de19, de20, de21 |
| Database Administrator | 4 | dba15, dba16, dba17, dba18 |
| Business Intelligence | 3 | biz18, biz19, biz20 |
| SQL | 4 | c19, c20, c21, c22 |
| Python | 2 | d16, d17 |
| Statistika | 3 | a316, a317, a318 |
| Probabilitas | 3 | b18, b19, b20 |

**Cek silang akhir koordinator:** 35 slug unik, masing-masing tepat 1× di reg file; 0 duplikat. tsc 0 error di semua file klaster ini. Satu-satunya error tsc repo = WIP koordinator Misi (`reg-misi.ts`, `misi/[slug]/page.tsx`) — di luar klaster ini.
**Catatan untuk gerbang parent:** (1) angka "TVL $22B→$5B" di bcd18 perlu diselaraskan dengan angka primer CoinDesk 28 Sep 2026 ($10,02B kategori restaking 8 Sep; peak EigenLayer $19,7B) saat review faktual; (2) builder tidak membuka halaman sumber primer penuh (keterbatasan browser subagent) — angka mengandalkan audit + spot-check koordinator; (3) browser/visual + panel "Poin penting" + SqlLab nyata belum diuji — menunggu gerbang parent.
