# Round 2: fr1 - fr8 — blok INTUISI (deep dive + kapan TIDAK pakai) & FAQ
R2 = {}

R2["fr1-lanskap-fraud"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Membaca Fraud seperti Epidemiolog"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Membaca Fraud seperti Epidemiolog</h2>
      <p>Epidemiolog tidak bertanya &ldquo;siapa yang sakit?&rdquo; dulu — ia bertanya <strong>&ldquo;di mana kasusnya mengelompok, seberapa cepat menyebar, dan siapa yang paling rentan?&rdquo;</strong> Analis fraud yang hebat berpikir sama. Taksonomi 9 tipe bukan daftar hafalan — ia <strong>peta penyebaran penyakit</strong>: card fraud mengelompok di e-commerce barang likuid, ATO meledak saat ada kebocoran data, mule tumbuh subur di musim pendaftaran massal (tahun ajaran baru = target rekrutmen mahasiswa).</p>
      <p>Intuisi kedua: <strong>fraud yang terlihat hanyalah puncak gunung es</strong>. Setiap 1 kasus terkonfirmasi, ada 3–5 yang tidak ketahuan (FR4: estimasi prior). Artinya angka &ldquo;Rp374 juta/bulan&rdquo; di worked example adalah <em>batas bawah</em>. Analis senior selalu menyajikan dua angka: <em>terkonfirmasi</em> (fakta) dan <em>terestimasi</em> (fakta + model). Direksi yang hanya melihat angka terkonfirmasi akan selalu <em>under-invest</em> di pertahanan.</p>
      <p><strong>Kapan taksonomi ini TIDAK dipakai:</strong> (1) saat serangan <em>baru</em> yang belum masuk 9 tipe — jangan paksakan klasifikasi; perlakukan sebagai &ldquo;tipe-10 sementara&rdquo; dan dokumentasikan polanya; (2) saat presentasi ke direksi — mereka butuh <em>rupiah per kategori</em>, bukan nama Latin; (3) untuk first-party vs third-party, taksonomi teknis kurang — yang dibutuhkan adalah <em>standar bukti</em> (FR1 peta lanjutan skenario C).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan taksonomi bukan untuk ujian — tapi agar saat investigator berkata &ldquo;ada pola refund aneh&rdquo;, otakmu langsung menjawab: <em>first-party atau insider? jejak datanya apa? siapa yang diuntungkan?</em> Taksonomi adalah <strong>kecepatan berpikir</strong>, bukan koleksi label.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Lanskap Fraud"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Lanskap Fraud</h2>
      <p>Empat pertanyaan yang paling sering muncul setelah mempelajari taksonomi — dijawab dengan jujur, termasuk yang jawabannya &ldquo;tergantung&rdquo;.</p>
      <details className="worked">
        <summary>Q1: Apa bedanya fraud, scam, dan penipuan biasa?</summary>
        <p><strong>Fraud</strong> = kecurangan dalam <em>sistem pembayaran/transaksi</em> (kartu curian, ATO, chargeback palsu) — korbannya pemilik dana, pelakunya mengeksploitasi sistem. <strong>Scam</strong> = korban <em>dibujuk</em> menyerahkan uang/OTP sendiri (phishing, investasi bodong) — korbannya ikut &ldquo;berpartisipasi&rdquo;. Bedanya penting karena <strong>pertahanannya beda</strong>: fraud dilawan dengan deteksi transaksi, scam dilawan dengan edukasi + behavioral. Banyak perusahaan salah kaprah memakai senjata fraud untuk melawan scam — lalu heran kenapa tidak mempan.</p>
      </details>
      <details className="worked">
        <summary>Q2: Kenapa kartu kredit selalu juara fraud rate? Bukankah keamanannya paling canggih?</summary>
        <p>Justru karena <strong>nilai &amp; likuiditasnya</strong>: limit besar + bisa dipakai lintas negara + barang digital instan = target paling menguntungkan. Keamanan (3DS, tokenisasi) menaikkan <em>biaya serangan</em>, tapi selama <em>keuntungannya</em> tetap tinggi, penjahat tetap datang — seperti rumah mewah dengan satpam tetap lebih menarik bagi maling daripada gubuk tanpa kunci. Pelajaran: <strong>keamanan mengurangi, tidak menghilangkan; yang menentukan adalah rasio untung-rugi penjahat</strong>.</p>
      </details>
      <details className="worked">
        <summary>Q3: First-party fraud (pelanggan sendiri) — bisa dipidana?</summary>
        <p>Bisa, tapi <strong>jarang sepadan</strong>: nilai per kasus kecil (Rp500rb–5jt), pembuktian &ldquo;niat&rdquo; sulit, biaya hukum besar. Praktik industri: <em>blacklist lunak</em> (tolak transaksi berikutnya, tutup akun), laporkan ke <em>shared blacklist</em> antar-merchant jika ada, pidanakan hanya untuk <strong>sindikat first-party</strong> (puluhan akun terkoordinasi). Aturan praktis: hukum untuk efek jera kolektif, blacklist untuk kasus individual.</p>
      </details>
      <details className="worked">
        <summary>Q4: UMKM dengan 500 transaksi/bulan perlu memahami semua ini?</summary>
        <p>Tidak semua — tapi <strong>tiga hal wajib</strong>: (1) kenali 2–3 tipe yang relevan dengan bisnismu (e.g. toko online: card fraud + friendly fraud); (2) hitung expected loss-mu (worked example 2) — jika &lt; Rp5jt/bulan, asuransi/chargeback protection lebih murah dari tim; (3) punya <em>rencana respons</em> 1 halaman: siapa dihubungi, kapan bekukan, kapan lapor. UMKM tidak butuh divisi fraud — butuh <strong>kewaspadaan terstruktur</strong>.</p>
      </details>
""",
},

R2["fr2-fraud-vs-aml"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Dua Jam yang Berbeda"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Dua Jam yang Berbeda</h2>
      <p>Bayangkan dua jam dinding. <strong>Jam fraud berdetak dalam milidetik</strong> — setiap detik penundaan = rupiah yang hilang. <strong>Jam AML berdetak dalam bulan</strong> — setiap kesimpulan terburu-buru = jaringan yang gagal dipetakan + laporan yang lemah. Analis yang dipindah dari tim fraud ke tim AML tanpa adaptasi akan membuat dua kesalahan: di fraud ia terlalu lambat (menunggu &ldquo;kepastian&rdquo;), di AML ia terlalu cepat (memblokir sebelum jaringan terpetakan).</p>
      <p>Intuisi kedua: <strong>fraud adalah permainan jumlah, AML adalah permainan cerita</strong>. Menangkap 1.000 card fraud = statistik yang bagus. Menangkap 1 jaringan pencucian = <em>cerita</em> yang harus utuh: siapa, dari mana uangnya, ke mana perginya, apa buktinya — karena ujungnya adalah pengadilan atau PPATK, bukan dashboard. Dokumentasi AML dibaca oleh <em>manusia yang skeptis</em> (penyidik, hakim); dokumentasi fraud dibaca oleh <em>mesin</em> (model).</p>
      <p><strong>Kapan pembedaan ini TIDAK relevan:</strong> (1) di perusahaan kecil — satu orang mengerjakan keduanya, yang penting adalah <em>checklist</em> mana yang dipakai per kasus, bukan struktur organnya; (2) untuk <strong>pencegahan</strong> (KYC yang baik mencegah keduanya); (3) saat uangnya <em>sedang bergerak</em> — dalam 24 jam pertama, selamatkan dulu (logika fraud), klasifikasikan kemudian (logika AML). <strong>Kecepatan dulu, taksonomi kemudian</strong> — saat darurat.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanyakan pada setiap kasus: <strong>&ldquo;apakah saya berlomba dengan <em>waktu</em> atau berlomba dengan <em>kelengkapan</em>?&rdquo;</strong> Jawabannya menentukan segalanya: tools, kecepatan, dokumentasi, bahkan siapa yang harus dibangunkan tengah malam.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Fraud vs AML"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Fraud vs AML</h2>
      <details className="worked">
        <summary>Q1: Bisakah satu tim menangani keduanya?</summary>
        <p>Bisa di perusahaan kecil/menengah — dengan <strong>dua topi yang jelas</strong>: SOP &ldquo;topi fraud&rdquo; (cepat, otomatis, selamatkan dana) dan SOP &ldquo;topi AML&rdquo; (teliti, dokumentasi, laporkan). Yang gagal adalah tim yang memakai <em>satu</em> SOP untuk keduanya: terlalu lambat untuk fraud, terlalu ceroboh untuk AML. Di skala besar, pisahkan — karena <em>skill &amp; temperamen</em> yang dibutuhkan berbeda: fraud butuh operator cepat, AML butuh investigator teliti.</p>
      </details>
      <details className="worked">
        <summary>Q2: STR ke PPATK vs laporan ke polisi — mana dulu?</summary>
        <p><strong>Keduanya, jalurnya beda.</strong> STR = kewajiban intelijen keuangan ke PPATK (bukan tuduhan, tapi &ldquo;ini mencurigakan&rdquo;). Laporan polisi = saat ada <em>tindak pidana konkret</em> dengan korban/kerugian (misal nasabah melapor dananya dicuri). STR tidak butuh korban; laporan polisi butuh. Praktik: STR jalan terus sebagai kewajiban; laporan polisi dibuat paralel jika ada unsur pidana yang jelas. Jangan menunggu yang satu untuk mengerjakan yang lain.</p>
      </details>
      <details className="worked">
        <summary>Q3: Kenapa investigasi AML lambat sekali — tidak bisa dipercepat dengan AI?</summary>
        <p>Sebagian bisa (graph analytics memetakan jaringan dalam jam, bukan minggu). Tapi <strong>bottleneck-nya bukan analisis — melainkan pembuktian</strong>: setiap klaim harus didukung dokumen yang tahan di pengadilan, setiap langkah harus legal (tidak boleh tipping-off, harus jaga chain of custody data). AI mempercepat <em>menemukan</em>; ia tidak mempercepat <em>membuktikan</em>. Ekspektasi yang benar: AI memotong 70% waktu eksplorasi, 0% waktu verifikasi hukum.</p>
      </details>
      <details className="worked">
        <summary>Q4: Contoh kasus yang 100% keduanya?</summary>
        <p><strong>Phishing + mule + layering:</strong> korban phishing kehilangan Rp800jt (fraud — pencurian). Dana masuk ke 12 rekening mule, diputar 3 bank, dibelikan kripto (AML — pencucian). Tim fraud bekerja di jam-jam pertama (bekukan, selamatkan sisa dana); tim AML bekerja di minggu-minggu berikutnya (petakan jaringan, STR). <strong>Satu uang, dua kejahatan, dua timeline</strong> — inilah kenapa lesson ini ada.</p>
      </details>
""",
},

R2["fr3-data-fraud"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Data Exhaust — Jejak yang Tak Terhindarkan"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Data Exhaust — Jejak yang Tak Terhindarkan</h2>
      <p>Setiap transaksi meninggalkan <strong>data exhaust</strong> — asap knalpot digital: timestamp, device, IP, nominal. Penjahat bisa memalsukan <em>identitas</em>, tapi ia <strong>tidak bisa bertransaksi tanpa meninggalkan exhaust</strong>. Inilah asimetri fundamental yang membuat pertahanan mungkin: <em>penyerang butuh 1 keberhasilan; pembela butuh 1 jejak</em> — dan jejak selalu ada.</p>
      <p>Intuisi kedua: <strong>kualitas &gt; kuantitas, dan konteks &gt; keduanya</strong>. 10 kolom yang akurat (timestamp presisi detik, device fingerprint stabil, nominal benar) mengalahkan 100 kolom yang setengah rusak. Dan 1 kolom <em>dengan konteks waktu yang benar</em> (timezone UTC, bukan waktu server yang ngawur) mengalahkan semuanya. Sebagian besar &ldquo;model buruk&rdquo; sebenarnya adalah <strong>data buruk yang dimodelkan dengan baik</strong>.</p>
      <p><strong>Kapan pengumpulan data ini TIDAK berguna:</strong> (1) data tanpa <em>timestamp yang bisa dipercaya</em> — velocity dari jam yang salah = fiksi; (2) data yang tidak bisa dihitung <em>ulang</em> dengan konsisten (fitur training vs serving beda rumus = model hancur); (3) data yang melanggar privasi tanpa dasar hukum — di Indonesia, UU PDP berlaku; <em>data minimization</em> bukan sekadar etika, tapi kewajiban. Kumpulkan yang <strong>perlu &amp; legal</strong>, bukan yang <em>bisa</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum meminta data baru, tanyakan: <strong>&ldquo;jejak apa yang <em>terpaksa</em> ditinggalkan penjahat di kasus ini?&rdquo;</strong> Jawabannya = spesifikasi datamu. Data yang dikumpulkan dari keterpaksaan musuh selalu lebih berharga daripada data yang dikumpulkan karena &ldquo;bagus untuk dimiliki&rdquo;.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Data Fraud"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Data Fraud</h2>
      <details className="worked">
        <summary>Q1: Kalau budget terbatas, data apa yang dikumpulkan duluan?</summary>
        <p><strong>Urutan ROI:</strong> (1) log transaksi lengkap + timestamp presisi (gratis — sudah ada); (2) device fingerprint dasar (murah, menangkap 60%+ ATO); (3) histori per entitas untuk baseline (butuh storage, bukan teknologi mahal); (4) baru kemudian: behavioral biometrics, data vendor. Aturan: <em>maksimalkan yang gratis dulu</em> — kebanyakan tim belum memeras habis log yang sudah mereka miliki sebelum belanja tool baru.</p>
      </details>
      <details className="worked">
        <summary>Q2: Kapan layak beli data dari vendor (device intelligence, blacklist)?</summary>
        <p>Jika <strong>dua syarat</strong> terpenuhi: (a) fraud-mu <em>lintas-merchant</em> (kartu curian dipakai di banyak toko — kamu tidak melihat polanya sendirian), dan (b) skala-mu terlalu kecil untuk membangun reputasi device sendiri (butuh jutaan device agar skor reputasi bermakna). Jika fraud-mu <em>internal</em> (first-party, insider) — vendor generik hampir tidak membantu; investasikan di data internal.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan privasi — UU PDP membatasi apa?</summary>
        <p>Prinsipnya: <strong>kumpulkan minimal yang diperlukan</strong> untuk tujuan pencegahan fraud yang sah, <strong>amankan</strong> (enkripsi, akses terbatas), dan <strong>beri dasar hukum</strong> (persetujuan + kepentingan sah + kewajiban regulasi). Yang dilarang: mengumpulkan data di luar tujuan (misal memakai data fraud untuk marketing tanpa izin), menyimpan selamanya tanpa retensi, dan membagikan ke pihak ketiga tanpa dasar. <em>Privacy by design</em> = arsitek data yang baik sejak awal, bukan tambalan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Seberapa &ldquo;real-time&rdquo; data harus tersedia?</summary>
        <p>Tergantung <em>keputusan</em> yang diambil (FR13): blokir saat transaksi = butuh &lt; 50ms (Redis/feature store); review manual 15 menit kemudian = cukup batch 5-menit; analisis jaringan mingguan = cukup batch harian. <strong>Real-time adalah spektrum, bukan saklar.</strong> Kesalahan mahal: memaksakan semua data real-time (biaya 10×) atau menganggap batch harian cukup untuk blokir (kebocoran total).</p>
      </details>
""",
},

R2["fr4-label-fraud"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Label adalah Konsensus, Bukan Kebenaran"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Label adalah Konsensus, Bukan Kebenaran</h2>
      <p>Bayangkan 3 dokter mendiagnosis 1 pasien — mereka tidak selalu sepakat. Label fraud sama: <strong>ia adalah opini profesional yang didokumentasikan</strong>, bukan hasil lab yang objektif. Investigator A (5 tahun pengalaman, baru saja menangani kasus serupa) dan investigator B (6 bulan, lelah lembur) bisa memberi label berbeda untuk kasus yang sama — dan <em>keduanya</em> masuk ke training data-mu.</p>
      <p>Intuisi kedua: <strong>label adalah aset termahal dalam ML fraud</strong>. Satu label investigator = Rp25–50rb + waktu tunggu berminggu-minggu. Dataset 10.000 label = Rp250–500jt + 3 bulan. Maka setiap keputusan tentang label adalah keputusan <em>investasi</em>: label mana yang paling berharga? Jawabannya: <strong>label di daerah abu-abu</strong> (skor model 0,3–0,7) — bukan yang sudah jelas. Melabel yang sudah jelas = membayar untuk informasi yang sudah kamu miliki.</p>
      <p><strong>Kapan strategi label ini TIDAK berlaku:</strong> (1) untuk <strong>first-party fraud</strong> — label &ldquo;dispute&rdquo; bukan label &ldquo;fraud&rdquo;; campurkan keduanya dan modelmu menghukum pelanggan setia; (2) saat <strong>definisi berubah</strong> (kebijakan baru tentang apa itu fraud) — label lama harus di-audit ulang, bukan dipakai mentah; (3) untuk <strong>serangan baru</strong> — tidak ada label, jangan tunggu; pakai unsupervised + rule sementara (FR8, FR5).</p>
      <div className="myth">
        <p><strong>🚨 Mitos lapangan:</strong> &ldquo;Makin banyak label, makin bagus model.&rdquo;<br /><strong>Yang benar:</strong> 1.000 label <em>bersih &amp; di daerah abu-abu</em> mengalahkan 100.000 label <em>kotor &amp; bias seleksi</em>. Kualitas label = kualitas definisi + kualitas investigator + kualitas sampling. Kuantitas tanpa ketiganya = sampah yang mahal.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Label Fraud"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Label Fraud</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak label yang &ldquo;cukup&rdquo; untuk melatih model?</summary>
        <p>Aturan praktis: <strong>minimal 200–500 positif per kelas</strong> untuk model tabular sederhana; 1.000+ untuk GBM yang stabil. Tapi yang lebih penting dari jumlah: <em>keterwakilan</em> — 500 label yang mencakup semua pola (card, ATO, mule) &gt; 5.000 label yang semuanya card fraud. Jika satu pola tidak terwakili di label, model buta terhadapnya <em>selamanya</em> — audit distribusi label per pola tiap kuartal.</p>
      </details>
      <details className="worked">
        <summary>Q2: Siapa yang seharusnya memberi label — investigator senior atau junior?</summary>
        <p><strong>Keduanya, dengan peran beda:</strong> junior melabel volume (dengan SOP ketat + QA sampling), senior menangani <em>kasus abu-abu &amp; banding</em> + menjadi &ldquo;wasit&rdquo; saat junior tidak sepakat. Yang berbahaya: semua label dari 1–2 orang (bias individu menjadi &ldquo;kebenaran&rdquo; model) atau semua dari junior tanpa QA (noise). Diversifikasi pelabel = diversifikasi sudut pandang = model lebih robust.</p>
      </details>
      <details className="worked">
        <summary>Q3: Label lag 4 bulan — bagaimana model bisa &ldquo;up to date&rdquo;?</summary>
        <p>Dengan <strong>arsitektur dua kecepatan</strong> (FR4 worked example 1): model utama dari data matang (label lengkap, 6+ bulan) untuk stabilitas + lapisan adaptif (rule, model ringan, threshold dinamis) dari sinyal terbaru untuk respons. Jangan pernah &ldquo;mempercepat&rdquo; label dengan menebak — label tebakan = racun yang terlihat seperti data. Terima lag sebagai fakta fisika, rancang sistem di sekitarnya.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bolehkah memakai label sintetis / data augmentation untuk fraud?</summary>
        <p><strong>Hati-hati besar.</strong> Augmentasi yang valid: <em>variasi teknis</em> dari pola yang sudah dipahami (misal nominal ±10%). Yang berbahaya: <em>menciptakan pola baru</em> dari imajinasi — model belajar halusinasi-mu, bukan dunia. Untuk imbalance, prefer <strong>class weighting</strong> (FR7) daripada SMOTE buta — weighting tidak menciptakan data palsu, hanya mengubah insentif.</p>
      </details>
""",
},

R2["fr5-rule-based"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Rule adalah Bahasa, Bukan Sekadar Filter"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Rule adalah Bahasa, Bukan Sekadar Filter</h2>
      <p>Rule yang baik bisa <strong>dibaca keras-keras</strong> dan dipahami CS, investigator, bahkan nasabah: &ldquo;kami menahan transaksi karena ada 9 transaksi dalam 10 menit dari perangkat baru.&rdquo; Inilah keunggulan yang tidak dimiliki model ML mana pun: <strong>rule adalah pengetahuan yang bisa diwariskan</strong>. Saat analis senior resign, rule-nya tetap tinggal dan tetap bisa dijelaskan. Model tanpa dokumentasi = pergi bersama orangnya.</p>
      <p>Intuisi kedua: <strong>setiap rule adalah hipotesis tentang dunia</strong> — dan hipotesis bisa salah atau kedaluwarsa. &ldquo;Transaksi &gt; Rp10jt dari luar negeri = curiga&rdquo; adalah hipotesis tahun 2018 yang masih benar; &ldquo;IP luar negeri = curiga&rdquo; adalah hipotesis yang mati sejak WFH massal 2020. Bedakan <em>rule</em> (implementasi) dari <em>hipotesis</em> (alasan) — saat dunia berubah, hipotesisnya yang diganti, bukan sekadar angkanya.</p>
      <p><strong>Kapan rule TIDAK boleh dipakai:</strong> (1) pola <strong>bermutasi lebih cepat dari siklus review</strong> (mingguan) — rule menjadi fosil; (2) keputusan butuh <strong>menimbang 10+ sinyal sekaligus</strong> — otak manusia tidak bisa menulis rule 10-dimensi yang benar; (3) sebagai <strong>satu-satunya pertahanan</strong> untuk serangan terorganisir — penjahat membaca rule-mu dari perilakunya (mereka tahu ambangmu dari trial-error) dan menari di bawahnya. Rule = pagar; pagar tidak menghentikan maling profesional — ia <em>memperlambat &amp; mencatat</em> mereka.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tulis setiap rule dalam format: <strong>HIPOTESIS → RULE → METRIK → KEDALUWARSA</strong>. Contoh: &ldquo;H: pencuri mengetes kartu dengan nominal kecil lalu menguras. R: flag velocity &gt; 5/10mnt + amount spike. M: precision &gt; 15%. Exp: review 2027-Q1.&rdquo; Rule tanpa tanggal kedaluwarsa = utang yang tidak tercatat.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Rule-Based"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Rule-Based</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak rule yang ideal?</summary>
        <p><strong>20–60 rule aktif</strong> untuk operasi menengah — cukup untuk cakupan, sedikit untuk dirawat. Tanda kebanyakan: tidak ada yang hafal semua rule, review kuartalan tidak pernah selesai, rule saling bertentangan. Tanda kekurangan: pola berulang lolos terus. Yang penting bukan jumlah — tapi <strong>setiap rule punya pemilik, metrik, dan tanggal review</strong>. Rule yatim piatu = rule mati berjalan.</p>
      </details>
      <details className="worked">
        <summary>Q2: &ldquo;ML sudah ada, kenapa masih butuh rule?&rdquo;</summary>
        <p>Empat alasan: (1) <strong>kecepatan</strong> — rule darurat deploy dalam jam, model butuh minggu; (2) <strong>kepastian</strong> — pola yang 100% fraud (device terkonfirmasi jahat) tidak butuh probabilitas; (3) <strong>kepatuhan</strong> — regulator/auditor paham rule; (4) <strong>cadangan</strong> — saat model down, rule adalah pertahanan terakhir. Arsitektur yang benar: <strong>rule + ML berlapis</strong>, bukan salah satu.</p>
      </details>
      <details className="worked">
        <summary>Q3: Siapa yang seharusnya memelihara rule — analis atau engineer?</summary>
        <p><strong>Analis menulis logika, engineer menjaga eksekusi.</strong> Analis tahu polanya (&ldquo;velocity berapa yang aneh?&rdquo;); engineer tahu biayanya (&ldquo;query ini 800ms, terlalu lambat&rdquo;). Kegagalan klasik: analis menulis rule tanpa tahu limitasi sistem (rule tidak pernah jalan) atau engineer mengubah rule tanpa paham logikanya (rule jalan tapi salah). <em>Pair review</em> tiap rule baru = murah dibanding insiden.</p>
      </details>
      <details className="worked">
        <summary>Q4: Rule darurat — seberapa &ldquo;kasar&rdquo; boleh?</summary>
        <p>Saat serangan aktif, <strong>presisi boleh turun sementara</strong> — false positive 2 jam lebih murah daripada kebocoran 2 jam. Tapi tiga syarat: (1) <strong>batas waktu eksplisit</strong> (auto-expire), (2) <strong>monitoring hit rate per jam</strong>, (3) <strong>jalur banding cepat</strong> untuk korban salah flag. Rule darurat tanpa ketiganya = kepanikan yang dilembagakan.</p>
      </details>
""",
},

R2["fr6-feature-engineering"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Fitur adalah Teori tentang Penjahat"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Fitur adalah Teori tentang Penjahat</h2>
      <p>Setiap fitur yang kamu buat adalah <strong>kalimat hipotesis</strong>: &ldquo;saya percaya penjahat <em>terpaksa</em> bertransaksi cepat&rdquo; (velocity), &ldquo;saya percaya penjahat <em>terpaksa</em> memakai ulang device&rdquo; (device sharing). Feature engineering yang hebat bukan soal matematika — ia soal <strong>kriminalogi terapan</strong>: memahami keterbatasan musuh, lalu mengukurnya.</p>
      <p>Intuisi kedua: <strong>fitur terbaik adalah yang <em>stabil maknanya</em> saat dunia berubah</strong>. &ldquo;Nominal transaksi&rdquo; berubah artinya saat inflasi; &ldquo;rasio terhadap baseline nasabah&rdquo; tetap bermakna. &ldquo;Jumlah transaksi&rdquo; berubah saat promo; &ldquo;deviasi dari pola musiman&rdquo; tetap bermakna. Desain fitur yang dinormalisasi terhadap <em>konteks individu</em> = fitur yang tahan drift (FR10) — investasi sekali, panen bertahun-tahun.</p>
      <p><strong>Kapan feature engineering ini TIDAK cukup / berbahaya:</strong> (1) <strong>leakage</strong> — fitur yang memakai informasi dari <em>masa depan</em> (misal &ldquo;apakah transaksi ini di-chargeback?&rdquo; sebagai fitur training) = model terlihat sempurna, hancur di produksi. Uji: &ldquo;apakah fitur ini tersedia <em>saat keputusan dibuat</em>?&rdquo; Jika tidak → buang. (2) fitur yang <strong>tidak bisa dihitung di serving</strong> (butuh join 800ms untuk budget 50ms) = fiksi notebook. (3) fitur yang <strong>berkorelasi dengan atribut dilindungi</strong> (etnis, agama via proxy lokasi) = bom hukum &amp; etika — audit fairness berkala.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum menambah fitur ke-31, tanyakan: <strong>&ldquo;hipotesis kriminal apa yang diwakili fitur ini — dan apakah 30 fitur lama belum mewakilinya?&rdquo;</strong> Fitur tanpa hipotesis = angka tanpa jiwa; fitur duplikat = biaya tanpa manfaat.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Feature Engineering"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Feature Engineering</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak fitur yang ideal?</summary>
        <p><strong>15–40 fitur terawat</strong> mengalahkan 300 fitur setengah mati — konsisten di banyak tim. Tanda kelebihan: training lambat, debugging sulit, tidak ada yang paham separuh fitur. Praktik: mulai dari 20 fitur &ldquo;wajib&rdquo; (velocity, amount ratio, device, recency, baseline), tambah hanya jika <em>ablation test</em> membuktikan manfaatnya. <strong>Fitur adalah liabilitas</strong> — setiap tambahan = dihitung selamanya.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bukankah deep learning bisa &ldquo;belajar fitur sendiri&rdquo;?</summary>
        <p>Bisa — untuk data <em>mentah berstruktur kompleks</em> (urutan klik, teks). Tapi untuk data tabular fraud: (1) butuh <strong>jauh lebih banyak data</strong>, (2) hasilnya <strong>tidak bisa dijelaskan</strong> ke investigator/regulator, (3) GBM + fitur manual masih menang di kebanyakan benchmark tabular. Auto-feature = alat untuk <em>eksplorasi</em>, bukan pengganti pemahaman domain. Yang tahu <em>kenapa</em> velocity penting akan selalu mengalahkan yang hanya tahu <em>cara</em> memanggil AutoML.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana menangani fitur kategorikal (merchant, kota)?</summary>
        <p><strong>Target encoding dengan regularisasi</strong> (rata-rata fraud rate per kategori + smoothing) adalah standar industri — tapi <em>hitung dari data training saja</em> (leakage jika pakai seluruh data!) dan <em>bekukan</em> mapping-nya untuk serving. Untuk kategori baru di produksi (merchant baru): fallback ke rata-rata global. One-hot untuk ratusan ribu merchant = matriks raksasa yang lambat &amp; boros — hindari.</p>
      </details>
      <details className="worked">
        <summary>Q4: Fitur harus dinormalisasi? Model tree kan tidak butuh.</summary>
        <p>Benar, tree/GBM tidak butuh normalisasi untuk <em>training</em> — tapi normalisasi tetap berguna untuk: (1) <strong>interpretasi</strong> (rasio 200× lebih bermakna dari angka mentah 4), (2) <strong>threshold rule</strong> yang konsisten lintas segmen, (3) <strong>model linear/neural</strong> jika dipakai, (4) <strong>monitoring drift</strong> (PSI lebih stabil di fitur ternormalisasi). Normalisasi = investasi keterbacaan, bukan kebutuhan algoritma.</p>
      </details>
""",
},

R2["fr7-supervised-ml"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Loss Function adalah Insentif"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Loss Function adalah Insentif</h2>
      <p>Model bukan &ldquo;pintar&rdquo; — ia adalah <strong>pegawai yang memaksimalkan insentifnya</strong> (loss function). Beri insentif &ldquo;akurasi&rdquo; di data 1:500 → ia belajar &ldquo;tidur saja, toh 99,8% benar&rdquo;. Beri insentif berbobot (scale_pos_weight) → ia belajar &ldquo;fraud itu penting&rdquo;. <strong>Setiap kegagalan model pada dasarnya adalah kegagalan insentif</strong> — sebelum menyalahkan algoritma, periksa apa yang kamu perintahkan ia optimalkan.</p>
      <p>Intuisi kedua: <strong>model supervised adalah cermin label-mu</strong> — termasuk bias &amp; lukanya (FR4). Model yang &ldquo;diskriminatif&rdquo; terhadap segmen tertentu biasanya mewarisi bias <em>siapa yang diinvestigasi</em>, bukan realitas fraud. Audit model = audit label = audit proses investigasi. Rantai ini tidak bisa diputus: <strong>kualitas model ≤ kualitas label ≤ kualitas tim investigasi</strong>.</p>
      <p><strong>Kapan supervised ML TIDAK boleh dipakai:</strong> (1) <strong>label &lt; 200 positif</strong> — model menghafal noise; pakai rule + unsupervised dulu; (2) <strong>pola berubah lebih cepat dari siklus retrain</strong> — model kemarin melawan musuh kemarin; (3) <strong>keputusan butuh penjelasan hukum</strong> (skor kredit!) — pakai model interpretable, terima trade-off akurasi; (4) <strong>sebagai satu-satunya pertahanan</strong> — model adalah satu lapis; tanpa rule, monitoring, dan manusia, ia satu titik kegagalan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum tuning hyperparameter, jawab tiga pertanyaan: <strong>(1) apa insentif model ini? (2) dari label siapa ia belajar? (3) kapan ia terakhir melihat dunia nyata?</strong> 90% &ldquo;model buruk&rdquo; gagal di salah satu dari tiga ini — bukan di arsitektur.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Supervised ML"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Supervised ML</h2>
      <details className="worked">
        <summary>Q1: XGBoost, LightGBM, atau CatBoost — mana yang &ldquo;terbaik&rdquo; untuk fraud?</summary>
        <p><strong>Ketiganya setara</strong> untuk data tabular fraud — selisih AUC biasanya &lt; 1 poin. Yang membedakan: LightGBM paling cepat training, CatBoost paling nyaman untuk kategorikal, XGBoost paling matang ekosistemnya. <strong>Pilih yang tim-mu paling paham mengoperasikannya</strong> — karena 95% nilai ada di fitur + label + threshold, bukan di pilihan GBM. Debat algoritma = mengoptimasi 5%.</p>
      </details>
      <details className="worked">
        <summary>Q2: Model overfitting — tanda-tandanya di fraud?</summary>
        <p>Tanda klasik: training AUC 0,99, validasi 0,85 — <strong>gap besar</strong>. Tapi di fraud ada tanda khas: model &ldquo;hafal&rdquo; <em>ID spesifik</em> (kartu/device tertentu) bukan <em>pola</em> — di produksi, ID baru = model buta. Cegah: <strong>validasi time-based</strong> (train Jan–Jun, validasi Jul — bukan random split!), fitur agregat bukan ID mentah, dan regularisasi. Random split di data deret waktu = <strong>kebocoran masa depan</strong> yang sistematis.</p>
      </details>
      <details className="worked">
        <summary>Q3: Seberapa sering retrain?</summary>
        <p><strong>Berdasarkan drift, bukan kalender</strong> (FR10): retrain saat PSI &gt; 0,25 bertahan 2+ bulan atau performa turun signifikan. Retrain buta bulanan berisiko melatih dengan data terkontaminasi label-lag. Praktik umum: <em>evaluasi</em> bulanan, <em>retrain</em> kuartalan atau saat terpicu. Dan selalu via champion-challenger (FR18) — jangan replace buta.</p>
      </details>
      <details className="worked">
        <summary>Q4: Model bagus tapi investigator tidak percaya — bagaimana?</summary>
        <p><strong>Masalah adopsi, bukan akurasi.</strong> Resep yang terbukti: (1) duduk 2 minggu dengan investigator, bedah 10 contoh &ldquo;kenapa skor ini tinggi&rdquo; (FR17); (2) mulai sebagai <em>penasihat</em> (skor membantu prioritas) bukan <em>pengganti</em> (auto-block); (3) tunjukkan <em>uangnya</em>: &ldquo;model ini menghemat RpX/bulan&rdquo;. Kepercayaan dibangun dengan <strong>transparansi + hasil</strong>, bukan dengan slide AUC.</p>
      </details>
""",
},

R2["fr8-unsupervised"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Mendefinisikan &ldquo;Normal&rdquo; itu Mahal"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Mendefinisikan &ldquo;Normal&rdquo; itu Mahal</h2>
      <p>Supervised bertanya &ldquo;mana yang jahat?&rdquo; — unsupervised bertanya <strong>&ldquo;mana yang biasa?&rdquo;</strong> Dan ternyata, mendefinisikan &ldquo;biasa&rdquo; jauh lebih sulit dari kelihatannya: perilaku 10 juta nasabah = 10 juta definisi normal yang berbeda, berubah tiap musim, tiap promo, tiap gajian. Unsupervised yang baik bukan yang pintar matematika — tapi yang <strong>memodelkan normalitas secara personal &amp; kontekstual</strong>.</p>
      <p>Intuisi kedua: <strong>unsupervised adalah mesin hipotesis, bukan mesin vonis</strong>. Output-nya bukan &ldquo;ini fraud&rdquo; melainkan &ldquo;ini <em>layak dilihat manusia</em>&rdquo;. Organisasi yang memakai skor anomali untuk auto-block akan menghukum sultan, turis, dan siapa pun yang hidupnya tidak rata-rata. Organisasi yang memakainya untuk <em>triage</em> menemukan sindikat yang tidak dicari siapa pun. <strong>Posisikan sebagai radar, bukan peluru.</strong></p>
      <p><strong>Kapan unsupervised TIDAK boleh dipakai:</strong> (1) <strong>ada label cukup</strong> (&gt; 1.000 positif) — supervised hampir selalu menang; (2) <strong>data &ldquo;normal&rdquo;-nya sendiri kotor</strong> (banyak fraud tak terdeteksi di training) — model belajar bahwa fraud = normal; (3) <strong>untuk keputusan yang butuh penjelasan hukum</strong> — &ldquo;anomali&rdquo; bukan alasan yang bisa dipertahankan di pengadilan; (4) <strong>tanpa kapasitas review</strong> — 10.000 anomali tanpa investigator = 10.000 baris yang tidak dibaca siapa pun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> nilai unsupervised terbesar bukan di <em>skornya</em> — tapi di <strong>eksplorasinya</strong>. Analis yang rutin menjalankan clustering atas data baru menemukan pola yang tidak ada di hipotesis siapa pun. Jadwalkan &ldquo;jam eksplorasi&rdquo; mingguan: tanpa target, tanpa KPI — hanya <em>melihat</em>. Banyak temuan terbesar lahir dari sini.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Unsupervised"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Unsupervised</h2>
      <details className="worked">
        <summary>Q1: Apa bedanya outlier, anomali, dan fraud?</summary>
        <p><strong>Outlier</strong> = titik jauh secara statistik (bisa karena salah input data). <strong>Anomali</strong> = pola tidak biasa yang <em>menarik</em> (butuh konteks untuk menilai). <strong>Fraud</strong> = anomali yang <em>terbukti jahat</em> (butuh investigasi). Hubungannya: semua fraud (hampir) adalah anomali, tapi <strong>sebagian besar anomali bukan fraud</strong> — melainkan sultan, error sistem, atau perilaku unik yang sah. Jangan pernah menyamakan ketiganya dalam SOP.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana memilih contamination jika tidak tahu base rate?</summary>
        <p><strong>Estimasi dulu, jangan tebak.</strong> Cara: (1) audit sampel acak (FR4) untuk estimasi kasar; (2) mulai dari 1–2% dan <em>kalibrasi dengan injeksi</em> (selipkan kasus diketahui, ukur recall — worked example 2); (3) sesuaikan dengan <em>kapasitas review</em>: contamination × volume ≤ kapasitas. Contamination bukan parameter magis — ia <strong>anggaran alarm</strong> yang harus dipertanggungjawabkan.</p>
      </details>
      <details className="worked">
        <summary>Q3: Kapan butuh autoencoder / deep learning untuk anomali?</summary>
        <p>Untuk <strong>data kompleks berdimensi tinggi</strong>: urutan event, embedding teks/gambar, sinyal sensor. Untuk data tabular fraud biasa: <strong>Isolation Forest cukup</strong> — lebih cepat 100×, lebih stabil, lebih mudah dijelaskan. Aturan: <em>naik ke deep hanya jika yang sederhana terbukti mentok</em> — bukan karena paper-nya baru.</p>
      </details>
      <details className="worked">
        <summary>Q4: False positive unsupervised tinggi sekali — normal?</summary>
        <p><strong>Ya, dan itu by design.</strong> Unsupervised mengorbankan presisi demi <em>cakupan</em> — tugasnya memastikan tidak ada yang terlewat, bukan memastikan semua yang ditangkap bersalah. Solusinya bukan &ldquo;menaikkan akurasi&rdquo; (tidak ada label untuk diukur!) melainkan <strong>lapisan triage</strong>: clustering (FR8 peta lanjutan), scoring gabungan dengan rule, dan prioritas by expected value. Terima sifatnya, rancang alirannya.</p>
      </details>
""",
},
