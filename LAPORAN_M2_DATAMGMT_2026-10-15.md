# LAPORAN M2 — Grup DATA-ENGINEERING, Track Data Management

**Tanggal:** 2026-10-15 · **Builder:** subagent M2 Data Management · **Status:** konten + dataset selesai, TER VERIFIKASI mandiri — **TIDAK ADA DEPLOY** (sesuai instruksi).

## Ringkasan

| Misi | Slug | Judul | Langkah | Durasi | XP | Const export |
|------|------|-------|---------|--------|----|--------------|
| A (core) | `misi-katalog-data-hilang` | Misi Katalog: Siapa Pemilik Kolom Ini? | 11 | 120 mnt | 500 | `misiKatalogData` |
| B (edge) | `misi-lineage-terputus` | Misi Lineage: Skema Berubah, Tak Ada yang Tahu | 13 | 150 mnt | 600 | `misiLineageTerputus` |

File konten:
- `src/app/v2/content/misi-katalog-data-hilang.ts` (501 baris)
- `src/app/v2/content/misi-lineage-terputus.ts` (599 baris)
- Keduanya: `track: "Data Management"`, `module: "Misi"`, pola struktur mengikuti `misi-var-backtest.ts` (briefing → dataroom → lab → decision → 3 cabang `goto:"audit"` → auditDossier → deliverable → debrief → rangkuman + `summary[]`).

## Narasi singkat

- **A — Misi Katalog:** data steward di PT Bank Cakrawala Digital (fiktif). Regulator bertanya "kolom `skor_risiko_internal` dipakai untuk keputusan apa, siapa pemiliknya?" — tak ada yang bisa menjawab setelah 3 tahun pipeline tanpa katalog. Pelajar membangun data dictionary + klasifikasi sensitivitas (Lab Python), memetakan lineage duplikat (Lab SQL), memilih strategi 30 hari (decision: mandat penuh / kilat / otomatis), mengaudit "Katalog Sementara v0.1" (4 suntikan), menulis paket katalog + memo regulator (deliverable ber-rubrik).
- **B — Misi Lineage (edge, lebih kotor):** data engineer. Tiket #4812: pendapatan harian turun 55% tanpa error. Tim upstream diam-diam me-rename kolom, mengubah tipe & makna (deploy 03:12–03:15), lalu mengklaim "tidak ada perubahan breaking". Pelajar melakukan diff skema v1→v2 (Lab Python), menemukan baris yatim akibat join pecah (Lab SQL), forensik audit log vs changelog, peta dampak pipeline (Lab Python), memilih respons (decision: data contract / adaptasi / eskalasi paksa), mengaudit klaim upstream (5 suntikan), menulis laporan root-cause + draf data contract v1.

## Dataset (100% SINTETIS — dinyatakan eksplisit di briefing `datasetNote`, METODE.md, dan tiap permukaan)

| Misi | Folder `public/misi/<slug>/` | Ukuran |
|------|------------------------------|--------|
| A | `skema_kolom.csv` (37 kolom × 6 tabel), `lineage.csv` (12 relasi), `audit_log.csv` (8 baris), `METODE.md` | 6.980 byte |
| B | `skema_v1.csv`, `skema_v2.csv`, `changelog.csv` (4 entri — SENGAJA tak mencatat rename), `pipeline.csv` (7 pipeline), `audit_log.csv` (7 baris), `METODE.md` | 4.385 byte |

Keduanya < 5 MB (total < 12 KB). Generator deterministik:
- `build-misi/gen_misi_katalog.py` (seed 42) → dataset A
- `build-misi/gen_misi_lineage.py` (seed 7) → dataset B
- Harness: `build-misi/verify_misi_datamgmt.py` (logika solusi vs CSV), `build-misi/verify_embedded.py` (ekstrak solusi Python/SQL yang TERTANAM di .ts → eksekusi nyata pandas + sqlite3), `build-misi/qa_struktur_misi.py` (QA struktur).

## Hasil verifikasi mandiri

1. **`npx tsc --noEmit`**: 0 error pada kedua file misi. (Catatan: ada 5 error pre-existing di `src/app/v2/content/misi-biaya-inferensi.ts` — file koordinator lain, TIDAK saya sentuh.)
2. **Harness solusi tertanam** (`verify_embedded.py`): SEMUA LOLOS —
   - A/lab-katalog: n_kolom=37, n_rahasia=9, n_terbatas=6, n_tanpa_pemilik=8, n_kritis_tanpa_pemilik=2, n_deprecated_bermasalah=1, n_pasang_duplikat=5
   - A/lab-sql: 5 baris duplikat, kolom & urutan cocok
   - B/lab-diff: n_hilang=2, n_baru=3, n_tipe_berubah=1, n_makna_berubah=1, n_kandidat_rename=2
   - B/lab-dampak: n_terdampak=4, n_select_bintang=1
   - B/lab-sql: 3 baris yatim (004/005/006), total Rp5.500.000, kolom & urutan cocok
3. **`grep -c '\${'`**: 0 pada kedua file .ts (dan 0 di folder dataset).
4. **Ukuran**: 6.980 + 4.385 byte — jauh di bawah 5 MB per misi.
5. **QA struktur** (`qa_struktur_misi.py`): SEMUA LOLOS — langkah naratif 11 (A) / 13 (B); tiap langkah punya `tasks`; langkah 1 = briefing; decision 3 opsi + `nextStepId` + `consequenceNote` (semua nextStepId/goto ter-resolve ke id step yang ada); 3 cabang `goto:"audit"`; dossier 16 baris + 4 (A) / 5 (B) injections; deliverable template 5 poin + rubric 4 kriteria (bobot 100, 3 levels); `summary[]` 5 poin di langkah terakhir; starter mengandung `...`; tanpa entitas HTML; tanpa frasa F1; deklarasi SINTETIS eksplisit.

## Catatan untuk parent / koordinator

1. **Registrasi BELUM dilakukan** — kedua misi belum ditambahkan ke `src/app/v2/lib/reg-misi.ts` (sengaja, menghindari konflik merge antar builder paralel; silakan daftarkan terpusat: `misiKatalogData` → `"misi-katalog-data-hilang"`, `misiLineageTerputus` → `"misi-lineage-terputus"`).
2. **TIDAK ADA DEPLOY** — tidak ada pesan ke Septian, sesuai instruksi.
3. Prosa ditulis RAW (tanpa escape `<>&`), narasi Indonesia + istilah teknis Inggris, miskonsepsi ≥2 per misi, mini-case terintegrasi, KaTeX `String.raw` satu buah (cakupan katalog, Misi A Lab 1).
4. Suntikan impostor A (4): duplikat beda definisi · beda satuan (IDR vs mata uang asal) · kolom kritis tanpa pemilik "diakui lisan" · deprecated yang masih hidup. Suntikan B (5): rename tak tercatat di changelog · nama mirip beda makna · ubah tipe dikecilkan · makna berubah diam-diam · "aman" karena SELECT *.
