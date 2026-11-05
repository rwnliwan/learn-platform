# LAPORAN G1 — 4 Lesson Track Health Data Science (2026-10-15)

Pembangunan: subagent G1. Status: 4 file lesson selesai ditulis, didaftarkan di `reg-hd.ts`, dan terverifikasi (harness Pyodide + tsc + grep QA).
Laporan ini = klaim; parent diminta verifikasi mandiri. Bukti grep/hitungan disertakan di bawah.

## File yang dihasilkan

| # | Slug | File | Registry key |
|---|------|------|--------------|
| 1 | `hd21-farmakovigilans` | `src/app/v2/content/hd21-farmakovigilans.ts` | `"hd21-farmakovigilans"` |
| 2 | `hd24-mendelian-randomization` | `src/app/v2/content/hd24-mendelian-randomization.ts` | `"hd24-mendelian-randomization"` |
| 3 | `hd25-kesetaraan-kesehatan` | `src/app/v2/content/hd25-kesetaraan-kesehatan.ts` | `"hd25-kesetaraan-kesehatan"` |
| 4 | `hd26-rwe-regulator` | `src/app/v2/content/hd26-rwe-regulator.ts` | `"hd26-rwe-regulator"` |

Registrasi: hanya `src/app/v2/lib/reg-hd.ts` (4 import + 4 key). `registry.ts`, `Workspace.tsx`, file lain: TIDAK disentuh.

## Per-lesson

### 1. hd21-farmakovigilans — "Pharmacovigilance & Signal Detection: Menangkap Sinyal Bahaya Obat Sebelum Terlambat"
- Langkah: 10 (cerita → peta/tujuan → 3 konsep → lab → chart → peta keputusan → mini-case → checkpoint)
- Estimasi: kata≈4220/180 + lab×8 + kuis 5×2 + chart×2,5 + case×6 + rumus 3×1 = **52,9 mnt** → `estMinutes: 60`
- Lab: 4 fungsi (`prr`, `ror`, `chi2`, `is_signal` Evans) di 3 pasangan obat–efek sintetis. Harness Pyodide: **6/6 PASS**
- `summary:` = 1 ✓ | tsc = 0 error ✓ | F1 = 0 ✓ | miskonsepsi 3, tips 4, kuis 5 (4 opsi, 1 benar, why per opsi) ✓
- Sumber Indonesia: berita WHO–BPOM 20 Mar 2024 (workshop 162 evaluator + 170 petugas RMP, kurikulum farmakovigilans 2024), Permen BPOM 15/2022 (pelaporan spontan, KTD serius ≤15 hari kalender, Pusat Farmakovigilans/MESO Nasional), pedoman MESO BPOM.

### 2. hd24-mendelian-randomization — "Mendelian Randomization: Kausalitas dari Lotre Genetik"
- Langkah: 10 (struktur sama)
- Estimasi: kata≈3977/180 + 8 + 5×2 + 2,5 + 6 + 3×1 = **51,6 mnt** → `estMinutes: 60`
- Lab: Wald ratios + IVW + intercept MR-Egger (OLS) + leave-one-out di 5 SNP sintetis (1 pleiotropik). Harness Pyodide: **5/5 PASS**
- `summary:` = 1 ✓ | tsc = 0 error ✓ | F1 = 0 ✓ | miskonsepsi 3, tips 5, kuis 5 ✓
- Prasyarat hd10 (kausalitas observasional) + bi12 (GWAS) diringkas 2–3 kalimat di langkah peta (F2, self-contained).

### 3. hd25-kesetaraan-kesehatan — "Health Equity & SDOH: Mengukur Ketimpangan yang Tak Terlihat"
- Langkah: 10
- Estimasi: kata≈3444/180 + 8 + 5×2 + 2,5 + 6 + 2×1 = **47,6 mnt** → `estMinutes: 60`
- Lab: concentration index via kovarians + RR + RD dari data kuintil sintetis. Harness Pyodide: **6/6 PASS**
- `summary:` = 1 ✓ | tsc = 0 error ✓ | F1 = 0 ✓ | miskonsepsi 3, tips 5, kuis 5 ✓
- Sudut beda dari hd13 (fairness AI): ini PENGUKURAN ketimpangan populasi, dinyatakan eksplisit di lesson.
- Angka Indonesia NYATA dari Cheng dkk. 2022 (dibuka penuh): OOP 32,1% (2019), SHI 23,1%, progresif 2015–2018 → sedikit regresif 2019, JKN ~84% (akhir 2019).

### 4. hd26-rwe-regulator — "Real-World Evidence untuk Regulator: Ketika Data Klaim Jadi Bukti"
- Langkah: 10
- Estimasi: kata≈3681/180 + 8 + 5×2 + 2,5 + 6 + 1×1 = **48,0 mnt** → `estMinutes: 60`
- Lab: RR kasar vs Mantel-Haenszel + skor kelengkapan fitness-for-use di data klaim sintetis. Harness Pyodide: **5/5 PASS**
- `summary:` = 1 ✓ | tsc = 0 error ✓ | F1 = 0 ✓ | miskonsepsi 3, tips 5, kuis 5 ✓
- Prasyarat hd1/hd5/hd10 diringkas di langkah peta (F2). Konteks Indonesia: SATUSEHAT FHIR, "No EMR, No Claim", NIK identitas tunggal.

## Metode verifikasi (bukti)

1. **Harness Pyodide headless** (`/tmp/harness/driver.py` + `run_lab.js`, package pyodide di `/tmp/pyodide-test/node_modules`):
   solusi tiap lab diekstrak dari file `.ts` via regex, dijalankan di Pyodide asli (bukan CPython), checks dievaluasi
   (`equal`+tol, `stdout_matches`, `contains`). Hasil: **22/22 PASS** (6+5+6+5).
   Untuk hd21 (checks berupa fungsi), harness memanggil fungsi dengan data pasangan A — tercatat di driver.
   Starter: `compile()` OK untuk hd21/hd24; hd25/hd26 starter mengandung assignment kosong by design (pola hd20 — diisi learner).
2. **tsc**: `npx tsc --noEmit` → 0 error di `hd21`, `hd24`, `hd25`, `hd26`, `reg-hd.ts`.
   Pre-existing errors di file lain (bukan saya): `bcd17-concentrated-liquidity.ts`, `bi21-cancer-genomics.ts`, `llmops14-smart-routing.ts` — total 270 error repo, tidak bertambah oleh saya.
   (Satu bug saya temukan & perbaiki: backtick nyasar di template literal hd21 baris 176/201.)
3. **grep `summary:`** = 1 per file (4 file) ✓ — hanya di langkah checkpoint.
4. **F1 scan**: 0 hit untuk 5 frasa filler di 4 file ✓. Prosa RAW: 0 entitas `&lt;/&gt;/&amp;` ✓. KaTeX: `String.raw` + backslash tunggal, 0 double-backslash ✓.
5. **Angka lab** dihitung manual dengan Python independen SEBELUM menulis `expected` (contoh: chi2 pasangan A = 633,0 — draf awal saya 1409,6, dikoreksi).

## Sumber yang benar-benar dibuka (URL)

1. https://www.who.int/indonesia/news/detail/20-03-2024-who--indonesian-fda-increase-access-to-safe-and-effective-medicines — WHO–BPOM Mar 2024 (farmakovigilans + GDP; workshop 162 evaluator, 170 petugas RMP; rencana kurikulum 2024)
2. https://pmc.ncbi.nlm.nih.gov/articles/PMC8873956/ — Cheng dkk. 2022, ekuitas pembiayaan kesehatan Indonesia 2015–2019 (dibaca: Summary, Findings, Table 1)
3. https://github.com/zja2004/bgi-cli/blob/HEAD/data/skills/mendelian-randomization-twosamplemr/references/method-reference.md — referensi metode MR (3 asumsi, IVW, MR-Egger, weighted median, kerangka bukti)
4. Snippet hasil pencarian (dibaca penuh, tidak dibuka halamannya): Permen BPOM 15/2022 (peraturan.go.id, meridianhukum.com, kimiafarma.co.id) — pelaporan spontan, KTD serius ≤15 hari; pedoman MESO BPOM (kmei.pom.go.id); pernyataan pejabat BPOM "minim data efek obat / tidak ada angka pasti" (bloombergtechnoz.com); PRR/ROR/Evans (github belalzaky/faers-signal, peckdj, mikail-saaev); FDA RWE Framework 2018 / 21st Century Cures Act 2016 (pharmtech.com, frontiersin.org); EMA Regulatory Science to 2025; SATUSEHAT 42.337 fasyankes per 31 Jul 2026 (industriindonesia.id); SEB "No EMR, No Claim" + NIK + FHIR (legawa.com); Kakwani/concentration index (worldbank.org, wikipedia).

## Klaim yang DITURUNKAN versinya (sumber tidak bisa/tidak dibuka penuh)

- **Tingkat underreporting RS Indonesia**: TIDAK ADA angka pasti nasional — pejabat BPOM sendiri menyatakan "tidak ada angka pasti" (bloombergtechnoz.com). Lesson TIDAK mengutip angka underreporting Indonesia; hanya menyatakan sistem pelaporan spontan global menangkap sebagian kecil kasus + fakta minimnya data nasional. Mini-case memakai asumsi ilustratif berlabel SINTETIS.
- **Semua data lab & chart**: SINTETIS, diberi label eksplisit di lesson ("data sintetis untuk latihan — bukan data BPOM/FAERS asli"). Tidak ada angka farmakovigilans/MR/ketimpangan yang diklaim sebagai data nyata Indonesia kecuali yang dari Cheng dkk. 2022.
- **Kasus CRP (hd24)**: pola hasil sesuai literatur (kualitatif), angka lab sintetis — dinyatakan di lesson.
- **Dokumen ICH**: tidak ada dokumen ICH yang terbuka penuh; konsep Risk Management Plan dikutip dari berita WHO–BPOM (workshop RMP Okt 2023), bukan dari dokumen ICH langsung.
- **Angka SATUSEHAT 42.337 fasyankes**: dari industriindonesia.id (media), bukan satusehat.kemkes.go.id langsung — dikutip sebagai konteks, bukan angka kunci perhitungan.

## Catatan untuk parent

- Semua lesson 10 langkah, 5 kuis, 1 lab, 1 chart SVG (var(--chart-*) agar ikut tema), peta keputusan 5 skenario + aturan 10 detik, mini-case angka konkret, summary 5 butir di checkpoint.
- `next:` sengaja tidak dipasang (hd22/hd23 belum ada — link ke lesson tak ada lebih buruk daripada tidak ada link).
- Pattern edit-tool bermasalah untuk payload >~8KB ("invalid arguments JSON") — lesson ditulis via write + edit kecil; tidak memengaruhi isi.
