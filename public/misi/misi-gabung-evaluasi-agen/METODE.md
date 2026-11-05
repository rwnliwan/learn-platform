# METODE — eval_cases.csv

## Pernyataan SINTETIS

**Seluruh isi `eval_cases.csv` adalah DATA SINTETIS** — 240 kasus evaluasi fiksi
yang dibangkitkan oleh generator acak (seed 42). BUKAN hasil evaluasi agen
nyata, BUKAN data produksi siapa pun, TANPA jawaban agen asli, TANPA
kredensial. Dataset ini dibuat khusus sebagai bahan latihan misi
"misi-gabung-evaluasi-agen" (LLMOps × AI Engineering) agar pelajar bisa
mempraktikkan audit evaluasi tanpa menyentuh data sensitif.

## Generator

- Skrip: `/tmp/cap5-evaluasi-gen.py` (scratch; tidak dibundel)
- Seed: **42** (subset label manusia: seed 42+3, dipilih agar tingkat
  kelulusan manusia ≈ 57% sesuai narasi spot-check)
- 240 baris: 140 `mudah` + 70 `sedang` + 30 `sulit`
- `task_type`: acak seragam dari {qa, penalaran, kode}
- Label benar laten: peluang lulus per kesulitan {mudah: 0.78, sedang: 0.50,
  sulit: 0.28}
- `judge_score`: N(80, 8) bila label laten lulus, N(68, 8) bila gagal;
  dipotong ke [0, 100], 1 desimal
- `judge_verdict`: `lulus` bila `judge_score >= 60`, selain itu `gagal`
- `human_label`: hanya untuk 60 baris (25 mudah + 20 sedang + 15 sulit,
  sampel acak); = label laten dengan noise balik 3%; baris lain dikosongkan
- `judge_prompt_id`: selalu `v1-bocor` (satu-satunya versi prompt di misi ini)

## Prompt judge v1 (bocor — disengaja untuk misi)

> "Anda adalah evaluator kualitas jawaban agen. **Jawaban benar:
> {answer_key}.** Nilai jawaban agen pada skala 0-100 berdasarkan
> kecocokan dengan jawaban benar di atas. Beri skor 90-100 bila jawaban
> pada intinya sama dengan kunci; 60-89 bila sebagian benar; di bawah 60
> bila bertentangan dengan kunci. Jawab hanya dengan angka."

Kunci jawaban disuntikkan langsung ke template prompt — ini adalah
sabotase I1 di misi audit. Prompt yang benar TIDAK boleh memuat kunci
jawaban; kunci dipakai terpisah di skrip skoring.

## Agregat acuan (dihitung dari CSV, seed 42)

- Tingkat kelulusan judge (240 kasus): 224/240 = **93,3%**
- Tingkat kelulusan manusia (60 kasus berlabel): 34/60 = **56,7%**
- Cohen's kappa judge vs manusia: **0,129** (kesepakatan ringan;
  p_o = 0,617, p_e = 0,560)
- Per kesulitan — judge: mudah 96,4% / sedang 90,0% / sulit 86,7%
- Per kesulitan — manusia: mudah 80,0% / sedang 50,0% / sulit 26,7%
- Rata-rata skor judge: mudah 77,7 / sedang 73,0 / sulit 71,9

## Batas jujur

- Distribusi kesulitan, ambang lulus (60), dan parameter skor dipilih agar
  menyerupai pola "judge menyanjung" — BUKAN kalibrasi terhadap sistem nyata.
- Kappa dihitung pada 60 kasus berlabel; interval kepercayaannya lebar.
- Jangan memakai angka-angka ini sebagai benchmark sistem evaluasi nyata.
