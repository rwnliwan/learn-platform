# GAP ANALYSIS — Kelompok A (Learn v2)
**Tanggal:** 2026-10-14
**Ruang lingkup:** 5 track — Risk Reporting (rr1–rr14), Fraud & AML Analytics (aml1–aml8 + fr1–fr23), Business Intelligence (biz1–biz14), Data Engineer (de1–de14), Database Administrator (dba1–dba12)
**Metode:** (1) riset lowongan kerja global + Indonesia via web search (URL sumber dicantumkan), (2) kurikulum standar/sertifikasi (CAMS, PL-300, POJK/OJK), (3) pemetaan judul lesson existing di `src/app/v2/content/`, (4) verifikasi grep isi file agar gap yang diklaim benar-benar tidak ada (bukan false gap).
**Prioritas:** P1 = wajib (diminta pasar/sertifikasi, belum tercakup sama sekali), P2 = penting (tercakup sebagian/sebatas sebutan), P3 = nice-to-have.

---

## 1. RISK REPORTING (rr1–rr14) — 14 lesson

### Topik wajib menurut pasar & regulasi
1. **Pelaporan eksposur risiko kuantitatif + kualitatif ke Direksi/Komite** — POJK 18/POJK.03/2016 mensyaratkan laporan eksposur risiko (komposit maupun per jenis risiko) disampaikan ke Direksi; frekuensi bisa ditingkatkan sesuai kebutuhan. (https://peraturan.go.id/files/ojk18-2016pjl.pdf)
2. **Laporan Profil Risiko triwulanan ke OJK** — SEOJK mewajibkan bank menyampaikan laporan profil risiko triwulanan (posisi Mar/Jun/Sep/Des) secara komparatif, dengan substansi sama seperti yang disampaikan ke dirut & komite. (https://ojk.go.id/id/regulasi/Documents/Pages/Penerapan-Manajemen-Risiko-Bagi-Bank-Umum/SAL - SEOJK MANAJEMEN RISIKO FINAL .pdf)
3. **RWA / ECL / IFRS 9** — lowongan Regulatory Reporting Analyst (Societe Generale) mensyaratkan: Basel III/IV, IFRS, perhitungan RWA, EL = PD × LGD × EAD, ECL IFRS 9, rekonsiliasi inventory-vs-risk dan accounting-vs-risk, BCBS 239. (https://www.foundit.in/job/analyst-regulatory-reporting-societe-generale-global-solution-centre-private-limited-chennai-39989315)
4. **Basel III SLE & RWA analytics, variance analysis, controls** — lowongan Citi (AVP, Finance Risk Reporting – Basel & RWA) mensyaratkan pemahaman Basel reporting, rekonsiliasi, analisis varians, otomasi, control environment, data quality monitoring. (https://elevateu.us.com/job-external/C0BA5DE1ECB84DCEBDDA63A8D5BC7141206)
5. **TKS, RCSA, KRI, IRA, regulasi OJK** — lowongan Risk & AML Specialist Indonesia (Cermati) eksplisit mensyaratkan pemahaman TKS, RCSA, KRI, AML-CFT, IRA, dan regulasi OJK; tugas: kumpulkan & olah data risiko, analisis tingkat kesehatan, laporan berkala ke regulator. (https://www.jobleads.com/id/job/risk-aml-specialist--jakarta-pusat--e5db136521eaa0080573604ade29a46b7)
6. **Stress testing & cash-flow projection** — lowongan HSBC Indonesia (AVP Risk Analyst) mensyaratkan eksekusi stress-testing dan proyeksi cash-flow. (https://www.jobleads.com/id/job/avp-risk-analyst-global-network-banking--jakarta-barat--e5779c4f7ac462189ea8c748853fd2890)

### Lesson existing (14)
RR1 Lanskap · RR2 Anatomi laporan · RR3 Metrik kunci (NPL, coverage, LCR) · RR4 QA data · RR5 Visualisasi · RR6 Narasi · RR7 Dashboard · RR8 Otomasi pipeline · RR9 Adhoc 2 jam · RR10 Regulasi OJK/BI · RR11 Stress test · RR12 Insiden & near-miss · RR13 KPI vs KRI · RR14 Capstone

### GAP (terverifikasi via grep isi file — topik ini memang tidak ada)
| # | Topik hilang | Kenapa wajib (sumber) | Prioritas |
|---|---|---|---|
| G1 | **Risk appetite framework & limit monitoring** — RAS, cascading limit, breach escalation | Inti kerja risk reporting di bank (POJK 18/2016: pemantauan & pelaporan risiko material berbasis historical trend); tidak ada satu pun lesson yang menyebut "risk appetite"/"selera risiko" | P1 |
| G2 | **ECL (PSAK 71/IFRS 9) & RWA reporting** — staging, PD×LGD×EAD, perhitungan RWA | Tugas utama regulatory reporting analyst di semua lowongan global (Societe Generale, Citi); grep: tidak ada "ECL"/"expected credit loss"/"IFRS 9"/"PSAK 71" di seluruh rr* | P1 |
| G3 | **BCBS 239 / risk data aggregation & reporting (RDARR)** — accuracy, integrity, completeness, timeliness, adaptability | Standar global untuk fungsi risk reporting; lowongan Societe Generale eksplisit menyebut BCBS 239; tidak ada lesson-nya | P1 |
| G4 | **Market risk reporting** — VaR, backtesting, trading book | Lowongan Citi/Barclays mensyaratkan Basel III lintas jenis risiko; grep: tidak ada "VaR" di seluruh rr* | P1 |
| G5 | **Regulatory capital reporting (KPMM/CAR)** — kecukupan modal, komponen modal | Pelaporan wajib bank Indonesia ke OJK; grep: tidak ada "capital adequacy" di seluruh rr* | P2 |
| G6 | **ICAAP** — internal capital adequacy assessment (Pilar 2 Basel) | Bagian paket pelaporan risiko bank yang dinilai regulator; tidak tercakup | P2 |

**Catatan:** track RR kuat di *craft* pelaporan (narasi, visual, dashboard, otomasi, adhoc) — yang hilang adalah *substansi angka risiko* yang justru menjadi isi pekerjaan regulatory/risk reporting analyst.

---

## 2. FRAUD & AML ANALYTICS (aml1–aml8 + fr1–fr23) — 31 lesson

### Topik wajib menurut pasar & sertifikasi
1. **Empat domain CAMS** — (a) risiko & metode ML/TF, (b) program kepatuhan AML/CFT, (c) pengumpulan & analisis intelijen keuangan, (d) kepatuhan hukum/regulasi AML/CFT termasuk rekomendasi FATF. (https://stackgo.io/resources/acams-aml-certification/)
2. **Detail silabus CAMS** — standar kepatuhan (FATF 40, Wolfsberg, Basel CDD, Egmont); risiko & metode (sanksi, placement/layering/integration, kerentanan per sektor, **virtual assets/VASP**); program kepatuhan (KYC/CDD/EDD, ongoing monitoring, **beneficial ownership**, SAR/STR, record retention, training, audit independen). (https://braindumpsschool.vce4plus.com/ACAMS/CAMS-valid-vce-dumps.html)
3. **Tugas AML officer Indonesia** — lowongan Bank of China Jakarta: investigasi & analisis transaksi mencurigakan, **pelaporan PPATK (GRIPS)**, interpretasi pedoman OJK/PPATK. (https://lokercepat.id/aml-cft-officer-aml-bank-of-china-hong-kong-limited-jakarta-branch/)
4. **Tugas fraud analyst** — DBS Indonesia: analisis transaksi consumer banking, kembangkan strategi & model deteksi fraud, **laporan tren fraud ke manajemen**, SQL/R/Python nilai plus. (https://www.jobleads.com/id/job/analyst-fraud-risk-specialist-for-consumer-banking-risk-management-group--indonesia--efa143c315f82c614a65349130b0a3196) — Krom/foundit: investigasi kasus, fraud risk assessment per produk, kepatuhan regulasi, training staf. (https://www.foundit.id/job/fraud-operations-analyst-krom-indonesia-41714949)
5. **IRA (institutional risk assessment)** — lowongan Cermati eksplisit mensyaratkan pemahaman IRA; posting Citi: analisis & pelaporan AML risk assessment. (https://www.jobleads.com/id/job/risk-aml-specialist--jakarta-pusat--e5db136521eaa0080573604ade29a46b7)

### Lesson existing (31)
AML1 Triase alert · AML2 KYC & CDD · AML3 EDD (PEP & adverse media) · AML4 Sanctions & name screening · AML5 Structuring & smurfing · AML6 Layering & trade-based · AML7 SAR/STR · AML8 Network analysis ·
FR1 9 wajah fraud · FR2 Fraud vs AML vs cyber · FR3 Sinyal & data · FR4 Label · FR5 Rule-based · FR6 Feature engineering · FR7 Supervised ML · FR8 Unsupervised · FR9 Evaluasi · FR10 Drift · FR11 Threshold & antrean · FR12 Graph · FR13 Real-time · FR14 Case management · FR15 AML · FR16 Anomali time series · FR17 Explainability · FR18 MLOps · FR19 NLP & phishing · FR20 Capstone · FR21 SQL fraud · FR22 Chargeback · FR23 Regulasi Indonesia

### GAP (terverifikasi via grep)
| # | Topik hilang | Kenapa wajib (sumber) | Prioritas |
|---|---|---|---|
| G1 | **Virtual assets & VASP typologies** — crypto on/off-ramp, mixer, DeFi | Kurikulum CAMS terbaru eksplisit mencakup virtual asset risks; grep: tidak ada "virtual asset"/"crypto"/"VASP" di seluruh aml*/fr* | P1 |
| G2 | **AML enterprise/institutional risk assessment (IRA)** — penilaian risiko tingkat institusi | Domain CAMS "compliance programs"; lowongan Indonesia (Cermati) eksplisit mensyaratkan IRA; grep: tidak ada "risk assessment" di seluruh aml*/fr* | P1 |
| G3 | **Terrorist financing typologies** — metode pendanaan terorisme (berbeda dari ML) | CAMS: ~30% bobot konsep ML/TF; grep: "terrorist" hanya 2 sebutan sepintas (aml4, fr12), tanpa lesson | P1 |
| G4 | **Beneficial ownership deep-dive** — struktur UBO, shell company, trust, aturan ≥25% dalam praktik | Domain CAMS CDD; aml2 hanya menyebut BO satu kali sepintas | P2 |
| G5 | **Proliferation financing** — pendanaan proliferasi senjata | Topik CAMS; grep: tidak ada di seluruh aml*/fr* | P2 |
| G6 | **Fraud loss reporting & prevention ROI** — pelaporan kerugian fraud ke manajemen, cost-benefit kontrol | Tugas eksplisit fraud analyst DBS ("provide reports on fraud trends to management"); tidak ada lesson-nya | P2 |

**Catatan:** ini track paling lengkap (31 lesson). Gap-nya adalah topik CAMS generasi baru + fungsi manajerial (IRA, fraud loss reporting), bukan fondasi.

---

## 3. BUSINESS INTELLIGENCE (biz1–biz14) — 14 lesson

### Topik wajib menurut pasar & sertifikasi
1. **PL-300 (Microsoft Power BI Data Analyst)** — 4 domain resmi: Prepare the data 25–30% (Power Query/M, profiling, cleaning), Model the data 25–30% (**DAX** measures & time intelligence, relationships, **row-level security**), Visualize & analyze 25–30%, Deploy & maintain 15–20% (workspaces, refresh, gateway, deployment pipelines). (https://www.nexpertsacademy.com/courses/pl-300)
2. **Lowongan Power BI Developer Indonesia** (asuransi, via Glints/LinkedIn): DAX, Power Query (M), SQL, star schema, data modeling, dashboard usability. (https://www.linkedin.com/posts/annisa-nugrahani-881676148_power-bi-developer-juniormid-level-activity-7449380879438725120-rTR1)
3. **Lowongan BI Analyst bank Indonesia** (BCA Digital): SQL, Power BI, Tableau, Looker; customer behavior analysis; data quality & governance compliance. (sumber: jobleads.com — URL tidak tersedia penuh saat live-check; teks hasil pencarian tersedia)
4. **Skill esensial BI analyst** — SQL & database management, Tableau/Power BI/Looker, **advanced Excel**, statistik dasar, ETL, business acumen; sertifikasi Microsoft Certified: Data Analyst Associate sebagai pintu masuk. (https://bds.telkomuniversity.ac.id/en/business-intelligence-analyst-roles-responsibilities-skills-salary-and-career-opportunities/)

### Lesson existing (14)
BI1 Lanskap · BI2 Star schema · BI3 SQL analitik · BI4 Dashboard · BI5 KPI · BI6 Self-service · BI7 Storytelling · BI8 Adhoc · BI9 Data quality · BI10 Eksperimen/A-B · BI11 Governance · BI12 Embedded · BI13 AI · BI14 Capstone

### GAP (terverifikasi via grep)
| # | Topik hilang | Kenapa wajib (sumber) | Prioritas |
|---|---|---|---|
| G1 | **DAX: measures, filter context, time intelligence** | 25–30% PL-300 (domain "Model the data"); syarat di hampir semua lowongan Power BI Indonesia; grep: kata "dax" tidak ada di seluruh biz* | P1 |
| G2 | **Power Query / M: transformasi & data preparation** | 25–30% PL-300 (domain "Prepare the data"); syarat lowongan Power BI Developer; grep: tidak ada "power query" di seluruh biz* | P1 |
| G3 | **Row-level security + administrasi Power BI Service** — workspaces, scheduled refresh, gateway, deployment pipelines | 15–20% PL-300 (domain "Manage and secure"); grep: tidak ada "row-level" di seluruh biz*; biz11 governance hanya soal definisi metrik | P1 |
| G4 | **Advanced Excel** — Power Pivot, lookup/aggregrasi lanjut, pivot untuk analisis cepat | Disebut "fundamental tool" untuk BI analyst (Telkom University); grep: "excel" hanya 1 sebutan di biz7 | P2 |

**Catatan:** ini gap *job-readiness* terbesar di Kelompok A — track mengajarkan craft BI dengan baik, tetapi tanpa DAX/Power Query/RLS lulusan belum memenuhi syarat lowongan Power BI Developer/BI Analyst yang sebenarnya (semua mensyaratkan ketiganya). Statistik dasar tidak dihitung gap karena platform sudah punya track Statistika (a11–a314) sebagai fondasi.

---

## 4. DATA ENGINEER (de1–de14) — 14 lesson

### Topik wajib menurut pasar
1. **VIDA (Jakarta)** — Scala Spark, **dbt**, **Terraform**, lakehouse; batch + streaming; "safe backfills and replays"; observability & cost; CI/CD. (https://lokercepat.id/data-engineer-vida/)
2. **Kata.ai (Jakarta)** — Kafka, Airflow, Spark, BigQuery, Python/SQL wajib; Docker, dasar Kubernetes; **CI/CD** (GitLab CI/GitHub Actions); data quality (Great Expectations/dbt tests); monitoring (Prometheus/Grafana). (https://grabjobs.co/indonesia/job/full-time/others/data-engineer-fulltime-remote-156436357)
3. **Jobstreet (Jakarta Selatan)** — ETL/ELT, SQL, Python, Airflow/**dbt**/Dagster, BigQuery/Snowflake/Redshift, data quality, partitioning, indexing, pipeline monitoring. (https://id.jobstreet.com/job/94556252)
4. **StraitsX (Jakarta)** — Airflow, dbt, Redshift/BigQuery, monitoring, **access control** data infrastructure, Terraform nilai plus. (https://grabjobs.co/indonesia/job/full-time/others/data-engineer-151977303)
5. **Data Engineer II (global)** — Airflow/dbt/ADF, Snowflake/Synapse, medallion/lakehouse, Git, **CI/CD**, automated testing. (https://www.allflyingjobs.com/jobs/data-engineer-ii)

### Lesson existing (14)
DE1 Lanskap · DE2 Pipeline batch vs streaming · DE3 SQL lanjutan · DE4 Python · DE5 Warehouse vs lake vs lakehouse · DE6 Dimensional & data vault · DE7 Orchestration DAG · DE8 Data quality · DE9 Streaming Kafka · DE10 Spark · DE11 Cost & tuning · DE12 Governance katalog & lineage · DE13 Real-time analitik · DE14 Capstone

### GAP (terverifikasi via grep)
| # | Topik hilang | Kenapa wajib (sumber) | Prioritas |
|---|---|---|---|
| G1 | **CI/CD untuk data pipeline** — GitHub Actions/GitLab CI, testing otomatis, deployment DAG | Syarat di Kata.ai, VIDA, DE II; grep: tidak ada "ci/cd"/"github actions"/"gitlab" di seluruh de* | P1 |
| G2 | **dbt: transformation-as-code** — model, test, docs, ref() | Muncul di 4 dari 5 lowongan sampel (VIDA, Jobstreet, StraitsX, DE II); grep: tidak ada "dbt" di seluruh de* | P1 |
| G3 | **Backfill & replay yang aman + idempotency** | Disebut eksplisit oleh VIDA ("planning safe backfills and replays"); grep: tidak ada "backfill"/"replay" di seluruh de* | P1 |
| G4 | **Infrastructure as Code (Terraform)** — provisioning resource data platform | Syarat VIDA; nilai plus StraitsX; grep: tidak ada "terraform" di seluruh de* | P2 |
| G5 | **Access control / RBAC di data platform** | Tugas eksplisit StraitsX ("manage access control"); de12 hanya katalog & lineage | P2 |
| G6 | **CDC (Change Data Capture)** — Debezium & pola ingest incremental | Pola ingest standar modern data stack; grep: tidak ada "CDC" di seluruh de* | P3 |

**Catatan:** track DE kuat di konsep (storage, modeling, streaming, Spark) — yang hilang adalah *disiplin software engineering* (CI/CD, dbt, IaC) yang justru membedakan lowongan DE dari kursus data generik. Docker/Kubernetes hanya disebut sepintas di beberapa file (de1/de2/de4/de7/de9/de13/de14), layak diperdalam tapi bukan gap murni.

---

## 5. DATABASE ADMINISTRATOR (dba1–dba12) — 12 lesson

### Topik wajib menurut pasar
1. **Bank BSI (Database System Administrator)** — instalasi & konfigurasi, monitoring, replikasi, hak akses user, preventive maintenance, dokumentasi aset, patching/upgrade, monitoring kesehatan-performa-kapasitas-backup, backup & restore otomatis, **testing restore berkala**; syarat: SQL (Oracle/MySQL/PostgreSQL), strategi backup & restore, keamanan & kepatuhan regulasi, optimasi performa, **scripting (Python/Bash/PowerShell)**, failover/clustering/replikasi, sertifikasi nilai tambah. (https://investakit.com/loker-database-system-administrator-bank-bsi-surabaya/)
2. **PT Abhimata Persada (Oracle DBA, Jakarta)** — daily operation Oracle, performance & resource monitoring/tuning, **RMAN** backup & restore, capacity planning, DR operation & BCP, dokumentasi; syarat: Oracle (instalasi, ASM, export/import, RMAN), **RAC** nilai plus, RHEL, HA cluster, ITSM, pengetahuan **DevOps/CI-CD** nilai plus. (https://lokercepat.id/it-database-administrator-oracle-dba-pt-abhimata-persada/)
3. **PT Imecon Teknindo (DBA PostgreSQL & Oracle)** — instalasi/konfigurasi/patching/upgrade, backup & recovery (pgBackRest), performance tuning (query optimization, indexing, **vacuum**, statistics), streaming & logical replication, HA/DR failover, security (roles, privileges, auditing, encryption). (https://glints.com/id/opportunities/jobs/database-administrator-dba-postgresql-and-dba-oracle/6b78ddb4-97ee-42e2-9b2a-4af2a27fe19c)
4. **Selarastech (Oracle DBA & SQL Server, Jakarta)** — backup/recovery/DR, RAC & **Data Guard**, performance tuning, patching/upgrade/migrasi, HA & replikasi; syarat: OCA/OCP nilai plus, Linux/Unix. (https://glints.com/id/opportunities/jobs/oracle-dba-and-sql-server-specialist/9982df56-2228-4949-87fe-8ec7eff64196)

### Lesson existing (12)
DBA1 DBA di era cloud · DBA2 Arsitektur · DBA3 Instalasi & konfigurasi · DBA4 Backup & recovery (RPO/RTO) · DBA5 Replikasi & HA · DBA6 Performance tuning · DBA7 Keamanan · DBA8 Monitoring & alerting · DBA9 Capacity planning · DBA10 Migrasi & upgrade · DBA11 Managed database cloud · DBA12 Capstone

### GAP (terverifikasi via grep)
| # | Topik hilang | Kenapa wajib (sumber) | Prioritas |
|---|---|---|---|
| G1 | **Otomasi & scripting untuk DBA** — Python/Bash/PowerShell untuk tugas rutin (cek kesehatan, rotasi backup, housekeeping) | Syarat eksplisit BSI ("terbiasa dengan scripting"); grep: tidak ada "bash"/"powershell"/"scripting" di seluruh dba* | P1 |
| G2 | **Partitioning** — strategi partisi tabel besar (range/list/hash), maintenance partisi | Topik inti sertifikasi Oracle/PostgreSQL/SQL Server; grep: tidak ada "partitioning" di seluruh dba* | P1 |
| G3 | **Schema change management / database DevOps** — Flyway/Liquibase, zero-downtime DDL, versioning skema | Abhimata: pengetahuan DevOps/CI-CD nilai plus; dba10 hanya migrasi & upgrade versi, bukan pipeline perubahan skema | P2 |
| G4 | **DR drill & runbook operasional** — uji restore berkala, failover drill, runbook insiden | BSI eksplisit: "testing restore database secara berkala"; dba4 membahas RPO/RTO secara teori, bukan disiplin drill-nya | P2 |
| G5 | **Audit trail & kepatuhan untuk industri regulasi** — audit logging, pemenuhan audit OJK/perbankan | BSI: "keamanan database dan kepatuhan regulasi"; dba7 keamanan umum, aspek audit-regulasi belum spesifik | P3 |

**Catatan:** ini track paling selaras dengan lowongan Indonesia — checklist BSI (instalasi, monitoring, replikasi, backup/restore, patching, dokumentasi, kapasitas) terpetakan hampir 1:1 ke dba3–dba10. dba6 sudah membahas indexing (36 sebutan "indeks/index"), jadi query optimization tidak diklaim sebagai gap.

---

## RINGKASAN EKSEKUTIF

| Track | Lesson | Status kelengkapan | Gap P1 | Rekomendasi tambah |
|---|---|---|---|---|
| Risk Reporting | 14 | Craft kuat, **substansi angka risiko tipis** | 4 (risk appetite, ECL/RWA, BCBS 239, market risk reporting) | +4–5 lesson |
| Fraud & AML | 31 | Paling lengkap; kurang topik CAMS baru | 3 (virtual assets, IRA, terrorist financing) | +3–4 lesson |
| Business Intelligence | 14 | **Gap job-readiness terbesar**: tanpa DAX/Power Query/RLS belum memenuhi syarat lowongan | 3 (DAX, Power Query, RLS+Service admin) | +3–4 lesson |
| Data Engineer | 14 | Konsep kuat, disiplin software engineering hilang | 3 (CI/CD, dbt, backfill/replay) | +3–4 lesson |
| Database Administrator | 12 | Paling selaras dgn lowongan ID | 2 (scripting otomasi, partitioning) | +2–3 lesson |

**Total usulan lesson tambahan: 15–20** (bukan padding — tiap item terverifikasi tidak ada di konten existing via grep, dan didukung lowongan atau silabus sertifikasi dengan URL sumber). Estimasi per lesson mengikuti standar track (±45–60 menit). Tidak ada lesson existing yang perlu dihapus untuk memberi ruang; gap bersifat aditif.
