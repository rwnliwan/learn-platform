# Fix 5 KONTRADIKSI dari concept gate ronde fix M7 (concept_gate_m7_fix.txt).
# Semua 5 terverifikasi BENAR oleh koordinator (hitung ulang / logika):
#  G1 M7.2 Q SMA why: "paling tidak bisa dipercaya" tanpa cakupan — ECE 60+ 0,1208
#     >> SMA 0,0362, jadi "paling" global salah. Soal sendiri sudah benar
#     ("ECE terburuk di antara grup besar"); why diselaraskan ke cakupan itu.
#  G2 M7.2 Q uji-z why: "dua bukti independen" salah — uji-z dan CI dari sampel
#     yang sama (SE sama) = dua cara membaca bukti yang sama.
#  G3 M7.2 Q6 opsi C why: "hanya sama bila distribusi sama" salah logika —
#     distribusi identik adalah syarat CUKUP, bukan PERLU (model konstan /
#     perbedaan saling meniadakan bisa memberi approval sama).
#  G4 M7.3 (3 spot: TS:16, TS:181 body, TS:461 why + .md:7): transformasi
#     monoton mempertahankan URUTAN PREDIKSI nasabah, BUKAN urutan atribusi/
#     SHAP antar fitur — "ranking dan fitur teratasnya sama" tanpa bukti salah.
#  G5 M7.5:27 pitfall body: dua ROC-AUC test tanpa label varian (0,7823 mentah
#     vs 0,7816 terkalibrasi) — kelas 99 yang sama dengan S1, spot terlewat.
import sys

FIXES = [
    # G1 — M7.2 SMA why: kualifikasi cakupan "di antara grup besar EDUCATION"
    ("src/app/v2/content/mlf-m72-bias-audit-sources.ts",
     "grup ini paling jarang disetujui, paling sering salah ditolak, dan probabilitasnya paling tidak bisa dipercaya.",
     "grup ini paling jarang disetujui, paling sering salah ditolak, dan probabilitasnya paling tidak bisa dipercaya di antara grup besar EDUCATION (ECE 0,0362)."),
    # G2 — M7.2 uji-z why: bukan dua bukti independen
    ("src/app/v2/content/mlf-m72-bias-audit-sources.ts",
     "Benar: dua bukti independen (uji-z dan interval yang tidak bersinggungan) menunjuk arah yang sama. Selisih 3,93 poin persen pada n ribuan adalah sinyal, bukan noise sampling.",
     "Benar: uji-z dan interval yang tidak bersinggungan adalah DUA CARA MEMBACA bukti yang sama (keduanya dihitung dari SE yang sama) — keduanya menunjuk arah yang sama. Selisih 3,93 poin persen pada n ribuan adalah sinyal, bukan noise sampling."),
    # G3 — M7.2 Q6 opsi C why: syarat cukup, bukan perlu
    ("src/app/v2/content/mlf-m72-bias-audit-sources.ts",
     "Salah: approval antar grup hanya sama bila distribusi fitur antar grup juga sama. Di sini distribusi fiturnya berbeda (langkah 3), jadi approval-nya berbeda — dengan atau tanpa kolom sensitif.",
     "Salah: approval antar grup yang sama TIDAK membuktikan distribusi fiturnya sama — model konstan menyetujui semua orang apa pun fiturnya, dan perbedaan distribusi bisa saling meniadakan. Di sini distribusi fiturnya berbeda (langkah 3), jadi approval-nya berbeda — dengan atau tanpa kolom sensitif."),
    # G4a — M7.3 TS:16 konteks
    ("src/app/v2/content/mlf-m73-explainability-shap-lime.ts",
     "transformasi monoton, jadi ranking dan fitur teratasnya sama, walau nilai SHAP eksak pada skor terkalibrasi akan berbeda (langkah 6).",
     "transformasi monoton, jadi ranking PREDIKSI nasabahnya sama, walau nilai SHAP eksak — dan urutan fitur teratas — pada skor terkalibrasi bisa berbeda (langkah 6)."),
    # G4b — M7.3 TS:181 pitfall body
    ("src/app/v2/content/mlf-m73-explainability-shap-lime.ts",
     "transformasi monoton, jadi ranking dan fitur teratasnya sama, tapi nilai SHAP eksak pada skor terkalibrasi akan berbeda.",
     "transformasi monoton, jadi ranking PREDIKSI nasabahnya sama (itu sebabnya ROC-AUC nyaris sama), tapi nilai SHAP eksak dan urutan fitur teratas pada skor terkalibrasi bisa berbeda."),
    # G4c — M7.3 TS:461 quiz why
    ("src/app/v2/content/mlf-m73-explainability-shap-lime.ts",
     "Kalibrasi Platt adalah transformasi monoton — ranking dan fitur teratasnya sama, tapi nilai SHAP eksak pada skor terkalibrasi akan berbeda.",
     "Kalibrasi Platt adalah transformasi monoton — ranking PREDIKSI nasabahnya sama, tapi nilai SHAP eksak dan urutan fitur teratas pada skor terkalibrasi bisa berbeda."),
    # G4a-mirror — M7.3 .md:7 konteks
    ("content/mlf-m73-explainability-shap-lime.md",
     "transformasi monoton, jadi ranking dan fitur teratasnya sama, walau nilai SHAP eksak pada skor terkalibrasi akan berbeda.",
     "transformasi monoton, jadi ranking PREDIKSI nasabahnya sama, walau nilai SHAP eksak — dan urutan fitur teratas — pada skor terkalibrasi bisa berbeda."),
    # G5 — M7.5:27 pitfall body: labeli kedua ROC-AUC
    ("src/app/v2/content/mlf-m75-monitoring-drift.ts",
     "sementara ROC-AUC test-mu tetap 0,7823 di laporan lama. Di simulasi S2 lesson ini [simulasi], ROC-AUC hanya turun 0,0256 (0,7816 ke 0,7560)",
     "sementara ROC-AUC test-mu (GBM mentah) tetap 0,7823 di laporan lama. Di simulasi S2 lesson ini [simulasi], ROC-AUC (GBM terkalibrasi) hanya turun 0,0256 (0,7816 ke 0,7560)"),
]

def main():
    dry = "--dry-run" in sys.argv
    applied = 0
    for path, old, new in FIXES:
        with open(path, encoding="utf-8") as f:
            content = f.read()
        n = content.count(old)
        if n == 0:
            print(f"MISS  {path}: {old[:70]!r}")
            sys.exit(1)
        if n != 1:
            print(f"AMBIG {path}: {n}x {old[:70]!r}")
            sys.exit(1)
        if not dry:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content.replace(old, new))
        applied += 1
        print(f"{'DRY  ' if dry else 'FIX  '} {path}: {old[:60]!r}")
    print(f"TOTAL {applied}/{len(FIXES)}")

if __name__ == "__main__":
    main()
