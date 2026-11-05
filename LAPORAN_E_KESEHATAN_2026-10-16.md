# LAPORAN GELOMBANG E — Klaster Kesehatan (2026-10-16)

Dua proyek flagship baru: `pj-dbd-surveilans` (capstone Health Data Science)
dan `pj-vcf-varian` (capstone Bioinformatika). Masing-masing 16 langkah,
±300 menit, level advanced. TIDAK DEPLOY — menunggu verifikasi parent + deploy.

## E1 — pj-dbd-surveilans: "Surveilans & Peringatan Dini DBD"

**File konten**: `src/app/v2/content/pj-dbd-surveilans.ts` (~1.150 baris).
**Data**: `public/proyek/pj-dbd-surveilans/` — kasus_dbd.csv (780),
cuaca.csv (130), laporan_puskesmas.csv (780, kotor disengaja),
fitur_vendor.csv (129), METODE.md. Generator: `scripts/gen_dbd_data.py`
(seed 42). Harness: `scripts/harness_dbd.py` — **25/25 PASS**.

**Alur 16 langkah**: briefing (analis surveilans Dinkes Makassar) → data room
→ Lab 1 pembersihan & rekonsiliasi → deskriptif musiman → konsep lag →
Lab 2 korelasi silang → decision ambang (100 vs 150) → Lab 3 aturan peringatan
→ operasionalisasi SOP 0–7 minggu → dossier vendor (auditDossier, 5 injeksi)
→ Lab 4 bongkar leakage → decision vendor → monitoring → deliverable
(protokol peringatan dini) → debrief → rangkuman.

**Ground truth** (harness; SEMUA PASS):
- Aturan "hujan[w] > 100 mm" → 5 peringatan (minggu 27, 67, 89, 108, 115);
  TP=4 (onset 34, 74, 96, 122), FP=1 (event 108 — false alarm disengaja);
  **precision 0,80, recall 1,00, lead time 7 minggu**.
- Puncak korelasi silang hujan→kasus di **lag 7** (r=0,63, dominan >2× lag lain).
- Pembersihan: 12 duplikat, minggu 55–56 hilang (dicatat, tidak ditambal),
  6 salah eja "Panakukang"; selisih total vs sumber kebenaran = 0.
- Kecamatan tertinggi: Panakkukang (2.659); puncak kota minggu 74 (473 kasus).
- Vendor "NusaHealth Analytics": akurasi **95,35% (bocor) vs 78,29% (jujur)**,
  gap 17,1pp. Fitur bocor: `rawat_inap` = 0,85 × kasus minggu berjalan.
- 5 pelanggaran vendor: (I1) leakage rawat_inap; (I2) akurasi runtuh 17,1pp;
  (I3) CV acak pada data temporal; (I4) evaluasi in-sample; (I5) lead time
  1 minggu tak operasional (vs 7 minggu aturan jujur).
- Decision ambang: 150 mm → 3 peringatan, precision 0,67, recall 0,50
  (onset 34 & 96 terlewat) — kontras terukur vs 100 mm.

## E2 — pj-vcf-varian: "Pipeline VCF ke Laporan Varian"

**File konten**: `src/app/v2/content/pj-vcf-varian.ts` (~1.100 baris).
**Data**: `public/proyek/pj-vcf-varian/` — proband.vcf (400 varian),
anotasi_referensi.csv (400, kunci jawaban), laporan_vendor.csv,
jarak_genetik.csv (6×6). Generator: `scripts/gen_vcf_data.py` (seed 2026).
Harness: `scripts/harness_vcf.py` — **23/23 PASS**.

**Alur 16 langkah**: briefing (analis bioinformatika RS) → data room →
Lab 1 QC → konsep anotasi → Lab 2 filter & anotasi → Lab 3 klasifikasi →
decision VUS (var_0159 BRCA1: lapor vs tahan) → Lab 4 UPGMA →
dossier vendor (5 injeksi) → Lab 5 audit → decision vendor →
laporan klinis → deliverable → keterbatasan → debrief → rangkuman.

**Ground truth** (harness; SEMUA PASS):
- QC (DP≥20, QUAL≥30, FILTER=PASS): **lolos 375, gagal 25**; 3 patogenik lolos QC.
- Kandidat (AF<0,01 & CSQ relevan): **11 = 3 Patogenik + 8 VUS**.
- Patogenik: var_0042 (G6PD, stop_gained, AF 0,0001), var_0177 (HBB,
  frameshift_variant, AF 0,0004), var_0331 (CFTR, splice_donor_variant,
  AF 0,0002).
- Aturan klasifikasi sederhana cocok **11/11** dengan referensi.
- Vendor "GenoSure Lab": **FP=2** (var_0108: synonymous AF 35,25%;
  var_0256: upstream AF 13,43%) + **FN=1** (var_0177 dilewatkan sebagai VUS).
- 5 pelanggaran vendor: (I1–I2) 2 FP berpola (cacat sistematis: tanpa filter
  frekuensi); (I3) 1 FN termahal; (I4) "akurasi 99%" tanpa denominator;
  (I5) tanpa jejak QC.
- UPGMA: merge pertama **S2+S5 (0,008)**; tetangga terdekat S1_proband = **S3**.

## Integrasi (aditif)
- `reg-proyek.ts`: 2 proyek terdaftar (+ EXTRAS skills/deliverable) →
  galeri `/v2/proyek` = **7 proyek flagship** (4 pj lama + 2 baru + rr19).
- TIDAK mengubah: paths.ts, proyek #1–#5, rr19, API, database, registry lesson
  (607 lesson tetap), cardData.json (review = lesson-only, tak terdampak).

## Verifikasi yang dilakukan
- Harness: DBD 25/25 PASS, VCF 23/23 PASS (file/dimensi, ground truth,
  solusi lab).
- 9 solusi lab dieksekusi dengan pandas terhadap data asli: semua nilai
  checks tercapai (4 lab DBD + 5 lab VCF).
- `npx tsc --noEmit`: 0 error.
- `npm run build`: exit 0; kedua route ter-prerender
  (pj-dbd-surveilans.html, pj-vcf-varian.html).
- Server lokal 3111: kedua halaman proyek 200 (+ judul terbaca), galeri
  memuat 7 proyek, 4 file data + 2 METODE.md = 200.
- Scan F1: 0 temuan. Scan F2: 0 temuan (rujukan internal hanya di dalam
  proyek yang sama, selalu disertai angka di tempat; prasyarat = recap di
  briefing).

## Caveat jujur
- Solusi lab dieksekusi dengan pandas di VM (logika identik dengan solusi
  konten); eksekusi Pyodide di browser tidak diuji di sini (pola sama
  seperti proyek #1–#5 — verifikasi browser menjadi bagian verifikasi parent).
- Aturan "hujan > 100 mm" dan klasifikasi varian adalah ilustrasi yang
  disengaja sederhana — dinyatakan eksplisit di METODE.md dan konten
  (bukan alat operasional/diagnostik nyata).
- Nomor seed berbeda antar proyek (DBD: 42, VCF: 2026) — keduanya
  deterministik; tidak ada implikasi silang.
- Selama pengerjaan ditemukan & diperbaiki: (1) bug UPGMA di generator VCF
  (jarak pasangan ter-merge tidak di-pop → infinite loop semu; fix 1 baris);
  (2) shadowing variabel `fn` di harness VCF; (3) indeks typo DBD menabrak
  indeks duplikat (fix: indeks disjoint + hanya baris Panakkukang).
