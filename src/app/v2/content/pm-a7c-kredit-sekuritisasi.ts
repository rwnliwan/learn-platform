import type { V2Lesson } from "../lib/types";

export const pma7c: V2Lesson = {
  slug: "pm-a7c-kredit-sekuritisasi",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A7C Fixed Income: Analisis Kredit & Sekuritisasi",
  estMinutes: 60,
  steps: [
    {
      id: "spread-vs-oas",
      eyebrow: "Langkah 1 · Spread vs OAS",
      title: "Credit spread vs OAS: harga risiko setelah opsi dibersihkan",
      prose: [
        "PM-A7 mengajarkan spread sebagai harga risiko kredit: YTM obligasi dikurangi yield pemerintah setenor. Lesson ini memperdalam: spread mentah itu mencampur dua hal — kompensasi risiko kredit dan kompensasi opsi yang tertanam. Obligasi callable punya spread yang terlihat gemuk, tetapi sebagian spread itu bukan hadiah untuk risiko kredit — melainkan bayaran untuk opsi call yang kamu jual ke emiten.",
        "Option-adjusted spread (OAS) membersihkan campuran itu: ia mengukur spread setelah nilai opsi dikeluarkan dari harga. Intuisinya sederhana — bandingkan obligasi callable dengan obligasi polos yang identik; selisih harga keduanya adalah nilai opsi, dan OAS adalah spread yang tersisa setelah opsi itu diperhitungkan. Dua obligasi dengan credit spread sama tetapi OAS berbeda sedang dihargai pasar secara berbeda: yang OAS-nya lebih tinggi memberi kompensasi kredit yang lebih besar untuk risiko yang sama.",
        "Aturan praktisnya: untuk obligasi polos, credit spread dan OAS hampir sama — tidak ada opsi yang perlu dibersihkan. Untuk obligasi callable, putable, atau MBS, bandingkan OAS, bukan spread mentah — spread mentah akan membuat obligasi callable terlihat murah padahal ia hanya membayar opsi. Analis yang membandingkan spread mentah antar obligasi beropsi sedang membandingkan apel dengan apel yang sudah digigit.",
      ],
      formula: String.raw`\text{Spread} = YTM - y_{\text{pemerintah}} \quad;\quad \text{OAS} = \text{spread setelah nilai opsi dikeluarkan}`,
      formulaNote: "Spread = selisih YTM obligasi dengan yield pemerintah setenor; OAS = spread yang sama setelah dikurangi nilai opsi tertanam (call, put, atau prepayment). Interpretasi: OAS adalah harga risiko kredit yang bersih — dua obligasi dengan OAS sama memberi kompensasi kredit yang sama, apa pun opsinya.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membeli obligasi callable karena spread-nya paling lebar di layar. Sebagian spread itu adalah bayaran opsi call — bandingkan OAS, dan tanyakan berapa spread yang tersisa setelah opsi dibersihkan.",
      },
      quiz: [
        {
          q: "Dua obligasi korporasi tenor sama: A polos dengan spread 200bp, B callable dengan spread 280bp dan OAS 190bp. Mana yang memberi kompensasi risiko kredit lebih besar?",
          options: [
            { text: "B — spread 280bp paling lebar", why: "Salah: 90bp dari spread B adalah bayaran opsi call, bukan kompensasi kredit." },
            { text: "A — OAS B hanya 190bp, di bawah spread A 200bp", why: "Benar: setelah opsi dibersihkan, B memberi kompensasi kredit 190bp — lebih kecil dari A 200bp. Spread mentah menipu.", correct: true },
            { text: "Sama — tenornya sama", why: "Salah: tenor sama tidak berarti kompensasi kredit sama — opsi mengubah segalanya." },
            { text: "Tidak bisa dinilai tanpa rating", why: "Salah: OAS justru memberi alat membandingkannya — rating bukan satu-satunya informasi." },
          ],
        },
      ],
      reference: "Spread mentah mencampur risiko kredit dan nilai opsi. OAS = spread bersih. Obligasi beropsi: bandingkan OAS.",
    },
    {
      id: "analisis-kredit-4c",
      eyebrow: "Langkah 2 · Lab: Analisis Kredit 4C",
      title: "4C dan dua rasio yang menentukan hidup-mati emiten",
      prose: [
        "Analisis kredit punya kerangka klasik: 4C — Character (integritas dan rekam jejak manajemen: apakah mereka membayar saat sulit, atau menunda dan berdalih?), Capacity (kemampuan menghasilkan kas untuk membayar: inilah yang diukur rasio), Collateral (jaminan yang bisa dijual bila semuanya gagal), dan Covenants (janji kontraktual yang membatasi emiten: batas utang baru, batas dividen, kewajiban rasio). Character dan covenants adalah kualitatif; capacity adalah kuantitatif — dan di situlah rasio bekerja.",
        "Dua rasio kunci. Pertama, leverage: utang dibagi EBITDA — berapa tahun laba operasional yang dibutuhkan untuk melunasi seluruh utang. Kedua, interest coverage: EBIT dibagi beban bunga — berapa kali laba operasi menutupi bunga yang harus dibayar. Contoh ilustratif — emiten fiktif PT Fiktif Sejahtera: EBITDA 120, utang 360, EBIT 90, beban bunga 30, kas 40 (semua dalam miliar rupiah, ilustratif). Leverage = 360 dibagi 120 = 3,0 kali; coverage = 90 dibagi 30 = 3,0 kali; net leverage = (360 dikurangi 40) dibagi 120 = 2,67 kali.",
        "Membaca angkanya: leverage 3,0 kali berarti emiten butuh tiga tahun laba operasional penuh untuk melunasi utang — wajar untuk perusahaan mapan, waspada untuk perusahaan siklikal. Coverage 3,0 kali berarti laba operasi tiga kali beban bunga — ada bantalan, tetapi satu tahun buruk (EBIT turun sepertiga) sudah membuat coverage mendekati 2,0 kali. Rasio tidak pernah berdiri sendiri: bandingkan dengan emiten sejenis, lihat tren tiga tahun, dan tanyakan apa yang terjadi bila EBITDA turun 30 persen — itulah stress test yang memisahkan analis dari pembaca laporan.",
      ],
      formula: String.raw`\text{Leverage} = \frac{\text{Utang}}{\text{EBITDA}} \quad;\quad \text{Coverage} = \frac{\text{EBIT}}{\text{Beban bunga}}`,
      formulaNote: "Leverage = utang dibagi EBITDA (tahun laba untuk melunasi utang); coverage = EBIT dibagi beban bunga (berapa kali laba menutupi bunga). Contoh angka (ilustratif, PT Fiktif Sejahtera, miliar rupiah): leverage = 360 / 120 = 3,0 kali; coverage = 90 / 30 = 3,0 kali; net leverage = (360 − 40) / 120 = 2,67 kali.",
      tasks: [
        { id: "t1", text: "Hitung `leverage` = utang dibagi EBITDA (utang 360, EBITDA 120)" },
        { id: "t2", text: "Hitung `coverage` = EBIT dibagi beban bunga (EBIT 90, bunga 30) dan `net_lev` = (utang dikurangi kas) dibagi EBITDA (kas 40), cetak ketiganya" },
      ],
      expected: "leverage=3.00  coverage=3.00  net_lev=2.67",
      hints: [
        "Leverage = 360 dibagi 120.",
        "Coverage = 90 dibagi 30; net leverage memakai utang dikurangi kas 40.",
        "leverage = 360 / 120\ncoverage = 90 / 30\nnet_lev = (360 - 40) / 120",
      ],
      code: {
        starter: `utang, ebitda, ebit, bunga, kas = 360, 120, 90, 30, 40\n\n# TULIS KODEMU (PT Fiktif Sejahtera — ilustratif, miliar rupiah)\nleverage = \ncoverage = \nnet_lev = \n\nprint(f"leverage={leverage:.2f}  coverage={coverage:.2f}  net_lev={net_lev:.2f}")`,
        lockLines: 1,
        solution: `utang, ebitda, ebit, bunga, kas = 360, 120, 90, 30, 40\n\n# TULIS KODEMU (PT Fiktif Sejahtera — ilustratif, miliar rupiah)\nleverage = utang / ebitda\ncoverage = ebit / bunga\nnet_lev = (utang - kas) / ebitda\n\nprint(f"leverage={leverage:.2f}  coverage={coverage:.2f}  net_lev={net_lev:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "leverage", value: 3.0, tol: 1e-9, label: "`leverage` seharusnya 3.0", msg: "360 dibagi 120 = 3,0 kali — tiga tahun laba untuk melunasi utang." },
          { kind: "equal", task: "t2", name: "coverage", value: 3.0, tol: 1e-9, label: "`coverage` seharusnya 3.0", msg: "90 dibagi 30 = 3,0 kali — laba tiga kali beban bunga." },
          { kind: "equal", task: "t2", name: "net_lev", value: 2.67, tol: 0.01, label: "`net_lev` sekitar 2.67", msg: "(360 dikurangi 40) dibagi 120 = 2,67 kali." },
          { kind: "stdout_matches", task: "t2", pattern: "leverage=3\\.00\\s+coverage=3\\.00\\s+net_lev=2\\.67", label: "`print` menampilkan ketiganya", msg: "Format: leverage=...  coverage=...  net_lev=... ." },
        ],
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menilai rasio dari satu tahun saja. Leverage 3,0 kali bisa berarti perusahaan sehat yang baru ekspansi — atau perusahaan sekarat yang EBITDA-nya tinggal sepertiga. Selalu lihat tren tiga tahun dan bandingkan dengan emiten sejenis.",
      },
      reference: "4C: Character, Capacity, Collateral, Covenants. Leverage = utang/EBITDA. Coverage = EBIT/bunga. Stress test: EBITDA turun 30 persen, apa yang terjadi?",
    },
    {
      id: "cds-asuransi",
      eyebrow: "Langkah 3 · CDS",
      title: "CDS: asuransi gagal bayar — dan cara pasar memberi harga ketakutan",
      prose: [
        "Credit default swap (CDS) adalah kontrak asuransi atas gagal bayar. Pembeli proteksi membayar premi tahunan — disebut spread CDS, dalam basis poin dari nilai notional — dan penjual proteksi berjanji membayar bila emiten gagal bayar. Bila tidak ada gagal bayar, penjual mengantongi premi; bila ada gagal bayar, penjual membayar selisih antara nilai notional dan nilai pemulihan obligasi (recovery). Intuisi payoff-nya persis asuransi rumah: premi kecil yang rutin, pembayaran besar yang jarang.",
        "Contoh ilustratif: notional 10 miliar rupiah, spread CDS 200bp. Premi tahunan = 2 persen dikali 10 miliar = 200 juta rupiah per tahun. Bila emiten gagal bayar dengan tingkat pemulihan (recovery) 40 persen — artinya LGD 60 persen — penjual proteksi membayar 60 persen dikali 10 miliar = 6 miliar rupiah. Pembeli proteksi menukar 200 juta per tahun dengan perlindungan 6 miliar saat bencana: rasio 1 banding 30, dan itulah mengapa CDS terasa murah sampai bencana datang, lalu terasa sangat mahal sesudahnya.",
        "Dua hal yang membuat CDS penting bagi analis. Pertama, spread CDS adalah harga ketakutan yang diperdagangkan setiap hari — ia bergerak lebih cepat dari rating, dan melebarnya spread CDS sering mendahului downgrade berminggu-minggu. Kedua, CDS memisahkan risiko kredit dari obligasi itu sendiri: investor bisa membeli proteksi tanpa memiliki obligasinya (naked CDS), yang berarti pasar CDS bisa memberi sinyal tentang emiten yang obligasinya tidak likuid. Peringatan: penjual proteksi juga bisa gagal — risiko counterparty — sehingga asuransi gagal bayar pun butuh asuransi atas penjualnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Spread CDS yang melebar tajam adalah alarm dini — tetapi cek dulu apakah pelebarannya karena risiko emiten atau karena likuiditas pasar CDS itu sendiri yang mengering. Alarm yang salah tetap lebih baik daripada tidak ada alarm.",
      },
      quiz: [
        {
          q: "CDS notional 10 miliar rupiah, spread 200bp, recovery 40 persen (ilustratif). Premi tahunan dan pembayaran saat default?",
          options: [
            { text: "Premi 200 juta per tahun; bayar 6 miliar saat default", why: "Benar: premi = 2 persen dikali 10 miliar = 200 juta; bayar = LGD 60 persen dikali 10 miliar = 6 miliar.", correct: true },
            { text: "Premi 6 miliar per tahun; bayar 200 juta saat default", why: "Salah: tertukar — premi adalah yang kecil dan rutin, pembayaran adalah yang besar dan jarang." },
            { text: "Premi 200 juta; bayar 10 miliar penuh saat default", why: "Salah: pembayaran dikurangi recovery — penjual membayar 10 miliar dikurangi nilai obligasi yang dipulihkan (4 miliar) = 6 miliar." },
            { text: "Premi 20 juta; bayar 600 juta saat default", why: "Salah: hitung ulang — 200bp dari 10 miliar adalah 200 juta, bukan 20 juta." },
          ],
        },
      ],
      reference: "CDS = asuransi gagal bayar. Premi = spread dikali notional. Bayar saat default = LGD dikali notional. Spread CDS = harga ketakutan harian.",
    },
    {
      id: "mbs-prepayment",
      eyebrow: "Langkah 4 · MBS",
      title: "MBS: risiko prepayment — extension vs contraction",
      prose: [
        "Mortgage-backed security (MBS) adalah sekuritisasi dari kumpulan kredit pemilikan rumah. Pemegang MBS menerima arus kas dari cicilan para debitur — dan debitur punya hak melunasi lebih cepat (prepayment) kapan saja, biasanya dengan refinancing saat suku bunga turun. Hak inilah yang membuat MBS berbeda dari obligasi korporasi biasa: arus kasnya tidak pasti, dan ketidakpastiannya bergerak berlawanan dengan keinginanmu.",
        "Contraction risk terjadi saat suku bunga turun: debitur refinancing massal, pokok kembali lebih cepat dari perkiraan, dan kamu terpaksa menginvestasikan kembali uang itu pada yield yang lebih rendah — persis saat kamu paling ingin mempertahankan yield lama. Extension risk adalah kebalikannya: saat suku bunga naik, tidak ada yang refinancing, pokok kembali lebih lambat dari perkiraan, dan duration MBS-mu memanjang tepat saat harga obligasi jatuh. MBS menghukummu di kedua arah — itulah negative convexity dalam bentuk paling konkret.",
        "Pasar mengukur kecepatan prepayment dengan PSA (Public Securities Association): PSA 100 berarti kecepatan prepayment mencapai 6 persen CPR (conditional prepayment rate) setelah 30 bulan — naik bertahap 0,2 persen per bulan dari nol. PSA 200 berarti dua kali lebih cepat: 12 persen CPR pada bulan ke-30. PSA bukan ramalan — ia adalah bahasa. Saat analis berkata MBS ini di harga PSA 150, ia berkata: kami mengasumsikan debitur melunasi 1,5 kali lebih cepat dari benchmark. Tugasmu: tanyakan apakah asumsi itu masuk akal pada level suku bunga hari ini.",
      ],
      formula: String.raw`\text{PSA 100} \Rightarrow \text{CPR 6\% di bulan ke-30} \quad;\quad \text{PSA 200} \Rightarrow \text{CPR 12\%}`,
      formulaNote: "PSA = benchmark kecepatan prepayment; CPR = persentase tahunan pokok yang dilunasi lebih cepat. Interpretasi: PSA 100 mencapai CPR 6 persen setelah 30 bulan; PSA 200 dua kali lebih cepat, 12 persen. Suku bunga turun → PSA naik (contraction); suku bunga naik → PSA turun (extension).",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira MBS dengan yield lebih tinggi dari obligasi pemerintah adalah hadiah gratis. Yield itu membayar negative convexity: pokok kembali cepat saat kamu tidak mau, lambat saat kamu butuh. Bandingkan OAS, bukan yield mentah.",
      },
      quiz: [
        {
          q: "Suku bunga turun tajam. Apa yang terjadi pada MBS dan pemegangnya?",
          options: [
            { text: "Contraction risk: prepayment melonjak, pokok kembali cepat, reinvestasi pada yield lebih rendah", why: "Benar: debitur refinancing massal — uang kembali tepat saat yield sudah turun.", correct: true },
            { text: "Extension risk: pokok kembali lebih lambat", why: "Salah: itu yang terjadi saat suku bunga naik, bukan turun." },
            { text: "Tidak ada efek — arus kas MBS tetap", why: "Salah: arus kas MBS justru tidak tetap — prepayment adalah hak debitur yang aktif saat bunga turun." },
            { text: "Pemegang untung besar seperti obligasi biasa", why: "Salah: obligasi biasa naik penuh saat yield turun; MBS tertahan karena pokok dilunasi di harga par." },
          ],
        },
      ],
      reference: "Bunga turun = contraction (uang kembali cepat, reinvestasi murah). Bunga naik = extension (uang kembali lambat, duration memanjang). PSA = bahasa kecepatan prepayment.",
    },
    {
      id: "cdo-tranche",
      eyebrow: "Langkah 5 · CDO",
      title: "CDO: dari waterfall ke attachment dan detachment",
      prose: [
        "PM-A7 memperkenalkan waterfall sekuritisasi: kerugian dimakan dari bawah, equity dulu, senior terakhir. Lesson ini memberi bahasa presisinya: attachment point dan detachment point. Setiap tranche didefinisikan oleh dua angka — attachment adalah level kerugian kumulatif saat tranche mulai menanggung rugi, detachment adalah level saat tranche habis sepenuhnya. Di antara keduanya, tranche menanggung setiap rupiah kerugian tambahan.",
        "Contoh ilustratif — pool 100 miliar rupiah: equity 0 sampai 5 persen (attachment 0, detachment 5), mezzanine 5 sampai 15 persen, senior 15 sampai 100 persen. Kerugian 3 miliar: equity tersisa 2, mezzanine utuh 10, senior utuh 85. Kerugian 8 miliar: equity habis, mezzanine tersisa 7, senior utuh 85. Kerugian 20 miliar: equity dan mezzanine habis, senior tersisa 80. Senior baru mulai berdarah pada kerugian di atas 15 miliar — attachment-nya adalah pelindung, detachment-nya adalah akhir.",
        "Bahasa ini penting karena rating dan harga tranche ditentukan oleh jarak antara perkiraan kerugian dan attachment point. Tranche senior dengan attachment 15 persen pada pool yang perkiraan kerugiannya 3 persen terlihat sangat aman — sampai korelasi antar debitur melonjak dan kerugian yang tadinya tersebar menjadi serentak. Pelajaran 2008: attachment point melindungi dari kerugian yang tersebar, bukan dari kerugian yang berkorelasi. Saat semua debitur gagal bersamaan, waterfall tidak lagi bertingkat — ia runtuh sekaligus.",
      ],
      formula: String.raw`\text{Tranche menanggung rugi bila } L > \text{attachment} \quad;\quad \text{habis bila } L \geq \text{detachment}`,
      formulaNote: "L = kerugian kumulatif pool; attachment = level kerugian saat tranche mulai rugi; detachment = level saat tranche habis. Contoh angka (ilustratif, pool 100 miliar): kerugian 8 → equity (0–5) habis, mezzanine (5–15) tersisa 7, senior (15–100) utuh 85; kerugian 20 → senior tersisa 80.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Attachment point yang tinggi bukan jaminan — ia berasumsi kerugian tersebar. Bila korelasi antar debitur tinggi (satu sektor, satu wilayah), kerugian menjadi serentak dan attachment jebol lebih cepat dari model.",
      },
      quiz: [
        {
          q: "Pool 100 miliar: equity 0–5, mezzanine 5–15, senior 15–100 (ilustratif). Kerugian 20 miliar. Siapa tersisa berapa?",
          options: [
            { text: "Equity 0, mezzanine 0, senior 80", why: "Benar: kerugian 20 melahap equity 5 + mezzanine 10 + senior 5 → senior tersisa 80 (notional senior 85 dikurangi 5).", correct: true },
            { text: "Equity 0, mezzanine 7, senior 85", why: "Salah: itu hasil kerugian 8 miliar, bukan 20 miliar." },
            { text: "Dibagi rata: masing-masing rugi sepertiga", why: "Salah: waterfall tidak membagi rata — ada attachment dan detachment per tranche." },
            { text: "Senior habis, equity utuh", why: "Salah: terbalik — kerugian dimakan dari bawah, equity dulu, senior terakhir." },
          ],
        },
      ],
      reference: "Attachment = mulai berdarah. Detachment = habis. Senior aman hanya selama kerugian di bawah attachment — dan korelasi bisa menjebolnya.",
    },
    {
      id: "vignette-downgrade",
      eyebrow: "Langkah 6 · Vignette",
      title: "Downgrade satu notch: apa yang berubah di harga dan covenant",
      prose: [
        "Vignette: PT Fiktif Sejahtera — emiten ilustratif dari Langkah 2 — baru saja di-downgrade satu notch, dari BBB menjadi BBB-minus. Tidak ada gagal bayar, tidak ada berita fraud, hanya leverage yang merangkak naik dan coverage yang menipis. Apa yang berubah? Pertama, harga: spread melebar. Misalkan spread melebar 150 basis poin — pada obligasi 5 tahun kupon 6 persen dengan modified duration 4,21, harga jatuh sekitar 6,30 persen secara linear (4,21 dikali 1,5 persen), dari 100 menjadi sekitar 93,70; harga eksak dari rumus PV pada yield 7,5 persen adalah 93,93. Obligasi yang kemarin par, hari ini diskon — tanpa satu rupiah pun arus kas yang berubah.",
        "Kedua, covenant: downgrade sering memicu klausul kontraktual. Step-up coupon menaikkan kupon yang harus dibayar emiten — memperbaiki return pemegang obligasi tetapi memperberat beban emiten yang sudah melemah. Negative pledge dan batas utang baru membatasi ruang gerak manajemen. Dan yang paling mahal: banyak investor institusional hanya boleh memegang investment grade — downgrade dari BBB-minus ke BB (junk) memicu forced selling, bukan karena analisis, melainkan karena mandat. Inilah cliff effect: satu notch di perbatasan investment grade lebih mahal dari tiga notch di tengah kategori.",
        "Ketiga, yang tidak berubah: arus kas kontraktual emiten — kupon dan principal yang dijanjikan tetap sama. Yang berubah adalah harga yang bersedia dibayar pasar untuk janji itu, karena probabilitas janji itu ditepati dinilai lebih rendah. Pelajaran vignette: downgrade bukan peristiwa akuntansi — ia adalah repricing risiko yang menjalar ke harga, covenant, dan basis investor sekaligus. Analis yang hanya menonton harga kehilangan dua pertiga cerita.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Cliff effect: downgrade dari BBB-minus ke BB memicu forced selling oleh investor yang mandatnya investment grade saja. Satu notch di perbatasan lebih mahal dari tiga notch di tengah kategori — pantau emiten di batas kategori dengan ekstra waspada.",
      },
      quiz: [
        {
          q: "Obligasi 5 tahun kupon 6 persen, harga 100, D_mod 4,21 (ilustratif). Downgrade membuat spread melebar 150bp. Estimasi harga baru?",
          options: [
            { text: "Sekitar 93,70 (linear) — harga eksak 93,93", why: "Benar: −4,21 dikali 1,5 persen = −6,30 persen → 93,70 linear; harga eksak PV pada yield 7,5 persen = 93,93.", correct: true },
            { text: "Tetap 100 — arus kas tidak berubah", why: "Salah: harga = PV pada yield kini; yield naik 150bp karena spread melebar, harga jatuh meski kupon tetap." },
            { text: "Sekitar 106,30 — downgrade menaikkan harga", why: "Salah: arah terbalik — risiko naik berarti harga turun." },
            { text: "Sekitar 85,00 — jatuh 15 persen", why: "Salah: hitung ulang — 4,21 dikali 1,5 persen = 6,30 persen, bukan 15 persen." },
          ],
        },
      ],
      reference: "Downgrade = repricing: harga jatuh (spread melebar), covenant bisa memicu step-up, basis investor menyusut. Cliff effect di batas investment grade.",
    },
    {
      id: "peta-keputusan-kredit",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: dari spread ke vonis kredit",
      prose: [
        "Skenario 1 — Spread obligasi terlihat lebar. → Bedah: berapa OAS-nya setelah opsi dibersihkan, dan berapa expected loss (PD dikali LGD)? Spread di atas expected loss adalah premi — tanyakan premi untuk risiko apa: default, likuiditas, atau opsi.",
        "Skenario 2 — Menilai emiten baru. → Jalankan 4C: character dari rekam jejak, capacity dari leverage dan coverage (plus stress test EBITDA turun 30 persen), collateral dari jaminan, covenants dari prospektus. Satu rasio tidak pernah cukup — tren dan perbandingan sejenis yang menentukan.",
        "Skenario 3 — Spread CDS melebar tajam. → Perlakukan sebagai alarm dini, tetapi verifikasi: apakah ini risiko emiten atau likuiditas pasar CDS? Cek berita, cek rasio terbaru, cek apakah obligasi kasnya ikut melebar.",
        "Skenario 4 — Memilih tranche sekuritisasi. → Tanyakan attachment dan detachment, hitung break-even loss, dan tanyakan korelasi antar debitur pool. Senior dengan attachment 15 persen aman dari kerugian tersebar — tidak aman dari kerugian serentak.",
        "Skenario 5 — Emiten di-downgrade. → Hitung dampak harga (duration dikali pelebaran spread), cek covenant yang terpicu (step-up coupon?), dan cek apakah downgrade mendekati batas investment grade — di situlah cliff effect menunggu.",
        "Aturan praktis 10 detik: spread → bedah OAS dan expected loss; emiten → 4C plus stress test; CDS → alarm dini, verifikasi dulu; tranche → attachment, detachment, korelasi; downgrade → harga, covenant, cliff.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membeli yield tertinggi di layar tanpa membedah spread. Yield tinggi bisa berarti risiko default tinggi, likuiditas kering, opsi yang dijual, atau ketiganya — tugas analis adalah menemukan yang mana sebelum membeli.",
      },
      reference: "Spread → OAS + EL. Emiten → 4C + stress test. CDS → alarm dini. Tranche → attachment + korelasi. Downgrade → harga + covenant + cliff.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: OAS, rasio kredit, CDS, MBS, dan tranche CDO.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Obligasi callable spread 280bp, OAS 190bp; obligasi polos sejenis spread 200bp. Mana kompensasi kredit lebih besar?",
          options: [
            { text: "Obligasi polos — OAS callable hanya 190bp, di bawah 200bp", why: "Benar: setelah opsi dibersihkan, callable memberi 190bp vs polos 200bp. Spread mentah 280bp menipu.", correct: true },
            { text: "Obligasi callable — spread 280bp paling lebar", why: "Salah: 90bp adalah bayaran opsi, bukan kompensasi kredit." },
            { text: "Sama — tenornya sama", why: "Salah: tenor sama, kompensasi kredit berbeda setelah OAS." },
            { text: "Tidak bisa dinilai", why: "Salah: OAS justru alat menilainya." },
          ],
        },
        {
          q: "PT Fiktif Sejahtera (ilustratif): utang 360, EBITDA 120, EBIT 90, bunga 30. Leverage dan coverage?",
          options: [
            { text: "Leverage 3,0 kali; coverage 3,0 kali", why: "Benar: 360/120 = 3,0; 90/30 = 3,0.", correct: true },
            { text: "Leverage 3,0 kali; coverage 4,0 kali", why: "Salah: coverage = 90/30 = 3,0, bukan 4,0." },
            { text: "Leverage 2,67 kali; coverage 3,0 kali", why: "Salah: 2,67 adalah net leverage (utang dikurangi kas) — leverage kotor 3,0." },
            { text: "Leverage 12,0 kali; coverage 0,33 kali", why: "Salah: pembilang dan penyebut tertukar di kedua rasio." },
          ],
        },
        {
          q: "Suku bunga naik tajam. Risiko MBS yang muncul dan artinya?",
          options: [
            { text: "Extension risk: prepayment melambat, pokok kembali lebih lambat, duration memanjang", why: "Benar: tidak ada yang refinancing saat bunga naik — duration MBS memanjang tepat saat harga jatuh.", correct: true },
            { text: "Contraction risk: pokok kembali lebih cepat", why: "Salah: itu saat bunga turun — debitur refinancing massal." },
            { text: "Tidak ada risiko — MBS kebal suku bunga", why: "Salah: MBS justru punya negative convexity — dihukum di kedua arah." },
            { text: "Risiko gagal bayar MBS naik", why: "Salah: yang berubah adalah kecepatan prepayment, bukan gagal bayar — itu risiko berbeda." },
          ],
        },
        {
          q: "Pool 100 miliar: equity 0–5, mezzanine 5–15, senior 15–100 (ilustratif). Kerugian 8 miliar. Sisa tiap tranche?",
          options: [
            { text: "Equity 0, mezzanine 7, senior 85 (utuh)", why: "Benar: kerugian 8 = equity 5 habis + mezzanine 3 → mezzanine tersisa 7 (notional 10 dikurangi 3); senior belum tersentuh (85).", correct: true },
            { text: "Equity 2, mezzanine 10, senior 85", why: "Salah: itu hasil kerugian 3 miliar, bukan 8 miliar." },
            { text: "Equity 0, mezzanine 0, senior 80", why: "Salah: itu hasil kerugian 20 miliar — mezzanine habis hanya bila kerugian di atas 15." },
            { text: "Masing-masing rugi sepertiga", why: "Salah: waterfall tidak membagi rata." },
          ],
        },
        {
          q: "Mengapa downgrade dari BBB-minus ke BB lebih mahal dari downgrade BBB ke BBB-minus?",
          options: [
            { text: "Cliff effect: investor bermandat investment grade wajib menjual saat emiten menjadi junk", why: "Benar: forced selling menekan harga di luar perubahan risiko fundamentalnya.", correct: true },
            { text: "Karena BB lebih jauh dari AAA", why: "Salah: jarak dari AAA bukan penentu — yang menentukan adalah batas mandat investor." },
            { text: "Karena kupon obligasi berubah otomatis", why: "Salah: kupon kontraktual tetap — yang berubah adalah harga pasar dan kemungkinan step-up coupon." },
            { text: "Tidak lebih mahal — semua downgrade satu notch sama", why: "Salah: satu notch di perbatasan kategori memicu forced selling; satu notch di tengah kategori tidak." },
          ],
        },
      ],
      summary: [
        "Credit spread mencampur risiko kredit dan nilai opsi — bandingkan OAS untuk obligasi beropsi.",
        "Analisis kredit = 4C (Character, Capacity, Collateral, Covenants); leverage = utang/EBITDA, coverage = EBIT/bunga; selalu stress test dan bandingkan sejenis.",
        "CDS = asuransi gagal bayar: premi = spread dikali notional, bayar = LGD dikali notional; spread CDS adalah alarm dini yang bergerak lebih cepat dari rating.",
        "MBS: bunga turun = contraction, bunga naik = extension; PSA adalah bahasa kecepatan prepayment (PSA 100 = CPR 6 persen di bulan ke-30).",
        "CDO: attachment = mulai berdarah, detachment = habis; korelasi antar debitur bisa menjebol attachment yang terlihat aman.",
        "Downgrade = repricing: harga jatuh, covenant bisa terpicu, dan cliff effect menunggu di batas investment grade.",
      ],
      next: { label: "PM-A8 — Derivatives: Forward, Swap & Opsi", href: "/learn/pm-a8-derivatives" },
    },
  ],
};
