"""Generator dataset SINTETIS 100% — misi-markowitz-optimis (seed 42).

Model: 8 aset fiktif, imbal hasil bulanan = mu_true + beta * F + eps,
F = faktor pasar bulanan, eps = noise idiosinkratik. Parameter TRUE
diketahui generator dan disimpan di true_params.csv (di dunia nyata
parameter ini TIDAK PERNAH diketahui — itulah inti misi ini).

Periode estimasi (in-sample): 60 bulan, 2019-01 s.d. 2023-12.
Periode uji (out-of-sample): 60 bulan, 2024-01 s.d. 2028-12 (tarikan BARU
dari proses yang sama — bukan pengulangan data estimasi).

Output: returns_in.csv, returns_oos.csv, true_params.csv (+ ringkasan
angka kunci untuk checks lab, dicetak ke stdout).
"""
import numpy as np
import pandas as pd

SEED = 42
rng = np.random.default_rng(SEED)

ASET = ["BANK-A", "KONSUM", "ENERGI", "TELEKOM", "PROPERTI", "TAMBANG", "INFRA", "RITEL"]
N = len(ASET)

# --- Parameter TRUE (tahunan, desimal) — dipilih perancang misi ---
mu_ann = np.array([12.0, 10.0, 14.0, 9.0, 8.0, 16.0, 7.0, 11.0]) / 100.0
vol_ann = np.array([22.0, 16.0, 30.0, 18.0, 20.0, 38.0, 15.0, 24.0]) / 100.0
beta = np.array([1.05, 0.75, 1.25, 0.85, 0.90, 1.45, 0.70, 1.00])
sigF_ann = 0.18  # vol faktor pasar tahunan

idio_var_ann = vol_ann ** 2 - (beta * sigF_ann) ** 2
assert (idio_var_ann > 0).all(), "varians idiosinkratik harus positif"

# --- ke skala bulanan ---
mu_m = mu_ann / 12.0
sigF_m = sigF_ann / np.sqrt(12.0)
sig_idio_m = np.sqrt(idio_var_ann / 12.0)

def tarik(n_bulan):
    F = rng.normal(0.0, sigF_m, size=n_bulan)
    eps = rng.normal(0.0, sig_idio_m, size=(n_bulan, N))
    return mu_m + np.outer(F, beta) + eps  # desimal

R_in = tarik(60)
R_oos = tarik(60)

idx_in = pd.date_range("2019-01-31", periods=60, freq="M")
idx_oos = pd.date_range("2024-01-31", periods=60, freq="M")

df_in = pd.DataFrame(R_in * 100.0, index=idx_in, columns=ASET)
df_in.index.name = "tanggal"
df_oos = pd.DataFrame(R_oos * 100.0, index=idx_oos, columns=ASET)
df_oos.index.name = "tanggal"

df_in.to_csv("returns_in.csv", date_format="%Y-%m-%d")
df_oos.to_csv("returns_oos.csv", date_format="%Y-%m-%d")

true_df = pd.DataFrame({
    "aset": ASET,
    "true_mu_thn_pct": mu_ann * 100.0,
    "true_vol_thn_pct": vol_ann * 100.0,
    "true_sharpe": mu_ann / vol_ann,
})
true_df.to_csv("true_params.csv", index=False)

# --- angka kunci (estimasi sampel + optimasi, persis rumus lab) ---
mu_s = R_in.mean(axis=0)
S = np.cov(R_in, rowvar=False)
w_raw = np.linalg.solve(S, mu_s)
w_opt = np.clip(w_raw, 0, None)
w_opt = w_opt / w_opt.sum()
i_top = int(np.argmax(w_opt))

def sharpe_ann(Rp):
    return Rp.mean() * 12.0 / (Rp.std(ddof=1) * np.sqrt(12.0))

ew = np.full(N, 1.0 / N)
rp_in_opt, rp_in_eq = R_in @ w_opt, R_in @ ew
rp_oos_opt, rp_oos_eq = R_oos @ w_opt, R_oos @ ew

# shrinkage sederhana: rata-rata sampel ditarik 50% ke rata-rata besar
mu_g = mu_s.mean()
mu_shr = 0.5 * mu_s + 0.5 * mu_g
w2 = np.linalg.solve(S, mu_shr)
w2 = np.clip(w2, 0, None); w2 = w2 / w2.sum()
rp_oos_shr = R_oos @ w2

print("=== KUNCI (untuk checks lab) ===")
print(f"n_baris_in={len(df_in)} n_baris_oos={len(df_oos)}")
print(f"aset_top={ASET[i_top]} w_top={w_opt[i_top]:.4f}")
print(f"mu_sampel_top_thn_pct={mu_s[i_top]*12*100:.4f} true_mu_top_thn_pct={mu_ann[i_top]*100:.4f}")
print(f"sh_in_opt={sharpe_ann(rp_in_opt):.4f} sh_in_eq={sharpe_ann(rp_in_eq):.4f}")
print(f"sh_oos_opt={sharpe_ann(rp_oos_opt):.4f} sh_oos_eq={sharpe_ann(rp_oos_eq):.4f}")
print(f"selisih_oos_eq_minus_opt={sharpe_ann(rp_oos_eq)-sharpe_ann(rp_oos_opt):.4f}")
print(f"sh_oos_shr={sharpe_ann(rp_oos_shr):.4f} perbaikan={sharpe_ann(rp_oos_shr)-sharpe_ann(rp_oos_opt):.4f}")
print("bobot_opt_pct=" + ",".join(f"{a}={w*100:.2f}" for a, w in zip(ASET, w_opt)))
print("mu_sampel_thn_pct=" + ",".join(f"{a}={m*12*100:.2f}" for a, m in zip(ASET, mu_s)))
vsd = np.sqrt(np.diag(S))*np.sqrt(12)*100
print("vol_sampel_thn_pct=" + ",".join(f"{a}={v:.2f}" for a, v in zip(ASET, vsd)))
