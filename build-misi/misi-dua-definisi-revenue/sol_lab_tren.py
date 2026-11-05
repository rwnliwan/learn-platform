"""Solusi terverifikasi Lab Tren misi-dua-definisi-revenue (dipakai di TS)."""
import pandas as pd
from pyodide.http import open_url

BASE = "/misi/misi-dua-definisi-revenue"
kas = pd.read_csv(open_url(BASE + "/kas_masuk.csv"))
aku = pd.read_csv(open_url(BASE + "/pengakuan.csv"))

kas["bulan"] = kas["tanggal_order"].str[:7]
kas_m = kas.groupby("bulan")["nominal"].sum()
aku_m = aku.groupby("bulan_pengakuan")["nominal_diakui"].sum()

kas_q1 = int(kas_m[["2026-01", "2026-02", "2026-03"]].sum())
kas_q2 = int(kas_m[["2026-04", "2026-05", "2026-06"]].sum())
aku_q1 = int(aku_m[["2026-01", "2026-02", "2026-03"]].sum())
aku_q2 = int(aku_m[["2026-04", "2026-05", "2026-06"]].sum())

tumbuh_kas_pct = round((kas_q2 - kas_q1) / kas_q1 * 100, 2)
tumbuh_aku_pct = round((aku_q2 - aku_q1) / aku_q1 * 100, 2)

print("kas Q1:", kas_q1, "| kas Q2:", kas_q2, "| tumbuh:", tumbuh_kas_pct, "%")
print("diakui Q1:", aku_q1, "| diakui Q2:", aku_q2, "| tumbuh:", tumbuh_aku_pct, "%")
