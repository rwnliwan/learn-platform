#!/usr/bin/env python3
"""Build dataset SINTETIS untuk misi-kartu-hantu (Fraud/AML Misi A, 2026-10-15).

Seed 42. Pure stdlib + numpy (+ pandas hanya untuk verifikasi nilai checks).
Output: public/misi/misi-kartu-hantu/
  - transaksi.csv        : 20.000 transaksi bersih (label is_fraud jujur per pola)
  - transaksi_audit.csv  : salinan + 17 baris injeksi TERDOKUMENTASI
  - METODE.md            : parameter pola fraud, daftar injeksi, pernyataan SINTETIS

KEJUJURAN (dibaca sebelum memakai data ini):
  Seluruh data SINTETIS — dibangkitkan generator berparameter yang meniru
  SKEMA dataset riset fraud kartu kredit publik (pola Sparkov: velocity,
  mismatch kategori, anomali amount). TANPA data nasabah asli, TANPA PII.
  Nomor kartu berupa token sintetis (card_0001 ...), merchant FIKTIF
  (bukan merek dagang asli), kota hanya label geografis kasar.
  Pola fraud-nya realistis, tetapi angka absolutnya BUKAN kejadian nyata.
"""
import csv
import os
import random
from datetime import datetime, timedelta

import numpy as np

SEED = 42
random.seed(SEED)
rng = np.random.default_rng(SEED)

N_CARDS = 2000
N_DAYS = 60
START = datetime(2026, 8, 17, 0, 0, 0)   # jendela: 2026-08-17 s.d. 2026-10-15
N_TOTAL = 20000

CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang",
          "Makassar", "Denpasar", "Yogyakarta", "Palembang", "Balikpapan"]

CATEGORIES = ["groceries", "dining", "travel", "electronics",
              "luxury", "fashion", "fuel", "health"]

# 40 merchant FIKTIF (nama generik; 5 per kategori). Bukan merek dagang asli.
MERCHANTS = [
    ("Segar Mart Kelapa Gading", "groceries"),
    ("Pasar Modern BSD", "groceries"),
    ("Toko Buah Nusantara Bogor", "groceries"),
    ("Sembako Jaya Cikini", "groceries"),
    ("Hyper Segar Puri", "groceries"),
    ("Resto Sederhana Blok M", "dining"),
    ("Ayam Bakar Dago", "dining"),
    ("Sate Kambing Pasar Minggu", "dining"),
    ("Kopi Sore Tebet", "dining"),
    ("Bakmi Jawa Malioboro", "dining"),
    ("Tiket Terbang Kuningan", "travel"),
    ("Hotel Bintang Malioboro", "travel"),
    ("Travel Wisata Kuta", "travel"),
    ("Sewa Mobil Slipi", "travel"),
    ("Ferry Merak Express", "travel"),
    ("Gadget Plaza Mangga Dua", "electronics"),
    ("Elektro Jaya Glodok", "electronics"),
    ("Komputer Harco Mangga Dua", "electronics"),
    ("Audio Visual Senayan", "electronics"),
    ("Smart Home Kemang", "electronics"),
    ("Butik Jam Plaza Senayan", "luxury"),
    ("Perhiasan Cikini Gold", "luxury"),
    ("Galerie Seni Kemang", "luxury"),
    ("Tas Branded Pondok Indah", "luxury"),
    ("Parfum Eksklusif Grand Sudirman", "luxury"),
    ("Butik Kain Tanah Abang", "fashion"),
    ("Fashion Outlet Dago", "fashion"),
    ("Sepatu Sport Senayan", "fashion"),
    ("Denim House Bandung", "fashion"),
    ("Hijab Style Depok", "fashion"),
    ("SPBU Rest Area KM 57", "fuel"),
    ("SPBU Cikampek Utama", "fuel"),
    ("SPBU Pantura Brebes", "fuel"),
    ("SPBU Tol Jagorawi", "fuel"),
    ("SPBU Porong Sidoarjo", "fuel"),
    ("Apotek Sehat Cempaka", "health"),
    ("Klinik Pratama Cibubur", "health"),
    ("Optik Cahaya Depok", "health"),
    ("Lab Klinik Sehat Tebet", "health"),
    ("Apotek 24 Rawamangun", "health"),
]
BY_CAT = {}
for m, c in MERCHANTS:
    BY_CAT.setdefault(c, []).append(m)

# ── profil kartu ──────────────────────────────────────────────────────────
cards = []
for i in range(1, N_CARDS + 1):
    cid = "card_%04d" % i
    mu = float(rng.normal(12.5, 0.8))          # median belanja ~ Rp 268 rb
    sigma = float(rng.uniform(0.5, 1.0))
    ncat = int(rng.integers(3, 6))
    cats = random.sample(CATEGORIES, k=ncat)   # kategori "kebiasaan" kartu
    cards.append({
        "id": cid,
        "city": random.choice(CITIES),
        "mu": mu,
        "sigma": sigma,
        "cats": cats,
        "median": int(round(np.exp(mu) / 1000.0) * 1000),
    })
by_id = {c["id"]: c for c in cards}


def mk_amount(card):
    a = float(rng.lognormal(card["mu"], card["sigma"]))
    return max(10000, int(round(a / 1000.0) * 1000))


def rand_time():
    return START + timedelta(seconds=int(rng.integers(0, N_DAYS * 86400)))


def fmt_time(t):
    return t.strftime("%Y-%m-%d %H:%M:%S")


# ── pola fraud (parameter di METODE.md) ───────────────────────────────────
# (a) velocity: 30 kartu, masing-masing 1 burst 5-8 transaksi dalam <10 menit
# (b) mismatch: 40% burst ditaruh jam 02:00-05:00 + 1-2 transaksi luxury
# (c) amount anomaly: 5% transaksi fraud > 4x median kartu tsb
# (d) channel online + merchant baru (di luar kebiasaan kartu)
fraud_card_ids = random.sample([c["id"] for c in cards], 30)
fraud_rows = []
for cid in fraud_card_ids:
    card = by_id[cid]
    k = int(rng.integers(5, 9))                      # 5..8 transaksi
    odd_hour = rng.random() < 0.40
    if odd_hour:
        day = int(rng.integers(0, N_DAYS))
        base = START + timedelta(days=day,
                                 hours=int(rng.integers(2, 5)),
                                 minutes=int(rng.integers(0, 60)))
    else:
        base = rand_time()
    offsets = sorted(rng.uniform(0, 8 * 60, k))      # rentang <10 menit
    new_merchants = [(m, c) for (m, c) in MERCHANTS if c not in card["cats"]]
    lux = [(m, c) for (m, c) in MERCHANTS if c == "luxury"]
    for j in range(k):
        t = base + timedelta(seconds=float(offsets[j]))
        if odd_hour and j < 2:
            m, cat = random.choice(lux)
        else:
            m, cat = random.choice(new_merchants)
        if rng.random() < 0.05:
            amt = int(card["median"] * float(rng.uniform(4, 10)) / 1000) * 1000
        else:
            amt = mk_amount(card)
        fraud_rows.append({
            "trans_time": fmt_time(t),
            "card_id": cid,
            "merchant": m,
            "category": cat,
            "amount": amt,
            "channel": "online",
            "city": card["city"],
            "is_fraud": 1,
        })

# ── transaksi legit ───────────────────────────────────────────────────────
n_fraud = len(fraud_rows)
n_legit = N_TOTAL - n_fraud
weights = rng.dirichlet(np.ones(N_CARDS))
counts = rng.multinomial(n_legit, weights)
legit_rows = []
for card, c in zip(cards, counts):
    for _ in range(int(c)):
        t = rand_time()
        if rng.random() < 0.80:
            cat = random.choice(card["cats"])
            m = random.choice(BY_CAT[cat])
        else:
            m, cat = random.choice(MERCHANTS)
        city = card["city"] if rng.random() < 0.85 else random.choice(CITIES)
        legit_rows.append({
            "trans_time": fmt_time(t),
            "card_id": card["id"],
            "merchant": m,
            "category": cat,
            "amount": mk_amount(card),
            "channel": "online" if rng.random() < 0.40 else "chip",
            "city": city,
            "is_fraud": 0,
        })

all_rows = sorted(legit_rows + fraud_rows, key=lambda r: r["trans_time"])
for i, r in enumerate(all_rows, 1):
    r["trans_id"] = "TX-%06d" % i

COLUMNS = ["trans_id", "trans_time", "card_id", "merchant", "category",
           "amount", "channel", "city", "is_fraud"]

OUT = os.path.expanduser("~/workspace/learn-platform/public/misi/misi-kartu-hantu")
os.makedirs(OUT, exist_ok=True)


def write_csv(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)


clean_path = os.path.join(OUT, "transaksi.csv")
write_csv(clean_path, all_rows)

# ── injeksi TERDOKUMENTASI untuk transaksi_audit.csv ──────────────────────
audit_rows = [dict(r) for r in all_rows]
injections = []          # (kode, daftar trans_id, deskripsi)
next_n = N_TOTAL + 1


def add_injected(row):
    global next_n
    row = dict(row)
    row["trans_id"] = "TX-%06d" % next_n
    next_n += 1
    audit_rows.append(row)
    return row["trans_id"]


# I1: 2x velocity burst — 1 kartu, 6 transaksi dalam 8 menit (is_fraud=1)
legit_cards = [c for c in cards if c["id"] not in fraud_card_ids]
i1_ids = []
for b in range(2):
    card = random.choice(legit_cards)
    base = rand_time()
    offsets = sorted(rng.uniform(0, 8 * 60, 6))
    new_merchants = [(m, c) for (m, c) in MERCHANTS if c not in card["cats"]]
    ids = []
    for j in range(6):
        m, cat = random.choice(new_merchants)
        ids.append(add_injected({
            "trans_time": fmt_time(base + timedelta(seconds=float(offsets[j]))),
            "card_id": card["id"],
            "merchant": m,
            "category": cat,
            "amount": mk_amount(card),
            "channel": "online",
            "city": card["city"],
            "is_fraud": 1,
        }))
    injections.append(("I1-velocity-%d" % (b + 1), ids,
                       "burst 6 transaksi dalam 8 menit, kartu %s, is_fraud=1" % card["id"]))
    i1_ids.append((card["id"], ids))

# I2: 2x luxury dini hari (category mismatch, jam 03:12 & 03:47)
i2_ids = []
for hhmm, nm in [(("03", "12"), 0), (("03", "47"), 1)]:
    card = random.choice(legit_cards)
    day = int(rng.integers(0, N_DAYS))
    t = START + timedelta(days=day, hours=3, minutes=int(hhmm[1]))
    m = random.choice(BY_CAT["luxury"])
    amt = int(card["median"] * float(rng.uniform(6, 12)) / 1000) * 1000
    tid = add_injected({
        "trans_time": fmt_time(t),
        "card_id": card["id"],
        "merchant": m,
        "category": "luxury",
        "amount": amt,
        "channel": "online",
        "city": card["city"],
        "is_fraud": 1,
    })
    i2_ids.append(tid)
injections.append(("I2-luxury-dini-hari", i2_ids,
                   "transaksi luxury jam 03:12 dan 03:47 (category mismatch), is_fraud=1"))

# I3: 2x amount anomaly ekstrem (40x median kartu)
i3_ids = []
for _ in range(2):
    card = random.choice(legit_cards)
    t = rand_time()
    m, cat = random.choice(MERCHANTS)
    amt = card["median"] * 40
    tid = add_injected({
        "trans_time": fmt_time(t),
        "card_id": card["id"],
        "merchant": m,
        "category": cat,
        "amount": amt,
        "channel": "online",
        "city": card["city"],
        "is_fraud": 1,
    })
    i3_ids.append(tid)
injections.append(("I3-amount-anomaly", i3_ids,
                   "amount = 40x median PROFIL kartu (parameter generator; "
                   "rasio vs median realisasi sampel bisa berbeda), is_fraud=1"))

# I4: 1x trans_id duplikat (double-charge / replay) — salinan persis 1 baris
dup_src = random.choice(all_rows)
dup = dict(dup_src)   # trans_id SAMA -> duplikat
audit_rows.append(dup)
injections.append(("I4-duplikat-trans-id", [dup_src["trans_id"]],
                   "salinan persis baris %s (trans_id ganda = double-charge/replay)" % dup_src["trans_id"]))

audit_rows = sorted(audit_rows, key=lambda r: r["trans_time"])
audit_path = os.path.join(OUT, "transaksi_audit.csv")
write_csv(audit_path, audit_rows)

# ── METODE.md ─────────────────────────────────────────────────────────────
metode = """# METODE — Dataset misi-kartu-hantu (Fraud/AML Misi A)

## Pernyataan kejujuran data (baca dulu)

**Data SINTETIS.** Seluruh 20.000 transaksi dibangkitkan oleh generator
berparameter `misi-data/build_misi-kartu-hantu.py` (seed 42) yang meniru
**skema** dataset riset fraud kartu kredit publik (pola Sparkov: velocity,
mismatch kategori, anomali amount) — **TANPA data nasabah asli dan TANPA
kolom PII.** Nomor kartu berupa token sintetis (`card_0001` … `card_2000`),
merchant FIKTIF (nama generik, bukan merek dagang asli), kota hanya label
geografis kasar. Pola fraud-nya realistis, tetapi **angka absolutnya BUKAN
kejadian nyata**. Jangan pernah menyebut dataset ini "data nyata".

## Parameter generator (seed 42)

- 2.000 kartu token, jendela 60 hari (2026-08-17 s.d. 2026-10-15).
- Profil kartu: median belanja lognormal(mu=12,5, sigma=0,5–1,0) per kartu
  (median ≈ Rp 268 rb); 3–5 kategori "kebiasaan" per kartu.
- Transaksi legit: 80% merchant dari kategori kebiasaan kartu, 20% acak;
  channel 60% chip / 40% online; kota 85% kota asal kartu.
- Pola fraud (30 kartu, masing-masing 1 burst):
  - (a) **velocity**: burst 5–8 transaksi dalam <10 menit (rentang seragam 0–8 menit);
  - (b) **mismatch**: 40% burst ditaruh jam 02:00–05:00 dengan 1–2 transaksi luxury;
  - (c) **amount anomaly**: 5% transaksi fraud ber-amount > 4× median kartu tsb;
  - (d) **channel online + merchant baru** (di luar kategori kebiasaan kartu).
- Total: 20.000 baris; fraud rate TERUKUR lihat ringkasan build di bawah
  (target desain ≈ 0,8–1,0%).

## File

- `transaksi.csv` — 20.000 baris bersih. Kolom: `trans_id` (TX-000001 …),
  `trans_time` (YYYY-MM-DD HH:MM:SS), `card_id` (token), `merchant`,
  `category` (groceries/dining/travel/electronics/luxury/fashion/fuel/health),
  `amount` (IDR), `channel` (chip/online), `city`, `is_fraud` (0/1).
- `transaksi_audit.csv` — salinan transaksi.csv + 17 baris injeksi
  TERDOKUMENTASI di bawah (total 20.017 baris). Dipakai untuk misi audit.

## Injeksi terdokumentasi (hanya di transaksi_audit.csv)

| Kode | trans_id terdampak | Deskripsi |
|------|-------------------|-----------|
"""
for kode, tids, desc in injections:
    metode += "| %s | %s | %s |\n" % (kode, ", ".join("`%s`" % t for t in tids), desc)

metode += """
Catatan: injeksi I1–I3 memakai pola fraud yang sama dengan generator
(is_fraud=1) sehingga konsisten secara label; I4 adalah masalah integritas
data (trans_id ganda), bukan pola fraud.
Catatan I3: "40x median" = 40x median PROFIL kartu (parameter generator,
mis. card_1180: profil Rp 277.000 -> Rp 11.080.000). Median REALISASI dari
sampel transaksi legit kartu tsb bisa berbeda (card_1180: Rp 427.500,
rasio realisasi ~26x) — perbedaan ini wajar dan didokumentasikan apa adanya.

## Ukuran

- transaksi.csv: 20.000 baris
- transaksi_audit.csv: 20.017 baris (20.000 + 17 injeksi)
- Total folder < 5 MB.

## Lisensi / atribusi

Dataset SINTETIS 100% — tidak ada sumber pihak ketiga, tidak ada lisensi
eksternal yang perlu dikutip. Generator: `misi-data/build_misi-kartu-hantu.py`.
"""

with open(os.path.join(OUT, "METODE.md"), "w", encoding="utf-8") as f:
    f.write(metode)

# ── ringkasan verifikasi (nilai untuk checks misi) ─────────────────────────
import pandas as pd

df = pd.read_csv(clean_path)
df["trans_time"] = pd.to_datetime(df["trans_time"])
n_baris = len(df)
fraud_rate = float(df["is_fraud"].mean())

df_v = df.sort_values(["card_id", "trans_time"]).copy()
t_depan = df_v.groupby("card_id")["trans_time"].shift(-4)
selang = (t_depan - df_v["trans_time"]).dt.total_seconds() / 60
n_velocity_cards = int(df_v.loc[selang <= 10, "card_id"].nunique())

median_kartu = df_v.groupby("card_id")["amount"].transform("median")
di_flag = df_v["amount"] > 3 * median_kartu
precision_aturan = float(df_v.loc[di_flag, "is_fraud"].mean())
n_flagged = int(di_flag.sum())

print("=== RINGKASAN BUILD misi-kartu-hantu (seed 42) ===")
print("n_baris            =", n_baris)
print("n_fraud            =", int(df['is_fraud'].sum()))
print("fraud_rate         = %.6f" % fraud_rate)
print("n_velocity_cards   =", n_velocity_cards, "(kartu dgn >=5 tx dlm 10 mnt)")
print("n_flagged_3x       =", n_flagged)
print("precision_aturan   = %.6f" % precision_aturan)
print("audit_rows         =", len(audit_rows))
for kode, tids, desc in injections:
    print("injeksi", kode, "->", ", ".join(tids))
    print("   ", desc)
print("ukuran transaksi.csv      = %.2f MB" % (os.path.getsize(clean_path) / 1e6))
print("ukuran transaksi_audit.csv = %.2f MB" % (os.path.getsize(audit_path) / 1e6))
