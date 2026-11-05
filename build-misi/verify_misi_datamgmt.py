#!/usr/bin/env python3
"""Harness verifikasi Misi Data Management (M2 grup DATA-ENGINEERING).

Menjalankan LOGIKA SOLUSI lab Python (pandas) dan lab SQL (sqlite3)
terhadap CSV sintetis, lalu mencetak nilai expected untuk ditempel
ke file .ts. open_url di-shim ke file lokal (di browser memakai
pyodide.http.open_url — logika di bawahnya identik).
"""
import os
import sqlite3
from difflib import SequenceMatcher

import pandas as pd

A_DIR = os.path.join("public", "misi", "misi-katalog-data-hilang")
B_DIR = os.path.join("public", "misi", "misi-lineage-terputus")


def open_url(url):  # shim lokal pengganti pyodide.http.open_url
    name = url.rsplit("/", 1)[-1]
    for d in (A_DIR, B_DIR):
        p = os.path.join(d, name)
        if os.path.exists(p):
            return open(p, "rb")
    raise FileNotFoundError(url)


# ═══════════════════════════════════════════════════════════════════
# MISI A — Lab Python: bangun katalog + klasifikasi sensitivitas
# ═══════════════════════════════════════════════════════════════════
print("=== MISI A / lab-katalog ===")
df = pd.read_csv(open_url("/misi/misi-katalog-data-hilang/skema_kolom.csv"))
lin = pd.read_csv(open_url("/misi/misi-katalog-data-hilang/lineage.csv"))

n_kolom = len(df)


def klasifikasi(nama):
    n = nama.lower()
    if any(k in n for k in ["nik", "nama", "full_name", "alamat", "lahir", "no_hp", "no_rekening", "acct_no"]):
        return "rahasia"
    if any(k in n for k in ["saldo", "nominal", "jumlah", "skor", "pd_"]):
        return "terbatas"
    if any(k in n for k in ["id", "kode", "code", "status", "segmen", "segment", "channel", "jenis", "currency", "tgl", "date"]):
        return "internal"
    return "publik"


df["klasifikasi"] = df["kolom"].map(klasifikasi)
n_rahasia = int((df["klasifikasi"] == "rahasia").sum())
n_terbatas = int((df["klasifikasi"] == "terbatas").sum())
n_internal = int((df["klasifikasi"] == "internal").sum())
n_publik = int((df["klasifikasi"] == "publik").sum())

tanpa_pemilik = df[df["pemilik"].fillna("").str.strip() == ""]
n_tanpa_pemilik = len(tanpa_pemilik)
kritis_tanpa_pemilik = tanpa_pemilik[tanpa_pemilik["laporan_kritis"] == "ya"]
n_kritis_tanpa_pemilik = len(kritis_tanpa_pemilik)

deprecated_bermasalah = df[(df["status"] == "deprecated") & (df["laporan_kritis"] == "ya")]
n_deprecated_bermasalah = len(deprecated_bermasalah)

n_pasang_duplikat = int((lin["relasi"] == "duplikat").sum())

print("n_kolom =", n_kolom)
print("klasifikasi:", df["klasifikasi"].value_counts().to_dict())
print("n_rahasia =", n_rahasia, "| n_terbatas =", n_terbatas,
      "| n_internal =", n_internal, "| n_publik =", n_publik)
print("n_tanpa_pemilik =", n_tanpa_pemilik)
print("kritis tanpa pemilik:", (kritis_tanpa_pemilik["tabel"] + "." + kritis_tanpa_pemilik["kolom"]).tolist())
print("n_kritis_tanpa_pemilik =", n_kritis_tanpa_pemilik)
print("deprecated bermasalah:", (deprecated_bermasalah["tabel"] + "." + deprecated_bermasalah["kolom"]).tolist())
print("n_deprecated_bermasalah =", n_deprecated_bermasalah)
print("n_pasang_duplikat =", n_pasang_duplikat)

# ═══════════════════════════════════════════════════════════════════
# MISI A — Lab SQL: lineage duplikat
# ═══════════════════════════════════════════════════════════════════
print("\n=== MISI A / lab-sql ===")
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE lineage (kolom_asal TEXT, kolom_tujuan TEXT, transformasi TEXT, relasi TEXT);")
with open(os.path.join(A_DIR, "lineage.csv"), encoding="utf-8") as f:
    next(f)
    for line in f:
        parts = line.rstrip("\n").split(",", 3)
        con.execute("INSERT INTO lineage VALUES (?,?,?,?)", parts)
rows = con.execute(
    "SELECT kolom_asal, kolom_tujuan, transformasi FROM lineage "
    "WHERE relasi = 'duplikat' ORDER BY kolom_asal;"
).fetchall()
for r in rows:
    print(r)

# ═══════════════════════════════════════════════════════════════════
# MISI B — Lab Python 1: diff skema v1 vs v2
# ═══════════════════════════════════════════════════════════════════
print("\n=== MISI B / lab-diff ===")
v1 = pd.read_csv(open_url("/misi/misi-lineage-terputus/skema_v1.csv"))
v2 = pd.read_csv(open_url("/misi/misi-lineage-terputus/skema_v2.csv"))

kolom_v1 = set(v1["kolom"])
kolom_v2 = set(v2["kolom"])
hilang = sorted(kolom_v1 - kolom_v2)
baru = sorted(kolom_v2 - kolom_v1)
n_hilang, n_baru = len(hilang), len(baru)

sama = kolom_v1 & kolom_v2
t1 = v1.set_index("kolom")["tipe"].to_dict()
t2 = v2.set_index("kolom")["tipe"].to_dict()
d1 = v1.set_index("kolom")["deskripsi"].to_dict()
d2 = v2.set_index("kolom")["deskripsi"].to_dict()
tipe_berubah = sorted(k for k in sama if t1[k] != t2[k])
makna_berubah = sorted(k for k in sama if t1[k] == t2[k] and d1[k] != d2[k])
n_tipe_berubah, n_makna_berubah = len(tipe_berubah), len(makna_berubah)

print("ratios kandidat rename:")
for a in hilang:
    for b in baru:
        print(f"  {a} vs {b}: {SequenceMatcher(None, a, b).ratio():.3f}")
kandidat_rename = sorted((a, b) for a in hilang for b in baru
                         if SequenceMatcher(None, a, b).ratio() > 0.7)
n_kandidat_rename = len(kandidat_rename)

print("hilang =", hilang, "| n_hilang =", n_hilang)
print("baru =", baru, "| n_baru =", n_baru)
print("tipe_berubah =", tipe_berubah, "| n_tipe_berubah =", n_tipe_berubah)
print("makna_berubah =", makna_berubah, "| n_makna_berubah =", n_makna_berubah)
print("kandidat_rename =", kandidat_rename, "| n_kandidat_rename =", n_kandidat_rename)

# ═══════════════════════════════════════════════════════════════════
# MISI B — Lab Python 2: peta dampak pipeline
# ═══════════════════════════════════════════════════════════════════
print("\n=== MISI B / lab-dampak ===")
pipe = pd.read_csv(open_url("/misi/misi-lineage-terputus/pipeline.csv"))
kolom_bermasalah = ["transaksi.customer_id", "transaksi.amount",
                    "transaksi.cust_segment", "transaksi.trx_date"]
aktif = pipe[pipe["status"] == "aktif"]
terdampak = aktif[aktif["kolom_dipakai"].isin(kolom_bermasalah)]
n_terdampak = len(terdampak)
select_bintang = aktif[aktif["kolom_dipakai"] == "*"]
n_select_bintang = len(select_bintang)
print("terdampak:", terdampak["pipeline"].tolist(), "| n_terdampak =", n_terdampak)
print("select_bintang:", select_bintang["pipeline"].tolist(), "| n_select_bintang =", n_select_bintang)

# ═══════════════════════════════════════════════════════════════════
# MISI B — Lab SQL: baris yatim pasca-rename
# ═══════════════════════════════════════════════════════════════════
print("\n=== MISI B / lab-sql ===")
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE pelanggan (customer_id TEXT, nama TEXT);")
con.execute("CREATE TABLE transaksi (cust_id TEXT, amount INTEGER);")
con.executemany("INSERT INTO pelanggan VALUES (?,?)",
                [("C-001", "Andi"), ("C-002", "Budi"), ("C-003", "Citra"),
                 ("C-004", "Dewi"), ("C-005", "Eko")])
con.executemany("INSERT INTO transaksi VALUES (?,?)",
                [("C-001", 1500000), ("C-002", 2500000), ("C-003", 1000000),
                 ("004", 3000000), ("005", 2000000), ("006", 500000)])
rows = con.execute(
    "SELECT t.cust_id, t.amount FROM transaksi t "
    "LEFT JOIN pelanggan p ON t.cust_id = p.customer_id "
    "WHERE p.customer_id IS NULL ORDER BY t.cust_id;"
).fetchall()
for r in rows:
    print(r)
print("total hilang =", sum(r[1] for r in rows))
print("\nHARNESS SELESAI — tempel nilai di atas ke file .ts")
