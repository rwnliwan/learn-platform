# LAPORAN M2 — Grup DATA-ENGINEERING, Track Business Intelligence
**Tanggal:** 2026-10-15 · **Builder:** subagent 4e3f20f4 (grup DATA-ENGINEERING) · **Status:** SELESAI, terverifikasi mandiri · **TIDAK ADA DEPLOY**

## Ringkasan
Dua misi Business Intelligence selesai dibangun, didaftarkan di `REG_MISI`, dan lolos seluruh verifikasi mandiri (tsc, harness Python/SQL yang diekstrak langsung dari file TS, cek struktur, grep pola, ukuran dataset).

| # | Slug | Judul | Langkah | Durasi | XP | Const export |
|---|------|-------|---------|--------|----|--------------|
| A (core) | `misi-dashboard-regulator` | Misi Dashboard: Angka yang Bisa Dipertahankan | 12 | 135 mnt | 500 | `misiDashboardRegulator` |
| B (edge) | `misi-dua-definisi-revenue` | Misi Metrik: Dua Definisi, Satu Kebohongan | 13 | 150 mnt | 600 | `misiDuaDefinisi` |

Keduanya: `track: "Business Intelligence"`, `module: "Misi"`, pola 7 elemen terkunci (briefing → data room → lab ber-gate → checkpoint keputusan bercabang → audit dossier impostor → deliverable ber-rubrik → debrief), prosa RAW, F1–F6 dipatuhi.

## Misi A — misi-dashboard-regulator (core, 12 langkah)
Peran: analis BI membangun dashboard kepatuhan untuk regulator dari data transaksi mentah. Narasi: regulator akan bertanya "dari mana angka ini?" — setiap metrik harus bisa ditelusuri ke baris sumber.
- **Lab 1 (Python):** terapkan definisi v1 dari kamus — `n_valid=1458`, `n_user_aktif_jan=288`, `total_nominal_valid=320815338`, per bulan 512/477/469; agregasi berlapis dua jalur → `selisih_dua_jalur=0` (11 checks).
- **Lab 2 (SQL):** rekonsiliasi panel dari tabel harian → `2026-01 | 38174504 | 166 | 10`.
- **Decision:** angka lama 394 (definisi pra-v1) vs hitungan v1 → 3 opsi (pertahankan / perbaiki diam-diam / perbaiki+dokumentasikan), 3 cabang `goto: "audit"`.
- **Audit dossier (14 baris, 3 injections):** `definisi-berubah` (Pengguna aktif 394 vs 288, baris 2+4), `filter-tanggal` (15 Jan–15 Mar vs kuartal penuh, baris 6), `angka-manual` (Rp 41,25 M input manual vs Rp 320,8 jt baris sumber, baris 9+10).
- **Deliverable:** nota metodologi + tabel rekonsiliasi (template 5 poin, rubrik 4 kriteria @25).

## Misi B — misi-dua-definisi-revenue (edge, 13 langkah)
Finance = revenue kas masuk, Product = revenue pengakuan; dashboard memakai keduanya bergantian hingga tren "naik terus". Pelajar mengaudit dan menetapkan single source of truth.
- **Lab 1 (SQL):** rekonsiliasi bulanan kas vs diakui → selisih +8,2 jt (Jan) s.d. −8,2 jt (Apr): pola waktu pengakuan.
- **Lab 2 (Python):** kas Q2 **−54,57%** vs diakui Q2 **+24,47%** — "naik terus" hanya mungkin dengan definisi bergantian.
- **Lab 3 (Python):** klaim +81,8% hanya hidup di bawah definisi kas + baseline Q4 terlemah (diakui: +11,11%).
- **Decision:** menangkan Finance / menangkan Product / dua metrik berlabel jujur — 3 cabang `goto: "audit"`.
- **Audit dossier (14 baris, 3 injections):** `sumbu-dipotong` (+38% vs +24,47%, sumbu Y dari 80%), `cherry-pick` (+81,8% vs Q4-2025 kuartal terlemah), `segmen-dibuang` (Enterprise-Kecil −18,4% dikeluarkan sebagai "outlier" tanpa kriteria).
- Fakta kunci: total H1 kedua definisi SAMA (Rp 70.583.277) — selisih murni waktu pengakuan.

## Dataset — 100% SINTETIS (dinyatakan di briefing datasetNote, METODE.md, rangkuman)
- Generator: `build-misi/misi-dashboard-regulator/gen.py` dan `build-misi/misi-dua-definisi-revenue/gen.py`, seed tetap **42**, deterministik (md5 identik saat dijalankan ulang).
- `public/misi/misi-dashboard-regulator/` (100K): `transaksi.csv` (1.871 baris), `definisi_metrik.csv` (M1–M4 v1), `METODE.md`.
- `public/misi/misi-dua-definisi-revenue/` (24K): `kas_masuk.csv` (140 order), `pengakuan.csv` (317 baris), `definisi_metrik.csv` (D1/D2), `METODE.md`.
- Keduanya < 5MB. METODE.md: deklarasi SINTETIS, seed, metode sampling, skema kolom, catatan jujur, batas.

## Hasil verifikasi mandiri
1. **tsc:** `npx tsc --noEmit` → **0 error** pada `misi-dashboard-regulator.ts`, `misi-dua-definisi-revenue.ts`, `reg-misi.ts`. (Satu-satunya error di repo ada di `src/app/v2/content/misi-biaya-inferensi.ts` — file WIP koordinator grup lain, TIDAK terdaftar di reg-misi, bukan karya saya.)
2. **Harness** (`build-misi/verify_m2_bi.py` — mengekstrak `solution`/`sqlLab` langsung dari file TS, menjalankannya, mencocokkan dengan checks): **SEMUA PASS** —
   - A: 10/10 checks Python + kolom & 1 baris SQL cocok;
   - B: 6/6 checks Lab tren + 4/4 checks Lab QoQ + kolom & 6 baris SQL cocok;
   - struktur: 12/13 langkah, id unik, tasks 12/12 & 13/13, summary[] ada, 3 opsi decision → step valid, 3 cabang `goto:"audit"`, dossier 14 baris, 3 injections, template 5 poin, rubrik 4 kriteria bobot 100.
3. **grep:** `grep -c '\${'` = **0** pada kedua file.
4. **Ukuran:** 100K + 24K, jauh di bawah 5MB.

## File yang diubah/dibuat
- `src/app/v2/content/misi-dashboard-regulator.ts` (baru, export `misiDashboardRegulator` + default)
- `src/app/v2/content/misi-dua-definisi-revenue.ts` (baru, export `misiDuaDefinisi` + default)
- `src/app/v2/lib/reg-misi.ts` (tambah 2 import + 2 entri)
- `scripts/gate_panel.py` (tambah 2 slug ke daftar MISI)
- `public/misi/misi-dashboard-regulator/` + `public/misi/misi-dua-definisi-revenue/` (dataset + METODE.md)
- `build-misi/misi-dashboard-regulator/gen.py`, `build-misi/misi-dua-definisi-revenue/gen.py` (generator seed 42)
- `build-misi/harness_py.py`, `build-misi/verify_m2_bi.py` (harness verifikasi, bisa dipakai ulang)

## Catatan untuk parent
- Tidak ada deploy dilakukan (sesuai instruksi).
- E2E browser / gate_panel run penuh belum dijalankan di sini (butuh server lokal + Playwright) — diserahkan ke gerbang parent.
- Perhatian: `misi-biaya-inferensi.ts` (grup lain) saat ini syntax-error dan belum terdaftar; tidak mengganggu file saya.
