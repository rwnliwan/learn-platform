import type { V2Lesson } from "../lib/types";

export const mk37: V2Lesson = {
  slug: "mk37-python-untuk-marketing",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK37 — Python untuk Marketing: Analisis Tanpa Spreadsheet",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Spreadsheet 40 MB yang crash tiap Senin pagi",
      prose: [
        "Analis marketing KirimCepat membuka spreadsheet 40 MB tiap Senin pagi: 12 sheet, rumus yang saling merujuk, dan satu VLOOKUP yang salah baris sejak 3 minggu lalu tanpa ada yang sadar. Senin ini spreadsheet itu crash — dan laporan mingguan terlambat 4 jam.",
        "Python menggantikan spreadsheet itu dengan skrip 30 baris: baca tiga file CSV, hitung ROAS per channel, tulis satu tabel ringkas. Skrip itu bisa diulang, diuji, dan dijadwalkan — tiga hal yang SULIT dilakukan spreadsheet 40 MB itu dengan andal: pengujian dan penjadwalan butuh makro dan add-in yang rapuh, dan version control-nya manual (salin file, beri nama v2_final_FINAL).",
        "Lesson ini mengajarkan Python untuk marketing: pola kerja analis tanpa spreadsheet. Setelah lesson ini kamu bisa: (1) membaca dan menggabungkan data channel; (2) menghitung ROAS, CTR, dan conversion rate dengan Python; (3) mengelompokkan dan mengurutkan hasil; (4) menulis output yang bisa dibaca manusia; (5) menyusun skrip yang bisa diulang dan dijadwalkan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Grep seluruh track MK untuk Python untuk marketing menghasilkan 0 hit — MK23 mengajarkan SQL untuk marketing dan MK24 mengajarkan Excel dan Sheets, tetapi tidak ada lesson Python untuk analis marketing. MK37 membangun jalur ketiga itu: analisis marketing yang bisa diulang dengan kode.",
      },
      reference: "ROAS: Google 2,8; Meta 1,8; TikTok 3,0. TikTok tertinggi — setelah refund dihitung.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menggantikan spreadsheet mingguan dengan skrip yang jalan tiap Senin pagi tanpa disentuh.",
        "(1) Membaca data channel ke struktur Python (list dan dict);",
        "(2) Menghitung ROAS, CTR, dan conversion rate dari angka mentah;",
        "(3) Mengelompokkan hasil per channel dan mengurutkannya;",
        "(4) Menulis output ringkas yang bisa dibaca manusia;",
        "(5) Menyusun skrip yang deterministik: input sama, output sama.",
      ],
      tasks: [],
    },
    {
      id: "pola-kerja",
      eyebrow: "Langkah 3 · Teori",
      title: "Pola kerja: baca, hitung, kelompokkan, tulis",
      prose: [
        "Pola kerja analis Python ada empat langkah. Baca: data channel masuk sebagai list of dict — tiap baris satu channel dengan spend, revenue, impresi, klik, dan konversi. Hitung: ROAS sama dengan revenue dibagi spend; CTR sama dengan klik dibagi impresi; conversion rate sama dengan konversi dibagi klik. Kelompokkan: hasil dikelompokkan per channel dan diurutkan dari yang terbaik. Tulis: satu tabel ringkas ke layar atau file — bukan 12 sheet.",
        "Contoh hitungan: Google spend 150, revenue 420 — ROAS 420 dibagi 150 sama dengan 2,8. Meta spend 100, revenue 180 — ROAS 1,8. TikTok spend 80, revenue 240 — ROAS 3,0. TikTok tertinggi — tetapi ingat MK32: revenue harus bersih setelah refund sebelum ROAS dipercaya.",
        "Keunggulan skrip atas spreadsheet: skrip bisa diuji (beri input kecil yang jawabannya diketahui, periksa outputnya), bisa dijadwalkan (cron tiap Senin jam 6), dan bisa di-version control (perubahan tercatat, bisa di-rollback). Spreadsheet SECARA TEKNIS bisa ketiganya — makro bisa menguji dan menjadwalkan, file bisa masuk version control — tetapi mekanismenya rapuh: makro sulit diuji otomatis, penjadwalan bergantung pada mesin yang menyala, dan diff file biner tidak terbaca. VLOOKUP yang salah baris adalah bukti kerapuhannya, bukan bukti ketidakmungkinannya.",
      ],
      tasks: [],
      note: {
        title: "Mulai dari Python murni, bukan library besar",
        body: "Lesson ini memakai Python murni (list dan dict) — bukan pandas — supaya logikanya terlihat dan lab bisa jalan di engine Pyodide tanpa dependensi. Bila datamu membesar, pola yang sama pindah ke pandas: groupby menggantikan loop, tetapi rumusnya tetap sama.",
      },
      reference: "ROAS Google 2,8; Meta 1,8; TikTok 3,0. Pola: baca, hitung, kelompokkan, tulis.",
    },
    {
      id: "otomasi-keandalan",
      eyebrow: "Langkah 4 · Teori",
      title: "Otomasi dan keandalan: skrip yang bisa dipercaya",
      prose: [
        "Skrip yang bisa dipercaya punya tiga sifat. Deterministik: input sama menghasilkan output sama — tidak ada random tanpa seed, tidak ada tanggal hari ini yang diam-diam masuk hitungan. Transparan: tiap angka bisa dilacak ke baris inputnya — tidak ada konstanta ajaib tanpa komentar. Gagal dengan cara yang ketahuan: bila file input hilang, skrip berhenti dengan pesan jelas — bukan menulis laporan kosong yang terlihat benar.",
        "Jadwalkan skrip dengan cron: Senin jam 6, baca file minggu lalu, hitung, tulis laporan, kirim ke channel tim. Senin jam 7, analis memeriksa laporan — bukan membangunnya. Waktu yang dihemat dipakai untuk pertanyaan yang lebih sulit: kenapa TikTok naik, bukan berapa ROAS-nya.",
        "Dan satu aturan: skrip tidak pernah menimpa input. Input dibaca, output ditulis ke file baru dengan tanggal. Bila output salah, input masih ada untuk dihitung ulang — pelajaran yang sama seperti bronze di ELT (DE35): data mentah tidak pernah diubah.",
      ],
      tasks: [],
      note: {
        title: "Implementasi pola kerja analis (sketsa)",
        body: "Baca tiga CSV dengan csv.DictReader, gabungkan per channel, hitung ROAS = revenue/spend, CTR = klik/impresi, conversion rate = konversi/klik, urutkan dari ROAS tertinggi, tulis satu tabel ke file baru bertanggal. Jadwalkan dengan cron — 0 6 * * 1 python3 laporan_mingguan.py — Senin jam 6; skrip berhenti dengan pesan jelas bila file input hilang, dan tidak pernah menimpa input.",
      },
      reference: "Deterministik, transparan, gagal dengan cara yang ketahuan. Cron Senin jam 6. Input tidak pernah ditimpa.",
    },
    {
      id: "lab-python",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung ROAS tiga channel dengan Python",
      prose: [
        "Lab ini menghitung ROAS per channel dari spend dan revenue — pola kerja analis Python dalam bentuk mini.",
        "Hitung dulu di kepala. Google: 420 dibagi 150 sama dengan 2,8. Meta: 180 dibagi 100 sama dengan 1,8. TikTok: 240 dibagi 80 sama dengan 3,0.",
        "Tugas lab: tulis fungsi yang menerima daftar channel (nama, spend, revenue) lalu mencetak tiga angka: roas_google, roas_meta, roas_tiktok.",
        "Setelah lolos, coba eksperimen: ubah revenue TikTok menjadi 160 (setelah refund) dan lihat ROAS-nya turun menjadi 2,0 — di bawah Google. Itulah kenapa revenue bersih penting.",
      ],
      tasks: [
        { id: "t1", text: "Hitung roas_google" },
        { id: "t2", text: "Hitung roas_meta" },
        { id: "t3", text: "Hitung roas_tiktok" },
      ],
      expected: "roas_google=2.8\nroas_meta=1.8\nroas_tiktok=3.0",
      hints: [
        "ROAS = revenue dibagi spend.",
        "Cari channel berdasarkan namanya di daftar.",
      ],
      code: {
        starter: `# Data channel KirimCepat: nama, spend, revenue (juta rupiah).\nchannel = [\n    ("Google", 150, 420),\n    ("Meta", 100, 180),\n    ("TikTok", 80, 240),\n]\n\n# TULIS KODEMU: hitung roas_google, roas_meta, roas_tiktok.\n# Cetak, per baris: roas_google, roas_meta, roas_tiktok.\n\n\nmesin_roas(channel)`,
        lockLines: 6,
        solution: `# Data channel KirimCepat: nama, spend, revenue (juta rupiah).\nchannel = [\n    ("Google", 150, 420),\n    ("Meta", 100, 180),\n    ("TikTok", 80, 240),\n]\n\n\ndef mesin_roas(channel):\n    hasil = {}\n    for nama, spend, revenue in channel:\n        hasil[nama] = revenue / spend\n    print(f"roas_google={hasil['Google']}")\n    print(f"roas_meta={hasil['Meta']}")\n    print(f"roas_tiktok={hasil['TikTok']}")\n\n\nmesin_roas(channel)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "roas_google=2.8", label: "ROAS Google 2,8", msg: "420 / 150 = 2,8." },
          { kind: "stdout_matches", task: "t2", pattern: "roas_meta=1.8", label: "ROAS Meta 1,8", msg: "180 / 100 = 1,8. Terendah — kandidat pengurangan spend." },
          { kind: "stdout_matches", task: "t3", pattern: "roas_tiktok=3.0", label: "ROAS TikTok 3,0", msg: "240 / 80 = 3,0. Tertinggi — tetapi cek refund dulu (MK32)." },
        ],
      },
      reference: "ROAS Google 2,8; Meta 1,8; TikTok 3,0.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: Senin pagi yang tidak lagi crash",
      prose: [
        "Kembali ke KirimCepat. Laporan mingguan dipindah ke skrip Python: cron Senin jam 6 membaca tiga CSV, menghitung ROAS, CTR, dan conversion rate, lalu menulis satu tabel ke channel tim. Senin jam 7, analis memeriksa tabel — bukan membangunnya. VLOOKUP yang salah baris tidak pernah terulang, karena tidak ada lagi VLOOKUP.",
        "Tiga bulan kemudian skrip itu diperluas: deteksi anomali sederhana (ROAS turun lebih dari 20 persen dari minggu lalu memicu alert) dan perbandingan dengan minggu lalu. Perluasan itu memakan 20 baris — bukan 3 sheet baru.",
        "Keputusan rapat: semua laporan mingguan yang berulang dipindah ke skrip berversi — spreadsheet hanya untuk eksplorasi sekali jalan, bukan untuk laporan rutin.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat skrip ini bertahan. Pertama, pola baca-hitung-kelompokkan-tulis yang sederhana — mudah dibaca orang berikutnya. Kedua, deterministik dan berversi — output bisa diulang dan perubahan tercatat. Ketiga, input tidak pernah ditimpa — kesalahan bisa dihitung ulang.",
      },
      reference: "Cron Senin jam 6; laporan siap jam 7. Anomali ROAS turun 20 persen memicu alert.",
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
        "Lab: ROAS Google 2,8; Meta 1,8; TikTok 3,0.",
        "Pola kerja: baca, hitung, kelompokkan, tulis.",
        "ROAS = revenue dibagi spend; CTR = klik dibagi impresi; conversion rate = konversi dibagi klik.",
        "Skrip: deterministik, transparan, gagal dengan cara yang ketahuan.",
        "Spreadsheet untuk eksplorasi sekali jalan; skrip untuk laporan rutin.",
      ],
      next: { label: "MK38 — SWOT, 4Ps, dan SMART Goals: Kerangka Klasik Sebelum Angka", href: "/v2/learn/mk38-swot-4p-smart-goals" },
      quiz: [
        {
          q: "Google spend 150 revenue 420; Meta 100/180; TikTok 80/240. Berapa ROAS masing-masing?",
          options: [
            { text: "Google 0,36; Meta 0,56; TikTok 0,33 — terbalik", why: "Salah: ROAS adalah revenue dibagi spend, bukan spend dibagi revenue." },
            { text: "Google 2,8; Meta 1,8; TikTok 2,0 — revenue TikTok disalahhitung", why: "Salah: 240/80 = 3,0, bukan 2,0." },
            { text: "Google 3,0; Meta 2,8; TikTok 1,8 — urutan tertukar", why: "Salah: urutan channel tertukar; hitung satu per satu." },
            { text: "Google 2,8; Meta 1,8; TikTok 3,0", why: "Tepat: 420/150 = 2,8; 180/100 = 1,8; 240/80 = 3,0.", correct: true },
          ],
        },
        {
          q: "Kenapa spreadsheet 40 MB dengan VLOOKUP bermasalah untuk laporan rutin?",
          options: [
            { text: "Pengujian, penjadwalan, dan version control-nya rapuh dan manual — dan satu VLOOKUP salah merusak laporan diam-diam", why: "Tepat: spreadsheet secara teknis bisa ketiganya, tetapi mekanismenya rapuh — makro sulit diuji otomatis, penjadwalan bergantung mesin yang menyala, diff biner tidak terbaca.", correct: true },
            { text: "Karena spreadsheet tidak bisa menghitung ROAS", why: "Salah: spreadsheet bisa menghitung — masalahnya keandalan dan keterulangan." },
            { text: "Karena spreadsheet selalu crash", why: "Salah: tidak selalu — tetapi rapuh saat membesar, dan crash Senin pagi adalah buktinya." },
            { text: "Karena analis tidak bisa memakai spreadsheet", why: "Salah: analis bisa — masalahnya di alat, bukan orangnya." },
          ],
        },
        {
          q: "Apa arti skrip yang deterministik?",
          options: [
            { text: "Skrip berjalan sangat cepat", why: "Salah: deterministik soal keterulangan hasil, bukan kecepatan." },
            { text: "Input sama menghasilkan output sama — tidak ada random tanpa seed atau tanggal diam-diam", why: "Tepat: keterulangan adalah syarat laporan bisa dipercaya.", correct: true },
            { text: "Skrip tidak pernah gagal", why: "Salah: skrip bisa gagal — yang penting gagal dengan cara yang ketahuan." },
            { text: "Skrip hanya memakai satu library", why: "Salah: jumlah library tidak ada hubungannya dengan determinisme." },
          ],
        },
        {
          q: "File input hilang saat cron berjalan. Apa yang harus dilakukan skrip?",
          options: [
            { text: "Menulis laporan kosong yang terlihat benar", why: "Salah: laporan kosong yang terlihat benar adalah kebohongan — lebih berbahaya dari tidak ada laporan." },
            { text: "Memakai data minggu lalu diam-diam", why: "Salah: memakai data lama tanpa label adalah manipulasi." },
            { text: "Berhenti dengan pesan jelas bahwa file input hilang", why: "Tepat: gagal dengan cara yang ketahuan — tim tahu laporan tidak ada, bukan mengira angkanya nol.", correct: true },
            { text: "Membuat file input palsu", why: "Salah: memalsukan input adalah fabrikasi data." },
          ],
        },
        {
          q: "Kapan spreadsheet masih tepat dipakai?",
          options: [
            { text: "Untuk semua laporan, termasuk rutin mingguan", why: "Salah: laporan rutin yang berulang lebih baik di skrip berversi." },
            { text: "Tidak pernah — spreadsheet harus dilarang", why: "Salah: larangan total tidak realistis; tiap alat punya tempatnya." },
            { text: "Hanya bila datanya di bawah 1.000 baris", why: "Salah: ukuran bukan pembedanya — keterulangan dan kebutuhan jadwal yang membedakan." },
            { text: "Untuk eksplorasi sekali jalan — bukan laporan rutin", why: "Tepat: spreadsheet unggul untuk melihat-lihat cepat; skrip unggul untuk yang berulang.", correct: true },
          ],
        },
      ],
    },
  ],
};
