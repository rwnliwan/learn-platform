# METODE — Misi Dashboard Auditor: Angka yang Bertahan di Depan Auditor (misi-gabung-dashboard-auditor)

- **Status data: 100% SINTETIS.** Seluruh baris di `core_extract.csv` dan
  `mart_risiko.csv` dibuat oleh generator `/tmp/cap4-dash/gen_data.py` (seed tetap
  **42**) — BUKAN data bank nyata, BUKAN dari perusahaan atau nasabah mana pun.
  ID fasilitas, cabang, nominal, dan kolektibilitas semuanya fiktif.
- **Tujuan sintetis:** melatih rekonsiliasi dua sumber (extract core banking vs
  risk data mart) pada data yang *sengaja* diberi 5 pola break — tanpa risiko
  data asli. Dinyatakan SINTETIS di briefing, data room, dan rangkuman misi.
- **Skema:**
  - `core_extract.csv` — 208 baris (200 fasilitas unik + 8 duplikat persis),
    snapshot 2026-09-30. Kolom: `id_fasilitas, cabang, baki_debet (Rp, integer),
    kolektibilitas (1–5 per 30 Sep 2026), kolek_27sep (nilai per 27 Sep 2026),
    tanggal`. Cabang: JKT, SBY, MDN, BPN, MKS (40 fasilitas unik per cabang).
    Kolom `kolek_27sep` = nilai historis yang ditarik tim core atas permintaan
    analis (jejak perubahan 3 hari sebelum cutoff resmi).
  - `mart_risiko.csv` — agregat risk data mart. Kolom:
    `cabang, total_baki, baki_npl, npl_ratio`. Baris: JKT, SBY, MDN, MKS +
    NASIONAL (cabang BPN HILANG — break disengaja).
- **Lima break yang disengaja (kunci jawaban lab):**
  1. Definisi: mart memakai NPL = kolek 4–5 (definisi lama); benar = 3–5.
  2. Cutoff: mart memakai `kolek_27sep` (cutoff 3 hari lebih awal); 12 fasilitas
     berubah kolektibilitas 27→30 Sep.
  3. Cabang: BPN tidak ada di mart (load job gagal diam-diam).
  4. Pembulatan: mart membulatkan `baki_debet` per fasilitas ke jutaan terdekat.
  5. Duplikat: 8 baris duplikat persis di core (mart justru men-dedup dengan benar).
- **Aturan bisnis benar (angka tersertifikasi):** dedup per `id_fasilitas`;
  NPL = kolektibilitas 3, 4, 5; snapshot 30 Sep 2026; lima cabang; presisi penuh.
  Hasil: baki NPL Rp 175.497.631.840 dari total Rp 526.088.713.667 →
  rasio **33,3589%** vs mart **19,1066%** (selisih **14,2523 pp**).
  Dekomposisi sekuensial baki NPL (Rp): definisi 82.105.639.103 +
  cutoff 860.715.710 + cabang 6.355.514.008 + pembulatan −236.981 =
  89.321.631.840 = selisih C0 − mart (identitas terverifikasi oleh generator).
- **Tanggal snapshot:** 2026-10-15. Ukuran total < 50 KB.
- **Batas jujur:** "paket panel dashboard Q2" di dossier audit adalah fiksi yang
  dirancang mengandung 4 suntikan impostor; tidak merepresentasikan laporan
  bank mana pun. Kolektibilitas memakai skala 1–5 generik ala ketentuan
  regulator Indonesia (3 = kurang lancar, 4 = diragukan, 5 = macet).
