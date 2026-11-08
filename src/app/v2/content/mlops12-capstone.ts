import type { V2Lesson } from "../lib/types";

// Arsitektur end-to-end DompetKu: aliran data -> keputusan -> monitoring -> retrain (loop).
const E2E_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Arsitektur end-to-end: dari sumber data hingga monitoring dan loop retrain.">
<defs><marker id="arr4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="8" y="30" width="86" height="46" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="51" y="49" fill="var(--text)" font-weight="600">sumber</text><text x="51" y="65" fill="var(--text-muted)" font-size="10">stream trx</text>
<rect x="108" y="30" width="86" height="46" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="151" y="49" fill="var(--text)" font-weight="600">validasi</text><text x="151" y="65" fill="var(--text-muted)" font-size="10">tolak rusak</text>
<rect x="208" y="30" width="86" height="46" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="251" y="49" fill="var(--text)" font-weight="600">fitur</text><text x="251" y="65" fill="var(--text-muted)" font-size="10">feature store</text>
<rect x="308" y="30" width="86" height="46" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="351" y="49" fill="var(--text)" font-weight="700">model</text><text x="351" y="65" fill="var(--text-muted)" font-size="10">registry+gate</text>
<rect x="408" y="30" width="64" height="46" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="440" y="49" fill="var(--text)" font-weight="700">serve</text><text x="440" y="65" fill="var(--text-muted)" font-size="10">API</text>
<rect x="208" y="120" width="86" height="46" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="251" y="139" fill="var(--text)" font-weight="600">monitor</text><text x="251" y="155" fill="var(--text-muted)" font-size="10">4 lapis</text>
<rect x="108" y="120" width="86" height="46" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="151" y="139" fill="var(--text)" font-weight="600">retrain</text><text x="151" y="155" fill="var(--text-muted)" font-size="10">berpemicu</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5">
<line x1="94" y1="53" x2="106" y2="53" marker-end="url(#arr4)"/>
<line x1="194" y1="53" x2="206" y2="53" marker-end="url(#arr4)"/>
<line x1="294" y1="53" x2="306" y2="53" marker-end="url(#arr4)"/>
<line x1="394" y1="53" x2="406" y2="53" marker-end="url(#arr4)"/>
<line x1="440" y1="76" x2="440" y2="110" marker-end="url(#arr4)"/>
<line x1="440" y1="110" x2="296" y2="110" marker-end="url(#arr4)"/>
<line x1="294" y1="143" x2="208" y2="143" marker-end="url(#arr4)"/>
<line x1="151" y1="120" x2="151" y2="78" marker-end="url(#arr4)"/>
<line x1="151" y1="143" x2="60" y2="143" marker-end="url(#arr4)"/>
<line x1="60" y1="143" x2="60" y2="78" marker-end="url(#arr4)"/>
</g>
<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">loop tertutup: monitoring → retrain berpemicu → validasi → ... (governance mengawasi semua)</text>
</svg>`;

const MLOPS12_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Sisa error budget Januari per minggu: 38,2 lalu 25,2 lalu 25,2 lalu 8,2 menit."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">20</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">43,2</text><rect x="65.9" y="38.5" width="64.8" height="141.5" rx="3" fill="var(--c1)"/><text x="98.2" y="32.5" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">38,2</text><text x="98.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">M1</text><rect x="170.4" y="86.7" width="64.8" height="93.3" rx="3" fill="var(--c1)"/><text x="202.8" y="80.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">25,2</text><text x="202.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">M2</text><rect x="274.9" y="86.7" width="64.8" height="93.3" rx="3" fill="var(--c2)"/><text x="307.2" y="80.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">25,2</text><text x="307.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">M3</text><rect x="379.4" y="149.6" width="64.8" height="30.4" rx="3" fill="var(--c4)"/><text x="411.8" y="143.6" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">8,2: BEKU</text><text x="411.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">M4</text><line x1="46" y1="20.0" x2="464" y2="20.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="14.0" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">budget 43,2 mnt</text></svg>`;

export const mlops12: V2Lesson = {
  slug: "mlops12-capstone",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps12 — Capstone: Pipeline MLOps End-to-End",
  estMinutes: 85,
  steps: [
    {
      id: "brief",
      eyebrow: "Langkah 1 · Cerita",
      title: "Brief: fraud scoring real-time untuk DompetKu",
      prose: [
        "E-wallet DompetKu: 5 juta transaksi/hari, fraud rate 0,08%, rata-rata kerugian Rp1,2 juta per kasus fraud. Direksi meminta sistem fraud scoring real-time: keputusan dalam < 300ms (p99), target menangkap ≥ 60% fraud dengan false positive < 0,5%. Budget infra Rp400 jt/bulan. Kamu ditunjuk sebagai MLOps lead.",
        "Tantangannya bukan akurasi — tim data sudah punya model precision 78%, recall 65%. Tantanganmu: merancang OPERASI-nya. Bagaimana data mengalir? Di mana gerbang kualitasnya? Apa yang dipantau? Kapan retrain? Bagaimana rollback? Siapa yang bertanggung jawab saat OJK bertanya?",
        "Di capstone ini kamu merakit seluruh track (MLOps1–11) menjadi satu rancangan, lalu menguji intinya lewat lab integrasi. Tidak ada jawaban tunggal yang benar — tapi ada rancangan yang bisa dipertahankan dengan angka, dan ada yang runtuh saat ditanya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang arsitektur MLOps end-to-end untuk fraud scoring real-time dari nol; (2) menghitung ekonomi keputusan rancangan (biaya vs risiko) seperti di mini-case DompetKu; (3) menetapkan error budget dan menggunakannya untuk memutuskan kapan boleh deploy; (4) menginterogasi rancangan sendiri dengan 5 pertanyaan tersulit sebelum presentasi ke direksi; (5) men-deploy model ke Kubernetes lokal (kind/minikube) dan memverifikasi kesiapannya sebelum naik ke managed prod.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Capstone = membangun model terbaik'",
        type: "pitfall",
        body: "Modelnya SUDAH ADA (precision 78%, recall 65%). Capstone MLOps menguji kemampuan OPERASI: pipeline, registry, gate, serving, monitoring, retrain, testing, governance, dan kapasitas. Nilai A diberikan untuk rancangan yang tahan interogasi, bukan AUC tertinggi.",
      },
      reference: "Capstone = operasi end-to-end. Model sudah ada; rancang hidupnya.",
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 2 · Arsitektur",
      title: "Rancangan referensi DompetKu",
      prose: [
        "Aliran rancangan: (1) Stream transaksi → validasi skema/rentang per batch mikro (MLOps9) → feature store: online (Redis, fitur 1 jam terakhir) + offline (warehouse, point-in-time benar — MLOps3). (2) Pipeline training terjadwal + berpemicu (MLOps2, MLOps8): validate → train → evaluate → registry (MLOps4) → gerbang kualitas (MLOps5). (3) Deploy via shadow 2 minggu → canary 5% → penuh; rollback 1-klik. (4) Serving: API online + autoscaling proaktif + buffer 30% (MLOps6). (5) Monitoring 4 lapis + alert berjenjang (MLOps7). (6) Governance: lineage hash-chain + model card + maker-checker + retensi 5 tahun (MLOps10). Training di spot K8s ber-checkpoint (MLOps11). Sebelum semua itu, deploy PERTAMA dilakukan di Kubernetes lokal (kind) — tempat rancangan diuji tanpa tagihan cloud (Langkah 4).",
        "Keputusan kunci rancangan: pola serving ONLINE (SLA 300ms menuntutnya — MLOps6), retrain TRIGGER-BASED (risiko tinggi + label 30 hari — MLOps8), promote SEMI-OTOMATIS (otomatis ke staging, manual ke production untuk versi minor; manual penuh untuk mayor — MLOps4/5).",
        "💡 Intuisi: rancangan yang baik seperti denah rumah yang bisa dijelaskan ke tukang: tiap ruangan (komponen) punya fungsi, aliran (data) jelas, dan ada pintu darurat (rollback) di setiap lantai. Jika denahmu butuh 30 menit menjelaskan, ia terlalu rumit.",
      ],
      figure: {
        svg: E2E_SVG,
        alt: "Arsitektur end-to-end: dari sumber data hingga monitoring dan loop retrain.",
        caption: "Loop tertutup DompetKu: sumber → validasi → fitur → model → serve → monitor → retrain berpemicu. Governance mengawasi semuanya. Cara membaca: ikuti panah searah jarum jam — tiap tahap mengumpani tahap berikut; panah kembali dari monitor ke retrain = loop tertutup. Interpretasi: sistem yang sehat bukan yang tidak pernah rusak, melainkan yang setiap kerusakan memicu perbaikan otomatis — loop inilah yang dirancang di capstone ini.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Merancang semua komponen 'penuh' tanpa prioritas. Dengan budget Rp400 jt/bulan dan tim terbatas, rancangan realistis bertahap: fase 1 = validasi + registry + monitoring dasar + rollback (fondasi tak bisa ditawar); fase 2 = feature store + canary; fase 3 = trigger-based retrain + lineage hash. Rancangan tanpa fase = fantasi.",
      },
      reference: "Bertahap: fondasi dulu (validasi, registry, monitor, rollback), baru kemewahan.",
    },
    {
      id: "lab-integrasi",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: rakit pipeline mini end-to-end",
      prose: [
        "Sekarang rakit intinya dalam satu skrip: VALIDATE (300 transaksi) → TRAIN (threshold = titik tengah rata-rata kedua kelas) → evaluasi holdout → REGISTRY (daftarkan v1) → GATE (≥ 0,75 auto, ≥ 0,65 review, else blokir) → MONITOR (PSI minggu-1 vs minggu-2).",
        "Tugasmu: lengkapi tiga fungsi — `valid` (semua fitur ≥ 0 & label boolean), `threshold`, dan `gate`. Fungsi PSI sudah disediakan (pelajaran MLOps7).",
        "Cara membaca: tiap baris [tahap] = vonis tahap itu. Interpretasi: rantai hanya sekuat tahap terlemahnya — jika [validate] GAGAL, semua tahap setelahnya tidak boleh jalan (fail fast). Di skrip ini mereka jalan berurutan; di produksi, GAGAL = berhenti + alert.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `valid`, `threshold`, dan `gate`" },
        { id: "t2", text: "Jalankan pipeline end-to-end" },
        { id: "t3", text: "Baca vonis tiap tahap; simpulkan status deploy" },
      ],
      expected: "LOLOS · threshold 5.92 · akurasi 84.0% · AUTO_DEPLOY · PSI 0.191 aman",
      note: {
        title: "💡 Intuisi: pipeline seperti ban berjalan sushi",
        body: "Tiap stasiun (tahap) memeriksa dan meneruskan — atau MEMBUANG yang busuk. Sushi busuk yang lolos satu stasiun meracuni semua stasiun berikutnya. Fail fast bukan kekejaman; ia kebaikan untuk seluruh ban berjalan.",
      },
      hints: [
        "valid = all(f >= 0 and lab in (True, False) for f, lab in data).",
        "threshold = (rata-rata fitur fraud + rata-rata fitur normal) / 2.",
        "gate = 'AUTO_DEPLOY' if akurat >= 0.75 else ('MANUAL_REVIEW' if akurat >= 0.65 else 'BLOCKED').",
      ],
      code: {
        starter: `import math, random\nrandom.seed(121)\n\nN = 300\ndata = []\nfor _ in range(N):\n    fraud = random.random() < 0.12\n    fitur = random.expovariate(1/9) if fraud else random.expovariate(1/2.5)\n    data.append((fitur, fraud))\n\n# 2. VALIDASI -- TULIS KODEMU\nvalid = \nprint(f"[validate] {N} baris -> {'LOLOS' if valid else 'GAGAL'}")\n\n# 3. TRAIN -- TULIS KODEMU: threshold = titik tengah rata-rata kedua kelas\nr_f = [f for f, lab in data if lab]\nr_o = [f for f, lab in data if not lab]\nthreshold = \n\ndef skor(f): return f >= threshold\n\nholdout = [(random.expovariate(1/9) if random.random() < 0.12 else random.expovariate(1/2.5),\n            None) for _ in range(100)]\nholdout = [(f, random.random() < (0.5 if f > threshold else 0.05)) for f, _ in holdout]\nakurat = sum(1 for f, lab in holdout if skor(f) == lab) / len(holdout)\nprint(f"[train] threshold={threshold:.2f} -> akurasi holdout {akurat:.1%}")\n\nprint(f"[registry] fraud-scorer v1 didaftarkan (akurasi={akurat:.3f})")\n\n# 5. GATE -- TULIS KODEMU\ngate = \nprint(f"[gate] keputusan: {gate}")\n\n# 6. MONITORING (disediakan dari MLOps7)\ndef psi(a, b, bins=10, eps=1e-4):\n    lo, hi = min(a+b), max(a+b)\n    w = (hi-lo)/bins\n    pa = [sum(1 for x in a if lo+i*w <= x < lo+(i+1)*w or (i==bins-1 and x==hi))/len(a) for i in range(bins)]\n    pb = [sum(1 for x in b if lo+i*w <= x < lo+(i+1)*w or (i==bins-1 and x==hi))/len(b) for i in range(bins)]\n    return sum((d-c)*math.log((d+eps)/(c+eps)) for c, d in zip(pa, pb))\n\nmg1 = [f for f, _ in data[:150]]\nmg2 = [f * random.uniform(1.3, 1.7) for f, _ in data[150:]]\nnilai_psi = psi(mg1, mg2)\nprint(f"[monitor] PSI fitur = {nilai_psi:.3f} -> {'ALERT: jadwalkan investigasi' if nilai_psi > 0.25 else 'aman'}")\nprint(f"[deploy] status akhir: {gate} + monitoring aktif")`,
        lockLines: 12,
        solution: `import math, random\nrandom.seed(121)\n\nN = 300\ndata = []\nfor _ in range(N):\n    fraud = random.random() < 0.12\n    fitur = random.expovariate(1/9) if fraud else random.expovariate(1/2.5)\n    data.append((fitur, fraud))\n\n# 2. VALIDASI -- TULIS KODEMU\nvalid = all(f >= 0 and lab in (True, False) for f, lab in data)\nprint(f"[validate] {N} baris -> {'LOLOS' if valid else 'GAGAL'}")\n\n# 3. TRAIN -- TULIS KODEMU: threshold = titik tengah rata-rata kedua kelas\nr_f = [f for f, lab in data if lab]\nr_o = [f for f, lab in data if not lab]\nthreshold = (sum(r_f)/len(r_f) + sum(r_o)/len(r_o)) / 2\n\ndef skor(f): return f >= threshold\n\nholdout = [(random.expovariate(1/9) if random.random() < 0.12 else random.expovariate(1/2.5),\n            None) for _ in range(100)]\nholdout = [(f, random.random() < (0.5 if f > threshold else 0.05)) for f, _ in holdout]\nakurat = sum(1 for f, lab in holdout if skor(f) == lab) / len(holdout)\nprint(f"[train] threshold={threshold:.2f} -> akurasi holdout {akurat:.1%}")\n\nprint(f"[registry] fraud-scorer v1 didaftarkan (akurasi={akurat:.3f})")\n\n# 5. GATE -- TULIS KODEMU\ngate = "AUTO_DEPLOY" if akurat >= 0.75 else ("MANUAL_REVIEW" if akurat >= 0.65 else "BLOCKED")\nprint(f"[gate] keputusan: {gate}")\n\n# 6. MONITORING (disediakan dari MLOps7)\ndef psi(a, b, bins=10, eps=1e-4):\n    lo, hi = min(a+b), max(a+b)\n    w = (hi-lo)/bins\n    pa = [sum(1 for x in a if lo+i*w <= x < lo+(i+1)*w or (i==bins-1 and x==hi))/len(a) for i in range(bins)]\n    pb = [sum(1 for x in b if lo+i*w <= x < lo+(i+1)*w or (i==bins-1 and x==hi))/len(b) for i in range(bins)]\n    return sum((d-c)*math.log((d+eps)/(c+eps)) for c, d in zip(pa, pb))\n\nmg1 = [f for f, _ in data[:150]]\nmg2 = [f * random.uniform(1.3, 1.7) for f, _ in data[150:]]\nnilai_psi = psi(mg1, mg2)\nprint(f"[monitor] PSI fitur = {nilai_psi:.3f} -> {'ALERT: jadwalkan investigasi' if nilai_psi > 0.25 else 'aman'}")\nprint(f"[deploy] status akhir: {gate} + monitoring aktif")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "\\[validate\\] 300 baris -> LOLOS", label: "Validasi LOLOS", msg: "300 baris lolos kontrak data." },
          { kind: "stdout_matches", task: "t3", pattern: "\\[train\\] threshold=5\\.92 -> akurasi holdout 84\\.0%", label: "Train 84.0%", msg: "Threshold 5.92 memberi akurasi holdout 84.0%." },
          { kind: "stdout_matches", task: "t3", pattern: "\\[gate\\] keputusan: AUTO_DEPLOY", label: "AUTO_DEPLOY", msg: "84.0% >= 0.75 -> AUTO_DEPLOY." },
          { kind: "stdout_matches", task: "t3", pattern: "\\[monitor\\] PSI fitur = 0\\.191 -> aman", label: "Monitor aman", msg: "PSI 0.191 < 0.25 -> aman (zona waspada, pantau tren)." },
        ],
      },
      reference: "Rantai terlemah menentukan. GAGAL di satu tahap = berhenti + alert.",
    },
    {
      id: "k8s-lokal",
      eyebrow: "Langkah 4 · Deploy lokal",
      title: "Deploy ke Kubernetes lokal (kind): latihan tanpa tagihan cloud",
      prose: [
        "Rancangan di Langkah 2 menyebut 'deploy via shadow → canary → penuh' — tetapi di mana deploy PERTAMA itu diuji? Jawabannya: di Kubernetes lokal di laptopmu, dengan kind (Kubernetes in Docker) atau minikube. Klaster lokal adalah tempat rancangan DompetKu dibuktikan sebelum satu rupiah cloud dibelanjakan: manifest ditulis, di-apply, diuji, di-rollback — semuanya gratis dan bisa diulang 20 kali sehari. Konsep K8s-nya (pod, Deployment, Service, HPA, readiness probe) diajarkan di MLOps11; langkah ini adalah latihan tangannya untuk capstone.",
        "Alur hands-on (jalankan di laptopmu): (1) kind create cluster --name dompetku — satu klaster satu node di dalam Docker. (2) Bangun image model: docker build -t fraud-scorer:v1.4.2 . — tag versi eksplisit, JANGAN :latest (yang tidak bisa di-rollback dengan pasti). (3) kind load docker-image fraud-scorer:v1.4.2 --name dompetku — image masuk ke klaster lokal. (4) kubectl apply -f k8s/ — Deployment (2 replika) + Service + HPA (min 2, max 6, target CPU 70 persen). (5) kubectl get pods -w — tunggu status Running DAN ready 2/2 (readiness probe yang menentukan, bukan sekadar 'jalan'). (6) kubectl port-forward svc/fraud-scorer 8080:80 — lalu curl POST ke localhost:8080/predict dan pastikan response memuat model_version. (7) Uji rollback: kubectl rollout undo deployment/fraud-scorer — lalu verifikasi versi kembali. (8) Uji HPA: beri beban sintetis, amati replika naik dari 2 ke arah 6.",
        "Empat syarat kesiapan sebelum manifest boleh naik ke managed prod — lab berikut memeriksanya dari manifest yang sama: (a) image ter-pin ke tag versi (bukan :latest); (b) readiness probe ada (pod 'jalan' belum tentu 'siap melayani'); (c) resource limits dipasang dan tidak di bawah requests (tanpa limit, satu pod rakus bisa mematikan tetangganya — noisy neighbor); (d) replika minimal 2 (satu replika = satu titik kegagalan; update tanpa downtime butuh minimal 2). Manifest lab: image fraud-scorer:v1.4.2, 2 replika, CPU request 500m limit 1000m, memori request 512Mi limit 1024Mi, readiness probe ada, HPA 2 sampai 6. Total request: 1.000m CPU (1 CPU) dan 1.024Mi memori — angka ini yang dibandingkan dengan kapasitas node kind-mu (default 2 CPU: cukup, dengan headroom 1 CPU).",
        "Batas yang harus dinyatakan eksplisit: kind/minikube adalah lingkungan LATIHAN dan CI lokal — BUKAN pengganti managed prod. Keputusan 4 di Langkah 5 (managed endpoint, K8s self-managed ditolak karena tidak ada operator) TETAP berlaku untuk produksi DompetKu. Yang dipindahkan ke lokal hanyalah tempat BELAJAR dan MENGUJI: manifest yang lolos 4 syarat di kind adalah manifest yang sama yang di-apply ke managed prod — hanya target klasternya yang berbeda. Inilah gunanya latihan lokal: kesalahan manifest ditemukan di laptop (gratis, 5 menit) bukan di prod (Rp57,6 juta, 2 bulan — lihat mini-case).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cpu_req_m` dan `mem_req_mi` total (replika × request per pod)" },
        { id: "t2", text: "Periksa 4 syarat kesiapan dan hitung `siap_n` (jumlah syarat lolos)" },
        { id: "t3", text: "Tentukan `verdict` ('SIAP_DEPLOY' bila 4/4) dan cetak semuanya" },
      ],
      expected: "cpu_req=1000m  mem_req=1024Mi  siap=4/4  verdict=SIAP_DEPLOY",
      note: {
        title: "🚨 Mitos: 'deploy lokal = deploy beneran, tinggal pindah klaster'",
        type: "pitfall",
        body: "Yang benar: kind membuktikan MANIFEST-mu benar (image, probe, limit, replika). Ia tidak membuktikan kapasitas prod, keamanan jaringan, atau ketahanan terhadap trafik nyata. Lolos kind = 'boleh lanjut ke staging managed', bukan 'boleh langsung ke prod'. Tangga deploy tetap berlaku.",
      },
      hints: [
        "Total request = replicas × request per pod.",
        "Image ter-pin: ':latest' tidak ada di nama image. Limit: limit >= request untuk CPU dan memori.",
        "verdict = 'SIAP_DEPLOY' jika siap_n == 4, else 'BELUM_SIAP'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
manifest = {
    "image": "registry.internal/fraud-scorer:v1.4.2",
    "replicas": 2,
    "cpu_request_m": 500, "cpu_limit_m": 1000,
    "mem_request_mi": 512, "mem_limit_mi": 1024,
    "readiness_probe": True,
    "hpa": {"min": 2, "max": 6, "target_cpu_pct": 70},
}
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: total request + 4 syarat kesiapan
cpu_req_m = 
mem_req_mi = 
cek = {
    "image_terpin": ,
    "probe_ada": ,
    "limit_ok": ,
    "replika_ok": ,
}
siap_n = 
verdict = 

print(f"cpu_req={cpu_req_m}m  mem_req={mem_req_mi}Mi  siap={siap_n}/4  verdict={verdict}")`,
        lockLines: 10,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
manifest = {
    "image": "registry.internal/fraud-scorer:v1.4.2",
    "replicas": 2,
    "cpu_request_m": 500, "cpu_limit_m": 1000,
    "mem_request_mi": 512, "mem_limit_mi": 1024,
    "readiness_probe": True,
    "hpa": {"min": 2, "max": 6, "target_cpu_pct": 70},
}
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: total request + 4 syarat kesiapan
cpu_req_m = manifest["replicas"] * manifest["cpu_request_m"]
mem_req_mi = manifest["replicas"] * manifest["mem_request_mi"]
cek = {
    "image_terpin": ":latest" not in manifest["image"],
    "probe_ada": manifest["readiness_probe"],
    "limit_ok": manifest["cpu_limit_m"] >= manifest["cpu_request_m"] and manifest["mem_limit_mi"] >= manifest["mem_request_mi"],
    "replika_ok": manifest["replicas"] >= 2,
}
siap_n = sum(1 for ok in cek.values() if ok)
verdict = "SIAP_DEPLOY" if siap_n == 4 else "BELUM_SIAP"

print(f"cpu_req={cpu_req_m}m  mem_req={mem_req_mi}Mi  siap={siap_n}/4  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`cpu_req_m` = 1000",
            "name": "cpu_req_m",
            "value": 1000,
            "tol": 1e-09,
            "msg": "2 replika x 500m = 1000m = 1 CPU.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`mem_req_mi` = 1024",
            "name": "mem_req_mi",
            "value": 1024,
            "tol": 1e-09,
            "msg": "2 replika x 512Mi = 1024Mi.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`siap_n` = 4",
            "name": "siap_n",
            "value": 4,
            "tol": 1e-09,
            "msg": "Keempat syarat lolos: image ter-pin, probe ada, limit OK, replika 2.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis SIAP_DEPLOY",
            "pattern": "verdict=SIAP_DEPLOY",
            "msg": "4/4 syarat → boleh lanjut ke staging managed.",
          },
        ],
      },
      reference: "kind/minikube = latihan + CI lokal (MLOps11). 4 syarat: image ter-pin, readiness probe, limit >= request, replika >= 2. Prod tetap managed.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Lima keputusan rancangan tersulit",
      prose: [
        "**Keputusan 1 — Batch vs online.** SLA 300ms p99 → ONLINE, tanpa debat. Tapi: fallback saat API down? Rancangan: antre + skor batch 15-menit sebagai degradasi anggun (graceful degradation), bukan menolak transaksi.",
        "**Keputusan 2 — Otomatis vs manual promote.** Risiko finansial tinggi → semi-otomatis: staging otomatis, production manual untuk minor; mayor selalu manual + shadow + canary. Kecepatan tanpa kecerobohan.",
        "**Keputusan 3 — Scheduled vs trigger retrain.** Label 30 hari + pola serangan dinamis → TRIGGER-BASED (PSI, akurasi, konfirmasi serangan) dengan embargo 30 hari. Scheduled bulanan = racun terjadwal (MLOps8).",
        "**Keputusan 4 — Build vs buy infra.** Budget Rp400 jt/bulan, tim 6 orang tanpa operator K8s → MANAGED (cloud endpoint + managed orchestrator). K8s self-managed ditolak: tidak ada operator (MLOps11).",
        "**Keputusan 5 — Berapa banyak monitoring?** Empat lapis penuh — non-negotiable untuk risiko finansial. Tapi alert berjenjang ketat: page hanya untuk 'uang hilang sekarang'; sisanya tiket/log. Tanpa ini, tim tenggelam dalam alert (MLOps7).",
        "Aturan praktis 10 detik: tiap keputusan rancangan harus bisa dijawab dengan 'karena [angka/risiko], bukan [kebiasaan/hype]'. 'Karena semua orang pakai K8s' = jawaban yang gagal.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: rancangan = serangkaian taruhan",
        body: "Tiap keputusan adalah taruhan dengan peluang dan harga. Taruhan bagus = peluang menang tinggi ATAU harga kalah murah. 'Online serving' = taruhan mahal tapi perlu (SLA menuntut). 'K8s self-managed tanpa operator' = taruhan dengan harga kalah raksasa. Rancang seperti penjudi profesional: hitung, bukan berharap.",
      },
      reference: "Tiap keputusan: 'karena [angka/risiko]'. Tanpa itu = hype.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Matematika bisnis DompetKu",
      prose: [
        "Angka dasar: 5.000.000 transaksi/hari × 0,08% fraud = 4.000 kasus fraud/hari × Rp1,2 jt = Rp4,8 M potensi rugi/hari. Model (recall 65%): menangkap 2.600 kasus → menyelamatkan Rp3,12 M/hari. False positive 0,5% × 5 jt = 25.000 review/hari × Rp25.000 biaya review = Rp625 jt/hari. Net: Rp3,12 M − Rp625 jt = Rp2,5 M/hari ≈ Rp75 M/bulan.",
        "Biaya operasi (rancangan): serving managed Rp180 jt + feature store Rp60 jt + monitoring Rp25 jt + training spot Rp40 jt + tim 6 orang (dialokasi 50%) Rp180 jt ≈ Rp485 jt/bulan — MELEBIHI budget Rp400 jt. Opsi: (a) micro-batch 5-menit untuk 30% trafik berisiko rendah (hemat Rp70 jt), (b) kurangi review manual dengan auto-approve skor rendah (hemat Rp50 jt), (c) minta budget naik dengan ROI 155x.",
        "**Pertanyaan:** (1) Jika drift menurunkan recall ke 45% selama 2 bulan tanpa terdeteksi, berapa kerugian? (2) Opsi penghematan mana yang TIDAK mengorbankan keamanan? (3) Argumen ROI untuk opsi (c)?",
        "**Pembahasan:** (1) Kehilangan (65%−45%) × 4.000 × Rp1,2 jt = Rp960 jt/hari × 60 = Rp57,6 M — inilah harga 'monitoring ditunda'. (2) Opsi (a): segmentasi risiko — trafik rendah tetap dapat skor cepat yang cukup; keamanan fokus di trafik berisiko. Opsi (b) berisiko menaikkan false negative. (3) Net Rp75 M/bulan vs biaya Rp485 jt = ROI 155x; meminta Rp85 jt tambahan untuk melindungi Rp75 M adalah argumen yang menang di ruang direksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah bahasa direksi: bukan AUC, melainkan rupiah, ROI, dan skenario kerugian. MLOps lead yang hanya bicara metrik teknis kalah dari yang bicara dampak bisnis. Setiap komponen operasi harus bisa dipertahankan dengan angka seperti di atas.",
      },
      reference: "Rp75 M/bulan net. Drift 2 bulan tak terdeteksi = Rp57,6 M hilang.",
    },
    {
      id: "review",
      eyebrow: "Langkah 7 · Review rancangan",
      title: "Interogasi rancanganmu",
      prose: [
        "Sebelum rancangan dinyatakan selesai, ia harus lolos interogasi — pertanyaan yang akan ditanyakan insiden, auditor, atau direksi:",
        "1. 'Bagaimana rollback dalam 5 menit?' → Registry + promote 1-klik (MLOps4). Jika jawabanmu 'cari file backup', rancanganmu gagal.",
        "2. 'Bagaimana kamu tahu model masih sehat kemarin?' → Monitoring 4 lapis + runbook (MLOps7). Jika 'lihat dashboard uptime', gagal.",
        "3. 'Data training versi deploy terakhir apa?' → Lineage + hash snapshot (MLOps10). Jika 'kayaknya bulan lalu', gagal.",
        "4. 'Apa yang terjadi saat traffic 6x lipat?' → Capacity plan + autoscaling proaktif + load test (MLOps6). Jika 'semoga cukup', gagal.",
        "5. 'Kapan terakhir retrain dan kenapa?' → Kebijakan trigger + embargo tercatat (MLOps8). Jika 'tiap bulan pokoknya', gagal.",
        "Lima jawaban konkret = rancangan dewasa. Tiga atau kurang = kembali ke lesson yang bolong. Inilah beda 'pernah baca MLOps' dengan 'bisa mengoperasikan ML'.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Rancangan bagus = dokumen tebal'",
        type: "pitfall",
        body: "Dokumen 100 halaman yang tidak bisa menjawab 5 pertanyaan di atas = dekorasi. Rancangan dinilai dari JAWABAN OPERASIONAL-nya, bukan ketebalannya. Satu halaman dengan 5 jawaban konkret mengalahkan 100 halaman teori.",
      },
      reference: "5 pertanyaan interogasi = ujian kelulusan track ini.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Error budget: kapan boleh ngebut, kapan harus ngerem",
      prose: [
        "DompetKu menetapkan SLO: fraud scoring tersedia 99,9% per bulan. Error budget = 1 − 0,999 = 0,1% × 30 hari × 24 jam = 43,2 menit downtime yang `diizinkan` per bulan. Budget ini adalah MATA UANG keputusan: setiap deploy canary yang gagal membakar ~5 menit; setiap insiden kecil membakar 10–15 menit. Selama budget tersisa > 50%, tim boleh deploy agresif (2x seminggu). Saat tersisa < 20%, deploy non-kritis DIBEKUKAN sampai budget pulih bulan depan.",
        "Contoh perjalanan budget Januari: awal 43,2 menit. Minggu 1: canary gagal 1x → −5 menit (38,2). Minggu 2: insiden config → −12 menit (26,2). Minggu 3: deploy sukses 2x → −1 menit (25,2). Minggu 4: tim ingin deploy fitur `baru` (nice-to-have) — budget tersisa 25,2 menit (58%) → BOLEH, tapi canary diperpanjang 2x lipat sebagai kompensasi risiko. Jika minggu 2 insidennya 30 menit (tersisa 8,2 = 19%) → fitur nice-to-have DITUNDA ke Februari, hanya hotfix kritis yang boleh jalan. Keputusan yang tadinya `feeling` menjadi aritmetika.",
        "Kenapa ini penting untuk capstone-mu? Karena tanpa error budget, setiap diskusi deploy menjadi perang opini: engineer `yakin aman` vs risk `jangan dulu`. Dengan budget, diskusinya: `sisa 19%, aturan bilang bekukan` — tidak ada yang perlu yakin atau takut, angkanya yang bicara. Error budget mengubah politik deploy menjadi akuntansi. Dan akuntansi bisa diaudit (MLOps10).",
        "Hubungkan ke semua lesson: SLO 99,9% butuh monitoring 4 lapis (MLOps1, 7) untuk tahu kapan budget terbakar; butuh rollback 5 menit (MLOps4) agar tiap insiden membakar SEDIKIT budget; butuh gerbang CI (MLOps5) agar deploy jarang gagal; butuh canary (MLOps5) agar kegagalan terdeteksi di 5% traffic. Error budget adalah BENANG MERAH yang mengikat 11 lesson sebelumnya menjadi satu sistem. Capstone yang baik menyebutkannya eksplisit.",
        "Contoh kegagalan tanpa budget: tim deploy 3x seminggu selama 2 bulan `karena semua hijau di CI`. Downtime terakumulasi: 12 menit + 8 + 20 + 5 + 15 = 60 menit — melebihi budget 43,2 menit TANPA ADA YANG SADAR, karena tidak ada yang menjumlahkan. Bulan ketiga, insiden besar 25 menit → total 85 menit = SLO jebol 2x lipat = penalti kontrak Rp500 juta. Dengan budget, deploy ke-4 di bulan kedua sudah akan dibekukan (`sisa 8%`), dan insiden besar `hanya` membakar budget — bukan kontrak.",
        "Cara menetapkan SLO yang benar (bukan asal 99,9%): tanya bisnis `berapa downtime yang masih bisa diterima?`. Jika jawabannya `1 jam per bulan masih oke` → SLO = 1 − 1/720 ≈ 99,86%. Jika `tidak boleh down saat jam transaksi` → SLO 99,95% + scheduled scaling. SLO yang ditetapkan tanpa bertanya ke bisnis = angka hiasan. Dan ingat: SLO 100% = error budget NOL = tidak boleh deploy SAMA SEKALI — mustahil dan tidak diinginkan. Budget nol = organisasi beku.",
        "Untuk presentasi capstone-mu: tunjukkan tabel budget 3 bulan proyeksi (deploy plan × estimasi burn per deploy + buffer insiden historis). Direksi tidak perlu paham canary — mereka paham `risiko deploy bulan ini RpX dengan sisa budget Y`. Itulah bahasa yang membuat rancanganmu DISETUJUI: bukan kecanggihan teknis, melainkan kejelasan risikonya.",
      ],
      formula: String.raw`B_{sisa} = (1 - SLO) \times T - \sum burn_i`,
      formulaNote: "B_sisa = error budget tersisa; SLO = target availability (mis. 0,999); T = periode (43.200 menit/bulan); burn_i = menit downtime insiden/deploy gagal ke-i. Aturan: sisa > 50% = deploy bebas; 20–50% = hati-hati; < 20% = bekukan non-kritis.",
      figure: {
        svg: MLOPS12_DEEP_SVG,
        alt: "Diagram batang sisa error budget per minggu: turun dari 38,2 ke 8,2 menit hingga menyentuh zona bekukan.",
        caption: "Cara membaca: tinggi batang = sisa error budget (menit) tiap minggu; garis = budget awal 43,2 menit; warna merah = zona bekukan (< 20%). Interpretasi: minggu 4 tersisa 8,2 menit (19%) → deploy nice-to-have DIBEKUKAN otomatis oleh aturan, bukan oleh opini. Inilah gunanya budget: keputusan sulit menjadi aritmetika.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: error budget mengubah politik menjadi akuntansi",
        body: "`Boleh deploy tidak?` tanpa budget = perang opini yang dimenangkan yang paling vokal. Dengan budget = lihat angka sisa. Tim yang kehabisan budget bukan tim yang buruk — mereka tim yang jujur mencatat. Yang buruk adalah tim yang tidak tahu berapa sisanya.",
      },
      reference: "Tetapkan SLO dari kebutuhan bisnis, bukan angka hiasan. Proyeksikan burn 3 bulan di presentasi capstone.",
    },
    {
      id: "runbook-rollback",
      eyebrow: "Langkah 9 · Operasi pasca-rilis",
      title: "Runbook & rollback: bersiap sebelum insiden",
      prose: [
        "Pukul 02:17, ponsel Rudi bergetar: latensi p99 fraud scoring menembus 900ms — tiga kali lipat ambang. Rudi baru tiga bulan di tim, dan ini on-call pertamanya. Ia membuka runbook berjudul 'latensi tinggi': 27 halaman. Halaman 4 masih membahas sejarah arsitektur. Sementara ia scroll, tiap menit 3.472 transaksi lewat tanpa skor, dan fraud berjalan tanpa penilaian. Runbook itu tidak menyelamatkannya — bukan karena Rudi bodoh, melainkan karena runbook yang tidak bisa dibaca saat panik sama dengan tidak ada runbook.",
        "Runbook yang berguna punya anatomi tetap: gejala → cek pertama → tindakan → eskalasi. Satu halaman per gejala, bukan satu dokumen per sistem. Cek pertama harus SATU perintah atau SATU query — bukan 'analisis log secara menyeluruh'. Contoh entri yang benar: 'Gejala: latensi p99 > 500ms selama 5 menit | Cek 1: panjang antrean autoscaler (satu query) | Tindakan: naikkan replica manual ×2, failover ke endpoint cadangan bila tak turun dalam 3 menit | Eskalasi: > 10 menit tanpa perbaikan → panggil incident commander, nyalakan status page'. Ditulis saat tenang — idealnya sesaat setelah insiden atau drill — dan dipakai saat panik.",
        "Rollback adalah keputusan, bukan kepanikan — dan ia harus sudah diputuskan SEBELUM insiden. Kriteria kuantitatif DompetKu: rollback bila (a) deploy berumur < 2 jam dan metrik memburuk > 2× baseline; (b) proyeksi burn insiden > 15 menit error budget; (c) jalur rollback sudah teruji kuartal ini. Perbaiki di tempat bila akar masalah diketahui, blast radius kecil, dan rollback justru berbahaya — contoh klasik: migrasi skema feature store; model lama mungkin tidak kompatibel dengan format fitur baru, sehingga rollback malah menambah insiden kedua. Aturan tajam tim: jangan debug di produksi lebih dari 15 menit tanpa kemajuan — rollback dulu, debug belakangan.",
        "💡 Intuisi: runbook itu seperti latihan kebakaran — nilainya bukan pada dokumennya, melainkan pada refleksnya. Gedung yang selamat bukan yang punya manual APAR paling tebal, tapi yang penghuninya pernah lari menuruni tangga. Karena itu rollback WAJIB dilatih berkala (game day): ukur waktu dari deteksi hingga pulih, targetkan < 5 menit untuk fraud scoring. Rollback yang belum pernah dilatih adalah rencana fiksi — ia hanya terlihat meyakinkan di slide.",
        "Komunikasi insiden adalah setengah dari penanganan insiden. Nyatakan insiden secara eksplisit ('kami nyatakan insiden latensi P1'), bukan 'kayaknya ada yang aneh'. Tunjuk satu incident commander — satu suara, bukan rapat. Satu kanal komunikasi, update berkala tiap 15 menit: status saat ini, dampak yang diketahui, ETA berikutnya. Dan prinsip yang menyelamatkan nyawa sistem: hentikan pendarahan dulu, tulis laporan belakangan. Status page untuk pengguna internal: jujur, tanpa jargon, tanpa 'sedang kami investigasi' yang diulang 6 jam.",
        "Setelah langkah ini, rancangan DompetKu punya pintu darurat (runbook), tombol merah (rollback), dan disiplin komunikasi. Langkah berikutnya melengkapi dengan buku hariannya: postmortem yang membuat setiap kegagalan membayar dirinya sendiri lewat pelajaran.",
      ],
      tasks: [
        { id: "t1", text: "Tulis satu entri runbook satu halaman untuk gejala 'akurasi turun 10 poin dalam 1 jam pasca-deploy' (gejala → cek pertama → tindakan → eskalasi)" },
        { id: "t2", text: "Tetapkan 2 kriteria kuantitatif: kapan rollback vs kapan perbaiki di tempat (pakai angka: menit, kelipatan baseline, % budget)" },
        { id: "t3", text: "Rancang drill rollback kuartalan: skenario, siapa yang terlibat, target waktu deteksi → pulih" },
      ],
      note: {
        title: "🚨 Mitos: 'runbook = dokumen panjang yang dibaca saat insiden'",
        type: "pitfall",
        body: "Yang benar: runbook dibaca dalam 30 detik pertama, dalam keadaan panik, oleh orang yang mungkin baru pertama kali on-call. Kalau butuh 20 halaman penjelasan untuk bertindak, itu bukan runbook — itu arsip. Runbook = checklist 1–2 halaman per gejala; dokumentasi panjang boleh ada, tapi pintu masuknya harus satu halaman.",
      },
      reference: "Runbook: gejala → cek pertama → tindakan → eskalasi, satu halaman per gejala. Rollback = tombol yang sudah dilatih, bukan harapan.",
    },
    {
      id: "postmortem-slo",
      eyebrow: "Langkah 10 · Operasi pasca-rilis",
      title: "Postmortem & SLO untuk model",
      prose: [
        "Insiden autoscaler kemarin membakar 12 menit error budget. Di rapat minggu ini seseorang bertanya: 'Siapa yang salah konfigurasi?' — dan rapat berjalan 40 menit membahas orangnya. Dua bulan lalu, orang yang sama membuat kesalahan serupa. Bulan depan ia akan mengulanginya lagi — bukan karena ia ceroboh, melainkan karena tidak ada yang berubah di SISTEM. Postmortem yang mencari kambing hitam menghasilkan tepat satu hal: tim yang takut melaporkan kesalahan berikutnya.",
        "Postmortem blameless punya anatomi tetap: garis waktu faktual (kapan terdeteksi, apa yang dilakukan, kapan pulih), 'lima mengapa' yang ditujukan ke SISTEM — kenapa config salah bisa lolos? Karena tidak ada validasi pra-deploy. Kenapa tidak ada validasi? Karena action item postmortem lalu belum dikerjakan. Kenapa belum dikerjakan? ... — dan action item yang berpemilik, bertenggat, dan terverifikasi ('tambah validasi config di CI, pemilik: Dina, tenggat: 2 minggu, verifikasi: drill deploy config salah'). Yang dilarang keras: nama orang sebagai 'akar penyebab'. Postmortem dipublikasikan ke seluruh tim dan dibaca ulang tiap kuartal.",
        "SLO untuk layanan model punya tiga lapis — dan dua di antaranya belum dibahas di Langkah 8. Lapis 1, availability: endpoint menjawab (inilah yang dihitung error budget 43,2 menit di sana). Lapis 2, latency: p99 < 300ms — insiden 'latensi p99 > 500ms' selama 18 menit di lab ini membakar budget walau endpoint 'up'. Lapis 3, kualitas: metrik model di atas ambang — mis. PSI fitur < 0,25, selisih prediksi online vs offline < 1%, akurasi label matang ≥ 70%. Tiap lapis adalah SLI terukur dengan ambang; burn dihitung dari ketiganya. Model yang 'up' tapi memprediksi ngawur adalah downtime yang tidak tercatat — kecuali kamu mengukurnya.",
        "💡 Intuisi: error budget itu seperti uang saku tim — boleh dihabiskan untuk hal berani seperti deploy dua kali seminggu, tapi kalau habis, bulan ini hidup hemat: rilis non-kritis dibekukan. Postmortem adalah struk belanjanya: tanpa struk, kamu tidak tahu uangmu habis untuk apa. Tim yang membakar budget tanpa postmortem = menghabiskan uang tanpa pernah membuka dompet.",
        "Kedalaman postmortem harus sebanding dengan burn-nya — ini aturan yang membuat postmortem tidak menjadi birokrasi. Burn < 5 menit: catatan insiden 5 baris. Burn 5–20 menit: postmortem tertulis 1 halaman. Burn > 20 menit: postmortem penuh + presentasi + action item diaudit. Terapkan ke data lab: 'model salah serving' membakar 35 menit → postmortem penuh. 'Canary gagal' 5 menit → cukup catatan. Aturan proporsional ini menjaga postmortem tetap tajam: yang besar dibedah habis, yang kecil tidak tenggelam dalam rapat.",
        "Dengan runbook, rollback terlatih, postmortem blameless, dan SLO tiga lapis, capstone DompetKu selesai: sistem yang tidak hanya berjalan, tapi belajar dari setiap kegagalannya. Uji pemahamanmu di checkpoint — lalu bawa rancangan ini ke ruang direksi dengan angka, bukan harapan.",
      ],
      formula: String.raw`B_{sisa} = (1 - SLO) \times T - \sum burn_i`,
      formulaNote: "B_sisa = budget tersisa (menit); SLO = 0,995 di lab ini; T = 30 × 1.440 = 43.200 menit; burn_i = durasi tiap insiden. Status: sisa > 50% = aman, 20–50% = waspada, < 20% = habis (bekukan rilis non-kritis).",
      tasks: [
        { id: "t1", text: "Implementasikan perhitungan budget_total, total_burn, sisa, persen_sisa, dan status" },
        { id: "t2", text: "Jalankan lab; tentukan status budget dan kedalaman postmortem untuk insiden terbesar" },
        { id: "t3", text: "Dengan sisa 67,6%, bolehkah deploy fitur nice-to-have Jumat sore? Jawab dengan aturan Langkah 8" },
      ],
      expected: "budget_total=216 menit · total_burn=70 menit · sisa=146 menit (67,6%) → aman · pembakar terbesar: model (35 menit) → postmortem penuh",
      note: {
        title: "🚨 Mitos: 'postmortem = mencari siapa yang salah'",
        type: "pitfall",
        body: "Yang benar: postmortem mencari kondisi SISTEM yang memungkinkan kesalahan itu terjadi — lalu memperbaikinya. Pertanyaan terlarang: 'siapa yang salah konfigurasi?' Pertanyaan wajib: 'kenapa config yang salah bisa lolos ke produksi, dan apa yang kita ubah agar berikutnya tidak lolos?' Tim yang disalahkan belajar satu hal: sembunyikan kesalahan berikutnya. Blameless bukan berarti tanpa akuntabilitas — akuntabilitasnya hidup di action item: berpemilik, bertenggat, terverifikasi.",
      },
      hints: [
        "budget_total = (1 - SLO) * (HARI * MENIT_PER_HARI).",
        "total_burn = jumlah semua durasi insiden.",
        "status: 'aman' bila persen_sisa > 50, 'waspada' bila >= 20, selain itu 'habis'.",
      ],
      code: {
        starter: `# --- BLOK TERKUNCI: data insiden bulan ini (jangan ubah) ---
SLO = 0.995            # target availability layanan fraud scoring
HARI = 30
MENIT_PER_HARI = 1440

# (nama insiden, durasi menit, kategori)
insiden = [
    ("Canary deploy v6.2 gagal", 5, "deploy"),
    ("Salah konfigurasi autoscaler", 12, "config"),
    ("Latensi p99 > 500ms", 18, "latensi"),
    ("Model v6.1 salah serving 5% trafik", 35, "model"),
]

# --- TULIS KODEMU: hitung budget, burn, sisa, dan status ---
budget_total = `,
        lockLines: 14,
        solution: `# --- BLOK TERKUNCI: data insiden bulan ini (jangan ubah) ---
SLO = 0.995            # target availability layanan fraud scoring
HARI = 30
MENIT_PER_HARI = 1440

# (nama insiden, durasi menit, kategori)
insiden = [
    ("Canary deploy v6.2 gagal", 5, "deploy"),
    ("Salah konfigurasi autoscaler", 12, "config"),
    ("Latensi p99 > 500ms", 18, "latensi"),
    ("Model v6.1 salah serving 5% trafik", 35, "model"),
]

# --- TULIS KODEMU: hitung budget, burn, sisa, dan status ---
T = HARI * MENIT_PER_HARI
budget_total = (1 - SLO) * T
total_burn = sum(d for _, d, _ in insiden)
sisa = budget_total - total_burn
persen_sisa = sisa / budget_total * 100

if persen_sisa > 50:
    status = "aman"
elif persen_sisa >= 20:
    status = "waspada"
else:
    status = "habis"

per_kat = {}
for _, d, k in insiden:
    per_kat[k] = per_kat.get(k, 0) + d
terbesar = max(per_kat, key=per_kat.get)

print(f"budget_total={budget_total:.0f} menit")
print(f"total_burn={total_burn} menit")
print(f"sisa={sisa:.0f} menit ({persen_sisa:.1f}%) -> {status}")
print(f"pembakar_terbesar={terbesar} ({per_kat[terbesar]} menit)")`,
        checks: [
          { kind: "equal", task: "t1", name: "budget_total", value: 216, tol: 1e-6, label: "Budget 216 menit", msg: "(1 − 0,995) × 43.200 = 216 menit." },
          { kind: "equal", task: "t1", name: "total_burn", value: 70, label: "Burn 70 menit", msg: "5 + 12 + 18 + 35 = 70 menit terbakar." },
          { kind: "equal", task: "t1", name: "sisa", value: 146, tol: 1e-6, label: "Sisa 146 menit", msg: "216 − 70 = 146 menit tersisa." },
          { kind: "stdout_matches", task: "t2", pattern: "\\(67\\.6%\\) -> aman", label: "Status aman", msg: "67,6% > 50% → status aman." },
          { kind: "stdout_matches", task: "t2", pattern: "pembakar_terbesar=model", label: "Kategori terbesar", msg: "Kategori 'model' membakar 35 menit → postmortem penuh." },
        ],
      },
      reference: "Salahkan sistem, perbaiki sistem. Postmortem sedalam burn-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — kelulusan track",
      prose: [
        "Lima pertanyaan pamungkas lintas seluruh track. Setiap opsi punya alasan kenapa benar atau salah.",
        "Catatan posisi capstone: lesson ini menutup inti track (MLOps1–MLOps12). Lesson MLOps13–MLOps22 sesudahnya adalah modul lanjutan opsional — experiment tracking, Terraform, FinOps, Triton, keamanan, platform engineering, LLMOps end-to-end, cloud ML, KServe, dan distributed training — yang memperdalam, bukan syarat kelulusan capstone ini.",
      ],
      tasks: [],
      summary: [
        "MLOps = disiplin agar model tetap sehat, aman, akuntabel di produksi (bukan tools).",
        "Pipeline (DAG+retry) → fitur konsisten (point-in-time) → registry (stage+audit) → gerbang kualitas → tangga deploy.",
        "Serving mengikuti SLA angka; kapasitas = Little's law + buffer; monitor 4 lapis berjenjang.",
        "Retrain berpemicu + embargo label; testing fail-fast; governance berjenjang mengikuti risiko.",
        "K8s butuh operator; rancangan dinilai dari jawaban operasional, bukan ketebalan dokumen.",
        "Deploy pertama di kind/minikube: 4 syarat (image ter-pin, readiness probe, limit, replika minimal 2) — latihan lokal, prod tetap managed.",
      ],
      next: { label: "MLOps13 — Experiment Tracking & DVC", href: "/v2/learn/mlops13-experiment-tracking" },
      quiz: [
        {
          q: "DompetKu: SLA 300ms p99, tim 6 orang tanpa operator K8s, budget Rp400 jt/bulan. Pilihan infra?",
          options: [
            { text: "K8s self-managed + training tiap jam", why: "Tanpa operator = bom waktu; training tiap jam tanpa embargo = racun. Dua kesalahan sekaligus." },
            { text: "Managed endpoint + orchestrator managed + training spot ber-checkpoint", why: "Nol operator, bayar pakai, spot hemat untuk training. Sesuai kendala SDM & budget.", correct: true },
            { text: "Batch semalam — paling murah", why: "SLA 300ms tidak bisa dipenuhi batch. Murah tapi gagal memenuhi syarat." },
            { text: "Server fisik di kantor", why: "Capex + tetap butuh operator + tidak elastis. Terburuk dari semua dunia." },
          ],
        },
        {
          q: "Tiga bulan setelah live, PSI fitur utama 0,9 tapi akurasi (label matang) belum turun. Tindakan?",
          options: [
            { text: "Tunggu akurasi turun — data belum membuktikan", why: "Menunggu = PayLancar jilid 2. PSI 0,9 adalah bukti dunia berubah." },
            { text: "Investigasi segera: pahami pergeseran dulu, jangan langsung retrain", why: "Drift = sinyal investigasi. Bisa jadi bug data, perubahan bisnis legit, atau serangan baru — responsnya beda-beda.", correct: true },
            { text: "Langsung retrain penuh otomatis", why: "Retrain buta berisiko mengabadikan pola sementara/label mentah sebagai kebenaran." },
            { text: "Kecilkan ambang alert agar tidak berisik", why: "Mengubah ambang agar 'tenang' = memalsukan radar. Jangan pernah." },
          ],
        },
        {
          q: "Versi v5 baru lolos semua gerbang. Langkah deploy pertama?",
          options: [
            { text: "Langsung 100% — semua gerbang hijau", why: "Gerbang ≠ bukti produksi. Satu lompatan = satu bencana potensial." },
            { text: "Shadow 1–2 minggu: skor dicatat, keputusan tidak dipakai, bandingkan dengan champion", why: "Satu-satunya bukti perilaku di data produksi nyata tanpa risiko. Tangga risiko dimulai dari 0%.", correct: true },
            { text: "Canary 50% agar cepat dapat sinyal", why: "50% bukan canary. Sinyal didapat di 5% dengan blast radius kecil." },
            { text: "Tanya voting tim di chat", why: "Keputusan deploy = data + prosedur, bukan polling." },
          ],
        },
        {
          q: "OJK bertanya: 'buktikan model 14 Maret'. Bukti minimal yang harus ada?",
          options: [
            { text: "Screenshot AUC dari notebook analis", why: "Screenshot bukan bukti terekam sistem — bisa dibuat kapan saja." },
            { text: "Registry (versi+stage) + lineage (hash data, pipeline fitur) + audit approval", why: "Tiga serangkai ketertelusuran: APA versinya, DARI APA ia dibuat, SIAPA menyetujui. Terjawab dalam menit.", correct: true },
            { text: "Testimoni tim bahwa modelnya bagus", why: "Testimoni bukan bukti. 'Kayaknya' = temuan audit." },
            { text: "File model .pkl yang tersimpan", why: "File tanpa metadata = artefak yatim: versi berapa? data apa? siapa approve? Tidak terjawab." },
          ],
        },
        {
          q: "Rancangan DompetKu melebihi budget Rp85 jt/bulan tapi net Rp75 M/bulan. Sikap tepat?",
          options: [
            { text: "Pangkas monitoring — kan belum ada insiden", why: "Memangkas radar untuk hemat 21% = mempertaruhkan Rp57,6 M (kasus drift 2 bulan). Bodoh secara matematika." },
            { text: "Ajukan kenaikan dengan argumen ROI 155x + skenario rugi tanpa komponen itu", why: "Bahasa direksi = angka. Rp85 jt melindungi Rp75 M/bulan = argumen yang menang.", correct: true },
            { text: "Tetap jalan tanpa memberi tahu direksi", why: "Melanggar budget diam-diam = pelanggaran governance. Jangan pernah." },
            { text: "Turunkan target recall ke 40% agar murah", why: "Mengorbankan misi demi budget = kegagalan rancangan. Optimalkan BIAYA, bukan misi." },
          ],
        },
        {
          q: "Sisa error budget bulan ini 19% (8,2 dari 43,2 menit). Tim ingin deploy fitur nice-to-have Jumat sore. Keputusan TEPAT?",
          options: [
            { text: "Deploy saja — CI hijau dan fitur sudah di-review", why: "CI hijau tidak mengembalikan budget yang terbakar. Aturan < 20% = bekukan non-kritis ada justru untuk momen seperti ini." },
            { text: "Tunda ke bulan depan; hanya hotfix kritis yang boleh jalan", why: "Tepat. Inilah gunanya budget: keputusan yang tidak populer tapi benar, diambil oleh ANGKA bukan oleh siapa yang paling vokal di rapat.", correct: true },
            { text: "Naikkan SLO menjadi 99,99% agar terlihat lebih baik", why: "Menaikkan SLO MEMPERKECIL budget (43,2 → 4,32 menit) — memperparah keadaan. SLO bukan target kecantikan; ia kontrak dengan bisnis." },
            { text: "Reset budget ke 100% karena `bulan lalu kan sudah lewat`", why: "Budget dihitung per periode TETAP (bulanan). Me-reset seenaknya = tidak punya budget sama sekali. Disiplinnya justru di sini." },
          ],
        },
        {
          q: "Manifest kind: image fraud-scorer:latest, 1 replika, tanpa readiness probe, tanpa limit. Vonis kesiapan?",
          options: [
            { text: "BELUM_SIAP 0/4 — keempat syarat gagal; perbaiki manifest sebelum lanjut ke staging managed", why: "Tepat: :latest tidak bisa di-rollback pasti, 1 replika = satu titik kegagalan, tanpa probe pod 'jalan' belum tentu 'siap', tanpa limit satu pod bisa mematikan tetangganya.", correct: true },
            { text: "SIAP_DEPLOY — kind hanya latihan, syarat tidak berlaku", why: "Justru karena latihan, syarat dilatih di sini: manifest yang lolos kind adalah manifest yang sama ke prod." },
            { text: "SIAP_DEPLOY — 1 replika cukup untuk capstone", why: "Update tanpa downtime butuh minimal 2 replika; 1 replika berarti tiap deploy = downtime." },
            { text: "Langsung ke managed prod saja — kind membuang waktu", why: "Kesalahan manifest di prod harganya insiden; di kind harganya 5 menit. Tangga deploy ada untuk dipakai." },
          ],
        },
      ],
    },
  ],
};
