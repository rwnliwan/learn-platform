import type { V2Lesson } from "../lib/types";

export const pma6b: V2Lesson = {
  slug: "pm-a6b-valuasi-lanjutan",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A6B Equity: DDM Multi-Stage, FCFE & Kelipatan Wajar",
  estMinutes: 60,
  steps: [
    {
      id: "kenapa-gordon-tak-cukup",
      eyebrow: "Langkah 1 · Batas Gordon",
      title: "Gordon berhenti bekerja saat growth tidak konstan",
      prose: [
        "PM-A6 mengajarkan DDM Gordon: harga sama dengan dividen tahun depan dibagi selisih required return dan growth konstan. Rumus itu elegan, tetapi asumsinya rapuh: tidak ada perusahaan yang tumbuh dengan satu laju yang sama selamanya. Perusahaan muda tumbuh cepat lalu melambat; perusahaan matang tumbuh stabil; perusahaan siklikal tumbuh naik turun. Memaksakan satu angka growth ke seluruh masa depan sama saja dengan mengasumsikan bayi akan tumbuh 30 persen per tahun sampai usia 80 tahun.",
        "Solusinya adalah DDM multi-stage: bagi masa depan menjadi fase-fase dengan laju growth berbeda, diskontokan tiap dividen satu per satu, lalu tutup dengan nilai terminal saat growth akhirnya stabil. Logikanya sama dengan Gordon, hanya growth-nya diizinkan berubah. Harga yang dihasilkan jauh lebih sensitif terhadap asumsi fase awal, tetapi itulah harga kejujuran: model yang mengakui ketidakpastian lebih berguna daripada model rapi yang salah.",
        "Lesson ini membawa tiga alat lanjutan. Pertama, DDM dua tahap dan H-model untuk growth yang melambat bertahap. Kedua, FCFE untuk perusahaan yang tidak membagi dividen atau yang buyback-nya besar, karena dividen yang diumumkan bukan satu-satunya cara kas sampai ke pemegang saham. Ketiga, kelipatan wajar yang diturunkan dari fundamental, supaya P/E bukan lagi angka yang ditebak dari tetangga. Topik Equity di CFA Level 1 berbobot sekitar 10 sampai 12 persen dari ujian (rentang bobot yang umum dipublikasikan), dan valuasi adalah inti dari bobot itu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai Gordon untuk perusahaan growth tinggi dengan g mendekati r. Penyebut mengecil, harga meledak, dan jawabannya bukan valuasi melainkan artefak matematika. Growth tinggi selalu butuh multi-stage.",
      },
      quiz: [
        {
          q: "Perusahaan fiktif tumbuh 15 persen per tahun selama 5 tahun, lalu 4 persen selamanya. Model valuasi dividen yang tepat?",
          options: [
            { text: "Gordon satu tahap dengan g 15 persen", why: "Salah: growth 15 persen selamanya tidak realistis dan membuat penyebut r dikurangi g hampir nol." },
            { text: "DDM multi-stage: growth tinggi di fase awal, lalu terminal value dengan growth stabil", why: "Benar: tiap fase punya growth sendiri; nilai terminal memakai Gordon hanya setelah growth stabil.", correct: true },
            { text: "Tidak bisa divaluasi sama sekali", why: "Salah: justru multi-stage diciptakan untuk kasus ini." },
            { text: "Pakai harga saham kemarin sebagai nilai wajar", why: "Salah: harga pasar adalah data, bukan valuasi." },
          ],
        },
      ],
      reference: "Growth tidak konstan selamanya. Multi-stage membagi masa depan per fase, lalu tutup dengan terminal value.",
    },
    {
      id: "lab-ddm-dua-tahap",
      eyebrow: "Langkah 2 · Lab: DDM Dua Tahap",
      title: "Menghitung nilai wajar saat growth melambat",
      prose: [
        "PT Maju Fiktif (ilustratif) membagi dividen D0 Rp400. Tiga tahun ke depan dividen tumbuh 12 persen per tahun karena ekspansi, lalu growth turun permanen ke 5 persen. Required return investor 11 persen. Tugasmu: hitung nilai wajar hari ini dengan DDM dua tahap.",
        "Langkahnya: hitung D1, D2, D3 dari growth 12 persen, lalu D4 dari growth 5 persen. Nilai terminal di akhir tahun 3 adalah P3 sama dengan D4 dibagi selisih r dan g2. Diskontokan D1, D2, D3, dan P3 ke hari ini dengan 11 persen. Perhatikan bahwa terminal value biasanya mendominasi hasil: di contoh ini nilai kini dividen tiga tahun pertama hanya sekitar Rp1.222, sedangkan nilai kini terminal value sekitar Rp7.191 dari total sekitar Rp8.413.",
        "Angka kuncinya (ilustratif): D1 Rp448, D2 Rp501,76, D3 Rp561,97, D4 Rp590,07, P3 Rp9.834,50. Nilai wajar P0 sekitar Rp8.413. Bandingkan dengan Gordon naif memakai g 12 persen selamanya: penyebutnya negatif, modelnya runtuh. Bandingkan juga dengan Gordon memakai g 5 persen sejak awal: 420 dibagi 0,06 sama dengan Rp7.000, jauh lebih rendah karena mengabaikan tiga tahun growth tinggi. Dua tahap memberi jawaban di tengah yang jujur: growth tinggi dihargai, tetapi hanya selama ia bertahan.",
      ],
      formula: String.raw`P_0 = \frac{D_1}{1+r} + \frac{D_2}{(1+r)^2} + \frac{D_3 + P_3}{(1+r)^3} \quad ; \quad P_3 = \frac{D_4}{r - g_2}`,
      formulaNote: "D0 Rp400 (ilustratif); growth fase 1 sebesar 12 persen selama 3 tahun; growth terminal 5 persen; r 11 persen. Interpretasi: tiga dividen pertama didiskon satu per satu, lalu P3 menampung seluruh dividen setelah tahun 3. Contoh angka: D1 Rp448, D2 Rp501,76, D3 Rp561,97, D4 Rp590,07, P3 Rp9.834,50; nilai kini dividen Rp1.221,75 ditambah nilai kini P3 Rp7.190,90 sama dengan P0 sekitar Rp8.412,65.",
      tasks: [
        { id: "t1", text: "Hitung `p0` DDM dua tahap: D0=400, g1=12% selama 3 tahun, g2=5%, r=11%" },
        { id: "t2", text: "Cetak `p0` dibulatkan ke rupiah terdekat" },
      ],
      expected: "p0=8413",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mendiskon P3 dengan pangkat yang salah, atau memakai D3 (bukan D4) di rumus terminal value. Terminal value di akhir tahun 3 memakai dividen tahun 4.",
      },
      hints: [
        "D1 = D0 kali 1,12; D2 = D1 kali 1,12; D3 = D2 kali 1,12; D4 = D3 kali 1,05.",
        "P3 = D4 dibagi (r dikurangi g2) = D4 dibagi 0,06.",
        "p0 = d1/1.11 + d2/1.11**2 + (d3 + p3)/1.11**3",
      ],
      code: {
        starter: `d0, g1, g2, r = 400, 0.12, 0.05, 0.11\n\n# TULIS KODEMU\nd1 = \nd2 = \nd3 = \nd4 = \np3 = \np0 = \n\nprint(f"p0={p0:.0f}")`,
        lockLines: 1,
        solution: `d0, g1, g2, r = 400, 0.12, 0.05, 0.11\n\n# TULIS KODEMU\nd1 = d0 * (1 + g1)\nd2 = d1 * (1 + g1)\nd3 = d2 * (1 + g1)\nd4 = d3 * (1 + g2)\np3 = d4 / (r - g2)\np0 = d1/1.11 + d2/1.11**2 + (d3 + p3)/1.11**3\n\nprint(f"p0={p0:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p0", value: 8412.65, tol: 2, label: "`p0` sekitar 8413", msg: "Nilai kini dividen 1.221,75 ditambah nilai kini P3 7.190,90 sama dengan 8.412,65." },
          { kind: "stdout_matches", task: "t2", pattern: "p0=8413", label: "`print` menampilkan p0", msg: "Format: p0=... ." },
        ],
      },
      reference: "Dua tahap: dividen fase awal didiskon satu per satu; terminal value memakai D4 dibagi (r dikurangi g2).",
    },
    {
      id: "h-model",
      eyebrow: "Langkah 3 · H-Model",
      title: "Saat growth melambat pelan-pelan, bukan jatuh bebas",
      prose: [
        "DDM dua tahap mengasumsikan growth jatuh mendadak dari 12 persen ke 5 persen di satu titik. Kenyataannya growth biasanya melambat bertahap: keunggulan kompetitif terkikis sedikit demi sedikit, bukan hilang dalam semalam. H-model menangkap pola ini: growth turun secara linear dari growth tinggi ke growth rendah selama periode transisi.",
        "Rumusnya punya dua komponen yang mudah dibaca. Komponen pertama adalah nilai perusahaan seandainya ia tumbuh pada laju rendah selamanya. Komponen kedua adalah nilai tambah dari periode growth tinggi: setengah dari durasi transisi dikali selisih growth, dikali dividen awal, dibagi selisih r dan growth rendah. Setengah durasi itu muncul karena growth turun linear: rata-rata kelebihan growth selama transisi adalah setengah dari selisih awal.",
        "Contoh ilustratif yang sama: D0 Rp400, growth tinggi 12 persen, growth rendah 5 persen, r 11 persen, H sama dengan 3 tahun (separuh dari transisi 6 tahun). Komponen pertama: 400 kali 1,05 dibagi 0,06 sama dengan Rp7.000. Komponen kedua: 400 kali 3 kali 0,07 dibagi 0,06 sama dengan Rp1.400. Total Rp8.400, sangat dekat dengan hasil dua tahap Rp8.413, tetapi dengan asumsi pelambatan yang lebih halus dan realistis.",
      ],
      formula: String.raw`P_0 = \frac{D_0 (1 + g_L)}{r - g_L} + \frac{D_0 \times H \times (g_S - g_L)}{r - g_L}`,
      formulaNote: "D0 Rp400 (ilustratif); gS growth tinggi 12 persen; gL growth rendah 5 persen; r 11 persen; H 3 tahun (separuh transisi 6 tahun). Interpretasi: suku pertama adalah nilai dengan growth rendah selamanya; suku kedua adalah premi atas growth tinggi yang melambat linear. Contoh angka: 400 kali 1,05 dibagi 0,06 sama dengan 7.000; 400 kali 3 kali 0,07 dibagi 0,06 sama dengan 1.400; total 8.400.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai H sebagai durasi transisi penuh, bukan separuhnya. H adalah setengah periode: growth turun linear, jadi kelebihan rata-rata hanya setengah dari selisih awal.",
      },
      quiz: [
        {
          q: "H-model: D0 Rp400, gS 12 persen, gL 5 persen, r 11 persen, H 3 tahun. Nilai wajar?",
          options: [
            { text: "Rp7.000 (hanya suku pertama)", why: "Salah: itu nilai bila growth rendah selamanya, mengabaikan premi growth tinggi." },
            { text: "Rp8.400 (7.000 ditambah premi 1.400)", why: "Benar: suku pertama 7.000; premi 400 kali 3 kali 0,07 dibagi 0,06 sama dengan 1.400.", correct: true },
            { text: "Rp9.800", why: "Salah: cek lagi perkalian H dan selisih growth di suku kedua." },
            { text: "Rp6.667", why: "Salah: itu hasil DDM dengan CRP dari PM-A6, bukan H-model." },
          ],
        },
      ],
      reference: "H-model: nilai growth rendah selamanya ditambah premi growth tinggi yang melambat linear. H = separuh transisi.",
    },
    {
      id: "lab-fcfe",
      eyebrow: "Langkah 4 · Lab: FCFE vs FCFF",
      title: "Kas yang benar-benar bisa dibagi ke pemegang saham",
      prose: [
        "DDM hanya bekerja bila perusahaan membagi dividen yang bermakna. Banyak perusahaan bagus tidak membagi dividen, atau membagi sedikit tetapi buyback besar-besaran. FCFE, free cash flow to equity, menjawab pertanyaan yang lebih mendasar: berapa kas yang tersedia untuk pemegang saham setelah semua tagihan dibayar, termasuk belanja modal dan perubahan modal kerja, setelah memperhitungkan utang baru dikurangi pelunasan utang.",
        "Rumus dari laba bersih: FCFE sama dengan laba bersih ditambah depresiasi dikurangi belanja modal dikurangi kenaikan modal kerja ditambah net borrowing. FCFF adalah sepupunya: kas untuk semua penyedia modal, pemegang saham dan pemberi utang, sebelum pembayaran utang. Pilih FCFE bila struktur modal stabil dan kamu memvaluasi ekuitas langsung; pilih FCFF bila struktur modal berubah-ubah atau kamu memvaluasi seluruh perusahaan lalu mengurangi utang.",
        "Contoh ilustratif PT Maju Fiktif: laba bersih Rp900 miliar, depresiasi Rp300 miliar, belanja modal Rp500 miliar, kenaikan modal kerja Rp100 miliar, net borrowing Rp200 miliar. FCFE sama dengan 900 ditambah 300 dikurangi 500 dikurangi 100 ditambah 200 sama dengan Rp800 miliar. Dengan growth FCFE 4 persen dan required return ekuitas 10 persen, nilai ekuitas sama dengan 832 dibagi 0,06 sama dengan Rp13.867 miliar. Dengan 1.000 juta lembar beredar, nilai per saham sekitar Rp13.867. Satu catatan penting: FCFE yang negatif bertahun-tahun bukan otomatis sinyal buruk bila perusahaan sedang berinvestasi, tetapi valuasi FCFE menuntut FCFE yang akhirnya positif dan stabil.",
      ],
      formula: String.raw`\text{FCFE} = NI + \text{Dep} - \text{CapEx} - \Delta WC + \text{Net borrowing} \quad ; \quad V_0 = \frac{\text{FCFE}_1}{r - g}`,
      formulaNote: "Semua angka ilustratif dalam Rp miliar: NI 900, depresiasi 300, CapEx 500, kenaikan modal kerja 100, net borrowing 200. Interpretasi: FCFE adalah kas sisa untuk pemegang saham; V0 mendiskon FCFE tahun depan yang tumbuh 4 persen dengan required return 10 persen. Contoh angka: FCFE 800; FCFE1 832; V0 832 dibagi 0,06 sama dengan 13.866,67; per saham 13.866,67 dikali 1.000 dibagi 1.000 sama dengan Rp13.867.",
      tasks: [
        { id: "t1", text: "Hitung `fcfe` dari laba bersih, depresiasi, CapEx, modal kerja, dan net borrowing" },
        { id: "t2", text: "Hitung `v0` nilai ekuitas (FCFE tumbuh 4%, r 10%) dan `ps` nilai per saham (1.000 juta lembar), cetak ketiganya" },
      ],
      expected: "fcfe=800  v0=13867  ps=13867",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai FCFE untuk memvaluasi perusahaan lalu membandingkannya dengan harga saham tanpa mengurangi utang, atau sebaliknya memakai FCFF lalu lupa mengurangi utang. FCFE langsung memberi nilai ekuitas; FCFF memberi nilai perusahaan.",
      },
      hints: [
        "FCFE = NI ditambah Dep dikurangi CapEx dikurangi kenaikan modal kerja ditambah net borrowing.",
        "FCFE tahun depan = FCFE kali 1,04; V0 = FCFE1 dibagi (0,10 dikurangi 0,04).",
        "fcfe = ni + dep - capex - dwc + netbor\nfcfe1 = fcfe * 1.04\nv0 = fcfe1 / (r - g)\nps = v0 * 1000 / shares",
      ],
      code: {
        starter: `ni, dep, capex, dwc, netbor = 900, 300, 500, 100, 200\ng, r, shares = 0.04, 0.10, 1000\n\n# TULIS KODEMU\nfcfe = \nv0 = \nps = \n\nprint(f"fcfe={fcfe:.0f}  v0={v0:.0f}  ps={ps:.0f}")`,
        lockLines: 2,
        solution: `ni, dep, capex, dwc, netbor = 900, 300, 500, 100, 200\ng, r, shares = 0.04, 0.10, 1000\n\n# TULIS KODEMU\nfcfe = ni + dep - capex - dwc + netbor\nfcfe1 = fcfe * (1 + g)\nv0 = fcfe1 / (r - g)\nps = v0 * 1000 / shares\n\nprint(f"fcfe={fcfe:.0f}  v0={v0:.0f}  ps={ps:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fcfe", value: 800, tol: 1e-9, label: "`fcfe` seharusnya 800", msg: "900 ditambah 300 dikurangi 500 dikurangi 100 ditambah 200 sama dengan 800." },
          { kind: "equal", task: "t2", name: "v0", value: 13866.67, tol: 1, label: "`v0` sekitar 13867", msg: "832 dibagi 0,06 sama dengan 13.866,67 (Rp miliar)." },
          { kind: "equal", task: "t2", name: "ps", value: 13866.67, tol: 1, label: "`ps` sekitar 13867", msg: "Nilai ekuitas 13.866,67 miliar dibagi 1.000 juta lembar sama dengan Rp13.867 per saham." },
          { kind: "stdout_matches", task: "t2", pattern: "fcfe=800\\s+v0=13867\\s+ps=13867", label: "`print` menampilkan ketiganya", msg: "Format: fcfe=...  v0=...  ps=... ." },
        ],
      },
      reference: "FCFE = NI + Dep - CapEx - perubahan modal kerja + net borrowing. FCFE untuk ekuitas langsung; FCFF untuk seluruh perusahaan.",
    },
    {
      id: "kelipatan-wajar",
      eyebrow: "Langkah 5 · Kelipatan Wajar",
      title: "P/E wajar diturunkan dari fundamental, bukan dari tetangga",
      prose: [
        "Kelipatan seperti P/E sering dipakai seolah angka 10 itu murah dan 20 itu mahal. Padahal kelipatan wajar berasal dari fundamental perusahaan: berapa banyak laba yang dibagikan, seberapa cepat laba tumbuh, dan berapa return yang diminta investor. Dari Gordon, P/E wajar sama dengan payout ratio dibagi selisih r dan g. Perusahaan yang membagikan 40 persen labanya, tumbuh 5 persen, dengan required return 10 persen, punya P/E wajar 0,40 dibagi 0,05 sama dengan 8,0. P/E pasar 12 untuk perusahaan seperti itu bukan murah, melainkan mahal.",
        "Rumus sejenis berlaku untuk kelipatan lain. P/BV wajar sama dengan selisih ROE dan g dibagi selisih r dan g: perusahaan dengan ROE 15 persen, growth 5 persen, r 10 persen punya P/BV wajar 0,10 dibagi 0,05 sama dengan 2,0. P/S wajar sama dengan margin bersih dikali payout dibagi selisih r dan g: margin 10 persen dan payout 40 persen memberi 0,10 kali 0,40 dibagi 0,05 sama dengan 0,8. Tiga rumus ini satu keluarga: kelipatan wajar naik bila payout, margin, atau ROE naik, dan turun bila required return naik.",
        "Kekuatan pendekatan ini adalah ia memaksa konsistensi. Kamu tidak bisa mengklaim P/E 15 itu murah tanpa menjelaskan payout, growth, dan required return berapa yang membenarkannya. Kelemahannya sama dengan DDM: semua input adalah asumsi, dan growth serta required return yang kecil perubahannya menggerakkan kelipatan wajar dengan besar. Pakai kelipatan wajar sebagai jangkar, bukan sebagai vonis.",
      ],
      formula: String.raw`\frac{P}{E}_{\text{wajar}} = \frac{\text{payout}}{r - g} \quad ; \quad \frac{P}{BV}_{\text{wajar}} = \frac{ROE - g}{r - g} \quad ; \quad \frac{P}{S}_{\text{wajar}} = \frac{\text{margin} \times \text{payout}}{r - g}`,
      formulaNote: "Semua angka ilustratif: payout 40 persen, growth 5 persen, r 10 persen, ROE 15 persen, margin bersih 10 persen. Interpretasi: kelipatan wajar naik bila payout, margin, atau ROE naik, dan turun bila required return naik. Contoh angka: P/E wajar 0,40 dibagi 0,05 sama dengan 8,0; P/BV wajar 0,10 dibagi 0,05 sama dengan 2,0; P/S wajar 0,10 kali 0,40 dibagi 0,05 sama dengan 0,8.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kelipatan wajar memakai input yang sama sensitifnya dengan DDM. Satu poin growth mengubah P/E wajar 20 persen lebih. Selalu uji sensitivitas sebelum memutuskan murah atau mahal.",
      },
      quiz: [
        {
          q: "Perusahaan fiktif: payout 40 persen, growth 5 persen, required return 10 persen. P/E wajar dan artinya bila P/E pasar 12?",
          options: [
            { text: "P/E wajar 8,0 — pasar 12 berarti mahal relatif terhadap fundamentalnya", why: "Benar: 0,40 dibagi 0,05 sama dengan 8,0. Pasar membayar lebih dari yang dibenarkan payout dan growth-nya.", correct: true },
            { text: "P/E wajar 12,0 — pasar sudah wajar", why: "Salah: 0,40 dibagi 0,05 sama dengan 8,0, bukan 12." },
            { text: "P/E wajar 4,0 — pasar sangat mahal", why: "Salah: hitung ulang 0,40 dibagi 0,05." },
            { text: "P/E wajar tidak bisa dihitung dari payout", why: "Salah: rumus justified P/E justru diturunkan dari payout, growth, dan required return." },
          ],
        },
      ],
      reference: "P/E wajar = payout dibagi (r dikurangi g). P/BV wajar = (ROE dikurangi g) dibagi (r dikurangi g). P/S wajar = margin kali payout dibagi (r dikurangi g).",
    },
    {
      id: "jebakan-multiple",
      eyebrow: "Langkah 6 · Jebakan Multiple",
      title: "Tiga cara P/E menipumu tanpa berbohong",
      prose: [
        "Jebakan pertama: trailing versus forward. Trailing P/E memakai laba 12 bulan terakhir yang sudah pasti; forward P/E memakai laba perkiraan tahun depan yang bisa meleset. Saham dengan trailing P/E 20 dan forward P/E 10 terlihat murah secara forward, tetapi hanya bila perkiraan laba yang naik dua kali lipat itu benar-benar terjadi. Analis yang optimistis membuat forward P/E terlihat murah untuk semua saham. Aturan praktis: bandingkan trailing dengan trailing, forward dengan forward, dan tanyakan siapa yang membuat perkiraan itu.",
        "Jebakan kedua: outlier dan laba negatif. Rata-rata P/E industri menjadi tidak bermakna bila satu perusahaan merugi: P/E negatif tidak bisa dirata-rata dengan P/E positif. Perusahaan dengan laba hampir nol punya P/E ratusan, dan satu outlier seperti itu menarik rata-rata industri ke atas. Praktik yang benar: pakai median, bukan rata-rata, dan keluarkan perusahaan berlaba negatif dari perbandingan, atau pakai kelipatan lain seperti EV terhadap penjualan.",
        "Jebakan ketiga: perbedaan akuntansi. Dua perusahaan dengan bisnis sama bisa punya P/E berbeda hanya karena pilihan akuntansi: depresiasi dipercepat menekan laba dan menaikkan P/E; kapitalisasi biaya versus membebankannya langsung mengubah laba tahun berjalan; standar akuntansi berbeda antar negara mengubah definisi laba itu sendiri. PM-A6 sudah mengingatkan soal laba puncak siklikal dan NPL tersembunyi: multiple hanya screening awal, keputusan memakai DCF ternormalisasi yang dipasangkan dengan bedah laporan keuangan. Rujuk silang ke FSA Lab bila kamu ingin membedah kualitas laba sampai ke sumbernya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Merata-rata P/E yang mencakup perusahaan berlaba negatif, atau membandingkan trailing P/E satu saham dengan forward P/E saham lain. Multiple hanya bisa dibandingkan bila definisi labanya sama.",
      },
      quiz: [
        {
          q: "Rata-rata P/E sebuah industri tampak 35 karena satu perusahaan berlaba nyaris nol punya P/E 400. Perbandingan yang benar?",
          options: [
            { text: "Tetap pakai rata-rata 35 — itu data apa adanya", why: "Salah: satu outlier menarik rata-rata dan membuat seluruh industri terlihat mahal." },
            { text: "Pakai median dan keluarkan perusahaan berlaba negatif atau nyaris nol", why: "Benar: median tahan terhadap outlier; laba negatif membuat P/E tidak bermakna.", correct: true },
            { text: "Pakai P/E tertinggi sebagai patokan", why: "Salah: itu justru memakai outlier sebagai standar." },
            { text: "Buang semua perusahaan dengan P/E di atas 10", why: "Salah: membuang data secara arbitrer sama buruknya dengan memakai outlier." },
          ],
        },
      ],
      reference: "Trailing = laba pasti; forward = laba perkiraan. Median tahan outlier; P/E negatif tidak bermakna. Samakan definisi laba sebelum membandingkan.",
    },
    {
      id: "vignette-dua-saham",
      eyebrow: "Langkah 7 · Vignette",
      title: "P/E sama, valuasi beda: pilih yang mana",
      prose: [
        "Dua saham fiktif (ilustratif), PT Delta dan PT Epsilon, sama-sama diperdagangkan pada P/E 12. Seorang screener sederhana akan berkata keduanya sama murahnya. Fundamental mereka berkata lain. Delta: ROE 18 persen, payout 30 persen, growth 6 persen, required return 10 persen. Epsilon: ROE 12 persen, payout 60 persen, growth 4 persen, required return 9 persen.",
        "Hitung P/E wajar masing-masing. Delta: 0,30 dibagi selisih 0,10 dan 0,06 sama dengan 7,5. Pasar membayar 12 untuk perusahaan yang fundamentalnya hanya membenarkan 7,5: Delta mahal sekitar 60 persen di atas nilai wajarnya. Epsilon: 0,60 dibagi selisih 0,09 dan 0,04 sama dengan 12,0. Pasar membayar tepat nilai wajarnya. P/E yang sama menyembunyikan dua vonis berlawanan: Delta overvalued, Epsilon fairly valued.",
        "P/BV wajar memperkuat cerita. Delta: selisih ROE 18 persen dan growth 6 persen dibagi selisih r 10 persen dan growth 6 persen sama dengan 3,0. Epsilon: selisih 12 persen dan 4 persen dibagi selisih 9 persen dan 4 persen sama dengan 1,6. Delta memang perusahaan lebih bagus: ROE lebih tinggi, growth lebih tinggi. Tetapi bagus bukan berarti murah: harga sudah membayar lebih dari kebagusannya. Pelajaran vignette ini: jangan pernah membeli P/E, belilah fundamental dengan harga di bawah nilai wajarnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perusahaan bagus yang overvalued tetap bisa rugi besar: Delta yang dibeli di P/E 12 harus tumbuh sesuai janji hanya untuk mempertahankan harga. Kekecewaan growth kecil saja memotong valuasi dua arah: laba turun dan kelipatan menyusut.",
      },
      quiz: [
        {
          q: "Delta dan Epsilon sama-sama P/E 12 (ilustratif). Delta: payout 30 persen, g 6 persen, r 10 persen. Epsilon: payout 60 persen, g 4 persen, r 9 persen. Keputusanmu?",
          options: [
            { text: "Beli Delta — ROE 18 persen lebih tinggi dari Epsilon", why: "Salah: ROE tinggi tidak membenarkan harga berapa pun. P/E wajar Delta hanya 7,5, jadi pasar 12 berarti mahal." },
            { text: "Beli Epsilon — P/E wajarnya 12,0, tepat di harga pasar; Delta overvalued", why: "Benar: Delta 0,30 dibagi 0,04 sama dengan 7,5; Epsilon 0,60 dibagi 0,05 sama dengan 12,0.", correct: true },
            { text: "Beli keduanya — P/E sama berarti valuasi sama", why: "Salah: P/E sama menyembunyikan fundamental berbeda; valuasi wajarnya 7,5 versus 12,0." },
            { text: "Jual keduanya — P/E 12 selalu mahal", why: "Salah: mahal atau murah ditentukan fundamental, bukan angka P/E absolut." },
          ],
        },
      ],
      reference: "P/E sama bukan valuasi sama. Hitung P/E wajar dari payout, growth, dan required return sebelum memutuskan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: DDM dua tahap, H-model, FCFE, kelipatan wajar, dan vignette dua saham.",
      ],
      tasks: [],
      quiz: [
        {
          q: "DDM dua tahap: D0 Rp400, growth 12 persen 3 tahun, lalu 5 persen, r 11 persen. Nilai wajar sekitar?",
          options: [
            { text: "Rp7.000", why: "Salah: itu Gordon dengan growth 5 persen sejak awal, mengabaikan tiga tahun growth tinggi." },
            { text: "Rp8.413", why: "Benar: nilai kini dividen 1.222 ditambah nilai kini terminal value 7.191.", correct: true },
            { text: "Rp9.835", why: "Salah: itu P3, nilai terminal di akhir tahun 3, yang belum didiskon ke hari ini." },
            { text: "Rp10.000", why: "Salah: itu hasil Gordon tanpa country risk premium dari PM-A6." },
          ],
        },
        {
          q: "Kapan memakai FCFE, bukan DDM Gordon?",
          options: [
            { text: "Selalu — FCFE menggantikan DDM dalam semua kasus", why: "Salah: DDM tetap paling langsung bila dividen stabil dan bermakna." },
            { text: "Bila perusahaan tidak membagi dividen atau buyback-nya besar, sehingga dividen bukan ukuran kas ke pemegang saham", why: "Benar: FCFE mengukur kas yang benar-benar tersedia untuk pemegang saham.", correct: true },
            { text: "Hanya bila perusahaan merugi", why: "Salah: perusahaan merugi justru membuat FCFE sulit dipakai karena FCFE negatif." },
            { text: "Tidak pernah — DDM selalu cukup", why: "Salah: DDM gagal untuk perusahaan nir-dividen." },
          ],
        },
        {
          q: "FCFE (ilustratif): NI 900, depresiasi 300, CapEx 500, kenaikan modal kerja 100, net borrowing 200. FCFE?",
          options: [
            { text: "Rp600 miliar", why: "Salah: cek tanda net borrowing, ia menambah FCFE." },
            { text: "Rp800 miliar", why: "Benar: 900 ditambah 300 dikurangi 500 dikurangi 100 ditambah 200.", correct: true },
            { text: "Rp1.000 miliar", why: "Salah: kenaikan modal kerja mengurangi kas, bukan menambah." },
            { text: "Rp1.200 miliar", why: "Salah: itu NI ditambah depresiasi saja, tanpa CapEx dan modal kerja." },
          ],
        },
        {
          q: "Payout 40 persen, growth 5 persen, r 10 persen. P/E wajar?",
          options: [
            { text: "8,0", why: "Benar: 0,40 dibagi 0,05 sama dengan 8,0.", correct: true },
            { text: "12,0", why: "Salah: itu P/E pasar Epsilon di vignette, bukan hasil rumus ini." },
            { text: "4,0", why: "Salah: hitung ulang 0,40 dibagi selisih 0,10 dan 0,05." },
            { text: "20,0", why: "Salah: itu 1 dibagi 0,05, memakai payout 100 persen." },
          ],
        },
        {
          q: "Dua saham sama-sama P/E 12. Saham A punya P/E wajar 7,5; saham B punya P/E wajar 12,0. Kesimpulan?",
          options: [
            { text: "Keduanya sama menarik — P/E-nya sama", why: "Salah: P/E pasar sama, tetapi nilai wajarnya berbeda jauh." },
            { text: "A overvalued, B fairly valued — pilih B bila harus memilih", why: "Benar: A diperdagangkan 60 persen di atas nilai wajarnya; B tepat di nilai wajar.", correct: true },
            { text: "A lebih menarik karena ROE-nya lebih tinggi", why: "Salah: ROE tinggi sudah tercermin di P/E wajar 7,5, dan pasar membayar di atasnya." },
            { text: "Tidak bisa dinilai tanpa harga penutupan kemarin", why: "Salah: valuasi wajar dihitung dari fundamental, bukan dari harga kemarin." },
          ],
        },
      ],
      summary: [
        "Gordon gagal saat growth tidak konstan; multi-stage membagi masa depan per fase lalu tutup dengan terminal value.",
        "H-model: growth melambat linear; H adalah separuh periode transisi.",
        "FCFE = NI + Dep - CapEx - perubahan modal kerja + net borrowing; pakai FCFE bila dividen tidak mencerminkan kas ke pemegang saham.",
        "Kelipatan wajar dari fundamental: P/E = payout dibagi (r dikurangi g); P/BV = (ROE dikurangi g) dibagi (r dikurangi g); P/S = margin kali payout dibagi (r dikurangi g).",
        "P/E sama bukan valuasi sama: bandingkan P/E pasar dengan P/E wajar masing-masing saham.",
      ],
      next: { label: "PM-A6C — Equity: Analisis Industri & Keunggulan Kompetitif", href: "/v2/learn/pm-a6c-analisis-industri" },
    },
  ],
};
