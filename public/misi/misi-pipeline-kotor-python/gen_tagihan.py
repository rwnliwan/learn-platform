"""Generator dataset SINTETIS — Misi Pipeline: CSV yang Menolak Dibersihkan.

DATA INI 100% SINTETIS — dibuat khusus untuk misi edukasi Learn v2.
Tidak ada pelanggan, angka, atau perusahaan nyata di file ini.
Seed tetap: 42 (random.Random(42)) -> output deterministik byte-per-byte.

Jalankan:  python3 gen_tagihan.py
Output:    tagihan_mentah.csv, kpi_dashboard.csv (di folder yang sama)
"""
import random
import csv
from datetime import date, timedelta

SEED = 42
rng = random.Random(SEED)

PAKET = [("Basic", 150_000, 0.50), ("Pro", 450_000, 0.35), ("Enterprise", 1_500_000, 0.15)]
PAJAK_PCT = 10  # PPN disederhanakan 10% untuk misi ini
N_INVOICE = 240
N_DUPLIKAT = 8

AWAL = ["Maju", "Sinar", "Berkah", "Cahaya", "Tunas", "Wira", "Samudra", "Nusa",
        "Kencana", "Mitra", "Prima", "Agung", "Lestari", "Sentosa", "Jaya"]
AKHIR = ["Bersama", "Abadi", "Jaya", "Nusantara", "Sejahtera", "Makmur", "Pratama",
         "Utama", "Perkasa", "Mulya", "Barokah", "Sejati", "Mandiri", "Karya", "Indah"]
BADAN = ["PT", "CV", "UD"]
PELANGGAN = [f"{rng.choice(BADAN)} {a} {b}" for a, b in
             zip(rng.sample(AWAL, 15), rng.sample(AKHIR, 15))]
PELANGGAN += [f"{rng.choice(BADAN)} {rng.choice(AWAL)} {rng.choice(AKHIR)}" for _ in range(15)]

BULAN_ID = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "Mei": 5, "Jun": 6,
            "Jul": 7, "Agu": 8, "Sep": 9, "Okt": 10, "Nov": 11, "Des": 12}
BULAN_SINGKAT = ["Jan", "Feb", "Mar"]

def fmt_tanggal(d: date) -> str:
    r = rng.random()
    if r < 0.60:
        return d.strftime("%Y-%m-%d")
    if r < 0.75:
        return d.strftime("%d/%m/%Y")
    if r < 0.85:
        return d.strftime("%d-%m-%Y")
    if r < 0.95:
        return f"{d.day} {BULAN_SINGKAT[d.month - 1]} {d.year}"
    return ""  # 5%: tanggal kosong (sistem gagal mencatat)

def fmt_idr(n: int) -> str:
    r = rng.random()
    if r < 0.50:
        return str(n)
    if r < 0.75:
        return "Rp " + f"{n:,}".replace(",", ".")
    if r < 0.90:
        return f"{n:,}"
    return f"  {n}  "

def fmt_diskon(p: int) -> str:
    # Format kosong ("") hanya untuk diskon 0 — konsisten dengan aturan parse "" = 0.
    r = rng.random()
    if p == 0:
        return "" if r < 0.40 else "0"
    return str(p) if r < 0.70 else f"{p}%"

def fmt_subtotal(n: int) -> str:
    return "Rp " + f"{n:,}".replace(",", ".") if rng.random() < 0.10 else str(n)

def pick_paket():
    r = rng.random()
    acc = 0.0
    for nama, harga, bobot in PAKET:
        acc += bobot
        if r < acc:
            return nama, harga
    return PAKET[0][0], PAKET[0][1]

def invoice(i: int):
    nama_paket, harga = pick_paket()
    d = date(2026, 1, 1) + timedelta(days=rng.randint(0, 89))  # Jan-Mar 2026
    qty = rng.randint(1, 5)
    diskon = rng.choice([0, 0, 0, 5, 10, 15])
    subtotal = round(qty * harga * (1 - diskon / 100))
    pajak = round(subtotal * PAJAK_PCT / 100)
    grand = subtotal + pajak
    return {
        "invoice_id": f"INV-2026-{i:04d}",
        "tanggal": fmt_tanggal(d),
        "pelanggan": rng.choice(PELANGGAN),
        "paket": nama_paket,
        "qty": f" {qty} " if rng.random() < 0.15 else str(qty),
        "harga_satuan": fmt_idr(harga),
        "diskon_pct": fmt_diskon(diskon),
        "subtotal": fmt_subtotal(subtotal),
        "pajak": "" if rng.random() < 0.08 else str(pajak),  # 8%: pajak belum dihitung sistem
        # IMPOSTOR 3: kolom "total" sebenarnya = subtotal (pajak tidak ditambahkan)
        "total": fmt_subtotal(subtotal),
        # Kolom kembar bernilai BENAR (grand total) — IMPOSTOR 1: nama mirip, nilai beda
        "total_rp": "Rp " + f"{grand:,}".replace(",", "."),
    }

KOLOM = ["invoice_id", "tanggal", "pelanggan", "paket", "qty", "harga_satuan",
         "diskon_pct", "subtotal", "pajak", "total", "total_rp"]

def main():
    rows = [invoice(i) for i in range(1, N_INVOICE + 1)]
    # IMPOSTOR 2: 8 baris duplikat persis (diam-diam, di akhir file)
    for r in rng.sample(rows, N_DUPLIKAT):
        rows.append(dict(r))

    with open("tagihan_mentah.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=KOLOM)
        w.writeheader()
        w.writerows(rows)

    # Artefak fiksi skenario: dashboard finance (metode naive, didokumentasikan di METODE.md)
    def naive_num(s):
        s = s.strip().replace("Rp", "").strip()
        try:
            return float(s.replace(",", ""))
        except ValueError:
            return 0.0  # "1.250.000" gagal diparse -> 0 (bug dashboard)

    import re
    iso = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    maret = [r for r in rows if iso.match(r["tanggal"].strip()) and r["tanggal"].strip()[5:7] == "03"]
    dash_total = sum(naive_num(r["total"]) for r in maret)  # kolom salah + tanpa dedup + format gagal
    with open("kpi_dashboard.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["metrik", "nilai_dashboard", "periode"])
        w.writerow(["total_pendapatan", int(dash_total), "2026-03"])
        w.writerow(["jumlah_invoice", len(maret), "2026-03"])
        w.writerow(["rata2_per_invoice", round(dash_total / len(maret), 2) if maret else 0, "2026-03"])

    print(f"tagihan_mentah.csv: {len(rows)} baris ({N_INVOICE} unik + {N_DUPLIKAT} duplikat)")
    print(f"kpi_dashboard.csv: total_pendapatan dashboard = {int(dash_total):,}")

if __name__ == "__main__":
    main()
