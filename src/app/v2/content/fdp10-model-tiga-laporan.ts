import type { V2Lesson } from "../lib/types";

export const fdp10: V2Lesson = {
  slug: "fdp10-model-tiga-laporan",
  track: "Financial Data Pipeline",
  module: "Pemodelan dan Forecasting",
  title: "FDP10 — Model 3-Laporan Forecasting dan Rekonsiliasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pipeline yang bisa membaca masa lalu — tetapi analis ditanya soal masa depan",
      prose: [
        "Pipeline FDP sudah bekerja: ia mengambil filings, membersihkannya, dan menghitung rasio historis. Lalu kepala analis datang dengan permintaan baru: buat forecast tahun depan — tiga laporan sekaligus — dan buktikan angkanya konsisten. Bukan satu spreadsheet dengan angka yang diketik manual, melainkan model yang dihasilkan pipeline, dengan gerbang rekonsiliasi yang memeriksa keseimbangannya.",
        "Di sinilah banyak model gagal diam-diam: laporan laba-rugi dibuat, neraca dibuat, arus kas dibuat — tetapi ketiganya tidak saling terikat. Laba bersih tidak mengalir ke laba ditahan. Belanja modal tidak mengubah aset tetap. Kas akhir di arus kas berbeda dengan kas di neraca. Model seperti itu bukan model — itu tiga tabel yang kebetulan berdampingan.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan arsitektur model tiga laporan — bagaimana laba-rugi, neraca, dan arus kas saling mengikat; (2) membangun forecast satu tahun dari driver berbasis persen dari revenue; (3) memakai kas sebagai plug dan memeriksa keseimbangan neraca sebagai gerbang rekonsiliasi; (4) membandingkan forecast dengan aktual lewat variance analysis dan merevisi asumsi.",
      ],
      tasks: [],
      note: {
        title: "Satu angka, tiga tempat",
        body: "Setiap angka dalam model tiga laporan muncul di lebih dari satu tempat — dan itulah pengamannya. Laba bersih muncul di laba-rugi, di laba ditahan, dan di arus kas operasi. Bila satu tempat berubah tanpa yang lain ikut berubah, modelnya rusak — dan gerbang rekonsiliasi akan menangkapnya.",
      },
      reference: "Tiga laporan, satu kebenaran: bila neraca tidak balance, modelnya salah — bukan pasarnya.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menghasilkan forecast tiga laporan dari pipeline dan membuktikan kebenarannya sebelum diserahkan ke analis.",
        "(1) Menjelaskan kaitan antar-laporan: laba bersih ke laba ditahan, capex dan depresiasi ke aset tetap, perubahan modal kerja ke arus kas operasi;",
        "(2) Membangun forecast 2025 dari aktual 2024 dengan driver eksplisit — growth revenue, margin, tarif pajak, payout dividen;",
        "(3) Memakai kas sebagai plug dan memeriksa selisih aset dengan liabilitas ditambah ekuitas sebagai gerbang rekonsiliasi;",
        "(4) Menjalankan variance analysis forecast vs aktual dan memutuskan apakah yang salah adalah asumsi atau modelnya.",
      ],
      tasks: [],
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Teori",
      title: "Arsitektur: tiga laporan yang saling mengikat",
      prose: [
        "Laporan laba-rugi adalah mesinnya: revenue dikurangi harga pokok penjualan menjadi laba bruto; dikurangi biaya operasional menjadi EBIT; dikurangi bunga menjadi laba sebelum pajak; dikurangi pajak menjadi laba bersih. Setiap baris memakai driver: harga pokok sebagai persen dari revenue, biaya operasional dengan growth sendiri, pajak dengan tarif efektif.",
        "Neraca adalah penampungnya: laba bersih yang tidak dibagikan sebagai dividen menambah laba ditahan di ekuitas. Piutang, persediaan, dan utang usaha diproyeksikan sebagai persen dari revenue. Aset tetap bergerak oleh belanja modal dikurangi depresiasi. Kas adalah plug — ia menyesuaikan agar neraca balance, dan nilainya harus sama persis dengan kas akhir di laporan arus kas.",
        "Laporan arus kas adalah pemeriksanya: arus kas operasi sama dengan laba bersih ditambah depresiasi dikurangi perubahan modal kerja; arus kas investasi adalah belanja modal; arus kas pendanaan adalah dividen dan perubahan utang. Kas akhir sama dengan kas awal ditambah ketiga arus kas — dan angka ini harus sama dengan kas di neraca. Bila tidak sama, ada kaitan yang putus.",
      ],
      tasks: [],
      formula: String.raw`\text{Kas akhir} = \text{Kas awal} + CFO + CFI + CFF, \quad \text{Aset} = \text{Liabilitas} + \text{Ekuitas}`,
      formulaNote: "CFO = laba bersih + depresiasi - perubahan modal kerja. CFI = belanja modal (negatif). CFF = dividen + perubahan utang. Dua persamaan ini adalah gerbang rekonsiliasi model.",
      reference: "Laba-rugi = mesin. Neraca = penampung. Arus kas = pemeriksa. Kas harus sama di dua tempat.",
    },
    {
      id: "plug-rekonsiliasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Kas sebagai plug dan gerbang rekonsiliasi",
      prose: [
        "Kas sebagai plug berarti: hitung semua pos neraca kecuali kas, hitung liabilitas ditambah ekuitas, lalu kas adalah selisihnya. Ini bukan trik — ini definisi: kas adalah satu-satunya pos yang menyesuaikan karena ia adalah hasil dari semua arus kas. Bila model dibangun dengan benar, kas plug ini sama persis dengan kas akhir dari laporan arus kas. Bila berbeda, modelnya punya kaitan yang putus — misal dividen dikurangkan dua kali, atau depresiasi lupa ditambahkan kembali di arus kas operasi.",
        "Gerbang rekonsiliasi pipeline memeriksa tiga hal sebelum forecast boleh diserahkan: satu, neraca balance — selisih aset dengan liabilitas ditambah ekuitas sama dengan nol. Dua, kas konsisten — kas plug sama dengan kas akhir arus kas. Tiga, jejak audit — setiap angka forecast bisa dilacak ke driver dan ke aktual tahun sebelumnya.",
        "Variance analysis adalah gerbang kedua — setelah aktual terbit. Bandingkan forecast dengan aktual per driver: revenue, margin, modal kerja. Selisih dijelaskan per driver, bukan sebagai satu angka. Bila revenue meleset 4,55 persen dan laba bersih meleset 9,52 persen, yang salah adalah asumsi growth — bukan modelnya. Bila revenue tepat tetapi laba meleset, yang salah adalah asumsi margin atau biaya. Diagnosis yang tepat menentukan apakah yang direvisi adalah asumsi, bukan model.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memaksa neraca balance dengan menaruh selisih di pos 'lain-lain'. Itu menyembunyikan kesalahan, bukan memperbaikinya. Selisih neraca adalah alarm — bila ia tidak nol, cari kaitan yang putus. Model yang balance karena dipaksa sama berbahayanya dengan model yang tidak balance.",
      },
      reference: "Tiga gerbang: neraca balance, kas konsisten, jejak audit. Selisih bukan untuk disembunyikan — ia adalah alarm.",
    },
    {
      id: "lab-forecast",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: forecast 2025 dan gerbang keseimbangan",
      prose: [
        "Bangun forecast 2025 dari aktual 2024 (dalam Rp miliar). Aktual 2024: revenue 1.000; harga pokok 600; biaya operasional 200; bunga 20; pajak 22 persen. Neraca 2024: kas 80; piutang 120; persediaan 150; aset tetap bersih 400; utang usaha 90; utang 300; ekuitas 360. Total aset 750 sama dengan liabilitas ditambah ekuitas 750.",
        "Asumsi 2025: revenue naik 10 persen menjadi 1.100; harga pokok 60 persen dari revenue; biaya operasional naik 5 persen menjadi 210; bunga tetap 20; pajak 22 persen; dividen 40 persen dari laba bersih; piutang 12 persen dari revenue; persediaan 15 persen; utang usaha 9 persen; belanja modal 60; depresiasi 50; utang tetap.",
        "Hitung di kepala dulu: laba kotor 440; EBIT 230; laba sebelum pajak 210; pajak 46,2; laba bersih 163,8. Dividen 65,52; laba ditahan bertambah 98,28. Arus kas operasi = 163,8 + 50 - (12 + 15 - 9) = 195,8. Perubahan kas = 195,8 - 60 - 65,52 = 70,28; kas akhir 150,28. Neraca 2025: kas 150,28 + piutang 132 + persediaan 165 + aset tetap 410 = 857,28; liabilitas ditambah ekuitas = 99 + 300 + 458,28 = 857,28. Selisih nol — gerbang lolos.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `laba_bersih`, `dividen`, dan `cfo` dari driver 2025" },
        { id: "t2", text: "Hitung `kas_akhir` dan `selisih_neraca` (aset - liabilitas - ekuitas), lalu cetak ketiganya" },
      ],
      expected: "laba_bersih=163.80  kas_akhir=150.28  selisih_neraca=0.00",
      hints: [
        "Laba bersih: revenue 1100 - HPP 660 - opex 210 - bunga 20 = EBT 210; pajak 22 persen; NI = EBT × 0,78.",
        "CFO = NI + depresiasi 50 - perubahan modal kerja; perubahan WC = (132-120) + (165-150) - (99-90).",
        "Kas akhir = 80 + CFO - capex 60 - dividen; dividen = 40 persen dari NI.",
        "Selisih = (kas + 132 + 165 + 410) - (99 + 300 + (360 + NI - dividen)) — harus nol.",
      ],
      code: {
        starter: `# Forecast 2025 (Rp miliar) dari aktual 2024\nrev = 1100.0            # revenue +10 persen\nhpp = 0.60 * rev\nopex = 210.0             # +5 persen dari 200\nbunga = 20.0\npajak_tarif = 0.22\n# Neraca 2024: kas 80, piutang 120, persediaan 150, aset tetap 400\n# utang usaha 90, utang 300, ekuitas 360\n\n# TULIS KODEMU\nlaba_bersih = \ndividen = \ncfo = \nkas_akhir = \nselisih_neraca = \n\nprint(f"laba_bersih={laba_bersih:.2f}  kas_akhir={kas_akhir:.2f}  selisih_neraca={selisih_neraca:.2f}")`,
        lockLines: 7,
        solution: `# Forecast 2025 (Rp miliar) dari aktual 2024\nrev = 1100.0            # revenue +10 persen\nhpp = 0.60 * rev\nopex = 210.0             # +5 persen dari 200\nbunga = 20.0\npajak_tarif = 0.22\n# Neraca 2024: kas 80, piutang 120, persediaan 150, aset tetap 400\n# utang usaha 90, utang 300, ekuitas 360\n\n# TULIS KODEMU\nebit = rev - hpp - opex\nebt = ebit - bunga\nlaba_bersih = ebt * (1 - pajak_tarif)\ndividen = 0.40 * laba_bersih\npiutang = 0.12 * rev\npersediaan = 0.15 * rev\nutang_usaha = 0.09 * rev\nd_wc = (piutang - 120) + (persediaan - 150) - (utang_usaha - 90)\ncfo = laba_bersih + 50 - d_wc\nkas_akhir = 80 + cfo - 60 - dividen\naset_tetap = 400 + 60 - 50\nekuitas = 360 + (laba_bersih - dividen)\nselisih_neraca = (kas_akhir + piutang + persediaan + aset_tetap) - (utang_usaha + 300 + ekuitas)\n\nprint(f"laba_bersih={laba_bersih:.2f}  kas_akhir={kas_akhir:.2f}  selisih_neraca={selisih_neraca:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "laba_bersih", value: 163.8, tol: 0.01, label: "`laba_bersih` = 163,80", msg: "EBT 210 × (1 - 0,22) = 163,8." },
          { kind: "equal", task: "t1", name: "cfo", value: 195.8, tol: 0.01, label: "`cfo` = 195,80", msg: "163,8 + 50 - 18 = 195,8 (perubahan WC = 12 + 15 - 9 = 18)." },
          { kind: "equal", task: "t2", name: "kas_akhir", value: 150.28, tol: 0.01, label: "`kas_akhir` = 150,28", msg: "80 + 195,8 - 60 - 65,52 = 150,28." },
          { kind: "equal", task: "t2", name: "selisih_neraca", value: 0, tol: 0.001, label: "`selisih_neraca` = 0", msg: "Aset 857,28 = liabilitas + ekuitas 857,28 — gerbang lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih_neraca=0\\.00", label: "`print` menampilkan selisih neraca nol", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NI 163,8; CFO 195,8; kas akhir 150,28; selisih neraca 0 — tiga laporan saling mengikat.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: aktual meleset — yang salah asumsi atau model?",
      prose: [
        "Aktual 2025 terbit: revenue 1.050, bukan 1.100 seperti forecast. Harga pokok 630 (60 persen dari revenue — driver tepat), biaya operasional 210 (tepat), bunga 20 (tepat). EBIT aktual 210, laba sebelum pajak 190, pajak 41,8, laba bersih 148,2 — meleset 15,6 dari forecast 163,8, alias minus 9,52 persen.",
        "Diagnosis per driver: revenue meleset minus 50 (minus 4,55 persen dari forecast); margin kotor tepat (60 persen); biaya operasional tepat. Seluruh selisih laba bersih berasal dari revenue yang meleset — diperbesar oleh operating leverage: biaya operasional tetap 210, sehingga setiap rupiah revenue yang hilang memotong laba hampir satu banding satu setelah pajak. Yang salah adalah asumsi growth 10 persen — bukan modelnya.",
        "Tindakan: revisi asumsi growth untuk forecast 2026 menjadi 5 persen dengan skenario (pesimis 0 persen, basis 5 persen, optimis 10 persen), dan tambahkan gerbang ke pipeline: bila revenue aktual meleset lebih dari 5 persen dari forecast, forecast berikutnya wajib memakai skenario tiga jalur, bukan satu angka. Model yang benar tidak pernah disalahkan karena asumsinya salah — ia diperbaiki dengan asumsi yang lebih jujur.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "NI aktual 148,2 vs forecast 163,8: selisih minus 15,6 (minus 9,52 persen). Revenue meleset minus 4,55 persen; karena opex tetap, laba meleset hampir dua kali lipat dalam persen. Diagnosis: asumsi growth, bukan model. Revisi: skenario tiga jalur untuk 2026.",
      },
      reference: "Revenue meleset 4,55 persen, laba meleset 9,52 persen — operating leverage memperbesar kesalahan asumsi.",
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
        "Tiga laporan saling mengikat: laba bersih ke laba ditahan, capex dan depresiasi ke aset tetap, perubahan modal kerja ke arus kas operasi.",
        "Kas adalah plug: kas akhir arus kas harus sama dengan kas di neraca; selisih neraca harus nol.",
        "Lab: NI 163,8; CFO 195,8; kas akhir 150,28; selisih neraca 0 — gerbang lolos.",
        "Variance analysis per driver: revenue meleset 4,55 persen, laba meleset 9,52 persen — operating leverage memperbesar kesalahan asumsi.",
        "Jangan paksa neraca balance lewat pos lain-lain — selisih adalah alarm, bukan sesuatu untuk disembunyikan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Neraca forecast tidak balance — selisih Rp5 miliar. Apa tindakan yang benar?",
          options: [
            { text: "Taruh selisih di pos lain-lain agar balance", why: "Salah: itu menyembunyikan kesalahan, bukan memperbaikinya. Selisih adalah alarm bahwa ada kaitan yang putus." },
            { text: "Cari kaitan yang putus — misal dividen dihitung dua kali atau depresiasi lupa ditambahkan kembali di arus kas operasi", why: "Tepat: selisih neraca berarti satu angka tidak mengalir ke tempat yang benar. Perbaiki kaitannya, jangan sembunyikan selisihnya.", correct: true },
            { text: "Abaikan — selisih kecil tidak memengaruhi keputusan", why: "Salah: selisih berapa pun berarti modelnya rusak. Bila selisih kecil dibiarkan, selisih besar tidak akan ketahuan." },
            { text: "Ubah asumsi revenue sampai balance", why: "Salah: mengubah asumsi untuk memaksa balance adalah memalsukan input agar output terlihat benar." },
          ],
        },
        {
          q: "Kenapa kas dipakai sebagai plug dalam model tiga laporan?",
          options: [
            { text: "Karena kas adalah angka yang paling tidak penting", why: "Salah: kas justru adalah hasil dari semua arus kas — ia menyesuaikan karena ia adalah penampung terakhir." },
            { text: "Karena kas adalah hasil dari semua arus kas — ia satu-satunya pos yang wajar menyesuaikan agar neraca balance", why: "Tepat: kas akhir dari arus kas harus sama dengan kas plug di neraca. Bila keduanya sama, model konsisten.", correct: true },
            { text: "Karena kas tidak pernah berubah", why: "Salah: kas berubah setiap periode — justru karena itulah ia menjadi plug." },
            { text: "Karena utang tidak boleh berubah", why: "Salah: utang boleh berubah bila ada asumsi penarikan atau pelunasan. Kas menjadi plug bukan karena utang dilarang berubah." },
          ],
        },
        {
          q: "Forecast 2025: NI 163,8 dan kas akhir 150,28. Komponen mana yang paling besar mengurangi kas?",
          options: [
            { text: "Dividen 65,52 — lebih besar dari capex 60", why: "Tepat: arus keluar kas adalah capex 60 dan dividen 65,52. Dividen adalah pengurang kas terbesar di tahun ini.", correct: true },
            { text: "Capex 60 — belanja modal selalu yang terbesar", why: "Salah: capex 60 lebih kecil dari dividen 65,52 di tahun ini." },
            { text: "Pajak 46,2 — pajak selalu yang terbesar", why: "Salah: pajak sudah di dalam perhitungan laba bersih, bukan arus keluar terpisah di perhitungan kas akhir ini." },
            { text: "Perubahan modal kerja 18 — persediaan menumpuk", why: "Salah: perubahan modal kerja 18 sudah dikurangkan di dalam CFO — dan nilainya lebih kecil dari dividen maupun capex." },
          ],
        },
        {
          q: "Aktual: revenue meleset minus 4,55 persen, laba bersih meleset minus 9,52 persen. Apa diagnosis yang benar?",
          options: [
            { text: "Modelnya rusak — harus dibangun ulang", why: "Salah: driver margin dan biaya semuanya tepat. Yang meleset hanya asumsi growth revenue." },
            { text: "Asumsi growth yang salah, diperbesar operating leverage karena biaya operasional tetap", why: "Tepat: revenue hilang 50, tetapi laba hilang 15,6 setelah pajak — karena opex 210 tidak ikut turun saat revenue turun.", correct: true },
            { text: "Harga pokok salah — driver 60 persen tidak berlaku", why: "Salah: HPP aktual 630 adalah 60 persen dari revenue aktual 1.050 — drivernya tepat." },
            { text: "Pajak salah — tarif 22 persen tidak berlaku", why: "Salah: pajak aktual 41,8 adalah 22 persen dari 190 — tarifnya tepat." },
          ],
        },
        {
          q: "Apa isi gerbang rekonsiliasi pipeline sebelum forecast boleh diserahkan?",
          options: [
            { text: "Hanya revenue forecast harus di atas revenue aktual tahun lalu", why: "Salah: itu bukan gerbang — itu asumsi growth yang belum tentu benar." },
            { text: "Neraca balance, kas konsisten antara plug dan arus kas, dan setiap angka bisa dilacak ke driver dan aktual sebelumnya", why: "Tepat: tiga gerbang itu memastikan model konsisten secara internal dan bisa diaudit.", correct: true },
            { text: "Hanya laba bersih harus positif", why: "Salah: laba positif bukan bukti model benar. Model yang salah pun bisa menghasilkan laba positif." },
            { text: "Hanya file harus tersimpan dalam format yang benar", why: "Salah: format file bukan gerbang kebenaran angka." },
          ],
        },
      ],
    },
  ],
};
