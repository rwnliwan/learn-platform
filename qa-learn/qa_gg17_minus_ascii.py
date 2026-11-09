#!/usr/bin/env python3
"""QA Learn — guard GG-17 (pusat): minus ASCII di awal nilai tampilan.

Kelas cacat R9 (P2-5 b19, P6-MLE16-5 mle16; preseden Pack/FMVA): string yang
DITAMPILKAN ke learner memakai U+002D HYPHEN-MINUS ("-0,5") padahal konvensi
lesson memakai U+2212 MINUS SIGN ("−0,5").

KETERBATASAN JUJUR + BENTUK GUARD: sapuan repo-wide menemukan 682 instance
(pra-fix R9) — konvensi ini tidak pernah diterapkan repo-wide, dan sebagian
besar temuan adalah fragmen kode di dalam prose (`kri[-1]`, `exp(-0.5*2)`,
`data[-50:]`, rentang "-1 sampai 1") yang tidak bisa dibedakan aman oleh
guard string tanpa false positive massal. Memperbaiki 682 instance di luar
scope ronde ini. Karena itu guard ini mengikuti pola yang sudah mapan di
repo (`qa_learn_numbers.py`, `qa_absolute_claims.py`): DAFTAR DENYLIST
per-file yang TUMBUH tiap ronde — setiap instance yang dikoreksi dikunci di
sini (fragment ASCII dilarang muncul + fragment U+2212 wajib ada). Sensus
repo-wide dicetak sebagai laporan (tidak menggagalkan) agar ronde berikut
bisa menutupnya bertahap. Mitigasi: pola ini + frasa masuk prompt review
ronde berikut.

Jalankan: python3 qa-learn/qa_gg17_minus_ascii.py
Keluar 0 = lolos; 1 = gagal.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import CONTENT, display_strings, iter_lesson_files  # noqa: E402

# (file, fragment ASCII yang dilarang, fragment U+2212 yang wajib ada)
FIXTURES = [
    ("b19-mcmc.ts", "(benar -0.5)", "(benar −0,5)"),
    ("mle16-hyperparameter-tuning.ts", ">-0,5<", ">−0,5<"),
    ("mle16-hyperparameter-tuning.ts", ">-0,3<", ">−0,3<"),
    ("mle16-hyperparameter-tuning.ts", ">-0,1<", ">−0,1<"),
    ("mle16-hyperparameter-tuning.ts", "(terbaik -0,46)", "(terbaik −0,46)"),
    ("mle16-hyperparameter-tuning.ts", "(terbaik -0,11)", "(terbaik −0,11)"),
    ("mle16-hyperparameter-tuning.ts", "Grid terbaik = (-0.4598",
     "Grid terbaik = (−0,4598"),
    ("mle16-hyperparameter-tuning.ts", "Random terbaik = (-0.1087",
     "Random terbaik = (−0,1087"),
    ("d11-scipy-statsmodels.ts", "Slope -1.858e-06", "Slope −1,858e-06"),
    ("d11-scipy-statsmodels.ts", "sekitar -1.858e-06", "sekitar −1,858e-06"),
    ("a16-korelasi.ts", "rentang -1 sampai 1", "rentang −1 sampai 1"),
]

MINUS_RE = re.compile(r"(?:^|[\s\(\[=≈:,>\"'])(\-)(?=\d)")


def main() -> int:
    bad = 0
    for fname, dont, want in FIXTURES:
        text = (CONTENT / fname).read_text(encoding="utf-8")
        if dont in text:
            print(f"FAIL {fname}: minus ASCII masih ada: '{dont}'")
            bad += 1
        if want not in text:
            print(f"FAIL {fname}: bentuk U+2212 hilang: '{want}'")
            bad += 1
    # Sensus (laporan saja — lihat docstring soal keterbatasan).
    census = 0
    per_file = {}
    for path in iter_lesson_files():
        n = 0
        for _ln, _f, value in display_strings(path):
            n += len(MINUS_RE.findall(value))
        if n:
            per_file[path.name] = n
            census += n
    top = sorted(per_file.items(), key=lambda kv: -kv[1])[:5]
    print(f"SENSUS minus-ASCII repo-wide (laporan, tidak menggagalkan): "
          f"{census} di {len(per_file)} file; terbanyak: {top}")
    if bad:
        print(f"QA GG-17-MINUS-ASCII: FAIL ({bad} temuan)")
        return 1
    print("QA GG-17-MINUS-ASCII: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
