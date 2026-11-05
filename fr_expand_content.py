# Konten ekspansi Track T2 (fr1-fr23) — REMEDIASI DURASI
# Struktur per lesson: worked (2 contoh <details>), peta2 (skenario lanjutan + tip/myth), kasus (kasus nyata Indonesia)
# Aturan JSX: &lt; &gt; &amp; untuk < > & ; tanpa { } mentah di prosa; KaTeX via String.raw

CONTENT = {}

# ================================================================= FR1
CONTENT["fr1-lanskap-fraud"] = {
"toc_worked": ("worked", "📐 Worked Example: Expected Loss & Breakeven Pertahanan"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dari Angka ke Keputusan Prioritas</h2>
      <p>Dua contoh pengerjaan penuh — cara analis fraud mengubah data mentah menjadi keputusan &ldquo;perangi yang mana duluan&rdquo; dan &ldquo;layak tidak investasi pertahanannya&rdquo;.</p>

      <details className="worked">
        <summary>📐 Contoh 1: rate × severity — kartu kredit vs e-wallet, mana yang diperangi duluan?</summary>
        <p>Data TokoMaju, 1 bulan. <strong>Kartu kredit:</strong> 2.500 transaksi, 95 fraud, rata-rata nominal fraud Rp1,4 juta. <strong>E-wallet:</strong> 4.000 transaksi, 18 fraud, rata-rata nominal fraud Rp380 ribu.</p>
        <p><strong>Langkah 1 — fraud rate.</strong> Kartu kredit: 95/2.500 = 3,80%. E-wallet: 18/4.000 = 0,45%. Kartu kredit &ldquo;lebih pekat&rdquo; 8,4× lipat.</p>
        <p><strong>Langkah 2 — severity (kerugian per kejadian).</strong> Kartu kredit Rp1,4 juta vs e-wallet Rp380 ribu — selisih 3,7× lipat.</p>
        <p><strong>Langkah 3 — expected loss.</strong> Kartu kredit: 95 × Rp1,4 jt = <strong>Rp133 juta</strong>. E-wallet: 18 × Rp380 rb = <strong>Rp6,84 juta</strong>. Total fraud dua kanal ini 113 kasus, tapi kartu kredit menyumbang <strong>95% kerugiannya</strong>.</p>
        <p><strong>Keputusan:</strong> tim 3 orang dialokasikan 80% ke kartu kredit (3-D Secure, velocity rule, device check), 20% ke e-wallet (monitoring dasar). Intuisi kuncinya: <strong>prioritas = rate × severity × volume</strong> — bukan rate saja, bukan volume saja. Kanal dengan rate tertinggi belum tentu yang paling merugikan kalau nominalnya kecil.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: breakeven — kapan membangun tim fraud layak secara finansial?</summary>
        <p>Rumus expected loss satu periode:</p>
        <Tex math={String.raw`E[\text{Loss}] = N \times r \times s`} block />
        <p><Tex math={String.raw`N`} /> = jumlah transaksi, <Tex math={String.raw`r`} /> = fraud rate, <Tex math={String.raw`s`} /> = rata-rata severity (Rp per fraud). Angka ini artinya: <strong>kerugian yang &ldquo;dijadwalkan&rdquo; terjadi tiap bulan kalau tidak ada yang diubah</strong>.</p>
        <p>Contoh: N = 200.000, r = 0,17%, s = Rp1,1 juta → E[Loss] = 200.000 × 0,0017 × 1.100.000 = <strong>Rp374 juta/bulan</strong>.</p>
        <p><strong>Langkah 1 — biaya pertahanan.</strong> 4 analis (Rp60 juta/bulan total) + tool/device-intelligence Rp40 juta = <strong>Rp100 juta/bulan</strong>.</p>
        <p><strong>Langkah 2 — efektivitas realistis.</strong> Pertahanan yang bagus memotong 40–60% loss, bukan 100%. Ambil 50%: penghematan = Rp187 juta/bulan.</p>
        <p><strong>Langkah 3 — ROI.</strong> Rp187 jt − Rp100 jt = <strong>+Rp87 juta/bulan</strong>. Layak. <em>Tapi</em> kalau fraud rate hanya 0,03% (E[Loss] = Rp66 juta), penghematan 50% = Rp33 juta &lt; biaya Rp100 juta → <strong>tidak layak bangun tim sendiri</strong>; lebih murah pakai layanan managed-fraud atau asuransi chargeback. Pelajaran: pertahanan fraud adalah keputusan investasi, bukan kewajiban moral.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Tiga Dilema Prioritas"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Dilema Prioritas</h2>
      <p>Peta di atas menjawab &ldquo;fraud apa yang diperangi duluan&rdquo; dalam kondisi normal. Tiga skenario di bawah ini adalah versi sulitnya — yang membedakan analis junior dan senior.</p>
      <p><strong>Skenario A — rate tinggi &amp; severity rendah vs rate rendah &amp; severity tinggi.</strong> Contoh: voucher abuse (rate 2%, severity Rp25 ribu) vs ATO korporat (rate 0,02%, severity Rp85 juta). Expected loss voucher = 0,02 × 25.000 × volume; ATO = 0,0002 × 85.000.000 × volume. Hitung keduanya dalam rupiah per bulan — yang angkanya lebih besar menang, <em>kecuali</em> ATO korporat membawa risiko reputasi (satu kasus viral = ratusan juta biaya PR). Aturan: rupiah dulu, reputasi sebagai penimbang.</p>
      <p><strong>Skenario B — tipe fraud baru tanpa histori.</strong> Misal muncul modus &ldquo;refund fiktif via CS&rdquo; yang belum pernah tercatat. Tidak ada data = tidak ada model. Respons yang benar: (1) pasang <strong>rule sementara</strong> 2–4 minggu untuk mengumpulkan sampel berlabel, (2) catat pola manual oleh investigator, (3) baru latih model setelah &gt;200 kasus terkonfirmasi. Yang salah: menunggu &ldquo;data cukup&rdquo; sambil kerugian berjalan, atau langsung percaya model yang dilatih dari 12 sampel.</p>
      <p><strong>Skenario C — first-party vs third-party, standar buktinya beda.</strong> Third-party (kartu curian): bukti teknis (device, IP, velocity) cukup untuk blokir otomatis. First-party (pelanggan menyangkal transaksinya sendiri): butuh <strong>jejak niat</strong> — histori dispute, pola pemakaian normal sebelum sangkalan, tanda tangan digital. Blokir otomatis pelanggan yang salah = kehilangan customer seumur hidup. Aturan: makin dekat pelaku ke &ldquo;pelangganmu sendiri&rdquo;, makin tinggi standar bukti sebelum bertindak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fraud yang paling sering dibicarakan di konferensi <strong>bukan</strong> fraud yang paling merugikan bisnismu. Deepfake dan AI-fraud ramai dibahas, tapi untuk kebanyakan perusahaan Indonesia, kartu curian + ATO + mule masih menyumbang 80%+ kerugian. Ukur di datamu sendiri sebelum mengejar tren.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Jaringan Mule & Judol 2024–2025"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Mule Account untuk Judi Online</h2>
      <p>Sepanjang 2024–2025, PPATK berulang kali menyoroti satu pola: <strong>rekening keledai (mule account)</strong> sebagai tulang punggung aliran dana judi online. Mekanismenya sederhana dan murah — justru itu yang membuatnya masif.</p>
      <p><strong>Anatomi modus (pola umum dari berbagai pengungkapan):</strong></p>
      <ol>
        <li><strong>Rekrutmen:</strong> pemilik rekening asli &ldquo;meminjamkan&rdquo; rekening + ATM + OTP-nya dengan imbalan Rp200–500 ribu. Targetnya mahasiswa, pekerja informal, warga yang butuh uang cepat.</li>
        <li><strong>Penampungan:</strong> dana deposit pemain judi mengalir masuk ke ratusan rekening mule — masing-masing dipecah agar tidak mencolok.</li>
        <li><strong>Layering:</strong> dana diputar cepat: mule → mule lain → e-wallet → kripto, sering dalam hitungan menit.</li>
        <li><strong>Integrasi:</strong> sebagian dicairkan tunai via ATM, sebagian dibelanjakan aset.</li>
      </ol>
      <p><strong>Angka ilustratif skalanya:</strong> 1.000 rekening mule × Rp50 juta perputaran/bulan = <strong>Rp50 miliar perputaran per bulan</strong> dari satu jaringan — dengan &ldquo;modal rekrutmen&rdquo; hanya Rp200–500 juta. Rasio leverage inilah yang membuat pemberantasan harus memutus <em>jaringannya</em> (graph analytics, FR12), bukan mengejar satu rekening.</p>
      <p><strong>Jejak data yang ditinggalkan</strong> (inilah yang jadi fitur model): rekening baru berumur &lt; 90 hari dengan perputaran jauh di atas profil nasabah; pola <em>fan-in lalu fan-out cepat</em> (banyak masuk, langsung keluar ke banyak tujuan); transaksi di jam-jam tidak wajar; device yang sama dipakai belasan rekening berbeda.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Pemilik rekening mule itu korban, jadi tidak bisa ditindak.&rdquo;<br /><strong>Yang benar:</strong> secara hukum mereka bisa dijerat TPPU sebagai pihak yang membantu (UU No. 8/2010). Dan dari sisi pertahanan bank, &ldquo;korban&rdquo; atau bukan tidak mengubah fakta: rekeningnya adalah infrastruktur kejahatan dan harus dibekukan. Rasa kasihan tidak boleh menunda pemutusan jaringan.</p>
      </div>
""",
},

# ================================================================= FR2
CONTENT["fr2-fraud-vs-aml"] = {
"toc_worked": ("worked", "📐 Worked Example: Bayes & Kill Chain"),
"worked": """
      <h2 id="worked">📐 Worked Example: Probabilitas & Kecepatan Serangan</h2>
      <p>Dua perhitungan yang wajib dikuasai sebelum membedakan fraud dan AML secara operasional: <strong>berapa yakin kita saat sistem berteriak</strong> (Bayes), dan <strong>seberapa cepat kita harus bereaksi</strong> (kill chain).</p>

      <details className="worked">
        <summary>📐 Contoh 1: P(fraud | flag) — kenapa 99% akurasi bisa berarti 90% alarm palsu</summary>
        <p>Sistem mem-flag 1% transaksi. Diketahui: sensitivitas (recall) 80% — dari semua fraud, 80% ke-flag. Fraud rate populasi 0,2% (2 dari 1.000 transaksi).</p>
        <p><strong>Langkah 1 — terapkan Bayes.</strong></p>
        <Tex math={String.raw`P(\text{fraud}|\text{flag}) = \frac{P(\text{flag}|\text{fraud}) \times P(\text{fraud})}{P(\text{flag})}`} block />
        <p><Tex math={String.raw`P(\text{flag}|\text{fraud})`} /> = 0,80 (recall); <Tex math={String.raw`P(\text{fraud})`} /> = 0,002; <Tex math={String.raw`P(\text{flag})`} /> = 0,01.</p>
        <p><strong>Langkah 2 — hitung.</strong> (0,80 × 0,002) / 0,01 = 0,0016/0,01 = <strong>0,16 = 16%</strong>.</p>
        <p><strong>Interpretasi:</strong> dari 100 alarm, hanya 16 yang benar-benar fraud — 84 adalah gangguan untuk investigator. Angka ini artinya: <strong>base rate yang kecil menghukum semua sistem deteksi</strong>, sebagus apa pun recall-nya. Inilah kenapa FR9 (evaluasi) dan FR11 (threshold) ada: pekerjaan sesungguhnya adalah mengelola 84 alarm palsu itu, bukan sekadar &ldquo;menaikkan akurasi&rdquo;.</p>
        <p><strong>Coba pikir:</strong> kalau fraud rate naik 10× lipat menjadi 2% (misal saat serangan terkoordinasi), P(fraud|flag) menjadi (0,80 × 0,02)/0,01 = <strong>160% → dibatasi 100%</strong>? Tidak — karena P(flag) juga ikut naik. Intuisinya: saat serangan massal, alarm yang sama menjadi jauh lebih bisa dipercaya. Konteks mengubah arti angka yang sama.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: kill chain — fraud butuh menit, AML butuh bulan</summary>
        <p><strong>Kasus fraud (card-not-present):</strong> 14.02 kartu curian dipakai checkout Rp8,5 juta → 14.03 barang dikirim (digital goods, instan) → 14.20 kartu dipakai lagi Rp12 juta → 16.45 pemilik asli sadar &amp; komplain → 17.00 chargeback diajukan. <strong>Total jendela aksi: ±3 jam</strong> dari serangan pertama sampai uang hilang tak kembali. Keputusan harus otomatis dalam <em>milidetik</em> — tidak ada waktu menunggu investigator.</p>
        <p><strong>Kasus AML (layering properti):</strong> Januari: dana hasil korupsi masuk ke rekening perusahaan cangkang → Februari–April: diputar lewat 14 rekening &amp; 3 negara → Mei: dipakai DP apartemen → Agustus: apartemen dijual, dana &ldquo;bersih&rdquo;. <strong>Total jendela: 8 bulan.</strong> Tidak ada keputusan milidetik — yang dibutuhkan adalah <em>rekonstruksi rantai lengkap</em> untuk laporan STR ke PPATK.</p>
        <p><strong>Pelajaran:</strong> fraud = <strong>perlombaan kecepatan</strong> (siapa lebih cepat: pencuri mencairkan, atau sistem memblokir). AML = <strong>perlombaan kelengkapan</strong> (siapa punya gambaran rantai lebih utuh: pelaku menyembunyikan, atau analis merekonstruksi). Dua olahraga berbeda — butuh atlet, lapangan, dan wasit yang berbeda.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Fraud, AML, atau Keduanya?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Masuk Tim Mana?</h2>
      <p>Di dunia nyata, satu kasus sering mengetuk dua pintu sekaligus. Tiga skenario routing yang paling sering salah ditangani:</p>
      <p><strong>Skenario A — mule account Rp500 juta/bulan.</strong> Tim fraud melihat &ldquo;rekening anomali&rdquo; dan ingin langsung bekukan. Tim AML melihat &ldquo;indikasi layering&rdquo; dan ingin pantau dulu untuk memetakan jaringan. Keduanya benar — urutan yang tepat: <strong>AML pantau 7–14 hari sambil kumpulkan graph</strong> (FR12), <em>lalu</em> bekukan serentak satu jaringan. Bekukan terlalu cepat = pelaku ganti rekening, jaringan tak terpetakan. Aturan: untuk jaringan, kesabaran 2 minggu mengalahkan kecepatan 2 jam.</p>
      <p><strong>Skenario B — kapan eskalasi ke PPATK (STR).</strong> Bukan setiap transaksi aneh. Kriteria praktis: (1) ada indikasi tindak pidana asal (hasil korupsi, narkotika, penipuan), (2) pola konsisten dengan tipologi pencucian (structuring, layering, fan-out cepat), (3) nilai material atau jaringan terorganisir. Transaksi janggal satu kali tanpa pola → pantau &amp; catat, belum STR. Mengirim STR untuk semua yang aneh = membanjiri PPATK dan mengundang pertanyaan balik soal kualitas sistemmu.</p>
      <p><strong>Skenario C — jebakan tipping-off.</strong> Nasabah yang sedang dipantau AML menelepon CS menanyakan kenapa transaksinya &ldquo;pending&rdquo;. Memberi tahu bahwa ia dalam pantauan = <strong>tipping-off</strong>, pelanggaran serius UU TPPU. Respons yang benar sudah disiapkan sebagai skrip: alasan generik prosedural (&ldquo;verifikasi rutin&rdquo;), tanpa menyebut investigasi, AML, atau PPATK. Ini bukan soal teknis — ini soal <em>pelatihan</em> semua staf yang berhadapan dengan nasabah.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;AML itu fraud yang nilainya besar.&rdquo;<br /><strong>Yang benar:</strong> beda objektif, bukan beda skala. Fraud = <strong>mencuri uang</strong> (korbannya pemilik dana). AML = <strong>menyembunyikan asal uang</strong> (uangnya sudah &ldquo;dimiliki&rdquo; pelaku kejahatan). Pencucian Rp50 juta tetap AML; pencurian Rp50 miliar tetap fraud. Skala tidak menentukan kategori — <em>arah aliran dan tujuannya</em> yang menentukan.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Dari Korupsi ke Properti via Layering"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Pola Layering Korupsi → Properti</h2>
      <p>Pola yang berulang di banyak kasus korupsi Indonesia: dana hasil tindak pidana tidak langsung dibelanjakan — ia &ldquo;dicuci&rdquo; dulu lewat lapisan-lapisan agar terlihat legal. Berikut anatomi generiknya (kompilasi dari pola putusan TPPU):</p>
      <ol>
        <li><strong>Placement (bulan 1):</strong> Rp12 miliar dana proyek fiktif masuk ke rekening perusahaan kontraktor cangkang — perusahaan yang menang tender tapi tidak punya alat berat, kantor, atau karyawan riil.</li>
        <li><strong>Layering (bulan 2–5):</strong> dana dipecah ke 20+ rekening: sebagian ke rekening keluarga/kerabat (&ldquo;hibah&rdquo;), sebagian ke perusahaan kedua &amp; ketiga sebagai &ldquo;pembayaran jasa konsultansi&rdquo; dengan invoice fiktif, sebagian diputar lewat money changer.</li>
        <li><strong>Integration (bulan 6–9):</strong> dana yang sudah &ldquo;berlapis&rdquo; dipakai DP 3 unit apartemen + 1 ruko — dibeli atas nama kerabat/orang kepercayaan (nominee), bukan pelaku langsung.</li>
      </ol>
      <p><strong>Di mana fraud vs AML-nya?</strong> Proyek fiktifnya = <strong>fraud</strong> (penggelapan/pencurian dana). Semua langkah setelahnya = <strong>TPPU/AML</strong> (menyembunyikan asal). Tim yang berbeda, bukti yang berbeda, pasal yang berbeda (UU Tipikor vs UU No. 8/2010) — tapi <em>data transaksinya sama</em>. Inilah kenapa bank butuh kedua kapabilitas: sistem fraud menangkap anomalinya lebih awal (perusahaan cangkang menang tender Rp12 M tanpa histori), sistem AML merekonstruksi rantainya untuk penegak hukum.</p>
      <p><strong>Jejak data untuk model AML:</strong> rekening perusahaan baru langsung menerima dana besar dari APBD/proyek; invoice &ldquo;jasa konsultansi&rdquo; bernilai bulat dan berulang; pembelian properti tunai oleh nasabah yang profil penghasilannya tidak cocok; nominee dengan alamat sama untuk banyak aset.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dalam kasus gabungan, <strong>fraud adalah pintunya, AML adalah lorongnya</strong>. Menangkap fraud lebih awal (di placement) 10× lebih murah daripada merekonstruksi layering 9 bulan kemudian — tapi tanpa kapabilitas AML, kamu tidak bisa membuktikan kejahatannya di pengadilan. Keduanya dibutuhkan, berurutan.</p>
      </div>
""",
},

# ================================================================= FR3
CONTENT["fr3-data-fraud"] = {
"toc_worked": ("worked", "📐 Worked Example: Membangun Fitur Velocity dari Log Mentah"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dari Log Mentah ke Fitur Siap Model</h2>
      <p>Data tidak datang dalam bentuk fitur — ia datang sebagai log berantakan. Dua contoh cara analis mengubahnya menjadi sinyal.</p>

      <details className="worked">
        <summary>📐 Contoh 1: fitur velocity_1h dari 8 baris log</summary>
        <p>Log kartu X (waktu, nominal): 09.02 Rp150rb; 09.15 Rp200rb; 09.31 Rp175rb; 09.44 Rp2,8jt; 09.47 Rp3,1jt; 09.52 Rp2,5jt; 10.20 Rp120rb; 11.05 Rp90rb.</p>
        <p><strong>Langkah 1 — definisikan fitur:</strong> <em>velocity_1h</em> = jumlah transaksi kartu ini dalam 60 menit ke belakang (termasuk transaksi saat ini).</p>
        <p><strong>Langkah 2 — hitung per transaksi.</strong> 09.02 → 1; 09.15 → 2; 09.31 → 3; 09.44 → 4; 09.47 → 5; 09.52 → 6; 10.20 → 4 (09.02 &amp; 09.15 sudah keluar jendela); 11.05 → 1.</p>
        <p><strong>Langkah 3 — baca polanya.</strong> Ada <em>dua rezim</em>: 09.02–09.31 (3 transaksi kecil, nominal wajar — seperti belanja normal) lalu 09.44–09.52 (3 transaksi besar beruntun, total Rp8,4 juta dalam 8 menit). Fitur tambahannya: <em>amount_velocity_1h</em> = Rp8,4 jt pada 09.52 vs rata-rata historis kartu ini Rp180rb/hari.</p>
        <p><strong>Interpretasi:</strong> pola klasik &ldquo;test kecil lalu gas&rdquo; — pencuri mengetes kartu masih aktif dengan nominal kecil, lalu menguras. Satu fitur velocity tidak cukup; <strong>kombinasi count-velocity + amount-velocity + perubahan rezim</strong> yang menjadi sinyal kuat. Inilah kenapa FR6 (feature engineering) adalah lesson tersendiri.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih window — 1 jam vs 24 jam (trade-off nyata)</summary>
        <p>Kasus: deteksi ATO dengan fitur &ldquo;login dari device baru&rdquo;. Dua kandidat window:</p>
        <p><strong>Window 1 jam:</strong> dari data historis, menangkap 62% ATO dalam 1 jam pertama (recall 62%), tapi juga mem-flag 0,8% login normal (misal orang ganti HP dan langsung belanja). Dengan 500.000 login/hari → 4.000 flag/hari, 3 dari 4 adalah false positive.</p>
        <p><strong>Window 24 jam:</strong> recall naik ke 81% (menangkap ATO yang &ldquo;tidur&rdquo; dulu 12 jam sebelum beraksi — pola umum!), tapi flag normal naik ke 2,1% → 10.500 flag/hari.</p>
        <p><strong>Keputusan:</strong> tidak ada jawaban universal — tergantung <strong>kapasitas review</strong> (FR11). Tim dengan 20 investigator memakai window 1 jam + skor model untuk memprioritaskan; tim dengan otomasi blokir memakai 24 jam untuk recall. Pelajaran: window agregasi bukan pilihan teknis murni — ia <strong>kontrak antara akurasi dan kapasitas operasional</strong>.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Sumber Data Mana Dulu?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Membangun Pipa Data</h2>
      <p>Setelah tahu <em>jenis</em> datanya, pertanyaan berikutnya: <strong>urutan membangunnya</strong>. Tiga skenario prioritas:</p>
      <p><strong>Skenario A — startup e-wallet baru, data minim.</strong> Mulai dari yang murah &amp; sudah ada: <strong>log transaksi + data device dasar</strong> (device ID, IP, jam). Ini menangkap 60–70% pola umum (velocity, device baru, jam aneh) tanpa investasi infra. Behavioral biometrics dan graph menyusul di tahun kedua. Aturan: <em>data yang kamu punya hari ini &gt; data ideal yang butuh 6 bulan dibangun</em>.</p>
      <p><strong>Skenario B — real-time vs batch feature.</strong> Fitur &ldquo;jumlah transaksi 1 jam terakhir&rdquo; untuk keputusan blokir <em>harus</em> real-time (dihitung dalam &lt; 50ms saat transaksi masuk). Fitur &ldquo;rata-rata 30 hari&rdquo; cukup batch harian. Aturan praktis: <strong>window ≤ 24 jam → real-time; window &gt; 24 jam → batch</strong>. Memaksakan semua real-time = biaya infra 10× untuk gain akurasi 2%.</p>
      <p><strong>Skenario C — data pihak ketiga (device intelligence, blacklist).</strong> Beli jika: (1) kamu tidak punya skala untuk membangunnya sendiri (butuh jutaan device untuk reputasi device yang bermakna), (2) fraud-mu lintas-merchant (kartu curian dipakai di banyak toko — satu merchant tidak melihat polanya). Jangan beli jika datamu sendiri sudah kaya dan fraud-mu spesifik internal (first-party) — vendor generik tidak membantu.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fitur terbaik bukan yang paling canggih — tapi yang <strong>paling stabil dihitung ulang setiap hari</strong>. Fitur eksotis yang rusak tiap ada perubahan skema database lebih merugikan daripada fitur sederhana yang tidak pernah down. Dalam fraud, reliabilitas pipa data <em>adalah</em> akurasi model.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: ATO via Social Engineering OTP"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Pembajakan Akun via &ldquo;Kurir Paket&rdquo;</h2>
      <p>Modus yang marak 2023–2025: korban menerima telepon/WA dari &ldquo;kurir&rdquo; yang tahu nama &amp; alamatnya (data bocor), diminta menyebutkan kode OTP &ldquo;untuk verifikasi paket&rdquo;. Dalam 10 menit: akun e-commerce/e-wallet diambil alih, alamat kirim diganti ke kos-kosan, checkout barang elektronik pakai saldo &amp; paylater korban.</p>
      <p><strong>Jejak data yang ditinggalkan</strong> (inilah yang harus ditangkap pipa datamu):</p>
      <ol>
        <li><strong>Device baru + login sukses pertama kali</strong> — device fingerprint belum pernah terlihat untuk akun ini.</li>
        <li><strong>Ganti alamat kirim</strong> dalam &lt; 30 menit setelah login device baru.</li>
        <li><strong>Velocity checkout:</strong> 3–5 transaksi nominal besar dalam 15 menit, padahal histori akun: 2 transaksi/bulan nominal &lt; Rp300rb.</li>
        <li><strong>Jam tidak wajar</strong> relatif terhadap pola akun (02.00 dini hari untuk akun yang selalu belanja siang).</li>
        <li><strong>Cash-out pattern:</strong> barang digital/voucher — tidak perlu alamat fisik valid.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> dari 10.000 kasus ATO terkonfirmasi di satu platform, 7.300 (73%) menunjukkan kombinasi device-baru + ganti-alamat + velocity. Artinya: <strong>tiga fitur sederhana menangkap hampir tiga perempat kasus</strong> — tanpa ML canggih. Pelajaran untuk analis data: sebelum membangun model deep learning, pastikan tiga fitur murah ini sudah dihitung dengan benar dan real-time.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Kalau pakai OTP, akun aman dari ATO.&rdquo;<br /><strong>Yang benar:</strong> OTP mengamankan <em>kanal teknis</em>, bukan <em>manusia</em>. Social engineering mem-bypass OTP dengan meminta korbannya sendiri yang membacakan kodenya. Data menunjukkan mayoritas ATO Indonesia 2023–2025 melibatkan OTP yang &ldquo;sah&rdquo; secara teknis tapi diberikan secara sukarela. Pertahanan harus berlapis: OTP + behavioral + device — karena penyerang hanya butuh satu lapisan yang lengah.</p>
      </div>
""",
},

# ================================================================= FR4
CONTENT["fr4-label-fraud"] = {
"toc_worked": ("worked", "📐 Worked Example: Label Lag & Estimasi Prior"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung dengan Label yang Terlambat</h2>
      <p>Label fraud tidak seperti label gambar kucing — ia datang terlambat, sebagian salah, sebagian tidak pernah datang. Dua contoh menghadapinya secara kuantitatif.</p>

      <details className="worked">
        <summary>📐 Contoh 1: contamination window — kapan data &ldquo;bersih&rdquo; boleh dipakai training?</summary>
        <p>Bank mencatat: transaksi Januari 2026, chargeback (label fraud) masuk bertahap — 40% di Februari, 35% di Maret, 20% di April, 5% di Mei. Artinya <strong>label lag hingga 4 bulan</strong>.</p>
        <p><strong>Langkah 1 — tentukan contamination window.</strong> Jika hari ini 13 Oktober 2026 dan kamu training dengan data hingga September, maka transaksi Agustus–September masih &ldquo;terkontaminasi&rdquo;: sebagian fraud-nya belum berlabel (masih tercatat sebagai normal). Model akan belajar bahwa pola fraud = normal.</p>
        <p><strong>Langkah 2 — hitung koreksinya.</strong> Dari distribusi lag: transaksi berumur 1 bulan baru 40% labelnya masuk; umur 2 bulan 75%; umur 3 bulan 95%. Aturan praktis: <strong>pakai data yang umurnya ≥ 3× median lag</strong>. Median lag di sini ±2 bulan → training hanya sampai April 2026 (umur ≥ 6 bulan, 100% label masuk).</p>
        <p><strong>Langkah 3 — harga yang dibayar.</strong> Mengorbankan 6 bulan data terbaru = model tidak melihat pola serangan terkini. Solusinya bukan &ldquo;pakai saja data baru&rdquo;, melainkan <strong>dua jalur</strong>: model utama dari data matang (6+ bulan) + rule adaptif / model ringan dari sinyal terbaru untuk menangkap drift (FR10). Analis senior tidak memilih satu — ia mengoperasikan keduanya.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: PU learning — mengestimasi berapa fraud yang belum ketahuan</summary>
        <p>Dari 1.000.000 transaksi, 2.000 terkonfirmasi fraud (label positif), 998.000 &ldquo;normal&rdquo; (unlabeled — campuran normal asli + fraud yang lolos). Berapa fraud sebenarnya?</p>
        <p><strong>Langkah 1 — estimasi prior dengan sampel audit.</strong> Ambil 5.000 transaksi &ldquo;normal&rdquo; secara acak, investigasi manual mendalam: ditemukan 38 fraud yang lolos. Estimasi fraud tersembunyi = 38/5.000 = 0,76% dari unlabeled.</p>
        <p><strong>Langkah 2 — total estimasi.</strong> 0,0076 × 998.000 ≈ <strong>7.585 fraud tersembunyi</strong> + 2.000 terkonfirmasi = <strong>±9.585 fraud aktual</strong> (0,96% dari total) — hampir <strong>5× lipat</strong> dari yang tercatat!</p>
        <p><strong>Interpretasi:</strong> angka ini artinya dua hal. Pertama, <em>recall operasionalmu</em> hanya 2.000/9.585 = 21% — dari 5 fraud, 4 lolos. Kedua, <strong>training dengan label mentah berarti 7.585 pola fraud diajarkan sebagai &ldquo;normal&rdquo;</strong> — modelmu disabotase oleh datanya sendiri. Inilah alasan teknik PU learning / noise-robust ada: bukan kemewahan akademik, tapi koreksi atas realitas lapangan.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Strategi Pelabelan"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Dari Mana Label Datang?</h2>
      <p>Label punya &ldquo;pabrik&rdquo; yang berbeda-beda — dan tiap pabrik punya biasnya sendiri:</p>
      <p><strong>Skenario A — label dari chargeback nasabah.</strong> Murah &amp; otomatis, tapi bias ke <em>third-party fraud nominal besar</em> (yang kecil tidak dilaporkan nasabah) dan tercemar <em>friendly fraud</em> (nasabah berbohong). Cocok untuk: model deteksi card fraud prioritas. Tidak cocok untuk: first-party fraud (pelakunya justru yang melapor!).</p>
      <p><strong>Skenario B — label dari investigator.</strong> Paling akurat, tapi mahal (Rp25–50rb per review) dan bias ke <em>apa yang sistem flag</em> — investigator hanya melabel yang masuk antrian (selection bias). Model yang dilatih dari sini buta terhadap fraud yang tidak pernah di-flag. Koreksinya: <strong>selipkan sampel acak</strong> 5–10% ke antrian review untuk mengukur blind spot.</p>
      <p><strong>Skenario C — label dari konfirmasi merchant / data eksternal.</strong> Misal daftar kartu curian dari jaringan bank. Presisi tinggi, tapi <em>coverage</em> rendah dan datang terlambat berminggu-minggu. Cocok untuk: validasi &amp; kalibrasi, bukan training utama.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Label adalah kebenaran (ground truth).&rdquo;<br /><strong>Yang benar:</strong> label adalah <strong>opini investigator dengan delay dan bias seleksi</strong>. Dua investigator bisa tidak sepakat 10–20% kasus (disagreement rate normal). Model yang &ldquo;100% akurat terhadap label&rdquo; justru mencurigakan — ia menghafal bias investigator, bukan memahami fraud. Perlakukan label sebagai <em>perkiraan terbaik yang tersedia</em>, bukan kitab suci.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Dispute Kartu Kredit & Friendly Fraud"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: 30% Dispute Ternyata &ldquo;Friendly&rdquo;</h2>
      <p>Bank penerbit kartu di Indonesia mencatat pola berulang tiap awal tahun: lonjakan dispute kartu kredit untuk transaksi travel &amp; elektronik 2–4 bulan sebelumnya. Investigasi mendalam menunjukkan komposisi yang mengejutkan banyak analis junior:</p>
      <p>Dari 1.000 dispute yang masuk, setelah investigasi: <strong>~550 third-party fraud asli</strong> (kartu dibobol), <strong>~300 friendly fraud</strong> (nasabah sendiri yang bertransaksi lalu menyangkal — &ldquo;lupa&rdquo;, &ldquo;tidak kenal merchant&rdquo;, atau buyer's remorse), <strong>~150 sengketa layanan murni</strong> (barang tidak datang, bukan fraud sama sekali).</p>
      <p><strong>Implikasi untuk pelabelan:</strong> jika semua 1.000 dispute otomatis dilabel &ldquo;fraud&rdquo;, maka 45% labelmu salah kategori — model belajar pola orang lupa &amp; kecewa sebagai pola pencurian. Tiga perlakuan berbeda yang benar: third-party → label fraud + blokir pola; friendly → label <em>first-party</em> terpisah (FR1) + edukasi/blacklist lunak; sengketa layanan → <strong>bukan label fraud</strong>, teruskan ke CS.</p>
      <p><strong>Jejak pembeda friendly vs third-party</strong> (fitur untuk FR6): friendly fraud biasanya dari <em>device &amp; alamat yang sama</em> dengan histori normal nasabah, nominal wajar, dan ada pola pemakaian sebelum sangkalan. Third-party: device baru, velocity aneh, alamat kirim asing. Label yang tidak membedakan keduanya = model yang menghukum pelanggan setia.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kualitas label menentukan <em>batas atas</em> kualitas modelmu — model tidak bisa lebih pintar dari gurunya. Satu jam memperbaiki definisi label (apa itu fraud vs sengketa vs friendly) lebih berdampak daripada satu minggu tuning hyperparameter.</p>
      </div>
""",
},

# ================================================================= FR5
CONTENT["fr5-rule-based"] = {
"toc_worked": ("worked", "📐 Worked Example: Hit Rate, Tuning & Champion-Challenger"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung & Menyetel Rule</h2>
      <p>Rule bukan &ldquo;aturan asal&rdquo; — ia mesin keputusan yang bisa diukur, disetel, dan dipertandingkan. Dua contoh pengerjaannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: tuning rule velocity — dari data ke ambang</summary>
        <p>Rule kandidat: <em>&ldquo;flag jika &gt; 5 transaksi dalam 10 menit&rdquo;</em>. Evaluasi di 7 hari data historis (2,1 juta transaksi):</p>
        <p><strong>Langkah 1 — hitung hit rate &amp; precision.</strong> Rule mem-flag 8.400 transaksi. Dari jumlah itu, 1.260 terkonfirmasi fraud. Precision = 1.260/8.400 = <strong>15%</strong>. Dari total 3.150 fraud di periode itu, yang ke-flag 1.260 → recall = <strong>40%</strong>.</p>
        <p><strong>Langkah 2 — terjemahkan ke biaya.</strong> 8.400 flag × Rp25rb biaya review = Rp210 juta/minggu biaya operasional. Fraud tertangkap: 1.260 × Rp1,1 jt = Rp1,39 miliar dicegah. Rasio 6,6× — rule ini <em>menguntungkan</em>.</p>
        <p><strong>Langkah 3 — coba ambang alternatif.</strong> Ambang &gt;3/10 mnt: flag 31.000 (biaya Rp775 jt), recall 58% (1.827 fraud, Rp2,0 M dicegah) — rasio turun ke 2,6× dan investigator kewalahan. Ambang &gt;8/10 mnt: flag 2.900 (biaya Rp72,5 jt), recall 22% (693 fraud, Rp762 jt) — rasio 10,5× tapi 78% fraud lolos.</p>
        <p><strong>Keputusan:</strong> pertahankan &gt;5/10 mnt sebagai <strong>auto-review</strong>, dan tambahkan varian &gt;8/10 mnt sebagai <strong>auto-block</strong> (precision di ambang ini 31% — cukup tinggi untuk blokir langsung). Pelajaran: satu rule bisa punya <em>dua ambang, dua tindakan</em>.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: champion vs challenger — kapan rule lama dipensiunkan?</summary>
        <p>Champion: rule &ldquo;negara asing + nominal &gt; Rp5jt&rdquo; (2 tahun beroperasi). Challenger: rule baru &ldquo;device baru + velocity + nominal di atas persentil-95 nasabah&rdquo;. Uji 30 hari paralel (challenger hanya logging, tidak bertindak):</p>
        <p>Hasil: champion menangkap 410 fraud dengan 3.900 flag (precision 10,5%). Challenger menangkap 388 fraud dengan 1.700 flag (precision 22,8%). <strong>Overlap:</strong> 290 fraud ditangkap keduanya; 120 hanya champion; 98 hanya challenger.</p>
        <p><strong>Analisis:</strong> challenger menangkap <em>lebih sedikit</em> fraud total (388 &lt; 410) — analis junior akan mempertahank champion. Tapi hitung biayanya: champion butuh 3.900 review (Rp97,5 jt), challenger 1.700 (Rp42,5 jt). Cost per fraud tertangkap: champion Rp238rb, challenger Rp110rb — <strong>2,2× lebih efisien</strong>.</p>
        <p><strong>Keputusan senior:</strong> promosikan challenger, TAPI jangan buang 120 fraud unik champion — ekstrak polanya: ternyata 80 dari 120 adalah transaksi travel legit-tapi-asing yang selama ini jadi false positive mahal. Kesimpulan akhir: challenger naik, champion pensiun, dan 40 kasus unik sisanya jadi bahan rule ketiga yang lebih spesifik. <strong>Rule tidak pernah &ldquo;kalah&rdquo; sia-sia — ia selalu meninggalkan pelajaran pola.</strong></p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Siklus Hidup Rule"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Rule Lahir, Kapan Mati</h2>
      <p>Rule punya siklus hidup. Tiga keputusan yang menentukan apakah arsenal rule-mu sehat atau jadi &ldquo;kuburan rule&rdquo;:</p>
      <p><strong>Skenario A — rule darurat 0-day.</strong> Serangan baru terdeteksi jam 09.00 (pola refund fiktif). Model butuh 2 minggu data. Respons benar: <strong>rule sementara dalam 2 jam</strong> (&ldquo;flag semua refund &gt; Rp2jt dari akun umur &lt; 7 hari&rdquo;), pasang tanggal kedaluwarsa 14 hari, tugaskan analis memantau hit rate harian. Rule darurat yang tidak diberi tanggal kedaluwarsa akan hidup selamanya dan 6 bulan kemudian tidak ada yang ingat kenapa ia ada.</p>
      <p><strong>Skenario B — kapan rule di-retire.</strong> Audit tiap kuartal dengan tiga metrik: (1) <em>fire rate</em> — rule yang tidak pernah fire 90 hari = kandidat hapus; (2) <em>precision trend</em> — turun 3 kuartal beruntun = pola sudah basi; (3) <em>overlap</em> — 95% tangkapannya juga ditangkap rule lain = redundan. Rule yang lolos ketiganya tapi precision &lt; 2% = &ldquo;pajak alarm&rdquo; — pertimbangkan ubah jadi logging saja.</p>
      <p><strong>Skenario C — kapan rule cukup, kapan butuh ML.</strong> Rule cukup jika: pola stabil &gt; 6 bulan, precision &gt; 20%, dan volume flag sesuai kapasitas. Butuh ML jika: pola bermutasi tiap minggu, fitur interaksi kompleks (device × jam × merchant × histori), atau precision rule mentok &lt; 5% padahal recall dibutuhkan tinggi. Aturan jujur: <strong>jangan bangun ML untuk masalah yang rule Rp0 bisa selesaikan</strong> — dan jangan pertahankan rule untuk masalah yang sudah jelas butuh ML.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rule yang baik seperti <strong>pagar</strong> — murah, jelas, dan semua orang paham kenapa ia ada. ML seperti <strong>anjing penjaga</strong> — lebih pintar, tapi butuh dilatih, diberi makan (data), dan kadang menggonggong ke tamu. Rumah yang aman punya keduanya, dengan pagar dibangun lebih dulu.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Rule Velocity Membunuh Promo 11.11"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Ketika Rule Ikut &ldquo;Belanja&rdquo; Saat Harbolnas</h2>
      <p>Pola yang terjadi di beberapa e-commerce lokal saat Harbolnas 11.11: rule velocity &ldquo;&gt; 10 transaksi/jam = fraud&rdquo; yang tenang sepanjang tahun tiba-tiba mem-flag <strong>ribuan pembeli legit</strong> — karena saat flash sale, manusia normal memang checkout 15× dalam 20 menit (berebut barang, gagal, coba lagi).</p>
      <p><strong>Angka ilustratif kerusakannya:</strong> 4.200 akun ter-flag dalam 6 jam; 3.900 di antaranya legit (precision anjlok ke 7%). Setiap akun yang terblokir salah = rata-rata keranjang Rp850rb batal + biaya CS Rp35rb + risiko churn. Total: ±Rp3,3 miliar GMV tertahan + Rp147 juta biaya CS — dalam <em>satu malam</em>, oleh rule yang &ldquo;bekerja sesuai spesifikasi&rdquo;.</p>
      <p><strong>Akar masalah:</strong> rule mengasumsikan distribusi perilaku <em>normal harian</em>, padahal Harbolnas adalah <strong>regime shift</strong> (FR10): perilaku legit sendiri berubah total. Tiga perbaikan yang benar: (1) <strong>kalender regime</strong> — ambang velocity dilonggarkan otomatis saat event besar (dengan kompensasi: perketat sinyal lain seperti device baru); (2) <strong>whitelist perilaku</strong> — akun berumur &gt; 1 tahun dengan histori bersih dapat ambang 3× lipat; (3) <strong>circuit breaker</strong> — jika flag rate naik &gt; 5× dalam 1 jam, rule otomatis turun ke mode review, bukan blokir.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Rule yang bagus tidak perlu diubah-ubah.&rdquo;<br /><strong>Yang benar:</strong> rule adalah <strong>foto pola serangan di satu titik waktu</strong> — dan penjahat terus berganti pose. Rule tanpa jadwal review kuartalan = foto usang yang dipajang sebagai cermin. Yang hebat bukan rule-nya, tapi <em>disiplin meninjau ulangnya</em>.</p>
      </div>
""",
},

# ================================================================= FR6
CONTENT["fr6-feature-engineering"] = {
"toc_worked": ("worked", "📐 Worked Example: Velocity & Travel Impossibility"),
"worked": """
      <h2 id="worked">📐 Worked Example: Membangun Dua Fitur Klasik</h2>
      <p>Fitur bukan ditemukan — ia <strong>dibangun</strong> dari log mentah dengan keputusan desain di tiap langkah. Dua contoh lengkapnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: fitur velocity dari log mentah (langkah demi langkah)</summary>
        <p>Log kartu B, 12 Oktober: 20.01 Rp120rb (Jakarta); 20.09 Rp95rb (Jakarta); 20.14 Rp110rb (Jakarta); 20.19 Rp4,2jt (Jakarta); 20.21 Rp3,8jt (Surabaya?) — lokasi dari IP merchant.</p>
        <p><strong>Langkah 1 — pilih jendela.</strong> Kita bangun <em>count_15m</em> (jumlah transaksi 15 menit ke belakang) dan <em>amt_15m</em> (total nominal 15 menit ke belakang).</p>
        <p><strong>Langkah 2 — hitung untuk transaksi 20.21.</strong> count_15m: transaksi 20.09, 20.14, 20.19, 20.21 = <strong>4</strong> (20.01 sudah keluar jendela). amt_15m = 95rb + 110rb + 4,2jt + 3,8jt = <strong>Rp8,195 juta</strong>.</p>
        <p><strong>Langkah 3 — bandingkan dengan baseline nasabah.</strong> Rata-rata harian kartu B: 1,2 transaksi, Rp210rb. Rasio: count 4 vs ekspektasi 15-menit normal (≈0,02) = <strong>200× lipat</strong>; amount Rp8,2jt vs Rp210rb = <strong>39× lipat</strong>.</p>
        <p><strong>Langkah 4 — keputusan desain.</strong> Fitur mentah (4 dan 8,2jt) kurang bermakna lintas nasabah — normalisasi menjadi <strong>rasio terhadap baseline</strong>: <em>count_ratio_15m = 200</em>, <em>amt_ratio_15m = 39</em>. Inilah &ldquo;feature engineering&rdquo; yang sesungguhnya: bukan sekadar agregasi, tapi <strong>agregasi yang dinormalisasi terhadap perilaku individu</strong> sehingga model bisa membandingkan apel dengan apel.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: travel impossibility — membuktikan fisikanya mustahil</summary>
        <p>Dua transaksi kartu C: 20.19 di Jakarta (IP merchant Jakarta), 20.21 di Surabaya (IP merchant Surabaya). Jarak Jakarta–Surabaya ±780 km, selisih waktu 2 menit.</p>
        <p><strong>Langkah 1 — hitung kecepatan implisit.</strong> 780 km / 2 menit = 390 km/menit = <strong>23.400 km/jam</strong> — 19× kecepatan suara. Secara fisik mustahil untuk manusia berpindah.</p>
        <p><strong>Langkah 2 — rancang fitur.</strong> <em>implied_speed_kmh</em> = jarak haversine antar lokasi berurutan / selisih waktu. Threshold: &gt; 1.000 km/jam = mustahil (pesawat komersial ±900 km/jam).</p>
        <p><strong>Langkah 3 — tangani jebakan.</strong> (a) <strong>VPN/proxy:</strong> IP tidak selalu = lokasi fisik — beri bobot lebih rendah untuk IP datacenter. (b) <strong>Transaksi online:</strong> lokasi merchant ≠ lokasi pemegang kartu — fitur ini hanya valid untuk transaksi <em>fisik</em> (EDC/ATM). (c) <strong>Zona waktu &amp; presisi:</strong> pastikan timestamp UTC dan koordinat cukup presisi. Fitur brilian yang dihitung dari data kotor = alarm palsu yang brilian.</p>
        <p><strong>Pelajaran:</strong> fitur terbaik sering kali adalah <strong>hukum fisika yang diterjemahkan ke angka</strong> — sederhana, bisa dijelaskan ke siapa pun, dan sulit diakali penjahat (mereka tidak bisa memperlambat waktu).</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Desain Fitur"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Trade-off Desain Fitur</h2>
      <p>Setiap fitur adalah kompromi. Tiga trade-off yang paling sering menentukan menang-kalahnya model:</p>
      <p><strong>Skenario A — window pendek vs panjang.</strong> Window 15 menit: sensitif terhadap serangan kilat, tapi berisik (satu kesalahan hitung = false positive). Window 7 hari: stabil, tapi buta terhadap serangan yang selesai dalam 1 jam. Praktik terbaik: <strong>pakai keduanya</strong> (fitur multi-window: 15m, 1h, 24h, 7d) dan biarkan model memilih — dengan harga komputasi 4×. Jika latensi ketat, prioritaskan window yang sesuai <em>durasi serangan dominan</em> di datamu.</p>
      <p><strong>Skenario B — recency vs frekuensi.</strong> Dua nasabah sama-sama 20 transaksi/bulan. Nasabah P: 20 transaksi tersebar merata. Nasabah Q: 19 transaksi 29 hari lalu + 1 transaksi 5 menit lalu. Fitur &ldquo;frekuensi bulanan&rdquo; menyamakan keduanya — padahal Q jauh lebih mencurigakan untuk ATO. Solusi: fitur <strong>recency-weighted</strong> (transaksi baru diberi bobot lebih) atau fitur eksplisit <em>time_since_last_txn</em>. Aturan: untuk deteksi <em>pengambilalihan</em>, recency &gt; frekuensi.</p>
      <p><strong>Skenario C — fitur mahal (join lintas sistem).</strong> Fitur &ldquo;apakah device ini dipakai 5 rekening lain&rdquo; butuh join ke tabel device global — 80ms. Di budget 50ms real-time, ini tidak muat. Pilihan: (1) <strong>precompute</strong> ke feature store tiap 5 menit (data sedikit basi tapi cepat), (2) hitung <em>asinkron</em> — keputusan awal tanpa fitur ini, lalu review susulan jika fitur mahal menyala, (3) buang fitur. Aturan: <strong>fitur yang tidak bisa dihitung dalam budget latensi = fitur yang tidak ada</strong>, sebagus apa pun akurasinya di notebook.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Makin banyak fitur, makin bagus model.&rdquo;<br /><strong>Yang benar:</strong> tiap fitur adalah <strong>liabilitas operasional</strong>: harus dihitung selamanya, bisa rusak saat skema berubah, bisa bocor (leakage). Studi internal banyak tim menunjukkan 15–30 fitur yang <em>terawat</em> mengalahkan 300 fitur yang setengah mati. Disiplin membuang fitur sama pentingnya dengan kepintaran membuatnya.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Pinjol — KTP yang &ldquo;Hidup&rdquo; di 40 Pengajuan"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Satu KTP, 40 Pengajuan Pinjol</h2>
      <p>Pola yang ditemukan tim risk beberapa P2P lending Indonesia: satu nomor KTP muncul di puluhan pengajuan pinjaman dari <em>nama &amp; wajah berbeda</em> — KTP asli (hasil beli/jual data atau &ldquo;sewa identitas&rdquo; Rp300–500rb) dipasangkan dengan foto selfie hasil edit/AI atau wajah joki.</p>
      <p><strong>Fitur-fitur yang menangkapnya</strong> (semuanya murah dihitung):</p>
      <ol>
        <li><strong>ktp_reuse_count_30d:</strong> berapa pengajuan memakai KTP ini 30 hari terakhir. Normal = 1. Kasus ini = <strong>40</strong>.</li>
        <li><strong>device_sharing_count:</strong> berapa KTP berbeda diajukan dari device ini. Normal = 1–2 (keluarga). Kasus ini = <strong>23</strong>.</li>
        <li><strong>selfie_similarity:</strong> skor kemiripan wajah antar pengajuan dengan KTP sama — rendah padahal seharusnya identik.</li>
        <li><strong>velocity_pengajuan:</strong> 40 pengajuan dalam 72 jam dari 3 device — pola &ldquo;pabrik pengajuan&rdquo;.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> satu KTP × 40 pengajuan × Rp3 juta rata-rata pinjaman = <strong>Rp120 juta eksposur</strong> dari satu identitas curian. Dengan 500 KTP &ldquo;produktif&rdquo; per bulan, satu sindikat bisa menggerogoti <strong>Rp60 miliar/tahun</strong> dari industri — sebelum bunga &amp; biaya collection.</p>
      <p><strong>Pelajaran desain fitur:</strong> tidak satu pun fitur di atas &ldquo;canggih&rdquo; — semuanya <em>counting</em> sederhana. Yang membuatnya powerful adalah <strong>pemilihan entitas agregasi yang tepat</strong> (KTP, device) dan <strong>window yang tepat</strong> (30 hari). Feature engineering fraud = 20% matematika, 80% memahami <em>bagaimana penjahat bekerja</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum bertanya &ldquo;fitur apa yang prediktif?&rdquo;, tanyakan <strong>&ldquo;jejak apa yang <em>terpaksa</em> ditinggalkan penjahat?&rdquo;</strong> Penjahat bisa ganti nama, tapi untuk mengajukan 40 pinjaman ia <em>terpaksa</em> memakai ulang KTP/device — dan keterpaksaan itulah yang menjadi fitur. Desain dari keterpaksaan, bukan dari ketersediaan kolom.</p>
      </div>
""",
},
