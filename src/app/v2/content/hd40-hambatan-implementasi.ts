import type { V2Lesson } from "../lib/types";

export const hd40: V2Lesson = {
  slug: "hd40-hambatan-implementasi",
  track: "Health Data Science",
  module: "Mutu Layanan Kesehatan",
  title: "HD40 — Hambatan Implementasi Informatika Klinis: dari Pilot ke Praktik",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pilot yang sempurna, go-live yang sepi",
      prose: [
        "Sebuah sistem pencatatan elektronik baru lolos pilot dengan gemilang di 3 klinik: kelengkapan data naik dari 62 persen menjadi 88 persen. Lalu go-live di 45 klinik: hanya 32 yang benar-benar jalan — 71,1 persen. Dari 1.800 pengguna yang dilatih, hanya 1.240 yang aktif memakai — 68,9 persen. Pilot yang sempurna menjadi implementasi yang sepi.",
        "Penyebabnya bukan teknologi — sistemnya sama. Penyebabnya adalah yang tidak diukur pilot: alur kerja klinik yang berbeda-beda, dokter yang harus mengklik 14 kali untuk satu resep, server yang lambat pada jam sibuk, dan perawat yang kembali ke kertas karena 'lebih cepat'. Pilot menguji sistem; go-live menguji ORGANISASI.",
        "Lesson ini mengajarkan hambatan implementasi informatika klinis: kerangka CFIR dan NASSS, jenis hambatan, dan strategi mengatasinya. Setelah lesson ini kamu bisa: (1) menjelaskan mengapa pilot yang berhasil bisa gagal saat skala; (2) memakai kerangka CFIR untuk memetakan hambatan; (3) menghitung metrik implementasi: go-live rate, adopsi, dan kelengkapan data; (4) membedakan hambatan teknologi, alur kerja, manusia, dan organisasi; (5) merancang rencana implementasi dengan pemilik dan tenggat.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson HD yang membahas hambatan implementasi informatika klinis — grep implementasi, hambatan, dan barrier di seluruh track menghasilkan nol. HD29 mengajarkan DHIS2 dan kualitas data, HD32 mengajarkan deployment real-time, tetapi jurang antara pilot dan praktik — mengapa sistem yang bekerja di 3 klinik mati di 45 klinik — belum pernah diajarkan. Lesson ini mengisi celah itu.",
      },
      reference: "Go-live 32 dari 45 (71,1 persen); adopsi 1.240 dari 1.800 (68,9 persen); kelengkapan 62 persen menjadi 88 persen (+26 poin).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mendiagnosis mengapa sistem klinis tidak dipakai — dan apa yang memperbaikinya.",
        "(1) Menjelaskan jurang pilot-ke-praktik: apa yang berubah saat skala;",
        "(2) Memakai kerangka CFIR: lima domain hambatan implementasi;",
        "(3) Menghitung go-live rate, adopsi pengguna, dan perubahan kelengkapan data;",
        "(4) Membedakan hambatan teknologi, alur kerja, manusia, organisasi, dan kebijakan;",
        "(5) Merancang rencana implementasi: pemilik, tenggat, dan metrik keberhasilan.",
      ],
      tasks: [],
    },
    {
      id: "jurang",
      eyebrow: "Langkah 3 · Teori",
      title: "Jurang pilot-ke-praktik: apa yang berubah saat skala",
      prose: [
        "Pilot berhasil karena kondisinya istimewa: 3 klinik yang dipilih karena paling siap, tim proyek yang mendampingi tiap hari, pengguna yang paling antusias, dan masalah yang diselesaikan dalam hitungan jam. Go-live menghadapi kondisi nyata: 45 klinik dengan kesiapan berbeda, tim proyek yang sudah pindah ke proyek lain, pengguna yang tidak memilih sistem ini, dan masalah yang antre berminggu-minggu.",
        "Empat hal yang berubah saat skala. Pertama, KERAGAMAN: alur kerja tiap klinik berbeda — resep di klinik A butuh 4 klik, di klinik B 14 klik karena formulir tambahan. Sistem yang dirancang untuk satu alur akan patah di alur lain. Kedua, DUKUNGAN: rasio pendukung terhadap pengguna jatuh dari 1:5 di pilot menjadi 1:200 di go-live. Ketiga, MOTIVASI: pengguna pilot adalah relawan; pengguna go-live adalah wajib — dan orang yang dipaksa memakai sistem akan mencari jalan pintas. Keempat, INFRASTRUKTUR: server yang lancar untuk 50 pengguna bisa tersendat untuk 1.800 pengguna pada jam sibuk.",
        "Kesalahan paling umum: mengukur keberhasilan pilot dengan metrik yang salah — 'sistem jalan' — bukan 'sistem dipakai dan memberi manfaat'. Pilot yang 'berhasil' tanpa mengukur adopsi dan kelengkapan data adalah pilot yang tidak menguji apa pun kecuali bahwa sistem bisa dinyalakan.",
      ],
      tasks: [],
      note: {
        title: "Pilotitis",
        body: "Pilotitis adalah penyakit organisasi: pilot demi pilot yang berhasil, tanpa satu pun yang menjadi praktik rutin. Obatnya bukan pilot yang lebih baik — melainkan keputusan skala yang diambil SEBELUM pilot dimulai: kriteria keberhasilan, anggaran skala, dan pemilik implementasi. Pilot tanpa rencana skala adalah demonstrasi, bukan implementasi.",
      },
      reference: "Pilot: 3 klinik siap, dukungan 1:5, pengguna relawan. Go-live: 45 klinik beragam, dukungan 1:200, pengguna wajib.",
    },
    {
      id: "cfir",
      eyebrow: "Langkah 4 · Teori",
      title: "CFIR: lima domain untuk memetakan hambatan",
      prose: [
        "CFIR (Consolidated Framework for Implementation Research) memetakan hambatan ke lima domain. Domain 1 — INTERVENSI: sistemnya sendiri — apakah ia lebih baik dari cara lama, seberapa kompleks, apakah bisa diuji coba dan disesuaikan. Sistem yang 14 klik untuk satu resep kalah dari kertas pada domain ini — berapa pun canggihnya.",
        "Domain 2 — KONTEKS LUAR: kebijakan, insentif, dan tekanan dari luar organisasi — regulasi yang mewajibkan pencatatan elektronik, pembiayaan yang menanggung atau tidak menanggung, dan standar interoperabilitas. Domain 3 — KONTEKS DALAM: organisasi itu sendiri — budaya, kepemimpinan, sumber daya, dan iklim implementasi. Klinik yang pimpinannya tidak memakai sistem tidak akan membuat stafnya memakai.",
        "Domain 4 — INDIVIDU: pengetahuan, keyakinan, dan kesiapan pengguna — dokter yang percaya sistem memperlambatnya akan memperlambat sistem itu (dengan menggunakannya setengah hati). Domain 5 — PROSES: perencanaan, keterlibatan, pelaksanaan, dan refleksi — apakah pengguna dilibatkan sejak desain, apakah ada champion di tiap klinik, apakah umpan balik ditindaklanjuti.",
        "NASSS adalah kerangka pelengkap untuk teknologi yang kompleks: ia menambah pertanyaan 'apakah teknologi ini akan bertahan dalam 5 tahun?' — dengan tujuh domain termasuk nilai, adopsi, dan adaptasi jangka panjang. Aturan praktis: CFIR untuk mendiagnosis 'mengapa macet sekarang', NASSS untuk menilai 'apakah ini akan hidup lama'.",
        "Contoh pemetaan kasus kita: 14 klik (domain intervensi — kompleksitas); server lambat jam sibuk (domain intervensi — kualitas teknis); perawat kembali ke kertas (domain individu — keyakinan bahwa kertas lebih cepat); pimpinan tidak memakai (domain konteks dalam — kepemimpinan); tidak ada champion di 13 klinik yang gagal go-live (domain proses — keterlibatan). Satu masalah, lima domain — dan tiap domain punya pemilik perbaikan yang berbeda.",
      ],
      tasks: [],
      note: {
        title: "Hambatan bukan alasan — ia adalah diagnosis",
        body: "Memetakan hambatan ke CFIR bukan untuk menyalahkan — melainkan untuk menetapkan pemilik. 'Server lambat' adalah tugas tim infrastruktur; 'dokter tidak percaya' adalah tugas tim perubahan; 'tidak ada champion' adalah tugas manajemen. Hambatan tanpa pemilik adalah keluhan; hambatan dengan pemilik dan tenggat adalah rencana.",
      },
      reference: "CFIR lima domain: intervensi, konteks luar, konteks dalam, individu, proses. NASSS menambah pertanyaan keberlanjutan.",
    },
    {
      id: "lab-implementasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung metrik implementasi",
      prose: [
        "Lab ini membangun kalkulator metrik implementasi: dari klinik yang direncanakan dan yang go-live, pengguna dilatih dan aktif, serta kelengkapan data sebelum dan sesudah — hitung go-live rate, adopsi, dan perubahan kelengkapan.",
        "Hitung dulu di kepala. Go-live rate: 32 dibagi 45 dikali 100 sama dengan 71,1 persen (tepatnya 71,1111 persen, dibulatkan satu desimal). Adopsi: 1.240 dibagi 1.800 dikali 100 sama dengan 68,9 persen (tepatnya 68,8889 persen). Perubahan kelengkapan: 88 dikurangi 62 sama dengan 26 poin persentase.",
        "Tugas lab: tulis fungsi yang menerima klinik rencana, klinik go-live, pengguna dilatih, pengguna aktif, kelengkapan sebelum, dan kelengkapan sesudah — lalu mencetak tiga angka: go_live_persen, adopsi_persen, kelengkapan_delta. Tiga angka ini adalah dashboard implementasi yang dibaca tiap bulan oleh tim proyek dan manajemen.",
        "Setelah lolos, coba eksperimen: naikkan klinik go-live menjadi 42 (93,3 persen) tetapi adopsi tetap 68,9 persen — lalu tanyakan: apakah implementasi itu berhasil bila klinik 'jalan' tetapi sepertiga pengguna tidak memakai?",
      ],
      tasks: [
        { id: "t1", text: "Hitung go-live rate dari klinik" },
        { id: "t2", text: "Hitung adopsi pengguna" },
        { id: "t3", text: "Hitung perubahan kelengkapan data dalam poin persentase" },
      ],
      expected: "go_live_persen=71.1\nadopsi_persen=68.9\nkelengkapan_delta=26",
      hints: [
        "Go-live persen = klinik go-live dibagi klinik rencana, dikali 100, dibulatkan 1 desimal.",
        "Adopsi persen = pengguna aktif dibagi pengguna dilatih, dikali 100, dibulatkan 1 desimal.",
        "Kelengkapan delta = sesudah dikurangi sebelum — dalam poin persentase, bukan persen.",
        "26 poin persentase berarti naik dari 62 menjadi 88 — bukan naik 26 persen.",
      ],
      code: {
        starter: `# Kalkulator metrik implementasi: go-live 45 klinik.\nklinik_rencana = 45\nklinik_golive = 32\npengguna_dilatih = 1800\npengguna_aktif = 1240\nlengkap_sebelum = 62  # persen\nlengkap_sesudah = 88  # persen\n\n# TULIS KODEMU: hitung tiga angka implementasi di bawah ini.\n# Cetak, per baris: go_live_persen, adopsi_persen,\n# kelengkapan_delta.\n\n\nkalkulator_implementasi(klinik_rencana, klinik_golive, pengguna_dilatih, pengguna_aktif, lengkap_sebelum, lengkap_sesudah)`,
        lockLines: 6,
        solution: `# Kalkulator metrik implementasi: go-live 45 klinik.\nklinik_rencana = 45\nklinik_golive = 32\npengguna_dilatih = 1800\npengguna_aktif = 1240\nlengkap_sebelum = 62  # persen\nlengkap_sesudah = 88  # persen\n\n\ndef kalkulator_implementasi(klinik_rencana, klinik_golive, pengguna_dilatih, pengguna_aktif, lengkap_sebelum, lengkap_sesudah):\n    go_live_persen = round(klinik_golive / klinik_rencana * 100, 1)\n    adopsi_persen = round(pengguna_aktif / pengguna_dilatih * 100, 1)\n    kelengkapan_delta = lengkap_sesudah - lengkap_sebelum\n    print(f"go_live_persen={go_live_persen}")\n    print(f"adopsi_persen={adopsi_persen}")\n    print(f"kelengkapan_delta={kelengkapan_delta}")\n\n\nkalkulator_implementasi(klinik_rencana, klinik_golive, pengguna_dilatih, pengguna_aktif, lengkap_sebelum, lengkap_sesudah)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "go_live_persen=71.1", label: "Go-live 71,1 persen", msg: "32 / 45 x 100 = 71,1111 persen, dibulatkan 71,1. 13 klinik belum jalan." },
          { kind: "stdout_matches", task: "t2", pattern: "adopsi_persen=68.9", label: "Adopsi 68,9 persen", msg: "1.240 / 1.800 x 100 = 68,8889 persen, dibulatkan 68,9. Sepertiga pengguna dilatih tidak aktif." },
          { kind: "stdout_matches", task: "t3", pattern: "kelengkapan_delta=26", label: "Kelengkapan +26 poin", msg: "88 - 62 = 26 poin persentase. Di klinik yang jalan, data memang lebih lengkap." },
        ],
      },
      reference: "Go-live 71,1 persen; adopsi 68,9 persen; kelengkapan +26 poin persentase.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 6 · Teori",
      title: "Strategi: dari diagnosis ke rencana",
      prose: [
        "Tiap domain CFIR punya strategi. INTERVENSI: sederhanakan alur — 14 klik menjadi 4; uji beban server sebelum go-live; sediakan mode offline untuk saat jaringan mati. KONTEKS DALAM: pimpinan memakai sistem dulu — kepemimpinan yang tidak memakai adalah pesan yang paling keras. INDIVIDU: pelatihan berbasis peran (dokter, perawat, apoteker punya alur berbeda) dan super-user di tiap klinik yang bisa ditanya tanpa antre ke helpdesk.",
        "PROSES: libatkan pengguna sejak desain — bukan saat pelatihan; tunjuk champion di tiap klinik SEBELUM go-live, bukan sesudahnya; dan tindaklanjuti umpan balik dalam 2 minggu — umpan balik yang tidak ditindaklanjuti adalah undangan untuk berhenti memberi umpan balik. KONTEKS LUAR: selaraskan dengan regulasi dan insentif — bila pencatatan elektronik adalah syarat akreditasi, sampaikan sebagai syarat, bukan sebagai beban tambahan.",
        "Rencana implementasi yang baik punya tiga hal: PEMILIK per hambatan (nama, bukan unit), TENGGAT (tanggal, bukan 'segera'), dan METRIK (angka, bukan 'lebih baik'). 'Server lambat — pemilik: tim infra — tenggat: 2 minggu — metrik: waktu respons di bawah 2 detik pada jam sibuk.' Tanpa ketiganya, strategi adalah harapan.",
        "Satu metrik yang sering dilupakan: WAKTU KEMBALI KE KERTAS. Bila perawat kembali ke kertas, itu bukan pembangkangan — ia adalah data bahwa sistem lebih lambat dari kertas untuk tugas itu. Ukur berapa persen tugas yang kembali ke kertas, dan perbaiki tugas itu dulu — bukan penggunanya.",
      ],
      tasks: [],
      note: {
        title: "Champion bukan relawan tanpa waktu",
        body: "Champion klinik yang ditunjuk tanpa pengurangan beban kerja adalah champion di atas kertas. Champion yang efektif diberi waktu khusus (misalnya 4 jam seminggu), akses langsung ke tim proyek, dan pengakuan resmi. Bila champion harus mengorbankan jam istirahatnya, ia akan berhenti — dan 13 klinik akan mengikuti.",
      },
      reference: "Strategi per domain: sederhanakan alur, pimpinan memakai dulu, pelatihan per peran, champion sebelum go-live, umpan balik 2 minggu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 13 klinik yang tertinggal",
      prose: [
        "Kembali ke 45 klinik. Tim memetakan 13 klinik yang gagal go-live ke CFIR: 5 klinik karena server lambat (intervensi), 4 karena tidak ada champion (proses), 3 karena pimpinan tidak memakai (konteks dalam), 1 karena alur resep 14 klik (intervensi). Tiap hambatan diberi pemilik dan tenggat 2 sampai 6 minggu.",
        "Enam minggu kemudian: 11 dari 13 klinik go-live — go-live rate naik dari 71,1 persen menjadi 95,6 persen (43 dari 45). Adopsi naik dari 68,9 persen menjadi 81,4 persen. Kelengkapan data di klinik yang baru go-live mencapai 84 persen dalam sebulan. Dua klinik yang tersisa butuh renovasi jaringan — masalah infrastruktur, bukan penolakan.",
        "Tiga hal yang membuat pemulihan ini berhasil. Pertama, diagnosis memakai kerangka — bukan tebakan. Kedua, tiap hambatan punya pemilik dan tenggat — bukan sekadar daftar. Ketiga, metrik dibaca tiap bulan — sehingga keberhasilan bisa dibuktikan dan kegagalan bisa dilokalisasi ke 2 klinik, bukan digeneralisasi ke 'implementasi gagal'.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Pelajaran umumnya: implementasi bukan peristiwa — ia adalah proses dengan metrik. Go-live 71,1 persen bukan vonis akhir; ia adalah titik berangkat diagnosis. Organisasi yang mengukur, memetakan, dan menindaklanjuti akan mencapai 95,6 persen. Organisasi yang hanya mengumumkan go-live akan tetap di 71,1 persen — dan menyalahkan pengguna.",
      },
      reference: "Sesudah pemulihan: go-live 95,6 persen (43/45); adopsi 81,4 persen; kelengkapan 84 persen di klinik baru.",
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
        "Jurang pilot-ke-praktik: keragaman, dukungan, motivasi, infrastruktur.",
        "CFIR lima domain: intervensi, konteks luar, konteks dalam, individu, proses.",
        "Lab: go-live 71,1 persen; adopsi 68,9 persen; kelengkapan +26 poin.",
        "Strategi: pemilik + tenggat + metrik per hambatan.",
        "Kembali ke kertas adalah data — bukan pembangkangan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Go-live: 32 dari 45 klinik; 1.240 dari 1.800 pengguna aktif; kelengkapan 62 persen menjadi 88 persen. Berapa go-live rate, adopsi, dan delta kelengkapan?",
          options: [
            { text: "71,1 persen; 68,9 persen; +26 poin", why: "Tepat: 32/45 = 71,1; 1.240/1.800 = 68,9; 88-62 = 26 poin persentase.", correct: true },
            { text: "71,1 persen; 68,9 persen; +41,9 persen", why: "Salah: 41,9 persen adalah kenaikan RELATIF (26/62) — delta yang dilaporkan adalah 26 POIN persentase. Keduanya benar, tetapi yang diminta adalah poin." },
            { text: "68,9 persen; 71,1 persen; +26 poin", why: "Salah: go-live dan adopsi tertukar — 32/45 adalah go-live (71,1), 1.240/1.800 adalah adopsi (68,9)." },
            { text: "71,1 persen; 31,1 persen; +26 poin", why: "Salah: 31,1 persen adalah proporsi yang TIDAK aktif (560/1.800) — adopsi adalah yang aktif, 68,9 persen." },
          ],
        },
        {
          q: "Pilot berhasil di 3 klinik tetapi go-live hanya 71,1 persen di 45 klinik. Apa penjelasan yang benar?",
          options: [
            { text: "Sistemnya rusak saat skala — teknologi pilot berbeda", why: "Salah: sistemnya sama. Yang berubah adalah keragaman, dukungan, motivasi, dan infrastruktur — bukan teknologinya." },
            { text: "Pilot menguji sistem; go-live menguji organisasi — keragaman alur, dukungan 1:200, pengguna wajib, dan beban infrastruktur", why: "Tepat: kondisi pilot istimewa; kondisi go-live nyata.", correct: true },
            { text: "Pengguna go-live lebih bodoh dari pengguna pilot", why: "Salah: menyalahkan pengguna adalah pengganti diagnosis. Hambatannya ada di sistem dan proses." },
            { text: "Pilot seharusnya memakai 45 klinik sejak awal", why: "Salah: pilot 3 klinik adalah desain yang benar — kesalahannya adalah tidak ada rencana skala, bukan ukuran pilot." },
          ],
        },
        {
          q: "Perawat kembali ke kertas karena 'lebih cepat'. Ke domain CFIR mana ini dipetakan, dan apa respons yang benar?",
          options: [
            { text: "Konteks luar — salahkan regulasi", why: "Salah: kembali ke kertas adalah soal alur kerja dan keyakinan pengguna, bukan regulasi." },
            { text: "Individu dan intervensi — ukur berapa persen tugas kembali ke kertas, perbaiki tugas itu; jangan salahkan perawat", why: "Tepat: kembali ke kertas adalah data bahwa sistem lebih lambat dari kertas untuk tugas itu.", correct: true },
            { text: "Proses — pecat perawat yang tidak patuh", why: "Salah: pemecatan adalah pengganti perbaikan. Sistem yang lebih lambat dari kertas akan selalu ditinggalkan." },
            { text: "Tidak masuk CFIR — ini masalah disiplin", why: "Salah: CFIR justru dirancang untuk memetakan hal seperti ini ke domain individu dan intervensi." },
          ],
        },
        {
          q: "Pimpinan klinik tidak memakai sistem baru. Apa dampaknya dan apa yang harus dilakukan?",
          options: [
            { text: "Tidak ada dampak — pimpinan tidak merawat pasien", why: "Salah: pimpinan yang tidak memakai mengirim pesan paling keras ke staf — domain konteks dalam." },
            { text: "Staf mengikuti pimpinan — strategi: pimpinan memakai dulu, dengan dukungan dan pelatihan yang sama", why: "Tepat: kepemimpinan adalah domain CFIR; perubahan perilaku dimulai dari atas.", correct: true },
            { text: "Paksa staf memakai meski pimpinan tidak", why: "Salah: paksaan tanpa teladan menghasilkan kepatuhan semu — dan jalan pintas." },
            { text: "Ganti pimpinan", why: "Salah: mengganti orang adalah jalan terakhir — mulailah dengan melibatkan pimpinan dan memahami keberatannya." },
          ],
        },
        {
          q: "Go-live naik menjadi 43 dari 45 (95,6 persen) setelah pemulihan. Dua klinik tersisa butuh renovasi jaringan. Apa vonis yang benar?",
          options: [
            { text: "Implementasi gagal — 100 persen adalah syarat", why: "Salah: 95,6 persen dengan 2 klinik yang tertunda karena infrastruktur yang diketahui adalah keberhasilan — bukan kegagalan." },
            { text: "Berhasil — 95,6 persen dengan alasan 2 klinik yang teridentifikasi dan berencana; metrik dilokalisasi, bukan digeneralisasi", why: "Tepat: keberhasilan diukur dengan metrik dan diagnosis, bukan dengan angka 100 persen.", correct: true },
            { text: "Berhasil — karena go-live di atas 90 persen selalu cukup", why: "Salah: tidak ada ambang universal — yang penting adalah alasan 2 klinik itu diketahui dan ditangani, bukan angkanya." },
            { text: "Tidak bisa dinilai — adopsi tidak dilaporkan", why: "Salah: adopsi dilaporkan — naik menjadi 81,4 persen. Vonis memakai metrik lengkap." },
          ],
        },
      ],
    },
  ],
};
