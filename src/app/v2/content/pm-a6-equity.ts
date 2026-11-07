import type { V2Lesson } from "../lib/types";

const EFISIENSI_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tangga tiga bentuk efisiensi pasar: lemah, setengah kuat, kuat — makin tinggi makin banyak informasi tercermin.">
<text x="260" y="20" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Efisiensi pasar = tangga, bukan biner</text>
<text x="16" y="140" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 16 140)">info yang tercermin →</text>
<rect x="30" y="150" width="140" height="70" fill="var(--c1)" opacity="0.18" stroke="var(--c1)" stroke-width="1.5"/>
<rect x="190" y="110" width="140" height="110" fill="var(--c2)" opacity="0.18" stroke="var(--c2)" stroke-width="1.5"/>
<rect x="350" y="70" width="140" height="150" fill="var(--c3)" opacity="0.18" stroke="var(--c3)" stroke-width="1.5"/>
<g font-family="var(--font-ui)" text-anchor="middle">
<text x="100" y="142" font-size="10" fill="var(--chart-text)">harga lampau</text>
<text x="260" y="102" font-size="10" fill="var(--chart-text)">+ info publik</text>
<text x="420" y="62" font-size="10" fill="var(--chart-text)">+ info privat</text>
<text x="100" y="172" font-size="11" fill="var(--text)" font-weight="600">LEMAH</text>
<text x="260" y="132" font-size="11" fill="var(--text)" font-weight="600">SETENGAH KUAT</text>
<text x="420" y="92" font-size="11" fill="var(--text)" font-weight="600">KUAT</text>
<text x="100" y="194" font-size="10" fill="var(--chart-text)">analisis teknikal mati</text>
<text x="260" y="154" font-size="10" fill="var(--chart-text)">analisis fundamental</text>
<text x="260" y="168" font-size="10" fill="var(--chart-text)">pun sulit</text>
<text x="420" y="114" font-size="10" fill="var(--chart-text)">hampir tak ada yang</text>
<text x="420" y="128" font-size="10" fill="var(--chart-text)">percaya penuh</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.5"><line x1="174" y1="165" x2="188" y2="145"/><polygon points="188,152 190,140 180,145" fill="var(--chart-text)" stroke="none"/><line x1="334" y1="125" x2="348" y2="105"/><polygon points="348,112 350,100 340,105" fill="var(--chart-text)" stroke="none"/></g>
</svg>`;

export const pma6: V2Lesson = {
  slug: "pm-a6-equity",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A6 Equity: Struktur Pasar, Indeks & Efisiensi",
  estMinutes: 60,
  steps: [
    {
      id: "order-margin",
      eyebrow: "Langkah 1 · Order & Margin",
      title: "Margin call di hari merah",
      prose: [
        "Andi beli saham Rp100jt dengan margin 50% (Rp50jt dana sendiri + Rp50jt pinjaman broker). Saham naik 20% \u2192 untung Rp20jt dari modal Rp50jt = +40%. \u201cLeverage itu indah!\u201d Lalu IHSG anjlok 15% sehari — broker menelepon: margin call. Andi harus setor dana atau posisinya dijual paksa di harga terendah. Leverage simetris: +40% kemarin = \u221260% + forced selling hari ini.",
        "Aturan mainnya: market order = eksekusi segera di harga pasar (bayar spread); limit order = eksekusi hanya di harga yang ditentukan atau lebih baik (mungkin tidak tereksekusi); stop order = menjadi market order saat harga menyentuh level (cut loss otomatis). Long = beli dulu (untung saat naik); short = pinjam dan jual dulu (untung saat turun — risiko tidak terbatas).",
        "Margin call terjadi saat ekuitas < maintenance margin \u2192 setor dana atau dilikuidasi paksa. Hitung titik call SEBELUM buka posisi, bukan setelah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Short selling punya risiko tak terbatas (harga naik tanpa batas) + short squeeze. Ingin short saham overvalued? Pertimbangkan put options — rugi terbatas pada premi.",
      },
      quiz: [
        {
          q: "Risiko short selling vs long?",
          options: [
            { text: "Sama", why: "Salah: long rugi maksimum 100%; short tidak punya batas atas kerugian." },
            { text: "Short: rugi tak terbatas + short squeeze", why: "Benar: harga bisa naik tanpa batas, dan short yang crowded bisa dipaksa tutup saat spike.", correct: true },
            { text: "Short lebih aman", why: "Salah: kebalikannya — short justru lebih berbahaya." },
            { text: "Short tidak bisa rugi", why: "Salah: short rugi saat harga naik." },
          ],
        },
      ],
      reference: "Market = cepat; limit = harga; stop = disiplin. Short = risiko tak terbatas.",
    },
    {
      id: "margin-call",
      eyebrow: "Langkah 2 · Titik Margin Call",
      title: "Hitung kapan broker menelepon",
      prose: [
        "Posisi Rp100jt, pinjam Rp50jt, maintenance 30%. Margin call saat (P \u2212 50)/P = 0,30 \u2192 P = Rp71,4jt \u2192 turun 28,6% dari awal. Turun 30% \u2192 margin 28,6% < 30% \u2192 call.",
        "Catat: maintenance lebih rendah (25% vs 30%) = titik call lebih dalam — tetapi bukan berarti lebih aman, karena ekuitasmu sudah \u221266,7% saat itu.",
      ],
      formula: String.raw`\frac{P - \text{Pinjaman}}{P} = \text{maintenance}`,
      formulaNote: "P = nilai pasar posisi saat ini; Pinjaman = utang ke broker (Rp50 juta — tidak berubah saat harga bergerak); maintenance = margin minimum (30%). Interpretasi: persamaan ini memberi titik P di mana ekuitasmu tinggal tepat 30% — di bawah itu broker menelepon. Hitung SEBELUM buka posisi, bukan saat panik. Contoh angka: (P − 50)/P = 0,30 → P = 50/0,70 = Rp71,4 juta → margin call saat posisi turun 28,6% dari Rp100 juta.",
      tasks: [
        { id: "t1", text: "Hitung `p_call`: harga posisi saat margin = 30% (posisi 100, pinjam 50)" },
        { id: "t2", text: "Hitung `drop` (% penurunan dari 100), cetak keduanya 1 desimal" },
      ],
      expected: "p_call=71.4  drop=28.6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjawab \u201c30%\u201d karena maintenance 30%. Titik call bukan 30% — selesaikan (P\u221250)/P = 0,30 untuk P.",
      },
      hints: [
        "Dari (P \u2212 pinjam)/P = maint, selesaikan P = pinjam/(1 \u2212 maint).",
        "drop = (100 \u2212 p_call)/100 \u00d7 100.",
        "p_call = pinjam / (1 - maint)\ndrop = (100 - p_call)",
      ],
      code: {
        starter: `posisi, pinjam, maint = 100, 50, 0.30\n\n# TULIS KODEMU\np_call = \ndrop = \n\nprint(f"p_call={p_call:.1f}  drop={drop:.1f}")`,
        lockLines: 1,
        solution: `posisi, pinjam, maint = 100, 50, 0.30\n\n# TULIS KODEMU\np_call = pinjam / (1 - maint)\ndrop = (posisi - p_call) / posisi * 100\n\nprint(f"p_call={p_call:.1f}  drop={drop:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_call", value: 71.43, tol: 0.1, label: "`p_call` sekitar 71.4", msg: "50/(1\u22120,30) = 71,4. Selesaikan persamaan margin-nya." },
          { kind: "equal", task: "t2", name: "drop", value: 28.57, tol: 0.1, label: "`drop` sekitar 28.6", msg: "(100\u221271,4)/100 = 28,6%. Itu titik broker menelepon." },
          { kind: "stdout_matches", task: "t2", pattern: "p_call=71\\.4\\s+drop=28\\.6", label: "`print` menampilkan keduanya", msg: "Format: p_call=...  drop=... ." },
        ],
      },
      reference: "Titik call = pinjam/(1 \u2212 maintenance). Hitung sebelum leverage.",
    },
    {
      id: "indeks",
      eyebrow: "Langkah 3 · Indeks",
      title: "Cara menimbang pasar menentukan cerita",
      prose: [
        "Price-weighted (Dow): bobot = harga saham — saham Rp200rb \u2018lebih penting\u2019 dari Rp50rb, aneh tetapi nyata. Cap-weighted (S&P 500, IHSG): bobot = market cap — standar industri. Equal-weighted: semua sama — tilt ke small-cap.",
        "Tiga saham: A (harga 50rb, cap 100T), B (100rb, 40T), C (200rb, 10T). Price-weighted = (50+100+200)/3 rb = 116.667. Cap-weighted = (100\u00d750 + 40\u00d7100 + 10\u00d7200)/150 rb = 73.333. Saham C (harga termahal, cap terkecil) mendominasi price-weighted tetapi nyaris tak berarti di cap-weighted.",
      ],
      tasks: [
        { id: "t1", text: "Hitung indeks price-weighted `pw` (rata-rata harga)" },
        { id: "t2", text: "Hitung indeks cap-weighted `cw` (rata-rata tertimbang cap), cetak keduanya" },
      ],
      expected: "pw=116667  cw=73333",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap semua indeks \u201cnetral\u201d. Cap-weighted membuat taruhan aktif implisit: momentum (saham naik \u2192 bobot naik = buy high) dan konsentrasi. Pahami metodologi sebelum percaya benchmark.",
      },
      hints: [
        "Price-weighted = rata-rata aritmatika harga.",
        "Cap-weighted = \u03a3(cap \u00d7 harga) / \u03a3cap.",
        "pw = (a_h + b_h + c_h) / 3\ncw = (a_c*a_h + b_c*b_h + c_c*c_h) / (a_c + b_c + c_c)",
      ],
      code: {
        starter: `a_h, a_c = 50000, 100\nb_h, b_c = 100000, 40\nc_h, c_c = 200000, 10\n\n# TULIS KODEMU\npw = \ncw = \n\nprint(f"pw={pw:.0f}  cw={cw:.0f}")`,
        lockLines: 3,
        solution: `a_h, a_c = 50000, 100\nb_h, b_c = 100000, 40\nc_h, c_c = 200000, 10\n\n# TULIS KODEMU\npw = (a_h + b_h + c_h) / 3\ncw = (a_c*a_h + b_c*b_h + c_c*c_h) / (a_c + b_c + c_c)\n\nprint(f"pw={pw:.0f}  cw={cw:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pw", value: 116666.67, tol: 1, label: "`pw` sekitar 116667", msg: "(50.000+100.000+200.000)/3 = 116.667." },
          { kind: "equal", task: "t2", name: "cw", value: 73333.33, tol: 1, label: "`cw` sekitar 73333", msg: "(100\u00d750rb + 40\u00d7100rb + 10\u00d7200rb)/150 = 73.333." },
          { kind: "stdout_matches", task: "t2", pattern: "pw=116667\\s+cw=73333", label: "`print` menampilkan keduanya", msg: "Format: pw=...  cw=... ." },
        ],
      },
      reference: "Price-weighted = bobot harga (aneh). Cap-weighted = standar. Equal = tilt small-cap.",
    },
    {
      id: "efisiensi",
      eyebrow: "Langkah 4 · Efisiensi Pasar + chart",
      title: "Efisiensi = derajat, bukan biner",
      prose: [
        "Bentuk lemah: harga lampau tidak berguna \u2192 analisis teknikal mati. Bentuk semi-kuat: semua info publik tercermin \u2192 analisis fundamental pun sulit. Bentuk kuat: bahkan info privat tercermin — hampir tak ada yang percaya penuh.",
        "Implikasi praktis: makin efisien pasar, makin sulit alpha konsisten — dan makin masuk akal indeksasi murah. Tetapi anomali (mis. momentum) menunjukkan efisiensi bukan biner.",
        "Cara membaca: baca tangga dari kiri ke kanan — setiap anak tangga menambahkan jenis informasi yang tercermin di harga; makin ke kanan, makin sedikit strategi yang bisa menang.",
        "Interpretasi: di pasar bentuk lemah, analisis teknikal mati; di setengah kuat, fundamental pun sulit — hanya info privat (kuat) yang memberi edge, dan bentuk kuat hampir tak dipercaya penuh. Implikasi teks: makin efisien pasar, makin masuk akal indeksasi murah.",
      ],
      figure: {
        svg: EFISIENSI_SVG,
        alt: "Tangga tiga bentuk efisiensi pasar: lemah, setengah kuat, kuat — makin tinggi makin banyak informasi tercermin.",
        caption: "Tiga bentuk dari teks: lemah (harga lampau), setengah kuat (+ info publik), kuat (+ info privat). Anomali seperti momentum menunjukkan efisiensi adalah derajat, bukan saklar on-off.",
      },
      tasks: [],
      quiz: [
        {
          q: "Bentuk efisiensi: \u201charga lampau tidak berguna\u201d. Ini?",
          options: [
            { text: "Kuat", why: "Salah: kuat = bahkan info privat tercermin — hampir tak dipercaya." },
            { text: "Lemah (teknikal mati)", why: "Benar: lemah = info historis tercermin. Semi-kuat = + info publik (fundamental sulit).", correct: true },
            { text: "Semi-kuat", why: "Salah: semi-kuat mencakup info publik, bukan cuma historis." },
            { text: "Tidak ada", why: "Salah: ini definisi bentuk lemah." },
          ],
        },
      ],
      reference: "Lemah \u2192 teknikal mati. Semi-kuat \u2192 fundamental sulit. Kuat \u2192 hampir tak dipercaya.",
    },
    {
      id: "ddm",
      eyebrow: "Langkah 5 · DDM",
      title: "Gordon: dividen yang didiskon selamanya",
      prose: [
        "DDM Gordon: P0 = D1/(r\u2212g) — untuk growth konstan selamanya. D1 = Rp500, r = 12%, g = 5% \u2192 P0 = 500/0,07 = Rp7.143.",
        "Sensitivitasnya brutal: g naik ke 6% \u2192 500/0,06 = Rp8.333 (+17%). Asumsi growth = medan perang — 80%+ nilai DDM datang dari terminal. Syarat: perusahaan membagi dividen (atau bisa); tidak cocok untuk startup nir-dividen \u2192 pakai FCFE (arus kas bebas ke ekuitas = kas operasi \u2212 capex + net borrowing — mengukur kas yang benar-benar bisa dibagi ke pemegang saham, bukan sekadar dividen yang diumumkan).",
      ],
      formula: String.raw`P_0 = \frac{D_1}{r - g} \quad (g < r)`,
      formulaNote: "D1 = dividen tahun depan (Rp500); r = required return investor (12%); g = pertumbuhan dividen konstan selamanya (5% — harus lebih kecil dari r, atau penyebut nol/negatif dan model runtuh). Interpretasi: harga adalah dividen selamanya yang didiskon — dan 80%+ nilainya datang dari asumsi g, jadi rendah hatilah pada angkamu sendiri. Contoh angka: 500/(0,12 − 0,05) = Rp7.143; jika g = 6% → 500/0,06 = Rp8.333 (+17%) — satu poin asumsi mengubah valuasi seperenam.",
      tasks: [
        { id: "t1", text: "Hitung `p0` Gordon: D1=500, r=12%, g=5%" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "p0=7143",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai Gordon saat g \u2265 r (penyebut nol/negatif). Model tidak valid — pakai multistage. Dan jangan pakai DDM murni untuk emiten buyback-heavy: valuasi harus memakai total payout yield.",
      },
      hints: [
        "P0 = D1 / (r \u2212 g).",
        "r dan g dalam desimal.",
        "p0 = d1 / (r - g)",
      ],
      code: {
        starter: `d1, r, g = 500, 0.12, 0.05\n\n# TULIS KODEMU\np0 = \n\nprint(f"p0={p0:.0f}")`,
        lockLines: 1,
        solution: `d1, r, g = 500, 0.12, 0.05\n\n# TULIS KODEMU\np0 = d1 / (r - g)\n\nprint(f"p0={p0:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p0", value: 7142.86, tol: 1, label: "`p0` sekitar 7143", msg: "500/(0,12\u22120,05) = 7.143. Cek penyebut r\u2212g." },
          { kind: "stdout_matches", task: "t2", pattern: "p0=7143", label: "`print` menampilkan p0", msg: "Format: p0=... ." },
        ],
      },
      reference: "Gordon: P0 = D1/(r\u2212g). Butuh g < r. Sensitif ke asumsi g.",
    },
    {
      id: "valuasi-em",
      eyebrow: "Langkah 6 · Valuasi EM",
      title: "Tiga pajak tak terlihat dalam valuasi Indonesia",
      prose: [
        "Rumus CAPM standar memakai R_f dan premi pasar global — tetapi investor di Jakarta menghadapi risiko yang tidak ada di New York. Praktik ala Damodaran: r_e = R_f + β × MRP + CRP (country risk premium). Dengan R_f 4%, β 1,2, MRP 5%, dan CRP Indonesia ~2,5%: r_e = 4% + 6% + 2,5% = 12,5% — bukan 10%. Dampaknya brutal pada DDM: D1 Rp500, g 5% → tanpa CRP: 500/(0,10 − 0,05) = Rp10.000; dengan CRP: 500/(0,125 − 0,05) = Rp6.667 — valuasi susut sepertiga hanya karena mengakui risiko negara. Mengabaikan CRP = mengasumsikan Jakarta serisiko New York.",
        "Pajak kedua: illiquidity discount. Saham lapis tiga dengan spread bid-ask 5% dan volume harian Rp50 juta tidak bisa disamakan dengan blue chip yang likuid. Praktik: diskon 20–30% dari nilai DCF untuk saham tidak likuid — valuasi teoritis Rp10.000/saham menjadi Rp7.500 yang benar-benar bisa dieksekusi. Harga “teoritis” tidak ada artinya jika kamu tidak bisa keluar tanpa menggerakkan harga 10% melawan dirimu sendiri.",
        "Pajak ketiga: kapan multiple menipu. (1) P/E 4 di puncak siklus komoditas — E-nya sementara; normalisasi dengan rata-rata 7 tahun sebelum memutuskan “murah”. (2) P/B rendah pada bank dengan NPL tersembunyi — B-nya fiksi sampai kredit macet diakui. (3) EV/EBITDA rendah pada emiten dengan capex raksasa tiap tahun — EBITDA mengabaikan belanja modal yang tidak pernah berhenti. Aturan keputusan: multiple hanya untuk screening awal; keputusan memakai DCF ternormalisasi yang dipasangkan dengan bedah DuPont — murah tanpa kualitas laba = jebakan, bukan bargain.",
      ],
      tasks: [],
      formula: String.raw`r_e = R_f + \beta \times MRP + CRP`,
      formulaNote: "R_f = risk-free rate (4%); β = beta saham (1,2 — agresif); MRP = premi risiko pasar ekuitas (5%); CRP = country risk premium Indonesia (~2,5% — kompensasi risiko negara: politik, hukum, mata uang). Interpretasi: required return emiten EM = harga risiko global + pajak risiko negara — mengabaikan CRP membuat required return terlalu rendah dan valuasi terlalu tinggi. Contoh angka: 4% + 1,2 × 5% + 2,5% = 12,5%; DDM dengan D1 Rp500, g 5% → 500/0,075 = Rp6.667 vs Rp10.000 tanpa CRP.",
      note: {
        title: "Intuisi: valuasi EM = valuasi DM + tiga pajak tak terlihat",
        body: "Praktisi yang memvaluasi emiten Indonesia selalu menambahkan tiga penyesuaian — dan yang lupa ketiganya hampir pasti overvalue. Satu: country risk premium ~2–3% ke required return; tanpa ini kamu mengasumsikan penegakan kontrak di Jakarta sama mudahnya dengan di New York. Dua: illiquidity discount 20–30% untuk saham sepi transaksi — uji 10 detiknya: bisakah kamu menjual Rp1 miliar tanpa menggerakkan harga lebih dari 2%? Jika tidak, valuasi DCF-mu adalah fiksi akademis. Tiga: normalisasi earnings — jangan pernah memakai P/E dari laba puncak siklikal; emiten batu bara dengan P/E 4 di puncak harga biasanya lebih mahal daripada P/E 12 di lembah, karena E-nya akan menyusut 70%. Heuristik multiple: multiple menjawab “berapa”, bukan “mengapa” — P/E rendah + ROE rapuh dari leverage (bedah DuPont!) = jebakan, bukan bargain. Selalu pasangkan multiple dengan kualitas laba sebelum memutuskan murah atau mahal. Satu lagi: untuk valuasi EM, pakai skenario — bukan satu angka. Buat tiga kasus (base, rupiah melemah 20%, harga komoditas jatuh) dan lihat seberapa rapuh valuasimu; jika valuasi hanya menarik di skenario base, itu bukan margin of safety, itu harapan yang diberi rumus.",
      },
      quiz: [
        {
          q: "Saham Indonesia: R_f 4%, β 1,2, MRP 5%, CRP 2,5%. D1 Rp500, g 5%. Nilai wajar DDM?",
          options: [
            { text: "Rp10.000 (abaikan CRP)", why: "Salah: 500/(0,10−0,05) = 10.000 mengasumsikan Jakarta serisiko New York — valuasi overvalue sepertiga." },
            { text: "Rp6.667 (r_e = 12,5% dengan CRP)", why: "Benar: r_e = 4% + 6% + 2,5% = 12,5% → 500/0,075 = 6.667. Risiko negara adalah biaya nyata.", correct: true },
            { text: "Rp4.167", why: "Salah: cek penyebut 0,125 − 0,05 = 0,075." },
            { text: "Rp8.333", why: "Salah: itu hasil g = 6% tanpa CRP — dua kesalahan sekaligus." },
          ],
        },
      ],
      reference: "r_e = R_f + β×MRP + CRP. Diskon illikuiditas 20–30%. Normalisasi laba siklikal sebelum pakai multiple.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: dari order sampai valuasi saham",
      prose: [
        "Skenario 1 — Ingin eksekusi cepat vs harga pasti. → Market order = eksekusi segera, bayar spread; limit order = harga pasti atau lebih baik, tetapi bisa tidak tereksekusi; stop order = cut loss otomatis.",
        "Skenario 2 — Trading dengan margin. → Hitung titik margin call DULU: (P − pinjaman)/P = maintenance. Tahu kapan broker menelepon sebelum buka posisi — leverage simetris: +40% kemarin bisa jadi −60% + forced selling hari ini.",
        "Skenario 3 — Membaca 'pasar naik/turun'. → Tanya metodenya: price-weighted (Dow) memberi bobot ke harga saham — aneh tetapi nyata; cap-weighted (IHSG) = standar; equal-weighted = tilt small-cap. Cerita berbeda dari komposisi berbeda.",
        "Skenario 4 — Memilih aktif vs indeks. → Makin efisien pasar, makin sulit alpha konsisten — makin masuk akal indeksasi murah. Efisiensi adalah derajat, bukan biner.",
        "Skenario 5 — Valuasi saham dividen stabil. → DDM Gordon P0 = D1/(r−g); untuk Indonesia tambah country risk premium; saham tidak likuid → diskon 20–30%. Harga teoritis tanpa likuiditas tidak bisa dieksekusi.",
        "Aturan praktis 10 detik: eksekusi → jenis order; leverage → titik call; 'pasar' → cek metode indeks; aktif vs pasif → uji efisiensi; dividen stabil → DDM + CRP.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai DDM tanpa country risk premium untuk emiten Indonesia. Mengabaikan CRP 2,5% bisa meng-overvalue puluhan persen — valuasi yang terlihat konservatif ternyata fantasi.",
      },
    },
    {
      id: "minicase-andi",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Andi, cut loss, dan sizing yang benar",
      prose: [
        "Andi: posisi Rp100jt, margin 50% (pinjam Rp50jt), maintenance 30%. Ia tambah posisi Rp25jt (margin lagi) lalu pasar turun total 30% dari awal \u2192 ekuitas \u2248 Rp12,5jt dari modal Rp75jt = \u221283% + forced sell di bottom sebelum rebound.",
        "Jika ia cut loss di \u221215% (tanpa tambah posisi): posisi \u2192 Rp85jt; ekuitas = 85 \u2212 50 = Rp35jt; rugi \u221230% (Rp15jt). Cut loss \u201cmahal\u201d Rp15jt menghemat Rp47,5jt dibanding skenario aktual. Disiplin = murah.",
        "Tiga aturan leverage yang dilanggar: (1) tidak hitung titik call; (2) menambah posisi saat rugi (averaging down berleverage); (3) sizing terlalu besar untuk volatilitas IHSG. Position sizing benar: tentukan max loss per posisi (mis. 2% portofolio), hitung jarak ke stop-loss dan ke titik margin call, lalu ukuran posisi = max_loss / jarak_risiko.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Leverage = akselerator, bukan strategi. Untuk IHSG (vol \u2248 20%), posisi margin 50% dengan 100% portofolio = sizing yang tidak bertanggung jawab; maksimal 20\u201330% portofolio untuk posisi berleverage.",
      },
      reference: "Hitung titik call dulu. Cut loss mekanis. Sizing = max_loss / jarak_risiko.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: margin, indeks, DDM, dan short.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Posisi Rp100jt, pinjam Rp50jt, maintenance 30%. Margin call di penurunan?",
          options: [
            { text: "15%", why: "Salah: itu penurunan contoh IHSG, bukan titik call." },
            { text: "28,6%", why: "Benar: (P\u221250)/P = 0,30 \u2192 P = 71,4 \u2192 turun 28,6%. Hitung SEBELUM buka posisi.", correct: true },
            { text: "50%", why: "Salah: itu rasio margin awal, bukan titik call." },
            { text: "30%", why: "Salah: 30% adalah maintenance margin, bukan % penurunannya." },
          ],
        },
        {
          q: "Saham C: harga tertinggi tetapi cap terkecil. Dominan di indeks?",
          options: [
            { text: "Cap-weighted", why: "Salah: di cap-weighted, C nyaris tak berarti (cap terkecil)." },
            { text: "Price-weighted (bobot by harga)", why: "Benar: price-weighted menimbang by harga — anomali Dow. Itulah kenapa standar industri = cap-weighted.", correct: true },
            { text: "Equal-weighted", why: "Salah: equal-weighted memberi semua bobot sama." },
            { text: "Tidak ada", why: "Salah: price-weighted jelas didominasi saham termahal." },
          ],
        },
        {
          q: "D1 Rp500, r 12%, g 5%. Nilai DDM?",
          options: [
            { text: "Rp4.167", why: "Salah: cek penyebut 0,12\u22120,05 = 0,07." },
            { text: "Rp7.143", why: "Benar: 500/(0,12\u22120,05) = 7.143. Sensitif: g 6% \u2192 8.333 (+17%). Asumsi growth = medan perang.", correct: true },
            { text: "Rp10.000", why: "Salah: itu 500/0,05 — memakai g sebagai penyebut." },
            { text: "Rp5.000", why: "Salah: itu 500/0,10 — memakai r sebagai penyebut." },
          ],
        },
        {
          q: "Short 1.000 lembar @Rp100.000. Harga naik ke Rp130.000. P/L dan pelajaran utama?",
          options: [
            { text: "+Rp30M — short selalu profit saat volatil", why: "Salah: harga naik = short rugi. Volatilitas bukan profit." },
            { text: "\u2212Rp30M — rugi short tak terbatas, butuh stop-loss", why: "Benar: (100rb\u2212130rb)\u00d71.000 = \u2212Rp30M. Short tanpa stop-loss dan batas posisi = bunuh diri finansial.", correct: true },
            { text: "Rp0 — short tidak ada P/L sampai cover", why: "Salah: P/L mark-to-market tetap dihitung meski belum cover." },
            { text: "\u2212Rp15M — rugi dibatasi margin awal", why: "Salah: margin awal tidak membatasi rugi short." },
          ],
        },
      ],
      summary: [
        "Order: market (cepat), limit (harga), stop (disiplin).",
        "Margin: leverage pengganda dua arah; hitung titik call sebelum buka posisi.",
        "Indeks: pahami metodologi (cap vs price, free float) sebelum percaya benchmark.",
        "Efisiensi: lemah \u2192 semi-kuat \u2192 kuat; derajat, bukan biner.",
        "DDM: P0 = D1/(r\u2212g); 80%+ nilai dari terminal — rendah hati pada asumsi.",
      ],
      next: { label: "PM-A6B — Equity: DDM Multi-Stage, FCFE & Kelipatan Wajar", href: "/v2/learn/pm-a6b-valuasi-lanjutan" },
    },
  ],
};
