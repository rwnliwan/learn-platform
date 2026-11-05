# Round 3: latihan mandiri (+-350 kata) untuk 13 lesson di bawah 4000 kata
R3 = {}

R3["fr8-unsupervised"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Berpikir Tanpa Label"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Berpikir Tanpa Label</h2>
      <p>Tiga latihan untuk menguji pemahamanmu. Kerjakan dulu, baru buka kunci jawaban.</p>
      <p><strong>1.</strong> Dari 50 titik data, satu titik terisolasi dalam 3 potongan, rata-rata titik lain 11 potongan. Perkirakan skor anomalinya (mendekati 1, 0,5, atau 0?) dan jelaskan artinya.</p>
      <p><strong>2.</strong> Kamu memonitor 80.000 transaksi/hari dengan kapasitas review 1.600/hari. Contamination berapa yang operasional? Jika audit menunjukkan base rate fraud 0,5%, apakah contamination itu cukup?</p>
      <p><strong>3.</strong> Sebutkan satu skenario di mana kamu <em>menolak</em> memakai unsupervised meski tidak ada label — dan apa alternatifnya.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Mendekati <strong>1</strong> — path jauh di bawah rata-rata = sangat mudah diisolasi = sangat anomali. Artinya: titik ini <em>layak dilihat manusia</em>, bukan otomatis &ldquo;fraud&rdquo;.</p>
        <p><strong>2.</strong> 1.600/80.000 = <strong>2%</strong>. Dengan base rate 0,5%, contamination 2% memberi ruang 4x untuk anomali non-fraud (error sistem, perilaku unik) — <strong>masuk akal</strong>, tapi validasi dengan injeksi kasus diketahui (worked example 2).</p>
        <p><strong>3.</strong> Contoh: <strong>keputusan yang butuh penjelasan hukum</strong> (blokir nasabah korporat) — &ldquo;anomali&rdquo; bukan alasan yang bisa dipertahankan. Alternatif: rule berbasis hipotesis + investigasi manual hingga label terkumpul.</p>
      </details>
""",
},

R3["fr9-evaluasi"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Dari Angka ke Keputusan"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Dari Angka ke Keputusan</h2>
      <p><strong>1.</strong> Evaluasi: TP=90, FP=410, FN=60. Hitung precision, recall, F1. Model ini &ldquo;bagus&rdquo; atau tidak — dan untuk siapa?</p>
      <p><strong>2.</strong> Biaya review Rp30rb, loss per fraud Rp900rb. Model A: TP=120, FP=280. Model B: TP=150, FP=600. Mana yang menang dalam rupiah? Apakah jawabanmu berubah jika kapasitas review hanya 500/hari?</p>
      <p><strong>3.</strong> Direksi bertanya &ldquo;model kita bagus tidak?&rdquo; — tulis jawaban 2 kalimat tanpa menyebut F1/AUC.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Precision = 90/500 = <strong>18%</strong>; recall = 90/150 = <strong>60%</strong>; F1 = <strong>0,28</strong>. &ldquo;Bagus&rdquo; relatif: 90x lebih baik dari acak (base rate ~0,2%), tapi butuh 500 review untuk 90 fraud — <strong>hanya bagus jika kapasitas cukup</strong>.</p>
        <p><strong>2.</strong> A: 120x900rb - 400x30rb = Rp108jt - Rp12jt = <strong>Rp96jt</strong>. B: 150x900rb - 750x30rb = Rp135jt - Rp22,5jt = <strong>Rp112,5jt</strong> — B menang. Tapi jika kapasitas 500/hari, B butuh 750 review = <strong>tidak operasional</strong> → A menang secara operasional. <em>Metrik terbaik menghormati kendala.</em></p>
        <p><strong>3.</strong> Contoh: &ldquo;Dari 150 fraud, 90 tertangkap; biayanya 500 review (Rp15jt) untuk menyelamatkan Rp81jt — <strong>balik modal 5,4x</strong>.&rdquo; Angka keputusan, bukan angka statistik.</p>
      </details>
""",
},

R3["fr11-threshold"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Anggaran Threshold"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Anggaran Threshold</h2>
      <p><strong>1.</strong> Volume 30.000 trx/hari, 8 investigator x 70 review/hari. Berapa alert rate maksimal? Jika kurva validasi: τ=0,04 → alert 2,1% recall 84%; τ=0,07 → alert 1,2% recall 72%. Threshold mana yang operasional?</p>
      <p><strong>2.</strong> C_FP=Rp20rb, C_FN=Rp2jt. Hitung τ* teoretis. Jika τ kapasitas = 0,06, berapa threshold final — dan apa artinya bagi direksi?</p>
      <p><strong>3.</strong> Rancang 2-threshold untuk QRIS tatap muka: kapan auto-block vs review vs approve? Pertimbangkan biaya false positive di kasir.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Kapasitas = 560/hari → alert rate maks = 560/30.000 = <strong>1,87%</strong>. τ=0,04 gugur (2,1% &gt; 1,87%). <strong>τ=0,07 operasional</strong> (recall 72%). Pelajaran: <em>kapasitas memveto matematika</em>.</p>
        <p><strong>2.</strong> τ* = 20.000/2.020.000 ≈ <strong>0,0099</strong>. Final = max(0,0099; 0,06) = <strong>0,06</strong>. Artinya: secara biaya kita <em>ingin</em> agresif, tapi SDM tidak cukup — <strong>selisihnya = business case tambah investigator</strong> (hitung rupiahnya!).</p>
        <p><strong>3.</strong> QRIS tatap muka: false positive = <strong>mempermalukan nasabah di kasir</strong> (mahal!). Maka: auto-block hanya untuk skor ekstrem (≥0,85, precision &gt;90%); sisanya <strong>approve-then-review</strong> (FR13) — jangan tahan orang di kasir. Threshold = f(ekonomi + UX).</p>
      </details>
""",
},

R3["fr12-graph-analytics"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Membaca Jaringan"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Membaca Jaringan</h2>
      <p><strong>1.</strong> 8 rekening memakai 2 device: D1 dipakai R1-R5, D2 dipakai R4-R8. Rekening mana yang &ldquo;jembatan&rdquo;? Jika R1, R2, R3 terkonfirmasi mule, hitung risk(R4) dengan guilt-by-association sederhana.</p>
      <p><strong>2.</strong> Satu iterasi label propagation: A=1 (jahat) → B → C; D=0 (bersih) → C. Hitung skor B dan C setelah 1 iterasi. Apa yang terjadi jika iterasi dilanjutkan tanpa damping?</p>
      <p><strong>3.</strong> Kasus carding individual (1 kartu, 1 orang, belanja pribadi). Perlukah graph analytics? Jelaskan 2 kalimat.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> <strong>R4 jembatan</strong> (memakai D1 dan D2). Tetangga R4: via D1 → R1,R2,R3 (jahat), R5; via D2 → R6,R7,R8. Risk = 3/7 ≈ <strong>0,43</strong> — prioritas investigasi menengah-tinggi, bukan vonis.</p>
        <p><strong>2.</strong> B = 1,0; C = rata-rata(0,5; 0) = <strong>0,25</strong>. Tanpa damping, iterasi berlanjut akan <strong>menaikkan skor D yang bersih</strong> (tercemar balik) — makanya batasi 2-3 hop + damping.</p>
        <p><strong>3.</strong> <strong>Tidak.</strong> Tidak ada struktur jaringan — graph tidak menambah sinyal selain biaya. Model tabular + velocity cukup. <em>Bayar harga graph hanya untuk masalah berjaringan.</em></p>
      </details>
""",
},

R3["fr13-realtime"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Merancang 50ms"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Merancang 50ms</h2>
      <p><strong>1.</strong> Anggaran 80ms: network 10ms, feature fetch 35ms (3 query sequential @ ~12ms), inference 8ms, rule 5ms, overhead 5ms. Total? Apa optimasi pertamamu?</p>
      <p><strong>2.</strong> QPS puncak 2.000, latensi komputasi 40ms, 1 server = 24 worker. Berapa server untuk puncak + N+1?</p>
      <p><strong>3.</strong> Tiga skenario — pilih fail-open atau fail-closed + 1 kalimat alasan: (a) QRIS Rp20rb saat Redis down; (b) transfer Rp200jt saat model down; (c) top-up e-wallet Rp100rb saat overload 5x.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Total = <strong>63ms</strong> — masih di bawah 80ms, tapi tanpa cadangan. Optimasi pertama: <strong>paralelkan 3 query</strong> (35→12ms) → total 40ms, cadangan 40ms. <em>Selalu sisakan buffer untuk degradasi.</em></p>
        <p><strong>2.</strong> Konkurensi = 2.000 x 0,04 = <strong>80</strong> → 80/24 = 3,34 → <strong>4 server + 1 cadangan = 5</strong>.</p>
        <p><strong>3.</strong> (a) <strong>fail-open</strong> — nilai kecil, UX kritis; (b) <strong>fail-closed</strong> — nilai besar, risiko drain; (c) <strong>fail-open dengan load shedding</strong> — lewati scoring penuh untuk risiko historis rendah. <em>Keputusan bisnis, bukan teknis.</em></p>
      </details>
""",
},

R3["fr14-case-management"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Operasi Investigasi"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Operasi Investigasi</h2>
      <p><strong>1.</strong> Flag 4.500/hari, 1 review = 7 menit, produktivitas 70% dari 8 jam shift. Berapa investigator dibutuhkan? Jika hanya ada 25 orang, apa 2 langkah pertamamu?</p>
      <p><strong>2.</strong> Backlog 5.000 case, tim 20 orang (60 case/hari/orang). Bagaimana kamu memprioritaskan? Tulis aturan triase 2 baris.</p>
      <p><strong>3.</strong> Kamu ingin mengukur error rate dengan margin ±5%, tebakan awal 10%. Hitung ukuran sampel QA per bulan (Z=1,96).</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Kebutuhan = 4.500 x 7 = 31.500 menit = 525 jam. Per orang = 8 x 0,7 = 5,6 jam = <strong>48 case</strong> → butuh <strong>94 orang</strong>. Dengan 25 orang: (1) <strong>turunkan flag via threshold/auto-decision</strong> ke ±1.200/hari; (2) <strong>triase by expected value</strong> — kerjakan yang mahal dulu.</p>
        <p><strong>2.</strong> Contoh: &ldquo;Urutkan by (skor x nominal); kerjakan dari atas sampai kapasitas habis; sisanya auto-tunda 24 jam dengan pemberitahuan.&rdquo; <em>Prioritas eksplisit mengalahkan FIFO yang adil tapi bodoh.</em></p>
        <p><strong>3.</strong> n = (3,8416 x 0,1 x 0,9)/0,0025 = 0,3457/0,0025 ≈ <strong>138 case/bulan</strong> ≈ 7/hari. <em>Statistik, bukan perasaan.</em></p>
      </details>
""",
},

R3["fr16-anomali-time-series"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Membaca Deret Waktu"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Membaca Deret Waktu</h2>
      <p><strong>1.</strong> Settlement 6 hari (Rp jt): 5, 6, 5, 7, 6, 42. Hitung baseline robust, residual hari ke-6, dan z-score (σ hari normal ≈ 0,8). Klasifikasikan: point/contextual/collective?</p>
      <p><strong>2.</strong> Refund rate: target 3%, k=0,3, batas h=2,5. Data: 3,1; 3,0; 3,8; 4,0; 3,9. Jalankan CUSUM — di hari keberapa alarm menyala?</p>
      <p><strong>3.</strong> Merchant settlement naik 40x di minggu Harbolnas. Anomali atau bukan? Tulis 2 langkah verifikasimu sebelum eskalasi.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Median = <strong>6</strong>; residual = 42-6 = <strong>36</strong>; z = 36/0,8 = <strong>45σ</strong> — <strong>point anomaly</strong> ekstrem. Eskalasi langsung.</p>
        <p><strong>2.</strong> S: hari1 (3,1-3-0,3)&lt;0→0; hari2→0; hari3 (0,5)→0,5; hari4 (0,7)→1,2; hari5 (0,6)→1,8. <strong>Tidak menyala</strong> (1,8 &lt; 2,5) — butuh 1-2 hari lagi. <em>CUSUM sabar; itu kekuatannya.</em></p>
        <p><strong>3.</strong> <strong>Belum tentu</strong> — Harbolnas = regime shift. Verifikasi: (1) bandingkan dengan <em>Harbolnas tahun lalu</em> (baseline musiman); (2) cek pola pendukung: nominal seragam? jam aneh? refund 0%? <em>Konteks dulu, vonis kemudian.</em></p>
      </details>
""",
},

R3["fr17-explainability"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Menulis Penjelasan"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Menulis Penjelasan</h2>
      <p><strong>1.</strong> Skor 0,78, baseline 0,10. SHAP: velocity +0,30; device baru +0,20; nominal/p95=6x +0,12; jam aneh +0,08; akun 5 tahun -0,02. Verifikasi jumlahnya. Fitur mana yang <em>terutama</em> menjelaskan keputusan?</p>
      <p><strong>2.</strong> Tulis penjelasan untuk <strong>nasabah</strong> (2 kalimat, empatik, tanpa kata &ldquo;fraud&rdquo;/&ldquo;skor&rdquo;) dan untuk <strong>auditor</strong> (2 kalimat, formal, menyebut kontrol).</p>
      <p><strong>3.</strong> Nasabah protes: &ldquo;Jelaskan detail cara sistemmu menilaiku!&rdquo; Apa yang boleh dan tidak boleh kamu sampaikan? Kenapa?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> 0,10+0,30+0,20+0,12+0,08-0,02 = <strong>0,78 cocok</strong>. Terutama: <strong>velocity (+0,30) dan device baru (+0,20)</strong> — 74% dari selisih di atas baseline.</p>
        <p><strong>2.</strong> Nasabah: &ldquo;Kami menahan sementara karena pola transaksi yang tidak biasa dari perangkat baru — demi keamanan akun Bapak. Verifikasi 2 menit via telepon akan membukanya.&rdquo; Auditor: &ldquo;Blokir otomatis model vX berdasarkan velocity ternormalisasi dan status device di atas ambang risk appetite; jalur banding tersedia 24 jam (SOP-...).&rdquo;</p>
        <p><strong>3.</strong> Boleh: <em>alasan umum</em> + <em>jalur banding</em>. Tidak boleh: <strong>detail fitur/ambang</strong> — itu blueprint bagi penjahat yang menyamar jadi nasabah komplain. <em>Transparansi secukupnya, bukan telanjang.</em></p>
      </details>
""",
},

R3["fr18-mlops"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Deploy Tanpa Berjudi"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Deploy Tanpa Berjudi</h2>
      <p><strong>1.</strong> Tulis aturan rollback 2 baris untuk modelmu: kondisi kuantitatif + batas waktu. Kenapa harus ditulis <em>sebelum</em> deploy?</p>
      <p><strong>2.</strong> Model retrain rutin (tambah 1 bulan data, arsitektur sama). Pilih: langsung produksi / shadow / canary / A-B penuh — dan 1 kalimat alasan.</p>
      <p><strong>3.</strong> Precision turun 21% → 17% → 15% dalam 3 hari setelah deploy, flag rate naik 40%. Apa 3 langkah pertamamu jam ini juga?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Contoh: &ldquo;Rollback jika precision 2 hari beruntun &gt;3 poin di bawah baseline ATAU flag rate naik &gt;50% ATAU error pipeline. Eksekusi &lt;15 menit.&rdquo; Ditulis sebelum deploy karena <strong>kepala dingin menulis aturan; kepala panik melanggarnya</strong>.</p>
        <p><strong>2.</strong> <strong>Canary 5%</strong> — perubahan kecil, risiko rendah; shadow overkill, A-B penuh mahal untuk iterasi rutin. <em>Sesuaikan zirah dengan medan.</em></p>
        <p><strong>3.</strong> (1) <strong>Rollback ke versi sebelumnya</strong> <em>sekarang</em>; (2) bekukan deploy &amp; umumkan insiden; (3) baru investigasi: data? pipeline? drift? <em>Hentikan pendarahan dulu, diagnosis kemudian.</em></p>
      </details>
""",
},

R3["fr19-nlp-phishing"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Membaca Seperti Korban Tenang"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Membaca Seperti Korban Tenang</h2>
      <p><strong>1.</strong> Korpus 20.000 pesan; kata &ldquo;blokir&rdquo; muncul di 400 pesan. Hitung IDF-nya. Jika TF di sebuah pesan = 0,08, berapa TF-IDF? Apa artinya angka itu?</p>
      <p><strong>2.</strong> Rule urgency (≥2 kata urgency) di 100.000 pesan: flag 4.000, 500 di antaranya phishing terkonfirmasi (total phishing 800). Hitung precision &amp; recall. Apa perbaikan pertamamu?</p>
      <p><strong>3.</strong> Kamu menerima WA: &ldquo;Paket Bapak tertahan, klik link ini untuk bayar Rp25rb.&rdquo; Terapkan 3 pertanyaan &ldquo;korban tenang&rdquo; — tulis analisismu 3 baris.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> IDF = ln(20.000/400) = ln(50) ≈ <strong>3,91</strong>. TF-IDF = 0,08 x 3,91 ≈ <strong>0,31</strong> — kata ini <em>khas</em> (jarang di pesan biasa) sehingga bobotnya tinggi otomatis.</p>
        <p><strong>2.</strong> Precision = 500/4.000 = <strong>12,5%</strong>; recall = 500/800 = <strong>62,5%</strong>. Perbaikan: <strong>tambah lapis verifikasi pengirim</strong> — teks = radar, identitas pengirim = vonis. <em>Jangan blokir promo bank sendiri.</em></p>
        <p><strong>3.</strong> (1) Siapa pengirim <em>sebenarnya</em>? Nomor tak dikenal, bukan nomor resmi ekspedisi. (2) Ke mana link <em>sebenarnya</em> pergi? Cek domain — bukan domain resmi. (3) Apa yang <em>sebenarnya</em> diminta? Uang + nanti &ldquo;verifikasi&rdquo; = kredensial. <strong>Kesimpulan: phishing.</strong></p>
      </details>
""",
},

R3["fr21-sql-fraud"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Query Forensik"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Query Forensik</h2>
      <p><strong>1.</strong> Tulis query: kartu dengan &gt; 6 transaksi dalam 30 menit terakhir, tampilkan juga total nominal, urutkan dari yang terbesar. Tabel: transactions(card_id, trx_time, amount).</p>
      <p><strong>2.</strong> Satu rekening mule tertangkap (id 'M-001'). Tulis query untuk menemukan rekening <em>tujuan</em> transfernya dalam 7 hari terakhir + total nominal per tujuan.</p>
      <p><strong>3.</strong> Query-mu di 200 juta baris lambat (90 detik). Sebutkan 2 optimasi pertama + kapan kamu memakai materialized view.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> <em>SELECT card_id, COUNT(*) AS n, SUM(amount) AS total FROM transactions WHERE trx_time &gt;= NOW() - INTERVAL '30 minutes' GROUP BY card_id HAVING COUNT(*) &gt; 6 ORDER BY total DESC;</em> — filter waktu dulu, agregat, HAVING untuk hasil agregasi.</p>
        <p><strong>2.</strong> <em>SELECT dst_account, SUM(amount) AS total FROM transfers WHERE src_account = 'M-001' AND trx_time &gt;= NOW() - INTERVAL '7 days' GROUP BY dst_account ORDER BY total DESC;</em> — ini <strong>fan-out</strong>: langkah pertama memetakan jaringan.</p>
        <p><strong>3.</strong> (1) Pastikan <strong>partisi/index di trx_time</strong>; (2) <strong>agregasi sebelum join</strong>. Materialized view saat query <strong>dijalankan berulang</strong> (dashboard tiap 5 menit) dan <strong>basi 1 jam masih bisa diterima</strong>.</p>
      </details>
""",
},

R3["fr22-chargeback"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Ekonomi Chargeback"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Ekonomi Chargeback</h2>
      <p><strong>1.</strong> 25.000 transaksi/bulan, 40 chargeback. Hitung chargeback rate (%, bps). Aman dari program monitoring? Tapi berapa biaya totalnya (nilai rata-rata Rp800rb, fee Rp350rb)?</p>
      <p><strong>2.</strong> Chargeback Rp2jt, reason &ldquo;tidak mengenal transaksi&rdquo;, bukti 3DS + device match lengkap (win rate 55%), biaya representment Rp150rb. Lawan atau terima? Hitung.</p>
      <p><strong>3.</strong> Reason code &ldquo;langganan dibatalkan tapi tetap ditagih&rdquo; naik 3x dalam 2 bulan. Ini fraud atau bukan? Apa respons pertamamu — ke tim dispute atau tim produk?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Rate = 40/25.000 = <strong>0,16% = 16 bps</strong> — jauh di bawah ambang program (±0,9%). Tapi biaya = 40 x (800rb+350rb) = <strong>Rp46jt/bulan = Rp552jt/tahun</strong>. <em>Aman dari program bukan berarti tidak masalah.</em></p>
        <p><strong>2.</strong> E = 0,55 x 2jt - 150rb = 1,1jt - 150rb = <strong>+Rp950rb → LAWAN</strong>. Dengan bukti kuat, ini <em>investasi</em> bukan biaya.</p>
        <p><strong>3.</strong> <strong>Bukan fraud — ini bug produk/billing.</strong> Respons pertama: <strong>tim produk</strong> (perbaiki alur pembatalan!) + refund proaktif. Melawan chargeback-nya = membuang uang. <em>Setiap chargeback kategori ini = bug yang menagihmu Rp850rb+.</em></p>
      </details>
""",
},

R3["fr23-regulasi-indonesia"] = {
"toc_lat": ("latihan", "Latihan Mandiri: Kepatuhan dalam Angka"),
"latihan": """
      <h2 id="latihan">Latihan Mandiri: Kepatuhan dalam Angka</h2>
      <p><strong>1.</strong> Indikasi structuring ditemukan Selasa, 13 Oktober 2026. Batas lapor 14 hari kerja. Hitung deadline-nya (asumsi tanpa libur nasional) dan buat rencana mundurnya dalam 3 tahap.</p>
      <p><strong>2.</strong> Tiga temuan — routing ke mana masing-masing? (a) pola layering Rp8M; (b) nasabah protes pemblokiran ke OJK; (c) karyawan memberi tahu nasabah bahwa ia &ldquo;sedang dipantau PPATK&rdquo;.</p>
      <p><strong>3.</strong> CS menerima telepon dari nasabah yang transaksinya ditahan saat ia dalam pantauan EDD. Tulis skrip 2 kalimat yang aman (tanpa tipping-off).</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> 14 hari kerja dari 13 Okt (Sel) = <strong>2 November 2026</strong> (Senin). Rencana mundur: investigasi + komite s.d. 21 Okt; penyusunan STR + review legal s.d. 28 Okt; buffer + submit s.d. 2 Nov. <em>Mulai hari ini.</em></p>
        <p><strong>2.</strong> (a) <strong>STR ke PPATK</strong> (indikasi TPPU); (b) <strong>respons formal ke OJK</strong> + siapkan reason code (FR17); (c) <strong>insiden tipping-off</strong> — investigasi internal + lapor ke legal/PPATK sesuai ketentuan; karyawan diproses. <em>Urutannya menentukan, bukan kecepatannya saja.</em></p>
        <p><strong>3.</strong> Contoh: &ldquo;Transaksi Bapak sedang dalam <strong>verifikasi rutin</strong> sesuai prosedur kami; mohon menunggu maksimal 1x24 jam, atau Bapak dapat datang ke cabang terdekat dengan identitas.&rdquo; <strong>Tanpa</strong> kata: investigasi, pantauan, AML, PPATK.</p>
      </details>
""",
},
