import type { V2Lesson } from "../lib/types";

export const mlfM42: V2Lesson = {
  slug: "mlf-m42-var-expected-shortfall",
  track: "Machine Learning Finance",
  module: "Market risk — VaR & Expected Shortfall",
  title: "MLF-M4.2 — VaR & Expected Shortfall: Seberapa Buruk Besok?",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M4 berlanjut dari memprediksi arah pasar ke mengukur risikonya: bila kamu memegang portofolio equal-weight BBCA, KLBF, dan UNVR senilai Rp100 juta, seberapa besar kerugian yang «wajar» besok — dan seberapa buruk bila hari buruk itu benar-benar datang? Lesson ini menjawabnya dengan dua alat standar industri: Value at Risk (VaR) dan Expected Shortfall (ES).",
        "Tujuan lesson ini:",
        "• Menjelaskan VaR sebagai kuantil kerugian — dan menegaskan apa yang BUKAN VaR (bukan kerugian maksimum).",
        "• Menjelaskan ES sebagai rata-rata kerugian BILA VaR terlampaui — jawaban atas «seberapa buruk bila buruk».",
        "• Menghitung VaR dan ES tiga cara: historis, parametrik (normal), dan Monte Carlo — dan membaca perbedaan ketiganya.",
        "• Menunjukkan bukti empiris ekor tebal: ES99 historis 0,0775 jauh di atas parametrik 0,0528 — distribusi nyata tidak normal.",
        "• Membandingkan VaR 95% vs 99%: 99% lebih konservatif tapi lebih berisik (hanya ~5 observasi di ekor).",
        "• Membaca VaR per saham (BBCA 0,0290, KLBF 0,0380, UNVR 0,0438) dan melihat manfaat diversifikasi pada VaR portofolio.",
        "• Menerapkan aturan akar-10 untuk scaling horizon (VaR95 10-hari 0,0903) — beserta caveat-nya (mengasumsikan return iid).",
        "• Menjalankan dua lab dari nol: VaR/ES historis dari daftar return mainan, dan parametrik vs historis pada data mainan.",
        "Isi lesson: cerita manajer risiko → apa itu VaR → apa itu ES → alur operasional posisi → P&L → loss → VaR/ES → hasil trio 95% → 99% dan ekor tebal → VaR per saham → Monte Carlo sebagai salah satu metode → scaling horizon akar-10 → 2 lab → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M4.2: portofolio equal-weight 3 saham IDX, rebalance harian, dalam Rp; n = 480 hari, simpangan baku harian 0,0196, volatilitas tahunan 0,3114. VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt — dari nilai tak-dibulatkan 0,028563; memakai 0,0286 yang dibulatkan memberi Rp2.860.000), ES95 historis 0,0445 (Rp4.451.285); parametrik VaR95 0,0328, ES95 0,0410; Monte Carlo VaR95 0,0336, ES95 0,0424 (10.000 simulasi, seed 42). ^GSPC dipakai sebagai benchmark dalam USD — efek kurs diabaikan, dan itu dinyatakan sebagai caveat, bukan disembunyikan.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Manajer risiko yang ditanya: «seberapa buruk besok?»",
      prose: [
        "Bayangkan kamu manajer risiko sebuah dana yang memegang BBCA, KLBF, dan UNVR dalam porsi sama — Rp100 juta total, rebalance tiap hari. Direksi bertanya dua hal setiap sore. Pertama: «dengan keyakinan 95 persen, berapa kerugian maksimum kita besok?» Kedua — pertanyaan yang lebih sulit: «bila besok termasuk 5 persen hari terburuk itu, rata-rata kita rugi berapa?»",
        "Pertanyaan pertama dijawab VaR95. Pertanyaan kedua dijawab ES95 — dan keduanya memakai data yang sama: 480 return harian portofolio itu (return 4 November 2024 sampai 11 November 2026; dari 481 baris harga 1 November 2024 sampai 11 November 2026; data diunduh dengan batas akhir 12 November 2026 yang eksklusif) [notebook]. Simpangan baku hariannya 0,0196 — sekitar 2 persen per hari — dan volatilitas tahunannya 0,3114 (31 persen per tahun).",
        "Nilai: VaR95 historis portofolio adalah 0,0286 — Rp2.856.323 per Rp100 juta [notebook]. ES95 historis adalah 0,0445 — Rp4.451.285 per Rp100 juta [notebook]. Dua angka itu menjawab dua pertanyaan direksi: «di 95 persen hari, kerugianmu tidak lebih dari Rp2,86 juta» dan «di 5 persen hari terburuk, rata-rata kerugianmu Rp4,45 juta».",
        "Baik atau buruk: VaR dan ES bagus sebagai bahasa bersama — satu angka yang bisa dibandingkan antar portofolio, antar hari, antar manajer. Buruk bila dibaca sebagai jaminan: VaR95 TIDAK berkata «kerugian besok paling banyak Rp2,86 juta» — ia berkata «di 19 dari 20 hari, kerugian tidak melebihi itu; di 1 dari 20 hari, ia bisa jauh lebih besar».",
        "Mitigasi: laporkan VaR dan ES BERDAMPINGAN, selalu. VaR sendirian menyembunyikan seberapa buruk ekornya; ES sendirian menyembunyikan seberapa sering ekor itu terjadi. Pasangan keduanyalah yang jujur.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR adalah kerugian maksimum",
        type: "pitfall",
        body: "Yang benar: VaR95 0,0286 berarti 5 persen hari (sekitar 24 dari 480 hari) kerugiannya MELEBIHI 0,0286 — dan di hari-hari itu kerugiannya bisa jauh lebih besar dari 0,0286 (mis. sebesar 0,0775 atau lebih). VaR adalah kuantil, bukan batas.",
      },
    },
    {
      id: "var",
      eyebrow: "Langkah 3 · Value at Risk",
      title: "VaR: kuantil kerugian — «di 95% hari, tidak lebih buruk dari ini»",
      prose: [
        "Definisi yang wajib dihafal: VaR pada tingkat keyakinan alpha adalah kerugian sedemikian rupa sehingga peluang kerugian melebihinya adalah (1 − alpha). VaR95 0,0286 berarti: peluang kerugian harian melebihi 2,86 persen adalah 5 persen. Dalam 480 hari [notebook], itu berarti sekitar 24 hari kerugiannya lebih besar dari 0,0286 — dan 456 hari lebih kecil.",
        "Nilai: VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt); VaR99 historis 0,0479 (Rp4.792.081 per Rp100 jt) [notebook]. Cara historis menghitungnya sederhana: urutkan 480 return dari terburuk ke terbaik, ambil return pada persentil ke-5 (untuk VaR95) dan persentil ke-1 (untuk VaR99), lalu ubah tandanya menjadi kerugian. Tidak ada asumsi distribusi — data berbicara sendiri.",
        "Tips: bila kamu menghitung VaR historis sendiri, periksa dulu berapa observasi yang berada di ekor. VaR95 dari 480 hari memakai 24 observasi di ekor — cukup untuk dibaca. VaR99 memakai sekitar 5 observasi — baca dengan hati-hati (langkah 6).",
        "Baik atau buruk: VaR historis bagus karena tanpa asumsi — ia tidak peduli distribusinya normal atau tidak, ia hanya mengurutkan kenyataan. Buruk bila datanya pendek atau rezimnya berubah: VaR historis dari 480 hari yang tenang akan meremehkan risiko bila besok rezimnya berubah (lihat M4.3 tentang backtesting dan volatilitas).",
        "Mitigasi: jangan pernah melaporkan VaR tanpa n dan tanpa window-nya. «VaR95 0,0286» tanpa «n = 480 return, 4 Nov 2024–11 Nov 2026 (harga 1 Nov 2024–11 Nov 2026)» adalah angka tanpa konteks — dan angka tanpa konteks adalah cara paling sopan untuk berbohong.",
      ],
      formula: String.raw`\mathrm{VaR}_{\alpha} = -\inf\{x : P(R \leq x) \geq 1 - \alpha\}`,
      formulaNote: "VaR pada tingkat keyakinan alpha: minus kuantil (1 − alpha) dari distribusi return R. Untuk alpha 95%: minus persentil ke-5 return. Rumus definisi — cara hitung praktisnya (historis/parametrik/Monte Carlo) ada di langkah 6.",
      tasks: [],
    },
    {
      id: "es",
      eyebrow: "Langkah 4 · Expected Shortfall",
      title: "ES: rata-rata kerugian BILA VaR terlampaui — «seberapa buruk bila buruk»",
      prose: [
        "VaR punya satu kelemahan yang fatal: ia diam tentang apa yang terjadi SETELAH garisnya dilewati. VaR95 0,0286 tidak membedakan antara dunia di mana 24 hari terburuk itu rugi 0,03 dan dunia di mana mereka rugi 0,15. Expected Shortfall (ES) — juga disebut Conditional VaR — menutup lubang itu: ES95 adalah RATA-RATA kerugian pada hari-hari ketika kerugian melebihi VaR95. Ia menjawab «seberapa buruk, bila buruk».",
        "Nilai: ES95 historis 0,0445 (Rp4.451.285 per Rp100 jt) vs VaR95 historis 0,0286 [notebook]. ES99 historis 0,0775 (Rp7.750.165) vs VaR99 historis 0,0479 [notebook]. Perhatikan polanya: ES selalu lebih besar dari VaR pada alpha yang sama — karena ES adalah rata-rata ekor, dan ekor selalu lebih buruk dari ambang masuknya. Pada 99%, jurangnya melebar: ES99 0,0775 adalah 1,62 kali VaR99 0,0479, sementara pada 95% ES95 hanya 1,56 kali VaR95.",
        "Baik atau buruk: ES bagus karena ia «koheren» — ia menghukum ekor yang tebal dan menghargai diversifikasi dengan benar, dua hal yang VaR gagal lakukan (VaR bisa naik saat dua portofolio berisiko digabung — perilaku yang tidak masuk akal untuk ukuran risiko). Buruk bila dihitung dari sedikit observasi: ES99 historis di sini adalah rata-rata dari hanya sekitar 5 hari terburuk — satu hari ekstrem baru bisa mengubahnya banyak.",
        "Mitigasi: pakai ES sebagai pendamping VaR, bukan pengganti — regulator (Basel) pun memakai keduanya dengan peran berbeda. Dan bila ES jauh lebih besar dari VaR (seperti 0,0775 vs 0,0479 di 99%), bacalah itu sebagai sinyal: ekormu tebal, dan VaR sendirian akan menipumu.",
      ],
      formula: String.raw`\mathrm{ES}_{\alpha} = E[-R \mid -R > \mathrm{VaR}_{\alpha}]`,
      formulaNote: "Expected Shortfall: ekspektasi kerugian, bersyarat pada kerugian yang melebihi VaR pada alpha yang sama. Untuk alpha 95%: rata-rata kerugian di 5% hari terburuk.",
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR95 0,0286 berarti «paling buruk rugi 2,86%»",
        type: "pitfall",
        body: "Yang benar: 24 dari 480 hari kerugiannya melebihi 0,0286, dan rata-rata kerugian di hari-hari itu adalah 0,0445 (ES95). «Paling buruk» tidak ada dalam kosakata VaR — yang ada hanyalah «seberapa sering lebih buruk» dan (lewat ES) «rata-rata seberapa buruk».",
      },
    },
    {
      id: "alur-operasional",
      eyebrow: "Langkah 5 · Alur operasional",
      title: "Alur operasional: dari posisi ke VaR/ES — enam langkah yang bisa diaudit",
      prose: [
        "VaR dan ES sejauh ini tampil sebagai angka jadi — 0,0286, 0,0445, 0,0775. Di meja risiko nyata, angka-angka itu adalah UJUNG dari sebuah rantai: posisi → return portofolio → P&L rupiah → loss → kuantil. Rantai inilah yang membuat VaR bisa diaudit — dan yang membuat satu kesalahan definisi di awal merambat ke semua angka di akhir. Lesson ini mengajarkannya eksplisit, langkah demi langkah.",
        "1. Posisi & bobot: tentukan nilai portofolio dan bobot tiap saham. Di sini: equal-weight BBCA, KLBF, dan UNVR — masing-masing sepertiga dari Rp100 juta — dengan rebalance harian, sehingga exposure kembali ke bobot target setiap sore.",
        "2. Return portofolio berbobot: return portofolio hari t adalah rata-rata berbobot return tiap saham hari itu — untuk equal-weight, (r_BBCA + r_KLBF + r_UNVR) / 3.",
        "3. P&L rupiah: P&L hari t = return portofolio hari t × nilai portofolio. Return −0,02 pada portofolio Rp100 juta berarti P&L −Rp2.000.000 hari itu.",
        "4. Loss L = −P&L: balik tandanya supaya kerugian menjadi bilangan positif — loss 0,02 berarti rugi 2 persen. Konvensi inilah yang membuat VaR dan ES dibaca sebagai bilangan positif: VaR adalah kuantil dari loss, bukan dari return.",
        "5. Kuantil = VaR: urutkan 480 loss dari terkecil ke terbesar. VaR95 adalah loss pada persentil ke-95 (sama dengan minus persentil ke-5 return); VaR99 pada persentil ke-99.",
        "6. Rata-rata ekor = ES: ES95 adalah rata-rata loss pada hari-hari ketika loss melebihi VaR95; ES99 adalah rata-rata loss pada hari-hari ketika loss melebihi VaR99.",
        "Nilai [notebook] — worked example dengan nilai portofolio Rp100 juta: VaR95 historis 0,0286 → Rp2.856.323; ES95 historis 0,0445 → Rp4.451.285; VaR99 historis 0,0479 → Rp4.792.081; ES99 historis 0,0775 → Rp7.750.165. Baca operasionalnya: di 95 persen hari, kerugian tidak melebihi Rp2.856.323; di 5 persen hari terburuk, rata-rata kerugian Rp4.451.285; dan di 1 persen hari terburuk, rata-rata kerugian Rp7.750.165 — hampir tiga kali VaR95.",
        "Checklist implementasi — empat hal yang wajib dicek sebelum angka VaR dipercaya: (a) harga — pakai adjusted close, BUKAN close mentah: dividen dan stock split yang tidak disesuaikan menciptakan «return» palsu di hari ex-date; (b) penyebut — portfolio value tetap sebagai penyebut P&L (return × nilai portofolio), jangan memakai nilai yang berubah-ubah tanpa dinyatakan; (c) biaya — biaya transaksi dan funding DIABAIKAN dalam perhitungan ini, dan itu dinyatakan eksplisit, bukan disembunyikan: VaR di sini adalah VaR sebelum biaya; (d) rebalance — rebalance harian berarti exposure kembali ke bobot target setiap hari, bobot tidak dibiarkan melayang mengikuti pergerakan harga.",
        "Baik atau buruk: alur ini bagus karena bisa diaudit tiap langkah — bila VaR terlihat aneh, kamu bisa memeriksa satu per satu: apakah return berbobotnya benar, apakah P&L-nya cocok dengan mutasi rekening, apakah kuantilnya dihitung dari loss yang benar. Buruk bila satu langkah salah definisi — misal close mentah dipakai sebagai pengganti adjusted close — karena kesalahan itu tidak berhenti di langkah itu: return salah, P&L salah, loss salah, VaR dan ES ikut salah, dan tidak ada langkah berikutnya yang bisa menangkapnya.",
        "Mitigasi: tulis konvensi tiap langkah di samping angkanya — «return = rata-rata berbobot simple return dari adjusted close; P&L = return × Rp100 juta; loss = −P&L» — dan uji ujung-ke-ujung dengan satu hari yang dihitung tangan: ambil satu hari nyata, hitung return ketiga saham dari adjusted close, kalikan bobot, kalikan Rp100 juta, dan cocokkan dengan loss di deretmu. Bila satu hari tidak cocok, jangan percaya 480 hari.",
      ],
      tasks: [],
    },
    {
      id: "trio95",
      eyebrow: "Langkah 6 · Tiga cara menghitung",
      title: "VaR/ES 95%: historis vs parametrik vs Monte Carlo",
      prose: [
        "Tiga cara menghitung VaR/ES yang sama — dan ketiganya sepakat secara kasar, tapi tidak identik. Historis: urutkan 480 return nyata, ambil kuantilnya — tanpa asumsi apa pun. Parametrik: asumsikan return berdistribusi normal dengan mean dan simpangan baku dari data (0,0196 per hari), lalu hitung kuantil normal — cepat, tapi mengasumsikan normalitas. Monte Carlo: simulasikan 10.000 hari dari distribusi normal gabungan (joint normal) ketiga saham dengan mean dan matriks kovarians return log historis, lalu hitung kuantil dari hasil simulasi — fleksibel, tapi tetap mengasumsikan normalitas pada inputnya.",
        "Nilai [notebook]: VaR95 — historis 0,0286, parametrik 0,0328, Monte Carlo 0,0336. ES95 — historis 0,0445, parametrik 0,0410, Monte Carlo 0,0424. Perhatikan: untuk VaR95, parametrik dan Monte Carlo LEBIH TINGGI dari historis (0,0328 dan 0,0336 vs 0,0286) — normal «mengira» ekor 5% lebih buruk daripada kenyataan di tengah distribusi. Untuk ES95, sebaliknya: historis LEBIH TINGGI (0,0445 vs 0,0410 dan 0,0424) — ekor nyata lebih buruk daripada ekor normal. Dua arah yang berlawanan ini adalah petunjuk pertama ekor tebal — dibuktikan penuh di langkah 7.",
        "Gambar di bawah membandingkan keenam angka itu. Perhatikan pasangan historis: VaR-nya paling rendah, ES-nya paling tinggi — ciri khas distribusi berekor tebal.",
        "Baik atau buruk: historis bagus bila datanya cukup panjang dan rezimnya stabil — tanpa asumsi, tanpa model. Parametrik bagus bila datanya pendek — ia «meminjam» bentuk normal untuk mengisi ekor yang tidak teramati. Monte Carlo bagus bila portofolionya punya payoff non-linear (misal mengandung opsi — lihat M4.4 nanti) — di portofolio saham lurus seperti ini, ia hanya mengulang jawaban parametrik dengan tambahan noise simulasi.",
        "Mitigasi: hitung minimal DUA metode dan bandingkan. Bila historis dan parametrik jauh berbeda, jangan pilih yang lebih kecil karena «lebih enak» — selidiki kenapa berbeda. Di sini perbedaannya adalah sinyal, bukan gangguan: ekor nyata lebih tebal dari normal.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar VaR95 dan ES95 tiga metode: historis VaR 0,0286 ES 0,0445; parametrik VaR 0,0328 ES 0,0410; Monte Carlo VaR 0,0336 ES 0,0424">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VaR95 &amp; ES95 — historis vs parametrik vs Monte Carlo</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,01</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,03</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<rect x="70" y="105.3" width="45" height="100.7" fill="var(--c4)"/>
<text x="92.5" y="101.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0286</text>
<text x="92.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Hist VaR</text>
<rect x="140" y="49.4" width="45" height="156.6" fill="var(--c1)"/>
<text x="162.5" y="45.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0445</text>
<text x="162.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Hist ES</text>
<rect x="210" y="90.5" width="45" height="115.5" fill="var(--c4)"/>
<text x="232.5" y="86.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0328</text>
<text x="232.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Param VaR</text>
<rect x="280" y="61.7" width="45" height="144.3" fill="var(--c1)"/>
<text x="302.5" y="57.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0410</text>
<text x="302.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Param ES</text>
<rect x="350" y="87.7" width="45" height="118.3" fill="var(--c4)"/>
<text x="372.5" y="83.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0336</text>
<text x="372.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">MC VaR</text>
<rect x="420" y="56.8" width="45" height="149.2" fill="var(--c1)"/>
<text x="442.5" y="52.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0424</text>
<text x="442.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">MC ES</text>
</svg>`,
        alt: "Bar VaR95 dan ES95 tiga metode: historis VaR 0,0286 ES 0,0445; parametrik VaR 0,0328 ES 0,0410; Monte Carlo VaR 0,0336 ES 0,0424.",
        caption: "Cara membaca: pasangan bar gelap = VaR, bar terang = ES; tiga pasangan = historis, parametrik, Monte Carlo [notebook]. Interpretasi: VaR historis paling rendah tapi ES historis paling tinggi — ekor nyata lebih tebal dari ekor normal.",
      },
      tasks: [],
    },
    {
      id: "ekor99",
      eyebrow: "Langkah 7 · 99% dan ekor tebal",
      title: "VaR99 & ES99: ekor nyata jauh lebih tebal dari normal",
      prose: [
        "Naikkan tingkat keyakinan ke 99% dan dua hal terjadi sekaligus: angkanya membesar, dan ketidakpastiannya membesar. VaR99 historis 0,0479 (Rp4.792.081), ES99 historis 0,0775 (Rp7.750.165) [notebook]. Bandingkan dengan parametrik: VaR99 0,0462, ES99 0,0528. Monte Carlo: VaR99 0,0479, ES99 0,0546.",
        "Nilai: bukti ekor tebal ada pada ES99. Historis 0,0775 vs parametrik 0,0528 — selisih 0,0247, atau historis 47 persen lebih besar. Distribusi normal meremehkan rata-rata kerugian di 1% hari terburuk hampir setengahnya. Untuk VaR99, ketiga metode nyaris sepakat (0,0479 historis, 0,0462 parametrik, 0,0479 Monte Carlo) — ambang masuk ekornya sama, tapi ISI ekornya berbeda jauh. Normal tahu di mana ekor dimulai, tapi tidak tahu seberapa dalam ekor itu.",
        "Kenapa 99% lebih berisik? Karena hanya sekitar 5 observasi (1% dari 480) yang berada di ekor 99%. ES99 historis adalah rata-rata dari 5 hari terburuk — tambah atau kurangi satu hari ekstrem, dan angkanya bergerak banyak. VaR95 memakai 24 observasi di ekor; VaR99 memakai 5. Itulah trade-off-nya: 99% lebih konservatif (angka lebih besar, lebih aman sebagai batas), tapi lebih berisik (angka lebih goyah).",
        "Baik atau buruk: 99% bagus bila yang dijaga adalah bencana — modal minimum, batas kerugian ekstrem. Buruk bila dipakai untuk keputusan harian: angka yang goyah karena 5 observasi akan membuat batas risiko bergerak-gerak tanpa alasan yang jelas.",
        "Mitigasi: laporkan 95% untuk pemantauan harian dan 99% untuk ketahanan terhadap bencana — berdampingan, dengan n ekornya dinyatakan («ES99 dari ~5 observasi»). Dan bila ES historis jauh di atas ES parametrik, jangan «menghaluskan» dengan mengganti ke parametrik — itu justru membuang sinyal ekor tebal yang paling berharga.",
      ],
      formula: String.raw`\mathrm{VaR}_{99}^{\mathrm{hist}} = 0{,}0479 \quad < \quad \mathrm{ES}_{99}^{\mathrm{hist}} = 0{,}0775 \quad \gg \quad \mathrm{ES}_{99}^{\mathrm{param}} = 0{,}0528`,
      formulaNote: "Bukti empiris ekor tebal [notebook]: ES99 historis jauh di atas ES99 parametrik (normal) — distribusi nyata berekor tebal, normal meremehkan ekor. Bukan teori, melainkan hasil hitung dari 480 return.",
      tasks: [],
      note: {
        title: "Peringatan jujur: ES99 dari 5 hari",
        type: "risk",
        body: "ES99 historis 0,0775 adalah rata-rata kerugian dari sekitar 5 hari terburuk dalam 480 hari. Satu krisis baru bisa mengubahnya secara material. Jangan jadikan ES99 satu-satunya angka modal — ia pendamping VaR95 yang stabil, bukan penggantinya.",
      },
    },
    {
      id: "persaham",
      eyebrow: "Langkah 8 · VaR per saham",
      title: "VaR per saham: UNVR paling berisiko — portofolio lebih aman dari anggotanya",
      prose: [
        "VaR portofolio bukan rata-rata VaR anggotanya — dan di situlah diversifikasi terlihat. VaR95 historis per saham [notebook]: BBCA 0,0290, KLBF 0,0380, UNVR 0,0438. VaR95 historis portofolio equal-weight: 0,0286 — LEBIH RENDAH dari VaR saham yang paling aman sekalipun (BBCA 0,0290).",
        "Nilai: UNVR paling berisiko sendiri (VaR95 0,0438) — konsisten dengan volatilitas tahunannya yang tertinggi (0,4981 vs BBCA 0,3471 dan KLBF 0,4244) [notebook]. Rata-rata sederhana ketiga VaR per saham adalah (0,0290 + 0,0380 + 0,0438) / 3 = 0,0369 — tapi VaR portofolio hanya 0,0286, sekitar 23 persen lebih rendah. Selisih itu adalah manfaat diversifikasi: ketiga saham tidak jatuh bersamaan setiap hari (korelasi log-return antar saham 0,285–0,361 [notebook]) — hari buruk UNVR sering bukan hari buruk BBCA.",
        "Gambar di bawah membandingkan keempat VaR95 itu. Perhatikan bar portofolio yang paling pendek — padahal ia berisi saham yang sama.",
        "Baik atau buruk: VaR per saham bagus untuk menetapkan batas per posisi («tidak ada satu saham pun yang VaR-nya di atas X»). Buruk bila dipakai untuk menilai risiko portofolio secara keseluruhan — menjumlahkan VaR per saham (atau merata-ratakannya) melebih-lebihkan risiko karena mengabaikan korelasi yang di bawah 1.",
        "Mitigasi: bila satu saham mendominasi VaR portofolio (di sini UNVR: VaR tertinggi dan porsi sama), pertimbangkan mengurangi bobotnya — atau terima risikonya secara sadar dengan batas yang dinyatakan. Yang tidak boleh: menaikkan bobot saham ber-VaR tinggi sambil mengklaim portofolio «tetap aman» karena VaR totalnya masih di bawah ambang.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar VaR95 historis per saham: BBCA 0,0290; KLBF 0,0380; UNVR 0,0438; portofolio 0,0286">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VaR95 historis — portofolio di bawah saham teraman sekalipun</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,01</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,03</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<rect x="90" y="103.9" width="60" height="102.1" fill="var(--c1)"/>
<text x="120" y="99.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0290</text>
<text x="120" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">BBCA</text>
<rect x="190" y="72.2" width="60" height="133.8" fill="var(--c1)"/>
<text x="220" y="68.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0380</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">KLBF</text>
<rect x="290" y="51.8" width="60" height="154.2" fill="var(--c4)"/>
<text x="320" y="47.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0438</text>
<text x="320" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">UNVR</text>
<rect x="390" y="105.3" width="60" height="100.7" fill="var(--c2)"/>
<text x="420" y="101.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0286</text>
<text x="420" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Portofolio</text>
</svg>`,
        alt: "Bar VaR95 historis per saham: BBCA 0,0290; KLBF 0,0380; UNVR 0,0438; portofolio 0,0286.",
        caption: "Cara membaca: tiga bar kiri = VaR95 tiap saham sendiri; bar kanan = VaR95 portofolio equal-weight [notebook]. Interpretasi: portofolio (0,0286) lebih rendah dari saham teraman (BBCA 0,0290) — diversifikasi bekerja karena korelasi log-return antar saham hanya 0,285–0,361.",
      },
      tasks: [],
    },
    {
      id: "montecarlo",
      eyebrow: "Langkah 9 · Monte Carlo sebagai salah satu metode",
      title: "Monte Carlo di sini: satu dari tiga cara menghitung VaR — bukan teori simulasi",
      prose: [
        "Monte Carlo di lesson ini HANYA salah satu metode menghitung VaR/ES — sejajar dengan historis dan parametrik. Caranya: ambil mean dan matriks kovarians return log ketiga saham, simulasikan 10.000 hari dari distribusi normal gabungan (joint normal) dengan seed 42, bentuk portofolio equal-weight tiap hari simulasi, lalu hitung kuantilnya seperti menghitung VaR historis — hanya saja datanya simulasi, bukan kenyataan.",
        "Nilai [notebook]: Monte Carlo VaR95 0,0336, ES95 0,0424; VaR99 0,0479, ES99 0,0546 (10.000 simulasi, seed 42). Perhatikan kedekatannya dengan parametrik (VaR95 0,0328, ES95 0,0410; VaR99 0,0462, ES99 0,0528): wajar — keduanya berangkat dari asumsi normal yang sama, hanya jalurnya berbeda (rumus vs simulasi). Selisih kecil di antara keduanya (misal VaR95 0,0336 vs 0,0328) adalah noise simulasi dari 10.000 hari — tambah simulasinya, selisihnya mengecil.",
        "Teori Monte Carlo yang penuh — kapan simulasi dibutuhkan, bagaimana membangun skenario, bagaimana varians simulasi dikendalikan — TIDAK diajarkan di sini. Itu materi M9 (Simulation, Backtesting & Validation). Di sini cukup pegang satu hal: Monte Carlo adalah mesin penghasil «hari-hari yang mungkin», dan VaR/ES hanyalah kuantil dari hari-hari itu.",
        "Tips: bila hasil Monte Carlo dan parametrik jauh berbeda pada portofolio saham lurus, curigai dulu simulasinya (seed, jumlah simulasi, kovarians) sebelum curiga pada teorinya — pada payoff linear, keduanya harus sepakat. Perbedaan yang bermakna baru muncul bila portofolio mengandung payoff non-linear (opsi), yang dibahas di M4.4.",
        "Baik atau buruk: Monte Carlo bagus bila payoff-nya non-linear atau distribusinya tidak punya rumus kuantil yang mudah. Buruk bila dipakai sebagai «hiasan canggih» di portofolio linear: ia menjawab pertanyaan yang sama dengan parametrik, hanya lebih lambat dan dengan noise tambahan.",
        "Mitigasi: nyatakan selalu seed dan jumlah simulasi (di sini seed 42, 10.000 simulasi) — tanpa keduanya, hasil Monte Carlo tidak bisa direplikasi dan tidak bisa dipercaya.",
      ],
      tasks: [],
    },
    {
      id: "horizon",
      eyebrow: "Langkah 10 · Scaling horizon",
      title: "Aturan akar-10: VaR 10-hari — dan caveat iid-nya",
      prose: [
        "VaR sejauh ini adalah VaR 1-hari. Bagaimana bila direksi bertanya tentang 10 hari ke depan — misal untuk kebutuhan modal? Aturan praktis industri: kalikan VaR 1-hari dengan akar dari horizon (dalam hari). VaR95 10-hari = VaR95 1-hari × √10.",
        "Nilai: VaR95 historis 1-hari (tak-dibulatkan 0,028563) × √10 ≈ 0,0903 [notebook] — sekitar Rp9.030.000 per Rp100 juta untuk 10 hari. Memakai 0,0286 yang sudah dibulatkan, hasilnya 0,0904 — selisih 0,0001 itu pembulatan, bukan kesalahan. Perhatikan: 0,0903 adalah 3,16 kali VaR 1-hari — BUKAN 10 kali. Akar-10 tumbuh jauh lebih lambat daripada linear, karena aturan ini mengasumsikan kerugian harian saling meniadakan sebagian (ada hari naik di antara hari turun).",
        "Caveat yang wajib dipegang — dan alasan aturan ini punya langkahnya sendiri: akar-10 mengasumsikan return IID (independen dan berdistribusi identik): tiap hari seperti lemparan dadu yang sama, tidak dipengaruhi hari kemarin. Return nyata TIDAK iid: volatilitas bergerombol (hari bergejolak diikuti hari bergejolak — lihat M4.3: autokorelasi return kuadrat lag-1 0,1043), dan korelasi antar saham naik saat pasar stres. Bila volatilitas sedang tinggi, VaR 10-hari yang sebenarnya bisa lebih besar dari 0,0903; bila sedang rendah, bisa lebih kecil.",
        "Baik atau buruk: akar-10 bagus sebagai perkiraan cepat untuk horizon pendek (2–10 hari) dalam kondisi normal. Buruk untuk horizon panjang atau saat volatilitas sedang tidak normal — di situlah model volatilitas (EWMA, GARCH — M4.3) mengambil alih.",
        "Mitigasi: pakai akar-10 hanya sebagai angka pertama, lalu tanyakan «bagaimana bila volatilitas besok seperti minggu lalu?» — pertanyaan itu dijawab model kondisional di M4.3, bukan oleh akar-10.",
      ],
      formula: String.raw`\mathrm{VaR}_{\alpha}(T) = \mathrm{VaR}_{\alpha}(1) \times \sqrt{T}`,
      formulaNote: "Aturan akar-T untuk scaling horizon (di sini T = 10 hari: 0,028563 × √10 ≈ 0,0903; 0,0286 yang dibulatkan memberi 0,0904 — selisih pembulatan 0,0001). Berlaku bila return iid — asumsi yang dilanggar return nyata (volatilitas bergerombol, lihat M4.3).",
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR 10-hari = 10 × VaR 1-hari",
        type: "pitfall",
        body: "Yang benar: VaR 10-hari ≈ VaR 1-hari × √10 = 0,0903 (dari VaR 1-hari tak-dibulatkan 0,028563), bukan 0,2860. Perkalian linear 10× mengasumsikan 10 hari buruk berturut-turut tanpa satu pun hari baik — skenario yang jauh lebih pesimistis daripada yang dimaksud VaR.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: VaR95/ES95 historis dari 20 return mainan",
      prose: [
        "Sekarang giliranmu menghitung VaR dan ES dengan tangan — tanpa library statistik apa pun. Datanya 20 return harian mainan (dalam fraksi): sebagian besar kecil, dua di antaranya buruk (-0,04 dan -0,05). Kuantil dihitung dengan interpolasi linear — cara yang sama dipakai numpy: posisi kuantil 5% pada 20 data yang terurut adalah 0,05 × 19 = 0,95 — yaitu 95% jalan dari return terburuk (-0,05) ke return terburuk kedua (-0,04).",
        "Hasilnya [lab]: kuantil 5% = -0,0405, jadi VaR95 = 0,0405. Ekornya — return yang kurang dari atau sama dengan kuantil — hanya berisi satu observasi (-0,05), jadi ES95 = 0,0500. Dalam rupiah per Rp100 juta: VaR Rp4.050.000, ES Rp5.000.000.",
        "Perhatikan dua hal. Pertama, ES95 (0,0500) lebih besar dari VaR95 (0,0405) — seperti di notebook (0,0445 vs 0,0286). Kedua, ES95 di sini hanya dari SATU observasi — sama seperti ES99 di notebook yang hanya dari ~5 observasi. Ekor yang tipis membuat ES goyah: tambah satu hari -0,08 ke data ini (n menjadi 21), dan VaR95 naik dari 0,0405 menjadi 0,0500 (+23,5%) — kuantil 5% kini jatuh tepat pada -0,05 — sementara ES95 naik dari 0,0500 menjadi 0,0650 (rata-rata kerugian -0,08 dan -0,05). Di n sekecil ini, satu observasi ekstrem menggerakkan VaR maupun ES; VaR baru relatif stabil bila n jauh lebih besar, seperti 480 hari di notebook. Itulah alasan lesson ini mengulang-ulang: laporkan n ekor bersama ES.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi quantile: interpolasi linear antara dua data terurut terdekat" },
        { id: "t2", text: "Hitung VaR95 = -kuantil 5% dan ES95 = rata-rata kerugian pada return <= kuantil" },
        { id: "t3", text: "Jalankan dan ubah ke rupiah per Rp100 juta" },
      ],
      expected: "return terburuk: -0.0500\nkuantil 5%: -0.0405\nVaR95: 0.0405\nES95: 0.0500\ndalam Rp per Rp100 jt: VaR Rp4,050,000, ES Rp5,000,000",
      hints: [
        "Urutkan dulu datanya; posisi = q × (n - 1); ambil bagian bulat (lo) dan pecahannya (f) — nilai = data[lo] × (1 - f) + data[lo + 1] × f.",
        "Ekor = semua return yang <= kuantil 5% — di data ini hanya satu: -0,05.",
        "Rupiah: kalikan fraksi dengan 100.000.000 dan bulatkan ke rupiah terdekat.",
      ],
      code: {
        starter: `# 20 return harian mainan (dalam fraksi, mis. 0.02 = +2%)
rets = [0.02, 0.01, -0.01, 0.03, -0.02, 0.015, -0.005, 0.04, -0.03, -0.015,
        0.025, -0.04, 0.01, -0.008, 0.005, -0.025, 0.012, -0.012, 0.02, -0.05]

def quantile(data, q):
    # Kuantil dengan interpolasi linear (cara yang sama dipakai numpy)
    s = sorted(data)
    pos = q * (len(s) - 1)
    lo = int(pos)
    hi = min(lo + 1, len(s) - 1)
    f = pos - lo
    return 0.0  # TODO: s[lo] * (1 - f) + s[hi] * f

q05 = quantile(rets, 0.05)
var95 = -q05
tail = [r for r in rets if r <= q05]
es95 = 0.0  # TODO: rata-rata kerugian pada ekor = -mean(tail)
print(f"return terburuk: {min(rets):.4f}")
print(f"kuantil 5%: {q05:.4f}")
print(f"VaR95: {var95:.4f}")
print(f"ES95: {es95:.4f}")
print(f"dalam Rp per Rp100 jt: VaR Rp{int(round(var95 * 100_000_000)):,}, ES Rp{int(round(es95 * 100_000_000)):,}")`,
        lockLines: 11,
        solution: `# 20 return harian mainan (dalam fraksi, mis. 0.02 = +2%)
rets = [0.02, 0.01, -0.01, 0.03, -0.02, 0.015, -0.005, 0.04, -0.03, -0.015,
        0.025, -0.04, 0.01, -0.008, 0.005, -0.025, 0.012, -0.012, 0.02, -0.05]

def quantile(data, q):
    # Kuantil dengan interpolasi linear (cara yang sama dipakai numpy)
    s = sorted(data)
    pos = q * (len(s) - 1)
    lo = int(pos)
    hi = min(lo + 1, len(s) - 1)
    f = pos - lo
    return s[lo] * (1 - f) + s[hi] * f

q05 = quantile(rets, 0.05)
var95 = -q05
tail = [r for r in rets if r <= q05]
es95 = -sum(tail) / len(tail)
print(f"return terburuk: {min(rets):.4f}")
print(f"kuantil 5%: {q05:.4f}")
print(f"VaR95: {var95:.4f}")
print(f"ES95: {es95:.4f}")
print(f"dalam Rp per Rp100 jt: VaR Rp{int(round(var95 * 100_000_000)):,}, ES Rp{int(round(es95 * 100_000_000)):,}")`,
        checks: [
          { kind: "equal", task: "t2", name: "var95", value: 0.0405, label: "`var95` seharusnya 0.0405", msg: "VaR95 = -kuantil 5% = 0,0405." },
          { kind: "equal", task: "t2", name: "es95", value: 0.05, label: "`es95` seharusnya 0.05", msg: "ES95 = rata-rata kerugian ekor (hanya -0,05) = 0,0500." },
          { kind: "stdout_matches", task: "t2", pattern: "kuantil 5%: -0\\.0405", label: "Output menampilkan kuantil 5% -0,0405", msg: "Kuantil 5% dengan interpolasi linear: -0,0405." },
          { kind: "stdout_matches", task: "t3", pattern: "VaR Rp4,050,000, ES Rp5,000,000", label: "Output menampilkan VaR/ES dalam rupiah", msg: "Format: VaR Rp4,050,000, ES Rp5,000,000 per Rp100 jt." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: parametrik vs historis — kapan keduanya berbeda",
      prose: [
        "Lab kedua menunjukkan kapan VaR parametrik (normal) menipu. Datanya 20 return mainan: 18 hari tenang (+0,7% sampai +1,5%) lalu 2 hari crash (-0,08 dan -0,12). Distribusi ini sangat miring ke kiri — persis penyakit return saham nyata, hanya diperbesar supaya terlihat.",
        "Hasilnya [lab]: mean -0,0003, simpangan baku 0,0348. VaR95 historis 0,0820, ES95 historis 0,1200. VaR95 parametrik — mean minus 1,6449 × simpangan baku, diubah tanda — hanya 0,0575. Selisih historis minus parametrik: 0,0245. Normal meremehkan VaR95 sebesar 0,0245 — hampir sepertiga dari nilai historisnya.",
        "Kenapa normal gagal? Karena simpangan baku 0,0348 «diencerkan» oleh 18 hari tenang — ia tidak tahu bahwa 2 hari crash itu ada sebagai ekor yang terpisah. Kuantil normal 5% (-0,0575) jatuh DI ANTARA hari tenang dan hari crash: lebih buruk dari hari tenang mana pun, tapi jauh lebih baik dari crash yang sebenarnya (-0,08 dan -0,12). Historis tidak punya masalah ini: ia membaca -0,08 dan -0,12 apa adanya.",
        "Bandingkan dengan notebook: di sana VaR95 parametrik (0,0328) justru LEBIH TINGGI dari historis (0,0286) — normal tidak selalu meremehkan VaR; di 95% ia bisa melebihkan. Yang konsisten diremehkan normal adalah ES di ekor jauh (ES99 historis 0,0775 vs parametrik 0,0528). Pelajarannya: jangan hafal «normal selalu meremehkan» — hafal caranya memeriksa: hitung keduanya, bandingkan, dan bila berbeda jauh, percayai historis untuk ekornya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung mean dan simpangan baku (ddof=1) dari 20 return" },
        { id: "t2", text: "Hitung VaR95/ES95 historis (kuantil interpolasi linear, seperti Lab 1)" },
        { id: "t3", text: "Hitung VaR95 parametrik = -(mean - 1,6449 × simpangan baku) dan selisihnya dengan historis" },
      ],
      expected: "mean: -0.0003\nsimpangan baku: 0.0348\nVaR95 historis: 0.0820\nES95 historis: 0.1200\nVaR95 parametrik: 0.0575\nselisih (historis - parametrik): 0.0245",
      hints: [
        "Simpangan baku sampel (ddof=1): akar dari jumlah (r - mean) kuadrat dibagi (n - 1).",
        "z untuk 95% satu sisi adalah 1,6449 — nilai yang sama dipakai di rumus parametrik notebook.",
        "Kuantil 5% dari data ini: posisi 0,95 — antara -0,12 dan -0,08.",
      ],
      code: {
        starter: `import math

# 20 return mainan: 18 hari tenang (+0,7% sampai +1,5%), lalu 2 hari crash
rets = [0.01, 0.012, 0.008, 0.015, 0.011, 0.009, 0.013, 0.01, 0.014, 0.007,
        0.012, 0.01, 0.011, 0.009, 0.013, 0.01, 0.008, 0.012, -0.08, -0.12]

def quantile(data, q):
    s = sorted(data)
    pos = q * (len(s) - 1)
    lo = int(pos)
    hi = min(lo + 1, len(s) - 1)
    f = pos - lo
    return s[lo] * (1 - f) + s[hi] * f

q05 = quantile(rets, 0.05)
var_hist = -q05
tail = [r for r in rets if r <= q05]
es_hist = -sum(tail) / len(tail)
mean = sum(rets) / len(rets)
sd = 0.0  # TODO: simpangan baku sampel (ddof=1)
z95 = 1.6449
var_param = 0.0  # TODO: -(mean - z95 * sd)
print(f"mean: {mean:.4f}")
print(f"simpangan baku: {sd:.4f}")
print(f"VaR95 historis: {var_hist:.4f}")
print(f"ES95 historis: {es_hist:.4f}")
print(f"VaR95 parametrik: {var_param:.4f}")
print(f"selisih (historis - parametrik): {var_hist - var_param:.4f}")`,
        lockLines: 19,
        solution: `import math

# 20 return mainan: 18 hari tenang (+0,7% sampai +1,5%), lalu 2 hari crash
rets = [0.01, 0.012, 0.008, 0.015, 0.011, 0.009, 0.013, 0.01, 0.014, 0.007,
        0.012, 0.01, 0.011, 0.009, 0.013, 0.01, 0.008, 0.012, -0.08, -0.12]

def quantile(data, q):
    s = sorted(data)
    pos = q * (len(s) - 1)
    lo = int(pos)
    hi = min(lo + 1, len(s) - 1)
    f = pos - lo
    return s[lo] * (1 - f) + s[hi] * f

q05 = quantile(rets, 0.05)
var_hist = -q05
tail = [r for r in rets if r <= q05]
es_hist = -sum(tail) / len(tail)
mean = sum(rets) / len(rets)
sd = math.sqrt(sum((r - mean) ** 2 for r in rets) / (len(rets) - 1))
z95 = 1.6449
var_param = -(mean - z95 * sd)
print(f"mean: {mean:.4f}")
print(f"simpangan baku: {sd:.4f}")
print(f"VaR95 historis: {var_hist:.4f}")
print(f"ES95 historis: {es_hist:.4f}")
print(f"VaR95 parametrik: {var_param:.4f}")
print(f"selisih (historis - parametrik): {var_hist - var_param:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "var_hist", value: 0.082, label: "`var_hist` seharusnya 0.082", msg: "VaR95 historis 0,0820 — membaca dua hari crash apa adanya." },
          { kind: "equal", task: "t3", name: "var_param", value: 0.0575, tol: 0.0001, label: "`var_param` seharusnya 0.0575", msg: "VaR95 parametrik 0,0575 — normal meremehkan karena simpangan baku «diencerkan» 18 hari tenang." },
          { kind: "stdout_matches", task: "t2", pattern: "ES95 historis: 0\\.1200", label: "Output menampilkan ES95 historis 0,1200", msg: "ES95 historis 0,1200 — hanya dari satu observasi (-0,12): kuantil 5% (-0,0820) menyisakan -0,12 saja di ekor." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih \\(historis - parametrik\\): 0\\.0245", label: "Output menampilkan selisih 0,0245", msg: "Selisih historis minus parametrik: 0,0245." },
        ],
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 13 · Guided task di Colab",
      title: "Guided task di Colab: VaR & ES portofolio BBCA–KLBF–UNVR",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 20 return mainan. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m42-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, UNVR, dan ^GSPC yang sesungguhnya (window harga 2024-11-01 sampai 2026-11-12 — 481 baris harga, 480 return sampai 2026-11-11), membangun portofolio equal-weight rebalance harian (n = 480, sd harian 0,0196), mereplikasi trio VaR/ES 95% (historis 0,0286/0,0445; parametrik 0,0328/0,0410; Monte Carlo 0,0336/0,0424) dan 99% (historis 0,0479/0,0775; parametrik 0,0462/0,0528; Monte Carlo 0,0479/0,0546), VaR95 per saham (BBCA 0,0290, KLBF 0,0380, UNVR 0,0438), dan VaR95 10-hari 0,0903 — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1gcCKsWRbyJnCJ5jniYHb028dBTAg7cI5",
        "Jalur file notebook: colab/mlf-m42-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: VaR bilang seberapa sering, ES bilang seberapa buruk",
      prose: [
        "Rangkuman: VaR adalah kuantil kerugian — VaR95 historis portofolio 0,0286 (Rp2.856.323 per Rp100 jt) berarti 5% hari kerugiannya melebihi itu, bukan kerugian maksimum. ES adalah rata-rata kerugian bila VaR terlampaui — ES95 historis 0,0445 (Rp4.451.285). Alur operasionalnya: posisi & bobot → return portofolio berbobot → P&L rupiah → loss L = −P&L → kuantil (VaR) → rata-rata ekor (ES); checklist-nya: adjusted close (bukan close mentah), portfolio value tetap sebagai penyebut, biaya transaksi/funding diabaikan (dinyatakan), rebalance harian mengembalikan exposure ke bobot target. Trio 95% [notebook]: historis 0,0286/0,0445, parametrik 0,0328/0,0410, Monte Carlo 0,0336/0,0424 (10.000 simulasi, seed 42). Di 99%: historis 0,0479/0,0775, parametrik 0,0462/0,0528, Monte Carlo 0,0479/0,0546 — ES99 historis jauh di atas parametrik: bukti empiris ekor tebal, normal meremehkan ekor. VaR95 per saham: BBCA 0,0290, KLBF 0,0380, UNVR 0,0438 — portofolio 0,0286 lebih rendah dari saham teraman: diversifikasi bekerja. VaR95 10-hari (akar-10) 0,0903 — dengan caveat return tidak iid.",
      ],
      tasks: [],
      quiz: [
        {
          q: "VaR95 historis portofolio adalah 0,0286 (n = 480). Apa arti yang paling tepat?",
          options: [
            { text: "Kerugian maksimum besok adalah 2,86%", why: "VaR bukan kerugian maksimum — 24 dari 480 hari kerugiannya melebihi 0,0286." },
            { text: "Di 95% hari, kerugian tidak melebihi 2,86%; di 5% hari (sekitar 24 dari 480) kerugiannya lebih besar", why: "Benar: VaR95 adalah kuantil — peluang kerugian melebihi 0,0286 adalah 5%.", correct: true },
            { text: "Rata-rata kerugian besok adalah 2,86%", why: "Rata-rata kerugian di hari terburuk adalah ES95 (0,0445), bukan VaR95 — dan rata-rata kerugian keseluruhan jauh lebih kecil." },
            { text: "Di 95% hari, portofolio untung 2,86%", why: "VaR mengukur kerugian, bukan keuntungan — 0,0286 adalah batas kerugian, bukan target untung." },
          ],
        },
        {
          q: "ES95 historis 0,0445 vs VaR95 historis 0,0286. Apa yang dijawab ES yang tidak dijawab VaR?",
          options: [
            { text: "Seberapa sering kerugian melebihi VaR", why: "Itu dijawab VaR sendiri (5% hari) — ES menjawab hal lain." },
            { text: "Rata-rata kerugian pada hari-hari ketika kerugian melebihi VaR — «seberapa buruk bila buruk»", why: "Benar: ES95 adalah rata-rata kerugian di 5% hari terburuk (Rp4.451.285 per Rp100 jt).", correct: true },
            { text: "Kerugian maksimum yang mungkin terjadi", why: "Tidak ada ukuran yang memberi kerugian maksimum — ES pun hanya rata-rata ekor, bukan batas atas." },
            { text: "Probabilitas portofolio bangkrut besok", why: "ES tidak mengukur probabilitas bangkrut — ia mengukur rata-rata kerugian bersyarat." },
          ],
        },
        {
          q: "ES99 historis 0,0775 vs ES99 parametrik (normal) 0,0528. Apa kesimpulan yang paling tepat?",
          options: [
            { text: "Perhitungannya salah satu pasti keliru — keduanya harus sama", why: "Keduanya benar menurut metodenya masing-masing — perbedaannya adalah sinyal, bukan kesalahan hitung." },
            { text: "Distribusi nyata berekor tebal: normal meremehkan rata-rata kerugian di 1% hari terburuk (historis 47% lebih besar)", why: "Benar: selisih 0,0247 pada ES99 adalah bukti empiris — ekor nyata lebih dalam dari ekor normal.", correct: true },
            { text: "VaR99 historis pasti juga jauh di atas parametrik", why: "Justru tidak: VaR99 ketiganya nyaris sepakat (0,0479 / 0,0462 / 0,0479) — ambang ekornya sama, isi ekornya yang berbeda." },
            { text: "Monte Carlo membuktikan normal benar karena hasilnya di tengah", why: "Monte Carlo (ES99 0,0546) dekat dengan parametrik karena keduanya berangkat dari asumsi normal yang sama — bukan bukti independen." },
          ],
        },
        {
          q: "Mengapa VaR99 lebih berisik daripada VaR95 di data ini (n = 480)?",
          options: [
            { text: "Karena 99% lebih konservatif sehingga angkanya lebih besar", why: "Lebih besar bukan berarti lebih berisik — yang membuatnya berisik adalah jumlah observasi di ekor." },
            { text: "Karena hanya sekitar 5 observasi yang berada di ekor 99%, melawan 24 observasi di ekor 95%", why: "Benar: ES99/VaR99 dihitung dari ~5 hari terburuk — satu hari ekstrem baru bisa mengubahnya banyak.", correct: true },
            { text: "Karena VaR99 memakai distribusi normal sedangkan VaR95 tidak", why: "VaR99 historis tidak memakai asumsi normal sama sekali — ia mengurutkan return nyata seperti VaR95." },
            { text: "Karena window datanya berbeda untuk 99% dan 95%", why: "Keduanya dihitung dari 480 hari yang sama (4 Nov 2024–11 Nov 2026, window return) — window-nya identik." },
          ],
        },
        {
          q: "VaR95 per saham: BBCA 0,0290, KLBF 0,0380, UNVR 0,0438; portofolio equal-weight 0,0286. Apa yang ditunjukkan angka portofolio?",
          options: [
            { text: "Portofolio salah hitung — VaR-nya harus di antara 0,0290 dan 0,0438", why: "Tidak salah: VaR portofolio BOLEH di bawah VaR tiap anggotanya bila korelasinya di bawah 1 — itulah diversifikasi." },
            { text: "Diversifikasi bekerja: portofolio (0,0286) lebih rendah dari saham teraman (BBCA 0,0290) karena korelasi log-return antar saham hanya 0,285–0,361", why: "Benar: ketiga saham tidak jatuh bersamaan setiap hari, jadi kerugian portofolio lebih kecil dari kerugian tiap saham sendiri.", correct: true },
            { text: "BBCA harus dibuang karena VaR-nya paling kecil", why: "VaR kecil berarti risiko kecil — BBCA justru anggota teraman, bukan yang harus dibuang." },
            { text: "Rata-rata VaR saham (0,0369) adalah VaR portofolio yang benar", why: "Merata-ratakan VaR mengabaikan korelasi — VaR portofolio yang benar (0,0286) lebih rendah karena diversifikasi." },
          ],
        },
        {
          q: "Monte Carlo VaR95 0,0336 dekat dengan parametrik 0,0328, tapi jauh dari historis 0,0286. Mengapa?",
          options: [
            { text: "Karena Monte Carlo memakai data historis yang sama dengan metode historis", why: "Monte Carlo memakai mean dan matriks kovarians return log historis, tapi SIMULASI-nya dari distribusi normal gabungan — bukan dari return nyata." },
            { text: "Karena Monte Carlo dan parametrik sama-sama berangkat dari asumsi normal — selisih kecil di antaranya hanya noise simulasi 10.000 hari", why: "Benar: keduanya normal-based; historis yang tanpa asumsi itulah yang berbeda (0,0286).", correct: true },
            { text: "Karena seed 42 membuat Monte Carlo selalu sama dengan parametrik", why: "Seed hanya membuat simulasi bisa direplikasi — kedekatan dengan parametrik disebabkan asumsi normal yang sama, bukan seed-nya." },
            { text: "Karena Monte Carlo menghitung VaR 10-hari, bukan 1-hari", why: "Monte Carlo di sini menghitung VaR 1-hari (0,0336) — VaR 10-hari adalah 0,0903 lewat aturan akar-10." },
          ],
        },
        {
          q: "VaR95 10-hari adalah 0,0903 (dari VaR95 1-hari tak-dibulatkan 0,028563 × √10). Apa caveat utama aturan akar-10?",
          options: [
            { text: "Ia mengasumsikan return iid — padahal return nyata tidak iid: volatilitas bergerombol dan korelasi naik saat stres", why: "Benar: akar-10 mengasumsikan tiap hari seperti lemparan dadu yang sama; autokorelasi return kuadrat lag-1 0,1043 menunjukkan volatilitas bergerombol (detail di M4.3).", correct: true },
            { text: "Ia hanya berlaku untuk VaR99, bukan VaR95", why: "Aturan akar-T berlaku untuk horizon apa pun dan alpha apa pun — caveat-nya adalah asumsi iid, bukan alpha-nya." },
            { text: "Ia mengharuskan VaR 1-hari dikali 10, bukan diakarkan", why: "Terbalik: dikali 10 (0,2860) jauh lebih pesimistis daripada √10 (0,0903) — dan bukan yang dipakai industri." },
            { text: "Ia tidak berlaku bila portofolio berisi lebih dari satu saham", why: "Akar-10 berlaku untuk portofolio apa pun selama return portofolionya (kira-kira) iid — jumlah saham bukan masalahnya." },
          ],
        },
        {
          q: "Di lab 2, VaR95 historis 0,0820 vs parametrik 0,0575 pada data 18 hari tenang + 2 hari crash. Mengapa parametrik meremehkan?",
          options: [
            { text: "Karena mean return-nya negatif (-0,0003)", why: "Mean yang nyaris nol bukan penyebabnya — penyebabnya adalah simpangan baku yang «diencerkan» 18 hari tenang." },
            { text: "Karena simpangan baku 0,0348 diencerkan 18 hari tenang — kuantil normal jatuh di antara hari tenang dan crash yang sebenarnya", why: "Benar: normal tidak melihat dua hari crash (-0,08 dan -0,12) sebagai ekor terpisah; historis membacanya apa adanya (0,0820).", correct: true },
            { text: "Karena z 1,6449 terlalu kecil untuk 95%", why: "1,6449 adalah z yang benar untuk kuantil 95% satu sisi distribusi normal — masalahnya bukan z-nya, melainkan asumsi normalnya." },
            { text: "Karena data mainan hanya 20 hari sehingga historis pasti benar", why: "Historis dari 20 hari juga berisik — tapi di contoh ini ia benar karena membaca crash apa adanya, sementara normal menghaluskannya." },
          ],
        },
        {
          q: "Portofolio Rp100 juta, return portofolio hari ini −0,02. Berapa P&L dan loss L hari itu?",
          options: [
            { text: "P&L −Rp2.000.000, loss 0,02", why: "Benar: P&L = −0,02 × Rp100 juta = −Rp2.000.000; loss L = −P&L = 0,02 (kerugian dibaca positif).", correct: true },
            { text: "P&L +Rp2.000.000, loss −0,02", why: "Terbalik: return negatif berarti P&L negatif — portofolio kehilangan Rp2.000.000, bukan mendapatkannya." },
            { text: "P&L −Rp2.000.000, loss −0,02", why: "P&L-nya benar, tapi loss didefinisikan sebagai −P&L sehingga positif: 0,02, bukan −0,02." },
            { text: "P&L Rp0 — return negatif bukan kerugian selama sahamnya tidak dijual", why: "VaR mengukur kerugian mark-to-market harian, bukan kerugian terealisasi: return −0,02 hari ini adalah kerugian Rp2.000.000 hari ini, dijual atau tidak." },
          ],
        },
        {
          q: "Seorang analis menghitung VaR dari close mentah (bukan adjusted close) pada saham yang baru membagikan dividen besar. Apa risikonya?",
          options: [
            { text: "Return palsu di hari ex-date masuk ke deret loss — VaR dan ES downstream ikut salah, dan tidak ada langkah berikutnya yang menangkapnya", why: "Benar: close mentah jatuh sebesar dividen di ex-date tanpa ada kerugian ekonomi — «return» palsu itu merambat: return salah → P&L salah → loss salah → VaR/ES salah.", correct: true },
            { text: "VaR jadi lebih konservatif sehingga lebih aman", why: "Tidak: return palsu itu bukan konservatisme, melainkan kesalahan — ia bisa membesarkan atau mengecilkan VaR tanpa pola yang bisa ditebak." },
            { text: "Tidak ada efek karena dividen kecil dibanding harga saham", why: "Dividen besar menciptakan lompatan harga yang besar di ex-date — justru itulah yang merusak deret return." },
            { text: "ES membesar tapi VaR tetap benar", why: "VaR dan ES dihitung dari deret loss yang SAMA — bila deretnya salah, keduanya salah." },
          ],
        },
      ],
      summary: [
        "VaR adalah kuantil kerugian: VaR95 historis 0,0286 (Rp2.856.323 per Rp100 jt) — 5% hari (sekitar 24 dari 480) kerugiannya lebih besar; VaR bukan kerugian maksimum.",
        "ES adalah rata-rata kerugian bila VaR terlampaui: ES95 historis 0,0445 (Rp4.451.285); ES99 historis 0,0775 (Rp7.750.165).",
        "Alur operasional: posisi & bobot → return portofolio berbobot → P&L rupiah → loss L = −P&L → kuantil (VaR) → rata-rata ekor (ES); VaR95 Rp2.856.323, ES95 Rp4.451.285, VaR99 Rp4.792.081, ES99 Rp7.750.165 per Rp100 jt [notebook]; checklist: adjusted close (bukan close mentah), portfolio value tetap sebagai penyebut, biaya transaksi/funding diabaikan (dinyatakan), rebalance harian.",
        "Trio 95% [notebook]: historis 0,0286/0,0445; parametrik 0,0328/0,0410; Monte Carlo 0,0336/0,0424 (10.000 simulasi, seed 42).",
        "Trio 99%: historis 0,0479/0,0775; parametrik 0,0462/0,0528; Monte Carlo 0,0479/0,0546 — ES99 historis jauh di atas parametrik: bukti empiris ekor tebal.",
        "99% lebih konservatif tapi lebih berisik: hanya ~5 observasi di ekor, melawan 24 di ekor 95%.",
        "VaR95 per saham: BBCA 0,0290, KLBF 0,0380, UNVR 0,0438 — portofolio 0,0286 lebih rendah dari saham teraman: diversifikasi bekerja (korelasi log-return 0,285–0,361).",
        "VaR95 10-hari (akar-10) 0,0903 — dengan caveat return tidak iid (volatilitas bergerombol, lihat M4.3).",
        "Lab: VaR95/ES95 historis dari 20 return mainan (0,0405/0,0500); parametrik vs historis pada data crash (0,0575 vs 0,0820 — normal meremehkan).",
      ],
      next: { label: "Lanjut: MLF-M4.3 — Backtesting VaR & Volatilitas", href: "/v2/learn/mlf-m43-var-backtesting-volatility" },
    },
  ],
};
