import type { V2Lesson } from "../lib/types";

export const mlfM53: V2Lesson = {
  slug: "mlf-m53-markowitz-efficient-frontier",
  track: "Machine Learning Finance",
  module: "Optimization & portfolio construction",
  title: "MLF-M5.3 — Markowitz Mean-Variance & Efficient Frontier",
  estMinutes: 75,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M5 adalah optimasi & konstruksi portofolio: dari gradient descent (M5.1) dan optimasi berkendala (M5.2), kini ke ide yang memulai semuanya — Markowitz 1952. Lesson ini menjawab pertanyaan paling dasar dalam manajemen portofolio: bila kamu hanya boleh memilih dari tiga saham — BBCA, KLBF, UNVR — kombinasi bobot mana yang «terbaik», dan apa arti «terbaik» itu?",
        "Tujuan lesson ini:",
        "• Menjelaskan trade-off Markowitz: return yang diharapkan melawan risiko (varians) — dan kenapa «return tertinggi» bukan jawaban tanpa menyebut risikonya.",
        "• Membaca input optimasi dari data pin: expected return (μ) dan matriks kovarians (Σ) tiga saham [notebook].",
        "• Menggambarkan efficient frontier dari 8 titik kanonis — dan membaca siapa yang berada di atas kurva, siapa di bawahnya.",
        "• Menjelaskan Global Minimum Variance (GMV): portofolio risiko minimum, bobot [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966.",
        "• Menjelaskan tangency / max-Sharpe dan Capital Market Line (rf 5%) — dan mengapa di data ini jawabannya adalah corner solution 100% UNVR.",
        "• Membaca dominasi: portofolio di bawah kurva selalu kalah dari satu titik di frontier.",
        "• Menghitung biaya transaksi dari turnover (L1) dan budget turnover — serta harganya dalam vol.",
        "• Menjalankan rebalancing sebagai proses: pemicu kalender vs ambang drift, dan biayanya.",
        "• Mengubah bobot menjadi perdagangan nyata: lot IDX, sisa kas, dan trade list.",
        "• Mengukur risiko downside (downside deviation, Sortino, ES-min) — dan kejujuran hasilnya di data ini.",
        "• Menguji sensitivitas jawaban terhadap rf, target return, vol, cap bobot, dan shrinkage.",
        "• Memahami two-fund separation: dua portofolio sudah cukup untuk membangun seluruh frontier.",
        "• Menyebut batasan Markowitz dengan jujur: estimasi yang berisik, asumsi normalitas, dan satu periode.",
        "• Menjalankan dua lab: frontier dengan SLSQP dari data pin, dan perbandingan EW vs GMV vs max-Sharpe.",
        "• Memahami jebakan terbesarnya: frontier in-sample bukan janji — jembatan ke M5.5.",
        "Isi lesson: cerita manajer dana dengan tiga saham → input μ dan Σ → efficient frontier → GMV → tangency & CML → membaca dominasi → biaya transaksi & budget turnover → rebalancing → dari bobot ke perdagangan → risiko downside → sensitivitas → two-fund separation & batasan → 2 lab → jebakan in-sample → guided task di Colab → checkpoint.",
        "Konvensi data — WAJIB dibaca dulu, karena angka lesson ini hanya benar di bawah konvensi ini [notebook]: SIMPLE return (bukan log), 480 hari perdagangan bersama 2024-11-04 s.d. 2026-11-11 (unduhan 2024-11-01 s.d. 2026-11-12, file pin data/m4_prices.csv), annualisasi ×252 untuk return dan √252 untuk volatilitas, risk-free rate rf = 0,05. Perhatian: M4.4 memakai LOG return untuk VaR — M5 memakai SIMPLE return untuk mean/variance; keduanya dilabeli di mana pun keduanya muncul. Semua angka kanonis lesson ini dihitung dari data pin itu; angka yang bukan dari data pin dilabeli [ilustrasi].",
        "Kejujuran soal data — baca ini sebelum mengagumi kurvanya: ini window pasar TURUN. Dua dari tiga saham punya return tahunan negatif (BBCA −0,2445, KLBF −0,2570); hanya UNVR yang positif (0,0796). Frontier di lesson ini sebagian besar berada di return negatif — tiga titik teratasnya (return 0,0025; 0,0410; 0,0796) berada di atas return 0; lima titik sisanya negatif. Itu bukan cacat lesson — itu FAKTA data. Frontier di sini menjawab «risiko minimum untuk tiap target return», bukan «return tinggi». Portofolio «terbaik» di window ini tetap merugi — hanya merugi dengan risiko sekecil mungkin.",
      ],
      tasks: [],
    },
    {
      id: "markowitz",
      eyebrow: "Langkah 2 · Markowitz 1952",
      title: "Markowitz 1952: return yang diharapkan melawan risiko",
      prose: [
        "Sebelum 1952, nasihat investasi yang dominan adalah: cari saham dengan return tertinggi, lalu beli sebanyak-banyaknya. Harry Markowitz — dalam paper «Portfolio Selection» (Journal of Finance, 1952) — menunjukkan bahwa nasihat itu salah secara logis: investor tidak hanya peduli return, ia peduli return DAN risiko. Dua portofolio dengan return yang sama tidak sama nilainya bila risikonya berbeda; dan dua saham yang masing-masing berisiko bisa digabung menjadi portofolio yang risikonya LEBIH KECIL dari masing-masing — bila keduanya tidak bergerak searah.",
        "Ide intinya hanya satu kalimat: diversifikasi bekerja karena return aset tidak berkorelasi sempurna. Bila BBCA jatuh saat UNVR naik (atau sebaliknya), kerugian yang satu menutupi sebagian kerugian yang lain — dan volatilitas portofolio gabungan menjadi lebih kecil daripada rata-rata volatilitas anggotanya. Itulah yang akan kamu lihat dalam angka di langkah 3: rata-rata volatilitas ketiga saham (yang akan menjadi vol EW bila korelasi = 1) adalah 0,4238, tapi volatilitas portofolio equal-weight hanya 0,3114 [notebook]. Selisih 0,1124 itu adalah hadiah diversifikasi — dan ia muncul semata-mata karena korelasinya di bawah 1.",
        "Nilai: Markowitz merumuskan masalahnya sebagai optimasi: untuk tiap target return, cari bobot dengan risiko (varians) TERKECIL. Kumpulan jawaban itu — satu titik untuk tiap target return — adalah efficient frontier (langkah 4). Tidak ada portofolio yang «terbaik» secara mutlak: yang ada hanya trade-off — mau return lebih tinggi, bayar dengan risiko lebih tinggi; mau risiko lebih rendah, terima return lebih rendah.",
        "Baik atau buruk: kerangka mean-variance bagus karena ia mengubah perdebatan «saham mana yang bagus» menjadi pertanyaan yang bisa dihitung: berapa μ, berapa Σ, dan berapa target return-mu. Buruk bila dibaca sebagai «rumus untuk menjadi kaya»: ia tidak menjanjikan return tinggi — di data ini, seperti akan kamu lihat, frontier-nya didominasi return negatif — dan ia hanya sebaik inputnya (langkah 14).",
        "Mitigasi: jangan pernah membaca satu titik frontier tanpa menyebut KEDUA angkanya — return DAN vol. «Portofolio A lebih baik dari B» tidak ada artinya sebelum kamu menyebut: lebih baik dalam return, dalam risiko, atau dalam rasio keduanya (Sharpe)?",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: diversifikasi berarti «beli banyak saham»",
        type: "pitfall",
        body: "Yang benar: diversifikasi berarti menggabung aset yang TIDAK BERGERAK SEARAH — korelasi di bawah 1. Tiga saham yang korelasinya 1,0 tidak memberi diversifikasi apa pun, berapa pun jumlahnya. Di data ini korelasinya 0,2774–0,3488 [notebook] — jauh di bawah 1 — sehingga diversifikasi nyata bekerja: vol equal-weight 0,3114 jauh di bawah rata-rata vol anggotanya 0,4238.",
      },
    },
    {
      id: "input",
      eyebrow: "Langkah 3 · Input: μ dan Σ",
      title: "Input optimasi: expected return dan kovarians dari data pin",
      prose: [
        "Optimasi Markowitz hanya butuh DUA input: vektor expected return μ (berapa return yang diharapkan tiap aset) dan matriks kovarians Σ (berapa risiko tiap aset, dan seberapa searah mereka bergerak). Di lesson ini keduanya BUKAN asumsi — keduanya dihitung dari data pin: rata-rata return harian SIMPLE ×252, dan kovarians harian ×252 [notebook].",
        "Nilai — per-aset, tahunan [notebook]: BBCA return −0,2445, vol 0,3449, Sharpe −0,8540; KLBF return −0,2570, vol 0,4251, Sharpe −0,7221; UNVR return 0,0796, vol 0,5014, Sharpe 0,0590. Sharpe dihitung terhadap rf = 0,05: (return − 0,05) / vol. Perhatikan: BBCA punya vol TERKECIL (0,3449) tapi Sharpe TERBURUK (−0,8540) — karena return-nya yang paling negatif relatif terhadap risikonya. Vol kecil tidak otomatis berarti «bagus»; Sharpe-lah yang membandingkan return terhadap risiko.",
        "Nilai — korelasi [notebook]: BBCA–KLBF 0,3488; BBCA–UNVR 0,2774; KLBF–UNVR 0,2897. Ketiganya positif tapi jauh dari 1 — saham-saham ini cenderung bergerak searah (pasar yang sama), tapi tidak selalu bersamaan. Korelasi positif yang moderat inilah yang membuat diversifikasi bekerja sebagian: vol portofolio turun, tapi tidak sampai nol.",
        "Nilai — matriks kovarians tahunan Σ [notebook] (dipakai di kedua lab, dibulatkan 6 desimal): baris BBCA [0,118956; 0,051145; 0,047974]; baris KLBF [0,051145; 0,180734; 0,061751]; baris UNVR [0,047974; 0,061751; 0,251375]. Diagonalnya adalah varians (vol²): BBCA 0,3449² = 0,118956; KLBF 0,4251² = 0,180734; UNVR 0,5014² = 0,251375 (diagonal = vol presisi penuh dikuadratkan; vol yang ditampilkan sudah dibulatkan ke 4 desimal). Elemen di luar diagonal adalah kovarians antar aset — semuanya positif, sejalan dengan korelasi positif di atas.",
        "Rumus portofolio: return portofolio adalah rata-rata bobot dari μ; varians portofolio adalah w'Σw — yang memuat SEMUA pasangan kovarians, bukan hanya varians tiap aset. Itulah mengapa korelasi menentukan segalanya: naikkan korelasi, naikkan varians portofolio, tanpa mengubah return sama sekali.",
        "Baik atau buruk: memakai μ dan Σ dari data historis bagus karena ia konkret dan bisa direplikasi — siapa pun yang menjalankan notebook yang sama mendapat angka yang sama. Buruk bila μ historis dibaca sebagai «return yang AKAN datang»: rata-rata return 480 hari terakhir adalah ESTIMASI yang berisik — dan di window yang jatuh, estimasi itu negatif untuk dua dari tiga saham. Optimasi yang memakan μ berisik akan menghasilkan bobot yang «optimal» untuk masa lalu (langkah 16).",
        "Mitigasi: laporkan SELALU window dan konvensi di samping μ dan Σ — «return tahunan BBCA −0,2445» tanpa «simple return, 480 hari, 2024-11-04 s.d. 2026-11-11» adalah angka tanpa alamat. Dan ingat bedanya dengan M4.4: di sana VaR dihitung dari LOG return; di sini mean/variance dari SIMPLE return — jangan campur keduanya.",
      ],
      formula: String.raw`R_p = w'\mu \qquad \sigma_p = \sqrt{w'\Sigma w} \qquad S_p = \frac{R_p - r_f}{\sigma_p}`,
      formulaNote: "Return portofolio [notebook]: rata-rata bobot μ. Volatilitas: akar dari w'Σw — memuat semua kovarians pasangan. Sharpe: excess return atas rf = 0,05 dibagi vol.",
      tasks: [],
    },
    {
      id: "frontier",
      eyebrow: "Langkah 4 · Efficient frontier",
      title: "Efficient frontier: satu titik untuk tiap target return",
      prose: [
        "Efficient frontier adalah jawaban Markowitz dalam bentuk gambar. Untuk TIAP target return, selesaikan: minimalkan varians w'Σw, dengan syarat bobot berjumlah 1, bobot ≥ 0 (long-only, tanpa short), dan w'μ = target. Tiap target memberi satu titik (vol minimum, target return) — dan kurva yang menghubungkan semua titik itu adalah frontier. Di bawah kurva tidak ada portofolio yang lebih baik; di atas kurva tidak ada portofolio sama sekali.",
        "Nilai — 8 titik frontier [notebook], dari ujung bawah (GMV) ke ujung atas (100% UNVR): (return −0,1903, vol 0,2966, w [0,5522; 0,2701; 0,1778]); (−0,1517, 0,3021, w [0,4890; 0,2164; 0,2946]); (−0,1132, 0,3179, w [0,4258; 0,1627; 0,4115]); (−0,0746, 0,3428, w [0,3624; 0,1092; 0,5284]); (−0,0361, 0,3749, w [0,2985; 0,0562; 0,6453]); (0,0025, 0,4125, w [0,2352; 0,0026; 0,7622]); (0,0410, 0,4548, w [0,1189; 0,0000; 0,8811]); (0,0796, 0,5014, w [0,0000; 0,0000; 1,0000]). Baca polanya: makin tinggi target return, makin besar bobot UNVR — satu-satunya aset dengan return positif — dan makin kecil bobot BBCA dan KLBF. Pada target 0,0410, bobot KLBF sudah nol; pada target tertinggi, hanya UNVR yang tersisa.",
        "Gambar di bawah adalah frontier itu: sumbu-x volatilitas, sumbu-y return tahunan. Dua titik aset tunggal (BBCA, KLBF) duduk JAUH di bawah kurva — keduanya didominasi. Equal-weight (return −0,1406, vol 0,3114) duduk sedikit di bawah kurva. Garis putus-putus adalah Capital Market Line dari rf = 0,05 ke titik tangency (langkah 6). Dan perhatikan garis horizontal return 0: tiga titik teratas frontier (return 0,0025; 0,0410; 0,0796) berada di atasnya.",
        "Baik atau buruk: frontier bagus karena ia MEMISAHKAN dua pertanyaan yang sering dicampur: «portofolio mana yang efisien?» (di atas kurva) vs «target return mana yang kamu mau?» (di mana pada kurva). Buruk bila dibaca sebagai «janji»: kurva ini dihitung dari μ dan Σ MASA LALU — ia berkata «inilah yang PALING EFISIEN SEANDAINYA masa depan sama seperti masa lalu», bukan «inilah return yang akan kamu dapat» (langkah 16).",
        "Mitigasi: bila seseorang menunjukkan frontier yang seluruhnya di return positif dan mulus, tanyakan dulu window dan konvensinya. Di data ini frontier-nya jujur: sebagian besar di return negatif — karena datanya memang window pasar turun. Frontier yang «terlalu bagus» biasanya berarti inputnya yang terlalu optimistis, bukan portofolionya yang terlalu bagus.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Efficient frontier: 8 titik dari GMV (return -0,1903, vol 0,2966) ke 100 persen UNVR (return 0,0796, vol 0,5014); equal-weight di bawah kurva">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Efficient frontier — 8 titik [notebook], rf = 0,05</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,30</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,10</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<text x="86.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<text x="431.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<text x="259" y="236" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">volatilitas tahunan</text>
<line x1="52" y1="52.0" x2="466" y2="52.0" stroke="var(--c2)" stroke-width="1" stroke-dasharray="3 4"/>
<text x="462" y="48.0" text-anchor="end" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">rf 0,05</text>
<line x1="52" y1="44.7" x2="433.9" y2="39.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="240" y="36.0" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">CML (kemiringan 0,0590)</text>
<polyline points="80.6,157.7 90.1,140.7 117.4,123.8 160.3,106.8 215.7,89.9 280.6,72.9 353.5,56.0 433.9,39.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="80.6" cy="157.7" r="4" fill="var(--c1)"/>
<circle cx="90.1" cy="140.7" r="3.5" fill="var(--c1)"/>
<circle cx="117.4" cy="123.8" r="3.5" fill="var(--c1)"/>
<circle cx="160.3" cy="106.8" r="3.5" fill="var(--c1)"/>
<circle cx="215.7" cy="89.9" r="3.5" fill="var(--c1)"/>
<circle cx="280.6" cy="72.9" r="3.5" fill="var(--c1)"/>
<circle cx="353.5" cy="56.0" r="3.5" fill="var(--c1)"/>
<circle cx="433.9" cy="39.0" r="4" fill="var(--c1)"/>
<text x="80.6" y="176.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GMV</text>
<text x="433.9" y="28.0" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">max-Sharpe = 100% UNVR</text>
<circle cx="106.2" cy="135.9" r="4" fill="var(--c2)"/>
<text x="106.2" y="126.0" text-anchor="middle" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">EW</text>
<circle cx="164.0" cy="181.6" r="4" fill="var(--c4)"/>
<text x="164.0" y="196.0" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">BBCA</text>
<circle cx="302.3" cy="187.1" r="4" fill="var(--c4)"/>
<text x="302.3" y="201.0" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">KLBF</text>
</svg>`,
        alt: "Efficient frontier: 8 titik dari GMV (return -0,1903, vol 0,2966) ke 100 persen UNVR (return 0,0796, vol 0,5014); equal-weight di bawah kurva.",
        caption: "Cara membaca: sumbu-x = volatilitas tahunan, sumbu-y = return tahunan [notebook]. Kurva = frontier 8 titik; titik EW (return −0,1406, vol 0,3114) duduk di bawah kurva; BBCA dan KLBF jauh di bawah kurva. Garis putus-putus = CML dari rf 0,05 ke titik tangency. Interpretasi: tiga titik teratas frontier (return 0,0025; 0,0410; 0,0796) berada di atas return 0 — frontier ini menjawab «risiko minimum untuk tiap target return» di window pasar turun, bukan «return tinggi».",
      },
      tasks: [],
    },
    {
      id: "gmv",
      eyebrow: "Langkah 5 · Global Minimum Variance",
      title: "GMV: portofolio dengan risiko terkecil yang mungkin",
      prose: [
        "Ujung bawah frontier punya nama sendiri: Global Minimum Variance portfolio (GMV) — portofolio long-only dengan volatilitas TERKECIL dari semua kombinasi bobot yang mungkin. Ia tidak peduli return sama sekali: ia hanya bertanya «kombinasi apa yang paling tenang?». Jawabannya bergantung HANYA pada Σ (kovarians), bukan pada μ — dan itu membuatnya istimewa: μ adalah input yang paling berisik, sedangkan Σ lebih stabil, sehingga GMV lebih bisa diandalkan daripada portofolio yang bergantung pada μ.",
        "Nilai — GMV long-only [notebook]: bobot [0,5523; 0,2699; 0,1777] — BBCA 55,23%, KLBF 26,99%, UNVR 17,77%; return −0,1903, vol 0,2966, Sharpe −0,8100. Vol-nya 0,2966 adalah yang TERKECIL dari semua portofolio: lebih kecil dari vol aset tunggal terkecil (BBCA 0,3449) dengan selisih 0,0483 — diversifikasi membuat portofolio lebih tenang daripada anggotanya yang paling tenang sekalipun. Dan bobotnya masuk akal: BBCA mendapat bobot terbesar karena vol-nya terkecil dan korelasinya moderat; UNVR mendapat bobot terkecil meski return-nya tertinggi — karena vol-nya terbesar (0,5014).",
        "Perbandingan yang wajib diingat [notebook]: GMV long-only SAMA PERSIS dengan GMV tak-terkendala (closed-form M5.2: [0,5518; 0,2698; 0,1785], selisih maks 0,0008) — ketiga bobot positif, jadi kendala «tanpa short» TIDAK MENGIKAT di sini. GMV juga sama dengan titik pertama frontier — frontier DIMULAI dari GMV; tidak ada titik frontier di bawahnya, karena tidak ada portofolio dengan vol lebih kecil.",
        "Tapi baca juga sisi gelapnya: return GMV adalah −0,1903 — PALING RENDAH di antara semua titik frontier (tentu saja: ia ujung bawah). Sharpe-nya −0,8100 — lebih buruk dari equal-weight (−0,6122) dan jauh dari max-Sharpe (0,0590). GMV meminimalkan risiko, bukan memaksimalkan Sharpe — dan di window ini, «risiko minimum» berarti «merugi paling tenang». Investor yang hanya mengejar vol minimum tanpa melihat return akan memegang portofolio yang rugi 19% setahun — dengan tenang.",
        "Baik atau buruk: GMV bagus sebagai JANGKAR — titik awal yang jujur («inilah risiko terkecil yang mungkin») dan sebagai portofolio yang paling tahan terhadap kesalahan estimasi μ (karena tidak memakai μ sama sekali). Buruk bila dijadikan TUJUAN tanpa melihat return: vol minimum bukan berarti «portofolio terbaik» — ia hanya berarti «portofolio paling tenang».",
        "Mitigasi: pakai GMV sebagai pembanding, bukan sebagai jawaban akhir. Setiap portofolio yang kamu usulkan harus menjawab: «vol-nya berapa di atas GMV (0,2966), dan return tambahan apa yang kamu dapat untuk vol ekstra itu?» — itulah tepatnya yang dijawab frontier.",
      ],
      formula: String.raw`w^*_{GMV} = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}'\Sigma^{-1}\mathbf{1}} = [0{,}5523;\; 0{,}2699;\; 0{,}1777]`,
      formulaNote: "GMV [notebook]: return −0,1903, vol 0,2966, Sharpe −0,8100. Hanya memakai Σ — tidak memakai μ. Sama dengan GMV tak-terkendala (closed-form [0,5518; 0,2698; 0,1785]) — kendala long-only tidak mengikat.",
      tasks: [],
      note: {
        title: "Miskonsepsi: portofolio risiko minimum adalah portofolio terbaik",
        type: "pitfall",
        body: "Yang benar: GMV meminimalkan vol (0,2966) tapi return-nya −0,1903 — terendah di frontier — dan Sharpe-nya −0,8100, lebih buruk dari equal-weight (−0,6122). «Paling tenang» bukan «paling baik»: GMV adalah jangkar dan pembanding, bukan tujuan. Yang «terbaik» bergantung pada target return-mu — dan di frontier ini, setiap kenaikan return dibayar dengan vol yang lebih tinggi.",
      },
    },
    {
      id: "tangency",
      eyebrow: "Langkah 6 · Tangency & CML",
      title: "Tangency / max-Sharpe: dan mengapa jawabannya 100% UNVR",
      prose: [
        "Bila GMV adalah ujung «paling tenang», titik tangency adalah ujung «paling efisien per unit risiko»: portofolio dengan Sharpe ratio TERTINGGI. Bila ada aset bebas risiko (rf = 0,05), garis lurus dari titik (vol 0, return rf) yang MENYINGGUNG frontier di satu titik disebut Capital Market Line (CML) — dan titik singgungnya adalah portofolio tangency. Setiap campuran aset bebas risiko + portofolio tangency duduk di CML, dan semuanya punya Sharpe yang SAMA dengan Sharpe tangency: itulah Sharpe maksimum yang bisa dicapai.",
        "Nilai — max-Sharpe long-only [notebook]: bobot [0; 0; 1] — 100% UNVR; return 0,0796, vol 0,5014, Sharpe 0,0590. Kemiringan CML = 0,0590. Dan ini adalah CORNER SOLUTION: optimumnya berada di SUDUT daerah yang diizinkan (bobot UNVR = 1, batas atas), bukan di interior. Mengapa? Karena hanya UNVR yang punya excess return POSITIF (0,0796 − 0,05 = +0,0296). BBCA dan KLBF punya excess return negatif (−0,2945 dan −0,3070) — menambahkan keduanya ke portofolio HANYA menurunkan Sharpe. Optimasi yang jujur membuang keduanya sampai nol.",
        "Bacaan yang jujur — dan yang paling penting di lesson ini: Sharpe maksimum 0,0590 itu SANGAT KECIL. Sebagai perbandingan, Sharpe 1,0 sudah dianggap bagus untuk strategi aktif; 0,0590 berarti tiap 1 unit risiko hanya «membeli» 0,059 unit excess return. CML-nya nyaris DATAR (lihat gambar langkah 4: garis putus-putus dari rf 0,05 ke titik tangency hampir horizontal). Di window ini, «portofolio optimal» Sharpe-nya nyaris nol — karena tidak ada aset yang memberi excess return berarti. Jangan pernah menyebut «max-Sharpe» seolah ia otomatis bagus: ia hanya «yang terbaik dari yang tersedia» — dan yang tersedia di sini buruk.",
        "Contoh CML [notebook]: campur 50% aset bebas risiko + 50% portofolio tangency (100% UNVR) → return 0,0648, vol 0,2507, Sharpe TETAP 0,0590. Setengah risiko, setengah excess return — rasio yang sama. Itulah two-fund separation dalam bentuk paling sederhana: sekali titik tangency ditemukan, semua investor (yang mau risiko berapa pun) tinggal memilih di mana pada CML ia duduk — dengan mengubah porsi aset bebas risikonya.",
        "Catatan penghubung ke M5.2: max-Sharpe TAK-TERKENDALA (shorting boleh, leverage tak terbatas) di data ini adalah ill-posed — SLSQP «berhenti» di bobot raksasa [−3154; −3786; 6941] dengan Sharpe 0,6697, yang bukan solusi apa-apa. Kendala long-only-lah yang membuat max-Sharpe di lesson ini punya jawaban yang waras: [0; 0; 1]. Kendala bukan sekadar «aturan praktis» — di sini kendala yang menyelamatkan masalah dari jawaban yang tidak bermakna.",
        "Baik atau buruk: tangency bagus karena ia memberi SATU portofolio berisiko yang «cukup» untuk semua investor — sisanya tinggal atur porsi tunai. Buruk bila corner solution dibaca sebagai «rekomendasi beli 100% UNVR»: itu adalah jawaban optimasi terhadap μ historis 480 hari — bukan nasihat investasi. Portofolio satu saham bukan diversifikasi, dan μ historis bukan janji (langkah 16).",
        "Mitigasi: bila max-Sharpe-mu adalah corner solution (satu bobot = 1, sisanya 0), laporkan itu dengan TERUS TERANG — dan tanyakan apakah corner itu datang dari sinyal yang kuat atau dari μ yang berisik. Di sini jawabannya jelas: corner ini datang dari fakta bahwa hanya satu dari tiga aset yang excess return-nya positif — fakta data, bukan sinyal yang dalam.",
      ],
      formula: String.raw`S^* = \max_w \frac{w'\mu - r_f}{\sqrt{w'\Sigma w}} = 0{,}0590 \qquad R_{CML} = r_f + S^* \cdot \sigma_p`,
      formulaNote: "Max-Sharpe long-only [notebook]: w = [0; 0; 1] (100% UNVR), return 0,0796, vol 0,5014, Sharpe 0,0590 — corner solution, karena hanya UNVR yang excess return-nya positif (+0,0296). CML: return = 0,05 + 0,0590 × vol.",
      tasks: [],
    },
    {
      id: "baca",
      eyebrow: "Langkah 7 · Membaca frontier",
      title: "Membaca frontier: dominasi, dan portofolio di bawah kurva",
      prose: [
        "Frontier bukan hiasan — ia adalah ALAT VONIS. Definisinya: portofolio A DIDOMINASI bila ada portofolio B dengan return LEBIH TINGGI dan vol LEBIH RENDAH (atau sama pada satu sisi dan lebih baik pada sisi lain). Setiap portofolio yang duduk DI BAWAH kurva didominasi oleh titik frontier tepat di atasnya: return yang sama dengan vol lebih kecil, atau vol yang sama dengan return lebih tinggi. Tidak ada alasan rasional memegang portofolio yang didominasi — kecuali alasan di luar mean-variance (misal likuiditas, atau larangan memegang aset tertentu).",
        "Nilai — perbandingan tiga portofolio [notebook]: equal-weight return −0,1406, vol 0,3114, Sharpe −0,6122; GMV return −0,1903, vol 0,2966, Sharpe −0,8100; max-Sharpe return 0,0796, vol 0,5014, Sharpe 0,0590. Gambar di bawah membandingkan ketiganya: batang return dan batang vol berdampingan. Perhatikan: GMV punya vol TERKECIL tapi return TERENDAH dan Sharpe TERBURUK; max-Sharpe punya return TERTINGGI tapi vol TERBESAR; equal-weight berada di tengah pada kedua sumbu — dan Sharpe-nya (−0,6122) berada di antara keduanya.",
        "Nilai — vonis atas equal-weight [notebook]: pada return yang SAMA (−0,1406), frontier memberi vol 0,3056 (bobot [0,4708; 0,2009; 0,3283]) — sedangkan equal-weight punya vol 0,3114. Equal-weight membayar vol EKSTRA 0,0058 untuk return yang sama: ia TIDAK EFISIEN, meski hanya sedikit. Selisihnya kecil — karena equal-weight sudah cukup terdiversifikasi — tapi arahnya jelas: di bawah kurva, selalu ada yang lebih baik.",
        "Nilai — vonis atas aset tunggal [notebook]: BBCA (return −0,2445, vol 0,3449) didominasi GMV (return −0,1903, vol 0,2966) — GMV return-nya LEBIH TINGGI DAN vol-nya LEBIH RENDAH. KLBF (return −0,2570, vol 0,4251) didominasi GMV juga — dan bahkan didominasi portofolio [0,5; 0,5; 0] (return −0,2508, vol 0,3170). Memegang satu saham saja di universe ini berarti menerima return lebih rendah DENGAN risiko lebih tinggi daripada portofolio yang terdiversifikasi. Itu adalah harga yang dibayar untuk tidak melakukan diversifikasi — dan di sini harganya terukur: BBCA vs GMV selisih return 0,0542 dan selisih vol 0,0483.",
        "Baik atau buruk: vonis dominasi bagus karena ia TIDAK BUTUH preferensi risiko: siapa pun yang peduli return dan risiko akan setuju bahwa portofolio yang didominasi harus ditinggalkan. Buruk bila diterapkan tanpa menyebut «dalam model mean-variance»: di dunia nyata, portofolio yang didominasi secara mean-variance bisa saja dipegang karena alasan lain — misal investor dilarang memegang UNVR (mandat syariah, misal [ilustrasi]), atau butuh likuiditas BBCA. Dominasi adalah vonis DALAM MODEL, bukan vonis mutlak.",
        "Mitigasi: bila portofolio-mu duduk di bawah frontier, jangan tanya «apakah ini masih oke?» — tanya «berapa vol ekstra yang kubayar, dan untuk apa?». Bila jawabannya «tidak untuk apa-apa», pindahlah ke titik frontier di atasnya.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Batang return dan vol: EW return -0,1406 vol 0,3114; GMV return -0,1903 vol 0,2966; max-Sharpe return 0,0796 vol 0,5014">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EW vs GMV vs max-Sharpe — return dan vol [notebook]</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="195.0" x2="52" y2="195.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="198.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="48" y1="173.0" x2="52" y2="173.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="176.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,10</text>
<line x1="48" y1="151.0" x2="52" y2="151.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="154.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="129.0" x2="52" y2="129.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="132.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="48" y1="107.0" x2="52" y2="107.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="110.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="48" y1="85.0" x2="52" y2="85.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="88.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="48" y1="63.0" x2="52" y2="63.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="66.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="41.0" x2="52" y2="41.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="44.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="52" y1="151.0" x2="466" y2="151.0" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="85" y="151.0" width="30" height="30.9" fill="var(--c1)"/>
<text x="100" y="190.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−0,1406</text>
<rect x="120" y="82.5" width="30" height="68.5" fill="var(--c2)"/>
<text x="135" y="78.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,3114</text>
<text x="117.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Equal-weight</text>
<rect x="205" y="151.0" width="30" height="41.9" fill="var(--c1)"/>
<text x="220" y="201.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">−0,1903</text>
<rect x="240" y="85.7" width="30" height="65.3" fill="var(--c2)"/>
<text x="255" y="81.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2966</text>
<text x="237.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV</text>
<rect x="325" y="133.5" width="30" height="17.5" fill="var(--c1)"/>
<text x="340" y="129.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0796</text>
<rect x="360" y="40.7" width="30" height="110.3" fill="var(--c2)"/>
<text x="375" y="36.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,5014</text>
<text x="357.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Max-Sharpe</text>
<rect x="400" y="30" width="12" height="12" fill="var(--c1)"/>
<text x="416" y="40" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">return</text>
<rect x="400" y="48" width="12" height="12" fill="var(--c2)"/>
<text x="416" y="58" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">vol</text>
</svg>`,
        alt: "Batang return dan vol: EW return -0,1406 vol 0,3114; GMV return -0,1903 vol 0,2966; max-Sharpe return 0,0796 vol 0,5014.",
        caption: "Cara membaca: tiap kelompok = satu portofolio [notebook]; batang gelap = return tahunan, batang terang = volatilitas tahunan. Interpretasi: GMV punya vol terkecil (0,2966) tapi return terendah (−0,1903); max-Sharpe punya return tertinggi (0,0796) tapi vol terbesar (0,5014); equal-weight di tengah pada keduanya — Sharpe-nya −0,6122, di antara GMV (−0,8100) dan max-Sharpe (0,0590).",
      },
      tasks: [],
    },
    {
      id: "biaya-transaksi",
      eyebrow: "Langkah 8 · Biaya transaksi",
      title: "Biaya transaksi: frontier yang kamu hitung belum membayar apa-apa",
      prose: [
        "Semua yang kamu hitung sejauh ini hidup di dunia tanpa gesekan: bobot berubah gratis, berapa pun besarnya. Langkah 13 akan menyebut itu sebagai batasan keempat Markowitz — tapi batasan itu bisa DIHITUNG, bukan hanya disebut. Setiap kali bobot berubah, seseorang harus membeli dan menjual saham — dan tiap perdagangan membayar spread, komisi, dan slippage.",
        "Nilai — model biaya [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp = 20bp sekali jalan per unit notional yang diperdagangkan. Turnover diukur dengan norma L1: L1 = jumlah seluruh perubahan bobot, dalam nilai absolut. Karena tiap rupiah yang dibeli harus dibiayai dari rupiah yang dijual, notional yang benar-benar diperdagangkan SEKALI JALAN adalah L1/2 — bukan L1. Rumusnya: biaya = (L1/2) × 20bp [ilustrasi]. Satu basis poin (bp) = 0,01%.",
        "Nilai — tabel turnover dari equal-weight [notebook]: EW→GMV L1 0,4380 → biaya 4,38bp (Rp43.796 per Rp100jt); EW→RP L1 0,1294 → 1,29bp (Rp12.943); EW→MS L1 1,3333 → 13,33bp (Rp133.333); GMV→RP L1 0,3085 → 3,09bp (Rp30.853). Dan dari satu GMV ke GMV berikutnya: GMV periode-1 → GMV window penuh L1 0,2783 → 2,78bp — bahkan «tetap memakai strategi yang sama» tetap membayar, karena estimasi yang baru menggeser bobotnya.",
        "Nilai — budget turnover (dari EW) [notebook]: bila perpindahan dari EW dibatasi L1 ≤ 0,05, GMV terbaik yang masih dijangkau adalah w [0,3583; 0,3333; 0,3083] dengan vol 0,3078 — 112bp DI ATAS GMV bebas (0,2966). Budget L1 ≤ 0,10 → w [0,3833; 0,3333; 0,2833], vol 0,3048 (+82bp). Budget L1 ≤ 0,20 → w [0,4333; 0,3333; 0,2334], vol 0,3003 (+37bp). Gambar di bawah menunjukkan kurvanya: tiap pelonggaran budget membeli vol yang lebih rendah — dan titik «bebas» (L1 0,4380, vol 0,2966) adalah ujungnya.",
        "Baik atau buruk: memasukkan biaya ke optimasi bagus karena ia mengubah jawaban ke arah yang bisa DIJALANKAN: portofolio yang «optimal» tapi butuh turnover 1,3333 (EW→MS) membayar 13,33bp setiap kali ia dibentuk — tiga kali lipat biaya EW→GMV. Buruk bila biaya dipakai sebagai alasan untuk tidak pernah bergerak: budget yang terlalu ketat (L1 ≤ 0,05) mengunci portofolio 112bp di atas vol minimum — kamu membayar dalam vol apa yang kamu hemat dalam biaya.",
        "Mitigasi: hitung turnover SEBELUM menyetujui perpindahan — L1 dan biayanya adalah bagian dari keputusan, bukan catatan kaki. Aturan praktis: bila biaya sekali jalan (dalam bp) sudah sebesar sebagian besar keunggulan Sharpe yang kamu kejar, jangan pindah. Dan bila kamu membatasi turnover, laporkan harganya dalam vol (seperti +82bp di atas) — supaya «hemat biaya» tidak terlihat gratis.",
      ],
      formula: String.raw`\text{Biaya} = \frac{L1}{2} \times 20\,\text{bp} \qquad L1 = \sum_i |w^{baru}_i - w^{lama}_i|`,
      formulaNote: "Model biaya [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp = 20bp sekali jalan per unit notional; notional sekali jalan = L1/2. EW→GMV: L1 0,4380 → 4,38bp (Rp43.796 per Rp100jt); EW→MS: L1 1,3333 → 13,33bp.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Budget turnover vs vol GMV: L1 0,05 vol 0,3078; L1 0,10 vol 0,3048; L1 0,20 vol 0,3003; bebas 0,4380 vol 0,2966">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Budget turnover vs vol GMV [notebook]</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,310</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,305</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,300</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,295</text>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="144.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<text x="236.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<text x="328.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<text x="420.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<text x="259" y="236" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">budget turnover L1 (dari EW)</text>
<line x1="52" y1="187.2" x2="466" y2="187.2" stroke="var(--c2)" stroke-width="1" stroke-dasharray="3 4"/>
<text x="56" y="183.2" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">GMV bebas 0,2966</text>
<polyline points="98.0,55.8 144.0,91.0 236.0,143.8 455.0,187.2" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="98.0" cy="55.8" r="4" fill="var(--c1)"/>
<circle cx="144.0" cy="91.0" r="4" fill="var(--c1)"/>
<circle cx="236.0" cy="143.8" r="4" fill="var(--c1)"/>
<circle cx="455.0" cy="187.2" r="4" fill="var(--c1)"/>
<text x="98.0" y="44.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,05 → 0,3078</text>
<text x="144.0" y="79.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,10 → 0,3048</text>
<text x="236.0" y="131.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,20 → 0,3003</text>
<text x="455.0" y="176.0" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">bebas 0,4380 → 0,2966</text>
</svg>`,
        alt: "Budget turnover vs vol GMV: L1 0,05 vol 0,3078; L1 0,10 vol 0,3048; L1 0,20 vol 0,3003; bebas 0,4380 vol 0,2966.",
        caption: "Cara membaca: sumbu-x = budget turnover L1 dari EW, sumbu-y = vol GMV terbaik dalam budget itu [notebook]; garis putus-putus = vol GMV bebas 0,2966. Interpretasi: budget L1 ≤ 0,05 memberi vol 0,3078 — 112bp di atas GMV bebas; melonggarkan ke 0,20 membeli vol 0,3003 (+37bp); titik «bebas» (L1 0,4380) adalah ujungnya. Budget turnover adalah kendala yang DIBAYAR dengan vol.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: biaya = L1 dikali tarif",
        type: "pitfall",
        body: "Yang benar: L1 menghitung beli DAN jual — tiap rupiah yang dibeli muncul sekali sebagai kenaikan bobot dan sekali sebagai penurunan bobot di aset lain. Notional yang diperdagangkan sekali jalan adalah L1/2, sehingga biaya = (L1/2) × 20bp [ilustrasi]. Memakai L1 penuh menggandakan biaya menjadi dua kali lipat dari yang benar.",
      },
    },
    {
      id: "rebalancing",
      eyebrow: "Langkah 9 · Rebalancing",
      title: "Rebalancing: dari satu optimasi ke proses yang berjalan terus",
      prose: [
        "Optimasi memberi SATU jawaban untuk SATU tanggal. Portofolio yang hidup tidak berhenti di situ: harga bergerak setiap hari, bobotmu ikut bergerak, dan cepat atau lambat bobot aktualmu bukan lagi bobot yang kamu optimasi. Siklusnya: estimasi → optimasi → eksekusi → monitor → rebalance — lalu kembali ke estimasi. Lesson ini baru mengajarkan tiga langkah pertama; langkah ini menutup lingkarannya.",
        "Nilai — seberapa jauh bobot melayang bila dibiarkan (buy-and-hold 240 hari, periode 2, target tetap) [notebook]: GMV [0,5523; 0,2699; 0,1777] → [0,5575; 0,2585; 0,1839] — L1 drift hanya 0,0228, drift aset terbesar 0,0114 (1,14pp). Risk parity: L1 0,0272. Equal-weight: L1 0,0286. Drift-nya KECIL untuk ketiganya — dan itu ada alasannya: ketiga saham jatuh BERSAMA (crash merata), sehingga bobot relatifnya hampir tidak berubah. Drift kecil saat aset bergerak searah; drift BESAR muncul saat satu aset bergerak berlawanan arah dengan yang lain — justru saat diversifikasi sedang bekerja.",
        "Nilai — simulasi 480 hari, target GMV tetap, biaya [ilustrasi] 20bp sekali jalan [notebook]: ambang drift 2pp → 39 rebalance, biaya total 18,76bp (~9,85bp/tahun); ambang 5pp → 5 rebalance, biaya total 5,59bp (~2,93bp/tahun); kalender bulanan → 22 rebalance, 9,66bp (~5,07bp/tahun); kalender kuartalan → 7 rebalance, 3,68bp (~1,93bp/tahun). Baca perbandingannya: ambang 5pp (5×, 2,93bp/tahun) dan kuartalan (7×, 1,93bp/tahun) berada di orde yang sama — ambang longgar ≈ kuartalan. Ambang 2pp (39×) memakan biaya tahunan 9,85bp — hampir DUA KALI bulanan (5,07bp) dan LIMA KALI kuartalan (1,93bp).",
        "Baik atau buruk: pemicu kalender bagus karena bisa dijadwalkan dan biayanya bisa diprediksi — buruk karena ia rebalance meski tidak ada yang berubah, dan diam saja saat pasar bergerak liar di tengah periode. Pemicu ambang bagus karena ia hanya bergerak saat perlu — buruk bila ambangnya terlalu ketat: ambang 2pp menangkap noise harian dan memicu 39 kali, sebagian besar untuk koreksi kecil yang besoknya berbalik lagi.",
        "Mitigasi: pilih ambang dari ukuran drift yang WAJAR di datamu — bukan dari angka bulat yang «terasa ketat». Di data ini drift aset terbesar selama 240 hari hanya 0,0114 (1,14pp), jadi ambang 2pp hanya sekitar 2× drift itu — gerakan harian yang berisik sering mendorong satu aset melewatinya; ambang 5pp (sekitar 4× drift itu) hanya terlampaui saat gerakan besar yang bertahan. Dan laporkan SELALU biaya rebalancing dalam bp/tahun di samping vol-nya: rebalancing yang «gratis» tidak ada.",
      ],
      formula: String.raw`L1_{drift} = \sum_i |w^{aktual}_i - w^{target}_i| \qquad \text{rebalance bila } \max_i |w^{aktual}_i - w^{target}_i| > \text{ambang}`,
      formulaNote: "Drift [notebook]: L1 drift GMV 240 hari 0,0228, drift aset terbesar 0,0114. Pemicu ambang memakai drift aset TERBESAR (max), bukan L1. Biaya simulasi 480 hari memakai model [ilustrasi] 20bp sekali jalan (langkah 8).",
      tasks: [],
      note: {
        title: "Miskonsepsi: rebalancing berarti «kembali ke bobot awal sesering mungkin»",
        type: "pitfall",
        body: "Yang benar: rebalancing berarti «kembali ke TARGET bila sudah cukup jauh» — «cukup jauh»-nya harus didefinisikan (ambang drift atau kalender). Tanpa ambang, tiap gerakan harian memicu perdagangan; dengan ambang 2pp di data ini, kamu berdagang 39 kali dalam 480 hari dan membayar 9,85bp/tahun — hampir dua kali lipat kalender bulanan. Ketat bukan berarti disiplin; ketat bisa berarti boros.",
      },
    },
    {
      id: "dari-bobot-ke-perdagangan",
      eyebrow: "Langkah 10 · Dari bobot ke perdagangan",
      title: "Dari bobot ke perdagangan: lot, sisa kas, dan trade list",
      prose: [
        "Bobot adalah jawaban matematika; perdagangan adalah jawaban yang dieksekusi. Di antara keduanya ada tiga jembatan yang tidak ada di rumus Markowitz: harga per lembar, lot, dan kas. Lesson ini memakai contoh [ilustrasi] Rp100.000.000 dengan harga penutupan 2026-11-11: BBCA Rp5.325, KLBF Rp770, UNVR Rp1.535; lot IDX 100 lembar, dibulatkan KE BAWAH — karena kamu tidak bisa membeli 10.371,4 lembar, dan tidak bisa membeli lebih dari uangmu.",
        "Nilai — GMV [ilustrasi]: BBCA target Rp55.231.188 → 10.300 lbr (Rp54.847.500); KLBF target Rp26.994.283 → 35.000 lbr (Rp26.950.000); UNVR target Rp17.774.529 → 11.500 lbr (Rp17.652.500); total terinvestasi Rp99.450.000, sisa kas Rp550.000 (0,55%). Tanpa lot (1 lembar): sisa kas hanya Rp1.445. Max-Sharpe: UNVR 65.100 lbr, sisa Rp71.500 (0,07%). Equal-weight: sisa Rp411.500 (0,41%).",
        "Nilai — trade list EW → GMV [ilustrasi]: BBCA BELI 4.100 lbr (Rp21.832.500); KLBF JUAL 8.200 lbr (Rp6.314.000); UNVR JUAL 10.200 lbr (Rp15.657.000). Perhatikan: trade list ini TIDAK BISA dihitung dari bobot saja — ia butuh holdings AWAL (EW: BBCA 6.200 lbr, KLBF 43.200 lbr, UNVR 21.700 lbr). Dan cek feasibility: total terinvestasi (Rp99.450.000) ≤ nilai portofolio (Rp100.000.000), sisa kas ≥ 0 — keduanya lolos di sini karena pembulatan ke bawah tidak pernah membeli melebihi target.",
        "Baik atau buruk: membulatkan ke bawah bagus karena ia MENJAMIN feasibility — kamu tidak pernah over-budget. Buruk bila sisa kasnya dibiarkan menganggur tanpa dicatat: 0,55% kas adalah 0,55% portofolio yang tidak mengikuti strategimu — dan pada portofolio kecil atau saham mahal, sisa kasnya bisa jauh lebih besar (satu lot BBCA saja Rp532.500).",
        "Mitigasi: laporkan SELALU tiga angka di samping bobot — jumlah lembar per aset, nilai terinvestasi, dan sisa kas. Bila sisa kas di atas 1%, pertimbangkan: tambah lot pada aset dengan sisa target terbesar, atau terima kasnya sebagai buffer biaya transaksi (langkah 8: EW→GMV saja sudah 4,38bp ≈ Rp43.796 [ilustrasi]).",
      ],
      formula: String.raw`n_i = \left\lfloor \frac{w_i \cdot V}{100 \cdot P_i} \right\rfloor \times 100 \qquad \text{kas} = V - \sum_i n_i P_i`,
      formulaNote: "Contoh [ilustrasi]: V = Rp100.000.000; harga penutupan 2026-11-11 BBCA Rp5.325, KLBF Rp770, UNVR Rp1.535; lot IDX 100 lembar, dibulatkan ke bawah. GMV: total terinvestasi Rp99.450.000, sisa kas Rp550.000 (0,55%).",
      tasks: [],
      note: {
        title: "Miskonsepsi: sisa kas besar berarti strateginya boros",
        type: "pitfall",
        body: "Yang benar: sisa kas Rp550.000 (0,55%) bukan biaya — ia adalah pembulatan ke bawah per lot, terbesar di saham termahal per lot (BBCA 100 lbr = Rp532.500). Tanpa lot, sisanya hanya Rp1.445. Bila kamu membulatkan ke ATAS, kamu justru membeli melebihi target — dan bisa melebihi uangmu. Sisa kas adalah harga keterbatasan lot, bukan kesalahan strategi.",
      },
    },
    {
      id: "risiko-downside",
      eyebrow: "Langkah 11 · Risiko downside",
      title: "Risiko downside: bila yang ditakuti bukan naik-turun, tapi jatuh",
      prose: [
        "Varians menghukum naik dan turun dengan sama: saham yang sering naik tajam terlihat «berisiko» seperti saham yang sering jatuh. Bila yang kamu takuti hanyalah JATUH — bukan naik-turun — ukuran yang tepat adalah downside deviation: volatilitas yang hanya menghitung return DI BAWAH target minimum (MAR). Di sini MAR = 0: hanya hari-hari negatif yang dihitung.",
        "Nilai — per-aset, MAR = 0, tahunan [notebook]: BBCA downside deviation 0,2506 (vol penuh 0,3449), KLBF 0,2914 (0,4251), UNVR 0,3242 (0,5014). Sortino (excess atas rf dibagi downside deviation): BBCA −1,1754, KLBF −1,0536, UNVR 0,0913. Perhatikan: downside deviation selalu LEBIH KECIL dari vol penuh — karena ia membuang sisi naik — tapi urutannya sama: UNVR tetap yang paling berisiko di kedua ukuran.",
        "Nilai — min-semivarians [notebook]: w [0,6031; 0,2262; 0,1707], return −0,1920, vol 0,2974, downside deviation 0,2343, Sortino −1,0331. Bandingkan dengan GMV: downside deviation 0,2345, Sortino −1,0244; dan EW: downside deviation 0,2427, Sortino −0,7856. Dan inilah kejujuran yang wajib ditulis: min-semivarians NYARIS SAMA dengan GMV — downside deviation 0,2343 vs 0,2345, selisih 0,0002. Di data ini downside bergerak seiring vol penuh — mengganti ukuran risiko tidak mengubah jawaban, karena yang diukur sebagian besar adalah hal yang sama. Downside optimization bukan sihir.",
        "Nilai — ES95-min [notebook]: optimasi Expected Shortfall 95% (LP, 480 skenario) memberi w [0,4868; 0,3710; 0,1423], return −0,2030, vol 0,2996, VaR95 harian 0,0280, ES95 harian 0,0429 — vs GMV VaR95 0,0267, ES95 0,0437. Lagi-lagi kejujuran yang sama: ES-min menukar SEDIKIT VaR (0,0267 → 0,0280, naik) dengan SEDIKIT ES (0,0437 → 0,0429, turun). Ia memperbaiki ekor yang ia optimasi — dan sedikit mengorbankan ukuran yang tidak ia optimasi. Tidak ada portofolio yang memperbaiki semuanya sekaligus.",
        "Baik atau buruk: ukuran downside bagus karena ia menjawab ketakutan yang sebenarnya («berapa dalam aku bisa jatuh?») — dan Sortino lebih jujur dari Sharpe bila return miring ke bawah. Buruk bila dipakai sebagai «pengganti varians yang lebih canggih» tanpa memeriksa: di data ini ia memberi jawaban yang nyaris sama dengan GMV — dan optimasi ES butuh LP atas 480 skenario, jauh lebih berat daripada rumus tertutup GMV.",
        "Mitigasi: laporkan downside deviation dan Sortino DI SAMPING vol dan Sharpe — bukan menggantikannya. Bila keduanya memberi jawaban yang sama (seperti di sini), itu informasi: risiko portofoliomu simetris, dan varians sudah cukup. Bila keduanya berbeda jauh, barulah downside optimization layak dipertimbangkan.",
      ],
      formula: String.raw`DD = \sqrt{E[\min(R - MAR, 0)^2]} \qquad S_{Sortino} = \frac{R_p - r_f}{DD}`,
      formulaNote: "MAR = 0 (hanya return negatif yang dihitung), tahunan [notebook]; Sortino memakai excess atas rf = 0,05 di pembilang. Min-semivarians: DD 0,2343 vs GMV 0,2345 — selisih 0,0002. ES95-min: ES95 harian 0,0429 vs GMV 0,0437.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Downside deviation: GMV 0,2345, min-semivarians 0,2343, EW 0,2427; Sortino GMV -1,0244, min-semivarians -1,0331, EW -0,7856">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Downside deviation (MAR = 0) dan Sortino [notebook]</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<rect x="90" y="68.4" width="60" height="137.6" fill="var(--c1)"/>
<text x="120" y="64.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2345</text>
<rect x="210" y="68.5" width="60" height="137.5" fill="var(--c2)"/>
<text x="240" y="64.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2343</text>
<rect x="330" y="63.6" width="60" height="142.4" fill="var(--c3)"/>
<text x="360" y="59.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2427</text>
<text x="120" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV</text>
<text x="120" y="234" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Sortino −1,0244</text>
<text x="240" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Min-semivarians</text>
<text x="240" y="234" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Sortino −1,0331</text>
<text x="360" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">EW</text>
<text x="360" y="234" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Sortino −0,7856</text>
</svg>`,
        alt: "Downside deviation: GMV 0,2345, min-semivarians 0,2343, EW 0,2427; Sortino GMV -1,0244, min-semivarians -1,0331, EW -0,7856.",
        caption: "Cara membaca: batang = downside deviation tahunan (MAR = 0) [notebook]; angka di bawah nama = Sortino (excess atas rf dibagi downside deviation). Interpretasi: min-semivarians (0,2343) NYARIS SAMA dengan GMV (0,2345) — selisih 0,0002; EW paling tinggi (0,2427) tapi Sortino-nya paling «baik» (−0,7856) karena return-nya lebih tinggi. Downside optimization bukan sihir di data ini.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: Sortino selalu lebih baik dari Sharpe",
        type: "pitfall",
        body: "Yang benar: Sortino dan Sharpe tidak bisa dibandingkan begitu saja — pembilangnya sama (excess atas rf), tapi penyebutnya beda (downside deviation vs vol penuh). Di data ini EW punya Sortino −0,7856 dan Sharpe −0,6122 — Sortino-nya LEBIH NEGATIF, karena downside deviation-nya (0,2427) hanya sedikit lebih kecil dari vol-nya (0,3114) sementara return-nya tetap negatif. «Lebih canggih» bukan «lebih tinggi».",
      },
    },
    {
      id: "sensitivitas",
      eyebrow: "Langkah 12 · Sensitivitas",
      title: "Sensitivitas: input mana yang paling menggerakkan jawaban?",
      prose: [
        "Sejauh ini setiap jawaban memakai SATU set input: rf 0,05, μ dan Σ dari window penuh, tanpa cap, tanpa shrinkage. Sensitivitas bertanya: bila SATU input berubah — dan hanya satu — seberapa jauh jawabannya bergerak? Bukan «angka berubah» (semua angka berubah bila input berubah), melainkan «input MANA yang paling menggerakkan jawaban». Itulah yang menentukan ke mana usahamu berikutnya harus pergi: memperbaiki estimasi yang paling berpengaruh, bukan yang paling mudah.",
        "Nilai — rf [notebook]: rf 0,03 → MS long-only tetap [0; 0; 1], return 0,0796, vol 0,5014, Sharpe 0,0989; rf 0,05 → Sharpe 0,0590; rf 0,07 → Sharpe 0,0192. Bobotnya TIDAK BERGERAK SAMA SEKALI — karena hanya UNVR yang excess return-nya positif pada semua rf itu, dan corner solution tidak peduli seberapa positifnya.",
        "Nilai — target return [notebook]: target −0,10 → w [0,4042; 0,1443; 0,4514], vol 0,3255; target 0,00 → w [0,2393; 0,0061; 0,7546], vol 0,4099. Menaikkan target 0,10 menggeser hampir separuh bobot ke UNVR dan menaikkan vol 0,0844 — target adalah input yang PALING menggerakkan frontier.",
        "Nilai — vol [notebook]: vol UNVR ×1,2 → GMV [0,6004; 0,3016; 0,0981] (UNVR dibuang hampir separuh); vol KLBF ×1,2 → GMV [0,6332; 0,1556; 0,2112] (KLBF yang dibuang). Tapi SEMUA vol ×1,1 → GMV TETAP [0,5523; 0,2699; 0,1777] — skala seragam mengalikan Σ dengan 1,21, dan GMV (yang hanya bergantung pada ARAH Σ⁻¹1 setelah normalisasi) tidak bergerak. Yang penting bukan besar vol-nya, melainkan RASIO antar vol.",
        "Nilai — cap dan shrinkage [notebook]: cap w_UNVR ≤ 0,50 pada max-Sharpe → w [0; 0,5; 0,5], return −0,0887, vol 0,3727, Sharpe −0,3721 — dari Sharpe +0,0590 menjadi −0,3721: SATU kendala mengubah jawaban lebih dari semua perubahan rf di atas. Shrinkage δ 0 → GMV [0,5523; 0,2699; 0,1777]; δ 0,0955 → [0,5185; 0,2852; 0,1963] (= GMV Ledoit-Wolf kanonis, M5.5); δ 0,3 → [0,4597; 0,3080; 0,2323]; δ 0,5 → [0,4147; 0,3213; 0,2640] — makin besar δ, makin dekat ke equal-weight.",
        "Baik atau buruk: analisis sensitivitas bagus karena ia mengubah «jawabannya rapuh» dari firasat menjadi tabel — kamu tahu persis input mana yang harus diestimasi dengan hati-hati (di sini: cap UNVR dan vol relatif), dan mana yang boleh kasar (rf, skala vol seragam). Buruk bila dilakukan dua input sekaligus: bila rf DAN target berubah bersamaan, kamu tidak tahu mana yang menggerakkan apa — satu input pada satu waktu, selalu.",
        "Mitigasi: sebelum mempercayai satu portofolio «optimal», jalankan tabel ini: ubah rf ±0,02, target ±0,10, tiap vol ×1,2, tambah cap yang relevan, dan shrinkage 0 → 0,5. Bila jawabannya stabil di semua skenario, ia layak dipercaya; bila satu cap membalik Sharpe dari +0,0590 ke −0,3721, laporkan kerapuhan itu di samping jawabannya — bukan di catatan kaki.",
      ],
      formula: String.raw`w^*_{GMV}(c\Sigma) = \frac{(c\Sigma)^{-1}\mathbf{1}}{\mathbf{1}'(c\Sigma)^{-1}\mathbf{1}} = w^*_{GMV}(\Sigma)`,
      formulaNote: "Skala seragam c = 1,21 (semua vol ×1,1) tercoret di pembilang dan penyebut — GMV hanya bergantung pada rasio, bukan skala Σ [notebook]. Bandingkan: vol UNVR ×1,2 SENDIRIAN menggeser GMV ke [0,6004; 0,3016; 0,0981].",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bobot BBCA GMV per skenario: dasar 0,5523; vol UNVR x1,2 0,6004; vol KLBF x1,2 0,6332; delta 0,3 0,4597; delta 0,5 0,4147">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Bobot BBCA (GMV) di bawah tiap skenario [notebook]</text>
<line x1="120" y1="210" x2="466" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="388.3" y1="40" x2="388.3" y2="205" stroke="var(--c4)" stroke-width="1" stroke-dasharray="3 4"/>
<text x="388.3" y="36" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">GMV dasar 0,5523</text>
<rect x="120" y="45" width="268.3" height="20" fill="var(--c1)"/>
<text x="115" y="59" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV dasar</text>
<text x="394.3" y="59" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,5523</text>
<rect x="120" y="80" width="291.6" height="20" fill="var(--c2)"/>
<text x="115" y="94" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">vol UNVR ×1,2</text>
<text x="417.6" y="94" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,6004</text>
<rect x="120" y="115" width="307.6" height="20" fill="var(--c2)"/>
<text x="115" y="129" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">vol KLBF ×1,2</text>
<text x="433.6" y="129" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,6332</text>
<rect x="120" y="150" width="223.3" height="20" fill="var(--c3)"/>
<text x="115" y="164" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">δ 0,3</text>
<text x="349.3" y="164" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,4597</text>
<rect x="120" y="185" width="201.4" height="20" fill="var(--c3)"/>
<text x="115" y="199" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">δ 0,5</text>
<text x="327.4" y="199" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,4147</text>
<text x="120.0" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="217.1" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<text x="314.3" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<text x="411.4" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<text x="293" y="236" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">bobot BBCA</text>
</svg>`,
        alt: "Bobot BBCA GMV per skenario: dasar 0,5523; vol UNVR x1,2 0,6004; vol KLBF x1,2 0,6332; delta 0,3 0,4597; delta 0,5 0,4147.",
        caption: "Cara membaca: batang = bobot BBCA pada GMV di bawah tiap skenario [notebook]; garis putus-putus = GMV dasar 0,5523. Interpretasi: vol satu aset ×1,2 menggeser bobot BBCA ke ATAS (aset yang digelembungkan dibuang); shrinkage δ menggesernya ke BAWAH (menuju equal-weight 0,3333). Yang paling menggerakkan jawaban di sini: vol relatif dan cap — bukan rf, bukan skala vol seragam.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: sensitivitas berarti «angka berubah bila input berubah»",
        type: "pitfall",
        body: "Yang benar: SEMUA angka berubah bila input berubah — itu bukan temuan. Sensitivitas adalah PERINGKAT: input mana yang paling menggerakkan jawaban, dan seberapa besar. Di sini rf 0,03 → 0,07 tidak menggerakkan bobot MS long-only sama sekali (tetap [0; 0; 1]), sementara SATU cap (w_UNVR ≤ 0,50) membalik Sharpe MS dari +0,0590 ke −0,3721. Tanpa peringkat, tabel sensitivitas hanya daftar angka yang berubah.",
      },
    },
    {
      id: "twofund",
      eyebrow: "Langkah 13 · Two-fund separation & batasan",
      title: "Two-fund separation — dan batasan Markowitz yang wajib diingat",
      prose: [
        "Two-fund separation adalah teorema yang membuat frontier jauh lebih sederhana daripada kelihatannya: SELURUH efficient frontier bisa dibangun dari DUA portofolio efisien mana pun. Campur dua titik frontier dengan bobot apa pun — hasilnya tetap berada di frontier (bila tidak ada aset bebas risiko) atau di CML (bila ada). Praktisnya: manajer dana tidak perlu menawarkan 100 portofolio untuk 100 selera risiko — cukup dua «dana» (misal dana GMV dan dana tangency), dan tiap investor tinggal memilih campuran keduanya sesuai selera risikonya.",
        "Nilai — contoh campuran [notebook]: 50% GMV + 50% max-Sharpe → bobot [0,2762; 0,1349; 0,5888], return −0,0553, vol 0,3588, Sharpe −0,2935. Titik ini duduk di frontier (di antara titik keempat dan kelima dari 8 titik kanonis) — bukan di bawahnya. Dan dengan aset bebas risiko: 50% tunai (rf 0,05) + 50% tangency → return 0,0648, vol 0,2507, Sharpe TETAP 0,0590 — duduk di CML, bukan di frontier. Dua campuran itu menunjukkan kedua versi teorema: tanpa tunai, campuran dua titik frontier tetap efisien; dengan tunai, campuran tunai + tangency tetap di CML.",
        "Baik atau buruk: two-fund separation bagus karena ia menjelaskan mengapa industri reksa dana bekerja seperti sekarang: sedikit dana standar, banyak investor yang mencampur. Buruk bila dibaca sebagai «dua dana sudah cukup untuk semua orang»: teorema ini benar HANYA bila semua investor sepakat tentang μ dan Σ yang sama, bisa meminjam/memegang tunai pada rf yang sama, dan hanya peduli mean-variance. Di dunia nyata, ketiganya tidak berlaku persis — dan itulah jembatan ke batasan.",
        "Batasan pertama — estimasi: μ dan Σ di lesson ini adalah RATA-RATA dan KOVARIANS HISTORIS 480 hari. Rata-rata return harian adalah statistik yang PALING BERISIK: standard error rata-rata return tahunan BBCA saja sudah sekitar 0,3449/√480×√252 ≈ 0,25 — sebesar return-nya sendiri. Optimasi memperlakukan estimasi itu sebagai kebenaran, lalu memaksimalkan kesalahan estimasinya: ia membebani aset yang return historisnya «kebetulan» tinggi dan membuang yang «kebetulan» rendah. Hasilnya: bobot yang ekstrem dan rapuh — seperti corner 100% UNVR di langkah 6. Mitigasi: shrinkage (M5.5) dan Black-Litterman (M5.5) — keduanya ada di modul ini.",
        "Batasan kedua — normalitas: mean-variance hanya peduli dua momen pertama (mean dan varians). Bila return punya ekor tebal atau miring — seperti return saham yang crash-nya lebih dalam daripada naiknya — varians MEREMEHKAN risiko yang sebenarnya. M4 sudah mengajarkan VaR dan Expected Shortfall justru karena alasan ini. Mitigasi: lengkapi mean-variance dengan ukuran risiko ekor (VaR/ES, M4.2–M4.3) sebelum mengambil keputusan dengan uang sungguhan.",
        "Batasan ketiga — satu periode: Markowitz adalah model SATU periode — beli hari ini, pegang sampai horizon, tidak ada rebalancing, tidak ada biaya transaksi, tidak ada pajak. Di dunia nyata, portofolio di-rebalance berkala (dan tiap rebalance membayar biaya), horizon investor berbeda-beda, dan return antar periode tidak independen. Langkah 8 dan 9 mengajarkan biaya transaksi dan rebalancing sebagai lapisan operasional DI LUAR model — modelnya sendiri tetap tidak memuat keduanya. Mitigasi: uji out-of-sample (M5.5) — frontier yang dihitung dari 240 hari pertama, diuji pada 240 hari berikutnya — dan lihat apakah «efisien»-nya bertahan.",
        "Batasan keempat — tanpa gesekan: tidak ada biaya transaksi, tidak ada bid-ask spread, semua aset bisa dibeli/dijual dalam jumlah berapa pun pada harga yang sama, shorting bebas (bila tidak ada kendala long-only). Di data ini, kendala long-only justru yang menyelamatkan max-Sharpe dari jawaban tak-berhingga (langkah 6) — pengingat bahwa «tanpa gesekan» bukan asumsi yang netral: ia bisa mengubah jawaban dari waras menjadi tidak bermakna.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: frontier adalah peta yang berlaku untuk semua investor",
        type: "pitfall",
        body: "Yang benar: frontier di lesson ini dihitung dari SATU μ dan SATU Σ — dari satu window, satu universe tiga saham, satu konvensi (simple return). Investor lain dengan window berbeda, universe berbeda, atau keyakinan berbeda akan menggambar frontier yang berbeda. Two-fund separation pun mensyaratkan semua investor sepakat tentang μ dan Σ — syarat yang tidak pernah terpenuhi persis. Frontier adalah peta dari SATU sudut pandang, bukan peta wilayahnya.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 14 · Lab 1",
      title: "Lab: hitung frontier dengan SLSQP",
      prose: [
        "Sekarang giliranmu menghitung frontier. Di lab ini kamu memakai SLSQP (Sequential Least Squares Programming) — solver yang sama dengan notebook kanonis — pada μ dan Σ dari data pin [notebook]. Karena lab web tidak bisa membaca file CSV, μ dan Σ ditulis eksplisit di kode (Σ dibulatkan ke 6 desimal — pembulatan itu menggeser satu titik frontier sebesar 0,0001: titik kelima tercetak 0,3748, sedangkan kanonis dari Σ penuh adalah 0,3749; di notebook, yang menghitung Σ langsung dari CSV, nilainya 0,3749 persis). Bobot lab juga bergeser hingga ~0,003 dari bobot kanonis akibat pembulatan Σ ke 6 desimal — volatilitasnya hanya bergeser ≤0,0001.",
        "Tugasmu: lengkapi port_stats, jalankan GMV, lalu loop 8 target return kanonis dan minimalkan varians untuk tiap target. Hasilnya [lab]: GMV w = [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966, Sharpe −0,8100; dan 8 titik frontier dengan vol 0,2966; 0,3021; 0,3179; 0,3428; 0,3748; 0,4125; 0,4548; 0,5014 — sama dengan 8 titik kanonis (kecuali pembulatan 0,0001 di titik kelima). Perhatikan titik terakhir: target 0,0796 memaksa w = [0; 0; 1] — SLSQP sendiri yang menemukan corner solution itu, bukan kamu yang memaksanya.",
        "Bacaan yang jujur: SLSQP di sini bekerja pada masalah yang konveks (meminimalkan kuadratik dengan kendala linear) — untuk masalah seperti ini, solver hampir selalu menemukan optimum global. Bandingkan dengan M5.2: di sana SLSQP pada max-Sharpe TAK-TERKENDALA (rasio, non-konveks, tanpa batas) «berhasil» sambil mengembalikan bobot raksasa [−3154; −3786; 6941]. Solver yang sama, masalah yang berbeda — yang satu bisa dipercaya, yang satu tidak. Selalu tanyakan dulu: apakah masalahku konveks?",
      ],
      requires: ["numpy", "scipy"],
      tasks: [
        { id: "t1", text: "Lengkapi port_stats: return = w @ mu, vol = akar dari w @ cov @ w, Sharpe = (return - RF) / vol" },
        { id: "t2", text: "Jalankan GMV (kode sudah tersedia) dan bandingkan bobotnya dengan kanonis [0,5523; 0,2699; 0,1777]" },
        { id: "t3", text: "Lengkapi kendala target return pada loop frontier (w @ mu harus sama dengan t), lalu jalankan ke-8 target" },
      ],
      expected: "GMV: w=[0.5523, 0.2699, 0.1777] ret=-0.1903 vol=0.2966 sharpe=-0.8100\ntarget -0.1903: w=[0.5523, 0.2700, 0.1776] ret=-0.1903 vol=0.2966\ntarget -0.1517: w=[0.4891, 0.2162, 0.2947] ret=-0.1517 vol=0.3021\ntarget -0.1132: w=[0.4262, 0.1625, 0.4114] ret=-0.1132 vol=0.3179\ntarget -0.0746: w=[0.3630, 0.1085, 0.5284] ret=-0.0746 vol=0.3428\ntarget -0.0361: w=[0.3001, 0.0548, 0.6451] ret=-0.0361 vol=0.3748\ntarget +0.0025: w=[0.2379, 0.0000, 0.7621] ret=0.0025 vol=0.4125\ntarget +0.0410: w=[0.1191, 0.0000, 0.8809] ret=0.0410 vol=0.4548\ntarget +0.0796: w=[0.0000, 0.0000, 1.0000] ret=0.0796 vol=0.5014",
      hints: [
        "port_stats: ret = float(w @ mu); vol = float(np.sqrt(w @ cov @ w)); Sharpe = (ret - RF) / vol.",
        "Kendala target return: {\"type\": \"eq\", \"fun\": lambda w, t=t: float(w @ mu) - t} — perhatikan t=t agar tiap iterasi mengikat targetnya sendiri.",
        "Titik awal loop frontier adalah gmv_w — dekat dengan solusi, sehingga SLSQP cepat konvergen.",
      ],
      code: {
        starter: `import numpy as np
from scipy.optimize import minimize

# Input dari data pin [notebook]: mean & kovarians tahunan (simple return, x252)
# BBCA, KLBF, UNVR — 480 hari, 2024-11-04 s.d. 2026-11-11; rf = 0,05
mu = np.array([-0.2445, -0.2570, 0.0796])
cov = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
RF = 0.05
TARGETS = [-0.1903, -0.1517, -0.1132, -0.0746, -0.0361, 0.0025, 0.0410, 0.0796]

def port_stats(w):
    ret = 0.0  # TODO: return portofolio w @ mu
    vol = 0.0  # TODO: volatilitas sqrt(w @ cov @ w)
    return ret, vol, (ret - RF) / vol

cons = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},)
bnds = [(0.0, 1.0)] * 3

# t2: GMV — minimalkan varians, mulai dari equal-weight
gmv = minimize(lambda w: w @ cov @ w, np.ones(3) / 3,
               method="SLSQP", bounds=bnds, constraints=cons)
gmv_w = gmv.x
gmv_ret, gmv_vol, gmv_sharpe = port_stats(gmv_w)
print(f"GMV: w=[{gmv_w[0]:.4f}, {gmv_w[1]:.4f}, {gmv_w[2]:.4f}] ret={gmv_ret:.4f} vol={gmv_vol:.4f} sharpe={gmv_sharpe:.4f}")

# t3: frontier — untuk tiap target return, minimalkan varians
frontier_vols = []
for t in TARGETS:
    c2 = None  # TODO: cons + kendala w @ mu == t
    r = minimize(lambda w: w @ cov @ w, gmv_w,
                 method="SLSQP", bounds=bnds, constraints=c2)
    w = r.x
    ret, vol, _ = port_stats(w)
    frontier_vols.append(round(vol, 4))
    print(f"target {t:+.4f}: w=[{w[0]:.4f}, {w[1]:.4f}, {w[2]:.4f}] ret={ret:.4f} vol={vol:.4f}")`,
        lockLines: 14,
        solution: `import numpy as np
from scipy.optimize import minimize

# Input dari data pin [notebook]: mean & kovarians tahunan (simple return, x252)
# BBCA, KLBF, UNVR — 480 hari, 2024-11-04 s.d. 2026-11-11; rf = 0,05
mu = np.array([-0.2445, -0.2570, 0.0796])
cov = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
RF = 0.05
TARGETS = [-0.1903, -0.1517, -0.1132, -0.0746, -0.0361, 0.0025, 0.0410, 0.0796]

def port_stats(w):
    ret = float(w @ mu)
    vol = float(np.sqrt(w @ cov @ w))
    return ret, vol, (ret - RF) / vol

cons = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},)
bnds = [(0.0, 1.0)] * 3

# t2: GMV — minimalkan varians, mulai dari equal-weight
gmv = minimize(lambda w: w @ cov @ w, np.ones(3) / 3,
               method="SLSQP", bounds=bnds, constraints=cons)
gmv_w = gmv.x
gmv_ret, gmv_vol, gmv_sharpe = port_stats(gmv_w)
print(f"GMV: w=[{gmv_w[0]:.4f}, {gmv_w[1]:.4f}, {gmv_w[2]:.4f}] ret={gmv_ret:.4f} vol={gmv_vol:.4f} sharpe={gmv_sharpe:.4f}")

# t3: frontier — untuk tiap target return, minimalkan varians
frontier_vols = []
for t in TARGETS:
    c2 = cons + ({"type": "eq", "fun": lambda w, t=t: float(w @ mu) - t},)
    r = minimize(lambda w: w @ cov @ w, gmv_w,
                 method="SLSQP", bounds=bnds, constraints=c2)
    w = r.x
    ret, vol, _ = port_stats(w)
    frontier_vols.append(round(vol, 4))
    print(f"target {t:+.4f}: w=[{w[0]:.4f}, {w[1]:.4f}, {w[2]:.4f}] ret={ret:.4f} vol={vol:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "gmv_vol", value: 0.2966, tol: 0.0005, label: "`gmv_vol` seharusnya 0.2966", msg: "Vol GMV 0,2966 — risiko minimum long-only [notebook]." },
          { kind: "equal", task: "t3", name: "frontier_vols", value: [0.2966, 0.3021, 0.3179, 0.3428, 0.3748, 0.4125, 0.4548, 0.5014], tol: 0.0005, label: "`frontier_vols` seharusnya 8 vol kanonis", msg: "Delapan vol frontier — titik kelima 0,3748 (Σ dibulatkan; kanonis 0,3749)." },
          { kind: "stdout_matches", task: "t2", pattern: "GMV: w=\\[0\\.5523, 0\\.2699, 0\\.1777\\] ret=-0\\.1903 vol=0\\.2966 sharpe=-0\\.8100", label: "Output menampilkan GMV kanonis", msg: "GMV: w=[0.5523, 0.2699, 0.1777] ret=-0.1903 vol=0.2966 sharpe=-0.8100." },
          { kind: "stdout_matches", task: "t3", pattern: "target \\+0\\.0796: w=\\[0\\.0000, 0\\.0000, 1\\.0000\\] ret=0\\.0796 vol=0\\.5014", label: "Output menampilkan titik ujung 100% UNVR", msg: "Target tertinggi memaksa 100% UNVR — corner solution yang ditemukan solver." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 15 · Lab 2",
      title: "Lab: bandingkan EW vs GMV vs max-Sharpe",
      prose: [
        "Lab kedua memakai angka yang sama untuk menjawab pertanyaan praktis: dari tiga portofolio «siap pakai» — equal-weight, GMV, dan max-Sharpe — mana yang «menang», dan menang dalam apa? Jawabannya tergantung pada apa yang kamu ukur — dan lab ini memaksa kamu mengukurnya ketiganya sekaligus.",
        "Hasilnya [lab]: EW return −0,1406, vol 0,3114, Sharpe −0,6122; GMV return −0,1903, vol 0,2966, Sharpe −0,8100; max-Sharpe return 0,0796, vol 0,5014, Sharpe 0,0590. Vol TERKECIL: GMV (0,2966). Return TERTINGGI: max-Sharpe (0,0796). Sharpe TERTINGGI: max-Sharpe (0,0590) — satu-satunya yang positif. Tidak ada yang menang di semua ukuran: GMV «menang» vol tapi «kalah» return dan Sharpe; max-Sharpe «menang» return dan Sharpe tapi «kalah» vol.",
        "Lalu vonis dominasi atas EW [lab]: pada return EW (−0,1406), vol frontier adalah 0,3056 — EW membayar vol ekstra 0,0058 untuk return yang sama. Kecil, tapi bukan nol: equal-weight TIDAK efisien. Dan CML 50% tunai + 50% tangency [lab]: return 0,0648, vol 0,2507, Sharpe 0,0590 — Sharpe yang sama dengan tangency, dengan vol SETENGAH dari 100% UNVR. Itulah gunanya aset bebas risiko: ia memotong risiko tanpa memotong Sharpe.",
        "Keputusan akhirnya bergantung pada tujuanmu: bila tujuanmu risiko minimum absolut, pilih GMV — dan terima return −0,1903. Bila tujuanmu Sharpe maksimum, pilih tangency — dan terima vol 0,5014 serta portofolio satu saham. Bila tujuanmu return 0 dengan risiko minimum, pilih titik frontier keenam (return 0,0025, vol 0,4125, w [0,2352; 0,0026; 0,7622]). Tidak ada jawaban tanpa menyebut tujuan — dan lesson ini melarangmu memilih tanpa menyebutnya.",
      ],
      requires: ["numpy", "scipy"],
      tasks: [
        { id: "t1", text: "Lengkapi Sharpe di port_stats, jalankan tabel ketiga portofolio, dan catat mana vol terkecil / return tertinggi / Sharpe tertinggi" },
        { id: "t2", text: "Lengkapi kendala target return EW (-0,1406) dan hitung gap vol EW di atas frontier" },
        { id: "t3", text: "Lengkapi return dan vol CML 50% tunai + 50% tangency, lalu bandingkan Sharpe-nya dengan Sharpe tangency" },
      ],
      expected: "EW: ret=-0.1406 vol=0.3114 sharpe=-0.6122\nGMV: ret=-0.1903 vol=0.2966 sharpe=-0.8100\nMS: ret=0.0796 vol=0.5014 sharpe=0.0590\nfrontier vol pada ret -0,1406: 0.3056\nEW vol: 0.3114 — gap di atas frontier: 0.0058\nCML 50/50: ret=0.0648 vol=0.2507 sharpe=0.0590",
      hints: [
        "Sharpe = (ret - RF) / vol — RF = 0,05.",
        "Kendala target: {\"type\": \"eq\", \"fun\": lambda w: float(w @ mu) + 0.1406} — karena targetnya −0,1406.",
        "CML 50/50: return = 0,5 × RF + 0,5 × 0,0796; vol = 0,5 × 0,5014 (tunai punya vol 0).",
      ],
      code: {
        starter: `import numpy as np
from scipy.optimize import minimize

# Input yang sama seperti Lab 1 [notebook]
mu = np.array([-0.2445, -0.2570, 0.0796])
cov = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
RF = 0.05
EW = np.ones(3) / 3
GMV_W = np.array([0.5523, 0.2699, 0.1777])
MS_W = np.array([0.0, 0.0, 1.0])

def port_stats(w):
    ret = float(w @ mu)
    vol = float(np.sqrt(w @ cov @ w))
    sharpe = 0.0  # TODO: (ret - RF) / vol
    return ret, vol, sharpe

# t1: tabel ketiga portofolio
for name, w in [("EW", EW), ("GMV", GMV_W), ("MS", MS_W)]:
    ret, vol, sharpe = port_stats(w)
    print(f"{name}: ret={ret:.4f} vol={vol:.4f} sharpe={sharpe:.4f}")

# t2: vol frontier pada return EW (-0,1406) — SLSQP dengan target return itu
cons = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},
        {"type": "eq", "fun": lambda w: float(w @ mu) + 0.1406})  # TODO: cek tanda target
r = minimize(lambda w: w @ cov @ w, EW, method="SLSQP",
             bounds=[(0.0, 1.0)] * 3, constraints=cons)
frontier_vol_at_ew = float(np.sqrt(r.x @ cov @ r.x))
ew_ret, ew_vol, _ = port_stats(EW)
gap = ew_vol - frontier_vol_at_ew
print(f"frontier vol pada ret -0,1406: {frontier_vol_at_ew:.4f}")
print(f"EW vol: {ew_vol:.4f} — gap di atas frontier: {gap:.4f}")

# t3: CML — 50% tunai + 50% tangency (100% UNVR)
cml_ret = 0.0  # TODO: 0,5 * RF + 0,5 * 0,0796
cml_vol = 0.0  # TODO: 0,5 * 0,5014
cml_sharpe = (cml_ret - RF) / cml_vol
print(f"CML 50/50: ret={cml_ret:.4f} vol={cml_vol:.4f} sharpe={cml_sharpe:.4f}")`,
        lockLines: 15,
        solution: `import numpy as np
from scipy.optimize import minimize

# Input yang sama seperti Lab 1 [notebook]
mu = np.array([-0.2445, -0.2570, 0.0796])
cov = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
RF = 0.05
EW = np.ones(3) / 3
GMV_W = np.array([0.5523, 0.2699, 0.1777])
MS_W = np.array([0.0, 0.0, 1.0])

def port_stats(w):
    ret = float(w @ mu)
    vol = float(np.sqrt(w @ cov @ w))
    sharpe = (ret - RF) / vol
    return ret, vol, sharpe

# t1: tabel ketiga portofolio
for name, w in [("EW", EW), ("GMV", GMV_W), ("MS", MS_W)]:
    ret, vol, sharpe = port_stats(w)
    print(f"{name}: ret={ret:.4f} vol={vol:.4f} sharpe={sharpe:.4f}")

# t2: vol frontier pada return EW (-0,1406) — SLSQP dengan target return itu
cons = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},
        {"type": "eq", "fun": lambda w: float(w @ mu) + 0.1406})
r = minimize(lambda w: w @ cov @ w, EW, method="SLSQP",
             bounds=[(0.0, 1.0)] * 3, constraints=cons)
frontier_vol_at_ew = float(np.sqrt(r.x @ cov @ r.x))
ew_ret, ew_vol, _ = port_stats(EW)
gap = ew_vol - frontier_vol_at_ew
print(f"frontier vol pada ret -0,1406: {frontier_vol_at_ew:.4f}")
print(f"EW vol: {ew_vol:.4f} — gap di atas frontier: {gap:.4f}")

# t3: CML — 50% tunai + 50% tangency (100% UNVR)
cml_ret = 0.5 * RF + 0.5 * 0.0796
cml_vol = 0.5 * 0.5014
cml_sharpe = (cml_ret - RF) / cml_vol
print(f"CML 50/50: ret={cml_ret:.4f} vol={cml_vol:.4f} sharpe={cml_sharpe:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ew_vol", value: 0.3114, tol: 0.0005, label: "`ew_vol` seharusnya 0.3114", msg: "Vol equal-weight 0,3114 [notebook]." },
          { kind: "equal", task: "t2", name: "gap", value: 0.0058, tol: 0.0005, label: "`gap` seharusnya 0.0058", msg: "EW membayar vol ekstra 0,0058 di atas frontier pada return yang sama." },
          { kind: "equal", task: "t3", name: "cml_sharpe", value: 0.059, tol: 0.0005, label: "`cml_sharpe` seharusnya 0.059", msg: "Sharpe CML 50/50 tetap 0,0590 — sama dengan Sharpe tangency." },
          { kind: "stdout_matches", task: "t1", pattern: "MS: ret=0\\.0796 vol=0\\.5014 sharpe=0\\.0590", label: "Output menampilkan baris max-Sharpe", msg: "Max-Sharpe: return 0,0796, vol 0,5014, Sharpe 0,0590 — satu-satunya Sharpe positif." },
        ],
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 16 · Jebakan in-sample",
      title: "Jebakan: frontier in-sample bukan janji",
      prose: [
        "Ini jebakan terbesar di seluruh modul M5 — dan lesson ini menutup dengan mengatakannya terus terang: frontier yang kamu hitung di lab 1 adalah frontier IN-SAMPLE. Ia dihitung dari μ dan Σ yang diestimasi dari 480 hari yang SAMA dengan hari-hari yang dinilai. Ia berkata «inilah yang paling efisien SEANDAINYA masa depan sama persis seperti masa lalu» — dan masa depan hampir tidak pernah sama persis.",
        "Mekanismenya sudah kamu lihat di langkah 13: optimasi memaksimalkan kesalahan estimasi. μ historis UNVR (+0,0796) mungkin sebagian keberuntungan window ini; μ historis BBCA (−0,2445) mungkin sebagian kesialan window ini. Optimasi merespons dengan membuang BBCA sampai nol dan menumpuk UNVR sampai 100% — persis pada aset yang «kebetulan» terlihat terbaik. Bila window berikutnya berbalik, corner solution itu yang paling terpukul. Inilah yang diuji M5.5 secara kuantitatif: frontier dari 240 hari pertama, diuji pada 240 hari berikutnya — dan di sana GMV, max-Sharpe, risk parity, dan equal-weight SEMUANYA merugi out-of-sample (return −0,32 sampai −0,37), sementara in-sample-nya tampak jauh lebih baik. Bahkan GMV yang «paling stabil» pun jatuh dari Sharpe in-sample −0,4139 ke −1,2447 out-of-sample [notebook, M5.5].",
        "Nilai — ukuran masalahnya [notebook, M5.5]: max-Sharpe in-sample (240 hari pertama) punya return 0,4831 dan Sharpe 0,7644 — tampak seperti strategi yang hebat. Out-of-sample (240 hari berikutnya) return-nya −0,3239 dan Sharpe −0,8780. Pembalikan total: dari «terbaik» menjadi «sama buruknya dengan yang lain». Equal-weight — yang in-sample-nya paling «membosankan» (return 0,0856, Sharpe 0,1154) — out-of-sample-nya −0,3669, Sharpe −1,3278: paling buruk dari semuanya. Tidak ada yang selamat — karena seluruh window ini adalah pasar turun, dan tidak ada optimasi in-sample yang bisa mengubah fakta itu.",
        "Baik atau buruk: frontier in-sample bagus sebagai DIAGNOSIS — ia menunjukkan struktur trade-off dan seberapa besar diversifikasi bisa membantu DALAM data yang ada. Buruk bila dibaca sebagai PROYEKSI — «portofolio ini akan memberi return X dengan vol Y». Ia tidak akan. Ia memberi return X dengan vol Y hanya bila masa depan mengulang masa lalu.",
        "Mitigasi — tiga lapis, semuanya ada di modul ini: (1) uji out-of-sample SELALU — split waktu, bukan split acak (M5.5); (2) shrinkage — tarik Σ ekstrem ke arah struktur yang lebih stabil, sehingga bobot tidak terlalu ekstrem (M5.5: GMV Ledoit-Wolf [0,5185; 0,2852; 0,1963] vs GMV biasa [0,5523; 0,2699; 0,1777]); (3) Black-Litterman — campur μ historis dengan pandangan investor dan equilibrium, supaya satu angka historis tidak mendikte seluruh portofolio (M5.5). Dan aturan praktis yang paling murah: bila frontier-mu bergantung pada SATU aset (corner 100% UNVR), anggap itu sebagai peringatan, bukan sebagai jawaban.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: portofolio di frontier pasti bagus di masa depan",
        type: "pitfall",
        body: "Yang benar: «di frontier» berarti efisien DALAM DATA yang dipakai menghitungnya. Out-of-sample, max-Sharpe in-sample (return 0,4831, Sharpe 0,7644 pada 240 hari pertama) berubah menjadi return −0,3239, Sharpe −0,8780 pada 240 hari berikutnya [notebook, M5.5]. Frontier adalah cermin masa lalu — bukan ramalan. Yang membedakan portofolio yang bertahan bukan «di frontier atau tidak», melainkan seberapa peka ia terhadap kesalahan estimasi — dan itu diuji out-of-sample, bukan dihitung in-sample.",
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 17 · Guided task di Colab",
      title: "Guided task di Colab: Markowitz di data nyata",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat dengan μ dan Σ yang sudah dihitung. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m53-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, UNVR yang sesungguhnya (window 2024-11-01 sampai 2026-11-12; file pin diunduh 2026-11-12), menghitung SIMPLE return dan annualisasi ×252/√252 sendiri, membangun μ dan Σ dari nol, mereplikasi GMV long-only ([0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966), max-Sharpe long-only ([0; 0; 1], return 0,0796, vol 0,5014, Sharpe 0,0590), kedelapan titik frontier, perbandingan EW vs GMV vs max-Sharpe, dan CML — lengkap dengan checks yang menegaskan tiap langkah.",
        "Jalur file notebook: colab/mlf-m53-guided-task.ipynb. Tautan Colab: https://colab.research.google.com/drive/1wSLMqtoIRBolkbjJtQjqMAoh87Jqnw1J",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 18 · Checkpoint",
      title: "Checkpoint: frontier, GMV, dan tangency — di window pasar turun",
      prose: [
        "Rangkuman: Markowitz 1952 — investor peduli return DAN risiko; diversifikasi bekerja karena korelasi di bawah 1 (di sini 0,2774–0,3488 [notebook]). Input: μ dan Σ dari data pin — SIMPLE return, 480 hari 2024-11-04 s.d. 2026-11-11, annualisasi ×252/√252, rf 0,05 (M4.4 memakai LOG return untuk VaR — beda konvensi, jangan dicampur). Per-aset [notebook]: BBCA return −0,2445, vol 0,3449, Sharpe −0,8540; KLBF −0,2570, vol 0,4251, Sharpe −0,7221; UNVR 0,0796, vol 0,5014, Sharpe 0,0590. Frontier 8 titik [notebook]: dari GMV (return −0,1903, vol 0,2966) ke 100% UNVR (return 0,0796, vol 0,5014). GMV long-only [0,5523; 0,2699; 0,1777] — vol terkecil 0,2966, tapi return terendah dan Sharpe terburuk (−0,8100). Max-Sharpe long-only [0; 0; 1] — corner solution karena hanya UNVR yang excess return-nya positif; Sharpe maksimum hanya 0,0590 dan CML nyaris datar. Equal-weight (return −0,1406, vol 0,3114) didominasi: pada return yang sama, frontier memberi vol 0,3056 — gap 0,0058. Two-fund separation: 50% GMV + 50% max-Sharpe → return −0,0553, vol 0,3588; 50% tunai + 50% tangency → return 0,0648, vol 0,2507, Sharpe tetap 0,0590. Batasan: μ berisik (standard error return tahunan BBCA ≈ 0,25), normalitas, satu periode, tanpa gesekan. Biaya transaksi [ilustrasi]: 20bp sekali jalan — EW→GMV 4,38bp, EW→MS 13,33bp; budget turnover L1 ≤ 0,10 memberi vol 0,3048 (+82bp vs GMV bebas). Rebalancing: drift GMV 240 hari hanya L1 0,0228; ambang 2pp memicu 39× (9,85bp/tahun) vs ambang 5pp 5× (2,93bp/tahun). Dari bobot ke perdagangan [ilustrasi]: GMV sisa kas Rp550.000 (0,55%) vs Rp1.445 tanpa lot; trade list butuh holdings awal. Risiko downside: min-semivarians DD 0,2343 vs GMV 0,2345 — nyaris sama; ES95-min ES95 harian 0,0429 vs GMV 0,0437. Sensitivitas: rf tidak menggerakkan MS long-only; semua vol ×1,1 tidak mengubah GMV; cap UNVR ≤ 0,50 menjatuhkan Sharpe MS ke −0,3721; shrinkage δ 0,5 → GMV [0,4147; 0,3213; 0,2640]. Dan jebakan terbesar: frontier in-sample bukan janji — max-Sharpe in-sample 240 hari pertama (Sharpe 0,7644) menjadi Sharpe −0,8780 out-of-sample (M5.5).",
      ],
      tasks: [],
      quiz: [
        {
          q: "GMV long-only di data ini adalah w = [0,5523; 0,2699; 0,1777] dengan return −0,1903 dan vol 0,2966. Apa yang PALING TEPAT tentang GMV?",
          options: [
            { text: "GMV adalah portofolio terbaik karena vol-nya terkecil", why: "Vol terkecil (0,2966) benar, tapi return-nya −0,1903 (terendah di frontier) dan Sharpe-nya −0,8100 (terburuk dari ketiganya) — «paling tenang» bukan «paling baik»." },
            { text: "GMV adalah portofolio risiko minimum — vol terkecil yang mungkin — tapi return-nya terendah di frontier dan Sharpe-nya terburuk; ia jangkar dan pembanding, bukan tujuan", why: "Benar: GMV meminimalkan vol (0,2966 < vol BBCA 0,3449) tanpa peduli return — return −0,1903 dan Sharpe −0,8100 adalah harganya.", correct: true },
            { text: "GMV memakai μ historis sehingga paling peka terhadap kesalahan estimasi", why: "Terbalik: GMV hanya memakai Σ, bukan μ — justru itulah yang membuatnya LEBIH tahan terhadap kesalahan estimasi μ daripada max-Sharpe." },
            { text: "GMV selalu sama dengan equal-weight", why: "Equal-weight [1/3; 1/3; 1/3] punya vol 0,3114 — lebih tinggi dari GMV 0,2966 — dan return −0,1406, berbeda dari GMV −0,1903." },
          ],
        },
        {
          q: "Max-Sharpe long-only adalah [0; 0; 1] — 100% UNVR — dengan Sharpe 0,0590. Mengapa jawabannya corner solution?",
          options: [
            { text: "Karena UNVR punya vol terbesar sehingga optimasi memilihnya", why: "Vol besar justru MENGHUKUM aset dalam optimasi Sharpe — UNVR dipilih meski vol-nya terbesar (0,5014), bukan karena vol-nya." },
            { text: "Karena hanya UNVR yang punya excess return positif (+0,0296); BBCA dan KLBF excess return-nya negatif, jadi menambah keduanya hanya menurunkan Sharpe", why: "Benar: excess return BBCA −0,2945 dan KLBF −0,3070 — keduanya negatif — sehingga optimum long-only membuang keduanya sampai nol.", correct: true },
            { text: "Karena SLSQP gagal konvergen dan berhenti di sudut", why: "Bukan kegagalan solver: masalah max-Sharpe long-only ini konveks-setara dan solusinya memang di sudut — SLSQP menemukan corner itu dengan benar." },
            { text: "Karena korelasi UNVR dengan yang lain paling rendah", why: "Korelasi UNVR (0,2774 dan 0,2897) memang terendah, tapi itu bukan penyebab corner — penyebabnya adalah excess return: hanya UNVR yang positif." },
          ],
        },
        {
          q: "Equal-weight punya return −0,1406 dan vol 0,3114. Pada return yang sama, vol frontier adalah 0,3056. Apa vonisnya?",
          options: [
            { text: "Equal-weight efisien karena selisihnya hanya 0,0058", why: "Selisih kecil tidak membuatnya efisien — definisi efisien adalah TEPAT di frontier; 0,0058 di atas frontier berarti ada portofolio yang memberi return sama dengan risiko lebih kecil." },
            { text: "Equal-weight tidak efisien (didominasi): ia membayar vol ekstra 0,0058 untuk return yang sama — ada titik frontier yang lebih baik", why: "Benar: titik frontier [0,4708; 0,2009; 0,3283] memberi return −0,1406 yang sama dengan vol 0,3056 — lebih kecil dari 0,3114.", correct: true },
            { text: "Equal-weight mendominasi GMV karena return-nya lebih tinggi", why: "Return EW (−0,1406) memang lebih tinggi dari GMV (−0,1903), tapi vol-nya juga lebih tinggi (0,3114 vs 0,2966) — itu trade-off, bukan dominasi. Dominasi butuh lebih baik di KEDUA sisi." },
            { text: "Tidak ada vonis — 0,0058 terlalu kecil untuk diukur", why: "0,0058 memang kecil, tapi ia TERUKUR dan arahnya jelas — dan vonis «di bawah kurva» tidak bergantung pada besar selisihnya." },
          ],
        },
        {
          q: "BBCA sendirian: return −0,2445, vol 0,3449. GMV: return −0,1903, vol 0,2966. Apa hubungan keduanya?",
          options: [
            { text: "BBCA mendominasi GMV karena BBCA adalah saham tunggal yang paling tenang", why: "BBCA vol 0,3449 LEBIH TINGGI dari GMV 0,2966 dan return-nya LEBIH RENDAH (−0,2445 vs −0,1903) — BBCA kalah di kedua sisi." },
            { text: "GMV mendominasi BBCA: return lebih tinggi DAN vol lebih rendah — harga tidak melakukan diversifikasi", why: "Benar: GMV −0,1903 > −0,2445 dan 0,2966 < 0,3449 — GMV lebih baik di kedua sisi. Itulah hadiah diversifikasi yang terukur.", correct: true },
            { text: "Keduanya tidak bisa dibandingkan karena yang satu saham, yang satu portofolio", why: "Mean-variance membandingkan apa pun yang punya return dan vol — saham tunggal dan portofolio duduk di bidang yang sama dan bisa dibandingkan langsung." },
            { text: "BBCA lebih baik karena return negatifnya lebih «jujur»", why: "Tidak ada ukuran «kejujuran return» di mean-variance — yang dibandingkan hanya return dan vol, dan di keduanya BBCA kalah." },
          ],
        },
        {
          q: "Campuran 50% aset bebas risiko (rf 0,05) + 50% portofolio tangency (100% UNVR) memberi return 0,0648, vol 0,2507, Sharpe 0,0590. Apa yang ditunjukkan angka ini?",
          options: [
            { text: "CML: mencampur tunai dengan tangency memotong vol menjadi setengah TANPA mengubah Sharpe — Sharpe tetap 0,0590", why: "Benar: return dan vol sama-sama menjadi setengah dari excess-nya, sehingga rasionya (Sharpe) tidak berubah — itulah sifat CML.", correct: true },
            { text: "Sharpe campuran seharusnya setengah dari Sharpe tangency (0,0295)", why: "Salah: Sharpe adalah RASIO — membagi modal antara tunai dan tangency membagi pembilang dan penyebut dengan faktor yang sama, sehingga rasionya tetap." },
            { text: "Campuran ini duduk di frontier, bukan di CML", why: "Campuran dengan aset bebas risiko duduk di CML — garis lurus dari rf ke tangency — bukan di frontier yang melengkung." },
            { text: "Vol 0,2507 membuktikan tunai menghilangkan semua risiko", why: "Vol 0,2507 bukan nol — setengah modal masih di UNVR yang bervolatilitas 0,5014; tunai hanya memotong risiko sebanding dengan porsinya." },
          ],
        },
        {
          q: "Two-fund separation: 50% GMV + 50% max-Sharpe memberi return −0,0553 dan vol 0,3588. Apa artinya?",
          options: [
            { text: "Campuran dua titik frontier jatuh di bawah frontier — two-fund separation gagal di data ini", why: "Salah: campuran itu duduk DI frontier (di antara titik keempat dan kelima kanonis) — teorema justru terkonfirmasi di sini." },
            { text: "Seluruh frontier bisa dibangun dari dua portofolio efisien — investor tinggal memilih campuran sesuai selera risikonya", why: "Benar: campuran 50/50 GMV dan tangency tetap efisien — dua «dana» sudah cukup untuk melayani semua selera risiko (bila semua sepakat tentang μ dan Σ).", correct: true },
            { text: "GMV dan max-Sharpe adalah satu-satunya dua portofolio yang boleh dicampur", why: "Teorema berlaku untuk DUA portofolio efisien MANA PUN — GMV dan tangency hanya contoh yang nyaman." },
            { text: "Campuran itu punya Sharpe tertinggi karena menggabungkan dua yang terbaik", why: "Sharpe campuran −0,2935 — di antara GMV (−0,8100) dan max-Sharpe (0,0590), bukan yang tertinggi. Campuran tidak menciptakan Sharpe baru." },
          ],
        },
        {
          q: "Frontier di lesson ini sebagian besar berada di return negatif, dan tiga titik teratas (return 0,0025; 0,0410; 0,0796) di atas return 0. Apa bacaan yang paling jujur?",
          options: [
            { text: "Frontier-nya salah hitung — frontier yang benar selalu di return positif", why: "Tidak ada yang salah hitung: dua dari tiga saham return tahunannya negatif di window ini — frontier yang jujur HARUS mencerminkan itu." },
            { text: "Ini fakta data dari window pasar turun: frontier menjawab «risiko minimum untuk tiap target return», bukan «return tinggi» — portofolio «terbaik» di sini tetap merugi, hanya dengan risiko sekecil mungkin", why: "Benar: BBCA −0,2445 dan KLBF −0,2570 adalah return historis window 480 hari — frontier tidak bisa menyulapnya menjadi positif.", correct: true },
            { text: "Artinya Markowitz tidak berlaku di pasar turun", why: "Markowitz berlaku di pasar apa pun — ia hanya mengurutkan trade-off yang ADA. Di pasar turun, trade-off-nya memang suram — dan itulah informasi yang benar." },
            { text: "Artinya harus memakai LOG return seperti M4.4 agar frontier-nya positif", why: "Log vs simple return mengubah angka sedikit, bukan tandanya — return log BBCA juga negatif di window ini. Konvensi bukan penyebabnya." },
          ],
        },
        {
          q: "Max-Sharpe in-sample pada 240 hari pertama punya Sharpe 0,7644, tapi out-of-sample pada 240 hari berikutnya Sharpe-nya −0,8780. Apa pelajarannya?",
          options: [
            { text: "Frontier in-sample bukan janji: optimasi memaksimalkan kesalahan estimasi μ, sehingga yang tampak «optimal» di masa lalu bisa berbalik total di masa depan — wajib uji out-of-sample", why: "Benar: pembalikan dari +0,7644 ke −0,8780 adalah bukti bahwa frontier in-sample adalah cermin masa lalu, bukan ramalan — dan M5.5 mengujinya secara kuantitatif.", correct: true },
            { text: "Split 240/240-nya yang salah — seharusnya memakai seluruh 480 hari untuk optimasi", why: "Memakai seluruh data untuk optimasi justru MENGHILANGKAN ujiannya — tidak ada lagi data yang belum dilihat untuk menguji. Split waktu adalah cara yang benar." },
            { text: "Sharpe out-of-sample negatif membuktikan max-Sharpe adalah konsep yang salah", why: "Konsepnya benar sebagai definisi «Sharpe tertinggi DALAM DATA» — yang salah adalah membacanya sebagai janji masa depan." },
            { text: "Itu hanya terjadi pada max-Sharpe — GMV dan equal-weight aman out-of-sample", why: "Salah: out-of-sample, GMV Sharpe −1,2447 dan equal-weight −1,3278 — semuanya merugi. Tidak ada yang selamat di window ini." },
          ],
        },
        {
          q: "Dari equal-weight, pindah ke max-Sharpe biayanya 13,33bp — PALING MAHAL dari semua perpindahan yang dihitung. Mengapa?",
          options: [
            { text: "Karena max-Sharpe punya vol terbesar (0,5014), dan biaya sebanding dengan vol", why: "Salah: biaya dihitung dari TURNOVER (L1), bukan dari vol — vol max-Sharpe memang terbesar, tapi itu bukan yang dibayar." },
            { text: "Karena L1-nya terbesar (1,3333): max-Sharpe membuang BBCA dan KLBF sekaligus (dari 1/3 ke 0) dan menumpuk UNVR sampai 1 — biaya = (1,3333/2) × 20bp = 13,33bp [ilustrasi]", why: "Benar: L1 = 1/3 + 1/3 + 2/3 = 1,3333 — dua aset dibuang penuh dan satu ditumpuk penuh; notional sekali jalan = L1/2, dikali 20bp [ilustrasi] = 13,33bp.", correct: true },
            { text: "Karena max-Sharpe adalah corner solution, dan corner selalu mahal", why: "Salah: corner-nya sendiri bukan penyebab biaya — penyebabnya adalah JARAK dari titik awal (L1 1,3333). Corner yang dekat dengan titik awal bisa murah." },
            { text: "Karena biaya dihitung dari L1 penuh (1,3333 × 20bp = 26,67bp), lalu dibulatkan", why: "Salah dua kali: biaya = (L1/2) × 20bp = 13,33bp [ilustrasi] — memakai L1 penuh menggandakan biaya; dan 13,33bp bukan pembulatan dari 26,67bp." },
          ],
        },
        {
          q: "Simulasi 480 hari dengan target GMV tetap: ambang drift 2pp memicu 39 rebalance, ambang 5pp hanya 5. Mengapa selisihnya sebesar itu?",
          options: [
            { text: "Karena drift harian kecil tapi berisik: ambang 2pp hanya sekitar 2× drift aset terbesar 240 hari (0,0114), sehingga gerakan harian sering mendorong satu aset melewatinya — ambang 5pp hanya terlampaui saat gerakan besar; biaya tahunannya 9,85bp vs 2,93bp", why: "Benar: drift 240 hari L1 0,0228 berarti ambang 0,02 terlampaui oleh gerakan biasa — 39×; ambang 0,05 butuh gerakan yang jarang terjadi — 5×. Biaya tahunan 9,85bp vs 2,93bp [ilustrasi].", correct: true },
            { text: "Karena ambang 2pp dihitung dari L1 dan ambang 5pp dari drift aset terbesar", why: "Salah: kedua ambang memakai definisi drift yang sama (drift aset TERBESAR) — selisihnya murni karena 2pp jauh lebih mudah terlampaui daripada 5pp." },
            { text: "Karena kalender bulanan memicu lebih sering daripada ambang 2pp", why: "Salah: bulanan hanya 22× — LEBIH SEDIKIT dari ambang 2pp (39×). Ambang ketat bisa jauh lebih sering daripada kalender." },
            { text: "Karena 39 rebalance berarti drift-nya 39 kali lebih besar", why: "Salah: jumlah rebalance bukan ukuran drift — drift total 240 hari hanya L1 0,0228. Yang besar adalah FREKUENSI pemicuan, bukan besar gerakannya." },
          ],
        },
        {
          q: "GMV [ilustrasi] Rp100.000.000: sisa kas Rp550.000 (0,55%) — jauh lebih besar dari sisa kas tanpa lot (Rp1.445). Mengapa?",
          options: [
            { text: "Karena GMV membeli BBCA terlalu banyak sehingga uangnya habis", why: "Salah: GMV justru TIDAK menghabiskan uangnya — Rp550.000 TERSISA. Pembulatan ke bawah tidak pernah membeli melebihi target." },
            { text: "Karena pembulatan ke bawah per lot: tiap aset dibulatkan ke kelipatan 100 lembar di bawah targetnya, dan yang terbesar adalah BBCA — satu lot BBCA = Rp532.500 — sehingga sisa kasnya 0,55%", why: "Benar: tanpa lot, sisa kas hanya Rp1.445 (pembulatan ke 1 lembar); dengan lot 100, tiap aset kehilangan rata-rata setengah lot di bawah targetnya — BBCA sendiri menyumbang hingga Rp532.500. Sisa kas adalah harga keterbatasan lot, bukan kesalahan strategi.", correct: true },
            { text: "Karena harga UNVR Rp1.535 membuat lot-nya paling mahal", why: "Salah: lot termahal adalah BBCA (100 × Rp5.325 = Rp532.500), bukan UNVR (100 × Rp1.535 = Rp153.500)." },
            { text: "Karena trade list EW→GMV menjual lebih banyak daripada membeli", why: "Salah: penjualan (Rp6.314.000 + Rp15.657.000 = Rp21.971.000) memang melebihi pembelian (Rp21.832.500) — selisih Rp138.500 — tapi itu MENAMBAH kas, bukan menjelaskan mengapa sisa kas GMV 0,55% sementara tanpa lot hanya Rp1.445. Penyebabnya adalah lot." },
          ],
        },
        {
          q: "Min-semivarians punya downside deviation 0,2343, GMV 0,2345. Mengapa optimasi downside TIDAK jauh lebih baik dari GMV di data ini?",
          options: [
            { text: "Karena min-semivarians memakai MAR yang salah (seharusnya rf, bukan 0)", why: "Salah: MAR = 0 adalah pilihan definisi yang sah untuk downside deviation — dan Sortino di sini memakai rf di pembilang. Hasilnya nyaris sama bukan karena MAR-nya salah." },
            { text: "Karena downside deviation di data ini bergerak seiring vol penuh: aset yang downside-nya kecil juga vol-nya kecil, sehingga meminimalkan downside hampir sama dengan meminimalkan vol — selisihnya hanya 0,0002", why: "Benar: DD 0,2343 vs 0,2345 — selisih 0,0002; Sortino-nya pun nyaris sama (−1,0331 vs −1,0244). Di data ini downside optimization bukan sihir — ia mengukur sebagian besar hal yang sama dengan varians.", correct: true },
            { text: "Karena GMV sudah meminimalkan downside deviation secara definisi", why: "Salah: GMV meminimalkan VARIANS, bukan downside deviation — keduanya ukuran berbeda; kebetulan di data ini jawabannya nyaris sama." },
            { text: "Karena ES95-min lebih baik dari keduanya sehingga min-semivarians tidak ada gunanya", why: "Salah: ES95-min juga hanya menukar sedikit VaR (0,0267 → 0,0280) dengan sedikit ES (0,0437 → 0,0429) — tidak ada yang «jauh lebih baik» di data ini." },
          ],
        },
        {
          q: "Mengalikan SEMUA vol dengan 1,1 tidak mengubah GMV sama sekali — bobotnya tetap [0,5523; 0,2699; 0,1777]. Mengapa?",
          options: [
            { text: "Karena 1,1 terlalu kecil untuk mengubah apa pun", why: "Salah: 1,1 pada SATU vol saja sudah menggeser GMV jauh (UNVR ×1,2 → BBCA 0,6004). Yang tidak berpengaruh adalah skala SERAGAM — bukan besar pengalinya." },
            { text: "Karena GMV hanya bergantung pada RASIO antar vol (dan korelasi), bukan pada skala: semua vol ×1,1 mengalikan Σ dengan 1,21, dan faktor itu tercoret saat bobot dinormalisasi — bobot BBCA tetap 0,5523", why: "Benar: w_GMV = Σ⁻¹1/(1'Σ⁻¹1) — ganti Σ dengan 1,21Σ, maka Σ⁻¹ menjadi Σ⁻¹/1,21, dan 1,21 tercoret di pembilang dan penyebut. Hanya vol RELATIF yang menggerakkan GMV — buktinya, vol UNVR ×1,2 SENDIRIAN menggeser GMV ke [0,6004; 0,3016; 0,0981].", correct: true },
            { text: "Karena GMV tidak memakai Σ sama sekali", why: "Salah: GMV HANYA memakai Σ (tidak memakai μ) — justru karena ia memakai Σ-lah skala seragam bisa tercoret." },
            { text: "Karena korelasi ikut dikalikan 1,1 sehingga efeknya saling meniadakan", why: "Salah: korelasi TIDAK berubah saat semua vol dikali 1,1 — korelasi adalah rasio yang sudah bebas skala. Yang tercoret adalah skala Σ, bukan korelasi." },
          ],
        },
      ],
      summary: [
        "Markowitz 1952: investor peduli return DAN risiko; diversifikasi bekerja karena korelasi di bawah 1 (di sini 0,2774–0,3488 [notebook]) — vol equal-weight 0,3114 vs rata-rata vol anggota 0,4238.",
        "Input dari data pin [notebook]: SIMPLE return, 480 hari 2024-11-04 s.d. 2026-11-11, annualisasi ×252/√252, rf 0,05. BBCA return −0,2445, vol 0,3449, Sharpe −0,8540; KLBF −0,2570, vol 0,4251, Sharpe −0,7221; UNVR 0,0796, vol 0,5014, Sharpe 0,0590. (M4.4 memakai LOG return untuk VaR — konvensi berbeda, jangan dicampur.)",
        "Efficient frontier 8 titik [notebook]: dari GMV (return −0,1903, vol 0,2966) ke 100% UNVR (return 0,0796, vol 0,5014); makin tinggi target, makin besar bobot UNVR.",
        "GMV long-only [0,5523; 0,2699; 0,1777]: vol terkecil 0,2966, return −0,1903, Sharpe −0,8100 — jangkar dan pembanding, bukan tujuan; hanya memakai Σ.",
        "Max-Sharpe long-only [0; 0; 1] (100% UNVR): Sharpe 0,0590, CML nyaris datar — corner solution karena hanya UNVR yang excess return-nya positif (+0,0296).",
        "Dominasi: equal-weight (return −0,1406, vol 0,3114) didominasi — pada return yang sama frontier memberi vol 0,3056 (gap 0,0058); BBCA dan KLBF didominasi GMV di kedua sisi.",
        "Two-fund separation: 50% GMV + 50% max-Sharpe → return −0,0553, vol 0,3588 (tetap di frontier); 50% tunai + 50% tangency → return 0,0648, vol 0,2507, Sharpe tetap 0,0590 (di CML).",
        "Batasan: μ berisik (standard error return tahunan BBCA ≈ 0,25), normalitas, satu periode, tanpa gesekan — mitigasinya shrinkage, Black-Litterman, dan uji out-of-sample (M5.5).",
        "Biaya transaksi [ilustrasi]: spread 10bp + komisi 5bp + slippage 5bp = 20bp sekali jalan; biaya = (L1/2) × 20bp — EW→GMV 4,38bp (Rp43.796 per Rp100jt), EW→MS 13,33bp; budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp vs GMV bebas).",
        "Rebalancing: lifecycle estimasi → optimasi → eksekusi → monitor → rebalance; drift GMV 240 hari hanya L1 0,0228 (crash merata); ambang 2pp 39×/9,85bp per tahun vs ambang 5pp 5×/2,93bp per tahun — ambang longgar ≈ kuartalan.",
        "Dari bobot ke perdagangan [ilustrasi]: harga 2026-11-11 BBCA Rp5.325, KLBF Rp770, UNVR Rp1.535; lot 100, bulatkan ke bawah — GMV sisa kas Rp550.000 (0,55%) vs Rp1.445 tanpa lot; trade list EW→GMV butuh holdings awal.",
        "Risiko downside: downside deviation MAR=0 BBCA 0,2506, KLBF 0,2914, UNVR 0,3242; min-semivarians DD 0,2343 vs GMV 0,2345 — nyaris sama, downside optimization bukan sihir; ES95-min w [0,4868; 0,3710; 0,1423], ES95 harian 0,0429 vs GMV 0,0437.",
        "Sensitivitas: rf 0,03–0,07 tidak mengubah MS long-only [0; 0; 1]; semua vol ×1,1 TIDAK mengubah GMV [0,5523; 0,2699; 0,1777]; cap UNVR ≤ 0,50 menjatuhkan Sharpe MS ke −0,3721; shrinkage δ 0,5 → GMV [0,4147; 0,3213; 0,2640].",
        "Jebakan: frontier in-sample bukan janji — max-Sharpe in-sample Sharpe 0,7644 menjadi −0,8780 out-of-sample (M5.5).",
        "Lab: SLSQP frontier 8 titik (GMV 0,2966; ujung 100% UNVR 0,5014); perbandingan EW vs GMV vs MS + gap EW 0,0058 + CML 50/50 Sharpe 0,0590.",
      ],
      next: { label: "Lanjut: MLF-M5.4 — Risk Parity & Budgeting Risiko", href: "/v2/learn/mlf-m54-risk-parity-budgeting" },
    },
  ],
};
