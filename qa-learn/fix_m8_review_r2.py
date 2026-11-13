#!/usr/bin/env python3
"""Ronde FIX review DeepSeek M8 — PUTARAN 2 (situs terlewat recon awal).

Ditemukan oleh grep pasca-fix ronde 1 (13 Nov 2026): lima situs M8.1 +
satu teks SVG M8.3 yang memakai rumusan lama yang sama (S4 "dua kali sd
antar-fold"; M1 "satu-satunya pemicu"). Mirror .md TIDAK punya situs-situs
ini (sudah bersih — diverifikasi grep).

Cara pakai: python3 qa-learn/fix_m8_review_r2.py [--dry]
"""
import argparse
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def apply(path, pairs, dry):
    p = REPO / path
    text = p.read_text()
    ok = True
    for old, new, expect in pairs:
        n = text.count(old)
        if n != expect:
            print(f"  FAIL {path}: expect {expect}x found {n}x :: {old[:100]!r}")
            ok = False
            continue
        text = text.replace(old, new)
    if not ok:
        return False
    if not dry:
        p.write_text(text)
    print(f"  OK {path}: {len(pairs)} replacements applied")
    return True


M81 = "src/app/v2/content/mlf-m81-model-validation-framework.ts"
M81_R2 = [
    # S4: lab 1 prose — pembanding galat selisih, bukan "dua kali sd antar-fold".
    ("Setelah lab jalan, bandingkan dengan langkah 5: selisih ROC-AUC −0,0139 kira-kira dua kali sd antar-fold nested CV 0,0068 [M6.2] — wajar untuk n=3.000 per belahan.",
     "Setelah lab jalan, bandingkan dengan langkah 5: selisih ROC-AUC −0,0139 — bandingkan dengan galat sampling selisih (≈0,011–0,013; sd ROC-AUC per half n=3.000 ≈ 0,008–0,009), bukan dengan sd antar-fold nested CV 0,0068 [M6.2] — wajar untuk n=3.000 per belahan.", 1),
    # M1: komentar kode lab 1.
    ("kuning_bad_rate = abs(1,06) > 1,0 → True — satu-satunya pemicu KUNING.",
     "kuning_bad_rate = abs(1,06) > 1,0 → True — pemicu KUNING pertama (pemicu lainnya: ECE per grup yang masuk band — lihat langkah 9).", 1),
    # M1: check msg lab 1.
    ("Bad rate 7,20% − 6,14% = +1,06 poin persen — melewati ambang HIJAU 1,0; satu-satunya pemicu KUNING.",
     "Bad rate 7,20% − 6,14% = +1,06 poin persen — melewati ambang HIJAU 1,0; pemicu KUNING pertama (lihat langkah 9 untuk pemicu ECE per grup).", 1),
    # S4: opsi kuis benar — pembanding yang benar + why diperkaya.
    ("Selisih itu konsisten dengan noise sampling — base rate identik, ayunannya wajar untuk n=3.000 (kira-kira dua kali sd nested CV 0,0068) — bukan bukti model rusak\", why: \"Benar: halves mengukur NOISE, bukan kualitas. Base rate yang hampir identik membuktikan belahannya setara; ayunan 0,0139 wajar untuk ukuran sampel itu.\"",
     "Selisih itu konsisten dengan noise sampling — base rate identik, ayunannya wajar untuk n=3.000 (≈1,1–1,3 sd selisih; sd ROC-AUC per half ≈ 0,008–0,009) — bukan bukti model rusak\", why: \"Benar: halves mengukur NOISE, bukan kualitas. Base rate yang hampir identik membuktikan belahannya setara; ayunan 0,0139 ≈ 1,1–1,3 sd selisih — bukan 2× sd antar-fold — wajar untuk ukuran sampel itu.\"", 1),
    # M1: checkpoint — band |Δapproval| + cakupan ECE + pemicu KUNING.
    ("KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Verdict model ini: KUNING — satu-satunya pemicu |Δbad rate| 1,06 pp.",
     "KUNING (pelanggaran ringan: ECE 0,02–0,05; |ΔROC| 0,02–0,05; |Δbad rate| 1,0–3,0 pp; |Δapproval| 1,0–3,0 pp; ROC 0,70–0,75); MERAH (ECE ≥ 0,05; |ΔROC| > 0,05; |Δbad rate| > 3,0 pp; |Δapproval| > 3,0 pp; ROC < 0,70; conceptual soundness gagal). Band ECE berlaku untuk overall dan per half; per grup masuk band hanya bila n ≥ 200. Verdict model ini: KUNING — pemicu |Δbad rate| 1,06 pp DAN ECE per grup yang masuk band (Pascasarjana 0,0210; SMA 0,0362; AGE 50–59 0,0312).", 1),
]

M83 = "src/app/v2/content/mlf-m83-model-card-documentation.ts"
M83_R2 = [
    # N2: teks dalam SVG figure (caption prose sudah diperbaiki ronde 1).
    ("Kolom 1–5: APA modelnya · kolom 6–10: SIAPA, KAPAN, dan BAGAIMANA mengembalikannya.",
     "Kolom 1–5: APA modelnya · kolom 6 & 9: BAGAIMANA mereproduksi/mengembalikan · kolom 7–8: SIAPA & KAPAN · kolom 10: MENGAPA.", 1),
]


def main():
    ap = argparse.ArgumentParser(description="Fix review DeepSeek M8 ronde 2 (situs terlewat).")
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()
    total = 0
    total += apply(M81, M81_R2, args.dry)
    total += apply(M83, M83_R2, args.dry)
    print(f"\nTOTAL pasangan terapkan: {total}" + (" (DRY-RUN)" if args.dry else ""))


if __name__ == "__main__":
    main()
