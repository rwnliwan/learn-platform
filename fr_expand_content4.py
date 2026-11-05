# Chunk 4: fr19 - fr23
CONTENT4 = {}

# ================================================================= FR19
CONTENT4["fr19-nlp-phishing"] = {
"toc_worked": ("worked", "📐 Worked Example: TF-IDF & Rule Linguistik"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung Sinyal Bahasa</h2>
      <p>Deteksi phishing = <strong>membaca seperti korban yang tenang</strong>. Dua contoh cara mengukurnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: TF-IDF sederhana — 2 kalimat, 1 kata kunci</summary>
        <p>Kalimat P (phishing): &ldquo;SEGERA verifikasi akun Anda, klik link ini SEBELUM diblokir.&rdquo; Kalimat L (legit, dari bank): &ldquo;Info: promo akhir tahun untuk nasabah setia.&rdquo;</p>
        <p><strong>Langkah 1 — TF (term frequency).</strong> Kata &ldquo;segera&rdquo; muncul 1× dari 9 kata di P → TF = 0,11. Di L: 0.</p>
        <p><strong>Langkah 2 — IDF (inverse document frequency).</strong> Dari korpus 10.000 pesan, &ldquo;segera&rdquo; muncul di 200 pesan → IDF = ln(10.000/200) = ln(50) ≈ <strong>3,91</strong>. Kata umum seperti &ldquo;info&rdquo; (muncul di 5.000 pesan): IDF = ln(2) ≈ 0,69.</p>
        <p><strong>Langkah 3 — skor.</strong> TF-IDF &ldquo;segera&rdquo; di P = 0,11 × 3,91 = <strong>0,43</strong> vs &ldquo;info&rdquo; di L = 0,11 × 0,69 = 0,08. Kata <em>urgency</em> yang jarang di pesan legit tapi sering di phishing mendapat bobot tinggi <strong>otomatis</strong> — tanpa ada yang memberi tahu model bahwa &ldquo;segera&rdquo; itu mencurigakan. Inilah keindahan TF-IDF: ia menemukan <em>kata-kata khas penjahat</em> dari data.</p>
        <p><strong>Langkah 4 — batasnya.</strong> Penjahat yang menulis &ldquo;s_e_g_e_r_a&rdquo; atau &ldquo;segera&rdquo; dalam gambar lolos dari TF-IDF teks. Maka deteksi phishing <strong>tidak boleh</strong> hanya teks — gabungkan metadata (pengirim, link, jam) &amp; behavioral (FR: lesson inti).</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: rule urgency — presisi vs cakupan</summary>
        <p>Rule: <em>flag jika pesan mengandung ≥ 2 kata dari daftar urgency</em> (segera, terakhir, blokir, verifikasi, hadiah, menang, klik, transfer).</p>
        <p><strong>Evaluasi di 50.000 pesan (500 phishing terkonfirmasi):</strong> rule mem-flag 2.300 pesan, 380 di antaranya phishing. Precision = 380/2.300 = <strong>16,5%</strong>. Recall = 380/500 = <strong>76%</strong>.</p>
        <p><strong>Analisis:</strong> recall tinggi (menangkap 3 dari 4 phishing!) tapi precision rendah — 1.920 pesan legit ter-flag, termasuk <strong>promo bank yang sah</strong> (&ldquo;SEGERA klaim HADIAH akhir tahun, KLIK link ini&rdquo; — bank sungguhan menulis seperti phisher!). Inilah ironi industri: <em>marketing legit meniru bahasa penjahat</em>.</p>
        <p><strong>Perbaikan:</strong> tambahkan <strong>lapis verifikasi pengirim</strong> — rule urgency hanya memicu <em>skor</em>, bukan vonis; vonis butuh pengirim tak dikenal + link mencurigakan. Precision naik ke 41%, recall turun ke 68% — trade-off yang benar untuk menghindari &ldquo;memblokir promo bank sendiri&rdquo;. Pelajaran: <strong>fitur linguistik = radar, bukan peluru</strong>.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Teks, Metadata, atau Behavioral?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Lapis Deteksi Phishing</h2>
      <p>Phishing modern menyerang tiga lapisan — pertahanan harus berlapis juga:</p>
      <p><strong>Skenario A — kapan keyword rule cukup.</strong> Untuk: SMS/WA blast generik (&ldquo;paket tertahan&rdquo;) dengan pola teks stabil. Rule murah, cepat, mudah di-update saat template baru muncul. Tidak cukup untuk: spear-phishing personal (teksnya unik &amp; rapi).</p>
      <p><strong>Skenario B — kapan butuh ML/LLM.</strong> Untuk: phishing yang <em>terlihat profesional</em> — bahasa Indonesia sempurna, logo benar, domain mirip (bank-verify.net vs bank.co.id). Di sini yang membedakan bukan kata-katanya, tapi <strong>kombinasi sinyal halus</strong>: usia domain 3 hari + pengirim baru + urgency implisit + link shortener. Model embedding + metadata menangkap ini; rule kata tidak.</p>
      <p><strong>Skenario C — kapan behavioral mengalahkan keduanya.</strong> Untuk: <strong>account takeover via phishing yang berhasil</strong> — korban <em>sudah</em> memberikan OTP. Teks tidak relevan lagi; yang tersisa adalah <em>perilaku pasca-klik</em>: device baru + ganti alamat + velocity (FR3, kasus ATO). Pertahanan berlapis artinya: <strong>gagal di lapis teks ≠ kalah</strong> — lapis behavioral masih bisa menangkap.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> phisher menulis untuk <strong>manusia yang panik</strong> — deteksi terbaik membaca seperti <strong>korban yang tenang</strong>: siapa pengirimnya <em>sebenarnya</em>? ke mana link ini <em>sebenarnya</em> pergi? apa yang <em>sebenarnya</em> diminta? Tiga pertanyaan ini mengalahkan semua model bahasa — karena ia menyerang <em>asumsi</em>, bukan <em>kata</em>.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: &ldquo;Paket Tertahan Bea Cukai&rdquo;"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Phishing Paket & Kurir Palsu</h2>
      <p>Modus yang memakan korban terbanyak 2023–2025: SMS/WA &ldquo;Paket Anda tertahan di Bea Cukai, bayar Rp25.000 untuk rilis: [link]&rdquo; — atau varian &ldquo;kurir&rdquo; yang menelepon langsung (lihat FR3).</p>
      <p><strong>Anatomi serangan (pola umum):</strong></p>
      <ol>
        <li><strong>Umpan:</strong> pesan memakai nama &amp; alamat korban yang benar (dari data bocor) — membangun kepercayaan instan.</li>
        <li><strong>Link:</strong> situs tiruan jasa ekspedisi/bea cukai — meminta &ldquo;biaya rilis&rdquo; Rp25rb via transfer/QRIS ke rekening penampung.</li>
        <li><strong>Eskalasi:</strong> setelah Rp25rb masuk, korban diminta &ldquo;verifikasi&rdquo; dengan login e-banking di situs palsu → kredensial dicuri → <strong>drain penuh</strong> (Rp25rb hanyalah tiket masuk; target sebenarnya isi rekening).</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> 1 juta SMS blast × 0,5% klik × 20% korban lanjut = <strong>1.000 korban</strong>. Rata-rata kerugian Rp3,2jt (bukan Rp25rb — karena eskalasi!) = <strong>Rp3,2 miliar per kampanye</strong> — dengan biaya blast < Rp5jt. ROI penjahat: 640×.</p>
      <p><strong>Pertahanan berlapis yang benar:</strong> (1) <strong>edukasi pola, bukan contoh</strong> — &ldquo;instansi resmi tidak menagih via WA + link&rdquo; (aturan abadi) vs &ldquo;waspada SMS paket&rdquo; (basi bulan depan); (2) <strong>deteksi link</strong> di level operator/platform; (3) <strong>behavioral pasca-klik</strong> — bank menangkap drain-nya walau phishing-nya lolos. Korban yang diedukasi <em>pola</em> kebal terhadap <em>varian baru</em>; korban yang diedukasi <em>contoh</em> hanya kebal terhadap contoh itu.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Orang pintar tidak kena phishing.&rdquo;<br /><strong>Yang benar:</strong> phishing modern tidak menyerang <em>kecerdasan</em> — ia menyerang <strong>konteks</strong>: kamu <em>memang</em> menunggu paket, <em>memang</em> ada tagihan, <em>memang</em> dapat THR. Korbannya termasuk profesional &amp; teknisi. Pertahanan &ldquo;edukasi agar pintar&rdquo; gagal; pertahanan &ldquo;desain agar kesalahan tidak fatal&rdquo; (limit transfer, verifikasi berlapis) yang bekerja.</p>
      </div>
""",
},

# ================================================================= FR20
CONTENT4["fr20-capstone"] = {
"toc_worked": ("worked", "📐 Worked Example: Business Case & Presentasi Direksi"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dari Model ke Keputusan Direksi</h2>
      <p>Capstone bukan soal model terbaik — tapi <strong>rekomendasi yang bisa dipertahankan</strong>. Dua contoh pengerjaannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: business case sistem fraud untuk e-wallet baru</summary>
        <p>E-wallet &ldquo;DompetKita&rdquo; baru launching: proyeksi 2 juta transaksi/bulan akhir tahun pertama. Founder bertanya: &ldquo;perlu tim fraud sekarang atau nanti?&rdquo;</p>
        <p><strong>Langkah 1 — estimasi eksposur.</strong> Benchmark industri: fraud rate e-wallet 0,3–0,5%, severity rata-rata Rp380rb. Ambil tengah: E[Loss] = 2.000.000 × 0,004 × 380.000 = <strong>Rp3,04 M/bulan</strong> di akhir tahun 1.</p>
        <p><strong>Langkah 2 — desain bertahap.</strong> Fase 1 (bulan 1–3, volume kecil): 15 rule dasar + 1 analis (biaya Rp35jt/bulan) → potong 40% loss = hemat Rp1,2 M (saat volume penuh). Fase 2 (bulan 4–9): tambah device intelligence + model GBM sederhana (investasi Rp400jt sekali + Rp60jt/bulan) → potong 60% = hemat Rp1,8 M/bulan. Fase 3 (tahun 2): graph + realtime penuh.</p>
        <p><strong>Langkah 3 — rekomendasi.</strong> <strong>Mulai fase 1 SEKARANG</strong> (bukan &ldquo;nanti&rdquo;): biaya Rp35jt/bulan vs eksposur yang tumbuh ke Rp3 M/bulan. Argumen kuncinya: <strong>pertahanan yang dibangun saat volume kecil 10× lebih murah</strong> daripada memadamkan kebakaran saat volume besar — karena rule &amp; data history butuh waktu matang (FR4: label lag!). Menunda = membayar bunga keterlambatan.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menerjemahkan &ldquo;recall 0,72&rdquo; ke bahasa direksi</summary>
        <p>Model capstone-mu: precision 0,25, recall 0,72. Direksi bertanya: &ldquo;bagus atau tidak?&rdquo; — jawaban &ldquo;F1-nya 0,37&rdquo; = kamu gagal berkomunikasi.</p>
        <p><strong>Langkah 1 — ke operasional.</strong> Volume 1 juta trx/bulan, fraud rate 0,2% → 2.000 fraud. Recall 0,72 → <strong>1.440 tertangkap</strong>, 560 lolos. Precision 0,25 → flag = 1.440/0,25 = <strong>5.760 review/bulan</strong> = 288/hari = <strong>4 investigator</strong> (80/hari).</p>
        <p><strong>Langkah 2 — ke rupiah.</strong> Nilai: 1.440 × Rp1,1jt = Rp1,58 M dicegah. Biaya: 5.760 × Rp25rb = Rp144jt + 4 investigator Rp60jt = Rp204jt. <strong>Net: +Rp1,38 M/bulan.</strong></p>
        <p><strong>Langkah 3 — kalimat direksi.</strong> &ldquo;Sistem ini butuh 4 orang dan Rp204jt/bulan, menyelamatkan Rp1,58 M/bulan — <strong>balik modal 7,7×</strong>. Dari 5 fraud, hampir 4 tertangkap. Yang lolos 560 kasus/bulan — itu pekerjaan tahap 2.&rdquo; <strong>Satu paragraf ini lebih berharga daripada 50 halaman metrik.</strong> Capstone yang hebat = analis yang bisa duduk di kedua sisi meja: membangun model <em>dan</em> menjualnya.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Scope & Build-vs-Buy"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Keputusan Arsitek</h2>
      <p>Capstone melatih keputusan tingkat arsitek. Tiga yang paling menentukan:</p>
      <p><strong>Skenario A — MVP rule vs langsung ML.</strong> Pilih <strong>MVP rule dulu</strong> jika: volume &lt; 500rb trx/bulan, tim &lt; 3 orang, pola fraud belum dipahami. Rule MVP memberi 3 hal yang ML butuhkan: <em>label</em> (dari review), <em>pemahaman pola</em>, dan <em>kredibilitas</em> ke manajemen. Langsung ML tanpa fondasi ini = model mahal yang tidak dipercaya (lihat kasus FR7).</p>
      <p><strong>Skenario B — build vs buy.</strong> <em>Buy</em> (vendor fraud) jika: butuh cepat (&lt; 3 bulan), fraud lintas-merchant (butuh network effect data vendor), tim kecil. <em>Build</em> jika: fraud spesifik unik bisnismu, skala besar (biaya vendor 1–3% GMV menjadi mahal di skala), atau data adalah keunggulan kompetitif. Banyak perusahaan Indonesia yang bijak: <strong>buy untuk fondasi, build untuk diferensiasi</strong>.</p>
      <p><strong>Skenario C — kapan memotong scope.</strong> Tanda scope harus dipotong: timeline &gt; 6 bulan tanpa hasil parsial, dependensi &gt; 3 tim, atau &ldquo;fase 1&rdquo; butuh semua fitur. Potong menjadi: <strong>satu pola fraud + satu kanal + satu metrik sukses</strong> dalam 90 hari. Proyek yang mengirim <em>sesuatu yang bekerja</em> dalam 90 hari mendapat kepercayaan untuk 2 tahun berikutnya; proyek &ldquo;big bang&rdquo; 18 bulan biasanya mati di bulan ke-8.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> capstone yang bagus bukan yang modelnya paling canggih — tapi yang <strong>keputusannya paling bisa dipertahankan</strong> di depan direksi yang skeptis, auditor yang teliti, dan investigator yang sinis. Tiga penonton, satu cerita yang konsisten: itulah ujian sebenarnya.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: 90 Hari Membangun dari Nol"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Roadmap 90 Hari Fintech Baru</h2>
      <p>Fintech lending baru (pola umum 2024–2025): launching dengan <strong>nol</strong> pertahanan fraud — &ldquo;fokus growth dulu&rdquo;. Bulan ke-3: fraud rate 2,1% (7× benchmark!), kerugian Rp1,8 M/bulan, investor bertanya. Konsultan dipanggil. Inilah rencana 90 hari yang benar:</p>
      <ol>
        <li><strong>Hari 1–14 (stop the bleeding):</strong> 10 rule darurat (velocity, device baru + nominal besar, KTP reuse) + 2 analis kontrak. Target: potong 50% loss dalam 2 minggu. <em>Prinsip: jangan bangun rumah saat kebakaran — padamkan dulu.</em></li>
        <li><strong>Hari 15–45 (fondasi data):</strong> pipeline label (definisi fraud vs sengketa, FR4), feature store dasar (20 fitur, FR6), dashboard monitoring. Target: setiap fraud punya label &amp; alasan dalam 7 hari.</li>
        <li><strong>Hari 46–90 (model pertama):</strong> GBM sederhana (bukan deep learning!) di atas 20 fitur, shadow 2 minggu, canary 5%, lalu produksi dengan dua threshold (FR11, FR18).</li>
      </ol>
      <p><strong>Hasil ilustratif pola umum:</strong> fraud rate 2,1% → 0,6% dalam 90 hari; kerugian Rp1,8 M → Rp520jt/bulan; tim 2 → 6 orang. Bukan &ldquo;selesai&rdquo; — tapi <strong>terkendali &amp; terukur</strong>, dengan fondasi untuk tahun kedua (graph, realtime).</p>
      <p><strong>Pelajaran capstone:</strong> urutan <strong>rule → data → model</strong> bukan kemunduran — ia <em>strategi</em>. Setiap fase membiayai fase berikutnya (penghematan fase 1 membayar investasi fase 2) dan membangun kepercayaan organisasi. Arsitek hebat bukan yang merancang sistem sempurna — tapi yang merancang <strong>evolusi yang bisa dibiayai</strong>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Capstone harus pakai teknologi paling canggih biar impressive.&rdquo;<br /><strong>Yang benar:</strong> yang impressive bagi direksi/auditor/investigator adalah <strong>keputusan yang tepat dengan alasan yang jernih</strong> — bukan arsitektur yang rumit. Sistem &ldquo;sederhana&rdquo; yang menghemat Rp1,38 M/bulan mengalahkan sistem &ldquo;canggih&rdquo; yang tidak pernah deploy. Kesederhanaan yang disengaja = kecanggihan tertinggi.</p>
      </div>
""",
},

# ================================================================= FR21
CONTENT4["fr21-sql-fraud"] = {
"toc_worked": ("worked", "📐 Worked Example: Query Velocity & Device Sharing"),
"worked": """
      <h2 id="worked">📐 Worked Example: Dua Query yang Menangkap 80% Pola</h2>
      <p>SQL fraud = <strong>menerjemahkan intuisi menjadi agregasi</strong>. Dua contoh dengan penjelasan baris per baris.</p>

      <details className="worked">
        <summary>📐 Contoh 1: velocity per kartu per jam (dengan penjelasan)</summary>
        <p>Pertanyaan: &ldquo;kartu mana yang transaksi &gt; 8× dalam 1 jam terakhir?&rdquo;</p>
        <p><strong>Query:</strong></p>
        <pre>{`SELECT card_id,
       COUNT(*) AS trx_1h,
       SUM(amount) AS amt_1h
FROM transactions
WHERE trx_time >= NOW() - INTERVAL '1 hour'
GROUP BY card_id
HAVING COUNT(*) > 8
ORDER BY amt_1h DESC;`}</pre>
        <p><strong>Bedah baris:</strong> <em>WHERE trx_time &gt;= ...</em> — batasi jendela dulu (filter sebelum agregasi = cepat). <em>GROUP BY card_id</em> — entitas agregasi (FR6: pilih entitas yang tepat!). <em>HAVING COUNT(*) &gt; 8</em> — filter <em>setelah</em> agregasi (WHERE tidak bisa pakai hasil COUNT). <em>ORDER BY amt_1h DESC</em> — urutkan by expected value: investigator mulai dari yang paling mahal.</p>
        <p><strong>Variasi analis senior:</strong> tambahkan <em>perbandingan baseline</em> — join ke tabel rata-rata historis kartu, flag hanya jika &gt; 10× baseline-nya. Tanpa ini, kartu korporat yang memang 50 trx/jam ikut ke-flag (false positive abadi).</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: device sharing via self-join</summary>
        <p>Pertanyaan: &ldquo;device apa yang dipakai oleh ≥ 5 KTP berbeda dalam 7 hari?&rdquo; (pola pabrik pengajuan FR6/FR12).</p>
        <p><strong>Query:</strong></p>
        <pre>{`SELECT device_id,
       COUNT(DISTINCT ktp_no) AS ktp_count,
       COUNT(*) AS total_pengajuan
FROM loan_applications
WHERE apply_time >= NOW() - INTERVAL '7 days'
GROUP BY device_id
HAVING COUNT(DISTINCT ktp_no) >= 5;`}</pre>
        <p><strong>Bedah:</strong> <em>COUNT(DISTINCT ktp_no)</em> — kuncinya: bukan jumlah pengajuan, tapi jumlah <em>identitas unik</em>. Satu orang mengajukan 10× = 1 (wajar, mungkin gagal upload). 10 KTP dari 1 device = 10 (pabrik!).</p>
        <p><strong>Langkah lanjut (investigasi):</strong> untuk tiap device yang kena, tarik daftar KTP-nya + join ke tabel pencairan — berapa yang <em>cair</em>? Itulah eksposur rupiahnya. Lalu: apakah KTP-KTP itu juga muncul di device lain? (2-hop — cikal bakal graph FR12). <strong>SQL yang baik tidak berhenti di &ldquo;ketemu&rdquo; — ia membuka pintu investigasi berikutnya.</strong></p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Teknik SQL"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Teknik Apa</h2>
      <p>Tiga pilihan teknik yang menentukan query-mu cepat atau lemot, tepat atau ngawur:</p>
      <p><strong>Skenario A — window function vs self-join.</strong> Untuk &ldquo;transaksi sebelumnya dari kartu yang sama&rdquo;: <strong>window function</strong> (LAG/LEAD, ROW_NUMBER) — 1 scan, jauh lebih cepat. Self-join hanya untuk relasi <em>antar entitas berbeda</em> (device–KTP). Aturan: <em>satu tabel, urutan waktu → window function; dua entitas → join</em>.</p>
      <p><strong>Skenario B — kapan materialized view.</strong> Query velocity dijalankan tiap 5 menit oleh dashboard + tiap ada investigasi. Hitung ulang dari 100 juta baris tiap kali = bunuh database. Solusi: <strong>materialized view per jam</strong> yang di-refresh terjadwal — query menjadi baca tabel kecil. Harga: data basi ≤ 1 jam (untuk monitoring cukup; untuk blokir realtime tidak — itu ranah feature store FR13).</p>
      <p><strong>Skenario C — kapan SQL cukup vs butuh Python.</strong> SQL cukup untuk: agregasi, filter pola, join investigasi (80% pekerjaan!). Butuh Python ketika: model ML, graph multi-hop kompleks, atau teks/NLP. Aturan jujur: <strong>jika bisa SQL, jangan Python</strong> — SQL lebih cepat, lebih mudah diaudit, dan bisa dijalankan siapa pun di tim.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> 80% pola fraud bisa ditangkap dengan <strong>SQL yang rapi</strong> — sebelum menyentuh ML apa pun. Analis yang menguasai window function + agregasi cerdas lebih berharga daripada yang bisa memanggil 10 algoritma tapi tidak bisa menulis query investigasi.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Memburu Mule Ring dengan 3 Query"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Forensik Mule Ring dalam 1 Jam</h2>
      <p>Skenario forensik (pola umum investigasi bank): satu rekening mule <strong>tertangkap</strong> (dilaporkan korban). Tugasmu: temukan seluruh jaringannya — dengan SQL, dalam 1 jam.</p>
      <p><strong>Query 1 — ke mana uangnya pergi (fan-out):</strong> semua rekening tujuan transfer dari mule tertangkap dalam 7 hari terakhir, dengan total nominal. Hasil: 14 rekening, total Rp840jt — 80% dalam 2 jam setelah dana masuk (pola <em>pass-through</em>, bukan tabungan).</p>
      <p><strong>Query 2 — siapa saudara-saudaranya (shared attributes):</strong> rekening lain yang (a) menerima dari pengirim yang sama, ATAU (b) login dari device yang sama, ATAU (c) dibuka di cabang &amp; tanggal yang sama. Hasil: 23 rekening kandidat — <strong>jaringan 24 rekening</strong> (termasuk yang tertangkap).</p>
      <p><strong>Query 3 — berapa eksposurnya:</strong> total dana masuk ke 24 rekening dalam 30 hari − yang sudah dibekukan. Hasil: <strong>Rp2,1 miliar</strong> perputaran, Rp1,4 miliar masih bisa diselamatkan dengan pembekuan serentak <em>hari ini</em>.</p>
      <p><strong>Pelajaran:</strong> tiga query sederhana — <strong>tanpa ML, tanpa graph database</strong> — memetakan jaringan Rp2,1 miliar dalam 1 jam. Inilah kenapa SQL adalah <em>senjata forensik utama</em>: saat insiden, kamu butuh jawaban dalam jam, bukan model yang butuh 2 minggu training. Kuasai dulu yang cepat, baru yang canggih.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;SQL itu kuno, sekarang zamannya Python/ML.&rdquo;<br /><strong>Yang benar:</strong> dalam investigasi fraud, <strong>kecepatan menjawab &gt; kecanggihan metode</strong>. Query yang menjawab dalam 10 menit mengalahkan model yang menjawab dalam 10 hari — karena uangnya sudah pergi dalam 10 jam. SQL bukan kuno; ia <em>senjata tercepat</em> di gudangmu.</p>
      </div>
""",
},

# ================================================================= FR22
CONTENT4["fr22-chargeback"] = {
"toc_worked": ("worked", "📐 Worked Example: Chargeback Rate & Ekonomi Representment"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung Siklus Chargeback</h2>
      <p>Chargeback = <strong>fraud yang menagih balik</strong> — plus biaya, plus risiko program monitoring. Dua contoh hitungannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: chargeback rate &amp; ambang program monitoring</summary>
        <p>Merchant memproses 40.000 transaksi/bulan. Chargeback masuk: 55 kasus. Nilai rata-rata Rp1,2jt.</p>
        <p><strong>Langkah 1 — chargeback rate.</strong> 55/40.000 = <strong>0,1375%</strong> = 13,75 bps.</p>
        <p><strong>Langkah 2 — bandingkan ambang.</strong> Visa VDMP: waspada di 0,9% (90 bps)?? — tidak, ambang program: <strong>≥ 100 chargeback DAN rate ≥ 0,9%</strong> (angka ilustratif, bervariasi per skema). Dengan 55 kasus &amp; 0,14%, merchant ini <strong>aman jauh</strong> dari program.</p>
        <p><strong>Langkah 3 — tapi hitung biayanya.</strong> 55 × Rp1,2jt = Rp66jt barang hilang + 55 × Rp350rb fee chargeback = Rp19,25jt → <strong>total Rp85,25jt/bulan</strong>. &ldquo;Aman dari program&rdquo; ≠ &ldquo;tidak masalah&rdquo; — Rp85jt/bulan = Rp1 M/tahun menguap diam-diam. Pelajaran: <strong>program monitoring adalah batas katastrofal, bukan target operasional</strong>. Target sehat: &lt; 0,3%.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: ekonomi representment — kapan melawan Rp500rb?</summary>
        <p>Chargeback Rp500rb masuk. Opsi: (a) terima (rugi Rp500rb + fee Rp350rb), (b) lawan via representment (biaya dokumen &amp; admin Rp150rb, peluang menang 35%).</p>
        <p><strong>Langkah 1 — nilai ekspektasian melawan.</strong> E = 0,35 × Rp500rb − Rp150rb = Rp175rb − Rp150rb = <strong>+Rp25rb</strong>. Secara matematis: lawan!</p>
        <p><strong>Langkah 2 — tapi ada biaya tersembunyi.</strong> Win rate 35% adalah <em>rata-rata</em> — untuk reason code &ldquo;tidak mengenal transaksi&rdquo; dengan bukti AVS+CVV+device match, win rate 55%; untuk &ldquo;barang tidak diterima&rdquo; tanpa resi, win rate 12%. Hitung <strong>per reason code</strong>, bukan rata-rata.</p>
        <p><strong>Langkah 3 — aturan operasional.</strong> Lawan jika: (nilai × win_rate_reason_code) &gt; biaya + Rp50rb margin. Untuk Rp500rb dengan win rate 55%: Rp275rb &gt; Rp200rb → <strong>lawan</strong>. Dengan win rate 12%: Rp60rb &lt; Rp200rb → <strong>terima &amp; fokus cegah</strong>. Dan: <strong>first-party fraud yang terbukti</strong> (pelanggan berbohong) → lawan <em>selalu</em> (bukan soal rupiah — soal memberi sinyal bahwa berbohong tidak gratis).</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Fight, Accept, atau Cegah?"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Strategi per Reason Code</h2>
      <p>Tidak semua chargeback diperlakukan sama. Tiga skenario:</p>
      <p><strong>Skenario A — &ldquo;tidak mengenal transaksi&rdquo; (10.4).</strong> Ini <strong>third-party fraud</strong> klasik. Respons: lawan dengan bukti teknis (AVS, CVV, device fingerprint, IP geolocation) — win rate tertinggi (40–60%). Paralel: perkuat 3-D Secure untuk pola ini. <em>Jangan</em> salahkan CS — ini serangan, bukan layanan.</p>
      <p><strong>Skenario B — &ldquo;barang tidak diterima&rdquo; (13.3).</strong> Dua kemungkinan: merchant memang lalai (perbaiki logistik!) atau <strong>friendly fraud</strong> (pelanggan terima barang lalu menyangkal). Pembedanya: resi + foto serah terima + histori pelanggan. Jika bukti pengiriman kuat → lawan agresif + tandai pelanggan. Jika lemah → terima, perbaiki SOP, jangan ulangi.</p>
      <p><strong>Skenario C — &ldquo;langganan dibatalkan tapi tetap ditagih&rdquo;.</strong> Ini <strong>bukan fraud</strong> — ini kegagalan produk/billing. Melawan = membuang uang + merusak reputasi. Respons benar: perbaiki alur pembatalan (satu klik, konfirmasi jelas), refund proaktif sebelum jadi chargeback. Setiap chargeback kategori ini = <strong>bug produk yang menagihmu Rp850rb</strong> (nilai + fee).</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Chargeback selalu salah merchant — terima saja, jangan dilawan.&rdquo;<br /><strong>Yang benar:</strong> 20–40% chargeback di e-commerce adalah <strong>friendly fraud</strong> — pelanggan yang berbohong. Menerima semua = <strong>mensubsidi kebohongan</strong> dan mengundang pengulangan. Lawan yang layak dilawan (dengan bukti), terima yang memang salahmu, cegah yang bisa dicegah. Tiga kata kerja, tiga nasib berbeda.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Friendly Fraud Pasca-Liburan"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Travel Online & Gelombang Januari</h2>
      <p>Pola tahunan di OTA (online travel agent) Indonesia: <strong>Januari–Februari</strong> = gelombang chargeback untuk booking hotel &amp; tiket <strong>November–Desember</strong> (liburan akhir tahun).</p>
      <p><strong>Anatomi (pola umum):</strong> pelanggan memesan hotel Rp4jt untuk liburan → menginap &amp; menikmati → Januari mengajukan chargeback &ldquo;tidak mengenal transaksi&rdquo;. Bukti OTA: login dari device &amp; IP yang sama dengan histori, e-tiket dibuka 12×, check-in terkonfirmasi properti. <strong>Ini bukan pencurian — ini penyesalan yang dibungkus kebohongan.</strong></p>
      <p><strong>Angka ilustratif:</strong> 400 chargeback &ldquo;liburan&rdquo; × Rp4jt = <strong>Rp1,6 M</strong> per musim. Win rate representment dengan bukti digital lengkap: 62% → Rp992jt kembali. Biaya: Rp60jt admin. <strong>Net: +Rp932jt</strong> — dari &ldquo;pekerjaan admin&rdquo; yang sering diremehkan.</p>
      <p><strong>Pelajaran sistemik:</strong> (1) <strong>kumpulkan bukti <em>sebelum</em> dibutuhkan</strong>: log device, IP, pembukaan e-tiket, konfirmasi properti — semua otomatis tersimpan; representment tanpa bukti = donasi. (2) <strong>tandai &amp; bagikan</strong>: pelanggan friendly fraud masuk daftar pantau — transaksi berikutnya butuh verifikasi ekstra. (3) <strong>komunikasikan ke pelanggan</strong>: &ldquo;kami mencatat pola ini&rdquo; adalah deterrent yang murah &amp; legal. Pencegahan terbaik = penjahat tahu kamu <em>melihat</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> chargeback adalah <strong>satu-satunya jenis fraud yang mengirimimu tagihan rinci</strong> — reason code, nominal, tenggat. Perlakukan setiap chargeback sebagai <em>laporan intelijen gratis</em>: pola reason code = peta kelemahan bisnismu. Yang hanya &ldquo;mengurus&rdquo; chargeback rugi dua kali; yang <em>membacanya</em> untung dari pelajarannya.</p>
      </div>
""",
},

# ================================================================= FR23
CONTENT4["fr23-regulasi-indonesia"] = {
"toc_worked": ("worked", "📐 Worked Example: Timeline STR & Eksposur Sanksi"),
"worked": """
      <h2 id="worked">📐 Worked Example: Menghitung Kewajiban Regulasi</h2>
      <p>Regulasi = <strong>tenggat &amp; angka</strong>. Dua contoh cara menghitungnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: timeline pelaporan — dari temuan ke STR</summary>
        <p>Senin, 12 Oktober 2026: tim AML menemukan pola structuring (6 setoran @Rp480jt, contoh FR15). Kapan STR harus sampai ke PPATK?</p>
        <p><strong>Langkah 1 — identifikasi kewajiban.</strong> Transaksi keuangan mencurigakan → wajib lapor STR ke PPATK. Batas umum praktik: <strong>14 hari kerja</strong> sejak indikasi diketahui (ketentuan detail mengikuti regulasi terkini — selalu cek update PPATK!).</p>
        <p><strong>Langkah 2 — hitung hari kerja.</strong> 12 Okt (Senin) = hari ke-0. 14 hari kerja → <strong>30 Oktober 2026</strong> (Jumat), tanpa libur nasional di antaranya.</p>
        <p><strong>Langkah 3 — rencanakan mundur.</strong> Investigasi internal + persetujuan komite: 7 hari kerja (selesai 21 Okt). Penyusunan STR + review legal: 5 hari (selesai 28 Okt). Buffer: 2 hari. <strong>Mulai hari ini</strong> — bukan &ldquo;minggu depan&rdquo;. Keterlambatan 1 hari = temuan audit; keterlambatan sistematis = sanksi.</p>
        <p><strong>Langkah 4 — yang sering lupa.</strong> Selama 14 hari itu: <strong>jangan tipping-off</strong> (FR15, skenario C) — nasabah tidak boleh tahu ia dilaporkan. Dan: dokumentasikan <em>setiap</em> langkah dengan timestamp — &ldquo;kami menemukannya tanggal X, melaporkannya tanggal Y&rdquo; adalah bukti kepatuhanmu saat diperiksa.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: eksposur sanksi — harga sebuah program AML yang lemah</summary>
        <p>Bank menengah: 2 juta nasabah, program AML dinilai &ldquo;tidak memadai&rdquo; dalam pemeriksaan (monitoring tidak jalan 8 bulan, 40 STR terlambat).</p>
        <p><strong>Langkah 1 — sanksi administratif.</strong> Ilustratif: denda per pelanggaran kewajiban lapor dapat mencapai <strong>miliaran rupiah</strong> + teguran tertulis + pembatasan kegiatan usaha tertentu. 40 STR terlambat × denda per kejadian = eksposur puluhan miliar — <em>sebelum</em> reputasi.</p>
        <p><strong>Langkah 2 — biaya remidiasi.</strong> Konsultan + sistem baru + rekrutmen: Rp15–30 M sekali + Rp5 M/tahun operasional. Ditambah: pemeriksaan lanjutan 2 tahun (biaya audit &amp; pelaporan ekstra).</p>
        <p><strong>Langkah 3 — bandingkan dengan investasi.</strong> Membangun program AML yang benar sejak awal: Rp8–12 M/tahun. <strong>Rasio: 1 : 5+</strong> — mencegah 5× lebih murah daripada mengobati. Angka ini adalah <em>business case</em> untuk direksi yang bertanya &ldquo;kenapa budget compliance besar?&rdquo;: karena alternatifnya bukan &ldquo;hemat&rdquo; — alternatifnya adalah denda + remidiasi + pengawasan ketat.</p>
      </details>
""",
"toc_peta2": ("peta-lanjut", "🗺️ Peta Keputusan Lanjutan: Jalur Eskalasi"),
"peta2": """
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Lapor ke Mana, Kapan Libatkan Siapa</h2>
      <p>Tiga keputusan routing yang salah satunya bisa jadi masalah pidana:</p>
      <p><strong>Skenario A — PPATK vs OJK vs BI vs Kepolisian.</strong> <strong>PPATK:</strong> STR (indikasi TPPU/pendanaan terorisme) — intelijen keuangan, bukan penyidik. <strong>OJK:</strong> laporan kepatuhan, pelanggaran prudensial, perlindungan konsumen. <strong>BI:</strong> sistem pembayaran &amp; PUJK terkait. <strong>Kepolisian/Kejaksaan:</strong> tindak pidana (laporan polisi). Satu kasus bisa menyentuh ketiganya — <strong>urutannya</strong>: STR ke PPATK (kewajiban), laporan internal ke OJK/BI sesuai ketentuan, lapor polisi jika ada korban/kerugian pidana. Salah alamat = kewajiban dianggap tidak terpenuhi.</p>
      <p><strong>Skenario B — kapan libatkan legal internal vs eksternal.</strong> Internal cukup untuk: STR rutin, respons pemeriksaan biasa. Eksternal (law firm) untuk: indikasi melibatkan direksi/pejabat, potensi pidana korporasi, sengketa dengan regulator. Aturan: <strong>jika temuan bisa menyentuh direksi, investigator internal punya konflik kepentingan</strong> — libatkan pihak independen sejak hari pertama.</p>
      <p><strong>Skenario C — tipping-off: garis merahnya.</strong> Dilarang: memberi tahu nasabah/calon tersangka bahwa ia dilaporkan atau dipantau. Diperbolehkan: prosedur standar yang berlaku umum (&ldquo;transaksi Bapak perlu verifikasi rutin&rdquo;). Area abu-abu: menolak transaksi tanpa penjelasan — amannya: siapkan <strong>skrip yang disetujui legal</strong> untuk setiap skenario, latihkan ke semua front-liner. Pelanggaran tipping-off = <strong>pidana</strong>, bukan administratif — ini garis yang tidak boleh dilewati sekali pun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> regulator tidak menghukum bank yang <em>kecolongan</em> satu kasus — ia menghukum bank yang <strong>tidak punya sistem</strong> untuk menangkapnya. Pertanyaan pemeriksa bukan &ldquo;kenapa lolos?&rdquo; melainkan &ldquo;di mana SOP-nya, di mana laporannya, di mana perbaikannya?&rdquo;. Sistem yang jujur tentang kegagalannya &gt; sistem yang sempurna di atas kertas.</p>
      </div>
""",
"toc_kasus": ("kasus-nyata", "🇮🇩 Kasus Nyata: Pelajaran dari Denda AML"),
"kasus": """
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Anatomi Sebuah Sanksi</h2>
      <p>Pola umum dari berbagai sanksi administratif di sektor keuangan Indonesia (kompilasi, bukan satu kasus spesifik): bank dikenai denda miliaran rupiah + pembatasan ekspansi — bukan karena terlibat kejahatan, tapi karena <strong>program AML-nya tidak berfungsi</strong>.</p>
      <p><strong>Temuan pemeriksa yang berulang:</strong></p>
      <ol>
        <li><strong>Monitoring fiktif:</strong> sistem ada, tapi threshold tidak pernah di-tuning 3 tahun — 0 STR dari segmen berisiko tinggi (padahal volume besar).</li>
        <li><strong>KYC kedaluwarsa:</strong> 40% nasabah korporat tidak pernah di-review ulang sejak onboarding 5 tahun lalu — pemilik manfaat sudah berganti, bank tidak tahu.</li>
        <li><strong>STR terlambat sistematis:</strong> rata-rata 60 hari dari temuan ke pelaporan — pola, bukan insiden.</li>
        <li><strong>Training formalitas:</strong> seluruh staf &ldquo;sudah training&rdquo; (tanda tangan hadir), tapi front-liner tidak tahu apa itu tipping-off saat ditanya langsung.</li>
      </ol>
      <p><strong>Pelajaran untuk analis:</strong> keempat temuan ini <strong>terdeteksi dari data</strong> — bukan dari wawancara. 0 STR dari segmen berisiko = anomali statistik. KYC kedaluwarsa = query umur data. STR terlambat = selisih tanggal. Artinya: <strong>analis data adalah garda terdepan kepatuhan</strong> — dashboard yang jujur akan berteriak <em>sebelum</em> pemeriksa datang. Bangun metrik kepatuhan (STR on-time rate, KYC freshness, tuning log) dengan serius yang sama seperti metrik fraud.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Regulasi = beban yang menghambat bisnis.&rdquo;<br /><strong>Yang benar:</strong> regulasi yang dipahami = <strong>keunggulan kompetitif</strong>. Bank dengan program AML kuat mendapat kepercayaan korporat &amp; koresponden bank asing — yang lemah kehilangan keduanya. Di pasar keuangan, <em>kepercayaan adalah mata uang</em> — dan kepatuhan adalah cara mencetaknya.</p>
      </div>
""",
},
