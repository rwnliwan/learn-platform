# KATALOG DATASET PUBLIK — Guided Project v2 ("Misi")

**Tanggal:** 2026-10-15 · **Sifat:** RISET SAJA — tidak ada yang diunduh di fase ini.
**Prinsip:** prioritaskan dataset yang legal didistribusikan sebagai snapshot sampel kecil (<~5MB) di dalam app. Lisensi dikutip persis dari halaman yang dibuka; yang tidak terverifikasi ditandai jelas — jangan diklaim.
**Aturan Kaggle:** unduhan butuh login/API key — tidak tersedia di VM; dataset Kaggle ditandai dan harus diunduh manual.

Legenda status lisensi: ✅ boleh dibundel (dengan atribusi) · ⚠️ perlu verifikasi/keputusan · ❌ jangan dibundel (referensi/link saja).

---

## A. Dataset primer 3 pilot

### A1. Pilot Health Data Science — OpenDengue v1.3 (slice Indonesia)
- **URL terverifikasi:** https://opendengue.org/data.html ✅ · rilis https://github.com/OpenDengue/master-repo/releases/tag/v1.3.0 ✅ (halaman Figshare DOI me-return 403 — dilaporkan apa adanya, tidak dicoba ulang)
- **Lisensi:** ✅ **CC BY-SA** — dikutip dari paper (Clarke et al., *Scientific Data* 2024): "OpenDengue data is made available under a creative commons CC BY-SA licence… all adaptations of the OpenDengue dataset must also be made available under the same terms." Snapshot wajib membawa atribusi + lisensi CC BY-SA.
- **Ukuran:** rilis global multi-MB ZIP (129 negara); slice Indonesia kecil (ribuan baris, <1 MB).
- **Kolom kunci:** `adm_0_name`, `adm_1_name`/`adm_2_name`, `calendar_start_date`, `calendar_end_date`, `dengue_total`, `case_definition_original`, `FAO_GAUL_code`.
- **Kesesuaian:** struktur unit-pelapor × minggu = analog "laporan klinik mingguan"; DBD relevan untuk audiens Indonesia; agregat MOH/WHO-SEARO.
- **Strategi snapshot:** ekstrak Indonesia spasial tertinggi; 2–3 tahun mingguan untuk ~10–20 unit adm_1; buang kolom tak perlu; dokumentasikan metode di app.
- **Batas jujur:** kadens mingguan adm_1 Indonesia **belum terkonfirmasi tanpa unduh** — verifikasi di fase build. Tanpa demografi.
- **PII:** tidak ada (agregat).

### A2. Pilot Bioinformatika — seqc (SEQC/MAQC-III, Bioconductor)
- **URL terverifikasi:** http://bioconductor.org/packages/release/data/experiment/html/seqc.html ✅ (mirror OmicsDI untuk GSE47792 ✅)
- **Lisensi:** ✅ **GPL-3** (tabel Details halaman Bioconductor, dikutip persis).
- **Ukuran:** ~2000 library; 69 data frame (22 tabel count, 46 junction, 1 TaqMan); tarball puluhan MB (angka pasti verifikasi saat build).
- **Kolom/struktur:** platform ILM/ROC/LIF × 12 situs × sampel A (UHRR)/B (HBRR) + replika; ERCC spike-in; TaqMan RT-PCR ~1044 gen (ground truth independen).
- **Kesesuaian:** batch effect situs+platform NYATA (dataset memang dibuat untuk itu); ERCC+TaqMan = hook QC/forensik; paling tidak mirip DE-walkthrough (bi18 sudah capstone DE).
- **Strategi snapshot:** `platform='ILM'`, `center=c('BGI','MAY')`, A/B × 4 replika = 16 sampel; top 3.000 gen tervariabel + 92 ERCC; `samples.csv` + `qc.csv`; <1 MB; kriteria seleksi eksplisit di misi.
- **PII:** tidak ada.

### A3. Pilot Blockchain Data Scientist — BitcoinHeist + OFAC (orakel) + kptlamzn (beat impostor)
- **Primer — BitcoinHeist Ransomware Address Dataset (UCI ML Repository)**
  - **URL:** https://archive.ics.uci.edu/dataset/526/bitcoinheist+ransomware+address+dataset ✅
  - **Lisensi:** ✅ **CC BY 4.0** — dikutip dari halaman: "This dataset is licensed under a Creative Commons Attribution 4.0 International (CC BY 4.0) license… sharing and adaptation for any purpose, provided that the appropriate credit is given." Tanpa login.
  - **Ukuran:** 2.916.697 alamat × 10 kolom; 225 MB (110,7 MB terkompresi).
  - **Kolom kunci:** `address`, `year`, `day`, `length` (mixing rounds), `weight`, `count`, `looped`, `neighbors`, `income` (satoshi), `label` (keluarga ransomware / `white`).
  - **Kesesuaian:** label ransomware nyata + fitur kuantifikasi laundering (mixing rounds, pola merge) = beat "hack trace → lapisan mixer". Kelemahan jujur: tanpa edge list — misi dibingkai sebagai audit laporan, bukan literal hop-tracing (dinyatakan di briefing).
  - **Strategi snapshot:** semua baris berlabel ransomware (~28k) + 10k `white` stratified acak (seed tetap); ~2–4 MB; nilai fitur asli tak diubah.
- **Orakel label — OFAC Sanctioned Digital Currency Addresses (0xB10C)**
  - **URL:** https://github.com/0xB10C/ofac-sanctioned-digital-currency-addresses ✅
  - **Lisensi:** ✅ tool MIT + data OFAC = karya pemerintah federal AS (public domain, 17 U.S.C. §105).
  - **Ukuran:** KB (daftar alamat per aset). **Strategi:** pin snapshot bertanggal (XBT+ETH, ratusan alamat) + catat tanggal/commit; join sebagai `is_sanctioned`.
- **Beat impostor — kptlamzn/crypto-wallet-address-labels**
  - **URL:** https://github.com/kptlamzn/crypto-wallet-address-labels ✅
  - **Lisensi:** ⚠️ repo MIT, tetapi README menegaskan "Individual datasets may carry their own licenses" — subset Elliptic tetap CC-BY-NC-ND → hanya referensi, tidak dibundel. Ekstrak hanya komponen berlisensi permisif ke `entity_labels.csv` (<1 MB).
- **Ditolak eksplisit:** Elliptic Bitcoin Dataset (https://www.kaggle.com/datasets/ellipticco/elliptic-data-set ✅ dibuka) — **CC-BY-NC-ND 4.0** (dikutip persis) + butuh login Kaggle → ❌ tidak dibundel; referensi saja. Dataset phishing Ethereum lincozz (https://github.com/lincozz/ethereum-phishing-account-dataset ✅) — **lisensi tidak dinyatakan** → link-only. Sudut NFT wash-trading: tidak ada dataset publik berlisensi jelas yang terverifikasi → ditolak untuk fase ini.

---

## B. Dataset cadangan per track

### B1. Credit Risk — Statlog German Credit Data (UCI)
- **URL:** https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data ✅ · **Lisensi:** ⚠️ tidak tampil di fetch; sumber sekunder menyebut CC BY 4.0 — **wajib konfirmasi via badge halaman/`ucimlrepo` sebelum bundel**.
- **Ukuran:** 1.000 baris × 20 fitur; 77,9 KB — muat utuh. **Kolom:** `credit_amount`, `duration`, `installment_rate`, `credit_history`, `checking_account`, `employment`, `purpose`, `age`, target good/bad (30% bad). **Cocok:** semantika loan-book nyata; `installment_rate` = hook rasio utang mustahil; kode kategorikal memudahkan injeksi impostor. **Snapshot:** pakai utuh + decode label via `german.doc`. **PII:** tidak ada. Tanpa login.

### B2. Fraud/AML — Sparkov "Credit Card Transactions Fraud Detection" (Kaggle)
- **URL:** https://www.kaggle.com/datasets/kartik2112/fraud-detection ✅ · **Lisensi:** ⚠️ tidak tampil di fetch; dokumentasi sekunder (CC0 1.0, via Kaggle API pihak ketiga) — **konfirmasi `licenseName` via API saat unduh**.
- **Ukuran:** ~1,85 jt baris; 351 MB + 150 MB. **Kolom:** `trans_date_trans_time`, `cc_num`, `merchant`, `category`, `amt`, geo, `is_fraud` (~0,2–0,3%). **Cocok:** velocity mustahil, mismatch merchant/kategori, label tampering; diskusi precision/recall autentik. **Snapshot:** dari `fraudTest.csv` — buang kolom mirip-PII (`cc_num`, nama, alamat, `dob`, `trans_num`, `job`); simpan semua baris fraud + ~14k legit acak 2020-H2; ~20k baris ≈ 3–4 MB; metode didokumentasikan. **PII:** sumber sepenuhnya sintetis. **Akses:** ⚠️ butuh login Kaggle.

### B3. Data Engineer — Olist Brazilian E-Commerce (Kaggle)
- **URL:** https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce ✅ · **Lisensi:** ⚠️ **CC BY-NC-SA 4.0** (sumber sekunder; badge halaman wajib dibaca sebelum unduh) — **risiko NC untuk produk komersial; bila Learn komersial → diskualifikasi**, fallback: Online Retail II (B4).
- **Ukuran:** ~100k order, 9 tabel. **Cocok:** skema relasional multi-tabel = narasi ETL rusak (join key alami, null tanggal kirim, split payment, mismatch review). **Snapshot:** filter 2018-Q1 (~20–25k order) + join tabel dependen; buang geolocation 1M baris; ≤5 MB; quarter dinyatakan. **Akses:** ⚠️ butuh login Kaggle.

### B4. Business Intelligence — Online Retail II (UCI)
- **URL:** https://archive.ics.uci.edu/dataset/502/online+retail+ii ✅ · **Lisensi:** ⚠️ tidak tampil di fetch; sekunder menyebut CC BY 4.0 — **konfirmasi via `ucimlrepo`**; atribusi Daqing Chen/UCI.
- **Ukuran:** 1.067.371 baris × 8 kolom; 43,5 MB → wajib sampling. **Kolom:** `InvoiceNo` (C = cancel), `Quantity` (negatif = retur), `InvoiceDate`, `UnitPrice`, `CustomerID` (23,4% kosong), `Country`. **Cocok:** jebakan "dashboard berbohong" terjadi alami (revenue termasuk cancel, YoY bulan parsial, grain invoice vs line). **Snapshot:** tahun 2011 penuh → stratified 30k baris per bulan (~3 MB, seed tetap); KPI salah dihitung di atas snapshot, pelajar membangun ulang yang benar. Tanpa login.

### B5. Marketing Analytics — Facebook Ad Campaign (Kaggle)
- **URL:** https://www.kaggle.com/datasets/madislemsalu/facebook-ad-campaign ✅ · **Lisensi:** ⚠️ **tidak dinyatakan** (bagian License kosong; "Courtesy of Bunq") — **jangan dibundel komersial sampai terkonfirmasi**; alternatif: dataset ISLR "Advertising" (edukasi) atau tabel sintetis in-house berparameter terdokumentasi.
- **Ukuran:** 90 KB utuh. **Kolom:** `impressions`, `clicks`, `spent`, `total_conversion` vs `approved_conversion`, `age`, `gender`, interest. **Cocok:** gap total vs approved conversion = jebakan double-count siap pakai. Kelemahan jujur: satu platform (bukan multi-channel), tanpa kolom revenue (asumsi nilai per konversi dinyatakan eksplisit). **Akses:** ⚠️ butuh login Kaggle.

---

## C. Katalog sumber umum (instruksi Septian 07:14)

### C1. UCI Machine Learning Repository
- **URL:** https://archive.ics.uci.edu ✅ · **Lisensi:** per-dataset (contoh terverifikasi: APS Failure at Scania Trucks = CC BY 4.0). **Aturan:** cek bagian License tiap halaman; jangan berasumsi. **Format:** CSV/ZIP + DOI. Tanpa login. **Cocok:** forensik QC lab (diagnostic sets), audit loan-book (Census Income/Adult — cek lisensi), atribusi marketing.

### C2. Google Dataset Search
- **URL:** https://datasetsearch.research.google.com/ ✅ · **Sifat:** mesin penemu, BUKAN sumber — tidak meng-host apa pun. **Lisensi:** milik origin. **Wajib dicatat saat dipakai:** (1) nama+URL origin, (2) lisensi origin verbatim, (3) format di origin, (4) tanggal akses. Jangan pernah sitasi URL hasil pencarian sebagai sumber.

### C3. yfinance (Yahoo Finance)
- **URL:** https://github.com/ranaroussi/yfinance ✅ (kode Apache 2.0). **Sifat:** data live/API, bukan file statis. **Ketentuan data:** "intended for research and educational purposes… API is intended for personal use only" — **teks ToS Yahoo (legal.yahoo.com) tidak bisa di-fetch → redistribusi snapshot BELUM terkonfirmasi → link-only sampai ditinjau di browser live.**
- **Implikasi snapshot:** proyek terpandu tidak boleh bergantung pada API live (non-reproducible, API berubah) → strategi satu-satunya: **snapshot beku bertanggal** ("IHSG daily closes 2020-01-01–2025-12-31, captured 2026-10-15") + disclaimer salinan ajar. **Cocok:** Financial Markets (OHLCV, return, MA), Portfolio (korelasi multi-aset, drawdown) — sebagai snapshot beku saja.

### C4. World Bank Open Data
- **URL:** https://data.worldbank.org · API https://api.worldbank.org/v2 (terverifikasi via docs) · **Ketentuan (dikutip):** API "to facilitate certain non-commercial uses… you may not in any event use the APIs to facilitate commercial uses… including reselling, charging to access/redistribute, or charging to create derivative works." **Konsekuensi:** app edukasi non-berbayar kemungkinan lolos; **bila Learn berbayar → tinjau ulang, jangan bundel.** **Format:** REST JSON/XML, unduhan Excel/CSV. **Cocok:** BI dashboard audit (GDP, populasi, inflasi), konteks health-finance (mortalitas balita), DE pipeline forensics (ingest REST + paginasi).

### C5. WHO Global Health Observatory
- **URL:** https://www.who.int/data/gho · API OData https://www.who.int/data/gho/info/gho-odata-api · **Ketentuan (dikutip dari halaman terms):** "WHO grants… the royalty-free, worldwide, non-exclusive right to use, reproduce, extract, download, copy, distribute, display or include the Datasets… **for public health purposes**" + atribusi wajib (format: "WHO, title of dataset, year, date of access, acknowledgement of the country…"); dilarang menjual; modifikasi substantif perlu izin tertulis.
- **Konsekuensi:** ✅ sampel ajar kecil untuk proyek Health Data Science = squarely "public health purposes" — boleh dibundel dengan atribusi. **Format:** OData API, CSV per indikator. **Cocok:** surveilans HD (mortalitas, KIA, imunisasi, TB, malaria, NCD — 1000+ indikator, 194 negara termasuk Indonesia). Catatan: label sekunder "CC BY-NC-SA 3.0 IGO" muncul di metadata World Bank Data360 — yang berlaku adalah teks halaman terms WHO di atas.

### C6. Sumber Indonesia
- **data.go.id (Satu Data Indonesia)** — https://data.go.id/about ✅ · lisensi **tidak dinyatakan** di halaman about → link-only sampai field lisensi per-dataset dicek. Cocok: konteks lokal HD, BI dashboard regional.
- **BPS WebAPI** — https://webapi.bps.go.id/developer/ ✅ · butuh registrasi API key; isi "Term of Use" tidak terambil → **belum terkonfirmasi untuk bundel**; mikrodata = layanan berbayar/gated. Cocok: tabel agregat BI/konteks sosioekonomi (runtime fetch, bukan bundel).
- **Kemenkes layanandata** — https://layanandata.kemkes.go.id ✅ · **portal permintaan berbasis surat**, bukan unduhan mandiri; mikrodata (Riskesdas/SSGI/SKI) gated → bukan sumber snapshot; laporan agregat publik = link-only. Cocok: konteks survei kesehatan Indonesia (stunting, PTM) via laporan publik.
- **OJK Portal Data** — https://data.ojk.go.id/SJKPublic ✅ · lisensi **tidak dinyatakan** → link-only; unduhan interaktif dinamis. Cocok: konteks rasio perbankan (NPL, CAR, NIM, LDR) untuk audit loan-book — agregat industri, bukan loan-level.
- **Bank Indonesia** — PBI 12/2024 https://www.bi.go.id/id/publikasi/peraturan/Pages/PBI_122024.aspx ✅ · **tidak ada REST API publik**; lisensi redistribusi **tidak dinyatakan** → link-only + atribusi. Cocok: konteks BI Rate, JISDOR USD/IDR (snapshot beku bertanggal), metadata kredit.

---

## D. Risiko & batas jujur

1. **Lisensi belum terverifikasi dari halaman** (wajib konfirmasi di fase build via `ucimlrepo`/API/badge halaman): Statlog German Credit, Online Retail II, Sparkov Fraud, GEO/GSE260697.
2. **Butuh login Kaggle** (tanpa API key di VM — unduh manual oleh pemilik akun): Sparkov, Olist, Facebook Ad Campaign, Elliptic (ditolak).
3. **Ditolak / tidak dipakai:** Elliptic (CC-BY-NC-ND + login), lincozz Ethereum phishing (tanpa lisensi), NFT wash-trading (tidak ada dataset berlisensi jelas), WHO-via-OWID (non-redistributable per peneliti), data mikro Kemenkes/BPS (gated/berbayar).
4. **Ukuran:** semua snapshot primer <5MB sesuai strategi; metode sampling/seed dinyatakan eksplisit di tiap misi (kejujuran statistik = bagian dari desain F4).
5. **PII:** tidak ada PII nyata di kandidat terpilih; kolom mirip-PII sintetis dibuang di strategi snapshot (Sparkov).
6. **Ketersediaan:** kadens mingguan OpenDengue-Indonesia dan dimensi pasti tabel seqc diverifikasi ulang saat build snapshot (ditandai di §A1/A2).
