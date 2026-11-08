import type { V2Lesson } from "../lib/types";

// 4 node x 8 GPU hasil bin-packing lab: node-0 penuh 8/8, lainnya 7/8.
// 6 job tak terjadwal karena fragmentasi (sisa 0+1+1+1 tak muat job 6/4/4/4/4/3; jumlah tak terjadwal 25 GPU).
const NODES_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Empat node GPU hasil penjadwalan: tiga node hampir penuh, enam job tak terjadwal karena fragmentasi.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="70" y="20" fill="var(--text)" font-weight="600">node-0</text>
<text x="190" y="20" fill="var(--text)" font-weight="600">node-1</text>
<text x="310" y="20" fill="var(--text)" font-weight="600">node-2</text>
<text x="430" y="20" fill="var(--text)" font-weight="600">node-3</text>
</g>
<g>
<rect x="14" y="30" width="112" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="20" y="36" width="100" height="98" rx="4" fill="var(--c1)" opacity="0.85"/>
<rect x="134" y="30" width="112" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="140" y="48" width="100" height="86" rx="4" fill="var(--c1)" opacity="0.85"/>
<rect x="254" y="30" width="112" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="260" y="48" width="100" height="86" rx="4" fill="var(--c1)" opacity="0.85"/>
<rect x="374" y="30" width="112" height="110" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<rect x="380" y="48" width="100" height="86" rx="4" fill="var(--c1)" opacity="0.85"/>
</g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle" fill="var(--text-muted)">
<text x="70" y="156">8/8 penuh</text><text x="190" y="156">7/8</text><text x="310" y="156">7/8</text><text x="430" y="156">7/8</text></g>
<text x="240" y="182" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)"><tspan font-weight="700">Utilisasi 91%</tspan><tspan fill="var(--text-muted)"> — tapi 6 job menganggur: sisa 0+1+1+1 GPU tak muat job manapun</tspan></text>
<text x="240" y="200" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">fragmentasi: utilisasi tinggi ≠ semua job terjadwal</text>
</svg>`;

const MLOPS11_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Tagihan bulanan 10 GPU: on-demand Rp328,5 juta, spot Rp109 juta, campuran Rp199,4 juta."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">150</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">300</text><rect x="72.5" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="115.7" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp328,5 jt</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">On-demand</text><rect x="211.8" y="127.1" width="86.4" height="52.9" rx="3" fill="var(--c2)"/><text x="255.0" y="121.1" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp109 jt</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Spot+ckpt</text><rect x="351.1" y="82.9" width="86.4" height="97.1" rx="3" fill="var(--c1)"/><text x="394.3" y="76.9" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp199,4 jt</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Campuran</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">juta rupiah / bulan</text></svg>`;

export const mlops11: V2Lesson = {
  slug: "mlops11-k8s",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps11 — Kubernetes untuk ML",
  estMinutes: 75,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "GPU mahal yang menganggur 70%",
      prose: [
        "Startup AI MajuML menyewa 32 GPU A100 — Rp1,44 juta per JAM untuk klaster penuh. Ironisnya, utilisasi rata-rata 30%. Tim berebut GPU via spreadsheet: 'GPU-5 dipakai Budi sampai Jumat', 'tolong jangan ganggu run-ku'. Job antre berminggu-minggu sementara GPU lain menganggur — karena tidak ada yang tahu mana yang kosong.",
        "Manajemen mengusulkan SEWA 16 GPU LAGI (Rp720 jt/bulan tambahan). Untungnya seorang engineer menghitung dulu: total kebutuhan riil hanya 12 GPU; masalahnya bukan KURANG GPU, melainkan TIDAK ADA SCHEDULER. Spreadsheet bukan orkestrasi.",
        "Twist-nya: solusinya bukan belanja, melainkan Kubernetes — sistem yang menempatkan job ke node kosong secara otomatis (bin packing) dan mengantrekan sisanya. Antrean yang adil antar tim dan mematikan pod yang idle BUKAN perilaku native K8s — itu butuh komponen tambahan (mis. Kueue untuk antrean adil, autoscaler/descheduler untuk mematikan yang idle). Setelah migrasi: utilisasi 30% → 78%, tanpa sewa tambahan. Spreadsheet pensiun.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan kapan Kubernetes layak dan kapan overkill untuk workload ML; (2) menghitung ekonomi spot instance termasuk biaya preemption; (3) membaca masalah bin-packing GPU dari angka fragmentasi; (4) memilih strategi node (on-demand vs spot vs campuran) untuk tiap jenis job.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Pekerjaan ML lambat = butuh hardware lebih besar'",
        type: "pitfall",
        body: "Seringkali masalahnya ALOKASI, bukan KAPASITAS. Ukur dulu utilisasi riil dan antrean sebelum belanja. Rp720 jt/bulan untuk GPU yang akan ikut menganggur 70% adalah cara termahal untuk tidak menyelesaikan masalah.",
      },
      reference: "Ukur utilisasi & antrean dulu. Scheduler > belanja hardware.",
    },
    {
      id: "konsep-k8s",
      eyebrow: "Langkah 2 · Konsep inti",
      title: "Pod, Job, dan janji vs batas",
      prose: [
        "Pod = unit terkecil: satu/tujuh container yang berbagi nasib (hidup/mati bersama). Deployment = 'pastikan N pod API selalu hidup' (untuk serving — self-healing). Job = 'jalankan sampai selesai' (untuk training — run-to-completion). CronJob = Job terjadwal (untuk pipeline batch MLOps2).",
        "Dua angka mengendalikan penjadwalan. Requests = 'saya BUTUH segini' — scheduler HANYA menempatkan pod di node yang muat; ini janji alokasi. Limits = 'saya BOLEH pakai maksimal segini' — pelanggar CPU di-throttle (dilambatkan, bukan dibunuh), pelanggar memori dibunuh (OOMKilled). Requests tanpa limits = tetangga berisik; limits tanpa requests = antre tak berujung.",
        "Aturan praktis: requests = kebutuhan riil (diukur, bukan ditebak), limits = requests × 1,2–1,5 untuk CPU/RAM. Untuk GPU: requests = limits = bilangan bulat (GPU tidak bisa dibagi — kecuali dengan teknologi khusus). Pod ML yang meminta '0,5 GPU' tanpa dukungan teknis = ditolak scheduler.",
        "💡 Intuisi: K8s seperti manajer kos. Requests = 'saya sewa kamar tipe ini' (manajer mencarikan kamar yang muat). Limits = 'maksimal segini barang boleh masuk' (kelebihan = diusir). Tanpa manajer, penghuni berebut kamar via spreadsheet — persis MajuML sebelum migrasi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Set requests serendah mungkin biar cepat dapat tempat'",
        type: "pitfall",
        body: "Requests palsu-rendah = pod ditempatkan di node yang sebenarnya tidak muat → berebut resource → SEMUA pod di node itu melambat (noisy neighbor) atau mati OOM. Kejujuran requests adalah fondasi stabilitas klaster. Berbohong ke scheduler = sabotase diri sendiri.",
      },
      reference: "Pod (unit), Deployment (serving), Job (training). Requests = janji, limits = pagar.",
    },
    {
      id: "gpu-scheduling",
      eyebrow: "Langkah 3 · GPU scheduling",
      title: "Bin packing dan ekonomi GPU",
      prose: [
        "Menjadwalkan job GPU = bin packing: memasukkan balok (job) ke kotak (node) seefisien mungkin. Strategi first-fit decreasing (urutkan job terbesar dulu) sederhana dan cukup baik. Musuhnya: FRAGMENTASI — total sisa 3 GPU di 4 node (0+1+1+1) tidak bisa menampung job 3-GPU terkecil sekalipun, karena 3 GPU itu tersebar di 3 node. Utilisasi 91% dengan 6 job menganggur = mungkin (lihat lab!).",
        "Senjata ekonomi: spot/preemptible instance — 70% lebih murah, tapi bisa ditarik kapan saja. Cocok untuk training yang checkpoint rutin (ditarik = lanjutkan dari checkpoint). TIDAK cocok untuk serving produksi (ditarik = downtime). Campuran cerdas: on-demand untuk serving + spot untuk training/batch.",
        "Node affinity & taint: tandai node GPU khusus ('hanya untuk training'), cegah pod API nyasar ke node mahal. GPU adalah resource termahal di klaster — jangan biarkan pod iseng tidur di sana.",
        "💡 Intuisi: seperti menyusun koper. Baju besar (job 8-GPU) dimasukkan dulu, kaus kaki (job 1-GPU) mengisi sela. Koper 91% penuh tapi sepatu tak muat = fragmentasi. Solusinya bukan koper lebih besar — tapi menyusun lebih cerdas atau koper (node) yang ukurannya pas.",
      ],
      figure: {
        svg: NODES_SVG,
        alt: "Empat node GPU hasil penjadwalan: tiga node hampir penuh, enam job tak terjadwal karena fragmentasi.",
        caption: "Hasil lab: utilisasi 91% namun 6 job tak terjadwal — sisa 0+1+1+1 GPU terfragmentasi, tak muat job manapun (job tak terjadwal [6, 4, 4, 4, 4, 3], jumlah 25 GPU). Cara membaca: kotak-kotak = GPU di cluster; warna = terisi/kosong; 6 job antre di kanan. Interpretasi: utilisasi 91% TERLIHAT efisien tapi 3 GPU tersisa terfragmentasi (0+1+1+1, tak ada node yang muat job 3-GPU) — utilisasi tinggi ≠ penjadwalan baik. Inilah bin-packing problem.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan training di spot instance TANPA checkpointing. Ditarik di epoch 90 dari 100 = 90 epoch hilang. Spot + checkpoint tiap N epoch = 70% hemat dengan risiko terkendali. Spot tanpa checkpoint = judi, bukan strategi.",
      },
      reference: "Bin packing + waspada fragmentasi. Spot untuk training ber-checkpoint; on-demand untuk serving.",
    },
    {
      id: "lab-scheduler",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: simulator scheduler GPU",
      prose: [
        "Klaster: 4 node × 8 GPU. Antrean 10 job training dengan kebutuhan GPU acak (seed 111). Tugasmu: implementasikan `jadwalkan` — first-fit decreasing: untuk tiap job (sudah diurutkan besar→kecil), cari node PERTAMA yang muat; jika tidak ada, job tak terjadwal.",
        "Cara membaca: tiap baris node = job yang menempatinya dan GPU terpakai. Interpretasi: bandingkan 'utilisasi klaster' dengan 'job tak terjadwal' — jika utilisasi tinggi TAPI banyak job menganggur, kamu baru saja melihat fragmentasi dengan mata kepala sendiri. Catatan biaya: Rp391.500 = biaya 29 GPU yang TERPAKAI; klaster menyewa 4 node penuh (32 GPU) — bila spot ditagih per node yang disewa, biayanya 32 × Rp45.000 × 0,3 = Rp432.000/jam. Bedakan 'biaya GPU terpakai' dari 'biaya node disewa'.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `jadwalkan` (first-fit decreasing)" },
        { id: "t2", text: "Jalankan; baca utilisasi vs job tak terjadwal" },
        { id: "t3", text: "Bandingkan biaya klaster penuh vs aktual (spot)" },
      ],
      expected: "utilisasi 91% · 6 job tak terjadwal · Rp1.440.000 vs Rp391.500",
      note: {
        title: "💡 Intuisi: scheduler tidak menciptakan GPU",
        body: "Scheduler tidak menambah satu pun GPU — ia hanya menempatkan dengan cerdas. Kenaikan utilisasi 30% → 78% di MajuML datang dari menghilangkan spreadsheet, bukan dari belanja. Dalam infrastruktur, kecerdasan alokasi sering mengalahkan belanja kapasitas.",
      },
      hints: [
        "Untuk tiap job j: cocok = node pertama dengan sisa[i] >= j (next + generator).",
        "Jika cocok: node[cocok].append(j); sisa[cocok] -= j. Jika tidak: tak_terjadwal.append(j).",
        "Job sudah diurutkan menurun — jangan diacak lagi.",
      ],
      code: {
        starter: `import random\nrandom.seed(111)\n\nKAPASITAS_NODE = 8\nN_NODE = 4\njob = sorted([random.randint(1, 8) for _ in range(10)], reverse=True)\n\ndef jadwalkan(job, n_node, kapasitas):\n    # TULIS KODEMU: first-fit decreasing, return (node, tak_terjadwal)\n    \n\nnode, gagal = jadwalkan(job, N_NODE, KAPASITAS_NODE)\nterpakai = sum(sum(n) for n in node)\ntotal = N_NODE * KAPASITAS_NODE\nprint(f"Antrean job (GPU): {job}")\nfor i, n in enumerate(node):\n    print(f"  node-{i}: job {n} -> {sum(n)}/{KAPASITAS_NODE} GPU")\nprint(f"Utilisasi klaster: {terpakai}/{total} = {terpakai/total:.0%}")\nprint(f"Job tak terjadwal: {gagal if gagal else 'tidak ada'}")\nBIAYA_GPU_JAM = 45_000\nprint(f"Biaya/jam klaster penuh: Rp{N_NODE * KAPASITAS_NODE * BIAYA_GPU_JAM:,}".replace(",", "."))\nprint(f"Biaya/jam aktual (spot -70% \u2014 {terpakai} GPU terpakai): Rp{int(terpakai * BIAYA_GPU_JAM * 0.3):,}".replace(",", "."))`,
        lockLines: 9,
        solution: `import random\nrandom.seed(111)\n\nKAPASITAS_NODE = 8\nN_NODE = 4\njob = sorted([random.randint(1, 8) for _ in range(10)], reverse=True)\n\ndef jadwalkan(job, n_node, kapasitas):\n    # TULIS KODEMU: first-fit decreasing, return (node, tak_terjadwal)\n    node = [[] for _ in range(n_node)]\n    sisa = [kapasitas] * n_node\n    tak_terjadwal = []\n    for j in job:\n        cocok = next((i for i in range(n_node) if sisa[i] >= j), None)\n        if cocok is None:\n            tak_terjadwal.append(j)\n        else:\n            node[cocok].append(j); sisa[cocok] -= j\n    return node, tak_terjadwal\n\nnode, gagal = jadwalkan(job, N_NODE, KAPASITAS_NODE)\nterpakai = sum(sum(n) for n in node)\ntotal = N_NODE * KAPASITAS_NODE\nprint(f"Antrean job (GPU): {job}")\nfor i, n in enumerate(node):\n    print(f"  node-{i}: job {n} -> {sum(n)}/{KAPASITAS_NODE} GPU")\nprint(f"Utilisasi klaster: {terpakai}/{total} = {terpakai/total:.0%}")\nprint(f"Job tak terjadwal: {gagal if gagal else 'tidak ada'}")\nBIAYA_GPU_JAM = 45_000\nprint(f"Biaya/jam klaster penuh: Rp{N_NODE * KAPASITAS_NODE * BIAYA_GPU_JAM:,}".replace(",", "."))\nprint(f"Biaya/jam aktual (spot -70% \u2014 {terpakai} GPU terpakai): Rp{int(terpakai * BIAYA_GPU_JAM * 0.3):,}".replace(",", "."))`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "Utilisasi klaster: 29/32 = 91%", label: "Utilisasi 91%", msg: "29 dari 32 GPU terpakai." },
          { kind: "stdout_matches", task: "t2", pattern: "Job tak terjadwal: \\[6, 4, 4, 4, 4, 3\\]", label: "6 job tak terjadwal", msg: "Fragmentasi: sisa 0+1+1+1 GPU tak muat job manapun." },
          { kind: "stdout_matches", task: "t3", pattern: "Rp391\\.500", label: "Biaya spot Rp391.500", msg: "29 GPU terpakai × Rp45rb × 30% (diskon spot 70%). Perhatian: ini biaya GPU TERPAKAI — klaster menyewa 4 node penuh (32 GPU); bila spot ditagih per node yang disewa, biayanya 32 × Rp45.000 × 0,3 = Rp432.000/jam." },
        ],
      },
      reference: "next() cari node pertama yang muat. Fragmentasi = musuh utilisasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan Kubernetes, kapan tidak?",
      prose: [
        "**Skenario 1 — Training sesekali, tim kecil.** 2–3 training/minggu di satu GPU. → JANGAN K8s: pakai VM langsung atau managed training (SageMaker/Vertex). K8s butuh operator; tim 3 orang tidak punya.",
        "**Skenario 2 — Banyak job GPU + serving + tim platform.** Puluhan training/minggu, API produksi, ada 1+ orang urus infra. → K8s self-managed atau managed (GKE/EKS): unifikasi training + serving + pipeline dalam satu bidang kontrol.",
        "**Skenario 3 — Tidak mau urus klaster SAMA SEKALI.** → Serverless GPU / managed endpoint: bayar lebih mahal per jam, nol operasi. Cocok untuk beban sporadis — jangan bayar klaster idle 24/7.",
        "**Skenario 4 — Hybrid cerdas.** → Serving di on-demand (stabil), training di spot via K8s/cluster-autoscaler, eksperimen di notebook managed. Tiap beban di rumah termurahnya — orkestrasi yang menyatukan.",
        "Aturan praktis 10 detik: 'apakah ada minimal 1 orang yang job desk-nya menjaga klaster?' Tidak → managed/serverless. Ya → K8s boleh dipertimbangkan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: K8s itu pembangkit listrik, bukan stopkontak",
        body: "Membangun pembangkit untuk satu rumah = gila; menyambung ke PLN = waras. K8s self-managed = pembangkit sendiri: kuat, tapi butuh operator 24/7. Managed/serverless = PLN: bayar pakai, tanpa operator. Pilih sesuai skala 'rumahmu'.",
      },
      reference: "Ada operator → K8s. Tidak ada → managed/serverless. Hybrid untuk beban campuran.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Spreadsheet vs scheduler: hitungannya",
      prose: [
        "MajuML sebelum migrasi: 32 GPU × Rp45.000 × 24 × 30 = Rp1,037 M/bulan, utilisasi 30% → nilai efektif 9,6 GPU. Rencana manajemen: +16 GPU = +Rp518 jt/bulan → total Rp1,555 M untuk nilai efektif ~14 GPU.",
        "Setelah K8s: utilisasi 78% dari 32 GPU = 25 GPU efektif — LEBIH dari cukup untuk kebutuhan 12 GPU. Kelebihan 13 GPU dialihkan ke spot untuk eksperimen (70% diskon). Penghematan vs rencana belanja: Rp518 jt/bulan = Rp6,2 M/tahun. Biaya migrasi: 1 engineer × 2 bulan ≈ Rp60 jt.",
        "**Pertanyaan:** (1) Berapa ROI migrasi tahun pertama? (2) Kenapa utilisasi naik tanpa hardware baru? (3) Kapan K8s justru TIDAK disarankan untuk MajuML?",
        "**Pembahasan:** (1) (Rp6,2 M − Rp60 jt)/Rp60 jt ≈ 102x. (2) Bin packing otomatis + antrean adil + scale-down idle — spreadsheet tidak bisa melakukan ketiganya real-time. (3) Jika tim hanya 3 orang tanpa siapa pun mau jadi operator klaster — maka managed service, bukan K8s self-managed.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Spreadsheet alokasi GPU = shadow IT: tidak teraudit, single point of failure (yang pegang spreadsheet resign = chaos), dan tidak ada kontrol akses. Migrasi ke scheduler terpusat juga migrasi dari 'kepercayaan personal' ke 'sistem terverifikasi' — prinsip governance MLOps10.",
      },
      reference: "ROI 102x. Kecerdasan alokasi > belanja kapasitas.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Ekonomi spot instance: diskon 70% dengan syarat",
      prose: [
        "Harga GPU A100 on-demand: Rp45.000/jam. Harga spot: Rp13.500/jam — diskon 70%. Terdengar seperti tidak ada alasan memakai on-demand. Tapi spot bisa DIAMBIL KEMBALI (preempt) kapan saja dengan peringatan 2 menit; peluang preempt untuk GPU ≈ 15% per 8 jam job. Jika job training 8 jam ter-preempt di jam ke-7 tanpa checkpoint, 7 jam × Rp13.500 = Rp94.500 terbuang + mulai dari NOL. Diskon 70% dengan risiko mengulang dari awal.",
        "Hitung ekspektasi biayanya dengan checkpoint tiap 1 jam (biaya checkpoint: 5 menit × Rp13.500 ≈ Rp1.100 per checkpoint, 8x = Rp9.000). Skenario A — tidak ter-preempt (85%): biaya = 8 × Rp13.500 + Rp9.000 = Rp117.000. Skenario B — ter-preempt sekali (15%) di jam ke-7, lanjut dari checkpoint terakhir: checkpoint tiap 1 jam berarti kembali ke checkpoint jam ke-6 dan ulangi 2 jam tersisa — total 9 jam efektif (7 + 2), bukan 12 jam: redo maksimal ~1 jam + sisa 2 jam. Biaya = 9 × Rp13.500 + Rp9.000 ≈ Rp130.500. Ekspektasi = 0,85(117rb) + 0,15(130,5rb) ≈ Rp119.000. Bandingkan on-demand: 8 × Rp45.000 = Rp360.000. Spot + checkpoint HEMAT ~67% bahkan SETELAH menghitung preemption.",
        "Tanpa checkpoint, hitungannya berbalik: skenario B = mulai dari nol = 15 jam × Rp13.500 = Rp202.500 + waktu terbuang; ekspektasi = 0,85×(8×13.500) + 0,15×202.500 = 0,85×108.000 + 30.375 ≈ Rp122.000 — masih lebih murah dari on-demand, TAPI waktu selesainya tidak pasti (bisa molor 2x). (Catatan: tanpa checkpoint tidak ada biaya checkpoint Rp9.000 — skenario A di sini Rp108.000, bukan Rp117.000.) Untuk training riset yang deadline-nya longgar, ini oke. Untuk retrain produksi yang harus selesai sebelum jam 6 pagi (MLOps8), ketidakpastian jadwal lebih mahal dari penghematan — pakai on-demand atau campuran.",
        "Strategi campuran yang dipakai industri: (1) TRAINING riset/eksperimen → 100% spot + checkpoint agresif (tiap 30 menit); (2) RETRAIN produksi terjadwal → spot dengan `fallback on-demand` (jika preempt 2x, pindah ke on-demand otomatis — fallback mengurangi risiko molor, tetapi TIDAK menjamin SLA: on-demand juga bisa antre/kehabisan kapasitas; untuk SLA keras sisakan buffer waktu); (3) SERVING real-time → 100% on-demand (latensi tidak boleh berjudi); (4) BATCH inference → spot (bisa diulang, tidak ada SLA ketat). Aturan satu kalimat: makin ketat SLA waktunya, makin kecil porsi spot-nya.",
        "Contoh tagihan bulanan tim dengan 10 GPU: semua on-demand = 10 × 730 jam × Rp45rb = Rp328,5 juta/bulan. Campuran realistis (40% serving on-demand, 60% training/batch spot): (4 × 730 × Rp45rb) + (6 × 730 × Rp13,5rb × 1,15 faktor preempt) = Rp131,4jt + Rp68jt = Rp199,4 juta — hemat Rp129 juta/bulan (39%). Satu keputusan arsitektur = Rp1,5 miliar per tahun. Inilah mengapa FinOps (bukan cuma engineering) adalah skill MLOps.",
        "Jebakan spot yang tidak terlihat di tagihan: (a) DATA TRANSFER — checkpoint 50GB × 8x sehari × Rp1.200/GB = Rp480 ribu/hari jika storage beda zona; simpan checkpoint di zona yang sama. (b) STARTUP TIME — tiap preempt butuh 10 menit pull image + load data; 3x preempt = 30 menit engineer menunggu (atau pipeline telat). (c) KUOTA — spot tidak dijamin ada; saat semua orang butuh GPU (rilis model besar), spot habis dan job antre. Untuk (c): minta `capacity reservation` untuk porsi kritis, atau terima antrean untuk porsi eksperimen.",
        "Waspadai juga `spot hanya untuk yang stateless/checkpointable`. Job yang TIDAK boleh di spot: serving online, pipeline streaming dengan state, dan — yang sering dilupakan — NOTEBOOK eksperimen interaktif (kehilangan 3 jam eksplorasi karena preempt = engineer frustrasi, biayanya gaji bukan compute). Labeli setiap workload di cluster: `spot-ok` atau `on-demand-only`. Tanpa label, scheduler tidak bisa membuat keputusan ekonomi yang benar.",
      ],
      formula: String.raw`E[C_{spot}] = (1-p) \cdot c_{s}T + p \cdot c_{s}(T + T_{ulang}) + n_{cp} \cdot c_{cp}`,
      formulaNote: "E[C_spot] = ekspektasi biaya spot; p = peluang preempt per job; c_s = harga spot per jam; T = durasi job; T_ulang = waktu mengulang dari checkpoint; n_cp = jumlah checkpoint; c_cp = biaya per checkpoint. Bandingkan dengan c_on-demand × T — pilih yang lebih kecil DENGAN mempertimbangkan kepastian jadwal.",
      figure: {
        svg: MLOPS11_DEEP_SVG,
        alt: "Diagram batang tagihan bulanan 10 GPU: on-demand Rp328,5 juta, spot dengan checkpoint Rp109 juta, campuran Rp199,4 juta.",
        caption: "Cara membaca: tinggi batang = tagihan bulanan 10 GPU (juta rupiah); tiga batang = tiga strategi. Interpretasi: spot + checkpoint menghemat ~67% per job training (E[C] Rp119 ribu vs on-demand Rp360 ribu; bulanan 10 GPU ≈ Rp328,5 jt × 119/360 ≈ Rp109 jt); strategi campuran (serving on-demand, training spot) menghemat Rp129 juta/bulan — TAPI hanya jika workload dilabeli spot-ok vs on-demand-only dengan benar.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: spot = diskon untuk ketidakpastian",
        body: "Diskon 70% adalah harga yang dibayar cloud provider untuk ketidakpastian preempt. Kamu boleh mengambil diskonnya HANYA jika workload-mu kebal terhadap ketidakpastian: bisa checkpoint, bisa antre, tidak ada SLA waktu ketat. Serving real-time tidak kebal — jangan pertaruhkan latensi demi diskon.",
      },
      reference: "Labeli workload: spot-ok vs on-demand-only. Checkpoint tiap 30–60 menit untuk semua job spot.",
    },
    {
      id: "helm-konsep",
      eyebrow: "Langkah 8 · Helm",
      title: "Helm: package manager Kubernetes",
      prose: [
        "Satu layanan ML di Kubernetes butuh Deployment + Service + Ingress + ConfigMap + HPA + ServiceAccount — enam file, ratusan baris YAML. Nilainya beda per environment: URL antrean dev tidak sama dengan staging, tidak sama dengan prod. Cara lama: salin folder jadi `k8s-dev/`, `k8s-staging/`, `k8s-prod/`, lalu edit satu per satu dengan tangan. Cerita nyatanya: folder `k8s-prod/` ketinggalan tiga revisi; seminggu penuh prod membaca antrean STAGING — job training produksi mencuri pekerjaan staging dan sebaliknya. Bukan bug kode. Bug fotokopi.",
        "Helm menyelesaikan tepat masalah ini: chart = paket aplikasi untuk Kubernetes (seperti `.deb` untuk Ubuntu, atau wheel untuk pip). Satu perintah `helm install` memasang SELURUH aplikasi; `helm upgrade` memperbarui; `helm uninstall` mencabut bersih. Tidak ada lagi enam file yang disalin tangan.",
        "Anatomi chart: `Chart.yaml` (metadata: nama + versi chart), `values.yaml` (nilai default — kenop yang bisa diputar), `templates/` (kerangka YAML dengan placeholder seperti `{{ .Values.replicas }}`), plus `NOTES.txt` untuk pesan pasca-install. Satu chart melayani tiga environment: `helm install fraud ./chart -f values-dev.yaml` vs `-f values-staging.yaml` vs `-f values-prod.yaml`. Urutan menang: default chart < file `-f` (file yang disebut belakangan menang) < `--set`. Konfigurasi menjadi DATA (values), bukan tiga salinan file.",
        "Rilis (release) = satu instansi chart yang terpasang: chart + values yang dipakai + nomor revisi. Setiap `helm upgrade` menaikkan revisi — riwayatnya tersimpan dan bisa dilihat dengan `helm history`. Dan sebelum berani install: `helm template` me-render chart menjadi YAML polos di laptop (lihat DULU apa yang akan dikirim ke cluster), `helm lint` memeriksa chart dari kesalahan umum. Aturannya sederhana: jangan pernah install yang belum di-template.",
        "💡 Intuisi: chart = resep rendang; values = takaran bumbu per selera keluarga; rilis = hidangan yang sudah tersaji — tercatat rapi di buku kas (nomor revisi). Satu resep melayani tiga meja makan tanpa memfotokopi resep tiga kali.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 4 komponen chart dan peran masing-masing" },
        { id: "t2", text: "Jelaskan urutan prioritas values: default < -f < --set" },
      ],
      note: {
        title: "🚨 Mitos: 'pakai Helm = tidak perlu paham YAML'",
        type: "pitfall",
        body: "Kebalikannya: Helm ADALAH YAML yang di-template. Saat hasil render mengejutkanmu (dan itu akan terjadi — kondisional bersarang, indentasi Go template yang rewel), kamu debug dengan membaca YAML hasil render. `helm template` adalah x-ray-mu. Yang tidak paham YAML lalu memakai Helm = mengoperasikan sesuatu yang tidak bisa dibaca saat rusak.",
      },
      reference: "Satu chart, tiga values. Template dulu, install kemudian.",
    },
    {
      id: "helm-produksi-ml",
      eyebrow: "Langkah 9 · Helm untuk ML",
      title: "Helm di produksi ML: upgrade, rollback, dan rahasia",
      prose: [
        "Jam 2 pagi: metrik canary model v2.3 memburuk. Tanpa Helm: panik, cari YAML lama, apply manual, berharap. Dengan Helm: `helm rollback fraud 4` — satu perintah kembali ke revisi 4 (model v2.2 yang sehat). Rollback BUKAN deploy ulang versi lama; ia mengembalikan SELURUH keadaan rilis yang tercatat saat revisi itu (template ter-render + values yang berlaku saat itu). Itulah kenapa rollback adalah pasangan alami canary: jalan keluarnya sudah dihitung sebelum kamu masuk.",
        "Kenop ML yang hidup di values: `image_tag` (versi model — values yang PALING sering berubah di tim ML), `gpu: 1` (requests GPU), ambang autoscaling (untuk inference, kedalaman antrean lebih jujur daripada CPU), URL endpoint per environment, feature flag. Aturannya: semua yang BERUBAH antar rilis atau antar environment = values. Semua yang TETAP = template.",
        "Yang TIDAK BOLEH ada di values polos: secrets. values.yaml tinggal di git; Helm menyimpan rilis (termasuk values-nya) sebagai base64 di cluster — base64 BUKAN enkripsi, hanya kamuflase. API key di values = dipajang dua kali. Praktik yang benar: values hanya menyimpan REFERENSI (mis. `secretName: fraud-api-key`), nilainya tinggal di secrets manager (external-secrets, Vault, atau secret manager cloud) yang disuntik saat runtime.",
        "Dua jebakan produksi. Pertama, chart raksasa satu-untuk-semua (api + worker + db + redis + monitoring dalam satu chart): template menjadi spageti, satu `upgrade` mengguncang semuanya. Pilih chart kecil per komponen; gabungkan dengan chart payung (umbrella) bila perlu. Kedua, drift: seseorang `kubectl edit deployment` langsung di cluster — melewati Helm. Upgrade berikutnya menimpa diam-diam (atau three-way merge yang mengejutkan). Aturan emas: yang tidak diubah via values + upgrade = tidak diubah.",
        "💡 Intuisi: rilis Helm = save point di gim; rollback = load save; values = pengaturan difficulty per playthrough. Kamu tidak akan memainkan gim sulit tanpa save point — jangan rilis model tanpa kemampuan rollback satu perintah.",
        "Lab ini mensimulasikan inti Helm tanpa cluster: values berlapis (default < environment < rilis) di-render menjadi konfigurasi final per environment. Perhatikan: satu `release_override` (image tag canary) menimpa default di SEMUA environment — persis cara canary di-rollout di dunia nyata.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `render(env)`: default < environment < rilis" },
        { id: "t2", text: "Periksa cfg_dev & cfg_prod: override menang di lapis yang tepat" },
        { id: "t3", text: "Baca output: image tag canary muncul di semua environment" },
      ],
      expected: "dev: tag=model:v2.3 replika=1 gpu=0 rps=100 log=debug · prod: tag=model:v2.3 replika=4 gpu=1 rps=2000 log=warn",
      note: {
        title: "🚨 Mitos: 'secret di values aman karena base64'",
        type: "pitfall",
        body: "base64 bisa di-decode anak SD. `helm get values` atau akses ke API server = secret terbaca. Ditambah values.yaml biasanya ter-commit ke git — secret-mu kini ada di riwayat repo SELAMANYA. Secrets manager + referensi di values; tidak ada pengecualian untuk 'cuma sementara'.",
      },
      hints: [
        "Mulai dari salinan default: cfg = dict(default) — lalu update berurutan.",
        "env_override[env] dulu, release_override terakhir (paling menang).",
      ],
      code: {
        starter: `default = {\n    "image_tag": "model:v1.0",\n    "replicas": 2,\n    "gpu": 0,\n    "target_rps": 100,\n    "log_level": "info",\n}\n\nenv_override = {\n    "dev": {"replicas": 1, "log_level": "debug"},\n    "staging": {"replicas": 2, "target_rps": 500},\n    "prod": {"replicas": 4, "gpu": 1, "target_rps": 2000, "log_level": "warn"},\n}\n\nrelease_override = {"image_tag": "model:v2.3"}\n\n# TULIS KODEMU: render(env) menggabung 3 lapis (default < environment < rilis)\n`,
        lockLines: 17,
        solution: `default = {\n    "image_tag": "model:v1.0",\n    "replicas": 2,\n    "gpu": 0,\n    "target_rps": 100,\n    "log_level": "info",\n}\n\nenv_override = {\n    "dev": {"replicas": 1, "log_level": "debug"},\n    "staging": {"replicas": 2, "target_rps": 500},\n    "prod": {"replicas": 4, "gpu": 1, "target_rps": 2000, "log_level": "warn"},\n}\n\nrelease_override = {"image_tag": "model:v2.3"}\n\n# TULIS KODEMU: render(env) menggabung 3 lapis (default < environment < rilis)\ndef render(env):\n    cfg = dict(default)\n    cfg.update(env_override[env])\n    cfg.update(release_override)\n    return cfg\n\ncfg_dev = render("dev")\ncfg_staging = render("staging")\ncfg_prod = render("prod")\nfor nama, cfg in [("dev", cfg_dev), ("staging", cfg_staging), ("prod", cfg_prod)]:\n    print(f"{nama}: tag={cfg['image_tag']} replika={cfg['replicas']} gpu={cfg['gpu']} rps={cfg['target_rps']} log={cfg['log_level']}")`,
        checks: [
          { kind: "defined", task: "t1", name: "render", label: "Fungsi render terdefinisi", msg: "Definisikan def render(env) yang menggabung tiga lapis values." },
          { kind: "equal", task: "t2", name: "cfg_dev", value: { image_tag: "model:v2.3", replicas: 1, gpu: 0, target_rps: 100, log_level: "debug" }, label: "Konfigurasi dev benar", msg: "dev = default, kecuali replicas=1 dan log_level=debug (env); image_tag=v2.3 (rilis)." },
          { kind: "equal", task: "t2", name: "cfg_prod", value: { image_tag: "model:v2.3", replicas: 4, gpu: 1, target_rps: 2000, log_level: "warn" }, label: "Konfigurasi prod benar", msg: "prod = replicas=4, gpu=1, rps=2000, log=warn (env) + image_tag=v2.3 (rilis)." },
          { kind: "stdout_matches", task: "t3", pattern: "prod: tag=model:v2\\.3 replika=4 gpu=1 rps=2000 log=warn", label: "Output prod sesuai", msg: "Baris prod harus menampilkan konfigurasi final hasil render tiga lapis." },
          { kind: "stdout_matches", task: "t3", pattern: "dev: tag=model:v2\\.3 replika=1 gpu=0 rps=100 log=debug", label: "Output dev sesuai", msg: "Baris dev harus menampilkan konfigurasi final hasil render tiga lapis." },
        ],
      },
      reference: "Yang berubah = values. Secrets = referensi, bukan nilai. Rollback = save point.",
    },
    {
      id: "gap-g29-gpu-scheduler-config",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G29)",
      title: "Konfigurasi scheduler GPU yang nyata: bukan sekadar limits",
      prose: [
        "Menulis resources limits nvidia.com/gpu: 1 di PodSpec adalah langkah pertama — dan yang paling sering dikira sudah cukup. Scheduler default Kubernetes (kube-scheduler) memang menghitung GPU sebagai resource yang tidak bisa dibagi (integer, tidak bisa 0,5 GPU), tetapi ia tidak tahu apa-apa soal topologi (apakah dua GPU itu di NUMA node yang sama?), fragmentasi (GPU tersisa 1 di tiap node, pod butuh 2), atau antrean (siapa didahulukan saat GPU habis?). Konfigurasi nyata memakai tiga lapis: permintaan resource yang jujur, penjadwalan yang sadar GPU, dan antrean kerja.",
        "Lapis satu — PodSpec yang benar: requests dan limits nvidia.com/gpu HARUS sama (GPU tidak bisa di-overcommit — tidak ada burstable untuk GPU), nodeSelector atau nodeAffinity ke node berlabel accelerator=nvidia, dan toleration bila node GPU di-taint khusus (umum: taint nvidia.com/gpu=present:NoSchedule supaya pod CPU tidak mendarat di node mahal). Tanpa toleration, pod GPU-mu pending selamanya di node yang di-taint — dan log-nya hanya berkata Unschedulable.",
        "Lapis dua — penjadwalan sadar GPU. Untuk time-slicing (berbagi satu GPU fisik ke beberapa pod, cocok untuk inference ringan), device plugin NVIDIA dikonfigurasi lewat ConfigMap: nvidia.com/gpu dengan replicas (misal 4 potong per GPU) — tetapi ingat, time-slicing berbagi COMPUTE, bukan memori yang diisolasi keras: satu pod rakus memori tetap bisa membuat tetangganya OOM. Untuk training multi-GPU, pakai Volcano atau KAI Scheduler: gang scheduling (semua pod job jalan bersamaan atau tidak sama sekali — tanpa ini, 3 dari 4 worker jalan sementara 1 antre, dan 3 GPU menganggur menunggu), plus queue dengan prioritas dan kapasitas. Lapis tiga — observasi: DCGM exporter untuk utilisasi GPU nyata; pod yang meminta 1 GPU tetapi utilisasinya 12% adalah GPU yang dibayar mahal untuk menganggur.",
        "Contoh hitung antrean: node dengan 4 GPU; pod fraud-a minta 1, fraud-b minta 1, nlp-c minta 2, vision-d minta 1, batch-e minta 2. Scheduler FIFO: fraud-a (1) + fraud-b (1) + nlp-c (2) = 4 GPU terpakai, utilisasi 100%; vision-d dan batch-e PENDING sampai ada yang selesai. Bila nlp-c sebenarnya hanya butuh 2 GPU selama 10 menit pertama lalu menganggur, penjadwalan yang baik memakai preemption berprioritas atau time-slicing — bukan FIFO buta. Validasi konfigurasi sebelum apply: kubectl describe node untuk melihat kapasitas yang dialokasikan, dan nvidia-smi di dalam pod untuk memastikan GPU yang terlihat memang yang diminta.",
      ],
      formula: String.raw`\text{requests} = \text{limits (GPU)} \qquad \text{gang: semua worker jalan, atau tidak sama sekali}`,
      formulaNote: "GPU integer, tidak bisa overcommit. Time-slicing berbagi compute, bukan isolasi memori.",
      tasks: [
        { id: "t1", text: "Hitung `terjadwal` (nama pod yang dapat GPU, FIFO) dan `menunggu` (yang pending)" },
        { id: "t2", text: "Hitung `utilisasi_pct` (persen GPU terpakai)" },
      ],
      expected: "terjadwal=fraud-a,fraud-b,nlp-c  menunggu=vision-d,batch-e  utilisasi_pct=100",
      hints: [
        "Node punya 4 GPU; proses pod berurutan (FIFO).",
        "fraud-a 1, fraud-b 1, nlp-c 2 → total 4, penuh.",
        "vision-d 1 dan batch-e 2 tidak kebagian — pending.",
      ],
      code: {
        starter: `# Simulasi FIFO scheduler: node 4 GPU, pod datang berurutan.\nkapasitas = 4\npod = [("fraud-a", 1), ("fraud-b", 1), ("nlp-c", 2), ("vision-d", 1), ("batch-e", 2)]\n\n# TULIS KODEMU: siapa terjadwal, siapa menunggu, utilisasi.\nterpakai = 0\nterjadwal = []\nmenunggu = []\nfor nama, gpu in pod:\n    if terpakai + gpu <= kapasitas:\n        terpakai += gpu\n        terjadwal.append(nama)\n    else:\n        menunggu.append(nama)\nutilisasi_pct = \n\nprint(f"terjadwal={','.join(terjadwal)}  menunggu={','.join(menunggu)}  utilisasi_pct={utilisasi_pct}")`,
        lockLines: 3,
        solution: `# Simulasi FIFO scheduler: node 4 GPU, pod datang berurutan.\nkapasitas = 4\npod = [("fraud-a", 1), ("fraud-b", 1), ("nlp-c", 2), ("vision-d", 1), ("batch-e", 2)]\n\n# TULIS KODEMU: siapa terjadwal, siapa menunggu, utilisasi.\nterpakai = 0\nterjadwal = []\nmenunggu = []\nfor nama, gpu in pod:\n    if terpakai + gpu <= kapasitas:\n        terpakai += gpu\n        terjadwal.append(nama)\n    else:\n        menunggu.append(nama)\nutilisasi_pct = terpakai * 100 // kapasitas\n\nprint(f"terjadwal={','.join(terjadwal)}  menunggu={','.join(menunggu)}  utilisasi_pct={utilisasi_pct}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "terjadwal=fraud-a,fraud-b,nlp-c", label: "Terjadwal: fraud-a, fraud-b, nlp-c", msg: "1+1+2 = 4 GPU — node penuh." },
          { kind: "stdout_matches", task: "t1", pattern: "menunggu=vision-d,batch-e", label: "Menunggu: vision-d, batch-e", msg: "Tidak ada GPU tersisa; tanpa gang scheduling atau preemption, mereka antre." },
          { kind: "equal", task: "t2", name: "utilisasi_pct", value: 100, tol: 1, label: "`utilisasi_pct` = 100%", msg: "4 dari 4 GPU terpakai — tetapi utilisasi alokasi bukan utilisasi kerja; cek DCGM untuk pemakaian nyatanya." },
          { kind: "stdout_matches", task: "t2", pattern: "terjadwal=fraud-a,fraud-b,nlp-c\\s+menunggu=vision-d,batch-e\\s+utilisasi_pct=100", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Job training 4-worker: 3 worker terjadwal, 1 pending karena GPU habis. Masalahnya dan solusinya?",
          options: [
            { text: "Tanpa gang scheduling, 3 GPU menganggur menunggu worker ke-4 — pakai Volcano/KAI gang scheduling", why: "Tepat: gang = semua atau tidak sama sekali; tanpa itu, penjadwalan parsial membuang GPU.", correct: true },
            { text: "Naikkan limits GPU tiap worker jadi 2 — biar lebih cepat selesai", why: "Salah: menaikkan permintaan memperparah antrean, bukan mengatasinya." },
            { text: "Hapus toleration — pod akan pindah ke node CPU", why: "Salah: pod GPU di node CPU tidak punya GPU; toleration bukan penyebab antrean." },
            { text: "Ini normal — 3 worker bisa training sambil menunggu yang keempat", why: "Salah: distributed training sinkron butuh semua worker; 3 worker menunggu = 3 GPU menganggur." },
          ],
        },
      ],
      reference: "GPU: requests = limits, toleration + nodeAffinity, time-slicing berbagi compute (bukan memori), Volcano/KAI untuk gang scheduling + queue, DCGM untuk utilisasi nyata.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Ukur utilisasi & antrean dulu; scheduler sering mengalahkan belanja hardware.",
        "Pod/Deployment/Job/CronJob; requests = janji alokasi, limits = pagar.",
        "GPU scheduling = bin packing; waspada fragmentasi; spot + checkpoint untuk training.",
        "K8s butuh operator; tanpa itu pilih managed/serverless.",
        "Hybrid cerdas: tiap beban di rumah termurahnya.",
      ],
      next: { label: "MLOps12 — Capstone: Pipeline MLOps End-to-End", href: "/v2/learn/mlops12-capstone" },
      quiz: [
        {
          q: "Kasus MajuML: utilisasi 30%, antrean berminggu-minggu. Diagnosis tepat?",
          options: [
            { text: "Kurang GPU — sewa 16 lagi", why: "Kebutuhan riil 12 GPU dari 32 yang ada. Belanja = mengobati gejala." },
            { text: "Alokasi manual via spreadsheet — butuh scheduler otomatis", why: "GPU menganggur SEMENTARA job antre = kegagalan alokasi, bukan kapasitas. K8s: 30% → 78%.", correct: true },
            { text: "GPU-nya terlalu lambat", why: "Kecepatan GPU tidak relevan dengan antrean alokasi." },
            { text: "Engineer-nya kurang", why: "Bukan jumlah orang — tapi tidak adanya sistem." },
          ],
        },
        {
          q: "Pod training meminta requests 1 GPU. Bisakah ia memakai 4 GPU?",
          options: [
            { text: "Tidak — di bawah device-plugin K8s, pod hanya mendapat GPU yang dialokasikan (requests = limits untuk GPU); bila butuh 4, minta 4 sejak awal", why: "Tepat: GPU tidak bisa dipakai melebihi alokasi — bertentangan dengan prose lesson sendiri 'requests dan limits GPU harus sama'. Yang BISA terjadi adalah berebut resource lain (bandwidth PCIe, CPU, memori) — itu noisy neighbor yang sebenarnya.", correct: true },
            { text: "Ya, selama node punya sisa GPU", why: "Salah: sisa GPU di node tidak otomatis bisa dipakai pod — device plugin hanya memasang GPU yang dialokasikan ke pod itu." },
            { text: "Ya, bila limits tidak diset", why: "Salah: untuk GPU, limits wajib sama dengan requests; tanpa limits pun pod tetap hanya mendapat GPU yang dialokasikan." },
            { text: "Scheduler otomatis menambah GPU", why: "Salah: scheduler tidak menambah hardware — ia hanya menempatkan." },
          ],
        },
        {
          q: "Lab: utilisasi 91% tapi 6 job tak terjadwal. Fenomena apa?",
          options: [
            { text: "Scheduler-nya bug", why: "First-fit bekerja benar; ini keterbatasan matematis bin packing." },
            { text: "Fragmentasi: sisa kecil tersebar tak muat job manapun", why: "0+1+1+1 GPU di 4 node ≠ 1 slot 3-GPU. Utilisasi tinggi tidak menjamin semua job muat.", correct: true },
            { text: "Job-nya terlalu besar", why: "Job 3–6 GPU wajar; node 8 GPU wajar. Masalahnya penempatan, bukan ukuran." },
            { text: "Node-nya kurang", why: "Total sisa 3 GPU < kebutuhan 25 GPU job antre — TAPI job 3-GPU pun tak muat karena tersebar. Itu fragmentasi." },
          ],
        },
        {
          q: "Training 100 epoch di spot instance. Praktik wajib?",
          options: [
            { text: "Tidak ada — spot sama seperti on-demand", why: "Spot bisa ditarik kapan saja; on-demand tidak." },
            { text: "Checkpoint rutin tiap N epoch agar bisa lanjut saat ditarik", why: "Spot + checkpoint = hemat 70% dengan risiko terkendali. Tanpa checkpoint = judi.", correct: true },
            { text: "Jangan pakai spot untuk training", why: "Justru training ber-checkpoint adalah kasus TERBAIK untuk spot." },
            { text: "Pakai spot hanya di malam hari", why: "Penarikan bisa kapan saja; waktu tidak menjamin." },
          ],
        },
        {
          q: "Tim 3 orang, training 2x/minggu, tanpa yang mau jadi operator klaster. Rekomendasi?",
          options: [
            { text: "K8s self-managed — biar keren", why: "'Keren' bukan argumen infra. Tanpa operator, klaster = bom waktu." },
            { text: "Managed training/serving atau serverless — nol operasi", why: "Skala dan SDM tidak membenarkan K8s self-managed. Bayar untuk tidak mengurus.", correct: true },
            { text: "Beli server fisik sendiri", why: "Lebih buruk: capex + tetap butuh operator." },
            { text: "Berhenti pakai ML", why: "Bebannya wajar; yang tidak wajar hanya pilihan infrastrukturnya." },
          ],
        },
        {
          q: "Retrain produksi HARUS selesai sebelum jam 6 pagi (SLA ketat). GPU spot 70% lebih murah tapi preempt 15%. Strategi TEPAT?",
          options: [
            { text: "100% spot — hemat 70%, preempt tinggal ulang", why: "Mengulang = molor = melanggar SLA jam 6 pagi. Penghematan 70% tidak menutup denda kontrak / keputusan bisnis yang tertunda karena model basi." },
            { text: "Spot dengan fallback otomatis ke on-demand setelah 2x preempt", why: "Tepat — dengan catatan: fallback MENGURANGI risiko, bukan MENJAMIN SLA: on-demand pun bisa kehabisan kapasitas/antre, dan 2× preempt + waktu migrasi bisa tetap melanggar jam 6 pagi. Fallback = mitigasi, bukan jaminan — untuk SLA keras, sisakan buffer waktu. Ekonomi + mitigasi.", correct: true },
            { text: "100% on-demand — jangan pernah pakai spot untuk produksi", why: "Terlalu konservatif: strategi campuran menghemat ~40% dengan risiko terkendali. Menolak spot sepenuhnya = membuang Rp129 juta/bulan tanpa alasan." },
            { text: "Spot tanpa checkpoint agar lebih cepat", why: "Tanpa checkpoint, satu preempt = ulang dari NOL = hampir pasti melanggar SLA. Ini kombinasi terburuk: murah TAPI tidak pernah selesai tepat waktu." },
          ],
        },
      ],
    },
  ],
};
