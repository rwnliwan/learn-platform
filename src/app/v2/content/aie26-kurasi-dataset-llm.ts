import type { V2Lesson } from "../lib/types";

export const aie26: V2Lesson = {
  slug: "aie26-kurasi-dataset-llm",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE26 — Kurasi Dataset untuk LLM: dari 2 Juta ke 1,45 Juta yang Layak",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang dilatih 2 juta dokumen — 27 persennya sampah",
      prose: [
        "Tim NusaBank mengumpulkan 2 juta dokumen untuk SFT chatbot: dari web, manual, dan tiket lama. Training pertama menghasilkan model yang menjawab dengan bahasa campur aduk, kadang membocorkan nomor telepon nasabah dari data training, dan — yang paling memalukan — menghafal jawaban test set karena 42 dari 850 soal tes bocor ke dalam data training (kontaminasi 4,9 persen). Audit kurasi menemukan: 12 persen duplikat dekat, 3 persen mengandung PII, 15 persen berkualitas rendah. Setelah kurasi: 1.451.120 dokumen tersisa (72,6 persen) — dan model kedua mengalahkan yang pertama di semua metrik.",
        "Kurasi dataset LLM adalah pekerjaan sebelum training: dedup, decontaminasi, filter PII, dan filter kualitas. Ia menentukan apakah model belajar dari pengetahuan atau dari sampah — dan apakah evaluasimu jujur atau bocor.",
        "Setelah lesson ini kamu bisa: (1) menghitung hasil tiap tahap kurasi; (2) menjelaskan dedup dekat dengan MinHash; (3) menghitung kontaminasi test set; (4) merancang filter PII dan kualitas; (5) memutuskan ambang kualitas yang sepadan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "AIE15 mengajarkan data sintetis untuk EVALUASI dan MLE33 mengajarkan data-centric untuk ML klasik — tetapi tidak ada lesson kurasi dataset untuk LLM training (dedup, decontaminasi, PII, filter kualitas sebagai pipeline). Lesson ini membangunnya, dengan lab yang menghitung penyusutan korpus tahap demi tahap.",
      },
      reference: "2.000.000 → dedup 1.760.000 → PII 1.707.200 → kualitas 1.451.120 (72,6 persen); kontaminasi 42/850 = 4,9 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menyerahkan dataset ke training dengan keyakinan — dan bukti.",
        "(1) Menghitung penyusutan korpus per tahap kurasi;",
        "(2) Menjelaskan dedup dekat (MinHash + LSH) dalam satu paragraf;",
        "(3) Menghitung kontaminasi test set dan vonisnya;",
        "(4) Merancang filter PII (regex + NER + audit sampel);",
        "(5) Menjelaskan trade-off filter kualitas yang terlalu agresif.",
      ],
      tasks: [],
    },
    {
      id: "tahap-kurasi",
      eyebrow: "Langkah 3 · Teori",
      title: "Empat tahap: dedup, PII, kualitas, decontaminasi",
      prose: [
        "Tahap 1 — Dedup dekat: dokumen yang 90 persen sama (salinan web, template berulang) memberi bobot berlebih pada satu pola dan membuang komputasi. MinHash + LSH menemukan duplikat dekat tanpa membandingkan semua pasangan (2 juta dokumen = 2 triliun pasangan — mustahil). Hasil: 12 persen terbuang — 2.000.000 menjadi 1.760.000.",
        "Tahap 2 — Filter PII: nomor telepon, NIK, email, nomor rekening. Regex menangkap pola terstruktur; NER menangkap nama dan alamat; audit sampel manusia menangkap yang lolos keduanya. Hasil: 3 persen dari sisa terbuang — 1.760.000 menjadi 1.707.200. PII yang lolos bukan hanya masalah privasi — model yang menghafal PII akan MEMBOCORKANNYA saat ditanya dengan cara yang tepat.",
        "Tahap 3 — Filter kualitas: buang 15 persen terbawah menurut skor kualitas (classifier kualitas, heuristik panjang, rasio bahasa, deteksi boilerplate). Hasil: 1.707.200 menjadi 1.451.120. Total terbuang: 548.880 dokumen, 27,4 persen korpus. Tahap 4 — Decontaminasi: bandingkan korpus dengan test set (n-gram overlap); 42 dari 850 soal tes ditemukan di korpus = kontaminasi 4,9 persen — di atas ambang 1 persen, WAJIB dibuang sebelum training, karena evaluasi atas test yang bocor adalah kebohongan.",
      ],
      tasks: [],
      note: {
        title: "Filter yang terlalu agresif juga merusak",
        body: "Membuang 15 persen terbawah berdasarkan 'kualitas' bisa membuang dialek, bahasa daerah, dan gaya informal — model menjadi fasih dalam bahasa formal dan bisu dalam bahasa pengguna. Filter kualitas harus diuji biasnya: bandingkan distribusi bahasa/dialek sebelum dan sesudah filter. Kurasi yang membersihkan keberagaman adalah kurasi yang merusak.",
      },
      reference: "Terbuang 548.880 (27,4 persen); kontaminasi 4,9 persen di atas ambang 1 persen.",
    },
    {
      id: "decontaminasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Decontaminasi: menjaga kejujuran evaluasi",
      prose: [
        "Kontaminasi terjadi bila test set (atau soal yang mirip) ada di data training. Model tidak 'pintar' — ia menghafal jawaban. Kontaminasi 4,9 persen (42 dari 850) cukup untuk menggelembungkan skor beberapa poin dan membuat perbandingan model menjadi tidak valid. Ambang industri: di bawah 1 persen bisa diterima dengan catatan; di atas itu, buang dokumen yang terkontaminasi dan latih ulang.",
        "Cara mendeteksi: n-gram overlap — bila 13-gram dari soal tes muncul di dokumen training, tandai sebagai kontaminasi. Batas 13-gram cukup panjang untuk menghindari positif palsu ('saya ingin membuka rekening' muncul di mana-mana), cukup pendek untuk menangkap soal yang disalin. Untuk soal yang diparafrasa, tambahkan deteksi embedding (kesamaan semantik di atas 0,9).",
        "Aturan keras: decontaminasi dilakukan SEBELUM training, terhadap test set yang DISEGEL (tidak pernah dilihat tim training). Test set yang pernah dibaca tim — apalagi dipakai untuk memilih model — bukan lagi test set; ia validation set yang sudah terkontaminasi secara manusiawi. Segel test set seperti segel soal ujian: yang memegang kunci bukan yang membuat soal.",
      ],
      tasks: [],
      note: {
        title: "Kontaminasi manusiawi",
        body: "Bentuk kontaminasi yang paling sulit dideteksi: engineer yang membaca test set lalu 'secara tidak sengaja' menulis data training yang mirip. Tidak ada n-gram yang menangkap ini. Obatnya prosedural: pemisahan tugas (tim training tidak memegang test set) dan audit berkala. Teknologi menangkap salinan; prosedur menangkap niat.",
      },
      reference: "Kontaminasi 4,9 persen; ambang 1 persen; n-gram 13 sebagai detektor.",
    },
    {
      id: "lab-kurasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: penyusutan korpus dan kontaminasi",
      prose: [
        "Lab ini menghitung pipeline kurasi dari angka mentah: jumlah dokumen setelah tiap tahap dan tingkat kontaminasi.",
        "Hitung dulu di kepala. Setelah dedup (buang 12 persen): 2.000.000 x 0,88 = 1.760.000. Setelah PII (buang 3 persen): 1.760.000 x 0,97 = 1.707.200. Setelah kualitas (buang 15 persen): 1.707.200 x 0,85 = 1.451.120. Kontaminasi: 42 / 850 x 100 = 4,9 persen.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: dedup, pii, final, terbuang_persen, kontaminasi. Lima angka ini adalah laporan kurasi — lampirkan ke setiap training run, supaya 'modelnya bagus' bisa ditelusuri ke 'datanya bersih'.",
        "Setelah lolos, coba eksperimen: naikkan filter kualitas menjadi 25 persen dan lihat final menjadi 1.280.400 — lalu tanyakan: apakah 170 ribu dokumen tambahan yang dibuang sepadan dengan risiko membuang dialek pengguna?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dedup` (buang 12 persen) dan `pii` (buang 3 persen dari sisa)" },
        { id: "t2", text: "Hitung `final` (buang 15 persen dari sisa) dan `terbuang_persen` total" },
        { id: "t3", text: "Hitung `kontaminasi` (42 dari 850 soal)" },
      ],
      expected: "dedup=1760000\npii=1707200\nfinal=1451120\nterbuang_persen=27.4\nkontaminasi=4.9",
      hints: [
        "Tiap tahap mengalikan SISA, bukan total awal.",
        "Terbuang persen = (awal - final) / awal x 100; bulatkan 1 desimal.",
        "Kontaminasi persen = 42 / 850 x 100; bulatkan 1 desimal.",
      ],
      code: {
        starter: `# Pipeline kurasi dataset LLM: dedup, PII, kualitas, kontaminasi.\nawal = 2_000_000\nbuang_dedup, buang_pii, buang_kualitas = 0.12, 0.03, 0.15\nsoal_terkontaminasi, soal_total = 42, 850\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ndedup = \npii = \nfinal = \nterbuang_persen = \nkontaminasi = \n\nprint(f"dedup={dedup}")\nprint(f"pii={pii}")\nprint(f"final={final}")\nprint(f"terbuang_persen={round(terbuang_persen, 1)}")\nprint(f"kontaminasi={round(kontaminasi, 1)}")`,
        lockLines: 3,
        solution: `# Pipeline kurasi dataset LLM: dedup, PII, kualitas, kontaminasi.\nawal = 2_000_000\nbuang_dedup, buang_pii, buang_kualitas = 0.12, 0.03, 0.15\nsoal_terkontaminasi, soal_total = 42, 850\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ndedup = int(awal * (1 - buang_dedup))\npii = int(dedup * (1 - buang_pii))\nfinal = int(pii * (1 - buang_kualitas))\nterbuang_persen = (awal - final) / awal * 100\nkontaminasi = soal_terkontaminasi / soal_total * 100\n\nprint(f"dedup={dedup}")\nprint(f"pii={pii}")\nprint(f"final={final}")\nprint(f"terbuang_persen={round(terbuang_persen, 1)}")\nprint(f"kontaminasi={round(kontaminasi, 1)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dedup", value: 1760000, tol: 1e-9, label: "`dedup` seharusnya 1760000", msg: "2.000.000 x 0,88 = 1.760.000." },
          { kind: "equal", task: "t1", name: "pii", value: 1707200, tol: 1e-9, label: "`pii` seharusnya 1707200", msg: "1.760.000 x 0,97 = 1.707.200." },
          { kind: "equal", task: "t2", name: "final", value: 1451120, tol: 1e-9, label: "`final` seharusnya 1451120", msg: "1.707.200 x 0,85 = 1.451.120." },
          { kind: "equal", task: "t2", name: "terbuang_persen", value: 27.4, tol: 0.1, label: "`terbuang_persen` seharusnya 27.4", msg: "548.880/2.000.000 = 27,4 persen." },
          { kind: "equal", task: "t3", name: "kontaminasi", value: 4.9, tol: 0.1, label: "`kontaminasi` seharusnya 4.9", msg: "42/850 = 4,9 persen — di atas ambang 1 persen." },
        ],
      },
      reference: "1.760.000 → 1.707.200 → 1.451.120; terbuang 27,4 persen; kontaminasi 4,9 persen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: kurasi apa, seberapa agresif",
      prose: [
        "Skenario 1 — Korpus web mentah untuk pretraining. → Dedup + PII + kualitas agresif. Alasan: web penuh duplikat dan sampah; volume besar memberi ruang membuang.",
        "Skenario 2 — Data SFT kecil (5.000 contoh) berkualitas. → Kurasi manual + audit, bukan filter otomatis agresif. Alasan: tiap contoh berharga; filter otomatis akan membuang yang sulit tetapi benar.",
        "Skenario 3 — Data mengandung PII nasabah. → Filter PII + audit sampel + enkripsi sisa. Alasan: PII yang lolos adalah kebocoran yang menunggu terjadi.",
        "Skenario 4 — Kontaminasi di atas 1 persen. → Buang dokumen terkontaminasi, latih ulang. Alasan: evaluasi yang bocor lebih buruk dari tidak ada evaluasi.",
        "Skenario 5 — Filter kualitas membuang dialek/bahasa daerah. → Longgarkan filter + tambah data dialek. Alasan: model yang hanya fasih bahasa formal adalah model yang bisu untuk sebagian pengguna.",
        "Aturan praktis: kurasi adalah pipeline dengan laporan — tiap tahap mencatat berapa yang dibuang dan mengapa. Korpus tanpa laporan kurasi adalah korpus yang tidak bisa dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Kurasi adalah versi data dari code review",
        body: "Tidak ada engineer yang mengirim kode tanpa review; tidak ada tim yang boleh melatih model tanpa laporan kurasi. Keduanya punya fungsi yang sama: menangkap kesalahan sebelum menjadi mahal. Jadikan laporan kurasi sebagai gerbang pipeline (LLMOps24) — training tidak jalan tanpa laporan itu.",
      },
      reference: "Web mentah = agresif; SFT kecil = manual; PII = filter + audit; kontaminasi di atas 1 persen = buang + latih ulang.",
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
        "2.000.000 → 1.760.000 → 1.707.200 → 1.451.120 (terbuang 27,4 persen).",
        "Kontaminasi 42/850 = 4,9 persen — di atas ambang 1 persen, wajib buang.",
        "MinHash + LSH untuk dedup dekat tanpa pasangan kuadratik.",
        "PII: regex + NER + audit sampel manusia.",
        "Filter agresif bisa membuang dialek — uji bias filter.",
      ],
      next: { label: "AIE27 — Pemilihan Model & Benchmarking: Frontier Biaya-Kualitas", href: "/v2/learn/aie27-pemilihan-model-benchmarking" },
      quiz: [
        {
          q: "2.000.000 dokumen: buang 12 persen (dedup), lalu 3 persen (PII), lalu 15 persen (kualitas). Berapa final?",
          options: [
            { text: "1.451.120", why: "Tepat: 2.000.000 x 0,88 x 0,97 x 0,85 = 1.451.120.", correct: true },
            { text: "1.400.000 — 30 persen dari total awal", why: "Salah: persen tiap tahap mengalikan SISA, bukan total awal; 12+3+15 = 30 tidak berlaku." },
            { text: "1.760.000 — hanya dedup yang dihitung", why: "Salah: itu setelah tahap pertama saja; masih ada PII dan kualitas." },
            { text: "1.707.200 — setelah PII", why: "Salah: itu setelah tahap kedua; masih ada filter kualitas 15 persen." },
          ],
        },
        {
          q: "Kontaminasi 42 dari 850 soal (4,9 persen). Apa vonisnya?",
          options: [
            { text: "Bisa diterima — di bawah 5 persen", why: "Salah: ambang industri 1 persen; 4,9 persen jauh di atasnya." },
            { text: "Wajib buang dokumen terkontaminasi dan latih ulang", why: "Tepat: evaluasi atas test yang bocor adalah kebohongan.", correct: true },
            { text: "Ganti test set saja — training tetap jalan", why: "Salah: mengganti test set setelah kontaminasi diketahui menyembunyikan masalah, bukan menyelesaikannya." },
            { text: "Tidak masalah — model menghafal itu bagus", why: "Salah: menghafal jawaban test bukan kecerdasan; skornya palsu." },
          ],
        },
        {
          q: "Mengapa dedup memakai MinHash + LSH, bukan perbandingan semua pasangan?",
          options: [
            { text: "Karena 2 juta dokumen berarti 2 triliun pasangan — mustahil", why: "Tepat: LSH menemukan kandidat duplikat tanpa pasangan kuadratik.", correct: true },
            { text: "Karena MinHash lebih akurat dari perbandingan langsung", why: "Salah: MinHash adalah aproksimasi; keunggulannya kecepatan, bukan akurasi." },
            { text: "Karena duplikat tidak penting", why: "Salah: duplikat 12 persen memberi bobot berlebih dan membuang komputasi." },
            { text: "Karena LSH menghapus PII juga", why: "Salah: LSH untuk kesamaan dokumen; PII butuh filter terpisah." },
          ],
        },
        {
          q: "Filter kualitas membuang banyak dokumen berbahasa daerah. Apa yang benar?",
          options: [
            { text: "Biarkan — bahasa daerah memang berkualitas rendah", why: "Salah: itu bias filter, bukan kualitas; model menjadi bisu untuk sebagian pengguna." },
            { text: "Longgarkan filter + tambah data dialek; uji bias filter", why: "Tepat: kurasi yang membersihkan keberagaman adalah kurasi yang merusak.", correct: true },
            { text: "Buang semua bahasa daerah agar konsisten", why: "Salah: konsistensi yang dicapai dengan menghapus pengguna bukanlah konsistensi." },
            { text: "Naikkan ambang filter agar lebih banyak terbuang", why: "Salah: itu memperparah bias, bukan memperbaikinya." },
          ],
        },
        {
          q: "Siapa yang boleh memegang test set yang disegel?",
          options: [
            { text: "Tim training — agar mereka tahu targetnya", why: "Salah: itu kontaminasi manusiawi; tim training tidak boleh memegang test set." },
            { text: "Pihak terpisah dari tim training — pemisahan tugas", why: "Tepat: yang memegang kunci bukan yang membuat soal.", correct: true },
            { text: "Semua orang — transparansi total", why: "Salah: transparansi total menghancurkan kejujuran evaluasi." },
            { text: "Tidak ada — test set tidak boleh ada", why: "Salah: test set harus ada; yang diatur adalah SIAPA yang memegangnya." },
          ],
        },
      ],
    },
  ],
};
