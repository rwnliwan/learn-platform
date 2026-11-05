# LAPORAN M1 — Grup DATA-SAINTEK (3 Misi B "edge")

Koordinator: subagent DATA-SAINTEK · 2026-10-15 · Learn v2, `~/workspace/learn-platform`
Status: konten selesai, uji mandiri PASS, tsc 0 error. **Tidak ada deploy** (menunggu ACC Septian).
Laporan ini = klaim; parent memverifikasi ulang semuanya.

## Ringkasan eksekutif

| # | Slug | Judul | Langkah | estMinutes | XP |
|---|------|-------|---------|------------|----|
| B1 | `misi-audit-imunisasi-who` | Misi Angka Keberhasilan: Audit Klaim Imunisasi & Kematian Balita | 14 | 150 | 600 |
| B2 | `misi-kontaminasi-platform` | Misi Kontaminasi Platform: Kolom yang Bukan dari Sini | 14 | 150 | 600 |
| B3 | `misi-orakel-buta-blockchain` | Misi Orakel Buta: Daftar Sanksi vs Label 'Bersih' | 14 | 150 | 600 |

File yang dibuat (hanya file konten baru + append registry, sesuai batas kode):
- `src/app/v2/content/misi-audit-imunisasi-who.ts`
- `src/app/v2/content/misi-kontaminasi-platform.ts`
- `src/app/v2/content/misi-orakel-buta-blockchain.ts`
- `src/app/v2/lib/reg-misi.ts` — append 3 record (import + entri REG_MISI)
- Dataset beku di `public/misi/<slug>/` (+ `METODE.md` per misi); builder: `misi-data/build_snapshots_m1.py` (seed 42). Semua misi < 5 MB.

Tujuh elemen end-to-end terpenuhi di tiap misi: briefing peran/klien → data room → lab ber-gate (2 Pyodide + 1 SQL, runnable dengan checks) → checkpoint keputusan 3 opsi bercabang (+ langkah konsekuensi, `goto: "audit"`) → audit impostor tak diumumkan (dossier dinilai, 4 injeksi per misi) → deliverable ber-rubrik (gate draf + checklist, bobot = 100) → debrief → rangkuman (`summary`, wajib). Narasi Bahasa Indonesia, istilah teknis Inggris, prosa RAW. F2 self-contained: ringkasan prasyarat 2–3 kalimat di briefing tiap misi.

---

## Misi B1 — Health Data Science

- **Slug:** `misi-audit-imunisasi-who`
- **Judul:** Misi Angka Keberhasilan: Audit Klaim Imunisasi & Kematian Balita
- **Dataset + sumber + lisensi:** WHO Global Health Observatory (GHO) OData API, diunduh 2026-10-15 (terverifikasi reachable dari VM). Indikator: `WHS4_100` (DTP3, estimasi WUENIC), `MCV2` (WUENIC, "by locally recommended age" — jebakan definisi), `MDG_0000000007` (U5MR, estimasi UN-IGME, nasional + kuintil kekayaan WQ1/WQ5). 12 negara (IDN, MYS, THA, PHL, VNM, SGP, IND, BGD, BRA, NGA, KEN, ETH), 2000–2024. File: `who_imunisasi.csv` (1.400 baris, bersih) + `who_imunisasi_audit.csv` (1.401 baris, 3 injeksi). Lisensi: ketentuan WHO — data boleh dipakai untuk keperluan public health dengan atribusi (verbatim di METODE.md).
- **Injeksi audit:** I1 source-swap (DTP3 IDN 2022: WUENIC 91 → klaim laporan program 96), I2 revision-ghost (duplikat IDN 2020 U5MR: 20,81 vs 23,31), I3 fabrikasi (DTP3 IDN 2024 → 97, di luar jangkauan API).
- **Hasil uji lab mandiri (harness `/tmp/harness_m1b.py`, kode solution diekstrak dari file TS, dijalankan terhadap CSV asli):**
  - Lab 1 (Pyodide): `dtp3_idn_2019=85.0`, `dtp3_idn_2021=67.0`, `drop_idn=18.0`, `negara_max_drop='IDN'`, `mcv2_idn_2021=53.0` — PASS (5/5 checks)
  - Lab 2 (Pyodide): `reduksi_pct=65.6`, `rasio_wq=2.35` — PASS (2/2)
  - Lab 3 (SQL): 1 baris konflik (IDN 2020 U5MR dua nilai) — kolom + baris PASS
- **Beda dari pilot `misi-dbd-surveilans` (pernyataan eksplisit):** Pilot = surveilans DBD satu negara dari OpenDengue — sudutnya underreporting kasus, keterlambatan pelaporan, dan rekonstruksi kurva epidemi. Misi B ini KASUS & DATA BERBEDA TOTAL: audit lintas-negara atas klaim "keberhasilan" sebuah LSM di hadapan donor, memakai indikator WHO GHO (bukan OpenDengue). Jebakannya pun beda kelas: (a) WUENIC vs laporan program nasional — dua sumber, dua angka, definisi "keberhasilan" tergantung sumber mana yang dikutip; (b) MCV2 "by locally recommended age" — perbandingan Malaysia vs Indonesia tidak valid karena jadwal usia berbeda (jebakan keterbandingan definisi, bukan kualitas data); (c) interval ketidakpastian U5MR + kesenjangan WQ1/WQ5 — klaim agregat nasional menyembunyikan ketimpangan; (d) revisi data/hantu (duplikat nilai konflik) — masalah versi, bukan missing data. Tidak ada satu pun sudut pilot yang diulang.

## Misi B2 — Bioinformatika

- **Slug:** `misi-kontaminasi-platform`
- **Judul:** Misi Kontaminasi Platform: Kolom yang Bukan dari Sini
- **Dataset + sumber + lisensi:** Bioconductor experiment data `seqc` 1.46.0 (SEQC/MAQC-III) — **lisensi GPL-3**. Slice BERBEDA dari pilot: platform ROC (Roche 454, RefSeq), 3 center (MGP/NYU/SQW) × sampel A (UHRR)/B (HBRR) × 2 replika = 12 sampel; 3.092 gen (top 3.000 varian log1p + 92 ERCC). File: `counts.csv`, `samples.csv`, `ercc_qc.csv` (bersih) + `counts_audit.csv` (14 kolom), `samples_audit.csv` (4 injeksi).
- **Injeksi audit:** I1 label center salah (kolom NYU_B_1_R01 dilabeli MGP), I2 ERCC di-nol-kan (SQW_A_1_R02, prep gagal), I3 kontaminasi lintas platform (kolom ILM A_1_L01_FlowCellA dilabeli ROC — library 677.080), I4 replika palsu (MGP_B_1_R03 = salinan MGP_B_1_R02 + noise 1%, korelasi 0,9966).
- **Hasil uji lab mandiri:**
  - Lab 1 (Pyodide): `max_lib_sample='NYU_B_1_R01'`, `max_lib=139698`, `top_ercc_center='SQW'` — PASS (4/4)
  - Lab 2 (Pyodide): `n_same_center=11`, `odd_sample='MGP_A_1_R01'` — PASS (2/2)
  - Lab 3 (SQL): 2 baris (SQW_B_1_R03 677.080; SQW_A_1_R02 ERCC 0) — kolom + baris PASS
- **Beda dari pilot `misi-lab-sampel-tertukar` (pernyataan eksplisit):** Pilot = platform ILM, 2 situs, sudutnya swap label A/B + kolom duplikat + batch berkualitas rendah (masalah dalam-satu-platform). Misi B ini PLATFORM & SUDUT BERBEDA: platform ROC dari 3 center dengan fokus **batch effect lintas-center** (uji tetangga-terdekat: 11/12 se-center), **ERCC spike-in sebagai ground truth teknis** (fraksi 0 = prep gagal — konsep yang tidak ada di pilot), **kontaminasi lintas-platform** (kolom ILM 677 ribu read dilabeli ROC — terdeteksi via library size), dan **replika palsu** (korelasi 0,9966 = fabrikasi, bukan sekadar duplikat). Keputusan bercabang memakai logika forensik berbeda: prioritas masalah sistemik (chain of custody) > integritas (fabrikasi) > sampel tunggal.

## Misi B3 — Blockchain Data Scientist

- **Slug:** `misi-orakel-buta-blockchain`
- **Judul:** Misi Orakel Buta: Daftar Sanksi vs Label 'Bersih'
- **Dataset + sumber + lisensi:** BitcoinHeist Ransomware Addresses Dataset (UCI ML Repository, **CC BY 4.0**) — 22.738 entitas, 2011–2018, era Locky/Cerber, label keluarga ransomware vs `white`. Oracle: daftar sanksi OFAC (kantor AS, **public domain**), cabang `lists`, pin 2026-10-15 — file `ofac_sanctioned_xbt.txt` berisi 532 alamat XBT, **21 di antaranya cocok** dengan dataset. File: `entitas.csv` (22.738, bersih, kolom `is_sanctioned` jujur) + `entitas_audit.csv` (22.742, 4 injeksi).
- **Temuan jujur dari data beku (bukan sabotase — ini sifat datanya):** ke-21 alamat sanksi berlabel `white` (0 berlabel ransomware); 16 signature perilaku unik milik alamat sanksi, **9 di antaranya dipakai bersama** alamat ransomware (14/21 baris sanksi); signature bersama paling umum `(0,1,0,1)` dipakai 1.729 baris. Simulasi clustering naif ("blokir semua yang signature-nya cocok"): **5.162 alamat diblokir, hanya 21 benar → 5.141 false positive (99,6%)**. Median income baris sanksi: 850.000.000 satoshi.
- **Injeksi audit:** I1 label tamper (7 baris princetonLocky → `white`), I2 income ×10 (12 baris), I3 duplikat hantu (4 alamat, label konflik princetonLocky + white), I4 supresi orakel (2 alamat sanksi `149w62rY42aZBox8fGcmqNsXUzSStKeq8C`, `1G9CKRHA3mx22DoT1QyNYrh85VSQ19Y1em` di-nol-kan di kolom `is_sanctioned`).
- **Hasil uji lab mandiri:**
  - Lab 1 (Pyodide): `n_sanctioned=21`, `n_sanctioned_white=21`, `median_income_san=850000000`, `n_shared_sigs=9` — PASS (4/4)
  - Lab 2 (Pyodide): `n_flagged=5162`, `n_true=21`, `n_fp=5141` — PASS (3/3)
  - Lab 3 (SQL): 4 alamat konflik label — kolom + baris PASS
- **Beda dari pilot `misi-jejak-dana-blockchain` (pernyataan eksplisit):** Pilot = **mengikuti aliran dana** satu kasus ransomware (taint analysis, hop, mixer — sudut "kejar uangnya"). Misi B ini SUDUT BERBEDA TOTAL: **entity clustering & false-positive orakel** — tidak ada pelacakan aliran dana sama sekali. Pertanyaannya: apa yang terjadi saat daftar sanksi (orakel eksternal) disilangkan dengan label dataset (21/21 "white"), dan seberapa berbahayanya kebijakan "blokir yang mirip perilakunya" (5.141 korban). Dimensi ambiguitas yang tidak ada di pilot: **temporal mismatch** (daftar sanksi 2026 dipakai menilai data 2011–2018 — anakronisme), **label dataset sebagai klaim pembuatnya** (bukan kebenaran), dan **supresi orakel** (kolom turunan `is_sanctioned` disabotase — hanya silang ke sumber primer yang selamat).

---

## QA yang dijalankan

1. **Harness lab mandiri** (`/tmp/harness_m1b.py`): mengekstrak blok `solution` dari ketiga file TS (bukan mengetik ulang), menjalankannya dengan pandas terhadap CSV snapshot asli (open_url di-stub ke file lokal), lalu memverifikasi setiap `checks` yang dideklarasikan + expectedRows/expectedColumns SQL via sqlite3. **Hasil: SEMUA PASS** — 6 lab Pyodide (19 checks) + 3 lab SQL (kolom + baris).
2. **tsc --noEmit** pada repo: **0 error**. Menangkap 2 bug nyata saat pengerjaan: (a) bentuk quiz saya (`question/options/correct/why/backups`) tidak cocok dengan tipe `V2QuizItem` (`q` + `options: [{text, why, correct?}]`) — ketiga kuis ditulis ulang ke bentuk yang benar dengan feedback spesifik per opsi (F4); (b) nama ekspor `misiAuditWho` vs aktual `misiAuditImunisasi` di registry.
3. **Koreksi kejujuran data** saat verifikasi: (a) angka eksplorasi awal blockchain (top sig `(0,1,2,0)` n=2.526, "7 signature bersama") TIDAK cocok dengan file beku — diganti angka dari file beku (top overall `(0,1,0,2)` 3.197 baris; 9 signature bersama; naive flagged 5.162); (b) file OFAC publik berisi 532 alamat (20K), bukan "3,9 MB" — prosa + hint lab dikoreksi.

## Catatan untuk parent (verifikasi ulang)

- Klaim pilot "67 OFAC matches" di laporan pilot = 67 BARIS = 21 alamat unik; METODE.md misi ini menyatakan alamat (21 unik) secara presisi — rekonsiliasi bila perlu.
- Kode indikator WHO `u5mr` dan `dptv` me-return 0 baris di GHO (kemungkinan retired) — dipakai `WHS4_100` dan `MDG_0000000007`; tercantum di METODE.md.
- File ROC refseq SEQC hanya berisi sampel A/B (tidak ada campuran C/D) — konsep mixture-ratio diganti desain ERCC/center/platform-contamination; tercantum di METODE.md.
- `~/workspace/learn-platform/LAPORAN_M1_DATA_2026-10-15.md` = file ini. Tidak ada deploy yang dilakukan.
