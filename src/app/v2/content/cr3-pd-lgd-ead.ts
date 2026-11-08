import type { V2Lesson } from "../lib/types";

export const cr3: V2Lesson = {
  slug: "cr3-pd-lgd-ead",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR3 — PD, LGD, EAD: Harga Risiko",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp 4,5 juta yang \"hilang\" setiap tahun",
      prose: [
        "Bu Ani punya warung kelontong. Setiap tahun ia \"mengikhlaskan\" sekitar Rp 4,5 juta — uang bon tetangga yang tidak kembali. Ia tidak kaget, tidak panik. \"Sudah saya anggarkan,\" katanya. \"Namanya juga dagang.\"",
        "Tahun 2020, pandemi datang. Tiba-tiba Rp 30 juta bon macet sekaligus — tetangga-tetangga yang biasanya bayar ikut kesulitan. Anggaran Rp 4,5 juta jebol total. Untung Bu Ani punya tabungan Rp 50 juta — ia selamat, meski tabungannya terkuras.",
        "Bank bekerja persis seperti Bu Ani — hanya skalanya miliaran. Rp 4,5 juta itu namanya Expected Loss (sudah dianggarkan via cadangan/CKPN). Rp 30 juta itu Unexpected Loss (ditutup dari tabungan = modal bank). Bank yang tidak paham bedanya akan mengira \"sudah ada cadangan, aman\" — lalu kaget saat krisis datang. Seluruh industri perbankan global — Basel, IFRS 9, OJK — berdiri di atas tiga huruf: PD, LGD, EAD.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap keputusan kredit bisa dibaca sebagai dua harga: (1) berapa EL-nya → menggerus laba via CKPN; (2) berapa UL-nya → mengunci modal via regulasi. Kredit \"murah\" (bunga rendah) dengan UL tinggi sebenarnya mahal — ia memakan modal yang bisa dipakai untuk 3 kredit lain.",
      },
      reference: "Tiga huruf fondasi: PD × LGD × EAD.",
    },
    {
      id: "trio",
      eyebrow: "Langkah 2 · Trio",
      title: "PD, LGD, EAD: tiga pertanyaan berurutan",
      prose: [
        "Setiap kredit bisa diringkas menjadi tiga pertanyaan. PD — Probability of Default: \"Seberapa mungkin dia gagal?\" Peluang debitur gagal bayar dalam 1 tahun. PD 2% artinya: dari 100 debitur sejenis, sekitar 2 diperkirakan macet setahun ke depan. Contoh angka: KPR debitur PNS golongan IV PD sekitar 0,5%; kartu kredit nasabah baru tanpa riwayat PD sekitar 8% — beda 16× lipat, inilah mengapa bunga kartu kredit jauh lebih tinggi.",
        "LGD — Loss Given Default: \"Kalau gagal, berapa yang hilang?\" Porsi exposure yang tidak kembali setelah debitur default (setelah agunan dijual, ditagih, direstrukturisasi). LGD 45% artinya dari Rp 100 yang macet, Rp 45 hilang selamanya. Kebalikannya disebut recovery rate = 1 − LGD. Contoh: KPR dengan rumah agunan LGD sekitar 15–25%; kartu kredit tanpa agunan LGD sekitar 80–90% — jawaban kuantitatif atas miskonsepsi CR1.",
        "EAD — Exposure at Default: \"Saat dia gagal, berapa tagihan kita?\" Total outstanding (+ komitmen yang mungkin ditarik) pada saat debitur default. Untuk kredit angsuran biasa EAD ≈ sisa pokok. Untuk kartu kredit/fasilitas revolving, EAD bisa lebih besar dari outstanding hari ini — debitur yang kesulitan cenderung menarik limit sampai habis sebelum macet (ini CCF — CR13). Urutan tiga pertanyaan tidak bisa dibalik: (1) apakah dia akan gagal → PD; (2) kalau gagal, berapa persen yang hilang → LGD; (3) berapa rupiah yang dipertaruhkan saat itu → EAD.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"PD 2% artinya dari 100 debitur PASTI 2 yang macet.\" PD adalah ekspektasi, bukan ramalan pasti. Realisasinya bisa 0, bisa 5 — itulah risiko. Justru karena realisasi menyimpang dari ekspektasi, bank butuh modal.",
      },
      reference: "Recovery rate = 1 − LGD.",
    },
    {
      id: "el",
      eyebrow: "Langkah 3 · EL",
      title: "Expected Loss: biaya rutin berbisnis kredit",
      prose: [
        "Expected Loss = kerugian rata-rata yang diharapkan terjadi. PD = peluang gagal (desimal, mis. 0,02); LGD = porsi hilang (desimal, mis. 0,45); EAD = rupiah exposure (mis. Rp 500 jt). Hasilnya dalam rupiah — \"biaya risiko\" kredit tersebut.",
        "Contoh: KPR Budi (CR1): PD = 2%, LGD = 45%, EAD = Rp 500 jt. Ubah ke desimal: 0,02 × 0,45 × 500. Kalikan: 0,02 × 0,45 = 0,009; 0,009 × 500 = Rp 4,5 jt. Bank \"menganggarkan\" Rp 4,5 jt kerugian untuk KPR ini — persis seperti Bu Ani menganggarkan Rp 4,5 jt bon macet. Anggaran ini diwujudkan sebagai CKPN (cadangan) yang mengurangi laba tahun berjalan.",
        "Karena EL adalah perkalian, ia bekerja proporsional: menurunkan PD dari 10% ke 5% efeknya SAMA dengan menurunkan dari 2% ke 1% — keduanya memangkas EL separuh. Pelajaran praktis: perbaiki dulu faktor yang paling buruk, ruang perbaikan terbesar ada di sana.",
      ],
      formula: String.raw`\text{EL} = \text{PD} \times \text{LGD} \times \text{EAD}`,
      formulaNote: "PD = peluang default setahun (desimal: 2% = 0,02 — bukan 2). LGD = porsi exposure yang hilang saat default (1 − recovery rate). EAD = rupiah exposure saat default. Contoh: 0,02 × 0,45 × Rp 500 jt = Rp 4,5 jt — \"anggaran bon macet\" per kredit. EL proporsional: PD 2%→10% = EL 5× lipat.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"EL sudah dicadangkan, jadi bank aman dari risiko kredit.\" Cadangan hanya menutup rata-rata kerugian. Tahun krisis, kerugian aktual bisa 3× EL (ingat Bu Ani: anggaran 4,5 jt, realisasi 30 jt). Selisih antara realisasi dan ekspektasi inilah Unexpected Loss — ditutup dari modal, bukan cadangan.",
      },
      reference: "EL kecil bukan berarti aman — cek juga UL-nya.",
    },
    {
      id: "lab-el",
      eyebrow: "Langkah 4 · Lab EL",
      title: "Kalkulator EL",
      prose: [
        "Tiga angka masuk, satu harga risiko keluar. KPR: PD 2%, LGD 45%, EAD Rp 500 jt. Tugasmu: hitung EL, lalu hitung lagi dengan PD naik ke 10% (nasabah berisiko) — rasakan sensitivitasnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `el` = pd × lgd × ead" },
        { id: "t2", text: "Hitung `el_berisiko` dengan pd = 0.10 (lgd & ead tetap)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "el=4.50 el_berisiko=22.50",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memasukkan PD sebagai 2 (bukan 0,02). Rumus memakai desimal — 2% = 0,02. Salah satu angka dalam persen = hasil meleset 100× lipat.",
      },
      hints: [
        "Kalikan ketiganya langsung: pd * lgd * ead.",
        "Untuk el_berisiko, pakai angka 0.10 sebagai pengganti pd.",
        "el = pd * lgd * ead  →  0.02 × 0.45 × 500 = 4.5",
      ],
      code: {
        starter: `pd  = 0.02    # 2% peluang gagal bayar setahun\nlgd = 0.45    # 45% dari exposure hilang saat default\nead = 500     # juta Rp exposure saat default\n\n# TULIS KODEMU\nel = \nel_berisiko = \n\nprint(f"el={el:.2f} el_berisiko={el_berisiko:.2f}")`,
        lockLines: 3,
        solution: `pd  = 0.02    # 2% peluang gagal bayar setahun\nlgd = 0.45    # 45% dari exposure hilang saat default\nead = 500     # juta Rp exposure saat default\n\n# TULIS KODEMU\nel = pd * lgd * ead\nel_berisiko = 0.10 * lgd * ead\n\nprint(f"el={el:.2f} el_berisiko={el_berisiko:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "el", value: 4.5, tol: 1e-9, label: "`el` seharusnya 4.5", msg: "0.02 × 0.45 × 500 = 4.5." },
          { kind: "equal", task: "t2", name: "el_berisiko", value: 22.5, tol: 1e-9, label: "`el_berisiko` seharusnya 22.5", msg: "0.10 × 0.45 × 500 = 22.5 — PD naik 5×, EL naik 5×." },
          { kind: "stdout_matches", task: "t3", pattern: "el=4\\.50\\s+el_berisiko=22\\.50", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: turunkan lgd jadi 0.20 (agunan bagus). PD turun separuh vs LGD turun separuh — efeknya sama, biayanya beda.",
    },
    {
      id: "ul",
      eyebrow: "Langkah 5 · UL",
      title: "Unexpected Loss: bantal untuk kejutan",
      prose: [
        "Unexpected Loss (UL) = volatilitas kerugian di sekitar EL — seberapa jauh realisasi bisa menyimpang dari ekspektasi. Kalau EL = Rp 12 M/tahun tetapi pada skenario buruk (resesi) kerugian bisa Rp 40 M, maka UL ≈ Rp 28 M. Rp 28 M inilah yang harus disediakan sebagai modal (bukan cadangan).",
        "Aturan mainnya, dan ini fundamental: EL → ditutup CKPN (cadangan) → mengurangi laba tahun berjalan. UL → ditutup modal → mengurangi kapasitas bank (modal terkunci, tidak bisa diputar jadi kredit baru). Kalau EL adalah \"anggaran belanja rutin\", UL adalah \"dana darurat\". Bank yang hanya punya CKPN tanpa modal cukup akan kolaps saat krisis — inilah alasan regulator (Basel, OJK) mewajibkan modal minimum.",
        "Simulasi 7 tahun dengan EL Rp 12 M: 6 tahun tenang, aktual sekitar EL — cadangan bekerja sempurna. Tapi tahun krisis meledak: selisih di atas EL = Unexpected Loss, ditutup dari modal. Cadangan saja tidak cukup untuk krisis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tahun krisis, kerugian aktual 3× EL: CKPN menutup sebesar EL; kelebihannya menggerus modal (dan bisa memicu pelanggaran KPMM). Inilah mengapa Basel mewajibkan modal untuk UL (CR4).",
      },
      reference: "EL → CKPN (laba). UL → modal (kapasitas).",
    },
    {
      id: "lab-ul",
      eyebrow: "Langkah 6 · Lab UL",
      title: "Ekspektasi vs kejutan",
      prose: [
        "Data kerugian aktual 7 tahun (juta Rp): [10,7; 31,8; 13,1; 8,9; 12,3; 11,0; 8,8]. EL tahunan = Rp 12 M. Tahun kedua adalah tahun krisis. Tugasmu: hitung rata-rata aktual 7 tahun, lalu hitung kelebihan tahun krisis di atas EL — itulah porsi yang ditutup modal, bukan cadangan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata_rata` dari list `aktual`" },
        { id: "t2", text: "Hitung `excess_krisis` = aktual tahun krisis (indeks 1) − el_tahunan" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "rata_rata=13.8 excess_krisis=19.8",
      hints: [
        "Rata-rata = jumlah semua dibagi banyaknya data.",
        "Tahun krisis adalah elemen kedua list (indeks 1).",
        "rata_rata = sum(aktual) / len(aktual)",
      ],
      code: {
        starter: `aktual = [10.7, 31.8, 13.1, 8.9, 12.3, 11.0, 8.8]  # juta Rp, 7 tahun\nel_tahunan = 12.0  # ekspektasi kerugian per tahun\n\n# TULIS KODEMU\nrata_rata = \nexcess_krisis = \n\nprint(f"rata_rata={rata_rata:.1f} excess_krisis={excess_krisis:.1f}")`,
        lockLines: 2,
        solution: `aktual = [10.7, 31.8, 13.1, 8.9, 12.3, 11.0, 8.8]  # juta Rp, 7 tahun\nel_tahunan = 12.0  # ekspektasi kerugian per tahun\n\n# TULIS KODEMU\nrata_rata = sum(aktual) / len(aktual)\nexcess_krisis = aktual[1] - el_tahunan\n\nprint(f"rata_rata={rata_rata:.1f} excess_krisis={excess_krisis:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata_rata", value: 13.8, tol: 0.05, label: "`rata_rata` sekitar 13.8", msg: "Jumlahkan 7 angka lalu bagi 7." },
          { kind: "equal", task: "t2", name: "excess_krisis", value: 19.8, tol: 0.05, label: "`excess_krisis` sekitar 19.8", msg: "31.8 − 12.0 = 19.8. Ini porsi yang ditutup modal." },
          { kind: "stdout_matches", task: "t3", pattern: "rata_rata=13\\.8\\s+excess_krisis=19\\.8", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rata-rata ≈ EL (13,8 vs 12) — tetapi tahun krisis butuh modal Rp 19,8 M di atas cadangan.",
    },
    {
      id: "tuas",
      eyebrow: "Langkah 7 · Tuas",
      title: "Tuas mana yang ditarik?",
      prose: [
        "EL = PD × LGD × EAD berarti ada tiga tuas — tetapi tuas termurah berbeda per situasi. PD terlalu tinggi → perketat seleksi / naikkan cut-off. Menolak 10% aplikan terburuk bisa memangkas PD portofolio 30–40%. Alatnya: scorecard + cut-off (CR7). Contoh: kartu kredit menaikkan skor minimum dari 600 ke 650 — approval turun 15%, tapi NPL turun dari 9% ke 6%.",
        "LGD terlalu tinggi → minta agunan / asuransi. KPR dengan LTV 70% (DP 30%) punya LGD sekitar 20%; KPR LTV 95% LGD-nya bisa 40%+. Contoh: KMK dengan jaminan persediaan + asuransi kredit — LGD turun dari 60% ke 35%. EAD terlalu besar → kecilkan limit / pantau utilization. Limit Rp 100 jt yang utilization-nya 10% tetap berisiko: saat debitur kesulitan, ia akan tarik sampai habis sebelum macet (CCF — CR13). Contoh: bank memangkas limit kartu yang tidak aktif 12 bulan — EAD portofolio turun 8%, keluhan nasabah hampir nol.",
        "UL terlalu tinggi (konsentrasi) → diversifikasi. 100 debitur Rp 1 M vs 1 debitur Rp 100 M — EL bisa sama, tapi UL beda langit-bumi (detail CR15). Dan kalau OJK bertanya \"berapa PD portofoliomu?\" — jawab per segmen, jangan satu angka.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kartu kredit tidak punya agunan (tuas LGD buntu) — maka mainkan PD (seleksi) dan EAD (limit). Menaikkan bunga menaikkan pendapatan, bukan menurunkan EL — malah bisa menaikkan PD lewat adverse selection.",
      },
      reference: "Tuas: PD → seleksi · LGD → agunan · EAD → limit · UL → diversifikasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: tuas mana yang ditarik",
      prose: [
        "Skenario 1 — PD portofolio terlalu tinggi. → Perketat seleksi: naikkan cut-off scorecard. Contoh nyata: kartu kredit menaikkan skor minimum 600 → 650 — approval turun 15%, tetapi NPL turun 9% → 6%. Menolak 10% aplikan terburuk bisa memangkas PD 30–40%.",
        "Skenario 2 — LGD terlalu tinggi. → Minta agunan atau asuransi kredit. Contoh nyata: KPR LTV 70% punya LGD sekitar 20%; KPR LTV 95% LGD-nya bisa 40%+. KMK dengan jaminan persediaan + asuransi: LGD 60% → 35%.",
        "Skenario 3 — EAD membengkak diam-diam. → Kecilkan limit dan pantau utilisasi (detail di CR13). Contoh nyata: pangkas limit kartu tidak aktif 12 bulan — EAD portofolio turun 8%, keluhan nasabah hampir nol.",
        "Skenario 4 — Dua opsi dengan EL sama. → Pilih yang granular (20 KUR @Rp 50 jt mengalahkan 1 korporasi Rp 1 M meski EL-nya sama Rp 16 jt). Alasan: EL sama tetapi UL Opsi B berkali-kali lipat — kalau 1 debitur itu macet, langsung hilang Rp 400 jt sekaligus.",
        "Skenario 5 — Ekonomi memasuki resesi. → Siapkan modal untuk UL, bukan cuma CKPN untuk EL. Contoh nyata: Bu Ani menganggarkan Rp 4,5 jt (EL) tetapi menyimpan tabungan Rp 50 jt (modal) — saat Rp 30 jt bon macet sekaligus, tabungannyalah yang menyelamatkannya.",
        "Aturan praktis 10 detik: EL = PD × LGD × EAD — perbaiki dulu faktor yang paling buruk; EL ditutup cadangan (laba tahun ini), UL ditutup modal (kapasitas bank).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mencampur satuan: PD 2% dimasukkan sebagai 2 (bukan 0,02) → EL Rp 450 jt bukan Rp 4,5 jt — CKPN 100× kebutuhan, laba kuartalan anjlok misterius, dan butuh investigasi 3 hari untuk menemukan satu sel spreadsheet tanpa label satuan.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Dua kredit, EL sama, risiko beda",
      prose: [
        "Bank Nusantara punya dua opsi penyaluran Rp 1 M. Opsi A — 20 KUR @Rp 50 jt: PD 4%, LGD 40%, EAD Rp 50 jt per debitur. EL total = 20 × 0,04 × 0,4 × 50 = Rp 16 jt. Opsi B — 1 kredit korporasi Rp 1 M: PD 4%, LGD 40%, EAD Rp 1 M. EL = 0,04 × 0,4 × 1000 = Rp 16 jt.",
        "EL-nya persis sama: Rp 16 jt. Direksi bertanya: \"Sama saja kan? Pilih yang operasionalnya lebih murah (Opsi B — cuma urus 1 debitur).\" Setujukah kamu? Pembahasan: tidak setuju — ini jebakan EL. Skenario terburuk Opsi A: 20 debitur independen, peluang semuanya macet bersamaan ≈ 0 (sebaran binomial). Kerugian realistis berkisar Rp 0–40 jt. Opsi B: 1 debitur — kalau ia macet, langsung hilang Rp 400 jt (LGD 40% × 1 M) sekaligus!",
        "EL sama (Rp 16 jt) tetapi UL Opsi B berkali-kali lipat Opsi A — Opsi B butuh modal jauh lebih besar (CR15: konsentrasi). Analogi: 20 warung vs 1 mal — omzet harian rata-rata sama, tapi kalau 1 mal kebakaran, habis semua. Pelajaran abadi: EL mengukur rata-rata; risiko sesungguhnya ada di sebaran.",
      ],
      tasks: [],
      reference: "EL menjawab \"berapa biayanya\", UL menjawab \"berapa modalnya\".",
    },
    {
      id: "el-jebakan",
      eyebrow: "Langkah 10 · Jebakan EL",
      title: "Satuan dan horizon: dua jebakan EL",
      prose: [
        "Rumus EL terlihat sederhana — justru itu bahayanya. Jebakan pertama: satuan. PD 2% harus masuk sebagai 0,02 (desimal), LGD 45% sebagai 0,45, EAD Rp 500 jt sebagai 500 (juta). Satu angka dalam persen sementara yang lain desimal → hasil meleset 100× lipat. Ini bukan kesalahan teori; ini kesalahan spreadsheet yang paling sering terjadi di meja analis — dan tidak ada yang memeriksanya karena rumusnya \"kan gampang\".",
        "Contoh nyata polanya: analis memasukkan PD = 2 (bukan 0,02) → EL = 2 × 0,45 × 500 = Rp 450 jt, bukan Rp 4,5 jt. CKPN yang dibentuk 100× lipat kebutuhan; laba kuartalan anjlok misterius; investigasi 3 hari menemukan satu sel tanpa label satuan. Atau sebaliknya — EAD dalam rupiah penuh (500.000.000) dikali PD desimal → EL Rp 4,5 M yang lolos karena \"angkanya terlihat wajar untuk portofolio besar\".",
        "Jebakan kedua: horizon. PD 1-tahun × EAD hari ini = EL 1-tahun. Mencampurnya dengan EAD lifetime atau menjumlah EL 1-tahun lima kredit dengan tenor berbeda tanpa penyesuaian = membandingkan apel dengan durian. EAD pun harus sehorizon dengan PD: untuk EL lifetime, EAD adalah profil per tahun (menyusut dengan amortisasi), bukan satu angka.",
        "Aturan keputusan. Satu: tulis satuan di SETIAP angka — \"PD 2% (1-thn)\", \"EAD Rp 500 jt\" — tanpa pengecualian, termasuk di slide direksi. Dua: uji dimensi — EL harus keluar dalam rupiah; jika satuannya persen atau tanpa satuan, ada yang salah. Tiga: uji kewajaran — EL per kredit wajarnya 0,5–8% dari EAD; di luar itu, periksa satuan dulu sebelum merayakan atau panik. Empat: template spreadsheet EL wajib punya sel satuan yang terkunci — manusia lupa, template tidak.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: EL adalah biaya sewa, UL adalah uang jaminan",
        body: "Pikirkan begini: EL adalah biaya sewa ruko — pengeluaran rutin yang dianggarkan, dihitung ke harga jual, dan ditutup dari laba berjalan (cadangan). UL adalah uang jaminan ruko — dikunci di awal, tidak menghasilkan apa-apa, tetapi menyelamatkanmu saat atap roboh (krisis). Keduanya \"biaya risiko\", tetapi sifatnya berlawanan: EL dibayar pasti sedikit-sedikit, UL dibayar mungkin besar-sekali. Heuristik yang jarang disadari: dua kredit bisa punya EL SAMA tetapi UL SANGAT BEDA — kredit korporasi jumbo yang lumpy vs seribu KTA kecil yang tersebar. EL-nya sama, modalnya beda jauh. Maka harga yang hanya menutup EL adalah setengah harga; harga yang benar menutup EL + sewa modal (UL). Analis yang hanya bicara EL sedang menyewakan ruko tanpa meminta uang jaminan. Uji cepat untuk setiap proposal: hitung EL-nya (mudah), lalu tanyakan \"berapa modal yang dikunci untuk yang ini?\" (UL). Jika tidak ada yang bisa menjawab pertanyaan kedua, harga yang diajukan belum lengkap — ia menutup sewa tetapi lupa jaminan. Kredit yang lolos uji pertama tetapi gagal di kedua adalah kredit yang terlihat murah dan ternyata mahal.",
      },
      reference: "EL = biaya rutin (cadangan). UL = jaminan (modal). Harga menutup keduanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "PD = peluang gagal setahun; LGD = porsi hilang saat default; EAD = exposure saat default.",
        "EL = PD × LGD × EAD — ditutup CKPN (mengurangi laba). Bersifat perkalian: yang penting rasio perubahan.",
        "UL = volatilitas di sekitar EL — ditutup modal (mengurangi kapasitas).",
        "Tuas menurunkan EL: seleksi (PD), agunan (LGD), limit (EAD); UL tinggi → diversifikasi.",
        "EL sama ≠ risiko sama — risiko sesungguhnya ada di sebaran (konsentrasi & korelasi).",
      ],
      next: { label: "CR4A — Basel & RWA/KPMM", href: "/v2/learn/cr4a-basel-rwa-kpmm" },
      quiz: [
        {
          q: "KPR: PD 2%, LGD 45%, EAD Rp 500 jt. Berapa EL?",
          options: [
            { text: "Rp 45 jt", why: "Itu hasil kalau PD dipakai sebagai 2 (bukan 0,02) — salah desimal 100× lipat." },
            { text: "Rp 4,5 jt", why: "0,02 × 0,45 × 500 = Rp 4,5 jt. Ini 'anggaran' kerugian yang dicadangkan via CKPN — bukan ramalan pasti.", correct: true },
            { text: "Rp 10 jt", why: "Tidak ada kombinasi PD/LGD/EAD yang menghasilkan angka ini." },
            { text: "Rp 500 jt", why: "Itu EAD-nya, bukan EL. EL selalu jauh lebih kecil dari EAD." },
          ],
        },
        {
          q: "EL ditutup dari ______, sedangkan UL ditutup dari ______.",
          options: [
            { text: "modal … cadangan (CKPN)", why: "Terbalik. Cadangan menutup yang rutin (EL); modal menutup kejutan (UL)." },
            { text: "cadangan (CKPN) … modal", why: "EL → CKPN (mengurangi laba tahun berjalan); UL → modal (mengunci kapasitas). Tertukar = salah membaca laporan keuangan bank.", correct: true },
            { text: "laba ditahan … utang bank", why: "Bukan pasangan yang tepat untuk EL/UL." },
            { text: "utang bank … modal", why: "Utang bank bukan penutup kerugian kredit." },
          ],
        },
        {
          q: "Dua portofolio ber-EL sama persis. Mana yang pasti benar?",
          options: [
            { text: "Risikonya sama — EL sudah merangkum semua", why: "EL hanya rata-rata; risiko sesungguhnya ada di sebaran." },
            { text: "Risiko bisa beda jauh — EL hanya rata-rata; sebaran (UL) ditentukan konsentrasi & korelasi", why: "Inilah inti mini-case: 20 KUR vs 1 korporasi, EL sama Rp 16 jt, UL beda langit-bumi.", correct: true },
            { text: "Yang EL-nya sama pasti butuh modal sama", why: "Modal ditentukan UL, bukan EL." },
            { text: "Tidak ada bedanya bagi regulator", why: "Regulator justru mewajibkan modal berbeda via RWA (CR4)." },
          ],
        },
        {
          q: "Tahun krisis, kerugian aktual 3× EL. Apa yang terjadi di laporan bank?",
          options: [
            { text: "Tidak apa-apa — EL sudah mencakup semua skenario", why: "EL hanya mencakup rata-rata, bukan skenario krisis." },
            { text: "CKPN menutup sebesar EL; kelebihannya menggerus modal (dan bisa memicu pelanggaran KPMM)", why: "Kelebihan 2× EL memakan modal — kalau modal tipis, rasio KPMM jebol dan OJK turun tangan.", correct: true },
            { text: "Bank otomatis bangkrut", why: "Tidak otomatis — tergantung tebal modalnya." },
            { text: "UL tidak ada hubungannya dengan modal", why: "UL justru didefinisikan sebagai porsi yang ditutup modal." },
          ],
        },
        {
          q: "Fasilitas kartu kredit: outstanding Rp 10 jt, limit Rp 50 jt. Saat debitur macet, EAD yang realistis adalah?",
          options: [
            { text: "Rp 10 jt — EAD = outstanding hari ini", why: "Underestimate: debitur kesulitan menarik limit sebelum macet." },
            { text: "Mendekati Rp 50 jt — debitur kesulitan cenderung menarik limit sampai habis sebelum macet", why: "Fenomena ini (CCF — CR13) membuat EAD fasilitas revolving sistematis lebih besar dari outstanding.", correct: true },
            { text: "Rp 0 — kartu langsung diblokir saat macet", why: "Pemblokiran terjadi setelah penarikan — terlambat." },
            { text: "Rp 60 jt — outstanding + limit", why: "EAD tidak melebihi total limit fasilitas." },
          ],
        },
      ],
    },
  ],
};
