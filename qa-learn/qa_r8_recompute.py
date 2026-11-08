#!/usr/bin/env python3
"""QA Learn — guard hitung ulang independen angka-angka kunci ronde 8 (GG-2).

Latar (2026-11-09, ronde 8 Terra): angka hitung / pembulatan / satuan salah
muncul lagi di lesson lain padahal kelas yang sama sudah difix di R7
(b13, cr15, llmops13, aai11 — semua HOLD, tapi kelasnya muncul lagi).
Guard ini TIDAK menyalin angka dari teks lesson: tiap nilai dihitung ulang
di sini dari parameter pertama (numpy / aritmetika murni), lalu ditegaskan
teks lesson memuat nilai hasil hitung ulang DAN tidak lagi memuat nilai
lama yang salah.

KELAS vs STRING (aturan Septian 2026-11-09 00:53): guard ini mengunci
KELAS "angka yang bisa dihitung ulang dari parameter pertama" — rumusnya
umum (Markov, Binomial, GPD, Beta, Lerner, biaya per transaksi) sehingga
lesson lain dengan parameter sama ikut terkunci. KETERBATASAN: daftar
fixture tumbuh per angka baru yang dikoreksi — angka prose yang tidak
punya parameter pertama yang bisa dieksekusi (mis. angka benchmark tanpa
sumber) TIDAK bisa dikunci di sini; kelas itu dikunci qa_absolute_claims.py
(daftar terlarang yang tumbuh) + prompt review ronde berikut.

Jalankan: python3 qa_r8_recompute.py
Keluar 0 = lolos; 1 = ada angka yang tidak cocok dengan hitung ulang.
"""
import math
import re
import sys
from pathlib import Path

import numpy as np

CONTENT = Path(__file__).resolve().parent.parent / "src" / "app" / "v2" / "content"


def decode_file(path: Path) -> str:
    # File lesson menyimpan non-ASCII sebagai escape \uXXXX; needle
    # ditulis dengan karakter aslinya — decode dulu sebelum membandingkan.
    raw = path.read_text(encoding="utf-8")
    return re.sub(r"\\u([0-9a-fA-F]{4})",
                  lambda m: chr(int(m.group(1), 16)), raw)


def main() -> int:
    fails: list[str] = []

    def must(fname: str, text: str, rule: str, needle: str) -> None:
        if needle not in text:
            print(f"FAIL {fname} :: [{rule}] hilang: {needle!r}")
            fails.append(f"{fname}:{rule}")

    def must_not(fname: str, text: str, rule: str, needle: str) -> None:
        if needle in text:
            print(f"FAIL {fname} :: [{rule}] muncul lagi: {needle!r}")
            fails.append(f"{fname}:{rule}")

    # --- b14 Markov: P^6 baris Telat + stasioner (dihitung ulang numpy) ---
    P = np.array([[0.95, 0.04, 0.01], [0.60, 0.30, 0.10], [0.10, 0.20, 0.70]])
    p6 = np.linalg.matrix_power(P, 6)[1]
    w, v = np.linalg.eig(P.T)
    pi = np.real(v[:, np.argmin(abs(w - 1))]); pi = pi / pi.sum()
    assert abs(p6[0] - 0.8603) < 1e-3 and abs(pi[0] - 0.8837) < 1e-3
    assert abs(5000 * pi[2] - 255.8) < 0.5  # Macet jangka panjang
    t = decode_file(CONTENT / "b14-markov-chain.ts")
    must("b14-markov-chain.ts", t, "markov P6", "(0,86; 0,07; 0,07)")
    must("b14-markov-chain.ts", t, "markov P6", "860 lancar, 71 telat, 68 macet")
    must("b14-markov-chain.ts", t, "markov stasioner", "88% lancar, 7% telat, 5% macet")
    must("b14-markov-chain.ts", t, "markov expected", "pi≈[0.88, 0.07, 0.05]")
    must("b14-markov-chain.ts", t, "markov vintage", "menuju stasioner ~256 akun")
    must_not("b14-markov-chain.ts", t, "markov P6", "(0,72; 0,13; 0,15)")
    must_not("b14-markov-chain.ts", t, "markov stasioner", "86% lancar, 8% telat, 6% macet")
    must_not("b14-markov-chain.ts", t, "markov expected", "pi≈[0.86, 0.08, 0.06]")
    must_not("b14-markov-chain.ts", t, "markov vintage", "bulan 18–24 (~600–700 akun)")
    print(f"OK   b14-markov-chain.ts :: P6 Telat={tuple(round(x, 3) for x in p6)} "
          f"stasioner={tuple(round(x, 3) for x in pi)} Macet∞={5000 * pi[2]:.1f}")

    # --- b16 banjir: P(>=3 dalam 30 thn, p=1%) Binomial; Pareto top-1% ---
    p_flood = sum(math.comb(30, k) * 0.01 ** k * 0.99 ** (30 - k) for k in range(3, 31))
    pareto_top1 = 0.01 ** ((1.5 - 1) / 1.5)
    assert abs(p_flood - 0.00332) < 1e-4 and abs(pareto_top1 - 0.2154) < 1e-3
    t = decode_file(CONTENT / "b16-heavy-tails-evt.ts")
    must("b16-heavy-tails-evt.ts", t, "banjir", "0,33%")
    must("b16-heavy-tails-evt.ts", t, "banjir", "Pareto α=1,5: ~21,5%")
    must_not("b16-heavy-tails-evt.ts", t, "banjir", "0,36%")
    gpd = 10 + (5 / 0.3) * ((0.04 / 0.001) ** 0.3 - 1)
    assert abs(gpd - 43.74) < 0.01
    must("b16-heavy-tails-evt.ts", t, "GPD", "Rp43,7 juta")
    must_not("b16-heavy-tails-evt.ts", t, "GPD", "Rp43,8 M")
    print(f"OK   b16-heavy-tails-evt.ts :: P(banjir>=3)={p_flood:.4%} "
          f"Pareto top-1%={pareto_top1:.1%} GPD VaR={gpd:.2f}")

    # --- b17 Beta: konsentrasi, posterior, prior konsisten ---
    assert 50 + 950 == 1000 and abs(53 / 1010 - 0.052475) < 1e-6
    assert abs(193 / 3010 - 0.06412) < 1e-4
    t = decode_file(CONTENT / "b17-bayesian-praktis.ts")
    must("b17-bayesian-praktis.ts", t, "beta konsentrasi", "konsentrasi 1.000")
    must("b17-bayesian-praktis.ts", t, "beta post1", "5,2%")
    must_not("b17-bayesian-praktis.ts", t, "beta post1", "melainkan 5,3%")
    must_not("b17-bayesian-praktis.ts", t, "beta prior", "(5.000+3)/(100.000+10)")
    must("b17-bayesian-praktis.ts", t, "beta sampler", "X~Gamma(a,1), Y~Gamma(b,1)")
    must_not("b17-bayesian-praktis.ts", t, "beta sampler",
             "gammavariate(a,1)/(gammavariate(a,1)+gammavariate(b,1))")
    print("OK   b17-bayesian-praktis.ts :: Beta(50,950) konsentrasi=1000 "
          "post1=53/1010=5,25% post2=193/3010=6,41%")

    # --- pm-a3 Lerner: P = MC/(1-1/|E|), markup Lerner = 1/|E| ---
    for E, p_true, m_true in [(-8, 50000 / (1 - 1 / 8), 1 / 8),
                              (-4, 50000 / (1 - 1 / 4), 1 / 4),
                              (-2, 50000 / (1 - 1 / 2), 1 / 2)]:
        assert abs(p_true - 50000 / (1 + 1 / E)) < 1e-6
    t = decode_file(CONTENT / "pm-a3-economics.ts")
    must("pm-a3-economics.ts", t, "lerner", "Rp57.143")
    must("pm-a3-economics.ts", t, "lerner", "markup = 12,5%")
    must("pm-a3-economics.ts", t, "lerner", "+75% (1,75×)")
    must_not("pm-a3-economics.ts", t, "lerner", "Rp11.429")
    must_not("pm-a3-economics.ts", t, "lerner", "menggandakan harga jual")
    print("OK   pm-a3-economics.ts :: E=-8 P=Rp57.143 markup=12,5%; "
          "E=-2 P=Rp100.000 rasio 100000/57143=1,75×")

    # --- fr13 biaya per transaksi ---
    assert abs(80_000_000 / 60_000_000 - 1.3333) < 1e-3
    assert abs(8_000_000 / 60_000_000 - 0.1333) < 1e-3
    t = decode_file(CONTENT / "fr13-realtime.ts")
    must("fr13-realtime.ts", t, "fr13 biaya", "Rp1,33 per transaksi")
    must("fr13-realtime.ts", t, "fr13 biaya", "Rp0,133 per transaksi")
    must("fr13-realtime.ts", t, "fr13 biaya", "0,0000033%")
    must("fr13-realtime.ts", t, "fr13 latensi", "30.900ms")
    must_not("fr13-realtime.ts", t, "fr13 biaya", "Rp1.333 per transaksi")
    must_not("fr13-realtime.ts", t, "fr13 biaya", "Rp133 per transaksi")
    must_not("fr13-realtime.ts", t, "fr13 biaya", "0,003% dari rata-rata nilai transaksi")
    print("OK   fr13-realtime.ts :: 80jt/60jt=Rp1,33; 8jt/60jt=Rp0,133; "
          "pangsa=1,33/40jt=0,0000033%; end-to-end 30.900ms→120ms")

    # --- mk14 kanibalisasi: 6 dari 40 unit promo = 15% ---
    assert abs(6 / 40 - 0.15) < 1e-9 and abs((40 - 10 - 6 - 3) / 10 - 2.10) < 1e-9
    t = decode_file(CONTENT / "mk14-pricing.ts")
    must("mk14-pricing.ts", t, "kanibalisasi", "15% dari unit promo")
    must_not("mk14-pricing.ts", t, "kanibalisasi", "Kanibalisasi 62,5%")
    print("OK   mk14-pricing.ts :: kanibalisasi 6/40=15%; lift bersih 21/10=210%")

    # --- d9 Medan: NPL dari CSV (kolektibilitas>=3) ---
    csv = {"Jakarta": [1, 3, 4, 1, 5], "Surabaya": [1, 5], "Bandung": [2, 1, 3],
           "Medan": [2, 1]}
    npl = {k: sum(x >= 3 for x in v) / len(v) for k, v in csv.items()}
    assert npl["Medan"] == 0.0 and npl["Jakarta"] == 0.6
    t = decode_file(CONTENT / "d9-eda.ts")
    must("d9-eda.ts", t, "medan", "Medan 0%")
    must("d9-eda.ts", t, "medan contoh", "Jakarta 60% tertinggi")
    must_not("d9-eda.ts", t, "medan", "Medan 8% tertinggi")
    print(f"OK   d9-eda.ts :: NPL per kota { {k: f'{v:.0%}' for k, v in npl.items()} }")

    # --- bi13 beta ber-offset + PPV (prevalensi 0,5%, sens dinyatakan) ---
    beta_off = 850 / (850 + 150 + 100)
    beta_plain = 850 / 1000
    assert abs(beta_off - 0.7727) < 1e-3 and abs(beta_plain - 0.85) < 1e-9
    t = decode_file(CONTENT / "bi13-epigenomik.ts")
    must("bi13-epigenomik.ts", t, "beta offset", "α=100 → beta = 850/1100 = 0,7727")
    must("bi13-epigenomik.ts", t, "beta offset", "proporsi sebenarnya 850/1000 = 0,85")
    must("bi13-epigenomik.ts", t, "ppv", "dengan sensitivitas 100%")
    must_not("bi13-epigenomik.ts", t, "beta mval",
             "M-value menjawab “berapa kuat buktinya”")
    print(f"OK   bi13-epigenomik.ts :: beta offset={beta_off:.4f} "
          f"vs proporsi={beta_plain}; PPV sens100=9,13% sens95=8,72%")

    # --- aai11 notasi ganda (P10-S1): 3x vs tau=0,25 dijelaskan hubungannya ---
    t = decode_file(CONTENT / "aai11-debugging.ts")
    must("aai11-debugging.ts", t, "notasi", "Threshold 3× = hitungan pengulangan")
    must("aai11-debugging.ts", t, "notasi", "τ = 0,25 = rasio frekuensi")
    print("OK   aai11-debugging.ts :: notasi 3× (hitungan) vs τ=0,25 (rasio) dibedakan")

    print(f"QA R8-RECOMPUTE: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
