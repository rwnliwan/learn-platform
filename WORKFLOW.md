# LESSON BUILD WORKFLOW v2.0
> Aturan wajib untuk semua pembuatan lesson. Dibuat 2026-10-12 atas instruksi Septian.
> v2.0: Upgrade ke standar HTML referensi (ch01-mean-median-mode) — 2026-10-12.

## Prinsip
1. Kualitas WAJIB setara HTML referensi `ch01-mean-median-mode__2.html` (bukan sekadar "minimum")
2. 45-60 menit per lesson, tidak dangkal, interaktif
3. Boleh pecah jadi Part 1/2 atau one-page panjang
4. Gap analysis sebelum tulis — topik tidak boleh lompat terlalu jauh
5. Setiap lesson = pengalaman belajar lengkap, bukan sekadar artikel

## STRUKTUR WAJIB PER LESSON (mengikuti HTML referensi)

Setiap lesson HARUS memuat komponen berikut, dalam urutan ini:

### 1. Cover
- Judul dengan angle menarik (bukan sekadar topik): "Mean, Median, Mode: Kapan Masing-Masing Menipu"
- Metadata: durasi (45–60 mnt) • jumlah lab • jumlah quiz • mini-case

### 2. Daftar Isi (TOC)
- Anchor links ke setiap section
- Numbered, jelas

### 3. Tujuan Pembelajaran
- 3-5 bullet: apa yang bisa dilakukan pembaca setelah selesai
- Spesifik dan measurable ("Menentukan ukuran mana yang jujur untuk tiap jenis data")
- Termasuk "kapan ketiganya semua menipu" (critical thinking)

### 4. Cerita Pembuka (Story Hook)
- Naratif konkret yang memancing rasa ingin tahu
- Contoh: "Startup mengumumkan rata-rata gaji Rp57 juta..."
- Harus ada twist: angka benar secara matematis tapi salah secara makna
- Bukan definisi kering!

### 5. Konsep Inti (dengan "Kepribadian")
- Setiap konsep punya angle/karakter: "Mean — Si Pekerja Keras yang Gampang Dipengaruhi"
- Struktur per konsep:
  - **Definisi** (singkat, jelas)
  - **Rumus** (KaTeX) + **penjelasan tiap simbol** ("x̄ = rata-rata sampel, n = banyaknya data...")
  - **Contoh langkah-demi-langkah** (dalam `<details>`, bisa dibuka)
  - **Kepribadian/intuisi** (paragraf yang memberi "rasa" konsep)
  - **Kapan memakai** (kondisi konkret)
  - **Miskonsepsi box** (🚨 "Mitos: ..." → "Yang benar: ...")

### 6. Tips / Intuisi Kunci (💡 boxes)
- Insight yang tidak obvious dari definisi
- Contoh: "Median hanya peduli urutan, bukan besar nilai"

### 7. Lab Interaktif (Live Code dengan Pyodide)
- Minimal 1-2 lab per lesson
- Code HARUS editable dan runnable (textarea + tombol Jalankan)
- Harus ada instruksi eksplorasi: "Coba: 500 → 50 → 5000. Pada titik berapa...?"
- Output ditampilkan di bawah
- Tidak perlu install, jalan di browser

### 8. Chart dengan Panduan Baca
- Setiap chart WAJIB ada:
  - **"Cara membaca:"** (sumbu X = ..., tinggi batang = ...)
  - **"Interpretasi:"** (apa artinya pola ini?)
- Chart dari data nyata/contoh konkret, bukan placeholder
- Minimal 1 chart per konsep utama

### 9. Peta Keputusan (Decision Map)
- 3-5 skenario: "Kondisi data X → Pakai Y"
- Setiap skenario: kondisi + chart ilustrasi + alasan + contoh nyata
- Ditutup dengan "Aturan praktis 10 detik" (checklist cepat)

### 10. Mini-Case Study
- Skenario dunia nyata (risiko kredit, fraud, dsb.)
- Data konkret dengan angka
- Pertanyaan analisis (bukan sekadar recall)
- Pembahasan dalam `<details>`

### 11. Quiz (dengan Score Tracking)
- Minimal 4-6 soal per lesson
- Setiap soal: pertanyaan + 4 opsi + feedback spesifik (bukan sekadar benar/salah)
- Feedback menjelaskan MENGAPA (w = why)
- Score tracker: "Skor: X/6, lulus ≥ 5"
- Klik jawaban → feedback langsung muncul

### 12. Rangkuman
- Bullet points: 1 baris per konsep kunci
- Termasuk "kapan TIDAK pakai" (critical thinking)

### 13. Progress Bar (sticky)
- Menunjukkan % lesson yang sudah dibaca (berdasarkan scroll)
- Update saat quiz dijawab

## KOMPONEN INTERAKTIF (implementasi)

| Komponen | Implementasi | Catatan |
|----------|--------------|---------|
| Quiz | `Quiz.tsx` | Props: question, options[4], correct, explanation |
| Chart | `PlotlyChart.tsx` | Load dari CDN (bukan bundle!) |
| Math | `Tex.tsx` | Pakai `String.raw` untuk hindari escaping issue! |
| Kalkulator | `StatsCalculator.tsx` | Input angka → statistik live |
| Live Python | Pyodide via CDN | Textarea editable + tombol Jalankan |
| Callout | CSS `.callout` | Info umum |
| Warning | CSS `.callout-warning` | Jebakan / perhatian |
| Myth | CSS `.myth` | Miskonsepsi (🚨) |
| Tip | CSS `.tip` | Intuisi kunci (💡) |
| Story | CSS `.story` | Cerita pembuka (italic, border kiri) |
| Table | CSS `.data-table` | Wrap dengan `overflow-x: auto` |

### ⚠️ KaTeX Escaping Rule (PENTING!)
- SELALU pakai `math={String.raw`...`}` bukan `math="..."`
- Alasan: JSX string memakan backslash (`\b`, `\f`, `\n` jadi escape sequences)
- Contoh benar: `<Tex math={String.raw`\bar{x} = \frac{1}{n}`} block />`
- Contoh SALAH: `<Tex math="\\bar{x} = \\frac{1}{n}" block />`

### ⚠️ Plotly Bundle Rule (PENTING!)
- JANGAN bundle plotly.js (43MB > limit Cloudflare 25MB!)
- Load dari CDN: `https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js`
- Gunakan dynamic script injection di component

## ANTI-PATTERN FLAGS (auto-reject jika terdeteksi)

### F1: Filler Phrases
Daftar frasa yang DILARANG (terdeteksi = lesson ditolak):
- "Pada lesson kali ini kita akan membahas..."
- "Seperti yang telah dibahas sebelumnya..."
- "Mari kita mulai pembahasan..."
- "Selanjutnya, kita akan melihat..."
- "Penting untuk diingat bahwa..." (tanpa isi spesifik setelahnya)
- Pengulangan definisi yang sama >2x dalam satu lesson

### F2: Rantai Merusak (Chain Damage)
- Jangan buat referensi silang yang bergantung pada lesson lain yang belum ada
- Setiap lesson harus self-contained (bisa dibaca tanpa baca lesson lain)
- Jika butuh prasyarat, tulis ringkasan 2-3 kalimat, bukan "lihat lesson X"

### F3: Shallow Content
- Setiap konsep WAJIB ada: cerita → definisi → simbol → contoh → visualisasi → miskonsepsi → latihan
- Tidak ada paragraf yang hanya definisi kamus tanpa contoh
- Setiap rumus WAJIB ada: (1) penjelasan tiap simbol, (2) interpretasi ("angka ini artinya..."), (3) contoh angka konkret

### F4: Fake Interactivity
- Quiz harus punya feedback spesifik (bukan "benar"/"salah" saja) + score tracking
- Code lab harus runnable dan editable (Pyodide, bukan sekadar display)
- Chart harus dari data nyata + ada panduan "cara membaca" dan "interpretasi"
- Kalkulator harus live (input → hasil update real-time)

### F5: AI Slop Design
- Ikuti tokens-v2.css secara ketat
- Tidak ada gradient, emoji berlebihan, atau warna di luar palet
- Spacing konsisten 8px base
- Container max-width 880px (responsive, tidak terlalu sempit di desktop)

### F6: Missing Pedagogy (BARU v2.0)
- Lesson tanpa Cerita Pembuka = DITOLAK
- Lesson tanpa Miskonsepsi box = DITOLAK
- Lesson tanpa Peta Keputusan = DITOLAK
- Lesson tanpa Mini-Case = DITOLAK
- Lesson tanpa Live Code Lab = DITOLAK
- Chart tanpa "Cara membaca" + "Interpretasi" = DITOLAK
- Rumus tanpa penjelasan simbol = DITOLAK

## QA CHECKLIST (sebelum lesson dinyatakan selesai)

### Konten
- [ ] Ada Cerita Pembuka dengan twist/narrative hook
- [ ] Ada Tujuan Pembelajaran (3-5 bullet spesifik)
- [ ] Ada Daftar Isi dengan anchor links
- [ ] Setiap konsep punya "kepribadian"/angle menarik
- [ ] Setiap rumus ada penjelasan per simbol
- [ ] Ada minimal 2 Miskonsepsi boxes (🚨)
- [ ] Ada minimal 2 Tips/Intuisi boxes (💡)
- [ ] Ada Peta Keputusan (3-5 skenario + chart)
- [ ] Ada Mini-Case dengan angka konkret + pembahasan
- [ ] Ada Rangkuman (1 baris per konsep)

### Interaktivitas
- [ ] Minimal 1 Live Python Lab (editable + runnable via Pyodide)
- [ ] Minimal 4 Quiz dengan feedback spesifik + score tracking
- [ ] Setiap chart ada "Cara membaca" + "Interpretasi"
- [ ] Ada Kalkulator/simulator jika relevan
- [ ] Ada Progress bar (sticky)

### Teknis
- [ ] Semua KaTeX render benar (pakai String.raw, tidak ada `frac` tanpa backslash)
- [ ] Semua code Python compile tanpa error (test via Pyodide)
- [ ] Plotly load dari CDN (bundle < 25MB)
- [ ] Tidak ada F1-F6 flags terdeteksi
- [ ] Durasi baca 45-60 menit (estimasi 200 kata/menit + waktu lab)
- [ ] Mobile: tidak ada horizontal overflow
- [ ] Dark theme: semua teks terbaca (quiz options pakai `color: var(--text)`)
- [ ] Quiz feedback muncul dengan warna benar (class `show correct`/`show wrong`)

## WORKFLOW STEPS

1. **Gap Analysis**: Cek topik sebelum/sesudah, pastikan tidak ada lompatan konsep
2. **Research**: Cari job relevance + contoh dunia nyata + cerita menarik untuk hook
3. **Outline**: Struktur 13 komponen wajib di atas (Cover → TOC → Tujuan → Cerita → ...)
4. **Story**: Tulis Cerita Pembuka DULU (jika tidak ada cerita bagus, cari lagi)
5. **Draft**: Tulis konten mengikuti struktur, dengan "kepribadian" per konsep
6. **Myths**: Identifikasi 2+ miskonsepsi umum untuk topik ini
7. **Labs**: Buat 1-2 Live Python lab dengan instruksi eksplorasi
8. **Decision Map**: Buat 3-5 skenario keputusan dengan chart
9. **Case**: Tulis mini-case dengan angka konkret
10. **Quiz**: Buat 4-6 soal dengan feedback "why" yang spesifik
11. **QA Scan**: Jalankan F1-F6 checks
12. **Fix**: Perbaiki yang gagal QA (maksimal 2 iterasi, jika masih gagal → tulis ulang)
13. **Browser Test**: Verifikasi KaTeX, quiz, chart, lab di mobile + desktop + dark theme
14. **Final**: Verifikasi checklist di atas

## FORMAT CODES
- R = Bacaan + diagram
- G = Guided code
- S = Simulasi interaktif
- Q = Quiz
- L = Lab dengan dataset (Live Python via Pyodide)
- C = Case study
- P = Mini project
- F = Flashcard
- V = Vignette (gaya CFA)
- K = Kalkulator/drill
- M = Miskonsepsi box
- D = Decision map (Peta Keputusan)
- T = Story hook (Cerita pembuka)

Aturan: tiap lesson minimal R + T + M + D + C + L + Q. Tiap track ditutup dengan P.
