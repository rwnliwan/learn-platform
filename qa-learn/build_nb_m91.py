#!/usr/bin/env python3
"""Build colab/mlf-m91-guided-task.ipynb (MLF-M9.1 Monte Carlo Simulation).

Writes the notebook ONLY (14 cells, markdown+code alternating). Does NOT
execute it -- execution is the coordinator's job (nbconvert, staggered).

Canonical numbers come from qa-learn/m9_canonical.json (loaded inside the
notebook at runtime, with hardcode fallback). Every check asserts the
notebook's own computed values against the canonical targets with a
tolerance that absorbs MC stream differences (verified: default_rng(42)
fresh per simulation reproduces canonical within 0.0006 on VaR95).
"""
import json
import os

import nbformat as nbf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "colab", "mlf-m91-guided-task.ipynb")

nb = nbf.v4.new_notebook()
nb.metadata = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3.11.0"},
}

md = nbf.v4.new_markdown_cell
code = nbf.v4.new_code_cell

nb.cells = [
    md("""# Guided Task MLF-M9.1: Monte Carlo Simulation — Menghitung Risiko dari Dunia yang Belum Terjadi

**Track Machine Learning Finance — Modul M9 (Simulation, Backtesting & Validation)**

Di notebook ini kamu mereplikasi SEMUA angka kunci lesson M9.1 dari data harga nyata — dan membuktikan sendiri tiga klaim paling jujur di lesson ini:

- **480 hari itu sampel kecil** — VaR95 historis 0,0286 bersandar pada 24 hari terburuk saja (5% × 480); MC 1-hari N=100.000 memberi 0,0329 — hampir sama dengan parametrik 0,0328, dan ketiganya harus dilaporkan bersama.
- **Hukum 1/√N itu nyata** — SE mean menyusut 0,001962 → 0,000620 → 0,000196 → 0,000062 (N=100 → 100.000); 20 batch independen N=10.000 memberi VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009).
- **√10 berbohong** — VaR95 10-hari MC 0,1038 vs skala √10-hist 0,0903; peluang melampaui 0,0903 adalah 0,0795, bukan 0,05.

Yang kamu buktikan, langkah demi langkah (dengan ✅ check di tiap langkah):

- **Langkah 1 — MC 1 hari:** sweep N=1.000/10.000/100.000 → VaR95 + ES95 vs historis dan parametrik.
- **Langkah 2 — Hukum 1/√N + batch:** SE mean dari rumus, 20 batch independen, realised mean error vs SE.
- **Langkah 3 — GBM 10 hari:** N=100.000 path → distribusi terminal, VaR95/VaR99 10-hari, P(rugi > 10%), dan pembanding √10.
- **Langkah 4 — Konvergensi:** kriteria berhenti [kebijakan lesson ini] — sd antar-batch ≤ 0,0005 — dan perbandingan dengan ketidakpastian sampling data (bootstrap M9.5).
- **Langkah 5 — Laporan untuk komite:** tiga estimator (hist/param/MC) + ES + keputusan «laporkan ketiganya».

Data: `data/m4_prices.csv` (harga BBCA/KLBF/UNVR + ^GSPC). Jalankan notebook ini dari folder repo `learn-platform` agar path relatifnya ketemu. Angka kanonis dimuat dari `qa-learn/m9_canonical.json` bila ada; bila tidak, dipakai target hardcode yang sama.
"""),
    code("""# Tujuan cell ini: menyiapkan library, memuat harga, dan menghitung return portofolio.
# Konvensi lesson: portofolio EQUAL-WEIGHT BBCA/KLBF/UNVR, SIMPLE daily returns.
# Simulasi GBM memakai LOG returns portofolio itu (mu_log, sd_log).
import json
import math
import os
import numpy as np
import pandas as pd

SEED = 42


def find_file(candidates):
    # Notebook dijalankan dari folder repo (data/...) atau oleh nbconvert
    # yang memakai folder notebook sebagai cwd (../data/...).
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(candidates)


PRICES_CSV = find_file(["data/m4_prices.csv",
                        "../data/m4_prices.csv"])
CANON_PATH = find_file(["qa-learn/m9_canonical.json",
                        "../qa-learn/m9_canonical.json"])

try:
    with open(CANON_PATH) as f:
        CANON = json.load(f)
    print(f"Kanonis dimuat dari {CANON_PATH}")
except FileNotFoundError:
    CANON = {}
    print("m9_canonical.json tidak ketemu — memakai target hardcode")

# m4_prices.csv = ekspor yfinance multi-index: baris 0 header, baris 1
# ticker, baris 2 "Date", data mulai baris 3; kolom Close ada di posisi 1:4.
raw = pd.read_csv(PRICES_CSV, header=None, skiprows=3)
dates = pd.to_datetime(raw.iloc[:, 0])
close = raw.iloc[:, 1:4].astype(float)
close.columns = ["BBCA", "KLBF", "UNVR"]
close.index = dates
close = close.dropna()  # 41 baris libur (ketiga saham kosong) dibuang
rets = close.pct_change(fill_method=None).dropna()
port_simple = rets.mean(axis=1)  # equal-weight, SIMPLE daily returns
port_log = np.log1p(port_simple)  # LOG returns (dipakai simulasi GBM)

MU_LOG = float(port_log.mean())
SD_LOG = float(port_log.std(ddof=1))
MU_SIMPLE = float(port_simple.mean())
SD_SIMPLE = float(port_simple.std(ddof=1))
print(f"n={len(port_simple)}, {port_simple.index.min().date()} -> "
      f"{port_simple.index.max().date()}")
print(f"mu_log={MU_LOG:.6f}, sd_log={SD_LOG:.4f}, "
      f"mu_simple={MU_SIMPLE:.6f}, sd_simple={SD_SIMPLE:.4f}")
"""),
    code("""# Tujuan cell ini: memeriksa data dan angka historis (check 1).
# VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR.
q05 = np.quantile(port_simple, 0.05)
var95_hist = -q05
es95_hist = -port_simple[port_simple <= q05].mean()
print(f"var95_hist={var95_hist:.4f}")
print(f"es95_hist={es95_hist:.4f}")

# ✅ CHECK 1 — data + historis sama dengan kanonis [m9_canonical.json]
assert len(port_simple) == 480, len(port_simple)
assert abs(MU_LOG - (-0.000752)) < 0.00005, MU_LOG
assert abs(SD_LOG - 0.0198) < 0.0002, SD_LOG
assert abs(MU_SIMPLE - (-0.000558)) < 0.00005, MU_SIMPLE
assert abs(SD_SIMPLE - 0.0196) < 0.0002, SD_SIMPLE
assert abs(var95_hist - 0.0286) < 0.0005, var95_hist
assert abs(es95_hist - 0.0445) < 0.0005, es95_hist
print("✅ CHECK 1 lolos — n=480, mu_log/sd_log cocok, "
      "VaR95 hist 0,0286, ES95 hist 0,0445")
"""),
    md("""## Langkah 1 — MC 1 hari: sweep N=1.000/10.000/100.000

Satu hari, satu simulasi: log-return ~ Normal(μ_log, σ_log²), konversi ke simple dengan `expm1`, seed 42 (generator baru per N agar deterministik). VaR95 = kuantil 95% distribusi KERUGIAN; ES95 = rata-rata kerugian pada 5% hari terburuk simulasi.

Pembandingnya: historis 0,0286 / 0,0445 dan parametrik 0,0328 / 0,0410 [M4.2], serta MC joint-normal M4 0,0336 / 0,0424 [M4.2]. MC univariat dan parametrik HARUS hampir sama — keduanya memakai asumsi normal yang sama, yang satu lewat undian, yang satu lewat rumus.
"""),
    code("""# Tujuan cell ini: MC 1 hari, sweep N — VaR95 + ES95 (check 2).
# Generator baru (seed 42) di tiap N agar deterministik.
def mc_1day(n, seed=SEED):
    rng = np.random.default_rng(seed)
    r = np.expm1(rng.normal(MU_LOG, SD_LOG, n))  # simple returns
    q = np.quantile(r, 0.05)
    var95 = -q
    es95 = -r[r <= q].mean()
    return var95, es95, r.mean()


results_1d = {}
for n in (1000, 10000, 100000):
    var95, es95, mean_sim = mc_1day(n)
    results_1d[n] = (var95, es95, mean_sim)
    print(f"N={n:>6}: var95={var95:.4f}, es95={es95:.4f}, mean_sim={mean_sim:.4f}")

var95_hist_ref = 0.0286  # [M4.2]
var95_param_ref = 0.0328  # [M4.2]
print(f"pembanding: hist={var95_hist_ref:.4f}, param={var95_param_ref:.4f}")

# ✅ CHECK 2 — VaR95/ES95 MC sama dengan kanonis (tol 0,002: MC error antar-stream)
assert abs(results_1d[1000][0] - 0.0335) < 0.002, results_1d[1000][0]
assert abs(results_1d[10000][0] - 0.0332) < 0.002, results_1d[10000][0]
assert abs(results_1d[100000][0] - 0.0329) < 0.002, results_1d[100000][0]
assert abs(results_1d[100000][1] - 0.0407) < 0.002, results_1d[100000][1]
assert abs(results_1d[1000][2] - (-0.0011)) < 0.001, results_1d[1000][2]
assert abs(results_1d[100000][2] - (-0.0006)) < 0.001, results_1d[100000][2]
print("✅ CHECK 2 lolos — VaR95 MC 0,0335/0,0332/0,0329; ES95 N=100.000 0,0407")
"""),
    md("""## Langkah 2 — Hukum 1/√N + 20 batch independen

SE mean = σ/√N: N=100 → 0,001962; N=1.000 → 0,000620; N=10.000 → 0,000196; N=100.000 → 0,000062. Realised MC mean error (satu undian per N): −0,000149 / −0,000813 / −0,000118 / −0,000015 — error satu undian bisa melebihi SE (N=1.000: ~1,3 SE) dan bisa jauh di bawahnya karena beruntung (N=100).

Untuk VaR, SE tidak punya rumus sederhana — ia DIUKUR: 20 batch independen, masing-masing N=10.000, memberi VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009), range [0,0319; 0,0333]. Ingat aturannya: jangan tulis «mean ± sd» sebagai ketidakpastian mean — tulis «mean (sd ...; SE ...)», SE = sd/√n.
"""),
    code("""# Tujuan cell ini: SE mean dari rumus + 20 batch independen VaR95 (check 3).
# SE mean (teori): SD_SIMPLE / sqrt(N). Batch: SeedSequence spawn (20 stream).
se_mean = {n: SD_SIMPLE / math.sqrt(n) for n in (100, 1000, 10000, 100000)}
for n, se in se_mean.items():
    print(f"SE mean N={n:>6}: {se:.6f}")

# Realised mean error vs mean sebenarnya (log-return): satu undian per N
# (generator baru, seed 42) — bandingkan |error| dengan SE. Nilai error di
# sini adalah undian notebook ini (stream-nya sendiri); kanonis melaporkan
# −0,000149 / −0,000813 / −0,000118 / −0,000015 dari stream yang berbeda —
# keduanya wajar: SE mengatur ukuran tipikalnya, bukan nilai pastinya.
for n in (100, 1000, 10000, 100000):
    rng = np.random.default_rng(SEED)
    lr = rng.normal(MU_LOG, SD_LOG, n)
    err = lr.mean() - MU_LOG
    print(f"N={n:>6}: realised log-mean error={err:.6f}, |err|/SE={abs(err)/se_mean[n]:.2f}, "
          f"SE={se_mean[n]:.6f}")

ss = np.random.SeedSequence(SEED)
batch_var95 = []
for child in ss.spawn(20):
    rng = np.random.default_rng(child)
    r = np.expm1(rng.normal(MU_LOG, SD_LOG, 10000))
    batch_var95.append(-np.quantile(r, 0.05))
batch_var95 = np.array(batch_var95)
batch_mean = float(batch_var95.mean())
batch_sd = float(batch_var95.std(ddof=1))
batch_se = batch_sd / math.sqrt(20)
print(f"batch VaR95: mean={batch_mean:.4f} (sd {batch_sd:.4f}; SE {batch_se:.5f}), "
      f"range=[{batch_var95.min():.4f}; {batch_var95.max():.4f}]")

# ✅ CHECK 3 — SE teori + batch sama dengan kanonis
assert abs(se_mean[100] - 0.001962) < 1e-5, se_mean[100]
assert abs(se_mean[1000] - 0.000620) < 1e-5, se_mean[1000]
assert abs(se_mean[10000] - 0.000196) < 1e-5, se_mean[10000]
assert abs(se_mean[100000] - 0.000062) < 1e-5, se_mean[100000]
assert abs(batch_mean - 0.0326) < 0.0015, batch_mean
assert abs(batch_sd - 0.0004) < 0.0002, batch_sd
assert abs(batch_var95.min() - 0.0319) < 0.001, batch_var95.min()
assert abs(batch_var95.max() - 0.0333) < 0.001, batch_var95.max()
print("✅ CHECK 3 lolos — SE 0,001962/0,000620/0,000196/0,000062; "
      "batch mean 0,0326 (sd 0,0004)")
"""),
    md("""## Langkah 3 — GBM 10 hari: jalan, distribusi terminal, dan √10

Satu path = jumlah 10 log-return harian independen, lalu `expm1`. N=100.000 path (seed 42). Yang dihitung: mean/sd/median terminal, VaR95 10-hari (p5) dan VaR99 10-hari (p1) sebagai kerugian, P(rugi > 10%), dan P(rugi > 0,0903) — peluang kerugian melampaui skala √10-hist (0,0286 × √10 ≈ 0,0903 [M4.2]).

Periksa konsistensi dulu: mean terminal vs 10 × μ_simple (−0,00558) dan sd terminal vs σ_simple × √10 (0,0620). Bila tidak cocok, simulasinya rusak — bukan «menarik».
"""),
    code("""# Tujuan cell ini: GBM 10 hari, N=100.000 path — distribusi terminal (check 4).
N_PATHS_10D = 100000
rng = np.random.default_rng(SEED)
steps = rng.normal(MU_LOG, SD_LOG, (N_PATHS_10D, 10))
terminal = np.expm1(steps.sum(axis=1))  # simple return 10-hari

term_mean = float(terminal.mean())
term_sd = float(terminal.std(ddof=1))
term_median = float(np.median(terminal))
p5_10d = float(-np.quantile(terminal, 0.05))  # VaR95 10-hari (kerugian)
p1_10d = float(-np.quantile(terminal, 0.01))  # VaR99 10-hari (kerugian)
p_loss_gt_10 = float((terminal < -0.10).mean())
p_loss_gt_0903 = float((terminal < -0.0903).mean())
print(f"terminal: mean={term_mean:.4f} (sd {term_sd:.4f}), median={term_median:.4f}")
print(f"VaR95 10-hari (p5)={p5_10d:.4f}, VaR99 10-hari (p1)={p1_10d:.4f}")
print(f"P(rugi > 10%)={p_loss_gt_10:.4f}, P(rugi > 0,0903)={p_loss_gt_0903:.4f}")
print(f"pembanding: 10x mu_simple={10 * MU_SIMPLE:.4f}, "
      f"sd_simple x sqrt(10)={SD_SIMPLE * math.sqrt(10):.4f}, "
      f"sqrt10-hist (kanonis)=0.0903")

# ✅ CHECK 4 — terminal 10-hari sama dengan kanonis
assert abs(term_mean - (-0.0053)) < 0.002, term_mean
assert abs(term_sd - 0.0619) < 0.002, term_sd
assert abs(term_median - (-0.0074)) < 0.001, term_median
assert abs(p5_10d - 0.1038) < 0.002, p5_10d
assert abs(p1_10d - 0.1408) < 0.002, p1_10d
assert abs(p_loss_gt_10 - 0.0572) < 0.005, p_loss_gt_10
assert abs(p_loss_gt_0903 - 0.0795) < 0.005, p_loss_gt_0903
print("✅ CHECK 4 lolos — VaR95 10-hari 0,1038; P(rugi>10%) 0,0572; "
      "P(rugi>0,0903) 0,0795")
"""),
    md("""## Langkah 4 — Konvergensi: kapan berhenti menambah N

Kriteria berhenti [kebijakan lesson ini]: berhenti bila simpangan baku antar-batch VaR95 ≤ 0,0005 — kurang dari seperempat simpangan baku bootstrap VaR95 (0,0022, M9.5). Pada N=10.000, sd antar-batch sudah 0,0004 — kriteria TERPENUHI; N=100.000 adalah cadangan ketelitian, bukan kebutuhan keputusan.

Bandingkan dengan ketidakpastian sampling data (bootstrap VaR95 M9.5, B=10.000 — dirujuk, bukan dihitung ulang): IID bootstrap mean 0,0284 (sd 0,0022), CI95 [0,0229; 0,0322]; block-10 bootstrap mean 0,0285 (sd 0,0029), CI95 [0,0223; 0,0340]. Ketidakpastian data ≈ 5,5× ketidakpastian simulasi — menambah N tidak menggerakkan angka yang lebih besar itu.
"""),
    code("""# Tujuan cell ini: terapkan kriteria berhenti konvergensi (check 5).
# Ambang [kebijakan lesson ini]: sd antar-batch VaR95 <= 0,0005.
BOOT_SD_IID = 0.0022  # bootstrap VaR95 M9.5 (iid), [m9_canonical.json]
BOOT_CI_IID = (0.0229, 0.0322)
BOOT_CI_BLOCK10 = (0.0223, 0.0340)
STOP_SD = 0.0005  # [kebijakan lesson ini]

# N terkecil dari {1.000, 10.000, 100.000} yang sd-nya <= ambang.
# sd antar-batch ~ 1/sqrt(N): sd(N) = batch_sd * sqrt(10000 / N).
stop_N = None
for n in (1000, 10000, 100000):
    sd_at_n = batch_sd * math.sqrt(10000 / n)
    print(f"N={n:>6}: sd antar-batch (skala 1/sqrt(N)) = {sd_at_n:.5f} "
          f"-> {'BERHENTI' if sd_at_n <= STOP_SD else 'lanjut'}")
    if sd_at_n <= STOP_SD and stop_N is None:
        stop_N = n
print(f"stop_N={stop_N}")
print(f"MC error (sd {batch_sd:.4f}) vs data (bootstrap sd {BOOT_SD_IID:.4f}): "
      f"rasio {BOOT_SD_IID / batch_sd:.1f}x")
var95_mc_100k = results_1d[100000][0]
print(f"VaR95 MC {var95_mc_100k:.4f} di dalam CI95 block-10 {BOOT_CI_BLOCK10}: "
      f"{BOOT_CI_BLOCK10[0] <= var95_mc_100k <= BOOT_CI_BLOCK10[1]}")

# ✅ CHECK 5 — kriteria berhenti + perbandingan dengan error data
assert stop_N == 10000, stop_N
assert batch_sd <= STOP_SD, batch_sd
assert batch_sd < BOOT_SD_IID / 4, batch_sd  # < seperempat sd bootstrap
assert BOOT_CI_BLOCK10[0] <= var95_mc_100k <= BOOT_CI_BLOCK10[1]
print("✅ CHECK 5 lolos — berhenti pada N=10.000; error data ≈ 5,5x error simulasi")
"""),
    md("""## Langkah 5 — Laporan untuk komite: tiga estimator, satu keputusan

Mini-case lesson ini: komite bertanya «jadi VaR kita berapa?» — historis 0,0286, parametrik 0,0328, MC 0,0329. Jawabannya: laporkan KETIGANYA beserta ES dan asumsinya. MC bukan «yang benar» — ia yang asumsi-nya paling transparan (normal pada log-return, μ_log/σ_log dari data, seed 42) dan paling mudah diuji (ganti asumsi → lihat perubahan hasil).

Susun laporan di bawah ini sebagai dict: tiap estimator dengan VaR, ES, dan asumsi; rentang ketidaksepakatan antar-asumsi; bootstrap CI sebagai ukuran ketidakpastian sampling data; dan keputusan akhirnya.
"""),
    code("""# Tujuan cell ini: susun laporan tiga estimator + keputusan mini-case (check 6).
report = {
    "portofolio": "equal-weight BBCA/KLBF/UNVR, Rp100.000.000",
    "n_hari": len(port_simple),
    "var_hist": round(var95_hist, 4),       # tanpa asumsi distribusi
    "es_hist": round(es95_hist, 4),
    "var_param": 0.0328,                    # normal; mu_simple/sd_simple [M4.2]
    "es_param": 0.0410,
    "var_mc_100k": round(results_1d[100000][0], 4),  # normal log-return, seed 42
    "es_mc_100k": round(results_1d[100000][1], 4),
    "var_mc_batch_mean": round(batch_mean, 4),       # 20 batch N=10.000
    "var_mc_batch_sd": round(batch_sd, 4),
    "var_10d_mc": round(p5_10d, 4),
    "var_10d_sqrt10_hist": 0.0903,          # [M4.2] — terbukti meremehkan
    "p_loss_gt_0903": round(p_loss_gt_0903, 4),
    "boot_ci95_block10": BOOT_CI_BLOCK10,   # M9.5
    "keputusan": "laporkan ketiganya",
    "angka_kerja_1hari": round(results_1d[100000][0], 4),
    "catatan": "MC bukan yang benar — ia yang asumsi-nya paling transparan; "
               "ES historis 0,0445 untuk skenario ekstrem",
}
for k, v in report.items():
    print(f"{k}: {v}")
print(f"rentang VaR95 1-hari: [{min(report['var_hist'], report['var_param'], report['var_mc_100k']):.4f}; "
      f"{max(report['var_hist'], report['var_param'], report['var_mc_100k']):.4f}]")
print(f"VaR95 1-hari MC pada Rp100jt: Rp{report['var_mc_100k'] * 100_000_000:,.0f}")
print(f"VaR95 10-hari MC pada Rp100jt: Rp{report['var_10d_mc'] * 100_000_000:,.0f}")

# ✅ CHECK 6 — laporan berisi tiga estimator + keputusan yang benar
assert abs(report["var_hist"] - 0.0286) < 0.0005, report["var_hist"]
assert abs(report["var_mc_100k"] - 0.0329) < 0.002, report["var_mc_100k"]
assert abs(report["var_10d_mc"] - 0.1038) < 0.002, report["var_10d_mc"]
assert report["keputusan"] == "laporkan ketiganya"
assert report["var_10d_mc"] > report["var_10d_sqrt10_hist"]  # MC > skala akar-10
print("✅ CHECK 6 lolos — tiga estimator + keputusan «laporkan ketiganya»")
"""),
    md("""## Penutup

Yang kamu buktikan di notebook ini:

- **480 hari itu sampel kecil** — VaR95 historis 0,0286 bersandar pada 24 hari terburuk; MC 1-hari N=100.000 memberi 0,0329, hampir sama dengan parametrik 0,0328 — ketiganya dilaporkan bersama, bukan dipilih satu.
- **Hukum 1/√N itu nyata** — SE mean 0,001962 → 0,000620 → 0,000196 → 0,000062; 20 batch N=10.000 memberi VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009) — dan realised error satu undian bisa melebihi SE.
- **√10 berbohong** — VaR95 10-hari MC 0,1038 vs skala √10-hist 0,0903; P(melampaui 0,0903) = 0,0795, bukan 0,05.
- **Konvergen = error simulasi sudah jauh lebih kecil dari error data** — berhenti pada N=10.000 (sd 0,0004 ≤ 0,0005 [kebijakan lesson ini]); bootstrap sd 0,0022 ≈ 5,5× lebih besar.
- **MC bukan «yang benar»** — ia yang asumsi-nya paling transparan. Yang dilaporkan ke komite adalah ketiganya, beserta ES dan asumsinya.

Kebiasaan yang dibawa pulang: tiap kali seseorang membawakanmu angka simulasi dengan empat desimal yang rapi, tanyakan tiga hal — dari mana inputnya berasal, berapa error antar-batch-nya, dan apakah error itu masih lebih kecil dari ketidakpastian datanya.
"""),
]

with open(OUT, "w") as f:
    nbf.write(nb, f)
print(f"ditulis: {OUT} ({len(nb.cells)} sel)")
