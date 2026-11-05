# LAPORAN C4 — Gelombang SQL + Python ke Level Advanced (2026-10-16)

**Status: SELESAI & terverifikasi parent.** 41 lesson (23 SQL + 18 Python) diperdalam ke level advanced. Tidak ada deploy (sesuai perintah). Tepat 41 file `c*.ts` + `d*.ts` tersentuh; tidak ada file lain (verifikasi mtime + audit).

## 0. Angka final (verifikasi parent — audit ulang dari registry, model identik 14 Okt)

| Metrik | SQL | Python |
|---|---|---|
| Rata-rata track | 44,0 → **50,3** | 42,2 → **55,0** |
| Lesson <45 mnt | 17 → **0** | 12 → **0** |
| Rentang durasi | 30,5–56,2 → **46,0–59,1** | 27,2–65,0 → **49,6–66,2** |
| Lesson dgn komponen hilang | 23 → **0** | 12 → **0** |
| `tsc --noEmit` | **0 error** | **0 error** |

- **Platform keseluruhan:** lesson <45 mnt **181 → 152** dari 607 (29 lesson terangkat: 17 SQL + 12 Python; perhitungan konsisten: 181−12−17=152 — selisih yang ditanyakan worker SQL terjawab: baseline audit-nya basi dari era C3, sebelum edit Python masuk bundle).
- **Tidak ada lesson yang mepet 45** (terendah: SQL 46,0, Python 49,6). Tidak ada yang menembus 60 (tertinggi: c22 59,1; d1 66,2 — di bawah batas 70 sesuai brief; d2 60,4 & d5 60,1 preseden C2 diterima).
- Note "Intuisi:" = 1 per file di 41/41 file (grep terverifikasi).

## 1. Rincian per lesson — SQL (sebelum → sesudah; estMinutes kelipatan 5)

| File | → | est | Ditambahkan (advanced) |
|---|---|---|---|
| c1-select-dasar | 44,9 → 48,3 | 50 | intuisi + "Column pruning & LIMIT jujur" (pushdown, bahaya SELECT * produksi, LIMIT tanpa ORDER BY non-deterministik) |
| c2-null-logika | 44,6 → 48,3 | 50 | intuisi + "Jebakan three-valued logic" (WHERE/JOIN/NOT IN vs NOT EXISTS + NULL) |
| c3-agregasi-groupby | 46,4 → 48,7 | 50 | intuisi + "FILTER, ROLLUP, biaya DISTINCT" |
| c4-fungsi-tanggal-string | 42,3 → 48,0 | 50 | intuisi + 2 langkah: kebenaran timezone (UTC/edge, DST) & sargable lanjut |
| c5-join | 46,1 → 48,5 | 50 | intuisi + "Algoritma join" (nested loop/merge/hash, skew, semi/anti-join rewrite) |
| c6-subquery | 43,9 → 48,7 | 50 | intuisi + 2 langkah: correlated & LATERAL + EXISTS vs IN vs JOIN |
| c7-cte | 37,6 → 47,5 | 50 | intuisi + 2 langkah: materialisasi CTE (optimization fence, MATERIALIZED, pushdown) & CTE vs temp table |
| c8-union-set | 37,2 → 47,9 | 50 | intuisi + 2 langkah: harga UNION (sort-unique O(n log n)) & anti-join trio |
| c9-window-functions-1 | 37,6 → 57,3 | 55 | intuisi + 2 langkah prose (frame ROWS vs RANGE mendalam, skew partisi) + **lab frame** (buktikan ROWS≠RANGE) |
| c9-window-functions-2 | 41,7 → 47,3 | 50 | intuisi + 2 langkah: dedup ROW_NUMBER deterministik & RANK vs DENSE_RANK vs ROW_NUMBER |
| c10-dedupe-pivot-yoy | 42,0 → 47,5 | 50 | intuisi + 2 langkah: dedup & pivot skala + YoY robust (tahun 53-minggu, efek weekday) |
| c11-cohort-retention-funnel | 42,1 → 47,4 | 50 | intuisi + 2 langkah: date spine & definisi funnel + cohort value (NRR, churn, payback) |
| c12-recursive-cte | 37,3 → 47,4 | 50 | intuisi + 3 langkah: rekursi produksi (BOM, cycle detection, terminasi), rekursi vs aplikasi, pola ring fraud |
| c13-risiko-dpd-rollrate | 42,4 → 47,5 | 50 | intuisi + 2 langkah: as-of join & vintage + roll rate → PD (rantai Markov, backtest proyeksi) |
| c14-fraud-velocity | 38,0 → 47,8 | 50 | intuisi + 3 langkah: velocity skala (self-join O(n×w), pra-agregasi bucket), aturan bertingkat (ekonomi alert Rp), velocity untuk ML |
| c15-data-quality | 42,4 → 47,8 | 50 | intuisi + 2 langkah: assertion DQ (6 expectation kanonis) & freshness & drift |
| c16-data-modeling | 34,6 → 46,9 | 50 | intuisi + "SCD-2 yang benar" + **lab as-of** (query SCD-2 historis) |
| c17-index-explain | 30,5 → 46,0 | 50 | intuisi + 2 langkah (composite & covering; partial & expression) + **lab index** (CREATE INDEX, SCAN → SEARCH USING COVERING INDEX) |
| c18-transaksi-acid | 35,4 → **56,9** | 55 | intuisi + 2 langkah (write skew; pola retry) + 2 quiz baru + **lab atomik & kunci** — lihat §4 |
| c19-views | 54,9 → 58,4 | 60 | intuisi + penguatan ujung (definer/invoker, WITH CHECK OPTION) |
| c20-json-sql | 55,1 → 56,1 | 55 | intuisi saja — dinilai sudah advanced (lihat §3) |
| c21-duckdb | 54,8 → 57,7 | 60 | intuisi + penguatan ujung (partisi Parquet/pruning, batas jujur DuckDB) |
| c22-sql-antipatterns | 56,2 → 59,1 | 60 | intuisi singkat + penguatan ujung (keyset pagination, EAV) — dijaga ≤60 |

## 2. Rincian per lesson — Python (sebelum → sesudah)

| File | → | est | Ditambahkan (advanced) |
|---|---|---|---|
| d1-python-dasar | 65,0 → 66,2 | 65 | note Intuisi (170 kata; singkat agar <70) |
| d2-struktur-data | 59,2 → 60,4 | 60 | note Intuisi |
| d3-numpy | 50,9 → 52,1 | 50 | note Intuisi (berpikir array; view vs copy) |
| d4-pandas-dasar | 44,4 → 55,1 | 55 | prose (chaining, copy-on-write, indexing) + mini-case (Rp 84 M) + intuisi |
| d5-data-cleaning | 58,9 → 60,1 | 60 | note Intuisi |
| d6-wrangling | 42,0 → 53,7 | 55 | prose (validasi merge, explode, categorical) + **lab merge aman** (`validate`, `indicator`) + intuisi |
| d7-datetime-timeseries | 43,9 → 54,2 | 55 | prose (tz-aware, resample vs rolling, DST) + mini-case (Rp 1,2 M) + intuisi |
| d8-visualisasi-1 | 36,0 → 54,2 | 55 | prose (figure vs axes, honest axes, banking 45°) + **lab mini-case sumbu jujur** (6,2×) + intuisi |
| d8-visualisasi-2 | 27,5 → 55,1 | 55 | **2 lab** (CI/error-bar; faceting small-multiples) + mini-case (Rp 12 M) + intuisi |
| d9-eda | 36,0 → 54,4 | 55 | prose (profiling, kardinalitas, MCAR/MAR/MNAR) + **lab missingness** + intuisi |
| d10-feature-engineering | 32,2 → 50,8 | 50 | prose (fit/transform, target encoding out-of-fold + smoothing, fitur as-of) + **lab leakage** (kor 0,030 vs −0,032) + intuisi |
| d11-scipy-statsmodels | 44,3 → 54,6 | 55 | prose (peta uji hipotesis, Bonferroni/FDR) + mini-case (Rp 600 jt) + intuisi; tanpa kode baru (statsmodels tidak di VM) |
| d12-sklearn | 35,8 → 54,1 | 55 | prose (Pipeline/ColumnTransformer, leakage pra-split, nested CV) + **lab imputasi** (0,865 vs 0,802) + intuisi |
| d13-performa | 27,2 → 54,8 | 55 | **2 lab** (vektorisasi 31–45×; downcasting 82%) + mini-case (337×) + intuisi |
| d14-rekayasa | 27,2 → 55,1 | 55 | **lab logging** + prose (config, secrets, struktur proyek) + **lab mini-case** + intuisi |
| d15-sql-python-api | 35,2 → 55,3 | 55 | **lab SQL injection** (f-string vs parameterized) + prose (pooling, chunked reads) + mini-case (OOM 8 GB) + intuisi |
| d16-polars | 46,8 → 49,9 | 50 | penguatan ujung (streaming/out-of-core) — lihat §3 |
| d17-pytest | 46,4 → 49,6 | 50 | penguatan ujung (testing numerik/stokastik, property-based, CI) — lihat §3 |

**Lab baru total: 4 SQL (c9-1, c16, c17, c18) + 9 Python (d6, d8-1, d8-2×2, d9, d10, d12, d13×2, d14, d15).** Semua solusi dieksekusi & lolos checks (11 Python + 3 SQL oleh worker; 1 SQL/c18 oleh parent — §4).

## 3. Penguatan ujung advanced (assessment jujur per arahan pemilik — busur beginner→intermediate→advanced)

- **c19-views** — dinilai upper-intermediate → diperkuat kompak (definer/invoker + WITH CHECK OPTION; 58,4).
- **c20-json-sql** — dinilai **SUDAH ADVANCED** (expression index, generated column, decision map JSONB vs document DB, mini-case Rp 1,1 M) → intuisi saja (56,1).
- **c21-duckdb** — dinilai advanced-leaning → diperkuat kompak (hive partitioning + pruning + small-file problem + batas jujur multi-writer; 57,7).
- **c22-sql-antipatterns** — dinilai intermediate-advanced → diperkuat kompak (keyset pagination, EAV + migrasi bertahap; 59,1 — tidak menembus 60).
- **d16-polars** — dinilai near-advanced, 1 gap nyata (streaming/out-of-core: `scan_*` + `sink_parquet`, kapan streaming gagal, kapan Polars TIDAK menang) → ditutup (49,9).
- **d17-pytest** — dinilai intermediate→advanced, strategi testing pipeline data belum ada (seed determinism, `pytest.approx`, property-based, CI) → ditutup (49,6).
- d13/d14/d15 (topik advanced yang memang <45) diperkuat per brief awal — memenuhi arahan busur.

## 4. Intervensi parent: lab c18-transaksi-acid

Worker SQL memutuskan sadar **melewatkan lab c18** (konflik transaksi dianggap tak bermakna di sqlite) → audit menandai "tanpa lab". Parent menilai lab ACID bermakna dan menambahkannya sendiri:
- Lab "Atomik & kunci": t1 atomicity (BEGIN → 3 INSERT → ROLLBACK → total kembali 1500), t2 locking (BEGIN IMMEDIATE + tulis tanpa commit di koneksi A → koneksi B (timeout=1) mendapat "database is locked" → commit A → retry B sukses).
- Solusi dieksekusi di python3: `saldo awal: 1500 → 2400 → 1500; error B: database is locked; retry_ok: True` — 5 checks lolos.
- c18: 47,4 → **56,9** (est 55); flag "tanpa lab" hilang; komponen SQL = 0.
- lockLines: 14 terverifikasi sesuai LAB_SETUP; tsc 0; F1/F2 bersih.

## 5. Hasil scan anti-pattern F1–F6 (eksplisit, per penegasan pemilik)

- **F1 (frasa filler): 0 temuan** di seluruh file `c*.ts` + `d*.ts` (scan parent: 5 frasa terlarang WORKFLOW.md).
- **F2 (rantai silang): 0 temuan di konten tambahan.** Pola dicek: "di lesson", "pada lesson", "lihat lesson", "seperti dibahas di", "pada bab", "seperti yang telah dibahas". Hit "di lesson ini" yang muncul = rujukan diri-sendiri (self-contained), bukan dependensi — diterima. Rujukan silang pre-existing di track lain (mis. "(C5)", "Track D", notasi "CR10") adalah isi lama — tidak diubah sesuai aturan aditif. 5 pelanggaran draft worker SQL diperbaiki via recap in-place sebelum insert.
- **F3:** langkah baru berisi contoh berangka (Rp, orde kompleksitas), mode kegagalan, aturan keputusan — bukan definisi kamus.
- **F4:** semua lab baru runnable + editable dengan checks bermakna; quiz baru (c18: 2 item) 4 opsi × `why`.
- **F5:** prose RAW tanpa entitas HTML; tidak ada perubahan visual; tidak ada emoji di konten baru.
- **F6:** komponen wajib tidak dihapus; tambahan aditif.

## 6. Verifikasi parent (independen)

1. Re-bundle registry (esbuild) + skrip audit identik 14 Okt → angka §0 (bukan klaim worker).
2. `npx tsc --noEmit` = **0 error** seluruh repo (2×: sebelum & sesudah intervensi c18).
3. Scan F1/F2 parent atas `c*.ts` + `d*.ts` → 0/0 di konten tambahan.
4. Sampel isi: d10 (heuristik 6 poin feature engineering — asli advanced: out-of-fold encoding, smoothing w=n/(n+m), as-of), c17/c18, d13.
5. Cakupan file: hanya 41 file c*/d* yang berubah; rr19 dan track lain tidak tersentuh.
6. Tidak ada deploy.

## 7. Kendala & catatan

- statsmodels/polars/pytest **tidak tersedia di VM** → d11/d16/d17 tanpa kode baru (prose saja); tercatat di laporan. Solusi lab lain semuanya dieksekusi.
- Bug renderer `True`→`true` tertangkap saat bundling worker Python → diperbaiki.
- Estimasi kata penulis meleset ±40% di draft pertama (pola C1–C3) → diatasi langkah kedua/ketiga.
- **Deploy C1–C4 menunggu ACC Septian** (live saat ini tetap deployment 20b17030 = Gelombang A saja).
- Sisa platform di bawah standar: **152/607** — gelombang berikutnya per peta: C5 (Health DS + Marketing), C6 (Portfolio Mgmt), dst.
