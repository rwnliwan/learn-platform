#!/usr/bin/env python3
"""Membangun snapshot beku untuk MISI M1 grup PASAR & PELAPORAN.

Market Risk A (misi-var-backtest): FRED SP500 harian 2019-01-01..2021-06-30 (public domain, US federal data)
Market Risk B (misi-stress-korelasi): FRED SP500 + VIXCLS + DGS10, jendela sama
Risk Reporting A (misi-rekonsiliasi-laporan): Statlog German Credit (UCI, CC BY 4.0 — terverifikasi di halaman dataset 2026-10-15), decode penuh
Risk Reporting B (misi-laporan-dua-sumber): dua ekstrak dari loan book yang sama (30 baris status berbeda = perbedaan definisi)

Seed: 42. Tanggal tangkapan: 2026-10-15.
Jalankan: python3 build_m1_pasar_pelaporan.py   (dari folder misi-data/)
"""
import os, math, random
import pandas as pd
import numpy as np

SEED = 42
random.seed(SEED); np.random.seed(SEED)
SRC = "/tmp/m1data"
PUB = "../public/misi"

def fred(path):
    df = pd.read_csv(path)
    df.columns = ["tanggal", "nilai"]
    df = df[df["nilai"] != "."].copy()
    df["nilai"] = df["nilai"].astype(float)
    df["tanggal"] = pd.to_datetime(df["tanggal"])
    return df.sort_values("tanggal").reset_index(drop=True)

# ═══════════════ 1. MARKET RISK A — VaR backtest ═══════════════
spx = fred(f"{SRC}/fred/SP500.csv")
spx["ret_pct"] = 100 * np.log(spx["nilai"] / spx["nilai"].shift(1))
ret = spx.dropna(subset=["ret_pct"]).copy()
out_a = pd.DataFrame({
    "tanggal": ret["tanggal"].dt.strftime("%Y-%m-%d"),
    "harga_penutupan": ret["nilai"].round(2),
    "imbal_hasil_pct": ret["ret_pct"].round(4),
})
d_a = f"{PUB}/misi-var-backtest"; os.makedirs(d_a, exist_ok=True)
out_a.to_csv(f"{d_a}/imbal_hasil.csv", index=False)

# Laporan mesin VaR bank: VaR99 parametrik = 2.33 * std 250 hari (sebagai % kerugian positif)
roll_std = ret["ret_pct"].rolling(250).std()
var99 = 2.3263 * roll_std
eng = pd.DataFrame({
    "tanggal": ret["tanggal"].dt.strftime("%Y-%m-%d"),
    "var99_pct": var99.round(4),
}).dropna()
eng.to_csv(f"{d_a}/laporan_var_mesin.csv", index=False)

# ── nilai ekspektasi lab (hardcode ke checks TS) ──
r = ret["ret_pct"].values
last_var = float(2.3263 * pd.Series(r).rolling(250).std().iloc[-1])
breaches = int((r < -last_var).sum())
n, x, p = len(r), breaches, 0.01
lr = -2 * (math.log(((1-p)**(n-x)) * (p**x)) - math.log(((1-x/n)**(n-x)) * ((x/n)**x)))
worst_i = int(np.argmin(r))
print("== MR-A ==")
print("rows:", len(out_a), "| range:", out_a.tanggal.iloc[0], "->", out_a.tanggal.iloc[-1])
print("worst:", out_a.tanggal.iloc[worst_i], round(float(r[worst_i]), 4))
print("last_var99:", round(last_var, 4), "| breaches:", breaches, "| kupiec_LR:", round(lr, 4))
severe = ret[r < -2*last_var][["tanggal","ret_pct"]].copy()
severe["tanggal"] = severe["tanggal"].dt.strftime("%Y-%m-%d")
print("severe breaches:", len(severe))
for _, row in severe.sort_values("ret_pct").iterrows():
    print(f"  {row['tanggal']} {round(row['ret_pct'],4)}")

# ═══════════════ 2. MARKET RISK B — stress multi-seri ═══════════════
vix = fred(f"{SRC}/fred/VIXCLS.csv"); y10 = fred(f"{SRC}/fred/DGS10.csv")
m = spx.merge(vix, on="tanggal", suffixes=("", "_vix")).merge(y10, on="tanggal", suffixes=("", "_y10"))
m = m.rename(columns={"nilai": "spx", "nilai_vix": "vix", "nilai_y10": "y10"})
m["spx_ret"] = 100*np.log(m["spx"]/m["spx"].shift(1))
m["vix_chg"] = m["vix"] - m["vix"].shift(1)
m["y10_chg"] = m["y10"] - m["y10"].shift(1)
m = m.dropna().reset_index(drop=True)
out_b = pd.DataFrame({
    "tanggal": m["tanggal"].dt.strftime("%Y-%m-%d"),
    "spx": m["spx"].round(2), "spx_ret": m["spx_ret"].round(4),
    "vix": m["vix"].round(2), "vix_chg": m["vix_chg"].round(2),
    "y10": m["y10"].round(2), "y10_chg": m["y10_chg"].round(3),
})
d_b = f"{PUB}/misi-stress-korelasi"; os.makedirs(d_b, exist_ok=True)
out_b.to_csv(f"{d_b}/pasar_stress.csv", index=False)
calm = m[m["tanggal"] < "2020-01-01"]; cris = m[(m["tanggal"] >= "2020-02-20") & (m["tanggal"] <= "2020-04-30")]
corr_calm = float(calm["spx_ret"].corr(calm["vix_chg"])); corr_cris = float(cris["spx_ret"].corr(cris["vix_chg"]))
worst_b = int(m["spx_ret"].idxmin()); vmax = int(m["vix"].idxmax())
roll_vol = float(m["spx_ret"].rolling(21).std().iloc[-1])
trough = m.loc[int(m["spx"].idxmin())]
stress_days = m[(m["spx_ret"] < -3) & (m["vix_chg"] > 5)][["tanggal","spx_ret","vix_chg"]]
print("== MR-B ==")
print("rows:", len(out_b))
print("worst_spx:", m["tanggal"].iloc[worst_b].strftime("%Y-%m-%d"), round(float(m['spx_ret'].iloc[worst_b]),4))
print("vix_max:", round(float(m['vix'].iloc[vmax]),2), "on", m["tanggal"].iloc[vmax].strftime("%Y-%m-%d"))
print("corr_calm:", round(corr_calm,4), "| corr_crisis:", round(corr_cris,4))
print("roll21_vol_last:", round(roll_vol,4))
print("trough:", trough["tanggal"].strftime("%Y-%m-%d"), round(float(trough["spx"]),2))
print("stress_days:", len(stress_days))
for _, row in stress_days.iterrows():
    print(f"  {row['tanggal'].strftime('%Y-%m-%d')} spx={round(row['spx_ret'],2)} vix_chg={round(row['vix_chg'],2)}")

# ═══════════════ 3/4. RISK REPORTING — German Credit ═══════════════
cols = ["rekening_giro","durasi_bulan","riwayat_kredit","tujuan","plafon_kredit","tabungan",
        "lama_kerja","cicilan_pct","status_pribadi","penjamin","lama_tinggal","properti","usia",
        "cicilan_lain","hunian","kredit_berjalan","pekerjaan","tanggungan","telepon","pekerja_asing"]
dec = {
 "rekening_giro": {"A11":"saldo negatif","A12":"0-200 DM","A13":">=200 DM / gaji >=1 thn","A14":"tanpa rekening giro"},
 "riwayat_kredit": {"A30":"lunas tepat waktu","A31":"lunas di bank ini","A32":"kredit berjalan lancar","A33":"pernah menunggak","A34":"kritis/ada kredit lain"},
 "tujuan": {"A40":"mobil baru","A41":"mobil bekas","A42":"furnitur/elektronik","A43":"radio/televisi","A44":"peralatan rumah tangga","A45":"renovasi","A46":"pendidikan","A47":"liburan","A48":"pelatihan ulang","A49":"usaha","A410":"lainnya"},
 "tabungan": {"A61":"<100 DM","A62":"100-500 DM","A63":"500-1000 DM","A64":">=1000 DM","A65":"tidak ada/tdk diketahui"},
 "lama_kerja": {"A71":"menganggur","A72":"<1 tahun","A73":"1-4 tahun","A74":"4-7 tahun","A75":">=7 tahun"},
 "hunian": {"A151":"sewa","A152":"milik sendiri","A153":"gratis"},
 "pekerjaan": {"A171":"tidak terampil","A172":"tidak terampil (residen)","A173":"terampil/karyawan","A174":"manajer/wiraswasta"},
}
raw = pd.read_csv(f"{SRC}/german.data", sep=r"\s+", header=None, names=cols+["x"])
num = pd.read_csv(f"{SRC}/german.data-numeric", sep=r"\s+", header=None)
status = num.iloc[:, -1].map({1: "lancar", 2: "macet"})
lb = pd.DataFrame({"id": range(1, 1001)})
for c in cols:
    lb[c] = raw[c].map(dec[c]) if c in dec else raw[c]
lb["status"] = status.values
keep = ["id","rekening_giro","durasi_bulan","riwayat_kredit","tujuan","plafon_kredit","tabungan",
        "lama_kerja","cicilan_pct","usia","hunian","kredit_berjalan","pekerjaan","status"]
lb = lb[keep]
d_ra = f"{PUB}/misi-rekonsiliasi-laporan"; os.makedirs(d_ra, exist_ok=True)
lb.to_csv(f"{d_ra}/loan_book.csv", index=False)

npl = (lb["status"]=="macet").mean()*100
by_p = lb.groupby("tujuan")["status"].apply(lambda s: (s=="macet").mean()*100).sort_values(ascending=False)
mean_m = lb[lb.status=="macet"]["cicilan_pct"].mean(); mean_l = lb[lb.status=="lancar"]["cicilan_pct"].mean()
print("== RR-A ==")
print("rows:", len(lb), "| NPL:", round(npl,2))
print("worst purpose:", by_p.index[0], round(by_p.iloc[0],2))
for t, v in by_p.items(): print(f"  {t}: {round(v,2)} (n={(lb.tujuan==t).sum()})")
print("cicilan mean macet:", round(mean_m,3), "| lancar:", round(mean_l,3), "| max:", lb.cicilan_pct.max())

# Misi B: dua ekstrak — 30 baris status berbeda (perbedaan definisi as-of)
d_rb = f"{PUB}/misi-laporan-dua-sumber"; os.makedirs(d_rb, exist_ok=True)
core = lb.copy()
mart = lb.copy()
diff_idx = sorted(random.sample(range(1000), 30))
flip = {"lancar": "macet", "macet": "lancar"}
for i in diff_idx:
    mart.loc[i, "status"] = flip[mart.loc[i, "status"]]
core.to_csv(f"{d_rb}/core_banking.csv", index=False)
mart.to_csv(f"{d_rb}/risk_mart.csv", index=False)
# koreksi bisnis: 12 baris dari mart yang "dikoreksi" (10 di antaranya = kembali ke core, 2 salah arah)
corr_idx = sorted(random.sample(diff_idx, 12))
koreksi = mart.loc[corr_idx, ["id","tujuan","plafon_kredit","status"]].copy()
koreksi = koreksi.rename(columns={"status": "status_mart"})
koreksi["status_koreksi"] = [flip[s] if random.random() < 0.85 else s for s in koreksi["status_mart"]]
koreksi.to_csv(f"{d_rb}/koreksi_bisnis.csv", index=False)
npl_core = (core.status=="macet").mean()*100; npl_mart = (mart.status=="macet").mean()*100
print("== RR-B ==")
print("diff rows:", len(diff_idx), "| NPL core:", round(npl_core,2), "| NPL mart:", round(npl_mart,2), "| gap_pp:", round(npl_mart-npl_core,2))
by_p_core = core.groupby("tujuan")["status"].apply(lambda s:(s=="macet").mean()*100)
by_p_mart = mart.groupby("tujuan")["status"].apply(lambda s:(s=="macet").mean()*100)
gap_p = (by_p_mart - by_p_core).abs().sort_values(ascending=False)
print("top purpose gap:", gap_p.index[0], round(gap_p.iloc[0],2))
n_back = int((koreksi["status_koreksi"] == core.loc[corr_idx, "status"].values).sum())
print("koreksi rows:", len(koreksi), "| kembali ke core:", n_back)
# NPL mart setelah koreksi diterapkan
m2 = mart.copy()
m2.loc[corr_idx, "status"] = koreksi["status_koreksi"].values
print("NPL mart+koreksi:", round((m2.status=="macet").mean()*100, 2))
print("NPL ringkasan vs detail (cek manual via loan_book.csv)")

# ═══════════════ METODE.md per misi ═══════════════
CAPTURE = "2026-10-15"
FRED_NOTE = ("Sumber: FRED, Federal Reserve Bank of St. Louis (fred.stlouisfed.org) — data publik pemerintah federal AS. "
             "Seri diunduh via fredgraph CSV pada 2026-10-15 dan dibekukan tanpa perubahan.")
UCINOTE = ("Sumber: Statlog German Credit Data, UCI Machine Learning Repository "
           "(https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data) — lisensi CC BY 4.0 "
           "(terverifikasi di halaman dataset pada 2026-10-15). Atribusi: Prof. Dr. Hans Hofmann, Universitaet Hamburg, via UCI ML Repository.")

open(f"{d_a}/METODE.md","w").write(f"""# METODE — Misi VaR: Model yang Terlalu Tenang (misi-var-backtest)

- **Sumber data:** {FRED_NOTE}
- **Seri:** SP500 (S&P 500, harian), 2019-01-01 s.d. 2021-06-30.
- **Metode:** imbal hasil log harian `100*ln(Pt/Pt-1)`; kolom `tanggal,harga_penutupan,imbal_hasil_pct`. File `laporan_var_mesin.csv`: VaR99 parametrik mesin bank = 2.3263 * std dev 250 hari berjalan (kolom `tanggal,var99_pct`).
- **Seed:** 42 (tidak ada sampling acak — seri dipakai penuh).
- **Tanggal tangkapan:** {CAPTURE}. Ukuran: {os.path.getsize(f"{d_a}/imbal_hasil.csv")} byte.
- **Batas jujur:** S&P 500 dipakai sebagai PROXY portofolio ekuitas (bukan portofolio bank yang sebenarnya); VaR mesin disederhanakan untuk misi ini.
""")
open(f"{d_b}/METODE.md","w").write(f"""# METODE — Misi Badai: Ketika Semua Korelasi Menuju Satu (misi-stress-korelasi)

- **Sumber data:** {FRED_NOTE}
- **Seri:** SP500 (S&P 500 harian), VIXCLS (VIX harian), DGS10 (yield obligasi 10 thn AS, harian), 2019-01-01 s.d. 2021-06-30; digabung per tanggal, hanya tanggal yang ada di ketiga seri.
- **Metode:** `spx_ret` = imbal hasil log harian (%); `vix_chg` = perubahan poin VIX; `y10_chg` = perubahan yield (pp). Tidak ada smoothing — angka mentah apa adanya.
- **Seed:** 42 (tidak ada sampling acak). **Tanggal tangkapan:** {CAPTURE}.
- **Batas jujur:** tiga seri makro dipakai sebagai proksi kondisi pasar; bukan portofolio spesifik bank mana pun.
""")
open(f"{d_ra}/METODE.md","w").write(f"""# METODE — Misi Rekonsiliasi: Laporan yang Harus Klop (misi-rekonsiliasi-laporan)

- **Sumber data:** {UCINOTE}
- **Metode:** `german.data` (1.000 baris, kode kategorikal) didekode via `german.doc`; kolom status (lancar/macet) dari `german.data-numeric` kolom terakhir (1=lancar, 2=macet); digabung per urutan baris. Kolom akhir: {", ".join(keep)}.
- **Seed:** 42 (tidak ada sampling — 1.000 baris dipakai penuh). **Tanggal tangkapan:** {CAPTURE}.
- **Batas jujur:** data tahun 1994 (DM sebagai satuan) — dipakai sebagai BAHAN LATIH pelaporan (struktur loan book nyata), bukan potret portofolio saat ini. NPL di sini = status "macet" per definisi dataset, bukan definisi regulator.
""")
open(f"{d_rb}/METODE.md","w").write(f"""# METODE — Misi Dua Sumber: Laporan di Tengah Perang Data (misi-laporan-dua-sumber)

- **Sumber data:** {UCINOTE} (basis sama dengan Misi A Risk Reporting).
- **Metode:** dari loan book 1.000 baris dibuat DUA ekstrak: `core_banking.csv` (status per definisi core banking) dan `risk_mart.csv` (30 baris status dibalik — mensimulasikan perbedaan definisi as-of antar sistem; seed 42, daftar baris terdokumentasi di skrip build). `koreksi_bisnis.csv`: 12 baris "koreksi" dari unit bisnis atas data mart.
- **Seed:** 42. **Tanggal tangkapan:** {CAPTURE}.
- **Batas jujur:** perbedaan definisi antar-sistem DISIMULASIKAN (bukan perbedaan nyata dua sistem bank) — dinyatakan eksplisit di briefing agar pelajar tidak mengira ini temuan forensik atas bank sungguhan. Tujuannya melatih PENILAIAN di tengah ambiguitas, bukan menemukan "jawaban benar" yang tersembunyi.
""")
print("METODE.md ditulis")
open("EXPECTED.txt","w").write("")
