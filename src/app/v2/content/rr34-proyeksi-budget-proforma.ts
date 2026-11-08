import type { V2Lesson } from "../lib/types";

export const rr34: V2Lesson = {
  slug: "rr34-proyeksi-budget-proforma",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR34 — Pelaporan Proyeksi, Budget, dan Pro Forma: Laporan Masa Depan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Budget yang disetujui, lalu laba meleset 15 persen",
      prose: [
        "Bank Artha Dana menyetujui budget 2026: pendapatan tumbuh 8 persen, biaya tumbuh 5 persen, laba naik 15 persen menjadi Rp345 miliar. Realisasi kuartal pertama: pendapatan hanya tumbuh 5 persen — laba Rp315 miliar, bukan Rp345 miliar. Direksi bertanya: apakah budget itu salah, atau realisasinya yang salah?",
        "Jawabannya: tidak ada yang salah — tetapi tidak ada yang menguji sensitivitas. Laporan proyeksi hanya menampilkan satu skenario (tumbuh 8 persen) tanpa menunjukkan apa yang terjadi bila tumbuh 5 persen. Direksi menyetujui angka tanpa tahu seberapa rapuh angka itu terhadap asumsinya.",
        "Lesson ini mengajarkan pelaporan proyeksi, budget, dan pro forma beserta sensitivitasnya. Setelah lesson ini kamu bisa: (1) membangun laporan pro forma dari asumsi; (2) menghitung laba pro forma; (3) menguji sensitivitas terhadap asumsi kunci; (4) membedakan budget, forecast, dan pro forma; (5) menulis laporan proyeksi yang jujur tentang asumsinya.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "RR11 mengajarkan sensitivitas NPL terhadap shock GDP dan RR16 menyinggung sensitivitas CAR — tetapi tidak ada lesson tentang pelaporan proyeksi, budget, dan pro forma sebagai artefak: membangun laporan laba pro forma dari asumsi pertumbuhan dan menguji sensitivitasnya. Lesson ini membangun artefak itu.",
      },
      reference: "Pro forma: pendapatan 1.080, biaya 735, laba 345 (naik 15 persen dari 300). Sensitivitas tumbuh 5 persen: pendapatan 1.050, laba 315.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, laporan proyeksi-mu tidak lagi menampilkan satu angka tanpa jejak — melainkan angka, asumsi, dan sensitivitasnya.",
        "(1) Membedakan budget (target yang disepakati), forecast (perkiraan berjalan), dan pro forma (laporan seandainya);",
        "(2) Membangun laba pro forma dari asumsi pertumbuhan pendapatan dan biaya;",
        "(3) Menghitung sensitivitas laba terhadap asumsi kunci;",
        "(4) Menulis asumsi sebelum hasil — dengan sumber tiap asumsi;",
        "(5) Menyajikan jarak ke target, bukan sekadar lolos atau gagal.",
      ],
      tasks: [],
    },
    {
      id: "proforma",
      eyebrow: "Langkah 3 · Teori",
      title: "Pro forma: laporan seandainya",
      prose: [
        "Pro forma adalah laporan 'seandainya': seandainya pendapatan tumbuh 8 persen dan biaya tumbuh 5 persen, seperti apa laba kita. Pendapatan 1.000 tumbuh 8 persen menjadi 1.080. Biaya 700 tumbuh 5 persen menjadi 735. Laba 1.080 dikurangi 735 sama dengan 345 — naik 15 persen dari laba 300. Tiga baris itu adalah seluruh isi laporan pro forma di cerita pembuka — dan seluruh perdebatan direksi seharusnya berpusat pada dua angka asumsi itu, bukan pada 345.",
        "Budget adalah target yang disepakati dan dipakai menilai kinerja — ia mengikat. Forecast adalah perkiraan berjalan yang diperbarui tiap ada data baru — ia tidak mengikat, ia memberi tahu. Pro forma adalah skenario 'seandainya' untuk keputusan tertentu — misalnya seandainya akuisisi terjadi. Tiga dokumen ini sering tertukar: forecast yang diperlakukan sebagai budget membuat manajer dihukum karena realisasi yang tidak mereka kendalikan; budget yang diperlakukan sebagai forecast membuat target bergeser tiap kuartal.",
        "Aturan penulisan: asumsi ditulis sebelum hasil, dengan sumbernya — 'pendapatan tumbuh 8 persen (rata-rata 3 tahun terakhir 7,2 persen, ditambah 0,8 dari cabang baru)'. Asumsi tanpa sumber adalah tebakan dengan format laporan.",
      ],
      tasks: [],
      note: {
        title: "Pro forma bukan ramalan",
        body: "Pro forma tidak mengklaim masa depan akan seperti itu — ia menunjukkan konsekuensi logis dari asumsi. Bila direksi tidak setuju asumsinya, pro forma-nya ikut tidak berlaku. Itulah kenapa asumsi ditulis dulu: perdebatan yang sehat adalah perdebatan soal asumsi, bukan soal hasil hitungan.",
      },
      reference: "Pro forma: 1.080 dikurangi 735 sama dengan 345, naik 15 persen dari 300. Budget mengikat, forecast memberi tahu, pro forma berskenario.",
    },
    {
      id: "sensitivitas",
      eyebrow: "Langkah 4 · Teori",
      title: "Sensitivitas: seberapa rapuh angka itu",
      prose: [
        "Sensitivitas menguji satu asumsi pada satu waktu. Bila pendapatan hanya tumbuh 5 persen (bukan 8): pendapatan menjadi 1.050, biaya tetap 735, laba menjadi 315 — bukan 345. Selisih 30 miliar dari perubahan 3 poin persen pertumbuhan. Direksi yang melihat angka ini sebelum menyetujui budget akan bertanya: seberapa yakin kita pada 8 persen — dan apa rencana bila hanya 5 persen?",
        "Sajikan sensitivitas sebagai tabel, bukan kalimat: tiap baris satu skenario (tumbuh 5, 8, 11 persen) dengan laba masing-masing (315, 345, 375). Laba pada tumbuh 11 persen: pendapatan 1.110 dikurangi 735 sama dengan 375. Tabel itu mengubah rapat dari 'setuju atau tidak' menjadi 'skenario mana yang kita yakini, dan apa rencana cadangannya'.",
        "Dan seperti RR11: yang penting bukan angkanya, melainkan jarak ke batas. Bila target laba minimum 320, maka skenario 5 persen (315) berada di bawah target — jaraknya minus 5. Laporan yang baik menyorot jarak itu, bukan menyembunyikannya di balik rata-rata.",
      ],
      tasks: [],
      reference: "Sensitivitas: tumbuh 5 persen laba 315; 8 persen laba 345; 11 persen laba 375. Target 320: skenario 5 persen di bawah target 5 miliar.",
    },
    {
      id: "lab-proforma",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung laba pro forma dan sensitivitasnya",
      prose: [
        "Lab ini menghitung laba pro forma dan laba pada skenario sensitivitas dari asumsi pertumbuhan.",
        "Hitung dulu di kepala. Pro forma: pendapatan 1.000 dikali 1,08 sama dengan 1.080; biaya 700 dikali 1,05 sama dengan 735; laba 1.080 dikurangi 735 sama dengan 345. Kenaikan: 345 dikurangi 300 sama dengan 45; 45 dibagi 300 dikali 100 sama dengan 15,0 persen. Sensitivitas: pendapatan 1.000 dikali 1,05 sama dengan 1.050; laba 1.050 dikurangi 735 sama dengan 315.",
        "Tugas lab: tulis fungsi yang menerima pendapatan, biaya, laba dasar, dan dua tingkat pertumbuhan — lalu mencetak tiga angka: laba_proforma, laba_sensitif, kenaikan_persen.",
        "Setelah lolos, coba eksperimen: ubah pertumbuhan sensitif menjadi 2 persen dan lihat laba jatuh menjadi 285 — di bawah target 320. Itulah gunanya tabel sensitivitas.",
      ],
      tasks: [
        { id: "t1", text: "Hitung laba_proforma dari asumsi dasar" },
        { id: "t2", text: "Hitung laba_sensitif dari pertumbuhan 5 persen" },
        { id: "t3", text: "Hitung kenaikan_persen laba pro forma" },
      ],
      expected: "laba_proforma=345\nlaba_sensitif=315\nkenaikan_persen=15.0",
      hints: [
        "Pendapatan pro forma = pendapatan dikali 1 tambah pertumbuhan.",
        "Laba = pendapatan dikurangi biaya.",
        "Kenaikan persen = laba baru dikurangi laba dasar, dibagi laba dasar, dikali 100.",
      ],
      code: {
        starter: `# Budget Bank Artha Dana 2026 (miliar rupiah).\npendapatan = 1000\nbiaya = 700\nlaba_dasar = 300\ntumbuh_proforma = 8\ntumbuh_sensitif = 5\nbiaya_tumbuh = 5\n\n# TULIS KODEMU: hitung laba_proforma, laba_sensitif, kenaikan_persen.\n# Cetak, per baris: laba_proforma, laba_sensitif, kenaikan_persen.\n\n\nmesin_proforma(pendapatan, biaya, laba_dasar, tumbuh_proforma, tumbuh_sensitif, biaya_tumbuh)`,
        lockLines: 7,
        solution: `# Budget Bank Artha Dana 2026 (miliar rupiah).\npendapatan = 1000\nbiaya = 700\nlaba_dasar = 300\ntumbuh_proforma = 8\ntumbuh_sensitif = 5\nbiaya_tumbuh = 5\n\n\ndef mesin_proforma(pendapatan, biaya, laba_dasar, tumbuh_proforma, tumbuh_sensitif, biaya_tumbuh):\n    pend_proforma = pendapatan * (1 + tumbuh_proforma / 100)\n    biaya_proforma = biaya * (1 + biaya_tumbuh / 100)\n    laba_proforma = pend_proforma - biaya_proforma\n    pend_sensitif = pendapatan * (1 + tumbuh_sensitif / 100)\n    laba_sensitif = pend_sensitif - biaya_proforma\n    kenaikan_persen = (laba_proforma - laba_dasar) / laba_dasar * 100\n    print(f"laba_proforma={laba_proforma:.0f}")\n    print(f"laba_sensitif={laba_sensitif:.0f}")\n    print(f"kenaikan_persen={kenaikan_persen}")\n\n\nmesin_proforma(pendapatan, biaya, laba_dasar, tumbuh_proforma, tumbuh_sensitif, biaya_tumbuh)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "laba_proforma=345", label: "Laba pro forma 345", msg: "1.080 - 735 = 345 miliar." },
          { kind: "stdout_matches", task: "t2", pattern: "laba_sensitif=315", label: "Laba sensitif 315", msg: "1.050 - 735 = 315 miliar. Turun 30 dari pro forma." },
          { kind: "stdout_matches", task: "t3", pattern: "kenaikan_persen=15.0", label: "Naik 15,0 persen", msg: "(345 - 300) / 300 x 100 = 15,0 persen." },
        ],
      },
      reference: "Laba pro forma 345 (naik 15,0 persen); sensitif 315.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: budget yang disetujui dengan mata terbuka",
      prose: [
        "Kembali ke Bank Artha Dana. Budget 2026 diajukan ulang dengan tabel sensitivitas: tumbuh 5 persen laba 315, 8 persen laba 345, 11 persen laba 375 — plus rencana cadangan bila skenario 5 persen terjadi (penundaan ekspansi cabang, penghematan biaya 20 miliar). Direksi menyetujui budget 345 dengan sadar bahwa 5 persen pertumbuhan berarti 315 — dan rencana cadangannya sudah disiapkan.",
        "Kuartal pertama realisasi tumbuh 5 persen. Tidak ada yang panik: skenario itu sudah ada di tabel, dan rencana cadangan dijalankan tanpa rapat darurat. Budget yang jujur tentang sensitivitasnya mengubah kejutan menjadi rencana.",
        "Keputusan rapat: semua laporan proyeksi wajib melampirkan tabel sensitivitas dan sumber tiap asumsi. Laporan tanpa keduanya dikembalikan — berapa pun bagusnya angkanya.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat budget baru dipercaya. Pertama, asumsi ditulis dengan sumber sebelum hasil. Kedua, sensitivitas disajikan sebagai tabel — rapat membahas skenario, bukan setuju atau tidak. Ketiga, rencana cadangan disiapkan untuk skenario buruk sebelum ia terjadi.",
      },
      reference: "Tabel sensitivitas 315, 345, 375. Rencana cadangan disiapkan untuk skenario 5 persen sebelum terjadi.",
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
        "Lab: laba pro forma 345 (naik 15,0 persen); sensitif 315.",
        "Budget mengikat, forecast memberi tahu, pro forma berskenario.",
        "Asumsi ditulis sebelum hasil, dengan sumbernya.",
        "Sensitivitas: tumbuh 5 persen laba 315; 8 persen 345; 11 persen 375.",
        "Yang penting jarak ke target, bukan sekadar lolos atau gagal.",
      ],
      next: { label: "RR35 — GRI dan CSRD: Pelengkap ISSB untuk Laporan Keberlanjutan", href: "/v2/learn/rr35-gri-csrd" },
      quiz: [
        {
          q: "Pendapatan 1.000 tumbuh 8 persen, biaya 700 tumbuh 5 persen, laba dasar 300. Berapa laba pro forma dan kenaikannya?",
          options: [
            { text: "Laba 345, naik 45 persen — selisih disalahartikan", why: "Salah: 45 adalah selisih absolut (miliar), bukan persen; persennya 15,0." },
            { text: "Laba 345, naik 15,0 persen", why: "Tepat: 1.080 - 735 = 345; (345 - 300) / 300 = 15,0 persen.", correct: true },
            { text: "Laba 380, naik 26,7 persen — biaya tidak tumbuh", why: "Salah: biaya ikut tumbuh 5 persen menjadi 735; mengabaikannya membesarkan laba." },
            { text: "Laba 315, naik 5,0 persen — itu skenario sensitif", why: "Salah: 315 adalah laba bila tumbuh 5 persen, bukan pro forma 8 persen." },
          ],
        },
        {
          q: "Bila pendapatan hanya tumbuh 5 persen, berapa laba dan apa artinya terhadap target 320?",
          options: [
            { text: "Laba 315 — di atas target karena masih positif", why: "Salah: positif bukan berarti memenuhi target; 315 di bawah 320." },
            { text: "Laba 345 — sensitivitas tidak mengubah laba", why: "Salah: sensitivitas justru menunjukkan laba berubah mengikuti asumsi." },
            { text: "Laba 315 — di bawah target 5 miliar", why: "Tepat: 1.050 - 735 = 315; jarak ke target 320 adalah minus 5.", correct: true },
            { text: "Laba 300 — kembali ke laba dasar", why: "Salah: tumbuh 5 persen tetap menaikkan laba dari 300 menjadi 315." },
          ],
        },
        {
          q: "Apa beda budget, forecast, dan pro forma?",
          options: [
            { text: "Ketiganya sama — hanya nama berbeda", why: "Salah: ketiganya punya fungsi berbeda dan tertukar berarti salah pakai." },
            { text: "Budget untuk regulator, forecast untuk direksi, pro forma untuk publik", why: "Salah: pembedanya fungsi, bukan penerima." },
            { text: "Pro forma mengikat, budget tidak", why: "Salah: terbalik — budget yang mengikat, pro forma yang berskenario." },
            { text: "Budget mengikat sebagai target; forecast perkiraan berjalan; pro forma skenario seandainya", why: "Tepat: budget dinilai, forecast memberi tahu, pro forma menguji keputusan.", correct: true },
          ],
        },
        {
          q: "Kenapa asumsi ditulis sebelum hasil?",
          options: [
            { text: "Supaya pembaca bisa menilai apakah hasil itu layak dipercaya dari asumsinya", why: "Tepat: pro forma adalah konsekuensi logis asumsi — bila asumsi ditolak, hasilnya ikut ditolak.", correct: true },
            { text: "Formalitas — hasilnya yang penting", why: "Salah: tanpa asumsi, hasil tidak bisa dinilai; perdebatan sehat adalah perdebatan soal asumsi." },
            { text: "Supaya laporan lebih panjang", why: "Salah: panjang bukan tujuan — jejak alasan yang tujuan." },
            { text: "Karena regulator mewajibkan urutan itu", why: "Salah: ini praktik pelaporan yang baik, bukan aturan urutan regulator." },
          ],
        },
        {
          q: "Forecast diperlakukan sebagai budget. Apa risikonya?",
          options: [
            { text: "Tidak ada — keduanya perkiraan", why: "Salah: forecast tidak mengikat; memperlakukannya sebagai target menghukum manajer atas realisasi di luar kendali." },
            { text: "Manajer dihukum karena realisasi yang tidak mereka kendalikan", why: "Tepat: forecast berubah tiap data baru; budget adalah janji yang disepakati.", correct: true },
            { text: "Laporan menjadi lebih akurat", why: "Salah: akurasi tidak berubah — yang berubah adalah keadilan penilaiannya." },
            { text: "Direksi tidak perlu rapat lagi", why: "Salah: rapat tetap diperlukan — justru untuk membahas sensitivitas dan rencana cadangan." },
          ],
        },
      ],
    },
  ],
};
