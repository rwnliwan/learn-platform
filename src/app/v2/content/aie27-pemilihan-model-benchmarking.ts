import type { V2Lesson } from "../lib/types";

export const aie27: V2Lesson = {
  slug: "aie27-pemilihan-model-benchmarking",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE27 — Pemilihan Model & Benchmarking: Frontier Biaya-Kualitas",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model termahal yang kalah — dan model termurah yang menang",
      prose: [
        "NusaBank memilih model untuk chatbot CS dari leaderboard: Model C (kualitas 91, $5,00 per 1.000 token) terlihat 'terbaik'. Setelah sebulan, tagihannya $25.000 per bulan untuk 10.000 query/bulan — dan evaluasi internal menunjukkan Model B (kualitas 88, $2,00) hanya kalah 3 poin tetapi berharga $10.000/bulan. Lebih mengejutkan: Model A (kualitas 82, $0,50) dengan prompt yang baik mencapai 86 di tugas spesifik NusaBank — mendekati B di domain itu (86 vs 88), tidak mengalahkannya, dengan selisih 2 poin untuk penghematan $7.500/bulan dan biaya $2.500/bulan. Leaderboard umum tidak mengukur tugasmu; hanya evaluasimu sendiri yang bisa.",
        "Pemilihan model adalah keputusan frontier biaya-kualitas: tiap model punya harga dan kualitas — dan yang termurah per poin kualitas belum tentu yang tepat bila syaratmu adalah kualitas minimum. Lesson ini mengajarkan benchmarking metodis: evaluasi sendiri, frontier, dan biaya per poin kualitas.",
        "Setelah lesson ini kamu bisa: (1) menghitung biaya bulanan tiap model; (2) menghitung biaya per poin kualitas; (3) menggambar frontier dan menemukan model yang didominasi; (4) merancang evaluasi sendiri (golden set + blind test); (5) memutuskan kapan model kecil + prompt menang atas model besar.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AIE4 mengajarkan evaluasi LLM (golden set, judge) dan AIE16 mengajarkan pemilihan embedding — tetapi tidak ada lesson pemilihan MODEL & benchmarking metodis (0 hit 'leaderboard/frontier/pemilihan model' di track). Lesson ini membangunnya: frontier biaya-kualitas, biaya per poin, dan evaluasi domain-sendiri, dengan lab yang menghitung ketiganya.",
      },
      reference: "10.000 query/bulan x 500 token: A $2.500 (82); B $10.000 (88); C $25.000 (91). B vs A: $1.250 per poin.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu memilih model dengan kalkulator dan evaluasimu sendiri — bukan dengan leaderboard orang lain.",
        "(1) Menghitung biaya bulanan dari volume dan tarif;",
        "(2) Menghitung biaya per poin kualitas tiap model;",
        "(3) Mengidentifikasi model yang didominasi di frontier;",
        "(4) Merancang evaluasi domain-sendiri (golden set + blind);",
        "(5) Menjelaskan kapan model kecil + prompt mengalahkan model besar.",
      ],
      tasks: [],
    },
    {
      id: "frontier",
      eyebrow: "Langkah 3 · Teori",
      title: "Frontier biaya-kualitas: siapa yang didominasi",
      prose: [
        "Hitung biaya bulanan untuk 10.000 query, masing-masing 500 token = 5.000.000 token = 5.000 unit 1.000-token. Model A ($0,50): 5.000 x 0,50 = $2.500, kualitas 82. Model B ($2,00): $10.000, kualitas 88. Model C ($5,00): $25.000, kualitas 91. Biaya per poin kualitas: A = 0,50/82 = $0,0061; B = 2,00/88 = $0,0227; C = 5,00/91 = $0,0549. A 9x lebih murah per poin daripada C.",
        "Kenaikan B vs A: +6 poin kualitas untuk +$7.500 — $1.250 per poin tambahan. Kenaikan C vs B: +3 poin untuk +$15.000 — $5.000 per poin tambahan. Diminishing return yang brutal: poin ke-89 sampai ke-91 berharga 4x lipat poin ke-83 sampai ke-88. Bila syarat bisnismu adalah kualitas 85, B adalah pilihan rasional; bila syaratmu 90, C terpaksa — tetapi tanyakan dulu: apakah 90 di leaderboard sama dengan 90 di tugasmu?",
        "Frontier adalah garis model yang tidak didominasi: model didominasi bila ada model lain yang lebih murah DAN lebih baik. Di sini ketiganya ada di frontier (tiap kenaikan kualitas berharga lebih mahal) — tetapi bila muncul Model D (kualitas 89, $1,50 = $7.500), ia mendominasi B (lebih murah dan lebih baik) dan B keluar dari frontier. Periksa frontier tiap kuartal: model baru mendominasi model lama dengan cepat.",
      ],
      tasks: [],
      note: {
        title: "Kualitas leaderboard bukan kualitasmu",
        body: "Leaderboard memakai tugas umum (MMLU, HumanEval) yang mungkin tidak berkorelasi dengan tugasmu. Model yang 91 di MMLU bisa 78 di dokumen hukum Indonesia — dan model 82 di MMLU bisa 86 di sana dengan prompt yang baik. Satu-satunya angka kualitas yang sah adalah dari golden set-MU (AIE4). Jangan membeli model berdasarkan skor orang lain.",
      },
      reference: "A $2.500/82; B $10.000/88; C $25.000/91. B vs A $1.250/poin; C vs B $5.000/poin.",
    },
    {
      id: "evaluasi-sendiri",
      eyebrow: "Langkah 4 · Teori",
      title: "Benchmarking sendiri: golden set + blind test",
      prose: [
        "Evaluasi sendiri punya tiga komponen. Pertama, golden set: 200-500 contoh dari tugas NYATA-mu (bukan contoh demo) dengan jawaban yang disepakati manusia — termasuk kasus tepi dan kasus sulit. Kedua, blind test: penilai tidak tahu model mana yang menjawab (hindari bias merek — 'jawaban Model C pasti lebih baik karena mahal'). Ketiga, metrik ganda: kualitas (akurasi/judge) + biaya + latensi — model yang menang kualitas tetapi latensinya 3x mungkin gagal SLO.",
        "Jalankan evaluasi pada kandidat yang masuk akal saja (2-4 model, bukan 20) — tiap evaluasi butuh waktu dan biaya. Dan ulangi tiap kuartal: model di-update vendor tanpa pemberitahuan (MLOps19), dan kualitasnya bisa berubah diam-diam. Evaluasi yang dijalankan sekali adalah foto; evaluasi berkala adalah CCTV.",
        "Model kecil + prompt yang baik sering mengalahkan model besar + prompt asal-asalan. Di kasus NusaBank, A (82) dengan prompt yang dirancang (AIE25: persona + template + few-shot) mencapai 86 di tugas spesifik — mengalahkan B (88) yang dipakai dengan prompt seadanya? Tidak — B tetap 88. Tetapi A+prompt (86) vs B+prompt-seadanya (88): selisih 2 poin untuk penghematan $7.500/bulan. Bila syaratmu 85, A+prompt menang secara ekonomi. Pelajarannya: optimasi prompt DULU (murah), ganti model KEMUDIAN (mahal).",
      ],
      tasks: [],
      note: {
        title: "Blind test mencegah bias harga",
        body: "Penilai manusia cenderung memberi skor lebih tinggi pada jawaban yang mereka TAHU dari model mahal — bias yang sama dengan wine tasting. Blind test (acak urutan, sembunyikan identitas model) adalah satu-satunya cara membandingkan dengan jujur. Bila timmu menolak blind test, mereka tidak sedang mengevaluasi — mereka sedang membenarkan pilihan yang sudah dibuat.",
      },
      reference: "Golden set 200-500 contoh nyata; blind test; evaluasi tiap kuartal.",
    },
    {
      id: "lab-benchmark",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: biaya bulanan dan biaya per poin kualitas",
      prose: [
        "Lab ini menghitung frontier biaya-kualitas dari angka mentah: biaya bulanan tiga model dan biaya per poin tambahan B vs A.",
        "Hitung dulu di kepala. Unit 1.000-token per bulan: 10.000 x 500 / 1.000 = 5.000. A: 5.000 x 0,50 = $2.500. B: 5.000 x 2,00 = $10.000. C: 5.000 x 5,00 = $25.000. Biaya per poin B vs A: (10.000 - 2.500) / (88 - 82) = 7.500 / 6 = $1.250.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: biaya_a, biaya_b, biaya_c, per_poin, termurah (1 bila A termurah per bulan, 0 bila tidak). Lima angka ini adalah neraca pemilihan model — dengan ini 'model terbaik' menjadi klaim yang bisa diaudit.",
        "Setelah lolos, coba eksperimen: naikkan volume menjadi 100.000 query dan lihat A menjadi $25.000 vs C $250.000 — lalu tanyakan: pada volume berapa kamu HARUS pindah ke model kecil + prompt yang baik?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_a`, `biaya_b`, `biaya_c` bulanan" },
        { id: "t2", text: "Hitung `per_poin` B vs A dan tentukan `termurah`" },
      ],
      expected: "biaya_a=2500.0\nbiaya_b=10000.0\nbiaya_c=25000.0\nper_poin=1250.0\ntermurah=1",
      hints: [
        "Unit = query x token per query / 1.000.",
        "Biaya = unit x tarif per 1.000 token.",
        "Per poin = (biaya_b - biaya_a) / (kualitas_b - kualitas_a).",
      ],
      code: {
        starter: `# Frontier biaya-kualitas: biaya bulanan + per poin.\nquery, token_per_query = 10_000, 500\n# (tarif per 1.000 token, kualitas)\nmodel_a = (0.50, 82)\nmodel_b = (2.00, 88)\nmodel_c = (5.00, 91)\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nbiaya_a = \nbiaya_b = \nbiaya_c = \nper_poin = \ntermurah = \n\nprint(f"biaya_a={biaya_a}")\nprint(f"biaya_b={biaya_b}")\nprint(f"biaya_c={biaya_c}")\nprint(f"per_poin={per_poin}")\nprint(f"termurah={termurah}")`,
        lockLines: 5,
        solution: `# Frontier biaya-kualitas: biaya bulanan + per poin.\nquery, token_per_query = 10_000, 500\n# (tarif per 1.000 token, kualitas)\nmodel_a = (0.50, 82)\nmodel_b = (2.00, 88)\nmodel_c = (5.00, 91)\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nunit = query * token_per_query / 1000\nbiaya_a = unit * model_a[0]\nbiaya_b = unit * model_b[0]\nbiaya_c = unit * model_c[0]\nper_poin = (biaya_b - biaya_a) / (model_b[1] - model_a[1])\ntermurah = 1 if biaya_a < biaya_b and biaya_a < biaya_c else 0\n\nprint(f"biaya_a={biaya_a}")\nprint(f"biaya_b={biaya_b}")\nprint(f"biaya_c={biaya_c}")\nprint(f"per_poin={per_poin}")\nprint(f"termurah={termurah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_a", value: 2500.0, tol: 1e-9, label: "`biaya_a` seharusnya 2500.0", msg: "5.000 x 0,50 = $2.500." },
          { kind: "equal", task: "t1", name: "biaya_b", value: 10000.0, tol: 1e-9, label: "`biaya_b` seharusnya 10000.0", msg: "5.000 x 2,00 = $10.000." },
          { kind: "equal", task: "t1", name: "biaya_c", value: 25000.0, tol: 1e-9, label: "`biaya_c` seharusnya 25000.0", msg: "5.000 x 5,00 = $25.000." },
          { kind: "equal", task: "t2", name: "per_poin", value: 1250.0, tol: 1e-9, label: "`per_poin` seharusnya 1250.0", msg: "7.500/6 = $1.250 per poin." },
          { kind: "equal", task: "t2", name: "termurah", value: 1, tol: 1e-9, label: "`termurah` seharusnya 1", msg: "A termurah per bulan." },
        ],
      },
      reference: "A $2.500; B $10.000; C $25.000; $1.250 per poin B vs A.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: model apa, kapan",
      prose: [
        "Skenario 1 — Syarat kualitas 85, volume besar. → Model A + prompt yang dioptimasi. Alasan: 86 di tugasmu dengan biaya $2.500/bulan hampir menyamai 88 dengan $10.000/bulan — selisih 2 poin untuk penghematan $7.500/bulan; bila syaratmu 85, A memenuhi syarat lebih murah.",
        "Skenario 2 — Syarat kualitas 90, kesalahan berbiaya besar. → Model C. Alasan: 3 poin terakhir mahal, tetapi kesalahan lebih mahal lagi.",
        "Skenario 3 — Tugas baru, belum ada golden set. → Jangan pilih model dulu; bangun golden set 200 contoh. Alasan: memilih tanpa evaluasi sendiri adalah menebak dengan tagihan.",
        "Skenario 4 — Model baru muncul dengan kualitas 89 dan harga $1,50. → Evaluasi dan ganti B bila lolos blind test. Alasan: frontier bergerak; model yang didominasi harus keluar.",
        "Skenario 5 — Latensi SLO ketat (di bawah 500 ms). → Model kecil, walau kualitas 2 poin lebih rendah. Alasan: model yang lambat gagal SLO — kualitasnya tidak relevan bila tidak pernah sampai ke pengguna tepat waktu.",
        "Aturan praktis: optimasi prompt dulu, ganti model kemudian; evaluasi sendiri selalu; review frontier tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Routing: jangan satu model untuk semua",
        body: "Tugas mudah (klasifikasi sederhana) ke model murah; tugas sulit (penalaran kompleks) ke model mahal — routing cerdas (LLMOps14) bisa memangkas 60-70 persen biaya tanpa menurunkan kualitas agregat. Pemilihan model bukan satu keputusan — ia kebijakan routing per jenis tugas.",
      },
      reference: "Optimasi prompt dulu; evaluasi sendiri; frontier tiap kuartal; routing per tugas.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "A $2.500/82; B $10.000/88; C $25.000/91 per bulan.",
        "B vs A: $1.250 per poin; C vs B: $5.000 per poin.",
        "Golden set 200-500 contoh nyata + blind test.",
        "Model kecil + prompt baik bisa mencapai 86 di tugas spesifik.",
        "Optimasi prompt dulu, ganti model kemudian; frontier tiap kuartal.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "10.000 query x 500 token. Model B $2,00/1.000 token. Berapa biaya bulanannya?",
          options: [
            { text: "$10.000", why: "Tepat: 5.000 unit x $2,00 = $10.000.", correct: true },
            { text: "$2.000 — 10.000 x 0,20", why: "Salah: tarif per 1.000 token, bukan per query; unitnya 5.000." },
            { text: "$20.000 — tarif dikali token mentah", why: "Salah: lupa membagi token dengan 1.000." },
            { text: "$1.000 — 10.000 query x $0,10", why: "Salah: itu tarif yang salah; yang benar $2,00 per 1.000 token." },
          ],
        },
        {
          q: "B vs A: +6 poin untuk +$7.500. Berapa biaya per poin tambahan?",
          options: [
            { text: "$1.250", why: "Tepat: 7.500/6 = 1.250.", correct: true },
            { text: "$7.500 — total selisihnya", why: "Salah: itu total, bukan per poin." },
            { text: "$6 — jumlah poinnya", why: "Salah: itu penyebut, bukan hasil." },
            { text: "$45.000 — 7.500 x 6", why: "Salah: per poin adalah BAGI, bukan kali." },
          ],
        },
        {
          q: "Model D muncul: kualitas 89, $1,50/1.000 token. Apa yang terjadi pada Model B?",
          options: [
            { text: "B tetap di frontier — kualitasnya tertinggi kedua", why: "Salah: D lebih murah DAN lebih baik dari B — B didominasi dan keluar dari frontier." },
            { text: "B didominasi D dan keluar dari frontier", why: "Tepat: lebih murah + lebih baik = dominasi.", correct: true },
            { text: "Tidak ada efek — D belum diuji", why: "Salah: bila D lolos blind test di golden set-mu, dominasinya nyata." },
            { text: "D didominasi B karena lebih murah", why: "Salah: terbalik — murah + baik adalah dominasi, bukan kelemahan." },
          ],
        },
        {
          q: "Mengapa evaluasi harus blind test?",
          options: [
            { text: "Agar penilai tidak tahu model mana yang menjawab — menghindari bias merek/harga", why: "Tepat: penilai cenderung memuji jawaban model mahal.", correct: true },
            { text: "Agar model tidak tahu sedang diuji", why: "Salah: model tidak peduli; yang bias adalah PENILAI manusia." },
            { text: "Agar evaluasi lebih cepat", why: "Salah: blind test tidak lebih cepat; ia lebih jujur." },
            { text: "Tidak perlu — penilai profesional tidak bias", why: "Salah: bias harga/merek memengaruhi semua orang, termasuk profesional." },
          ],
        },
        {
          q: "Model A 82 di leaderboard, tetapi 86 di tugasmu dengan prompt yang baik. Syaratmu 85. Apa yang benar?",
          options: [
            { text: "Tetap pilih C (91) — leaderboard tidak pernah salah", why: "Salah: leaderboard tidak mengukur tugasmu; A+prompt memenuhi syarat dengan $2.500 vs $25.000." },
            { text: "Pilih A + prompt yang dioptimasi — memenuhi syarat dengan biaya terendah", why: "Tepat: optimasi prompt dulu, ganti model kemudian.", correct: true },
            { text: "Pilih B — jalan tengah yang aman", why: "Salah: 'jalan tengah' tanpa hitungan adalah tebakan; A memenuhi syarat lebih murah." },
            { text: "Jangan pakai model apa pun — 86 masih di bawah 91", why: "Salah: syaratmu 85, bukan 91; mengejar skor tertinggi tanpa syarat adalah pemborosan." },
          ],
        },
      ],
    },
  ],
};
