# LAPORAN M1 — GRUP PASAR & PELAPORAN (4 Misi Solo)

**Tanggal:** 2026-10-15 · **Koordinator:** subagent M1-Pasar · **Status:** SELESAI DIBANGUN + uji mandiri lolos (gerbang parent menyusul)
**Pola:** mengikuti persis pilot (`misi-dbd-surveilans.ts`); hanya file konten baru + append `reg-misi.ts`. rr19, `ImpostorAudit.tsx`, registry lesson, nav, Progress Hub TIDAK disentuh.

---

## 1. Market Risk — Misi A (core): `misi-var-backtest`
- **Judul:** "Misi VaR: Model yang Terlalu Tenang" · **Track:** Market Risk · **12 langkah** · **estMinutes: 120** · **XP 500**
- **Dataset:** FRED S&P 500 harian 2019-01-01 s.d. 2021-06-30 (606 baris) — **data publik pemerintah federal AS (public domain)**; `laporan_var_mesin.csv` = VaR99 parametrik mesin bank (2,3263 × std 250 hari). Total 28 KB.
- **Status lisensi:** ✅ boleh dibundel — karya pemerintah federal AS; atribusi FRED/St. Louis Fed; tanggal tangkapan 2026-10-15 dinyatakan di `METODE.md`. S&P 500 dinyatakan sebagai PROXY (bukan portofolio aktual).
- **Alur:** briefing (validator independen, CRO) → data room → Lab 1 Pyodide (VaR99 trailing 250 hari, 29 pelanggaran, Kupiec LR 45,81 >> 6,63 → model DITOLAK) → Lab 2 SQL (8 pelanggaran berat, |ret|>2×VaR) → keputusan 3 opsi (pertahankan / amber+add-on / eskalasi) → 3 temuan cabang → dossier 16 baris/4 sabotase (jumlah dikecilkan 29→4, lookahead, tanda dibalik, pekan ganda) → deliverable memo validasi (rubrik 4×25) → debrief → rangkuman.
- **Uji mandiri:** harness `/tmp/harness_m1.py` — solusi Lab 1 dieksekusi nyata vs CSV: n=606, terburuk 2020-03-16 (−12,7652%), VaR99 2,2479, 29 pelanggaran, Kupiec 45,8125 — semua 7 checks PASS. Lab SQL via sqlite3: seed+solution → 8 baris expected cocok (orderMatters). Struktur: step id unik, nextStepId/goto valid, rubric=100, F1 bersih, summary ada.

## 2. Market Risk — Misi B (edge): `misi-stress-korelasi`
- **Judul:** "Misi Badai: Ketika Semua Korelasi Menuju Satu" · **Track:** Market Risk · **14 langkah** · **estMinutes: 150** · **XP 600**
- **Dataset:** FRED SP500 + VIXCLS + DGS10 harian, jendela sama (598 baris gabungan) — **public domain**; `pasar_stress.csv` (tanggal, spx, spx_ret, vix, vix_chg, y10, y10_chg). Total 32 KB.
- **Status lisensi:** ✅ sama seperti Misi A; angka mentah tanpa smoothing (dinyatakan di `METODE.md`).
- **Alur (edge = lebih kotor/ambigu):** briefing (verifikasi klaim desk yang konflik) → data room → Lab 1 (korelasi SPX–VIX tenang −0,856 vs krisis −0,800; VIX maks 82,69; vol 21-hari 0,54%) → Lab 2 (max drawdown −33,92%, 2020-02-19→2020-03-23; 6 hari <−5%) → Lab 3 SQL (11 hari panik) → langkah uji-klaim (3 klaim "Catatan Strategi" divonis satu per satu) → keputusan 3 opsi (tambah hedge / tahan / kurangi eksposur) → 3 temuan → dossier 14 baris/4 sabotase (smoothing 60-hari, hari krisis dibuang dari sampel, rasio hedge salah tanda, cherry-pick jendela) → deliverable memo stress → debrief → rangkuman.
- **Uji mandiri:** semua checks Lab 1–2 PASS vs CSV (nilai di atas terkonfirmasi); SQL 11 baris cocok. Catatan jujur: korelasi negatif di kedua rezim (bukan "breakdown" arah) — narasi misi ditulis mengikuti data: yang gagal adalah UKURAN lindung, bukan arahnya.

## 3. Risk Reporting — Misi A (core): `misi-rekonsiliasi-laporan`
- **Judul:** "Misi Rekonsiliasi: Laporan yang Harus Klop" · **Track:** Risk Reporting · **12 langkah** · **estMinutes: 120** · **XP 500**
- **Dataset:** Statlog German Credit Data, UCI ML Repository — **CC BY 4.0, terverifikasi di halaman dataset pada 2026-10-15** (atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg). `loan_book.csv`: 1.000 baris, 14 kolom, kode didekode via `german.doc`, status dari `german.data-numeric`. Total 132 KB.
- **Status lisensi:** ✅ boleh dibundel dengan atribusi. Sudut misi = PELAPORAN (rasio, tie-out antar-tabel, jejak audit) — BUKAN pemodelan/skoring kredit (wilayah track Credit Risk).
- **Alur:** briefing (NPL ringkasan 21,43% vs lampiran 30,0%) → data room → Lab 1 Pyodide (NPL 30,0%; terburuk pendidikan 44,0%; cicilan macet 3,097 vs lancar 2,92) → Lab 2 SQL tie-out (1 baris: usaha 35,05% vs dilaporkan 25,05%) → keputusan 3 opsi (tunda+eskalasi / publikasikan+catatan / koreksi diam-diam) → 3 temuan → dossier 14 baris/4 sabotase (total tak klop 3.154.180 vs 3.271.258, denominator diam-diam 300/1.400, footnote kontradiktif >90 hari vs periode 30 hari, ID 472 duplikat) → deliverable memo rekonsiliasi (rubrik 30/25/20/25) → debrief → rangkuman.
- **Uji mandiri:** semua checks PASS; SQL tie-out 1 baris cocok.

## 4. Risk Reporting — Misi B (edge): `misi-laporan-dua-sumber`
- **Judul:** "Misi Dua Sumber: Laporan di Tengah Perang Data" · **Track:** Risk Reporting · **14 langkah** · **estMinutes: 165** · **XP 600**
- **Dataset:** basis sama (CC BY 4.0) — `core_banking.csv` + `risk_mart.csv` (30 baris status dibalik, seed 42 — mensimulasikan perbedaan definisi as-of; DINYATAKAN simulasi di briefing & `METODE.md`, bukan forensik sungguhan) + `koreksi_bisnis.csv` (12 baris). Total 264 KB.
- **Status lisensi:** ✅ sama seperti Misi A.
- **Alur (edge = ambiguitas, tanpa jawaban tunggal bersih):** briefing (NPL 30,0 vs 31,4; koreksi last-minute) → data room → Lab 1 (gap 1,4 pp > ambang 0,5 pp → MATERIAL; 30 baris beda; gap terbesar "pelatihan ulang" 11,11 pp pada n=9 = noise) → Lab 2 (terapkan koreksi: 11/12 kembali ke core; NPL 31,1; gap sisa 1,1 pp — tetap material) → Lab 3 SQL (6 tujuan gap >2 pp) → langkah ambang materialitas → keputusan 3 opsi (core+disclosure / mart konservatif / tunda) → 3 temuan → dossier 14 baris/4 sabotase (klaim "tidak material" vs ambang 0,5 pp, satu as-of tanpa sensitivitas, restatement diam-diam 29,4→28,9, denominator switch 970 vs 1.000) → deliverable nota publikasi → debrief → rangkuman.
- **Uji mandiri:** semua checks PASS; SQL 6 baris cocok (floatTol 0,011 — nilai seed dibulatkan 2 desimal).

---

## Verifikasi gabungan
- **tsc --noEmit:** 0 error (seluruh proyek).
- **Harness** `/tmp/harness_m1.py` (pola pilot): 4/4 misi — struktur (7 elemen, step id unik, nextStepId/goto valid, rubric=100, summary, prereqSummary, F1 bersih), solusi lab Pyodide dieksekusi nyata vs CSV asli (semua checks PASS), lab SQL via sqlite3 (seed+solution→expectedRows cocok), dossier rowIds/injeksi konsisten, CSV yang dirujuk ada, `METODE.md` ada, dataset <5 MB/misi.
- **Slug unik:** tidak ada duplikat antar 4 misi baru, 3 pilot, maupun lesson (termasuk slug `misi-*` milik koordinator grup lain yang terlihat di workspace).
- **Batas kode dipatuhi:** hanya `src/app/v2/content/misi-*.ts` (4 file baru) + append `src/app/v2/lib/reg-misi.ts`; komponen dipakai ulang tanpa fork; tidak ada perubahan pada lesson/nav/Progress Hub.
- **Skrip data:** `misi-data/build_m1_pasar_pelaporan.py` (seed 42; mengunduh FRED + german.zip dari sumber primer, menulis 4 folder `public/misi/<slug>/` + `METODE.md`).

## Temuan jujur (data mengalahkan narasi — pola pilot)
1. **Korelasi SPX–VIX tidak "breakdown" arahnya** (−0,86 tenang vs −0,80 krisis, tetap negatif) — narasi Misi B ditulis ulang secara jujur: yang gagal adalah UKURAN lindung nilai, bukan arah korelasinya.
2. **Fitur `mixing_rounds`-analog di sini:** tidak ada — sebagai gantinya, "sinyal konflik" Misi B datang dari koreksi bisnis yang 11/12-nya benar (koreksi sebagian jujur, bukan sabotase total) — ambiguitas yang disengaja.
3. **NPL 30% German Credit adalah oversampling kurasi** (bukan cerminan portofolio nyata) — dinyatakan di miskonsepsi Lab 1 Misi A agar pelajar tidak salah tafsir.
4. **yfinance TIDAK dipakai sama sekali** — FRED saja sudah cukup (menghindari area abu-abu redistribusi yang disebut di katalog §C3).

## Yang perlu gerbang parent
1. tsc sudah 0 — gerbang parent: build produksi, E2E browser (galeri + 4 runner + panel ringkasan langkah 1), FSRS, responsive, verifikasi dataset & lisensi dari sumber primer.
2. Eksekusi lab Pyodide/SQL di browser real (CDN) — belum teruji dari sandbox (risiko terbuka yang sama seperti pilot).
3. **JANGAN deploy** — instruksi tugas; deploy menunggu ACC Septian per gelombang.
