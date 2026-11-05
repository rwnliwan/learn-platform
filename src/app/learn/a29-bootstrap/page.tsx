"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function normPdf(x: number, mu: number, sd: number) {
  return Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
}

export default function A29Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: distribusi bootstrap median (ilustrasi dari simulasi tipikal)
  const bootX: number[] = [];
  for (let x = 8; x <= 20; x += 0.2) bootX.push(Math.round(x * 10) / 10);
  const bootData = [
    {
      x: bootX,
      y: bootX.map((x) => normPdf(x, 13.8, 1.1)),
      type: "scatter",
      mode: "lines",
      fill: "tozeroy",
      name: "Distribusi bootstrap median",
      line: { color: "#2a7de1" },
    },
  ];

  // Chart 2: distribusi permutasi null + statistik teramati
  const permX: number[] = [];
  for (let x = -4; x <= 6; x += 0.1) permX.push(Math.round(x * 10) / 10);
  const permData = [
    {
      x: permX,
      y: permX.map((x) => normPdf(x, 0, 1.4)),
      type: "scatter",
      mode: "lines",
      fill: "tozeroy",
      name: "Distribusi null (permutasi)",
      line: { color: "#94a3b8" },
    },
    {
      x: [3.2, 3.2],
      y: [0, normPdf(3.2, 0, 1.4)],
      type: "scatter",
      mode: "lines",
      name: "Teramati: selisih = 3,2",
      line: { dash: "dash", color: "#c2410c", width: 3 },
    },
  ];

  // Chart 3: kapan bootstrap gagal — n kecil (ilustrasi lebar CI vs n)
  const nBoot = [10, 20, 40, 80, 160, 320];
  const bootFailData = [
    {
      x: nBoot,
      y: nBoot.map((n) => 12 / Math.sqrt(n)),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#2a7de1" },
      name: "Lebar CI bootstrap (ilustrasi)",
    },
  ];

  const lab1Code = `import random, statistics as st

random.seed(7)
# Data: waktu tunggu CS (menit), n=60, miring kanan.
# Tidak ada rumus CI untuk MEDIAN yang simpel -> bootstrap saja.
data = [random.expovariate(1/12) for _ in range(60)]
med_obs = st.median(data)

B = 5000
boot_meds = []
for _ in range(B):
    resamp = [random.choice(data) for _ in range(len(data))]  # dengan pengembalian!
    boot_meds.append(st.median(resamp))

boot_meds.sort()
lo, hi = boot_meds[int(0.025*B)], boot_meds[int(0.975*B)]
print(f"Median teramati = {med_obs:.2f} menit")
print(f"Bootstrap 95% CI (persentil): ({lo:.2f}, {hi:.2f})")
print(f"SE bootstrap = {st.stdev(boot_meds):.2f}")
print()
print("Coba: ganti st.median jadi max (statistik ekstrem).")
print("CI bootstrap untuk max berperilaku aneh — salah satu kasus gagalnya bootstrap!")`;

  const lab2Code = `import random, statistics as st

random.seed(13)
# Uji permutasi: apakah program loyalitas menaikkan belanja?
# Grup A (ikut): n=30, Grup B (tidak): n=30. H0: tidak ada beda.
A = [random.gauss(520, 120) for _ in range(30)]
B = [random.gauss(450, 120) for _ in range(30)]
obs = st.mean(A) - st.mean(B)

gabung = A + B
M = 5000
ekstrem = 0
for _ in range(M):
    random.shuffle(gabung)
    diff = st.mean(gabung[:30]) - st.mean(gabung[30:])
    if abs(diff) >= abs(obs):
        ekstrem += 1

p = ekstrem / M
print(f"Selisih teramati (A-B) = Rp{obs:.0f} rb")
print(f"p-value permutasi = {p:.4f}")
print()
print("Logika: jika H0 benar, label A/B tidak bermakna — acak saja,")
print("dan lihat seberapa sering selisih 'palsu' sebesar yang teramati.")
print("Coba: ubah B jadi gauss(520,120) (tidak ada beda nyata). p-value -> besar.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.9 — Statistika Inferensial</span>
        <h1 className="display-title">Statistika Tanpa Rumus:<br />Bootstrap &amp; Uji Permutasi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Sejauh ini semua interval dan uji memakai <strong>rumus dari teori distribusi</strong> (normal, t, chi-square) — yang butuh asumsi. Tapi bagaimana jika statistiknya aneh (median? rasio? kuantil 90%?) dan tidak ada rumus jadi? Lesson ini memberi <strong>mesin komputasi</strong> sebagai pengganti rumus: <strong>bootstrap</strong> untuk estimasi ketidakpastian, <strong>permutasi</strong> untuk pengujian — keduanya hanya butuh data + komputer + satu ide cerdik.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Median Tanpa Rumus</a></li>
          <li><a href="#ide">Ide Cerdik Bradley Efron (1979)</a></li>
          <li><a href="#bootstrap">Bootstrap — Sampel dari Sampel</a></li>
          <li><a href="#ci-boot">Interval Kepercayaan Bootstrap</a></li>
          <li><a href="#permutasi">Uji Permutasi — Mengocok Label</a></li>
          <li><a href="#banding">Bootstrap vs Permutasi — Kapan yang Mana</a></li>
          <li><a href="#gagal">Kapan Bootstrap Gagal</a></li>
          <li><a href="#lab1">🔬 Lab 1: CI Bootstrap untuk Median</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji Permutasi dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Komputasi vs Rumus</a></li>
          <li><a href="#case">📋 Mini-Case: SLA Waktu Tunggu CS</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>prinsip bootstrap</strong> (populasi → sampel → resampel) dengan bahasa sendiri.</li>
          <li>Membangun <strong>interval persentil bootstrap</strong> untuk statistik apapun (median, rasio, kuantil) dari nol.</li>
          <li>Melakukan <strong>uji permutasi</strong> langkah-demi-langkah dan menjelaskan mengapa ia &ldquo;exact&rdquo;.</li>
          <li>Membedakan kegunaan <strong>bootstrap (estimasi)</strong> vs <strong>permutasi (pengujian)</strong>.</li>
          <li>Mengidentifikasi <strong>3 kondisi gagalnya bootstrap</strong> (n kecil, data dependen, statistik ekstrem).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Median Tanpa Rumus</h2>
      <div className="story">
        <p>Manajer CS bertanya: &ldquo;Berapa <strong>median</strong> waktu tunggu pelanggan kita — dan seberapa yakin kamu?&rdquo; Kamu punya 60 data, median = 13,8 menit. Untuk mean, rumusnya jelas: <Tex math={String.raw`\bar{x} \pm t \cdot s/\sqrt{n}`} />. Untuk median? Buku teks hanya memberi rumus aproksimasi yang jelek, atau menyuruhmu &ldquo;asumsikan normal&rdquo; — padahal datanya miring parah.</p>
        <p>Di sinilah Bradley Efron, 1979, memperkenalkan ide yang begitu sederhana hingga terdengar seperti curang: <strong>&ldquo;tidak ada rumus? Resample saja datamu sendiri.&rdquo;</strong> Ambil 60 datamu, acak-ambil 60 <em>dengan pengembalian</em>, hitung mediannya. Ulangi 5.000 kali. Sebaran 5.000 median itu = taksiran distribusi sampling medianmu. Selesai — tanpa satu pun asumsi distribusi.</p>
        <p><strong>Twist-nya:</strong> ide &ldquo;menarik diri sendiri dari lubang dengan bootstraps&rdquo; (asal nama <em>bootstrap</em> — tali sepatu!) ini awalnya dicemooh sebagai sulap statistik. Empat dekade kemudian ia menjadi salah satu alat paling dipakai di sains data — dan memenangkan Efron hadiah-hadiah tertinggi statistika. Kadang ide terbaik adalah yang terlihat seperti curang.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="ide">Ide Cerdik Bradley Efron (1979)</h2>
      <p><strong>Prinsip bootstrap</strong> dalam satu kalimat: <strong>sampel adalah &ldquo;populasi mini&rdquo; terbaik yang kita punya</strong> — jadi perlakukan ia <em>seolah-olah</em> populasi, dan simulasikan pengambilan sampel darinya.</p>
      <p>Rantai analoginya:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Dunia nyata (tak terlihat)</th><th>Dunia bootstrap (terlihat)</th></tr></thead>
          <tbody>
            <tr><td>Populasi F (tak diketahui)</td><td>Sampel → distribusi empiris F̂ (diketahui)</td></tr>
            <tr><td>Sampel acak dari F</td><td>Resampel acak dari F̂ (<strong>dengan pengembalian</strong>)</td></tr>
            <tr><td>Statistik θ̂ bervariasi antar sampel</td><td>Statistik θ̂* bervariasi antar resampel</td></tr>
            <tr><td>Distribusi sampling (target)</td><td>Distribusi bootstrap (taksiran)</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Kepribadian ide ini:</strong> si pragmatis radikal — &ldquo;tidak tahu distribusi populasinya? Pakai saja distribusi yang <em>terlihat</em>.&rdquo; Keajaibannya: secara matematis, distribusi empiris F̂ konvergen ke F saat n besar (teorema Glivenko–Cantelli) — jadi resampling dari F̂ meniru sampling dari F dengan semakin akurat.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> &ldquo;dengan pengembalian&rdquo; adalah nyawa bootstrap. Tanpa pengembalian, resampel = sampel asli yang diacak urutannya — mediannya selalu sama, tidak ada variasi. <em>Dengan</em> pengembalian, tiap resampel adalah &ldquo;semesta alternatif&rdquo;: ada data yang muncul 3×, ada yang hilang — persis seperti fluktuasi sampling di dunia nyata.</p>
      </div>

      <h2 id="bootstrap">Bootstrap — Sampel dari Sampel</h2>
      <p><strong>Definisi.</strong> <strong>Bootstrap nonparametrik</strong>: dari sampel <Tex math={String.raw`x_1, \dots, x_n`} />, buat <Tex math={String.raw`B`} /> resampel berukuran <Tex math={String.raw`n`} /> <strong>dengan pengembalian</strong>; hitung statistik <Tex math={String.raw`\hat{\theta}^*_b`} /> di tiap resampel; sebaran <Tex math={String.raw`B`} /> nilai itu menaksir distribusi sampling <Tex math={String.raw`\hat{\theta}`} />.</p>
      <p><strong>Algoritme (5 langkah):</strong></p>
      <ol>
        <li>Punya sampel <Tex math={String.raw`n`} /> observasi.</li>
        <li>Untuk b = 1 … B (B = 1.000–10.000): ambil <Tex math={String.raw`n`} /> data <strong>dengan pengembalian</strong> → resampel ke-b.</li>
        <li>Hitung statistik di tiap resampel: <Tex math={String.raw`\hat{\theta}^*_1, \dots, \hat{\theta}^*_B`} />.</li>
        <li><strong>SE bootstrap</strong> = simpangan baku dari <Tex math={String.raw`B`} /> nilai itu.</li>
        <li><strong>CI persentil</strong> = persentil 2,5% dan 97,5%-nya.</li>
      </ol>
      <Tex math={String.raw`SE_{boot} = \text{sd}(\hat{\theta}^*_1, \dots, \hat{\theta}^*_B), \qquad CI_{95\%} = \left[ q_{0.025}^*, \; q_{0.975}^* \right]`} block />
      <p><strong>Kepribadian bootstrap:</strong> si tukang yang tidak butuh teori — &ldquo;beri saya data dan statistik apapun, saya beri ketidakpastiannya.&rdquo; Median? Rasio dua mean? Selisih kuantil 90%? Koefisien model ML? Semua bisa.</p>
      <p><strong>Catatan Monte Carlo:</strong> bootstrap adalah aplikasi <strong>metode Monte Carlo</strong> — memakai simulasi acak untuk menjawab pertanyaan analitik yang sulit. Prinsip yang sama dipakai di risk management (simulasi VaR portofolio) dan fisika. Jika lowongan risk analyst menulis &ldquo;Monte-Carlo&rdquo;, inilah keluarganya.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: bootstrap mini (B = 5)</summary>
        <p>Data: [4, 7, 9, 12, 18]. Statistik: median. Median teramati = 9.</p>
        <p><strong>Resampel 1:</strong> [7, 4, 18, 7, 12] → median 7<br />
        <strong>Resampel 2:</strong> [9, 9, 4, 18, 12] → median 9<br />
        <strong>Resampel 3:</strong> [18, 12, 12, 7, 4] → median 12<br />
        <strong>Resampel 4:</strong> [4, 7, 9, 9, 9] → median 9<br />
        <strong>Resampel 5:</strong> [12, 18, 9, 4, 7] → median 9</p>
        <p>Sebaran bootstrap: {"{7, 9, 12, 9, 9}"} → SE ≈ 1,6. Dengan B = 5.000 (bukan 5), sebarannya halus dan CI persentilnya stabil. Praktiknya B ≥ 1.000 untuk SE, B ≥ 5.000 untuk CI.</p>
      </details>

      <PlotlyChart
        data={bootData}
        title="Distribusi Bootstrap Median Waktu Tunggu (B = 5.000 resampel)"
        layout={{ xaxis: { title: "Median (menit)" }, yaxis: { title: "Kepadatan" }, showlegend: true, shapes: [{ type: "line", x0: 11.6, x1: 11.6, y0: 0, y1: 0.35, line: { dash: "dash", color: "#c2410c" } }, { type: "line", x0: 16.1, x1: 16.1, y0: 0, y1: 0.35, line: { dash: "dash", color: "#c2410c" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> histogram/kurva dari 5.000 median resampel. Garis oranye = persentil 2,5% dan 97,5% (batas CI).</p>
        <p><strong>Interpretasi:</strong> sebaran berbentuk lonceng di sekitar 13,8 — <strong>meski data aslinya miring</strong> (CLT bekerja untuk median juga, dengan n cukup). CI 95%: (11,6, 16,1). Perhatikan asimetrinya yang halus — CI bootstrap <em>boleh</em> tidak simetris, tidak seperti <Tex math={String.raw`\bar{x} \pm \text{margin}`} />. Itulah kelebihannya: mengikuti bentuk ketidakpastian yang sebenarnya.</p>
      </div>

      <h2 id="ci-boot">Interval Kepercayaan Bootstrap</h2>
      <p><strong>Metode persentil</strong> (di atas) adalah yang paling populer: ambil persentil 2,5% dan 97,5% dari sebaran bootstrap. Simpel dan intuitif. Tapi ada versi yang lebih baik:</p>
      <ul>
        <li><strong>BCa (bias-corrected and accelerated):</strong> mengoreksi bias dan skewness sebaran bootstrap. Standar emas praktis — hampir selalu sedikit lebih akurat dari persentil biasa, dengan biaya komputasi yang sama.</li>
        <li><strong>Bootstrap-t (studentized):</strong> bootstrap pada statistik yang distudentisasi <Tex math={String.raw`(\hat{\theta}^* - \hat{\theta})/SE^*`} /> — orde akurasi lebih tinggi, tapi butuh SE di tiap resampel (mahal).</li>
      </ul>
      <p><strong>Aturan praktis:</strong> persentil cukup untuk kebanyakan keperluan; BCa jika tersedia di library (hampir gratis); bootstrap-t untuk n kecil yang kritis.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bootstrap menciptakan data baru / menambah informasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> bootstrap <strong>tidak menambah informasi</strong> sedikit pun — ia hanya <em>mengekstrak</em> informasi tentang <strong>variabilitas</strong> yang sudah terkandung dalam sampel. Jika n = 10, bootstrap tidak sulap menjadi n = 1.000. Ia menjawab &ldquo;seberapa goyah statistik ini?&rdquo;, bukan &ldquo;apa nilai yang benar?&rdquo;.</p>
      </div>

      <h2 id="permutasi">Uji Permutasi — Mengocok Label</h2>
      <p><strong>Definisi.</strong> <strong>Uji permutasi</strong> (permutation test): di bawah H0 (&ldquo;tidak ada beda antar grup&rdquo;), label grup <strong>tidak bermakna</strong> — jadi acak-acak labelnya, hitung ulang statistik, dan lihat seberapa sering hasil &ldquo;acakan&rdquo; seekstrem data asli:</p>
      <Tex math={String.raw`p = \frac{\#\{\text{permutasi dengan } |T^*| \ge |T_{\text{obs}}|\} + 1}{\#\text{permutasi} + 1}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`T_{obs}`} /> statistik teramati (misal selisih mean); <Tex math={String.raw`T^*`} /> statistik dari data berlabel acak; <Tex math={String.raw`+1`} /> koreksi agar p-value tidak pernah nol persis (menghitung data asli sebagai satu &ldquo;permutasi&rdquo;).</p>
      <p><strong>Algoritme:</strong></p>
      <ol>
        <li>Hitung statistik teramati <Tex math={String.raw`T_{obs}`} /> (misal mean A − mean B).</li>
        <li>Gabung semua data, <strong>acak label grupnya</strong>, hitung <Tex math={String.raw`T^*`} />.</li>
        <li>Ulangi ribuan kali → <strong>distribusi null empiris</strong>.</li>
        <li>p-value = proporsi <Tex math={String.raw`|T^*| \ge |T_{obs}|`} />.</li>
      </ol>
      <p><strong>Kepribadian permutasi:</strong> si hakim yang adil sempurna — ia membangun &ldquo;dunia H0&rdquo; langsung dari datamu, tanpa meminjam distribusi teoritis apapun. Karena null-nya dibangun dari data itu sendiri, uji ini <strong>exact</strong> (tingkat α-nya tepat, bukan aproksimasi) — dengan satu syarat: <strong>exchangeability</strong> (di bawah H0, label memang boleh diacak — benar untuk uji beda dua grup acak).</p>
      <p><strong>Kekuatan tersembunyi:</strong> statistiknya bebas — selisih mean, selisih median, selisih variansi, bahkan statistik buatanmu sendiri. Uji-t hanya bisa untuk mean; permutasi untuk <strong>apapun</strong>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji permutasi adalah <strong>alasan konseptual</strong> mengapa uji-t bekerja — Fisher menemukannya (1935) <em>sebelum</em> komputer ada, sebagai justifikasi teoritis. Komputer hanya membuatnya praktis. Setiap kali memakai uji-t, kamu sebenarnya memakai <em>aproksimasi cepat</em> dari uji permutasi.</p>
      </div>

      <PlotlyChart
        data={permData}
        title="Uji Permutasi: Distribusi Null vs Statistik Teramati"
        layout={{ xaxis: { title: "Selisih mean (ribu Rp)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva abu-abu = 5.000 selisih dari data berlabel acak (&ldquo;dunia H0&rdquo;). Garis oranye = selisih yang benar-benar teramati (3,2).</p>
        <p><strong>Interpretasi:</strong> garis oranye jatuh jauh di ekor kanan — dari 5.000 acakan, hampir tidak ada yang menghasilkan selisih sebesar itu. p ≈ 0,02 → tolak H0. <strong>Rasakan logikanya secara visual:</strong> &ldquo;andaikan tidak ada efek, hasilku ini <em>nyaris mustahil</em> — jadi efeknya nyata.&rdquo;</p>
      </div>

      <h2 id="banding">Bootstrap vs Permutasi — Kapan yang Mana</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th></th><th>Bootstrap</th><th>Permutasi</th></tr></thead>
          <tbody>
            <tr><td><strong>Tujuan</strong></td><td>Estimasi: SE, CI</td><td>Pengujian: p-value</td></tr>
            <tr><td><strong>Resampling</strong></td><td>Dengan pengembalian, <em>dalam</em> tiap grup</td><td>Tanpa pengembalian, <em>acak label antar</em> grup</td></tr>
            <tr><td><strong>Dunia yang disimulasikan</strong></td><td>Dunia nyata (seperti data)</td><td>Dunia H0 (tidak ada beda)</td></tr>
            <tr><td><strong>Asumsi</strong></td><td>Sampel mewakili populasi (n cukup)</td><td>Exchangeability di bawah H0</td></tr>
            <tr><td><strong>Output</strong></td><td>Sebaran statistik → CI</td><td>Sebaran null → p-value</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Mnemonik:</strong> <strong>bootstrap = meniru dunia nyata</strong> (untuk mengukur ketidakpastian estimasi); <strong>permutasi = membangun dunia H0</strong> (untuk menguji klaim). Tertukar keduanya = memakai obeng untuk memaku.</p>

      <h2 id="gagal">Kapan Bootstrap Gagal</h2>
      <p>Bootstrap hebat, tapi bukan sihir. Tiga kondisi gagal yang wajib dihafal:</p>
      <ol>
        <li><strong>n terlalu kecil.</strong> Dengan n = 10, distribusi empiris F̂ adalah taksiran kasar dari F — bootstrap &ldquo;percaya&rdquo; pada karikatur. Aturan: n ≥ 20–30 untuk statistik halus (mean); lebih untuk kuantil.</li>
        <li><strong>Data dependen.</strong> Resampel acak menghancurkan struktur waktu (time series) atau klaster. Solusi: <strong>block bootstrap</strong> — resample blok-blok berurutan, bukan titik individual.</li>
        <li><strong>Statistik ekstrem / tidak mulus.</strong> Untuk <strong>max/min</strong>, bootstrap gagal total (max resampel tidak pernah melebihi max sampel — sebarannya cacat). Untuk statistik tidak mulus lainnya, butuh <strong>m-out-of-n bootstrap</strong> atau subsampling.</li>
      </ol>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bootstrap selalu valid karena tidak berasumsi distribusi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;nonparametrik&rdquo; ≠ &ldquo;tanpa asumsi&rdquo;. Bootstrap berasumsi <strong>sampel mewakili populasi</strong> (butuh n cukup &amp; sampling acak) dan <strong>statistiknya cukup mulus</strong>. Untuk max, data time series tanpa block, atau n = 8 — bootstrap memberi jawaban yang salah dengan percaya diri. &ldquo;Bebas distribusi&rdquo; bukan &ldquo;bebas syarat&rdquo;.</p>
      </div>

      <PlotlyChart
        data={bootFailData}
        title="Lebar CI Bootstrap vs n: Ketidakpastian Tetap Butuh Data"
        layout={{ xaxis: { title: "n" }, yaxis: { title: "Lebar CI (ilustrasi)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = ukuran sampel; vertikal = lebar interval bootstrap.</p>
        <p><strong>Interpretasi:</strong> bootstrap tidak <em>menciptakan</em> presisi — lebar CI tetap menyusut dengan <Tex math={String.raw`1/\sqrt{n}`} />. Pada n kecil, CI-nya lebar <em>dan</em> taksiran sebarannya kasar. <strong>Pesan:</strong> bootstrap adalah mesin ketidakpastian yang jujur, bukan mesin pembesar data.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Bootstrap = &ldquo;simulasikan dunia dari sampelmu&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: IK median — tanpa rumus</summary>
              <p>Gaji (jt): 8, 9, 10, 11, 12, 13, 14, 50 (n=8, miring!). Interval 95% untuk <em>median</em> — tidak ada rumus sederhana. Bootstrap?</p>
              <p><strong>Langkah 1</strong> — resample 8 data <em>dengan pengembalian</em> 10.000× → 10.000 median bootstrap.<br />
              <strong>Langkah 2</strong> — persentil 2,5% &amp; 97,5% dari 10.000 median → mis. <strong>(9,5; 13,0)</strong>.<br />
              <strong>Langkah 3</strong> — bandingkan: IK mean via t = (7,2; 23,6) — <em>lebar &amp; ditarik outlier</em>. IK median bootstrap robust!</p>
              <p>Pelajaran: bootstrap bekerja untuk <em>statistik apapun</em> (median, persentil, rasio) — tanpa rumus, tanpa asumsi Normal. Satu-satunya syarat: sampel mewakili populasi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Uji permutasi — beda dua grup tanpa asumsi</summary>
              <p>Grup A: 12, 14, 15. Grup B: 8, 9, 10. Apakah mean beda signifikan? (n=3+3 — uji-t rapuh!)</p>
              <p><strong>Langkah 1</strong> — statistik teramati: x̄A − x̄B = 13,67 − 9 = <strong>4,67</strong>.<br />
              <strong>Langkah 2</strong> — H0: label grup tak bermakna → acak label 20× (C(6,3)=20 semua permutasi).<br />
              <strong>Langkah 3</strong> — dari 20 permutasi, hanya 2 yang selisihnya ≥ 4,67 → p = 2/20 = <strong>0,10</strong> → tidak signifikan.<br />
              <strong>Langkah 4</strong> — uji-t memberi p ≈ 0,03 (signifikan!) — tapi asumsi Normal dengan n=3 = fiksi. Permutasi lebih jujur.</p>
              <p>Pelajaran: uji permutasi = &ldquo;uji eksak tanpa distribusi&rdquo;. Untuk n kecil / asumsi rapuh, ia emas. Untuk n besar, ia ≈ uji-t (dan lebih mahal komputasi).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: CI Bootstrap untuk Median</h2>
      <p>60 data waktu tunggu yang miring — tidak ada rumus CI median yang bagus. Bootstrap: resample 5.000×, ambil persentil 2,5% &amp; 97,5%. Selesai.</p>
      <PyodideLab
        title="Lab 1 — Bootstrap Persentil untuk Median (Live Python)"
        hint="⚡ Live Python. Coba: ganti st.median jadi max. CI-nya berperilaku aneh (batas atas = max sampel) — saksikan sendiri kegagalan #3!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Uji Permutasi dari Nol</h2>
      <p>Apakah program loyalitas menaikkan belanja? Acak label grup 5.000×, bangun dunia H0, hitung p-value — tanpa rumus distribusi apa pun.</p>
      <PyodideLab
        title="Lab 2 — Uji Permutasi Beda Dua Mean (Live Python)"
        hint="Coba: ubah B jadi gauss(520,120) — tidak ada beda nyata. p-value jadi besar. Lalu coba statistik selisih MEDIAN, bukan mean — permutasi tetap jalan!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Komputasi vs Rumus</h2>

      <div className="decision-card">
        <h3>1. Butuh CI/SE untuk statistik &ldquo;aneh&rdquo; → <strong>bootstrap persentil/BCa</strong></h3>
        <p><strong>Kondisi:</strong> median, kuantil, rasio, korelasi rank, metrik model ML — tidak ada rumus jadi.</p>
        <p><strong>Kenapa:</strong> satu algoritme untuk semua statistik. B = 5.000, ambil persentil. (n ≥ 30 agar F̂ cukup mewakili F.)</p>
        <p><strong>Contoh nyata:</strong> CI 95% untuk median waktu tunggu; SE untuk rasio konversi dua kampanye.</p>
      </div>

      <div className="decision-card">
        <h3>2. Uji beda dua grup tanpa asumsi distribusi → <strong>uji permutasi</strong></h3>
        <p><strong>Kondisi:</strong> H0 = &ldquo;tidak ada beda&rdquo;, label bisa diacak (desain acak).</p>
        <p><strong>Kenapa:</strong> exact, tanpa asumsi normalitas; statistik bebas (mean, median, variansi). M = 5.000–10.000 cukup.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;apakah median belanja grup A &gt; B?&rdquo; — tanpa uji-t.</p>
      </div>

      <div className="decision-card">
        <h3>3. Rumus klasik tersedia &amp; asumsi terpenuhi → <strong>pakai rumus</strong></h3>
        <p><strong>Kondisi:</strong> CI mean dengan n besar, uji-t standar.</p>
        <p><strong>Kenapa:</strong> rumus lebih cepat, lebih presisi (tanpa Monte Carlo error), dan komunikasinya standar. Bootstrap bukan pengganti rumus — ia <em>cadangan</em> saat rumus tak ada.</p>
        <p><strong>Contoh nyata:</strong> interval-t untuk mean — jangan bootstrap hanya karena &ldquo;keren&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Data time series / berklaster → <strong>block bootstrap</strong></h3>
        <p><strong>Kondisi:</strong> observasi tidak independen (return harian, data panel).</p>
        <p><strong>Kenapa:</strong> resampel acak menghancurkan autokorelasi → SE underestimate. Resample <em>blok</em> berurutan untuk menjaga struktur.</p>
        <p><strong>Contoh nyata:</strong> CI untuk Sharpe ratio strategi (return berkorelasi waktu).</p>
      </div>

      <div className="decision-card">
        <h3>5. Statistik ekstrem (max/min) atau n mungil → <strong>waspada / metode khusus</strong></h3>
        <p><strong>Kondisi:</strong> mengestimasi &ldquo;worst case&rdquo;, n &lt; 20.</p>
        <p><strong>Kenapa:</strong> bootstrap standar gagal untuk max/min; untuk n mungil, F̂ terlalu kasar. Pertimbangkan teori nilai ekstrem atau kumpulkan data dulu.</p>
        <p><strong>Contoh nyata:</strong> estimasi &ldquo;kerugian maksimum&rdquo; — jangan bootstrap max dari 30 data.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Estimasi (CI/SE) → bootstrap.</strong> Pengujian (p-value) → permutasi.</li>
          <li><strong>B = 5.000</strong> untuk CI; <strong>M = 5.000–10.000</strong> untuk permutasi. Lebih besar = Monte Carlo error lebih kecil.</li>
          <li><strong>Dengan pengembalian</strong> untuk bootstrap; <strong>acak label</strong> untuk permutasi. Tertukar = salah total.</li>
          <li>Bootstrap tidak menambah informasi — ia hanya mengekstrak ketidakpastian. n kecil tetap n kecil.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: SLA Waktu Tunggu CS</h2>
      <div className="callout">
        <p>Manajer CS menetapkan SLA: &ldquo;<strong>median</strong> waktu tunggu &lt; 15 menit&rdquo;. Data bulan ini (n=60): median teramati <strong>13,8 menit</strong> — &ldquo;lolos!&rdquo; katanya. Kamu diminta verifikasi dengan interval kepercayaan.</p>
        <p><strong>Pertanyaan:</strong> (a) Mengapa rumus <Tex math={String.raw`\bar{x} \pm t \cdot s/\sqrt{n}`} /> tidak tepat untuk SLA ini? (b) Bootstrap memberi 95% CI (11,6, 16,1) — apakah SLA &ldquo;lolos&rdquo;? (c) Apa rekomendasi pelaporan SLA ke depannya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Rumus itu untuk <strong>mean</strong>, bukan median — dan SLA-nya ditulis dalam median (tepat, karena data miring). Memakai CI mean untuk klaim median = salah alamat. Tidak ada rumus sederhana untuk CI median → <strong>bootstrap</strong> adalah jawabannya.</p>
          <p>(b) <strong>Belum tentu lolos.</strong> CI (11,6, 16,1) <em>mencakup</em> 15 — data konsisten dengan median sebenarnya 15,5 (gagal SLA) maupun 12 (lolos). &ldquo;Median teramati 13,8 &lt; 15&rdquo; mengabaikan ketidakpastian ±2 menit. Klaim &ldquo;lolos&rdquo; dari titik estimasi = presisi palsu.</p>
          <p>(c) <strong>Laporkan SLA sebagai interval, bukan titik:</strong> &ldquo;median 13,8 (95% CI: 11,6–16,1) — belum konklusif vs target 15.&rdquo; Tetapkan aturan keputusan <em>sebelum</em> periode: misal &ldquo;lolos jika <strong>batas atas</strong> CI &lt; 15&rdquo; (kriteria konservatif). Dan tambah n bulan depan — CI selebar 4,5 menit artinya datanya kurang untuk vonis yang tajam.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Kapan bootstrap <em>gagal</em>? (2 kondisi.)</li>
              <li>Bedakan bootstrap <em>nonparametrik</em> vs <em>parametrik</em>. Kapan yang parametrik dipakai?</li>
              <li>Uji permutasi untuk korelasi: bagaimana &ldquo;mengacak&rdquo; yang benar? (Petunjuk: acak salah satu variabel!)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) <strong>n sangat kecil</strong> (sampel tidak mewakili populasi — &ldquo;sampah in, sampah out&rdquo;). (b) <strong>Statistik ekstrem</strong> (max/min) — bootstrap meremehkan variabilitasnya. (c) Data <strong>dependen</strong> (time series!) tanpa block bootstrap.</p>
              <p><strong>2.</strong> Nonparametrik: resample <em>data</em> (tanpa asumsi distribusi). Parametrik: resample dari <em>distribusi fitted</em> (mis. Normal(μ̂, σ̂)) — dipakai saat n kecil &amp; model distribusi dipercaya, atau untuk <em>power analysis</em> simulasi.</p>
              <p><strong>3.</strong> Acak <em>salah satu</em> variabel (mis. Y) sambil X tetap → hancurkan asosiasi (H0: independen) tapi pertahankan marginal tiap variabel. Korelasi dari data teracak = distribusi null.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Apa ide inti bootstrap dalam satu kalimat?"
        options={[
          "Mengumpulkan data baru yang banyak",
          "Memperlakukan sampel sebagai 'populasi mini' dan mensimulasikan pengambilan sampel darinya (dengan pengembalian)",
          "Mengasumsikan semua data normal",
          "Menghapus outlier lalu menghitung ulang",
        ]}
        correct={1}
        explanation="Benar. Bootstrap = simulasi sampling dari distribusi empiris F̂ sebagai pengganti F yang tak diketahui. 'Dengan pengembalian' adalah nyawanya — tanpanya tidak ada variasi antar resampel."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kapan uji permutasi menjadi pilihan terbaik?"
        options={[
          "Selalu — gantikan semua uji-t",
          "Saat ingin p-value tanpa asumsi distribusi, H0 = 'tidak ada beda', dan label grup bisa diacak (exchangeable)",
          "Hanya untuk n > 1000",
          "Saat datanya normal",
        ]}
        correct={1}
        explanation="Benar. Permutasi membangun dunia H0 langsung dari data — exact dan bebas asumsi. Syaratnya exchangeability di bawah H0 (terpenuhi untuk desain acak dua grup). Untuk kasus standar dengan asumsi terpenuhi, rumus tetap lebih efisien."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Bootstrap untuk statistik MAX dari n=30 data. Apa masalahnya?"
        options={[
          "Tidak ada — bootstrap untuk semua statistik",
          "Max resampel tidak pernah melebihi max sampel — sebaran bootstrap cacat untuk statistik ekstrem",
          "B terlalu kecil",
          "Harus tanpa pengembalian",
        ]}
        correct={1}
        explanation="Benar — kegagalan #3. Statistik ekstrem (max/min) tidak 'mulus': resampling tidak bisa mengeksplorasi di luar data teramati. Butuh teori nilai ekstrem atau metode khusus (m-out-of-n)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Data return harian (berkorelasi waktu) di-bootstrap acak untuk CI Sharpe ratio. Apa risikonya?"
        options={[
          "Tidak ada risiko",
          "Resampel acak menghancurkan autokorelasi → SE underestimate → CI terlalu sempit (terlalu percaya diri). Solusi: block bootstrap",
          "CI jadi terlalu lebar",
          "Sharpe tidak bisa di-bootstrap",
        ]}
        correct={1}
        explanation="Benar — kegagalan #2 (data dependen). Bootstrap standar mengasumsikan observasi independen. Untuk time series, resample blok-blok berurutan agar struktur korelasi terjaga."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bedakan kegunaan: tim butuh (i) CI untuk rasio dua median, (ii) p-value untuk 'apakah median A > median B'."
        options={[
          "(i) permutasi, (ii) bootstrap",
          "(i) bootstrap (estimasi CI), (ii) permutasi (pengujian p-value)",
          "Keduanya bootstrap",
          "Keduanya permutasi",
        ]}
        correct={1}
        explanation="Benar. Mnemonik: bootstrap = meniru dunia nyata untuk ESTIMASI (SE/CI); permutasi = membangun dunia H0 untuk PENGUJIAN (p-value). Tertukar = memakai obeng untuk memaku."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bootstrap 95% CI untuk median = (11,6, 16,1), target SLA < 15. Manajer bilang 'median 13,8 < 15, lolos'. Respons tepat?"
        options={[
          "Setuju — 13,8 < 15",
          "Belum konklusif: CI mencakup 15, jadi data konsisten dengan gagal SLA juga. Tetapkan kriteria di batas CI (misal batas atas < 15), bukan di titik estimasi",
          "Naikkan target jadi 17",
          "Kumpulkan 6 data lagi pasti lolos",
        ]}
        correct={1}
        explanation="Benar. Titik estimasi tanpa ketidakpastian = presisi palsu. Keputusan berbasis '13,8 < 15' mengabaikan ±2 menit ketidakpastian. Aturan yang defensibel memakai batas interval, ditetapkan sebelum periode berjalan."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Prinsip bootstrap:</strong> sampel = populasi mini; resample <em>dengan pengembalian</em> → sebaran statistik → SE &amp; CI persentil.</li>
          <li><strong>CI bootstrap:</strong> <Tex math={String.raw`[q^*_{0.025},\, q^*_{0.975}]`} /> — boleh asimetris, mengikuti bentuk ketidakpastian sebenarnya. BCa lebih baik jika tersedia.</li>
          <li><strong>Uji permutasi:</strong> acak label → bangun dunia H0 → p-value = proporsi <Tex math={String.raw`|T^*| \ge |T_{obs}|`} />. Exact, statistik bebas.</li>
          <li><strong>Mnemonik:</strong> bootstrap untuk estimasi, permutasi untuk pengujian.</li>
          <li><strong>3 kegagalan bootstrap:</strong> n kecil, data dependen (→ block bootstrap), statistik ekstrem seperti max.</li>
          <li><strong>Monte Carlo:</strong> bootstrap adalah anggota keluarga simulasi Monte Carlo — dipakai juga untuk VaR &amp; risk modeling.</li>
          <li><strong>Jangan:</strong> bootstrap untuk max/min; resampel acak pada time series; mengira bootstrap menambah informasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a28-multiple-testing" className="btn btn-secondary btn-sm">← A2.8</Link>
        <Link href="/learn/a210-power-sampel" className="btn btn-primary btn-sm">Next: A2.10 →</Link>
      </div>
    </div>
  );
}
