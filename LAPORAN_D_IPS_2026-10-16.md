# LAPORAN Gelombang D — Proyek #5: Konstruksi Portofolio Berbasis IPS (gaya CFA)

Tanggal: 2026-10-16 · Slug: `pj-ips-portofolio` · Status: SELESAI & TERVERIFIKASI (belum deploy — deploy wewenang parent)

## Ringkasan
Proyek capstone kelima Learn v2, level advanced (pre-L2/L3 CFA), ±300 menit, 17 langkah.
Kasus: **dr. Ardi Wibowo, 45 thn, pemilik klinik di Makassar** — angka konsisten
dari briefing sampai debrief: PV Rp 8.000 jt, tabungan Rp 250 jt/thn, horizon 15 thn,
target FV Rp 20.000 jt (pensiun 16.000 + pendidikan 2.000 + waris 2.000),
likuiditas Rp 1.100 jt (darurat 300 + ekspansi klinik 800 dalam 18 bulan).

## Struktur 17 langkah
1. Briefing proyek (peran, klien, cerita, 4 objectives, prereq IPS/SAA/Brinson/pajak, datasetNote)
2. Data room (3 file + aturan verifikasi ulang)
3. Lab 1 — Capital market expectations dari dataset (pandas)
4. Lab 2 — Return objective: binary search r*
5. Analisis risiko: ability vs willingness (toleransi = min → MODERAT) + quiz
6. IPS: lima constraints berangka + quiz pajak after-tax
7. Checkpoint keputusan: target minimal 4,24% vs aspirasional 5,24% (bercabang, konsekuensi berbeda)
8. Lab 3 — SAA: 3 kandidat × 4 saringan IPS
9. Rebalancing: threshold ±5pp + kalender Desember + quiz drift
10. Implementasi: pajak, fee ETF vs aktif, slippage + quiz margin rapuh
11. Misi audit: dossier proposal "konsultan" (6 baris, 5 suntikan)
12. Checkpoint keputusan: tolak & dokumentasikan vs revisi bersyarat (konsekuensi berbeda)
13. Lab 4 — Atribusi Brinson Q1 2026 + monitoring + quiz
14. Kasus lanjutan: revisi IPS (beasiswa → FV 18.000; ekspansi dimajukan) + quiz
15. Deliverable: memo IPS ≤ 3 halaman (template 5 paragraf, rubrik 4×25)
16. Debrief: ground truth dibuka + cermin (angka lab ≠ jaminan produksi)
17. Rangkuman (10 butir)

## Desain kasus & angka ground truth (dari harness, seed 42)
- **r\* = 4,2358% riil** — solusi PV(1+r)^15 + PMT·[((1+r)^15−1)/r] = 20.000.
- **CME** (return riil tahunan, statistik sampel eksak): SBN 3,50%/2,00%; deposito
  1,50%/0,80%; pasar uang 2,20%/1,00%; LQ45 7,50%/18,00%; emas 3,00%/15,00%.
- **SAA**: A (45/15/10/25/5) exp 4,045% → GUGUR (return < r*); B (35/10/10/35/10)
  exp 4,52%/vol 6,61% → LOLOS SEMUA; C (20/5/5/55/15) exp 5,46% → GUGUR
  (ekuitas 55% > 40%, likuid 10% < 15%). After-tax B = 4,32% vs r* 4,24%:
  margin 0,08pp — pajak menggerogoti margin keamanan (pelajaran inti).
- **Brinson Q1 2026**: benchmark 2,235%, portofolio 2,500%, excess +0,265% =
  allocation +0,285% + selection +0,040% + interaction −0,060%.
- **Impostor** ("konsultan" PT Wira Nusa Kapital): 85% satu saham, janji 12%.
  5 pelanggaran terukur: I1 konsentrasi 85% vs batas 10% (8,5×); I2 janji 12%
  vs CME 7,50% (cherry-pick 3 thn); I3 likuid Rp 400 jt < kebutuhan Rp 1.100 jt
  (defisit 700 jt); I4 klaim "sudah termasuk pajak" vs catatan "pre-tax";
  I5 stop-loss 10% sebagai pengganti diversifikasi.

## Mekanik impostor
Dossier `auditDossier` (pola proyek AML): 6 baris klaim + 5 suntikan
(key, rowIds, title, clue, danger) — dirender komponen ImpostorAudit yang sama.
Ground truth pelanggaran ditulis eksplisit di METODE.md.

## File yang diubah / ditambah
- BARU `src/app/v2/content/pj-ips-portofolio.ts` (~1.050 baris; meta + 17 langkah)
- BARU `public/proyek/pj-ips-portofolio/return_bulanan.csv` (180 baris),
  `atribusi.csv`, `klien.json`, `METODE.md`
- BARU `scripts/gen_ips_data.py` (generator deterministik) & `scripts/harness_ips.py`
- UBAH `src/app/v2/lib/reg-proyek.ts` (import + EXTRAS + registry)
- UBAH `src/app/v2/proyek/page.tsx` ("5 proyek flagship", "Lima proyek terpandu")
- UBAH `src/app/v2/lib/paths.ts` (capstone jalur Market → pj-ips-portofolio;
  jalur reporting tetap pj-audit-portofolio)
- TIDAK disentuh: proyek #1–#4, rr19, API/database, track lain.

## Hasil verifikasi
- **Harness** `scripts/harness_ips.py`: SEMUA CHECK PASS (41/41 — file & dimensi,
  CME 10/10, r* + FV, klien.json, SAA 21/21, Brinson 8/8).
- **tsc --noEmit**: 0 error.
- **npm run build**: exit 0; `/v2/proyek/pj-ips-portofolio` ter-prerender.
- **Server lokal 3111**: `/v2/proyek/pj-ips-portofolio` → 200 (judul + 17 langkah
  terbaca); `/v2/proyek` → "5 proyek flagship" + 5 kartu; 4 file data → 200;
  stepMeta jalur Market → judul & href benar; reporting tidak berubah.
- **Solusi lab dieksekusi** terhadap CSV asli: semua nilai checks tercapai
  dalam toleransi (Lab 1–4).
- Perbaikan selama kerja: DOC harness 4 konstanta dibetulkan ke 6 desimal;
  `lockLines` Lab 2 diperbaiki (4→3) agar baris `return ...` bisa diisi peserta.

## Kendala / catatan
- Kode lab Python TIDAK dieksekusi di browser pada verifikasi ini (pola proyek
  sebelumnya sama; solusi Python terverifikasi setara via eksekusi langsung).
- Pajak disederhanakan (PPh final per ketentuan saat proyek ditulis) —
  dinyatakan eksplisit di METODE.md sebagai asumsi.
- Optimasi SAA = evaluasi kandidat diskrit (disengaja agar bisa dihitung tangan).
- F1–F6: scan frasa terlarang pada file baru = 0 temuan (cek manual pola F1).
