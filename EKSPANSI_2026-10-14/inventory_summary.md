# Inventarisasi Lesson Learn v2

*Dibuat: 2026-10-14 · read-only, tanpa mengubah satu file pun.*
Sumber: `src/app/v2/content/` (diparsing via TypeScript AST), cross-check ke `src/app/v2/lib/reg-*.ts` + `registry.ts`.

## Ringkasan total

| Metrik | Nilai |
|---|---|
| File content | 473 |
| Lesson terparse | 473 |
| Entri registrasi (reg-*) | 473 |
| Track | 24 |
| Total step | 3580 |
| Total lab (step dgn code) | 1010 |
| Total kuis (item quiz) | 2638 |
| Total figure (SVG) | 218 |
| Total rumus (formula KaTeX) | 599 |
| Total estMinutes | 23725 |
| Rentang estMinutes per lesson | 45–75 mnt |

## Hasil cross-check registry

- **Anomali ditemukan: 0**
- Duplikat slug antar file: 0
- Slug reg ganda lintas reg-*.ts: 0
- Slug reg ≠ field slug di file: 0 (semua cocok)
- File content tanpa import di reg manapun: 0
- Import reg menunjuk file yang tidak ada: 0
- REG_* tidak di-import / tidak di-spread di registry.ts: 0
- Field lesson hilang (slug/track/module/title/estMinutes): 0

## Per track

| # | Track | Lesson | Rentang nomor slug | estMinutes (total) |
|---|---|---|---|---|
| 1 | AI Engineering | 13 | aie1–aie13 | 675 |
| 2 | Agentic AI Engineer | 15 | aai1–aai15 | 790 |
| 3 | Bioinformatika | 18 | bi1–bi18 | 840 |
| 4 | Blockchain Data Scientist | 15 | bcd1–bcd15 | 790 |
| 5 | Business Intelligence | 17 | biz1–biz17 | 890 |
| 6 | Credit Risk | 29 | cr1–cr25 (+sufiks ab) | 1320 |
| 7 | Data Engineer | 17 | de1–de17 | 890 |
| 8 | Data Management | 20 | dm1–dm19 (+sufiks ab) | 930 |
| 9 | Database Administrator | 14 | dba1–dba14 | 735 |
| 10 | Deep Learning Engineer | 14 | dle1–dle14 | 710 |
| 11 | Financial Markets | 18 | e1–e18 | 925 |
| 12 | Fraud & AML Analytics | 34 | aml1–aml11; fr1–fr23 | 1620 |
| 13 | Health Data Science | 20 | hd1–hd20 | 975 |
| 14 | LLMOps | 13 | llmops1–llmops13 | 695 |
| 15 | MLOps | 13 | mlops1–mlops13 | 660 |
| 16 | Machine Learning Engineer | 19 | mle1–mle19 | 1010 |
| 17 | Market Risk | 19 | mr1–mr19 | 970 |
| 18 | Marketing Analytics | 19 | mk1–mk19 | 980 |
| 19 | Portfolio Management | 36 |  | 1935 |
| 20 | Probabilitas | 19 | b1–b17 | 1045 |
| 21 | Python | 16 | d1–d15 | 780 |
| 22 | Risk Reporting | 18 | rr1–rr18 | 950 |
| 23 | SQL | 19 | c1–c18 | 900 |
| 24 | Statistika | 38 | a11–a315 | 1710 |

### AI Engineering (13 lesson)

Module: Fondasi (2) · Produksi (7) · RAG & Retrieval (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `aie1-lanskap` | AIE1 — AI Engineering sebagai Disiplin | Fondasi | 50 | 7 | 2 | 5 | 1 | 2 |
| `aie10-deploy` | AIE10 — Deploy Aplikasi LLM | Produksi | 50 | 8 | 2 | 5 | 1 | 1 |
| `aie11-ux` | AIE11 — UX untuk AI | Produksi | 50 | 8 | 2 | 5 | 1 | 2 |
| `aie12-capstone` | AIE12 — Capstone: Aplikasi RAG Mini Produksi | Produksi | 60 | 8 | 2 | 5 | 1 | 1 |
| `aie13-hybrid-search-reranking` | AIE13 — Hybrid Search + Reranking untuk RAG | Produksi | 50 | 7 | 1 | 5 | 1 | 2 |
| `aie2-prompt` | AIE2 — Prompt Engineering Sistematis | Fondasi | 50 | 7 | 2 | 5 | 1 | 1 |
| `aie3-rag` | AIE3 — RAG: Chunking, Embedding, Retrieval | RAG & Retrieval | 55 | 8 | 2 | 5 | 1 | 2 |
| `aie4-eval` | AIE4 — Evaluasi LLM | RAG & Retrieval | 55 | 8 | 2 | 5 | 1 | 1 |
| `aie5-finetuning` | AIE5 — Fine-Tuning: Kapan dan Bagaimana | RAG & Retrieval | 50 | 7 | 2 | 5 | 1 | 1 |
| `aie6-structured` | AIE6 — Structured Output dan Function Calling | RAG & Retrieval | 50 | 8 | 2 | 5 | 1 | 1 |
| `aie7-caching` | AIE7 — Caching, Batching, Optimasi Biaya | Produksi | 50 | 8 | 2 | 5 | 1 | 1 |
| `aie8-observability` | AIE8 — Observability untuk Aplikasi LLM | Produksi | 50 | 8 | 2 | 5 | 1 | 1 |
| `aie9-safety` | AIE9 — Safety: Prompt Injection dan Red Teaming | Produksi | 55 | 8 | 2 | 5 | 1 | 1 |

### Agentic AI Engineer (15 lesson)

Module: Fondasi Agen (3) · Operasi & Evaluasi (8) · Arsitektur (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `aai1-lanskap` | AAI1 — Dari Chatbot ke Agen | Fondasi Agen | 50 | 6 | 1 | 5 | 1 | 1 |
| `aai10-framework` | AAI10 — Framework: LangChain/LangGraph & Alternatif | Operasi & Evaluasi | 50 | 6 | 1 | 5 | 1 | 1 |
| `aai11-debugging` | AAI11 — Debugging Agen: Tracing & Observability | Operasi & Evaluasi | 55 | 6 | 1 | 5 | 1 | 1 |
| `aai12-capstone` | AAI12 — Capstone: Agen Analisis End-to-End | Operasi & Evaluasi | 60 | 7 | 2 | 5 | 1 | 1 |
| `aai13-mcp` | AAI13 — MCP: Satu Protokol untuk Semua Tool | Operasi & Evaluasi | 50 | 7 | 1 | 5 | 1 | 2 |
| `aai14-context-engineering` | AAI14 — Context Engineering: Merawat Memori Agen | Operasi & Evaluasi | 50 | 7 | 1 | 5 | 1 | 2 |
| `aai15-hardening-deploy` | AAI15 — Hardening & Deploy Agen ke Produksi | Operasi & Evaluasi | 50 | 7 | 1 | 5 | 1 | 2 |
| `aai2-anatomi` | AAI2 — Anatomi Agen | Fondasi Agen | 50 | 6 | 1 | 5 | 1 | 1 |
| `aai3-tool-use` | AAI3 — Tool Use & Function Calling | Fondasi Agen | 55 | 6 | 1 | 5 | 1 | 1 |
| `aai4-memory` | AAI4 — Memory: Ingatan Jangka Pendek & Panjang | Arsitektur | 55 | 6 | 1 | 5 | 1 | 1 |
| `aai5-rag-agent` | AAI5 — RAG sebagai Tool | Arsitektur | 50 | 6 | 1 | 5 | 1 | 1 |
| `aai6-multi-agent` | AAI6 — Multi-Agent: Orkestrasi & Komunikasi | Arsitektur | 55 | 6 | 1 | 5 | 1 | 1 |
| `aai7-prompt` | AAI7 — Prompt Engineering untuk Agen | Arsitektur | 50 | 6 | 1 | 5 | 1 | 1 |
| `aai8-evaluasi` | AAI8 — Evaluasi Agen | Operasi & Evaluasi | 55 | 6 | 1 | 5 | 1 | 1 |
| `aai9-guardrail` | AAI9 — Guardrail & Human-in-the-Loop | Operasi & Evaluasi | 55 | 6 | 1 | 5 | 1 | 1 |

### Bioinformatika (18 lesson)

Module: Fondasi (5) · NGS & Statistik (3) · Omics Lanjutan (1) · Genetika Populasi (1) · Epigenomik (1) · Metagenomik (1) · Proteomik & Multi-Omics (1) · Machine Learning (1) · Reprodusibilitas & Etika (1) · Capstone (1) · Sekuens & Evolusi (2)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `bi1-biologi-molekuler` | BI1 · DNA, RNA, Protein: Central Dogma | Fondasi | 45 | 7 | 2 | 5 | 0 | 1 |
| `bi10-statistik-bioinfo` | BI10 · FDR & Batch Effect: Statistik yang Menyelamatkanmu | NGS & Statistik | 45 | 6 | 2 | 5 | 0 | 1 |
| `bi11-single-cell` | BI11 · Single-Cell RNA-seq: Seurat, UMAP & Trajectory | Omics Lanjutan | 45 | 6 | 2 | 5 | 0 | 0 |
| `bi12-genomika-populasi` | BI12 · GWAS & Polygenic Score: Genetika Populasi | Genetika Populasi | 45 | 6 | 2 | 5 | 0 | 2 |
| `bi13-epigenomik` | BI13 · Epigenomik: ChIP-seq & Metilasi | Epigenomik | 45 | 6 | 2 | 5 | 0 | 1 |
| `bi14-metagenomik` | BI14 · Metagenomik: 16S & Komposisi | Metagenomik | 45 | 6 | 2 | 5 | 0 | 1 |
| `bi15-proteomik` | BI15 · Proteomik & Multi-Omics: AlphaFold dan Integrasi | Proteomik & Multi-Omics | 45 | 6 | 2 | 5 | 0 | 0 |
| `bi16-ml-bio` | BI16 · Machine Learning untuk Biologi: Prediksi & Overfitting | Machine Learning | 45 | 6 | 2 | 5 | 0 | 0 |
| `bi17-reprodusibilitas` | BI17 · Reprodusibilitas & Etika: Workflow dan Tanggung Jawab | Reprodusibilitas & Etika | 45 | 6 | 2 | 5 | 0 | 0 |
| `bi18-capstone-de` | BI18 · Capstone: Mini-Proyek Differential Expression | Capstone | 75 | 7 | 4 | 5 | 0 | 0 |
| `bi2-database` | BI2 · NCBI, Ensembl, UniProt: Perpustakaan Data Biologi | Fondasi | 45 | 7 | 2 | 5 | 0 | 0 |
| `bi3-format-data` | BI3 · FASTA, FASTQ, VCF: Format File Genomik | Fondasi | 45 | 7 | 2 | 5 | 0 | 1 |
| `bi4-command-line` | BI4 · Terminal, Git & Nextflow: Senjata Wajib | Fondasi | 45 | 7 | 2 | 5 | 0 | 0 |
| `bi5-biopython-r` | BI5 · Biopython & R: Ngoding untuk Biologi | Fondasi | 45 | 6 | 2 | 5 | 0 | 0 |
| `bi6-alignment` | BI6 · Alignment & BLAST: Menyelaraskan Sekuens | Sekuens & Evolusi | 45 | 8 | 2 | 5 | 0 | 1 |
| `bi7-filogenetika` | BI7 · Filogenetika & k-mer: Pohon Kehidupan dari Data | Sekuens & Evolusi | 45 | 7 | 2 | 5 | 0 | 1 |
| `bi8-ngs-pipeline` | BI8 · QC sampai Variant Calling: Pipeline NGS End-to-End | NGS & Statistik | 45 | 7 | 2 | 5 | 0 | 2 |
| `bi9-rna-seq` | BI9 · RNA-seq: Gen Apa yang Berubah | NGS & Statistik | 45 | 6 | 2 | 5 | 0 | 1 |

### Blockchain Data Scientist (15 lesson)

Module: Fondasi On-Chain (4) · Investigasi & Risiko (5) · Analisis Lanjutan (6)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `bcd1-lanskap` | BCD1 — Apa yang Bisa Dianalisis On-Chain | Fondasi On-Chain | 50 | 8 | 1 | 6 | 2 | 2 |
| `bcd10-graph` | BCD10 — Graph Analysis Aliran Dana | Investigasi & Risiko | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd11-risk` | BCD11 — Risk Scoring Wallet & AML On-Chain | Investigasi & Risiko | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd12-capstone` | BCD12 — Capstone: Investigasi Aliran Dana | Investigasi & Risiko | 60 | 9 | 1 | 6 | 2 | 2 |
| `bcd13-cross-chain` | BCD13 — Cross-Chain & Bridge Tracing | Investigasi & Risiko | 50 | 8 | 1 | 6 | 1 | 2 |
| `bcd14-indexing-skala-besar` | BCD14 — Indexing Skala Besar (Subgraph/BigQuery) | Analisis Lanjutan | 50 | 8 | 1 | 6 | 1 | 2 |
| `bcd15-oracle-literacy` | BCD15 — Oracle Literacy (Chainlink) | Analisis Lanjutan | 50 | 8 | 1 | 6 | 1 | 2 |
| `bcd2-data` | BCD2 — Membaca Data Chain | Fondasi On-Chain | 50 | 9 | 1 | 6 | 2 | 2 |
| `bcd3-address` | BCD3 — Address Clustering & Entity Labeling | Fondasi On-Chain | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd4-defi` | BCD4 — Analisis DeFi | Fondasi On-Chain | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd5-token` | BCD5 — Tokenomics & Distribusi | Analisis Lanjutan | 50 | 9 | 1 | 6 | 2 | 2 |
| `bcd6-nft` | BCD6 — Data NFT: Wash Trading & Valuasi | Analisis Lanjutan | 50 | 8 | 1 | 6 | 2 | 2 |
| `bcd7-fraud` | BCD7 — Deteksi Fraud On-Chain | Analisis Lanjutan | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd8-mev` | BCD8 — MEV: Konsep & Deteksi | Analisis Lanjutan | 55 | 9 | 1 | 6 | 2 | 2 |
| `bcd9-sql` | BCD9 — SQL untuk Data Chain (Gaya Dune) | Investigasi & Risiko | 50 | 10 | 1 | 6 | 2 | 2 |

### Business Intelligence (17 lesson)

Module: Fondasi BI (4) · Operasi & Governance (6) · Power BI Mendalam (3) · Insight & Komunikasi (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `biz1-lanskap` | BI1 — BI: Dari Data ke Keputusan | Fondasi BI | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz10-eksperimen` | BI10 — Eksperimen & A/B untuk Insight | Operasi & Governance | 55 | 10 | 2 | 6 | 1 | 1 |
| `biz11-governance` | BI11 — Governance: Satu Definisi Metrik | Operasi & Governance | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz12-embedded` | BI12 — Embedded Analytics | Operasi & Governance | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz13-ai` | BI13 — AI dalam BI | Operasi & Governance | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz14-capstone` | BI14 — Capstone: BI Suite Satu Perusahaan | Operasi & Governance | 60 | 10 | 2 | 6 | 1 | 1 |
| `biz15-dax` | BI15 — DAX: Ukuran yang Tahu Konteks | Power BI Mendalam | 50 | 12 | 2 | 5 | 1 | 3 |
| `biz16-power-query` | BI16 — Power Query: Dapur Data | Power BI Mendalam | 50 | 11 | 2 | 5 | 1 | 1 |
| `biz17-rls-service` | BI17 — RLS + Administrasi Power BI Service | Power BI Mendalam | 50 | 11 | 2 | 5 | 1 | 2 |
| `biz2-modeling` | BI2 — Data Modeling: Star Schema | Fondasi BI | 55 | 10 | 2 | 6 | 1 | 1 |
| `biz3-sql` | BI3 — SQL Analitik untuk BI | Fondasi BI | 55 | 10 | 2 | 6 | 1 | 1 |
| `biz4-dashboard` | BI4 — Dashboard yang Dipakai | Fondasi BI | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz5-kpi` | BI5 — KPI yang Tidak Bisa Di-gaming | Insight & Komunikasi | 55 | 10 | 2 | 6 | 1 | 1 |
| `biz6-self-service` | BI6 — Self-Service BI | Insight & Komunikasi | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz7-storytelling` | BI7 — Data Storytelling untuk Eksekutif | Insight & Komunikasi | 50 | 10 | 2 | 6 | 1 | 1 |
| `biz8-adhoc` | BI8 — Analisis Adhoc yang Cepat & Benar | Insight & Komunikasi | 55 | 10 | 2 | 6 | 1 | 1 |
| `biz9-quality` | BI9 — Data Quality untuk BI | Operasi & Governance | 55 | 10 | 2 | 6 | 1 | 1 |

### Credit Risk (29 lesson)

Module: Pondasi Kredit (1) · Scorecard & Pemodelan PD (6) · LGD, EAD & ECL (4) · Risiko Portofolio & Stress Testing (2) · Kredit Korporasi (3) · Validasi & Monitoring (2) · Kinerja & Analisis Portofolio (6) · Pricing & Collection (2) · Regulasi & Fairness (2) · Capstone (1)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `cr1-produk-kredit` | CR1 — Produk Kredit, 5C, dan Siklusnya | Pondasi Kredit | 45 | 8 | 3 | 5 | 0 | 1 |
| `cr10-pd-modeling` | CR10 — PD Modeling: TTC, PIT & Lifetime | Scorecard & Pemodelan PD | 45 | 9 | 2 | 5 | 0 | 2 |
| `cr11-forward-looking` | CR11 — Forward-Looking: Satelit, Skenario & Overlay | Scorecard & Pemodelan PD | 45 | 8 | 2 | 5 | 0 | 2 |
| `cr12-lgd` | CR12 — LGD: Dari Agunan ke Recovery | LGD, EAD & ECL | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr13-ead-ccf` | CR13 — EAD & CCF: Risiko yang Tidur | LGD, EAD & ECL | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr14a-ecl-staging` | CR14A — ECL: Mesin Lima Komponen & Staging | LGD, EAD & ECL | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr14b-ecl-perhitungan` | CR14B — ECL: Perhitungan, Jurnal & Backtest | LGD, EAD & ECL | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr15-risiko-portofolio` | CR15 — Risiko Portofolio: Konsentrasi & Korelasi | Risiko Portofolio & Stress Testing | 45 | 8 | 2 | 5 | 0 | 2 |
| `cr16-stress-testing` | CR16 — Stress Testing | Risiko Portofolio & Stress Testing | 45 | 8 | 2 | 5 | 0 | 0 |
| `cr17a-corporate-credit-1` | CR17A — Kredit Korporasi 1: Membaca Laporan Keuangan | Kredit Korporasi | 45 | 8 | 2 | 5 | 0 | 0 |
| `cr17b-corporate-credit-2` | CR17B — Kredit Korporasi 2: Air Terjun Kas & Covenant | Kredit Korporasi | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr18-industry-country-risk` | CR18 — Risiko Industri & Negara | Kredit Korporasi | 45 | 8 | 2 | 5 | 0 | 0 |
| `cr19-validasi-model` | CR19 — Validasi Model | Validasi & Monitoring | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr2-kolektibilitas` | CR2 — DPD & Kolektibilitas | Kinerja & Analisis Portofolio | 45 | 8 | 2 | 5 | 0 | 2 |
| `cr20-monitoring-kri` | CR20 — Monitoring & KRI | Validasi & Monitoring | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr21-pricing-risiko` | CR21 — Pricing Risiko | Pricing & Collection | 45 | 8 | 2 | 5 | 0 | 2 |
| `cr22-collection-recovery` | CR22 — Collection & Recovery | Pricing & Collection | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr23-regulasi-indonesia` | CR23 — Regulasi Indonesia | Regulasi & Fairness | 45 | 8 | 2 | 5 | 0 | 0 |
| `cr24-fairness-explainability` | CR24 — Fairness & Explainability | Regulasi & Fairness | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr25-capstone` | CR25 — Capstone: Analisis Kredit End-to-End | Capstone | 60 | 9 | 2 | 5 | 0 | 0 |
| `cr3-pd-lgd-ead` | CR3 — PD, LGD, EAD: Harga Risiko | Kinerja & Analisis Portofolio | 45 | 9 | 2 | 5 | 0 | 1 |
| `cr4a-basel-rwa-kpmm` | CR4A — Basel: Dari Aset Menjadi Modal | Kinerja & Analisis Portofolio | 45 | 9 | 2 | 5 | 0 | 2 |
| `cr4b-ifrs9-psak71` | CR4B — IFRS 9 / PSAK 71: Cadangan Masa Depan | Kinerja & Analisis Portofolio | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr5-definisi-default` | CR5 — Definisi Default: Fondasi Model PD | Kinerja & Analisis Portofolio | 45 | 8 | 2 | 5 | 0 | 0 |
| `cr6-analisis-portofolio` | CR6 — Analisis Portofolio: Vintage & Roll Rate | Kinerja & Analisis Portofolio | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr7a-application-scorecard-1` | CR7A — Application Scorecard 1: Binning & WoE | Scorecard & Pemodelan PD | 45 | 8 | 2 | 5 | 0 | 2 |
| `cr7b-application-scorecard-2` | CR7B — Application Scorecard 2: Skor & Cut-off | Scorecard & Pemodelan PD | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr8-reject-inference` | CR8 — Reject Inference: Nasib yang Ditolak | Scorecard & Pemodelan PD | 45 | 8 | 2 | 5 | 0 | 1 |
| `cr9-behavioral-scorecard` | CR9 — Behavioral Scorecard & Early Warning | Scorecard & Pemodelan PD | 45 | 8 | 2 | 5 | 0 | 0 |

### Data Engineer (17 lesson)

Module: Fondasi Pipeline (5) · Platform Data (5) · Operasi & Kualitas (4) · Software Engineering untuk Data (3)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `de1-lanskap` | DE1 — Data Engineering: Fondasi Semua Analitik | Fondasi Pipeline | 50 | 9 | 2 | 6 | 2 | 1 |
| `de10-spark` | DE10 — Spark: Distributed Processing | Platform Data | 55 | 9 | 2 | 7 | 1 | 1 |
| `de11-cost` | DE11 — Cost & Performance Tuning | Operasi & Kualitas | 50 | 9 | 2 | 7 | 1 | 1 |
| `de12-governance` | DE12 — Governance: Katalog & Lineage | Operasi & Kualitas | 50 | 9 | 2 | 7 | 1 | 1 |
| `de13-realtime` | DE13 — Real-Time untuk Analitik | Operasi & Kualitas | 50 | 9 | 2 | 7 | 1 | 1 |
| `de14-capstone` | DE14 — Capstone: Platform Data Mini | Operasi & Kualitas | 60 | 8 | 2 | 8 | 1 | 1 |
| `de15-cicd` | DE15 — CI/CD untuk Data Pipeline | Software Engineering untuk Data | 50 | 12 | 2 | 5 | 1 | 3 |
| `de16-dbt` | DE16 — dbt: Transformasi sebagai Kode | Software Engineering untuk Data | 50 | 12 | 2 | 5 | 1 | 1 |
| `de17-backfill` | DE17 — Backfill & Replay yang Aman | Software Engineering untuk Data | 50 | 12 | 2 | 5 | 1 | 2 |
| `de2-pipeline` | DE2 — Merancang Pipeline: Batch vs Streaming | Fondasi Pipeline | 50 | 9 | 2 | 7 | 1 | 1 |
| `de3-sql` | DE3 — SQL Lanjutan untuk DE | Fondasi Pipeline | 55 | 9 | 2 | 6 | 2 | 1 |
| `de4-python` | DE4 — Python untuk Pipeline | Fondasi Pipeline | 50 | 9 | 2 | 7 | 1 | 1 |
| `de5-storage` | DE5 — Warehouse vs Lake vs Lakehouse | Fondasi Pipeline | 50 | 9 | 2 | 7 | 1 | 1 |
| `de6-modeling` | DE6 — Data Modeling: Dimensional & Data Vault | Platform Data | 55 | 9 | 2 | 7 | 1 | 1 |
| `de7-orchestration` | DE7 — Orchestration: DAG & Scheduling | Platform Data | 55 | 9 | 2 | 7 | 1 | 1 |
| `de8-quality` | DE8 — Data Quality: Test & Contract | Platform Data | 55 | 9 | 2 | 7 | 1 | 1 |
| `de9-streaming` | DE9 — Streaming: Konsep Kafka | Platform Data | 55 | 9 | 2 | 7 | 1 | 1 |

### Data Management (20 lesson)

Module: Fondasi (2) · Tata Kelola (3) · Keamanan & Risiko (2) · Arsitektur (2) · Analitik (1) · Strategi (1) · Komputasi (1) · Capstone (1) · Penyimpanan (3) · Pipeline (2) · Kualitas & Kontrak (2)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `dm1-data-lifecycle` | Siklus Hidup Data: Dari Log Mentah ke Keputusan Direksi | Fondasi | 45 | 7 | 1 | 5 | 0 | 0 |
| `dm10-metadata-lineage` | Metadata & Lineage: Peta Harta Karun Dataran Data | Tata Kelola | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm11-master-data` | Master Data & Golden Record: Satu Kebenaran untuk Tiap Entitas | Tata Kelola | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm12-keamanan-privasi` | Keamanan & Privasi Data: Benteng di Sekeliling Harta Karun | Keamanan & Risiko | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm13-data-risiko-regulasi` | Data untuk Risiko & Regulasi: Ketika Angka Harus Bisa Dipertahankan | Keamanan & Risiko | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm14-arsitektur-modern` | Arsitektur Modern: Mesh, Produk Data & Toko Fitur | Arsitektur | 45 | 9 | 1 | 5 | 0 | 0 |
| `dm15-cloud-dataops` | Cloud & DataOps: Infrastruktur sebagai Kode, Tagihan Terkendali | Arsitektur | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm16-bi-analytics-engineering` | BI & Analytics Engineering: Dari Dashboard Liar ke Angka Resmi | Analitik | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm17-strategi-data` | Strategi Data: Dari Proyek Teknologi ke Senjata Bisnis | Strategi | 45 | 9 | 1 | 5 | 0 | 0 |
| `dm18-spark-pyspark` | Spark & PySpark: Mesin Data Raksasa yang Wajib Dikuasai | Komputasi | 45 | 8 | 1 | 5 | 0 | 1 |
| `dm19-capstone-dwh` | Capstone: Mini Data Warehouse dari Nol sampai Dipercaya | Capstone | 75 | 8 | 1 | 5 | 0 | 0 |
| `dm2-pemodelan-data` | Pemodelan Data: Dari Coretan ER ke Star Schema | Fondasi | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm3a-database-relasional` | Database Relasional & ACID: Penjaga Uang yang Tidak Pernah Tidur | Penyimpanan | 45 | 8 | 2 | 5 | 0 | 0 |
| `dm3b-database-nosql` | NoSQL, BASE & CAP: Ketika Satu Server Tidak Lagi Cukup | Penyimpanan | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm4-data-warehouse` | Warehouse & Lakehouse: Rumah Kedua untuk Data Analitik | Penyimpanan | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm5-orkestrasi-dbt` | Orkestrasi & dbt: Pipelinemu Butuh Konduktor | Pipeline | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm6-batch-streaming` | Batch vs Streaming: Koran Pagi Ini atau Kabar Detik Ini? | Pipeline | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm7-kualitas-data` | Kualitas Data: Garbage In, Keputusan Ngaco Out | Kualitas & Kontrak | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm8-data-contract` | Data Contract & SLA: Perjanjian Tertulis Antar Tim Data | Kualitas & Kontrak | 45 | 8 | 1 | 5 | 0 | 0 |
| `dm9-governance` | Data Governance: Siapa Berhak Memutuskan soal Data? | Tata Kelola | 45 | 8 | 1 | 5 | 0 | 0 |

### Database Administrator (14 lesson)

Module: Fondasi Operasi (4) · Skala & Cloud (4) · Operasi & Keandalan (2) · Keandalan & Performa (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `dba1-lanskap` | DBA1 — DBA di Era Cloud | Fondasi Operasi | 50 | 9 | 2 | 6 | 1 | 1 |
| `dba10-migrasi` | DBA10 — Migrasi & Upgrade Tanpa Downtime | Skala & Cloud | 55 | 10 | 2 | 6 | 1 | 0 |
| `dba11-cloud` | DBA11 — Managed Database di Cloud | Skala & Cloud | 50 | 10 | 2 | 6 | 1 | 0 |
| `dba12-capstone` | DBA12 — Capstone: Operasional Database Produksi | Skala & Cloud | 60 | 10 | 2 | 7 | 1 | 1 |
| `dba13-otomasi` | DBA13 — Otomasi & Scripting untuk DBA | Operasi & Keandalan | 50 | 12 | 2 | 5 | 1 | 1 |
| `dba14-partitioning` | DBA14 — Partitioning | Operasi & Keandalan | 50 | 12 | 2 | 5 | 1 | 1 |
| `dba2-arsitektur` | DBA2 — Arsitektur Database | Fondasi Operasi | 55 | 9 | 2 | 6 | 1 | 1 |
| `dba3-instalasi` | DBA3 — Instalasi & Konfigurasi | Fondasi Operasi | 50 | 10 | 2 | 6 | 1 | 1 |
| `dba4-backup` | DBA4 — Backup & Recovery: RPO/RTO | Fondasi Operasi | 55 | 10 | 2 | 6 | 1 | 1 |
| `dba5-replikasi` | DBA5 — Replikasi & High Availability | Keandalan & Performa | 55 | 9 | 2 | 6 | 1 | 1 |
| `dba6-performa` | DBA6 — Performance Tuning | Keandalan & Performa | 55 | 10 | 2 | 6 | 1 | 1 |
| `dba7-keamanan` | DBA7 — Keamanan Database | Keandalan & Performa | 50 | 11 | 2 | 6 | 1 | 0 |
| `dba8-monitoring` | DBA8 — Monitoring & Alerting | Keandalan & Performa | 50 | 10 | 2 | 6 | 1 | 0 |
| `dba9-kapasitas` | DBA9 — Capacity Planning | Skala & Cloud | 50 | 10 | 2 | 6 | 1 | 1 |

### Deep Learning Engineer (14 lesson)

Module: Fondasi (4) · Training & Produksi (6) · Arsitektur Modern (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `dle1-lanskap` | DLE1 — Peta Medan Deep Learning | Fondasi | 45 | 6 | 2 | 5 | 1 | 1 |
| `dle10-deploy` | DLE10 — Deploy Model DL | Training & Produksi | 50 | 6 | 2 | 5 | 1 | 1 |
| `dle11-generative` | DLE11 — Generative: VAE, GAN, Diffusion | Training & Produksi | 55 | 7 | 3 | 5 | 1 | 3 |
| `dle12-capstone` | DLE12 — Capstone: Proyek DL End-to-End | Training & Produksi | 60 | 8 | 2 | 5 | 1 | 1 |
| `dle13-deteksi-objek` | DLE13 — Deteksi Objek (YOLO): Dari 'Ada Kucing' ke 'Kucing di Sana' | Training & Produksi | 50 | 7 | 1 | 5 | 1 | 2 |
| `dle14-segmentasi-unet` | DLE14 — Segmentasi (U-Net): Klasifikasi Tiap Piksel | Training & Produksi | 50 | 7 | 1 | 5 | 1 | 2 |
| `dle2-nn` | DLE2 — Neural Network: Forward & Backprop | Fondasi | 50 | 6 | 3 | 5 | 1 | 2 |
| `dle3-cnn` | DLE3 — CNN untuk Citra | Fondasi | 50 | 6 | 3 | 5 | 1 | 2 |
| `dle4-seq` | DLE4 — Sequence: dari RNN ke Transformer | Fondasi | 50 | 7 | 3 | 5 | 1 | 2 |
| `dle5-transformer` | DLE5 — Transformer Mendalam | Arsitektur Modern | 55 | 6 | 2 | 5 | 1 | 2 |
| `dle6-training` | DLE6 — Training: Optimizer & Schedule | Arsitektur Modern | 55 | 7 | 3 | 5 | 1 | 2 |
| `dle7-transfer` | DLE7 — Transfer Learning & Pretraining | Arsitektur Modern | 45 | 6 | 2 | 5 | 1 | 1 |
| `dle8-gpu` | DLE8 — GPU & Mixed Precision | Arsitektur Modern | 45 | 6 | 3 | 5 | 1 | 2 |
| `dle9-debug` | DLE9 — Debugging: Loss Tidak Turun | Training & Produksi | 50 | 6 | 2 | 5 | 1 | 1 |

### Financial Markets (18 lesson)

Module: Fondasi Pasar (2) · Derivatif (2) · Makro & Valas (1) · Risiko Pasar (1) · Pasar Uang (1) · Konteks Indonesia (1) · Teori Pasar (2) · Analisis Fundamental (1) · Matematika Keuangan (1) · Obligasi & Kredit (2) · Ekuitas (1) · Return & Risiko (1) · Teori Portofolio (2)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `e1-struktur-pasar` | E1. Struktur Pasar: Ke Mana Uang Mengalir? | Fondasi Pasar | 50 | 8 | 2 | 6 | 0 | 0 |
| `e10-derivatif` | E10. Forward, Futures & Opsi | Derivatif | 50 | 7 | 2 | 6 | 0 | 3 |
| `e11-black-scholes` | E11. Black-Scholes & Greeks | Derivatif | 55 | 7 | 2 | 5 | 0 | 2 |
| `e12-fx-suku-bunga` | E12. Kurs & Suku Bunga | Makro & Valas | 50 | 7 | 2 | 5 | 0 | 2 |
| `e13-market-risk` | E13. VaR, Expected Shortfall & Stress Test | Risiko Pasar | 55 | 7 | 3 | 6 | 0 | 1 |
| `e14-money-market` | E14. Pasar Uang, Repo & Sekuritisasi | Pasar Uang | 50 | 7 | 3 | 5 | 0 | 1 |
| `e15-indonesia` | E15. Kit Investor Indonesia | Konteks Indonesia | 50 | 8 | 3 | 5 | 0 | 0 |
| `e16-efisiensi-pasar` | E16. Pasar Efisien, Bias & Backtest | Teori Pasar | 50 | 8 | 2 | 6 | 0 | 0 |
| `e17-makro-siklus` | E17. Siklus Bisnis & Sinyal Resesi | Teori Pasar | 45 | 7 | 2 | 6 | 0 | 0 |
| `e18-laporan-keuangan` | E18. Membaca Laporan Keuangan | Analisis Fundamental | 55 | 8 | 3 | 6 | 0 | 2 |
| `e2-instrumen` | E2. Instrumen Keuangan: Apa yang Kamu Beli? | Fondasi Pasar | 50 | 8 | 3 | 6 | 0 | 0 |
| `e3-tvm` | E3. Time Value of Money | Matematika Keuangan | 55 | 7 | 4 | 6 | 0 | 4 |
| `e4-obligasi` | E4. Obligasi: Harga, Yield, Duration | Obligasi & Kredit | 55 | 7 | 2 | 6 | 0 | 2 |
| `e5-credit-spread` | E5. Credit Spread & Risiko Gagal Bayar | Obligasi & Kredit | 50 | 7 | 2 | 5 | 0 | 2 |
| `e6-ekuitas` | E6. Saham: Harga, Biaya & Valuasi | Ekuitas | 50 | 7 | 2 | 5 | 0 | 1 |
| `e7-return-risiko` | E7. Return, Volatilitas & Sharpe | Return & Risiko | 55 | 6 | 3 | 6 | 0 | 3 |
| `e8-markowitz` | E8. Markowitz & Diversifikasi | Teori Portofolio | 50 | 7 | 2 | 5 | 0 | 1 |
| `e9-capm` | E9. CAPM, Beta & Alpha | Teori Portofolio | 50 | 7 | 2 | 5 | 0 | 2 |

### Fraud & AML Analytics (34 lesson)

Module: Anti Money Laundering (12) · Lanskap Fraud (3) · Operasi Model (7) · Teknik Lanjutan (4) · Capstone (1) · Regulasi (1) · Data & Label (1) · Deteksi Klasik (2) · Machine Learning (3)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `aml1-triage-alert` | AML1 — Triase Alert Transaction Monitoring | Anti Money Laundering | 50 | 8 | 2 | 5 | 1 | 2 |
| `aml10-ira` | AML10 — Institutional Risk Assessment (IRA) | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml11-terrorist-financing` | AML11 — Terrorist Financing Typologies | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 0 |
| `aml2-kyc-cdd` | AML2 — KYC & CDD: Kenali Nasabahmu | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml3-edd` | AML3 — EDD: PEP & Adverse Media | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml4-sanctions` | AML4 — Sanctions & Name Screening | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml5-structuring` | AML5 — Tipologi: Structuring & Smurfing | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml6-layering` | AML6 — Tipologi: Layering & Trade-Based | Anti Money Laundering | 55 | 8 | 2 | 5 | 1 | 2 |
| `aml7-sar` | AML7 — Menulis SAR/STR yang Lolos Review | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 1 |
| `aml8-network` | AML8 — Network Analysis untuk AML | Anti Money Laundering | 55 | 9 | 3 | 5 | 1 | 1 |
| `aml9-virtual-assets` | AML9 — Virtual Assets & VASP Typologies | Anti Money Laundering | 50 | 9 | 3 | 5 | 1 | 0 |
| `fr1-lanskap-fraud` | FR1 — 9 Wajah Fraud | Lanskap Fraud | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr10-drift` | FR10 — Drift & Validasi Temporal | Operasi Model | 50 | 7 | 2 | 5 | 0 | 1 |
| `fr11-threshold` | FR11 — Threshold & Antrian | Operasi Model | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr12-graph-analytics` | FR12 — Graph Analytics | Teknik Lanjutan | 45 | 7 | 2 | 5 | 0 | 0 |
| `fr13-realtime` | FR13 — Sistem Real-Time | Operasi Model | 45 | 6 | 2 | 4 | 0 | 0 |
| `fr14-case-management` | FR14 — Case Management | Operasi Model | 45 | 6 | 2 | 4 | 0 | 0 |
| `fr15-aml` | FR15 — AML | Anti Money Laundering | 50 | 7 | 2 | 5 | 0 | 0 |
| `fr16-anomali-time-series` | FR16 — Anomali Time Series | Teknik Lanjutan | 45 | 6 | 2 | 5 | 0 | 1 |
| `fr17-explainability` | FR17 — Explainability | Operasi Model | 45 | 5 | 2 | 4 | 0 | 0 |
| `fr18-mlops` | FR18 — MLOps Fraud | Operasi Model | 45 | 6 | 2 | 4 | 0 | 0 |
| `fr19-nlp-phishing` | FR19 — NLP & Phishing | Teknik Lanjutan | 45 | 5 | 1 | 4 | 0 | 1 |
| `fr2-fraud-vs-aml` | FR2 — Fraud vs AML vs Cyber | Lanskap Fraud | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr20-capstone` | FR20 — Capstone | Capstone | 50 | 6 | 2 | 5 | 0 | 1 |
| `fr21-sql-fraud` | FR21 — SQL untuk Fraud | Teknik Lanjutan | 45 | 5 | 2 | 4 | 0 | 0 |
| `fr22-chargeback` | FR22 — Chargeback & Dispute | Operasi Model | 45 | 6 | 2 | 4 | 0 | 1 |
| `fr23-regulasi-indonesia` | FR23 — Regulasi Indonesia | Regulasi | 45 | 6 | 0 | 5 | 0 | 0 |
| `fr3-data-fraud` | FR3 — Sinyal & Data Fraud | Lanskap Fraud | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr4-label-fraud` | FR4 — Label Fraud | Data & Label | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr5-rule-based` | FR5 — Rule-Based Detection | Deteksi Klasik | 45 | 7 | 2 | 5 | 0 | 0 |
| `fr6-feature-engineering` | FR6 — Feature Engineering | Deteksi Klasik | 45 | 7 | 2 | 5 | 0 | 1 |
| `fr7-supervised-ml` | FR7 — Supervised ML | Machine Learning | 50 | 7 | 2 | 5 | 0 | 1 |
| `fr8-unsupervised` | FR8 — Unsupervised Anomaly Detection | Machine Learning | 45 | 7 | 2 | 5 | 0 | 0 |
| `fr9-evaluasi` | FR9 — Evaluasi Model | Machine Learning | 50 | 6 | 2 | 5 | 0 | 1 |

### Health Data Science (20 lesson)

Module: Fondasi Data Kesehatan (2) · Analisis Klinis Lanjutan (5) · Data Science Klinis (3) · Data Non-Tabular (2) · Kesehatan Populasi (2) · Etika, Pelaporan & Capstone (3) · Epidemiologi & Uji Klinis (3)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `hd1-sistem-kesehatan` | HD1 EHR, Klaim & Registri: Dari Mana Data Kesehatan Berasal | Fondasi Data Kesehatan | 45 | 6 | 0 | 7 | 0 | 1 |
| `hd10-kausal-observasional` | HD10 Kausalitas dari Data Observasional | Analisis Klinis Lanjutan | 50 | 6 | 1 | 5 | 0 | 0 |
| `hd11-wrangling-ehr` | HD11 Fenotipe & OMOP: Menjinakkan Data EHR Mentah | Data Science Klinis | 50 | 6 | 2 | 6 | 0 | 0 |
| `hd12-prediksi-klinis` | HD12 TRIPOD & Kalibrasi: Model Prediksi yang Dipercaya Dokter | Data Science Klinis | 50 | 5 | 1 | 6 | 0 | 1 |
| `hd13-fairness-kesehatan` | HD13 Fairness di Kesehatan: Ketika AI Memihak | Data Science Klinis | 45 | 5 | 0 | 7 | 0 | 0 |
| `hd14-nlp-klinis` | HD14 NER & LLM Klinis: Membaca Catatan Dokter | Data Non-Tabular | 45 | 6 | 2 | 6 | 0 | 0 |
| `hd15-imaging-medis` | HD15 DICOM & Klasifikasi Citra: Melihat Seperti Radiolog | Data Non-Tabular | 45 | 5 | 1 | 6 | 0 | 0 |
| `hd16-surveilans-wabah` | HD16 SIR & Deteksi Wabah: Matematika Penyebaran Penyakit | Kesehatan Populasi | 50 | 5 | 2 | 5 | 0 | 1 |
| `hd17-ekonomi-kesehatan` | HD17 QALY & ICER: Harga Sebuah Tahun Hidup Sehat | Kesehatan Populasi | 50 | 6 | 2 | 5 | 0 | 2 |
| `hd18-privasi-etika` | HD18 Privasi & Etika: Rahasia Pasien di Era Data | Etika, Pelaporan & Capstone | 45 | 5 | 0 | 8 | 0 | 1 |
| `hd19-pelaporan-klinis` | HD19 STROBE & Dashboard Klinis: Melaporkan Sains dengan Benar | Etika, Pelaporan & Capstone | 45 | 5 | 0 | 7 | 0 | 0 |
| `hd2-standar` | HD2 ICD, SNOMED, FHIR: Bahasa Bersama Data Kesehatan | Fondasi Data Kesehatan | 45 | 6 | 0 | 7 | 0 | 0 |
| `hd20-capstone-readmission` | HD20 Capstone: Model Risiko Readmission End-to-End | Etika, Pelaporan & Capstone | 60 | 6 | 1 | 5 | 0 | 0 |
| `hd3-epidemiologi` | HD3 Insidens, Prevalensi, RR: Bahasa Angka Epidemiologi | Epidemiologi & Uji Klinis | 50 | 5 | 3 | 6 | 0 | 2 |
| `hd4-desain-studi` | HD4 Kohort vs Case-Control: Desain Studi dan Jebakan Bias | Epidemiologi & Uji Klinis | 50 | 6 | 2 | 6 | 0 | 0 |
| `hd5-uji-klinis` | HD5 RCT, ITT & Non-Inferiority: Statistik di Balik Uji Klinis | Epidemiologi & Uji Klinis | 50 | 5 | 2 | 5 | 0 | 1 |
| `hd6-survival` | HD6 Analisis Survival: Ketika Waktu adalah Jawabannya | Analisis Klinis Lanjutan | 50 | 5 | 1 | 5 | 0 | 2 |
| `hd7-longitudinal` | HD7 Data Longitudinal: n Palsu dan Efek Acak | Analisis Klinis Lanjutan | 50 | 5 | 1 | 5 | 0 | 1 |
| `hd8-missing-data` | HD8 Missing Data: MCAR, MAR, MNAR | Analisis Klinis Lanjutan | 50 | 5 | 1 | 4 | 0 | 1 |
| `hd9-uji-diagnostik` | HD9 Uji Diagnostik: Sensitivitas, Spesifisitas, dan PPV | Analisis Klinis Lanjutan | 50 | 5 | 1 | 5 | 0 | 1 |

### LLMOps (13 lesson)

Module: Fondasi (4) · Safety & Skala (5) · Operasi Harian (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `llmops1-lanskap` | LLMOps1 — Kenapa MLOps Tidak Cukup | Fondasi | 50 | 9 | 1 | 6 | 2 | 2 |
| `llmops10-deploy` | LLMOps10 — Deploy: Canary & Rollback untuk LLM | Safety & Skala | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops11-feedback` | LLMOps11 — Feedback Loop | Safety & Skala | 50 | 9 | 1 | 6 | 2 | 2 |
| `llmops12-capstone` | LLMOps12 — Capstone: LLMOps Asisten Produksi | Safety & Skala | 60 | 9 | 1 | 6 | 2 | 1 |
| `llmops13-inference-selfhosted` | LLMOps13 — Inference Self-Hosted (vLLM/TGI) | Safety & Skala | 50 | 8 | 1 | 6 | 1 | 2 |
| `llmops2-prompt-mgmt` | LLMOps2 — Prompt Management & Versioning | Fondasi | 50 | 9 | 1 | 6 | 2 | 2 |
| `llmops3-eval` | LLMOps3 — Evaluasi Berkelanjutan | Fondasi | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops4-rag-ops` | LLMOps4 — Operasional RAG | Fondasi | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops5-guardrail` | LLMOps5 — Guardrail Operasional | Operasi Harian | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops6-cost` | LLMOps6 — Operasi Biaya | Operasi Harian | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops7-observability` | LLMOps7 — Observability | Operasi Harian | 55 | 9 | 1 | 6 | 2 | 2 |
| `llmops8-finetune` | LLMOps8 — Operasional Fine-Tuning | Operasi Harian | 50 | 9 | 1 | 6 | 2 | 2 |
| `llmops9-safety` | LLMOps9 — Safety Ops | Safety & Skala | 55 | 9 | 1 | 6 | 2 | 2 |

### MLOps (13 lesson)

Module: Fondasi Operasi (5) · Governance & Skala (4) · Pipeline & Deploy (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `mlops1-lanskap` | MLOps1 — Kenapa ML Butuh Ops | Fondasi Operasi | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops10-governance` | MLOps10 — Governance: Audit & Lineage | Governance & Skala | 50 | 8 | 1 | 6 | 2 | 1 |
| `mlops11-k8s` | MLOps11 — Kubernetes untuk ML | Governance & Skala | 50 | 8 | 1 | 6 | 2 | 1 |
| `mlops12-capstone` | MLOps12 — Capstone: Pipeline MLOps End-to-End | Governance & Skala | 60 | 8 | 1 | 6 | 2 | 1 |
| `mlops13-experiment-tracking` | MLOps13 — Experiment Tracking & DVC | Fondasi Operasi | 50 | 8 | 1 | 6 | 1 | 2 |
| `mlops2-pipeline` | MLOps2 — Pipeline & Orchestration | Fondasi Operasi | 50 | 8 | 1 | 6 | 2 | 3 |
| `mlops3-feature-store` | MLOps3 — Feature Store | Fondasi Operasi | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops4-registry` | MLOps4 — Model Registry & Versioning | Fondasi Operasi | 50 | 8 | 1 | 6 | 2 | 1 |
| `mlops5-cicd` | MLOps5 — CI/CD untuk Model | Pipeline & Deploy | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops6-serving` | MLOps6 — Serving Infra | Pipeline & Deploy | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops7-monitoring` | MLOps7 — Monitoring & Alerting | Pipeline & Deploy | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops8-retraining` | MLOps8 — Strategi Retraining | Pipeline & Deploy | 50 | 8 | 1 | 6 | 2 | 2 |
| `mlops9-testing` | MLOps9 — Testing: Data & Model Validation | Governance & Skala | 50 | 8 | 1 | 6 | 2 | 1 |

### Machine Learning Engineer (19 lesson)

Module: Fondasi Produksi (4) · Skala & Tanggung Jawab (10) · Serving & Operasi (5)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `mle1-lanskap` | MLE1 — Dari Notebook ke Produksi | Fondasi Produksi | 50 | 8 | 2 | 5 | 1 | 2 |
| `mle10-scaling` | MLE10 — Scaling: Distributed Training | Skala & Tanggung Jawab | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle11-cost` | MLE11 — Cost & Latency Optimization | Skala & Tanggung Jawab | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle12-fairness` | MLE12 — Fairness & Responsible ML | Skala & Tanggung Jawab | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle13-llm-ml` | MLE13 — LLM dalam Sistem ML | Skala & Tanggung Jawab | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle14-capstone` | MLE14 — Capstone: Sistem ML End-to-End | Skala & Tanggung Jawab | 60 | 8 | 1 | 6 | 1 | 1 |
| `mle15-ml-klasik` | MLE15 — Algoritma ML Klasik & Model Selection | Skala & Tanggung Jawab | 50 | 7 | 1 | 5 | 1 | 2 |
| `mle16-hyperparameter-tuning` | MLE16 — Hyperparameter Tuning (Optuna) | Skala & Tanggung Jawab | 50 | 7 | 1 | 5 | 1 | 2 |
| `mle17-experiment-tracking` | MLE17 — Experiment Tracking (MLflow/W&B) | Skala & Tanggung Jawab | 50 | 7 | 1 | 5 | 1 | 2 |
| `mle18-ml-systems-design` | MLE18 — ML Systems Design (A/B, Champion/Challenger) | Skala & Tanggung Jawab | 50 | 7 | 1 | 5 | 1 | 2 |
| `mle19-interpretability-shap` | MLE19 — Interpretability: SHAP & Kapan Model Harus Dijelaskan | Skala & Tanggung Jawab | 50 | 7 | 1 | 5 | 1 | 2 |
| `mle2-data-pipeline` | MLE2 — Data Pipeline & Feature Engineering | Fondasi Produksi | 55 | 8 | 2 | 5 | 1 | 2 |
| `mle3-training` | MLE3 — Training yang Reproducible | Fondasi Produksi | 50 | 8 | 2 | 5 | 1 | 1 |
| `mle4-evaluasi` | MLE4 — Evaluasi di Luar Akurasi | Fondasi Produksi | 55 | 8 | 2 | 5 | 1 | 2 |
| `mle5-serving` | MLE5 — Model Serving: Batch vs Online | Serving & Operasi | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle6-monitoring` | MLE6 — Monitoring: Drift & Performance Decay | Serving & Operasi | 55 | 8 | 2 | 5 | 1 | 1 |
| `mle7-testing` | MLE7 — Testing untuk ML | Serving & Operasi | 55 | 8 | 2 | 5 | 1 | 0 |
| `mle8-versioning` | MLE8 — Versioning: Data, Model, Code | Serving & Operasi | 50 | 8 | 2 | 5 | 1 | 1 |
| `mle9-cicd` | MLE9 — CI/CD untuk ML | Serving & Operasi | 55 | 8 | 2 | 5 | 1 | 0 |

### Market Risk (19 lesson)

Module: Fondasi Risiko Pasar (2) · Risiko Suku Bunga (3) · Derivatif, FX & Komoditas (2) · Risiko Likuiditas (1) · Risiko Counterparty (1) · Model Stokastik (1) · Regulasi FRTB (1) · Tata Kelola & Validasi (2) · Capstone (1) · VaR & Backtesting (4) · Stress Testing (1)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `mr1-trading-book` | MR1 — Trading Book vs Banking Book: Satu Klasifikasi, Beda Nasib Modal | Fondasi Risiko Pasar | 50 | 7 | 3 | 5 | 0 | 2 |
| `mr10-irrbb` | MR10 — IRRBB: Risiko Suku Bunga yang Bersembunyi di Banking Book | Risiko Suku Bunga | 50 | 7 | 2 | 5 | 0 | 2 |
| `mr11-options-risk` | MR11 — Options Risk: Greeks, Vol Surface, dan Seni Delta-Hedging | Derivatif, FX & Komoditas | 55 | 7 | 2 | 5 | 0 | 3 |
| `mr12-fx-komoditas` | MR12 — FX, Komoditas & Basis Risk: Hedge yang Tidak Pernah Sempurna | Derivatif, FX & Komoditas | 50 | 7 | 2 | 5 | 0 | 3 |
| `mr13-risiko-likuiditas` | MR13 — Risiko Likuiditas: Saat Harga Pasar Tidak Bisa Kamu Dapatkan | Risiko Likuiditas | 50 | 7 | 2 | 5 | 0 | 3 |
| `mr14-counterparty-risk` | MR14 — Counterparty Risk: Saat Lawan Transaksimu yang Gagal Bayar | Risiko Counterparty | 50 | 7 | 2 | 5 | 0 | 3 |
| `mr15-model-stokastik` | MR15 — Model Stokastik: Mesin Penghasil Masa Depan | Model Stokastik | 55 | 7 | 2 | 5 | 0 | 3 |
| `mr16-regulasi-frtb` | MR16 — Regulasi Risiko Pasar: Dari Basel 2.5 ke FRTB | Regulasi FRTB | 50 | 7 | 2 | 5 | 0 | 2 |
| `mr17-limit-laporan` | MR17 — Limit, Risk Appetite & Laporan Risiko Harian | Tata Kelola & Validasi | 50 | 7 | 2 | 5 | 0 | 0 |
| `mr18-validasi-model` | MR18 — Validasi Model & Data Lineage | Tata Kelola & Validasi | 50 | 7 | 2 | 5 | 0 | 0 |
| `mr19-capstone-var-es` | MR19 — Capstone: Bangun VaR/ES Engine | Capstone | 60 | 7 | 2 | 5 | 0 | 0 |
| `mr2-volatilitas` | MR2 — Volatilitas & Kovarians: EWMA, Shrinkage, dan Jendela Data | Fondasi Risiko Pasar | 50 | 7 | 3 | 5 | 0 | 4 |
| `mr3-var` | MR3 — Value at Risk: Tiga Cara Mengukur Kerugian Terburuk yang Wajar | VaR & Backtesting | 50 | 8 | 3 | 5 | 0 | 4 |
| `mr4-var-lanjut` | MR4 — VaR Lanjut: Filtered HS, Delta-Gamma, dan Bedah Kontribusi Risiko | VaR & Backtesting | 50 | 7 | 2 | 5 | 0 | 2 |
| `mr5-expected-shortfall` | MR5 — Expected Shortfall: Melihat ke Dalam Ekor yang Disembunyikan VaR | VaR & Backtesting | 50 | 7 | 2 | 5 | 0 | 1 |
| `mr6-backtesting` | MR6 — Backtesting VaR: Mengadili Model dengan Data Nyata | VaR & Backtesting | 50 | 7 | 2 | 5 | 0 | 2 |
| `mr7-stress-test` | MR7 — Stress Testing: Berlatih Mati Sebelum Benar-Benar Mati | Stress Testing | 50 | 7 | 2 | 5 | 0 | 1 |
| `mr8-risiko-suku-bunga` | MR8 — Risiko Suku Bunga: Duration, DV01, dan Lengkung yang Menyelamatkan | Risiko Suku Bunga | 50 | 7 | 2 | 5 | 0 | 3 |
| `mr9-kurva-yield` | MR9 — Kurva Yield: Membaca Bahasa Suku Bunga Antar Waktu | Risiko Suku Bunga | 50 | 7 | 2 | 5 | 0 | 2 |

### Marketing Analytics (19 lesson)

Module: Funnel & Unit Economics (1) · Inkrementalitas (1) · Uplift Modeling (1) · Atribusi (1) · Marketing Mix Modeling (1) · Pricing & Promo (1) · Forecasting (1) · Iklan Digital (1) · Text Analytics (1) · Etika & Storytelling (1) · Capstone (1) · Tracking & Data (1) · Analisis Deskriptif (1) · Segmentasi Pelanggan (1) · Customer Lifetime Value (1) · Churn (1) · Propensity & NBA (1) · Sistem Rekomendasi (1) · Eksperimen A/B (1)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `mk1-funnel-aarrr` | MK1 — Funnel AARRR & Unit Economics | Funnel & Unit Economics | 50 | 7 | 1 | 8 | 0 | 3 |
| `mk10-incrementality` | MK10 — Inkrementalitas & Geo-Experiment | Inkrementalitas | 50 | 7 | 1 | 8 | 0 | 1 |
| `mk11-uplift` | MK11 — Uplift Modeling | Uplift Modeling | 55 | 7 | 1 | 8 | 0 | 1 |
| `mk12-attribution` | MK12 — Atribusi Multi-Touch | Atribusi | 50 | 7 | 1 | 8 | 0 | 1 |
| `mk13-mmm` | MK13 — Marketing Mix Modeling (MMM) | Marketing Mix Modeling | 55 | 7 | 1 | 8 | 0 | 2 |
| `mk14-pricing` | MK14 — Pricing & Efektivitas Promo | Pricing & Promo | 50 | 7 | 1 | 8 | 0 | 2 |
| `mk15-forecasting` | MK15 — Forecasting Demand | Forecasting | 50 | 7 | 1 | 8 | 0 | 4 |
| `mk16-digital-ads` | MK16 — Ekonomi Iklan Digital | Iklan Digital | 50 | 7 | 1 | 8 | 0 | 2 |
| `mk17-text-analytics` | MK17 — Text Analytics: Mendengar 10.000 Ulasan Sekaligus | Text Analytics | 50 | 7 | 2 | 5 | 0 | 1 |
| `mk18-etika` | MK18 — Etika & Storytelling: Dipercaya dan Didengar | Etika & Storytelling | 50 | 7 | 2 | 5 | 0 | 1 |
| `mk19-capstone` | MK19 — Capstone: Churn + CLV + Uplift + Alokasi Budget | Capstone | 60 | 7 | 2 | 8 | 0 | 1 |
| `mk2-tracking` | MK2 — Tracking: Fondasi Data Marketing | Tracking & Data | 50 | 7 | 1 | 8 | 0 | 1 |
| `mk3-deskriptif` | MK3 — Analisis Deskriptif: Cohort, RFM | Analisis Deskriptif | 50 | 7 | 1 | 8 | 0 | 1 |
| `mk4-segmentasi` | MK4 — Segmentasi: K-Means & Persona | Segmentasi Pelanggan | 50 | 7 | 1 | 8 | 0 | 2 |
| `mk5-clv` | MK5 — Customer Lifetime Value (CLV) | Customer Lifetime Value | 55 | 7 | 2 | 8 | 0 | 2 |
| `mk6-churn` | MK6 — Churn: Prediksi & Retensi | Churn | 50 | 7 | 1 | 8 | 0 | 2 |
| `mk7-propensity` | MK7 — Propensity & Next-Best-Action | Propensity & NBA | 50 | 7 | 1 | 8 | 0 | 3 |
| `mk8-rekomendasi` | MK8 — Sistem Rekomendasi | Sistem Rekomendasi | 50 | 7 | 2 | 8 | 0 | 2 |
| `mk9-eksperimen` | MK9 — Eksperimen A/B yang Benar | Eksperimen A/B | 55 | 7 | 1 | 8 | 0 | 4 |

### Portfolio Management (36 lesson)

Module: CFA (10) · Kuantitatif (8) · Analisis & Valuasi (1) · Portfolio Construction (11) · Kuantitatif Terapan (6)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `pm-a1-ethics` | PM-A1 Ethics: Code, 7 Standards & GIPS | CFA | 45 | 6 | 0 | 7 | 0 | 0 |
| `pm-a10-portfolio-mgmt` | PM-A10 Portfolio Management: Diversifikasi, CAPM & IPS | CFA | 60 | 7 | 3 | 6 | 0 | 3 |
| `pm-a2-quant-methods` | PM-A2 Quant Methods: TVM, Statistik & Regresi | CFA | 60 | 7 | 4 | 6 | 0 | 4 |
| `pm-a3-economics` | PM-A3 Economics: Mikro, Makro & FX | CFA | 60 | 7 | 4 | 6 | 0 | 4 |
| `pm-a4-financial-statements` | PM-A4 Financial Statements: 3 Laporan & Rasio | CFA | 60 | 6 | 3 | 6 | 0 | 2 |
| `pm-a5-corporate-issuers` | PM-A5 Corporate Issuers: Governance, WACC & Modal Kerja | CFA | 60 | 7 | 4 | 6 | 0 | 4 |
| `pm-a6-equity` | PM-A6 Equity: Struktur Pasar, Indeks & Efisiensi | CFA | 60 | 7 | 3 | 6 | 0 | 2 |
| `pm-a7-fixed-income` | PM-A7 Fixed Income: Pricing, Duration & Kredit | CFA | 60 | 7 | 2 | 6 | 0 | 2 |
| `pm-a8-derivatives` | PM-A8 Derivatives: Forward, Swap & Opsi | CFA | 60 | 7 | 4 | 6 | 0 | 4 |
| `pm-a9-alternatives` | PM-A9 Alternatives: di Luar Saham-Obligasi | CFA | 60 | 7 | 3 | 6 | 0 | 2 |
| `pm-b1-regresi` | PM-B1 Regresi Berganda: Model & Misspesifikasi | Kuantitatif | 60 | 7 | 2 | 6 | 0 | 2 |
| `pm-b2-timeseries` | PM-B2 Time Series: AR, Unit Root & GARCH | Kuantitatif | 60 | 7 | 2 | 6 | 0 | 3 |
| `pm-b3-ml-investasi` | PM-B3 Machine Learning: untuk Investasi | Kuantitatif | 60 | 7 | 2 | 6 | 0 | 1 |
| `pm-b4-valuasi-ekuitas` | PM-B4 Valuasi Ekuitas: DDM, FCFF & Multiples | Kuantitatif | 60 | 7 | 3 | 6 | 0 | 4 |
| `pm-b5-fixed-income-lanjut` | PM-B5 Fixed Income Lanjut: Kurva, Kredit & MBS | Kuantitatif | 60 | 7 | 2 | 6 | 0 | 3 |
| `pm-b6-valuasi-derivatif` | PM-B6 Valuasi Derivatif: Binomial & Black-Scholes | Kuantitatif | 60 | 7 | 3 | 6 | 0 | 3 |
| `pm-b7-currency` | PM-B7 Currency: Paritas & Carry Trade | Kuantitatif | 60 | 7 | 3 | 6 | 0 | 2 |
| `pm-b8-faktor-risiko` | PM-B8 Faktor & Risiko: VaR, ES & Greeks | Kuantitatif | 60 | 7 | 3 | 6 | 0 | 3 |
| `pm-b9-intercorporate` | B9 — Intercorporate: Investasi Antar-Perusahaan | Analisis & Valuasi | 50 | 8 | 2 | 5 | 0 | 1 |
| `pm-c1-ips` | C1 — Investment Policy Statement | Portfolio Construction | 45 | 8 | 1 | 6 | 0 | 1 |
| `pm-c10-trading-execution` | C10 — Trading & Execution | Portfolio Construction | 50 | 8 | 2 | 5 | 0 | 1 |
| `pm-c11-ethics-esg` | C11 — Ethics & ESG | Portfolio Construction | 45 | 8 | 2 | 5 | 0 | 0 |
| `pm-c2-capital-market-expectations` | C2 — Capital Market Expectations | Portfolio Construction | 45 | 8 | 2 | 6 | 0 | 2 |
| `pm-c3-asset-allocation` | C3 — Asset Allocation: SAA, TAA & LDI | Portfolio Construction | 50 | 8 | 2 | 6 | 0 | 1 |
| `pm-c4-portfolio-construction` | C4 — Portfolio Construction | Portfolio Construction | 50 | 8 | 2 | 6 | 0 | 0 |
| `pm-c5-performance-evaluation` | C5 — Performance Evaluation | Portfolio Construction | 50 | 8 | 2 | 6 | 0 | 2 |
| `pm-c6-behavioral` | C6 — Behavioral Finance | Portfolio Construction | 45 | 7 | 1 | 6 | 0 | 1 |
| `pm-c7-fixed-income-portfolio` | C7 — Fixed Income Portfolio | Portfolio Construction | 50 | 7 | 1 | 4 | 0 | 1 |
| `pm-c8-equity-portfolio` | C8 — Equity Portfolio | Portfolio Construction | 50 | 8 | 2 | 4 | 0 | 1 |
| `pm-c9-derivatives-overlay` | C9 — Derivatives Overlay | Portfolio Construction | 50 | 8 | 2 | 5 | 0 | 2 |
| `pm-d1-data-harga` | D1 — Data & Harga | Kuantitatif Terapan | 45 | 8 | 2 | 5 | 0 | 1 |
| `pm-d2-optimisasi` | D2 — Optimisasi | Kuantitatif Terapan | 50 | 8 | 2 | 5 | 0 | 2 |
| `pm-d3-regresi-faktor` | D3 — Regresi Faktor | Kuantitatif Terapan | 50 | 8 | 2 | 5 | 0 | 2 |
| `pm-d4-backtesting` | D4 — Backtesting | Kuantitatif Terapan | 50 | 8 | 2 | 5 | 0 | 1 |
| `pm-d5-metrik-kinerja` | D5 — Metrik Kinerja | Kuantitatif Terapan | 50 | 8 | 2 | 5 | 0 | 3 |
| `pm-d6-risk-reporting` | D6 — Risk Reporting | Kuantitatif Terapan | 45 | 8 | 2 | 5 | 0 | 1 |

### Probabilitas (19 lesson)

Module: Fondasi Peluang (4) · Dependensi (2) · Limit (1) · Simulasi (1) · Risiko Kredit (1) · Proses Stokastik (2) · Ekor Berat (1) · Bayesian (1) · Variabel Acak (1) · Distribusi (5)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `b1-aksioma-peluang` | B1. Peluang: Tiga Aturan yang Mengatur Ketidakpastian | Fondasi Peluang | 55 | 7 | 5 | 7 | 0 | 3 |
| `b10-copula` | B10. Copula: Memisahkan Marginal dari Ketergantungan | Dependensi | 55 | 6 | 3 | 9 | 0 | 2 |
| `b11-lln-clt` | B11. LLN & CLT: Mengapa Rata-rata Sampel Bisa Dipercaya | Limit | 55 | 7 | 5 | 7 | 0 | 2 |
| `b12-monte-carlo` | B12. Monte Carlo: Ketika Rumus Menyerah, Simulasi Berbicara | Simulasi | 55 | 7 | 4 | 9 | 0 | 1 |
| `b13-vasicek` | B13. Vasicek: Satu Faktor yang Menggerakkan Ribuan Kredit | Risiko Kredit | 55 | 6 | 4 | 7 | 0 | 2 |
| `b14-markov-chain` | B14. Markov Chain: Masa Depan Hanya Peduli Hari Ini | Proses Stokastik | 55 | 7 | 4 | 9 | 0 | 3 |
| `b15-proses-stokastik` | B15. Proses Stokastik: Random Walk hingga GBM | Proses Stokastik | 55 | 7 | 4 | 7 | 0 | 4 |
| `b16-heavy-tails-evt` | B16. Heavy Tails & EVT: Ekor yang Memakan Model | Ekor Berat | 55 | 7 | 4 | 9 | 0 | 3 |
| `b17-bayesian-praktis` | B17. Bayesian Praktis: Belajar dari Data, Bukan dari Nol | Bayesian | 55 | 7 | 4 | 9 | 0 | 3 |
| `b2-kombinatorik` | B2. Kombinatorik: Menghitung Tanpa Menghitung Satu per Satu | Fondasi Peluang | 55 | 6 | 5 | 5 | 0 | 3 |
| `b3-peluang-bersyarat` | B3. Peluang Bersyarat: Informasi Mengubah Peluang | Fondasi Peluang | 55 | 7 | 5 | 7 | 0 | 3 |
| `b4-bayes` | B4. Teorema Bayes: Membalik Arah Peluang | Fondasi Peluang | 55 | 7 | 5 | 7 | 0 | 1 |
| `b5-variabel-acak-ekspektasi` | B5. Variabel Acak & Ekspektasi: Rata-rata yang Menipu | Variabel Acak | 55 | 7 | 5 | 7 | 0 | 3 |
| `b6-distribusi-diskret-1` | B6.1 Distribusi Diskret 1: Bernoulli & Binomial | Distribusi | 55 | 7 | 5 | 7 | 0 | 2 |
| `b6-distribusi-diskret-2` | B6.2 Distribusi Diskret 2: Poisson, Geometrik & Negatif Binomial | Distribusi | 55 | 7 | 6 | 5 | 0 | 3 |
| `b7-distribusi-kontinu-1` | B7.1 Distribusi Kontinu 1: Normal, Lognormal & Eksponensial | Distribusi | 55 | 7 | 4 | 7 | 0 | 4 |
| `b7-distribusi-kontinu-2` | B7.2 Distribusi Kontinu 2: Gamma, Beta, t, Chi-Square & Pareto | Distribusi | 55 | 7 | 5 | 5 | 0 | 4 |
| `b8-fitting-distribusi` | B8. Fitting Distribusi: Distribusi Mana yang Jujur? | Distribusi | 55 | 6 | 3 | 9 | 0 | 2 |
| `b9-joint-kovarians` | B9. Joint, Kovarians & Bivariat Normal | Dependensi | 55 | 6 | 4 | 7 | 0 | 3 |

### Python (16 lesson)

Module: Dasar Python (2) · Machine Learning (2) · Statistik (1) · Performa (1) · Rekayasa (1) · Integrasi (1) · NumPy (1) · pandas (4) · Visualisasi (2) · EDA (1)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `d1-python-dasar` | D1 Python Dasar: Bahasa Kedua Seorang Analis | Dasar Python | 45 | 8 | 5 | 6 | 0 | 0 |
| `d10-feature-engineering` | D10 Feature Engineering: Bahan Bakar Model | Machine Learning | 45 | 5 | 2 | 6 | 0 | 0 |
| `d11-scipy-statsmodels` | D11 Statistik Inferensial: Uji Hipotesis & Regresi | Statistik | 60 | 6 | 4 | 4 | 0 | 0 |
| `d12-sklearn` | D12 scikit-learn: Pipeline ML Pertama | Machine Learning | 60 | 6 | 3 | 4 | 0 | 0 |
| `d13-performa` | D13 Performa: Python Cepat untuk Data Besar | Performa | 45 | 5 | 2 | 4 | 0 | 0 |
| `d14-rekayasa` | D14 Rekayasa: Kode Python yang Bisa Dipercaya | Rekayasa | 45 | 5 | 2 | 4 | 0 | 0 |
| `d15-sql-python-api` | D15 SQL & API: Mengambil Data dari Luar | Integrasi | 45 | 5 | 3 | 4 | 0 | 0 |
| `d2-struktur-data` | D2 Struktur Data, Comprehension & Menangani Error | Dasar Python | 45 | 7 | 5 | 4 | 0 | 0 |
| `d3-numpy` | D3 NumPy: Vectorization & Berpikir Array | NumPy | 45 | 6 | 4 | 4 | 0 | 0 |
| `d4-pandas-dasar` | D4 pandas: DataFrame & Berpikir Tabel | pandas | 45 | 6 | 4 | 4 | 0 | 0 |
| `d5-data-cleaning` | D5 Data Cleaning: dtype, Missing, Duplikat, Outlier | pandas | 60 | 7 | 5 | 4 | 0 | 0 |
| `d6-wrangling` | D6 Wrangling: Merge, GroupBy, Pivot & Reshape | pandas | 45 | 6 | 3 | 4 | 0 | 0 |
| `d7-datetime-timeseries` | D7 Datetime & Time Series: Waktu sebagai Data | pandas | 45 | 6 | 4 | 4 | 0 | 0 |
| `d8-visualisasi-1` | D8-1 Visualisasi: Memilih Chart yang Jujur (matplotlib) | Visualisasi | 45 | 6 | 3 | 4 | 0 | 0 |
| `d8-visualisasi-2` | D8-2 Plotly: Chart Interaktif untuk Dashboard | Visualisasi | 45 | 5 | 2 | 4 | 0 | 0 |
| `d9-eda` | D9 EDA: Workflow & Profiling Data | EDA | 60 | 6 | 3 | 4 | 0 | 0 |

### Risk Reporting (18 lesson)

Module: Fondasi Pelaporan (4) · Operasi & Regulasi (6) · Komunikasi Risiko (4) · Angka Risiko & Regulasi (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `rr1-lanskap` | RR1 — Lanskap Risk Reporting | Fondasi Pelaporan | 50 | 8 | 2 | 5 | 1 | 2 |
| `rr10-regulasi` | RR10 — Dasar Regulasi Pelaporan OJK/BI | Operasi & Regulasi | 55 | 8 | 2 | 5 | 1 | 1 |
| `rr11-stress` | RR11 — Melaporkan Hasil Stress Test | Operasi & Regulasi | 55 | 9 | 3 | 5 | 1 | 2 |
| `rr12-insiden` | RR12 — Pelaporan Insiden & Near-Miss | Operasi & Regulasi | 50 | 9 | 3 | 5 | 1 | 1 |
| `rr13-kri` | RR13 — KPI vs KRI | Komunikasi Risiko | 55 | 9 | 3 | 5 | 1 | 1 |
| `rr14-capstone` | RR14 — Capstone: Paket Laporan Bulanan CRO | Operasi & Regulasi | 60 | 9 | 3 | 5 | 1 | 1 |
| `rr15-risk-appetite` | RR15 — Risk Appetite & Limit Monitoring | Angka Risiko & Regulasi | 50 | 9 | 3 | 5 | 1 | 1 |
| `rr16-ecl-rwa` | RR16 — ECL (PSAK 71) & RWA Reporting | Angka Risiko & Regulasi | 50 | 9 | 3 | 5 | 1 | 2 |
| `rr17-bcbs239` | RR17 — BCBS 239: Risk Data Aggregation & Reporting | Angka Risiko & Regulasi | 50 | 9 | 3 | 5 | 1 | 0 |
| `rr18-market-risk` | RR18 — Market Risk Reporting: VaR & Backtesting | Angka Risiko & Regulasi | 50 | 9 | 3 | 5 | 1 | 1 |
| `rr2-anatomi` | RR2 — Anatomi Laporan Risiko yang Baik | Fondasi Pelaporan | 50 | 9 | 3 | 5 | 1 | 1 |
| `rr3-metrik` | RR3 — Metrik Kunci & Definisi Konsisten | Fondasi Pelaporan | 55 | 8 | 2 | 5 | 1 | 2 |
| `rr4-data-quality` | RR4 — QA Data Laporan | Fondasi Pelaporan | 55 | 9 | 3 | 5 | 1 | 1 |
| `rr5-visualisasi` | RR5 — Visualisasi untuk Komite | Komunikasi Risiko | 55 | 9 | 3 | 5 | 1 | 2 |
| `rr6-narasi` | RR6 — Narasi & Storytelling Data | Komunikasi Risiko | 50 | 9 | 3 | 5 | 1 | 1 |
| `rr7-dashboard` | RR7 — Merancang Dashboard Risiko | Komunikasi Risiko | 55 | 9 | 3 | 5 | 1 | 1 |
| `rr8-otomasi` | RR8 — Otomasi Pipeline Laporan | Operasi & Regulasi | 55 | 9 | 3 | 5 | 1 | 1 |
| `rr9-adhoc` | RR9 — Menjawab Permintaan Adhoc dalam 2 Jam | Operasi & Regulasi | 50 | 9 | 3 | 5 | 1 | 2 |

### SQL (19 lesson)

Module: Fondasi (8) · Lanjutan (5) · Risiko (2) · Engineering (4)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `c1-select-dasar` | C1 SELECT: Bertanya ke Database dengan Bahasa Manusia | Fondasi | 45 | 6 | 2 | 8 | 0 | 0 |
| `c10-dedupe-pivot-yoy` | C10 Dedupe, Pivot & YoY: Pola Analisis Sehari-hari | Lanjutan | 45 | 6 | 2 | 7 | 0 | 0 |
| `c11-cohort-retention-funnel` | C11 Cohort, Retention & Funnel: Analisis Perilaku | Lanjutan | 60 | 6 | 2 | 7 | 0 | 0 |
| `c12-recursive-cte` | C12 Recursive CTE Mendalam: Hierarki, Graf & Jalan | Lanjutan | 45 | 6 | 2 | 5 | 0 | 0 |
| `c13-risiko-dpd-rollrate` | C13 DPD, Roll Rate & Vintage: Bahasa Risiko Kredit | Risiko | 60 | 6 | 2 | 7 | 0 | 0 |
| `c14-fraud-velocity` | C14 Velocity & Impossible Travel: Menangkap Fraud dengan SQL | Risiko | 60 | 6 | 2 | 5 | 0 | 0 |
| `c15-data-quality` | C15 Data Quality: Percaya tapi Verifikasi | Engineering | 45 | 6 | 2 | 7 | 0 | 0 |
| `c16-data-modeling` | C16 Data Modeling: Star Schema & Analitik Modern | Engineering | 45 | 6 | 0 | 11 | 0 | 0 |
| `c17-index-explain` | C17 Index & EXPLAIN: Membuat Query Terbang | Engineering | 45 | 6 | 0 | 9 | 0 | 0 |
| `c18-transaksi-acid` | C18 Transaksi & ACID: Ketika Data Tidak Boleh Salah | Engineering | 45 | 6 | 0 | 11 | 0 | 0 |
| `c2-null-logika` | C2 NULL: Ketidakhadiran yang Punya Aturan Sendiri | Fondasi | 45 | 6 | 2 | 8 | 0 | 0 |
| `c3-agregasi-groupby` | C3 GROUP BY: Dari Jutaan Baris ke Satu Insight | Fondasi | 45 | 6 | 3 | 5 | 0 | 0 |
| `c4-fungsi-tanggal-string` | C4 Tanggal & Teks: Fungsi yang Menyelamatkan Sehari-hari | Fondasi | 45 | 6 | 2 | 7 | 0 | 0 |
| `c5-join` | C5 JOIN: Menyambung Tabel tanpa Menggandakan Fakta | Fondasi | 45 | 7 | 3 | 5 | 0 | 0 |
| `c6-subquery` | C6 Subquery: Query di Dalam Query | Fondasi | 45 | 6 | 2 | 8 | 0 | 0 |
| `c7-cte` | C7 CTE: Beri Nama pada Langkah Berpikirmu | Fondasi | 45 | 6 | 2 | 5 | 0 | 0 |
| `c8-union-set` | C8 UNION & Operasi Himpunan: Menumpuk, Bukan Menyambung | Fondasi | 45 | 6 | 2 | 5 | 0 | 0 |
| `c9-window-functions-1` | C9.1 Window Functions: Ranking & Akses Baris Tetangga | Lanjutan | 45 | 6 | 2 | 5 | 0 | 0 |
| `c9-window-functions-2` | C9.2 Window Functions: Agregat Berjalan & Bingkai | Lanjutan | 45 | 6 | 2 | 7 | 0 | 0 |

### Statistika (38 lesson)

Module: Deskriptif (9) · Inferensial (13) · Modeling & ML Dasar (16)

| Slug | Judul | Modul | mnt | Step | Lab | Kuis | Fig | Rumus |
|---|---|---|---|---|---|---|---|---|
| `a11-tipe-data` | A1.1 Tipe Data: Salah Skala, Salah Semua | Deskriptif | 45 | 7 | 6 | 5 | 0 | 2 |
| `a12-pemusatan` | A1.2 Mean, median, modus | Deskriptif | 45 | 6 | 5 | 4 | 1 | 3 |
| `a13-sebaran` | A1.3 Ukuran Sebaran: Mean Sama, Nasib Beda | Deskriptif | 45 | 8 | 7 | 5 | 0 | 5 |
| `a14-skewness-kurtosis` | A1.4 Skewness & Kurtosis: Membaca Ekor yang Menyimpan Risiko | Deskriptif | 45 | 6 | 5 | 5 | 0 | 3 |
| `a15-kuantil-outlier` | A1.5 Outlier: Dibuang, atau Justru Diselidiki? | Deskriptif | 45 | 8 | 6 | 5 | 0 | 4 |
| `a16-korelasi` | A1.6 Angka 0,92 yang Menyesatkan: Pearson, Spearman, Kendall | Deskriptif | 45 | 7 | 4 | 5 | 0 | 3 |
| `a17-missing-data` | A1.7 Missing Data: Lubang yang (Kadang) Bercerita | Deskriptif | 45 | 7 | 5 | 5 | 0 | 3 |
| `a18-visualisasi` | A1.8 Chart Cantik yang Berbohong: Visualisasi Data Tanpa Menyesatkan | Deskriptif | 45 | 8 | 7 | 5 | 0 | 4 |
| `a19-eda-end-to-end` | A1.9 EDA End-to-End: Dari Data Mentah ke Keputusan Direksi | Deskriptif | 45 | 8 | 6 | 5 | 0 | 2 |
| `a21-sampling-bias` | A2.1 2,4 Juta Responden yang Salah Total: Sampling & Bias | Inferensial | 45 | 7 | 4 | 5 | 0 | 2 |
| `a210-power-sampel` | A2.10 Berapa Data yang Cukup? Power & Ukuran Sampel | Inferensial | 45 | 7 | 4 | 5 | 0 | 2 |
| `a211-ab-testing` | A2.11 Dari Hipotesis ke Keputusan Bisnis: A/B Testing End-to-End | Inferensial | 45 | 8 | 4 | 5 | 0 | 2 |
| `a212-bayesian` | A2.12 Memperbarui Keyakinan dengan Data: Bayesian Dasar | Inferensial | 45 | 8 | 4 | 5 | 0 | 2 |
| `a213-kausalitas` | A2.13 Korelasi Bukan Sebab-Akibat: Berpikir Kausal | Inferensial | 45 | 8 | 4 | 5 | 0 | 1 |
| `a22-estimasi-mle` | A2.2 Estimasi Parameter & Maximum Likelihood | Inferensial | 45 | 7 | 6 | 5 | 0 | 1 |
| `a23-interval-kepercayaan` | A2.3 Interval Kepercayaan: Seberapa Yakin Kamu? | Inferensial | 45 | 7 | 5 | 5 | 0 | 1 |
| `a24-uji-hipotesis` | A2.4 Uji Hipotesis: Logika Pengadilan Data | Inferensial | 45 | 7 | 4 | 5 | 0 | 1 |
| `a25-uji-t-anova` | A2.5 Uji-t & ANOVA: Membandingkan Rata-rata | Inferensial | 45 | 8 | 4 | 5 | 0 | 2 |
| `a26-nonparametrik` | A2.6 Uji Nonparametrik: Saat Data Tak Mau Normal | Inferensial | 45 | 7 | 4 | 5 | 0 | 2 |
| `a27-effect-size` | A2.7 Effect Size: Signifikan Belum Tentu Penting | Inferensial | 45 | 7 | 4 | 5 | 0 | 1 |
| `a28-multiple-testing` | A2.8 Multiple Testing: Jebakan Jelly Bean Hijau | Inferensial | 45 | 7 | 3 | 5 | 0 | 1 |
| `a29-bootstrap` | A2.9 Bootstrap & Permutasi: Statistik Tanpa Rumus | Inferensial | 45 | 7 | 3 | 5 | 0 | 1 |
| `a30-alur-modeling` | A3.0 Alur Kerja Modeling: Peta Sebelum Masuk Hutan Model | Modeling & ML Dasar | 45 | 9 | 3 | 6 | 0 | 0 |
| `a31-regresi-ols` | A3.1 Regresi Linear OLS: Garis Lurus Paling Jujur | Modeling & ML Dasar | 45 | 9 | 3 | 6 | 0 | 2 |
| `a310-volatilitas` | A3.10 Volatilitas: Mengukur Badai Saat Laut Tenang | Modeling & ML Dasar | 45 | 9 | 2 | 6 | 0 | 3 |
| `a311-pca-clustering` | A3.11 PCA, Clustering & Deteksi Anomali | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 1 |
| `a312-survival-analysis` | A3.12 Survival Analysis: Memprediksi Kapan, Bukan Sekadar Apakah | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 2 |
| `a313-kausal` | A3.13 Inferensi Kausal: Dari Berhubungan ke Menyebabkan | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 1 |
| `a314-explainability` | A3.14 Explainability & Fairness: Membuka Kotak Hitam | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 1 |
| `a315-tree-boosting` | A3.15 Tree, Forest & Boosting: Senjata Pamungkas Data Tabular | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |
| `a32-diagnostik-regresi` | A3.2 Diagnostik Regresi: Autopsi Model Sebelum Terlambat | Modeling & ML Dasar | 45 | 9 | 2 | 6 | 0 | 0 |
| `a33-regularisasi` | A3.3 Regularisasi: Menahan Model yang Terlalu Pintar Menghafal | Modeling & ML Dasar | 45 | 9 | 2 | 6 | 0 | 2 |
| `a34-logistic-glm` | A3.4 Regresi Logistik & GLM: Peluang, Bukan Angka | Modeling & ML Dasar | 45 | 9 | 2 | 6 | 0 | 1 |
| `a35-metrik-klasifikasi` | A3.5 Metrik Klasifikasi: Akurasi yang Menipu | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |
| `a36-kalibrasi` | A3.6 Kalibrasi Probabilitas: PD 10% Harus Berarti 10% | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |
| `a37-imbalanced-data` | A3.7 Imbalanced Data: Ketika 3% Menentukan Nasib Model | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |
| `a38-validasi-model` | A3.8 Validasi Model: Leakage, Out-of-Time & Audit | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |
| `a39-time-series` | A3.9 Time Series: Meramal dari Gema Masa Lalu | Modeling & ML Dasar | 45 | 8 | 2 | 6 | 0 | 0 |

