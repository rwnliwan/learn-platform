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

    print(f"QA R7-RECOMPUTE: {'ALL PASS' if not FAILURES else f'{len(FAILURES)} FAIL: {FAILURES}'}")
    return 0 if not FAILURES else 1


if __name__ == "__main__":
    raise SystemExit(main())
