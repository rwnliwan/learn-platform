# LAPORAN G1 — 3 Lesson Bioinformatika (BI21–BI23)
**Tanggal:** 15 Oktober 2026 · **Track:** Bioinformatika · **Platform:** Learn v2

Tiga lesson dibangun, didaftarkan di `src/app/v2/lib/reg-bi.ts`, dan lolos seluruh gerbang verifikasi.
File lesson: `src/app/v2/content/bi21-cancer-genomics.ts`, `bi22-spatial-transcriptomics.ts`, `bi23-pharmacogenomics.ts`.

---

## BI21 · Cancer Genomics: Jejak Mutasi & Tanda Tangan Kanker
- **Slug:** `bi21-cancer-genomics` · **File:** `src/app/v2/content/bi21-cancer-genomics.ts` · **Export:** `bi21`
- **Langkah (10):** cerita → tujuan → jejak (konsep signature) → galeri (8 signature) → lab-tanda → driver → lab-driver → peta → kasus → checkpoint
- **Estimasi:** 55,9 mnt → `estMinutes: 56`
  - Rincian: 3033 kata / 180 = 16,9 + lab 2×8 = 16 + kuis 5×2 = 10 + chart 2×2,5 = 5 + case 1×6 = 6 + rumus 2×1 = 2 → **55,9**
- **Harness (Pyodide headless via node, solusi dijalankan sungguhan):** ALL CHECKS PASS
  - Lab 1 (kosinus): `SBS7a-like (UV): 0.970` teratas, `SBS1-like: 0.355`, `SBS4-like: 0.234`, `dominan: SBS7a-like (UV)` — 2/2 PASS
  - Lab 2 (Fisher): `TP53 : p = 5.58e-16 -> DRIVER`, `OR2J3: p = 1.09e-01 -> penumpang` — 2/2 PASS
- **Komponen:** 5 kuis (1 correct flag tiap soal ✓), 3 mitos 🚨, 3 tips 💡, 2 lab, 2 echart (profil 6-kelas; frekuensi gen + jebakan TTN), 2 rumus KaTeX (dekomposisi, TMB), peta keputusan 5 skenario + aturan 10 detik, mini-case Senkin 962 WGS
- **summary:** 1 (6 butir) ✓ · **tsc:** 0 error ✓ · **F1:** 0 ✓
- **Prasyarat BI8/BI10:** diringkas 3 kalimat di langkah cerita (variant calling tumor-vs-normal; koreksi multiple testing) — tanpa rantai rusak

## BI22 · Spatial Transcriptomics: Di Mana Gen Bicara
- **Slug:** `bi22-spatial-transcriptomics` · **File:** `src/app/v2/content/bi22-spatial-transcriptomics.ts` · **Export:** `bi22`
- **Langkah (9):** cerita → tujuan → teknologi → analisis → lab-spasial → lab-dekonvolusi → peta → kasus → checkpoint
- **Estimasi:** 50,6 mnt → `estMinutes: 51`
  - Rincian: 2274 kata / 180 = 12,6 + lab 2×8 = 16 + kuis 5×2 = 10 + chart 2×2,5 = 5 + case 1×6 = 6 + rumus 1×1 = 1 → **50,6**
- **Harness:** ALL CHECKS PASS
  - Lab 1 (Moran's I): `GenA (hotspot): I = +0.780`, `GenB (acak)   : I = -0.067` — 2/2 PASS
  - Lab 2 (dekonvolusi): `proporsi tumor: 0.60, imun: 0.40`, `residual 0.00` — 2/2 PASS
- **Komponen:** 5 kuis ✓, 2 mitos 🚨, 2 tips 💡, 2 lab, 2 echart (skala platform log; heatmap 15×15), 1 rumus KaTeX (Moran's I), peta keputusan 5 skenario, mini-case excluded-vs-inflamed (OR ≈ 0,12)
- **summary:** 1 (6 butir) ✓ · **tsc:** 0 error ✓ · **F1:** 0 ✓
- **Beda vs BI11:** BI11 = sensus sel tanpa alamat (QC, clustering, marker); BI22 = teknologi spasial + analisis niche/ligand-reseptor + dekonvolusi — tidak mengulang clustering single-cell

## BI23 · Pharmacogenomics: Resep Obat dari DNA
- **Slug:** `bi23-pharmacogenomics` · **File:** `src/app/v2/content/bi23-pharmacogenomics.ts` · **Export:** `bi23`
- **Langkah (10):** cerita → tujuan → star → cpic → lab-pharmcat → lab-skor → batas → peta → kasus → checkpoint
- **Estimasi:** 52,5 mnt → `estMinutes: 53`
  - Rincian: 2603 kata / 180 = 14,5 + lab 2×8 = 16 + kuis 5×2 = 10 + chart 2×2,5 = 5 + case 1×6 = 6 + rumus 1×1 = 1 → **52,5**
- **Harness:** ALL CHECKS PASS
  - Lab 1 (Named Allele Matcher): `P1: *1/*1 -> Normal`, `P2: *1/*2 -> Intermediate -> HINDARI klopidogrel`, `P3: *2/*2 -> Poor -> HINDARI klopidogrel` — 3/3 PASS
  - Lab 2 (activity score): `A *1/*4: AS = 1.0 -> Intermediate`, `B *4/*4: AS = 0.0 -> Poor`, `C *1/*1xN: AS = 3.0 -> Ultrarapid` — 3/3 PASS
- **Komponen:** 5 kuis ✓, 2 mitos 🚨, 3 tips 💡, 2 lab, 2 echart (guideline per gen dari data cpicpgx.org; pohon keputusan CYP2C19), 1 rumus KaTeX (activity score), peta keputusan 4 skenario, mini-case panel pre-emptif
- **summary:** 1 (6 butir) ✓ · **tsc:** 0 error ✓ · **F1:** 0 ✓
- **Batas vs HD12:** ditegaskan di langkah `batas` — CPIC = aturan deterministik berbasis bukti, bukan model ML; HD12 = validasi model prediktif
- **Prasyarat BI8/BI12:** diringkas di cerita (variant calling → genotipe; frekuensi alel antar-populasi)

---

## Sumber yang benar-benar dibuka + klaim yang dipakai

**BI21**
- https://www.nature.com/articles/s41588-024-01848-x (News & Views Fletcher, Nat Genet 56, 1327, 2024 — atas Senkin dkk., Nature 629, 910–918): WGS 962 clear cell renal carcinoma, 11 negara; SBS22 (asam aristolokat) menonjol di Rumania & Serbia; SBS12 etiologi unknown hampir eksklusif Jepang; SBS40 dipecah 3 komponen, SBS40b berkorelasi insidens; hanya merokok (bukan obesitas/hipertensi) berasosiasi dengan signature dikenal
- https://preview-www.nature.com/subjects/cancer-genomics/nature: signature tak-berpenyebab di ~70% kasus Jepang (koroborasi SBS12)
- https://cancer.sanger.ac.uk/signatures/: v3.6 rilis terkini (Mei 2026); riwayat versi (v3.3 = COSMIC v95, Mei 2022); 96 konteks; 78 tipe mutasi DBS
- https://cancer.sanger.ac.uk/signatures/sbs/: 6 kelas substitusi pirimidin, 96 konteks trinukleotida
- https://cran.mi2.ai/web/packages/cosmicsig/cosmicsig.pdf (paket R Rozen Lab): v3.3 = Juni 2022; v3.2 = 72 SBS (6 baru: SBS10c/d, SBS91–94)
- https://static-content.springer.com/esm/art%3A10.1038%2Fs41588-025-02196-0/MediaObjects/41588_2025_2196_MOESM1_ESM.pdf (suplemen Nature Genetics): sumbu-x berlabel "COSMIC (v3.3) catalog" memuat 79 ID termasuk SBS95 → 78 untuk v3.3 (lihat catatan di bawah)
- https://en.wikipedia.org/wiki/Mutational_signatures: etiologi SBS1 (deaminasi 5-metilsitosin, clock-like), SBS2/13 (APOBEC), SBS6/15/20/26 (MMR), SBS10 (POLE), SBS7 (UV), SBS11 (temozolomide), SBS3 (BRCA1/2, HRD)
- https://www.mdpi.com/2072-6694/16/17/2956 (review CRC): SBS40 → SBS40a/b/c di v3.4; TP53/APC/KRAS/BRAF/ATM mencakup 97,55% populasi TCGA; SBS18 = ROS

**BI22**
- https://dna.uga.edu/visium-spatial-genomics/: Visium 6,5×6,5 mm, ~5.000 spot, 55 µm (XL 11×11 mm ~14.000 spot); 1–10 sel per spot
- https://www.genengnews.com/topics/omics/as-10x-launches-visium-hd-will-single-cell-resolution-draw-new-customers/: Visium HD — 11 juta fitur grid 2 µm vs 5.000 spot 55 µm; FFPE; seluruh transkriptom skala sel
- https://www.qub.ac.uk/sites/core-technology-units/GenomicsCytometry/Genomics/Services/SingleCellandSpatialTranscriptomics/: Xenium 100–5.000 gen, resolusi subselular
- http://hillmanresearch.upmc.edu/research/shared-resources/translational-oncologic-pathology/services/spatial-transcriptomics/10x-genomics-xenium: Xenium hingga 5.000 gen + protein multipleks, panel predesain human/mouse
- https://pages.10xgenomics.com/... (landing Xenium): hingga 5.000 gen resolusi subselular
- https://www.10xgenomics.com/support/software/xenium-panel-designer/latest/analysis/panel-part-numbers/protein-subpanel-parts: subpanel protein Xenium (CD4, CD8A, PD-1, PD-L1, Ki-67, …)
- https://cdn.10xgenomics.com/image/upload/.../CG000601_XeniumInSituGeneExpression_ProtocolPlanner_RevC.pdf: Xenium = targeted in situ, resolusi subselular

**BI23**
- https://cpicpgx.org/guidelines/ (**dibuka langsung**): **29 guideline** (per 15 Okt 2026); seluruh tabel pasangan gen-obat — dipakai untuk chart "guideline per gen" (CYP2D6 7, CYP2C19 5, CYP2C9 4, HLA-B 4, CYP2B6 3, CYP3A5 2, TPMT 1, DPYD 1; dihitung manual dari tabel) dan contoh pasangan (klopidogrel, kodein, tiopurin, karbamazepin, abakavir, statin, fluoropirimidin, warfarin, takrolimus, hidralazin)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5984125/ (makalah PharmCAT): input VCF; 12 gen (CFTR, CYP2C19, CYP2C9, CYP2D6, CYP3A5, CYP4F2, DPYD, IFNL3, SLCO1B1, TPMT, UGT1A1, VKORC1); Named Allele Matcher; CYP2D6 via Astrolabe
- https://github.com/pharmgkb/pharmcat/blob/HEAD/dockstore/pipeline/README.md: pipeline 2 fase (VCF → star allele → fenotipe → rekomendasi CPIC/DPWG/label FDA); rilis v3.2.0 (Feb 2026)
- https://github.com/shey-kail/bioskills/blob/HEAD/clinical-databases/pharmacogenomics/SKILL.md (+2 mirror): PharmVar = otoritas star allele; nomenklatur alel CYP lama dipensiunkan 2017
- https://www.mdedge.com/psychiatry/article/155036/...: studi PGRN — 1 dari 4 hasil tes PGx berpotensi actionable klinis
- https://www.gimjournal.org/article/S1098-3600(21)01626-9/fulltext: CPIC dibentuk 2009 (PGRN + PharmGKB)

## Klaim yang diturunkan versinya (sumber tidak terbuka / tidak cukup)
1. **"COSMIC v3.3 = 78 SBS"** — file data v3.3 tidak bisa dibuka langsung (halaman download COSMIC JS-driven; tidak ada CSV publik tanpa login yang ditemukan). Rantai bukti: v3.2 = 72 SBS (paket cosmicsig + blog COSMIC) + suplemen Nature Genetics berlabel "COSMIC (v3.3) catalog" memuat 79 ID termasuk SBS95 (era v3.4) → 78 untuk v3.3. Keyakinan: sedang-tinggi. Lesson menulis "78 signature SBS" dengan konteks v3.3 (Mei 2022) dan mencatat situs kini v3.6.
2. **Resolusi Xenium dalam µm** — sumber resmi hanya menyebut "subcellular resolution" tanpa angka; lesson TIDAK mengarang angka, memakai kualitatif + jumlah gen (5.000, panel Prime 5K Juni 2024).
3. **Angka mini-case** (OR sel T, kohort pre-emptif, frekuensi mutasi chart driver) — berlabel eksplisit SINTETIS/ilustrasi di lesson; pola realistis, bukan klaim data nyata.
4. **"1 dari 4 hasil PGx actionable"** — dari liputan sekunder studi PGRN (mdedge); dipakai dengan framing "sebuah studi PGRN" + angka ilustrasi di mini-case.
5. **Ambang TMB ≥ 10 (FDA, pembrolizumab tumor-agnostic)** dan **larangan kodein FDA 2017** — fakta standar yang tidak diverifikasi ulang dari sumber primer hari ini; ditulis dengan framing umum yang konservatif.

## Bukti grep (dijalankan 2026-10-15)
```
summary: = 1 per lesson (bi21, bi22, bi23)
F1: "Pada lesson kali ini"=0, "Seperti yang telah dibahas sebelumnya"=0,
    "Mari kita mulai pembahasan"=0, "Selanjutnya, kita akan melihat"=0,
    "Penting untuk diingat bahwa"=0
kuis: 5/lesson, tiap soal tepat 1 correct:true
KaTeX: String.raw backslash TUNGGAL, render katex 4/4 OK (tanpa \\ ganda, tanpa error)
prosa: RAW (0 entitas HTML di luar SVG; tidak ada SVG kustom)
tsc --noEmit: 0 error pada bi21/bi22/bi23/reg-bi.ts
  (4 error pre-existing di wqb22–wqb25, file orang lain — tidak disentuh)
lockLines: 6/6 lab terverifikasi — baris editable pertama = "# TULIS KODEMU"
```

## Catatan untuk parent
- Registrasi hanya di `src/app/v2/lib/reg-bi.ts` (import + 3 entri). Tidak menyentuh registry.ts / Workspace.tsx / file lain.
- Perbaikan bug saat build: (a) cosine lab awal hanya 0,52 — diganti ke sampling multinomial 3000 mutasi → 0,970; (b) OR2J3 Fisher 9/60 signifikan (p=0,032) → 7/60 (p=0,109) agar jadi penumpang; (c) lockLines lab Fisher mengunci baris `p +=` yang harus diisi — diperbaiki; (d) pola regex GenB disesuaikan ke output aktual (-0,067).
- Verifikasi KaTeX memakai paket `katex` repo langsung (4 rumus render OK).
