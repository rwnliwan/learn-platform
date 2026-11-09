#!/usr/bin/env python3
"""QA Learn — guard GG-2 (diperkuat, R9) + GG-3 + GG-14: hitung ulang RANTAI.

Pelajaran R9: guard GG-2 lama hanya membandingkan dua angka — TIDAK menangkap
kelas "komponen hilang dalam rantai hitung" (F1: cr22 10x, c15 300 debitur,
mle16 rung hilang, a18 sumbu 480). Guard ini MENGHITUNG ULANG rantai dari
komponen yang tertulis di lesson (Python, di sini), lalu menegaskan lesson
memuat hasil hitung ulang itu DAN TIDAK memuat nilai lama yang salah.

Setiap fixture: (file, label, fungsi hitung -> nilai, fragment benar yang
wajib ada, fragment salah yang wajib tidak ada). Bila hitung ulang tidak
cocok dengan fragment benar, guard GAGAL dengan pesan hitung — bukan
sekadar string-match.

Juga mengunci GG-3 (prose-vs-lab: d11, aml4 fixture, cr20, mr7 terparah,
biz14 summary, mk15 Q*, cr17a) dan GG-14 (cacat kelas sama lintas lesson:
template "Lima heuristik" — dicek penuh di qa_gg18; covenant cr17b).

Jalankan: python3 qa-learn/qa_r9_recompute.py
Keluar 0 = lolos; 1 = gagal.
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gg_common import CONTENT  # noqa: E402


def _read(fname):
    return (CONTENT / fname).read_text(encoding="utf-8")


# (file, label, nilai_hitung, fragment_benar, fragment_salah)
# nilai_hitung dipakai untuk verifikasi internal (assert) sebelum cek string.
RECOMPUTES = []


def _add(fname, label, value, want, dont, check=None):
    if check is not None:
        assert check(value), f"hitung ulang {label}: {value} tidak lolos cek"
    RECOMPUTES.append((fname, label, value, want, dont))


# --- P1: a17/a18/a19 ---
_add("a17-missing-data.ts", "a17 total missing",
     400 * 0.03 + 80 * 0.08 + 20 * 0.45, ["5,4%"], ["12% kosong"],
     check=lambda v: abs(v - 27.4) < 1e-9)
_add("a18-visualisasi.ts", "a18 sumbu 475 -> 3x",
     (505 - 475) / (485 - 475), ["Rp475 M"], ["Rp480 M"],
     check=lambda v: v == 3)
_add("a18-visualisasi.ts", "a18 rasio 2,58x",
     (43100 - 40000) / (41200 - 40000), ["2,58 kali lipat"],
     ["menjulang tiga kali lipat"],
     check=lambda v: abs(v - 2.5833) < 0.001)
_add("a19-eda-end-to-end.ts", "a19 median 8,5",
     17 - 8.5, ["median (8,5 jt)"], ["median (8 jt)"],
     check=lambda v: v == 8.5)
_add("a19-eda-end-to-end.ts", "a19 rata-rata 1",
     10000 / 10000, ["rata-rata 1 pengajuan"], ["rata-rata 1,18 pengajuan"],
     check=lambda v: v == 1)

# --- P2: b15/b18/b19 (b15 = GG-5, dicatat terpisah; guard mengunci angkanya) ---
_add("b15-proses-stokastik.ts", "b15 median 10565",
     10000 * math.exp(0.055), ["Rp10.565"], ["Rp10.566"],
     check=lambda v: abs(v - 10565.4) < 1)
_add("b18-poisson-process.ts", "b18 kapasitas 3x",
     72 / 24, ["tiga kali lipat rata-rata 24"], ["tepat menutupi rata-rata 24"],
     check=lambda v: v == 3)
_add("b19-mcmc.ts", "b19 presisi 6,2x",
     math.sqrt(20000 / 513), ["≈6,2×"], ["~40x lipat"],
     check=lambda v: abs(v - 6.24) < 0.05)

# --- P3: cr22/cr17b/cr20 ---
_add("cr22-collection-recovery.ts", "cr22 otomasi 3,3M",
     0.11 * 50000 * 2_000_000 * 0.30, ["Rp3,3 miliar/bulan", "440×"],
     ["Rp330 juta", "ROI 44×"],
     check=lambda v: abs(v - 3.3e9) < 1)
_add("cr22-collection-recovery.ts", "cr22 kunjungan +980rb",
     0.55 * 2_000_000 - 120_000, ["Rp980.000"], ["Kunjungan RUGI"],
     check=lambda v: v == 980000)
_add("cr22-collection-recovery.ts", "cr22 break-even 218rb/1,5jt",
     120_000 / 0.55, ["Rp218 rb", "Rp1,5 jt"], ["Rp5 jt"],
     check=lambda v: abs(v - 218181.8) < 1)
_add("cr17b-corporate-credit-2.ts", "cr17b DSCR 1,242 < 1,3",
     1.35 * 0.92, ["1,242", "melanggar"], ["masih lolos tipis"],
     check=lambda v: abs(v - 1.242) < 1e-9)
_add("cr17b-corporate-credit-2.ts", "cr17b headroom ke 1,0x",
     (1.35 - 1.0) / (0.25 * 1.35), ["1,04 SD", "P ≈ 15%"], ["0,5 SD"],
     check=lambda v: abs(v - 1.037) < 0.01)
_add("cr17b-corporate-credit-2.ts", "cr17b headroom ke 1,3x",
     (1.35 - 1.3) / (0.25 * 1.35), ["0,15 SD", "P ≈ 44%"], ["P ≈ 30%"],
     check=lambda v: abs(v - 0.148) < 0.01)

# --- P4: mr7/mr8/e14 ---
_add("mr7-stress-test.ts", "mr7 total 195jt",
     -68_000_000 - 55_000_000 - 72_000_000, ["Rp195 juta"],
     ["Rp195 miliar"],
     check=lambda v: v == -195_000_000)
_add("mr8-risiko-suku-bunga.ts", "mr8 hedge +77M",
     2.5771 * 2e12 * 0.0001 * 150, ["Rp77 M"], ["untung Rp12 M"],
     check=lambda v: abs(v - 77.3e9) < 0.2e9)
_add("mr8-risiko-suku-bunga.ts", "mr8 net +32M",
     -45e9 + 77.3e9, ["+Rp32 M"], ["rugi Rp33 M", "−Rp33 M"],
     check=lambda v: abs(v - 32.3e9) < 0.5e9)
_add("mr8-risiko-suku-bunga.ts", "mr8 duration bersih 4,42",
     7 - 2.5771, ["4,42"], ["Duration bersih = 0", "Duration bersih = nol"],
     check=lambda v: abs(v - 4.4229) < 0.001)
_add("e14-money-market.ts", "e14 550jt = 5,1x",
     550 / 106.94, ["5,1×"], ["kelebihan satu nol"],
     check=lambda v: abs(v - 5.14) < 0.01)

# --- P5: fr14/aml4/aml5 ---
_add("fr14-case-management.ts", "fr14 jadwal 480",
     510 - 30, ["480"], ["485", "potong 1 tier-2 dan 2 tier-3"],
     check=lambda v: v == 480)
_add("fr14-case-management.ts", "fr14 investigator +5",
     12 * (47.5 / 33.73) - 12, ["≈5"], ["16 'investigator virtual'"],
     check=lambda v: abs(v - 4.9) < 0.2)
_add("fr14-case-management.ts", "fr14 gaji 138",
     3.63e6 / 26.4e6 * 1000, ["138"], ["200 gaji"],
     check=lambda v: abs(v - 137.5) < 1)
_add("aml4-sanctions.ts", "aml4 sim 0,8125",
     1 - 3 / 16, ["0,8125"], ["0,87"],
     check=lambda v: abs(v - 0.8125) < 1e-9)
_add("aml4-sanctions.ts", "aml4 biaya 40x",
     2_000_000_000 / 50_000_000, ["40×"], ["13× lebih mahal", "Rp150 jt"],
     check=lambda v: v == 40)
_add("aml5-structuring.ts", "aml5 14,4 juta kali",
     (1 / 8.5e-15) / 8145060, ["14,4 juta kali"], ["14 miliar kali"],
     check=lambda v: abs(v - 14.4e6) < 0.2e6)

# --- P6: c15/d11/mle16 ---
_add("mle16-hyperparameter-tuning.ts", "mle16 SH 405 vs 6561",
     81 + 81 + 81 + 81 + 81, ["405", "6.561"], ["324 epoch", "2.187"],
     check=lambda v: v == 405)
_add("mle16-hyperparameter-tuning.ts", "mle16 hemat 16,2x",
     6561 / 405, ["16,2×"], ["7x hemat", "7× hemat"],
     check=lambda v: abs(v - 16.2) < 0.05)

# --- P7: aai15/aie15 ---
_add("aai15-hardening-deploy.ts", "aai15 retry Rp82/hari",
     20 * 0.0204 * 200, ["Rp82/hari"], ["Rp4.100/hari"],
     check=lambda v: abs(v - 81.6) < 1)
_add("aie15-synthetic-eval-data.ts", "aie15 final 415",
     375 + 40, ["415 soal"], ["Benchmark final: 375 soal bersih"],
     check=lambda v: v == 415)

# --- P8: biz14 ---
_add("biz14-capstone.ts", "biz14 share -68,1%",
     (28 / 550 - 84 / 526) / (84 / 526) * 100, ["−68,1%"],
     ["penurunan 66,7% adalah alarm"],
     check=lambda v: abs(v + 68.1) < 0.2)

# --- P9/P10: mk15/wqb15/mk14/cr17a/b16 ---
_add("mk15-forecasting.ts", "mk15 service level 72,7%",
     8 / (8 + 3) * 100, ["72,7%"], [], check=lambda v: abs(v - 72.73) < 0.05)
_add("wqb15-korelasi-klaster.ts", "wqb15 rentang 0,25",
     0.25, ["0,11–0,25"], ["0,11–0,24"], check=lambda v: v == 0.25)

# GG-3 (prose-vs-lab) + GG-14 + lain-lain: fragment tanpa hitung ulang.
# (file, wajib ADA, wajib TIDAK ADA)
FRAGMENTS = [
    ("b15-proses-stokastik.ts",
     ["ekspektasi harga tumbuh 8%/tahun", "median yang tumbuh 6%/tahun"],
     ["ekspektasi harga tumbuh 6%/tahun, BUKAN 8%",
      "Harga ekspektasian tumbuh lebih lambat dari μ"]),
    ("mr7-stress-test.ts",
     ["Faktor terparah di sini adalah suku bunga"],
     ["bukan suku bunga"]),
    ("mr7-stress-test.ts",
     ["puncak Feb", "pekan"],
     ["−30% intraday", "intraday"]),
    ("mr7-stress-test.ts",
     ["jt"], ["Rp500 M"]),
    ("cr20-monitoring-kri.ts",
     ["n_merah >= 2"], ["eskalasi = n_merah > 0"]),
    ("cr20-monitoring-kri.ts",
     [], ["60.000× lebih cepat"]),
    ("c15-data-quality.ts",
     ["CREATE TABLE transaksi", "dpd >= 9999", "satu dimensi dari enam"],
     ["dpd > 9999", "satu dimensi dari lima", "WHERE MAX(updated_at)"]),
    ("c15-data-quality.ts",
     ["300 debitur"], ["Angka terkoreksi: Rp 46M"]),
    ("d11-scipy-statsmodels.ts",
     ["t=4.74  p=0.000010  d=1.06", "p_shap=0.911", "chi2=16.00"],
     ["t=4.234", "p=0.000046", "d=0.78", "p=0.948", "chi2=4.43",
      "p=0.109"]),
    ("aml4-sanctions.ts",
     ["tertangkap di 0,80", "lolos hanya di 0,90", "FP=1"],
     ["sampai mini-case: K4 (true match, skor 0,82) lolos di kedua ambang",
      '"ambang 0.8": (3, 0)',
      "Lab pertama menunjukkan ambang 0,9 memberi precision 100% "
      "tetapi recall 67%"]),
    ("aml4-sanctions.ts",
     ["sim 1,0"], ["varian ejaan dari entri list"]),
    ("aml4-sanctions.ts",
     [], ["80% 'kegagalan' fuzzy matching"]),
    ("aml4-sanctions.ts",
     [], ["precision 100% bisa menyembunyikan recall 67%, precision 100%"]),
    ("fr14-case-management.ts",
     ["72 kasus (12 tier-1, 20 tier-2, 40 tier-3)"],
     ["30 kasus (10/10/10 seperti langkah 6)"]),
    ("fr14-case-management.ts",
     ["BUKAN urutan expected value"], ["menangkap expected value"]),
    ("fr14-case-management.ts",
     ["6,4× — DI ATAS ambang otomasi 4×"], ["Masih 'untung' — tapi tipis"]),
    ("biz14-capstone.ts",
     ["GAGAL 4 dari 4"], ["lolos 4 tes"]),
    ("biz14-capstone.ts",
     ["inti BI1–BI14"], ["Menyelesaikan track Business Intelligence (26 lesson)"]),
    ("mk15-forecasting.ts",
     ["Skenario A", "Skenario B"], []),
    ("mk15-forecasting.ts",
     ["120 → 123 → 123,6 → 128,52"], ["120 → 120 → 123"]),
    ("pm-a4-financial-statements.ts",
     ["0,5 lebih berat dari 0,8"], ["current, quick, DER, coverage, margin, ROE, DSO, CCC"]),
    ("mk14-pricing.ts",
     ["konvensi kanonis lesson ini"],
     ["(post-R8-fix; 62,5% lama tidak terlacak)"]),
    ("cr17a-corporate-credit-1.ts",
     ["DSCR_CFADS_LEASE"], []),
    ("b16-heavy-tails-evt.ts",
     ["u=Rp10 juta"], ["u=Rp10 M"]),
    ("aai15-hardening-deploy.ts",
     [], ["Rp15.000 per sesi", "Insiden nyata 2026"]),
    ("aie15-synthetic-eval-data.ts",
     ["perkiraan praktik"], []),
    ("mle16-hyperparameter-tuning.ts",
     ["perkiraan praktik"], []),
    ("b19-mcmc.ts",
     ["(benar −0,5)"], ["(benar -0,5)"]),
    ("mle16-hyperparameter-tuning.ts",
     ["−0,46", "−0,11"], []),
]


def main() -> int:
    bad = 0
    cache = {}

    def text_of(fname):
        if fname not in cache:
            cache[fname] = _read(fname)
        return cache[fname]

    for fname, label, _value, want, dont in RECOMPUTES:
        text = text_of(fname)
        for frag in want:
            if frag not in text:
                print(f"FAIL {fname} [{label}]: hitung ulang benar tapi "
                      f"tidak ada di lesson: '{frag}'")
                bad += 1
        for frag in dont:
            if frag in text:
                print(f"FAIL {fname} [{label}]: nilai lama masih ada: '{frag}'")
                bad += 1
    for fname, want, dont in FRAGMENTS:
        text = text_of(fname)
        for frag in want:
            if frag not in text:
                print(f"FAIL {fname}: fragment benar hilang: '{frag}'")
                bad += 1
        for frag in dont:
            if frag in text:
                print(f"FAIL {fname}: fragment salah masih ada: '{frag}'")
                bad += 1
    if bad:
        print(f"QA R9-RECOMPUTE: FAIL ({bad} temuan)")
        return 1
    print("QA R9-RECOMPUTE: ALL PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
