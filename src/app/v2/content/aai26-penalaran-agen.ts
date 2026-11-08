import type { V2Lesson } from "../lib/types";

export const aai26: V2Lesson = {
  slug: "aai26-penalaran-agen",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI26 — Penalaran Agen: CoT, ToT & Self-Consistency",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen yang menjawab benar karena menebak — dan agen yang menjawab benar karena berpikir",
      prose: [
        "Agen analisis NusaBank ditanya: 'Berapa total denda keterlambatan 42 nasabah?' Agen pertama menjawab langsung: 'Rp38 juta' — salah (yang benar Rp42 juta), tanpa jejak cara ia menghitung. Agen kedua memakai chain-of-thought: ia menulis langkahnya (42 nasabah x rata-rata denda Rp1 juta = Rp42 juta), lalu self-consistency: ia mengulang 5 kali dengan penalaran berbeda — 3 kali mendapat 42, 1 kali 38, 1 kali 41 — dan memilih 42 (mayoritas 3/5, keyakinan 60 persen). Akurasi tugas penalaran naik dari 68 persen (langsung) menjadi 81 persen (CoT) — naik 13 poin, hanya dengan meminta model 'berpikir dulu'.",
        "Penalaran agen bukan 'model yang lebih pintar' — ia teknik yang membuat model menggunakan kepintarannya dengan benar: memecah masalah, menjelajahi alternatif, dan memilih jawaban yang paling konsisten. Lesson ini mengajarkan tiga teknik: CoT, ToT, dan self-consistency — dengan angka yang dihitung.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan CoT dan kapan ia membantu; (2) menghitung voting mayoritas self-consistency; (3) menghitung node yang dievaluasi ToT; (4) membedakan kapan penalaran membantu dan kapan ia hanya membuang token; (5) merancang verifikasi atas penalaran agen.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson penalaran agen di track AAI (0 hit 'chain-of-thought/tree-of-thought/self-consistency' di AAI2 dan AAI7). AAI22 mengajarkan pola desain (ReAct, reflection, plan-and-execute) — tetapi bukan teknik penalaran di dalam langkah (CoT/ToT/self-consistency). Lesson ini membangun tekniknya, dengan lab yang menghitung voting mayoritas dan node ToT.",
      },
      reference: "CoT: 68 menjadi 81 persen (+13 poin); self-consistency 3/5 = 60 persen; ToT 27 node maks, 9 dievaluasi.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membuat agen berpikir — dan memeriksa pikirannya.",
        "(1) Menjelaskan chain-of-thought dan zero-shot CoT ('berpikir langkah demi langkah');",
        "(2) Menghitung voting mayoritas dan keyakinan self-consistency;",
        "(3) Menghitung node ToT yang dievaluasi dengan beam search;",
        "(4) Menjelaskan kapan penalaran membantu vs membuang token;",
        "(5) Merancang verifikasi: periksa langkah, bukan hanya jawaban.",
      ],
      tasks: [],
    },
    {
      id: "cot",
      eyebrow: "Langkah 3 · Teori",
      title: "Chain-of-thought: berpikir langkah demi langkah",
      prose: [
        "CoT meminta model menulis langkah penalaran sebelum jawaban akhir. Zero-shot CoT sesederhana menambahkan 'Mari berpikir langkah demi langkah' — tanpa contoh. Few-shot CoT memberi 2-3 contoh penalaran lengkap. Efeknya terukur: tugas penalaran (aritmetika, logika, perencanaan) naik dari 68 persen menjadi 81 persen — +13 poin. Mekanismenya: menulis langkah memaksa model menghitung bertahap (bukan menebak jawaban akhir sekaligus) dan memberi ruang untuk mengoreksi diri di tengah jalan.",
        "Kapan CoT membantu: masalah multi-langkah (hitung denda 42 nasabah), masalah yang butuh dekomposisi (rencana 5 langkah), dan masalah yang jawabannya bergantung pada langkah perantara. Kapan CoT TIDAK membantu: tugas satu langkah (klasifikasi sentimen — tidak ada yang perlu diurai), tugas yang jawabannya adalah hafalan (ibu kota negara), dan tugas kreatif (tidak ada 'langkah benar'). CoT pada tugas yang tidak butuh penalaran hanya membuang token dan menambah peluang halusinasi di tengah rantai.",
        "Bahaya CoT: penalaran yang SALAH tetapi meyakinkan. Model bisa menulis langkah yang rapi menuju jawaban yang salah — dan manusia yang membaca langkahnya akan percaya karena 'penalarannya masuk akal'. Obatnya: verifikasi langkah secara independen (hitung ulang angka di langkah itu dengan tool — AAI3) dan self-consistency (langkah berikut). Jangan pernah menerima jawaban HANYA karena penalarannya terlihat rapi.",
      ],
      tasks: [],
      note: {
        title: "CoT bukan penalaran yang sebenarnya",
        body: "Model tidak 'berpikir' seperti manusia — ia menghasilkan teks yang MENYERUPAI penalaran. Bedanya penting: teks penalaran bisa salah di langkah 2 tetapi tetap sampai ke jawaban benar (keberuntungan), atau benar di semua langkah tetapi salah menyimpulkan. Perlakukan CoT sebagai JEJAK yang bisa diaudit — bukan sebagai bukti kebenaran.",
      },
      reference: "CoT: 68 menjadi 81 persen (+13 poin) pada tugas penalaran.",
    },
    {
      id: "tot-selfconsistency",
      eyebrow: "Langkah 4 · Teori",
      title: "ToT & self-consistency: menjelajah dan memilih",
      prose: [
        "Tree-of-Thoughts (ToT): bila CoT adalah satu rantai, ToT adalah pohon — di tiap langkah, hasilkan 3 cabang alternatif, nilai tiap cabang, simpan yang terbaik, buang sisanya (beam search). Hitungannya: 3 cabang x kedalaman 3 = 27 node maksimum; dengan beam yang menyimpan 3 terbaik per level dan pruning, yang benar-benar dievaluasi 9 node. ToT menang atas CoT bila masalah butuh backtracking ('jalan ini buntu, coba jalan lain') — perencanaan, puzzle, dan strategi. Harganya: 3-9x token CoT. Jangan pakai ToT untuk soal yang CoT sudah menyelesaikan.",
        "Self-consistency: jalankan CoT yang sama 5 kali (sampling dengan temperature), lalu voting mayoritas. Contoh: jawaban [42, 42, 38, 42, 41] — 42 muncul 3 kali, keyakinan 3/5 = 60 persen. Pilih 42. Keyakinan 60 persen adalah sinyal: cukup untuk tugas biasa, tidak cukup untuk keputusan finansial (butuh 80 persen atau verifikasi tool). Self-consistency mengubah satu tebakan menjadi distribusi — dan distribusi bisa dibaca risikonya.",
        "Kombinasi yang benar: CoT untuk langkah, ToT untuk masalah yang butuh backtracking, self-consistency untuk keyakinan. Ketiganya adalah teknik PROMPT dan SAMPLING — bukan model baru. Artinya: agenmu hari ini sudah bisa memakai ketiganya tanpa training ulang. Yang dibutuhkan adalah orkestrasi (AAI22) + verifikasi (tool + manusia).",
      ],
      tasks: [],
      note: {
        title: "Keyakinan rendah adalah informasi, bukan kegagalan",
        body: "Voting 3/5 (60 persen) bukan 'gagal' — ia sinyal untuk eskalasi: verifikasi dengan tool (hitung ulang dengan kalkulator) atau tanyakan manusia. Agen yang melaporkan 'saya 60 persen yakin' lebih berguna daripada agen yang menjawab 42 dengan keyakinan palsu 100 persen. Rancang agenmu untuk melaporkan keyakinan, bukan menyembunyikannya.",
      },
      reference: "ToT: 27 node maks, 9 dievaluasi. Self-consistency 3/5 = 60 persen.",
    },
    {
      id: "lab-penalaran",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: voting mayoritas, keyakinan, dan node ToT",
      prose: [
        "Lab ini menghitung mesin penalaran agen dari angka mentah: voting self-consistency, keyakinan, kenaikan CoT, dan node ToT.",
        "Hitung dulu di kepala. Voting [42, 42, 38, 42, 41]: mayoritas 42, muncul 3 kali, keyakinan 3/5 = 0,6 (60 persen). Kenaikan CoT: 81 - 68 = 13 poin. ToT: 3 cabang x kedalaman 3 = 27 node maksimum; dengan beam + pruning, 9 dievaluasi.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: mayoritas, keyakinan, kenaikan, node_maks, node_evaluasi. Lima angka ini adalah laporan penalaran — dengan ini 'agen berpikir' menjadi klaim yang bisa diukur.",
        "Setelah lolos, coba eksperimen: ubah voting menjadi [42, 38, 41, 39, 40] (semua berbeda) dan lihat tidak ada mayoritas — lalu tanyakan: apa yang harus dilakukan agen bila tidak ada jawaban yang menang?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mayoritas` dan `keyakinan` dari voting [42, 42, 38, 42, 41]" },
        { id: "t2", text: "Hitung `kenaikan` CoT (81 - 68) dan `node_maks` ToT" },
        { id: "t3", text: "Hitung `node_evaluasi` ToT dengan beam + pruning" },
      ],
      expected: "mayoritas=42\nkeyakinan=0.6\nkenaikan=13\nnode_maks=27\nnode_evaluasi=9",
      hints: [
        "Mayoritas = nilai yang paling sering muncul; keyakinan = jumlahnya / 5.",
        "Kenaikan = akurasi CoT - akurasi langsung.",
        "Node maks = cabang ^ kedalaman; dievaluasi = 9 (3 per level x 3 level).",
      ],
      code: {
        starter: `# Mesin penalaran agen: voting + ToT.\nvoting = [42, 42, 38, 42, 41]\nakurasi_langsung, akurasi_cot = 68, 81\ncabang, kedalaman = 3, 3\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nmayoritas = \nkeyakinan = \nkenaikan = \nnode_maks = \nnode_evaluasi = \n\nprint(f"mayoritas={mayoritas}")\nprint(f"keyakinan={keyakinan}")\nprint(f"kenaikan={kenaikan}")\nprint(f"node_maks={node_maks}")\nprint(f"node_evaluasi={node_evaluasi}")`,
        lockLines: 3,
        solution: `# Mesin penalaran agen: voting + ToT.\nvoting = [42, 42, 38, 42, 41]\nakurasi_langsung, akurasi_cot = 68, 81\ncabang, kedalaman = 3, 3\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nmayoritas = max(set(voting), key=voting.count)\nkeyakinan = voting.count(mayoritas) / len(voting)\nkenaikan = akurasi_cot - akurasi_langsung\nnode_maks = cabang ** kedalaman\nnode_evaluasi = 3 * kedalaman\n\nprint(f"mayoritas={mayoritas}")\nprint(f"keyakinan={keyakinan}")\nprint(f"kenaikan={kenaikan}")\nprint(f"node_maks={node_maks}")\nprint(f"node_evaluasi={node_evaluasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mayoritas", value: 42, tol: 1e-9, label: "`mayoritas` seharusnya 42", msg: "42 muncul 3 kali — terbanyak." },
          { kind: "equal", task: "t1", name: "keyakinan", value: 0.6, tol: 1e-9, label: "`keyakinan` seharusnya 0.6", msg: "3/5 = 0,6 (60 persen)." },
          { kind: "equal", task: "t2", name: "kenaikan", value: 13, tol: 1e-9, label: "`kenaikan` seharusnya 13", msg: "81 - 68 = 13 poin." },
          { kind: "equal", task: "t2", name: "node_maks", value: 27, tol: 1e-9, label: "`node_maks` seharusnya 27", msg: "3^3 = 27 node maksimum." },
          { kind: "equal", task: "t3", name: "node_evaluasi", value: 9, tol: 1e-9, label: "`node_evaluasi` seharusnya 9", msg: "Beam 3 per level x 3 level = 9 dievaluasi." },
        ],
      },
      reference: "Mayoritas 42 (60 persen); +13 poin; ToT 27 maks, 9 dievaluasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: teknik penalaran apa, kapan",
      prose: [
        "Skenario 1 — Masalah multi-langkah (hitung, rencana, analisis). → CoT few-shot. Alasan: +13 poin dengan biaya token moderat.",
        "Skenario 2 — Masalah butuh backtracking (rencana yang bisa buntu). → ToT dengan beam 3. Alasan: CoT tidak bisa mundur; ToT bisa.",
        "Skenario 3 — Keputusan berisiko, butuh keyakinan. → Self-consistency 5x + ambang eskalasi 80 persen. Alasan: distribusi memberi ukuran risiko.",
        "Skenario 4 — Tugas satu langkah (klasifikasi, hafalan). → Jawaban langsung, tanpa CoT. Alasan: penalaran hanya membuang token dan menambah halusinasi.",
        "Skenario 5 — Jawaban CoT rapi tetapi angka di langkah 2 salah. → Verifikasi tool (hitung ulang) — jangan percaya kerapian. Alasan: penalaran yang salah tetapi meyakinkan adalah jebakan paling berbahaya.",
        "Aturan praktis: penalaran adalah alat, bukan hiasan. Pakai bila masalahnya multi-langkah; verifikasi bila jawabannya berbiaya; eskalasi bila keyakinannya rendah.",
      ],
      tasks: [],
      note: {
        title: "Verifikasi adalah bagian dari penalaran",
        body: "Agen penalaran yang baik tidak hanya berpikir — ia MEMERIKSA pikirannya: hitung ulang angka dengan kalkulator (tool), periksa fakta dengan RAG, dan laporkan keyakinan. Penalaran tanpa verifikasi adalah monolog yang meyakinkan; penalaran dengan verifikasi adalah sistem yang bisa dipercaya.",
      },
      reference: "CoT untuk multi-langkah; ToT untuk backtracking; self-consistency untuk keyakinan; langsung untuk satu langkah.",
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
        "CoT: 68 menjadi 81 persen (+13 poin) pada tugas penalaran.",
        "Self-consistency: [42, 42, 38, 42, 41] → 42, keyakinan 60 persen.",
        "ToT: 27 node maks, 9 dievaluasi (beam 3).",
        "CoT tidak membantu tugas satu langkah atau hafalan.",
        "Verifikasi langkah dengan tool; eskalasi bila keyakinan rendah.",
      ],
      next: { label: "AAI27 — Ekonomi & Operasi Agen: Harga per Tugas yang Selesai", href: "/v2/learn/aai27-ekonomi-operasi-agen" },
      quiz: [
        {
          q: "Voting self-consistency [42, 42, 38, 42, 41]. Berapa mayoritas dan keyakinannya?",
          options: [
            { text: "42, keyakinan 60 persen", why: "Tepat: 42 muncul 3 dari 5 kali.", correct: true },
            { text: "42, keyakinan 100 persen — mayoritas berarti pasti", why: "Salah: mayoritas 3/5 bukan kepastian; 2 suara berbeda adalah sinyal ketidakpastian." },
            { text: "38, keyakinan 20 persen — suara minoritas", why: "Salah: yang dipilih adalah MAYORITAS, bukan minoritas." },
            { text: "41,5 — rata-rata semua voting", why: "Salah: self-consistency memakai voting, bukan rata-rata; jawaban harus salah satu kandidat." },
          ],
        },
        {
          q: "Kapan CoT TIDAK membantu?",
          options: [
            { text: "Masalah multi-langkah yang butuh dekomposisi", why: "Salah: itu justru kasus CoT terbaik (+13 poin)." },
            { text: "Tugas satu langkah (klasifikasi sentimen) atau hafalan", why: "Tepat: tidak ada yang perlu diurai; CoT hanya membuang token.", correct: true },
            { text: "Masalah yang jawabannya bergantung langkah perantara", why: "Salah: itu kasus CoT terbaik." },
            { text: "Tidak pernah — CoT selalu membantu", why: "Salah: CoT pada tugas yang tidak butuh penalaran menambah halusinasi." },
          ],
        },
        {
          q: "ToT 3 cabang x kedalaman 3. Berapa node maksimum, dan berapa yang dievaluasi dengan beam 3?",
          options: [
            { text: "27 maks, 9 dievaluasi", why: "Tepat: 3^3 = 27; beam menyimpan 3 per level x 3 level = 9.", correct: true },
            { text: "9 maks, 27 dievaluasi", why: "Salah: terbalik — 27 adalah maksimum teoritis, 9 yang dievaluasi." },
            { text: "6 maks — 3 + 3", why: "Salah: pohon bercabang perkalian, bukan penjumlahan." },
            { text: "81 maks — 3^4", why: "Salah: kedalamannya 3, bukan 4." },
          ],
        },
        {
          q: "Agen menulis penalaran yang rapi tetapi angka di langkah 2 salah. Apa yang benar?",
          options: [
            { text: "Terima — penalaran yang rapi berarti jawaban benar", why: "Salah: kerapian bukan kebenaran; penalaran salah yang meyakinkan adalah jebakan." },
            { text: "Verifikasi langkah dengan tool (hitung ulang) — jangan percaya kerapian", why: "Tepat: periksa langkah, bukan hanya jawaban.", correct: true },
            { text: "Minta agen menulis penalaran yang lebih panjang", why: "Salah: penalaran lebih panjang dari premis yang salah hanya memperpanjang kesalahan." },
            { text: "Ganti model — model ini tidak bisa bernalar", why: "Salah: masalahnya bukan model; verifikasi yang hilang." },
          ],
        },
        {
          q: "Self-consistency 60 persen untuk keputusan finansial. Apa yang benar?",
          options: [
            { text: "Lanjutkan — mayoritas sudah menang", why: "Salah: 60 persen tidak cukup untuk keputusan finansial; butuh 80 persen atau verifikasi." },
            { text: "Eskalasi: verifikasi dengan tool atau tanyakan manusia", why: "Tepat: keyakinan rendah adalah sinyal eskalasi, bukan kegagalan.", correct: true },
            { text: "Ulangi voting sampai 100 persen", why: "Salah: mengulang sampai dapat yang diinginkan adalah manipulasi, bukan keyakinan." },
            { text: "Ambil jawaban minoritas — mungkin benar", why: "Salah: minoritas bukan jawaban; yang dibutuhkan adalah verifikasi, bukan tebakan lain." },
          ],
        },
      ],
    },
  ],
};
