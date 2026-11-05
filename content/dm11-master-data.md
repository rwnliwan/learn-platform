# DM11: Master Data & Golden Record — Satu Kebenaran untuk Tiap Entitas

## Masalah: Tiga Budi Santoso
"Budi Santoso", "B. Santoso", "Budi Santosa" — 2 orang sama, 1 beda. Auto-merge buta = bencana privasi; tak merge = duplikat selamanya.

## 1. Master vs Reference vs Transaksional
**Master**: entitas inti lintas sistem (nasabah). **Reference**: daftar baku (kode negara). **Transaksional**: kejadian. Master/reference butuh tata kelola khusus.

## 2. Entity Resolution
**Deterministic** (ID sama → pasti), **probabilistic** (skor + blocking agar tak O(n²)), **manual review** (zona abu-abu). Aturan emas: false merge >> false duplicate — saat ragu, JANGAN merge.

## 3. Golden Record & Survivorship
Satu kebenaran per entitas via aturan survivorship per kolom: otoritas sumber dulu (core banking untuk nama legal), kebaruan sebagai tie-breaker. Wajib simpan jejak (sumber + tanggal + aturan) — agar bisa diaudit & di-unmerge.

## 4. Gaya MDM
Registry (ringan, mulai di sini) → coexistence → centralized (mahal, untuk regulasi ketat). 70% kegagalan MDM = organisasi, bukan teknologi.

## Kesimpulan
1. Saat ragu, jangan merge.
2. Golden record wajib berjejak.
3. Mulai registry 1 domain.

**Next:** DM12 — Keamanan & Privasi
