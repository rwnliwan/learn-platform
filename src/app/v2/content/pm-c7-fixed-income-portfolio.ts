import type { V2Lesson } from "../lib/types";

// Bar key rate duration (KRD) per tenor kunci untuk portofolio Rp1 miliar
// contoh di lesson: KRD 2thn = 0,8; 5thn = 2,1; 10thn = 3,4; 20thn = 1,2
// (total = effective duration 7,5). Bar 10thn disorot: sumber +1,7% pada
// skenario twist di prose.
const KEYRATE_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Bar key rate duration per tenor: 2 tahun 0,8; 5 tahun 2,1; 10 tahun 3,4; 20 tahun 1,2; total 7,5.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">4,0</text><text x="54" y="124">2,0</text><text x="54" y="224">0</text></g>
<rect x="80" y="176" width="70" height="44" fill="var(--c2)"/>
<rect x="190" y="103" width="70" height="117" fill="var(--c2)"/>
<rect x="300" y="31" width="70" height="189" fill="var(--c1)"/>
<rect x="410" y="153" width="70" height="67" fill="var(--c2)"/>
<g fill="var(--text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="115" y="168">0,8</text><text x="225" y="95">2,1</text><text x="335" y="23">3,4</text><text x="445" y="145">1,2</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="115" y="240">tenor 2 thn</text><text x="225" y="240">tenor 5 thn</text><text x="335" y="240">tenor 10 thn</text><text x="445" y="240">tenor 20 thn</text></g>
<text x="335" y="215" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">twist: 10thn -50bp -&gt; +1,7%</text>
<text x="115" y="215" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">2thn +100bp -&gt; -0,8%</text>
<text x="490" y="14" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">total = 7,5</text>
</svg>`;

export const pmc7: V2Lesson = {
  slug: "pm-c7-fixed-income-portfolio",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C7 — Fixed Income Portfolio",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-beasiswa",
      eyebrow: "Langkah 1 · Cerita",
      title: "Janji Rp1 miliar 10 tahun lagi",
      prose: [
        "Sebuah yayasan beasiswa harus membayar Rp1 miliar dalam 10 tahun. Bendahara membeli obligasi 10 tahun \u2014 \u2018kan jatuh temponya pas? Tahun 2022: suku bunga naik 3% \u2192 harga obligasi anjlok 25%. Panik? Tidak perlu \u2014 jika dipegang sampai jatuh tempo, Rp1 miliar tetap terbayar, bahkan kupon yang direinvestasikan kini berbunga lebih tinggi.",
        "Twist-nya: risiko harga (rate naik \u2192 harga turun) dan risiko reinvestasi (rate turun \u2192 kupon reinvest rendah) saling meniadakan tepat di titik duration. Inilah imunisasi \u2014 keajaiban matematika obligasi: kunci kewajiban agar terpenuhi apapun pergerakan suku bunga.",
        "Lesson ini tentang tiga teknik imunisasi, tiga arsitektur portofolio (ladder, barbell, bullet), dan kapan strategi aktif obligasi layak dijalankan.",
      ],
      note: {
        title: "Intuisi: obligasi adalah janji yang diperdagangkan",
        body: "Tiga heuristik praktisi fixed income. Pertama, selalu baca obligasi dari sisi kewajibannya dulu: “kapan uang ini harus ada, dalam mata uang apa, seberapa pasti?” — baru pilih obligasinya. Kebanyakan kesalahan FI datang dari membeli obligasi “menarik” (yield tinggi) lalu dipaksa menjual di waktu yang salah. Kedua, yield adalah janji bersyarat: YTM 7% hanya terealisasi jika (a) dipegang sampai jatuh tempo, (b) kupon direinvestasikan pada yield yang sama, (c) penerbit tidak default — tiga syarat yang jarang terpenuhi bersamaan, jadi perlakukan YTM sebagai skenario, bukan garansi. Ketiga, dalam obligasi, yang tidak terlihat lebih penting dari yang terlihat: risiko reinvestasi, opsi tersembunyi (callable), dan likuiditas saat krisis. Amatir membandingkan yield; profesional membandingkan yield setelah ketiga hal tak terlihat itu. Keempat, untuk setiap obligasi, tanyakan siapa yang menjual opsi ke siapa: callable = kamu menjual opsi ke penerbit; putable = kamu membeli opsi dari penerbit \u2014 harga wajarnya harus mencerminkan itu. Kelima, ladder bukan strategi pasif yang membosankan \u2014 ia adalah DCA-nya obligasi: ia menghilangkan kebutuhan menebak suku bunga, yang merupakan tebakan paling mahal di fixed income.",
      },
      tasks: [],
      reference: "Imunisasi = price risk vs reinvestment risk impas di duration.",
    },
    {
      id: "imunisasi",
      eyebrow: "Langkah 2 · Imunisasi",
      title: "Cocokkan duration, bukan maturity",
      prose: [
        "Tiga teknik imunisasi. (1) Cash-flow matching (dedikasi): arus kas aset persis = kewajiban \u2014 paling aman, paling mahal. (2) Duration matching: Macaulay duration aset = horizon kewajiban. (3) Horizon matching: kombinasi \u2014 kewajiban dekat di-cash-flow-match, yang jauh di-duration-match. Syaratnya: rebalance berkala (duration meleset seiring waktu!) dan hanya melindungi parallel shift \u2014 twist kurva butuh key-rate duration.",
        "Contoh CFA: kewajiban Rp1 miliar 10 tahun, yield 5%. PV kewajiban = 1.000/1,05^10 = Rp614 juta. Tersedia obligasi A (5 tahun) dan B (15 tahun): 10 = w×5 + (1−w)×15 \u2192 w = 0,5, jadi Rp307 juta di A + Rp307 juta di B. Jika yield naik ke 8%, harga turun tetapi reinvestasi naik \u2192 Rp1 miliar tetap terpenuhi (plus-minus kecil).",
        "Kesalahan bendahara di cerita: ia mencocokkan maturity (10 tahun), bukan duration (obligasi kupon 10 tahun \u2192 duration ≈ 8,5 tahun!). Mismatch 1,5 tahun × pergerakan rate 3% ≈ 4,5% eksposur ≈ Rp28 juta dari Rp614 juta. Kecil, tetapi bukan nol \u2014 presisi adalah uang. Dan imunisasi gagal total dalam dua kondisi: twist kurva (bukan parallel shift) dan tidak rebalance selama bertahun-tahun (duration drift 10 → 7!).",
      ],
      formula: String.raw`D_{Mac} = \frac{\sum t \cdot PV(CF_t)}{P} \quad;\quad \text{Imunisasi: } D_{aset} = H_{kewajiban}`,
      formulaNote: "D_Mac = rata-rata tertimbang waktu arus kas. Tepat di D_Mac, price risk dan reinvestment risk saling hapus.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Obligasi jatuh tempo 10 tahun = imunisasi kewajiban 10 tahun.\u2019 Salah: yang harus match adalah Macaulay duration (≈ 8,5 tahun untuk obligasi kupon!), bukan maturity. \u2018Kebetulan aman\u2019 bukan imunisasi \u2014 hitung duration-nya.",
      },
      reference: "Checklist 5 menit: duration = horizon? PV aset = PV kewajiban? jadwal rebalance? batas (parallel saja) dikomunikasikan?",
    },
    {
      id: "lab-imunisasi",
      eyebrow: "Langkah 3 · Lab pemeriksa imunisasi",
      title: "Apakah portofoliomu terimunisasi?",
      prose: [
        "Periksa status imunisasi: bandingkan Macaulay duration portofolio dengan horizon kewajiban. Toleransi 0,5 tahun. Coba ubah DUR_ASET menjadi 5,0 dan lihat statusnya berubah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih` duration vs horizon" },
        { id: "t2", text: "Tentukan `status` (\"TERIMUNISASI\"/\"BELUM\")" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "selisih=1.5  status=BELUM",
      hints: [
        "selisih = abs(DUR_ASET − HORIZON).",
        "TERIMUNISASI jika selisih <= TOL (0,5 tahun).",
        "status = \"TERIMUNISASI\" if selisih <= TOL else \"BELUM\"",
      ],
      code: {
        starter: `# Pemeriksa imunisasi\nDUR_ASET = 8.5   # Macaulay duration portofolio (coba ubah ke 5.0!)\nHORIZON = 10      # tahun kewajiban\nTOL = 0.5\n\n# TULIS KODEMU\nselisih = \nstatus = \n\nprint(f"selisih={selisih:.1f}  status={status}")`,
        lockLines: 3,
        solution: `# Pemeriksa imunisasi\nDUR_ASET = 8.5   # Macaulay duration portofolio (coba ubah ke 5.0!)\nHORIZON = 10      # tahun kewajiban\nTOL = 0.5\n\n# TULIS KODEMU\nselisih = abs(DUR_ASET - HORIZON)\nstatus = "TERIMUNISASI" if selisih <= TOL else "BELUM"\n\nprint(f"selisih={selisih:.1f}  status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: 1.5, tol: 1e-9, label: "`selisih` = 1.5", msg: "|8,5 − 10| = 1,5 tahun. Itu mismatch bendahara di cerita." },
          { kind: "equal", task: "t2", name: "status", value: "BELUM", label: "`status` = BELUM", msg: "1,5 > 0,5 (toleransi) → belum terimunisasi → rebalance." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=1\\.5\\s+status=BELUM", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Imunisasi melindungi dari parallel shift saja \u2014 bukan twist, bukan default.",
    },
    {
      id: "struktur",
      eyebrow: "Langkah 4 · Arsitektur",
      title: "Ladder, barbell, bullet",
      prose: [
        "Tiga arsitektur, tiga filsafat. Ladder: jatuh tempo merata (1,2,3,4,5 tahun) \u2014 tiap tahun ada yang jatuh tempo untuk dibelanjakan atau direinvestasikan ke rung terjauh; reinvestasi rutin, risiko reinvestment rendah, seperti dollar-cost averaging-nya obligasi. Contoh: Rp500 juta dibagi 5 rung @Rp100 juta, yield 7% \u2192 kupon Rp7 juta per rung, arus kas kupon Rp35 juta/tahun.",
        "Bullet: fokus di satu titik (10 tahun) \u2014 untuk kewajiban tunggal, dan terlindungi dari steepening kurva. Barbell: ujung pendek + panjang (mis. Rp250 juta di 1 tahun + Rp250 juta di 5 tahun) \u2014 likuiditas plus yield plus convexity tinggi (menang saat rate bergejolak). Aturan: ekspektasi steepen \u2192 bullet; flatten \u2192 barbell; tidak tahu \u2192 ladder (default bijak). Struktur adalah taruhan pada bentuk kurva \u2014 pilih sesuai kebutuhan kas, bukan tebakan rate.",
        "Untuk kewajiban tunggal pakai bullet/imunisasi; untuk arus kas rutin pakai ladder; untuk antisipasi volatilitas rate pakai barbell.",
      ],
      tasks: [],
      reference: "Ladder = tangga (pijakan kas rutin). Barbell = fleksibel (kas cepat + yield). Bullet = janji tunggal.",
    },
    {
      id: "strategi-aktif",
      eyebrow: "Langkah 5 · Strategi aktif",
      title: "Berburu di pasar obligasi \u2014 dengan disiplin",
      prose: [
        "Tiga strategi aktif. Rate anticipation: ubah duration \u2014 panjangkan saat yakin rate turun. Hitung taruhannya: portofolio Rp100 juta, duration 5, rate turun 1% \u2192 +Rp5 juta; jika salah (naik 1%) \u2192 \u2212Rp5 juta. Dengan keyakinan 60%, ekspektasi = 0,6×5 − 0,4×5 = +Rp1 juta \u2014 kecil! Taruhan suku bunga itu simetris: butuh keyakinan tinggi untuk berarti. Kebanyakan \u2018yakin\u2019 = 55% \u2192 tidak layak.",
        "Spread strategies: rotasi sektor/kualitas saat spread murah atau mahal \u2014 mis. spread HY 800bps saat krisis (historis 500) \u2192 murah \u2192 overweight HY; pemulihan ke 450bps \u2192 outperform 5%. Disiplin: kembali netral saat spread < 400 (mahal); tanpa aturan jual = serakah. Credit rotation: naik-turun kualitas mengikuti siklus. Kunci pengukuran: tracking error vs benchmark, dinilai dengan information ratio.",
        "Kebenaran pahit: sebagian besar manajer aktif obligasi gagal mengalahkan benchmark setelah biaya. Default = pasif (index); aktif hanya untuk niche (high yield, EM) dengan keunggulan terbukti. Dan 2022 adalah pengingat: US Aggregate Bond \u221213%, 60/40 \u221216% \u2014 tahun obligasi terburuk sepanjang sejarah. \u2018Aman\u2019 hanya jika dipegang sampai maturity dan penerbit tidak default.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Orange County 1994: bendahara memakai leverage + derivatif untuk \u2018return lebih\u2019 \u2014 suku bunga naik \u2192 bangkrut USD 1,7 miliar. Leverage + suku bunga = bom. Dana publik bukan hedge fund; kewajiban = konservatif.",
      },
      reference: "Aktif = hanya jika keunggulan terbukti. Biaya = kepastian.",
    },
    {
      id: "minicase-yayasan",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Janji 10 tahun, rate naik 3%",
      prose: [
        "Yayasan: kewajiban Rp1 miliar 10 tahun. Bendahara beli obligasi 10 tahun (\u2018match maturity!\u2019). Rate naik 3% \u2192 harga \u221225% \u2192 panik. Apakah Rp1 miliar terancam? Tidak \u2014 jika dipegang: price risk vs reinvestment risk impas di duration, kupon reinvest lebih tinggi \u2192 Rp1 miliar tetap terpenuhi.",
        "Kesalahan konsepnya: match maturity, bukan duration (D_Mac ≈ 8,5 ≠ 10) + tidak ada rencana rebalance. Desain yang benar: D_aset = 10 via kombinasi obligasi (mis. 5y + 15y 50/50), rebalance tahunan, dan komunikasikan batasnya (hanya parallel shift!). Mismatch 1,5 tahun × 3% ≈ 4,5% eksposur ≈ Rp28 juta dari Rp614 juta \u2014 kecil, tetapi bukan nol.",
        "Cara menjelaskan ke pengurus yang panik, tiga kalimat: (1) \u2018Harga turun di kertas \u2014 tetapi kupon reinvest lebih tinggi.\u2019 (2) \u2018Di tahun ke-10 keduanya impas \u2014 Rp1 miliar tetap.\u2019 (3) \u2018Yang penting jangan jual panik \u2014 jual mengubah kertas menjadi nyata.\u2019 Edukasi sebelum krisis, bukan saat krisis.",
      ],
      tasks: [],
      reference: "PV kewajiban = 1.000/1,05^10 = Rp614 juta.",
    },

    {
      id: "key-rate-duration",
      eyebrow: "Langkah 7 · Risiko kurva tingkat lanjut + chart",
      title: "Key rate duration: saat kurva tidak bergeser paralel",
      prose: [
        "Duration klasik berasumsi seluruh kurva yield bergeser paralel \u2014 naik 1% di semua tenor. Kenyataannya kurva sering twist: suku bunga pendek naik 150bp sementara yang panjang hanya 30bp (flattening), atau sebaliknya. Key rate duration (KRD) mengukur sensitivitas harga terhadap pergeseran di satu titik tenor saja, dengan tenor lain ditahan. Jumlah semua KRD = effective duration. Contoh portofolio Rp1 miliar: KRD 2thn = 0,8; KRD 5thn = 2,1; KRD 10thn = 3,4; KRD 20thn = 1,2 (total 7,5).",
        "Skenario twist: yield 2 tahun naik 100bp, yield 10 tahun turun 50bp, sisanya tetap. Perubahan harga ≈ −(0,8×1% ) − (3,4×(−0,5%)) = −0,8% + 1,7% = +0,9% ≈ +Rp9 juta. Portofolio dengan duration 7,5 yang \u201Cterlihat\u201D netral terhadap pergerakan paralel ternyata untung Rp9 juta dari twist ini \u2014 karena eksposur tenornya tidak seimbang. Inilah yang tidak ditangkap duration tunggal: dua portofolio berduration sama bisa berperilaku berlawanan saat kurva twist.",
        "Aplikasi praktis untuk imunisasi kewajiban Indonesia: dana pensiun dengan kewajiban 15 tahun yang diimunisasi dengan SBN 10 tahun + 20 tahun. Jika kurva menukik di tengah (belly) sementara ujung-ujung stabil \u2014 pola umum saat BI memangkas rate pendek tetapi ekspektasi inflasi panjang naik \u2014 mismatch KRD di tenor 10\u201315 tahun bisa menggerus funded ratio 2\u20133% tanpa ada pergerakan paralel sama sekali. Aturan praktisi: untuk kewajiban >10 tahun, cocokkan KRD di minimal 3 titik (pendek, menengah, panjang), bukan hanya duration total. Dan komunikasikan ke komite: \u201Cimunisasi ini melindungi dari pergeseran paralel; twist 100bp di tenor menengah masih bisa menggerakkan funded ±2%.\u201D",
        "Cara membaca: sumbu X = tenor kunci (2, 5, 10, 20 tahun); sumbu Y = key rate duration, yaitu sensitivitas harga terhadap pergeseran yield HANYA di tenor itu. Jumlah keempat bar = effective duration 7,5.",
        "Interpretasi: eksposur terbesar ada di tenor 10 tahun (3,4) \u2014 karena itu pada skenario twist (2thn +100bp, 10thn \u221250bp) portofolio yang \u201Cterlihat\u201D netral justru naik +0,9% (\u22120,8% + 1,7%). Dua portofolio berduration sama bisa berlawanan arah saat kurva twist; KRD-lah yang membedakannya.",
      ],
      figure: {
        svg: KEYRATE_SVG,
        alt: "Bar key rate duration per tenor kunci: 2 tahun 0,8; 5 tahun 2,1; 10 tahun 3,4; 20 tahun 1,2; total 7,5.",
        caption: "Peta eksposur per tenor: bar tertinggi di 10 tahun menjelaskan kenapa portofolio ini untung +0,9% dari twist kurva padahal duration totalnya 7,5.",
      },
      formula: String.raw`\Delta P \approx -\sum_i KRD_i \cdot \Delta y_i`,
      formulaNote: "KRD_i = sensitivitas harga terhadap pergeseran yield HANYA di tenor kunci i (tenor lain ditahan). Δy_i = perubahan yield di tenor itu. Jumlah semua KRD = effective duration. Contoh: KRD 10thn 3,4 dengan yield 10thn turun 50bp memberi kontribusi +1,7% ke harga. Beda dengan duration klasik yang mengalikan satu Δy untuk semua tenor.",
      tasks: [],
      reference: "Duration = satu angka untuk paralel; KRD = peta eksposur per tenor untuk twist.",
    },
    {
      id: "risiko-reinvestasi-sbn",
      eyebrow: "Langkah 8 · Reinvestasi & SBN",
      title: "Risiko reinvestasi dan jebakan obligasi Indonesia",
      prose: [
        "Risiko reinvestasi adalah bayangan dari price risk: saat suku bunga TURUN, harga obligasi naik (bagus) tetapi kupon yang diterima harus direinvestasikan pada yield yang lebih rendah (buruk). Untuk investor dengan horizon LEBIH PENDEK dari duration, price risk dominan; untuk horizon LEBIH PANJANG, reinvestment risk dominan. Tepat di titik duration keduanya impas \u2014 itulah imunisasi. Contoh: dana pendidikan butuh Rp500 juta dalam 5 tahun, diinvestasikan di SBN 10 tahun (duration ~8). Rate turun 2%: harga naik ~16% (bagus di kertas) tetapi kupon 5 tahun pertama direinvestasikan di yield rendah \u2014 di tahun ke-5, nilai akumulasi bisa short Rp15\u201320 juta dari target karena reinvestasi yang murah. Solusinya: duration = 5, bukan 10.",
        "Konteks SBN/ORI/Sukuk ritel Indonesia: (1) ORI/SR/ST bisa dijual di pasar sekunder tetapi likuiditasnya tipis \u2014 spread jual-beli bisa 50\u2013100bp; jangan asumsikan bisa keluar kapan saja tanpa biaya. (2) Kupon ORI kena PPh final 10% \u2014 yield yang diiklankan adalah bruto; hitung netonya sebelum dibandingkan dengan deposito (pajak 20%). Contoh: ORI kupon 6,5% → neto 5,85%; deposito 5% → neto 4% \u2014 ORI masih menang, tetapi selisihnya bukan 1,5 poin melainkan 1,85 poin setelah pajak yang benar. (3) Sukuk ritel memakai akad ijarah/mudharabah \u2014 imbal hasil bukan \u201Cbunga\u201D tetapi secara ekonomi berperilaku sama untuk duration; yang beda adalah perlakuan saat restrukturisasi.",
        "Jebakan opsi tersembunyi: obligasi korporasi callable memberi penerbit hak melunasi lebih awal \u2014 tepat saat suku bunga turun (saat kamu paling ingin memegang yield tinggimu). Yield-to-call bisa 2\u20133 poin LEBIH RENDAH dari YTM yang diiklankan; selalu hitung yield-to-worst (terendah dari YTM dan semua yield-to-call). Aturan: obligasi callable = kamu MENJUAL opsi ke penerbit \u2014 pastikan spread-nya membayar premi opsi itu. Jika YTM callable ≈ YTM non-callable sejenis, kamu memberi opsi gratis.",
      ],
      tasks: [],
      reference: "Horizon < duration → price risk; horizon > duration → reinvestment risk. ORI: pajak 10%, likuiditas tipis, hitung yield-to-worst.",
    },
    {
      id: "convexity-barbell",
      eyebrow: "Langkah 9 · Convexity",
      title: "Convexity: kenapa barbell menang saat rate bergejolak",
      prose: [
        "Duration adalah aproksimasi linear: ΔP/P ≈ −D×Δy. Tetapi hubungan harga-yield itu melengkung (cembung) \u2014 convexity mengukur lengkungannya: ΔP/P ≈ −D×Δy + ½×C×(Δy)². Suku kedua selalu positif: saat yield bergerak besar ke arah mana pun, convexity memberi bonus. Makin besar pergerakan rate, makin penting convexity; untuk Δy kecil (±25bp), ia bisa diabaikan.",
        "Inilah keunggulan barbell: dengan duration SAMA, barbell (ujung pendek + panjang) punya convexity JAUH lebih besar daripada bullet (fokus tengah). Contoh: duration 8 untuk keduanya. Bullet: convexity 70. Barbell: convexity 120. Yield naik 200bp: bullet ≈ −8×2% + ½×70×(0,02)² = −16% + 1,4% = −14,6%. Barbell ≈ −16% + ½×120×0,0004 = −16% + 2,4% = −13,6%. Selisih 1 poin = Rp10 juta per Rp1 miliar \u2014 \u201Casuransi gejolak\u201D gratis dari struktur, bukan dari tebakan arah rate.",
        "Tetapi convexity tidak gratis: pasar menghargainya \u2014 barbell biasanya beryield sedikit lebih rendah (kamu membayar premi untuk lengkungannya). Aturan keputusan: (1) ekspektasi volatilitas rate tinggi (bank sentral tidak pasti, inflasi bergejolak) → bayar premi convexity via barbell; (2) rate stabil dan carry adalah tujuan → bullet/ladder, jangan bayar untuk asuransi yang tidak dibutuhkan; (3) untuk kewajiban yang diimunisasi, convexity aset ≥ convexity kewajiban adalah syarat keamanan kedua setelah duration match \u2014 karena setelah duration drift pun, convexity yang lebih besar memberi bantalan. Cek di lab: ubah Δy menjadi 3% dan lihat selisih barbell vs bullet membesar.",
      ],
      tasks: [],
      reference: "Convexity = bonus kelengkungan; barbell = convexity murah; bayar preminya hanya saat volatilitas rate tinggi.",
    },

    {
      id: "lab-convexity",
      eyebrow: "Langkah 10 · Lab convexity",
      title: "Buktikan keunggulan barbell saat gejolak",
      prose: [
        "Dua portofolio, duration sama (8), convexity beda: bullet C=70, barbell C=120. Yield naik 200bp. Hitung perubahan harga keduanya dengan aproksimasi duration + convexity, lalu selisihnya. Coba ubah DY ke 0.03 dan amati selisihnya membesar \u2014 itulah nilai convexity.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `d_bullet` (perubahan harga bullet, desimal)" },
        { id: "t2", text: "Hitung `d_barbell`, `selisih`, lalu cetak" },
      ],
      expected: "bullet=-14.6%  barbell=-13.6%  selisih=+1.0pp",
      hints: [
        "d = -D*DY + 0.5*C*DY**2.",
        "selisih = d_barbell - d_bullet (positif = barbell lebih baik).",
        "DY = 0.02 untuk 200bp.",
      ],
      code: {
        starter: `# Convexity: barbell vs bullet (duration sama = 8)\nD = 8\nC_BULLET, C_BARBELL = 70, 120\nDY = 0.02  # yield naik 200bp (coba 0.03!)\n\n# TULIS KODEMU\nd_bullet = \nd_barbell = \nselisih = d_barbell - d_bullet\n\nprint(f"bullet={d_bullet:.1%}  barbell={d_barbell:.1%}  selisih={selisih:+.1%}")`,
        lockLines: 3,
        solution: `# Convexity: barbell vs bullet (duration sama = 8)\nD = 8\nC_BULLET, C_BARBELL = 70, 120\nDY = 0.02  # yield naik 200bp (coba 0.03!)\n\n# TULIS KODEMU\nd_bullet = -D*DY + 0.5*C_BULLET*DY**2\nd_barbell = -D*DY + 0.5*C_BARBELL*DY**2\nselisih = d_barbell - d_bullet\n\nprint(f"bullet={d_bullet:.1%}  barbell={d_barbell:.1%}  selisih={selisih:+.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d_bullet", value: -0.146, tol: 0.002, label: "`d_bullet` ≈ −14.6%", msg: "−8×0,02 + 0,5×70×0,0004 = −0,146." },
          { kind: "equal", task: "t2", name: "d_barbell", value: -0.136, tol: 0.002, label: "`d_barbell` ≈ −13.6%", msg: "−8×0,02 + 0,5×120×0,0004 = −0,136. Bonus convexity barbell." },
          { kind: "equal", task: "t2", name: "selisih", value: 0.01, tol: 0.002, label: "`selisih` ≈ +1.0pp", msg: "Rp10 juta per Rp1 miliar \u2014 asuransi gejolak dari struktur." },
          { kind: "stdout_matches", task: "t2", pattern: "bullet=-14\\.6%\\s+barbell=-13\\.6%\\s+selisih=\\+1\\.0%", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Duration sama ≠ perilaku sama: convexity menentukan saat gejolak.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Empat pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Imunisasi: D_aset = horizon kewajiban; price risk vs reinvestment risk impas \u2014 bukan maturity yang dicocokkan.",
        "Tiga teknik: cash-flow matching (paling aman/mahal), duration matching, horizon matching; butuh rebalance berkala.",
        "Arsitektur: ladder (kas rutin), bullet (janji tunggal, lawan steepen), barbell (likuiditas + convexity).",
        "Aktif: rate anticipation, rotasi spread/kredit \u2014 simetris dan butuh keyakinan tinggi; default = pasif.",
        "Batas imunisasi: hanya parallel shift; twist dan drift duration = gagal. Komunikasikan batasnya.",
      ],
      next: { label: "C8 \u2014 Equity Portfolio", href: "/learn/pm-c8-equity-portfolio" },
      quiz: [
        {
          q: "Dua portofolio berduration 7,5. Kurva twist: yield 2thn +100bp, 10thn \u221250bp. Apa yang terjadi?",
          options: [
            { text: "Keduanya berperilaku sama \u2014 duration sama", why: "Salah: duration hanya menangkap parallel shift; twist bisa membuat keduanya berlawanan arah." },
            { text: "Bisa berbeda jauh \u2014 butuh key rate duration per tenor", why: "Tepat: KRD memetakan eksposur per titik kurva; jumlah KRD = duration.", correct: true },
            { text: "Keduanya untung \u2014 twist selalu menguntungkan", why: "Salah: arahnya tergantung distribusi KRD masing-masing." },
            { text: "Tidak bisa dianalisis", why: "Salah: KRD justru alat untuk menganalisisnya." },
          ],
        },
        {
          q: "Obligasi korporasi callable: YTM 9%, yield-to-call 6,5%. Yield yang jujur dipakai?",
          options: [
            { text: "9% \u2014 YTM yang diiklankan", why: "Salah: penerbit akan call tepat saat rate turun \u2014 kamu tidak akan menikmati 9%." },
            { text: "6,5% (yield-to-worst) \u2014 skenario terburuk bagimu", why: "Tepat: callable = kamu menjual opsi ke penerbit; pakai yield terendah.", correct: true },
            { text: "Rata-rata keduanya: 7,75%", why: "Salah: tidak ada dasarnya \u2014 yang relevan adalah skenario terburuk, bukan rata-rata." },
            { text: "0% \u2014 jangan beli callable", why: "Terlalu ekstrem: callable boleh dibeli asal spread membayar premi opsinya." },
          ],
        },
        {
          q: "Imunisasi yang benar: mencocokkan apa?",
          options: [
            { text: "Maturity = horizon", why: "Salah: itu kesalahan bendahara \u2014 maturity ≠ duration untuk obligasi kupon." },
            { text: "Macaulay duration = horizon", why: "Tepat: D_Mac adalah titik impas price vs reinvestment risk.", correct: true },
            { text: "Kupon = yield", why: "Itu kondisi obligasi par, bukan syarat imunisasi." },
            { text: "Harga = PV kewajiban", why: "PV match diperlukan tetapi tidak cukup \u2014 duration juga harus match." },
          ],
        },
        {
          q: "Imunisasi melindungi dari risiko apa?",
          options: [
            { text: "Semua risiko", why: "Salah: tidak ada strategi yang melindungi dari semua risiko." },
            { text: "Parallel shift yield curve", why: "Tepat: twist butuh key-rate duration; default butuh analisis kredit.", correct: true },
            { text: "Default penerbit", why: "Salah: itu risiko kredit \u2014 imunisasi tidak melindungi dari gagal bayar." },
            { text: "Inflasi", why: "Salah: inflasi menggerogoti daya beli; lindungi dengan aset riil, bukan imunisasi nominal." },
          ],
        },
        {
          q: "Duration portofolio imunisasi setelah 1 tahun?",
          options: [
            { text: "Tetap sama", why: "Salah: duration berubah seiring waktu dan pergerakan yield." },
            { text: "Bergeser \u2014 butuh rebalance", why: "Tepat: imunisasi = proses, bukan sekali beli. Tanpa rebalance = mismatch diam-diam.", correct: true },
            { text: "Menjadi nol", why: "Salah: duration nol hanya untuk kas." },
            { text: "Naik 1 tahun", why: "Salah arah: duration umumnya turun seiring mendekati jatuh tempo, dan berubah tak linear dengan yield." },
          ],
        },
        {
          q: "Kewajiban Rp1M 10 tahun; obligasi 10 tahun (duration 8,5); rate +3%. Masalah dan solusi?",
          options: [
            { text: "Tidak masalah \u2014 maturity cocok", why: "Salah: maturity ≠ duration; ada mismatch 1,5 tahun." },
            { text: "Mismatch 1,5 tahun ≈ 4,5% eksposur; solusi: kombinasikan obligasi agar duration = 10 + rebalance", why: "Tepat: presisi = uang. Kombinasi 5y+15y 50/50 memberi duration 10.", correct: true },
            { text: "Jual semua \u2014 harga turun 25%", why: "Salah: jual panik mengubah rugi kertas menjadi nyata; kewajiban tetap terpenuhi jika dipegang." },
            { text: "Beli lebih banyak obligasi 10 tahun", why: "Salah: menambah aset dengan duration yang sama tidak memperbaiki mismatch." },
          ],
        },
      ],
    },
  ],
};
