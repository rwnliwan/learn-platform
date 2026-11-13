#!/usr/bin/env python3
"""Build Luna gap prompt for M8 (5 fixed lessons + m8 canonical + cross-ref appendix).
Structure mirrors gap_m7_luna_prompt.txt. Output: review-prompts/gap_m8_luna_prompt.txt.
"""
import json
from pathlib import Path

ROOT = Path("/home/hatch/workspace/learn-platform")

HEADER = """Kamu adalah analis GAP kurikulum (bukan reviewer koreksi). Tugasmu: membaca 5 lesson modul M8 "Model Risk & Deployment" (track Machine Learning Finance, Learn v2) dan menemukan CELAH MATERI — topik/konsep/koneksi/latihan yang HILANG atau TIPIS, yang dibutuhkan learner agar bisa memakai validasi model, tiering risiko, model card, deployment (shadow/canary/champion-challenger), dan governance/approval dalam praktik.

MATERI (sudah termasuk perbaikan review DeepSeek terbaru):
- 5 file TypeScript lesson (format: steps dengan prose, formulaNote, checkpoint, quiz, lab Pyodide, figure SVG).
- 1 file JSON angka kanonis M8 (semua angka kunci lesson) + appendix angka rujukan lintas modul M6/M7 (semua angka yang dikutip lesson dari modul lain ada di sini; bila lesson menyebut angka di luar kedua JSON ini, anggap [notebook]/[turunan]/[ilustrasi]).

ATURAN:
1. JANGAN melaporkan ulang temuan review DeepSeek yang SUDAH diperbaiki (daftar di bawah). Laporkan HANYA celah: sesuatu yang tidak diajarkan, diajarkan terlalu tipis untuk dipakai, atau koneksi yang tidak dibuat.
2. Setiap gap WAJIB punya bukti: kutip kalimat lesson yang relevan atau nyatakan "tidak ada penyebutan X di seluruh 5 lesson" (periksa kelima file sebelum mengklaim HILANG).
3. Kategorikan: must-add (tanpa ini learner salah pakai / tidak bisa lanjut ke M9), should-add (penting untuk praktik), nice-to-have (pengayaan).
4. Status tiap gap: HILANG (tidak ada sama sekali) atau TIPIS (disebut sekilas tanpa diajarkan).
5. Untuk tiap gap, beri saran isi konkret (apa yang ditambahkan, di lesson mana, bentuknya: langkah baru / lab / kuis / figure).
6. Jangan mengarang angka baru. Bila mengusulkan contoh hitung, pakai angka kanonis dari JSON di bawah atau tandai [ilustrasi].
7. Jawab dalam Bahasa Indonesia (istilah teknis English, seperti lesson).

TEMUAN DEEPSEEK YANG SUDAH DIPERBAIKI — JANGAN DILAPORKAN LAGI:
- M8.1: band ECE dibatasi overall + per half + gate n≥200 per grup (AGE 60+ ECE 0,1208 n=76 = TEMUAN-INVESTIGASI, bukan pemicu band); verdict KUNING (pemicu |Δbad rate| 1,06 pp + ECE grup dalam band); band |Δapproval| dilengkapi KUNING 1,0–3,0 pp / MERAH > 3,0 pp; kematangan label ditambahkan; "≈2× sd antar-fold" diganti pembanding galat selisih; "≈9 nasabah" → 8; label sumbu figure; definisi SR 11-7 "adverse consequences"; sitasi ECE overall [M6.4].
- M8.2: aturan matriks → jumlah level (C+M ≥3 Tier 1; =2 Tier 2; ≤1 Tier 3); M=3/B=3 dilabeli skala sampel [ilustrasi skala] + catatan skala buku (M=4/B=4, skor 3,40, tetap Tier 1); "shadow" dibedakan (shadow-mode tercatat vs model tak terdaftar); sitasi ECE 0,0087 [M6.4], PSI 0,25 / ECE 0,02 [kebijakan]; "nilai model dalam uang" dilunakkan (EL bruto counterfactual, bukan nilai bersih); total cost diberi definisi; hierarki matriks vs skor ("matriks saringan kasar, skor mengikat"); "31 fitur"/"cv=3" dilabeli [notebook]; band M setengah terbuka; "Rp" → NT$; basis margin 5% × 398.190.000.
- M8.3: 0,0710 didefinisikan eksplisit "rentang (maks−min) antar-chunk [m75_pseudo_time_roc_spread]; drop vs full-test 0,0388"; ECE 0,0087 [M6.4]; ambang alert 0,02 [kebijakan]; peran owner/validator dipisah (validator independen); gerbang rollback dinomori ulang; caption figure; toleransi 0,001 diasumsikan seed terkunci.
- M8.4: gate gagal 5 (G1, G2, G3, G4, G7), 2 belum diuji, 0 lolos; baseline monitoring PER MODEL (champion 0,7816/0,5558/28,5%/6,67%; challenger 0,7426/0,5049/20,25%/9,14%); 1.166 approval LR terkalibrasi [m8_lr_calibrated_thr010]; approve-all 82.155.456 = realised loss seluruh test; ramp n berbasis traffic 12.000 per periode; toleransi bad rate 1,33 vs 1,00 pp dijelaskan; AIR [M7.1]/[M7.4]; lubang gate canary PSI 0,10–0,25 ditutup (→ TAHAN); "≈14 kali" untuk 13,84×.
- M8.5: figure konektor snake 3→4→5→6; gerbang 6 = VERIFIKASI rollback criteria (ditulis gerbang 1); PSI 0,5811 dilabeli "simulasi drift S2"; semua ambang kebijakan dilabeli [kebijakan lesson ini]; kadensi monitoring dipisah (tanpa-label harian vs berlabel per periode setelah label matang); RACI sign-off diperbaiki (legal/risk = R atas kepatuhan); tugas validator lengkap (3 elemen SR 11-7) + pemetaan three lines of defense; pemetaan 5 tahap vs 6 gerbang.
- M6 (sweep batch): notasi "mean ± sd" di M6.2/M6.5 diganti "mean (sd antar-fold ...)" — SE mean 0,0030; distraktor kuis M6.2:627 dirombak.

FORMAT JAWABAN (markdown):
# Gap Luna M8
## Ringkasan
Tabel: | No. | Severity | Status | Isi |
## Per gap
### G1 — [severity], [HILANG/TIPIS]
- Bukti: (kutipan lesson atau "tidak ada penyebutan di ...")
- Kenapa penting:
- Saran isi: (lesson, bentuk, isi konkret)

Mulai dari M8.1 sampai M8.5, lalu kanonis.

"""

APPENDIX = """===== ANGKA RUJUKAN LINTAS MODUL (kanonik M6/M7 — semua angka yang dikutip lesson M8 dari modul lain) =====
- Nested CV GBM 0,7858 (sd antar-fold 0,0068; SE mean ≈ 0,0030; outer fold 0,7974; 0,7782; 0,7878; 0,7859; 0,7799); CV biasa GBM 0,7840 (sd 0,0059); LR nested 0,7560 (sd 0,0056); single-split test GBM 0,7823 / LR 0,7426; GBM train 0,8469 (gap 0,0646). [M6.2]
- Threshold economics [M6.4]: t=0,10 → approval 28,5%, bad rate 6,67%, cost NT$33.046.500, profit +NT$8.214.000; t=0,15 → profit +NT$5.490.500; t=0,20 → profit −NT$216.500, approved 3.908, bad 435; t=0,50 → approval 88,05%, bad rate 15,96%, cost NT$60.254.956, profit −NT$18.994.456; cost-optimal = profit-max = 0,10. ECE GBM terkalibrasi 0,0087; Brier mentah 0,1342 / terkalibrasi 0,1345.
- McNemar (threshold 0,5, test 6.000): LR vs GBM b=132, c=199, χ²=13,1601, p=0,0003; GBM default vs tertala b=36, c=30, χ²=0,3788, p=0,5383. Winner's curse = rata-rata optimisme 18 kandidat = 0,0042. [M6.5]
- Fairness [M7.1]: AIR SEX GBM mentah 0,8390 / terkalibrasi 0,8693 (hitung ulang M8: 0,8694, selisih 0,0001 = pembulatan); AIR SEX by threshold: 0,05→0,9183; 0,10→0,8694; 0,15→0,8906; 0,20→0,9432; 0,50→0,9898. AIR EDUCATION min/max = 0,3572. ECE per grup: SEX 0,0127/0,0139; EDUCATION 0,0455/0,0210/0,0362/0,0100; AGE 0,0156/0,0166/0,0312/0,1208 (AGE 60+ n=76). LR coef SEX −0,0626, EDUCATION −0,0575, MARRIAGE −0,0565, AGE +0,0547. SHAP mean |.| SEX 0,0314; PAY_MAX 0,4946.
- [M7.4]: drop_sensitive AIR 0,8694 → 0,9211; post-processing (threshold per grup) AIR → 0,9999, cost 33.046.500 → 32.756.000, profit 8.214.000 → 8.504.500; thresholds post-processing Laki-laki 0,1058 / Perempuan 0,0965.
- [M7.5]: roc_drop 0,0388 (= 0,7816 full-test − 0,7428 chunk 2); pr_drop 0,0421; pseudo-time chunks ROC: 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006; roc_spread (range) 0,0710; PSI chunk1 vs chunk5 (terkalibrasi) 0,0161; PSI skor train-vs-test 0,0017; PSI fitur train-vs-test max AGE 0,0029; drift simulasi S2 (PAY+1): PSI skor 0,5811, ECE 0,1003.
- Dataset: UCI Default of Credit Card Clients, 30.000 baris, base rate 0,2212, 31 fitur (23 mentah + 8 turunan), split 80/20 seed 42 (train 24.000, test 6.000). CalibratedClassifierCV cv=3 (Platt/sigmoid). sklearn 1.9.1.

"""

LESSONS = [
    ("M8.1", "mlf-m81-model-validation-framework"),
    ("M8.2", "mlf-m82-model-risk-rating-inventory"),
    ("M8.3", "mlf-m83-model-card-documentation"),
    ("M8.4", "mlf-m84-deployment-shadow-canary-champion"),
    ("M8.5", "mlf-m85-governance-approval-workflow"),
]

canon = (ROOT / "qa-learn/m8_canonical.json").read_text()
parts = [HEADER]
for code, slug in LESSONS:
    ts = (ROOT / f"src/app/v2/content/{slug}.ts").read_text()
    parts.append(f"\n\n===== {code} — {slug}.ts =====\n\n" + ts)
parts.append("\n\n===== ANGKA KANONIS (m8_canonical.json) =====\n" + canon)
parts.append("\n\n" + APPENDIX)
prompt = "".join(parts)
out = ROOT / "review-prompts/gap_m8_luna_prompt.txt"
out.write_text(prompt)
print(out.name, len(prompt), "bytes")
