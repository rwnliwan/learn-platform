# DM3A: Database Relasional & ACID — Penjaga Uang yang Tidak Pernah Tidur

## Masalah: Rp1 Juta yang Menguap
Transfer = debit lalu kredit. Server mati di antaranya → Rp1 juta hilang. Solusi bukan "kode hati-hati", melainkan transaksi ACID.

## 1. Model Relasional
Tabel + **primary key** (identitas unik) + **foreign key** (rujukan) + **constraint** (CHECK/UNIQUE/NOT NULL — pertahanan terakhir). SQL itu deklaratif: bilang "apa", bukan "bagaimana".

## 2. ACID
- **Atomicity**: semua atau batal (rollback).
- **Consistency**: selalu valid (constraint tak dilanggar).
- **Isolation**: transaksi seolah sendirian.
- **Durability**: selamat dari crash (via WAL — write-ahead log).

## 3. Level Isolasi
**Read Committed** (default, cepat) → **Repeatable Read** → **Serializable** (paling aman, paling lambat). Naikkan hanya untuk operasi kritis (transfer, alokasi stok).

## 4. Index (B-tree)
Full scan O(n) → index O(log n): 1 juta baris vs ~20 langkah. Harga: memperlambat tulis. Index untuk kolom WHERE/JOIN yang sering. Selalu cek `EXPLAIN QUERY PLAN` dulu.

## Kesimpulan
1. Ada uang/stok → transaksi ACID, tak bisa ditawar.
2. Query lambat → EXPLAIN dulu, baru index.
3. Isolasi default cukup; Serializable hanya untuk kritis.

**Next:** DM3B — NoSQL, BASE & CAP
