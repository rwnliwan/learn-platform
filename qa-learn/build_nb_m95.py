#!/usr/bin/env python3
"""Build notebook MLF-M9.5 (Learn v2 MLF) — Historical Simulation & Bootstrap.

Menulis colab/mlf-m95-guided-task.ipynb (14 sel, markdown+code bergantian,
6 checks assert terhadap angka kanonis qa-learn/m9_canonical.json).
Pola disalin dari notebook MLF-M8.1: helper find_file di cell 1 (nbconvert
menjalankan kernel dengan cwd colab/, sehingga path relatif data/...
GAGAL bila dieksekusi dari colab/ — find_file mencoba repo-root dulu,
lalu relatif), tiap code cell diawali "# Tujuan cell ini", code English +
komentar, penjelasan Indonesia.

Data: data/m4_prices.csv (Close BBCA/KLBF/UNVR), SIMPLE daily returns,
portofolio equal-weight, n=480 (2024-11-04 s.d. 2026-11-11) — deret yang
sama dengan M4.2 VaR dan M5. Bootstrap memakai rng SEGAR (default_rng(42))
per cell agar tiap cell deterministik dan independen dari urutan eksekusi;
toleransi check (mean 0,002 / sd 0,001 / CI 0,002) menutup selisih
rng-segar vs rng-kanonis (maks 0,0009 — diverifikasi dari data sebelum
skrip ini ditulis).

JANGAN eksekusi notebook di sini (tanpa nbconvert) — koordinator yang
mengeksekusi nanti. Skrip ini hanya MENULIS .ipynb-nya (tanpa outputs).

Run: python3 qa-learn/build_nb_m95.py   (dari ~/workspace/learn-platform)
"""
import json
from pathlib import Path

import nbformat as nbf

REPO = Path(__file__).resolve().parent.parent
NB_PATH = REPO / "colab" / "mlf-m95-guided-task.ipynb"

MD0 = """# Guided Task MLF-M9.5: Historical Simulation & Bootstrap — Tiga Cara Menjawab «Berapa VaR?»

**Track Machine Learning Finance — Modul M9 (Simulation, Backtesting & Validation)**

Di notebook ini kamu mereplikasi SEMUA angka kunci lesson M9.5 dari data nyata — dan membuktikan sendiri tiga klaim paling jujur di lesson ini:

- **Satu data, tiga jawaban** — VaR95 portofolio yang sama adalah 0,0286 (HS 480 hari), 0,0328 (parametrik [M4.2]), 0,0329 (Monte Carlo [M9.1]); bootstrap menambahkan pitanya, bukan jawaban keempat.
- **Yang gemuk adalah beyond-VaR** — VaR95 hist LEBIH KECIL dari param, tetapi ES95 hist (0,0445) LEBIH BESAR dari param (0,0410) dan ES99 hist (0,0775) jauh di atas param (0,0528).
- **CI block lebih lebar dari CI iid** — sd VaR95 naik 0,0022 → 0,0029 (+32%) begitu dependensi waktu (autokorelasi kuadrat lag-1 0,1043 [M4.3]) diakui — dan VaR95 parametrik yang tadinya di luar CI iid masuk ke dalam CI block.

Data: harga penutupan BBCA/KLBF/UNVR dari `data/m4_prices.csv`; portofolio equal-weight, SIMPLE daily returns, n=480 hari (2024-11-04 s.d. 2026-11-11); seed 42 di mana-mana.
"""

CODE1 = """# Tujuan cell ini: menyiapkan library, memuat harga + angka kanonis, dan membangun deret return portofolio.
# Deret yang sama dengan M4.2 VaR dan M5: SIMPLE daily returns, equal-weight BBCA/KLBF/UNVR.
import json
import math
import os

import numpy as np
import pandas as pd
from scipy import stats


SEED = 42


def find_file(candidates):
    # Notebook dijalankan dari folder repo (data/...) atau oleh nbconvert
    # yang memakai folder notebook sebagai cwd (../data/...).
    for p in candidates:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(candidates)


PRICES_CSV = find_file(["data/m4_prices.csv", "../data/m4_prices.csv"])
CANON_PATH = find_file(["qa-learn/m9_canonical.json",
                        "../qa-learn/m9_canonical.json"])

try:
    with open(CANON_PATH) as f:
        CANON = json.load(f)
    print(f"Kanonis dimuat dari {CANON_PATH}")
except FileNotFoundError:
    CANON = {"m9_hs_windows": {"window_480": {"var95": 0.0286, "es95": 0.0445,
                                              "var99": 0.0479, "es99": 0.0775}},
             "m9_bootstrap": {"iid_var95": {"mean": 0.0284, "sd": 0.0022,
                                            "ci95": [0.0229, 0.0322]}}}
    print("m9_canonical.json tidak ketemu — memakai target hardcode")

prices = pd.read_csv(PRICES_CSV, index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


sr = {c: _simpret(close[c]) for c in close.columns}
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)
port_l = np.log1p(port_s)
mu_d, sd_d = float(port_s.mean()), float(port_s.std(ddof=1))
mu_l, sd_l = float(port_l.mean()), float(port_l.std(ddof=1))
print(f"portfolio simple returns: n={len(port_s)} mu/day={mu_d:.6f} "
      f"sd/day={sd_d:.4f} | log: mu={mu_l:.6f} sd={sd_l:.4f}")
print(f"dates: {port_s.index[0].date()} -> {port_s.index[-1].date()}")


def r4(x):
    return round(float(x), 4)


def var_hist(x, alpha):
    # VaR historis = minus kuantil empiris (interpolasi linear, cara numpy)
    return float(-np.quantile(x, 1 - alpha))


def es_hist(x, alpha):
    # ES historis = minus rata-rata return pada hari-hari di bawah kuantil
    q = np.quantile(x, 1 - alpha)
    return float(-x[x <= q].mean())


def var_param(x, alpha):
    # VaR parametrik (normal): -(mean + sd * z)
    return float(-(x.mean() + x.std(ddof=1) * stats.norm.ppf(1 - alpha)))


def es_param(x, alpha):
    # ES parametrik (normal): -(mean - sd * phi(z) / (1 - alpha))
    z = stats.norm.ppf(1 - alpha)
    return float(-(x.mean() - x.std(ddof=1) * stats.norm.pdf(z) / (1 - alpha)))
"""

CODE2 = """# Tujuan cell ini: memeriksa ukuran data dan statistik dasar (check 1).
# ✅ CHECK — 480 hari, mean −0,0006, sd 0,0196, 2024-11-04 s.d. 2026-11-11
assert len(port_s) == 480, len(port_s)
assert abs(mu_d - (-0.0006)) <= 0.001, mu_d
assert abs(sd_d - 0.0196) <= 0.001, sd_d
assert str(port_s.index[0].date()) == "2024-11-04"
assert str(port_s.index[-1].date()) == "2026-11-11"
worst = port_s.idxmin()
print(f"✅ check 1 lolos: n=480, mean={mu_d:.4f}, sd={sd_d:.4f}, "
      f"hari terburuk {worst.date()} return {port_s.min():.4f}")
"""

MD3 = """## Langkah 1 — Historical simulation 480 hari + parametrik

VaR95 historis = minus kuantil 5% dari 480 SIMPLE daily returns; ES95 = minus rata-rata 24 hari terburuk (5% dari 480). Parametrik [M4.2] memakai rumus normal dengan mean −0,0006 dan sd 0,0196. Target kanonis [m9_canonical.json + M4.2]: HS VaR95 0,0286 / ES95 0,0445 / VaR99 0,0479 / ES99 0,0775; param VaR95 0,0328 / ES95 0,0410 / VaR99 0,0462 / ES99 0,0528.

Perhatikan TANDANYA nanti: VaR95 hist < param, tetapi ES95 hist > param — kuantil 5% empiris lebih kecil dari normal, ekor di balik VaR lebih gemuk dari normal.
"""

CODE4 = """# Tujuan cell ini: HS 480 hari + parametrik, dan selisih keduanya (check 2).
vh95, eh95 = var_hist(port_s, 0.95), es_hist(port_s, 0.95)
vh99, eh99 = var_hist(port_s, 0.99), es_hist(port_s, 0.99)
vp95, ep95 = var_param(port_s, 0.95), es_param(port_s, 0.95)
vp99, ep99 = var_param(port_s, 0.99), es_param(port_s, 0.99)
print(f"HS  480 hari: VaR95={vh95:.4f} ES95={eh95:.4f} "
      f"VaR99={vh99:.4f} ES99={eh99:.4f}")
print(f"Param normal: VaR95={vp95:.4f} ES95={ep95:.4f} "
      f"VaR99={vp99:.4f} ES99={ep99:.4f}")
print(f"VaR95 param - HS = {vp95 - vh95:.4f}; ES95 param - HS = {ep95 - eh95:.4f}")
print(f"Rp per Rp100 jt: VaR95 HS Rp{int(round(vh95 * 100_000_000)):,}, "
      f"ES95 HS Rp{int(round(eh95 * 100_000_000)):,}")

# ✅ CHECK — HS 480 hari + param cocok kanonis (tol 0,001)
assert abs(vh95 - 0.0286) <= 0.001 and abs(eh95 - 0.0445) <= 0.001
assert abs(vh99 - 0.0479) <= 0.001 and abs(eh99 - 0.0775) <= 0.001
assert abs(vp95 - 0.0328) <= 0.001 and abs(ep95 - 0.0410) <= 0.001
assert abs(vp99 - 0.0462) <= 0.001 and abs(ep99 - 0.0528) <= 0.001
assert vh95 < vp95 and eh95 > ep95  # kuantil lebih kecil, ekor lebih gemuk
print("✅ check 2 lolos: HS 480 hari + param cocok kanonis; "
      "VaR95 hist < param, ES95 hist > param")
"""

MD5 = """## Langkah 2 — Jendela HS: 120 vs 250 vs 480 hari

Jendela = berapa hari TERAKHIR yang dipakai (semuanya berakhir 2026-11-11). Target kanonis [m9_canonical.json]: 120 hari (20 Mei 2026 – 11 November 2026) → VaR95 0,0283, ES95 0,0557, VaR99 0,0472, ES99 0,0941; 250 hari → VaR95 0,0311, ES95 0,0467, VaR99 0,0464, ES99 0,0801; 480 hari → VaR95 0,0286, ES95 0,0445, VaR99 0,0479, ES99 0,0775.

ES95 jendela 120 hari 25% lebih besar dari jendela 480 hari — karena hari terburuk −0,1398 (2026-10-16 [M9.2]) adalah 1 dari 6 hari ekor di jendela 120 hari, bukan 1 dari 24.
"""

CODE6 = """# Tujuan cell ini: HS di tiga jendela + rentang VaR95 antar-jendela (check 3).
windows = {}
for w in [120, 250, 480]:
    sub = port_s.iloc[-w:]
    windows[w] = {"var95": var_hist(sub, 0.95), "es95": es_hist(sub, 0.95),
                  "var99": var_hist(sub, 0.99), "es99": es_hist(sub, 0.99)}
    print(f"jendela {w} hari ({sub.index[0].date()} -> {sub.index[-1].date()}): "
          f"VaR95={windows[w]['var95']:.4f} ES95={windows[w]['es95']:.4f} "
          f"VaR99={windows[w]['var99']:.4f} ES99={windows[w]['es99']:.4f}")
var95_range = max(w["var95"] for w in windows.values()) - min(
    w["var95"] for w in windows.values())
es95_gap_w120_w480 = windows[120]["es95"] - windows[480]["es95"]
print(f"VaR95 bergerak {var95_range:.4f} antar-jendela; "
      f"ES95 120 hari - 480 hari = {es95_gap_w120_w480:.4f}")

# ✅ CHECK — tiga jendela cocok kanonis (tol 0,001); rentang VaR95 0,0028
assert abs(windows[120]["var95"] - 0.0283) <= 0.001
assert abs(windows[120]["es95"] - 0.0557) <= 0.001
assert abs(windows[250]["var95"] - 0.0311) <= 0.001
assert abs(windows[250]["es95"] - 0.0467) <= 0.001
assert abs(windows[480]["var95"] - 0.0286) <= 0.001
assert abs(windows[480]["es95"] - 0.0445) <= 0.001
assert abs(var95_range - 0.0028) <= 0.0005
assert abs(es95_gap_w120_w480 - 0.0112) <= 0.001
print("✅ check 3 lolos: jendela 120/250/480 cocok kanonis; "
      "VaR95 bergerak 0,0028, ES95 jendela 120 hari 0,0112 lebih besar")
"""

MD7 = """## Langkah 3 — Bootstrap iid: pita di sekitar VaR95 HS

Tarik-ulang 480 hari DENGAN pengembalian (satu hari boleh muncul dua kali, hari lain boleh hilang) — itu satu «sejarah alternatif» — hitung VaR95-nya; ulangi B=10.000 kali (seed 42, rng segar di cell ini); baca sebaran 10.000 VaR95 itu. Target kanonis [m9_canonical.json]: VaR95 mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]; ES95 mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569].

Bootstrap CI = ketidakpastian SAMPLING, bukan ketidakpastian model. Laporkan intervalnya — jangan pernah menulis «0,0284 ± 0,0022».
"""

CODE8 = """# Tujuan cell ini: bootstrap iid B=10.000 — CI VaR95/ES95 (check 4).
# rng SEGAR (default_rng(42)) agar cell ini deterministik dan independen
# dari urutan eksekusi; toleransi menutup selisih vs rng kanonis (maks 0,0009).
B = 10_000
rng = np.random.default_rng(SEED)
arr = port_s.values
n = len(arr)
idx = rng.integers(0, n, size=(B, n))
draws_iid = arr[idx]


def _boot_var_es(draws):
    v95 = np.array([float(-np.quantile(d, 0.05)) for d in draws])
    e95 = np.array([float(-d[d <= np.quantile(d, 0.05)].mean()) for d in draws])
    return v95, e95


v95_iid, e95_iid = _boot_var_es(draws_iid)


def _ci(a):
    return [r4(float(np.quantile(a, 0.025))), r4(float(np.quantile(a, 0.975)))]


ci_v95_iid, ci_e95_iid = _ci(v95_iid), _ci(e95_iid)
print(f"iid VaR95: mean={v95_iid.mean():.4f} sd={v95_iid.std(ddof=1):.4f} "
      f"CI95={ci_v95_iid}")
print(f"iid ES95:  mean={e95_iid.mean():.4f} sd={e95_iid.std(ddof=1):.4f} "
      f"CI95={ci_e95_iid}")
print(f"lebar CI VaR95={ci_v95_iid[1] - ci_v95_iid[0]:.4f}; "
      f"lebar CI ES95={ci_e95_iid[1] - ci_e95_iid[0]:.4f}")

# ✅ CHECK — bootstrap iid cocok kanonis (mean tol 0,002; sd tol 0,001; CI tol 0,002)
assert abs(v95_iid.mean() - 0.0284) <= 0.002
assert abs(v95_iid.std(ddof=1) - 0.0022) <= 0.001
assert abs(ci_v95_iid[0] - 0.0229) <= 0.002 and abs(ci_v95_iid[1] - 0.0322) <= 0.002
assert abs(e95_iid.mean() - 0.0440) <= 0.002
assert abs(e95_iid.std(ddof=1) - 0.0057) <= 0.001
assert abs(ci_e95_iid[0] - 0.0346) <= 0.002 and abs(ci_e95_iid[1] - 0.0569) <= 0.002
assert ci_e95_iid[1] - ci_e95_iid[0] > ci_v95_iid[1] - ci_v95_iid[0]  # CI ES lebih lebar
assert not (ci_v95_iid[0] <= 0.0328 <= ci_v95_iid[1])  # param DI LUAR CI iid
print("✅ check 4 lolos: bootstrap iid cocok kanonis; CI ES95 lebih lebar "
      "dari CI VaR95; VaR95 param 0,0328 di luar CI iid")
"""

MD9 = """## Langkah 4 — Block bootstrap + CI mean return

IID memutus urutan waktu — padahal volatilitas bergerombol (autokorelasi return kuadrat lag-1 0,1043 [M4.3]). Moving-block bootstrap menarik BLOK 10 hari berturut-turut (48 blok per ulangan), sehingga gerombol di dalam blok tetap utuh. Panjang blok 10 [kebijakan lesson ini]. Target kanonis [m9_canonical.json]: block-10 VaR95 mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]; block-10 ES95 mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572]; mean daily return −0,0006, CI95 (iid) [−0,0024; +0,0012] — mencakup 0, drift TIDAK signifikan.
"""

CODE10 = """# Tujuan cell ini: block bootstrap (blok 10) + CI mean return (check 5).
# rng SEGAR (default_rng(42)) — sama seperti check 4, deterministik per cell.
rng_blk = np.random.default_rng(SEED)
L = 10
starts = rng_blk.integers(0, n - L + 1, size=(B, math.ceil(n / L)))
blocks = np.stack([arr[s:s + L] for s in starts.reshape(-1)]).reshape(B, -1, L)
draws_blk = blocks.reshape(B, -1)[:, :n]
v95_blk, e95_blk = _boot_var_es(draws_blk)
ci_v95_blk, ci_e95_blk = _ci(v95_blk), _ci(e95_blk)
print(f"block VaR95: mean={v95_blk.mean():.4f} sd={v95_blk.std(ddof=1):.4f} "
      f"CI95={ci_v95_blk}")
print(f"block ES95:  mean={e95_blk.mean():.4f} sd={e95_blk.std(ddof=1):.4f} "
      f"CI95={ci_e95_blk}")

# CI mean daily return (iid, ulangan dari check 4)
means_iid = draws_iid.mean(axis=1)
ci_mean = _ci(means_iid)
print(f"mean daily return: point={mu_d:.4f} CI95 (iid)={ci_mean}")

# ✅ CHECK — block bootstrap + CI mean cocok kanonis
assert abs(v95_blk.mean() - 0.0285) <= 0.002
assert abs(v95_blk.std(ddof=1) - 0.0029) <= 0.001
assert abs(ci_v95_blk[0] - 0.0223) <= 0.002 and abs(ci_v95_blk[1] - 0.0340) <= 0.002
assert abs(e95_blk.mean() - 0.0440) <= 0.002
assert abs(e95_blk.std(ddof=1) - 0.0062) <= 0.001
assert abs(ci_e95_blk[0] - 0.0333) <= 0.002 and abs(ci_e95_blk[1] - 0.0572) <= 0.002
assert v95_blk.std(ddof=1) > v95_iid.std(ddof=1)  # sd block > sd iid (+32% kanonis)
assert ci_v95_blk[1] - ci_v95_blk[0] > ci_v95_iid[1] - ci_v95_iid[0]
assert ci_v95_blk[0] <= 0.0328 <= ci_v95_blk[1]  # param DI DALAM CI block
assert abs(mu_d - (-0.0006)) <= 0.001
assert abs(ci_mean[0] - (-0.0024)) <= 0.002 and abs(ci_mean[1] - 0.0012) <= 0.002
assert ci_mean[0] <= 0 <= ci_mean[1]  # CI mencakup 0: drift tidak signifikan
print("✅ check 5 lolos: block CI lebih lebar dari iid; param masuk CI block; "
      "CI mean return mencakup 0 — drift tidak signifikan")
"""

MD11 = """## Langkah 5 — Laporan komite: satu kalimat yang memuat angka, interval, dan metode

Jawaban lesson ini: «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; parametrik 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk — dalam rupiah per Rp100 juta: VaR95 Rp2.860.000, ES95 Rp4.450.000.»

Susun laporan itu sebagai dict — tiap potongnya tertelusur ke angka kanonis — lalu cetak kalimatnya. Itulah TEMPLATE laporan VaR-mu selanjutnya.
"""

CODE12 = """# Tujuan cell ini: susun laporan komite — verdict + temuan + kalimat (check 6).
report = {
    "var95_hs_480": r4(vh95),
    "ci95_var95_block10": ci_v95_blk,
    "ci95_var95_iid": ci_v95_iid,
    "var95_param": r4(vp95),
    "var95_mc_m91": 0.0329,  # [M9.1] Monte Carlo N=100.000
    "es95_hs_480": r4(eh95),
    "es95_param": r4(ep95),
    "kalimat_komite": (
        f"VaR95 HS (480 hari) {vh95:.4f}, CI95 bootstrap block-10 "
        f"[{ci_v95_blk[0]:.4f}; {ci_v95_blk[1]:.4f}]; "
        f"param {vp95:.4f} sebagai pembanding; ES95 {eh95:.4f} karena ekor gemuk."),
}
print("LAPORAN KOMITE:")
for k, v in report.items():
    print(f"  {k}: {v}")

# ✅ CHECK — laporan cocok kanonis (tol 0,0005 untuk angka eksak)
assert report["var95_hs_480"] == 0.0286
assert report["var95_param"] == 0.0328
assert report["es95_hs_480"] == 0.0445
assert report["es95_param"] == 0.0410
assert abs(report["ci95_var95_block10"][0] - 0.0223) <= 0.0005
assert abs(report["ci95_var95_block10"][1] - 0.0340) <= 0.0005
assert abs(report["ci95_var95_iid"][0] - 0.0229) <= 0.0005
assert abs(report["ci95_var95_iid"][1] - 0.0322) <= 0.0005
assert "0.0286" in report["kalimat_komite"] and "0.0445" in report["kalimat_komite"]
print("✅ check 6 lolos: laporan komite cocok kanonis — angka + interval + metode")
"""

MD13 = """## Penutup

Yang kamu buktikan di notebook ini:

- **HS 480 hari + parametrik:** VaR95 0,0286 / ES95 0,0445 / VaR99 0,0479 / ES99 0,0775; param 0,0328 / 0,0410 / 0,0462 / 0,0528 — VaR95 hist < param, ES95 hist > param.
- **Jendela HS:** 120 hari → VaR95 0,0283, ES95 0,0557; 250 hari → 0,0311 / 0,0467; 480 hari → 0,0286 / 0,0445 — VaR95 bergerak 0,0028 antar-jendela; ES95 jendela 120 hari 0,0112 lebih besar karena hari −0,1398 (2026-10-16).
- **Bootstrap iid (B=10.000):** VaR95 mean 0,0284, sd 0,0022, CI95 [0,0229; 0,0322]; ES95 mean 0,0440, sd 0,0057, CI95 [0,0346; 0,0569]; VaR95 param 0,0328 di luar CI iid.
- **Block bootstrap (blok 10, B=10.000):** VaR95 mean 0,0285, sd 0,0029, CI95 [0,0223; 0,0340]; ES95 mean 0,0440, sd 0,0062, CI95 [0,0333; 0,0572] — CI block lebih lebar dan MENCANGKUP param 0,0328.
- **Mean return:** −0,0006, CI95 (iid) [−0,0024; +0,0012] — mencakup 0, drift tidak signifikan.
- **Laporan komite:** «VaR95 HS (480 hari) 0,0286, CI95 bootstrap block-10 [0,0223; 0,0340]; param 0,0328 sebagai pembanding; ES95 0,0445 karena ekor gemuk».

Ini notebook terakhir track Machine Learning Finance. Kebiasaan yang dibawa pulang: tiap kali seseorang membawakanmu satu angka risiko, tanyakan tiga hal — metode apa, jendela (atau asumsi) apa, dan berapa pitanya. Bila satu jawabannya kosong, angka itu belum menjadi keputusan.
"""


def main():
    cells = [
        ("md", MD0),
        ("code", CODE1),
        ("code", CODE2),
        ("md", MD3),
        ("code", CODE4),
        ("md", MD5),
        ("code", CODE6),
        ("md", MD7),
        ("code", CODE8),
        ("md", MD9),
        ("code", CODE10),
        ("md", MD11),
        ("code", CODE12),
        ("md", MD13),
    ]
    nb = nbf.v4.new_notebook()
    nb.metadata = {
        "kernelspec": {"display_name": "Python 3", "language": "python",
                       "name": "python3"},
        "language_info": {"name": "python", "version": "3.11"},
    }
    for kind, src in cells:
        if kind == "md":
            nb.cells.append(nbf.v4.new_markdown_cell(src))
        else:
            nb.cells.append(nbf.v4.new_code_cell(src))
    # verifikasi struktural (tanpa eksekusi notebook)
    assert len(nb.cells) == 14, len(nb.cells)
    for i, c in enumerate(nb.cells):
        # pola: md, code, code, md, code, md, code, md, code, md, code, md, code, md
        expect = "markdown" if i in (0, 3, 5, 7, 9, 11, 13) else "code"
        assert c.cell_type == expect, f"cell {i}: {c.cell_type} != {expect}"
    for i, c in enumerate(nb.cells):
        if c.cell_type == "code":
            assert c.source.startswith("# Tujuan cell ini"), f"cell {i} tanpa tujuan"
            assert c.outputs == [], f"cell {i} punya output (notebook harus bersih)"
    n_checks = sum(c.source.count("✅ CHECK") for c in nb.cells
                   if c.cell_type == "code")
    assert n_checks == 6, f"checks: {n_checks} (harap 6)"
    nbf.validate(nb)
    NB_PATH.parent.mkdir(parents=True, exist_ok=True)
    nbf.write(nb, str(NB_PATH))
    print(f"OK: {NB_PATH} ditulis — 14 sel, 6 checks, tanpa outputs")


if __name__ == "__main__":
    main()
