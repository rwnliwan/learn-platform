#!/usr/bin/env python3
"""QA Learn — guard GG-21 (pusat): angka narasi/mini-case tanpa jejak derivasi.

Kelas cacat R9 (P8-1 biz14 Rp180rb tak terturunkan; P5-FR14-4 "16
investigator virtual"; P7-2 biaya retry Rp4.100/hari; P1-7 "120 kasus per
kuartal"; P5-FR14-6 "sekitar 5 hari"): angka yang diklaim di narasi /
mini-case WAJIB dapat direproduksi dari data/fixture lesson.

KETERBATASAN JUJUR (dicatat, bukan disembunyikan): deteksi UMUM "angka ini
tidak punya jejak derivasi" tidak bisa dikunci penuh oleh guard string —
angka baru yang tidak terturunkan tetap bisa lolos bila tidak ada di daftar
fixture. Yang dikunci di sini: (a) semua instance R9 — angka salahnya
dilarang muncul, angka benarnya (beserta rantai) wajib ada; (b) daftar
frasa-tanpa-jejak yang tumbuh tiap ronde. Mitigasi: frasa/angka narasi baru
masuk prompt review ronde berikut + triase manusia (lihat AGENTS.md).

Jalankan: python3 qa-learn/qa_gg21_narrative_derivation.py
Keluar 0 = lolos; 1 = gagal.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import CONTENT  # noqa: E402

# (file, wajib ADA [angka benar + jejak rantainya], wajib TIDAK ADA [angka lama])
FIXTURES = [
    ("biz14-capstone.ts",
     ["Rp348 rb"],  # Minuman Okt Rp522 rb x 66,7% = Rp348 rb/bulan
     ["Rp180rb/bulan", "Rp180 rb/bulan", "Kehilangan Rp180"]),
    ("fr14-case-management.ts",
     ["≈5 investigator", "138 gaji"],  # 47,5/33,73=1,408 -> +4,9; 3,63M/26,4jt=138
     ["menambah 16", "16 'investigator virtual'", "200 gaji"]),
    ("aai15-hardening-deploy.ts",
     ["Rp82/hari"],  # retry marginal 20 x 0,0204 x 200 = Rp82/hari
     ["Rp4.100/hari"]),
    ("a19-eda-end-to-end.ts",
     ["15 kasus per kuartal"],  # 120 kasus / 8 kuartal (2 tahun)
     ["120 kasus macet per kuartal", "120 kasus/kuartal"]),
    ("fr14-case-management.ts",
     ["3,6 hari"],  # kurva lesson: 20 jam->0,7; 72 jam->0,3; linear -> ~86 jam
     ["sekitar 5 hari"]),
]

# Frasa tanpa jejak yang dilarang di prose narasi (tumbuh tiap ronde).
# (Kosong untuk saat ini — "sekitar 5 hari" sudah dikunci sebagai fixture
# di atas; menambahkannya di sini hanya menggandakan hitungan.)
BANNED_PHRASES: list = []


def main() -> int:
    bad = 0
    for fname, must_have, must_not in FIXTURES:
        text = (CONTENT / fname).read_text(encoding="utf-8")
        for frag in must_have:
            if frag not in text:
                print(f"FAIL {fname}: angka benar + jejak hilang: '{frag}'")
                bad += 1
        for frag in must_not:
            if frag in text:
                print(f"FAIL {fname}: angka tanpa derivasi masih ada: '{frag}'")
                bad += 1
    # frasa terlarang di semua file (prose saja — sederhananya seluruh file)
    for path in sorted(CONTENT.glob("*.ts")):
        text = path.read_text(encoding="utf-8")
        for frag in BANNED_PHRASES:
            if frag in text:
                print(f"FAIL {path.name}: frasa tanpa jejak: '{frag}'")
                bad += 1
    if bad:
        print(f"QA GG-21-NARRATIVE-DERIVATION: FAIL ({bad} temuan)")
        return 1
    print("QA GG-21-NARRATIVE-DERIVATION: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
