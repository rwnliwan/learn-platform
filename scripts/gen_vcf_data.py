#!/usr/bin/env python3
"""Generator data sintetis deterministik — Proyek E2: Pipeline VCF ke Laporan Varian.

Seed tetap (2026). Output ke public/proyek/pj-vcf-varian/:
  - proband.vcf            : 400 varian (CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO)
  - anotasi_referensi.csv  : ID, gen, consequence, frekuensi_populasi, status_klinis (kunci jawaban)
  - laporan_vendor.csv     : klasifikasi vendor impostor (2 FP + 1 FN terukur)
  - jarak_genetik.csv      : matriks jarak 6 sampel untuk filogenetik UPGMA

Ground truth: 3 varian patogenik tertanam (var_0042, var_0177, var_0331);
25 varian gagal QC; vendor: FP=2, FN=1.
"""
import csv
import os
import numpy as np

SEED = 2026
N_VAR = 400
N_QC_FAIL = 25
PATHOGENIC = {
    "var_0042": ("G6PD", "stop_gained", 0.0001),
    "var_0177": ("HBB", "frameshift_variant", 0.0004),
    "var_0331": ("CFTR", "splice_donor_variant", 0.0002),
}
VENDOR_FP = ["var_0108", "var_0256"]   # benign yang diklaim vendor "Patogenik"
VENDOR_FN = "var_0177"                 # patogenik yang dilewatkan vendor ("VUS")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "proyek", "pj-vcf-varian")
os.makedirs(OUT, exist_ok=True)

rng = np.random.default_rng(SEED)
GENES = ["G6PD", "HBB", "CFTR", "GJB2", "MEFV", "PAH", "ATP7B", "LDLR", "BRCA1", "TP53"]
CSQ_BENIGN = ["synonymous_variant", "intron_variant", "upstream_gene_variant"]
IDS = [f"var_{i:04d}" for i in range(1, N_VAR + 1)]

variants = {}  # id -> dict
for vid in IDS:
    chrom = str(rng.integers(1, 4))
    pos = int(rng.integers(1_000_000, 50_000_000))
    ref = rng.choice(["A", "C", "G", "T"])
    alt = rng.choice([b for b in ["A", "C", "G", "T"] if b != ref])
    variants[vid] = {"chrom": chrom, "pos": pos, "ref": ref, "alt": alt,
                     "qual": None, "filt": None, "dp": None, "gq": None,
                     "af": None, "gene": None, "csq": None, "status": None}

# 1) 3 patogenik tertanam (lolos QC)
for vid, (gene, csq, af) in PATHOGENIC.items():
    v = variants[vid]
    v.update(qual=round(float(rng.uniform(60, 99)), 1), filt="PASS",
             dp=int(rng.integers(30, 80)), gq=int(rng.integers(40, 99)),
             af=af, gene=gene, csq=csq, status="Patogenik")

# 2) 25 gagal QC (disjoint dari patogenik)
fail_ids = rng.choice([i for i in IDS if i not in PATHOGENIC], N_QC_FAIL, replace=False)
for vid in fail_ids:
    v = variants[vid]
    mode = rng.integers(0, 3)
    if mode == 0:
        v.update(qual=round(float(rng.uniform(10, 29)), 1), filt="PASS",
                 dp=int(rng.integers(25, 60)), gq=int(rng.integers(30, 90)))
    elif mode == 1:
        v.update(qual=round(float(rng.uniform(40, 80)), 1), filt="PASS",
                 dp=int(rng.integers(5, 19)), gq=int(rng.integers(20, 60)))
    else:
        v.update(qual=round(float(rng.uniform(10, 25)), 1), filt="q10",
                 dp=int(rng.integers(10, 40)), gq=int(rng.integers(15, 50)))
    v.update(af=round(float(rng.uniform(0.06, 0.4)), 4), gene=rng.choice(GENES),
             csq=rng.choice(CSQ_BENIGN), status="Benign")

# 3) 8 VUS (missense, AF 0.005-0.009, lolos QC)
vus_ids = rng.choice([i for i in IDS if variants[i]["status"] is None], 8, replace=False)
for vid in vus_ids:
    v = variants[vid]
    v.update(qual=round(float(rng.uniform(45, 95)), 1), filt="PASS",
             dp=int(rng.integers(25, 70)), gq=int(rng.integers(35, 95)),
             af=round(float(rng.uniform(0.005, 0.009)), 4), gene=rng.choice(GENES),
             csq="missense_variant", status="VUS")

# 4) sisanya benign umum
for vid in IDS:
    v = variants[vid]
    if v["status"] is None:
        v.update(qual=round(float(rng.uniform(35, 99)), 1), filt="PASS",
                 dp=int(rng.integers(20, 90)), gq=int(rng.integers(30, 99)),
                 af=round(float(rng.uniform(0.05, 0.45)), 4), gene=rng.choice(GENES),
                 csq=rng.choice(CSQ_BENIGN), status="Benign")

with open(os.path.join(OUT, "proband.vcf"), "w") as f:
    f.write("##fileformat=VCFv4.2\n")
    f.write("##sumber=SINTETIS proyek pj-vcf-varian (seed 2026) — BUKAN data pasien nyata\n")
    f.write("#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n")
    for vid in IDS:
        v = variants[vid]
        info = f"DP={v['dp']};GQ={v['gq']};AF={v['af']};GENE={v['gene']};CSQ={v['csq']}"
        f.write(f"{v['chrom']}\t{v['pos']}\t{vid}\t{v['ref']}\t{v['alt']}\t{v['qual']}\t{v['filt']}\t{info}\n")

with open(os.path.join(OUT, "anotasi_referensi.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["ID", "gen", "consequence", "frekuensi_populasi", "status_klinis"])
    for vid in IDS:
        v = variants[vid]
        wtr.writerow([vid, v["gene"], v["csq"], v["af"], v["status"]])

# --- Laporan vendor impostor ---
with open(os.path.join(OUT, "laporan_vendor.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["ID", "gen", "klasifikasi_vendor", "keyakinan", "catatan"])
    for vid in IDS:
        v = variants[vid]
        if v["status"] not in ("Patogenik", "VUS"):
            continue
        cls, note = v["status"], "sesuai referensi"
        if vid in VENDOR_FP:
            cls, note = "Patogenik", "model AI prediktif — AF 6% 'kompensasi penetrans rendah'"
        if vid == VENDOR_FN:
            cls, note = "VUS", "di bawah ambang keyakinan model"
        if vid in VENDOR_FP or vid == VENDOR_FN:
            pass
        wtr.writerow([vid, v["gene"], cls, "99%" if cls == "Patogenik" else "95%", note])
    # vendor menambahkan 2 FP dari varian benign umum:
    for vid in VENDOR_FP:
        v = variants[vid]
        assert v["status"] == "Benign"
        wtr.writerow([vid, v["gene"], "Patogenik", "99%", "model AI prediktif — mengabaikan frekuensi populasi"])

# --- Matriks jarak genetik 6 sampel (UPGMA) ---
SAMPEL = ["S1_proband", "S2", "S3", "S4", "S5", "S6"]
D = {
    ("S1_proband", "S2"): 0.041, ("S1_proband", "S3"): 0.015, ("S1_proband", "S4"): 0.052,
    ("S1_proband", "S5"): 0.038, ("S1_proband", "S6"): 0.047,
    ("S2", "S3"): 0.033, ("S2", "S4"): 0.028, ("S2", "S5"): 0.008, ("S2", "S6"): 0.035,
    ("S3", "S4"): 0.049, ("S3", "S5"): 0.030, ("S3", "S6"): 0.044,
    ("S4", "S5"): 0.026, ("S4", "S6"): 0.019, ("S5", "S6"): 0.031,
}
with open(os.path.join(OUT, "jarak_genetik.csv"), "w", newline="") as f:
    wtr = csv.writer(f)
    wtr.writerow(["sampel"] + SAMPEL)
    for a in SAMPEL:
        row = [a] + [0.0 if a == b else D.get((a, b), D.get((b, a))) for b in SAMPEL]
        wtr.writerow(row)

# UPGMA yang benar & sederhana:
def upgma(names, dist):
    cl = {n: [n] for n in names}
    dd = dict(dist)
    merges = []
    while len(cl) > 1:
        (x, y) = min(dd, key=dd.get)
        dxy = dd[(x, y)]
        merges.append((x, y, round(dxy, 4)))
        dd.pop((x, y))  # hapus jarak pasangan yang baru di-merge
        mx, my = cl.pop(x), cl.pop(y)
        nx = f"[{x}+{y}]"
        nd = {}
        for z, mz in cl.items():
            dxz = dd.pop((min(x, z), max(x, z)))
            dyz = dd.pop((min(y, z), max(y, z)))
            nd[(min(nx, z), max(nx, z))] = (dxz * len(mx) + dyz * len(my)) / (len(mx) + len(my))
        dd.update(nd)
        cl[nx] = mx + my
    return merges

dist = {(min(a, b), max(a, b)): D.get((a, b), D.get((b, a))) for a in SAMPEL for b in SAMPEL if a != b}
merges = upgma(SAMPEL, dist)

print("=== GROUND TRUTH VCF (seed 2026) ===")
print(f"total varian: {N_VAR}")
n_qc = sum(1 for v in variants.values() if v["dp"] >= 20 and v["qual"] >= 30 and v["filt"] == "PASS")
print(f"lolos QC (DP>=20, QUAL>=30, FILTER=PASS): {n_qc}")
kandidat = [vid for vid, v in variants.items()
            if v["dp"] >= 20 and v["qual"] >= 30 and v["filt"] == "PASS"
            and v["af"] < 0.01 and v["csq"] in ("stop_gained", "frameshift_variant", "splice_donor_variant", "missense_variant")]
print(f"kandidat (AF<0.01 & CSQ relevan): {len(kandidat)}")
pat = [vid for vid in kandidat if variants[vid]["status"] == "Patogenik"]
print(f"patogenik teridentifikasi: {sorted(pat)}")
print(f"vendor FP: {VENDOR_FP} | vendor FN: {VENDOR_FN}")
print("urutan merge UPGMA:", "; ".join(f"{x}+{y}@{d}" for x, y, d in merges))
s1d = {b: D.get(("S1_proband", b), D.get((b, "S1_proband"))) for b in SAMPEL if b != "S1_proband"}
print(f"tetangga terdekat S1_proband: {min(s1d, key=s1d.get)} ({min(s1d.values())})")
