# METODE — Proyek E1: Surveilans & Peringatan Dini DBD

Data 100% SINTETIS untuk proyek ini (generator: `scripts/gen_dbd_data.py`,
`numpy.random.default_rng(42)` — deterministik). BUKAN data surveilans nyata
Dinkes; kecamatan memakai nama asli wilayah Makassar sebagai setting geografis,
tetapi seluruh angka kasus dan cuaca adalah fiktif. Parameter diset menyerupai
orde-besaran musiman DBD (puncak musim hujan) tetapi BUKAN klaim epidemiologis.
Lisensi: data sintetis orisinal untuk proyek ini.

## File
- `kasus_dbd.csv` — 780 baris (130 minggu × 6 kecamatan), kolom:
  `minggu (1–130), kecamatan, kasus` (kasus mingguan, integer).
- `cuaca.csv` — 130 baris, kolom:
  `minggu, curah_hujan_mm, suhu_c, kelembapan_pct` (mingguan).
- `laporan_puskesmas.csv` — 780 baris, kolom: `minggu, kecamatan, kasus_lapor`.
  Sumber ketiga yang KOTOR disengaja: 12 baris duplikat persis, minggu 55–56
  hilang total (12 baris), 6 baris salah eja ("Panakukang"). Setelah dibersihkan
  (dedupe + betulkan ejaan), nilainya identik dengan `kasus_dbd.csv` (selisih 0).
- `fitur_vendor.csv` — 129 baris, kolom:
  `minggu, hujan_mm, kasus_total, suhu_c, rawat_inap`. Kolom `rawat_inap`
  = 0,85 × kasus minggu berjalan + noise — proksi target yang bocor (leakage),
  dipakai Lab 4 untuk membongkar klaim vendor.

## Metode generasi
Curah hujan mingguan: basis musiman (musim hujan 35±15 mm, kemarau 8±6 mm) +
5 event hujan ekstrem (+130 mm) di minggu 27, 67, 89, 108, 115.
Kasus per kecamatan: endemik (basis 7–14/minggu) × respons terhadap hujan
7 minggu sebelumnya + impuls wabah 6 minggu (meluruh ×0,75) + noise integer.
Empat event (27, 67, 89, 115) memicu wabah dengan onset di minggu
event+7 = 34, 74, 96, 122. Event minggu 108 TIDAK memicu wabah (false alarm
yang disengaja — narasi: intervensi fogging cepat Dinkes memutus rantai).

## Ground truth (dari harness, seed 42)
1. **Aturan peringatan jujur** — "peringatan di minggu w bila curah_hujan[w]
   > 100 mm": tepat 5 peringatan (minggu 27, 67, 89, 108, 115).
   TP = 4 (onset 34, 74, 96, 122 tertangkap, lead time 7 minggu),
   FP = 1 (event 108). **Precision = 0,80; recall = 1,00.**
   Hujan maksimum di luar event = 67,1 mm (< 100: aturan bersih, tak ada
   pemicu liar).
2. **Korelasi silang hujan→kasus**: puncak di **lag 7 minggu** (r = 0,63 —
   dominan, >2× lag lain). Rantai biologis: hujan → genangan → telur →
   jentik → nyamuk dewasa → gigitan → masa inkubasi → kasus tercatat.
3. **Kecamatan tertinggi**: Panakkukang (2.659 kasus / 130 minggu),
   diikuti Biringkanaya (2.270). Puncak kota: minggu 74 (473 kasus).
4. **Model vendor**: akurasi 95,35% DENGAN fitur `rawat_inap` (bocor) vs
   78,29% TANPA fitur bocor — gap 17,1pp. Target: wabah minggu depan
   (total kasus > 130). Klaim vendor "akurasi 95%" = angka DENGAN leakage.
5. **Pelanggaran vendor impostor** (ground truth eksplisit): (I1) fitur
   `rawat_inap` minggu berjalan = proksi kasus minggu berjalan (leakage —
   tersedia hanya setelah kasus tercatat); (I2) akurasi runtuh 95,35% →
   78,29% saat fitur bocor dibuang; (I3) validasi "acak" tanpa split
   temporal — deret waktu yang diacak membocorkan masa depan ke masa lalu;
   (I4) "95%" dihitung in-sample tanpa evaluasi out-of-sample yang jujur;
   (I5) lead time 1 minggu tidak memberi waktu intervensi (fogging butuh
   2–3 minggu persiapan) — 7 minggu adalah nilai operasionalnya.
