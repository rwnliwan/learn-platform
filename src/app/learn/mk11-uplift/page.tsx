"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk11UpliftPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK11 — Marketing Data Analytics</span>
        <h1 className="display-title">Uplift Modeling:<br/>Siapa yang Bisa Dibujuk (dan Siapa yang Jangan Diganggu)</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Diskon yang Mengusir Pelanggan</a></li>
<li><a href="#kuadran">Empat Kuadran Respons</a></li>
<li><a href="#metode">Metode Uplift</a></li>
<li><a href="#policy">Dari Uplift ke Kebijakan</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Empat Kuadran yang Mengubah Targeting</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Diskon yang Mengusir</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Uplift yang Menyelamatkan Rp4,8 Miliar</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Uplift</a></li>
<li><a href="#extra3">📋 Playbook: Uplift Targeting 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Targeting, Tiga Nasib</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela "Jangan Kirim"</a></li>
<li><a href="#faq">❓ Tanya-Jawab Kilat</a></li>
<li><a href="#causalforest">🌳 Bedah Algoritma: Causal Forest</a></li>
<li><a href="#metrik">📏 Mengukur Uplift: Metrik yang Benar</a></li>
<li><a href="#tambahan-hitung">📐 Worked Example: Skor Uplift</a></li>
<li><a href="#tambahan-faq">❓ FAQ Uplift</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan empat kuadran respons (sure things, persuadables, lost causes, sleeping dogs).</li>
<li>Menghitung uplift score dan membedakannya dari propensity/churn score.</li>
<li>Membaca kurva Qini dan menjelaskan kenapa AUUC &gt; AUC untuk evaluasi uplift.</li>
<li>Merancang targeting kampanye berbasis uplift + biaya (termasuk 'jangan ganggu').</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Diskon yang Mengusir Pelanggan</h2>
      <div className="story">
        <p>TelkoNusa (dari MK6) akhirnya menjalankan kampanye retensi berbasis model churn: 10.000 pelanggan &ldquo;paling berisiko&rdquo; diberi diskon Rp50rb. Hasilnya aneh: churn grup yang didiskon <strong>naik</strong> 2 poin dibanding yang tidak didiskon!</p>
<p>Twist-nya: sebagian &ldquo;berisiko&rdquo; itu adalah <strong>sleeping dogs</strong> — pelanggan yang sebenarnya akan bertahan, tapi <em>diskon mengingatkan mereka bahwa mereka bisa pindah</em> (&ldquo;oh iya, aku bisa dapat lebih murah di tempat lain&rdquo;). Model churn menebak <em>siapa pergi</em>; ia tidak tahu <em>siapa yang pergi TAPI BISA dicegah</em> vs <em>siapa yang justru terusik oleh aksimu</em>. <strong>Uplift modeling</strong> menjawab pertanyaan yang benar: <em>kepada siapa aksi ini benar-benar mengubah perilaku?</em></p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="kuadran">Empat Kuadran — Peta yang Mengubah Targeting</h2>
<p><strong>Definisi.</strong> Setiap pelanggan termasuk salah satu: <strong>Sure things</strong> (beli/betahan dengan atau tanpa aksi — menghubunginya = buang biaya), <strong>Persuadables</strong> (berubah karena aksi — <em>mereka</em> targetmu), <strong>Lost causes</strong> (tidak berubah apa pun yang kamu lakukan — buang biaya), <strong>Sleeping dogs</strong> (bertahan jika dibiarkan, <em>pergi jika diganggu</em> — menghubunginya = merusak!).</p>
<p>Model churn/propensity <strong>tidak bisa membedakan</strong> keempatnya — mereka menebak outcome, bukan <em>efek aksi</em>. Hanya eksperimen (treated vs kontrol) + uplift yang bisa.</p>
<p><strong>Kepribadian/intuisi:</strong> Bayangkan kamu salesman pintu-ke-pintu. <strong>Sure things</strong> = yang memang mau beli (ketuk = buang waktu). <strong>Persuadables</strong> = yang ragu (ketukanmu menentukan). <strong>Lost causes</strong> = yang mengusir siapa pun. <strong>Sleeping dogs</strong> = yang sedang tidur — ketukanmu <em>membangunkannya untuk mengusirmu</em>. Salesman hebat mengetuk pintu persuadables saja.</p>
<p><strong>Kapan dipakai:</strong> Setiap kampanye dengan biaya per kontak &gt; 0 DAN risiko mengganggu (diskon, telepon, push agresif). Jika aksi gratis & tak mengganggu, kuadran tidak penting.</p>
<details className="worked">
<summary>📐 Contoh: 10.000 'berisiko' TelkoNusa (klik untuk buka)</summary>
<p>Dari eksperimen: 10.000 pelanggan acak, 5.000 didiskon, 5.000 tidak. Churn: didiskon 8%, tidak 10% — rata-rata diskon &ldquo;menang&rdquo; 2 poin.</p>
<p><strong>Tapi per kuadran</strong> (dari model uplift): persuadables (3.000 orang): churn 15% → 5% (diskon menyelamatkan 300!). Sure things (4.000): 2% → 2% (tidak ngaruh, Rp200jt terbuang). Lost causes (2.000): 40% → 40% (sama saja). Sleeping dogs (1.000): 3% → 8% (diskon <em>menambah</em> 50 churn!).</p>
<p><strong>Net:</strong> +300 − 50 = +250 terselamatkan, tapi biaya Rp500jt untuk 10.000. Targeting hanya persuadables: biaya Rp150jt, selamat 300 → <strong>ROI 3,3x lebih baik</strong> + tidak membangunkan sleeping dogs.</p>
</details>
<PlotlyChart
  data={[{x: [0.2,0.8,0.2,0.8], y: [0.8,0.8,0.2,0.2], mode: "markers+text", text: ["Sleeping dogs<br>JANGAN ganggu", "Sure things<br>buang biaya", "Lost causes<br>buang biaya", "Persuadables<br>TARGET!"], textposition: "middle center", marker: {size: 60, color: ["#ef4444","#e8a838","#94a3b8","#16a34a"], opacity: 0.7}, type: "scatter"}]}
  title={"Empat kuadran respons"}
  layout={{xaxis: {title: "P(Y | tanpa aksi)", range: [0,1]}, yaxis: {title: "P(Y | dengan aksi)", range: [0,1]}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = peluang outcome baik TANPA aksi, Y = DENGAN aksi. Diagonal = tidak ada efek. Di atas diagonal = aksi membantu; di bawah = merusak.</p>
<p><strong>Interpretasi:</strong> Hanya <strong>persuadables</strong> (hijau, kanan atas tapi di atas diagonal) yang layak ditarget. Sure things (kuning, di diagonal atas) = buang biaya. Sleeping dogs (merah, <em>di bawah</em> diagonal) = aksi merusak — zona larangan terbang. Targeting berbasis churn (sumbu X saja) tidak melihat sumbu Y — ia buta terhadap efek aksimu.</p>
</div>
<h2 id="metode">Metode — Dari Dua Model ke Qini</h2>
<p><strong>Definisi.</strong> <strong>Uplift</strong> = P(Y|T=1,X) − P(Y|T=0,X): selisih outcome jika diberi vs tidak diberi aksi. Metode: <strong>Two-model</strong> — latih model terpisah di treated & kontrol, kurangkan prediksinya (simple, tapi dua error menumpuk); <strong>Single-model dengan interaksi</strong> — satu model dengan fitur T×X; <strong>Class transformation</strong> — ubah label jadi Z (mis. Z=1 jika (treated & sukses) atau (kontrol & gagal)) lalu satu model klasifikasi.</p>
<p><strong>Evaluasi: Qini curve / AUUC.</strong> Urutkan by uplift prediksi, plot <em>incremental gain</em> kumulatif vs % populasi di-target. AUUC (area under uplift curve) = metrik yang benar. <strong>AUC tidak berlaku</strong> — ia menilai ranking outcome, bukan ranking efek.</p>
<Tex math={String.raw`\hat{\tau}(x) = \hat{P}(Y=1 \mid T=1, x) - \hat{P}(Y=1 \mid T=0, x)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\hat{\tau}(x)`} />: uplift prediksi untuk pelanggan x — target yang di-ranking</li>
<li><Tex math={String.raw`\hat{P}(Y=1 \mid T=1, x)`} />: peluang sukses JIKA diberi aksi (model treated)</li>
<li><Tex math={String.raw`\hat{P}(Y=1 \mid T=0, x)`} />: peluang sukses JIKA TIDAK diberi aksi (model kontrol)</li>
<li>Butuh data eksperimen (T diacak)! Dari data observasional, T tidak acak → bias seleksi</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Uplift seperti <strong>menilai guru les</strong>: bukan dari &lsquo;muridnya lulus?&rsquo; (propensity), tapi &lsquo;<em>berapa nilai tambah</em> les ini vs belajar sendiri?&rsquo; Murid jenius lulus tanpa les (sure thing) — lesnya tidak berjasa. Murid yang lulus <em>karena</em> les = persuadable. Butuh kelompok pembanding (kontrol) untuk tahu.</p>
<p><strong>Kapan dipakai:</strong> Ada data eksperimen (A/B dengan outcome), aksi berbiaya/berisiko, dan kamu curiga efek heterogen (tidak semua orang merespons sama).</p>
<details className="worked">
<summary>📐 Contoh: Two-model manual mini (klik untuk buka)</summary>
<p>Data: 6 pelanggan (T=1 didiskon, T=0 tidak). Young: T1→bertahan, T0→pergi. Old: T1→bertahan, T0→bertahan.</p>
<p><strong>Model treated:</strong> P(bertahan|T1, young)=1,0; (T1, old)=1,0. <strong>Model kontrol:</strong> P(bertahan|T0, young)=0; (T0, old)=1,0.</p>
<p><strong>Uplift:</strong> young = 1,0 − 0 = <strong>+1,0</strong> (persuadable!). old = 1,0 − 1,0 = <strong>0</strong> (sure thing — jangan buang diskon).</p>
<p>Model churn akan menandai young &ldquo;berisiko&rdquo; (benar) TAPI juga menarget old yang &ldquo;sehat&rdquo;? Tidak — ia menarget young saja. Masalahnya: ia juga menarget <em>semua</em> young termasuk sleeping dogs young. Uplift memisahkan young-persuadable dari young-sleeping-dog.</p>
</details>
<PlotlyChart
  data={[{x: [0,10,20,30,40,50,60,70,80,90,100], y: [0,45,80,105,120,128,130,128,122,112,100], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "model uplift"}, {x: [0,100], y: [0,100], type: "scatter", mode: "lines", line: {dash: "dash", color: "#94a3b8"}, name: "acak"}]}
  title={"Kurva Qini: incremental gain kumulatif"}
  layout={{xaxis: {title: "% populasi di-target (by uplift)"}, yaxis: {title: "Incremental gain kumulatif"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = % populasi teratas by uplift yang di-target, Y = total incremental gain. Bandingkan dengan garis acak.</p>
<p><strong>Interpretasi:</strong> Kurva naik tajam lalu <strong>melandai di ~60%</strong> — setelah itu menambah target justru menurunkan gain (mulai kena sure things & sleeping dogs). <strong>Titik puncak = ukuran kampanye optimal.</strong> AUUC (luas di atas garis acak) = kualitas model. Inilah 'decile analysis'-nya uplift.</p>
</div>
<h2 id="policy">Kebijakan Targeting — Uplift × Biaya × Risiko</h2>
<p><strong>Definisi.</strong> Skor uplift saja belum cukup — gabungkan dengan <strong>biaya</strong>: target jika uplift(x) × nilai − biaya(aksi) &gt; 0. Dan dengan <strong>risiko</strong>: jangan pernah target prediksi sleeping dogs (uplift negatif signifikan) — <em>expected harm</em> nyata.</p>
<p>Urutan targeting optimal: urutkan by <strong>net value</strong> = uplift × V − C, ambil dari atas sampai net value ≤ 0. Ini generalisasi dari threshold EV di MK6/MK7 — dengan uplift menggantikan P(churn)/P(respons).</p>
<p><strong>Kepribadian/intuisi:</strong> Uplift tanpa biaya seperti <strong>resep tanpa harga bahan</strong>: &lsquo;obat ini menyembuhkan!&rsquo; — tapi harganya Rp100jt untuk flu. Kebijakan targeting = resep + apotek: manfaat × peluang − harga &gt; 0, baru tebus.</p>
<p><strong>Kapan dipakai:</strong> Setiap kampanye retensi/upsell berbiaya. Aturan: tidak ada aksi ke uplift negatif; aksi ke uplift positif hanya jika net value positif.</p>
<details className="worked">
<summary>📐 Contoh: Kebijakan TelkoNusa (klik untuk buka)</summary>
<p>V = Rp2jt (CLV terselamatkan), C = Rp50rb. Net value = uplift × 2jt − 50rb.</p>
<p>Persuadables (uplift +0,10): 0,10×2jt − 50rb = <strong>+Rp150rb</strong> → TARGET. Sure things (uplift 0): −Rp50rb → JANGAN. Sleeping dogs (uplift −0,05): −Rp150rb → JANGAN (dan catat sebagai harm).</p>
<p><strong>Hasil kebijakan:</strong> target 3.000 persuadables, biaya Rp150jt, selamat ~300 → net +Rp450jt. Vs kampanye lama: biaya Rp500jt, net +Rp0 (bahkan negatif setelah sleeping dogs). <strong>Model yang sama (churn) + kebijakan uplift = hasil beda dunia.</strong></p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Empat Kuadran yang Mengubah Targeting</h2>
<p>Uplift modeling menjawab: &ldquo;siapa yang <strong>berubah karena</strong> aksiku?&rdquo; — bukan &ldquo;siapa yang berisiko&rdquo;. Tiga pendalaman: (1) empat kuadran — peta yang mengubah segalanya; (2) dari two-model ke Qini — mengukur dengan benar; (3) kebijakan targeting — matematika &ldquo;siapa dikirimi apa&rdquo;.</p>
<h3>1. Empat Kuadran — Peta yang Mengubah Targeting</h3>
<p><strong>Definisi.</strong> Setiap individu masuk satu kuadran: <strong>Persuadables</strong> (beli <strong>jika</strong> dikirimi, tidak jika tidak), <strong>Sure Things</strong> (beli <strong>anyway</strong>), <strong>Lost Causes</strong> (tidak beli <strong>anyway</strong>), <strong>Sleeping Dogs</strong> (beli jika <strong>TIDAK</strong> dikirimi, <strong>pergi</strong> jika dikirimi!).</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>dokter UGD</strong>: (a) <strong>Persuadables</strong> = pasien yang <strong>tertolong</strong> operasi; (b) <strong>Sure Things</strong> = yang <strong>sembuh sendiri</strong> (jangan operasi! buang sumber daya!); (c) <strong>Lost Causes</strong> = yang <strong>tidak tertolong</strong> (operasi sia-sia); (d) <strong>Sleeping Dogs</strong> = yang <strong>mati jika</strong> dioperasi! Dokter yang mengoperasi <strong>semua</strong> = <strong>pembunuh</strong>. Marketer yang mengirimi <strong>semua</strong> = <strong>pembakar uang</strong>.</p>
<p><strong>Uplift</strong> = P(beli|dikirim) − P(beli|tidak dikirim). <strong>Persuadables:</strong> uplift <strong>positif</strong> (+). <strong>Sure Things:</strong> uplift <strong>nol</strong> (0). <strong>Lost Causes:</strong> uplift <strong>nol</strong> (0). <strong>Sleeping Dogs:</strong> uplift <strong>negatif</strong> (−)!</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> kampanye berbiaya! Target <strong>hanya</strong> persuadables. <strong>Jangan ganggu</strong> sure things (buang biaya!) &amp; sleeping dogs (<strong>merusak</strong>!). <strong>Abaikan</strong> lost causes.</p>
<Tex math={String.raw`\tau(x) = P(Y=1|X=x, T=1) - P(Y=1|X=x, T=0)`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\tau(x)`} /> = uplift untuk individu x; <Tex math={String.raw`Y=1`} /> = membeli; <Tex math={String.raw`T=1`} /> = dikirim kampanye; <Tex math={String.raw`T=0`} /> = tidak. <strong>Selisih kausal</strong> — bukan korelasi!</p>
<details className="worked">
<summary>📐 Contoh 1a: Empat orang, empat kuadran (klik untuk buka)</summary>
<p>Kampanye voucher Rp50rb (biaya). Margin Rp200rb jika beli.</p>
<p><strong>Andi (Persuadable):</strong> P(beli|kirim)=0,6, P(beli|tidak)=0,2. Uplift = <strong>+0,4</strong>. EV = 0,4×200rb − 50rb = <strong>+Rp30rb</strong> → <strong>KIRIM</strong> ✓</p>
<p><strong>Budi (Sure Thing):</strong> P(beli|kirim)=0,8, P(beli|tidak)=0,8. Uplift = <strong>0</strong>. EV = 0×200rb − 50rb = <strong>−Rp50rb</strong> → <strong>JANGAN</strong> ✗ (ia beli sendiri! kirim = <strong>buang</strong> Rp50rb!)</p>
<p><strong>Cici (Lost Cause):</strong> P(beli|kirim)=0,05, P(beli|tidak)=0,05. Uplift = <strong>0</strong>. EV = <strong>−Rp50rb</strong> → <strong>JANGAN</strong> ✗</p>
<p><strong>Dedi (Sleeping Dog):</strong> P(beli|kirim)=0,3, P(beli|tidak)=0,7. Uplift = <strong>−0,4</strong>! EV = −0,4×200rb − 50rb = <strong>−Rp130rb</strong> → <strong>JANGAN</strong> ✗✗ (<strong>merusak</strong>! voucher <strong>mengusirnya</strong> — mungkin ia tersinggung &ldquo;dianggap butuh diskon&rdquo;!)</p>
<p><strong>Pelajaran:</strong> model <strong>risiko</strong> (propensity!) akan menarget <strong>Budi</strong> (p=0,8, &ldquo;risiko rendah&rdquo; — <strong>salah</strong>!) dan <strong>Dedi</strong> (p=0,7 — <strong>bencana</strong>!). Model <strong>uplift</strong> menarget <strong>hanya Andi</strong>. <strong>Beda paradigma, beda hasil.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Biaya kampanye &ldquo;buta&rdquo; vs &ldquo;uplift&rdquo; (klik untuk buka)</summary>
<p>10.000 orang: 2.000 persuadables, 3.000 sure things, 4.000 lost causes, 1.000 sleeping dogs. Voucher Rp50rb, margin Rp200rb.</p>
<p><strong>Kampanye buta</strong> (kirim semua): biaya 10.000×50rb = <strong>Rp500jt</strong>. Nilai: persuadables 2.000×0,4×200rb = Rp160jt. Sure things: 0 (beli anyway!). Lost: 0. Dogs: 1.000×(−0,4)×200rb = <strong>−Rp80jt</strong> (merusak!). Net = 160 − 80 − 500 = <strong>−Rp420jt</strong>! <strong>Bencana!</strong></p>
<p><strong>Kampanye uplift</strong> (hanya persuadables): biaya 2.000×50rb = <strong>Rp100jt</strong>. Nilai Rp160jt. Net = <strong>+Rp60jt</strong>!</p>
<p><strong>Selisih: Rp480jt!</strong> Dari <strong>model yang sama</strong> (data sama!) — beda <strong>paradigma</strong> (risiko vs uplift). <strong>Inilah</strong> mengapa MK11 ada.</p>
</details>
<h3>2. Dari Two-Model ke Qini — Mengukur dengan Benar</h3>
<p><strong>Definisi.</strong> <em>Two-model approach</em>: latih <strong>dua</strong> model — P(beli|kirim) &amp; P(beli|tidak) — lalu <strong>kurangkan</strong>. <em>Qini curve</em>: urutkan by uplift prediksi, plot <strong>incremental gain kumulatif</strong> vs % dikirimi. <em>Qini coefficient</em> = <strong>area</strong> di atas diagonal (random!).</p>
<p><strong>Kepribadian/intuisi:</strong> Two-model seperti <strong>dua cenayang</strong>: satu meramal &ldquo;jika dikirim&rdquo;, satu meramal &ldquo;jika tidak&rdquo;. <strong>Selisih</strong> ramalan = uplift. <strong>Masalah:</strong> dua model = <strong>dua kesalahan</strong> yang <strong>menumpuk</strong>! (Error model 1 + error model 2 = error uplift <strong>lebih besar</strong>!). <strong>Solusi modern:</strong> <strong>single-model</strong> (causal forest, uplift trees!) — langsung prediksi <strong>selisih</strong>.</p>
<p><strong>Qini curve:</strong> seperti <strong>ROC curve</strong> tapi untuk uplift! Sumbu X: % populasi dikirimi (urut by uplift). Sumbu Y: <strong>incremental</strong> pembeli (vs tidak kirim!). <strong>Diagonal</strong> = random (tidak ada targeting!). <strong>Di atas</strong> diagonal = <strong>model bekerja</strong>! <strong>Puncak</strong> = <strong>titik optimal</strong> (kirim sampai sini, <strong>berhenti</strong>!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Qini</strong> untuk <strong>evaluasi</strong> model uplift (bukan akurasi!). <strong>Two-model</strong> untuk <strong>mulai cepat</strong>. <strong>Causal forest</strong> untuk <strong>produksi</strong>.</p>
<details className="worked">
<summary>📐 Contoh 2: Membaca Qini curve (klik untuk buka)</summary>
<p>Model uplift, 10.000 orang. Urutkan by uplift, kirim bertahap:</p>
<p><strong>Kirim 10%</strong> (1.000, uplift tertinggi): incremental +300 pembeli.</p>
<p><strong>Kirim 20%</strong> (2.000): incremental +500 (tambahan +200).</p>
<p><strong>Kirim 30%</strong> (3.000): incremental +550 (tambahan +50).</p>
<p><strong>Kirim 40%</strong> (4.000): incremental +520 (tambahan <strong>−30</strong>! <strong>turun</strong>! — mulai kena <strong>sleeping dogs</strong>!).</p>
<p><strong>Titik optimal: 30%!</strong> Kirim <strong>lebih</strong> = <strong>merusak</strong>! <strong>Qini</strong> menunjukkan <strong>kapan berhenti</strong> — yang <strong>tidak</strong> bisa dilakukan model risiko!</p>
<p><strong>Pelajaran:</strong> <strong>lebih banyak ≠ lebih baik</strong>. Qini = <strong>rem</strong> untuk kampanye. Tanpa Qini = <strong>ngebut tanpa rem</strong>.</p>
</details>
<h3>3. Kebijakan Targeting — Matematika &ldquo;Siapa Dikirimi Apa&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Kebijakan</em>: aturan &ldquo;untuk x, lakukan T&rdquo;. <em>Optimal</em>: T=1 jika <strong>uplift × margin &gt; biaya</strong>. Dengan <strong>banyak aksi</strong>: pilih <strong>aksi</strong> dengan <strong>net uplift tertinggi</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>dokter</strong> memilih <strong>obat</strong>: bukan &ldquo;obat termahal untuk semua&rdquo;, tapi <strong>&ldquo;obat yang tepat untuk pasien yang tepat&rdquo;</strong>. Voucher untuk persuadables <strong>murah</strong>. Telepon untuk persuadables <strong>mahal tapi yakin</strong>. <strong>Diam</strong> untuk sisanya.</p>
<p><strong>Net uplift value:</strong> τ(x) × m − c. <strong>Kirim</strong> jika <strong>positif</strong>. <strong>Sederhana</strong> — tapi <strong>mematikan</strong> jika τ(x) <strong>salah</strong> (tidak terkalibrasi!).</p>
<p><strong>Kapan dipakai:</strong> <strong>Setiap</strong> kampanye! Mulai dari <strong>aturan</strong> (τ &gt; threshold), naik ke <strong>optimasi</strong> saat data banyak.</p>
<Tex math={String.raw`\text{Kirim jika: } \tau(x) \times m - c > 0`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\tau(x)`} /> = uplift prediksi; <Tex math={String.raw`m`} /> = margin; <Tex math={String.raw`c`} /> = biaya. <strong>Positif</strong> = kirim. <strong>Negatif</strong> = diam.</p>
<details className="worked">
<summary>📐 Contoh 3: Kebijakan multi-aksi (klik untuk buka)</summary>
<p>Margin Rp500rb. Tiga aksi: voucher (c=Rp50rb), telepon (c=Rp200rb), kunjungan (c=Rp800rb).</p>
<p><strong>Andi:</strong> τ_voucher=0,3, τ_telp=0,5, τ_kunjung=0,6. Net: voucher 0,3×500−50=<strong>Rp100rb</strong>; telp 0,5×500−200=<strong>Rp50rb</strong>; kunjung 0,6×500−800=<strong>−Rp500rb</strong>. → <strong>Voucher menang!</strong></p>
<p><strong>Budi:</strong> τ_voucher=0,1, τ_telp=0,4, τ_kunjung=0,7. Net: voucher <strong>Rp0</strong>; telp <strong>Rp0</strong>; kunjung 0,7×500−800=<strong>−Rp450rb</strong>. → <strong>Impas</strong> — <strong>diam</strong> (atau voucher, tapi <strong>tidak</strong> telepon/kunjungan!).</p>
<p><strong>Cici:</strong> τ_voucher=0,05, τ_telp=0,6, τ_kunjung=0,9. Net: voucher −Rp25rb; telp 0,6×500−200=<strong>Rp100rb</strong>; kunjung 0,9×500−800=<strong>−Rp350rb</strong>. → <strong>Telepon menang!</strong></p>
<p><strong>Pelajaran:</strong> <strong>aksi optimal beda per orang</strong>! Andi=voucher, Budi=diam, Cici=telepon. <strong>Satu aksi untuk semua</strong> = <strong>salah</strong> untuk 2 dari 3!</p>
</details>
<PlotlyChart
  data={[{x: ["10%", "20%", "30%", "40%", "50%"], y: [300, 500, 550, 520, 450], type: "scatter", mode: "lines+markers", name: "Model uplift", line: {color: "#2a7de1", width: 3}}, {x: ["10%", "20%", "30%", "40%", "50%"], y: [100, 200, 300, 400, 500], type: "scatter", mode: "lines", name: "Random", line: {dash: "dash", color: "#94a3b8"}}]}
  title={"Kurva Qini: kapan berhenti mengirimi"}
  layout={{yaxis: {title: "Incremental pembeli kumulatif"}, xaxis: {title: "% populasi dikirimi (urut uplift)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = % dikirimi (dari uplift tertinggi). Sumbu Y = <strong>tambahan</strong> pembeli vs tidak kirim. Garis putus-putus = random.</p>
<p><strong>Interpretasi:</strong> Kurva <strong>naik</strong> sampai 30% (+550), lalu <strong>turun</strong> (sleeping dogs!). <strong>Puncak 30%</strong> = <strong>berhenti di sini</strong>! Model <strong>jauh</strong> di atas random. <strong>Tanpa Qini</strong>, kamu kirim 50% (+450) — <strong>kehilangan</strong> 100 pembeli + <strong>buang</strong> biaya 20%!</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Targetkan yang paling berisiko churn — mereka yang paling butuh diselamatkan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> &lsquo;Berisiko&rsquo; ≠ &lsquo;bisa diselamatkan&rsquo;. Yang paling berisiko sering = <strong>lost causes</strong> (tidak tertolong) atau <strong>sleeping dogs</strong> (terganggu oleh aksimu). Kasus TelkoNusa: menarget 10.000 'berisiko' justru <em>menaikkan</em> churn. Target = <strong>persuadables</strong> (uplift tinggi), bukan risiko tinggi.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Uplift = propensity yang diganti nama. Sama-sama skor.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Propensity menebak <strong>outcome</strong> (siapa beli/pergi). Uplift menebak <strong>efek aksi</strong> (siapa berubah <em>karena</em> aksi). Sure thing punya propensity tinggi + uplift nol — propensity menargetnya (buang biaya), uplift tidak. Beda pertanyaan, beda model, beda data (uplift butuh eksperimen).</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Uplift butuh data eksperimen — tidak bisa dari observasional murni.</strong> Tanpa T yang diacak, 'P(Y|T=1) − P(Y|T=0)' terkontaminasi bias seleksi (yang didiskon memang beda). Investasi satu A/B test yang benar (MK9) = bahan bakar semua model uplift.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Evaluasi dengan Qini/AUUC, bukan AUC.</strong> AUC menilai 'apakah ranking outcome benar' — tidak relevan. Model dengan AUC 0,9 bisa AUUC negatif (ranking outcome sempurna tapi efek nol). Salah metrik = salah model menang.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Two-Model Uplift From-Scratch</h2>
<p>Bangun dua model sederhana (treated & kontrol), hitung uplift, dan identifikasi persuadables vs sleeping dogs.</p>
<PyodideLab
  title={"Lab 1 — Uplift Two-Model"}
  hint={"Ubah efek diskon untuk 'old' jadi negatif (sleeping dogs). Lihat model menangkap uplift negatif — mereka harus DIKECUALIKAN."}
  defaultCode={"import random\nrandom.seed(21)\n# Simulasi: 2000 pelanggan, T diacak. Efek heterogen by usia.\ndef hasil(usia, T):\n    base = 0.7 if usia == \"old\" else 0.4      # P(bertahan | tanpa aksi)\n    efek = 0.25 if usia == \"young\" else 0.0   # diskon membantu young saja\n    p = base + (efek if T else 0)\n    return 1 if random.random() < p else 0\n\ndata = []\nfor _ in range(2000):\n    usia = \"young\" if random.random() < 0.5 else \"old\"\n    T = random.random() < 0.5\n    data.append((usia, T, hasil(usia, T)))\n\ndef rate(rows):\n    return sum(r for _, _, r in rows)/len(rows) if rows else 0\n\nfor usia in [\"young\", \"old\"]:\n    t = [r for r in data if r[0] == usia and r[1] == 1]\n    c = [r for r in data if r[0] == usia and r[1] == 0]\n    uplift = rate(t) - rate(c)\n    print(f\"{usia:<6} P(bertahan|diskon)={rate(t):.0%}  P(bertahan|tanpa)={rate(c):.0%}  uplift={uplift:+.0%}\")\nprint(\"\\nKeputusan: diskon HANYA untuk young (persuadable).\")\nprint(\"Old = sure things (uplift ~0): diskon = buang biaya.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kurva Qini Sederhana</h2>
<p>Urutkan pelanggan by uplift prediksi, plot incremental gain kumulatif — temukan ukuran kampanye optimal.</p>
<PyodideLab
  title={"Lab 2 — Kurva Qini"}
  hint={"Tambahkan 'sleeping dogs' (efek negatif untuk sebagian young). Lihat kurva TURUN setelah puncak — bukti jangan target semua."}
  defaultCode={"import random\nrandom.seed(22)\n# uplift 'true' per pelanggan + noise prediksi\ntrue_u = [0.25 if random.random() < 0.3 else (0.0 if random.random() < 0.8 else -0.1) for _ in range(1000)]\npred = [u + random.gauss(0, 0.08) for u in true_u]\norder = sorted(range(1000), key=lambda i: pred[i], reverse=True)\n\nkum, terbaik = 0, (0, 0)\nprint(f\"{'%target':>8}  {'gain kumulatif':>14}\")\nfor k in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]:\n    n = k * 10\n    kum = sum(true_u[i] for i in order[:n])\n    print(f\"{k:>8}  {kum:>14.1f}\")\n    if kum > terbaik[1]: terbaik = (k, kum)\nprint(f\"\\nUkuran optimal ~ {terbaik[0]}% populasi (gain {terbaik[1]:.0f}).\")\nprint(\"Target lebih = mulai kena sure things & sleeping dogs.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Aksi murah & tidak mengganggu (email biasa) → <strong>Propensity + EV cutoff (MK7) cukup</strong></h3>
<p><strong>Kenapa:</strong> Risiko sleeping dogs kecil; uplift overkill.</p>
<p><strong>Contoh nyata:</strong> Newsletter mingguan.</p>
</div>
<div className="decision-card">
<h3>2. Aksi mahal atau mengganggu (telepon, diskon besar) → <strong>Uplift modeling</strong></h3>
<p><strong>Kenapa:</strong> Biaya salah target besar; sleeping dogs nyata.</p>
<p><strong>Contoh nyata:</strong> Diskon retensi Rp50rb+, kunjungan sales.</p>
</div>
<div className="decision-card">
<h3>3. Tidak ada data eksperimen → <strong>Jalankan A/B test dulu (MK9) — jangan uplift dari observasional</strong></h3>
<p><strong>Kenapa:</strong> Uplift tanpa T acak = bias seleksi.</p>
<p><strong>Contoh nyata:</strong> Pilot 5.000 user sebelum model.</p>
</div>
<div className="decision-card">
<h3>4. Efek homogen (semua merespons sama) → <strong>Tetap di A/B + EV; uplift tidak menambah</strong></h3>
<p><strong>Kenapa:</strong> Uplift berharga saat efek heterogen. Cek dulu variasi efek per segmen.</p>
<p><strong>Contoh nyata:</strong> Jika semua segmen lift-nya mirip, pakai rata-rata.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Tanya 'siapa berubah karena aksi',</strong> bukan 'siapa berisiko'.</li><li><strong>Butuh data eksperimen.</strong> Tidak ada jalan pintas.</li><li><strong>Evaluasi Qini/AUUC</strong>, bukan AUC.</li><li><strong>Jangan ganggu sleeping dogs.</strong></li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Diskon yang Mengusir Pelanggan</h3>
<p>Telko &ldquo;NusaCell&rdquo;: diskon 30% untuk 100.000 &ldquo;berisiko churn&rdquo; (model propensity!). Hasil: churn <strong>naik</strong> 2%! <strong>Investigasi:</strong> 20.000 di antaranya = <strong>sleeping dogs</strong> — pelanggan <strong>setia</strong> yang <strong>tersinggung</strong> &ldquo;dianggap mau pergi&rdquo; + <strong>terbiasa</strong> harga normal (diskon = &ldquo;ada apa?&rdquo;).</p>
<p><strong>Solusi uplift:</strong> target <strong>hanya</strong> 25.000 persuadables. Hasil: churn <strong>turun</strong> 5%, biaya <strong>turun</strong> 75%! <strong>Net: +Rp2,1M</strong> (vs <strong>−Rp800jt</strong> kampanye buta!).</p>
<p><strong>Pelajaran:</strong> <strong>&ldquo;berisiko&rdquo; ≠ &ldquo;bisa diselamatkan&rdquo;</strong>. Model risiko menarget <strong>yang salah</strong>. Uplift menarget <strong>yang benar</strong>. <strong>Beda Rp2,9M!</strong></p>
<h3>Kisah 2: Sure Things yang Menghabiskan Budget</h3>
<p>Bank &ldquo;Danarta&rdquo;: cashback Rp100rb untuk &ldquo;nasabah aktif&rdquo; (yang <strong>pasti</strong> transaksi!). 50.000 nasabah × Rp100rb = <strong>Rp5M</strong>! <strong>Uplift:</strong> 0 (mereka transaksi <strong>anyway</strong>!). <strong>Rp5M dibakar</strong> untuk <strong>nol</strong> perubahan!</p>
<p><strong>Solusi:</strong> <strong>hentikan</strong> cashback untuk sure things. Alihkan ke <strong>persuadables</strong> (yang <strong>ragu</strong> transaksi!). Hasil: biaya <strong>turun</strong> 60%, transaksi <strong>naik</strong> 15%!</p>
<p><strong>Pelajaran:</strong> <strong>insentif untuk sure things</strong> = <strong>pajak kebodohan</strong>. Mereka <strong>senang</strong> (dapat uang gratis!), kamu <strong>rugi</strong> (bayar untuk yang gratis!). <strong>Uplift</strong> menghentikan <strong>pemborosan tersembunyi</strong> terbesar.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Uplift = propensity yang lebih canggih.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> <strong>Beda pertanyaan fundamental.</strong> Propensity: &ldquo;siapa akan beli?&rdquo; (termasuk <strong>sure things</strong>!). Uplift: &ldquo;siapa <strong>berubah karena</strong> kita?&rdquo; (<strong>hanya</strong> persuadables!). <strong>Model propensity yang sempurna</strong> = <strong>targeting yang buruk</strong> (menarget sure things!). <strong>Paradigma</strong> &gt; <strong>akurasi</strong>.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Diskon yang Mengusir Pelanggan</h2>
<div className="callout">
<p>TelkoNusa: 10.000 &ldquo;berisiko&rdquo; didiskon Rp50rb. Churn grup diskon NAIK 2 poin vs kontrol. Kuadran: persuadables 3.000 (churn 15%→5%), sure things 4.000, lost causes 2.000, sleeping dogs 1.000 (3%→8%).</p>
<p><strong>Pertanyaan:</strong> (a) Jelaskan kenapa churn naik. (b) Rancang ulang kampanye dengan budget Rp150jt. (c) Metrik sukses yang benar?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Sleeping dogs:</strong> 1.000 pelanggan yang akan bertahan (3%) terusik diskon menjadi 8% churn (+50 orang). Plus sure things &amp; lost causes membuang biaya tanpa hasil. Efek bersih kampanye lama ≈ nol/negatif.</p>
<p>(b) <strong>Target 3.000 persuadables saja</strong> (biaya Rp150jt): selamat ~300 (10 poin × 3.000). Net value = 300 × Rp2jt − Rp150jt = <strong>+Rp450jt</strong>. Sleeping dogs &amp; sure things: jangan hubungi sama sekali.</p>
<p>(c) <strong>Incremental retained per rupiah</strong> (bukan churn rate grup didiskon mentah — itu tanpa pembanding). Bandingkan vs kontrol yang matched, atau Qini pada holdout.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Kuadran.</strong> P(beli|kirim)=0,5, P(beli|tidak)=0,5. Kuadran apa? EV jika biaya Rp30rb, margin Rp100rb? Kirim?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>Uplift = 0,5 − 0,5 = <strong>0</strong>. <strong>Sure Thing</strong> (atau Lost Cause — bedakan by <strong>level</strong>! 0,5 = <strong>Sure Thing</strong> (tinggi!), 0,05 = <strong>Lost Cause</strong> (rendah!)).</p>
<p>EV = 0×100rb − 30rb = <strong>−Rp30rb</strong>. <strong>JANGAN kirim!</strong></p>
<p><strong>Pelajaran:</strong> <strong>level</strong> (0,5!) ≠ <strong>uplift</strong> (0!). Model risiko <strong>tertipu</strong> level tinggi. Model uplift <strong>kebal</strong>.</p>
</details>
<p><strong>Soal 2 — Qini.</strong> Kirim 20%: +400. Kirim 30%: +450. Kirim 40%: +420. Titik optimal? Mengapa turun?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p><strong>Optimal: 30%</strong> (+450, tertinggi!).</p>
<p><strong>Turun</strong> karena mulai kena <strong>sleeping dogs</strong> (uplift negatif!) + <strong>lost causes</strong> (buang biaya!). <strong>Qini</strong> = <strong>detektor</strong> sleeping dogs!</p>
</details>
<p><strong>Soal 3 — Kebijakan.</strong> τ=0,2, m=Rp300rb, c=Rp50rb. Kirim? Jika c naik ke Rp100rb?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>Net = 0,2×300rb − 50rb = 60rb − 50rb = <strong>+Rp10rb</strong> → <strong>Kirim</strong> (tipis!).</p>
<p>Jika c=Rp100rb: net = 60rb − 100rb = <strong>−Rp40rb</strong> → <strong>Jangan!</strong></p>
<p><strong>Pelajaran:</strong> <strong>keputusan sensitif</strong> terhadap biaya! <strong>Estimasi biaya</strong> harus <strong>akurat</strong> (termasuk <strong>biaya tak terlihat</strong>!).</p>
</details>
<p><strong>Soal 4 — Two-model error.</strong> Model A (P|kirim) error ±0,1. Model B (P|tidak) error ±0,1. Error uplift? Mengapa single-model lebih baik?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>Error uplift = <strong>±0,2</strong> (<strong>menumpuk</strong>! worst case!). Jika uplift <strong>sebenarnya</strong> 0,15, estimasi bisa <strong>−0,05 sampai +0,35</strong> — <strong>tanda</strong> pun bisa salah!</p>
<p><strong>Single-model</strong> (causal forest!) langsung estimasi <strong>selisih</strong> → error <strong>tidak menumpuk</strong>. <strong>Untuk produksi</strong>, single-model <strong>wajib</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Empat kata kunci uplift: <em>persuadables</em> (target!), <em>sleeping dogs</em> (jangan ganggu!), <em>Qini</em> (kapan berhenti!), <em>net uplift</em> (kebijakan!). Kuasai empat ini = kuasai targeting.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Pelanggan: P(bertahan|tanpa aksi)=95%, P(bertahan|diskon)=95%. Kuadran?"}
  options={
    ["Persuadable",
    "Sure thing — jangan buang diskon",
    "Lost cause",
    "Sleeping dog"]
  }
  correct={1}
  explanation={"Benar: outcome baik tanpa aksi, aksi tidak mengubah → sure thing. Diskon = buang Rp50rb. Model churn ('risiko rendah') benar tidak menargetnya — tapi ia juga tidak menarget persuadable berisiko-sedang."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Uplift = P(Y|T=1,X) − P(Y|T=0,X). Data apa yang WAJIB ada?"}
  options={
    ["Data observasional besar",
    "Eksperimen dengan T diacak",
    "Data survei",
    "Cukup data transaksi"]
  }
  correct={1}
  explanation={"Benar: tanpa T acak, selisihnya terkontaminasi bias seleksi (yang didiskon memang beda). Uplift = metode kausal, butuh desain kausal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Model AUC 0,9 tapi AUUC negatif. Artinya?"}
  options={
    ["Model bagus",
    "Ranking outcome bagus tapi ranking efek buruk — model salah untuk targeting",
    "Data salah",
    "Qini tidak penting"]
  }
  correct={1}
  explanation={"Benar: AUC menilai outcome, AUUC menilai efek. Untuk kampanye, yang penting efek. Salah metrik = model 'terbaik' yang merugikan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Kurva Qini memuncak di 60% lalu turun. Keputusan?"}
  options={
    ["Target 100% — makin banyak makin baik",
    "Target ~60% teratas; sisanya sure things/sleeping dogs",
    "Target 10% saja",
    "Abaikan kurva"]
  }
  correct={1}
  explanation={"Benar: setelah puncak, menambah target menurunkan gain (kena sure things = buang biaya, sleeping dogs = harm). Puncak Qini = ukuran kampanye optimal."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Bedanya propensity dan uplift dalam satu kalimat?"}
  options={
    ["Tidak ada beda",
    "Propensity: siapa akan beli/pergi. Uplift: siapa berubah KARENA aksiku",
    "Uplift lebih akurat",
    "Propensity butuh eksperimen"]
  }
  correct={1}
  explanation={"Benar: outcome vs efek. Sure thing: propensity tinggi, uplift nol. Inilah kalimat yang membedakan analis junior dan senior."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Uplift yang Menyelamatkan Rp4,8 Miliar</h2>
<p>E-commerce &ldquo;LakuTerus&rdquo;: 200.000 pelanggan &ldquo;tidak aktif&rdquo; (90 hari). Rencana: voucher Rp100rb untuk <strong>semua</strong> (biaya Rp20M!). Kamu diminta <strong>cek</strong> dengan uplift <strong>sebelum</strong> bakar Rp20M.</p>
<h3>Langkah 1 — Pilot randomized (minggu 1–2)</h3>
<p><strong>Jangan</strong> langsung 200.000! <strong>Pilot:</strong> 10.000 acak → 5.000 kirim, 5.000 tidak. <strong>Ukur</strong> uplift!</p>
<p><strong>Hasil pilot:</strong> kirim: 12% beli. Tidak: 8% beli. <strong>Uplift = +4%</strong> (rata-rata!). Tapi <strong>heterogen</strong>!</p>
<h3>Langkah 2 — Model uplift dari pilot (minggu 3)</h3>
<p>Latih <strong>causal forest</strong> dari pilot. <strong>Distribusi</strong> uplift: 30% positif tinggi (+8%), 40% ~nol (+1%), 20% nol, 10% <strong>negatif</strong> (−3%, sleeping dogs!).</p>
<h3>Langkah 3 — Kebijakan (minggu 4)</h3>
<p>Margin Rp300rb, biaya Rp100rb. <strong>Kirim</strong> jika τ×300rb &gt; 100rb → τ &gt; <strong>0,33</strong>?? Tunggu — τ dalam <strong>probabilitas</strong> (0–1!). τ=0,08 → net = 0,08×300rb − 100rb = <strong>−Rp76rb</strong>?? <strong>Salah hitung!</strong></p>
<p><strong>Koreksi:</strong> τ=0,08 artinya <strong>8% tambahan</strong> pembeli. Net per orang dikirimi = 0,08×300rb − 100rb = 24rb − 100rb = <strong>−Rp76rb</strong>. <strong>Negatif!</strong> Butuh τ &gt; 100/300 = <strong>0,33</strong>?? Itu <strong>mustahil</strong> (uplift 33% = <strong>raksasa</strong>!).</p>
<p><strong>Kesimpulan:</strong> voucher Rp100rb <strong>terlalu mahal</strong> untuk uplift 8%! <strong>Turunkan</strong> biaya (voucher Rp30rb!) atau <strong>naikkan</strong> target (hanya τ &gt; 15%!).</p>
<h3>Langkah 4 — Kebijakan revisi</h3>
<p>Voucher <strong>Rp30rb</strong> (bukan Rp100rb!). Kirim jika τ×300rb &gt; 30rb → τ &gt; <strong>0,10</strong>. Target: 30.000 (τ tertinggi!). <strong>Jangan</strong> kirim ke 170.000 lainnya!</p>
<p><strong>Hasil:</strong> biaya 30.000×30rb = <strong>Rp900jt</strong> (bukan Rp20M!). Nilai: 30.000×0,12×300rb = <strong>Rp1,08M</strong>. Net = <strong>+Rp180jt</strong>! (vs <strong>−Rp15M</strong> jika kirim semua Rp100rb!)</p>
<div className="callout">
<p><strong>What:</strong> Uplift pilot → target 30.000 (bukan 200.000!), voucher Rp30rb (bukan Rp100rb!). Net +Rp180jt (vs −Rp15M!).</p>
<p><strong>So what:</strong> <strong>Pilot</strong> + <strong>uplift</strong> + <strong>matematika biaya</strong> = <strong>menyelamatkan Rp15M</strong>. Tanpa ini = <strong>bencana</strong> Rp20M.</p>
<p><strong>Now what:</strong> (1) <strong>Selalu</strong> pilot sebelum blast! (2) <strong>Hitung</strong> net uplift (bukan cuma uplift!). (3) <strong>Biaya</strong> menentukan <strong>threshold</strong>!</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Uplift</h2>
<h3>Jebakan 1: Tidak ada data eksperimen</h3>
<p>Uplift <strong>butuh</strong> T acak! Dari <strong>observasional</strong> (yang dikirimi = yang &ldquo;dipilih&rdquo;!) = <strong>bias seleksi</strong>! <strong>Deteksi:</strong> tanya &ldquo;T-nya <strong>acak</strong>?&rdquo; Tidak = <strong>bukan uplift</strong> = <strong>propensity berbaju uplift</strong>.</p>
<h3>Jebakan 2: Two-model tanpa validasi</h3>
<p>Two-model <strong>terlihat</strong> bekerja (AUC bagus!) tapi <strong>uplift</strong> ngawur (error menumpuk!). <strong>Deteksi:</strong> <strong>Qini</strong>! Jika Qini <strong>di bawah</strong> diagonal = <strong>model merusak</strong>! <strong>Jangan</strong> percaya two-model tanpa Qini.</p>
<h3>Jebakan 3: Mengabaikan sleeping dogs</h3>
<p>Model hanya prediksi <strong>positif</strong> (tidak ada negatif!). <strong>Sleeping dogs</strong> = <strong>uplift negatif</strong> = <strong>harus</strong> ada di model! <strong>Deteksi:</strong> cek <strong>distribusi</strong> uplift prediksi. Tidak ada negatif = <strong>model buta</strong> (atau <strong>tidak ada</strong> dogs — <strong>validasi</strong>!).</p>
<h3>Jebakan 4: Threshold asal</h3>
<p>&ldquo;Kirim ke top 20%&rdquo; (angka <strong>cantik</strong>!). <strong>Threshold</strong> harus dari <strong>matematika</strong> (τ×m &gt; c!), bukan <strong>estetika</strong>! <strong>Deteksi:</strong> tanya &ldquo;kenapa 20%?&rdquo; Jawaban &ldquo;biasanya&rdquo; = <strong>ngawur</strong>.</p>
<h3>Jebakan 5: Tidak mengukur <strong>realized</strong> uplift</h3>
<p>Model bilang uplift +5%, tapi <strong>tidak pernah</strong> diukur <strong>benarannya</strong>! <strong>Deteksi:</strong> <strong>holdout</strong> dari yang <strong>seharusnya</strong> dikirimi! Bandingkan <strong>prediksi</strong> vs <strong>realisasi</strong>. Selisih &gt; 50% = <strong>rekalibrasi</strong>!</p>
<h3>Jebakan 6: Uplift untuk <strong>retensi</strong> tanpa hati-hati</h3>
<p>Uplift <strong>churn</strong> = &ldquo;siapa yang <strong>tidak jadi pergi</strong> karena intervensi&rdquo;. <strong>Jebakan:</strong> intervensi (telepon!) bisa <strong>membangunkan</strong> dogs! <strong>Deteksi:</strong> <strong>ukur</strong> uplift <strong>negatif</strong> secara eksplisit! <strong>Jangan</strong> asumsikan semua intervensi <strong>baik</strong>.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam syarat: T acak, Qini validasi, distribusi lengkap, threshold matematis, realized measurement, waspada negatif. Uplift tanpa enam ini = <em>propensity yang mahal</em>.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Uplift Targeting 1 Halaman</h2>
<div className="callout">
<p><strong>🎯 UPLIFT TARGETING — [kampanye]</strong></p>
<p><strong>1. Pilot:</strong> n=__ (acak 50:50!), durasi __. <strong>Hasil:</strong> uplift rata-rata __%.</p>
<p><strong>2. Model:</strong> __ (causal forest/two-model!). <strong>Qini:</strong> __ (di atas diagonal? puncak di __%?).</p>
<p><strong>3. Ekonomi:</strong> margin Rp__, biaya Rp__. <strong>Threshold:</strong> τ &gt; __.</p>
<p><strong>4. Target:</strong> __ orang (dari __). <strong>Yang TIDAK dikirimi:</strong> __ (sure things __, lost __, dogs __!).</p>
<p><strong>5. Holdout validasi:</strong> __% dari target <strong>tidak</strong> dikirimi (ukur realized!).</p>
<p><strong>6. Proyeksi:</strong> biaya Rp__, nilai Rp__, net Rp__.</p>
</div>
<p><strong>Aturan:</strong> <strong>tidak ada</strong> kampanye &gt; Rp100jt tanpa 6 baris ini! <strong>Pilot</strong> = <strong>asuransi</strong>. <strong>Qini</strong> = <strong>bukti</strong>. <strong>Threshold</strong> = <strong>matematika</strong>.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Berapa besar pilot?</strong><br/>A: <strong>5.000–10.000</strong> (50:50!) untuk <strong>deteksi</strong> uplift 3–5%. <strong>Lebih kecil</strong> = <strong>tidak terlihat</strong> (noise!). <strong>Lebih besar</strong> = <strong>mahal</strong>. <strong>Sweet spot:</strong> cukup untuk <strong>Qini stabil</strong>.</p>
<p><strong>Q2: Uplift vs A/B testing — beda?</strong><br/>A: <strong>A/B</strong> = &ldquo;apakah kampanye <strong>bekerja</strong> (rata-rata)?&rdquo; <strong>Uplift</strong> = &ldquo;<strong>untuk siapa</strong> ia bekerja?&rdquo; <strong>A/B</strong> dulu (validasi!), lalu <strong>uplift</strong> (targeting!). <strong>Keduanya</strong>, berurutan.</p>
<p><strong>Q3: Bagaimana jika <strong>tidak ada</strong> persuadables?</strong><br/>A: <strong>Mungkin!</strong> (Produk <strong>komoditas</strong>! Kampanye <strong>lemah</strong>!). <strong>Keputusan:</strong> <strong>jangan</strong> kampanye (buang uang!) atau <strong>perbaiki</strong> kampanye (naikkan uplift!). <strong>Uplift nol</strong> = <strong>informasi berharga</strong> (bukan kegagalan!).</p>
<p><strong>Q4: Sleeping dogs — seberapa umum?</strong><br/>A: <strong>5–20%</strong> di kampanye <strong>retensi</strong>! <strong>Jarang</strong> di <strong>akuisisi</strong> (mereka belum kenalmu!). <strong>Selalu</strong> cek! <strong>Mengabaikan</strong> 10% dogs = <strong>menghancurkan</strong> 10% base!</p>
<p><strong>Q5: Satu kalimat inti lesson ini?</strong><br/>A: <strong>Jangan target yang &ldquo;berisiko&rdquo; — target yang &ldquo;berubah karena kamu&rdquo;. Empat kuadran, satu Qini, nol sleeping dogs terganggu.</strong></p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Targeting, Tiga Nasib</h2>
<h3>Kasus A: Bank — siapa dapat penawaran KPR?</h3>
<p>100.000 nasabah. Penawaran KPR (margin Rp5jt, biaya telepon Rp100rb). Model propensity: 20.000 &ldquo;berminat&rdquo; (p&gt;0,5).</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — Jebakan propensity:</strong> 20.000 &ldquo;berminat&rdquo; = <strong>campuran</strong> sure things (akan ambil KPR <strong>anyway</strong>!) + persuadables!</p>
<p><strong>Langkah 2 — Pilot uplift:</strong> 2.000 acak (1.000 telepon, 1.000 tidak). Hasil: uplift <strong>+6%</strong> rata-rata, tapi <strong>heterogen</strong>: 30% uplift +15%, 50% ~0%, 20% <strong>negatif</strong> −2% (dogs! <strong>terganggu</strong> ditawari utang!).</p>
<p><strong>Langkah 3 — Kebijakan:</strong> τ×5jt &gt; 100rb → τ &gt; <strong>0,02</strong>. Target: 8.000 (τ tertinggi!). <strong>Jangan</strong> telepon 12.000 lainnya (termasuk <strong>sure things</strong> yang akan ambil <strong>sendiri</strong>!).</p>
<p><strong>Hasil:</strong> biaya 8.000×100rb = <strong>Rp800jt</strong> (bukan Rp2M!). Nilai: 8.000×0,08×5jt = <strong>Rp3,2M</strong>. Net <strong>+Rp2,4M</strong>! (vs <strong>−Rp500jt</strong> jika telepon 20.000 buta!)</p>
<p><strong>Pelajaran:</strong> <strong>KPR</strong> = produk <strong>sensitif</strong> (utang!). <strong>Sleeping dogs</strong> = <strong>nyata</strong> (tersinggung!). <strong>Uplift</strong> = <strong>wajib</strong>.</p>
</details>
<h3>Kasus B: E-commerce — siapa dapat gratis ongkir?</h3>
<p>50.000 &ldquo;hampir checkout&rdquo; (taruh keranjang, tidak bayar). Gratis ongkir Rp20rb. Kirim ke semua?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Analisis:</strong> yang &ldquo;hampir checkout&rdquo; = <strong>sure things</strong> (akan bayar <strong>anyway</strong>!) + <strong>persuadables</strong> (butuh <strong>dorongan</strong>!) + <strong>window shoppers</strong> (lost causes!).</p>
<p><strong>Langkah 2 — Uplift:</strong> pilot 5.000. Hasil: persuadables 40% (uplift +12%), sure things 35% (uplift 0%), lost 25% (uplift 0%).</p>
<p><strong>Langkah 3 — Kebijakan:</strong> τ×margin (Rp50rb) &gt; Rp20rb → τ &gt; <strong>0,4</strong>?? <strong>Terlalu tinggi!</strong> (Uplift 40% = <strong>raksasa</strong>!). <strong>Revisi:</strong> gratis ongkir <strong>parsial</strong> (Rp10rb!) → threshold τ &gt; 0,2. Target 20.000.</p>
<p><strong>Hasil:</strong> net <strong>+Rp400jt</strong> (vs <strong>−Rp600jt</strong> jika kirim semua Rp20rb!).</p>
<p><strong>Pelajaran:</strong> <strong>biaya</strong> menentukan <strong>threshold</strong>. Biaya <strong>turun</strong> = threshold <strong>turun</strong> = target <strong>lebih banyak</strong>. <strong>Optimasi biaya + targeting</strong> = <strong>ganda</strong>.</p>
</details>
<h3>Kasus C: SaaS — siapa dapat trial diperpanjang?</h3>
<p>10.000 trial. Perpanjang 14 hari (biaya ~Rp50rb/user, support!). Untuk siapa?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — Kuadran trial:</strong> <strong>persuadables</strong> (butuh <strong>waktu</strong> evaluasi!), <strong>sure things</strong> (akan <strong>convert</strong> anyway!), <strong>lost</strong> (tidak cocok!), <strong>dogs</strong> (<strong>terganggu</strong> &ldquo;dipaksa&rdquo;!).</p>
<p><strong>Langkah 2 — Sinyal:</strong> <strong>penggunaan</strong> (login 5+ hari tapi <strong>belum</strong> convert!) = <strong>persuadable</strong>. <strong>Tidak login</strong> = <strong>lost</strong>. <strong>Power user</strong> = <strong>sure thing</strong>.</p>
<p><strong>Langkah 3 — Kebijakan:</strong> perpanjang <strong>hanya</strong> untuk &ldquo;aktif tapi belum convert&rdquo; (3.000!). <strong>Jangan</strong> untuk tidak aktif (buang!) atau power user (tidak butuh!).</p>
<p><strong>Hasil:</strong> convert +8% (vs +2% jika perpanjang semua!). <strong>Biaya</strong> turun 70%!</p>
<p><strong>Pelajaran:</strong> <strong>trial extension</strong> = <strong>intervensi</strong> = butuh <strong>uplift thinking</strong>! Bukan &ldquo;baik untuk semua&rdquo; — <strong>baik untuk yang tepat</strong>.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela "Jangan Kirim"</h2>
<p><strong>VP Marketing:</strong> &ldquo;Modelmu bilang <strong>jangan</strong> kirim ke 70% database? Saya bayar <strong>database</strong> untuk <strong>dipakai</strong>, bukan <strong>disimpan</strong>!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Tepatnya: 70% itu = <strong>30%</strong> sure things (kirim = <strong>buang</strong> Rp3M!), <strong>25%</strong> lost causes (kirim = <strong>buang</strong> Rp2,5M!), <strong>15%</strong> sleeping dogs (kirim = <strong>merusak</strong> Rp1,5M + <strong>kehilangan</strong> mereka!). <strong>Total</strong> kirim ke 70% = <strong>−Rp7M</strong>. <strong>Kirim</strong> ke 30% persuadables = <strong>+Rp2,4M</strong>. <strong>Selisih Rp9,4M.</strong> <strong>Mau bayar Rp7M</strong> untuk &lsquo;pakai database&rsquo;?&rdquo;</p>
<p><strong>VP:</strong> &ldquo;...Tapi bagaimana jika modelmu <strong>salah</strong>?&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;<strong>Valid.</strong> Solusi: <strong>holdout 10%</strong> dari yang &lsquo;jangan dikirim&rsquo; — <strong>tetap</strong> kirim (sebagai <strong>asuransi</strong>!). Jika mereka <strong>ternyata</strong> convert tinggi = <strong>model salah</strong> = <strong>perbaiki</strong>. <strong>Keputusan berbasis bukti</strong>, bukan <strong>keyakinan</strong>. <strong>Deal?</strong>&rdquo;</p>
<div className="tip">
<p><strong>💡 &ldquo;Jangan kirim&rdquo; = <em>keputusan tersulit</em> untuk dibela. Senjata: <em>angka kerugian</em> (Rp7M!) + <em>holdout asuransi</em>. <strong>Jangan</strong> minta kepercayaan buta — <strong>tawarkan</strong> pembuktian.</strong></p>
</div>

      <h2 id="faq">❓ Tanya-Jawab Kilat</h2>
<p><strong>Q1: Uplift untuk akuisisi (bukan retensi)?</strong><br/>A: <strong>Bisa!</strong> &ldquo;Siapa yang <strong>jadi pelanggan</strong> karena iklan?&rdquo; (vs <strong>akan</strong> jadi anyway!). <strong>Sama</strong> pentingnya — <strong>akuisisi</strong> yang <strong>salah target</strong> = <strong>mahal</strong>!</p>
<p><strong>Q2: Bagaimana jika <strong>tidak ada</strong> data eksperimen historis?</strong><br/>A: <strong>Mulai</strong> dengan <strong>pilot kecil</strong> (5.000!). <strong>Jangan</strong> tunggu &ldquo;data sempurna&rdquo; — <strong>pilot</strong> = <strong>data</strong>! <strong>Mulai kecil, ukur, scale.</strong></p>
<p><strong>Q3: Causal ML (EconML, CausalML) — perlu?</strong><br/>A: Untuk <strong>produksi</strong>: <strong>ya</strong> (causal forest!). Untuk <strong>mulai</strong>: <strong>two-model</strong> cukup (dengan <strong>Qini</strong>!). <strong>Jangan</strong> over-engineering sebelum <strong>validasi</strong> konsep.</p>
<p><strong>Q4: Satu kalimat inti?</strong><br/>A: <strong>Target yang berubah karena kamu, bukan yang berisiko. Empat kuadran, satu Qini.</strong></p>

      <h2 id="causalforest">🌳 Bedah Algoritma: Causal Forest</h2>
<p><strong>Two-model</strong> = dua cenayang yang <strong>salahnya menumpuk</strong>. <strong>Causal Forest</strong> (Athey &amp; Wager, 2019) = <strong>satu</strong> hutan yang langsung memprediksi <strong>selisih kausal</strong>. Ini <strong>standar emas</strong> uplift modern.</p>
<h3>Intuisi: hutan yang bertanya &ldquo;beda&rdquo;</h3>
<p><strong>Random forest biasa:</strong> &ldquo;untuk x, prediksi Y&rdquo; (satu angka!). <strong>Causal forest:</strong> &ldquo;untuk x, prediksi <strong>τ(x) = Y(1) − Y(0)</strong>&rdquo; (<strong>selisih</strong>!).</p>
<p><strong>Cara kerja (disederhanakan):</strong></p>
<p><strong>Langkah 1 — Split by heterogenitas:</strong> pohon biasa split untuk <strong>prediksi Y akurat</strong>. Causal tree split untuk <strong>beda τ antar-daun maksimal</strong>! (Daun A: τ=+10%, daun B: τ=−2% → <strong>split bagus</strong>! Daun A &amp; B τ sama → <strong>split sia-sia</strong>!)</p>
<p><strong>Langkah 2 — Honest estimation:</strong> <strong>setengah</strong> data untuk <strong>bangun</strong> pohon (split!), <strong>setengah</strong> untuk <strong>estimasi</strong> τ di daun! (<strong>Jangan</strong> pakai data yang sama untuk <strong>keduanya</strong> — <strong>overfit</strong>! Ini = <strong>&ldquo;honesty&rdquo;</strong>!)</p>
<p><strong>Langkah 3 — Forest:</strong> <strong>ratusan</strong> pohon honest → <strong>rata-rata</strong> τ(x). <strong>Plus:</strong> <strong>interval kepercayaan</strong>! (&ldquo;τ = +5% ± 2%&rdquo; — <strong>ketidakpastian</strong> terukur!)</p>
<p><strong>Kepribadian:</strong> seperti <strong>juri</strong> yang tidak bertanya &ldquo;berapa nilaimu?&rdquo; tapi <strong>&ldquo;berapa beda nilaimu jika...?&rdquo;</strong> — langsung ke <strong>pertanyaan kausal</strong>!</p>
<h3>Mengapa lebih baik dari two-model?</h3>
<p><strong>(a) Error tidak menumpuk:</strong> langsung estimasi <strong>selisih</strong> (bukan selisih <strong>dua estimasi</strong>!). <strong>(b) Heterogenitas:</strong> split <strong>khusus</strong> untuk beda τ (bukan beda Y!). <strong>(c) Uncertainty:</strong> interval kepercayaan <strong>valid</strong> (honesty!). <strong>(d) Non-parametrik:</strong> tidak asumsi <strong>linear</strong>!</p>
<h3>Kapan pakai?</h3>
<p><strong>Wajib</strong> untuk <strong>produksi</strong> uplift (data 10.000+!). <strong>Library:</strong> <strong>grf</strong> (R!), <strong>EconML</strong> (Python!). <strong>Jangan</strong> untuk data <strong>kecil</strong> (&lt; 5.000 — <strong>overfit</strong>!) atau <strong>tanpa</strong> T acak (<strong>bukan</strong> kausal!).</p>
<details className="worked">
<summary>📐 Contoh: Causal forest vs two-model (klik untuk buka)</summary>
<p>Data: 20.000 (10.000 T=1, 10.000 T=0). Uplift <strong>sebenarnya</strong> (simulasi!): 30% τ=+10%, 50% τ=0%, 20% τ=−5%.</p>
<p><strong>Two-model:</strong> Model A AUC 0,75, Model B AUC 0,74. <strong>Uplift prediksi:</strong> korelasi dengan <strong>sebenarnya</strong> = <strong>0,45</strong>. <strong>Qini:</strong> 0,08.</p>
<p><strong>Causal forest:</strong> <strong>Korelasi</strong> = <strong>0,72</strong>! <strong>Qini:</strong> <strong>0,15</strong> (<strong>2x</strong> two-model!).</p>
<p><strong>Mengapa menang?</strong> Two-model <strong>buang</strong> informasi (dua model <strong>independen</strong>!). Causal forest <strong>fokus</strong> ke <strong>selisih</strong> (split by heterogenitas!).</p>
<p><strong>Pelajaran:</strong> untuk <strong>uplift</strong>, <strong>algoritma kausal</strong> &gt; <strong>algoritma prediktif</strong>. <strong>Pertanyaan</strong> menentukan <strong>senjata</strong>.</p>
</details>
<div className="tip">
<p><strong>💡 Hierarki uplift: RCT + causal forest (terbaik!) &gt; RCT + two-model &gt; observasional + apapun (terburuk!). <em>Data</em> (RCT!) &gt; <em>algoritma</em>. Tapi <em>algoritma kausal</em> &gt; <em>algoritma prediktif</em> untuk <em>data yang sama</em>.</strong></p>
</div>

      <h2 id="metrik">📏 Mengukur Uplift: Metrik yang Benar</h2>
<p><strong>Kesalahan fatal:</strong> evaluasi model uplift dengan <strong>akurasi/AUC</strong>! <strong>Uplift</strong> = <strong>selisih kausal</strong> — <strong>tidak teramati</strong> (tidak ada &ldquo;label&rdquo; uplift!). <strong>Metrik yang benar:</strong> <strong>Qini</strong>, <strong>uplift@k</strong>, <strong>AUUC</strong>.</p>
<h3>Qini coefficient — metrik utama</h3>
<p><strong>Definisi:</strong> <strong>Area</strong> antara kurva Qini model vs <strong>random</strong>. <strong>Qini &gt; 0</strong> = lebih baik dari random. <strong>Qini &lt; 0</strong> = <strong>lebih buruk</strong> (merusak!).</p>
<p><strong>Cara hitung (intuisi):</strong> urutkan by uplift prediksi. Untuk <strong>setiap</strong> k% teratas: hitung <strong>incremental gain</strong> = (konversi T=1 − konversi T=0) di k% itu. <strong>Plot</strong> vs k. <strong>Area</strong> di atas diagonal = Qini.</p>
<p><strong>Interpretasi:</strong> Qini 0,15 = <strong>model menangkap 15% &ldquo;nilai targeting sempurna&rdquo;</strong>. <strong>Bandingkan</strong> antar-model (pilih <strong>tertinggi</strong>!). <strong>Jangan</strong> bandingkan <strong>antar-dataset</strong> (skala beda!).</p>
<h3>Uplift@k — metrik bisnis</h3>
<p><strong>Definisi:</strong> <strong>incremental gain</strong> di <strong>k% teratas</strong> (k = <strong>budget</strong>!). <strong>Misal:</strong> uplift@30% = +550 pembeli (dari contoh Qini!).</p>
<p><strong>Kegunaan:</strong> <strong>langsung</strong> ke <strong>keputusan</strong> (&ldquo;kirim ke 30% = +550!&rdquo;). <strong>Qini</strong> = <strong>bantuan model</strong>. <strong>Uplift@k</strong> = <strong>bantuan bisnis</strong>. <strong>Laporkan keduanya.</strong></p>
<h3>AUUC — area under uplift curve</h3>
<p><strong>Definisi:</strong> <strong>Area</strong> di bawah <strong>kurva uplift</strong> (mirip Qini, tapi <strong>normalisasi</strong> beda!). <strong>Kegunaan:</strong> <strong>bantuan model</strong> saat <strong>Qini</strong> tidak stabil. <strong>Pilih satu</strong> (Qini <strong>atau</strong> AUUC!) — <strong>jangan</strong> keduanya (membingungkan!).</p>
<details className="worked">
<summary>📐 Contoh: Memilih model by Qini (klik untuk buka)</summary>
<p><strong>Tiga model</strong>, data validasi sama:</p>
<p><strong>Model A</strong> (two-model): Qini = <strong>0,08</strong>. Uplift@30% = +300.</p>
<p><strong>Model B</strong> (causal forest): Qini = <strong>0,15</strong>. Uplift@30% = +550.</p>
<p><strong>Model C</strong> (propensity!): Qini = <strong>−0,03</strong> (<strong>negatif</strong>!). Uplift@30% = +100.</p>
<p><strong>Pilih: B</strong> (Qini tertinggi!). <strong>Model C</strong> (propensity!) <strong>merusak</strong> (Qini negatif!) — <strong>bukti</strong> paradigma risiko <strong>salah</strong> untuk targeting!</p>
<p><strong>Pelajaran:</strong> <strong>Qini</strong> = <strong>wasit</strong> yang <strong>jujur</strong>. <strong>AUC</strong> = <strong>wasit</strong> yang <strong>buta</strong> (untuk uplift!). <strong>Pilih wasit yang benar.</strong></p>
</details>
<div className="tip">
<p><strong>💡 Aturan evaluasi uplift: (1) <em>jangan</em> pakai akurasi/AUC; (2) <em>pakai</em> Qini untuk bantuan model; (3) <em>pakai</em> uplift@k untuk keputusan bisnis; (4) <em>validasi</em> dengan holdout. Empat aturan = evaluasi yang benar.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
            <h2 id="tambahan-hitung">📐 Worked Example: Menghitung Skor Uplift &amp; Memotong Kuadran</h2>
<p>Teori empat kuadran (Persuadables, Sure Things, Lost Causes, Do-Not-Disturbs) baru berguna kalau kamu bisa menghitungnya dari data eksperimen. Contoh ini memakai 8 pelanggan dari A/B test voucher Rp50.000 — cukup kecil untuk dihitung dengan tangan, cukup nyata untuk menunjukkan polanya.</p>
<p><strong>Data eksperimen:</strong> 4 pelanggan <em>diobati</em> (dapat voucher), 4 <em>kontrol</em> (tidak). Hasil beli (1) / tidak (0):</p>
<div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Pelanggan</th><th>Grup</th><th>Beli?</th><th>Skor model P(beli|voucher)</th><th>Skor model P(beli|tanpa voucher)</th></tr></thead>
<tbody>
<tr><td>Ani</td><td>Voucher</td><td>1</td><td>0,75</td><td>0,20</td></tr>
<tr><td>Budi</td><td>Voucher</td><td>1</td><td>0,90</td><td>0,85</td></tr>
<tr><td>Cici</td><td>Voucher</td><td>0</td><td>0,30</td><td>0,25</td></tr>
<tr><td>Dedi</td><td>Voucher</td><td>0</td><td>0,60</td><td>0,80</td></tr>
<tr><td>Eka</td><td>Kontrol</td><td>0</td><td>0,70</td><td>0,15</td></tr>
<tr><td>Fajar</td><td>Kontrol</td><td>1</td><td>0,85</td><td>0,90</td></tr>
<tr><td>Gita</td><td>Kontrol</td><td>0</td><td>0,25</td><td>0,20</td></tr>
<tr><td>Hadi</td><td>Kontrol</td><td>1</td><td>0,55</td><td>0,75</td></tr>
</tbody>
</table>
</div>
<details className="worked">
<summary>📐 Perhitungan uplift per pelanggan (klik untuk buka)</summary>
<p><strong>Langkah 0 — Rumus two-model.</strong> <Tex math={String.raw`\text{Uplift}(x) = P(\text{beli} \mid \text{voucher}, x) - P(\text{beli} \mid \text{tanpa voucher}, x)`} />. Uplift = selisih probabilitas beli <em>karena</em> voucher.</p>
<p><strong>Langkah 1 — Hitung uplift tiap pelanggan:</strong></p>
<ul>
<li>Ani: 0,75 − 0,20 = <strong>+0,55</strong> → voucher menaikkan peluang beli 55 poin</li>
<li>Budi: 0,90 − 0,85 = <strong>+0,05</strong> → beli juga tanpa voucher</li>
<li>Cici: 0,30 − 0,25 = <strong>+0,05</strong> → tidak beli juga dengan voucher</li>
<li>Dedi: 0,60 − 0,80 = <strong>−0,20</strong> → voucher <em>menurunkan</em> peluang beli!</li>
<li>Eka: 0,70 − 0,15 = <strong>+0,55</strong> → kandidat persuadable (walaupun di grup kontrol)</li>
<li>Fajar: 0,85 − 0,90 = <strong>−0,05</strong> → sure thing</li>
<li>Gita: 0,25 − 0,20 = <strong>+0,05</strong> → lost cause</li>
<li>Hadi: 0,55 − 0,75 = <strong>−0,20</strong> → do-not-disturb</li>
</ul>
<p><strong>Langkah 2 — Petakan ke kuadran</strong> (ambang: uplift &gt; +0,10 = persuadable; uplift &lt; −0,10 = do-not-disturb; P tanpa voucher &gt; 0,5 = sure thing; sisanya lost cause):</p>
<ul>
<li><strong>Persuadables:</strong> Ani, Eka (2 orang) — <em>kirim voucher!</em></li>
<li><strong>Sure Things:</strong> Budi, Fajar (2 orang) — beli tanpa voucher; kirim = buang Rp50.000</li>
<li><strong>Lost Causes:</strong> Cici, Gita (2 orang) — tidak beli juga; kirim = buang Rp50.000</li>
<li><strong>Do-Not-Disturbs:</strong> Dedi, Hadi (2 orang) — voucher <em>menurunkan</em> pembelian; kirim = merusak</li>
</ul>
<p><strong>Langkah 3 — Keputusan budget.</strong> Dari 8 pelanggan, hanya <strong>2</strong> yang layak dikirimi voucher. Targeting &ldquo;semua orang&rdquo; = Rp400.000 biaya untuk hasil yang <em>lebih buruk</em> (Dedi &amp; Hadi malah pergi). Targeting uplift = Rp100.000 untuk 2 persuadables. <strong>Penghematan 75% + menghindari kerusakan.</strong></p>
<p><strong>Langkah 4 — Validasi jujur.</strong> Skor di atas dari model yang dilatih di data eksperimen <em>yang sama</em> — ini overfit untuk ilustrasi. Di praktik: latih di 70% data eksperimen, evaluasi uplift &amp; kurva Qini di 30% sisanya. Model yang tidak mengalahkan &ldquo;target acak&rdquo; di Qini = jangan dipakai.</p>
</details>
<div className="tip">
<p><strong>💡 Intuisi satu kalimat: propensity menjawab &ldquo;siapa yang akan beli?&rdquo; (Budi &amp; Fajar — yang justru tidak butuh voucher); uplift menjawab &ldquo;siapa yang beli <em>karena</em> voucher?&rdquo; (Ani &amp; Eka). Targeting yang menguntungkan hanya peduli pada pertanyaan kedua.</strong></p>
</div>

      <h2 id="tambahan-faq">❓ FAQ: Pertanyaan yang Sering Muncul Seputar Uplift Modeling</h2>
<h3>1. &ldquo;Kenapa tidak cukup target pelanggan dengan propensity tertinggi?&rdquo;</h3>
<p>Karena propensity tertinggi = <strong>Sure Things</strong>: mereka beli tanpa insentif. Mengirimi mereka voucher = <strong>subsidi untuk perilaku yang sudah terjadi</strong> — margin dibakar tanpa tambahan revenue. Contoh klasik: maskapai mengirim diskon ke penumpang yang <em>sudah</em> memesan tiap bulan. Uplift justru sering menemukan persuadables di <strong>propensity menengah</strong> — orang yang ragu-ragu, dan keraguan itulah yang bisa dibeli oleh insentif.</p>
<h3>2. &ldquo;Bisakah uplift dihitung tanpa eksperimen (data observasional saja)?&rdquo;</h3>
<p><strong>Bisa, tapi dengan asumsi kuat.</strong> Data observasional tercemar <em>selection bias</em>: voucher biasanya dikirim ke pelanggan &ldquo;bagus&rdquo; — sehingga korelasi voucher→beli terlihat besar padahal itu efek seleksi. Teknik koreksi (propensity score weighting, doubly robust) membantu <em>jika</em> semua faktor seleksi tercatat — yang jarang terjadi. Aturan praktis: <strong>eksperimen kecil yang bersih &gt; data observasional besar yang kotor</strong>. Bahkan 5.000 sampel A/B test mengalahkan 5 juta baris data bias.</p>
<h3>3. &ldquo;Berapa sampel eksperimen yang dibutuhkan?&rdquo;</h3>
<p>Uplift = selisih dua probabilitas, sehingga butuh <strong>4x sampel</strong> dibanding A/B test biasa untuk efek yang sama (varians selisih = jumlah varians). Praktiknya: untuk mendeteksi uplift 2–3 poin dengan power 80%, siapkan <strong>20.000–50.000 per grup</strong> untuk base rate ~10%. Di bawah itu, skor uplift individu terlalu noisy — pakai segment-level uplift (rata-rata per segmen) yang lebih stabil daripada skor per orang.</p>
<h3>4. &ldquo;Qini vs AUC — apa bedanya?&rdquo;</h3>
<p><strong>AUC</strong> mengukur &ldquo;seberapa baik model memprediksi <em>siapa beli</em>&rdquo; — metrik propensity, tidak peduli kausalitas. <strong>Qini</strong> mengukur &ldquo;seberapa baik model mengurutkan <em>siapa yang beli karena treatment</em>&rdquo; — dihitung dari data eksperimen dengan membandingkan incremental gain per decile. Model dengan AUC 0,85 tapi Qini datar = model propensity yang menyamar sebagai model uplift. <strong>Selalu evaluasi model uplift dengan Qini/AUUC, bukan AUC.</strong></p>
<h3>5. &ldquo;Kapan uplift modeling tidak worth it?&rdquo;</h3>
<p>Tiga kondisi: (a) <strong>biaya treatment ≈ 0</strong> (push notification gratis) — kirim ke semua orang saja, tidak perlu model; (b) <strong>tidak ada variasi respons</strong> — semua orang merespons sama (cek dulu: jika A/B test menunjukkan efek homogen, uplift = overkill); (c) <strong>tidak bisa eksperimen dan tidak ada data bersih</strong> — model uplift dari data kotor = targeting yang percaya diri tapi salah. Uplift bersinar saat treatment <strong>mahal</strong> (diskon, sales call) dan respons <strong>heterogen</strong>.</p>
<div className="tip">
<p><strong>💡 Benang merah: uplift modeling adalah disiplin <em>menahan diri</em> — menahan diri untuk tidak mengirim ke yang tidak butuh, menahan diri untuk tidak mengklaim kausalitas dari korelasi, dan menahan diri untuk tidak memakai model saat aturannya sederhana. Analis uplift yang baik sama bangganya dengan &ldquo;jangan kirim&rdquo; seperti dengan &ldquo;kirim&rdquo;.</strong></p>
</div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Empat kuadran</strong>: sure things (buang biaya), persuadables (TARGET), lost causes (buang biaya), sleeping dogs (JANGAN ganggu).</li>
<li><strong>Uplift</strong> = P(Y|T=1,X) − P(Y|T=0,X); butuh data eksperimen.</li>
<li><strong>Metode</strong>: two-model (simple), single-model interaksi, class transformation.</li>
<li><strong>Evaluasi</strong>: Qini curve / AUUC — bukan AUC. Puncak Qini = ukuran kampanye optimal.</li>
<li><strong>Kebijakan</strong>: target jika uplift×V − C &gt; 0; tidak pernah ke uplift negatif.</li>
<li><strong>Kapan TIDAK perlu uplift</strong>: aksi murah & tak mengganggu (cukup propensity+EV).</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk10-incrementality" className="btn btn-secondary btn-sm">← MK10</Link>
        <Link href="/learn/mk12-attribution" className="btn btn-primary btn-sm">MK12 →</Link>
      </div>
    </div>
  );
}
