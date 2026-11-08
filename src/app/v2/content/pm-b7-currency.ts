import type { V2Lesson } from "../lib/types";

// Komponen return carry trade JPY-AUD: bunga +5,5%, kurs -20%, total -14,5%.
const CARRY_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Batang return carry trade JPY-AUD: selisih bunga +5,5 persen, kurs 2008 minus 20 persen, return total minus 14,5 persen, kumulatif 2005-2007 +16,5 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="90" y1="28" x2="90" y2="216"/><line x1="180" y1="28" x2="180" y2="216"/><line x1="360" y1="28" x2="360" y2="216"/><line x1="450" y1="28" x2="450" y2="216"/></g>
<line x1="270" y1="28" x2="270" y2="216" stroke="var(--text)" stroke-width="1.5" opacity="0.5"/>
<g fill="var(--chart-text)" font-size="9.5" font-family="var(--font-ui)" text-anchor="middle"><text x="90" y="20">-25%</text><text x="180" y="20">-12,5%</text><text x="270" y="20">0</text><text x="360" y="20">+12,5%</text><text x="450" y="20">+25%</text></g>
<g font-size="10.5" fill="var(--text)" font-family="var(--font-ui)"><text x="8" y="38">Selisih bunga: pinjam JPY 0,5%, beli AUD 6%</text><text x="8" y="84">Pergerakan kurs 2008: JPY menguat 20%</text><text x="8" y="130">Return total 2008</text><text x="8" y="176">Return kumulatif 2005–2007</text></g>
<rect x="270" y="45" width="39.6" height="26" fill="var(--c1)"/>
<rect x="126" y="91" width="144" height="26" fill="var(--c2)"/>
<rect x="165.6" y="137" width="104.4" height="26" fill="var(--c3)"/>
<rect x="270" y="183" width="118.8" height="26" fill="var(--c4)"/>
<g font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)"><text x="316" y="63">+5,5%</text><text x="121" y="109" text-anchor="end">−20%</text><text x="160.6" y="155" text-anchor="end">−14,5%</text><text x="394" y="201">+16,5%</text></g>
</svg>`;

export const pmb7: V2Lesson = {
  slug: "pm-b7-currency",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B7 Currency: Paritas & Carry Trade",
  estMinutes: 55,
  steps: [
    {
      id: "paritas",
      eyebrow: "Langkah 1 · Paritas",
      title: "\u2018Uang gratis\u2019 carry trade yen",
      prose: [
        "2005\u20132007: hedge fund meminjam yen 0,5%, membeli AUD 6% — selisih 5,5% \u2018gratis\u2019 per tahun. Triliunan dolar mengalir. Agustus 2007 & 2008: yen menguat 20% dalam minggu — carry trader rugi 4 tahun profit dalam sebulan. \u201cNaik tangga, turun lift.\u201d",
        "Twist-nya: uncovered IRP berkata selisih bunga harusnya dihapus depresiasi — tetapi empiris gagal (forward premium puzzle): carry profitable \u2026 sampai crash. Profit kecil stabil + rugi besar jarang = distribusi miring. Lesson ini: harga \u2018uang gratis\u2019.",
        "Covered IRP: F = S\u00d7(1+r_d)/(1+r_f) — pasti berlaku (arbitrase jika tidak). Uncovered IRP: E(%\u0394S) \u2248 r_d \u2212 r_f — sering gagal empiris. PPP relatif: %\u0394S \u2248 \u03c0_d \u2212 \u03c0_f (kurs mengikuti inflasi). International Fisher: r_d \u2212 r_f \u2248 E(\u03c0_d) \u2212 E(\u03c0_f). Rantai Fisher \u2192 PPP \u2192 IRP: semua tentang ekspektasi, bukan jaminan.",
      ],
      formula: String.raw`F = S\frac{1+r_d}{1+r_f} \quad;\quad \%\Delta S \approx \pi_d - \pi_f \ (\text{PPP relatif})`,
      formulaNote: "F = forward wajar; S = spot kini; r_d/r_f = bunga domestik/asing (r_d di pembilang). Contoh: 16.000×1,06/1,05 = 16.152 — PASTI via arbitrase. PPP relatif: %ΔS ≈ π_d − π_f — kurs mengikuti selisih inflasi; jangkar jangka panjang, bukan sinyal trading (empiris sering gagal jangka pendek).",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cCarry trade adalah arbitrase bebas risiko\u201d — SALAH. Carry = uncovered = risiko kurs penuh. Yang bebas risiko = covered IRP (return NOL).",
      },
      reference: "Covered = pasti (arbitrase). Uncovered & PPP = ekspektasi; empiris sering gagal jangka pendek.",
    },
    {
      id: "irp",
      eyebrow: "Langkah 2 · Covered IRP",
      title: "Forward yang wajar — pasti",
      prose: [
        "S = Rp16.000/USD, r_IDR = 6%, r_USD = 5%. Forward wajar 1 tahun: F = 16.000 \u00d7 1,06/1,05 = 16.152. Covered IRP = arbitrase — pasti berlaku. Jika pasar quote 16.500, arbitrager meminjam IDR, konversi spot, invest USD, jual forward — sampai celah tertutup.",
        "Untuk eksportir yang mengunci kurs jual dolar di masa depan (terima rupiah pasti, lepas risiko kurs), forward inilah harga pasarnya — bukan tebakan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung forward wajar `f`: S=16000, r_IDR=6%, r_USD=5%" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "f=16152",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Tertukar r_d dan r_f. r domestik (IDR) di pembilang: F = S \u00d7 (1+r_IDR)/(1+r_USD). Bunga IDR lebih tinggi \u2192 forward IDR lebih lemah (angka lebih besar).",
      },
      hints: [
        "F = S \u00d7 (1+r_d)/(1+r_f).",
        "r_d = r_IDR (domestik), r_f = r_USD.",
        "f = s * (1 + r_idr) / (1 + r_usd)",
      ],
      code: {
        starter: `s, r_idr, r_usd = 16000, 0.06, 0.05\n\n# TULIS KODEMU\nf = \n\nprint(f"f={f:.0f}")`,
        lockLines: 1,
        solution: `s, r_idr, r_usd = 16000, 0.06, 0.05\n\n# TULIS KODEMU\nf = s * (1 + r_idr) / (1 + r_usd)\n\nprint(f"f={f:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "f", value: 16152, tol: 1, label: "`f` sekitar 16152", msg: "16.000\u00d71,06/1,05 = 16.152. r domestik di pembilang." },
          { kind: "stdout_matches", task: "t2", pattern: "f=16152", label: "`print` menampilkan f", msg: "Format: f=... ." },
        ],
      },
      reference: "Covered IRP: F = S(1+r_d)/(1+r_f). Arbitrase memastikan kewajaran.",
    },
    {
      id: "carry",
      eyebrow: "Langkah 3 · Carry Trade + chart",
      title: "Memungut koin di rel kereta",
      prose: [
        "Carry trade: pinjam mata uang bunga rendah (funding: JPY, CHF), beli bunga tinggi (target: AUD, EM) — kantongi selisih. Return = selisih bunga + apresiasi target. Crash risk: saat risk-off, funding currency menguat tajam (unwind massal) \u2192 rugi besar mendadak.",
        "Matematika 2008: pinjam JPY 0,5%, beli AUD 6% \u2192 carry +5,5%/tahun. 2005\u20132007: total +16,5%. 2008: JPY menguat 20% vs AUD \u2192 return = +5,5% \u2212 20% = \u221214,5% — menghapus hampir semua profit 3 tahun.",
        "Skew negatif: menang kecil sering, kalah besar jarang — seperti jual asuransi (premi rutin, klaim bencana). Expected return carry = selisih bunga \u2212 expected crash. Tanpa memodelkan ekor, carry = bom waktu.",
        "Cara membaca: batang horizontal = persen; ke kanan = positif, ke kiri = negatif; empat baris = komponen return carry JPY–AUD.",
        "Interpretasi: selisih bunga +5,5% terlihat manis dan tiga tahun mengumpul +16,5% — tetapi satu tahun risk-off (JPY menguat 20%) menghapus semuanya menjadi −14,5%; carry = menang kecil sering, kalah besar jarang.",
      ],
      figure: {
        svg: CARRY_SVG,
        alt: "Batang komponen return carry trade JPY-AUD: bunga, kurs, total, dan kumulatif.",
        caption: "Komponen return carry trade JPY–AUD: selisih bunga +5,5% vs guncangan kurs −20% — satu tahun buruk menghapus tiga tahun carry.",
      },
      tasks: [
        { id: "t1", text: "Hitung `ret` carry 2008: bunga +5,5%, funding menguat 20%" },
        { id: "t2", text: "Cetak sebagai persen 1 desimal" },
      ],
      expected: "ret=-14.5%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Leverage 3x pada carry 2008: \u221214,5% \u00d7 3 = \u221243,5% \u2014 praktis margin call. Carry + leverage = menjual asuransi tanpa cadangan klaim. Sizing carry \u2264 2% portofolio, pakai stop-loss.",
      },
      hints: [
        "Return = selisih bunga + perubahan kurs (menguatnya funding = negatif).",
        "5,5 + (\u221220) = ?",
        "ret = bunga + fx",
      ],
      code: {
        starter: `bunga, fx = 5.5, -20.0  # fx negatif = funding menguat\n\n# TULIS KODEMU\nret = \n\nprint(f"ret={ret:.1f}%")`,
        lockLines: 1,
        solution: `bunga, fx = 5.5, -20.0  # fx negatif = funding menguat\n\n# TULIS KODEMU\nret = bunga + fx\n\nprint(f"ret={ret:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "ret", value: -14.5, tol: 1e-9, label: "`ret` seharusnya \u221214.5", msg: "5,5 \u2212 20 = \u221214,5%. Naik tangga, turun lift." },
          { kind: "stdout_matches", task: "t2", pattern: "ret=-14\\.5%", label: "`print` menampilkan persen", msg: "Format persen: ret=-14.5%." },
        ],
      },
      reference: "Carry = selisih bunga \u2212 crash. Skew negatif: sizing kecil, stop-loss.",
    },
    {
      id: "ppp",
      eyebrow: "Langkah 4 · PPP",
      title: "Big Mac sebagai jangkar kurs",
      prose: [
        "Big Mac AS USD 5, Indonesia Rp35.000, kurs 15.000 Rp/USD. PPP tersirat = 35.000/5 = Rp7.000/USD. Rupiah undervalued \u2248 (15.000\u22127.000)/15.000 = 53% menurut burger.",
        "PPP = jangkar jangka panjang, BUKAN sinyal trading bulanan. Harga kaku jangka pendek — PPP butuh waktu bertahun-tahun untuk bekerja. Proyeksi 5 tahun (PPP relatif): S_fwd = S \u00d7 ((1+\u03c0_ID)/(1+\u03c0_US))^5.",
      ],
      formula: String.raw`S_{PPP} = \frac{P_{domestik}}{P_{asing}}`,
      formulaNote: "S_PPP = kurs 'wajar' versi paritas daya beli; P_domestik/P_asing = harga barang yang sama. Contoh Big Mac: 35.000/5 = Rp7.000/USD → rupiah undervalued ≈ 53% menurut burger. Horizon: tahunan — harga kaku jangka pendek, PPP butuh waktu bekerja.",
      tasks: [
        { id: "t1", text: "Hitung kurs PPP `ppp`: burger RI 35000, AS $5" },
        { id: "t2", text: "Hitung `und` % undervalued vs kurs 15000, cetak keduanya" },
      ],
      expected: "ppp=7000  und=53.3%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Trading dari PPP jangka pendek. PPP butuh waktu bekerja — untuk trading, pakai IRP/aliran modal. PPP untuk valuasi 5-tahunan.",
      },
      hints: [
        "PPP = harga domestik / harga asing.",
        "Undervalued = (kurs \u2212 PPP)/kurs \u00d7 100%.",
        "ppp = burger_id / burger_us\nund = (kurs - ppp) / kurs * 100",
      ],
      code: {
        starter: `burger_id, burger_us, kurs = 35000, 5, 15000\n\n# TULIS KODEMU\nppp = \nund = \n\nprint(f"ppp={ppp:.0f}  und={und:.1f}%")`,
        lockLines: 1,
        solution: `burger_id, burger_us, kurs = 35000, 5, 15000\n\n# TULIS KODEMU\nppp = burger_id / burger_us\nund = (kurs - ppp) / kurs * 100\n\nprint(f"ppp={ppp:.0f}  und={und:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "ppp", value: 7000, tol: 1e-9, label: "`ppp` seharusnya 7000", msg: "35.000/5 = 7.000." },
          { kind: "equal", task: "t2", name: "und", value: 53.33, tol: 0.1, label: "`und` sekitar 53.3", msg: "(15.000\u22127.000)/15.000 = 53,3%." },
          { kind: "stdout_matches", task: "t2", pattern: "ppp=7000\\s+und=53\\.3%", label: "`print` menampilkan keduanya", msg: "Format: ppp=...  und=...%." },
        ],
      },
      reference: "PPP = jangkar jangka panjang. Harga kaku jangka pendek.",
    },
    {
      id: "em-trilemma",
      eyebrow: "Langkah 5 · Trilemma & EM",
      title: "Pilih dua, korbankan satu",
      prose: [
        "Impossible trinity: (a) kurs tetap, (b) arus modal bebas, (c) kebijakan moneter independen — maksimal dua. Tiga pilihan dunia nyata: AS (modal bebas + independen, korbankan kurs tetap); Hong Kong (kurs tetap + modal bebas, korbankan independen — suku bunga ikut The Fed); China dulu (kurs terkendali + independen, korbankan modal bebas).",
        "Indonesia: moneter independen + modal bebas \u2192 managed float. Untuk EM: saat krisis dan cadangan menipis \u2192 kurangi eksposur/hedge (1998, 2013 taper tantrum). Funding currency dari bank sentral intervensionis = risiko ekor politik (SNB 2015: melepas peg EUR/CHF \u2192 franc +30% sehari).",
        "Hedging korporat: natural hedge dulu (biaya USD, pendapatan USD \u2192 jangan over-hedge). Exposure bersih + horizon < 1 tahun \u2192 forward. Ketidakpastian volume \u2192 opsi. Hedge arus kas, bukan laporan akuntansi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jangan carry saat: (1) volatilitas tersirat tinggi; (2) bank sentral intervensi; (3) krisis likuiditas global (unwind massal = crowded trade). Carry terbaik = saat semua tenang dan tidak ada yang membicarakannya.",
      },
      quiz: [
        {
          q: "Trilemma: pilih 2 dari 3. Indonesia memilih?",
          options: [
            { text: "Kurs tetap + modal bebas", why: "Salah: itu pilihan Hong Kong — mengorbankan moneter independen." },
            { text: "Moneter independen + modal bebas (managed float)", why: "Benar: BI independen + modal relatif bebas \u2192 kurs mengambang terkendali. Tidak bisa ketiganya.", correct: true },
            { text: "Kurs tetap + independen", why: "Salah: itu butuh capital control (pilihan China dulu)." },
            { text: "Ketiganya", why: "Salah: impossible trinity — maksimal dua." },
          ],
        },
      ],
      reference: "Trilemma: kurs tetap / independen / modal bebas — pilih 2. Indonesia: managed float.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: bermain mata uang dengan sadar risiko",
      prose: [
        "Skenario 1 — Eksportir ingin mengunci kurs jual dolar. → Forward wajar dari covered IRP: F = S × (1+r_d)/(1+r_f). Itu harga pasarnya — bukan tebakan.",
        "Skenario 2 — Tergoda carry trade (pinjam JPY 0,5%, beli AUD 6%). → Ingat distribusinya: profit kecil stabil + crash besar yang jarang. 'Naik tangga, turun lift' — dan leverage carry = bunuh diri.",
        "Skenario 3 — Menilai kewajaran kurs jangka panjang. → PPP (Big Mac) sebagai jangkar. Bukan sinyal trading bulanan — harga kaku jangka pendek, PPP butuh bertahun-tahun.",
        "Skenario 4 — Menganalisis kebijakan negara EM. → Trilemma: maksimal dua dari kurs tetap, modal bebas, moneter independen. Funding currency dari bank sentral intervensionis = risiko ekor politik (SNB 2015).",
        "Skenario 5 — Memutuskan hedge atau tidak. → Hedge bila eksposur pasti dan (volatilitas × eksposur) > 3× biaya. Natural hedge atau eksposur tak pasti volumenya → opsi atau biarkan.",
        "Aturan praktis 10 detik: kunci kurs → IRP forward; carry → ingat crash; jangka panjang → PPP; kebijakan EM → trilemma; hedge? → bandingkan biaya vs risiko.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melihat 'selisih bunga 5,5% gratis' tanpa menghitung crash risk. Uncovered IRP 'gagal' rata-rata justru karena ada premi risiko crash yang jarang terealisasi — gagal rata-rata, benar saat bencana.",
      },
    },
    {
      id: "minicase-yen",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Carry yang bertanggung jawab",
      prose: [
        "Carry JPY (0,5%) \u2192 AUD (6%): profit +5,5%/tahun 2005\u20132007. 2008: yen menguat 20% \u2192 return \u221214,5% — menghapus 3 tahun profit sebulan. Manajer yang me-leverage 5x \u2192 \u221272,5% \u2192 margin call & likuidasi.",
        "Kenapa uncovered IRP \u2018gagal\u2019? Forward premium puzzle: bunga tinggi tidak diimbangi depresiasi rata-rata — karena ada premi risiko crash yang jarang terealisasi. Gagal rata-rata, benar saat bencana.",
        "Desain carry yang bertanggung jawab: sizing \u2264 2%, stop-loss (unwind otomatis), diversifikasi funding/target, cadangan kas untuk margin. Carry = strategi pendapatan, bukan core. Leverage mengubah \u201ckerugian buruk\u201d menjadi \u201ckematian\u201d.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jika leverage 5x: \u221214,5% \u00d7 5 = \u221272,5% — broker melikuidasi sebelum \u2212100%. Pelajaran: leverage mengubah kerugian buruk menjadi kematian.",
      },
      reference: "Carry = jual asuransi; sizing kecil, stop-loss, tanpa leverage besar.",
    },
    {
      id: "arbitrase-keputusan-hedge",
      eyebrow: "Langkah 8 · Arbitrase & keputusan hedge",
      title: "Cek silang tiga quote, putuskan kapan hedge",
      prose: [
        "Triangular arbitrage konseptual: tiga quote harus konsisten. USD/IDR 16.000, EUR/USD 1,08 → EUR/IDR tersirat = 17.280. Pasar quote 17.100 → siklus: Rp17.100.000 → 1.000 EUR → 1.080 USD → Rp17.280.000 = +Rp180rb (+1,05%) sebelum biaya. Praktik: celah hidup milidetik (algo HFT), biaya + slippage membunuh — untuk manusia ini alat cek kewajaran quote, bukan mesin uang. Bila hitunganmu “menemukan” arbitrase besar, yang salah biasanya pemahamanmu tentang biaya, bukan pasarnya.",
        "Keputusan hedging mata uang: kapan hedge — eksposur pasti (kontrak ditandatangani), horizon < 1 tahun, biaya carry murah → kunci dengan forward. Kapan tidak — natural hedge (biaya & pendapatan sama-sama USD), eksposur tak pasti volumenya (opsi lebih cocok), biaya > risiko. Biaya carry = selisih bunga: r_IDR 6% vs r_USD 5% → hedge receivable USD cost ≈ 1%/tahun. Aturan: hedge bila (volatilitas × eksposur) > 3× biaya; bila tidak, biarkan mengambang — hedge yang lebih mahal dari risikonya = premi asuransi yang tidak masuk akal.",
        "Eksposur IDR: managed float — BI intervensi menahan volatilitas harian, tetapi saat stress (taper tantrum 2013) forward points melebar tajam → biaya hedge melonjak tepat saat paling dibutuhkan. Pelajaran: hedge saat tenang (murah), bukan saat krisis (mahal). Eksportir: kunci forward saat IDR kuat; importir: jangan menunggu IDR lemah untuk mulai hedge.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: forward itu aritmetika, bukan ramalan",
        body: "Empat pegangan praktisi valas. Pertama: forward bukan prediksi — ia aritmetika selisih bunga; membaca arah kurs dari forward sama salahnya dengan membaca cuaca dari termometer. Kedua: carry = menjual asuransi — sebelum masuk, tanya “premi per tahun vs klaim saat bencana”; bila tidak bisa menjawab, kamu bukan investor melainkan donatur. Ketiga: beli payung saat cerah — hedge IDR murah saat tenang, mahal saat krisis; program hedging tahunan yang baru jalan saat rupiah melemah = membeli di puncak premi. Keempat: hormati bank sentral — intervensi BI membuat pola teknikal gagal berulang; untuk IDR, kalender RDG dan cadangan devisa adalah indikator yang lebih jujur dari RSI. Valas menghukum yang pintar tetapi tidak disiplin, dan memberi makan yang disiplin meski tidak pintar. Kelima: pisahkan eksposur translasi vs transaksi — translasi (laporan konsolidasi) jarang perlu di-hedge karena tidak ada arus kas; yang di-hedge adalah eksposur transaksi (kas riil). Hedge akuntansi tanpa kas = membayar premi untuk angka di kertas.",
      },
      reference: "Triangular = cek kewajaran quote. Hedge bila risiko > 3× biaya. Hedge saat tenang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: IRP, carry, paritas, PPP, dan leverage.",
      ],
      tasks: [],
      quiz: [
        {
          q: "S=16.000, r_IDR=6%, r_USD=5%. Forward wajar 1 tahun?",
          options: [
            { text: "16.000", why: "Salah: forward \u2260 spot kecuali selisih bunga nol." },
            { text: "16.152", why: "Benar: 16.000\u00d71,06/1,05 = 16.152. Covered IRP = arbitrase, pasti berlaku.", correct: true },
            { text: "15.850", why: "Salah: arah salah — bunga IDR lebih tinggi \u2192 forward lebih lemah (angka lebih besar)." },
            { text: "16.500", why: "Salah: terlalu tinggi; hitung 16.000\u00d71,06/1,05." },
          ],
        },
        {
          q: "Carry +5,5%/tahun, lalu funding currency menguat 20%. Return tahun itu?",
          options: [
            { text: "+5,5%", why: "Salah: itu return tahun tenang — tanpa crash." },
            { text: "\u221214,5%", why: "Benar: 5,5% \u2212 20% = \u221214,5%. Naik tangga, turun lift — skew negatif carry.", correct: true },
            { text: "+25,5%", why: "Salah: menjumlahkan — arah kursnya berlawanan." },
            { text: "0%", why: "Salah: hitung 5,5 \u2212 20." },
          ],
        },
        {
          q: "Bedakan covered vs uncovered IRP.",
          options: [
            { text: "Sama", why: "Salah: satu pasti, satu ekspektasi." },
            { text: "Covered = arbitrase pasti; uncovered = ekspektasi, sering gagal", why: "Benar: covered dijamin arbitrase; uncovered = hipotesis yang empiris gagal (forward premium puzzle).", correct: true },
            { text: "Uncovered pasti", why: "Salah: kebalikannya — uncovered yang sering gagal." },
            { text: "Covered untuk saham", why: "Salah: IRP soal kurs valas, bukan saham." },
          ],
        },
        {
          q: "PPP paling berguna untuk?",
          options: [
            { text: "Trading harian", why: "Salah: harga kaku jangka pendek — PPP butuh waktu." },
            { text: "Jangkar kurs jangka panjang (tahunan)", why: "Benar: untuk trading, pakai IRP/aliran modal.", correct: true },
            { text: "Opsi mingguan", why: "Salah: horizon terlalu pendek untuk PPP." },
            { text: "Tidak berguna", why: "Salah: PPP berguna sebagai jangkar valuasi jangka panjang." },
          ],
        },
        {
          q: "Carry JPY\u2192AUD: bunga +5,5%, yen menguat 20% (2008). Dengan leverage 3x, return & nasib?",
          options: [
            { text: "+16,5% — leverage memperbesar untung", why: "Salah: tahun 2008 rugi, bukan untung." },
            { text: "\u221243,5% — margin call; leverage mengubah rugi jadi kematian", why: "Benar: \u221214,5%\u00d73 = \u221243,5%, praktis margin call.", correct: true },
            { text: "\u221214,5% — leverage tidak berpengaruh", why: "Salah: leverage mengalikan return — untung maupun rugi." },
            { text: "+5,5% — bunga tidak terpengaruh kurs", why: "Salah: return carry = bunga + perubahan kurs." },
          ],
        },
      ],
      summary: [
        "Covered IRP: F = S(1+r_d)/(1+r_f) — arbitrase, pasti.",
        "Uncovered IRP & PPP: ekspektasi; empiris sering gagal jangka pendek.",
        "Carry trade: selisih bunga \u2212 crash = skew negatif; sizing kecil.",
        "Trilemma: kurs tetap / moneter independen / modal bebas — pilih 2.",
        "Aturan: IRP untuk pricing, PPP untuk jangkar panjang.",
      ],
      next: { label: "PM-B8 — Faktor & Risiko: VaR, ES & Greeks", href: "/v2/learn/pm-b8-faktor-risiko" },
    },
  ],
};
