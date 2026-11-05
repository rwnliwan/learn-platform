#!/usr/bin/env python3
"""Generator dataset SINTETIS 100% untuk 2 misi M2 grup DATA-ENGINEERING track SQL.
Seed tetap 42. Output: CSV snapshot di public/misi/<slug>/ + manifest lab (JSON).
Jalankan: python3 gen.py  (dari direktori ini)
"""
import csv, json, os, random
from datetime import date, datetime, timedelta

R = random.Random(42)
PUB = os.path.expanduser("~/workspace/learn-platform/public/misi")
GEN = os.path.dirname(os.path.abspath(__file__))

def wcsv(path, header, rows):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)

def inserts(table, header, rows):
    out = [f"INSERT INTO {table} VALUES"]
    vals = []
    for r in rows:
        cells = []
        for v in header:
            x = r[v]
            cells.append("NULL" if x is None else ("'" + str(x).replace("'", "''") + "'" if isinstance(x, str) else str(x)))
        vals.append("(" + ",".join(cells) + ")")
    out.append(",\n".join(vals) + ";")
    return "\n".join(out)

# ═══════════════════════════════════════════════════════════════════
# MISI A — misi-laporan-bulanan-sql  (orders / customers / refunds)
# ═══════════════════════════════════════════════════════════════════
A = f"{PUB}/misi-laporan-bulanan-sql"
NAMES = ["Toko Maju Jaya","Warung Barokah","UD Sinar Abadi","Toko Berkah Jaya",
         "CV Cahaya Timur","Toko Rejeki","UD Makmur Sentosa","Warung Sederhana",
         "Toko Lancar","CV Bintang Terang","Toko Harapan","UD Tunas Bangsa",
         "Warung Nikmat","Toko Sejahtera","CV Purnama","Toko Amanah",
         "UD Karya Mandiri","Warung Enak","Toko Berkah Jaya",  # duplikat identitas: C019
         "CV Surya Kencana","Toko Damai","UD Wira Usaha","Warung Sedap","Toko Prima"]
REGIONS = ["Jawa","Sumatera","Kalimantan","Sulawesi"]
customers = []
for i, nm in enumerate(NAMES, 1):
    cid = f"C{i:03d}"
    jd = date(2024, R.randint(1,12), R.randint(1,28)).isoformat()
    customers.append({"customer_id": cid, "customer_name": nm,
                      "join_date": jd, "region": R.choice(REGIONS)})

orders, paid_orders = [], []
oid = 0
for m in range(1, 7):
    for _ in range(12):
        oid += 1
        d = date(2025, m, R.randint(1, 28)).isoformat()
        c = R.choice(customers)["customer_id"]
        amt = R.randint(75, 2500) * 1000
        u = R.random()
        if u < 0.70: st = "paid"
        elif u < 0.78: st = "Paid"
        elif u < 0.84: st = "PAID"
        elif u < 0.88: st = "pending"
        elif u < 0.92: st = "cancelled"
        elif u < 0.95: st = "canceled"
        elif u < 0.98: st = "void"
        else: st = "payed"
        o = {"order_id": f"O{oid:03d}", "customer_id": c, "order_date": d,
             "amount": amt, "status": st}
        orders.append(o)
        if st.lower() == "paid":
            paid_orders.append(o)
# paksa minimal 1 'payed' agar pelajaran typo selalu ada
if not any(o["status"] == "payed" for o in orders):
    orders[5]["status"] = "payed"
    paid_orders = [o for o in orders if o["status"].lower() == "paid"]

refunds = []
rpool = R.sample(paid_orders, 12)
for i, o in enumerate(rpool, 1):
    od = date.fromisoformat(o["order_date"])
    rd = od + timedelta(days=R.randint(0, 20))
    ra = (o["amount"] * R.randint(10, 50) // 100 // 1000) * 1000
    refunds.append({"refund_id": f"R{i:03d}", "order_id": o["order_id"],
                    "refund_date": rd.isoformat(), "amount": ra})
# paksa 2 refund melewati 25 Juni (untuk pelajaran cutoff)
refunds[0]["refund_date"] = "2025-06-27"
refunds[1]["refund_date"] = "2025-06-28"
# refund tidak boleh tumpah ke Juli (lab hanya Jan–Jun)
for r in refunds:
    if r["refund_date"] > "2025-06-30":
        r["refund_date"] = "2025-06-30"
# IMPOSTOR lab: baris refund ganda — R004 muncul 2x identik
dup = dict(refunds[3]); refunds.append(dup)

wcsv(f"{A}/orders.csv", ["order_id","customer_id","order_date","amount","status"],
     [[o[k] for k in ("order_id","customer_id","order_date","amount","status")] for o in orders])
wcsv(f"{A}/customers.csv", ["customer_id","customer_name","join_date","region"],
     [[c[k] for k in ("customer_id","customer_name","join_date","region")] for c in customers])
wcsv(f"{A}/refunds.csv", ["refund_id","order_id","refund_date","amount"],
     [[r[k] for k in ("refund_id","order_id","refund_date","amount")] for r in refunds])

# — agregat benar (aturan: status LOWER='paid'; refund dedup per refund_id) —
def month(s): return s[:7]
kotor, refund = {}, {}
payed_amt = {}
for o in orders:
    m = month(o["order_date"])
    if o["status"].lower() == "paid":
        kotor[m] = kotor.get(m, 0) + o["amount"]
    if o["status"] == "payed":
        payed_amt[m] = payed_amt.get(m, 0) + o["amount"]
seen = set()
for r in refunds:
    if r["refund_id"] in seen: continue
    seen.add(r["refund_id"])
    m = month(r["refund_date"])
    refund[m] = refund.get(m, 0) + r["amount"]
bulan = sorted(set(kotor) | set(refund))
correct = [{"bulan": m, "kotor": kotor.get(m,0), "refund": refund.get(m,0),
            "bersih": kotor.get(m,0)-refund.get(m,0)} for m in bulan]
kum, correct_rows = 0, []
for r in correct:
    kum += r["bersih"]
    r["kumulatif"] = kum
    correct_rows.append([r["bulan"], r["kotor"], r["refund"], r["bersih"], r["kumulatif"]])

# — varian SALAH untuk dossier (laporan lama) —
r004 = refunds[3]; m_r004 = month(r004["refund_date"])
# total refund (dedup) dengan tanggal > 25 Juni = yang hilang akibat cutoff
_seen2, cut_juni = set(), 0
for r in refunds:
    if r["refund_id"] in _seen2: continue
    _seen2.add(r["refund_id"])
    if r["refund_date"] > "2025-06-25": cut_juni += r["amount"]
wrong = []
for r in correct:
    w = dict(r)
    if r["bulan"] == m_r004:          # refund ganda dihitung 2x
        w["refund"] += r004["amount"]; w["bersih"] -= r004["amount"]
    if r["bulan"] in payed_amt:       # 'payed' ikut kehitung (LIKE 'pai%')
        w["kotor"] += payed_amt[r["bulan"]]; w["bersih"] += payed_amt[r["bulan"]]
    if r["bulan"] == "2025-06":       # cutoff sewenang-wenang 25 Juni
        w["refund"] -= cut_juni; w["bersih"] += cut_juni
    wrong.append(w)
man_a = {
    "bulan_r004": m_r004, "r004_amount": r004["amount"],
    "payed_per_bulan": payed_amt,
    "cutoff_hilang": cut_juni,
    "correct": correct_rows,
    "wrong": [[w["bulan"], w["kotor"], w["refund"], w["bersih"]] for w in wrong],
    "pelanggan_unik_benar": len({c["customer_name"] for c in customers}),
    "pelanggan_unik_salah": len(customers),
}
json.dump(man_a, open(f"{GEN}/manifest_a.json","w"), indent=1)
print("A: orders", len(orders), "| customers", len(customers), "| refunds", len(refunds),
      "| bulan", bulan, "| R004 di", m_r004, "senilai", r004["amount"])
print("A correct rows:", correct_rows)

METODE_A = """# METODE — Misi Laporan: Dari Tabel Mentah ke Angka Bulanan (misi-laporan-bulanan-sql)

- **Status data: 100% SINTETIS.** Seluruh baris di `orders.csv`, `customers.csv`, `refunds.csv`
  dibuat oleh generator `m2-sql-gen/gen.py` (seed tetap **42**) — BUKAN data transaksi nyata,
  BUKAN dari perusahaan mana pun. Nama toko, nominal, dan tanggal semuanya fiktif.
- **Tujuan sintetis:** melatih teknik rekonstruksi laporan (CTE, window function, agregasi
  berlapis) dan audit kualitas data pada data yang *sengaja* dikotori — tanpa risiko
  membocorkan data asli.
- **Skema:**
  - `orders(order_id TEXT, customer_id TEXT, order_date TEXT, amount INTEGER, status TEXT)`
    — 72 baris, Jan–Jun 2025, nominal IDR bilangan bulat. Varian status: paid/Paid/PAID
    (sah), pending, cancelled/canceled, void, payed (typo).
  - `customers(customer_id TEXT, customer_name TEXT, join_date TEXT, region TEXT)`
    — 24 baris; `C007` dan `C019` bernama sama ("Toko Berkah Jaya") = satu pelanggan dua ID.
  - `refunds(refund_id TEXT, order_id TEXT, refund_date TEXT, amount INTEGER)`
    — 13 baris; `R004` muncul DUA KALI identik (duplikat yang harus didedup).
- **Aturan bisnis benar (kunci jawaban lab):** status sah = `LOWER(TRIM(status))='paid'`;
  refund didedup per `refund_id` (ambil 1 via `ROW_NUMBER()`); refund dibebankan pada
  bulan `refund_date`; agregat bulanan + kolom kumulatif (`SUM() OVER (ORDER BY bulan)`).
- **Tanggal snapshot:** 2026-10-15. Ukuran total < 50 KB.
- **Batas jujur:** angka "laporan lama" di dossier audit adalah fiksi yang dirancang
  mengandung 4 suntikan impostor; tidak merepresentasikan laporan perusahaan mana pun.
"""
open(f"{A}/METODE.md","w").write(METODE_A)

# ═══════════════════════════════════════════════════════════════════
# MISI B — misi-dua-sumber-tidak-cocok  (billing / crm)
# ═══════════════════════════════════════════════════════════════════
B = f"{PUB}/misi-dua-sumber-tidak-cocok"
KEYS = [f"K-{i}" for i in range(101, 113)]
billing, bid = [], 0
for i in range(40):
    bid += 1
    d = R.randint(1, 7); h = R.randint(0, 23); mi = R.randint(0, 59)
    ts = f"2025-03-{d:02d} {h:02d}:{mi:02d}:00"          # UTC
    k = R.choice(KEYS)
    st = "void" if R.random() < 0.1 else "paid"
    billing.append({"bill_id": f"B{i+1:03d}", "customer_key": k, "billed_at": ts,
                    "amount": R.randint(100, 2000)*1000, "status": st})
# paksa: 3 baris kunci berspasi, 1 baris kunci NULL, ~6 baris pindah hari di WIB
billing[3]["customer_key"] = "K-107 "
billing[11]["customer_key"] = "K-107 "
billing[22]["customer_key"] = "K-110 "
billing[7]["customer_key"] = None
for idx, hh in zip([5, 9, 15, 19, 27, 33], [18, 20, 22, 19, 21, 23]):
    d = R.randint(1, 6)
    billing[idx]["billed_at"] = f"2025-03-{d:02d} {hh:02d}:{R.randint(0,59):02d}:00"
# baris koreksi tanpa jejak audit
billing.append({"bill_id": "KOR-01", "customer_key": "KOREKSI",
                "billed_at": "2025-03-05 10:00:00", "amount": -200000, "status": "paid"})

crm = []
ckeys = ["K-101","K-102","K-103","K-104","K-105","K-106","K-107","K-108",
         "K-109","K-109",  # duplikat kunci: dua customer_id
         "K-111","K-112","K-118",  # K-118 hanya di CRM
         "K-101","K-104","K-106","K-108","K-111","K-112","K-105"]
cnames = ["PT Maju","CV Sinar","UD Barokah","PT Cahaya","Toko Rejeki","CV Bintang",
          "PT Tunas","UD Makmur","PT Lintas","PT Lintas Cabang","CV Purnama","UD Wira",
          "PT Nusantara","PT Maju Cabang","CV Sinar 2","UD Barokah 2","PT Cahaya 2",
          "CV Bintang 2","UD Wira 2","Toko Rejeki 2"]
for i, (k, nm) in enumerate(zip(ckeys, cnames), 1):
    d = R.randint(1, 7)
    crm.append({"customer_id": f"M{i:03d}", "customer_key": k, "customer_name": nm,
                "created_at": f"2025-03-{d:02d} {R.randint(0,23):02d}:{R.randint(0,59):02d}:00",  # WIB lokal
                "segment": R.choice(["Retail","Korporat","UMKM"])})
crm[4]["customer_key"] = None  # 1 baris kunci NULL di CRM

wcsv(f"{B}/billing.csv", ["bill_id","customer_key","billed_at","amount","status"],
     [[b[k] for k in ("bill_id","customer_key","billed_at","amount","status")] for b in billing])
wcsv(f"{B}/crm.csv", ["customer_id","customer_key","customer_name","created_at","segment"],
     [[c[k] for k in ("customer_id","customer_key","customer_name","created_at","segment")] for c in crm])

# — profil kunci billing (aturan: TRIM; NULL/spasi dilaporkan) —
def norm(k): return None if k is None else k.strip()
profil = {"null": 0, "spasi": 0, "ok": 0}
for b in billing:
    k = b["customer_key"]
    if k is None: profil["null"] += 1
    elif k != k.strip(): profil["spasi"] += 1
    else: profil["ok"] += 1

# — rekonsiliasi FULL OUTER JOIN manual —
from collections import defaultdict
bl = defaultdict(lambda: [0, 0])   # key -> [total, n]
for b in billing:
    k = norm(b["customer_key"]); bl[k][0] += b["amount"]; bl[k][1] += 1
cr = defaultdict(int)
for c in crm:
    cr[norm(c["customer_key"])] += 1
def skey(k): return (1, "") if k is None else (0, k)
recon = []
for k in sorted(set(bl) | set(cr), key=skey):
    tot, nb = bl.get(k, [0, 0]); nc = cr.get(k, 0)
    st = "klop" if (k in bl and k in cr) else ("hanya_billing" if k in bl else "hanya_crm")
    recon.append([k, tot, nb, nc, st])

# — efek timezone: UTC -> WIB (+7 jam) —
pindah, wib_day = 0, defaultdict(int)
for b in billing:
    dt = datetime.strptime(b["billed_at"], "%Y-%m-%d %H:%M:%S")
    w = dt + timedelta(hours=7)
    if w.date() != dt.date(): pindah += 1
    wib_day[w.date().isoformat()] += b["amount"]

man_b = {
    "n_billing": len(billing), "n_crm": len(crm),
    "profil": [["null", profil["null"]], ["ok", profil["ok"]], ["spasi", profil["spasi"]]],
    "recon": recon,
    "n_pindah_hari": pindah,
    "wib_2025_03_04": wib_day.get("2025-03-04", 0),
}
json.dump(man_b, open(f"{GEN}/manifest_b.json","w"), indent=1, default=str)
print("B: billing", len(billing), "| crm", len(crm), "| profil", profil,
      "| pindah_hari", pindah, "| wib 2025-03-04:", wib_day.get("2025-03-04",0))
print("B recon keys:", len(recon))

METODE_B = """# METODE — Misi Rekonsiliasi: Dua Sumber, Dua Kebenaran (misi-dua-sumber-tidak-cocok)

- **Status data: 100% SINTETIS.** Seluruh baris di `billing.csv` dan `crm.csv`
  dibuat oleh generator `m2-sql-gen/gen.py` (seed tetap **42**) — BUKAN data billing/CRM
  nyata, BUKAN dari perusahaan mana pun. Kunci pelanggan, nominal, dan timestamp fiktif.
- **Tujuan sintetis:** melatih audit rekonsiliasi dua sumber (join key inkonsisten, NULL,
  timezone berbeda, duplikat kunci, baris koreksi tanpa jejak) pada data yang *sengaja*
  dikotori — tanpa risiko data asli.
- **Skema:**
  - `billing(bill_id TEXT, customer_key TEXT, billed_at TEXT, amount INTEGER, status TEXT)`
    — 41 baris, 2025-03-01 s.d. 2025-03-07, timestamp **UTC**. Nominal IDR bilangan bulat
    (boleh negatif: baris koreksi). Sengaja: 3 kunci berspasi (`"K-107 "`, `"K-110 "`),
    1 kunci NULL, 1 baris `KOR-01` berkunci `KOREKSI` senilai −200.000 tanpa referensi.
  - `crm(customer_id TEXT, customer_key TEXT, customer_name TEXT, created_at TEXT, segment TEXT)`
    — 20 baris, timestamp **WIB lokal** (tanpa penanda zona). Sengaja: kunci `K-109`
    duplikat (2 customer_id), 1 kunci NULL, kunci `K-118` hanya ada di CRM.
- **Aturan bisnis benar (kunci jawaban lab):** kunci dinormalisasi `TRIM()` sebelum join;
  NULL tidak pernah cocok di join; FULL OUTER JOIN manual = `UNION` dari dua `LEFT JOIN`
  (SQLite tidak punya sintaks `FULL OUTER JOIN`); timestamp billing +7 jam → WIB sebelum
  agregat harian; baris koreksi dilaporkan terpisah, bukan dilebur diam-diam.
- **Tanggal snapshot:** 2026-10-15. Ukuran total < 50 KB.
- **Batas jujur:** "memo analis senior" di dossier audit adalah fiksi yang dirancang
  mengandung 4 suntikan impostor; tidak merepresentasikan memo perusahaan mana pun.
"""
open(f"{B}/METODE.md","w").write(METODE_B)

# — cetak blok INSERT untuk ditempel ke file konten TS —
print("\n═══ A seedData ═══")
print(inserts("orders", ["order_id","customer_id","order_date","amount","status"], orders))
print(inserts("customers", ["customer_id","customer_name","join_date","region"], customers))
print(inserts("refunds", ["refund_id","order_id","refund_date","amount"], refunds))
print("\n═══ B seedData ═══")
print(inserts("billing", ["bill_id","customer_key","billed_at","amount","status"], billing))
print(inserts("crm", ["customer_id","customer_key","customer_name","created_at","segment"], crm))
print("\nSELESAI")
