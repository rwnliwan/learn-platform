import type { V2Lesson } from "../lib/types";

export const mlops27: V2Lesson = {
  slug: "mlops27-load-testing-serving",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps27 — Load & Stress Testing: Apakah Serving-mu Kuat 500 RPS?",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Promo 11.11: serving yang lolos staging, mati di menit ke-7",
      prose: [
        "TokoKilat menyiapkan promo 11.11: serving model rekomendasi diuji di staging dengan 50 request per detik — lancar. Menit ke-7 promo, trafik naik ke 500 request per detik: latensi p95 meledak dari 69 ms menjadi 240 ms, error rate 0,8 persen masih di bawah SLO 1 persen tetapi antrean tumbuh tanpa henti, dan pada menit ke-12 serving mulai menolak request. Postmortem: tidak ada yang pernah menguji 500 RPS; staging 50 RPS memberi rasa aman yang palsu.",
        "Load testing menjawab 'berapa kuat' sebelum pengguna yang menjawabnya. Dengan hukum Little dan Locust, kamu bisa menghitung kebutuhan konkurensi, merancang skenario beban, dan menemukan titik patah — di lab, bukan di promo.",
        "Lesson ini mengajarkan load & stress testing untuk serving ML: hukum Little, p50/p95/p99, dan SLA 100 ms. Setelah lesson ini kamu bisa: (1) menghitung konkurensi dari throughput dan latensi; (2) menghitung jumlah virtual user Locust; (3) membaca p95 dari daftar latensi; (4) menentukan apakah SLO terpenuhi; (5) merancang uji beban dan uji stres yang berbeda.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MLOps6 menyebut load test satu kalimat di capstone ('load test' sebagai jawaban kapasitas) dan MLOps9 menguji model — tetapi tidak ada lesson load/stress testing serving (0 hit 'Locust' di track). Lesson ini membangunnya: hukum Little, perencanaan virtual user, pembacaan persentil, dan SLA 100 ms, dengan lab yang menghitung semuanya dari angka mentah.",
      },
      reference: "500 RPS @ 100 ms = 50 konkurensi; 1.000 virtual user; p95 110 ms; error 0,8 persen di bawah SLO 1 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membuktikan serving-mu kuat — dengan angka, bukan harapan.",
        "(1) Menghitung konkurensi dengan hukum Little (L = lambda x W);",
        "(2) Menghitung jumlah virtual user dari throughput dan think time;",
        "(3) Menghitung p50/p95 dari daftar latensi terurut;",
        "(4) Menilai SLO: latensi p95 di bawah 100 ms dan error di bawah 1 persen;",
        "(5) Membedakan load test, stress test, dan soak test.",
      ],
      tasks: [],
    },
    {
      id: "little",
      eyebrow: "Langkah 3 · Teori",
      title: "Hukum Little: tiga angka yang mengikat semuanya",
      prose: [
        "Hukum Little: L = lambda x W. L = jumlah request yang sedang berada DI DALAM sistem — menunggu di antrean DITAMBAH sedang diproses (konkurensi total), bukan hanya yang sedang diproses; lambda = throughput (request/detik); W = waktu tiap request di sistem (detik). Contoh: target 500 RPS dengan latensi 100 ms (0,1 detik) — konkurensi yang dibutuhkan L = 500 x 0,1 = 50. Artinya sistem harus bisa menampung 50 request bersamaan (di antrean + diproses). Bila serving-mu hanya punya 20 worker, antrean tumbuh — dan latensi meledak seperti di cerita pembuka.",
        "Dari konkurensi ke virtual user Locust: tiap virtual user mengirim 1 request tiap 2 detik (think time 2 detik + latensi 0,1 detik diabaikan dalam hitungan kasar ini — pola Locust standar memakai laju per user). Untuk 500 RPS: butuh 500 x 2 = 1.000 virtual user. Bila tiap user lebih agresif (1 request/detik), cukup 500 user — tetapi pola itu tidak realistis: pengguna nyata berpikir di antara klik.",
        "Hukum Little juga bekerja terbalik: bila kamu mengukur konkurensi 50 dan latensi 0,2 detik, throughput maksimum = 50 / 0,2 = 250 RPS — bukan 500. Inilah cara mendiagnosis 'kenapa mentok di 250': bukan trafiknya, melainkan konkurensi atau latensinya. Perbaiki salah satu: tambah worker (naikkan L) atau percepat model (turunkan W).",
      ],
      tasks: [],
      formula: "L = \\lambda \\times W",
      formulaNote: "L = jumlah request di dalam sistem (antrean + sedang diproses); lambda = throughput (request/detik); W = waktu tiap request di sistem, termasuk antrean (detik).",
      note: {
        title: "Latensi yang dipakai adalah latensi SISTEM",
        body: "W mencakup antrean + pemrosesan + network — bukan hanya waktu inferensi model. Model yang inferensinya 20 ms tetapi antre 180 ms karena worker penuh punya W = 200 ms. Load test yang hanya mengukur inferensi akan mengklaim 'kuat 500 RPS' sementara sistemnya runtuh di 250.",
      },
      reference: "500 RPS x 0,1 detik = 50 konkurensi; 1.000 virtual user @ 1 request/2 detik.",
    },
    {
      id: "persentil-slo",
      eyebrow: "Langkah 4 · Teori",
      title: "Persentil & SLO: rata-rata menipu, p95 yang jujur",
      prose: [
        "Daftar 20 latensi terurut (ms): 42, 45, 48, 51, 55, 58, 61, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 95, 110, 240. Median (p50) = rata-rata nilai ke-10 dan ke-11 = (69 + 72) / 2 = 70,5 ms. p95 = nilai pada posisi ceil(0,95 x 20) = posisi ke-19 = 110 ms. Rata-ratanya 78,5 ms (jumlah 1.570 / 20) — terlihat bagus. Tetapi p95 110 ms berarti 5 persen pengguna menunggu lebih dari 110 ms, dan satu pengguna menunggu 240 ms. SLA 'p95 di bawah 100 ms' GAGAL: 110 lebih besar dari 100.",
        "SLO di lesson ini: p95 di bawah 100 ms DAN error rate di bawah 1 persen. Uji beban mengukur keduanya: error 8 dari 1.000 request = 0,8 persen — lolos SLO error. Tetapi p95 110 ms — gagal SLO latensi. Vonis keseluruhan: GAGAL. Satu SLO gagal berarti sistem gagal; tidak ada 'rata-rata lolos'.",
        "Tiga jenis uji yang berbeda. Load test: beban yang diharapkan (500 RPS) selama 30 menit — apakah SLO terpenuhi? Stress test: naikkan beban sampai patah (600, 800, 1.000 RPS) — di mana titik patahnya, dan apakah ia patah dengan anggun (menolak dengan 503) atau berantakan (timeout acak)? Soak test: beban normal selama 8-24 jam — apakah ada kebocoran memori atau degradasi lambat? Ketiganya dibutuhkan; load test saja tidak menemukan kebocoran memori, stress test saja tidak menemukan degradasi lambat.",
      ],
      tasks: [],
      note: {
        title: "Patah dengan anggun",
        body: "Sistem yang baik saat kelebihan beban MENOLAK dengan cepat (503 + pesan jelas) — bukan menerima lalu timeout 30 detik kemudian. Penolakan cepat melindungi sistem dan memberi klien kesempatan retry dengan backoff. Uji stres harus memeriksa BAGAIMANA sistem patah, bukan hanya KAPAN ia patah.",
      },
      reference: "p50 70,5 ms; p95 110 ms — gagal SLO 100 ms. Error 0,8 persen — lolos SLO 1 persen.",
    },
    {
      id: "lab-load",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: konkurensi, virtual user, p95, dan vonis SLO",
      prose: [
        "Lab ini menghitung mesin load testing dari angka mentah: konkurensi hukum Little, virtual user Locust, p95, error rate, dan vonis SLO.",
        "Hitung dulu di kepala. Konkurensi: 500 x 0,1 = 50. Virtual user: 500 x 2 = 1.000. p95: posisi ke-19 dari 20 latensi terurut = 110 ms. Error rate: 8 / 1.000 x 100 = 0,8 persen. Vonis SLO: p95 110 di atas 100 — gagal (0).",
        "Tugas lab: hitung lima angka dan cetak masing-masing di baris sendiri: konkurensi, virtual_user, p95, error_persen, slo_lolos (1 bila p95 di bawah 100 DAN error di bawah 1; 0 bila tidak). Lima angka ini adalah laporan uji beban — dengan ini 'serving kuat' menjadi klaim yang terukur.",
        "Setelah lolos, coba eksperimen: turunkan latensi menjadi 80 ms dan lihat konkurensi turun menjadi 40 — lalu tanyakan: apakah menambah worker atau mempercepat model yang lebih murah untuk mencapai 500 RPS?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `konkurensi` (Little) dan `virtual_user` Locust" },
        { id: "t2", text: "Hitung `p95` dari daftar 20 latensi terurut" },
        { id: "t3", text: "Hitung `error_persen` dan vonis `slo_lolos`" },
      ],
      expected: "konkurensi=50.0\nvirtual_user=1000\np95=110\nerror_persen=0.8\nslo_lolos=0",
      hints: [
        "Konkurensi = throughput x latensi (detik).",
        "Virtual user = throughput x think time (2 detik).",
        "p95 = nilai posisi ceil(0,95 x 20) = ke-19 dari daftar terurut.",
        "SLO lolos = 1 hanya bila p95 di bawah 100 DAN error di bawah 1.",
      ],
      code: {
        starter: `# Mesin load testing: Little, Locust, persentil, SLO.\nimport math\n\nthroughput = 500\nlatensi_detik = 0.1\nthink_time = 2\nlatensi_ms = [42, 45, 48, 51, 55, 58, 61, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 95, 110, 240]\nerror_n, total_req = 8, 1000\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nkonkurensi = \nvirtual_user = \np95 = \nerror_persen = \nslo_lolos = \n\nprint(f"konkurensi={konkurensi}")\nprint(f"virtual_user={virtual_user}")\nprint(f"p95={p95}")\nprint(f"error_persen={error_persen}")\nprint(f"slo_lolos={slo_lolos}")`,
        lockLines: 6,
        solution: `# Mesin load testing: Little, Locust, persentil, SLO.\nimport math\n\nthroughput = 500\nlatensi_detik = 0.1\nthink_time = 2\nlatensi_ms = [42, 45, 48, 51, 55, 58, 61, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 95, 110, 240]\nerror_n, total_req = 8, 1000\n\n# TULIS KODEMU: hitung lima angka di bawah ini.\nkonkurensi = throughput * latensi_detik\nvirtual_user = throughput * think_time\np95 = latensi_ms[math.ceil(0.95 * len(latensi_ms)) - 1]\nerror_persen = error_n / total_req * 100\nslo_lolos = 1 if (p95 < 100 and error_persen < 1) else 0\n\nprint(f"konkurensi={konkurensi}")\nprint(f"virtual_user={virtual_user}")\nprint(f"p95={p95}")\nprint(f"error_persen={error_persen}")\nprint(f"slo_lolos={slo_lolos}")`,
        checks: [
          { kind: "equal", task: "t1", name: "konkurensi", value: 50.0, tol: 1e-9, label: "`konkurensi` seharusnya 50.0", msg: "500 x 0,1 = 50." },
          { kind: "equal", task: "t1", name: "virtual_user", value: 1000, tol: 1e-9, label: "`virtual_user` seharusnya 1000", msg: "500 x 2 = 1.000 user." },
          { kind: "equal", task: "t2", name: "p95", value: 110, tol: 1e-9, label: "`p95` seharusnya 110", msg: "Posisi ke-19 dari 20 latensi terurut = 110 ms." },
          { kind: "equal", task: "t3", name: "error_persen", value: 0.8, tol: 1e-9, label: "`error_persen` seharusnya 0.8", msg: "8/1.000 = 0,8 persen — lolos SLO error." },
          { kind: "equal", task: "t3", name: "slo_lolos", value: 0, tol: 1e-9, label: "`slo_lolos` seharusnya 0", msg: "p95 110 di atas 100 — SLO gagal walau error lolos." },
        ],
      },
      reference: "Konkurensi 50; 1.000 user; p95 110 ms; error 0,8 persen; SLO GAGAL.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: uji apa, kapan, dan bagaimana membaca hasilnya",
      prose: [
        "Skenario 1 — Rilis baru, trafik diperkirakan 500 RPS. → Load test 500 RPS 30 menit + SLO check. Alasan: bukti sistem memenuhi janji sebelum promo.",
        "Skenario 2 — Tidak tahu batas sistem. → Stress test bertahap (500, 700, 1.000 RPS) sampai patah. Alasan: batas harus diketahui di lab, bukan ditemukan pengguna.",
        "Skenario 3 — Sistem jalan berminggu-minggu tanpa restart. → Soak test 24 jam beban normal. Alasan: kebocoran memori hanya terlihat dalam durasi panjang.",
        "Skenario 4 — p95 gagal tetapi rata-rata bagus. → Perbaiki ekor: periksa GC pause, cold start, dan antrean. Alasan: rata-rata menyembunyikan penderitaan 5 persen pengguna.",
        "Skenario 5 — Error lolos tetapi latensi naik perlahan tiap jam. → Periksa kebocoran: memori, koneksi DB yang tidak ditutup, cache yang membesar. Alasan: degradasi lambat adalah soak test yang berbicara.",
        "Aturan praktis: uji beban di environment yang mirip produksi (data, ukuran instance, network) — staging yang 10x lebih kecil memberi jawaban 10x lebih optimis. Dan JANGAN uji beban ke produksi tanpa pemberitahuan: itu bukan pengujian, itu insiden yang direncanakan.",
      ],
      tasks: [],
      note: {
        title: "Locust: beban yang realistis — contoh skenario",
        body: "Locust menulis skenario sebagai kode Python: tiap virtual user berperilaku seperti pengguna (login, berpikir 2 detik, request, berpikir lagi). Bedakan dari 'penembak request mentah' (misalnya ab/wrk) yang mengukur throughput maksimum server — Locust mengukur pengalaman pengguna di bawah beban realistis. Keduanya berguna; jangan tertukar tujuannya. Contoh skenario untuk lesson ini:\n\nfrom locust import HttpUser, task, between\n\nclass Pembeli(HttpUser):\n    wait_time = between(1, 3)  # think time ~2 detik\n    @task\n    def rekomendasi(self):\n        self.client.post('/rekomendasi', json={'user_id': 123})\n\nJalankan: locust -f skenario.py --users 1000 --spawn-rate 50 --host https://staging.tokokilat.id — 1.000 virtual user, naik 50 user/detik. Pantau p95 dan error rate selama 30 menit, bukan hanya di menit pertama.",
      },
      reference: "Load untuk SLO; stress untuk titik patah; soak untuk kebocoran.",
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
        "Hukum Little: 500 RPS x 0,1 detik = 50 konkurensi.",
        "Locust: 1.000 virtual user @ 1 request/2 detik.",
        "p50 70,5 ms; p95 110 ms — gagal SLO 100 ms.",
        "Error 0,8 persen lolos SLO 1 persen; vonis tetap GAGAL.",
        "Load, stress, dan soak menguji hal yang berbeda.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Target 500 RPS dengan latensi 100 ms. Berapa konkurensi yang dibutuhkan?",
          options: [
            { text: "50", why: "Tepat: L = 500 x 0,1 = 50.", correct: true },
            { text: "500 — sama dengan throughput", why: "Salah: konkurensi = throughput x latensi; latensi 0,1 detik membagi 10." },
            { text: "5 — 500 dibagi 100", why: "Salah: latensi harus dalam detik (0,1), bukan ms (100)." },
            { text: "5.000 — 500 x 100 ms tanpa konversi", why: "Salah: lupa konversi ms ke detik; 500 x 0,1 = 50." },
          ],
        },
        {
          q: "p95 = 110 ms, SLO p95 di bawah 100 ms, error 0,8 persen (SLO 1 persen). Apa vonisnya?",
          options: [
            { text: "Lolos — error di bawah SLO", why: "Salah: SLO butuh KEDUANYA; p95 gagal berarti sistem gagal." },
            { text: "GAGAL — p95 110 ms di atas 100 ms", why: "Tepat: satu SLO gagal = sistem gagal.", correct: true },
            { text: "Lolos — rata-rata hanya 78,5 ms", why: "Salah: rata-rata bukan SLO; p95 yang dinilai." },
            { text: "Tidak bisa diputuskan tanpa p99", why: "Salah: SLO yang disepakati memakai p95; p99 adalah informasi tambahan." },
          ],
        },
        {
          q: "Mengapa rata-rata latensi 78,5 ms menipu di sini?",
          options: [
            { text: "Karena rata-rata tidak pernah berguna", why: "Salah: rata-rata berguna untuk tren; yang menipu adalah memakainya sebagai pengganti persentil." },
            { text: "Karena 5 persen pengguna menunggu di atas 110 ms dan satu menunggu 240 ms — rata-rata menyembunyikan ekor", why: "Tepat: ekor distribusi adalah pengalaman pengguna yang sial.", correct: true },
            { text: "Karena rata-rata dihitung dari sampel yang salah", why: "Salah: sampelnya benar; yang salah adalah metrik yang dipilih untuk vonis." },
            { text: "Karena 78,5 lebih besar dari p50 70,5", why: "Salah: itu normal — rata-rata di atas median bila ada ekor kanan." },
          ],
        },
        {
          q: "Apa perbedaan stress test dan soak test?",
          options: [
            { text: "Tidak ada — keduanya menaikkan beban", why: "Salah: stress menaikkan beban sampai patah; soak mempertahankan beban normal lama untuk kebocoran." },
            { text: "Stress: beban naik sampai patah; soak: beban normal 8-24 jam untuk degradasi lambat", why: "Tepat: stress mencari batas; soak mencari kebocoran.", correct: true },
            { text: "Stress untuk latensi; soak untuk error", why: "Salah: keduanya mengukur latensi dan error; bedanya dimensi beban vs waktu." },
            { text: "Stress di staging; soak di produksi", why: "Salah: keduanya di environment uji; soak di produksi adalah insiden." },
          ],
        },
        {
          q: "Sistem kelebihan beban. Perilaku patah yang BAIK adalah?",
          options: [
            { text: "Menerima semua request lalu timeout 30 detik kemudian", why: "Salah: itu patah berantakan — pengguna menunggu lalu gagal tanpa kepastian." },
            { text: "Menolak cepat dengan 503 + pesan jelas agar klien bisa retry dengan backoff", why: "Tepat: penolakan cepat melindungi sistem dan memberi klien jalan keluar.", correct: true },
            { text: "Restart sendiri diam-diam", why: "Salah: restart diam-diam menghilangkan jejak dan mengulang beban yang sama." },
            { text: "Menurunkan kualitas model diam-diam", why: "Salah: degradasi diam-diam adalah keputusan bisnis yang disembunyikan." },
          ],
        },
      ],
    },
  ],
};
