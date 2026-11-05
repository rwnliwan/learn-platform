#!/usr/bin/env python3
"""Build snapshot untuk Misi B Fraud/AML: misi-jaring-mule.

Slice TIPOLOGI LAYERING (berbeda dari pilot misi-jejak-dana-blockchain yang
fokus atribusi ransomware + join OFAC):
  (a) 1000 alamat dengan `looped` tertinggi   (pola split->paths->merge)
  (b) 1000 alamat dengan `neighbors` tertinggi (fan-out / fan-in ekstrem)
  (c) 1000 alamat smurfing-proxy: income < P25 & count > P75, acak seed 42
Threshold dihitung dari populasi penuh 2.916.697 baris. Nilai fitur asli
TIDAK diubah; hanya penambahan kolom klaster + is_sanctioned (join OFAC XBT).

Output -> public/misi/misi-jaring-mule/:
  dompet.csv        (bersih, 3000 baris)
  dompet_audit.csv  (salinan + 4 injeksi terdokumentasi + kolom catatan_audit)
  ofac_pinned.csv   (daftar sanksi XBT+ETH, pin bertanggal)
  METODE.md
"""
import json
import os
import subprocess
from datetime import datetime, timezone, timedelta

import numpy as np
import pandas as pd

SEED = 42
SRC = os.path.join(os.path.dirname(__file__), "work", "bh", "BitcoinHeistData.csv")
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "misi", "misi-jaring-mule"))
OFAC_REPO = "/tmp/ofac"

rng = np.random.default_rng(SEED)

# ── 1. muat populasi penuh ──────────────────────────────────────────────
dt = {"address": "str", "year": "int16", "day": "int16", "length": "int16",
      "weight": "float32", "count": "int32", "looped": "int32",
      "neighbors": "int32", "income": "int64", "label": "str"}
full = pd.read_csv(SRC, dtype=dt)
print("populasi:", len(full))

p95_looped = float(full["looped"].quantile(0.95))
p95_neigh = float(full["neighbors"].quantile(0.95))
p25_income = float(full["income"].quantile(0.25))
p75_count = float(full["count"].quantile(0.75))
print("threshold populasi: p95_looped=%.0f p95_neigh=%.0f p25_income=%.0f p75_count=%.0f"
      % (p95_looped, p95_neigh, p25_income, p75_count))

# ── 2. seleksi 3 klaster (deterministik) ────────────────────────────────
def top_n_unique(df, col, n, exclude):
    # alamat bisa muncul di beberapa hari -> dedupe per alamat (ambil baris
    # dengan fitur tertinggi), agar 1 baris = 1 dompet unik
    cand = df[~df["address"].isin(exclude)].copy()
    cand = cand.sort_values([col, "address"], ascending=[False, True], kind="mergesort")
    cand = cand.drop_duplicates(subset="address", keep="first")
    return cand.head(n)

grpA = top_n_unique(full, "looped", 1000, set())
taken = set(grpA["address"])
grpB = top_n_unique(full, "neighbors", 1000, taken)
taken |= set(grpB["address"])
poolC = full[(full["income"] < p25_income) & (full["count"] > p75_count)
             & (~full["address"].isin(taken))].copy()
poolC = poolC.sort_values(["count", "address"], ascending=[False, True],
                          kind="mergesort").drop_duplicates(subset="address", keep="first")
pool_n = len(poolC)
print("pool smurfing (alamat unik):", pool_n)
grpC = poolC.sample(n=1000, random_state=SEED)
taken |= set(grpC["address"])

assert len(taken) == 3000, len(taken)
for g, name in [(grpA, "putaran_tinggi"), (grpB, "tetangga_ekstrem"), (grpC, "pecahan_kecil")]:
    g["klaster"] = name
sl = pd.concat([grpA, grpB, grpC], ignore_index=True)
sl = sl.rename(columns={"income": "income_satoshi"})
sl["nonwhite"] = (sl["label"] != "white").astype("int8")

# ── 3. join OFAC (XBT; alamat dataset adalah BTC) ───────────────────────
def ofac_list(asset):
    out = subprocess.run(["git", "-C", OFAC_REPO, "show",
                          "origin/lists:sanctioned_addresses_%s.txt" % asset],
                         capture_output=True, text=True, check=True).stdout
    return [l.strip() for l in out.splitlines() if l.strip()]

ofac_commit = subprocess.run(["git", "-C", OFAC_REPO, "rev-parse", "origin/lists"],
                             capture_output=True, text=True, check=True).stdout.strip()
xbt = ofac_list("XBT"); eth = ofac_list("ETH")
sl["is_sanctioned"] = sl["address"].isin(set(xbt)).astype("int8")
print("OFAC: XBT=%d ETH=%d | cocok di slice: %d" % (len(xbt), len(eth), int(sl["is_sanctioned"].sum())))
print("nonwhite di slice:", int(sl["nonwhite"].sum()))

cols = ["address", "year", "day", "length", "weight", "count", "looped",
        "neighbors", "income_satoshi", "label", "klaster", "is_sanctioned"]
clean = sl[cols].copy()

# ── 4. dompet_audit.csv: 4 injeksi terdokumentasi ───────────────────────
audit = clean.copy()
audit["catatan_audit"] = ""
inj = {}  # dokumentasi injeksi

# I1: 2 label ransomware disanitasi -> "white" + klaim "terverifikasi bersih"
nw = audit[audit["label"] != "white"].sort_values("address")
i1_idx = list(nw.index[:2])
i1_orig = dict(zip(i1_idx, audit.loc[i1_idx, "label"]))
audit.loc[i1_idx, "label"] = "white"
audit.loc[i1_idx, "catatan_audit"] = ("TERVERIFIKASI BERSIH: tidak ada indikasi aktivitas "
                                      "ilegal (stempel tim internal).")
inj["I1_label_sanitasi"] = [{"address": audit.loc[i, "address"], "label_asli": lab}
                            for i, lab in i1_orig.items()]

# I2: 2 baris count tinggi -> income_satoshi = 0 (tidak konsisten)
cand2 = audit.drop(index=i1_idx).sort_values("count", ascending=False)
i2_idx = list(cand2.index[:2])
i2_orig = dict(zip(i2_idx, audit.loc[i2_idx, "income_satoshi"]))
audit.loc[i2_idx, "income_satoshi"] = 0
inj["I2_income_dirusak"] = [{"address": audit.loc[i, "address"], "income_asli": int(v),
                             "count": int(audit.loc[i, "count"])} for i, v in i2_orig.items()]

# I3: 2 alamat diduplikasi dengan statistik berbeda (baris tambahan)
cand3 = audit.drop(index=i1_idx + i2_idx).sort_values("address")
i3_idx = list(cand3.index[:2])
dup_rows = []
for i in i3_idx:
    r = audit.loc[i].copy()
    r["looped"] = int(r["looped"] // 3)          # statistik berbeda, alamat sama
    r["neighbors"] = int(r["neighbors"]) + 50
    r["income_satoshi"] = int(r["income_satoshi"]) + 10_000_000
    r["catatan_audit"] = ""
    dup_rows.append(r)
audit = pd.concat([audit, pd.DataFrame(dup_rows)], ignore_index=True)
inj["I3_duplikat"] = [{"address": audit.loc[i, "address"]} for i in i3_idx]

# I4: 2 alamat neighbors ekstrem + klaim menyesatkan "mixing_rounds=0 -> aman"
#     (length memang 0 di data asli -> jebakan ada di PENALARAN, bukan angkanya)
cand4 = audit.sort_values(["neighbors", "address"], ascending=[False, True],
                          kind="mergesort")
cand4 = cand4[cand4["length"] == 0].drop(
    index=i1_idx + i2_idx + i3_idx, errors="ignore").head(2)
i4_idx = list(cand4.index)
assert len(i4_idx) == 2, "kandidat I4 kurang: %d" % len(i4_idx)
audit.loc[i4_idx, "catatan_audit"] = ("mixing_rounds (length) = 0: tidak ada upaya "
                                      "penyembunyian. KESIMPULAN: aman.")
inj["I4_klaim_mixing"] = [{"address": audit.loc[i, "address"],
                           "neighbors": int(audit.loc[i, "neighbors"]),
                           "length": int(audit.loc[i, "length"])} for i in i4_idx]
print("injeksi OK: I1=%d I2=%d I3=%d I4=%d | baris audit=%d"
      % (len(i1_idx), len(i2_idx), len(i3_idx), len(i4_idx), len(audit)))

# ── 5. tulis output ─────────────────────────────────────────────────────
os.makedirs(OUT, exist_ok=True)
clean.to_csv(os.path.join(OUT, "dompet.csv"), index=False)
audit.to_csv(os.path.join(OUT, "dompet_audit.csv"), index=False)

pin_dt = datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M WITA")
ofac_df = pd.DataFrame(
    [{"address": a, "aset": "XBT", "tanggal_pin": pin_dt} for a in xbt] +
    [{"address": a, "aset": "ETH", "tanggal_pin": pin_dt} for a in eth])
ofac_df.to_csv(os.path.join(OUT, "ofac_pinned.csv"), index=False)

with open(os.path.join(OUT, "METODE.md"), "w") as f:
    f.write("""# Metode Snapshot — Misi B Fraud/AML: Jaring Mule

Sumber primer: BitcoinHeist Ransomware Address Dataset (UCI ML Repository),
diunduh 2026-10-15 dari https://archive.ics.uci.edu/static/public/526/bitcoinheistransomwareaddressdataset.zip
(2.916.697 alamat). Lisensi: **CC BY 4.0** (badge terverifikasi di halaman
dataset pada 2026-10-15; atribusi: "UCI ML Repository").

Orakel: daftar alamat digital currency yang disanksi OFAC (tool 0xB10C, MIT;
data OFAC = karya pemerintah federal AS, public domain 17 U.S.C. §105),
pin BARU {pin_dt}, cabang `lists` commit {commit}:
{nxbt} alamat XBT + {neth} alamat ETH. (Pin pilot misi-jejak-dana-blockchain:
2026-10-15 tanpa commit tercatat; pin ini didokumentasikan dengan commit hash.)

## Seleksi (BERBEDA dari pilot)
Pilot memakai semua baris ransomware + baris cocok-OFAC + white acak (fokus
ATRIBUSI). Misi ini memakai slice TIPOLOGI LAYERING (fokus POLA TRANSAKSI),
seed 42, nilai fitur asli TIDAK diubah:
- (a) 1000 alamat `looped` tertinggi (pola split -> jalur berbeda -> merge)
- (b) 1000 alamat `neighbors` tertinggi di luar (a) (fan-out / fan-in ekstrem)
- (c) 1000 alamat acak dari pool income < P25 & count > P75 populasi
      (smurfing proxy), di luar (a)+(b); pool = {pool} alamat unik
Threshold populasi: looped P95=1884, neighbors P95=3, income P25=74.285.590
satoshi, count P75=56. Total 3000 alamat unik. Kolom `klaster` menandai asal
grup; `is_sanctioned` = join persis vs daftar OFAC XBT ({cocok} cocok di slice;
alamat dataset adalah BTC sehingga hanya XBT yang bisa cocok — daftar ETH
dibundel sebagai referensi lintas-rantai).

## Injeksi dompet_audit.csv (terdokumentasi; JANGAN dibaca sebelum audit)
- I1 label disanitasi (2): {i1}
- I2 income -> 0 padahal count tinggi (2): {i2}
- I3 alamat duplikat, statistik berbeda (2 baris tambahan): {i3}
- I4 klaim "mixing_rounds (length) = 0 -> aman" pada neighbors ekstrem (2):
  {i4}
  (length memang 0 di data asli — jebakan ada di penalaran satu-fitur,
  bukan di angkanya.)

## Kejujuran
- BitcoinHeist TIDAK memuat edge list / graph transaksi — misi ini analisis
  TIPOLOGI berbasis fitur agregat per alamat, BUKAN literal hop-tracing.
- `white` = "tidak teridentifikasi sebagai ransomware oleh peneliti", BUKAN
  "terbukti bersih". Sebaliknya, pola ekstrem (looped/neighbors tertinggi)
  di populasi hampir seluruhnya berlabel white — bentuk transaksi != kejahatan.
- Fitur looped/neighbors/count/weight/income adalah agregat per alamat per
  hari; tidak ada identitas pemilik di dataset.
""".format(pin_dt=pin_dt, commit=ofac_commit[:12], nxbt=len(xbt), neth=len(eth),
           cocok=int(sl["is_sanctioned"].sum()), pool=pool_n,
           i1="; ".join("%s (asli: %s)" % (d["address"][:12] + "...", d["label_asli"])
                        for d in inj["I1_label_sanitasi"]),
           i2="; ".join("%s (income asli %d, count %d)" % (d["address"][:12] + "...",
                        d["income_asli"], d["count"]) for d in inj["I2_income_dirusak"]),
           i3="; ".join(d["address"][:12] + "..." for d in inj["I3_duplikat"]),
           i4="; ".join("%s (neighbors=%d, length=%d)" % (d["address"][:12] + "...",
                        d["neighbors"], d["length"]) for d in inj["I4_klaim_mixing"])))

# ── 6. NILAI CHECKS (dari eksekusi nyata vs dompet.csv) ──────────────────
d = clean.copy()
checks = {}
checks["n_baris"] = int(len(d))
checks["n_nonwhite"] = int((d["label"] != "white").sum())
checks["med_looped"] = float(d["looped"].median())
checks["p95_looped"] = float(d["looped"].quantile(0.95))
checks["p95_neigh"] = float(d["neighbors"].quantile(0.95))
checks["med_income"] = float(d["income_satoshi"].median())
checks["corr_neigh_income_log"] = round(float(np.log1p(d["neighbors"]).corr(np.log1p(d["income_satoshi"]))), 3)
cand = d[(d["neighbors"] > checks["p95_neigh"]) & (d["income_satoshi"] < checks["med_income"])]
checks["n_kandidat_mule"] = int(len(cand))
checks["pct_nonwhite_kandidat"] = round(float((cand["label"] != "white").mean() * 100), 1) if len(cand) else 0.0
checks["p90_count"] = float(d["count"].quantile(0.90))
small = d[d["income_satoshi"] < 1_000_000]
big = d[d["income_satoshi"] >= checks["med_income"]]
struct_small = small[small["count"] > checks["p90_count"]]
struct_big = big[big["count"] > checks["p90_count"]]
checks["n_small"] = int(len(small)); checks["n_big"] = int(len(big))
checks["prop_struct_small"] = round(float(len(struct_small) / len(small) * 100), 1) if len(small) else 0.0
checks["prop_struct_big"] = round(float(len(struct_big) / len(big) * 100), 1) if len(big) else 0.0
checks["med_looped_A"] = float(d[d["klaster"] == "putaran_tinggi"]["looped"].median())
print("CHECKS_JSON=" + json.dumps(checks))
print("injeksi ringkas:", json.dumps({k: [x["address"][:16] for x in v]
      for k, v in inj.items()}, default=str)[:400])
