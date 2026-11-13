import type { V2Lesson } from "../lib/types";

export const mlfM45: V2Lesson = {
  slug: "mlf-m45-drawdown-regime-stress",
  track: "Machine Learning Finance",
  module: "Market risk — drawdown, regime & stress",
  title: "MLF-M4.5 — Drawdown, Regime & Stress Test: Saat Diversifikasi Menghilang",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M4 mengajarkan random forest, ensembles, dan market risk. Lesson ini menutup modul itu dari sisi yang paling terasa oleh investor: bukan volatilitas harian, melainkan berapa dalam portofolio jatuh dari puncaknya, berapa lama ia terendam di bawah puncak, dan apa yang terjadi pada risiko ketika regime berubah dan korelasi antar saham melonjak bersamaan.",
        "Tujuan lesson ini:",
        "• Menghitung drawdown dari deret kekayaan — running max, drawdown series, maximum drawdown (maxDD), dan durasi terendam — lalu membaca penderitaan, bukan sekadar volatilitas.",
        "• Menghitung matematika pemulihan: drawdown −43,63% butuh +77,40% untuk kembali ke puncak — dan menjelaskan mengapa kerugian jauh lebih mahal daripada keuntungan yang sama besarnya.",
        "• Mengklasifikasikan regime high-vol vs low-vol dari vol rolling 60 hari (ambang persentil 75) dan membandingkan VaR95/VaR99 antar regime.",
        "• Menjalankan correlation-breakdown stress test: mengguncang STRUKTUR korelasi (bukan level return) dan mengukur hilangnya diversifikasi lewat diversification ratio.",
        "• Memahami regime-conditional VaR: VaR95 nyaris sama antar regime, tapi VaR99 jauh berbeda — risiko EKOR-lah yang membedakan regime, bukan risiko biasa.",
        "• Menjalankan dua lab dari nol: drawdown pada deret kekayaan mainan, dan stress korelasi pada portofolio 2-aset mainan.",
        "• Menjalankan stress return dan stress gabungan [ilustrasi] — shock return −10%, shock vol ×1,5, dan gabungannya (korelasi 0,95 + vol ×1,5 + return −10%) — lalu membedakan P&L terealisasi dari VaR/ES.",
        "• Mendeteksi regime secara real-time tanpa look-ahead (ambang expanding persentil 75) dan menguji dengan jujur apakah label regime meramal vol besok.",
        "• Membaca matriks skenario (normal / high-vol / low-vol / stress korelasi × VaR/ES/maxDD/DR) dan memakai tabel keputusan M4.2 + M4.3 + M4.5 untuk memilih buffer yang jujur.",
        "• Memetakan jalan ke M9 (walk-forward, backtesting, Monte Carlo) dan mengerjakan tugas integratif dari marginal/component VaR M4.4 — tanpa klaim optimasi sebelum M5.",
        "Isi lesson: cerita manajer risiko 16 Oktober 2026 → apa itu drawdown → angka drawdown lima aset → matematika pemulihan → regime → regime real-time tanpa look-ahead → 2 lab → stress test korelasi → stress return & gabungan → VaR per regime → matriks skenario → mini-case (tabel keputusan) → jembatan ke M9 → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M4.5 [notebook]: BBCA.JK + KLBF.JK + UNVR.JK + ^GSPC, window 2024-11-01..2026-11-12 (data diunduh 2026-11-12), 481 close per saham IDX (480 log return) dan 508 close ^GSPC (507 return), hari terakhir 2026-11-11. Portofolio = equal-weight 3 saham IDX, rebalance harian, dalam Rp; ^GSPC benchmark dalam USD — efek kurs diabaikan (caveat dicatat di langkah 4). Drawdown dihitung dari kekayaan awal 1,0 memakai simple return.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "16 Oktober 2026: hari ketika semua jatuh bersamaan",
      prose: [
        "Bayangkan kamu manajer risiko sebuah portofolio saham Indonesia — equal-weight BBCA, KLBF, dan UNVR. Pagi 16 Oktober 2026, layar merah semua: BBCA jatuh dengan log return −0,1603 (sekitar −14,8%), KLBF −0,1573 (sekitar −14,6%), UNVR −0,1344 (sekitar −12,6%) — dalam SATU hari [notebook]. Bukan satu saham yang jatuh; ketiganya jatuh bersamaan. Diversifikasi yang selama ini kamu andalkan tidak menolong — karena pada hari itu korelasi antar saham melonjak bersamaan: korelasi rata-rata antar pasangan saham di regime high-vol 0,3752, vs 0,2775 di low-vol [notebook].",
        "Itu bukan pertama kalinya. Pada 8 April 2025 — guncangan tarif — BBCA jatuh dengan log return −0,0892 (sekitar −8,5%) dalam sehari [notebook]. Dan di akhir window, portofolio itu masih terendam −35,28% di bawah puncak tertingginya [notebook]. Pertanyaan lesson ini bukan «berapa volatilitas hariannya?» — VaR sudah menjawab itu di M4.2. Pertanyaannya: «seberapa dalam kamu jatuh, berapa lama kamu terendam, dan apa yang terjadi pada risikomu ketika dunia berubah regime?»",
        "Nilai: portofolio equal-weight 3 saham IDX punya maximum drawdown −0,4363 — dari puncak 2025-11-05 ke lembah 2026-10-19 — dan sampai 2026-11-11 BELUM pulih, masih −0,3528 di bawah puncak, terendam 243 hari [notebook]. Bandingkan dengan ^GSPC: maxDD hanya −0,1890 (2025-02-19 → 2025-04-08), pulih 2025-06-27, saat ini hanya −0,0255, terendam terlama 88 hari [notebook]. Portofolio yang sama-sama «saham» ini hidup di dunia yang berbeda.",
        "Baik atau buruk: drawdown bagus justru di situasi ini — ketika yang ditanya adalah pengalaman investor (berapa lama uangnya di bawah puncak), bukan simpangan baku harian. Buruk bila dibaca sebagai ramalan: maxDD masa lalu tidak menjamin maxDD masa depan — ia mengukur apa yang SUDAH terjadi, bukan apa yang AKAN terjadi.",
        "Mitigasi: laporkan drawdown berdampingan dengan volatilitas dan VaR — ketiganya menjawab pertanyaan yang berbeda. Volatilitas menjawab «seberapa berisik»; VaR menjawab «seberapa buruk satu hari yang buruk»; drawdown menjawab «seberapa dalam dan berapa lama kamu menderita». Investor yang hanya diberi VaR tidak tahu bahwa ia harus menunggu lebih dari setahun untuk kembali ke puncak.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: volatilitas rendah berarti aman",
        type: "pitfall",
        body: "Yang benar: portofolio bisa punya volatilitas harian yang «biasa» (0,0196 per hari, simple return [notebook]) dan tetap mengalami drawdown −43,63% yang butuh +77,40% untuk pulih. Volatilitas mengukur naik-turun harian; drawdown mengukur akumulasi kerugian dari puncak — dan kerugian yang berurutan, walau masing-masing kecil, menenggelamkan kekayaan jauh lebih dalam daripada satu hari yang buruk.",
      },
    },
    {
      id: "drawdown",
      eyebrow: "Langkah 3 · Apa itu drawdown",
      title: "Drawdown: kekayaan dibagi puncak — minus satu",
      prose: [
        "Drawdown dihitung dari deret kekayaan, bukan dari return. Mulai dari kekayaan 1,0. Tiap hari, kekayaan dikalikan (1 + simple return hari itu). Running max adalah puncak tertinggi yang pernah dicapai kekayaan sampai hari itu. Drawdown hari itu = kekayaan / running max − 1. Nilainya selalu ≤ 0: 0 berarti kekayaan sedang di puncak baru, −0,30 berarti kekayaan 30% di bawah puncak terakhir.",
        "Nilai: definisi ini — kekayaan dari 1,0, simple return, running max — adalah definisi yang dipakai notebook M4.5 untuk SEMUA angka drawdown di lesson ini [notebook]. Tiga besaran turunannya: maximum drawdown (maxDD) = drawdown paling negatif sepanjang window; durasi terendam = jumlah hari berurutan terlama dengan drawdown < 0; dan status pemulihan — apakah kekayaan pernah kembali menyentuh puncak, dan kapan.",
        "Gambar di bawah (langkah 4) membandingkan maxDD lima aset. Sebelum membacanya, pegang satu intuisi: drawdown adalah ukuran JALAN, bukan ukuran TITIK. Dua portofolio bisa punya total return akhir yang sama, tapi yang satu jatuh −40% di tengah jalan dan yang lain turun pelan-pelan −10% — pengalaman investornya sama sekali berbeda, dan drawdown menangkap perbedaan itu.",
        "Baik atau buruk: drawdown bagus bila yang ditanya adalah pengalaman dan ketahanan investor — berapa dalam, berapa lama. Buruk bila dipakai sendirian sebagai ukuran risiko: drawdown tidak berkata apa-apa tentang seberapa sering kerugian terjadi, dan ia sangat sensitif terhadap SATU puncak di awal window (puncak November 2024 yang tinggi membuat semua drawdown sesudahnya terlihat dalam).",
        "Mitigasi: laporkan selalu empat hal berdampingan — maxDD, tanggal puncak → lembah, status pulih/belum, dan durasi terendam terlama. MaxDD tanpa tanggal adalah angka tanpa cerita; tanpa durasi, kamu tidak tahu apakah −40% itu berlangsung seminggu atau setahun.",
      ],
      formula: String.raw`DD_t = \frac{W_t}{\max_{s \le t} W_s} - 1`,
      formulaNote: "Drawdown hari t: kekayaan W_t dibagi puncak tertinggi sejauh ini (running max), minus 1. Maximum drawdown = nilai DD_t paling negatif sepanjang window. Kekayaan W dihitung dari 1,0 dengan simple return.",
      tasks: [],
    },
    {
      id: "angka-drawdown",
      eyebrow: "Langkah 4 · Angka drawdown",
      title: "Lima aset, lima cerita terendam",
      prose: [
        "Nilai [notebook]: BBCA maxDD −0,4973 (puncak 2024-11-05 → lembah 2026-06-08), BELUM pulih, saat ini −0,4441, terendam terlama 478 hari — hampir seluruh window 480 hari. KLBF maxDD −0,5791 (2025-06-04 → 2026-10-19), belum pulih, saat ini −0,5052, terendam 347 hari — yang terdalam dari kelimanya. UNVR maxDD −0,4925 (2024-12-10 → 2025-02-28), PULIH 2025-10-16, namun jatuh lagi sesudahnya dan saat ini −0,4051 di bawah puncak baru, terendam 211 hari. Portofolio maxDD −0,4363 (2025-11-05 → 2026-10-19), belum pulih, saat ini −0,3528, terendam 243 hari. ^GSPC maxDD −0,1890 (2025-02-19 → 2025-04-08), pulih 2025-06-27, saat ini −0,0255, terendam 88 hari.",
        "Gambar di bawah membandingkan maxDD kelimanya. Perhatikan dua hal. Pertama, diversifikasi MEMBANTU tapi tidak menyelamatkan: maxDD portofolio −0,4363 lebih dangkal daripada KLBF −0,5791 dan BBCA −0,4973 — tapi tetap jauh lebih dalam daripada ^GSPC −0,1890. Kedua, yang paling menyakitkan bukan kedalamannya saja: BBCA terendam 478 dari 480 hari — investor BBCA praktis tidak pernah melihat puncak baru selama hampir dua tahun.",
        "Baik atau buruk: drawdown bagus untuk membandingkan «penderitaan» antar aset dalam window yang sama. Buruk bila membandingkan window yang berbeda — maxDD sangat bergantung pada di mana window dimulai (puncak 2024-11-05 ada di dalam window ini; geser window-nya, berubah ceritanya). Dan satu caveat yang wajib dicatat: ^GSPC diukur dalam USD sementara portofolio dalam Rp — efek kurs diabaikan di lesson ini. Perbandingan ini membandingkan pergerakan pasar, bukan pengalaman investor Rupiah yang membeli S&P 500.",
        "Mitigasi: saat membaca drawdown, tanyakan selalu «puncak mana yang dipakai?» — puncak di awal window yang tinggi akan membuat semua drawdown sesudahnya terlihat dalam. Dan jangan bandingkan maxDD antar window yang berbeda panjangnya: window yang lebih panjang hampir selalu punya maxDD yang lebih dalam, karena ada lebih banyak kesempatan untuk jatuh.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar maximum drawdown: KLBF -0,5791; BBCA -0,4973; UNVR -0,4925; portofolio -0,4363; GSPC -0,1890">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Maximum drawdown — seberapa dalam dari puncak (2024-11-01..2026-11-11)</text>
<text x="8" y="54" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">BBCA</text>
<rect x="70" y="40" width="315.0" height="20" fill="var(--c4)"/>
<text x="391.0" y="54" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,4973</text>
<text x="8" y="90" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">KLBF</text>
<rect x="70" y="76" width="366.8" height="20" fill="var(--c4)"/>
<text x="442.8" y="90" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,5791</text>
<text x="8" y="126" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">UNVR</text>
<rect x="70" y="112" width="312.0" height="20" fill="var(--c1)"/>
<text x="388.0" y="126" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,4925</text>
<text x="8" y="162" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PORT</text>
<rect x="70" y="148" width="276.3" height="20" fill="var(--c2)"/>
<text x="352.3" y="162" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,4363</text>
<text x="8" y="198" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GSPC</text>
<rect x="70" y="184" width="119.7" height="20" fill="var(--c1)"/>
<text x="195.7" y="198" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,1890</text>
<text x="70" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="260" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">-0,3</text>
<text x="450" y="214" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">-0,6</text>
<text x="240.0" y="232" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">UNVR satu-satunya saham IDX yang pulih (2025-10-16); BBCA/KLBF/portofolio belum pulih.</text>
</svg>`,
        alt: "Bar maximum drawdown: KLBF -0,5791; BBCA -0,4973; UNVR -0,4925; portofolio -0,4363; GSPC -0,1890.",
        caption: "Cara membaca: panjang bar = kedalaman maximum drawdown dari puncak (kekayaan awal 1,0, simple return); makin panjang makin dalam. Interpretasi: KLBF terdalam (−0,5791), portofolio lebih dangkal dari saham terburuknya (−0,4363 vs −0,5791) — diversifikasi membantu, tapi tetap jauh lebih dalam daripada ^GSPC (−0,1890).",
      },
      tasks: [],
      note: {
        title: "Caveat: ^GSPC dalam USD, portofolio dalam Rp",
        type: "risk",
        body: "Perbandingan drawdown ^GSPC vs saham IDX di lesson ini mengabaikan efek kurs: ^GSPC diukur dalam USD, portofolio dalam Rp. Investor Rupiah yang membeli S&P 500 akan mengalami drawdown yang berbeda karena pergerakan USD/IDR. Angka ini membandingkan pergerakan pasar, bukan pengalaman investor Rupiah.",
      },
    },
    {
      id: "recovery",
      eyebrow: "Langkah 5 · Matematika pemulihan",
      title: "Pulih butuh lebih dari yang hilang",
      prose: [
        "Kerugian dan keuntungan tidak simetris. Turun 50% butuh naik 100% untuk kembali — bukan 50%. Rumusnya: dari drawdown d (negatif), return yang dibutuhkan untuk kembali ke puncak adalah 1 / (1 + d) − 1. Makin dalam drawdown, makin tidak proporsional harga pemulihannya.",
        "Nilai [notebook]: portofolio maxDD −0,4363 butuh +77,40% untuk pulih (1 / (1 − 0,4363) − 1 = 0,7740). BBCA −0,4973 butuh +98,93% — praktis harus naik dua kali lipat dari lembah. KLBF −0,5791 butuh +137,59%. UNVR −0,4925 butuh +97,04% — dan ia memang pulih, pada 2025-10-16, sekitar 8 bulan setelah lembah 2025-02-28 — namun setelah pulih ia jatuh lagi, hingga −0,4051 di bawah puncak baru pada 2026-11-11. ^GSPC −0,1890 hanya butuh +23,30% — dan pulih dalam waktu kurang dari 3 bulan (lembah 2025-04-08 → pulih 2025-06-27).",
        "Recovery time matters — dan di sinilah drawdown berbeda dari volatilitas. UNVR dan BBCA punya maxDD yang hampir sama (−0,4925 vs −0,4973), tapi UNVR pulih dalam ~8 bulan sementara BBCA belum pulih setelah lebih dari 2 tahun dari puncak 2024-11-05 (lembah 2026-06-08 → 2026-11-11 hanya ~5 bulan), masih −0,4441 di bawah puncak. Dua aset dengan «risiko» yang terlihat sama di satu angka ternyata memberi pengalaman yang sangat berbeda.",
        "Baik atau buruk: matematika pemulihan bagus untuk mengomunikasikan risiko ke investor awam — «turun 43% berarti harus naik 77%» jauh lebih terasa daripada «volatilitas 31% per tahun». Buruk bila dibaca sebagai janji: rumus ini hanya berkata berapa yang DIBUTUHKAN, bukan berapa lama waktu yang dibutuhkan — waktu pemulihan bergantung pada return masa depan, yang tidak diketahui.",
        "Mitigasi: saat mengevaluasi strategi, tanyakan dua angka — berapa dalam (maxDD) DAN berapa lama (durasi terendam + waktu pemulihan). Strategi yang jatuh −20% dan pulih dalam sebulan jauh lebih mudah dipertahankan investornya daripada strategi yang jatuh −20% dan terendam dua tahun — walau maxDD-nya sama.",
      ],
      formula: String.raw`R_{pulih} = \frac{1}{1 + d} - 1`,
      formulaNote: "Return yang dibutuhkan untuk kembali ke puncak dari drawdown d (d negatif). Contoh portofolio: d = −0,4363 → R = 1 / 0,5637 − 1 = 0,7740 (+77,40%).",
      tasks: [],
      note: {
        title: "Miskonsepsi: turun 40% lalu naik 40% berarti kembali",
        type: "pitfall",
        body: "Yang benar: turun 40% (kekayaan 1,0 → 0,6) lalu naik 40% hanya membawa kekayaan ke 0,84 — masih 16% di bawah puncak. Untuk kembali ke 1,0 dari 0,6 dibutuhkan +66,67%. Persentase dihitung dari basis yang berbeda: kerugian dari puncak, keuntungan dari lembah.",
      },
    },
    {
      id: "regime",
      eyebrow: "Langkah 6 · Regime",
      title: "Regime: saat parameter risiko berubah",
      prose: [
        "Regime bukan ramalan — ini klasifikasi ex-post, cara mengelompokkan hari-hari yang sudah terjadi berdasarkan kondisi volatilitas saat itu. Definisi di lesson ini [notebook]: hitung vol rolling 60 hari portofolio (log return, disetahunkan), lalu tandai hari sebagai high-vol bila vol rolling-nya di atas persentil 75 — yaitu 0,3316 per tahun. Sisanya low-vol. Ambang 0,3316 bukan hukum alam; ia adalah kuartil atas dari window ini — cara yang transparan untuk memisahkan «masa bergejolak» dari «masa tenang».",
        "Nilai [notebook]: 105 hari high-vol vs 375 hari low-vol — bukan 120 hari (25% dari 480), karena persentil dihitung atas 421 nilai vol rolling yang valid: jendela 60 hari baru menghasilkan nilai pertama pada hari ke-60, jadi hanya ada 480 − 60 + 1 = 421 nilai; 25% × 421 = 105,25, dibulatkan ke 105 hari. Low-vol 375 hari = 316 hari bervol di bawah ambang + 59 hari pertama yang belum punya vol rolling (jendela 60 hari) — kode menghitungnya sebagai low-vol karena tidak melewati ambang. High-vol: mean return harian +0,003215, vol harian 0,0260 (0,4131 tahunan), VaR95 historis 0,0261, VaR99 historis 0,0761. Low-vol: mean harian −0,001863, vol harian 0,0175 (0,2777 tahunan), VaR95 0,0294, VaR99 0,0456. Dan korelasi rata-rata antar pasangan saham: high-vol 0,3752 vs low-vol 0,2775 — di masa bergejolak, saham-saham bergerak lebih bersamaan.",
        "Gambar di bawah membandingkan VaR95 dan VaR99 antar regime — dan di situlah kejutan lesson ini berada (dibahas penuh di langkah 12). Untuk sekarang, perhatikan satu hal: vol harian high-vol (0,0260) hanya sekitar 1,5 kali low-vol (0,0175) — regime tidak mengubah volatilitas secara dramatis. Yang berubah dramatis adalah EKOR-nya.",
        "Kaitan dengan M4.3: regime ada karena vol clustering. Autokorelasi squared return portofolio lag 1 adalah 0,1043 [notebook] — hari yang bergejolak cenderung diikuti hari yang bergejolak. Volatilitas tidak datang sebagai kejutan satu hari yang acak; ia datang berkelompok, dalam episode. Regime high-vol/low-vol hanyalah cara memberi nama pada episode-episode itu — dan GARCH (M4.3) adalah cara memodelkan pergerakannya hari demi hari.",
        "Baik atau buruk: klasifikasi regime bagus untuk memahami bahwa parameter risiko BERUBAH — VaR, korelasi, dan vol yang dihitung dari seluruh window adalah rata-rata dari dua dunia yang berbeda. Buruk bila dipakai untuk meramal: label high-vol baru diketahui SETELAH vol rolling 60 hari terbentuk — ia menjelaskan masa lalu, bukan memprediksi besok. Dan ambang persentil 75 adalah pilihan manusia: geser ambangnya, berubah komposisi regime-nya.",
        "Mitigasi: laporkan selalu definisi regime-mu (window rolling, ambang, jumlah hari tiap regime) berdampingan dengan hasilnya — tanpa definisi, angka «VaR high-vol» tidak bisa dibandingkan dengan apa pun. Dan jangan pernah memakai label regime ex-post untuk mengklaim «modelku tahu kapan regime berubah» — itu look-ahead bias.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar VaR historis per regime: high-vol VaR95 0,0261 VaR99 0,0761; low-vol VaR95 0,0294 VaR99 0,0456; garis VaR99 statis M4.2 0,0479">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VaR historis per regime — VaR95 mirip, VaR99 jauh berbeda</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,06</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,08</text>
<line x1="52" y1="100.6" x2="466" y2="100.6" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="93.6" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">VaR99 statis M4.2: 0,0479</text>
<rect x="110" y="148.6" width="55" height="57.4" fill="var(--c1)"/>
<text x="137" y="144.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0261</text>
<rect x="180" y="38.6" width="55" height="167.4" fill="var(--c4)"/>
<text x="207" y="34.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0761</text>
<rect x="300" y="141.3" width="55" height="64.7" fill="var(--c1)"/>
<text x="327" y="137.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0294</text>
<rect x="370" y="105.7" width="55" height="100.3" fill="var(--c4)"/>
<text x="397" y="101.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0456</text>
<text x="145" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">High-vol (n = 105) · VaR95 | VaR99</text>
<text x="335" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Low-vol (n = 375) · VaR95 | VaR99</text>
</svg>`,
        alt: "Bar VaR historis per regime: high-vol VaR95 0,0261 VaR99 0,0761; low-vol VaR95 0,0294 VaR99 0,0456; garis VaR99 statis M4.2 0,0479.",
        caption: "Cara membaca: tiap kelompok dua bar — bar terang = VaR95 historis, bar gelap = VaR99 historis; garis putus-putus = VaR99 statis M4.2 (0,0479). Interpretasi: VaR95 nyaris sama antar regime (0,0261 vs 0,0294), tapi VaR99 high-vol (0,0761) jauh di atas low-vol (0,0456) dan di atas VaR99 statis — ekor yang membedakan regime.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: regime adalah ramalan",
        type: "pitfall",
        body: "Yang benar: regime di sini adalah klasifikasi ex-post — label high-vol baru bisa ditempel setelah vol rolling 60 hari terbentuk. Regime menjelaskan bahwa parameter risiko BERUBAH antar periode, bukan memprediksi kapan perubahan berikutnya terjadi. Model yang memakai label regime masa depan untuk mengambil keputusan hari ini menderita look-ahead bias.",
      },
    },
    {
      id: "regime-realtime",
      eyebrow: "Langkah 7 · Regime real-time",
      title: "Regime real-time: label hari ini, keputusan besok",
      prose: [
        "Langkah sebelumnya memakai ambang persentil 75 dari SELURUH window — 0,3316 [notebook]. Itu sah untuk memahami sejarah, tapi tidak bisa dipakai untuk mengambil keputusan di tengah jalan: pada 16 Oktober 2026, kamu belum tahu bahwa 0,3316 adalah persentil 75 dari window yang baru berakhir November 2026. Memakai ambang full-sample untuk keputusan historis adalah look-ahead bias — kamu memakai informasi masa depan. Prosedur real-time memperbaikinya dengan satu aturan: hanya memakai data yang sudah tersedia saat itu.",
        "Prosedur real-time (timeline): (1) Data — tiap hari, hitung vol rolling 60 hari portofolio dari log return, seperti sebelumnya. (2) Ambang expanding — pada hari t, ambang = persentil 75 dari SEMUA nilai rolling-vol yang tersedia sampai hari t (expanding window), dan baru mulai setelah 60 nilai terkumpul agar persentilnya stabil. (3) Label hari ini — hari t disebut high-vol bila vol rolling hari t di atas ambang hari t. (4) Keputusan besok — label hari t dipakai untuk keputusan posisi/buffer pada hari t+1 (BESOK), bukan hari ini: label terbentuk dari data yang termasuk hari t, jadi ia tidak bisa melindungi dari kerugian hari t itu sendiri.",
        "Nilai: ambang full-sample p75 = 0,3316 (105 hari high dari 421 nilai rolling-vol valid) [notebook]. Prosedur real-time menilai 361 hari (421 nilai dikurangi 60 nilai pertama yang dipakai membangun ambang). Kesepakatan label real-time vs full-sample: 94,46% (341 dari 361 hari) — tinggi, tapi tidak sempurna. Real-time mendeteksi 54 hari high vs 70 hari high full-sample pada periode yang sama: UNDER-detect — 16 hari high terlewat. Itulah harga dari tanpa-look-ahead: ambang expanding bergerak mengikuti data, jadi ia terlambat mengenali episode yang baru mulai.",
        "Dan inilah hasil yang paling jujur: vol terealisasi ESOK hari setelah label HIGH real-time adalah 0,0192 (n=53), vs setelah label LOW 0,0191 (n=307) — HAMPIR IDENTIK. Label regime TIDAK memprediksi vol besok. Nilainya ada pada keputusan buffer/posisi SAAT INI — risiko kontemporer: hari ini vol sedang tinggi, jadi buffer hari ini harus memakai angka high-vol — bukan pada ramalan bahwa besok akan bergejolak. Vol clustering (M4.3) berkata volatilitas bergerombol; ia tidak berkata gerombolan itu berlanjut besok dengan vol yang sama.",
        "Episode September–November 2026: high full-sample pertama 2026-10-16 DAN high real-time pertama juga 2026-10-16 — lag 0 hari pada crash itu. Jangan salah baca: lag 0 bukan berarti label itu melindungimu dari 16 Oktober. Label high-vol 16 Oktober terbentuk DARI data yang termasuk return 16 Oktober itu sendiri — kerugian −15,06% hari itu sudah terjadi sebelum labelnya ada. Ambang real-time terakhir (11 November 2026): 0,3316 — sama persis dengan ambang full-sample (konvergen): setelah 421 nilai, ambang expanding sudah «mengejar» ambang full-sample.",
        "Latihan walk-forward kecil: ambil 361 hari yang dinilai dan bandingkan label real-time vs full-sample hari demi hari. (1) Hitung sendiri kesepakatannya: 341 hari sepakat dari 361 — berapa persen? (2) Hitung under-detect-nya: 70 hari high full-sample dikurangi 54 hari high real-time = 16 hari high yang terlewat. (3) Uji klaim prediktifnya: bila label HIGH benar-benar meramal vol besok, vol esok hari setelah HIGH harus jauh lebih besar daripada setelah LOW — bandingkan 0,0192 vs 0,0191 dan simpulkan sendiri. Jawaban: (1) 94,46%; (2) 16 hari — dan karena ambang expanding baru naik setelah data vol tinggi masuk ke jendela, keterlambatan itu wajar terjadi di awal episode; (3) hampir identik — label bukan ramalan.",
        "Baik atau buruk: deteksi real-time bagus bila yang ditanya adalah «bagaimana mengambil keputusan hari ini tanpa mengintip masa depan?» — ia jujur tentang apa yang diketahui saat itu. Buruk bila dipakai sebagai sinyal trading «besok akan bergejolak»: bukti di data ini berkata vol besok hampir sama setelah label HIGH maupun LOW. Dan under-detect 16 hari mengingatkan: prosedur yang jujur akan terlambat — ia tidak bisa mendeteksi episode sebelum episode itu menghasilkan data.",
        "Mitigasi: bila kamu memakai regime untuk keputusan, pakai prosedur real-time (ambang expanding, keputusan t+1) — bukan ambang full-sample. Laporkan selalu dua angka: kesepakatan vs full-sample (di sini 94,46%) DAN under-detect-nya (di sini 16 hari) — kesepakatan tinggi tanpa under-detect menyembunyikan harga yang dibayar. Dan jangan pernah mengklaim label regime meramal vol besok tanpa menguji vol esok hari setelah tiap label, seperti di atas.",
      ],
      formula: String.raw`\theta_t = P_{75}(\{v_{60}, \dots, v_t\})`,
      formulaNote: "Ambang real-time hari t: persentil 75 dari semua nilai vol rolling 60 hari yang tersedia sampai hari t (expanding window, mulai setelah 60 nilai). Label hari t (high bila v_t > θ_t) dipakai untuk keputusan hari t+1.",
      tasks: [],
      note: {
        title: "Miskonsepsi: lag 0 hari berarti label melindungi dari crash",
        type: "pitfall",
        body: "Yang benar: pada episode 16 Oktober 2026, label high-vol real-time pertama memang jatuh pada 2026-10-16 — tapi label itu terbentuk DARI data yang termasuk return 16 Oktober itu sendiri. Kerugian hari itu sudah terjadi sebelum labelnya ada. Label real-time memberi tahu kondisi hari ini untuk keputusan besok — ia tidak pernah melindungi dari kerugian hari ini.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: drawdown dari nol pada deret kekayaan mainan",
      prose: [
        "Sekarang giliranmu menghitung drawdown. Datanya 8 return harian mainan — kekayaan awal 1,0 — dengan satu kejatuhan besar di hari ke-4 (−30%) dan pemulihan sebagian sesudahnya. Tanpa library: hanya perkalian, running max, dan pembagian.",
        "Perhatikan apa yang terjadi: kekayaan memuncak di 1,254 pada hari ke-3, lalu jatuh ke 0,8778 pada hari ke-4 — drawdown −0,3000, yang terdalam [lab]. Sesudahnya kekayaan naik lagi sampai 1,1466, tapi tidak pernah menyentuh puncak 1,254 — drawdown saat ini −0,1771, belum pulih [lab]. Dan karena drawdown tetap negatif dari hari ke-4 sampai hari ke-8, terendam terlama adalah 5 hari [lab].",
        "Bandingkan dengan notebook: di sana BBCA terendam 478 hari dan portofolio 243 hari — mekaniknya persis sama, hanya skalanya berbeda. Lab kecil menunjukkan cara menghitungnya; notebook menunjukkan betapa lamanya terendam itu bisa berlangsung di data nyata.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi maxDD: drawdown paling negatif dari deret dd" },
        { id: "t2", text: "Lengkapi indeks lembah (trough): posisi maxDD di deret dd" },
        { id: "t3", text: "Lengkapi run terendam: hitung hari berurutan dengan dd < 0 dan simpan yang terpanjang" },
        { id: "t4", text: "Lengkapi kebutuhan pulih: 1 / (1 + max_dd) - 1" },
      ],
      expected: "wealth: [1.0, 1.1, 1.045, 1.254, 0.8778, 0.9656, 0.9173, 1.1466, 1.032]\ndrawdown: [0.0, 0.0, -0.05, 0.0, -0.3, -0.23, -0.2685, -0.0856, -0.1771]\nmaxDD: -0.3000 (hari ke-4)\nterendam terlama: 5 hari\nbutuh pulih dari maxDD: +42.86%\ndrawdown saat ini: -0.1771 (belum pulih)",
      hints: [
        "maxDD = min(dd) — drawdown selalu ≤ 0, jadi yang paling negatif adalah yang terdalam.",
        "Indeks lembah: dd.index(max_dd) — posisi pertama nilai terdalam.",
        "Run terendam: tambah 1 tiap hari dd < 0, reset ke 0 saat dd = 0; simpan maksimumnya.",
        "Butuh pulih: 1 / (1 + max_dd) - 1 — dengan max_dd negatif, hasilnya positif.",
      ],
      code: {
        starter: `# Return harian mainan (simple return) selama 8 hari — kekayaan awal 1,0
rets = [0.10, -0.05, 0.20, -0.30, 0.10, -0.05, 0.25, -0.10]

# 1) Deret kekayaan: mulai 1,0, kalikan (1 + return) tiap hari
wealth = [1.0]
for r in rets:
    wealth.append(wealth[-1] * (1 + r))

# 2) Running max: puncak tertinggi sejauh ini
peak = []
best = wealth[0]
for w in wealth:
    best = max(best, w)
    peak.append(best)

# 3) Drawdown: kekayaan / puncak - 1
dd = [w / p - 1 for w, p in zip(wealth, peak)]

# 4) maxDD dan hari lembah
max_dd = 0.0  # TODO: drawdown paling negatif
trough = 0  # TODO: indeks hari lembah

# 5) Terendam terlama: run terpanjang dd < 0
longest = 0
run = 0
for v in dd:
    run = 0  # TODO: tambah 1 bila v < 0, reset ke 0 bila tidak
    longest = max(longest, run)

# 6) Butuh pulih dari maxDD: 1 / (1 + max_dd) - 1
need = 0.0  # TODO: rumus pemulihan

print("wealth:", [round(w, 4) for w in wealth])
print("drawdown:", [round(v, 4) for v in dd])
print(f"maxDD: {max_dd:.4f} (hari ke-{trough})")
print(f"terendam terlama: {longest} hari")
print(f"butuh pulih dari maxDD: +{need * 100:.2f}%")
print(f"drawdown saat ini: {dd[-1]:.4f} (belum pulih)" if dd[-1] < 0 else "drawdown saat ini: 0.0000 (pulih)")`,
        lockLines: 19,
        solution: `# Return harian mainan (simple return) selama 8 hari — kekayaan awal 1,0
rets = [0.10, -0.05, 0.20, -0.30, 0.10, -0.05, 0.25, -0.10]

# 1) Deret kekayaan: mulai 1,0, kalikan (1 + return) tiap hari
wealth = [1.0]
for r in rets:
    wealth.append(wealth[-1] * (1 + r))

# 2) Running max: puncak tertinggi sejauh ini
peak = []
best = wealth[0]
for w in wealth:
    best = max(best, w)
    peak.append(best)

# 3) Drawdown: kekayaan / puncak - 1
dd = [w / p - 1 for w, p in zip(wealth, peak)]

# 4) maxDD dan hari lembah
max_dd = min(dd)
trough = dd.index(max_dd)

# 5) Terendam terlama: run terpanjang dd < 0
longest = 0
run = 0
for v in dd:
    run = run + 1 if v < 0 else 0
    longest = max(longest, run)

# 6) Butuh pulih dari maxDD: 1 / (1 + max_dd) - 1
need = 1 / (1 + max_dd) - 1

print("wealth:", [round(w, 4) for w in wealth])
print("drawdown:", [round(v, 4) for v in dd])
print(f"maxDD: {max_dd:.4f} (hari ke-{trough})")
print(f"terendam terlama: {longest} hari")
print(f"butuh pulih dari maxDD: +{need * 100:.2f}%")
print(f"drawdown saat ini: {dd[-1]:.4f} (belum pulih)" if dd[-1] < 0 else "drawdown saat ini: 0.0000 (pulih)")`,
        checks: [
          { kind: "equal", task: "t1", name: "max_dd", value: -0.3, tol: 1e-9, label: "`max_dd` seharusnya -0.3", msg: "maxDD −0,3000 — kekayaan jatuh 30% dari puncak 1,254 ke 0,8778." },
          { kind: "equal", task: "t3", name: "longest", value: 5, label: "`longest` seharusnya 5", msg: "Terendam terlama 5 hari — dari hari ke-4 sampai hari ke-8 drawdown tidak pernah kembali ke 0." },
          { kind: "stdout_matches", task: "t1", pattern: "maxDD: -0\\.3000 \\(hari ke-4\\)", label: "Output menampilkan maxDD -0.3000 di hari ke-4", msg: "Format: maxDD: -0.3000 (hari ke-4)." },
          { kind: "stdout_matches", task: "t4", pattern: "butuh pulih dari maxDD: \\+42\\.86%", label: "Output menampilkan kebutuhan pulih +42.86%", msg: "Dari −30% butuh +42,86% untuk kembali ke puncak — bukan 30%." },
          { kind: "stdout_matches", task: "t3", pattern: "terendam terlama: 5 hari", label: "Output menampilkan terendam terlama 5 hari", msg: "Format: terendam terlama: 5 hari." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: stress korelasi dari nol pada portofolio 2-aset mainan",
      prose: [
        "Lab kedua adalah correlation-breakdown stress test versi paling sederhana: portofolio 2 aset, bobot 50/50, vol harian aset 0,02 dan 0,03. Hitung vol portofolio pada korelasi 0,30, lalu guncang korelasinya ke 0,95 dan 1,00 — vol aset TIDAK berubah, hanya korelasinya. Lalu hitung diversification ratio: rata-rata vol tertimbang dibagi vol portofolio.",
        "Hasilnya [lab]: korelasi 0,30 → vol harian 0,0204, rasio diversifikasi 1,2272, VaR95 parametrik 0,0335. Korelasi 0,95 → vol 0,0247 (+21,24%), rasio 1,0122, VaR95 0,0406. Korelasi 1,00 → vol 0,0250, rasio 1,0000, VaR95 0,0411 — diversifikasi hilang sepenuhnya: vol portofolio sama dengan rata-rata vol asetnya.",
        "Perhatikan: TIDAK ADA satu pun return yang diguncang di lab ini. Yang diguncang hanya korelasi — struktur, bukan level. Itulah bedanya stress test korelasi dengan stress test return (misal «semua saham turun 10%»): yang pertama bertanya «bagaimana bila diversifikasimu berhenti bekerja?», yang kedua bertanya «bagaimana bila hargamu jatuh?». Di notebook, jawabannya lebih besar lagi: vol portofolio naik +33,0% saat korelasi menjadi 0,95 — karena ada 3 aset dan korelasi normalnya lebih rendah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi vol portofolio: akar(w1^2 s1^2 + w2^2 s2^2 + 2 w1 w2 s1 s2 rho)" },
        { id: "t2", text: "Lengkapi diversification ratio: (w1*s1 + w2*s2) / vol" },
        { id: "t3", text: "Jalankan untuk korelasi 0,30 / 0,95 / 1,00 dan baca kenaikan vol-nya" },
      ],
      expected: "korelasi 0.30: vol harian=0.0204 rasio diversifikasi=1.2272 VaR95=0.0335\nkorelasi 0.95: vol harian=0.0247 rasio diversifikasi=1.0122 VaR95=0.0406\nkorelasi 1.00: vol harian=0.0250 rasio diversifikasi=1.0000 VaR95=0.0411\nvol naik +21.24% saat korelasi 0.30 -> 0.95",
      hints: [
        "Varians portofolio 2 aset: (w1*s1)^2 + (w2*s2)^2 + 2*w1*w2*s1*s2*rho — vol = akar varians.",
        "Diversification ratio = rata-rata vol tertimbang dibagi vol portofolio — nilainya 1,0000 saat korelasi 1,00.",
        "VaR95 parametrik (mean 0): 1,6449 × vol — z 95% distribusi normal standar.",
      ],
      code: {
        starter: `import math

# Portofolio 2 aset mainan: bobot 50/50, vol harian aset 0,02 dan 0,03
w1, w2 = 0.5, 0.5
s1, s2 = 0.02, 0.03

def port_vol(rho):
    return 0.0  # TODO: akar(w1^2 s1^2 + w2^2 s2^2 + 2 w1 w2 s1 s2 rho)

def div_ratio(vol):
    return 0.0  # TODO: (w1*s1 + w2*s2) / vol

for rho in [0.30, 0.95, 1.00]:
    v = port_vol(rho)
    dr = div_ratio(v)
    var95 = 1.6449 * v  # VaR95 parametrik, mean 0
    print(f"korelasi {rho:.2f}: vol harian={v:.4f} rasio diversifikasi={dr:.4f} VaR95={var95:.4f}")

base = port_vol(0.30)
stress = port_vol(0.95)
print(f"vol naik +{(stress / base - 1) * 100:.2f}% saat korelasi 0.30 -> 0.95")`,
        lockLines: 7,
        solution: `import math

# Portofolio 2 aset mainan: bobot 50/50, vol harian aset 0,02 dan 0,03
w1, w2 = 0.5, 0.5
s1, s2 = 0.02, 0.03

def port_vol(rho):
    return math.sqrt((w1 * s1) ** 2 + (w2 * s2) ** 2 + 2 * w1 * w2 * s1 * s2 * rho)

def div_ratio(vol):
    return (w1 * s1 + w2 * s2) / vol

for rho in [0.30, 0.95, 1.00]:
    v = port_vol(rho)
    dr = div_ratio(v)
    var95 = 1.6449 * v  # VaR95 parametrik, mean 0
    print(f"korelasi {rho:.2f}: vol harian={v:.4f} rasio diversifikasi={dr:.4f} VaR95={var95:.4f}")

base = port_vol(0.30)
stress = port_vol(0.95)
print(f"vol naik +{(stress / base - 1) * 100:.2f}% saat korelasi 0.30 -> 0.95")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "korelasi 0\\.30: vol harian=0\\.0204 rasio diversifikasi=1\\.2272 VaR95=0\\.0335", label: "Output menampilkan vol normal 0.0204 pada korelasi 0.30", msg: "Korelasi 0,30: vol 0,0204, rasio 1,2272, VaR95 0,0335." },
          { kind: "stdout_matches", task: "t1", pattern: "korelasi 0\\.95: vol harian=0\\.0247 rasio diversifikasi=1\\.0122 VaR95=0\\.0406", label: "Output menampilkan vol stress 0.0247 pada korelasi 0.95", msg: "Korelasi 0,95: vol 0,0247, rasio 1,0122 — diversifikasi hampir hilang." },
          { kind: "stdout_matches", task: "t2", pattern: "korelasi 1\\.00: vol harian=0\\.0250 rasio diversifikasi=1\\.0000 VaR95=0\\.0411", label: "Output menampilkan rasio 1.0000 pada korelasi 1.00", msg: "Korelasi 1,00: rasio diversifikasi tepat 1,0000 — tidak ada lagi manfaat diversifikasi." },
          { kind: "stdout_matches", task: "t3", pattern: "vol naik \\+21\\.24% saat korelasi 0\\.30 -> 0\\.95", label: "Output menampilkan kenaikan vol +21.24%", msg: "Vol naik +21,24% hanya karena korelasi naik — tanpa satu pun return yang diguncang." },
        ],
      },
    },
    {
      id: "stress",
      eyebrow: "Langkah 10 · Stress test korelasi",
      title: "Stress test korelasi: guncang struktur, bukan level",
      prose: [
        "Inilah USP pertama lesson ini. Stress test yang biasa — «bagaimana bila semua saham turun 10%?» — mengguncang LEVEL return. Correlation-breakdown stress test mengguncang STRUKTUR: vol tiap saham dibiarkan sama seperti sejarahnya, mean return dibiarkan sama, yang diubah hanya matriks korelasinya — semua korelasi antar pasangan dipaksa menjadi 0,95, lalu 1,00. Pertanyaannya: berapa besar risiko portofoliomu bila diversifikasi berhenti bekerja?",
        "Nilai [notebook]: vol harian portofolio (log return) normal 0,0197 → korelasi 0,95: 0,0262 (+33,0%) → korelasi 1,0: 0,0267 (+35,5%). Persen dihitung dari angka tampil yang dibulatkan empat desimal; dari nilai tak-dibulatkan di notebook, kenaikannya sedikit berbeda. Diversification ratio 1,3530 → 1,0169 pada korelasi 0,95 — hampir 1, artinya diversifikasi hampir hilang: vol portofolio hampir sama dengan rata-rata vol asetnya. VaR95 parametrik 0,0324 → 0,0431 (korelasi 0,95) → 0,0438 (korelasi 1,0). Dalam Rupiah: pada portofolio Rp100 juta, VaR95 harian naik dari Rp3.240.000 menjadi Rp4.310.000 — tanpa satu pun saham yang «jatuh» di skenario ini.",
        "Gambar di bawah membandingkan vol harian di tiga kondisi korelasi. Perhatikan: dari korelasi 0,95 ke 1,00, vol hanya naik sedikit lagi (0,0262 → 0,0267) — karena pada 0,95 diversifikasi praktis sudah hilang. Kerusakan terbesar terjadi pada lompatan pertama, dari korelasi normal ke 0,95. Itulah pelajaran 16 Oktober 2026: kamu tidak butuh korelasi sempurna 1,00 untuk kehilangan diversifikasi — 0,95 sudah cukup.",
        "Baik atau buruk: stress korelasi bagus bila yang ditanya adalah ketahanan struktur portofolio — ia mengungkap risiko yang tidak terlihat di VaR normal, karena VaR normal memakai korelasi sejarah yang tenang. Buruk bila dibaca sebagai prediksi: korelasi 0,95 untuk SEMUA pasangan secara permanen adalah skenario ekstrem, bukan kondisi yang diharapkan setiap hari — ia adalah uji ketahanan, bukan ramalan.",
        "Mitigasi: jalankan stress korelasi berdampingan dengan VaR biasa, dan laporkan keduanya — «VaR95 normal 0,0324, VaR95 stress-korelasi 0,0431». Bila selisihnya besar, portofoliomu bergantung pada diversifikasi yang rapuh — pertimbangkan mengurangi konsentrasi pada saham-saham yang korelasinya melonjak bersamaan di masa krisis (di sini: ketiganya saham IDX yang jatuh bersamaan pada 16 Oktober 2026).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar vol harian portofolio: korelasi normal 0,0197; korelasi 0,95 0,0262; korelasi 1,00 0,0267; rasio diversifikasi 1,3530 ke 1,0169">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Vol harian portofolio saat korelasi diguncang (vol aset tetap)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,01</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,03</text>
<rect x="110" y="90.4" width="70" height="115.6" fill="var(--c1)"/>
<text x="145" y="86.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0197</text>
<text x="145" y="120.0" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">DR 1,3530</text>
<rect x="240" y="52.3" width="70" height="153.7" fill="var(--c4)"/>
<text x="275" y="48.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0262</text>
<text x="275" y="80.0" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">DR 1,0169</text>
<rect x="370" y="49.4" width="70" height="156.6" fill="var(--c4)"/>
<text x="405" y="45.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0267</text>
<text x="405" y="80.0" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">DR 1,0000</text>
<text x="145" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Korelasi normal</text>
<text x="275" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Korelasi 0,95</text>
<text x="405" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Korelasi 1,00</text>
</svg>`,
        alt: "Bar vol harian portofolio: korelasi normal 0,0197; korelasi 0,95 0,0262; korelasi 1,00 0,0267; rasio diversifikasi 1,3530 ke 1,0169.",
        caption: "Cara membaca: tiap bar = vol harian portofolio (log return) bila semua korelasi antar pasangan dipaksa ke nilai itu; DR = diversification ratio (rata-rata vol tertimbang dibagi vol portofolio). Interpretasi: vol naik +33,0% pada korelasi 0,95 dan DR jatuh ke 1,0169 — diversifikasi hampir hilang, padahal tidak satu pun return yang diguncang.",
      },
      tasks: [],
      note: {
        title: "Peringatan jujur: stress korelasi ≠ stress return",
        type: "pitfall",
        body: "Yang benar: stress test korelasi mengguncang STRUKTUR (matriks korelasi), bukan LEVEL (return). Vol tiap saham dan mean return dibiarkan sama seperti sejarah. Jangan mencampur keduanya dalam satu angka — bila kamu mengguncang return DAN korelasi sekaligus, kamu tidak tahu mana yang menyebabkan kerugiannya. Satu guncangan, satu pertanyaan.",
      },
    },
    {
      id: "stress-return",
      eyebrow: "Langkah 11 · Stress return & gabungan",
      title: "Stress return & gabungan: guncang level, lalu campur dengan sadar",
      prose: [
        "Langkah sebelumnya mengguncang STRUKTUR (korelasi) dan sengaja membiarkan level return apa adanya. Sekarang giliran sebaliknya: guncang LEVEL — semua saham turun 10% dalam satu hari — dan lihat apa yang berubah, dan apa yang TIDAK berubah. Lalu, di skenario ketiga, campur keduanya — tapi dengan sadar, dan dengan label [ilustrasi] yang jujur: skenario-skenario ini bukan dari data, melainkan pertanyaan «bagaimana bila...» yang kamu ajukan sendiri.",
        "Semua angka di bawah memakai portofolio Rp100 juta dan VaR/ES parametrik normal (mean 0): VaR95 = 1,6449 × vol, VaR99 = 2,3263 × vol, ES95 = 2,0627 × vol. Normal [notebook]: vol 0,0197; VaR95 0,0324 (Rp3.240.000); VaR99 0,0458; ES95 0,0406; diversification ratio 1,3530.",
        "Skenario 1 — return shock −10% semua saham [ilustrasi]: P&L langsung −Rp10.000.000 (−10% × Rp100 juta). VaR95 tetap 0,0324, VaR99 tetap 0,0458, ES95 tetap 0,0406, DR tetap 1,3530 — TIDAK BERUBAH SAMA SEKALI. Mengapa? Karena shock return adalah kerugian TEREALISASI — satu hari yang sudah terjadi — bukan ukuran risiko. VaR/ES mengukur distribusi return yang MUNGKIN terjadi; satu guncangan titik tidak mengubah vol atau distribusi itu. Yang berubah adalah kekayaanmu (Rp100 juta → Rp90 juta), bukan ukuran risikonya. Bandingkan skalanya: −Rp10.000.000 setara 3,1× VaR95 harian (Rp3.240.000) dan ~23% dari maximum drawdown portofolio (−0,4363 × Rp100 juta = Rp43.630.000) — satu hari seperti ini saja sudah memakan hampir seperempat dari drawdown terdalam dua tahun.",
        "Skenario 2 — vol shock ×1,5 [ilustrasi]: vol 0,0197 → 0,0295; VaR95 0,0486 (Rp4.860.000); VaR99 0,0687; ES95 0,0610; DR tetap 1,3530 — karena korelasi tidak berubah, diversification ratio tidak berubah. Perhatikan: VaR95 naik +50% (0,0324 → 0,0486), persis sebanding dengan kenaikan vol — VaR parametrik berbanding lurus dengan vol. Catatan pembulatan: 0,0197 × 1,5 = 0,02955 — skrip membulatkan ke 0,0295 pada 4 desimal (pembulatan floating-point Python), jadi angka yang dipakai di lesson ini adalah 0,0295; bila kamu menghitung dengan tangan dan mendapat 0,02955 atau 0,0296, itu soal pembulatan, bukan kesalahan.",
        "Skenario 3 — gabungan [ilustrasi] (korelasi 0,95 + vol ×1,5 + return −10%): vol 0,0393; VaR95 0,0646 (Rp6.460.000); VaR99 0,0914; ES95 0,0811; DR 1,0169; P&L langsung −Rp10.000.000. Vol gabungan 0,0393 = vol stress-korelasi 0,0262 × 1,5 — dua guncangan pada vol berlipat: korelasi yang melonjak menaikkan vol, lalu vol itu sendiri diguncang ×1,5. Dan di atas kerugian risiko itu (VaR95 Rp6.460.000), ada kerugian terealisasi −Rp10.000.000 yang datang dari shock return-nya — keduanya dijumlahkan dalam pengalaman investor, tapi TIDAK BOLEH dijumlahkan dalam satu angka VaR: VaR mengukur distribusi, shock mengukur satu realisasi.",
        "Tabel — empat kondisi, portofolio Rp100 juta:",
        "Normal [notebook] — vol 0,0197 · VaR95 0,0324 (Rp3.240.000) · VaR99 0,0458 · ES95 0,0406 · DR 1,3530 · P&L langsung —.",
        "Return −10% [ilustrasi] — vol 0,0197 · VaR95 0,0324 (Rp3.240.000) · VaR99 0,0458 · ES95 0,0406 · DR 1,3530 · P&L langsung −Rp10.000.000.",
        "Vol ×1,5 [ilustrasi] — vol 0,0295 · VaR95 0,0486 (Rp4.860.000) · VaR99 0,0687 · ES95 0,0610 · DR 1,3530 · P&L langsung —.",
        "Gabungan [ilustrasi] — vol 0,0393 · VaR95 0,0646 (Rp6.460.000) · VaR99 0,0914 · ES95 0,0811 · DR 1,0169 · P&L langsung −Rp10.000.000.",
        "Peringatan jujur — satu guncangan, satu pertanyaan: skenario gabungan menjawab «seberapa buruk bila semuanya memburuk bersamaan?» — dan HANYA itu. Ia tidak menjawab «berapa besar kontribusi korelasi?» (itu skenario korelasi saja), «berapa besar kontribusi vol?» (itu skenario vol saja), atau «berapa besar kontribusi return?» (itu skenario return saja). Bila kamu hanya menjalankan skenario gabungan, kamu tahu portofoliomu bisa kehilangan Rp10.000.000 dalam sehari dengan VaR95 Rp6.460.000 — tapi kamu tidak tahu guncangan mana yang paling berbahaya, dan karena itu tidak tahu apa yang harus diperbaiki. Jalankan ketiganya terpisah DULU, baru gabungkan — dan labeli tiap angka dengan skenarionya.",
        "Baik atau buruk: stress return bagus bila yang ditanya adalah «berapa besar kerugianku bila pasar jatuh sekian persen?» — ia menjawab dalam Rupiah yang langsung terasa. Buruk bila dibaca sebagai ukuran risiko: shock −10% yang tidak mengubah VaR sama sekali mengingatkan bahwa P&L terealisasi dan VaR adalah dua hal yang berbeda — yang satu sudah terjadi, yang satu mengukur kemungkinan. Dan skenario gabungan bagus sebagai uji ketahanan total, buruk sebagai alat diagnosis — ia mencampur tiga penyebab dalam satu angka.",
        "Mitigasi: laporkan selalu skenario terpisah berdampingan dengan gabungannya — empat baris tabel di atas, bukan satu. Bila direksi bertanya «skenario mana yang paling menakutkan?», jawab dengan membandingkan: return −10% memakan Rp10.000.000 SEKALIGUS (terealisasi), vol ×1,5 menaikkan VaR95 harian menjadi Rp4.860.000 (risiko yang lebih besar setiap hari), dan gabungan menaikkan VaR95 menjadi Rp6.460.000 sambil tetap memakan Rp10.000.000 — ketiganya menakutkan dengan cara yang berbeda.",
      ],
      formula: String.raw`\text{VaR}_{95} = 1{,}6449 \times \sigma, \quad \text{VaR}_{99} = 2{,}3263 \times \sigma, \quad \text{ES}_{95} = 2{,}0627 \times \sigma`,
      formulaNote: "VaR/ES parametrik normal (mean 0) pada portofolio Rp100 juta. Shock return −10% [ilustrasi] tidak mengubah σ — jadi tidak mengubah VaR/ES; shock vol ×1,5 menaikkan σ — jadi menaikkan VaR/ES secara proporsional.",
      tasks: [],
      note: {
        title: "Miskonsepsi: kerugian −Rp10.000.000 berarti VaR naik",
        type: "pitfall",
        body: "Yang benar: shock return −10% [ilustrasi] adalah kerugian terealisasi — uang yang sudah hilang — bukan ukuran risiko. VaR95 tetap 0,0324 karena vol dan distribusi return tidak berubah oleh satu guncangan titik. Jangan mencampur P&L terealisasi dengan VaR: yang satu menjawab «berapa yang hilang?», yang satu menjawab «berapa buruk yang MUNGKIN hilang besok?».",
      },
    },
    {
      id: "var-regime",
      eyebrow: "Langkah 12 · VaR per regime",
      title: "Regime-conditional VaR: ekor yang membedakan regime",
      prose: [
        "Inilah USP kedua lesson ini — dan kejutan yang paling penting. Bandingkan VaR historis antar regime [notebook]: VaR95 high-vol 0,0261 vs low-vol 0,0294 — nyaris SAMA, bahkan sedikit lebih kecil di high-vol. Tapi VaR99 high-vol 0,0761 vs low-vol 0,0456 — jauh BERBEDA, hampir 1,7 kali lipat. Risiko «biasa» (yang terjadi 1 dari 20 hari) tidak membedakan regime; risiko EKOR (yang terjadi 1 dari 100 hari) yang membedakannya.",
        "Nilai [notebook]: VaR99 statis dari M4.2 — VaR99 historis portofolio 0,0479 atas seluruh window — berada DI ANTARA kedua regime: ia meremehkan ekor tepat di regime high-vol (0,0479 vs 0,0761 yang sesungguhnya) dan melebih-lebihkan ekor di regime low-vol (0,0479 vs 0,0456). Manajer risiko yang memakai satu VaR statis akan merasa aman di saat yang paling berbahaya — dan terlalu berhati-hati di saat yang tenang. Dalam Rupiah pada Rp100 juta: kerugian 1-dari-100-hari di high-vol adalah Rp7.610.000, bukan Rp4.792.081 seperti kata VaR statis.",
        "Mengapa VaR95 bisa nyaris sama sementara VaR99 jauh berbeda? Karena distribusi return high-vol punya ekor yang lebih gemuk: hari-hari biasa di high-vol tidak jauh lebih buruk (mean harian malah positif +0,003215 vs −0,001863 di low-vol [notebook]), tapi hari-hari ekstremnya jauh lebih ekstrem. Inilah yang dimaksud «risiko ekor» — dan inilah alasan VaR95 saja tidak cukup: ia memotong distribusi di titik yang terlalu «ramah» untuk melihat ekornya.",
        "Baik atau buruk: regime-conditional VaR bagus bila yang ditanya adalah «berapa buruk hari yang sangat buruk, di kondisi saat ini?» — ia jujur tentang ekor. Buruk bila dipakai sebagai angka tunggal untuk semua kondisi: VaR high-vol dihitung dari hanya 105 hari — kuantil 1% dari 105 hari praktis ditentukan oleh 1 hari terburuk, jadi angkanya tidak stabil. Dan ingat: label regime-nya ex-post — di dunia nyata kamu tidak tahu dengan pasti regime apa hari ini sampai episode-nya berlalu.",
        "Mitigasi: laporkan VaR95 DAN VaR99, dan laporkan keduanya per regime — empat angka, bukan satu. Bila VaR99 high-vol jauh di atas VaR99 statis (di sini 0,0761 vs 0,0479), naikkan buffer modal atau turunkan eksposur selama episode high-vol — dan jangan menunggu «bukti» bahwa regime sudah berubah, karena bukti itu datang terlambat.",
      ],
      formula: String.raw`\text{VaR}_{99}^{high} = 0{,}0761 \gg \text{VaR}_{99}^{statis} = 0{,}0479 \gg \text{VaR}_{99}^{low} = 0{,}0456`,
      formulaNote: "VaR99 historis per regime vs VaR99 statis M4.2 (seluruh window). VaR95 nyaris sama antar regime (0,0261 vs 0,0294) — yang membedakan regime adalah ekor, bukan risiko biasa.",
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR95 yang sama berarti risikonya sama",
        type: "pitfall",
        body: "Yang benar: VaR95 high-vol (0,0261) dan low-vol (0,0294) nyaris sama — tapi VaR99-nya jauh berbeda (0,0761 vs 0,0456). Dua distribusi bisa sama di kuantil 5% dan sangat berbeda di kuantil 1%. Satu kuantil tidak pernah cukup untuk menggambarkan risiko; itulah alasan lesson ini memakai VaR95 DAN VaR99, dan M4.2 menambahkan Expected Shortfall.",
      },
    },
    {
      id: "scenario-matrix",
      eyebrow: "Langkah 13 · Matriks skenario",
      title: "Matriks skenario: satu tabel, empat dunia",
      prose: [
        "Lesson ini sudah memberi banyak angka — VaR statis, VaR per regime, VaR stress, ES, maxDD, diversification ratio — tersebar di langkah-langkah yang berbeda. Matriks ini mengumpulkannya dalam satu tabel supaya kamu bisa membandingkan dan memilih: baris adalah dunia (kondisi), kolom adalah ukuran. Baca per baris untuk memahami satu dunia; baca per kolom untuk melihat ukuran mana yang berubah paling dramatis antar dunia.",
        "Matriks — portofolio Rp100 juta (VaR/ES high-vol dan low-vol adalah historis [notebook]; VaR/ES normal dan stress-korelasi adalah parametrik normal):",
        "Normal [notebook] — VaR95 0,0324 · VaR99 0,0458 · ES95 0,0406 · ES99 — · maxDD −0,4363 · DR 1,3530 · Mitigasi: baseline harian — pakai VaR95/ES95 sebagai patokan, tapi jangan sendirian; cek ekor (VaR99/ES99) dan drawdown.",
        "High-vol (n=105) [notebook] — VaR95 0,0261 · VaR99 0,0761 · ES95 0,0609 · ES99 0,1139 · maxDD −0,4363 † · DR — · Mitigasi: naikkan buffer ke VaR99/ES99 high-vol (Rp7.610.000 / Rp11.390.000 per Rp100 juta); turunkan eksposur atau tambah buffer selama episode high-vol.",
        "Low-vol (n=375) [notebook] — VaR95 0,0294 · VaR99 0,0456 · ES95 0,0401 · ES99 0,0561 · maxDD −0,4363 † · DR — · Mitigasi: buffer statis memadai (VaR99 Rp4.560.000); waspada — tenang bukan berarti aman, ekor ES99 Rp5.610.000 tetap ada.",
        "Stress korelasi 0,95 — VaR95 0,0431 · VaR99 0,0610 · ES95 0,0540 · ES99 0,0698 · maxDD — · DR 1,0169 · Mitigasi: uji ketahanan struktur — kurangi konsentrasi pada saham-saham yang korelasinya melonjak bersamaan; diversifikasi antar kelas aset atau negara.",
        "Catatan atas sel-sel yang bertanda —. ES99 baris normal: tidak dihitung di skrip fill — sebagai pembanding, ES99 historis M4.2 atas seluruh window adalah 0,0775 [notebook]. † maxDD −0,4363 adalah drawdown portofolio sepanjang window (puncak 2025-11-05 → lembah 2026-10-19): drawdown terbentuk melintasi kedua regime dan tidak dipecah per regime di notebook, jadi angka yang sama ditulis di ketiga baris terealisasi untuk menandai satu sejarah drawdown yang sama — bukan tiga drawdown terpisah. DR baris high/low: tidak dihitung di skrip fill (DR memakai vol aset vs vol portofolio, bukan subset hari regime). Dan maxDD baris stress korelasi: «—» karena stress korelasi adalah skenario 1 hari — drawdown adalah jejak kekayaan selama berminggu-minggu, jadi stress 1 hari bukan drawdown.",
        "Apa yang dibaca dari matriks ini? Pertama, ranking ekor: ES99 high-vol 0,1139 adalah angka terbesar di seluruh tabel — hampir 2× ES99 low-vol (0,0561) dan di atas ES99 stress-korelasi (0,0698). Dunia yang paling berbahaya bukan dunia «korelasi 0,95» yang hipotetis, melainkan regime high-vol yang benar-benar terjadi. Kedua, VaR95 menipu: 0,0261 (high) vs 0,0294 (low) vs 0,0324 (normal) vs 0,0431 (stress) — bila hanya melihat VaR95, high-vol terlihat PALING aman. ES99 membalik ranking itu sepenuhnya. Ketiga, mitigasi berbeda per baris: tidak ada satu tindakan yang menjawab semua dunia — buffer untuk high-vol, kewaspadaan untuk low-vol, dan restrukturisasi untuk stress korelasi.",
        "Baik atau buruk: matriks skenario bagus bila yang ditanya adalah «dunia mana yang paling berbahaya, dan apa yang kulakukan di tiap dunia?» — ia memaksa perbandingan yang jujur. Buruk bila dibaca sebagai ramalan probabilitas: matriks ini tidak berkata seberapa besar PELUANG tiap dunia terjadi — high-vol terjadi 105 dari 480 hari (21,9%), stress korelasi 0,95 adalah skenario hipotetis tanpa peluang yang dinyatakan. Jangan mengalikan angka matriks dengan peluang yang tidak ada.",
        "Mitigasi: pakai matriks ini sebagai menu keputusan, bukan sebagai jawaban tunggal — pilih baris sesuai kondisi saat ini (regime real-time dari langkah 7 memberi tahu kondisi itu), baca VaR99/ES99 di baris tersebut, dan terapkan mitigasinya. Dan bila satu ukuran saja yang kamu laporkan ke direksi, laporkan ES99 — ia satu-satunya ukuran di tabel yang «melihat» ekor di semua dunia.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR95 tertinggi berarti dunia paling berbahaya",
        type: "pitfall",
        body: "Yang benar: VaR95 tertinggi ada di baris stress korelasi (0,0431), tapi ES99 tertinggi ada di baris high-vol (0,1139). VaR95 hanya mengukur satu titik distribusi; dunia yang paling berbahaya adalah dunia dengan EKOR terburuk — dan itu hanya terlihat di VaR99/ES99. Membandingkan dunia hanya dengan VaR95 akan menunjuk dunia yang salah.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 14 · Mini-case",
      title: "Mini-case: Rp100 juta, berapa buffer yang jujur?",
      prose: [
        "Kembali ke cerita pembuka. Kamu manajer risiko portofolio equal-weight BBCA/KLBF/UNVR senilai Rp100 juta pada 2026-11-11 — masih terendam −35,28% di bawah puncak [notebook]. Direksi bertanya: «berapa buffer yang kita butuhkan untuk satu hari yang sangat buruk?» Tiga angka dari lesson ini memberi tiga jawaban yang berbeda — dan ketiganya benar, untuk pertanyaan yang berbeda.",
        "Jawaban VaR statis (M4.2): VaR99 historis 0,0479 → Rp4.792.081. Jawaban regime-conditional: bila sedang high-vol, VaR99 0,0761 → Rp7.610.000; bila low-vol, 0,0456 → Rp4.560.000. Jawaban stress korelasi: VaR95 parametrik naik dari Rp3.240.000 menjadi Rp4.310.000 bila korelasi melonjak ke 0,95 — dan itu baru VaR95, bukan VaR99. Buffer yang jujur memakai angka yang paling konservatif untuk kondisi saat ini: di episode high-vol, Rp7.610.000 — bukan Rp4.792.081.",
        "Tabel keputusan — semua ukuran M4 dalam satu tempat (portofolio Rp100 juta; VaR/ES statis dan regime adalah historis [notebook]; VaR kondisional EWMA/GARCH dan stress korelasi adalah parametrik):",
        "Statis, historis (M4.2) — VaR95 0,0286 (Rp2.856.323) · VaR99 0,0479 (Rp4.792.081) · ES95 0,0445 (Rp4.451.285) · Pilihan buffer: angka dasar bila tidak ada informasi kondisi — buffer harian Rp4.792.081 (VaR99).",
        "Kondisional EWMA, 11 Nov 2026 (M4.3) — VaR95 0,0490 (Rp4.900.000) · VaR99 0,0694 (Rp6.940.000) · Pilihan buffer: Rp6.940.000 — EWMA bereaksi cepat pada vol terbaru, jadi buffernya paling besar di antara angka kondisional.",
        "Kondisional GARCH, 11 Nov 2026 (M4.3) — VaR95 0,0315 (Rp3.150.000) · VaR99 0,0446 (Rp4.460.000) · Pilihan buffer: Rp4.460.000 — GARCH lebih tenang daripada EWMA pada tanggal yang sama.",
        "Regime high-vol (M4.5) — VaR95 0,0261 (Rp2.610.000) · VaR99 0,0761 (Rp7.610.000) · Pilihan buffer: Rp7.610.000 — angka paling konservatif di seluruh tabel; pakai ini selama episode high-vol.",
        "Regime low-vol (M4.5) — VaR95 0,0294 (Rp2.940.000) · VaR99 0,0456 (Rp4.560.000) · Pilihan buffer: Rp4.560.000 — sedikit di bawah buffer statis; tenang bukan berarti tanpa ekor.",
        "Stress korelasi 0,95 (M4.5) — VaR95 0,0431 (Rp4.310.000) · Pilihan buffer: bukan buffer harian, melainkan uji ketahanan — «bila diversifikasi berhenti bekerja, VaR95 harianmu Rp4.310.000, bukan Rp3.240.000».",
        "Contoh kegagalan agregasi: manajer yang hanya memakai SATU angka — VaR99 statis Rp4.792.081 — dan merasa aman, padahal portofolio sedang berada di episode high-vol yang ekornya Rp7.610.000. Kekurangannya Rp2.817.919 — buffer itu kurang 37% dari yang dibutuhkan (2.817.919 / 7.610.000). Kegagalan ini bukan karena VaR statis «salah hitung» — ia benar sebagai rata-rata seluruh window — melainkan karena satu angka rata-rata dipakai untuk kondisi yang bukan rata-rata. Dan perhatikan: EWMA dan GARCH pun tidak sepakat pada 11 November 2026 (VaR95 0,0490 vs 0,0315) — model kondisional yang berbeda memberi jawaban yang berbeda; itulah alasan tabel ini menampilkan semuanya, bukan memilih satu «pemenang» secara diam-diam.",
        "Tapi buffer harian bukan seluruh cerita. Drawdown berkata: portofolio ini pernah jatuh −43,63% dari puncak dan belum pulih setelah 243 hari terendam [notebook]. Pada Rp100 juta di puncak, itu berarti nilai pernah menyentuh Rp56.370.000 — dan untuk kembali ke Rp100 juta dibutuhkan +77,40%. Buffer harian Rp7,61 juta tidak menjawab pertanyaan «berapa lama investor sanggup menunggu?» — itu pertanyaan drawdown, bukan VaR.",
        "Peta keputusan lesson ini: butuh ukuran penderitaan → drawdown (maxDD + durasi terendam + status pulih). Butuh ukuran hari buruk → VaR95 + VaR99, dan laporkan per regime bila datanya cukup. Butuh uji ketahanan struktur → stress korelasi (diversification ratio + VaR stress). Butuh alasan mengapa regime ada → vol clustering M4.3 (autokorelasi squared return lag 1 0,1043 [notebook]). Tidak ada satu angka yang menjawab semuanya — dan angka yang dipakai sendirian adalah angka yang menipu.",
        "Keputusan mini-case: laporkan ke direksi empat angka — maxDD −43,63% (belum pulih, terendam 243 hari), VaR99 high-vol Rp7.610.000 vs statis Rp4.792.081, VaR95 stress-korelasi Rp4.310.000, dan kebutuhan pulih +77,40% — beserta satu kalimat: «diversifikasi kita bekerja di hari tenang, dan berhenti bekerja tepat di hari kita paling membutuhkannya — 16 Oktober 2026.»",
      ],
      tasks: [],
      note: {
        title: "Tip: laporkan VaR95 dan VaR99 berdampingan, per regime",
        type: "risk",
        body: "Satu kuantil tidak pernah cukup: VaR95 antar regime nyaris sama (0,0261 vs 0,0294) sementara VaR99 jauh berbeda (0,0761 vs 0,0456). Laporkan selalu kedua kuantil — dan bila memungkinkan, per regime. Tip kedua: laporkan drawdown berdampingan dengan VaR — VaR menjawab «seberapa buruk satu hari», drawdown menjawab «seberapa dalam dan berapa lama».",
      },
    },
    {
      id: "jembatan",
      eyebrow: "Langkah 15 · Jembatan ke M9",
      title: "Jembatan: dari M4 ke M9 — dan apa yang belum dijawab",
      prose: [
        "Lesson ini menutup M4 — tapi tiga alat yang kamu pakai di M4 sebenarnya adalah pintu masuk ke dua modul berikutnya. Peta koneksinya: walk-forward (M4.1) → validasi out-of-sample di M9: di M4.1 kamu melatih model pada masa lalu dan mengujinya pada 160 hari berikutnya; M9 memperdalam cara memvalidasi itu dengan benar — berapa lipatan, berapa lama window, dan kapan validasi itu sendiri menipu. Backtesting Kupiec/Christoffersen (M4.3) → backtesting diperdalam di M9: di M4.3 kamu menguji apakah pelanggaran VaR terjadi sesering yang dijanjikan dan apakah ia bergerombol; M9 menambah gerbang validasi lain dan bertanya seberapa besar kuasa uji itu dengan sampel sekecil 230 hari. Monte Carlo (M4.2) → simulasi diperdalam di M9: di M4.2 kamu mensimulasikan distribusi return untuk VaR/ES; M9 memakai simulasi untuk pertanyaan yang lebih besar — skenario multi-hari, jalur kekayaan, dan validasi strategi secara keseluruhan.",
        "Dan satu peta lagi — ke M5: optimasi portofolio formal (objective dan constraint: memaksimalkan return atau meminimalkan risiko dengan batas-batas) adalah materi M5, BUKAN M4. Yang M4 berikan sebagai bahan bakunya adalah marginal VaR dan component VaR (M4.4): berapa besar kontribusi tiap saham terhadap VaR portofolio, dan saham mana yang «paling mahal» dari sisi risiko.",
        "Tugas integratif — kerjakan di Colab setelah lesson ini, tanpa klaim hasil optimasi: (1) Dari M4.4, component VaR share: UNVR 0,4098, KLBF 0,3370, BBCA 0,2532 [notebook] — UNVR adalah kontributor risiko terbesar walau bobotnya sama (1/3). (2) Susun bobot baru yang MENGURANGI UNVR dan menambah BBCA — sebagai usulan, bukan sebagai hasil optimasi: tidak ada objective yang dimaksimalkan di sini, hanya intuisi «kurangi kontributor risiko terbesar». (3) Validasi out-of-sample: backtest VaR95/VaR99 bobot baru pada 230 hari OOS yang sama dengan M4.3, dengan Kupiec — apakah pelanggaran bobot baru lebih dekat ke yang dijanjikan (11,5 dan 2,3) daripada bobot equal-weight? (4) Stress korelasi: jalankan stress korelasi 0,95 pada bobot baru dan bandingkan DR serta VaR95 stress-nya dengan bobot lama (DR 1,0169, VaR95 0,0431) — apakah bobot baru benar-benar lebih tahan terhadap hilangnya diversifikasi? (5) Laporkan hasilnya dengan jujur: bila bobot baru TIDAK lebih baik, itu juga hasil — tugas ini menguji intuisi, bukan membuktikan intuisi itu benar.",
        "Yang belum dijawab — dan sengaja belum dijawab: apakah bobot baru itu OPTIMAL? Tidak ada jawaban di M4 — optimasi formal menunggu M5. Apakah validasi OOS itu cukup kuat dengan 230 hari? Tidak sepenuhnya — kuasa uji VaR99 dengan ekspektasi 2,3 pelanggaran sangat kecil, dan M9 akan mengajarimu mengukurnya. Apakah skenario stress itu cukup? Tidak — M9 akan mengajarimu membangun skenario dari simulasi, bukan dari satu angka korelasi. Lesson ini memberimu alat untuk bertanya dengan benar; modul berikutnya memberimu alat untuk menjawab dengan lebih kuat.",
        "Baik atau buruk: jembatan ini bagus bila yang ditanya adalah «ke mana selanjutnya?» — ia menempatkan M4 dalam peta yang lebih besar tanpa mengklaim M4 sudah menjawab semuanya. Buruk bila dibaca sebagai janji bahwa M9 akan menyelesaikan semua keraguan: validasi yang lebih dalam juga punya batasnya — dan M9 akan mengajarimu batas itu juga.",
        "Mitigasi: jangan memakai tugas integratif ini untuk mengklaim «aku sudah mengoptimasi portofolio» — kamu baru menguji satu usulan bobot. Tuliskan hasilnya sebagai «bobot usulan X vs equal-weight: Kupiec ..., stress DR ..., VaR95 stress ...» — angka, bukan vonis.",
      ],
      tasks: [],
      note: {
        title: "Peringatan jujur: tugas integratif bukan optimasi",
        type: "pitfall",
        body: "Yang benar: memilih bobot baru dari component VaR (M4.4) adalah intuisi yang diuji, bukan optimasi — tidak ada objective function dan tidak ada constraint yang diselesaikan. Hasil «optimal» baru boleh diklaim setelah M5 mengajarkan optimasi portofolio formal. Sampai saat itu, yang kamu punya adalah satu usulan bobot dan hasil pengujiannya — bukan bobot terbaik.",
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 16 · Guided task di Colab",
      title: "Guided task di Colab: drawdown, regime & stress di data nyata",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada data mainan. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m45-guided-task.ipynb.",
        "Di notebook itu kamu memuat BBCA.JK + KLBF.JK + UNVR.JK + ^GSPC (window 2024-11-01..2026-11-12, via yfinance, dengan fallback file lokal m4_prices.csv), mereplikasi drawdown semua aset (BBCA maxDD −0,4973, KLBF −0,5791, UNVR −0,4925, portofolio −0,4363, ^GSPC −0,1890), matematika pemulihan (+77,40% untuk portofolio), klasifikasi regime high-vol/low-vol (105 vs 375 hari, ambang persentil 75 = 0,3316), VaR per regime, dan correlation-breakdown stress test (vol 0,0197 → 0,0262, diversification ratio 1,3530 → 1,0169) — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1YWmATA1sg5eVGMQFNZEIhHy53mWfn-8b",
        "Jalur file notebook: colab/mlf-m45-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 17 · Checkpoint",
      title: "Checkpoint: penderitaan, regime, dan diversifikasi yang hilang",
      prose: [
        "Rangkuman: drawdown mengukur penderitaan — portofolio maxDD −0,4363 (puncak 2025-11-05 → lembah 2026-10-19), belum pulih, saat ini −0,3528, terendam 243 hari; KLBF terdalam −0,5791; hanya UNVR yang pulih dari maxDD-nya (2025-10-16) — meski kemudian jatuh lagi hingga −0,4051 dari puncak baru — dan ^GSPC (2025-06-27). Pulih butuh lebih dari yang hilang: −43,63% butuh +77,40%. Regime (vol rolling 60 hari, ambang persentil 75 = 0,3316): 105 hari high-vol vs 375 low-vol; VaR95 nyaris sama (0,0261 vs 0,0294) tapi VaR99 jauh berbeda (0,0761 vs 0,0456) — ekor yang membedakan regime. Stress korelasi: vol 0,0197 → 0,0262 (+33,0%), diversification ratio 1,3530 → 1,0169, VaR95 parametrik 0,0324 → 0,0431. Regime bukan ramalan — klasifikasi ex-post; vol clustering (autokorelasi squared return lag 1 0,1043) adalah alasan regime itu ada. Stress return & gabungan [ilustrasi]: shock return −10% → P&L langsung −Rp10.000.000, VaR/ES tidak berubah (0,0324); shock vol ×1,5 → VaR95 0,0486; gabungan (korelasi 0,95 + vol ×1,5 + return −10%) → VaR95 0,0646, DR 1,0169 — satu guncangan, satu pertanyaan. Regime real-time (tanpa look-ahead): ambang expanding p75, mulai setelah 60 nilai; 361 hari dinilai, kesepakatan 94,46% (341/361) dengan full-sample, 54 vs 70 hari high (under-detect 16 hari); vol esok hari setelah label HIGH 0,0192 vs LOW 0,0191 — label bukan ramalan; ambang real-time terakhir 0,3316 = ambang full-sample. Matriks skenario: ES99 high-vol 0,1139 vs low-vol 0,0561; stress korelasi 0,95 ES99 0,0698; buffer jujur memakai angka paling konservatif untuk kondisi saat ini. Jembatan ke M9: walk-forward, backtesting, dan Monte Carlo diperdalam di M9; tugas integratif memakai marginal/component VaR M4.4 — tanpa klaim optimasi sebelum M5.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Portofolio mengalami maximum drawdown −0,4363. Berapa return yang dibutuhkan untuk kembali ke puncak?",
          options: [
            { text: "+43,63% — sama besar dengan drawdown-nya", why: "Salah: +43,63% dari lembah 0,5637 hanya membawa kekayaan ke 0,8096 — masih di bawah puncak 1,0." },
            { text: "+77,40% — dihitung 1 / (1 − 0,4363) − 1", why: "Benar: dari lembah 0,5637 dibutuhkan 1 / 0,5637 − 1 = 0,7740 (+77,40%) untuk kembali ke puncak.", correct: true },
            { text: "+30,30% — setengah dari total return portofolio", why: "Total return portofolio −0,3030 tidak ada hubungannya dengan rumus pemulihan dari maxDD." },
            { text: "+100% — selalu dua kali lipat dari drawdown", why: "Tidak ada aturan «dua kali lipat»: +100% hanya benar untuk drawdown tepat −50% (1 / 0,5 − 1 = 1)." },
          ],
        },
        {
          q: "Dari lima aset, mana yang SUDAH pulih dari maximum drawdown-nya sampai 2026-11-11?",
          options: [
            { text: "BBCA — pulih pada 2026-06-08", why: "2026-06-08 adalah tanggal LEMBAH BBCA, bukan pemulihan — BBCA belum pulih, saat ini −0,4441." },
            { text: "KLBF — pulih pada 2026-10-19", why: "2026-10-19 adalah tanggal lembah KLBF — KLBF belum pulih, saat ini −0,5052, terendam 347 hari." },
            { text: "UNVR (pulih 2025-10-16) dan ^GSPC (pulih 2025-06-27)", why: "Benar: UNVR maxDD −0,4925 pulih 2025-10-16 dan ^GSPC maxDD −0,1890 pulih 2025-06-27; BBCA, KLBF, dan portofolio belum pulih. Catatan: «pulih» berarti kembali ke puncak maxDD-nya — setelah pulih, UNVR jatuh lagi hingga −0,4051 di bawah puncak baru pada 2026-11-11.", correct: true },
            { text: "Portofolio — pulih pada 2026-10-19", why: "2026-10-19 adalah tanggal lembah portofolio — portofolio belum pulih, saat ini −0,3528." },
          ],
        },
        {
          q: "VaR95 high-vol 0,0261 vs low-vol 0,0294 (nyaris sama), tapi VaR99 high-vol 0,0761 vs low-vol 0,0456 (jauh berbeda). Apa kesimpulan yang paling tepat?",
          options: [
            { text: "Risiko antar regime sebenarnya sama — VaR99 hanya noise dari 105 hari", why: "VaR99 dari 105 hari memang kurang stabil, tapi selisih 0,0761 vs 0,0456 terlalu besar untuk disebut noise — dan korelasi antar regime juga berbeda (0,3752 vs 0,2775)." },
            { text: "Risiko EKOR yang membedakan regime, bukan risiko biasa — VaR95 tidak cukup sendirian", why: "Benar: kuantil 5% nyaris sama antar regime, kuantil 1% jauh berbeda — hari-hari ekstrem high-vol jauh lebih ekstrem, walau hari-hari biasanya mirip.", correct: true },
            { text: "High-vol sebenarnya lebih aman karena VaR95-nya lebih kecil", why: "VaR95 high-vol memang sedikit lebih kecil (0,0261 vs 0,0294), tapi VaR99-nya jauh lebih besar — membaca satu kuantil saja menyesatkan." },
            { text: "VaR statis M4.2 (0,0479) sudah cukup untuk kedua regime", why: "VaR99 statis 0,0479 meremehkan ekor high-vol (0,0761) dan melebih-lebihkan ekor low-vol (0,0456) — satu angka tidak mewakili kedua regime." },
          ],
        },
        {
          q: "Dalam correlation-breakdown stress test, diversification ratio jatuh dari 1,3530 ke 1,0169 pada korelasi 0,95. Apa artinya?",
          options: [
            { text: "Vol tiap saham naik 35,5%", why: "Vol tiap saham TIDAK berubah dalam stress test ini — yang diubah hanya korelasinya; vol portofolio yang naik (+33,0%)." },
            { text: "Diversifikasi hampir hilang — vol portofolio hampir sama dengan rata-rata vol asetnya", why: "Benar: diversification ratio 1 berarti tidak ada manfaat diversifikasi sama sekali; 1,0169 berarti hampir tidak ada — vol portofolio 0,0262 hampir sama dengan rata-rata vol tertimbang asetnya.", correct: true },
            { text: "Portofolio menjadi lebih terdiversifikasi karena korelasi naik", why: "Terbalik: korelasi yang naik justru MENGHILANGKAN manfaat diversifikasi — aset-aset bergerak bersamaan." },
            { text: "VaR95 parametrik turun dari 0,0324 ke 0,0431", why: "VaR95 NAIK dari 0,0324 ke 0,0431 — bukan turun — karena vol portofolio naik." },
          ],
        },
        {
          q: "Bagaimana regime high-vol didefinisikan di lesson ini?",
          options: [
            { text: "Hari ketika return portofolio negatif", why: "Return negatif terjadi di kedua regime — mean harian high-vol malah positif (+0,003215)." },
            { text: "Hari ketika vol rolling 60 hari portofolio di atas persentil 75 (0,3316 tahunan)", why: "Benar: ambang persentil 75 dari vol rolling 60 hari (disetahunkan) = 0,3316; 105 hari di atas ambang itu = high-vol, 375 hari sisanya = low-vol (316 hari bervol di bawah ambang + 59 hari awal tanpa vol rolling, dihitung low karena tidak melewati ambang).", correct: true },
            { text: "Hari ketika korelasi antar saham di atas 0,95", why: "Korelasi 0,95 adalah skenario stress test, bukan definisi regime — korelasi rata-rata high-vol hanya 0,3752." },
            { text: "Bulan ketika ^GSPC jatuh lebih dari 10%", why: "^GSPC bukan penentu regime portofolio IDX — regime dihitung dari vol rolling portofolio itu sendiri." },
          ],
        },
        {
          q: "Apa kaitan vol clustering (M4.3) dengan regime di lesson ini?",
          options: [
            { text: "Tidak ada kaitan — regime dihitung dari harga, clustering dari return", why: "Keduanya dari return yang sama: vol clustering adalah sifat datanya, regime adalah cara memberi nama pada episode-episodenya." },
            { text: "Autokorelasi squared return lag 1 0,1043 berarti hari bergejolak cenderung diikuti hari bergejolak — volatilitas datang berkelompok, dalam episode yang disebut regime", why: "Benar: squared return yang berkorelasi positif antar hari berturut-turut berarti volatilitas bergerombol — episode high-vol dan low-vol adalah wujud gerombolan itu.", correct: true },
            { text: "Vol clustering membuktikan regime bisa diramal dengan akurat", why: "Clustering hanya berkata volatilitas bergerombol — bukan kapan gerombolan berikutnya mulai atau berakhir; label regime tetap ex-post." },
            { text: "GARCH menghilangkan regime sehingga VaR statis menjadi cukup", why: "Terbalik: GARCH justru memodelkan perubahan vol dari hari ke hari — ia mengakui regime, bukan menghilangkannya." },
          ],
        },
        {
          q: "Pada 16 Oktober 2026, BBCA jatuh dengan log return −0,1603, KLBF −0,1573, dan UNVR −0,1344 dalam satu hari. Apa pelajaran utamanya untuk diversifikasi?",
          options: [
            { text: "Diversifikasi gagal karena ketiga saham itu saham yang buruk", why: "Ketiga saham jatuh bersamaan bukan karena masing-masing «buruk» — melainkan karena guncangan pasar yang sama menghantam ketiganya sekaligus." },
            { text: "Pada hari krisis, korelasi melonjak dan diversifikasi berhenti bekerja tepat saat paling dibutuhkan", why: "Benar: korelasi rata-rata antar pasangan naik dari 0,2775 (low-vol) ke 0,3752 (high-vol), dan stress test menunjukkan vol naik +33,0% saat korelasi dipaksa ke 0,95 — diversifikasi rapuh di hari krisis.", correct: true },
            { text: "Portofolio equal-weight seharusnya diganti ke bobot berdasarkan kapitalisasi pasar", why: "Skema bobot tidak menyelesaikan masalah ini — saham apa pun dengan korelasi krisis yang tinggi akan jatuh bersamaan." },
            { text: "VaR95 harian 0,0324 sudah mencakup hari seperti ini", why: "Tidak: −0,1603 jauh melampaui VaR95 0,0324 — hari seperti ini berada di ekor yang bahkan VaR99 statis 0,0479 tidak menangkapnya." },
          ],
        },
        {
          q: "VaR99 statis M4.2 adalah 0,0479, sementara VaR99 high-vol 0,0761. Apa risiko memakai VaR statis sendirian?",
          options: [
            { text: "Tidak ada risiko — 0,0479 adalah rata-rata yang adil dari kedua regime", why: "Rata-rata yang «adil» tetap meremehkan risiko di kondisi yang paling berbahaya: di high-vol, kerugian 1-dari-100-hari yang sesungguhnya 0,0761, bukan 0,0479." },
            { text: "Di regime high-vol, VaR statis meremehkan ekor — buffer Rp4.792.081 per Rp100 juta tidak cukup saat kerugian 1-dari-100-hari mencapai Rp7.610.000", why: "Benar: VaR99 statis 0,0479 = Rp4.792.081 dari nilai tak-dibulatkan [M4.2], sementara 0,0761 × Rp100 juta = Rp7.610.000 — selisih Rp2.817.919 adalah kekurangan buffer tepat di kondisi paling berbahaya.", correct: true },
            { text: "VaR statis selalu melebih-lebihkan risiko sehingga modal terbuang", why: "Di low-vol VaR statis memang sedikit melebih-lebihkan (0,0479 vs 0,0456), tapi di high-vol ia MEREMEHKAN — masalahnya bukan satu arah." },
            { text: "VaR99 tidak bisa dibandingkan antar regime karena definisinya berbeda", why: "Definisinya sama — kuantil 1% return harian historis — hanya subset harinya yang berbeda (105 hari high-vol vs 375 low-vol — low-vol 375 = 316 bervol + 59 hari awal tanpa vol rolling)." },
          ],
        },
        {
          q: "Shock return −10% pada semua saham [ilustrasi] menyebabkan P&L langsung −Rp10.000.000, tapi VaR95 parametrik tetap 0,0324. Mengapa VaR tidak berubah?",
          options: [
            { text: "Karena shock −10% terlalu kecil untuk memengaruhi VaR", why: "Tidak: −Rp10.000.000 setara 3,1× VaR95 harian — shock ini BESAR, bukan kecil; alasannya bukan ukuran shock." },
            { text: "Karena shock adalah kerugian terealisasi, bukan ukuran risiko — VaR mengukur distribusi return, dan satu guncangan titik tidak mengubah vol/distribusi", why: "Benar: P&L −Rp10.000.000 adalah uang yang sudah hilang; VaR95 0,0324 mengukur distribusi return yang mungkin terjadi, yang tidak berubah karena vol tetap 0,0197.", correct: true },
            { text: "Karena VaR hanya berubah bila korelasi yang diguncang", why: "VaR berubah bila VOL berubah — shock vol ×1,5 menaikkan VaR95 menjadi 0,0486 tanpa menyentuh korelasi; korelasi bukan satu-satunya penggerak VaR." },
            { text: "Karena VaR95 dihitung dari data historis yang tidak mengandung hari −10%", why: "VaR95 parametrik di sini dihitung dari vol (1,6449 × vol), bukan dari kuantil historis; alasannya adalah perbedaan P&L terealisasi vs ukuran risiko, bukan isi data historis." },
          ],
        },
        {
          q: "Skenario gabungan [ilustrasi] (korelasi 0,95 + vol ×1,5 + return −10%) menghasilkan VaR95 0,0646 dan DR 1,0169. Apa yang harus diingat saat membaca angka gabungan ini?",
          options: [
            { text: "VaR gabungan adalah jumlah VaR tiap skenario: 0,0324 + 0,0486 + 0,0431", why: "Salah: 0,0324 + 0,0486 + 0,0431 = 0,1241, bukan 0,0646 — VaR tidak dijumlahkan begitu saja; gabungan dihitung dari vol gabungan 0,0393 (1,6449 × 0,0393 = 0,0646)." },
            { text: "Satu guncangan, satu pertanyaan — gabungan hanya menjawab «seberapa buruk bila semuanya memburuk bersamaan?», bukan kontribusi tiap guncangan", why: "Benar: untuk tahu kontribusi korelasi, vol, dan return masing-masing, jalankan ketiganya terpisah dulu; gabungan saja tidak bisa mendiagnosis mana yang paling berbahaya.", correct: true },
            { text: "DR gabungan 1,0169 membuktikan return −10% yang menyebabkan diversifikasi hilang", why: "Salah: DR jatuh ke 1,0169 karena KORELASI 0,95 — shock return tidak mengubah korelasi maupun DR (DR tetap 1,3530 pada skenario return saja)." },
            { text: "P&L langsung −Rp10.000.000 sudah termasuk dalam VaR95 Rp6.460.000", why: "Tidak: VaR95 Rp6.460.000 mengukur distribusi return; P&L −Rp10.000.000 adalah kerugian terealisasi dari shock return — keduanya dijumlahkan dalam pengalaman investor, tapi tidak dalam satu angka VaR." },
          ],
        },
        {
          q: "Label regime real-time sepakat 94,46% (341/361) dengan label full-sample, tapi vol terealisasi esok hari setelah label HIGH (0,0192) hampir identik dengan setelah label LOW (0,0191). Apa kesimpulan yang tepat?",
          options: [
            { text: "Label real-time gagal total — kesepakatan 94,46% tidak ada artinya", why: "Tidak: 94,46% berarti prosedur real-time berhasil meniru klasifikasi full-sample hampir selalu — kegagalannya bukan di kesepakatan, melainkan di harapan bahwa label meramal besok." },
            { text: "Label regime berguna untuk keputusan buffer/posisi SAAT INI (risiko kontemporer), bukan untuk meramal vol besok", why: "Benar: vol esok hari hampir sama (0,0192 vs 0,0191) setelah label HIGH maupun LOW — label berkata «hari ini sedang bergejolak», bukan «besok akan bergejolak».", correct: true },
            { text: "Under-detect 16 hari membuktikan ambang expanding salah dan harus diganti ambang full-sample", why: "Terbalik: 16 hari yang terlewat adalah HARGA dari tanpa-look-ahead — ambang full-sample justru tidak boleh dipakai untuk keputusan historis karena ia memakai informasi masa depan." },
            { text: "Karena lag 0 hari pada 16 Oktober 2026, label real-time melindungi dari kerugian hari itu", why: "Salah: label high-vol 16 Oktober terbentuk DARI data yang termasuk return 16 Oktober itu sendiri — kerugian hari itu sudah terjadi sebelum labelnya ada." },
          ],
        },
      ],
      summary: [
        "Drawdown mengukur penderitaan: portofolio maxDD −0,4363 (2025-11-05 → 2026-10-19), belum pulih, saat ini −0,3528, terendam 243 hari; KLBF terdalam −0,5791, BBCA −0,4973 (terendam 478 hari); hanya UNVR (pulih 2025-10-16, lalu jatuh lagi hingga −0,4051 dari puncak baru) dan ^GSPC (pulih 2025-06-27) yang sudah pulih dari maxDD-nya.",
        "Pulih butuh lebih dari yang hilang: −43,63% butuh +77,40% (1 / (1 − 0,4363) − 1); BBCA +98,93%, KLBF +137,59%, ^GSPC +23,30%.",
        "Regime (vol rolling 60 hari, ambang persentil 75 = 0,3316 tahunan): 105 hari high-vol vs 375 low-vol (low-vol 375 = 316 bervol + 59 hari awal tanpa vol rolling); korelasi rata-rata 0,3752 vs 0,2775.",
        "VaR95 nyaris sama antar regime (0,0261 high vs 0,0294 low) tapi VaR99 jauh berbeda (0,0761 vs 0,0456) — risiko EKOR yang membedakan regime; VaR99 statis M4.2 (0,0479) meremehkan ekor high-vol.",
        "Stress korelasi: vol harian 0,0197 → 0,0262 (+33,0%) pada korelasi 0,95 → 0,0267 (+35,5%) pada korelasi 1,0; diversification ratio 1,3530 → 1,0169; VaR95 parametrik 0,0324 → 0,0431 → 0,0438.",
        "Regime bukan ramalan — klasifikasi ex-post; vol clustering (autokorelasi squared return lag 1 0,1043) adalah alasan regime itu ada.",
        "Lab: drawdown dari nol — maxDD −0,3000 di hari ke-4, terendam terlama 5 hari, butuh pulih +42,86%; stress korelasi 2-aset — vol 0,0204 → 0,0247 (+21,24%), diversification ratio 1,2272 → 1,0122 → 1,0000.",
        "Aturan: laporkan VaR95 DAN VaR99, per regime bila datanya cukup; laporkan drawdown (maxDD + durasi + status pulih) berdampingan dengan VaR; stress test korelasi mengguncang STRUKTUR, bukan level.",
        "Stress return & gabungan [ilustrasi]: shock return −10% → P&L langsung −Rp10.000.000, VaR/ES tidak berubah (0,0324); shock vol ×1,5 → vol 0,0295, VaR95 0,0486; gabungan (korelasi 0,95 + vol ×1,5 + return −10%) → vol 0,0393, VaR95 0,0646, DR 1,0169 — satu guncangan, satu pertanyaan.",
        "Regime real-time (tanpa look-ahead): ambang expanding p75, mulai setelah 60 nilai; 361 hari dinilai, kesepakatan 94,46% (341/361) dengan full-sample, 54 vs 70 hari high (under-detect 16 hari); vol esok hari setelah label HIGH 0,0192 vs LOW 0,0191 — label bukan ramalan; ambang real-time terakhir 0,3316 = ambang full-sample.",
        "Matriks skenario: ES99 high-vol 0,1139 vs low-vol 0,0561; stress korelasi 0,95 ES99 0,0698; maxDD portofolio −0,4363; DR normal 1,3530 vs stress 1,0169.",
        "Tabel keputusan (M4.2 + M4.3 + M4.5): statis VaR99 0,0479; EWMA 11 Nov 2026 VaR99 0,0694; GARCH VaR99 0,0446; high-vol VaR99 0,0761; low-vol VaR99 0,0456; stress korelasi VaR95 0,0431 — buffer statis Rp4.792.081 kurang 37% (Rp2.817.919) dari ekor high-vol Rp7.610.000.",
        "Jembatan ke M9: walk-forward, backtesting, dan Monte Carlo diperdalam di M9; tugas integratif memakai marginal/component VaR M4.4 — tanpa klaim optimasi sebelum M5.",
      ],
      next: { label: "Lanjut: MLF-M5.1 — Gradient Descent", href: "/v2/learn/mlf-m51-gradient-descent-optimization" },
    },
  ],
};
