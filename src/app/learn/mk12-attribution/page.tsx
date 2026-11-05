"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk12AttributionPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK12 — Marketing Data Analytics</span>
        <h1 className="display-title">Attribution:<br/>Bagi Kredit dengan Adil</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Perang Budget antara Tim Search dan Tim Sosmed</a></li>
<li><a href="#rule">Rule-Based Attribution</a></li>
<li><a href="#markov">Markov Chains</a></li>
<li><a href="#shapley">Shapley Value</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Keadilan Atribusi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Perang Budget GadgetKu</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Atribusi yang Mengubah Alokasi Rp12 Miliar</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Atribusi</a></li>
<li><a href="#extra3">📋 Playbook: Pilih Model Atribusi 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#cookieless">🎯 Studi Kasus Lanjutan: Multi-Touch di Era Cookieless</a></li>
<li><a href="#framework">📈 Framework Pengambilan Keputusan Atribusi</a></li>
<li><a href="#kisah">📖 Kisah Nyata: Perang Atribusi di Startup Unicorn</a></li>
<li><a href="#tambahan-shapley">📐 Worked Example: Shapley 3 Channel</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: Ritel MajuJaya</a></li>
<li><a href="#tambahan-faq">❓ FAQ Atribusi</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menghitung kredit per channel dengan 5 model rule-based dan menjelaskan bias masing-masing.</li>
<li>Menjelaskan intuisi Markov removal effect untuk atribusi.</li>
<li>Menjelaskan kenapa Shapley value dianggap 'adil' (aksioma game theory).</li>
<li>Memilih model atribusi sesuai pertanyaan bisnis + menjelaskan keterbatasannya.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Perang Budget antara Tim Search dan Tim Sosmed</h2>
      <div className="story">
        <p>Di <em>&ldquo;GadgetKu&rdquo;</em>, tim Search dan tim Sosmed perang setiap kuartal. Dashboard <strong>last-click</strong>: Search &ldquo;menghasilkan&rdquo; Rp8M, Sosmed Rp1M. Tim Sosmed protes: <em>&ldquo;Tanpa video kami, tidak ada yang search brand kalian!&rdquo;</em> Direksi memotong budget Sosmed 70%. Kuartal berikutnya, Search <strong>anjlok</strong> 40%.</p>
<p>Twist-nya: last-click memberi <strong>semua kredit ke penutup</strong> dan nol ke pembuka — seperti memberi seluruh gaji ke striker dan nol ke gelandang yang memberi assist. Sosmed memang tidak &ldquo;menutup&rdquo;, tapi ia <strong>membuka</strong> 60% perjalanan. Model yang salah bukan cuma tidak adil — ia <strong>menghancurkan mesinnya sendiri</strong> (potong pembuka → penutup kelaparan). Lesson ini: matematika berbagi kredit.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="rule">Rule-Based — Aturan Main yang Sederhana (dan Biasnya)</h2>
<p><strong>Definisi.</strong> Model <strong>rule-based</strong> membagi kredit 1 conversion ke touchpoint dengan aturan tetap: <strong>first-click</strong> (100% ke pertama — menghargai pembuka), <strong>last-click</strong> (100% ke terakhir — menghargai penutup), <strong>linear</strong> (rata ke semua), <strong>time-decay</strong> (makin dekat conversion makin besar), <strong>position-based</strong> (40% pertama + 40% terakhir + 20% tengah).</p>
<p>Setiap aturan punya <strong>bias</strong>: first-click meremehkan penutup, last-click meremehkan pembuka (kasus GadgetKu), linear menyamakan peran yang beda, time-decay menghukum awareness. Tidak ada yang &ldquo;benar&rdquo; — semuanya heuristik.</p>
<p><strong>Kepribadian/intuisi:</strong> Rule-based seperti <strong>aturan bagi warisan yang kaku</strong>: 'anak sulung dapat semua' (first-click), 'anak bungsu dapat semua' (last-click), 'bagi rata' (linear). Sederhana & transparan — tapi tidak ada yang bertanya siapa yang sebenarnya merawat orang tua (kontribusi nyata).</p>
<p><strong>Kapan dipakai:</strong> Butuh angka cepat, transparan, dan semua stakeholder paham. Jangan untuk keputusan budget besar (biasnya mahal).</p>
<details className="worked">
<summary>📐 Contoh: Satu journey, lima angka beda (klik untuk buka)</summary>
<p>Journey: Sosmed → Email → Search → Beli (Rp1jt).</p>
<p><strong>First-click:</strong> Sosmed Rp1jt, lainnya 0. <strong>Last-click:</strong> Search Rp1jt. <strong>Linear:</strong> masing-masing Rp333rb. <strong>Time-decay:</strong> Search 500rb, Email 300rb, Sosmed 200rb. <strong>Position-based:</strong> Sosmed 400rb, Search 400rb, Email 200rb.</p>
<p><strong>Satu journey, lima &lsquo;kebenaran&rsquo;.</strong> Tim Search (last-click) vs tim Sosmed (first-click) = perang yang tidak akan selesai — karena premisnya (&ldquo;satu model benar&rdquo;) salah.</p>
</details>
<PlotlyChart
  data={[{x: ["Sosmed", "Email", "Search"], y: [0, 0, 8], name: "Last-click", type: "bar", marker: {color: "#e8a838"}}, {x: ["Sosmed", "Email", "Search"], y: [6, 0, 2], name: "First-click", type: "bar", marker: {color: "#2a7de1"}}]}
  title={"Kredit per channel (Rp jt): last-click vs first-click"}
  layout={{barmode: "group", yaxis: {title: "Kredit (Rp jt)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua kelompok batang per channel: kuning = last-click, biru = first-click. Bandingkan siapa 'menang' di tiap model.</p>
<p><strong>Interpretasi:</strong> Last-click: Search 8jt vs Sosmed 0. First-click: Sosmed 6jt vs Search 2jt. <strong>Model menentukan pemenang, bukan data.</strong> Inilah kenapa perang budget GadgetKu tidak akan selesai dengan rule-based — butuh model yang melihat <em>peran</em> tiap channel (Markov/Shapley).</p>
</div>
<h2 id="markov">Markov — 'Bagaimana Jika Channel Ini Hilang?'</h2>
<p><strong>Definisi.</strong> Model <strong>Markov</strong> melihat journey sebagai rantai: peluang pindah dari touchpoint A ke B (matriks transisi, termasuk ke <em>conversion</em> dan <em>null</em>/keluar). <strong>Removal effect</strong> channel C = berapa % conversion hilang jika C <em>dihapus</em> dari semua journey. Kredit ∝ removal effect (dinormalisasi).</p>
<p>Keunggulan: <strong>data-driven</strong> (bukan aturan kaku) dan menghargai peran <em>perantara</em> (Email di contoh: removal effect-nya nyata walau tidak pernah first/last). Kelemahan: butuh data journey lengkap; asumsi Markov (masa depan hanya tergantung sekarang) penyederhanaan.</p>
<Tex math={String.raw`\text{RemovalEffect}(C) = 1 - \frac{P(\text{conv} \mid \text{tanpa } C)}{P(\text{conv})}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`P(\text{conv})`} />: peluang conversion dengan semua channel</li>
<li><Tex math={String.raw`P(\text{conv} \mid \text{tanpa } C)`} />: peluang conversion jika channel C dihapus dari graf</li>
<li>Removal effect 0,3 = menghilangkan C menurunkan conversion 30% — itulah 'jasa' C</li>
<li>Kredit akhir = removal effect dinormalisasi (jumlah = 1)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Removal effect seperti <strong>&lsquo;uji copot&rsquo; di bengkel</strong>: mau tahu fungsi busi? Copot businya, lihat mesin masih hidup tidak. Channel yang kalau 'dicopot' conversion anjlok = channel penting — <em>terlepas</em> dari posisinya (pembuka/penutup).</p>
<p><strong>Kapan dipakai:</strong> Punya data path-to-conversion lengkap dan butuh pembagian yang data-driven tapi masih bisa dijelaskan ('kalau email hilang, conversion turun X%').</p>
<details className="worked">
<summary>📐 Contoh: Removal effect Email (klik untuk buka)</summary>
<p>Journey GadgetKu (disederhanakan): 1.000 journey mulai di Sosmed: 600 → Email → 400 → Search → 300 conversion; 400 langsung Search → 200 conversion. P(conv) = 500/1.000 = 50%.</p>
<p><strong>Tanpa Email:</strong> 600 yang tadinya via Email kini: 300 → Search → 150 conversion (asumsi 50% tetap lanjut). Total conversion = 150 + 200 = 350 → P = 35%.</p>
<p><strong>Removal effect Email</strong> = 1 − 35/50 = <strong>30%</strong>. Email 'berjasa' 30% conversion — padahal di first/last-click ia dapat NOL (tidak pernah pertama/terakhir). Inilah yang tidak terlihat rule-based.</p>
</details>
<h2 id="shapley">Shapley — Matematika Keadilan</h2>
<p><strong>Definisi.</strong> <strong>Shapley value</strong> (teori permainan kooperatif, Nobel 2012 untuk Lloyd Shapley): bagi kredit berdasarkan <strong>kontribusi marginal rata-rata</strong> channel di semua urutan kedatangan yang mungkin. Aksioma: efisien (total terbagi habis), simetris (peran sama → kredit sama), dummy (tidak berkontribusi → nol), aditif.</p>
<p>Intuisi: untuk tiap urutan (Sosmed→Email→Search, Email→Sosmed→Search, …), hitung tambahan conversion saat channel <em>bergabung</em>; rata-ratakan. Channel yang selalu menambah banyak saat bergabung = kredit besar — <strong>terlepas posisi</strong>.</p>
<Tex math={String.raw`\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(|N|-|S|-1)!}{|N|!} \big[ v(S \cup \{i\}) - v(S) \big]`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\phi_i`} />: kredit Shapley channel i</li>
<li><Tex math={String.raw`v(S)`} />: conversion yang dihasilkan koalisi channel S</li>
<li><Tex math={String.raw`v(S \cup \{i\}) - v(S)`} />: kontribusi marginal i saat bergabung ke S</li>
<li>Bobot = peluang urutan itu terjadi — rata-rata atas semua kemungkinan urutan kedatangan</li>
<li>Praktis: untuk channel banyak, pakai aproksimasi (sampling urutan), bukan eksak</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Shapley seperti <strong>membagi tip band</strong>: bukan 'vokalis dapat semua' (last-click) atau 'bagi rata' (linear), tapi 'berapa penonton tambahan saat gitaris ini gabung, dirata-rata atas semua formasi band yang mungkin'. Adil secara aksioma — tapi komputasinya mahal (faktorial!).</p>
<p><strong>Kapan dipakai:</strong> Butuh pembagian yang bisa dipertahankan secara prinsip ('adil'), channel ≤ 8 (atau pakai aproksimasi), dan stakeholder paham konsepnya. Sering jadi 'model kedua' untuk validasi.</p>
<details className="worked">
<summary>📐 Contoh: Shapley 2 channel (klik untuk buka)</summary>
<p>Channel A (Sosmed), B (Search). v(kosong) = 0, v(hanya A) = 20, v(hanya B) = 50, v(A dan B) = 100.</p>
<p><strong>Urutan A→B:</strong> A bergabung: 20−0=20; B bergabung: 100−20=80. <strong>Urutan B→A:</strong> B: 50−0=50; A: 100−50=50.</p>
<p><strong>Shapley:</strong> A = (20+50)/2 = <strong>35</strong>; B = (80+50)/2 = <strong>65</strong>. Total 100 ✓.</p>
<p>Bandingin: last-click (jika B selalu terakhir) memberi B=100, A=0. Shapley mengakui A membuka jalan (35) — adil dan data-driven.</p>
</details>
<PlotlyChart
  data={[{x: ["Last-click", "First-click", "Linear", "Markov", "Shapley"], y: [0, 6, 2.7, 3.5, 3.2], type: "bar", marker: {color: ["#e8a838","#2a7de1","#94a3b8","#16a34a","#2a7de1"]}, text: ["0","6","2,7","3,5","3,2"], textposition: "outside"}]}
  title={"Kredit Sosmed (Rp jt) menurut 5 model"}
  layout={{yaxis: {title: "Kredit Sosmed (Rp jt)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = kredit yang diterima Sosmed menurut tiap model. Rentang 0–6jt untuk channel yang sama!</p>
<p><strong>Interpretasi:</strong> Sosmed dapat <strong>0</strong> (last-click) hingga <strong>6jt</strong> (first-click) — Markov (3,5) & Shapley (3,2) sepakat di tengah. Pelajaran: <strong>jangan pernah pakai satu model</strong>. Laporkan 2–3 model (satu rule-based + satu data-driven); jika ketiganya sepakat Sosmed penting, barulah potong/naikkan budget dengan percaya diri.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Keadilan Atribusi</h2>
<p>Atribusi = <strong>membagi kredit</strong> Rp1 miliar revenue ke channel yang &ldquo;berjasa&rdquo;. Tapi <strong>apa itu &ldquo;berjasa&rdquo;?</strong> Yang <strong>pertama</strong> dikenalkan? Yang <strong>terakhir</strong> diklik? Yang <strong>jika hilang</strong> merusak? Tiga definisi = <strong>tiga matematika</strong> = <strong>tiga jawaban beda</strong>. Empat pendalaman.</p>
<h3>1. Rule-Based — Aturan Sederhana, Bias Tersembunyi</h3>
<p><strong>Lima aturan:</strong> <strong>First-click</strong> (100% ke pertama!), <strong>Last-click</strong> (100% ke terakhir!), <strong>Linear</strong> (bagi rata!), <strong>Time-decay</strong> (makin dekat beli, makin besar!), <strong>Position-based</strong> (40% pertama + 40% terakhir + 20% tengah!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>pembagian warisan</strong> tanpa wasiat — <strong>aturan adat</strong> yang <strong>sederhana</strong> tapi <strong>tidak adil</strong> untuk kasus khusus. <strong>Last-click</strong> = &ldquo;anak bungsu dapat semua&rdquo; (yang <strong>terakhir</strong> datang!). <strong>First-click</strong> = &ldquo;anak sulung dapat semua&rdquo;. <strong>Linear</strong> = &ldquo;bagi rata&rdquo; (padahal <strong>kontribusi beda</strong>!).</p>
<p><strong>Bias masing-masing:</strong> <strong>Last-click</strong> → <strong>overvalue</strong> branded search &amp; retargeting (yang <strong>selalu</strong> terakhir!). <strong>First-click</strong> → <strong>overvalue</strong> display &amp; sosmed (yang <strong>selalu</strong> pertama!). <strong>Linear</strong> → <strong>menghukum</strong> yang <strong>efisien</strong> (1 sentuhan cukup!) &amp; <strong>menghadiahi</strong> yang <strong>berisik</strong> (banyak sentuhan!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Operasional</strong> harian (cepat! sederhana!). <strong>Jangan</strong> untuk <strong>keputusan budget</strong> (bias!). <strong>Jika terpaksa:</strong> <strong>time-decay</strong> (paling &ldquo;masuk akal&rdquo;!) atau <strong>position-based</strong>.</p>
<details className="worked">
<summary>📐 Contoh 1a: Lima aturan, lima jawaban (klik untuk buka)</summary>
<p>Journey: Display → Sosmed → Search → Beli (Rp1jt).</p>
<p><strong>First-click:</strong> Display Rp1jt, lainnya Rp0.</p>
<p><strong>Last-click:</strong> Search Rp1jt, lainnya Rp0.</p>
<p><strong>Linear:</strong> masing-masing Rp333rb.</p>
<p><strong>Time-decay</strong> (0,5^jarak): Search 0,5^0=1, Sosmed 0,5^1=0,5, Display 0,5^2=0,25. Total 1,75. Search = 1/1,75×1jt = <strong>Rp571rb</strong>. Sosmed = <strong>Rp286rb</strong>. Display = <strong>Rp143rb</strong>.</p>
<p><strong>Position-based</strong> (40/20/40): Display <strong>Rp400rb</strong>, Sosmed <strong>Rp200rb</strong>, Search <strong>Rp400rb</strong>.</p>
<p><strong>Lima jawaban</strong> dari <strong>data sama</strong>! <strong>Mana &ldquo;benar&rdquo;?</strong> <strong>Tidak ada</strong> — semua = <strong>asumsi</strong>! <strong>Pelajaran:</strong> <strong>pilih</strong> aturan = <strong>pilih</strong> bias. <strong>Sadarilah</strong> pilihanmu.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Bias last-click dalam angka (klik untuk buka)</summary>
<p>100 pembeli. <strong>80</strong> journey berakhir di <strong>branded search</strong> (mereka <strong>cari</strong> brand setelah lihat iklan!). <strong>20</strong> berakhir di sosmed.</p>
<p><strong>Last-click:</strong> branded = Rp80jt, sosmed = Rp20jt (dari Rp100jt!). <strong>&ldquo;Branded 4x lebih baik!&rdquo;</strong></p>
<p><strong>Kebenaran</strong> (holdout!): matikan branded → revenue turun <strong>Rp10jt</strong> (bukan Rp80jt!). Matikan sosmed → turun <strong>Rp30jt</strong>!</p>
<p><strong>Last-click salah 8x</strong> untuk branded! <strong>Sosmed</strong> (yang &ldquo;kalah&rdquo;) sebenarnya <strong>3x lebih penting</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>last-click</strong> = <strong>juara</strong> untuk <strong>panen</strong> (branded!), <strong>pecundang</strong> untuk <strong>kebenaran</strong>. <strong>Jangan</strong> alokasi budget by last-click!</p>
</details>
<h3>2. Markov — &ldquo;Bagaimana Jika Channel Ini Hilang?&rdquo;</h3>
<p><strong>Definisi.</strong> Model journey sebagai <strong>rantai Markov</strong>: state = channel, transisi = peluang pindah. <strong>Removal effect</strong> = &ldquo;berapa conversion <strong>hilang</strong> jika channel X <strong>dihapus</strong> dari graf?&rdquo;</p>
<p><strong>Kepribadian:</strong> seperti <strong>simulasi &ldquo;bagaimana jika jembatan ini runtuh?&rdquo;</strong> — <strong>hapus</strong> satu channel, <strong>lihat</strong> berapa trafik <strong>tidak sampai</strong> tujuan. Channel yang <strong>jika hilang</strong> merusak = <strong>penting</strong> (walau <strong>tidak</strong> last-click!).</p>
<p><strong>Cara kerja:</strong> (1) bangun <strong>matriks transisi</strong> dari data journey. (2) Hitung <strong>P(conversion)</strong> dari awal. (3) <strong>Hapus</strong> channel X (alihkan transisinya!). (4) Hitung <strong>P(conversion) baru</strong>. (5) <strong>Selisih</strong> = removal effect X.</p>
<p><strong>Kapan dipakai:</strong> <strong>Lebih baik</strong> dari rule-based (data-driven!). <strong>Tapi:</strong> masih <strong>observasional</strong> (bukan kausal!), <strong>asumsi Markov</strong> (tidak ada memori! — <strong>salah</strong> untuk journey panjang!).</p>
<Tex math={String.raw`\text{Removal}(X) = P(\text{conv}) - P(\text{conv} | \text{tanpa } X)`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`P(\text{conv})`} /> = peluang conversion <strong>normal</strong>; <Tex math={String.raw`P(\text{conv} | \text{tanpa } X)`} /> = peluang jika X <strong>dihapus</strong>. <strong>Selisih</strong> = &ldquo;kontribusi&rdquo; X.</p>
<details className="worked">
<summary>📐 Contoh 2: Removal effect 3 channel (klik untuk buka)</summary>
<p>Journey: Start → Display (0,6) / Sosmed (0,4). Display → Search (0,5) / Beli (0,1) / Keluar (0,4). Sosmed → Search (0,3) / Beli (0,2) / Keluar (0,5). Search → Beli (0,8) / Keluar (0,2).</p>
<p><strong>Langkah 1 — P(conv) normal:</strong> via Display: 0,6×(0,5×0,8 + 0,1) = 0,6×0,5 = 0,30. Via Sosmed: 0,4×(0,3×0,8 + 0,2) = 0,4×0,44 = 0,176. Total = <strong>0,476</strong>.</p>
<p><strong>Langkah 2 — Hapus Search:</strong> Display → Beli (0,1) saja. Sosmed → Beli (0,2) saja. P = 0,6×0,1 + 0,4×0,2 = 0,06+0,08 = <strong>0,14</strong>. Removal(Search) = 0,476−0,14 = <strong>0,336</strong>!</p>
<p><strong>Langkah 3 — Hapus Display:</strong> hanya via Sosmed: 0,176. Removal(Display) = 0,476−0,176 = <strong>0,30</strong>.</p>
<p><strong>Langkah 4 — Hapus Sosmed:</strong> hanya via Display: 0,30. Removal(Sosmed) = 0,476−0,30 = <strong>0,176</strong>.</p>
<p><strong>Ranking:</strong> Search (0,336) &gt; Display (0,30) &gt; Sosmed (0,176). <strong>Beda</strong> dari last-click! (Display <strong>penting</strong> sebagai <strong>pembanguka</strong>!)</p>
<p><strong>Pelajaran:</strong> Markov <strong>menangkap</strong> peran <strong>assists</strong> (bukan cuma <strong>scorer</strong>!). Tapi <strong>ingat:</strong> ini <strong>simulasi</strong>, bukan <strong>eksperimen</strong>! (Untuk <strong>kausal</strong>, butuh <strong>holdout</strong>! MK10!)</p>
</details>
<h3>3. Shapley — Matematika Keadilan</h3>
<p><strong>Definisi.</strong> <em>Shapley value</em> (teori permainan!): bagi <strong>total</strong> (revenue!) ke <strong>pemain</strong> (channel!) by <strong>kontribusi marginal rata-rata</strong> di <strong>semua</strong> koalisi!</p>
<p><strong>Kepribadian:</strong> seperti <strong>pembagian warisan yang adil</strong> oleh <strong>hakim matematika</strong>: &ldquo;berapa <strong>tambahan</strong> yang dibawa X jika <strong>bergabung</strong> dengan <strong>setiap</strong> kombinasi yang mungkin?&rdquo; <strong>Rata-ratakan</strong> semua! <strong>Adil</strong> by <strong>aksioma</strong> (efisiensi! simetri! dummy! aditivitas!).</p>
<p><strong>Rumus (intuisi):</strong> untuk <strong>setiap</strong> subset S (tanpa X): hitung <strong>v(S ∪ &#123;X&#125;) − v(S)</strong> (&ldquo;X tambah berapa?&rdquo;). <strong>Rata-rata tertimbang</strong> (bobot = peluang X <strong>bergabung</strong> di urutan itu!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Terbaik</strong> secara <strong>teori</strong> (adil!). <strong>Tapi:</strong> <strong>mahal</strong> dihitung (2^n koalisi!), masih <strong>observasional</strong>, butuh <strong>fungsi nilai</strong> v(S) (dari <strong>data</strong> atau <strong>model</strong>!).</p>
<Tex math={String.raw`\phi_X = \sum_{S \subseteq N \setminus \{X\}} \frac{|S|!(n-|S|-1)!}{n!} [v(S \cup \{X\}) - v(S)]`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\phi_X`} /> = Shapley X; <Tex math={String.raw`N`} /> = semua channel (n buah!); <Tex math={String.raw`S`} /> = koalisi tanpa X; <Tex math={String.raw`v(S)`} /> = &ldquo;nilai&rdquo; koalisi S (conversion!); <strong>bobot</strong> = peluang kombinatorial. <strong>Jangan hafal</strong> — <strong>pahami</strong> intuisi!</p>
<details className="worked">
<summary>📐 Contoh 3: Shapley 3 channel (klik untuk buka)</summary>
<p>Channel: A, B, C. v(∅)=0, v(A)=10, v(B)=20, v(C)=30, v(AB)=40, v(AC)=50, v(BC)=60, v(ABC)=100.</p>
<p><strong>Shapley A:</strong> S=∅: (0!2!/3!)×(10−0) = (2/6)×10 = 3,33. S=&#123;B&#125;: (1!1!/3!)×(40−20) = (1/6)×20 = 3,33. S=&#123;C&#125;: (1/6)×(50−30) = 3,33. S=&#123;B,C&#125;: (2!0!/3!)×(100−60) = (2/6)×40 = 13,33. Total φ_A = <strong>23,33</strong>.</p>
<p><strong>Shapley B:</strong> ∅: (2/6)×20=6,67. &#123;A&#125;: (1/6)×(40−10)=5. &#123;C&#125;: (1/6)×(60−30)=5. &#123;A,C&#125;: (2/6)×(100−50)=16,67. Total φ_B = <strong>33,33</strong>.</p>
<p><strong>Shapley C:</strong> ∅: (2/6)×30=10. &#123;A&#125;: (1/6)×(50−10)=6,67. &#123;B&#125;: (1/6)×(60−20)=6,67. &#123;A,B&#125;: (2/6)×(100−40)=20. Total φ_C = <strong>43,33</strong>.</p>
<p><strong>Cek:</strong> 23,33+33,33+43,33 = <strong>100</strong> ✓ (efisiensi!). <strong>Ranking:</strong> C &gt; B &gt; A.</p>
<p><strong>Pelajaran:</strong> Shapley <strong>adil</strong> (aksioma!), tapi <strong>butuh</strong> v(S) untuk <strong>semua</strong> subset (dari <strong>data</strong>! — <strong>mahal</strong>!). Untuk <strong>3 channel</strong> = 8 subset. Untuk <strong>10 channel</strong> = <strong>1024</strong>! <strong>Approximation</strong> wajib!</p>
</details>
<h3>4. Data-Driven (Google) — Machine Learning Atribusi</h3>
<p><strong>Definisi.</strong> <em>Data-driven attribution</em> (DDA): pakai <strong>ML</strong> (sering <strong>Shapley-like</strong> atau <strong>Markov-like</strong>!) untuk bagi kredit by <strong>pola data aktual</strong> (bukan <strong>aturan</strong>!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>hakim AI</strong> yang <strong>belajar</strong> dari <strong>ribuan kasus</strong> (bukan <strong>aturan adat</strong>!). <strong>Lebih</strong> akurat dari rule-based, <strong>lebih</strong> scalable dari Shapley manual.</p>
<p><strong>Tapi:</strong> <strong>black box</strong>! (tidak bisa <strong>jelaskan</strong> &ldquo;kenapa&rdquo;!), masih <strong>observasional</strong> (bukan kausal!), butuh <strong>data banyak</strong> (Google: <strong>ribuan</strong> conversion!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Default</strong> untuk Google Ads (jika <strong>memenuhi syarat</strong>!). <strong>Tapi:</strong> <strong>jangan</strong> untuk <strong>keputusan budget besar</strong> (butuh <strong>incrementality</strong>! MK10!). <strong>DDA</strong> = <strong>atribusi terbaik</strong>, bukan <strong>pengganti incrementality</strong>.</p>
<PlotlyChart
  data={[{x: ["First-click", "Last-click", "Linear", "Time-decay", "Position", "Markov", "Shapley"], y: [100, 0, 33, 14, 40, 30, 23], name: "Display", type: "bar"}, {x: ["First-click", "Last-click", "Linear", "Time-decay", "Position", "Markov", "Shapley"], y: [0, 100, 33, 29, 20, 18, 33], name: "Sosmed", type: "bar"}, {x: ["First-click", "Last-click", "Linear", "Time-decay", "Position", "Markov", "Shapley"], y: [0, 0, 33, 57, 40, 34, 43], name: "Search", type: "bar"}]}
  title={"Kredit Display (Rp ribu) by model — sama data, beda jawaban!"}
  layout={{yaxis: {title: "Kredit (Rp ribu)"}, barmode: "stack", showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Setiap batang = <strong>satu model atribusi</strong>. Warna = <strong>channel</strong>. Tinggi = <strong>total</strong> (Rp1jt!).</p>
<p><strong>Interpretasi:</strong> <strong>Display</strong> dapat <strong>Rp1jt</strong> (first-click!) atau <strong>Rp0</strong> (last-click!) atau <strong>Rp143rb</strong> (time-decay!). <strong>Sama data, beda 7x lipat!</strong> <strong>Pilih model = pilih pemenang.</strong> <strong>Sadarilah</strong> biasmu.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Last-click adalah standar industri — berarti ia yang paling benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> &lsquo;Standar&rsquo; ≠ &lsquo;benar&rsquo; — last-click standar karena <strong>mudah</strong>, bukan karena adil. Ia buta terhadap pembuka &amp; perantara (kasus GadgetKu: potong Sosmed → Search anjlok 40%). Standar yang salah tetap salah — ia hanya salah secara berjamaah.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pilih satu model atribusi 'yang benar', lalu pakai untuk semua keputusan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Setiap model menjawab <strong>pertanyaan beda</strong>: first-click ('apa yang membuka?'), last-click ('apa yang menutup?'), Shapley ('berapa kontribusi adil?'). Tidak ada yang 'benar' universal. Praktik terbaik: <strong>2–3 model + eksperimen</strong> (MK10) — atribusi untuk <em>diagnosis</em>, eksperimen untuk <em>keputusan budget</em>.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Atribusi untuk diagnosis, eksperimen untuk keputusan.</strong> Atribusi (seadil apa pun) = observasional — ia tidak tahu dunia tanpa channel itu. Budget besar (&gt;Rp100jt/bulan/channel) wajib dikalibrasi dengan holdout/geo-experiment (MK10).</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Waspadai 'atribusi' yang diberi oleh penjual iklan.</strong> Platform mengatribusi ke dirinya sendiri dengan jendela 28-hari + view-through — tentu angkanya bagus. Minta metodologi tertulis; bandingkan dengan model independenmu.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator 5 Model Rule-Based</h2>
<p>Satu journey, lima angka. Ubah urutan channel — lihat pemenang berganti.</p>
<PyodideLab
  title={"Lab 1 — Rule-Based Attribution"}
  hint={"Ubah journey jadi [Search, Email, Sosmed] — lihat last-click kini memihak Sosmed. Model menentukan pemenang!"}
  defaultCode={"# Kalkulator atribusi rule-based\njourney = [\"Sosmed\", \"Email\", \"Search\"]  # ubah urutan / panjangnya\nvalue = 1_000_000\nn = len(journey)\n\ndef bagi(bobot):\n    total = sum(bobot)\n    return {ch: value*b/total for ch, b in zip(journey, bobot)}\n\nprint(f\"Journey: {' -> '.join(journey)} (Rp{value:,})\\n\")\nmodel = {\n    \"first-click\":    [1 if i == 0 else 0 for i in range(n)],\n    \"last-click\":     [1 if i == n-1 else 0 for i in range(n)],\n    \"linear\":         [1]*n,\n    \"time-decay\":     [2**i for i in range(n)],\n    \"position-based\": [4 if i in (0, n-1) else 2 for i in range(n)],\n}\nfor nama, bobot in model.items():\n    hasil = bagi(bobot)\n    print(f\"{nama:<14}\" + \"  \".join(f\"{ch}={v/1000:.0f}rb\" for ch, v in hasil.items() if v > 0))\n"}
/>
<h2 id="lab2">🔬 Lab 2: Removal Effect Lite</h2>
<p>Hitung removal effect tiap channel dari data journey — siapa yang 'tak tergantikan'?</p>
<PyodideLab
  title={"Lab 2 — Removal Effect"}
  hint={"Ubah conversion 'tanpa Email' 150 → 280 (Email ternyata tidak penting). Lihat kreditnya anjlok — removal effect jujur pada peran."}
  defaultCode={"# Removal effect: P(conv) vs P(conv | tanpa channel)\n# Data journey GadgetKu (disederhanakan)\nP_conv = 0.50\n# P(conv) jika channel dihapus (dari analisis journey)\ntanpa = {\"Sosmed\": 0.20, \"Email\": 0.35, \"Search\": 0.10}\n\nprint(f\"{'channel':<9}{'P(conv|tanpa)':>13}  removal  kredit\")\nefek = {c: 1 - p/P_conv for c, p in tanpa.items()}\ntotal = sum(efek.values())\nfor c in tanpa:\n    print(f\"{c:<9}{tanpa[c]:>13.0%}  {efek[c]:>6.0%}  {efek[c]/total:>5.0%}\")\nprint(\"\\nKredit ∝ removal effect (dinormalisasi).\")\nprint(\"Email dapat kredit 30%+ walau tak pernah first/last!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh angka cepat untuk laporan rutin → <strong>Rule-based (position-based)</strong></h3>
<p><strong>Kenapa:</strong> Transparan, mudah dijelaskan, cukup untuk monitoring tren.</p>
<p><strong>Contoh nyata:</strong> Dashboard mingguan channel.</p>
</div>
<div className="decision-card">
<h3>2. Perang budget antar channel → <strong>Markov / Shapley + eksperimen</strong></h3>
<p><strong>Kenapa:</strong> Rule-based hanya memindahkan perang (pilih model = pilih pemenang).</p>
<p><strong>Contoh nyata:</strong> Review budget kuartalan GadgetKu.</p>
</div>
<div className="decision-card">
<h3>3. Keputusan budget besar per channel → <strong>Holdout/geo-experiment (MK10)</strong></h3>
<p><strong>Kenapa:</strong> Atribusi = observasional; kausalitas butuh eksperimen.</p>
<p><strong>Contoh nyata:</strong> Naik/turun budget &gt;Rp100jt/bulan.</p>
</div>
<div className="decision-card">
<h3>4. Jelaskan ke direksi non-teknis → <strong>Analogi + 2 model (1 rule + 1 data-driven)</strong></h3>
<p><strong>Kenapa:</strong> Rumus Shapley menakutkan; 'uji copot' Markov intuitif.</p>
<p><strong>Contoh nyata:</strong> 'Kalau email dicopot, conversion turun 30%'.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Tidak ada model yang 'benar'</strong> — tiap model bias.</li><li><strong>Laporkan ≥2 model</strong> (rule + data-driven).</li><li><strong>Atribusi = diagnosis; eksperimen = keputusan.</strong></li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Perang Budget antara Tim Search dan Tim Sosmed</h3>
<p>&ldquo;GadgetKu&rdquo;: tim Search (last-click ROAS 6,0!) vs tim Sosmed (last-click ROAS 1,5!). <strong>Direksi</strong>: &ldquo;potong Sosmed, tambah Search!&rdquo; <strong>Hasil:</strong> revenue <strong>turun 20%</strong>!</p>
<p><strong>Investigasi (Markov!):</strong> Sosmed = <strong>pembanguka</strong> (70% journey <strong>mulai</strong> di Sosmed!). Search = <strong>penutup</strong> (80% <strong>berakhir</strong> di Search!). <strong>Last-click</strong> menghukum <strong>pembanguka</strong> &amp; menghadiahi <strong>penutup</strong>!</p>
<p><strong>Solusi:</strong> <strong>position-based</strong> (40/20/40!) + <strong>holdout</strong> (MK10!). <strong>Hasil:</strong> alokasi <strong>seimbang</strong>, revenue <strong>pulih</strong> +10%.</p>
<p><strong>Pelajaran:</strong> <strong>perang channel</strong> = <strong>perang model atribusi</strong>. <strong>Ganti model</strong> = <strong>ganti pemenang</strong>. <strong>Solusi:</strong> <strong>model yang adil</strong> + <strong>validasi incrementality</strong>.</p>
<h3>Kisah 2: Shapley yang Menyelamatkan Display</h3>
<p>Brand &ldquo;ModaKita&rdquo;: Display <strong>last-click</strong> ROAS 0,8 (&ldquo;matikan!&rdquo;). <strong>Shapley</strong>: Display = <strong>25%</strong> total kredit (bukan 5%!). <strong>Holdout</strong> (MK10!): matikan Display → revenue turun <strong>18%</strong>! <strong>Display</strong> = <strong>pembanguka</strong> yang <strong>tidak terlihat</strong> di last-click!</p>
<p><strong>Keputusan:</strong> <strong>pertahankan</strong> Display (bukan <strong>matikan</strong>!). <strong>Optimasi</strong> kreatif (bukan <strong>potong</strong> budget!).</p>
<p><strong>Pelajaran:</strong> <strong>channel &ldquo;buruk&rdquo;</strong> di last-click bisa = <strong>channel &ldquo;penting&rdquo;</strong> di Shapley/Markov. <strong>Jangan matikan</strong> sebelum <strong>cek</strong> dengan <strong>model adil</strong> + <strong>holdout</strong>.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Atribusi yang lebih canggih = lebih benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Semua</strong> atribusi = <strong>observasional</strong> (bukan kausal!). <strong>Shapley</strong> = <strong>paling adil</strong> (teori!), tapi <strong>bukan</strong> incrementality! <strong>Hierarki:</strong> <strong>incrementality</strong> (eksperimen!) &gt; <strong>Shapley/Markov</strong> (adil!) &gt; <strong>rule-based</strong> (cepat!). <strong>Pilih</strong> sesuai <strong>keputusan</strong>!</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Perang Budget GadgetKu</h2>
<div className="callout">
<p>GadgetKu: last-click → Search Rp8M, Sosmed Rp1M. Potong Sosmed 70% → Search anjlok 40% kuartal berikutnya. Data journey: 60% conversion diawali Sosmed.</p>
<p><strong>Pertanyaan:</strong> (a) Jelaskan mekanisme kehancurannya. (b) Model apa yang akan mencegahnya? (c) Rancang resolusi perang budget yang adil?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Sosmed = pembuka</strong> 60% journey. Last-click memberinya 0 kredit → dipotong → pipeline atas kering → 1–2 kuartal kemudian Search (penutup) kelaparan. <strong>Atribusi yang salah menghancurkan mesinnya sendiri</strong> — dengan jeda waktu yang menyamarkan sebab-akibat.</p>
<p>(b) <strong>Markov/Shapley</strong> akan menunjukkan removal effect Sosmed ~35–40% (bukan 0). Atau position-based (40-20-40) sebagai kompromi cepat.</p>
<p>(c) <strong>Tiga lapis:</strong> (1) dashboard 2 model (position-based + Markov) untuk monitoring; (2) holdout Sosmed 10% wilayah untuk bukti kausal; (3) aturan: perubahan budget &gt;20% wajib lolos 'uji copot' (removal effect) + eksperimen. Perang selesai — angka yang bicara.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Rule-based.</strong> Journey: A → B → C → Beli (Rp600rb). Hitung first, last, linear, position-based (40/20/40) untuk B.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>First:</strong> A=Rp600rb, B=Rp0. <strong>Last:</strong> C=Rp600rb, B=Rp0. <strong>Linear:</strong> masing-masing Rp200rb → B=<strong>Rp200rb</strong>.</p>
<p><strong>Position-based:</strong> A=40%×600=<strong>Rp240rb</strong>, C=40%×600=<strong>Rp240rb</strong>, B=20%×600=<strong>Rp120rb</strong>.</p>
<p><strong>B</strong> dapat: Rp0 (first/last!) atau Rp200rb (linear!) atau Rp120rb (position!). <strong>Empat jawaban!</strong> <strong>Mana benar?</strong> <strong>Tidak ada</strong> — semua <strong>asumsi</strong>!</p>
</details>
<p><strong>Soal 2 — Markov sederhana.</strong> Start → A (1,0). A → Beli (0,3) / Keluar (0,7). Hitung P(conv) &amp; Removal(A).</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>P(conv):</strong> 1,0 × 0,3 = <strong>0,3</strong>.</p>
<p><strong>Hapus A:</strong> tidak ada jalan ke Beli → P = <strong>0</strong>. Removal(A) = 0,3 − 0 = <strong>0,3</strong> (100%!).</p>
<p><strong>Pelajaran:</strong> jika <strong>satu</strong> channel = <strong>satu-satunya</strong> jalan, removal = <strong>100%</strong>. <strong>Markov</strong> menangkap <strong>ketergantungan</strong>!</p>
</details>
<p><strong>Soal 3 — Shapley 2 channel.</strong> v(∅)=0, v(A)=30, v(B)=50, v(AB)=100. Hitung φ_A &amp; φ_B.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>φ_A:</strong> S=∅: (0!1!/2!)×(30−0) = (1/2)×30 = 15. S=&#123;B&#125;: (1!0!/2!)×(100−50) = (1/2)×50 = 25. Total = <strong>40</strong>.</p>
<p><strong>φ_B:</strong> S=∅: (1/2)×50 = 25. S=&#123;A&#125;: (1/2)×(100−30) = 35. Total = <strong>60</strong>.</p>
<p><strong>Cek:</strong> 40+60=100 ✓. <strong>B &gt; A</strong> (60 vs 40) — <strong>adil</strong> (B <strong>lebih</strong> berkontribusi <strong>sendiri</strong> &amp; <strong>sinergi</strong>!).</p>
</details>
<p><strong>Soal 4 — Pilih model.</strong> Tiga situasi: (a) laporan harian cepat; (b) alokasi budget Rp1M/bulan; (c) presentasi ke board (&ldquo;adil&rdquo;!). Model untuk masing-masing?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>(a) Time-decay</strong> (cepat! masuk akal!). <strong>(b) Markov/Shapley + holdout validasi</strong> (uang besar = <strong>butuh</strong> keadilan + <strong>kausalitas</strong>!). <strong>(c) Shapley</strong> (aksioma <strong>keadilan</strong>! bisa <strong>dijelaskan</strong> ke board!).</p>
<p><strong>Pelajaran:</strong> <strong>tidak ada</strong> &ldquo;model terbaik&rdquo; — ada <strong>&ldquo;model tepat untuk keputusan&rdquo;</strong>. <strong>Sesuaikan</strong> senjata dengan <strong>perang</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Empat pertanyaan atribusi: (1) <em>keputusan</em> apa? (2) <em>model</em> apa (biasnya apa)? (3) <em>validasi</em> dengan holdout? (4) <em>adil</em> untuk semua channel? Empat jawaban = atribusi yang benar.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Journey: Sosmed → Email → Search → beli Rp1jt. Kredit Email menurut linear?"}
  options={
    ["Rp0",
    "Rp333rb",
    "Rp1jt",
    "Rp500rb"]
  }
  correct={1}
  explanation={"Benar: linear = bagi rata → Rp1jt/3 ≈ Rp333rb. Tapi ingat: 'rata' bukan 'adil' — Email mungkin hanya perantara pasif atau justru kunci (removal effect yang menjawab)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Removal effect Email 30%. Artinya?"}
  options={
    ["Email menyebabkan 30% penjualan",
    "Tanpa Email, conversion turun 30% (ceteris paribus)",
    "Email dapat 30% budget",
    "Email dibuka 30%"]
  }
  correct={1}
  explanation={"Benar: 'uji copot' — hapus Email dari graf, conversion turun 30%. Ini kontribusi kausal-dalam-model (bukan eksperimen sungguhan, tapi jauh lebih jujur dari posisi klik)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kenapa Shapley disebut 'adil'?"}
  options={
    ["Selalu memberi rata",
    "Memenuhi aksioma: kontribusi marginal rata-rata atas semua urutan",
    "Paling mudah dihitung",
    "Standar Google"]
  }
  correct={1}
  explanation={"Benar: aksioma Shapley (efisien, simetris, dummy, aditif) = definisi matematis keadilan. Harganya: komputasi faktorial → aproksimasi untuk channel banyak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Dua model memberi Sosmed 0 (last-click) vs 6jt (first-click). Sikap benar?"}
  options={
    ["Pilih yang menguntungkan timku",
    "Rata-ratakan",
    "Laporkan keduanya + model data-driven (Markov/Shapley); keputusan budget via eksperimen",
    "Buang keduanya"]
  }
  correct={2}
  explanation={"Benar: rentang 0–6jt = ketidakpastian model. Analis jujur melaporkan ketidakpastian + mencari bukti kausal (holdout), bukan memilih angka yang nyaman."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kapan atribusi SAJA cukup untuk keputusan budget?"}
  options={
    ["Selalu",
    "Tidak pernah untuk budget besar — butuh kalibrasi eksperimen",
    "Jika pakai Shapley",
    "Jika datanya besar"]
  }
  correct={1}
  explanation={"Benar: semua atribusi = observasional. Untuk budget besar, kalibrasi dengan holdout/geo (MK10). Atribusi untuk diagnosis & monitoring, eksperimen untuk keputusan."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Atribusi yang Mengubah Alokasi Rp12 Miliar</h2>
<p>Retail &ldquo;SegarMart&rdquo;: budget Rp12M/tahun. <strong>Last-click</strong>: Search 50% (Rp6M!), Sosmed 10% (Rp1,2M!), Display 5% (Rp600rb!). <strong>Keputusan awal:</strong> potong Display &amp; Sosmed, tambah Search. Kamu diminta <strong>second opinion</strong>.</p>
<h3>Langkah 1 — Audit journey (minggu 1)</h3>
<p><strong>Data:</strong> 60% journey <strong>dimulai</strong> di Sosmed/Display. 85% <strong>berakhir</strong> di Search. <strong>Last-click</strong> = <strong>menghukum</strong> pembuka, <strong>menghadiahi</strong> penutup!</p>
<h3>Langkah 2 — Markov + Shapley (minggu 2–3)</h3>
<p><strong>Markov removal:</strong> Search 35%, Sosmed 30%, Display 25%, Email 10%. <strong>Shapley:</strong> Search 32%, Sosmed 28%, Display 27%, Email 13%.</p>
<p><strong>Beda drastis</strong> dari last-click! (Search: 50% → 35%! Sosmed: 10% → 30%! Display: 5% → 25%!)</p>
<h3>Langkah 3 — Validasi incrementality (minggu 4–8, MK10!)</h3>
<p><strong>Holdout:</strong> matikan Display 50% wilayah → revenue turun <strong>12%</strong>! Matikan Sosmed → turun <strong>15%</strong>! Matikan Search → turun <strong>20%</strong>!</p>
<p><strong>Incremental sebenarnya:</strong> Display 12%, Sosmed 15%, Search 20% (dari total!). <strong>Konsisten</strong> dengan Markov/Shapley (<strong>bukan</strong> last-click!).</p>
<h3>Langkah 4 — Realokasi</h3>
<p><strong>Baru:</strong> Search Rp4,2M (35%!), Sosmed Rp3,6M (30%!), Display Rp3M (25%!), Email Rp1,2M (10%!). <strong>Hasil:</strong> revenue <strong>naik 18%</strong> (vs <strong>turun 15%</strong> jika ikut last-click!).</p>
<div className="callout">
<p><strong>What:</strong> Last-click → Markov/Shapley + holdout. Realokasi Rp12M. Revenue +18% (vs −15%!).</p>
<p><strong>So what:</strong> <strong>Model atribusi</strong> = <strong>keputusan Rp12M</strong>. <strong>Salah model</strong> = <strong>salah Rp12M</strong>. <strong>Validasi</strong> (holdout!) = <strong>asuransi</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Jangan</strong> alokasi by last-click! (2) <strong>Pakai</strong> Markov/Shapley! (3) <strong>Validasi</strong> dengan incrementality! (4) <strong>Ulangi</strong> tiap 6 bulan!</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Atribusi</h2>
<h3>Jebakan 1: Last-click untuk budget</h3>
<p><strong>Deteksi:</strong> jika <strong>satu</strong> channel (branded!) dapat &gt; 50% kredit last-click = <strong>curiga</strong>! <strong>Solusi:</strong> <strong>Markov/Shapley</strong> + <strong>holdout</strong>.</p>
<h3>Jebakan 2: View-through tanpa batas</h3>
<p><strong>Display</strong> klaim &ldquo;view&rdquo; 30 hari lalu = <strong>berjasa</strong>! <strong>Deteksi:</strong> <strong>window</strong> terlalu panjang (&gt; 7 hari!) = <strong>klaim palsu</strong>. <strong>Solusi:</strong> <strong>window pendek</strong> + <strong>incrementality</strong>.</p>
<h3>Jebakan 3: Double-counting cross-device</h3>
<p><strong>Mobile</strong> &amp; <strong>desktop</strong> = <strong>orang sama</strong>! Dihitung <strong>dua</strong> journey! <strong>Deteksi:</strong> user ID <strong>tidak</strong> unified. <strong>Solusi:</strong> <strong>identity resolution</strong>!</p>
<h3>Jebakan 4: Mengabaikan offline</h3>
<p><strong>Toko fisik</strong> tidak diatribusi! <strong>Online</strong> dapat <strong>semua</strong> kredit! <strong>Deteksi:</strong> ROPO (<strong>research online, purchase offline</strong>!) tinggi. <strong>Solusi:</strong> <strong>store visit</strong> tracking!</p>
<h3>Jebakan 5: Atribusi = incrementality</h3>
<p><strong>Deteksi:</strong> &ldquo;atribusi bilang X penting&rdquo; = <strong>langsung</strong> tambah budget! <strong>Solusi:</strong> <strong>holdout</strong> dulu (MK10!). <strong>Atribusi</strong> = <strong>hipotesis</strong>. <strong>Incrementality</strong> = <strong>bukti</strong>.</p>
<h3>Jebakan 6: Tidak update model</h3>
<p><strong>Journey</strong> berubah (TikTok baru!), model <strong>tetap</strong> (last-click 2019!). <strong>Deteksi:</strong> model &gt; 1 tahun <strong>tidak</strong> direview. <strong>Solusi:</strong> <strong>review 6 bulanan</strong>!</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam audit: last-click dominan, window panjang, cross-device, offline, atribusi=incremental, model basi. Audit tiap 6 bulan!</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Pilih Model Atribusi 1 Halaman</h2>
<div className="callout">
<p><strong>🎯 MODEL ATRIBUSI — [periode]</strong></p>
<p><strong>1. Keputusan:</strong> __ (harian? budget? board?). <strong>Model:</strong> __ (time-decay? Markov? Shapley?). <strong>Alasan:</strong> __.</p>
<p><strong>2. Bias model:</strong> __ (apa yang <strong>diovervalue</strong>? apa yang <strong>diundervalue</strong>?).</p>
<p><strong>3. Hasil (top 3):</strong> __ (__%), __ (__%), __ (__%).</p>
<p><strong>4. Validasi:</strong> holdout __ (hasil: __). <strong>Konsisten?</strong> __.</p>
<p><strong>5. Aksi:</strong> __ (realokasi? pertahankan? matikan?). <strong>Review:</strong> __ (tanggal!).</p>
</div>
<p><strong>Aturan:</strong> <strong>tidak ada</strong> realokasi &gt; Rp500jt tanpa 5 baris ini! <strong>Model</strong> + <strong>bias</strong> + <strong>validasi</strong> = <strong>keputusan bertanggung jawab</strong>.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Google DDA vs Shapley manual — pilih mana?</strong><br/>A: <strong>DDA</strong> untuk <strong>Google Ads</strong> (otomatis! data besar!). <strong>Shapley manual</strong> untuk <strong>cross-channel</strong> (termasuk <strong>offline</strong>!). <strong>Keduanya</strong>, sesuai <strong>cakupan</strong>.</p>
<p><strong>Q2: Berapa lama lookback window?</strong><br/>A: <strong>Siklus beli</strong> produk! FMCG: <strong>7 hari</strong>. Fashion: <strong>30 hari</strong>. Otomotif: <strong>90 hari</strong>. <strong>Terlalu panjang</strong> = <strong>klaim palsu</strong>. <strong>Terlalu pendek</strong> = <strong>kehilangan</strong> journey.</p>
<p><strong>Q3: Atribusi untuk <strong>B2B</strong> (sales cycle 6 bulan)?</strong><br/>A: <strong>W-shaped</strong> (40/20/40!) atau <strong>full-path</strong>! <strong>Account-based</strong> (bukan <strong>lead-based</strong>!). <strong>Multi-touch</strong> wajib (journey <strong>panjang</strong>!).</p>
<p><strong>Q4: Bagaimana jika <strong>data</strong> tidak lengkap (cookie loss)?</strong><br/>A: <strong>Modeled</strong> conversions (Google!) + <strong>incrementality</strong> (MK10!). <strong>Jangan</strong> pura-pura data <strong>lengkap</strong> — <strong>akui</strong> ketidakpastian!</p>
<p><strong>Q5: Satu kalimat inti?</strong><br/>A: <strong>Pilih model sesuai keputusan, sadari biasnya, validasi dengan holdout. Atribusi = hipotesis, incrementality = bukti.</strong></p>

      <h2 id="cookieless">🎯 Studi Kasus Lanjutan: Multi-Touch di Era Cookieless</h2>
<p><strong>Cookie</strong> = <strong>mati</strong> (2024!). <strong>Atribusi</strong> = <strong>krisis</strong>! <strong>Bagaimana</strong> track <strong>journey</strong> tanpa <strong>cookie</strong>? <strong>Tiga</strong> solusi: <strong>(1)</strong> First-party data, <strong>(2)</strong> Modeled, <strong>(3)</strong> Incrementality.</p>
<h3>Solusi 1: First-party data</h3>
<p><strong>Kumpulkan</strong> sendiri (login! <strong>CRM</strong>! <strong>loyalty</strong>!). <strong>Identity</strong> = <strong>email</strong> (bukan <strong>cookie</strong>!). <strong>Contoh:</strong> <strong>Tokopedia</strong> (login! — <strong>track</strong> cross-device!).</p>
<p><strong>Kelebihan:</strong> <strong>akurat</strong>! <strong>milik</strong> sendiri! <strong>Kekurangan:</strong> <strong>butuh</strong> login (<strong>tidak</strong> semua mau!).</p>
<h3>Solusi 2: Modeled conversions</h3>
<p><strong>Google</strong> = <strong>tebak</strong> conversion yang <strong>tidak</strong> ter-track (by <strong>pola</strong> yang <strong>ter-track</strong>!). <strong>Machine learning</strong>! <strong>Contoh:</strong> 100 <strong>ter-track</strong>, 30 <strong>tidak</strong> → <strong>model</strong> 130.</p>
<p><strong>Kelebihan:</strong> <strong>otomatis</strong>! <strong>Kekurangan:</strong> <strong>tebakan</strong>! (<strong>tidak</strong> akurat 100%!).</p>
<h3>Solusi 3: Incrementality (MK10!)</h3>
<p><strong>Lupakan</strong> track <strong>individu</strong>! <strong>Ukur</strong> <strong>dampak</strong> agregat (<strong>geo-test</strong>!). <strong>Contoh:</strong> matikan <strong>iklan</strong> di 5 kota → <strong>revenue</strong> turun 10% = <strong>incremental</strong> 10%!</p>
<p><strong>Kelebihan:</strong> <strong>kausal</strong>! <strong>tidak</strong> butuh cookie! <strong>Kekurangan:</strong> <strong>mahal</strong>! (<strong>eksperimen</strong>!).</p>
<details className="worked">
<summary>📐 Contoh: Strategi cookieless (klik untuk buka)</summary>
<p><strong>Brand:</strong> 70% <strong>login</strong> (first-party!), 30% <strong>anonim</strong>.</p>
<p><strong>Strategi:</strong> <strong>70%</strong> = <strong>atribusi</strong> akurat (first-party!). <strong>30%</strong> = <strong>modeled</strong> (Google!). <strong>Validasi:</strong> <strong>incrementality</strong> (geo-test <strong>kuartalan</strong>!).</p>
<p><strong>Hasil:</strong> <strong>80%</strong> akurasi (vs <strong>95%</strong> era cookie!). <strong>Cukup</strong> untuk <strong>keputusan</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>tidak</strong> ada <strong>sempurna</strong>. <strong>Kombinasi</strong> = <strong>terbaik</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Cookieless</em> = <em>akhir</em> atribusi sempurna. <em>Awal</em> atribusi <em>probabilistik</em> + <em>incrementality</em>.</strong></p>
</div>

      <h2 id="framework">📈 Framework Pengambilan Keputusan Atribusi</h2>
<p><strong>Kapan</strong> pakai <strong>model</strong> apa? <strong>Framework:</strong></p>
<h3>Level 1: Operasional (harian!)</h3>
<p><strong>Model:</strong> <strong>Time-decay</strong> atau <strong>position-based</strong>. <strong>Mengapa:</strong> <strong>cepat</strong>! <strong>cukup</strong> akurat! <strong>Contoh:</strong> <strong>laporan</strong> harian ROAS.</p>
<h3>Level 2: Taktis (bulanan!)</h3>
<p><strong>Model:</strong> <strong>Markov</strong> atau <strong>Shapley</strong>. <strong>Mengapa:</strong> <strong>adil</strong>! <strong>data-driven</strong>! <strong>Contoh:</strong> <strong>alokasi</strong> budget bulanan.</p>
<h3>Level 3: Strategis (kuartalan!)</h3>
<p><strong>Model:</strong> <strong>MMM</strong> (MK13!) + <strong>Incrementality</strong> (MK10!). <strong>Mengapa:</strong> <strong>kausal</strong>! <strong>holistik</strong>! <strong>Contoh:</strong> <strong>budget</strong> tahunan Rp10M.</p>
<p><strong>Aturan:</strong> <strong>semakin</strong> besar <strong>keputusan</strong>, <strong>semakin</strong> canggih <strong>model</strong> + <strong>validasi</strong>!</p>
<details className="worked">
<summary>📐 Contoh: Tiga level (klik untuk buka)</summary>
<p><strong>Harian:</strong> &ldquo;ROAS <strong>kemarin</strong> 3,2 (time-decay!).&rdquo; (<strong>5 menit</strong>!).</p>
<p><strong>Bulanan:</strong> &ldquo;<strong>Geser</strong> Rp100jt dari Search ke Sosmed (<strong>Shapley</strong>!).&rdquo; (<strong>1 hari</strong> analisis!).</p>
<p><strong>Kuartalan:</strong> &ldquo;<strong>Tambah</strong> Rp1M ke TV (<strong>MMM</strong> + <strong>geo-test</strong>!).&rdquo; (<strong>1 bulan</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>sesuaikan</strong> <strong>usaha</strong> dengan <strong>taruhan</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 <em>Tiga level</em>: operasional (cepat!), taktis (adil!), strategis (kausal!). <em>Pilih</em> sesuai <em>taruhan</em>.</strong></p>
</div>

      <h2 id="kisah">📖 Kisah Nyata: Perang Atribusi di Startup Unicorn</h2>
<p>Di sebuah startup unicorn di Jakarta, terjadi perang dingin antara dua tim. Tim Performance Marketing, yang dipimpin oleh Rina, bersikeras bahwa Google Search adalah channel terbaik mereka. &ldquo;Lihat ROAS kami!&rdquo; katanya sambil menunjukkan dashboard dengan angka 6,5 yang berkilau. &ldquo;Setiap rupiah yang kita keluarkan kembali enam setengah kali lipat!&rdquo;</p>
<p>Di sisi lain, Tim Brand Marketing, yang dipimpin oleh Budi, merasa tidak dihargai. &ldquo;Tapi kami yang membuat orang mengenal brand!&rdquo; protesnya. &ldquo;Video YouTube kami ditonton sepuluh juta kali! Tanpa kami, tidak ada yang akan mencari brand kita di Google!&rdquo;</p>
<p>CEO, Pak Andi, bingung. Ia melihat angka-angka yang bertentangan. Tim Rina mengklaim bahwa Search menghasilkan Rp6,5 miliar dari budget Rp1 miliar. Tim Budi mengklaim bahwa YouTube &ldquo;berkontribusi&rdquo; tetapi tidak bisa menunjukkan angka yang konkret. &ldquo;Siapa yang benar?&rdquo; tanyanya kepada kamu, sang analis data yang baru direkrut.</p>
<p>Kamu tersenyum. Ini adalah masalah atribusi klasik, persis seperti yang dipelajari di MK12. Kamu tahu bahwa jawabannya tidak sesederhana &ldquo;Rina benar&rdquo; atau &ldquo;Budi benar&rdquo;. Kamu perlu menggali lebih dalam.</p>
<p>Langkah pertama yang kamu lakukan adalah memahami customer journey. Kamu menarik data dari Google Analytics dan menemukan pola yang menarik. Delapan puluh persen dari pelanggan yang akhirnya membeli melalui Google Search, sebelumnya telah melihat iklan YouTube! Mereka melihat video, tertarik, kemudian beberapa hari kemudian mencari brand di Google dan membeli.</p>
<p>Namun, model atribusi yang digunakan perusahaan adalah last-click. Artinya, seratus persen kredit diberikan kepada Google Search, dan nol persen kepada YouTube! Tidak heran Rina terlihat seperti pahlawan dan Budi terlihat seperti pecundang. Modelnya yang salah, bukan orangnya.</p>
<p>Kamu kemudian menjelaskan kepada Pak Andi dengan analogi sepak bola. &ldquo;Bayangkan sebuah tim sepak bola,&rdquo; katamu. &ldquo;Striker mencetak gol, tetapi gelandang yang memberikan umpan. Jika kita hanya menghitung gol, striker terlihat hebat dan gelandang terlihat tidak berguna. Tapi tanpa umpan dari gelandang, tidak akan ada gol!&rdquo;</p>
<p>Pak Andi mengangguk paham. &ldquo;Jadi YouTube adalah gelandangnya?&rdquo; tanyanya. &ldquo;Tepat sekali,&rdquo; jawabmu. &ldquo;Dan model last-click kita hanya menghitung gol, tidak menghitung assist.&rdquo;</p>
<p>Kamu kemudian menerapkan tiga model atribusi yang berbeda. Pertama, kamu mencoba position-based (40% untuk sentuhan pertama, 40% untuk sentuhan terakhir, 20% untuk tengah). Hasilnya: YouTube mendapatkan 35% kredit, Search mendapatkan 45%, dan sisanya terbagi ke channel lain. Sudah lebih adil!</p>
<p>Kedua, kamu membangun model Markov. Kamu membuat graf dari semua journey pelanggan dan menghitung &ldquo;removal effect&rdquo; — berapa banyak conversion yang hilang jika sebuah channel dihapus. Hasilnya mengejutkan: jika YouTube dihapus, conversion turun 30%! Jika Search dihapus, conversion turun 25%! Ternyata YouTube bahkan lebih penting dari Search!</p>
<p>Ketiga, kamu menghitung Shapley value. Ini adalah metode yang paling adil secara matematis. Hasilnya konsisten dengan Markov: YouTube 32%, Search 28%, Instagram 20%, Email 12%, sisanya 8%.</p>
<p>Namun, kamu tahu bahwa semua model ini masih observasional, bukan kausal. Kamu membutuhkan bukti yang lebih kuat. Kamu mengusulkan eksperimen geo-holdout dari MK10. &ldquo;Mari kita matikan YouTube di lima kota selama satu bulan,&rdquo; katamu. &ldquo;Dan lihat apa yang terjadi.&rdquo;</p>
<p>Tim Rina protes. &ldquo;Itu berisiko!&rdquo; katanya. Tim Budi mendukung. &ldquo;Akhirnya!&rdquo; katanya. Pak Andi, setelah mendengar penjelasanmu tentang metodologi, menyetujui.</p>
<p>Hasil eksperimen sangat jelas. Di lima kota tanpa YouTube, total revenue turun delapan belas persen! Padahal, spend YouTube hanya sepuluh persen dari total budget. Ini membuktikan bahwa YouTube memiliki dampak yang jauh lebih besar dari yang ditunjukkan oleh last-click.</p>
<p>Di sisi lain, ketika Search dimatikan di lima kota lain (sebagai pembanding), revenue hanya turun dua belas persen. Ini menunjukkan bahwa sebagian dari &ldquo;kehebatan&rdquo; Search sebenarnya adalah hasil kerja YouTube yang tidak terlihat.</p>
<p>Dengan bukti ini, kamu merekomendasikan realokasi budget. Dari total Rp10 miliar per tahun, alokasi baru adalah: YouTube Rp3 miliar (naik dari Rp1 miliar!), Search Rp2,8 miliar (turun dari Rp5 miliar!), Instagram Rp2 miliar, Email Rp1,2 miliar, sisanya Rp1 miliar untuk eksperimen.</p>
<p>Tim Rina awalnya kecewa, tetapi setelah kamu menjelaskan dengan data, ia memahami. &ldquo;Jadi selama ini saya mengambil kredit atas kerja Budi?&rdquo; katanya dengan malu. Budi tersenyum. &ldquo;Tidak apa-apa, yang penting sekarang kita tahu kebenarannya.&rdquo;</p>
<p>Enam bulan kemudian, hasilnya terlihat. Total revenue naik dua puluh lima persen! Bukan karena budget bertambah (tetap Rp10 miliar!), tetapi karena alokasi yang lebih tepat. YouTube yang sebelumnya &ldquo;tidak terukur&rdquo; ternyata adalah mesin pertumbuhan yang sebenarnya.</p>
<p>Pak Andi memanggilmu ke ruangannya. &ldquo;Terima kasih,&rdquo; katanya. &ldquo;Kamu tidak hanya menyelesaikan perang antara Rina dan Budi, kamu juga menambah Rp2,5 miliar revenue tanpa menambah budget. Itu adalah keajaiban.&rdquo;</p>
<p>Kamu tersenyum. &ldquo;Bukan keajaiban, Pak. Itu hanya matematika atribusi yang benar.&rdquo;</p>
<div className="callout">
<p><strong>What:</strong> Perang antara tim Search (last-click ROAS 6,5!) dan tim YouTube (&ldquo;tidak terukur&rdquo;!). Markov + Shapley + geo-test membuktikan YouTube lebih penting. Realokasi Rp10 miliar. Revenue +25%.</p>
<p><strong>So what:</strong> <strong>Model atribusi</strong> = <strong>keadilan</strong> + <strong>uang</strong>. <strong>Salah model</strong> = <strong>perang</strong> + <strong>kerugian</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Jangan</strong> percaya last-click! (2) <strong>Gunakan</strong> Markov/Shapley! (3) <strong>Validasi</strong> dengan eksperimen! (4) <strong>Damai</strong>kan tim dengan data!</p>
</div>
<div className="tip">
<p><strong>💡 <em>Kisah nyata</em> = <em>pelajaran</em>. <em>Atribusi</em> yang <em>adil</em> = <em>tim</em> yang <em>harmonis</em> + <em>revenue</em> yang <em>naik</em>.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-shapley">📐 Worked Example: Nilai Shapley untuk 3 Channel, Langkah-demi-Langkah</h2>
<p>Shapley value terdengar menakutkan (teori permainan kooperatif!), tapi idenya sederhana: <strong>kredit channel = rata-rata kontribusi marginalnya di semua urutan kedatangan yang mungkin</strong>. Contoh 3 channel — Iklan Video (V), Search (S), Email (E) — dengan data conversion per kombinasi sentuhan:</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Kombinasi channel</th><th>Conversion</th><th>Kombinasi channel</th><th>Conversion</th></tr></thead>
<tbody>
<tr><td>(tidak ada)</td><td>100</td><td>V + S</td><td>340</td></tr>
<tr><td>V saja</td><td>180</td><td>V + E</td><td>260</td></tr>
<tr><td>S saja</td><td>250</td><td>S + E</td><td>330</td></tr>
<tr><td>E saja</td><td>150</td><td>V + S + E</td><td>420</td></tr>
</tbody>
</table>
</div>
<details className="worked">
<summary>📐 Perhitungan Shapley untuk channel Search (klik untuk buka)</summary>
<p><strong>Langkah 0 — Rumus intuisi.</strong> Untuk tiap urutan kedatangan (ada 3! = 6 urutan), hitung <strong>kontribusi marginal</strong> Search = conversion(dengan Search) − conversion(tanpa Search) pada titik ia &ldquo;datang&rdquo;. Shapley = rata-rata dari 6 angka itu.</p>
<p><strong>Langkah 1 — Urutan V → S → E:</strong> S datang setelah V. Marginal = (V+S) − (V) = 340 − 180 = <strong>160</strong>.</p>
<p><strong>Langkah 2 — Urutan V → E → S:</strong> S datang setelah V+E. Marginal = (V+S+E) − (V+E) = 420 − 260 = <strong>160</strong>.</p>
<p><strong>Langkah 3 — Urutan S → V → E:</strong> S datang pertama. Marginal = (S) − (tidak ada) = 250 − 100 = <strong>150</strong>.</p>
<p><strong>Langkah 4 — Urutan S → E → V:</strong> S datang pertama. Marginal = 250 − 100 = <strong>150</strong>.</p>
<p><strong>Langkah 5 — Urutan E → S → V:</strong> S datang setelah E. Marginal = (S+E) − (E) = 330 − 150 = <strong>180</strong>.</p>
<p><strong>Langkah 6 — Urutan E → V → S:</strong> S datang setelah E+V. Marginal = (V+S+E) − (V+E) = 420 − 260 = <strong>160</strong>.</p>
<p><strong>Langkah 7 — Rata-rata:</strong> (160 + 160 + 150 + 150 + 180 + 160) / 6 = 960 / 6 = <strong>160</strong>. Nilai Shapley Search = <strong>160 conversion</strong>.</p>
<p><strong>Langkah 8 — Ulangi untuk V dan E</strong> (latihan!): hasilnya V = <strong>90</strong>, E = <strong>70</strong>. Cek kewarasan: 160 + 90 + 70 = <strong>320</strong> = total uplift (420 − 100 baseline). <strong>Shapley selalu pas membagi total</strong> — sifat &ldquo;efisiensi&rdquo; yang tidak dimiliki last-click.</p>
<p><strong>Langkah 9 — Bandingkan dengan last-click.</strong> Misal data journey menunjukkan S paling sering jadi sentuhan terakhir: last-click memberi S = 220, V = 60, E = 40. Shapley mengoreksi: S tetap terbesar (160) tapi tidak sebesar klaim last-click; V naik dari 60 → 90 karena perannya sebagai <strong>pembuka</strong> kini dihargai. Keputusan budget yang tadinya &ldquo;potong video, tambah search&rdquo; menjadi &ldquo;pertahankan video sebagai pembuka, optimalkan search sebagai penutup&rdquo; — <strong>strategi yang sama sekali berbeda</strong>.</p>
</details>
<h3>Tiga catatan jujur tentang Shapley</h3>
<ul>
<li><strong>Butuh data semua kombinasi.</strong> Dengan 5+ channel, 2<sup>n</sup> kombinasi tidak teramati semua — dipakai sampling/aproksimasi. Shapley &ldquo;tepat&rdquo; hanya untuk sedikit channel.</li>
<li><strong>Korelasi merusak interpretasi.</strong> Jika V dan S selalu muncul berbarengan (orang yang lihat video pasti search), Shapley membagi kredit secara mekanis — padahal secara kausal mungkin hanya satu yang bekerja. Shapley = <strong>keadilan akuntansi</strong>, bukan kebenaran kausal. Untuk kausalitas: eksperimen (MK10/MK11).</li>
<li><strong>Kompleksitas vs keputusan.</strong> Jika hasil Shapley ≈ hasil position-based (40-20-40), pakai yang sederhana. Model atribusi dinilai dari <strong>keputusan yang berubah</strong>, bukan dari kecanggihannya.</li>
</ul>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: last-click bertanya &ldquo;siapa yang mencetak gol?&rdquo;; Shapley bertanya &ldquo;berapa gol yang hilang jika pemain ini tidak ada di <em>setiap</em> susunan tim yang mungkin?&rdquo;. Yang kedua lebih adil — dan lebih mahal dihitung.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: Ritel &ldquo;MajuJaya&rdquo; — Atribusi Omnichannel yang Menyelamatkan Toko Fisik</h2>
<p><em>MajuJaya</em> (nama disamarkan): ritel elektronik dengan 60 toko fisik + toko online. Masalah: atribusi last-click digital menunjukkan toko online &ldquo;mengalahkan&rdquo; semua channel — direksi tergoda menutup 15 toko fisik yang &ldquo;tidak berkontribusi&rdquo;. Tim analis curiga: 40% pembeli online <strong>melihat barang di toko dulu</strong> (data survei struk).</p>
<h3>Desain atribusi omnichannel</h3>
<p><strong>Langkah 1 — Satukan identitas.</strong> Member card dipakai online &amp; offline → 55% transaksi bisa dihubungkan ke satu orang (identity resolution deterministik, MK2). Sisanya dimodelkan agregat.</p>
<p><strong>Langkah 2 — Definisikan &ldquo;conversion&rdquo; yang benar.</strong> Bukan &ldquo;order online&rdquo; melainkan <strong>pembelian total</strong> (online + offline) per pelanggan per 90 hari. Toko fisik yang &ldquo;kalah&rdquo; di atribusi digital ternyata muncul di 40% journey pembelian online sebagai sentuhan awal.</p>
<p><strong>Langkah 3 — Tiga model dibandingkan:</strong></p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Channel</th><th>Last-click digital</th><th>Markov removal effect</th><th>Shapley</th></tr></thead>
<tbody>
<tr><td>Iklan digital</td><td>45%</td><td>32%</td><td>30%</td></tr>
<tr><td>Toko fisik (kunjungan)</td><td>5%</td><td>28%</td><td>31%</td></tr>
<tr><td>Marketplace</td><td>35%</td><td>25%</td><td>24%</td></tr>
<tr><td>Direct/brand</td><td>15%</td><td>15%</td><td>15%</td></tr>
</tbody>
</table>
</div>
<p><strong>Temuan:</strong> last-click memberi toko fisik hanya 5% (karena jarang jadi klik terakhir), sementara Markov &amp; Shapley sepakat: <strong>~30%</strong> — toko fisik adalah <strong>showroom</strong> yang membuka journey. Tanpa koreksi ini, 15 toko akan ditutup dan — menurut model — revenue total turun ~12%, bukan naik.</p>
<h3>Keputusan &amp; hasil</h3>
<p>Alih-alih menutup toko, MajuJaya mengubah <strong>peran</strong> 15 toko itu: kurangi stok gudang (hemat sewa gudang 30%), perbanyak display + QR &ldquo;scan untuk beli online&rdquo; dengan atribusi ke toko (sales tetap dapat komisi). Hasil 1 tahun: biaya operasional 15 toko turun 22%, revenue total naik 9% — <strong>toko yang hampir ditutup menjadi channel akuisisi termurah</strong> (CAC Rp45.000 vs digital Rp120.000).</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Channel yang tidak bisa di-klik = channel yang tidak berkontribusi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Atribusi digital last-click buta terhadap semua yang tidak menghasilkan klik terakhir: kunjungan toko, lihat-lihat, omongan teman. Model yang benar dimulai dari <strong>definisi conversion yang mencakup semua tempat uang masuk</strong> — baru pilih matematikanya.</p>
</div>

            <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Atribusi</h2>
<h3>1. &ldquo;Model atribusi mana yang &lsquo;benar&rsquo;?&rdquo;</h3>
<p><strong>Tidak ada yang benar — yang ada hanya yang berguna.</strong> Setiap model adalah lensa dengan biasnya sendiri: last-click bias ke penutup, first-click bias ke pembuka, Shapley butuh data lengkap, MMM butuh 2+ tahun data. Praktik analis senior: jalankan <strong>2–3 model</strong> dan cari <strong>kesepakatan</strong>-nya. Jika last-click, Markov, dan Shapley semuanya bilang &ldquo;search kebesaran porsinya&rdquo;, keputusan itu kokoh. Jika ketiganya beda jauh, datamu belum siap untuk keputusan — perbaiki tracking dulu (MK2).</p>
<h3>2. &ldquo;Kenapa hasil atribusi platform (Google/Meta) selalu lebih besar dari GA4?&rdquo;</h3>
<p>Karena tiap platform memakai <strong>atribusi miliknya sendiri</strong> atas <em>seluruh</em> conversion yang ia sentuh — Google mengklaim 100 conversion, Meta mengklaim 80, padahal total nyata 120. Jumlah klaim &gt; total nyata karena satu conversion diklaim banyak pihak (<strong>double counting</strong>). Jangan pernah menjumlahkan angka antar-platform. Satu-satunya &ldquo;wasit&rdquo; netral: atribusi pihak pertama (milikmu) atau eksperimen geo yang mengukur incrementalitas nyata.</p>
<h3>3. &ldquo;View-through (lihat iklan, tidak klik, lalu beli) dihitung tidak?&rdquo;</h3>
<p><strong>Hati-hati — ini ladang bias terbesar.</strong> View-through memberi kredit ke iklan display/video yang &ldquo;dilihat&rdquo; sebelum pembelian. Masalahnya: orang yang <em>akan</em> beli memang lebih sering terpapar iklanmu (targeting!). Menghitung view-through mentah = mengkredit iklan atas niat beli yang sudah ada. Jika dipakai, batasi jendela waktu pendek (1–7 hari, bukan 30) dan selalu bandingkan dengan <strong>lift dari eksperimen holdout</strong> — selisihnya adalah bias view-through-mu.</p>
<h3>4. &ldquo;Attribution window berapa hari yang tepat?&rdquo;</h3>
<p><strong>Samakan dengan siklus keputusan produkmu.</strong> Kopi sachet: 1–3 hari. Fashion: 7–14 hari. Elektronik: 14–30 hari. Properti/mobil: 30–90 hari. Window terlalu pendek = memotong kredit pembuka (undervalue branding); terlalu panjang = mengkredit iklan atas pembelian yang kebetulan (noise). Cara kalibrasi: plot distribusi &ldquo;jarak klik-ke-beli&rdquo; — pilih window yang mencakup ~80–90% conversion. Dan <strong>jangan gonta-ganti window</strong> tiap bulan; itu mengubah sejarah.</p>
<h3>5. &ldquo;Kapan atribusi multi-touch tidak perlu?&rdquo;</h3>
<p>Saat <strong>journey-mu memang satu sentuhan</strong>: produk impulsif murah (klik → beli dalam 5 menit), atau satu channel dominan &gt; 80% (mis. 90% penjualan dari marketplace search). Multi-touch yang dipaksakan di journey satu sentuhan hanya menambah kompleksitas tanpa mengubah keputusan. Aturan: cek distribusi jumlah sentuhan per conversion dulu — jika median = 1, last-click sudah cukup dan jujur.</p>
<h3>6. &ldquo;Bagaimana menjelaskan hasil atribusi ke direksi yang hanya percaya last-click?&rdquo;</h3>
<p><strong>Jangan debat model — debat uang.</strong> Tunjukkan satu eksperimen kecil: &ldquo;Bulan lalu kita potong budget video 50% (sesuai last-click), dan 6 minggu kemudian search turun 18%. Ini buktinya video membuka jalan untuk search.&rdquo; Satu bukti kausal mengalahkan 100 slide teori Shapley. Setelah ia percaya <em>fenomena</em>-nya, barulah kenalkan model yang mengukurnya. Analis yang memulai dari matematika biasanya kalah dari analis yang memulai dari cerita + bukti.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: atribusi adalah <em>persidangan</em>, bukan <em>pengukuran</em>. Tiap model adalah saksi dengan kepentingannya sendiri; tugasmu sebagai analis adalah hakimnya — mendengar semua, percaya sebagian, dan memutuskan berdasarkan bukti yang paling tahan uji silang.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Rule-based</strong>: first/last/linear/time-decay/position — transparan tapi bias; model menentukan pemenang.</li>
<li><strong>Markov</strong>: removal effect = 'uji copot' — menghargai perantara yang tak terlihat rule-based.</li>
<li><strong>Shapley</strong>: kontribusi marginal rata-rata atas semua urutan — adil secara aksioma, mahal komputasi.</li>
<li><strong>Tidak ada model 'benar'</strong> — laporkan ≥2 model; atribusi untuk diagnosis.</li>
<li><strong>Keputusan budget besar</strong> → eksperimen (MK10), bukan atribusi.</li>
<li><strong>Waspadai atribusi platform</strong> (conflict of interest) — minta metodologi, bandingkan independen.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk11-uplift" className="btn btn-secondary btn-sm">← MK11</Link>
        <Link href="/learn/mk13-mmm" className="btn btn-primary btn-sm">MK13 →</Link>
      </div>
    </div>
  );
}
