import type { V2Lesson } from "../lib/types";

export const rr36: V2Lesson = {
  slug: "rr36-kontrol-internal-audit-risk",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR36 — Pelaporan Kontrol Internal dan Audit Risk: Siapa Mengawasi Pengawas",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kontrol yang ada di kertas, tetapi tidak di lapangan",
      prose: [
        "Audit internal Bank Artha Dana menemukan kontrol rekonsiliasi harian tercatat 'berjalan' di dokumen — tetapi di lapangan, rekonsiliasi itu sudah 3 bulan tidak dikerjakan karena analisnya pindah divisi. Laporan kontrol internal ke direksi selama 3 bulan itu menyatakan semua hijau. Kontrolnya ada di kertas; di lapangan tidak ada.",
        "Di kasus kedua, pengujian kontrol mengambil 60 sampel transaksi dan menemukan 3 exception — deviasi 5,0 persen, di atas toleransi 4 persen. Kontrol itu dinyatakan gagal — bukan karena 3 exception itu besar, melainkan karena tingkat deviasinya melampaui ambang yang disepakati.",
        "Lesson ini mengajarkan pelaporan kontrol internal dan audit risk: desain kontrol, pengujian, dan pelaporan temuan. Setelah lesson ini kamu bisa: (1) menjelaskan tiga lini pertahanan; (2) menghitung deviasi pengujian kontrol; (3) menilai efektivitas kontrol dan risiko residual; (4) menulis laporan temuan audit; (5) membedakan defisiensi, kelemahan signifikan, dan kelemahan material.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "RR25 menyinggung internal control review sebagai satu dari enam komponen ICAAP, dan RR19 adalah misi audit impostor — tetapi tidak ada lesson tentang pelaporan kontrol internal dan audit risk: desain kontrol, pengujian sampel, deviasi, dan klasifikasi temuan. Lesson ini membangun topik itu.",
      },
      reference: "Pengujian 60 sampel, 3 exception: deviasi 5,0 persen, di atas toleransi 4 persen — kontrol gagal. Risiko residual: 4 dikali (1 dikurangi 0,7) sama dengan 1,2.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis laporan kontrol internal yang jujur — membedakan kontrol yang berjalan dari kontrol yang hanya tercatat.",
        "(1) Menjelaskan tiga lini pertahanan: operasional, manajemen risiko, audit internal;",
        "(2) Menghitung deviasi pengujian kontrol dan membandingkannya dengan toleransi;",
        "(3) Menghitung risiko residual dari risiko inheren dan efektivitas kontrol;",
        "(4) Mengklasifikasikan temuan: defisiensi, kelemahan signifikan, kelemahan material;",
        "(5) Menulis laporan temuan dengan bukti, dampak, dan rekomendasi.",
      ],
      tasks: [],
    },
    {
      id: "tiga-lini",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga lini pertahanan dan pengujian kontrol",
      prose: [
        "Lini pertama adalah operasional: pemilik proses yang menjalankan kontrol tiap hari — analis yang merekonsiliasi, kasir yang memverifikasi. Lini kedua adalah manajemen risiko dan kepatuhan: yang merancang kerangka kontrol, memantau, dan menantang lini pertama. Lini ketiga adalah audit internal: yang independen, menguji apakah kontrol benar-benar berjalan, dan melapor langsung ke komite audit — bukan ke manajemen yang diauditnya.",
        "Pengujian kontrol mengambil sampel dan menghitung deviasi: 3 exception dari 60 sampel sama dengan 5,0 persen. Toleransi yang disepakati 4 persen. Karena 5,0 di atas 4, kontrol dinyatakan gagal — terlepas dari apakah 3 exception itu merugikan secara finansial. Toleransi adalah janji: melampauinya berarti kontrol tidak bisa diandalkan, dan laporan yang mengandalkannya ikut tidak bisa diandalkan.",
        "Sampel yang kecil menipu: 3 dari 60 adalah 5,0 persen, tetapi interval kepercayaannya lebar. Itu sebabnya ukuran sampel ditentukan dari toleransi dan keyakinan yang diinginkan — bukan dari '60 terasa cukup'. Dan pengujian tidak berhenti di angka: tiap exception ditelusuri akarnya — apakah kesalahan acak, kelemahan desain, atau kontrol yang memang tidak dijalankan.",
      ],
      tasks: [],
      note: {
        title: "Kontrol yang tidak dijalankan sama dengan tidak ada kontrol",
        body: "Rekonsiliasi yang tercatat tetapi tidak dikerjakan selama 3 bulan adalah temuan yang lebih berat dari 3 exception — ia berarti monitoring lini kedua juga gagal. Laporan kontrol harus membedakan 'kontrol gagal saat diuji' dari 'kontrol tidak pernah dijalankan': yang kedua menandakan kegagalan tata kelola, bukan sekadar eksekusi.",
      },
      reference: "3 dari 60: deviasi 5,0 persen vs toleransi 4 persen — kontrol gagal. Tiga lini: operasional, manajemen risiko, audit internal.",
    },
    {
      id: "risiko-residual",
      eyebrow: "Langkah 4 · Teori",
      title: "Risiko residual dan klasifikasi temuan",
      prose: [
        "Risiko residual adalah risiko yang tersisa setelah kontrol: risiko inheren dikali satu dikurangi efektivitas kontrol. Risiko inheren 4 (skala 1 sampai 5) dengan kontrol yang 70 persen efektif: 4 dikali 0,3 sama dengan 1,2. Angka itu yang dilaporkan ke direksi — bukan risiko inherennya saja, dan bukan pula klaim 'sudah ada kontrol' tanpa efektivitas.",
        "Temuan diklasifikasikan tiga tingkat. Defisiensi: kontrol lemah tetapi dampak terbatas — diperbaiki dalam 90 hari oleh pemilik proses. Kelemahan signifikan: cukup penting untuk dilaporkan ke komite audit — diperbaiki dalam 30 hari dengan rencana tertulis. Kelemahan material: ada kemungkinan wajar salah saji material di laporan keuangan — dilaporkan ke direksi dan regulator, dengan rencana perbaikan yang dipantau komite.",
        "Laporan temuan yang baik berisi lima hal: apa yang ditemukan (bukti), kenapa itu penting (dampak), apa akarnya, apa rekomendasinya, dan siapa pemilik perbaikannya dengan tenggat. Temuan tanpa pemilik dan tenggat adalah catatan yang akan dibaca lagi tahun depan — sebagai temuan berulang.",
      ],
      tasks: [],
      reference: "Risiko residual 1,2 (inheren 4, efektivitas 70 persen). Defisiensi 90 hari; signifikan 30 hari; material ke direksi dan regulator.",
    },
    {
      id: "lab-kontrol",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung deviasi kontrol dan risiko residual",
      prose: [
        "Lab ini menghitung dua angka audit: deviasi pengujian kontrol dan risiko residual.",
        "Hitung dulu di kepala. Deviasi: 3 dibagi 60 dikali 100 sama dengan 5,0 persen. Risiko residual: 4 dikali (1 dikurangi 0,7) sama dengan 4 dikali 0,3 sama dengan 1,2.",
        "Tugas lab: tulis fungsi yang menerima jumlah sampel, exception, risiko inheren, dan efektivitas kontrol — lalu mencetak dua angka: deviasi_persen dan risiko_residual.",
        "Setelah lolos, coba eksperimen: naikkan efektivitas menjadi 0,9 dan lihat risiko residual turun menjadi 0,4 — kontrol yang lebih efektif adalah modal yang lebih murah daripada menanggung risiko.",
      ],
      tasks: [
        { id: "t1", text: "Hitung deviasi_persen dari sampel dan exception" },
        { id: "t2", text: "Hitung risiko_residual" },
      ],
      expected: "deviasi_persen=5.0\nrisiko_residual=1.2",
      hints: [
        "Deviasi persen = exception dibagi sampel, dikali 100.",
        "Risiko residual = inheren dikali (1 dikurangi efektivitas).",
      ],
      code: {
        starter: `# Pengujian kontrol rekonsiliasi Bank Artha Dana.\nsampel = 60\nexception = 3\nrisiko_inheren = 4\nefektivitas = 0.7\n\n# TULIS KODEMU: hitung deviasi_persen dan risiko_residual.\n# Cetak, per baris: deviasi_persen, risiko_residual.\n\n\nmesin_kontrol(sampel, exception, risiko_inheren, efektivitas)`,
        lockLines: 5,
        solution: `# Pengujian kontrol rekonsiliasi Bank Artha Dana.\nsampel = 60\nexception = 3\nrisiko_inheren = 4\nefektivitas = 0.7\n\n\ndef mesin_kontrol(sampel, exception, risiko_inheren, efektivitas):\n    deviasi_persen = exception / sampel * 100\n    risiko_residual = risiko_inheren * (1 - efektivitas)\n    print(f"deviasi_persen={deviasi_persen}")\n    print(f"risiko_residual={risiko_residual}")\n\n\nmesin_kontrol(sampel, exception, risiko_inheren, efektivitas)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "deviasi_persen=5.0", label: "Deviasi 5,0 persen", msg: "3 / 60 x 100 = 5,0 persen. Di atas toleransi 4 persen — kontrol gagal." },
          { kind: "stdout_matches", task: "t2", pattern: "risiko_residual=1.2", label: "Risiko residual 1,2", msg: "4 x (1 - 0,7) = 4 x 0,3 = 1,2." },
        ],
      },
      reference: "Deviasi 5,0 persen; risiko residual 1,2.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: laporan hijau yang ternyata merah",
      prose: [
        "Kembali ke Bank Artha Dana. Audit menemukan rekonsiliasi tidak dikerjakan 3 bulan — temuan kelemahan signifikan, bukan sekadar defisiensi, karena monitoring lini kedua juga gagal mendeteksinya. Laporan kontrol internal triwulan itu direvisi: dari semua hijau menjadi satu merah dengan rencana perbaikan 30 hari dan pemilik bernama.",
        "Perbaikan permanennya: rekonsiliasi otomatis dengan alert bila tidak jalan 2 hari; daftar kontrol dipetakan ke pemilik yang masih aktif (bukan yang sudah pindah divisi); dan audit internal menguji keberadaan bukti kerja — bukan keberadaan dokumen prosedur.",
        "Keputusan rapat: laporan kontrol internal kini memuat dua kolom — 'tercatat' dan 'terbukti berjalan'. Kolom kedua diisi dari bukti, bukan dari klaim.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat perbaikan ini bertahan. Pertama, klasifikasi temuan yang tepat — kelemahan signifikan, bukan defisiensi yang bisa menunggu. Kedua, bukti kerja sebagai syarat — dokumen prosedur saja tidak cukup. Ketiga, dua kolom di laporan — tercatat vs terbukti berjalan — membuat kesenjangan terlihat tiap triwulan.",
      },
      reference: "Temuan kelemahan signifikan, perbaikan 30 hari. Laporan kini dua kolom: tercatat vs terbukti berjalan.",
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
        "Lab: deviasi 5,0 persen (di atas toleransi 4 persen — kontrol gagal); risiko residual 1,2.",
        "Tiga lini: operasional, manajemen risiko, audit internal yang independen.",
        "Kontrol yang tidak dijalankan sama dengan tidak ada kontrol — dan lebih berat dari exception.",
        "Temuan: defisiensi 90 hari, signifikan 30 hari, material ke direksi dan regulator.",
        "Laporan temuan: bukti, dampak, akar, rekomendasi, pemilik dan tenggat.",
      ],
      next: { label: "RR37 — Economic Capital dan RAROC: Modal yang Benar-Benar Dibutuhkan", href: "/v2/learn/rr37-economic-capital-raroc" },
      quiz: [
        {
          q: "60 sampel, 3 exception, toleransi 4 persen. Berapa deviasi dan vonisnya?",
          options: [
            { text: "Deviasi 5,0 persen — kontrol lolos karena exception hanya 3", why: "Salah: vonis memakai persen terhadap toleransi, bukan jumlah absolut exception." },
            { text: "Deviasi 0,5 persen — salah menaruh koma", why: "Salah: 3 / 60 = 0,05 = 5,0 persen, bukan 0,5 persen." },
            { text: "Deviasi 20,0 persen — sampel dibagi exception", why: "Salah: deviasi adalah exception dibagi sampel, bukan sebaliknya." },
            { text: "Deviasi 5,0 persen — kontrol gagal", why: "Tepat: 3 / 60 = 5,0 persen, di atas toleransi 4 persen.", correct: true },
          ],
        },
        {
          q: "Risiko inheren 4, efektivitas kontrol 70 persen. Berapa risiko residual?",
          options: [
            { text: "1,2", why: "Tepat: 4 x (1 - 0,7) = 4 x 0,3 = 1,2.", correct: true },
            { text: "2,8 — itu risiko yang dikendalikan", why: "Salah: 2,8 adalah bagian yang dikendalikan (4 x 0,7); residual adalah sisanya." },
            { text: "4,0 — kontrol tidak mengubah risiko", why: "Salah: kontrol 70 persen efektif mengurangi risiko menjadi 1,2." },
            { text: "0,7 — sama dengan efektivitas", why: "Salah: efektivitas adalah pengali, bukan hasil." },
          ],
        },
        {
          q: "Kontrol tercatat di dokumen tetapi tidak dikerjakan 3 bulan. Apa vonis yang tepat?",
          options: [
            { text: "Defisiensi kecil — dokumennya ada", why: "Salah: dokumen tanpa eksekusi adalah kegagalan tata kelola — monitoring lini kedua juga gagal." },
            { text: "Kelemahan signifikan — kontrol tidak berjalan dan monitoring gagal mendeteksi", why: "Tepat: tidak berjalannya kontrol plus gagalnya deteksi adalah temuan signifikan.", correct: true },
            { text: "Bukan temuan — kontrol akan dikerjakan bulan depan", why: "Salah: janji mengerjakan bukan bukti berjalan; 3 bulan tanpa eksekusi adalah temuan." },
            { text: "Kelemahan material — otomatis", why: "Salah: material butuh kemungkinan wajar salah saji material di laporan keuangan — tidak otomatis dari tidak berjalannya satu kontrol." },
          ],
        },
        {
          q: "Kenapa audit internal melapor ke komite audit, bukan ke manajemen yang diaudit?",
          options: [
            { text: "Supaya laporannya lebih tebal", why: "Salah: ketebalan bukan alasan — independensi yang alasan." },
            { text: "Karena komite audit yang membayar gaji auditor", why: "Salah: pembayaran bukan soal jalur pelaporan — independensi fungsional yang soal." },
            { text: "Independensi: manajemen tidak boleh menilai dirinya sendiri", why: "Tepat: lini ketiga harus bebas dari yang diauditnya — itulah yang membuat temuannya dipercaya.", correct: true },
            { text: "Supaya manajemen tidak tahu temuannya", why: "Salah: manajemen tetap menerima temuan dan rencana perbaikan — hanya saja tidak mengendalikan auditnya." },
          ],
        },
        {
          q: "Temuan tanpa pemilik dan tenggat akan menjadi apa tahun depan?",
          options: [
            { text: "Hilang sendiri", why: "Salah: temuan tidak hilang tanpa perbaikan." },
            { text: "Naik tingkat otomatis menjadi kelemahan material", why: "Salah: klasifikasi tidak naik otomatis — tetapi temuan berulang memperberat penilaian." },
            { text: "Ditutup oleh auditor berikutnya", why: "Salah: auditor tidak menutup temuan tanpa bukti perbaikan." },
            { text: "Temuan berulang — dibaca lagi sebagai temuan yang sama", why: "Tepat: tanpa pemilik dan tenggat, tidak ada yang mengerjakannya.", correct: true },
          ],
        },
      ],
    },
  ],
};
