"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk17TextAnalyticsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK17 — Marketing Data Analytics</span>
        <h1 className="display-title">Text Analytics:<br/>Mendengar 10.000 Ulasan Sekaligus</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Rating 2,1 yang 'Misterius'</a></li>
<li><a href="#sentimen">Sentiment Analysis</a></li>
<li><a href="#topik">Topic Modeling (LDA)</a></li>
<li><a href="#llm">LLM untuk Klasifikasi</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Memahami Kata</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Rating 2,1 AntarCepat</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#ensiklopedia">📖 Ensiklopedia Text Analytics untuk Marketing</a></li>
<li><a href="#kisahreview">📖 Kisah Nyata: 100.000 Review yang Berbicara</a></li>
<li><a href="#tambahan-tfidf">📐 Worked Example: TF-IDF</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Komentar TikTok</a></li>
<li><a href="#tambahan-faq">❓ FAQ Text Analytics</a></li>
<li><a href="#tambahan-evaluasi">🔬 Pendalaman: Evaluasi Model Teks</a></li>
<li><a href="#tambahan-kit">🧰 Kit: Pipeline 2 Minggu</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan cara kerja lexicon vs ML sentiment dan memilih yang tepat.</li>
<li>Melakukan aspect-based sentiment (bukan sekadar positif/negatif).</li>
<li>Menjelaskan intuisi LDA topic modeling dan membaca outputnya.</li>
<li>Memakai LLM untuk klasifikasi teks dengan protokol validasi.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Rating 2,1 yang 'Misterius'</h2>
      <div className="story">
        <p>Aplikasi <em>&ldquo;AntarCepat&rdquo;</em> ratingnya anjlok <strong>4,5 → 2,1</strong> dalam 2 bulan. Tim produk panik dan menebak-nebak: <em>&ldquo;mungkin UI-nya?&rdquo;</em> <em>&ldquo;mungkin kompetitor?&rdquo;</em> Tiga sprint dihabiskan untuk redesign UI — rating tetap 2,1.</p>
<p>Twist-nya: analis junior menambang <strong>12.000 ulasan</strong> dalam 1 hari. Temuannya: 68% ulasan negatif menyebut <strong>&ldquo;driver&rdquo;</strong> dan <strong>&ldquo;lama&rdquo;</strong> — bukan UI! Masalahnya operasional (kepadatan order), bukan produk. Redesign UI = mengobati yang tidak sakit. <strong>Pelanggan sudah memberi tahu masalahnya — tertulis, 12.000 kali — tapi tidak ada yang mendengar.</strong> Lesson ini: cara mendengar dalam skala besar.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="sentimen">Sentimen — Dari Kata ke Skor</h2>
<p><strong>Definisi.</strong> <strong>Sentiment analysis</strong>: klasifikasikan teks jadi positif/negatif/netral (atau skor −1 s.d. +1). <strong>Lexicon-based</strong>: kamus kata berbobot ('bagus' +2, 'buruk' −3; tangani negasi: 'tidak bagus' = −2). Cepat, transparan, tanpa training — cukup untuk Bahasa Indonesia dengan kamus yang dirawat. <strong>ML-based</strong>: latih classifier (logistic/GBM/BERT) pada teks berlabel — akurat, tapi butuh data label &amp; validasi.</p>
<p><strong>Aspect-based</strong>: sentimen <em>per aspek</em> ('driver lambat tapi aplikasi bagus' → driver: negatif, aplikasi: positif). Inilah yang actionable — sentimen global 'negatif' tidak memberi tahu apa yang diperbaiki.</p>
<Tex math={String.raw`\text{skor} = \sum_{w} \text{bobot}(w) \times \text{negasi}(w)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`w`} />: kata dalam teks (setelah normalisasi: lowercase, stemming sederhana)</li>
<li><Tex math={String.raw`\text{bobot}(w)`} />: dari lexicon ('cepat' +2, 'lama' −2, 'parah' −3)</li>
<li><Tex math={String.raw`\text{negasi}(w)`} />: −1 jika didahului 'tidak/jangan/bukan' dalam jendela 3 kata</li>
<li>Skor &gt; 0 positif, &lt; 0 negatif; magnitude = intensitas</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Lexicon seperti <strong>menghitung dengan jari</strong>: tiap kata 'bagus' +1, 'buruk' −1. Kasar tapi jujur & cepat. ML seperti <strong>membaca dengan pengalaman</strong>: paham sarkasme & konteks ('bagus banget... telat 2 jam' = negatif) — tapi butuh 'sekolah' (data label) dan bisa salah dengan percaya diri.</p>
<p><strong>Kapan dipakai:</strong> Lexicon: eksplorasi cepat, Bahasa Indonesia, butuh transparansi. ML: volume besar + butuh akurasi + ada data label. Aspect-based: selalu jika ingin aksi.</p>
<details className="worked">
<summary>📐 Contoh: Skor manual 2 ulasan (klik untuk buka)</summary>
<p>Lexicon mini — cepat +2, lama −2, bagus +2, parah −3, ramah +2.</p>
<p><strong>U1:</strong> 'driver cepat dan ramah' → +2+2 = <strong>+4 (positif)</strong>.</p>
<p><strong>U2:</strong> 'tidak cepat, lama parah' → negasi('cepat')=−2, 'lama' −2, 'parah' −3 = <strong>−7 (negatif)</strong>.</p>
<p><strong>Aspect:</strong> U2 tentang 'driver' (kata 'driver' tidak ada — jebakan! butuh NER/aspect extraction untuk tahu topiknya). Inilah batas lexicon murni: ia tahu <em>rasanya</em>, belum tentu <em>tentang apa</em>.</p>
</details>
<PlotlyChart
  data={[{x: ["Driver", "Waktu tunggu", "Aplikasi/UI", "Harga", "CS"], y: [68, 55, 12, 8, 5], type: "bar", marker: {color: ["#ef4444","#ef4444","#e8a838","#94a3b8","#94a3b8"]}, text: ["68%","55%","12%","8%","5%"], textposition: "outside"}]}
  title={"% ulasan negatif yang menyebut tiap aspek"}
  layout={{xaxis: {title: "Aspek"}, yaxis: {title: "% ulasan negatif"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = % ulasan negatif yang menyebut aspek itu (satu ulasan bisa menyebut banyak aspek).</p>
<p><strong>Interpretasi:</strong> Driver (68%) & waktu tunggu (55%) mendominasi — <strong>bukan UI (12%)</strong>. Tiga sprint redesign UI = mengobati 12% masalah. Inilah kekuatan aspect-based: ia menunjuk <em>di mana</em> darahnya, bukan cuma 'banyak darah'.</p>
</div>
<h2 id="topik">Topic Modeling — Menemukan 'Tentang Apa' Tanpa Label</h2>
<p><strong>Definisi.</strong> <strong>LDA</strong> (<em>Latent Dirichlet Allocation</em>): tiap dokumen = campuran topik; tiap topik = distribusi kata. Algoritma menemukan topik dari pola kemunculan bersama ('driver', 'lama', 'macet' sering bareng → topik 'keterlambatan'). Output: top words per topik + proporsi topik per dokumen.</p>
<p><strong>Coherence</strong> mengukur 'masuk akal tidaknya' topik (kata-kata yang memang berhubungan). Pilih jumlah topik via coherence + interpretasi manusia — topik 'bagus' = bisa diberi nama dalam 3 kata.</p>
<p><strong>Kepribadian/intuisi:</strong> LDA seperti <strong>pustakawan yang mengelompokkan 12.000 surat pembaca tanpa membacanya satu-satu</strong>: ia melihat kata-kata yang sering muncul bersama dan menumpuknya jadi 'topik'. Ia tidak tahu nama topiknya ('keterlambatan') — manusia yang memberi nama dari top words.</p>
<p><strong>Kapan dipakai:</strong> Eksplorasi awal korpus besar (apa saja yang dibicarakan?), sebelum membuat kategori manual. Bukan untuk klasifikasi presisi.</p>
<details className="worked">
<summary>📐 Contoh: 3 topik AntarCepat (klik untuk buka)</summary>
<p><strong>Topik 1:</strong> driver, lama, tunggu, macet, telat → nama: <em>'keterlambatan'</em> (45% dokumen).</p>
<p><strong>Topik 2:</strong> aplikasi, error, lemot, update, crash → <em>'bug aplikasi'</em> (25%).</p>
<p><strong>Topik 3:</strong> harga, mahal, promo, diskon, murah → <em>'harga'</em> (15%). Sisanya campur.</p>
<p><strong>Validasi:</strong> baca 20 dokumen top per topik — apakah benar tentang itu? Jika topik 1 tercampur 'makanan enak' (noise), turunkan/naikkan jumlah topik atau bersihkan preprocessing.</p>
</details>
<h2 id="llm">LLM — Asisten Baca yang Butuh Pengawas</h2>
<p><strong>Definisi.</strong> <strong>LLM untuk klasifikasi</strong>: prompt terstruktur ('klasifikasikan ulasan ini ke [driver, aplikasi, harga, lain] + sentimen; jawab JSON') → label massal tanpa training. Kekuatan: paham konteks/sarkasme Bahasa Indonesia, setup 1 jam. Kelemahan: <strong>tidak konsisten</strong> (jawaban bisa beda tiap run), <strong>halusinasi label</strong>, biaya &amp; privasi.</p>
<p><strong>Protokol validasi wajib:</strong> (1) label manual 200–500 sampel sebagai gold; (2) ukur agreement (akurasi/F1 LLM vs gold); (3) jika &lt; 85%, perbaiki prompt (few-shot examples) atau turun ke ML klasik; (4) audit berkala (drift bahasa).</p>
<p><strong>Kepribadian/intuisi:</strong> LLM seperti <strong>magang pintar tapi ceroboh</strong>: baca cepat, paham sarkasme, tapi kadang mengarang dan tidak konsisten. Kamu tidak memecatnya — kamu memberinya SOP (prompt), menguji dengan ujian (gold labels), dan memeriksa kerjanya berkala (audit).</p>
<p><strong>Kapan dipakai:</strong> Klasifikasi multi-aspek Bahasa Indonesia, kategori berubah-ubah, tanpa data label. Jangan untuk keputusan kritis tanpa validasi (medis, hukum).</p>
<details className="worked">
<summary>📐 Contoh: Protokol validasi (klik untuk buka)</summary>
<p><strong>Prompt:</strong> 'Ulasan berikut tentang aspek apa? Pilih SATU: [driver, aplikasi, harga, cs, lain]. Lalu sentimen: [positif, negatif, netral]. Jawab dengan format: aspek = ..., sentimen = .... Ulasan: "..."'</p>
<p><strong>Gold:</strong> 300 ulasan dilabel 2 manusia (agreement antar-manusia 88% — ini plafon!).</p>
<p><strong>Hasil:</strong> LLM vs gold = 82% (aspek), 90% (sentimen). <strong>Keputusan:</strong> sentimen boleh otomatis; aspek perlu few-shot (tambah 5 contoh per kategori) → naik ke 87% → lolos.</p>
<p>Aturan: <strong>LLM tidak boleh lebih dipercaya dari agreement manusia.</strong> 82% vs plafon 88% = wajar; 82% vs plafon 98% = prompt buruk.</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Memahami Kata</h2>
<p><strong>80%</strong> data = <strong>teks</strong> (review! sosmed! CS chat!). <strong>Text analytics</strong> = <strong>mengubah</strong> kata jadi <strong>angka</strong> (sentimen! topik!). <strong>LLM</strong> = <strong>revolusi</strong> (memahami <strong>konteks</strong>!). Tiga pendalaman: (1) sentimen; (2) topic modeling; (3) LLM.</p>
<h3>1. Sentimen — &ldquo;Positif atau Negatif?&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Sentimen</strong> = <strong>emosi</strong> di teks (<strong>positif</strong>! <strong>negatif</strong>! <strong>netral</strong>!). <strong>Skor</strong> −1 (sangat negatif!) sampai +1 (sangat positif!).</p>
<p><strong>Tiga pendekatan:</strong> <strong>(a) Lexicon</strong> (kamus! &ldquo;bagus&rdquo;=+1, &ldquo;jelek&rdquo;=−1! — <strong>cepat</strong>! tapi <strong>bodoh</strong>!). <strong>(b) ML</strong> (latih <strong>classifier</strong>! — <strong>lebih</strong> pintar!). <strong>(c) LLM</strong> (tanya <strong>AI</strong>! — <strong>paling</strong> pintar! <strong>mahal</strong>!).</p>
<p><strong>Kepribadian:</strong> <strong>lexicon</strong> = <strong>anak SD</strong> (hitung <strong>kata</strong> baik/buruk!). <strong>ML</strong> = <strong>anak SMA</strong> (belajar <strong>pola</strong>!). <strong>LLM</strong> = <strong>profesor</strong> (paham <strong>konteks</strong>! <strong>sarkasme</strong>!).</p>
<p><strong>Tantangan:</strong> <strong>sarkasme</strong> (&ldquo;bagus <strong>banget</strong>!&rdquo; = <strong>negatif</strong>!), <strong>negasi</strong> (&ldquo;<strong>tidak</strong> bagus&rdquo;!), <strong>campur</strong> (&ldquo;battery <strong>bagus</strong>, tapi <strong>mahal</strong>&rdquo;! — <strong>aspek</strong> beda!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Monitor</strong> brand! <strong>Prioritas</strong> CS! <strong>LLM</strong> untuk <strong>akurat</strong>, <strong>lexicon</strong> untuk <strong>cepat</strong>.</p>
<details className="worked">
<summary>📐 Contoh 1: Lexicon vs LLM (klik untuk buka)</summary>
<p><strong>Teks:</strong> &ldquo;HP ini <strong>bagus banget</strong>... <strong>kalau</strong> kamu suka <strong>ngecas 3x sehari</strong>!&rdquo;</p>
<p><strong>Lexicon:</strong> &ldquo;bagus&rdquo; (+1!) + &ldquo;banget&rdquo; (+1!) = <strong>+2</strong> (<strong>positif</strong>!). <strong>SALAH</strong>! (Ini <strong>sarkasme</strong>!)</p>
<p><strong>LLM:</strong> <strong>negatif</strong> (−0,7!). <strong>Benar</strong>! (Paham <strong>konteks</strong>! <strong>sarkasme</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>lexicon</strong> = <strong>buta</strong> konteks. <strong>LLM</strong> = <strong>melihat</strong>. <strong>Pilih</strong> sesuai <strong>butuh</strong>.</p>
</details>
<h3>2. Topic Modeling — &ldquo;Tentang Apa Mereka Bicara?&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>Topic modeling</strong> = <strong>temukan</strong> topik <strong>tersembunyi</strong> di <strong>ribuan</strong> dokumen. <strong>LDA</strong> (Latent Dirichlet Allocation!) = <strong>setiap</strong> dokumen = <strong>campuran</strong> topik! <strong>Setiap</strong> topik = <strong>campuran</strong> kata!</p>
<p><strong>Kepribadian:</strong> seperti <strong>pustakawan</strong> yang <strong>mengelompokkan</strong> 10.000 buku <strong>tanpa</strong> baca judul — by <strong>kata</strong> yang <strong>sering</strong> muncul <strong>bersama</strong>! (&ldquo;battery&rdquo; + &ldquo;cas&rdquo; + &ldquo;awet&rdquo; = <strong>topik battery</strong>!).</p>
<p><strong>Cara kerja (intuisi):</strong> <strong>(1)</strong> Tentukan <strong>K</strong> topik (mis. 5!). <strong>(2)</strong> Algoritma <strong>menebak</strong> (iterasi!). <strong>(3)</strong> <strong>Setiap</strong> topik = <strong>daftar</strong> kata (<strong>bobot</strong>!). <strong>(4)</strong> <strong>Manusia</strong> beri <strong>nama</strong> (&ldquo;ini topik <strong>battery</strong>!&rdquo;).</p>
<p><strong>Kapan dipakai:</strong> <strong>Eksplorasi</strong> (10.000 review! <strong>tentang apa</strong>?). <strong>Jangan</strong> untuk <strong>presisi</strong> (topik = <strong>kabur</strong>!). <strong>LLM</strong> sekarang <strong>lebih baik</strong> (minta &ldquo;<strong>ringkas</strong> topiknya!&rdquo;).</p>
<details className="worked">
<summary>📐 Contoh 2: LDA 3 topik (klik untuk buka)</summary>
<p><strong>1.000 review</strong> HP. <strong>LDA</strong> (K=3!):</p>
<p><strong>Topik 1:</strong> battery (0,3!), cas (0,2!), awet (0,15!), boros (0,1!) → <strong>&ldquo;Battery&rdquo;</strong>.</p>
<p><strong>Topik 2:</strong> kamera (0,35!), foto (0,25!), jernih (0,15!), blur (0,1!) → <strong>&ldquo;Kamera&rdquo;</strong>.</p>
<p><strong>Topik 3:</strong> harga (0,3!), mahal (0,2!), murah (0,15!), worth (0,1!) → <strong>&ldquo;Harga&rdquo;</strong>.</p>
<p><strong>Insight:</strong> <strong>40%</strong> review = <strong>battery</strong> (<strong>terbanyak</strong>!). <strong>Prioritas:</strong> <strong>perbaiki</strong> battery!</p>
<p><strong>Pelajaran:</strong> <strong>LDA</strong> = <strong>peta</strong> cepat. <strong>Manusia</strong> = <strong>interpreter</strong>.</p>
</details>
<h3>3. LLM — Revolusi Text Analytics</h3>
<p><strong>Definisi.</strong> <strong>LLM</strong> (Large Language Model!) = <strong>AI</strong> yang <strong>memahami</strong> &amp; <strong>menghasilkan</strong> teks. <strong>Untuk</strong> analytics: <strong>klasifikasi</strong> (sentimen! intent!), <strong>ekstraksi</strong> (nama! tanggal!), <strong>ringkasan</strong> (10.000 review → <strong>1 paragraf</strong>!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>asisten</strong> super <strong>pintar</strong> yang <strong>baca</strong> 10.000 review <strong>semalam</strong> &amp; <strong>laporkan</strong> pagi ini. <strong>Tidak</strong> perlu <strong>latih</strong> (prompt <strong>cukup</strong>!). <strong>Tapi:</strong> <strong>mahal</strong> (API!) &amp; <strong>halusinasi</strong> (ngarang!).</p>
<p><strong>Tiga pola:</strong> <strong>(a) Zero-shot</strong> (langsung <strong>tanya</strong>! — &ldquo;sentimen review ini?&rdquo;). <strong>(b) Few-shot</strong> (beri <strong>contoh</strong>! — <strong>lebih</strong> akurat!). <strong>(c) Fine-tune</strong> (latih <strong>khusus</strong>! — <strong>paling</strong> akurat! <strong>mahal</strong>!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Default</strong> untuk <strong>baru</strong>! <strong>Validasi:</strong> <strong>sampel</strong> manual (LLM <strong>tidak</strong> sempurna!). <strong>Biaya:</strong> <strong>hitung</strong> (10.000 × Rp100 = <strong>Rp1jt</strong>!).</p>
<details className="worked">
<summary>📐 Contoh 3: LLM untuk CS (klik untuk buka)</summary>
<p><strong>10.000</strong> chat CS. <strong>Prompt:</strong> &ldquo;Klasifikasikan <strong>intent</strong>: (1) komplain, (2) tanya, (3) beli. <strong>Ekstrak</strong> produk. <strong>Skor</strong> urgensi 1–5.&rdquo;</p>
<p><strong>Hasil:</strong> <strong>2.000</strong> komplain (<strong>urgensi 4–5:</strong> 200! — <strong>prioritas</strong>!). <strong>Topik:</strong> &ldquo;pengiriman <strong>lambat</strong>&rdquo; (800!). <strong>Aksi:</strong> <strong>perbaiki</strong> logistik!</p>
<p><strong>Biaya:</strong> 10.000 × Rp50 = <strong>Rp500rb</strong>. <strong>Waktu:</strong> <strong>1 jam</strong> (vs <strong>1 bulan</strong> manual!). <strong>ROI:</strong> <strong>gila</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>LLM</strong> = <strong>superpower</strong> untuk <strong>teks</strong>. <strong>Validasi</strong> + <strong>hitung</strong> biaya.</p>
</details>
<PlotlyChart
  data={[{x: ["Battery", "Kamera", "Harga", "Layanan", "Lainnya"], y: [40, 25, 20, 10, 5], type: "bar", marker: {color: ["#ef4444", "#f59e0b", "#2a7de1", "#22c55e", "#94a3b8"]}}]}
  title={"Topik review: battery dominan (40%!)"}
  layout={{yaxis: {title: "% review"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Setiap batang = <strong>topik</strong>. Tinggi = <strong>%</strong> review.</p>
<p><strong>Interpretasi:</strong> <strong>Battery</strong> = <strong>40%</strong> (<strong>terbanyak</strong>!). <strong>Prioritas:</strong> <strong>battery</strong> dulu! <strong>Jangan</strong> perbaiki <strong>kamera</strong> (25%!) sebelum <strong>battery</strong>!</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Sentimen negatif = pelanggan tidak puas. Hitung % negatif, selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 'Negatif tentang apa?' jauh lebih penting dari 'berapa % negatif'. AntarCepat: 68% negatif tentang <strong>driver</strong> — redesign UI (12%) = salah sasaran. Selalu pecah per <strong>aspek</strong>; sentimen global hanya untuk tren, bukan aksi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;LLM bisa langsung dipakai untuk klasifikasi — tidak perlu validasi, kan pintar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> LLM <strong>tidak konsisten & bisa halusinasi label</strong>. Tanpa gold labels (200–500 sampel) + metrik agreement, kamu tidak tahu ia 95% atau 55% benar. 'Pintar' ≠ 'terpercaya'. Protokol validasi = harga yang wajib dibayar.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Mulai dari yang paling sederhana yang menjawab pertanyaan.</strong> Butuh 'apa topik keluhan?' → keyword counting + LDA dulu (1 hari). Butuh klasifikasi presisi → ML/LLM (1 minggu). Jangan menembak lalat dengan meriam — dan jangan menembak gajah dengan ketapel.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Bahasa Indonesia butuh preprocessing khusus.</strong> Stemming (Sastrawi), slang ('lemot', 'mantul', 'gercep'), negasi ('nggak', 'gak', 'tidak'). Lexicon Inggris yang diterjemahkan mentah = gagal total. Rawat kamusmu seperti aset.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Lexicon Sentiment Bahasa Indonesia</h2>
<p>Skor sentimen + deteksi negasi dari kamus mini. Uji dengan ulasanmu sendiri.</p>
<PyodideLab
  title={"Lab 1 — Lexicon Sentiment ID"}
  hint={"Coba kalimat sarkas: 'bagus banget, telat 2 jam'. Lihat lexicon gagal (skor positif!) — itulah batasnya vs ML/LLM."}
  defaultCode={"# Lexicon sentiment Bahasa Indonesia (mini) + negasi\nLEX = {\"bagus\": 2, \"cepat\": 2, \"ramah\": 2, \"mantap\": 2, \"puas\": 2,\n       \"lama\": -2, \"lambat\": -2, \"buruk\": -3, \"parah\": -3, \"kecewa\": -3,\n       \"mahal\": -1, \"murah\": 1, \"error\": -2, \"lemot\": -2}\nNEGASI = {\"tidak\", \"nggak\", \"gak\", \"bukan\", \"jangan\"}\n\ndef skor(teks):\n    kata = teks.lower().split()\n    total = 0\n    for i, w in enumerate(kata):\n        if w in LEX:\n            # cek negasi dalam 2 kata sebelumnya\n            neg = any(kata[j] in NEGASI for j in range(max(0, i-2), i))\n            total += -LEX[w] if neg else LEX[w]\n    return total\n\nuji = [\n    \"driver cepat dan ramah\",\n    \"tidak cepat, lama parah\",\n    \"aplikasi lemot dan error terus\",\n    \"bagus banget, telat 2 jam\",   # sarkasme -> lexicon gagal!\n]\nfor u in uji:\n    s = skor(u)\n    print(f\"{s:+3d}  {'POS' if s>0 else 'NEG' if s<0 else 'NET'}  {u}\")\nprint(\"\\nSarkasme menipu lexicon — butuh konteks (ML/LLM).\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Ekstraksi Keyword (TF) per Aspek</h2>
<p>Hitung kata tersering di ulasan negatif — temukan topik tanpa ML.</p>
<PyodideLab
  title={"Lab 2 — Keyword Mining"}
  hint={"Tambahkan 3 ulasan tentang 'harga'. Lihat topik harga muncul — keyword counting = LDA-nya orang sibuk."}
  defaultCode={"from collections import Counter\nimport re\nulasan_negatif = [\n    \"driver lama banget nunggu 1 jam\",\n    \"driver telat parah macet katanya\",\n    \"aplikasi error tidak bisa order\",\n    \"driver lama tidak ramah\",\n    \"tunggu lama driver muter muter\",\n    \"aplikasi lemot update kemarin\",\n]\nSTOP = {\"banget\", \"tidak\", \"bisa\", \"katanya\", \"kemarin\", \"dan\", \"yang\"}\nkata = []\nfor u in ulasan_negatif:\n    kata += [w for w in re.findall(r\"[a-z]+\", u.lower()) if w not in STOP and len(w) > 3]\n\nprint(\"Kata tersering di ulasan negatif:\")\nfor w, c in Counter(kata).most_common(8):\n    print(f\"  {w:<10} {c}x\")\nprint(\"\\n'driver' + 'lama' + 'tunggu' = topik keterlambatan.\")\nprint(\"Tanpa ML apa pun, masalah utama sudah terlihat.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh jawaban hari ini: 'apa yang dikeluhkan?' → <strong>Keyword counting + lexicon</strong></h3>
<p><strong>Kenapa:</strong> 1 hari, transparan, cukup untuk prioritas.</p>
<p><strong>Contoh nyata:</strong> Kasus AntarCepat.</p>
</div>
<div className="decision-card">
<h3>2. Korpus besar, kategori belum tahu → <strong>LDA topic modeling</strong></h3>
<p><strong>Kenapa:</strong> Temukan topik tanpa label; validasi manual.</p>
<p><strong>Contoh nyata:</strong> Eksplorasi 100rb tiket CS.</p>
</div>
<div className="decision-card">
<h3>3. Butuh klasifikasi presisi, ada data label → <strong>ML klasik (logistic/GBM)</strong></h3>
<p><strong>Kenapa:</strong> Konsisten, murah, terukur.</p>
<p><strong>Contoh nyata:</strong> Routing tiket CS otomatis.</p>
</div>
<div className="decision-card">
<h3>4. Bahasa kompleks / kategori berubah-ubah, tanpa label → <strong>LLM + validasi gold</strong></h3>
<p><strong>Kenapa:</strong> Paham konteks; tapi wajib protokol validasi.</p>
<p><strong>Contoh nyata:</strong> Aspek + sentimen ulasan Bahasa Indonesia.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Aspek dulu</strong>, sentimen global kemudian.</li><li><strong>Mulai sederhana</strong> (keyword/lexicon) sebelum ML/LLM.</li><li><strong>LLM wajib divalidasi</strong> (gold labels).</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Review yang Menyelamatkan Produk</h3>
<p>Elektronik &ldquo;CanggihKu&rdquo;: rating <strong>4,5</strong> (&ldquo;bagus!&rdquo;). <strong>Tapi:</strong> <strong>penjualan</strong> turun! <strong>Text analytics:</strong> <strong>30%</strong> review <strong>negatif</strong> tentang <strong>&ldquo;after-sales&rdquo;</strong> (tidak <strong>terlihat</strong> di rating!). <strong>Aksi:</strong> <strong>perbaiki</strong> service center. <strong>Hasil:</strong> penjualan <strong>pulih</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>rating</strong> = <strong>rata-rata</strong> (menutupi <strong>masalah</strong>!). <strong>Teks</strong> = <strong>detail</strong> (menunjukkan <strong>di mana</strong>!). <strong>Baca</strong> teks!</p>
<h3>Kisah 2: LLM yang Menggantikan Survei</h3>
<p>Bank &ldquo;SetiaKu&rdquo;: <strong>survei</strong> NPS (Rp200jt/tahun!). <strong>LLM:</strong> analisis <strong>50.000</strong> chat CS (Rp2jt!). <strong>Hasil:</strong> <strong>sama</strong> akurat (<strong>korelasi</strong> 0,85!). <strong>Hemat</strong> Rp198jt!</p>
<p><strong>Pelajaran:</strong> <strong>data</strong> yang <strong>ada</strong> (chat!) = <strong>lebih murah</strong> dari <strong>data</strong> yang <strong>dibuat</strong> (survei!). <strong>LLM</strong> = <strong>menambang</strong> emas dari <strong>sampah</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;LLM = sempurna untuk teks.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>LLM</strong> = <strong>halusinasi</strong>! (<strong>ngarang</strong>!). <strong>Bias</strong>! (<strong>training data</strong>!). <strong>Mahal</strong>! <strong>Validasi</strong> sampel! <strong>Jangan</strong> percaya <strong>buta</strong>.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Rating 2,1 yang 'Misterius'</h2>
<div className="callout">
<p>AntarCepat: rating 4,5 → 2,1 dalam 2 bulan. 3 sprint redesign UI — tidak mempan. Mining 12.000 ulasan: 68% negatif menyebut driver/lama, 12% UI.</p>
<p><strong>Pertanyaan:</strong> (a) Apa kesalahan diagnosis awal? (b) Tiga aksi prioritas dari temuan? (c) Sistem monitoring agar tidak terulang?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Menebak tanpa data teks.</strong> 'Mungkin UI' = hipotesis tanpa bukti; 12.000 ulasan (bukti tertulis) tidak dibaca. Biaya: 3 sprint sia-sia.</p>
<p>(b) <strong>(1)</strong> Operasional driver: insentif ketepatan + redistribusi zona padat. <strong>(2)</strong> Komunikasi: ETA jujur di aplikasi ('driver 25 menit lagi' &gt; diam). <strong>(3)</strong> Kompensasi proaktif untuk tunggu &gt; 45 menit (voucher otomatis).</p>
<p>(c) <strong>Dashboard mingguan:</strong> % negatif per aspek (alert jika aspek naik 10 poin), topik LDA bulanan, dan 'voice of customer' 1 halaman ke leadership tiap sprint. Teks = sensor termurah perusahaan.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Lexicon.</strong> Teks: &ldquo;Produk <strong>bagus</strong>, tapi <strong>mahal</strong> dan <strong>lemot</strong>.&rdquo; Lexicon: bagus=+1, mahal=−1, lemot=−1. Skor? Masalah?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>Skor:</strong> +1 −1 −1 = <strong>−1</strong> (<strong>negatif</strong>!).</p>
<p><strong>Masalah:</strong> <strong>aspek</strong> beda! (<strong>Produk</strong>=bagus!, <strong>harga</strong>=mahal!, <strong>performa</strong>=lemot!). <strong>Skor tunggal</strong> = <strong>kehilangan</strong> info! <strong>Solusi:</strong> <strong>aspect-based</strong>!</p>
</details>
<p><strong>Soal 2 — LDA.</strong> K=5 untuk 100 dokumen. Masalah? Berapa K <strong>ideal</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Masalah:</strong> <strong>terlalu banyak</strong> topik untuk <strong>sedikit</strong> dokumen! (<strong>Overfit</strong>! topik <strong>kabur</strong>!).</p>
<p><strong>Ideal:</strong> K=2–3 (<strong>aturan:</strong> K &lt; <strong>akar</strong> dokumen!). <strong>Coba</strong> beberapa K, <strong>pilih</strong> yang <strong>interpretable</strong>!</p>
</details>
<p><strong>Soal 3 — Biaya LLM.</strong> 100.000 review × Rp100. Total? Alternatif <strong>murah</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Total:</strong> 100.000×100 = <strong>Rp10jt</strong>.</p>
<p><strong>Murah:</strong> <strong>sampel</strong> 10.000 (Rp1jt!) + <strong>ekstrapolasi</strong>! Atau <strong>lexicon</strong> (gratis!) untuk <strong>filter</strong>, LLM untuk <strong>sulit</strong>!</p>
</details>
<p><strong>Soal 4 — Validasi.</strong> LLM klasifikasi 1.000 review. Bagaimana <strong>validasi</strong>? Berapa <strong>sampel</strong>?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Validasi:</strong> <strong>manusia</strong> label <strong>100</strong> acak. <strong>Bandingkan</strong>! <strong>Akurasi</strong> &gt; 85% = <strong>OK</strong>!</p>
<p><strong>Jika</strong> &lt; 85%: <strong>perbaiki</strong> prompt (<strong>few-shot</strong>!) atau <strong>ganti</strong> model!</p>
</details>
<div className="tip">
<p><strong>💡 Tiga aturan text analytics: (1) <em>pilih</em> alat sesuai butuh (lexicon/ML/LLM!); (2) <em>validasi</em> sampel; (3) <em>hitung</em> biaya. Tiga aturan = teks yang berguna.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. 68% ulasan negatif tentang driver, 12% tentang UI. Prioritas fix?"}
  options={
    ["Redesign UI",
    "Operasional driver (ketepatan, distribusi)",
    "Turunkan harga",
    "Ganti nama aplikasi"]
  }
  correct={1}
  explanation={"Benar: aspect-based menunjuk darahnya. UI 12% = bukan prioritas. Inilah kenapa sentimen global ('negatif 40%') tidak actionable tanpa aspek."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. 'Tidak cepat, lama parah' dengan lexicon (cepat:+2, lama:−2, parah:−3). Skor?"}
  options={
    ["+2",
    "−7 (negasi membalik 'cepat')",
    "0",
    "+4"]
  }
  correct={1}
  explanation={"Benar: 'tidak' menegasikan 'cepat' (+2→−2), plus lama (−2) + parah (−3) = −7. Tanpa penanganan negasi, skornya +2−2−3 = −3 (masih negatif tapi salah magnitude)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kalimat sarkas 'bagus banget, telat 2 jam'. Kelemahan lexicon?"}
  options={
    ["Tidak ada",
    "Lexicon menghitung 'bagus' positif — butuh konteks (ML/LLM)",
    "Kata terlalu sedikit",
    "Harus pakai Inggris"]
  }
  correct={1}
  explanation={"Benar: lexicon buta konteks & sarkasme. 'Bagus' +2 mengalahkan sinyal. ML/LLM dengan konteks menang di sini — dengan harga kompleksitas."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Memakai LLM untuk klasifikasi 50rb ulasan. Langkah WAJIB pertama?"}
  options={
    ["Langsung jalankan semua",
    "Label manual 200–500 sampel sebagai gold + ukur agreement",
    "Pilih model termahal",
    "Percaya saja"]
  }
  correct={1}
  explanation={"Benar: tanpa gold, kamu tidak tahu akurasinya (bisa 55%). Agreement vs plafon manusia menentukan 'lolos/tidak'. Validasi = harga wajib."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kapan LDA lebih tepat dari klasifikasi supervised?"}
  options={
    ["Selalu",
    "Eksplorasi: kategori belum diketahui, tanpa label",
    "Butuh presisi tinggi",
    "Data kecil"]
  }
  correct={1}
  explanation={"Benar: LDA menemukan topik tanpa label — untuk 'ada apa saja di sini?'. Klasifikasi supervised untuk 'masukkan ke kategori yang sudah ada' dengan presisi."}
/>

      <h2 id="ensiklopedia">📖 Ensiklopedia Text Analytics untuk Marketing</h2>
<p><strong>Text analytics</strong> = <strong>mengubah</strong> kata jadi <strong>insight</strong>. <strong>Ensiklopedia</strong> lengkap: <strong>teknik</strong>, <strong>tools</strong>, <strong>kasus</strong>.</p>
<h3>Bab 1: Preprocessing (Persiapan!)</h3>
<p><strong>Tokenisasi:</strong> pecah <strong>kalimat</strong> jadi <strong>kata</strong>! (<strong>&ldquo;Saya suka kopi&rdquo;</strong> → [Saya, suka, kopi]!). <strong>Lowercase:</strong> &ldquo;Kopi&rdquo; = &ldquo;kopi&rdquo;! (<strong>samakan</strong>!). <strong>Stopwords:</strong> hapus <strong>&ldquo;yang&rdquo;</strong>, <strong>&ldquo;dan&rdquo;</strong>! (<strong>tidak</strong> bermakna!). <strong>Stemming:</strong> &ldquo;berlari&rdquo; → &ldquo;lari&rdquo;! (<strong>akar</strong> kata!).</p>
<p><strong>Contoh:</strong> <strong>&ldquo;Saya SUKA kopi yang MANIS!&rdquo;</strong> → tokenisasi → [Saya, SUKA, kopi, yang, MANIS] → lowercase → [saya, suka, kopi, yang, manis] → stopwords → [suka, kopi, manis] → <strong>siap</strong>!</p>
<p><strong>Bahasa Indonesia:</strong> <strong>Sastrawi</strong>! (<strong>stemmer</strong>!). <strong>Tantangan:</strong> <strong>bahasa</strong> gaul! (<strong>&ldquo;wkwk&rdquo;</strong>! <strong>&ldquo;anjay&rdquo;</strong>!). <strong>Solusi:</strong> <strong>kamus</strong> slang!</p>
<h3>Bab 2: Representasi (Kata → Angka!)</h3>
<p><strong>Bag-of-Words:</strong> hitung <strong>frekuensi</strong>! (<strong>sederhana</strong>! tapi <strong>bodoh</strong>!). <strong>TF-IDF:</strong> <strong>bobot</strong> by <strong>penting</strong>! (<strong>&ldquo;kopi&rdquo;</strong> di <strong>review kopi</strong> = <strong>tidak</strong> penting! <strong>&ldquo;pahit&rdquo;</strong> = <strong>penting</strong>!). <strong>Embeddings:</strong> <strong>vektor</strong> makna! (<strong>&ldquo;raja&rdquo;</strong> − <strong>&ldquo;pria&rdquo;</strong> + <strong>&ldquo;wanita&rdquo;</strong> = <strong>&ldquo;ratu&rdquo;</strong>!).</p>
<p><strong>Contoh TF-IDF:</strong> <strong>Dokumen:</strong> &ldquo;kopi pahit&rdquo;, &ldquo;kopi manis&rdquo;, &ldquo;teh manis&rdquo;. <strong>&ldquo;kopi&rdquo;</strong> muncul 2/3 = <strong>tidak</strong> unik (IDF <strong>rendah</strong>!). <strong>&ldquo;pahit&rdquo;</strong> muncul 1/3 = <strong>unik</strong> (IDF <strong>tinggi</strong>!).</p>
<h3>Bab 3: Aplikasi Marketing</h3>
<p><strong>1. Sentimen:</strong> <strong>monitor</strong> brand! <strong>2. Topik:</strong> <strong>temukan</strong> isu! <strong>3. Intent:</strong> <strong>klasifikasi</strong> kebutuhan! <strong>4. Entitas:</strong> <strong>ekstrak</strong> nama! <strong>5. Ringkasan:</strong> <strong>padatkan</strong> info!</p>
<p><strong>Contoh:</strong> <strong>10.000</strong> tweet → <strong>sentimen</strong> (60% positif!), <strong>topik</strong> (battery! harga!), <strong>intent</strong> (30% komplain!), <strong>ringkasan</strong> (&ldquo;pelanggan <strong>suka</strong> kamera tapi <strong>keluhkan</strong> battery&rdquo;!).</p>
<h3>Bab 4: Tools</h3>
<p><strong>Python:</strong> <strong>NLTK</strong>! <strong>spaCy</strong>! <strong>Transformers</strong>! <strong>Indonesia:</strong> <strong>Sastrawi</strong>! <strong>IndoBERT</strong>! <strong>API:</strong> <strong>OpenAI</strong>! <strong>Google</strong>!</p>
<p><strong>Pilih:</strong> <strong>cepat</strong> = lexicon! <strong>akurat</strong> = LLM! <strong>murah</strong> = ML!</p>
<div className="tip">
<p><strong>💡 <em>Empat bab</em> = <em>fondasi</em> text analytics. <em>Praktikkan</em>!</strong></p>
</div>

      <h2 id="kisahreview">📖 Kisah Nyata: 100.000 Review yang Berbicara</h2>
<p>Di sebuah perusahaan elektronik besar di Jakarta, manajer produk, Ibu Dewi, merasa frustrasi. &ldquo;Rating produk kita 4,3 dari 5,&rdquo; katanya. &ldquo;Bagus, kan? Tapi kenapa penjualan turun? Kenapa banyak komplain?&rdquo;</p>
<p>Kamu, sang analis data, diminta untuk menyelidiki. Kamu tahu bahwa rating hanyalah angka rata-rata yang menyembunyikan banyak hal. Kamu perlu membaca apa yang sebenarnya dikatakan pelanggan — dari 100.000 review yang ada!</p>
<p>&ldquo;100.000 review? Tidak mungkin dibaca manual!&rdquo; kata Ibu Dewi. Kamu tersenyum. &ldquo;Tidak perlu manual, Bu. Kita pakai text analytics dari MK17.&rdquo;</p>
<p>Langkah pertama yang kamu lakukan adalah analisis sentimen. Kamu menggunakan LLM untuk mengklasifikasikan setiap review sebagai positif, negatif, atau netral. Hasilnya mengejutkan: meskipun rating rata-rata 4,3, ternyata 35% review bersifat negatif! Bagaimana mungkin?</p>
<p>Kamu menyelidiki lebih dalam. Ternyata, banyak pelanggan memberikan rating 4 atau 5 bintang tetapi menulis keluhan di teks! &ldquo;Produk bagus, tapi pengiriman lama banget!&rdquo; (rating 4!). &ldquo;Kualitas oke, tapi CS susah dihubungi!&rdquo; (rating 5!). Rating tidak mencerminkan teks!</p>
<p>Langkah kedua adalah topic modeling. Kamu menggunakan LDA untuk menemukan topik utama dari 100.000 review. Hasilnya: Topik 1 adalah &ldquo;pengiriman&rdquo; (30%!), Topik 2 adalah &ldquo;kualitas produk&rdquo; (25%!), Topik 3 adalah &ldquo;harga&rdquo; (20%!), Topik 4 adalah &ldquo;CS&rdquo; (15%!), sisanya 10%.</p>
<p>Yang menarik: sentimen untuk &ldquo;kualitas produk&rdquo; sangat positif (80%!), tetapi sentimen untuk &ldquo;pengiriman&rdquo; sangat negatif (70%!), dan sentimen untuk &ldquo;CS&rdquo; juga negatif (65%!). Masalahnya bukan pada produk, tetapi pada layanan!</p>
<p>Langkah ketiga adalah analisis aspek. Kamu memisahkan sentimen per aspek. Untuk aspek &ldquo;baterai&rdquo;: 60% positif, 40% negatif. Untuk aspek &ldquo;kamera&rdquo;: 85% positif, 15% negatif. Untuk aspek &ldquo;pengiriman&rdquo;: 20% positif, 80% negatif! Jelas sekali di mana masalahnya.</p>
<p>Kamu kemudian membuat ringkasan eksekutif menggunakan LLM. Dari 100.000 review, LLM menghasilkan satu paragraf: &ldquo;Pelanggan sangat puas dengan kualitas produk, terutama kamera dan desain. Namun, mereka sangat kecewa dengan pengiriman yang lambat dan customer service yang sulit dihubungi. Banyak yang mengancam akan pindah ke kompetitor jika tidak diperbaiki.&rdquo;</p>
<p>Ibu Dewi terkejut. &ldquo;Jadi selama ini kita fokus pada produk yang sudah bagus, sementara yang bermasalah adalah logistik?&rdquo; Kamu mengangguk. &ldquo;Tepat sekali, Bu. Rating 4,3 menutupi masalah yang sebenarnya.&rdquo;</p>
<p>Perusahaan kemudian mengambil tindakan. Mereka mengganti partner logistik. Mereka menambah staf CS. Mereka membuat sistem tracking yang lebih baik. Enam bulan kemudian, sentimen untuk &ldquo;pengiriman&rdquo; naik dari 20% positif menjadi 70% positif! Penjualan pun pulih.</p>
<p>Ibu Dewi memanggilmu. &ldquo;Terima kasih,&rdquo; katanya. &ldquo;Kamu mendengarkan 100.000 suara yang tidak bisa kami dengar. Kamu menyelamatkan brand kita.&rdquo;</p>
<div className="callout">
<p><strong>What:</strong> 100.000 review → sentimen! topik! aspek! Masalah: bukan produk (bagus!), tapi pengiriman & CS (buruk!). Perbaiki → penjualan pulih.</p>
<p><strong>So what:</strong> <strong>Rating</strong> = <strong>menipu</strong>. <strong>Teks</strong> = <strong>kebenaran</strong>. <strong>Text analytics</strong> = <strong>mendengarkan</strong> dalam skala besar.</p>
<p><strong>Now what:</strong> (1) <strong>Jangan</strong> percaya rating! (2) <strong>Baca</strong> teks! (3) <strong>Analisis</strong> per aspek! (4) <strong>Bertindak</strong>!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-tfidf">📐 Worked Example: TF-IDF Dihitung Tangan — Kenapa &ldquo;Bagus&rdquo; Tidak Informatif</h2>
<p>TF-IDF menjawab: <strong>kata apa yang <em>khas</em> untuk dokumen ini</strong> (bukan sekadar sering muncul). Tiga ulasan singkat produk kopi:</p>
<ul>
<li><strong>D1:</strong> &ldquo;kopi enak banget, aromanya wangi&rdquo;</li>
<li><strong>D2:</strong> &ldquo;kopi pahit, tidak enak&rdquo;</li>
<li><strong>D3:</strong> &ldquo;pengiriman cepat, kopi enak&rdquo;</li>
</ul>
<details className="worked">
<summary>📐 Perhitungan TF-IDF kata &ldquo;enak&rdquo; vs &ldquo;wangi&rdquo; di D1 (klik untuk buka)</summary>
<p><strong>Langkah 0 — Rumus.</strong> <Tex math={String.raw`\text{TF-IDF}(t,d) = \text{TF}(t,d) \times \log\frac{N}{\text{DF}(t)}`} />. TF = frekuensi kata di dokumen / total kata dokumen. DF = jumlah dokumen yang mengandung kata. N = 3.</p>
<p><strong>Langkah 1 — Kata &ldquo;enak&rdquo; di D1.</strong> TF = 1/5 = 0,20 (muncul 1x dari 5 kata). DF = 3 (ada di D1, D2, D3). IDF = log(3/3) = log(1) = <strong>0</strong>. TF-IDF = 0,20 × 0 = <strong>0</strong>.</p>
<p><strong>Langkah 2 — Kata &ldquo;wangi&rdquo; di D1.</strong> TF = 1/5 = 0,20. DF = 1 (hanya di D1). IDF = log(3/1) = log(3) ≈ <strong>1,10</strong> (log natural). TF-IDF = 0,20 × 1,10 = <strong>0,22</strong>.</p>
<p><strong>Langkah 3 — Baca hasilnya.</strong> &ldquo;Enak&rdquo; muncul di <strong>semua</strong> dokumen → IDF = 0 → <strong>tidak informatif sama sekali</strong> untuk membedakan dokumen! &ldquo;Wangi&rdquo; hanya di D1 → skor 0,22 → <strong>khas</strong>. Inilah kenapa analisis keyword mentah (&ldquo;kata tersering = enak&rdquo;) menyesatkan: kata tersering justru yang <strong>paling tidak membedakan</strong>.</p>
<p><strong>Langkah 4 — Kata &ldquo;pahit&rdquo; di D2.</strong> TF = 1/4 = 0,25. DF = 1. IDF = 1,10. TF-IDF = <strong>0,275</strong> — tertinggi! &ldquo;Pahit&rdquo; adalah kata <strong>paling diagnostik</strong>: ia menandai tepat satu dokumen (D2, ulasan negatif). Untuk tim produk, inilah sinyal emas: bukan &ldquo;enak&rdquo; (semua bilang), melainkan &ldquo;pahit&rdquo; (yang membedakan keluhan).</p>
<p><strong>Langkah 5 — Implikasi praktis.</strong> (a) <strong>Stopword bahasa Indonesia</strong> (&ldquo;yang&rdquo;, &ldquo;dan&rdquo;, &ldquo;banget&rdquo;) harus dibuang <em>sebelum</em> TF-IDF — kalau tidak, mereka mendominasi TF. (b) Untuk <strong>aspek</strong> (rasa? pengiriman? harga?), TF-IDF per kelompok ulasan (positif vs negatif) menemukan kata pembeda tiap kelompok — jauh lebih berguna dari word cloud global. (c) TF-IDF buta <strong>konteks</strong>: &ldquo;tidak enak&rdquo; dihitung sebagai &ldquo;tidak&rdquo; + &ldquo;enak&rdquo; — untuk negasi, butuh bigram (&ldquo;tidak_enak&rdquo;) atau model yang paham urutan.</p>
</details>
<h3>Lima intuisi TF-IDF untuk analis marketing</h3>
<ul>
<li><strong>Frekuensi ≠ pentingnya.</strong> Kata tersering = paling generik. Cari yang <em>khas</em>, bukan yang <em>sering</em>.</li>
<li><strong>IDF = &ldquo;kelangkaan informatif&rdquo;.</strong> Kata yang muncul di 1% dokumen 100x lebih informatif dari kata di 90% dokumen.</li>
<li><strong>Bandingkan antar-kelompok, bukan global.</strong> TF-IDF (ulasan 1★) vs TF-IDF (ulasan 5★) = peta keluhan vs pujian.</li>
<li><strong>Bahasa Indonesia butuh preprocessing khusus:</strong> stemming (&ldquo;enak&rdquo;/&ldquo;keenakan&rdquo;), slang (&ldquo;w&rdquo; = &ldquo;gue&rdquo;?), typo (&ldquo;bgus&rdquo;). Tanpa ini, &ldquo;bagus&rdquo; terpecah jadi 5 kata berbeda.</li>
<li><strong>TF-IDF = baseline yang harus dikalahkan.</strong> Sebelum deploy LLM mahal, coba TF-IDF + regresi logistik — sering akurasinya 80–85% dengan biaya 1%.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: TF-IDF adalah <em>detektor keunikan</em> — ia membungkam kata-kata yang &ldquo;berteriak di mana-mana&rdquo; dan mengeraskan yang &ldquo;berbisik di satu tempat&rdquo;. Dalam 100.000 ulasan, yang berbisik itulah yang mengubah produk.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Komentar TikTok &ldquo;GlowLokal&rdquo; — 50.000 Komentar, 1 Keputusan Produk</h2>
<p><em>GlowLokal</em> (nama disamarkan): brand skincare lokal, 1 produk hero (serum vitamin C). Tim marketing tenggelam dalam 50.000 komentar TikTok/bulan — &ldquo;rame sih, tapi rame <em>tentang apa</em>?&rdquo; Kamu diminta mengubah kebisingan jadi keputusan.</p>
<h3>Langkah 1 — Pipeline 1 minggu</h3>
<p><strong>Kumpulkan:</strong> 50.000 komentar via API TikTok (3 bulan). <strong>Bersihkan:</strong> buang emoji-only, spam (&ldquo;cek keranjang kuning&rdquo; dari afiliator!), duplikat. Tersisa 38.000. <strong>Preprocess Indonesia:</strong> normalisasi slang (kamus 800 entri: &ldquo;w&rdquo;→saya, &ldquo;bgus&rdquo;→bagus, &ldquo;ngefek&rdquo;→berefek), stemming Sastrawi, bigram untuk negasi (&ldquo;tidak_cocok&rdquo;).</p>
<h3>Langkah 2 — Tiga analisis, tiga temuan</h3>
<p><strong>Sentimen per aspek</strong> (bukan global!): kemasan 78% positif, <strong>tekstur 41% negatif</strong> (&ldquo;lengket&rdquo;, &ldquo;perih&rdquo;), harga 65% positif (&ldquo;murah&rdquo;), hasil 55% positif. Sentimen global 68% positif <strong>menyembunyikan</strong> masalah tekstur — angka agregat = kebohongan yang nyaman.</p>
<p><strong>TF-IDF per kelompok:</strong> kata paling khas komentar negatif = &ldquo;lengket&rdquo; (0,41), &ldquo;perih&rdquo; (0,38), &ldquo;bruntusan&rdquo; (0,33). Kata paling khas positif = &ldquo;cerah&rdquo; (0,35), &ldquo;murah&rdquo; (0,31). Peta masalahnya <strong>spesifik</strong>: bukan &ldquo;produk jelek&rdquo;, melainkan &ldquo;formulasi terlalu lengket untuk kulit berminyak&rdquo;.</p>
<p><strong>Topic modeling (LDA, 8 topik):</strong> topik terbesar (22%) = &ldquo;cara pakai&rdquo; (&ldquo;dipakai kapan?&rdquo;, &ldquo;boleh campur retinol?&rdquo;) — <strong>bukan keluhan, melainkan kebingungan</strong>! Peluang konten edukasi yang belum digarap.</p>
<h3>Langkah 3 — Keputusan &amp; hasil</h3>
<p><strong>Keputusan 1 (produk):</strong> reformulasi tekstur — versi &ldquo;light&rdquo; untuk kulit berminyak. Biaya R&amp;D Rp180 juta. Hasil: keluhan &ldquo;lengket&rdquo; turun 64% dalam 2 kuartal; varian light = 35% revenue dalam 1 tahun.</p>
<p><strong>Keputusan 2 (konten):</strong> seri &ldquo;cara pakai&rdquo; (menjawab topik 22%) — engagement 3x lipat dari konten promo, dan komentar &ldquo;bingung&rdquo; turun 41%.</p>
<p><strong>Keputusan 3 (yang TIDAK diambil):</strong> menurunkan harga — sentimen harga sudah positif; masalahnya bukan harga. Tanpa analisis aspek, tim hampir memberi diskon untuk masalah yang sebenarnya soal <strong>formulasi</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Social listening = hitung sentimen positif vs negatif.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Sentimen global = termometer (panas/dingin). Yang menyembuhkan = <strong>diagnosis aspek</strong> (di mana tepatnya sakit + kata-kata khasnya + topik yang muncul). Perusahaan yang berhenti di &ldquo;68% positif&rdquo; akan merayakan sambil kehilangan pelanggan kulit berminyak satu per satu.</p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Text Analytics</h2>
<h3>1. &ldquo;Lexicon vs machine learning vs LLM — pilih mana untuk sentimen?&rdquo;</h3>
<p><strong>Lexicon</strong> (kamus kata ±): cepat, transparan, tanpa training — cukup untuk <strong>monitoring tren</strong> (&ldquo;sentimen minggu ini naik/turun?&rdquo;). <strong>ML klasik</strong> (TF-IDF + logreg): butuh 2–5 ribu label, akurasi 80–88% — cukup untuk <strong>klasifikasi operasional</strong> (routing komplain). <strong>LLM</strong>: tanpa training, paham sarkasme &amp; konteks, akurasi 88–95% — untuk <strong>analisis mendalam</strong> (kenapa sentimen turun?). Aturan: mulai dari yang termurah; naik level hanya jika error-nya <em>material</em> bagi keputusan.</p>
<h3>2. &ldquo;Bagaimana handle sarkasme (&lsquo;bagus banget, rusak dalam 2 hari&rsquo;)?&rdquo;</h3>
<p><strong>Lexicon gagal total</strong> di sini (&ldquo;bagus banget&rdquo; = positif!). ML klasik gagal sebagian. Hanya <strong>model kontekstual</strong> (LLM/transformer) yang andal — karena ia membaca <em>kalimat</em>, bukan kata. Praktik: jika sarkasme &gt; 5% di datamu (cek sampel 200!), jangan pakai lexicon untuk keputusan — pakai untuk <em>tren</em> saja, dan analisis mendalam pakai LLM di sampel.</p>
<h3>3. &ldquo;Berapa banyak data label yang dibutuhkan?&rdquo;</h3>
<p>Untuk ML klasik: <strong>2.000–5.000</strong> label seimbang per kategori — di bawah 1.000, model menghafal bukan belajar. Untuk fine-tuning transformer: 5.000–20.000. Untuk LLM zero-shot: <strong>0</strong> — tapi validasi di 300–500 sampel berlabel untuk tahu akurasinya <em>di datamu</em> (jangan percaya benchmark umum!). Tips hemat: <strong>active learning</strong> — label 500, latih, label 500 yang paling membingungkan model, ulangi.</p>
<h3>4. &ldquo;Bahasa Indonesia campur Inggris (&lsquo;packaging-nya bagus banget&rsquo;) — masalah?&rdquo;</h3>
<p><strong>Code-mixing</strong> = 30–50% teks sosmed Indonesia. Lexicon Inggris gagal (&ldquo;packaging-nya&rdquo; tidak ada di kamus), lexicon Indonesia gagal (&ldquo;packaging&rdquo; tidak ada). Solusi: <strong>normalisasi + model multilingual</strong> (IndoBERT, XLM-R) atau LLM — keduanya paham campuran. Jangan terjemahkan dulu (informasi hilang); proses apa adanya.</p>
<h3>5. &ldquo;Topic modeling LDA vs clustering embedding — mana?&rdquo;</h3>
<p><strong>LDA</strong>: klasik, cepat, topik = distribusi kata — bagus untuk eksplorasi awal &amp; laporan (&ldquo;topik 3 = kata: harga, murah, diskon&rdquo;). <strong>BERTopic</strong> (clustering embedding): topik lebih koheren &amp; manusiawi, tapi butuh GPU/embedding model. Praktik: LDA untuk <strong>scan cepat</strong> 100.000 dokumen; BERTopic untuk <strong>deep-dive</strong> 10.000 dokumen penting. Keduanya butuh <strong>interpretasi manusia</strong> — &ldquo;topik 3&rdquo; tidak berarti apa-apa sampai kamu menamainya.</p>
<h3>6. &ldquo;Analisis teks untuk bahasa daerah (Jawa, Sunda)?&rdquo;</h3>
<p><strong>Lexicon formal gagal.</strong> 40%+ komentar dari Jawa Tengah/Yogyakarta campur bahasa Jawa (&ldquo;apik tenan&rdquo;). Solusi praktis: (a) <strong>LLM</strong> — cukup paham bahasa daerah umum; (b) <strong>kamus slang daerah</strong> (200–500 entri cukup untuk 80% kasus); (c) jangan abaikan — sentimen daerah sering <strong>berbeda</strong> dari Jakarta (ekspektasi &amp; daya beli beda). Analisis &ldquo;nasional&rdquo; yang hanya paham bahasa Jakarta = bias ibu kota.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: text analytics = <em>mendengarkan dalam skala besar</em>. Aturannya sama dengan mendengarkan manusia: jangan dengar kata per kata (lexicon buta konteks), dengar <em>maksudnya</em> (aspek, topik, sarkasme) — dan selalu verifikasi dengan membaca sampelnya sendiri. Model yang tidak pernah dibaca sampelnya = gosip yang dipercaya.</strong></p>
</div>

            <h2 id="tambahan-evaluasi">🔬 Pendalaman: Mengevaluasi Model Teks dengan Jujur — Akurasi 92% yang Menipu</h2>
<p>Vendor mengklaim &ldquo;model sentimen kami akurasi 92%&rdquo;. Sebelum percaya, tanyakan <strong>lima hal</strong> — karena di text analytics, angka evaluasi adalah tempat kebohongan paling rapi bersembunyi.</p>
<h3>1. Akurasi di data yang <em>seimbang</em> vs data nyata yang <em>jomplang</em></h3>
<p>Contoh: 1.000 ulasan, 900 positif, 100 negatif. Model &ldquo;selalu tebak positif&rdquo; → akurasi <strong>90%</strong> — tanpa belajar apa pun! Tapi <strong>recall negatif = 0%</strong>: semua komplain lolos. Untuk monitoring komplain, model 90% ini = <strong>sampah</strong>. Selalu minta <strong>confusion matrix</strong> per kelas, bukan satu angka akurasi. Metrik yang jujur untuk data jomplang: <strong>F1 per kelas</strong> atau <strong>balanced accuracy</strong>.</p>
<h3>2. Evaluasi di <em>waktu</em> yang salah</h3>
<p>Model dilatih &amp; dites di data Januari–Juni, dipakai di Desember — bahasa berubah! (&ldquo;skibidi&rdquo; muncul, makna &ldquo;spill&rdquo; bergeser.) Praktik benar: <strong>evaluasi temporal</strong> — latih di masa lalu, tes di masa depan (yang belum dilihat model). Jika akurasi turun &gt; 5 poin → butuh <strong>retraining berkala</strong>. Model teks = ikan: segar 3–6 bulan, lalu basi.</p>
<h3>3. Label emas yang ternyata perunggu</h3>
<p>Akurasi diukur terhadap <strong>label manusia</strong> — tapi seberapa sepakat manusianya? Ukur <strong>inter-annotator agreement</strong> (Cohen&rsquo;s kappa): jika dua annotator sepakat hanya 75% (kappa ~0,5), maka &ldquo;akurasi 92%&rdquo; terhadap label yang berisik = <strong>92% meniru kebisingan</strong>. Aturan: model tidak bisa (dan tidak seharusnya) jauh melampaui kesepakatan manusia. Klaim 95% dengan kappa 0,6 = overfitting ke annotator spesifik.</p>
<h3>4. Error yang <em>murah</em> vs error yang <em>mahal</em></h3>
<p>Tidak semua salah klasifikasi sama biayanya:</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Jenis error</th><th>Contoh</th><th>Biaya bisnis</th></tr></thead>
<tbody>
<tr><td>Positif → Negatif (false alarm)</td><td>Pujian dibaca sebagai komplain</td><td>Rendah (tiket salah routing)</td></tr>
<tr><td>Negatif → Positif (miss)</td><td>Ancaman viral dibaca &ldquo;netral&rdquo;</td><td><strong>Tinggi</strong> (krisis tidak terdeteksi)</td></tr>
<tr><td>Netral → Negatif</td><td>Pertanyaan dibaca komplain</td><td>Sedang (CS overload)</td></tr>
</tbody>
</table>
</div>
<p>Evaluasi yang jujur memakai <strong>cost-weighted metrics</strong>: miss pada komplain berat = 10x bobot false alarm. Minta vendor menunjukkan <strong>contoh error</strong> (50 sampel salah) — pola error-nya (sarkasme? negasi? slang daerah?) lebih informatif dari angkanya.</p>
<h3>5. Benchmark umum vs <em>datamu</em></h3>
<p>&ldquo;Model kami 94% di dataset IMDb&rdquo; = tidak relevan untuk komentar TikTok skincare Indonesia (bahasa, domain, panjang teks beda total). <strong>Satu-satunya benchmark yang sah: 300–500 sampel <em>berlabel dari datamu sendiri</em>.</strong> Minta vendor/API dievaluasi di sampelmu <em>sebelum</em> kontrak. Praktik ini menghemat 90% kekecewaan — dan memisahkan vendor serius dari penjual angka.</p>
<details className="worked">
<summary>📐 Worked example: Membaca confusion matrix vendor (klik untuk buka)</summary>
<p>Vendor klaim &ldquo;akurasi 91%&rdquo;. Kamu minta matrix (500 sampel: 400 positif, 70 negatif, 30 netral):</p>
<ul>
<li>Positif: 380 benar, 15 dibaca netral, 5 dibaca negatif</li>
<li>Negatif: 45 benar, <strong>20 dibaca positif (miss!)</strong>, 5 dibaca netral</li>
<li>Netral: 20 benar, 10 dibaca positif</li>
</ul>
<p><strong>Langkah 1 — Akurasi global:</strong> (380+45+20)/500 = 445/500 = <strong>89%</strong> (bukan 91% — sudah beda!).</p>
<p><strong>Langkah 2 — Recall negatif:</strong> 45/70 = <strong>64%</strong> — 36% komplain <strong>tidak terdeteksi</strong>. Untuk use case &ldquo;deteksi krisis&rdquo;, ini gagal.</p>
<p><strong>Langkah 3 — Precision negatif:</strong> 45/(45+5+0) = 45/50 = <strong>90%</strong> — saat model bilang negatif, ia benar 90% (bagus).</p>
<p><strong>Langkah 4 — Keputusan:</strong> model ini <strong>konservatif</strong> (jarang bilang negatif, tapi kalau bilang biasanya benar). Cocok untuk <strong>alerting</strong> (sedikit false alarm), <strong>tidak cocok</strong> untuk <strong>pengukuran volume komplain</strong> (undercount 36%). Satu model, dua vonis — tergantung pertanyaan bisnismu.</p>
<p><strong>Pelajaran:</strong> jangan tanya &ldquo;berapa akurasinya?&rdquo; — tanya <strong>&ldquo;berapa recall untuk kelas yang penting bagiku, dan berapa biayanya saat salah?&rdquo;</strong></p>
</details>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: evaluasi model teks = <em>audit</em>, bukan <em>penobatan</em>. Cari di mana ia berbohong (kelas minoritas, waktu baru, bahasa daerah), ukur biaya kebohongannya, lalu putuskan: apakah kebohongan ini bisa kuterima untuk keputusan ini? Analis yang tidak bisa menjawab = belum boleh deploy.</strong></p>
</div>

            <h2 id="tambahan-kit">🧰 Kit Kerja: Membangun Pipeline Text Analytics dalam 2 Minggu</h2>
<p>Template untuk analis yang diminta &ldquo;tolong analisis 100.000 ulasan/komentar&rdquo; minggu depan. Realistis: 1 analis, tools gratis.</p>
<h3>Minggu 1 — Fondasi (hari 1–5)</h3>
<p><strong>Hari 1 — Definisikan pertanyaan.</strong> Bukan &ldquo;analisis sentimen&rdquo; (terlalu umum), melainkan: &ldquo;aspek apa yang paling dikeluhkan?&rdquo; + &ldquo;apakah keluhan X naik 3 bulan terakhir?&rdquo; Tulis 3 pertanyaan spesifik — semua langkah berikutnya mengabdi ke sini.</p>
<p><strong>Hari 2 — Kumpulkan &amp; audit sampel.</strong> Ambil 200 sampel acak, <strong>baca manual</strong>. Catat: bahasa apa? (formal/slang/daerah), panjang? (komen 5 kata vs ulasan 200 kata = teknik beda), spam? (&ldquo;cek keranjang kuning&rdquo;), sarkasme? Hasil bacaan ini menentukan <em>semua</em> pilihan teknik — jangan skip.</p>
<p><strong>Hari 3 — Preprocessing.</strong> Pipeline minimal bahasa Indonesia: lowercase → normalisasi slang (kamus 300–800 entri, kumpulkan dari sampel hari 2) → buang emoji-only &amp; duplikat → stemming (Sastrawi) → bigram untuk negasi. <strong>Simpan teks asli</strong> berdampingan — preprocessing untuk mesin, teks asli untuk dibaca manusia.</p>
<p><strong>Hari 4 — Baseline cepat.</strong> Lexicon sentimen (InSet/Kamusal) + TF-IDF per kelompok. Target hari 4: <strong>satu grafik tren sentimen + 10 kata khas per kelompok</strong>. Ini sudah 70% nilai proyek untuk kebanyakan stakeholder — sisanya penyempurnaan.</p>
<p><strong>Hari 5 — Validasi baseline.</strong> Label 200 sampel manual, bandingkan dengan output lexicon. Jika akurasi &lt; 70% atau recall kelas penting &lt; 60% → naik ke ML/LLM (minggu 2). Jika cukup → fokus ke <strong>analisis</strong>, bukan model.</p>
<h3>Minggu 2 — Pendalaman (hari 6–10)</h3>
<p><strong>Hari 6–7 — Aspek &amp; topik.</strong> Sentimen per aspek (aturan keyword: &ldquo;lengket&rdquo;→tekstur, &ldquo;lama&rdquo;→pengiriman) + LDA/BERTopic 8–12 topik. Beri <strong>nama manusiawi</strong> tiap topik — &ldquo;topik 4&rdquo; tidak boleh muncul di laporan.</p>
<p><strong>Hari 8 — LLM untuk sampel kritis.</strong> Ambil 1.000 komentar paling ambigu/penting → analisis LLM (ekstrak: aspek, sentimen, urgensi, saran). Biaya: ~Rp50–150rb via API — murah untuk kedalaman ini.</p>
<p><strong>Hari 9 — Dashboard &amp; tren.</strong> Satu halaman: tren sentimen/bulan, top-5 keluhan (dengan contoh kutipan asli!), top-3 pujian, alert kata baru yang naik daun. <strong>Kutipan asli</strong> = yang membuat direksi <em>merasakan</em> data — jangan sajikan hanya angka.</p>
<p><strong>Hari 10 — Rekomendasi.</strong> Tiap temuan → 1 rekomendasi → 1 pemilik → 1 estimasi dampak. &ldquo;Keluhan lengket naik 40% → reformulasi (R&amp;D) → potensi selamatkan 15% churn.&rdquo; Tanpa ini, analisismu = <strong>hiburan</strong>, bukan <strong>keputusan</strong>.</p>
<div className="callout">
<h3>🧭 Checklist kualitas (sebelum presentasi)</h3>
<ol><li>Sudah baca minimal 200 sampel manual? (tidak → kembali hari 2)</li><li>Ada confusion matrix / validasi di sampel berlabel? (tidak → angkamu klaim kosong)</li><li>Setiap grafik punya <strong>kutipan asli</strong> pendukung? (tidak → tambahkan)</li><li>Setiap temuan punya rekomendasi + pemilik? (tidak → bukan laporan, ini esai)</li><li>Sudah cek bias bahasa daerah / code-mixing? (tidak → catat sebagai keterbatasan)</li></ol>
</div>
<div className="tip">
<p><strong>💡 Prinsip 2 minggu ini: <em>bertahap &amp; jujur</em>. Baseline hari ke-4 yang divalidasi mengalahkan model canggih hari ke-14 yang tidak sempat divalidasi. Dan ingat — tujuanmu bukan &ldquo;model terbaik&rdquo;, melainkan <strong>keputusan terbaik yang bisa diambil dari teks</strong>.</strong></p>
<p><strong>Setelah 2 minggu — apa selanjutnya?</strong> Pipeline ini bukan proyek sekali jalan. Jadwalkan <strong>ritme</strong>: dashboard tren mingguan (otomatis), deep-dive aspek bulanan (analis, 4 jam), dan <strong>re-validasi model tiap kuartal</strong> (bahasa berubah — model basi). Tiga bulan pertama, catat setiap keputusan yang diambil dari pipeline ini beserta hasilnya: &ldquo;reformulasi tekstur → keluhan turun 64%&rdquo;. Katalog kemenangan ini = <strong>bukti ROI</strong> text analytics — yang akan melindungimu saat ada yang bertanya &ldquo;ngapain sih analisis komentar?&rdquo;. Analis teks yang tidak mencatat dampaknya akan selalu dianggap cost center; yang mencatat = profit center.</p>
<p><strong>Jebakan terakhir:</strong> jangan biarkan pipeline ini menjadi &ldquo;milik&rdquo; satu orang. Dokumentasikan kamus slang, aturan aspek, dan definisi metrik di satu halaman wiki — karena saat kamu cuti/resign, pipeline tanpa dokumentasi = mati dalam 2 bulan. Text analytics yang bertahan = <strong>sistem</strong>, bukan <strong>orang</strong>.</p>
<p>Dan satu metrik pamungkas untuk pipeline-mu: <strong>% temuan yang menjadi keputusan</strong>. Jika dari 20 temuan kuartal ini hanya 2 yang dieksekusi, masalahnya bukan analisismu — melainkan <strong>jembatan ke pengambil keputusan</strong> (format laporan? bahasa? timing?). Analis teks terbaik yang pernah ada bukan yang modelnya paling akurat, melainkan yang laporannya paling sering dibaca sampai halaman terakhir.</p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Sentiment</strong>: lexicon (cepat, transparan) vs ML (akurat, butuh label); tangani negasi & slang Indonesia.</li>
<li><strong>Aspect-based</strong>: sentimen per aspek = yang actionable; sentimen global hanya tren.</li>
<li><strong>LDA</strong>: temukan topik tanpa label dari kemunculan bersama; validasi manual + coherence.</li>
<li><strong>LLM</strong>: magang pintar tapi ceroboh — prompt + gold labels (200–500) + audit berkala.</li>
<li><strong>Mulai sederhana</strong>: keyword counting sering cukup untuk 'apa masalahnya?'.</li>
<li><strong>Kapan TIDAK text mining</strong>: volume kecil (&lt; 200 teks) — baca manual saja, lebih akurat.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk16-digital-ads" className="btn btn-secondary btn-sm">← MK16</Link>
        <Link href="/learn/mk18-etika" className="btn btn-primary btn-sm">MK18 →</Link>
      </div>
    </div>
  );
}
