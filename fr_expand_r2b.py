# Round 2b: fr9 - fr16
R2B = {}

R2B["fr9-evaluasi"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Metrik adalah Kontrak"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Metrik adalah Kontrak</h2>
      <p>Setiap kali kamu memilih metrik, kamu menandatangani <strong>kontrak perilaku</strong> dengan tim: &ldquo;optimasi akurasi&rdquo; = kontrak untuk mengabaikan minoritas; &ldquo;optimasi recall&rdquo; = kontrak untuk membanjiri investigator; &ldquo;optimasi rupiah&rdquo; = kontrak untuk berpikir seperti pemilik bisnis. <strong>Model mengikuti metrik seperti air mengikuti selokan</strong> — jadi pilih selokannya dengan sadar.</p>
      <p>Intuisi kedua: <strong>evaluasi yang baik itu adversarial</strong> — ia berusaha <em>membuktikan model salah</em>, bukan membuktikan model benar. Slice evaluation (per segmen: nominal, kanal, jam), stress test (bagaimana saat serangan 10×?), dan evaluasi dengan label tertunda adalah cara &ldquo;menyerang&rdquo; modelmu sendiri <em>sebelum</em> dunia nyata melakukannya. Tim yang jatuh cinta pada modelnya berhenti menguji; tim yang curiga padanya menemukan kelemahan saat masih murah diperbaiki.</p>
      <p><strong>Kapan evaluasi standar ini TIDAK cukup:</strong> (1) saat <strong>label evaluasi terkontaminasi</strong> (label lag FR4) — metrikmu mengukur masa lalu, bukan sekarang; pakai proksi + audit; (2) saat <strong>distribusi berubah</strong> (drift FR10) — evaluasi di data lama = nostalgia; (3) saat <strong>keputusan melibatkan manusia</strong> — metrik model ≠ metrik sistem (investigator bisa membatalkan/memperbaiki); ukur <em>end-to-end</em>, bukan model sendirian.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum menghitung metrik apa pun, tulis <strong>keputusan</strong> yang akan diambil dari angkanya. &ldquo;Jika precision &lt; 15%, kita naikkan threshold; jika &gt; 30%, kita tambah auto-block.&rdquo; Metrik tanpa keputusan = dekorasi dashboard.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Evaluasi"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Evaluasi</h2>
      <details className="worked">
        <summary>Q1: Satu metrik utama — apa yang paling direkomendasikan?</summary>
        <p><strong>Expected value dalam rupiah</strong> (worked example 2): ia satu-satunya metrik yang <em>langsung</em> menjawab keputusan bisnis. Untuk monitoring harian: <strong>precision@kapasitas</strong> (presisi pada volume flag yang bisa di-review). Untuk perbandingan model: <strong>PR-AUC</strong>. Tiga metrik, tiga fungsi — jangan paksa satu metrik melakukan semuanya.</p>
      </details>
      <details className="worked">
        <summary>Q2: PR-AUC vs ROC-AUC — kapan masing-masing?</summary>
        <p><strong>PR-AUC</strong> saat positif &lt; 5% (hampir selalu di fraud) — ia tidak &ldquo;diencerkan&rdquo; oleh TN raksasa. <strong>ROC-AUC</strong> hanya saat kelas seimbang atau untuk komunikasi dengan orang yang hanya kenal ROC. Aturan praktis: <em>jika kamu harus memilih satu, pilih PR-AUC</em> — dan selalu tampilkan berdampingan dengan precision@recall operasional agar tidak abstrak.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana memilih threshold dari kurva metrik?</summary>
        <p><strong>Tiga kandidat, pilih yang paling ketat:</strong> (1) threshold biaya τ* (FR7), (2) threshold kapasitas (FR11), (3) threshold kebijakan (misal &ldquo;precision minimal 20%&rdquo;). Final = max(ketiganya). Dan <em>dokumentasikan alasannya</em> — threshold tanpa dokumentasi akan dipertanyakan setiap ada insiden, dan kamu tidak ingin menjawab dari ingatan.</p>
      </details>
      <details className="worked">
        <summary>Q4: A/B test untuk model fraud — apa jebakannya?</summary>
        <p>Tiga jebakan khas: (1) <strong>label lag</strong> — hasil &ldquo;presisi&rdquo; baru valid berminggu-minggu kemudian; pakai proksi cepat + metrik operasional; (2) <strong>interferensi</strong> — challenger yang memblokir mengubah perilaku yang dilihat champion (tidak independen!); (3) <strong>musiman</strong> — test harus kelipatan 7 hari. A/B test fraud = eksperimen dengan <em>kebenaran yang tertunda</em> — rancang dengan sabar.</p>
      </details>
""",
},

R2B["fr10-drift"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Dunia Bergerak, Model Diam"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Dunia Bergerak, Model Diam</h2>
      <p>Model adalah <strong>foto dunia pada tanggal training</strong>. Dunia — perilaku nasabah, taktik penjahat, ekonomi, musim — terus bergerak setelah foto diambil. Drift bukan kegagalan; ia <strong>hukum fisika</strong> sistem ML. Pertanyaannya bukan &ldquo;apakah akan drift?&rdquo; tapi &ldquo;<em>seberapa cepat</em> dan <em>apakah kita melihatnya datang</em>?&rdquo;</p>
      <p>Intuisi kedua: <strong>tidak semua perubahan adalah drift yang butuh respons</strong>. Ada <em>noise</em> (fluktuasi harian — abaikan), <em>seasonality</em> (Ramadan, Harbolnas — jadwalkan), <em>drift gradual</em> (perilaku bergeser — kalibrasi), <em>drift tiba-tiba</em> (serangan/bug — respons darurat). Empat jenis, empat respons. Dashboard yang hanya berteriak &ldquo;DRIFT!&rdquo; tanpa klasifikasi = alarm kebakaran yang bunyi saat ada yang masak — lama-lama tidak didengar siapa pun.</p>
      <p><strong>Kapan monitoring drift ini TIDAK berguna:</strong> (1) <strong>tanpa baseline yang benar</strong> — membandingkan Oktober dengan Januari tanpa memperhitungkan musim = menemukan &ldquo;drift&rdquo; yang sebenarnya kalender; (2) <strong>tanpa aksi yang terdefinisi</strong> — alert yang tidak memicu siapa pun melakukan apa pun = spam; (3) <strong>saat yang berubah adalah <em>label</em>, bukan fitur</strong> (definisi fraud diubah) — itu masalah governance, bukan drift.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rancang monitoring dengan pertanyaan: <strong>&ldquo;jika angka ini merah jam 3 pagi, siapa yang bangun dan melakukan apa?&rdquo;</strong> Jika jawabannya &ldquo;tidak ada&rdquo; — metrik itu belum siap jadi alert; ia masih sekadar grafik.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Drift"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Drift</h2>
      <details className="worked">
        <summary>Q1: Seberapa sering harus memonitor drift?</summary>
        <p><strong>Fitur &amp; prediksi: harian</strong> (otomatis, murah). <strong>Performa vs label: mingguan–bulanan</strong> (menunggu label matang). <strong>Review mendalam: kuartalan</strong> (manusia membaca tren + konteks bisnis). Yang penting bukan frekuensi — tapi <strong>setiap frekuensi punya pemilik &amp; aksi</strong>. Monitor harian tanpa pemilik = log yang tidak dibaca.</p>
      </details>
      <details className="worked">
        <summary>Q2: Ambang PSI 0,1 / 0,25 — harga mati?</summary>
        <p><strong>Tidak — itu titik awal.</strong> Kalibrasi dengan datamu: jalankan PSI historis 12 bulan, lihat distribusi &ldquo;normal&rdquo;-nya, set ambang di persentil-95 periode tenang. Untuk fitur kritis (velocity), ambang lebih ketat; untuk fitur musiman, bandingkan <em>year-over-year</em> bukan month-over-month. <strong>Ambang yang dikalibrasi &gt; ambang textbook.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana membedakan drift vs seasonality?</summary>
        <p><strong>Tiga uji:</strong> (1) <em>apakah pernah terjadi di periode yang sama tahun lalu?</em> (ya → musiman); (2) <em>apakah kembali normal setelah periode berlalu?</em> (ya → musiman); (3) <em>apakah analis bisnis mengenalinya?</em> (&ldquo;oh, itu Ramadan&rdquo; → musiman). Jika ketiganya tidak → drift asli. Dan: <strong>musiman yang tidak dijadwalkan = drift yang memalukan</strong> — kalender regime (FR5) adalah obatnya.</p>
      </details>
      <details className="worked">
        <summary>Q4: Auto-retrain saat drift terdeteksi — boleh?</summary>
        <p><strong>Hampir tidak pernah fully-otomatis.</strong> Bahaya: melatih dengan data serangan (menormalkan serangan), data terkontaminasi label-lag, atau menutupi bug pipeline. Yang boleh otomatis: <em>recalibrasi threshold</em> dalam batas yang ditetapkan + <em>alert</em> ke manusia. Retrain = keputusan manusia dengan data mesin, bukan sebaliknya. <strong>Otomatisasi mempercepat eksekusi, bukan menghilangkan penilaian.</strong></p>
      </details>
""",
},

R2B["fr11-threshold"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Threshold adalah Anggaran Belanja"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Threshold adalah Anggaran Belanja</h2>
      <p>Setiap threshold adalah <strong>anggaran belanja</strong>: &ldquo;dengan 800 slot review/hari, di mana kita belanjakan?&rdquo; Menaikkan threshold = memotong anggaran (lebih sedikit ditangkap, lebih hemat). Menurunkan = menambah belanja (lebih banyak ditangkap, lebih mahal). <strong>Tidak ada threshold yang &ldquo;benar&rdquo; — hanya ada alokasi yang bisa dipertanggungjawabkan.</strong> Dan seperti anggaran, ia harus ditinjau berkala — karena &ldquo;harga&rdquo; (biaya review, nilai fraud) berubah.</p>
      <p>Intuisi kedua: <strong>threshold yang baik tidak terlihat</strong> — nasabah legit tidak pernah tahu ia ada, penjahat merasa &ldquo;sial terus&rdquo;. Threshold yang buruk terlihat dari dua sisi: nasabah komplain diblokir (terlalu ketat) atau fraud merajalela (terlalu longgar). <strong>Keluhan adalah metrik threshold</strong> — monitor rasio komplain blokir sebagai sinyal, bukan sekadar gangguan.</p>
      <p><strong>Kapan satu threshold TIDAK cukup:</strong> (1) <strong>segmen dengan ekonomi berbeda</strong> (Rp50rb vs Rp50jt — worked example FR7); (2) <strong>kondisi serangan vs normal</strong> (mode darurat); (3) <strong>kanal dengan UX berbeda</strong> (QRIS tatap muka vs transfer online — biaya false positive-nya beda jauh). Setiap perbedaan ekonomi yang material = kandidat threshold terpisah. Tapi batasi: <strong>maksimal 3–5 threshold</strong> — lebih dari itu tidak ada yang bisa menjelaskan sistemnya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dokumentasikan setiap threshold dalam satu kalimat: <strong>&ldquo;0,05 karena kapasitas 800/hari; direview tiap kuartal; pemilik: [nama].&rdquo;</strong> Threshold tanpa pemilik = angka yatim yang tidak ada yang berani ubah — bahkan saat sudah jelas salah.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Threshold"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Threshold</h2>
      <details className="worked">
        <summary>Q1: Siapa yang seharusnya menentukan threshold — data scientist atau bisnis?</summary>
        <p><strong>Bersama, dengan peran jelas:</strong> data scientist menghitung <em>kandidat &amp; trade-off</em> (&ldquo;0,03 → recall 88%, butuh 1.200 review/hari&rdquo;); bisnis memutuskan <em>berdasarkan kendala nyata</em> (&ldquo;kita cuma punya 800&rdquo;). Yang gagal: data scientist menentukan sendirian (tidak tahu kendala operasional) atau bisnis menentukan tanpa data (tebak-tebakan). <strong>Threshold = titik temu matematika &amp; realitas.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Seberapa sering threshold harus di-review?</summary>
        <p><strong>Kuartalan rutin + insidental saat pemicu:</strong> perubahan biaya (gaji investigator naik), perubahan volume (±20%), serangan besar, atau model baru deploy. Review = 1 jam: lihat kurva terbaru, cek apakah asumsi masih valid, putuskan ubah/tetap + catat alasannya. <strong>Threshold yang tidak pernah di-review = keputusan lama yang mengatur dunia baru.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Auto-block — kapan aman, kapan berbahaya?</summary>
        <p><strong>Aman jika tiga syarat:</strong> (1) precision di ambang itu &gt; 80% <em>stabil 90 hari</em>, (2) ada <strong>jalur banding cepat</strong> (&lt; 1 jam) untuk korban salah blokir, (3) <strong>nilai per keputusan terbatas</strong> atau asuransi menanggung. <strong>Berbahaya untuk:</strong> first-party (butuh penilaian niat), nasabah korporat (satu kesalahan = kontrak hilang), dan pola baru. Aturan: <em>otomatisasi yang jelas, manusia untuk yang abu-abu</em> (FR14).</p>
      </details>
      <details className="worked">
        <summary>Q4: Apakah threshold bisa &ldquo;tidak adil&rdquo; ke segmen tertentu?</summary>
        <p><strong>Bisa — dan harus diaudit.</strong> Threshold global bisa mem-flag segmen tertentu (misal pekerja malam, daerah tertentu) secara tidak proporsional. Audit: bandingkan <em>flag rate &amp; precision per segmen</em> tiap kuartal. Jika satu segmen di-flag 5× lipat dengan precision sama rendahnya → <strong>threshold per-segmen atau fitur yang lebih adil</strong> dibutuhkan. Ini bukan sekadar etika — di beberapa yurisdiksi, ini <em>hukum</em>.</p>
      </details>
""",
},

R2B["fr12-graph-analytics"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Kejahatan itu Sosial"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Kejahatan itu Sosial</h2>
      <p>Kejahatan terorganisir — menurut definisinya — <strong>melibatkan organisasi</strong>: orang-orang yang saling kenal, berbagi resource, berkoordinasi. Dan organisasi <em>selalu</em> meninggalkan struktur: device yang dipakai bersama, rekening yang saling transfer, jam operasi yang sama. <strong>Graph analytics bukan teknik canggih — ia adalah pengakuan bahwa musuhmu bekerja tim.</strong> Melawan sindikat dengan model per-transaksi = melawan tim sepak bola dengan 11 duel satu lawan satu.</p>
      <p>Intuisi kedua: <strong>jaringan adalah hal termahal yang diganti penjahat</strong>. Ganti nama = gratis. Ganti KTP = Rp300rb. Ganti device = Rp1jt. Tapi <strong>membangun ulang jaringan 500 mule yang terpercaya</strong> = berbulan-bulan + risiko pengkhianatan. Setiap kali kamu membongkar satu ring via graph, kamu tidak hanya menangkap kasus — kamu <strong>menaikkan biaya operasi musuh</strong>. Itulah kemenangan strategis, bukan sekadar taktis.</p>
      <p><strong>Kapan graph TIDAK dibutuhkan:</strong> (1) <strong>fraud individual oportunis</strong> — tidak ada jaringan, tidak ada gunanya; (2) <strong>data relasi tidak ada</strong> — graph dari 1 hop = tabel biasa yang mahal; (3) <strong>keputusan real-time &lt; 50ms</strong> — query graph dalam = lambat; pakai <em>fitur graph yang di-precompute</em> (FR13); (4) <strong>tanpa analis yang bisa membaca graph</strong> — visualisasi jaringan yang tidak dipahami = seni abstrak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> mulai graph dari <strong>pertanyaan investigasi</strong>, bukan dari teknologi: &ldquo;rekening ini terhubung ke siapa?&rdquo; → 1-hop query. &ldquo;Ada komunitas tersembunyi?&rdquo; → community detection. <strong>Teknologi mengikuti pertanyaan</strong> — bukan sebaliknya.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Graph Analytics"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Graph Analytics</h2>
      <details className="worked">
        <summary>Q1: Butuh graph database (Neo4j) atau cukup SQL?</summary>
        <p><strong>Mulai dari SQL</strong> — 1–2 hop query (device sharing, fan-out) bisa ditulis dengan join/window function (FR21, kasus mule ring). <strong>Naik ke graph DB saat:</strong> butuh multi-hop real-time (&lt; 100ms), community detection rutin, atau visualisasi investigasi interaktif. Aturan: <em>buktikan nilainya dengan SQL dulu</em> — graph DB adalah investasi infra yang harus dibayar dengan temuan.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bisakah graph dipakai real-time?</summary>
        <p><strong>Lookup dangkal (1–2 hop): ya</strong> — &ldquo;device ini dipakai berapa rekening?&rdquo; bisa &lt; 50ms dengan index tepat. <strong>Analisis dalam (community, propagation): tidak</strong> — itu batch harian, hasilnya disimpan sebagai <em>fitur</em> di feature store. Arsitektur: <strong>online untuk yang dangkal, batch untuk yang dalam</strong> (FR13 skenario C).</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan privasi — graph kan menghubungkan orang?</summary>
        <p><strong>Justru di sinilah risiko terbesar.</strong> Graph bisa menghubungkan orang yang tidak bersalah (E di worked example 2 — korban/penerima biasa). Prinsip: (1) <strong>skor graph = prioritas investigasi, bukan vonis</strong>; (2) batasi hop propagation (2–3); (3) <strong>jangan simpan graph sosial</strong> di luar tujuan fraud yang sah (UU PDP); (4) audit berkala: berapa &ldquo;tertular&rdquo; yang ternyata bersih? <em>Kekuatan graph menuntut tanggung jawab proporsional.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: Kapan butuh GNN (Graph Neural Network)?</summary>
        <p><strong>Jarang.</strong> 80% nilai graph di fraud = fitur sederhana (degree, shared count, 2-hop risk). GNN baru relevan saat: pola relasional <em>sangat kompleks</em> (multi-tipe node/edge), data <em>sangat besar</em>, dan tim <em>sangat mampu</em> mengoperasikannya. <strong>Urutannya: fitur graph → label propagation → GNN.</strong> Melompat langsung ke GNN = membayar harga tertinggi untuk masalah yang mungkin selesai dengan COUNT(*).</p>
      </details>
""",
},

R2B["fr13-realtime"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Waktu adalah Fitur Produk"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Waktu adalah Fitur Produk</h2>
      <p>Di fraud, <strong>latensi bukan masalah teknis — ia fitur produk</strong>. Checkout yang melambat 500ms = konversi turun = nasabah kabur ke kompetitor. Setiap milidetik yang kamu &ldquo;belanjakan&rdquo; untuk scoring harus <strong>dibayar kembali</strong> dengan fraud yang dicegah. Anggaran 50ms bukan angka magis — ia <em>hasil negosiasi</em> antara risk (ingin teliti) dan produk (ingin cepat). Analis yang paham ini merancang sistem yang <em>menang di kedua sisi</em>.</p>
      <p>Intuisi kedua: <strong>tidak semua keputusan butuh kecepatan yang sama</strong>. Blokir drain akun = milidetik. Review pola mencurigakan = menit. Bongkar jaringan = hari. Arsitektur yang memaksakan <em>semua</em> keputusan dalam 50ms = membakar uang untuk ketelitian yang tidak dibutuhkan; yang membiarkan <em>semua</em> lambat = kebocoran. <strong>Desain berdasarkan urgensi keputusan, bukan berdasarkan ambisi teknis.</strong></p>
      <p><strong>Kapan real-time TIDAK dibutuhkan:</strong> (1) <strong>keputusan yang bisa ditunda tanpa kerugian</strong> — review manual 15 menit kemudian cukup untuk pola non-drain; (2) <strong>saat biaya infra &gt; nilai yang dilindungi</strong> — transaksi Rp10rb tidak butuh scoring Rp500; (3) <strong>analisis forensik &amp; jaringan</strong> — butuh kelengkapan, bukan kecepatan. <strong>Real-time adalah kemewahan yang dibayar per milidetik</strong> — belanjakan hanya di mana ia menghasilkan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rancang dengan <strong>graceful degradation</strong>: saat sistem lambat/overload, ia <em>menurun dengan anggun</em> (fitur dikurangi, bukan mati total). Sistem yang hanya punya dua mode — sempurna atau mati — akan memilih mati di saat paling dibutuhkan.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Realtime"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Realtime</h2>
      <details className="worked">
        <summary>Q1: Berapa latensi yang &ldquo;wajar&rdquo; untuk scoring fraud?</summary>
        <p><strong>Benchmark umum:</strong> &lt; 50ms p95 untuk pembayaran instan (QRIS, kartu); &lt; 200ms untuk checkout e-commerce; &lt; 1 detik untuk transfer bank (nasabah mentolerir &ldquo;memproses&rdquo;). Tapi angka yang benar = <strong>hasil negosiasi risk × produk × data</strong>: ukur dampak konversi vs fraud yang dicegah, bukan ikut-ikutan angka orang. <em>Latensi adalah keputusan bisnis berbiaya teknis.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: Fail-open vs fail-closed — mana yang benar?</summary>
        <p><strong>Tergantung apa yang dipertaruhkan:</strong> fail-open (lewatkan saat sistem down) untuk <em>transaksi nilai kecil + UX kritis</em> — menerima kebocoran sementara demi bisnis tetap jalan. Fail-closed (tahan saat down) untuk <em>drain akun / nilai besar</em> — keamanan di atas segalanya. <strong>Keputusan ini dibuat SEBELUM insiden</strong>, didokumentasikan, dan disetujui bisnis — bukan diputuskan engineer jam 3 pagi.</p>
      </details>
      <details className="worked">
        <summary>Q3: Feature store — kapan butuh, kapan overkill?</summary>
        <p><strong>Butuh saat:</strong> &gt; 3 model memakai fitur yang sama, ada kebutuhan <em>konsistensi training-serving</em> (mencegah skew), atau fitur mahal yang harus di-precompute. <strong>Overkill saat:</strong> 1 model, fitur sedikit &amp; murah — Redis + cron cukup. <em>Jangan bangun feature store untuk 1 model</em> — itu seperti membangun gudang untuk 1 kardus.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana handle traffic 10× (Harbolnas) tanpa 10× server?</summary>
        <p><strong>Empat jurus:</strong> (1) <em>autoscaling</em> (bayar hanya saat puncak); (2) <em>model mode hemat</em> — versi ringan otomatis aktif saat load tinggi; (3) <em>load shedding</em> — lewati scoring penuh untuk transaksi risiko historis rendah; (4) <em>freeze deploy</em> H-14 event besar. Kombinasi keempatnya &gt; sekadar &ldquo;tambah server&rdquo; — karena <strong>puncak 10× bukan 10× lebih lama, hanya 10× lebih tinggi</strong>.</p>
      </details>
""",
},

R2B["fr14-case-management"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Manusia adalah Bottleneck Termahal"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Manusia adalah Bottleneck Termahal</h2>
      <p>Dalam seluruh pipeline fraud — data, model, rule, threshold — <strong>komponen termahal &amp; paling lambat adalah manusia yang me-review</strong>. Satu investigator = 60–80 case/hari = Rp25–50rb per keputusan. Setiap desain sistem (threshold, auto-decision, triage) pada dasarnya adalah <strong>manajemen kelangkaan perhatian manusia</strong>. Analis yang merancang tanpa menghitung kapasitas manusia = merancang mobil tanpa menghitung bensin.</p>
      <p>Intuisi kedua: <strong>kualitas keputusan manusia menurun dengan kelelahan — dan itu menular ke model</strong>. Investigator lelah → label buruk → model buruk bulan depan → lebih banyak false positive → investigator makin lelah. Ini <strong>spiral kematian kualitas</strong>. Melindungi investigator (beban wajar, tooling bagus, rotasi tugas) bukan &ldquo;HR issue&rdquo; — ia <strong>pemeliharaan aset data</strong> yang paling kritis.</p>
      <p><strong>Kapan case management manual TIDAK dibutuhkan:</strong> (1) <strong>pola dengan precision &gt; 95% stabil</strong> — auto-decision dengan banding; (2) <strong>nilai terlalu kecil</strong> untuk biaya review (Rp25rb review untuk sengketa Rp30rb = rugi pasti); (3) <strong>keputusan darurat serangan</strong> — kecepatan &gt; ketelitian sementara. Tapi: <strong>otomatisasi tanpa jalur banding = arogansi sistem</strong> — selalu sediakan cara bagi manusia untuk mengoreksi mesin.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ukur tim bukan dari <strong>case selesai</strong> tapi dari <strong>rupiah diselamatkan per jam</strong>. Dan ukur <em>sistem</em> dari <strong>berapa keputusan yang TIDAK butuh manusia</strong> — setiap auto-decision yang aman = jam manusia yang dibebaskan untuk yang abu-abu.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Case Management"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Case Management</h2>
      <details className="worked">
        <summary>Q1: Berapa rasio ideal investigator vs volume?</summary>
        <p><strong>Hitung mundur dari kapasitas:</strong> 1 investigator ≈ 60–80 review/hari (efektif). Jadi 6.000 flag/hari butuh ±100 orang — yang berarti <strong>targetmu seharusnya bukan rekrut 100 orang, melainkan turunkan flag ke &lt; 1.500/hari</strong> via threshold + auto-decision. Rasio &ldquo;ideal&rdquo; = <em>sedikit mungkin manusia untuk hasil maksimal</em> — manusia adalah sumber daya paling mahal, pakai untuk yang paling abu-abu.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana mencegah burnout investigator?</summary>
        <p><strong>Empat hal terbukti:</strong> (1) <em>beban wajar</em> — antrean yang selalu 3× kapasitas = keputusasaan terstruktur; (2) <em>variasi tugas</em> — rotasi antara review rutin, investigasi dalam, dan proyek perbaikan; (3) <em>umpan balik</em> — tunjukkan &ldquo;keputusanmu menangkap RpX bulan ini&rdquo; (makna!); (4) <em>jalur karir</em> — investigator senior → analis → spesialis. <strong>Turnover investigator = kehilangan label berkualitas</strong> — biayanya tidak terlihat di laporan, tapi ada di performa model 6 bulan kemudian.</p>
      </details>
      <details className="worked">
        <summary>Q3: QA sampling — berapa persen case harus di-review ulang?</summary>
        <p><strong>Berdasarkan statistik, bukan perasaan:</strong> hitung ukuran sampel untuk margin error yang diinginkan (worked example 2: ±3% → ~544 case/bulan). Praktik umum: <strong>5–10% untuk tim kecil, 2–5% untuk tim besar</strong> — dengan <em>oversampling</em> pada keputusan berisiko tinggi (nilai besar, banding). QA bukan untuk menghukum — tapi untuk <strong>mengukur &amp; memperbaiki sistem</strong>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Tooling apa yang paling berdampak untuk investigator?</summary>
        <p><strong>Yang menghemat klik &amp; konteks:</strong> (1) <em>single-pane view</em> — semua info kasus di 1 layar (tidak 7 tab); (2) <em>reason code otomatis</em> dari model (FR17) — investigator verifikasi, bukan menebak; (3) <em>one-click actions</em> dengan jejak audit; (4) <em>histori keputusan serupa</em> — &ldquo;kasus mirip diputuskan bagaimana?&rdquo;. <strong>Setiap 30 detik yang dihemat × 80 case × 20 orang = 13 jam/hari.</strong> Tooling = leverage.</p>
      </details>
""",
},

R2B["fr15-aml"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Ikuti Uangnya, Bukan Orangnya"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Ikuti Uangnya, Bukan Orangnya</h2>
      <p>Pepatah investigasi klasik: <strong>&ldquo;follow the money.&rdquo;</strong> Orang bisa berbohong, dokumen bisa dipalsukan, tapi <strong>uang yang bergerak meninggalkan jejak yang konsisten</strong> — karena ia harus melewati sistem perbankan yang tercatat. Analis AML yang hebat tidak memulai dari &ldquo;siapa yang mencurigakan?&rdquo; tapi dari &ldquo;<em>aliran</em> mana yang tidak masuk akal?&rdquo; — lalu mengikuti alirannya sampai ke orangnya.</p>
      <p>Intuisi kedua: <strong>pencucian adalah pajak atas kejahatan</strong> — pelaku <em>membayar</em> (waktu, biaya, risiko, potongan ke mule) untuk membuat uangnya terlihat bersih. Tugas sistem AML: <strong>naikkan pajak itu setinggi mungkin</strong> sampai kejahatannya tidak lagi menguntungkan. Kamu tidak harus menangkap semua — cukup buat biayanya lebih mahal daripada keuntungannya. <em>Deterrence through economics.</em></p>
      <p><strong>Kapan pendekatan AML standar TIDAK tepat:</strong> (1) <strong>fraud murni tanpa pencucian</strong> (kartu curian langsung belanja) — itu ranah fraud, jangan dipaksakan jadi STR; (2) <strong>transaksi kecil tunggal tanpa pola</strong> — pantau, jangan eskalasi; membanjiri PPATK dengan noise merusak kredibilitasmu; (3) <strong>saat korban butuh diselamatkan SEKARANG</strong> — selamatkan dulu (logika fraud), lengkapi STR kemudian. <strong>Urutan: selamatkan → petakan → laporkan.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kualitas program AML diukur bukan dari <strong>berapa STR dikirim</strong>, tapi dari <strong>berapa yang berkualitas</strong> (ditindaklanjuti PPATK/penegak hukum) + <strong>ketepatan waktu</strong> + <strong>kelengkapan jejak</strong>. 100 STR berkualitas &gt; 10.000 STR asal kirim.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: AML"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: AML</h2>
      <details className="worked">
        <summary>Q1: Apa bedanya CTR, STR, dan kapan masing-masing?</summary>
        <p><strong>CTR</strong> (Cash Transaction Report) = laporan <em>otomatis</em> untuk transaksi tunai ≥ ambang (fakta, bukan kecurigaan). <strong>STR</strong> (Suspicious Transaction Report) = laporan <em>analitis</em> saat ada indikasi mencurigakan — <strong>tidak ada ambang nominal</strong>; Rp5jt yang berpola bisa di-STR-kan, Rp5M yang wajar tidak perlu. CTR = &ldquo;ini terjadi&rdquo;; STR = &ldquo;ini mencurigakan <em>menurut analisis kami</em>&rdquo;. Keduanya wajib, jalurnya beda.</p>
      </details>
      <details className="worked">
        <summary>Q2: Tipping-off — contoh konkret yang sering kejadian?</summary>
        <p><strong>Kejadian klasik:</strong> CS yang tidak terlatih menjawab &ldquo;rekening Bapak sedang dalam investigasi PPATK&rdquo; saat nasabah protes transaksinya ditahan. Atau: relationship manager &ldquo;memberi tahu&rdquo; nasabah korporat agar &ldquo;hati-hati&rdquo;. Keduanya = <strong>pelanggaran pidana</strong>. Pencegahannya bukan sekadar SOP — tapi <strong>simulasi &amp; drill berkala</strong>: uji CS dengan skenario, seperti latihan kebakaran. Satu slip = satu perkara.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan kripto — apakah di luar jangkauan AML?</summary>
        <p><strong>Tidak.</strong> Di Indonesia, pedagang aset kripto adalah <strong>Pihak Pelapor</strong> dengan kewajiban AML (KYC, monitoring, STR). Memang lebih sulit (pseudonim, lintas negara), tapi <strong>titik masuk/keluar fiat</strong> (on/off-ramp via bank) tetap terpantau — dan di situlah pertarungan dimenangkan. Kripto bukan &ldquo;tak terlacak&rdquo;; ia <em>pseudonim dengan jejak permanen</em> (blockchain tidak lupa).</p>
      </details>
      <details className="worked">
        <summary>Q4: Denda AML — seberapa besar risikonya untuk bank menengah?</summary>
        <p><strong>Sangat material:</strong> denda administratif dapat mencapai <strong>miliaran–puluhan miliar rupiah</strong> per rangkaian pelanggaran, <em>plus</em> pembatasan usaha, <em>plus</em> biaya remidiasi (worked example 2). Dan yang tidak terlihat: <strong>kehilangan koresponden bank asing</strong> (de-risking) — yang bisa melumpuhkan bisnis trade finance. <strong>Matematikanya selalu: mencegah 5× lebih murah daripada mengobati.</strong></p>
      </details>
""",
},

R2B["fr16-anomali-time-series"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Waktu Punya Memori"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Waktu Punya Memori</h2>
      <p>Data tabular memperlakukan setiap baris sebagai independen — tapi <strong>waktu punya memori</strong>: transaksi jam 9 pagi berkaitan dengan jam 8 pagi; Senin berkaitan dengan Senin lalu. Anomali deret waktu yang baik bukan yang pintar statistik — tapi yang <strong>menghormati memori waktu</strong>: musiman, tren, autokorelasi. Model yang mengabaikan ini akan &ldquo;menemukan anomali&rdquo; setiap Senin pagi — padahal itu hanya akhir pekan yang berakhir.</p>
      <p>Intuisi kedua: <strong>pilih metode sesuai <em>bentuk</em> serangan yang ditakuti</strong>. Takut drain kilat? → deteksi point (residual/z-score). Takut pencurian bertahap (skimming)? → CUSUM. Takut pola terkoordinasi? → fitur kolektif (entropy, count). Tidak ada &ldquo;metode terbaik&rdquo; — hanya ada <strong>metode yang cocok dengan bentuk musuh</strong>. Tanyakan dulu: &ldquo;serangan seperti apa yang <em>bisa</em> lolos dari metodeku saat ini?&rdquo; — itulah blind spot-mu.</p>
      <p><strong>Kapan anomaly detection deret waktu TIDAK cocok:</strong> (1) <strong>data terlalu pendek</strong> (&lt; 2 siklus musiman) — baseline tidak terbentuk; (2) <strong>perilaku memang acak</strong> (tidak ada pola = tidak ada &ldquo;normal&rdquo;); (3) <strong>sebagai satu-satunya pertahanan</strong> — anomali butuh konteks (FR16 kasus: promo vs sindikat terlihat sama di angka); (4) <strong>tanpa resolusi waktu yang tepat</strong> — serangan 3 jam tidak terlihat di agregat harian.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> selalu monitor dalam <strong>multi-resolusi</strong>: per-jam untuk serangan kilat, harian untuk tren, mingguan untuk musiman. <strong>Satu resolusi = satu blind spot.</strong> Penjahat memilih resolusi yang tidak kamu pantau.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Anomali Time Series"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Anomali Time Series</h2>
      <details className="worked">
        <summary>Q1: Bagaimana menangani musiman (Ramadan, Harbolnas) di deteksi anomali?</summary>
        <p><strong>Tiga lapis:</strong> (1) <em>dekomposisi</em> — pisahkan musiman dari residual, deteksi di residual; (2) <em>baseline musiman</em> — bandingkan dengan periode yang sama tahun lalu, bukan rata-rata tahunan; (3) <em>kalender regime</em> — ambang otomatis menyesuaikan saat event (FR5, FR10). Yang gagal: model yang menganggap Desember = Januari. <strong>Musiman bukan anomali — ia jadwal.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: CUSUM vs ML modern — mana yang dipakai?</summary>
        <p><strong>Keduanya, untuk musuh berbeda:</strong> CUSUM untuk <em>pergeseran level kecil-persisten</em> (skimming, fee fraud) — sederhana, bisa dijelaskan, terbukti 50+ tahun. ML (LSTM/autoencoder) untuk <em>pola kompleks multivariat</em> — tapi butuh data besar &amp; sulit dijelaskan. Aturan: <em>mulai dari CUSUM + residual</em>; naik ke ML hanya jika bentuk seranganmu memang kompleks. <strong>Kesederhanaan yang tepat &gt; kecanggihan yang tidak perlu.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Multivariate — kapan 1 deret tidak cukup?</summary>
        <p>Saat <strong>anomali hanya terlihat dari <em>hubungan</em> antar deret</strong>: settlement naik + refund rate tetap 0% (tidak ada pelanggan sungguhan); volume naik + nominal rata-rata turun drastis (structuring). Deteksi univariat per deret akan melewatkannya. Praktik: mulai univariat (murah), tambah <em>rasio/korelasi antar deret</em> sebagai fitur — baru ke model multivariat penuh jika dibutuhkan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Alert fatigue — bagaimana agar tim tidak mengabaikan alarm?</summary>
        <p><strong>Empat obat:</strong> (1) <em>tiering</em> — kritis membangunkan orang, sisanya antre; (2) <em>deduplikasi</em> — 1 insiden = 1 alert (bukan 50); (3) <em>konteks di alert</em> — &ldquo;51× baseline, jam 02.00, 120 trx seragam&rdquo; bukan &ldquo;anomali terdeteksi&rdquo;; (4) <em>ukur precision alert</em> — jika &lt; 10% benar, perbaiki detektornya, jangan salahkan timnya. <strong>Alarm yang 90% salah = alarm yang 100% diabaikan.</strong></p>
      </details>
""",
},
