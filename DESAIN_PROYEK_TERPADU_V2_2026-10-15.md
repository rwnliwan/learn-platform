# DESAIN FITUR BARU "MISI" — Guided Project v2 untuk Learn v2

**Tanggal:** 2026-10-15 · **Status:** DESAIN + RISET DATASET (fase 1) — tidak ada kode/konten yang diubah.
**Perintah:** Septian 2026-10-15 07:11 WITA + penegasan 07:14/07:15 WITA.
**Batasan keras fase ini:** rr19-audit-impostor.ts TIDAK disentuh; nav "Proyek" TIDAK diubah; Progress Hub (`~/workspace/progress-app`) TIDAK disentuh sama sekali.

Dokumen pendamping: `DATASET_PUBLIK_PROYEK_2026-10-15.md` (katalog dataset terverifikasi per proyek).

---

## 1. Nama fitur + konsep

### 1.1 Nama usulan: **Misi**

- **Usulan:** fitur bernama **"Misi"**, route `/v2/misi`, galeri `/v2/misi`, runner `/v2/misi/[slug]`.
- **Alasan:**
  - "Proyek" sudah dipakai nav existing (menunjuk rr19-audit-impostor — dan itu TIDAK boleh diubah per perintah). Memakai nama yang sama untuk fitur baru akan membingungkan.
  - "Guided Project" adalah istilah Progress Hub; memakainya di v2 mengaburkan batas dua produk.
  - "Misi" = peran + tujuan + deliverable + briefing. Profesional, gamified, dan pas dengan tema impostor (misi auditor, misi investigator). Alternatif yang ditolak: "Studio Proyek" (terdengar seperti ruangan/perkakas, bukan aksi), "Operasi" (nada militer, tidak cocok untuk Health DS/Bioinformatika), "Kampanye" (konotasi marketing).
  - Keputusan final tetap di tangan Septian — dokumen memakai "Misi" sebagai working name.

### 1.2 Konsep: evolusi Guided Projects Hub, bukan porting

Mekanik Hub yang dicek ulang dari `game.js` (±baris 2945): case nyata ber-gate — baca panduan → tulis kode/jawab kuis → **lulus review** → langkah berikutnya terbuka; progres per user; XP; estimasi ±90 menit; 5 case (math, investment, statistics, business acumen, crypto); halaman case memuat tujuan, USP, kelebihan/keterbatasan, pertanyaan yang dijawab, stack, skema data, sumber data, real cases.

**Yang dipertahankan dari Hub:** gate nyata (review lulus → lanjut), progres per user, XP, durasi 90+ menit, case dari data nyata, metadata case (tujuan/USP/skema data/sumber).

**Yang diubah/diperdalam di v2:**
1. **Peran + briefing misi**, bukan sekadar panduan. Pelajar adalah epidemiolog / bioinformatician / investigator dengan tugas dari "klien" — ada stakes naratif.
2. **Data room dari dataset publik nyata yang kotor** (bukan data mainan yang sudah bersih). Dataset terverifikasi di dokumen dataset.
3. **Mesin lab v2 yang sudah ada** dipakai ulang: Pyodide (Python), sql.js (SQL), ECharts, tangga petunjuk Socratic — tidak ada mesin baru untuk lab.
4. **Checkpoint keputusan bercabang** — pilihan pelajar mengubah langkah berikutnya (bukan kuis benar/salah). Dinilai kualitas keputusan.
5. **Suntikan impostor** digeneralisasi dari pilot rr19 (komponen baru, rr19 tidak disentuh).
6. **Deliverable akhir** — laporan/rekomendasi yang dinilai rubrik, bukan sekadar skor kuis.

**Bedanya dengan rr19 (pilot existing):** rr19 adalah satu *lesson* dengan komponen impostor di dalamnya (13 langkah, 60 menit, dataset Brain internal). Misi adalah *format fitur tersendiri*: galeri proyek, narasi peran, 90–150 menit, dataset publik, keputusan bercabang, deliverable ber-rubrik. Tidak ada duplikasi — rr19 tetap lesson; Misi adalah lapisan fitur baru di atasnya.

### 1.3 Penilaian 7 elemen struktur misi (usulan parent)

| # | Elemen | Putusan | Alasan |
|---|--------|---------|--------|
| 1 | Briefing misi/peran | **PERTAHANKAN + perdalam** | Ini pembeda utama vs lesson biasa. Briefing memuat: cerita pembuka (F6), peran, klien, tujuan terukur, dan **ringkasan prasyarat 2–3 kalimat** (bukan "buka lesson X dulu" — F2). |
| 2 | Data room (dataset publik nyata, kotor) | **PERTAHANKAN** | Perintah eksplisit Septian 07:14. Dataset = snapshot kecil terverifikasi (lihat dokumen dataset). Data room memuat: deskripsi dataset, skema, lisensi/atribusi, metode sampling (jujur), dan peringatan "data ini kotor — itu disengaja". |
| 3 | Lab ber-gate | **PERTAHANKAN (pakai ulang)** | Mesin Pyodide + sql.js + checks sudah ada dan terverifikasi. Tidak dibangun ulang. Gate = checks lolos → lanjut (F4: gate nyata, bukan kosmetik). |
| 4 | Checkpoint keputusan (bercabang, konsekuensi) | **UBAH/NAIKKAN** | Di Hub tidak ada. Spesifikasi baru `decision`: opsi → `nextStepId` berbeda, tiap opsi membawa konsekuensi data/narasi di langkah berikut; dinilai kualitas keputusan via rubrik, bukan benar/salah. |
| 5 | Suntikan impostor | **PERTAHANKAN (generalisasi)** | Pola rr19 terbukti (5 suntikan, skor deteksi 5/5 & 0/5). Dibuat komponen baru generik untuk dossier tabular apa pun; komponen `ImpostorAudit` milik rr19 **tidak diubah** — komponen baru terpisah. |
| 6 | Deliverable akhir (laporan/rekomendasi) | **BARU** | Template deliverable + rubrik penilaian (isi, metodologi, kejujuran batas data). Ini yang membuat misi "melatih penilaian", bukan sekadar "mengajarkan". |
| 7 | Debrief | **PERTAHANKAN + perdalam** | Debrief membuka semua suntikan + skor deteksi + rubrik deliverable + bahaya di pekerjaan nyata (pola rr19) + refleksi keputusan bercabang ("apa yang berubah jika kamu pilih opsi lain"). |

---

## 2. Arsitektur teknis di v2 (desain, belum dibangun)

### 2.1 Route
- **Baru:** `/v2/misi` (galeri kartu proyek: judul, track, peran, estimasi, progres, XP) dan `/v2/misi/[slug]` (mission runner).
- **Existing tidak diubah:** `/v2/learn/rr19-audit-impostor` tetap; nav "Proyek" tetap menunjuk ke sana.
- **Nav baru:** item sidenav "Misi" → `/v2/misi` diusulkan — **hanya ditambahkan bila Septian ACC** (perintah: boleh tab/route sendiri). Sampai ACC, galeri dapat dijangkau via link dari dashboard/kurikulum dan URL langsung.

### 2.2 Model data
- `V2Mission` = `V2Lesson` + field misi: `role` (peran), `client` (klien/narasi), `module: "Misi"`, `estMinutes: 90–150`.
- Step baru (semua opsional, aditif — tidak mengubah tipe existing):
  - `briefing?: { story, objectives[], prereqSummary, datasetNote }`
  - `decision?: { prompt, options: [{ id, label, rationale, nextStepId, consequenceNote }] }`
  - `deliverable?: { template, rubric: [{ criterion, weight, levels }] }`
  - dossier generik untuk audit: `auditDossier?: { columns, rows, injections[] }` (pola dari `ImpostorAuditSpec`, tipe baru — bukan reuse tipe rr19 agar rr19 tetap beku).
- Registrasi: `REG_MISI` di `src/app/v2/lib/reg-misi.ts`, di-spread di `registry.ts` — pola identik REG_* existing, murni aditif.
- **F2 ditegakkan di level data:** tidak ada field "requiresLesson"; prasyarat hanya teks ringkasan di briefing; `nextStepId` decision hanya menunjuk step dalam misi yang sama.

### 2.3 Komponen: pakai ulang vs baru
**Pakai ulang (tidak diubah):** Workspace step engine (langkah, gating `canNext`), lab Pyodide + checks, SqlLab (sql.js), EChartFigure, kuis + `why`, HintLadder (tangga Socratic), TTS, gamifikasi (XP/streak/badge), FSRS (kartu kuis misi ikut antrean review — opsional, default ikut).
**Baru (dibangun di fase build):** `MissionGallery`, `MissionBriefing`, `DecisionCheckpoint` (render opsi + konsekuensi + simpan pilihan), `DeliverablePanel` (template + rubrik + self-check), `MissionAuditDossier` (generalisasi dossier impostor untuk dataset tabular apa pun — komponen baru, `ImpostorAudit.tsx` milik rr19 tidak disentuh).

### 2.4 Penyimpanan progres
- Pola existing `/api/progress` + Neon sudah terbukti persisten (Tandai Selesai round-trip terverifikasi di gerbang).
- Desain: kunci progres per langkah misi `misi:<slug>:langkah:<stepId>` — **aditif**, tidak mengubah perilaku route existing.
- Opsi implementasi (diputuskan di fase build, butuh ACC bila menyentuh API): localStorage-first `v2:misi:<slug>` (pola FSRS) + mirror ke Neon via `/api/progress`; atau langsung Neon. Keputusan: mulai localStorage-first agar tidak mengubah API existing, mirror menyusul.

### 2.5 API baru
- `GET /api/v2/misi` (daftar misi + progres ringkas), `GET /api/v2/misi/[slug]` (definisi misi).
- **Aturan terkunci:** semua route API baru **WAJIB** `export const runtime = "edge"` (pelajaran deploy 2026-10-15: next-on-pages gagal tanpa ini).

### 2.6 Checklist teknis v2 (terkunci, dari pelajaran build)
- Prosa konten RAW (`<`, `>`, `&` ditulis apa adanya — bukan entitas HTML; pengecualian hanya string const SVG).
- KaTeX dalam `String.raw` dengan backslash tunggal.
- Patuh `tokens-v2.css` ketat: tanpa gradient, emoji tidak berlebihan, spacing basis 8px, container max-width 880px.
- Mobile: tidak ada horizontal overflow; dark theme: semua teks terbaca.
- Plotly hanya via CDN (jangan bundle; batas Cloudflare 25MB).

---

## 3. Spesifikasi 3 proyek pilot pertama

Prinsip umum pilot: 90–150 menit; struktur 7 elemen §1.3; F1–F6 terkunci (§5); dataset dari dokumen dataset (lisensi terverifikasi); rubrik penilaian per pilot.

### Pilot A — Health Data Science
- **Judul:** "Misi DBD: Laporan Surveilans yang (Tidak) Jujur"
- **Dataset:** OpenDengue v1.3, slice Indonesia (nasional/subnasional) — **CC BY-SA** (kutipan: Clarke et al., *Scientific Data* 2024; snapshot wajib membawa atribusi + lisensi).
- **Peran:** Epidemiolog/auditor data di Dinas Kesehatan menerima laporan mingguan kasus DBD dari unit pelapor (kabupaten/kota).
- **Briefing:** cerita pembuka (lonjakan DBD yang "terlalu rapi" di 3 kabupaten), tujuan terukur, ringkasan prasyarat (insidens, definisi kasus — 2–3 kalimat, F2).
- **Data room:** laporan mingguan per unit pelapor × minggu; kolom: unit, tanggal mulai/akhir, total kasus, definisi kasus. Metode sampling dinyatakan jujur di app.
- **Langkah misi (ringkas):** briefing → data room → lab EDA Pyodide (baseline musiman, deteksi lonjakan) → lab SQL (temukan baris duplikat) → **checkpoint keputusan** (pilih 3 unit untuk investigasi lapangan — tiap pilihan membuka bukti berbeda di langkah berikut) → **impostor** (baris unit-minggu duplikat, tanggal mulai/akhir tertukar, lonjakan mustahil vs baseline musiman) → **deliverable** (laporan rekomendasi: unit mana ditindak, bukti, batas data) → **debrief** (semua suntikan + skor deteksi + rubrik deliverable + bahaya nyata: alokasi fogging/vaksin salah sasaran).
- **Rubrik:** deteksi impostor (skor X/5 ala rr19), kebenaran lab, kualitas keputusan (alasan pemilihan unit), kualitas deliverable (bukti + kejujuran batas data).
- **Estimasi:** 90–120 menit.
- **Catatan jujur:** ketersediaan data Indonesia di kadens mingguan level adm_1 **belum terkonfirmasi tanpa unduh** — verifikasi di fase build; fallback: CDC NHSN facility data (public domain AS) sebagai skenario alternatif.

### Pilot B — Bioinformatika
- **Judul:** "Misi Lab: Sampel yang Tertukar"
- **Dataset:** `seqc` (SEQC/MAQC-III, Bioconductor) — **GPL-3** (terverifikasi di halaman Bioconductor). Multi-site nyata (12 situs × 3 platform), ERCC spike-in + TaqMan RT-PCR sebagai ground truth QC.
- **Peran:** Bioinformatician menerima paket hasil sequencing (matriks count + metadata sampel + metrik QC) dari core facility.
- **Briefing:** cerita pembuka (hasil DE "terlalu bagus untuk jadi kenyataan"), tujuan terukur, ringkasan prasyarat (count matrix, batch effect — 2–3 kalimat, F2).
- **Data room:** 16 sampel (ILM, 2 situs, sampel A/B × 4 replika), top 3.000 gen paling bervariasi + 92 ERCC; `samples.csv` + `qc.csv` (library size, genes detected, fraksi ERCC). Kriteria seleksi dinyatakan eksplisit.
- **Langkah misi (ringkas):** briefing → data room → lab QC Pyodide (library size, fraksi ERCC, PCA — deteksi batch) → lab kedua (DE ulang per situs) → **checkpoint keputusan** (sampel mana direkomendasikan untuk re-sequence — pilihan mengubah analisis lanjutan) → **impostor** (label A/B tertukar di 2 sampel, satu kolom duplikat diam-diam, satu batch berkualitas rendah) → **deliverable** (laporan QC + rekomendasi re-seq + justifikasi) → **debrief** (semua suntikan + skor + rubrik + bahaya nyata: kesimpulan biologis salah dari data terkontaminasi).
- **Beat sekunder (opsional):** pola keputusan "exclude from DE" dari paper CleanUpRNAseq/GSE260697 — dipakai hanya bila lisensi GEO terkonfirmasi ulang di fase build; bila tidak, beat ini diganti injeksi simulasi yang dinyatakan sebagai simulasi.
- **Rubrik:** deteksi impostor, kebenaran analisis QC/PCA, kualitas keputusan re-seq (alasan + biaya), kualitas deliverable.
- **Estimasi:** 120–150 menit.

### Pilot C — Blockchain Data Scientist
- **Judul:** "Misi Investigasi: Jejak Dana Peretasan"
- **Dataset primer:** BitcoinHeist Ransomware Address Dataset (UCI ML Repository) — **CC BY 4.0** (sharing + adaptasi + komersial boleh dengan atribusi). 2,9 jt alamat; fitur laundering (`length` mixing rounds, `weight`, `looped`, `neighbors`, `income`); label keluarga ransomware (Cryptxxx, CryptoLocker, Cerber, Locky, CryptoWall, …) + `white`.
- **Dataset orakel:** OFAC sanctioned digital-currency addresses (0xB10C) — data OFAC = karya pemerintah federal AS (public domain) + tool MIT. Daftar alamat per aset, <100 KB.
- **Dataset beat impostor:** kptlamzn crypto-wallet-address-labels — repo MIT tetapi **lisensi per komponen mengikuti sumber asal** (subset Elliptic tetap CC-BY-NC-ND → hanya referensi, tidak dibundel).
- **Peran:** Investigator blockchain untuk sebuah exchange yang menerima "laporan bersih" atas sekelompok wallet mencurigakan.
- **Briefing:** cerita pembuka (laporan exchange mengklaim wallet bersih; 2 di antaranya muncul di daftar sanksi), tujuan terukur, ringkasan prasyarat (address clustering, mixing — 2–3 kalimat, F2).
- **Data room:** sampel alamat (semua berlabel ransomware + 10k `white` stratified, seed tetap) + daftar OFAC ter-pinned bertanggal + label entitas terverifikasi.
- **Langkah misi (ringkas):** briefing → data room → lab Pyodide (distribusi mixing rounds per label; flag wallet berlabel yang dilaporkan bersih) → lab SQL (join vs daftar OFAC) → **checkpoint keputusan** (bekukan / pantau / lepas — tiap opsi mengubah temuan lanjutan) → **impostor** (label KYC palsu pada 2 wallet, entitas duplikat dengan nama sedikit berbeda, klaim "sudah lewat mixer bersih") → **deliverable** (laporan investigasi + rekomendasi) → **debrief** (semua suntikan + skor + rubrik + bahaya nyata: exchange memproses dana sanksi).
- **Catatan jujur:** Elliptic dataset (CC-BY-NC-ND) **tidak dibundel** — NC+ND memblokir re-hosting sampel; hanya referensi. Tidak ada edge list di BitcoinHeist — misi dibingkai sebagai audit laporan (bukan literal hop-tracing), dan itu dinyatakan jujur di briefing.
- **Rubrik:** deteksi impostor, kebenaran analisis fitur mixing, kualitas keputusan (bekukan/pantau/lepas + alasan), kualitas deliverable.
- **Estimasi:** 90–120 menit.

---

## 4. Peta jalan (desain → build)

1. **Fase build** (perintah terpisah): tipe `V2Mission` + komponen baru + `REG_MISI` + route `/v2/misi`; rr19 & nav existing tidak disentuh; item nav "Misi" menunggu ACC Septian.
2. **Snapshot dataset** dibangun dengan skrip terdokumentasi per proyek (metode sampling eksplisit, seed tetap, file lisensi/atribusi ikut dibundel).
3. **Verifikasi ulang sebelum build konten:** lisensi yang statusnya "belum terverifikasi dari halaman" (Statlog, Online Retail II, Sparkov, GEO) dikonfirmasi via `ucimlrepo`/API; kadens mingguan OpenDengue Indonesia dikonfirmasi; Kaggle-login datasets diunduh manual oleh yang punya akun.
4. **Gerbang QA** mengikuti pola gerbang parent: tsc 0 error, harness lab (solusi Python/SQL dieksekusi nyata), skenario skor impostor (semua-tertangkap & semua-terlewat), E2E browser, responsive sweep.

---

## 5. Batas desain terkunci — WORKFLOW.md F1–F6 (verbatim, berlaku penuh)

**F1 Filler Phrases (auto-reject):** "Pada lesson kali ini kita akan membahas…", "Seperti yang telah dibahas sebelumnya…", "Mari kita mulai pembahasan…", "Selanjutnya, kita akan melihat…", "Penting untuk diingat bahwa…" (tanpa isi spesifik), pengulangan definisi >2x. → Berlaku untuk prosa misi.

**F2 Rantai Merusak:** tidak ada referensi silang yang bergantung pada lesson/proyek lain yang belum ada; setiap misi self-contained; prasyarat = ringkasan 2–3 kalimat di briefing, bukan "lihat lesson X". Gate langkah hanya pada langkah sebelumnya dalam misi yang sama.

**F3 Shallow Content:** setiap konsep wajib: cerita → definisi → simbol → contoh → visualisasi → miskonsepsi → latihan. Rumus wajib: penjelasan tiap simbol + interpretasi ("angka ini artinya…") + contoh angka konkret.

**F4 Fake Interactivity:** kuis punya feedback spesifik (bukan "benar/salah" saja) + score tracking; lab runnable & editable (Pyodide/sql.js, bukan display); chart dari data nyata + panduan "cara membaca" + "interpretasi"; gate = hasil nyata (checks lolos, keputusan tercatat, debrief dibuka).

**F5 AI Slop Design:** tokens-v2.css ketat; tanpa gradient; emoji tidak berlebihan; spacing konsisten basis 8px; container max-width 880px.

**F6 Missing Pedagogy (auto-reject bila absen):** Cerita Pembuka, Miskonsepsi box (min. 2), Peta Keputusan, Mini-Case terintegrasi, Live Code Lab (min. 1), chart dengan "Cara membaca" + "Interpretasi".

**Checklist teknis terkunci:** prosa RAW (bukan entitas HTML); KaTeX `String.raw` backslash tunggal; route API baru `export const runtime = "edge"`; Plotly via CDN; mobile tanpa overflow horizontal; dark theme terbaca.

---

## 6. Keputusan terbuka untuk Septian

1. Nama final fitur ("Misi" vs alternatif) + apakah item nav "Misi" ditambahkan (rr19/"Proyek" tetap tak berubah apapun putusannya).
2. Urutan build 3 pilot (usulan: A → C → B, dari yang datasetnya paling siap).
3. Kebijakan lisensi untuk dataset "abu-abu" (Elliptic NC-ND, Olist NC-SA): referensi-saja vs hubungi pemilik vs ganti dataset.
4. Siapa mengunduh dataset ber-login Kaggle (tidak ada API key di VM).
