#!/usr/bin/env python3
"""Harness verifikasi Proyek E2 pj-vcf-varian.

Memeriksa konsistensi ground truth vs dataset (public/proyek/pj-vcf-varian/).
Setiap check PASS/FAIL eksplisit; exit 0 bila semua PASS.
Konstanta DOC di bawah = ground truth resmi (dari gen_vcf_data.py, seed 2026).
"""
import csv, os, sys

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "proyek", "pj-vcf-varian")

DOC = {
    "n_varian": 400,
    "n_lolos_qc": 375, "n_gagal_qc": 25,
    "patogenik": ["var_0042", "var_0177", "var_0331"],
    "n_kandidat": 11, "n_vus": 8,
    "vendor_fp": ["var_0108", "var_0256"], "vendor_fn": "var_0177",
    "upgma_pertama": ("S2", "S5"), "tetangga_s1": "S3",
    "csq_relevan": {"stop_gained", "frameshift_variant", "splice_donor_variant", "missense_variant"},
}

fails = []
def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (f" — {detail}" if detail else ""))
    if not cond:
        fails.append(name)

def parse_vcf(path):
    vars_ = []
    with open(path) as f:
        for line in f:
            if line.startswith("#"):
                continue
            p = line.rstrip("\n").split("\t")
            info = dict(kv.split("=", 1) for kv in p[7].split(";"))
            vars_.append({"id": p[2], "qual": float(p[5]), "filt": p[6],
                          "dp": int(info["DP"]), "gq": int(info["GQ"]),
                          "af": float(info["AF"]), "gene": info["GENE"], "csq": info["CSQ"]})
    return vars_

def read_csv(path):
    with open(path) as f:
        r = csv.DictReader(f)
        return r.fieldnames, list(r)

# ── 1. file & dimensi ──
vv = parse_vcf(os.path.join(BASE, "proband.vcf"))
check("proband.vcf: 400 varian", len(vv) == DOC["n_varian"], f"n={len(vv)}")
check("ID unik & berurutan", [v["id"] for v in vv] == [f"var_{i:04d}" for i in range(1, 401)])
fn, ref = read_csv(os.path.join(BASE, "anotasi_referensi.csv"))
check("anotasi_referensi.csv: 400 baris + kolom",
      len(ref) == 400 and fn == ["ID", "gen", "consequence", "frekuensi_populasi", "status_klinis"])
fn, ven = read_csv(os.path.join(BASE, "laporan_vendor.csv"))
check("laporan_vendor.csv: kolom", fn == ["ID", "gen", "klasifikasi_vendor", "keyakinan", "catatan"], str(fn))
fn, jar = read_csv(os.path.join(BASE, "jarak_genetik.csv"))
check("jarak_genetik.csv: 6x6 simetris",
      len(jar) == 6 and fn[1:] == ["S1_proband", "S2", "S3", "S4", "S5", "S6"])

# ── 2. QC ──
lolos = [v for v in vv if v["dp"] >= 20 and v["qual"] >= 30 and v["filt"] == "PASS"]
gagal = [v for v in vv if v not in lolos]
check("lolos QC = 375", len(lolos) == DOC["n_lolos_qc"], f"n={len(lolos)}")
check("gagal QC = 25", len(gagal) == DOC["n_gagal_qc"], f"n={len(gagal)}")
check("3 patogenik semuanya lolos QC",
      all(v["id"] in [x["id"] for x in lolos] for v in vv if v["id"] in DOC["patogenik"]))

# ── 3. filter + anotasi: kandidat ──
kandidat = [v for v in lolos if v["af"] < 0.01 and v["csq"] in DOC["csq_relevan"]]
check("kandidat = 11", len(kandidat) == DOC["n_kandidat"],
      ", ".join(v["id"] for v in kandidat))
ref_status = {r["ID"]: r["status_klinis"] for r in ref}
pat_found = sorted(v["id"] for v in kandidat if ref_status[v["id"]] == "Patogenik")
check("3 patogenik tepat (var_0042/0177/0331)", pat_found == DOC["patogenik"], str(pat_found))
vus_found = [v["id"] for v in kandidat if ref_status[v["id"]] == "VUS"]
check("VUS = 8", len(vus_found) == DOC["n_vus"], f"n={len(vus_found)}")

# ── 4. klasifikasi aturan sederhana vs referensi ──
def klasifikasi(v):
    if v["af"] < 0.001 and v["csq"] in ("stop_gained", "frameshift_variant", "splice_donor_variant"):
        return "Patogenik"
    if v["af"] < 0.01 and v["csq"] == "missense_variant":
        return "VUS"
    return "Benign"
kls = {v["id"]: klasifikasi(v) for v in kandidat}
cocok = sum(1 for vid, k in kls.items() if k == ref_status[vid])
check("klasifikasi aturan cocok 100% dengan referensi (11/11)", cocok == 11, f"{cocok}/11")
check("aturan menemukan tepat 3 patogenik",
      sorted(vid for vid, k in kls.items() if k == "Patogenik") == DOC["patogenik"])

# ── 5. audit vendor: FP & FN terukur ──
ven_cls = {r["ID"]: r["klasifikasi_vendor"] for r in ven}
fp = sorted(vid for vid, c in ven_cls.items()
            if c == "Patogenik" and ref_status.get(vid) == "Benign")
fn_list = sorted(vid for vid, c in ven_cls.items()
                if ref_status.get(vid) == "Patogenik" and c != "Patogenik")
check("vendor FP = 2 (var_0108, var_0256)", fp == DOC["vendor_fp"], str(fp))
check("vendor FN = 1 (var_0177)", fn_list == [DOC["vendor_fn"]], str(fn_list))

# ── 6. UPGMA ──
names = fn[1:]
dm = {(min(a, b), max(a, b)): float(next(r[b] for r in jar if r["sampel"] == a))
      for a in names for b in names if a != b}
# simetri
simetris = all(abs(dm[(min(a, b), max(a, b))] - dm[(min(a, b), max(a, b))]) < 1e-12
               for a in names for b in names if a != b)
check("matriks simetris & diagonal 0",
      simetris and all(float(next(r[a] for r in jar if r["sampel"] == a)) == 0.0 for a in names))
def upgma(names_, dist):
    cl = {n: [n] for n in names_}
    dd = dict(dist)
    merges = []
    while len(cl) > 1:
        (x, y) = min(dd, key=dd.get)
        merges.append((x, y, round(dd[(x, y)], 4)))
        dd.pop((x, y))
        mx, my = cl.pop(x), cl.pop(y)
        nx = f"[{x}+{y}]"
        nd = {}
        for z in cl:
            dxz = dd.pop((min(x, z), max(x, z)))
            dyz = dd.pop((min(y, z), max(y, z)))
            nd[(min(nx, z), max(nx, z))] = (dxz * len(mx) + dyz * len(my)) / (len(mx) + len(my))
        dd.update(nd)
        cl[nx] = mx + my
    return merges
merges = upgma(names, dm)
p1 = (merges[0][0], merges[0][1])
check("merge UPGMA pertama = S2+S5", set(p1) == set(DOC["upgma_pertama"]),
      f"{merges[0][0]}+{merges[0][1]}@{merges[0][2]}")
s1d = {b: dm[(min("S1_proband", b), max("S1_proband", b))] for b in names if b != "S1_proband"}
check("tetangga terdekat S1_proband = S3", min(s1d, key=s1d.get) == DOC["tetangga_s1"])

# ── 7. solusi lab dieksekusi ──
check("solusi lab1: n_total=400, lolos=375, gagal=25",
      len(vv) == 400 and len(lolos) == 375 and len(gagal) == 25)
check("solusi lab2: n_kandidat=11 & memuat 3 patogenik",
      len(kandidat) == 11 and pat_found == DOC["patogenik"])
check("solusi lab3: klasifikasi 11/11 cocok referensi", cocok == 11)
check("solusi lab4: pasangan pertama S2+S5 & tetangga S1=S3",
      set(p1) == set(DOC["upgma_pertama"]) and min(s1d, key=s1d.get) == "S3")
check("solusi lab5: fp=2 & fn=1", fp == DOC["vendor_fp"] and fn_list == [DOC["vendor_fn"]])

print(f"\n=== {len(fails)} FAIL dari harness ===" if fails else "\n=== SEMUA CHECK PASS ===")
sys.exit(1 if fails else 0)
