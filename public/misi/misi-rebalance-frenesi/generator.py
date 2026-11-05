"""Generator dataset SINTETIS 100% — misi-rebalance-frenesi (seed 42).

Empat kelas aset FIKTIF mengikuti Gerak Brown Geometrik harian yang
berkorelasi, 5 tahun bursa (1260 hari: 2021-01-04 s.d. 2025-12-31).
Harga awal 100 untuk semua aset.

Strategi yang dibandingkan di lab (target bobot 25% tiap aset):
  harian      : rebalance tiap hari bursa
  bulanan     : rebalance tiap akhir bulan
  kuartalan   : rebalance tiap akhir kuartal
  tidak-pernah: buy & hold (tidak pernah rebalance)
  band-5pp     : cek harian, rebalance hanya bila ada bobot menyimpang >5pp
Biaya transaksi: 20 bps (0,002) dari nilai yang diperdagangkan.
Definisi turnover satu event = 0,5 * jumlah |perubahan bobot|.

Output: harga.csv (+ ringkasan angka kunci untuk checks lab, ke stdout).
"""
import numpy as np
import pandas as pd

SEED = 42
COST = 0.002  # 20 bps
rng = np.random.default_rng(SEED)

ASET = ["SAHAM", "OBLIGASI", "EMAS", "KAS"]
drift = np.array([0.10, 0.05, 0.04, 0.03])          # drift tahunan
vol = np.array([0.20, 0.06, 0.16, 0.005])           # vol tahunan
corr = np.array([
    [1.00, -0.10, 0.10, 0.00],
    [-0.10, 1.00, 0.00, 0.00],
    [0.10, 0.00, 1.00, 0.00],
    [0.00, 0.00, 0.00, 1.00],
])

idx = pd.bdate_range("2021-01-04", "2025-12-31")
n = len(idx)
mu_d = drift / 252.0
cov_d = np.outer(vol, vol) * corr / 252.0
L = np.linalg.cholesky(cov_d)
z = rng.normal(size=(n, 4))
r_d = mu_d + z @ L.T                       # imbal hasil harian, desimal
harga = 100.0 * np.cumprod(1.0 + r_d, axis=0)

df = pd.DataFrame(harga, index=idx, columns=ASET)
df.index.name = "tanggal"
df.to_csv("harga.csv", date_format="%Y-%m-%d")

ret = df.pct_change().fillna(0.0).values   # baris 0 = 0
TARGET = np.full(4, 0.25)

def tanggal_rebalance(mode):
    if mode == "harian":
        return set(range(n))
    d = pd.DatetimeIndex(idx)
    if mode == "bulanan":
        m = d.to_period("M")
        return set(np.where(m.values != np.roll(m.values, -1))[0].tolist())
    if mode == "kuartalan":
        q = d.to_period("Q")
        return set(np.where(q.values != np.roll(q.values, -1))[0].tolist())
    return set()

def simulasi(mode, band=None):
    rb = tanggal_rebalance(mode)
    w = TARGET.copy()  # bobot awal hari
    wb = TARGET.copy()  # bobot awal hari versi bruto (tanpa biaya)
    V = 1.0
    Vb = 1.0
    nilai = np.empty(n)
    turnover_total = 0.0
    biaya_total = 0.0
    n_rb = 0
    turn_triwulan = {}  # 'YYYY-QN' -> [turnover, biaya]
    for t in range(n):
        rp_t = (w * ret[t]).sum()          # imbal hasil hari t dgn bobot awal hari
        V *= 1.0 + rp_t
        w = w * (1.0 + ret[t]) / (1.0 + rp_t)  # bobot akhir hari (drift)
        rpb_t = (wb * ret[t]).sum()
        Vb *= 1.0 + rpb_t
        wb = wb * (1.0 + ret[t]) / (1.0 + rpb_t)
        do_rb = (t in rb and t > 0) or (band is not None and np.abs(w - TARGET).max() > band)
        if do_rb:
            to = 0.5 * np.abs(TARGET - w).sum()
            tob = 0.5 * np.abs(TARGET - wb).sum()
            V *= 1.0 - COST * to
            turnover_total += to
            biaya_total += COST * to
            n_rb += 1
            q = f"{idx[t].year}-Q{idx[t].quarter}"
            a, b = turn_triwulan.get(q, (0.0, 0.0))
            turn_triwulan[q] = (a + to, b + COST * to)
            w = TARGET.copy()
            wb = TARGET.copy()
        nilai[t] = V
    rp = np.empty(n)
    rp[0] = 0.0
    rp[1:] = nilai[1:] / nilai[:-1] - 1.0  # imbal hasil harian portofolio, bersih biaya
    return {
        "nilai": nilai, "rp": rp, "turnover": turnover_total,
        "biaya": biaya_total, "n_rb": n_rb, "triwulan": turn_triwulan,
        "w_akhir": w.copy(), "Vb": Vb,
    }

hasil = {}
for mode in ["harian", "bulanan", "kuartalan", "tidak-pernah"]:
    hasil[mode] = simulasi(mode)
hasil["band-5pp"] = simulasi("band", band=0.05)

def ret_thn(rp):
    return (np.prod(1.0 + rp) ** (252.0 / n) - 1.0) * 100.0

print("=== KUNCI (untuk checks lab) ===")
print(f"n_baris={n} tgl_awal={idx[0].date()} tgl_akhir={idx[-1].date()}")
for mode in ["harian", "bulanan", "kuartalan", "tidak-pernah", "band-5pp"]:
    h = hasil[mode]
    bruto = (h['Vb'] ** (252.0 / n) - 1.0) * 100.0
    print(f"{mode}: ret_bruto_thn_pct={bruto:.4f} ret_bersih_thn_pct={ret_thn(h['rp']):.4f} "
          f"turnover_total={h['turnover']:.4f} biaya_total_pct={h['biaya']*100:.4f} n_rb={h['n_rb']}")
h = hasil["tidak-pernah"]
print("w_akhir_tidak_pernah=" + ",".join(f"{a}={w*100:.2f}" for a, w in zip(ASET, h["w_akhir"])))
print(f"rasio_turnover_harian_vs_kuartalan={hasil['harian']['turnover']/hasil['kuartalan']['turnover']:.2f}")
# tabel SQL: biaya triwulanan 2025 per strategi
print("=== SQL: biaya triwulan 2025 (strategi, triwulan, turnover_pct, biaya_bps) ===")
rows = []
for mode in ["harian", "bulanan", "kuartalan", "tidak-pernah"]:
    for qi in range(1, 5):
        q = f"2025-Q{qi}"
        to, b = hasil[mode]["triwulan"].get(q, (0.0, 0.0))
        rows.append((mode, q, to * 100.0, b * 10000.0))
rows.sort(key=lambda r: -r[3])
for r in rows:
    print(f"('{r[0]}','{r[1]}',{r[2]:.4f},{r[3]:.4f}),")
print("top3:")
for r in rows[:3]:
    print(f"  {r[0]} {r[1]} biaya_bps={r[3]:.4f}")
