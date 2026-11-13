#!/usr/bin/env python3
"""QA Learn — rekonsiliasi jumlah track/lesson (guard permanen, 2026-11-07).

Kasus: audit 7 Nov sempat menulis "16 track / 326 lesson" padahal yang benar
13 track / 317 lesson (terverifikasi dari track_inventory.json). Penyebab: hitung
manual dari daftar nama. Aturan: jumlah track/lesson SELALU dihitung programatik
dari lessonMeta.json — jangan pernah hitung manual.

Jalankan: python3 qa_learn_counts.py
Keluar 0 = lolos; 1 = gagal (total tidak rekonsiliasi / ada track tak dikenal).
"""
import json
import sys
from pathlib import Path

META = Path.home() / "workspace/learn-platform/src/app/v2/lib/lessonMeta.json"

# 13 track spec 10-track (dari track_inventory.json, baseline 763 lesson).
SPEC = {
    "Statistika", "Probabilitas", "Bioinformatika", "SQL", "Credit Risk",
    "Python", "Data Management", "Financial Markets", "Fraud & AML Analytics",
    "Health Data Science", "Marketing Analytics", "Market Risk",
    "Portfolio Management",
}
# 13 track di luar spec (11 track berspec topik-11-track-tambahan.md + WQB + FDP).
NONSPEC = {
    "Risk Reporting", "Data Engineer", "WorldQuant Brain",
    "Machine Learning Engineer", "Blockchain Data Scientist",
    "Deep Learning Engineer", "Business Intelligence",
    "Database Administrator", "AI Engineering", "MLOps",
    "Agentic AI Engineer", "LLMOps", "Financial Data Pipeline",
    "Machine Learning Finance",
}

def main() -> int:
    meta = json.loads(META.read_text())
    lessons = meta["lessons"]
    per_track: dict[str, int] = {}
    for slug, v in lessons.items():
        tr = v.get("tr")
        if not tr:
            print(f"FAIL: lesson {slug} tanpa field 'tr'")
            return 1
        per_track[tr] = per_track.get(tr, 0) + 1

    total = len(lessons)
    spec_n = sum(n for t, n in per_track.items() if t in SPEC)
    nonspec_n = sum(n for t, n in per_track.items() if t in NONSPEC)
    unknown = [t for t in per_track if t not in SPEC and t not in NONSPEC]

    print(f"Total track: {len(per_track)} (spec {len(SPEC)}, non-spec {len(NONSPEC)})")
    print(f"Total lesson: {total} = spec {spec_n} + non-spec {nonspec_n}")
    for t in sorted(per_track):
        tag = "spec" if t in SPEC else ("non-spec" if t in NONSPEC else "UNKNOWN")
        print(f"  {t}: {per_track[t]} [{tag}]")

    ok = True
    # Lantai anti-hapus (perintah Septian 2026-11-12 16:28: build/deploy
    # JANGAN PERNAH menghapus course/lesson/fitur yang sudah ada).
    # Total lesson pasca-deploy M7 = 971. Bila build baru menurunkan total,
    # guard ini FAIL — naikkan lantai hanya bila Septian sendiri yang
    # memerintahkan penghapusan lesson.
    if total < 971:
        print(f"FAIL: total lesson {total} < lantai 971 (ada lesson yang hilang — periksa regen/build-content MERGE)")
        ok = False
    if spec_n + nonspec_n != total:
        print(f"FAIL: spec ({spec_n}) + non-spec ({nonspec_n}) != total ({total})")
        ok = False
    if unknown:
        print(f"FAIL: track tak dikenal (belum diklasifikasi spec/non-spec): {unknown}")
        ok = False
    if len(per_track) != len(SPEC) + len(NONSPEC):
        print(f"FAIL: jumlah track {len(per_track)} != {len(SPEC) + len(NONSPEC)}")
        ok = False
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main())
