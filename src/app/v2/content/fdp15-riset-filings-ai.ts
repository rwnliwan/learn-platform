import type { V2Lesson } from "../lib/types";

export const fdp15: V2Lesson = {
  slug: "fdp15-riset-filings-ai",
  track: "Financial Data Pipeline",
  module: "Riset & AI",
  title: "FDP15 — Riset Filings Berbantuan AI: RAG di Atas 10-K",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Enam jam membaca, dua puluh lima menit bertanya",
      prose: [
        "Seorang analis harus menjawab satu pertanyaan sebelum rapat: 'Apa saja risiko utama yang diungkapkan emiten ini di 10-K terbarunya, dan bagaimana ia berubah dari tahun lalu?' Cara lama: membaca 200 halaman filing — enam jam kerja. Cara baru: sistem RAG (retrieval-augmented generation) yang memotong filing menjadi 200 chunk, mengambil 200 chunk yang paling relevan, dan membiarkan LLM menjawab dari chunk itu. Hasilnya: 150 dari 200 chunk yang diambil ternyata relevan — precision 75,0 persen — dan dari 200 chunk relevan yang ada di seluruh filing, 150 tertangkap — recall 75,0 persen. Waktunya: 25 menit, bukan 360 — hemat 93,1 persen.",
        "Tetapi jawaban LLM itu tidak langsung dipercaya. Setiap klaim jawaban harus bisa dilacak ke chunk sumbernya — halaman dan paragraf — karena LLM yang menjawab tanpa sumber adalah LLM yang bisa mengarang dengan percaya diri. Lesson ini mengajarkan riset filings berbantuan AI: cara kerja RAG, cara mengukur precision dan recall-nya, dan disiplin sitasi yang membuat jawabannya bisa diaudit.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FDP2 mengajarkan mengambil filing dari EDGAR dan FDP3 mengajarkan parsing strukturnya — tetapi keduanya berhenti di data terstruktur. Tidak ada lesson tentang riset berbantuan AI atas TEKS filing: chunking, retrieval, dan jawaban LLM yang tersitasi. Lesson ini membangun lapis itu di atas FDP2 dan FDP3.",
      },
      reference: "200 chunk diambil, 150 relevan (precision 75,0 persen); 200 relevan di korpus, 150 tertangkap (recall 75,0 persen); 25 menit vs 360 menit (hemat 93,1 persen).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun dan menilai riset filings berbantuan AI.",
        "(1) Menjelaskan cara kerja RAG: chunking, embedding, retrieval, generasi;",
        "(2) Menghitung precision dan recall retrieval dari data;",
        "(3) Menjelaskan kenapa chunking yang buruk merusak retrieval;",
        "(4) Menerapkan disiplin sitasi: setiap klaim harus tertelusur ke chunk;",
        "(5) Menyebutkan tiga kegagalan RAG: halusinasi, konteks yang hilang, dan chunk yang terpotong.",
      ],
      tasks: [],
    },
    {
      id: "cara-kerja",
      eyebrow: "Langkah 3 · Teori",
      title: "Cara kerja RAG: potong, cari, jawab",
      prose: [
        "Langkah pertama: chunking — filing 200 halaman dipotong menjadi potongan-potongan kecil, misalnya 500 kata per chunk dengan tumpang tindih 50 kata. Tumpang tindih itu penting: kalimat yang terpotong di batas chunk kehilangan konteksnya, dan jawaban yang dibangun dari kalimat yang terpotong adalah jawaban yang cacat. Chunking yang buruk — memotong di tengah tabel atau di tengah definisi risiko — merusak semua langkah sesudahnya.",
        "Langkah kedua: embedding dan retrieval. Setiap chunk diubah menjadi vektor angka (embedding) yang menangkap maknanya, dan pertanyaan analis juga diubah menjadi vektor yang sama. Sistem mengambil chunk yang vektornya paling dekat dengan vektor pertanyaan — 200 chunk teratas dalam cerita pembuka. Langkah ketiga: generasi. LLM menerima pertanyaan plus 200 chunk itu dan menulis jawaban — tetapi HANYA dari chunk yang diberikan, bukan dari ingatannya sendiri.",
        "Pemisahan ini adalah inti disiplinnya: LLM yang menjawab dari ingatannya (tanpa retrieval) adalah LLM yang mengarang; LLM yang menjawab dari chunk yang diberikan adalah LLM yang merangkum. Perbedaannya terlihat di sitasi: jawaban RAG yang baik mencantumkan nomor chunk dan halaman untuk tiap klaim — sehingga analis bisa mengklik dan memeriksa sendiri.",
      ],
      tasks: [],
      note: {
        title: "RAG bukan mesin pencari yang pintar",
        body: "RAG tidak 'memahami' filing — ia mencocokkan vektor dan merangkum teks yang cocok. Bila chunk yang relevan tidak tertangkap retrieval (recall 75 persen berarti 50 chunk relevan terlewat), jawaban akan kehilangan seperempat buktinya — dan LLM tidak akan pernah berkata 'saya kehilangan 50 chunk'. Selalu laporkan recall bersama jawabannya.",
      },
      reference: "Chunk 500 kata + tumpang tindih 50 kata; retrieval 200 chunk teratas; jawaban hanya dari chunk yang diberikan.",
    },
    {
      id: "evaluasi-sitasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Mengukur retrieval dan menegakkan sitasi",
      prose: [
        "Precision retrieval: dari 200 chunk yang diambil, 150 relevan — 150 dibagi 200 dikali 100 sama dengan 75,0 persen. Artinya seperempat konteks yang diberikan ke LLM adalah noise — dan noise itu bisa masuk ke jawaban sebagai klaim yang salah. Recall retrieval: dari 200 chunk relevan yang ada di seluruh filing, 150 tertangkap — 150 dibagi 200 dikali 100 sama dengan 75,0 persen. Artinya seperempat bukti tidak pernah sampai ke LLM.",
        "Kedua angka 75,0 persen itu bukan kebetulan — keduanya dihitung dari angka 150 yang sama, tetapi dari pembagi yang berbeda: precision membagi dengan yang diambil, recall membagi dengan yang ada. Keduanya harus dilaporkan berdampingan: precision tanpa recall menyembunyikan bukti yang hilang; recall tanpa precision menyembunyikan noise yang masuk.",
        "Disiplin sitasi menegakkan kejujuran jawaban. Aturannya: setiap klaim faktual dalam jawaban wajib punya sitasi ke chunk — nomor chunk dan halaman filing. Klaim tanpa sitasi ditandai dan tidak boleh dikutip ke rapat. Dan satu aturan terakhir: jawaban RAG tidak pernah menjadi satu-satunya sumber untuk keputusan investasi — ia adalah titik awal riset, dan analis wajib membaca chunk sumbernya sebelum mengutip jawabannya.",
      ],
      tasks: [],
      note: {
        title: "Waktu yang dihemat bukan alasan untuk tidak membaca",
        body: "Hemat 93,1 persen waktu (25 menit vs 360 menit) adalah alasan untuk riset LEBIH BANYAK emiten, bukan untuk membaca lebih sedikit. Analis yang memakai waktu yang dihemat untuk memeriksa chunk sumber adalah analis yang memakai AI dengan benar; analis yang memakai waktu itu untuk tidak membaca sama sekali adalah analis yang menyerahkan pekerjaannya ke mesin.",
      },
      reference: "Precision 75,0 persen; recall 75,0 persen; hemat waktu 93,1 persen. Setiap klaim wajib bersitasi.",
    },
    {
      id: "lab-rag",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung precision, recall, dan hemat waktu RAG",
      prose: [
        "Lab ini menghitung tiga angka riset berbantuan AI: precision retrieval, recall retrieval, dan persentase waktu yang dihemat. Hitung dulu di kepala. Precision: 150 dibagi 200 dikali 100 sama dengan 75,0 persen. Recall: 150 dibagi 200 dikali 100 sama dengan 75,0 persen. Hemat waktu: 360 dikurangi 25 sama dengan 335 menit; 335 dibagi 360 dikali 100 sama dengan 93,1 persen (pembulatan satu desimal).",
        "Tugas lab: isi tiga variabel — precision, recall, hemat_pct — lalu cetak ketiganya. Tiga angka ini adalah laporan kualitas sistem RAG: seberapa tepat pengambilannya, seberapa lengkap, dan seberapa besar ia menghemat waktu.",
        "Setelah lolos, coba eksperimen: turunkan chunk relevan yang tertangkap menjadi 120 dan lihat recall jatuh ke 60,0 persen — lalu tanyakan: apakah jawaban RAG itu masih boleh dipakai? Jawabannya: hanya sebagai draf awal yang wajib dilengkapi pembacaan manual — 40 persen bukti hilang berarti jawaban itu tidak lengkap, berapa pun bagusnya tulisannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung precision retrieval dalam persen" },
        { id: "t2", text: "Hitung recall retrieval dalam persen" },
        { id: "t3", text: "Hitung penghematan waktu dalam persen" },
      ],
      expected: "precision=75.0\nrecall=75.0\nhemat_pct=93.1",
      hints: [
        "Precision = chunk relevan yang diambil dibagi total chunk yang diambil, dikali 100.",
        "Recall = chunk relevan yang diambil dibagi total chunk relevan di korpus, dikali 100.",
        "Hemat = (waktu manual - waktu RAG) dibagi waktu manual, dikali 100.",
      ],
      code: {
        starter: "# Riset filings berbantuan AI (RAG). JANGAN UBAH.\ndiambil = 200\nrelevan_diambil = 150\nrelevan_total = 200\nwaktu_manual = 360  # menit\nwaktu_rag = 25  # menit\n\n# TULIS KODEMU: precision, recall, hemat waktu\nprecision = \nrecall = \nhemat_pct = \nprint(f\"precision={round(precision, 1)}\")\nprint(f\"recall={round(recall, 1)}\")\nprint(f\"hemat_pct={round(hemat_pct, 1)}\")",
        lockLines: 7,
        solution: "# Riset filings berbantuan AI (RAG). JANGAN UBAH.\ndiambil = 200\nrelevan_diambil = 150\nrelevan_total = 200\nwaktu_manual = 360  # menit\nwaktu_rag = 25  # menit\n\n# TULIS KODEMU: precision, recall, hemat waktu\nprecision = relevan_diambil / diambil * 100\nrecall = relevan_diambil / relevan_total * 100\nhemat_pct = (waktu_manual - waktu_rag) / waktu_manual * 100\nprint(f\"precision={round(precision, 1)}\")\nprint(f\"recall={round(recall, 1)}\")\nprint(f\"hemat_pct={round(hemat_pct, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "precision=75.0", label: "Precision 75,0 persen", msg: "150 / 200 x 100 = 75,0. Seperempat konteks yang diberikan adalah noise." },
          { kind: "stdout_matches", task: "t2", pattern: "recall=75.0", label: "Recall 75,0 persen", msg: "150 / 200 x 100 = 75,0. Seperempat bukti tidak pernah sampai ke LLM." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat_pct=93.1", label: "Hemat 93,1 persen", msg: "(360 - 25) / 360 x 100 = 93,06, dibulatkan 93,1. Waktu yang dihemat dipakai untuk memeriksa chunk sumber." },
        ],
      },
      reference: "Precision 75,0 persen; recall 75,0 persen; hemat 93,1 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: jawaban yang mengarang dengan percaya diri",
      prose: [
        "Suatu hari, RAG menjawab pertanyaan tentang risiko emiten dengan jawaban yang rapi dan meyakinkan — tetapi satu klaim di dalamnya tidak punya sitasi. Analis yang memeriksanya menemukan bahwa klaim itu tidak ada di chunk mana pun: LLM telah mengarangnya dari 'ingatannya' tentang industri itu, bukan dari filing emiten tersebut. Jawaban itu hampir masuk ke memo investasi — dan satu-satunya yang menghentikannya adalah aturan sitasi: klaim tanpa sitasi tidak boleh dikutip.",
        "Penyelidikan menemukan penyebabnya: prompt sistem tidak cukup tegas melarang LLM memakai pengetahuan di luar chunk. Prompt diperbaiki dengan satu kalimat: 'Jawab HANYA dari chunk yang diberikan; bila tidak ada di chunk, katakan tidak ada.' Setelah itu, jawaban tanpa sitasi turun dari 12 persen menjadi 1 persen — dan 1 persen sisanya tetap ditandai untuk pemeriksaan manual.",
        "Sejak itu, laporan RAG selalu membawa tiga angka di headernya: precision, recall, dan persentase klaim bersitasi. Tiga angka itu adalah pengakuan jujur tentang apa yang sistem tahu, apa yang ia lewatkan, dan apa yang ia klaim tanpa bukti. Analis yang membaca header itu sebelum membaca jawaban adalah analis yang tidak akan pernah mengutip karangan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, kegagalan ditangkap oleh disiplin sitasi, bukan oleh keberuntungan. Kedua, prompt diperbaiki secara sistemik — satu kalimat yang mengikat semua jawaban sesudahnya. Ketiga, metrik klaim bersitasi dipantau terus, bukan sekali.",
      },
      reference: "Klaim tanpa sitasi turun dari 12 persen menjadi 1 persen setelah prompt diperbaiki.",
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
        "RAG: chunking, embedding, retrieval, generasi — jawaban hanya dari chunk yang diberikan.",
        "Lab: precision 75,0 persen; recall 75,0 persen; hemat 93,1 persen.",
        "Chunking buruk merusak semua langkah sesudahnya — tumpang tindih 50 kata melindungi batas.",
        "Setiap klaim wajib bersitasi ke chunk; klaim tanpa sitasi tidak boleh dikutip.",
        "Jawaban RAG adalah titik awal riset, bukan satu-satunya sumber keputusan.",
      ],
      next: { label: "FDP16 — Lineage & Audit Trail: Setiap Angka Punya Silsilah", href: "/v2/learn/fdp16-lineage-audit-trail" },
      quiz: [
        {
          q: "200 chunk diambil, 150 relevan; total chunk relevan di korpus 200. Berapa precision dan recall?",
          options: [
            { text: "Precision 75,0 persen; recall 75,0 persen", why: "Tepat: 150/200 = 75,0 untuk keduanya — tetapi dari pembagi yang berbeda.", correct: true },
            { text: "Precision 75,0 persen; recall 100 persen", why: "Salah: recall membagi dengan total relevan di korpus (200), bukan dengan yang diambil." },
            { text: "Precision 100 persen; recall 75,0 persen", why: "Salah: precision membagi dengan yang diambil (200), dan 50 di antaranya tidak relevan." },
            { text: "Keduanya 150 persen — jumlah keduanya", why: "Salah: precision dan recall adalah rasio, maksimal 100 persen." },
          ],
        },
        {
          q: "Membaca filing manual butuh 360 menit; dengan RAG butuh 25 menit. Berapa penghematannya?",
          options: [
            { text: "93,1 persen", why: "Tepat: (360 - 25)/360 = 93,06 persen, dibulatkan 93,1.", correct: true },
            { text: "335 persen — selisih menitnya", why: "Salah: 335 adalah selisih dalam menit, bukan persen." },
            { text: "6,9 persen — 25 dibagi 360", why: "Salah: itu proporsi waktu yang tersisa, bukan yang dihemat." },
            { text: "100 persen — RAG menggantikan membaca", why: "Salah: RAG tidak menggantikan membaca — analis wajib memeriksa chunk sumbernya." },
          ],
        },
        {
          q: "Jawaban RAG berisi klaim tanpa sitasi ke chunk. Apa yang harus dilakukan?",
          options: [
            { text: "Kutip saja — tulisannya rapi dan meyakinkan", why: "Salah: klaim tanpa sitasi bisa jadi karangan LLM dari ingatannya, bukan dari filing." },
            { text: "Jangan kutip — periksa chunk sumbernya dulu, atau buang klaim itu", why: "Tepat: disiplin sitasi adalah satu-satunya yang memisahkan ringkasan dari karangan.", correct: true },
            { text: "Minta LLM membuatkan sitasi", why: "Salah: sitasi yang dibuat LLM tanpa chunk adalah karangan kedua yang menyamar sebagai bukti." },
            { text: "Abaikan — satu klaim tidak memengaruhi jawaban", why: "Salah: satu klaim yang salah di memo investasi bisa mengubah keputusan." },
          ],
        },
        {
          q: "Recall retrieval 60,0 persen. Apa artinya untuk jawaban RAG?",
          options: [
            { text: "Jawaban lengkap — 60 persen sudah cukup", why: "Salah: 40 persen bukti hilang berarti jawaban tidak lengkap." },
            { text: "Jawaban tidak lengkap — 40 persen bukti tidak pernah sampai ke LLM; pakai sebagai draf awal saja", why: "Tepat: recall rendah berarti jawaban kehilangan bukti, berapa pun bagusnya tulisannya.", correct: true },
            { text: "Jawaban salah — precision pasti juga rendah", why: "Salah: precision dan recall independen — recall rendah tidak berarti precision rendah." },
            { text: "Tidak ada arti — recall hanya untuk mesin pencari", why: "Salah: recall retrieval adalah metrik kualitas jawaban RAG." },
          ],
        },
        {
          q: "Kenapa chunking memakai tumpang tindih 50 kata?",
          options: [
            { text: "Agar chunk lebih banyak", why: "Salah: jumlah chunk bukan tujuannya." },
            { text: "Agar kalimat yang terpotong di batas chunk tidak kehilangan konteksnya", why: "Tepat: kalimat yang terpotong menghasilkan jawaban yang cacat.", correct: true },
            { text: "Agar embedding lebih cepat dihitung", why: "Salah: tumpang tindih justru menambah komputasi, bukan menguranginya." },
            { text: "Agar LLM mendapat konteks yang sama dua kali", why: "Salah: tumpang tindih melindungi batas, bukan menggandakan konteks." },
          ],
        },
      ],
    },
  ],
};
