#!/usr/bin/env python3
"""Hitung ulang SEMUA angka baru fill gap Luna M3 (2026-11-12).

Satu skrip, satu seed per eksperimen — semua angka [ilustrasi] / [lab] yang
dikutip di lesson M3.1/M3.2/M3.3/M3.5 pasca-fill berasal dari sini.
Jalankan: python3 qa-learn/m3_gap_fill_calc.py

Catatan: angka [notebook] (UCI / notebook M3 yang sudah dieksekusi) TIDAK
dihitung ulang di sini — skrip ini hanya untuk angka BARU dari data
sintetis yang didefinisikan di fill gap Luna M3.
"""
import math
import random
from collections import defaultdict, deque

import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier, IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


def hdr(title):
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)


# =====================================================================
# G1 — Semi-supervised (M3.1): 10.000 transaksi, 200 label review
# =====================================================================
hdr("G1 — Semi-supervised: baseline 150 label vs pseudo-labeling vs label propagation")

rng = np.random.default_rng(42)
N_ACC, N_TXN = 2000, 10000
N_DEV = 400
RING_ACC, RING_DEV = 60, 6

# Akun -> device: 1 device utama + (peluang 0,5) 1 device kedua yang
# dipinjam dari akun tetangga — supaya graf akun-device terhubung (satu
# component raksasa), bukan 400 component yang terputus. Tanpa jembatan
# ini label propagation tidak bisa mengalir (lihat hasil (C) di bawah).
device_main = rng.integers(0, N_DEV, size=N_ACC)
ring_idx = rng.choice(N_ACC, size=RING_ACC, replace=False)
device_main[ring_idx] = rng.integers(0, RING_DEV, size=RING_ACC)
is_ring = np.zeros(N_ACC, dtype=bool)
is_ring[ring_idx] = True
has_second = rng.random(N_ACC) < 0.5
second_of = np.full(N_ACC, -1)
nbr = (np.arange(N_ACC) + rng.integers(1, 6, size=N_ACC)) % N_ACC
second_of[has_second] = device_main[nbr[has_second]]
# device tiap transaksi: device utama akun itu (sederhana, untuk fitur).
device_of = device_main.copy()

# Transaksi: 5 per akun, stempel waktu acak 30 hari. Akun "burst" (20%)
# menumpuk 5 transaksinya dalam 6 jam — pola yang juga menaikkan logit fraud.
burst_acc = rng.random(N_ACC) < 0.20
acc_of = np.repeat(np.arange(N_ACC), N_TXN // N_ACC)
base_day = rng.integers(0, 30, size=N_ACC)
offsets = np.where(burst_acc[acc_of],
                   rng.integers(0, 6, size=N_TXN),
                   rng.integers(0, 72, size=N_TXN))
abs_hour = base_day[acc_of] * 24 + offsets
day = abs_hour // 24
hour = abs_hour % 24
amount = rng.lognormal(mean=9.0, sigma=0.7, size=N_TXN)  # ~NT$8.100 rata-rata
merchant_risk = (rng.random(N_TXN) < 0.15).astype(int)
device_age = rng.integers(1, 365, size=N_TXN)  # hari sejak device pertama dipakai
# velocity 1 jam: transaksi akun yang sama dalam 1 jam sebelumnya.
vel_1h = np.zeros(N_TXN, dtype=int)
for a in range(N_ACC):
    idx = np.where(acc_of == a)[0]
    times = sorted([(abs_hour[i], i) for i in idx])
    for j in range(1, len(times)):
        if times[j][0] - times[j - 1][0] <= 1:
            vel_1h[times[j][1]] = 1

# Label sejati (generator tahu; learner TIDAK): logit dari fitur + ring + burst.
amount_z = (np.log(amount) - 9.0) / 0.7
logit = (-2.7 + 0.7 * amount_z + 1.0 * vel_1h + 0.6 * (device_age < 30)
         + 0.9 * merchant_risk + 0.4 * ((hour < 6) | (hour > 22))
         + 1.5 * is_ring[acc_of] + 0.6 * burst_acc[acc_of])
p_true = 1 / (1 + np.exp(-logit))
y_true = (rng.random(N_TXN) < p_true).astype(int)
print(f"fraud sejati: {y_true.sum()} dari {N_TXN} (rate {y_true.mean():.4f})")

X = pd.DataFrame({
    "amount_log": np.log(amount),
    "vel_1h": vel_1h,
    "device_new": (device_age < 30).astype(int),
    "merchant_risk": merchant_risk,
    "night": ((hour < 6) | (hour > 22)).astype(int),
})
FEATS = list(X.columns)

# 200 transaksi direview: 100 dari antrean aturan (amount > P90 ATAU
# velocity 1 jam >= 1 ATAU device baru — seperti antrean pemeriksaan nyata)
# + 100 sampel acak. Review nyata TIDAK acak: ia terkonsentrasi di yang
# mencurigakan — dan itu memengaruhi apa yang bisa dipelajari dari labelnya.
amount_p90 = np.quantile(amount, 0.90)
rule_flag = (amount > amount_p90) | (vel_1h >= 1) | (device_age < 30)
flagged_idx = np.where(rule_flag)[0]
plain_idx = np.where(~rule_flag)[0]
rev_flag = rng.choice(flagged_idx, size=100, replace=False)
rev_rand = rng.choice(plain_idx, size=100, replace=False)
rev = np.concatenate([rev_flag, rev_rand])
rng.shuffle(rev)
rev_train, rev_val = train_test_split(rev, test_size=50, random_state=42)
print(f"review: {len(rev)} (fraud {y_true[rev].sum()}; "
      f"dari antrean aturan {y_true[rev_flag].sum()}/100, dari acak "
      f"{y_true[rev_rand].sum()}/100); "
      f"train {len(rev_train)} (fraud {y_true[rev_train].sum()}), "
      f"validasi {len(rev_val)} (fraud {y_true[rev_val].sum()})")
# Audit independen 1.000 transaksi (label sejati hanya untuk evaluasi akhir).
audit = rng.choice(np.setdiff1d(np.arange(N_TXN), rev), size=1000, replace=False)
pool = np.setdiff1d(np.setdiff1d(np.arange(N_TXN), rev), audit)
print(f"audit: {len(audit)} (fraud {y_true[audit].sum()}); "
      f"unlabeled pool: {len(pool)}")


def eval_on_audit(name, proba):
    pred = (proba >= 0.5).astype(int)
    tp = int(((pred == 1) & (y_true[audit] == 1)).sum())
    fp = int(((pred == 1) & (y_true[audit] == 0)).sum())
    fn = int(((pred == 0) & (y_true[audit] == 1)).sum())
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    pr = average_precision_score(y_true[audit], proba)
    print(f"{name}: audit TP={tp} FP={fp} FN={fn} | "
          f"precision={prec:.4f} recall={rec:.4f} F1={f1:.4f} PR-AUC={pr:.4f}")
    return prec, rec, f1, pr


# (A) Supervised baseline: LR pada 150 label.
lr_a = Pipeline([("scaler", StandardScaler()),
                 ("logreg", LogisticRegression(max_iter=1000))])
lr_a.fit(X.iloc[rev_train], y_true[rev_train])
proba_a = lr_a.predict_proba(X.iloc[audit])[:, 1]
print("-- (A) supervised baseline 150 label --")
eval_on_audit("A baseline", proba_a)
# validasi-50 untuk ambang: berapa fraud tertangkap di validasi?
print(f"   validasi-50: baseline recall "
      f"{((lr_a.predict(X.iloc[rev_val]) == 1) & (y_true[rev_val] == 1)).sum()}"
      f"/{y_true[rev_val].sum()}")

# (B) Pseudo-labeling: ambil prediksi >=0,95 / <=0,05 dari pool, retrain.
proba_pool = lr_a.predict_proba(X.iloc[pool])[:, 1]
hi = pool[proba_pool >= 0.95]
lo = pool[proba_pool <= 0.05]
pseudo_idx = np.concatenate([hi, lo])
pseudo_y = np.concatenate([np.ones(len(hi)), np.zeros(len(lo))])
acc_hi = (y_true[hi] == 1).mean() if len(hi) else float("nan")
acc_lo = (y_true[lo] == 0).mean() if len(lo) else float("nan")
print(f"-- (B) pseudo-labeling: >=0,95 -> {len(hi)} (benar fraud {acc_hi:.4f}); "
      f"<=0,05 -> {len(lo)} (benar lancar {acc_lo:.4f}); "
      f"total pseudo {len(pseudo_idx)}; salah label "
      f"{int(((pseudo_y == 1) & (y_true[pseudo_idx] == 0)).sum() + ((pseudo_y == 0) & (y_true[pseudo_idx] == 1)).sum())}")
X_b = pd.concat([X.iloc[rev_train], X.iloc[pseudo_idx]])
y_b = np.concatenate([y_true[rev_train], pseudo_y])
lr_b = Pipeline([("scaler", StandardScaler()),
                 ("logreg", LogisticRegression(max_iter=1000))])
lr_b.fit(X_b, y_b)
proba_b = lr_b.predict_proba(X.iloc[audit])[:, 1]
eval_on_audit("B pseudo-labeling", proba_b)

# (C) Label propagation pada graf akun-device (skor akun -> skor transaksi).
# Akun berlabel: ada >=1 transaksi review; label = 1 bila ada review fraud.
acc_label = {}
for t in rev_train:
    a = int(acc_of[t])
    acc_label[a] = max(acc_label.get(a, 0), int(y_true[t]))
# Adjacency akun via shared device (device utama ATAU device kedua).
dev_to_acc = defaultdict(list)
for a in range(N_ACC):
    dev_to_acc[int(device_main[a])].append(a)
    if second_of[a] >= 0:
        dev_to_acc[int(second_of[a])].append(a)
adj = {a: set() for a in range(N_ACC)}
for members in dev_to_acc.values():
    for a in members:
        for b in members:
            if a != b:
                adj[a].add(b)
# Seberapa terhubung grafnya? (component terbesar)
_seen, _big = set(), 0
for _s in range(N_ACC):
    if _s in _seen or not adj[_s]:
        continue
    _q, _c = deque([_s]), set([_s])
    while _q:
        _u = _q.popleft()
        for _v in adj[_u]:
            if _v not in _c:
                _c.add(_v)
                _q.append(_v)
    _seen |= _c
    _big = max(_big, len(_c))
print(f"   graf akun-device: component terbesar {_big} dari {N_ACC} akun")
score = np.zeros(N_ACC)
labeled = np.zeros(N_ACC, dtype=bool)
for a, lab in acc_label.items():
    score[a] = lab
    labeled[a] = True
print(f"   akun berlabel dari 150 review: {len(acc_label)} "
      f"(fraud {sum(acc_label.values())})")
for _ in range(30):  # propagasi iteratif, akun berlabel dijepit (clamped)
    new = score.copy()
    for a in range(N_ACC):
        if labeled[a] or not adj[a]:
            continue
        new[a] = float(np.mean([score[b] for b in adj[a]]))
    score = new
proba_c = score[acc_of[audit]]
print("-- (C) label propagation graf akun-device --")
eval_on_audit("C label-prop", proba_c)
# Berapa akun ring yang tersentuh propagasi?
print(f"   skor rata-rata akun ring: {score[is_ring].mean():.4f} vs "
      f"non-ring: {score[~is_ring].mean():.4f}")
# Sinyal propagasi itu LOKAL (ring), bukan global — ukur di subset ring audit.
ring_audit = audit[is_ring[acc_of[audit]]]
print(f"   audit dari akun ring: {len(ring_audit)} txn "
      f"(fraud {y_true[ring_audit].sum()}); recall@0,5 di subset ring: "
      f"A={((proba_a[is_ring[acc_of[audit]]] >= 0.5) & (y_true[ring_audit] == 1)).sum()}"
      f"/{y_true[ring_audit].sum()}, "
      f"C={((proba_c[is_ring[acc_of[audit]]] >= 0.5) & (y_true[ring_audit] == 1)).sum()}"
      f"/{y_true[ring_audit].sum()}")
# Berapa transaksi audit dari akun ring yang masuk 100 skor tertinggi (C vs A)?
order_c = np.argsort(-score[acc_of[audit]])[:100]
order_a = np.argsort(-proba_a)[:100]
print(f"   dari 100 skor tertinggi audit: C menangkap "
      f"{y_true[audit][order_c].sum()} fraud "
      f"(ring di antaranya {is_ring[acc_of[audit]][order_c].sum()} txn); "
      f"A menangkap {y_true[audit][order_a].sum()} fraud")

# (D) Retrain: model pemenang (B) dilatih ulang di SEMUA 200 label review
# + pseudo-label yang sama — menutup loop semi-supervised.
print("-- (D) retrain: 200 label review + pseudo-label dari (B) --")
X_d = pd.concat([X.iloc[rev], X.iloc[pseudo_idx]])
y_d = np.concatenate([y_true[rev], pseudo_y])
lr_d = Pipeline([("scaler", StandardScaler()),
                 ("logreg", LogisticRegression(max_iter=1000))])
lr_d.fit(X_d, y_d)
proba_d = lr_d.predict_proba(X.iloc[audit])[:, 1]
eval_on_audit("D retrain-200+pseudo", proba_d)


# =====================================================================
# G2 — Community detection (M3.2): 2 community dalam 1 component
# =====================================================================
hdr("G2 — Community detection: contoh kecil A/B + label propagation + modularity")

# Graf didefinisikan eksplisit (tanpa RNG): 11 akun, 4 device.
# Community A: A1..A6 berbagi SATU device DA (klik sempurna, 15 edge).
# Community B: B1..B5 berbagi SATU device DB (klik sempurna, 10 edge).
# Jembatan: DX dipakai A6+B1, DY dipakai A2+B2 -> SATU component berisi 2 community.
devices_g2 = {
    "DA": ["A1", "A2", "A3", "A4", "A5", "A6"],
    "DB": ["B1", "B2", "B3", "B4", "B5"],
    "DX": ["A6", "B1"],
    "DY": ["A2", "B2"],
}
accounts_g2 = ["A1", "A2", "A3", "A4", "A5", "A6",
               "B1", "B2", "B3", "B4", "B5"]
fraud_g2 = {"A1": 1, "A2": 1, "A3": 1, "A4": 0, "A5": 0, "A6": 0,
            "B1": 0, "B2": 0, "B3": 0, "B4": 0, "B5": 0}
adj_g2 = {a: set() for a in accounts_g2}
for members in devices_g2.values():
    for a in members:
        for b in members:
            if a != b:
                adj_g2[a].add(b)
n_edges = sum(len(v) for v in adj_g2.values()) // 2
print(f"graf: {len(accounts_g2)} akun, {n_edges} edge (2 community, 1 component)")
for a in accounts_g2:
    print(f"   {a}: degree={len(adj_g2[a])} fraud={fraud_g2[a]}")
print(f"   degree total = {sum(len(v) for v in adj_g2.values())} = 2 x {n_edges} edge")


def modularity(adj, partition):
    """Q = sum_c [ L_c/m - (d_c/2m)^2 ]. partition: dict node -> community id."""
    m = sum(len(v) for v in adj.values()) / 2
    q = 0.0
    comms = defaultdict(list)
    for node, c in partition.items():
        comms[c].append(node)
    for c, members in comms.items():
        s = set(members)
        lc = sum(1 for u in members for v in adj[u] if v in s) / 2
        dc = sum(len(adj[u]) for u in members)
        q += lc / m - (dc / (2 * m)) ** 2
    return q


true_part = {a: ("A" if a.startswith("A") else "B") for a in accounts_g2}
print(f"modularity partisi sejati (A/B): {modularity(adj_g2, true_part):.4f}")
# Satu component berisi keduanya -> modularity partisi 1 community:
one_part = {a: "ALL" for a in accounts_g2}
print(f"modularity bila dianggap 1 community: {modularity(adj_g2, one_part):.4f}")


def label_propagation(adj, order, tie="keep", rng_lp=None, max_iter=20):
    """Label propagation asinkron: tiap node mengadopsi label terbanyak tetangga.
    Seri (tie) -> 'keep' (pertahankan label sendiri) atau 'random' (acak)."""
    labels = {a: a for a in order}
    for _ in range(max_iter):
        changed = False
        for a in order:
            counts = defaultdict(int)
            for b in adj[a]:
                counts[labels[b]] += 1
            if not counts:
                continue
            best_n = max(counts.values())
            cands = sorted([lab for lab, n in counts.items() if n == best_n])
            if len(cands) == 1:
                new = cands[0]
            elif tie == "keep":
                new = labels[a] if labels[a] in cands else cands[0]
            else:
                new = rng_lp.choice(cands)
            if new != labels[a]:
                labels[a] = new
                changed = True
        if not changed:
            break
    return labels


lp_alpha = label_propagation(adj_g2, accounts_g2, tie="keep")
lp_rev = label_propagation(adj_g2, list(reversed(accounts_g2)), tie="keep")
print(f"label propagation (urutan A1..B5): {lp_alpha}")
print(f"  -> {len(set(lp_alpha.values()))} community, "
      f"modularity {modularity(adj_g2, lp_alpha):.4f}")
print(f"label propagation (urutan B5..A1): {lp_rev}")
print(f"  -> {len(set(lp_rev.values()))} community, "
      f"modularity {modularity(adj_g2, lp_rev):.4f}")
# Stabilitas: 10 run tie-breaking acak (seed 1..10) — berapa kali tiap akun
# mendarat di community yang sama dengan mayoritas A?
rng_lp = np.random.default_rng(7)
from collections import Counter
stab = {a: Counter() for a in accounts_g2}
for s in range(10):
    r = np.random.default_rng(100 + s)
    lab = label_propagation(adj_g2, accounts_g2, tie="random", rng_lp=r)
    # normalisasi: community yang memuat A1 disebut "kom-A"
    comp_a = lab["A1"]
    for a in accounts_g2:
        stab[a]["A" if lab[a] == comp_a else "B"] += 1
print("stabilitas 10 run (tie acak) — jumlah run tiap akun di community-A:")
for a in accounts_g2:
    print(f"   {a}: A={stab[a]['A']}/10 B={stab[a]['B']}/10")

# Praktik per community (partisi sejati A/B).
for cname, members in (("A", [a for a in accounts_g2 if a.startswith("A")]),
                       ("B", [a for a in accounts_g2 if a.startswith("B")])):
    s = set(members)
    internal = sum(1 for u in members for v in adj_g2[u] if v in s) // 2
    external = sum(1 for u in members for v in adj_g2[u] if v not in s)
    possible = len(members) * (len(members) - 1) // 2
    fr = sum(fraud_g2[a] for a in members) / len(members)
    print(f"community {cname}: size={len(members)} internal_edges={internal} "
          f"external_edges={external} internal_density={internal / possible:.4f} "
          f"fraud_rate={fr:.4f}")
print(f"component keseluruhan: size=11 fraud_rate="
      f"{sum(fraud_g2.values()) / 11:.4f}")

# --- Perbandingan model pada data sintetis M3.2 (generator notebook, seed 42):
# component-only vs +degree vs +community. Community dihitung dengan label
# propagation yang sama (tie=keep, urutan akun 0..1999).
hdr("G2 — perbandingan model pada data M3.2 (seed 42, split sama)")
rng2 = np.random.default_rng(42)
N2, DEV2 = 2000, 400
device2 = rng2.integers(0, DEV2, size=N2)
ring2 = rng2.choice(N2, size=60, replace=False)
device2[ring2] = rng2.integers(0, 6, size=60)
is_ring2 = np.zeros(N2, dtype=bool)
is_ring2[ring2] = True
txn2 = rng2.poisson(28, size=N2)
amt2 = rng2.lognormal(mean=10.0, sigma=0.6, size=N2)
fraud2 = np.zeros(N2, dtype=int)
fraud2[ring2] = (rng2.random(60) < 0.60).astype(int)
fraud2[~is_ring2] = (rng2.random((~is_ring2).sum()) < 0.02).astype(int)
d2a = defaultdict(list)
for i, d in enumerate(device2):
    d2a[int(d)].append(i)
adj2 = {i: set() for i in range(N2)}
for members in d2a.values():
    for a in members:
        for b in members:
            if a != b:
                adj2[a].add(b)
# component (BFS) + community (label propagation).
comp_id = np.zeros(N2, dtype=int)
vis = np.zeros(N2, dtype=bool)
ncomp = 0
for s in range(N2):
    if vis[s]:
        continue
    ncomp += 1
    q = deque([s])
    vis[s] = True
    while q:
        u = q.popleft()
        comp_id[u] = ncomp
        for v in adj2[u]:
            if not vis[v]:
                vis[v] = True
                q.append(v)
comp_size2 = np.bincount(comp_id)[1:]
df2 = pd.DataFrame({
    "txn_count": txn2, "log_amount": np.log(amt2),
    "degree": [len(adj2[i]) for i in range(N2)],
    "maxshare": [len(d2a[int(device2[i])]) for i in range(N2)],
    "component_size": [comp_size2[comp_id[i] - 1] for i in range(N2)],
    "fraud": fraud2,
})
lp2 = label_propagation(adj2, list(range(N2)), tie="keep")
comm_of = pd.Series([lp2[i] for i in range(N2)])
comm_size2 = comm_of.value_counts()
df2["community_size"] = [comm_size2[c] for c in comm_of]
# internal_density per akun: edge internal community / edge total akun itu.
df2["internal_density"] = [
    (sum(1 for v in adj2[i] if lp2[v] == lp2[i]) / len(adj2[i])
     if adj2[i] else 0.0) for i in range(N2)]
print(f"component: {ncomp}; community (LP): {comm_size2.shape[0]}; "
      f"community==component? "
      f"{(df2['community_size'] == df2['component_size']).mean():.4f} akun sama")
print(f"internal_density: mean {df2['internal_density'].mean():.4f} "
      f"(1,0 = semua tetangga se-community)")
idx = np.arange(N2)
itrain, itest = train_test_split(idx, test_size=0.25, random_state=42,
                                 stratify=fraud2)
for name, feats in [
        ("dasar (2 fitur)", ["txn_count", "log_amount"]),
        ("+component (3 fitur)", ["txn_count", "log_amount", "component_size"]),
        ("+degree (5 fitur)", ["txn_count", "log_amount", "degree",
                               "maxshare", "component_size"]),
        ("+community (7 fitur)", ["txn_count", "log_amount", "degree",
                                  "maxshare", "component_size",
                                  "community_size", "internal_density"])]:
    m = Pipeline([("scaler", StandardScaler()),
                  ("logreg", LogisticRegression(max_iter=1000))])
    m.fit(df2[feats].values[itrain], fraud2[itrain])
    auc = roc_auc_score(fraud2[itest],
                        m.predict_proba(df2[feats].values[itest])[:, 1])
    print(f"  {name}: ROC-AUC test {auc:.4f}")


# --- Louvain sederhana (fase 1 saja: pindah node ke community tetangga
# yang menaikkan modularitas paling besar) pada graf kecil A/B. ---
def louvain_phase1(adj, order):
    comm = {a: a for a in order}
    m = sum(len(v) for v in adj.values()) / 2
    improved = True
    n_pass = 0
    while improved and n_pass < 10:
        improved = False
        n_pass += 1
        for a in order:
            cur = comm[a]
            # kandidat: community para tetangga (+ community sendiri);
            # sorted() supaya deterministik antar-run (set str tidak stabil).
            cands = sorted({comm[b] for b in adj[a]} | {cur})
            best_c, best_gain = cur, 0.0
            for c in cands:
                if c == cur:
                    continue
                trial = dict(comm)
                trial[a] = c
                gain = modularity(adj, trial) - modularity(adj, comm)
                if gain > best_gain + 1e-12:
                    best_gain, best_c = gain, c
            if best_c != cur:
                comm[a] = best_c
                improved = True
    return comm, n_pass


lp_louv, n_pass = louvain_phase1(adj_g2, accounts_g2)
print(f"Louvain sederhana ({n_pass} pass): {lp_louv}")
print(f"modularity hasil Louvain: {modularity(adj_g2, lp_louv):.4f}")
groups = defaultdict(list)
for a, c in lp_louv.items():
    groups[c].append(a)
print(f"community Louvain: {[sorted(v) for v in groups.values()]}")
# Berapa akun terisolasi (degree 0) di data M3.2?
print(f"akun terisolasi (degree 0) di data M3.2: "
      f"{int((df2['degree'] == 0).sum())} dari 2000")


# =====================================================================
# G3 — Directed money-flow graph (M3.2): K1..K5 + akun normal
# =====================================================================
hdr("G3 — Directed money-flow: K1..K5 + normal, cutoff 18:00")
from datetime import datetime

tx_g3 = [
    # (from, to, amount Rp, jam)
    ("EXT", "K1", 50_000_000, "08:00"),
    ("K1", "K2", 20_000_000, "09:15"),
    ("K1", "K3", 30_000_000, "10:00"),
    ("K2", "K4", 18_000_000, "13:00"),
    ("K3", "K4", 25_000_000, "14:30"),
    ("K4", "K5", 40_000_000, "17:00"),
    ("K5", "EXT", 38_000_000, "23:00"),  # SETELAH cutoff 18:00 -> leakage bila dipakai
    ("K6", "K7", 5_000_000, "09:00"),
    ("K7", "K6", 2_000_000, "15:00"),
    ("K6", "K8", 3_000_000, "11:00"),
    ("K8", "K6", 1_000_000, "16:00"),
    ("K7", "K8", 4_000_000, "12:00"),
]
CUTOFF = "18:00"


def _mins(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def money_flow_stats(txs):
    accs = sorted({a for t in txs for a in (t[0], t[1]) if a != "EXT"})
    stats = {}
    for a in accs:
        ins = [(f, amt, t) for f, to, amt, t in txs if to == a]
        outs = [(to, amt, t) for f, to, amt, t in txs if f == a]
        in_flow = sum(x[1] for x in ins)
        out_flow = sum(x[1] for x in outs)
        # dwell: tiap out, selisih ke in terakhir sebelumnya; median.
        dwells = []
        for _, _, t_out in outs:
            prev = [t for _, _, t in ins if _mins(t) < _mins(t_out)]
            if prev:
                dwells.append(_mins(t_out) - _mins(max(prev, key=_mins)))
        dwell = float(np.median(dwells)) if dwells else None
        stats[a] = {
            "in_deg": len({f for f, _, _ in ins}),
            "out_deg": len({t for t, _, _ in outs}),
            "in_flow": in_flow, "out_flow": out_flow,
            "fan_in": len({f for f, _, _ in ins}),
            "fan_out": len({t for t, _, _ in outs}),
            "ratio": (out_flow / in_flow) if in_flow else None,
            "dwell_min": dwell,
        }
    # hop ke EXT (BFS mundur dari EXT pada graf berarah).
    succ = defaultdict(list)
    for f, to, _, _ in txs:
        succ[f].append(to)
    hops = {}
    q = deque([("EXT", 0)])
    seen = {"EXT"}
    while q:
        node, d = q.popleft()
        hops[node] = d
        for f, to, _, _ in txs:
            if to == node and f not in seen:
                seen.add(f)
                q.append((f, d + 1))
    for a in accs:
        stats[a]["hops_to_EXT"] = hops.get(a)
    return stats


for label, txs in (("SEMUA transaksi", tx_g3),
                   ("hanya s.d. cutoff 18:00 (tanpa leakage)",
                    [t for t in tx_g3 if _mins(t[3]) < _mins(CUTOFF)])):
    print(f"-- {label} --")
    st = money_flow_stats(txs)
    for a, s in st.items():
        dwell = f"{s['dwell_min']:.0f} mnt" if s["dwell_min"] is not None else "-"
        ratio = f"{s['ratio']:.2f}" if s["ratio"] is not None else "-"
        print(f"   {a}: in_deg={s['in_deg']} out_deg={s['out_deg']} "
              f"in={s['in_flow'] / 1e6:.0f}jt out={s['out_flow'] / 1e6:.0f}jt "
              f"fan_in={s['fan_in']} fan_out={s['fan_out']} "
              f"keluar/masuk={ratio} dwell_median={dwell} "
              f"hop_ke_EXT={s['hops_to_EXT']}")


# =====================================================================
# G4 — Rolling velocity (M3.3): transaksi sintetis 3 akun, 7 hari
# =====================================================================
hdr("G4 — Rolling velocity: N normal, F burst fraud, S acara keluarga")
from datetime import datetime, timedelta

rng4 = np.random.default_rng(42)
BASE = datetime(2025, 9, 1, 0, 0)


def _mk_txns():
    txns = []  # (account, device, timestamp, merchant, amount NT$, fraud)
    # N normal: 2 txn/hari jam 09:00 & 19:00, merchant M1, NT$1.000-5.000.
    for d in range(7):
        for h, m in ((9, 0), (19, 0)):
            txns.append(("N", "D-N", BASE + timedelta(days=d, hours=h),
                         "M1", int(rng4.integers(1000, 5001)), 0))
    # F: 6 hari normal, hari ke-7 burst 12 txn jam 10:00-10:55, 6 merchant.
    for d in range(6):
        for h in (9, 19):
            txns.append(("F", "D-F", BASE + timedelta(days=d, hours=h),
                         "M1", int(rng4.integers(1000, 5001)), 0))
    burst_merchants = ["M1", "M2", "M3", "M4", "M5", "M6"]
    for j in range(12):
        txns.append(("F", f"D-F{j % 3}", BASE + timedelta(days=6, hours=10, minutes=4 * j + 1),
                     burst_merchants[j % 6], int(rng4.integers(8000, 15001)), 1))
    # S acara keluarga: 6 hari normal, hari ke-7 10 txn 09:00-20:00, 3 merchant.
    for d in range(6):
        for h in (9, 19):
            txns.append(("S", "D-S", BASE + timedelta(days=d, hours=h),
                         "M1", int(rng4.integers(1000, 5001)), 0))
    for j, (hh, mm) in enumerate([(9, 5), (10, 20), (11, 40), (13, 10), (14, 30),
                                  (15, 45), (16, 50), (18, 5), (19, 15), (20, 0)]):
        txns.append(("S", "D-S", BASE + timedelta(days=6, hours=hh, minutes=mm),
                     ["M1", "M2", "M3"][j % 3], int(rng4.integers(2000, 6001)), 0))
    return sorted(txns, key=lambda t: t[2])


TX4 = _mk_txns()
print(f"transaksi sintetis: {len(TX4)} (N={sum(1 for t in TX4 if t[0]=='N')}, "
      f"F={sum(1 for t in TX4 if t[0]=='F')}, S={sum(1 for t in TX4 if t[0]=='S')})")


def rolling_stats(txns, acc):
    mine = [t for t in txns if t[0] == acc]
    # baseline pribadi: rata-rata jumlah txn per 24 jam di 6 hari pertama.
    first6 = [t for t in mine if t[2] < BASE + timedelta(days=6)]
    base24 = len(first6) / 6
    day7 = [t for t in mine if t[2] >= BASE + timedelta(days=6)]
    # rolling 1 jam: max count dalam jendela (t-1j, t] atas SEMUA txn akun.
    max1h, max1h_merch, max1h_at = 0, 0, None
    for t in mine:
        w = [x for x in mine if t[2] - timedelta(hours=1) < x[2] <= t[2]]
        if len(w) > max1h:
            max1h, max1h_merch, max1h_at = (len(w), len({x[3] for x in w}), t[2])
    total24_day7 = sum(t[4] for t in day7)
    return {
        "n_day7": len(day7), "max1h": max1h, "max1h_merch": max1h_merch,
        "max1h_at": max1h_at, "total24": total24_day7,
        "base24": base24, "ratio24": len(day7) / base24 if base24 else None,
        "devices7d": len({t[1] for t in mine}),
        "merch24": len({t[3] for t in day7}),
    }


THRESH = {"count1h": 10, "merch1h": 5, "total24": 100_000}
for acc in ("N", "F", "S"):
    s = rolling_stats(TX4, acc)
    trips = []
    if s["max1h"] >= THRESH["count1h"]:
        trips.append(f">=10 txn/1j ({s['max1h']})")
    if s["max1h_merch"] >= THRESH["merch1h"]:
        trips.append(f">=5 merchant/1j ({s['max1h_merch']})")
    if s["total24"] > THRESH["total24"]:
        trips.append(f"total 24j > NT$100.000 ({s['total24']:,})")
    print(f"akun {acc}: hari-7 n={s['n_day7']} max1h={s['max1h']} "
          f"(jam {s['max1h_at'].strftime('%H:%M')}, merchant unik "
          f"{s['max1h_merch']}) total24=NT${s['total24']:,} "
          f"baseline24={s['base24']:.1f} rasio24={s['ratio24']:.1f} "
          f"device7d={s['devices7d']} merchant24={s['merch24']} | "
          f"ambang terlampaui: {trips if trips else 'TIDAK ADA'}")
# Daftar transaksi hari ke-7 akun F (untuk lab: 12 txn burst).
print("transaksi F hari ke-7 (untuk lab):")
for t in TX4:
    if t[0] == "F" and t[2] >= BASE + timedelta(days=6):
        print(f"   {t[2].strftime('%H:%M')} {t[3]} NT${t[4]:,} device={t[1]}")


# =====================================================================
# G6 — Pemetaan outcome fraud vs default (M3.5): aritmetika contoh
# =====================================================================
hdr("G6 — Outcome fraud vs default: dua label, dua EV")
print(f"antrean 500 alert [ilustrasi]: default 300 -> precision_default "
      f"= 300/500 = {300 / 500:.2f}; confirmed fraud 60 -> "
      f"precision_fraud = 60/500 = {60 / 500:.2f}")
print(f"EV default: 300 x 61.910,67 - 500 x 200 = "
      f"{300 * 61910.67 - 500 * 200:,.0f}")
print(f"EV fraud: 60 x 150.000 - 500 x 500 = {60 * 150000 - 500 * 500:,.0f}")
print(f"selisih EV: {300 * 61910.67 - 500 * 200 - (60 * 150000 - 500 * 500):,.0f}")


# =====================================================================
# G8 — Benford eligibility + Benjamini-Hochberg (M3.3)
# =====================================================================
hdr("G8 — Benjamini-Hochberg: 100 merchant, 12 p<0,05")
p12 = [0.0003, 0.0009, 0.004, 0.011, 0.019, 0.024,
       0.031, 0.035, 0.041, 0.044, 0.047, 0.049]
Q_BH, M_BH = 0.05, 100
survive = 0
for i, p in enumerate(sorted(p12), start=1):
    thr = i / M_BH * Q_BH
    ok = p <= thr
    print(f"  rank {i}: p={p:.4f} vs ambang BH {i}/{M_BH}x0,05={thr:.4f} "
          f"-> {'LOLOS' if ok else 'gugur'}")
    if ok:
        survive = i
print(f"setelah FDR (q=0,05): {survive} dari 12 merchant tetap signifikan")


# =====================================================================
# G7 — Kurva keputusan threshold (M3.5): reproduksi skor GBM M3.5
# =====================================================================
hdr("G7 — Kurva keputusan: reproduksi GBM M3.5 (UCI lokal, seed 42)")
import os
_UCI = ("qa-learn/uci_credit.xls" if os.path.exists("qa-learn/uci_credit.xls")
        else "/tmp/uci_credit.xls")
dfu = pd.read_excel(_UCI, header=1)
dfu.columns = [c.strip() for c in dfu.columns]
dfu = dfu.rename(columns={"default payment next month": "y"})
dfu["EDUCATION"] = dfu["EDUCATION"].clip(upper=4)
FEATS35 = ["LIMIT_BAL", "SEX", "EDUCATION", "MARRIAGE", "AGE",
           "PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6",
           "BILL_AMT1", "BILL_AMT2", "BILL_AMT3", "BILL_AMT4", "BILL_AMT5", "BILL_AMT6",
           "PAY_AMT1", "PAY_AMT2", "PAY_AMT3", "PAY_AMT4", "PAY_AMT5", "PAY_AMT6"]
Xtr, Xte, ytr, yte = train_test_split(
    dfu[FEATS35], dfu["y"], test_size=0.2, random_state=42, stratify=dfu["y"])
gbm35 = HistGradientBoostingClassifier(random_state=42)
gbm35.fit(Xtr, ytr)
proba35 = gbm35.predict_proba(Xte)[:, 1]
ytest = yte.values
print(f"ROC-AUC test reproduksi: {roc_auc_score(ytest, proba35):.4f} "
      f"(kanonis notebook 0,7807); test {len(ytest)}, default {int(ytest.sum())}")
order = np.argsort(-proba35)
ys = ytest[order]
cum_tp = np.cumsum(ys)
C_MISS, C_REV = 61910.6677, 200  # C eksak notebook (lesson langkah 4),
# BUKAN 61.910,67 dua desimal — supaya EV cocok dengan angka kanonis
print("k | TP | precision@k | recall@k | EV(k) | EV marginal rata-rata per blok")
prev_ev, prev_k = 0.0, 0
for k in (100, 500, 1000, 2000, 3000, 4000, 5000, 6000):
    tp = int(cum_tp[k - 1])
    ev = tp * C_MISS - k * C_REV
    print(f"{k:>5} | {tp:>4} | {tp / k:.4f} | {tp / ytest.sum():.4f} | "
          f"{ev:>12,.0f} | {(ev - prev_ev) / (k - prev_k):>10,.0f} per alert")
    prev_ev, prev_k = ev, k
# EV marginal halus: presisi lokal di jendela +-50 peringkat x C - biaya review.
# Titik impas: presisi lokal = C_REV / C_MISS.
print(f"presisi impas: C_REV/C_MISS = {C_REV / C_MISS:.5f} (C_REV=200); "
      f"1.000 -> {1000 / C_MISS:.5f}; 5.000 -> {5000 / C_MISS:.5f}")
half = 50
local_prec = np.array([ys[max(0, i - half):i + half + 1].mean()
                       for i in range(len(ys))])
for crev in (200, 1000, 5000):
    be = crev / C_MISS
    below = np.where(local_prec < be)[0]
    k_cross = int(below[0]) + 1 if len(below) else None
    print(f"C_REV=NT${crev:,}: presisi impas {be:.4f}; "
          f"presisi lokal jatuh di bawah impas pertama kali di k={k_cross} "
          f"(EV marginal k itu {local_prec[k_cross - 1] * C_MISS - crev:,.0f})"
          if k_cross else f"C_REV=NT${crev:,}: presisi lokal tidak pernah "
          f"di bawah impas {be:.4f} sampai k=6.000")
print(f"workload: k=500 -> {500 / 50:.0f} analis-hari (@50 alert/analis/hari); "
      f"k=1.000 -> {1000 / 50:.0f}; k=6.000 -> {6000 / 50:.0f}")
# Verifikasi titik kanonis notebook: P@100/500/1000.
print(f"cek kanonis: P@100={cum_tp[99] / 100:.4f} P@500={cum_tp[499] / 500:.4f} "
      f"P@1000={cum_tp[999] / 1000:.4f} (harus 0,8600/0,7260/0,6060)")


# =====================================================================
# G5 — Capstone integrasi (M3.5): 2.000 akun, cutoff hari ke-30
# =====================================================================
hdr("G5 — Capstone: staged models, cutoff hari ke-30, evaluasi 2 periode")
rng5 = np.random.default_rng(42)
N5, DEV5 = 2000, 400
DAYS_FEAT, DAYS_P1, DAYS_P2 = 30, 15, 15  # fitur hari 1-30; label P1 hari 31-45; P2 hari 46-60
LIMIT5 = rng5.lognormal(mean=11.0, sigma=0.5, size=N5)
SEX5 = (rng5.random(N5) < 0.6).astype(int) + 1  # 1 laki-laki, 2 perempuan
AGE5 = rng5.integers(25, 61, size=N5)
# Fraud tanam: ring 40 akun (5 device), burst 30 akun, drift 30 akun.
ring5 = rng5.choice(N5, size=40, replace=False)
rest5 = np.setdiff1d(np.arange(N5), ring5)
burst5 = rng5.choice(rest5, size=30, replace=False)
rest5b = np.setdiff1d(rest5, burst5)
drift5 = rng5.choice(rest5b, size=30, replace=False)
is_fraud5 = np.zeros(N5, dtype=bool)
is_fraud5[ring5] = True
is_fraud5[burst5] = True
is_fraud5[drift5] = True
print(f"fraud tanam: ring {len(ring5)} + burst {len(burst5)} + drift "
      f"{len(drift5)} = {is_fraud5.sum()} dari {N5} akun (rate "
      f"{is_fraud5.mean():.4f})")
# Device: 1 utama + 50% kedua (tetangga) — graf statis sepanjang 60 hari.
dev5_main = rng5.integers(0, DEV5, size=N5)
dev5_main[ring5] = rng5.integers(0, 5, size=40)
dev5_second = np.full(N5, -1)
_has2 = rng5.random(N5) < 0.5
_nbr5 = (np.arange(N5) + rng5.integers(1, 6, size=N5)) % N5
dev5_second[_has2] = dev5_main[_nbr5[_has2]]
# Transaksi hari 1-60: tiap akun ~2 txn/hari; burst/drift punya pola sendiri.
MERCH5 = 20


def gen_txns(day0, day1):
    """Kembalikan arrays (acc, abs_hour, amount, merchant) untuk hari day0..day1."""
    accs, hours, amts, merch = [], [], [], []
    for a in range(N5):
        lam = 2.0
        for d in range(day0, day1):
            n = rng5.poisson(lam)
            for _ in range(n):
                h = rng5.integers(0, 24)
                amt = rng5.lognormal(mean=9.0, sigma=0.7)
                # drift: jumlah naik linear 1,0x (hari 1) -> 1,8x (hari 30) -> 3x (hari 60)
                if a in drift5:
                    amt *= 1.0 + 2.0 * (d / 60)
                if a in ring5:
                    amt *= 1.2
                accs.append(a)
                hours.append(d * 24 + int(h))
                amts.append(amt)
                merch.append(int(rng5.integers(0, MERCH5)))
        # burst mini pra-cutoff (hari 1-30) + burst evaluasi (hari 31-60).
        if a in burst5:
            for bd in ([5, 17, 26] if day1 <= 30 else [35, 44, 52]):
                if day0 <= bd < day1:
                    base_h = bd * 24 + 10
                    for j in range(6):
                        accs.append(a)
                        hours.append(base_h + j // 2)
                        amts.append(float(rng5.lognormal(mean=9.5, sigma=0.4)))
                        merch.append(int(rng5.integers(0, MERCH5)))
    return (np.array(accs), np.array(hours), np.array(amts),
            np.array(merch))


acc_f, hr_f, amt_f, mc_f = gen_txns(0, DAYS_FEAT)
print(f"transaksi fitur (hari 1-30): {len(acc_f)}")
# --- Fitur dari hari 1-30 SAJA (sebelum cutoff). ---
txn_count = np.bincount(acc_f, minlength=N5).astype(float)
mean_amt = np.zeros(N5)
np.add.at(mean_amt, acc_f, amt_f)
mean_amt /= np.maximum(txn_count, 1)
max_amt = np.zeros(N5)
np.maximum.at(max_amt, acc_f, amt_f)
# BILL harian -> UTIL + BILL_TREND + drift slope.
daily = np.zeros((N5, DAYS_FEAT))
np.add.at(daily, (acc_f, hr_f // 24), amt_f)
util = daily.mean(axis=1) / LIMIT5
bill_trend = daily[:, 25:30].mean(axis=1) / np.maximum(daily[:, :25].mean(axis=1), 1)
xs = np.arange(DAYS_FEAT)
slope = np.array([np.polyfit(xs, daily[a], 1)[0] for a in range(N5)])
drift_feat = slope / np.maximum(daily.mean(axis=1), 1)  # slope relatif per hari
# PAY_RATIO: pembayaran = tagihan x rasio (0,3-0,7); fraud drift bayar lebih sedikit.
pay_ratio_base = rng5.uniform(0.3, 0.7, size=N5)
pay_ratio_base[drift5] *= 0.6
pay_ratio = np.clip(pay_ratio_base, 0.05, 0.95)
# Velocity: max 1 jam & 24 jam, merchant unik 24 jam (jendela geser per akun).
max1h = np.zeros(N5, dtype=int)
max24h = np.zeros(N5, dtype=int)
uniq24 = np.zeros(N5, dtype=int)
for a in range(N5):
    h = np.sort(hr_f[acc_f == a])
    m = mc_f[acc_f == a][np.argsort(hr_f[acc_f == a])]
    j = 0
    best1, best24, bestu = 0, 0, 0
    for i in range(len(h)):
        while h[i] - h[j] > 1:
            j += 1
        best1 = max(best1, i - j + 1)
    j = 0
    for i in range(len(h)):
        while h[i] - h[j] > 24:
            j += 1
        best24 = max(best24, i - j + 1)
        bestu = max(bestu, len(set(m[j:i + 1])))
    max1h[a], max24h[a], uniq24[a] = best1, best24, bestu
# Graf (device statis): degree, maxshare, component, community (LP), density.
d5a = defaultdict(list)
for a in range(N5):
    d5a[int(dev5_main[a])].append(a)
    if dev5_second[a] >= 0:
        d5a[int(dev5_second[a])].append(a)
adj5 = {a: set() for a in range(N5)}
for members in d5a.values():
    for a in members:
        for b in members:
            if a != b:
                adj5[a].add(b)
comp5 = np.zeros(N5, dtype=int)
vis5 = np.zeros(N5, dtype=bool)
_nc = 0
for s in range(N5):
    if vis5[s]:
        continue
    _nc += 1
    _q = deque([s])
    vis5[s] = True
    while _q:
        u = _q.popleft()
        comp5[u] = _nc
        for v in adj5[u]:
            if not vis5[v]:
                vis5[v] = True
                _q.append(v)
_csize = np.bincount(comp5)[1:]
degree5 = np.array([len(adj5[a]) for a in range(N5)], dtype=float)
maxshare5 = np.array([len(d5a[int(dev5_main[a])]) for a in range(N5)], dtype=float)
comp_size5 = np.array([_csize[comp5[a] - 1] for a in range(N5)], dtype=float)
lp5 = label_propagation(adj5, list(range(N5)), tie="keep")
_comm5 = pd.Series([lp5[i] for i in range(N5)])
_csz5 = _comm5.value_counts()
comm_size5 = np.array([_csz5[c] for c in _comm5], dtype=float)
int_dens5 = np.array([
    (sum(1 for v in adj5[a] if lp5[v] == lp5[a]) / len(adj5[a])
     if adj5[a] else 0.0) for a in range(N5)])
# Anomaly: IsolationForest pada fitur dasar+behavioral; peer z-score UTIL.
base_behav = np.column_stack([txn_count, mean_amt, max_amt, util,
                              bill_trend, pay_ratio])
iso5 = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
iso_score = -iso5.fit(base_behav).score_samples(base_behav)  # besar = aneh
bands5 = np.digitize(LIMIT5, [50_000, 150_000, 300_000])
z_util = np.zeros(N5)
for b in range(4):
    msk = bands5 == b
    if msk.sum() == 0:  # band kosong: tidak ada z-score yang dihitung
        continue
    z_util[msk] = (util[msk] - util[msk].mean()) / max(util[msk].std(), 1e-9)
FEAT_SETS = {
    "1 baseline transaksi": ["txn_count", "mean_amt", "max_amt"],
    "2 +behavioral": ["txn_count", "mean_amt", "max_amt", "util",
                      "bill_trend", "pay_ratio"],
    "3 +graph": ["txn_count", "mean_amt", "max_amt", "util",
                 "bill_trend", "pay_ratio", "degree", "maxshare",
                 "comp_size", "comm_size", "int_dens"],
    "4 +velocity": ["txn_count", "mean_amt", "max_amt", "util",
                    "bill_trend", "pay_ratio", "degree", "maxshare",
                    "comp_size", "comm_size", "int_dens",
                    "max1h", "max24h", "uniq24"],
    "5 +anomaly": ["txn_count", "mean_amt", "max_amt", "util",
                    "bill_trend", "pay_ratio", "degree", "maxshare",
                    "comp_size", "comm_size", "int_dens",
                    "max1h", "max24h", "uniq24", "iso"],
    "6 full (+profile)": ["txn_count", "mean_amt", "max_amt", "util",
                          "bill_trend", "pay_ratio", "degree", "maxshare",
                          "comp_size", "comm_size", "int_dens",
                          "max1h", "max24h", "uniq24",
                          "iso", "z_util", "drift"],
}
F = {"txn_count": txn_count, "mean_amt": mean_amt, "max_amt": max_amt,
     "util": util, "bill_trend": bill_trend, "pay_ratio": pay_ratio,
     "degree": degree5, "maxshare": maxshare5, "comp_size": comp_size5,
     "comm_size": comm_size5, "int_dens": int_dens5,
     "max1h": max1h.astype(float), "max24h": max24h.astype(float),
     "uniq24": uniq24.astype(float), "iso": iso_score,
     "z_util": z_util, "drift": drift_feat}
print(f"fitur: max1h burst={max1h[burst5].mean():.1f} vs normal="
      f"{max1h[~is_fraud5].mean():.1f}; BILL_TREND drift="
      f"{bill_trend[drift5].mean():.2f} vs normal="
      f"{bill_trend[~is_fraud5].mean():.2f}; degree ring="
      f"{degree5[ring5].mean():.1f} vs normal={degree5[~is_fraud5].mean():.1f}")
# Label P1 (hari 31-45) dan P2 (hari 46-60) DITURUNKAN dari aktivitas
# jendela evaluasi itu sendiri (bukan disalin dari label tanam):
# - ring: fraud di kedua periode (ring persisten);
# - burst P1: 30 akun burst (hari 35, 44); burst P2: 20 dari 30 itu
#   (hari 52) + 15 akun BARU yang baru mulai burst di P2;
# - drift: 30 akun naik di P1; 15 di antaranya kembali normal di P2.
burst_p2_keep = set(rng5.choice(burst5, size=20, replace=False).tolist())
burst_p2_new = set(rng5.choice(np.setdiff1d(np.arange(N5), np.concatenate(
    [ring5, burst5, drift5])), size=15, replace=False).tolist())
drift_p2_keep = set(rng5.choice(drift5, size=15, replace=False).tolist())
print(f"P2: burst lanjut {len(burst_p2_keep)} + burst baru "
      f"{len(burst_p2_new)}; drift lanjut {len(drift_p2_keep)} dari 30")
# Bangkitkan transaksi evaluasi hari 31-60 (RNG lanjut; fitur TIDAK memakai ini).
acc_e, hr_e, amt_e = [], [], []
for a in range(N5):
    for d in range(30, 60):
        n = rng5.poisson(2)
        for _ in range(n):
            amt = float(rng5.lognormal(mean=9.0, sigma=0.7))
            if a in ring5:
                amt *= 1.2
            if a in drift5:
                if d < 45 or a in drift_p2_keep:
                    amt *= 1.0 + 2.0 * (d / 60)
            acc_e.append(a)
            hr_e.append(d * 24 + int(rng5.integers(0, 24)))
            amt_e.append(amt)
    burst_days = []
    if a in burst5:
        burst_days += [35, 44]
    if a in burst_p2_keep or a in burst_p2_new:
        burst_days += [52]
    for bd in burst_days:
        for j in range(6):
            acc_e.append(a)
            hr_e.append(bd * 24 + 10)  # 6 txn dalam 1 jam yang sama
            amt_e.append(float(rng5.lognormal(mean=9.5, sigma=0.4)))
acc_e = np.array(acc_e)
hr_e = np.array(hr_e)
amt_e = np.array(amt_e)


def _burst_in_window(a, d0, d1):
    h = np.sort(hr_e[(acc_e == a) & (hr_e >= d0 * 24) & (hr_e < d1 * 24)])
    for i in range(len(h)):
        if i >= 5 and h[i] - h[i - 5] <= 1:
            return True
    return False


def _mean_amt_window(a, d0, d1):
    m = (acc_e == a) & (hr_e >= d0 * 24) & (hr_e < d1 * 24)
    return amt_e[m].mean() if m.sum() else 0.0


base_txn_mean = np.zeros(N5)  # rata-rata nominal PER TRANSAKSI hari 1-30
np.add.at(base_txn_mean, acc_f, amt_f)
base_txn_mean /= np.maximum(txn_count, 1)
# Label = jadwal tanam (ground truth sintetis): ring persisten; burst P1 =
# 30 akun; burst P2 = 20 lanjut + 15 baru; drift P1 = 30 akun; drift P2 =
# 15 yang lanjut. Aturan ambang 1,5x dipakai sebagai CHECK diagnostik
# (berapa planted drift yang tertangkap aturan itu, dan berapa false
# positive-nya) — BUKAN sebagai definisi label, karena ambang itu noisy.
y_p1 = np.zeros(N5, dtype=int)
y_p2 = np.zeros(N5, dtype=int)
for a in range(N5):
    if a in ring5 or a in burst5 or a in drift5:
        y_p1[a] = 1
    if a in ring5 or a in burst_p2_keep or a in burst_p2_new \
            or a in drift_p2_keep:
        y_p2[a] = 1
print(f"label P1: {y_p1.sum()} fraud (ring 40 + burst 30 + drift 30); "
      f"label P2: {y_p2.sum()} fraud (ring 40 + burst 35 + drift 15); "
      f"P1->P2: {int(((y_p1 == 1) & (y_p2 == 0)).sum())} berhenti, "
      f"{int(((y_p1 == 0) & (y_p2 == 1)).sum())} baru")
_drift_p1_hit = sum(1 for a in drift5
                   if _mean_amt_window(a, 30, 45) >= 1.5 * base_txn_mean[a])
_drift_p2_hit = sum(1 for a in drift_p2_keep
                   if _mean_amt_window(a, 45, 60) >= 1.5 * base_txn_mean[a])
_normal = np.setdiff1d(np.arange(N5), np.concatenate(
    [ring5, burst5, drift5, list(burst_p2_new)]))
_fp_p2 = sum(1 for a in _normal
             if _mean_amt_window(a, 45, 60) >= 1.5 * base_txn_mean[a])
print(f"check aturan drift 1,5x: menangkap {_drift_p1_hit}/30 drift di P1 "
      f"dan {_drift_p2_hit}/15 di P2 — tapi {_fp_p2} akun normal ikut "
      f"melewati ambang di P2 (false positive aturan, bukan label)")
idx5 = np.arange(N5)
itr, ite = train_test_split(idx5, test_size=0.25, random_state=42,
                            stratify=y_p1)
print(f"train {len(itr)} (fraud {y_p1[itr].sum()}) / test {len(ite)} "
      f"(fraud {y_p1[ite].sum()})")
C5, R5 = 61910.67, 200
full_model = None
for name, feats in FEAT_SETS.items():
    Xall = np.column_stack([F[f] for f in feats])
    mdl = Pipeline([("scaler", StandardScaler()),
                    ("logreg", LogisticRegression(max_iter=1000))])
    mdl.fit(Xall[itr], y_p1[itr])
    if name == "6 full (+profile)":
        full_model = mdl
    for pname, ylab in (("P1 (hari 31-45)", y_p1), ("P2 (hari 46-60)", y_p2)):
        pr = mdl.predict_proba(Xall[ite])[:, 1]
        ap = average_precision_score(ylab[ite], pr)
        o = np.argsort(-pr)[:100]
        tp100 = int(ylab[ite][o].sum())
        rec100 = tp100 / ylab[ite].sum()
        prec100 = tp100 / 100
        ev100 = tp100 * C5 - 100 * R5
        fpr_m = None
        msk_m = SEX5[ite] == 1
        pred100 = np.zeros(len(ite), dtype=int)
        pred100[o] = 1
        fp_m = int(((pred100 == 1) & (ylab[ite] == 0) & msk_m).sum())
        neg_m = int(((ylab[ite] == 0) & msk_m).sum())
        fp_f = int(((pred100 == 1) & (ylab[ite] == 0) & ~msk_m).sum())
        neg_f = int(((ylab[ite] == 0) & ~msk_m).sum())
        print(f"  {name} | {pname}: PR-AUC={ap:.4f} P@100={prec100:.2f} "
              f"R@100={rec100:.4f} EV100=NT${ev100:,.0f} "
              f"FPR@100 laki={fp_m / neg_m:.4f} perempuan={fp_f / neg_f:.4f}")
# Reason codes untuk 5 alert teratas model full (test set).
print("-- reason codes: 5 alert teratas model full (test) --")
Xfull = np.column_stack([F[f] for f in FEAT_SETS["6 full (+profile)"]])
pr_full = full_model.predict_proba(Xfull[ite])[:, 1]
top5 = ite[np.argsort(-pr_full)[:5]]
for a in top5:
    rc = []
    if max1h[a] >= 6:
        rc.append(f"velocity 1 jam {int(max1h[a])} (ambang 6)")
    if max24h[a] >= 10:
        rc.append(f"velocity 24 jam {int(max24h[a])} (ambang 10)")
    if degree5[a] >= 10:
        rc.append(f"degree {int(degree5[a])} (median normal "
                  f"{np.median(degree5[~is_fraud5]):.0f})")
    if comp_size5[a] >= 15:
        rc.append(f"component size {int(comp_size5[a])}")
    if bill_trend[a] >= 1.2:
        rc.append(f"BILL_TREND {bill_trend[a]:.2f} (tagihan naik)")
    if util[a] >= 0.5:
        rc.append(f"UTIL {util[a]:.2f} (limit terpakai besar)")
    if pay_ratio[a] <= 0.35:
        rc.append(f"PAY_RATIO {pay_ratio[a]:.2f} (bayar sedikit)")
    if max_amt[a] >= 100_000:
        rc.append(f"transaksi terbesar NT${max_amt[a]:,.0f}")
    if z_util[a] >= 2:
        rc.append(f"z-score UTIL {z_util[a]:.2f} vs peer")
    if iso_score[a] >= np.quantile(iso_score, 0.95):
        rc.append(f"skor anomali {iso_score[a]:.2f} (top 5%)")
    if comm_size5[a] >= 10:
        rc.append(f"community size {int(comm_size5[a])}")
    if drift_feat[a] >= 0.02:
        rc.append(f"drift harian +{drift_feat[a] * 100:.1f}%")
    print(f"   akun {a}: fraud_tanam={bool(is_fraud5[a])} skor="
          f"{pr_full[list(ite).index(a)]:.3f} | {len(rc)} reason codes | "
          + "; ".join(rc))
