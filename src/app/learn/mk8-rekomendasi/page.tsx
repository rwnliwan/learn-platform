"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk8RekomendasiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK8 — Marketing Data Analytics</span>
        <h1 className="display-title">Recommender System:<br/>'Pelanggan Juga Beli...'</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: 'Rekomendasi Terlaris' yang Membunuh Toko Buku</a></li>
<li><a href="#cf">Collaborative Filtering</a></li>
<li><a href="#content">Content-Based & Cold Start</a></li>
<li><a href="#assoc">Association Rules</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Rekomendasi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Widget 0,3%</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Membangun Rekomendasi dari Nol</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Rekomendasi</a></li>
<li><a href="#extra3">📋 Playbook: Evaluasi Rekomendasi 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Tiga Rekomendasi</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela Diversity</a></li>
<li><a href="#faq">❓ Tanya-Jawab Kilat</a></li>
<li><a href="#netflix">🏆 Studi Kasus: Netflix Prize — Pelajaran Rp15 Miliar</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan cara kerja user-based vs item-based collaborative filtering.</li>
<li>Menghitung cosine similarity dan memprediksi rating dengan weighted average.</li>
<li>Menghitung support, confidence, lift dan menemukan aturan asosiasi yang berguna.</li>
<li>Mengidentifikasi cold start problem dan memilih strateginya.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: 'Rekomendasi Terlaris' yang Membunuh Toko Buku</h2>
      <div className="story">
        <p>Toko buku online <em>&ldquo;BacaTerus&rdquo;</em> memasang widget &ldquo;Rekomendasi Untukmu&rdquo; yang isinya… <strong>10 buku terlaris nasional</strong>. Sama untuk semua orang. Click-through 0,3%. Tim produk menyimpulkan: <em>&ldquo;rekomendasi tidak bekerja untuk kami.&rdquo;</em></p>
<p>Twist-nya: yang tidak bekerja bukan rekomendasi — tapi <strong>rekomendasi palsu</strong>. Rekomendasi sejati = personal (&ldquo;karena kamu beli X…&rdquo;). Setelah diganti item-based collaborative filtering sederhana, CTR naik ke 4,1% dan 18% revenue datang dari widget itu. Amazon menghasilkan ~35% revenue dari rekomendasi — bukan dari &ldquo;terlaris nasional&rdquo;. Lesson ini: tiga mesin yang membuat &ldquo;untukmu&rdquo; benar-benar untukmu.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="cf">Collaborative Filtering — 'Orang Sepertimu Suka...'</h2>
<p><strong>Definisi.</strong> <strong>Collaborative filtering (CF)</strong> memprediksi kesukaanmu dari <strong>orang lain</strong>: <strong>user-based</strong> — &ldquo;pengguna mirip kamu (cosine similarity tinggi) suka X, jadi kamu mungkin suka X&rdquo;; <strong>item-based</strong> — &ldquo;kamu suka A; orang yang suka A juga suka B; jadi coba B&rdquo;. Item-based lebih stabil (item berubah lebih lambat dari selera user) dan jadi standar industri.</p>
<p><strong>Cosine similarity</strong> mengukur kemiripan dua vektor (user/item) via sudutnya. Prediksi rating = rata-rata tertimbang rating tetangga, bobot = similarity.</p>
<Tex math={String.raw`\text{sim}(u,v) = \frac{u \cdot v}{\lVert u \rVert \, \lVert v \rVert} \quad;\quad \hat{r}_{u,i} = \frac{\sum_v \text{sim}(u,v)\, r_{v,i}}{\sum_v |\text{sim}(u,v)|}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\text{sim}(u,v)`} />: kemiripan user u dan v (−1 s.d. 1; 1 = selera identik)</li>
<li><Tex math={String.raw`u \cdot v`} />: dot product vektor rating — besar jika keduanya suka item yang sama</li>
<li><Tex math={String.raw`\hat{r}_{u,i}`} />: prediksi rating user u untuk item i — rata-rata rating tetangga, dibobot kemiripan</li>
<li>Intuisi: tetangga yang sangat mirip (sim 0,9) suaranya 9x tetangga biasa (sim 0,1)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CF seperti <strong>nongkrong di toko buku dan bertanya ke pembaca yang seleranya mirip</strong>: &lsquo;kamu yang suka Murakami, habis ini baca apa?&rsquo; — jauh lebih tepat dari &lsquo;buku terlaris nasional&rsquo; (yang dibeli semua orang termasuk yang tidak sejenis denganmu).</p>
<p><strong>Kapan dipakai:</strong> Banyak user × banyak item × ada histori interaksi. Item-based untuk katalog stabil; user-based untuk selera berubah cepat (berita, fashion).</p>
<details className="worked">
<summary>📐 Contoh: Prediksi rating manual (klik untuk buka)</summary>
<p>Rating (1–5) — Andi: X=5, Y=3; Budi: X=4, Y=2, Z=5; Cici: X=5, Z=4. Prediksi rating Andi untuk Z.</p>
<p><strong>Langkah 1 — similarity:</strong> sim(Andi,Budi): vektor X,Y = (5,3)•(4,2) = 20+6=26; |Andi|=&radic;34≈5,83; |Budi|=&radic;20≈4,47 → sim ≈ 26/26,06 ≈ <strong>1,00</strong>. sim(Andi,Cici): (5)•(5)=25; |Cici| (hanya X) =5 → 25/(5,83×5) ≈ <strong>0,86</strong>.</p>
<p><strong>Langkah 2 — prediksi:</strong> r̂ = (1,00×5 + 0,86×4)/(1,00+0,86) = 8,44/1,86 ≈ <strong>4,5</strong>. Rekomendasikan Z ke Andi (prediksi tinggi).</p>
</details>
<PlotlyChart
  data={[{z: [[1,0.95,0.2,0.1],[0.95,1,0.25,0.15],[0.2,0.25,1,0.9],[0.1,0.15,0.9,1]], x: ["Andi","Budi","Cici","Dodi"], y: ["Andi","Budi","Cici","Dodi"], type: "heatmap", colorscale: [[0,"#f1f5f9"],[1,"#2a7de1"]], text: [["1","0,95","0,2","0,1"],["0,95","1","0,25","0,15"],["0,2","0,25","1","0,9"],["0,1","0,15","0,9","1"]], texttemplate: "%{text}", showscale: false}]}
  title={"Matriks similarity antar pengguna"}
  layout={{xaxis: {title: ""}, yaxis: {title: ""}}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sel = similarity dua pengguna. Biru tua = sangat mirip, terang = tidak mirip. Diagonal selalu 1.</p>
<p><strong>Interpretasi:</strong> Dua blok jelas: (Andi,Budi) (0,95) dan (Cici,Dodi) (0,9) — dua &lsquo;geng selera&rsquo;. Rekomendasi Andi diambil dari Budi (bukan Cici). Inilah visual &lsquo;orang sepertimu&rsquo;: blok biru = tetangga yang suaranya didengar.</p>
</div>
<h2 id="content">Content-Based — 'Karena Kamu Suka X...'</h2>
<p><strong>Definisi.</strong> <strong>Content-based</strong> merekomendasikan item yang <strong>mirip dengan yang kamu sukai</strong> — dari <em>fitur item</em> (genre, penulis, kata kunci; TF-IDF untuk teks), bukan dari orang lain. Profil user = rata-rata fitur item yang ia sukai; skor = cosine(profil, item).</p>
<p><strong>Cold start</strong> — masalah klasik: <strong>user baru</strong> (tidak ada histori → CF mati; solusi: content-based dari 3 item onboarding / popularitas tersegmentasi), <strong>item baru</strong> (tidak ada yang rating → solusi: content-based dari fiturnya), dan keduanya. <strong>Hybrid</strong> (campuran CF + content-based) adalah standar produksi.</p>
<p><strong>Kepribadian/intuisi:</strong> Content-based seperti <strong>pustakawan yang hafal isi buku</strong>: &lsquo;kamu suka novel Jepang bernuansa surealis? Ini 3 yang mirip.&rsquo; Ia tidak butuh tahu orang lain — cukup paham bukunya. Kelemahan: ia tidak akan pernah mengenalkanmu ke genre baru (filter bubble); CF bisa (&lsquo;orang sepertimu ternyata suka jazz!&rsquo;).</p>
<p><strong>Kapan dipakai:</strong> Katalog dengan metadata kaya (film, berita, fashion), item baru terus bermunculan, atau cold start parah. Hybrid untuk produksi serius.</p>
<details className="worked">
<summary>📐 Contoh: Cold start user baru (klik untuk buka)</summary>
<p>User baru daftar, pilih 3 genre favorit saat onboarding: [fiksi Jepang, sejarah, sains populer].</p>
<p><strong>Hari 1 (cold):</strong> content-based dari 3 genre → 10 rekomendasi awal. CF belum bisa (vektor user kosong).</p>
<p><strong>Minggu 2:</strong> user sudah rate 15 buku → hybrid: 70% CF (tetangga selera) + 30% content-based (eksplorasi).</p>
<p><strong>Aturan:</strong> jangan tampilkan widget kosong (&ldquo;belum ada rekomendasi&rdquo;) — isi dengan terlaris <em>tersegmentasi</em> (genre pilihannya), bukan terlaris nasional.</p>
</details>
<h2 id="assoc">Association Rules — 'Sering Dibeli Bersamaan'</h2>
<p><strong>Definisi.</strong> <strong>Association rules</strong> menemukan pola &ldquo;X → Y&rdquo; dari keranjang belanja: <strong>support</strong> = % transaksi mengandung X dan Y (seberapa umum); <strong>confidence</strong> = % keranjang berisi X yang juga berisi Y (seberapa bisa diandalkan); <strong>lift</strong> = confidence / P(Y) (apakah Y benar-benar terkait X, atau cuma laris umum?).</p>
<p>Aturan emas: <strong>lift &gt; 1</strong> = terkait beneran. Confidence tinggi tapi lift ≈ 1 = &ldquo;orang beli X lalu beli Y karena Y dibeli semua orang&rdquo; — bukan insight.</p>
<Tex math={String.raw`\text{supp}(X \to Y) = P(X \cap Y) \quad;\quad \text{conf} = \frac{P(X \cap Y)}{P(X)} \quad;\quad \text{lift} = \frac{\text{conf}}{P(Y)}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>support: seberapa sering pola muncul (filter: support &lt; 1% = anekdot, bukan pola)</li>
<li>confidence: jika X dibeli, seberapa sering Y ikut</li>
<li>lift: 2,5 = Y 2,5x lebih mungkin dibeli bersama X dibanding acak — inilah angka yang penting</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Association rules seperti <strong>kasir yang hafal kebiasaan</strong>: &lsquo;yang beli popok biasanya beli bir juga&rsquo; (legenda ritel). Tapi kasir yang baik tahu bedanya &lsquo;sering bareng karena terkait&rsquo; (lift tinggi) vs &lsquo;sering bareng karena dua-duanya laris&rsquo; (lift ≈ 1).</p>
<p><strong>Kapan dipakai:</strong> Market basket analysis, bundling, tata letak (online: &lsquo;sering dibeli bersamaan&rsquo;; offline: rak berdekatan), cross-sell.</p>
<details className="worked">
<summary>📐 Contoh: Aturan mie → telur (klik untuk buka)</summary>
<p>10.000 transaksi: 3.000 ada mie (P=30%), 4.000 ada telur (P=40%), 2.400 ada keduanya.</p>
<p>support = 2.400/10.000 = <strong>24%</strong>. confidence = 2.400/3.000 = <strong>80%</strong>. lift = 0,8/0,4 = <strong>2,0</strong>.</p>
<p><strong>Baca:</strong> &ldquo;80% pembeli mie juga beli telur, dan itu 2x lipat dari peluang acak.&rdquo; Aksi: bundle mie+telur, atau taruh berdekatan. Bandingkan aturan mie → garam: confidence 90% tapi P(garam)=85% → lift 1,06 — tidak menarik (semua orang beli garam).</p>
</details>
<PlotlyChart
  data={[{x: ["mie → telur", "kopi → gula", "mie → garam", "popok → bir"], y: [2.0, 1.8, 1.06, 2.4], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#94a3b8","#e8a838"]}, text: ["2,0","1,8","1,06","2,4"], textposition: "outside"}]}
  title={"Lift empat aturan asosiasi"}
  layout={{yaxis: {title: "Lift"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = lift. Di atas 1 = terkait beneran; ≈1 = kebetulan (sama-sama laris).</p>
<p><strong>Interpretasi:</strong> &lsquo;mie → garam&rsquo; confidence-nya tertinggi tapi lift 1,06 — jebakan klasik (garam dibeli semua orang). &lsquo;Popok → bir&rsquo; lift 2,4 = insight sejati. <strong>Urutkan aturan by lift, bukan confidence.</strong> Inilah bedanya analis dan kasir: analis tahu kapan pola itu ilusi.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Rekomendasi</h2>
<p>Rekomendasi terlihat seperti sihir (&ldquo;kok tahu saya mau ini?&rdquo;) — padahal tiga mesin matematika sederhana: (1) <strong>kesamaan</strong> (siapa mirip siapa), (2) <strong>kedekatan konten</strong> (barang mirip barang), (3) <strong>kebersamaan</strong> (barang yang sering bareng). Pendalaman: kapan tiap mesin bekerja, kapan ia berbohong, dan mengapa &ldquo;terlaris&rdquo; bisa membunuh toko.</p>
<h3>1. Collaborative Filtering — &ldquo;Orang Sepertimu Suka...&rdquo;</h3>
<p><strong>Definisi.</strong> <em>User-based CF</em>: rekomendasikan barang yang disukai <strong>pengguna mirip</strong>. <em>Item-based CF</em>: rekomendasikan barang yang mirip dengan <strong>barang yang kamu sukai</strong>. Kemiripan diukur dengan <strong>cosine similarity</strong> atau <strong>Pearson</strong> dari vektor rating.</p>
<Tex math={String.raw`\text{cos}(u,v) = \frac{\sum_i r_{ui}\, r_{vi}}{\sqrt{\sum_i r_{ui}^2}\,\sqrt{\sum_i r_{vi}^2}}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`r_{ui}`} /> = rating user u untuk item i; pembilang = &ldquo;seberapa sejalan selera mereka&rdquo;; penyebut = normalisasi (agar yang banyak rating tidak otomatis menang). Hasil −1 sampai 1; dekat 1 = selera mirip.</p>
<p><strong>Kepribadian/intuisi:</strong> User-based seperti <strong>bertanya ke teman yang seleranya mirip</strong>: &ldquo;eh, kamu suka film apa lagi?&rdquo; Item-based seperti <strong>pramuniaga yang hafal katalog</strong>: &ldquo;yang suka X biasanya juga suka Y&rdquo;. User-based personal tapi <strong>mahal dihitung</strong> (jutaan user × jutaan user); item-based lebih stabil (barang tidak berubah selera tiap hari) — itu sebabnya Amazon memakai item-based.</p>
<p><strong>Kapan dipakai:</strong> User-based untuk komunitas kecil &amp; dinamis; item-based untuk katalog besar &amp; stabil. Keduanya butuh <strong>data interaksi cukup</strong> — pengguna/item baru = <strong>cold start</strong> (tidak ada vektor = tidak ada kemiripan!).</p>
<details className="worked">
<summary>📐 Contoh 1a: Cosine similarity 3 user (klik untuk buka)</summary>
<p>Rating (skala 1–5, 0 = belum rating): film A, B, C.<br/>Andi: [5, 3, 0]. Budi: [4, 0, 5]. Cici: [5, 4, 4].</p>
<p><strong>Langkah 1 — Andi vs Cici</strong> (hanya item yang <strong>keduanya</strong> rating: A, B): pembilang = 5×5 + 3×4 = 25+12 = 37. Penyebut = √(25+9) × √(25+16) = √34 × √41 ≈ 5,83 × 6,40 ≈ 37,3. cos ≈ <strong>0,99</strong> — sangat mirip!</p>
<p><strong>Langkah 2 — Andi vs Budi</strong> (hanya A): pembilang = 5×4 = 20. Penyebut = 5 × 4 = 20. cos = <strong>1,0</strong> — sempurna?! <strong>Jebakan:</strong> hanya 1 item bersama — kemiripan dari 1 titik = <strong>tidak berarti</strong>. Aturan: butuh <strong>minimal 3–5 item bersama</strong>, atau bobot dengan significance weighting.</p>
<p><strong>Langkah 3 — Rekomendasi untuk Andi:</strong> Cici (mirip, 0,99) memberi C = 4. Prediksi Andi untuk C ≈ 4 (atau rata-rata tertimbang tetangga). → <strong>Rekomendasikan film C ke Andi.</strong></p>
<p><strong>Pelajaran:</strong> cosine = kompas, bukan vonis. Selalu cek <strong>berapa item bersama</strong> — kemiripan dari 1 item = kebetulan berpakaian statistik.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Cold start — pengguna baru (klik untuk buka)</summary>
<p>Dedi baru daftar, belum rating apa pun. Vektornya = [0,0,...,0].</p>
<p><strong>Langkah 1:</strong> cosine(Dedi, siapa pun) = 0/0 = <strong>undefined</strong>. CF tidak bisa bicara.</p>
<p><strong>Langkah 2 — Solusi:</strong> (a) <strong>onboarding</strong>: minta rating 5 film saat daftar (Netflix!); (b) <strong>fallback content-based</strong>: pakai demografi/preferensi yang dipilih; (c) <strong>popular</strong>: tampilkan terlaris <strong>sementara</strong> (dengan label jujur!).</p>
<p><strong>Pelajaran:</strong> setiap sistem rekomendasi butuh <strong>strategi cold start eksplisit</strong>. &ldquo;Nanti juga ada datanya&rdquo; = pengalaman pertama pengguna baru = buruk = mereka tidak kembali untuk memberi data. Lingkaran setan.</p>
</details>
<h3>2. Content-Based — &ldquo;Karena Kamu Suka X...&rdquo;</h3>
<p><strong>Definisi.</strong> Bangun <strong>profil item</strong> (fitur: genre, penulis, harga, kata kunci) dan <strong>profil user</strong> (rata-rata fitur item yang disukainya). Rekomendasikan item yang <strong>profilnya dekat</strong> dengan profil user.</p>
<p><strong>Kepribadian/intuisi:</strong> Jika CF seperti <strong>bertanya ke teman</strong>, content-based seperti <strong>pustakawan yang hafal seleramu</strong>: &ldquo;kamu selalu pinjam fiksi ilmiah hard-SF terbitan 90-an — ini ada yang mirip.&rdquo; Kelebihannya: <strong>menjelaskan dirinya sendiri</strong> (&ldquo;karena kamu menonton X&rdquo;) dan tidak butuh user lain. Kelemahannya: <strong>filter bubble</strong> — kamu tidak pernah dikenalkan hal di luar seleramu. Pustakawan yang terlalu patuh = penjara selera.</p>
<p><strong>Kapan dipakai:</strong> Katalog dengan metadata kaya (film, buku, berita); cold start item baru (item baru punya fitur walau belum ada rating!); saat butuh <strong>penjelasan</strong> (&ldquo;mengapa ini direkomendasikan?&rdquo;).</p>
<details className="worked">
<summary>📐 Contoh 2: Profil user dari 3 film (klik untuk buka)</summary>
<p>Fitur: [aksi, komedi, drama] (0/1). Film yang disukai Andi: F1=[1,0,0], F2=[1,1,0], F3=[1,0,1].</p>
<p><strong>Langkah 1 — Profil Andi</strong> = rata-rata: [(1+1+1)/3, (0+1+0)/3, (0+0+1)/3] = <strong>[1,0; 0,33; 0,33]</strong> → &ldquo;penggila aksi, kadang komedi/drama&rdquo;.</p>
<p><strong>Langkah 2 — Kandidat:</strong> F4=[0,1,1] (komedi-drama), F5=[1,0,0] (aksi murni).</p>
<p><strong>Langkah 3 — Cosine:</strong> profil·F4 = 1×0+0,33×1+0,33×1 = 0,66; |F4|=√2≈1,41; |profil|≈1,11 → cos ≈ 0,42. profil·F5 = 1,0; |F5|=1 → cos ≈ <strong>0,90</strong>. → <strong>F5 menang</strong>.</p>
<p><strong>Langkah 4 — Masalah:</strong> Andi <strong>tidak pernah</strong> dapat F4 (komedi-drama) — padahal mungkin ia suka! Inilah <strong>over-specialization</strong>: sistem hanya memberi &ldquo;lebih banyak yang sama&rdquo;. Obat: <strong>diversity injection</strong> — selipkan 10–20% rekomendasi di luar profil (eksplorasi!).</p>
</details>
<h3>3. Association Rules — &ldquo;Sering Dibeli Bersamaan&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Support</em> = % transaksi berisi X dan Y. <em>Confidence</em> = P(Y|X) = support(X,Y)/support(X). <em>Lift</em> = confidence / support(Y) = &ldquo;berapa kali lebih mungkin Y dibeli jika X dibeli, dibanding acak&rdquo;.</p>
<Tex math={String.raw`\text{lift}(X \to Y) = \frac{P(Y|X)}{P(Y)}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`P(Y|X)`} /> = peluang beli Y jika beli X; <Tex math={String.raw`P(Y)`} /> = peluang beli Y secara umum. Lift = 1 → tidak ada hubungan; &gt; 1 → X <strong>menarik</strong> Y; &lt; 1 → X <strong>menjauhi</strong> Y.</p>
<p><strong>Kepribadian/intuisi:</strong> Association rules seperti <strong>detektif keranjang belanja</strong>: ia tidak peduli <em>siapa</em> kamu — ia peduli <em>apa yang bareng</em>. &ldquo;Popok → Bir&rdquo; yang legendaris (ayah beli popok Jumat malam + bir untuk akhir pekan). Lift-lah yang membedakan <strong>kebetulan</strong> (&ldquo;roti &amp; susu&rdquo; — semua orang beli keduanya) dari <strong>temuan</strong> (&ldquo;popok → bir&rdquo; — tidak obvious!).</p>
<p><strong>Kapan dipakai:</strong> Cross-sell (&ldquo;lengkapi belanjamu&rdquo;), tata letak toko (fisik &amp; digital), bundling. Tidak untuk: rekomendasi personal (ia tidak kenal user!).</p>
<details className="worked">
<summary>📐 Contoh 3a: Lift membedakan temuan dari kebetulan (klik untuk buka)</summary>
<p>10.000 transaksi. Roti: 3.000. Susu: 2.500. Keduanya: 1.500. Popok: 800. Bir: 1.000. Keduanya: 400.</p>
<p><strong>Langkah 1 — Roti → Susu:</strong> confidence = 1.500/3.000 = 50%. Lift = 0,5/0,25 = <strong>2,0</strong>.</p>
<p><strong>Langkah 2 — Popok → Bir:</strong> confidence = 400/800 = 50%. Lift = 0,5/0,10 = <strong>5,0</strong>!</p>
<p><strong>Langkah 3 — Bandingkan:</strong> confidence <strong>sama</strong> (50%), tapi lift popok→bir <strong>2,5x lebih kuat</strong>. Roti-susu = &ldquo;semua orang beli&rdquo; (baseline tinggi); popok-bir = <strong>pola tersembunyi</strong> (baseline rendah, hubungan kuat).</p>
<p><strong>Pelajaran:</strong> <strong>jangan pernah</strong> pakai confidence tanpa lift. Confidence tanpa lift = &ldquo;orang yang beli roti juga beli susu&rdquo; — wow, sungguh mengejutkan (tidak).</p>
</details>
<details className="worked">
<summary>📐 Contoh 3b: Aturan palsu dari support kecil (klik untuk buka)</summary>
<p>Aturan &ldquo;Kaviar → Sampanye&rdquo;: support 0,01% (1 transaksi!), confidence 100%, lift 50. <strong>Spektakuler — dan tidak berguna.</strong></p>
<p><strong>Langkah 1:</strong> support 1 transaksi = <strong>anecdote</strong>, bukan pola.</p>
<p><strong>Langkah 2 — Aturan praktis:</strong> minimum support (mis. 0,1% atau 100 transaksi) <strong>sebelum</strong> melihat confidence/lift. Filter support dulu, baru ranking by lift.</p>
<p><strong>Pelajaran:</strong> urutan yang benar: <strong>support → confidence → lift</strong>. Lift tanpa support = astrologi berjas lab.</p>
</details>
<PlotlyChart
  data={[{x: ["Roti → Susu", "Popok → Bir", "Kaviar → Sampanye"], y: [2.0, 5.0, 50], type: "bar", marker: {color: ["#2a7de1","#e8a838","#94a3b8"]}, text: ["lift 2,0","lift 5,0","lift 50 (support 1!)"], textposition: "outside"}]}
  title={"Lift tiga aturan (waspadai yang abu-abu)"}
  layout={{yaxis: {title: "Lift"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = lift. Batang abu-abu = lift tertinggi tapi support hanya 1 transaksi.</p>
<p><strong>Interpretasi:</strong> &ldquo;Kaviar → Sampanye&rdquo; (lift 50) terlihat paling kuat — tapi ia <strong>anecdote</strong>, bukan pola. Aturan sebenarnya yang bisa dipakai: popok → bir (lift 5, support 400). <strong>Selalu baca lift berpasangan dengan support.</strong></p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Rekomendasi = tampilkan yang paling laris. Simple dan terbukti.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> &lsquo;Terlaris nasional&rsquo; sama untuk semua orang = <strong>bukan rekomendasi, itu chart musik</strong>. CTR BacaTerus 0,3% vs 4,1% setelah personalisasi. Yang terlaris berguna hanya untuk <strong>cold start</strong> sementara — dan itupun harus tersegmentasi (terlaris di genre pilihannya), bukan nasional.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Cold start tidak ada solusi — user/item baru ya tidak bisa direkomendasikan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Ada <strong>strategi per jenis</strong>: user baru → onboarding pilih genre + terlaris tersegmentasi; item baru → content-based dari fiturnya (tidak butuh rating!); keduanya baru → hybrid + eksplorasi (bandit, MK9). Widget kosong &lsquo;belum ada rekomendasi&rsquo; = menyerah sebelum bertanding.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Item-based &gt; user-based untuk katalog stabil.</strong> Selera user berubah (hari ini suka horor, tahun depan komedi), tapi kemiripan antar item awet. Matriks item-item bisa dihitung offline semalam; prediksi real-time tinggal lookup. Inilah arsitektur standar industri.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Evaluasi dengan precision@k / recall@k, bukan RMSE.</strong> User tidak peduli prediksimu 4,2 vs aktual 4,0 — ia peduli apakah 5 rekomendasi teratas ada yang diklik. RMSE mengoptimasi angka; precision@k mengoptimasi pengalaman.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Item-Based CF From-Scratch</h2>
<p>Hitung similarity antar item dari rating user, lalu rekomendasikan item untuk user target.</p>
<PyodideLab
  title={"Lab 1 — Item-Based CF"}
  hint={"Ubah rating Budi untuk Z dari 5 → 1. Lihat rekomendasi untuk Andi berubah — sensitivitas terhadap tetangga."}
  defaultCode={"import math\n# rating: {user: {item: rating}}\nR = {\"Andi\": {\"X\": 5, \"Y\": 3},\n     \"Budi\": {\"X\": 4, \"Y\": 2, \"Z\": 5},\n     \"Cici\": {\"X\": 5, \"Z\": 4}}\n\ndef cos(a, b):\n    k = set(a) & set(b)\n    if not k: return 0.0\n    dot = sum(a[i]*b[i] for i in k)\n    na = math.sqrt(sum(a[i]**2 for i in k)); nb = math.sqrt(sum(b[i]**2 for i in k))\n    return dot/(na*nb)\n\nitems = [\"X\", \"Y\", \"Z\"]\nvec = {it: {u: R[u][it] for u in R if it in R[u]} for it in items}\nprint(\"Similarity antar item:\")\nfor i in items:\n    for j in items:\n        if i < j: print(f\"  sim({i},{j}) = {cos(vec[i], vec[j]):.2f}\")\n\n# rekomendasi untuk Andi: item yg belum di-rate, skor = rata2 tertimbang similarity\ntarget, sudah = \"Andi\", set(R[\"Andi\"])\nprint(f\"\\nRekomendasi untuk {target}:\")\nfor it in items:\n    if it in sudah: continue\n    pemb = sum(cos(vec[it], vec[s]) for s in sudah)\n    skor = sum(cos(vec[it], vec[s])*R[target][s] for s in sudah)/pemb if pemb else 0\n    print(f\"  {it}: skor {skor:.2f}\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Association Rules Lite</h2>
<p>Dari daftar keranjang, hitung support, confidence, lift untuk semua pasangan — temukan aturan terbaik.</p>
<PyodideLab
  title={"Lab 2 — Apriori-lite"}
  hint={"Tambahkan item 'garam' ke semua keranjang — lihat confidence-nya tinggi tapi lift ≈ 1. Itulah jebakan confidence."}
  defaultCode={"from itertools import combinations\nkeranjang = [\n    {\"mie\",\"telur\"},{\"mie\",\"telur\",\"kopi\"},{\"mie\",\"kopi\"},\n    {\"telur\",\"kopi\"},{\"mie\",\"telur\"},{\"kopi\",\"gula\"},\n    {\"mie\",\"telur\",\"gula\"},{\"telur\"},{\"mie\",\"kopi\",\"gula\"},{\"popok\",\"bir\"},\n]\nn = len(keranjang)\ndef p(items): return sum(1 for k in keranjang if items <= k)/n\n\naturan = []\nfor a, b in combinations([\"mie\",\"telur\",\"kopi\",\"gula\",\"popok\",\"bir\"], 2):\n    for x, y in [(a,b),(b,a)]:\n        sup, conf = p({x,y}), p({x,y})/p({x}) if p({x}) else 0\n        lift = conf/p({y}) if p({y}) else 0\n        if sup >= 0.15:\n            aturan.append((lift, f\"{x} -> {y}\", sup, conf))\naturan.sort(reverse=True)\nprint(f\"{'aturan':<16}{'support':>8}{'conf':>7}  lift\")\nfor lift, r, sup, conf in aturan:\n    print(f\"{r:<16}{sup:>8.0%}{conf:>7.0%}  {lift:.2f}\")\nprint(\"\\nUrut by lift: aturan teratas = insight sejati.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Katalog stabil, butuh rekomendasi real-time → <strong>Item-based CF</strong></h3>
<p><strong>Kenapa:</strong> Kemiripan item awet; komputasi offline, serving cepat.</p>
<p><strong>Contoh nyata:</strong> E-commerce: 'sering dibeli bersamaan'.</p>
</div>
<div className="decision-card">
<h3>2. Item baru terus bermunculan / metadata kaya → <strong>Content-based / hybrid</strong></h3>
<p><strong>Kenapa:</strong> Item baru langsung punya fitur → langsung bisa direkomendasikan.</p>
<p><strong>Contoh nyata:</strong> Berita, fashion, musik.</p>
</div>
<div className="decision-card">
<h3>3. Butuh bundling / cross-sell taktis → <strong>Association rules (lift)</strong></h3>
<p><strong>Kenapa:</strong> Aturan 'X→Y' langsung jadi aksi promo/tata letak.</p>
<p><strong>Contoh nyata:</strong> Bundle mie+telur; rak berdekatan.</p>
</div>
<div className="decision-card">
<h3>4. User baru total (tidak ada histori) → <strong>Onboarding + terlaris tersegmentasi</strong></h3>
<p><strong>Kenapa:</strong> CF mati tanpa histori; jangan tampilkan widget kosong.</p>
<p><strong>Contoh nyata:</strong> Pilih 3 genre saat daftar → rekomendasi awal.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>&lsquo;Terlaris&rsquo; bukan rekomendasi</strong> (kecuali cold start sementara).</li><li><strong>Urut aturan by lift</strong>, bukan confidence.</li><li><strong>Evaluasi precision@k</strong>, bukan RMSE.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: &ldquo;Rekomendasi Terlaris&rdquo; yang Membunuh Toko Buku</h3>
<p>Toko buku online &ldquo;BacaTerus&rdquo; memasang widget &ldquo;Terlaris&rdquo; di semua halaman (buku paling laku untuk semua orang). CTR widget: <strong>0,3%</strong> — nyaris tak diklik. Mengapa? &ldquo;Terlaris&rdquo; = <strong>sama untuk semua orang</strong> = tidak relevan untuk hampir semua orang. Pembaca fiksi ilmiah tidak peduli buku self-help terlaris.</p>
<p>Diganti item-based CF (&ldquo;karena kamu melihat X&rdquo;): CTR naik ke <strong>4,1%</strong> (13x!). Lalu ditambah <strong>diversity</strong> (20% rekomendasi di luar profil): CTR turun sedikit ke 3,8% tapi <strong>kategori yang dijelajahi per user naik 2x</strong> — dan revenue/user naik 18%. <strong>Pelajaran:</strong> rekomendasi bukan soal &ldquo;klik&rdquo; — soal <strong>menemukan</strong>. Widget &ldquo;terlaris&rdquo; = kemalasan berlabel personalisasi.</p>
<h3>Kisah 2: Filter Bubble yang Membuat Pelanggan Bosan</h3>
<p>Streaming musik &ldquo;DengarKu&rdquo;: pure content-based. Pengguna &ldquo;terjebak&rdquo; di satu genre — <strong>churn naik</strong> di bulan ke-6 (&ldquo;bosan, itu-itu saja&rdquo;). Solusi: <strong>eksplorasi terstruktur</strong> — 15% slot untuk &ldquo;di luar seleramu tapi disukai orang mirip&rdquo; (CF!), dengan label jujur &ldquo;Coba sesuatu yang baru 🎲&rdquo;. Churn bulan 6+ turun 22%.</p>
<p><strong>Pelajaran:</strong> rekomendasi yang <strong>terlalu akurat</strong> = membosankan = churn. <strong>Serendipity</strong> (kejutan menyenangkan) adalah fitur, bukan bug. Sistem terbaik = 80% relevan + 20% petualangan.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Rekomendasi yang bagus = yang paling sering diklik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Klik = <strong>kepuasan sesaat</strong>. Metrik yang benar: <strong>diversity</strong> (berapa kategori dijelajahi), <strong>serendipity</strong> (temuan tak terduga yang disukai), <strong>long-term retention</strong>. Sistem yang mengoptimalkan klik murni = <strong>clickbait machine</strong> — ia memberi yang kamu klik, bukan yang kamu butuhkan. YouTube menyesalinya; jangan ulangi.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Widget 0,3% BacaTerus</h2>
<div className="callout">
<p>BacaTerus: widget &ldquo;Rekomendasi Untukmu&rdquo; = 10 terlaris nasional, CTR 0,3%. Setelah item-based CF: CTR 4,1%, 18% revenue dari widget. Data: 50.000 user, 8.000 judul, rata-rata 6 rating/user (sparse!).</p>
<p><strong>Pertanyaan:</strong> (a) Kenapa 'terlaris nasional' gagal? (b) Dengan data sparse (6 rating/user), user-based atau item-based — kenapa? (c) Satu eksperimen untuk validasi sebelum full rollout?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Tidak personal</strong> — sama untuk semua orang, tidak memakai sinyal selera. &ldquo;Rekomendasi&rdquo; tanpa personalisasi = papan iklan.</p>
<p>(b) <strong>Item-based.</strong> User dengan 6 rating → vektor user pendek &amp; tidak stabil (user-based berisik). Item dengan ratusan rating → vektor item kaya → similarity item-item lebih bisa diandalkan. Plus komputasi offline.</p>
<p>(c) <strong>A/B test</strong>: 50% user lihat CF, 50% lihat terlaris. Metrik: CTR widget + revenue per user (bukan cuma klik — waspadai clickbait). Jalan 2 minggu, cek significance (MK9).</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Cosine.</strong> User P: [4, 0, 5, 1]. User Q: [5, 2, 4, 0]. Hitung cosine (hanya item yang keduanya rating). Mirip?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>Item bersama: 1 dan 3 (Q tidak rating item 4, P tidak rating item 2).</p>
<p>Pembilang = 4×5 + 5×4 = 20+20 = 40. Penyebut = √(16+25) × √(25+16) = √41 × √41 = <strong>41</strong>. cos = 40/41 ≈ <strong>0,976</strong> — sangat mirip.</p>
<p><strong>Catatan:</strong> hanya 2 item bersama — di produksi, butuh <strong>significance weighting</strong> (mis. × 2/50 jika butuh 50). Kemiripan 0,976 dari 2 item = <strong>jangan terlalu percaya</strong>.</p>
</details>
<p><strong>Soal 2 — Lift.</strong> 50.000 transaksi. Kopi: 10.000. Gula: 8.000. Keduanya: 5.000. Hitung support, confidence (kopi→gula), lift. Temuan atau kebetulan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>Support = 5.000/50.000 = <strong>10%</strong>. Confidence = 5.000/10.000 = <strong>50%</strong>. Lift = 0,5/(8.000/50.000) = 0,5/0,16 = <strong>3,125</strong>.</p>
<p><strong>Temuan yang solid:</strong> support besar (10%!) + lift 3,1. Ini pola nyata — tata kopi &amp; gula berdekatan, atau bundel &ldquo;paket ngopi&rdquo;. (Tapi tetap: <strong>apakah actionable?</strong> Semua orang sudah tahu kopi+gula — nilai bisnisnya mungkin kecil. Lift tinggi ≠ insight berharga.)</p>
</details>
<p><strong>Soal 3 — Cold start.</strong> 3 strategi cold start untuk pengguna baru marketplace. Urutkan by effort vs impact, dan pilih untuk MVP.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) <strong>Popular sementara</strong> — effort 1 hari, impact sedang (tidak personal tapi tidak kosong). <strong>Pilih untuk MVP!</strong></p>
<p>(b) <strong>Onboarding quiz</strong> (pilih 3 kategori favorit) — effort 1 minggu, impact tinggi (langsung personal).</p>
<p>(c) <strong>Demographic-based</strong> — effort 3 hari, impact rendah-risiko (stereotip!).</p>
<p><strong>Urutan:</strong> (a) hari pertama → (b) minggu kedua → evaluasi (c) mungkin tidak perlu. <strong>Prinsip MVP:</strong> jangan biarkan sempurna menghalangi ada.</p>
</details>
<p><strong>Soal 4 — Diversity.</strong> Sistem A: CTR 5%, avg kategori/user 1,2. Sistem B: CTR 4%, avg kategori/user 3,5. Mana &ldquo;lebih baik&rdquo; untuk (a) revenue jangka pendek? (b) retention jangka panjang? Jelaskan trade-off-nya.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>(a) <strong>A</strong> — CTR lebih tinggi = lebih banyak klik sekarang = revenue iklan/afiliasi jangka pendek naik.</p>
<p>(b) <strong>B</strong> — pengguna menjelajah 3,5 kategori = <strong>terikat</strong> ke platform (switching cost naik!) = retention jangka panjang. Pengguna A (1,2 kategori) = <strong>gampang pindah</strong> saat kompetitor punya kategori itu lebih baik.</p>
<p><strong>Trade-off fundamental:</strong> eksploitasi (CTR) vs eksplorasi (retention). Perusahaan yang hanya optimasi CTR = <strong>menggadaikan masa depan untuk kuartal ini</strong>. Metrik yang benar = <strong>keduanya</strong>, dengan bobot sesuai strategi.</p>
</details>
<div className="tip">
<p><strong>💡 Empat pertanyaan sebelum membangun rekomendasi: (1) cold start-nya apa? (2) metrik sukses = klik atau retention? (3) butuh penjelasan? (4) diversity berapa %? Empat jawaban = arsitektur. Tanpa jawaban = coba-coba mahal.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. User-based vs item-based CF. Kapan item-based menang?"}
  options={
    ["Selalu",
    "Katalog stabil — kemiripan item lebih awet dari selera user",
    "User sedikit",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: selera user berubah, kemiripan item relatif awet. Item-based juga komputasinya offline-friendly. Inilah standar industri untuk e-commerce."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Aturan: support 24%, confidence 80%, P(Y)=40%. Lift dan artinya?"}
  options={
    ["0,5 — tidak terkait",
    "2,0 — Y 2x lebih mungkin dibeli bersama X",
    "80% — sangat kuat",
    "24% — lemah"]
  }
  correct={1}
  explanation={"Benar: lift = 0,8/0,4 = 2,0. Confidence 80% saja tidak cukup — harus dibagi baseline P(Y). Lift-lah yang membedakan insight dari 'kebetulan laris'."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. User baru tanpa histori. Strategi terbaik hari pertama?"}
  options={
    ["Widget kosong 'belum ada rekomendasi'",
    "Onboarding pilih minat + terlaris tersegmentasi",
    "Item-based CF langsung",
    "Tunggu 1 bulan"]
  }
  correct={1}
  explanation={"Benar: CF mati tanpa histori. Onboarding memberi sinyal awal; terlaris tersegmentasi (genre pilihannya) mengisi kekosongan. Widget kosong = peluang terbuang."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Evaluasi recommender untuk bisnis. Metrik terbaik?"}
  options={
    ["RMSE prediksi rating",
    "Precision@k / CTR / revenue per user",
    "Jumlah item",
    "Kecepatan training"]
  }
  correct={1}
  explanation={"Benar: user peduli 'apakah 5 teratas ada yang diklik', bukan error 0,2 poin rating. Optimasi metrik pengalaman, bukan metrik statistik."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Confidence 'mie → garam' 90%, lift 1,06. Kesimpulan?"}
  options={
    ["Aturan kuat — bundel!",
    "Jebakan: garam dibeli semua orang; lift ≈ 1 = tidak ada keterkaitan khusus",
    "Naikkan confidence",
    "Data salah"]
  }
  correct={1}
  explanation={"Benar: confidence tinggi karena P(garam) sudah 85%. Lift 1,06 ≈ acak. Selalu urutkan aturan by lift — confidence tanpa baseline menipu."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Membangun Rekomendasi dari Nol</h2>
<p>Marketplace &ldquo;SerbaAda&rdquo;: 500.000 pengguna, 50.000 produk, widget &ldquo;Terlaris&rdquo; (CTR 0,3%). Misi 8 minggu: sistem rekomendasi yang <strong>menaikkan revenue</strong>, bukan sekadar klik.</p>
<h3>Langkah 1 — Audit data (minggu 1)</h3>
<p>Interaksi: 2 juta view, 300.000 add-to-cart, 120.000 purchase. <strong>Sparsity</strong>: 120.000/(500.000×50.000) = <strong>0,00048%</strong> — matriks 99,9995% kosong! User-based CF murni = <strong>mustahil</strong> (tidak ada tetangga yang overlap). Keputusan: <strong>item-based + content-based hybrid</strong>.</p>
<h3>Langkah 2 — Item-based CF (minggu 2–3)</h3>
<p>Co-occurrence: untuk tiap pasang item, hitung <strong>lift</strong> (bukan sekadar count!) dari &ldquo;dibeli bersama&rdquo;. Precompute top-20 tetangga per item (50.000 × 20 = 1 juta pasang — <strong>offline, semalam</strong>). Serving: lookup O(1) — &ldquo;pengguna lihat X → tampilkan tetangga X&rdquo;. <strong>Cepat, murah, stabil.</strong></p>
<h3>Langkah 3 — Content-based untuk cold start (minggu 4)</h3>
<p>Produk baru (500/hari!): belum ada co-occurrence → fallback ke <strong>kemiripan kategori + kata kunci judul</strong>. Pengguna baru: <strong>onboarding 3 kategori</strong> → profil awal. Aturan: tidak ada &ldquo;kosong&rdquo; — selalu ada yang tampil.</p>
<h3>Langkah 4 — Diversity + bisnis rules (minggu 5)</h3>
<p>70% slot: item-based (relevan). 20%: content-based eksplorasi (kategori beda). 10%: <strong>promoted</strong> (margin tinggi / overstock!) — dengan label jujur. <strong>Filter:</strong> jangan rekomendasikan yang sudah dibeli (kecuali consumable!), jangan yang stok habis.</p>
<h3>Langkah 5 — Evaluasi offline + online (minggu 6–8)</h3>
<p>Offline: <strong>precision@10</strong> di data holdout (dari 10 rekomendasi, berapa yang benar-benar dibeli?). Online A/B: kontrol (terlaris) vs hybrid. Hasil: CTR 0,3% → <strong>3,2%</strong>; revenue/widget-view <strong>+210%</strong>; kategori per user 1,1 → 2,3.</p>
<div className="callout">
<p><strong>What:</strong> Hybrid item-based + content-based + 20% eksplorasi: CTR 10x, revenue +210%.</p>
<p><strong>So what:</strong> Kemenangan bukan dari algoritma canggih — dari <strong>menangani sparsity, cold start, dan diversity</strong> sebelum optimasi.</p>
<p><strong>Now what:</strong> (1) Tambah sinyal implisit (view duration, bukan cuma purchase). (2) Personalisasi ranking (bukan cuma kandidat). (3) Monitor <strong>filter bubble index</strong> bulanan.</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Rekomendasi</h2>
<h3>Jebakan 1: Evaluasi offline = sukses online</h3>
<p>Precision@10 offline 40% — tapi online CTR jeblok. Mengapa? Offline memakai <strong>data historis bias</strong> (hanya yang <em>ditampilkan</em> dulu yang bisa diklik!). <strong>Deteksi:</strong> offline = <strong>indikasi</strong>, bukan bukti. Bukti = A/B test online. Selalu.</p>
<h3>Jebakan 2: Feedback loop — naga yang memakan ekornya</h3>
<p>Sistem merekomendasikan X → X diklik → &ldquo;X populer&rdquo; → makin direkomendasikan. <strong>Rich get richer</strong>, item baru tidak pernah muncul. <strong>Deteksi:</strong> % impresi ke top-100 item naik terus = loop. Obat: <strong>eksplorasi wajib</strong> (epsilon-greedy!) + evaluasi dengan <strong>random exposure</strong> berkala.</p>
<h3>Jebakan 3: Tidak memfilter yang sudah dibeli</h3>
<p>Merekomendasikan TV yang <strong>baru dibeli kemarin</strong> — pengalaman memalukan. <strong>Deteksi:</strong> aturan bisnis sebelum ML: purchased → exclude (kecuali consumable/subscription!). Kedengarannya sepele — tapi 30% sistem gagal di sini.</p>
<h3>Jebakan 4: Popularity bias tanpa sadar</h3>
<p>Model &ldquo;belajar&rdquo; bahwa item populer selalu benar (karena datanya banyak) → semua orang dapat yang sama → <strong>personalisasi mati</strong>. <strong>Deteksi:</strong> distribusi rekomendasi: jika 80% user dapat 20% item yang sama = bias. Obat: <strong>penalti popularitas</strong> di scoring.</p>
<h3>Jebakan 5: Mengabaikan konteks (waktu, lokasi, perangkat)</h3>
<p>Merekomendasikan jas hujan di musim kemarau; makanan berat jam 7 pagi. <strong>Deteksi:</strong> tambahkan <strong>fitur konteks</strong> ke model — atau minimal aturan: musiman, jam, cuaca. Rekomendasi tanpa konteks = pramuniaga yang tidak lihat kalender.</p>
<h3>Jebakan 6: Privacy — &ldquo;orang sepertimu&rdquo; yang terlalu tepat</h3>
<p>&ldquo;Karena kamu membeli test kehamilan...&rdquo; — rekomendasi yang <strong>membocorkan</strong> info sensitif (kasus Target 2012!). <strong>Deteksi:</strong> blacklist kategori sensitif dari penjelasan &amp; dari fitur. <strong>Aturan:</strong> jika penjelasannya memalukan, jangan tampilkan — walau akurat.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam lapis pertahanan: evaluasi online, eksplorasi, filter bisnis, penalti popularitas, konteks, privasi. Sistem rekomendasi yang baik = 30% algoritma + 70% pertahanan.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Evaluasi Rekomendasi 1 Halaman</h2>
<div className="callout">
<p><strong>📊 Evaluasi Sistem Rekomendasi — [periode]</strong></p>
<p><strong>1. Relevansi:</strong> CTR __% | Precision@10 __% | Conversion/rekomendasi __%</p>
<p><strong>2. Bisnis:</strong> Revenue/widget-view Rp__ (+__% vs kontrol) | Margin-weighted revenue __</p>
<p><strong>3. Kesehatan:</strong> Kategori unik/user __ | % impresi top-100 __ (waspada &gt; 60%) | Cold-start coverage __%</p>
<p><strong>4. Kepuasan:</strong> &ldquo;Tidak tertarik&rdquo; rate __% | Survei NPS rekomendasi __</p>
<p><strong>5. Aksi:</strong> __ (mis. &ldquo;naikkan eksplorasi 20%→30% karena kategori/user stagnan&rdquo;)</p>
</div>
<p><strong>Cara memakai:</strong> isi bulanan. <strong>Aturan keras:</strong> tidak ada keputusan algoritma tanpa baris 2 (bisnis!) dan 3 (kesehatan!). Tim yang hanya melihat baris 1 (CTR) = <strong>mengoptimasi klik menuju kebosanan</strong>.</p>
<details className="worked">
<summary>📐 Contoh: Membaca laporan (klik untuk buka)</summary>
<p>CTR naik 3,2% → 4,0% 🎉. Tapi: kategori/user turun 2,3 → 1,5 🚨; % impresi top-100 naik ke 68% 🚨.</p>
<p><strong>Diagnosis:</strong> <strong>feedback loop!</strong> Sistem makin &ldquo;akurat&rdquo; (CTR naik) tapi makin <strong>sempit</strong> (semua dapat yang sama). Tiga bulan lagi = filter bubble penuh = churn.</p>
<p><strong>Aksi:</strong> naikkan eksplorasi, penalti popularitas, <strong>terima</strong> CTR turun sementara ke 3,5%. <strong>Pelajaran:</strong> CTR naik + diversity turun = <strong>lampu merah</strong>, bukan hijau. Inilah gunanya baris 3.</p>
</details>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Matrix factorization vs deep learning — mana?</strong><br/>A: <strong>Mulai dari yang sederhana</strong> (item-based + content-based). MF/DL memberi lift 5–15% <strong>setelah</strong> fondasi benar. 90% nilai = data + cold start + diversity — bukan arsitektur.</p>
<p><strong>Q2: Explicit (rating) vs implicit (klik/beli)?</strong><br/>A: Implicit <strong>lebih banyak</strong> tapi <strong>berisik</strong> (klik ≠ suka; tidak klik ≠ tidak suka). Trik: <strong>bobot</strong> (beli=3, cart=2, view=1) + <strong>confidence</strong> (bukan rating!). Jangan perlakukan &ldquo;tidak interaksi&rdquo; sebagai &ldquo;tidak suka&rdquo;.</p>
<p><strong>Q3: Berapa sering retrain?</strong><br/>A: <strong>Kandidat</strong> (co-occurrence): harian/mingguan. <strong>Ranking</strong>: lebih sering jika perlu. <strong>Real-time</strong> hanya untuk sesi berjalan (&ldquo;yang lihat X juga lihat...&rdquo;). Jangan over-engineering real-time untuk yang cukup harian.</p>
<p><strong>Q4: Rekomendasi untuk B2B?</strong><br/>A: Prinsip sama, <strong>konteks beda</strong>: siklus panjang, komite pembeli (bukan individu!), nilai besar. Fokus: <strong>content-based + aturan bisnis</strong> (kompatibilitas!), bukan CF murni. &ldquo;Orang sepertimu&rdquo; kurang relevan saat pembelinya tim.</p>
<p><strong>Q5: Bagaimana lawan &ldquo;filter bubble&rdquo; tanpa mengorbankan CTR?</strong><br/>A: <strong>Eksplorasi berlabel</strong> (&ldquo;Coba yang baru 🎲&rdquo;) — pengguna <strong>memaafkan</strong> rekomendasi aneh jika jujur &ldquo;ini eksplorasi&rdquo;. Dan ukur <strong>serendipity</strong>: % eksplorasi yang diklik &amp; disukai. Target: 10–20% slot.</p>
<p><strong>Q6: Satu metrik untuk CEO?</strong><br/>A: <strong>Revenue per rekomendasi-view + retention</strong>. Bukan CTR. CEO peduli uang &amp; pelanggan setia — bukan klik. Dan tunjukkan <strong>tren diversity</strong> sebagai &ldquo;asuransi masa depan&rdquo;.</p>
<p><strong>Q7: Kapan TIDAK butuh rekomendasi personal?</strong><br/>A: Katalog kecil (&lt; 100 item — kurasi manual lebih baik!), pembelian jarang &amp; mahal (mobil — butuh <strong>konsultan</strong>, bukan algoritma), atau <strong>kepercayaan</strong> lebih penting dari relevansi (obat, jasa keuangan — salah rekomendasi = bahaya!).</p>
<p><strong>Q8: Etika data — sejauh mana boleh &ldquo;mengenal&rdquo; user?</strong><br/>A: <strong>MK18!</strong> Jangan pakai data sensitif (kesehatan, agama, politik) untuk rekomendasi tanpa consent eksplisit. Sediakan <strong>&ldquo;jangan rekomendasikan ini&rdquo;</strong> + <strong>riwayat &amp; hapus</strong>. Kepercayaan = fondasi; sekali bocor, tidak kembali.</p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Tiga Rekomendasi</h2>
<h3>Kasus A: Apotek online &ldquo;SehatQ&rdquo; — rekomendasi obat</h3>
<p>50.000 produk kesehatan. User beli vitamin C. Rekomendasikan apa?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — Batasan etika dulu:</strong> <strong>jangan</strong> rekomendasikan obat keras / diagnosis. Hanya suplemen &amp; alat kesehatan umum.</p>
<p><strong>Langkah 2 — Association rules:</strong> vitamin C → vitamin D (lift 4,2), → masker (lift 2,8). <strong>Cross-sell yang masuk akal.</strong></p>
<p><strong>Langkah 3 — JANGAN content-based murni:</strong> &ldquo;karena beli vitamin C, ini 10 vitamin C lain&rdquo; = tidak berguna. <strong>Komplemen &gt; substitusi</strong> untuk consumable.</p>
<p><strong>Pelajaran:</strong> di kesehatan, <strong>aturan bisnis + etika</strong> mendahului algoritma. Rekomendasi yang &ldquo;akurat&rdquo; tapi tidak etis = bencana.</p>
</details>
<h3>Kasus B: Job portal &ldquo;KarierKu&rdquo; — rekomendasi lowongan</h3>
<p>100.000 pencari kerja, 10.000 lowongan. Cold start dua sisi!</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Dua cold start:</strong> pelamar baru (tidak ada riwayat lamar) + lowongan baru (tidak ada pelamar). CF murni <strong>gagal total</strong>.</p>
<p><strong>Langkah 2 — Content-based dua arah:</strong> profil pelamar (skill, pengalaman, lokasi) × profil lowongan (syarat, skill, lokasi) → <strong>match score</strong>. Ini = <strong>information retrieval</strong>, bukan CF!</p>
<p><strong>Langkah 3 — Feedback loop bahaya:</strong> sistem hanya merekomendasikan &ldquo;yang mirip riwayat&rdquo; → pelamar tidak pernah lihat karir <strong>baru</strong> (mis. transisi ke data). Sediakan <strong>&ldquo;jajaki karir lain&rdquo;</strong> — rekomendasi di sini = <strong>membuka pintu</strong>, bukan mengunci.</p>
<p><strong>Pelajaran:</strong> tidak semua &ldquo;rekomendasi&rdquo; = CF. Kenali <strong>jenis masalahnya</strong> (matching vs discovery) sebelum pilih algoritma.</p>
</details>
<h3>Kasus C: Warteg &ldquo;Barokah&rdquo; — rekomendasi menu</h3>
<p>Aplikasi pesan antar. 200 menu. User selalu pesan ayam goreng + es teh.</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — Jangan ganggu yang sudah bahagia:</strong> &ldquo;biasanya&rdquo; (reorder 1-klik) <strong>lebih penting</strong> dari rekomendasi! UX: tombol &ldquo;Pesan Lagi&rdquo; raksasa.</p>
<p><strong>Langkah 2 — Eksplorasi halus:</strong> di bawahnya: &ldquo;Coba: ayam bakar (mirip!)&rdquo; — <strong>satu</strong> rekomendasi, bukan 20. Konteks: jam makan siang (jangan tawarkan sarapan!).</p>
<p><strong>Langkah 3 — Association:</strong> ayam goreng → kerupuk (lift 3,5), → es jeruk (lift 2,1). &ldquo;Lengkapi&rdquo; di checkout = <strong>cross-sell alami</strong>.</p>
<p><strong>Pelajaran:</strong> rekomendasi terbaik kadang = <strong>tidak merekomendasikan</strong> (reorder!). Kenali <strong>momen</strong>: lapar + buru-buru ≠ ingin dijelajahi.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela Diversity</h2>
<p><strong>Head of Product:</strong> &ldquo;CTR turun 3,2% → 2,9% setelah kamu naikkan eksplorasi. Kembalikan seperti dulu!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;CTR turun 0,3 poin — benar. Tapi lihat: kategori/user naik 1,8 → 2,6, dan <strong>churn bulan ke-4 turun 15%</strong>. Kita menukar <strong>0,3 poin klik hari ini</strong> dengan <strong>15% pelanggan yang bertahan</strong>. CLV mereka = Rp800rb × 15% × 50.000 user = <strong>Rp6 miliar nilai</strong>. CTR 0,3 poin = Rp200jt/kuartal. <strong>Mau tukar Rp6 miliar dengan Rp200jt?</strong>&rdquo;</p>
<p><strong>Head of Product:</strong> &ldquo;...Tapi target kuartalku CTR!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Maka targetnya yang salah — bukan strateginya. Saya usulkan metrik baru: <strong>CTR × diversity index</strong>. Kamu tetap dapat target kuartal, perusahaan dapat masa depan. Saya bantu presentasi ke direksi.&rdquo;</p>
<div className="tip">
<p><strong>💡 Pelajaran karier: kamu akan selalu diminta mengorbankan jangka panjang untuk target kuartal. Senjatamu = <em>angka CLV</em> + <em>metrik pengganti yang adil</em>. Jangan hanya menolak — tawarkan cara mengukur yang benar.</strong></p>
</div>

      <h2 id="faq">❓ Tanya-Jawab Kilat</h2>
<p><strong>Q1: Berapa data minimal untuk CF?</strong><br/>A: Aturan praktis: <strong>10+ interaksi per user</strong> dan <strong>10+ interaksi per item</strong> untuk item-based yang stabil. Di bawah itu = content-based + popular. Jangan paksa CF di data tipis — ia halusinasi kemiripan.</p>
<p><strong>Q2: Implicit feedback — klik dihitung suka?</strong><br/>A: <strong>Tidak langsung.</strong> Gunakan <strong>skala confidence</strong>: beli (1,0), cart (0,7), view lama (0,4), view sekilas (0,1). Dan <strong>jangan</strong> anggap &ldquo;tidak diklik&rdquo; = tidak suka — mungkin tidak terlihat! Ini beda fundamental dengan rating eksplisit.</p>
<p><strong>Q3: Bagaimana handle barang musiman?</strong><br/>A: <strong>Time-decay</strong> pada co-occurrence (interaksi lama bobotnya turun) + <strong>konteks waktu</strong> sebagai fitur. Rekomendasi &ldquo;jaket tebal&rdquo; dari pembelian 2 tahun lalu di musim kemarau = sistem yang tidak tahu kalender.</p>
<p><strong>Q4: A/B test rekomendasi — metrik apa?</strong><br/>A: <strong>Primer:</strong> revenue/user + retention. <strong>Sekunder:</strong> CTR, diversity. <strong>Guardrail:</strong> % &ldquo;tidak tertarik&rdquo;, churn. Jangan pernah A/B hanya dengan CTR — itu mengundang clickbait.</p>
<p><strong>Q5: Kapan pakai deep learning?</strong><br/>A: Saat: (1) data <strong>masif</strong> (100jt+ interaksi), (2) sinyal <strong>sekuensial</strong> penting (&ldquo;setelah X, biasanya Y&rdquo;), (3) tim <strong>mampu</strong> maintain. Untuk 90% kasus: hybrid klasik + aturan bisnis <strong>lebih dari cukup</strong>. DL tanpa fondasi = Ferrari tanpa bensin.</p>
<p><strong>Q6: Satu kalimat inti lesson ini?</strong><br/>A: <strong>Rekomendasi = 30% algoritma kemiripan + 30% penanganan cold start + 20% diversity + 20% aturan bisnis &amp; etika.</strong> Yang hanya mengerjakan 30% pertama = membangun setengah jembatan.</p>

      <h2 id="netflix">🏆 Studi Kasus: Netflix Prize — Pelajaran Rp15 Miliar</h2>
<p>Tahun 2006, Netflix mengumumkan sayembara: <strong>$1 juta</strong> (Rp15 miliar) untuk tim yang bisa mengalahkan sistem rekomendasi mereka sebesar <strong>10%</strong> (RMSE). 5.000+ tim bertarung 3 tahun. Kisah ini = <strong>ringkasan seluruh lesson MK8</strong> dalam satu kompetisi nyata.</p>
<h3>Apa yang dimenangkan (dan bagaimana)</h3>
<p>Data: 100 juta rating, 480.000 user, 17.000 film — <strong>sparsity 99%</strong>. Pemenang (BellKor): <strong>ensemble 100+ model</strong> — matrix factorization (SVD) + neighborhood + restricted Boltzmann machines + regresi. Tidak ada <strong>satu</strong> algoritma ajaib; kemenangan = <strong>ratusan model kecil yang saling menutupi kelemahan</strong>.</p>
<p><strong>Pelajaran 1: ensemble &gt; algoritma tunggal.</strong> Model terbaik kedua (juga ensemble) kalah 0,01%. Di rekomendasi, <strong>diversity model</strong> (seperti diversity rekomendasi!) mengalahkan kecanggihan tunggal.</p>
<h3>Yang paling mengejutkan: fitur waktu</h3>
<p>Terobosan terbesar bukan dari algoritma baru — tapi dari <strong>menyadari rating berubah seiring waktu</strong>: (a) <strong>user bias bergeser</strong> (orang jadi lebih pelit/kasar memberi rating seiring tahun), (b) <strong>item popularity berubah</strong> (film yang &ldquo;bagus&rdquo; 2005 belum tentu 2009), (c) <strong>skala rating personal berubah</strong>. Model yang memasukkan <strong>time-decay</strong> melompat jauh.</p>
<p><strong>Pelajaran 2: waktu &gt; algoritma.</strong> Fitur &ldquo;kapan&rdquo; mengalahkan &ldquo;algoritma apa&rdquo;. Sama seperti di bisnis: <strong>recency</strong> adalah fitur paling diremehkan.</p>
<h3>Yang ironis: pemenang tidak pernah dipakai</h3>
<p>Netflix <strong>tidak pernah</strong> mengimplementasikan solusi pemenang! Mengapa? (a) <strong>Terlalu kompleks</strong> — 100+ model = mimpi buruk maintenance; (b) <strong>Bisnis berubah</strong> — Netflix pindah ke streaming; yang penting bukan &ldquo;prediksi rating&rdquo; tapi <strong>&ldquo;apa yang ditonton&rdquo;</strong> (implicit!); (c) <strong>RMSE ≠ bisnis</strong> — memprediksi rating 4,2 vs 4,3 tidak menaikkan retention; yang menaikkan = <strong>diversity + konteks</strong>.</p>
<p><strong>Pelajaran 3: metrik kompetisi ≠ metrik bisnis.</strong> Rp15 miliar dihabiskan untuk mengoptimasi RMSE — metrik yang <strong>tidak dipakai</strong> di produksi. <strong>Selalu tanya: &ldquo;metrik ini menggerakkan uang / retention?&rdquo;</strong> Jika tidak — kamu ikut kompetisi yang salah.</p>
<h3>Yang menyeramkan: de-anonymization</h3>
<p>Peneliti menunjukkan data &ldquo;anonim&rdquo; Netflix bisa <strong>diidentifikasi ulang</strong> dengan mencocokkan ke rating IMDb publik — hanya dari <strong>6 film + tanggal aproximasi</strong>! Netflix digugat, sayembara kedua <strong>dibatalkan</strong>.</p>
<p><strong>Pelajaran 4: anonimitas ≠ privasi.</strong> Data interaksi = <strong>sidik jari perilaku</strong>. Jangan pernah menganggap &ldquo;tanpa nama = aman&rdquo; (MK18!). Pelajaran Rp15 miliar yang paling mahal = <strong>etika</strong>.</p>
<div className="tip">
<p><strong>💡 Empat pelajaran Rp15 miliar: (1) ensemble &gt; tunggal; (2) waktu &gt; algoritma; (3) metrik bisnis &gt; metrik kompetisi; (4) privasi &gt; segalanya. Tempel di dinding tim rekomendasi-mu.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Collaborative filtering</strong>: dari orang lain — user-based ('mirip kamu') vs item-based ('mirip barangmu'); cosine similarity + weighted average.</li>
<li><strong>Content-based</strong>: dari fitur item; solusi cold start item-baru; kelemahan: filter bubble.</li>
<li><strong>Cold start</strong>: user baru → onboarding; item baru → content-based; jangan tampilkan widget kosong.</li>
<li><strong>Association rules</strong>: support (umum), confidence (andal), <strong>lift</strong> (terkait beneran) — urut by lift.</li>
<li><strong>Hybrid</strong> = standar produksi. Evaluasi dengan precision@k/CTR, bukan RMSE.</li>
<li><strong>Kapan TIDAK pakai CF</strong>: interaksi terlalu sedikit per user AND per item (keduanya sparse ekstrem) — mulai dari content-based/rules.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk7-propensity" className="btn btn-secondary btn-sm">← MK7</Link>
        <Link href="/learn/mk9-eksperimen" className="btn btn-primary btn-sm">MK9 →</Link>
      </div>
    </div>
  );
}
