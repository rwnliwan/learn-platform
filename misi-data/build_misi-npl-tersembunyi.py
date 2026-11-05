#!/usr/bin/env python3
"""Build snapshot dataset untuk misi-npl-tersembunyi (Misi B — Credit Risk, edge).

Sumber: Statlog German Credit (UCI, id 144), 1000 baris, class 1=good / 2=bad.
  - File mentah sudah ada di /tmp/german_dl/german.data (dicek; diunduh ulang bila hilang).
  - Lisensi: halaman dataset UCI 144 menyatakan "Creative Commons Attribution 4.0
    International (CC BY 4.0)" (diverifikasi live 2026-10-15 via curl);
    metadata ucimlrepo TIDAK memuat field license; OpenML credit-g (dataset
    IDENTIK, kreator Dr. Hans Hofmann, https://www.openml.org/d/31) menyatakan
    licence = "Public" (diverifikasi via API openml.org 2026-10-15).
    Atribusi: "Statlog German Credit (Hofmann, UCI ML Repository, CC BY 4.0)".

Output: ~/workspace/learn-platform/public/misi/misi-npl-tersembunyi/
  - loanbook.csv         : 1000 baris BERSIH, kolom deskriptif Inggris
  - loanbook_audit.csv   : salinan + KOTORAN TERDOKUMENTASI (lebih berat dari misi A)
  - restrukturisasi.csv  : SINTETIS (40 fasilitas direstrukturisasi, berparameter)
  - METODE.md            : sumber, lisensi, metode, seed, daftar injeksi, ukuran

Semua sampling memakai seed tetap 42 dan didokumentasikan di METODE.md.
Kotoran hanya di file *_audit.csv dan restrukturisasi.csv (sintetis);
file loanbook.csv tetap murni data publik yang didekode.
"""
import csv
import os
import random

SEED = 42
random.seed(SEED)

SRC = "/tmp/german_dl/german.data"
OUT = os.path.expanduser("~/workspace/learn-platform/public/misi/misi-npl-tersembunyi")
os.makedirs(OUT, exist_ok=True)

# ── pemetaan kode -> label deskriptif (dari german.doc) ────────────────────
CHECKING = {"A11": "lt_0", "A12": "0-200", "A13": "ge_200", "A14": "no_account"}
CREDIT_HIST = {"A30": "paid_duly", "A31": "paid_duly_bank", "A32": "paid_duly_till_now",
               "A33": "delay_past", "A34": "critical"}
PURPOSE = {"A40": "car_new", "A41": "car_used", "A42": "furniture", "A43": "tv",
           "A44": "appliances", "A45": "repairs", "A46": "education", "A47": "vacation",
           "A48": "retraining", "A49": "business", "A410": "other"}
SAVINGS = {"A61": "lt_100", "A62": "100-500", "A63": "500-1000", "A64": "ge_1000",
           "A65": "unknown"}
EMPLOY = {"A71": "unemployed", "A72": "lt_1yr", "A73": "1-4yr", "A74": "4-7yr",
          "A75": "ge_7yr"}
PERSONAL = {"A91": "m_divorced", "A92": "f_divorced_married", "A93": "m_single",
            "A94": "m_married_widowed", "A95": "f_single"}
DEBTORS = {"A101": "none", "A102": "co_applicant", "A103": "guarantor"}
PROPERTY = {"A121": "real_estate", "A122": "savings_agreement", "A123": "car_other",
            "A124": "unknown"}
INST_PLANS = {"A141": "bank", "A142": "stores", "A143": "none"}
HOUSING = {"A151": "rent", "A152": "own", "A153": "free"}
JOB = {"A171": "unskilled_nonresident", "A172": "unskilled_resident",
       "A173": "skilled", "A174": "management"}
TELEPHONE = {"A191": "none", "A192": "yes"}
FOREIGN = {"A201": "yes", "A202": "no"}

COLUMNS = ["checking_account", "duration_months", "credit_history", "purpose",
           "credit_amount", "savings", "employment_since", "installment_rate",
           "personal_status", "debtors", "residence_since", "property", "age",
           "installment_plans", "housing", "existing_credits", "job",
           "dependents", "telephone", "foreign_worker", "class"]
DECODE = [CHECKING, None, CREDIT_HIST, PURPOSE, None, SAVINGS, EMPLOY, None,
          PERSONAL, DEBTORS, None, PROPERTY, None, INST_PLANS, HOUSING, None,
          JOB, None, TELEPHONE, FOREIGN, {"1": "good", "2": "bad"}]


def read_clean():
    rows = []
    with open(SRC, encoding="utf-8") as f:
        for line in f:
            toks = line.split()
            assert len(toks) == 21, "baris german.data harus 21 token"
            rows.append([DECODE[i][toks[i]] if DECODE[i] else toks[i]
                         for i in range(21)])
    assert len(rows) == 1000
    return rows


def write_csv(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(COLUMNS)
        w.writerows(rows)


clean = read_clean()
write_csv(os.path.join(OUT, "loanbook.csv"), clean)

# ── loanbook_audit.csv : salinan + kotoran terdokumentasi ──────────────────
CI = {c: i for i, c in enumerate(COLUMNS)}
audit = [list(r) for r in clean]

# K1: 5% missing acak di employment_since (50 baris) dan savings (50 baris)
miss_emp = sorted(random.sample(range(1000), 50))
miss_sav = sorted(random.sample(range(1000), 50))
for i in miss_emp:
    audit[i][CI["employment_since"]] = ""
for i in miss_sav:
    audit[i][CI["savings"]] = ""

# K2: 2 pasang duplikat KONFLIK — salinan baris bersih (di luar baris K1/K3/K4)
#     dengan class dibalik; ditempel di akhir sebagai baris data 1001 & 1002.
rate_rows = sorted(random.sample(range(1000), 3))
purp_rows = sorted(random.sample(range(1000), 2))
dirty_idx = set(miss_emp) | set(miss_sav) | set(rate_rows) | set(purp_rows)
pool = [i for i in range(1000) if i not in dirty_idx]
dup_src = sorted(random.sample(pool, 2))
for j, src in enumerate(dup_src):
    dup = list(clean[src])
    dup[CI["class"]] = "bad" if dup[CI["class"]] == "good" else "good"
    audit.append(dup)
dup_new_rows = [1001, 1002]  # nomor baris data (1-based) di file audit

# K3: 3 installment_rate mustahil (>60)
rate_vals = [88, 75, 92]
for i, v in zip(rate_rows, rate_vals):
    audit[i][CI["installment_rate"]] = str(v)

# K4: 2 kode purpose tak valid
purp_vals = ["A99", "BOGUS"]
for i, v in zip(purp_rows, purp_vals):
    audit[i][CI["purpose"]] = v

write_csv(os.path.join(OUT, "loanbook_audit.csv"), audit)

# ── restrukturisasi.csv : SINTETIS (40 fasilitas) ─────────────────────────
NAMES = ["PT Maju Jaya", "Hj. Aminah", "D. Prasetyo", "PT Sinar Abadi",
         "CV Berkah", "R. Wijaya", "H. Santoso", "PT Cahaya Timur",
         "S. Nugroho", "UD Lancar Rejeki", "T. Hidayat", "Ny. Rahma",
         "PT Bumi Raya", "K. Setiawan", "PT Delta Farma", "Ny. Lestari",
         "PT Artha Graha", "B. Kurniawan", "CV Tunas Bangsa", "Hj. Ratna",
         "PT Wira Kencana", "A. Firmansyah", "Ny. Dewi", "PT Nusa Indah",
         "UD Sumber Makmur", "F. Ramadhan", "PT Graha Sentosa", "Hj. Yuliana",
         "CV Pelita Hati", "PT Samudra Biru", "D. Saputra", "Ny. Kartini",
         "PT Cakra Buana", "H. Mahmud", "UD Berkah Jaya", "PT Lintas Nusa",
         "S. Wibowo", "Ny. Fatimah", "PT Mega Artha", "H. Burhan"]
KET = ["perpanjangan tenor 12 bulan", "penurunan suku bunga 2%",
       "grace period pokok 6 bulan", "penjadwalan ulang cicilan",
       "konversi tunggakan menjadi tenor baru"]
STATUS_BEFORE = ["macet", "diragukan", "kurang_lancar"]

refs = set(random.sample(range(1, 1001), 38))
refs |= {12, 47}  # WAJIB: dua fasilitas yang muncul di dossier audit
refs = sorted(refs)[:40]
restr = []
name_for = {}
for k, r in enumerate(refs):
    nm = NAMES[k % len(NAMES)]
    name_for[r] = nm
    restr.append(["F-%04d" % r, nm,
                  "2024-%02d-%02d" % (random.randint(1, 12), random.randint(1, 28)),
                  random.choice(STATUS_BEFORE), random.choice(KET)])
with open(os.path.join(OUT, "restrukturisasi.csv"), "w", newline="",
          encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["facility_ref", "debitur", "tanggal_restrukturisasi",
                "status_sebelum", "keterangan"])
    w.writerows(restr)

# ── METODE.md ─────────────────────────────────────────────────────────────
inj = []
inj.append("K1 missing values: 50 baris employment_since kosong (baris data: %s) "
           "dan 50 baris savings kosong (baris data: %s)."
           % (", ".join(str(i + 1) for i in miss_emp[:8]) + ", ...",
              ", ".join(str(i + 1) for i in miss_sav[:8]) + ", ..."))
inj.append("K2 duplikat konflik: baris data 1001 = salinan baris %d dengan class "
           "dibalik; baris data 1002 = salinan baris %d dengan class dibalik."
           % (dup_src[0] + 1, dup_src[1] + 1))
inj.append("K3 installment_rate mustahil: baris %d -> 88, baris %d -> 75, "
           "baris %d -> 92 (nilai asli 1-4 di data bersih)."
           % (rate_rows[0] + 1, rate_rows[1] + 1, rate_rows[2] + 1))
inj.append("K4 kode purpose tak valid: baris %d -> 'A99', baris %d -> 'BOGUS'."
           % (purp_rows[0] + 1, purp_rows[1] + 1))

metode = """# METODE — misi-npl-tersembunyi (Misi B Credit Risk)

## Sumber data
- Statlog German Credit, Prof. Dr. Hans Hofmann, Universität Hamburg (1994).
- Diunduh (tanpa login): https://archive.ics.uci.edu/static/public/144/statlog+german+credit+data.zip
  (german.data 1000 baris + german.doc kamus kode; class 1 = good, 2 = bad).
- File mentah saat build: /tmp/german_dl/german.data (dicek ulang bila hilang).

## Lisensi (tiga pengecekan, 2026-10-15)
1. Halaman dataset UCI id 144 (https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data):
   badge lisensi eksplisit — "This dataset is licensed under a Creative Commons
   Attribution 4.0 International (CC BY 4.0) license." (diverifikasi live via curl).
2. Metadata ucimlrepo (fetch_ucirepo id 144): TIDAK memuat field license.
3. OpenML credit-g (dataset IDENTIK, kreator Dr. Hans Hofmann,
   https://www.openml.org/d/31): field licence = "Public" (diverifikasi via API).
- Atribusi bundel: "Statlog German Credit (Hofmann, UCI ML Repository, CC BY 4.0)".

## Metode
- Kode kategorikal didekode ke label Inggris deskriptif (lihat skrip
  misi-data/build_misi-npl-tersembunyi.py); kolom numerik tidak diubah.
- loanbook.csv = data bersih, 1000 baris. seed acak = 42 (random Python).
- facility_ref di restrukturisasi.csv = "F-" + nomor baris data (1-based) di loanbook.csv.

## Injeksi kotoran (HANYA di loanbook_audit.csv; loanbook.csv murni)
%s

## File restrukturisasi.csv — SINTETIS
40 baris fasilitas yang direstrukturisasi, dibangkitkan berparameter (seed 42):
facility_ref, debitur (nama samaran Indonesia), tanggal_restrukturisasi (2024),
status_sebelum (macet/diragukan/kurang_lancar), keterangan.
Bukan data nyata — dipakai untuk melatih skeptisisme: dua fasilitas di file ini
(F-0012 milik "%s", F-0047 milik "%s") diklaim "tidak pernah direstrukturisasi"
dalam dossier audit misi. Total <5MB untuk seluruh folder.
""" % ("\n".join("- " + s for s in inj), name_for[12], name_for[47])
with open(os.path.join(OUT, "METODE.md"), "w", encoding="utf-8") as f:
    f.write(metode)

# ── nilai untuk checks (disalin ke file konten dari eksekusi nyata) ────────
import pandas as pd
d = pd.DataFrame(clean, columns=COLUMNS)
bad = (d["class"] == "bad").astype(int)
ct = d.assign(bad=bad).groupby(["employment_since", "purpose"])["bad"].agg(["mean", "count"])
ct_ok = ct[ct["count"] >= 10]
w = ct_ok["mean"].idxmax()
def vintage(m): return "pendek" if m < 12 else ("menengah" if m <= 36 else "panjang")
vr = d.assign(bad=bad, vintage=d["duration_months"].astype(int).map(vintage)).groupby("vintage")["bad"].mean()

print("== NILAI CHECKS (dari eksekusi nyata) ==")
print("n_baris =", len(d), "| n_bad =", int(bad.sum()))
print("worst raw: n =", int(ct.loc[ct['mean'].idxmax(), 'count']))
print("worst_emp =", repr(w[0]), "| worst_purp =", repr(w[1]))
print("worst_rate =", round(float(ct_ok['mean'].max()), 6))
print("worst_n =", int(ct_ok.loc[w, 'count']))
print("bad_pendek =", round(float(vr['pendek']), 6))
print("bad_menengah =", round(float(vr['menengah']), 6))
print("bad_panjang =", round(float(vr['panjang']), 6))
da = pd.DataFrame(audit, columns=COLUMNS)
print("n_mustahil (>40) =", int((pd.to_numeric(da['installment_rate'], errors='coerce') > 40).sum()))
print("max installment_rate bersih =", int(pd.to_numeric(d['installment_rate']).max()))
print("F-0012 debitur =", name_for[12], "| F-0047 debitur =", name_for[47])
print("dup_src rows =", [s + 1 for s in dup_src], "| rate_rows =", [r + 1 for r in rate_rows],
      "| purp_rows =", [p + 1 for p in purp_rows])
for p in ["loanbook.csv", "loanbook_audit.csv", "restrukturisasi.csv", "METODE.md"]:
    fp = os.path.join(OUT, p)
    print(p, os.path.getsize(fp), "bytes")
print("refs restrukturisasi (40):", refs)
