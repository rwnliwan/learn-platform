import type { V2Lesson } from "../lib/types";

export const fr31: V2Lesson = {
  slug: "fr31-genai-detection-pipeline",
  track: "Fraud & AML Analytics",
  module: "Deteksi Analitik",
  title: "FR31 — GenAI-Assisted Detection Pipeline: LLM di Meja Triase",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Seribu alert, satu malam, dan seorang analis yang kehabisan jam",
      prose: [
        "Sebuah tim fraud menerima 1.000 alert dalam sehari. Sepuluh investigator, masing-masing bisa menangani 60 kasus sehari — kapasitas total 600. Setiap pagi, 400 alert menunggu tanpa pemilik, dan di antaranya ada fraud yang sedang berjalan. Solusinya bukan menambah orang, melainkan menambah satu tahap: sebuah LLM yang membaca ringkasan tiap alert — pola transaksi, catatan kasus sebelumnya, dan profil nasabah — lalu memutuskan mana yang bisa ditutup otomatis sebagai jinak dan mana yang harus naik ke manusia.",
        "Hasilnya setelah satu bulan: LLM menutup 420 alert sebagai jinak dan menaikkan 580 ke investigator — masih di dalam kapasitas 600 per hari. Dari 580 itu, 522 terbukti fraud — precision 90,0 persen. Dari 600 kasus fraud yang tercatat di himpunan evaluasi berlabel hari itu (kasus terkonfirmasi lewat audit pasca-hoc dan review sampel — lihat catatan di Langkah 4 tentang batas angka ini), 522 tertangkap — recall 87,0 persen. Biayanya: LLM Rp150 per alert, total Rp150.000 — sementara investigator menghemat Rp10.350.000 per hari dibanding memeriksa semuanya sendiri. Lesson ini mengajarkan cara merancang pipeline itu — dan garis pengaman yang membuat LLM tetap menjadi asisten, bukan hakim.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "FR19 mengajarkan NLP untuk phishing dan FR7 mengajarkan supervised ML klasik, tetapi tidak ada lesson tentang pipeline deteksi berbantuan GenAI: LLM sebagai triase, RAG atas catatan kasus, dan evaluasi precision-recall plus biaya dari pipeline itu sendiri. Lesson ini membangun pipeline-nya, bukan sekadar modelnya.",
      },
      reference: "1.000 alert: LLM tutup 420, naikkan 580 (kapasitas 600/hari); 522 fraud tertangkap. Precision 90,0 persen; recall 87,0 persen (terhadap 600 fraud berlabel); hemat Rp10.350.000 per hari.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang dan menilai pipeline deteksi berbantuan LLM.",
        "(1) Menjelaskan tiga peran LLM di pipeline deteksi: triase, ringkasan, dan pencarian kasus serupa;",
        "(2) Menghitung precision, recall, dan penghematan biaya pipeline;",
        "(3) Menjelaskan RAG atas catatan kasus sebagai memori investigator;",
        "(4) Menetapkan garis pengaman: LLM tidak pernah memblokir nasabah sendirian;",
        "(5) Merancang evaluasi berkelanjutan dan ambang rollback.",
      ],
      tasks: [],
    },
    {
      id: "tiga-peran",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga peran LLM: triase, ringkasan, memori",
      prose: [
        "Peran pertama: triase. LLM membaca ringkasan alert dan mengklasifikasikannya — jinak, butuh manusia, atau darurat. Ia tidak membaca data mentah nasabah; ia membaca fitur yang sudah diringkas — velocity, deviasi dari baseline, dan riwayat device. Dalam desain AWAL pipeline ini, batasnya berbunyi: LLM boleh menutup alert sebagai jinak bila skor keyakinannya tinggi — termasuk pola yang belum pernah dilihat, karena tidak ada preseden yang menahannya. Itulah cacat desain yang terungkap di mini-case: 'tidak dikenal' diperlakukan sama dengan 'jinak', dan 40 alert pola baru ditutup begitu saja. Aturan yang benar — dan yang dipakai setelah perbaikan di Langkah 6 — adalah: LLM hanya boleh menutup yang ia KENALI sebagai jinak; yang tidak dikenal wajib naik ke manusia. Jangan baca langkah ini seolah aturan yang benar sudah berlaku sejak awal; mini-case adalah cerita tentang memperbaikinya.",
        "Peran kedua: ringkasan kasus. Sebelum investigator membuka satu kasus, LLM sudah menulis satu paragraf: apa yang aneh, apa yang normal, dan tiga kasus serupa dari masa lalu beserta hasilnya. Investigator yang dulu butuh 20 menit membaca log kini butuh 5 menit — dan keputusannya lebih baik karena ia melihat preseden, bukan hanya data mentah.",
        "Peran ketiga: memori lewat RAG. Catatan investigasi lama — ribuan halaman yang tidak pernah dibaca ulang — diindeks sehingga LLM bisa mengambil kasus serupa saat triase. Inilah yang membuat pipeline makin pintar tanpa retraining: setiap kasus yang ditutup menambah memori. Tetapi memori itu harus dijaga: catatan yang salah dan masuk ke indeks akan diulang oleh LLM berkali-kali — garbage in, gospel out.",
      ],
      tasks: [],
      note: {
        title: "LLM membaca ringkasan, bukan data mentah",
        body: "Memberi LLM akses langsung ke data mentah nasabah adalah risiko privasi dan biaya yang tidak perlu. Pipeline yang benar: model klasik menghitung fitur, LLM membaca fitur dan ringkasan itu. LLM tidak pernah melihat nomor rekening, nama, atau alamat — ia melihat pola.",
      },
      reference: "Triase, ringkasan kasus, RAG atas catatan lama — tiga peran, satu garis: LLM membaca ringkasan.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Menilai pipeline: precision, recall, dan rupiah",
      prose: [
        "Precision pipeline: dari 580 alert yang dinaikkan, 522 terbukti fraud — 522 dibagi 580 dikali 100 sama dengan 90,0 persen. Artinya satu dari sepuluh kasus yang sampai ke investigator adalah false alarm — beban yang masih wajar. Recall pipeline: dari 600 fraud yang tercatat di himpunan evaluasi berlabel, 522 tertangkap — 522 dibagi 600 dikali 100 sama dengan 87,0 persen. Artinya 78 kasus fraud lolos — sebagian karena LLM menutupnya sebagai jinak, sebagian karena tidak pernah menjadi alert. Catatan penting tentang angka 600: ia BUKAN jumlah fraud sejati yang tidak mungkin diketahui — fraud yang tidak pernah menjadi alert dan tidak pernah ditemukan tidak masuk ke penyebut mana pun. Angka 600 berasal dari proses pelabelan pasca-hoc (audit + review sampel atas alert yang ditutup dan transaksi yang tidak pernah menjadi alert); recall 87,0 persen adalah recall TERHADAP fraud yang diketahui lewat proses itu — perkiraan, bukan kebenaran mutlak. Tanpa proses pelabelan seperti itu, recall tidak bisa dihitung sama sekali; dan bila proses pelabelannya lemah, recall terlihat lebih baik dari kenyataannya.",
        "Biayanya dihitung dengan jujur. Semua-manusia: 1.000 alert dikali Rp25.000 sama dengan Rp25.000.000 per hari. Dengan LLM: 580 alert manusia dikali Rp25.000 sama dengan Rp14.500.000, ditambah LLM 1.000 dikali Rp150 sama dengan Rp150.000 — total Rp14.650.000. Penghematan Rp10.350.000, atau 41,4 persen. Tetapi penghematan itu hanya sah bila recall tidak jatuh: menghemat Rp10 juta sambil kehilangan 78 kasus fraud adalah penghematan palsu bila satu kasus rata-rata merugikan Rp150 juta.",
        "Garis pengaman yang tidak boleh dilanggar: LLM tidak pernah memblokir nasabah, menutup rekening, atau melaporkan ke regulator sendirian. Setiap keputusan yang merugikan nasabah wajib ditandatangani manusia. Dan pipeline punya ambang rollback: bila precision mingguan turun di bawah 80 persen atau recall di bawah 80 persen selama dua minggu berturut-turut, LLM dimatikan kembali ke triase aturan lama sampai penyebabnya ketahuan. Perhatikan batasnya: 'di bawah 80 persen' berarti KURANG DARI 80 — tepat 80,0 persen BELUM memicu rollback, ia memicu peringatan.",
      ],
      tasks: [],
      note: {
        title: "78 kasus yang lolos adalah metrik terpenting",
        body: "Tim yang hanya memamerkan precision 90 persen menyembunyikan recall 87 persen — 78 fraud yang lolos. Selalu laporkan keduanya berdampingan, plus biaya dari yang lolos. Pipeline yang hemat tetapi bocor adalah pipeline yang gagal dengan angka yang bagus.",
      },
      reference: "Precision 90,0 persen; recall 87,0 persen; hemat Rp10.350.000 (41,4 persen) per hari.",
    },
    {
      id: "lab-genai",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung precision, recall, dan hemat pipeline",
      prose: [
        "Lab ini menghitung tiga angka pipeline dari data satu hari operasional: precision, recall, dan persentase penghematan biaya. Hitung dulu di kepala. Precision: 522 dibagi 580 dikali 100 sama dengan 90,0 persen. Recall: 522 dibagi 600 dikali 100 sama dengan 87,0 persen — terhadap 600 fraud berlabel dari proses pelabelan pasca-hoc (lihat Langkah 4). Penghematan: biaya semua-manusia Rp25.000.000 dikurangi biaya pipeline Rp14.650.000 sama dengan Rp10.350.000; 10.350.000 dibagi 25.000.000 dikali 100 sama dengan 41,4 persen.",
        "Tugas lab: isi tiga variabel — precision, recall, hemat_pct — lalu cetak ketiganya. Tiga angka ini adalah laporan mingguan pipeline ke manajemen: apakah LLM membantu, apakah ia bocor, dan apakah ia sepadan.",
        "Setelah lolos, coba eksperimen: turunkan kasus tertangkap menjadi 480 dan lihat recall jatuh ke 80,0 persen — TEPAT di ambang: karena aturannya 'DI BAWAH 80 persen', 80,0 persen tepat BELUM memicu rollback — ia memicu peringatan; turunkan satu lagi menjadi 479 (79,8 persen) dan bila bertahan dua minggu berturut-turut, barulah rollback ke triase aturan lama. Lalu tanyakan: apakah pipeline ini masih boleh jalan? Jawabannya: satu minggu di 80,0 persen berarti peringatan; dua minggu berturut-turut di bawah 80 persen berarti rollback.",
      ],
      tasks: [
        { id: "t1", text: "Hitung precision pipeline dalam persen" },
        { id: "t2", text: "Hitung recall pipeline dalam persen" },
        { id: "t3", text: "Hitung penghematan biaya dalam persen" },
      ],
      expected: "precision=90.0\nrecall=87.0\nhemat_pct=41.4",
      hints: [
        "Precision = fraud tertangkap dibagi alert yang dinaikkan, dikali 100.",
        "Recall = fraud tertangkap dibagi total fraud sebenarnya, dikali 100.",
        "Biaya pipeline = 580 x 25.000 + 1.000 x 150; hemat = (25.000.000 - biaya) / 25.000.000 x 100.",
      ],
      code: {
        starter: "# Pipeline GenAI sebulan (Rp). JANGAN UBAH.\ndinaikkan = 580\ntertangkap = 522\ntotal_fraud = 600\nbiaya_manusia = 25000000\nbiaya_pipeline = 580 * 25000 + 1000 * 150\n\n# TULIS KODEMU: precision, recall, hemat persen\nprecision = \nrecall = \nhemat_pct = \nprint(f\"precision={round(precision, 1)}\")\nprint(f\"recall={round(recall, 1)}\")\nprint(f\"hemat_pct={round(hemat_pct, 1)}\")",
        lockLines: 6,
        solution: "# Pipeline GenAI sebulan (Rp). JANGAN UBAH.\ndinaikkan = 580\ntertangkap = 522\ntotal_fraud = 600\nbiaya_manusia = 25000000\nbiaya_pipeline = 580 * 25000 + 1000 * 150\n\n# TULIS KODEMU: precision, recall, hemat persen\nprecision = tertangkap / dinaikkan * 100\nrecall = tertangkap / total_fraud * 100\nhemat_pct = (biaya_manusia - biaya_pipeline) / biaya_manusia * 100\nprint(f\"precision={round(precision, 1)}\")\nprint(f\"recall={round(recall, 1)}\")\nprint(f\"hemat_pct={round(hemat_pct, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "precision=90.0", label: "Precision 90,0 persen", msg: "522 / 580 x 100 = 90,0. Satu dari sepuluh kasus yang naik adalah false alarm." },
          { kind: "stdout_matches", task: "t2", pattern: "recall=87.0", label: "Recall 87,0 persen", msg: "522 / 600 x 100 = 87,0. 78 kasus fraud lolos — laporkan selalu bersama precision." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat_pct=41.4", label: "Hemat 41,4 persen", msg: "(25.000.000 - 14.650.000) / 25.000.000 x 100 = 41,4. Hemat hanya sah bila recall tidak jatuh." },
        ],
      },
      reference: "Precision 90,0 persen; recall 87,0 persen; hemat 41,4 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: malam LLM menutup fraud yang sedang berjalan",
      prose: [
        "Pada minggu ketiga, sebuah fraud pola baru muncul: penipu memakai pola yang belum pernah ada di catatan kasus. LLM menutup 40 alert pola itu sebagai jinak — karena tidak ada presedennya di memori RAG. Tiga hari kemudian, investigator manusia menemukan pola itu dari laporan nasabah: Rp890 juta sudah hilang. Pipeline itu tidak salah dalam logikanya — ia melakukan persis apa yang dirancang: menutup yang tidak dikenal sebagai jinak. Rancangannya yang salah.",
        "Perbaikannya: aturan 'tidak dikenal berarti naik'. Alert yang polanya tidak ada di memori RAG — yang tidak bisa dijelaskan oleh preseden mana pun — wajib naik ke manusia, bukan ditutup. Prinsipnya: LLM boleh menutup yang ia kenali sebagai jinak; ia tidak boleh menutup yang ia tidak kenali sama sekali. Ketidaktahuan adalah alasan eskalasi, bukan alasan penutupan.",
        "Setelah aturan itu, jumlah alert yang naik bertambah 90 per hari — tetapi recall naik dari 87,0 persen menjadi 94,0 persen, dan tidak ada lagi pola baru yang lolos tiga hari. Biaya tambahannya Rp2.250.000 per hari — murah dibanding satu pola baru yang lolos. Pelajaran yang dicatat: di fraud, yang paling berbahaya bukan yang salah dikenali, melainkan yang tidak dikenali.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini benar. Pertama, kegagalan diakui sebagai kegagalan desain, bukan kegagalan model. Kedua, aturan baru bersifat umum — 'tidak dikenal berarti naik' — bukan tambalan untuk satu pola. Ketiga, trade-off dihitung: Rp2.250.000 per hari melawan satu pola baru yang lolos.",
      },
      reference: "40 alert pola baru ditutup sebagai jinak; Rp890 juta hilang. Aturan baru: tidak dikenal berarti naik.",
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
        "Tiga peran LLM: triase, ringkasan kasus, memori lewat RAG.",
        "Lab: precision 90,0 persen; recall 87,0 persen; hemat 41,4 persen.",
        "LLM membaca ringkasan fitur, bukan data mentah nasabah.",
        "Garis pengaman: LLM tidak pernah memblokir nasabah sendirian; rollback bila precision atau recall di bawah 80 persen dua minggu (tepat 80,0 persen = peringatan, bukan rollback).",
        "Tidak dikenal berarti naik — ketidaktahuan adalah alasan eskalasi.",
      ],
      next: { label: "FR32 — Audit Independen Program AML: Menguji Penjaga", href: "/v2/learn/fr32-audit-independen-aml" },
      quiz: [
        {
          q: "580 alert dinaikkan, 522 fraud tertangkap, total fraud sebenarnya 600. Berapa precision dan recall?",
          options: [
            { text: "Precision 90,0 persen; recall 87,0 persen", why: "Tepat: 522/580 = 90,0; 522/600 = 87,0 — recall terhadap fraud berlabel dari proses pelabelan pasca-hoc.", correct: true },
            { text: "Precision 87,0 persen; recall 90,0 persen — tertukar", why: "Salah: precision memakai pembagi alert yang dinaikkan (580), recall memakai pembagi total fraud (600)." },
            { text: "Precision 90,0 persen; recall 90,0 persen", why: "Salah: recall 522/600 = 87,0, bukan 90,0." },
            { text: "Precision 58,0 persen; recall 60,0 persen", why: "Salah: itu proporsi alert yang dinaikkan dan fraud dari total alert — bukan precision dan recall." },
          ],
        },
        {
          q: "Biaya semua-manusia Rp25.000.000; biaya pipeline Rp14.650.000. Berapa penghematannya?",
          options: [
            { text: "Rp10.350.000 atau 41,4 persen", why: "Tepat: 25.000.000 - 14.650.000 = 10.350.000; 10.350.000/25.000.000 = 41,4 persen.", correct: true },
            { text: "Rp14.650.000 atau 58,6 persen", why: "Salah: itu biaya pipeline-nya, bukan penghematannya." },
            { text: "Rp150.000 — hanya biaya LLM", why: "Salah: penghematan adalah selisih total biaya, bukan biaya LLM saja." },
            { text: "Rp25.000.000 atau 100 persen", why: "Salah: pipeline masih memakai investigator untuk 580 alert — biayanya tidak nol." },
          ],
        },
        {
          q: "LLM menemukan alert dengan pola yang belum pernah ada di catatan kasus. Apa yang harus dilakukan?",
          options: [
            { text: "Tutup sebagai jinak — tidak ada preseden berarti tidak ada fraud", why: "Salah: tidak ada preseden justru berarti tidak diketahui. Inilah kegagalan di mini-case: 40 alert ditutup, Rp890 juta hilang." },
            { text: "Naikkan ke manusia — tidak dikenal berarti naik", why: "Tepat: ketidaktahuan adalah alasan eskalasi, bukan alasan penutupan.", correct: true },
            { text: "Tutup sebagai jinak tetapi catat polanya", why: "Salah: mencatat tidak menghentikan fraud yang sedang berjalan. Pola baru harus dilihat manusia segera." },
            { text: "Blokir nasabahnya langsung", why: "Salah: LLM tidak pernah memblokir nasabah sendirian — keputusan yang merugikan nasabah wajib ditandatangani manusia." },
          ],
        },
        {
          q: "Precision pipeline turun di bawah 80 persen selama dua minggu berturut-turut. Apa respons yang benar?",
          options: [
            { text: "Terus jalan — precision akan pulih sendiri", why: "Salah: ambang rollback ada untuk dipakai. Dua minggu di bawah 80 persen berarti rollback ke triase aturan lama." },
            { text: "Rollback ke triase aturan lama sampai penyebabnya ketahuan", why: "Tepat: itulah fungsi ambang rollback.", correct: true },
            { text: "Naikkan ambang LLM agar lebih sedikit alert yang naik", why: "Salah: menaikkan ambang saat precision jatuh akan menurunkan recall lebih jauh." },
            { text: "Matikan pipeline selamanya", why: "Salah: rollback bersifat sementara — sampai penyebab ketahuan dan diperbaiki." },
          ],
        },
        {
          q: "Kenapa LLM di pipeline ini hanya membaca ringkasan fitur, bukan data mentah nasabah?",
          options: [
            { text: "Karena LLM tidak bisa membaca data mentah", why: "Salah: LLM bisa, tetapi tidak seharusnya — ini soal privasi dan biaya, bukan kemampuan." },
            { text: "Karena privasi dan biaya: ringkasan sudah cukup untuk triase, dan data mentah tidak perlu keluar", why: "Tepat: model klasik menghitung fitur, LLM membaca ringkasannya.", correct: true },
            { text: "Karena data mentah terlalu besar untuk prompt", why: "Salah: ukuran bukan alasan utamanya — privasi dan pemisahan tanggung jawab adalah alasannya." },
            { text: "Karena regulator melarang LLM melihat data apa pun", why: "Salah: tidak ada larangan seperti itu — yang diatur adalah akses ke data pribadi tanpa keperluan." },
          ],
        },
      ],
    },
  ],
};
