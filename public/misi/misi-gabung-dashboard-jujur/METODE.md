# METODE — misi-gabung-dashboard-jujur

**Status data: 100% SINTETIS.** Seluruh file di folder ini dibuat oleh generator
buatan (`cap6_gen.py`, seed acak **42**) khusus untuk misi pembelajaran ini.
Tidak ada satu baris pun yang berasal dari perusahaan, pelanggan, atau
pengguna nyata. Nama channel, angka belanja, dan perilaku pengguna adalah
fiksi yang dirancang agar tiga jebakan definisi metrik muncul secara alami.

## File

| File | Baris | Kolom |
|---|---|---|
| `spend_harian.csv` | 276 | tanggal, channel, spend_iklan_jt, fee_agensi_jt, spend_aktual_jt |
| `event_marketing.csv` | 920 | tanggal, user_id, channel_terakhir, hari_sejak_sentuhan, nilai_beli_jt |
| `aktivitas_user.csv` | 30.638 | user_id, tanggal, tipe, is_bot |
| `definisi_metrik.csv` | 6 | metrik, tim, definisi, jendela_hari, pembilang, penyebut |

Periode: kuartal Q3 2026 (2026-07-01 s.d. 2026-09-30; 92 hari).
`aktivitas_user.csv` hanya mencakup September 2026.

## Cara data dibuat (seed 42)

1. **Belanja harian** per channel = basis harian (search Rp 8 jt, social Rp 6 jt,
   email Rp 1,5 jt) × noise uniform 0,85–1,18. `fee_agensi_jt` = 15% dari
   `spend_iklan_jt` (biaya yang disembunyikan dari laporan tim marketing).
2. **Pembelian**: 920 transaksi (search 380, social 420, email 120).
   `hari_sejak_sentuhan` ditarik dari distribusi per channel — search cenderung
   pendek (70% dalam 1–7 hari), social berekor panjang (60% dalam 8–30 hari) —
   sehingga **pemenang atribusi berubah** saat jendela diganti 7 → 30 hari.
   `nilai_beli_jt` uniform Rp 0,3–1,2 jt. ±12% transaksi adalah pembelian ulang
   (bukan pelanggan baru).
3. **Aktivitas**: 3.200 pengguna nyata, 2.400 di antaranya aktif (login) pada
   September; 450 akun **bot** yang hanya membangkitkan pageview (18–28 baris
   per bot, `is_bot=1`, tanpa login, tanpa pembelian).
4. **Definisi metrik**: 6 baris versi Tim Growth vs Tim Finance/Product/Brand —
   tiga metrik (CAC, active user, atribusi konversi), masing-masing dua definisi
   yang berbeda.

## Angka kunci (dihitung dari data, bukan asumsi)

- CAC versi marketing: Rp 1.800.685 vs CAC versi finance (termasuk fee agensi):
  Rp 2.070.785 → selisih **15,0%**.
- Atribusi last-touch: jendela 7 hari → **search** menang (Rp 200,65 jt);
  jendela 30 hari → **social** menang (Rp 313,09 jt).
- MAU September versi Tim Growth: 3.153 vs versi kamus (login non-bot): 2.400;
  porsi bot **14,27%**.

## Lisensi

Data sintetis ini dilepas di bawah **CC0 1.0 Universal** (public domain) —
bebas dipakai, diubah, dan disebarluaskan tanpa atribusi.
