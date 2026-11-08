import type { V2Lesson } from "../lib/types";

export const cr45: V2Lesson = {
  slug: "cr45-cva-kredit",
  track: "Credit Risk",
  module: "Derivatif Kredit & Counterparty",
  title: "CR45 — CVA dari Sisi Kredit: Harga, Modal, dan Wrong-Way Risk",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Derivatif yang 'untung' Rp10 miliar — sampai lawan transaksinya gagal",
      prose: [
        "Bank Nusantara punya swap suku bunga dengan perusahaan tambang — nilai mark-to-market positif Rp10 miliar bagi bank (perusahaan berutang Rp10 miliar ke bank bila swap ditutup hari ini). Lalu harga batubara jatuh 40 persen. Perusahaan tambang itu — yang pendapatannya bergantung pada batubara — gagal bayar. Bank tidak hanya kehilangan pinjaman Rp500 miliar ke perusahaan itu; ia juga kehilangan Rp10 miliar dari swap — karena lawan transaksi yang gagal tidak membayar nilai swap-nya. Kerugian totalnya bukan Rp500 miliar atau Rp10 miliar — melainkan keduanya, dan keduanya disebabkan oleh SATU peristiwa yang sama.",
        "Inilah CVA (credit valuation adjustment): koreksi terhadap nilai wajar derivatif sebesar potensi kerugian bila lawan transaksi gagal sebelum derivatif jatuh tempo. Nilai wajar swap 'murni' Rp10 miliar (= Rp10.000 juta); nilai wajar SETELAH CVA = 10.000 juta dikurangi CVA. Bila CVA-nya Rp0,35772 juta (seperti contoh lab), nilai wajarnya Rp9.999,64 juta. Bank yang mencatat derivatif tanpa CVA sedang mencatat aset yang lebih besar dari yang bisa ditagihnya.",
        "Lesson ini mengambil sudut kredit yang belum ada: MR14 membahas counterparty risk dan MR29 membahas XVA dari sisi market risk — tetapi tidak ada lesson CVA dari sisi kredit: pricing pinjaman yang dibundel derivatif, modal CVA Basel, dan wrong-way risk pada debitur korporat. CR32 hanya menyebut CVA dalam satu kalimat (penilaian risiko counterparty pada CDS). Setelah lesson ini kamu bisa: (1) menghitung CVA dari exposure, PD, dan LGD; (2) menjelaskan expected exposure dan wrong-way risk; (3) membedakan CVA, DVA, dan FVA; (4) menjelaskan modal CVA Basel; (5) memakai CVA dalam pricing kredit.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "MR14 (Counterparty Risk) dan MR29 (XVA) membahas CVA dari sisi market risk — termasuk definisi, komponen XVA, dan hedging. CR32 menyebut CVA dalam satu kalimat tentang counterparty risk pada CDS. Tidak ada lesson dari sisi kredit: CVA dalam pricing fasilitas korporat yang dibundel derivatif, modal CVA Basel (standar dan dasar), wrong-way risk pada debitur yang eksposurnya naik saat ia melemah, dan hubungan CVA dengan ECL (CR14). Lesson ini membangun sudut kredit itu.",
      },
      reference: "EE 3 tahun [40, 30, 20], PD marginal [0,8 persen; 0,7 persen; 0,6 persen], DF [0,95; 0,90; 0,86], LGD 60 persen → CVA Rp0,35772 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa memberi harga pada risiko bahwa lawan transaksimu gagal — sebelum ia gagal.",
        "(1) Menghitung CVA dari expected exposure, PD marginal, LGD, dan faktor diskonto;",
        "(2) Menjelaskan expected exposure dan wrong-way risk;",
        "(3) Membedakan CVA, DVA, dan FVA;",
        "(4) Menjelaskan modal CVA Basel (pendekatan standar dan dasar);",
        "(5) Memakai CVA dalam pricing fasilitas kredit yang dibundel derivatif.",
      ],
      tasks: [],
    },
    {
      id: "cva-hitung",
      eyebrow: "Langkah 3 · Teori",
      title: "Menghitung CVA: exposure, PD, LGD",
      prose: [
        "Rumus CVA: CVA = LGD × jumlah atas tiap periode (Expected Exposure × PD marginal × Faktor Diskonto). Tiap suku adalah kerugian yang diharapkan pada periode itu: bila lawan gagal pada tahun itu (probabilitas = PD marginal tahun itu), bank kehilangan EE × LGD — didiskonto ke hari ini. Jumlahkan semua tahun, kalikan LGD — itulah CVA, harga dari risiko counterparty.",
        "Hitung contoh cerita pembuka dengan angka lab. Eksposur yang diharapkan (EE) 3 tahun: [40, 30, 20] juta. PD marginal tiap tahun: [0,8 persen; 0,7 persen; 0,6 persen]. Faktor diskonto: [0,95; 0,90; 0,86]. LGD 60 persen. Tahun 1: 40 × 0,008 × 0,95 = 0,304. Tahun 2: 30 × 0,007 × 0,90 = 0,189. Tahun 3: 20 × 0,006 × 0,86 = 0,1032. Jumlah: 0,304 + 0,189 + 0,1032 = 0,5962. CVA = 0,6 × 0,5962 = Rp0,35772 juta. Nilai wajar swap Rp10.000 juta dikurangi CVA menjadi Rp9.999,64 juta — koreksi kecil, tetapi koreksi yang wajib dicatat di laporan keuangan (PSAK 109).",
        "Expected Exposure (EE) adalah kunci yang paling sulit: ia adalah nilai derivatif yang diharapkan di masa depan — yang bergantung pada pergerakan pasar (suku bunga, FX). EE dihitung dari simulasi Monte Carlo atas faktor risiko (MR15) — bukan dari satu angka. Profil EE yang naik-turun mengikuti pasar inilah yang membuat CVA berubah tiap hari — dan yang membuat CVA desk harus di-hedge secara dinamis (MR29).",
        "Dua catatan tentang PD yang dipakai di rumus. Pertama, PD marginal tahun t adalah peluang lawan gagal PADA tahun t — bukan peluang kumulatif sampai tahun t. Dalam praktik, PD marginal diturunkan dari kurva survival — PD_marginal(t) = S(t−1) − S(t) — sehingga tiap suku memakai peluang lawan bertahan sampai tahun itu lalu gagal di tahun itu, dan jumlahnya tidak boleh melebihi 100 persen. Kedua, EE di rumus adalah exposure POSITIF yang diharapkan — E[max(nilai, 0)] — karena bila derivatif bernilai negatif bagi bank, bank-lah yang berutang dan gagalnya lawan tidak merugikan bank. Itulah mengapa CVA memakai EE, bukan nilai mark-to-market yang bisa negatif.",
        "Wrong-way risk adalah saat EE NAIK tepat ketika PD lawan NAIK — seperti perusahaan tambang di cerita pembuka: harga batubara jatuh membuat swap-nya bernilai lebih besar bagi bank (EE naik) DAN membuat perusahaan itu lebih mungkin gagal (PD naik). Kerugian yang diharapkan menjadi perkalian dua hal yang naik bersamaan — jauh lebih besar dari perkalian rata-ratanya. Kerangka Basel mengharuskan bank memperhitungkan wrong-way risk secara spesifik — mengidentifikasi eksposur yang berkorelasi dengan memburuknya lawan — dan memegang modal lebih besar untuknya sesuai pendekatan modal yang berlaku. Right-way risk adalah kebalikannya — EE turun saat PD naik — dan mengurangi CVA.",
      ],
      tasks: [],
      formula: String.raw`\text{CVA} = LGD \times \sum_t EE_t \times PD_t \times DF_t`,
      formulaNote: "EE = expected exposure; PD t = PD marginal tahun t; DF = faktor diskonto; LGD = 60 persen. Contoh: 0,6 × (0,304 + 0,189 + 0,1032) = 0,35772 juta.",
      reference: "CVA Rp0,35772 juta. Wrong-way risk: EE naik saat PD naik — kerugian berlipat.",
    },
    {
      id: "xva-modal",
      eyebrow: "Langkah 4 · Teori",
      title: "DVA, FVA, dan modal CVA Basel",
      prose: [
        "XVA adalah keluarga penyesuaian valuasi. CVA: penyesuaian karena LAWAN bisa gagal — mengurangi nilai aset derivatif. DVA (debit valuation adjustment): penyesuaian karena BANK SENDIRI bisa gagal — MENURUNKAN nilai wajar liabilitas derivatif (karena bank mungkin tidak membayar penuh, utangnya menjadi 'lebih murah' bagi bank). DVA kontroversial: bank yang memburuk mencatat KEUNTUNGAN dari DVA — karena utangnya menjadi 'lebih murah'. FVA (funding valuation adjustment): biaya pendanaan collateral dan margin untuk derivatif yang tidak di-clearing — biaya nyata yang harus dimasukkan ke harga. Ketiganya bersama-sama adalah 'harga sebenarnya' derivatif — dan ketiganya berubah tiap hari.",
        "Modal CVA Basel mengenakan modal untuk RISIKO PERUBAHAN CVA — bukan hanya untuk CVA hari ini. Dua pendekatan. Pendekatan standar (SA-CVA): bank menghitung sensitivitas CVA terhadap perubahan credit spread lawan dan faktor pasar, lalu mengalikannya dengan bobot risiko — seperti VaR untuk CVA. Pendekatan dasar (BA-CVA): memakai exposure (EAD), bobot risiko counterparty, dan maturity — dengan ketentuan agregasi dan pengakuan hedging — untuk bank tanpa model CVA internal. Ia BUKAN sekadar rumus expected loss PD × LGD × EAD: modal BA-CVA dihitung dari komponen risiko yang diagregasi dan dikalikan faktor pengali, bukan dari perkalian sederhana ketiganya. Keduanya bertujuan sama: modal untuk kemungkinan CVA memburuk saat credit spread lawan melebar — seperti yang terjadi pada 2008, ketika dua per tiga kerugian counterparty bank berasal dari PERUBAHAN CVA, bukan dari gagal bayar aktual.",
        "Hubungan CVA dengan ECL (CR14) wajib dipahami: keduanya mengukur kerugian kredit yang diharapkan — tetapi atas objek yang berbeda. ECL mengukur kerugian atas PINJAMAN (EAD yang diketahui, PD debitur). CVA mengukur kerugian atas DERIVATIF (EE yang berubah-ubah, PD lawan). Bank yang memberi pinjaman DAN derivatif ke perusahaan yang sama harus menghitung KEDUANYA — dan waspada terhadap wrong-way risk yang mengkorelasikan keduanya. Pencadangan yang hanya menghitung ECL pinjaman sedang mengabaikan separuh eksposur.",
        "Pricing yang benar memasukkan CVA ke harga: bila bank memberi swap ke perusahaan BB, ia harus menagih CVA dalam spread swap-nya — atau ia mensubsidi risiko counterparty dari kantongnya sendiri. Contoh konversi CVA ke spread (ilustratif, asumsi eksplisit): swap di lab — CVA Rp0,35772 juta, notional Rp10.000 juta, tenor 3 tahun dengan faktor diskonto [0,95; 0,90; 0,86] (jumlah 2,71). Spread tambahan s memenuhi s × notional × ΣDF = CVA, jadi s = 0,35772 / (10.000 × 2,71) = 0,0000132 = 0,00132 persen ≈ 0,13 bp per tahun. Artinya bank menagih sekitar 0,13 bp per tahun di atas spread swap untuk menutup CVA — kecil karena CVA-nya sendiri kecil terhadap notional. Bila PD lawan naik (lab: CVA Rp0,63132 juta), spread naik proporsional menjadi ≈0,23 bp. Rumus ini memakai asumsi anuitas sederhana (pembayaran tahunan, DF yang sama untuk spread dan CVA); praktik memakai kurva diskonto dan jadwal pembayaran aktual. Praktiknya: CVA desk menghitung CVA per transaksi dan menagihkannya ke desk bisnis sebagai 'biaya internal' — seperti RAROC (CR21) menagih modal. Desk yang menolak membayar CVA sedang menolak mengakui biaya risikonya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira CVA hanya untuk bank besar dengan derivatif kompleks. Setiap bank yang punya derivatif OTC — bahkan satu swap sederhana dengan nasabah korporat — punya CVA. PSAK 109 mewajibkan nilai wajar memperhitungkan risiko kredit lawan — tidak ada pengecualian untuk 'kecil'.",
      },
      reference: "2008: dua per tiga kerugian counterparty berasal dari perubahan CVA, bukan gagal bayar aktual. SA-CVA dan BA-CVA adalah dua pendekatan modal Basel.",
    },
    {
      id: "lab-cva",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin CVA",
      prose: [
        "Lab ini membangun mesin CVA: dari expected exposure, PD marginal, faktor diskonto, dan LGD — hitung CVA 3 tahun.",
        "Hitung dulu di kepala. Tahun 1: 40 × 0,008 × 0,95 = 0,304. Tahun 2: 30 × 0,007 × 0,90 = 0,189. Tahun 3: 20 × 0,006 × 0,86 = 0,1032. Jumlah: 0,5962. CVA = 0,6 × 0,5962 = Rp0,35772 juta.",
        "Tugas lab: tulis fungsi yang menerima daftar EE, PD marginal, DF, dan LGD — lalu mencetak jumlah tertimbang (jumlah EE × PD × DF) dan CVA. Dua angka ini adalah harga risiko counterparty dalam satu baris.",
        "Setelah lolos, coba eksperimen: naikkan PD tahun 1 menjadi 2 persen (perusahaan melemah) dan lihat CVA menjadi Rp0,63132 juta — naik 76 persen. Lalu tanyakan: berapa spread tambahan yang harus ditagih ke nasabah ini?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `jumlah` (jumlah EE dikali PD dikali DF tiap tahun)" },
        { id: "t2", text: "Hitung `cva` (LGD dikali jumlah)" },
        { id: "t3", text: "Hitung `nilai_wajar` (10.000 dikurangi CVA, dalam juta — nilai murni swap Rp10 miliar = Rp10.000 juta)" },
      ],
      expected: "jumlah=0.5962\ncva=0.35772\nnilai_wajar=9999.64228",
      hints: [
        "Jumlah = sum(EE[i] x PD[i] x DF[i]) untuk tiap tahun.",
        "CVA = LGD x jumlah.",
        "Nilai wajar setelah CVA = 10.000 - CVA (nilai murni Rp10 miliar = Rp10.000 juta).",
      ],
      code: {
        starter: `# Swap 3 tahun: EE [40, 30, 20] jt, PD marginal [0,8%; 0,7%; 0,6%], DF [0,95; 0,90; 0,86], LGD 60%.\nee = [40.0, 30.0, 20.0]\npd_marginal = [0.008, 0.007, 0.006]\ndf = [0.95, 0.90, 0.86]\nlgd = 0.6\nnilai_murni = 10000.0  # juta rupiah (= Rp10 miliar)\n\n# TULIS KODEMU: hitung jumlah, cva, nilai_wajar.\n# Cetak, per baris: jumlah, cva, nilai_wajar.\n\n`,
        lockLines: 6,
        solution: `# Swap 3 tahun: EE [40, 30, 20] jt, PD marginal [0,8%; 0,7%; 0,6%], DF [0,95; 0,90; 0,86], LGD 60%.\nee = [40.0, 30.0, 20.0]\npd_marginal = [0.008, 0.007, 0.006]\ndf = [0.95, 0.90, 0.86]\nlgd = 0.6\nnilai_murni = 10000.0  # juta rupiah (= Rp10 miliar)\n\n\njumlah = sum(e * p * d for e, p, d in zip(ee, pd_marginal, df))\ncva = lgd * jumlah\nnilai_wajar = nilai_murni - cva\nprint(f"jumlah={jumlah:.5f}")\nprint(f"cva={cva:.5f}")\nprint(f"nilai_wajar={nilai_wajar:.5f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "jumlah", value: 0.5962, tol: 0.00001, label: "Jumlah tertimbang 0,5962", msg: "0,304 + 0,189 + 0,1032 = 0,5962. Kerugian yang diharapkan sebelum LGD." },
          { kind: "equal", task: "t2", name: "cva", value: 0.35772, tol: 0.00001, label: "CVA Rp0,35772 juta", msg: "0,6 x 0,5962 = 0,35772. Harga risiko counterparty swap ini." },
          { kind: "equal", task: "t3", name: "nilai_wajar", value: 9999.64228, tol: 0.00001, label: "Nilai wajar Rp9.999,64228 juta", msg: "10.000 - 0,35772 = 9.999,64228. Nilai yang dicatat di laporan keuangan setelah CVA." },
        ],
      },
      reference: "Jumlah 0,5962; CVA Rp0,35772 juta; nilai wajar Rp9.999,64228 juta.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: CVA dalam pricing dan limit",
      prose: [
        "Pricing fasilitas korporat yang dibundel derivatif harus menghitung CVA di muka: bila nasabah meminta pinjaman Rp500 miliar PLUS swap, bank menghitung ECL pinjaman (CR14) DAN CVA swap — lalu menagih keduanya dalam bunga pinjaman dan spread swap. Bank yang hanya menagih ECL sedang memberi swap gratis — dan mensubsidi risiko counterparty dari laba. Praktik yang benar: CVA desk memberi 'harga CVA' per transaksi; desk bisnis memasukkannya ke pricing; komite kredit menyetujui total harga (bunga + CVA) — bukan bunga saja.",
        "Limit counterparty untuk derivatif diukur dari PFE (potential future exposure) — bukan dari EE hari ini. PFE 95 persen adalah exposure pada kuantil 95 persen dari distribusi simulasi — bukan EE: EE adalah nilai EKSPEKTASIAN exposure, sedangkan PFE adalah kuantilnya. Angka PFE jauh lebih besar dari EE rata-rata. Limit PFE per lawan, per sektor, dan per tenor adalah pagar yang mencegah satu lawan menenggelamkan bank. Dan CSA (credit support annex) adalah pengaman operasional: margin harian (variation margin) dan initial margin mengurangi EE — dan mengurangi CVA. Derivatif dengan CSA harian punya CVA yang jauh lebih kecil dari derivatif tanpa CSA — karena exposure-nya di-collateral setiap hari.",
        "Dua pengurang exposure yang wajib dikenal sebelum menghitung CVA. Pertama, NETTING: bila bank punya dua swap dengan lawan yang sama — satu bernilai +Rp8 miliar bagi bank, satu −Rp5 miliar — exposure bersihnya Rp3 miliar, bukan Rp8 miliar, selama ada perjanjian netting (ISDA Master Agreement) yang sah. Tanpa netting, CVA dihitung atas tiap transaksi secara terpisah dan membengkak. Kedua, COLLATERAL: kas atau surat berharga yang dijaminkan lawan mengurangi EE sebesar nilai collateral yang diterima (setelah haircut). Contoh: EE Rp40 juta dengan collateral Rp25 juta → exposure bersih Rp15 juta — CVA tahun itu ikut menyusut proporsional. Karena itu CVA praktis selalu dihitung ATAS exposure bersih setelah netting dan collateral — angka 'kotor' sebelum keduanya hanya berguna sebagai batas atas.",
        "Satu peringatan terakhir: CVA berubah tiap hari bersama credit spread lawan dan nilai pasar derivatif. Bank yang menghitung CVA sekali setahun sedang memakai foto tahun lalu untuk mengemudi hari ini. Praktik standar: hitung CVA harian, hedge perubahan CVA dengan CDS (MR29), dan laporkan CVA desk P&L secara terpisah — agar direksi tahu berapa laba yang berasal dari bisnis dan berapa yang berasal dari perubahan CVA.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira CVA hanya mengurangi nilai aset — dan tidak memengaruhi keputusan bisnis. CVA yang tidak ditagih ke nasabah adalah subsidi; CVA yang tidak dihitung adalah risiko yang tidak terlihat; CVA yang tidak di-hedge adalah taruhan pada credit spread lawan.",
      },
      reference: "Limit PFE 95 persen per lawan. CSA harian mengurangi CVA secara material. Hitung CVA harian, hedge dengan CDS.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: perusahaan tambang — pinjaman DAN swap",
      prose: [
        "Kembali ke perusahaan tambang di cerita pembuka. Bank Nusantara memberinya pinjaman Rp500 miliar (ECL Rp10 miliar, CR14) dan swap suku bunga (CVA Rp0,35772 juta). Total risiko yang dihitung: Rp10,00036 miliar. Tetapi harga batubara jatuh 40 persen — dan perusahaan itu gagal. Kerugian aktual: pinjaman Rp250 miliar (LGD 50 persen × 500) PLUS swap Rp10 miliar = Rp260 miliar — sekitar 26 kali lipat dari rata-rata yang dihitung (Rp10,00036 miliar). Itu BUKAN bukti modelnya salah: Rp10,00036 miliar adalah expected loss — rata-rata probabilistik atas SEMUA skenario, termasuk skenario gagal bayar yang jarang tetapi besar. Realisasi satu skenario buruk (gagal bayar sungguhan) wajar jauh di atas rata-rata — seperti biaya satu orang yang sakit parah yang jauh di atas premi rata-rata. Yang patut dipertanyakan bukan selisihnya, melainkan apakah skenario itu sudah masuk dalam distribusi yang dipakai menghitung rata-rata — dan apakah korelasi antar eksposur sudah diperhitungkan. Apa yang salah?",
        "Yang salah: ECL dan CVA dihitung secara TERPISAH — masing-masing memakai PD rata-rata (tanpa syarat) dan tanpa memperhitungkan bahwa keduanya digerakkan oleh SATU faktor: harga batubara. Menjumlahkan dua expected loss TIDAK mensyaratkan keduanya independen — yang keliru adalah memakai PD yang sama untuk kedua eksposur tanpa mengkondisikannya pada skenario batubara jatuh. Itulah wrong-way risk dalam bentuk paling murni: eksposur naik (swap bernilai lebih besar bagi bank saat suku bunga bergerak karena krisis batubara) tepat saat PD naik (perusahaan melemah karena batubara jatuh). Perhitungan yang benar memakai PD BERSYARAT pada skenario batubara jatuh — bukan PD rata-rata — untuk KEDUA eksposur sekaligus.",
        "Keputusan yang benar setelah kejadian ini: bank mewajibkan analisis wrong-way risk untuk setiap nasabah dengan pinjaman DAN derivatif — dengan skenario faktor bersama (harga komoditas, FX, suku bunga) yang memengaruhi keduanya. Dan limit gabungan (pinjaman + PFE derivatif) per nasabah — bukan limit terpisah yang masing-masing terlihat aman tetapi gabungannya mematikan. Risiko yang dihitung terpisah adalah risiko yang tidak dihitung.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat analisis ini benar. Pertama, kerugian aktual (Rp260 miliar) adalah realisasi satu skenario — membandingkannya dengan expected loss (Rp10,00036 miliar, rata-rata probabilistik) menuntut penjelasan, bukan vonis bahwa modelnya salah. Kedua, penjelasan ditemukan di faktor bersama (harga batubara) — PD bersyarat pada skenario buruk, bukan PD rata-rata, yang harus dipakai untuk kedua eksposur. Ketiga, perbaikannya struktural (limit gabungan + analisis wrong-way) — bukan sekadar menaikkan angka.",
      },
      reference: "Dihitung (expected loss) Rp10,00036 miliar; aktual (satu realisasi) Rp260 miliar — sekitar 26 kali lipat, wajar untuk realisasi skenario buruk. Penyebab: wrong-way risk dari faktor bersama harga batubara.",
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
        "Jumlah 0,5962; CVA Rp0,35772 juta; nilai wajar Rp9.999,64228 juta.",
        "CVA = LGD × jumlah (EE × PD marginal × DF) tiap periode.",
        "Wrong-way risk: EE naik saat PD naik — kerugian berlipat.",
        "DVA: bank sendiri bisa gagal (MENURUNKAN nilai wajar liabilitas — utang jadi 'lebih murah'). FVA: biaya pendanaan collateral.",
        "2008: dua per tiga kerugian counterparty dari perubahan CVA, bukan gagal bayar aktual.",
      ],
      next: { label: "CR46 — ML Credit Scoring: XGBoost dan Walk-Forward Validation", href: "/v2/learn/cr46-ml-credit-scoring" },
      quiz: [
        {
          q: "EE [40, 30, 20], PD marginal [0,8 persen; 0,7 persen; 0,6 persen], DF [0,95; 0,90; 0,86], LGD 60 persen. Berapa CVA-nya?",
          options: [
            { text: "Rp0,35772 juta", why: "Tepat: 0,6 × (0,304 + 0,189 + 0,1032) = 0,6 × 0,5962 = 0,35772.", correct: true },
            { text: "Rp0,5962 juta — lupa mengalikan LGD", why: "Salah: 0,5962 adalah jumlah tertimbang SEBELUM LGD. CVA = LGD × jumlah = 0,35772." },
            { text: "Rp0,6 juta — sama dengan LGD-nya", why: "Salah: LGD 0,6 adalah pengali, bukan hasilnya. CVA dihitung dari EE, PD, DF, lalu dikali LGD." },
            { text: "Rp1,7886 juta — jumlah dikali 3 tahun", why: "Salah: jumlah sudah menjumlahkan ketiga tahun. Mengalikan lagi dengan 3 berarti menghitung tiap tahun tiga kali." },
          ],
        },
        {
          q: "Apa itu wrong-way risk?",
          options: [
            { text: "Risiko bahwa lawan transaksi membayar terlalu cepat", why: "Salah: pembayaran cepat bukan risiko. Wrong-way risk adalah korelasi yang merugikan antara exposure dan PD." },
            { text: "EE naik tepat saat PD lawan naik — kerugian berlipat karena dua hal buruk terjadi bersamaan", why: "Tepat: perusahaan tambang — batubara jatuh membuat swap lebih berharga bagi bank DAN perusahaan lebih mungkin gagal.", correct: true },
            { text: "Risiko bahwa bank salah menghitung CVA", why: "Salah: itu risiko model (MR18). Wrong-way risk adalah korelasi ekonomi antara exposure dan default — bukan kesalahan hitung." },
            { text: "Risiko bahwa suku bunga bergerak berlawanan dengan prediksi", why: "Salah: itu risiko pasar biasa (MR8). Wrong-way risk spesifik soal hubungan EE dan PD lawan." },
          ],
        },
        {
          q: "Bank mencatat keuntungan dari DVA saat kondisinya memburuk. Kenapa ini kontroversial?",
          options: [
            { text: "Karena DVA seharusnya selalu negatif", why: "Salah: arahnya terbalik — DVA MENURUNKAN nilai wajar liabilitas derivatif bila bank sendiri lebih mungkin gagal (utangnya jadi 'lebih murah'), dan penurunan nilai liabilitas itulah yang tercatat sebagai keuntungan akuntansi." },
            { text: "Karena bank yang memburuk mencatat keuntungan dari utangnya yang menjadi 'lebih murah' — keuntungan yang tidak bisa direalisasikan", why: "Tepat: DVA adalah keuntungan akuntansi dari memburuknya diri sendiri — tidak ada kas yang masuk, dan pasar mengabaikannya.", correct: true },
            { text: "Karena DVA dilarang oleh Basel", why: "Salah: DVA diakui dalam akuntansi nilai wajar (PSAK 109) — tetapi Basel MENGELUARKAN DVA dari modal regulator, justru karena kontroversinya." },
            { text: "Karena DVA hanya berlaku untuk bank kecil", why: "Salah: DVA berlaku untuk semua bank dengan derivatif. Ukuran bank tidak relevan." },
          ],
        },
        {
          q: "Pada 2008, dua per tiga kerugian counterparty bank berasal dari perubahan CVA, bukan gagal bayar aktual. Apa implikasinya untuk modal?",
          options: [
            { text: "Modal hanya perlu menutup gagal bayar aktual — perubahan CVA bukan kerugian nyata", why: "Salah: perubahan CVA ADALAH kerugian nyata — nilai wajar derivatif turun saat credit spread lawan melebar, dan itu memukul laporan laba rugi." },
            { text: "Modal harus menutup risiko PERUBAHAN CVA (spread melebar) — bukan hanya gagal bayar; itulah modal CVA Basel", why: "Tepat: SA-CVA dan BA-CVA mengenakan modal untuk volatilitas CVA — karena itulah sumber kerugian terbesar 2008.", correct: true },
            { text: "CVA tidak perlu dihitung — cukup pegang modal untuk gagal bayar", why: "Salah: mengabaikan CVA berarti mengabaikan dua per tiga kerugian 2008. Itulah yang diperbaiki Basel III." },
            { text: "Modal CVA hanya untuk bank yang punya CDS", why: "Salah: modal CVA untuk semua bank dengan derivatif OTC — CDS hanya salah satu alat hedging-nya." },
          ],
        },
        {
          q: "Bank memberi pinjaman DAN swap ke perusahaan yang sama. ECL pinjaman Rp10 miliar, CVA swap Rp0,35772 juta — dihitung terpisah. Apa yang terlewat?",
          options: [
            { text: "Tidak ada — keduanya sudah mencakup seluruh risiko", why: "Salah: menjumlahkan dua expected loss tidak mensyaratkan independensi — dan realisasi Rp260 miliar (satu skenario gagal bayar) yang 26 kali lipat dari rata-rata Rp10,00036 miliar bukan bukti model salah. Yang terlewat adalah korelasi lewat faktor bersama (harga batubara)." },
            { text: "Wrong-way risk dari faktor bersama — PD bersyarat pada skenario buruk harus dipakai untuk KEDUA eksposur sekaligus", why: "Tepat: risiko yang dihitung terpisah adalah risiko yang tidak dihitung. Limit gabungan dan analisis faktor bersama adalah perbaikannya.", correct: true },
            { text: "ECL seharusnya lebih besar dari CVA", why: "Salah: perbandingan besar-kecil bukan masalahnya. Masalahnya adalah KORELASI antar keduanya yang diabaikan." },
            { text: "Swap seharusnya tidak diberikan ke nasabah pinjaman", why: "Salah: bundel pinjaman + derivatif adalah praktik normal. Yang salah bukan bundelnya — melainkan perhitungan risiko yang mengabaikan korelasinya." },
          ],
        },
      ],
    },
  ],
};
