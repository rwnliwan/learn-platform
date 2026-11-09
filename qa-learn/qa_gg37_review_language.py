#!/usr/bin/env python3
"""QA Learn — guard GG-37 (pusat): bahasa proses review bocor ke learner.

Kelas cacat R9 (P10-1 mk14): pesan yang dibaca learner memakai istilah
proses review internal ("post-R8-fix", "62,5% lama tidak terlacak").

KETERBATASAN JUJUR: frasa "lama tidak", "tidak terlacak", "ronde 8" juga
muncul secara SAH di prose ("template lama tidak rusak", "snooping yang
tidak terlacak", eyebrow "Langkah tambahan · Gap ronde 8" — konvensi
penamaan gap-step yang disengaja sejak R7). Guard string tidak bisa
membedakan "bahasa proses" dari "bahasa domain" tanpa false positive
massal (uji pra-fix: 187 temuan, hampir semua sah). Karena itu guard ini
mengunci pola yang TIDAK AMBIGU + denylist per-instance:
- "post-R<angka>" / "R<angka>-fix" / "R<angka> fix" di string tampilan
  (tidak pernah muncul sah di teks learner),
- fragment persis P10-1 (dikunci juga di qa_r9_recompute.py).
Mitigasi: temuan samar masuk prompt review ronde berikut + triase manusia.

Jalankan: python3 qa-learn/qa_gg37_review_language.py
Keluar 0 = lolos; 1 = gagal.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import display_strings, iter_lesson_files  # noqa: E402

PATTERNS = [
    re.compile(r"post-R\d+", re.I),
    re.compile(r"\bR\d+\s*[- ]?fix\b", re.I),
    re.compile(r"tidak terlacak\)", re.I),
]


def main() -> int:
    bad = 0
    for path in iter_lesson_files():
        for lineno, field, value in display_strings(path):
            for pat in PATTERNS:
                m = pat.search(value)
                if m:
                    ctx = value[max(0, m.start() - 40):
                                m.end() + 40].replace("\n", " ")
                    print(f"FAIL {path.name}:{lineno} [{field}] bahasa "
                          f"review bocor: ...{ctx}...")
                    bad += 1
    if bad:
        print(f"QA GG-37-REVIEW-LANGUAGE: FAIL ({bad} temuan)")
        return 1
    print("QA GG-37-REVIEW-LANGUAGE: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
