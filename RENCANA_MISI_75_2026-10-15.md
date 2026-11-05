# RENCANA ROLLOUT MISI — 75 MISI (2 per track + 1 kombinasi per track)

Keputusan Septian 09:55 WITA, 15 Okt 2026: deploy G1 + patch, G2/G3 mulai, fitur Misi ikut dibangun.
Struktur Misi disetujui dengan pentahapan (pendapat parent yang diterima): **pilot dulu untuk mengunci format, lalu gelombang per track prioritas.**
Dokumen induk format: `DESAIN_PROYEK_TERPADU_V2_2026-10-15.md` + `DATASET_PUBLIK_PROYEK_2026-10-15.md`. Dokumen ini = peta rollout-nya.

## 1. Prinsip terkunci (tidak berubah per misi)

- Format Misi: briefing peran/klien → data room (dataset publik kotor, snapshot beku) → lab ber-gate → checkpoint keputusan bercabang → suntikan impostor tak diumumkan → deliverable ber-rubrik → debrief. rr19-audit-impostor dan Guided Project Progress Hub **TIDAK diubah**.
- **Jumlah langkah & durasi TIDAK dikunci (keputusan Septian 11:39 WITA, 15 Okt 2026):** pilot kebetulan 12 langkah / 90–150 mnt, tapi misi yang lebih kompleks BOLEH lebih dari 12 langkah dan lebih dari 150 menit. Yang terkunci adalah kelengkapan 7 elemen end-to-end di atas + standar F1–F6; langkah dan estimasi durasi mengikuti kompleksitas misi dan WAJIB jujur per misi (bukan dipaskan ke angka pilot).
- Per track: **Misi A "core"** (alur kerja utama track, end-to-end, kompleksitas sedang), **Misi B "edge"** (data lebih kotor, ambiguitas, sinyal konflik, kompleksitas tinggi), **Misi C "kombinasi"** (capstone lintas track; deliverable = artefak portofolio: memo / laporan audit / dashboard yang bisa ditunjukkan ke employer).
- Standar kualitas = lesson: flag F1–F6 auto-reject, F2 self-contained (prasyarat diringkas di dalam misi), dataset publik dengan lisensi yang membolehkan snapshot (abu-abu = link-only), prosa RAW, summary wajib.
- Satu-satunya pengecualian dataset: track WQB memakai snapshot data Brain milik Septian sendiri (pola rr19), bukan dataset publik.

## 2. Gelombang

| Gelombang | Isi | Syarat mulai |
|---|---|---|
| **Pilot** | 3 misi dispesifikasi penuh di dokumen desain: Misi DBD (Health DS), Misi Investigasi Jejak Dana (Blockchain DS), Misi Lab Sampel Tertukar (Bioinformatika) | Format lock — gerbang parent penuh sebelum rollout |
| **M1** | 7 track prioritas × Misi A+B = 14 misi solo | Pilot lolos gerbang |
| **M2** | 18 track lain × Misi A+B = 36 misi solo | M1 berjalan |
| **Capstone** | 25 Misi C (1 per track) | Misi A kedua track pasangan sudah ada |

Total visi: 50 solo + 25 kombinasi = **75 misi**.

Track prioritas M1 (keputusan Septian 07:11): Credit Risk, Fraud/AML, Market Risk, Risk Reporting, Health Data Science, Bioinformatika, Blockchain Data Scientist.

## 3. Peta Misi C (kombinasi) — pasangan utama per track

| Track rumah | Pasangan | Sudut capstone |
|---|---|---|
| Credit Risk | Fraud/AML | Satu berkas pengajuan dinilai dua lensa: kelayakan kredit × sinyal fraud aplikasi |
| Fraud/AML | Blockchain DS | Pencucian berlapis: fiat → on-chain → fiat; orakel daftar sanksi (pola pilot Jejak Dana, sudut AML) |
| Market Risk | Portfolio Management | Stress test portofolio nyata: skenario pasar → dampak limit & likuiditas |
| Risk Reporting | Business Intelligence | Dari data mentah ke dashboard regulator yang bisa dipertahankan di depan auditor |
| Statistika | Marketing Analytics | A/B test dibaca secara statistik yang jujur: power, peeking, segmentasi |
| Probabilitas | Portfolio Management | Simulasi Monte Carlo jalur portofolio: distribusi hasil, bukan titik estimasi |
| Python | Data Engineer | Pipeline analisis end-to-end yang tahan data kotor |
| SQL | Business Intelligence | Dari query mentah ke dashboard keputusan |
| Data Management | Data Engineer | Governance + lineage pada pipeline yang sudah jalan |
| Data Engineer | MLOps | Feature pipeline: dari sumber ke feature store yang termonitor |
| Database Administrator | Data Management | Migrasi + audit kualitas & performa basis data warisan |
| Business Intelligence | Marketing Analytics | Dashboard pertumbuhan yang tidak berbohong (definisi metrik konsisten) |
| Marketing Analytics | ML Engineer | Attribution bertemu model: kapan model ML benar-benar menambah nilai |
| Financial Markets | Portfolio Management | Rebalancing saat event pasar: keputusan di bawah tekanan waktu |
| Portfolio Management | Market Risk | Konstruksi portofolio dengan anggaran risiko eksplisit |
| Health Data Science | Bioinformatika | Surveilans genomik wabah: dari sekuens ke rekomendasi kebijakan kesehatan |
| Bioinformatika | Health Data Science | Translational: dari VCF/varian ke laporan yang dipakai program kesehatan masyarakat |
| Blockchain Data Scientist | Fraud/AML | Investigasi aliran dana lintas rantai dengan bukti yang bisa diserahkan ke compliance |
| ML Engineer | MLOps | Model dari notebook ke produksi yang termonitor drift-nya |
| Deep Learning Engineer | ML Engineer | Training skala besar: distribusi, kegagalan, dan biaya |
| MLOps | LLMOps | Serving LLM produksi: latensi, biaya, kualitas |
| LLMOps | AI Engineering | Evaluasi agen/LLM di produksi dengan data sintetis + judge |
| AI Engineering | Agentic AI | RAG yang naik kelas jadi agen: tool use dengan gerbang keamanan |
| Agentic AI | LLMOps | Observabilitas & biaya agen multi-langkah di produksi |
| WorldQuant Brain | ML Engineer | Pipeline riset alpha: predictor + batch + triase self-corr (snapshot data Brain Septian) |

## 4. Catatan kualitas (dari gerbang G1)

- Gerbang parent per gelombang Misi sama dengan lesson: tsc, harness lab, E2E browser (termasuk panel ringkasan langkah 1), responsive, verifikasi dataset & lisensi dari sumber primer.
- Klaim tim ≠ bukti: semua angka diverifikasi parent dari sumbernya sebelum lapor ke Septian (pelajaran klaim tsc wqb22–25 di G1).
- Deploy gelombang Misi hanya setelah ACC Septian per gelombang (aturan berdiri: kabari dulu sebelum deploy besar).
