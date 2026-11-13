#!/usr/bin/env python3
"""Build DeepSeek review prompts for M8 (5 lessons).
Structure mirrors M7: header instructions + cross-ref appendix + m8_canonical.json + lesson TS.
Outputs to review-prompts/review_m8_m8{1..5}_prompt.txt (workspace, restart-proof).
"""
import json
from pathlib import Path

ROOT = Path("/home/hatch/workspace/learn-platform")

HEADER = """Kamu reviewer ahli independen untuk materi ajar Machine Learning in Finance (narasi Indonesia, istilah teknis English, code English). Review lesson TypeScript berikut terhadap angka kanonis (JSON) yang diberikan.

Tugas:
(1) Verifikasi setiap angka kunci di lesson terhadap kanonik: hitung ulang dari rumus/data bila perlu; laporkan angka yang salah, tidak konsisten antar bagian (prose vs lab vs kuis vs figure), atau tidak tertelusur ke kanonik.
(2) Cari kesalahan faktual, definisi salah, label/satuan salah, klaim tanpa bukti/angka pendukung, dan kontradiksi internal. Perhatikan KHUSUS: definisi SR 11-7 (conceptual soundness, outcomes analysis, ongoing monitoring, independensi validator, three lines of defense — apakah definisi dan peran tiap lini benar); model risk rating/tiering (apakah skor dan ambang konsisten dengan angka materialitas); notasi "mean ± sd" (sd antar-fold = sebaran satu skor fold, BUKAN ketidakpastian mean; SE = sd/√5 — laporkan bila lesson menyajikan "± sd" sebagai ketidakpastian mean); validasi split-half (apakah selisih A/B dihitung benar); McNemar (p-value menguji beda KEPUTUSAN, bukan kualitas model — laporkan bila diinterpretasi sebaliknya); PSI vs metrik berlabel (PSI tanpa label, bad rate butuh label matang); deployment gates shadow/canary/champion-challenger (apakah ambang gate konsisten dengan angka kanonik); governance/RACI dan urutan approval (apakah peran dan urutan benar); dan bedakan angka DATA vs ambang KEBIJAKAN lesson (ambang berlabel "[kebijakan lesson ini]" adalah pilihan desain — nilai konsistensinya dengan angka, bukan kebenarannya).
(3) JANGAN mengusulkan materi baru, mengubah struktur lesson, atau menulis kode. Reviewer hanya menilai.
(4) Output: vonis satu baris APPROVE / APPROVE-WITH-FIXES / REVISE + temuan bernomor (M1, S1, N1, ...) dengan tingkat MUST-FIX / SHOULD-FIX / NIT, bukti (file:baris + angka tepat; bila angka, tunjukkan hitung ulang), dan perbaikan yang diusulkan (konkret).
(5) Akhiri dengan tabel singkat angka yang dihitung ulang (angka, hasil hitung ulangmu, cocok/tidak).


Catatan data: angka kanonis berasal dari dataset UCI Default of Credit Card Clients (30.000 baris, default 22,12%) dan notebook flagship credit scoring; semua angka M8 berasal dari kanonik M8 (qa-learn/m8_canonical.json) yang dihitung dari data yang sama. Semua angka lesson harus tertelusur ke kanonik atau dilabeli [ilustrasi]. Angka berlabel [kebijakan lesson ini] adalah pilihan desain lesson, bukan fakta data.

=== ANGKA RUJUKAN LINTAS MODUL (dari kanonik M6/M7, untuk verifikasi klaim cross-ref) ===
- Nested CV GBM 0,7858 (sd antar-fold 0,0068; SE mean ≈ 0,0030; outer fold 0,7974; 0,7782; 0,7878; 0,7859; 0,7799); CV biasa GBM 0,7840 (sd antar-fold 0,0059); LR nested 0,7560 (sd 0,0056); single-split test GBM 0,7823 / LR 0,7426; GBM train 0,8469 (gap train-test 0,0646). [M6.2]
- Threshold economics [M6.4]: t=0,10 → approval 28,5%, bad rate 6,67%, cost NT$33.046.500, profit +NT$8.214.000; t=0,15 → profit +NT$5.490.500; t=0,20 → profit −NT$216.500, approved 3.908, bad 435; t=0,50 → approval 88,05%, bad rate 15,96%, cost NT$60.254.956, profit −NT$18.994.456; cost-optimal = profit-max = 0,10.
- AIR SEX: GBM mentah 0,8390; GBM terkalibrasi 0,8693 (kanonik M7; hitung ulang M8 memberi 0,8694 — selisih 0,0001 = pembulatan, BUKAN kesalahan). [M7.1]
- McNemar (threshold 0,5, test 6.000): LR vs GBM b=132, c=199, χ²=13,1601, p=0,0003; GBM default vs tertala b=36, c=30, χ²=0,3788, p=0,5383. [M6.5]
- Kalibrasi: ECE GBM terkalibrasi 0,0087; Brier mentah 0,1342 / terkalibrasi 0,1345. [M6.4]
- Winner's curse = rata-rata optimisme semua 18 kandidat = 0,0042 (bukan hanya pemenang). [M6.5]
- M7.4: drop_sensitive AIR 0,8694 → 0,9211; post-processing (threshold per grup) AIR → 0,9999, cost 33.046.500 → 32.756.000, profit 8.214.000 → 8.504.500.
- M7.5 drift: roc_drop chunk 0,0388, pr_drop 0,0421; PSI chunk1 vs chunk5 (terkalibrasi) 0,0161.

=== ANGKA KANONIS (m8_canonical.json) ===
"""

LESSONS = [
    ("m81", "mlf-m81-model-validation-framework"),
    ("m82", "mlf-m82-model-risk-rating-inventory"),
    ("m83", "mlf-m83-model-card-documentation"),
    ("m84", "mlf-m84-deployment-shadow-canary-champion"),
    ("m85", "mlf-m85-governance-approval-workflow"),
]

canon = (ROOT / "qa-learn/m8_canonical.json").read_text()
outdir = ROOT / "review-prompts"
outdir.mkdir(parents=True, exist_ok=True)

for code, slug in LESSONS:
    ts = (ROOT / f"src/app/v2/content/{slug}.ts").read_text()
    prompt = HEADER + canon + f"\n\n=== LESSON {slug}.ts ===\n" + ts
    out = outdir / f"review_m8_{code}_prompt.txt"
    out.write_text(prompt)
    print(out.name, len(prompt), "bytes")
