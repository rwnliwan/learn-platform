import type { V2Lesson } from "../lib/types";

export const pma8b: V2Lesson = {
  slug: "pm-a8b-harga-opsi",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A8B Derivatives: Harga Opsi, Greeks & Strategi",
  estMinutes: 60,
  steps: [
    {
      id: "binomial-intuisi",
      eyebrow: "Langkah 1 · Binomial 1 Periode",
      title: "Harga opsi dari dunia yang hanya bisa naik atau turun",
      prose: [
        "PM-A8 mengajarkan payoff opsi: call bernilai max(S dikurangi X, 0) saat jatuh tempo. Lesson ini menjawab pertanyaan berikutnya: berapa harga yang wajar untuk opsi itu HARI INI, sebelum kita tahu harga akhirnya? Jawabannya tidak datang dari menebak arah pasar, melainkan dari membangun portofolio replikasi — kombinasi saham dan kas yang payoff-nya meniru opsi secara persis di semua skenario.",
        "Contoh ilustratif: saham kini S = 100. Satu periode lagi, harga hanya bisa naik ke 120 (u = 1,2) atau turun ke 80 (d = 0,8). Call Eropa strike X = 100 jatuh tempo satu periode lagi. Bila naik, payoff call = 20; bila turun, payoff = 0. Portofolio replikasi terdiri dari delta lembar saham plus kas B yang dipinjam atau disimpan pada suku bunga bebas risiko r = 5 persen. Dua persamaan, dua skenario: delta dikali 120 ditambah B dikali 1,05 sama dengan 20; delta dikali 80 ditambah B dikali 1,05 sama dengan 0. Kurangkan keduanya: delta dikali 40 sama dengan 20, sehingga delta = 0,5. Substitusi kembali: B = negatif 0,5 dikali 80 dibagi 1,05 = negatif 38,10. Artinya replikasi berarti beli 0,5 lembar saham dengan meminjam 38,10. Nilai portofolio hari ini = 0,5 dikali 100 dikurangi 38,10 = 11,90. Karena payoff-nya identik dengan call di semua skenario, harga call hari ini HARUS 11,90 — bila tidak, muncul arbitrase.",
        "Jalan kedua menuju angka yang sama adalah probabilitas risk-neutral. Probabilitas naik risk-neutral p = ((1 ditambah r) dikurangi d) dibagi (u dikurangi d) = (1,05 dikurangi 0,8) dibagi 0,4 = 0,625. Perhatikan: p BUKAN probabilitas sebenarnya harga naik — ia adalah probabilitas imajiner yang membuat harga saham hari ini sama dengan ekspektasi diskonto harga masa depan. Harga call = ekspektasi risk-neutral payoff yang didiskonto: (0,625 dikali 20 ditambah 0,375 dikali 0) dibagi 1,05 = 12,50 dibagi 1,05 = 11,90. Dua jalan, satu jawaban. Itulah kekuatan no-arbitrage: harga opsi ditentukan oleh replikasi, bukan oleh opini tentang arah pasar. Bobot CFA L1 untuk Derivatives umumnya berada pada rentang 5 sampai 8 persen (ilustratif sebagai rentang bobot yang dipublikasikan) — dan binomial adalah fondasi yang paling sering diuji.",
      ],
      formula: String.raw`p = \frac{(1+r)-d}{u-d} \quad;\quad C = \frac{p \cdot C_u + (1-p) \cdot C_d}{1+r}`,
      formulaNote: "u/d = faktor naik/turun harga (1,2/0,8); r = suku bunga bebas risiko per periode (5%); C_u/C_d = payoff call saat naik/turun (20/0); p = probabilitas risk-neutral. Interpretasi: p bukan probabilitas nyata — ia adalah bobot yang membuat harga saham hari ini konsisten dengan ekspektasi diskontonya, sehingga harga opsi bebas dari opini arah pasar. Contoh angka (ilustratif): p = (1,05 dikurangi 0,8) dibagi 0,4 = 0,625; C = (0,625 dikali 20) dibagi 1,05 = 11,90.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai probabilitas nyata harga naik (misalnya 70 persen dari analis) untuk menghargai opsi. Harga opsi memakai probabilitas risk-neutral — probabilitas nyata sudah tercermin di harga saham hari ini, dan memakainya dua kali berarti menghitung ganda.",
      },
      reference: "Replikasi: delta saham plus kas yang payoff-nya meniru opsi. Risk-neutral: p = ((1+r) dikurangi d) dibagi (u dikurangi d).",
    },
    {
      id: "lab-binomial",
      eyebrow: "Langkah 2 · Lab: Binomial 1 Periode",
      title: "Hitung sendiri harga call-nya: 11,90",
      prose: [
        "Sekarang giliranmu menghitung. Parameternya sama dengan langkah sebelumnya (ilustratif): S = 100, u = 1,2, d = 0,8, r = 5 persen, X = 100, call Eropa satu periode. Langkah pertama: hitung probabilitas risk-neutral p dari rumus (1 ditambah r dikurangi d) dibagi (u dikurangi d). Langkah kedua: hitung payoff saat naik, Cu = max(120 dikurangi 100, 0) = 20, dan saat turun, Cd = max(80 dikurangi 100, 0) = 0. Langkah ketiga: harga call = ekspektasi risk-neutral payoff yang didiskonto satu periode.",
        "Periksa jawabanmu terhadap dua jalan sekaligus: ekspektasi risk-neutral harus memberi 11,90, dan portofolio replikasi (delta 0,5 lembar saham, pinjam 38,10) juga memberi 11,90. Bila keduamu cocok, kamu sudah memegang intuisi terpenting derivatif: harga adalah biaya replikasi, bukan tebakan arah.",
        "Catatan kejujuran model: pohon satu periode ini kasar — harga hanya boleh naik 20 persen atau turun 20 persen. Model Black-Scholes di langkah berikutnya menghaluskan pohon ini menjadi gerakan kontinu, sehingga harganya sedikit berbeda (10,45 untuk parameter yang sebanding, ilustratif). Perbedaan itu bukan kesalahan: pohon kasar dan gerakan kontinu adalah dua pendekatan atas realitas yang sama, dan keduanya bertemu saat jumlah periode diperbanyak.",
      ],
      formula: String.raw`\Delta = \frac{C_u - C_d}{S_u - S_d} = \frac{20 - 0}{120 - 80} = 0{,}5`,
      formulaNote: "Delta replikasi = selisih payoff dibagi selisih harga saham antar skenario. Interpretasi: delta 0,5 berarti 0,5 lembar saham meniru sensitivitas call terhadap harga saham — inilah benih delta hedging di Langkah 5. Contoh angka (ilustratif): (20 dikurangi 0) dibagi (120 dikurangi 80) = 0,5; kas B = negatif 38,10; nilai replikasi = 50 dikurangi 38,10 = 11,90.",
      tasks: [
        { id: "t1", text: "Hitung `p` (probabilitas risk-neutral) dan `cu` (payoff saat naik)" },
        { id: "t2", text: "Hitung `call` (harga call hari ini), cetak ketiganya" },
      ],
      expected: "p=0.625  cu=20  call=11.90",
      hints: [
        "p = ((1 + r) dikurangi d) dibagi (u dikurangi d).",
        "cu = max(u dikali S dikurangi X, 0); cd = 0.",
        "p = ((1 + r) - d) / (u - d)\ncall = (p * cu + (1 - p) * 0) / (1 + r)",
      ],
      code: {
        starter: `s, u, d, r, x = 100, 1.2, 0.8, 0.05, 100\n\n# TULIS KODEMU\np = \ncu = \ncall = \n\nprint(f"p={p:.3f}  cu={cu:.0f}  call={call:.2f}")`,
        lockLines: 1,
        solution: `s, u, d, r, x = 100, 1.2, 0.8, 0.05, 100\n\n# TULIS KODEMU\np = ((1 + r) - d) / (u - d)\ncu = max(u * s - x, 0)\ncall = (p * cu + (1 - p) * 0) / (1 + r)\n\nprint(f"p={p:.3f}  cu={cu:.0f}  call={call:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.625, tol: 1e-9, label: "`p` seharusnya 0.625", msg: "(1,05 dikurangi 0,8) dibagi 0,4 = 0,625." },
          { kind: "equal", task: "t1", name: "cu", value: 20, tol: 1e-9, label: "`cu` seharusnya 20", msg: "max(120 dikurangi 100, 0) = 20." },
          { kind: "equal", task: "t2", name: "call", value: 11.9, tol: 0.01, label: "`call` sekitar 11.90", msg: "(0,625 dikali 20) dibagi 1,05 = 11,90." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.625\\s+cu=20\\s+call=11\\.90", label: "`print` menampilkan ketiganya", msg: "Format: p=...  cu=...  call=... ." },
        ],
      },
      reference: "p = 0,625; Cu = 20; Cd = 0; C = 11,90. Replikasi: delta 0,5, pinjam 38,10.",
    },
    {
      id: "black-scholes",
      eyebrow: "Langkah 3 · Black-Scholes",
      title: "Lima input, satu harga — dan apa yang tidak ditangkap model",
      prose: [
        "Black-Scholes adalah pohon binomial yang dihaluskan sampai tak berhingga: harga saham bergerak kontinu dengan volatilitas konstan, tanpa lompatan, tanpa biaya transaksi, suku bunga konstan, dan opsi Eropa yang hanya bisa dieksekusi saat jatuh tempo. Rumus call: C = S dikali N(d1) dikurangi X dikali e pangkat negatif rT dikali N(d2). Lima input menentukan segalanya: harga saham S, strike X, tenor T, suku bunga r, dan volatilitas sigma. Empat di antaranya teramati di pasar; volatilitas adalah satu-satunya yang harus diestimasi — dan di situlah seluruh seni penilaian opsi berada.",
        "Contoh ilustratif: S = X = 100, r = 5 persen, sigma = 20 persen, T = 1 tahun. Maka d1 = 0,35 dan d2 = 0,15, sehingga harga call Black-Scholes = 10,45. Bandingkan dengan binomial satu periode 11,90 di langkah sebelumnya: pohon kasar memberi harga lebih tinggi karena lompatannya kasar; makin banyak periode pohonnya, makin dekat ia ke 10,45. Intuisi d1 dan d2: N(d2) adalah probabilitas risk-neutral opsi berakhir in-the-money, sedangkan N(d1) adalah delta — sensitivitas harga call terhadap harga saham.",
        "Yang TIDAK ditangkap model sama pentingnya dengan yang ditangkap. Pertama, vol smile: di pasar nyata, implied volatility opsi deep out-of-the-money lebih tinggi daripada at-the-money — pasar menagih premi ekstra untuk risiko ekor, sementara Black-Scholes mengasumsikan satu volatilitas untuk semua strike. Kedua, fat tail: return saham nyata berekor lebih gemuk daripada normal — crash terjadi lebih sering daripada prediksi model, sehingga put jauh dari strike dihargai lebih mahal daripada rumus. Ketiga, lompatan dan dividen: harga bisa melompat semalam karena berita, dan dividen menggerus harga saham — keduanya di luar asumsi gerakan kontinu. Praktisi memakai Black-Scholes sebagai bahasa kutip (mengutip harga dalam satuan implied volatility), bukan sebagai kebenaran literal. Bila seseorang mengutip opsi hanya dari rumus tanpa memeriksa smile, ia sedang membaca peta sambil mengabaikan medannya.",
      ],
      formula: String.raw`C = S \cdot N(d_1) - X e^{-rT} N(d_2) \quad;\quad d_1 = \frac{\ln(S/X) + (r + \sigma^2/2)T}{\sigma\sqrt{T}} \quad;\quad d_2 = d_1 - \sigma\sqrt{T}`,
      formulaNote: "S/X = harga saham/strike; r = suku bunga (5%); sigma = volatilitas (20%); T = tenor tahun (1); N = fungsi distribusi normal kumulatif. Interpretasi: suku pertama adalah nilai saham yang diharapkan diterima, suku kedua adalah strike yang diharapkan dibayar — keduanya dalam probabilitas risk-neutral. Contoh angka (ilustratif): d1 = 0,35, d2 = 0,15, harga call = 10,45.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Vol smile dan fat tail berarti model meremehkan risiko ekor: put jauh out-of-the-money terlihat murah di rumus tetapi mahal di pasar — karena pasar pernah melihat crash. Jangan pernah menjual put jauh dengan keyakinan harga model.",
      },
      quiz: [
        {
          q: "Dari lima input Black-Scholes, mana satu-satunya yang tidak teramati langsung di pasar dan harus diestimasi?",
          options: [
            { text: "Harga saham S — harus ditebak dari analis", why: "Salah: harga saham teramati langsung di pasar setiap detik." },
            { text: "Volatilitas sigma — diestimasi dari data historis atau diimplikasikan dari harga opsi", why: "Benar: S, X, T, dan r semuanya teramati; hanya volatilitas yang harus diestimasi — dan di situlah seninya.", correct: true },
            { text: "Strike X — dinegosiasikan tiap kontrak", why: "Salah: strike tercetak di kontrak opsi dan diketahui pasti." },
            { text: "Suku bunga r — rahasia bank sentral", why: "Salah: suku bunga bebas risiko teramati dari kurva yield pemerintah." },
          ],
        },
        {
          q: "Pasar nyata menunjukkan vol smile: implied volatility opsi jauh out-of-the-money lebih tinggi daripada at-the-money. Apa artinya?",
          options: [
            { text: "Pasar salah — model Black-Scholes selalu benar", why: "Salah: smile adalah pasar yang memberi tahu model bahwa asumsi volatilitas konstan dan return normal tidak berlaku." },
            { text: "Pasar menagih premi ekstra untuk risiko ekor yang tidak ditangkap model", why: "Benar: return nyata berekor gemuk — crash lebih sering dari prediksi normal — sehingga perlindungan ekor dihargai lebih mahal.", correct: true },
            { text: "Opsi jauh out-of-the-money pasti untung", why: "Salah: premi lebih tinggi justru berarti perlindungan ekor itu mahal, bukan gratis." },
            { text: "Volatilitas at-the-money harus dinaikkan agar sama", why: "Salah: smile bukan kesalahan kutip yang harus diratakan — ia informasi tentang distribusi return yang sebenarnya." },
          ],
        },
      ],
      reference: "Lima input: S, X, T, r, sigma. N(d2) = probabilitas in-the-money; N(d1) = delta. Model buta terhadap smile, fat tail, dan lompatan.",
    },
    {
      id: "greeks",
      eyebrow: "Langkah 4 · Greeks",
      title: "Delta, gamma, theta, vega: empat tuas yang menggerakkan harga opsi",
      prose: [
        "Greeks adalah turunan harga opsi terhadap tiap inputnya — dashboard yang memberi tahu apa yang berubah saat dunia bergerak. Delta mengukur sensitivitas terhadap harga saham: call at-the-money punya delta sekitar 0,5, artinya harga call naik sekitar 0,50 bila saham naik 1. Delta juga dibaca sebagai probabilitas kasar berakhir in-the-money: delta 0,5 berarti peluang sekitar 50 persen. Delta call bergerak dari 0 (jauh out-of-the-money) ke 1 (jauh in-the-money); delta put bergerak dari negatif 1 ke 0. Delta bukan konstanta — ia bergerak bersama harga saham, dan kecepatan geraknya bernama gamma.",
        "Gamma mengukur seberapa cepat delta berubah saat harga saham bergerak: gamma tertinggi pada opsi at-the-money dan mendekati jatuh tempo, dan mendekati nol pada opsi jauh in- atau out-of-the-money. Gamma adalah pedang bermata dua: bagi pembeli opsi, gamma positif berarti delta membaik ke arahmu saat harga bergerak menguntungkan — portofolio menjadi makin panjang saat naik dan makin pendek saat turun. Bagi penjual opsi, gamma negatif berarti delta memburuk ke arahmu — hedging harus diulang makin sering saat pasar bergerak, dan di pasar yang bergejolak biaya rebalancing itu memakan keuntungan premi.",
        "Theta dan vega melengkapi dashboard. Theta mengukur peluruhan waktu: opsi adalah aset yang membusuk — setiap hari yang berlalu menggerus time value, dan gerusan itu makin cepat mendekati jatuh tempo, terutama untuk opsi at-the-money. Pembeli opsi membayar theta setiap hari; penjual opsi memanennya. Vega mengukur sensitivitas terhadap volatilitas: opsi panjang (long) diuntungkan saat volatilitas naik, karena peluang gerakan besar meningkat; vega tertinggi pada opsi at-the-money dengan tenor panjang. Aturan ingatnya: delta menjawab harga bergerak, gamma menjawab delta bergerak, theta menjawab waktu berlalu, vega menjawab pasar menjadi gugup.",
      ],
      formula: String.raw`\Delta = N(d_1) \quad;\quad \Gamma = \frac{\partial \Delta}{\partial S} \quad;\quad \Theta = \frac{\partial C}{\partial t} < 0 \quad;\quad \text{Vega} = \frac{\partial C}{\partial \sigma} > 0`,
      formulaNote: "Delta = N(d1) untuk call Eropa; gamma = perubahan delta per perubahan harga saham; theta = perubahan harga per berlalunya waktu (negatif bagi pembeli); vega = perubahan harga per perubahan volatilitas (positif bagi pembeli). Interpretasi: keempatnya bersama-sama menjawab pertanyaan apa yang terjadi pada harga opsi bila saham bergerak, bila delta bergerak, bila waktu berlalu, dan bila pasar menjadi gugup. Contoh angka (ilustratif): call at-the-money d1 = 0,35 memberi delta sekitar 0,64 — harga call naik sekitar 0,64 bila saham naik 1.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira delta 0,5 berarti harga call pasti naik 0,50 saat saham naik 1. Delta adalah pendekatan linear sesaat: begitu saham bergerak, gamma mengubah delta itu sendiri — untuk gerakan besar, perkiraan delta saja meleset.",
      },
      quiz: [
        {
          q: "Kamu membeli call at-the-money. Semalam volatilitas pasar melonjak tetapi harga saham tidak bergerak. Apa yang terjadi pada harga call-mu?",
          options: [
            { text: "Turun — theta memakan nilainya", why: "Salah: theta memang menggerus setiap hari, tetapi lonjakan volatilitas adalah efek vega yang berlawanan arah dan biasanya lebih besar." },
            { text: "Naik — vega positif: volatilitas lebih tinggi menaikkan peluang gerakan besar", why: "Benar: pembeli opsi panjang vega — volatilitas naik berarti opsi lebih berharga meski harga saham diam.", correct: true },
            { text: "Tidak berubah — harga saham tidak bergerak", why: "Salah: harga opsi tidak hanya bergantung pada harga saham — volatilitas adalah input yang sama pentingnya." },
            { text: "Naik — delta meningkat", why: "Salah: delta merespons harga saham, bukan volatilitas; yang bekerja di sini adalah vega." },
          ],
        },
        {
          q: "Penjual opsi (short call) menghadapi pasar yang bergejolak naik-turun. Risiko utamanya dari sisi Greeks?",
          options: [
            { text: "Gamma negatif — delta memburuk ke arahnya sehingga hedging harus diulang terus dan biayanya membengkak", why: "Benar: gamma negatif berarti setiap gerakan harga memperburuk posisi; rebalancing yang sering di pasar bergejolak memakan premi.", correct: true },
            { text: "Theta positif — waktu merugikannya", why: "Salah: theta justru menguntungkan penjual — waktu yang berlalu menggerus nilai opsi yang ia jual." },
            { text: "Vega negatif — volatilitas naik merugikannya, tetapi itu bukan soal hedging berulang", why: "Sebagian benar soal vega, tetapi jawaban yang diminta adalah risiko hedging berulang — itu gamma, bukan vega." },
            { text: "Delta nol — posisinya kebal terhadap harga", why: "Salah: delta bisa di-hedge ke nol sesaat, tetapi gamma membuatnya bergerak lagi begitu harga bergerak." },
          ],
        },
      ],
      reference: "Delta: sensitivitas harga dan peluang kasar in-the-money. Gamma: kecepatan delta berubah. Theta: peluruhan waktu. Vega: sensitivitas volatilitas.",
    },
    {
      id: "lab-delta-hedge",
      eyebrow: "Langkah 5 · Lab: Delta Hedge",
      title: "Hedge 1.000 call dengan 500 lembar saham",
      prose: [
        "Teori delta hedging: bila kamu memegang opsi, kamu bisa menetralkan eksposur arah harga saham dengan memegang saham dalam jumlah berlawanan sebesar delta dikali jumlah opsi. Contoh ilustratif: kamu membeli 1.000 call dengan delta 0,5 per call. Eksposur arahmu setara dengan 500 lembar saham (1.000 dikali 0,5). Untuk menetralkannya, kamu short 500 lembar saham — portofolio gabunganmu kini delta-netral: gerakan kecil harga saham tidak mengubah nilaimu.",
        "Uji hedge-nya: harga saham naik 2, dari 100 ke 102. Pendekatan delta mengatakan setiap call naik sekitar delta dikali perubahan harga = 0,5 dikali 2 = 1, sehingga 1.000 call untung sekitar 1.000. Posisi short 500 lembar saham rugi 500 dikali 2 = 1.000. Net sekitar nol — hedge bekerja. Perhatikan kata sekitar: ini pendekatan linear. Untuk gerakan besar, gamma membuat delta call berubah selama harga bergerak, sehingga hedge yang sempurna sesaat menjadi tidak sempurna setelahnya — itulah mengapa delta hedging adalah pekerjaan berulang, bukan sekali pasang.",
        "Inilah ironi yang wajib diingat: delta hedging tidak menghilangkan risiko — ia menukarnya. Risiko arah ditukar dengan risiko gamma (biaya rebalancing) dan risiko vega (perubahan volatilitas). Market maker yang menjual opsi kepadamu hidup dari premi dikurangi biaya hedging ini. Bila kamu membeli opsi dan tidak pernah me-rebalance hedge, kamu sebenarnya tidak ter-hedge — kamu hanya memegang dua taruhan yang kebetulan berlawanan pada satu harga.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hedge` (lembar saham untuk short: negatif delta dikali jumlah call)" },
        { id: "t2", text: "Hitung `pnl_call`, `pnl_saham`, dan `pnl_net` saat harga naik 2, cetak ketiganya" },
      ],
      expected: "pnl_call=1000  pnl_saham=-1000  pnl_net=0",
      hints: [
        "Eksposur arah = delta dikali jumlah call; hedge = negatif dari itu.",
        "Pendekatan delta: perubahan harga call sekitar delta dikali perubahan harga saham.",
        "hedge = -delta * n_call\npnl_call = n_call * delta * ds\npnl_saham = hedge * ds",
      ],
      code: {
        starter: `n_call, delta, ds = 1000, 0.5, 2.0\n\n# TULIS KODEMU\nhedge = \npnl_call = \npnl_saham = \npnl_net = \n\nprint(f"pnl_call={pnl_call:.0f}  pnl_saham={pnl_saham:.0f}  pnl_net={pnl_net:.0f}")`,
        lockLines: 1,
        solution: `n_call, delta, ds = 1000, 0.5, 2.0\n\n# TULIS KODEMU\nhedge = -delta * n_call\npnl_call = n_call * delta * ds\npnl_saham = hedge * ds\npnl_net = pnl_call + pnl_saham\n\nprint(f"pnl_call={pnl_call:.0f}  pnl_saham={pnl_saham:.0f}  pnl_net={pnl_net:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "hedge", value: -500, tol: 1e-9, label: "`hedge` seharusnya -500", msg: "Negatif 0,5 dikali 1.000 = short 500 lembar." },
          { kind: "equal", task: "t2", name: "pnl_call", value: 1000, tol: 1e-9, label: "`pnl_call` seharusnya 1000", msg: "1.000 dikali 0,5 dikali 2 = 1.000." },
          { kind: "equal", task: "t2", name: "pnl_saham", value: -1000, tol: 1e-9, label: "`pnl_saham` seharusnya -1000", msg: "Negatif 500 dikali 2 = negatif 1.000." },
          { kind: "equal", task: "t2", name: "pnl_net", value: 0, tol: 1e-9, label: "`pnl_net` seharusnya 0", msg: "1.000 dikurangi 1.000 = 0 — hedge bekerja untuk gerakan kecil." },
          { kind: "stdout_matches", task: "t2", pattern: "pnl_call=1000\\s+pnl_saham=-1000\\s+pnl_net=0", label: "`print` menampilkan ketiganya", msg: "Format: pnl_call=...  pnl_saham=...  pnl_net=... ." },
        ],
      },
      reference: "Hedge = negatif delta dikali jumlah opsi. Net nol untuk gerakan kecil; gamma merusaknya untuk gerakan besar.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 6 · Strategi Opsi",
      title: "Covered call, protective put, straddle: kapan masing-masing masuk akal",
      prose: [
        "Covered call: kamu memegang saham dan menjual call terhadapnya. Kamu menerima premi — tetapi melepas upside di atas strike. Strategi ini masuk akal bila kamu netral sampai sedikit optimistis dan bersedia saham diambil di strike: premi menjadi pendapatan tambahan yang stabil. Jebakannya: di pasar yang melonjak, kamu menonton saham kesayanganmu terbang sementara keuntunganmu mentok di strike; dan di pasar yang jatuh, premi hanya menahan sebagian kecil kerugian — covered call bukan proteksi, ia penjualan upside secara eceran.",
        "Protective put: kamu memegang saham dan membeli put. Ini asuransi: bila saham jatuh di bawah strike, put membayar selisihnya; bila saham naik, kamu ikut naik penuh dikurangi premi. Masuk akal bila kamu optimistis jangka panjang tetapi takut guncangan jangka pendek — misalnya menjelang laporan keuangan. Jebakannya: premi adalah biaya berulang — membeli put setiap kuartal selama bertahun-tahun adalah premi yang terus dibayar; dan put yang terlalu jauh out-of-the-money murah tetapi hampir tidak pernah membayar, seperti asuransi dengan deductible raksasa.",
        "Straddle: kamu membeli call dan put pada strike yang sama. Kamu untung bila harga bergerak BESAR ke arah mana pun — dan rugi bila harga diam di tempat. Masuk akal menjelang peristiwa biner yang pasti menggerakkan harga tetapi arahnya tidak diketahui, misalnya putusan pengadilan atau hasil uji klinis. Contoh ilustratif: call 11,90 ditambah put 7,14 (dari put-call parity PM-A8) berarti biaya straddle 19,04 — breakeven di 80,96 ke bawah atau 119,04 ke atas. Jebakannya: whipsaw dan premi ganda — bila harga bergerak besar lalu kembali ke tengah sebelum jatuh tempo, kamu membayar dua premi dan tidak mendapat apa-apa; dan menjelang peristiwa, implied volatility biasanya sudah mahal, sehingga harga harus bergerak LEBIH besar dari yang diperkirakan pasar agar straddle untung. Membeli straddle sebelum peristiwa besar berarti bertaruh bahwa pasar meremehkan besarnya gerakan — taruhan yang sering kalah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Straddle terlihat netral arah, tetapi ia taruhan murni pada volatilitas: bila realized volatility di bawah implied volatility yang kamu bayar, kamu rugi meski arah tebakanmu benar. Selalu bandingkan implied dengan realized sebelum membeli volatilitas.",
      },
      quiz: [
        {
          q: "Kamu memegang saham dan khawatir akan guncangan jangka pendek, tetapi yakin prospek jangka panjangnya. Strategi yang tepat?",
          options: [
            { text: "Covered call — menjual upside untuk premi", why: "Salah: covered call menambah pendapatan tetapi tidak melindungi dari jatuh — justru melepas upside." },
            { text: "Protective put — membayar premi untuk memotong ekor kiri sambil menyimpan upside", why: "Benar: put adalah asuransi — saham boleh naik penuh, tetapi lantai kerugian sudah dipasang.", correct: true },
            { text: "Straddle — membeli call dan put sekaligus", why: "Salah: straddle butuh gerakan besar ke arah mana pun; kamu sudah memegang saham dan hanya butuh proteksi bawah." },
            { text: "Menjual sahamnya — keluar total", why: "Salah: kamu yakin prospek jangka panjangnya; yang dibutuhkan adalah asuransi sementara, bukan keluar." },
          ],
        },
        {
          q: "Straddle at-the-money seharga 19,04 (call 11,90 + put 7,14, strike 100). Kapan straddle ini untung saat jatuh tempo?",
          options: [
            { text: "Bila harga saham naik di atas 100", why: "Salah: naik sedikit tidak cukup — call hanya membayar di atas 100, tetapi total biaya 19,04 harus tertutup dulu." },
            { text: "Bila harga saham bergerak ke bawah 80,96 atau ke atas 119,04", why: "Benar: breakeven = strike dikurangi dan ditambah total premi — 100 dikurangi 19,04 = 80,96; 100 ditambah 19,04 = 119,04.", correct: true },
            { text: "Bila harga saham diam di 100", why: "Salah: diam di 100 berarti kedua opsi berakhir nol — rugi penuh 19,04." },
            { text: "Selalu untung — dua arah tercakup", why: "Salah: dua arah tercakup bukan berarti gratis — premi ganda 19,04 harus dibayar oleh gerakan yang besar." },
          ],
        },
      ],
      reference: "Covered call = jual upside untuk premi. Protective put = asuransi, simpan upside. Straddle = taruhan gerakan besar, kalah bila harga diam.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Market maker yang kehabisan premi",
      prose: [
        "Seorang market maker fiktif (ilustratif) menjual 10.000 call at-the-money dan menerima premi 10,45 per call — total 104.500. Ia delta-hedge dengan membeli 6.400 lembar saham (delta 0,64). Seminggu kemudian pasar melonjak 10 persen lalu jatuh 10 persen kembali ke titik awal — whipsaw klasik. Setiap gerakan memaksanya membeli mahal dan menjual murah untuk menjaga hedge: membeli saham saat naik, menjual saat turun. Total biaya rebalancing: 38.000 (ilustratif). Premi 104.500 dikurangi biaya hedging 38.000 dikurangi peluruhan waktu yang ia panen — laba bersihnya jauh lebih tipis daripada premi kotor yang terlihat di awal.",
        "Pelajaran pertama: menjual opsi bukan mencetak premi gratis — premi adalah upah untuk menanggung gamma dan vega, dan upah itu dibayar dalam bentuk biaya rebalancing. Pelajaran kedua: whipsaw adalah musuh penjual opsi yang ter-hedge — pasar yang naik-turun tanpa arah memakan hedge lebih rakus daripada pasar yang bergerak satu arah. Pelajaran ketiga: model Black-Scholes mengasumsikan hedging kontinu tanpa biaya — di dunia nyata, hedging dilakukan berkala dengan biaya transaksi, sehingga harga wajar opsi di dunia nyata HARUS lebih tinggi daripada harga model bagi penjual yang menanggung biaya itu.",
        "Untuk pembeli opsi, cerminnya terbalik: kamu membayar premi dan theta setiap hari, dan kamu hanya menang bila realized volatility melebihi implied volatility yang kamu bayar. Sebelum membeli opsi apa pun, tanyakan: apakah saya membayar volatilitas yang murah atau mahal — dan apakah saya punya alasan untuk percaya pasar salah menilai besarnya gerakan yang akan datang? Bila tidak ada jawaban, premi yang kamu bayar adalah sumbangan untuk market maker.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung keuntungan menjual opsi dari premi kotor saja. Premi kotor dikurangi biaya rebalancing gamma, dikurangi kerugian vega saat volatilitas naik, dikurangi biaya transaksi — itulah laba sebenarnya, dan sering kali jauh lebih kecil.",
      },
      reference: "Premi = upah menanggung gamma dan vega. Whipsaw memakan hedge. Beli opsi hanya bila realized vol diperkirakan melebihi implied vol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: binomial, Black-Scholes, Greeks, strategi, dan delta hedge.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Binomial: u = 1,2, d = 0,8, r = 5 persen, call strike 100, S = 100. Harga call hari ini?",
          options: [
            { text: "20 — payoff saat naik", why: "Salah: 20 adalah payoff bila naik, bukan harga hari ini — harga adalah ekspektasi risk-neutral yang didiskonto." },
            { text: "11,90 — ekspektasi risk-neutral yang didiskonto", why: "Benar: p = 0,625; (0,625 dikali 20) dibagi 1,05 = 11,90.", correct: true },
            { text: "10 — rata-rata payoff tanpa diskonto", why: "Salah: rata-rata sederhana memakai probabilitas nyata dan lupa mendiskonto — dua kesalahan sekaligus." },
            { text: "0 — call belum in-the-money", why: "Salah: call at-the-money punya time value positif — peluang naik ke 120 memberi nilai hari ini." },
          ],
        },
        {
          q: "Mengapa probabilitas risk-neutral dipakai, bukan probabilitas nyata harga naik?",
          options: [
            { text: "Karena probabilitas nyata tidak bisa diestimasi", why: "Salah: probabilitas nyata bisa diestimasi — hanya saja ia sudah tercermin di harga saham hari ini." },
            { text: "Karena harga opsi ditentukan oleh biaya replikasi, dan probabilitas nyata sudah tercermin di harga saham", why: "Benar: memakai probabilitas nyata berarti menghitung ekspektasi pasar dua kali — harga saham sudah mengandungnya.", correct: true },
            { text: "Karena regulator melarang memakai probabilitas nyata", why: "Salah: tidak ada larangan seperti itu — ini soal matematika no-arbitrage, bukan regulasi." },
            { text: "Karena probabilitas risk-neutral selalu 50 persen", why: "Salah: p di contoh ini 0,625 — ia bergantung pada r, u, dan d." },
          ],
        },
        {
          q: "Opsi call-mu kehilangan nilai setiap hari meski harga saham tidak bergerak. Greek yang bekerja?",
          options: [
            { text: "Delta — harga saham diam sehingga delta nol", why: "Salah: delta merespons harga saham; yang menggerus nilai saat saham diam adalah waktu." },
            { text: "Theta — peluruhan time value seiring berlalunya waktu", why: "Benar: opsi adalah aset yang membusuk; mendekati jatuh tempo, gerusannya makin cepat.", correct: true },
            { text: "Vega — volatilitas turun", why: "Salah: vega merespons perubahan volatilitas; soal ini tidak menyebut volatilitas berubah — hanya waktu yang berlalu." },
            { text: "Gamma — delta berubah", why: "Salah: gamma merespons gerakan harga; harga diam berarti gamma tidak bekerja." },
          ],
        },
        {
          q: "Kamu menjual call terhadap saham yang kamu pegang (covered call) dan saham melonjak jauh di atas strike. Apa yang terjadi?",
          options: [
            { text: "Kamu ikut seluruh kenaikan — covered call tidak membatasi upside", why: "Salah: justru itulah harga covered call — upside di atas strike dilepas kepada pembeli call." },
            { text: "Keuntunganmu mentok di strike ditambah premi; saham diambil di strike", why: "Benar: premi menjadi pendapatan, tetapi kenaikan di atas strike menjadi milik pembeli call.", correct: true },
            { text: "Kamu rugi tanpa batas", why: "Salah: kamu memegang sahamnya — kenaikan saham menutupi kewajiban call; rugi tak terbatas hanya untuk naked call." },
            { text: "Call kedaluwarsa tanpa nilai dan kamu menyimpan premi penuh", why: "Salah: bila saham jauh di atas strike, call dieksekusi — saham diambil, bukan kedaluwarsa tanpa nilai." },
          ],
        },
        {
          q: "Delta hedge 1.000 call (delta 0,5) dengan short 500 saham. Harga naik 2. P/L net pendekatan delta?",
          options: [
            { text: "Untung 1.000 — call naik, saham diabaikan", why: "Salah: short saham rugi 1.000 — keduanya harus dihitung." },
            { text: "Sekitar 0 — untung call 1.000 menutup rugi short 1.000", why: "Benar: itulah delta-netral — untuk gerakan kecil, keduanya saling meniadakan.", correct: true },
            { text: "Rugi 1.000 — short saham merugikan", why: "Salah: rugi short ditutup untung call — net sekitar nol." },
            { text: "Untung 2.000 — keduanya untung", why: "Salah: short saham rugi saat harga naik — tidak mungkin keduanya untung." },
          ],
        },
      ],
      summary: [
        "Harga opsi = biaya replikasi: binomial memberi 11,90 lewat delta 0,5 dan pinjam 38,10, atau lewat probabilitas risk-neutral p = 0,625.",
        "Black-Scholes: lima input (S, X, T, r, sigma); hanya volatilitas yang harus diestimasi; model buta terhadap vol smile, fat tail, dan lompatan.",
        "Greeks: delta menjawab harga bergerak, gamma menjawab delta bergerak, theta menjawab waktu berlalu, vega menjawab pasar gugup.",
        "Covered call menjual upside untuk premi; protective put membeli asuransi; straddle bertaruh gerakan besar dan kalah bila harga diam.",
        "Delta hedging menukar risiko arah dengan biaya rebalancing gamma — premi kotor bukan laba.",
      ],
      next: { label: "PM-A9B — Alternatives: Hedge Fund, PE & Aset Riil", href: "/learn/pm-a9b-hedge-fund-pe" },
    },
  ],
};
