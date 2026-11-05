"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk6ChurnPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK6 — Marketing Data Analytics</span>
        <h1 className="display-title">Churn:<br/>Siapa yang Akan Pergi (dan Kenapa)</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Model 95% Akurat yang Tidak Menyelamatkan Siapa Pun</a></li>
<li><a href="#definisi">Definisi Churn yang Operasional</a></li>
<li><a href="#klasifikasi">Klasifikasi Churn</a></li>
<li><a href="#survival">Survival Analysis</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Anatomi Churn</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Kampanye Rp500 Juta yang Gagal</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Dari "Churn 5%" ke Program yang ROI-positif</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Churn</a></li>
<li><a href="#extra3">📋 Playbook: Churn War-Room 1 Halaman</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Churn</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Mempertahankan Definisi</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Mendefinisikan churn secara operasional untuk bisnis kontrak vs non-kontrak.</li>
<li>Membangun model klasifikasi churn dengan penanganan imbalance dan threshold berbasis biaya.</li>
<li>Menghitung dan membaca kurva Kaplan-Meier termasuk data tersensor.</li>
<li>Menghitung ROI kampanye retensi: kapan menyelamatkan pelanggan itu menguntungkan.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Model 95% Akurat yang Tidak Menyelamatkan Siapa Pun</h2>
      <div className="story">
        <p>Tim data <em>&ldquo;TelkoNusa&rdquo;</em> merayakan: model churn mereka <strong>akurasi 95%</strong>! Deploy ke produksi, kampanye retensi jalan — diskon Rp50rb untuk 10.000 &ldquo;berisiko churn&rdquo;. Hasilnya? Churn hampir tidak turun, biaya Rp500 juta melayang.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: 95% akurasi = model yang selalu menebak &ldquo;tidak churn&rdquo; (churn rate cuma 5%) — akurasi menipu di data imbalance. <strong>Kedua</strong>: threshold 0,5 salah — biaya salah tebak tidak simetris (kehilangan pelanggan Rp2jt vs diskon sia-sia Rp50rb). <strong>Ketiga</strong>: separuh &ldquo;diselamatkan&rdquo; ternyata memang tidak akan churn (model tidak membedakan <em>persuadable</em> vs <em>sure things</em> — itu wilayah MK11). Lesson ini: prediksi churn bukan soal akurasi — soal <strong>keputusan</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="definisi">Definisi Churn — Satu Kata, Seribu Arti</h2>
<p><strong>Definisi.</strong> <strong>Churn</strong> = pelanggan berhenti menjadi pelanggan. <strong>Kontrak</strong> (telco pascabayar, SaaS): jelas — tidak perpanjang = churn, tanggalnya pasti. <strong>Non-kontrak</strong> (prabayar, ritel): tidak jelas — butuh definisi operasional, mis. &ldquo;tidak ada transaksi dalam 90 hari&rdquo; (pilih dari distribusi jeda antar-pembelian, bukan asal).</p>
<p><strong>Churn rate</strong> = yang pergi / yang ada di awal periode. Jebakan: pelanggan yang <em>baru</em> di tengah periode — pakai <strong>cohort</strong> (MK3) atau exposure-adjusted. Dan bedakan <strong>voluntary</strong> (pindah kompetitor — bisa dicegah) vs <strong>involuntary</strong> (kartu ditolak, pindah kota — model tidak membantu).</p>
<Tex math={String.raw`\text{Churn rate} = \frac{N_{\text{pergi}}}{N_{\text{awal periode}}} \quad;\quad S(t) = P(T > t)`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`N_{\text{pergi}}`} />: yang churn dalam periode</li>
<li><Tex math={String.raw`N_{\text{awal periode}}`} />: basis awal (cohort yang sama!)</li>
<li><Tex math={String.raw`S(t)`} />: fungsi survival — peluang pelanggan bertahan lebih dari t (jembatan ke analisis survival)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Definisi churn seperti <strong>definisi &lsquo;putus&rsquo; dalam hubungan</strong>: ada yang jelas (minta putus = kontrak berakhir), ada yang menggantung (tidak ada kabar 3 bulan = non-kontrak). Model apa pun sampah kalau definisinya ngawur — &lsquo;tidak aktif 30 hari&rsquo; untuk produk yang natural-nya dipakai 2 bulan sekali = false alarm massal.</p>
<p><strong>Kapan dipakai:</strong> Sebelum modeling apa pun. Tulis definisi, validasi dengan tim bisnis (&ldquo;apakah orang ini benar-benar hilang?&rdquo;), baru hitung.</p>
<details className="worked">
<summary>📐 Contoh: Memilih jendela definisi (klik untuk buka)</summary>
<p>E-commerce: distribusi jeda antar-pembelian — median 45 hari, persentil 90 = 120 hari.</p>
<p><strong>Pilihan:</strong> definisi churn = &ldquo;tidak beli dalam 150 hari&rdquo; (&gt; P90 + buffer). Kenapa bukan 30 hari? Karena 70% pelanggan normalnya jeda &gt; 30 hari — definisi 30 hari menandai 70% basis sebagai &ldquo;churn&rdquo; (false alarm).</p>
<p><strong>Validasi:</strong> ambil 100 &ldquo;churn&rdquo; menurut definisi, cek manual/telepon sampel — berapa % yang benar-benar pergi vs cuma jeda panjang? Target: &gt;80% benar.</p>
</details>
<h2 id="klasifikasi">Klasifikasi — Menebak Siapa, Lalu Bertindak</h2>
<p><strong>Definisi.</strong> Framing <strong>klasifikasi biner</strong>: fitur (RFM, tenure, tiket CS, tren penggunaan, perubahan pola) → probabilitas churn dalam horizon (mis. 90 hari). Tiga hal yang membedakan model churn amatir vs profesional: <strong>imbalance</strong> (churn 5% — akurasi menipu; pakai PR-AUC, recall@precision, bukan akurasi), <strong>fitur tren</strong> (bukan &ldquo;total transaksi&rdquo; tapi &ldquo;penurunan transaksi 3 bulan&rdquo; — churn adalah <em>perubahan</em> perilaku), dan <strong>threshold berbasis biaya</strong>.</p>
<p><strong>Threshold:</strong> jangan 0,5 default. Hitung: selamatkan yang benar = hemat CLV − biaya; ganggu yang salah = biaya + iritasi. Pilih threshold yang memaksimalkan <strong>expected value</strong>.</p>
<Tex math={String.raw`EV = P(\text{churn}) \cdot P(\text{selamat} \mid \text{aksi}) \cdot CLV - C_{\text{aksi}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`EV`} />: expected value menghubungi satu pelanggan</li>
<li><Tex math={String.raw`P(\text{selamat} \mid \text{aksi})`} />: peluang aksi berhasil (dari eksperimen, bukan asumsi!)</li>
<li><Tex math={String.raw`C_{\text{aksi}}`} />: biaya aksi (diskon + operasional + risiko iritasi)</li>
<li>Hubungi jika EV &gt; 0. Inilah &lsquo;threshold&rsquo; yang benar — bukan 0,5</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Model churn seperti <strong>detektor asap</strong>: yang penting bukan &ldquo;akurat 95%&rdquo; tapi &ldquo;bunyi saat ada api, diam saat tidak&rdquo;. Detektor yang tidak pernah bunyi = akurasi 99% di rumah yang jarang kebakaran — dan tidak berguna. Threshold = seberapa sensitif kamu setel, tergantung harga false alarm vs kebakaran.</p>
<p><strong>Kapan dipakai:</strong> Butuh daftar &ldquo;siapa dihubungi minggu ini&rdquo; + butuh aksi segera. Horizon prediksi = horizon aksi (prediksi 90 hari untuk kampanye 90 hari).</p>
<details className="worked">
<summary>📐 Contoh: Threshold TelkoNusa (klik untuk buka)</summary>
<p>CLV Rp2jt, biaya aksi Rp50rb, P(selamat|aksi) = 20% (dari pilot). EV = p × 0,2 × 2.000.000 − 50.000.</p>
<p>EV &gt; 0 → p &gt; 50.000 / 400.000 = <strong>12,5%</strong>. Jadi hubungi semua dengan P(churn) &gt; 12,5% — <strong>bukan 50%</strong>! Threshold 0,5 melewatkan pelanggan dengan p=30% yang EV-nya positif (0,3×400rb−50rb = +Rp70rb).</p>
<p>Hasil: daftar &ldquo;berisiko&rdquo; membesar 3x, tapi tiap kontak expected-value positif. Inilah bedanya threshold statistik vs threshold bisnis.</p>
</details>
<PlotlyChart
  data={[{x: [5,10,15,20,30,40,50,60], y: [120,210,260,280,270,220,150,80], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Total EV (Rp jt)"}]}
  title={"Total expected value vs threshold"}
  layout={{xaxis: {title: "Threshold P(churn) (%)"}, yaxis: {title: "Total EV kampanye (Rp jt)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = threshold yang dipakai, Y = total expected value kampanye. Cari puncak kurva.</p>
<p><strong>Interpretasi:</strong> Puncak di threshold ~20% (EV Rp280jt). Threshold 50% (default naif) hanya memberi Rp150jt — <strong>hampir separuh nilai hilang</strong> karena terlalu banyak pelanggan EV-positif tidak dihubungi. Threshold bukan parameter statistik — ia parameter bisnis.</p>
</div>
<h2 id="survival">Survival — Bertahan Hidup sebagai Kurva</h2>
<p><strong>Definisi.</strong> <strong>Survival analysis</strong> memodelkan <em>waktu sampai churn</em>, bukan cuma ya/tidak. <strong>Fungsi survival S(t)</strong> = peluang bertahan lebih dari t. <strong>Hazard h(t)</strong> = risiko churn <em>saat ini</em> given masih bertahan. <strong>Censoring</strong>: pelanggan yang belum churn saat observasi berakhir — kita tahu ia bertahan <em>minimal</em> selama itu (jangan dibuang! mereka informasi).</p>
<p><strong>Kaplan-Meier</strong>: estimasi S(t) non-parametrik — di tiap waktu kejadian, kalikan peluang lolos: S(t) = Π (1 − d_i/n_i). <strong>Cox PH</strong>: hazard = baseline × exp(β·X) — untuk tahu <em>faktor apa</em> mempercepat churn (β positif = bahaya).</p>
<Tex math={String.raw`\hat{S}(t) = \prod_{t_i \le t}\left(1 - \frac{d_i}{n_i}\right) \quad;\quad h(t \mid X) = h_0(t)\,e^{\beta_1 X_1 + \cdots}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`d_i`} />: yang churn tepat di waktu t_i</li>
<li><Tex math={String.raw`n_i`} />: yang masih &lsquo;berisiko&rsquo; (belum churn &amp; belum tersensor) sebelum t_i</li>
<li><Tex math={String.raw`h_0(t)`} />: baseline hazard — risiko dasar seiring waktu</li>
<li><Tex math={String.raw`e^{\beta_j}`} />: hazard ratio fitur j — 1,5 = risiko 50% lebih tinggi</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Klasifikasi bertanya <strong>&lsquo;siapa yang pergi?&rsquo;</strong>, survival bertanya <strong>&lsquo;kapan mereka pergi?&rsquo;</strong> — dan &lsquo;kapan&rsquo; menentukan <em>kapan bertindak</em>. Kurva KM yang terjun di bulan ke-2 berteriak: &lsquo;perbaiki onboarding!&rsquo; — info yang tidak ada di label ya/tidak.</p>
<p><strong>Kapan dipakai:</strong> Butuh timing intervensi, membandingkan ketahanan cohort (kurva KM per cohort!), atau menganalisis faktor risiko (Cox). Wajib paham censoring — buang data tersensor = bias survivorship.</p>
<details className="worked">
<summary>📐 Contoh: Membaca kurva KM (klik untuk buka)</summary>
<p>KM pelanggan baru: S(1)=0,80, S(3)=0,62, S(6)=0,55, S(12)=0,50.</p>
<p><strong>Baca:</strong> 20% hilang di bulan pertama (terjun curam!) — masalah onboarding/ekspektasi. Lalu melandai: yang lolos 3 bulan cenderung setia (S(12)=50%). <strong>Median survival</strong> = 12 bulan (S turun ke 0,5).</p>
<p><strong>Tindakan:</strong> intervensi di minggu 1–4 (di sanalah darah mengucur), bukan kampanye &ldquo;win-back&rdquo; di bulan ke-11.</p>
</details>
<PlotlyChart
  data={[{x: [0,1,2,3,6,9,12], y: [1,0.8,0.68,0.62,0.55,0.52,0.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Cohort baru"}, {x: [0,1,2,3,6,9,12], y: [1,0.92,0.85,0.8,0.75,0.72,0.7], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "Cohort lama"}]}
  title={"Kurva Kaplan-Meier: cohort baru vs lama"}
  layout={{xaxis: {title: "Bulan sejak join"}, yaxis: {title: "S(t): peluang bertahan"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = umur pelanggan, Y = peluang masih bertahan. Dua kurva = dua cohort. Tanda + (jika ada) = titik sensor.</p>
<p><strong>Interpretasi:</strong> Cohort baru (biru) terjun di bulan 1–2 lalu melandai di 50%; cohort lama (kuning) jauh lebih landai (70% di bulan 12). <strong>Kualitas memburuk</strong> — konsisten dengan temuan cohort table MK3. Keputusan: perbaiki 60 hari pertama, bukan tambah akuisisi.</p>
</div>

      <h2 id="pendalaman">🧠 Pendalaman: Anatomi Churn</h2>
<p>Churn terlihat seperti satu angka — &ldquo;5% per bulan&rdquo;. Padahal ia <strong>empat keputusan definisi + satu masalah statistik + satu jebakan evaluasi</strong> yang dibungkus jadi satu persen. Empat pendalaman: (1) definisi mana yang kamu pakai menentukan <strong>siapa</strong> yang dihitung pergi; (2) logo churn vs revenue churn — dua angka yang bercerita berlawanan; (3) censoring — mengapa data churn <strong>tidak pernah lengkap</strong>; (4) mengapa akurasi 95% bisa tidak berguna sama sekali.</p>
<h3>1. Definisi Churn = Definisi &ldquo;Pergi&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Churn kontraktual</em>: pelanggan membatalkan langganan (teramati jelas). <em>Churn behavioral</em>: pelanggan <strong>dianggap</strong> pergi setelah X hari tanpa aktivitas (X = keputusanmu!). <em>Logo churn</em>: % pelanggan yang pergi. <em>Revenue churn</em>: % revenue yang hilang (termasuk downgrade, tidak termasuk pelanggan baru).</p>
<p><strong>Kepribadian/intuisi:</strong> Definisi churn seperti <strong>definisi &ldquo;putus&rdquo; dalam hubungan</strong>: apakah saat tidak chat 3 hari? Saat memblokir? Saat menikah dengan orang lain? Setiap definisi menghasilkan <strong>daftar mantan yang berbeda</strong> — dan strategi &ldquo;balikan&rdquo; (win-back) yang berbeda. Startup yang tidak menulis definisi churn-nya = orang yang tidak tahu kapan ia jomblo.</p>
<p><strong>Empat definisi behavioral yang umum</strong> (pilih satu, tulis, jangan ganti-ganti): (a) <strong>fixed window</strong>: tidak transaksi 90 hari = churn (sederhana, kaku); (b) <strong>personalized</strong>: tidak transaksi 3x siklus belanja normalnya (adil per individu — lihat BG/NBD di MK5!); (c) <strong>event-based</strong>: uninstall / hapus akun = churn (keras, jelas); (d) <strong>probabilistik</strong>: P(alive) &lt; 20% = churn (halus, butuh model).</p>
<p><strong>Kapan dipakai:</strong> Kontraktual untuk SaaS; behavioral untuk non-kontrak; revenue churn untuk laporan ke direksi (uang yang bicara); logo churn untuk operasional (berapa orang yang harus diganti).</p>
<details className="worked">
<summary>📐 Contoh 1a: Satu bisnis, empat angka churn (klik untuk buka)</summary>
<p>Kopi langganan &ldquo;SeduhRutin&rdquo;, 10.000 pelanggan awal bulan.</p>
<p><strong>Langkah 1 — Kontraktual:</strong> 400 membatalkan → <strong>4%</strong>.</p>
<p><strong>Langkah 2 — Behavioral (90 hari tanpa order):</strong> 1.200 memenuhi → <strong>12%</strong>. (Termasuk 400 kontraktual + 800 &ldquo;tidur&rdquo; yang belum batal resmi.)</p>
<p><strong>Langkah 3 — Logo vs revenue:</strong> 400 yang batal: 300 pelanggan Rp150rb/bln + 100 pelanggan Rp500rb/bln (premium!). Logo churn = 4%; revenue churn = (300×150rb + 100×500rb)/(total revenue 10.000×rata-rata Rp200rb) = 95jt/2M = <strong>4,75%</strong>.</p>
<p><strong>Langkah 4 — Keputusan berbeda:</strong> logo 4% bilang &ldquo;biasa saja&rdquo;; tapi yang pergi <strong>premium 2,5x lebih banyak dari porsinya</strong> (100 dari 400 = 25%, padahal premium cuma 10% base). Revenue churn 4,75% + komposisi premium = <strong>alarm</strong>.</p>
<p><strong>Pelajaran:</strong> satu angka churn = satu kebutaan. Minimal laporkan <strong>pasangan</strong>: logo + revenue, kontraktual + behavioral. Empat angka = empat mata.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Memilih X untuk &ldquo;90 hari tanpa order&rdquo; (klik untuk buka)</summary>
<p>Bagaimana menentukan X yang tidak asal?</p>
<p><strong>Langkah 1 — Distribusi inter-purchase time:</strong> 90% pelanggan yang <em>akhirnya kembali</em> melakukannya dalam 60 hari. Jadi X=90 hari = &ldquo;melewati 90% pola normal&rdquo;.</p>
<p><strong>Langkah 2 — Uji sensitivitas:</strong> X=60 → churn 18%; X=90 → 12%; X=120 → 9%. Pilih X di <strong>daerah datar</strong> (90–120 stabil) — bukan di daerah curam (60–90 sensitif).</p>
<p><strong>Langkah 3 — Validasi bisnis:</strong> dari yang &ldquo;churn&rdquo; di X=90, berapa % yang <em>benar-benar</em> tidak pernah kembali 6 bulan kemudian? Jika &gt; 85% → definisi bagus. Jika 50% → X terlalu agresif (kamu mengubur orang hidup!).</p>
<p><strong>Pelajaran:</strong> X bukan parameter — ia <strong>keputusan bisnis</strong> yang harus divalidasi dengan data kembalinya pelanggan. &ldquo;90 hari&rdquo; karena &ldquo;biasanya begitu&rdquo; = takhayul berjas lab.</p>
</details>
<h3>2. Logo Churn vs Revenue Churn — Dua Cerita Berlawanan</h3>
<p><strong>Definisi.</strong> <Tex math={String.raw`\text{Logo churn} = \frac{\text{pelanggan pergi}}{\text{pelanggan awal}}`} /> ; <Tex math={String.raw`\text{Revenue churn} = \frac{\text{revenue hilang (churn + downgrade)}}{\text{revenue awal}}`} />. Keduanya bisa bergerak <strong>berlawanan arah</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Logo churn seperti <strong>menghitung prajurit yang gugur</strong>; revenue churn seperti <strong>menghitung kekuatan tempur yang hilang</strong>. Kehilangan 100 prajurit baru ≠ kehilangan 10 jenderal — tapi logo churn menyamakan keduanya. Perusahaan yang hanya melihat logo = jenderal yang tidak tahu ia kehilangan perwira.</p>
<p><strong>Tiga pola yang harus dikenali:</strong> (a) <strong>logo naik, revenue turun</strong>: yang pergi pelanggan kecil — sebenarnya <em>baik</em> (bersih-bersih); (b) <strong>logo turun, revenue naik</strong>: yang pergi sedikit tapi besar — <strong>krisis</strong>; (c) <strong>keduanya naik</strong>: kebakaran — semua tangan ke pompa.</p>
<p><strong>Kapan dipakai:</strong> Revenue churn untuk direksi &amp; valuasi; logo churn untuk kapasitas operasional (berapa yang harus diganti). Net revenue churn (termasuk ekspansi/upsell) untuk SaaS — bisa <strong>negatif</strong> (tumbuh walau ada yang pergi)!</p>
<details className="worked">
<summary>📐 Contoh 2a: Pola (b) — krisis yang tersembunyi (klik untuk buka)</summary>
<p>SaaS &ldquo;KantorPintar&rdquo;: Q1 → Q2. Logo churn: 6% → <strong>5%</strong> (membaik! 🎉). Revenue churn: 4% → <strong>9%</strong> (memburuk! 🚨).</p>
<p><strong>Langkah 1 — Bedah yang pergi:</strong> Q2: 50 pelanggan pergi (dari 1.000) — tapi 10 di antaranya enterprise @Rp50jt/tahun; 40 sisanya SMB @Rp5jt/tahun.</p>
<p><strong>Langkah 2 — Hitung:</strong> revenue hilang = 10×50jt + 40×5jt = 500jt + 200jt = <strong>Rp700jt</strong> dari Rp8M = 8,75% ≈ 9%.</p>
<p><strong>Langkah 3 — Akar masalah:</strong> kompetitor meluncurkan fitur enterprise. Logo &ldquo;membaik&rdquo; karena tim CS berhasil menahan SMB (yang banyak) — tapi <strong>tidak ada yang menjaga enterprise</strong> (yang berharga).</p>
<p><strong>Keputusan:</strong> bukan &ldquo;rayakan logo&rdquo; tapi <strong>program penyelamatan enterprise</strong> + hitung NRR (net revenue retention) per tier. Logo tanpa revenue = melihat bayangan, bukan bendanya.</p>
</details>
<details className="worked">
<summary>📐 Contoh 2b: Net revenue churn negatif (klik untuk buka)</summary>
<p>Pelanggan awal: revenue Rp10M. Churn+downgrade: −Rp1,5M. Ekspansi/upsell pelanggan bertahan: +Rp2M.</p>
<p><strong>Langkah 1 — Gross revenue churn:</strong> 1,5/10 = <strong>15%</strong> — terlihat buruk.</p>
<p><strong>Langkah 2 — Net revenue churn:</strong> (1,5 − 2)/10 = <strong>−5%</strong> — NEGATIF = revenue dari base <strong>tumbuh 5%</strong> walau ada yang pergi!</p>
<p><strong>Langkah 3 — Interpretasi:</strong> bisnis ini seperti <strong>ember yang diisi lebih cepat dari bocornya</strong> — dari pelanggan yang <em>sama</em>, bukan dari akuisisi. Ini pola SaaS kelas dunia (Snowflake, Datadog: NRR &gt; 130%).</p>
<p><strong>Pelajaran:</strong> untuk SaaS, <strong>net revenue churn</strong> adalah metrik terpenting — ia menjawab &ldquo;apakah pelanggan yang bertahan semakin mencintai kita?&rdquo; Gross churn menjawab &ldquo;apakah ada yang pergi?&rdquo; — pertanyaan yang kurang penting.</p>
</details>
<h3>3. Censoring — Data yang Belum Selesai Bercerita</h3>
<p><strong>Definisi.</strong> <em>Censoring</em>: untuk pelanggan yang <strong>masih aktif hari ini</strong>, kita tidak tahu kapan mereka akan churn — data &ldquo;umurnya&rdquo; <strong>terpotong kanan</strong> (<em>right-censored</em>). Mengabaikan censoring = <strong>bias survivorship</strong>: hanya yang sudah churn yang &ldquo;lengkap&rdquo; datanya.</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>menghitung umur harapan dari batu nisan saja</strong> — orang yang masih hidup tidak punya nisan, jadi &ldquo;rata-rata umur&rdquo; terlihat terlalu pendek. Analis churn yang membuang pelanggan aktif (&ldquo;datanya belum lengkap&rdquo;) = peneliti yang hanya mewawancarai kuburan.</p>
<p><strong>Obatnya: Kaplan-Meier.</strong> Estimasi probabilitas bertahan S(t) = Π (1 − dᵢ/nᵢ) — di tiap titik waktu, hanya memakai yang <strong>masih teramati</strong> saat itu. Pelanggan yang masih aktif berkontribusi sampai &ldquo;sekarang&rdquo;, lalu keluar dari perhitungan (censored) — <strong>tanpa</strong> dianggap churn.</p>
<p><strong>Kapan dipakai:</strong> Setiap analisis &ldquo;berapa lama pelanggan bertahan&rdquo;. Jangan pernah hitung rata-rata umur dari <strong>hanya yang sudah churn</strong>.</p>
<Tex math={String.raw`S(t) = \prod_{t_i \leq t} \left(1 - \frac{d_i}{n_i}\right)}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`S(t)`} /> = probabilitas bertahan sampai waktu t; <Tex math={String.raw`d_i`} /> = yang churn tepat di waktu <Tex math={String.raw`t_i`} />; <Tex math={String.raw`n_i`} /> = yang masih &ldquo;berisiko&rdquo; (aktif &amp; teramati) sesaat sebelum <Tex math={String.raw`t_i`} />. Produk Π = &ldquo;bertahan bulan 1 DAN bulan 2 DAN ...&rdquo;.</p>
<details className="worked">
<summary>📐 Contoh 3: Kaplan-Meier 6 pelanggan (klik untuk buka)</summary>
<p>Data (bulan): A churn bln 2; B churn bln 5; C aktif sampai sekarang (bln 6, censored); D churn bln 3; E aktif sampai bln 4 lalu hilang kontak (censored bln 4); F churn bln 5.</p>
<p><strong>Langkah 1 — Urutkan event:</strong> bln 2: d=1 (A), n=6 → S(2) = 1 − 1/6 = <strong>0,833</strong>.</p>
<p><strong>Langkah 2 — bln 3:</strong> d=1 (D), n=5 (A sudah pergi) → S(3) = 0,833 × (1 − 1/5) = 0,833 × 0,8 = <strong>0,667</strong>.</p>
<p><strong>Langkah 3 — bln 4:</strong> tidak ada churn; E censored (keluar dari n, bukan dari d) → S tetap 0,667.</p>
<p><strong>Langkah 4 — bln 5:</strong> d=2 (B, F), n=3 (A,D pergi; E censored; tersisa B,C,F) → S(5) = 0,667 × (1 − 2/3) = 0,667 × 0,333 = <strong>0,222</strong>.</p>
<p><strong>Langkah 5 — Bandingkan &ldquo;naif&rdquo;:</strong> rata-rata umur yang churn saja = (2+5+3+5)/4 = 3,75 bulan. KM: median survival (S=0,5) ≈ antara bln 3–5 ≈ <strong>4 bulan</strong> — dan ini <strong>memakai</strong> info C &amp; E yang masih hidup. Tanpa KM, dua pelanggan hidup dibuang.</p>
</details>
<h3>4. Akurasi 95% yang Tidak Berguna</h3>
<p><strong>Definisi.</strong> Dengan churn 5%, model &ldquo;tebak semua tidak churn&rdquo; mendapat <strong>akurasi 95%</strong> — sempurna di angka, nol di guna. Metrik yang benar: <strong>precision</strong> (dari yang diprediksi churn, berapa % benar-benar churn), <strong>recall</strong> (dari yang benar-benar churn, berapa % tertangkap), dan <strong>expected value</strong> (berapa rupiah diselamatkan per rupiah biaya).</p>
<p><strong>Kepribadian/intuisi:</strong> Akurasi di data imbalance seperti <strong>menilai penjaga gawang dari % tendangan yang tidak masuk</strong> — 95% tendangan memang tidak ke arahnya. Yang penting: dari tendangan <strong>ke arah gawang</strong>, berapa yang ditangkap (recall) — dan berapa tangkapan yang valid bukan pelanggaran (precision).</p>
<p><strong>Kapan dipakai:</strong> Jangan pernah lapor akurasi untuk churn. Lapor: precision, recall, dan <strong>kurva profit vs threshold</strong> (Lab 2 lesson ini).</p>
<details className="worked">
<summary>📐 Contoh 4: Confusion matrix Rp500jt (klik untuk buka)</summary>
<p>10.000 pelanggan, 500 churn (5%). Model: prediksi 800 churn. Hasil: 300 benar (TP), 500 salah alarm (FP), 200 lolos (FN).</p>
<p><strong>Langkah 1 — Metrik:</strong> akurasi = (300 + 9.200)/10.000 = <strong>95%</strong> 🎉. Precision = 300/800 = <strong>37,5%</strong>. Recall = 300/500 = <strong>60%</strong>.</p>
<p><strong>Langkah 2 — Uang:</strong> biaya intervensi Rp50rb/orang × 800 = Rp40jt. Menyelamatkan 300 × 40% (success rate) = 120 orang × CLV Rp1jt = <strong>Rp120jt</strong>. Net = <strong>+Rp80jt</strong>.</p>
<p><strong>Langkah 3 — Bandingkan &ldquo;model 95% akurat&rdquo; (tebak semua tidak churn):</strong> TP=0 → menyelamatkan <strong>Rp0</strong>. Akurasi sama 95%, nilai beda Rp80jt.</p>
<p><strong>Pelajaran:</strong> <strong>akurasi = metrik kemalasan</strong>. Uang hanya peduli precision × recall × success rate × CLV − biaya. Model &ldquo;jelek&rdquo; (akurasi 85%, precision 50%, recall 80%) bisa <strong>jauh lebih menguntungkan</strong> dari model &ldquo;sempurna&rdquo; 95%.</p>
</details>
<PlotlyChart
  data={[{x: ["Bulan 1", "Bulan 2", "Bulan 3", "Bulan 4", "Bulan 5", "Bulan 6"], y: [1.0, 0.833, 0.667, 0.667, 0.222, 0.222], type: "scatter", mode: "lines+markers", line: {shape: "hv", color: "#2a7de1", width: 3}, marker: {size: 8}}]}
  title={"Kurva survival Kaplan-Meier (contoh 6 pelanggan)"}
  layout={{yaxis: {title: "S(t): probabilitas bertahan", range: [0, 1.05]}, xaxis: {title: "Bulan"}}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = bulan, Y = probabilitas masih bertahan. Garis turun <strong>hanya</strong> saat ada churn (tangga); datar saat tidak ada event atau saat ada censoring.</p>
<p><strong>Interpretasi:</strong> Datar di bulan 4 (E censored — keluar dari risiko, bukan churn) vs jatuh di bulan 5 (2 churn). Inilah bedanya KM dengan &ldquo;rata-rata umur&rdquo;: KM <strong>menghormati</strong> data yang belum selesai (C &amp; E), bukan membuangnya.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Model churn akurasi 95% = model bagus, siap deploy.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Di churn rate 5%, model &ldquo;selalu tebak tidak churn&rdquo; dapat <strong>95% gratis</strong>. Metrik yang jujur: <strong>PR-AUC</strong>, recall@k teratas, atau langsung <strong>expected value</strong> (berapa rupiah diselamatkan per rupiah biaya). Selalu tanya: &lsquo;akurasi ini vs baseline tebak-mayoritas berapa?&rsquo;</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Churn = tidak aktif X hari. Definisi universal, tinggal pakai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> X yang salah = false alarm massal atau deteksi terlambat. Definisi harus <strong>diturunkan dari data</strong> (distribusi jeda antar-pembelian, P90+) dan <strong>divalidasi</strong> (sampel manual: benarkah mereka pergi?). Produk beda, X beda — tidak ada angka universal.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Fitur terbaik churn = perubahan, bukan level.</strong> &lsquo;Total transaksi 100x&rsquo; kalah dari &lsquo;transaksi turun 60% dalam 2 bulan&rsquo;. Churn adalah <em>proses pergi</em>, bukan <em>keadaan</em>. Selalu buat fitur tren/delta/slope.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Jangan buang data tersensor.</strong> Pelanggan yang belum churn saat observasi berakhir BUKAN &lsquo;tidak churn&rsquo; — ia &lsquo;bertahan minimal selama ini&rsquo;. Membuangnya = bias survivorship (hanya belajar dari yang pergi). Inilah gunanya survival analysis.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kaplan-Meier From-Scratch</h2>
<p>Hitung kurva survival manual dari data waktu-churn (dengan sensor). Lihat S(t) turun di tiap kejadian.</p>
<PyodideLab
  title={"Lab 1 — Kaplan-Meier Manual"}
  hint={"Ubah beberapa status jadi tersensor (0) — lihat kurva berubah. Sensor ≠ hilang; mereka tetap di n_i sampai waktu sensornya."}
  defaultCode={"# Kaplan-Meier from scratch\n# (waktu_bulan, churn=1 / tersensor=0)\ndata = [(1,1),(1,1),(2,0),(2,1),(3,1),(3,0),(4,1),(5,0),(6,1),(8,1),(12,0),(12,0)]\n\ndef km(data):\n    waktu = sorted(set(t for t, _ in data))\n    S, hasil = 1.0, []\n    for t in waktu:\n        n = sum(1 for tt, c in data if tt >= t)          # at risk\n        d = sum(1 for tt, c in data if tt == t and c == 1)  # kejadian\n        if n > 0:\n            S *= (1 - d / n)\n        hasil.append((t, n, d, S))\n    return hasil\n\nprint(f\"{'t':>4}{'at-risk':>9}{'churn':>7}  S(t)\")\nfor t, n, d, s in km(data):\n    print(f\"{t:>4}{n:>9}{d:>7}  {s:.2f}\")\nprint(\"\\nMedian survival ~ t di mana S(t) <= 0.5\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Threshold Berbasis Biaya</h2>
<p>Cari threshold yang memaksimalkan expected value — bukan 0,5. Ubah biaya & CLV, lihat threshold optimal bergeser.</p>
<PyodideLab
  title={"Lab 2 — Threshold Optimal"}
  hint={"Naikkan biaya aksi 50rb → 200rb. Threshold optimal naik — makin mahal aksi, makin yakin kamu harus sebelum menghubungi."}
  defaultCode={"# Cari threshold optimal via expected value\nimport random\nrandom.seed(3)\nCLV, BIAYA, P_SELAMAT = 2_000_000, 50_000, 0.20  # ubah sesukamu\n\n# 2000 pelanggan dengan P(churn) terkalibrasi; churn aktual ~ Bernoulli(p)\npop = [random.random() ** 1.5 for _ in range(2000)]\n\ndef total_ev(th):\n    ev = 0\n    for p in pop:\n        if p >= th:\n            churn = random.random() < p\n            ev += (CLV * P_SELAMAT - BIAYA) if churn else (-BIAYA)\n    return ev / 1e6\n\nprint(f\"{'threshold':>10}  {'total EV (Rp jt)':>16}\")\nterbaik = (0, -1e9)\nfor th in [0.05, 0.10, 0.15, 0.20, 0.30, 0.50, 0.70]:\n    ev = total_ev(th)\n    print(f\"{th:>10.2f}  {ev:>16.1f}\")\n    if ev > terbaik[1]:\n        terbaik = (th, ev)\nprint(f\"\\nThreshold optimal ~ {terbaik[0]:.2f} (EV Rp{terbaik[1]:.1f} jt), bukan 0.50!\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Butuh daftar 'siapa dihubungi minggu ini' → <strong>Klasifikasi + threshold biaya</strong></h3>
<p><strong>Kenapa:</strong> Output langsung actionable (skor per pelanggan). Threshold EV memastikan tiap kontak menguntungkan.</p>
<p><strong>Contoh nyata:</strong> Kampanye win-back: hubungi p &gt; 12,5% (bukan 50%).</p>
</div>
<div className="decision-card">
<h3>2. Butuh tahu 'kapan mereka pergi' / bandingkan cohort → <strong>Kaplan-Meier</strong></h3>
<p><strong>Kenapa:</strong> Kurva menunjukkan timing — bulan ke berapa darah mengucur.</p>
<p><strong>Contoh nyata:</strong> KM per cohort: cohort baru terjun di bulan 1 → perbaiki onboarding.</p>
</div>
<div className="decision-card">
<h3>3. Butuh tahu 'faktor apa' mempercepat churn → <strong>Cox Proportional Hazards</strong></h3>
<p><strong>Kenapa:</strong> Hazard ratio per fitur: tiket CS 3x = risiko 2x lipat, dst.</p>
<p><strong>Contoh nyata:</strong> Prioritas product fix: faktor dengan HR terbesar & bisa diubah.</p>
</div>
<div className="decision-card">
<h3>4. Intervensi mahal / hanya untuk yang 'bisa dibujuk' → <strong>Lanjut ke Uplift Modeling (MK11)</strong></h3>
<p><strong>Kenapa:</strong> Klasifikasi churn menebak siapa pergi; uplift menebak siapa pergi YANG BISA dicegah.</p>
<p><strong>Contoh nyata:</strong> Diskon Rp200rb hanya untuk persuadable — bukan untuk sure things/lost causes.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Definisi dulu</strong> — dari data, divalidasi.</li><li><strong>Jangan percaya akurasi</strong> di data imbalance.</li><li><strong>Threshold = keputusan bisnis</strong> (EV), bukan 0,5.</li><li><strong>Fitur tren</strong> mengalahkan fitur level.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Model 95% Akurat yang Tidak Menyelamatkan Siapa Pun</h3>
<p>Bank &ldquo;Danarta&rdquo; bangga: model churn kartu kredit <strong>akurasi 95%</strong>. Tapi program retensi (biaya Rp500jt/tahun) tidak pernah menunjukkan ROI. Audit: model memprediksi churn dengan <strong>precision 22%</strong> — dari 1.000 &ldquo;berisiko&rdquo;, 780 salah alarm. Tim retensi menelepon 780 orang yang <strong>tidak mau pergi</strong> — sebagian justru <strong>terganggu dan malah pergi</strong> (sleeping dogs, MK11!).</p>
<p>Perbaikan: ganti threshold berbasis <strong>expected value</strong> (Lab 2): hanya hubungi jika P(churn) × CLV × success rate &gt; biaya telepon. Prediksi menyusut 1.000 → 250, precision naik 22% → <strong>58%</strong>, dan — yang terpenting — <strong>net ROI positif pertama kalinya</strong>. Akurasi turun 95% → 91%. Tidak ada yang peduli.</p>
<p><strong>Pelajaran:</strong> model churn dievaluasi dengan <strong>rupiah</strong>, bukan persen. 95% yang salah target &lt; 91% yang tepat sasaran.</p>
<h3>Kisah 2: Win-Back yang Membangunkan Anjing Tidur</h3>
<p>E-commerce &ldquo;LakuTerus&rdquo; mengirim voucher Rp100rb ke 50.000 &ldquo;churn&rdquo; (definisi: 90 hari tanpa beli). Hasil: 5.000 kembali belanja — <strong>dirayakan</strong>. Lalu analis iseng membandingkan dengan <strong>kontrol</strong> (50.000 churn lain yang tidak dikirimi): 4.200 kembali <strong>sendiri</strong>.</p>
<p>Hitung: lift = 5.000 − 4.200 = <strong>800</strong> (bukan 5.000!). Biaya 50.000 × Rp100rb = Rp5M. Nilai 800 × margin Rp150rb = Rp120jt. <strong>ROI = −97,6%</strong>. &ldquo;Kampanye sukses&rdquo; itu sebenarnya <strong>membakar Rp4,88 miliar</strong> untuk 800 orang — Rp6,1jt per orang yang diselamatkan!</p>
<p><strong>Pelajaran:</strong> tanpa kontrol, <strong>setiap</strong> kampanye terlihat sukses (orang memang ada yang kembali sendiri). Churn <strong>harus</strong> diukur dengan eksperimen (MK9/MK10) atau uplift (MK11) — bukan dengan &ldquo;sebelum vs sesudah&rdquo;.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Churn rendah = pelanggan bahagia.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Churn rendah bisa berarti: (a) pelanggan bahagia ✓; (b) <strong>switching cost tinggi</strong> (mereka tersandera, bukan setia — bom waktu!); (c) <strong>definisi longgar</strong> (X terlalu besar); (d) <strong>pasar belum ada alternatif</strong>. Bedakan &ldquo;setia&rdquo; vs &ldquo;tersandera&rdquo; dengan <strong>NPS/survei + perilaku</strong>: yang tersandera = churn rendah + NPS rendah + tidak pernah upsell. Merekalah yang pergi <strong>berbondong-bondong</strong> saat kompetitor datang.</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Kampanye Rp500 Juta yang Gagal</h2>
<div className="callout">
<p>TelkoNusa: model &ldquo;akurasi 95%&rdquo;, threshold 0,5, diskon Rp50rb ke 10.000 pelanggan. Churn tidak turun. Investigasi: (1) baseline tebak-mayoritas = 95% (churn 5%); (2) threshold optimal via EV = 12,5%, bukan 50% — 70% pelanggan EV-positif tidak dihubungi; (3) P(selamat|aksi) cuma 8%, bukan asumsi 20%.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga kesalahan berlapisnya? (b) Hitung ulang: dengan P(selamat)=8%, berapa threshold EV-optimal? (c) Satu perbaikan proses sebelum kampanye berikutnya?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Metrik menipu</strong> (akurasi vs baseline), <strong>threshold statistik</strong> bukan bisnis, <strong>asumsi efektivitas</strong> tanpa pilot (P(selamat) ditebak, bukan diukur).</p>
<p>(b) EV &gt; 0 → p &gt; 50.000/(0,08 × 2.000.000) = 50.000/160.000 = <strong>31,25%</strong>. Dengan efektivitas rendah, threshold naik — hanya hubungi yang sangat berisiko. Atau: perbaiki dulu efektivitas aksinya (pilot A/B) sebelum scale.</p>
<p>(c) <strong>Pilot A/B kecil dulu</strong>: 1.000 pelanggan, ukur P(selamat|aksi) yang sebenarnya + EV, baru scale. Dan ganti metrik sukses model dari akurasi ke <strong>rupiah diselamatkan per rupiah biaya</strong>.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Logo vs revenue.</strong> Awal: 2.000 pelanggan, revenue Rp400jt. Pergi: 100 pelanggan @Rp100rb + 20 pelanggan @Rp1jt. Hitung logo churn &amp; revenue churn. Pola apa ini (a/b/c)?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>Logo = 120/2.000 = <strong>6%</strong>. Revenue hilang = 100×100rb + 20×1jt = 10jt + 20jt = Rp30jt → 30/400 = <strong>7,5%</strong>.</p>
<p><strong>Pola (b)</strong>: revenue churn (7,5%) &gt; logo (6%) — yang pergi <strong>lebih berharga dari rata-rata</strong>. 20 pelanggan @Rp1jt = 17% dari yang pergi tapi 67% dari revenue yang hilang. <strong>Alarm premium</strong>: investigasi mengapa pelanggan besar pergi.</p>
</details>
<p><strong>Soal 2 — KM cepat.</strong> 10 pelanggan. Bln 1: 1 churn. Bln 2: 1 censored. Bln 3: 2 churn. Hitung S(1), S(3).</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>S(1) = 1 − 1/10 = <strong>0,9</strong>. Bln 2: censored keluar dari n (n=8 setelah bln 2, S tetap 0,9). Bln 3: d=2, n=8 → S(3) = 0,9 × (1 − 2/8) = 0,9 × 0,75 = <strong>0,675</strong>.</p>
<p>Jebakan: yang menjawab S(3) = 0,9 × (1 − 2/9) = 0,7 <strong>lupa</strong> mengeluarkan censored dari n. Censored = keluar dari risiko, bukan dari dunia.</p>
</details>
<p><strong>Soal 3 — Precision vs akurasi.</strong> 20.000 pelanggan, churn 4% (800). Model A: prediksi 1.000, TP 500. Model B: &ldquo;tebak semua tidak churn&rdquo;. Hitung akurasi, precision, recall keduanya. Mana yang dipakai untuk kampanye Rp100rb/orang, success 30%, CLV Rp2jt?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p><strong>A:</strong> akurasi = (500+18.700)/20.000 = <strong>96%</strong>; precision = 500/1.000 = <strong>50%</strong>; recall = 500/800 = <strong>62,5%</strong>. <strong>B:</strong> akurasi = 19.200/20.000 = <strong>96%</strong>; precision n/a (0 prediksi); recall = <strong>0%</strong>.</p>
<p>Uang A: biaya 1.000 × 100rb = Rp100jt; selamat 500 × 30% = 150 × Rp2jt = <strong>Rp300jt</strong> → net <strong>+Rp200jt</strong>. B: Rp0.</p>
<p><strong>Akurasi sama (96%), nilai beda Rp200jt.</strong> Jika kamu memilih model by akurasi, kamu tidak bisa membedakan keduanya — dan itulah mengapa akurasi <strong>dilarang</strong> untuk churn.</p>
</details>
<p><strong>Soal 4 — Definisi X.</strong> Distribusi &ldquo;hari sampai kembali&rdquo; untuk yang kembali: 50% ≤ 30 hari, 80% ≤ 60 hari, 95% ≤ 120 hari. Usulkan X + alasan. Apa risiko X terlalu kecil vs terlalu besar?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p><strong>Usulan: X = 120 hari</strong> (mencakup 95% pola kembali normal).</p>
<p>X terlalu kecil (mis. 30 hari): <strong>false churn</strong> — mengubur orang hidup; kampanye win-back mengganggu pelanggan normal (sleeping dogs!) + biaya sia-sia.</p>
<p>X terlalu besar (mis. 365 hari): <strong>terlambat</strong> — yang benar-benar pergi sudah 8 bulan tidak bisa diselamatkan; win-back = doa.</p>
<p><strong>Prinsip:</strong> X di titik &ldquo;melewati pola normal tapi masih bisa diselamatkan&rdquo; — biasanya persentil 90–95 distribusi kembali. Dan <strong>validasi</strong>: % yang &ldquo;churn&rdquo; tapi kembali 6 bulan kemudian harus &lt; 15%.</p>
</details>
<div className="tip">
<p><strong>💡 Empat angka churn yang wajib ada di dashboard: logo, revenue, net revenue (SaaS), dan definisi X tertulis. Empat soal di atas = empat pertanyaan yang harus bisa kamu jawab sebelum rapat. Tidak bisa jawab = belum siap.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Churn rate 5%. Model 'selalu tebak tidak churn' akurasinya?"}
  options={
    ["50%",
    "95%",
    "5%",
    "Tidak bisa dihitung"]
  }
  correct={1}
  explanation={"Benar: 95% — gratis, tanpa belajar apa pun. Inilah kenapa akurasi dilarang sebagai metrik churn. Pakai PR-AUC / recall@k / expected value."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. CLV Rp2jt, biaya Rp50rb, P(selamat|aksi)=20%. Threshold EV-optimal?"}
  options={
    ["50%",
    "12,5%",
    "2,5%",
    "80%"]
  }
  correct={1}
  explanation={"Benar: p &gt; 50.000/(0,2×2.000.000) = 12,5%. Jauh di bawah 0,5 — karena menyelamatkan (Rp400rb expected) jauh lebih berharga dari biaya false alarm (Rp50rb)."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Pelanggan belum churn saat observasi berakhir. Perlakuan benar?"}
  options={
    ["Buang — datanya tidak lengkap",
    "Anggap tidak churn",
    "Perlakukan sebagai tersensor (bertahan minimal selama itu)",
    "Duplikasi"]
  }
  correct={2}
  explanation={"Benar: censoring — ia memberi info 'bertahan ≥ t'. Membuangnya = bias survivorship; menganggap 'tidak churn' = meremehkan risiko. KM menangani ini dengan benar."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Fitur mana yang PALING prediktif untuk churn?"}
  options={
    ["Total transaksi sepanjang masa",
    "Penurunan transaksi 60% dalam 2 bulan terakhir (tren)",
    "Umur akun",
    "Kota"]
  }
  correct={1}
  explanation={"Benar: churn = proses pergi. Fitur tren/delta menangkap perubahan perilaku — sinyal perginya. Level statis (total 100x) tidak tahu ia sedang pergi."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Kurva KM terjun curam di bulan 1-2 lalu melandai. Tindakan prioritas?"}
  options={
    ["Kampanye win-back bulan ke-11",
    "Perbaiki onboarding & 60 hari pertama",
    "Naikkan harga",
    "Tambah akuisisi"]
  }
  correct={1}
  explanation={"Benar: darah mengucur di bulan 1-2 — di sanalah intervensi. Win-back bulan 11 menolong sisa yang sudah sedikit. Timing = segalanya di retensi."}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Dari &ldquo;Churn 5%&rdquo; ke Program yang ROI-positif</h2>
<p>Gym chain &ldquo;BugarKu&rdquo;: 30.000 member, churn <strong>5%/bulan</strong> (angka yang &ldquo;normal&rdquo;). Tapi akuisisi makin mahal — tiap bulan harus ganti 1.500 member. CEO: &ldquo;Turunkan churn ke 3% dalam 6 bulan.&rdquo; Ini rencanamu.</p>
<h3>Langkah 1 — Bedah definisi dulu</h3>
<p>Churn 5% = <strong>behavioral</strong> (tidak datang 60 hari). Kontraktual (batal resmi): cuma 2%. Artinya 3% = &ldquo;tidur&rdquo; — <strong>masih bayar tapi tidak datang</strong>. Insight langsung: sepertiga &ldquo;churn&rdquo; sebenarnya <strong>pelanggan yang masih menghasilkan uang</strong>! Definisi yang salah membuatmu mengobati orang sehat.</p>
<h3>Langkah 2 — Kaplan-Meier per kohor: kapan mereka pergi?</h3>
<p>Kurva KM: penurunan <strong>tercuram di bulan 1–2</strong> (S turun 1,0 → 0,82) lalu melandai. Artinya: yang pergi, pergi <strong>di awal</strong> — bukan &ldquo;bosan setelah setahun&rdquo;. Hipotesis: onboarding gagal (tidak tahu pakai alat, malu bertanya), bukan &ldquo;harga mahal&rdquo;.</p>
<h3>Langkah 3 — Siapa yang pergi? (bukan sekadar berapa)</h3>
<p>Segmentasi yang churn bulan 1–2: 70% adalah <strong>member baru tanpa personal trainer trial</strong>. Yang ikut trial: churn bulan 1–2 cuma 8%. <strong>Bukan</strong> harga, <strong>bukan</strong> lokasi — <strong>pendampingan awal</strong>.</p>
<h3>Langkah 4 — Program berbasis expected value</h3>
<p>Intervensi: 1 sesi PT gratis di minggu pertama (biaya Rp150rb). Target: member baru tanpa trial dengan P(churn 60 hari) &gt; 40% (model). Dari 1.500 member baru/bulan, ~600 memenuhi. Biaya: 600 × 150rb = <strong>Rp90jt/bulan</strong>.</p>
<p>Hasil 3 bulan: churn bulan 1–2 turun 18% → 11% → churn keseluruhan 5% → <strong>3,8%</strong>. Yang diselamatkan: ~180 member/bulan × CLV Rp3jt = <strong>Rp540jt</strong> nilai — dengan biaya Rp90jt. <strong>ROI 6x.</strong></p>
<h3>Langkah 5 — Yang TIDAK dilakukan (sama pentingnya)</h3>
<p><strong>Tidak</strong> diskon untuk semua (merusak CLV, MK5!). <strong>Tidak</strong> telepon yang &ldquo;tidur tapi bayar&rdquo; (sleeping dogs — mereka menguntungkan!). <strong>Tidak</strong> target churn kontraktual 2% (mereka sudah pergi — biarkan).</p>
<div className="callout">
<p><strong>What:</strong> Churn 5% → 3,8% dalam 3 bulan, didorong penurunan churn bulan 1–2 (18%→11%).</p>
<p><strong>So what:</strong> Masalahnya onboarding, bukan harga — 70% yang pergi tidak pernah dapat pendampingan.</p>
<p><strong>Now what:</strong> (1) PT trial jadi <strong>default opt-out</strong> (bukan opt-in). (2) Monitor KM bulanan — jika curam bulan 1–2 kembali, alarm. (3) Target 6 bulan: 3% via perluasan ke minggu ke-2–4.</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Churn</h2>
<h3>Jebakan 1: Churn dihitung dari pelanggan akhir bulan</h3>
<p>Churn = pergi / pelanggan <strong>akhir</strong> (bukan awal/rata-rata). Bulan akuisisi besar: penyebut membesar → churn terlihat <strong>kecil</strong> — padahal yang pergi sama. <strong>Deteksi:</strong> penyebut harus <strong>awal periode</strong> (atau rata-rata). Selalu tanya &ldquo;dibagi apa?&rdquo;</p>
<h3>Jebakan 2: Cohort churn vs calendar churn</h3>
<p>&ldquo;Churn Januari 5%&rdquo; — dari kohor Januari? Atau semua yang churn <strong>di bulan</strong> Januari? Beda total. <strong>Deteksi:</strong> labeli jelas: &ldquo;churn kohor Jan per Feb&rdquo; vs &ldquo;churn kalender Feb&rdquo;. Campur = tidak bisa dibandingkan antar-bulan.</p>
<h3>Jebakan 3: Reaktivasi dihitung sebagai pelanggan baru</h3>
<p>Yang kembali setelah churn dihitung &ldquo;akuisisi baru&rdquo; → CAC terlihat kecil + churn terlihat kecil (mereka keluar dari pembilang?). <strong>Deteksi:</strong> pisahkan <strong>new vs resurrected</strong> di semua metrik. Resurrected = kemenangan retensi, bukan akuisisi.</p>
<h3>Jebakan 4: Model dilatih dengan fitur masa depan</h3>
<p>Fitur &ldquo;hari sejak login terakhir&rdquo; dihitung <strong>per hari ini</strong> untuk prediksi &ldquo;bulan lalu&rdquo; — bocor! Model terlihat hebat (AUC 0,95), mati di produksi. <strong>Deteksi:</strong> untuk tiap fitur tanya &ldquo;apakah ini diketahui <strong>pada saat prediksi</strong>?&rdquo; Point-in-time feature = wajib.</p>
<h3>Jebakan 5: Win-back tanpa kontrol diklaim sukses</h3>
<p>Sudah dibahas di Kisah 2 — tapi layak diulang: <strong>tanpa kontrol, semua kampanye terlihat berhasil</strong>. Aturan: tidak ada klaim &ldquo;menyelamatkan X&rdquo; tanpa grup kontrol. Tidak ada pengecualian.</p>
<div className="tip">
<p><strong>💡 Lima jebakan = lima pertanyaan audit: penyebut apa? kohor atau kalender? new vs resurrected? fitur point-in-time? ada kontrol? Jawab lima ini sebelum percaya angka churn siapa pun.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Churn War-Room 1 Halaman</h2>
<p>Template respons saat churn naik tiba-tiba — tempel di dinding, jalankan dalam 48 jam.</p>
<div className="callout">
<p><strong>🚨 CHURN ALERT — [tanggal]</strong></p>
<p><strong>1. Angka:</strong> logo __% (dari __%), revenue __%. Naik sejak kapan? Kohor mana?</p>
<p><strong>2. Definisi check:</strong> ada perubahan tracking/definisi? (Jika ya → mungkin artefak, bukan krisis.)</p>
<p><strong>3. Siapa:</strong> segmen apa yang pergi? (bedah: premium? baru? channel apa?)</p>
<p><strong>4. Kapan:</strong> kurva KM — curam di bulan berapa? (awal = onboarding; akhir = value/bosanan)</p>
<p><strong>5. Mengapa (hipotesis):</strong> top 3 — exit survey, tiket CS, perubahan produk/harga.</p>
<p><strong>6. Aksi 48 jam:</strong> (a) __ (pemilik, target); (b) __. <strong>Yang TIDAK dilakukan:</strong> __.</p>
<p><strong>7. Kontrol:</strong> setiap intervensi punya grup kontrol. Tanpa kontrol = tidak jalan.</p>
</div>
<p><strong>Aturan war-room:</strong> 48 jam pertama = <strong>diagnosis</strong>, bukan aksi massal. Aksi massal tanpa diagnosis (diskon untuk semua!) = <strong>panik yang mahal</strong>. Poin 6 (&ldquo;yang TIDAK dilakukan&rdquo;) mencegah kepanikan merusak CLV.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Involuntary churn (kartu ditolak) — dihitung?</strong><br/>A: <strong>Pisahkan!</strong> Involuntary (gagal bayar) vs voluntary (sengaja pergi) = masalah <strong>berbeda</strong> (payment vs value). Obatnya beda: retry logic + dunning vs win-back. Campur = salah obat.</p>
<p><strong>Q2: Berapa X yang &ldquo;benar&rdquo; untuk e-commerce?</strong><br/>A: Tidak ada angka universal — pakai <strong>persentil 90–95</strong> distribusi inter-purchase (lihat Soal 4). Umumnya 90–180 hari untuk FMCG, 12–24 bulan untuk elektronik. <strong>Validasi</strong> dengan % yang kembali setelah dinyatakan churn.</p>
<p><strong>Q3: Churn model vs aturan sederhana (RFM)?</strong><br/>A: Mulai dari <strong>aturan</strong> (R tinggi + F turun = risiko). Jika aturan + intervensi sudah ROI-positif, model ML = <strong>optimasi</strong>, bukan keharusan. Banyak perusahaan rugi waktu 6 bulan membangun model untuk lift 5% dari aturan 2 baris.</p>
<p><strong>Q4: Kapan berhenti me-retensi?</strong><br/>A: Saat <strong>expected value negatif</strong>: P(selamat) × CLV × success rate &lt; biaya. Atau saat pelanggan <strong>negatif CLV</strong> (MK5 Q3) — biarkan pergi dengan anggun. Retensi bukan agama; ia investasi.</p>
<p><strong>Q5: Churn naik setelah kenaikan harga — normal?</strong><br/>A: <strong>Diharapkan.</strong> Hitung: revenue dari yang bertahan (harga baru) vs yang pergi. Sering kali <strong>revenue naik</strong> walau logo churn naik — itu <strong>trade-off yang benar</strong>, bukan kegagalan. Laporkan keduanya, jangan panik.</p>
<p><strong>Q6: Bagaimana memprediksi churn <em>sebelum</em> ada data?</strong><br/>A: <strong>Leading indicators</strong>: penurunan login/fitur usage 2–4 minggu sebelum churn; tiket komplain; tidak buka email. Bangun <strong>early warning</strong> dari pola ini — jangan tunggu X hari.</p>
<p><strong>Q7: Satu metrik churn untuk board?</strong><br/>A: <strong>Net revenue retention (SaaS)</strong> atau <strong>revenue churn + logo churn</strong> (non-SaaS) + tren 4 kuartal. Satu angka tanpa tren = tidak ada konteks; tren tanpa segmen = tidak ada aksi.</p>
<p><strong>Q8: Churn 0% — mungkin?</strong><br/>A: <strong>Curigai.</strong> Churn 0% = definisi terlalu longgar, tracking rusak, atau monopoli. Churn sehat &gt; 0 — ia <strong>membersihkan</strong> pelanggan yang tidak cocok. Target bukan 0%; target = <strong>churn yang tepat</strong> (yang pergi = yang memang seharusnya pergi).</p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Bisnis, Satu Churn</h2>
<h3>Kasus A: Streaming &ldquo;NontonYuk&rdquo; — churn kontraktual 7%/bulan</h3>
<p>Konten baru mahal. CFO usul: naikkan harga 20% untuk tutup biaya konten. Analisis dampak churn?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — Elastisitas churn:</strong> data historis: kenaikan 10% → churn naik 1,5 poin (7% → 8,5%). Proyeksi kenaikan 20% → churn ≈ <strong>10%</strong>.</p>
<p><strong>Langkah 2 — Revenue:</strong> 1 juta pelanggan × Rp50rb = Rp50M. Setelah naik: harga Rp60rb, pelanggan 900rb (10% pergi... lebih tepatnya: base menyusut) → Rp54M. <strong>Revenue naik Rp4M</strong> walau churn naik!</p>
<p><strong>Langkah 3 — Jangka panjang:</strong> tapi yang pergi = <strong>paling sensitif harga = biasanya paling muda = CLV masa depan tertinggi</strong>. Trade-off: +Rp4M sekarang vs −RpX CLV masa depan. Keputusan: naikkan <strong>bertahap</strong> (10% + 10%) sambil monitor <strong>siapa</strong> yang pergi per kohor.</p>
<p><strong>Pelajaran:</strong> churn naik setelah kenaikan harga <strong>bukan otomatis kegagalan</strong> — hitung revenue-nya. Tapi waspadai <strong>seleksi</strong>: yang pergi duluan sering yang paling berharga di masa depan.</p>
</details>
<h3>Kasus B: Bank &ldquo;Danarta&rdquo; — dorman tabungan</h3>
<p>Definisi: tidak transaksi 180 hari = dorman. 200.000 rekening dorman. Program reaktivasi: biaya Rp30rb/rekening (telepon + voucher). Kapan dikirim?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Jangan semua!</strong> Bagi by saldo: &gt; Rp10jt (20.000), Rp1–10jt (80.000), &lt; Rp1jt (100.000).</p>
<p><strong>Langkah 2 — Expected value:</strong> saldo &gt; 10jt: P(reaktivasi) 25% × margin/tahun Rp500rb = Rp125rb &gt; Rp30rb → <strong>kirim</strong>. Saldo &lt; 1jt: 5% × Rp20rb = Rp1.000 &lt; Rp30rb → <strong>jangan</strong> (biarkan dorman — biaya reaktivasi &gt; nilainya!).</p>
<p><strong>Langkah 3 — Hasil:</strong> kirim ke 100.000 (bukan 200.000): biaya Rp3M vs Rp6M, hasil 90% dari nilai. <strong>Setengah biaya, hampir semua hasil</strong> — itulah gunanya segmentasi expected value.</p>
<p><strong>Pelajaran:</strong> &ldquo;reaktivasi massal&rdquo; = pajak untuk kemalasan segmentasi. Setiap rekening punya expected value — hormati angkanya.</p>
</details>
<h3>Kasus C: E-commerce &ldquo;LakuTerus&rdquo; — subscription baru</h3>
<p>Meluncurkan &ldquo;LakuPlus&rdquo; (Rp99rb/tahun, gratis ongkir). 6 bulan: 50.000 subscriber, churn 4%/bulan. Sehat?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — CLV subscriber:</strong> margin Rp99rb/tahun ≈ Rp8.250/bln (asumsi margin 100% untuk fee — sederhanakan). Churn 4%/bln → umur 25 bulan → CLV ≈ <strong>Rp206rb</strong>.</p>
<p><strong>Langkah 2 — Tapi:</strong> subscriber belanja <strong>3x lebih sering</strong> (data!) — margin belanja tambahan Rp40rb/bln. CLV total = (8.250 + 40.000)/0,04 = <strong>Rp1,2jt</strong>!</p>
<p><strong>Langkah 3 — Batas CAC:</strong> 1,2jt/3 = <strong>Rp400rb</strong> — jauh di atas &ldquo;harga&rdquo; Rp99rb. Boleh bakar sampai Rp400rb untuk akuisisi subscriber!</p>
<p><strong>Pelajaran:</strong> CLV subscription = <strong>fee + efek perilaku</strong>. Yang hanya menghitung fee meremehkan 6x lipat — dan kalah agresif dari kompetitor yang menghitung dengan benar.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Mempertahankan Definisi</h2>
<p><strong>Head of Growth:</strong> &ldquo;Churn kita turun dari 12% ke 8%! Programku berhasil!&rdquo; (Ia mengubah definisi X dari 90 hari menjadi 180 hari bulan lalu.)</p>
<p><strong>Kamu:</strong> &ldquo;Selamat — untuk <strong>definisinya</strong>. Dengan definisi lama (90 hari), churn bulan ini <strong>12,5%</strong> — naik, bukan turun. Saya tidak menuduh manipulasi; tapi kita harus pilih: <strong>mau angka yang bagus atau bisnis yang bagus?</strong> Saya usulkan kita kunci definisi 90 hari (sudah divalidasi: 87% yang &lsquo;churn&rsquo; tidak kembali 6 bulan) dan ukur programmu dengan itu. Jika programmu benar-benar berhasil, ia akan terlihat di angka yang jujur.&rdquo;</p>
<p><strong>Head of Growth:</strong> &ldquo;...Oke. Tapi kasih aku 2 bulan dengan definisi baru untuk transisi.&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Deal — dengan catatan kaki di setiap laporan: &lsquo;definisi berubah 1 Nov; angka sebelum/sesudah tidak comparable.&rsquo; <strong>Transparansi metodologi = non-negotiable.</strong>&rdquo;</p>
<div className="tip">
<p><strong>💡 Pelajaran karier: orang akan mengubah definisi untuk terlihat bagus — kadang tanpa sadar. Tugasmu bukan menuduh, tapi <em>mengunci definisi dan meminta catatan kaki</em>. Analis yang menjaga definisi = penjaga gawang kebenaran perusahaan.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>Definisi dulu</strong>: kontrak (jelas) vs non-kontrak (dari distribusi jeda, divalidasi). Bedakan voluntary vs involuntary.</li>
<li><strong>Klasifikasi</strong>: imbalance → jangan percaya akurasi; fitur tren &gt; level; threshold dari expected value, bukan 0,5.</li>
<li><strong>Survival</strong>: S(t) = peluang bertahan; KM = Π(1−d_i/n_i); censoring jangan dibuang; Cox untuk faktor risiko (hazard ratio).</li>
<li><strong>KM menjawab 'kapan'</strong> — timing intervensi. Klasifikasi menjawab 'siapa'.</li>
<li><strong>ROI kampanye</strong>: EV = p × P(selamat) × CLV − biaya. Pilot kecil ukur P(selamat) sebelum scale.</li>
<li><strong>Kapan NAIK ke uplift (MK11)</strong>: intervensi mahal — targetkan yang persuadable, bukan semua yang berisiko.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk5-clv" className="btn btn-secondary btn-sm">← MK5</Link>
        <Link href="/learn/mk7-propensity" className="btn btn-primary btn-sm">MK7 →</Link>
      </div>
    </div>
  );
}
