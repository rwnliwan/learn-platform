#!/usr/bin/env python3
"""Build DeepSeek review prompts for M9 (1 per lesson).
Structure mirrors build_review_m8_prompts.py, with the M8 lesson applied:
the prompt includes the FULL canonicals the lessons cite (M4, M6, M8, M9)
plus a targeted M7 appendix (only the M7 numbers M9 cites), so the
reviewer cannot false-flag a number as 'untraceable'.
Output: review-prompts/review_m9_m9{1..5}_prompt.txt
"""
import json
from pathlib import Path

ROOT = Path("/home/hatch/workspace/learn-platform")

HEADER_TEMPLATE = """Kamu adalah reviewer akademik independen untuk modul M9 "{title}" (track Machine Learning Finance, Learn v2). Tugasmu: memeriksa lesson ini secara ketat dan menemukan KESALAHAN — angka salah, rumus salah, definisi salah, kontradiksi internal, sitasi salah, label salah, figure salah, kuis/lab yang jawabannya salah, dan klaim yang tidak didukung angka.

MATERI:
- 1 file TypeScript lesson (format: steps dengan prose, formulaNote, checkpoint, quiz, lab Pyodide, figure SVG).
- Angka kanonis M9 (semua angka kunci lesson ini) + angka kanonis modul yang dikutip lesson ini (M4, M6, M8 penuh; M7 hanya angka yang dikutip lesson ini — lihat appendix).
- Bila lesson menyebut angka dengan sitasi [M?.?], angka itu ADA di kanonik modul tersebut di bawah. Bila lesson menyebut angka tanpa sitasi, ia ada di kanonik M9 atau berlabel [notebook]/[turunan]/[ilustrasi]/[kebijakan lesson ini]. JANGAN menuduh angka "tidak tertelusur" sebelum memeriksa SEMUA kanonik di bawah.

ATURAN:
1. Setiap temuan WAJIB punya bukti: kutip kalimat/angka lesson yang salah DAN angka/rumus yang benar (dari kanonik atau hitung ulang sendiri dari angka kanonik).
2. Klasifikasikan: MUST (salah dan menyesatkan learner — angka/definisi/kontradiksi), SHOULD (ambigu, label salah, bisa dibaca salah), NIT (typo, wording, presisi).
3. Untuk tiap temuan, beri lokasi (langkah/kuis/lab/figure + nomor baris bila ada) dan perbaikan konkret.
4. Jangan mengarang angka baru. Bila mengusulkan contoh hitung, pakai angka kanonis atau tandai [ilustrasi].
5. Akhiri dengan VONIS lesson: APPROVE / APPROVE-WITH-FIXES / REVISE + satu kalimat alasan.
6. Jawab dalam Bahasa Indonesia (istilah teknis English, seperti lesson).

CATATAN KHUSUS (periksa, jangan langsung vonis):
- Lab M9.2 memakai MU_DAY = −0,0006 [m9_canonical.json] (nilai bulat) sehingga solver menemukan σ* = 0,0300; prose memakai μ eksak −0,000558 sehingga σ* = 0,0301. Selisih 0,0001 = pembulatan, dan prose MENYATAKAN μ eksaknya. Periksa apakah perbedaan ini dijelaskan dengan cukup jelas di lesson, atau perlu satu kalimat penjelas tambahan — JANGAN vonis sebagai kesalahan angka bila penjelasannya ada.

FORMAT JAWABAN (markdown):
# Review DeepSeek M9.{n}
## Vonis
## Temuan MUST
### M1 — [judul]
- Lokasi:
- Bukti:
- Perbaikan:
## Temuan SHOULD
## Temuan NIT

"""

M7_APPENDIX = """===== ANGKA M7 YANG DIKUTIP LESSON INI (m7_canonical.json, terpilih) =====
- m75_pseudo_time_chunks_test (ROC-AUC per chunk, test): chunk 1: 0,7449; chunk 2: 0,7428; chunk 3: 0,8138; chunk 4: 0,8041; chunk 5: 0,8006.
- m75_pseudo_time_roc_spread = 0,0710 (= 0,8138 − 0,7428, rentang maks−min antar-chunk).
- roc_drop = 0,0388 (= 0,7816 full-test − 0,7428 chunk 2).
- (Hanya ini yang dikutip dari M7 di seluruh M9; angka M7 lain TIDAK dipakai M9.)

"""

LESSONS = [
    ("M9.1", "Monte Carlo Simulation", "mlf-m91-monte-carlo-simulation"),
    ("M9.2", "Scenario & Stress Testing", "mlf-m92-scenario-stress-testing"),
    ("M9.3", "Backtesting & Walk-Forward", "mlf-m93-backtesting-walk-forward"),
    ("M9.4", "Sensitivity Analysis", "mlf-m94-sensitivity-analysis"),
    ("M9.5", "Historical Simulation & Bootstrap", "mlf-m95-historical-simulation-bootstrap"),
]

canon_m9 = (ROOT / "qa-learn/m9_canonical.json").read_text()
canon_m4 = (ROOT / "qa-learn/m4_canonical.json").read_text()
canon_m6 = (ROOT / "qa-learn/m6_canonical.json").read_text()
canon_m8 = (ROOT / "qa-learn/m8_canonical.json").read_text()

for code, title, slug in LESSONS:
    n = code[-1]
    ts = (ROOT / f"src/app/v2/content/{slug}.ts").read_text()
    parts = [HEADER_TEMPLATE.format(title=title, n=n)]
    parts.append(f"\n\n===== {code} — {slug}.ts =====\n\n" + ts)
    parts.append("\n\n===== ANGKA KANONIS M9 (m9_canonical.json) =====\n" + canon_m9)
    parts.append("\n\n===== ANGKA KANONIS M4 (m4_canonical.json) =====\n" + canon_m4)
    parts.append("\n\n===== ANGKA KANONIS M6 (m6_canonical.json) =====\n" + canon_m6)
    parts.append("\n\n===== ANGKA KANONIS M8 (m8_canonical.json) =====\n" + canon_m8)
    parts.append("\n\n" + M7_APPENDIX)
    prompt = "".join(parts)
    out = ROOT / f"review-prompts/review_m9_m9{n}_prompt.txt"
    out.write_text(prompt)
    print(out.name, len(prompt), "bytes")
