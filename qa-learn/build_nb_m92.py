#!/usr/bin/env python3
"""Build colab/mlf-m92-guided-task.ipynb (MLF-M9.2 Scenario & Stress Testing).

14 sel (markdown + code bergantian, pola mlf-m81-guided-task.ipynb):
  c00 intro | c01 setup | c02 check 1 | c03 md L1 | c04 check 2 |
  c05 md L2 | c06 check 3 | c07 md L3 | c08 check 4 | c09 md L4 |
  c10 check 5 | c11 md L5 | c12 check 6 | c13 penutup.

6 checks assert terhadap angka kanonis (m9_canonical.json + m4_canonical.json).
TIDAK mengeksekusi notebook (tanpa nbconvert) — koordinator yang mengeksekusi.

Run: python3 qa-learn/build_nb_m92.py   (dari ~/workspace/learn-platform)
Writes: colab/mlf-m92-guided-task.ipynb
"""
import nbformat as nbf
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "colab" / "mlf-m92-guided-task.ipynb"


def src(text):
    """Teks multi-baris -> daftar baris sumber sel (gaya mlf-m81)."""
    lines = [line + "\n" for line in text.strip("\n").split("\n")]
    lines[-1] = lines[-1].rstrip("\n")
    return lines


def md(cell_id, text):
    cell = nbf.v4.new_markdown_cell(src(text))
    cell["id"] = cell_id
    return cell


def code(cell_id, text):
    cell = nbf.v4.new_code_cell(src(text))
    cell["id"] = cell_id
    return cell


cells = [
    md("m92-c00", """# Guided Task MLF-M9.2: Scenario & Stress Testing — Berapa Rugi Bila Sejarah Terburuk Terulang?

**Track Machine Learning Finance — Modul M9 (Simulation, Backtesting & Validation)**

Di notebook ini kamu mereplikasi SEMUA angka kunci lesson M9.2 dari data harga nyata — dan membuktikan sendiri tiga klaim paling jujur di lesson ini:

- **Hari terburuk bukan guncangan tarif** — 2026-10-16 portofolio −13,98% (Rp13.983.464), hampir DUA KALI 8 April 2025 (−7,43%, Rp7.432.406). Siapa pun yang hanya menyiapkan diri untuk «mengulang 8 April» kekurangan modal hampir dua kali lipat.
- **Vol lebih berbahaya daripada korelasi, di portofolio ini** — σ ×1,5 → VaR95 0,0490; korelasi →1 → VaR95 0,0445. Dan σ ×1,5 «hampir» menyentuh batas 5% — hanya 0,0010 di bawahnya.
- **Reverse stress: batasnya dicari, bukan ditebak** — σ* = 0,0301 (1,53× σ saat ini) adalah volatilitas yang tepat membuat VaR95 = 5%.

Yang kamu buktikan, langkah demi langkah (dengan ✅ check di tiap langkah):

- **Langkah 1 — Replay 8 April 2025:** return SIMPLE per saham + GSPC, kerugian Rp pada Rp100jt.
- **Langkah 2 — 5 hari terburuk + GSPC:** hari terburuk portofolio vs hari terburuk GSPC (2026-11-05, PORT hari itu justru +4,49%).
- **Langkah 3 — Stress hipotetis:** vol ×1,5 / ×2,0 dan korelasi →1 (σ_port = rata-rata simpangan baku per saham).
- **Langkah 4 — Reverse stress:** solver biseksi untuk σ* pada target VaR95 0,05.
- **Langkah 5 — Laporan skenario:** rujukan stress M4.5 + mini-case posisi 2× (Rp14.864.812).

Data: `data/m4_prices.csv` (harga BBCA/KLBF/UNVR + GSPC, 525 baris). Jalankan notebook ini dari folder repo `learn-platform` agar path relatifnya ketemu. Angka kanonis dimuat dari `qa-learn/m9_canonical.json` dan `qa-learn/m4_canonical.json` bila ada; bila tidak, dipakai target hardcode yang sama.
"""),
    code("m92-c01", """# Tujuan cell ini: menyiapkan library, memuat harga, dan membangun return portofolio.
# Konvensi: portofolio equal-weight BBCA/KLBF/UNVR atas SIMPLE daily returns (n=480).
# Helper find_file: notebook tahan terhadap cwd nbconvert (folder colab/).
import json
import math
import os
import numpy as np
import pandas as pd
from scipy import stats

SEED = 42
MODAL = 100_000_000


def find_file(candidates):
    # Notebook dijalankan dari folder repo (data/...) atau oleh nbconvert
    # yang memakai folder notebook sebagai cwd (../data/...).
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(candidates)


def _load_json(candidates, fallback):
    for p in candidates:
        if os.path.exists(p):
            with open(p) as f:
                print(f"Kanonis dimuat dari {p}")
                return json.load(f)
    print("kanonis tidak ketemu — memakai target hardcode")
    return fallback


PRICES_CSV = find_file(["data/m4_prices.csv",
                        "../data/m4_prices.csv"])
CANON = _load_json(["qa-learn/m9_canonical.json",
                    "../qa-learn/m9_canonical.json"], {})
CANON4 = _load_json(["qa-learn/m4_canonical.json",
                     "../qa-learn/m4_canonical.json"], {})


def r4(x):
    return round(float(x), 4)


prices = pd.read_csv(PRICES_CSV, index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)
mu_d, sd_d = float(port_s.mean()), float(port_s.std(ddof=1))
print(f"portofolio simple returns: n={len(port_s)}, mu/hari={mu_d:.6f}, sd/hari={sd_d:.4f}")
print(f"tanggal: {port_s.index[0].date()} -> {port_s.index[-1].date()}")
"""),
    code("m92-c02", """# Tujuan cell ini: memeriksa ukuran deret dan statistik harian (check 1).
# ✅ CHECK — n=480, mu/hari -0,0006, sd/hari 0,0196, VaR95 parametrik 0,0328
assert len(port_s) == 480, len(port_s)
assert r4(mu_d) == -0.0006 and r4(sd_d) == 0.0196
assert str(port_s.index[0].date()) == "2024-11-04"
assert str(port_s.index[-1].date()) == "2026-11-11"
z95 = stats.norm.ppf(0.95)
var95_param = float(-(mu_d + sd_d * stats.norm.ppf(0.05)))
assert r4(var95_param) == 0.0328, var95_param
print("✅ check 1 lolos: n=480, mu/hari -0,0006, sd/hari 0,0196, VaR95 parametrik 0,0328")
"""),
    md("m92-c03", """## Langkah 1 — Replay 8 April 2025: guncangan tarif, per saham, dalam rupiah

Skenario historis adalah replay: ambil SATU hari yang benar-benar terjadi, dan tanyakan «berapa rugi bila hari itu terulang dengan posisi saya hari ini?» Pada 2025-04-08 — guncangan tarif, BUKAN 2026-04-08 (hari itu portofolio justru +3,39%) — SIMPLE daily returns-nya: BBCA −0,0853, KLBF −0,0705, UNVR −0,0672, GSPC −0,0157, PORT −0,0743. Target kanonis [m9_canonical.json]: kerugian pada Rp100jt — BBCA Rp8.529.401, KLBF Rp7.048.462, UNVR Rp6.719.357, GSPC Rp1.570.052, PORT Rp7.432.406.

Perhatian: M4.5 menyebut hari yang sama sebagai «BBCA log return −0,0892 (sekitar −8,5%)» — itu LOG return; −0,0853 di sini adalah SIMPLE return. Keduanya benar, untuk konvensi yang berbeda.
"""),
    code("m92-c04", """# Tujuan cell ini: replay 8 April 2025 — return per saham + kerugian Rp (check 2).
d8 = pd.Timestamp("2025-04-08")
row8 = {c: float(sr[c].loc[d8]) for c in ["BBCA", "KLBF", "UNVR", "GSPC"]}
row8["PORT"] = float(port_s.loc[d8])
loss8 = {k: int(round(-v * MODAL)) for k, v in row8.items()}
print("return 8-Apr-2025 (simple):", {k: r4(v) for k, v in row8.items()})
print("kerugian Rp pada Rp100jt:", loss8)

# ✅ CHECK — return + kerugian Rp cocok kanonis [m9_canonical.json]
assert r4(row8["BBCA"]) == -0.0853 and r4(row8["KLBF"]) == -0.0705
assert r4(row8["UNVR"]) == -0.0672 and r4(row8["GSPC"]) == -0.0157
assert r4(row8["PORT"]) == -0.0743
assert loss8 == {"BBCA": 8529401, "KLBF": 7048462, "UNVR": 6719357,
                 "GSPC": 1570052, "PORT": 7432406}, loss8
print("✅ check 2 lolos: 8-Apr-2025 PORT -0,0743 (Rp7.432.406); BBCA -0,0853 (Rp8.529.401)")
"""),
    md("m92-c05", """## Langkah 2 — 5 hari terburuk + GSPC hari terburuk

Hari TERBURUK portofolio bukan guncangan tarif — target kanonis: 2026-10-16 −0,1398 (Rp13.983.464); 2025-04-08 −0,0743 (Rp7.432.406); 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042). Dan 2026-10-19 hanya tiga hari setelah hari terburuk — kerugian datang BERUNTUN.

GSPC dihitung hanya pada tanggal yang sama-sama hari bursa IDX (kalender AS dan IDX berbeda — mis. 2025-04-04 adalah hari bursa AS, IDX tutup). Target: GSPC hari terburuk 2026-11-05 −0,0436, portofolio hari itu justru +0,0449 — IDX dan AS tidak selalu searah (beta BBCA vs GSPC hanya 0,1272 [M4.1]).
"""),
    code("m92-c06", """# Tujuan cell ini: 5 hari terburuk portofolio + GSPC hari terburuk (check 3).
worst = port_s.nsmallest(5)
worst5 = [(str(d.date()), r4(float(v)), int(round(-float(v) * MODAL)))
          for d, v in worst.items()]
print("5 hari terburuk:", worst5)
common_idx = sr["GSPC"].index.intersection(port_s.index)
gspc_worst_day = sr["GSPC"].loc[common_idx].idxmin()
gspc_worst = {"date": str(gspc_worst_day.date()),
              "gspc_return": r4(float(sr["GSPC"].loc[gspc_worst_day])),
              "port_return": r4(float(port_s.loc[gspc_worst_day]))}
print("GSPC hari terburuk:", gspc_worst)

# ✅ CHECK — worst5 + GSPC cocok kanonis
assert worst5 == [("2026-10-16", -0.1398, 13983464),
                  ("2025-04-08", -0.0743, 7432406),
                  ("2025-02-28", -0.0728, 7284287),
                  ("2026-04-24", -0.0522, 5217623),
                  ("2026-10-19", -0.0483, 4833042)], worst5
assert gspc_worst == {"date": "2026-11-05", "gspc_return": -0.0436,
                      "port_return": 0.0449}, gspc_worst
print("✅ check 3 lolos: terburuk 2026-10-16 -0,1398 (Rp13.983.464); GSPC terburuk 2026-11-05 -0,0436, PORT hari itu +0,0449")
"""),
    md("m92-c07", """## Langkah 3 — Stress hipotetis: vol ×1,5 / ×2,0 dan korelasi →1

Skenario hipotetis mengubah SATU parameter: volatilitas (σ) atau korelasi (ρ). Rumus VaR parametrik [M4.2]: VaR95(σ) = −(μ + σ·Φ⁻¹(0,05)) = 1,6449·σ + 0,0006 (μ = −0,0006). Target kanonis [m9_canonical.json]: σ ×1,5 → VaR95 0,0490; σ ×2,0 → VaR95 0,0651; korelasi →1 → σ_port 0,0267 (rata-rata simpangan baku per saham: BBCA 0,0217; KLBF 0,0268; UNVR 0,0316) → VaR95 0,0445.

Kenapa stress vol masuk akal? Karena vol TIDAK KONSTAN — M4.3 (EWMA/GARCH) mengajarkan volatilitas bergerombol. Dan ingat: stress satu-faktor (σ saja, atau ρ saja) memberi batas bawah kerugian krisis — krisis sungguhan menggerakkan keduanya sekaligus.
"""),
    code("m92-c08", """# Tujuan cell ini: stress vol x1,5 / x2,0 dan korelasi -> 1 (check 4).
def var95_sigma(sigma):
    return float(-(mu_d + sigma * stats.norm.ppf(0.05)))


var95_x15 = r4(var95_sigma(1.5 * sd_d))
var95_x2 = r4(var95_sigma(2.0 * sd_d))
sig_i = {c: float(sr[c].std(ddof=1)) for c in ["BBCA", "KLBF", "UNVR"]}
sig_rho1 = float(np.mean(list(sig_i.values())))
var95_rho1 = r4(var95_sigma(sig_rho1))
print("sd per saham:", {k: r4(v) for k, v in sig_i.items()})
print(f"sigma x1,5: VaR95={var95_x15:.4f}; sigma x2,0: VaR95={var95_x2:.4f}")
print(f"korelasi -> 1: sigma_port={r4(sig_rho1):.4f} (vs {r4(sd_d):.4f}), VaR95={var95_rho1:.4f}")

# ✅ CHECK — stress cocok kanonis [m9_canonical.json]
assert var95_x15 == 0.049 and var95_x2 == 0.0651
assert r4(sig_rho1) == 0.0267 and var95_rho1 == 0.0445
assert {k: r4(v) for k, v in sig_i.items()} == {"BBCA": 0.0217, "KLBF": 0.0268, "UNVR": 0.0316}
print("✅ check 4 lolos: sigma x1,5 -> VaR95 0,0490; x2,0 -> 0,0651; korelasi -> 1 -> sigma 0,0267, VaR95 0,0445")
"""),
    md("m92-c09", """## Langkah 4 — Reverse stress: berapa besar guncangan yang membuat VaR95 = 5%?

Reverse stress membalik pertanyaan: «VaR berapa yang TIDAK BOLEH terjadi — dan sebesar apa guncangan yang menyebabkannya?» Batas lesson ini: VaR95 = 0,05 [kebijakan lesson ini — ambang 5% sebagai batas kerugian harian yang memicu eskalasi ke komite]. Solver-nya adalah biseksi pada selang [0,01; 0,10] — VaR95 di 0,01 adalah 0,0170 (di bawah target), di 0,10 adalah 0,1651 (di atas target).

Target kanonis: σ* = 0,0301 — yaitu 1,53× σ saat ini (rasio kanonis 1,5323). Perhatikan: σ ×1,5 memberi VaR95 0,0490 — hanya 0,0010 di bawah target. «Hampir menyentuh» bukanlah «aman».
"""),
    code("m92-c10", """# Tujuan cell ini: reverse stress — cari sigma* untuk target VaR95 0,05 (check 5).
TARGET = 0.05
lo, hi = 0.01, 0.10
for _ in range(60):
    mid = 0.5 * (lo + hi)
    if var95_sigma(mid) < TARGET:
        lo = mid
    else:
        hi = mid
sigma_star = 0.5 * (lo + hi)
sigma_star_ratio = sigma_star / sd_d
print(f"sigma*={sigma_star:.4f} = {sigma_star_ratio:.4f}x sigma saat ini")
print(f"verifikasi: VaR95(sigma*)={r4(var95_sigma(sigma_star)):.4f}")

# ✅ CHECK — sigma* cocok kanonis (toleransi 0,0005 — mu dibulatkan)
assert abs(sigma_star - 0.0301) <= 0.0005, sigma_star
assert abs(r4(sigma_star_ratio) - 1.5323) <= 0.001, sigma_star_ratio
assert r4(var95_sigma(sigma_star)) == 0.05
print("✅ check 5 lolos: sigma* = 0,0301 (1,53x sigma saat ini); sigma x1,5 memberi 0,0490 — hanya 0,0010 di bawah target")
"""),
    md("m92-c11", """## Langkah 5 — Laporan skenario: rujukan M4.5 + mini-case posisi 2×

Langkah terakhir merujuk stress M4.5 dan menjawab mini-case komite. Target rujukan [M4.5, basis LOG return — basisnya VaR95 0,0324, bukan 0,0328 SIMPLE lesson ini]: korelasi 0,95 → VaR95 0,0324 → 0,0431; diversification ratio 1,353 → 1,0169; korelasi high-vol 0,3752 vs low-vol 0,2775; maxDD PORT −0,4363, GSPC −0,1890.

Mini-case: «berapa rugi bila 8 April 2025 terulang dengan posisi 2×?» — jawabannya 2 × Rp7.432.406 = Rp14.864.812, dengan syarat: skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama (equal-weight BBCA/KLBF/UNVR).
"""),
    code("m92-c12", """# Tujuan cell ini: susun laporan skenario — M4.5 + mini-case 2x (check 6).
m45 = {"var95_base_log": CANON4.get("stress_var95_base", 0.0324),
       "var95_corr095_log": CANON4.get("stress_var95_095", 0.0431),
       "div_ratio_base": CANON4.get("div_ratio_base", 1.353),
       "div_ratio_095": CANON4.get("div_ratio_095", 1.0169),
       "corr_high_vol": CANON4.get("regime_corr_high", 0.3752),
       "corr_low_vol": CANON4.get("regime_corr_low", 0.2775),
       "maxdd_port": CANON4.get("mdd_PORT", -0.4363),
       "maxdd_gspc": CANON4.get("mdd_GSPC", -0.189)}
loss_2x = 2 * loss8["PORT"]
report = {
    "skenario": "8 April 2025 terulang, posisi 2x (equal-weight BBCA/KLBF/UNVR)",
    "loss_8apr_1x_Rp": loss8["PORT"],
    "loss_8apr_2x_Rp": loss_2x,
    "hari_terburuk": worst5[0],
    "sigma_star": r4(sigma_star),
    "sigma_star_ratio": r4(sigma_star_ratio),
    "m45_korelasi_095": m45,
    "syarat": "skala linear hanya berlaku tanpa gesekan likuiditas/biaya dan dengan posisi yang sama",
}
print(json.dumps(report, indent=2, ensure_ascii=False))

# ✅ CHECK — laporan lengkap: M4.5 + mini-case 2x
assert m45["var95_corr095_log"] == 0.0431 and m45["div_ratio_095"] == 1.0169
assert m45["maxdd_port"] == -0.4363 and m45["maxdd_gspc"] == -0.189
assert loss_2x == 14864812, loss_2x
assert report["hari_terburuk"] == ("2026-10-16", -0.1398, 13983464)
print("✅ check 6 lolos: laporan lengkap — M4.5 (VaR95 0,0431, div ratio 1,0169) + mini-case 2x Rp14.864.812")
"""),
    md("m92-c13", """## Penutup

Yang kamu buktikan di notebook ini:

- **Replay 8 April 2025:** PORT SIMPLE −0,0743 (Rp7.432.406); BBCA −0,0853 (Rp8.529.401), KLBF −0,0705 (Rp7.048.462), UNVR −0,0672 (Rp6.719.357), GSPC −0,0157 (Rp1.570.052). M4.5 menyebut hari yang sama sebagai BBCA LOG return −0,0892.
- **5 hari terburuk:** 2026-10-16 −0,1398 (Rp13.983.464 — TERBURUK); 2025-04-08 −0,0743; 2025-02-28 −0,0728 (Rp7.284.287); 2026-04-24 −0,0522 (Rp5.217.623); 2026-10-19 −0,0483 (Rp4.833.042). GSPC terburuk 2026-11-05 −0,0436, PORT hari itu +0,0449.
- **Stress hipotetis:** σ ×1,5 → VaR95 0,0490; σ ×2,0 → VaR95 0,0651; korelasi →1 → σ_port 0,0267, VaR95 0,0445.
- **Reverse stress:** σ* = 0,0301 (1,53× σ saat ini) untuk VaR95 = 0,05; σ ×1,5 memberi 0,0490 — hanya 0,0010 di bawah target.
- **Laporan skenario:** M4.5 (korelasi 0,95 → VaR95 0,0431, diversification ratio 1,353 → 1,0169; maxDD PORT −0,4363) + mini-case posisi 2× Rp14.864.812.

Ini lesson kedua Modul M9. Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu VaR yang terlihat aman, tanyakan tiga hal — berapa rugi bila hari terburuk terulang, berapa besar guncangan yang menyentuh batasmu, dan apakah skenario itu dipilih sebelum atau sesudah hasilnya dilihat. Bila satu jawabannya kosong, angka VaR itu belum menjadi keputusan.

Tautan Colab: (diisi koordinator setelah notebook diunggah ke Drive)
"""),
]

nb = nbf.v4.new_notebook()
nb.cells = cells
nb.metadata = {
    "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
    "language_info": {
        "codemirror_mode": {"name": "ipython", "version": 3},
        "file_extension": ".py",
        "mimetype": "text/x-python",
        "name": "python",
        "nbconvert_exporter": "python",
        "pygments_lexer": "ipython3",
        "version": "3.12.3",
    },
}
nb.nbformat = 4
nb.nbformat_minor = 5

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    nbf.write(nb, f)
print(f"ditulis: {OUT} ({len(cells)} sel)")
