# LAPORAN M1 GRUP RISIKO — 4 Misi Solo (Credit Risk + Fraud/AML)

**Tanggal:** 2026-10-15 · **Koordinator:** subagent grup RISIKO · **Status:** SELESAI DIBANGUN + terverifikasi koordinator (gerbang parent menyusul)
**Dokumen acuan:** `DESAIN_PROYEK_TERPADU_V2_2026-10-15.md` · `RENCANA_MISI_75_2026-10-15.md` · `DATASET_PUBLIK_PROYEK_2026-10-15.md` · `LAPORAN_MISI_PILOT_2026-10-15.md`

Dibangun oleh 4 builder paralel (satu per misi), diverifikasi ulang oleh koordinator: re-run 4 harness lab, tsc, cek struktur 7 elemen, cek unik slug, append registry.

**Registry:** `src/app/v2/lib/reg-misi.ts` kini 11 misi (3 pilot + 4 grup lain yang paralel + 4 misi ini). Hanya file konten baru + append record — tidak ada perubahan lain (registry lesson, rr19, ImpostorAudit.tsx, komponen, nav, Progress Hub tidak disentuh). **Tidak ada deploy.**

---

## 1. Misi A Credit Risk (core) — `misi-pinjaman-pertama`

**Judul:** "Keputusan Kredit: Nasabah Ini Layak atau Tidak?" · track Credit Risk · module Misi · **estMinutes 135** · xp 550 · export `misiPinjamanPertama`
**Peran/klien:** Credit Analyst — Komite Kredit bank menengah (rekomendasi cut-off scorecard + bukti angka untuk 1.000 berkas pengajuan)

**Dataset + sumber + lisensi:**
- Statlog German Credit Data (Prof. Dr. Hans Hofmann, 1994): 1.000 baris × 20 atribut, kode A11–A410 didekode dari `german.doc`, class 1/2 → "good"/"bad".
- Unduhan: https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip (tanpa login).
- Lisensi (3 pengecekan, diverifikasi 2026-10-15): **(1)** halaman dataset UCI menampilkan seksi License: *"This dataset is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license. This allows for the sharing and adaptation of the datasets for any purpose, provided that the appropriate credit is given."* — **koreksi temuan koordinator sebelumnya** ("tidak ada badge"): badge ADA, hanya tidak ter-render oleh text-extractor yang dipakai saat itu; (2) metadata `ucimlrepo` (id=144) memang tidak punya field license; (3) OpenML credit-g (d/31, dataset identik): `licence = "Public"`. Bundel dibenarkan CC BY 4.0 + Public, dengan atribusi. Semua dikutip di `METODE.md`.
- File: `public/misi/misi-pinjaman-pertama/kredit.csv` (bersih, 1.000 baris, 22 kolom deskriptif Inggris) + `kredit_audit.csv` (1.003 baris: +3 pasang duplikat; 2× installment_rate→99, 2× purpose→"A412", 1× age→120 — ID terdampak APP-0026/0115/0655, APP-0282/0760, APP-0229/0251, APP-0143) + `METODE.md`. Total **452 KB**. Skrip: `misi-data/build_misi-pinjaman-pertama.py` (seed 42).

**Langkah:** 12 entri (briefing → dataroom → lab-eda → lab-sql → keputusan → 3 konsekuensi `goto:"audit"` → audit → deliverable → debrief → rangkuman); dijalani pelajar: 10.
**Lab:** Pyodide (n=1000, bad_rate=0.30, bad_rate segmen thin-file 0.625, median_plafon_bad=2574.5) + SQL (duplikat persis + installment_rate mustahil).
**Uji lab mandiri (koordinator re-run):** harness `/tmp/harness_misi-pinjaman-pertama.py` **SEMUA LOLOS** (checks dari eksekusi nyata, bukan karangan); SQL seed+solution cocok expectedRows/expectedColumns; `npx tsc --noEmit` **0 error**.
**Kejujuran data:** `application_id` (APP-0001..1000) sintetis dari urutan baris; 12 baris seed SQL fiktif; 20 baris dossier ditulis tangan (ID injeksi memakai ID CSV asli agar konsisten); injeksi HANYA di `kredit_audit.csv`. Batas dinyatakan eksplisit: data Jerman era DM (konteks ≠ Indonesia 2026); segmen thin-file n=40 (bad rate 62,5% goyah); matriks biaya 5:1 tanpa opportunity cost; cut-off butuh revalidasi berkala (concept drift).

---

## 2. Misi B Credit Risk (edge) — `misi-npl-tersembunyi`

**Judul:** "NPL 2%: Angka yang Terlalu Bagus untuk Dipercaya" · track Credit Risk · module Misi · **estMinutes 170** · xp 600 · export `misiNplTersembunyi`
**Peran/klien:** Senior Credit Risk Auditor — Direksi bank (buktikan/bantah NPL 2% vs industri 3,5%; rumor restrukturisasi massal berlabel "lancar")

**Dataset + sumber + lisensi:**
- Basis: Statlog German Credit (sama seperti misi A; lisensi CC BY 4.0 terverifikasi seperti di atas; atribusi "Statlog German Credit (Hofmann, UCI ML Repository, CC BY 4.0)").
- File: `public/misi/misi-npl-tersembunyi/loanbook.csv` (bersih, 1.000 baris) + `loanbook_audit.csv` (1.002 baris: K1 = 100 missing acak di employment_since/savings, K2 = 2 pasang duplikat konflik — baris 697 & 728 dengan class dibalik, K3 = 3 installment_rate mustahil 88/75/92, K4 = 2 kode purpose tak valid A99/BOGUS) + `restrukturisasi.csv` (**SINTETIS penuh**: 40 fasilitas berparameter, debitur samaran Indonesia) + `METODE.md`. Total **264 KB**. Skrip: `misi-data/build_misi-npl-tersembunyi.py` (seed 42).

**Langkah:** 13 entri (+1 lab segmen vs misi A: briefing → dataroom → lab-eda → lab-sql → lab-segmen → keputusan → 3 konsekuensi → audit → deliverable → debrief → rangkuman); dijalani: 11.
**Lab:** Pyodide EDA (bad_rate crosstab employment×purpose; segmen lt_1yr×business 0.5385), SQL (duplikat konflik via `COUNT(DISTINCT status)>1`), Pyodide vintage (bad_rate: pendek 0.15 / menengah 0.3111 / panjang 0.5172; n_mustahil=3).
**Uji lab mandiri (koordinator re-run):** harness **13/13 LOLOS** (solusi diekstrak byte-for-byte dari file TS); SQL cocok; `tsc` **0 error**.
**Kejujuran data:** `restrukturisasi.csv` sintetis dinyatakan di METODE.md + briefing + dataroom; class good/bad = label kinerja sampel (bukan definisi NPL regulator); tanpa arus kas, sebab-musabab macet tak bisa dipastikan (dinyatakan di template deliverable). Dossier 20 baris konsisten silang dengan file restrukturisasi & baris audit.

---

## 3. Misi A Fraud/AML (core) — `misi-kartu-hantu`

**Judul:** "Kartu Hantu: Memburu Fraud di Tumpukan Transaksi" · track Fraud/AML · module Misi · **estMinutes 130** · xp 550 · export `misiKartuHantu`
**Peran/klien:** Fraud Analyst — Head of Fraud Operations bank digital (20.000 transaksi menunggu triase; tim hanya bisa menelepon 50 nasabah/hari)

**Dataset + sumber + lisensi:**
- **SINTETIS penuh** — dataset Kaggle Sparkov TIDAK diunduh (butuh login; tidak dikarang). Generator: `misi-data/build_misi-kartu-hantu.py` (seed 42, stdlib + numpy, deterministik byte-identik).
- Skema mirip Sparkov tanpa PII: trans_id, trans_time, card_id (token), merchant, category, amount, channel (chip/online), city, is_fraud. Pola fraud: 30 kartu × burst 5–8 transaksi <10 mnt (40% jam 02:00–05:00 + luxury), 5% fraud > 4× median kartu, online + merchant baru. **Fraud rate aktual 0,945%** (189/20.000).
- File: `public/misi/misi-kartu-hantu/transaksi.csv` (20.000 baris) + `transaksi_audit.csv` (20.017 baris: 17 injeksi — 2 burst velocity TX-020001–012, 2 luxury 03:12/03:47 TX-020013/14, 2 amount anomaly TX-020015/16, 1 trans_id duplikat TX-005839) + `METODE.md`. Total **3,6 MB**. Kata "SINTETIS" 7× di konten + 2× di METODE.md; frasa "data nyata" hanya muncul sebagai penolakan eksplisit.

**Langkah:** 12 entri; dijalani: 10.
**Lab:** Pyodide (n=20000, fraud_rate=0.00945, n_velocity_cards=30, precision aturan 3×median = 0.016176 — pedagogi inti: flag murah = banjir false positive) + SQL (velocity ≥4 transaksi/jam via GROUP BY + HAVING).
**Uji lab mandiri (koordinator re-run):** harness **8/8 LOLOS** (solusi/seed diekstrak dari TS asli); SQL cocok persis (2 kartu); `tsc` **0 error**.
**Kejujuran data:** seluruhnya sintetis — dinyatakan di briefing datasetNote, story, dataroom, deliverable, rubric, rangkuman, METODE.md. I3 "40× median" = 40× median *profil* kartu (parameter generator); rasio vs median realisasi sampel bisa berbeda (card_1180: ~26×) — didokumentasikan di METODE.md.

---

## 4. Misi B Fraud/AML (edge) — `misi-jaring-mule`

**Judul:** "Jaring Mule: Jejak Layering di Blockchain" · track Fraud/AML · module Misi · **estMinutes 160** · xp 600 · export `misiJaringMule`
**Peran/klien:** AML Analyst di bursa kripto — Head of Compliance (FIU meminta penjelasan 3 klaster dompet; putuskan: STR/SAR + bekukan, pantau lanjutan, atau tutup sebagai false positive)

**Dataset + sumber + lisensi:**
- BitcoinHeist Ransomware Address Dataset (UCI): **CC BY 4.0** (badge dicek langsung di halaman dataset 2026-10-15, masih tampil). Unduh 2.916.697 alamat dari URL resmi.
- OFAC via 0xB10C (tool MIT; data OFAC public domain AS 17 U.S.C. §105) — **pin BARU: 2026-10-15 13:34 WITA, cabang `lists`, commit `6ae2472c439b`** (repo tidak ada commit baru sejak pin pilot; pembeda = timestamp + commit hash terdokumentasi). 532 XBT + 120 ETH.
- **Slice BERBEDA dari pilot** (pilot = atribusi ransomware + join OFAC + narasi mixing): 3.000 alamat fokus *tipologi layering* — (a) 1.000 `looped` tertinggi, (b) 1.000 `neighbors` tertinggi, (c) 1.000 acak dari pool income<P25 & count>P75 (193.483 alamat unik), seed 42, fitur asli tak diubah. Join OFAC di slice = **0 cocok** (fakta, jadi bahan ambiguitas).
- File: `public/misi/misi-jaring-mule/dompet.csv` (3.000) + `dompet_audit.csv` (3.002 + 4 injeksi: 2 label disanitasi, 2 income→0, 2 alamat duplikat, 2 klaim "length=0→aman") + `ofac_pinned.csv` (652) + `METODE.md`. Total **660 KB**. Skrip: `misi-data/build_misi-jaring-mule.py`.

**Langkah:** 13 entri (+1 lab tipologi); dijalani: 11.
**Lab:** Pyodide EDA (distribusi looped, korelasi neighbors–income, skor tipologi mule) + SQL (JOIN dompet×sanksi → 3 kecocokan) + Pyodide tipologi smurfing (bucket income).
**Uji lab mandiri (koordinator re-run):** harness **11/11 LOLOS**; SQL kolom + 3 baris cocok persis; `tsc` **0 error**.
**Kejujuran data (temuan nyata mengikuti data, bukan narasi):** heuristik "mule = banyak tetangga + uang kecil" menemukan **NOL kandidat** — korelasi log(neighbors)–log(income) = **0,913** (pola exchange, bukan mule); hipotesis smurfing **terbalik** (count>P90 terbanyak di bucket income besar 12,2% vs 4,1%); hanya 11/3.000 (0,37%) berlabel non-white. Ditulis jujur di lab + debrief. Tanpa edge list/graph — dibingkai sebagai analisis tipologi agregat, dinyatakan eksplisit.

---

## Verifikasi koordinator (independen dari klaim builder)

| Cek | Hasil |
|---|---|
| File konten 4 misi + 4 skrip build + 4 folder dataset + METODE.md | ✅ ada semua |
| Unik slug (vs pilot, vs lesson, vs misi grup paralel lain) | ✅ 11 slug unik di konten; registry 11 key unik, semua punya file |
| Struktur 7 elemen per misi (briefing, lab ber-gate Pyodide+SQL, decision 3 opsi, 3 konsekuensi `goto:"audit"`, auditDossier, deliverable ber-rubrik, debrief, summary) | ✅ 4/4 (12–13 entri; dijalani 10–11) |
| Re-run 4 harness lab (solusi diekstrak dari TS, dieksekusi vs CSV asli) | ✅ CR-A lolos, CR-B 13/13, Fraud-A 8/8, Fraud-B 11/11 |
| SQL labs via sqlite3 | ✅ expectedColumns/expectedRows cocok (termasuk di harness) |
| `npx tsc --noEmit` (sebelum & sesudah append registry) | ✅ 0 error |
| Ukuran snapshot per misi | ✅ 452K / 264K / 3,6M / 660K — semua <5MB |
| Batasan kode (hanya konten baru + append reg-misi.ts) | ✅ tidak ada file lain diubah |
| Prosa RAW / tanpa `${` / KaTeX String.raw | ✅ dilaporkan builder, spot-check pola konsisten dengan pilot |

**Catatan untuk gerbang parent:**
1. **Koreksi lisensi:** temuan awal koordinator ("halaman UCI tidak menampilkan badge lisensi German Credit") SALAH — badge CC BY 4.0 ada di HTML halaman (kutipan verbatim di §1); text-extractor browser yang menghilangkannya. Builder CR-A/CR-B yang benar. Bundel sah dengan atribusi.
2. Eksekusi Pyodide `open_url` di browser real belum teruji dari sandbox (risiko yang sama seperti pilot) — logika lab terverifikasi via harness terhadap CSV asli.
3. `reg-misi.ts` kini memuat juga 4 misi grup lain yang dibangun paralel (`misi-var-backtest`, `misi-stress-korelasi`, `misi-rekonsiliasi-laporan`, `misi-laporan-dua-sumber`) — bukan bagian M1 grup RISIKO; koordinator tidak memverifikasinya.
4. Estimasi durasi jujur per misi: 135 / 170 / 130 / 160 menit (Misi B lebih panjang, sesuai aturan Septian 11:39).
