import type { V2Lesson } from "../lib/types";

export const biz30: V2Lesson = {
  slug: "biz30-requirements-gathering-bi",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI30 — Requirements Gathering BI: Bertanya Sebelum Membangun",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard Rp180 juta yang dibuka 3 kali",
      prose: [
        "PT SinarJaya membangun Executive 360: konsultan Rp180 juta, 6 bulan pengerjaan, 23 KPI, animasi 3D. Dalam 90 hari, dashboard itu dibuka tepat 3 kali — dua kali oleh pembuatnya, sekali oleh direksi yang salah klik. Dashboard itu tidak jelek; ia menjawab pertanyaan yang tidak dimiliki siapa pun.",
        "Akar masalahnya: tidak ada yang pernah bertanya ke calon pengguna keputusan apa yang akan mereka ambil dari dashboard itu. Tim membangun dari asumsi — dan asumsi itu salah di semua lini: KPI yang salah, grain yang salah, dan ritme yang salah.",
        "Lesson ini mengajarkan requirements gathering BI: wawancara keputusan, pemetaan pertanyaan, dan prioritisasi permintaan. Setelah lesson ini kamu bisa: (1) menjalankan wawancara keputusan 30 menit; (2) membedakan kebutuhan, keinginan, dan kebiasaan; (3) memetakan pertanyaan ke data dan grain; (4) memprioritaskan permintaan dengan rasio nilai per usaha; (5) menulis dokumen kebutuhan satu halaman yang ditandatangani pengguna.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BI1 memakai Executive 360 sebagai cerita pembuka tentang dashboard zombie dan memberi validasi satu kalimat (minta pengguna menuliskan satu keputusan). BI7 mengajarkan storytelling dari dashboard yang sudah ada. Tidak ada lesson yang mengajarkan cara mengumpulkan kebutuhan: wawancara keputusan, pemetaan pertanyaan ke data, dan prioritisasi. Lesson ini membangun proses itu.",
      },
      reference: "Executive 360: Rp180 juta, 23 KPI, 3 kali dibuka dalam 90 hari. Prioritisasi: nilai dibagi usaha — C 7,0; A 4,5; B dan D 2,0; E 1,0.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu tidak lagi membangun dashboard dari asumsi — melainkan dari keputusan yang sudah ditulis dan ditandatangani.",
        "(1) Menjalankan wawancara keputusan: apa keputusannya, kapan, dengan data apa;",
        "(2) Membedakan kebutuhan (tanpanya keputusan gagal) dari keinginan (bagus bila ada);",
        "(3) Memetakan tiap pertanyaan ke sumber data, grain, dan ritme refresh;",
        "(4) Memprioritaskan permintaan dengan rasio nilai per usaha;",
        "(5) Menulis dokumen kebutuhan satu halaman dan meminta tanda tangan pengguna.",
      ],
      tasks: [],
    },
    {
      id: "wawancara",
      eyebrow: "Langkah 3 · Teori",
      title: "Wawancara keputusan: tanya keputusannya, bukan chart-nya",
      prose: [
        "Pertanyaan pertama wawancara bukan 'chart apa yang kamu mau' — melainkan 'keputusan apa yang kamu ambil, kapan, dan apa yang terjadi bila datanya salah'. Pengguna yang ditanya chart akan meminta pie chart 3D; pengguna yang ditanya keputusan akan berkata 'saya memutuskan reorder tiap Senin pagi, dan bila stok salah 10 persen saya kehabisan di akhir pekan'. Jawaban kedua bisa dibangun; jawaban pertama hanya bisa dihias.",
        "Tiga pertanyaan lanjutan. Satu: data apa yang dibutuhkan dan dari mana — bila jawabannya 'dari kepala saya', kebutuhan itu belum bisa dibangun. Dua: seberapa segar — keputusan Senin pagi butuh data Minggu malam, bukan data bulan lalu. Tiga: apa yang terjadi bila angka ini salah — jawabannya menentukan seberapa ketat validasi dan governance-nya.",
        "Bedakan kebutuhan, keinginan, dan kebiasaan. Kebutuhan: tanpanya keputusan gagal — stok per gudang per hari. Keinginan: bagus bila ada — perbandingan dengan kompetitor. Kebiasaan: 'dulu selalu ada tabel ini' — tanyakan keputusan apa yang diambil dari tabel itu; bila tidak ada, tabel itu museum, bukan kebutuhan.",
      ],
      tasks: [],
      note: {
        title: "Wawancara 30 menit yang cukup",
        body: "Wawancara keputusan yang baik hanya butuh 30 menit: 5 menit konteks peran, 15 menit tiga keputusan terbesar, 10 menit data dan ritme. Bila 30 menit tidak cukup, masalahnya bukan waktu — melainkan pengguna belum tahu keputusannya sendiri, dan itu justru temuan terpenting wawancara.",
      },
      reference: "Tanya keputusan, bukan chart. Tiga lanjutan: data dari mana, seberapa segar, apa bila salah. Kebutuhan vs keinginan vs kebiasaan.",
    },
    {
      id: "prioritisasi",
      eyebrow: "Langkah 4 · Teori",
      title: "Prioritisasi: nilai dibagi usaha",
      prose: [
        "Lima permintaan masuk; tim hanya bisa membangun dua. Nilai (1 sampai 10) dibagi usaha (1 sampai 10) memberi rasio: permintaan C nilai 7 usaha 1 sama dengan 7,0; A nilai 9 usaha 2 sama dengan 4,5; B nilai 8 usaha 4 sama dengan 2,0; D nilai 6 usaha 3 sama dengan 2,0; E nilai 5 usaha 5 sama dengan 1,0. Urutan bangun: C dulu, lalu A — keduanya memberi nilai besar dengan usaha kecil.",
        "Rasio bukan vonis: permintaan B dan D sama-sama 2,0, tetapi B mungkin membuka jalan untuk tiga permintaan berikut — nilai strategis tidak tertangkap rasio. Diskusikan pengecualian secara eksplisit dan catat alasannya; prioritas yang diubah diam-diam adalah prioritas yang tidak ada.",
        "Hasil akhirnya satu halaman: tiap permintaan dengan keputusan yang dilayani, data dan grain, ritme refresh, pemilik, dan rasio prioritas. Halaman itu ditandatangani pengguna — bukan sebagai formalitas, melainkan sebagai bukti bahwa kebutuhan itu benar-benar milik mereka, bukan tebakan tim BI.",
      ],
      tasks: [],
      reference: "Rasio nilai per usaha: C 7,0; A 4,5; B 2,0; D 2,0; E 1,0. Bangun C lalu A. Dokumen satu halaman ditandatangani pengguna.",
    },
    {
      id: "lab-prioritas",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung rasio prioritas permintaan",
      prose: [
        "Lab ini menghitung rasio nilai per usaha untuk lima permintaan dashboard.",
        "Hitung dulu di kepala. C: 7 dibagi 1 sama dengan 7,0. A: 9 dibagi 2 sama dengan 4,5. B: 8 dibagi 4 sama dengan 2,0. D: 6 dibagi 3 sama dengan 2,0. E: 5 dibagi 5 sama dengan 1,0. Prioritas tertinggi: C dengan 7,0.",
        "Tugas lab: tulis fungsi yang menerima daftar nilai dan usaha, lalu mencetak tiga angka: rasio_C, rasio_A, dan prioritas tertinggi sebagai teks 'C'.",
        "Setelah lolos, coba eksperimen: naikkan usaha C menjadi 7 dan lihat rasionya jatuh menjadi 1,0 — permintaan yang sama bisa berubah dari prioritas pertama menjadi terakhir bila usahanya membengkak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rasio_C dari nilai 7 dan usaha 1" },
        { id: "t2", text: "Hitung rasio_A dari nilai 9 dan usaha 2" },
        { id: "t3", text: "Tentukan prioritas tertinggi dari lima rasio" },
      ],
      expected: "rasio_C=7.0\nrasio_A=4.5\nteratas=C",
      hints: [
        "Rasio = nilai dibagi usaha.",
        "Hitung kelima rasio, lalu bandingkan.",
        "Cetak teratas sebagai huruf C.",
      ],
      code: {
        starter: `# Lima permintaan dashboard: nilai dan usaha (1-10).\n# Urutan: A, B, C, D, E.\nnilai = [9, 8, 7, 6, 5]\nusaha = [2, 4, 1, 3, 5]\nnama = ["A", "B", "C", "D", "E"]\n\n# TULIS KODEMU: hitung rasio_C, rasio_A, teratas.\n# Cetak, per baris: rasio_C, rasio_A, teratas.\n\n\nmesin_prioritas(nilai, usaha, nama)`,
        lockLines: 4,
        solution: `# Lima permintaan dashboard: nilai dan usaha (1-10).\n# Urutan: A, B, C, D, E.\nnilai = [9, 8, 7, 6, 5]\nusaha = [2, 4, 1, 3, 5]\nnama = ["A", "B", "C", "D", "E"]\n\n\ndef mesin_prioritas(nilai, usaha, nama):\n    rasio = []\n    for n, u in zip(nilai, usaha):\n        rasio.append(n / u)\n    rasio_C = rasio[2]\n    rasio_A = rasio[0]\n    terbaik = 0\n    for i in range(1, len(rasio)):\n        if rasio[i] > rasio[terbaik]:\n            terbaik = i\n    print(f"rasio_C={rasio_C}")\n    print(f"rasio_A={rasio_A}")\n    print(f"teratas={nama[terbaik]}")\n\n\nmesin_prioritas(nilai, usaha, nama)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "rasio_C=7.0", label: "Rasio C 7,0", msg: "7 / 1 = 7,0. Nilai besar, usaha kecil — bangun pertama." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio_A=4.5", label: "Rasio A 4,5", msg: "9 / 2 = 4,5. Nilai terbesar, tetapi usahanya juga besar." },
          { kind: "stdout_matches", task: "t3", pattern: "teratas=C", label: "Prioritas tertinggi: C", msg: "C 7,0 mengalahkan A 4,5. Bangun C dulu, lalu A." },
        ],
      },
      reference: "Rasio C 7,0; A 4,5; teratas C.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: Executive 360 yang seharusnya tidak dibangun",
      prose: [
        "Kembali ke SinarJaya. Seandainya wawancara keputusan dilakukan dulu, hasilnya akan ketahuan dalam 30 menit: direksi tidak punya keputusan yang butuh 23 KPI. Keputusan mereka hanya dua — tambah cabang atau tidak, dan reorder pemasok kapan — dan keduanya butuh 4 angka, bukan 23.",
        "Dashboard penggantinya dibangun dalam 3 minggu dengan 4 KPI: revenue per cabang, margin per kategori, stok per gudang, dan tren mingguan. Dalam 90 hari, dashboard itu dibuka 412 kali — oleh orang yang benar-benar mengambil keputusan dari angkanya.",
        "Keputusan rapat: tidak ada dashboard baru tanpa dokumen kebutuhan satu halaman yang ditandatangani pengguna. Biaya wawancara 30 menit melawan biaya Rp180 juta untuk museum digital — aritmetikanya tidak perlu diperdebatkan.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat penggantinya berhasil. Pertama, keputusan ditulis dulu — 2 keputusan, 4 angka. Kedua, prioritas dihitung — rasio nilai per usaha, bukan suara terbanyak. Ketiga, tanda tangan pengguna — kebutuhan itu milik mereka, bukan tebakan tim.",
      },
      reference: "Pengganti Executive 360: 4 KPI, 3 minggu, dibuka 412 kali dalam 90 hari.",
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
        "Lab: rasio C 7,0; A 4,5; teratas C.",
        "Tanya keputusan, bukan chart — chart adalah jawaban atas pertanyaan yang salah.",
        "Kebutuhan vs keinginan vs kebiasaan: hanya kebutuhan yang tanpanya keputusan gagal.",
        "Prioritas: nilai dibagi usaha; pengecualian strategis dicatat eksplisit.",
        "Dokumen satu halaman ditandatangani pengguna sebelum membangun.",
      ],
      next: { label: "BI31 — Data Mart: Warehouse Kecil untuk Satu Tim", href: "/v2/learn/biz31-data-mart" },
      quiz: [
        {
          q: "Permintaan C nilai 7 usaha 1; A nilai 9 usaha 2. Berapa rasio masing-masing dan mana yang dibangun dulu?",
          options: [
            { text: "C 7,0; A 4,5; bangun A dulu karena nilainya 9", why: "Salah: nilai mentah mengabaikan usaha — A butuh usaha 2x lipat C." },
            { text: "C 7,0; A 4,5; bangun C dulu", why: "Tepat: 7 / 1 = 7,0; 9 / 2 = 4,5. C memberi nilai lebih besar per usaha.", correct: true },
            { text: "C 1,0; A 4,5; bangun A dulu", why: "Salah: rasio C adalah 7 / 1 = 7,0, bukan 1,0." },
            { text: "Keduanya 7,0 — sama prioritas", why: "Salah: 9 / 2 = 4,5, bukan 7,0." },
          ],
        },
        {
          q: "Apa pertanyaan pertama wawancara requirements gathering yang benar?",
          options: [
            { text: "Chart apa yang kamu mau?", why: "Salah: pengguna yang ditanya chart akan meminta hiasan, bukan alat keputusan." },
            { text: "Warna dashboard apa yang kamu suka?", why: "Salah: warna adalah detail tampilan terakhir, bukan kebutuhan." },
            { text: "Keputusan apa yang kamu ambil, kapan, dan apa bila datanya salah?", why: "Tepat: keputusan adalah kebutuhan yang bisa dibangun; chart adalah preferensi tampilan.", correct: true },
            { text: "Berapa budget dashboard ini?", why: "Salah: budget adalah kendala proyek, bukan kebutuhan pengguna." },
          ],
        },
        {
          q: "Pengguna meminta tabel yang 'dulu selalu ada'. Apa yang harus dilakukan?",
          options: [
            { text: "Bangun tabel itu — kebiasaan adalah kebutuhan", why: "Salah: kebiasaan belum tentu kebutuhan; tanyakan keputusan apa yang diambil dari tabel itu." },
            { text: "Tolak langsung tanpa bertanya", why: "Salah: menolak tanpa bertanya kehilangan kemungkinan tabel itu memang melayani keputusan." },
            { text: "Bangun tabel itu plus 5 tabel lain sebagai bonus", why: "Salah: menambah cakupan tanpa kebutuhan adalah cara tercepat menjadi Executive 360 berikutnya." },
            { text: "Tanyakan keputusan apa yang diambil dari tabel itu; bila tidak ada, itu museum", why: "Tepat: tanpa keputusan, tabel itu hanya kebiasaan yang menumpuk.", correct: true },
          ],
        },
        {
          q: "Permintaan B dan D sama-sama rasio 2,0, tetapi B membuka jalan untuk tiga permintaan berikut. Apa yang benar?",
          options: [
            { text: "Diskusikan pengecualian strategis secara eksplisit dan catat alasannya", why: "Tepat: rasio bukan vonis; nilai strategis yang tidak tertangkap rasio harus diputuskan dan dicatat terbuka.", correct: true },
            { text: "Bangun D dulu — alfabet lebih dahulu", why: "Salah: alfabet bukan kriteria prioritas." },
            { text: "Abaikan rasio dan bangun yang paling mudah", why: "Salah: mengabaikan rasio berarti kembali ke keputusan tanpa ukuran." },
            { text: "Bangun keduanya sekaligus", why: "Salah: kapasitas tim terbatas — itulah gunanya prioritas." },
          ],
        },
        {
          q: "Kenapa dokumen kebutuhan harus ditandatangani pengguna?",
          options: [
            { text: "Formalitas birokrasi semata", why: "Salah: tanda tangan adalah bukti kebutuhan itu milik pengguna, bukan tebakan tim." },
            { text: "Sebagai bukti kebutuhan itu benar-benar milik pengguna dan disepakati", why: "Tepat: tanpa tanda tangan, kebutuhan bisa disangkal saat hasil tidak sesuai harapan.", correct: true },
            { text: "Supaya tim BI tidak bisa disalahkan bila gagal", why: "Salah: tujuannya kesepakatan, bukan pelimpahan salah." },
            { text: "Supaya konsultan bisa menagih lebih mahal", why: "Salah: tidak ada hubungannya dengan penagihan." },
          ],
        },
      ],
    },
  ],
};
