import type { V2Lesson } from "../lib/types";

// Fungsi nilai prospect theory (Kahneman-Tversky): bentuk S, titik referensi
// di 0; sisi rugi 2,25x lebih curam dari sisi untung (loss aversion, lambda).
// Sketsa dari v(x) = x^0.88 (x >= 0), v(x) = -2.25*(-x)^0.88 (x < 0).
const PROSPECT_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Fungsi nilai prospect theory: kurva bentuk S, sisi rugi lebih curam 2,25 kali dari sisi untung, titik referensi di nol.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<line x1="40" y1="120" x2="500" y2="120" stroke="var(--chart-text)" stroke-width="1.2"/>
<line x1="260" y1="15" x2="260" y2="235" stroke="var(--chart-text)" stroke-width="1.2"/>
<polyline points="40,224 95,200 150,176 205,151 238,134 260,120 282,114 315,106 370,95 425,84 480,74" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="480" y1="120" x2="480" y2="74" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="40" y1="120" x2="40" y2="224" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="4 3"/>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="240">-100</text><text x="150" y="240">-50</text><text x="260" y="240">0 (referensi)</text><text x="370" y="240">+50</text><text x="480" y="240">+100</text></g>
<text x="62" y="32" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nilai subjektif v(x)</text>
<text x="120" y="190" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" font-weight="600">sisi rugi: cembung + curam</text>
<text x="360" y="60" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" font-weight="600">sisi untung: cekung + landai</text>
<text x="470" y="62" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">untung Rp100 -&gt; v ≈ +57</text>
<text x="48" y="112" font-size="10" fill="var(--text)" font-family="var(--font-ui)">rugi Rp100 -&gt; v ≈ -129</text>
</svg>`;

export const pmc6: V2Lesson = {
  slug: "pm-c6-behavioral",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C6 — Behavioral Finance",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-bu-rina",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp100 juta yang \u2018tidak terasa\u2019",
      prose: [
        "Bu Rina rugi Rp100 juta di saham gorengan \u2014 tetap dipegang (\u2018nanti balik\u2019). Di sisi lain, saham bagus untung Rp20 juta \u2014 langsung dijual (\u2018amankan!\u2019). Setahun kemudian: gorengan \u221280%, yang bagus +200%.",
        "Twist-nya: keduanya adalah keputusan emosional yang sama \u2014 disposition effect: jual pemenang terlalu cepat (takut untung berbalik), pegang pecundang terlalu lama (takut mengakui salah). Otaknya bekerja persis terbalik dari yang menguntungkan: kebalikan dari \u2018potong rugi, biarkan untung\u2019.",
        "Lesson ini tentang mengenali musuh di cermin: bias kognitif (bug perangkat lunak \u2014 bisa di-patch) dan bias emosional (bug perangkat keras \u2014 hanya bisa dikelola dengan sistem).",
      ],
      note: {
        title: "Intuisi: bias tidak terlihat di cermin, terlihat di jurnal",
        body: "Tiga heuristik praktisi behavioral. Pertama, kamu tidak akan “merasa” bias saat mengalaminya — bias terasa seperti akal sehat; itulah kenapa 90% supir merasa di atas rata-rata. Satu-satunya detektor yang andal adalah jejak tertulis: bandingkan alasan yang kamu tulis SEBELUM transaksi dengan hasil sesudahnya; pola “saya bilang hold karena analisis, ternyata karena takut rugi” akan muncul dalam 20–30 transaksi. Kedua, bedakan kesalahan yang mahal dari yang murah: anchoring pada harga beli merugikan ratusan juta (Bu Rina), sedangkan framing pada pilihan reksadana merugikan basis poin — alokasikan energi anti-bias ke keputusan besar (alokasi, timing masuk/keluar), bukan ke perfeksionisme receh. Ketiga, penasihat terbaik bukan yang paling pintar membaca pasar, melainkan yang paling konsisten mencegah kliennya menyabotase diri sendiri — Vanguard mengukurnya: behavioral coaching ≈ 1,5% per tahun, lebih besar dari kebanyakan alpha. Keempat, bias termahal bukan yang eksotis \u2014 melainkan tiga yang membosankan: tidak rebalance, menunda keputusan, dan mengecek terlalu sering; audit ketiganya dulu sebelum mempelajari bias ke-40. Kelima, pasang alarm perilaku: jika kamu membuka aplikasi trading lebih dari tiga kali sehari tanpa rencana transaksi, itu sinyal myopic loss aversion \u2014 tutup aplikasinya, buka IPS-mu.",
      },
      tasks: [],
      reference: "Disposition effect = jual pemenang cepat + pegang pecundang lama.",
    },
    {
      id: "prospect-theory",
      eyebrow: "Langkah 2 · Prospect theory + chart",
      title: "Rugi terasa 2,25× lebih menyakitkan",
      prose: [
        "Prospect theory (Kahneman-Tversky, Nobel 2002): manusia menilai perubahan, bukan level. Fungsi nilai cekung saat untung (diminishing sensitivity \u2192 cepat puas \u2192 jual pemenang) dan cembung saat rugi (risk-seeking \u2192 pegang atau tambah pecundang). Parameternya: λ ≈ 2,25 (rugi 2,25× lebih menyakitkan dari nikmatnya untung setara) dan α, β ≈ 0,88.",
        "Inilah mesin disposition effect. Contoh angkanya: beli A dan B @100. Setahun: A=150 (+50%), B=60 (\u221240%). Investor menjual A (\u2018amankan\u2019) dan memegang B (\u2018nanti balik\u2019). Tahun kedua: A=300, B=20. Hasil aktual: +50 \u2212 40 = +10. Jika rasional (pegang A, jual B di tahun 1): +200 \u2212 40 = +160. Biaya bias: 150 \u2014 keputusan harus forward-looking (prospek ke depan), bukan backward (harga beli = sunk cost!).",
        "Uji di lab: dua skenario dengan expected value SAMA tetapi pilihan manusia berbeda \u2014 itulah bukti asimetrinya.",
        "Cara membaca: sumbu X = untung/rugi relatif terhadap titik referensi (0 = impas, di tengah); sumbu Y = nilai subjektif v(x), seberapa \u201Cterasa\u201D untung/rugi itu. Garis putus-putus membandingkan Rp100 untung vs Rp100 rugi pada jarak yang sama dari titik nol.",
        "Interpretasi: kurva membentuk S. Di kanan (untung) ia cekung dan melandai \u2014 tambahan Rp50 kedua terasa lebih kecil dari Rp50 pertama, sehingga investor cepat puas dan menjual pemenang. Di kiri (rugi) ia cembung dan 2,25× lebih curam \u2014 rugi Rp100 memberi nilai \u2212129, sesakit untung Rp225 \u2014 sehingga investor nekat memegang pecundang demi menghindari realisasi rugi. Inilah mesin disposition effect dalam satu gambar.",
      ],
      figure: {
        svg: PROSPECT_SVG,
        alt: "Fungsi nilai prospect theory berbentuk S: sisi rugi lebih curam 2,25 kali dari sisi untung, titik referensi di nol.",
        caption: "Fungsi nilai prospect theory: cekung saat untung (cepat puas \u2192 jual pemenang), cembung saat rugi (nekat \u2192 pegang pecundang), dan sisi rugi 2,25× lebih curam.",
      },
      formula: String.raw`v(x) = x^{\alpha} \quad (x \geq 0) \qquad v(x) = -\lambda(-x)^{\beta} \quad (x < 0)`,
      formulaNote: "λ ≈ 2,25 (loss aversion); α, β ≈ 0,88 (diminishing sensitivity). Cekung saat untung → risk-averse; cembung saat rugi → risk-seeking.",
      tasks: [
        { id: "t1", text: "Hitung `pasti_u` dan `gamble_u` (skenario untung)" },
        { id: "t2", text: "Hitung `pasti_r` dan `gamble_r` (skenario rugi)" },
        { id: "t3", text: "Tentukan `pilihan_u`, `pilihan_r`, lalu cetak" },
      ],
      expected: "UNTUNG: pilih PASTI (risk-averse)  RUGI: pilih GAMBLE (risk-seeking)",
      hints: [
        "def v(x): return x**ALPHA if x >= 0 else -LAMBDA*(-x)**ALPHA.",
        "Skenario untung: pasti +90 vs 90% dapat +100 (EV sama).",
        "Skenario rugi: pasti −90 vs 90% rugi −100 (EV sama).",
      ],
      code: {
        starter: `# Prospect theory: EV sama, pilihan beda\nLAMBDA, ALPHA = 2.25, 0.88\n\ndef v(x):\n    return x**ALPHA if x >= 0 else -LAMBDA*(-x)**ALPHA\n\n# TULIS KODEMU\npasti_u = \ngamble_u = 0.9*v(100)\npasti_r = \ngamble_r = 0.9*v(-100)\npilihan_u = "PASTI" if pasti_u > gamble_u else "GAMBLE"\npilihan_r = "PASTI" if pasti_r > gamble_r else "GAMBLE"\n\nprint(f"UNTUNG: pasti {pasti_u:.1f} vs gamble {gamble_u:.1f} -> pilih {pilihan_u}")\nprint(f"RUGI  : pasti {pasti_r:.1f} vs gamble {gamble_r:.1f} -> pilih {pilihan_r}")`,
        lockLines: 6,
        solution: `# Prospect theory: EV sama, pilihan beda\nLAMBDA, ALPHA = 2.25, 0.88\n\ndef v(x):\n    return x**ALPHA if x >= 0 else -LAMBDA*(-x)**ALPHA\n\n# TULIS KODEMU\npasti_u = v(90)\ngamble_u = 0.9*v(100)\npasti_r = v(-90)\ngamble_r = 0.9*v(-100)\npilihan_u = "PASTI" if pasti_u > gamble_u else "GAMBLE"\npilihan_r = "PASTI" if pasti_r > gamble_r else "GAMBLE"\n\nprint(f"UNTUNG: pasti {pasti_u:.1f} vs gamble {gamble_u:.1f} -> pilih {pilihan_u}")\nprint(f"RUGI  : pasti {pasti_r:.1f} vs gamble {gamble_r:.1f} -> pilih {pilihan_r}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pasti_u", value: 52.4485, tol: 0.05, label: "`pasti_u` ≈ 52.45", msg: "v(90) = 90^0,88 ≈ 52,45." },
          { kind: "equal", task: "t2", name: "pasti_r", value: -118.0092, tol: 0.05, label: "`pasti_r` ≈ −118.01", msg: "v(−90) = −2,25 × 90^0,88 ≈ −118,01. Rugi terasa jauh lebih sakit." },
          { kind: "equal", task: "t3", name: "pilihan_u", value: "PASTI", label: "Untung → pilih PASTI", msg: "52,45 > 51,79: cekung saat untung → risk-averse → amankan." },
          { kind: "equal", task: "t3", name: "pilihan_r", value: "GAMBLE", label: "Rugi → pilih GAMBLE", msg: "−118,01 < −116,53: cembung saat rugi → risk-seeking → nekat." },
          { kind: "stdout_matches", task: "t3", pattern: "RUGI\\s+:.*pilih GAMBLE", label: "`print` menampilkan pilihan GAMBLE saat rugi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "EV sama, pilihan beda: untung → amankan; rugi → nekat. Itulah disposition effect.",
    },
    {
      id: "bias-kognitif",
      eyebrow: "Langkah 3 · Bias kognitif",
      title: "Bug perangkat lunak: bisa di-patch",
      prose: [
        "Bias kognitif adalah error penalaran \u2014 bisa diperbaiki dengan informasi dan proses. Anchoring: terpaku angka pertama (\u2018dulu Rp10 ribu!\u2019) \u2014 obatnya ganti anchor ke valuasi historis (P/E), bukan harga terakhir. Confirmation: mencari info yang setuju dan mengabaikan yang menentang \u2014 obatnya devil\u2019s advocate (tulis 3 alasan tesismu salah) dan pre-mortem. Hindsight (\u2018sudah kuduga!\u2019), framing (90% selamat vs 10% mati mengubah pilihan), availability (krisis terakhir terasa pasti terulang), representativeness (saham bagus = perusahaan bagus).",
        "Contoh anchoring: beli @1000, kini 600, analis bilang fundamental berubah dan wajar 400. Investor menunggu \u2018balik 1000\u2019 \u2014 jangkarnya harga beli. Biayanya: jika benar ke 400, rugi tambahan 200 dari menunggu jangkar. Harga beli adalah sunk cost \u2014 irrelevan untuk keputusan kini. Pertanyaan yang benar: \u2018apakah aku akan beli di 600 sekarang?\u2019 Jika tidak → jual. Itulah tes cermin.",
        "Aturan analisis: paksa cari 3 alasan tesis ini salah sebelum mengeksekusi. Riset yang hanya mengkonfirmasi bukan riset.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CBias = bodoh; saya rasional, behavioral finance untuk orang lain.\u201D Salah: 90% supir merasa di atas rata-rata \u2014 termasuk kamu. Overconfidence adalah bias yang menyembunyikan bias lain. Semua orang punya bias; yang ada hanyalah yang mengelolanya.",
      },
      reference: "Kognitif → edukasi bisa. Emosional → butuh sistem.",
    },
    {
      id: "bias-emosional",
      eyebrow: "Langkah 4 · Bias emosional",
      title: "Bug perangkat keras: hanya bisa dikelola",
      prose: [
        "Bias emosional berasal dari perasaan \u2014 sulit diedukasi, harus dikelola. Loss aversion (rugi 2× lebih sakit), overconfidence (90% yakin tetapi benar ~50% \u2014 miskalibrasi!), regret aversion (takut salah → tidak bertindak, atau herding agar \u2018salah bersama\u2019), herding (ikut kerumunan terasa aman), status quo, dan endowment (barang sendiri terasa lebih mahal \u2014 padahal pasar tidak peduli).",
        "Overconfidence itu mahal: studi Barber-Odean atas 35.000 akun \u2014 pria trading 45% lebih sering (turnover 77% vs 53%) dan return-nya lebih rendah 1%/tahun. Obatnya: track record tertulis atas semua prediksi, base rate (statistik, bukan feeling), dan devil\u2019s advocate. Keyakinan tanpa kalibrasi = delusi.",
        "Contoh loss aversion: portofolio Rp1 miliar. Pilihan (A) pasti rugi Rp50 juta vs (B) 50% rugi Rp120 juta / 50% rugi 0. Kebanyakan pilih B (risk-seeking saat rugi!) padahal ekspektasi B = \u2212Rp60 juta < A = \u2212Rp50 juta. Jangan berjudi untuk menghindari realisasi rugi \u2014 cut loss adalah rasional.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CBias emosional bisa dihilangkan dengan belajar.\u201D Tidak. Kognitif bisa di-patch dengan data; emosional tetap ada meski kamu tahu (Kahneman: \u2018saya tahu \u2014 tetapi tetap merasakannya!\u2019). Solusi emosional = sistem (otomatisasi), bukan pengetahuan. Jangan lawan ombak; bangun kapal.",
      },
      quiz: [
        {
          q: "\u2018Dulu Rp10 ribu, sekarang Rp6 ribu = murah!\u2019 Bias apa?",
          options: [
            { text: "Herding", why: "Herding = ikut kerumunan; di sini tidak ada kerumunan, yang ada angka masa lalu." },
            { text: "Anchoring (kognitif)", why: "Tepat: terpaku angka masa lalu. Obat: ganti anchor ke valuasi historis (P/E), bukan harga.", correct: true },
            { text: "Loss aversion", why: "Loss aversion = takut rugi; di sini masalahnya patokan harga, bukan rasa sakit rugi." },
            { text: "Overconfidence", why: "Overconfidence = keyakinan berlebih; tidak relevan dengan patokan harga ini." },
          ],
        },
        {
          q: "λ = 2,25 dalam prospect theory artinya?",
          options: [
            { text: "Untung 2,25× lebih nikmat", why: "Salah arah: yang dikalikan 2,25 adalah sisi rugi, bukan untung." },
            { text: "Rugi 2,25× lebih menyakitkan dari untung setara", why: "Tepat: inilah loss aversion \u2014 mesin di balik disposition effect.", correct: true },
            { text: "Risiko selalu 2,25×", why: "Salah: λ bukan pengali risiko, melainkan asimetri nilai psikologis." },
            { text: "Tidak ada artinya", why: "Salah: λ adalah parameter terukur dari ratusan eksperimen." },
          ],
        },
      ],
      reference: "Tes cermin tiap posisi merah: \u2018akan beli kini?\u2019 Tidak → jual.",
    },
    {
      id: "mitigasi",
      eyebrow: "Langkah 5 · Mitigasi",
      title: "Sistem melawan diri sendiri",
      prose: [
        "Prinsipnya: jangan andalkan willpower \u2014 bangun sistem yang benar bahkan saat emosi salah. Seperti Odysseus menghadapi siren: ikat diri ke tiang sebelum mendengar nyanyian. Kognitif diperbaiki (data, checklist, devil\u2019s advocate); emosional dikelola: IPS (aturan tertulis saat tenang), automasi (DCA, rebalance otomatis), cooling-off 72 jam sebelum beli \u2018panas\u2019, pre-commitment (stop-loss otomatis), jurnal keputusan, dan nudge (jadikan yang benar = yang mudah \u2014 auto-enrollment pensiun menaikkan partisipasi 60% → 95%).",
        "Sistem anti-Bu Rina yang ditulis saat tenang: stop-loss −15% otomatis (melawan disposition), ambil untung bertahap +25/+50% (melawan cepat puas), tes cermin tiap posisi merah, cooling-off 72 jam. Hasilnya: gorengan terjual di −15% (rugi Rp15 juta, bukan Rp80 juta); pemenang dipegang bertahap. Sistem > emosi.",
        "Kit anti-bias lima alat untuk setiap investor: IPS tertulis, jurnal (alasan tiap transaksi!), stop-loss otomatis, tes cermin kuartalan, devil\u2019s advocate. Nilai penasihat terbesar justru di sini: behavioral coaching bernilai ~1,5%/tahun (Vanguard) \u2014 coaching > picking.",
      ],
      tasks: [],
      reference: "Aturan 10 detik: kognitif = patch; emosional = kelola. Jurnal semua keputusan. Sistem > tekad.",
    },
    {
      id: "minicase-bu-rina",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Menjelaskan bias tanpa menyinggung",
      prose: [
        "Bu Rina: pegang saham gorengan −Rp100 juta (\u2018nanti balik\u2019, 2 tahun!), jual pemenang +Rp20 juta (\u2018amankan\u2019, 2 bulan!). Setahun: pecundang −80%, pemenang +200%. Nama biasnya: disposition effect (plus endowment effect di pecundang). Mekanismenya: cembung saat rugi → risk-seeking (pegang/tambah); cekung saat untung → risk-averse (jual cepat); λ=2,25 memperkuat keduanya.",
        "Jika tes cermin (\u2018akan beli kini?\u2019) jawabannya tidak untuk keduanya → jual keduanya! Harga beli irrelevan (sunk cost). Keputusan harus forward-looking: pecundang yang tidak akan dibeli → jual; pemenang yang terasa kemahalan → jual bertahap untuk mengunci untung.",
        "Cara menjelaskan tanpa menyinggung, tiga prinsip: normalisasi (\u2018semua orang begitu \u2014 termasuk saya\u2019); sistem, bukan salah (\u2018bukan Ibu yang salah \u2014 otaknya yang begitu; kita akali dengan sistem\u2019); angka (tunjukkan \u2018biaya\u2019 ratusan juta \u2014 fakta lebih kuat dari nasihat). Empati + sistem = perubahan.",
      ],
      tasks: [],
      reference: "Disposition effect = kebalikan dari \u2018potong rugi, biarkan untung\u2019.",
    },

    {
      id: "bias-merusak-alokasi",
      eyebrow: "Langkah 7 · Bias tingkat lanjut",
      title: "Tiga bias yang merusak alokasi \u2014 dengan harga rupiahnya",
      prose: [
        "Loss aversion merusak alokasi lewat dua pintu. Pintu pertama: myopic loss aversion \u2014 investor yang mengecek portofolio harian merasakan \u201Cnyeri\u201D dua kali lebih sering dibanding yang mengecek tahunan, sehingga menuntut premi risiko lebih tinggi dan berakhir di deposito: portofolio Rp1 miliar yang seharusnya 60/40 (E(R) ~9%) menjadi 20/80 (E(R) ~6,5%) \u2014 biaya 2,5 poin per tahun ≈ Rp25 juta per tahun, Rp500 juta+ dalam 20 tahun, hanya karena frekuensi mengecek. Obatnya bukan \u201Cjangan lihat\u201D (tidak realistis), melainkan evaluasi terjadwal: laporan kuartalan dengan rentang yang dinyatakan di muka, bukan harga harian.",
        "Pintu kedua: risk-seeking di wilayah rugi menghancurkan rebalancing. Portofolio 60/40 jatuh menjadi 50/50 setelah koreksi; aturan bilang beli saham (murah). Tetapi loss aversion membuat membeli pecundang terasa seperti \u201Cmenambah luka\u201D \u2014 investor justru menjual \u201Cmembatasi kerusakan\u201D. Hasilnya kebalikan dari rebalancing: jual murah setelah jatuh. Data dana pensiun menunjukkan mayoritas aliran keluar terjadi di kuartal terdalam koreksi. Inilah kenapa rebalancing harus otomatis atau dimandatkan ke komite \u2014 keputusan beli-saat-takut tidak bisa diserahkan ke perasaan.",
        "Anchoring merusak lewat harga beli sebagai jangkar abadi dan lewat benchmark yang salah. Contoh alokasi: investor menjangkarkan \u201CIHSG dulu 7.300\u201D lalu menunda alokasi ekuitas menunggu \u201Ckembali ke 6.500\u201D \u2014 dua tahun menunggu = dua tahun kehilangan premi ekuitas ≈ Rp180 juta dari Rp1 miliar (selisih 9% vs 4% deposito × 2 tahun). Jangkar yang benar: valuasi relatif (P/E, yield gap), bukan level indeks masa lalu. Herding merusak lewat FOMO sektoral: 2021 semua orang menyerbu saham teknologi/EV di valuasi 50× earnings karena \u201Csemua beli\u201D; yang masuk di puncak menanggung drawdown 60\u201380%. Aturan anti-herding: setiap keputusan ikut tren wajib melewati tesis tertulis 1 halaman + cooling-off 72 jam \u2014 kerumunan tidak sabar menunggu 72 jam, dan itu justru filternya.",
      ],
      tasks: [],
      reference: "Cek harian = myopic loss aversion (mahal); jangkar harga = penundaan mahal; ikut tren = butuh tesis + 72 jam.",
    },
    {
      id: "desain-proses-anti-bias",
      eyebrow: "Langkah 8 · Desain proses",
      title: "Arsitektur keputusan yang tahan terhadap dirimu sendiri",
      prose: [
        "Investor individu: bangun \u201Cpabrik keputusan\u201D berlapis. Lapisan 1 \u2014 pra-komitmen tertulis di IPS: alokasi target, band rebalancing ±5%, aturan kontribusi otomatis, dan daftar larangan pribadi (mis. \u201Ctidak beli saham yang naik >30% dalam sebulan tanpa tesis 1 halaman\u201D). Lapisan 2 \u2014 friksi yang disengaja: cooling-off 72 jam untuk setiap pembelian di luar rencana; akun terpisah untuk \u201Cuang main\u201D (maks 5% portofolio) agar FOMO tersalurkan tanpa merusak inti. Lapisan 3 \u2014 review terjadwal: tiap kuartal, bandingkan keputusan aktual vs IPS; tiap tahun, audit jurnal: berapa keputusan yang didorong berita vs didorong rencana? Targetnya: >80% keputusan mengikuti rencana.",
        "Komite investasi institusi butuh desain yang berbeda karena biasnya kolektif: groupthink dan authority bias (bos bicara duluan, semua mengangguk). Protokol yang terbukti: (1) tulis pandangan independen SEBELUM rapat \u2014 tiap anggota mengirim 1 halaman 24 jam sebelumnya; (2) devil\u2019s advocate bergilir dengan mandat resmi \u2014 bukan \u201Cyang suka membantah\u201D, melainkan peran yang dihargai; (3) voting anonim untuk keputusan alokasi besar; (4) pre-mortem wajib untuk setiap perubahan SAA: \u201Cbayangkan 3 tahun lagi keputusan ini gagal total \u2014 apa penyebabnya?\u201D; (5) catat dissent \u2014 siapa tidak setuju dan kenapa \u2014 untuk review tahunan. Komite tanpa protokol adalah herding yang dilembagakan.",
        "Satu metrik untuk mengukur kesehatan proses: hitung \u201Cbehavior gap pribadimu\u201D tiap tahun \u2014 bandingkan return portofoliomu jika mengikuti IPS 100% (simulasi) vs return aktualmu. Selisihnya adalah harga biasmu dalam rupiah. Investor yang gap-nya >2% per tahun selama 3 tahun berturut-turut sebaiknya menyerahkan eksekusi ke automasi penuh (robo-advisor / rebalancing otomatis) dan membatasi dirinya ke keputusan SAA tahunan. Mengakui bahwa sistem harus mengambil alih adalah keputusan paling rasional yang bisa dibuat oleh otak yang bias.",
      ],
      tasks: [],
      reference: "Individu: pra-komitmen + friksi + review. Komite: pandangan tertulis dulu + devil\u2019s advocate + voting anonim + pre-mortem.",
    },

    {
      id: "lab-panic-tax",
      eyebrow: "Langkah 9 · Lab panic tax",
      title: "Harga panik: jual di dasar, beli di rebound",
      prose: [
        "Kuantifikasi myopic loss aversion. Modal Rp100 juta. Pasar jatuh 20% (jadi 80), investor panik JUAL di dasar. Pasar rebound 10% dari dasar (jadi 88) \u2014 ia FOMO dan beli lagi. Akhirnya pasar pulih ke 110. Bandingkan dengan investor disiplin yang hold dari awal. Hitung nilai akhir keduanya dan \u201Cpajak panik\u201D-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `jual` (nilai saat panik jual) dan `beli_lagi` (harga re-entry)" },
        { id: "t2", text: "Hitung `akhir_panik`, `akhir_disiplin`, dan `pajak_panik`" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "akhir_panik=100  akhir_disiplin=110  pajak_panik=10  (Rp juta)",
      hints: [
        "jual = MODAL*(1-DROP); beli_lagi = jual*(1+REBOUND_MASUK).",
        "akhir_panik = (jual/beli_lagi)*TARGET_AKHIR \u2014 unit yang terbeli lebih sedikit.",
        "pajak_panik = akhir_disiplin - akhir_panik.",
      ],
      code: {
        starter: `# Panic tax (Rp juta)\nMODAL = 100\nDROP = 0.20          # pasar jatuh 20%\nREBOUND_MASUK = 0.10  # beli lagi setelah rebound 10% dari dasar\nTARGET_AKHIR = 110    # pasar akhirnya di 110\n\n# TULIS KODEMU\njual = \nbeli_lagi = \nakhir_panik = \nakhir_disiplin = TARGET_AKHIR\npajak_panik = \n\nprint(f"akhir_panik={akhir_panik:.0f}  akhir_disiplin={akhir_disiplin:.0f}  pajak_panik={pajak_panik:.0f}")`,
        lockLines: 4,
        solution: `# Panic tax (Rp juta)\nMODAL = 100\nDROP = 0.20          # pasar jatuh 20%\nREBOUND_MASUK = 0.10  # beli lagi setelah rebound 10% dari dasar\nTARGET_AKHIR = 110    # pasar akhirnya di 110\n\n# TULIS KODEMU\njual = MODAL*(1-DROP)\nbeli_lagi = jual*(1+REBOUND_MASUK)\nakhir_panik = (jual/beli_lagi)*TARGET_AKHIR\nakhir_disiplin = TARGET_AKHIR\npajak_panik = akhir_disiplin - akhir_panik\n\nprint(f"akhir_panik={akhir_panik:.0f}  akhir_disiplin={akhir_disiplin:.0f}  pajak_panik={pajak_panik:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "jual", value: 80, tol: 1e-9, label: "`jual` = 80", msg: "100 × (1−0,20) = 80. Jual di dasar mengunci kerugian." },
          { kind: "equal", task: "t1", name: "beli_lagi", value: 88, tol: 1e-9, label: "`beli_lagi` = 88", msg: "80 × 1,10 = 88. FOMO membeli lebih mahal dari harga jual." },
          { kind: "equal", task: "t2", name: "akhir_panik", value: 100, tol: 1e-9, label: "`akhir_panik` = 100", msg: "(80/88) × 110 = 100. Unit lebih sedikit → tertinggal." },
          { kind: "equal", task: "t2", name: "pajak_panik", value: 10, tol: 1e-9, label: "`pajak_panik` = 10", msg: "110 − 100 = 10. 10% modal hilang untuk dua keputusan emosional." },
          { kind: "stdout_matches", task: "t3", pattern: "akhir_panik=100\\s+akhir_disiplin=110\\s+pajak_panik=10", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Jual di dasar + beli di rebound = pajak 10% untuk dua emosi.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Empat pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Prospect theory: λ ≈ 2,25; cekung saat untung (jual cepat), cembung saat rugi (pegang nekat) → disposition effect.",
        "Bias kognitif (anchoring, confirmation, overconfidence) bisa diedukasi; bias emosional (loss aversion, regret, herding) hanya bisa dikelola via sistem.",
        "Tes cermin: \u2018akan beli di harga ini kini?\u2019 Tidak → jual. Harga beli = sunk cost.",
        "Mitigasi: IPS tertulis, jurnal, stop-loss otomatis, cooling-off 72 jam, automasi, nudge \u2014 sistem > tekad.",
        "Behavioral finance untuk pertahanan (tidak merugikan diri), bukan penyerangan (sok mengalahkan pasar).",
      ],
      next: { label: "C7 \u2014 Fixed Income Portfolio", href: "/v2/learn/pm-c7-fixed-income-portfolio" },
      quiz: [
        {
          q: "Portofolio Rp1M: seharusnya 60/40 (E(R) 9%) tetapi karena takut gejolak jadi 20/80 (E(R) 6,5%). Ini contoh?",
          options: [
            { text: "Alokasi rasional \u2014 sesuai risk tolerance", why: "Salah jika penyebabnya frekuensi mengecek harian: itu myopic loss aversion, bukan risk tolerance yang jujur." },
            { text: "Myopic loss aversion \u2014 biaya ~Rp25 jt/thn dari frekuensi evaluasi", why: "Tepat: cek harian menggandakan \u2018nyeri\u2019; evaluasi terjadwal kuartalan mengobatinya.", correct: true },
            { text: "Herding", why: "Salah: tidak ada kerumunan di sini \u2014 ini soal horizon evaluasi pribadi." },
            { text: "Anchoring", why: "Salah: tidak ada patokan harga masa lalu yang dipakai." },
          ],
        },
        {
          q: "Komite investasi selalu setuju dengan usulan ketua. Protokol anti-bias yang paling tepat?",
          options: [
            { text: "Rapat lebih sering", why: "Salah: frekuensi tidak memperbaiki groupthink \u2014 justru melanggengkannya." },
            { text: "Pandangan tertulis independen sebelum rapat + devil\u2019s advocate bergilir + voting anonim", why: "Tepat: memutus authority bias dan groupthink secara struktural.", correct: true },
            { text: "Ganti semua anggota komite", why: "Salah: biasnya struktural (proses), bukan personal." },
            { text: "Serahkan semua ke ketua saja", why: "Salah: itu justru memusatkan authority bias." },
          ],
        },
        {
          q: "Saat rugi, orang cenderung bersikap?",
          options: [
            { text: "Risk-averse", why: "Salah: risk-averse terjadi di wilayah untung (cekung)." },
            { text: "Risk-seeking (pegang/tambah pecundang)", why: "Tepat: fungsi nilai cembung di wilayah rugi → nekat. Inilah mesin disposition effect.", correct: true },
            { text: "Netral", why: "Salah: manusia tidak netral \u2014 asimetri λ=2,25 membuatnya sistematis bias." },
            { text: "Jual semua", why: "Salah: justru sebaliknya \u2014 orang enggan merealisasi rugi." },
          ],
        },
        {
          q: "Bias emosional paling tepat diatasi dengan?",
          options: [
            { text: "Belajar lebih giat", why: "Salah: pengetahuan tidak menghilangkan loss aversion \u2014 hanya bias kognitif yang bisa di-patch." },
            { text: "Sistem: IPS + automasi + pre-commitment", why: "Tepat: tiang Odysseus \u2014 aturan ditulis saat tenang, dijalankan saat emosi.", correct: true },
            { text: "Willpower yang kuat", why: "Salah: tekad habis saat emosi memuncak; sistem jalan otomatis." },
            { text: "Mengabaikannya", why: "Salah: mengabaikan bias = membiarkannya bekerja diam-diam." },
          ],
        },
        {
          q: "\u2018Semua analis bilang beli, ikut saja.\u2019 Bias apa?",
          options: [
            { text: "Confirmation", why: "Confirmation = mencari info yang setuju; di sini masalahnya ikut kerumunan." },
            { text: "Herding (emosional)", why: "Tepat: ikut kerumunan terasa aman. Obat: tesis independen tertulis sebelum lihat konsensus.", correct: true },
            { text: "Framing", why: "Framing = kemasan mengubah pilihan; tidak relevan di sini." },
            { text: "Hindsight", why: "Hindsight = \u2018sudah kuduga\u2019 setelah kejadian; tidak relevan." },
          ],
        },
        {
          q: "Bu Rina pegang −Rp100jt (\u2018nanti balik\u2019), jual +Rp20jt (\u2018amankan\u2019). Tes cermin = \u2018tidak akan beli\u2019 untuk keduanya. Tindakan?",
          options: [
            { text: "Pegang keduanya \u2014 nanti balik", why: "Salah: itu disposition effect yang sedang bekerja \u2014 persis yang harus dilawan." },
            { text: "Jual keduanya \u2014 harga beli = sunk cost; keputusan forward-looking", why: "Tepat: tes cermin memaksa keputusan kini, bukan masa lalu.", correct: true },
            { text: "Pegang pemenang, jual pecundang", why: "Setengah benar untuk pecundang, tetapi pemenang yang tidak akan dibeli kini sebaiknya dijual bertahap." },
            { text: "Tambah pecundang \u2014 averaging down", why: "Salah: menambah pecundang yang tidak akan dibeli kini = risk-seeking buta." },
          ],
        },
      ],
    },
  ],
};
