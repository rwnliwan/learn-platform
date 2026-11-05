"""Generator dataset SINTETIS misi-arbitrase-rapi (seed 42).

Dua seri harga kointegrasi (log-price) + structural break yang disuntikkan.
DOKUMENTASI PENUH: lihat METODE.md di folder yang sama.

Spesifikasi:
- RNG: numpy default_rng(42); 4000 hari disimulasi, dipakai segmen [2570:3570]
  (segmen dipilih agar statistik sampel sesuai parameter target:
  half-life pra-break ~25 hari, beta pra ~1.0, beta pasca ~1.35).
- x_t: random walk, x_0 = 4.0, inovasi N(0, 0.02^2) per hari.
- s_t: Ornstein-Uhlenbeck, s_t = 0.97*s_{t-1} + N(0, 0.006^2)
  -> half-life teoritis = ln(0.5)/ln(0.97) = 22.76 hari.
- beta_t = 1.0 untuk t < 650, lalu 1.35 (STRUCTURAL BREAK disuntikkan).
- y_t = beta_t * x_t + s_t; harga A = exp(x_t), B = exp(y_t).
- Tanggal: 1000 hari bursa mulai 2021-01-04 (Senin-Jumat, tanpa libur).
- laporan_backtest.csv MENIRU laporan internal yang curang:
  spread dihitung dengan beta basi 1.0 untuk SELURUH periode (break diabaikan),
  z-score memakai mean & std SELURUH sampel (lookahead: memakai masa depan).
"""
import numpy as np
import csv
from datetime import date, timedelta

SEED = 42
M, I0, N, BRK = 4000, 2570, 1000, 650
RHO, SIG_S, SIG_X = 0.97, 0.006, 0.02

rng = np.random.default_rng(SEED)
x = np.zeros(M)
s = np.zeros(M)
x[0] = 4.0
for t in range(1, M):
    x[t] = x[t-1] + rng.normal(0, SIG_X)
    s[t] = RHO * s[t-1] + rng.normal(0, SIG_S)

xs = x[I0:I0 + N]
ss = s[I0:I0 + N]
beta = np.where(np.arange(N) < BRK, 1.0, 1.35)
ys = beta * xs + ss
A = np.exp(xs)
B = np.exp(ys)

d = date(2021, 1, 4)
dates = []
while len(dates) < N:
    if d.weekday() < 5:
        dates.append(d.isoformat())
    d += timedelta(days=1)

with open("pasangan_sintetis.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["tanggal", "harga_a", "harga_b"])
    for i in range(N):
        w.writerow([dates[i], round(float(A[i]), 4), round(float(B[i]), 4)])

# --- laporan internal (curang): beta basi + z full-sample ---
s_rep = ys - 1.0 * xs
mu, sd = s_rep.mean(), s_rep.std(ddof=1)
z_rep = (s_rep - mu) / sd
with open("laporan_backtest.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["tanggal", "zscore_laporan", "posisi"])
    for i in range(N):
        z = float(z_rep[i])
        pos = "SHORT_SPREAD" if z > 2 else ("LONG_SPREAD" if z < -2 else "FLAT")
        w.writerow([dates[i], round(z, 4), pos])

print("break pada idx", BRK, "=", dates[BRK])
print("rentang:", dates[0], "->", dates[-1])
