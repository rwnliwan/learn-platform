"""Solusi terverifikasi Lab QoQ misi-dua-definisi-revenue (dipakai di TS)."""
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

# Baseline Q4-2025 ditetapkan di briefing (bukan dari data H1)
kas_q4 = 26693794
aku_q4 = 28299736

g_kas_q1 = round((kas_q1 - kas_q4) / kas_q4 * 100, 2)
g_aku_q1 = round((aku_q1 - aku_q4) / aku_q4 * 100, 2)
g_kas_q2 = round((kas_q2 - kas_q1) / kas_q1 * 100, 2)
g_aku_q2 = round((aku_q2 - aku_q1) / aku_q1 * 100, 2)

print("Q1 vs Q4-2025: kas", g_kas_q1, "% | diakui", g_aku_q1, "%")
print("Q2 vs Q1:      kas", g_kas_q2, "% | diakui", g_aku_q2, "%")
