import type { V2Lesson } from "../lib/types";

export const llmops23: V2Lesson = {
  slug: "llmops23-managed-platform-deployment",
  track: "LLMOps",
  module: "Deployment",
  title: "LLMOps23 — Managed-Platform Deployment: SageMaker, Vertex AI & Azure ML",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga cloud, tiga tagihan — dan satu yang termurah hanya di volume rendah",
      prose: [
        "Tim NusaBank harus men-deploy LLM 8B untuk 1 juta request per bulan. Tiga opsi managed: Cloud A (SageMaker-like) $0,90/jam + $0,00005/request; Cloud B (Vertex-like) $1,10/jam + $0,00003/request; Cloud C (Azure ML-like) $0,75/jam + $0,00008/request. Hitungannya: A = 0,90 x 730 + 1.000.000 x 0,00005 = $707; B = $833; C = $627,50. Pemenang di 1 juta request: Cloud C. Tetapi di 10 juta request, C menjadi yang termahal — tarif per-request-nya yang tinggi membalikkan keadaan. Keputusan 'cloud termurah' tanpa volume adalah keputusan yang salah separuh waktu.",
        "Managed platform adalah jalan tengah antara API dan self-host: cloud mengurus infrastruktur (scaling, patching, GPU), kamu mengurus model dan konfigurasi. Lesson ini mengajarkan deployment managed per cloud sebagai keputusan ekonomi: hitung total biaya, temukan titik impas, dan pilih berdasarkan volume — bukan berdasarkan merek.",
        "Setelah lesson ini kamu bisa: (1) menghitung total biaya bulanan managed endpoint per cloud; (2) menghitung titik impas antar dua cloud; (3) membedakan endpoint real-time, batch, dan serverless; (4) menjelaskan kapan managed menang atas API dan self-host; (5) merancang checklist deploy managed yang aman.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "LLMOps10 mengajarkan canary & rollback untuk LLM dan LLMOps13 mengajarkan inference self-hosted (vLLM/TGI) — tetapi tidak ada lesson deployment managed per cloud (0 hit 'SageMaker/Vertex/Azure' di track). Lesson ini mengisinya: perbandingan hands-on tiga cloud sebagai keputusan biaya + operasional, dengan lab yang menghitung total biaya dan titik impas.",
      },
      reference: "1 juta request/bulan: A $707; B $833; C $627,50. Titik impas A-C: 3,65 juta request.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memilih cloud dengan kalkulator — bukan dengan loyalitas merek.",
        "(1) Menghitung total biaya managed endpoint (jam + per-request);",
        "(2) Menghitung titik impas volume antar dua cloud;",
        "(3) Membedakan endpoint real-time, batch transform, dan serverless inference;",
        "(4) Menjelaskan trade-off managed vs API vs self-host;",
        "(5) Merancang checklist deploy: pin versi, autoscaling, dan alarm biaya.",
      ],
      tasks: [],
    },
    {
      id: "biaya",
      eyebrow: "Langkah 3 · Teori",
      title: "Matematika tagihan: jam + per-request",
      prose: [
        "Total biaya bulanan = tarif per jam x 730 jam + tarif per request x volume. Hitung tiga cloud untuk 1 juta request. Cloud A: 0,90 x 730 = $657 + 1.000.000 x 0,00005 = $50 — total $707. Cloud B: 1,10 x 730 = $803 + $30 — total $833. Cloud C: 0,75 x 730 = $547,50 + $80 — total $627,50. Urutan di 1 juta: C termurah, lalu A, lalu B.",
        "Tetapi urutan berubah dengan volume. Titik impas A vs C: 657 + 0,00005V = 547,5 + 0,00008V — selisih tarif jam $109,50 dibagi selisih tarif request $0,00003 = 3.650.000 request. Di bawah 3,65 juta, C menang (tarif jam rendah); di atasnya, A menang (tarif request rendah). Bila volume NusaBank tumbuh ke 10 juta, C menjadi $1.347,50 sementara A $1.157 — keputusan yang benar di 1 juta menjadi salah di 10 juta. Itulah mengapa kontrak cloud harus di-review tiap kuartal, bukan sekali seumur hidup.",
        "Tiga jenis endpoint managed. Real-time: selalu menyala, latensi rendah, bayar per jam — untuk trafik interaktif. Batch transform: jalan terjadwal atas file, mati setelah selesai — untuk 1 juta request yang tidak butuh jawaban instan, pada contoh tarif lesson ini 40–60 persen lebih murah dari real-time. Angka itu ILUSTRASI, bukan jaminan — selisih riil bergantung tarif batch vs real-time di cloud-mu, utilisasi, dan durasi job; hitung dengan tarif resmi sebelum memutuskan. Serverless inference: skala ke nol saat sepi, bayar per request + durasi — untuk trafik sporadis. Aturan: trafik stabil = real-time; batch = batch; sporadis = serverless. Memakai real-time untuk beban batch adalah membakar uang.",
      ],
      tasks: [],
      note: {
        title: "Harga contoh, metode abadi",
        body: "Tarif dolar di lesson ini adalah CONTOH untuk latihan hitung — tarif asli berubah tiap kuartal dan berbeda per region. Yang abadi adalah metodenya: total = jam + per-request, titik impas dari selisih tarif, dan review berkala. Selalu ambil tarif dari halaman pricing resmi cloud saat memutuskan — jangan dari lesson ini.",
      },
      reference: "A $707; B $833; C $627,50 (1 juta request). Impas A-C 3,65 juta.",
    },
    {
      id: "operasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Operasi managed: pin, autoscaling, dan alarm biaya",
      prose: [
        "Tiga kontrol yang membedakan deploy managed yang profesional dari yang amatir. Pertama, pin versi model dan image: endpoint menunjuk ke artefak persis (model v2.3.1, image sha256:...), bukan 'latest' — 'latest' berarti model yang berbeda tiap deploy, dan rollback menjadi tebak-tebakan (MLOps19 mengajarkan paket versi yang sama).",
        "Kedua, autoscaling dengan batas: min 1, maks 8 instance, target utilisasi GPU 70 persen. Tanpa maks, lonjakan trafik melahirkan tagihan yang melahirkan rapat darurat; tanpa min 1, cold start pertama memakan 2 menit. Ketiga, alarm biaya: alert bila proyeksi bulanan melebihi 120 persen anggaran, dan hard cap (hentikan scaling) di 150 persen. Alarm biaya adalah SLO finansial — tanpa itu, autoscaling adalah kartu kredit tanpa limit.",
        "Checklist deploy managed: (1) model + image di-pin; (2) autoscaling min/maks tertulis; (3) alarm biaya aktif; (4) canary 5 persen sebelum 100 persen (LLMOps10); (5) uji beban 500 RPS (MLOps27); (6) data tidak keluar region (kepatuhan); (7) log request dimatikan untuk data sensitif atau dienkripsi. Tujuh baris ini membedakan deploy yang tidur nyenyak dari deploy yang begadang.",
      ],
      tasks: [],
      note: {
        title: "Vendor lock-in adalah biaya tersembunyi",
        body: "Fitur managed yang paling nyaman (auto-scaling khusus, integrasi IAM, monitoring bawaan) adalah yang paling mengikat. Sebelum memakai fitur eksklusif satu cloud, tanyakan: berapa biaya pindah bila tarif naik 30 persen? Bila jawabannya 'tidak mungkin pindah', diskon hari ini adalah pajak esok hari. Bungkus model dan konfigurasi dalam format portable (ONNX, container standar) sebisa mungkin.",
      },
      reference: "Pin versi + autoscaling 1-8 + alarm 120 persen + hard cap 150 persen.",
    },
    {
      id: "lab-managed",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: total biaya tiga cloud dan titik impas",
      prose: [
        "Lab ini menghitung ekonomi managed deployment dari angka mentah: total biaya tiga cloud dan titik impas A vs C.",
        "Hitung dulu di kepala. A: 0,90 x 730 = 657 + 50 = 707. B: 1,10 x 730 = 803 + 30 = 833. C: 0,75 x 730 = 547,5 + 80 = 627,5. Titik impas: (657 - 547,5) / (0,00008 - 0,00005) = 109,5 / 0,00003 = 3.650.000 request.",
        "Tugas lab: hitung empat angka dan cetak masing-masing di baris sendiri: biaya_a, biaya_b, biaya_c, impas_ac. Empat angka ini adalah vonis pemilihan cloud — dengan ini 'cloud termurah' menjadi klaim yang bisa diuji ulang tiap kuartal.",
        "Setelah lolos, coba eksperimen: naikkan volume menjadi 10 juta dan lihat urutan berbalik (A $1.157 vs C $1.347,50) — lalu tanyakan: pada volume berapa kamu harus pindah cloud, dan berapa biaya pindahnya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_a`, `biaya_b`, `biaya_c` untuk 1 juta request/bulan" },
        { id: "t2", text: "Hitung `impas_ac` = titik impas volume A vs C" },
      ],
      expected: "biaya_a=707.0\nbiaya_b=833.0\nbiaya_c=627.5\nimpas_ac=3650000",
      hints: [
        "Total = tarif jam x 730 + tarif request x volume.",
        "Impas: selisih biaya jam / selisih tarif request.",
        "Gunakan angka persis dari data lab.",
      ],
      code: {
        starter: `# Ekonomi managed deployment: total biaya + titik impas.\njam_bulan = 730\nvolume = 1_000_000\n# (tarif/jam, tarif/request)\ncloud_a = (0.90, 0.00005)\ncloud_b = (1.10, 0.00003)\ncloud_c = (0.75, 0.00008)\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nbiaya_a = \nbiaya_b = \nbiaya_c = \nimpas_ac = \n\nprint(f"biaya_a={biaya_a}")\nprint(f"biaya_b={biaya_b}")\nprint(f"biaya_c={biaya_c}")\nprint(f"impas_ac={impas_ac}")`,
        lockLines: 7,
        solution: `# Ekonomi managed deployment: total biaya + titik impas.\njam_bulan = 730\nvolume = 1_000_000\n# (tarif/jam, tarif/request)\ncloud_a = (0.90, 0.00005)\ncloud_b = (1.10, 0.00003)\ncloud_c = (0.75, 0.00008)\n\n# TULIS KODEMU: hitung empat angka di bawah ini.\nbiaya_a = cloud_a[0] * jam_bulan + cloud_a[1] * volume\nbiaya_b = cloud_b[0] * jam_bulan + cloud_b[1] * volume\nbiaya_c = cloud_c[0] * jam_bulan + cloud_c[1] * volume\nimpas_ac = (cloud_a[0] * jam_bulan - cloud_c[0] * jam_bulan) / (cloud_c[1] - cloud_a[1])\n\nprint(f"biaya_a={biaya_a}")\nprint(f"biaya_b={biaya_b}")\nprint(f"biaya_c={biaya_c}")\nprint(f"impas_ac={impas_ac}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_a", value: 707.0, tol: 1e-9, label: "`biaya_a` seharusnya 707.0", msg: "657 + 50 = 707." },
          { kind: "equal", task: "t1", name: "biaya_b", value: 833.0, tol: 1e-9, label: "`biaya_b` seharusnya 833.0", msg: "803 + 30 = 833." },
          { kind: "equal", task: "t1", name: "biaya_c", value: 627.5, tol: 1e-9, label: "`biaya_c` seharusnya 627.5", msg: "547,5 + 80 = 627,5." },
          { kind: "equal", task: "t2", name: "impas_ac", value: 3650000, tol: 1.0, label: "`impas_ac` seharusnya 3650000", msg: "109,5 / 0,00003 = 3.650.000 request." },
        ],
      },
      reference: "A $707; B $833; C $627,50; impas 3,65 juta request.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: managed, API, atau self-host",
      prose: [
        "Skenario 1 — Volume stabil 1 juta/bulan, tim kecil, data boleh di cloud. → Managed real-time. Alasan: operasi minimal, biaya terprediksi.",
        "Skenario 2 — Volume sporadis (sepi di malam hari, ramai di siang hari). → Serverless inference. Alasan: skala ke nol menghemat jam idle.",
        "Skenario 3 — Volume besar (di atas 10 juta/bulan), tim punya keahlian GPU. → Self-host vLLM (LLMOps13). Alasan: di atas titik impas self-host BISA jauh lebih murah — tetapi itu klaim yang harus dihitung, bukan diasumsikan: total self-host = sewa GPU + gaji tim operasi + biaya downtime; bandingkan dengan tarif managed pada volume aktualmu sebelum pindah.",
        "Skenario 4 — Data sensitif, regulasi melarang keluar (UU PDP, perbankan). → Managed di region lokal atau self-host on-prem. Alasan: bukan soal biaya — soal kepatuhan.",
        "Skenario 5 — Beban batch (1 juta request, tidak butuh jawaban instan). → Batch transform. Alasan: batch bisa 40–60 persen lebih murah dari real-time pada contoh tarif lesson ini — ilustrasi; hitung dengan tarif resmi cloud-mu.",
        "Aturan praktis: hitung total biaya di tiga volume (saat ini, 3x, 10x) sebelum memilih. Cloud yang termurah hari ini bisa menjadi yang termahal tahun depan — dan pindah cloud selalu lebih mahal dari yang diperkirakan.",
      ],
      tasks: [],
      note: {
        title: "Review kuartalan adalah kewajiban",
        body: "Tarif berubah, volume berubah, fitur baru muncul. Jadwalkan review deployment tiap kuartal: hitung ulang total biaya dengan volume aktual, bandingkan dengan alternatif, dan putuskan bertahan atau pindah. Tim yang tidak me-review akan membayar tarif 2024 untuk volume 2026.",
      },
      reference: "Stabil = managed; sporadis = serverless; besar = self-host; batch = batch transform.",
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
        "1 juta request: A $707; B $833; C $627,50 — C termurah.",
        "Titik impas A-C: 3,65 juta request; di atasnya A menang.",
        "Real-time untuk stabil; batch untuk terjadwal; serverless untuk sporadis.",
        "Pin versi + autoscaling 1-8 + alarm 120 persen + hard cap 150 persen.",
        "Tarif contoh — selalu cek pricing resmi saat memutuskan.",
      ],
      next: { label: "LLMOps24 — Pipeline SFT End-to-End: dari Data ke Model Terlatih", href: "/v2/learn/llmops24-pipeline-sft" },
      quiz: [
        {
          q: "Cloud C: $0,75/jam + $0,00008/request, 1 juta request/bulan. Berapa totalnya?",
          options: [
            { text: "$627,50", why: "Tepat: 547,50 + 80 = 627,50.", correct: true },
            { text: "$547,50 — hanya biaya jam", why: "Salah: tarif per-request wajib ditambah: 1 juta x 0,00008 = $80." },
            { text: "$707 — sama dengan Cloud A", why: "Salah: itu total Cloud A; C lebih murah di volume ini." },
            { text: "$80 — hanya biaya request", why: "Salah: biaya jam 730 x 0,75 = $547,50 tidak boleh dilupakan." },
          ],
        },
        {
          q: "Titik impas A vs C adalah 3,65 juta request. Apa artinya?",
          options: [
            { text: "Di bawah 3,65 juta C menang; di atasnya A menang", why: "Tepat: C menang dari tarif jam rendah; A menang dari tarif request rendah.", correct: true },
            { text: "Di atas 3,65 juta C selalu menang", why: "Salah: terbalik — di atas impas, tarif request rendah A yang menang." },
            { text: "3,65 juta adalah volume maksimum C", why: "Salah: impas bukan batas — C tetap bisa dipakai di atasnya, hanya lebih mahal." },
            { text: "Impas tidak relevan bila volume stabil", why: "Salah: volume stabil pun bisa tumbuh; impas menentukan kapan keputusan harus di-review." },
          ],
        },
        {
          q: "Beban 1 juta request terjadwal, tidak butuh jawaban instan. Apa yang benar?",
          options: [
            { text: "Real-time endpoint — selalu menyala", why: "Salah: membayar jam idle untuk beban batch adalah pemborosan — selisihnya pada contoh tarif lesson ini 40–60 persen, tetapi angka riil bergantung tarif cloud-mu." },
            { text: "Batch transform — bisa jauh lebih murah (40–60 persen pada contoh tarif lesson ini)", why: "Tepat: batch mati setelah selesai; tidak ada jam idle. Angka 40–60 persen adalah ilustrasi dari contoh tarif lesson — hitung ulang dengan tarif resmi.", correct: true },
            { text: "Serverless — skala ke nol", why: "Salah: serverless untuk sporadis interaktif; batch terjadwal lebih murah lagi." },
            { text: "Self-host — selalu termurah", why: "Salah: self-host butuh tim GPU dan volume besar; untuk batch terjadwal, managed batch menang." },
          ],
        },
        {
          q: "Mengapa endpoint harus menunjuk ke versi model yang di-pin, bukan 'latest'?",
          options: [
            { text: "Agar deploy lebih cepat", why: "Salah: kecepatan bukan alasannya; alasannya reproduksibilitas dan rollback." },
            { text: "Agar rollback menunjuk ke artefak yang pasti, bukan tebak-tebakan", why: "Tepat: 'latest' berubah tiap deploy; rollback tanpa pin adalah judi.", correct: true },
            { text: "Agar biaya lebih murah", why: "Salah: pin tidak memengaruhi tarif." },
            { text: "Tidak penting — cloud mengingat versi terakhir", why: "Salah: 'terakhir' berubah; yang dibutuhkan adalah versi yang DITENTUKAN." },
          ],
        },
        {
          q: "Autoscaling tanpa batas maksimum. Apa risikonya?",
          options: [
            { text: "Tidak ada — scaling selalu baik", why: "Salah: lonjakan trafik melahirkan tagihan tanpa batas." },
            { text: "Tagihan tak terbatas saat lonjakan; butuh maks + alarm biaya + hard cap", why: "Tepat: autoscaling adalah kartu kredit tanpa limit bila tanpa batas.", correct: true },
            { text: "Latensi naik", why: "Salah: scaling justru menurunkan latensi; risikonya biaya, bukan latensi." },
            { text: "Model menjadi tidak akurat", why: "Salah: scaling tidak memengaruhi akurasi model." },
          ],
        },
      ],
    },
  ],
};
