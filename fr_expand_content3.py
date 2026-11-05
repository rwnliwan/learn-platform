# Chunk 3: fr13 - fr18
CONTENT3 = {}

# ================================================================= FR13
CONTENT3["fr13-realtime"] = {
"toc_worked": ("worked", "📐 Worked Example: Anggaran Latensi & Throughput"),
"worked": """
      <h2 id="worked">📐 Worked Example: Merancang Sistem 50ms</h2>
      <p>Realtime bukan &ldquo;secepat mungkin&rdquo; — ia <strong>anggaran</strong> yang dibagi habis ke komponen. Dua contoh perhitungannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membagi anggaran 50ms</summary>
        <p>Kebutuhan: keputusan blokir/approve dalam 50ms (p95) agar checkout tidak terasa lambat. Komponen pipeline:</p>
        <p><strong>Langkah 1 — alokasikan.</strong> Network in/out: 8ms. Feature fetch (Redis/feature store): 12ms. Model inference (GBM, 30 fitur): 6ms. Rule engine: 4ms. Buffer/overhead: 5ms. <strong>Total: 35ms</strong> — sisa 15ms sebagai cadangan.</p>
        <p><strong>Langkah 2 — uji komponen termahal.</strong> Ternyata feature fetch butuh 28ms karena 3 query sequential ke database berbeda. Solusi: <strong>paralelisasi</strong> (3 query jalan bersamaan → 12ms, mengikuti yang terlambat) + <strong>precompute</strong> fitur 24h+ ke Redis tiap 5 menit (FR6).</p>
        <p><strong>Langkah 3 — aturan darurat.</strong> Jika total &gt; 50ms (misal Redis lambat), sistem <strong>fail-open dengan mode degradasi</strong>: putuskan dengan fitur yang sudah ada + rule sederhana, catat untuk review asinkron. Alternatif fail-closed (tolak semua saat lambat) = bunuh bisnis tiap ada gangguan infra. Keputusan fail-open vs fail-closed adalah <strong>keputusan bisnis</strong>, bukan teknis — dan harus dibuat <em>sebelum</em> insiden, bukan saat insiden.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menghitung kapasitas — dari QPS ke jumlah server</summary>
        <p>E-wallet memproses rata-rata 800 transaksi/detik (QPS), puncak 3.500 QPS (gajian + Harbolnas). Tiap keputusan butuh 35ms waktu komputasi.</p>
        <p><strong>Langkah 1 — kebutuhan konkurensi.</strong> Konkurensi = QPS × latensi = 3.500 × 0,035 = <strong>122,5 → 123 worker konkuren</strong> minimum di puncak.</p>
        <p><strong>Langkah 2 — ke jumlah server.</strong> Satu server menangani 32 worker → 123/32 = 3,8 → <strong>4 server</strong> untuk puncak, +1 cadangan (N+1) = <strong>5 server</strong>. Untuk rata-rata 800 QPS: 800 × 0,035/32 ≈ 1 server — artinya <strong>autoscaling 1→5</strong> menghemat 80% biaya di jam sepi.</p>
        <p><strong>Langkah 3 — jebakan antrean.</strong> Jika QPS sesaat melonjak ke 6.000 (2× puncak yang direncanakan), antrean tumbuh 2.500/detik — dalam 60 detik = 150.000 tertunda, latensi meledak ke hitungan detik. Solusi: <strong>load shedding</strong> — transaksi berisiko rendah (<em>low score historical</em>, nominal kecil, merchant tepercaya) dilewati dari scoring penuh saat overload. Prinsip: <strong>saat tenggelam, selamatkan yang paling berharga dulu</strong> — bukan semua sama rata.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Arsitektur Keputusan"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Sinkron vs Asinkron</h2>
      <p>Tidak semua keputusan harus real-time. Tiga skenario arsitektur:</p>
      <p><strong>Skenario A — block-then-review (sinkron penuh).</strong> Untuk: skor sangat tinggi (≥ 0,70), pola serangan aktif. Transaksi ditahan <em>saat itu juga</em>. Harga: latensi + risiko false positive mengganggu nasabah. Cocok untuk pola yang <strong>biaya kelolosannya katastrofal</strong> (drain akun).</p>
      <p><strong>Skenario B — approve-then-review (asinkron).</strong> Untuk: skor menengah, transaksi harus cepat (QRIS, tap kartu). Transaksi <em>dilewatkan</em>, lalu scoring penuh + review dalam 5–15 menit. Jika terbukti fraud: blokir akun &amp; cegah transaksi <em>berikutnya</em> (kerugian satu transaksi diterima sebagai biaya kecepatan). Cocok untuk: <strong>pembayaran tatap muka</strong> di mana menolak di kasir = mempermalukan nasabah.</p>
      <p><strong>Skenario C — fitur mahal secara asinkron.</strong> Fitur graph 2-hop (80ms) tidak muat di budget 50ms. Solusi: keputusan awal dari fitur cepat (35ms), lalu <strong>enrichment asinkron</strong> — jika fitur mahal menyala 200ms kemudian, picu review/blokir susulan + tandai akun untuk 24 jam. Prinsip: <strong>jangan biarkan fitur terbaikmu tidak dipakai hanya karena ia lambat</strong> — pakai ia di jalur kedua.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> di realtime, <strong>fitur yang 90% akurat dalam 5ms lebih berharga daripada yang 99% akurat dalam 500ms</strong> — karena yang kedua tidak pernah sempat dipakai. Latensi adalah <em>fitur produk</em> sama seperti akurasi: keduanya dibayar dengan uang (infra) dan keduanya dirasakan nasabah.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: QRIS & Keputusan < 1 Detik"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Menahan QRIS Tanpa Membunuh UX</h2>
      <p>QRIS memproses ratusan juta transaksi/bulan di Indonesia — dan ekspektasi penggunanya: <strong>scan → bayar → selesai dalam 2 detik</strong>. Tidak ada ruang untuk &ldquo;transaksi Anda sedang ditinjau&rdquo;.</p>
      <p><strong>Tantangannya (pola umum):</strong> modus &ldquo;QRIS palsu&rdquo; — stiker QR merchant diganti dengan QR milik penjahat; dana mengalir ke rekening penjahat. Juga ATO: akun e-wallet dibajak lalu dipakai QRIS berkali-kali nominal kecil (di bawah radar rule nominal).</p>
      <p><strong>Arsitektur yang bekerja:</strong> (1) <strong>pre-screening 5ms</strong>: blacklist device/merchant + velocity 1 menit dari Redis — menangkap 70% pola kasar; (2) <strong>scoring 30ms</strong>: GBM ringan (15 fitur) untuk sisanya; (3) <strong>post-auth monitoring</strong>: pola &ldquo;10 QRIS Rp95rb dalam 20 menit&rdquo; memicu pembekuan akun <em>setelah</em> transaksi ke-11 — menerima kerugian 10 transaksi demi UX 99,99% transaksi normal.</p>
      <p><strong>Angka ilustratif trade-off-nya:</strong> menaikkan ambang blokir menghemat Rp120jt/bulan fraud tapi menambah 0,3% transaksi tertahan = 900.000 transaksi/bulan × risiko churn. Keputusan final: <strong>lebih longgar di titik pembayaran, lebih ketat di pola pasca-bayar</strong> — karena di QRIS, <em>kepercayaan UX adalah aset yang lebih mahal daripada fraud yang dicegah</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Sistem realtime harus memblokir semua fraud sebelum terjadi.&rdquo;<br /><strong>Yang benar:</strong> tidak ada sistem realtime yang menangkap 100% — target realistis: <strong>tangkap yang katastrofal secara sinkron, kejar sisanya secara asinkron</strong>. Mengejar 100% sinkron = latensi meledak = nasabah kabur = bisnis mati. Keamanan sempurna yang membunuh bisnis bukan keamanan.</p>
      </div>
""",
},

# ================================================================= FR14
CONTENT3["fr14-case-management"] = {
"toc_worked": ("worked", "📐 Worked Example: Kapasitas Investigator & Sampling QA"),
"worked": """
      <h2 id="worked">📐 Worked Example: Matematika Tim Investigasi</h2>
      <p>Case management adalah <strong>operasi</strong> — dan operasi tunduk pada matematika antrean. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: berapa investigator yang dibutuhkan?</summary>
        <p>Volume: 6.000 flag/hari. Satu review rata-rata 6 menit (buka case, cek histori, putuskan, catat alasan).</p>
        <p><strong>Langkah 1 — kebutuhan mentah.</strong> 6.000 × 6 menit = 36.000 menit = <strong>600 jam kerja/hari</strong>.</p>
        <p><strong>Langkah 2 — kapasitas per orang.</strong> 8 jam shift × 75% produktif (istirahat, meeting, QA) = 6 jam efektif = <strong>60 case/hari/orang</strong>.</p>
        <p><strong>Langkah 3 — headcount.</strong> 6.000/60 = <strong>100 investigator</strong> — mustahil untuk kebanyakan perusahaan. Inilah momen kebenaran: <em>bukan</em> &ldquo;rekrut 100 orang&rdquo;, melainkan <strong>turunkan flag via threshold &amp; auto-decision</strong> (FR11): dengan dua threshold, 60% flag jadi auto-decision → 2.400 case/hari → 40 orang. Masih besar — maka prioritaskan lagi: hanya skor 0,05–0,70 yang manual (1.500/hari → 25 orang). <strong>Matematika kapasitas adalah argumen paling jujur untuk otomasi.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: sampling QA — berapa case di-review ulang?</summary>
        <p>Ingin mengestimasi <em>error rate</em> investigator (keputusan yang salah) dengan margin ±3% pada tingkat kepercayaan 95%.</p>
        <p><strong>Langkah 1 — rumus ukuran sampel.</strong></p>
        <Tex math={String.raw`n = \\frac{Z^2 \\times p(1-p)}{e^2}`} block />
        <p><Tex math={String.raw`Z`} /> = 1,96 (95%), <Tex math={String.raw`p`} /> = 0,15 (tebakan awal error rate 15%), <Tex math={String.raw`e`} /> = 0,03.</p>
        <p><strong>Langkah 2 — hitung.</strong> n = (3,8416 × 0,15 × 0,85)/0,0009 = 0,4898/0,0009 ≈ <strong>544 case</strong>.</p>
        <p><strong>Langkah 3 — operasionalkan.</strong> 544 case/bulan ÷ 20 hari kerja ≈ <strong>27 case/hari</strong> di-review ulang oleh senior (blind: tidak tahu keputusan awal). Hasilnya bukan untuk menghukum — tapi untuk <strong>mengukur disagreement rate</strong> dan menemukan pola kesalahan sistematis (misal: semua investigator salah menangani pola X → butuh training, bukan teguran). Tim tanpa QA sampling = tim yang tidak tahu seberapa salah ia.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Alur Case"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Mendesain Siklus Hidup Case</h2>
      <p>Tiga keputusan desain yang menentukan apakah tim investigasi efektif atau sekadar sibuk:</p>
      <p><strong>Skenario A — kapan auto-close tanpa manusia.</strong> Syarat: (1) precision pola &gt; 95% di 90 hari data, (2) nilai &lt; Rp500rb, (3) ada mekanisme banding nasabah yang mudah. Contoh: &ldquo;device terkonfirmasi jahat + pola identik dengan 1.000 kasus sebelumnya&rdquo; → auto-block + notifikasi. Yang <em>tidak</em> boleh auto-close: first-party (butuh penilaian niat), nilai besar, nasabah korporat. Aturan: <strong>otomatisasi yang jelas-jelas, manusia untuk yang abu-abu</strong>.</p>
      <p><strong>Skenario B — kapan eskalasi ke senior.</strong> Bukan &ldquo;kasus sulit&rdquo; (terlalu subjektif) — tapi <strong>pemicu objektif</strong>: nilai &gt; Rp50jt, nasabah korporat/pemerintah, indikasi insider, atau investigator ragu &gt; 10 menit. Eskalasi harus <em>murah</em> (satu klik, tanpa paperwork) — eskalasi yang ribet tidak akan dipakai saat dibutuhkan.</p>
      <p><strong>Skenario C — kapan case menjadi training data.</strong> Tidak semua keputusan investigator layak jadi label (FR4): hanya yang (1) melewati QA atau konsensus 2 investigator, (2) berumur &gt; contamination window, (3) lengkap alasannya (reason code terisi). Case yang diputuskan terburu-buru tanpa alasan = <strong>label sampah</strong> yang meracuni model. Kualitas loop tertutup ini menentukan apakah sistemmu <em>belajar</em> atau sekadar <em>berputar</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Investigator senior selalu benar.&rdquo;<br /><strong>Yang benar:</strong> disagreement rate antar investigator (bahkan senior) normalnya <strong>10–20%</strong> — terutama untuk first-party &amp; kasus abu-abu. Ini bukan aib; ini <em>data</em>: menunjukkan di mana definisi &amp; SOP perlu diperjelas. Tim yang mengklaim 0% disagreement biasanya tidak mengukur, bukan tidak bersalah.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Backlog Lebaran & 15 Investigator"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Tim 15 Orang vs Lonjakan Mudik</h2>
      <p>Bank menengah Indonesia: tim fraud 15 investigator, kapasitas 900 case/hari. H-7 Lebaran: volume transaksi naik 2,5× (THR, tiket, parsel) dan — mengikuti volumenya — flag naik ke 2.800/hari. Backlog tumbuh 1.900/hari.</p>
      <p><strong>Hari ke-4:</strong> backlog 7.600 case, SLA 24 jam jebol total, investigator lembur 12 jam, error rate naik (kelelahan), 3 orang mengundurkan diri bulan berikutnya. Biaya: bukan cuma lembur — tapi <strong>kehilangan orang terlatih</strong> yang butuh 6 bulan untuk diganti.</p>
      <p><strong>Yang seharusnya disiapkan (playbook musiman):</strong> (1) <strong>tenaga cadangan terlatih</strong>: 10 staf CS dilatih dasar investigasi tiap kuartal, dipanggil saat lonjakan — seperti relawan bencana; (2) <strong>mode hemat</strong>: threshold sementara diketatkan + auto-decision diperluas untuk pola jelas, sehingga case manual turun 40%; (3) <strong>triage eksplisit</strong>: backlog diurutkan by expected value (FR11) — Rp50jt+ didahulukan, Rp100rb ditunda tanpa rasa bersalah; (4) <strong>batas lembur</strong>: investigator lelah = keputusan buruk = label buruk = model buruk bulan depan. Melindungi tim <em>adalah</em> melindungi kualitas sistem.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> case management yang baik tidak diukur dari <strong>berapa case selesai</strong>, tapi dari <strong>berapa rupiah diselamatkan per jam investigator</strong>. Seribu case Rp50rb yang selesai &lt; sepuluh case Rp50jt yang tertangani. Sibuk ≠ efektif.</p>
      </div>
""",
},

# ================================================================= FR15
CONTENT3["fr15-aml"] = {
"toc_worked": ("worked", "📐 Worked Example: Structuring & Risk Scoring"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung Pola Pencucian</h2>
      <p>AML adalah tentang <strong>pola di atas ambang</strong> — dua contoh cara menghitungnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: mendeteksi structuring dari pola setoran</summary>
        <p>Ambang pelaporan transaksi tunai (CTR): Rp500jt (ilustratif). Rekening R menerima setoran tunai 14 hari terakhir: 480jt, 495jt, 470jt, 490jt, 485jt, 475jt — total <strong>Rp2,895 miliar</strong>, tidak satu pun menyentuh ambang.</p>
        <p><strong>Langkah 1 — uji statistik sederhana.</strong> Peluang setoran acak jatuh <em>persis</em> di rentang 470–495jt enam kali beruntun? Jika setoran normal tersebar 50jt–1M, peluang satu setoran di 470–495jt ≈ 5%. Enam kali beruntun: 0,05⁶ ≈ <strong>1 banding 64 juta</strong> — mustahil kebetulan.</p>
        <p><strong>Langkah 2 — fitur pendukung.</strong> Setoran selalu jam 10.00–10.30 (jam buka cabang yang sama), selalu pecahan Rp100rb (ciri uang tunai terkumpul), tidak ada aktivitas usaha yang menjelaskan arus kas tunai sebesar itu di profil nasabah (toko kelontong).</p>
        <p><strong>Langkah 3 — keputusan.</strong> Bukan &ldquo;tangkap&rdquo; — tapi <strong>naikkan ke EDD + siapkan STR</strong>: kumpulkan 30 hari pola lengkap, petakan rekening tujuan (layering?), lalu laporkan ke PPATK. Structuring <em>adalah</em> indikasi TPPU yang paling klasik — penjahatnya memberi tahu kita lewat usahanya <em>menghindari</em> ambang.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: risk scoring nasabah (CDD → EDD)</summary>
        <p>Bank menilai risiko nasabah baru dengan skor berbobot (0–100):</p>
        <p><strong>Faktor &amp; bobot:</strong> negara domisili risiko tinggi: 25; jenis usaha tunai-intensif: 20; PEP/keluarga PEP: 25; histori transaksi tidak sesuai profil: 15; struktur kepemilikan kompleks (nominee): 15.</p>
        <p><strong>Nasabah X:</strong> perusahaan dagang, direksi nominee (15), usaha tunai-intensif (20), 3 bulan pertama transaksi 10× proyeksi awal (15). Total = <strong>50</strong>.</p>
        <p><strong>Interpretasi:</strong> &lt; 30 = CDD standar; 30–60 = <strong>EDD</strong> (verifikasi sumber dana, kunjungan usaha, monitoring ketat); &gt; 60 = tolak/akhiri hubungan. Skor 50 → EDD: bank wajib <em>memahami</em> dari mana uangnya — bukan sekadar mencatat. Angka ini artinya <strong>kewajiban menggali, bukan vonis bersalah</strong>. Banyak bank gagal bukan karena tidak punya skor, tapi karena skor 50 tidak mengubah perlakuan apa pun.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: STR, Blokir, atau Pantau?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Respons AML</h2>
      <p>Menemukan pola mencurigakan bukan akhir — ia awal dari tiga pilihan sulit:</p>
      <p><strong>Skenario A — pantau dulu vs blokir sekarang.</strong> Pantau jika: indikasi jaringan (butuh petakan 2–4 minggu untuk STR yang kuat), nilai belum kritis, dan ada koordinasi dengan PPATK/penegak hukum. Blokir jika: dana akan hilang (transfer keluar negeri segera), ada korban yang bisa diselamatkan (fraud), atau perintah regulator. Aturan: <strong>kesabaran untuk jaringan, kecepatan untuk korban</strong>.</p>
      <p><strong>Skenario B — kapan STR wajib.</strong> Bukan &ldquo;saat yakin 100%&rdquo; — standar STR adalah <strong>indikasi patut diduga</strong>, bukan pembuktian. Menunggu kepastian = STR terlambat = pelanggaran kewajiban lapor. Tapi juga bukan &ldquo;semua yang aneh&rdquo; — bank yang mengirim 10.000 STR/bulan berkualitas rendah akan kehilangan kredibilitas di mata PPATK. Keseimbangan: <strong>STR untuk pola, pantau untuk anomali tunggal</strong>.</p>
      <p><strong>Skenario C — tipping-off dalam praktik.</strong> Nasabah EDD menanyakan kenapa dananya &ldquo;ditahan untuk verifikasi&rdquo;. Skrip yang aman: alasan prosedural generik, tidak menyebut investigasi/PPATK/AML, tawarkan jalur resmi (cabang). Semua staf front-office <strong>wajib</strong> dilatih skrip ini — satu slip &ldquo;bapak sedang kami investigasi&rdquo; = pelanggaran pidana. Ini bukan teori: ini <em>pelatihan berulang</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tujuan AML bukan menangkap penjahat — itu tugas penegak hukum. Tujuan bank adalah <strong>membangun jejak yang lengkap &amp; bisa diaudit</strong>: KYC benar, monitoring jalan, STR tepat waktu. Regulator menghukum <em>sistem yang tidak ada</em>, bukan <em>penjahat yang lolos</em>. Mainkan peranmu, bukan peran polisi.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Aliran Dana Judol Triliunan"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: PPATK & Aliran Judi Online</h2>
      <p>PPATK melaporkan perputaran dana judi online mencapai <strong>ratusan triliun rupiah per tahun</strong> (angka resmi PPATK 2023–2024 menyebut > Rp300 triliun). Skala ini tidak mungkin tanpa <strong>infrastruktur pencucian industri</strong>:</p>
      <ol>
        <li><strong>Placement:</strong> deposit pemain via transfer bank, e-wallet, pulsa, bahkan QRIS — dipecah kecil-kecil (structuring di level pemain).</li>
        <li><strong>Layering:</strong> dikumpulkan ke rekening-rekening mule (FR1), diputar antar bank dalam hitungan menit, sebagian ke kripto via P2P.</li>
        <li><strong>Integration:</strong> dicairkan untuk operasional (server, iklan, gaji admin) &amp; keuntungan bandar — sebagian dibelanjakan aset di dalam &amp; luar negeri.</li>
      </ol>
      <p><strong>Di mana sistem AML bank berperan:</strong> ribuan rekening mule dengan pola <em>fan-in cepat → fan-out cepat</em> adalah sinyal yang <em>bisa</em> ditangkap monitoring transaksi — <strong>jika</strong> bank memantau pola lintas-rekening (graph, FR12), bukan per-rekening. Rekening individual terlihat &ldquo;sibuk tapi wajar&rdquo;; jaringannya berteriak.</p>
      <p><strong>Pelajaran untuk analis AML:</strong> kejahatan triliunan rupiah tidak dilakukan dengan transaksi triliunan rupiah — ia dilakukan dengan <strong>jutaan transaksi kecil yang terkoordinasi</strong>. Sistem yang hanya mencari &ldquo;transaksi besar mencurigakan&rdquo; buta terhadap ancaman terbesarnya. Cari <em>koordinasinya</em>, bukan <em>nominalnya</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;AML = urusan compliance, bukan urusan data.&rdquo;<br /><strong>Yang benar:</strong> compliance tanpa data = <em>teater</em> — checklist terisi, kejahatan jalan terus. AML modern adalah <strong>disiplin data</strong> (monitoring, graph, tuning) yang <em>dilaksanakan</em> oleh compliance. Analis data yang paham AML adalah salah satu profil paling langka &amp; mahal di industri keuangan Indonesia.</p>
      </div>
""",
},

# ================================================================= FR16
CONTENT3["fr16-anomali-time-series"] = {
"toc_worked": ("worked", "📐 Worked Example: Residual & CUSUM Manual"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menemukan Anomali dari Deret Waktu</h2>
      <p>Time series anomaly detection = <strong>ramalkan yang wajar, curigai selisihnya</strong>. Dua contoh manualnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: dekomposisi &amp; residual dari 7 titik</summary>
        <p>Settlement harian merchant M (Rp juta): Sen 12, Sel 13, Rab 11, Kam 14, Jum 45, Sab 13, Min 12.</p>
        <p><strong>Langkah 1 — baseline.</strong> Rata-rata 7 hari = 17,1. Tapi Jumat terlihat aneh — pakai <strong>median</strong> (robust): median = 13. Atau rata-rata tanpa Jumat = 12,5. Pilih baseline 12,5–13.</p>
        <p><strong>Langkah 2 — residual.</strong> Residual = aktual − baseline. Jumat: 45 − 12,5 = <strong>+32,5</strong> (260% di atas normal). Hari lain: residual ±1,5.</p>
        <p><strong>Langkah 3 — ambang.</strong> Standar deviasi hari normal ≈ 1,1. Skor z Jumat = 32,5/1,1 ≈ <strong>29σ</strong> — bukan &ldquo;sedikit aneh&rdquo;, tapi <em>mustahil</em> secara statistik. Inilah kekuatan residual: mengubah &ldquo;45 terlihat besar&rdquo; (subjektif) menjadi &ldquo;29 standar deviasi&rdquo; (objektif &amp; bisa dibandingkan lintas merchant).</p>
        <p><strong>Langkah 4 — konteks.</strong> Cek kalender: Jumat itu bukan Harbolnas, bukan gajian. Cek pola: 45jt dari 3 transaksi @15jt jam 02.00–03.00. <strong>Anomali statistik + konteks mencurigakan = eskalasi.</strong> Anomali statistik tanpa konteks = mungkin cuma promo.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: CUSUM — menangkap pergeseran kecil yang persisten</summary>
        <p>CUSUM mendeteksi <strong>perubahan level kecil tapi terus-menerus</strong> — yang tidak terlihat sebagai satu titik ekstrem. Cocok untuk: pencurian bertahap (skimming), fee fraud.</p>
        <p>Data: refund rate harian merchant (%): 2,1; 2,3; 2,0; 2,4; 2,2; 3,1; 3,3; 3,0; 3,4; 3,2. Target (rata-rata historis) = 2,2%.</p>
        <p><strong>Langkah 1 — hitung deviasi kumulatif.</strong> S_h = max(0, S_{h-1} + (x_h − target − k)), dengan k = 0,5×σ ≈ 0,2 (toleransi noise).</p>
        <p><strong>Langkah 2 — jalankan.</strong> Hari 1–5: deviasi kecil → S tetap 0. Hari 6: (3,1−2,2−0,2)=0,7 → S=0,7. Hari 7: +0,9 → S=1,6. Hari 8: +0,6 → S=2,2. Hari 9: +1,0 → S=3,2. Hari 10: +0,8 → S=4,0.</p>
        <p><strong>Langkah 3 — ambang.</strong> Dengan batas h = 3, alarm menyala di <strong>hari ke-9</strong> — padahal tidak satu pun hari yang &ldquo;ekstrem&rdquo; sendirian (maks 3,4%). Inilah keunggulan CUSUM: <strong>ia mengingat</strong>. Anomali titik (point) butuh satu hari gila; anomali level (seperti ini) butuh ingatan kumulatif. Pilih metode sesuai <em>bentuk</em> serangan yang kamu takutkan.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Jenis Anomali"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Point, Contextual, atau Collective?</h2>
      <p>Tiga jenis anomali deret waktu — salah identifikasi jenis = salah metode:</p>
      <p><strong>Skenario A — point anomaly.</strong> Satu titik ekstrem (settlement 29σ seperti contoh 1). Metode: residual + z-score. Respons: investigasi langsung — <em>satu titik</em> sudah cukup bukti untuk bertanya. Cocok untuk: drain akun, transaksi tunggal jumbo.</p>
      <p><strong>Skenario B — contextual anomaly.</strong> Nilai normal di konteks salah: transaksi Rp2jt siang hari = biasa; Rp2jt <strong>jam 3 pagi</strong> dari akun yang tidak pernah transaksi malam = anomali. Metode: model dengan fitur konteks (jam, hari, musim). Jebakan terbesar: model tanpa konteks akan mem-flag semua transaksi malam (termasuk pekerja shift) atau tidak mem-flag apa pun. <strong>Konteks bukan aksesori — ia separuh definisi anomali.</strong></p>
      <p><strong>Skenario C — collective anomaly.</strong> Tiap titik normal, <em>koleksinya</em> aneh: 50 transaksi Rp900rb berurutan (tidak satu pun ekstrem, tapi polanya robotik). Metode: fitur agregat window (count, entropy, autokorelasi) + CUSUM. Ini pola <strong>structuring &amp; skimming</strong> — penjahat yang tahu cara menghindari deteksi titik. Jika sistemmu hanya punya deteksi point, penjahat yang cerdas <em>tidak akan pernah</em> terlihat.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> anomali tanpa konteks waktu = <strong>alarm palsu yang rajin</strong>. Selalu tanyakan tiga hal sebelum eskalasi: (1) aneh dibanding <em>apa</em>? (baseline yang tepat), (2) aneh di <em>konteks</em> apa? (jam/hari/musim), (3) aneh <em>seberapa lama</em>? (titik vs pola). Tiga jawaban ini mengubah angka menjadi cerita.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Settlement Tengah Malam"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Merchant yang &ldquo;Panen&rdquo; Jam 2 Pagi</h2>
      <p>Temuan monitoring agregator pembayaran (pola umum): merchant kuliner di kota kecil — yang normalnya settlement Rp2–5jt/hari di jam makan — tiba-tiba mencatat settlement <strong>Rp180jt dalam 3 jam (01.00–04.00)</strong>.</p>
      <p><strong>Analisis deret waktunya:</strong> (1) <em>point anomaly</em>: 180jt vs baseline 3,5jt = 51× lipat; (2) <em>contextual</em>: jam 01.00–04.00 vs jam operasional 08.00–22.00 — mustahil ada pelanggan; (3) <em>collective</em>: 120 transaksi @Rp1,5jt seragam — entropy nominal mendekati nol (manusia tidak belanja seseragam itu).</p>
      <p><strong>Hasil investigasi:</strong> merchant &ldquo;disewa&rdquo; sindikat — EDC/QRIS-nya dipakai menggesek kartu-kartu curian semalaman, dana settlement dibagi. Kerugian: Rp180jt − fee ≈ <strong>Rp175jt dalam satu malam</strong> dari satu merchant. Tanpa deteksi deret waktu, pola ini baru ketahuan berminggu-minggu kemudian saat chargeback masuk — dan uangnya sudah cair.</p>
      <p><strong>Pelajaran desain:</strong> monitor <strong>per-merchant</strong>, bukan cuma agregat platform. Agregat 10.000 merchant menyembunyikan 1 merchant gila (sinyalnya tenggelam). Dan monitor dalam <strong>multi-resolusi</strong>: harian untuk tren, per-jam untuk serangan kilat. Serangan ini selesai dalam 3 jam — dashboard harian baru &ldquo;melihatnya&rdquo; keesokan pagi, saat uang sudah pergi.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Anomali = fraud, jadi langsung blokir.&rdquo;<br /><strong>Yang benar:</strong> anomali deret waktu juga dipicu <strong>promo, viral, musim, bug data</strong>. Merchant yang settlement-nya 50× lipat karena masuk TV nasional <em>terlihat identik</em> dengan merchant yang disewa sindikat — di angka mentahnya. Bedanya ada di <em>konteks</em> (pola nominal, jam, histori). Blokir otomatis dari anomali murni = menghukum kesuksesan.</p>
      </div>
""",
},

# ================================================================= FR17
CONTENT3["fr17-explainability"] = {
"toc_worked": ("worked", "📐 Worked Example: Membaca SHAP & Menulis Reason Code"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dari Skor ke Cerita yang Bisa Dipertahankan</h2>
      <p>Explainability = <strong>menerjemahkan skor menjadi alasan</strong> yang dipahami manusia yang tepat. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca SHAP force plot (angka konkret)</summary>
        <p>Transaksi Rp7,5jt mendapat skor fraud 0,87. Baseline model (rata-rata) = 0,12. SHAP memecah selisih 0,75 menjadi kontribusi fitur:</p>
        <p><strong>Kontribusi positif (mendorong ke fraud):</strong> velocity_1h_ratio = 200 → +0,34; device_baru = ya → +0,21; nominal/p95_nasabah = 8,2 → +0,14; jam 02.40 (deviasi pola) → +0,09. <strong>Kontribusi negatif (menahan):</strong> umur_akun 4 tahun → −0,02; tidak ada histori dispute → −0,01.</p>
        <p><strong>Langkah 1 — verifikasi konsistensi.</strong> 0,12 + 0,34 + 0,21 + 0,14 + 0,09 − 0,02 − 0,01 = <strong>0,87</strong> ✓ (SHAP bersifat aditif — jumlahnya harus pas).</p>
        <p><strong>Langkah 2 — baca ceritanya.</strong> &ldquo;Transaksi ini dicurigai <strong>terutama</strong> karena velocity 200× normal (+0,34) dan device baru (+0,21) — dua sinyal terkuat. Nominal besar hanya pendukung (+0,14). Akun yang berumur menahan sedikit kecurigaan (−0,02) tapi tidak cukup.&rdquo;</p>
        <p><strong>Langkah 3 — yang TIDAK boleh disimpulkan.</strong> SHAP menjelaskan <em>model</em>, bukan <em>dunia</em>: &ldquo;velocity berkontribusi +0,34 pada skor&rdquo; ≠ &ldquo;velocity <em>menyebabkan</em> fraud&rdquo;. Untuk investigator ini cukup; untuk klaim kausal butuh analisis terpisah. <strong>Jelaskan model dengan jujur, jangan lebihkan.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menulis reason code untuk tiga penonton</summary>
        <p>Satu keputusan (blokir transaksi Rp7,5jt di atas), tiga versi penjelasan:</p>
        <p><strong>Untuk investigator (teknis):</strong> &ldquo;Skor 0,87. Pemicu utama: velocity_1h 200× baseline (4 trx/15 mnt), device fingerprint baru, nominal 8,2× p95 nasabah. Penahan: akun 4 tahun, histori bersih. Rekomendasi: verifikasi via telepon sebelum lepas blokir.&rdquo;</p>
        <p><strong>Untuk nasabah (sederhana &amp; empatik):</strong> &ldquo;Kami menahan sementara transaksi ini karena pola yang tidak biasa: beberapa transaksi cepat dari perangkat baru pada jam tidak biasa. Ini untuk melindungi akun Anda. Hubungi kami untuk verifikasi 2 menit.&rdquo; — <em>tanpa</em> menyebut skor, SHAP, atau &ldquo;fraud&rdquo;.</p>
        <p><strong>Untuk regulator/auditor (formal):</strong> &ldquo;Keputusan blokir otomatis berdasarkan model v2.3 (dokumen validasi #...). Fitur penentu: velocity ternormalisasi, status device, deviasi nominal — ketiganya di atas ambang yang ditetapkan dalam risk appetite statement. Nasabah diberi jalur banding via CS 24 jam (SOP-...).&rdquo;</p>
        <p><strong>Pelajaran:</strong> <em>satu kebenaran, tiga bahasa</em>. Tim yang hanya bisa menjelaskan secara teknis akan kalah di meja regulator; yang hanya bisa bahasa regulator tidak bisa memperbaiki model. Dokumentasikan ketiganya sejak awal.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Metode untuk Tiap Kebutuhan"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: SHAP, Surrogate, atau Inheren?</h2>
      <p>Tiga pendekatan, tiga situasi:</p>
      <p><strong>Skenario A — butuh penjelasan per-keputusan, cepat.</strong> Pakai <strong>SHAP (TreeSHAP untuk GBM)</strong>: akurat, konsisten, cukup cepat untuk real-time (precompute). Cocok untuk: reason code investigator &amp; dashboard. Batasnya: mahal untuk model non-tree &amp; data besar — sampling diperlukan.</p>
      <p><strong>Skenario B — butuh &ldquo;aturan global&rdquo; yang bisa dicetak.</strong> Latih <strong>surrogate model</strong> (pohon keputusan dangkal) untuk meniru model kompleks — hasilnya 10–20 aturan &ldquo;jika-maka&rdquo; yang bisa ditempel di dinding ruang investigator. Akurasinya meniru ~90% model asli: cukup untuk <em>pemahaman</em>, tidak untuk <em>keputusan</em>. Cocok untuk: training investigator baru &amp; dokumentasi regulator.</p>
      <p><strong>Skenario C — regulasi menuntut model yang inherently interpretable.</strong> Di beberapa yurisdiksi/produk (skor kredit!), model black-box <em>dilarang</em>. Solusi: <strong>model yang memang transparan</strong> (logistic regression, GAM, scorecard) — terima AUC 2–3 poin lebih rendah sebagai <em>harga kepatuhan</em>. Ini bukan kekalahan teknis; ini <strong>biaya lisensi untuk beroperasi</strong>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Model yang akurat tidak butuh dijelaskan — hasilnya yang penting.&rdquo;<br /><strong>Yang benar:</strong> di industri teregulasi, <strong>keputusan tanpa penjelasan = keputusan yang tidak bisa dipertahankan</strong> — di depan nasabah yang komplain, auditor yang memeriksa, dan regulator yang bertanya. Model yang tidak bisa dijelaskan bukan model yang buruk; ia <em>risiko hukum yang berjalan</em>.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Nasabah Protes ke OJK"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: &ldquo;Kenapa Rekening Saya Diblokir?!&rdquo;</h2>
      <p>Skenario yang terjadi di beberapa bank Indonesia: nasabah UMKM — rekeningnya dipakai terima pembayaran supplier — tiba-tiba diblokir sistem AML karena pola <em>fan-in cepat</em> (banyak transfer masuk lalu langsung dibayar ke supplier = terlihat seperti layering mule!). Nasabah mengamuk di cabang, lalu mengadu ke OJK.</p>
      <p><strong>Yang membedakan respons baik vs buruk:</strong></p>
      <ol>
        <li><strong>Buruk:</strong> CS menjawab &ldquo;sistem yang memblokir, kami tidak tahu kenapa&rdquo; → nasabah makin marah → aduan OJK → bank diminta penjelasan tertulis → tidak bisa menjelaskan → sanksi administratif + reputasi.</li>
        <li><strong>Baik:</strong> CS membuka reason code: &ldquo;rekening Bapak menerima 47 transfer dalam 2 jam lalu meneruskannya — pola ini mirip penyalahgunaan rekening. Kami perlu verifikasi: boleh tunjukkan invoice supplier?&rdquo; → nasabah menunjukkan invoice → blokir dibuka 30 menit → nasabah justru <em>percaya</em> banknya protektif.</li>
      </ol>
      <p><strong>Pelajaran:</strong> explainability bukan sekadar &ldquo;fitur model&rdquo; — ia <strong>infrastruktur kepercayaan</strong>. Satu penjelasan yang baik mengubah insiden blokir menjadi momen loyalitas; satu &ldquo;tidak tahu&rdquo; mengubahnya menjadi aduan regulator. Investasi di reason code &amp; training CS <em>adalah</em> investasi risk management.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji explainability-mu dengan pertanyaan: <strong>&ldquo;bisakah CS menjelaskan keputusan ini ke nasabah yang marah dalam 2 menit?&rdquo;</strong> Jika tidak, sistemmu belum siap produksi — sebagus apa pun AUC-nya. Model yang baik menjawab &ldquo;berapa skornya&rdquo;; sistem yang baik menjawab &ldquo;kenapa&rdquo;.</p>
      </div>
""",
},

# ================================================================= FR18
CONTENT3["fr18-mlops"] = {
"toc_worked": ("worked", "📐 Worked Example: Ukuran A/B Test & Aturan Rollback"),
"worked": """
      <h2 id="worked">📐 Worked Example: Mendeploy Model Tanpa Berjudi</h2>
      <p>MLOps = <strong>statistik + disiplin operasional</strong>. Dua perhitungan yang memisahkan deploy profesional dari &ldquo;coba-coba di produksi&rdquo;.</p>

      <details className="worked">
        <summary>📐 Contoh 1: berapa lama A/B test champion vs challenger?</summary>
        <p>Challenger diklaim menaikkan precision dari 20% ke 24% (di 1.000 flag/hari). Ingin bukti statistik: power 80%, signifikansi 95%.</p>
        <p><strong>Langkah 1 — rumus ukuran sampel per grup (proporsi).</strong></p>
        <Tex math={String.raw`n = \\frac{2 \\times \\bar{p}(1-\\bar{p}) \\times (Z_{\\alpha/2} + Z_{\\beta})^2}{\\delta^2}`} block />
        <p><Tex math={String.raw`\\bar{p}`} /> = 0,22 (rata-rata), <Tex math={String.raw`\\delta`} /> = 0,04 (selisih), Z = 1,96 + 0,84 = 2,80.</p>
        <p><strong>Langkah 2 — hitung.</strong> n = 2 × 0,22 × 0,78 × 7,84 / 0,0016 = 2,689/0,0016 ≈ <strong>1.681 flag per grup</strong>.</p>
        <p><strong>Langkah 3 — ke hari.</strong> Dengan split 50/50 dari 1.000 flag/hari → 500 flag/hari per grup → <strong>3,4 hari → bulatkan 7 hari</strong> (cakup pola mingguan!). Pelajaran: A/B test fraud yang &ldquo;3 hari cukup&rdquo; sering salah karena <strong>pola weekend ≠ weekday</strong> — selalu kelipatan 7 hari.</p>
        <p><strong>Langkah 4 — jebakan.</strong> Selama test, label fraud butuh waktu berminggu-minggu (FR4, label lag!) — jadi &ldquo;precision&rdquo; tidak bisa diukur langsung. Solusi: ukur <strong>proksi cepat</strong> (precision vs label investigator 7-hari, bukan label final) + <strong>metrik operasional</strong> (flag rate, review time). A/B test fraud = mengukur dengan proksi sambil menunggu kebenaran.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: aturan rollback yang objektif</summary>
        <p>Model v2.4 baru deploy 3 hari. Precision harian: hari-1: 19%, hari-2: 16%, hari-3: 14%. Baseline v2.3: 21% ± 2%.</p>
        <p><strong>Langkah 1 — tentukan ambang sebelum deploy</strong> (bukan setelah panik!). Aturan yang ditetapkan: rollback jika <em>precision 3 hari beruntun &gt; 2σ di bawah baseline</em> (2σ = 4 poin → ambang 17%) ATAU <em>flag rate naik &gt; 50%</em> ATAU <em>error pipeline</em>.</p>
        <p><strong>Langkah 2 — terapkan.</strong> Hari-2 (16%) = peringatan pertama. Hari-3 (14%) = <strong>hari kedua di bawah 17%</strong> — belum 3 hari, tapi tren jelas turun + flag rate naik 35%. Keputusan: <strong>rollback ke v2.3 sekarang</strong>, investigasi kemudian.</p>
        <p><strong>Langkah 3 — prinsipnya.</strong> Rollback harus <strong>murah &amp; cepat</strong> (&lt; 15 menit, satu perintah) — karena rollback yang ribet tidak akan dipakai saat dibutuhkan. Dan aturan rollback ditulis <em>sebelum</em> deploy, saat kepala dingin — bukan saat dashboard merah dan semua orang panik. <strong>Disiplin yang ditulis saat tenang menyelamatkanmu saat kacau.</strong></p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Strategi Rilis"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Shadow, Canary, atau A/B Penuh?</h2>
      <p>Tiga strategi rilis model — pilih sesuai risiko:</p>
      <p><strong>Skenario A — shadow deployment.</strong> Model baru jalan <em>paralel</em>, skornya dicatat tapi <strong>tidak dipakai</strong> untuk keputusan. Cocok untuk: model generasi pertama, perubahan besar arsitektur. Keuntungan: nol risiko operasional + data perbandingan 2–4 minggu. Harga: biaya komputasi ganda. <strong>Selalu mulai dari sini</strong> untuk model penting.</p>
      <p><strong>Skenario B — canary 5%.</strong> Model baru dipakai untuk 5% traffic. Cocok untuk: iterasi minor (retrain rutin, tambah 2 fitur). Jika metrik 5% aneh → dampak terbatas, rollback mudah. Aturan: canary <em>acak</em> (bukan &ldquo;5% traffic pagi&rdquo; — bias waktu!).</p>
      <p><strong>Skenario C — A/B 50/50 penuh.</strong> Hanya jika: (1) shadow &amp; canary lolos, (2) butuh bukti statistik untuk keputusan besar (ganti vendor, arsitektur baru), (3) siap dengan ukuran sampel yang benar (contoh 1). Jangan A/B untuk setiap retrain minor — <em>overhead</em> eksperimennya lebih mahal daripada manfaatnya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model terbaik di notebook bisa jadi yang terburuk di produksi — yang menang adalah <strong>yang paling bisa dioperasikan</strong>: termonitor, bisa rollback, perilakunya dipahami. MLOps bukan birokrasi; ia <em>asuransi</em> terhadap malam-malam tanpa tidur.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Deploy Saat Harbolnas 10× Traffic"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Baru vs 10× Traffic Harbolnas</h2>
      <p>E-commerce Indonesia menjadwalkan deploy model fraud v3.0 — <strong>seminggu sebelum 11.11</strong>. Traffic Harbolnas: 10× normal. Yang terjadi adalah katalog bencana MLOps:</p>
      <ol>
        <li><strong>Latensi:</strong> model baru 2× lebih berat → p95 latensi 45ms → 120ms saat traffic 10×. Checkout melambat, konversi turun 3% = <strong>miliaran rupiah GMV</strong> menguap.</li>
        <li><strong>Drift perilaku:</strong> model dilatih di data normal — di Harbolnas, <em>perilaku legit sendiri</em> berubah (FR10) → false positive 6× lipat → tim review tenggelam.</li>
        <li><strong>Rollback macet:</strong> tidak ada runbook rollback yang dites — butuh 4 jam untuk kembali ke v2.0, di tengah puncak flash sale.</li>
      </ol>
      <p><strong>Aturan yang lahir dari insiden ini (praktik umum industri):</strong> (1) <strong>freeze deploy</strong> H-14 sampai H+7 event besar — tidak ada model baru, hanya tuning darurat; (2) <strong>load test 10×</strong> wajib sebelum deploy apa pun; (3) <strong>rollback drill</strong> tiap kuartal (seperti latihan kebakaran); (4) <strong>model &ldquo;mode hemat&rdquo;</strong>: versi ringan yang otomatis aktif saat traffic &gt; 5× — akurasi sedikit turun, tapi tidak pernah down.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;MLOps = urusan DevOps, bukan urusan data scientist.&rdquo;<br /><strong>Yang benar:</strong> data scientist yang tidak paham deploy = <strong>koki yang tidak tahu cara menyajikan</strong> — masakannya enak di dapur, tidak pernah sampai ke meja. Di fraud, model yang tidak termonitor = model yang diam-diam membusuk sambil tetap memblokir nasabah. <em>Ownership</em> model berakhir saat ia pensiun dengan baik, bukan saat ia deploy.</p>
      </div>
""",
},
