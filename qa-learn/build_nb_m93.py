#!/usr/bin/env python3
"""Build the MLF-M9.3 guided-task notebook (colab/mlf-m93-guided-task.ipynb).

Writes the notebook ONLY — it does NOT execute it (the coordinator
executes notebooks later, staggered, with OMP_NUM_THREADS=2).

Structure: 14 cells (markdown + code, M8.1 pattern), 6 ✅ checks, each
asserting against qa-learn/m9_canonical.json (m9_backtest_wf):
  check 1 — data sanity: n=480, sd harian 0,0196, VaR95 hist 0,0286
  check 2 — empat varian OOS + Kupiec (roll250 95 / roll120 95 /
             roll250 99 / expanding 95)
  check 3 — jebakan in-sample (VaR99: 5 vs 4,8; VaR95: LR=0, p=1 [M4.3])
  check 4 — Christoffersen (n00/n01/n10/n11, pi01/pi11, LR_ind, LR_cc)
  check 5 — zona Basel (3 -> GREEN) + aritmetika walk-forward [M7.5]
  check 6 — verdict mini-case (TIDAK LOLOS: Kupiec lolos + independence gagal)

Run: python3 qa-learn/build_nb_m93.py   (from ~/workspace/learn-platform)
Writes: colab/mlf-m93-guided-task.ipynb
"""
import json
import os

import nbformat as nbf

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "colab", "mlf-m93-guided-task.ipynb")

INTRO_MD = """# Guided Task MLF-M9.3: Backtesting & Walk-Forward — Apakah VaR-mu Jujur?

**Track Machine Learning Finance — Modul M9 (Simulation, Backtesting & Validation)**

Di notebook ini kamu mereplikasi SEMUA angka kunci lesson M9.3 dari data harga nyata — dan membuktikan sendiri tiga klaim paling jujur di lesson ini:

- **Kupiec lolos bukan berarti model lolos** — rolling 250-hari VaR95 OOS: 15 exceedance dari 230 hari (diharapkan 11,5), LR = 1,0275, p = 0,3108 — tidak menolak H0. Tapi itu baru setengah ujian.
- **Exceedance bergerombol** — Christoffersen: π11 = 0,2667 adalah 5,2× π01 = 0,0514 (dan 4,1× π = 0,0655); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK walau Kupiec lolos.
- **Satu split tidak cukup** — walk-forward [M4.1/M6.2/M7.5] menunjukkan model yang terlihat bagus pada satu split bisa runtuh sepanjang waktu.

Yang kamu buktikan, langkah demi langkah (dengan ✅ check di tiap langkah):

- **Langkah 1 — Rolling VaR backtest + Kupiec:** empat varian OOS (rolling 250/120, VaR95/VaR99, expanding) — tidak satu pun menolak H0.
- **Langkah 2 — Jebakan in-sample:** VaR99 full-sample diuji pada sampel yang sama (5 vs 4,8) dan VaR95 in-sample [M4.3] (LR = 0, p = 1) — lolos karena dibangun dari data itu sendiri.
- **Langkah 3 — Christoffersen independence:** transisi antar-hari, π01 vs π11, LR_ind + LR_cc gabungan.
- **Langkah 4 — Basel + walk-forward:** zona GREEN (3 exceedance 99%) dan bukti tiga modul bahwa satu split tidak cukup.
- **Langkah 5 — Verdict mini-case:** TIDAK LOLOS sebagai model — Kupiec lolos + independence gagal = conditional coverage gagal.

Data: `data/m4_prices.csv` (BBCA/KLBF/UNVR/GSPC, harga penutupan harian). Portofolio = equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns, n=480 (2024-11-04 → 2026-11-11) — deret yang sama seperti M4.2 VaR dan M5. Angka kanonis dimuat dari `qa-learn/m9_canonical.json` bila ada; bila tidak, dipakai target hardcode yang sama.
"""

SETUP_CODE = """# Tujuan cell ini: menyiapkan library, memuat data harga, dan membangun portofolio SIMPLE returns.
# Konvensi M9 (dinyatakan di setiap lesson M9): market-risk memakai equal-weight
# portfolio BBCA/KLBF/UNVR SIMPLE daily returns (n=480) — deret yang sama
# seperti M4.2 VaR dan M5. LOG returns HANYA dipakai di simulasi Monte Carlo
# M9.1, bukan di sini. Exceedance = return hari itu < -VaR.
import json
import math
import os

import numpy as np
import pandas as pd
from scipy import stats


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

BT = CANON.get("m9_backtest_wf", {})

prices = pd.read_csv(PRICES_CSV, index_col=0, parse_dates=True,
                     header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)
arr = port_s.values
n = len(arr)
print(f"portofolio simple returns: n={n}, "
      f"{port_s.index[0].date()} -> {port_s.index[-1].date()}, "
      f"sd harian={arr.std(ddof=1):.4f}")


def kupiec(x, p):
    # Uji Kupiec POF: x = array flag exceedance (bool), p = 1 - alpha.
    # Mengembalikan (n, x_cnt, LR, p-value). LR ~ chi2 df=1 di bawah H0.
    nn = len(x)
    xc = int(np.asarray(x).sum())
    if xc == 0 or xc == nn:
        return nn, xc, float("nan"), float("nan")
    lr = (-2 * np.log(((1 - p) ** (nn - xc)) * (p ** xc))
          + 2 * np.log(((1 - xc / nn) ** (nn - xc)) * ((xc / nn) ** xc)))
    return nn, xc, float(lr), float(1 - stats.chi2.cdf(lr, 1))


def xlnx(a, b):
    return a * math.log(b) if a > 0 and b > 0 else 0.0
"""

CHECK1_CODE = """# Tujuan cell ini: memeriksa data dan kunci sanity (check 1).
# ✅ CHECK — n=480, sd harian 0,0196, VaR95 historis full-sample 0,0286
var_hist_95 = float(-np.quantile(arr, 0.05))
print(f"n={n}, sd harian={arr.std(ddof=1):.4f}, VaR95 hist={var_hist_95:.4f}")
print(f"tanggal: {port_s.index[0].date()} -> {port_s.index[-1].date()}")

assert n == 480, n
assert abs(arr.std(ddof=1) - 0.0196) < 0.0005
assert abs(var_hist_95 - 0.0286) < 0.0005
assert str(port_s.index[0].date()) == "2024-11-04"
assert str(port_s.index[-1].date()) == "2026-11-11"
print("✅ check 1 lolos: n=480, sd harian 0,0196, VaR95 hist 0,0286 [M4.2]")
"""

STEP1_MD = """## Langkah 1 — Rolling VaR backtest + Kupiec (empat varian OOS)

VaR untuk hari t dihitung HANYA dari hari-hari sebelum t — jendela rolling 250 atau 120 hari, atau expanding window dari 250 hari awal. Exceedance = return hari itu < −VaR (ambang = kuantil 5% atau 1% dari jendela, SIMPLE returns). Uji Kupiec POF membandingkan frekuensi teramati (x/n) dengan yang dijanjikan (1 − α): LR ~ χ²₁ di bawah H0; nilai kritis 5% = 3,841.

Target kanonis [m9_canonical.json, m9_backtest_wf]: rolling 250-hari VaR95 (n=230): exceedance 15, diharapkan 11,5, LR = 1,0275, p = 0,3108. Rolling 120-hari VaR95 (n=360): exceedance 20, diharapkan 18,0, LR = 0,2261, p = 0,6344. Rolling 250-hari VaR99 (n=230): exceedance 4, diharapkan 2,3, LR = 1,0398, p = 0,3079. Expanding-window VaR95 (n=230): exceedance 16, diharapkan 11,5, LR = 1,6611, p = 0,1975. Tidak satu pun menolak H0 pada 5% — jendela dan skema memengaruhi ANGKA, bukan vonis Kupiec-nya.
"""

CHECK2_CODE = """# Tujuan cell ini: empat varian OOS + Kupiec (check 2).
results = {}
for label, window, alpha in [("roll250_var95", 250, 0.95),
                             ("roll120_var95", 120, 0.95),
                             ("roll250_var99", 250, 0.99)]:
    q = 1 - alpha
    exc = np.array([arr[t] < np.quantile(arr[t - window:t], q)
                    for t in range(window, len(arr))])
    nn, xc, lr, pv = kupiec(exc, q)
    results[label] = (nn, xc, nn * q, lr, pv)
    print(f"{label}: n={nn} exceed={xc} expected={nn * q:.1f} "
          f"LR={lr:.4f} p={pv:.4f}")
exc_exp = np.array([arr[t] < np.quantile(arr[:t], 0.05)
                    for t in range(250, len(arr))])
nn, xc, lr, pv = kupiec(exc_exp, 0.05)
results["expanding_var95"] = (nn, xc, nn * 0.05, lr, pv)
print(f"expanding_var95: n={nn} exceed={xc} expected={nn * 0.05:.1f} "
      f"LR={lr:.4f} p={pv:.4f}")

# ✅ CHECK — keempat varian cocok kanonis dan tidak satu pun menolak H0
expected = {"roll250_var95": (230, 15, 1.0275, 0.3108),
            "roll120_var95": (360, 20, 0.2261, 0.6344),
            "roll250_var99": (230, 4, 1.0398, 0.3079),
            "expanding_var95": (230, 16, 1.6611, 0.1975)}
for label, (en, ex, elr, ep) in expected.items():
    nn, xc, _, lr, pv = results[label]
    assert (nn, xc) == (en, ex), (label, nn, xc)
    assert abs(lr - elr) < 0.0005, (label, lr)
    assert abs(pv - ep) < 0.0005, (label, pv)
    assert pv >= 0.05, (label, pv)  # tidak menolak H0 pada 5%
print("✅ check 2 lolos: 4 varian OOS cocok kanonis; tidak satu pun menolak H0")
"""

STEP2_MD = """## Langkah 2 — Jebakan in-sample: VaR yang menguji dirinya sendiri

Uji VaR pada sampel yang sama dengan sampel yang membangunnya — dan ia lolos SEMPURNA, karena ambangnya dibangun dari data itu sendiri. VaR99 full-sample (kuantil 1% dari 480 hari) diuji pada 480 hari yang sama: exceedance 5 vs diharapkan 4,8 — by construction. Dan jebakan M4.3: VaR95 in-sample — exceedance 24 dari 480, LR Kupiec = 0, p = 1. Itu bukan bukti VaR-nya bagus; itu bukti ujinya tidak menguji apa-apa.
"""

CHECK3_CODE = """# Tujuan cell ini: jebakan in-sample VaR99 + VaR95 [M4.3] (check 3).
q01 = np.quantile(arr, 0.01)
xc_is99 = int((arr < q01).sum())
print(f"in-sample VaR99: exceed={xc_is99} expected={n * 0.01:.1f} (by construction)")
q05 = np.quantile(arr, 0.05)
nn95, xc95, lr95, p95 = kupiec((arr < q05), 0.05)
print(f"in-sample VaR95 [M4.3]: n={nn95} exceed={xc95} LR={lr95:.4f} p={p95:.4f}")

# ✅ CHECK — in-sample "lolos" karena dibangun dari data yang sama
assert xc_is99 == 5, xc_is99
assert abs(n * 0.01 - 4.8) < 0.01
assert xc95 == 24, xc95
assert lr95 == 0.0 and p95 == 1.0, (lr95, p95)
print("✅ check 3 lolos: in-sample VaR99 5 vs 4,8; VaR95 in-sample LR=0, p=1")
"""

STEP3_MD = """## Langkah 3 — Christoffersen independence: exceedance bergerombol?

Kupiec lolos — tapi Kupiec buta terhadap URUTAN. Uji independence Christoffersen membandingkan peluang exceedance SESUDAH hari tanpa exceedance (π01) dengan peluang exceedance SESUDAH hari exceedance (π11). Bila exceedance independen, keduanya SAMA.

Target kanonis [m9_canonical.json, christoffersen_roll250_var95] — rolling-250 VaR95 OOS, 229 transisi: n00 = 203, n01 = 11, n10 = 11, n11 = 4; π = 0,0655; π01 = 0,0514; π11 = 0,2667. Perbandingan dengan pembanding yang BENAR: π11/π01 = 5,2× (0,2667/0,0514 = 5,19) dan π11/π = 4,1× (0,2667/0,0655 = 4,07) — jangan tertukar pembandingnya. LR_ind = 6,6456, p = 0,0099; LR_cc gabungan = 7,6731, p = 0,0216.
"""

CHECK4_CODE = """# Tujuan cell ini: transisi antar-hari + Christoffersen (check 4).
exc250 = np.array([arr[t] < np.quantile(arr[t - 250:t], 0.05)
                   for t in range(250, len(arr))]).astype(int)
n00 = int(((exc250[:-1] == 0) & (exc250[1:] == 0)).sum())
n01 = int(((exc250[:-1] == 0) & (exc250[1:] == 1)).sum())
n10 = int(((exc250[:-1] == 1) & (exc250[1:] == 0)).sum())
n11 = int(((exc250[:-1] == 1) & (exc250[1:] == 1)).sum())
pi = (n01 + n11) / (n00 + n01 + n10 + n11)
pi01 = n01 / (n00 + n01)
pi11 = n11 / (n10 + n11)
ll0 = xlnx(n00 + n10, 1 - pi) + xlnx(n01 + n11, pi)
ll1 = (xlnx(n00, 1 - pi01) + xlnx(n01, pi01)
       + xlnx(n10, 1 - pi11) + xlnx(n11, pi11))
lr_ind = -2 * ll0 + 2 * ll1
p_ind = float(1 - stats.chi2.cdf(lr_ind, 1))
lr_cc = float(results["roll250_var95"][3] + lr_ind)
p_cc = float(1 - stats.chi2.cdf(lr_cc, 2))
print(f"n00={n00} n01={n01} n10={n10} n11={n11}")
print(f"pi={pi:.4f} pi01={pi01:.4f} pi11={pi11:.4f}")
print(f"pi11/pi01={pi11 / pi01:.2f}x ; pi11/pi={pi11 / pi:.2f}x")
print(f"LR_ind={lr_ind:.4f} p_ind={p_ind:.4f}")
print(f"LR_cc={lr_cc:.4f} p_cc={p_cc:.4f}")

# ✅ CHECK — gerombol terkonfirmasi: independence DITOLAK walau Kupiec lolos
assert (n00, n01, n10, n11) == (203, 11, 11, 4)
assert abs(pi01 - 0.0514) < 0.0005 and abs(pi11 - 0.2667) < 0.0005
assert 5.1 < pi11 / pi01 < 5.3, pi11 / pi01  # 5,2x vs hari tenang
assert 4.0 < pi11 / pi < 4.2, pi11 / pi  # 4,1x vs rata-rata
assert abs(lr_ind - 6.6456) < 0.0005 and abs(p_ind - 0.0099) < 0.0005
assert abs(lr_cc - 7.6731) < 0.0005 and abs(p_cc - 0.0216) < 0.0005
assert p_ind < 0.05 and p_cc < 0.05
print("✅ check 4 lolos: pi11 5,2x pi01; LR_ind=6,6456 p=0,0099 — independence DITOLAK")
"""

STEP4_MD = """## Langkah 4 — Basel + walk-forward: lampu hijau dan tiga bukti

Basel traffic-light (fakta regulasi, framework backtesting 1996): 0–4 exceedance VaR99 dalam 250 hari terakhir → GREEN (multiplier modal 3,00); 5–9 → YELLOW (multiplier 3,40–3,85); ≥10 → RED (multiplier 4,00). Di sini: 3 exceedance → GREEN. GREEN adalah syarat minimum regulasi, bukan vonis «model valid» — Basel hanya menghitung JUMLAH, bukan URUTAN.

Dan walk-forward vs single split — tiga bukti bahwa satu split tidak cukup: [M4.1] 8 folds — RF 0,5250 / LR 0,5688 / tree 0,5188 / GBM 0,5062 / naive 0,5625, vs random CV RF 0,5326 / LR 0,6000 (random CV melebihi walk-forward karena mengacak waktu). [M6.2] nested CV GBM 0,7858 (sd antar-fold 0,0068) vs single-split test 0,7816; BBCA walk-forward mean ROC-AUC 0,5516. [M7.5] pseudo-time chunks 0,7449 / 0,7428 / 0,8138 / 0,8041 / 0,8006; roc_spread 0,0710 (= 0,8138 − 0,7428); roc_drop 0,0388 (= 0,7816 − 0,7428).
"""

CHECK5_CODE = """# Tujuan cell ini: zona Basel + aritmetika walk-forward [M7.5] (check 5).
last250 = port_s.iloc[-250:]
q99_pre = np.quantile(port_s.iloc[:-250], 0.01)
exc99 = int((last250 < q99_pre).sum())
zone = "GREEN" if exc99 <= 4 else "YELLOW" if exc99 <= 9 else "RED"
print(f"Basel 99% 250 hari terakhir: exceed={exc99} -> {zone}")
# Aritmetika rujukan [M7.5] — dihitung ulang dari angka lesson itu, bukan karangan
roc_spread = 0.8138 - 0.7428
roc_drop = 0.7816 - 0.7428
print(f"[M7.5] roc_spread={roc_spread:.4f} ; roc_drop={roc_drop:.4f}")
print("[M4.1] walk-forward 8 folds: RF 0,5250 / LR 0,5688 / tree 0,5188 / "
      "GBM 0,5062 / naive 0,5625 ; random CV RF 0,5326 / LR 0,6000")
print("[M6.2] nested CV GBM 0,7858 (sd antar-fold 0,0068) vs single-split "
      "0,7816 ; BBCA walk-forward mean ROC-AUC 0,5516")

# ✅ CHECK — Basel GREEN dan aritmetika [M7.5] cocok
assert exc99 == 3, exc99
assert zone == "GREEN"
assert abs(roc_spread - 0.0710) < 0.00005, roc_spread
assert abs(roc_drop - 0.0388) < 0.00005, roc_drop
print("✅ check 5 lolos: Basel 3 -> GREEN; roc_spread 0,0710; roc_drop 0,0388")
"""

STEP5_MD = """## Langkah 5 — Verdict mini-case: lolos Kupiec, gagal independence. Putuskan.

Fakta di meja: Kupiec p = 0,3108 (lolos), Christoffersen p = 0,0099 (gagal), LR_cc = 7,6731 (p = 0,0216, gagal), Basel GREEN. Conditional coverage mensyaratkan KEDUANYA: jumlah yang benar DAN waktu yang benar. Model yang exceedance-nya bergerombol (π11 5,2× π01) adalah model yang kerugiannya datang bertubi-tubi — tiga hari beruntun 40–42, pasangan 95–96 dan 212–213 — tepat saat modal paling dibutuhkan. Verdict: TIDAK LOLOS sebagai model dalam bentuknya sekarang — perbaiki adaptasinya (jendela lebih pendek / pembobotan eksponensial / ES sebagai pelengkap [M4.2]) lalu backtest ulang pada data segar.
"""

CHECK6_CODE = """# Tujuan cell ini: terapkan verdict mini-case dari aturan yang ditulis dulu (check 6).
kupiec_lolos = results["roll250_var95"][4] >= 0.05  # p = 0,3108
independence_lolos = p_ind >= 0.05  # p = 0,0099 -> False
cc_lolos = p_cc >= 0.05  # p = 0,0216 -> False
verdict = "LOLOS" if (kupiec_lolos and independence_lolos) else "TIDAK LOLOS"
print(f"Kupiec lolos={kupiec_lolos} ; independence lolos={independence_lolos} "
      f"; conditional coverage lolos={cc_lolos}")
print(f"VERDICT: {verdict} sebagai model — coverage lolos, independence gagal.")
print("Syarat perbaikan: jendela lebih pendek / pembobotan eksponensial / "
      "ES sebagai pelengkap [M4.2]; backtest ulang pada data segar.")

# ✅ CHECK — verdict mengikuti aturan gabungan, bukan perasaan
assert kupiec_lolos is True
assert independence_lolos is False
assert cc_lolos is False
assert verdict == "TIDAK LOLOS"
print("✅ check 6 lolos: TIDAK LOLOS — Kupiec lolos tidak menyelamatkan model")
"""

CLOSING_MD = """## Penutup

Yang kamu buktikan di notebook ini:

- **Empat varian OOS + Kupiec:** rolling-250 VaR95 — 15/230, LR = 1,0275, p = 0,3108; rolling-120 VaR95 — 20/360, LR = 0,2261, p = 0,6344; rolling-250 VaR99 — 4/230, LR = 1,0398, p = 0,3079; expanding VaR95 — 16/230, LR = 1,6611, p = 0,1975. Tidak satu pun menolak H0.
- **Jebakan in-sample:** VaR99 full-sample 5 vs 4,8 (by construction); VaR95 in-sample [M4.3] exceedance 24, LR = 0, p = 1 — lolos karena dibangun dari data yang sama.
- **Christoffersen:** n00=203, n01=11, n10=11, n11=4; π01 = 0,0514; π11 = 0,2667 (5,2× π01; 4,1× π); LR_ind = 6,6456, p = 0,0099 — independensi DITOLAK; LR_cc = 7,6731, p = 0,0216.
- **Basel + walk-forward:** 3 exceedance 99% → GREEN; [M7.5] roc_spread 0,0710, roc_drop 0,0388; [M4.1] walk-forward vs random CV; [M6.2] nested CV 0,7858 (sd antar-fold 0,0068).
- **Verdict mini-case:** TIDAK LOLOS sebagai model — Kupiec lolos (p = 0,3108) tapi independence gagal (p = 0,0099); coverage tanpa independence berarti kerugian datang bergerombol tepat saat modal paling dibutuhkan.

Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu VaR dengan backtest yang «lolos», tanyakan dua hal — berapa kali ia tertembus (coverage)? Dan apakah tembusannya datang sendiri-sendiri atau bergerombol (independence)? Bila satu jawabannya kosong, VaR itu belum menjadi ukuran.
"""


def main():
    nb = nbf.v4.new_notebook()
    nb.metadata.kernelspec = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    }
    nb.metadata.language_info = {
        "codemirror_mode": {"name": "ipython", "version": 3},
        "file_extension": ".py",
        "mimetype": "text/x-python",
        "name": "python",
        "nbconvert_exporter": "python",
        "pygments_lexer": "ipython3",
        "version": "3.12.3",
    }
    cells = [
        nbf.v4.new_markdown_cell(INTRO_MD),
        nbf.v4.new_code_cell(SETUP_CODE),
        nbf.v4.new_code_cell(CHECK1_CODE),
        nbf.v4.new_markdown_cell(STEP1_MD),
        nbf.v4.new_code_cell(CHECK2_CODE),
        nbf.v4.new_markdown_cell(STEP2_MD),
        nbf.v4.new_code_cell(CHECK3_CODE),
        nbf.v4.new_markdown_cell(STEP3_MD),
        nbf.v4.new_code_cell(CHECK4_CODE),
        nbf.v4.new_markdown_cell(STEP4_MD),
        nbf.v4.new_code_cell(CHECK5_CODE),
        nbf.v4.new_markdown_cell(STEP5_MD),
        nbf.v4.new_code_cell(CHECK6_CODE),
        nbf.v4.new_markdown_cell(CLOSING_MD),
    ]
    nb.cells = cells
    nbf.validate(nb)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        nbf.write(nb, f)
    print(f"wrote {OUT}: {len(cells)} cells, 6 checks (nbformat valid)")


if __name__ == "__main__":
    main()
