"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk16DigitalAdsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK16 — Marketing Data Analytics</span>
        <h1 className="display-title">Digital Ads:<br/>Lelang, Bid & Alokasi Budget</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Bid Tertinggi yang Kalah (dan Menang)</a></li>
<li><a href="#lelang">Mekanika Lelang</a></li>
<li><a href="#funnel">CTR, CVR & Funnel Iklan</a></li>
<li><a href="#bid">Bid Strategy & Alokasi</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Matematika Lelang Iklan</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Boncos SepatuLari</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#masterclass">🎓 Masterclass Digital Ads: Dari Nol ke Scale</a></li>
<li><a href="#kisahads">📖 Kisah Nyata: Dari Rp10 Juta ke Rp1 Miliar</a></li>
<li><a href="#tambahan-gsp">📐 Worked Example: Lelang GSP</a></li>
<li><a href="#tambahan-kasus">📊 Studi Kasus: TasKulit</a></li>
<li><a href="#tambahan-faq">❓ FAQ Digital Ads</a></li>
<li><a href="#tambahan-kasus2">📊 Studi Kasus: KopiBotol</a></li>
<li><a href="#tambahan-audit">🧰 Kit: Audit Akun 30 Menit</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan cara kerja lelang iklan (Ad Rank, second-price) dan kenapa bid tertinggi tidak selalu menang.</li>
<li>Menghitung CTR, CVR, CPC, CPA dan membaca funnel iklan.</li>
<li>Membedakan strategi bid manual vs tCPA vs tROAS dan memilih yang tepat.</li>
<li>Mengalokasikan budget antar-kampanye via marginal ROI + frequency cap.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Bid Tertinggi yang Kalah (dan Menang)</h2>
      <div className="story">
        <p>Brand <em>&ldquo;SepatuLari&rdquo;</em> menaikkan bid 3x lipat agar &ldquo;menang lelang&rdquo;. Hasil: posisi naik sedikit, <strong>CPA naik 2,5x</strong> — boncos. Konsultan menyarankan sebaliknya: <strong>turunkan bid 30%, perbaiki kualitas iklan</strong>. Hasil: posisi sama, CPA turun 40%.</p>
<p>Twist-nya: lelang Google/Meta <strong>bukan lelang harga tertinggi</strong> — melainkan <strong>Ad Rank = bid × kualitas</strong>. Bid 3x dengan kualitas jeblok kalah dari bid normal berkualitas tinggi. Dan karena <em>second-price</em>, pemenang membayar <em>semurah mungkin</em> untuk mempertahankan posisi — bukan bid-nya. Lesson ini: fisika lelang yang membuat intuisi 'mahal = menang' runtuh.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="lelang">Lelang — Bukan Siapa Bayar Termahal</h2>
<p><strong>Definisi.</strong> Setiap impression dilelang real-time. <strong>Ad Rank</strong> = bid × Quality Score (relevansi, expected CTR, landing page). Urutan tampil by Ad Rank, bukan bid. <strong>Second-price (GSP)</strong>: pemenang membayar secukupnya untuk mengalahkan peringkat di bawahnya — bukan sebesar bid-nya.</p>
<p>Implikasi: <strong>naikkan kualitas = diskon permanen</strong> (bayar lebih murah untuk posisi sama). Menaikkan bid tanpa kualitas = bayar mahal untuk posisi yang sama.</p>
<Tex math={String.raw`\text{AdRank} = \text{bid} \times \text{Quality} \quad;\quad \text{CPC}_{bayar} = \frac{\text{AdRank}_{bawah}}{\text{Quality}_{kamu}} + \text{Rp}1`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\text{bid}`} />: tawaran maksimum per klik</li>
<li><Tex math={String.raw`\text{Quality`} />: skor kualitas (1–10): relevansi + expected CTR + landing page</li>
<li><Tex math={String.raw`\text{CPC}_{bayar}`} />: yang benar-benar dibayar — ditentukan pesaing di bawahmu, bukan bid-mu</li>
<li>Naikkan Quality 5→8 = CPC turun ~37% untuk AdRank yang sama</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Lelang iklan seperti <strong>lelang lukisan di mana juri juga menilai 'ketampanan' pelukisnya</strong>: pelukis tampan (quality tinggi) bisa menang dengan tawaran lebih rendah. Dan pemenang membayar 'sedikit di atas tawaran pecundang' — bukan tawaran penuhnya. Jadi: dandani dirimu (quality), bukan dompetmu (bid).</p>
<p><strong>Kapan dipakai:</strong> Setiap optimasi search/social ads. Audit quality score sebelum utak-atik bid.</p>
<details className="worked">
<summary>📐 Contoh: SepatuLari vs kompetitor (klik untuk buka)</summary>
<p>SepatuLari: bid Rp10.000, quality 4 → AdRank 40.000. Kompetitor: bid Rp6.000, quality 8 → AdRank 48.000.</p>
<p><strong>Kompetitor menang</strong> walau bid 40% lebih rendah! CPC kompetitor = 40.000/8 + 1 = <strong>Rp5.001</strong>.</p>
<p><strong>Setelah perbaiki quality</strong> 4→8: AdRank = 80.000 → menang. CPC = 48.000/8 + 1 = <strong>Rp6.001</strong> (asumsi kompetitor tetap). Posisi 1 dengan CPC <em>lebih murah</em> dari bid awal. Inilah 'diskon kualitas'.</p>
</details>
<PlotlyChart
  data={[{x: ["Bid 10rb<br>Q=4", "Bid 6rb<br>Q=8", "Bid 10rb<br>Q=8"], y: [40000, 48000, 80000], type: "bar", marker: {color: ["#e8a838","#2a7de1","#16a34a"]}, text: ["40rb","48rb","80rb"], textposition: "outside"}]}
  title={"Ad Rank: bid × quality"}
  layout={{yaxis: {title: "Ad Rank"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = Ad Rank (penentu pemenang & posisi).</p>
<p><strong>Interpretasi:</strong> Bid 10rb+Q4 (kuning) kalah dari bid 6rb+Q8 (biru). Setelah quality diperbaiki (hijau), AdRank 2x lipat dengan bid sama. <strong>Kualitas = leverage gratis.</strong> Budget iklan terbaik sering = budget bikin iklan bagus.</p>
</div>
<h2 id="funnel">Funnel Iklan — Dari Tayang ke Beli</h2>
<p><strong>Definisi.</strong> <strong>Impression</strong> (tayang) → <strong>CTR</strong> (klik/tayang) → <strong>CVR</strong> (konversi/klik) → CPA = spend/konversi. Funnel: 1.000.000 impression × CTR 1% = 10.000 klik × CVR 2% = 200 beli. <strong>Frequency</strong> = rata-rata tayang per orang; <strong>reach</strong> = orang unik.</p>
<p>Jebakan: <strong>CTR tinggi ≠ iklan bagus</strong> (clickbait: CTR 5%, CVR 0,1% — rugi). Optimasi ke <strong>CPA/ROAS</strong>, bukan CTR. Dan waspadai <strong>view-through</strong> (klaim konversi 'karena lihat iklan' tanpa klik — atribusi paling longgar).</p>
<Tex math={String.raw`\text{CPA} = \frac{\text{Spend}}{\text{Conv}} = \frac{\text{CPC}}{\text{CVR}} \quad;\quad \text{CTR} = \frac{\text{Klik}}{\text{Impression}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>CPA bisa diturunkan dua jalan: CPC turun (lelang/quality) ATAU CVR naik (landing page)</li>
<li>CTR mengukur 'menarik diklik'; CVR mengukur 'meyakinkan dibeli' — keduanya harus sehat</li>
<li>View-through: konversi ≤24 jam setelah lihat (tanpa klik) — klaim terlemah, jangan jadi metrik utama</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Funnel iklan seperti <strong>corong penjualan di pasar</strong>: teriakan (impression) → orang menoleh (klik) → orang beli (konversi). Teriakan paling keras (CTR tinggi) tidak berguna kalau yang menoleh cuma lihat-lihat (CVR rendah). Yang dihitung = pembeli, bukan penoleh.</p>
<p><strong>Kapan dipakai:</strong> Monitoring harian. Diagnosis: CTR rendah → kreatif/audiens; CVR rendah → landing page/penawaran.</p>
<details className="worked">
<summary>📐 Contoh: Clickbait vs jujur (klik untuk buka)</summary>
<p>Iklan A (clickbait): CTR 5%, CVR 0,2%, CPC Rp2.000 → CPA = 2.000/0,002 = <strong>Rp1.000.000</strong>. Iklan B (jujur): CTR 1%, CVR 3%, CPC Rp3.000 → CPA = 3.000/0,03 = <strong>Rp100.000</strong>.</p>
<p><strong>A 'menang' CTR 5x, tapi CPA-nya 10x lebih mahal.</strong> Optimasi CTR = mengoptimasi penoleh, bukan pembeli. Metrik utara = CPA/ROAS.</p>
</details>
<h2 id="bid">Bid & Budget — Otomatisasi yang Perlu Disetir</h2>
<p><strong>Definisi.</strong> <strong>Manual CPC</strong>: kamu setel bid (kontrol penuh, effort besar). <strong>tCPA</strong>: algoritma jaga CPA ≈ target (butuh ≥30 konversi/minggu untuk belajar). <strong>tROAS</strong>: maksimalkan value dengan target ROAS (butuh value tracking rapi). <strong>Budget allocation</strong>: bagi budget antar-kampanye by <strong>marginal ROAS</strong> (samakan seperti MK13).</p>
<p><strong>Frequency capping</strong>: batasi tayang per orang (mis. 3x/minggu) — frequency 50x = spam yang dibayar mahal. <strong>Pacing</strong>: habiskan budget merata (bukan habis jam 10 pagi).</p>
<p><strong>Kepribadian/intuisi:</strong> Smart bidding seperti <strong>supir taksi berpengalaman</strong>: kasih tahu tujuan (tCPA) dan ia cari jalan terbaik. Tapi ia butuh 'peta' (data konversi cukup) dan kadang nyasar (learning period) — jangan ganti tujuan tiap 2 hari. Manual = nyetir sendiri: capek tapi paham jalan.</p>
<p><strong>Kapan dipakai:</strong> tCPA/tROAS: konversi ≥30/minggu & tracking rapi. Manual: data tipis / testing. Alokasi: review mingguan by marginal ROAS.</p>
<details className="worked">
<summary>📐 Contoh: Alokasi Rp500jt (klik untuk buka)</summary>
<p>Kampanye A: spend 300jt, ROAS 4,0 (marginal 2,5). B: spend 150jt, ROAS 6,0 (marginal 5,0). C: spend 50jt, ROAS 2,0 (marginal 1,2).</p>
<p><strong>Geser Rp50jt dari A ke B:</strong> A turun ke 250jt (marginal naik ke ~2,8 — kurva!), B naik ke 200jt (marginal turun ke ~4,2). Total value naik.</p>
<p><strong>Aturan:</strong> alokasikan sampai marginal ROAS sama di semua kampanye (dan ≥ target). Review mingguan — marginal bergeser terus.</p>
</details>
<PlotlyChart
  data={[{x: [50,100,150,200,250,300], y: [8,6,5,4.2,3.5,2.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "marginal ROAS B"}, {x: [50,300], y: [3,3], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "target"}]}
  title={"Marginal ROAS vs spend (kampanye B)"}
  layout={{xaxis: {title: "Spend (Rp jt)"}, yaxis: {title: "Marginal ROAS"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = spend, Y = ROAS rupiah berikutnya. Garis hijau = target 3,0.</p>
<p><strong>Interpretasi:</strong> Marginal ROAS turun 8 → 2,5 seiring spend (saturasi!). Titik temu garis hijau ≈ Rp230jt = <strong>budget optimal B</strong>. Lebih dari itu = rupiah berikutnya di bawah target. Inilah 'kurva saturasi'-nya digital (ingat MK13) — beda baju, prinsip sama.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Matematika Lelang Iklan</h2>
<p><strong>Setiap</strong> kali kamu buka Google, <strong>lelang</strong> terjadi (<strong>milidetik</strong>!). <strong>Setiap</strong> scroll Instagram, <strong>lelang</strong> lagi! <strong>Triliunan</strong> lelang/hari. <strong>Memahami</strong> lelang = <strong>memahami</strong> digital ads. Tiga pendalaman: (1) lelang GSP; (2) funnel iklan; (3) bid &amp; budget.</p>
<h3>1. Lelang GSP — &ldquo;Bayar Harga Kedua&rdquo;</h3>
<p><strong>Definisi.</strong> <strong>GSP</strong> (Generalized Second Price): <strong>peringkat</strong> by <strong>bid × quality</strong>! <strong>Pemenang</strong> bayar <strong>harga kedua</strong> (bukan <strong>bid sendiri</strong>!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>lelang</strong> lukisan: <strong>tawar</strong> Rp10jt, <strong>pesaing</strong> Rp8jt → <strong>kamu</strong> menang, bayar <strong>Rp8jt+1</strong> (bukan <strong>Rp10jt</strong>!). <strong>Jujur</strong> = <strong>strategi optimal</strong> (tawar <strong>nilai sebenarnya</strong>!).</p>
<p><strong>Quality Score:</strong> <strong>CTR</strong> + <strong>relevansi</strong> + <strong>landing page</strong>! <strong>Bid tinggi</strong> + <strong>quality rendah</strong> = <strong>kalah</strong> dari <strong>bid rendah</strong> + <strong>quality tinggi</strong>! (<strong>Google</strong> = <strong>tidak</strong> mau iklan <strong>jelek</strong>!)</p>
<p><strong>Ad Rank</strong> = bid × quality. <strong>Bayar</strong> = (Ad Rank <strong>berikutnya</strong> / quality <strong>kamu</strong>) + Rp1.</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> search ads! <strong>Optimasi:</strong> <strong>naikkan</strong> quality (<strong>lebih murah</strong> dari <strong>naikkan</strong> bid!).</p>
<Tex math={String.raw`\text{Ad Rank} = \text{Bid} \times \text{Quality}`} block />
<p><strong>Artinya tiap simbol:</strong> <strong>Bid</strong> = tawaran; <strong>Quality</strong> = skor kualitas (1–10!). <strong>Rank</strong> = <strong>peringkat</strong>. <strong>Tinggi</strong> = <strong>menang</strong>.</p>
<details className="worked">
<summary>📐 Contoh 1: Lelang 3 pengiklan (klik untuk buka)</summary>
<p><strong>A:</strong> bid Rp10rb, quality 8 → rank = <strong>80</strong>. <strong>B:</strong> bid Rp15rb, quality 5 → rank = <strong>75</strong>. <strong>C:</strong> bid Rp8rb, quality 9 → rank = <strong>72</strong>.</p>
<p><strong>Pemenang: A</strong> (rank 80! — <strong>bukan</strong> bid <strong>tertinggi</strong> B!). <strong>Bayar A:</strong> (75 / 8) + 1 = <strong>Rp9.376</strong> (bukan <strong>Rp10rb</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>B</strong> (bid <strong>tertinggi</strong>!) = <strong>kalah</strong> (quality <strong>rendah</strong>!). <strong>Quality</strong> = <strong>pengali</strong>. <strong>Naikkan</strong> quality dari 5→8 = <strong>seperti</strong> naikkan bid <strong>60%</strong>!</p>
</details>
<h3>2. Funnel Iklan — Dari Lihat ke Beli</h3>
<p><strong>Definisi.</strong> <strong>Funnel:</strong> <strong>Impression</strong> (lihat!) → <strong>Click</strong> (klik!) → <strong>Convert</strong> (beli!). <strong>Setiap</strong> tahap = <strong>metrik</strong>: <strong>CTR</strong> (click/impression!), <strong>CVR</strong> (convert/click!), <strong>CPA</strong> (cost/convert!).</p>
<p><strong>Kepribadian:</strong> seperti <strong>corong</strong>: <strong>1.000</strong> lihat → <strong>50</strong> klik (CTR 5%!) → <strong>5</strong> beli (CVR 10%!). <strong>Bocor</strong> di <strong>mana</strong>? <strong>CTR rendah</strong> = <strong>iklan jelek</strong>! <strong>CVR rendah</strong> = <strong>landing page jelek</strong>! <strong>Diagnosis</strong> by <strong>tahap</strong>!</p>
<p><strong>Metrik:</strong> <strong>CPC</strong> (cost/click!), <strong>CPA</strong> (cost/action!), <strong>ROAS</strong> (revenue/cost!). <strong>Target:</strong> <strong>CPA &lt; margin</strong>! (<strong>Rugi</strong> jika <strong>lebih</strong>!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> kampanye! <strong>Diagnosis</strong> funnel (<strong>mana</strong> yang <strong>bocor</strong>?). <strong>Optimasi</strong> tahap <strong>terlemah</strong>.</p>
<Tex math={String.raw`\text{CPA} = \frac{\text{Cost}}{\text{Conversions}} < \text{Margin}`} block />
<p><strong>Aturan emas:</strong> <strong>CPA</strong> harus <strong>di bawah</strong> margin! <strong>CPA = margin</strong> = <strong>impas</strong>. <strong>CPA &gt; margin</strong> = <strong>bakar uang</strong>.</p>
<details className="worked">
<summary>📐 Contoh 2: Diagnosis funnel (klik untuk buka)</summary>
<p><strong>Kampanye:</strong> 10.000 impression, 200 klik (CTR <strong>2%</strong>!), 10 convert (CVR <strong>5%</strong>!). Cost Rp1jt. Margin Rp150rb.</p>
<p><strong>CPA:</strong> 1jt/10 = <strong>Rp100rb</strong> (&lt; 150rb! — <strong>profit</strong>!). <strong>ROAS:</strong> (10×150rb)/1jt = <strong>1,5</strong>.</p>
<p><strong>Diagnosis:</strong> CTR 2% = <strong>rendah</strong> (benchmark 5%!). <strong>Masalah:</strong> <strong>iklan</strong> (bukan <strong>landing page</strong>! — CVR 5% = <strong>OK</strong>!). <strong>Aksi:</strong> <strong>perbaiki</strong> kreatif (bukan <strong>landing page</strong>!).</p>
<p><strong>Jika</strong> CTR naik ke 5% (500 klik!): convert = 500×5% = <strong>25</strong>! CPA = 1jt/25 = <strong>Rp40rb</strong>! ROAS = <strong>3,75</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>diagnosis</strong> by <strong>tahap</strong> = <strong>aksi</strong> tepat. <strong>Salah</strong> diagnosis = <strong>optimasi</strong> yang <strong>salah</strong>.</p>
</details>
<h3>3. Bid &amp; Budget — Strategi</h3>
<p><strong>Manual bidding:</strong> kamu <strong>atur</strong> bid (kontrol! tapi <strong>ribet</strong>!). <strong>Automated:</strong> algoritma <strong>atur</strong> (mudah! tapi <strong>black box</strong>!). <strong>Target CPA:</strong> &ldquo;bayar <strong>maks</strong> Rp100rb/convert!&rdquo; <strong>Target ROAS:</strong> &ldquo;revenue <strong>min</strong> 3x cost!&rdquo;</p>
<p><strong>Budget:</strong> <strong>harian</strong> (Rp1jt/hari!). <strong>Jangan</strong> terlalu <strong>kecil</strong> (algoritma <strong>tidak</strong> belajar!). <strong>Jangan</strong> terlalu <strong>besar</strong> (boros!). <strong>Aturan:</strong> budget &gt; <strong>10x</strong> target CPA (<strong>ruang</strong> belajar!).</p>
<p><strong>Kepribadian:</strong> <strong>manual</strong> = <strong>kemudi sendiri</strong> (kontrol! capek!). <strong>Otomatis</strong> = <strong>autopilot</strong> (santai! <strong>percaya</strong> mesin!). <strong>Pilih</strong> sesuai <strong>skill</strong> &amp; <strong>waktu</strong>.</p>
<p><strong>Kapan dipakai:</strong> <strong>Mulai</strong> manual (belajar!). <strong>Scale</strong> otomatis (efisien!). <strong>Selalu</strong> dengan <strong>target</strong> (CPA! ROAS!).</p>
<details className="worked">
<summary>📐 Contoh 3: Target CPA (klik untuk buka)</summary>
<p><strong>Margin:</strong> Rp200rb. <strong>Target CPA:</strong> Rp150rb (75% margin! — <strong>sisakan</strong> profit!).</p>
<p><strong>Hasil:</strong> 20 convert, cost Rp3jt. <strong>CPA aktual:</strong> 3jt/20 = <strong>Rp150rb</strong> ✓. <strong>Profit:</strong> 20×(200−150)rb = <strong>Rp1jt</strong>.</p>
<p><strong>Jika</strong> CPA naik ke Rp250rb: <strong>rugi</strong> 20×50rb = <strong>Rp1jt</strong>! <strong>Aksi:</strong> <strong>turunkan</strong> bid atau <strong>perbaiki</strong> CVR!</p>
<p><strong>Pelajaran:</strong> <strong>target</strong> = <strong>rem</strong>. <strong>Tanpa</strong> target = <strong>ngebut</strong> tanpa rem.</p>
</details>
<PlotlyChart
  data={[{x: ["Impression", "Click", "Convert"], y: [10000, 200, 10], type: "bar", marker: {color: ["#94a3b8", "#2a7de1", "#22c55e"]}}]}
  title={"Funnel: 10.000 → 200 → 10"}
  layout={{yaxis: {title: "Jumlah"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Setiap batang = <strong>tahap</strong> funnel. <strong>Menyusut</strong> drastis!</p>
<p><strong>Interpretasi:</strong> <strong>CTR</strong> 2% (200/10.000!). <strong>CVR</strong> 5% (10/200!). <strong>Total</strong> conversion rate: 0,1% (10/10.000!). <strong>Normal</strong>! <strong>Jangan</strong> panik lihat <strong>0,1%</strong> — <strong>lihat</strong> CPA!</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Bid tertinggi selalu menang lelang. Menaikkan bid = solusi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pemenang = <strong>Ad Rank tertinggi</strong> (bid × quality). Kasus SepatuLari: bid 3x tetap kalah dari kompetitor ber-quality tinggi. Menaikkan bid tanpa quality = <strong>bayar lebih untuk posisi sama</strong> (second-price). Audit quality dulu — sering 'diskon 37%' menanti.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CTR tinggi = iklan bagus. Optimasi CTR saja.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Clickbait: CTR 5%, CVR 0,2% → CPA Rp1jt vs iklan jujur CTR 1%, CVR 3% → CPA Rp100rb. <strong>CTR mengukur penoleh, CPA mengukur pembeli.</strong> Metrik utara = CPA/ROAS; CTR hanya diagnostik (kreatif/audiens bermasalah?).</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Quality score = diskon permanen.</strong> Naik 5→8 ≈ CPC turun 37% untuk posisi sama — selamanya, di semua lelang. Investasi kreatif & landing page = satu-satunya 'bid' yang tidak habis.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Jangan ganti strategi bid tiap 2 hari.</strong> Smart bidding butuh learning period (±30 konversi). Gonta-ganti target = algoritma tidak pernah lulus 'sekolah'. Komitmen minimal 2 minggu per setting.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Simulator Lelang GSP</h2>
<p>Simulasikan lelang: masukkan bid & quality tiap pengiklan, lihat siapa menang & berapa bayar.</p>
<PyodideLab
  title={"Lab 1 — Simulator Lelang"}
  hint={"Naikkan quality-mu 4 → 9 (bid tetap). Lihat posisimu naik DAN CPC turun — 'diskon kualitas'."}
  defaultCode={"# Simulator lelang GSP (Generalized Second Price)\npengiklan = [\n    (\"Kamu\",     10000, 4),   # (nama, bid, quality) — ubah sesukamu\n    (\"Kompetitor\", 6000, 8),\n    (\"BrandC\",     8000, 5),\n]\nrank = sorted(pengiklan, key=lambda p: p[1]*p[2], reverse=True)\nprint(f\"{'pos':>4} {'nama':<11} {'bid':>7} {'Q':>3} {'adrank':>7}  bayar/klik\")\nfor i, (nama, bid, q) in enumerate(rank):\n    adr = bid*q\n    bayar = rank[i+1][1]*rank[i+1][2]/q + 1 if i+1 < len(rank) else 1\n    print(f\"{i+1:>4} {nama:<11} {bid:>7,} {q:>3} {adr:>7,}  Rp{bayar:,.0f}\")\nprint(\"\\nPemenang = AdRank tertinggi, bayar = secukupnya kalahkan di bawahnya.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Alokator Budget Marginal</h2>
<p>Bagi budget Rp500jt ke 3 kampanye agar marginal ROAS seimbang.</p>
<PyodideLab
  title={"Lab 2 — Alokator Budget"}
  hint={"Ubah kurva salah satu kampanye (marginal turun lebih cepat). Lihat alokasi bergeser — alokasi = makhluk hidup, bukan sekali set."}
  defaultCode={"# Alokasi budget: samakan marginal ROAS (pendekatan iteratif sederhana)\n# marginal ROAS tiap kampanye sebagai fungsi spend (jt)\ndef mA(s): return max(8 - 0.02*s, 0.5)\ndef mB(s): return max(10 - 0.03*s, 0.5)\ndef mC(s): return max(4 - 0.01*s, 0.5)\n\nTOTAL = 500\nalokasi = {\"A\": TOTAL/3, \"B\": TOTAL/3, \"C\": TOTAL/3}\nm = {\"A\": mA, \"B\": mB, \"C\": mC}\nfor _ in range(200):  # geser 1jt dari marginal terendah ke tertinggi\n    ms = {k: m[k](v) for k, v in alokasi.items()}\n    hi = max(ms, key=ms.get); lo = min(ms, key=ms.get)\n    if ms[hi] - ms[lo] < 0.05: break\n    alokasi[hi] += 1; alokasi[lo] -= 1\n\nprint(\"Alokasi optimal (Rp jt) & marginal ROAS:\")\nfor k in \"ABC\":\n    print(f\"  {k}: {alokasi[k]:6.0f} jt  (marginal {m[k](alokasi[k]):.2f})\")\nprint(\"\\nPrinsip: rupiah terakhir di tiap kampanye harus sama 'produktif'-nya.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Quality score rendah (&lt;5) → <strong>Perbaiki kreatif & landing page DULU</strong></h3>
<p><strong>Kenapa:</strong> Diskon permanen 30–40%; bid tidak menutup quality jeblok.</p>
<p><strong>Contoh nyata:</strong> Audit QS mingguan sebelum utak-atik bid.</p>
</div>
<div className="decision-card">
<h3>2. Konversi ≥30/minggu, tracking rapi → <strong>tCPA/tROAS</strong></h3>
<p><strong>Kenapa:</strong> Algoritma optimasi lebih baik dari manusia di skala ini.</p>
<p><strong>Contoh nyata:</strong> E-commerce mapan.</p>
</div>
<div className="decision-card">
<h3>3. Data tipis / fase testing → <strong>Manual CPC + budget kecil</strong></h3>
<p><strong>Kenapa:</strong> Smart bidding butuh data; jangan sekolahkan algoritma dengan uang receh.</p>
<p><strong>Contoh nyata:</strong> Produk baru, kampanye baru.</p>
</div>
<div className="decision-card">
<h3>4. Frequency &gt; 10/minggu per orang → <strong>Frequency cap + perluas audiens/kreatif</strong></h3>
<p><strong>Kenapa:</strong> Spam berbayar: CPA naik, brand turun.</p>
<p><strong>Contoh nyata:</strong> Cap 3x/minggu; rotasi 3+ kreatif.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Ad Rank = bid × quality.</strong> Quality dulu.</li><li><strong>Optimasi CPA/ROAS</strong>, bukan CTR.</li><li><strong>Samakan marginal ROAS</strong> antar-kampanye.</li><li><strong>Frequency cap</strong> selalu.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Quality Score yang Menghemat 40%</h3>
<p>SaaS &ldquo;KerjaKita&rdquo;: CPC <strong>Rp15rb</strong> (mahal!). <strong>Quality</strong> 5/10. <strong>Aksi:</strong> <strong>perbaiki</strong> landing page (relevansi! kecepatan!). <strong>Quality</strong> → 8/10. <strong>CPC</strong> → <strong>Rp9rb</strong> (−40%!). <strong>Posisi</strong> = <strong>sama</strong>!</p>
<p><strong>Pelajaran:</strong> <strong>quality</strong> = <strong>diskon</strong>. <strong>Naikkan</strong> quality = <strong>turunkan</strong> biaya (<strong>tanpa</strong> turunkan posisi!). <strong>Investasi</strong> landing page = <strong>ROI tertinggi</strong>.</p>
<h3>Kisah 2: Automated Bidding yang Menggila</h3>
<p>E-commerce &ldquo;BeliYuk&rdquo;: <strong>target CPA</strong> Rp50rb. <strong>Algoritma</strong> = <strong>boros</strong> (CPA Rp80rb!). <strong>Investigasi:</strong> <strong>conversion tracking</strong> = <strong>page view</strong> (bukan <strong>purchase</strong>!). <strong>Algoritma</strong> optimasi <strong>page view</strong> (murah! banyak!) bukan <strong>purchase</strong>!</p>
<p><strong>Solusi:</strong> <strong>perbaiki</strong> tracking (purchase!). <strong>CPA</strong> → <strong>Rp45rb</strong>. <strong>Pelajaran:</strong> <strong>algoritma</strong> = <strong>sebaik</strong> data yang <strong>diberi</strong>. <strong>Sampah</strong> masuk = <strong>sampah</strong> keluar.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Bid tertinggi = menang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Ad Rank</strong> = bid × <strong>quality</strong>! <strong>Bid tinggi</strong> + <strong>quality rendah</strong> = <strong>kalah</strong>! <strong>Naikkan</strong> quality (<strong>lebih murah</strong>!) sebelum <strong>naikkan</strong> bid.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Boncos SepatuLari</h2>
<div className="callout">
<p>SepatuLari: bid naik 3x → posisi naik sedikit, CPA naik 2,5x. Quality score 4/10 (landing page lambat, relevansi rendah). Kompetitor: bid lebih rendah, QS 8/10.</p>
<p><strong>Pertanyaan:</strong> (a) Jelaskan mekanismenya (rumus). (b) Rencana perbaikan 2 minggu? (c) Kapan boleh menaikkan bid?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>AdRank = 10.000×4 = 40rb &lt; 6.000×8 = 48rb</strong> → kalah walau bid 67% lebih tinggi. CPC yang dibayar ditentukan AdRank bawah/QS sendiri — QS rendah = bayar mahal untuk posisi apa pun.</p>
<p>(b) <strong>Minggu 1:</strong> perbaiki landing (speed, relevansi keyword) + 3 varian kreatif → target QS 7+. <strong>Minggu 2:</strong> uji dengan bid SAMA; ukur CPC & CPA. Ekspektasi: CPC turun ~35%.</p>
<p>(c) <strong>Boleh naik bid jika:</strong> QS sudah sehat (≥7), marginal ROAS masih &gt; target (ada ruang), dan untuk <em>scale</em> — bukan untuk menutup quality jeblok.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — GSP.</strong> A: bid 12rb, q7. B: bid 10rb, q9. Siapa menang? Berapa bayar?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p><strong>Rank A:</strong> 12×7 = <strong>84</strong>. <strong>Rank B:</strong> 10×9 = <strong>90</strong>. <strong>Menang: B</strong>!</p>
<p><strong>Bayar B:</strong> (84/9) + 1 = 9,33 + 1 = <strong>Rp10.333</strong> (bukan <strong>Rp10rb</strong>! — <strong>sedikit</strong> di atas!).</p>
<p><strong>Pelajaran:</strong> <strong>B</strong> (bid <strong>lebih rendah</strong>!) = <strong>menang</strong> (quality <strong>lebih tinggi</strong>!).</p>
</details>
<p><strong>Soal 2 — Funnel.</strong> 5.000 imp, CTR 4%, CVR 8%, CPC Rp5rb. Hitung klik, convert, cost, CPA.</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Klik:</strong> 5.000×4% = <strong>200</strong>. <strong>Convert:</strong> 200×8% = <strong>16</strong>. <strong>Cost:</strong> 200×5rb = <strong>Rp1jt</strong>. <strong>CPA:</strong> 1jt/16 = <strong>Rp62.500</strong>.</p>
<p><strong>Profit</strong> jika margin Rp100rb: 16×(100−62,5)rb = <strong>Rp600rb</strong>.</p>
</details>
<p><strong>Soal 3 — Budget.</strong> Target CPA Rp100rb. Berapa <strong>budget harian</strong> minimal? Mengapa?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>Minimal:</strong> 10×100rb = <strong>Rp1jt/hari</strong>.</p>
<p><strong>Mengapa:</strong> algoritma butuh <strong>~10 conversion</strong> untuk <strong>belajar</strong>. <strong>Budget</strong> kecil = <strong>tidak</strong> cukup data = <strong>tidak</strong> belajar = <strong>gagal</strong>.</p>
</details>
<p><strong>Soal 4 — ROAS.</strong> Cost Rp2jt, revenue Rp6jt. Hitung ROAS. Bagus? Jika margin 30%?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>ROAS:</strong> 6/2 = <strong>3,0</strong>.</p>
<p><strong>Profit:</strong> revenue 6jt × margin 30% = <strong>1,8jt</strong>. <strong>Net:</strong> 1,8 − 2 = <strong>−Rp200rb</strong>! <strong>RUGI</strong> (walau <strong>ROAS 3,0</strong>!).</p>
<p><strong>Pelajaran:</strong> <strong>ROAS</strong> = <strong>vanity</strong> jika <strong>margin</strong> kecil. <strong>Hitung</strong> profit! <strong>ROAS 3,0</strong> + <strong>margin 30%</strong> = <strong>rugi</strong>!</p>
</details>
<div className="tip">
<p><strong>💡 Tiga aturan digital ads: (1) <em>quality</em> sebelum bid; (2) <em>diagnosis</em> by funnel; (3) <em>CPA &lt; margin</em> (bukan ROAS!). Tiga aturan = iklan yang profit.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. A: bid 10rb, Q4. B: bid 6rb, Q8. Siapa menang dan berapa CPC B?"}
  options={
    ["A menang",
    "B menang, CPC ≈ Rp5.001",
    "Seri",
    "Tidak bisa dihitung"]
  }
  correct={1}
  explanation={"Benar: AdRank B=48rb &gt; A=40rb → B menang. CPC B = 40.000/8+1 = Rp5.001 (second-price: bayar secukupnya kalahkan A)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Iklan clickbait CTR 5% CVR 0,2% CPC Rp2rb vs jujur CTR 1% CVR 3% CPC Rp3rb. CPA?"}
  options={
    ["Clickbait lebih murah",
    "Jujur Rp100rb vs clickbait Rp1jt — jujur 10x lebih murah",
    "Sama",
    "CTR menentukan"]
  }
  correct={1}
  explanation={"Benar: CPA = CPC/CVR. Clickbait: 2.000/0,002 = Rp1jt. Jujur: 3.000/0,03 = Rp100rb. CTR tinggi ≠ murah."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Kapan memakai tCPA?"}
  options={
    ["Selalu",
    "Konversi ≥30/minggu + tracking rapi",
    "Data tipis",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: smart bidding butuh 'sekolah' (data). Di bawah 30 konversi/minggu, algoritma menebak-nebak — manual lebih baik."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Frequency 50x/minggu per orang. Tindakan?"}
  options={
    ["Naikkan budget",
    "Frequency cap + perluas audiens/kreatif",
    "Biarkan",
    "Naikkan bid"]
  }
  correct={1}
  explanation={"Benar: 50x = spam berbayar — CPA naik (kelelahan), brand turun. Cap 3x/minggu + rotasi kreatif."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Alokasi optimal antar-kampanye tercapai saat?"}
  options={
    ["Budget sama rata",
    "Marginal ROAS sama (dan ≥ target)",
    "ROAS rata-rata sama",
    "Spend terbesar menang"]
  }
  correct={1}
  explanation={"Benar: rupiah terakhir harus sama produktifnya di semua kampanye. Rata-rata menipu (ingat saturasi MK13)."}
/>

      <h2 id="masterclass">🎓 Masterclass Digital Ads: Dari Nol ke Scale</h2>
<p><strong>Digital ads</strong> = <strong>Rp100 triliun</strong>/tahun di Indonesia! <strong>Masterclass</strong> lengkap: <strong>strategi</strong>, <strong>eksekusi</strong>, <strong>optimasi</strong>, <strong>scale</strong>.</p>
<h3>Modul 1: Strategi (Minggu 1–2)</h3>
<p><strong>Tentukan:</strong> <strong>tujuan</strong> (brand? <strong>sales</strong>?), <strong>audiens</strong> (siapa?), <strong>budget</strong> (berapa?), <strong>channel</strong> (mana?).</p>
<p><strong>Framework:</strong> <strong>70-20-10</strong>! (<strong>70%</strong> proven! <strong>20%</strong> promising! <strong>10%</strong> experimental!). <strong>Contoh:</strong> budget Rp10jt → <strong>7jt</strong> Google (proven!), <strong>2jt</strong> Meta (promising!), <strong>1jt</strong> TikTok (experimental!).</p>
<p><strong>Persona:</strong> <strong>buat</strong> 3–5 persona (<strong>nama</strong>! umur! <strong>minat</strong>! masalah!). <strong>Contoh:</strong> &ldquo;Budi, 28, <strong>suka</strong> gadget, <strong>masalah:</strong> HP <strong>lemot</strong>.&rdquo;</p>
<p><strong>Customer journey:</strong> <strong>petakan</strong>! (<strong>Awareness</strong> → Consideration → Purchase!). <strong>Konten</strong> per tahap!</p>
<details className="worked">
<summary>📐 Contoh strategi lengkap (klik untuk buka)</summary>
<p><strong>Bisnis:</strong> Kopi <strong>online</strong>. <strong>Tujuan:</strong> <strong>sales</strong> (ROAS 3!). <strong>Audiens:</strong> 25–35, <strong>Jakarta</strong>, suka <strong>kopi</strong>. <strong>Budget:</strong> Rp20jt/bulan.</p>
<p><strong>Alokasi:</strong> <strong>14jt</strong> Meta (proven! — <strong>visual</strong>!), <strong>4jt</strong> Google (promising! — <strong>search</strong> &ldquo;kopi online&rdquo;!), <strong>2jt</strong> TikTok (experimental!).</p>
<p><strong>Persona:</strong> &ldquo;Sari, 29, <strong>kerja</strong> kantoran, <strong>butuh</strong> kopi <strong>praktis</strong>.&rdquo;</p>
<p><strong>Journey:</strong> <strong>Awareness</strong> (video! &ldquo;kopi <strong>nikmat</strong> di rumah&rdquo;), <strong>Consideration</strong> (testimoni!), <strong>Purchase</strong> (diskon <strong>10%</strong>!).</p>
</details>
<h3>Modul 2: Eksekusi (Minggu 3–4)</h3>
<p><strong>Setup:</strong> <strong>akun</strong>! <strong>pixel</strong>! <strong>katalog</strong>! <strong>tracking</strong>! (<strong>Jangan</strong> iklan tanpa <strong>tracking</strong>!).</p>
<p><strong>Kreatif:</strong> <strong>5–10</strong> varian! (<strong>gambar</strong>! video! <strong>copy</strong>!). <strong>Aturan:</strong> <strong>hook</strong> 3 detik! (<strong>video</strong>!). <strong>CTA</strong> jelas! (<strong>&ldquo;Beli Sekarang!&rdquo;</strong>).</p>
<p><strong>Targeting:</strong> <strong>mulai</strong> luas! (<strong>biarkan</strong> algoritma belajar!). <strong>Persempit</strong> jika <strong>perlu</strong>.</p>
<p><strong>Launch:</strong> <strong>semua</strong> varian! <strong>Budget</strong> kecil! (<strong>test</strong> dulu!).</p>
<details className="worked">
<summary>📐 Contoh eksekusi (klik untuk buka)</summary>
<p><strong>Setup:</strong> <strong>Pixel</strong> terpasang! <strong>Katalog</strong> 50 produk! <strong>Conversion</strong> = purchase!</p>
<p><strong>Kreatif:</strong> <strong>10</strong> video (UGC! <strong>unboxing</strong>! testimoni!). <strong>Copy:</strong> &ldquo;Kopi <strong>premium</strong>, harga <strong>kaki lima</strong>!&rdquo;</p>
<p><strong>Targeting:</strong> 25–35, <strong>Jakarta</strong>, minat <strong>kopi</strong>. (<strong>Luas</strong>! — <strong>2jt</strong> orang!).</p>
<p><strong>Launch:</strong> <strong>10</strong> ad set (1 per <strong>kreatif</strong>!). <strong>Budget:</strong> Rp100rb/hari <strong>masing-masing</strong>!</p>
</details>
<h3>Modul 3: Optimasi (Minggu 5–8)</h3>
<p><strong>Analisis:</strong> <strong>3</strong> hari pertama (<strong>jangan</strong> sentuh!). <strong>7</strong> hari (<strong>evaluasi</strong>!). <strong>Matikan</strong> yang <strong>jelek</strong> (CPA &gt; <strong>2x</strong> target!). <strong>Scale</strong> yang <strong>bagus</strong> (CPA &lt; target!).</p>
<p><strong>Iterasi:</strong> <strong>buat</strong> varian dari <strong>pemenang</strong>! (<strong>jangan</strong> dari yang <strong>kalah</strong>!). <strong>Test</strong> baru!</p>
<p><strong>Frekuensi:</strong> <strong>monitor</strong>! (<strong>&gt;3</strong> = <strong>fatigue</strong>!). <strong>Refresh</strong> kreatif!</p>
<details className="worked">
<summary>📐 Contoh optimasi (klik untuk buka)</summary>
<p><strong>Hari 7:</strong> <strong>3</strong> pemenang (CPA Rp40rb! — target Rp50rb!). <strong>7</strong> pecundang (CPA Rp100rb+!).</p>
<p><strong>Aksi:</strong> <strong>Matikan</strong> 7! <strong>Scale</strong> 3 (budget <strong>2x</strong>!). <strong>Buat</strong> 5 varian <strong>baru</strong> dari pemenang!</p>
<p><strong>Hari 14:</strong> <strong>2</strong> pemenang baru! <strong>CPA</strong> rata-rata: Rp45rb! (<strong>turun</strong> dari Rp70rb!).</p>
<p><strong>Pelajaran:</strong> <strong>optimasi</strong> = <strong>bunuh</strong> yang jelek, <strong>kembangbiakkan</strong> yang bagus.</p>
</details>
<h3>Modul 4: Scale (Bulan 3+)</h3>
<p><strong>Vertical:</strong> <strong>naikkan</strong> budget (<strong>20%</strong>/hari! — <strong>jangan</strong> 2x!). <strong>Horizontal:</strong> <strong>tambah</strong> audiens! (<strong>lookalike</strong>! <strong>baru</strong>!).</p>
<p><strong>Automasi:</strong> <strong>rules</strong>! (<strong>matikan</strong> jika CPA &gt; X!). <strong>CBO</strong>! (<strong>biarkan</strong> algoritma alokasi!).</p>
<p><strong>Ekspansi:</strong> <strong>channel</strong> baru! (<strong>TikTok</strong>! <strong>Google</strong>!). <strong>Retargeting</strong>! (<strong>warm</strong> audiens!).</p>
<details className="worked">
<summary>📐 Contoh scale (klik untuk buka)</summary>
<p><strong>Bulan 1:</strong> Rp20jt → <strong>Rp60jt</strong> revenue (ROAS 3!). <strong>Bulan 2:</strong> <strong>scale</strong> ke Rp40jt → <strong>Rp110jt</strong> (ROAS 2,75! — <strong>turun</strong> sedikit! <strong>wajar</strong>!). <strong>Bulan 3:</strong> <strong>tambah</strong> Google (Rp10jt!) → <strong>total</strong> Rp50jt → <strong>Rp140jt</strong>.</p>
<p><strong>Pelajaran:</strong> <strong>scale</strong> = <strong>bertahap</strong>. <strong>ROAS</strong> turun <strong>sedikit</strong> = <strong>wajar</strong>. <strong>Turun</strong> banyak = <strong>berhenti</strong>!</p>
</details>
<div className="callout">
<p><strong>What:</strong> 4 modul (strategi! eksekusi! optimasi! scale!). Dari Rp0 ke Rp140jt/bulan dalam 3 bulan.</p>
<p><strong>So what:</strong> <strong>Digital ads</strong> = <strong>sistem</strong>, bukan <strong>judi</strong>. <strong>Ikuti</strong> sistem!</p>
<p><strong>Now what:</strong> (1) <strong>Strategi</strong> dulu! (2) <strong>Eksekusi</strong> cepat! (3) <strong>Optimasi</strong> kejam! (4) <strong>Scale</strong> bertahap!</p>
</div>
<div className="tip">
<p><strong>💡 <em>Empat modul</em> = <em>peta</em> digital ads. <em>Jangan</em> loncat <em>modul</em>.</strong></p>
</div>

      <h2 id="kisahads">📖 Kisah Nyata: Dari Rp10 Juta ke Rp1 Miliar</h2>
<p>Di sebuah kota kecil di Jawa Tengah, ada seorang pengusaha kopi bernama Pak Joko. Ia memiliki warung kopi yang cukup ramai, tetapi ia bermimpi untuk menjual kopinya secara online ke seluruh Indonesia. Ia mendengar tentang &ldquo;iklan digital&rdquo; tetapi tidak tahu harus mulai dari mana.</p>
<p>Suatu hari, ia bertemu denganmu, seorang konsultan digital marketing. &ldquo;Saya punya budget Rp10 juta,&rdquo; katanya dengan ragu. &ldquo;Apakah cukup untuk mulai?&rdquo; Kamu tersenyum. &ldquo;Cukup, Pak. Bahkan lebih dari cukup untuk mulai. Yang penting bukan besarnya budget, tetapi strateginya.&rdquo;</p>
<p>Kamu mulai dengan mengedukasi Pak Joko tentang funnel iklan dari MK16. &ldquo;Bayangkan ada 10.000 orang yang melihat iklan Bapak (impression). Dari 10.000 itu, mungkin 500 yang klik (CTR 5%). Dari 500 yang klik, mungkin 25 yang beli (CVR 5%). Jadi dari 10.000 impression, kita dapat 25 pembeli.&rdquo;</p>
<p>Pak Joko terlihat pucat. &ldquo;Hanya 25 dari 10.000? Itu kecil sekali!&rdquo; Kamu mengangguk. &ldquo;Memang kecil, Pak. Tapi mari kita hitung. Jika Bapak jual kopi Rp100 ribu per bungkus dengan margin Rp40 ribu, maka 25 pembeli menghasilkan Rp1 juta profit. Jika biaya iklan untuk 10.000 impression adalah Rp500 ribu, maka Bapak untung Rp500 ribu. ROAS-nya 2!&rdquo;</p>
<p>Pak Joko mulai paham. &ldquo;Jadi yang penting bukan berapa banyak yang lihat, tetapi berapa CPA-nya?&rdquo; &ldquo;Tepat sekali, Pak!&rdquo; katamu. &ldquo;CPA harus di bawah margin. Jika CPA Rp20 ribu dan margin Rp40 ribu, Bapak untung Rp20 ribu per pembeli.&rdquo;</p>
<p>Kamu kemudian membantu Pak Joko membuat strategi. Budget Rp10 juta dibagi: Rp7 juta untuk Meta Ads (karena visual kopi sangat menarik!), Rp2 juta untuk Google Ads (untuk menangkap orang yang mencari &ldquo;kopi enak&rdquo;!), Rp1 juta untuk TikTok (eksperimen!).</p>
<p>Kamu membuat 10 varian kreatif: video proses sangrai, foto kemasan, testimoni pelanggan, video cara seduh. Kamu meluncurkan semuanya dengan budget kecil Rp50 ribu per hari per varian.</p>
<p>Setelah satu minggu, hasilnya terlihat. Tiga varian memiliki CPA Rp15 ribu (bagus! di bawah margin Rp40 ribu!). Tujuh varian memiliki CPA Rp80 ribu (jelek! di atas margin!). Kamu mematikan tujuh yang jelek dan menggandakan budget untuk tiga yang bagus.</p>
<p>Kamu juga mengoptimalkan quality score. Kamu memperbaiki landing page: loading lebih cepat, foto lebih bagus, copy lebih jelas. Quality score naik dari 5 ke 8. CPC turun dari Rp3.000 ke Rp1.800! Dengan budget yang sama, Pak Joko mendapatkan 67% lebih banyak klik!</p>
<p>Setelah satu bulan, hasilnya luar biasa. Dari budget Rp10 juta, Pak Joko mendapatkan revenue Rp35 juta! ROAS 3,5! Profit Rp14 juta (setelah dikurangi biaya iklan dan COGS)!</p>
<p>Pak Joko sangat senang. &ldquo;Ini luar biasa!&rdquo; katanya. &ldquo;Bisakah kita scale?&rdquo; Kamu mengangguk, tetapi dengan peringatan. &ldquo;Bisa, Pak. Tapi harus bertahap. Naikkan budget 20% per minggu, bukan langsung 10 kali lipat. Dan pantau CPA. Jika CPA naik di atas Rp30 ribu, berhenti!&rdquo;</p>
<p>Tiga bulan kemudian, budget sudah Rp50 juta per bulan dengan revenue Rp140 juta! Pak Joko kini memiliki tim kecil untuk mengelola iklan. Ia bahkan mulai menjual ke luar Jawa!</p>
<p>Satu tahun kemudian, Pak Joko mengundangmu ke peresmian pabrik barunya. &ldquo;Dulu saya hanya punya warung kecil,&rdquo; katanya dengan mata berkaca-kaca. &ldquo;Sekarang saya punya pabrik dan 50 karyawan. Semua berawal dari Rp10 juta dan strategi yang benar.&rdquo;</p>
<div className="callout">
<p><strong>What:</strong> Rp10 juta → Rp140 juta/bulan dalam 3 bulan. Strategi: funnel! CPA! quality! scale bertahap!</p>
<p><strong>So what:</strong> <strong>Digital ads</strong> = <strong>sistem</strong>. <strong>Ikuti</strong> sistem = <strong>berhasil</strong>.</p>
<p><strong>Now what:</strong> (1) <strong>Pahami</strong> funnel! (2) <strong>CPA</strong> &lt; margin! (3) <strong>Optimasi</strong> kejam! (4) <strong>Scale</strong> bertahap!</p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-gsp">📐 Worked Example: Lelang GSP Dihitung Tangan — Kenapa Bid Tertinggi Bisa Kalah</h2>
<p>Google Ads memakai <strong>Generalized Second Price</strong> (varian): pemenang bukan bid tertinggi, melainkan <strong>Ad Rank</strong> (bid × quality) tertinggi — dan ia membayar <strong>seperlunya</strong> untuk mengalahkan peringkat di bawahnya. Contoh 4 pengiklan memperebutkan 3 slot iklan:</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Pengiklan</th><th>Bid (Rp)</th><th>Quality Score</th><th>Ad Rank (Bid × QS)</th></tr></thead>
<tbody>
<tr><td>A — Brand besar</td><td>10.000</td><td>4</td><td>40.000</td></tr>
<tr><td>B — Spesialis niche</td><td>6.000</td><td>9</td><td>54.000</td></tr>
<tr><td>C — Pendatang baru</td><td>8.000</td><td>5</td><td>40.000</td></tr>
<tr><td>D — Agresif</td><td>12.000</td><td>3</td><td>36.000</td></tr>
</tbody>
</table>
</div>
<details className="worked">
<summary>📐 Urutan menang &amp; harga bayar (klik untuk buka)</summary>
<p><strong>Langkah 1 — Urutkan by Ad Rank:</strong> B (54.000) &gt; A (40.000) = C (40.000) &gt; D (36.000). Tie-break A vs C: misal A menang karena riwayat CTR lebih baik. Urutan slot: <strong>B, A, C</strong>. D kalah — <strong>padahal bid-nya tertinggi (Rp12.000)!</strong></p>
<p><strong>Langkah 2 — Harga yang dibayar</strong> (rumus: Ad Rank di bawahmu / QS-mu + Rp1):</p>
<ul>
<li><strong>B</strong> (slot 1): 40.000 (A) / 9 + 1 = <strong>Rp4.446</strong> — bid Rp6.000, bayar Rp4.446!</li>
<li><strong>A</strong> (slot 2): 40.000 (C) / 4 + 1 = <strong>Rp10.001</strong> — nyaris full bid karena QS rendah.</li>
<li><strong>C</strong> (slot 3): 36.000 (D) / 5 + 1 = <strong>Rp7.201</strong>.</li>
</ul>
<p><strong>Langkah 3 — Baca pelajarannya:</strong></p>
<ul>
<li><strong>B</strong> menang slot 1 dengan <strong>bayar termurah</strong> — quality mengalahkan uang. Inilah kenapa optimasi landing page &amp; relevansi = &ldquo;diskon lelang&rdquo; permanen.</li>
<li><strong>D</strong> (bid tertinggi!) <strong>kalah total</strong> — Rp12.000 × QS 3 tidak cukup. Menaikkan bid tanpa memperbaiki quality = membakar uang untuk tetap kalah.</li>
<li><strong>A</strong> menang slot 2 tapi bayar <strong>2,2x lipat</strong> dari B untuk slot yang lebih buruk — pajak quality rendah.</li>
</ul>
<p><strong>Langkah 4 — Simulasi &ldquo;bagaimana jika&rdquo;:</strong> jika D memperbaiki QS dari 3 → 7 (landing page relevan): Ad Rank = 84.000 → <strong>menang slot 1</strong>, bayar 54.000/7 + 1 = Rp7.715. Lebih murah dari bid-nya (Rp12.000) dan menang! <strong>Perbaikan quality 1 poin sering lebih murah daripada menaikkan bid 2x.</strong></p>
<p><strong>Langkah 5 — Implikasi strategi:</strong> (a) jangan perang bid dengan QS rendah — perbaiki dulu; (b) QS tinggi = <em>parit pertahanan</em>: kompetitor harus bid 2–3x untuk menggesermu; (c) monitor <strong>lost impression share (rank)</strong> — jika tinggi, masalahnya rank (QS/bid), bukan budget.</p>
</details>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: lelang iklan bukan pelelangan lukisan (uang terbanyak menang) — ia <em>pemilihan ketua kelas</em> (populer × berduit). Quality score adalah suaranya; bid hanyalah amplopnya.</strong></p>
</div>

      <h2 id="tambahan-kasus">📊 Studi Kasus: &ldquo;TasKulit&rdquo; — Dari Rp5 Juta/Bulan ke Rp200 Juta Tanpa Boncos</h2>
<p><em>TasKulit</em> (nama disamarkan): brand tas kulit lokal, mulai dengan budget Rp5 juta/bulan di Meta Ads. 18 bulan kemudian: Rp200 juta/bulan dengan ROAS stabil 4,2. Bukan sulap — ini <strong>disiplin scaling</strong> yang jarang diceritakan.</p>
<h3>Fase 1 — Temukan 1 winning creative (bulan 1–3, Rp5–15 jt/bln)</h3>
<p>Aturan: <strong>70% budget untuk testing</strong>, 30% untuk yang sudah terbukti (belum ada yang terbukti di awal — jadi 100% testing terstruktur). Setiap minggu: 5 varian kreatif baru (ubah <strong>1 variabel</strong>: hook 3 detik, atau CTA, atau angle). Metrik testing <strong>bukan</strong> ROAS (terlalu noisy di budget kecil) melainkan <strong>CTR &amp; thumbstop rate</strong> — sinyal awal kualitas kreatif. Dari 60 varian, <strong>3 winners</strong> muncul (CTR 2,1% vs rata-rata 0,8%).</p>
<h3>Fase 2 — Validasi unit ekonomi (bulan 4–6, Rp15–40 jt/bln)</h3>
<p>Scale winners perlahan (+30%/minggu — <strong>jangan 3x lipat sekaligus</strong>, algoritma butuh waktu belajar ulang). Hitung <strong>MER</strong> (Marketing Efficiency Ratio = total revenue / total ad spend, bukan ROAS per kampanye — anti double-counting, MK12!). Syarat naik fase: MER ≥ 3,5 selama 4 minggu berturut-turut + <strong>margin kontribusi positif</strong> setelah COGS &amp; ongkir. Satu winner gugur di sini (CTR tinggi, tapi yang beli = pemburu diskon murah — AOV 40% di bawah rata-rata).</p>
<h3>Fase 3 — Scale horizontal, bukan vertikal (bulan 7–12, Rp40–120 jt/bln)</h3>
<p>Kesalahan umum scaling: menaikkan budget 1 kampanye 10x → CPM meledak, ROAS anjlok (audience fatigue + lelang makin mahal). TasKulit scale <strong>horizontal</strong>: duplikasi winning creative ke <strong>audience baru</strong> (lookalike 1% → 3% → 5%, interest baru, Advantage+), <strong>placement baru</strong> (Reels → Stories → Feed), <strong>format baru</strong> (video → carousel → katalog). Tiap ekspansi = eksperimen kecil dengan budget 10–15% dulu. Hasil: budget 3x lipat, CPM naik hanya 18%.</p>
<h3>Fase 4 — Pertahankan (bulan 13–18, Rp120–200 jt/bln)</h3>
<p>Musuh di skala besar: <strong>creative fatigue</strong> (frekuensi &gt; 3, CTR turun 30%). Sistem: <strong>pipeline kreatif mingguan</strong> — 3 varian baru/minggu <em>wajib</em>, winner lama dipensiunkan setelah 6–8 minggu. Plus: <strong>eksperimen incrementality</strong> (geo holdout, MK10) tiap kuartal — memastikan Rp200 juta/bulan benar-benar incremental, bukan mengkanibalisasi organik. Temuan kuartal 2: 22% &ldquo;ROAS&rdquo; ternyata kanibalisasi brand search — budget dialihkan sebagian ke prospekting murni.</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Fase</th><th>Budget/bln</th><th>Keputusan kunci</th><th>Yang dihindari</th></tr></thead>
<tbody>
<tr><td>1. Testing</td><td>Rp5–15 jt</td><td>Uji 5 kreatif/minggu, ukur CTR</td><td>Menilai ROAS di budget kecil</td></tr>
<tr><td>2. Validasi</td><td>Rp15–40 jt</td><td>MER ≥ 3,5 + margin positif</td><td>Scale winner &ldquo;palsu&rdquo; (AOV rendah)</td></tr>
<tr><td>3. Scale</td><td>Rp40–120 jt</td><td>Horizontal: audience &amp; format baru</td><td>Naikkan 1 kampanye 10x</td></tr>
<tr><td>4. Sustain</td><td>Rp120–200 jt</td><td>Pipeline kreatif + holdout test</td><td>Creative fatigue &amp; kanibalisasi</td></tr>
</tbody>
</table>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi yang mati di kasus ini: &ldquo;Scaling = tambah budget.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Scaling = <strong>menambah <em>permukaan</em> yang terbukti</strong> (audience, format, placement) sambil menjaga mesin kreatif tetap hidup. Budget hanyalah bahan bakar — mesinnya adalah sistem testing. Brand yang scale dengan &ldquo;tambah budget&rdquo; saja biasanya kembali ke titik awal dalam 3 bulan.</p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Digital Ads</h2>
<h3>1. &ldquo;Manual bidding vs otomatis (Advantage+/PMax) — mana?&rdquo;</h3>
<p><strong>Otomatis untuk mayoritas kasus 2026.</strong> Algoritma platform kini mengalahkan manusia di optimasi bid real-time (jutaan sinyal per lelang). Manual bidding hanya menang saat: data conversion &lt; 30/minggu (algoritma kelaparan data), atau ada <strong>aturan bisnis kaku</strong> (mis. &ldquo;jangan tampil di jam X&rdquo;). Tapi otomatis <strong>bukan</strong> autopilot: tugasmu bergeser dari &ldquo;atur bid&rdquo; ke &ldquo;beri sinyal benar&rdquo; (conversion API, event quality, creative bagus) — <strong>sampah masuk = optimasi sampah</strong>.</p>
<h3>2. &ldquo;Berapa budget testing yang wajar?&rdquo;</h3>
<p>Aturan praktis: <strong>10–20% dari total budget</strong> untuk testing terstruktur, ATAU cukup untuk 30–50 conversion per varian uji (di bawah itu = noise). Startup Rp10 jt/bulan: Rp1,5–2 jt testing = 1–2 uji/minggu yang valid. Jangan testing 10 varian dengan Rp100rb/varian — itu <strong>lotre</strong>, bukan eksperimen.</p>
<h3>3. &ldquo;Kenapa CPM naik terus tiap tahun?&rdquo;</h3>
<p>Tiga sebab: (a) <strong>kompetisi</strong> — makin banyak pengiklan di lelang yang sama; (b) <strong>supply perhatian terbatas</strong> — inventory iklan tumbuh lebih lambat dari demand; (c) <strong>kualitasmu stagnan</strong> — QS/CTR rendah = bayar &ldquo;pajak&rdquo; makin mahal. Yang bisa kamu kontrol hanya (c): kreatif lebih baik = satu-satunya <strong>deflasi</strong> dalam dunia CPM yang inflasi.</p>
<h3>4. &ldquo;Attribution window 1-day-click vs 7-day-click?&rdquo;</h3>
<p><strong>Samakan dengan siklus belimu</strong> (MK12). Fashion impulsif: 1-day cukup. Elektronik/pertimbangan: 7-day. Salah window = salah optimasi: algoritma akan mengejar conversion yang <em>terlihat</em> dalam window — 1-day window membuat algoritma memburu pembeli impulsif dan mengabaikan journey panjang yang sebenarnya bernilai.</p>
<h3>5. &ldquo;Iklan search brand sendiri (brand bidding) — buang uang?&rdquo;</h3>
<p><strong>Tergantung siapa yang mengintip.</strong> Jika kompetitor bid di brand-mu: pertahankan (murah, CTR tinggi, melindungi). Jika tidak ada kompetitor &amp; kamu ranking 1 organik: uji <strong>pause 2 minggu</strong> — sering ternyata 80%+ klik brand berbayar &ldquo;dicuri&rdquo; dari klik organik gratis (kanibalisasi!). Uang yang dihemat = budget prospekting gratis.</p>
<h3>6. &ldquo;Kapan berhenti iklan di platform?&rdquo;</h3>
<p>Tiga sinyal: (a) <strong>marginal MER &lt; 1</strong> selama 6+ minggu <em>setelah</em> optimasi kreatif &amp; targeting (bukan 2 minggu buruk); (b) <strong>incrementality test</strong> menunjukkan lift ≈ 0 (iklanmu hanya menggeser organik); (c) <strong>unit ekonomi rusak</strong> — CAC &gt; 1/3 LTV dan tidak ada jalan menurunkan. Berhenti juga = keputusan; <strong>sunk cost</strong> (&ldquo;sudah keluar Rp500jt&rdquo;) bukan alasan lanjut.</p>
<div className="tip">
<p><strong>💡 Benang merah FAQ ini: platform iklan 2026 menghadiahi <em>pemberi sinyal terbaik</em>, bukan penawar tertinggi. Tracking bersih (MK2), kreatif kuat, dan conversion berkualitas = tiga tuas yang mengalahkan budget 10x lipat. Uang membeli tayang; kualitas membeli kemenangan.</strong></p>
</div>

            <h2 id="tambahan-kasus2">📊 Studi Kasus: &ldquo;KopiBotol&rdquo; — Kreatif UGC yang Mengalahkan Iklan Agensi Rp150 Juta</h2>
<p><em>KopiBotol</em> (nama disamarkan): kopi susu botolan, budget iklan Rp30 juta/bulan. Agensi membuat iklan sinematik Rp150 juta — <strong>CTR 0,4%, ROAS 1,1</strong> (boncos). Seorang barista merekam video HP 15 detik (&ldquo;cara bikin kopi susu gula aren yang <em>bener</em>&rdquo;) — <strong>CTR 2,8%, ROAS 5,3</strong>. Pelajaran ini mengubah total strategi kreatif mereka.</p>
<h3>Kenapa UGC menang? Tiga mekanisme</h3>
<ul>
<li><strong>Native, bukan interupsi.</strong> Video HP terlihat seperti konten biasa — otak tidak mengaktifkan &ldquo;mode abaikan iklan&rdquo;. Iklan sinematik berteriak &ldquo;INI IKLAN&rdquo; dalam 1 detik pertama.</li>
<li><strong>Hook 3 detik yang jujur.</strong> &ldquo;Cara bikin kopi susu yang <em>bener</em>&rdquo; = janji + sedikit kontroversi (memancing &ldquo;emang selama ini salah?&rdquo;). Iklan agensi: logo 3 detik pertama = 70% penonton skip.</li>
<li><strong>Orang, bukan produk.</strong> Wajah barista + tangan yang bekerja = <strong>parasocial trust</strong>. Otak menilai orang, bukan botol. Produk muncul sebagai <em>alat</em> cerita, bukan objek pajangan.</li>
</ul>
<h3>Sistem produksi UGC KopiBotol (Rp2 juta/minggu)</h3>
<p><strong>Langkah 1 — Rekrut kreator mikro, bukan influencer.</strong> 10 barista/karyawan + 5 pelanggan setia. Bayaran: Rp200rb/video + bonus Rp500rb jika jadi winner. Total pool: 15 orang × 2 video/minggu = <strong>30 video/minggu</strong> — volume yang tidak mungkin dikejar agensi.</p>
<p><strong>Langkah 2 — Brief 1 halaman, bukan storyboard 20 halaman.</strong> Isi brief: (a) hook 3 detik (contoh pola: &ldquo;kesalahan umum&hellip;&rdquo;, &ldquo;rahasia&hellip;&rdquo;, &ldquo;POV:&hellip;&rdquo;), (b) 1 pesan produk, (c) CTA (&ldquo;cek keranjang kuning&rdquo;). Sisanya <strong>bebas</strong> — keaslian mati jika di-skrip.</p>
<p><strong>Langkah 3 — Uji cepat, bunuh cepat.</strong> Tiap video dapat Rp150rb test spend, 48 jam. Lolos jika: thumbstop &gt; 30% <strong>dan</strong> CTR &gt; 1,2%. Dari 30 video/minggu: ~4 lolos → dapat scale budget. <strong>26 dibunuh tanpa ampun</strong> — tidak ada &ldquo;tapi kan sudah dibuat&rdquo;.</p>
<p><strong>Langkah 4 — Iterasi winner, bukan cari winner baru terus.</strong> Video winner dibuatkan 5 varian (hook beda, CTA beda, durasi beda). 80% scale budget = varian winner; 20% = eksplorasi baru. Rasio ini menjaga <strong>eksploitasi vs eksplorasi</strong> tetap sehat.</p>
<h3>Hasil 6 bulan &amp; angka</h3>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Metrik</th><th>Era agensi</th><th>Era UGC</th></tr></thead>
<tbody>
<tr><td>Biaya produksi/bulan</td><td>Rp25 jt (amortisasi)</td><td>Rp8 jt</td></tr>
<tr><td>Video baru/minggu</td><td>0,5</td><td>30</td></tr>
<tr><td>CTR rata-rata</td><td>0,4%</td><td>1,9%</td></tr>
<tr><td>CPM efektif</td><td>Rp78.000</td><td>Rp41.000</td></tr>
<tr><td>ROAS</td><td>1,1</td><td>4,6</td></tr>
<tr><td>Frekuensi jenuh</td><td>2 minggu (1 materi)</td><td>6–8 minggu (pipeline)</td></tr>
</tbody>
</table>
</div>
<p><strong>Catatan jujur:</strong> UGC bukan sihir universal. Ia <strong>gagal</strong> untuk: produk premium/luxury (butuh aspirasi, bukan keaslian), klaim teknis kompleks (butuh penjelasan presisi), dan pasar yang sudah jenuh UGC (semua terlihat sama). KopiBotol menang karena kategorinya (F&amp;B impulsif, harga Rp25rb) = <strong>tepat di sweet spot UGC</strong>.</p>
<div className="tip">
<p><strong>💡 Pelajaran: di era feed 2026, <em>volume &amp; kecepatan iterasi</em> mengalahkan <em>kualitas produksi</em>. Satu video Rp150 juta yang gagal = 6 bulan sia-sia; 30 video Rp200rb yang 4-nya menang = mesin pertumbuhan. Agensi tidak mati — perannya bergeser dari &ldquo;pembuat iklan&rdquo; menjadi &ldquo;arsitek sistem kreatif&rdquo;.</strong></p>
</div>

            <h2 id="tambahan-audit">🧰 Kit Kerja: Audit Akun Iklan 30 Menit — 12 Cek yang Menemukan Pemborosan</h2>
<p>Buka akun iklanmu dan jawab 12 ini. Tiap &ldquo;ya&rdquo; = temuan; tiap &ldquo;tidak tahu&rdquo; = blind spot.</p>
<div className="callout">
<ol>
<li><strong>Apakah conversion tracking server-side aktif?</strong> (tidak → 15–30% conversion hilang; algoritma optimasi buta sebagian)</li>
<li><strong>Apakah ada kampanye dengan frequency &gt; 4 dan CTR turun?</strong> (ya → creative fatigue; segarkan materi, bukan tambah budget)</li>
<li><strong>Berapa % budget di audience yang tumpang tindih?</strong> (cek overlap; &gt; 30% = kamu lelang melawan diri sendiri)</li>
<li><strong>Apakah brand search campaign mengkanibalisasi organik?</strong> (uji pause 2 minggu; jika &gt; 70% klik pindah ke organik = hentikan)</li>
<li><strong>Apakah ada ad group/kampanye tanpa conversion 30 hari tapi tetap spend?</strong> (ya → matikan atau jadikan testing terstruktur)</li>
<li><strong>Apakah attribution window sesuai siklus beli?</strong> (tidak → algoritma optimasi ke conversion yang salah)</li>
<li><strong>Berapa MER (bukan ROAS per kampanye)?</strong> (tidak tahu → kamu tidak tahu efisiensi total; hitung sekarang)</li>
<li><strong>Apakah ada eksperimen incrementality 6 bulan terakhir?</strong> (tidak → semua &ldquo;ROAS&rdquo; belum tentu incremental)</li>
<li><strong>Apakah kreatif winner berusia &gt; 8 minggu masih dapat &gt; 50% budget?</strong> (ya → bom fatigue; rotasi wajib)</li>
<li><strong>Apakah budget scale &gt; 2x dalam seminggu pernah dilakukan?</strong> (ya → cek apakah ROAS anjlok sesudahnya; itu pelajarannya)</li>
<li><strong>Apakah ada segmentasi prospekting vs retargeting yang jelas?</strong> (tidak → retargeting memakan budget prospekting; pisahkan)</li>
<li><strong>Apakah negative keyword / placement exclusion di-review bulanan?</strong> (tidak → 5–15% spend bocor ke tempat sampah)</li>
</ol>
</div>
<h3>Skor &amp; tindakan</h3>
<p><strong>0–2 temuan:</strong> akun sehat — fokus ke scale &amp; kreatif. <strong>3–5:</strong> perbaiki 2 terbesar bulan ini (biasanya tracking + fatigue). <strong>6+:</strong> jangan scale dulu — <strong>rapikan fondasi</strong>: tracking, struktur kampanye, dan kalender kreatif. Pengalaman: akun dengan 6+ temuan yang dipaksa scale biasanya membakar 2–3x budget untuk hasil yang sama dengan akun rapi setengah budgetnya.</p>
<div className="tip">
<p><strong>💡 Audit ini = &ldquo;check engine&rdquo; bulanan. Iklan digital bukan mesin yang disetel sekali — ia kebun yang disiangi tiap bulan. Analis yang audit rutin menemukan pemborosan <em>sebelum</em> jadi kebiasaan; yang tidak, menemukannya di laporan akhir tahun — saat uangnya sudah hangus.</strong></p>
<p><strong>Catatan penutup:</strong> audit menemukan <em>pemborosan</em>; ia tidak menemukan <em>peluang</em>. Setelah 12 cek di atas hijau, pertanyaan berikutnya bukan &ldquo;di mana yang bocor?&rdquo; melainkan &ldquo;di mana yang bisa tumbuh?&rdquo; — audience baru, format baru, pasar baru. Analis iklan yang dewasa menghabiskan 30% waktunya memadamkan api (audit) dan 70% mencari kayu bakar baru (eksperimen). Kebanyakan tim terbalik: 90% padam api, 10% cari tumbuh — lalu heran kenapa akunnya &ldquo;sehat tapi stagnan&rdquo;.</p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Ad Rank = bid × quality</strong>; pemenang bayar second-price. Quality = diskon permanen.</li>
<li><strong>Funnel</strong>: impression → CTR → CVR → CPA = CPC/CVR. Optimasi CPA/ROAS, bukan CTR.</li>
<li><strong>Bid strategy</strong>: manual (data tipis) vs tCPA/tROAS (≥30 konversi/minggu); jangan gonta-ganti.</li>
<li><strong>Alokasi</strong>: samakan marginal ROAS; review mingguan.</li>
<li><strong>Frequency cap</strong>: batasi tayang per orang; waspadai view-through.</li>
<li><strong>Kapan TIDAK naikkan bid</strong>: quality jeblok — perbaiki dulu.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk15-forecasting" className="btn btn-secondary btn-sm">← MK15</Link>
        <Link href="/learn/mk17-text-analytics" className="btn btn-primary btn-sm">MK17 →</Link>
      </div>
    </div>
  );
}
