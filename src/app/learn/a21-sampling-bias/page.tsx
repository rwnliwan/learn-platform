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

export default function A21Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: Literary Digest vs Gallup vs hasil aktual (share suara Roosevelt, %)
  const pollData = [
    {
      x: ["Literary Digest<br>(2,4 jt responden)", "Gallup<br>(50 rb responden)", "Hasil aktual<br>pemilu 1936"],
      y: [43, 56, 62],
      type: "bar",
      marker: { color: ["#c2410c", "#2a7de1", "#16a34a"] },
      text: ["43%", "56%", "62%"],
      textposition: "outside",
    },
  ];

  // Chart 2: distribusi sampling mean untuk n berbeda (populasi mean=15, sigma=8)
  const xs: number[] = [];
  for (let x = 8; x <= 22; x += 0.25) xs.push(x);
  const samplingDistData = [10, 100, 1000].map((n) => ({
    x: xs,
    y: xs.map((x) => normPdf(x, 15, 8 / Math.sqrt(n))),
    type: "scatter",
    mode: "lines",
    name: `n = ${n}`,
  }));

  // Chart 3: margin of error vs ukuran sampel (p=0.5, 95%)
  const nVals = [100, 200, 400, 800, 1600, 3200, 6400];
  const moeData = [
    {
      x: nVals,
      y: nVals.map((n) => (1.96 * Math.sqrt(0.25 / n) * 100)),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#2a7de1" },
      name: "Margin of error (± poin %)",
    },
  ];

  const lab1Code = `import random, statistics as st, math

random.seed(42)
# Populasi: waktu tunggu layanan (menit) — miring kanan seperti data asli
pop = [random.expovariate(1/15) for _ in range(20000)]
mu = st.mean(pop); sigma = st.pstdev(pop)
print(f"Populasi: mean = {mu:.2f} mnt, sigma = {sigma:.2f}")

print(f"{'n':>6}  {'SE empiris':>10}  {'SE teori s/√n':>14}")
for n in [10, 50, 200, 1000]:
    means = [st.mean(random.sample(pop, n)) for _ in range(2000)]
    se_emp = st.stdev(means)
    se_teo = sigma / math.sqrt(n)
    print(f"{n:>6}  {se_emp:>10.3f}  {se_teo:>14.3f}")

print()
print("Coba: ganti daftar n jadi [5, 20, 80, 320].")
print("Perhatikan SE turun mengikuti 1/√n — bukan 1/n!")`;

  const lab2Code = `import random, statistics as st, math

random.seed(7)
p = 0.52  # proporsi sebenarnya di populasi (misal: 52% puas)
print(f"{'n':>6}  {'SE':>7}  {'Margin of error 95%':>20}")
for n in [100, 400, 1600, 6400]:
    phats = [sum(random.random() < p for _ in range(n)) / n for _ in range(1000)]
    se = st.stdev(phats)
    print(f"{n:>6}  {se:>7.4f}  ±{1.96*se*100:>5.1f} poin")

print()
print("n naik 64x (100 -> 6400) tapi MoE hanya turun 8x (akar 64).")
print("Itulah 'hukum akar kuadrat': presisi itu MAHAL.")
print("Coba: ubah p jadi 0.05. Apa yang terjadi pada SE?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.1 — Statistika Inferensial</span>
        <h1 className="display-title">2,4 Juta Responden yang Salah Total:<br />Pelajaran Termahal soal Sampling</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Survei Terbesar yang Pernah Gagal</a></li>
          <li><a href="#populasi">Populasi vs Sampel — Peta Bukan Wilayahnya</a></li>
          <li><a href="#bias">Bias: Empat Cara Sampel Menyesatkanmu</a></li>
          <li><a href="#distribusi">Distribusi Sampling &amp; Teorema Limit Pusat</a></li>
          <li><a href="#se">Standard Error — Harga Ketidakpastian</a></li>
          <li><a href="#lab1">🔬 Lab 1: Saksikan Distribusi Sampling Terbentuk</a></li>
          <li><a href="#lab2">🔬 Lab 2: Hukum Akar Kuadrat (Presisi Itu Mahal)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metode Sampling</a></li>
          <li><a href="#case">📋 Mini-Case: Survei Kepuasan yang Menipu Direksi</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa <strong>sampel besar tapi bias</strong> kalah dari <strong>sampel kecil tapi acak</strong> — dengan contoh historis konkret.</li>
          <li>Mengidentifikasi empat jenis bias sampling (seleksi, survivorship, nonrespons, convenience) pada kasus nyata.</li>
          <li>Menghitung standard error mean dan proporsi, serta menjelaskan <strong>hukum akar kuadrat</strong> (membelah dua SE butuh 4× sampel).</li>
          <li>Menjelaskan Teorema Limit Pusat dengan bahasa sendiri: kapan mean sampel boleh diperlakukan sebagai normal.</li>
          <li>Memilih metode sampling yang tepat (acak sederhana, stratifikasi, klaster, sistematis) untuk skenario survei nyata.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Survei Terbesar yang Pernah Gagal</h2>
      <div className="story">
        <p>Tahun 1936, majalah <em>Literary Digest</em> melakukan survei pemilu AS terbesar dalam sejarah: <strong>2,4 juta responden</strong>. Hasilnya meyakinkan — Alf Landon akan mengalahkan Franklin D. Roosevelt. Mereka mencetak headline kemenangan Landon.</p>
        <p>Hasil aktual? Roosevelt menang telak dengan 62% suara. <em>Literary Digest</em> salah total — dan bangkrut dua tahun kemudian.</p>
        <p>Di saat yang sama, seorang pemuda bernama George Gallup mensurvei <strong>hanya 50 ribu orang</strong> — dan prediksinya benar. 2,4 juta kalah dari 50 ribu. Bagaimana mungkin?</p>
        <p>Jawabannya bukan soal jumlah. <em>Literary Digest</em> mengambil sampel dari <strong>daftar pemilik telepon dan mobil</strong> — di era Depresi Besar, itu artinya orang kaya, yang memang condong ke Landon. Sampelnya raksasa tapi <strong>bias</strong>: ia tidak mewakili pemilih Amerika, ia mewakili pemilih kaya Amerika.</p>
        <p><strong>Twist-nya:</strong> ukuran sampel hampir tidak relevan jika cara mengambilnya salah. Satu juta data bias tetap bias — hanya bias yang lebih presisi.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="populasi">Populasi vs Sampel — Peta Bukan Wilayahnya</h2>
      <p><strong>Definisi.</strong> <strong>Populasi</strong> adalah seluruh kelompok yang ingin kita ketahui (semua nasabah bank, semua pemilih). <strong>Sampel</strong> adalah sebagian kecil yang benar-benar kita amati. <strong>Statistika inferensial</strong> (inferential statistics) adalah seni menarik kesimpulan tentang populasi dari sampel — dan jujur tentang seberapa tidak pastinya kesimpulan itu.</p>
      <p><strong>Kepribadian konsep ini:</strong> sampel itu seperti mencicipi satu sendok sup untuk menilai sepanci besar. Kalau supnya diaduk rata (acak), satu sendok cukup. Kalau belum diaduk dan kamu mencicipi dari permukaan saja (bias), kesimpulanmu salah — tidak peduli berapa sendok kamu cicipi.</p>
      <p><strong>Kapan memakai:</strong> setiap kali mengukur seluruh populasi mustahil atau terlalu mahal — survei kepuasan, polling, uji kualitas produksi, A/B testing. Hampir semua analisis bisnis adalah inferensi dari sampel.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kualitas sampel ditentukan oleh <strong>cara mengambil</strong>, bukan <strong>jumlah</strong>. Sampel acak 1.000 orang mewakili 270 juta penduduk Indonesia untuk polling — <em>asalkan</em> setiap penduduk punya peluang terpilih yang sama. Inilah mengapa lembaga survei kredibel bisa tepat dengan sampel &ldquo;kecil&rdquo;.</p>
      </div>

      <h2 id="bias">Bias: Empat Cara Sampel Menyesatkanmu</h2>
      <p><strong>Definisi.</strong> <strong>Bias</strong> adalah kesalahan sistematis — sampel secara konsisten menyimpang ke satu arah, bukan sekadar berfluktuasi acak. Lawan dari bias adalah <strong>acak</strong> (random): kesalahan yang arahnya tidak menentu dan rata-ratanya nol.</p>

      <h3>1. Bias seleksi (selection bias) — &ldquo;Siapa yang kepilih?&rdquo;</h3>
      <p>Cara pengambilan sampel membuat kelompok tertentu terlewat. <em>Literary Digest</em> adalah contoh klasik. Contoh modern: survei kepuasan lewat aplikasi hanya menangkap pengguna yang masih install aplikasinya — yang sudah kecewa dan uninstall tidak bersuara.</p>

      <h3>2. Bias survivorship — &ldquo;Yang gagal tidak bercerita&rdquo;</h3>
      <p>Kita hanya mengamati yang &ldquo;selamat&rdquo;. Contoh paling elegan: Perang Dunia II, insinyur militer memetakan lubang peluru di pesawat yang <strong>kembali</strong> dari misi dan ingin melapisi bagian yang paling banyak lubangnya. Abraham Wald membalik logikanya: lubang di pesawat yang kembali menunjukkan bagian yang <strong>tahan</strong> ditembak — pesawat yang tertembak di bagian <em>lain</em> tidak pernah kembali. Lapisi bagian yang <em>bersih</em> dari lubang.</p>
      <p>Versi bisnisnya: menganalisis &ldquo;strategi sukses 10 startup unicorn&rdquo; tanpa melihat 1.000 startup gagal dengan strategi sama — resep survivorship bias.</p>

      <h3>3. Bias nonrespons (nonresponse bias) — &ldquo;Yang diam beda pendapat&rdquo;</h3>
      <p>Orang yang tidak menjawab survei berbeda sistematis dari yang menjawab. Survei gaji: yang gajinya kecil cenderung tidak mengisi. Hasil survei lalu terlihat lebih tinggi dari kenyataan.</p>

      <h3>4. Convenience sampling — &ldquo;Yang gampang saja&rdquo;</h3>
      <p>Mengambil siapa saja yang mudah dijangkau: survei di mal, polling di media sosial sendiri, bertanya ke teman sekantor. Cepat, murah, dan hampir selalu bias.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin besar sampel, makin hilang biasnya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ukuran sampel hanya mengecilkan <strong>kesalahan acak</strong> (random error), bukan <strong>bias</strong>. Survei bias dengan 2,4 juta responden hanya menghasilkan estimasi bias yang sangat presisi — presisi mengukur kesalahan yang salah. Rumusnya: total error = bias² + variansi. Memperbesar n hanya mengecilkan suku kedua.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data saya 1 juta baris, pasti mewakili.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data besar dari sumber yang bias tetap bias (ingat <em>Literary Digest</em>). Pertanyaan yang benar bukan &ldquo;berapa banyak?&rdquo; melainkan &ldquo;bagaimana cara mengumpulkannya, dan siapa yang terlewat?&rdquo;. Data transaksi 1 juta baris mewakili <em>transaksi</em>, belum tentu mewakili <em>nasabah</em> — apalagi <em>calon nasabah</em>.</p>
      </div>

      <PlotlyChart
        data={pollData}
        title="Pemilu AS 1936: 2,4 Juta Responden vs 50 Ribu Responden (share suara Roosevelt)"
        layout={{ yaxis: { title: "Share suara Roosevelt (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = persentase suara Roosevelt menurut masing-masing sumber. Bandingkan batang survei dengan batang hijau (hasil aktual).</p>
        <p><strong>Interpretasi:</strong> survei 2,4 juta responden meleset 19 poin (43% vs 62%), sementara survei 50 ribu responden hanya meleset 6 poin. Jumlah bukan segalanya — <strong>keterwakilan</strong> (representativeness) mengalahkan ukuran. Inilah visual dari &ldquo;sampel besar tapi bias&rdquo;.</p>
      </div>

      <h2 id="distribusi">Distribusi Sampling &amp; Teorema Limit Pusat</h2>
      <p><strong>Definisi.</strong> <strong>Distribusi sampling</strong> (sampling distribution) adalah distribusi dari suatu statistik (misal mean) jika kita mengulang pengambilan sampel berkali-kali. Ini BUKAN distribusi datanya — ini distribusi dari <em>rata-rata</em> sampel-sampel tersebut.</p>
      <p><strong>Teorema Limit Pusat</strong> (Central Limit Theorem, CLT) adalah hasil terpenting dalam statistika: untuk sampel acak berukuran <Tex math={String.raw`n`} /> cukup besar, distribusi sampling dari mean <strong>mendekati normal</strong> — <em>tidak peduli</em> seperti apa bentuk distribusi populasinya. Populasi boleh miring parah; rata-rata dari sampel-sampelnya tetap membentuk lonceng.</p>
      <Tex math={String.raw`\bar{x} \;\dot{\sim}\; \mathcal{N}\left(\mu,\; \frac{\sigma^2}{n}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\bar{x}`} />: mean sampel (statistik yang kita hitung dari data)</li>
        <li><Tex math={String.raw`\dot{\sim}`} />: &ldquo;kurang-lebih berdistribusi sebagai&rdquo; (aproksimasi, bukan persis)</li>
        <li><Tex math={String.raw`\mathcal{N}`} />: distribusi normal</li>
        <li><Tex math={String.raw`\mu`} />: mean populasi yang sebenarnya (tidak kita ketahui — inilah yang diestimasi)</li>
        <li><Tex math={String.raw`\sigma^2 / n`} />: variansi dari distribusi sampling — mengecil seiring <Tex math={String.raw`n`} /> membesar</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: CLT beraksi</summary>
        <p>Populasi waktu tunggu layanan: mean <Tex math={String.raw`\mu = 15`} /> menit, <Tex math={String.raw`\sigma = 8`} /> menit, distribusi miring kanan (banyak yang cepat, sedikit yang lama sekali).</p>
        <p><strong>Langkah 1</strong> — ambil sampel <Tex math={String.raw`n = 100`} />. Mean sampel kita sebut <Tex math={String.raw`\bar{x}`} />.<br />
        <strong>Langkah 2</strong> — menurut CLT, <Tex math={String.raw`\bar{x}`} /> kurang-lebih normal dengan mean 15 dan simpangan baku <Tex math={String.raw`8/\sqrt{100} = 0{,}8`} />.<br />
        <strong>Langkah 3</strong> — artinya 95% dari mean-mean sampel akan jatuh dalam <Tex math={String.raw`15 \pm 1{,}96 \times 0{,}8`} />, yaitu antara 13,4 dan 16,6 menit.</p>
        <p>Perhatikan: kita tidak pernah berasumsi data aslinya normal. Yang normal adalah <strong>distribusi dari mean-nya</strong>. Itulah keajaiban CLT.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> CLT adalah &ldquo;mesin pembuat normalitas&rdquo;. Rata-rata meredam keanehan individu: satu pelanggan menunggu 3 jam tidak menggoyang mean dari 100 orang. Makin besar <Tex math={String.raw`n`} />, makin kuat redamannya — itulah mengapa kurva distribusi sampling menyempit. Aturan praktis: <Tex math={String.raw`n \geq 30`} /> biasanya cukup untuk aproksimasi normal yang layak (untuk data yang tidak terlalu ekstrem).</p>
      </div>

      <h2 id="se">Standard Error — Harga Ketidakpastian</h2>
      <p><strong>Definisi.</strong> <strong>Standard error</strong> (SE, galat baku) adalah simpangan baku dari <em>distribusi sampling</em> — ukuran seberapa jauh estimasi sampel kita biasanya meleset dari nilai populasi yang sebenarnya.</p>
      <p>Untuk mean sampel:</p>
      <Tex math={String.raw`SE(\bar{x}) = \frac{\sigma}{\sqrt{n}} \approx \frac{s}{\sqrt{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`SE(\bar{x})`} />: standard error dari mean sampel — &ldquo;rata-rata kemelesetan&rdquo; estimasi kita</li>
        <li><Tex math={String.raw`\sigma`} />: simpangan baku populasi (diganti <Tex math={String.raw`s`} />, simpangan baku sampel, karena <Tex math={String.raw`\sigma`} /> tak diketahui)</li>
        <li><Tex math={String.raw`n`} />: ukuran sampel</li>
        <li><Tex math={String.raw`\sqrt{n}`} />: akar kuadrat — sumber dari &ldquo;hukum akar kuadrat&rdquo;</li>
      </ul>
      <p>Untuk proporsi sampel (misal % nasabah puas):</p>
      <Tex math={String.raw`SE(\hat{p}) = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\hat{p}`} /> (&ldquo;p-topi&rdquo;) adalah proporsi yang teramati di sampel, <Tex math={String.raw`n`} /> ukuran sampel. SE terbesar saat <Tex math={String.raw`\hat{p} = 0{,}5`} /> (ketidakpastian maksimal), mengecil mendekati 0 atau 1.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: SE dalam polling</summary>
        <p>Survei <Tex math={String.raw`n = 1.067`} /> responden, 52% mendukung kandidat A (<Tex math={String.raw`\hat{p} = 0{,}52`} />).</p>
        <p><strong>Langkah 1</strong> — hitung SE: <Tex math={String.raw`SE = \sqrt{0{,}52 \times 0{,}48 / 1067} = \sqrt{0{,}000234} \approx 0{,}0153`} /> (1,53 poin).<br />
        <strong>Langkah 2</strong> — margin of error 95% ≈ <Tex math={String.raw`1{,}96 \times SE \approx 3`} /> poin.<br />
        <strong>Langkah 3</strong> — laporan jujur: &ldquo;52% ± 3 poin&rdquo;, bukan &ldquo;52% tepat&rdquo;.</p>
        <p>Angka &ldquo;±3%&rdquo; yang selalu muncul di berita polling adalah <Tex math={String.raw`1{,}96 \times SE`} /> — sekarang kamu tahu asalnya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Standard error = standar deviasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> standar deviasi (<Tex math={String.raw`s`} />) mengukur sebaran <strong>data individu</strong>; standard error (<Tex math={String.raw`s/\sqrt{n}`} />) mengukur sebaran <strong>estimasi mean</strong>. SD tidak mengecil saat n bertambah (data tetap seberagam itu), tapi SE mengecil — estimasi kita makin presisi. Mencampur keduanya adalah kesalahan klasik di laporan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci — hukum akar kuadrat:</strong> untuk <strong>membelah dua</strong> standard error, kamu butuh <strong>4× sampel</strong>. Untuk menekan SE jadi sepertiga, butuh 9× sampel. Presisi punya <em>diminishing returns</em> yang brutal — inilah alasan survei nasional &ldquo;berhenti&rdquo; di ~1.000–2.000 responden: menambah 10.000 responden lagi hampir tidak mengubah ±3% menjadi ±2,9%.</p>
      </div>

      <PlotlyChart
        data={samplingDistData}
        title="Distribusi Sampling Mean Menyempit saat n Membesar (μ=15, σ=8)"
        layout={{ xaxis: { title: "Mean sampel (menit)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai mean sampel yang mungkin; tinggi kurva = seberapa sering mean itu muncul jika kita mengulang sampling. Tiga kurva = tiga ukuran sampel.</p>
        <p><strong>Interpretasi:</strong> kurva n=1000 jauh lebih ramping dan tinggi daripada n=10 — mean-mean sampelnya &ldquo;menumpuk&rdquo; di dekat nilai benar 15. Inilah CLT + hukum akar kuadrat dalam bentuk visual: sampel besar → estimasi lebih presisi. Perhatikan juga bentuknya yang lonceng meski populasinya miring.</p>
      </div>

      <PlotlyChart
        data={moeData}
        title="Margin of Error 95% vs Ukuran Sampel (p = 0,5)"
        layout={{ xaxis: { title: "Ukuran sampel (n)" }, yaxis: { title: "Margin of error (± poin %)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = ukuran sampel, vertikal = margin of error polling (± poin persentase) pada tingkat kepercayaan 95%.</p>
        <p><strong>Interpretasi:</strong> kurva turun curam di awal lalu melandai — dari n=100 (±9,8) ke n=400 (±4,9) lumayan, tapi dari n=1600 (±2,45) ke n=6400 (±1,22) butuh 4.800 responden tambahan hanya untuk menghemat 1,2 poin. <strong>Keputusan bisnis:</strong> berhentilah menambah sampel saat biaya tambahan tidak lagi membeli presisi yang berarti.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Bias sampling = &ldquo;bertanya pada orang yang salah&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Literary Digest 1936 — 2,4 juta responden, salah total</summary>
              <p>Majalah Literary Digest mensurvei 2,4 juta orang: Landon menang telak atas Roosevelt. Hasil pemilu: Roosevelt menang telak. Apa yang salah? (n = 2,4 juta!)</p>
              <p><strong>Langkah 1</strong> — sumber sampel: daftar pelanggan telepon + pemilik mobil (1936 = orang kaya!).<br />
              <strong>Langkah 2</strong> — Depresi Besar: orang kaya condong ke Landon (Republik); mayoritas pemilih (miskin) ke Roosevelt.<br />
              <strong>Langkah 3</strong> — n = 2,4 juta hanya memperkecil <em>varians</em> — biasnya tetap: estimasi → 57% Landon vs realita 38%.<br />
              <strong>Langkah 4</strong> — bandingkan: Gallup dengan n = 50.000 <em>acak</em> memprediksi Roosevelt benar!</p>
              <p>Pelajaran: <strong>bias tidak hilang dengan n</strong> — ia justru makin &ldquo;presisi salah&rdquo;. 2,4 juta × bias = keyakinan palsu yang mahal. Kualitas sampling &gt; kuantitas.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Pesawat yang kembali — survivorship bias</summary>
              <p>PD II: pesawat kembali penuh lubang peluru di sayap &amp; badan — hampir tidak ada di mesin &amp; kokpit. Di mana armor ditambah?</p>
              <p><strong>Langkah 1</strong> — intuisi salah: &ldquo;tambal yang berlubang&rdquo; (sayap/badan).<br />
              <strong>Langkah 2</strong> — Abraham Wald: data hanya dari pesawat yang <em>kembali</em>. Lubang di sayap = pesawat <em>selamat</em> meski tertembak di sana.<br />
              <strong>Langkah 3</strong> — daerah <em>tanpa</em> lubang (mesin, kokpit) = pesawat yang tertembak di sana <em>tidak kembali</em> — tidak ada di data!<br />
              <strong>Langkah 4</strong> — jawaban: armor di mesin &amp; kokpit.</p>
              <p>Pelajaran: tanyakan selalu &ldquo;<strong>siapa yang tidak ada di dataku?</strong>&rdquo; — yang hilang sering lebih informatif dari yang ada. Berlaku untuk: review produk (yang kecewa diam?), data kredit (yang ditolak tak terlacak!), backtest (strategi mati dihapus?).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Saksikan Distribusi Sampling Terbentuk</h2>
      <p>Kode ini mengambil ribuan sampel dari populasi yang <strong>miring</strong>, lalu membandingkan standard error empiris dengan rumus teori <Tex math={String.raw`\sigma/\sqrt{n}`} />. Ubah-ubah n dan saksikan rumusnya &ldquo;terbukti&rdquo; sendiri.</p>
      <PyodideLab
        title="Lab 1 — Distribusi Sampling dari Populasi Miring (Live Python)"
        hint="⚡ Live Python — edit langsung, klik Jalankan. Coba: ganti daftar n jadi [5, 20, 80, 320]. Pada n berapa SE empiris mulai cocok dengan teori?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Hukum Akar Kuadrat (Presisi Itu Mahal)</h2>
      <p>Simulasi polling: proporsi sebenarnya 52%. Lihat bagaimana margin of error menyusut (lambat!) saat n dilipatgandakan.</p>
      <PyodideLab
        title="Lab 2 — Margin of Error vs Ukuran Sampel (Live Python)"
        hint="Coba: ubah p jadi 0.05 (proporsi kecil, misal tingkat fraud). Perhatikan SE mengecil — ketidakpastian maksimal memang di p=0,5."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Metode Sampling</h2>
      <p>Cara mengambil sampel menentukan segalanya. Lima skenario di bawah — kenali polanya, pilih metodenya.</p>

      <div className="decision-card">
        <h3>1. Setiap anggota populasi terdaftar &amp; terjangkau → <strong>Acak sederhana</strong> (simple random sampling)</h3>
        <p><strong>Kondisi:</strong> kamu punya daftar lengkap (frame) — misal database 50.000 nasabah dengan nomor urut. Setiap nasabah punya peluang terpilih yang persis sama.</p>
        <p><strong>Kenapa:</strong> tidak bias secara teori; rumus SE/interval kepercayaan baku berlaku apa adanya.</p>
        <p><strong>Contoh nyata:</strong> audit memilih 200 transaksi secara acak dari seluruh transaksi bulan ini untuk diperiksa manual.</p>
      </div>

      <div className="decision-card">
        <h3>2. Populasi terbagi dalam kelompok penting yang kecil → <strong>Stratifikasi</strong> (stratified sampling)</h3>
        <p><strong>Kondisi:</strong> ada subkelompok yang perilakunya beda jauh dan jumlahnya kecil — misal nasabah korporat hanya 2% tapi menyumbang 40% dana. Sampel acak murni bisa tidak menangkap satu pun dari mereka.</p>
        <p><strong>Kenapa:</strong> ambil sampel acak <em>di dalam tiap strata</em> (misal 100 korporat + 900 ritel) — menjamin keterwakilan tiap kelompok, bahkan bisa <em>lebih presisi</em> dari acak sederhana.</p>
        <p><strong>Contoh nyata:</strong> survei kepuasan yang memisahkan nasabah prioritas, ritel, dan UMKM sebelum sampling.</p>
      </div>

      <div className="decision-card">
        <h3>3. Populasi tersebar geografis, daftar lengkap tidak ada → <strong>Klaster</strong> (cluster sampling)</h3>
        <p><strong>Kondisi:</strong> mustahil mendata semua individu — misal survei UMKM se-Indonesia. Tapi kamu bisa memilih 20 kota secara acak, lalu survei semua/di dalam kota terpilih.</p>
        <p><strong>Kenapa:</strong> jauh lebih murah dan operasional. Harga: presisi lebih rendah dari acak sederhana untuk n yang sama (anggota satu klaster cenderung mirip).</p>
        <p><strong>Contoh nyata:</strong> survei harga pasar: pilih 30 pasar tradisional secara acak, catat harga di tiap pasar.</p>
      </div>

      <div className="decision-card">
        <h3>4. Data datang sebagai aliran berurutan → <strong>Sistematis</strong> (systematic sampling)</h3>
        <p><strong>Kondisi:</strong> transaksi masuk berurutan; kamu ambil setiap transaksi ke-100. Praktis untuk audit dan kontrol kualitas.</p>
        <p><strong>Kenapa:</strong> sederhana dan tersebar merata sepanjang periode. <strong>Waspada:</strong> jika ada pola periodik yang kebetulan selaras dengan interval (misal setiap ke-100 selalu transaksi batch malam), hasilnya bias — cek dulu polanya.</p>
        <p><strong>Contoh nyata:</strong> QC pabrik memeriksa setiap kardus ke-50 dari conveyor.</p>
      </div>

      <div className="decision-card">
        <h3>5. Butuh cepat/murah, presisi bukan prioritas → <strong>Convenience</strong> (dengan disclaimer!)</h3>
        <p><strong>Kondisi:</strong> riset awal, eksplorasi, atau uji coba kuesioner — bukan untuk angka resmi.</p>
        <p><strong>Kenapa (dengan syarat):</strong> boleh dipakai untuk <em>menemukan</em> hipotesis, tidak untuk <em>membuktikan</em>. Wajib tulis batasannya: &ldquo;sampel convenience, tidak dapat digeneralisasi&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> bertanya ke 20 teman soal fitur baru sebelum survei besar — untuk mempertajam pertanyaan, bukan untuk angka.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tanya dulu: siapa yang terlewat?</strong> — kalau ada kelompok yang peluang terpilihnya nol, sampelmu bias.</li>
          <li>Ada kelompok kecil tapi penting → <strong>stratifikasi</strong>.</li>
          <li>Tidak ada daftar lengkap → <strong>klaster</strong>.</li>
          <li>Laporkan selalu: metode sampling + n + margin of error. Tanpa ketiganya, angka tidak bisa dinilai.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Survei Kepuasan yang Menipu Direksi</h2>
      <div className="callout">
        <p>Bank &ldquo;MajuBank&rdquo; mengirim survei kepuasan via push notification aplikasi. Hasil: <strong>8.000 responden, skor rata-rata 4,6/5</strong> — direksi puas. Namun di kuartal yang sama: komplain ke call center <strong>naik 40%</strong>, dan 12.000 nasabah menutup rekening (naik 25% dari kuartal lalu).</p>
        <p>Data tambahan: aplikasi hanya terinstall di 35% nasabah; rating aplikasi di Play Store turun dari 4,4 ke 3,1 dalam 6 bulan.</p>
        <p><strong>Pertanyaan:</strong> (a) Jenis bias apa yang terjadi? (b) Berapa SE dari mean 4,6 jika SD = 0,8 — dan apakah SE kecil membuat 4,6 bisa dipercaya? (c) Rancang ulang surveinya dalam 3 langkah.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Bias seleksi ganda:</strong> hanya 35% nasabah punya aplikasi (frame tidak lengkap), dan di antaranya hanya yang cukup peduli/puas yang merespons push notif (<strong>nonresponse bias</strong>). Yang kecewa berat sudah uninstall — <strong>survivorship bias</strong> versi digital. Sampel mewakili &ldquo;pengguna app yang masih betah&rdquo;, bukan &ldquo;nasabah&rdquo;.</p>
          <p>(b) <Tex math={String.raw`SE = 0{,}8/\sqrt{8000} \approx 0{,}009`} /> — sangat kecil! Tapi SE hanya mengukur <strong>kesalahan acak</strong>. Bias seleksinya bisa 0,5–1,0 poin — <strong>100× lebih besar</strong> dari SE. Inilah &ldquo;presisi mengukur kesalahan yang salah&rdquo;: 4,600 ± 0,009 terlihat ilmiah padahal meleset jauh dari kepuasan nasabah sebenarnya.</p>
          <p>(c) <strong>Langkah 1:</strong> ambil frame dari database nasabah (bukan pengguna app). <strong>Langkah 2:</strong> stratified sampling — pisahkan segmen (misal yang komplain 90 hari terakhir wajib terwakili). <strong>Langkah 3:</strong> ukur nonresponse — bandingkan karakteristik responden vs nonresponden; jika yang tidak menjawab lebih banyak menutup rekening, laporkan sebagai temuan, bukan sekadar &ldquo;missing&rdquo;.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Survei kepuasan via aplikasi: responden 90% &ldquo;puas&rdquo;. Sebutkan 2 bias yang mungkin dan arahnya.</li>
              <li>Studi &ldquo;rata-rata return reksa dana 5 tahun&rdquo; memakai dana yang <em>masih ada</em> hari ini. Bias apa? Arahnya (over/under-estimasi)?</li>
              <li>Bagaimana desain sampling yang benar untuk &ldquo;PD portofolio&rdquo; jika data hanya dari nasabah yang <em>diterima</em>? (Petunjuk: reject inference!)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) <strong>Non-response bias</strong>: yang kecewa mungkin malas mengisi (atau sebaliknya yang marah paling vokal!) — arah tidak pasti tanpa data. (b) <strong>Selection bias</strong>: hanya pengguna aplikasi (bukan yang uninstall karena kecewa!). Keduanya cenderung <em>over-estimasi</em> kepuasan.</p>
              <p><strong>2.</strong> <strong>Survivorship bias</strong> — dana buruk dilikuidasi/digabung (hilang dari data) → rata-rata <em>over-estimasi</em> return industri. Angka &ldquo;rata-rata&rdquo; hanya dari yang selamat.</p>
              <p><strong>3.</strong> Data accepted-only = sampel <em>terseleksi</em> (yang berisiko ditolak tak teramati). Solusi: <strong>reject inference</strong> — estimasi PD untuk yang ditolak via model/ekstrapolasi, atau <em>through-the-door</em> sampling (terima sampel acak dari yang ditolak untuk observasi). Tanpa ini, PD <em>under-estimasi</em> risiko populasi pelamar.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Literary Digest (2,4 jt responden) salah total, Gallup (50 rb) benar. Pelajaran utamanya?"
        options={[
          "Survei besar selalu lebih buruk dari survei kecil",
          "Keterwakilan (cara sampling) mengalahkan ukuran sampel — sampel raksasa tapi bias tetap bias",
          "Gallup beruntung saja",
          "Pemilu 1936 tidak bisa diprediksi",
        ]}
        correct={1}
        explanation="Benar. Literary Digest mengambil dari daftar pemilik telepon/mobil (orang kaya) — bias seleksi. Ukuran sampel hanya mengecilkan random error, tidak menghapus bias. 2,4 juta × bias = estimasi bias yang sangat presisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Insinyur ingin melapisi bagian pesawat yang paling banyak lubang pelurunya (dari pesawat yang kembali). Menurut logika Abraham Wald, seharusnya?"
        options={[
          "Lapisi bagian berlubang paling banyak — data tidak berbohong",
          "Lapisi bagian yang bersih dari lubang — pesawat tertembak di sana tidak pernah kembali (survivorship bias)",
          "Lapisi seluruh pesawat",
          "Tidak perlu dilapisi, lubang tidak masalah",
        ]}
        correct={1}
        explanation="Benar. Data hanya dari pesawat yang selamat — lubang di sana justru menandai bagian yang tahan ditembak. Bagian tanpa lubang pada pesawat selamat = bagian yang fatal jika tertembak. Klasik survivorship bias."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. SD waktu tunggu = 12 menit. Berapa n agar SE mean ≤ 1 menit?"
        options={[
          "n = 12",
          "n = 36",
          "n = 144",
          "n = 1.728",
        ]}
        correct={2}
        explanation="Benar: SE = s/√n ≤ 1 → √n ≥ 12 → n ≥ 144. Ini hukum akar kuadrat beraksi: SD 12 butuh 144 sampel untuk presisi ±1."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Survei gaji via kuesioner online sukarela menghasilkan rata-rata Rp14 jt, padahal data pajak menunjukkan median Rp7 jt. Penjelasan paling mungkin?"
        options={[
          "Responden berbohong semua",
          "Nonresponse bias — yang gajinya kecil cenderung tidak mengisi, sampel miring ke atas",
          "Sampel terlalu besar",
          "Rata-rata selalu lebih tinggi dari median",
        ]}
        correct={1}
        explanation="Benar. Partisipasi sukarela membuat yang tidak nyaman (gaji kecil) absen secara sistematis — bukan acak. Hasilnya bias ke atas. Ini bukan soal n, tapi soal siapa yang menjawab."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kamu ingin survei UMKM se-Indonesia tapi tidak punya daftar lengkapnya. Metode paling operasional?"
        options={[
          "Acak sederhana dari daftar yang tidak ada",
          "Cluster sampling — pilih kota/kabupaten acak, lalu survei UMKM di dalamnya",
          "Tanya UMKM di sekitarmu saja",
          "Batalkan survei",
        ]}
        correct={1}
        explanation="Benar. Tanpa sampling frame, cluster sampling adalah jalan keluar standar: acak di level wilayah (yang daftarnya ada), lalu sensus/sampel di dalamnya. Harganya: presisi per n lebih rendah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Manakah pernyataan yang BENAR tentang CLT?"
        options={[
          "CLT mengatakan data populasi menjadi normal jika n besar",
          "CLT mengatakan distribusi sampling dari mean mendekati normal saat n besar, apapun bentuk populasinya",
          "CLT hanya berlaku jika populasi sudah normal",
          "CLT menghilangkan bias sampling",
        ]}
        correct={1}
        explanation="Benar. Yang menjadi normal adalah distribusi dari mean-mean sampel, bukan datanya. Data populasi tetap boleh miring. Dan CLT tidak memperbaiki bias — sampel bias dengan n besar tetap bias."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Keterwakilan &gt; ukuran.</strong> Sampel besar tapi bias = estimasi bias yang presisi (Literary Digest 1936).</li>
          <li><strong>Empat bias:</strong> seleksi (siapa kepilih), survivorship (yang gagal tak bercerita), nonrespons (yang diam beda), convenience (yang gampang saja).</li>
          <li><strong>CLT:</strong> distribusi sampling mean → normal saat n besar, apapun bentuk populasi: <Tex math={String.raw`\bar{x} \dot{\sim} \mathcal{N}(\mu, \sigma^2/n)`} />.</li>
          <li><strong>Standard error:</strong> <Tex math={String.raw`SE = s/\sqrt{n}`} /> untuk mean; <Tex math={String.raw`SE = \sqrt{\hat{p}(1-\hat{p})/n}`} /> untuk proporsi. Beda dari SD!</li>
          <li><strong>Hukum akar kuadrat:</strong> belah dua SE butuh 4× sampel — presisi punya diminishing returns.</li>
          <li><strong>Metode:</strong> acak sederhana (ada frame) → stratifikasi (kelompok kecil penting) → klaster (tanpa frame) → sistematis (aliran data).</li>
          <li><strong>Jangan:</strong> mengklaim generalisasi dari convenience sample; melaporkan mean tanpa SE/metode sampling.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a19-eda-end-to-end" className="btn btn-secondary btn-sm">← A1.9</Link>
        <Link href="/learn/a22-estimasi-mle" className="btn btn-primary btn-sm">Next: A2.2 →</Link>
      </div>
    </div>
  );
}
