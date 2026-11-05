"""Solusi terverifikasi Lab 1 misi-dashboard-regulator (dipakai di TS)."""
import pandas as pd
from pyodide.http import open_url

URL = "/misi/misi-dashboard-regulator/transaksi.csv"

df = pd.read_csv(open_url(URL))

n_baris = len(df)
tgl_awal = df["tanggal"].min()
tgl_akhir = df["tanggal"].max()

valid = df[df["status"] == "valid"]
n_valid = len(valid)
n_user_aktif_jan = int(valid[valid["tanggal"].str.startswith("2026-01")]["user_id"].nunique())
total_nominal_valid = int(valid["nominal"].sum())

jan_valid = int(((valid["tanggal"] >= "2026-01-01") & (valid["tanggal"] <= "2026-01-31")).sum())
feb_valid = int(((valid["tanggal"] >= "2026-02-01") & (valid["tanggal"] <= "2026-02-28")).sum())
mar_valid = int(((valid["tanggal"] >= "2026-03-01") & (valid["tanggal"] <= "2026-03-31")).sum())

# Jalur B: agregasi harian dulu, baru dijumlahkan (agregasi berlapis)
harian = valid.groupby("tanggal")["nominal"].sum()
total_jalur_b = int(harian.sum())
selisih_dua_jalur = total_nominal_valid - total_jalur_b

print("baris:", n_baris, "|", tgl_awal, "s.d.", tgl_akhir)
print("valid:", n_valid, "| user aktif Jan:", n_user_aktif_jan)
print("total nominal valid:", total_nominal_valid)
print("per bulan:", jan_valid, feb_valid, mar_valid, "| jumlah:", jan_valid + feb_valid + mar_valid)
print("selisih dua jalur:", selisih_dua_jalur)
