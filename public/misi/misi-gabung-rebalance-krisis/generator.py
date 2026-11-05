#!/usr/bin/env python3
"""Generator dataset MISI CAPSTONE misi-gabung-rebalance-krisis.

SINTETIS 100% (seed 42) — meniru POLA FRED 2020 (bukan data FRED asli).
Dua file:
  sp500_vix.csv : tanggal,sp500,vix  — hari bursa Jan-Jun 2020
  holdings.csv  : kelas_aset,target_pct,aktual_pct — 8 kelas aset (per 2020-03-16)
Jalankan: python3 gen_data.py  (menulis ke folder public misi)
"""
import numpy as np
import pandas as pd
from pathlib import Path

RNG = np.random.default_rng(42)
OUT = Path.home() / "workspace/learn-platform/public/misi/misi-gabung-rebalance-krisis"

# Hari bursa Jan-Jun 2020 (tanpa libur pasar AS)
bdays = pd.bdate_range("2020-01-01", "2020-06-30")
holidays = pd.to_datetime(["2020-01-01", "2020-01-20", "2020-02-17",
                           "2020-04-10", "2020-05-25"])
days = bdays[~bdays.isin(holidays)]
n = len(days)

# Jangkar SINTETIS meniru pola FRED 2020 (puncak 19 Feb, lembah 23 Mar)
SPX_ANCHORS = {
    "2020-01-02": 3257.85, "2020-02-19": 3386.15, "2020-02-28": 2954.22,
    "2020-03-06": 2972.37, "2020-03-09": 2746.56, "2020-03-11": 2741.38,
    "2020-03-12": 2480.64, "2020-03-13": 2711.02, "2020-03-16": 2386.13,
    "2020-03-20": 2304.92, "2020-03-23": 2237.40, "2020-03-24": 2447.33,
    "2020-03-26": 2630.07, "2020-03-31": 2584.59, "2020-04-30": 2912.43,
    "2020-05-29": 3044.31, "2020-06-11": 3002.10, "2020-06-30": 3100.29,
}
VIX_ANCHORS = {
    "2020-01-02": 13.78, "2020-02-19": 14.38, "2020-02-28": 40.11,
    "2020-03-09": 54.46, "2020-03-12": 75.47, "2020-03-16": 82.69,
    "2020-03-23": 61.59, "2020-03-31": 53.54, "2020-04-30": 34.15,
    "2020-05-29": 27.51, "2020-06-11": 40.79, "2020-06-30": 30.43,
}


def interp_series(anchors, log=False, noise=0.0):
    ad = pd.to_datetime(list(anchors.keys()))
    av = np.array(list(anchors.values()), dtype=float)
    if log:
        av = np.log(av)
    aidx = days.get_indexer(ad)
    vals = np.interp(np.arange(n), aidx, av)
    if noise:
        vals = vals + RNG.normal(0, noise, n)
    if log:
        vals = np.exp(vals)
    out = pd.Series(vals, index=days)
    for d, v in anchors.items():  # jangkar dipaksa tepat (puncak/lembah aman)
        out.loc[d] = v
    return out


spx = interp_series(SPX_ANCHORS, log=True, noise=0.0022).round(2)
vix = interp_series(VIX_ANCHORS, log=False, noise=0.45).clip(lower=8.0).round(2)

df = pd.DataFrame({"tanggal": days.strftime("%Y-%m-%d"),
                   "sp500": spx.values, "vix": vix.values})
df.to_csv(OUT / "sp500_vix.csv", index=False)

# Holdings 8 kelas aset: target vs aktual (meleset setelah kejatuhan)
hold = pd.DataFrame({
    "kelas_aset": ["US Saham Besar", "US Saham Kecil", "Saham Global ex-US",
                   "Obligasi Pemerintah", "Obligasi Korporat", "REIT",
                   "Komoditas", "Kas"],
    "target_pct": [40.0, 10.0, 15.0, 20.0, 5.0, 4.0, 3.0, 3.0],
    "aktual_pct": [35.2, 7.1, 11.3, 25.4, 4.6, 3.5, 3.9, 9.0],
})
assert abs(hold["target_pct"].sum() - 100) < 1e-9
assert abs(hold["aktual_pct"].sum() - 100) < 1e-9
hold.to_csv(OUT / "holdings.csv", index=False)

print("n_baris:", n, "| awal:", df.tanggal.iloc[0], "| akhir:", df.tanggal.iloc[-1])
dd = (spx / spx.cummax() - 1) * 100
i = dd.idxmin()
print("dd_maks: %.4f pada %s (puncak %s)" % (dd.min(), i.strftime("%Y-%m-%d"),
      spx.loc[:i].idxmax().strftime("%Y-%m-%d")))
print("vix_maks: %.2f pada %s" % (vix.max(), vix.idxmax().strftime("%Y-%m-%d")))

# Drawdown akhir bulan (untuk echart)
me = df.copy()
me["ym"] = pd.to_datetime(me["tanggal"]).dt.strftime("%Y-%m")
print("month-end drawdown:")
for ym, g in me.groupby("ym"):
    sub = dd.loc[pd.to_datetime(g["tanggal"])]
    print(" ", ym, round(float(sub.iloc[-1]), 2))

# 10 hari drawdown terburuk (untuk lab SQL)
worst = dd.nsmallest(10)
print("SQL seed (tanggal, dd_pct, vix):")
for d, v in worst.items():
    print("('%s',%.2f,%.2f)," % (d.strftime("%Y-%m-%d"), v,
                                 float(vix.loc[d])))

# Nilai dossier: kondisi pada 2020-03-17 (hari keputusan)
d0 = pd.Timestamp("2020-03-17")
print("2020-03-17: sp500=%.2f dd=%.2f vix=%.2f" % (
    float(spx.loc[d0]), float(dd.loc[d0]), float(vix.loc[d0])))

# Drift & biaya
drift = hold["aktual_pct"] - hold["target_pct"]
L1 = drift.abs().sum()
print("drift L1: %.2f pp | kelas drift maks: %s (%.1f)" % (
    L1, hold.loc[drift.abs().idxmax(), "kelas_aset"], drift.abs().max()))
to_full = L1 / 2 / 100
print("turnover penuh: %.4f | biaya 30bps: %.4f bps | Rp2T: Rp%.0f jt" % (
    to_full, to_full * 10000 * 0.003, to_full * 0.003 * 2e12 / 1e6))
print("turnover parsial(50%%): %.4f | biaya: %.4f bps" % (
    to_full / 2, to_full * 10000 * 0.003 / 2))

import os
for f in ["sp500_vix.csv", "holdings.csv"]:
    p = OUT / f
    print(f, p.stat().st_size, "byte")
