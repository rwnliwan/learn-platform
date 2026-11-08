import type { V2Lesson } from "../lib/types";

export const mle34: V2Lesson = {
  slug: "mle34-survival-analysis",
  track: "Machine Learning Engineer",
  module: "ML Lanjutan",
  title: "MLE34 — Survival Analysis: Memprediksi Kapan, Bukan Hanya Apakah",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Nasabah yang 'tidak churn' — sampai ia churn bulan depan",
      prose: [
        "Model churn KirimCepat memprediksi 'churn atau tidak' dengan akurasi 91 persen — dan tetap tidak berguna. Masalahnya: tim retention tidak butuh tahu SIAPA yang churn; mereka butuh tahu KAPAN, supaya intervensi datang sebelum nasabah pergi, bukan sesudahnya. Model klasifikasi menjawab 'ya/tidak' untuk jendela 90 hari; yang dibutuhkan adalah kurva: peluang nasabah masih bertahan di hari ke-30, ke-60, ke-90, dan ke-120.",
        "Survival analysis menjawab pertanyaan 'kapan'. Ia menangani data tersensor — nasabah yang belum churn saat pengamatan berakhir bukan 'tidak churn', melainkan 'belum diketahui'. Membuang mereka (seperti klasifikasi biasa) membuang informasi; menganggap mereka tidak churn adalah kebohongan. Kaplan-Meier dan Cox proportional hazards adalah dua alat intinya.",
        "Lesson ini mengajarkan survival analysis sebagai alat ML produksi: kurva Kaplan-Meier, hazard ratio Cox, dan cara membaca median survival. Setelah lesson ini kamu bisa: (1) menghitung kurva survival Kaplan-Meier; (2) menjelaskan sensor kanan dalam satu kalimat; (3) menghitung dan menafsirkan hazard ratio; (4) menentukan median survival dari kurva; (5) memutuskan kapan survival lebih tepat dari klasifikasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson survival analysis di track MLE maupun track lain — grep 'survival', 'Kaplan', dan 'Cox' menghasilkan 0 hit di seluruh konten. Lesson ini baru sepenuhnya: dari sensor kanan sampai hazard ratio, dengan lab Kaplan-Meier yang dihitung dari angka mentah.",
      },
      reference: "S(30)=0,90; S(60)=0,7875; S(90)=0,63; S(120)=0,4128; median antara hari 90 dan 120; HR=2,0.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjawab 'kapan' — bukan hanya 'apakah'.",
        "(1) Menghitung survival Kaplan-Meier selangkah demi selangkah;",
        "(2) Menjelaskan sensor kanan dan mengapa membuangnya adalah kesalahan;",
        "(3) Menghitung hazard ratio dari koefisien Cox;",
        "(4) Membaca median survival dari kurva;",
        "(5) Memilih antara survival, klasifikasi, dan regresi waktu.",
      ],
      tasks: [],
    },
    {
      id: "kaplan-meier",
      eyebrow: "Langkah 3 · Teori",
      title: "Kaplan-Meier: survival sebagai perkalian peluang bersyarat",
      prose: [
        "Kurva Kaplan-Meier dihitung selangkah demi selangkah: di tiap waktu kejadian, peluang bertahan = peluang bertahan sebelumnya dikali (1 - kejadian / berisiko). Contoh kohort 100 nasabah. Hari ke-30: 10 churn dari 100 berisiko — S(30) = 1 - 10/100 = 0,90. Hari ke-60: 11 churn dari 88 yang masih berisiko (100 - 10 churn - 2 tersensor) — S(60) = 0,90 x (1 - 11/88) = 0,90 x 0,875 = 0,7875. Hari ke-90: 15 churn dari 75 berisiko — S(90) = 0,7875 x (1 - 15/75) = 0,7875 x 0,8 = 0,63. Hari ke-120: 20 churn dari 58 berisiko — S(120) = 0,63 x (1 - 20/58) = 0,63 x 0,6552 = 0,4128.",
        "Sensor kanan adalah kuncinya: nasabah yang berhenti diamati (misalnya pengamatan berakhir, atau ia pindah) TIDAK dihitung sebagai churn dan TIDAK dihitung sebagai bertahan — ia keluar dari penyebut 'berisiko' setelah waktu sensornya. Itulah mengapa penyebut hari ke-60 adalah 88, bukan 90: 100 - 10 churn - 2 tersensor. Menganggap tersensor sebagai 'tidak churn' akan menggelembungkan survival; membuang mereka akan mengecilkan sampel dan membiaskan kurva ke arah yang bertahan paling lama.",
        "Median survival adalah waktu ketika kurva melewati 0,5: separuh kohort sudah mengalami kejadian. Di contoh ini S(90) = 0,63 dan S(120) = 0,4128 — median terletak antara hari ke-90 dan ke-120. Median lebih jujur daripada rata-rata: rata-rata waktu churn tidak bisa dihitung bila separuh kohort belum churn saat pengamatan berakhir.",
      ],
      tasks: [],
      formula: "S(t) = \\prod_{t_i \\leq t} \\left(1 - \\frac{d_i}{n_i}\\right)",
      formulaNote: "d_i = kejadian pada waktu t_i; n_i = jumlah berisiko tepat sebelum t_i (tersensor sudah dikeluarkan).",
      note: {
        title: "Kaplan-Meier tidak memakai fitur",
        body: "Kurva di atas menggambarkan SATU kohort tanpa membedakan siapa-siapa. Untuk menjawab 'nasabah seperti apa yang bertahan lebih lama', butuh model Cox di langkah berikut — Kaplan-Meier memberi gambaran, Cox memberi penjelasan.",
      },
      reference: "S(30)=0,90; S(60)=0,7875; S(90)=0,63; S(120)=0,4128.",
    },
    {
      id: "cox",
      eyebrow: "Langkah 4 · Teori",
      title: "Model Cox: hazard ratio sebagai bahasa perbandingan risiko",
      prose: [
        "Model Cox (proportional hazards) memodelkan hazard — laju kejadian sesaat — sebagai h(t|x) = h0(t) x exp(beta1 x1 + beta2 x2 + ...). Bagian h0(t) adalah baseline hazard (bentuk kurva waktu, tidak dimodelkan); bagian exp(...) adalah pengali risiko dari fitur. Keindahannya: kamu tidak perlu tahu bentuk h0(t) untuk membandingkan dua nasabah — rasio hazard mereka hanya bergantung pada fitur.",
        "Hazard ratio (HR) = exp(beta). Contoh: koefisien untuk 'nasabah baru' beta = 0,693 — HR = exp(0,693) = 2,0. Artinya nasabah baru memiliki laju churn 2x lipat nasabah lama pada tiap waktu, dengan asumsi semua fitur lain sama. Koefisien negatif memberi HR di bawah 1: beta = -0,405 untuk 'memakai autopay' — HR = exp(-0,405) = 0,67, artinya autopay menurunkan laju churn 33 persen. HR = 1 berarti tidak ada efek.",
        "Asumsi proportional hazards harus diperiksa: rasio hazard antar kelompok harus konstan sepanjang waktu. Bila kurva survival dua kelompok bersilangan, asumsi dilanggar — solusinya stratifikasi (baseline hazard terpisah per kelompok) atau model dengan efek yang bergantung waktu. Jangan laporkan HR tanpa memeriksa asumsi ini; HR dari model yang asumsinya dilanggar adalah angka yang rapi tetapi salah.",
      ],
      tasks: [],
      note: {
        title: "Hazard bukan probabilitas",
        body: "HR 2,0 TIDAK berarti 'peluang churn 2x lipat' — ia berarti LAJU churn 2x lipat pada tiap sesaat. Peluang kumulatif churn bergantung pada baseline hazard dan waktu. Kesalahan paling umum dalam laporan survival adalah menerjemahkan HR sebagai probabilitas. Tulis selalu 'laju', bukan 'peluang'.",
      },
      reference: "HR nasabah baru 2,0; HR autopay 0,67 (turun 33 persen).",
    },
    {
      id: "lab-survival",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kurva Kaplan-Meier dan hazard ratio",
      prose: [
        "Lab ini menghitung kurva survival dan hazard ratio dari angka mentah kohort 100 nasabah.",
        "Hitung dulu di kepala. S(30) = 1 - 10/100 = 0,90. S(60) = 0,90 x (1 - 11/88) = 0,90 x 0,875 = 0,7875. S(90) = 0,7875 x (1 - 15/75) = 0,7875 x 0,8 = 0,63. HR nasabah baru = exp(0,693) = 2,0; HR autopay = exp(-0,405) = 0,67.",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: s30, s60, s90, hr_baru, hr_autopay. Lima angka ini adalah inti laporan retention — dengan ini tim bisa berkata 'separuh nasabah pergi antara hari ke-90 dan ke-120, dan nasabah baru berisiko 2x lipat' alih-alih 'akurasi churn 91 persen'.",
        "Setelah lolos, coba eksperimen: ubah kejadian hari ke-60 menjadi 22 dari 88 dan lihat S(60) turun menjadi 0,675 — lalu tanyakan: intervensi retention apa yang paling masuk akal di hari ke-45, sebelum penurunan itu terjadi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `s30`, `s60`, `s90` Kaplan-Meier dari data kohort" },
        { id: "t2", text: "Hitung `hr_baru` = exp(0,693) dan `hr_autopay` = exp(-0,405)" },
      ],
      expected: "s30=0.9\ns60=0.7875\ns90=0.63\nhr_baru=2.0\nhr_autopay=0.67",
      hints: [
        "S(t) = S sebelumnya x (1 - kejadian / berisiko).",
        "Berisiko hari ke-60 = 88 (100 - 10 churn - 2 tersensor); hari ke-90 = 75.",
        "HR = exp(beta); bulatkan 2 desimal.",
      ],
      code: {
        starter: `# Kurva Kaplan-Meier + hazard ratio Cox.\nimport math\n\n# (waktu, kejadian, berisiko)\ndata = [(30, 10, 100), (60, 11, 88), (90, 15, 75)]\nbeta_baru = 0.693\nbeta_autopay = -0.405\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ns30 = \ns60 = \ns90 = \nhr_baru = \nhr_autopay = \n\nprint(f"s30={s30}")\nprint(f"s60={s60}")\nprint(f"s90={s90}")\nprint(f"hr_baru={round(hr_baru, 2)}")\nprint(f"hr_autopay={round(hr_autopay, 2)}")`,
        lockLines: 6,
        solution: `# Kurva Kaplan-Meier + hazard ratio Cox.\nimport math\n\n# (waktu, kejadian, berisiko)\ndata = [(30, 10, 100), (60, 11, 88), (90, 15, 75)]\nbeta_baru = 0.693\nbeta_autopay = -0.405\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\ns30 = 1 - data[0][1] / data[0][2]\ns60 = s30 * (1 - data[1][1] / data[1][2])\ns90 = s60 * (1 - data[2][1] / data[2][2])\nhr_baru = math.exp(beta_baru)\nhr_autopay = math.exp(beta_autopay)\n\nprint(f"s30={s30}")\nprint(f"s60={s60}")\nprint(f"s90={s90}")\nprint(f"hr_baru={round(hr_baru, 2)}")\nprint(f"hr_autopay={round(hr_autopay, 2)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s30", value: 0.9, tol: 1e-9, label: "`s30` seharusnya 0.9", msg: "1 - 10/100 = 0,90." },
          { kind: "equal", task: "t1", name: "s60", value: 0.7875, tol: 1e-9, label: "`s60` seharusnya 0.7875", msg: "0,90 x (1 - 11/88) = 0,7875." },
          { kind: "equal", task: "t1", name: "s90", value: 0.63, tol: 1e-9, label: "`s90` seharusnya 0.63", msg: "0,7875 x (1 - 15/75) = 0,63." },
          { kind: "equal", task: "t2", name: "hr_baru", value: 2.0, tol: 0.01, label: "`hr_baru` seharusnya 2.0", msg: "exp(0,693) = 2,0 — laju churn 2x lipat." },
          { kind: "equal", task: "t2", name: "hr_autopay", value: 0.67, tol: 0.01, label: "`hr_autopay` seharusnya 0.67", msg: "exp(-0,405) = 0,67 — laju churn turun 33 persen." },
        ],
      },
      reference: "S(30)=0,90; S(60)=0,7875; S(90)=0,63; HR baru 2,0; HR autopay 0,67.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: survival, klasifikasi, atau regresi waktu",
      prose: [
        "Skenario 1 — Butuh tahu KAPAN kejadian terjadi + ada data tersensor. → Survival (Kaplan-Meier/Cox). Alasan: satu-satunya keluarga yang menangani sensor dengan benar.",
        "Skenario 2 — Hanya butuh ya/tidak dalam jendela tetap (90 hari), semua nasabah teramati penuh. → Klasifikasi. Alasan: lebih sederhana; sensor tidak ada sehingga survival tidak memberi nilai tambah.",
        "Skenario 3 — Butuh waktu kejadian untuk semua orang, tanpa sensor. → Regresi waktu. Alasan: bila tidak ada sensor, regresi langsung pada waktu lebih efisien.",
        "Skenario 4 — Kurva survival dua kelompok bersilangan. → Jangan laporkan satu HR; stratifikasi atau model time-varying. Alasan: asumsi proportional hazards dilanggar; HR tunggal menyesatkan.",
        "Skenario 5 — Perlu prediksi survival per individu dengan fitur kompleks (gambar, teks). → Deep survival (DeepSurv, random survival forest). Alasan: Cox linear tidak menangkap interaksi kompleks; tetapi mulai dari Cox sebagai baseline — bila Cox sudah 90 persen sebaik DeepSurv, pilih Cox yang bisa dijelaskan.",
      ],
      tasks: [],
      note: {
        title: "Survival di luar churn",
        body: "Pola yang sama berlaku di mana-mana: waktu sampai mesin rusak (predictive maintenance), waktu sampai nasabah gagal bayar (credit risk), waktu sampai pasien kambuh (kesehatan), waktu sampai karyawan resign (HR). Di semua kasus, pertanyaannya sama: kapan — dan siapa yang tersensor. Sekali kamu menguasai Kaplan-Meier dan Cox, kamu membawa alat yang sama ke lima domain.",
      },
      reference: "Ada sensor + butuh kapan = survival. Tanpa sensor = klasifikasi/regresi biasa.",
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
        "S(30)=0,90; S(60)=0,7875; S(90)=0,63; S(120)=0,4128.",
        "Median survival antara hari ke-90 dan ke-120.",
        "Sensor kanan keluar dari penyebut berisiko — bukan churn, bukan bertahan.",
        "HR = exp(beta): baru 2,0; autopay 0,67.",
        "HR adalah laju, bukan probabilitas; periksa asumsi proportional hazards.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Kohort 100: hari ke-30 churn 10, hari ke-60 churn 11 dari 88 berisiko. Berapa S(60)?",
          options: [
            { text: "0,7875", why: "Tepat: S(30)=0,90; 0,90 x (1 - 11/88) = 0,90 x 0,875 = 0,7875.", correct: true },
            { text: "0,79 — 1 - 21/100", why: "Salah: itu mengabaikan sensor dan perkalian bersyarat; penyebut hari ke-60 adalah 88, bukan 100." },
            { text: "0,875 — hanya langkah kedua", why: "Salah: S(60) adalah perkalian kumulatif, bukan hanya faktor hari ke-60." },
            { text: "0,90 — sama dengan S(30)", why: "Salah: 11 kejadian di hari ke-60 menurunkan survival." },
          ],
        },
        {
          q: "Apa perlakuan yang benar untuk nasabah tersensor kanan?",
          options: [
            { text: "Anggap tidak churn", why: "Salah: itu menggelembungkan survival — ia belum diketahui, bukan aman." },
            { text: "Buang dari dataset", why: "Salah: membuangnya membiaskan kurva ke arah yang bertahan paling lama." },
            { text: "Keluarkan dari penyebut berisiko setelah waktu sensornya", why: "Tepat: ia berkontribusi sampai waktu sensor, lalu keluar dari perhitungan.", correct: true },
            { text: "Anggap churn di waktu sensor", why: "Salah: itu mengecilkan survival tanpa bukti kejadian." },
          ],
        },
        {
          q: "Beta nasabah baru = 0,693. Berapa hazard ratio dan artinya?",
          options: [
            { text: "2,0 — laju churn 2x lipat nasabah lama", why: "Tepat: exp(0,693) = 2,0; HR adalah pengali laju, bukan probabilitas.", correct: true },
            { text: "0,693 — peluang churn 69,3 persen", why: "Salah: 0,693 adalah beta (log-HR), bukan HR dan bukan probabilitas." },
            { text: "2,0 — peluang churn 2x lipat", why: "Salah: angkanya benar, tafsirnya salah — HR adalah laju, bukan peluang." },
            { text: "1,0 — tidak ada efek", why: "Salah: HR 1,0 berarti beta 0; di sini beta 0,693." },
          ],
        },
        {
          q: "S(90) = 0,63 dan S(120) = 0,4128. Di mana median survival?",
          options: [
            { text: "Antara hari ke-90 dan ke-120", why: "Tepat: kurva melewati 0,5 di antara kedua titik itu.", correct: true },
            { text: "Tepat hari ke-105 (rata-rata 90 dan 120)", why: "Salah: median tidak harus titik tengah aritmetik; tanpa bentuk kurva antar titik, hanya intervalnya yang diketahui." },
            { text: "Hari ke-90 — S terdekat dengan 0,5", why: "Salah: S(90)=0,63 masih di atas 0,5; median adalah saat kurva MEMOTONG 0,5." },
            { text: "Tidak bisa ditentukan — butuh rata-rata waktu churn", why: "Salah: median justru bisa dibaca dari kurva; rata-rata yang tidak bisa dihitung bila banyak tersensor." },
          ],
        },
        {
          q: "Kurva survival dua kelompok bersilangan. Apa yang harus dilakukan?",
          options: [
            { text: "Laporkan HR tunggal saja — rata-rata selalu benar", why: "Salah: kurva bersilangan berarti asumsi proportional hazards dilanggar; HR tunggal menyesatkan." },
            { text: "Stratifikasi atau model time-varying; jangan laporkan satu HR", why: "Tepat: rasio hazard tidak konstan sepanjang waktu bila kurva bersilangan.", correct: true },
            { text: "Buang kelompok yang lebih kecil", why: "Salah: membuang data tidak memperbaiki pelanggaran asumsi." },
            { text: "Ganti ke klasifikasi — survival tidak cocok", why: "Salah: masalahnya asumsi model, bukan keluarga survival; stratifikasi menyelesaikannya." },
          ],
        },
      ],
    },
  ],
};
