#!/usr/bin/env python3
"""Build snapshot dataset untuk Misi Credit Risk A: misi-pinjaman-pertama.

Sumber: Statlog German Credit Data (Prof. Dr. Hans Hofmann), file german.data
diunduh dari https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
(sudah ada di /tmp/german_dl/). Kamus kode: german.doc.

Lisensi (verifikasi 2026-10-15):
- Halaman UCI menampilkan seksi "License": "This dataset is licensed under a
  Creative Commons Attribution 4.0 International (CC BY 4.0) license."
- Metadata ucimlrepo (fetch_ucirepo id=144): TIDAK punya field license (None).
- OpenML credit-g (d/31, dataset IDENTIK, kreator Dr. Hans Hofmann):
  API openml.org -> licence = "Public".
Bundel dibenarkan: CC BY 4.0 mengizinkan redistribusi dengan atribusi;
atribusi: "Prof. Dr. Hans Hofmann, Statlog German Credit Data".

Output: ~/workspace/learn-platform/public/misi/misi-pinjaman-pertama/
- kredit.csv        : bersih, 1000 baris, kolom deskriptif Inggris, class good/bad.
- kredit_audit.csv  : salinan + 7 injeksi terdokumentasi (duplikat dsb).
- METODE.md         : sumber, lisensi, metode decode, seed, daftar injeksi, ukuran.

Seed tetap 42. Kolom application_id (APP-0001..APP-1000) adalah ID sintetis dari
urutan baris german.data — ditambahkan agar injeksi duplikat "ID aplikasi
identik" bisa dideteksi (bukan bagian dari data asli).
"""
import csv
import os
import random
import statistics

SEED = 42
random.seed(SEED)

SRC = "/tmp/german_dl/german.data"
OUT = os.path.expanduser("~/workspace/learn-platform/public/misi/misi-pinjaman-pertama")
os.makedirs(OUT, exist_ok=True)

# ── kamus decode dari german.doc ──────────────────────────────────────────
D_CHECKING = {"A11": "below zero", "A12": "0 to 200", "A13": "200 and above",
              "A14": "no checking account"}
D_HISTORY = {"A30": "no credits / all paid duly",
             "A31": "all credits at this bank paid duly",
             "A32": "existing credits paid duly",
             "A33": "delay in paying off",
             "A34": "critical account / other credits elsewhere"}
D_PURPOSE = {"A40": "car (new)", "A41": "car (used)", "A42": "furniture / equipment",
             "A43": "radio / television", "A44": "domestic appliances", "A45": "repairs",
             "A46": "education", "A47": "vacation", "A48": "retraining",
             "A49": "business", "A410": "other"}
D_SAVINGS = {"A61": "below 100", "A62": "100 to 500", "A63": "500 to 1000",
             "A64": "1000 and above", "A65": "unknown / no savings"}
D_EMPLOY = {"A71": "unemployed", "A72": "below 1 year", "A73": "1 to 4 years",
            "A74": "4 to 7 years", "A75": "7 years and above"}
D_STATUS = {"A91": "male: divorced / separated",
            "A92": "female: divorced / separated / married",
            "A93": "male: single", "A94": "male: married / widowed",
            "A95": "female: single"}
D_DEBTORS = {"A101": "none", "A102": "co-applicant", "A103": "guarantor"}
D_PROPERTY = {"A121": "real estate",
              "A122": "building society savings / life insurance",
              "A123": "car or other", "A124": "unknown / no property"}
D_PLANS = {"A141": "bank", "A142": "stores", "A143": "none"}
D_HOUSING = {"A151": "rent", "A152": "own", "A153": "for free"}
D_JOB = {"A171": "unskilled non-resident", "A172": "unskilled resident",
         "A173": "skilled employee / official",
         "A174": "management / self-employed / highly qualified"}
D_PHONE = {"A191": "none", "A192": "registered under customer name"}
D_FOREIGN = {"A201": "yes", "A202": "no"}

COLS = ["application_id", "checking_account", "duration_months", "credit_history",
        "purpose", "credit_amount", "savings", "employment_since", "installment_rate",
        "personal_status", "debtors", "residence_since", "property", "age",
        "installment_plans", "housing", "existing_credits", "job", "dependents",
        "telephone", "foreign_worker", "class"]


def decode(row, idx):
    return {
        "application_id": "APP-%04d" % (idx + 1),
        "checking_account": D_CHECKING[row[0]],
        "duration_months": int(row[1]),
        "credit_history": D_HISTORY[row[2]],
        "purpose": D_PURPOSE[row[3]],
        "credit_amount": int(row[4]),
        "savings": D_SAVINGS[row[5]],
        "employment_since": D_EMPLOY[row[6]],
        "installment_rate": int(row[7]),
        "personal_status": D_STATUS[row[8]],
        "debtors": D_DEBTORS[row[9]],
        "residence_since": int(row[10]),
        "property": D_PROPERTY[row[11]],
        "age": int(row[12]),
        "installment_plans": D_PLANS[row[13]],
        "housing": D_HOUSING[row[14]],
        "existing_credits": int(row[15]),
        "job": D_JOB[row[16]],
        "dependents": int(row[17]),
        "telephone": D_PHONE[row[18]],
        "foreign_worker": D_FOREIGN[row[19]],
        "class": "good" if row[20] == "1" else "bad",
    }


raw = [line.split() for line in open(SRC, encoding="utf-8").read().splitlines()
       if line.strip()]
assert len(raw) == 1000 and all(len(r) == 21 for r in raw), "format german.data berubah!"

base = [decode(r, i) for i, r in enumerate(raw)]

with open(os.path.join(OUT, "kredit.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=COLS)
    w.writeheader()
    w.writerows(base)

# ── file audit: injeksi terdokumentasi (seed 42) ──────────────────────────
idx = random.sample(range(1000), 3 + 2 + 2 + 1)
dup_idx, rate_idx, purpose_idx, age_idx = idx[0:3], idx[3:5], idx[5:7], idx[7:8]

audit = [dict(r) for r in base]
for i in rate_idx:
    audit[i]["installment_rate"] = 99          # mustahil: 99% dari disposable income
for i in purpose_idx:
    audit[i]["purpose"] = "A412"              # kode tak ada di kamus german.doc
for i in age_idx:
    audit[i]["age"] = 120                     # umur mustahil
for i in dup_idx:
    audit.append(dict(audit[i]))              # duplikat persis, ID aplikasi identik

with open(os.path.join(OUT, "kredit_audit.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=COLS)
    w.writeheader()
    w.writerows(audit)

inj = {
    "duplikat_3_pasang": [audit[i]["application_id"] for i in dup_idx],
    "installment_rate_99": [audit[i]["application_id"] for i in rate_idx],
    "purpose_A412": [audit[i]["application_id"] for i in purpose_idx],
    "umur_120": [audit[i]["application_id"] for i in age_idx],
}

# ── METODE.md ─────────────────────────────────────────────────────────────
size_clean = os.path.getsize(os.path.join(OUT, "kredit.csv"))
size_audit = os.path.getsize(os.path.join(OUT, "kredit_audit.csv"))

metode = f"""# METODE — misi-pinjaman-pertama

## Sumber data
- Dataset: **Statlog German Credit Data** (Prof. Dr. Hans Hofmann,
  Institut für Statistik und Ökonometrie, Universität Hamburg).
- Unduhan: https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
  (berisi `german.data` = 1000 baris, 20 atribut berkode + class 1=good/2=bad;
  `german.doc` = kamus kode).
- Atribusi: "Data: Prof. Dr. Hans Hofmann, Statlog German Credit Data (UCI ML Repository)".

## Lisensi — hasil 3 pengecekan (2026-10-15)
1. Halaman dataset UCI (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data)
   menampilkan seksi **License**: "This dataset is licensed under a
   **Creative Commons Attribution 4.0 International (CC BY 4.0)** license."
   (CC BY 4.0 mengizinkan berbagi & adaptasi untuk tujuan apa pun dengan atribusi.)
2. Metadata `ucimlrepo` (`fetch_ucirepo(id=144)`): **tidak punya field license**
   (nilai `None`; daftar key metadata tidak memuat `license`).
3. OpenML credit-g (https://www.openml.org/d/31 — dataset IDENTIK,
   kreator Dr. Hans Hofmann): API openml.org mengembalikan **licence = "Public"**.

Bundel snapshot ini dibenarkan atas dasar (1) dan (3).

## Metode decode kolom
- Setiap baris `german.data` (21 field dipisah spasi) dipetakan 1:1 ke kolom deskriptif
  Inggris memakai kamus `german.doc` (A11..A410, dst.). Class: 1 -> "good", 2 -> "bad".
- Kode purpose yang muncul di data asli: A40, A41, A410, A42–A46, A48, A49
  (A47 "vacation" memang tidak ada di data — sesuai catatan german.doc).
- `application_id` (APP-0001..APP-1000) adalah **ID sintetis** dari urutan baris —
  bukan bagian data asli; ditambahkan agar injeksi duplikat "ID aplikasi identik"
  dapat dideteksi secara bermakna.
- Seed: 42 (pemilihan baris injeksi via `random.sample`).

## Injeksi audit (hanya di kredit_audit.csv)
| Jenis | Jumlah | application_id terdampak |
|---|---|---|
| Baris duplikat persis (ID aplikasi identik) | 3 pasang | {", ".join(inj["duplikat_3_pasang"])} |
| installment_rate mustahil (99%) | 2 baris | {", ".join(inj["installment_rate_99"])} |
| Kode purpose tak valid ("A412", tak ada di kamus) | 2 baris | {", ".join(inj["purpose_A412"])} |
| Umur mustahil (120 tahun) | 1 baris | {", ".join(inj["umur_120"])} |

`kredit_audit.csv` = 1003 baris (1000 + 3 duplikat). File dasar `kredit.csv` murni data publik.

## Statistik kunci (untuk checks lab — dihitung dari CSV asli)
- n_baris = 1000
- bad_rate keseluruhan = 0.30 (300 bad / 1000)
- bad_rate per credit_history tertinggi: "no credits / all paid duly" (A30) = 0.625 (25/40)
- median credit_amount: good = 2244.0, bad = 2574.5

## Ukuran file
- kredit.csv: {size_clean} bytes
- kredit_audit.csv: {size_audit} bytes
"""
with open(os.path.join(OUT, "METODE.md"), "w") as fh:
    fh.write(metode)

# ── nilai untuk checks (PRINT — disalin ke file konten) ───────────────────
bad = sum(1 for r in base if r["class"] == "bad")
hist = {}
for r in base:
    h = r["credit_history"]
    hist.setdefault(h, [0, 0])
    hist[h][0 if r["class"] == "bad" else 1] += 1
amt_bad = statistics.median(r["credit_amount"] for r in base if r["class"] == "bad")
amt_good = statistics.median(r["credit_amount"] for r in base if r["class"] == "good")

print("n_baris =", len(base))
print("bad_rate =", bad / len(base))
print("bad_rate_A30_thin =", hist["no credits / all paid duly"][0] /
      sum(hist["no credits / all paid duly"]))
print("median_plafon_bad =", amt_bad)
print("median_plafon_good =", amt_good)
print("injeksi:", inj)
print("ukuran:", size_clean, size_audit)
