import type { V2Lesson } from "../lib/types";

const FIG_ICEBERG = `<svg viewBox="0 0 480 300" role="img" aria-label="Gunung es kerugian fraud.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Gunung es kerugian fraud</text>
<polygon points="240,70 150,160 330,160" fill="var(--c1)" opacity="0.55" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="115" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Direct loss</text>
<text x="240" y="132" font-size="10" fill="var(--chart-text)" text-anchor="middle">yang terlihat</text>
<polygon points="240,160 110,160 170,270 310,270 370,160" fill="var(--c4)" opacity="0.35" stroke="var(--c4)" stroke-width="2"/>
<text x="240" y="200" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Biaya operasi</text>
<text x="240" y="216" font-size="10" fill="var(--chart-text)" text-anchor="middle">tim, tool, investigasi</text>
<text x="240" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">False positive</text>
<text x="240" y="256" font-size="10" fill="var(--chart-text)" text-anchor="middle">transaksi sah ditolak</text>
<line x1="20" y1="160" x2="460" y2="160" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="440" y="152" font-size="10" fill="var(--text-muted)" text-anchor="end">permukaan</text>
<text x="240" y="292" font-size="11" fill="var(--chart-text)" text-anchor="middle">Studi LexisNexis 2026: total biaya &gt; $5 untuk tiap $1 kerugian langsung.</text>
</g>
</svg>`;

export const fr24: V2Lesson = {
  slug: "fr24-fraud-loss-reporting-roi",
  track: "Fraud & AML Analytics",
  module: "Pelaporan Fraud",
  title: "FR24 — Fraud Loss Reporting: Menghitung ROI Pencegahan ke Manajemen",
  estMinutes: 53,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rapat yang mengubah cara melaporkan fraud",
      prose: [
        "Dimas, analis fraud di PayKita, berdiri di depan CFO dengan slide penuh kebanggaan: 'Bulan ini tim kami memblokir 1.842 transaksi fraud senilai Rp4,2 miliar.' Ia menunggu tepuk tangan. Yang datang justru pertanyaan dingin: 'Biaya tim dan tool-mu Rp1,1 miliar tahun ini. Dan angka Rp4,2 miliar itu — bagaimana saya tahu bukan angka yang kamu karang?'",
        "Twist-nya: CFO tidak peduli berapa banyak fraud yang diblokir. Ia peduli SATU angka: untuk setiap Rp1 yang perusahaan belanjakan untuk pencegahan, berapa Rp yang kembali. Studi LexisNexis True Cost of Fraud 2026 menemukan total biaya fraud melampaui $5 untuk setiap $1 kerugian langsung — artinya yang hilang bukan cuma uang yang dicuri, melainkan gunung es di bawahnya: biaya investigasi, fee chargeback, nasabah bagus yang ditolak lalu kabur, dan reputasi. Dimas melaporkan puncak gunung es; CFO menagih seluruh gunungnya.",
        "Masalah Dimas lebih dalam: 'Rp4,2 miliar yang dicegah' adalah klaim tanpa metodologi. Berapa yang benar-benar fraud (bukan false positive)? Berapa yang sebenarnya bisa dipulihkan? Tanpa taksonomi yang disepakati, angka prevented loss = angka karangan yang sopan. Lesson ini memperbaiki itu: setelah selesai kamu bisa (1) memetakan taksonomi kerugian fraud — direct, recovery, operasional, opportunity; (2) menghitung loss rate dalam bps, net loss, dan prevented loss yang jujur; (3) menghitung ROI program pencegahan dengan angka konkret; (4) menyusun one-pager laporan ke manajemen yang tahan interogasi CFO.",
        "Dua bekal dari track ini, diringkas cepat. FR1 memetakan lanskap fraud: jenis-jenis fraud yang umum (account takeover, phishing, money mule), motif pelaku, dan segitiga fraud — tekanan, kesempatan, rasionalisasi — yang menjelaskan mengapa fraud terus muncul. FR14 membahas case management: alur kerja dari alert menjadi kasus — triage, investigasi, keputusan fraud atau bukan, sampai penutupan dengan dokumentasi yang bisa diaudit. Lesson ini mengambil alur itu sebagai input dan fokus ke ujungnya: mengukur kerugian yang terjadi dan mempertahankannya di depan manajemen.",
        "Satu prinsip yang memandu seluruh lesson: setiap angka yang kamu laporkan harus bisa dilacak ke definisi dan datanya. CFO tidak menyerang orang yang angkanya bisa dipertanggungjawabkan — ia menyerang angka yang tidak bisa dijelaskan. Metodologi = tamengmu.",
        "Latihan pembuka sebelum lanjut: tulis di kertas satu kalimat — 'berapa kerugian fraud perusahaanmu bulan lalu?' Jika jawabanmu hanya satu angka tanpa definisi, kamu persis seperti Dimas di slide pertama. Di akhir lesson, kalimat itu akan berubah menjadi laporan lengkap.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke karir",
        type: "risk",
        body: "Analis fraud yang bisa bicara bahasa CFO (ROI, bps, payback) naik kelas dari 'penjaga gerbang' menjadi 'mitra bisnis'. Di wawancara kerja fraud analyst (termasuk standar job description bank-bank besar), kemampuan menyusun fraud loss report adalah pembeda utama — bukan sekadar bisa menjalankan model.",
      },
      reference: "CFO menagih ROI, bukan jumlah blokir. Metodologi = tamengmu.",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Gunung es: taksonomi kerugian fraud",
      prose: [
        "Kerugian fraud punya empat lapis. Lapis 1, direct loss: uang yang benar-benar hilang ke pelaku — gross fraud loss. Sebagian bisa kembali lewat chargeback reversal, asuransi, atau penangkapan pelaku: itu recovery. Gross dikurangi recovery = net loss, angka kerugian 'bersih' yang masuk laporan keuangan.",
        "Lapis 2, biaya operasional: semua yang dibayar untuk mencegah, mendeteksi, dan menginvestigasi. Gaji analis, lisensi tool deteksi, vendor data, biaya tim chargeback, sampai jam kerja legal. Banyak tim fraud 'lupa' memasukkan lapis ini ke laporan — padahal CFO menghitungnya sebagai bagian dari harga program.",
        "Lapis 3, biaya opportunity: kerugian yang tidak tercatat di mana-mana tetapi nyata. False positive — transaksi sah yang ditolak sistem — berarti margin yang hilang hari itu plus nasabah yang kecewa dan pindah ke kompetitor. Friksi berlebih (step-up authentication untuk semua orang) menekan konversi. Inilah bagian gunung es yang paling besar dan paling sering diabaikan.",
        "Lapis 4, biaya reputasi dan regulasi: denda, gugatan, liputan media. Sulit diukur presisi, tetapi wajib disebut di laporan — tulis sebagai catatan kualitatif bila tidak bisa dikuantifikasi, bukan dihilangkan.",
        "Cara membaca gambar gunung es di atas: segitiga kecil di atas garis permukaan = direct loss, satu-satunya yang terlihat di dashboard. Badan besar di bawah permukaan = biaya operasi dan false positive — biasanya 3-5x lipat direct loss (lihat angka LexisNexis di caption). Interpretasi: tim yang hanya melaporkan direct loss sedang melaporkan kurang dari seperempat masalah sebenarnya — dan kehilangan kredibilitas saat CFO menemukan sisanya sendiri.",
        "Untuk membandingkan antar periode dan antar perusahaan, industri memakai loss rate dalam basis poin (bps). Rumus di bawah ini adalah bahasa universal pelaporan fraud: 1 bps = 0,01% = Rp1 per Rp10.000 transaksi.",
      ],
      figure: {
        svg: FIG_ICEBERG,
        alt: "Gunung es kerugian fraud.",
        caption: "Cara membaca: segitiga atas = direct loss yang terlihat; badan bawah = biaya operasi + false positive yang tersembunyi. Interpretasi: total biaya fraud biasanya 3-5x direct loss.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKerugian fraud bulan ini Rp1,6 miliar\u201D — angka gross tanpa recovery, tanpa biaya operasi, tanpa false positive. Itu bukan laporan, itu setengah laporan. Aturan: setiap angka kerugian wajib ditemani definisinya — gross atau net? Sudah dikurangi recovery? Termasuk biaya operasi?",
      },
      hints: [
        "Hafalkan urutan: gross \u2192 recovery \u2192 net \u2192 + operasi \u2192 + false positive = true cost.",
        "bps membuat angka kecil terlihat serius: 15 bps terdengar lebih analitis dari 0,015%.",
      ],
      formula: String.raw`\text{Loss rate (bps)} = \frac{\text{Fraud loss (net)}}{\text{Volume transaksi}} \times 10000`,
      formulaNote: "Fraud loss (net) = kerugian bersih periode itu dalam Rp (gross dikurangi recovery). Volume transaksi = total nilai transaksi periode itu dalam Rp (sah + fraud). \u00D7 10000 = konversi ke basis poin. Contoh: net loss Rp1,2 miliar / volume Rp800 miliar \u00D7 10000 = 15 bps. Interpretasi: setiap Rp10.000 transaksi, Rp1,50 hilang karena fraud \u2014 angka ini yang dibandingkan antar bulan dan antar peer.",
      reference: "Gross \u2212 recovery = net. True cost = net + operasi + false positive.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 3 · Konsep",
      title: "Metrik yang bisa berbohong",
      prose: [
        "Lima metrik wajib ada di laporan fraud. Detected loss: fraud yang terdeteksi (sebagian lolos). Attempted loss: total nilai percobaan fraud termasuk yang diblokir. Prevented loss: nilai yang berhasil dicegah = attempted yang diblokir dan TERKONFIRMASI fraud. Recovery rate = recovery / gross loss. False positive rate & cost: proporsi dan biaya transaksi sah yang ditolak.",
        "Metrik paling berbahaya adalah prevented loss — karena paling mudah digelembungkan. Tiga cara prevented loss menjadi bohong. Satu: threshold terlalu agresif — sistem memblokir 10.000 transaksi, 9.000 di antaranya sah, lalu tim mengklaim 'mencegah Rp50 miliar'. Dua: double counting — satu percobaan fraud dihitung di rule-based dan di model ML sekaligus. Tiga: tanpa verifikasi — transaksi diblokir tetapi tidak pernah dikonfirmasi benar-benar fraud.",
        "Aturan jujur untuk prevented loss: hanya hitung yang (a) diblokir, (b) dikonfirmasi fraud lewat investigasi atau pola yang terbukti, dan (c) dikurangi nilai false positive yang terbukti sah. Prevented NET = prevented gross \u2212 biaya false positive. Angka net inilah yang masuk perhitungan ROI — bukan angka gross yang menggiurkan.",
        "Recovery rate bercerita tentang kualitas proses pasca-kejadian. Recovery 40% dari gross loss Rp1,6 miliar = Rp640 juta kembali — bagus, tetapi biaya investigasi untuk mendapatkan kembali Rp640 juta itu (jam analis, fee legal, biaya chargeback) tetap harus dicatat di lapis biaya operasional. Recovery tinggi tidak menghapus biaya; ia hanya mengurangi net loss.",
        "Dua miskonsepsi. Satu: 'Prevented loss Rp50 miliar = tim hebat.' Belum tentu — cek false positive rate-nya. Tim yang memblokir segalanya 'mencegah' segalanya, tetapi membunuh bisnis. Dua: 'Recovery 90%, jadi tidak ada masalah.' Recovery 90% dengan biaya investigasi 80% dari yang dipulihkan = operasi yang tidak efisien. Selalu pasangkan metrik hasil dengan metrik biayanya.",
        "Satu metrik yang sering dilupakan: time-to-detect — berapa lama dari transaksi fraud sampai terdeteksi. Fraud yang terdeteksi dalam 1 jam bisa dipulihkan; yang terdeteksi 30 hari kemudian hampir pasti hilang. Time-to-detect yang membaik = prevented loss yang naik tanpa menambah false positive. Ini metrik kualitas yang disukai manajemen karena menunjukkan perbaikan proses, bukan sekadar angka besar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CModel baru kami mencegah Rp50 miliar!\u201D \u2014 tanpa menyebut false positive rate naik dari 0,3% ke 2,1%. Kenaikan 1,8 poin pada volume Rp800 miliar = Rp14,4 miliar transaksi sah yang diganggu. Klaim prevented tanpa konteks false positive = klaim yang menyesatkan, dan CFO yang cermat akan menemukannya.",
      },
      hints: [
        "Selalu laporkan prevented dalam pasangan: prevented gross DAN prevented net (setelah dikurangi biaya false positive).",
        "Time-to-detect adalah metrik kualitas yang paling jujur \u2014 sulit dimanipulasi, mudah diverifikasi.",
        "Buat definisi metrik tertulis sekali, pakai selamanya \u2014 konsistensi definisi = kredibilitas antar kuartal.",
      ],
      reference: "Prevented NET = gross \u2212 biaya false positive. Pasangkan hasil dengan biaya.",
    },
    {
      id: "roi",
      eyebrow: "Langkah 4 · Konsep",
      title: "ROI: bahasa yang dimengerti CFO",
      prose: [
        "ROI program pencegahan menjawab pertanyaan CFO dengan satu angka: untuk setiap Rp1 yang dibelanjakan, berapa yang kembali. Pembilangnya = prevented loss NET (sudah dikurangi biaya false positive — lihat langkah 3). Penyebutnya = total biaya program: gaji tim + tool + vendor + biaya operasional investigasi. Tanpa pembilang yang jujur dan penyebut yang lengkap, ROI = fiksi.",
        "Contoh konkret PayKita. Biaya program setahun: tim 6 analis Rp600 juta + lisensi tool deteksi Rp400 juta = Rp1,0 miliar. Prevented loss NET setahun: Rp4,2 miliar. ROI = (4,2 \u2212 1,0) / 1,0 \u00D7 100% = 320%. Interpretasi: setiap Rp1 yang dikeluarkan kembali Rp3,2 dalam bentuk kerugian yang dicegah — program ini menghasilkan, bukan membebani. Di bawah 0% = program merugi; 0-100% = impas sampai lumayan; di atas 100% = investasi yang sehat.",
        "Keputusan investasi berikutnya memakai ROI MARGINAL, bukan ROI rata-rata. PayKita mempertimbangkan 1 analis tambahan: biaya Rp180 juta/tahun, diproyeksi mencegah tambahan Rp450 juta (berdasarkan produktivitas analis existing). ROI marginal = (450 \u2212 180) / 180 = 150%. Karena di atas hurdle rate perusahaan (100%), investasi lolos. Pelajaran: program dengan ROI rata-rata 320% belum tentu layak diperluas — yang menentukan adalah ROI rupiah berikutnya, yang selalu lebih kecil dari rata-rata.",
        "Payback period melengkapi cerita: biaya Rp1,0 miliar / prevented per bulan Rp350 juta \u2248 3 bulan. Artinya program 'balik modal' tiap kuartal — angka yang menenangkan CFO yang khawatir dengan cash flow. Sajikan ROI tahunan + payback bulanan sebagai pasangan: satu untuk profitabilitas, satu untuk likuiditas keputusan.",
        "Struktur one-pager ke manajemen yang terbukti tahan interogasi. Baris atas: 4 KPI — loss rate (bps), net loss, prevented NET, ROI. Tengah: tren 6 bulan dalam satu grafik garis (loss rate + prevented). Bawah: 3 rekomendasi, masing-masing dengan angka — 'tambah 1 analis (Rp180 jt) \u2192 prevented +Rp450 jt, ROI marginal 150%'. Satu halaman, tidak lebih. CFO membaca 30 detik; jika ia harus membalik halaman, kamu kalah.",
        "Dua miskonsepsi. Satu: 'ROI tinggi berarti tambah anggaran terus.' ROI marginal menurun — analis ke-7 tidak seproduktif analis pertama karena kasus termudah sudah ditangani. Berhenti di titik ROI marginal = hurdle rate. Dua: 'Program fraud tidak bisa di-ROI-kan karena manfaatnya pencegahan.' Justru bisa — dengan prevented NET yang terdefinisi dan biaya program yang lengkap. Yang tidak bisa di-ROI-kan hanyalah program yang metriknya tidak jujur.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Masukkan biaya false positive ke dalam 'biaya program' di penyebut ROI. Tim yang agresif memblokir terlihat hebat di prevented gross, tetapi ROI-nya anjlok begitu biaya false positive dihitung jujur \u2014 dan justru itulah ROI yang benar. Kejujuran yang menyakitkan hari ini = kredibilitas permanen.",
      },
      hints: [
        "ROI rata-rata untuk membela program existing; ROI marginal untuk memutuskan ekspansi.",
        "Selalu cantumkan asumsi di kaki one-pager: definisi prevented, periode, dan apa yang TIDAK termasuk.",
      ],
      formula: String.raw`\text{ROI} = \frac{\text{Prevented loss (net)} - \text{Biaya program}}{\text{Biaya program}} \times 100\%`,
      formulaNote: "Prevented loss (net) = nilai fraud yang dicegah dan terkonfirmasi, dikurangi biaya false positive, dalam Rp per periode. Biaya program = total biaya pencegahan periode itu (gaji tim + tool + vendor + operasi investigasi) dalam Rp. Contoh: (4,2 M \u2212 1,0 M) / 1,0 M \u00D7 100% = 320%. Interpretasi: tiap Rp1 biaya menghasilkan Rp3,2 kerugian yang dicegah. ROI marginal memakai angka TAMBAHAN (delta prevented / delta biaya) untuk keputusan investasi berikutnya.",
      reference: "ROI = (prevented NET \u2212 biaya) / biaya. Keputusan ekspansi pakai ROI marginal.",
    },
    {
      id: "lab-loss",
      eyebrow: "Langkah 5 · Lab",
      title: "Dari angka mentah ke loss rate",
      prose: [
        "Data bulan Januari PayKita (Rp miliar): volume transaksi 800; gross fraud loss 1,6; recovery 0,4; biaya operasi 0,35; biaya false positive 0,5. Hitung tiga angka laporan: net loss, true cost (net + operasi + false positive), dan loss rate dalam bps.",
        "Perhatikan: true cost = 1,2 + 0,35 + 0,5 = Rp2,05 miliar — 71% lebih besar dari gross loss Rp1,6 miliar yang biasa dilaporkan. Inilah gunung es dalam angka. Eksperimen: naikkan biaya false positive menjadi 1,5 — berapa true cost-nya? Pada titik berapa biaya false positive melampaui net loss-nya sendiri?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net_loss`, `true_cost`, dan `loss_rate_bps`" },
        { id: "t2", text: "Cetak ketiganya dengan format contoh" },
      ],
      expected: "Net loss: Rp1.20 M\nTrue cost: Rp2.05 M\nLoss rate: 15.0 bps",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Tiga baris hitungan ini = inti one-pager. Kuasai sampai bisa menghitungnya di kepala saat CFO bertanya mendadak di lift.",
      },
      hints: [
        "net = gross \u2212 recovery.",
        "true cost = net + operasi + false positive.",
        "bps = net / volume \u00D7 10000.",
      ],
      code: {
        starter: "# (Rp miliar). JANGAN UBAH.\nvolume, gross, recovery = 800, 1.6, 0.4\nbiaya_ops, biaya_fp = 0.35, 0.5\n\n# TULIS KODEMU: net loss, true cost, loss rate (bps)\nnet_loss = \ntrue_cost = \nloss_rate_bps = \nprint(f\"Net loss: Rp{net_loss:.2f} M\")\nprint(f\"True cost: Rp{true_cost:.2f} M\")\nprint(f\"Loss rate: {loss_rate_bps:.1f} bps\")\n",
        lockLines: 7,
        solution: "# (Rp miliar). JANGAN UBAH.\nvolume, gross, recovery = 800, 1.6, 0.4\nbiaya_ops, biaya_fp = 0.35, 0.5\n\n# TULIS KODEMU: net loss, true cost, loss rate (bps)\nnet_loss = gross - recovery\ntrue_cost = net_loss + biaya_ops + biaya_fp\nloss_rate_bps = net_loss / volume * 10000\nprint(f\"Net loss: Rp{net_loss:.2f} M\")\nprint(f\"True cost: Rp{true_cost:.2f} M\")\nprint(f\"Loss rate: {loss_rate_bps:.1f} bps\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Net loss 1.2", msg: "gross \u2212 recovery.", name: "net_loss", value: 1.2, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "True cost 2.05", msg: "net + operasi + false positive.", name: "true_cost", value: 2.05, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "Loss rate 15 bps", msg: "net / volume \u00D7 10000.", name: "loss_rate_bps", value: 15.0, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "Cetak 3 baris", msg: "Cetak net, true cost, loss rate.", pattern: "Net loss: Rp1.20 M" },
        ],
      },
      reference: "net = gross \u2212 recovery. true = net + ops + FP. bps = net/volume \u00D7 10000.",
    },
    {
      id: "lab-roi",
      eyebrow: "Langkah 6 · Lab",
      title: "Keputusan investasi anti-fraud",
      prose: [
        "Program existing: biaya Rp1,0 M/tahun, prevented NET Rp4,2 M/tahun. Opsi ekspansi: +1 analis seharga Rp0,18 M/tahun, diproyeksi menambah prevented Rp0,45 M/tahun. Hurdle rate perusahaan 100%. Hitung ROI program dan ROI marginal, lalu cetak rekomendasi: INVESTASI bila ROI marginal \u2265 hurdle, TUNDA bila di bawah.",
        "Hasil: ROI 320%, ROI marginal 150% \u2192 INVESTASI. Eksperimen: turunkan proyeksi tambahan prevented menjadi Rp0,15 M — ROI marginal jadi \u22125,6% \u2192 TUNDA. Satu angka proyeksi mengubah keputusan; inilah mengapa asumsi prevented harus ditulis eksplisit di one-pager.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `roi` (%) dan `roi_marginal` (%)" },
        { id: "t2", text: "Tentukan `rekomendasi` dan cetak semuanya" },
      ],
      expected: "ROI program: 320.0%\nROI marginal: 150.0%\nRekomendasi: INVESTASI",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Pisahkan keputusan 'pertahankan program' (ROI rata-rata) dari 'tambah investasi' (ROI marginal). Kebanyakan tim mencampuradukkan keduanya \u2014 dan CFO langsung menciumnya.",
      },
      hints: [
        "ROI = (prevented \u2212 biaya) / biaya \u00D7 100.",
        "Marginal memakai angka TAMBAHAN (delta).",
        "Bandingkan dengan hurdle untuk rekomendasi.",
      ],
      code: {
        starter: "# (Rp miliar/tahun). JANGAN UBAH.\nbiaya, prevented = 1.0, 4.2\nd_biaya, d_prevented = 0.18, 0.45\nhurdle = 100.0\n\n# TULIS KODEMU: ROI program, ROI marginal, rekomendasi\nroi = \nroi_marginal = \nrekomendasi = \nprint(f\"ROI program: {roi:.1f}%\")\nprint(f\"ROI marginal: {roi_marginal:.1f}%\")\nprint(f\"Rekomendasi: {rekomendasi}\")\n",
        lockLines: 8,
        solution: "# (Rp miliar/tahun). JANGAN UBAH.\nbiaya, prevented = 1.0, 4.2\nd_biaya, d_prevented = 0.18, 0.45\nhurdle = 100.0\n\n# TULIS KODEMU: ROI program, ROI marginal, rekomendasi\nroi = (prevented - biaya) / biaya * 100\nroi_marginal = (d_prevented - d_biaya) / d_biaya * 100\nrekomendasi = \"INVESTASI\" if roi_marginal >= hurdle else \"TUNDA\"\nprint(f\"ROI program: {roi:.1f}%\")\nprint(f\"ROI marginal: {roi_marginal:.1f}%\")\nprint(f\"Rekomendasi: {rekomendasi}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "ROI 320", msg: "(4,2\u22121,0)/1,0 \u00D7 100.", name: "roi", value: 320.0, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "ROI marginal 150", msg: "(0,45\u22120,18)/0,18 \u00D7 100.", name: "roi_marginal", value: 150.0, tol: 1e-9 },
          { kind: "equal", task: "t2", label: "Rekomendasi INVESTASI", msg: "150 \u2265 hurdle 100.", name: "rekomendasi", value: "INVESTASI" },
          { kind: "stdout_matches", task: "t2", label: "Cetak rekomendasi", msg: "Cetak baris rekomendasi.", pattern: "Rekomendasi: INVESTASI" },
        ],
      },
      reference: "ROI rata-rata = bela program. ROI marginal vs hurdle = putuskan ekspansi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Lima skenario, lima respons",
      prose: [
        "Satu: ROI tinggi (>100%), false positive rendah (<0,5%) \u2192 EXPAND. Program sehat dan tidak menyakiti nasabah; ajukan penambahan anggaran dengan ROI marginal sebagai justifikasi. Dua: ROI tinggi, false positive tinggi (>1%) \u2192 TUNE, jangan expand. Perketat threshold dan perbaiki model dulu; ekspansi di atas fondasi bocor = memperbesar luka.",
        "Tiga: ROI negatif \u2192 REDESIGN atau SUNSET. Opsi: ganti vendor tool, pindahkan ke rule-based sederhana untuk segmen tertentu, atau alihkan anggaran ke segmen fraud dengan ROI lebih baik. Program yang dipertahankan karena 'sayang sudah investasi' = sunk cost fallacy dengan anggaran perusahaan.",
        "Empat: loss rate naik 3 bulan beruntun sementara volume flat \u2192 DRIFT CHECK. Kemungkinan: pola fraud baru yang belum tertangkap model, atau data drift. Jangan langsung minta anggaran lebih — diagnosis dulu, karena menambah analis tidak memperbaiki model yang usang.",
        "Lima: prevented loss naik tetapi net loss ikut naik \u2192 AUDIT KUALITAS. Sinyal klasik prevented yang digelembungkan: blokir agresif menaikkan prevented gross, tetapi fraud yang benar-benar lolos (net loss) tidak turun. Verifikasi sampel blokir secara manual sebelum merayakan.",
        "Aturan praktis 10 detik: cek ROI \u2192 cek false positive \u2192 cek tren loss rate \u2192 putuskan expand / tune / redesign. Urutan ini mencegah kesalahan paling mahal: menambah anggaran untuk program yang sebenarnya butuh diperbaiki, bukan diperbesar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dokumentasikan setiap keputusan expand/tune/sunset beserta angkanya. Saat audit internal atau regulator bertanya \u2018mengapa anggaran fraud naik 40%?\u2019, jawaban \u2018ROI marginal 150%, ini hitungannya\u2019 menutup diskusi dalam 1 menit.",
      },
      reference: "ROI \u2192 FP \u2192 tren loss rate \u2192 expand / tune / redesign.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "PayKita Q3: presentasi ke CFO",
      prose: [
        "Data kuartal 3 PayKita (Rp miliar): volume transaksi 2.400; gross fraud loss 6,0; recovery 1,8; biaya operasi 1,2; biaya false positive 1,5; prevented NET 18,0; biaya program 4,5. Dimas harus presentasi 5 menit ke CFO besok pagi.",
        "Pertanyaan: (a) Hitung net loss, true cost, dan loss rate (bps). (b) Hitung ROI program. (c) Susun 3 baris rekomendasi untuk one-pager: apakah program layak dipertahankan? Apakah layak diekspansi, dan dengan syarat apa? Pembahasan: (a) net = 6,0 \u2212 1,8 = 4,2; true cost = 4,2 + 1,2 + 1,5 = 6,9 (65% di atas gross!); loss rate = 4,2/2400 \u00D7 10000 = 17,5 bps. (b) ROI = (18,0 \u2212 4,5)/4,5 = 300%. (c) Rekomendasi: pertahankan (ROI 300% jauh di atas hurdle); ekspansi BOLEH diajukan tetapi wajib menyertakan ROI marginal calon investasi — bukan mengandalkan ROI rata-rata; dan turunkan biaya false positive Rp1,5 M (21,7% dari true cost) via tuning threshold, karena itu 'pajak' terbesar yang bisa dikendalikan.",
        "Pelajaran mini-case: angka Q3 sebenarnya biasa saja sampai dihitung dengan benar. Gross Rp6,0 miliar terdengar besar; tetapi true cost Rp6,9 miliar dan ROI 300% mengubah narasi dari 'kita kemalingan Rp6 miliar' menjadi 'program Rp4,5 miliar menyelamatkan Rp18 miliar dengan efisiensi 300%'. Analis yang sama, data yang sama — metodologi yang berbeda menghasilkan nasib anggaran yang berbeda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan porsi false positive: Rp1,5 miliar dari true cost Rp6,9 miliar. Di banyak perusahaan, inilah temuan paling berharga dari laporan fraud \u2014 bukan fraud-nya, melainkan 'pajak' yang dibayar ke nasabah sah. Menurunkannya 30% = menghemat Rp450 juta tanpa menangkap satu pun fraud tambahan.",
      },
      reference: "Hitung benar \u2192 narasi berubah \u2192 nasib anggaran berubah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Taksonomi kerugian fraud: gross \u2212 recovery = net; true cost = net + biaya operasi + biaya false positive (+ catatan reputasi).",
        "Loss rate (bps) = net loss / volume transaksi \u00D7 10000 \u2014 bahasa universal untuk membandingkan antar periode dan antar peer.",
        "Prevented loss yang jujur = diblokir + terkonfirmasi fraud + dikurangi biaya false positive; prevented gross tanpa verifikasi = angka karangan.",
        "ROI = (prevented NET \u2212 biaya program) / biaya program; bela program dengan ROI rata-rata, putuskan ekspansi dengan ROI marginal vs hurdle rate.",
        "One-pager ke manajemen: 4 KPI di atas, tren 6 bulan di tengah, 3 rekomendasi berangka di bawah \u2014 satu halaman, 30 detik baca.",
      ],
      quiz: [
        {
          q: "Gross fraud loss Rp1,6 M, recovery Rp0,4 M, biaya operasi Rp0,35 M, biaya false positive Rp0,5 M. True cost?",
          options: [
            { text: "Rp2,05 M", why: "Benar: net 1,2 + 0,35 + 0,5 = 2,05. Gross saja = setengah laporan.", correct: true },
            { text: "Rp1,6 M", why: "Itu gross — belum dikurangi recovery, belum ditambah biaya." },
            { text: "Rp1,2 M", why: "Itu net loss — belum termasuk biaya operasi dan false positive." },
            { text: "Rp0,75 M", why: "Tidak ada kombinasi definisi yang menghasilkan angka ini." },
          ],
        },
        {
          q: "Net loss Rp1,2 M dari volume Rp800 M. Loss rate-nya:",
          options: [
            { text: "15 bps", why: "Benar: 1,2/800 \u00D7 10000 = 15. Artinya Rp1,50 hilang per Rp10.000 transaksi.", correct: true },
            { text: "0,15%", why: "0,15% = 15 bps memang, tetapi satuan laporan standar adalah bps." },
            { text: "150 bps", why: "Kelebihan satu nol — cek lagi pembaginya." },
            { text: "1,5 bps", why: "Kekurangan satu nol — 1,2/800 = 0,0015 = 15 bps." },
          ],
        },
        {
          q: "Tim mengklaim prevented Rp50 M tetapi false positive rate naik 0,3% \u2192 2,1% pada volume Rp800 M. Masalahnya?",
          options: [
            { text: "Klaim menyesatkan tanpa konteks false positive \u2014 Rp14,4 M transaksi sah terganggu", why: "Benar: kenaikan 1,8 poin \u00D7 800 M = 14,4 M. Prevented harus dilaporkan NET.", correct: true },
            { text: "Tidak ada masalah \u2014 prevented besar = tim hebat", why: "Tanpa konteks false positive, klaim ini tidak bisa dinilai." },
            { text: "Volume terlalu kecil", why: "Volume bukan masalahnya; metodologi klaimnya." },
            { text: "Harus menambah analis", why: "Menambah orang tidak memperbaiki klaim yang cacat." },
          ],
        },
        {
          q: "Biaya program Rp1,0 M, prevented NET Rp4,2 M. ROI dan artinya:",
          options: [
            { text: "320% \u2014 tiap Rp1 biaya kembali Rp3,2 dalam kerugian yang dicegah", why: "Benar: (4,2\u22121)/1 = 3,2 = 320%. Program menghasilkan.", correct: true },
            { text: "420% \u2014 prevented dibagi biaya", why: "Lupa mengurangkan biaya di pembilang; ROI = (prevented\u2212biaya)/biaya." },
            { text: "76% \u2014 biaya dibagi prevented", why: "Terbalik; itu rasio biaya, bukan ROI." },
            { text: "Tidak bisa dihitung", why: "Bisa \u2014 rumusnya jelas dan datanya lengkap." },
          ],
        },
        {
          q: "Program ROI rata-rata 320%. Untuk memutuskan tambah 1 analis (Rp180 jt, proyeksi +Rp450 jt prevented), metrik yang tepat:",
          options: [
            { text: "ROI marginal 150% vs hurdle rate \u2014 karena keputusan ekspansi memakai rupiah berikutnya", why: "Benar: (450\u2212180)/180 = 150% \u2265 hurdle 100% \u2192 INVESTASI.", correct: true },
            { text: "ROI rata-rata 320% \u2014 sudah tinggi jadi pasti lolos", why: "Rata-rata tidak menjawab apakah rupiah BERIKUTNYA menguntungkan." },
            { text: "Jumlah analis existing", why: "Jumlah orang bukan metrik keputusan investasi." },
            { text: "Payback program lama", why: "Payback historis tidak menilai investasi baru." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CLaporan fraud = daftar fraud yang ketangkap.\u201D Bukan. Laporan fraud = taksonomi kerugian + metrik jujur + ROI + rekomendasi berangka dalam satu halaman. Daftar tangkapan = lampiran; one-pager = laporannya.",
      },
      hints: [
        "Uji cepat: gross 6,0 \u2212 recovery 1,8 + ops 1,2 + FP 1,5 = true cost? (6,9)",
        "Ingat: CFO menagih ROI, bukan jumlah blokir.",
      ],
      reference: "Laporkan metodologi, bukan sekadar angka.",
      next: { label: "FR25 — Fraud Triangle & Fraud Tree ACFE: Membaca Motif, Peluang, dan Pola", href: "/v2/learn/fr25-fraud-triangle-fraud-tree" },
    },
  ],
};
