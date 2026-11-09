#!/usr/bin/env python3
"""QA Learn — hitung ulang independen angka-angka kunci ronde 7 (R7).

Latar: qa_learn_numbers.py mengunci angka-angka yang dikoreksi di fix R7
sebagai fixture string. Fixture saja tidak membuktikan angkanya BENAR —
file ini menghitung ulang tiap angka dari parameter pertama (rumus + data
masukan lesson, BUKAN dari teks lesson) dan menegaskan hasilnya cocok
dengan nilai yang dikunci fixture. Bila suatu angka di lesson berubah di
masa depan, guard ini yang pertama berteriak — bukan reviewer ronde
berikutnya.

Hanya pustaka standar (math, statistics) — tanpa numpy/scipy — supaya
guard bisa jalan di mana saja. Setiap fungsi mengembalikan nilai dan
`main()` menegaskan semuanya; keluar 0 = semua cocok.

Jalankan: python3 qa_r7_recompute.py
"""
import math
import statistics

_ND = statistics.NormalDist()
PHI = _ND.cdf          # CDF normal baku
PHI_INV = _ND.inv_cdf  # kuantil normal baku

FAILURES: list[str] = []


def check(name: str, got: float, want: float, tol: float) -> None:
    ok = abs(got - want) <= tol
    print(f"  {'OK ' if ok else 'FAIL'} {name}: hitung={got:.6g} lesson={want:.6g} (tol {tol:g})")
    if not ok:
        FAILURES.append(name)


# --- Vasicek (b13): SD jumlah gagal & kuantil -------------------------------
def _p_given_y(y: float, pd: float, rho: float) -> float:
    return PHI((PHI_INV(pd) - math.sqrt(rho) * y) / math.sqrt(1 - rho))


def _e_p2(pd: float, rho: float) -> float:
    """E[p(Y)^2] dengan kuadratur Simpson atas Y ~ N(0,1), y in [-6, 6]."""
    a, b, n = -6.0, 6.0, 12000
    h = (b - a) / n
    s = 0.0
    for i in range(n + 1):
        y = a + i * h
        w = 1 if i in (0, n) else (4 if i % 2 else 2)
        s += w * _p_given_y(y, pd, rho) ** 2 * math.exp(-y * y / 2) / math.sqrt(2 * math.pi)
    return s * h / 3


def vasicek_sd(n: int, pd: float, rho: float) -> tuple[float, float, float]:
    """SD jumlah gagal + SD binomial + rasio. Rumus: Var = n*pd*(1-pd) *
    [1 + (n-1)*rho_ind], rho_ind = (E[p^2] - pd^2) / (pd*(1-pd))."""
    joint = _e_p2(pd, rho)
    rho_ind = (joint - pd * pd) / (pd * (1 - pd))
    var = n * pd * (1 - pd) * (1 + (n - 1) * rho_ind)
    sd_bin = math.sqrt(n * pd * (1 - pd))
    return math.sqrt(var), sd_bin, math.sqrt(var) / sd_bin


def vasicek_q(pd: float, rho: float, alpha: float) -> float:
    """Kuantil Vasicek: Phi((Phi^-1(pd) + sqrt(rho)*Phi^-1(alpha)) / sqrt(1-rho))."""
    return PHI((PHI_INV(pd) + math.sqrt(rho) * PHI_INV(alpha)) / math.sqrt(1 - rho))


# --- Cornish-Fisher (mr4) ----------------------------------------------------
def cornish_fisher(z: float, skew: float, kurt: float) -> float:
    return (z + (z * z - 1) * skew / 6
            + (z ** 3 - 3 * z) * kurt / 24
            - (2 * z ** 3 - 5 * z) * skew * skew / 36)


# --- Kupiec / binomial (e13) -------------------------------------------------
def binom_tail(n: int, p: float, k_min: int) -> float:
    return sum(math.comb(n, k) * p ** k * (1 - p) ** (n - k)
               for k in range(k_min, n + 1))


def kupiec_lr(n: int, x: int, p: float) -> float:
    l0 = (1 - p) ** (n - x) * p ** x
    ph = x / n
    l1 = (1 - ph) ** (n - x) * ph ** x
    return -2 * math.log(l0 / l1)


# --- Hill / MMM (mk13) --------------------------------------------------------
def hill_response(spend: float, vmax: float, a: float, k: float) -> float:
    return vmax * spend ** a / (spend ** a + k ** a)


def main() -> int:
    print("QA R7-RECOMPUTE: hitung ulang independen angka kunci ronde 7")

    # b13 — Vasicek SD: n=500, PD=2%, rho_aset=0,15 (R1/R2: Terra 27,3 & 9,4 SALAH)
    sd, sd_bin, ratio = vasicek_sd(500, 0.02, 0.15)
    check("b13 SD gagal (n=500, PD=2%, rho=0,15)", sd, 11.35, 0.05)
    check("b13 SD binomial", sd_bin, 3.13, 0.01)
    check("b13 rasio SD/binomial", ratio, 3.63, 0.02)
    # b13/cr15 — kuantil Vasicek 99,9% (R3: Terra 24,9/13,5% SALAH)
    check("cr15 q99,9 PD=2% rho=24%", vasicek_q(0.02, 0.24, 0.999) * 100, 26.79, 0.05)
    check("cr15 q99,9 PD=2% rho=12%", vasicek_q(0.02, 0.12, 0.999) * 100, 14.73, 0.05)
    check("b13 q99,9 PD=2% rho=15%", vasicek_q(0.02, 0.15, 0.999) * 100, 17.63, 0.05)
    # b13 — q90 PD=3% memuncak lalu TURUN (tidak ada rho yang mencapai 11%)
    qs = [(r / 100, vasicek_q(0.03, r / 100, 0.90) * 100) for r in range(1, 100)]
    r_max, q_max = max(qs, key=lambda t: t[1])
    check("b13 q90 PD=3% maksimum", q_max, 8.43, 0.05)
    assert 0.40 <= r_max <= 0.52, f"puncak q90 di rho={r_max} (lesson: ~0,46)"
    print(f"  OK  b13 q90 PD=3% puncak di rho={r_max:.2f} (lesson: ~0,46)")
    check("b13 q90 PD=3% rho=0,9", vasicek_q(0.03, 0.9, 0.90) * 100, 1.77, 0.05)

    # llmops13 — break-even & NusaBank
    check("llmops13 break-even Q*", 8450 / 0.0048, 1_760_417, 1)
    check("llmops13 NusaBank API/tahun", (11 * 2_000_000 + 10_000_000) * 0.005, 160_000, 1)
    check("llmops13 hybrid hemat", (160_000 - 94_000) / 160_000 * 100, 41.25, 0.01)
    check("llmops13 10jt/bulan vs break-even", 10_000_000 / (8450 / 0.0048), 5.68, 0.02)

    # aml1 — ekonomi triase
    check("aml1 biaya/review", 5 * 15_000_000 / 4500, 16_667, 1)
    check("aml1 review-all 36rb review", 36_000 * (5 * 15_000_000 / 4500), 600_000_000, 1)
    # Rp126 MILIAR batas atas vs Rp600 juta biaya: 126e9/600e6 = 210
    check("aml1 rasio biaya:risiko 1 banding", 126_000_000_000 / 600_000_000, 210, 0.01)

    # aai11 — total tanpa detektor & hemat (R6 double-count Rp25.500 SALAH)
    total = 47 * 607
    check("aai11 total tanpa detektor 47x607", total, 28_529, 1)
    check("aai11 hemat bulan 1", 100 * total - 303_500 - 600_000, 1_949_400, 1)
    check("aai11 hemat bulan 2+", 100 * total - 303_500, 2_549_400, 1)
    check("aai11 25 tugas tanpa detektor", 25 * total, 713_225, 1)
    check("aai11 selisih 25 tugas", 25 * total - 25 * 3_035, 637_350, 1)
    check("aai11 ROI tahun 1", (12 * 2_549_400 + 13_500_000) / 9_600_000, 4.59, 0.02)
    check("aai11 nilai total tahun 1 (jt)", (12 * 2_549_400 + 13_500_000) / 1e6, 44.1, 0.05)

    # mk13 — all-in & marginal Hill (a=2, h=Rp1jt)
    tv_gain = (hill_response(500_000_000, 500_000_000, 2, 300_000_000)
               - hill_response(400_000_000, 500_000_000, 2, 300_000_000)) / 1e6
    dg_gain = (hill_response(180_000_000, 300_000_000, 2, 100_000_000)
               - hill_response(80_000_000, 300_000_000, 2, 100_000_000)) / 1e6
    check("mk13 all-in TV +Rp100jt", tv_gain, 47.65, 0.05)
    check("mk13 all-in Digital +Rp100jt", dg_gain, 112.17, 0.05)
    h = 1_000_000
    tv_marg = (hill_response(400_000_000 + h, 500_000_000, 2, 300_000_000)
               - hill_response(400_000_000, 500_000_000, 2, 300_000_000)) / h
    dg_marg = (hill_response(80_000_000 + h, 300_000_000, 2, 100_000_000)
               - hill_response(80_000_000, 300_000_000, 2, 100_000_000)) / h
    check("mk13 marginal TV", tv_marg, 0.57, 0.02)
    check("mk13 marginal Digital", dg_marg, 1.78, 0.02)

    # cr13 — EAD & CKPN
    check("cr13 EAD 700M x CCF 60%", 700_000_000 * 0.60, 420_000_000, 1)
    check("cr13 CKPN contoh 3%x45%x14jt", 0.03 * 0.45 * 14_000_000, 189_000, 1)
    check("cr13 8% x 420M", 0.08 * 420_000_000, 33_600_000, 1)

    # cr15 — EL vs UL, VaR LGD 45% atas EAD Rp10T
    check("cr15 EL A 9%x50%x1300M", 0.09 * 0.5 * 1_300_000_000, 58_500_000, 1)
    check("cr15 EL B 3%x40%x1300M", 0.03 * 0.4 * 1_300_000_000, 15_600_000, 1)
    check("cr15 delta EL", 58_500_000 - 15_600_000, 42_900_000, 1)
    check("cr15 pangsa 1300/20500 %", 1300 / 20500 * 100, 6.34, 0.01)
    check("cr15 VaR rho=24% (T)", vasicek_q(0.02, 0.24, 0.999) * 0.45 * 10e12 / 1e12, 1.21, 0.02)
    check("cr15 VaR rho=12% (T)", vasicek_q(0.02, 0.12, 0.999) * 0.45 * 10e12 / 1e12, 0.66, 0.02)

    # cr16 — titik mati KPMM 8% (modal 5200, RWA 40000, NPL awal 2,5%)
    def kpmm(npl: float) -> float:
        ckpn = (npl - 0.025) * 50000 * 0.60
        return (5200 - ckpn) / (40000 * (1 + (npl - 0.025) * 3)) * 100
    check("cr16 KPMM NPL 5% (ringan)", kpmm(0.05), 10.35, 0.01)
    check("cr16 KPMM NPL 10% (berat)", kpmm(0.10), 6.02, 0.01)
    check("cr16 KPMM NPL 7,5%", kpmm(0.075), 8.04, 0.01)
    check("cr16 KPMM NPL 8%", kpmm(0.08), 7.6, 0.05)
    lo, hi = 0.025, 0.15
    for _ in range(60):  # bisection: KPMM turun terhadap NPL
        mid = (lo + hi) / 2
        if kpmm(mid) > 8:
            lo = mid
        else:
            hi = mid
    npl_mati = (lo + hi) / 2 * 100
    check("cr16 NPL titik mati (2,5% + d)", npl_mati, 7.55, 0.05)

    # cr14a — staging memengaruhi ECL
    check("cr14a ECL Stage 2 (jt)", 0.07 * 38 + 0.03 * 225, 9.41, 0.01)
    check("cr14a ECL Stage 1 (jt)", 0.90 * 4.5, 4.05, 0.01)
    check("cr14a rasio Stage2/Stage1", 9.41 / 4.05, 2.32, 0.01)

    # b12 — SE rata-rata P&L: analitik (lognormal) vs simulasi seed 124
    mu, sigma, s0, n_mc = 0.0005, 0.02, 10_000, 5000
    var_pl = (math.exp(sigma ** 2) - 1) * math.exp(2 * mu + sigma ** 2) * s0 ** 2
    check("b12 se_mean analitik SD/sqrt(N)", math.sqrt(var_pl) / math.sqrt(n_mc), 2.83, 0.05)
    import random
    random.seed(124)
    pl = [s0 * math.exp(random.gauss(mu, sigma)) - s0 for _ in range(n_mc)]
    check("b12 se_mean simulasi seed 124", statistics.stdev(pl) / math.sqrt(n_mc), 2.82, 0.05)

    # e13 — backtesting VaR 99%: 5 jebol dari 100 hari
    check("e13 P(X>=5 | Bin(100, 1%))", binom_tail(100, 0.01, 5), 0.0034, 0.0005)
    check("e13 Kupiec LR (5/100 vs 1%)", kupiec_lr(100, 5, 0.01), 8.26, 0.05)

    # fr12 — sinkronisitas 4 transfer dalam 35 menit dari 30 hari
    p_sync = (35 / 43200) ** 3
    check("fr12 P sinkronisitas", p_sync, 5.32e-10, 0.05e-10)
    check("fr12 1 banding (miliar)", 1 / p_sync / 1e9, 1.88, 0.05)
    check("fr12 ekspektasi/bulan (8jt trx)", 8_000_000 * p_sync, 0.00426, 0.0002)
    check("fr12 sekali dalam (tahun)", 1 / (8_000_000 * p_sync) / 12, 19.6, 0.5)

    # c13 — NPL plafon & jalur roll-rate
    check("c13 NPL plafon 180/775 %", 180 / 775 * 100, 23.23, 0.01)
    check("c13 PD satu jalur", 0.35 * 0.45 * 0.55 * 0.70, 0.0606, 0.0001)

    # mr4 — Cornish-Fisher (z=-2,33, S=-0,8, K=3) & kelipatan VaR
    z_cf = cornish_fisher(-2.33, -0.8, 3.0)
    check("mr4 |z_CF|", abs(z_cf), 3.39, 0.02)
    check("mr4 VaR CF (jt)", 200_000_000 * 0.012 * abs(z_cf) / 1e6, 8.13, 0.05)
    check("mr4 VaR normal (jt)", 200_000_000 * 0.012 * 2.33 / 1e6, 5.59, 0.01)
    check("mr4 kelipatan 2100/95", 2100 / 95, 22.11, 0.01)

    # rr11 — FIG: y=240 <-> 3,0%, skala 60px per pp
    def fig_y(y: float) -> float:
        return 3.0 + (240 - y) / 60
    check("rr11 FIG severe y=120", fig_y(120), 5.0, 0.01)
    check("rr11 FIG adverse y=168", fig_y(168), 4.2, 0.01)
    check("rr11 FIG baseline y=216", fig_y(216), 3.4, 0.01)

    # mle11 — mean/median/p95 daftar latensi (24 observasi, jumlah 1140)
    check("mle11 rata-rata 1140/24", 1140 / 24, 47.5, 0.01)
    check("mle11 1/24 di atas 150ms %", 1 / 24 * 100, 4.17, 0.05)
    check("mle11 median konvensional (23+24)/2", (23 + 24) / 2, 23.5, 0.01)

    # pm-a2 — PV anuitas 240 bulan, r=7%/12, PMT Rp15jt
    r, n_pay, pmt = 0.07 / 12, 240, 15_000_000
    pv = pmt * (1 - (1 + r) ** -n_pay) / r
    check("pm-a2 PV anuitas", pv, 1_934_737_597, 2_000_000)
    check("pm-a2 lump sum menang (jt)", (2_000_000_000 - pv) / 1e6, 65.26, 0.5)

    # wqb13 / hd12 / mle12 / aai13 / a13 — rasio & pangkat sederhana
    check("wqb13 rho^2 0,94^2", 0.94 ** 2, 0.8836, 0.0001)
    check("hd12 Brier baseline 4%x96%", 0.04 * 0.96, 0.0384, 0.0001)
    check("hd12 0,6^2 (prediksi 60% salah, outcome 0)", 0.6 ** 2, 0.36, 0.001)
    check("mle12 FNR 60%/15%", 60 / 15, 4.0, 0.01)
    check("mle12 recall S4 0,8x85+0,2x40", 0.8 * 85 + 0.2 * 40, 76, 0.01)
    check("aai13 80/24 koneksi", 80 / 24, 3.33, 0.01)
    check("aai13 hemat rerank/hari", 20_000 * 0.06 * 500, 600_000, 1)
    check("aai13 KV cache GiB", 13_421_772_800 / 1024 ** 3, 12.5, 0.01)
    check("a13 rasio SD 1,842/0,158", 1.842 / 0.158, 11.66, 0.01)

    # --- Build gap ronde 7 Terra (2026-11-09, 23 langkah gap-r7-*) ---
    # Hitung ulang independen tiap angka kunci lab gap dari parameter
    # pertama (rumus + data masukan lesson). Simulasi memakai seed yang
    # sama dengan yang dinyatakan lesson — seed adalah bagian dari desain.
    import random

    # P1-G1 a12 — modus jamak [7,8,8,9,9,10,12]
    g = [7, 8, 8, 9, 9, 10, 12]
    freq = {v: g.count(v) for v in set(g)}
    modus = sorted(v for v, c in freq.items() if c == max(freq.values()))
    check("a12 modus jamak", len(modus), 2, 0)
    check("a12 max(set, key=count) = modus pertama", max(set(g), key=g.count), 8, 0)

    # P1-G2 b11 — CI frequentist: 200 interval, seed 7
    rng = random.Random(7)
    covered = 0
    first = None
    for _ in range(200):
        xs = [rng.gauss(100, 15) for _ in range(400)]
        xb = sum(xs) / 400
        lo = xb - 1.96 * 15 / math.sqrt(400)
        hi = xb + 1.96 * 15 / math.sqrt(400)
        if first is None:
            first = (round(lo, 2), round(hi, 2))
        if lo <= 100 <= hi:
            covered += 1
    check("b11 coverage 200 interval", covered / 200 * 100, 95.5, 0.01)
    check("b11 interval pertama lo", first[0], 98.8, 0.01)
    check("b11 interval pertama hi", first[1], 101.74, 0.01)

    # P1-G3 a13 — MAD nol [100x6, 120, 500]; kuartil = engsel Tukey
    # (median separuh bawah/atas, seperti lab) — BUKAN quantiles exclusive.
    d = [100] * 6 + [120, 500]
    med = statistics.median(d)
    mad = statistics.median([abs(x - med) for x in d])
    ds = sorted(d)
    q1, q3 = statistics.median(ds[:4]), statistics.median(ds[4:])
    check("a13 median", med, 100.0, 0.01)
    check("a13 MAD", mad, 0.0, 0.01)
    check("a13 Q1 (engsel Tukey)", q1, 100.0, 0.01)
    check("a13 Q3 (engsel Tukey)", q3, 110.0, 0.01)
    check("a13 pagar atas Q3+1,5IQR", q3 + 1.5 * (q3 - q1), 125.0, 0.01)
    check("a13 500 outlier", 500 > q3 + 1.5 * (q3 - q1), True, 0)

    # P2-G1 b12 — importance sampling P(X>2,5), proposal N(2,5;1), seed 42
    rng = random.Random(42)
    xs = [rng.gauss(2.5, 1) for _ in range(5000)]
    w = [math.exp(-(x ** 2) / 2 + (x - 2.5) ** 2 / 2) for x in xs]
    ind = [1 if x > 2.5 else 0 for x in xs]
    check("b12 IS benar 1-Phi(2,5)", 1 - PHI(2.5), 0.00621, 0.00001)
    check("b12 IS tanpa bobot", sum(ind) / len(ind), 0.4924, 0.001)
    check("b12 IS terkoreksi", sum(wi * ii for wi, ii in zip(w, ind)) / len(xs), 0.00605, 0.001)
    check("b12 IS ESS", sum(w) ** 2 / sum(wi * wi for wi in w), 29, 2)

    # P2-G2 b12 — bootstrap VaR/ES (setup seed 124, B=200, seed 7).
    # VaR = EKOR RUGI: kuantil 5% P&L (negatif) dinegasi — BUKAN kuantil
    # 95% (sisi untung). Bootstrap memakai choice() satu-per-satu.
    random.seed(124)
    pl = [10_000 * math.exp(random.gauss(0.0005, 0.02)) - 10_000 for _ in range(5000)]
    pls = sorted(pl)
    var95 = -pls[int(0.05 * 5000)]
    es95 = -statistics.mean(pls[:int(0.05 * 5000)])
    check("b12 VaR95 (ekor rugi)", var95, 321.4, 0.5)
    check("b12 ES95 (ekor rugi)", es95, 407.7, 0.5)
    check("b12 se_mean", statistics.stdev(pl) / math.sqrt(5000), 2.8, 0.1)
    rng = random.Random(7)
    v95s, e95s = [], []
    for _ in range(200):
        s = sorted(rng.choice(pl) for _ in range(5000))
        v95s.append(-s[int(0.05 * 5000)])
        e95s.append(-statistics.mean(s[:int(0.05 * 5000)]))
    check("b12 se_var95", statistics.stdev(v95s), 6.6, 0.5)
    check("b12 se_es95", statistics.stdev(e95s), 6.8, 0.5)

    # P2-G3 cr13 — CCF regulasi (floor mengikat)
    check("cr13 CCF kartu (internal 35 > floor 10)", max(35, 10), 35, 0)
    check("cr13 CCF committed <=1thn (floor 20 > internal 12)", max(12, 20), 20, 0)
    check("cr13 CCF committed >1thn (internal 62 > floor 50)", max(62, 50), 62, 0)
    check("cr13 CCF IRB (internal, tanpa floor SA)", 45, 45, 0)
    check("cr13 EAD fasilitas pendek (100jt x 20%)", 100 * 0.20, 20.0, 0.01)

    # P3-G1 cr15 — PD marginal hazard 2/3/4%
    h = [0.02, 0.03, 0.04]
    surv = 1.0
    marg = []
    for hi in h:
        marg.append(surv * hi)
        surv *= 1 - hi
    check("cr15 PD marginal thn 1", marg[0], 0.02, 0.0001)
    check("cr15 PD marginal thn 2", marg[1], 0.0294, 0.0001)
    check("cr15 PD marginal thn 3", marg[2], 0.038, 0.001)
    check("cr15 PD lifetime 3 thn", sum(marg), 0.0874, 0.0005)

    # P3-G2 cr15 — LGD recovery terdiskonto (EAD 1000, r=10%)
    pv_rec = 400 / 1.1 ** 2
    pv_cost = 50 / 1.1
    check("cr15 PV recovery", pv_rec, 330.58, 0.01)
    check("cr15 PV biaya", pv_cost, 45.45, 0.01)
    check("cr15 LGD benar", 1 - (pv_rec - pv_cost) / 1000, 0.7149, 0.001)
    check("cr15 LGD nominal (salah)", 1 - (400 - 50) / 1000, 0.65, 0.001)

    # P3-G3 cr15 — VaR reproduksibel (PD 4%, LGD 40%, EAD 1000jt, n=100)
    def binom_q99(n: int, p: float) -> int:
        c, k = 0.0, 0
        while c < 0.99:
            c += math.comb(n, k) * p ** k * (1 - p) ** (n - k)
            k += 1
        return k - 1
    check("cr15 kuantil 99% binomial(100, 4%)", binom_q99(100, 0.04), 9, 0)
    check("cr15 VaR99 independen (jt)", binom_q99(100, 0.04) * 10 * 0.4, 36.0, 0.01)
    check("cr15 VaR99 Vasicek rho=12% (jt)", vasicek_q(0.04, 0.12, 0.99) * 0.4 * 1000, 62.8, 0.5)
    check("cr15 VaR99 Vasicek rho=24% (jt)", vasicek_q(0.04, 0.24, 0.99) * 0.4 * 1000, 96.7, 0.5)

    # P4-G1 mr4 — component/marginal VaR (w .6/.4, sigma .20/.30, rho .3)
    wa, wb, sa, sb, rho, V, z = 0.6, 0.4, 0.20, 0.30, 0.3, 100, 2.33
    sig = math.sqrt(wa ** 2 * sa ** 2 + wb ** 2 * sb ** 2 + 2 * wa * wb * rho * sa * sb)
    cov_a = wa * sa ** 2 + wb * rho * sa * sb
    cov_b = wb * sb ** 2 + wa * rho * sa * sb
    ma, mb = z * V * cov_a / sig, z * V * cov_b / sig
    check("mr4 sigma_p", sig, 0.1935, 0.0005)
    check("mr4 VaR total", z * sig * V, 45.08, 0.05)
    check("mr4 marginal A", ma, 37.57, 0.05)
    check("mr4 marginal B", mb, 56.36, 0.05)
    check("mr4 component A", wa * ma, 22.54, 0.05)
    check("mr4 component B", wb * mb, 22.54, 0.05)

    # P4-G2 mr4 — vega (delta .6, vega 200, sigma_S 10, sigma_vol .05)
    vd = (0.6 * 10) ** 2
    vv = (200 * 0.05) ** 2
    check("mr4 var_delta", vd, 36.0, 0.01)
    check("mr4 var_vega", vv, 100.0, 0.01)
    check("mr4 VaR95 tanpa vega", 1.645 * math.sqrt(vd), 9.87, 0.05)
    check("mr4 VaR95 dengan vega", 1.645 * math.sqrt(vd + vv), 19.18, 0.05)
    check("mr4 rasio VaR", 1.645 * math.sqrt(vd + vv) / (1.645 * math.sqrt(vd)), 1.94, 0.02)

    # P5-G1 aml1 — Wilson 12/300, toleransi miss 2%
    def wilson(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
        p = k / n
        den = 1 + z * z / n
        c = (p + z * z / (2 * n)) / den
        half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den
        return c - half, c + half
    lo_w, hi_w = wilson(12, 300)
    check("aml1 miss rate", 12 / 300 * 100, 4.0, 0.01)
    check("aml1 Wilson bawah %", lo_w * 100, 2.3, 0.1)
    check("aml1 Wilson atas %", hi_w * 100, 6.9, 0.1)
    check("aml1 miss/bulan @1200", 0.04 * 1200, 48.0, 0.01)
    check("aml1 miss/bulan batas atas", hi_w * 1200, 82.8, 1.0)

    # P5-G2 fr12 — temporal leakage (keputusan akhir hari 5)
    tr = [(1, 20), (2, 15), (3, 10), (8, 60), (9, 50)]
    benar = [(d, a) for d, a in tr if d <= 5]
    check("fr12 benar jumlah", len(benar), 3, 0)
    check("fr12 benar Rp jt", sum(a for _, a in benar), 45, 0)
    check("fr12 bocor jumlah", len(tr), 5, 0)
    check("fr12 bocor Rp jt", sum(a for _, a in tr), 155, 0)
    check("fr12 rasio bocor/benar", 155 / 45, 3.44, 0.01)

    # P5-G3 aml2 — drift baseline nol
    check("aml2 selisih kasus A", 8 - 0, 8, 0)
    check("aml2 rasio kasus B", (14 - 0) / (2 - 0), 7.0, 0.01)
    check("aml2 selisih kasus B", 14 - 2, 12, 0)

    # P6-G1 mle12 — reweighting (A 800/560, B 200/80). Rate tertimbang
    # memakai bobot TAK DIBULATKAN (bobot tampil dibulatkan 2 desimal,
    # tetapi rate dihitung dari bobot penuh — memakai bobot bulat memberi
    # 63,89, bukan 64,0).
    p_a, p_b = 800 / 1000, 200 / 1000
    p_plus, p_min = 640 / 1000, 360 / 1000
    wa_plus = p_a * p_plus / (560 / 1000)
    wa_min = p_a * p_min / (240 / 1000)
    wb_plus = p_b * p_plus / (80 / 1000)
    wb_min = p_b * p_min / (120 / 1000)
    check("mle12 bobot A+ (tampil)", round(wa_plus, 2), 0.91, 0.01)
    check("mle12 bobot B+ (tampil)", round(wb_plus, 2), 1.6, 0.01)
    ra = 560 * wa_plus / (560 * wa_plus + 240 * wa_min) * 100
    rb = 80 * wb_plus / (80 * wb_plus + 120 * wb_min) * 100
    check("mle12 weighted rate A %", ra, 64.0, 0.1)
    check("mle12 weighted rate B %", rb, 64.0, 0.1)
    check("mle12 DI awal", 0.4 / 0.7, 0.57, 0.01)
    check("mle12 DI akhir", rb / ra, 1.0, 0.01)

    # P6-G2 c13 — roll rate aktual (saldo) dari 2 snapshot
    rows = [(0, 35, 100), (15, 45, 150), (25, 20, 200), (45, 75, 50),
            (70, 95, 100), (5, 5, 80), (35, 0, 120)]
    def rr(lo_b: int, hi_b: int) -> tuple[float, float]:
        tot = sum(s for a, _, s in rows if lo_b <= a <= hi_b)
        roll = sum(s for a, b, s in rows if lo_b <= a <= hi_b and b > a)
        cure = sum(s for a, b, s in rows if lo_b <= a <= hi_b and b < a)
        return roll / tot * 100, cure / tot * 100
    check("c13 RR 1-30 saldo %", rr(1, 30)[0], 34.9, 0.1)
    check("c13 RR 31-60 saldo %", rr(31, 60)[0], 29.4, 0.1)
    check("c13 cure 31-60 %", rr(31, 60)[1], 70.6, 0.1)
    check("c13 RR 61-90 saldo %", rr(61, 90)[0], 100.0, 0.1)

    # P7-G1 aie13 — BM25 lengkap (k1=1,2, b=0,75)
    def idf(n_docs: int, df: int) -> float:
        return math.log(1 + (n_docs - df + 0.5) / (df + 0.5))
    def bm25_term(tf: int, dl: int, avgdl: float, idf_v: float) -> float:
        return idf_v * (tf * 2.2) / (tf + 1.2 * (1 - 0.75 + 0.75 * dl / avgdl))
    avgdl = 10 / 3
    idf_dep = idf(3, 2)
    check("aie13 IDF bunga", idf(3, 3), 0.13, 0.01)
    check("aie13 IDF deposito", idf_dep, 0.47, 0.01)
    check("aie13 kontribusi deposito d1 (tf=2)", bm25_term(2, 3, avgdl, idf_dep), 0.66, 0.01)
    check("aie13 kontribusi deposito d0 (tf=1)", bm25_term(1, 3, avgdl, idf_dep), 0.49, 0.01)
    idf_b = idf(3, 3)
    s0 = bm25_term(1, 3, avgdl, idf_b) + bm25_term(1, 3, avgdl, idf_dep)
    s1 = bm25_term(1, 3, avgdl, idf_b) + bm25_term(2, 3, avgdl, idf_dep)
    s2 = bm25_term(1, 4, avgdl, idf_b)
    check("aie13 skor d0", s0, 0.63, 0.01)
    check("aie13 skor d1", s1, 0.80, 0.01)
    check("aie13 skor d2", s2, 0.12, 0.01)

    # P7-G2 llmops13 — antrean berbatas (3 slot, TOK 0,05 dtk)
    reqs = [(0.0, 20), (0.1, 40), (0.2, 10), (0.3, 30), (0.4, 20),
            (0.5, 10), (0.6, 50), (0.7, 10), (0.8, 20), (0.9, 10)]
    def layani(max_q: int) -> tuple[int, int, float]:
        slots = [0.0, 0.0, 0.0]
        antre: list = []
        terima = tolak = 0
        tunggu: list[float] = []
        def mulai(arr: float, tok: int, now: float) -> float:
            s = min(slots)
            start = max(arr, s, now)
            slots[slots.index(s)] = start + tok * 0.05
            return start
        for arr, tok in reqs:
            while antre and min(slots) <= arr:
                qa, qt = antre.pop(0)
                tunggu.append(mulai(qa, qt, min(slots)) - qa)
                terima += 1
            if min(slots) <= arr:
                tunggu.append(0.0)
                mulai(arr, tok, arr)
                terima += 1
            elif len(antre) < max_q:
                antre.append((arr, tok))
            else:
                tolak += 1
        while antre:
            qa, qt = antre.pop(0)
            tunggu.append(mulai(qa, qt, min(slots)) - qa)
            terima += 1
        return terima, tolak, round(max(tunggu), 2)
    check("llmops13 terima antre=2", layani(2)[0], 6, 0)
    check("llmops13 tolak antre=2", layani(2)[1], 4, 0)
    check("llmops13 tunggu maks antre=2", layani(2)[2], 1.3, 0.01)
    check("llmops13 terima antre=0", layani(0)[0], 4, 0)
    check("llmops13 tolak antre=0", layani(0)[1], 6, 0)
    check("llmops13 terima antre=inf", layani(99)[0], 10, 0)
    check("llmops13 tunggu maks antre=inf", layani(99)[2], 1.8, 0.01)

    # P8-G1 hd12 — calibration plot (10 pasien)
    probs = [0.9, 0.8, 0.7, 0.6, 0.55, 0.45, 0.4, 0.3, 0.2, 0.1]
    y = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]
    brier = sum((p - t) ** 2 for p, t in zip(probs, y)) / len(y)
    hi_p = [p for p in probs if p >= 0.5]
    hi_y = [t for p, t in zip(probs, y) if p >= 0.5]
    lo_p = [p for p in probs if p < 0.5]
    lo_y = [t for p, t in zip(probs, y) if p < 0.5]
    ece = 0.5 * abs(sum(hi_p) / 5 - sum(hi_y) / 5) + 0.5 * abs(sum(lo_p) / 5 - sum(lo_y) / 5)
    check("hd12 Brier", brier, 0.1705, 0.0005)
    check("hd12 pred tinggi", sum(hi_p) / 5, 0.71, 0.01)
    check("hd12 obs tinggi", sum(hi_y) / 5, 0.6, 0.01)
    check("hd12 pred rendah", sum(lo_p) / 5, 0.29, 0.01)
    check("hd12 obs rendah", sum(lo_y) / 5, 0.2, 0.01)
    check("hd12 ECE", ece, 0.1, 0.01)
    check("hd12 Brier baseline prevalensi 0,4", 0.4 * 0.6, 0.24, 0.01)

    # P8-G2 biz12 — audit 6 lapisan
    check("biz12 skor scoping 4/6 %", 4 / 6 * 100, 66.7, 0.1)

    # P9-G1 mk13 — ROI per horizon (spend 100)
    check("mk13 ROI TV 8 mgg", 40 / 100, 0.4, 0.01)
    check("mk13 ROI Digital 8 mgg", 120 / 100, 1.2, 0.01)
    check("mk13 ROI TV 6 bln", 180 / 100, 1.8, 0.01)
    check("mk13 ROI Digital 6 bln", 150 / 100, 1.5, 0.01)

    # P9-G2 rr11 — jembatan NPL/CKPN/modal (total kredit 10000, RWA 10000)
    npl_nom = 10000 * 0.05
    check("rr11 NPL nominal severe", npl_nom, 500.0, 0.01)
    check("rr11 coverage awal %", 250 / npl_nom * 100, 50.0, 0.01)
    check("rr11 coverage +8 %", 258 / npl_nom * 100, 51.6, 0.01)
    check("rr11 NPL neto awal %", (npl_nom - 250) / 10000 * 100, 2.5, 0.01)
    check("rr11 NPL neto +8 %", (npl_nom - 258) / 10000 * 100, 2.42, 0.01)
    check("rr11 KPMM awal %", 1200 / 10000 * 100, 12.0, 0.01)
    check("rr11 KPMM +100 %", 1300 / 10000 * 100, 13.0, 0.01)
    check("rr11 NPL gross setelah cap SME %", (npl_nom - 50 * 0.041) / 10000 * 100, 4.98, 0.01)

    # P9-G3 wqb13 — Fisher CI + alignment tanggal (seed 13)
    def fisher_ci(r: float, n: int) -> tuple[float, float]:
        z = math.atanh(r)
        se = 1 / math.sqrt(n - 3)
        return math.tanh(z - 1.96 * se), math.tanh(z + 1.96 * se)
    lo_c, hi_c = fisher_ci(0.94, 252)
    check("wqb13 Fisher CI bawah (n=252)", lo_c, 0.92, 0.01)
    check("wqb13 Fisher CI atas (n=252)", hi_c, 0.95, 0.01)
    check("wqb13 Fisher CI bawah (n=20)", fisher_ci(0.94, 20)[0], 0.85, 0.01)
    check("wqb13 Fisher CI atas (n=20)", fisher_ci(0.94, 20)[1], 0.98, 0.01)
    check("wqb13 Fisher CI bawah (n=55)", fisher_ci(0.94, 55)[0], 0.90, 0.01)
    check("wqb13 Fisher CI atas (n=55)", fisher_ci(0.94, 55)[1], 0.96, 0.01)
    rng = random.Random(13)
    ex = [rng.gauss(0.0006, 0.008) for _ in range(60)]
    kd = [e * 1.2 + rng.gauss(0, 0.003) for e in ex]
    def pearson(x: list[float], yv: list[float]) -> float:
        n = len(x)
        mx, my = sum(x) / n, sum(yv) / n
        cov = sum((a - mx) * (b - my) for a, b in zip(x, yv)) / n
        sx = math.sqrt(sum((a - mx) ** 2 for a in x) / n)
        sy = math.sqrt(sum((b - my) ** 2 for b in yv) / n)
        return cov / (sx * sy)
    check("wqb13 r naif (posisi, geser 5 hari)", pearson(ex, kd[5:] + kd[:5]), 0.02, 0.02)
    check("wqb13 r selaras tanggal", pearson(ex[5:], kd[5:]), 0.94, 0.01)

    print(f"QA R7-RECOMPUTE: {'ALL PASS' if not FAILURES else f'{len(FAILURES)} FAIL: {FAILURES}'}")
    return 0 if not FAILURES else 1


if __name__ == "__main__":
    raise SystemExit(main())
