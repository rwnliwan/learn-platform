import type { V2Lesson } from "../lib/types";

export const biz29: V2Lesson = {
  slug: "biz29-forecasting-di-dashboard",
  track: "Business Intelligence",
  module: "Analisis & Insight",
  title: "BI29 — Forecasting di Dashboard: Ramalan yang Jujur di Layar Direksi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Ramalan yang tepat sekali, lalu salah tiga kuartal berturut-turut",
      prose: [
        "Dashboard Kopi Nusantara menampilkan forecast revenue bulan depan: satu garis lurus naik, tanpa rentang, tanpa jejak akurasi. Kuartal pertama forecast-nya tepat — direksi percaya. Tiga kuartal berikutnya meleset 12 sampai 18 persen, dan tidak ada yang tahu kenapa: tidak ada MAPE, tidak ada interval, tidak ada catatan kapan model terakhir di-refresh.",
        "Masalahnya bukan modelnya — modelnya wajar. Masalahnya adalah presentasinya: ramalan ditampilkan sebagai kepastian. Direksi membuat keputusan budget dari satu garis yang tidak pernah mengaku ketidakpastiannya.",
        "Lesson ini mengajarkan forecasting di dashboard: metrik akurasi, fan chart, dan tata kelola refresh. Setelah lesson ini kamu bisa: (1) menghitung MAE dan MAPE dari aktual vs forecast; (2) menjelaskan kenapa MAPE menipu pada nilai kecil; (3) merancang fan chart dengan interval; (4) menulis catatan forecast yang jujur; (5) menjadwalkan refresh dan monitoring akurasi.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MK15 mengajarkan forecasting demand secara statistik (dekomposisi, exponential smoothing, WAPE) di track Marketing — sudut pemodelan. Track BI sendiri hanya menyebut kata forecast satu kali di BI12, sebagai contoh metrik adopsi. Lesson ini adalah sudut BI: bagaimana ramalan ditampilkan di dashboard, diukur akurasinya, dan dikelola refresh-nya — bukan cara membangun modelnya.",
      },
      reference: "Aktual 120, 135, 150 vs forecast 125, 130, 145: MAE 5,0; MAPE 3,73 persen. Forecast bulan ke-4: 165 dengan interval 155 sampai 175.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, dashboard-mu tidak lagi menampilkan ramalan sebagai kepastian — melainkan sebagai rentang dengan jejak akurasi.",
        "(1) Menghitung MAE dan MAPE dari aktual dan forecast;",
        "(2) Menjelaskan kapan MAPE menipu dan kapan WAPE lebih jujur;",
        "(3) Merancang fan chart: garis tengah plus interval;",
        "(4) Menulis catatan forecast: model, tanggal refresh, akurasi terakhir;",
        "(5) Menjadwalkan refresh dan alert saat akurasi memburuk.",
      ],
      tasks: [],
    },
    {
      id: "mae-mape",
      eyebrow: "Langkah 3 · Teori",
      title: "MAE dan MAPE: ukur dulu, percaya kemudian",
      prose: [
        "MAE (Mean Absolute Error) adalah rata-rata selisih absolut: aktual 120, 135, 150 melawan forecast 125, 130, 145 — selisih 5, 5, 5 — MAE sama dengan 5,0. Satuannya sama dengan datanya (rupiah, unit, kunjungan), sehingga direksi langsung paham: rata-rata meleset 5 unit per bulan.",
        "MAPE (Mean Absolute Percentage Error) adalah rata-rata selisih persen: 5 dibagi 120 sama dengan 4,17 persen; 5 dibagi 135 sama dengan 3,70 persen; 5 dibagi 150 sama dengan 3,33 persen — rata-rata 3,73 persen. MAPE enak dibaca lintas produk, tetapi menipu pada nilai kecil: selisih 5 pada aktual 10 adalah 50 persen, sementara selisih yang sama pada aktual 1.000 hanya 0,5 persen. Untuk produk bervolume kecil, WAPE (total selisih dibagi total aktual) lebih jujur karena tidak membesar-besarkan kesalahan kecil.",
        "Aturan dashboard: tampilkan MAE dan MAPE berdampingan dengan forecast — bukan di halaman terpisah yang tidak dibuka siapa pun. Forecast tanpa jejak akurasi adalah opini dengan garis. Dan akurasi dihitung dari data yang tidak dipakai melatih model — mengukur akurasi pada data latih sama dengan menguji murid dengan soal yang sudah diberi jawabannya.",
      ],
      tasks: [],
      note: {
        title: "MAPE tidak punya tanda",
        body: "MAPE memakai nilai absolut — ia tidak memberi tahu apakah forecast bias ke atas atau ke bawah. Tambahkan bias (rata-rata selisih bertanda): bila forecast selalu di atas aktual, model over-forecast dan budget akan kelebihan stok. Bias yang konsisten adalah sinyal model yang bisa diperbaiki, bukan sekadar kesalahan acak.",
      },
      reference: "MAE 5,0; MAPE 3,73 persen. MAPE menipu pada nilai kecil — WAPE lebih jujur. Akurasi diukur pada data yang tidak dipakai melatih.",
    },
    {
      id: "fan-chart",
      eyebrow: "Langkah 4 · Teori",
      title: "Fan chart dan tata kelola: ramalan yang mengaku tidak pasti",
      prose: [
        "Fan chart menampilkan forecast sebagai kipas: garis tengah 165 untuk bulan ke-4, dengan interval 155 sampai 175 yang melebar makin jauh ke depan. Kipas yang melebar adalah kejujuran visual: makin jauh ramalan, makin besar ketidakpastiannya. Dashboard yang menampilkan garis lurus tanpa kipas sedang berbohong dengan grafik.",
        "Catatan forecast wajib menempel di dashboard: model apa, tanggal refresh terakhir, MAE dan MAPE terakhir, dan asumsi terbesar (misalnya tidak ada promo besar). Bila asumsi berubah — promo Lebaran dimajukan — catatan itu yang pertama diperbarui, bukan angkanya.",
        "Tata kelola refresh: model di-refresh tiap ada data baru yang cukup (bulanan untuk revenue bulanan), dan akurasi dimonitor terhadap ambang: MAPE di atas 10 persen selama 2 bulan berturut-turut memicu review model — bukan diam-diam mengganti model tanpa catatan. Forecast yang tidak dimonitor akan memburuk diam-diam, seperti di cerita pembuka.",
      ],
      tasks: [],
      reference: "Fan chart: 165 dengan interval 155 sampai 175, melebar ke depan. Ambang review: MAPE di atas 10 persen selama 2 bulan.",
    },
    {
      id: "lab-forecast",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung MAE dan MAPE forecast",
      prose: [
        "Lab ini menghitung akurasi forecast dari tiga bulan aktual dan forecast.",
        "Hitung dulu di kepala. Selisih absolut: 5, 5, 5 — MAE sama dengan 5,0. MAPE: 4,17 tambah 3,70 tambah 3,33 sama dengan 11,20; dibagi 3 sama dengan 3,73 persen (dibulatkan 2 desimal).",
        "Tugas lab: tulis fungsi yang menerima daftar aktual dan forecast, lalu mencetak dua angka: mae dan mape.",
        "Setelah lolos, coba eksperimen: ubah satu aktual menjadi 10 dan lihat MAPE melonjak — itulah kenapa MAPE menipu pada nilai kecil.",
      ],
      tasks: [
        { id: "t1", text: "Hitung mae dari selisih absolut" },
        { id: "t2", text: "Hitung mape dari selisih persen" },
      ],
      expected: "mae=5.0\nmape=3.73",
      hints: [
        "MAE = rata-rata nilai absolut aktual dikurangi forecast.",
        "MAPE = rata-rata selisih absolut dibagi aktual, dikali 100.",
        "Bulatkan MAPE ke 2 desimal.",
      ],
      code: {
        starter: `# Forecast revenue Kopi Nusantara: 3 bulan.\naktual = [120, 135, 150]\nforecast = [125, 130, 145]\n\n# TULIS KODEMU: hitung mae dan mape.\n# Cetak, per baris: mae, mape.\n\n\nmesin_forecast(aktual, forecast)`,
        lockLines: 3,
        solution: `# Forecast revenue Kopi Nusantara: 3 bulan.\naktual = [120, 135, 150]\nforecast = [125, 130, 145]\n\n\ndef mesin_forecast(aktual, forecast):\n    selisih = []\n    persen = []\n    for a, f in zip(aktual, forecast):\n        selisih.append(abs(a - f))\n        persen.append(abs(a - f) / a * 100)\n    mae = sum(selisih) / len(selisih)\n    mape = round(sum(persen) / len(persen), 2)\n    print(f"mae={mae}")\n    print(f"mape={mape}")\n\n\nmesin_forecast(aktual, forecast)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mae=5.0", label: "MAE 5,0", msg: "Selisih 5, 5, 5 — rata-rata 5,0 unit per bulan." },
          { kind: "stdout_matches", task: "t2", pattern: "mape=3.73", label: "MAPE 3,73 persen", msg: "(4,17 + 3,70 + 3,33) / 3 = 3,73 persen." },
        ],
      },
      reference: "MAE 5,0; MAPE 3,73 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: dashboard yang akhirnya mengaku tidak pasti",
      prose: [
        "Kembali ke Kopi Nusantara. Dashboard forecast dibangun ulang: garis tengah plus fan chart 155 sampai 175, MAE dan MAPE tiga bulan terakhir di samping garis, dan catatan model plus tanggal refresh di bawah chart. Direksi kini bertanya 'seberapa lebar kipasnya' sebelum bertanya 'berapa angkanya'.",
        "Dua bulan kemudian MAPE menembus 10 persen dua bulan berturut-turut — alert review model menyala. Ternyata pola musiman berubah setelah pembukaan dua cabang baru. Model di-refresh dengan data cabang baru, MAPE kembali ke 4,1 persen. Tanpa monitoring, kemerosotan itu baru ketahuan kuartal berikutnya — setelah budget salah alokasi.",
        "Keputusan rapat: tidak ada forecast di dashboard tanpa fan chart, tanpa MAE dan MAPE, dan tanpa tanggal refresh. Tiga elemen itu adalah syarat tayang, bukan hiasan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat dashboard baru dipercaya. Pertama, ketidakpastian divisualkan (fan chart), bukan disembunyikan. Kedua, akurasi menempel di samping ramalan — pembaca menilai sebelum percaya. Ketiga, ambang review otomatis — kemerosotan ketahuan dalam 2 bulan, bukan 1 kuartal.",
      },
      reference: "Fan chart, MAE dan MAPE menempel, tanggal refresh. MAPE 10 persen 2 bulan memicu review; setelah refresh MAPE 4,1 persen.",
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
        "Lab: MAE 5,0; MAPE 3,73 persen.",
        "MAPE menipu pada nilai kecil — WAPE lebih jujur untuk volume kecil.",
        "Fan chart: garis tengah plus interval yang melebar — ketidakpastian divisualkan.",
        "Akurasi diukur pada data yang tidak dipakai melatih model.",
        "MAPE di atas 10 persen selama 2 bulan memicu review model.",
      ],
      next: { label: "BI30 — Requirements Gathering BI: Bertanya Sebelum Membangun", href: "/v2/learn/biz30-requirements-gathering-bi" },
      quiz: [
        {
          q: "Aktual 120, 135, 150; forecast 125, 130, 145. Berapa MAE dan MAPE?",
          options: [
            { text: "MAE 5,0; MAPE 3,73 persen", why: "Tepat: selisih 5, 5, 5 — MAE 5,0; persen 4,17, 3,70, 3,33 — rata-rata 3,73 persen.", correct: true },
            { text: "MAE 5,0; MAPE 5 persen — selisih dibagi 100", why: "Salah: MAPE membagi selisih dengan aktual tiap bulan, bukan dengan 100." },
            { text: "MAE 15; MAPE 3,73 persen — MAE dijumlah", why: "Salah: MAE adalah rata-rata selisih, bukan jumlahnya." },
            { text: "MAE 5,0; MAPE 11,2 persen — persen dijumlah", why: "Salah: MAPE adalah rata-rata persen, bukan jumlahnya." },
          ],
        },
        {
          q: "Kenapa MAPE menipu pada produk bervolume kecil?",
          options: [
            { text: "MAPE selalu nol untuk volume kecil", why: "Salah: MAPE justru membesar — selisih kecil dibagi aktual kecil menjadi persen besar." },
            { text: "Selisih 5 pada aktual 10 adalah 50 persen, padahal selisihnya sama dengan produk besar", why: "Tepat: pembagi kecil membesar-besarkan kesalahan; WAPE lebih jujur di sini.", correct: true },
            { text: "MAPE tidak bisa dihitung untuk volume kecil", why: "Salah: MAPE bisa dihitung — hanya saja menyesatkan." },
            { text: "Volume kecil tidak punya forecast", why: "Salah: volume kecil tetap bisa diramal; masalahnya di metriknya." },
          ],
        },
        {
          q: "Apa fungsi fan chart di dashboard forecast?",
          options: [
            { text: "Membuat chart terlihat menarik", why: "Salah: fan chart bukan hiasan — ia memvisualkan ketidakpastian." },
            { text: "Menyembunyikan forecast yang meleset", why: "Salah: sebaliknya — fan chart mengekspos ketidakpastian, bukan menyembunyikannya." },
            { text: "Menampilkan interval ramalan yang melebar — makin jauh, makin tidak pasti", why: "Tepat: kipas yang melebar adalah kejujuran visual tentang ketidakpastian.", correct: true },
            { text: "Menggantikan MAE dan MAPE", why: "Salah: fan chart dan metrik akurasi saling melengkapi — keduanya tampil bersama." },
          ],
        },
        {
          q: "Kenapa akurasi TIDAK boleh diukur pada data latih?",
          options: [
            { text: "Data latih terlalu besar untuk dihitung", why: "Salah: ukuran bukan masalahnya — model sudah melihat jawabannya." },
            { text: "Data latih tidak punya kolom aktual", why: "Salah: data latih justru punya aktual — itulah yang dipakai melatih." },
            { text: "Data latih tidak boleh ditampilkan di dashboard", why: "Salah: larangan menampilkan bukan alasan metriknya salah." },
            { text: "Model sudah melihat jawabannya — akurasinya palsu dan terlalu bagus", why: "Tepat: menguji dengan soal yang sudah diberi jawaban selalu memberi nilai bagus yang menipu.", correct: true },
          ],
        },
        {
          q: "MAPE menembus 10 persen dua bulan berturut-turut. Tindakan yang benar?",
          options: [
            { text: "Review model: cek perubahan pola, refresh dengan data baru", why: "Tepat: itulah gunanya ambang — kemerosotan memicu diagnosis, bukan kepanikan.", correct: true },
            { text: "Sembunyikan MAPE dari dashboard agar direksi tidak panik", why: "Salah: menyembunyikan metrik adalah manipulasi — akurasi buruk harus ketahuan." },
            { text: "Ganti model diam-diam tanpa catatan", why: "Salah: pergantian tanpa catatan menghilangkan jejak — tidak ada yang bisa menilai apakah model baru lebih baik." },
            { text: "Naikkan ambang menjadi 15 persen agar tidak memicu alert", why: "Salah: mengubah ambang untuk meloloskan kemerosotan adalah manipulasi." },
          ],
        },
      ],
    },
  ],
};
