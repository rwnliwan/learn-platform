import type { V2Lesson } from "../lib/types";

export const mk31: V2Lesson = {
  slug: "mk31-kualitas-data-rekonsiliasi",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK31 — Kualitas Data dan Rekonsiliasi Marketing: Saat Tiga Angka Tidak Cocok",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga angka konversi, tiga cerita: GA4, Facebook, dan Salesforce",
      prose: [
        "Rapat bulanan marketing KirimCepat. GA4 melaporkan 12.400 konversi. Facebook Ads melaporkan 14.800 konversi. Salesforce — sistem yang mencatat uang masuk — melaporkan 11.900. Tiga angka untuk satu bulan yang sama, selisih terbesar 24,4 persen. Tim ads mengklaim ROAS 3,1 dari angka Facebook; tim finance menolaknya dari angka Salesforce.",
        "Analis tidak memilih angka yang paling disukai — ia mem-profiling datanya dan merekonsiliasi ketiganya. Profiling menemukan 50.000 baris lead dengan 2.500 email kosong, 1.200 email duplikat, dan 750 email berformat salah. Rekonsiliasi menemukan Facebook menghitung ulang konversi yang sama dari browser dan server, serta memakai jendela atribusi 7 hari sementara GA4 memakai 1 hari. Setelah dedup dan penyamaan jendela, Facebook turun menjadi 12.100 — selisih dengan Salesforce tinggal 1,7 persen.",
        "Lesson ini mengajarkan kualitas data dan rekonsiliasi sebagai disiplin marketing: profiling sebelum analisis, rekonsiliasi sebelum laporan. Setelah lesson ini kamu bisa: (1) mem-profiling dataset marketing dengan enam dimensi kualitas; (2) menghitung skor kebersihan data dari angka mentah; (3) membangun jembatan rekonsiliasi antar platform; (4) memutuskan angka mana yang dipercaya dan kapan; (5) menulis triase selisih dengan ambang yang disepakati.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Rekonsiliasi sudah disinggung di MK2 (dedup event dan audit mundur dari revenue, ambang selisih 2 sampai 3 persen dengan finance) dan MK20 (SOP tiga sumber dengan ambang 5 persen), dan MK22 mengajarkan dedup identitas. Lesson ini TIDAK mengulang singgungan itu: ia membangun disiplinnya sebagai satu sistem — profiling enam dimensi dengan skor kebersihan, dan rekonsiliasi tiga platform (GA4, Facebook, Salesforce) sebagai jembatan yang dihitung, bukan sebagai SOP satu kalimat.",
      },
      reference: "GA4 12.400, Facebook 14.800, Salesforce 11.900. Setelah dedup: Facebook 12.100, selisih 1,7 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membuktikan angka marketing sebelum melaporkannya.",
        "(1) Mem-profiling dataset dengan enam dimensi kualitas data;",
        "(2) Menghitung tingkat null, duplikat, invalid, dan skor kebersihan;",
        "(3) Membangun jembatan rekonsiliasi GA4, Facebook, dan Salesforce;",
        "(4) Menjelaskan penyebab selisih yang paling umum — dedup, jendela atribusi, zona waktu, bot;",
        "(5) Menerapkan triase selisih: hijau, kuning, merah — dengan pemilik dan tenggat.",
      ],
      tasks: [],
    },
    {
      id: "profiling",
      eyebrow: "Langkah 3 · Teori",
      title: "Profiling: enam dimensi kualitas data",
      prose: [
        "Profiling adalah pemeriksaan kesehatan dataset sebelum analisis apa pun — seperti cek darah sebelum diagnosis. Enam dimensi yang diperiksa. Completeness: berapa persen field yang terisi — email kosong 2.500 dari 50.000 berarti 5,0 persen tidak lengkap. Uniqueness: berapa persen nilai yang duplikat — 1.200 email duplikat dari 50.000 berarti 2,4 persen. Validity: berapa persen nilai yang sesuai format dan aturan — 750 email berformat salah berarti 1,5 persen tidak valid.",
        "Tiga dimensi berikutnya. Consistency: apakah nilai yang sama ditulis dengan cara yang sama di semua tempat — 'Jakarta' versus 'JKT' versus 'jakarta' adalah tiga ejaan untuk satu kota. Timeliness: apakah data tiba saat masih bisa dipakai — lead yang masuk CRM tiga hari setelah kampanye selesai tidak bisa di-follow-up saat panas. Accuracy: apakah nilai itu benar di dunia nyata — nomor telepon yang formatnya valid tetapi sudah tidak aktif adalah data yang valid tetapi tidak akurat.",
        "Skor kebersihan dihitung dari dimensi yang terukur. Di cerita pembuka, dengan asumsi ketiga masalah tidak tumpang tindih pada baris yang sama: baris bersih sama dengan 50.000 dikurangi 2.500 dikurangi 1.200 dikurangi 750 sama dengan 45.550. Persen bersih sama dengan 45.550 dibagi 50.000 dikali 100 sama dengan 91,1 persen. Catatan penting: asumsi tidak tumpang tindih harus diperiksa — bila satu baris bisa punya email kosong DAN duplikat, pengurangan ganda menghitung baris yang sama dua kali. Profiling yang jujur menghitung baris bermasalah yang unik, bukan jumlah masalah.",
        "Profiling bukan pekerjaan sekali jalan. Jadwalnya: tiap sumber baru masuk, tiap perubahan skema tracking, dan tiap bulan untuk sumber yang sudah berjalan. Hasilnya satu halaman: per field, persen null, persen duplikat, persen invalid, dan tren dibanding bulan lalu. Halaman itu dilampirkan ke setiap laporan — supaya pembaca tahu seberapa kuat lantai tempat angka itu berdiri.",
      ],
      tasks: [],
      note: {
        title: "Profiling vs pembersihan",
        body: "Profiling mengukur; pembersihan memperbaiki. Jangan membersihkan sebelum mem-profiling — menghapus 2.500 baris email kosong tanpa tahu kenapa ia kosong (form tidak wajib? integrasi putus?) hanya menyembunyikan penyebabnya. Profiling dulu, cari akar masalah, lalu bersihkan — dan catat apa yang dibersihkan supaya audit bisa mengulanginya.",
      },
      reference: "Enam dimensi: completeness, uniqueness, validity, consistency, timeliness, accuracy. Baris bersih 45.550 (91,1 persen).",
    },
    {
      id: "rekonsiliasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Jembatan rekonsiliasi: GA4, Facebook, Salesforce",
      prose: [
        "Rekonsiliasi adalah membandingkan angka yang sama dari sumber berbeda dan menjelaskan selisihnya baris demi baris. Jembatan rekonsiliasi dimulai dari definisi yang sama: apa itu satu konversi? Di Salesforce, satu konversi adalah satu pembayaran yang tercatat. Di GA4, satu konversi adalah satu event purchase yang terkirim. Di Facebook, satu konversi adalah satu purchase yang teratribusi ke iklan. Tiga definisi yang mirip tetapi tidak sama — dan selisihnya tinggal di perbedaan itu.",
        "Hitung selisih terhadap sumber kebenaran — Salesforce, karena ia mencatat uang. GA4: 12.400 dikurangi 11.900 sama dengan 500; 500 dibagi 11.900 dikali 100 sama dengan 4,2 persen. Facebook: 14.800 dikurangi 11.900 sama dengan 2.900; 2.900 dibagi 11.900 dikali 100 sama dengan 24,4 persen. Setelah dedup dan penyamaan jendela, Facebook 12.100: selisih 200, sama dengan 1,7 persen.",
        "Lima penyebab selisih yang paling umum, dalam urutan pemeriksaan. Pertama, dedup ganda: browser dan server mengirim event yang sama — MK2 sudah mengajarkan dedup by event_id dalam jendela 48 jam. Kedua, jendela atribusi: Facebook 7 hari klik versus GA4 1 hari — konversi yang sama dihitung Facebook tetapi tidak oleh GA4. Ketiga, zona waktu: hari yang sama di UTC dan di WIB adalah dua hari yang berbeda — selisih 7 jam memindahkan konversi antar tanggal. Keempat, bot dan traffic invalid: klik bot yang terhitung sebagai konversi di satu platform tetapi disaring di platform lain. Kelima, definisi: Facebook menghitung view-through (melihat iklan lalu membeli), GA4 hanya click-through.",
        "Aturan pelaporan: angka yang dilaporkan adalah angka sumber kebenaran — Salesforce untuk revenue — dan angka platform dilaporkan sebagai angka pendukung dengan selisihnya. Laporan yang menulis 'konversi 14.800 (Facebook)' tanpa menyebut Salesforce 11.900 adalah laporan yang memilih angka yang paling menyenangkan, bukan yang paling benar.",
      ],
      tasks: [],
      note: {
        title: "Sumber kebenaran itu keputusan, bukan penemuan",
        body: "Tidak ada platform yang otomatis menjadi sumber kebenaran. Untuk revenue, Salesforce dipilih karena mencatat uang — keputusan yang disepakati finance dan marketing. Untuk traffic, GA4. Keputusan itu ditulis, ditandatangani kedua pihak, dan di-review tiap tahun. Tanpa kesepakatan tertulis, tiap rapat akan memilih angka yang memenangkan argumennya.",
      },
      reference: "Selisih dihitung terhadap sumber kebenaran. GA4 4,2 persen; Facebook 24,4 persen; setelah dedup 1,7 persen.",
    },
    {
      id: "lab-rekonsiliasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin profiling dan rekonsiliasi",
      prose: [
        "Lab ini membangun mesin profiling dan rekonsiliasi: dari angka mentah lead dan konversi tiga platform, hitung baris bersih, persen bersih, dan selisih tiap platform terhadap Salesforce.",
        "Hitung dulu di kepala. Baris bersih: 50.000 dikurangi 2.500 dikurangi 1.200 dikurangi 750 sama dengan 45.550. Persen bersih: 45.550 dibagi 50.000 dikali 100 sama dengan 91,1 persen. Selisih GA4: 12.400 dikurangi 11.900 sama dengan 500; 500 dibagi 11.900 dikali 100 sama dengan 4,2 persen. Selisih Facebook: 14.800 dikurangi 11.900 sama dengan 2.900; 2.900 dibagi 11.900 dikali 100 sama dengan 24,4 persen. Facebook setelah dedup: 12.100 dikurangi 11.900 sama dengan 200; 200 dibagi 11.900 dikali 100 sama dengan 1,7 persen.",
        "Tugas lab: tulis fungsi yang menerima total baris, null, duplikat, invalid, dan konversi tiga platform — lalu mencetak lima angka: baris_bersih, bersih_persen, ga4_selisih, fb_selisih, fb_bersih_selisih. Lima angka ini adalah satu halaman lampiran kualitas yang menyertai setiap laporan marketing.",
        "Setelah lolos, coba eksperimen: ubah email kosong menjadi 5.000 dan lihat persen bersih turun menjadi 86,1 persen — lalu tanyakan: pada persen berapa kamu menolak memakai dataset itu untuk keputusan budget? Jawabannya ada di langkah berikutnya: ambang triase yang disepakati sebelum laporan dibuat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung baris bersih dan persen bersih dari angka profiling" },
        { id: "t2", text: "Hitung selisih GA4 dan Facebook terhadap Salesforce dalam persen" },
        { id: "t3", text: "Hitung selisih Facebook setelah dedup terhadap Salesforce" },
      ],
      expected: "baris_bersih=45550\nbersih_persen=91.1\nga4_selisih=4.2\nfb_selisih=24.4\nfb_bersih_selisih=1.7",
      hints: [
        "Baris bersih = total dikurangi null dikurangi duplikat dikurangi invalid.",
        "Persen bersih = baris bersih dibagi total, dikali 100.",
        "Selisih persen = (platform dikurangi Salesforce) dibagi Salesforce, dikali 100.",
        "Bulatkan selisih ke 1 desimal.",
      ],
      code: {
        starter: `# Data kualitas marketing: profiling lead + konversi tiga platform.\ntotal_baris = 50000\nnull_email = 2500\nduplikat = 1200\ninvalid = 750\nga4 = 12400\nfb = 14800\nfb_bersih = 12100\nsf = 11900  # sumber kebenaran (Salesforce)\n\n# TULIS KODEMU: hitung lima angka kualitas di bawah ini.\n# Cetak, per baris: baris_bersih, bersih_persen, ga4_selisih,\n# fb_selisih, fb_bersih_selisih.\n\n\nmesin_kualitas(total_baris, null_email, duplikat, invalid, ga4, fb, fb_bersih, sf)`,
        lockLines: 8,
        solution: `# Data kualitas marketing: profiling lead + konversi tiga platform.\ntotal_baris = 50000\nnull_email = 2500\nduplikat = 1200\ninvalid = 750\nga4 = 12400\nfb = 14800\nfb_bersih = 12100\nsf = 11900  # sumber kebenaran (Salesforce)\n\n\ndef mesin_kualitas(total_baris, null_email, duplikat, invalid, ga4, fb, fb_bersih, sf):\n    baris_bersih = total_baris - null_email - duplikat - invalid\n    bersih_persen = baris_bersih / total_baris * 100\n    ga4_selisih = (ga4 - sf) / sf * 100\n    fb_selisih = (fb - sf) / sf * 100\n    fb_bersih_selisih = (fb_bersih - sf) / sf * 100\n    print(f"baris_bersih={baris_bersih}")\n    print(f"bersih_persen={bersih_persen}")\n    print(f"ga4_selisih={round(ga4_selisih, 1)}")\n    print(f"fb_selisih={round(fb_selisih, 1)}")\n    print(f"fb_bersih_selisih={round(fb_bersih_selisih, 1)}")\n\n\nmesin_kualitas(total_baris, null_email, duplikat, invalid, ga4, fb, fb_bersih, sf)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "baris_bersih=45550", label: "Baris bersih 45.550", msg: "50.000 - 2.500 - 1.200 - 750 = 45.550. Asumsi masalah tidak tumpang tindih pada baris yang sama." },
          { kind: "stdout_matches", task: "t1", pattern: "bersih_persen=91.1", label: "Bersih 91,1 persen", msg: "45.550 / 50.000 x 100 = 91,1. Lampirkan angka ini ke setiap laporan." },
          { kind: "stdout_matches", task: "t2", pattern: "ga4_selisih=4.2", label: "Selisih GA4 4,2 persen", msg: "(12.400 - 11.900) / 11.900 x 100 = 4,2. Zona kuning — selidiki sebelum rapat." },
          { kind: "stdout_matches", task: "t2", pattern: "fb_selisih=24.4", label: "Selisih Facebook 24,4 persen", msg: "(14.800 - 11.900) / 11.900 x 100 = 24,4. Zona merah — jangan laporkan angka ini." },
          { kind: "stdout_matches", task: "t3", pattern: "fb_bersih_selisih=1.7", label: "Facebook setelah dedup 1,7 persen", msg: "(12.100 - 11.900) / 11.900 x 100 = 1,7. Zona hijau — dedup dan jendela menjelaskan selisihnya." },
        ],
      },
      reference: "Baris bersih 45.550 (91,1 persen); GA4 4,2 persen; Facebook 24,4 persen; setelah dedup 1,7 persen.",
    },
    {
      id: "triase",
      eyebrow: "Langkah 6 · Teori",
      title: "Triase selisih: hijau, kuning, merah",
      prose: [
        "Triase adalah kesepakatan sebelum insiden: selisih berapa yang boleh lewat, berapa yang harus diselidiki, dan berapa yang menghentikan laporan. Ambang yang dipakai di lesson ini — disepakati finance dan marketing — adalah: hijau di bawah 2 persen, laporkan seperti biasa; kuning 2 sampai 5 persen, laporkan dengan catatan dan selidiki minggu ini; merah di atas 5 persen, jangan laporkan angka itu sampai penyebabnya ketahuan.",
        "Dengan ambang itu, cerita pembuka terbaca jelas. Facebook setelah dedup 1,7 persen: hijau — laporkan 12.100 dengan catatan dedup. GA4 4,2 persen: kuning — laporkan 12.400 dengan catatan, dan selidiki jendela atribusi minggu ini. Facebook mentah 24,4 persen: merah — angka itu tidak boleh masuk laporan, berapa pun ROAS yang dihasilkannya. Ambang mengubah perdebatan 'angka siapa yang benar' menjadi prosedur: ukur, bandingkan dengan ambang, ikuti prosedurnya.",
        "Tiap temuan triase punya pemilik dan tenggat. Kuning: pemiliknya analis marketing, tenggat 5 hari kerja, hasilnya satu paragraf akar masalah. Merah: pemiliknya gabungan analis dan engineer tracking, tenggat 2 hari kerja untuk diagnosis awal, dan laporan ditahan sampai diagnosis keluar. Tanpa pemilik dan tenggat, triase hanya menjadi label yang ditempel lalu dilupakan.",
        "Satu hal yang tidak boleh dilakukan: mengubah ambang untuk meloloskan angka. Bila Facebook 24,4 persen dan seseorang mengusulkan ambang merah dinaikkan menjadi 25 persen 'karena platform memang begitu', itu bukan kalibrasi — itu manipulasi. Ambang diubah hanya dengan data baru yang menunjukkan ambang lama salah, dan perubahan itu dicatat dengan alasan dan tanggal.",
      ],
      tasks: [],
      note: {
        title: "Rekonsiliasi bukan pekerjaan analis saja",
        body: "Selisih 24,4 persen hampir selalu melibatkan tracking (engineer), definisi (produk), dan atribusi (media buyer). Rekonsiliasi yang dikerjakan analis sendirian akan berhenti di 'diduga dedup'. Bawa ketiga pihak ke meja yang sama — dengan jembatan rekonsiliasi di layar — dan selisih biasanya terjelaskan dalam satu jam.",
      },
      reference: "Hijau di bawah 2 persen; kuning 2 sampai 5 persen; merah di atas 5 persen — jangan laporkan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: rapat bulanan — angka mana yang dilaporkan?",
      prose: [
        "Kembali ke rapat bulanan KirimCepat. Tim ads membawa ROAS 3,1 dari angka Facebook 14.800. Tim finance membawa ROAS 2,5 dari angka Salesforce 11.900. Selisih ROAS 0,6 itu menentukan apakah budget bulan depan naik atau turun — dan kedua pihak yakin angkanya benar.",
        "Analis menampilkan jembatan rekonsiliasi. Facebook 14.800 terdiri dari 12.100 konversi unik ditambah 2.700 duplikat browser-server — dedup yang sama seperti yang diajarkan MK2. GA4 12.400 memakai jendela 1 hari; Facebook memakai 7 hari — 200 konversi di antaranya terjadi di hari ke-2 sampai ke-7 setelah klik. Setelah dedup dan penyamaan jendela, ketiga platform berkumpul di 11.900 sampai 12.400 — selisih di bawah 5 persen, zona kuning dan hijau.",
        "Keputusan rapat: angka yang dilaporkan adalah Salesforce 11.900 untuk revenue dan ROAS 2,5. Angka Facebook dilaporkan sebagai pendukung dengan catatan dedup. Budget bulan depan tetap — tidak naik berdasarkan ROAS 3,1 yang ternyata mengandung 2.700 duplikat. Tiga bulan kemudian, setelah tracking server-side diperbaiki, selisih Facebook-Salesforce stabil di 1,5 persen — dan rapat bulanan tidak pernah lagi berdebat soal angka mana yang benar.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat rapat ini berakhir baik. Pertama, sumber kebenaran sudah disepakati sebelum rapat — Salesforce untuk revenue. Kedua, selisih dijelaskan baris demi baris (2.700 duplikat, 200 jendela), bukan dengan 'platform memang begitu'. Ketiga, ambang triase mengubah debat menjadi prosedur: merah ditahan, kuning dicatat, hijau dilaporkan.",
      },
      reference: "ROAS dilaporkan 2,5 (Salesforce), bukan 3,1 (Facebook mentah). Selisih stabil 1,5 persen setelah perbaikan tracking.",
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
        "Enam dimensi: completeness, uniqueness, validity, consistency, timeliness, accuracy.",
        "Lab: baris bersih 45.550 (91,1 persen); GA4 4,2 persen; Facebook 24,4 persen; setelah dedup 1,7 persen.",
        "Selisih dihitung terhadap sumber kebenaran — untuk revenue, Salesforce.",
        "Lima penyebab umum: dedup, jendela atribusi, zona waktu, bot, definisi view-through.",
        "Triase: hijau di bawah 2 persen, kuning 2 sampai 5 persen, merah di atas 5 persen — jangan laporkan.",
      ],
      next: { label: "MK32 — Pemodelan Data Marketing dan KPI Framework: Dari Spend ke Keputusan", href: "/v2/learn/mk32-pemodelan-data-marketing-kpi" },
      quiz: [
        {
          q: "Dataset 50.000 baris: 2.500 email kosong, 1.200 duplikat, 750 format salah. Berapa baris bersih dan persennya?",
          options: [
            { text: "45.550 baris, 91,1 persen", why: "Tepat: 50.000 - 2.500 - 1.200 - 750 = 45.550; 45.550 / 50.000 = 91,1 persen.", correct: true },
            { text: "47.500 baris, 95,0 persen — hanya null yang dihitung", why: "Salah: duplikat dan invalid juga mengurangi baris bersih. Profiling menghitung semua dimensi yang terukur." },
            { text: "46.550 baris, 93,1 persen — duplikat tidak dihitung karena masih data", why: "Salah: email duplikat adalah masalah uniqueness — baris kedua dari orang yang sama bukan lead baru." },
            { text: "50.000 baris, 100 persen — masalah kecil tidak memengaruhi", why: "Salah: 4.450 baris bermasalah adalah 8,9 persen dataset. Mengabaikannya berarti analisis di atas lantai yang retak." },
          ],
        },
        {
          q: "Facebook 14.800, Salesforce 11.900. Setelah dedup Facebook menjadi 12.100. Apa kesimpulan yang benar?",
          options: [
            { text: "Selisih awal 24,4 persen adalah zona merah; setelah dedup 1,7 persen adalah zona hijau", why: "Tepat: (14.800-11.900)/11.900 = 24,4 persen merah; (12.100-11.900)/11.900 = 1,7 persen hijau.", correct: true },
            { text: "Facebook tetap lebih benar karena angkanya lebih besar", why: "Salah: angka lebih besar bukan angka lebih benar. 2.700 di antaranya adalah duplikat browser-server." },
            { text: "Selisih 24,4 persen boleh dilaporkan karena Facebook platform resmi", why: "Salah: zona merah berarti jangan laporkan sampai penyebab ketahuan — berapa pun resminya platform." },
            { text: "Dedup tidak diperlukan — selisih 24,4 persen masih wajar antar platform", why: "Salah: 24,4 persen jauh di atas ambang merah 5 persen. 'Wajar' bukan alasan tanpa jembatan rekonsiliasi." },
          ],
        },
        {
          q: "GA4 memakai jendela atribusi 1 hari, Facebook 7 hari. Apa dampaknya pada selisih konversi?",
          options: [
            { text: "Tidak ada dampak — jendela hanya memengaruhi tampilan, bukan hitungan", why: "Salah: jendela menentukan konversi mana yang dihitung. 200 konversi hari ke-2 sampai ke-7 dihitung Facebook tetapi tidak oleh GA4." },
            { text: "Facebook menghitung konversi yang terjadi sampai 7 hari setelah klik; GA4 hanya 1 hari — selisihnya sistematis", why: "Tepat: perbedaan definisi menghasilkan selisih yang bisa dijelaskan dan dihitung, bukan misteri.", correct: true },
            { text: "GA4 selalu lebih tinggi karena jendelanya lebih pendek", why: "Salah: terbalik. Jendela lebih panjang menangkap lebih banyak konversi — Facebook yang lebih tinggi." },
            { text: "Jendela atribusi hanya berlaku untuk iklan display, bukan search", why: "Salah: jendela berlaku untuk semua format. Pembeda display dan search adalah view-through vs click-through." },
          ],
        },
        {
          q: "Selisih platform 4,2 persen (zona kuning). Apa tindakan yang benar?",
          options: [
            { text: "Laporkan seperti biasa tanpa catatan — 4,2 persen masih kecil", why: "Salah: zona kuning berarti laporkan DENGAN catatan dan selidiki minggu ini. Tanpa catatan, pembaca mengira angkanya bersih." },
            { text: "Laporkan dengan catatan dan selidiki minggu ini; pemiliknya analis marketing", why: "Tepat: kuning bukan larangan melapor — melainkan kewajiban mencatat dan menyelidiki dengan pemilik dan tenggat.", correct: true },
            { text: "Tahan laporan sampai selisih nol persen", why: "Salah: selisih nol hampir tidak pernah terjadi antar platform. Menahan laporan untuk nol persen berarti tidak pernah melapor." },
            { text: "Naikkan ambang kuning menjadi 5 persen agar angka ini hijau", why: "Salah: mengubah ambang untuk meloloskan angka adalah manipulasi. Ambang diubah hanya dengan data baru dan alasan tercatat." },
          ],
        },
        {
          q: "Tim ads mengklaim ROAS 3,1 dari Facebook mentah; finance mengklaim 2,5 dari Salesforce. Apa keputusan rapat yang benar?",
          options: [
            { text: "Pakai 3,1 — angka platform iklan adalah yang paling dekat dengan kampanye", why: "Salah: 3,1 mengandung 2.700 duplikat. Kedekatan dengan kampanye tidak mengalahkan kebenaran." },
            { text: "Pakai rata-rata keduanya, 2,8, sebagai kompromi", why: "Salah: rata-rata dari angka benar dan angka salah tetap salah. Rekonsiliasi bukan kompromi." },
            { text: "Laporkan 2,5 dari Salesforce sebagai sumber kebenaran revenue; Facebook sebagai pendukung dengan catatan dedup", why: "Tepat: sumber kebenaran disepakati untuk revenue; angka platform dilaporkan dengan selisihnya yang sudah dijelaskan.", correct: true },
            { text: "Tunda semua keputusan budget sampai semua platform cocok 100 persen", why: "Salah: platform tidak pernah cocok 100 persen. Yang dibutuhkan adalah selisih di zona hijau dengan penjelasan, bukan kesamaan sempurna." },
          ],
        },
      ],
    },
  ],
};
