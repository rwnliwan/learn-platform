# Round 4: 2 FAQ tambahan untuk 6 lesson yang masih < 4000 kata
R4 = {}

R4["fr13-realtime"] = ["""
      <details className="worked">
        <summary>Q5: Bagaimana menguji sistem realtime sebelum event besar (Harbolnas)?</summary>
        <p><strong>Tiga uji wajib:</strong> (1) <em>load test 10x</em> — replay traffic historis dengan pengali; ukur p95/p99, bukan rata-rata; (2) <em>chaos test</em> — matikan Redis/feature store, pastikan graceful degradation (bukan mati total); (3) <em>game day</em> — simulasi insiden dengan tim lengkap + ukur waktu rollback. <strong>Lulus ketiganya = boleh tidur tenang saat Harbolnas.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Kapan memakai edge computing untuk deteksi fraud?</summary>
        <p>Saat <strong>latensi ke server tidak bisa ditolerir</strong> (pembayaran offline/daerah 3T) atau <strong>aturan sederhana yang stabil</strong> (blacklist device, velocity kasar). Edge = cepat tapi <em>bodoh</em> (model kecil, update jarang); server = pintar tapi butuh koneksi. <strong>Arsitektur hibrida</strong>: edge untuk saringan kasar, server untuk keputusan cerdas saat online.</p>
      </details>
"""]

R4["fr16-anomali-time-series"] = ["""
      <details className="worked">
        <summary>Q5: Z-score vs IQR — kapan memakai yang mana untuk ambang?</summary>
        <p><strong>Z-score</strong> saat data mendekati normal &amp; tanpa outlier ekstrem (ia memakai mean/std yang sensitif outlier). <strong>IQR</strong> (1,5 x IQR) saat data skew / banyak outlier — karena median &amp; kuartil <em>robust</em>. Untuk data finansial (skew kanan ekstrem): <strong>IQR atau persentil</strong> hampir selalu lebih aman. <em>Aturan: jika mean dan median jauh berbeda, jangan pakai z-score.</em></p>
      </details>
      <details className="worked">
        <summary>Q6: Data sparse (banyak nol, misal transaksi merchant kecil) — bagaimana?</summary>
        <p><strong>Jangan deteksi anomali di data mentah yang sparse</strong> — nol bukan anomali, ia normal. Agregasikan dulu ke resolusi yang lebih kasar (harian → mingguan) sampai deretnya &ldquo;terisi&rdquo;, atau pakai model <em>zero-inflated</em>. Alternatif: deteksi di <strong>level agregat</strong> (kelompok merchant sejenis) bukan per merchant. <em>Anomali butuh baseline; baseline butuh data.</em></p>
      </details>
"""]

R4["fr17-explainability"] = ["""
      <details className="worked">
        <summary>Q5: Bagaimana mengukur <em>kualitas</em> penjelasan (bukan kualitas model)?</summary>
        <p><strong>Tiga metrik:</strong> (1) <em>fidelity</em> — seberapa setia penjelasan pada model (surrogate accuracy); (2) <em>stabilitas</em> — input mirip → penjelasan mirip (jika tidak, penjelasanmu noise); (3) <em>kegunaan manusia</em> — uji dengan investigator sungguhan: apakah keputusan mereka <em>membaik</em> dengan penjelasan ini? <strong>Penjelasan yang tidak mengubah keputusan manusia = dekorasi.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Apa itu counterfactual explanation — dan contohnya?</summary>
        <p><strong>&ldquo;Apa yang perlu berubah agar keputusan berbeda?&rdquo;</strong> Contoh: &ldquo;Transaksi ini ditahan karena velocity 200x normal. <em>Jika</em> hanya ada 2 transaksi/jam (bukan 40), ia akan disetujui.&rdquo; Ini penjelasan <em>paling actionable</em> bagi nasabah — ia memberi tahu <strong>jalan keluar</strong>, bukan sekadar alasan. Cocok untuk: banding &amp; edukasi. Batasnya: jangan sampai membocorkan ambang presisi ke penjahat.</p>
      </details>
"""]

R4["fr21-sql-fraud"] = ["""
      <details className="worked">
        <summary>Q5: Recursive CTE — kapan berguna di investigasi fraud?</summary>
        <p>Untuk <strong>rantai dengan panjang tak diketahui</strong>: &ldquo;telusuri aliran dana dari rekening X sampai mentok (atau 10 hop)&rdquo;. Recursive CTE mengikuti rantai selangkah demi selangkah — yang tidak bisa dilakukan JOIN biasa (butuh N join untuk N hop). <strong>Batas kedalaman wajib</strong> (misal 10) agar tidak infinite loop di graph bersiklus. Untuk analisis rutin → graph DB; untuk <strong>forensik ad-hoc</strong> → recursive CTE cukup.</p>
      </details>
      <details className="worked">
        <summary>Q6: Bagaimana me-versioning query investigasi?</summary>
        <p><strong>Perlakukan query seperti kode:</strong> simpan di Git (atau minimal folder berversion), beri nama deskriptif + tanggal + penulis di header comment, catat <em>parameter</em> (rentang waktu!) setiap eksekusi. Query forensik tanpa version = <strong>barang bukti tanpa label</strong> — tidak bisa direproduksi, tidak bisa dipertahankan. <em>Reproducibility = kredibilitas.</em></p>
      </details>
"""]

R4["fr22-chargeback"] = ["""
      <details className="worked">
        <summary>Q5: Apa bedanya representment, pre-arbitration, dan arbitration?</summary>
        <p><strong>Tiga tingkat sengketa:</strong> (1) <em>representment</em> — merchant melawan chargeback dengan bukti (biaya rendah); (2) <em>pre-arbitration</em> — issuer menolak representment, merchant melawan lagi (biaya naik); (3) <em>arbitration</em> — skema kartu memutuskan (biaya tinggi + yang kalah bayar fee). <strong>Aturan ekonomi:</strong> naik tingkat hanya jika (nilai x peluang menang) &gt; biaya kumulatif. <em>Kebanyakan kasus berhenti di tingkat 1 — dan itu benar.</em></p>
      </details>
      <details className="worked">
        <summary>Q6: Bagaimana 3-D Secure menurunkan chargeback — dan apa harganya?</summary>
        <p><strong>Manfaat:</strong> transaksi terautentikasi → <em>liability shift</em> ke issuer untuk &ldquo;tidak mengenal transaksi&rdquo; → chargeback fraud turun 70-90%. <strong>Harga:</strong> friction — setiap langkah autentikasi tambahan menurunkan konversi 3-10% (terutama versi lama). <strong>Strategi modern:</strong> <em>risk-based 3DS</em> — hanya tantang transaksi berisiko (frictionless untuk yang aman). <em>Keamanan tanpa membunuh konversi.</em></p>
      </details>
"""]

R4["fr23-regulasi-indonesia"] = ["""
      <details className="worked">
        <summary>Q5: Bagaimana menyiapkan diri menghadapi pemeriksaan OJK/PPATK?</summary>
        <p><strong>Empat persiapan:</strong> (1) <em>data room</em> — SOP, tuning log, laporan STR/CTR, hasil audit internal, <em>terorganisir &amp; mutakhir</em>; (2) <em>mock audit</em> — simulasi pemeriksaan tiap tahun oleh pihak independen; (3) <em>narasumber siap</em> — siapa menjelaskan apa (jangan tunjuk orang dadakan); (4) <em>temuan lama sudah ditutup</em> — temuan berulang = sinyal sistemik = sanksi berat. <strong>Pemeriksaan yang lancar = hasil kerja 364 hari sebelumnya.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Whistleblowing — perlindungan dan perannya di AML?</summary>
        <p><strong>Whistleblower internal</strong> sering menjadi sumber temuan terbesar (insider fraud, pelanggaran prosedur). Kewajiban perusahaan: <strong>saluran aman + perlindungan dari retaliasi + tindak lanjut serius</strong> — diatur dalam ketentuan tata kelola. Praktik terbaik: saluran dikelola <em>independen</em> (bukan atasan langsung terlapor), SLA tindak lanjut tertulis. <strong>Budaya &ldquo;aman melapor&rdquo; = sistem deteksi termurah</strong> yang tidak bisa dibeli dari vendor.</p>
      </details>
"""]
