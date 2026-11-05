# Round 2c: fr17 - fr23 (intuisi + faq)
R2C = {}

R2C["fr17-explainability"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Penjelasan adalah Produk"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Penjelasan adalah Produk</h2>
      <p>Model tanpa penjelasan seperti <strong>vonis tanpa pertimbangan hakim</strong> — mungkin benar, tapi tidak bisa diterima. Di industri teregulasi, <strong>penjelasan bukan dokumentasi tambahan — ia bagian dari produk</strong>: tanpanya, keputusan tidak bisa dipertahankan ke nasabah, auditor, atau regulator. Anggaran explainability (SHAP serving, reason code, training CS) = anggaran <em>kepercayaan</em>.</p>
      <p>Intuisi kedua: <strong>penjelasan yang baik itu <em>kontrastif</em></strong> — ia menjawab &ldquo;kenapa <em>ini</em> dan bukan <em>itu</em>?&rdquo; &ldquo;Kenapa diblokir? Karena velocity 200x normal — <em>transaksi normalmu tidak seperti ini</em>.&rdquo; Manusia memahami lewat perbandingan, bukan lewat angka absolut. Reason code yang baik selalu mengandung <strong>pembanding implisit</strong>: &ldquo;tidak seperti biasanya&rdquo;.</p>
      <p><strong>Kapan explainability ini TIDAK perlu / berbahaya:</strong> (1) <strong>memberi terlalu banyak detail ke nasabah</strong> — &ldquo;velocity_1h_ratio=200 memicu ambang&rdquo; = memberi penjahat (yang menyamar jadi nasabah komplain) <em>blueprint</em> sistemmu; (2) <strong>untuk model yang inherently interpretable</strong> — jangan SHAP-kan logistic regression; koefisiennya <em>adalah</em> penjelasannya; (3) <strong>saat penjelasan palsu</strong> — surrogate yang tidak setia = kebohongan yang rapi. <strong>Kejujuran lebih penting dari kerapian.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji setiap penjelasan dengan <strong>&ldquo;tes 2 menit CS&rdquo;</strong>: bisakah CS menjelaskan keputusan ini ke nasabah yang marah dalam 2 menit, tanpa membuka dashboard teknis? Jika ya — sistemmu siap produksi. Jika tidak — penjelasanmu baru untuk <em>insinyur</em>, bukan untuk <em>manusia</em>.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Explainability"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Explainability</h2>
      <details className="worked">
        <summary>Q1: SHAP terlalu lambat untuk real-time — solusinya?</summary>
        <p><strong>Tiga jurus:</strong> (1) <em>TreeSHAP</em> untuk GBM — cukup cepat untuk banyak kasus; (2) <em>precompute + cache</em> — penjelasan untuk pola umum dihitung offline; (3) <em>penjelasan bertingkat</em> — saat transaksi: 3 reason code sederhana; pasca-transaksi: SHAP penuh untuk review. <strong>Tidak semua keputusan butuh penjelasan penuh <em>saat itu juga</em></strong> — bedakan kebutuhan investigator vs nasabah.</p>
      </details>
      <details className="worked">
        <summary>Q2: Apakah regulator Indonesia mensyaratkan model yang bisa dijelaskan?</summary>
        <p><strong>Secara prinsip: ya.</strong> OJK/BI mensyaratkan bank <em>dapat menjelaskan</em> keputusan yang berdampak ke nasabah (termasuk pemblokiran) — dan UU PDP memberi hak nasabah atas <em>penjelasan logika</em> keputusan otomatis. Implementasinya berkembang, tapi arahnya jelas: <strong>&ldquo;komputer yang memutuskan&rdquo; bukan jawaban yang diterima.</strong> Bangun kapabilitas sekarang, bukan saat ditanya.</p>
      </details>
      <details className="worked">
        <summary>Q3: Trade-off akurasi vs interpretabilitas — harus pilih salah satu?</summary>
        <p><strong>Belum tentu.</strong> Di data tabular fraud, gap AUC antara GBM dan model interpretable sering hanya <strong>1-3 poin</strong> — harga kecil untuk kepatuhan dan kepercayaan. Dan teknik modern (explainable boosting, constrained models) mempersempit gap lebih jauh. <strong>Ukur dulu gap-nya</strong> sebelum mengorbankan salah satu — kebanyakan &ldquo;trade-off&rdquo; ternyata tidak sebesar yang ditakutkan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana menjelaskan model ke direksi yang non-teknis?</summary>
        <p><strong>Bahasa uang + contoh:</strong> bukan &ldquo;SHAP value velocity 0,34&rdquo; melainkan &ldquo;model ini menangkap Rp1,6 M/bulan fraud karena ia memperhatikan <em>kecepatan transaksi yang tidak wajar</em> — seperti satpam yang curiga melihat orang lari di mal.&rdquo; <strong>Satu analogi yang tepat mengalahkan sepuluh slide metrik.</strong> Dan selalu tutup dengan: keputusan akhir tetap di tangan manusia — model hanya memberi rekomendasi.</p>
      </details>
""",
},

R2C["fr18-mlops"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Produksi adalah Hutan"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Produksi adalah Hutan</h2>
      <p>Notebook adalah <strong>kebun binatang</strong> — terkontrol, terjadwal, semua hewan jinak. Produksi adalah <strong>hutan</strong> — traffic 10x tiba-tiba, data rusak jam 3 pagi, dependency mati tanpa pamit. Model yang &ldquo;bagus&rdquo; di notebook tapi tidak punya monitoring, rollback, dan runbook = <strong>hewan kebun binatang yang dilepas ke hutan</strong> — ia tidak akan selamat seminggu.</p>
      <p>Intuisi kedua: <strong>MLOps adalah tentang <em>reversibilitas</em></strong>. Setiap deploy harus bisa dibatalkan dalam menit; setiap keputusan otomatis harus bisa diaudit; setiap eksperimen harus bisa dibandingkan. Organisasi yang tidak bisa rollback dengan cepat <em>tidak akan berani</em> berinovasi — dan yang tidak berani berinovasi akan dikalahkan oleh penjahat yang berinovasi tiap minggu. <strong>Kecepatan rollback menentukan kecepatan inovasi.</strong></p>
      <p><strong>Kapan disiplin MLOps penuh TIDAK sepadan:</strong> (1) <strong>prototipe &amp; eksplorasi</strong> — jangan bebani eksperimen dengan pipeline produksi; (2) <strong>model yang jarang berubah</strong> (rule stabil tahunan) — monitoring ringan cukup; (3) <strong>tim 1-2 orang</strong> — pilih 20% praktik dengan 80% manfaat (monitoring + rollback manual + dokumentasi), bukan platform MLOps enterprise. <strong>Sesuaikan zirah dengan medan perang.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum deploy, jawab <strong>tiga pertanyaan runbook</strong>: (1) bagaimana tahu ia rusak? (monitoring), (2) bagaimana kembali ke yang lama dalam 15 menit? (rollback), (3) siapa yang dihubungi jam 3 pagi? (on-call). Tidak bisa jawab ketiganya = belum siap deploy.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: MLOps"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: MLOps</h2>
      <details className="worked">
        <summary>Q1: Model tiba-tiba buruk di produksi — langkah pertama apa?</summary>
        <p><strong>Rollback dulu, investigasi kemudian.</strong> Urutan insiden: (1) kembalikan ke versi terakhir yang baik (&lt; 15 menit); (2) bekukan deploy; (3) baru investigasi: apakah data berubah? pipeline rusak? drift? <strong>Jangan debugging di produksi yang berdarah</strong> — hentikan pendarahannya dulu. Dan catat semuanya: insiden tanpa post-mortem = biaya sekolah yang tidak menghasilkan ijazah.</p>
      </details>
      <details className="worked">
        <summary>Q2: Shadow deployment — kapan wajib?</summary>
        <p><strong>Wajib untuk:</strong> model generasi pertama, perubahan arsitektur besar, atau model yang mengambil <em>keputusan otomatis berdampak</em> (auto-block). Shadow 2-4 minggu memberi data perbandingan <em>tanpa risiko</em>. <strong>Boleh dilewati untuk:</strong> retrain rutin dengan perubahan kecil + canary — tapi jangan pernah lewati keduanya. <em>Tidak ada yang namanya &ldquo;perubahan kecil yang pasti aman&rdquo; di produksi.</em></p>
      </details>
      <details className="worked">
        <summary>Q3: Metrik monitoring apa yang paling penting?</summary>
        <p><strong>Empat lapis:</strong> (1) <em>infra</em> — latensi, error rate, throughput; (2) <em>data</em> — PSI fitur, missing rate, schema check; (3) <em>model</em> — distribusi skor, precision vs label proksi; (4) <em>bisnis</em> — fraud loss, komplain blokir, biaya review. <strong>Lapis 4 adalah yang pertama dilihat direksi dan terakhir dipasang tim</strong> — pasang dari hari pertama.</p>
      </details>
      <details className="worked">
        <summary>Q4: Siapa yang on-call untuk model fraud?</summary>
        <p><strong>Tim yang bisa memperbaiki, bukan tim yang bisa menelepon.</strong> On-call ideal: rotasi di antara anggota tim model + satu engineer platform — dengan <em>runbook</em> yang jelas (kapan rollback, kapan eskalasi, kapan bangunkan siapa). On-call tanpa runbook = <strong>lembur terstruktur</strong>. Dan: setiap insiden on-call harus menghasilkan <em>perbaikan permanen</em> — jika insiden yang sama terjadi 3x, itu bukan kesialan, itu utang yang belum dibayar.</p>
      </details>
""",
},

R2C["fr19-nlp-phishing"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Bahasa adalah Senjata dan Tameng"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Bahasa adalah Senjata dan Tameng</h2>
      <p>Phisher adalah <strong>penulis persuasif profesional</strong> — ia mempelajari urgensi, otoritas, dan rasa takut lebih dalam dari kebanyakan copywriter. Melawannya dengan sekadar &ldquo;filter kata&rdquo; = melawan penulis dengan kamus. <strong>Pertahanan yang benar membaca <em>strategi</em>, bukan <em>kata</em>:</strong> siapa pengirim sebenarnya? apa yang diminta? apa konsekuensinya jika benar? Tiga pertanyaan ini tidak bisa diakali dengan sinonim.</p>
      <p>Intuisi kedua: <strong>ironisnya, marketing yang sah meniru bahasa penjahat</strong> — &ldquo;SEGERA klaim HADIAH, klik SEKARANG!&rdquo; ditulis bank sungguhan setiap hari. Artinya deteksi berbasis teks <em>saja</em> pasti menghukum yang sah. Solusinya: <strong>teks = radar, identitas pengirim = vonis</strong>. Pisahkan &ldquo;pesan ini bernada phishing&rdquo; (skor) dari &ldquo;pengirim ini bukan yang ia klaim&rdquo; (fakta). Fakta mengalahkan nada.</p>
      <p><strong>Kapan deteksi linguistik TIDAK cukup:</strong> (1) <strong>spear-phishing personal</strong> — teksnya rapi, personal, tanpa kata urgency; yang mendeteksi = <em>metadata</em> (pengirim, link, pola); (2) <strong>phishing via gambar/suara</strong> (QR code, voice cloning) — butuh OCR/analisis media; (3) <strong>pasca-klik</strong> — korban sudah memberikan OTP; yang tersisa = <em>behavioral</em> (FR3). <strong>Pertahanan berlapis bukan slogan — ia arsitektur.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> edukasi pengguna dengan <strong>pola, bukan contoh</strong>: &ldquo;instansi resmi tidak menagih via WA plus link&rdquo; (aturan abadi) mengalahkan &ldquo;waspada SMS paket&rdquo; (basi bulan depan). <strong>Aturan yang diajarkan harus lebih tahan lama dari varian serangan.</strong></p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: NLP &amp; Phishing"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: NLP &amp; Phishing</h2>
      <details className="worked">
        <summary>Q1: Bisakah LLM dipakai untuk deteksi phishing?</summary>
        <p><strong>Bisa, dengan hati-hati.</strong> LLM hebat membaca <em>nuansa</em> (tekanan psikologis implisit, inkonsistensi identitas) yang luput dari keyword. Tapi: (1) <strong>biaya &amp; latensi</strong> — tidak untuk semua pesan real-time; pakai untuk <em>triage kedua</em>; (2) <strong>prompt injection</strong> — phisher bisa menulis teks yang &ldquo;menipu&rdquo; LLM pemeriksa; (3) <strong>konsistensi</strong> — output LLM tidak deterministik; butuh kalibrasi. Praktik: <strong>LLM sebagai analis kedua, bukan gerbang utama.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana dengan phishing bahasa daerah / bahasa gaul?</summary>
        <p><strong>Ini keunggulan lokal penjahat — dan harus jadi keunggulan pertahananmu.</strong> Model multilingual generik sering lemah di bahasa daerah; <em>fine-tune</em> dengan korpus lokal atau minimal pastikan keyword list mencakup varian lokal (&ldquo;cepetan&rdquo;, &ldquo;hadiah&rdquo; versi daerah). <strong>Tim lokal yang memahami bahasa = aset deteksi</strong> yang tidak bisa dibeli dari vendor global.</p>
      </details>
      <details className="worked">
        <summary>Q3: Phishing via gambar (screenshot teks, QR code) — bagaimana?</summary>
        <p><strong>OCR + analisis gambar sebagai lapis tambahan:</strong> ekstrak teks dari gambar lalu perlakukan seperti teks biasa; untuk QR code, <em>resolve &amp; periksa URL tujuan</em> (bukan gambarnya). Penjahat memakai gambar justru untuk <em>menghindari</em> filter teks — maka <strong>setiap kanal baru yang tidak difilter = pintu belakang</strong>. Tutup semua pintu, bukan cuma pintu depan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Edukasi pengguna — masih relevan?</summary>
        <p><strong>Ya, tapi ubah caranya.</strong> Edukasi &ldquo;jangan klik link mencurigakan&rdquo; gagal 20 tahun — karena <em>manusia bukan firewall</em>. Yang bekerja: (1) <strong>edukasi pola abadi</strong> (bukan contoh); (2) <strong>desain yang memaafkan kesalahan</strong> — limit transfer, jeda verifikasi, konfirmasi berlapis; (3) <strong>simulasi phishing internal</strong> untuk staf (bukan untuk mempermalukan, tapi melatih). <strong>Asumsikan pengguna AKAN klik — rancang agar kliknya tidak fatal.</strong></p>
      </details>
""",
},

R2C["fr20-capstone"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Selesai Mengalahkan Sempurna"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Selesai Mengalahkan Sempurna</h2>
      <p>Capstone yang tidak selesai = <strong>nol nilai</strong>, seberapa pun canggih rancangannya. Proyek 90 hari yang mengirim sistem sederhana tapi bekerja mengalahkan proyek 18 bulan yang mati di bulan ke-8 — <em>selalu</em>. <strong>Momentum adalah mata uang organisasi:</strong> setiap pengiriman yang bekerja membeli kepercayaan untuk fase berikutnya; setiap janji yang molor menjualnya.</p>
      <p>Intuisi kedua: <strong>capstone dinilai dari <em>keputusan</em>, bukan dari <em>model</em></strong>. Penilai (direksi, atasan, klien) tidak bertanya &ldquo;AUC-nya berapa?&rdquo; — mereka bertanya &ldquo;kenapa ini prioritas? berapa biayanya? apa risikonya? bagaimana jika gagal?&rdquo; Analis hebat menjawab keduanya; analis luar biasa <strong>menerjemahkan</strong> yang pertama menjadi yang kedua tanpa diminta.</p>
      <p><strong>Kapan ambisi capstone harus DIPOTONG:</strong> (1) <strong>tidak ada hasil parsial dalam 30 hari</strong> — potong scope sampai ada; (2) <strong>dependensi ke &gt; 2 tim</strong> — setiap dependensi = risiko molor eksponensial; (3) <strong>&ldquo;fase 1&rdquo; butuh semuanya selesai</strong> — itu bukan fase, itu big bang berkedok. <strong>Potong sampai yang tersisa bisa dikirim dalam 90 hari oleh tim yang ada.</strong> Sisanya = fase 2.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tulis <strong>definisi selesai</strong> sebelum mulai: &ldquo;dalam 90 hari: 10 rule aktif + dashboard + 1 model shadow, fraud rate turun 30%.&rdquo; <strong>Definisi selesai yang tertulis = perisai dari scope creep</strong> — milikmu dan milik stakeholder.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Capstone"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Capstone</h2>
      <details className="worked">
        <summary>Q1: Bagaimana memilih scope capstone yang tepat?</summary>
        <p><strong>Tiga filter:</strong> (1) <em>dampak</em> — selesaikan masalah yang <em>terasa</em> (RpX/bulan atau jam kerja); (2) <em>kelayakan</em> — bisa selesai 90 hari dengan resource ada; (3) <em>visibilitas</em> — hasilnya bisa <em>ditunjukkan</em> (dashboard, angka, demo). <strong>Scope ideal = irisan ketiganya.</strong> Proyek berdampak tapi tak layak = frustrasi; layak tapi tak terlihat = tidak dihargai.</p>
      </details>
      <details className="worked">
        <summary>Q2: Metrik sukses capstone — apa yang meyakinkan?</summary>
        <p><strong>Tiga lapis metrik:</strong> (1) <em>teknis</em> — precision/recall (untuk tim); (2) <em>operasional</em> — flag/hari, jam investigator hemat (untuk manajer); (3) <em>bisnis</em> — rupiah diselamatkan, ROI (untuk direksi). <strong>Presentasikan ketiganya berurutan</strong> — teknis membangun kredibilitas, bisnis menutup keputusan. Capstone yang hanya punya lapis 1 = belum selesai.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana presentasi ke direksi yang skeptis?</summary>
        <p><strong>Struktur 5 menit:</strong> (1) masalah dalam rupiah (30 detik); (2) apa yang dibangun (60 detik, tanpa jargon); (3) hasil dalam rupiah + orang (60 detik); (4) apa risikonya &amp; mitigasinya (60 detik — <em>jujur soal kelemahan = kredibilitas</em>); (5) minta keputusan spesifik (30 detik). <strong>Jangan presentasi model — presentasikan keputusan.</strong> Direksi tidak membeli algoritma; mereka membeli <em>keyakinan</em>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Setelah capstone selesai — apa selanjutnya?</summary>
        <p><strong>Tiga hal:</strong> (1) <em>serah terima operasional</em> — runbook, pemilik, monitoring (FR18); sistem tanpa pemilik = mati dalam 6 bulan; (2) <em>dokumentasi keputusan</em> — kenapa threshold ini, kenapa fitur itu (untuk penggantimu); (3) <em>roadmap fase 2</em> — apa yang sengaja dipotong + kapan dilanjutkan. <strong>Capstone yang hebat berakhir dengan awal yang jelas</strong> — bukan dengan keheningan.</p>
      </details>
""",
},

R2C["fr21-sql-fraud"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: SQL adalah Mikroskop"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: SQL adalah Mikroskop</h2>
      <p>Saat insiden fraud pecah, <strong>pertanyaan pertama bukan &ldquo;model apa yang dipakai?&rdquo; tapi &ldquo;berapa besar? ke mana? siapa lagi?&rdquo;</strong> — dan ketiga pertanyaan itu dijawab SQL dalam hitungan menit. SQL adalah <strong>mikroskop analis</strong>: ia tidak sepintar model, tapi ia <em>jujur</em> (menampilkan data apa adanya), <em>cepat</em> (menit, bukan minggu), dan <em>bisa diaudit</em> (query-nya dibaca siapa pun).</p>
      <p>Intuisi kedua: <strong>query yang baik = berpikir dalam <em>himpunan</em>, bukan baris</strong>. Pemula menulis query yang &ldquo;melihat&rdquo; transaksi satu per satu; profesional menulis agregasi yang &ldquo;melihat&rdquo; pola populasi. Perbedaannya: &ldquo;tampilkan transaksi mencurigakan&rdquo; (10.000 baris, tidak ada yang membaca) vs &ldquo;kelompokkan per device, urutkan by KTP unik&rdquo; (41 baris = 41 keputusan). <strong>Agregasi adalah kompresi keputusan.</strong></p>
      <p><strong>Kapan SQL TIDAK cukup:</strong> (1) <strong>pola sekuensial kompleks</strong> — &ldquo;urutan 5 event dalam 2 menit dengan jeda spesifik&rdquo; menyiksa di SQL; (2) <strong>multi-hop graph dalam</strong> — recursive CTE bisa, tapi lambat &amp; sulit dibaca; (3) <strong>teks/gambar</strong> — bukan ranah relasional; (4) <strong>prediksi probabilistik</strong> — itu tugas model. <strong>Kenali batas mikroskopmu — lalu pinjam teleskop (Python/ML) untuk yang di luar jangkauannya.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> simpan setiap query investigasi penting sebagai <strong>view/query tersimpan dengan nama jelas</strong> — &ldquo;v_mule_fanout_7d&rdquo;, &ldquo;v_device_sharing&rdquo;. Investigasi berikutnya dimulai dari sana, bukan dari kanvas kosong. <strong>Koleksi query = memori institusional tim.</strong></p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: SQL untuk Fraud"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: SQL untuk Fraud</h2>
      <details className="worked">
        <summary>Q1: Query lambat di 100 juta baris — optimasi pertama apa?</summary>
        <p><strong>Tiga jurus 80/20:</strong> (1) <em>filter waktu dulu</em> — WHERE trx_time sebelum JOIN/GROUP (partisi!); (2) <em>agregasi sebelum join</em> — kecilkan dulu, baru gabungkan; (3) <em>indeks di kolom filter</em> (waktu, entitas). Jika masih lambat: <em>materialized view</em> untuk pola yang dihitung berulang. <strong>Jangan SELECT * — jangan pernah.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Window function vs GROUP BY — kapan mana?</summary>
        <p><strong>GROUP BY</strong> = &ldquo;ringkas per entitas&rdquo; (1 baris per kartu). <strong>Window function</strong> = &ldquo;hitung sesuatu <em>tanpa</em> menghilangkan baris&rdquo; (tambahkan kolom &ldquo;transaksi ke-N kartu ini&rdquo;). Untuk deteksi pola: window function untuk <em>urutan &amp; perbandingan antar baris</em> (LAG = transaksi sebelumnya), GROUP BY untuk <em>agregat</em> (velocity). <strong>Kuasai keduanya — mereka pasangan, bukan pesaing.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Kapan pindah dari SQL ke Python?</summary>
        <p><strong>Empat sinyal:</strong> (1) butuh <em>model statistik/ML</em>; (2) logika <em>iteratif/rekursif dalam</em> yang menyiksa di SQL; (3) <em>data non-relasional</em> (teks, JSON nested dalam); (4) <em>visualisasi eksplorasi</em> cepat. Tapi: <strong>ekstrak dengan SQL, analisis dengan Python</strong> — jangan tarik 100 juta baris ke pandas. <em>Database untuk menyaring, Python untuk berpikir.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana memastikan query investigasi bisa dipercaya di pengadilan/audit?</summary>
        <p><strong>Empat syarat:</strong> (1) <em>versioned</em> — query tersimpan dengan tanggal &amp; penulis; (2) <em>reproducible</em> — dijalankan ulang memberi hasil sama (hati-hati NOW() — catat timestamp eksekusi!); (3) <em>terdokumentasi</em> — apa yang dihitung &amp; kenapa; (4) <em>chain of custody data</em> — dari tabel mana, kapan diambil. <strong>Query forensik = barang bukti</strong> — perlakukan dengan standar itu.</p>
      </details>
""",
},

R2C["fr22-chargeback"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Chargeback adalah Cermin"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Chargeback adalah Cermin</h2>
      <p>Setiap chargeback adalah <strong>surat dari masa depan yang gagal dicegah</strong> — ia menceritakan <em>di mana</em> pertahananmu bocor, 30-90 hari setelah kebocoran terjadi. Merchant yang hanya &ldquo;mengurus&rdquo; chargeback = membaca surat lalu membuangnya. Merchant yang <strong>membaca polanya</strong> = memperbaiki atap sebelum hujan berikutnya. <strong>Reason code adalah diagnosis; pola reason code adalah prognosis.</strong></p>
      <p>Intuisi kedua: <strong>chargeback punya dua wajah</strong> — <em>biaya</em> (uang hilang + fee) dan <em>informasi</em> (pola serangan + kelemahan produk). Kebanyakan merchant hanya melihat wajah pertama. Padahal wajah kedua sering <em>lebih berharga</em>: lonjakan &ldquo;tidak mengenal transaksi&rdquo; = serangan carding aktif; lonjakan &ldquo;barang tidak diterima&rdquo; = masalah logistik <em>atau</em> friendly fraud terorganisir. <strong>Bayar untuk informasinya dengan membaca; jangan bayar dua kali dengan mengabaikan.</strong></p>
      <p><strong>Kapan strategi chargeback standar TIDAK berlaku:</strong> (1) <strong>digital goods instan</strong> — tidak ada &ldquo;pengiriman&rdquo; yang bisa dibuktikan; pertahanannya = 3DS + device, bukan representment; (2) <strong>langganan</strong> — mayoritas chargeback = kegagalan UX pembatalan, bukan fraud; perbaiki produk, bukan tim dispute; (3) <strong>nilai mikro</strong> — biaya melawan &gt; nilai; terima + cegah massal via pola. <strong>Kenali <em>jenis</em> bisnismu sebelum menyalin playbook orang.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> buat <strong>dashboard reason code mingguan</strong> — tren per kategori, win rate per kategori, biaya per kategori. <strong>Dashboard ini adalah rapat strategi fraud-mu yang paling jujur</strong> — ia tidak bisa dibohongi dengan narasi.</p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Chargeback"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Chargeback</h2>
      <details className="worked">
        <summary>Q1: Win rate representment yang &ldquo;bagus&rdquo; itu berapa?</summary>
        <p><strong>Benchmark kasar:</strong> 30-45% untuk portofolio campuran; 50-65% untuk &ldquo;tidak mengenal transaksi&rdquo; dengan bukti teknis lengkap (3DS, device match); &lt; 20% untuk &ldquo;barang tidak diterima&rdquo; tanpa resi. Tapi yang lebih penting dari angka absolut: <strong>trennya</strong> — win rate turun 3 bulan beruntun = kualitas bukti atau pola serangan berubah. <em>Ukur per reason code, bukan rata-rata.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: Apakah 3-D Secure menghilangkan chargeback fraud?</summary>
        <p><strong>Mengurangi drastis, tidak menghilangkan.</strong> 3DS menggeser <em>liability</em> ke penerbit (issuer) untuk transaksi terautentikasi — merchant terlindungi dari &ldquo;tidak mengenal transaksi&rdquo;. Tapi: (1) <strong>friction</strong> — konversi bisa turun 5-15% jika UX buruk; (2) tidak melindungi dari <em>friendly fraud</em> (&ldquo;barang tidak diterima&rdquo;); (3) penjahat beralih ke <em>merchant tanpa 3DS</em>. <strong>3DS = helm yang bagus — tetap butuh pengendara yang waspada.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Friendly fraud — bagaimana membuktikannya?</summary>
        <p><strong>Tiga lapis bukti:</strong> (1) <em>teknis</em> — device/IP sama dengan histori, login &amp; pemakaian tercatat; (2) <em>perilaku</em> — e-tiket dibuka berkali-kali, barang diterima (resi + foto); (3) <em>riwayat</em> — pola dispute berulang pelanggan ini. <strong>Kumpulkan ketiganya <em>sebelum</em> dibutuhkan</strong> — logging yang baik = amunisi representment. Dan: tandai pelakunya — <em>pencegahan berikutnya lebih murah dari pembuktian ini</em>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Biaya total chargeback — apa saja yang dihitung?</summary>
        <p><strong>Lima komponen:</strong> (1) nilai transaksi hilang; (2) fee chargeback (Rp200-500rb per kasus); (3) biaya representment (admin + dokumen); (4) biaya operasional (tim dispute); (5) <strong>risiko program monitoring</strong> (denda + pembatasan). Kebanyakan merchant hanya menghitung (1) — padahal (2)-(5) bisa <strong>menggandakan</strong> total. <em>Hitung semuanya — baru keputusannya jujur.</em></p>
      </details>
""",
},

R2C["fr23-regulasi-indonesia"] = {
"toc_intuisi": ("intuisi", "🧭 Intuisi Lapangan: Kepatuhan adalah Aset"),
"intuisi": """
      <h2 id="intuisi">🧭 Intuisi Lapangan: Kepatuhan adalah Aset</h2>
      <p>Di pasar keuangan, <strong>kepercayaan adalah mata uang yang paling keras</strong> — dan kepatuhan adalah cara mencetaknya. Bank dengan program AML/KYC yang kuat mendapatkan: nasabah korporat besar (yang melakukan due diligence ke banknya!), koresponden bank asing (yang memutus hubungan dengan bank berisiko), dan <em>valuasi lebih tinggi</em>. <strong>Kepatuhan bukan pajak — ia premi asuransi yang membayar dividen kepercayaan.</strong></p>
      <p>Intuisi kedua: <strong>regulator adalah <em>partner</em> yang menyamar sebagai pengawas</strong>. PPATK tidak ingin bankmu didenda — ia ingin <em>intelijen berkualitas</em>. OJK tidak ingin usahamu mati — ia ingin <em>sistem keuangan stabil</em>. Bank yang proaktif berkonsultasi, melaporkan tepat waktu, dan jujur soal kelemahannya <strong>diperlakukan berbeda</strong> dari yang defensif dan menutupi. <em>Hubungan regulator = hubungan jangka panjang; investasikan.</em></p>
      <p><strong>Kapan &ldquo;kepatuhan&rdquo; menjadi checkbox yang berbahaya:</strong> (1) <strong>training formalitas</strong> — tanda tangan hadir tanpa pemahaman (FR23 kasus: front-liner tidak tahu tipping-off); (2) <strong>SOP yang tidak pernah diuji</strong> — prosedur STR yang belum pernah dijalankan dalam simulasi; (3) <strong>metrik vanity</strong> — &ldquo;100% staf sudah training&rdquo; tanpa mengukur pemahaman. <strong>Kepatuhan yang tidak diuji = teater.</strong> Uji dengan simulasi, audit mendadak, dan pertanyaan langsung.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bangun <strong>dashboard kepatuhan</strong> dengan metrik yang sama seriusnya dengan metrik fraud: STR on-time rate, KYC freshness, tuning log, hasil simulasi tipping-off. <strong>Yang tidak diukur = tidak dikelola = akan ditemukan pemeriksa.</strong></p>
      </div>
""",
"toc_faq": ("faq", "❓ Tanya Jawab: Regulasi Indonesia"),
"faq": """
      <h2 id="faq">❓ Tanya Jawab: Regulasi Indonesia</h2>
      <details className="worked">
        <summary>Q1: PPATK vs OJK vs BI — siapa mengawasi apa?</summary>
        <p><strong>PPATK:</strong> intelijen keuangan — menerima STR/CTR, menganalisis, meneruskan ke penegak hukum. Bukan penyidik, bukan pemberi sanksi langsung. <strong>OJK:</strong> pengawas industri jasa keuangan — kepatuhan, sanksi administratif, perlindungan konsumen. <strong>BI:</strong> sistem pembayaran &amp; moneter. <strong>Satu kasus bisa menyentuh ketiganya</strong> — kenali jalurnya (FR23 peta lanjutan skenario A). <em>Salah alamat = kewajiban dianggap tidak terpenuhi.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: STR terlambat 1 hari — seberapa serius?</summary>
        <p><strong>Satu kali, dengan alasan jelas &amp; terdokumentasi:</strong> biasanya menjadi catatan pembinaan. <strong>Berpola/sistematis:</strong> temuan pemeriksaan → sanksi administratif → denda. Yang dinilai bukan keterlambatan tunggal — tapi <strong>apakah sistemmu <em>dirancang</em> untuk tepat waktu</strong>. Punya SOP + kalender + pemilik + buffer = bukti itikad; tidak punya = bukti kelalaian. <em>Bangun sistemnya, bukan alasannya.</em></p>
      </details>
      <details className="worked">
        <summary>Q3: Karyawan melanggar tipping-off — siapa yang bertanggung jawab?</summary>
        <p><strong>Keduanya:</strong> karyawan secara <em>pidana individual</em>, perusahaan secara <em>administratif</em> (gagal melatih &amp; mengawasi). Pembelaan perusahaan yang diterima: <strong>bukti training berkala + simulasi + skrip yang disetujui legal + penindakan internal</strong>. Tanpa itu, &ldquo;kami sudah melarang&rdquo; tidak cukup. <em>Tanggung jawab perusahaan = tanggung jawab atas sistemnya.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: UMKM/fintech kecil — kewajiban AML-nya sama dengan bank besar?</summary>
        <p><strong>Prinsipnya sama, proporsional pelaksanaannya</strong> — pendekatan <em>risk-based</em>: kewajiban menyesuaikan <em>risiko &amp; skala</em>. Fintech kecil tidak butuh divisi AML 20 orang — tapi <strong>wajib</strong> punya: penanggung jawab, KYC dasar, monitoring yang sesuai skala, dan pelaporan. <em>Proporsional bukan opsional.</em> Dan: tumbuh tanpa membangun kepatuhan = menumpuk utang regulasi yang ditagih sekaligus saat pemeriksaan pertama.</p>
      </details>
""",
},
