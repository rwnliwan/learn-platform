"""Build notebook MLF-M9.4 Sensitivity Analysis (14 sel, 6 checks).

Menulis colab/mlf-m94-guided-task.ipynb. Angka pasar DIHITUNG ULANG dari
data/m4_prices.csv dengan loading yang SAMA seperti
qa-learn/m9_canonical_calc.py (per-aset pct_change pada kalender sendiri,
dropna -> 481 baris lengkap -> 480 return, 2024-11-04 -> 2026-11-11);
qa-learn/m9_canonical.json dipakai sebagai TARGET verifikasi (bukan
sumber angka). Agregat kredit dari qa-learn/m8_canonical.json
(m8_tiering); DEFAULT_LIMIT [turunan] = realised_loss_approved / LGD 0,45.
TIDAK mengeksekusi notebook (eksekusi oleh koordinator).
"""

import json
import os

import nbformat as nbf

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "colab", "mlf-m94-guided-task.ipynb")

nb = nbf.v4.new_notebook()
nb.metadata = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {"name": "python", "version": "3.12.0"},
}
cells = []


def md(source):
    cells.append(nbf.v4.new_markdown_cell(source.strip()))


def code(source):
    cells.append(nbf.v4.new_code_cell(source.strip()))


md("""# Guided Task MLF-M9.4: Sensitivity Analysis — Input Mana yang Paling Menggerakkan Jawabanmu?

**Track Machine Learning Finance — Modul M9 (Simulation, Backtesting & Validation)**

Di notebook ini kamu mereplikasi SEMUA angka kunci lesson M9.4 dari agregat kanonis — dan membuktikan sendiri tiga klaim paling jujur di lesson ini:

- **Tornado: α yang paling menggerakkan VaR, μ yang paling tidak** — α 95→97,5% menaikkan VaR95 dari 0,0328 menjadi 0,0390 (+18,8%), sementara μ ±0,0005 hanya menggerakkannya ±1,5%.
- **Multi-way: gabungan sedikit lebih besar dari jumlah bagiannya** — σ +10% DAN korelasi +0,1 memberi +16,2%, vs jumlah efek sendiri 15,6%: interaksi +0,6 pp.
- **Profit PALING sensitif terhadap margin, bukan parameter statistik** — per 0,01 yang sama, margin menggerakkan profit NT$3.981.900 vs LGD NT$259.900 (sekitar 15×).

Yang kamu buktikan, langkah demi langkah (dengan ✅ check di tiap langkah):

- **Langkah 1 — Basis direplikasi:** VaR95 parametrik 0,0328 dari μ_d dan σ_d, dan σ_port 0,0196 dihitung dari matriks kovarians.
- **Langkah 2 — Tornado one-at-a-time:** tujuh gangguan, ranking dari Δ terbesar.
- **Langkah 3 — Multi-way:** σ +10% DAN korelasi +0,1, interaksi vs jumlah efek sendiri.
- **Langkah 4 — Sensitivitas kredit:** profit vs LGD dan vs margin dari agregat limit kanonis.
- **Langkah 5 — Mini-case σ × 1,2:** hitung eksak 0,0393 — dan kenapa interpolasi «2 × efek 10%» bukan metode (interpolasi dari Δ bulat tornado memberi 0,0392 — selisih 0,0001, murni pembulatan).
- **Langkah 6 — Sensitivitas vs ketidakpastian:** rangkuman angka + CI rujukan [M9.5] dan [M8.1].

Angka pasar (μ_d, σ_d, matriks korelasi, per-stock sd) DIHITUNG ULANG dari `data/m4_prices.csv` dengan loading yang sama seperti `qa-learn/m9_canonical_calc.py` — dan dicek terhadap `qa-learn/m9_canonical.json` (target verifikasi, bukan sumber angka). Agregat kredit dari `qa-learn/m8_canonical.json`. Jalankan notebook ini dari folder repo `learn-platform` agar path relatifnya ketemu.""")

code("""# Tujuan cell ini: menyiapkan library, memuat data harga, dan menghitung
# ulang mu/sigma/korelasi pasar dari data — kanonik hanya target verifikasi.
# Loading SAMA seperti qa-learn/m9_canonical_calc.py: per-aset pct_change
# pada kalender sendiri, dropna -> 481 baris lengkap -> 480 return.
import json
import os
import numpy as np
import pandas as pd

SEED = 42
Z95 = 1.645
Z975 = 1.96


def find_file(candidates):
    # Notebook dijalankan dari folder repo (qa-learn/...) atau oleh nbconvert
    # yang memakai folder notebook sebagai cwd (../qa-learn/...).
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(candidates)


CANON9_PATH = find_file(["qa-learn/m9_canonical.json",
                         "../qa-learn/m9_canonical.json"])
CANON8_PATH = find_file(["qa-learn/m8_canonical.json",
                         "../qa-learn/m8_canonical.json"])
PRICES_PATH = find_file(["data/m4_prices.csv",
                         "../data/m4_prices.csv"])

with open(CANON9_PATH) as f:
    CANON9 = json.load(f)
with open(CANON8_PATH) as f:
    CANON8 = json.load(f)
print(f"Kanonis M9 dimuat dari {CANON9_PATH} (target verifikasi)")
print(f"Kanonis M8 dimuat dari {CANON8_PATH}")

# Basis pasar — DIHITUNG ULANG dari harga (bukan dari kanonik):
# simple daily return portofolio equal-weight BBCA/KLBF/UNVR.
prices = pd.read_csv(PRICES_PATH, index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(p):
    return p.dropna().pct_change(fill_method=None).dropna()


_sr = {c: _simpret(close[c]) for c in close.columns}
RETS = pd.DataFrame({c: _sr[c] for c in ["BBCA", "KLBF", "UNVR"]})
PORT_S = RETS.mean(axis=1)
MU_D = float(PORT_S.mean())
SIGMA_D = float(PORT_S.std(ddof=1))
CORR = RETS.corr().values
SD_STOCK = RETS.std(ddof=1).values
print(f"Portofolio: n={len(PORT_S)} {PORT_S.index[0].date()} -> "
      f"{PORT_S.index[-1].date()}, mu_d={MU_D:.6f}, sigma_d={SIGMA_D:.6f}")
SENS = CANON9["m9_sensitivity"]
VAR95_BASE_CANON = SENS["base_var95_param"]

# Agregat kredit [m8_canonical.json m8_tiering]:
# total LIMIT disetujui + realised loss/profit pada LGD 0,45 / margin 0,05.
TIER = CANON8["m8_tiering"]
APPROVED_LIMIT = TIER["approved_limit_NT"]
REALISED_LOSS_BASE = TIER["realised_loss_approved_NT"]
REALISED_PROFIT_BASE = TIER["realised_profit_approved_NT"]
# DEFAULT_LIMIT [turunan]: realised loss / LGD 0,45.
DEFAULT_LIMIT = REALISED_LOSS_BASE / 0.45
NONDEFAULT_LIMIT = APPROVED_LIMIT - DEFAULT_LIMIT""")

code("""# Tujuan cell ini: memeriksa basis — VaR95 parametrik dan sigma_port dari kovarians (check 1).
# VaR95 = -mu_d + z * sigma_d. Sigma portofolio equal-weight dari matriks
# kovarians: sigma_port = sqrt(w' Sigma w), w = 1/3 tiap saham.
def var95(mu, sigma, z):
    return -mu + z * sigma


w = np.ones(3) / 3
cov = np.outer(SD_STOCK, SD_STOCK) * CORR
sigma_port_cov = float(np.sqrt(w @ cov @ w))
var95_base = var95(MU_D, SIGMA_D, Z95)
print(f"sigma_port dari kovarians = {sigma_port_cov:.4f} (kanonis 0,0196)")
print(f"VaR95 basis = {var95_base:.4f} (kanonis 0,0328)")

# ✅ CHECK 1 — basis direplikasi dari kanonik
assert abs(sigma_port_cov - 0.0196) < 0.0005, sigma_port_cov
assert abs(var95_base - 0.0328) < 0.0005, var95_base
print("✅ CHECK 1 lolos — VaR95 basis 0,0328; sigma_port kovarians 0,0196")""")

md("""## Langkah 1 — Tornado one-at-a-time: tujuh gangguan, satu ranking

Sensitivitas = turunan/beda hingga output terhadap SATU input, semua input lain ditahan tetap. Tiap baris tornado adalah satu gangguan:

- **α 95% → 97,5%** (z 1,645 → 1,96) — pilihan tingkat keyakinan.
- **σ ±10%** — ketidakpastian estimasi σ dari 480 hari.
- **Korelasi +0,1 semua pasangan** — skenario korelasi naik.
- **μ ±0,0005** — gangguan hampir sebesar μ_d itu sendiri.

Rumus yang sama untuk semuanya: `VaR95 = -mu_d + z * sigma_d`. Perhatikan: σ_port dengan korelasi +0,1 dihitung dari matriks kovarians (korelasi naik 0,1, diagonal tetap 1) — BUKAN dari angka bulat 0,0208, supaya hasilnya mereproduksi kanonis 0,0347 persis.""")

code("""# Tujuan cell ini: menghitung tornado VaR + ranking dari delta terbesar (check 2).
# Sigma_port korelasi +0,1 dihitung dari kovarians (bukan dari 0,0208 bulat).
corr_plus01 = np.clip(CORR + 0.1, -1.0, 1.0)
np.fill_diagonal(corr_plus01, 1.0)
cov_plus01 = np.outer(SD_STOCK, SD_STOCK) * corr_plus01
sigma_corr_plus01 = float(np.sqrt(w @ cov_plus01 @ w))

tornado = {
    "alpha_97.5": var95(MU_D, SIGMA_D, Z975),
    "multi": None,  # diisi di Langkah 2 (multi-way)
    "sigma_+10pct": var95(MU_D, SIGMA_D * 1.1, Z95),
    "sigma_-10pct": var95(MU_D, SIGMA_D * 0.9, Z95),
    "corr_+0.1": var95(MU_D, sigma_corr_plus01, Z95),
    "mu_+0.0005": var95(MU_D + 0.0005, SIGMA_D, Z95),
    "mu_-0.0005": var95(MU_D - 0.0005, SIGMA_D, Z95),
}
print(f"sigma_port korelasi +0,1 = {sigma_corr_plus01:.4f} (kanonis 0,0208)")
for name, val in tornado.items():
    if val is None:
        continue
    print(f"{name:>14}: VaR95 = {val:.4f}  (delta {val - var95_base:+.4f}, "
          f"{100 * (val - var95_base) / var95_base:+.1f}%)")

# ✅ CHECK 2 — tornado mereproduksi kanonis
assert abs(tornado["alpha_97.5"] - 0.0390) < 0.0005, tornado["alpha_97.5"]
assert abs(tornado["sigma_+10pct"] - 0.0361) < 0.0005, tornado["sigma_+10pct"]
assert abs(tornado["corr_+0.1"] - 0.0347) < 0.0005, tornado["corr_+0.1"]
assert abs(tornado["mu_+0.0005"] - 0.0323) < 0.0005, tornado["mu_+0.0005"]
print("✅ CHECK 2 lolos — alpha 0,0390; sigma+10% 0,0361; korelasi+0,1 0,0347")""")

md("""## Langkah 2 — Multi-way: σ dan korelasi bergerak BERSAMA

One-at-a-time menahan semua input lain tetap. Dunia nyata tidak begitu: saat stress, vol naik DAN korelasi naik bersamaan — korelasi naik saat stress [M4.5]. Multi-way menggerakkan DUA input sekaligus dan membandingkan hasilnya dengan JUMLAH efek masing-masing sendiri. Selisihnya adalah INTERAKSI.

Kanonis [m9_canonical.json]: σ +10% DAN korelasi +0,1 → VaR95 0,0382 (+16,2%) vs jumlah efek sendiri 9,8% + 5,8% = 15,6% — interaksi +0,6 pp. Efek gabungan SEDIKIT lebih besar dari jumlah bagiannya — jangan klaim «jauh lebih besar».""")

code("""# Tujuan cell ini: efek gabungan sigma+10% DAN korelasi+0,1 + interaksi (check 3).
var95_multi = var95(MU_D, sigma_corr_plus01 * 1.1, Z95)
tornado["multi"] = var95_multi
pct = lambda v: 100.0 * (v - var95_base) / var95_base
interaksi_pp = pct(var95_multi) - pct(tornado["sigma_+10pct"]) - pct(tornado["corr_+0.1"])
ranking = sorted(tornado, key=lambda k: tornado[k] - var95_base, reverse=True)
print(f"multi (sigma+10% & korel+0,1): VaR95 = {var95_multi:.4f} ({pct(var95_multi):+.1f}%)")
print(f"jumlah efek sendiri: {pct(tornado['sigma_+10pct']):.1f}% + "
      f"{pct(tornado['corr_+0.1']):.1f}% = "
      f"{pct(tornado['sigma_+10pct']) + pct(tornado['corr_+0.1']):.1f}%")
print(f"interaksi = {interaksi_pp:+.1f} pp")
print(f"ranking: {ranking}")

# ✅ CHECK 3 — multi-way + ranking mereproduksi kanonis
assert abs(var95_multi - 0.0382) < 0.0005, var95_multi
assert abs(interaksi_pp - 0.6) < 0.3, interaksi_pp
assert ranking[0] == "alpha_97.5", ranking
assert ranking[1] == "multi", ranking
print("✅ CHECK 3 lolos — multi 0,0382; interaksi +0,6 pp; ranking[0] alpha_97.5")""")

md("""## Langkah 3 — Sensitivitas kredit: LGD dan margin menggerakkan profit

Model kredit flagship (GBM terkalibrasi, threshold 0,10, test 6.000) menghasilkan profit +NT$8.214.000 [M6.4]. Dua input BISNIS menggerakkan profit itu: LGD dan margin. Keduanya bukan parameter statistik — LGD adalah asumsi kerugian saat default, margin adalah asumsi harga kredit.

Rumus dari agregat kanonis (bukan 6.000 proba — notebook ini tidak memuat data sebesar itu):

`net profit = margin × LIMIT non-default − LGD × LIMIT default`

dengan LIMIT non-default = NT$398.190.000 [turunan] dan LIMIT default = NT$25.990.000 [turunan: realised loss 11.695.500 ÷ LGD 0,45]. n_approved 1.710, approval 28,5%, bad rate 6,67% TETAP — LGD/margin tidak mengubah SIAPA yang disetujui, hanya berapa uang tiap keputusan. Threshold TIDAK dihitung ulang di sini — ekonomika threshold sudah di M6.4 dan hanya dirujuk: t=0,10 +NT$8.214.000; t=0,15 +NT$5.490.500; t=0,20 −NT$216.500; t=0,50 −NT$18.994.456.""")

code("""# Tujuan cell ini: sensitivitas profit kredit vs LGD dan vs margin (check 4).
# Agregat: APPROVED_LIMIT 424.180.000; DEFAULT_LIMIT 25.990.000 [turunan];
# NONDEFAULT_LIMIT 398.190.000 [turunan]. Basis dicek vs realised kanonis.
def net_profit(lgd, margin):
    return margin * NONDEFAULT_LIMIT - lgd * DEFAULT_LIMIT


print(f"basis check: realised profit {REALISED_PROFIT_BASE:,.0f} vs "
      f"0,05 x non-default {0.05 * NONDEFAULT_LIMIT:,.0f}; "
      f"realised loss {REALISED_LOSS_BASE:,.0f} vs "
      f"0,45 x default {0.45 * DEFAULT_LIMIT:,.0f}")
lgd_grid = {lgd: net_profit(lgd, 0.05) for lgd in [0.40, 0.45, 0.50, 0.60]}
margin_grid = {m: net_profit(0.45, m) for m in [0.04, 0.05, 0.06]}
for lgd, val in lgd_grid.items():
    print(f"LGD {lgd:.2f} -> net profit NT${val:,.0f}")
for m, val in margin_grid.items():
    print(f"margin {m:.2f} -> net profit NT${val:,.0f}")
delta_lgd_per_005 = lgd_grid[0.50] - lgd_grid[0.45]
delta_margin_per_001 = margin_grid[0.06] - margin_grid[0.05]
print(f"tiap +0,05 LGD: NT${delta_lgd_per_005:,.0f}")
print(f"tiap +0,01 margin: NT${delta_margin_per_001:,.0f}")
print(f"per 0,01 yang sama: margin NT${delta_margin_per_001:,.0f} vs "
      f"LGD NT${delta_lgd_per_005 / 5:,.0f}")
margin_paling_sensitif = abs(delta_margin_per_001) > abs(delta_lgd_per_005 / 5)
print(f"margin_paling_sensitif = {margin_paling_sensitif}")

# ✅ CHECK 4 — profit LGD/margin mereproduksi kanonis
assert lgd_grid[0.40] == 9513500, lgd_grid[0.40]
assert lgd_grid[0.45] == 8214000, lgd_grid[0.45]
assert lgd_grid[0.60] == 4315500, lgd_grid[0.60]
assert margin_grid[0.04] == 4232100, margin_grid[0.04]
assert margin_grid[0.06] == 12195900, margin_grid[0.06]
assert delta_lgd_per_005 == -1299500, delta_lgd_per_005
assert delta_margin_per_001 == 3981900, delta_margin_per_001
assert margin_paling_sensitif is True
print("✅ CHECK 4 lolos — LGD 0,40 -> 9.513.500; margin 0,06 -> 12.195.900")""")

md("""## Langkah 4 — Mini-case: komite tanya «VaR naik berapa bila vol naik 20%?»

Godaan terbesar: menjawab «kira-kira dua kali efek 10% — jadi naik sekitar 0,0064, VaR sekitar 0,0392». JANGAN. Bukan karena angkanya jauh salah — di kasus ini angkanya HAMPIR sama (0,0392 vs 0,0393 eksak — selisih 0,0001, murni pembulatan Δ tornado) — melainkan karena METODENYA tidak bisa dipertanggungjawabkan: interpolasi linear dari tornado hanya benar bila output linear dalam input itu DI SELURUH rentang.

Metode yang benar: hitung ulang dari rumus. σ_d tak-bulat 0,0196172; σ × 1,2 = 0,0235406; VaR95 = 0,000558 + 1,645 × 0,0235406 = 0,0393 (+0,0065, +19,7% vs basis) — dengan syarat «bila HANYA vol yang naik 20% dan korelasi tidak berubah». Kenapa interpolasi HAMPIR berhasil? Karena VaR parametrik LINEAR dalam σ — menggandakan Δσ menggandakan ΔVaR, persis, BILA Δ-nya tak-bulat (2 × 0,0032270 = 0,0064540 → 0,0393 eksak). Yang tampil di tornado adalah Δ yang SUDAH DIBULATKAN (0,0032): 2 × 0,0032 = 0,0064 → 0,0392 — selisih 0,0001 dari 0,0393, murni pembulatan.""")

code("""# Tujuan cell ini: mini-case sigma x 1,2 — hitung eksak vs interpolasi (check 5).
sigma_x12 = SIGMA_D * 1.2
var95_sigma_x12 = var95(MU_D, sigma_x12, Z95)
# Tebakan interpolasi dari variabel TAK-BULAT (linearitas -> sama persis),
# dan dari DELTA BULAT yang tampil di tornado (selisih 0,0001, pembulatan).
var95_interp = var95_base + 2 * (tornado["sigma_+10pct"] - var95_base)
var95_interp_bulat = 0.0328 + 2 * 0.0032
print(f"sigma x 1,2 = {sigma_x12:.5f}")
print(f"eksak dari rumus: VaR95 = {var95_sigma_x12:.4f} "
      f"(+{var95_sigma_x12 - var95_base:.4f}, "
      f"{100 * (var95_sigma_x12 - var95_base) / var95_base:+.1f}% vs basis)")
print(f"interpolasi 2x efek 10% (tak-bulat): VaR95 = {var95_interp:.4f}")
print(f"interpolasi 2x efek 10% (delta bulat tornado): VaR95 = {var95_interp_bulat:.4f}")
print("Angkanya HAMPIR sama — selisih 0,0001 murni pembulatan delta tornado — "
      "bukan karena metodenya benar: VaR parametrik LINEAR dalam sigma, jadi "
      "menggandakan delta-sigma menggandakan delta-VaR. Interpolasi yang sama "
      "GAGAL pada alpha (efek z tidak linear) dan GAGAL bila dua input "
      "bergerak bersama (interaksi +0,6 pp).")

# ✅ CHECK 5 — mini-case eksak mereproduksi 0,0393
assert abs(var95_sigma_x12 - 0.0393) < 0.0005, var95_sigma_x12
assert abs(var95_sigma_x12 - var95_interp) < 1e-9  # sama persis (linear)
assert abs(var95_interp_bulat - 0.0392) < 1e-9  # bulat -> 0,0392
print("✅ CHECK 5 lolos — sigma x 1,2 -> VaR95 0,0393 (+19,7% vs basis)")""")

md("""## Langkah 5 — Sensitivitas vs ketidakpastian: dua pertanyaan, dua jawaban

Definisi eksak — **sensitivitas** = «bila input salah sekian, output salah sekian» (turunan/beda hingga terhadap SATU input). **Ketidakpastian** = «seberapa salah input itu» (sebaran estimator). Keduanya dibutuhkan untuk keputusan.

Rujukan (tidak dihitung ulang di sini): VaR95 historis CI95 [0,0229; 0,0322] (iid, B=10.000, n=480) [M9.5] — dibahas penuh di M9.5; bad rate yang disetujui 6,67% CI95 [5,47%; 7,85%] [M8.1]. Peringatan: CI [0,0229; 0,0322] adalah CI untuk VaR95 HISTORIS (0,0286) — bukan untuk VaR95 parametrik 0,0328 yang menjadi basis lesson ini. Jangan tempelkan CI itu pada 0,0328 seolah keduanya estimasi yang sama.

Aturan praktisnya: kalikan keduanya — input yang sensitif DAN tidak pasti adalah yang wajib diselidiki; input yang tidak sensitif boleh tidak pasti; input yang sensitif tapi pasti (α — pilihan, bukan estimasi) wajib DIPUTUSKAN secara eksplisit.""")

code("""# Tujuan cell ini: rangkuman sensitivitas vs ketidakpastian + verifikasi akhir (check 6).
# Sensitivitas (lesson ini, kanonis M9): delta output per gangguan input.
# Ketidakpastian (rujukan): CI95 bootstrap dari M9.5 (VaR) dan M8.1 (bad rate).
ci_var95_hist = CANON9["m9_bootstrap"]["iid_var95"]["ci95"]
ci_bad_rate = CANON8["m8_bootstrap_ci"]["test_n6000"]["bad_rate_approved"]["ci95"]
print("SENSITIVITAS (bila input salah sekian, output salah sekian):")
print(f"  alpha 95->97,5%: VaR +18,8% | sigma +10%: VaR +9,8% | "
      f"korel +0,1: VaR +5,8% | mu +-0,0005: VaR -+1,5%")
print(f"  multi sigma+10% & korel+0,1: VaR +16,2% (interaksi +0,6 pp)")
print(f"  LGD +0,05: profit NT$-1.299.500 | margin +0,01: profit NT$+3.981.900")
print("KETIDAKPASTIAN (seberapa salah input/estimasi itu):")
print(f"  VaR95 historis CI95 [{ci_var95_hist[0]:.4f}; {ci_var95_hist[1]:.4f}] [M9.5]")
print(f"  bad rate 6,67% CI95 [{ci_bad_rate[0] * 100:.2f}%; {ci_bad_rate[1] * 100:.2f}%] [M8.1]")
print(f"  alpha: sensitivitas TERBESAR (+18,8%) tapi ketidakpastian NOL "
      f"(pilihan, bukan estimasi)")

# ✅ CHECK 6 — rangkuman konsisten dengan kanonik
assert abs(ci_var95_hist[0] - 0.0229) < 1e-9 and abs(ci_var95_hist[1] - 0.0322) < 1e-9
assert abs(ci_bad_rate[0] - 0.0547) < 1e-9 and abs(ci_bad_rate[1] - 0.0785) < 1e-9
assert len(ranking) == 7 and ranking[0] == "alpha_97.5"
assert net_profit(0.45, 0.05) == 8214000
print("✅ CHECK 6 lolos — CI rujukan cocok; ranking 7 baris; profit basis 8.214.000")""")

md("""## Penutup

Yang kamu buktikan di notebook ini:

- **Basis direplikasi:** VaR95 parametrik 0,0328 dari μ_d −0,000558 dan σ_d 0,0196; σ_port 0,0196 dihitung dari matriks kovarians — konsisten dari dua arah.
- **Tornado terurut:** α 97,5% di puncak (+18,8%), μ di dasar (±1,5%) — VaR didominasi σ, bukan μ.
- **Multi-way:** σ +10% DAN korelasi +0,1 → +16,2% vs jumlah 15,6% — interaksi +0,6 pp: gabungan SEDIKIT lebih besar, bukan jauh lebih besar.
- **Kredit:** profit PALING sensitif terhadap margin — per 0,01 yang sama, margin NT$3.981.900 vs LGD NT$259.900 (sekitar 15×).
- **Mini-case:** σ × 1,2 → VaR95 0,0393 (+19,7%) — hitung eksak dari rumus; interpolasi «2 × efek 10%» dari Δ bulat tornado memberi 0,0392 — selisih 0,0001 murni pembulatan.
- **Sensitivitas vs ketidakpastian:** dua pertanyaan yang berbeda — keduanya dibutuhkan untuk keputusan. α paling sensitif tapi ketidakpastiannya nol; σ sensitif DAN tidak pasti.

Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu satu angka hasil model, tanyakan «bila inputnya bergerak, jawabannya bergerak berapa — dan input mana yang paling menggerakkannya?» Bila jawabannya tidak ada, angka itu belum menjadi keputusan.""")

nb.cells = cells
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print(f"Ditulis: {OUT} ({len(cells)} sel)")
