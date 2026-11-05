import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import StatsCalculator from "@/components/StatsCalculator";
import Link from "next/link";


export default function A15Page() {
  const boxData = [
    {
      y: [8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45],
      type: "box",
      name: "Gaji (juta Rp)",
      marker: { color: "#2a7de1" },
      boxpoints: "outliers",
    },
  ];

  const boxSkew = [
    {
      y: [5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 12, 15, 20, 35, 60],
      type: "box",
      name: "DPD (hari)",
      marker: { color: "#e8a838" },
      boxpoints: "outliers",
    },
  ];

  const zScoreDemo = [
    {
      x: ["Nilai 55", "Nilai 65", "Nilai 85"],
      y: [0.5, 1.5, 3.5],
      type: "bar",
      marker: { color: ["#3d9a50", "#e8a838", "#d33f2e"] },
      text: ["z = 0,5 (normal)", "z = 1,5 (normal)", "z = 3,5 (OUTLIER)"],
      textposition: "auto",
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.5 — Statistika Deskriptif</span>
        <h1 className="display-title">Outlier: Dibuang, atau Justru Diselidiki?</h1>
        <p className="lead">
          Kuantil, boxplot, dan tiga metode deteksi anomali — dari "data kotor" hingga sinyal fraud bernilai miliaran.
        </p>
        <p className="meta">≈50 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Pipeline Pembersih yang Menghapus Bukti</a></li>
          <li><a href="#kuantil">Kuantil &amp; Persentil — Si Penanda Posisi</a></li>
          <li><a href="#boxplot">Boxplot — Foto Lima Angka</a></li>
          <li><a href="#lab1">🔬 Lab 1: Batas IQR — Ubah Pengalinya</a></li>
          <li><a href="#metode">Tiga Metode Deteksi Outlier</a></li>
          <li><a href="#lab2">🔬 Lab 2: Masking Effect — Outlier yang Bersembunyi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metode Mana untuk Datamu</a></li>
          <li><a href="#case">📋 Mini-Case: 37 Transaksi Flag di Bank Digital</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkuman">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung Q1, Q2, Q3 dan persentil dari data mentah — dan mengartikan "persentil ke-90" tanpa tertukar dengan nilai 90.</li>
          <li>Membaca boxplot (kotak, whisker, titik outlier) dan mendiagnosis kemiringan distribusi dari posisi median di dalam kotak.</li>
          <li>Menerapkan tiga metode deteksi outlier (z-score, IQR, MAD) lengkap dengan contoh hitungan, dan tahu kapan masing-masing gagal.</li>
          <li>Menjelaskan <em>masking effect</em> dan memilih penanganan outlier yang defensible: hapus, winsorize, transform, atau biarkan.</li>
          <li>Membedakan outlier-error vs outlier-sinyal dalam konteks fraud dan risiko — dan tahu kapan harus eskalasi, bukan menghapus.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Pipeline Pembersih yang Menghapus Bukti</h2>
      <div className="story">
        <p>Pukul 02.14, Jumat dini hari. Rani, analis fraud di sebuah bank digital, menatap dashboard yang terlalu bersih untuk jadi kenyataan: <em>zero anomaly</em> selama 90 hari berturut-turut. Padahal tim collection melaporkan lonjakan gagal bayar kartu kredit.</p>
        <p>Ia telusuri pipeline data. Setiap malam, sebuah skrip "pembersihan" otomatis memotong semua transaksi di luar batas 1,5&times;IQR — 37 transaksi per hari, rata-rata — sebelum data masuk ke model deteksi fraud. Rapi. Terdokumentasi. Disetujui semua orang.</p>
        <p>Tiga bulan kemudian audit forensik menemukan kerugian <strong>Rp 4,2 miliar</strong> dari skema <em>money-mule</em>. Pola transaksinya? Persis di titik-titik yang dipotong skrip itu setiap malam. <strong>Pipeline "pembersih data" yang dibanggakan itu ternyata mesin penghapus bukti.</strong></p>
        <p>Outlier bukan perintah hapus — outlier adalah <em>undangan investigasi</em>. Pelajaran inilah yang akan kita bedah sampai ke rumusnya.</p>
      </div>

      <h2 id="kuantil">Kuantil &amp; Persentil — Si Penanda Posisi</h2>
      <p><strong>Definisi.</strong> <strong>Kuantil</strong> membagi data (yang sudah diurutkan) menjadi bagian-bagian sama besar. Kuantil adalah GPS-nya data: ia tidak peduli seberapa besar nilaimu, hanya peduli <em>posisimu</em> dalam antrean.</p>
      <ul>
        <li><strong>Kuartil:</strong> 4 bagian — Q1 = 25%, Q2 = median = 50%, Q3 = 75%</li>
        <li><strong>Desil:</strong> 10 bagian</li>
        <li><strong>Persentil:</strong> 100 bagian</li>
      </ul>
      <p><strong>Contoh:</strong> Skor 90 = persentil 95 → nilaimu lebih tinggi dari 95% peserta. Bukan "nilainya 95".</p>

      <p><strong>Rumus posisi persentil ke-p:</strong></p>
      <Tex math={String.raw`\text{Posisi} = \frac{p}{100} \times (n+1)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`p`} />: persentil yang dicari (misal 90 untuk persentil ke-90)</li>
        <li><Tex math={String.raw`n`} />: banyaknya data</li>
        <li><Tex math={String.raw`n+1`} />: koreksi agar posisi tidak "mentok" di ujung — rumus ini merentang posisi dari 1 sampai <Tex math={String.raw`n`} /></li>
        <li>Hasilnya adalah <strong>posisi</strong> (bisa desimal → interpolasi antara dua data), bukan nilainya langsung</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: persentil ke-90 dari 10 gaji (klik untuk buka)</summary>
        <p>Data gaji (juta, sudah urut): 8, 9, 10, 10, 11, 11, 12, 12, 13, 14. <Tex math={String.raw`n = 10`} />.</p>
        <p><strong>Langkah 1</strong> — posisi: <Tex math={String.raw`\frac{90}{100} \times 11 = 9{,}9`} />.</p>
        <p><strong>Langkah 2</strong> — posisi 9,9 berarti 90% jalan dari data ke-9 (13) ke data ke-10 (14): 13 + 0,9 &times; (14 − 13) = <strong>13,9</strong>.</p>
        <p>Persentil ke-90 = <strong>Rp 13,9 juta</strong>: 90% gaji berada di bawah angka ini. Perhatikan — angkanya bukan salah satu data asli. Itu wajar: persentil adalah <em>posisi</em>, bukan <em>anggota</em>.</p>
      </details>

      <StatsCalculator defaultValues="8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45" title="🧮 Kalkulator Kuantil Live — ubah angkanya, lihat Q1/median/Q3 bergerak" />

      <p><strong>Kepribadian kuantil:</strong> ia demokratis dalam arti yang berbeda dari mean. Mean mendengar semua nilai (termasuk yang ekstrem); kuantil hanya bertanya "kamu nomor berapa dalam antrean?" Karena itu satu gaji CEO Rp 500 juta tidak menggeser Q1/Q3 sama sekali — ia tetap "antrean terakhir", berapapun nilainya.</p>

      <p><strong>Kapan memakai:</strong> benchmark dan ambang batas — "95% transaksi selesai &lt; 2 detik" (SLA), persentil skor kredit untuk segmentasi risiko, batas <em>cutoff</em> persetujuan.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Persentil ke-90 berarti nilainya 90."</p>
        <p><strong>Yang benar:</strong> persentil adalah posisi relatif, bukan nilai absolut. Persentil ke-90 dari gaji bisa Rp 13,9 juta, bisa Rp 130 juta — tergantung datanya. Yang dijamin hanya: 90% data berada di bawahnya. Tertukar keduanya adalah kesalahan klasik membaca laporan benchmark.</p>
      </div>

      <h2 id="boxplot">Boxplot — Foto Lima Angka</h2>
      <p><strong>Definisi.</strong> Boxplot merangkum distribusi dalam lima angka: <strong>min, Q1, median, Q3, max</strong> — plus titik-titik outlier di luar "whisker". Satu gambar, seluruh diagnosis bentuk data.</p>
      <p><strong>Rumus kunci boxplot:</strong></p>
      <Tex math={String.raw`\text{IQR} = Q_3 - Q_1`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`Q_1`} />: kuartil pertama — 25% data berada di bawahnya</li>
        <li><Tex math={String.raw`Q_3`} />: kuartil ketiga — 75% data berada di bawahnya</li>
        <li><Tex math={String.raw`\text{IQR}`} /> (<em>interquartile range</em>): rentang 50% data tengah — "kotak" pada boxplot. Ukuran sebaran yang kebal outlier.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: lima angka dari 12 gaji (klik untuk buka)</summary>
        <p>Data (juta): 8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45. <Tex math={String.raw`n = 12`} />.</p>
        <p><strong>Langkah 1</strong> — median (Q2): rata-rata data ke-6 dan ke-7 = (11 + 12) / 2 = <strong>11,5</strong>.</p>
        <p><strong>Langkah 2</strong> — Q1 = median paruh bawah (6 data pertama): rata-rata data ke-3 dan ke-4 = (10 + 10) / 2 = <strong>10</strong>.</p>
        <p><strong>Langkah 3</strong> — Q3 = median paruh atas: rata-rata data ke-9 dan ke-10 = (13 + 14) / 2 = <strong>13,5</strong>.</p>
        <p><strong>Langkah 4</strong> — IQR = 13,5 − 10 = <strong>3,5</strong>. Min = 8, max "normal" = 15, dan 45 terpisah jauh → kandidat outlier.</p>
        <p>Kotak boxplot membentang dari 10 ke 13,5, garis median di 11,5, dan titik 45 melayang sendirian di atas. Satu gambar langsung berteriak: "ada yang tidak beres di ujung kanan!"</p>
      </details>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu vertikal = nilai (juta Rp). Kotak = 50% data tengah (dari Q1 ke Q3). Garis di dalam kotak = median. Garis vertikal (whisker) = jangkauan data "normal". Titik yang melayang sendiri di luar whisker = outlier.</p>
        <PlotlyChart
          data={boxData}
          title="Boxplot Gaji — Titik di Luar Whisker = Outlier"
          layout={{ yaxis: { title: "Juta Rp" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> 11 dari 12 gaji terkompresi di kotak kecil (8–15 juta), satu titik terpisah jauh di 45 juta. Kotak yang pendek + satu titik jauh = distribusi "normal" dengan satu anomali besar — pola klasik yang harus diinvestigasi, bukan langsung dihapus.</p>
      </div>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti di atas, tapi perhatikan <em>posisi garis median di dalam kotak</em>. Median tepat di tengah kotak = simetris; median menempel ke bawah kotak = ekor panjang ke atas.</p>
        <PlotlyChart
          data={boxSkew}
          title="Boxplot Right-Skewed: Median di Bawah Tengah Kotak"
          layout={{ yaxis: { title: "Hari" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> median (garis) duduk di bawah tengah kotak, whisker atas jauh lebih panjang. Ini <strong>right skew</strong>: banyak tunggakan kecil (DPD rendah), sedikit tunggakan sangat besar. Cocok dengan pelajaran skew di A1.4 — danperingatan: pada data seperti ini, mean akan tertarik ke atas dan menipu.</p>
      </div>

      <p><strong>Kepribadian boxplot:</strong> ia seperti rontgen — tidak memberi diagnosis akhir, tapi dalam 3 detik kamu tahu di mana yang patah. Analis senior membuka boxplot <em>sebelum</em> membaca tabel statistik apa pun.</p>

      <p><strong>Kapan memakai:</strong> EDA pertama atas kolom numerik apa pun; membandingkan distribusi antar grup (boxplot berdampingan per segmen nasabah, per cabang, per bulan).</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Whisker = nilai min dan max data."</p>
        <p><strong>Yang benar:</strong> whisker berhenti di data terjauh yang masih di dalam pagar 1,5&times;IQR — bukan min/max absolut. Titik di luar pagar itulah yang digambar sebagai outlier. Jadi boxplot <em>sudah</em> mengandung keputusan deteksi outlier (dengan aturan Tukey) di dalamnya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> posisi median di dalam kotak adalah pendeteksi skew tercepat yang ada. Median menempel ke <em>bawah</em> kotak → right skew (ekor ke kanan). Menempel ke <em>atas</em> → left skew. Tepat di tengah → kira-kira simetris. Kamu tidak perlu menghitung skewness untuk kesan pertama.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Batas IQR — Ubah Pengalinya</h2>
      <PyodideLab
        title="🔬 Lab 1: Batas IQR — Ubah Pengalinya"
        hint="Ubah k (0,5 → 1,5 → 3,0). Pada k berapa titik 45 berhenti jadi outlier? Itulah bedanya 'mild' vs 'far' outlier."
        defaultCode={`import statistics as st\ngaji = [8, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 45]  # juta Rp; ubah sesukamu\nk = 1.5  # COBA UBAH: 0.5, 1.5, 3.0\nq1, med, q3 = st.quantiles(gaji, n=4)\niqr = q3 - q1\nbawah = q1 - k * iqr\natas = q3 + k * iqr\nout = [x for x in gaji if x < bawah or x > atas]\nprint("Q1 =", q1, "| median =", med, "| Q3 =", q3, "| IQR =", round(iqr, 2))\nprint("batas bawah =", round(bawah, 2), "| batas atas =", round(atas, 2))\nprint("outlier:", out, "| jumlah:", len(out), "dari", len(gaji), "data")`}
      />

      <h2 id="metode">Tiga Metode Deteksi Outlier</h2>

      <h3>Metode 1: Z-Score — Si Pengukur Jarak dalam Satuan SD</h3>
      <p><strong>Definisi.</strong> Z-score menerjemahkan "seberapa jauh" sebuah nilai menjadi satuan universal: berapa standar deviasi dari mean.</p>
      <Tex math={String.raw`z = \frac{x - \bar{x}}{s}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`x`} />: nilai data yang diperiksa</li>
        <li><Tex math={String.raw`\bar{x}`} /> ("x-bar"): mean sampel — titik acuan "pusat"</li>
        <li><Tex math={String.raw`s`} />: standar deviasi sampel — "penggaris" yang dipakai mengukur jarak</li>
        <li><Tex math={String.raw`z`} />: jarak dalam satuan SD. <Tex math={String.raw`z = 3{,}5`} /> artinya nilainya 3,5 SD di atas mean.</li>
      </ul>
      <p><strong>Aturan praktis:</strong> |z| &gt; 3 → kandidat outlier.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: z-score nilai 85 (klik untuk buka)</summary>
        <p>Diketahui mean <Tex math={String.raw`\bar{x} = 50`} />, SD <Tex math={String.raw`s = 10`} />. Periksa <Tex math={String.raw`x = 85`} />.</p>
        <p><strong>Langkah 1</strong> — selisih dari pusat: 85 − 50 = 35.</p>
        <p><strong>Langkah 2</strong> — bagi dengan "penggaris": 35 / 10 = <strong>3,5</strong>.</p>
        <p><Tex math={String.raw`z = 3{,}5 > 3`} /> → <strong>outlier</strong>. Artinya: nilai 85 sejauh 3,5 standar deviasi dari pusat — pada data normal, peluangnya di bawah 0,05%.</p>
      </details>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = tiga nilai yang diperiksa, tinggi batang = z-score-nya. Warna hijau/kuning/merah = zona aman/waspada/bahaya.</p>
        <PlotlyChart
          data={zScoreDemo}
          title="Z-Score: Seberapa Jauh dari Mean (dalam SD)?"
          layout={{ yaxis: { title: "z" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> z = 0,5 dan 1,5 masih "warga normal" (di dalam ±3). z = 3,5 menembus ambang → outlier. Tapi ingat: ambang 3 adalah konvensi, bukan hukum fisika — konteks yang menentukan.</p>
      </div>

      <p><strong>Kepribadian z-score:</strong> ia penerjemah universal. "Rp 85 juta" tidak ada artinya tanpa konteks; "z = 3,5" langsung bisa dibandingkan dengan "DPD 60 hari, z = 3,5" — dua dunia berbeda, satu bahasa yang sama.</p>

      <p><strong>Kapan memakai:</strong> data kira-kira normal dan <em>bersih</em> (belum terkontaminasi outlier) — misal skor tes terstandarisasi, error pengukuran sensor.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "|z| &gt; 3 berarti pasti outlier yang harus dibuang."</p>
        <p><strong>Yang benar:</strong> dua kesalahan sekaligus. Pertama, ambang 3 hanyalah konvensi — di data ber-n besar, nilai |z| &gt; 3 muncul secara alami. Kedua, "terdeteksi" ≠ "dibuang": z-score hanya menandai <em>kandidat</em>. Nasabah konglomerat dengan z = 4 pada transaksi bulanan mungkin 100% valid.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Kelemahan fatal Z-score — <em>masking effect</em>:</strong> mean dan SD sendiri terpengaruh outlier! Satu outlier ekstrem menggeser mean dan menggembungkan SD, sehingga outlier lain "bersembunyi" di balik z-score yang mengecil. <strong>Jangan pakai z-score untuk data yang sudah kotor</strong> — buktikan sendiri di Lab 2.</p>
      </div>

      <h3>Metode 2: IQR (Aturan Tukey) — Si Penjaga Gerbang</h3>
      <p><strong>Definisi.</strong> Tukey membangun "pagar" di sekitar kotak boxplot. Siapa pun di luar pagar = outlier. Tidak percaya pada mean — hanya pada kuartil yang kebal.</p>
      <Tex math={String.raw`\text{Batas bawah} = Q_1 - 1{,}5 \times \text{IQR}`} block />
      <Tex math={String.raw`\text{Batas atas} = Q_3 + 1{,}5 \times \text{IQR}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`Q_1, Q_3`} />: kuartil pertama dan ketiga — fondasi yang robust</li>
        <li><Tex math={String.raw`\text{IQR}`} />: lebar 50% data tengah</li>
        <li><Tex math={String.raw`1{,}5`} />: pengali konvensi Tukey — pagar selebar 1,5 kotak ke tiap arah</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Q1=40, Q3=60 (klik untuk buka)</summary>
        <p><strong>Langkah 1</strong> — IQR = 60 − 40 = <strong>20</strong>.</p>
        <p><strong>Langkah 2</strong> — batas bawah = 40 − 1,5 &times; 20 = 40 − 30 = <strong>10</strong>.</p>
        <p><strong>Langkah 3</strong> — batas atas = 60 + 1,5 &times; 20 = 60 + 30 = <strong>90</strong>.</p>
        <p>Nilai <strong>95</strong> → di atas 90 → outlier. Nilai <strong>5</strong> → di bawah 10 → outlier. Nilai 85 → aman di dalam pagar.</p>
      </details>

      <p><strong>Kepribadian IQR:</strong> penjaga gerbang yang tidak bisa disuap. Mean bisa dibeli oleh satu miliarder; Q1 dan Q3 tidak peduli seberapa ekstrem ujung data — pagar tetap di tempatnya.</p>

      <p><strong>Kapan memakai:</strong> default untuk eksplorasi cepat dan data umum. Pilihan pertama yang aman.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Angka 1,5 adalah hukum matematika."</p>
        <p><strong>Yang benar:</strong> 1,5 adalah konvensi praktis dari John Tukey (1977) — pada data normal, pagar ini menandai ~0,7% data sebagai outlier. Untuk "far out" (sangat ekstrem) dipakai 3,0. Pada data sangat miring (misal nominal transaksi), bahkan 1,5 bisa terlalu agresif dan menandai ratusan transaksi valid. Sesuaikan dengan konteks, jangan disembah.</p>
      </div>

      <h3>Metode 3: MAD — Si Paling Kebal</h3>
      <p><strong>Definisi.</strong> MAD (<em>Median Absolute Deviation</em>) mengukur sebaran dengan median — dua lapis kekebalan. Versi "modified z-score"-nya:</p>
      <Tex math={String.raw`M_i = \frac{0.6745 \times (x_i - \text{median})}{\text{MAD}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`x_i`} />: data ke-i yang diperiksa</li>
        <li><Tex math={String.raw`\text{median}`} />: median seluruh data — titik acuan yang kebal outlier</li>
        <li><Tex math={String.raw`\text{MAD}`} />: median dari <em>selisih absolut tiap data terhadap median</em> — "SD versi kebal"</li>
        <li><Tex math={String.raw`0.6745`} />: konstanta skala agar MAD setara SD pada data normal (kuartil ke-75 dari distribusi normal baku)</li>
        <li><Tex math={String.raw`M_i`} />: skor seperti z-score, tapi kebal. Aturan: |M| &gt; 3,5 → outlier.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: MAD dari [48, 49, 50, 51, 52, 200] (klik untuk buka)</summary>
        <p><strong>Langkah 1</strong> — median = (50 + 51) / 2 = <strong>50,5</strong>.</p>
        <p><strong>Langkah 2</strong> — selisih absolut terhadap median: 2,5; 1,5; 0,5; 0,5; 1,5; 149,5.</p>
        <p><strong>Langkah 3</strong> — MAD = median dari selisih itu = (1,5 + 1,5) / 2 = <strong>1,5</strong>. Perhatikan: monster 200 hanya menyumbang satu angka 149,5 yang tenggelam di median — tidak menggembungkan apa-apa.</p>
        <p><strong>Langkah 4</strong> — skor untuk 200: 0,6745 &times; (200 − 50,5) / 1,5 ≈ <strong>67</strong> → jauh di atas 3,5 → outlier. Monster tertangkap, dan ia tidak sempat merusak "penggarisnya".</p>
      </details>

      <p><strong>Kepribadian MAD:</strong> satu-satunya metode yang tidak bisa dibohongi oleh outlier yang ia buru. Z-score seperti penggaris karet yang ditarik oleh objek yang diukur; MAD adalah penggaris besi.</p>

      <p><strong>Kapan memakai:</strong> data kotor, banyak anomali, potensi fraud — saat kamu curiga datanya sudah terkontaminasi.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "MAD selalu lebih baik dari IQR, jadi pakai MAD terus."</p>
        <p><strong>Yang benar:</strong> pada data bersih dan normal, MAD kurang <em>efisien</em> secara statistik dibanding SD (butuh sampel lebih besar untuk presisi sama). Kekebalan ada harganya. Prinsipnya: <strong>sesuaikan senjata dengan tingkat kekotoran data</strong> — data bersih → z-score/IQR; data kotor → MAD.</p>
      </div>

      <h2 id="lab2">🔬 Lab 2: Masking Effect — Outlier yang Bersembunyi</h2>
      <PyodideLab
        title="🔬 Lab 2: Masking Effect — Outlier yang Bersembunyi"
        hint="Tambah monster kedua (520). Perhatikan z-score monster PERTAMA ikut turun — dua outlier saling melindungi. Inilah mengapa z-score gagal di data kotor."
        defaultCode={`import statistics as st\nbersih = [48, 50, 52, 49, 51, 50, 53, 47, 52, 80]  # 80 = anomali sedang\ndef zscores(d):\n    m = st.mean(d); s = st.stdev(d)\n    return [round((x - m) / s, 2) for x in d]\nprint("data awal        : z(80) =", zscores(bersih)[-1])\nkotor = bersih + [500]  # tambah 1 monster\nprint("tambah monster 500 : z(80) =", zscores(kotor)[-2], "| z(500) =", zscores(kotor)[-1])\nprint()\nprint("Monster menggeser mean dan menggembungkan SD,")\nprint("sehingga z(80) MENYUSUT - anomali sedang jadi 'bersembunyi'.")\nprint("COBA: tambah monster kedua 520, lihat z(500) ikut turun." )`}
      />

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada dua kegagalan kembar — <em>masking</em> (outlier menyembunyikan outlier lain, seperti di lab) dan <em>swamping</em> (outlier membuat data normal terlihat seperti outlier). Keduanya lahir dari penyakit yang sama: mean dan SD yang terkontaminasi. Obatnya juga sama: pakai statistik robust (median, IQR, MAD) untuk deteksi awal.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Untuk data miring kanan</strong> (nominal transaksi, DPD, klaim asuransi): jangan pakai z-score mentah — log-transform dulu (<Tex math={String.raw`\log(x)`} />), baru hitung z-score. Atau langsung pakai IQR/MAD yang memang dirancang kebal. Aturan kasarnya: kalau median &lt;&lt; mean, z-score mentah hampir pasti menipu.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Metode Mana untuk Datamu</h2>

      <div className="decision-card">
        <h3>1. Data bersih, kira-kira normal → Z-score</h3>
        <p><strong>Kondisi:</strong> error pengukuran sensor, skor tes terstandarisasi — data yang kamu yakini belum terkontaminasi.</p>
        <p><strong>Kenapa:</strong> paling efisien secara statistik; ambang |z| &gt; 3 punya interpretasi peluang yang jelas (~0,3% pada data normal).</p>
        <p><strong>Contoh nyata:</strong> kalibrasi sensor suhu ruangan server; nilai di luar ±3 SD → cek sensor, bukan cek ruangan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Eksplorasi cepat / dataset umum → IQR (default)</h3>
        <p><strong>Kondisi:</strong> kamu belum tahu bentuk datanya — EDA pertama atas kolom numerik apa pun.</p>
        <p><strong>Kenapa:</strong> robust, cepat, tanpa asumsi distribusi. Inilah yang digambar boxplot secara otomatis.</p>
        <p><strong>Contoh nyata:</strong> profiling 200 kolom tabel nasabah sebelum modeling — IQR memberi daftar kandidat anomali dalam hitungan detik.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data kotor / banyak anomali / potensi fraud → MAD</h3>
        <p><strong>Kondisi:</strong> kamu <em>curiga</em> datanya sudah terkontaminasi — log transaksi, klaim asuransi, data input manual.</p>
        <p><strong>Kenapa:</strong> satu-satunya yang kebal masking effect. Outlier tidak bisa merusak penggarisnya sendiri.</p>
        <p><strong>Contoh nyata:</strong> triase awal log transaksi kartu kredit — MAD menangkap pola mule-account yang lolos dari filter z-score.</p>
      </div>

      <div className="decision-card">
        <h3>4. Data miring + outlier → jangan z-score mentah</h3>
        <p><strong>Kondisi:</strong> median jauh di bawah mean (right skew) — nominal transaksi, DPD, durasi klaim.</p>
        <p><strong>Kenapa:</strong> z-score mengasumsikan simetri; pada data miring ia menandai ratusan nilai valid sebagai "outlier".</p>
        <p><strong>Contoh nyata:</strong> DPD kredit: log-transform dulu baru z-score, atau langsung IQR/MAD per segmen produk.</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Lihat boxplot dulu</strong> — posisi median &amp; titik-titik jauh memberi diagnosis 3 detik.</li>
          <li>Data bersih &amp; normal → <strong>z-score</strong>. Tidak yakin → <strong>IQR</strong>. Curiga kotor → <strong>MAD</strong>.</li>
          <li>Median &lt;&lt; mean → <strong>jangan z-score mentah</strong> (log-transform atau IQR/MAD).</li>
          <li><strong>Terdeteksi ≠ dibuang.</strong> Investigasi dulu: error, valid-ekstrem, atau sinyal fraud.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: 37 Transaksi Flag di Bank Digital</h2>
      <div className="callout">
        <p>Kamu analis fraud di bank digital. Kemarin ada <strong>12.480</strong> transaksi kartu kredit:</p>
        <ul>
          <li>Mean nominal = Rp 380 ribu, <strong>median = Rp 210 ribu</strong>, max = Rp 87 juta</li>
          <li>Deteksi z-score (|z| &gt; 3) menandai <strong>41</strong> transaksi</li>
          <li>Deteksi IQR (1,5&times;) menandai <strong>120</strong> transaksi</li>
          <li>Deteksi MAD (|M| &gt; 3,5) menandai <strong>38</strong> transaksi</li>
        </ul>
        <p><strong>Pertanyaan:</strong></p>
        <ol>
          <li>(a) Untuk triase awal hari ini, metode mana yang paling defensible? Kenapa z-score berbahaya di sini?</li>
          <li>(b) Ternyata 3 dari 38 flag MAD adalah nasabah prioritas dengan histori transaksi besar yang valid. Langkahmu?</li>
          <li>(c) Satu transaksi Rp 87 juta dari nasabah baru tanpa histori — hapus dari dataset training model?</li>
        </ol>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>MAD</strong> (atau IQR). Median (210 rb) jauh di bawah mean (380 rb) → data right-skewed dan pasti terkontaminasi. Z-score di sini menderita <em>dua</em> penyakit: asumsi simetri dilanggar + masking effect dari transaksi raksasa yang menggembungkan SD. Angka "41" dari z-score adalah angka yang paling tidak bisa dipercaya.</p>
          <p>(b) <strong>Whitelist + segmentasi.</strong> Tandai ketiga nasabah sebagai segmen "valid-ekstrem", keluarkan dari flagging rutin, tapi tetap monitor perubahaan pola (akun valid yang dibajak adalah skenario klasik). Jangan "tuning" ambang global hanya karena 3 false positive — itu melemahkan seluruh sistem.</p>
          <p>(c) <strong>Jangan hapus — investigasi.</strong> Nasabah baru + nominal ekstrem + tanpa histori = justru profil risiko tertinggi. Hapus = mengulangi kesalahan Rani di cerita pembuka. Eskalasi ke tim verifikasi; biarkan statusnya "ditahan untuk review", bukan "dibuang".</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu</h2>

      <Quiz
        question="Q1=20, Q3=40. Berapa batas atas outlier (metode IQR)?"
        options={["60", "70", "80", "100"]}
        correct={1}
        explanation="IQR = 40 − 20 = 20. Batas atas = Q3 + 1,5 × IQR = 40 + 30 = 70. (Langkah: hitung IQR dulu, baru kalikan 1,5, baru tambah ke Q3 — urutan ini yang sering terbalik.)"
      />

      <Quiz
        question="Data transaksi mengandung banyak outlier (potensi fraud). Metode deteksi terbaik?"
        options={[
          "Z-score",
          "IQR",
          "MAD",
          "Range",
        ]}
        correct={2}
        explanation="MAD paling robust — median tidak terpengaruh outlier lain sehingga tidak ada masking effect. Z-score justru gagal di data kotor karena mean/SD-nya terkontaminasi."
      />

      <Quiz
        question="Sistem mendeteksi transaksi Rp 500 juta sebagai outlier. Nasabah ini memang konglomerat dengan histori transaksi besar. Tindakan tepat?"
        options={[
          "Hapus — outlier harus dibuang",
          "Investigasi: valid tapi ekstrem → pertahankan, pakai metode robust",
          "Winsorize ke persentil 99% tanpa konfirmasi",
          "Abaikan — outlier tidak pernah penting",
        ]}
        correct={1}
        explanation="Outlier valid tapi ekstrem dipertahankan — menghapusnya menghilangkan informasi (dan merusak training model). Gunakan median/IQR/MAD agar analisis tidak terdistorsi, pertimbangkan segmentasi khusus."
      />

      <Quiz
        question="Boxplot menunjukkan median tepat di tengah kotak, whisker simetris, tanpa titik outlier. Kesimpulan?"
        options={[
          "Data right-skewed",
          "Data kira-kira simetris tanpa outlier ekstrem",
          "Pasti berdistribusi normal",
          "Data mengandung banyak missing",
        ]}
        correct={1}
        explanation="Boxplot simetris ≈ distribusi simetris. Tapi 'simetris' belum tentu 'normal' — butuh uji lanjutan (Q-Q plot, Shapiro-Wilk) untuk klaim normalitas. Jangan melompat dari visual ke klaim distribusi."
      />

      <Quiz
        question="Mana pernyataan TEPAT tentang konstanta 1,5 pada aturan Tukey?"
        options={[
          "Hukum matematika yang terbukti untuk semua distribusi",
          "Konvensi praktis Tukey; untuk 'far out' dipakai 3,0, dan pada data sangat miring 1,5 bisa terlalu agresif",
          "Hanya berlaku jika n > 1000",
          "Harus diganti 2,0 untuk data keuangan",
        ]}
        correct={1}
        explanation="1,5 adalah pilihan praktis Tukey (1977), bukan teorema. Pada data normal ia menandai ~0,7% data. Fleksibilitasnya justru kekuatan: pakai 3,0 untuk anomali sangat ekstrem, dan waspadai agresivitasnya pada data miring."
      />

      <Quiz
        question="Kapan winsorize ke persentil 1%/99% paling tepat?"
        options={[
          "Ketika outlier terbukti salah input",
          "Ketika ingin membatasi pengaruh nilai ekstrem TANPA membuang observasi (n tetap)",
          "Ketika ingin menghapus semua outlier",
          "Tidak pernah — winsorize selalu merusak data",
        ]}
        correct={1}
        explanation="Winsorize = 'potong, bukan buang': nilai ekstrem diganti batas persentil sehingga n tetap dan pengaruh dijinakkan. Tepat saat nilai ekstrem valid tapi terlalu berpengaruh (misal return saham harian untuk estimasi volatilitas). Jika terbukti error → hapus/perbaiki, bukan winsorize."
      />

      <h2 id="rangkuman">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kuantil/persentil</strong> = GPS posisi data; kebal outlier karena hanya peduli urutan. JANGAN tertukar: persentil ke-90 ≠ nilai 90.</li>
          <li><strong>Boxplot</strong> = rontgen distribusi: kotak (IQR), median, whisker, titik outlier. Posisi median di kotak = detektor skew tercepat. JANGAN pakai untuk data bimodal — kotak menyembunyikan dua puncak (pakai histogram).</li>
          <li><strong>Z-score</strong> = jarak dalam satuan SD, bahasa universal antar konteks. JANGAN untuk data kotor/miring (masking effect + asumsi simetri).</li>
          <li><strong>IQR/Tukey</strong> = default yang aman: pagar 1,5&times;IQR dari kuartil yang kebal. JANGAN jadikan 1,5 hukum mati — sesuaikan dengan kemiringan data.</li>
          <li><strong>MAD</strong> = penggaris besi untuk data kotor/fraud; kebal masking. JANGAN untuk data bersih normal (kurang efisien).</li>
          <li><strong>Aturan emas:</strong> terdeteksi ≠ dibuang. Investigasi dulu — error diperbaiki, valid-ekstrem dipertahankan dengan metode robust, sinyal fraud dieskalasi. Jangan jadi Rani yang pipeline-nya menghapus bukti.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a16-korelasi" className="btn btn-primary btn-sm">Next: A1.6 →</Link>
      </div>
    </div>
  );
}
