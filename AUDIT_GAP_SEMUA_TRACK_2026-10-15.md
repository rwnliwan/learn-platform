# AUDIT GAP SEMUA TRACK — Learn Platform v2
**Tanggal:** 2026-10-15 · **Fase:** RISET SAJA (tidak ada lesson ditulis, tidak ada file diubah)
**Perintah:** Septian 2026-10-15 07:11 WITA — ekspansi lesson untuk SEMUA track, bukan hanya 4 role risiko.

## Basis terverifikasi
- Tepat **25 track / 519 lesson** di `src/app/v2/content/` (ekstraksi field `slug:`/`track:`/`title:` per file; duplikat judul = 0).
- Dokumen acuan yang dibaca semua tim: `WORKFLOW.md` v2.0 (standar 45–60 mnt, anti-flag F1–F6), `GAP_ANALYSIS_KELOMPOK_A/B_2026-10-14.md`, `EKSPANSI_2026-10-14/ebook_maps.md` (pola bedah ebook dari TOC/pratinjau resmi penerbit), `LAPORAN_EKSPANSI_2026-10-15.md` (24 lesson kemarin — tidak diusulkan ulang), `LAPORAN_TRACK_WQB_2026-10-15.md`, `/tmp/inventory.json` (slug+judul semua track).
- Metode bukti: gap diklaim hanya bila `grep -rli` di `src/app/v2/content/` membuktikan topik tidak ada (bukan dari ingatan); slug kandidat diverifikasi belum ada via `ls`/`grep`; sumber gap = URL yang benar-benar dibuka (kecuali dinyatakan jujur bila tidak).
- 6 sub-tim audit (Foundation · Risk Core · Data Platform · AI/ML · Health/Science/Blockchain · WQB). Laporan tim = klaim yang akan diverifikasi parent — bukti perintah grep/hitungan dicantumkan di tiap bagian.

## Ringkasan eksekutif

| # | Track | Existing | Kandidat baru | Slug lanjutan |
|---|---|---|---|---|
| 1 | WorldQuant Brain | 21 | 4 | wqb22–wqb25 |
| 2 | Data Management | 20 | 4 | dm20–dm23 |
| 3 | Data Engineer | 17 | 4 | de18–de21 |
| 4 | Database Administrator | 14 | 4 | dba15–dba18 |
| 5 | Business Intelligence | 17 | 3 | biz18–biz20 |
| 6 | Marketing Analytics | 19 | 3 | mk20–mk22 |
| 7 | Health Data Science | 20 | 6 | hd21–hd26 |
| 8 | Bioinformatika | 18 | 6 | bi19–bi24 |
| 9 | Blockchain Data Scientist | 15 | 6 | bcd16–bcd21 |
| 10 | Credit Risk | 35 | 3 | cr32–cr34 |
| 11 | Market Risk | 24 | 2 | mr25–mr26 |
| 12 | Risk Reporting | 24 | 2 | rr25–rr26 |
| 13 | Financial Markets | 18 | 4 | e19–e22 |
| 14 | Portfolio Management | 36 | 4 | pm-d7–pm-d10 |
| 15 | Fraud & AML Analytics | 42 | 3 | aml20, aml21, fr24 |
| 16 | Statistika | 38 | 3 | a316–a318 |
| 17 | Probabilitas | 19 | 3 | b18–b20 |
| 18 | SQL | 19 | 4 | c19–c22 |
| 19 | Python | 16 | 2 | d16–d17 |
| 20 | Agentic AI Engineer | 15 | 2 | aai16–aai17 |
| 21 | AI Engineering | 13 | 4 | aie14–aie17 |
| 22 | ML Engineer | 19 | 3 | mle20–mle22 |
| 23 | Deep Learning Engineer | 14 | 3 | dle15–dle17 |
| 24 | MLOps | 13 | 3 | mlops14–mlops16 |
| 25 | LLMOps | 13 | 3 | llmops14–llmops16 |
| | **TOTAL** | **519** | **88** | |

Skor prioritas = demand(1–3) × thinness(1–3) × career(1–3; HD/BI/BCD pakai 2,5 boost undervalued) × velocity(1–2).
Gelombang bangun yang disarankan (semua bebas rantai putus — tiap kandidat lolos F2 via mitigasi (a), prasyarat sudah ada di 519):
- **Gelombang 1 (skor ≥ 27): 31 kandidat** — cr34, wqb22, wqb24, aie14, aie16, llmops14, hd21, hd24, hd25, hd26, bi21, bi22, bi23, bcd16, bcd17, bcd19, cr33, mr25, aml21, wqb23, aai16, cr32, rr25, rr26, aml20, fr24, wqb25, mle20, dle15, mlops16, aie15.
- **Gelombang 2 (skor 8–24): 45 kandidat** — hd22, bcd18, aai17, aie17, mlops15, llmops16, dle16, hd23, bi19, bcd20, de21, mk20, mk21, mr26, e21, pm-d7, mle21, llmops15, bi20, bi24, bcd21, dm20, dm22, dm23, dba16, biz18, mk22, e19, e20, e22, pm-d8, pm-d9, mle22, dle17, mlops14, c19, de19, dba17, biz20, pm-d10, b18, c20, c21, c22, d16. Satu-satunya urutan internal yang dipaksakan: **mk20 sebelum mk21** (atau mk21 pakai mitigasi (c): ringkas model event GA4 2–3 kalimat di lesson).
- **Gelombang 3 (skor < 8): 12 kandidat** — dm21, de18, dba15, dba18, biz19, de20, a316, b19, b20, d17, a317, a318.
- **Ditunda:** DAO/governance analytics, ERC-4337 account abstraction (bcd), GraphRAG (aie), SuperAlpha blending (wqb).

**Pengingat wajib tahap BANGUN (perintah Septian):** QA scan F1–F6 per lesson (maks 2 iterasi perbaikan, lalu tulis ulang) sesuai WORKFLOW.md langkah 11–12 — parent akan menolak lesson yang kena flag saat gerbang.

---

## 1. WORLDQUANT BRAIN (21 → +4)

**Cakupan existing:** Busur 1 Fondasi (wqb1–10): alpha & anatomi simulasi, returns & volatilitas, Sharpe & ambang 1,25, fitness & drawdown, turnover, delay & decay, universe & region, neutralization, data fields, FASTEXPR. Busur 2 Praktik & Diagnosis (wqb11–15): membaca hasil & IS checks, sub-universe Sharpe, self-correlation, overfitting & plafon family, korelasi antar-alpha & klaster. Busur 3 Strategi Riset (wqb16–21): decay sensitivity, merancang wave, ML predictor, triage berlapis, strategi cadangan era konsultan, capstone.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| wqb22-margin-kapasitas | WQB22 — Margin & Kapasitas: Kapan Alpha Lolos Semua Tes tapi Mati di Biaya | "margin" di wqb = hanya arti Indonesia; metrik bps WQB = 0 | github.com/alexisdpc/worldquant-alpha-trading (ImprovingAlphas.md, seksi "Margin and IC"); github.com/khushalx/brain-mcp-docs (parameters-simulation-results.md) | T3 | 3×3×3×2=54 | (a) wqb5, wqb11, wqb4 |
| wqb23-vector-datafields | WQB23 — Vector Data Fields: Menambang Alpha dari Berita & Sentimen | `vec_avg\|vec_count\|vec_sum` = 0/21 file | github.com/khushalx/brain-mcp-docs (vector-datafields.md, mirror dok resmi WQB) | T3 | 2×3×3×2=36 | (a) wqb9, wqb10 |
| wqb24-alpha-di-produksi | WQB24 — Alpha di Produksi: Membaca Tab OS & Merespons Decay | "out-of-sample" hanya konseptual di wqb14 | github.com/jslijb/worldquantalpha docs (01_alpha-submission.md, about-brain-platform.md — mirror tutorial resmi) | T3 | 3×3×3×2=54 | (a) wqb13, wqb11, wqb14 |
| wqb25-tipe-submit-konsultan | WQB25 — ATOM, Pyramid & Power Pool: Tipe Submit Era Konsultan | `pyramid\|power pool\|ATOM` = 0/21 file | seksi "Special Alpha Types" 01_alpha-submission.md; github.com/khushalx/brain-mcp-docs (brain-genius.md) | T3 | 3×3×3×1=27 | (a) wqb13, wqb20 |

Ditolak/ditunda: backtest overfitting lanjutan → milik Statistika (a28/a38); regime analysis → milik Statistika (a39); ensemble ML umum → milik ML Engineer; risk model BARRA-style → milik Portfolio Management (pm-b8); SuperAlpha/blending → DITUNDA (butuh tier konsultan). Slug wqb22–25 terverifikasi belum ada (hanya wqb1–wqb21 di content/).

## 2. DATA MANAGEMENT (20 → +4)

**Cakupan existing:** lifecycle (dm1), ER→star (dm2), relasional/ACID (dm3a), NoSQL (dm3b), warehouse/lakehouse (dm4), orkestrasi+dbt (dm5), batch/streaming (dm6), kualitas (dm7), data contract (dm8), governance (dm9), metadata/lineage (dm10), master data/golden record (dm11), keamanan/privasi (dm12), data risiko-regulasi (dm13), mesh (dm14), cloud/DataOps (dm15), BI/analytics engineering (dm16), strategi data (dm17), Spark (dm18), capstone DWH (dm19). Vs DMBOK 2nd ed: semua area tercakup KECUALI **Document & Content Management (NOL total di 519 lesson)**; reference data hanya sebutan; "data sharing"/"clean room" dan "retensi|arsip" = NOL.

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| dm20-reference-data | Reference Data Management: Kode Kecil yang Menentukan Nasib Laporan | "reference data" hanya sebutan di dm11, dm13 | DAMA DMBOK knowledge areas — jujur: terverifikasi via hasil pencarian, dama.org tidak dibuka langsung | P2 | 3×2×2×1=12 | (a) dm11 + (c) |
| dm21-document-management | Document & Content Management: Mengelola Data Tak Terstruktur | nol total di 519 lesson | DAMA DMBOK (sama) | P3 | 2×3×1×1=6 | self-contained (c) |
| dm22-data-sharing | Berbagi Data & Clean Room: Kolaborasi Tanpa Menyerahkan Data | "data sharing", "clean room" = nol | tren industri 2024–2026 — jujur: URL primer belum dibuka; verifikasi saat bangun | P2 | 2×3×1×2=12 | (a) dm12 |
| dm23-retensi-arsip | Retensi, Arsip & Penghapusan Defensif: Kebijakan yang Bisa Dipertahankan | "retensi\|arsip\|retention\|archival" = nol total | praktik governance standar — jujur: URL primer belum dibuka | P2 | 2×3×2×1=12 | (a) dm1 |

## 3. DATA ENGINEER (17 → +4)

**Cakupan existing:** lanskap, batch/streaming, SQL lanjutan, Python, storage, dimensional/vault, DAG, data quality, Kafka, Spark, cost/tuning, katalog/lineage, real-time, capstone, CI/CD (de15), dbt (de16), backfill/replay (de17) — tiga gap P1 Kelompok A sudah terisi. Sisa gap Kelompok A valid: Terraform (G4), RBAC (G5), CDC/Debezium (G6); Great Expectations sudah di de8. **"iceberg\|delta lake\|hudi" = NOL total di 519 lesson.**

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| de18-terraform | Terraform & IaC untuk Platform Data | "terraform" hanya sebutan di dm15, dm17 | lokercepat.id/data-engineer-vida/ — jujur: terverifikasi 2026-10-14 di GAP_ANALYSIS, tidak dibuka ulang | P2 | 3×2×1×1=6 | (a) dm15+de11 |
| de19-cdc-debezium | CDC & Debezium: Menangkap Perubahan Saat Terjadi | sebutan di dm4/dm6/dba10 | jujur: debezium.io belum dibuka | P2 | 2×2×1×2=8 | (a) dm6 |
| de20-access-control | RBAC & Access Control di Platform Data | sebutan di de12/dm9/dm12 | grabjobs.co/.../data-engineer-151977303 (StraitsX) — jujur: terverifikasi 2026-10-14, tidak dibuka ulang | P2 | 2×2×1×1=4 | (a) de12+dm12 |
| de21-open-table-formats | Format Tabel Terbuka: Iceberg, Delta Lake & Hudi | nol total; Iceberg v3 2025; Snowflake full support Apr 2025 | techtarget.com/data-technologies/opinion/Why-Apache-Iceberg-is-essential-for-modern-data-lakehouses (dibuka via hasil pencarian, 24 Jun 2025) | P1 | 3×3×1×2=18 | (a) de5 |

**Catatan konflik sudut:** de18 (IaC untuk platform data) vs mlops14 (IaC untuk ML infra) — dipisahkan sudut eksplisit, lihat matriks kepemilikan.

## 4. DATABASE ADMINISTRATOR (14 → +4)

**Cakupan existing:** era cloud (dba1), arsitektur (dba2), instalasi (dba3), backup/RPO-RTO (dba4), replikasi/HA (dba5), tuning (dba6), keamanan (dba7), monitoring (dba8), capacity (dba9), migrasi/upgrade (dba10), managed cloud (dba11), capstone (dba12), otomasi/scripting (dba13), partitioning (dba14). Sisa gap Kelompok A valid: flyway/liquibase = nol total (G3); DR drill/runbook (G4 — BSI eksplisit testing restore berkala; disebut di 9 file tapi nol lesson khusus); audit trail (G5 — dba7 hanya sebutan). "pgbouncer\|connection pool" = nol; "wal\|write-ahead" = nol.

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| dba15-schema-change | Schema Change Management: Flyway, Liquibase & DDL Tanpa Downtime | "flyway\|liquibase" = nol total | lokercepat.id/it-database-administrator-oracle-dba-pt-abhimata-persada/ — jujur: terverifikasi 2026-10-14, tidak dibuka ulang | P2 | 2×3×1×1=6 | (a) de15 |
| dba16-dr-drill | DR Drill & Runbook: Latihan Bencana Sebelum Bencana | "runbook\|drill" disebut di 9 file dba*, nol lesson khusus | investakit.com/loker-database-system-administrator-bank-bsi-surabaya/ — jujur: terverifikasi 2026-10-14, tidak dibuka ulang | P1 | 3×2×2×1=12 | (a) dba4+dba5 |
| dba17-audit-kepatuhan | Audit Trail & Kepatuhan: Jejak yang Bisa Dipertahankan ke Auditor | "audit trail\|audit logging" hanya sebutan di dba7 | BSI di atas + konteks POJK | P2 | 2×2×2×1=8 | (a) dba7 |
| dba18-connection-pool | Connection Pooling: PgBouncer & Koneksi yang Tidak Bocor | nol total | praktik operasional standar — jujur: pgbouncer docs belum dibuka | P3 | 2×3×1×1=6 | (a) dba2 |

## 5. BUSINESS INTELLIGENCE (17 → +3)

**Cakupan existing:** lanskap, star schema, SQL analitik, dashboard, KPI, self-service, storytelling, adhoc, data quality, eksperimen/A-B, governance metrik, embedded, AI, capstone, DAX (biz15), Power Query (biz16), RLS + Service admin (biz17) — kini selaras PL-300. Sisa gap Kelompok A valid: Advanced Excel (G4 — "excel" hanya sebutan). **"tableau\|looker" = NOL total di 519 lesson** (JD BCA Digital mensyaratkan); "semantic layer" hanya sebutan di 5 file.

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| biz18-excel-lanjut | Excel Tingkat Lanjut: Power Pivot untuk Analis | "advanced excel" = nol; "excel" sebutan saja | bds.telkomuniversity.ac.id (BI analyst roles) — jujur: terverifikasi 2026-10-14, tidak dibuka ulang | P2 | 3×2×2×1=12 | self-contained (c) |
| biz19-tableau-looker | Tableau & Looker: Dunia BI di Luar Power BI | "tableau\|looker" = nol total | catatan JD di GAP_ANALYSIS 2026-10-14 — jujur: URL jobleads tidak tersedia penuh saat live-check | P3 | 2×3×1×1=6 | (a) biz4 |
| biz20-semantic-layer | Semantic Layer: Satu Definisi Metrik untuk Semua Tool | nol lesson khusus; tren 2024–2026 (dbt Semantic Layer, LookML, Cube) | tren industri — jujur: URL primer belum dibuka; verifikasi saat bangun | P2 | 2×2×1×2=8 | (a) biz11+biz2 |

## 6. MARKETING ANALYTICS (19 → +3)

**Cakupan existing:** funnel AARRR (mk1), tracking (mk2), cohort/RFM (mk3), segmentasi (mk4), CLV (mk5), churn (mk6), propensity (mk7), rekomendasi (mk8), A/B (mk9), inkrementalitas/geo-experiment (mk10), uplift (mk11), atribusi multi-touch (mk12), MMM (mk13), pricing/promo (mk14), forecasting (mk15), ekonomi iklan digital (mk16), text analytics (mk17), etika/storytelling (mk18), capstone (mk19). **TEMUAN KRITIS:** `"ga4\|google analytics"` = **NOL total di 519 lesson** (0 hit di mk2/mk12/mk13/mk16); "server-side\|capi\|conversion api" = nol; "CDP\|customer data platform" = nol; "retail media", "brand lift", "cookieless\|privacy sandbox\|skan" = nol; mk16 tidak menyebut "meta"/"facebook" sama sekali — padahal JD Indonesia (Spiralyze, Novade) mensyaratkan GA4/GTM.

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| mk20-ga4 | GA4: Pengukuran Berbasis Event | nol total; event-based model, DebugView, BigQuery export | lokercepat.id/google-web-analytics-and-tagging-specialist-spiralyze/ ; lokercepat.id/digital-marketing-specialist-google-analytics-novade-solutions-2/ (hasil pencarian terverifikasi) | P1 | 3×3×1×2=18 | (a) mk2 |
| mk21-server-side | Server-Side Tracking & Conversions API: Saat Cookie Mati | nol total; Meta CAPI, GA4 server-side, SKAN | upwork.com freelance job App Analytics Specialist (SKAdNetwork/SST; hasil pencarian terverifikasi) | P1 | 3×3×1×2=18 | **SEDANG → mitigasi (b): urutan mk20 → mk21** (atau (c): ringkas model event GA4 di lesson) |
| mk22-cdp | CDP & Identity Resolution: Mengenali Pelanggan Tanpa Cookie | nol total | tren industri — jujur: URL primer belum dibuka; verifikasi saat bangun | P2 | 2×3×1×2=12 | (a) mk4 |

## 7. HEALTH DATA SCIENCE (20 → +6) — fokus ekstra Septian

**Cakupan existing:** sumber data EHR/klaim/registri (hd1), ICD/SNOMED/FHIR (hd2), epidemiologi dasar (hd3), desain studi (hd4), uji klinis (hd5), survival (hd6), longitudinal (hd7), missing data (hd8), uji diagnostik (hd9), kausalitas observasional (hd10), fenotipe & OMOP (hd11), TRIPOD/prediksi klinis (hd12), fairness AI (hd13), NLP klinis (hd14), imaging medis (hd15), SIR & deteksi wabah (hd16), ekonomi kesehatan (hd17), privasi/etika (hd18), STROBE/dashboard (hd19), capstone readmission (hd20).

**Kejujuran metodologi (tim HD):** riset via `browser.search` (snippets + URL verbatim hasil search); tidak ada halaman dibuka penuh via `browser.open`. Tidak ada klaim isi di luar dukungan snippet.

| Slug | Judul | Gap (grep) | Sumber (URL hasil search) | Tier | Skor (×2,5 boost) | F2 |
|---|---|---|---|---|---|---|
| hd21-farmakovigilans | Pharmacovigilance & Signal Detection: Menangkap Sinyal Bahaya Obat Sebelum Terlambat | `farmakovigilans`/`disproportionality`/`PRR\|ROR` = NOL | who.int/indonesia/news/detail/20-03-2024-who--indonesian-fda-increase-access-to-safe-and-effective-medicines (WHO-BPOM 2023, 162 evaluator); callforpaper.unw.ac.id/.../ICH-UNW/... (underreporting RS Indonesia); pharmaregulatory.in/bpom-pharmacovigilance... | 🔴 | 3×3×2,5×2=45 | (a) hd1, hd3 |
| hd22-surveilans-air-limbah | Wastewater-Based Epidemiology: Membaca Wabah dari Air Limbah | "wastewater" = NOL | cdc.gov/public-health-data-strategy/php/story/real-time-wastewater-data-guides-public-health-action.html (NWSS); rand.org/pubs/commentary/2025/04/... (pendanaan habis Sep 2025); statnews.com/2025/03/21/h5-bird-flu-wastewater-monitoring-nwss-cdc/ | 🟡 | 2×3×2,5×2=30 | (a) hd16, hd3 |
| hd23-pemetaan-penyakit-geospasial | Disease Mapping: Peta Risiko Penyakit dengan Model Spasial Bayesian | `geospatial`/`DALY` = NOL | arxiv.org/abs/2509.19889v1 (BYM2 2026); github.com/spatial-epidemiology/spatial-epidemiology/.../index.md | 🟡 | 3×3×2,5×1=22,5 | (a) hd3, a212 |
| hd24-mendelian-randomization | Mendelian Randomization: Kausalitas dari Lotre Genetik | "Mendelian" = NOL; a313 hanya IV umum | literatur standar MR (jembatan hd10↔bi12) | 🔴 | 3×3×2,5×2=45 | (a) hd10, a213, bi12 |
| hd25-kesetaraan-kesehatan | Health Equity & SDOH: Mengukur Ketimpangan yang Tak Terlihat | `SDOH`/`health disparit` = NOL; hd13 = fairness AI (beda sudut) | earnbetter.com JD population health analyst (bias/confounding/RWE) | 🔴 | 3×3×2,5×2=45 | (a) hd3, hd13 |
| hd26-rwe-regulator | Real-World Evidence untuk Regulator: Ketika Data Klaim Jadi Bukti | sudut regulasi RWE = NOL | hdruk.ac.uk/.../BHFDSC_EarlyCareerHealthDataScientist_JD.pdf; konteks SATUSEHAT FHIR, JKN/BPJS, Kemenkes | 🔴 | 3×3×2,5×2=45 | (a) hd1, hd5, hd10 |

Tidak ada RISIKO RANTAI di track ini.

## 8. BIOINFORMATIKA (18 → +6) — fokus ekstra Septian

**Cakupan existing:** central dogma (bi1), NCBI/Ensembl/UniProt (bi2), format file (bi3), terminal/git/nextflow (bi4), biopython/R (bi5), alignment & BLAST (bi6), filogenetika (bi7), pipeline NGS (bi8), RNA-seq (bi9), FDR & batch effect (bi10), single-cell (bi11), GWAS (bi12), epigenomik (bi13), metagenomik 16S (bi14), proteomik & AlphaFold (bi15), ML bio (bi16), reprodusibilitas (bi17), capstone (bi18).

| Slug | Judul | Gap (grep) | Sumber (URL hasil search) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| bi19-genome-assembly | Genome Assembly: Merakit Genom dari Kepingan Puzzle | `assembly/de novo/contig` = NOL | github.com/bendejonge/bioinformaticsalgorithms (Compeau/Pevzner); github.com/olivia-rippee/python-for-genomic-data-science (silabus JHU) | 🟡 | 3×3×2,5×1=22,5 | (a) bi1, bi6 |
| bi20-gatk-best-practices | GATK Best Practices: Seni Memanggil Varian dengan Benar | bi8 hanya 2 sebutan GATK (orkestrasi) | github.com/rcwang2024/bioinformatics_practice/.../04_Variant_Analysis/README.md; github.com/x66ccff/sciagent-skills/.../gatk-variant-calling/SKILL.md | 🟡 | 3×2×2,5×1=15 | (a) bi8. **RISIKO RANTAI:** berbatasan dengan bi8 — mitigasi: bi8 = orkestrasi pipeline (QC→VCF); bi20 = kedalaman statistik calling (BQSR, VQSR vs hard filter, QD/FS/MQ, DRAGEN vs joint genotyping) |
| bi21-cancer-genomics | Cancer Genomics: Jejak Mutasi & Tanda Tangan Kanker | "mutational signature" = NOL total | nature.com/articles/s41588-024-01848-x (pan-cancer 962 sampel); github.com/codecrunchworldwide/c10-crunching-bioinformatics/.../week-11-cancer-genomics/resources.md; COSMIC v3.3 (78 SBS signatures) | 🔴 | 3×3×2,5×2=45 | (a) bi8, bi10 |
| bi22-spatial-transcriptomics | Spatial Transcriptomics: Di Mana Gen Bicara | bi11 hanya 3 sebutan "spatial"; Visium/Xenium = NOL | github.com/washma-sajjad/spatial-transcriptomics; github.com/taimoorasad01/spatial-transcriptomics-10x-analysis | 🔴 | 3×3×2,5×2=45 | (a) bi11 |
| bi23-pharmacogenomics | Pharmacogenomics: Resep Obat dari DNA | "pharmacogenomic/CPIC/PharmCAT/star allele" = NOL total | github.com/liufzhq/bioskills/.../pharmacogenomics/SKILL.md; github.com/mvenator7/pharmacogenomics-drug-response; CPIC ~26 guidelines (2026) | 🔴 | 3×3×2,5×2=45 | (a) bi8, bi12 |
| bi24-alternative-splicing | Alternative Splicing: Satu Gen, Banyak Wajah | "isoform/exon skipping" = NOL; bi9 = DE saja | literatur standar (PSI, rMATS/DEXSeq, isoform long-read) | 🟡 | 2×3×2,5×1=15 | (a) bi9 |

## 9. BLOCKCHAIN DATA SCIENTIST (15 → +6) — fokus ekstra Septian

**Cakupan existing:** lanskap on-chain (bcd1), membaca data chain (bcd2), address clustering (bcd3), DeFi TVL/AMM x·y=k (bcd4), tokenomics (bcd5), NFT wash trading (bcd6), fraud on-chain (bcd7), MEV mempool (bcd8), SQL Dune (bcd9), graph aliran dana (bcd10), risk scoring/AML (bcd11), capstone (bcd12), cross-chain tracing (bcd13), indexing skala besar (bcd14), oracle literacy (bcd15). **Gap 🔴 Kelompok B TERTUTUP SEMUA** (grep isi): cross-chain→bcd13 ✓, indexing→bcd14 ✓, oracle→bcd15 ✓. DAO governance → DITUNDA (⚪ niche).

| Slug | Judul | Gap (grep) | Sumber (URL hasil search) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| bcd16-stablecoin-analytics | Stablecoin Analytics: Mengukur Kapan 'Stabil' Goyah | "stablecoin" hanya sebutan di bcd4/bcd5; metrik depeg = NOL | mfc3.eventsadmin.com/Papers/ViewContribution?cid=15400 (kanal transmisi intraday); cointelegraph.com/news/usdc-dai-depegged-more-than-usdt-sp-global-research (S&P Global); markaicode.com/uniswap-v4-stablecoin-lp-concentrated-liquidity-guide/ | 🔴 | 3×3×2,5×2=45 | (a) bcd2,bcd4,bcd15. **RISIKO RANTAI:** berbatasan mr21 & aml18 — mitigasi: bcd16 = pengukuran on-chain (metrik depeg, mint/redeem flows, DEX price feed); mr21 = risiko portofolio/pasar; aml18 = penegakan/typologi pencucian |
| bcd17-concentrated-liquidity | Concentrated Liquidity & Hooks: Anatomi LP Modern | "concentrated liquidity" = NOL; bcd4 = x·y=k saja | github.com/rudazy/citation-agent/.../uniswap-v4-hooks.md; github.com/Wilfred007/HedgeFlow-Hook (Uniswap v4 hooks, $4,2B volume Jun 2026) | 🔴 | 3×3×2,5×2=45 | (a) bcd4 |
| bcd18-restaking | Restaking Analytics: Ketika Keamanan Dijual Dua Kali | "eigenlayer\|restaking" = NOL total | coindesk.com/business/2026/09/28/the-restaking-gold-rush-is-over... (TVL $22B→$5B); datawallet.com/crypto/ethereum-staking-statistics-and-trends | 🟡 | 2×3×2,5×2=30 | (a) bcd4, bcd5 |
| bcd19-l2-blobs | L2 & Blob Analytics: Ekonomi Data di Balik Rollup | "EIP-4844\|blob\|rollup" = NOL total | analyticsinsight.net/ethereum/how-ethereum-scales-without-sacrificing-decentralization; arxiv.org/pdf/2411.03892 (type-3 tx); EIP-4844 (Mar 2024), Pectra (Mei 2025), Fusaka (Des 2025: PeerDAS) | 🔴 | 3×3×2,5×2=45 | (a) bcd2, bcd14 |
| bcd20-pbs-mev | PBS & MEV Supply Chain: Siapa Membangun Blokmu | "MEV-boost\|PBS" = NOL; bcd8 hanya deteksi mempool | literatur PBS (builder/relay/proposer, order flow auctions, metrik sentralisasi builder) | 🟡 | 2×2×2,5×2=20 | (a) bcd8. **RISIKO RANTAI:** berbatasan bcd8 — mitigasi: bcd8 = deteksi transaksi MEV di mempool; bcd20 = struktur supply chain + metrik sentralisasi |
| bcd21-anomali-deret-waktu | Anomaly Detection Deret Waktu On-Chain: Alarm yang Tak Tidur | anomali deret waktu + alerting = NOL (bcd7 = pola fraud; fr16 = sudut fraud) | JD Chainlink eksplisit (anomaly detection + SLO alerting) — sudut bcd21 = data-feed/protokol | 🟡 | 2×3×2,5×1=15 | (a) bcd7, bcd14 |

## 10. CREDIT RISK (35 → +3)

**Cakupan existing:** 5C (cr1), DPD/kolektibilitas (cr2), PD/LGD/EAD (cr3, cr10–cr14b), scorecard (cr7a/b, cr8, cr9), Basel & RWA (cr4a), IFRS 9/PSAK 71 (cr4b), portofolio & stress (cr15, cr16), korporasi (cr17a/b), industri/negara (cr18), validasi (cr19), monitoring & KRI (cr20), pricing (cr21), collection (cr22), regulasi Indonesia (cr23), fairness (cr24), capstone (cr25) + cr26–cr31 (ditutup kemarin).

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| cr32 | Credit Derivatives & CDS: Mentransfer Risiko Kredit Tanpa Menjual Pinjaman | "credit default swap" = 0 di cr* | Hull 6th ed ch.18 (TOC wiley-vch.de, diverifikasi di ebook_maps.md) | P1 | 3×3×3×1=27 | (a) cr3, cr10 |
| cr33 | Basel III Final: Output Floor 72,5% yang Mengunci RWA | "output floor" cuma 1 sebutan di cr4a | ecb.europa.eu/press/financial-stability-publications/macroprudential-bulletin/focus/2023/html/ecb.mpbu202312_focus01.en.html; bundesbank.de structural-developments...-622584; bis.org/bcbs/publ/d592.pdf | P1 | 2×3×3×2=36 | (a) cr4a |
| cr34 | TKBI v2: Menilai Kredit Hijau & Menangkap Greenwashing | "taxonomy/taksonomi" = 0 di cr28 | trenasia.id/read/jurus-ojk-cegah-greenwashing-dalam-pembiayaan-hijau; eco.espos.id/pembiayaan-hijau-di-sektor-perbankan-diprediksi-meningkat-2064011 (OJK TKBI v2 Feb 2025; kredit hijau Rp2.075 T Des 2024) | P1 | 3×3×3×2=54 | (a) cr28 |

## 11. MARKET RISK (24 → +2)

**Cakupan existing:** trading book (mr1), volatilitas (mr2), VaR/ES (mr3–mr5), backtesting (mr6), stress (mr7), suku bunga & kurva (mr8, mr9), IRRBB (mr10), options/Greeks (mr11), FX/komoditas (mr12), likuiditas (mr13), counterparty (mr14), model stokastik (mr15), FRTB (mr16), limit & laporan (mr17), validasi (mr18), capstone (mr19) + mr20–mr24 (ditutup kemarin).

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| mr25 | NMRF & PLAT: Ujian Tersulit FRTB-IMA | "non-modellable" cuma di mr16 | bankofengland.co.uk/prudential-regulation/publication/2026/june/basel-3-1-adjustments-to-the-internal-model-approach-for-market-risk-consultation-paper (CP9/26, Type 1/Type 2 NMRF); advisers.law/blog/eu-frtb-relief-measures-2029/ (EU Regulation 2026/1221, PLAT relief 3 tahun) | P1 | 2×3×3×2=36 | (a) mr16 |
| mr26 | Tail Risk Hedging: Asuransi Portofolio dari Ekor Distribusi | "tail hedge\|jump risk" = 0 | Hull 6th ed ch.15; Jorion ch.7 | P2 | 2×3×3×1=18 | (a) mr11, mr5 |

## 12. RISK REPORTING (24 → +2)

**Cakupan existing:** lanskap (rr1), anatomi (rr2), metrik (rr3), QA data (rr4), visualisasi (rr5), narasi (rr6), dashboard (rr7), otomasi (rr8), adhoc (rr9), regulasi OJK/BI (rr10), stress (rr11), insiden (rr12), KRI (rr13), capstone (rr14), risk appetite (rr15), ECL/RWA (rr16), BCBS 239 (rr17), market risk reporting (rr18), pilot impostor (rr19 — JANGAN diganggu) + rr20–rr24 (ditutup kemarin).

| Slug | Judul | Gap (grep) | Sumber | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| rr25 | ICAAP: Bank Menilai Sendiri Kecukupan Modalnya (Pilar 2) | "ICAAP" cuma sebutan di rr23/rr24 | bis.org/basel_framework/ (Pilar 2/SRP) — dibuka; demand: lowongan Societe Generale, Citi AVP (Kelompok A) | P1 | 3×3×3×1=27 | (a) rr16, rr15 |
| rr26 | Laporan KPMM/CAR: Dari RWA ke Rasio Modal | "KPMM" cuma 1 sebutan di rr16 | bis.org/basel_framework/ — dibuka | P1 | 3×3×3×1=27 | (a) rr16, cr4a |

## 13. FINANCIAL MARKETS (18 → +4)

**Cakupan existing:** struktur pasar (e1), instrumen (e2), TVM (e3), obligasi (e4), credit spread (e5), ekuitas (e6), return/volatilitas/Sharpe (e7), Markowitz (e8), CAPM (e9), derivatif (e10), Black-Scholes (e11), FX (e12), market risk (e13), pasar uang (e14), kit Indonesia (e15), efisiensi pasar (e16), makro (e17), laporan keuangan (e18). Gap vs benchmark **Yale ECON 252** (dibuka & diverifikasi): Lecture 05 Insurance, 10 Real Estate, 19 Investment Banks, 20 Professional Money Managers — grep `real estate|insurance|investment banking|mutual fund` = 0 di e*; `etf|IPO` hanya sebutan. Sumber: edukatico.org/en/online-course/financial-markets; infocobuild.com/education/audio-video-courses/economics/econ252-spring2011-yale.html.

| Slug | Judul | Gap (grep) | Tier | Skor | F2 |
|---|---|---|---|---|---|
| e19 | Real Estate & REIT: Properti sebagai Aset Investasi | "real estate" = 0 di e* | P2 | 2×3×2×1=12 | (a) e3, e6 |
| e20 | Asuransi & Dana Pensiun: Bisnis yang Menjual Perlindungan | "insurance\|pension" = 0 di e* | P2 | 2×3×2×1=12 | (a) e2 |
| e21 | Investment Banking: IPO, Underwriting & M&A | "investment banking" = 0 di e* | P2 | 3×3×2×1=18 | (a) e6, e2 |
| e22 | Reksa Dana & ETF: Memilih Kendaraan Investasi | "mutual fund" = 0; "etf" sebutan | P2 | 3×2×2×1=12 | (a) e2, e7 |

## 14. PORTFOLIO MANAGEMENT (36 → +4)

**Cakupan existing:** Tier A CFA L1 (pm-a1…a10), Tier B kuantitatif (pm-b1…b9), Tier C praktik (pm-c1…c11), Tier D terapan (pm-d1…d6). Lanjutan tier D = pm-d7+ (terverifikasi kosong). Gap benchmark CFA L3: **factor investing = 0 di SELURUH track** (gap murni); risk parity hanya 4 sebutan di pm-c4; CPPI = 0 di semua track (sumber: ifci.ch/00010855.htm — dibuka); rebalancing hanya sebutan di pm-c3/c4/c5. Jorion ch.17 (risk budgeting) dari ebook_maps.md.

| Slug | Judul | Gap (grep) | Tier | Skor | F2 |
|---|---|---|---|---|---|
| pm-d7 | Factor Investing: dari Premia ke Portofolio Nyata | "factor investing" = 0 semua track | P1 | 3×3×2×1=18 | (a) pm-a10, pm-b1 |
| pm-d8 | Risk Parity & Risk Budgeting: Alokasi berbasis Risiko, Bukan Modal | 4 sebutan di pm-c4 | P2 | 3×2×2×1=12 | (a) pm-c4, pm-a2 |
| pm-d9 | CPPI & Asuransi Portofolio: Lantai yang Bergerak | "cppi" = 0 semua track | P2 | 2×3×2×1=12 | (a) pm-a8, pm-b6 |
| pm-d10 | Rebalancing: Kalender, Threshold & Tax-Aware | sebutan di pm-c3/c4/c5 | P3 | 2×2×2×1=8 | (a) pm-c3 |

## 15. FRAUD & AML ANALYTICS (42 → +3, top-up)

**Cakupan existing:** aml1–aml11 (triase, KYC/CDD, EDD, sanctions, structuring, layering, SAR, network, virtual assets, IRA, terrorist financing) + fr1–fr23 (pipeline ML fraud lengkap) + aml12–aml19 (ditutup kemarin).

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| aml20 | Beneficial Ownership Deep-Dive: UBO, Shell Company & Trust | 3 sebutan definisional di aml2 | FATF R.24 threshold BO 25%: openownership.org/en/publications/open-ownership-response-to-fatf-consultation-on-revisions-to-recommendation-24-and-the-interpretive-note/draft-amendment-text-to-r24-and-inr24/; gtlaw.com/.../gt-alert_corporate-transparency-act-takes-effect-with-beneficial-ownership-reporting-requirements.pdf | P1 | 3×3×3×1=27 | (a) aml2 |
| aml21 | Proliferation Financing: Tipologi & Sanksi Target PBB | "proliferation" = 0 | assets.adgm.com/.../FCCP+Notice+No+183+of+2025.../bfd47922db3e11f0bc7cb6d2214eb016 (UNSCR 1737 snapback, Des 2025) | P1 | 2×3×3×2=36 | (a) aml4, aml15 |
| fr24 | Fraud Loss Reporting: Menghitung ROI Pencegahan ke Manajemen | 1 contoh kasus di fr7 | DBS JD fraud analyst (terverifikasi Kelompok A) | P2 | 3×3×3×1=27 | (a) fr1, fr14 |

## 16. STATISTIKA (38 → +3)

**Cakupan existing:** A1 deskriptif+EDA (a11–a19); A2 inferensi (sampling, MLE, CI, uji hipotesis, uji-t/ANOVA, nonparametrik, effect size, multiple testing, bootstrap, power, A/B, Bayesian, kausalitas — a21–a213); A3 modeling (OLS, diagnostik, regularisasi, logistic/GLM, metrik klasifikasi, kalibrasi, imbalanced, validasi/leakage, time series, volatilitas, PCA/clustering/anomali, survival, inferensi kausal, explainability/fairness, tree/boosting — a30–a315). Track paling matang; hanya celah advanced.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier/durasi | Skor | F2 |
|---|---|---|---|---|---|---|
| a316-mixed-effects | Mixed Effects Models: Satu Model untuk Data Berlapis (debitur dalam cabang, transaksi dalam nasabah) | `hierarchical\|multilevel\|mixed.effect` di a*/b* = tidak ada | statsmodels.org/0.9.0/mixed_linear.html (random intercepts/slopes, REML/ML) | advanced, 55–60 mnt | 2×1×2×1=4 | (a) a31/a34 |
| a318-doe-faktorial | Design of Experiments: Rancangan Faktorial, Blocking & Taguchi — Melampaui A/B Testing | `rancangan percobaan\|eksperimen faktorial` = tidak ada (a211 hanya A/B dua-grup) | itl.nist.gov/div898/handbook/pmd/section3/pmd31.htm (NIST/SEMATECH e-Handbook §4.3.1) | intermediate, 50–55 mnt | 2×1×1×1=2 | (a) a211/a24/a25 |
| a317-quantile-regression | Quantile Regression: Memodelkan Ekor, Bukan Cuma Rata-rata | `quantile regression\|regresi kuantil` = tidak ada | statsmodels.org/devel/examples/notebooks/generated/quantile_regression.html (QuantReg, Koenker & Hallock 2001) | intermediate, 45–50 mnt | 1×1×2×1=2 | (a) a31 |

## 17. PROBABILITAS (19 → +3)

**Cakupan existing:** aksioma, kombinatorik, bersyarat, Bayes, variabel acak (b1–b5); distribusi diskret (b6.1–b6.2) & kontinu (b7.1–b7.2); fitting distribusi (b8); joint/kovarians (b9); copula (b10); LLN/CLT (b11); Monte Carlo (b12); Vasicek (b13); Markov chain (b14); random-walk→GBM (b15); heavy tails/EVT (b16); Bayesian praktis (b17). Kuat di fondasi; celah di proses stokastik lanjutan & komputasi Bayesian.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier/durasi | Skor | F2 |
|---|---|---|---|---|---|---|
| b18-poisson-process | Poisson Processes: Menghitung Kejadian Sepanjang Waktu (kedatangan default, alert fraud) | "poisson process" = tidak ada (b6.2 hanya distribusi; b15 hanya random walk/GBM) | ocw.mit.edu/courses/18-440-probability-and-random-variables-spring-2014/pages/lecture-notes/ (SES #13) | intermediate, 50–55 mnt | 2×2×2×1=8 | (a) b6.2/b7.1 |
| b19-mcmc | MCMC: Sampling dari yang Tak Terhitung (Metropolis-Hastings & Gibbs) | "mcmc\|gibbs\|metropolis" = 1 sebutan di b17 (+1 di a212) | github.com/CamDavidsonPilon/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers (Ch.3, MIT license) | intermediate, 55–60 mnt | 1×2×2×1=4 | (a) b12/b17 |
| b20-hidden-markov | Hidden Markov Models: Status Tersembunyi di Balik Data (regime pasar, pola fraud) | "hidden markov\|viterbi" = tidak ada | hmmlearn.readthedocs.io/en/stable/tutorial.html (Viterbi, forward-backward, Baum-Welch/EM) | intermediate, 50–55 mnt | 1×2×2×1=4 | (a) b14 |

## 18. SQL (19 → +4)

**Cakupan existing:** SELECT, NULL, GROUP BY, fungsi tanggal/string, JOIN, subquery, CTE, UNION, window function 1–2 (c1–c9); analitik terapan: dedupe/pivot/YoY, cohort/retention/funnel, recursive CTE, DPD/roll-rate/vintage kredit, fraud velocity, data quality, star schema, index & EXPLAIN, transaksi/ACID (c10–c18). Kuat di analitik; celah di abstraksi (VIEW) & tooling modern.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier/durasi | Skor | F2 |
|---|---|---|---|---|---|---|
| c19-views | VIEWs: Bangun Sekali, Pakai Selamanya (abstraksi query analitik) | "create view" di c* = tidak ada | search.library.wisc.edu/catalog/9913039526602121 (katalog UW-Madison untuk *Learning SQL* 3e O'Reilly — TOC resmi bab "Views" ch 14) | intermediate, 45–50 mnt | 3×2×2×1=12 | (a) c1 |
| c20-json-sql | SQL & JSON: Menjinakkan Data Semi-terstruktur (event, webhook, API) | "jsonb\|->>" di c* = tidak ada | pragprog.com/titles/bksap2/more-sql-antipatterns ("when to use JSON columns") | intermediate, 50–55 mnt | 2×2×2×1=8 | (a) c1/c4 |
| c21-duckdb | DuckDB: SQL Data Besar Tanpa Server (query Parquet langsung) | "duckdb" hanya sebutan di de10 & dm18 | frameworktraining.co.uk/courses/data/data-science/data-analysis-python-training-course (silabus 2026: PySpark, Polars, DuckDB berdampingan) | intermediate, 50–55 mnt | 2×2×1×2=8 | (a) c1 |
| c22-sql-antipatterns | Antipola SQL: Kesalahan yang Tak Dilakukan Senior (N+1, SELECT *, fungsi di kolom terindeks) | "antipattern" = tidak ada di seluruh konten | pragprog.com/titles/bksap2/more-sql-antipatterns (*More SQL Antipatterns* rilis 2026, p1.0 2026/07/08) | advanced, 55–60 mnt | 2×2×1×2=8 | (a) c5/c9/c17 |

## 19. PYTHON (16 → +2)

**Cakupan existing:** dasar (d1–d2), numpy (d3), pandas (d4), cleaning (d5), wrangling (d6), datetime/TS (d7), visualisasi (d8.1–d8.2), EDA (d9), feature engineering (d10), scipy/statsmodels (d11), sklearn (d12), performa (d13), rekayasa kode (d14), SQL & API (d15). Kuat di klasik; celah di tooling 2024–26 & testing.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier/durasi | Skor | F2 |
|---|---|---|---|---|---|---|
| d16-polars | Polars: DataFrame Supercepat untuk Data Besar (kapan tinggalkan pandas) | "polars\|Polars" = tidak ada sama sekali | frameworktraining.co.uk (URL di atas); DataCamp kursus resmi "Introduction to Polars" | intermediate, 50–55 mnt | 2×2×1×2=8 | (a) d4/d6 |
| d17-pytest | pytest: Tes yang Melindungi Analisismu (fixture, parametrize untuk fungsi transformasi) | "pytest" = tidak ada; "testing" di d14 hanya 2 sebutan | pytest.org/en/7.4.x/getting-started.html (assert, fixtures, tmp_path, discovery) | intermediate, 45–50 mnt | 2×2×1×1=4 | (a) d1/d2 |

## 20. AGENTIC AI ENGINEER (15 → +2)

**Cakupan existing:** chatbot→agen, anatomi (ReAct/plan-execute), tool use, memory, RAG-as-tool, multi-agent, prompt, evaluasi (golden tasks/trajectory/LLM-judge), guardrail, LangChain/LangGraph, debugging/tracing, capstone, MCP (aai13), context engineering (aai14), hardening/deploy (aai15). **Semua 3 gap 🔴 Kelompok B TERTUTUP.**

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| aai16-tool-security | Tool Execution Security: Sandbox, Least Privilege & Secret / Eksekusi Tool yang Aman: Sandbox, Izin Minimum, dan Rahasia | AAI-G4 🟡; "sandbox"/"least-privilege" hanya 1 paragraf mitigasi di aai13 | NSA "Model Context Protocol: Security Design Considerations for AI-Driven Automation" (Mei 2026, v1.0): nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.PDF | Tier 1 | 2×3×3×2=36 | (a) aai3, aai13 |
| aai17-a2a-protocol | A2A Protocol: Interop Antar-Agen Lintas Framework / A2A: Ketika Agen Bicara dengan Agen | AAI-G5; "A2A"/"agent-to-agent" = 0 hit | a2aproject.github.io/A2A (open standard; donasi ke Linux Foundation 2026; SDK Python/Go/JS/Java/.NET/Rust) | Tier 1 | 2×3×2×2=24 | (a) aai6, aai13 |

## 21. AI ENGINEERING (13 → +4)

**Cakupan existing:** disiplin AI eng, prompt sistematis, RAG dasar (chunking+cosine), eval LLM (golden set/LLM-judge), fine-tuning (LoRA), structured output, caching/biaya, observability, safety/red-teaming, deploy, UX, capstone, hybrid search+reranking (aie13). Gap 🔴 TERTUTUP.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| aie14-advanced-rag | Advanced RAG: HyDE, Multi-Query & Corrective RAG / RAG Tingkat Lanjut: Ketika Retrieval Biasa Gagal | AIE-G2 🟡; "HyDE\|corrective RAG\|self-RAG\|multi-query" = 0 di aie* | arxiv.org/abs/2401.15884 (CRAG); arxiv.org/abs/2212.10496v1 (HyDE, Gao et al.) | Tier 1 | 3×3×3×2=54 | (a) aie3, aie13 |
| aie15-synthetic-eval-data | Membangun Benchmark: Data Sintetis untuk Evaluasi / Benchmark Buatan Sendiri: Data Sintetis Anti-Kontaminasi | AIE-G3 🟡; "synthetic data\|RAGAS" = 0 di aie*; JD Autodesk eksplisit | github.com/helicone/ragas/blob/HEAD/docs/getstarted/testset_generation.md (TestsetGenerator: Question/Context/Ground_Truth) | Tier 1 | 3×3×3×1=27 | (a) aie4 |
| aie16-embedding-selection | Embedding: Memilih & Fine-Tuning Model / Memilih Otak Retrieval: Benchmark MTEB & Fine-Tune Embedding | baru; "MTEB" hanya 1 sebutan di mle13; "matryoshka" = 0 | huggingface.co/spaces/mteb/leaderboard (+ MTEB arXiv:2210.07316; MMTEB Feb 2025; MTEB v2 Sep 2025; RTEB Okt 2025) | Tier 1 | 3×3×3×2=54 | (a) aie3, aie13 |
| aie17-visual-retrieval | Visual Retrieval: ColPali & Dokumen Multimodal / RAG Tanpa OCR: Retrieval Langsung dari Gambar Dokumen | baru; "colpali\|colqwen" = 0; RAG teks-only gagal di PDF visual | arxiv.org/abs/2407.01449 (ColPali: multi-vector embeddings dari gambar halaman + ViDoRe benchmark; ICLR 2025) | Tier 1 | 2×3×2×2=24 | (a) aie3, aie13 |

GraphRAG (AIE-G4 ⚪) ditunda.

## 22. ML ENGINEER (19 → +3)

**Cakupan existing:** notebook→produksi, data pipeline, reproducible training, evaluasi, serving, monitoring drift, testing, versioning, CI/CD, scaling, cost/latency, fairness, LLM-in-ML, capstone, ML klasik (mle15), HPO Optuna (mle16), experiment tracking (mle17), ML systems design (mle18), SHAP (mle19). Gap 🔴 TERTUTUP. Time series → milik Statistika (a39); causal → Statistika+mk11.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| mle20-recommender-systems | Recommender Systems: Two-Tower Retrieval & Ranking / Mesin Rekomendasi: Dari Matrix Factorization ke Two-Tower | baru; "two-tower\|matrix factorization" = 0; mk8 = sudut bisnis (association rules), bukan engineering | developers.google.com/machine-learning/recommendation; cloud.google.com/blog/products/ai-machine-learning/scaling-deep-retrieval-tensorflow-two-towers-architecture | Tier 1 | 3×3×3×1=27 | (a) mle2, mle4 |
| mle21-ann-vector-search | Vector Search at Scale: HNSW & ANN / Mencari 100 Juta Vektor dalam Milidetik: HNSW | baru; aie3 hanya cosine brute-force; "HNSW\|FAISS\|ScaNN" = 0 di mle* | arxiv.org/abs/1603.09320 (HNSW, Malkov & Yashunin) | Tier 2 | 2×3×3×1=18 | (a) mle5, mle11 |
| mle22-active-learning | Active Learning & Strategi Pelabelan Data / Label Mahal: Memilih Data yang Paling Worth It | baru; "active learning" = 0 di seluruh konten | jujur: sumber primer belum dibuka — gap diverifikasi via grep 0-hit; sumber bangun: Settles "Active Learning Literature Survey" + Snorkel docs (verifikasi saat bangun) | Tier 2 | 2×3×2×1=12 | (a) mle2 |

## 23. DEEP LEARNING ENGINEER (14 → +3)

**Cakupan existing:** lanskap, NN/backprop, CNN, RNN→Transformer, transformer, training/optimizer, transfer learning, GPU/mixed precision, debugging, deploy (kuantisasi/ONNX/TensorRT/distilasi), generative (VAE/GAN/diffusion), capstone, deteksi objek YOLO (dle13), segmentasi U-Net (dle14). Gap 🔴 TERTUTUP.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| dle15-distributed-training | Distributed Training: DDP & FSDP / Training Model 70B: DDP, FSDP & ZeRO | DLE-G2 🟡; "DDP\|FSDP\|DeepSpeed" = 0 di dle* | docs.pytorch.org/docs/main/fsdp.html (update Mei 2026; sharding, CPU offload, mixed precision) | Tier 1 | 3×3×3×1=27 | (a) dle8, mle10 |
| dle16-multimodal-clip | Multimodal: CLIP & Vision-Language / Satu Ruang untuk Gambar & Teks: CLIP | DLE-G3 🟡; "CLIP\|multimodal" hanya sebutan di dle12 | arxiv.org/abs/2103.00020 (CLIP, Radford et al.; 400M pasangan gambar-teks) | Tier 1 | 2×3×2×2=24 | (a) dle3, dle5 |
| dle17-gradcam | Interpretabilitas DL: Grad-CAM & Saliency / Melihat yang Dilihat Model: Grad-CAM | DLE-G4 🟡; "Grad-CAM" hanya 1 hit di dle3 (myth-box) | arxiv.org/abs/1610.02391 (Grad-CAM, Selvaraju et al., ICCV 2017) | Tier 2 | 2×3×2×1=12 | (a) dle3 |

## 24. MLOPS (13 → +3)

**Cakupan existing:** kenapa ops, pipeline/orchestration, feature store, model registry, CI/CD (shadow→canary), serving infra, monitoring, retraining, testing, governance/lineage, K8s, capstone, experiment tracking+DVC (mlops13). Gap 🔴 TERTUTUP.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| mlops14-terraform-iac | Infrastructure as Code: Terraform untuk ML / Infra yang Bisa Di-Version: Terraform | MLOps-G2 🟡; "terraform" = 0 hit di semua file | developer.hashicorp.com/terraform/docs (HCL, CLI workflow, modules, HCP Terraform) | Tier 2 | 2×3×2×1=12 | (a) mlops2, mlops11 |
| mlops15-finops-ml | FinOps untuk ML: Mengendalikan Biaya GPU / Tagihan GPU Rp300 Juta: FinOps | MLOps-G3 🟡; "FinOps" hanya 1 contoh di mlops11 | finops.org/framework/ (principles; phases Inform/Optimize/Operate; refresh 2026 tambah kategori AI/ML) | Tier 1 | 2×3×2×2=24 | (a) mlops11 |
| mlops16-triton-serving | Serving Klasik: Triton & BentoML / Model Server Beneran: Triton | baru; "triton\|bentoml\|kserve\|seldon" = 0 di mlops*; beda kepemilikan dengan vLLM (LLM-only) | github.com/triton-inference-server/server (multi-framework backends, dynamic batching, KServe protocol) | Tier 1 | 3×3×3×1=27 | (a) mlops6 |

## 25. LLMOps (13 → +3)

**Cakupan existing:** kenapa MLOps≠cukup, prompt mgmt, eval berkelanjutan, RAG ops, guardrail (PII/fail-open), biaya (token economics), observability, fine-tune ops, safety ops, canary/rollback, feedback loop, capstone, inference self-hosted vLLM/TGI (llmops13). Gap 🔴 TERTUTUP.

| Slug | Judul | Gap (grep) | Sumber (dibuka) | Tier | Skor | F2 |
|---|---|---|---|---|---|---|
| llmops14-smart-routing | Smart Routing & Fallback antar Model/Provider / Router Cerdas: Model Murah Dulu, Fallback Saat Gagal | LLMOps-G2 🟡; "litellm\|router" = 0 di llmops*; "fallback" sebutan selintas | dev.to/artem42/top-llm-routing-tools-in-2026-architectures-benchmarks-and-production-trade-offs-ife (Bifrost/LiteLLM/OpenRouter/Kong/RouteLLM; fallback chains) | Tier 1 | 3×3×3×2=54 | (a) llmops6, llmops10 |
| llmops15-latency-slo | Latency SLO & Capacity Planning: TTFT/TPOT / SLO Latensi: TTFT, TPOT & Berapa GPU? | LLMOps-G3 🟡; "TTFT\|TPOT" hanya 1 sebutan di aie10; "SLO" selintas di llmops* | learn.microsoft.com/en-us/azure/databricks/machine-learning/foundation-model-apis/prov-throughput-run-benchmark (definisi TTFT/TPOT, tradeoff latency-vs-throughput, autoscaling) | Tier 2 | 2×3×3×1=18 | (a) llmops13 |
| llmops16-speculative-decoding | Speculative Decoding: EAGLE & Draft Model / Decode 3× Lebih Cepat: EAGLE | baru, velocity tinggi; "speculative" = 0 hit relevan | docs.vllm.ai/en/latest/features/speculative_decoding/eagle/ (EAGLE/EAGLE-3; draft models; acceptance rate) | Tier 1 | 2×3×2×2=24 | (a) llmops13 |

---

## MATRIKS KEPEMILIKAN TOPIK LINTAS TRACK (gabungan 6 tim, konflik sudut diselesaikan)

Aturan: topik milik track A hanya boleh DIRUJUK (2–3 kalimat), bukan dibangun ulang, di track B.

| Topik | Track pemilik (lesson) | Track yang hanya merujuk |
|---|---|---|
| Metrik Margin WQB (PnL/$ traded, bps) & uji biaya/kapasitas | WorldQuant Brain (wqb22) | Market Risk (mr13 likuiditas — biaya umum), Portfolio Management (pm-c10 trading & execution — eksekusi umum) |
| Vector data fields WQB (nws12_, scl15_, operator vec_*, ts_backfill) | WorldQuant Brain (wqb23) | Marketing Analytics (mk17 text analytics — teks umum), Agentic AI (LLM atas teks — bukan FASTEXPR) |
| Tab OS / lifecycle alpha pasca-submit & monitoring decay | WorldQuant Brain (wqb24) | MLOps (monitoring model umum — konsep saja) |
| ATOM / Pyramid / Power Pool | WorldQuant Brain (wqb25) | — |
| Backtest overfitting & multiple testing (AFML/de Prado) | Statistika (a28, a38) | WQB (wqb14 merujuk) |
| Time series / regime analysis | Statistika (a39) | WQB (wqb11), MLE (tidak dibangun) |
| Ensemble/blending ML umum | ML Engineer (mle) | WQB (wqb18 merujuk) |
| Factor risk model (BARRA-style) umum | Portfolio Management (pm-b8) | WQB (wqb8 merujuk) |
| Mixed effects / hierarchical models | Statistika (a316) | Credit Risk (pemodelan PD/LGD per segmen), Risk Reporting |
| Quantile regression | Statistika (a317) | Market Risk (aplikasi VaR) |
| DOE faktorial | Statistika (a318) | — (berdampingan a211 A/B di track yang sama) |
| Poisson processes | Probabilitas (b18) | Fraud & AML (kedatangan event), Risk Reporting (model LDA op-risk) |
| MCMC | Probabilitas (b19) | Statistika (a212/b17 — sebutan konseptual) |
| Hidden Markov Models | Probabilitas (b20) | Fraud & AML, Market Risk (deteksi regime — aplikasi) |
| SQL VIEWs | SQL (c19) | Data Engineer, DBA |
| JSON dalam SQL | SQL (c20) | Data Engineer |
| DuckDB | SQL (c21) | Python (interop Polars — sebut), Data Engineer (vs Spark) |
| SQL antipatterns | SQL (c22) | Data Engineer, DBA |
| Polars | Python (d16) | Data Engineer |
| pytest untuk analis | Python (d17) | Data Engineer |
| dbt (transformation-as-code) | Data Engineer (de16) | Data Management (dm5), BI |
| Star schema / dimensional modeling | BI (biz2) | DE (de6), DM (dm2) |
| SQL window function | SQL (c9) | DE (de3), BI (biz3) |
| Dashboard craft | BI (biz4) | RR (rr7 khusus risiko) |
| A/B testing & eksperimen | Statistika (teori); BI (biz10), MK (mk9) penerapan domain | — |
| Data contract | Data Management (dm8) | DE (de8) |
| Data quality framework | Data Management (dm7) | DE (de8), BI (biz9) |
| Metadata & lineage | Data Management (dm10) | DE (de12) |
| Terraform / IaC — platform data | Data Engineer (de18) | DM (dm15 sebutan) |
| Terraform / IaC — ML infra (GPU/K8s/IAM) | MLOps (mlops14) | sudut eksplisit berbeda dari de18 |
| CDC / Debezium | Data Engineer (de19) | DM (dm6), DBA (dba10 sebutan) |
| RBAC platform data | Data Engineer (de20) | DM (dm12) |
| Open table formats | Data Engineer (de21) | — |
| Row-level security | BI (biz17) | — |
| Semantic layer | BI (biz20) | DM (dm14 sebutan) |
| GA4 / server-side / CDP | Marketing Analytics (mk20–22) | — |
| Schema change (Flyway/Liquibase) | DBA (dba15) | DE (de15 CI/CD) |
| DR drill & runbook | DBA (dba16) | — |
| Audit logging database | DBA (dba17) | DM (dm12 sebutan) |
| Connection pooling | DBA (dba18) | — |
| Reference data | Data Management (dm20) | RR (kebutuhan BCBS 239) |
| Document & content management | Data Management (dm21) | — |
| Data sharing & clean room | Data Management (dm22) | MK (konteks measurement) |
| Retensi & defensible deletion | Data Management (dm23) | — |
| Tool execution security (sandbox/least-privilege) | Agentic AI (aai16) | aai9, aie9 (sudut prompt injection) |
| A2A protocol interop | Agentic AI (aai17) | aai6 |
| Advanced RAG (HyDE/CRAG/agentic) | AI Engineering (aie14) | aai5 (kapan retrieve) |
| Synthetic eval data / benchmark | AI Engineering (aie15) | aai8 (golden tasks agen) |
| Embedding selection & fine-tuning | AI Engineering (aie16) | aie3, aie13 |
| Visual/multimodal retrieval (ColPali) | AI Engineering (aie17) | DLE (dle16 — sudut model) |
| Recsys engineering (two-tower) | ML Engineer (mle20) | MK (mk8 — sudut bisnis) |
| ANN/HNSW vector search | ML Engineer (mle21) | aie3 (cosine dasar) |
| Active learning / labeling | ML Engineer (mle22) | mle2 |
| DDP/FSDP distributed training | Deep Learning (dle15) | MLE (mle10 — sudut generik) |
| CLIP / vision-language | Deep Learning (dle16) | aie17 (sudut retrieval) |
| Grad-CAM / saliency | Deep Learning (dle17) | mle19 (interpretability klasik) |
| FinOps untuk ML | MLOps (mlops15) | LLMOps (llmops6 token economics), MLE (mle11) |
| Triton/BentoML serving klasik | MLOps (mlops16) | mlops6; LLMOps (llmops13 — beda mesin: vLLM/TGI khusus LLM) |
| vLLM self-hosted inference | LLMOps (llmops13, existing) | mlops6 (tidak dibangun di mlops) |
| Smart routing & fallback | LLMOps (llmops14) | aie10 |
| Latency SLO & capacity (TTFT/TPOT) | LLMOps (llmops15) | llmops13, mlops7 |
| Speculative decoding | LLMOps (llmops16) | llmops13 |
| CDS / credit derivatives | Credit Risk (cr32) | MR (mr14 CVA) merujuk sudut transfer risiko |
| Basel III Final / output floor | Credit Risk (cr33) | RR (rr26 sudut KPMM); MR (mr16 sudut modal pasar) |
| TKBI / kredit hijau | Credit Risk (cr34) | RR (rr21 ISSB) sudut disclosure |
| NMRF & PLAT (FRTB-IMA) | Market Risk (mr25) | — |
| Tail risk hedging | Market Risk (mr26) | PM (pm-c9 derivatives overlay) merujuk |
| ICAAP | Risk Reporting (rr25) | — |
| KPMM/CAR reporting | Risk Reporting (rr26) | CR (cr4a sudut komputasi RWA) |
| Real estate / REIT | Financial Markets (e19) | PM (pm-a9 tetap overview alternatives) |
| Asuransi & dana pensiun | Financial Markets (e20) | — |
| Investment banking | Financial Markets (e21) | — |
| Reksa dana & ETF | Financial Markets (e22) | PM (pm-a6/a10) merujuk kendaraan investasi |
| Factor investing | Portfolio Management (pm-d7) | FM (e9 CAPM) merujuk |
| Risk parity / risk budgeting | Portfolio Management (pm-d8) | — |
| CPPI | Portfolio Management (pm-d9) | MR (mr26) merujuk proteksi ekor |
| Rebalancing | Portfolio Management (pm-d10) | — |
| BO deep-dive | AML (aml20) | — |
| Proliferation financing | AML (aml21) | — |
| Fraud loss reporting | FR (fr24) | — |
| Mendelian randomization (sudut epidemiologi klinis) | Health DS (hd24) | BI (bi12 sebagai sumber instrumen); Statistika tidak mengklaim |
| Pharmacogenomics (star allele → aksi klinis) | Bioinformatika (bi23) | HD (hd12 validasi model prediksi) merujuk |
| Stablecoin analytics (pengukuran peg on-chain) | BCD (bcd16) | MR (mr21 framing risiko pasar) merujuk; AML tidak masuk |
| DeFi laundering (mixer, chain-hopping, typologi) | AML (aml18, sudut penegakan FATF-2026) | BCD (bcd13 teknik bridge tracing) merujuk |
| Survival analysis (Kaplan-Meier, Cox) | Statistika (a312, metode umum) | HD (hd6 sudut klinis) — refer silang |
| Causal inference umum (IV, DiD, RDD) | Statistika (a213/a313) | HD (hd10/hd24 sudut kesehatan), MK (mk11 uplift) merujuk |
| Time-series anomaly detection | FR (fr16 sudut fraud) + BCD (bcd21 sudut data-feed/protokol) | beda domain eksplisit |

**Satu konflik antar-tim diselesaikan:** Terraform diusulkan dua tim independen (de18 + mlops14). Dipisahkan sudut eksplisit: de18 = IaC untuk *platform data*; mlops14 = IaC untuk *ML infra* (GPU cluster, bucket, IAM). Keduanya boleh ada dengan pembeda sudut di lesson.

## BATAS & KEJUJURAN SUMBER
- Foundation, Risk Core, AI/ML: semua URL sumber benar-benar dibuka (bukan hasil search mentah).
- Data Platform: beberapa sumber jujur BELUM dibuka saat audit — dama.org (DMBOK), debezium.io, pgbouncer docs, tren industri dm22/biz20/mk22, URL jobleads BI tidak tersedia penuh; beberapa JD terverifikasi 2026-10-14 di GAP_ANALYSIS dan tidak dibuka ulang (dinyatakan eksplisit). Wajib verifikasi saat bangun.
- Health/Science/Blockchain: riset via `browser.search` (snippets + URL verbatim hasil search); tidak ada halaman dibuka penuh via `browser.open`. Tidak ada klaim isi di luar dukungan snippet.
- WQB: dokumentasi WQB primer (worldquantbrain.com) butuh login — dipakai mirror GitHub (brain-mcp-docs, worldquantalpha, ImprovingAlphas.md) yang terbuka.
- Septian tidak memberi ebook baru untuk audit ini; bedah ebook per track (TOC resmi penerbit) menjadi tugas tahap bangun, bukan audit.

## BUKTI VERIFIKASI (perintah yang dijalankan)
- `python3` ekstraksi `slug:`/`track:`/`title:` dari 519 file `.ts` → `/tmp/inventory.json` — hitung per track, duplikat judul = 0.
- `grep -rli "<keyword>" ~/workspace/learn-platform/src/app/v2/content/` per kandidat (hasil dicatat di tabel: "nol total" / "hanya sebutan di file X" / "cuma di lesson Y").
- `ls <prefix><nomor>-*.ts` per slug usulan — 88/88 = 0 file (tidak tabrakan).
- Nomor maks per prefix terverifikasi: a315, aai15, aie13, aml19, b17, bcd15, bi18, biz17, c18, cr31, d15, dba14, de17, dle14, dm19, e18, fr23, hd20, llmops13, mk19, mle19, mlops13, mr24, rr24, wqb21.
- Catatan koreksi: tim AI/ML melaporkan total 17 dengan rincian 2+4+3+3+3+3 — aritmetikanya salah; jumlah benar = **18** (13 Tier 1 + 5 Tier 2). Dipakai di laporan ini.

## FILE
- Laporan ini: `~/workspace/learn-platform/AUDIT_GAP_SEMUA_TRACK_2026-10-15.md`
- Draft parsial per tim (dapat dihapus setelah verifikasi): `/tmp/audit_wqb_partial.md`, `/tmp/audit_data_platform_partial.md`, `/tmp/audit_health_partial.md`, `/tmp/audit_risk_partial.md`, `/tmp/audit_foundation_partial.md`; inventory `/tmp/inventory.json`.

## STATUS
FASE RISET SELESAI. Tidak ada lesson ditulis, tidak ada kode/konten diubah. Menunggu keputusan parent/Septian untuk tahap BANGUN (termasuk persetujuan gelombang dan sumber bedah ebook per track).
