# Riset Pengembangan Learn v2 — 2026-10-14

Permintaan Septian 2026-10-14 23:00 WITA. **Riset murni — tidak ada kode diubah, tidak ada deploy.**
Stack: Next.js di Cloudflare Pages (edge, tanpa server berat) · 473 lesson / 24 track · format step v2 (teori, SVG, Plotly, KaTeX, kuis 4–6, lab Pyodide in-browser + tombol Periksa, mini-case) · data Neon Postgres · UI Indonesia + istilah teknis Inggris · pengguna tunggal (calon analis risiko: credit / fraud-AML / market risk / risk reporting).

---

## 1. OSS/GitHub yang bisa diaplikasikan

Keterangan: "dibuka" = halaman repo dibuka langsung (bintang & lisensi terverifikasi); "snippet" = dari hasil pencarian, belum dibuka.

### (a) Spaced repetition / FSRS
- **open-spaced-repetition/ts-fsrs** — https://github.com/open-spaced-repetition/ts-fsrs — ★816, MIT (dibuka, repo aktif, FSRS v6). Solusi: penjadwalan review adaptif per kuis (rating Again/Hard/Good/Easy + interval optimal), menggantikan bank soal statis. Integrasi: **kecil** — package TS murni, 100% browser/edge, zero dependency; hasil review ke Neon. Catatan: optimizer parameter butuh binding WASM opsional (effort lebih besar).
- fsrs.js (pendahulu ts-fsrs) — **DITOLAK**: maintainer sendiri menyarankan migrasi ke ts-fsrs (tidak aktif lagi).
- Alternatif: `supermemo` SM-2 (MIT, snippet — belum diverifikasi). Jika FSRS terasa berlebihan untuk 4–6 kuis/lesson.

### (b) Sandbox kode in-browser selain Pyodide
- **sql-js/sql.js** — https://github.com/sql-js/sql.js — ★13.670, MIT (dibuka). Solusi: lab SQL lesson statistik/finance tanpa server; 100% browser (~660 kB wasm, bisa worker). Integrasi: **kecil** — fresh DB per run, hasil dirender ke tabel jawaban lab.
- **duckdb/duckdb-wasm** — https://github.com/duckdb/duckdb-wasm — ★2.140, MIT (dibuka, DuckDB v1.5.6, aktif). Solusi: SQL lanjut (window function, agregasi besar, baca CSV/Parquet) melampaui SQLite; cocok track BI/data. Integrasi: **sedang** — bundle lebih besar, perlu CSP `wasm-unsafe-eval` (sudah ada untuk Pyodide).
- Runner JS/TS: tidak perlu repo — `<iframe sandbox="allow-scripts">` cukup; editor pertimbangkan monaco-editor (belum diverifikasi).

### (c) Visualisasi interaktif statistik/keuangan
- **apache/echarts** — https://github.com/apache/echarts — ★~67.500, Apache-2.0 (snippet; rilis 6.1.0 Mei 2026, aktif). Solusi: chart native yang tidak ada di Plotly: **boxplot, candlestick, heatmap, dataZoom, sankey** — pas untuk lesson risk/finance. Integrasi: **kecil–sedang** — canvas/SVG, mobile-friendly (wrapper React belum diverifikasi).
- **observablehq/plot** — https://github.com/observablehq/plot — ★5.404, ISC (dibuka, aktif). Solusi: chart statistik cepat ~50 kB dengan grammar-of-graphics untuk step teori; lebih ringan dari Plotly. Integrasi: **kecil** — `Plot.plot()` return SVG langsung. Batasan: interaktivitas default minim.
- DITOLAK: deck.gl (WebGL berat, overkill edukasi), LightningChart (inti komersial, bukan OSS).

### (d) Mesin kuis/assessment adaptif
- **billzi2016/tirt-ocean-quiz** — https://github.com/billzi2016/tirt-ocean-quiz — ★0, MIT (dibuka). Bukan library melainkan **referensi implementasi**: `src/lib/` berisi adaptive engine client-side (pemilihan blok soal paling informatif via uncertainty + MAP scoring ala IRT Thurstonian), 100% statis tanpa backend — arsitektur identik Learn v2. Integrasi: **sedang** — ekstrak pola ke modul TS sendiri; item bank dari kuis lesson yang ada. (Domainnya kepribadian, bukan pengetahuan — yang diambil engine-nya.)
- nonesence-py/adaptive-learning-app — kandidat referensi kedua (snippet; bintang & lisensi belum diverifikasi; ada `adaptive-engine.ts` port 4PL-IRT).
- DITOLAK: neolearnv2, ai-driven-e-learning-platform, knowlege-gap-system — butuh backend Python/FastAPI berat, tidak cocok edge. Alternatif ringan: skor mastery per konsep + ts-fsrs (a); IRT penuh mungkin overkill untuk 4–6 kuis/lesson.

### (e) PWA / offline-first mobile
- **serwist/serwist** — https://github.com/serwist/serwist — ★1.494, MIT (dibuka, 1.779 commit). Solusi: service worker + precaching + runtime caching (lesson, aset Pyodide) agar dibaca offline di HP. Integrasi: **sedang** — plugin `@serwist/next`; fork Workbox yang masih aktif. Perhatian: butuh webpack (bukan Turbopack) per dokumentasi komunitas.
- Alternatif nol-dependensi: service worker tulisan tangan (cache-first aset, network-first API Neon) — integrasi **kecil**, kontrol penuh; cocok untuk pengguna tunggal.
- DITOLAK: `shadowwalker/next-pwa` — deprecated (komunitas 2025 merekomendasikan Serwist).

### (f) Gamifikasi ringan (1 pengguna)
- **trophyso/ui** — https://github.com/trophyso/ui — ★149, MIT (dibuka, aktif). Solusi: komponen React/shadcn siap pakai (streak-badge, points-chart, achievements) → "rasa Duolingo" tanpa desain dari nol. Integrasi: **kecil** — `npx shadcn add` dari registry mereka; logika XP/streak ditulis sendiri (1 pengguna = cukup di Neon/localStorage). Leaderboard tidak relevan; "duel" diganti "lawan rekor diri sendiri minggu lalu".
- Alternatif nol-dependensi: streak/XP dihitung dari log penyelesaian lesson yang sudah ada di Neon — kecil.
- DITOLAK: Habitica (full-stack + server, overkill); Trophy SaaS (layanan berbayar, bukan OSS).

### (g) TTS / bacaan audio lesson
- **Web Speech API (`speechSynthesis`)** — native browser, tanpa repo. Solusi: tombol "bacakan lesson" instan, nol biaya, nol unduhan. Integrasi: **kecil**. Batasan: kualitas suara Indonesia tergantung device/OS — perlu uji on-device Septian.
- **hexgrad/kokoro** — https://github.com/hexgrad/kokoro — ★9.305, Apache-2.0 (dibuka; folder `kokoro.js` untuk browser via ONNX/WASM). Solusi: TTS neural berkualitas tinggi 100% browser, offline setelah unduhan pertama, tanpa API key/biaya. Integrasi: **sedang–besar** — unduhan model pertama ~80–350 MB (berat untuk HP); kualitas Bahasa Indonesia belum terverifikasi; isu lisensi GPL pada dependency phonemizer/espeak-ng dilaporkan komunitas (snippet — cek hukum sebelum bundling).
- DITOLAK in-browser: rhasspy/piper (butuh toolchain build); Edge-TTS (cloud, tidak OSS, butuh kunci/API).

### Prioritas rekomendasi (dampak vs effort)
1. **ts-fsrs** — dampak terbesar untuk retensi, effort terkecil.
2. **sql.js + echarts** — melengkapi lab SQL & visual statistik/keuangan.
3. **Serwist/PWA (atau SW tulisan tangan) + trophyso/ui** — mobile + engagement, effort kecil.
4. Adaptive quiz: ekstrak pola dari tirt-ocean-quiz bila adaptif benar-benar dibutuhkan; jika tidak, FSRS sudah cukup.
5. TTS: mulai dari speechSynthesis native; Kokoro hanya bila kualitas suara terbukti jadi masalah.

---

## 2. Scan kompetitor → USP

Sumber: halaman dibuka per platform; "belum terverifikasi penuh" = hanya dari search snippet.

**Brilliant** (https://www.pcworld.com/article/544679/learn-computer-science-and-more-intriguing-stem-courses-with-innovative-brilliant-learning.html, dibuka) — Mekanik: *problem-first* interaktif dengan "eureka moment" (eksperimen visual dulu, teori belakangan) + unit problem atomik yang bantuan dikurangi bertahap. Copyable? **YA** — murni format konten (problem → interaksi Plotly → teori); Learn v2 sudah punya Plotly + SVG + kuis per step.

**Duolingo** (https://duolingo.fandom.com/wiki/Blog:Duolingo_teaching_methodology, dibuka; wiki ringkas paper Settles & Meeder 2016) — Mekanik: spaced repetition adaptif per-model lupa (half-life regression), bukan interval tetap; active recall + habit engineering (streak, micro-lesson). Copyable? **YA untuk spacing+adaptive** — FSRS open-source; untuk 1 pengguna justru lebih akurat (tidak dirata-ratakan). Streak sosial: **TIDAK** relevan tanpa komunitas.

**Kaggle Learn** (https://www.kaggle.com/learn/intro-to-machine-learning, dibuka) — Mekanik: pasangan Tutorial + Exercise per lesson dengan kode yang langsung diedit/dijalankan di browser; belajar = memodifikasi kode sungguhan. Copyable? **YA** — pola struktur konten; lab Pyodide Learn v2 sudah setara fungsi.

**DataCamp** (snippet github.com/datacamp/courses-introduction-to-python/blob/master/chapter4.md, belum terverifikasi penuh) — Mekanik: exercise scaffold (@instructions bertahap + hint berlapis, tiap exercise ditag `xp`/`skills[]` → peta skill) + feedback instan, retry tanpa hukuman. Copyable? **YA** — tombol Periksa + hint Learn v2 sudah ~80% ke sana; sisanya format authoring (tag skill per kuis), murah.

**Khan Academy / Khanmigo** (https://www.freethink.com/consumer-tech/khanmigo-ai-tutor, dibuka) — Mekanik: tutor AI Socratic yang TIDAK memberi jawaban (balik bertanya, menuntun lewat dialog). Copyable? **YA** — system prompt + API LLM untuk 1 pengguna, biaya wajar via provider murah yang sudah dipakai.

**QuantConnect / LEAN** (https://www.quantconnect.com/tutorials, dibuka) — Mekanik: Strategy Library (tutorial strategi langsung dijalankan/diubah di engine yang sama dengan riset) + satu engine research→backtest→live. Copyable? **Pola konten YA; engine TIDAK** — Learn v2 di Pyodide browser tanpa akses data/sesi WorldQuant, dan batas keras: agen tidak boleh mengoperasikan akun WQB Septian.

**AnalystPrep** (https://analystprep.com/frm-part-1/, dibuka) — Mekanik: adaptive mock exams + performance dashboard per topik; quiz custom by book/chapter/topic + formula sheet siap-ujian. Copyable? **YA** — bank kuis sudah ada; tinggal seleksi adaptif sederhana + dashboard akurasi per topik.

### 3 kandidat USP terkuat (menurut bukti)

**1. "Socratic Tutor + Spaced Repetition terintegrasi di setiap lesson" (Khanmigo × Duolingo).**
Septian belajar sendirian tanpa mentor — tutor AI yang menuntun (bukan memberi jawaban) di tombol Periksa + antrean review FSRS lintas 473 lesson menjaga retensi materi teknis dalam (VaR, PD, model risiko) yang tidak bisa dihafal. Kompetitor sulit meniru balik: Duolingo punya spacing tapi untuk bahasa dangkal; Khanmigo Socratic tapi tidak terikat kurikulum + jadwal lupa personal; tak satu pun memadukan keduanya dalam kurikulum risiko keuangan yang dalam.

**2. "Lesson sebagai laboratorium keputusan risiko" (Brilliant × QuantConnect Strategy Library).**
Setiap mini-case memaksa Septian menghitung keputusan nyata di browser (hitung PD dari data kredit, uji VaR, deteksi pola fraud) *sebelum* teori dibuka — problem-first Brilliant, tapi output-nya artefak kerja analis risiko sungguhan. Kompetitor sulit meniru balik karena konten mereka generik massal; Learn v2 bisa menyesuaikan kasus dengan konteks kerja Septian karena hanya melayani satu orang.

**3. "Dashboard kesiapan karier 1-pengguna" (AnalystPrep × data pribadi).**
Dashboard memetakan mastery per topik dari hasil kuis + lab + review ke peta skill analis risiko (credit/fraud/market/reporting) dan memberi tahu topik lemah berikutnya — tanpa ribuan pengguna pembanding karena baseline-nya riwayat Septian sendiri. Kompetitor sulit meniru balik: model bisnis mereka butuh skala (benchmark antar-pengguna); keunggulan Learn v2 justru dari kedalaman data satu pengguna.

---

## 3. Pipeline materi

Status trik Septian: (i) **bedah ebook** — format dirancang di bawah, menunggu ebook darinya; (ii) **gap analysis dari requirement lowongan** — SELESAI (31 lesson, total 473/24 track, rapat verifikasi 2026-10-14); (iii) **kurikulum course orang lain + rekomendasi topik web/jurnal** — hasil riset 2026 di bawah. Anti-duplikasi dicek via grep judul lesson aml/cr/mr/rr yang live.

### Temuan riset 2026 (klaim dari halaman/snippet nyata; yang belum terverifikasi ditandai)

1. **CFA L1 2026: tidak ada perubahan substansif vs 2025** — 10 topik, bobot sama ("stability push" CFA Institute). Baru di **2027**: "Portfolio Management" → "Portfolio Construction", modul 93→102, modul *financial data science* baru di Quantitative Methods. https://www.swiftintellect.com/post/cfa-level-1-curriculum-changes-2026-complete-guide-to-what-s-new-and-removed · https://soleadea.org/cfa-level-1/topic-weights
2. **Practical Skills Module wajib** CFA (Financial Modeling atau Python, 10–20 jam; hasil ujian hangus bila tak selesai) — relevan untuk track data. https://www.examdetail.in/exams/cfa-level-1-2026
3. **FRM Part 1 2026: 62 bab, 0 bab baru/hapus** — pergeseran di Quantitative Analysis: *Hypothesis Testing* dan *Stationary Time Series* (5 revisi LOS) kini menuntut **deskripsi + kalkulasi** (soal hitungan bertambah); penekanan ML diperkuat. https://www.swiftintellect.com/post/frm-2025-vs-2026-curriculum-updates-what-garp-candidates-need-to-know
4. **FRM Part II 2026 "Current Issues":** implikasi AI untuk pasar modal, **private credit**, risiko geopolitik, utang pemerintah, **crypto & digital assets**, digital resilience. https://edudelphi.com/ae/frm-course-dubai/
5. **CAMS edisi ke-7 (rilis 15 Jul 2025)** — overhaul terbesar: dari murni AML ke spektrum **Anti-Financial Crime** (sanctions evasion, bribery & corruption, cybercrime, fraud, ESG-linked crime); modular 4 core + 2 elektif; domain: Financial Crime Risks & Methods ~30%, Global AFC Frameworks ~20%, Building an AFC Program ~30%, **Tools & Technologies ~20%** (AI/pKYC/RegTech). https://open-exam-prep.com/blog/cams-exam-guide-2026
6. **ICA** — sertifikasi modular (certificate→diploma), kuat kerangka UK/EU (risk-based approach, CDD/ongoing monitoring, kerentanan sektoral). Alternatif CAMS bila target UK/Eropa/APAC. https://www.sanctions.io/blog/top-5-anti-money-laundering-certifications-in-2025-guide
7. **OJK 2026 (fintech lending):** revisi POJK 40/2024 target terbit 2026 mewajibkan **pooling funds ≥5% dari platform fee neto** tiap penyaluran (deposito/SBN); TWP90 industri **4,32%** (Jul 2026) mendekati batas 5%; kasus Crowde P.21 Jan 2026 (dugaan TPPU di LPBBTI). https://tradersunion.com/ind/news/financial-news/show/3788771-ojk-pooling-funds-fintech-lending/ · https://www.infonasional.com/ojk-awasi-crowde-aturan-pendanaan
8. **Loker aktual:** Risk Strategy Analyst (SQL + credit risk), fraud analytics lead, BI Analyst bank digital (SQL + Power BI/Tableau/**Looker**), Data Risk & Protection (Python + SQL + ISO 27001), RCSA/IAM untuk IT risk. https://id.jobstreet.com/credit-risk-analyst-jobs/in-Setiabudi-Jakarta (agregat pencarian)
9. Belum terverifikasi penuh — tandai sebelum jadi lesson: klaim "Fintech in Investment Management" CFA mencakup DeFi/blockchain; status grey list FATF Indonesia; jadwal adopsi ISSB di Indonesia.

### 15 topik kandidat (belum ada di 24 track)

1. Bribery & corruption dalam program AFC → **aml12** — domain inti CAMS 7th ed; belum ada di track aml.
2. Cybercrime-enabled laundering (ransomware, BEC, pig butchering) → **aml13** — CAMS 7th ed; track fr fokus deteksi fraud, bukan pencuciannya.
3. RegTech, AI & pKYC untuk AFC → **aml14** — domain "Tools & Technologies" ~20% CAMS 7th ed; aml punya IRA (penilaian), belum peralatannya.
4. Sanctions evasion methods (dark fleet, crypto mixer, circumvention) → **aml15** — aml4 hanya screening; CAMS 7th ed menekankan evasi; selaras isu geopolitik FRM 2026.
5. Implikasi grey list FATF bagi compliance Indonesia → **aml16** — tema 2025–2026 paling nyata untuk analis AML lokal (verifikasi status terkini sebelum tulis).
6. Fraud–AML–cyber fusion center → **aml17** — sudut organisasi/operasional spektrum AFC CAMS 7th ed; fr2 hanya bandingkan konsep.
7. Private credit & leveraged lending risk → **cr26** — current issue FRM 2026; cr belum sentuh kelas aset ini.
8. Credit risk fintech lending 2026 (TWP90, pooling funds 5%, repayment capacity) → **cr27** — revisi POJK 40/2024 target 2026; loker fintech nyata cari ini.
9. Climate risk untuk kredit (fisik vs transisi, skenario NGFS) → **cr28** — isu FRM 2026; cr18 hanya industri/negara umum.
10. Model risk management: SR 11-7 → AI model governance → **mr20** — FRM 2026 angkat implikasi AI; mr18/cr19 hanya validasi statistik, bukan inventory/lifecycle.
11. Crypto market risk (depeg stablecoin, basis, custody) → **mr21** — current issue FRM 2026; mr belum sentuh aset digital.
12. Geopolitical risk & scenario design untuk market risk → **mr22** — current issue FRM 2026; komplementer aml4 dari sisi stress/valuasi.
13. Laporan likuiditas: LCR/NSFR monitoring & early warning → **rr19** — rr10 hanya aturan; loker BI analyst minta dashboard likuiditas.
14. Sustainability/ISSB reporting (IFRS S1/S2) untuk fungsi risiko → **rr20** — tren disclosure 2026 (jadwal adopsi ID belum terverifikasi).
15. Operational risk reporting: RCSA, loss data, KRI operasional → **rr21** — loker risk analyst nyata minta RCSA; rr13 KRI masih generik.

### Format "bedah ebook" → lesson (template generik, siap dieksekusi)

- **S0 — Inventarisasi:** catat metadata (judul, edisi, tahun, halaman, daftar isi); cocokkan dengan track; putuskan bab mana dipetakan, mana dilewati (kedaluwarsa/duplikat).
- **S1 — Ekstraksi per bab:** teks per bab via ekstraktor PDF (mis. PyMuPDF); bila hasil scan, OCR dulu; catat halaman & figure asli sebagai referensi internal.
- **S2 — Peta bab→lesson:** satu bab boleh jadi 1+ lesson; tiap lesson: slug, track tujuan, prasyarat; pastikan tidak duplikat dengan registry 473 lesson (grep judul).
- **S3 — Ringkasan konsep kunci per bab:** definisi (→ bahan kuis recall), rumus (→ KaTeX, wajib jelaskan tiap simbol), contoh angka (→ lab Pyodide), studi kasus (→ mini-case), istilah kunci (→ glosarium).
- **S4 — Pemetaan ke format step v2:** teori naratif (ID, istilah teknis EN) → visual/SVG → chart Plotly (dari data contoh bab) → KaTeX → kuis (recall + aplikasi + jebakan miskonsepsi dari bab) → lab Pyodide (rekonstruksi perhitungan bab, checks dari output nyata) → mini-case → tips.
- **S5 — QA ala WORKFLOW.md:** model durasi ≥45 mnt, render KaTeX/SVG penuh, lab lolos runtime Pyodide asli, `tsc` 0 error, verifikasi fakta 2026 ke sumber primer bila bab menyebut regulasi/angka.
- **[CONTOH ILUSTRATIF — bukan judul nyata]** Bab generik "Value at Risk" → lesson mrX: definisi VaR vs ES → visual ekor distribusi → Plotly histogram P&L → KaTeX VaR parametrik → kuis "mengapa VaR bukan koheren" → lab hitung VaR historis dengan numpy → mini-case laporan VaR harian desk trading. Hanya pola; ganti dengan bab sungguhan saat eksekusi.
- **Batasan jujur:** (a) hanya ebook milik sendiri/berlisensi — jangan unggah buku bajakan; (b) kualitas lesson ≤ kualitas sumber — buku lama wajib dikalibrasi ke fakta 2026; (c) parafrase, jangan salin blok teks panjang; rumus & fakta numerik boleh dipakai ulang; (d) estimasi: 1 bab padat ≈ 1–2 lesson ≈ 1 sesi penulis.

---

## Rekomendasi urutan eksekusi (untuk keputusan Septian)

1. **FSRS + tag skill per kuis** (effort kecil) — fondasi retensi lintas 473 lesson; prasyarat USP #1.
2. **sql.js + echarts** (kecil–sedang) — lab SQL nyata + chart keuangan native (candlestick, boxplot, heatmap) yang kurang di Plotly.
3. **15 topik kandidat di atas** sebagai backlog konten berikutnya (prioritas: aml12–aml17 untuk CAMS 7th ed; cr27 untuk loker fintech 2026) — tiap batch mengikuti QA WORKFLOW.md yang sudah terbukti.
4. **Dashboard kesiapan karier** (USP #3) — dibangun di atas data mastery yang mulai terkumpul dari langkah 1–2.
5. **Bedah ebook** — menunggu Septian menyerahkan file ebook-nya; format S0–S5 siap dieksekusi.
6. **TTS native** — pilot 1 lesson setelah uji suara di perangkatnya; Kokoro hanya bila terbukti perlu.
7. PWA offline + gamifikasi ringan — setelah langkah 1–4 stabil.

Keputusan terbuka untuk Septian: (a) ebook mana yang dibedah duluan; (b) 15 topik — tulis semua atau pilih; (c) USP mana yang dipilotkan duluan (#1 tutor+FSRS vs #3 dashboard karier).
