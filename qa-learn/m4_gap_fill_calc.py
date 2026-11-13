"""Deterministic fill calculations for MLF M4 gap fill (G1-G11).

Data: ~/workspace/learn-platform/data/m4_prices.csv (yfinance 2026-11-12,
window 2024-11-01..2026-11-12, auto_adjust=True). Same conventions as
qa-learn/m4_canonical_calc.py: returns per asset on its own calendar,
portfolio = equal-weight mean of simple returns (480 IDX days),
port_l = log1p(port_s). OOS window = days 251..480 (230 test days),
rolling 250-day window.

Run: python3 qa-learn/m4_gap_fill_calc.py   (from ~/workspace/learn-platform)
All printed numbers are the source for the M4 gap-fill lesson text.
"""
import json
import numpy as np
import pandas as pd
from scipy import stats, optimize

prices = pd.read_csv("data/m4_prices.csv", index_col=0, parse_dates=True, header=[0, 1])
close = prices["Close"]
close.columns = ["BBCA", "KLBF", "UNVR", "GSPC"]
close = close.dropna(how="all")


def _logret(price):
    return np.log(price.dropna()).diff().dropna()


def _simpret(price):
    return price.dropna().pct_change(fill_method=None).dropna()


lr = {c: _logret(close[c]) for c in close.columns}
sr = {c: _simpret(close[c]) for c in close.columns}
port_s = pd.DataFrame({c: sr[c] for c in ["BBCA", "KLBF", "UNVR"]}).mean(axis=1)
port_l = np.log1p(port_s)
arr_s = port_s.values          # simple returns, 480
arr_l = port_l.values          # log returns, 480
dates = port_s.index


def kupiec(x, n, p):
    if x == 0 or x == n:
        return float("nan"), float("nan")
    phat = x / n
    lr_stat = (-2 * np.log((1 - p) ** (n - x) * p ** x)
               + 2 * np.log((1 - phat) ** (n - x) * phat ** x))
    return float(lr_stat), float(1 - stats.chi2.cdf(lr_stat, 1))


def christoffersen(ind, p_uc=0.05):
    """ind: 0/1 exceedance array. Returns transition counts, LR_ind, LR_cc.
    p_uc = promised violation probability (0.05 for VaR95, 0.01 for VaR99)."""
    ind = np.asarray(ind, dtype=int)
    n00 = int(((ind[:-1] == 0) & (ind[1:] == 0)).sum())
    n01 = int(((ind[:-1] == 0) & (ind[1:] == 1)).sum())
    n10 = int(((ind[:-1] == 1) & (ind[1:] == 0)).sum())
    n11 = int(((ind[:-1] == 1) & (ind[1:] == 1)).sum())
    n0 = n00 + n01
    n1 = n10 + n11
    pi01 = n01 / n0 if n0 else 0.0
    pi11 = n11 / n1 if n1 else 0.0
    pi = (n01 + n11) / (n00 + n01 + n10 + n11)
    # LR independence (Markov vs iid Bernoulli)
    def _loglik(pi01_, pi11_):
        ll = 0.0
        if n00: ll += n00 * np.log(1 - pi01_)
        if n01: ll += n01 * np.log(pi01_)
        if n10: ll += n10 * np.log(1 - pi11_)
        if n11: ll += n11 * np.log(pi11_)
        return ll
    ll_alt = _loglik(pi01, pi11)
    ll_null = _loglik(pi, pi)
    lr_ind = -2 * (ll_null - ll_alt)
    p_ind = float(1 - stats.chi2.cdf(lr_ind, 1))
    # LR unconditional coverage (Kupiec POF on the n-1 transitions)
    x = n01 + n11
    n = n00 + n01 + n10 + n11
    lr_uc, p_uc = kupiec(x, n, p_uc)
    lr_cc = lr_ind + lr_uc
    p_cc = float(1 - stats.chi2.cdf(lr_cc, 2))
    return dict(n00=n00, n01=n01, n10=n10, n11=n11, pi01=pi01, pi11=pi11,
                lr_ind=float(lr_ind), p_ind=p_ind, lr_uc=lr_uc, p_uc=p_uc,
                lr_cc=float(lr_cc), p_cc=p_cc)


print("=" * 70)
print("G1 — Christoffersen on historical-VaR OOS exceedances (230 days)")
print("=" * 70)
oos_ind = {}
for alpha, q, p in [(0.95, 0.05, 0.05), (0.99, 0.01, 0.01)]:
    xs = np.array([arr_s[t] < np.quantile(arr_s[t - 250:t], q)
                   for t in range(250, len(arr_s))], dtype=int)
    oos_ind[alpha] = xs
    print(f"VaR{int(alpha*100)} OOS: exceed={xs.sum()} / 230, expected={230*p:.1f}")
    ch = christoffersen(xs, p_uc=p)
    print(f"  transitions n00={ch['n00']} n01={ch['n01']} n10={ch['n10']} n11={ch['n11']}")
    print(f"  pi01 (peluang pelanggaran setelah hari tenang) = {ch['pi01']:.4f}")
    print(f"  pi11 (peluang pelanggaran setelah pelanggaran) = {ch['pi11']:.4f}")
    print(f"  LR_ind={ch['lr_ind']:.4f} p={ch['p_ind']:.4f} | "
          f"LR_uc={ch['lr_uc']:.4f} p={ch['p_uc']:.4f} | "
          f"LR_cc={ch['lr_cc']:.4f} p={ch['p_cc']:.4f}")
    # where are the 95 exceedances? (dates)
    if alpha == 0.95:
        exc_dates = [str(dates[250 + i].date()) for i, v in enumerate(xs) if v]
        print("  tanggal pelanggaran VaR95 OOS:", exc_dates)
        # gaps between consecutive exceedances
        idx = np.where(xs == 1)[0]
        print("  selisih hari antar pelanggaran berurutan:", np.diff(idx).tolist())

print()
print("=" * 70)
print("G4 — OOS backtest EWMA + GARCH VaR, portfolio log returns, 230 days")
print("=" * 70)
# --- EWMA(0.94): init var = variance of first 250 log returns, then recurse
lam = 0.94
var = float(np.var(arr_l[:250]))
ewma_vols = []
for t in range(len(arr_l)):
    if t > 0:
        var = lam * var + (1 - lam) * arr_l[t - 1] ** 2
    ewma_vols.append(np.sqrt(var))
ewma_vols = np.array(ewma_vols)
# 1-day-ahead VaR for day t uses vol filtered through t-1
z95, z99 = -stats.norm.ppf(0.05), -stats.norm.ppf(0.01)
ew95 = np.array([arr_l[t] < -z95 * ewma_vols[t] for t in range(250, 480)], dtype=int)
ew99 = np.array([arr_l[t] < -z99 * ewma_vols[t] for t in range(250, 480)], dtype=int)
print(f"EWMA VaR95 OOS: exceed={ew95.sum()} / 230, expected 11,5 | "
      f"Kupiec LR={kupiec(int(ew95.sum()), 230, 0.05)[0]:.4f} "
      f"p={kupiec(int(ew95.sum()), 230, 0.05)[1]:.4f}")
print(f"EWMA VaR99 OOS: exceed={ew99.sum()} / 230, expected 2,3 | "
      f"Kupiec LR={kupiec(int(ew99.sum()), 230, 0.01)[0]:.4f} "
      f"p={kupiec(int(ew99.sum()), 230, 0.01)[1]:.4f}")
ch_ew = christoffersen(ew95)
print(f"EWMA Christoffersen VaR95: n00={ch_ew['n00']} n01={ch_ew['n01']} "
      f"n10={ch_ew['n10']} n11={ch_ew['n11']} pi01={ch_ew['pi01']:.4f} "
      f"pi11={ch_ew['pi11']:.4f} LR_ind={ch_ew['lr_ind']:.4f} p={ch_ew['p_ind']:.4f}")
print(f"EWMA VaR95 hari terakhir (11 Nov 2026): {z95 * ewma_vols[-1]:.4f} "
      f"| VaR99: {z99 * ewma_vols[-1]:.4f} | vol terakhir: {ewma_vols[-1]:.4f}")
print(f"EWMA VaR95 maks selama OOS: {z95 * ewma_vols[250:].max():.4f} "
      f"pada {dates[250 + int(np.argmax(ewma_vols[250:]))].date()}")
# exceedance dates EWMA 95
print("  tanggal pelanggaran EWMA VaR95 OOS:",
      [str(dates[250 + i].date()) for i, v in enumerate(ew95) if v])

# --- GARCH(1,1): refit every 20 days on trailing 250 log returns (12 refits)
# Speed: L-BFGS-B capped at 300 iterations (3 params converge fast) and
# warm-started from the previous refit's params + 1 generic start.
def garch_fit(r, warm=None):
    mu = r.mean()
    e = r - mu
    var0 = np.var(e)

    def nll(params):
        om, al, be = params
        if om <= 0 or al < 0 or be < 0 or al + be >= 1:
            return 1e10
        sig2 = np.empty_like(e)
        sig2[0] = var0
        for t in range(1, len(e)):
            sig2[t] = om + al * e[t - 1] ** 2 + be * sig2[t - 1]
        if np.any(sig2 <= 0):
            return 1e10
        return 0.5 * np.sum(np.log(2 * np.pi) + np.log(sig2) + e ** 2 / sig2)

    starts = [(var0 * 0.05, 0.08, 0.88), (var0 * 0.1, 0.15, 0.8),
              (var0 * 0.02, 0.05, 0.9)]
    if warm is not None:
        starts = [warm, (var0 * 0.05, 0.08, 0.88)]
    best = None
    for start in starts:
        res = optimize.minimize(nll, start, method="L-BFGS-B",
                                bounds=[(1e-10, None), (0, 0.99), (0, 0.99)],
                                options={"maxiter": 300})
        if best is None or res.fun < best.fun:
            best = res
    om, al, be = best.x
    sig2 = np.empty_like(e)
    sig2[0] = var0
    for t in range(1, len(e)):
        sig2[t] = om + al * e[t - 1] ** 2 + be * sig2[t - 1]
    return dict(mu=float(mu), omega=float(om), alpha=float(al), beta=float(be),
                last_sig2=float(sig2[-1]), last_e=float(e[-1]))

garch_vols = np.full(len(arr_l), np.nan)
refits = []
t = 250
prev = None
warm = None
while t < 480:
    window = arr_l[t - 250:t]
    try:
        g = garch_fit(window, warm=warm)
        prev = g
        warm = (g["omega"], g["alpha"], g["beta"])
    except Exception as exc:  # carry forward previous params, stated honestly
        print(f"  GARCH refit gagal di hari {t} ({exc}); pakai parameter refit sebelumnya")
        g = prev
    refits.append((str(dates[t].date()), round(g["alpha"], 4), round(g["beta"], 4),
                   round(g["omega"], 8)))
    om, al, be = g["omega"], g["alpha"], g["beta"]
    sig2 = g["last_sig2"]
    e_last = g["last_e"]
    # filter forward for the next 20 days (or to end)
    for s in range(t, min(t + 20, 480)):
        # 1-day-ahead forecast variance for day s uses data through s-1
        fvar = om + al * e_last ** 2 + be * sig2
        garch_vols[s] = np.sqrt(fvar)
        # update filter with realised return of day s
        sig2 = fvar
        e_last = arr_l[s] - g["mu"]
    t += 20
print("GARCH refit (tanggal | alpha | beta | omega), tiap 20 hari:")
for r in refits:
    print("  ", r)
g95 = np.array([arr_l[s] < -z95 * garch_vols[s] for s in range(250, 480)], dtype=int)
g99 = np.array([arr_l[s] < -z99 * garch_vols[s] for s in range(250, 480)], dtype=int)
print(f"GARCH VaR95 OOS: exceed={g95.sum()} / 230, expected 11,5 | "
      f"Kupiec LR={kupiec(int(g95.sum()), 230, 0.05)[0]:.4f} "
      f"p={kupiec(int(g95.sum()), 230, 0.05)[1]:.4f}")
print(f"GARCH VaR99 OOS: exceed={g99.sum()} / 230, expected 2,3 | "
      f"Kupiec LR={kupiec(int(g99.sum()), 230, 0.01)[0]:.4f} "
      f"p={kupiec(int(g99.sum()), 230, 0.01)[1]:.4f}")
ch_g = christoffersen(g95)
print(f"GARCH Christoffersen VaR95: n00={ch_g['n00']} n01={ch_g['n01']} "
      f"n10={ch_g['n10']} n11={ch_g['n11']} pi01={ch_g['pi01']:.4f} "
      f"pi11={ch_g['pi11']:.4f} LR_ind={ch_g['lr_ind']:.4f} p={ch_g['p_ind']:.4f}")
print(f"GARCH VaR95 hari terakhir: {z95 * garch_vols[-1]:.4f} "
      f"| VaR99: {z99 * garch_vols[-1]:.4f} | vol forecast: {garch_vols[-1]:.4f}")
gmax_i = int(np.nanargmax(garch_vols[250:]))
print(f"GARCH VaR95 maks selama OOS: {z95 * np.nanmax(garch_vols[250:]):.4f} "
      f"pada {dates[250 + gmax_i].date()}")
print("  tanggal pelanggaran GARCH VaR95 OOS:",
      [str(dates[250 + i].date()) for i, v in enumerate(g95) if v])
# VaR on the crash day 16 Oct 2026 (index in OOS window)
crash = dates.get_loc("2026-10-16")
print(f"16 Okt 2026: return log portofolio {arr_l[crash]:.4f} | "
      f"VaR95 hist (rolling) {-np.quantile(arr_s[crash-250:crash], 0.05):.4f} | "
      f"VaR95 EWMA {z95 * ewma_vols[crash]:.4f} | VaR95 GARCH {z95 * garch_vols[crash]:.4f}")

print()
print("=" * 70)
print("G2 — Atribusi P&L Black-Scholes (koreksi + skenario gabungan)")
print("=" * 70)
S, K, T, r_rate, sig = 7619.38, 7619.38, 0.25, 0.05, 0.2243


def bs_call(S_, K_=K, T_=T, r_=r_rate, sig_=sig):
    d1 = (np.log(S_ / K_) + (r_ + 0.5 * sig_ ** 2) * T_) / (sig_ * np.sqrt(T_))
    d2 = d1 - sig_ * np.sqrt(T_)
    return (S_ * stats.norm.cdf(d1) - K_ * np.exp(-r_ * T_) * stats.norm.cdf(d2),
            d1, d2)


c0, d1, d2 = bs_call(S)
delta = stats.norm.cdf(d1)
gamma = stats.norm.pdf(d1) / (S * sig * np.sqrt(T))
vega = S * stats.norm.pdf(d1) * np.sqrt(T) / 100
theta = (-(S * stats.norm.pdf(d1) * sig) / (2 * np.sqrt(T))
         - r_rate * K * np.exp(-r_rate * T) * stats.norm.cdf(d2)) / 365
rho = K * T * np.exp(-r_rate * T) * stats.norm.cdf(d2) / 100
c1, _, _ = bs_call(S * 1.01)
print(f"harga awal: {c0:.2f} | delta {delta:.4f} gamma {gamma:.6f} "
      f"vega/1pp {vega:.4f} theta/hari {theta:.4f} rho/1pp {rho:.4f}")
print(f"S +1%: perubahan harga SEBENARNYA (repricing BS) = {c1 - c0:.2f}")
print(f"  perkiraan delta saja: {delta * 0.01 * S:.2f} (inilah angka 43,17 — "
      f"BUKAN perubahan sebenarnya)")
print(f"  suku gamma: 0,5 x {gamma:.6f} x {0.01 * S:.2f}^2 = "
      f"{0.5 * gamma * (0.01 * S) ** 2:.2f}")
print(f"  delta + gamma = {delta * 0.01 * S + 0.5 * gamma * (0.01 * S) ** 2:.2f} "
      f"| residu orde-tinggi = {(c1 - c0) - (delta * 0.01 * S + 0.5 * gamma * (0.01 * S) ** 2):.2f}")
c2, _, _ = bs_call(S * 1.01, T_=T - 1 / 365, r_=r_rate + 0.01, sig_=sig + 0.01)
# theta: -2,3801/hari; 1 hari berlalu -> kontribusi -2,38 (bukan +2,38:
# T berkurang 1 hari berarti call KEHILANGAN theta, bukan mendapatkannya)
taylor = (delta * 0.01 * S + 0.5 * gamma * (0.01 * S) ** 2 + vega * 1.0
          + theta * 1 + rho * 1.0)
print(f"skenario gabungan [ilustrasi] S+1%, vol+1pp, 1 hari berlalu, r+1pp:")
print(f"  perubahan SEBENARNYA = {c2 - c0:.2f} | jumlah Taylor = {taylor:.2f} "
      f"| residu (cross-Greek + orde tinggi) = {(c2 - c0) - taylor:.2f}")
print(f"  rincian: delta {delta * 0.01 * S:.2f} + gamma "
      f"{0.5 * gamma * (0.01 * S) ** 2:.2f} + vega {vega:.2f} + theta "
      f"{theta:.2f} + rho {rho:.2f}")
# skenario BESAR: residu Taylor membesar saat pergerakan besar / dekat expiry
c3, _, _ = bs_call(S * 1.05, T_=T - 5 / 365, r_=r_rate + 0.01, sig_=sig + 0.03)
taylor_big = (delta * 0.05 * S + 0.5 * gamma * (0.05 * S) ** 2 + vega * 3.0
              + theta * 5 + rho * 1.0)
print(f"skenario BESAR [ilustrasi] S+5%, vol+3pp, 5 hari berlalu, r+1pp:")
print(f"  perubahan SEBENARNYA = {c3 - c0:.2f} | jumlah Taylor = {taylor_big:.2f} "
      f"| residu = {(c3 - c0) - taylor_big:.2f}")
print(f"  rincian: delta {delta * 0.05 * S:.2f} + gamma "
      f"{0.5 * gamma * (0.05 * S) ** 2:.2f} + vega {vega * 3:.2f} + theta "
      f"{theta * 5:.2f} + rho {rho:.2f}")
# theta-only sanity: 90 days linear vs full premium
print(f"theta 90 hari linear: {theta * -90:.2f} vs peluruhan penuh ke expiry (S=K): {c0:.2f}")

print()
print("=" * 70)
print("G5 — Stress return + gabungan (jangkar kanonis)")
print("=" * 70)
vol_base, dr_base = 0.0197, 1.3530
vol_095, dr_095 = 0.0262, 1.0169
for name, vol, dr, shock in [
        ("normal", vol_base, dr_base, 0.0),
        ("return shock -10% [ilustrasi]", vol_base, dr_base, -0.10),
        ("vol shock x1,5 [ilustrasi]", vol_base * 1.5, dr_base, 0.0),
        ("gabungan: korelasi 0,95 + vol x1,5 + return -10% [ilustrasi]",
         vol_095 * 1.5, dr_095, -0.10)]:
    var95 = z95 * vol
    var99 = z99 * vol
    es95 = stats.norm.pdf(z95) / 0.05 * vol
    print(f"{name}: vol {vol:.4f} VaR95 {var95:.4f} (Rp{var95 * 100_000_000:,.0f}) "
          f"VaR99 {var99:.4f} ES95 {es95:.4f} DR {dr:.4f}"
          + (f" | P&L shock langsung Rp{shock * 100_000_000:,.0f}" if shock else ""))

print()
print("=" * 70)
print("G6 — Deteksi regime real-time tanpa look-ahead")
print("=" * 70)
roll_vol = port_l.rolling(60).std() * np.sqrt(252)
valid = roll_vol.dropna()
thr_full = valid.quantile(0.75)
full_high = (roll_vol > thr_full)
print(f"ambang full-sample p75 = {thr_full:.4f}; hari high-vol full-sample = "
      f"{int(full_high.sum())} dari {len(valid)}")
# real-time: expanding p75 of rolling vols available up to day t
rt_high = pd.Series(False, index=roll_vol.index)
thr_rt = pd.Series(np.nan, index=roll_vol.index)
vals = valid.values
for i in range(len(valid)):
    if i >= 60:  # butuh minimal 60 nilai rolling-vol untuk persentil yang stabil
        thr_rt.loc[valid.index[i]] = np.quantile(vals[:i + 1], 0.75)
        rt_high.loc[valid.index[i]] = valid.iloc[i] > thr_rt.loc[valid.index[i]]
mask = thr_rt.notna()
agree = (rt_high[mask] == full_high[mask]).mean()
print(f"real-time (expanding p75, mulai setelah 60 nilai): hari dinilai = {int(mask.sum())}")
print(f"kesepakatan label real-time vs full-sample: {agree:.4f} "
      f"({int((rt_high[mask] == full_high[mask]).sum())}/{int(mask.sum())})")
print(f"hari high-vol real-time: {int(rt_high[mask].sum())} vs full-sample "
      f"{int(full_high[mask].sum())} pada periode yang sama")
# next-day realised vol by real-time label (label hari t -> return hari t+1)
nxt = port_l.shift(-1)
hi_next = nxt[rt_high].dropna()
lo_next = nxt[~rt_high & mask].dropna()
print(f"return esok hari setelah label HIGH real-time: n={len(hi_next)} "
      f"vol terealisasi {hi_next.std():.4f} | setelah label LOW: n={len(lo_next)} "
      f"vol {lo_next.std():.4f}")
# detection lag on the Oct-2026 episode: first full-sample high day vs first real-time high day
fs_dates = full_high[full_high].index
# episode: last 60 days of the sample
ep = fs_dates[fs_dates >= "2026-09-01"]
rt_ep = rt_high[rt_high & (rt_high.index >= "2026-09-01")].index
print(f"episode Sep-Nov 2026: high full-sample pertama {ep[0].date() if len(ep) else '-'}; "
      f"high real-time pertama {rt_ep[0].date() if len(rt_ep) else '-'}")
print(f"ambang real-time terakhir (11 Nov 2026): {thr_rt.dropna().iloc[-1]:.4f} "
      f"vs ambang full-sample {thr_full:.4f}")

print()
print("=" * 70)
print("G8 — Probabilitas LR -> aturan trading (walk-forward 160 hari)")
print("=" * 70)
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

b = lr["BBCA"]
g = lr["GSPC"]
bbca_p = close["BBCA"].dropna()
feat = pd.DataFrame(index=b.index)
feat["lag1"] = b.shift(1)
feat["lag5_mean"] = b.shift(1).rolling(5).mean()
feat["vol20"] = b.shift(1).rolling(20).std()
feat["ma20_dist"] = (bbca_p / bbca_p.rolling(20).mean() - 1).shift(1)
feat["gspc_lag1"] = g.shift(1).reindex(b.index, method="ffill")
feat["target"] = (b.shift(-1) > 0).astype(int)
dfm = feat.dropna()
X, y = dfm.drop(columns=["target"]).values, dfm["target"].values
# next-day simple return of BBCA for each feature row (position held d -> next trading day)
b_idx = b.index
sr_bbca = sr["BBCA"]
next_ret = np.array([float(sr_bbca.loc[b_idx[i + 1]]) for i in range(len(dfm))])
probs, labels, rets = [], [], []
for s in range(300, len(X) - 20 + 1, 20):
    m = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
    m.fit(X[:s], y[:s])
    probs.extend(m.predict_proba(X[s:s + 20])[:, 1])
    labels.extend(y[s:s + 20])
    rets.extend(next_ret[s:s + 20])
probs = np.array(probs); labels = np.array(labels); rets = np.array(rets)
print(f"test days: {len(labels)} | up-rate aktual: {labels.mean():.4f} "
      f"| prob rata-rata: {probs.mean():.4f}")
COST = 0.001  # 0,10% per transaksi sekali jalan [ilustrasi]
bh = (1 + rets).prod() - 1  # buy-and-hold over the same 160 days
bh_eq = np.cumprod(1 + rets)
bh_dd = float((bh_eq / np.maximum.accumulate(bh_eq) - 1).min())
print(f"buy-and-hold 160 hari yang sama: {(bh * 100):.2f}% "
      f"(jumlah return harian {rets.sum() * 100:.2f}%; maxDD {bh_dd * 100:.2f}%)")
for thr in [0.50, 0.55, 0.60]:
    pos = (probs > thr).astype(int)
    pred_up = pos == 1
    tp = int(((pos == 1) & (labels == 1)).sum())
    fp = int(((pos == 1) & (labels == 0)).sum())
    fn = int(((pos == 0) & (labels == 1)).sum())
    tn = int(((pos == 0) & (labels == 0)).sum())
    acc = (tp + tn) / len(labels)
    prec = tp / (tp + fp) if tp + fp else float("nan")
    rec = tp / (tp + fn) if tp + fn else float("nan")
    trades = int(np.abs(np.diff(np.concatenate([[0], pos]))).sum())
    gross = float((pos * rets).sum())
    net = gross - trades * COST
    eq = np.cumprod(1 + pos * rets - np.abs(np.diff(np.concatenate([[0], pos]))) * COST)
    dd = float((eq / np.maximum.accumulate(eq) - 1).min())
    print(f"threshold {thr:.2f}: long {int(pos.sum())} hari | TP={tp} FP={fp} "
          f"FN={fn} TN={tn} | akurasi {acc:.4f} presisi {prec:.4f} recall {rec:.4f}")
    print(f"   turnover: {trades} transaksi | gross {gross * 100:.2f}% | "
          f"biaya {trades * COST * 100:.2f}% | NET {net * 100:.2f}% | maxDD strategi {dd * 100:.2f}%")
# naive as trading rule: always predict down (majority) -> always flat
print("naive-majority sebagai aturan trading: selalu prediksi turun -> selalu flat "
      "-> return 0,00%, 0 transaksi")

print()
print("=" * 70)
print("G9 — Ketidakpastian: interval akurasi + sensitivitas VaR99")
print("=" * 70)


def wilson(x, n, z=1.96):
    p = x / n
    den = 1 + z * z / n
    c = p + z * z / (2 * n)
    m = z * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (c - m) / den, (c + m) / den


for name, x, n in [("LR walk-forward", 91, 160), ("naive-majority", 90, 160)]:
    lo, hi = wilson(x, n)
    print(f"{name}: {x}/{n} = {x / n:.4f} | Wilson 95%: [{lo:.4f}, {hi:.4f}] "
          f"(lebar {(hi - lo) * 100:.1f}pp)")
for x in [2, 4, 6]:
    lr_s, p_s = kupiec(x, 230, 0.01)
    print(f"VaR99 OOS x={x}/230 (ekspektasi 2,3): LR={lr_s:.4f} p={p_s:.4f} "
          f"-> {'TOLAK' if p_s < 0.05 else 'tidak ditolak'}")
# Kupiec VaR95 sensitivity for reference
for x in [11, 15, 19]:
    lr_s, p_s = kupiec(x, 230, 0.05)
    print(f"VaR95 OOS x={x}/230 (ekspektasi 11,5): LR={lr_s:.4f} p={p_s:.4f}")

print()
print("=" * 70)
print("G11 — ES per regime + VaR/ES stress parametrik")
print("=" * 70)
port_l_al = port_l.reindex(roll_vol.index)
hi_ret = port_l_al[full_high].dropna()
lo_ret = port_l_al[~full_high].dropna()


def es_hist_ser(s, alpha):
    q = np.quantile(s, 1 - alpha)
    return float(-s[s <= q].mean()), float(-q)


for nm, r in [("high-vol", hi_ret), ("low-vol", lo_ret)]:
    es95, v95 = es_hist_ser(r, 0.95)
    es99, v99 = es_hist_ser(r, 0.99)
    print(f"{nm} (n={len(r)}): VaR95 {v95:.4f} ES95 {es95:.4f} | "
          f"VaR99 {v99:.4f} ES99 {es99:.4f}")
print(f"stress korelasi 0,95: vol {vol_095:.4f} VaR95 {z95 * vol_095:.4f} "
      f"VaR99 {z99 * vol_095:.4f} ES95 {stats.norm.pdf(z95) / 0.05 * vol_095:.4f} "
      f"ES99 {stats.norm.pdf(z99) / 0.01 * vol_095:.4f}")
print(f"normal: vol {vol_base:.4f} VaR95 {z95 * vol_base:.4f} "
      f"VaR99 {z99 * vol_base:.4f} ES95 {stats.norm.pdf(z95) / 0.05 * vol_base:.4f}")
print("maxDD portofolio (kanonis): -0,4363 | DR normal 1,3530 | DR stress 1,0169")

# save key numbers for the fill workers
out = {
    "g1_christoffersen_95": {k: (round(v, 4) if isinstance(v, float) else v)
                             for k, v in christoffersen(oos_ind[0.95]).items()},
    "g1_christoffersen_99": {k: (round(v, 4) if isinstance(v, float) else v)
                             for k, v in christoffersen(oos_ind[0.99], p_uc=0.01).items()},
    "g4_ewma_x95": int(ew95.sum()), "g4_ewma_x99": int(ew99.sum()),
    "g4_ewma_last_var95": round(float(z95 * ewma_vols[-1]), 4),
    "g4_ewma_last_var99": round(float(z99 * ewma_vols[-1]), 4),
    "g4_garch_x95": int(g95.sum()), "g4_garch_x99": int(g99.sum()),
    "g4_garch_last_var95": round(float(z95 * garch_vols[-1]), 4),
    "g4_garch_last_var99": round(float(z99 * garch_vols[-1]), 4),
    "g4_garch_refits": refits,
    "g2_true_move_1pct": round(float(c1 - c0), 2),
    "g2_delta_part": round(float(delta * 0.01 * S), 2),
    "g2_gamma_part": round(float(0.5 * gamma * (0.01 * S) ** 2), 2),
    "g2_combined_true": round(float(c2 - c0), 2),
    "g2_combined_taylor": round(float(taylor), 2),
    "g2_combined_resid": round(float((c2 - c0) - taylor), 2),
    "g2_big_true": round(float(c3 - c0), 2),
    "g2_big_taylor": round(float(taylor_big), 2),
    "g2_big_resid": round(float((c3 - c0) - taylor_big), 2),
    "g8_bh_total": round(float(bh), 4),
    "g8_bh_maxdd": round(float(bh_dd), 4),
}
json.dump(out, open("qa-learn/m4_gap_fill_numbers.json", "w"), indent=1)
print("\nSaved qa-learn/m4_gap_fill_numbers.json")
print("DONE")
