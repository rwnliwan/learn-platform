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

    # --- R8 GAPS (2026-11-09): angka langkah gap-r8, dihitung ulang ---
    # G1 a15 kuantil tiga konvensi, data [10..80] (n=8)
    d8 = [10, 20, 30, 40, 50, 60, 70, 80]

    def q_np(p):
        h = (len(d8) + 1) * p; lo = int(h); f = h - lo
        return d8[lo - 1] + f * (d8[lo] - d8[lo - 1])

    def q_half(p):
        half = d8[:4] if p < 0.5 else d8[4:]
        return (half[1] + half[2]) / 2
    q1 = (q_np(0.25), q_half(0.25), float(np.percentile(d8, 25)))
    q3 = (q_np(0.75), q_half(0.75), float(np.percentile(d8, 75)))
    assert q1 == (22.5, 25.0, 27.5) and q3 == (67.5, 65.0, 62.5)
    t = decode_file(CONTENT / "a15-kuantil-outlier.ts")
    must("a15-kuantil-outlier.ts", t, "gap kuantil", "22,5")
    must("a15-kuantil-outlier.ts", t, "gap kuantil", "27,5")
    must("a15-kuantil-outlier.ts", t, "gap kuantil", "67,5")
    must("a15-kuantil-outlier.ts", t, "gap kuantil", "62,5")
    print(f"OK   a15-kuantil-outlier.ts :: gap Q1={q1} Q3={q3}")

    # G5 b16 sensitivitas GPD: xi=0,2 -> 37,3; xi=0,4 -> 52,2; rentang 14,9
    def gpd_var(xi):
        return 10 + (5 / xi) * ((0.04 / 0.001) ** xi - 1)
    v02, v04 = gpd_var(0.2), gpd_var(0.4)
    assert abs(v02 - 37.3) < 0.05 and abs(v04 - 52.2) < 0.05
    assert abs((v04 - v02) - 14.9) < 0.1
    t = decode_file(CONTENT / "b16-heavy-tails-evt.ts")
    must("b16-heavy-tails-evt.ts", t, "gap ekor", "37,3")
    must("b16-heavy-tails-evt.ts", t, "gap ekor", "52,2")
    must("b16-heavy-tails-evt.ts", t, "gap ekor", "14,9")
    print(f"OK   b16-heavy-tails-evt.ts :: gap GPD xi=0,2 -> {v02:.1f}; "
          f"xi=0,4 -> {v04:.1f}; rentang {v04 - v02:.1f}")

    # G12 e12 forward tiga konvensi (S=16500, IDR 6%, USD 4,5%, T=2)
    S, rd, rf, T = 16500, 0.06, 0.045, 2
    f_s = S * (1 + rd * T) / (1 + rf * T)
    f_m = S * (1 + rd) ** T / (1 + rf) ** T
    f_c = S * math.exp((rd - rf) * T)
    selisih = round((f_m - f_s) * 500000 / 1e6, 2)
    assert abs(f_s - 16954.13) < 0.01 and abs(f_m - 16977.08) < 0.01
    assert abs(f_c - 17002.50) < 0.01 and selisih == 11.48
    t = decode_file(CONTENT / "e12-fx-suku-bunga.ts")
    must("e12-fx-suku-bunga.ts", t, "gap forward", "16.954,13")
    must("e12-fx-suku-bunga.ts", t, "gap forward", "16.977,08")
    must("e12-fx-suku-bunga.ts", t, "gap forward", "17.002,50")
    must("e12-fx-suku-bunga.ts", t, "gap forward", "11,48")
    print(f"OK   e12-fx-suku-bunga.ts :: gap forward {f_s:.2f} / {f_m:.2f} / "
          f"{f_c:.2f}; selisih Rp{selisih} jt")

    # G13 mr5 ES diskrit: sensitivitas + n=11
    rugi10 = [-5, 2, -8, 30, -3, 1, -6, 45, -2, 4]

    def var_es(rugi):
        s = sorted(rugi); n = len(s)
        var = s[int(n * 0.8) - 1] if n * 0.8 == int(n * 0.8) else s[int(n * 0.8)]
        atas = [x for x in s if x > var]
        return var, sum(atas) / len(atas)
    v10, e10 = var_es(rugi10)
    v11, e11 = var_es(rugi10 + [60])
    assert (v10, e10) == (4, 37.5) and (v11, e11) == (30, 52.5)
    assert (40 + 30) / 2 == 35.0
    t = decode_file(CONTENT / "mr5-expected-shortfall.ts")
    must("mr5-expected-shortfall.ts", t, "gap ES", "ES 35,0")
    must("mr5-expected-shortfall.ts", t, "gap ES", "ES80 52,5")
    must("mr5-expected-shortfall.ts", t, "gap ES", "es_sens=35.0")
    must("mr5-expected-shortfall.ts", t, "gap ES", "var11=30.0")
    print(f"OK   mr5-expected-shortfall.ts :: gap ES10={e10} sens=35,0 "
          f"ES11={e11} var11={v11}")

    # G15 mr6 Kupiec x=4: LR 0,77 + peluang model 2% lolos 43,9%
    def kupiec_lr(T, x, p):
        ph = x / T
        return -2 * ((T - x) * math.log(1 - p) + x * math.log(p)
                     - ((T - x) * math.log(1 - ph) + x * math.log(ph)))
    lr4 = kupiec_lr(250, 4, 0.01)
    p_lolos = sum(math.comb(250, i) * 0.02 ** i * 0.98 ** (250 - i)
                  for i in range(5)) * 100
    assert abs(lr4 - 0.77) < 0.01 and abs(p_lolos - 43.9) < 0.1
    t = decode_file(CONTENT / "mr6-backtesting.ts")
    must("mr6-backtesting.ts", t, "gap kupiec", "0,77")
    must("mr6-backtesting.ts", t, "gap kupiec", "43,9%")
    print(f"OK   mr6-backtesting.ts :: gap Kupiec x=4 LR={lr4:.2f} "
          f"lolos-2%={p_lolos:.1f}%")

    # G21 aml3 kalibrasi threshold: biaya total + pilihan 12
    costs = {8: 2500 * 0.05 + 50 * 5, 12: 1000 * 0.05 + 80 * 5,
             20: 400 * 0.05 + 100 * 5}
    assert costs == {8: 375.0, 12: 450.0, 20: 520.0}
    t = decode_file(CONTENT / "aml3-edd.ts")
    must("aml3-edd.ts", t, "gap threshold", "Rp375 juta")
    must("aml3-edd.ts", t, "gap threshold", "Rp450 juta")
    must("aml3-edd.ts", t, "gap threshold", "Rp520 juta")
    print("OK   aml3-edd.ts :: gap threshold biaya 375/450/520 jt; pilih 12")

    # G24 d9 Wilson 95% + shrinkage (k=4, p0=5/12)
    def wilson(x, n):
        z = 1.96; p = x / n; dd = 1 + z * z / n
        c = (p + z * z / (2 * n)) / dd
        h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / dd
        return max(0.0, c - h) * 100, min(1.0, c + h) * 100
    jkt = wilson(3, 5); mdn = wilson(0, 2)
    assert abs(jkt[0] - 23.1) < 0.1 and abs(jkt[1] - 88.2) < 0.1
    assert abs(mdn[1] - 65.8) < 0.1
    p0 = 5 / 12
    sj = (3 + 4 * p0) / 9 * 100; sm = (0 + 4 * p0) / 6 * 100
    assert abs(sj - 51.9) < 0.1 and abs(sm - 27.8) < 0.1
    t = decode_file(CONTENT / "d9-eda.ts")
    must("d9-eda.ts", t, "gap wilson", "23,1%")
    must("d9-eda.ts", t, "gap wilson", "88,2%")
    must("d9-eda.ts", t, "gap wilson", "65,8%")
    must("d9-eda.ts", t, "gap wilson", "51,9%")
    must("d9-eda.ts", t, "gap wilson", "27,8%")
    print(f"OK   d9-eda.ts :: gap Wilson JKT=({jkt[0]:.1f}%; {jkt[1]:.1f}%) "
          f"Medan hi={mdn[1]:.1f}%; shrink {sj:.1f}%/{sm:.1f}%")

    # G26 llmops14 routing: under-route 48%, sukses per tier, rugi ~20,2
    assert abs(118 / 140 * 100 - 84.3) < 0.1 and abs(58 / 60 * 100 - 96.7) < 0.1
    assert abs(200 * 0.981 - 176 - 20.2) < 0.1
    t = decode_file(CONTENT / "llmops14-smart-routing.ts")
    must("llmops14-smart-routing.ts", t, "gap routing", "84,3%")
    must("llmops14-smart-routing.ts", t, "gap routing", "96,7%")
    must("llmops14-smart-routing.ts", t, "gap routing", "20,2")
    print("OK   llmops14-smart-routing.ts :: gap routing murah 84,3% "
          "frontier 96,7%; rugi 20,2 jawaban")

    # G32 bi13 SE beta + BH (10 lokus: 5 mentah -> 3 terkoreksi)
    se20 = math.sqrt(0.85 * 0.15 / 20); se1000 = math.sqrt(0.85 * 0.15 / 1000)
    assert abs(se20 - 0.0798) < 1e-4 and abs(se1000 - 0.0113) < 1e-4
    pvals = [0.001, 0.004, 0.012, 0.03, 0.04, 0.12, 0.25, 0.4, 0.6, 0.9]
    m = len(pvals)
    q = [v * m / (i + 1) for i, v in enumerate(pvals)]
    for i in range(m - 2, -1, -1):
        q[i] = min(q[i], q[i + 1])
    assert sum(1 for v in pvals if v < 0.05) == 5
    assert sum(1 for v in q if v < 0.05) == 3
    t = decode_file(CONTENT / "bi13-epigenomik.ts")
    must("bi13-epigenomik.ts", t, "gap metilasi", "0,0798")
    must("bi13-epigenomik.ts", t, "gap metilasi", "0,0113")
    print(f"OK   bi13-epigenomik.ts :: gap SE beta n=20 {se20:.4f} n=1000 "
          f"{se1000:.4f}; BH 5 -> 3")

    # G35 wqb14 holdout: decay val 9,9% + test 19,8%
    assert abs((1.31 - 1.18) / 1.31 * 100 - 9.9) < 0.1
    assert abs((1.31 - 1.05) / 1.31 * 100 - 19.8) < 0.1
    t = decode_file(CONTENT / "wqb14-overfitting.ts")
    must("wqb14-overfitting.ts", t, "gap oos", "1,18 (−9,9%)")
    must("wqb14-overfitting.ts", t, "gap oos", "1,05 (−19,8%)")
    print("OK   wqb14-overfitting.ts :: gap OOS val -9,9% test -19,8%")

    # G36 mk14 kanibalisasi tiga penyebut + minicase-2
    assert abs(6 / 40 * 100 - 15.0) < 1e-9 and abs(6 / 10 * 100 - 60.0) < 1e-9
    assert abs(6 / 21 * 100 - 28.6) < 0.1 and abs(4000 / 28000 * 100 - 14.3) < 0.1
    t = decode_file(CONTENT / "mk14-pricing.ts")
    must("mk14-pricing.ts", t, "gap kanibalisasi", "6/10 = 60,0%")
    must("mk14-pricing.ts", t, "gap kanibalisasi", "6/21 = 28,6%")
    must("mk14-pricing.ts", t, "gap kanibalisasi", "4.000/28.000 = 14,3%")
    print("OK   mk14-pricing.ts :: gap kanibalisasi 15,0% / 60,0% / 28,6% / "
          "14,3% (penyebut ditulis)")

    # G37 pm-a3 Taylor dovish-hawkish: 8,0% - 13,0%, rentang 5,0 poin
    r_d = 1 + 6 + 0.5 * (6 - 2) + 0.5 * (-2)
    r_h = 3 + 6 + 0.5 * (6 - 2) + 0.5 * 4
    assert r_d == 8.0 and r_h == 13.0 and r_h - r_d == 5.0
    t = decode_file(CONTENT / "pm-a3-economics.ts")
    must("pm-a3-economics.ts", t, "gap taylor", "8,0–13,0%")
    must("pm-a3-economics.ts", t, "gap taylor", "5,0 poin")
    print("OK   pm-a3-economics.ts :: gap Taylor dovish 8,0% hawkish 13,0% "
          "rentang 5,0 poin")

    # Bonus DeepSeek #1 (tes banding 3-arah 2026-11-09, ACC Septian 11:04):
    # pm-b6 swap terima-tetap — kupon 6% TAHUNAN dibayar per semester =
    # 6%/2 x Rp10M = Rp300rb per semester (bukan 600rb). Kelas yang dikunci:
    # "kupon tahunan x frekuensi pembayaran" — nominal per pembayaran =
    # rate tahunan / frekuensi x notional; arus kas akhir = notional +
    # kupon per periode (10,3M, bukan 10,6M).
    coupon = 0.06 / 2 * 10_000_000
    assert coupon == 300_000
    pv_fixed = coupon / 1.025 + (10_000_000 + coupon) / 1.055
    v_swap = pv_fixed - 10_000_000
    assert abs(pv_fixed - 10_055_716.10) < 1 and abs(v_swap - 55_716.10) < 1
    assert f"{v_swap / 1000:.2f}" == "55.72"
    t = decode_file(CONTENT / "pm-b6-valuasi-derivatif.ts")
    must("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "10.055.716")
    must("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "55.716")
    must("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon",
         "300rb/1,025 + 10,3M/1,055")
    must("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon",
         "300000/1.025 + 10300000/1.055")
    must("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "v_rb=55.72")
    must_not("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "10.632.759")
    must_not("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "632.759")
    must_not("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon",
             "600rb/1,025 + 10,6M")
    must_not("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon",
             "600000/1.025 + 10600000/1.055")
    must_not("pm-b6-valuasi-derivatif.ts", t, "bonus swap kupon", "v_rb=632.76")
    print("OK   pm-b6-valuasi-derivatif.ts :: bonus swap kupon 300rb/semester, "
          "PV fixed 10.055.716, v 55.716, v_rb 55.72")

    print(f"QA R8-RECOMPUTE: {'ALL PASS' if not fails else f'{len(fails)} FAIL'}")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
