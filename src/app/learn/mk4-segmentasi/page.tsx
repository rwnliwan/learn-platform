"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk4SegmentasiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK4 — Marketing Data Analytics</span>
        <h1 className="display-title">Segmentasi:<br/>K-means, GMM, dan Persona yang Hidup</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Empat Cluster yang Tidak Dipakai Siapa Pun</a></li>
<li><a href="#kmeans">K-means — Si Pembagi Wilayah</a></li>
<li><a href="#gmm">GMM — Si Diplomat Lunak</a></li>
<li><a href="#persona">Dari Cluster ke Persona</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Geometri di Balik Cluster</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan: 7 Cluster yang Tidak Dipakai</a></li>
<li><a href="#case">Mini-Case: 7 Cluster BankNusa</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Dari Cluster ke Kampanye yang Jalan</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Segmentasi</a></li>
<li><a href="#extra3">📋 Playbook: One-Pager Persona</a></li>
<li><a href="#extra4">🧰 Kit Stabilitas: Apakah Cluster-mu Nyata?</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Tiga Segmentasi</a></li>
<li><a href="#tambahan-elbow">📐 Worked Example: Memilih K</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Bank Digital ArusDana</a></li>
<li><a href="#tambahan-faq">❓ FAQ Segmentasi</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan cara kerja K-means dan memilih k dengan elbow + logika bisnis.</li>
<li>Menjelaskan kapan GMM lebih tepat dari K-means (soft assignment, bentuk cluster).</li>
<li>Melakukan standardisasi yang benar sebelum clustering dan menjelaskan kenapa wajib.</li>
<li>Mengubah output cluster menjadi persona: profil, ukuran, nama, dan aksi marketing.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Empat Cluster yang Tidak Dipakai Siapa Pun</h2>
      <div className="story">
        <p>Tim data <em>&ldquo;BankNusa&rdquo;</em> bangga menyerahkan hasil clustering: <strong>7 cluster nasabah</strong> dengan silhouette score 0,62 — bagus secara teknis. Tim marketing menatap slide itu, lalu bertanya: <em>&ldquo;Jadi cluster 4 dikirimi apa? Bedanya dengan cluster 6 apa?&rdquo;</em> Hening. Tidak ada yang bisa menjawab — karena cluster dibentuk dari 40 fitur tanpa profiling, tanpa nama, tanpa aksi.</p>
<p>Twist-nya: <strong>cluster yang benar secara matematis bisa tidak berguna secara bisnis</strong>. Enam bulan kemudian, analis baru mengulang dengan 8 fitur RFM + demografis, k=4, tiap cluster diberi nama (&ldquo;Sultan Sepi&rdquo;, &ldquo;Anak Gajian&rdquo;…) + satu aksi spesifik. Kampanye pertama dari persona itu menaikkan response rate 3x. Lesson ini: clustering bukan soal algoritma tercanggih — soal <strong>cluster yang bisa dieksekusi</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="kmeans">K-means — Si Pembagi Wilayah yang Tegas</h2>
<p><strong>Definisi.</strong> <strong>K-means</strong> membagi data menjadi k kelompok dengan meminimalkan <strong>WCSS</strong> (<em>within-cluster sum of squares</em>): jumlah kuadrat jarak tiap titik ke pusat cluster-nya. Algoritma Lloyd: (1) pilih k pusat awal, (2) tugaskan tiap titik ke pusat terdekat, (3) geser pusat ke rata-rata anggotanya, (4) ulangi sampai stabil.</p>
<p>Tiga hal yang menentukan hasil: <strong>standardisasi</strong> (fitur dengan skala besar — mis. total belanja jutaan vs frekuensi satuan — akan mendominasi jarak; selalu z-score dulu), <strong>inisisasi</strong> (k-means++ memilih pusat awal yang menyebar — jangan random buta), dan <strong>pemilihan k</strong> (elbow: plot WCSS vs k, pilih &ldquo;siku&rdquo; di mana penurunan melandai — plus akal bisnis).</p>
<Tex math={String.raw`J = \sum_{k=1}^{K}\sum_{x_i \in C_k} \lVert x_i - \mu_k \rVert^2`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`J`} />: WCSS — total &lsquo;ketidakrapatan&rsquo; yang diminimalkan</li>
<li><Tex math={String.raw`C_k`} />: anggota cluster ke-k</li>
<li><Tex math={String.raw`\mu_k`} />: pusat (centroid) cluster ke-k</li>
<li><Tex math={String.raw`\lVert x_i - \mu_k \rVert^2`} />: kuadrat jarak Euclidean titik ke pusatnya — K-means hanya paham jarak lurus</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> K-means seperti <strong>membagi kota jadi k kecamatan</strong> supaya tiap warga dekat ke kantor kecamatannya. Tegas (satu warga = satu kecamatan), cepat, tapi buta bentuk: ia selalu menggambar kecamatan <strong>melingkar</strong> — kalau permukimanmu memanjang mengikuti sungai, hasilnya aneh.</p>
<p><strong>Kapan dipakai:</strong> Cluster berbentuk bola, butuh hasil cepat &amp; mudah dijelaskan, fitur numerik sudah distandardisasi. Standar awal segmentasi pelanggan (mulai dari RFM).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: 1 iterasi K-means (klik untuk buka)</summary>
<p>Data (belanja/bln jt, transaksi/bln): A(1,2), B(1,3), C(9,20), D(10,22). k=2. Pusat awal: &mu;1=A(1,2), &mu;2=C(9,20).</p>
<p><strong>Langkah 1 — tugaskan:</strong> jarak B ke &mu;1 = &radic;((1-1)&sup2;+(3-2)&sup2;) = 1; ke &mu;2 = &radic;(64+289) ≈ 18,8 → B ikut cluster 1. D ke &mu;1 ≈ 21,9; ke &mu;2 ≈ 2,2 → cluster 2.</p>
<p><strong>Langkah 2 — geser pusat:</strong> &mu;1 = rata-rata(A,B) = (1, 2,5); &mu;2 = rata-rata(C,D) = (9,5, 21).</p>
<p><strong>Langkah 3 — ulangi</strong> sampai tidak ada titik pindah. Hasil: klaster 1 = A,B vs klaster 2 = C,D — cluster hemat vs cluster boros. Sederhana, tapi perhatikan: tanpa standardisasi, fitur &ldquo;transaksi&rdquo; (2 vs 22) mendominasi &ldquo;belanja&rdquo; (1 vs 10).</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,6,7,8], y: [980, 520, 310, 220, 180, 160, 150, 145], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "WCSS"}, {x: [3,3], y: [0, 980], type: "scatter", mode: "lines", line: {dash: "dash", color: "#e8a838"}, name: "siku (k=3)"}]}
  title={"Elbow method: WCSS vs jumlah cluster"}
  layout={{xaxis: {title: "k (jumlah cluster)"}, yaxis: {title: "WCSS"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = jumlah cluster, Y = WCSS (makin kecil = cluster makin rapat). Cari titik &lsquo;siku&rsquo; — setelahnya penambahan cluster hanya menurunkan WCSS sedikit.</p>
<p><strong>Interpretasi:</strong> Penurunan tajam 1→3, lalu melandai setelah k=3 (garis kuning). k=3 = titik manis: menambah cluster ke-4 dst. hanya memberi perbaikan marginal. Catatan: siku tidak selalu sejelas ini — kalau landai semua, pakai logika bisnis (berapa persona yang sanggup dilayani tim?).</p>
</div>
<PlotlyChart
  data={[{x: [1,1.2,0.8,2,9,10,9.5,11,5,5.5,4.8], y: [2,3,2.5,3.5,20,22,21,23,12,11,13], mode: "markers", marker: {color: ["#2a7de1","#2a7de1","#2a7de1","#2a7de1","#e8a838","#e8a838","#e8a838","#e8a838","#16a34a","#16a34a","#16a34a"], size: 12}, type: "scatter"}]}
  title={"Hasil K-means k=3 pada data belanja"}
  layout={{xaxis: {title: "Belanja per bulan (jt)"}, yaxis: {title: "Transaksi per bulan"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiap titik = pelanggan. Warna = cluster. Sumbu X = belanja, Y = frekuensi transaksi.</p>
<p><strong>Interpretasi:</strong> Tiga kelompok alami: biru (hemat, jarang), kuning (boros, sering), hijau (tengah). Inilah calon persona: &lsquo;Anak Gajian&rsquo; (biru), &lsquo;Sultan&rsquo; (kuning), &lsquo;Kelas Menengah&rsquo; (hijau). Perhatikan cluster hijau — tanpa standardisasi ia bisa tertelan cluster kuning.</p>
</div>
<h2 id="gmm">GMM — Si Diplomat yang Tidak Tegas</h2>
<p><strong>Definisi.</strong> <strong>Gaussian Mixture Model</strong> menganggap data lahir dari campuran k distribusi Gaussian. Bedanya dengan K-means: assignment-nya <strong>lunak</strong> (<em>soft</em>) — tiap titik punya <em>probabilitas</em> menjadi anggota tiap cluster (mis. 70% cluster A, 30% cluster B), bukan vonis mutlak. Tiap cluster punya bentuk sendiri (kovarians penuh: bisa lonjong, miring, bukan cuma bola).</p>
<p>Parameter: <Tex math={String.raw`\pi_k`} /> (bobot campuran), <Tex math={String.raw`\mu_k`} /> (pusat), <Tex math={String.raw`\Sigma_k`} /> (bentuk sebaran). Dipilih dengan <strong>BIC</strong> (<em>Bayesian Information Criterion</em>): makin kecil makin baik — BIC menghukum kompleksitas, jadi tidak asal tambah cluster.</p>
<Tex math={String.raw`p(x) = \sum_{k=1}^{K} \pi_k \, \mathcal{N}(x \mid \mu_k, \Sigma_k)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`p(x)`} />: peluang melihat titik x dari campuran ini</li>
<li><Tex math={String.raw`\pi_k`} />: proporsi populasi cluster k (jumlah semua = 1)</li>
<li><Tex math={String.raw`\mathcal{N}(x \mid \mu_k, \Sigma_k)`} />: Gaussian dengan pusat &mu;k dan bentuk &Sigma;k — &Sigma; inilah yang membuat cluster bisa lonjong/miring</li>
<li>Output: &gamma;(zik) = probabilitas titik i milik cluster k — bukan 0/1 seperti K-means</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Kalau K-means adalah <strong>hakim yang memvonis</strong> (kamu warga kecamatan A, titik), GMM adalah <strong>diplomat</strong> (kamu 70% A, 30% B). Untuk pelanggan perbatasan — mis. yang belanjanya kadang hemat kadang boros — vonis mutlak itu kejam dan salah.</p>
<p><strong>Kapan dipakai:</strong> Cluster tumpang tindih / bentuk tidak bola (mis. segmen &lsquo;naik kelas&rsquo; yang memanjang), atau kamu butuh skor keanggotaan untuk prioritas (prospek 90% &lsquo;hampir Sultan&rsquo;). Harga: lebih lambat, lebih sulit dijelaskan ke non-teknis.</p>
<details className="worked">
<summary>📐 Contoh: Kapan GMM menang (klik untuk buka)</summary>
<p>Dua segmen memanjang: &ldquo;Anak kos naik kelas&rdquo; (belanja naik pelan, transaksi naik cepat — cluster miring) dan &ldquo;Sultan stabil&rdquo; (bola di kanan atas). K-means memotong miring itu jadi dua bola — salah. GMM dengan kovarians penuh mengikuti kemiringan — benar.</p>
<p><strong>Aturan praktis:</strong> jalankan K-means dulu (cepat, baseline). Jika visual 2D menunjukkan cluster lonjong/tumpang tindih, naik ke GMM. Jika hasilnya mirip, tetap di K-means — lebih mudah dijelaskan ke CMO.</p>
</details>
<h2 id="persona">Dari Cluster ke Persona — Cluster Tanpa Aksi = Dekorasi</h2>
<p><strong>Definisi.</strong> <strong>Persona</strong> = cluster yang diberi <strong>profil</strong> (rata-rata tiap fitur: umur, belanja, frekuensi), <strong>ukuran</strong> (% populasi + nilai revenue), <strong>nama</strong> yang mudah diingat (&ldquo;Sultan Sepi&rdquo; lebih menempel dari &ldquo;Cluster 3&rdquo;), dan <strong>satu aksi marketing</strong> spesifik. Tanpa keempatnya, cluster = dekorasi slide.</p>
<p><strong>Validasi stabilitas:</strong> jalankan clustering 10x (atau di dua periode) — apakah anggota cluster stabil (&gt;80% tetap)? Cluster yang berganti-ganti anggota tiap run = artefak algoritma, bukan segmen nyata. Juga: uji <strong>actionability</strong> — bisakah tim menjangkau segmen ini secara berbeda? Kalau tidak, gabungkan.</p>
<p><strong>Kepribadian/intuisi:</strong> Cluster adalah <strong>temuan statistik</strong>, persona adalah <strong>karakter bisnis</strong>. Analis menemukan cluster; analis + marketing melahirkan persona. Nama yang bagus (&ldquo;Anak Gajian&rdquo;) membuat seluruh perusahaan — dari CS sampai direksi — bicara dalam bahasa yang sama.</p>
<p><strong>Kapan dipakai:</strong> Selalu akhiri proyek segmentasi dengan tabel persona 1 halaman: nama, ukuran, profil 3 baris, 1 aksi. Itulah deliverable-nya — bukan silhouette score.</p>
<details className="worked">
<summary>📐 Contoh: Tabel persona BankNusa (klik untuk buka)</summary>
<p><strong>1. &ldquo;Sultan Sepi&rdquo;</strong> (8% nasabah, 45% revenue): saldo &gt; Rp500jt, transaksi 2x/bln. Aksi: relationship manager personal + undangan private — JANGAN kirim promo massal (merusak eksklusivitas).</p>
<p><strong>2. &ldquo;Anak Gajian&rdquo;</strong> (45% nasabah, 15% revenue): saldo 1–5jt, transaksi 25x/bln, gaji masuk tiap tanggal 25. Aksi: fitur auto-save &ldquo;sisihkan 10% gajian&rdquo; + cashback merchant makan.</p>
<p><strong>3. &ldquo;Kelas Menengah Naik&rdquo;</strong> (30%): saldo 10–50jt, tren naik. Aksi: penawaran KPR/investasi — mereka dalam perjalanan ke Sultan.</p>
<p><strong>4. &ldquo;Penumpang Gelap&rdquo;</strong> (17%): saldo &lt; Rp500rb, 0 transaksi 6 bulan. Aksi: dormansi — reaktivasi murah atau biarkan (jangan bakar biaya akuisisi ulang).</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Geometri di Balik Cluster</h2>
<p>K-means dan GMM bukan &ldquo;kotak ajaib pengelompok&rdquo; — mereka membuat <strong>asumsi geometris</strong> tentang bentuk duniamu. Tiga pendalaman: (1) mengapa k-means buta terhadap cluster memanjang; (2) elbow vs silhouette — dua cara bertanya &ldquo;berapa k?&rdquo;; (3) GMM: ketika keanggotaan adalah probabilitas, bukan vonis.</p>
<h3>1. K-means = Voronoi + Asumsi Bola</h3>
<p><strong>Definisi.</strong> K-means meminimalkan <strong>WCSS</strong> (<em>within-cluster sum of squares</em>): jumlah kuadrat jarak tiap titik ke centroid cluster-nya. Konsekuensinya: batas antar-cluster selalu <strong>garis lurus</strong> (diagram Voronoi), dan cluster &ldquo;ideal&rdquo; menurut k-means berbentuk <strong>bola</strong> berukuran mirip.</p>
<Tex math={String.raw`WCSS = \sum_{k=1}^{K} \sum_{x_i \in C_k} \|x_i - \mu_k\|^2`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`K`} /> = jumlah cluster; <Tex math={String.raw`C_k`} /> = himpunan titik di cluster k; <Tex math={String.raw`\mu_k`} /> = centroid (rata-rata) cluster k; <Tex math={String.raw`\|x_i - \mu_k\|^2`} /> = kuadrat jarak Euclidean titik ke centroid-nya. K-means = &ldquo;taruh K titik tengah sehingga total kuadrat jarak minimal&rdquo;.</p>
<p><strong>Kepribadian/intuisi:</strong> K-means seperti <strong>memotong pizza dengan garis lurus dari tengah</strong> — cepat, rapi, tapi tidak bisa mengikuti bentuk topping yang memanjang. Jika pelangganmu membentuk &ldquo;sungai&rdquo; (misal: koridor usia-pendapatan yang miring), k-means akan memotong sungai itu menjadi 3 bola — <strong>rapi secara geometris, salah secara bisnis</strong>. Dan karena ia memakai jarak Euclidean mentah, fitur dengan skala besar (pendapatan jutaan) <strong>menenggelamkan</strong> fitur kecil (frekuensi 1–12) — standarisasi bukan opsional, ia syarat.</p>
<p><strong>Kapan dipakai:</strong> Cluster yang memang kira-kira bola &amp; seimbang (segmentasi RFM standar). Jangan pakai untuk: data memanjang/melengkung, cluster berukuran sangat timpang, atau ada outlier (satu outlier bisa menyeret centroid jauh).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: K-means memotong &ldquo;sungai&rdquo; (klik untuk buka)</summary>
<p>Data: 200 pelanggan membentuk koridor miring — usia 20–50 berkorelasi dengan pengeluaran 1–10jt (sungai dari kiri-bawah ke kanan-atas), plus 60 pelanggan &ldquo;hemat&rdquo; di bawah koridor.</p>
<p><strong>Langkah 1 — K-means K=2, tanpa standarisasi:</strong> fitur pengeluaran (jutaan) mendominasi jarak. Hasil: cluster &ldquo;mahal&rdquo; vs &ldquo;murah&rdquo; — <strong>sungai terpotong horizontal</strong>, bukan mengikuti alurnya. Pelanggan usia 25/pengeluaran 8jt se-cluster dengan usia 45/9jt (sama-sama &ldquo;mahal&rdquo;) padahal perilakunya beda generasi.</p>
<p><strong>Langkah 2 — Dengan standarisasi (z-score):</strong> kedua fitur setara. K-means K=2 kini memotong <strong>tegak lurus sungai</strong>: &ldquo;muda-hemat&rdquo; vs &ldquo;tua-royal&rdquo; — lebih masuk akal, tapi tetap garis lurus memotong koridor miring di tengah.</p>
<p><strong>Langkah 3 — K=3:</strong> sungai terpotong jadi 3 bola: muda, menengah, tua. Untuk kampanye &ldquo;3 tier&rdquo; ini <strong>cukup baik</strong> — buktinya cluster dipakai tim CRM.</p>
<p><strong>Pelajaran:</strong> (a) standarisasi dulu, selalu; (b) tanyakan &ldquo;apakah garis lurus masuk akal untuk dataku?&rdquo; — jika tidak, pertimbangkan GMM/density-based; (c) <strong>cluster yang dipakai &gt; cluster yang &ldquo;benar&rdquo;</strong> — K=3 yang dipakai mengalahkan K=2 yang optimal secara matematis tapi tidak bisa diaktivasi.</p>
</details>
<h3>2. Elbow vs Silhouette — Dua Cara Bertanya &ldquo;Berapa k?&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Elbow</em>: plot WCSS vs K — pilih K di &ldquo;siku&rdquo; (penurunan melambat). <em>Silhouette</em>: untuk tiap titik, <Tex math={String.raw`s = (b - a)/\max(a,b)`} /> — <Tex math={String.raw`a`} /> = jarak rata-rata ke sesama cluster, <Tex math={String.raw`b`} /> = jarak rata-rata ke cluster tetangga terdekat. s ∈ [−1, 1]: dekat 1 = pas, ≈0 = di perbatasan, negatif = salah kamar.</p>
<p><strong>Kepribadian/intuisi:</strong> Elbow seperti <strong>memutuskan berapa potong pizza</strong> dari &ldquo;kapan tambahan potongan tidak lagi berarti&rdquo; — subjektif, sikunya sering tidak jelas. Silhouette seperti <strong>bertanya ke tiap tamu</strong> &ldquo;kamu duduk di meja yang tepat?&rdquo; — kuantitatif, tapi mahal dihitung dan bisa menipu di cluster tidak-bola. Praktisi memakai <strong>keduanya + akal bisnis</strong>: &ldquo;silhouette tertinggi di K=4, tapi K=3 yang bisa diaktivasi tim&rdquo; → pilih 3.</p>
<p><strong>Kapan dipakai:</strong> Elbow untuk eksplorasi cepat; silhouette untuk membandingkan 2–3 kandidat K; keputusan final selalu melibatkan <strong>apakah persona-nya bisa dijelaskan dalam 1 kalimat</strong>.</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Membaca silhouette (klik untuk buka)</summary>
<p>Dua kandidat: K=3 (silhouette rata-rata 0,62) vs K=5 (0,58).</p>
<p><strong>Langkah 1 — Rata-rata:</strong> K=3 menang (0,62 &gt; 0,58). Tapi jangan berhenti di rata-rata.</p>
<p><strong>Langkah 2 — Per cluster:</strong> K=5 punya satu cluster dengan silhouette <strong>0,15</strong> (hampir nol!) berisi 40 orang — cluster &ldquo;sampah&rdquo;: anggotanya sama dekatnya ke tetangga. K=3: semua cluster &gt; 0,45.</p>
<p><strong>Langkah 3 — Interpretasi bisnis:</strong> cluster &ldquo;sampah&rdquo; K=5 tidak bisa diberi persona 1 kalimat (&ldquo;mereka yang... apa?&rdquo;). K=3: &ldquo;Pemburu Diskon&rdquo;, &ldquo;Setia Premium&rdquo;, &ldquo;Tidur&rdquo; — jelas.</p>
<p><strong>Keputusan: K=3.</strong> Menang di rata-rata, menang di cluster terlemah, menang di aktivasi. Tiga kemenangan &gt; satu metrik.</p>
</details>
<h3>3. GMM — Keanggotaan sebagai Probabilitas</h3>
<p><strong>Definisi.</strong> <em>Gaussian Mixture Model</em>: data dianggap campuran K distribusi Gaussian, tiap titik punya <strong>probabilitas keanggotaan</strong> per cluster (soft assignment), tiap cluster punya <strong>bentuk elips sendiri</strong> (kovarians penuh — bisa memanjang/miring!).</p>
<p><strong>Kepribadian/intuisi:</strong> Jika k-means adalah <strong>hakim yang memvonis</strong> (&ldquo;kamu cluster 2, titik&rdquo;), GMM adalah <strong>diplomat</strong> (&ldquo;kamu 70% cluster 2, 30% cluster 1&rdquo;). Untuk pelanggan di perbatasan — misal belanja kadang premium kadang diskon — vonis k-means <strong>menyembunyikan keraguan</strong> yang sebenarnya informasi berharga: pelanggan 50–50 adalah kandidat <strong>upsell</strong> (dorong sedikit ke premium!).</p>
<p><strong>Kapan dipakai:</strong> Cluster tumpang tindih / tidak-bola; saat kamu butuh <strong>skor keyakinan</strong> (target hanya yang &gt;80% yakin); data cukup besar (GMM lapar data — sedikit data = overfit).</p>
<details className="worked">
<summary>📐 Contoh langkah-demi-langkah: Pelanggan perbatasan (klik untuk buka)</summary>
<p>Pelanggan E: frekuensi 6x/tahun, nilai Rp180rb. K-means: masuk &ldquo;Reguler&rdquo;. GMM: 55% Reguler, 45% Premium.</p>
<p><strong>Langkah 1 — Apa yang disembunyikan k-means:</strong> vonis &ldquo;Reguler&rdquo; membuat tim CRM memperlakukannya seperti pelanggan Rp100rb — voucher diskon kecil.</p>
<p><strong>Langkah 2 — Apa yang dibuka GMM:</strong> 45% Premium = <strong>dia di ambang</strong>. Perlakuan yang benar: <em>jangan</em> diskon (diskon menurunkannya ke Reguler permanen!), tapi <strong>undang ke program premium</strong> (early access, bukan potongan harga).</p>
<p><strong>Langkah 3 — Aturan operasional:</strong> keanggotaan &gt; 80% = perlakukan sesuai cluster; 40–60% = &ldquo;zona persuasi&rdquo;, target upsell/cross-sell; &lt; 40% di semua = anomali, investigasi manual.</p>
<p><strong>Pelajaran:</strong> ketidakpastian model <strong>bukan</strong> kelemahan — ia peta peluang. K-means membuang peta itu.</p>
</details>
<PlotlyChart
  data={[{x: ["K=2", "K=3", "K=4", "K=5", "K=6"], y: [0.48, 0.62, 0.59, 0.58, 0.52], type: "bar", marker: {color: ["#94a3b8","#2a7de1","#94a3b8","#94a3b8","#94a3b8"]}, text: ["0,48","0,62","0,59","0,58","0,52"], textposition: "outside"}]}
  title={"Silhouette rata-rata vs jumlah cluster (contoh)"}
  layout={{yaxis: {title: "Silhouette rata-rata"}, xaxis: {title: "K"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = jumlah cluster, tinggi batang = silhouette rata-rata. Cari puncak — tapi jangan berhenti di situ.</p>
<p><strong>Interpretasi:</strong> Puncak di K=3 (0,62). K=5 (0,58) terlihat &ldquo;hampir sama&rdquo; — tapi ingat contoh di atas: rata-rata menyembunyikan cluster sampah 0,15. Selalu cek silhouette <strong>per cluster</strong>, bukan cuma rata-ratanya.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Elbow method selalu memberi jawaban jelas — tinggal lihat sikunya.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Elbow sering <strong>landai tanpa siku tegas</strong> (terutama data berdimensi tinggi). Jangan memaksa melihat siku yang tidak ada. Pakai tiga penentu: (1) elbow/BIC sebagai kandidat, (2) stabilitas antar run, (3) <strong>akal bisnis</strong> — berapa segmen yang sanggup dilayani tim marketing dengan pesan berbeda? 7 cluster untuk tim 3 orang = 4 cluster akan diabaikan.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Cluster = persona. Algoritma sudah mengelompokkan, tugas selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Cluster = <strong>bahan mentah</strong>. Kasus BankNusa: 7 cluster benar secara matematis, nol yang bisa dieksekusi. Persona butuh profiling + nama + ukuran + aksi — dan validasi: apakah cluster ini <em>reachable</em> (bisa dijangkau dengan pesan berbeda) dan <em>substantial</em> (cukup besar untuk worth effort)? Kalau tidak, gabungkan atau buang.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Standardisasi sebelum clustering — tanpa kecuali.</strong> Fitur &lsquo;total belanja (jutaan)&rsquo; vs &lsquo;frekuensi (satuan)&rsquo;: tanpa z-score, jarak Euclidean 99% ditentukan belanja. Satu baris StandardScaler (atau hitung manual) mengubah hasil total. Cek: bandingkan cluster sebelum/sesudah standardisasi di Lab 1.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Fitur sedikit tapi bermakna &gt; fitur banyak tapi berisik.</strong> 40 fitur mentah memberi cluster yang &lsquo;benar&rsquo; tapi tak terjelaskan (kasus BankNusa). Mulai dari 6–10 fitur RFM + demografis + perilaku kunci. Aturan: tiap fitur harus bisa kamu jelaskan kenapa ia membedakan pelanggan.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: K-means From-Scratch + Elbow</h2>
<p>Implementasi Lloyd's algorithm murni stdlib pada data RFM sintetis. Lihat WCSS turun per k, dan bandingkan hasil dengan/tanpa standardisasi.</p>
<PyodideLab
  title={"Lab 1 — K-means From-Scratch"}
  hint={"Ubah STANDARDISASI = False → True. Perhatikan cluster berubah total. Itulah kenapa tips #1 wajib."}
  defaultCode={"import random, math\nrandom.seed(7)\n\n# data sintetis: (belanja_jt/bln, transaksi/bln)\ndata = [(1,2),(1.2,3),(.8,2.5),(2,3.5),(1.5,2),\n        (9,20),(10,22),(9.5,21),(11,23),(8.5,19),\n        (5,12),(5.5,11),(4.8,13),(5.2,10)]\nSTANDARDISASI = True  # ubah ke False dan bandingkan!\n\ndef stand(d):\n    n = len(d); m = [sum(c)/n for c in zip(*d)]\n    s = [math.sqrt(sum((r[i]-m[i])**2 for r in d)/n) for i in range(2)]\n    return [[(r[i]-m[i])/s[i] for i in range(2)] for r in d]\n\nX = stand(data) if STANDARDISASI else [list(r) for r in data]\n\ndef kmeans(X, k, iters=20):\n    cent = random.sample(X, k)\n    for _ in range(iters):\n        cl = [[] for _ in range(k)]\n        for x in X:\n            j = min(range(k), key=lambda j: sum((x[d]-cent[j][d])**2 for d in range(2)))\n            cl[j].append(x)\n        baru = [[sum(c[d] for c in g)/len(g) for d in range(2)] if g else cent[j] for j, g in enumerate(cl)]\n        if baru == cent: break\n        cent = baru\n    wcss = sum(sum((x[d]-cent[j][d])**2 for d in range(2)) for j, g in enumerate(cl) for x in g)\n    return wcss, cl\n\nprint(\"k   WCSS\")\nfor k in range(1, 7):\n    w, _ = kmeans(X, k)\n    print(f\"{k}   {w:7.1f}\")\nprint(\"\\nCari 'siku': k di mana penurunan melandai.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Profiling Cluster → Persona</h2>
<p>Dari hasil cluster, hitung profil tiap cluster (rata-rata fitur + ukuran) — bahan mentah tabel persona.</p>
<PyodideLab
  title={"Lab 2 — Profiler Cluster"}
  hint={"Tambahkan fitur ketiga (mis. umur) ke data dan lihat profil berubah. Fitur apa yang paling membedakan cluster?"}
  defaultCode={"# cluster hasil lab 1 (k=3), data asli (belanja_jt, transaksi)\ndata = [(1,2),(1.2,3),(.8,2.5),(2,3.5),(1.5,2),\n        (9,20),(10,22),(9.5,21),(11,23),(8.5,19),\n        (5,12),(5.5,11),(4.8,13),(5.2,10)]\n# assignment manual sesuai visual (coba ubah!)\nanggota = {\"Hemat\": [0,1,2,3,4], \"Sultan\": [5,6,7,8,9], \"Menengah\": [10,11,12,13]}\n\nnama_persona = {\"Hemat\": \"Anak Gajian\", \"Sultan\": \"Sultan\", \"Menengah\": \"Kelas Menengah Naik\"}\naksi = {\"Hemat\": \"auto-save gajian + cashback makan\",\n        \"Sultan\": \"relationship manager, JANGAN promo massal\",\n        \"Menengah\": \"tawarkan investasi/KPR\"}\n\nprint(f\"{'cluster':<9}{'n':>4} {'belanja':>9} {'transaksi':>10}  persona -> aksi\")\nfor c, idx in anggota.items():\n    b = sum(data[i][0] for i in idx)/len(idx)\n    t = sum(data[i][1] for i in idx)/len(idx)\n    print(f\"{c:<9}{len(idx):>4} {b:>8.1f}jt {t:>9.1f}x  {nama_persona[c]} -> {aksi[c]}\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh segmentasi cepat, mudah dijelaskan ke direksi → <strong>K-means pada fitur RFM terstandardisasi</strong></h3>
<p><strong>Kenapa:</strong> Cepat, deterministik-ish, tiap pelanggan satu label tegas — mudah jadi tabel persona.</p>
<p><strong>Contoh nyata:</strong> Segmentasi awal e-commerce untuk kampanye 11.11.</p>
</div>
<div className="decision-card">
<h3>2. Cluster tumpang tindih / bentuk lonjong, atau butuh skor keanggotaan → <strong>GMM + BIC</strong></h3>
<p><strong>Kenapa:</strong> Soft assignment menangkap pelanggan perbatasan; kovarians mengikuti bentuk data.</p>
<p><strong>Contoh nyata:</strong> Segmen 'naik kelas' yang memanjang; scoring prospek prioritas sales.</p>
</div>
<div className="decision-card">
<h3>3. Tim kecil, butuh aksi minggu ini → <strong>RFM rule-based (MK3), bukan clustering</strong></h3>
<p><strong>Kenapa:</strong> Clustering butuh waktu validasi. RFM langsung jadi daftar target.</p>
<p><strong>Contoh nyata:</strong> Win-back campaign kilat: ambil segmen At Risk dari RFM.</p>
</div>
<div className="decision-card">
<h3>4. Hasil cluster tidak stabil antar run → <strong>Kurangi fitur / turunkan k / cek standardisasi</strong></h3>
<p><strong>Kenapa:</strong> Ketidakstabilan = sinyal fitur berisik atau k terlalu besar, bukan sinyal 'butuh algoritma canggih'.</p>
<p><strong>Contoh nyata:</strong> Dari 40 fitur → 8 fitur inti; silhouette & stabilitas naik.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Standardisasi dulu</strong> — selalu.</li><li><strong>Mulai K-means + elbow</strong>, naik ke GMM hanya jika perlu.</li><li><strong>Deliverable = tabel persona</strong> (nama, ukuran, profil, 1 aksi) — bukan skor teknis.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan: 7 Cluster yang Tidak Dipakai</h2>
<p>Bank &ldquo;Danarta&rdquo; menyewa konsultan Rp800jt untuk segmentasi nasabah. Hasil: 7 cluster dengan nama-nama indah (&ldquo;Aspirasional Urban&rdquo;, &ldquo;Pragmatis Konservatif&rdquo;...). Setahun kemudian: <strong>nol kampanye</strong> memakai cluster itu. Mengapa?</p>
<p><strong>Akar 1 — tidak bisa diaktivasi.</strong> Cluster didefinisikan dari 40 variabel survei psikografis yang <strong>tidak ada di database operasional</strong>. Tim CRM tidak bisa menjawab &ldquo;siapa saja yang &lsquo;Pragmatis Konservatif&rsquo;?&rdquo; — datanya tidak ada di sistem. Cluster yang tidak bisa di-query = puisi, bukan segmentasi.</p>
<p><strong>Akar 2 — tidak ada beda perlakuan.</strong> Bahkan jika bisa diidentifikasi, tidak ada yang tahu &ldquo;perlakukan A beda dari B <em>bagaimana</em>&rdquo;. Segmentasi tanpa <strong>playbook per segmen</strong> (pesan apa, channel apa, offer apa) = label tanpa aksi.</p>
<p><strong>Perbaikannya (tahun kedua, tim internal, biaya 10%):</strong> (1) hanya pakai variabel yang <strong>ada di core banking</strong> (saldo, frekuensi transaksi, tenure, produk dimiliki); (2) K=4 — tiap cluster 1 kalimat + 1 playbook: &ldquo;Transaksional Muda → ajak payroll&rdquo;, &ldquo;Penabung Pasif → ajak deposito&rdquo;, dst.; (3) <strong>ujicoba 1 kampanye per cluster</strong> sebelum meluncurkan segmentasi resmi. Hasil: 3 dari 4 playbook mengalahkan kontrol — segmentasi &ldquo;jelek&rdquo; yang dipakai mengalahkan segmentasi &ldahquo;indah&rdquo; yang dipajang.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Segmentasi yang baik = cluster yang homogen secara statistik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Segmentasi yang baik = cluster yang <strong>bisa diidentifikasi + bisa diperlakukan beda + perlakuannya menguntungkan</strong>. Homogenitas statistik hanya syarat pertama dari tiga. Tujuh cluster homogen yang tidak bisa di-query = Rp800jt untuk slide deck.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: 7 Cluster yang Tidak Dipakai</h2>
<div className="callout">
<p>BankNusa: 7 cluster dari 40 fitur, silhouette 0,62. Marketing tidak bisa menjawab &ldquo;cluster 4 dikirimi apa&rdquo;. Enam bulan terbuang. Analis baru mengulang: 8 fitur (RFM + usia + produk), k=4, tiap cluster punya nama + aksi. Response rate kampanye: <strong>2,1% → 6,4%</strong>.</p>
<p><strong>Pertanyaan:</strong> (a) Apa kesalahan utama pendekatan pertama? (b) Kenapa silhouette 0,62 tidak menyelamatkan? (c) Jika kamu hanya boleh menyimpan 1 cluster untuk kampanye, mana dan kenapa?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Optimasi metrik teknis tanpa uji actionability.</strong> 40 fitur → cluster tak terjelaskan; tidak ada profiling, nama, aksi; tidak dilibatkan tim marketing sejak awal.</p>
<p>(b) Silhouette mengukur <strong>kerapatan geometris</strong>, bukan <strong>kegunaan bisnis</strong>. Cluster bisa rapat tapi tidak reachable (tidak bisa dijangkau dengan pesan berbeda) atau tidak substantial (terlalu kecil untuk worth effort).</p>
<p>(c) <strong>&ldquo;Kelas Menengah Naik&rdquo;</strong> — terbesar kedua, tren naik, responsif terhadap penawaran (KPR/investasi = revenue besar). Sultan memang paling bernilai per orang, tapi kecil dan butuh sentuhan personal mahal. Untuk kampanye massal, segmen menengah-naik memberi ROI tertinggi.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Standarisasi.</strong> Fitur: pendapatan (Rp5–50jt) dan frekuensi (1–12x). Jarak Euclidean antara A(50jt, 12) dan B(5jt, 1). (a) Hitung tanpa standarisasi. (b) Kontribusi masing-masing fitur? (c) Kesimpulan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>(a) d = √((50−5)² + (12−1)²) = √(2025 + 121) = √2146 ≈ <strong>46,3</strong> (dalam &ldquo;satuan campur&rdquo;).</p>
<p>(b) Pendapatan: 2025/2146 = <strong>94%</strong> dari kuadrat jarak; frekuensi: <strong>6%</strong>. Frekuensi praktis <strong>tidak bersuara</strong> dalam clustering.</p>
<p>(c) Tanpa standarisasi, k-means-mu = &ldquo;clustering pendapatan&rdquo; yang kebetulan membawa frekuensi sebagai penumpang. <strong>Selalu z-score/min-max dulu</strong> — kecuali kamu <em>sengaja</em> ingin satu fitur dominan (dan bisa mempertahankannya).</p>
</details>
<p><strong>Soal 2 — Silhouette.</strong> Titik P: jarak rata-rata ke sesama cluster a=2, ke cluster tetangga b=5. Titik Q: a=4, b=4,5. Hitung s untuk keduanya. Siapa yang &ldquo;salah kamar&rdquo;?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>P: s = (5−2)/5 = <strong>0,6</strong> — nyaman di kamarnya. Q: s = (4,5−4)/4,5 = <strong>0,11</strong> — di ambang pintu. Tidak ada yang negatif (salah kamar total), tapi Q adalah kandidat &ldquo;zona persuasi&rdquo; ala GMM: perlakukan dengan hati-hati, bukan vonis.</p>
</details>
<p><strong>Soal 3 — Pilih metode.</strong> Tiga situasi: (a) 2 juta pelanggan, butuh segmentasi cepat untuk email blast mingguan; (b) 5.000 pelanggan premium, cluster kemungkinan tumpang tindih, butuh skor keyakinan; (c) data berbentuk bulan sabit (dua lengkungan). Metode untuk tiap situasi?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) <strong>K-means</strong> (atau mini-batch k-means) — cepat, skala besar, cluster cukup &ldquo;bola&rdquo; untuk email blast. Jangan over-engineering.</p>
<p>(b) <strong>GMM</strong> — butuh probabilitas keanggotaan; data kecil tapi berharga; tumpang tindih = vonis k-means berbahaya.</p>
<p>(c) <strong>Bukan keduanya!</strong> Bulan sabit = non-convex; k-means/GMM (bola/elips) gagal. Pakai <strong>spectral clustering atau DBSCAN</strong>. Pelajaran: kenali bentuk datamu <em>sebelum</em> memilih algoritma — plot 2D dulu, selalu.</p>
</details>
<div className="tip">
<p><strong>💡 Tiga pertanyaan sebelum clustering apa pun: (1) sudah distandarisasi? (2) bentuk datanya apa (plot!)? (3) cluster-nya bisa diaktivasi (ada di database + ada playbook-nya)? Tiga &ldquo;ya&rdquo; = lanjut. Satu &ldquo;tidak&rdquo; = berhenti dan perbaiki dulu.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Fitur: total belanja (0–50 juta) dan frekuensi (1–30x). Tanpa standardisasi, apa yang terjadi di K-means?"}
  options={
    ["Tidak ada masalah",
    "Jarak didominasi belanja; frekuensi hampir tidak berpengaruh",
    "Jarak didominasi frekuensi",
    "K-means error"]
  }
  correct={1}
  explanation={"Benar: skala belanja (jutaan) vs frekuensi (puluhan) — jarak Euclidean 99% ditentukan belanja. Hasil cluster = 'pengelompokan belanja', bukan 'pengelompokan perilaku'. Z-score dulu, selalu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Elbow curve landai tanpa siku jelas. Keputusan terbaik?"}
  options={
    ["Paksa pilih titik yang 'kelihatan' siku",
    "Naikkan k sampai 20",
    "Pakai BIC/stabilitas + akal bisnis (berapa segmen sanggup dilayani?)",
    "Batalkan clustering"]
  }
  correct={2}
  explanation={"Benar: siku yang tidak ada jangan dipaksa. Kombinasikan kriteria statistik (BIC, stabilitas) dengan kendala operasional — 7 cluster untuk tim 3 orang = 4 akan diabaikan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kapan GMM lebih tepat dari K-means?"}
  options={
    ["Selalu — lebih canggih",
    "Cluster tumpang tindih / lonjong, atau butuh probabilitas keanggotaan",
    "Data kecil",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: keunggulan GMM = soft assignment + kovarians fleksibel. Kalau cluster-mu bola-bola terpisah rapi, K-means sudah cukup dan jauh lebih mudah dijelaskan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Cluster stabil 95% antar run tapi marketing tidak bisa membuat pesan berbeda untuknya. Tindakan?"}
  options={
    ["Pertahankan — stabil itu bagus",
    "Gabungkan dengan cluster tetangga / buang — tidak actionable",
    "Naikkan k",
    "Ganti ke GMM"]
  }
  correct={1}
  explanation={"Benar: stabil ≠ berguna. Syarat segmen: reachable (bisa dijangkau berbeda) + substantial (worth effort). Cluster yang tidak bisa di-aksi-kan = dekorasi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Deliverable akhir proyek segmentasi yang benar?"}
  options={
    ["Silhouette score tertinggi",
    "Tabel persona: nama, ukuran, profil, 1 aksi per segmen",
    "Plot cluster 3D",
    "Jumlah cluster terbanyak"]
  }
  correct={1}
  explanation={"Benar: yang dieksekusi tim adalah persona + aksinya, bukan metrik teknis. Satu halaman tabel persona &gt; 50 slide plot cluster."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Dari Cluster ke Kampanye yang Jalan</h2>
<p>E-commerce &ldquo;LakuTerus&rdquo;: 800.000 pelanggan, email blast sama untuk semua (open rate 8%). Misi: segmentasi yang <strong>menghasilkan kampanye</strong>, bukan slide.</p>
<h3>Langkah 1 — Pilih fitur yang bisa diaktivasi</h3>
<p>Hanya 4 fitur, semuanya ada di database &amp; bisa di-query real-time: recency (hari sejak beli), frequency (order/12 bln), monetary (total Rp/12 bln), kategori favorit. <strong>Menolak</strong> 15 fitur &ldquo;menarik&rdquo; (skor engagement konten, dsb.) yang tidak bisa dipakai targeting. Prinsip: <strong>fitur yang tidak bisa dipakai = fitur yang tidak ada</strong>.</p>
<h3>Langkah 2 — Standarisasi + K-means, K=2..6</h3>
<p>Z-score semua fitur. Elbow: siku di K=3 dan K=4. Silhouette: K=3 (0,55) &gt; K=4 (0,49); K=4 punya cluster 0,18. <strong>Pilih K=3.</strong></p>
<h3>Langkah 3 — Profil + nama 1 kalimat</h3>
<p>Cluster 1 (45%): R rendah, F-M tinggi → &ldquo;<strong>Pelanggan Setia</strong>: beli rutin, nilai besar&rdquo;. Cluster 2 (35%): R tinggi, F-M rendah → &ldquo;<strong>Tidur</strong>: pernah beli, lama hilang&rdquo;. Cluster 3 (20%): R-F-M sedang, kategori = fashion → &ldquo;<strong>Musiman Fashion</strong>: muncul saat tren&rdquo;.</p>
<h3>Langkah 4 — Playbook per cluster (ini yang membedakan)</h3>
<p>Setia → <strong>jangan ganggu dengan diskon</strong> (mereka beli tanpa diskon!); kirim early-access produk baru. Tidur → win-back bertingkat: email (murah) → voucher (sedang) → telepon (mahal, hanya M tinggi). Musiman → kalender tren: kirim 2 minggu sebelum musim.</p>
<h3>Langkah 5 — Uji sebelum klaim</h3>
<p>A/B test per playbook vs kontrol &ldquo;blast sama&rdquo;: Setia +18% revenue (early access), Tidur +9% reaktivasi (win-back bertingkat), Musiman +22% (kalender tren). <strong>Baru setelah ini</strong> segmentasi dinyatakan &ldquo;resmi&rdquo;. Total waktu: 6 minggu. Biaya: 1 analis + 1 CRM specialist.</p>
<p><strong>Intuisi penutup:</strong> perhatikan urutannya — <strong>aktivasi dirancang SEBELUM cluster dinyatakan selesai</strong>. Kebanyakan proyek gagal karena urutannya terbalik: cluster dulu, mikir aktivasi kemudian (tidak pernah).</p>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Segmentasi</h2>
<h3>Jebakan 1: K dari langit</h3>
<p>&ldquo;Kita pakai 5 segmen karena kompetitor 5.&rdquo; K tanpa elbow/silhouette/bisnis = numerologi. <strong>Deteksi:</strong> tanya &ldquo;kenapa bukan 4 atau 6?&rdquo; — jawaban &ldquo;pokoknya&rdquo; = jebakan.</p>
<h3>Jebakan 2: Fitur bocor masa depan</h3>
<p>Clustering &ldquo;churn&rdquo; memakai fitur &ldquo;total refund&rdquo; — yang baru diketahui <strong>setelah</strong> churn. Cluster terlihat sempurna, tidak bisa dipakai prediksi. <strong>Deteksi:</strong> untuk tiap fitur tanya &ldquo;kapan tepatnya data ini tersedia?&rdquo; Masa depan = buang.</p>
<h3>Jebakan 3: Outlier jadi cluster</h3>
<p>Satu cluster berisi 12 &ldquo;paus&rdquo; (belanja 100x median). K-means menyeret centroid; solusinya bukan &ldquo;cluster paus&rdquo; — paus ditangani <strong>manual/VIP</strong>, bukan via segmentasi massal. <strong>Deteksi:</strong> cluster &lt; 1% = tangani khusus, jangan dipaksa masuk framework.</p>
<h3>Jebakan 4: Persona tanpa angka</h3>
<p>&ldquo;Budi, 28 tahun, suka kopi&rdquo; — fiksi sastra, bukan persona data. <strong>Deteksi:</strong> tiap kalimat persona harus bisa ditunjuk angkanya (&ldquo;Rata-rata F=8,2x&rdquo;). Tidak ada angka = karangan.</p>
<h3>Jebakan 5: Segmentasi sekali jadi</h3>
<p>Cluster 2023 dipakai sampai 2026 — padahal perilaku bergeser (pandemi, tren). <strong>Deteksi:</strong> monitor <strong>populasi per cluster per kuartal</strong>; pergeseran &gt; 15% = re-cluster. Segmentasi = makhluk hidup, bukan monumen.</p>
<div className="tip">
<p><strong>💡 Uji 3A untuk setiap segmentasi: <em>Available</em> (datanya ada di sistem?), <em>Actionable</em> (ada playbook beda per segmen?), <em>Alive</em> (dimonitor &amp; di-refresh?). Tiga &ldquo;ya&rdquo; = segmentasi. Kurang satu = dekorasi.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: One-Pager Persona</h2>
<p>Template 1 halaman per cluster — kalau tidak muat 1 halaman, cluster-mu belum jelas.</p>
<div className="callout">
<p><strong>🎯 [Nama cluster — 1 kalimat]</strong> <em>Contoh: &ldquo;Pelanggan Setia: beli rutin, nilai besar, tidak butuh diskon.&rdquo;</em></p>
<p><strong>Ukuran:</strong> __% base (__ orang) | <strong>Kontribusi revenue:</strong> __%</p>
<p><strong>Profil angka:</strong> Rata-rata R=__, F=__, M=Rp__ | Kategori top: __ | Channel favorit: __</p>
<p><strong>Beda dari cluster lain:</strong> satu kalimat pembeda. <em>Contoh: &ldquo;Satu-satunya cluster yang beli tanpa menunggu promo.&rdquo;</em></p>
<p><strong>Playbook:</strong> Pesan: __ | Channel: __ | Offer: __ | <strong>Jangan:</strong> __ (hal yang dilarang!)</p>
<p><strong>Query:</strong> <code>WHERE ...</code> (definisi operasional — siapa tepatnya)</p>
<p><strong>Target:</strong> __ (angka, mis. &ldquo;+10% repeat rate 90 hari&rdquo;) | <strong>Pemilik:</strong> __</p>
</div>
<p><strong>Kolom &ldquo;Jangan&rdquo; adalah yang terpenting.</strong> &ldquo;Jangan kirim diskon ke Setia&rdquo; mencegah tim growth yang bersemangat merusak margin cluster terbaikmu. Persona tanpa larangan = undangan untuk disalahgunakan.</p>

<h2 id="extra4">🧰 Kit Stabilitas: Apakah Cluster-mu Nyata?</h2>
<p>Cluster bisa jadi <strong>artefak algoritma</strong> — pola yang muncul dari noise. Tiga uji cepat:</p>
<p><strong>Uji 1 — Split-half.</strong> Bagi data jadi 2 acak, cluster masing-masing. Profil cluster-nya mirip? Jika &ldquo;Pelanggan Setia&rdquo; muncul di belahan A tapi tidak di B = <strong>halusinasi</strong>.</p>
<p><strong>Uji 2 — Bootstrap.</strong> Resample 10x, lihat % titik yang <strong>pindah cluster</strong>. &gt; 20% pindah = cluster tidak stabil, turunkan K atau tambah data.</p>
<p><strong>Uji 3 — Uji bisnis.</strong> Tahan 10% data sebagai &ldquo;kontrol buta&rdquo;: jalankan playbook, ukur. Cluster yang tidak menghasilkan beda vs kontrol = <strong>tidak ada nilainya</strong>, se-stabil apa pun statistiknya.</p>
<details className="worked">
<summary>📐 Contoh: Uji split-half menggugurkan K=5 (klik untuk buka)</summary>
<p>Belahan A (K=5): cluster &ldquo;Pemburu Flash Sale&rdquo; jelas (silhouette 0,5). Belahan B (K=5): tidak ada cluster serupa — anggotanya tersebar ke 4 cluster lain.</p>
<p><strong>Verdict:</strong> &ldquo;Pemburu Flash Sale&rdquo; = artefak belahan A (mungkin didorong satu event flash sale besar di periode itu). K=5 <strong>digugurkan</strong>; K=3 yang stabil di kedua belahan dipakai. Biaya uji: 1 jam. Biaya tidak menguji: kampanye untuk segmen yang tidak ada.</p>
</details>
<div className="tip">
<p><strong>💡 Cluster yang nyata = stabil secara statistik (split-half) + berguna secara bisnis (uji kontrol). Satu tanpa yang lain = belum selesai. Tanyakan keduanya sebelum presentasi.</strong></p>
</div>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Tiga Segmentasi</h2>
<p>Uji pemahamanmu: rancang segmentasi untuk tiga bisnis berbeda — dari nol sampai playbook. Bandingkan jawabanmu dengan pembahasan.</p>
<h3>Kasus A: SaaS B2B &ldquo;ArusKas&rdquo; (2.000 akun bisnis)</h3>
<p>Fitur kandidat: login/hari, jumlah user per akun, modul dipakai, tenure, ARPA, tiket support. <strong>Tantangan:</strong> satu &ldquo;paus&rdquo; (1 akun = 15% revenue).</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Pisahkan paus dulu</strong> (jebakan 3!): 1 akun VIP ditangani manual — jangan masuk clustering. Sisa 1.999 akun.</p>
<p><strong>Fitur terpilih:</strong> login/hari per user (adopsi), modul dipakai (kedalaman), tenure, ARPA. Buang &ldquo;tiket support&rdquo; (bocor: banyak tiket = mau churn ATAU power user — ambigu).</p>
<p><strong>Metode:</strong> K-means setelah z-score, K=3..5. Dugaan bisnis: &ldquo;Power User&rdquo;, &ldquo;Tidur&rdquo;, &ldquo;Dangkal tapi Bayar Mahal&rdquo; (ARPA tinggi, adopsi rendah = risiko churn + peluang ekspansi).</p>
<p><strong>Playbook kunci:</strong> &ldquo;Dangkal tapi Bayar Mahal&rdquo; → <strong>jangan</strong> tawarkan diskon (mereka tidak sensitif harga); tawarkan <strong>onboarding ulang + CSM</strong>. Ini segmen dengan NRR (net revenue retention) potensial terbesar.</p>
</details>
<h3>Kasus B: Warteg chain &ldquo;Barokah&rdquo; (50 gerai, 200.000 pelanggan kartu)</h3>
<p>Fitur: kunjungan/bulan, rata-rata struk, jam favorit (pagi/siang/malam), gerai favorit. <strong>Tantangan:</strong> data hanya dari kartu member (30% transaksi).</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Bias seleksi diakui dulu:</strong> member ≠ semua pelanggan (member lebih loyal). Segmentasi ini = &ldquo;segmentasi member&rdquo;, bukan &ldquo;segmentasi pelanggan&rdquo;. Tulis di laporan!</p>
<p><strong>Metode:</strong> K-means, K=3. Dugaan: &ldquo;Karyawan Siang&rdquo; (jam 11–14, struk sedang, frekuensi tinggi), &ldquo;Keluarga Malam&rdquo; (jam 18–21, struk besar, frekuensi rendah), &ldquo;Sarapan&rdquo; (jam 6–9).</p>
<p><strong>Playbook:</strong> &ldquo;Karyawan Siang&rdquo; → paket langganan makan siang (lock-in frekuensi). &ldquo;Keluarga Malam&rdquo; → promo bundel keluarga (naikkan struk). Beda jam = beda menu = beda dapur — segmentasi ini <strong>menggerakkan operasional</strong>, bukan cuma marketing.</p>
<p><strong>Pelajaran:</strong> segmentasi terbaik kadang bukan untuk iklan, tapi untuk <strong>operasional</strong> (jam buka, stok, staffing).</p>
</details>
<h3>Kasus C: Edtech &ldquo;PintarYu&rdquo; (100.000 pelajar freemium)</h3>
<p>Fitur: menit belajar/minggu, streak, kuis selesai, forum aktif, konversi ke premium (target!). <strong>Tantangan:</strong> jangan pakai &ldquo;konversi&rdquo; sebagai fitur (bocor!).</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Buang target dari fitur</strong> (jebakan 2): cluster dari perilaku, lalu <em>lihat</em> konversi per cluster — bukan sebaliknya.</p>
<p><strong>Metode:</strong> GMM — perilaku belajar tumpang tindih (ada yang &ldquo;kadang rajin&rdquo;). Dugaan: &ldquo;Streaker&rdquo; (streak panjang, menit sedang), &ldquo;Maraton&rdquo; (menit besar, streak pendek — belajar sistem kebut), &ldquo;Pengintip&rdquo; (buka app, tidak belajar).</p>
<p><strong>Playbook:</strong> &ldquo;Maraton&rdquo; → tawarkan premium <strong>saat</strong> sesi maraton (momen niat tertinggi) — bukan email generik. &ldquo;Pengintip&rdquo; → bukan target premium; target <strong>aktivasi</strong> dulu (lihat MK1!).</p>
<p><strong>Pelajaran:</strong> cluster + <strong>momen</strong> = targeting. &ldquo;Siapa&rdquo; tanpa &ldquo;kapan&rdquo; = setengah strategi.</p>
</details>
<div className="tip">
<p><strong>💡 Pola umum ketiga kasus: (1) pisahkan outlier/paus; (2) buang fitur bocor &amp; tak-teraktivasi; (3) pilih metode sesuai bentuk data; (4) playbook + &ldquo;jangan&rdquo; + momen. Kuasai pola ini — kamu bisa segmentasi bisnis apa pun dalam 6 minggu.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-elbow">📐 Worked Example: Memilih K dengan Elbow + Silhouette, Langkah-demi-Langkah</h2>
<p>Pertanyaan paling praktis dalam segmentasi — &ldquo;berapa cluster?&rdquo; — tidak punya jawaban teori; ia dijawab dengan <strong>dua alat yang saling mengoreksi</strong>: elbow (WCSS) dan silhouette score. Contoh ini memakai data mainan 12 pelanggan (fitur: belanja/bulan dalam juta rupiah, frekuensi/bulan) agar kamu bisa mengikuti aritmetikanya dengan tangan.</p>
<p><strong>Data (12 titik, sudah distandardisasi kasar):</strong> A(1,1) B(1,2) C(2,1) D(2,2) | E(8,1) F(9,1) G(8,2) H(9,2) | I(4,8) J(5,8) K(4,9) L(5,9). Secara visual: tiga gugus jelas (kiri-bawah, kanan-bawah, tengah-atas).</p>
<details className="worked">
<summary>📐 Perhitungan lengkap: WCSS untuk K = 1, 2, 3, 4 (klik untuk buka)</summary>
<p><strong>Langkah 0 — Rumus.</strong> <Tex math={String.raw`\text{WCSS}(K) = \sum_{k=1}^{K}\sum_{x \in C_k} \|x - \mu_k\|^2`} />: jumlah kuadrat jarak tiap titik ke centroid cluster-nya. Makin banyak cluster, WCSS makin kecil (K = 12 → WCSS = 0, tiap titik jadi centroid sendiri — tidak berguna).</p>
<p><strong>Langkah 1 — K = 1.</strong> Satu centroid = rata-rata semua titik ≈ (4,75; 4,17). WCSS ≈ <strong>218</strong> (semua titik jauh dari tengah).</p>
<p><strong>Langkah 2 — K = 2.</strong> K-means memisah gugus atas &#123;I..L&#125; vs gabungan dua gugus bawah &#123;A..H&#125;. WCSS ≈ <strong>96</strong>. Penurunan: 218 → 96 (<strong>−122</strong>, besar).</p>
<p><strong>Langkah 3 — K = 3.</strong> Tiga gugus alami terpisah sempurna. WCSS ≈ <strong>12</strong>. Penurunan: 96 → 12 (<strong>−84</strong>, masih besar).</p>
<p><strong>Langkah 4 — K = 4.</strong> Satu gugus alami terbelah dua secara artifisial. WCSS ≈ <strong>9</strong>. Penurunan: 12 → 9 (<strong>−3</strong>, kecil).</p>
<p><strong>Langkah 5 — Baca elbow.</strong> Penurunan: −122, −84, −3. &ldquo;Siku&rdquo; patah di <strong>K = 3</strong> — setelah itu tambah cluster hampir tidak mengurangi WCSS. Elbow menyarankan K = 3.</p>
<p><strong>Langkah 6 — Konfirmasi silhouette.</strong> <Tex math={String.raw`s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}`} /> dengan a(i) = jarak rata-rata ke anggota cluster sendiri, b(i) = jarak rata-rata ke cluster terdekat lainnya. Rata-rata s: K=2 → 0,52; <strong>K=3 → 0,71</strong>; K=4 → 0,58. Silhouette tertinggi di K = 3 — <strong>kedua alat sepakat</strong>.</p>
<p><strong>Langkah 7 — Keputusan + uji kewarasan.</strong> K = 3, dan tiap cluster punya <strong>cerita bisnis</strong>: (1) &ldquo;Pembeli hemat&rdquo; (belanja kecil, jarang), (2) &ldquo;Pembeli boros jarang&rdquo; (belanja besar, jarang), (3) &ldquo;Pembeli rutin&rdquo; (belanja sedang, sering). Cluster yang tidak bisa diberi nama bisnis = cluster yang tidak akan dipakai — berapa pun silhouette-nya.</p>
</details>
<h3>Empat aturan praktis memilih K</h3>
<ul>
<li><strong>Elbow dulu, silhouette konfirmasi.</strong> Elbow cepat tapi subjektif (&ldquo;sikunya di mana?&rdquo;); silhouette memberi angka objektif 0–1. Kalau keduanya beda jauh, curigai data (outlier, skala fitur belum seragam).</li>
<li><strong>Standarisasi dulu, cluster kemudian.</strong> K-means memakai jarak Euclidean — fitur &ldquo;belanja (jutaan)&rdquo; vs &ldquo;frekuensi (kali)&rdquo; tanpa standardisasi = fitur dengan angka besar mendominasi. Selalu <code className="inline">StandardScaler</code> sebelum clustering.</li>
<li><strong>K harus &ldquo;habis dibagi&rdquo; oleh tim.</strong> 7 cluster yang butuh 7 kampanye berbeda dengan tim 3 orang = 4 cluster mati. Batas atas K = jumlah aksi berbeda yang sanggup dijalankan.</li>
<li><strong>Stabilitas &gt; optimalitas.</strong> Jalankan k-means 10x dengan seed berbeda (atau bootstrap 80% data). Cluster yang anggotanya berpindah-pindah = artefak algoritma, bukan segmen nyata. Lihat &ldquo;Kit Stabilitas&rdquo; di lesson ini.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: elbow bertanya &ldquo;di mana tambah cluster berhenti berguna?&rdquo;, silhouette bertanya &ldquo;seberapa yakin tiap titik di rumah yang benar?&rdquo;. Jawaban yang bisa dipakai = yang disepakati keduanya <em>dan</em> bisa diceritakan ke tim marketing dalam 30 detik.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Bank Digital &ldquo;ArusDana&rdquo; — Segmentasi yang Dipakai Tim Produk</h2>
<p><em>ArusDana</em> (nama disamarkan): bank digital dengan 1,8 juta nasabah. Tim data membuat 6 cluster &ldquo;canggih&rdquo; (GMM + 14 fitur) — <strong>tidak dipakai siapa pun</strong> selama 8 bulan karena &ldquo;terlalu abstrak untuk dibuatkan kampanye&rdquo;. Proyek reboot: segmentasi ulang dengan satu syarat — <strong>setiap cluster harus punya aksi produk yang konkret</strong>.</p>
<h3>Desain ulang: fitur sedikit, aksi jelas</h3>
<p>Fitur dipangkas ke 5 yang bisa dijelaskan ke teller: saldo rata-rata, frekuensi transaksi/bulan, % transaksi QRIS, umur akun, pernah ambil KTA (ya/tidak). K-means dengan K = 4 (elbow + silhouette sepakat; 4 = jumlah yang sanggup ditangani tim CRM).</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Cluster (nama bisnis)</th><th>% Nasabah</th><th>Ciri</th><th>Aksi produk</th></tr></thead>
<tbody>
<tr><td><strong>Penabung Diam</strong></td><td>38%</td><td>Saldo besar, transaksi &lt; 3/bln</td><td>Deposito digital + notifikasi bunga (bukan promo transaksi)</td></tr>
<tr><td><strong>Transaksional Harian</strong></td><td>31%</td><td>Saldo kecil, QRIS &gt; 40x/bln</td><td>Cashback QRIS + paylater mikro</td></tr>
<tr><td><strong>Bintang Naik</strong></td><td>17%</td><td>Umur akun &lt; 6 bln, frekuensi naik</td><td>Onboarding journey + limit bertahap</td></tr>
<tr><td><strong>Tidur</strong></td><td>14%</td><td>Tidak transaksi 90+ hari</td><td>Win-back call + reaktivasi (bukan iklan umum)</td></tr>
</tbody>
</table>
</div>
<h3>Hasil 2 kuartal: segmentasi yang hidup</h3>
<ul>
<li><strong>Penabung Diam → deposito:</strong> 9% dari segmen membuka deposito digital (vs 2% kontrol tanpa targeting) — dana murah +Rp1,2 triliun.</li>
<li><strong>Transaksional → paylater:</strong> take-rate paylater 14% vs 5% blast umum — dengan NPL 1,1% (lebih rendah dari rata-rata, karena segmen ini transaksinya terlihat).</li>
<li><strong>Tidur → reaktivasi:</strong> 22% kembali transaksi setelah win-back call — biaya Rp8.000/nasabah vs CAC nasabah baru Rp85.000.</li>
</ul>
<p><strong>Tiga pelajaran:</strong> (1) <strong>5 fitur yang dimengerti &gt; 14 fitur yang canggih</strong> — cluster dipakai karena tim produk bisa menjelaskannya ke nasabah. (2) <strong>Nama cluster = janji aksi</strong>: &ldquo;Cluster 3&rdquo; tidak menggerakkan siapa pun; &ldquo;Penabung Diam&rdquo; langsung memicu ide produk. (3) <strong>Segmentasi diukur dari aksi, bukan dari silhouette</strong> — silhouette 0,71 tidak membayar gaji; deposito Rp1,2 triliun yang membayar.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Segmentasi yang baik = cluster yang homogen secara statistik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Segmentasi yang baik = cluster yang <strong>heterogen antar-cluster dalam hal yang bisa di-aksi-kan</strong> dan homogen dalam respons terhadap aksi itu. Dua cluster dengan silhouette sempurna tapi butuh perlakuan sama = satu cluster yang terbelah sia-sia.</p>
</div>

            <h2 id="tambahan-faq">❓ FAQ: Pertanyaan Praktis Seputar Segmentasi</h2>
<h3>1. &ldquo;K-means atau hierarchical clustering — mana yang dipakai?&rdquo;</h3>
<p><strong>K-means</strong> untuk data besar (ratusan ribu–jutaan baris): cepat, skalabel, tapi butuh K di awal dan hanya paham cluster berbentuk bola. <strong>Hierarchical</strong> untuk data kecil (&lt; 10.000 baris) saat kamu ingin <em>melihat</em> struktur: dendrogram menunjukkan hierarki &ldquo;cluster ini pecah jadi dua sub-cluster&rdquo; — bagus untuk eksplorasi awal sebelum menetapkan K untuk k-means. Praktik umum: hierarchical di sampel 5.000 untuk intuisi K, lalu k-means di data penuh untuk produksi.</p>
<h3>2. &ldquo;Fitur kategorikal (kota, device) bisa masuk k-means?&rdquo;</h3>
<p><strong>Tidak langsung.</strong> K-means menghitung jarak Euclidean — &ldquo;Jakarta vs Surabaya&rdquo; tidak punya jarak numerik yang bermakna. Tiga opsi: (a) <strong>one-hot encoding</strong> lalu k-means — bisa, tapi jarak antar kategori jadi artifisial; (b) <strong>k-modes/k-prototypes</strong> — varian yang memang dirancang untuk kategorikal/campuran; (c) <strong>ubah jadi numerik bermakna</strong> dulu: &ldquo;kota&rdquo; → &ldquo;rata-rata belanja kota itu&rdquo; (target encoding). Opsi (c) sering paling berguna untuk bisnis karena fiturnya langsung bisa diceritakan.</p>
<h3>3. &ldquo;Berapa sering segmentasi harus di-refresh?&rdquo;</h3>
<p>Tergantung <strong>kecepatan perilaku berubah</strong>, bukan kalender. E-commerce/fast-moving: kuartalan. Bank/telekomunikasi: semesteran. B2B enterprise: tahunan. Tanda harus refresh <em>sekarang</em>: distribusi ukuran cluster bergeser &gt; 20% dari baseline, atau kampanye per-cluster tiba-tiba performanya seragam (cluster tidak lagi membedakan respons = segmentasi basi). Otomatiskan <strong>monitoring drift</strong>: tiap bulan hitung % populasi per cluster; alarm jika bergeser.</p>
<h3>4. &ldquo;Cluster saya tidak stabil — tiap run anggotanya beda. Normal?&rdquo;</h3>
<p><strong>Sebagian normal, sebagian sinyal.</strong> K-means memang sensitif terhadap inisialisasi centroid — solusinya <code className="inline">n_init=20</code> (atau k-means++). Tapi jika setelah itu anggota masih berpindah &gt; 15% antar-run, datamu mungkin <strong>tidak punya cluster alami</strong> (satu gumpalan kontinum, bukan gugus terpisah). Itu bukan kegagalan — itu temuan: paksa membelah kontinum = segmentasi artifisial yang tidak akan stabil di kampanye. Alternatif: segmentasi berbasis <strong>aturan bisnis</strong> (RFM quintile) yang deterministik dan stabil.</p>
<h3>5. &ldquo;Bolehkan satu pelanggan di dua segmen?&rdquo;</h3>
<p><strong>Boleh — dan sering lebih jujur.</strong> K-means memaksa satu label (hard assignment); GMM memberi probabilitas keanggotaan (soft assignment): &ldquo;pelanggan ini 70% Transaksional, 30% Bintang Naik.&rdquo; Untuk <strong>targeting</strong>, pakai label dominan. Untuk <strong>analisis</strong> (mis. sizing peluang), pakai probabilitasnya — menjumlah &ldquo;0,7 orang&rdquo; terdengar aneh tapi menghasilkan estimasi ukuran segmen yang lebih akurat daripada pembulatan paksa.</p>
<h3>6. &ldquo;Segmentasi vs personalisasi 1-to-1 — mana yang benar?&rdquo;</h3>
<p><strong>Keduanya, berlapis.</strong> Segmentasi = strategi <em>siapa diperlakukan bagaimana</em> (4–7 perlakuan berbeda yang dikelola tim). Personalisasi 1-to-1 = taktik <em>eksekusi</em> di dalam segmen (rekomendasi produk per orang oleh algoritma). Analogi: segmentasi menentukan &ldquo;kita bikin 4 menu untuk 4 tipe tamu&rdquo;; personalisasi menentukan &ldquo;di dalam menu itu, lauknya disesuaikan selera tiap tamu&rdquo;. Perusahaan yang lompat ke personalisasi tanpa segmentasi biasanya tidak bisa menjelaskan <em>kenapa</em> strateginya bekerja — dan tidak bisa memperbaikinya saat berhenti bekerja.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: segmentasi adalah <em>alat keputusan</em>, bukan latihan statistik. Setiap pilihan teknis (algoritma, K, refresh, hard vs soft) dinilai dari satu pertanyaan: &ldquo;apakah ini membuat tim berani bertindak berbeda untuk orang yang berbeda?&rdquo;</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>K-means</strong>: minimalkan WCSS; wajib standardisasi; k-means++ untuk inisiasi; pilih k via elbow + akal bisnis.</li>
<li><strong>GMM</strong>: soft assignment (probabilitas, bukan vonis) + kovarians fleksibel; pilih k via BIC; untuk cluster tumpang tindih/lonjong.</li>
<li><strong>Persona</strong> = cluster + profil + ukuran + nama + 1 aksi. Tanpa aksi = dekorasi.</li>
<li><strong>Validasi</strong>: stabilitas antar run (&gt;80% tetap) + actionability (reachable & substantial).</li>
<li><strong>Fitur sedikit bermakna</strong> mengalahkan fitur banyak berisik.</li>
<li><strong>Kapan TIDAK clustering</strong>: butuh aksi minggu ini (pakai RFM rule-based) atau segmen sudah jelas dari bisnis (pakai aturan).</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk3-deskriptif" className="btn btn-secondary btn-sm">← MK3</Link>
        <Link href="/learn/mk5-clv" className="btn btn-primary btn-sm">MK5 →</Link>
      </div>
    </div>
  );
}
