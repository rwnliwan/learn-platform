import type { V2Lesson } from "../lib/types";

export const mle32: V2Lesson = {
  slug: "mle32-edge-ml-onnx-tflite",
  track: "Machine Learning Engineer",
  module: "Serving",
  title: "MLE32 — Edge ML & ONNX/TFLite: Model yang Muat di Saku",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Skor kredit yang harus dijawab di HP tanpa sinyal",
      prose: [
        "Agen lapangan KirimCepat menilai kelayakan toko di daerah tanpa sinyal: aplikasi harus memberi skor kredit dalam 20 milidetik, tanpa internet, di HP seharga 2 jutaan. Model server mereka — 2,4 juta parameter FP32, 9,6 MB — terlalu besar untuk aplikasi dan terlalu lambat bila dipanggil lewat API yang tidak ada. Solusinya: konversi ke ONNX untuk format portable, kuantisasi INT8 menjadi 2,4 MB, lalu TFLite 2,7 MB termasuk metadata — dan verifikasi paritas: output di HP tidak boleh menyimpang lebih dari 0,01 dari output server.",
        "Edge ML adalah ML yang pindah rumah: dari server ke perangkat pengguna. Keuntungannya nyata — latensi 120 ms menjadi 18 ms (6,67x lebih cepat), privasi (data tidak keluar HP), dan bekerja offline. Harganya juga nyata: model harus kecil, update sulit, dan monitoring nyaris buta. Lesson ini mengajarkan jalur konversi yang benar: dari model training ke format portable, ke format mobile, dengan paritas yang terverifikasi.",
        "Setelah lesson ini kamu bisa: (1) menghitung ukuran model FP32 vs INT8; (2) menjelaskan peran ONNX sebagai format perantara; (3) menghitung total ukuran paket TFLite; (4) merancang uji paritas dengan ambang yang disepakati; (5) memutuskan kapan edge layak dan kapan server tetap menang.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLE5 mengajarkan ONNX sebagai format aman (jangan unpickle dari luar) dan DLE10 mengajarkan kuantisasi, distilasi, dan pruning dari sudut deploy DL. Lesson ini TIDAK mengulang keduanya: ia membangun jalur edge end-to-end dari sudut MLE — model tabular/klasik ke ONNX ke TFLite, uji paritas, anggaran latensi dan baterai, serta strategi update model di perangkat yang tidak selalu online.",
      },
      reference: "FP32 9,6 MB; INT8 2,4 MB; paket TFLite 2,7 MB; latensi 120 ms menjadi 18 ms (6,67x); ambang paritas 0,01.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengirim model ke perangkat pengguna tanpa kehilangan kepercayaan padanya.",
        "(1) Menghitung ukuran model dari jumlah parameter dan presisi;",
        "(2) Menjelaskan rantai konversi: model training ke ONNX ke TFLite;",
        "(3) Menghitung ukuran paket akhir termasuk metadata;",
        "(4) Merancang uji paritas dengan ambang selisih maksimum;",
        "(5) Membandingkan latensi dan biaya edge vs server dengan angka.",
      ],
      tasks: [],
    },
    {
      id: "rantai-konversi",
      eyebrow: "Langkah 3 · Teori",
      title: "Rantai konversi: training ke ONNX ke TFLite",
      prose: [
        "Tiga format, tiga peran. Model training (misalnya scikit-learn atau PyTorch) adalah sumber kebenaran — tetapi terikat framework dan bahasa. ONNX adalah format perantara: graph operator matematika standar yang bisa dibaca runtime mana pun (ONNX Runtime, TensorRT, CoreML) tanpa mengeksekusi kode arbitrer — inilah yang membuatnya aman (MLE5). TFLite adalah format akhir untuk perangkat mobile/embedded: dioptimasi untuk CPU ARM, dengan delegasi GPU/NNAPI bila tersedia.",
        "Hitung ukuran di tiap tahap. Model 2,4 juta parameter: FP32 (4 byte) = 2.400.000 x 4 / 1.000.000 = 9,6 MB. Kuantisasi INT8 (1 byte) = 2,4 MB — seperempatnya. Paket TFLite akhir = 2,4 MB bobot + 0,3 MB metadata (nama fitur, rentang normalisasi, versi model) = 2,7 MB. Metadata bukan hiasan: tanpa rentang normalisasi yang ikut terkirim, aplikasi akan memberi input yang salah skala dan skornya diam-diam salah.",
        "Tiga jebakan konversi yang paling umum. Pertama, operator tidak didukung: operasi khusus di training tidak ada padanannya di TFLite — sederhanakan model atau tulis operator kustom sebelum konversi, bukan setelah deploy. Kedua, bentuk input dinamis yang lupa dideklarasikan: batch size terkunci 1 dan throughput hancur. Ketiga, kuantisasi tanpa kalibrasi dari data produksi: rentang aktivasi salah = akurasi jatuh 5 persen (DLE10). Aturan: konversi selalu diikuti uji paritas.",
      ],
      tasks: [],
      note: {
        title: "ONNX bukan percepatan otomatis",
        body: "ONNX hanya format — kecepatan datang dari runtime dan hardware. Model yang dikonversi ke ONNX tetapi dijalankan di runtime yang sama bisa sama cepatnya dengan aslinya. Kecepatan edge datang dari kuantisasi INT8 + runtime mobile yang dioptimasi + tidak ada network. Ukur latensi di HP target, bukan di laptop.",
      },
      reference: "9,6 MB FP32; 2,4 MB INT8; 2,7 MB paket TFLite.",
    },
    {
      id: "paritas",
      eyebrow: "Langkah 4 · Teori",
      title: "Uji paritas: bukti model HP sama dengan model server",
      prose: [
        "Konversi yang tidak diverifikasi adalah keyakinan, bukan engineering. Uji paritas membandingkan output model asli vs model hasil konversi pada sampel yang sama: 1.000 sampel produksi, hitung selisih absolut maksimum dan rata-rata. Ambang yang dipakai di lesson ini: selisih maksimum 0,01 dan rata-rata di bawah 0,002. Contoh: selisih maksimum terukur 0,004 — di bawah 0,01, lolos. Bila selisih maksimum 0,03 — gagal, kembali ke kalibrasi kuantisasi atau periksa operator yang tidak didukung.",
        "Latensi juga diukur, bukan diasumsikan. Server: 120 ms per prediksi (termasuk network). HP target: 18 ms — 6,67x lebih cepat (120 / 18 = 6,67). Tetapi ukur p99, bukan rata-rata: HP yang panas melakukan throttling dan p99 bisa 3x rata-rata. Aturan DLE10 berlaku: benchmark di HP kentang, bukan flagship.",
        "Update model di edge adalah masalah operasi, bukan masalah ML. Perangkat tidak selalu online; update harus delta (hanya bobot yang berubah), terverifikasi (hash + uji paritas pasca-update di perangkat), dan bisa rollback (simpan model lama sampai model baru lolos uji di perangkat). Model edge tanpa jalur rollback = model yang tidak bisa diperbaiki saat salah.",
      ],
      tasks: [],
      note: {
        title: "Kapan edge SALAH",
        body: "Model yang berubah tiap hari (retrain harian) tidak cocok untuk edge — biaya distribusi update melebihi manfaat latensi. Model yang butuh data segar dari server (fitur real-time) juga tidak cocok — edge hanya melihat data lokal. Dan model raksasa (LLM 7B) tidak muat di HP 2 jutaan berapa pun kuantisasinya. Edge menang bila: model stabil, input tersedia lokal, dan latensi/privasi/offline benar-benar menuntut.",
      },
      reference: "Paritas lolos bila selisih maks 0,004 di bawah ambang 0,01. Latensi 18 ms vs 120 ms.",
    },
    {
      id: "lab-edge",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: ukuran, paritas, dan speedup edge",
      prose: [
        "Lab ini menghitung anggaran edge dari angka mentah: ukuran model di tiap format, total paket, selisih paritas, dan speedup latensi.",
        "Hitung dulu di kepala. FP32: 2.400.000 x 4 / 1.000.000 = 9,6 MB. INT8: 2.400.000 x 1 / 1.000.000 = 2,4 MB. Paket TFLite: 2,4 + 0,3 = 2,7 MB. Selisih paritas maksimum 0,004 di bawah ambang 0,01 — lolos (1 = lolos). Speedup: 120 / 18 = 6,67x.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: fp32_mb, int8_mb, paket_mb, paritas_lolos (1 bila selisih maks di bawah ambang, 0 bila tidak), speedup. Lima angka ini adalah lembar spesifikasi edge — dengan ini kamu bisa menjawab 'apakah model ini muat dan cukup cepat' sebelum satu baris kode Android ditulis.",
        "Setelah lolos, coba eksperimen: naikkan parameter menjadi 10 juta dan lihat FP32 menjadi 40 MB — masih bisakah masuk batas aplikasi 50 MB setelah INT8 (10 MB)? Lalu tanyakan: pada ukuran berapa kamu berhenti memaksa edge dan kembali ke server?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fp32_mb` dan `int8_mb` dari 2,4 juta parameter" },
        { id: "t2", text: "Hitung `paket_mb` TFLite termasuk metadata 0,3 MB" },
        { id: "t3", text: "Tentukan `paritas_lolos` dan hitung `speedup` latensi" },
      ],
      expected: "fp32_mb=9.6\nint8_mb=2.4\npaket_mb=2.7\nparitas_lolos=1\nspeedup=6.67",
      hints: [
        "MB = parameter x byte per parameter / 1.000.000.",
        "Paket = bobot INT8 + metadata.",
        "Paritas lolos = 1 bila selisih maks 0,004 di bawah ambang 0,01.",
        "Speedup = latensi server / latensi HP; bulatkan 2 desimal.",
      ],
      code: {
        starter: `# Anggaran edge: ukuran model, paket TFLite, paritas, speedup.\nparams = 2_400_000\nmetadata_mb = 0.3\nselisih_maks = 0.004\nambang_paritas = 0.01\nlatensi_server = 120\nlatensi_hp = 18\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nfp32_mb = \nint8_mb = \npaket_mb = \nparitas_lolos = \nspeedup = \n\nprint(f"fp32_mb={fp32_mb}")\nprint(f"int8_mb={int8_mb}")\nprint(f"paket_mb={paket_mb}")\nprint(f"paritas_lolos={paritas_lolos}")\nprint(f"speedup={round(speedup, 2)}")`,
        lockLines: 7,
        solution: `# Anggaran edge: ukuran model, paket TFLite, paritas, speedup.\nparams = 2_400_000\nmetadata_mb = 0.3\nselisih_maks = 0.004\nambang_paritas = 0.01\nlatensi_server = 120\nlatensi_hp = 18\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nfp32_mb = params * 4 / 1e6\nint8_mb = params * 1 / 1e6\npaket_mb = int8_mb + metadata_mb\nparitas_lolos = 1 if selisih_maks < ambang_paritas else 0\nspeedup = latensi_server / latensi_hp\n\nprint(f"fp32_mb={fp32_mb}")\nprint(f"int8_mb={int8_mb}")\nprint(f"paket_mb={paket_mb}")\nprint(f"paritas_lolos={paritas_lolos}")\nprint(f"speedup={round(speedup, 2)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fp32_mb", value: 9.6, tol: 1e-9, label: "`fp32_mb` seharusnya 9.6", msg: "2,4 juta x 4 byte = 9,6 MB." },
          { kind: "equal", task: "t1", name: "int8_mb", value: 2.4, tol: 1e-9, label: "`int8_mb` seharusnya 2.4", msg: "2,4 juta x 1 byte = 2,4 MB." },
          { kind: "equal", task: "t2", name: "paket_mb", value: 2.7, tol: 1e-9, label: "`paket_mb` seharusnya 2.7", msg: "2,4 + 0,3 metadata = 2,7 MB." },
          { kind: "equal", task: "t3", name: "paritas_lolos", value: 1, tol: 1e-9, label: "`paritas_lolos` seharusnya 1", msg: "0,004 di bawah ambang 0,01 — lolos." },
          { kind: "equal", task: "t3", name: "speedup", value: 6.67, tol: 0.01, label: "`speedup` seharusnya 6.67", msg: "120 / 18 = 6,67x." },
        ],
      },
      reference: "9,6 MB; 2,4 MB; paket 2,7 MB; paritas lolos; speedup 6,67x.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: edge, server, atau hybrid",
      prose: [
        "Skenario 1 — Tanpa sinyal, latensi di bawah 20 ms, model stabil. → Edge penuh. Alasan: server tidak bisa dijangkau; latensi menuntut lokal.",
        "Skenario 2 — Model berubah tiap hari, butuh fitur real-time dari server. → Server. Alasan: edge tidak bisa mengikuti ritme update dan tidak melihat data server.",
        "Skenario 3 — HP kentang, model sedang, kadang online. → Hybrid: model kecil di edge untuk kasus umum, fallback ke server untuk kasus sulit. Alasan: 90 persen request dijawab lokal dalam 18 ms; 10 persen sulit naik ke server.",
        "Skenario 4 — Data sensitif (kesehatan, biometrik), regulasi melarang keluar perangkat. → Edge, apa pun biayanya. Alasan: bukan soal performa — soal kepatuhan.",
        "Aturan praktis: ukur dulu di HP target (p50 DAN p99, baterai 20 persen, HP panas), lalu putuskan. Keputusan edge yang dibuat di laptop adalah keputusan berdasarkan kebohongan.",
      ],
      tasks: [],
      note: {
        title: "Monitoring edge yang buta",
        body: "Model server bisa dipantau tiap request; model edge tidak mengirim apa-apa. Gantinya: telemetri sampel (1 persen perangkat mengirim ringkasan prediksi + distribusi skor tiap hari), uji paritas berkala di perangkat, dan alert bila distribusi skor bergeser. Monitoring buta bukan alasan tidak memantau — ia alasan memantau dengan sampel.",
      },
      reference: "Edge untuk stabil + lokal + cepat; server untuk berubah cepat + fitur real-time; hybrid untuk campuran.",
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
        "Rantai: training ke ONNX (format) ke TFLite (mobile).",
        "2,4 juta parameter: FP32 9,6 MB; INT8 2,4 MB; paket 2,7 MB.",
        "Paritas: selisih maks 0,004 di bawah ambang 0,01 — lolos.",
        "Latensi 120 ms menjadi 18 ms = 6,67x; ukur p99 di HP kentang.",
        "Update edge: delta + hash + rollback; model lama disimpan sampai baru lolos.",
      ],
      next: { label: "MLE33 — Data-Centric AI: Model Bagus Lahir dari Data Bagus", href: "/v2/learn/mle33-data-centric-ai" },
      quiz: [
        {
          q: "Model 2,4 juta parameter FP32. Berapa ukurannya, dan berapa setelah INT8?",
          options: [
            { text: "9,6 MB menjadi 2,4 MB", why: "Tepat: 2,4 juta x 4 byte = 9,6 MB; x 1 byte = 2,4 MB.", correct: true },
            { text: "2,4 MB menjadi 9,6 MB — INT8 lebih besar", why: "Salah: terbalik. INT8 1 byte, FP32 4 byte — INT8 seperempatnya." },
            { text: "9,6 MB tetap — kuantisasi tidak mengubah ukuran file", why: "Salah: kuantisasi mengubah byte per bobot dari 4 menjadi 1." },
            { text: "4,8 MB menjadi 1,2 MB", why: "Salah: itu hitungan untuk 1,2 juta parameter, bukan 2,4 juta." },
          ],
        },
        {
          q: "Selisih paritas maksimum 0,004 dengan ambang 0,01. Apa vonisnya?",
          options: [
            { text: "Gagal — selisih apa pun berarti konversi rusak", why: "Salah: ambang ada karena selisih kecil tak terhindarkan; 0,004 di bawah 0,01." },
            { text: "Lolos — 0,004 di bawah ambang 0,01", why: "Tepat: uji paritas memakai ambang, bukan nol mutlak.", correct: true },
            { text: "Lolos hanya bila selisih rata-rata juga 0,004", why: "Salah: vonis memakai selisih maksimum; rata-rata adalah metrik tambahan." },
            { text: "Tidak bisa diputuskan tanpa melihat akurasi", why: "Salah: paritas mengukur kesetiaan konversi; akurasi diukur terpisah di test set." },
          ],
        },
        {
          q: "Mengapa metadata 0,3 MB wajib ikut dalam paket TFLite?",
          options: [
            { text: "Agar file terlihat profesional", why: "Salah: metadata fungsional — berisi rentang normalisasi dan versi model." },
            { text: "Tanpa rentang normalisasi, aplikasi memberi input salah skala dan skor diam-diam salah", why: "Tepat: metadata adalah bagian dari kontrak input model.", correct: true },
            { text: "Agar ukuran paket genap", why: "Salah: ukuran genap bukan syarat apa pun." },
            { text: "Metadata hanya untuk audit, tidak memengaruhi prediksi", why: "Salah: rentang normalisasi langsung menentukan nilai input yang masuk model." },
          ],
        },
        {
          q: "Latensi server 120 ms, HP 18 ms. Berapa speedup-nya, dan apa yang harus diukur juga?",
          options: [
            { text: "6,67x; ukur juga p99 di HP kentang saat panas", why: "Tepat: 120/18 = 6,67; rata-rata menipu bila throttling membuat p99 3x lipat.", correct: true },
            { text: "102 ms; cukup rata-rata saja", why: "Salah: 102 adalah selisih, bukan rasio; dan rata-rata saja menyembunyikan throttling." },
            { text: "6,67x; cukup ukur di laptop", why: "Salah: laptop bukan HP target; benchmark harus di perangkat terlemah yang didukung." },
            { text: "0,15x; HP lebih lambat", why: "Salah: terbalik — 18 lebih kecil dari 120, HP lebih cepat di sini." },
          ],
        },
        {
          q: "Model retrain tiap hari dan butuh fitur real-time dari server. Apa keputusan yang benar?",
          options: [
            { text: "Edge penuh — latensi selalu menang", why: "Salah: edge tidak bisa mengikuti update harian dan tidak melihat fitur server." },
            { text: "Server — edge tidak cocok untuk model yang berubah cepat dan butuh data server", why: "Tepat: ritme update dan ketergantungan data menentukan arsitektur.", correct: true },
            { text: "Hybrid — separuh model di HP, separuh di server", why: "Salah: membelah model tidak menyelesaikan update harian; hybrid yang benar adalah fallback per request, bukan per lapisan." },
            { text: "Edge dengan update delta tiap jam", why: "Salah: update tiap jam ke ribuan perangkat yang tidak selalu online = biaya distribusi melebihi manfaat." },
          ],
        },
      ],
    },
  ],
};
