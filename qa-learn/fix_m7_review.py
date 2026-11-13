#!/usr/bin/env python3
"""Ronde FIX review DeepSeek M7 (2026-11-13).

Menerapkan 25 temuan terverifikasi dari REVIEW-DEEPSEEK-M7.md ke
src/app/v2/content/mlf-m7*.ts + mirror content/mlf-m7*.md.
Jalankan: python3 qa-learn/fix_m7_review.py [--dry-run]
Setiap penggantian menegaskan jumlah kemunculan yang diharapkan;
bila tidak cocok, skrip BERHENTI tanpa menulis apa pun.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS = ROOT / "src/app/v2/content"
MD = ROOT / "content"

DRY_RUN = "--dry-run" in sys.argv

# (file_rel, old, new, expected_count) — old/new string literal;
# bila old diawali "re:" diperlakukan sebagai regex.
R = []

def add(f, old, new, n=1):
    R.append((f, old, new, n))

# ---------------------------------------------------------------- M7.1 TS
f71 = "src/app/v2/content/mlf-m71-fairness-metrics.ts"
add(f71,
    "Bayangkan dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — skor modelnya pun sama. Yang satu disetujui pinjamannya, yang satu ditolak. Satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Modelmu tidak pernah «melihat» kolom itu secara langsung — SEX bukan fitur yang dipakai untuk memprediksi. Tapi modelmu tetap memperlakukan kedua grup itu berbeda — lewat fitur-fitur lain yang berkorelasi dengan grup: limit, pola bayar, tagihan. Inilah pertanyaan lesson ini: bila modelmu tidak pernah memakai atribut sensitif, mungkinkah ia tetap tidak adil? Jawabannya, di data ini: ya — dan kamu bisa mengukurnya.",
    "Bayangkan dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Yang satu disetujui pinjamannya, yang satu ditolak. Modelmu MEMAKAI kolom itu sebagai fitur [notebook]: koefisien LR SEX −0,0626, SHAP GBM 0,0314 — bobotnya kecil, tapi bukan nol. Dan itu bukan satu-satunya jalur: modelmu juga membedakan kedua grup lewat fitur-fitur lain yang berkorelasi dengan grup — limit, pola bayar, tagihan. Inilah pertanyaan lesson ini: bila ketidakadilan bisa masuk lewat kolom sensitif itu sendiri MAUPUN lewat proxy-nya, bagaimana kamu mengukurnya? Jawabannya, di data ini: kamu bisa — dan angka-angkanya ada di langkah berikut.")
add(f71,
    "Yang benar: model di lesson ini tidak memakai SEX, EDUCATION, atau AGE sebagai fitur prediksi — dan tetap menghasilkan approval rate laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357 [notebook]. Atribut sensitif «bocor» lewat fitur lain yang berkorelasi dengannya (limit, pola bayar, tagihan). Menghapus kolom sensitif dari fitur TIDAK menghapus ketidakadilan — ia hanya menyembunyikannya dari daftar fitur. Buktinya ada di angka per grup, bukan di daftar fitur.",
    "Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval rate laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357 [notebook]. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.")
add(f71,
    "Impossibility hanya berlaku bila model memakai SEX sebagai fitur — model ini tidak memakainya, jadi tidak berlaku",
    "Impossibility hanya berlaku bila model memakai SEX sebagai fitur — model ini hanya memakai proxy, jadi tidak berlaku")
add(f71,
    "Salah: teorema berlaku untuk outcome model apa pun yang diukur per grup — tidak peduli fitur apa yang dipakai model. Model ini tidak memakai SEX sebagai fitur dan tetap menunjukkan keempat gap itu.",
    "Salah: teorema berlaku untuk outcome model apa pun yang diukur per grup — tidak peduli fitur apa yang dipakai model. Dan premisnya keliru: model ini MEMAKAI SEX secara langsung (koefisien LR −0,0626, SHAP 0,0314), bukan hanya lewat proxy — dan tetap menunjukkan keempat gap itu.")
add(f71,
    "FPR keseluruhan 0,6585 — dua dari tiga nasabah LANCAR ditolak pada threshold 0,10",
    "FPR keseluruhan 0,6585 — sekitar dua pertiga (65,85%) nasabah LANCAR ditolak pada threshold 0,10")
add(f71, "re:0,869(?![0-9])", "0,8693", 10)
add(f71,
    "tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. EDUCATION:",
    "tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. Catatan presisi: nilai 0,8694 pada deret threshold (langkah 10) dihitung dari rate tak dibulatkan — selisih 0,0001 dari 0,8693 murni pembulatan. EDUCATION:")

# ---------------------------------------------------------------- M7.1 .md
m71 = "content/mlf-m71-fairness-metrics.md"
add(m71,
    "Dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — skor modelnya pun sama. Yang satu disetujui pinjamannya, yang satu ditolak. Satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Model tidak pernah «melihat» kolom itu secara langsung — SEX bukan fitur yang dipakai untuk memprediksi. Tapi model tetap memperlakukan kedua grup itu berbeda — lewat fitur-fitur lain yang berkorelasi dengan grup: limit, pola bayar, tagihan. Bila model tidak pernah memakai atribut sensitif, mungkinkah ia tetap tidak adil? Jawabannya, di data ini: ya — dan kamu bisa mengukurnya.",
    "Dua nasabah. Keduanya 35 tahun, limit sama, riwayat bayar sama persis — satu-satunya yang membedakan mereka: kolom jenis kelamin di data. Yang satu disetujui pinjamannya, yang satu ditolak. Model MEMAKAI kolom itu sebagai fitur [notebook]: koefisien LR SEX −0,0626, SHAP GBM 0,0314 — bobotnya kecil, tapi bukan nol. Dan itu bukan satu-satunya jalur: model juga membedakan kedua grup lewat fitur-fitur lain yang berkorelasi dengan grup — limit, pola bayar, tagihan. Bila ketidakadilan bisa masuk lewat kolom sensitif itu sendiri MAUPUN lewat proxy-nya, bagaimana kamu mengukurnya? Jawabannya, di data ini: ya — dan kamu bisa mengukurnya.")
add(m71,
    "FPR keseluruhan 0,6585 — dua dari tiga nasabah LANCAR ditolak pada threshold 0,10",
    "FPR keseluruhan 0,6585 — sekitar dua pertiga (65,85%) nasabah LANCAR ditolak pada threshold 0,10")
add(m71, "re:0,869(?![0-9])", "0,8693", 4)
add(m71,
    "tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. EDUCATION:",
    "tapi bukan 1,0: laki-laki disetujui 13,1% lebih jarang secara relatif. Catatan presisi: nilai 0,8694 pada deret threshold (langkah 10) dihitung dari rate tak dibulatkan — selisih 0,0001 dari 0,8693 murni pembulatan. EDUCATION:")

# ---------------------------------------------------------------- M7.2 TS
f72 = "src/app/v2/content/mlf-m72-bias-audit-sources.ts"
add(f72,
    "Miskonsepsi: model tidak memakai SEX sebagai fitur, jadi pasti adil",
    "Miskonsepsi: menghapus kolom SEX membuat model adil")
add(f72,
    "Yang benar: model di lesson ini tidak memakai SEX, EDUCATION, atau AGE sebagai fitur prediksi — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif «bocor» lewat fitur lain yang berkorelasi dengannya (limit, pola bayar, tagihan). Menghapus kolom sensitif dari fitur TIDAK menghapus ketidakadilan — ia hanya menyembunyikannya dari daftar fitur. Buktinya ada di angka per grup, bukan di daftar fitur.",
    "Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.")
add(f72,
    "Model tidak memakai SEX, EDUCATION, atau AGE sebagai fitur — tapi tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1%. Penjelasan yang benar?",
    "Model memakai SEX, EDUCATION, dan AGE sebagai fitur (koefisien LR kecil: SEX −0,0626) — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1%. Penjelasan yang benar?")
add(f72,
    "Atribut sensitif bocor lewat fitur lain yang berkorelasi dengannya (limit, pola bayar, tagihan) — menghapus kolom sensitif tidak menghapus ketidakadilan",
    "Ketimpangan berasal dari campuran: kontribusi langsung fitur demografis (bobot kecil) + perbedaan risiko terukur antar grup + proxy lewat fitur lain (limit, pola bayar, tagihan)")
add(f72,
    "Benar: perempuan rata-rata punya limit lebih besar, bayar lebih tepat waktu, utilisasi lebih rendah — fitur-fitur itu membawa informasi yang berkorelasi dengan SEX. Model belajar dari fitur itu, bukan dari kolom SEX-nya.",
    "Benar: model MEMAKAI SEX/EDUCATION/MARRIAGE/AGE sebagai fitur (koefisien LR SEX −0,0626; SHAP SEX 0,0314) — jadi sebagian gap adalah efek langsung kolom itu; sebagian lagi dari perbedaan distribusi fitur antar grup (langkah 3) dan proxy (limit, pola bayar, tagihan). Menghapus kolom sensitif menurunkan AIR (0,8694 → 0,9211, M7.4) tapi tidak menuntaskannya.")
add(f72,
    "Model pasti memakai SEX secara diam-diam — ada yang salah dengan pipeline-nya",
    "Model memakai SEX secara diam-diam — ada yang salah dengan pipeline-nya")
add(f72,
    "Salah: pipeline flagship tidak menyertakan SEX/EDUCATION/AGE sebagai fitur (31 fitur dari kolom transaksi dan perilaku). Ketimpangan muncul lewat PROXY, bukan lewat kolom sensitif itu sendiri.",
    "Salah arah: model MEMANG memakai SEX sebagai fitur — secara terbuka, bukan diam-diam, dan bukan bug pipeline: koefisien LR-nya −0,0626 dan SHAP GBM-nya 0,0314 [notebook]. Yang keliru adalah mengira model tidak memakainya; ketimpangan muncul lewat kolom sensitif itu sendiri DAN lewat proxy.")
add(f72,
    "termasuk 843 nasabah yang default (bad rate 15,96%). Keadilan yang dibeli",
    "termasuk 843 nasabah yang default (bad rate 15,96%, M6.4). Keadilan yang dibeli")

# ---------------------------------------------------------------- M7.2 .md
m72 = "content/mlf-m72-bias-audit-sources.md"
add(m72,
    "**Miskonsepsi: model tidak memakai SEX sebagai fitur, jadi pasti adil.** Yang benar: model di lesson ini tidak memakai SEX, EDUCATION, atau AGE sebagai fitur prediksi — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif «bocor» lewat fitur lain yang berkorelasi dengannya (limit, pola bayar, tagihan). Menghapus kolom sensitif dari fitur TIDAK menghapus ketidakadilan.",
    "**Miskonsepsi: menghapus kolom SEX membuat model adil.** Yang benar: model di lesson ini MEMAKAI SEX, EDUCATION, MARRIAGE, dan AGE sebagai fitur prediksi — koefisien LR: SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547; SHAP GBM SEX 0,0314 [notebook] — dan tetap menghasilkan approval laki-laki 26,1% vs perempuan 30,1% [notebook], serta AIR EDUCATION 0,357. Atribut sensitif memengaruhi keputusan lewat DUA jalur: langsung (kolomnya sendiri, bobot kecil) dan lewat proxy (limit, pola bayar, tagihan yang berkorelasi dengannya). Menghapus kolom sensitif dari fitur MENURUNKAN disparitas — AIR SEX 0,8694 → 0,9211 (M7.4) — tetapi TIDAK menuntaskannya: probe GBM masih memprediksi SEX dari fitur tersisa dengan ROC-AUC 0,6261, dan AIR tetap di bawah 1,0. Buktinya ada di angka per grup, bukan di daftar fitur.")

# ---------------------------------------------------------------- M7.3 TS
f73 = "src/app/v2/content/mlf-m73-explainability-shap-lime.ts"
add(f73,
    "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 — tiga bulan terakhir bahkan tidak membayar sama sekali (PAY_AMT 0 di semua enam bulan), tagihan NT$2.400 setiap bulan.",
    "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 (terbaru→terlama) — tiga bulan terbaru 3, 2, 2, tiga bulan tertua 7, 7, 7 — dengan PAY_AMT 0 di semua enam bulan, tagihan NT$2.400 setiap bulan.")
add(f73,
    "Ketiga, memberi input mitigasi M7.4: bila pendorongnya adalah fitur yang bias pengukurannya (M7.2), mitigasinya menyentuh fitur itu — bukan threshold-nya.",
    "Ketiga, memberi input mitigasi M7.4: bila pendorongnya adalah fitur yang bias pengukurannya (M7.2), mitigasi akar-masalah menyentuh fitur itu — threshold hanya menutupi gejala. Catatan: M7.4 memperlihatkan penyesuaian threshold per grup memang menurunkan AIR (0,8694→0,9999) dengan biaya nyaris netral, tetapi itu bukan perbaikan akar-masalah.")
add(f73,
    "Kedua efek mengecil sedikit saat fitur pasangannya sudah tinggi — kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif.",
    "Kedua efek mengecil sekitar sepertiga (0,0714→0,0487) saat fitur pasangannya sudah tinggi — pada skala absolut kecil; kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif, interaksi lemah, bukan nol.")
add(f73,
    "buat 2.000 versi tetangga nasabah 858 dengan mengacak-acak fiturnya",
    "buat 2.000 versi tetangga [notebook] nasabah 858 dengan mengacak-acak fiturnya")
add(f73,
    "Satu konsistensi lintas lesson yang patut dicatat: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda.",
    "Satu konsistensi lintas lesson yang patut dicatat: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda. Catatan arah: 0,8693 = laki-laki/perempuan (AIR M7.1), 1,1502 = perempuan/laki-laki (kebalikannya, arah M2.2) — selalu nyatakan arah AIR-mu.")
add(f73, "re:0,869(?![0-9])", "0,8693", 3)

# ---------------------------------------------------------------- M7.3 .md
m73 = "content/mlf-m73-explainability-shap-lime.md"
add(m73,
    "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 — tiga bulan terakhir bahkan tidak membayar sama sekali (PAY_AMT 0 di semua enam bulan), tagihan NT$2.400 setiap bulan.",
    "status bayar enam bulan terakhir 3, 2, 2, 7, 7, 7 (terbaru→terlama) — tiga bulan terbaru 3, 2, 2, tiga bulan tertua 7, 7, 7 — dengan PAY_AMT 0 di semua enam bulan, tagihan NT$2.400 setiap bulan.")
add(m73,
    "Kedua efek mengecil sedikit saat fitur pasangannya sudah tinggi — kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif.",
    "Kedua efek mengecil sekitar sepertiga (0,0714→0,0487) saat fitur pasangannya sudah tinggi — pada skala absolut kecil; kurvanya hampir sejajar, TIDAK ada interaksi kuat: efek keduanya menumpuk secara hampir aditif, interaksi lemah, bukan nol.")
add(m73,
    "buat 2.000 versi tetangga nasabah 858, minta GBM memprediksi semuanya",
    "buat 2.000 versi tetangga [notebook] nasabah 858, minta GBM memprediksi semuanya")
add(m73,
    "Satu konsistensi lintas lesson: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda.",
    "Satu konsistensi lintas lesson: di M2 (scorecard), AIR perempuan/laki-laki 1,1502 — arah yang SAMA dengan model ini (perempuan lebih sering disetujui), dengan model dan definisi grup yang berbeda. Catatan arah: 0,8693 = laki-laki/perempuan (AIR M7.1), 1,1502 = perempuan/laki-laki (kebalikannya, arah M2.2) — selalu nyatakan arah AIR-mu.")
add(m73, "re:0,869(?![0-9])", "0,8693", 2)

# ---------------------------------------------------------------- M7.4 TS
f74 = "src/app/v2/content/mlf-m74-fairness-mitigation.ts"
add(f74,
    "bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya NT$32.895.000 (interpolasi)",
    "bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya ≈ NT$32.899.000 (interpolasi)")
add(f74, "air_female_over_male=1.1502", "air_female_over_male=1.1503", 2)
add(f74,
    "(1/0,8693 = 1,1502)",
    "(1/0,8693 ≈ 1,1503 dari rate yang ditampilkan; hitungan penuh 1,1502)", 2)
add(f74,
    "AIR (perempuan/laki-laki) = kebalikannya: 0,3007 / 0,2614 = 1,1502 — arah M2.2. Keduanya satu kesenjangan yang sama.",
    "AIR (perempuan/laki-laki) = kebalikannya: 0,3007 / 0,2614 = 1,1503 (hitungan penuh 1,1502 — selisih 0,0001 murni pembulatan) — arah M2.2. Keduanya satu kesenjangan yang sama.")
add(f74,
    'name: "air_female_over_male", value: 1.1502, tol: 0.0005, label: "`air_female_over_male` seharusnya 1.1502", msg: "AIR arah M2.2 (perempuan/laki-laki): dari hitungan penuh 1,1502 — dari approval yang dibulatkan (0,3007 / 0,2614) hasilnya 1,1503, selisih 0,0001 murni pembulatan."',
    'name: "air_female_over_male", value: 1.1503, tol: 0.0005, label: "`air_female_over_male` seharusnya 1.1503", msg: "AIR arah M2.2 (perempuan/laki-laki): solusi membagi approval yang ditampilkan (0,3007 / 0,2614) = 1,1503; hitungan penuh dari rate tak dibulatkan = 1,1502 (kanonik m74) — selisih 0,0001 murni pembulatan."')
add(f74,
    "angka yang SAMA dengan 0,869 dibalik (1/0,869 = 1,151)",
    "angka yang SAMA dengan 0,869 dibalik (1/0,8693 ≈ 1,150)")

# ---------------------------------------------------------------- M7.4 .md
m74 = "content/mlf-m74-fairness-mitigation.md"
add(m74,
    "bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya NT$32.895.000 (interpolasi)",
    "bila komite menargetkan AIR 0,95, λ = 0,62 (interpolasi) adalah titiknya, dengan biaya ≈ NT$32.899.000 (interpolasi)")
add(m74, "air_female_over_male=1.1502", "air_female_over_male=1.1503", 1)
add(m74,
    "(1/0,8693 = 1,1502)",
    "(1/0,8693 ≈ 1,1503 dari rate yang ditampilkan; hitungan penuh 1,1502)", 1)
add(m74,
    "angka yang SAMA dengan 0,869 dibalik (1/0,869 = 1,151)",
    "angka yang SAMA dengan 0,869 dibalik (1/0,8693 ≈ 1,150)")

# ---------------------------------------------------------------- M7.5 TS
f75 = "src/app/v2/content/mlf-m75-monitoring-drift.ts"
add(f75,
    "Di test, ROC-AUC-nya 0,7823 dan PR-AUC 0,5597 [notebook] — lumayan.",
    "Di test, ROC-AUC GBM mentah 0,7823 dan PR-AUC 0,5597 [notebook] — setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 — lumayan.")
add(f75,
    "Baik atau buruk: ROC-AUC 0,7823 di test itu bagus sebagai foto SATU titik waktu. Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»:",
    "Baik atau buruk: ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai foto SATU titik waktu (model keputusan terkalibrasi: 0,7816). Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»:")
add(f75,
    "Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan menolak lebih banyak orang, dan kalibrasinya bergeser meski ranking-nya utuh.",
    "Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan under-predict peluang default (kalibrasi bergeser meski ranking-nya utuh) dan bad rate yang disetujui naik; arah approval bergantung pada pergeseran distribusi X, jadi jangan diasumsikan otomatis turun.")
add(f75,
    "karena n per chunk hanya 1.200 (sekitar 230–290 default per chunk).",
    "karena n per chunk hanya 1.200 (sekitar 230–295 default per chunk).")
add(f75,
    "Aturan level alert (satu periode) [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03); WASPADA (1) bila penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10; AMAN (0) bila tidak satu pun terpenuhi.",
    "Aturan level alert [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03) DALAM 2 PERIODE BERTURUT-TURUT; WASPADA (1) bila salah satu pemicu terpenuhi dalam 1 periode (penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10); AMAN (0) bila tidak satu pun terpenuhi.")
add(f75,
    "bad rate 0,1074, PSI skor 0,0161, terkonfirmasi 2 periode = TIDAK",
    "bad rate 0,1074, PSI skor antar-periode [waktu semu] 0,0161 (chunk 1 vs chunk 5 — pembanding stabil yang tersedia), terkonfirmasi 2 periode = TIDAK")
add(f75,
    "Hasil yang diharapkan [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=2; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Bacalah baris terakhir dengan saksama: kasus A menyalakan alert KRITIS (tiga pemicu sekaligus) TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode.",
    "Hasil yang diharapkan [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=1; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Bacalah baris terakhir dengan saksama: kasus A menyalakan alert WASPADA (tiga pemicu sekaligus) TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode.")
add(f75,
    "roc_drop_A = 0,7816 − 0,7428 = 0,0388; pr_drop_A = 0,5558 − 0,5137 = 0,0421 — keduanya melewati ambang, jadi alert_A = 2 (kritis).",
    "roc_drop_A = 0,7816 − 0,7428 = 0,0388; pr_drop_A = 0,5558 − 0,5137 = 0,0421 — keduanya melewati ambang, tapi baru 1 periode (chunk 3 membaik), jadi alert_A = 1 (waspada).")
add(f75,
    "alert_A=2\\nretrain_A=0",
    "alert_A=1\\nretrain_A=0", 1)
add(f75,
    'name: "alert_A", value: 2, tol: 0.5, label: "`alert_A` seharusnya 2 (kritis)", msg: "Chunk 2: ROC turun 0,0388 DAN PR turun 0,0421 — keduanya melewati ambang, jadi KRITIS (2). Bad rate 10,74% juga melewati 10%."',
    'name: "alert_A", value: 1, tol: 0.5, label: "`alert_A` seharusnya 1 (waspada)", msg: "Chunk 2: ROC turun 0,0388 DAN PR turun 0,0421 — keduanya melewati ambang, tapi baru 1 periode (chunk 3 membaik: ROC-AUC 0,8138), jadi WASPADA (1), bukan KRITIS. Bad rate 10,74% juga melewati 10%."')
add(f75,
    "alert chunk 2 = kritis (2) tapi retrain = 0",
    "alert chunk 2 = waspada (1) tapi retrain = 0", 2)
# alert_level() — template + solution (2 kemunculan identik)
add(f75,
    'if c["psi"] > 0.25 or (roc_drop > 0.02 and pr_drop > 0.03):\n        return 2',
    'if c["psi"] > 0.25 or ((roc_drop > 0.02 and pr_drop > 0.03) and c["confirmed_2p"]):\n        return 2', 2)
# Komentar kasus A — template + solution (2 kemunculan identik)
add(f75,
    "# Kasus A (chunk 2): ROC 0,7428; PR 0,5137; bad rate 0,1074; PSI skor 0,0161; 2 periode: TIDAK",
    "# Kasus A (chunk 2): ROC 0,7428; PR 0,5137; bad rate 0,1074; PSI skor antar-periode 0,0161 (chunk 1 vs chunk 5); 2 periode: TIDAK", 2)

# ---------------------------------------------------------------- M7.5 .md
m75 = "content/mlf-m75-monitoring-drift.md"
add(m75,
    "Model GBM sudah live tiga bulan. Di test, ROC-AUC-nya 0,7823 dan PR-AUC 0,5597 [notebook] — lumayan.",
    "Model GBM sudah live tiga bulan. Di test, ROC-AUC GBM mentah 0,7823 dan PR-AUC 0,5597 [notebook] — setelah kalibrasi Platt, model keputusan 0,7816 / 0,5558 — lumayan.")
add(m75,
    "**Baik/buruk:** ROC-AUC 0,7823 di test itu bagus sebagai foto SATU titik waktu. Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»:",
    "**Baik/buruk:** ROC-AUC GBM mentah 0,7823 di test itu bagus sebagai foto SATU titik waktu (model keputusan terkalibrasi: 0,7816). Buruk bila dibaca sebagai «model ini akan selamanya 0,7823»:")
add(m75,
    "Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan menolak lebih banyak orang, dan kalibrasinya bergeser meski ranking-nya utuh.",
    "Contoh: resesi menaikkan base rate default dari 0,2212 ke 0,30 — model yang sama akan under-predict peluang default (kalibrasi bergeser meski ranking-nya utuh) dan bad rate yang disetujui naik; arah approval bergantung pada pergeseran distribusi X, jadi jangan diasumsikan otomatis turun.")
add(m75,
    "Aturan level alert (satu periode) [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03); WASPADA (1) bila penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10; AMAN (0) bila tidak satu pun terpenuhi.",
    "Aturan level alert [keputusan kebijakan lesson ini]: KRITIS (2) bila PSI skor di atas 0,25 ATAU (penurunan ROC-AUC lebih dari 0,02 DAN penurunan PR-AUC lebih dari 0,03) DALAM 2 PERIODE BERTURUT-TURUT; WASPADA (1) bila salah satu pemicu terpenuhi dalam 1 periode (penurunan ROC-AUC lebih dari 0,02 ATAU penurunan PR-AUC lebih dari 0,03 ATAU bad rate di atas 0,10 ATAU PSI skor di atas 0,10); AMAN (0) bila tidak satu pun terpenuhi.")
add(m75,
    "bad rate 0,1074, PSI skor 0,0161, terkonfirmasi 2 periode = TIDAK",
    "bad rate 0,1074, PSI skor antar-periode [waktu semu] 0,0161 (chunk 1 vs chunk 5 — pembanding stabil yang tersedia), terkonfirmasi 2 periode = TIDAK")
add(m75,
    "Hasil [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=2; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Kasus A menyalakan alert KRITIS TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode.",
    "Hasil [lab]: roc_drop_A=0.0388; pr_drop_A=0.0421; alert_A=1; retrain_A=0; alert_B=0; retrain_B=0; psi_C=0.5811; pr_drop_C=0.0582; alert_C=2; retrain_C=1. Kasus A menyalakan alert WASPADA TAPI retrain-nya 0 — karena tidak terkonfirmasi 2 periode.")
add(m75,
    "alert chunk 2 = kritis (2) tapi retrain = 0",
    "alert chunk 2 = waspada (1) tapi retrain = 0", 1)


def apply():
    # Kelompokkan per file; baca sekali, terapkan semua, tulis sekali.
    by_file = {}
    for f, old, new, n in R:
        by_file.setdefault(f, []).append((old, new, n))
    for f, items in by_file.items():
        p = ROOT / f
        text = p.read_text(encoding="utf-8")
        for old, new, n in items:
            if old.startswith("re:"):
                pat = old[3:]
                found = len(re.findall(pat, text))
                assert found == n, f"{f}: regex {pat!r} ditemukan {found}x, harap {n}x"
                text = re.sub(pat, new, text)
            else:
                found = text.count(old)
                assert found == n, f"{f}: ditemukan {found}x (harap {n}x): {old[:90]!r}"
                text = text.replace(old, new)
        if not DRY_RUN:
            p.write_text(text, encoding="utf-8")
        print(f"{'DRY-RUN ' if DRY_RUN else ''}OK {f}: {len(items)} penggantian")
    print("SELESAI — semua penggantian cocok dengan hitungan yang diharapkan.")


if __name__ == "__main__":
    apply()
