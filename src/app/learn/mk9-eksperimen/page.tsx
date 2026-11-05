"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Mk9EksperimenPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MK9 — Marketing Data Analytics</span>
        <h1 className="display-title">Eksperimen:<br/>A/B Testing yang Tidak Menyesatkan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Tombol Hijau yang 'Menang' — Lalu Kalah</a></li>
<li><a href="#ab">A/B Testing yang Valid</a></li>
<li><a href="#cuped">CUPED & Bahaya Peeking</a></li>
<li><a href="#beyond">Beyond A/B: Bandit & Kuasi-Eksperimen</a></li>
<li><a href="#pendalaman">🧠 Pendalaman: Statistik Eksperimen yang Jujur</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#nyata">🌏 Cerita dari Lapangan</a></li>
<li><a href="#case">Mini-Case: Tombol Hijau PayKu</a></li>
<li><a href="#latihan">🧮 Latihan Berhitung Berpemandu</a></li>
<li><a href="#quiz">Quiz (5 soal)</a></li>
<li><a href="#bedah">🔍 Bedah Kasus: Eksperimen Harga yang Dipercaya Direksi</a></li>
<li><a href="#jebakan">🪤 Galeri Jebakan Analis Eksperimen</a></li>
<li><a href="#extra3">📋 Playbook: Pre-Launch Checklist Eksperimen</a></li>
<li><a href="#extra4">❓ Tanya-Jawab Mendalam</a></li>
<li><a href="#aplikasi">🧪 Lab Pikiran: Tiga Eksperimen, Tiga Jebakan</a></li>
<li><a href="#rapat">💬 Simulasi Rapat: Membela "Tidak Konklusif"</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Merancang A/B test yang valid: hipotesis, metrik, randomisasi, durasi via power analysis.</li>
<li>Menghitung ukuran sampel dari MDE dan menjelaskan tradeoff-nya.</li>
<li>Menjelaskan kenapa 'intip tiap hari & berhenti saat signifikan' (peeking) merusak hasil.</li>
<li>Memilih metode yang tepat: A/B vs multivariate vs bandit vs DiD/synthetic control.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Tombol Hijau yang 'Menang' — Lalu Kalah</h2>
      <div className="story">
        <p>Tim growth <em>&ldquo;PayKu&rdquo;</em> menguji tombol bayar hijau vs biru. Setiap pagi mereka intip dashboard. Hari ke-5: <strong>p = 0,03 — signifikan!</strong> Tombol hijau dinyatakan menang (+12% conversion), di-rollout ke 100% user. Sebulan kemudian, conversion <em>turun</em> 4%.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: mereka <strong>peeking</strong> — mengintip tiap hari dan berhenti saat signifikan. Peluang false positive bukan 5% lagi, tapi ~25% (seperti lempar koin sampai dapat gambar lalu berhenti). <strong>Kedua</strong>: +12% adalah <strong>noise + novelty effect</strong> (user klik karena baru, bukan karena hijau). <strong>Ketiga</strong>: sampelnya tidak cukup untuk MDE 5% — test-nya <em>underpowered</em> dari awal. Tiga dosa, satu dashboard hijau. Lesson ini: eksperimen yang benar itu <strong>disiplin</strong>, bukan cuma alat.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="ab">A/B Testing — Disiplin Sebelum Statistik</h2>
<p><strong>Definisi.</strong> <strong>A/B test</strong>: bagi user acak ke kontrol (A) vs perlakuan (B), bandingkan metrik. Valid jika: <strong>hipotesis dulu</strong> (&ldquo;hijau menaikkan conversion checkout 5% karena lebih kontras&rdquo; — bukan &ldquo;coba-coba&rdquo;), <strong>randomisasi benar</strong> (per user, konsisten — user yang sama selalu lihat varian sama; waspadai <em>carryover</em>), <strong>metrik primer satu</strong> (+ guardrail: metrik yang tidak boleh rusak), dan <strong>durasi ditentukan di muka</strong> dari power analysis.</p>
<p><strong>Power & MDE</strong>: <em>power</em> = peluang mendeteksi efek yang benar-benar ada (standar 80%). <strong>MDE</strong> (<em>minimum detectable effect</em>) = efek terkecil yang masih penting secara bisnis. MDE kecil → butuh sampel besar. Rumus kasar: n per grup ≈ 16σ²/MDE².</p>
<Tex math={String.raw`n_{per\_grup} \approx \frac{16\sigma^2}{MDE^2} \quad;\quad \text{durasi} = \frac{2n}{\text{traffic/hari}}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\sigma^2`} />: variansi metrik (dari data historis)</li>
<li><Tex math={String.raw`MDE`} />: efek terkecil yang penting (dalam satuan metrik, bukan % — hati-hati)</li>
<li>16 = konstanta untuk power 80% & alpha 5% (dua sisi)</li>
<li>Implikasi: MDE separuh → sampel 4x lipat. Pilih MDE dari bisnis ('di bawah 3% tidak worth effort'), bukan dari 'yang penting signifikan'</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Power analysis seperti <strong>memutuskan seberapa lama memancing</strong>: kalau ikannya kecil (MDE kecil), butuh jaring besar & waktu lama. Berhenti tiap 5 menit untuk cek ('peeking') lalu pulang saat dapat satu ikan = kamu tidak tahu apakah danau ini memang banyak ikan.</p>
<p><strong>Kapan dipakai:</strong> Punya traffic cukup untuk MDE bisnis dalam waktu wajar (2–4 minggu). Jika butuh 6 bulan untuk MDE 2% — pertimbangkan bandit atau terima MDE lebih besar.</p>
<details className="worked">
<summary>📐 Contoh: Berapa lama test PayKu? (klik untuk buka)</summary>
<p>Conversion baseline 10% (σ² = 0,1×0,9 = 0,09). MDE bisnis = 1 poin (10% → 11%, relatif 10%). Traffic 20.000 user/hari.</p>
<p><strong>Langkah 1:</strong> n per grup ≈ 16 × 0,09 / 0,01² = 1,44/0,0001 = <strong>14.400</strong>.</p>
<p><strong>Langkah 2:</strong> durasi = 2 × 14.400 / 20.000 ≈ <strong>1,5 hari</strong>. (Traffic besar!)</p>
<p><strong>Tapi</strong> — PayKu berhenti di hari ke-5 dengan &ldquo;p=0,03&rdquo; setelah intip tiap hari. Dengan traffic sebesar ini, hari ke-5 = 100.000 user — jauh di atas 28.800 yang dibutuhkan. Masalahnya bukan durasi, tapi <strong>peeking</strong> + novelty effect. Durasi cukup ≠ valid jika protokol dilanggar.</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,4,5,7,10,15,20], y: [57600,14400,6400,3600,2304,1176,576,256,144], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "n per grup"}]}
  title={"Ukuran sampel vs MDE (baseline 10%)"}
  layout={{xaxis: {title: "MDE (poin persentase)"}, yaxis: {title: "n per grup", type: "log"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = MDE yang ingin dideteksi, Y = sampel per grup (skala log). Baca: makin kecil efek yang dicari, makin besar sampel.</p>
<p><strong>Interpretasi:</strong> MDE 1 poin butuh 57.600/grup; MDE 5 poin cuma 2.304/grup — <strong>25x lipat</strong> untuk 5x presisi. Inilah kenapa 'MDE dari bisnis' penting: test MDE 1% yang butuh 3 bulan untuk efek yang 'tidak worth effort' = buang waktu. Pilih pertarungan yang worth dimenangkan.</p>
</div>
<h2 id="cuped">CUPED & Peeking — Variansi Musuhmu, Kesabaran Senjatamu</h2>
<p><strong>Definisi.</strong> <strong>CUPED</strong> (<em>Controlled-experiment Using Pre-Experiment Data</em>): kurangi variansi dengan data <em>sebelum</em> eksperimen. Ide: Y_adj = Y − θ(X − X̄), dengan X = metrik pre-eksperimen user yang sama (mis. spending 30 hari sebelum). Karena X berkorelasi dengan Y, variansi Y_adj &lt; variansi Y — <strong>sampel yang sama, power lebih besar</strong> (sering setara 30–50% tambahan sampel, gratis).</p>
<p><strong>Peeking</strong>: mengintip hasil tiap hari dan berhenti saat p &lt; 0,05. Ini <strong>menggelembungkan false positive</strong> dari 5% ke 20–30% (makin sering intip, makin parah). Solusi: <strong>fixed horizon</strong> (tentukan durasi di muka, jangan intip untuk keputusan) atau <strong>sequential testing</strong> (alpha spending / always-valid p-values — boleh intip, dengan aturan berhenti yang memperhitungkan pengintaian).</p>
<Tex math={String.raw`Y_{adj} = Y - \theta(X - \bar{X}) \quad;\quad \theta = \frac{\text{Cov}(Y,X)}{\text{Var}(X)}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`Y`} />: metrik saat eksperimen (mis. spending selama test)</li>
<li><Tex math={String.raw`X`} />: metrik pre-eksperimen user yang sama (spending 30 hari sebelum)</li>
<li><Tex math={String.raw`\theta`} />: koefisien regresi Y atas X — otomatis dari data</li>
<li>Efek: variansi turun sebesar (1 − ρ²); ρ=0,7 → variansi tinggal 51% → power naik drastis</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> CUPED seperti <strong>menimbang badan dengan mengurangi berat pakaian</strong>: kamu tahu tiap orang pakai baju ~1kg (X), jadi berat terukur (Y) dikoreksi — hasil timbangan lebih presisi tanpa beli timbangan baru. Peeking seperti <strong>menimbang 10x lalu pilih angka terkecil</strong> — bukan berat badanmu yang turun, tapi kejujuranmu.</p>
<p><strong>Kapan dipakai:</strong> CUPED: selalu jika ada data pre-eksperimen (gratis!). Sequential: jika bisnis menuntut keputusan cepat / intip tak terhindarkan — tapi pakai metode yang benar, bukan p-value biasa.</p>
<details className="worked">
<summary>📐 Contoh: Simulasi peeking (klik untuk buka)</summary>
<p>Simulasi 1.000 eksperimen A/A (tidak ada efek sungguhan). Aturan berhenti: cek tiap hari selama 14 hari, berhenti saat p &lt; 0,05.</p>
<p><strong>Hasil:</strong> ~230 dari 1.000 &ldquo;signifikan&rdquo; = <strong>false positive 23%</strong>, bukan 5%! Tanpa peeking (cek sekali di akhir): ~50/1.000 = 5% — sesuai teori.</p>
<p><strong>Pelajaran:</strong> dashboard yang bisa diintip tiap hari + budaya &ldquo;berhenti saat hijau&rdquo; = pabrik false positive. Solusi organisasi: kunci tanggal analisis di muka; yang boleh intip cuma <em>health check</em> (SRM, error), bukan hasil.</p>
</details>
<PlotlyChart
  data={[{x: [1,2,3,5,7,10,14], y: [5,9,12,16,19,22,26], type: "scatter", mode: "lines+markers", marker: {color: "#ef4444"}, name: "dengan peeking"}, {x: [1,2,3,5,7,10,14], y: [5,5,5,5,5,5,5], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "tanpa peeking (5%)"}]}
  title={"False positive vs frekuensi intip (simulasi A/A)"}
  layout={{xaxis: {title: "Jumlah intipan selama test"}, yaxis: {title: "False positive (%)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = berapa kali kamu intip & boleh berhenti, Y = % eksperimen A/A (tanpa efek) yang 'signifikan'. Garis hijau = 5% yang dijanjikan teori.</p>
<p><strong>Interpretasi:</strong> Makin sering intip, makin jauh dari 5% — 14x intip → 26% false positive. <strong>5x lipat janji teori.</strong> Inilah harga ketidaksabaran. Kalau organisasimu tidak bisa menahan diri, pakai sequential testing yang dirancang untuk diintip.</p>
</div>
<h2 id="beyond">Beyond A/B — Saat Randomisasi Tak Cukup atau Tak Mungkin</h2>
<p><strong>Definisi.</strong> Tiga naik kelas: <strong>Multivariate (MVT)</strong> — uji banyak elemen sekaligus (headline × gambar × CTA) secara faktorial; butuh traffic besar (kombinasi meledak). <strong>Multi-armed bandit</strong> — alokasi traffic <em>adaptif</em>: yang menang dapat traffic lebih banyak <em>selama</em> test (explore vs exploit; Thompson sampling). Cocok untuk optimasi berkelanjutan, bukan untuk &ldquo;pembuktian&rdquo; ilmiah. <strong>Kuasi-eksperimen</strong> — saat randomisasi mustahil (harga, kebijakan kota): <strong>DiD</strong> (<em>difference-in-differences</em>: bandingkan perubahan treated vs kontrol) dan <strong>synthetic control</strong> (bangun &ldquo;kembaran sintetis&rdquo; dari banyak kontrol).</p>
<p>DiD butuh <strong>parallel trends</strong> (sebelum intervensi, tren keduanya sejajar) — cek visual, jangan asumsi.</p>
<Tex math={String.raw`\hat{\tau}_{DiD} = (\bar{Y}_{T,post} - \bar{Y}_{T,pre}) - (\bar{Y}_{C,post} - \bar{Y}_{C,pre})`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li><Tex math={String.raw`\hat{\tau}_{DiD}`} />: estimasi efek kausal intervensi</li>
<li><Tex math={String.raw`T/C`} />: grup treated / kontrol; pre/post: sebelum/sesudah</li>
<li>Logika: kurangi perubahan kontrol (tren umum) dari perubahan treated → sisa = efek</li>
<li>Asumsi kunci: parallel trends — tanpa intervensi, keduanya bergerak sejajar</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Bandit seperti <strong>penjudi cerdas</strong>: coba semua mesin slot sedikit-sedikit, lalu taruh koin lebih banyak di yang mulai gacor — tidak menunggu 1.000 tarikan untuk memutuskan. DiD seperti <strong>membandingkan dua tanaman</strong>: satu diberi pupuk, satu tidak — yang penting keduanya tumbuh di tanah & cuaca yang sama sebelumnya (parallel trends).</p>
<p><strong>Kapan dipakai:</strong> MVT: traffic raksasa + banyak hipotesis UI. Bandit: optimasi konten/promo berjalan terus. DiD/synthetic: kebijakan/harga/wilayah yang tidak bisa diacak.</p>
<details className="worked">
<summary>📐 Contoh: DiD promo ongkir kota (klik untuk buka)</summary>
<p>Promo gratis ongkir di Bandung (treated), Jakarta kontrol. Order/hari: Bandung pre 1.000 → post 1.300 (+300). Jakarta pre 2.000 → post 2.100 (+100, tren umum naik).</p>
<p>DiD = (1.300−1.000) − (2.100−2.000) = 300 − 100 = <strong>+200 order/hari efek promo</strong>. Bukan +300 (itu mencampur tren umum).</p>
<p><strong>Cek parallel trends:</strong> 8 minggu sebelum promo, tren Bandung &amp; Jakarta sejajar? Jika Bandung memang sedang naik lebih cepat (mis. ada festival), DiD overestimate — pakai synthetic control dari banyak kota.</p>
</details>

      <h2 id="pendalaman">🧠 Pendalaman: Statistik Eksperimen yang Jujur</h2>
<p>A/B testing terlihat sederhana — bagi dua, bandingkan. Padahal ia <strong>ladang ranjau statistik</strong>: mengintip hasil (peeking), variansi yang menenggelamkan sinyal, dan &ldquo;kemenangan&rdquo; yang tidak bisa diulang. Empat pendalaman: (1) mengapa mengintip = berbohong pada diri sendiri; (2) power — seberapa besar &ldquo;telinga&rdquo; eksperimenmu; (3) CUPED — mengurangi noise tanpa menambah sampel; (4) kapan A/B tidak cukup.</p>
<h3>1. Peeking — Dosa yang Dilakukan Semua Orang</h3>
<p><strong>Definisi.</strong> <em>Peeking</em>: mengecek hasil sebelum waktunya, lalu menghentikan saat &ldquo;signifikan&rdquo;. Masalah: jika kamu cek 10x, peluang <strong>salah satu</strong> cek &ldquo;signifikan&rdquo; padahal tidak ada efek = <strong>jauh di atas 5%</strong> — sekitar <strong>20%</strong>!</p>
<p><strong>Kepribadian/intuisi:</strong> Peeking seperti <strong>melempar koin sampai dapat 3 kepala beruntun, lalu berhenti dan mengklaim koinnya ajaib</strong>. Setiap &ldquo;cek&rdquo; = kesempatan baru untuk kebetulan. Dengan 10x cek, kamu memberi kebetulan <strong>10 kesempatan</strong> — lalu berpura-pura hanya ada 1. Ini bukan statistik; ini <strong>berburu kebetulan dengan surat izin</strong>.</p>
<p><strong>Matematikanya:</strong> P(minimal 1 false positive dari k cek independen) = 1 − 0,95^k. k=5 → <strong>23%</strong>. k=10 → <strong>40%</strong>. Hampir setengah eksperimen &ldquo;berhasil&rdquo; dengan 10x peeking adalah <strong>halusinasi</strong>.</p>
<p><strong>Kapan dipakai (obatnya):</strong> (a) <strong>fixed horizon</strong>: tentukan durasi di awal, JANGAN lihat sebelum selesai; (b) <strong>sequential testing</strong>: pakai batas yang <strong>disesuaikan</strong> untuk multiple looks (alpha spending); (c) <strong>always-valid p-values</strong>. Jangan pernah: &ldquo;lihat tiap hari, stop kalau hijau&rdquo;.</p>
<Tex math={String.raw`P(\text{min. 1 FP}) = 1 - (1-\alpha)^k`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\alpha`} /> = tingkat signifikansi per cek (biasanya 0,05); <Tex math={String.raw`k`} /> = jumlah cek. Rumus ini untuk cek independen (asumsi kasar — kenyataannya sedikit lebih rendah, tapi tetap jauh di atas <Tex math={String.raw`\alpha`} />).</p>
<details className="worked">
<summary>📐 Contoh 1a: Simulasi peeking (klik untuk buka)</summary>
<p>Eksperimen dengan <strong>TIDAK ADA efek</strong> (A=B). Cek tiap hari selama 14 hari, stop jika p &lt; 0,05.</p>
<p><strong>Langkah 1:</strong> Hari 3: p=0,12 (lanjut). Hari 7: p=0,04 → <strong>STOP! &ldquo;Menang!&rdquo;</strong> 🎉</p>
<p><strong>Langkah 2:</strong> Padahal efek = NOL. &ldquo;Kemenangan&rdquo; ini 100% kebetulan — dari 14 kesempatan.</p>
<p><strong>Langkah 3:</strong> Ulangi simulasi 1.000x: ~<strong>35%</strong> eksperimen &ldquo;menang&rdquo; padahal tidak ada efek! (Teori: 1−0,95^14 = 51% untuk independen; korelasi antar-cek menurunkannya ke ~35% — tetap <strong>7x lipat</strong> dari 5%.)</p>
<p><strong>Langkah 4 — Kerugian bisnis:</strong> &ldquo;kemenangan&rdquo; palsu → implementasi → tidak ada efek → <strong>kepercayaan pada eksperimen hancur</strong>. Satu peeking = meracuni sumur.</p>
<p><strong>Pelajaran:</strong> <strong>jalankan simulasi ini di Lab 2 lesson ini</strong> — lihat sendiri 35% &ldquo;kemenangan&rdquo; palsu. Pengalaman langsung &gt; 100x teori.</p>
</details>
<details className="worked">
<summary>📐 Contoh 1b: Fixed horizon yang benar (klik untuk buka)</summary>
<p>Baseline conversion 10%, ingin deteksi lift relatif 10% (→ 11%), power 80%, α=5%.</p>
<p><strong>Langkah 1 — Hitung sampel:</strong> butuh ~<strong>14.000 per grup</strong> (28.000 total). Traffic 2.000/hari → <strong>14 hari</strong>.</p>
<p><strong>Langkah 2 — Komitmen:</strong> tulis di dokumen: &ldquo;eksperimen jalan 14 hari penuh, <strong>dilarang</strong> lihat hasil sebelum hari ke-14.&rdquo; (Boleh monitor <strong>kesehatan</strong>: error rate, sample ratio — bukan hasil!)</p>
<p><strong>Langkah 3 — Hari ke-14:</strong> A=10,1%, B=10,9%, p=0,03 → <strong>menang, sah</strong>. Atau p=0,12 → <strong>kalah, terima</strong>. Tidak ada &ldquo;tambah 3 hari lagi&rdquo; (itu peeking!).</p>
<p><strong>Pelajaran:</strong> disiplin &gt; kecerdasan. Eksperimen yang &ldquo;kalah&rdquo; dengan jujur <strong>jauh lebih berharga</strong> dari &ldquo;menang&rdquo; dengan peeking — yang kalah memberi <strong>informasi</strong>, yang menang palsu memberi <strong>ilusi</strong>.</p>
</details>
<h3>2. Power — Seberapa Besar &ldquo;Telingamu&rdquo;</h3>
<p><strong>Definisi.</strong> <em>Power</em> = peluang mendeteksi efek <strong>yang benar-benar ada</strong>. Power 80% = jika efeknya nyata, 80% eksperimenmu menangkapnya. <em>Minimum Detectable Effect</em> (MDE) = efek terkecil yang bisa dideteksi dengan power &amp; sampel yang ada.</p>
<p><strong>Kepribadian/intuisi:</strong> Power seperti <strong>ketajaman pendengaran</strong>: di konser rock (variansi tinggi), kamu tidak dengar bisikan (efek kecil) — bukan karena tidak ada yang berbisik, tapi <strong>telingamu tidak cukup tajam</strong>. Eksperimen underpowered yang &ldquo;tidak signifikan&rdquo; = <strong>tidak membuktikan apa-apa</strong> (bukan &ldquo;membuktikan tidak ada efek&rdquo;!).</p>
<p><strong>Tiga tuas power:</strong> (a) <strong>sampel lebih besar</strong> (jalan lebih lama); (b) <strong>efek lebih besar</strong> (uji perubahan berani, bukan tombol hijau vs biru!); (c) <strong>variansi lebih kecil</strong> (CUPED! targeting!).</p>
<p><strong>Kapan dipakai:</strong> <strong>SEBELUM</strong> eksperimen jalan (Lab 1!). Eksperimen tanpa power analysis = <strong>berburu dengan mata tertutup</strong>.</p>
<details className="worked">
<summary>📐 Contoh 2: Power analysis menyelamatkan 3 minggu (klik untuk buka)</summary>
<p>Ide: ubah warna tombol (baseline 5%, harapkan +2% relatif → 5,1%). Traffic 1.000/hari.</p>
<p><strong>Langkah 1 — Hitung:</strong> untuk MDE 2% relatif, power 80%: butuh ~<strong>800.000 per grup</strong> = 1,6 juta total = <strong>800 hari</strong>!!</p>
<p><strong>Langkah 2 — Keputusan:</strong> <strong>JANGAN jalankan.</strong> Eksperimen ini tidak akan pernah selesai. Tiga minggu &ldquo;data&rdquo; = noise murni.</p>
<p><strong>Langkah 3 — Alternatif:</strong> (a) uji perubahan <strong>lebih besar</strong> (redesign checkout, bukan warna tombol); (b) <strong>target</strong> segmen dengan baseline tinggi (power lebih baik); (c) pakai <strong>metode lain</strong> (survei, kualitatif) untuk efek kecil.</p>
<p><strong>Pelajaran:</strong> power analysis <strong>sebelum</strong> eksperimen = menghemat minggu/bulan sia-sia. &ldquo;Tombol hijau vs biru&rdquo; hampir selalu <strong>underpowered</strong> — uji hal yang <strong>berani</strong> atau jangan uji sama sekali.</p>
</details>
<h3>3. CUPED — Mengurangi Noise Tanpa Menambah Sampel</h3>
<p><strong>Definisi.</strong> <em>CUPED</em> (<em>Controlled-experiment Using Pre-Experiment Data</em>): kurangi variansi dengan <strong>mengontrol</strong> data pra-eksperimen (mis. pengeluaran pengguna <strong>sebelum</strong> eksperimen). Variansi turun → power naik → <strong>sampel yang sama, telinga lebih tajam</strong>.</p>
<p><strong>Kepribadian/intuisi:</strong> Seperti <strong>noise-cancelling headphone</strong>: ia &ldquo;mendengar&rdquo; noise latar (perilaku normal pengguna) lalu <strong>menguranginya</strong> — sehingga sinyal (efek eksperimen) terdengar jelas. Tanpa menambah &ldquo;volume&rdquo; (sampel).</p>
<p><strong>Cara kerja (intuisi):</strong> Y_adj = Y − θ×(X − X̄). X = metrik pra-eksperimen (mis. revenue 2 minggu sebelum). Jika pengguna memang selalu belanja besar (X tinggi), <strong>kurangi</strong> ekspektasinya — sisanya = &ldquo;efek murni&rdquo;. θ dioptimasi dari korelasi X-Y.</p>
<p><strong>Kapan dipakai:</strong> Metrik dengan <strong>variansi tinggi antar-user</strong> (revenue, engagement) + ada <strong>data historis</strong>. Pengurangan variansi tipikal: <strong>20–50%</strong> = setara <strong>menambah sampel 25–100%</strong> — gratis!</p>
<Tex math={String.raw`Y_{adj} = Y - \theta (X - \bar{X}}`} block />
<p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`Y`} /> = metrik saat eksperimen; <Tex math={String.raw`X`} /> = metrik pra-eksperimen user yang sama; <Tex math={String.raw`\bar{X}`} /> = rata-rata X; <Tex math={String.raw`\theta`} /> = koefisien (dari regresi Y~X di data pra-eksperimen). Analisis A/B dijalankan di <Tex math={String.raw`Y_{adj}`} />, bukan Y mentah.</p>
<details className="worked">
<summary>📐 Contoh 3: CUPED menghemat 40% sampel (klik untuk buka)</summary>
<p>Metrik: revenue/user/minggu. Variansi mentah: σ²=10.000. Korelasi revenue pra vs saat eksperimen: ρ=0,7.</p>
<p><strong>Langkah 1 — Variansi setelah CUPED:</strong> σ²_adj = σ²×(1−ρ²) = 10.000×(1−0,49) = <strong>5.100</strong> — turun <strong>49%</strong>!</p>
<p><strong>Langkah 2 — Dampak sampel:</strong> sampel yang dibutuhkan ∝ variansi → <strong>hampir setengah</strong>! Eksperimen 4 minggu → 2 minggu.</p>
<p><strong>Langkah 3 — Syarat:</strong> X harus <strong>tidak terpengaruh</strong> eksperimen (pra-eksperimen!); korelasi harus <strong>positif &amp; stabil</strong>. Jika ρ=0,1 → pengurangan cuma 1% — tidak worth it.</p>
<p><strong>Pelajaran:</strong> CUPED = <strong>&ldquo;sampel gratis&rdquo;</strong> untuk metrik bervariansi tinggi. Tidak pakai CUPED saat bisa = <strong>membuang setengah budget eksperimenmu</strong>.</p>
</details>
<h3>4. Beyond A/B — Saat Randomisasi Tak Cukup</h3>
<p><strong>Tiga situasi A/B standar gagal:</strong></p>
<p><strong>(a) Interference (SUTVA violation):</strong> perlakuan A mempengaruhi grup B! Contoh: marketplace — diskon untuk grup A membuat seller menaikkan harga untuk <strong>semua</strong> (termasuk B). Solusi: <strong>cluster randomization</strong> (acak per kota/area, bukan per user!) atau <strong>geo-experiment</strong> (MK10).</p>
<p><strong>(b) Efek jangka panjang:</strong> A/B 2 minggu tidak menangkap <strong>habit formation</strong> (6 bulan!) atau <strong>churn tertunda</strong>. Solusi: <strong>holdout jangka panjang</strong> (1–5% user tidak pernah dapat fitur baru — &ldquo;asuransi kebenaran&rdquo;!) atau <strong>surrogate metrics</strong> yang terkalibrasi.</p>
<p><strong>(c) Tidak bisa randomisasi:</strong> harga (tidak etis beda harga!), peluncuran nasional, kebijakan. Solusi: <strong>DiD, synthetic control, geo-experiment</strong> (MK10) — kausalitas tanpa randomisasi.</p>
<p><strong>Kepribadian/intuisi:</strong> A/B testing seperti <strong>mikroskop</strong> — sempurna untuk yang kecil &amp; terisolasi, tidak berguna untuk <strong>hutan</strong> (efek jaringan, jangka panjang, tak-teracak). Ilmuwan yang hanya punya mikroskop = <strong>buta terhadap hutan</strong>.</p>
<details className="worked">
<summary>📐 Contoh 4: Interference di marketplace (klik untuk buka)</summary>
<p>Eksperimen: gratis ongkir untuk 50% pembeli (acak per user).</p>
<p><strong>Langkah 1 — Yang terjadi:</strong> seller melihat demand naik → <strong>naikkan harga 5%</strong> untuk SEMUA pembeli (termasuk kontrol!).</p>
<p><strong>Langkah 2 — Hasil terukur:</strong> A vs B = +2% conversion. <strong>Terlihat</strong> menang kecil.</p>
<p><strong>Langkah 3 — Kebenaran:</strong> tanpa eksperimen, conversion = 100. Dengan eksperimen: A=102, B=100 (tapi B <strong>seharusnya</strong> 100 tanpa kenaikan harga? tidak — harga naik menekan B ke 98!). Efek sebenarnya = 102 vs 98 = <strong>+4%</strong>, bukan +2%. <strong>Interference membuat A/B underestimate!</strong></p>
<p><strong>Langkah 4 — Solusi:</strong> <strong>cluster randomization</strong> — acak per <strong>kota</strong> (seller per kota beda!). Atau <strong>two-sided randomization</strong> (acak buyer DAN seller).</p>
<p><strong>Pelajaran:</strong> sebelum A/B, tanya: <strong>&ldquo;bisakah A mempengaruhi B?&rdquo;</strong> Jika ya — A/B standar = <strong>bohong</strong>. Desain yang benar &gt; analisis yang canggih.</p>
</details>
<PlotlyChart
  data={[{x: ["1 cek", "3 cek", "5 cek", "10 cek", "14 cek"], y: [5, 14, 23, 40, 51], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#e8a838","#ef4444","#ef4444"]}, text: ["5%","14%","23%","40%","51%"], textposition: "outside"}]}
  title={"Peluang false positive vs jumlah peeking (α=5%)"}
  layout={{yaxis: {title: "P(min. 1 false positive) (%)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = berapa kali kamu &ldquo;mengintip&rdquo;, tinggi batang = peluang <strong>minimal satu</strong> hasil &ldquo;signifikan&rdquo; padahal tidak ada efek.</p>
<p><strong>Interpretasi:</strong> Dengan 10x intip, 40% eksperimen &ldquo;menang&rdquo; <strong>padahal nol efek</strong>. Batang merah = zona berbahaya. Inilah visual mengapa &ldquo;lihat tiap hari&rdquo; = <strong>mesin produksi kebohongan</strong>. Fixed horizon atau bust.</p>
</div>

      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;p &lt; 0,05 berarti efeknya nyata dan penting. Hijau = menang.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> p-value menjawab &lsquo;bisakah ini noise?&rsquo; — <strong>bukan</strong> &lsquo;apakah ini penting?&rsquo;. Efek +0,1% bisa p&lt;0,001 dengan sampel raksasa (nyata tapi tidak worth effort). Selalu laporkan <strong>efek + confidence interval</strong>: &lsquo;+2,1% (95% CI: +0,3% s.d. +3,9%)&rsquo; — baru diskusikan penting tidaknya secara bisnis.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Berhenti saat signifikan itu efisien — ngapain nunggu durasi penuh?&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Itu <strong>peeking</strong>: false positive 5% → 20–30%. &lsquo;Efisiensi&rsquo; ini membeli keputusan salah. Efisiensi yang benar: <strong>CUPED</strong> (variansi turun gratis), <strong>MDE realistis</strong> (jangan kejar 0,5%), atau <strong>sequential testing</strong> yang memang dirancang boleh intip. Tidak ada jalan pintas dari p-value biasa.</p>
</div>

      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Satu metrik primer + guardrail.</strong> Lima metrik primer = lima kesempatan false positive (multiple testing!). Pilih SATU yang menentukan keputusan; sisanya guardrail (tidak boleh rusak) & diagnostik. Kalau semua 'penting', tidak ada yang penting.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Novelty & seasonality effect itu nyata.</strong> Efek minggu pertama sering memudar (user penasaran, bukan suka). Jalankan minimal 1–2 siklus bisnis penuh (termasuk weekend/gajian) dan pertimbangkan 'holdout' pasca-rollout untuk efek jangka panjang.</strong></p>
</div>

      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Kalkulator Power & Durasi</h2>
<p>Hitung sampel & durasi dari baseline, MDE, dan traffic. Rasakan tradeoff MDE vs waktu.</p>
<PyodideLab
  title={"Lab 1 — Kalkulator Power"}
  hint={"Ubah MDE 1.0 → 0.5. Durasi 4x lipat! Tanyakan: apakah efek 0,5 poin worth 4x waktu?"}
  defaultCode={"import math\n# Kalkulator ukuran sampel & durasi A/B test\nbaseline = 0.10   # conversion kontrol\nmde_poin = 1.0    # efek terkecil yg penting (poin persentase)\ntraffic  = 20000  # user/hari (total, dibagi 2 grup)\n\np = baseline\nvar = p * (1 - p)\nmde = mde_poin / 100\nn_grup = 16 * var / (mde ** 2)   # power 80%, alpha 5%\ndurasi = 2 * n_grup / traffic\n\nprint(f\"Baseline   : {p:.0%}\")\nprint(f\"MDE        : {mde_poin} poin ({mde_poin/p:.0%} relatif)\")\nprint(f\"n per grup : {n_grup:,.0f}\")\nprint(f\"Durasi     : {durasi:.1f} hari\")\nprint()\nprint(\"Catatan: ini untuk metrik biner tanpa CUPED.\")\nprint(\"Dengan CUPED (rho=0.7), durasi ~ separuhnya.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Simulasi Peeking vs Fixed Horizon</h2>
<p>Buktikan sendiri: 500 eksperimen A/A, bandingkan false positive peeking vs sekali-cek.</p>
<PyodideLab
  title={"Lab 2 — Simulasi Peeking"}
  hint={"Ubah N_INTIP 7 → 14. False positive naik lagi. Inilah 'pajak ketidaksabaran'."}
  defaultCode={"import random, math\nrandom.seed(99)\n\ndef p_value(n1, x1, n2, x2):\n    # uji z dua proporsi (pendekatan)\n    p1, p2 = x1/n1, x2/n2\n    p_pool = (x1+x2)/(n1+n2)\n    se = math.sqrt(p_pool*(1-p_pool)*(1/n1+1/n2))\n    z = (p1-p2)/se if se else 0\n    # p-value dua sisi via normal CDF (aproksimasi)\n    Phi = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))\n    return 2*(1-Phi(abs(z)))\n\nN_INTIP = 7\nfp_peek = fp_fixed = 0\nN_EXP = 500\nfor _ in range(N_EXP):\n    # A/A: tidak ada efek (p=10% kedua grup)\n    sig_peek = False\n    for hari in range(1, N_INTIP+1):\n        n = 2000*hari\n        x1 = sum(random.random() < 0.10 for _ in range(n))\n        x2 = sum(random.random() < 0.10 for _ in range(n))\n        if p_value(n, x1, n, x2) < 0.05:\n            sig_peek = True\n            break\n    fp_peek += sig_peek\n    n = 2000*N_INTIP\n    x1 = sum(random.random() < 0.10 for _ in range(n))\n    x2 = sum(random.random() < 0.10 for _ in range(n))\n    fp_fixed += p_value(n, x1, n, x2) < 0.05\n\nprint(f\"Eksperimen A/A: {N_EXP}\")\nprint(f\"False positive (peeking tiap hari): {fp_peek/N_EXP:.1%}\")\nprint(f\"False positive (cek sekali akhir) : {fp_fixed/N_EXP:.1%}\")\nprint(\"Teori menjanjikan 5%. Peeking mengkhianatinya.\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Traffic cukup, butuh bukti kausal yang bersih → <strong>A/B fixed-horizon + CUPED</strong></h3>
<p><strong>Kenapa:</strong> Standar emas; CUPED memberi power gratis dari data pre-eksperimen.</p>
<p><strong>Contoh nyata:</strong> Uji checkout, pricing, onboarding.</p>
</div>
<div className="decision-card">
<h3>2. Organisasi tidak bisa menahan diri untuk tidak intip → <strong>Sequential testing (alpha spending)</strong></h3>
<p><strong>Kenapa:</strong> Dirancang untuk diintip — aturan berhenti memperhitungkan pengintaian.</p>
<p><strong>Contoh nyata:</strong> Tim growth yang 'harus lapor tiap hari'.</p>
</div>
<div className="decision-card">
<h3>3. Optimasi berkelanjutan, bukan pembuktian → <strong>Multi-armed bandit</strong></h3>
<p><strong>Kenapa:</strong> Traffic mengalir ke pemenang selama test — minim opportunity cost.</p>
<p><strong>Contoh nyata:</strong> Rotasi kreatif iklan, headline artikel.</p>
</div>
<div className="decision-card">
<h3>4. Randomisasi mustahil (harga, wilayah, kebijakan) → <strong>DiD / synthetic control</strong></h3>
<p><strong>Kenapa:</strong> Kausalitas tanpa acak — dengan asumsi parallel trends yang dicek.</p>
<p><strong>Contoh nyata:</strong> Promo per kota, perubahan harga, regulasi.</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>Hipotesis + 1 metrik primer</strong> sebelum mulai.</li><li><strong>Durasi dari power analysis</strong> — kunci tanggal analisis.</li><li><strong>Jangan intip untuk keputusan</strong> (atau pakai sequential).</li><li><strong>Laporkan efek + CI</strong>, bukan cuma p-value.</li></ol>
</div>

      <h2 id="nyata">🌏 Cerita dari Lapangan</h2>
<h3>Kisah 1: Tombol Hijau yang &ldquo;Menang&rdquo; — Lalu Kalah</h3>
<p>E-commerce &ldquo;LakuTerus&rdquo;: tombol checkout hijau vs biru. Setelah 5 hari, hijau &ldquo;menang&rdquo; (p=0,03!) → diimplementasikan → <strong>tidak ada efek</strong> 3 bulan berikutnya. Apa yang terjadi? <strong>Peeking</strong> (cek tiap hari, stop saat hijau) + <strong>underpowered</strong> (5 hari = 10% dari sampel yang dibutuhkan) + <strong>novelty effect</strong> (pengguna klik karena <strong>baru</strong>, bukan karena <strong>hijau</strong> — efek hilang 2 minggu!).</p>
<p><strong>Tiga pembunuh berlapis:</strong> (1) peeking → false positive; (2) underpowered → noise; (3) novelty → efek semu sementara. Solusi: <strong>fixed horizon + power analysis + runback period</strong> (jalankan 2 minggu <strong>setelah</strong> &ldquo;menang&rdquo; untuk konfirmasi — membunuh novelty effect!).</p>
<p><strong>Pelajaran:</strong> &ldquo;menang&rdquo; dalam 5 hari = <strong>red flag</strong>, bukan green light. Kemenangan sejati = <strong>bertahan</strong> setelah novelty hilang.</p>
<h3>Kisah 2: CUPED yang Menyelamatkan Kuartal</h3>
<p>Streaming &ldquo;NontonYuk&rdquo;: eksperimen harga baru. Metrik: revenue/user — <strong>variansi raksasa</strong> (1% user = 30% revenue!). Power analysis: butuh <strong>12 minggu</strong> — kuartal hampir habis!</p>
<p>Solusi: CUPED dengan revenue 4 minggu pra-eksperimen (ρ=0,75!) → variansi turun <strong>44%</strong> → durasi 12 → <strong>7 minggu</strong>. Eksperimen selesai <strong>sebelum</strong> rapat kuartal. Hasil: harga baru +8% revenue, <strong>signifikan</strong>.</p>
<p><strong>Pelajaran:</strong> tanpa CUPED = <strong>tidak ada keputusan kuartal ini</strong>. CUPED bukan &ldquo;optimasi&rdquo; — ia <strong>perbedaan antara bisa dan tidak bisa bereksperimen</strong> untuk metrik bervariansi tinggi.</p>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi lapangan: &ldquo;Tidak signifikan = tidak ada efek.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> &ldquo;Tidak signifikan&rdquo; = <strong>&ldquo;tidak cukup bukti&rdquo;</strong> — BUKAN &ldquo;bukti tidak ada&rdquo;. Penyebab: (a) <strong>underpowered</strong> (paling umum!), (b) efek memang nol, (c) <strong>variansi terlalu tinggi</strong>. Bedakan dengan <strong>power analysis</strong>: jika power 80% dan tetap tidak signifikan → mungkin memang nol. Jika power 20% → <strong>eksperimenmu tidak membuktikan apa-apa</strong>. &ldquo;Absence of evidence ≠ evidence of absence.&rdquo;</p>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Tombol Hijau yang 'Menang'</h2>
<div className="callout">
<p>PayKu: tombol hijau vs biru. Intip tiap hari, hari ke-5 p=0,03 (+12%), rollout 100%. Sebulan kemudian conversion −4%. Traffic 20.000/hari, baseline 10%.</p>
<p><strong>Pertanyaan:</strong> (a) Tiga dosa eksperimennya? (b) Jika MDE bisnis = 1 poin, berapa durasi yang benar? (c) Desain ulang test yang valid dalam 3 langkah?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Peeking</strong> (berhenti saat signifikan → false positive ~25%), <strong>novelty effect</strong> (+12% minggu pertama belum tentu permanen), <strong>tidak ada guardrail</strong> (mungkin metrik lain rusak).</p>
<p>(b) n/grup ≈ 16×0,09/0,01² = 14.400 → durasi ≈ <strong>1,5 hari</strong> (traffic besar!). Ironis: mereka <em>kelebihan</em> durasi tapi tetap salah karena peeking. Durasi cukup ≠ valid.</p>
<p>(c) <strong>(1)</strong> Hipotesis + MDE 1 poin + metrik primer (conversion checkout) + guardrail (drop-off pembayaran). <strong>(2)</strong> Fixed horizon 14 hari (2 siklus mingguan, tangkap novelty decay) + CUPED dari histori user. <strong>(3)</strong> Kunci tanggal analisis; intip hanya untuk health check (SRM). Rollout bertahap 10%→50%→100% dengan holdout 5% untuk efek jangka panjang.</p>
</details>
</div>

      <h2 id="latihan">🧮 Latihan Berhitung Berpemandu</h2>
<p><strong>Soal 1 — Peeking.</strong> Cek tiap hari selama 7 hari, α=5%. (a) P(min. 1 FP) jika independen? (b) Jika tim &ldquo;hanya&rdquo; cek 3x, berapa? (c) Kesimpulan?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 1 (klik untuk buka)</summary>
<p>(a) 1 − 0,95^7 = 1 − 0,698 = <strong>30,2%</strong>.</p>
<p>(b) 1 − 0,95^3 = <strong>14,3%</strong> — masih <strong>3x</strong> dari 5%!</p>
<p>(c) <strong>Peeking sekecil apa pun merusak.</strong> &ldquo;Cuma 3x lihat&rdquo; = 14% false positive. Tidak ada &ldquo;peeking aman&rdquo; — hanya ada <strong>fixed horizon</strong> atau <strong>sequential testing yang benar</strong>.</p>
</details>
<p><strong>Soal 2 — Power.</strong> Baseline 20%, target deteksi +5% relatif (→ 21%), α=5%, power 80%. Perkiraan kasar: butuh n ≈ 16 × p(1−p) / δ² per grup (p=0,2, δ=0,01). Hitung n. Jika traffic 5.000/hari, berapa hari?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 2 (klik untuk buka)</summary>
<p>n ≈ 16 × 0,2×0,8 / 0,0001 = 16 × 0,16 / 0,0001 = 2,56/0,0001 = <strong>25.600 per grup</strong> = 51.200 total.</p>
<p>Hari = 51.200/5.000 ≈ <strong>10,2 hari</strong> → bulatkan <strong>14 hari</strong> (2 minggu penuh, hindari efek hari!).</p>
<p><strong>Pelajaran:</strong> +5% relatif di baseline 20% butuh <strong>10 hari</strong>. Jika ada yang klaim &ldquo;menang&rdquo; di hari ke-3 = <strong>peeking</strong> (atau keajaiban).</p>
</details>
<p><strong>Soal 3 — CUPED.</strong> σ²=2.500, ρ=0,6. (a) Variansi setelah CUPED? (b) Penghematan sampel? (c) Kapan CUPED tidak worth it?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 3 (klik untuk buka)</summary>
<p>(a) σ²_adj = 2.500 × (1 − 0,36) = 2.500 × 0,64 = <strong>1.600</strong> — turun 36%.</p>
<p>(b) Sampel ∝ variansi → hemat <strong>36%</strong> (mis. 4 minggu → 2,5 minggu).</p>
<p>(c) Jika ρ &lt; 0,3 (pengurangan &lt; 9%) — <strong>atau</strong> jika tidak ada data pra-eksperimen yang <strong>bersih</strong> (X terkontaminasi!). CUPED dengan X yang buruk = <strong>menambah bias</strong>, bukan mengurangi variansi.</p>
</details>
<p><strong>Soal 4 — Interference.</strong> Eksperimen diskon 20% untuk 50% user (acak). Hasil: A +5% vs B. Tapi: (a) user A memberi tahu user B tentang diskon (spillover!); (b) stok menipis karena A borong. Arah bias masing-masing? Desain yang benar?</p>
<details className="worked">
<summary>💡 Pembahasan Soal 4 (klik untuk buka)</summary>
<p>(a) <strong>Spillover:</strong> B ikut dapat info diskon → B naik juga → <strong>underestimate</strong> (selisih mengecil).</p>
<p>(b) <strong>Stok menipis:</strong> A borong → B tidak kebagian → B turun → <strong>overestimate</strong> (selisih membesar, tapi bukan karena diskon &ldquo;bagus&rdquo; — karena B &ldquo;disakiti&rdquo;!).</p>
<p><strong>Desain benar:</strong> <strong>cluster randomization</strong> (acak per wilayah — spillover dalam kota, bukan antar-kota!) + <strong>monitor stok</strong> sebagai guardrail. Atau <strong>switchback experiment</strong> (nyala-mati bergantian per periode).</p>
<p><strong>Pelajaran:</strong> interference bisa bias <strong>dua arah</strong>. &ldquo;A/B standar&rdquo; tanpa cek SUTVA = <strong>angka yang tidak bisa dipercaya</strong> — ke arah mana pun.</p>
</details>
<div className="tip">
<p><strong>💡 Empat pertanyaan sebelum eksperimen: (1) power berapa? (durasi?) (2) fixed horizon atau sequential? (3) bisa CUPED? (4) ada interference? Empat jawaban = eksperimen siap. Tanpa jawaban = judi berjas lab.</strong></p>
</div>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 4 dari 5. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. Tim intip dashboard tiap hari dan berhenti saat p &lt; 0,05. False positive menjadi?"}
  options={
    ["Tetap 5%",
    "~20-30% (peeking inflation)",
    "0%",
    "100%"]
  }
  correct={1}
  explanation={"Benar: tiap intipan = kesempatan tambahan false positive. Simulasi: 7x intip → ~19%, 14x → ~26%. Solusi: fixed horizon atau sequential testing."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Baseline 10%, MDE 1 poin → n/grup 14.400. Jika MDE diperkecil jadi 0,5 poin, n menjadi?"}
  options={
    ["7.200 (separuh)",
    "14.400 (tetap)",
    "57.600 (4x lipat)",
    "28.800 (2x lipat)"]
  }
  correct={2}
  explanation={"Benar: n ∝ 1/MDE² — MDE separuh → sampel 4x. Inilah kenapa MDE harus dari bisnis ('worth effort'), bukan asal kecil."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. CUPED memberi manfaat apa?"}
  options={
    ["Menambah traffic",
    "Mengurangi variansi via data pre-eksperimen → power naik gratis",
    "Mengganti randomisasi",
    "Mempercepat website"]
  }
  correct={1}
  explanation={"Benar: Y_adj = Y − θ(X−X̄). Dengan ρ=0,7, variansi tinggal ~51% — setara menambah sampel ~2x, tanpa user tambahan."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Kapan memakai DiD dibanding A/B?"}
  options={
    ["Selalu — lebih mudah",
    "Saat randomisasi mustahil (harga, wilayah, kebijakan)",
    "Traffic kecil",
    "Tidak pernah"]
  }
  correct={1}
  explanation={"Benar: DiD untuk intervensi yang tidak bisa diacak. Syarat: parallel trends (dicek, bukan diasumsi). A/B tetap standar emas jika randomisasi mungkin."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. p=0,001 dengan efek +0,1% pada sampel 10 juta. Kesimpulan?"}
  options={
    ["Menang besar — rollout!",
    "Nyata secara statistik tapi mungkin tidak penting secara bisnis; lihat CI & nilai rupiah",
    "Pasti false positive",
    "Ulangi test"]
  }
  correct={1}
  explanation={"Benar: p-value ≠ penting. +0,1% yang 'signifikan' bisa bernilai Rp0 setelah biaya implementasi. Laporkan efek + CI, lalu tanya: worth effort?"}
/>

      <h2 id="bedah">🔍 Bedah Kasus: Eksperimen Harga yang Dipercaya Direksi</h2>
<p>SaaS &ldquo;KantorPintar&rdquo;: 20.000 pelanggan, harga Rp100rb/bln. CFO usul naik ke Rp120rb (+20%). CEO takut churn massal. Kamu diminta <strong>membuktikan</strong> dengan eksperimen — hasilnya menentukan Rp4,8 miliar revenue/tahun.</p>
<h3>Langkah 1 — Power analysis (hari 1)</h3>
<p>Metrik primer: <strong>revenue/user/bulan</strong> (bukan conversion! — harga naik + churn naik, net-nya yang penting). Baseline Rp100rb, σ=Rp40rb (variansi tinggi!). Target deteksi: +5% (Rp5rb).</p>
<p>Tanpa CUPED: n ≈ 16×σ²/δ² = 16×1600/25 = <strong>1.024 per grup</strong>?? Tunggu — itu untuk δ dalam satuan yang sama... n = 16 × 1600 / 25 = 1024. Hmm, terlalu kecil — karena δ=Rp5rb vs σ=Rp40rb, rasio 8x. Realistis: butuh ~<strong>4.000 per grup</strong> dengan power 80%. Ada 20.000 pelanggan → <strong>bisa</strong>, 50:50 split, 1 bulan.</p>
<p><strong>Dengan CUPED</strong> (revenue 3 bulan pra-eksperimen, ρ=0,8): variansi turun 64% → n turun ke ~<strong>1.500 per grup</strong> → <strong>2 minggu cukup</strong>!</p>
<h3>Langkah 2 — Desain anti-interference (hari 2)</h3>
<p><strong>Bahaya:</strong> pelanggan A (harga baru) komplain ke pelanggan B (harga lama) → B churn bukan karena harga! <strong>Solusi:</strong> <strong>cluster randomization per kohor registrasi</strong> — kohor lama (2023) vs baru (2025) dipisah; komunikasi harga <strong>privat</strong> (email personal, bukan pengumuman publik!).</p>
<h3>Langkah 3 — Fixed horizon + guardrail (hari 3–17)</h3>
<p>14 hari, <strong>dilarang intip hasil</strong>. Guardrail yang <strong>boleh</strong> dimonitor: (a) sample ratio (50:50?), (b) error/bug rate, (c) <strong>complaint rate</strong> (jika &gt; 5% → stop, etika!). Hasil = <strong>terkunci</strong> sampai hari 14.</p>
<h3>Langkah 4 — Analisis CUPED (hari 18)</h3>
<p>Revenue/user: kontrol Rp100rb → perlakuan Rp112rb (+12%!). Tapi <strong>churn</strong>: 3% → 4,5% (+1,5 poin). Net revenue <strong>naik 10,2%</strong> (p=0,01, signifikan!). <strong>Keputusan: naikkan harga</strong> — dengan <strong>grandfathering</strong> 3 bulan untuk pelanggan lama (mengurangi complaint + churn).</p>
<h3>Langkah 5 — Runback (hari 18–32)</h3>
<p>Harga baru untuk semua. Monitor 2 minggu: <strong>novelty effect?</strong> Churn stabil di 4,2% (tidak kembali ke 3%, tapi juga tidak meledak). <strong>Konfirmasi:</strong> keputusan benar.</p>
<div className="callout">
<p><strong>What:</strong> Harga +20% → revenue/user +10,2% (p=0,01), churn +1,5 poin. Net positif.</p>
<p><strong>So what:</strong> &ldquo;Churn naik&rdquo; bukan alasan menolak — <strong>net revenue</strong> yang menentukan. Tanpa eksperimen, ketakutan mengalahkan matematika.</p>
<p><strong>Now what:</strong> (1) Rollout bertahap + grandfathering. (2) Monitor kohor baru vs lama terpisah 6 bulan. (3) Pelajaran: <strong>metrik primer = uang</strong>, bukan conversion.</p>
</div>

<h2 id="jebakan">🪤 Galeri Jebakan Analis Eksperimen</h2>
<h3>Jebakan 1: Sample Ratio Mismatch (SRM)</h3>
<p>50:50 direncanakan, hasil 52:48. <strong>Bukan</strong> &ldquo;hampir sama&rdquo; — SRM = <strong>bug randomisasi</strong>! Penyebab: bot terfilter beda, redirect error di satu varian, dsb. <strong>Deteksi:</strong> chi-square test <strong>setiap</strong> eksperimen, hari pertama. SRM = <strong>stop &amp; fix</strong>, bukan &ldquo;lanjutkan&rdquo;.</p>
<h3>Jebakan 2: Novelty &amp; primacy effect</h3>
<p>Baru = diklik (novelty) atau lama = dipercaya (primacy). Keduanya <strong>memudar</strong>. <strong>Deteksi:</strong> plot efek <strong>per hari</strong> — menurun setelah hari 3–5 = novelty. Obat: <strong>runback period</strong> 2 minggu pasca-&ldquo;menang&rdquo;.</p>
<h3>Jebakan 3: Multiple testing tanpa koreksi</h3>
<p>Uji 20 metrik, 1 &ldquo;signifikan&rdquo; → klaim menang. P(min. 1 FP) = 1−0,95^20 = <strong>64%</strong>! <strong>Deteksi:</strong> tentukan <strong>1 metrik primer</strong> sebelum jalan. Sisanya = <strong>sekunder/eksplorasi</strong> (butuh koreksi Bonferroni/Holm jika diklaim).</p>
<h3>Jebakan 4: Carryover effect</h3>
<p>User kena eksperimen A minggu lalu, sekarang eksperimen B — <strong>efek A masih menempel</strong>! <strong>Deteksi:</strong> <strong>mutual exclusion</strong> (satu user, satu eksperimen dalam satu layer!) + <strong>cooldown period</strong>. Platform eksperimen tanpa ini = <strong>saling meracuni</strong>.</p>
<h3>Jebakan 5: Survivorship di metrik per-user</h3>
<p>&ldquo;Revenue per <strong>active</strong> user naik!&rdquo; — tapi yang <strong>churn</strong> (karena perlakuan buruk!) keluar dari penyebut! <strong>Deteksi:</strong> metrik harus <strong>per randomized user</strong> (intent-to-treat!), bukan per active. Yang pergi = data, bukan sampah.</p>
<h3>Jebakan 6: Mengubah varian di tengah jalan</h3>
<p>&ldquo;Varian B ada bug kecil, saya fix dikit.&rdquo; → <strong>bukan</strong> eksperimen yang sama lagi! <strong>Deteksi:</strong> <strong>freeze</strong> varian saat jalan. Bug → <strong>stop &amp; restart</strong> (data lama dibuang!). Tidak ada &ldquo;fix dikit&rdquo;.</p>
<div className="tip">
<p><strong>💡 Enam jebakan = enam monitor wajib: SRM, novelty plot, metrik primer tunggal, mutual exclusion, intent-to-treat, varian freeze. Eksperimen tanpa enam ini = <em>teater statistik</em>.</strong></p>
</div>

<h2 id="extra3">📋 Playbook: Pre-Launch Checklist Eksperimen</h2>
<div className="callout">
<p><strong>🚀 PRE-LAUNCH CHECKLIST — [nama eksperimen]</strong></p>
<p><strong>1. Hipotesis:</strong> &ldquo;Jika [perubahan], maka [metrik] [naik/turun] [berapa], karena [alasan].&rdquo;</p>
<p><strong>2. Metrik primer:</strong> __ (satu!) | <strong>Sekunder:</strong> __ | <strong>Guardrail:</strong> __</p>
<p><strong>3. Power:</strong> MDE __, n=__ per grup, durasi __ hari (fixed!). <strong>CUPED:</strong> ya/tidak (ρ=__)</p>
<p><strong>4. Randomisasi:</strong> unit __ (user/kota/...) | cek interference: __</p>
<p><strong>5. SRM monitor:</strong> chi-square hari ke-1. <strong>Peeking:</strong> dilarang / sequential (alpha spending __).</p>
<p><strong>6. Mutual exclusion:</strong> layer __, cooldown __ hari.</p>
<p><strong>7. Rollback plan:</strong> jika guardrail jebol → __ (pemilik: __).</p>
<p><strong>8. Keputusan:</strong> kriteria &ldquo;menang&rdquo; = __ ; &ldquo;kalah&rdquo; = __ ; &ldquo;tidak konklusif&rdquo; = __.</p>
</div>
<p><strong>Aturan:</strong> tidak ada eksperimen jalan tanpa 8 baris terisi + <strong>review 1 orang</strong> (peer!). Checklist ini = <strong>asuransi</strong> terhadap 6 jebakan di atas. 30 menit mengisi = menghemat minggu.</p>

<h2 id="extra4">❓ Tanya-Jawab Mendalam</h2>
<p><strong>Q1: Berapa lama &ldquo;cukup lama&rdquo; untuk eksperimen?</strong><br/>A: <strong>Minimal 1–2 siklus bisnis penuh</strong> (1–2 minggu untuk harian, 1–2 bulan untuk bulanan) + <strong>power tercapai</strong>. Yang lebih lama dari keduanya. Jangan pernah &ldquo;3 hari cukup&rdquo; untuk perilaku mingguan.</p>
<p><strong>Q2: Boleh stop lebih awal jika &ldquo;sangat signifikan&rdquo;?</strong><br/>A: <strong>Hanya</strong> dengan <strong>sequential testing</strong> yang dirancang (alpha spending!). &ldquo;Sangat signifikan&rdquo; tanpa desain = <strong>peeking</strong>. Aturan: jika tidak dirancang untuk early stop, <strong>jangan</strong>.</p>
<p><strong>Q3: Kontrol vs A vs B vs C — multi-armed?</strong><br/>A: <strong>Boleh</strong>, tapi: (a) koreksi multiple comparison, (b) sampel terbagi (power turun per varian!), (c) <strong>lebih baik</strong>: eliminasi bertahap (A/B → pemenang vs C). Jangan uji 10 varian sekaligus dengan sampel untuk 2.</p>
<p><strong>Q4: Eksperimen &ldquo;tidak konklusif&rdquo; — gagal?</strong><br/>A: <strong>Tidak!</strong> &ldquo;Tidak konklusif&rdquo; = <strong>informasi</strong> (efek &lt; MDE). Yang gagal = <strong>tidak belajar apa-apa</strong> (SRM, bug, peeking). Rayakan &ldquo;tidak konklusif yang jujur&rdquo; — ia menghemat implementasi sia-sia.</p>
<p><strong>Q5: Bagaimana eksperimen untuk ML model baru?</strong><br/>A: <strong>Interleaving</strong> (campur hasil A &amp; B, lihat yang diklik!) untuk ranking — butuh <strong>jauh lebih sedikit</strong> sampel. Atau <strong>shadow deployment</strong> (model baru jalan diam-diam, bandingkan prediksi). Jangan A/B buta untuk model.</p>
<p><strong>Q6: Etika eksperimen — bolehkah user tidak tahu?</strong><br/>A: <strong>Umumnya ya</strong> untuk perubahan produk minor (tombol, ranking). <strong>Tidak</strong> untuk: harga personal, kesehatan, keuangan — butuh <strong>consent/transparansi</strong> (MK18!). Aturan: jika kamu <strong>malu</strong> menjelaskannya ke user, jangan lakukan.</p>
<p><strong>Q7: Satu metrik untuk budaya eksperimen?</strong><br/>A: <strong>% keputusan produk dari eksperimen</strong> (bukan opini!) + <strong>kecepatan</strong> (ide → hasil, dalam minggu). Budaya eksperimen = <strong>volume × kecepatan × kejujuran</strong>.</p>
<p><strong>Q8: Kapan TIDAK perlu A/B test?</strong><br/>A: (a) <strong>Bug fix</strong> (jelas benar!), (b) <strong>kepatuhan hukum</strong>, (c) <strong>efek sangat besar &amp; jelas</strong> (toko tutup vs buka!), (d) <strong>tidak ada traffic</strong> (power mustahil). Jangan A/B-kan akal sehat.</p>

      <h2 id="aplikasi">🧪 Lab Pikiran: Tiga Eksperimen, Tiga Jebakan</h2>
<h3>Kasus A: Notifikasi push — &ldquo;menang&rdquo; dalam 2 hari</h3>
<p>Push baru vs lama. Hari ke-2: CTR +40%, p=0,01. Tim mau rollout. Keputusanmu?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus A (klik untuk buka)</summary>
<p><strong>Langkah 1 — Power check:</strong> 2 hari = 15% sampel yang dibutuhkan. <strong>Underpowered!</strong></p>
<p><strong>Langkah 2 — Peeking:</strong> cek hari ke-2 tanpa rencana = <strong>peeking</strong>. p=0,01 dari 1 cek awal = <strong>tidak valid</strong>.</p>
<p><strong>Langkah 3 — Novelty:</strong> push <strong>baru</strong> = diklik karena baru. <strong>Novelty effect!</strong></p>
<p><strong>Keputusan: TOLAK rollout.</strong> Lanjutkan fixed horizon 14 hari. Jika masih menang di hari 14 <strong>dan</strong> bertahan 2 minggu runback → baru rollout. <strong>Tiga red flag</strong> (underpowered + peeking + novelty) = jangan pernah rollout.</p>
</details>
<h3>Kasus B: Diskon marketplace — SRM 53:47</h3>
<p>Eksperimen diskon 50:50. Hari pertama: 53:47 (n=100.000). &ldquo;Hampir 50:50, lanjut?&rdquo;</p>
<details className="worked">
<summary>💡 Pembahasan Kasus B (klik untuk buka)</summary>
<p><strong>Langkah 1 — Chi-square:</strong> expected 50.000:50.000, aktual 53.000:47.000. χ² = (3000²/50000)×2 = 360. p &lt; <strong>0,0001</strong>. <strong>SRM CONFIRMED.</strong></p>
<p><strong>Langkah 2 — Jangan &ldquo;hampir&rdquo;:</strong> dengan n=100.000, selisih 3% = <strong>sangat signifikan</strong> secara statistik. &ldquo;Hampir sama&rdquo; = intuisi yang salah untuk n besar.</p>
<p><strong>Langkah 3 — Investigasi:</strong> ternyata bot <strong>terfilter</strong> dari kontrol tapi <strong>tidak</strong> dari perlakuan (bug pipeline!). <strong>STOP, fix, restart.</strong></p>
<p><strong>Pelajaran:</strong> SRM = <strong>alarm kebakaran</strong>. Tidak ada &ldquo;SRM kecil&rdquo; — ada &ldquo;bug&rdquo; atau &ldquo;tidak ada bug&rdquo;. Dengan n besar, <strong>mata telanjang tidak bisa</strong> menilai &ldquo;hampir sama&rdquo; — pakai chi-square.</p>
</details>
<h3>Kasus C: Fitur premium — efek 6 bulan</h3>
<p>Fitur &ldquo;analitik premium&rdquo;. A/B 1 bulan: tidak signifikan. Tim mau matikan. Keputusanmu?</p>
<details className="worked">
<summary>💡 Pembahasan Kasus C (klik untuk buka)</summary>
<p><strong>Langkah 1 — Power:</strong> apakah 1 bulan cukup untuk <strong>habit formation</strong>? Fitur analitik butuh <strong>belajar</strong> dulu!</p>
<p><strong>Langkah 2 — Kurva adopsi:</strong> minggu 1: 5% pakai. Minggu 4: 25% pakai (naik!). Efek <strong>belum matang</strong>.</p>
<p><strong>Langkah 3 — Keputusan:</strong> <strong>perpanjang</strong> ke 3 bulan <strong>atau</strong> pakai <strong>surrogate</strong> (&ldquo;% yang coba 3x&rdquo; sebagai leading indicator). Jangan matikan fitur <strong>bayi</strong> karena belum bisa lari.</p>
<p><strong>Pelajaran:</strong> <strong>waktu</strong> adalah dimensi eksperimen yang paling dilupakan. Efek jangka panjang butuh <strong>desain jangka panjang</strong> — atau <strong>keberanian</strong> untuk bilang &ldquo;belum tahu&rdquo;.</p>
</details>

      <h2 id="rapat">💬 Simulasi Rapat: Membela "Tidak Konklusif"</h2>
<p><strong>CEO:</strong> &ldquo;Eksperimen 1 bulan, hasil &lsquo;tidak konklusif&rsquo;? Saya bayar tim untuk <strong>jawaban</strong>, bukan &lsquo;tidak tahu&rsquo;!&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Justru &lsquo;tidak konklusif yang jujur&rsquo; = <strong>jawaban</strong>: efeknya <strong>lebih kecil dari 3%</strong> (MDE kita). Tiga pilihannya: (a) <strong>terima</strong> — efeknya terlalu kecil untuk dipedulikan, fokus ke ide <strong>lebih besar</strong>; (b) <strong>perpanjang</strong> dengan CUPED — jika 3% itu <strong>penting</strong> (di skala kita = Rp2M/tahun!); (c) <strong>ulang</strong> dengan desain lebih tajam. <strong>Yang tidak boleh:</strong> (d) klaim &lsquo;menang&rsquo; dari peeking — itu <strong>bohong</strong> Rp2M.&rdquo;</p>
<p><strong>CEO:</strong> &ldquo;...Pilih (b). Tapi 2 minggu, tidak 1 bulan.&rdquo;</p>
<p><strong>Kamu:</strong> &ldquo;Deal — dengan CUPED, 2 minggu <strong>cukup</strong> untuk MDE 3%. Saya yang jamin metodologinya.&rdquo;</p>
<div className="tip">
<p><strong>💡 &ldquo;Tidak konklusif&rdquo; bukan kegagalan — ia <em>batas pengetahuan</em> yang jujur. Tugasmu: ubah &ldquo;tidak tahu&rdquo; menjadi <strong>tiga pilihan berbiaya</strong> (terima/perpanjang/ulang). CEO tidak butuh kepastian; ia butuh <em>opsi yang jelas</em>.</strong></p>
</div>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>A/B valid</strong>: hipotesis dulu, 1 metrik primer + guardrail, randomisasi per user, durasi dari power analysis.</li>
<li><strong>Power & MDE</strong>: n ≈ 16σ²/MDE²; MDE dari bisnis; MDE separuh = sampel 4x.</li>
<li><strong>CUPED</strong>: koreksi dengan data pre-eksperimen → variansi turun (1−ρ²) → power gratis.</li>
<li><strong>Peeking</strong>: intip + berhenti saat signifikan → false positive 5% → 20–30%. Fixed horizon atau sequential.</li>
<li><strong>Beyond A/B</strong>: MVT (banyak elemen, traffic besar), bandit (optimasi berjalan), DiD/synthetic control (randomisasi mustahil).</li>
<li><strong>Laporkan efek + CI</strong>, bukan cuma p-value. Novelty & seasonality: jalankan 1–2 siklus penuh.</li>
</ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mk8-rekomendasi" className="btn btn-secondary btn-sm">← MK8</Link>
        <Link href="/learn/mk10-incrementality" className="btn btn-primary btn-sm">MK10 →</Link>
      </div>
    </div>
  );
}
