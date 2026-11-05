"""Generator dataset SINTETIS misi-gabung-pipeline-kotor (capstone Python x Data Engineer).

100% SINTETIS: perusahaan, produk, kota, dan angka dibangkitkan acak.
Seed tetap 42 -> output deterministik byte-per-byte.
Jalankan dari folder ini: python3 gen_transaksi.py
Lihat METODE.md untuk skema dan aturan kekotoran.
"""
import csv
import os
import random

R = random.Random(42)
OUT = os.path.expanduser("~/workspace/learn-platform/public/misi/misi-gabung-pipeline-kotor")
os.makedirs(OUT, exist_ok=True)

PRODUK = [  # (nama, harga_dasar IDR)
    ("Kopi Tubruk", 15000),
    ("Es Céndol", 12000),
    ("Teh Manis Panas", 8000),
    ("Nasi Goreng Spesial", 25000),
    ("Mie Ayam Bakso", 22000),
    ("Soto Ayam Lamongan", 20000),
    ("Gado-Gado Betawi", 18000),
    ("Es Teh Manis", 7000),
]
KOTA = ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar", "Denpasar"]

def pick_qty():
    r = R.random()
    if r < 0.40: return 1
    if r < 0.70: return 2
    if r < 0.85: return 3
    if r < 0.95: return 4
    return 5

def fmt_idr(n):
    return f"{n:,}".replace(",", ".")

def row_september(i):
    day = R.randint(1, 30)
    r = R.random()
    if r < 0.70:
        tgl = f"2026-09-{day:02d}"
    elif r < 0.85:
        tgl = f"{day:02d}/09/2026"
    elif r < 0.95:
        tgl = f"{day} Sep 2026"
    else:
        tgl = ""
    cust = "" if R.random() < 0.02 else f"C-{R.randint(1000, 9999):04d}"
    nama, harga_dasar = R.choice(PRODUK)
    if nama == "Es Céndol" and R.random() < 0.08:
        nama = "Es CÃ©ndol"  # mojibake: byte UTF-8 dibaca sebagai latin-1
    q = pick_qty()
    rq = R.random()
    if rq < 0.03:
        qty = ""
    elif rq < 0.05:
        qty = f" {q} "
    else:
        qty = str(q)
    rh = R.random()
    if rh < 0.05:
        harga = ""
    elif rh < 0.20:
        harga = f"Rp {fmt_idr(harga_dasar)}"
    elif rh < 0.30:
        harga = f" {harga_dasar} "
    else:
        harga = str(harga_dasar)
    kota = "" if R.random() < 0.05 else R.choice(KOTA)
    return [f"TRX-202609-{i:04d}", tgl, cust, nama, qty, harga, kota]

def row_oktober(i):
    day = R.randint(1, 31)
    r = R.random()
    if r < 0.60:
        tgl = f"2026/10/{day:02d}"
    elif r < 0.85:
        tgl = f"{day:02d}-10-2026"
    elif r < 0.95:
        tgl = f"{day} {'Okt' if R.random() < 0.5 else 'Oct'} 2026"
    else:
        tgl = ""
    cust = "" if R.random() < 0.02 else f"C-{R.randint(1000, 9999):04d}"
    nama, harga_dasar = R.choice(PRODUK)
    if nama == "Es Céndol" and R.random() < 0.08:
        nama = "Es CÃ©ndol"
    q = pick_qty()
    qty = "" if R.random() < 0.03 else str(q)
    rh = R.random()
    if rh < 0.05:
        harga = ""
    elif rh < 0.25:
        harga = f"IDR {fmt_idr(harga_dasar)}"
    elif rh < 0.40:
        harga = f" {harga_dasar} "
    else:
        harga = str(harga_dasar)
    rc = R.random()
    channel = "Online" if rc < 0.50 else ("Toko" if rc < 0.80 else "Aplikasi")
    return [f"TRX-202610-{i:04d}", tgl, cust, nama, qty, harga, channel]

base_sep = [row_september(i) for i in range(1, 1501)]
dups_sep = [list(R.choice(base_sep)) for _ in range(60)]
rows_sep = base_sep + dups_sep

base_okt = [row_oktober(i) for i in range(1, 1401)]
dups_okt = [list(R.choice(base_okt)) for _ in range(40)]
rows_okt = base_okt + dups_okt

with open(os.path.join(OUT, "transaksi_2026-09.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["order_id", "tanggal", "customer_id", "produk", "qty", "harga", "kota"])
    w.writerows(rows_sep)

with open(os.path.join(OUT, "transaksi_2026-10.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["id_pesanan", "tgl", "cust_id", "nama_produk", "jumlah", "price", "channel"])
    w.writerows(rows_okt)

print("sep:", len(rows_sep), "okt:", len(rows_okt))
print("bytes:", os.path.getsize(os.path.join(OUT, "transaksi_2026-09.csv")),
      os.path.getsize(os.path.join(OUT, "transaksi_2026-10.csv")))
