# LAPORAN — Proyek Terpandu #4: AML Transaction Monitoring End-to-End
Tanggal: 2026-10-15 · slug `pj-aml-monitoring` · track Fraud/AML

## 1. Struktur (14 langkah, ±300 menit, multi-sesi)
1. briefing — analis AML fintech "DanaKilat"; warisan SentinelAML (4.200 alert/bln, <1% benar); tenggat regulator 90 hari; vendor menawarkan v2 (precision 98%)
2. dataroom — transaksi.csv (5.997) + akun.csv (305); Miskonsepsi #1 (banyak alert = bagus)
3. lab-eda — Lab 1: profil transaksi; temuan kunci: hanya 1 tx ≥ Rp 100 jt dan ia LEGIT
4. lab-rule — Lab 2: rule engine + detector structuring (agregasi pengirim × bucket 7-hari); Miskonsepsi #2 (satu ambang menangkap segalanya)
5. keputusan-ambang — Decision 1: longgar (≥2) vs ketat (≥3)
6. jalan-longgar / jalan-ketat — cabang konsekuensi (goto lab-jaringan)
7. lab-jaringan — Lab 3: fan-in/fan-out berjendela + flow-through ketat + skor risiko; Miskonsepsi #3 (cincin terlihat dari satu akun)
8. lab-evaluasi — Lab 4: precision/recall vs ground truth + aturan dorman; rumus KaTeX
9. keputusan-eskalasi — Decision 2: eskalasi STR MULE01 vs tutup sebagai noise
10. jalan-eskalasi / jalan-tutup — cabang konsekuensi (goto audit-vendor)
11. audit-vendor — dossier "SentinelAML v2": 6 baris, 4 suntikan impostor
12. deliverable — narasi SAR ber-rubrik (4×25)
13. debrief — ground truth dibuka + cermin (angkamu sendiri juga angka lab); Miskonsepsi #4
14. rangkuman — summary 7 poin

## 2. Desain data + ground truth
- 100% sintetis deterministik (`numpy.random.default_rng(42)`), < 1 MB:
  `transaksi.csv` (5.997 baris: tx_id, tanggal, pengirim, penerima, jumlah,
  channel, label) + `akun.csv` (305: akun_id, tipe, tgl_buka, is_dorman,
  saldo_awal) + METODE.md. Periode 90 hari (2026-07-01–2026-09-28).
- Ground truth (`label` = hasil investigasi): 0 normal 5.903 · 1 structuring 9
  (SRC01: 5 tx Rp 95–99 jt hari 21–26; SRC02: 4 tx hari 56–60) ·
  2 layering 10 (FAN01–06 → MULE01 hari 40–41, MULE01 → END01–04 hari 42;
  fan-in 6, fan-out 4, flow-through ketat) · 3 dorman 75 (DOR01–03, 25 tx
  tiap akun hari 71–90; QZD01–09 dorman tapi sepi = negatif benar).
- False positive disengaja: 1 tx normal Rp 120 jt (aturan ambang tunggal
  menangkapnya — dan hanya itu); A0123 dua transfer Rp 92/93,5 jt legit
  (tertangkap varian longgar).

## 3. Hasil harness (ekstrak solusi dari TS → jalankan vs CSV)
- Lab 1 (6 checks): n_baris 5997 · n_akun 305 · n_dorman 12 ·
  pct_transfer 0,5898 · median 515000 · n_ambang100 1 — ALL PASS
- Lab 2 (4 checks): n_rule100 1 · n_ketat 2 (SRC01, SRC02) · n_struct_tx 9 ·
  n_longgar 3 (+A0123) — ALL PASS
- Lab 3 (4 checks): n_kandidat 10 · risk_MULE01 0,50 · n_mule_final 1 ·
  mule_id "MULE01" — ALL PASS
- Lab 4 (9 checks): n_alert 20 · precision_ketat 0,95 · recall_ketat 0,2021 ·
  precision_longgar 0,8636 · n_dorman_flagged 3 · dorman_tx 75 ·
  n_alert_final 95 · precision_final 0,9895 · recall_final 1,0 — ALL PASS
- Total: 23/23 checks PASS, 0 failures (2 run: setelah semua edit).

## 4. Angka jujur rule engine
- Aturan ambang tunggal (≥ Rp 100 jt): 1 alert, 1 FP — buta total terhadap structuring.
- Ketat: 20 alert (TP 19, FP 1) → precision 0,95 / recall 0,2021
  (75 kasus dorman lolos — peta kebutaan, bukan kegagalan).
- Longgar: 22 alert → precision 0,8636 (harga 2 FP A0123), recall sama.
- Final (+aturan dorman): 95 alert (TP 94, FP 1) → precision 0,9895 / recall 1,0.
- Vendor "SentinelAML v2" mengklaim precision 98% — debrief menegaskan:
  angka lab (milik learner MAUPUN vendor) ≠ angka produksi; yang membedakan
  adalah kejujuran sampelnya.

## 5. Impostor (dossier 6 baris, 4 suntikan)
- I1 (baris 1): precision 98% pada sampel ≥ Rp 150 jt — structuring dikecualikan.
- I2 (baris 2): "tidak ada layering" karena pola antar-akun di luar cakupan.
- I3 (baris 3): ambang dinaikkan diam-diam Rp 100 jt → Rp 150 jt "untuk efisiensi".
- I4 (baris 4): recall 100% pada 12 skenario kurasi internal.
- Baris 5–6 (waktu triase 4 mnt, metodologi rule-based) = bersih.

## 6. Verifikasi teknis
- `npx tsc --noEmit`: 0 error baru (repo-wide 0).
- Pola `\${` = 0 · prosa RAW (tanpa entitas HTML) · KaTeX 1 rumus
  (backslash tunggal, String.raw) · tiap langkah punya `tasks` ·
  quiz memakai `correct: true` · `goto` cabang valid.
- Tidak menyentuh registry/route/galeri — wiring di tangan parent.
  Ekspor: `pjAmlMonitoring: V2Lesson` (track "Fraud/AML") +
  `pjAmlMonitoringMeta = { role, client, tagline }`.
