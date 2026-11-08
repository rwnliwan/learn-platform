import type { V2Lesson } from "../lib/types";

export const rr38: V2Lesson = {
  slug: "rr38-pelaporan-cva",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR38 — Pelaporan CVA: Saat Counterparty Bisa Gagal Bayar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Derivatif yang untung, lalu rugi Rp55 miliar tanpa ada yang default",
      prose: [
        "Bank Artha Dana memegang swap dengan sebuah korporasi. Selama setahun, tidak ada yang default — tetapi nilai derivatifnya turun Rp55 miliar. Penyebabnya: credit spread counterparty melebar, probabilitas default naik, dan CVA (Credit Valuation Adjustment) naik. Bank merugi dari memburuknya kesehatan counterparty — padahal counterparty itu belum gagal bayar.",
        "Direksi bertanya: kenapa kerugian ini tidak terlihat di laporan sebelumnya? Jawabannya: laporan hanya menampilkan nilai derivatif, bukan komponennya. CVA tidak dilaporkan terpisah — ia tersembunyi di dalam nilai wajar, dan pergerakannya tidak pernah dijelaskan.",
        "Lesson ini mengajarkan pelaporan CVA: menghitung CVA, melaporkan pergerakannya, dan menjelaskan capital charge-nya. Setelah lesson ini kamu bisa: (1) menghitung CVA dari EE, PD, dan DF; (2) menjelaskan kenapa CVA bergerak tanpa default; (3) melaporkan atribusi perubahan CVA; (4) menjelaskan CVA capital charge Basel; (5) membedakan CVA, DVA, dan FVA di laporan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MR14 mengajarkan CVA sebagai rumus pricing (LGD dikali jumlah EE, PD, DF) di track Market Risk — sudut harga derivatif. Track RR sendiri 0 hit untuk CVA. Lesson ini membangun sudut pelaporan RR: atribusi pergerakan CVA, laporan desk CVA, dan capital charge — dengan rumus yang sama sebagai fondasi, bukan pengulangan.",
      },
      reference: "EE 10, 15, 8; PD 1, 1,5, 2 persen; DF 0,98, 0,95, 0,92; LGD 60 persen: CVA Rp0,28 miliar. EE naik 10 persen: CVA Rp0,30 miliar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, laporan derivatif-mu memisahkan CVA dari nilai wajar — dan menjelaskan pergerakannya baris demi baris.",
        "(1) Menghitung CVA dari expected exposure, PD marginal, dan faktor diskonto;",
        "(2) Menjelaskan pergerakan CVA: spread melebar, exposure berubah, atau waktu berlalu;",
        "(3) Menulis atribusi perubahan CVA untuk direksi;",
        "(4) Menjelaskan CVA capital charge dan kenapa Basel menagihnya;",
        "(5) Membedakan CVA, DVA, dan FVA — dan kenapa ketiganya tidak boleh dicampur.",
      ],
      tasks: [],
    },
    {
      id: "hitung-cva",
      eyebrow: "Langkah 3 · Teori",
      title: "Menghitung CVA: LGD dikali jumlah EE, PD, DF",
      prose: [
        "CVA sama dengan LGD dikali jumlah atas tiap periode dari EE dikali PD dikali DF. EE (Expected Exposure) adalah rata-rata nilai positif derivatif di periode itu; PD adalah probabilitas default marginal dari credit spread; DF adalah faktor diskonto. Contoh 3 periode (Rp miliar): EE 10, 15, 8; PD 1 persen, 1,5 persen, 2 persen; DF 0,98, 0,95, 0,92; LGD 60 persen.",
        "Hitung per periode: periode 1: 10 dikali 0,01 dikali 0,98 sama dengan 0,098. Periode 2: 15 dikali 0,015 dikali 0,95 sama dengan 0,21375. Periode 3: 8 dikali 0,02 dikali 0,92 sama dengan 0,1472. Jumlah: 0,45895. Dikali LGD 0,6 sama dengan 0,27537 — sekitar Rp0,28 miliar. Kecil? Bandingkan dengan margin tipis bisnis derivatif: CVA bisa menghapus seluruh P&L bisnis.",
        "Bila EE naik 10 persen di semua periode, CVA naik proporsional: 0,27537 dikali 1,1 sama dengan 0,3029 — sekitar Rp0,30 miliar. Sensitivitas ini yang dilaporkan: direksi perlu tahu CVA naik berapa bila pasar bergerak 10 persen — bukan hanya CVA hari ini.",
      ],
      tasks: [],
      note: {
        title: "CVA bergerak tanpa default",
        body: "CVA naik saat spread melebar (PD naik) atau pasar bergerak (EE naik) — tanpa ada yang default. Itulah yang terjadi di cerita pembuka: Rp55 miliar kerugian dari spread yang melebar. Laporan CVA yang baik menjelaskan pergerakan ini, bukan menunggu default untuk melapor.",
      },
      reference: "CVA Rp0,28 miliar (0,6 dikali 0,45895). EE naik 10 persen: CVA Rp0,30 miliar.",
    },
    {
      id: "atribusi-modal",
      eyebrow: "Langkah 4 · Teori",
      title: "Atribusi pergerakan dan capital charge",
      prose: [
        "Laporan CVA bulanan memuat atribusi: perubahan CVA dipecah menjadi tiga penyebab — perubahan exposure (pasar bergerak), perubahan spread (kesehatan counterparty), dan berlalunya waktu (periode yang sudah lewat keluar dari hitungan). Direksi yang membaca atribusi tahu apakah kerugian datang dari pasar, dari counterparty, atau dari waktu — dan tindakan untuk ketiganya berbeda.",
        "Basel mengenakan capital charge khusus untuk CVA risk: modal untuk risiko bahwa CVA itu sendiri bergerak merugikan. Alasannya persis cerita pembuka — bank bisa rugi besar dari CVA tanpa ada default. Laporan harus menampilkan CVA capital charge di samping CVA-nya: berapa modal yang ditahan untuk risiko ini, dan apakah ia naik seiring CVA.",
        "Keluarga XVA di laporan: CVA untuk kemungkinan counterparty default; DVA untuk kemungkinan bank sendiri default — ironisnya memburuknya bank sendiri 'menaikkan' nilai derivatif, dan Basel melarang memakainya untuk modal; FVA untuk biaya pendanaan collateral. Ketiganya dilaporkan terpisah — mencampurnya dalam satu angka berarti menyembunyikan tiga risiko berbeda.",
      ],
      tasks: [],
      reference: "Atribusi: exposure, spread, waktu. CVA capital charge: modal untuk risiko CVA bergerak. CVA, DVA, FVA dilaporkan terpisah.",
    },
    {
      id: "lab-cva",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: hitung CVA dan sensitivitasnya",
      prose: [
        "Lab ini menghitung CVA dari tiga periode EE, PD, dan DF, plus CVA bila EE naik 10 persen.",
        "Hitung dulu di kepala. Periode 1: 10 dikali 0,01 dikali 0,98 sama dengan 0,098. Periode 2: 15 dikali 0,015 dikali 0,95 sama dengan 0,21375. Periode 3: 8 dikali 0,02 dikali 0,92 sama dengan 0,1472. Jumlah 0,45895 dikali 0,6 sama dengan 0,27537 — dibulatkan 0,28. Naik 10 persen: 0,27537 dikali 1,1 sama dengan 0,3029 — dibulatkan 0,30.",
        "Tugas lab: tulis fungsi yang menerima daftar EE, PD, DF, dan LGD — lalu mencetak dua angka: cva dan cva_naik.",
        "Setelah lolos, coba eksperimen: naikkan PD periode 3 menjadi 4 persen dan lihat CVA naik — itulah kenapa spread counterparty dipantau harian.",
      ],
      tasks: [
        { id: "t1", text: "Hitung cva dari EE, PD, DF, LGD" },
        { id: "t2", text: "Hitung cva_naik bila EE naik 10 persen" },
      ],
      expected: "cva=0.28\ncva_naik=0.3",
      hints: [
        "CVA = LGD dikali jumlah EE dikali PD dikali DF per periode.",
        "Bulatkan ke 2 desimal.",
        "EE naik 10 persen berarti CVA dikali 1,1.",
      ],
      code: {
        starter: `# Swap Bank Artha Dana: 3 periode (Rp miliar).\nee = [10, 15, 8]\npd = [0.01, 0.015, 0.02]\ndf = [0.98, 0.95, 0.92]\nlgd = 0.6\n\n# TULIS KODEMU: hitung cva dan cva_naik (EE naik 10 persen).\n# Cetak, per baris: cva, cva_naik.\n\n\nmesin_cva(ee, pd, df, lgd)`,
        lockLines: 5,
        solution: `# Swap Bank Artha Dana: 3 periode (Rp miliar).\nee = [10, 15, 8]\npd = [0.01, 0.015, 0.02]\ndf = [0.98, 0.95, 0.92]\nlgd = 0.6\n\n\ndef mesin_cva(ee, pd, df, lgd):\n    total = 0\n    for e, p, d in zip(ee, pd, df):\n        total = total + e * p * d\n    cva = round(lgd * total, 2)\n    cva_naik = round(lgd * total * 1.1, 2)\n    print(f"cva={cva}")\n    print(f"cva_naik={cva_naik}")\n\n\nmesin_cva(ee, pd, df, lgd)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "cva=0.28", label: "CVA Rp0,28 miliar", msg: "0,6 x (0,098 + 0,21375 + 0,1472) = 0,6 x 0,45895 = 0,28 miliar." },
          { kind: "stdout_matches", task: "t2", pattern: "cva_naik=0.3", label: "CVA naik Rp0,30 miliar", msg: "0,27537 x 1,1 = 0,3029, dibulatkan 0,30 miliar." },
        ],
      },
      reference: "CVA 0,28; bila EE naik 10 persen: 0,30 (Rp miliar).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: kerugian Rp55 miliar yang akhirnya bisa dijelaskan",
      prose: [
        "Kembali ke Bank Artha Dana. Laporan CVA bulanan dibangun: CVA per counterparty, atribusi perubahan (exposure, spread, waktu), dan CVA capital charge. Saat spread counterparty melebar lagi kuartal berikut, direksi tidak bertanya 'kenapa rugi' — mereka membaca atribusi: Rp30 miliar dari spread, Rp15 miliar dari exposure, Rp10 miliar dari waktu. Tindakan diputuskan per penyebab: lindung nilai spread untuk yang pertama, pengurangan limit untuk yang kedua.",
        "Keputusan rapat: CVA dilaporkan terpisah dari nilai wajar di semua laporan derivatif, dengan atribusi bulanan dan capital charge. Tidak ada lagi kerugian yang 'tiba-tiba' — hanya pergerakan yang dijelaskan atau tidak.",
        "Tiga bulan kemudian, satu counterparty benar-benar default. Kerugiannya sudah dicadangkan lewat CVA — dan laporan menunjukkan cadangan itu cukup. Itulah fungsi CVA yang sebenarnya: bukan menghindari kerugian, melainkan membuatnya terlihat sebelum terjadi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat laporan CVA ini bekerja. Pertama, CVA terpisah dari nilai wajar — komponennya terlihat. Kedua, atribusi per penyebab — tindakan mengikuti penyebab. Ketiga, capital charge di samping CVA — modal untuk risiko pergerakan ikut terpantau.",
      },
      reference: "Atribusi Rp30 miliar spread, Rp15 miliar exposure, Rp10 miliar waktu. CVA dilaporkan terpisah dengan capital charge.",
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
        "Lab: CVA Rp0,28 miliar; EE naik 10 persen menjadi Rp0,30 miliar.",
        "CVA = LGD dikali jumlah EE dikali PD dikali DF.",
        "CVA bergerak tanpa default — spread melebar atau exposure berubah sudah cukup.",
        "Atribusi: exposure, spread, waktu — tindakan mengikuti penyebab.",
        "CVA, DVA, FVA dilaporkan terpisah; DVA tidak boleh dipakai untuk modal.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "EE 10, 15, 8; PD 1, 1,5, 2 persen; DF 0,98, 0,95, 0,92; LGD 60 persen. Berapa CVA?",
          options: [
            { text: "Rp0,46 miliar — LGD tidak dikali", why: "Salah: 0,45895 adalah jumlah sebelum LGD; CVA harus dikali 0,6." },
            { text: "Rp0,28 miliar", why: "Tepat: 0,6 x (0,098 + 0,21375 + 0,1472) = 0,6 x 0,45895 = 0,28 miliar.", correct: true },
            { text: "Rp0,17 miliar — LGD dipakai dua kali", why: "Salah: LGD hanya dikali sekali." },
            { text: "Rp0,76 miliar — EE dijumlah mentah", why: "Salah: EE harus dikali PD dan DF per periode dulu, bukan dijumlah mentah." },
          ],
        },
        {
          q: "Bank rugi Rp55 miliar dari derivatif tanpa ada counterparty yang default. Apa penjelasannya?",
          options: [
            { text: "Derivatifnya salah hitung dari awal", why: "Salah: tidak ada bukti salah hitung — pergerakan CVA menjelaskan kerugian ini." },
            { text: "Pasti ada default yang disembunyikan", why: "Salah: menuduh tanpa bukti; CVA naik tanpa default adalah mekanisme normal." },
            { text: "Spread counterparty melebar sehingga PD naik dan CVA naik — nilai derivatif turun", why: "Tepat: CVA bergerak mengikuti spread dan exposure, tanpa perlu ada default.", correct: true },
            { text: "Nilai wajar derivatif tidak pernah berubah", why: "Salah: nilai wajar berubah mengikuti pasar dan spread — itulah yang dilaporkan." },
          ],
        },
        {
          q: "EE naik 10 persen di semua periode. Berapa CVA baru?",
          options: [
            { text: "Rp0,28 miliar — tidak berubah", why: "Salah: CVA sebanding dengan EE; EE naik berarti CVA naik." },
            { text: "Rp0,38 miliar — naik 10 poin persen", why: "Salah: naik 10 persen berarti dikali 1,1, bukan ditambah 0,10." },
            { text: "Rp0,25 miliar — turun", why: "Salah: EE naik menaikkan CVA, bukan menurunkannya." },
            { text: "Rp0,30 miliar", why: "Tepat: 0,27537 x 1,1 = 0,3029, dibulatkan 0,30 miliar.", correct: true },
          ],
        },
        {
          q: "Kenapa Basel mengenakan capital charge khusus untuk CVA risk?",
          options: [
            { text: "Karena bank bisa rugi besar dari pergerakan CVA tanpa ada default", why: "Tepat: cerita pembuka membuktikannya — Rp55 miliar hilang tanpa default.", correct: true },
            { text: "Karena bank sering default", why: "Salah: charge ini untuk risiko CVA bergerak, bukan untuk default bank." },
            { text: "Karena CVA sulit dihitung", why: "Salah: kesulitan hitung bukan alasan modal — risiko kerugian yang alasan." },
            { text: "Karena DVA harus didanai", why: "Salah: DVA justru dilarang dipakai untuk modal." },
          ],
        },
        {
          q: "Kenapa CVA, DVA, dan FVA tidak boleh dicampur dalam satu angka?",
          options: [
            { text: "Karena ketiganya selalu sama nilainya", why: "Salah: ketiganya berbeda — mencampur berarti menyembunyikan tiga risiko berbeda." },
            { text: "Masing-masing menjawab pertanyaan berbeda: default counterparty, default bank sendiri, biaya pendanaan", why: "Tepat: satu angka campuran tidak bisa ditindaklanjuti per penyebab.", correct: true },
            { text: "Karena regulator melarang penjumlahan apa pun", why: "Salah: bukan larangan penjumlahan — melainkan keharusan transparansi per komponen." },
            { text: "Karena FVA tidak ada", why: "Salah: FVA ada — biaya pendanaan collateral adalah biaya nyata." },
          ],
        },
      ],
    },
  ],
};
