# Gap Analysis — Kelompok B (Learn v2) · 2026-10-14

Riset mandiri (tanpa menulis lesson): membandingkan 7 track baru Learn v2
(aai, aie, mle, dle, mlops, llmops, bcd — masing-masing 12–14 lesson, dibuat 2026-10-14)
terhadap **lowongan kerja nyata** (global + Indonesia) dan **kurikulum/roadmap standar**.
Metode: web search lowongan + JD per role, lalu grep isi lesson (bukan cuma judul)
untuk memastikan topik benar-benar tidak tercakup.

**Cara baca prioritas:** 🔴 Tinggi = muncul eksplisit di banyak JD / hampir universal di
kurikulum standar → layak jadi lesson baru. 🟡 Sedang = muncul di JD senior/spesialis
atau roadmap, nilai tambah jelas. ⚪ Rendah = emerging/niche, bisa ditunda.

---

## Ringkasan eksekutif

| Track | Lesson | Topik wajib terpetakan | Gap 🔴 | Gap 🟡 | Status |
|---|---|---|---|---|---|
| Agentic AI Engineer (aai) | 12 | 10 | 3 | 2 | **MCP tidak ada sama sekali** — lubang terbesar di semua track |
| AI Engineering (aie) | 12 | 10 | 1 | 2 | Hybrid search + reranking hilang dari lesson RAG |
| ML Engineer (mle) | 14 | 9 | 4 | 1 | Track "ML" tanpa lesson algoritma ML klasik |
| Deep Learning Engineer (dle) | 12 | 10 | 1 | 2 | Deteksi objek/segmentasi (YOLO, U-Net) hilang |
| MLOps (mlops) | 12 | 10 | 1 | 3 | Experiment tracking (MLflow/W&B) tidak ada |
| LLMOps (llmops) | 12 | 10 | 1 | 2 | Operasional inference self-hosted (vLLM) tidak ada |
| Blockchain Data Scientist (bcd) | 12 | 10 | 3 | 2 | Cross-chain tracing, indexing skala besar, oracle |

Total gap teridentifikasi: **13 prioritas tinggi**, 13 sedang, sisanya rendah (dicatat singkat).
Rekomendasi: tambah ~13–16 lesson (rata-rata 2 per track) untuk menutup semua gap 🔴.

---

## 1. Agentic AI Engineer (aai1–aai12)

### Lesson existing
1. AAI1 — Dari Chatbot ke Agen
2. AAI2 — Anatomi Agen (ReAct, plan-and-execute terverifikasi ada)
3. AAI3 — Tool Use & Function Calling
4. AAI4 — Memory: Ingatan Jangka Pendek & Panjang
5. AAI5 — RAG sebagai Tool (fokus: *kapan* retrieve, bukan kualitas retrieval)
6. AAI6 — Multi-Agent: Orkestrasi & Komunikasi
7. AAI7 — Prompt Engineering untuk Agen
8. AAI8 — Evaluasi Agen (trajectory eval, LLM-judge)
9. AAI9 — Guardrail & Human-in-the-Loop
10. AAI10 — Framework: LangChain/LangGraph & Alternatif
11. AAI11 — Debugging Agen: Tracing & Observability
12. AAI12 — Capstone: Agen Analisis End-to-End

### Topik wajib (sumber)
- Pola agen: ReAct, plan-and-execute, reflection, supervisor/worker — JD Fx31 Labs (Shine.com),
  JD N-iX, roadmap AdilShamim8 modul 05, roadmap titan-codes tahap 6.
  → tercakup (aai2, aai6) ✓
- Tool use, memory/state, multi-agent orchestration — analisis 15 JD principal
  (github.com/ndqkhanh/agent-research-book): 100% JD mensyaratkan multi-agent orchestration,
  RAG, dan production LLM apps. → tercakup (aai3, aai4, aai6) ✓
- **MCP (Model Context Protocol)** — "nearly universal" (12+/15 JD); JD obtainjob & N-iX
  menyebut eksplisit; roadmap modul 04 ("Tools and MCP"); roadmap naveen-bandi
  "MCP — 2026 standard". → **TIDAK ADA** (grep: 0 hasil di semua file aai) ✗
- Evaluasi agen (golden dataset, trajectory eval), observability (LangSmith/Langfuse) —
  JD N-iX (RAGAS, DeepEval), roadmap modul 06. → tercakup (aai8, aai11) ✓
- Guardrail & safety — JD VY Systems, rework.com. → tercakup (aai9) ✓
- **Production deployment agen** (retry, idempotency, timeout, queue, checkpointing,
  cost control) — roadmap titan-codes tahap 12 ("Production"); peran AgentOps
  (iilm.edu). → tidak ada (aai11 hanya debugging, bukan hardening/deploy) ✗
- **Context engineering** (manajemen context window, compaction/summarization,
  prompt caching, context rot) — ai-engineering-bible Phase 5; the-agent-lab.
  → tidak ada ✗

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| AAI-G1 | **MCP: server & client** | Standar 2026 yang diminta JD ("write a tool once, use it across any MCP client"); lubang terbesar di seluruh Kelompok B | 🔴 Tinggi | 1 lesson: bangun MCP server (expose tool/data), konsumsi dari LangGraph, tool registry |
| AAI-G2 | **Context engineering** | Agen produksi mati karena context rot/bengkak, bukan karena logika; topik 2026 yang belum ada di lesson mana pun | 🔴 Tinggi | 1 lesson: compaction, prompt caching, routing konteks, budget konteks |
| AAI-G3 | **Agen ke produksi: hardening & deploy** | Jarak demo→produksi = retry/idempotency/timeout/checkpointing; peran AgentOps memang ada di pasar | 🔴 Tinggi | 1 lesson: pola failure recovery, LangGraph Platform/Docker, kontrol biaya |
| AAI-G4 | **Keamanan eksekusi tool** (sandboxing, least-privilege, secret) | aai9 fokus ke guardrail output; eksekusi tool butuh izin & isolasi sendiri | 🟡 Sedang | 1 lesson: sandbox tool, permission model, approval gate per aksi |
| AAI-G5 | **Protokol antar-agen (A2A)** | Interop lintas framework, emerging | ⚪ Rendah | gabung ke AAI-G3 atau tunda |

---

## 2. AI Engineering (aie1–aie12)

### Lesson existing
1. AIE1 — AI Engineering sebagai Disiplin (seleksi model: API vs self-host vs ML klasik ✓)
2. AIE2 — Prompt Engineering Sistematis
3. AIE3 — RAG: Chunking, Embedding, Retrieval (dasar: chunking + cosine similarity)
4. AIE4 — Evaluasi LLM (golden set, LLM-as-judge ✓)
5. AIE5 — Fine-Tuning: Kapan dan Bagaimana (LoRA terverifikasi ada)
6. AIE6 — Structured Output dan Function Calling
7. AIE7 — Caching, Batching, Optimasi Biaya (semantic cache ✓)
8. AIE8 — Observability untuk Aplikasi LLM
9. AIE9 — Safety: Prompt Injection dan Red Teaming
10. AIE10 — Deploy Aplikasi LLM (sync/streaming/batch/fallback, teori antrean ✓)
11. AIE11 — UX untuk AI
12. AIE12 — Capstone: Aplikasi RAG Mini Produksi

### Topik wajib (sumber)
- RAG: chunking, embedding, retrieval quality — rework.com "AI Engineer JD 2026"
  ("chunking strategy, embedding model selection, retrieval quality evaluation");
  JD obtainjob ("hybrid retrieval architectures, relevance tuning"); JD Bandwidth
  (R&D role: RAG, advanced prompting). → tercakup SEBAGIAN: aie3 tidak menyebut
  hybrid/BM25/rerank sama sekali (grep: 0) ✗
- Evaluasi + observability + safety — JD Autodesk "Senior AI Engineer – LLM Evaluation"
  (eval framework, regression testing, RAGAS-style quality metrics). → tercakup
  (aie4, aie8, aie9) ✓
- Fine-tuning judgment (kapan vs RAG vs prompt) — rework.com. → tercakup (aie5) ✓
- MLOps/monitoring untuk AI — rework.com. → tercakup (aie8) ✓

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| AIE-G1 | **Hybrid search & reranking** (BM25 + dense, RRF fusion, reranker, query rewrite) | Diminta eksplisit di JD ("hybrid retrieval architectures"); aie3 berhenti di cosine similarity — padahal ini pembeda RAG produksi vs demo | 🔴 Tinggi | 1 lesson: kapan dense gagal, bangun hybrid + rerank, ukur retrieval quality |
| AIE-G2 | **Agentic/advanced RAG** (multi-query, HyDE, corrective/self-RAG) | Roadmap standar Phase 4; aai5 hanya bahas *kapan* retrieve | 🟡 Sedang | 1 lesson: pola retrieval adaptif untuk kasus sulit |
| AIE-G3 | **Membangun benchmark & synthetic data untuk evaluasi** | JD Autodesk: "building benchmark evaluation sets"; aie4 punya golden set tapi tanpa cara membangunnya (synthetic data = 0 hasil) | 🟡 Sedang | 1 lesson: generate & kurasi eval set sintetis, cegah kontaminasi |
| AIE-G4 | GraphRAG | Roadmap standar, belum di JD mainstream | ⚪ Rendah | tunda / gabung AIE-G2 |

---

## 3. Machine Learning Engineer (mle1–mle14)

### Lesson existing
1. MLE1 — Dari Notebook ke Produksi
2. MLE2 — Data Pipeline & Feature Engineering
3. MLE3 — Training yang Reproducible (experiment tracking hanya dibahas sebagai "mitos", tanpa hands-on)
4. MLE4 — Evaluasi di Luar Akurasi (precision/recall, kalibrasi, slice ✓)
5. MLE5 — Model Serving: Batch vs Online
6. MLE6 — Monitoring: Drift & Performance Decay
7. MLE7 — Testing untuk ML
8. MLE8 — Versioning: Data, Model, Code
9. MLE9 — CI/CD untuk ML
10. MLE10 — Scaling: Distributed Training
11. MLE11 — Cost & Latency Optimization
12. MLE12 — Fairness & Responsible ML
13. MLE13 — LLM dalam Sistem ML
14. MLE14 — Capstone: Sistem ML End-to-End

### Topik wajib (sumber)
- Feature engineering & pipeline, training/eval/serving/monitoring — JD albionarctalent
  (Dubai), JD Jiwa Group (Indonesia, via Jobstreet): "feature engineering, model training,
  evaluation, tuning, deployment"; JD Cakap (Denpasar): real-time serving, promotion
  workflow, drift detection, A/B testing infra. → tercakup (mle2–mle9) ✓
- **Algoritma ML klasik & model selection** (regresi, tree, ensemble/XGBoost, clustering) —
  naukri.com "Core ML: regression, classification, clustering"; analisis 21 JD
  (github.com/nikkihelliwell/ml-engineer-learning) tema #4 (frek. 0,33); amplework
  checklist "Model Selection". → **TIDAK ADA** (hanya disebut selintas di mle1/mle13) ✗
- **Hyperparameter tuning** (Optuna, strategi search) — amplework checklist;
  JD Bandwidth. → tidak ada (grep: 0 di semua file mle) ✗
- **Experiment tracking** (MLflow/W&B) — analisis 21 JD tema #6 (frek. 0,43);
  JD JobLeads Bali: "Strong MLFlow experience". → hanya argumen pro (mle3 "mitos"),
  tanpa lesson hands-on ✗
- **ML systems design** (training/serving skew, champion/challenger, A/B testing,
  retraining cadence) — analisis 21 JD tema #10 (frek. 0,62 — tertinggi di antara
  yang belum tercakup). → tidak ada ✗
- Interpretability/explainable AI — rework.com (preferred). → tidak ada (SHAP: 0) ✗

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| MLE-G1 | **Algoritma ML klasik & model selection** | Track bernama "Machine Learning Engineer" tapi nol lesson algoritma — learner tak bisa memilih logistic vs tree vs XGBoost; diminta eksplisit JD Indonesia (Jiwa Group: scikit-learn, XGBoost/LightGBM) | 🔴 Tinggi | 1 lesson: kapan model apa (regresi/tree/ensemble/clustering) + feature selection |
| MLE-G2 | **Hyperparameter tuning** (Optuna, search strategy, budget) | Checklist evaluasi talent 2026; JD Bandwidth; tanpa ini model "bagus" = kebetulan | 🔴 Tinggi | 1 lesson: search space, Optuna, hindari overfitting ke validation |
| MLE-G3 | **Experiment tracking dengan MLflow/W&B** | Frek. 0,43 di 21 JD; JD Bali/Indonesia mensyaratkan MLflow; mle3 baru berargumen, belum hands-on | 🔴 Tinggi | 1 lesson: tracking run, registry, bandingkan eksperimen |
| MLE-G4 | **ML systems design** (skew, champion/challenger, A/B test, retraining cadence) | Tema JD berfrekuensi tertinggi (0,62) yang belum tercakup; JD Cakap: "A/B testing infrastructure" | 🔴 Tinggi | 1 lesson: desain sistem ML end-to-end + eksperimen produksi |
| MLE-G5 | **Interpretability** (SHAP, feature importance) | Preferred di JD; penting untuk konteks risk/finance Septian | 🟡 Sedang | 1 lesson: SHAP, kapan model harus bisa dijelaskan |
| MLE-G6 | Spesialisasi domain (time series, recsys) | Nice-to-have di JD | ⚪ Rendah | tunda |

---

## 4. Deep Learning Engineer (dle1–dle12)

### Lesson existing
1. DLE1 — Peta Medan Deep Learning
2. DLE2 — Neural Network: Forward & Backprop
3. DLE3 — CNN untuk Citra (konvolusi/pooling/augmentasi dasar; YOLO/U-Net hanya disebut)
4. DLE4 — Sequence: dari RNN ke Transformer
5. DLE5 — Transformer Mendalam
6. DLE6 — Training: Optimizer & Schedule (regularisasi: dropout/weight decay/early stopping ✓)
7. DLE7 — Transfer Learning & Pretraining
8. DLE8 — GPU & Mixed Precision
9. DLE9 — Debugging: Loss Tidak Turun
10. DLE10 — Deploy Model DL (kuantisasi, ONNX, TensorRT, distilasi, canary ✓ — paling lengkap)
11. DLE11 — Generative: VAE, GAN, Diffusion
12. DLE12 — Capstone: Proyek DL End-to-End

### Topik wajib (sumber)
- Arsitektur CNN/RNN/Transformer/GAN — JD China Mobile (github.com/wjl110/review):
  "familiarity with CNN, RNN, Transformer, GAN"; skilldential: arsitektur +
  distributed training + HPC. → tercakup (dle2–dle5, dle11) ✓
- Framework PyTorch/TF, optimasi training — TechLoy, sergeykhval resume guide. → tercakup ✓
- **Visi komputer terapan: object detection & segmentation** — JD SwiftMind Indonesia
  (dealls.com): "object detection, segmentation, OCR" + "CNNs, YOLO, Detectron2,
  EfficientNet, UNet" sebagai syarat. → hanya disebut di dle3, tanpa lesson arsitektur ✗
- **Distributed training** (DDP/FSDP) — JD China Mobile: "distributed training…
  engineering experience"; skilldential HPC. → dle8 hanya single-GPU; mle10 generik ✗
- Model compression & edge inference — JD China Mobile ("model compression, edge
  inference… plus"). → tercakup sebagian (dle10 kuantisasi/ONNX/TensorRT) ✓

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| DLE-G1 | **Deteksi objek & segmentasi** (YOLO, U-Net, Mask R-CNN konsep) | Syarat eksplisit lowongan CV Indonesia (SwiftMind); dle3 berhenti di klasifikasi — padahal deteksi/segmentasi = separuh pekerjaan DL vision | 🔴 Tinggi | 1 lesson: arsitektur deteksi vs segmentasi, anchor/box, mask, metrik IoU/mAP |
| DLE-G2 | **Distributed training untuk DL** (DDP, FSDP/DeepSpeed, gradient sync) | Syarat engineering di JD; mle10 terlalu generik untuk nuansa DL (sharding, komunikasi antar-GPU) | 🟡 Sedang | 1 lesson: DDP hands-on + kapan FSDP |
| DLE-G3 | **Model multimodal** (CLIP, vision-language) | Area hiring 2026; hanya disebut selintas | 🟡 Sedang | 1 lesson: contrastive learning, zero-shot classification |
| DLE-G4 | **Interpretabilitas DL** (Grad-CAM, saliency) | Kebutuhan audit model vision; dle3 hanya 1 sebutan "Interpret" | 🟡 Sedang | 1 lesson: visualisasi keputusan CNN/Transformer |
| DLE-G5 | Self-supervised learning (SimCLR, MAE) | Research-adjacent | ⚪ Rendah | tunda |

---

## 5. MLOps (mlops1–mlops12)

### Lesson existing
1. MLOps1 — Kenapa ML Butuh Ops
2. MLOps2 — Pipeline & Orchestration
3. MLOps3 — Feature Store
4. MLOps4 — Model Registry & Versioning
5. MLOps5 — CI/CD untuk Model (shadow → canary 5% → bertahap ✓ lengkap)
6. MLOps6 — Serving Infra
7. MLOps7 — Monitoring & Alerting
8. MLOps8 — Strategi Retraining
9. MLOps9 — Testing: Data & Model Validation
10. MLOps10 — Governance: Audit & Lineage
11. MLOps11 — Kubernetes untuk ML (spot instance disebut)
12. MLOps12 — Capstone: Pipeline MLOps End-to-End

### Topik wajib (sumber)
- CI/CD model, monitoring/drift, feature store, registry — template JD kore1.com
  "MLOps Engineer 2026" (required: CI/CD for models, Docker/K8s; worth-mentioning:
  Feast, vLLM, Terraform); JD Talantrix: pipeline orchestration (Kubeflow/Airflow),
  serving (Triton/BentoML), MLflow/W&B, Prometheus/Grafana. → tercakup (mlops2–mlops9) ✓
- **Experiment tracking** (MLflow, W&B, Neptune) — JD Talantrix required;
  skill javi-ai "mlops-engineer" core. → tidak ada (mlops4 = registry, bukan tracking) ✗
- **Infrastructure as Code** (Terraform) — kore1 "worth mentioning"; JD Sumo Logic
  required (Terraform, Helm). → tidak ada (grep: 0) ✗
- **Cost optimization / FinOps** — JD Talantrix: "Optimize compute costs";
  kore1: "Training and inference spend, reviewed with finance". → hanya spot instance
  selintas ✗
- **LLM serving** (vLLM) — kore1: "Serving LLMs with vLLM… if the LLM roadmap";
  JD BJAK Indonesia (GrabJobs): "Experience with model serving platforms such as
  vLLM or HuggingFace TGI". → tidak ada ✗
- Data validation — zschuan1230 SKILL ("Great Expectations, schema validation").
  → tercakup sebagian (mlops9) ✓

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| MLOps-G1 | **Experiment tracking** (MLflow/W&B) + data versioning (DVC) | Required di JD Talantrix & skill standar; registry ≠ tracking; JD Indonesia (Bali) mensyaratkan MLflow | 🔴 Tinggi | 1 lesson: tracking + DVC, hubungkan ke registry |
| MLOps-G2 | **Infrastructure as Code** (Terraform untuk stack ML) | Worth-mentioning kore1, required Sumo Logic; tanpa IaC, reproducibility infra = manual | 🟡 Sedang | 1 lesson: Terraform untuk training/serving infra |
| MLOps-G3 | **FinOps untuk ML** (tagging, budget, spot/preemptible strategy, showback) | JD Talantrix & kore1 eksplisit; GPU = pos biaya terbesar | 🟡 Sedang | 1 lesson: ukur & potong biaya training/inference |
| MLOps-G4 | **Serving LLM** (vLLM/TGI: batching, throughput) | JD BJAK Indonesia eksplisit; jembatan ke track LLMOps | 🟡 Sedang | 1 lesson: vLLM hands-on, throughput vs latency |
| MLOps-G5 | Feature freshness monitoring | JD Cakap/JobLeads ("detecting feature store lag") | ⚪ Rendah | selipkan ke mlops7, bukan lesson baru |

---

## 6. LLMOps (llmops1–llmops12)

### Lesson existing
1. LLMOps1 — Kenapa MLOps Tidak Cukup
2. LLMOps2 — Prompt Management & Versioning
3. LLMOps3 — Evaluasi Berkelanjutan
4. LLMOps4 — Operasional RAG (index pipeline, freshness, eval retrieval ✓)
5. LLMOps5 — Guardrail Operasional (PII redaction, fail-open/closed ✓)
6. LLMOps6 — Operasi Biaya (caching 37 sebutan ✓, token economics)
7. LLMOps7 — Observability
8. LLMOps8 — Operasional Fine-Tuning
9. LLMOps9 — Safety Ops (red team berkala, incident response ✓)
10. LLMOps10 — Deploy: Canary & Rollback untuk LLM (strategi deploy ✓, tapi tanpa vLLM)
11. LLMOps11 — Feedback Loop
12. LLMOps12 — Capstone: LLMOps Asisten Produksi

### Topik wajib (sumber)
- Prompt versioning, eval (golden dataset, LLM-as-judge, HITL), token economics,
  latency optimization, observability, guardrail — secondtalent.com "LLMOps Engineer:
  Key Skills & Responsibilities in 2026" (core knowledge areas). → tercakup
  (llmops2, 3, 5, 6, 7) ✓
- LLM deployment (OpenAI/Llama/Mistral), inference pipeline, RAG ops — JD Infosys
  "Gen AI LLMOps Engineer" (Shine.com). → tercakup ✓
- **Self-hosted inference** — JD BJAK Indonesia: "model serving platforms such as vLLM
  or HuggingFace TGI" + "GPU orchestration"; JD Thrive (careerbeacon):
  "inference latency, throughput, caching strategies"; secondtalent: "latency
  optimization and streaming response patterns". → **tidak ada** (vLLM: 0 di llmops10) ✗
- **Model routing, fallback & provider abstraction** — secondtalent core knowledge.
  → disebut selintas (llmops1/6/10), tanpa lesson/pola ✗
- CI/CD untuk model+prompt, reproducibility — JD Infosys, JD Sumo Logic. → tercakup
  sebagian (llmops2, llmops10) ✓

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| LLMOps-G1 | **Operasional inference self-hosted** (vLLM/TGI, continuous batching, KV-cache, GPU autoscaling) | Syarat eksplisit JD Indonesia (BJAK); llmops10 bahas strategi deploy tanpa mesin inference-nya — seperti bahas CI/CD tanpa Docker | 🔴 Tinggi | 1 lesson: vLLM hands-on, ukur throughput/latency, autoscaling GPU |
| LLMOps-G2 | **Smart routing & fallback antar provider/model** | Core knowledge secondtalent; pola produksi nyata (model murah dulu, fallback saat gagal, abstrak provider) | 🟡 Sedang | 1 lesson: router, fallback chain, evaluasi tradeoff biaya/kualitas |
| LLMOps-G3 | **Latency SLO & capacity planning** | JD Thrive & Irth (SLO, latency optimization); llmops6 fokus biaya, bukan SLO | 🟡 Sedang | 1 lesson: tetapkan SLO, ukur p50/p95/p99, rencanakan kapasitas |
| LLMOps-G4 | DR & multi-region untuk workload LLM | JD Irth (DR patterns) — enterprise | ⚪ Rendah | tunda |

---

## 7. Blockchain Data Scientist (bcd1–bcd12)

### Lesson existing
1. BCD1 — Apa yang Bisa Dianalisis On-Chain
2. BCD2 — Membaca Data Chain
3. BCD3 — Address Clustering & Entity Labeling
4. BCD4 — Analisis DeFi (TVL, AMM x·y=k, ekonomi LP ✓)
5. BCD5 — Tokenomics & Distribusi
6. BCD6 — Data NFT: Wash Trading & Valuasi
7. BCD7 — Deteksi Fraud On-Chain
8. BCD8 — MEV: Konsep & Deteksi (mempool ✓)
9. BCD9 — SQL untuk Data Chain (Gaya Dune)
10. BCD10 — Graph Analysis Aliran Dana
11. BCD11 — Risk Scoring Wallet & AML On-Chain
12. BCD12 — Capstone: Investigasi Alaman Dana

### Topik wajib (sumber)
- EVM fluency (decode tx/event, ABI, token standards), indexing at scale —
  JD TWG AI "Senior Data Scientist – DeFi Blockchain / On-Chain Surveillance"
  (unchaindata.xyz): "EVM fluency at the data level… load-bearing skill";
  "on-chain data engineering — pulling and indexing chain data at scale
  (subgraphs / GraphQL, raw-node indexing)". → bcd2 mencakup baca data;
  **indexing skala besar tidak ada** ✗
- **Cross-chain / bridge tracing** — JD TWG: "following funds as they move across
  chains, for provenance and composability surveillance". → tidak ada
  (grep "bridge/jembatan" hanya metafora) ✗
- **Oracle literacy** (price feed, TWAP, failure modes: staleness, manipulasi
  flash-loan) — JD Chainlink Labs "Data Scientist, Data Quality and Benchmarking"
  (dailyremote.com): oracle literacy sebagai requirement inti. → tidak ada ✗
- DeFi mechanism literacy (flash loan, lending, AMM) — JD TWG, JD Mysten Labs
  (dailyremote.com: "TVL, volume quality, LP returns, peg stability,
  mint/redeem flows, cross-chain bridging"). → tercakup sebagian (bcd4);
  **stablecoin & market microstructure belum** ✗
- Anomaly detection untuk time series finansial + alerting — JD Chainlink
  (Prometheus/Alertmanager/Grafana). → bcd7 fokus fraud pola; deteksi anomali
  deret waktu tidak ada ✗
- SQL/Python dengan web3.py, Dune/Flipside/BigQuery — JD Chainlink. → tercakup (bcd9) ✓

### GAP
| # | Topik hilang | Justifikasi | Prioritas | Perkiraan lesson |
|---|---|---|---|---|
| BCD-G1 | **Cross-chain & bridge tracing** | Requirement eksplisit JD TWG; bcd10 hanya single-chain — padahal dana kejahatan modern selalu hop antar chain via bridge | 🔴 Tinggi | 1 lesson: anatomi bridge, teknik follow-the-money lintas chain |
| BCD-G2 | **Indexing & data engineering on-chain skala besar** (subgraph, BigQuery public dataset, raw-node indexing, pipeline dbt) | "Load-bearing skill" kedua setelah EVM fluency (JD TWG); JD Chainlink & Mysten mensyaratkan pipeline analytics engineering | 🔴 Tinggi | 1 lesson: dari RPC ke tabel analitik yang queryable |
| BCD-G3 | **Oracle literacy** (price feed, TWAP/median, serangan oracle & manipulasi) | Requirement inti JD Chainlink; analis DeFi yang tak paham oracle tak bisa bedakan harga asli vs hasil manipulasi | 🔴 Tinggi | 1 lesson: cara kerja feed, failure mode, deteksi manipulasi |
| BCD-G4 | **Stablecoin & market microstructure** (peg stability, mint/redeem, likuiditas, slippage, funding rate) | JD Mysten core; stablecoin hanya disebut 5x selintas | 🟡 Sedang | 1 lesson: ukur kesehatan stablecoin & pasar |
| BCD-G5 | **Deteksi anomali deret waktu + alerting** (staleness, flatline, spike) | JD Chainlink: anomaly detection + SLO-driven alerting | 🟡 Sedang | 1 lesson: detektor + alert untuk data feed/protokol |
| BCD-G6 | Analitik governance/DAO & pendapatan protokol | Niche analis | ⚪ Rendah | tunda |

---

## Catatan metodologi & batasan

- Sumber lowongan: hasil web search 2026-10-14 (Shine.com, dailyremote.com, careerbeacon.com,
  theladders.com, unchaindata.xyz, dealls.com, lokercepat.id, id.indeed.com, id.jooble.org,
  jobleads.com, grabjobs.co) + template JD 2026 (rework.com, kore1.com) + analisis agregat JD
  (github.com/ndqkhanh/agent-research-book — 15 JD; github.com/nikkihelliwell/ml-engineer-learning
  — 21 JD) + roadmap kurikulum (AdilShamim8, the-agent-lab/sreegd, titan-codes, ai-engineering-bible).
- Verifikasi isi lesson via grep atas file `src/app/v2/content/{aai,aie,mle,dle,mlops,llmops,bcd}*.ts`
  (judul step + kemunculan istilah kunci) — bukan sekadar judul file.
- Yang TIDAK dinilai: kualitas pedagogi per lesson, akurasi kode/lab, dan kelengkapan
  6 track lain di luar Kelompok B.
- "Perkiraan 1 lesson" = estimasi kasar; beberapa gap 🟡 bisa digabung (mis. MLE-G2+G3,
  MLOps-G2+G3) bila Septian ingin hemat lesson.
