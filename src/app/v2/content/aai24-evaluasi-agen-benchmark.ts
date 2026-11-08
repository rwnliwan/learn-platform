import type { V2Lesson } from "../lib/types";

export const aai24: V2Lesson = {
  slug: "aai24-evaluasi-agen-benchmark",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI24 — Evaluasi Agen: Benchmark & Taksonomi Kegagalan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agen 69 persen yang gagal dengan 4 cara berbeda — dan tim hanya memperbaiki 1",
      prose: [
        "Agen CS NusaBank lolos 138 dari 200 tugas (69 persen). Tim memperbaiki 'prompt-nya' selama sebulan — skor naik 1 poin. Lalu seseorang mengklasifikasikan 62 kegagalan: perencanaan 24 (12 persen), pemakaian tool 18 (9 persen), memori 12 (6 persen), grounding 8 (4 persen). Perencanaan adalah 39 persen dari semua kegagalan — tetapi tidak ada yang memperbaikinya karena tidak ada yang mengukurnya. Setelah perbaikan perencanaan (dekomposisi tugas + verifikasi rencana), skor naik ke 78 persen dalam 2 minggu — dan benchmark tau-bench naik dari 0,42 menjadi 0,51 (+0,09).",
        "Evaluasi agen tanpa taksonomi kegagalan adalah seperti dokter yang hanya mengukur demam tanpa mendiagnosis penyebabnya. Lesson ini mengajarkan evaluasi agen sebagai diagnosis: benchmark standar, taksonomi kegagalan, dan prioritas perbaikan berdasarkan Pareto.",
        "Setelah lesson ini kamu bisa: (1) menghitung success rate dan laju kegagalan per kategori; (2) menjelaskan benchmark agen (tau-bench, AgentBench, SWE-bench); (3) mengklasifikasikan kegagalan ke taksonomi; (4) memprioritaskan perbaikan dengan Pareto; (5) merancang evaluasi yang tidak bisa dicurangi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AAI8 mengajarkan piramida evaluasi agen (sukses tugas, trajectory, interval kepercayaan) — tetapi tidak ada benchmark bernama (0 hit 'tau-bench/AgentBench' di track) dan tidak ada taksonomi kegagalan. Lesson ini membangun keduanya: benchmark standar sebagai pembanding eksternal + taksonomi kegagalan sebagai diagnosis internal, dengan lab yang menghitung laju per kategori dan Pareto.",
      },
      reference: "138/200 = 69 persen; gagal 62: perencanaan 24, tool 18, memori 12, grounding 8; tau-bench 0,42 menjadi 0,51.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mendiagnosis agen yang gagal — bukan hanya mengukur bahwa ia gagal.",
        "(1) Menghitung success rate dan laju kegagalan per kategori;",
        "(2) Menjelaskan tau-bench, AgentBench, dan SWE-bench;",
        "(3) Mengklasifikasikan kegagalan: perencanaan, tool, memori, grounding;",
        "(4) Memprioritaskan perbaikan dengan aturan Pareto;",
        "(5) Merancang evaluasi yang tahan terhadap gaming (benchmark tetap + blind).",
      ],
      tasks: [],
    },
    {
      id: "benchmark",
      eyebrow: "Langkah 3 · Teori",
      title: "Benchmark: pembanding eksternal yang tidak bisa dinegosiasi",
      prose: [
        "Tiga benchmark yang penting. tau-bench: agen melayani pelanggan dalam simulasi (maskapai, retail) dengan tool nyata dan aturan kebijakan — mengukur apakah agen menyelesaikan tugas TANPA melanggar kebijakan. Skor pass@1 0,42 berarti 42 persen tugas selesai benar pada percobaan pertama. AgentBench: 8 lingkungan (web, OS, database, kartu) — mengukur generalisasi lintas domain. SWE-bench: agen memperbaiki bug nyata dari repositori GitHub — mengukur kemampuan coding agentic.",
        "Benchmark memberi dua hal yang evaluasi internal tidak bisa: pembanding eksternal (agenmu vs agen orang lain, di tugas yang sama) dan ketahanan terhadap gaming SEBAGIAN — tugas yang tetap mencegah memilih tugas yang mudah. Tetapi tugas tetap bukan jaminan anti-gaming: benchmark bisa di-overfit (tuning berulang pada benchmark yang sama sampai skor naik tanpa kemampuan umum yang naik) dan terkontaminasi (soal benchmark bocor ke data training — lihat AIE26). Tugas tetap adalah pertahanan pertama, bukan jaminan. Aturan: benchmark untuk pembanding, golden set sendiri (AAI8) untuk vonis. Dan laporkan interval kepercayaan untuk skor benchmark juga — 0,51 dari 200 tugas punya interval sekitar ±7 poin (95 persen); selisih kecil antar model bisa jadi noise.",
        "Jangan pernah mengubah benchmark untuk membuat skor naik — itulah gaming. Tugas yang berubah = benchmark yang bergeser = klaim perbaikan yang tak terbukti (AAI8). Bila benchmark terlalu mudah, buat yang lebih sulit; jangan buat yang lebih mudah.",
        "Melindungi holdout dari overfitting: segel golden set (hanya tim evaluasi yang memegangnya — tim training tidak boleh membacanya), rotasi sebagian tugas tiap kuartal (agar tuning tidak menghafal satu set tetap), dan JANGAN pernah tuning prompt atau hiperparameter pada benchmark yang sama berulang kali — sekali dipakai untuk memilih model, ia bukan lagi pengukur yang bersih. Untuk vonis akhir, pakai holdout KEDUA yang belum pernah dipakai untuk keputusan apa pun. Holdout yang dipakai untuk tuning adalah validation set — bukan lagi test set.",
      ],
      tasks: [],
      note: {
        title: "Pass@1 vs pass@k",
        body: "Pass@1 = berhasil pada percobaan pertama; pass@5 = berhasil dalam 5 percobaan. Agen yang pass@1 0,42 tetapi pass@5 0,80 adalah agen yang sering benar bila diberi kesempatan mengulang — berguna untuk tugas yang boleh diulang, tidak berguna untuk tugas sekali jalan (kirim uang). Laporkan keduanya; vonis dari pass@1 untuk tugas kritis.",
      },
      reference: "tau-bench 0,42 menjadi 0,51 (+0,09) setelah perbaikan perencanaan.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 4 · Teori",
      title: "Taksonomi kegagalan: empat cara agen gagal",
      prose: [
        "Klasifikasikan 62 kegagalan dari 200 tugas. Perencanaan (24; 12,0 persen): agen salah merencanakan — langkah yang hilang, urutan yang salah, tidak ada verifikasi. Contoh: agen langsung mengirim email tanpa memeriksa saldo. Tool (18; 9,0 persen): agen salah memakai tool — argumen salah, tool yang salah, tidak membaca hasil tool. Memori (12; 6,0 persen): agen lupa konteks — menanyakan hal yang sudah dijawab, mengulang langkah. Grounding (8; 4,0 persen): agen berhalusinasi fakta — mengutip kebijakan yang tidak ada, mengarang nomor referensi.",
        "Pareto: perencanaan 24 dari 62 kegagalan = 38,7 persen dari semua kegagalan. Perbaiki perencanaan dulu — ia memberi pengembalian terbesar. Setelah perbaikan perencanaan, success rate 69 persen naik menjadi 78 persen (18 dari 24 kegagalan perencanaan teratasi: 138 + 18 = 156 dari 200). Baru kemudian tool (18), memori (12), grounding (8). Tim yang memperbaiki 'prompt secara umum' tanpa taksonomi menyebar usaha merata ke 4 kategori — dan mendapat 1 poin. Tim yang memakai Pareto mendapat 9 poin.",
        "Tiap kategori punya obat yang berbeda: perencanaan → dekomposisi + verifikasi rencana (AAI26); tool → validasi argumen + deskripsi tool yang jelas; memori → ringkasan konteks + retrieval (AAI4); grounding → RAG + kutipan wajib + verifikasi fakta. Obat yang salah untuk kategori yang salah adalah pemborosan: memperbaiki prompt tidak menyembuhkan perencanaan yang buruk.",
      ],
      tasks: [],
      note: {
        title: "Klasifikasi butuh manusia (awalnya)",
        body: "Klasifikasi 62 kegagalan dilakukan manusia dengan membaca trajectory — 2 jam kerja. Setelah itu, pola klasifikasinya bisa diajarkan ke judge otomatis (LLM-as-judge dengan rubrik taksonomi) untuk 1.000 tugas berikutnya. Jangan otomatisasi klasifikasi sebelum manusia memvalidasi taksonominya — judge yang mengklasifikasi dengan taksonomi yang salah hanya mempercepat kesalahan.",
      },
      reference: "Perencanaan 38,7 persen dari kegagalan; perbaikan memberi +9 poin (69 menjadi 78 persen).",
    },
    {
      id: "lab-taksonomi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: laju kegagalan dan prioritas Pareto",
      prose: [
        "Lab ini menghitung diagnosis kegagalan agen dari angka mentah: success rate, laju per kategori, dan prioritas Pareto.",
        "Hitung dulu di kepala. Sukses: 200 - 62 = 138; rate = 138/200 = 0,69 (69 persen). Perencanaan: 24/200 = 12,0 persen. Tool: 18/200 = 9,0 persen. Memori: 12/200 = 6,0 persen. Grounding: 8/200 = 4,0 persen. Pareto: perencanaan 24/62 = 38,7 persen dari kegagalan — prioritas 1.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: sukses, gagal_perencanaan, gagal_tool, gagal_memori, gagal_grounding (dalam persen, 1 desimal). Lima angka ini adalah diagnosis — dengan ini 'agennya kurang bagus' menjadi 'perencanaannya yang rusak'.",
        "Setelah lolos, coba eksperimen: perbaiki setengah kegagalan perencanaan (12) dan lihat success rate menjadi 75,0 persen — lalu tanyakan: berapa banyak yang harus diperbaiki untuk mencapai 80 persen?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sukses` persen dari 138 berhasil dari 200 tugas" },
        { id: "t2", text: "Hitung `gagal_perencanaan`, `gagal_tool`, `gagal_memori`, `gagal_grounding` dalam persen" },
      ],
      expected: "sukses=69.0\ngagal_perencanaan=12.0\ngagal_tool=9.0\ngagal_memori=6.0\ngagal_grounding=4.0",
      hints: [
        "Persen = jumlah / 200 x 100; bulatkan 1 desimal.",
        "Sukses = (200 - 62) / 200 x 100.",
        "Kategori: perencanaan 24, tool 18, memori 12, grounding 8.",
      ],
      code: {
        starter: `# Diagnosis kegagalan agen: laju per kategori.\ntotal = 200\ngagal_total = 62\nperencanaan, tool, memori, grounding = 24, 18, 12, 8\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nsukses = \ngagal_perencanaan = \ngagal_tool = \ngagal_memori = \ngagal_grounding = \n\nprint(f"sukses={round(sukses, 1)}")\nprint(f"gagal_perencanaan={round(gagal_perencanaan, 1)}")\nprint(f"gagal_tool={round(gagal_tool, 1)}")\nprint(f"gagal_memori={round(gagal_memori, 1)}")\nprint(f"gagal_grounding={round(gagal_grounding, 1)}")`,
        lockLines: 3,
        solution: `# Diagnosis kegagalan agen: laju per kategori.\ntotal = 200\ngagal_total = 62\nperencanaan, tool, memori, grounding = 24, 18, 12, 8\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nsukses = (total - gagal_total) / total * 100\ngagal_perencanaan = perencanaan / total * 100\ngagal_tool = tool / total * 100\ngagal_memori = memori / total * 100\ngagal_grounding = grounding / total * 100\n\nprint(f"sukses={round(sukses, 1)}")\nprint(f"gagal_perencanaan={round(gagal_perencanaan, 1)}")\nprint(f"gagal_tool={round(gagal_tool, 1)}")\nprint(f"gagal_memori={round(gagal_memori, 1)}")\nprint(f"gagal_grounding={round(gagal_grounding, 1)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sukses", value: 69.0, tol: 0.1, label: "`sukses` seharusnya 69.0", msg: "138/200 = 69,0 persen." },
          { kind: "equal", task: "t2", name: "gagal_perencanaan", value: 12.0, tol: 0.1, label: "`gagal_perencanaan` seharusnya 12.0", msg: "24/200 = 12,0 persen — prioritas Pareto." },
          { kind: "equal", task: "t2", name: "gagal_tool", value: 9.0, tol: 0.1, label: "`gagal_tool` seharusnya 9.0", msg: "18/200 = 9,0 persen." },
          { kind: "equal", task: "t2", name: "gagal_memori", value: 6.0, tol: 0.1, label: "`gagal_memori` seharusnya 6.0", msg: "12/200 = 6,0 persen." },
          { kind: "equal", task: "t2", name: "gagal_grounding", value: 4.0, tol: 0.1, label: "`gagal_grounding` seharusnya 4.0", msg: "8/200 = 4,0 persen." },
        ],
      },
      reference: "Sukses 69 persen; perencanaan 12; tool 9; memori 6; grounding 4 persen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: evaluasi apa, kapan",
      prose: [
        "Skenario 1 — Agen baru, belum ada baseline. → Golden set sendiri 200 tugas + taksonomi. Alasan: benchmark umum tidak mengukur tugasmu.",
        "Skenario 2 — Membandingkan dua versi agen. → Tugas TETAP + blind test + interval kepercayaan (AAI8). Alasan: tugas yang berubah membatalkan perbandingan.",
        "Skenario 3 — Skor stagnan walau prompt diperbaiki sebulan. → Klasifikasikan kegagalan; cari kategori dominan. Alasan: stagnasi biasanya berarti obat yang salah untuk kategori yang salah.",
        "Skenario 4 — Butuh pembanding industri. → tau-bench / AgentBench / SWE-bench sesuai domain. Alasan: pembanding eksternal yang tidak bisa dinegosiasi.",
        "Skenario 5 — Kegagalan grounding (halusinasi) di tugas finansial. → Prioritaskan walau persentasenya kecil — dampaknya besar. Alasan: Pareto memakai JUMLAH; risiko memakai DAMPAK. Kategori kecil dengan dampak fatal mengalahkan kategori besar dengan dampak ringan.",
        "Aturan praktis: ukur, klasifikasikan, prioritaskan (Pareto + dampak), perbaiki, ukur ulang dengan tugas yang sama. Evaluasi adalah loop, bukan acara.",
      ],
      tasks: [],
      note: {
        title: "Pareto + dampak, bukan Pareto saja",
        body: "Grounding hanya 4 persen tetapi satu halusinasi kebijakan bisa berarti gugatan. Perencanaan 12 persen tetapi dampaknya rata-rata ringan. Prioritas = frekuensi x dampak — bukan frekuensi saja. Hitung keduanya sebelum memutuskan.",
      },
      reference: "Golden set untuk vonis; benchmark untuk pembanding; Pareto + dampak untuk prioritas.",
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
        "Sukses 138/200 = 69 persen; gagal 62.",
        "Perencanaan 12 persen (38,7 persen dari kegagalan) — prioritas Pareto.",
        "tau-bench 0,42 menjadi 0,51 setelah perbaikan perencanaan.",
        "Benchmark untuk pembanding; golden set sendiri untuk vonis.",
        "Prioritas = frekuensi x dampak, bukan frekuensi saja.",
      ],
      next: { label: "AAI25 — Governance & Compliance Khusus Agen", href: "/v2/learn/aai25-governance-compliance-agen" },
      quiz: [
        {
          q: "62 kegagalan: perencanaan 24, tool 18, memori 12, grounding 8. Kategori prioritas Pareto?",
          options: [
            { text: "Perencanaan — 38,7 persen dari semua kegagalan", why: "Tepat: 24/62 = 38,7 persen; pengembalian terbesar.", correct: true },
            { text: "Grounding — dampaknya paling fatal", why: "Salah: grounding penting karena dampak, tetapi Pareto memakai frekuensi — perencanaan yang pertama." },
            { text: "Tool — 18 hampir sama dengan 24", why: "Salah: 18 lebih kecil dari 24; Pareto memilih yang terbesar dulu." },
            { text: "Semua sama — perbaiki merata", why: "Salah: merata memberi 1 poin sebulan; Pareto memberi 9 poin 2 minggu." },
          ],
        },
        {
          q: "Mengapa benchmark (tau-bench) tidak cukup sendiri untuk vonis?",
          options: [
            { text: "Karena benchmark mengukur tugas umum, bukan tugasmu", why: "Tepat: 0,51 di tau-bench bisa 0,30 di tugas NusaBank.", correct: true },
            { text: "Karena benchmark terlalu sulit", why: "Salah: kesulitan bukan masalahnya; relevansi yang masalah." },
            { text: "Karena benchmark bisa dicurangi", why: "Salah sebagai jawaban UTAMA: benchmark memang bisa di-overfit dan terkontaminasi — tetapi alasan ia tidak cukup untuk vonis adalah relevansi (tugas umum vs tugasmu), bukan karena ia bisa dicurangi." },
            { text: "Karena benchmark tidak punya interval kepercayaan", why: "Salah: interval kepercayaan BISA dan SEHARUSNYA juga dilaporkan untuk skor benchmark publik — 0,51 dari 200 tugas punya interval sekitar ±7 poin (95 persen); tanpa interval, selisih kecil antar model bisa jadi noise." },
          ],
        },
        {
          q: "Tim memperbaiki prompt sebulan, skor naik 1 poin. Apa diagnosis yang paling mungkin?",
          options: [
            { text: "Modelnya sudah mentok", why: "Salah: belum didiagnosis — taksonomi belum dibuat." },
            { text: "Obat yang salah untuk kategori yang salah — taksonomi belum dibuat", why: "Tepat: tanpa klasifikasi, perbaikan menyebar merata dan tidak menyentuh akar.", correct: true },
            { text: "Prompt memang satu-satunya tuas", why: "Salah: perencanaan, tool, memori, grounding masing-masing punya obat berbeda." },
            { text: "Skor 69 persen sudah maksimal", why: "Salah: perbaikan perencanaan memberi +9 poin — jauh dari maksimal." },
          ],
        },
        {
          q: "Grounding hanya 4 persen tetapi satu halusinasi bisa berarti gugatan. Apa prioritasnya?",
          options: [
            { text: "Terakhir — Pareto memakai frekuensi", why: "Salah: prioritas = frekuensi x dampak; dampak fatal mengalahkan frekuensi kecil." },
            { text: "Tinggi — dampak fatal mengalahkan frekuensi kecil", why: "Tepat: Pareto + dampak, bukan Pareto saja.", correct: true },
            { text: "Abaikan — 4 persen tidak signifikan", why: "Salah: signifikansi statistik bukan signifikansi risiko." },
            { text: "Samakan dengan perencanaan — keduanya penting", why: "Salah: menyamakan berarti tidak memprioritaskan; hitung frekuensi x dampak." },
          ],
        },
        {
          q: "Apa yang membatalkan perbandingan dua versi agen?",
          options: [
            { text: "Tugas evaluasi yang berubah antar versi", why: "Tepat: tugas yang berubah = benchmark yang bergeser = klaim yang tak terbukti.", correct: true },
            { text: "Jumlah tugas yang terlalu banyak", why: "Salah: tugas banyak justru memperkuat perbandingan (interval lebih sempit)." },
            { text: "Blind test", why: "Salah: blind test justru MEMVALIDASI perbandingan." },
            { text: "Interval kepercayaan yang lebar", why: "Salah: interval lebar berarti bukti lemah, bukan perbandingan batal — tambah tugas." },
          ],
        },
      ],
    },
  ],
};
