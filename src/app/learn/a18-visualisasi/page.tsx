import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A18Page() {
  const truncatedAxis = [
    {
      x: ["Bank A", "Bank B"],
      y: [51, 52],
      type: "bar",
      marker: { color: ["#2a7de1", "#d33f2e"] },
      text: ["51", "52"],
      textposition: "auto",
    },
  ];

  const properAxis = [
    {
      x: ["Bank A", "Bank B"],
      y: [51, 52],
      type: "bar",
      marker: { color: ["#2a7de1", "#d33f2e"] },
      text: ["51", "52"],
      textposition: "auto",
    },
  ];

  const salesBar = [
    {
      y: ["P12", "P07", "P03", "P15", "P01", "P09", "P05", "P11"],
      x: [120, 105, 98, 87, 76, 64, 52, 41],
      type: "bar",
      orientation: "h",
      marker: { color: "#2a7de1" },
    },
  ];

  const trendLine = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      y: [10, 12, 11, 15, 14, 18],
      mode: "lines+markers",
      type: "scatter",
      name: "NPL (%)",
      marker: { color: "#d33f2e", size: 8 },
    },
  ];

  const pieBad = [
    {
      labels: ["Tabungan", "Giro", "Deposito", "Valas", "Emas", "Reksadana", "Saham", "Lainnya"],
      values: [28, 18, 15, 12, 9, 7, 6, 5],
      type: "pie",
      textinfo: "label+percent",
    },
  ];

  const stackedGood = [
    { x: ["2024", "2025"], y: [55, 58], name: "Tabungan", type: "bar", marker: { color: "#2a7de1" } },
    { x: ["2024", "2025"], y: [30, 27], name: "Giro", type: "bar", marker: { color: "#3d9a50" } },
    { x: ["2024", "2025"], y: [15, 15], name: "Deposito", type: "bar", marker: { color: "#e8a838" } },
  ];

  const incomeBimodal = [
    {
      x: [4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 9, 9, 10, 28, 30, 32, 32, 34, 35, 36, 38, 40],
      type: "histogram",
      name: "Penghasilan (juta Rp)",
      marker: { color: "#2a7de1" },
      xbins: { size: 3 },
    },
  ];

  const scatterRel = [
    {
      x: [5, 8, 12, 15, 20, 25, 30, 40, 50, 60],
      y: [3, 5, 8, 10, 14, 16, 20, 26, 32, 38],
      mode: "markers",
      type: "scatter",
      name: "Nasabah",
      marker: { color: "#2a7de1", size: 9 },
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.8 — Statistika Deskriptif</span>
        <h1 className="display-title">Chart Cantik yang Berbohong:<br />Visualisasi Data Tanpa Menyesatkan</h1>
        <p className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</p>
        <p className="lead">
          Chart yang salah = kebohongan visual yang terlihat meyakinkan.
        </p>
      </div>

      <div className="callout callout-warning">
        <p>Pie chart dengan 20 slice. Bar chart dengan sumbu Y tidak mulai dari nol. Line chart untuk data kategori.</p>
        <p>Visualisasi yang salah <strong>lebih berbahaya dari tidak ada visualisasi</strong> — karena terlihat meyakinkan. (Ingat Anscombe di A1.6: chart adalah alat validasi, bukan dekorasi.)</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: "Nasabah Naik 180%!"</a></li>
          <li><a href="#k-arsitek">Konsep 1: Si Arsitek — Tujuan Dulu, Chart Kemudian</a></li>
          <li><a href="#k-bar">Konsep 2: Si Tukang Ukur — Bar Chart &amp; Sumbu Nol</a></li>
          <li><a href="#k-line">Konsep 3: Si Pencerita Waktu — Line Chart</a></li>
          <li><a href="#k-distribusi">Konsep 4: Si Pemeriksa Kejujuran — Distribusi</a></li>
          <li><a href="#k-komposisi">Konsep 5: Si Tukang Kue — Komposisi: Pie vs Stacked Bar</a></li>
          <li><a href="#k-scatter">Konsep 6: Si Mata-Mata Ganda — Scatterplot &amp; Dual Axis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Lie Factor — Seberapa Besar Chart Berbohong?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Regenerasi Chart — Sumbu Terpotong vs Jujur</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Chart Apa untuk Masalah Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Bedah Slide Direksi yang Menipu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="card"><ul>
        <li>Memilih jenis chart yang tepat untuk tiap tujuan analisis (perbandingan, tren, distribusi, hubungan, komposisi) — dan menjelaskan <strong>mengapa</strong> pilihan itu benar.</li>
        <li>Mendeteksi 5 jebakan visual (sumbu terpotong, dual axis, 3D, pie berlebih, warna pelangi) dan menghitung <strong>lie factor</strong>-nya.</li>
        <li>Membaca setiap chart dengan panduan "cara membaca → interpretasi" tanpa tertipu skala atau proporsi.</li>
        <li>Menilai sebuah visualisasi presentasi (slide direksi/dashboard) dan menuliskan apa yang harus diperbaiki — termasuk kapan sebuah chart <strong>sebaiknya tidak dibuat sama sekali</strong>.</li>
      </ul></div>

      <h2 id="cerita">Cerita Pembuka: "Nasabah Naik 180%!"</h2>
      <div className="story">
        <p>Rapat direksi MajuBank, Senin pagi. Kepala marketing membuka slide dengan bangga: <em>"Pertumbuhan Nasabah 180%!"</em> — bar chart dua batang. Batang kiri (Kuartal 1) pendek mungil. Batang kanan (Kuartal 2) menjulang <strong>tiga kali lipat</strong>. Direksi bertepuk tangan.</p>
        <p>Kamu analis risiko, duduk di pojok. Kamu zoom angka kecil di bawah chart: Kuartal 1 = <strong>41.200</strong> nasabah. Kuartal 2 = <strong>43.100</strong> nasabah. Kenaikan riil: 4,6%. Sumbu Y-nya mulai dari <strong>40.000</strong> — bukan nol.</p>
        <p><strong>Twist-nya:</strong> tidak ada satu pun angka di slide itu yang salah. 41.200 benar, 43.100 benar, batangnya proporsional terhadap sumbunya. Yang berbohong bukan angkanya — <strong>melainkan kesan yang ditanamkan chart ke otak penonton</strong>. Otak manusia membaca tinggi batang, bukan membaca sumbu. Inilah pelajaran A1.8: chart adalah alat persuasi sekuat alat analisis — dan kamu harus menguasai keduanya, supaya tidak jadi korban maupun pelaku yang tidak sadar.</p>
      </div>

      <h2 id="k-arsitek">Konsep 1: Si Arsitek — Tujuan Dulu, Chart Kemudian</h2>
      <p><strong>Definisi.</strong> Si Arsitek adalah prinsip pertama visualisasi: <strong>rumuskan dulu pertanyaan</strong> ("apa yang ingin dibandingkan?"), <strong>baru pilih chart</strong>. Chart yang dipilih sebelum tujuannya jelas hampir selalu salah — seperti membangun rumah sebelum tahu siapa yang tinggal.</p>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>Tujuan</th><th>Chart</th></tr>
          </thead>
          <tbody>
            <tr><td>Perbandingan kategori</td><td><strong>Bar chart</strong> (horizontal jika label panjang)</td></tr>
            <tr><td>Tren waktu</td><td><strong>Line chart</strong></td></tr>
            <tr><td>Distribusi</td><td><strong>Histogram, boxplot, density</strong></td></tr>
            <tr><td>Hubungan 2 variabel</td><td><strong>Scatterplot</strong></td></tr>
            <tr><td>Komposisi</td><td><strong>Stacked bar</strong> (bukan pie jika &gt; 5 kategori!)</td></tr>
            <tr><td>Peta</td><td><strong>Choropleth</strong> (waspadai bias populasi)</td></tr>
          </tbody>
        </table>
      </div>

      <details className="worked"><summary>📐 Contoh pengerjaan: dari pertanyaan ke chart (klik untuk buka)</summary>
        <p><strong>Pertanyaan:</strong> "Produk simpanan mana yang paling laku bulan ini?"</p>
        <p><strong>Langkah 1</strong> — identifikasi tujuan: <em>perbandingan antar kategori</em> (produk), satu angka per kategori (penjualan).</p>
        <p><strong>Langkah 2</strong> — pilih chart: bar chart. Label produk panjang (kode P12, P07…) → <strong>horizontal</strong> agar terbaca.</p>
        <p><strong>Langkah 3</strong> — urutkan <strong>terbesar ke terkecil</strong>: mata langsung menemukan pemenang tanpa memindai bolak-balik.</p>
        <p><strong>Cek:</strong> pie chart? Tidak — 8 kategori, sudutnya tak terbaca. Line chart? Tidak — produk bukan urutan waktu.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> kalau kamu butuh lebih dari <strong>satu kalimat</strong> untuk menjelaskan apa yang ingin ditunjukkan chart, pertanyaannya belum tajam. Pertanyaan tajam → chart-nya hampir memilih dirinya sendiri.</div>

      <p><strong>Kapan memakai:</strong> selalu — ini langkah nol sebelum chart apapun dibuat. Di rapat, tanyakan dulu: "satu pesan apa yang harus dibawa pulang penonton dari chart ini?"</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Chart yang bagus = chart yang kaya informasi."</b><br />
      <b>Yang benar:</b> chart yang bagus = <strong>satu chart, satu pesan</strong>. Dashboard 12 garis warna-warni dalam satu chart bukan "kaya" — itu spageti. Kalau butuh 3 paragraf menjelaskan chart, chart-nya gagal. Pecah menjadi beberapa chart fokus.</div>

      <h3>Aturan Emas</h3>
      <ol>
        <li><strong>Sumbu Y mulai dari nol</strong> untuk bar chart. (Line chart boleh tidak, tapi beri anotasi.)</li>
        <li><strong>Jangan pakai pie &gt; 5 slice.</strong> Manusia buruk membandingkan sudut.</li>
        <li><strong>Satu chart, satu pesan.</strong> Kalau butuh 3 paragraf menjelaskan chart, chart-nya gagal.</li>
        <li><strong>Label langsung</strong>, jangan pakai legend jika bisa.</li>
      </ol>

      <h2 id="k-bar">Konsep 2: Si Tukang Ukur — Bar Chart &amp; Sumbu Nol</h2>
      <p><strong>Definisi.</strong> Bar chart mengkodekan nilai menjadi <strong>panjang/tinggi batang</strong> — dan otak membaca perbandingan panjang secara proporsional. Karena itu sumbu Y <strong>wajib mulai dari nol</strong>: kalau tidak, proporsi visual tidak lagi sama dengan proporsi data.</p>

      <p><strong>Rumus: Lie Factor</strong> (Edward Tufte) — ukuran seberapa besar chart berbohong:</p>
      <Tex math={String.raw`LF = \frac{\text{efek pada grafik (\%)}}{\text{efek pada data (\%)}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`LF`} /> ("lie factor"): faktor kebohongan. <Tex math={String.raw`LF \approx 1`} /> = jujur. <Tex math={String.raw`LF \gt 1{,}05`} /> atau <Tex math={String.raw`LF \lt 0{,}95`} /> = distorsi substansial (batas Tufte).</li>
        <li><strong>efek pada grafik (%):</strong> seberapa besar perubahan <em>tinggi batang</em> yang dilihat mata.</li>
        <li><strong>efek pada data (%):</strong> seberapa besar perubahan <em>angka sebenarnya</em>.</li>
      </ul>

      <details className="worked"><summary>📐 Contoh pengerjaan: lie factor kasus Bank A vs Bank B (klik untuk buka)</summary>
        <p>Data: Bank A = 51, Bank B = 52. Sumbu Y dipotong mulai dari 50 sampai 53.</p>
        <p><strong>Langkah 1</strong> — tinggi batang relatif terhadap sumbu: A = (51−50)/3 = 1/3, B = (52−50)/3 = 2/3.</p>
        <p><strong>Langkah 2</strong> — efek pada grafik: batang B dua kali batang A → perubahan visual = <strong>100%</strong>.</p>
        <p><strong>Langkah 3</strong> — efek pada data: (52−51)/51 = <strong>1,96%</strong>.</p>
        <p><strong>Langkah 4</strong> — <Tex math={String.raw`LF = 100 / 1{,}96 \approx 51`} />. Chart membesar-besarkan perbedaan <strong>51 kali lipat</strong>. Batas jujur Tufte adalah 1,05 — ini 51. Murni kebohongan visual.</p>
      </details>

      <p>Bandingkan sendiri — <strong>data yang sama persis</strong> (51 vs 52):</p>
      <PlotlyChart
        data={truncatedAxis}
        title="SALAH: Sumbu Y Mulai dari 50 — Beda Terlihat Besar"
        layout={{ yaxis: { title: "Skor", range: [50, 53] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = dua bank, tinggi batang = skor. Perhatikan <strong>angka di sumbu Y</strong> — ia mulai dari 50, bukan 0.</p>
        <p><strong>Interpretasi:</strong> batang Bank B terlihat 2× batang Bank A, padahal selisihnya cuma 1 poin (51 vs 52). Ini ilusi sumbu terpotong — lie factor ≈ 51.</p>
      </div>

      <PlotlyChart
        data={properAxis}
        title="BENAR: Sumbu Y Mulai dari 0 — Beda Terlihat Proporsional"
        layout={{ yaxis: { title: "Skor", range: [0, 55] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> chart yang sama, sumbu Y kini mulai dari 0.</p>
        <p><strong>Interpretasi:</strong> kedua batang hampir sama tinggi — itulah kebenarannya: beda 1 poin dari 51. Versi jujur terlihat "membosankan", dan justru itu tandanya benar.</p>
      </div>

      <div className="callout callout-warning">
        <p>Chart kiri dan kanan memakai <strong>data yang sama persis</strong> (51 vs 52). Yang kiri menipu — beda 1 poin terlihat seperti 2x lipat. Selalu cek sumbu sebelum percaya bar chart!</p>
      </div>

      <div className="tip"><b>💡 Intuisi kunci:</b> mata manusia tidak membaca angka sumbu — ia membaca <strong>proporsi tinggi</strong>. Desainer chart yang "lupa" mulai dari nol (atau sengaja) sedang meretas persepsimu, bukan menyajikan data.</div>

      <p><strong>Kapan memakai bar chart:</strong> perbandingan antar kategori diskrit (bank, produk, cabang). Horizontal + terurut jika label panjang atau kategori &gt; 6.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Sumbu boleh mulai dari mana saja, yang penting angkanya benar."</b><br />
      <b>Yang benar:</b> angka benar ≠ pesan benar. Pada bar chart, panjang batang <em>adalah</em> pesannya. Sumbu terpotong mengubah pesan tanpa mengubah angka — itulah definisi visual yang menyesatkan. (Pengecualian: line chart boleh tidak dari nol <em>asal</em> diberi anotasi jelas — karena line chart dibaca sebagai tren, bukan proporsi.)</div>

      <h2 id="k-line">Konsep 3: Si Pencerita Waktu — Line Chart</h2>
      <p><strong>Definisi.</strong> Line chart menghubungkan titik-titik data <strong>berurutan waktu</strong> dengan garis. Kekuatannya: mata langsung menangkap <strong>tren, percepatan, dan titik balik</strong> — pola yang tak terlihat dari tabel angka.</p>

      <p><strong>Rumus: laju perubahan per periode</strong> — angka di balik kemiringan garis:</p>
      <Tex math={String.raw`g_t = \frac{x_t - x_{t-1}}{x_{t-1}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`g_t`} />: laju pertumbuhan pada periode <Tex math={String.raw`t`} /> (dalam persen).</li>
        <li><Tex math={String.raw`x_t`} />: nilai periode ini; <Tex math={String.raw`x_{t-1}`} />: nilai periode sebelumnya.</li>
      </ul>
      <p>Contoh: NPL Jan 10% → Feb 12% → <Tex math={String.raw`g = (12-10)/10 \times 100\% = 20\%`} />. Garis menanjak tajam = <Tex math={String.raw`g_t`} /> besar.</p>

      <PlotlyChart
        data={trendLine}
        title="Benar: Line Chart untuk Tren Waktu (NPL)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = bulan berurutan, sumbu Y = NPL (%), kemiringan garis = kecepatan perubahan.</p>
        <p><strong>Interpretasi:</strong> NPL naik dari 10% ke 18% dalam 6 bulan — tren memburuk, dengan percepatan di Apr–Jun (kemiringan makin curam). Satu garis, satu pesan: kualitas kredit menurun.</p>
      </div>

      <details className="worked"><summary>📐 Contoh pengerjaan: kapan line chart SALAH (klik untuk buka)</summary>
        <p>Data: penjualan 8 produk (P01…P15) — seperti chart bar di Konsep 1.</p>
        <p><strong>Kesalahan:</strong> memplotnya sebagai line chart. Garis menghubungkan P12→P07→P03 seolah ada "tren" antar produk — padahal urutan produk itu <strong>acak</strong>, tidak ada hubungan waktu.</p>
        <p><strong>Aturan:</strong> garis antar titik menyiratkan <strong>kontinuitas/urutan bermakna</strong>. Kalau sumbu X-nya kategori tanpa urutan (produk, cabang, warna), garis itu dusta — pakai bar chart.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> tanyakan pada setiap line chart: <em>"apakah titik di antara dua observasi punya makna?"</em> Antara Jan dan Feb ada waktu nyata → garis bermakna. Antara produk P12 dan P07 tidak ada apa-apa → garis menipu.</div>

      <p><strong>Kapan memakai:</strong> data runtun waktu (tren NPL, harga saham, pertumbuhan DPK). Untuk data risiko: tambahkan garis <strong>kumulatif</strong> (loss distribution, backtesting) dan <strong>heatmap</strong> (matriks korelasi, vintage analysis) serta <strong>waterfall</strong> untuk atribusi P&amp;L (apa yang menggerakkan hasil?).</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Garis naik = kabar baik."</b><br />
      <b>Yang benar:</b> naik/turun itu netral — maknanya tergantung metriknya. Garis NPL naik = kabar buruk; garis DPK naik = kabar baik. Selalu baca <strong>label sumbu Y</strong> sebelum bereaksi terhadap arah garis. Analis yang bereaksi pada bentuk tanpa membaca label adalah korban empuk chart marketing.</div>

      <h2 id="k-distribusi">Konsep 4: Si Pemeriksa Kejujuran — Distribusi</h2>
      <p><strong>Definisi.</strong> Histogram memotong rentang data menjadi <strong>bin</strong> (kotak interval) lalu menghitung frekuensi tiap bin. Ia menjawab pertanyaan yang tidak bisa dijawab satu angka pun: <em>"data ini bentuknya seperti apa?"</em> — simetris, miring, atau malah dua kelompok?</p>

      <p><strong>Rumus: aturan Sturges</strong> — berapa banyak bin yang wajar:</p>
      <Tex math={String.raw`k \approx 1 + 3.322 \log_{10} n`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`k`} />: jumlah bin yang disarankan.</li>
        <li><Tex math={String.raw`n`} />: banyaknya data.</li>
        <li><Tex math={String.raw`\log_{10}`} />: logaritma basis 10.</li>
      </ul>
      <p>Contoh: <Tex math={String.raw`n = 100`} /> → <Tex math={String.raw`k \approx 1 + 3.322 \times 2 \approx 7{,}6`} /> → pakai ±8 bin. Terlalu sedikit bin menyembunyikan pola; terlalu banyak menampilkan noise.</p>

      <PlotlyChart
        data={incomeBimodal}
        title="Waspada: Distribusi Bimodal Penghasilan Nasabah"
        layout={{ xaxis: { title: "Penghasilan (juta Rp)" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = penghasilan (dibagi bin), tinggi batang = jumlah nasabah di bin itu. Cari di mana massa menumpuk.</p>
        <p><strong>Interpretasi:</strong> ada <strong>dua punuk</strong> — menumpuk di ±8 jt dan ±34 jt. Ini <strong>bimodal</strong>: dua kelompok nasabah berbeda (misal mikro vs menengah). Rata-rata keseluruhannya (±17 jt) tidak dialami siapa pun. Tanpa histogram, kamu akan menetapkan satu kebijakan untuk dua populasi yang berbeda.</p>
      </div>

      <details className="worked"><summary>📐 Contoh pengerjaan: histogram menyelamatkan dari mean menipu (klik untuk buka)</summary>
        <p>Data penghasilan 22 nasabah di atas: mean ≈ 17 jt, median ≈ 8,5 jt.</p>
        <p><strong>Langkah 1</strong> — plot histogram (8 bin per Sturges).</p>
        <p><strong>Langkah 2</strong> — amati: dua punuk jelas, lembah di tengah (±15–25 jt).</p>
        <p><strong>Langkah 3</strong> — kesimpulan: jangan laporkan satu angka. Segmentasikan: segmen mikro (punuk kiri) dan segmen menengah (punuk kanan), analisis terpisah.</p>
        <p><strong>Pelajaran:</strong> inilah kenapa Anscombe (A1.6) berkata chart adalah alat <em>validasi</em> — angka ringkasan bisa identik untuk data yang bentuknya beda total.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> histogram adalah <strong>tes kejujuran</strong> untuk setiap angka ringkasan. Sebelum percaya mean/median apapun, tanya: "bentuk distribusinya seperti apa?" — satu histogram menjawab lebih jujur dari sepuluh metrik.</div>

      <p><strong>Kapan memakai:</strong> selalu di awal analisis tiap variabel numerik (ini fondasi EDA di A1.9). Boxplot sebagai pendamping ringkas: median, kuartil, outlier sekilas.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Histogram hanya versi cantik dari tabel frekuensi."</b><br />
      <b>Yang benar:</b> tabel frekuensi memberi angka, histogram memberi <strong>bentuk</strong> — dan bentuklah yang menentukan keputusan (mean vs median, satu segmen vs dua). Otak memproses bentuk 60.000× lebih cepat dari angka (itulah kenapa chart bisa menipu — dan kenapa ia tak tergantikan).</div>

      <h2 id="k-komposisi">Konsep 5: Si Tukang Kue — Komposisi: Pie vs Stacked Bar</h2>
      <p><strong>Definisi.</strong> Chart komposisi menunjukkan <strong>bagian dari keseluruhan</strong>: proporsi tiap kategori terhadap total.</p>
      <Tex math={String.raw`p_i = \frac{n_i}{N}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`p_i`} /> = proporsi kategori ke-<Tex math={String.raw`i`} />, <Tex math={String.raw`n_i`} /> = nilai kategori itu, <Tex math={String.raw`N`} /> = total keseluruhan. Contoh: Tabungan 28 dari total 100 → <Tex math={String.raw`p = 28/100 = 28\%`} />.</p>

      <p><strong>Masalahnya:</strong> pie chart mengkodekan proporsi menjadi <strong>sudut &amp; luas juring</strong> — dan manusia buruk membandingkan sudut. Lihat chart "salah" ini:</p>
      <PlotlyChart
        data={pieBad}
        title="SALAH: Pie 8 Slice — Coba Bandingkan 'Valas' vs 'Deposito'"
        layout={{ showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap juring = satu produk simpanan, luas juring = proporsinya.</p>
        <p><strong>Interpretasi:</strong> tanpa membaca label, bisakah kamu mengurutkan 8 juring dari terbesar ke terkecil? Hampir mustahil — sudut 12% vs 15% tak terbedakan mata. Inilah kenapa pie &gt; 5 slice dilarang.</p>
      </div>

      <p>Versi jujurnya — stacked bar, panjang batang yang dibandingkan mata secara akurat:</p>
      <PlotlyChart
        data={stackedGood}
        title="BENAR: Stacked Bar — Komposisi 2024 vs 2025 Sekilas Terbaca"
        layout={{ barmode: "stack", xaxis: { title: "Tahun" }, yaxis: { title: "%" } }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = 100% DPK satu tahun, segmen warna = produk. Bandingkan <strong>panjang segmen</strong> antar tahun.</p>
        <p><strong>Interpretasi:</strong> porsi Tabungan naik (55%→58%), Giro turun (30%→27%), Deposito stabil. Perbandingan antar tahun yang di pie chart mustahil, di sini seketika.</p>
      </div>

      <details className="worked"><summary>📐 Contoh pengerjaan: kapan pie BOLEH dipakai (klik untuk buka)</summary>
        <p>Data: komposisi DPK hanya <strong>3 kategori</strong> — Tabungan 58%, Giro 27%, Deposito 15%.</p>
        <p><strong>Langkah 1</strong> — cek syarat: ≤ 5 slice? Ya (3). Satu pesan sederhana ("tabungan dominan")? Ya.</p>
        <p><strong>Langkah 2</strong> — pie boleh dipakai. Tapi stacked bar <em>tetap</em> lebih baik jika ingin bandingkan antar tahun.</p>
        <p><strong>Aturan:</strong> pie = maksimal 5 slice, satu periode, satu pesan. Selain itu → stacked bar.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> mata manusia mengurutkan akurasi: <strong>posisi/panjang</strong> (bar) &gt; <strong>sudut</strong> (pie) &gt; <strong>luas</strong> &gt; <strong>warna</strong>. Setiap kali kamu memilih pie 8 slice, kamu memaksa otak penonton memakai alat ukur terburuknya.</div>

      <p><strong>Kapan memakai:</strong> komposisi ≤ 5 kategori dan satu periode → pie boleh; selebihnya stacked bar (100% untuk proporsi, absolut untuk nilai).</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Pie chart warna-warni terlihat profesional dan meyakinkan."</b><br />
      <b>Yang benar:</b> "terlihat meyakinkan" ≠ "terbaca". Pie 8 slice yang cantik membuat penonton <em>merasa</em> paham tanpa benar-benar bisa membandingkan — itu bukan profesionalisme, itu ilusi. Profesional = penonton bisa menjawab pertanyaan dari chart tanpa menebak.</div>

      <h2 id="k-scatter">Konsep 6: Si Mata-Mata Ganda — Scatterplot &amp; Dual Axis</h2>
      <p><strong>Definisi.</strong> Scatterplot memplot tiap observasi sebagai <strong>titik</strong> pada dua sumbu — satu-satunya chart yang menunjukkan <strong>hubungan dua variabel</strong> apa adanya: arah, kekuatan, pola non-linear, dan outlier.</p>

      <p><strong>Rumus: korelasi Pearson</strong> — angka ringkas di balik pola titik:</p>
      <Tex math={String.raw`r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i-\bar{x})^2 \sum (y_i-\bar{y})^2}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`r`} />: koefisien korelasi, rentang −1 sampai +1.</li>
        <li><Tex math={String.raw`x_i, y_i`} />: pasangan nilai observasi ke-<Tex math={String.raw`i`} />.</li>
        <li><Tex math={String.raw`\bar{x}, \bar{y}`} />: rata-rata masing-masing variabel.</li>
      </ul>
      <p>Intuisi: pembilang mengukur "apakah x dan y menyimpang ke arah yang sama?" — kalau ya terus, <Tex math={String.raw`r`} /> mendekati +1.</p>

      <PlotlyChart
        data={scatterRel}
        title="Scatterplot: Penghasilan vs Limit Kredit yang Disetujui"
        layout={{ xaxis: { title: "Penghasilan (juta Rp)" }, yaxis: { title: "Limit disetujui (juta Rp)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = satu nasabah; posisi horizontal = penghasilannya, vertikal = limit yang disetujui.</p>
        <p><strong>Interpretasi:</strong> titik-titik membentuk pita menanjak — penghasilan lebih tinggi → limit lebih besar (korelasi positif kuat). Tidak ada titik yang menyimpang jauh dari pita: kebijakan limit konsisten, tidak ada anomali persetujuan.</p>
      </div>

      <details className="worked"><summary>📐 Contoh pengerjaan: r ≈ 0 tapi hubungan ADA (klik untuk buka)</summary>
        <p>Data: tenor kredit (6–36 bulan) vs default rate membentuk pola <strong>huruf U</strong> — default tinggi di tenor sangat pendek (cicilan berat) dan sangat panjang (bunga menumpuk), rendah di tengah.</p>
        <p><strong>Langkah 1</strong> — hitung Pearson: <Tex math={String.raw`r \approx 0`} /> (naik-turun saling meniadakan).</p>
        <p><strong>Langkah 2</strong> — plot scatterplot: pola U terlihat jelas.</p>
        <p><strong>Kesimpulan:</strong> <Tex math={String.raw`r = 0`} /> <strong>bukan</strong> berarti "tidak ada hubungan" — artinya "tidak ada hubungan <em>linear</em>". Inilah kenapa A1.6 bersikeras: jangan percaya angka korelasi tanpa plot (Anscombe!).</p>
      </details>

      <div className="callout callout-warning">
        <p><strong>Dual axis (dua sumbu Y) — mainkan dengan sangat hati-hati.</strong> Dua skala berbeda bisa "membuktikan" apa saja: geser skala kiri sedikit, dua garis yang tadinya berpapasan jadi tampak bergerak bersama. Kalau terpaksa pakai (misal NPL % vs total kredit Rp), pastikan <strong>kedua sumbu mulai dari nol</strong>, beri warna berbeda yang jelas, dan tulis anotasi skalanya. Alternatif yang lebih jujur: dua panel terpisah atau normalisasi ke indeks (Jan = 100).</p>
      </div>

      <div className="tip"><b>💡 Intuisi kunci:</b> scatterplot adalah <strong>poligraf</strong> untuk klaim "X berhubungan dengan Y". Setiap kali seseorang mengklaim hubungan antar variabel tanpa menunjukkan scatterplot, anggap klaim itu belum terbukti.</div>

      <p><strong>Kapan memakai:</strong> menyelidiki hubungan dua variabel numerik, validasi korelasi, berburu outlier bivariat, cek asumsi sebelum regresi.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Dua garis yang bergerak bersama di dual-axis chart = keduanya berhubungan."</b><br />
      <b>Yang benar:</b> dengan mengatur skala dua sumbu, kamu bisa membuat <em>deret acak</em> manapun tampak "bergerak bersama". Kesamaan gerak visual bukan bukti hubungan — itu artefak pilihan skala. Bukti hubungan = scatterplot + ukuran efek yang dihitung, bukan dua garis yang kebetulan sejajar.</div>

      <h2 id="lab1">🔬 Lab 1: Hitung Lie Factor — Seberapa Besar Chart Berbohong?</h2>
      <p>Ubah <code className="inline">y_min</code> (titik potong sumbu), jalankan, dan lihat lie factor berubah. Misi: temukan <code className="inline">y_min</code> terbesar yang masih "jujur" (LF ≤ 1,05).</p>
      <PyodideLab
        title="🔬 Lab 1: Kalkulator Lie Factor"
        hint="Coba: y_min = 50 → 40 → 0. Pada titik berapa LF turun di bawah 1,05? Itulah batas sumbu yang masih jujur."
        defaultCode={`# Data: skor kepuasan Bank A vs Bank B
nilai = [51, 52]
y_min = 50   # <-- UBAH: 50 (terpotong), 40, 0 (jujur)
y_max = 53

# Tinggi batang relatif terhadap sumbu yang dipakai
h = [(v - y_min) / (y_max - y_min) for v in nilai]

efek_visual = (h[1] - h[0]) / h[0] * 100   # % perubahan tinggi batang
efek_data = (nilai[1] - nilai[0]) / nilai[0] * 100  # % perubahan angka riil
lf = efek_visual / efek_data

print(f"Sumbu Y: {y_min} s.d. {y_max}")
print(f"Efek visual (tinggi batang): {efek_visual:.1f}%")
print(f"Efek data (angka sebenarnya): {efek_data:.2f}%")
print(f"LIE FACTOR = {lf:.1f}")
print()
if lf <= 1.05:
    print(">> JUJUR: visual proporsional dengan data.")
else:
    print(f">> MENIPU: chart membesar-besarkan {lf:.0f}x lipat! (batas Tufte: 1,05)")`}
      />

      <h2 id="lab2">🔬 Lab 2: Regenerasi Chart — Sumbu Terpotong vs Jujur</h2>
      <p>Lab ini <strong>menggambar ulang</strong> bar chart yang sama dengan dua versi sumbu — dalam bentuk teks (ASCII) supaya kamu melihat mekaniknya. Ubah <code className="inline">y_min</code>, jalankan, bandingkan.</p>
      <PyodideLab
        title="🔬 Lab 2: Regenerator Bar Chart"
        hint="Coba y_min = 50 (versi marketing), lalu 0 (versi jujur), lalu 51 (versi bohong parah). Perhatikan: angkanya tidak berubah — yang berubah hanya kesan."
        defaultCode={`data = {"Bank A": 51, "Bank B": 52}
y_min = 50   # <-- UBAH: 50, 0, atau 51
y_max = 53
lebar_maks = 40  # karakter

print(f"=== Bar chart, sumbu Y mulai dari {y_min} ===\n")
for bank, v in data.items():
    tinggi = int((v - y_min) / (y_max - y_min) * lebar_maks)
    print(f"{bank} | {'#' * tinggi} {v}")

print()
if y_min > 0:
    print("KESAN: beda terlihat BESAR. Cek: apakah sumbu mulai dari 0?")
    print("Fakta: selisih hanya 1 poin dari 51 (1,96%).")
else:
    print("KESAN: kedua batang hampir sama. Ini versi JUJUR.")
    print("Fakta: selisih memang hanya 1 poin dari 51 (1,96%).")`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Chart Apa untuk Masalah Apa</h2>
      <p>Empat skenario nyata — tiap skenario: kondisi → chart → kenapa → contoh.</p>

      <div className="decision-card">
        <h3>1. "Produk mana yang paling laku?" → Bar Horizontal Terurut</h3>
        <p><strong>Kondisi:</strong> 8 kategori produk, label berkode, satu angka per kategori.</p>
        <PlotlyChart
          data={salesBar}
          title="Penjualan per Produk (Terurut)"
          layout={{ xaxis: { title: "Penjualan" }, yaxis: { title: "Produk" }, showlegend: false }}
        />
        <div className="chart-guide">
          <p><strong>Cara membaca:</strong> sumbu Y = produk (terpanjang di atas), sumbu X = penjualan.</p>
          <p><strong>Interpretasi:</strong> P12 juara (120), P11 buncit (41). Urutan descending membuat ranking terbaca tanpa berpikir.</p>
        </div>
        <p><strong>Kenapa:</strong> perbandingan kategori → bar; label panjang → horizontal; terurut → ranking instan. <strong>Contoh nyata:</strong> ranking cabang berdasarkan NPL.</p>
      </div>

      <div className="decision-card">
        <h3>2. "Apakah NPL memburuk?" → Line Chart</h3>
        <p><strong>Kondisi:</strong> satu metrik diamati tiap bulan — ada urutan waktu bermakna.</p>
        <PlotlyChart
          data={trendLine}
          title="Tren NPL 6 Bulan"
          layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "%" }, showlegend: false }}
        />
        <div className="chart-guide">
          <p><strong>Cara membaca:</strong> sumbu X = bulan berurutan; kemiringan = kecepatan perubahan.</p>
          <p><strong>Interpretasi:</strong> tren naik 10%→18% dengan percepatan di kuartal kedua — sinyal memburuk, bukan fluktuasi.</p>
        </div>
        <p><strong>Kenapa:</strong> garis menyiratkan kontinuitas waktu — tepat untuk tren. <strong>Contoh nyata:</strong> tren DPK, harga saham, inflasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. "Komposisi DPK berubah?" → Stacked Bar (Bukan Pie!)</h3>
        <p><strong>Kondisi:</strong> ingin bandingkan komposisi antar dua tahun.</p>
        <PlotlyChart
          data={stackedGood}
          title="Komposisi DPK 2024 vs 2025"
          layout={{ barmode: "stack", xaxis: { title: "Tahun" }, yaxis: { title: "%" } }}
        />
        <div className="chart-guide">
          <p><strong>Cara membaca:</strong> tiap batang = 100%; segmen = produk.</p>
          <p><strong>Interpretasi:</strong> Tabungan menguat, Giro melemah — pergeseran yang di pie chart tak terlihat.</p>
        </div>
        <p><strong>Kenapa:</strong> mata akurat membandingkan panjang, buruk membandingkan sudut. <strong>Contoh nyata:</strong> komposisi portofolio kredit per sektor antar tahun.</p>
      </div>

      <div className="decision-card">
        <h3>4. "Apakah limit mengikuti penghasilan?" → Scatterplot</h3>
        <p><strong>Kondisi:</strong> dua variabel numerik, ingin tahu hubungannya + ada anomali?</p>
        <PlotlyChart
          data={scatterRel}
          title="Penghasilan vs Limit Disetujui"
          layout={{ xaxis: { title: "Penghasilan (juta Rp)" }, yaxis: { title: "Limit disetujui (juta Rp)" }, showlegend: false }}
        />
        <div className="chart-guide">
          <p><strong>Cara membaca:</strong> tiap titik = satu nasabah.</p>
          <p><strong>Interpretasi:</strong> pita menanjak = hubungan positif kuat; tidak ada titik liar = kebijakan konsisten.</p>
        </div>
        <p><strong>Kenapa:</strong> satu-satunya chart yang menunjukkan hubungan apa adanya (termasuk pola non-linear yang dikira "tidak ada hubungan"). <strong>Contoh nyata:</strong> validasi angka korelasi sebelum regresi (Anscombe!).</p>
      </div>

      <div className="decision-card" style={{ borderColor: "var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tanya tujuannya dulu</strong> — bandingkan? tren? distribusi? hubungan? komposisi?</li>
          <li>Bar → <strong>sumbu dari nol</strong>. Line → <strong>X harus urutan waktu</strong>. Pie → <strong>maks 5 slice</strong>.</li>
          <li><strong>Satu chart, satu pesan.</strong> Butuh 3 paragraf menjelaskan? Pecah.</li>
          <li>Sebelum percaya chart orang: <strong>cek sumbu, cek skala, hitung lie factor</strong> kalau curiga.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Bedah Slide Direksi yang Menipu</h2>
      <div className="card">
        <p>Kamu analis di Bank Sejahtera. Tim marketing mengirim slide untuk rapat direksi besok:</p>
        <ul>
          <li><strong>Judul slide:</strong> "Pertumbuhan Tabungan Melonjak 3× Lipat!"</li>
          <li><strong>Chart:</strong> bar chart 3D dua batang — Q3 (pendek) vs Q4 (menjulang ±3× lebih tinggi)</li>
          <li><strong>Angka kecil di footnote:</strong> Q3 = Rp485 M, Q4 = Rp505 M. Sumbu Y mulai dari Rp480 M.</li>
          <li><strong>Periode:</strong> hanya Q3–Q4 2025 yang ditampilkan (data Q1–Q2 "tidak tersedia")</li>
        </ul>
        <p><strong>Tugasmu (tulis sebelum buka pembahasan):</strong></p>
        <ol>
          <li>Sebutkan <strong>minimal 3 trik visual</strong> yang dipakai slide ini.</li>
          <li>Hitung <strong>lie factor</strong>-nya (efek visual vs efek data).</li>
          <li>Tulis <strong>satu kalimat</strong> koreksi jujur untuk direksi.</li>
        </ol>
        <details className="worked"><summary>💡 Pembahasan</summary>
          <p><strong>Trik 1 — sumbu terpotong:</strong> Y mulai dari 480, bukan 0. Batang Q4 terlihat 3× batang Q3.</p>
          <p><strong>Trik 2 — efek 3D:</strong> distorsi perspektif membuat batang depan (Q4) tampak lebih besar dari nilai sebenarnya.</p>
          <p><strong>Trik 3 — cherry-picking periode:</strong> hanya 2 kuartal terbaik yang ditampilkan; Q1–Q2 disembunyikan. Mungkin Q4 hanya rebound dari Q3 yang anjlok.</p>
          <p><strong>Lie factor:</strong> efek visual ≈ 200% (3× lipat = +200%); efek data = (505−485)/485 ≈ 4,1%. LF ≈ 200/4,1 ≈ <strong>49</strong> — distorsi berat (batas jujur: 1,05).</p>
          <p><strong>Kalimat koreksi:</strong> <em>"Tabungan naik 4,1% dari Rp485 M ke Rp505 M pada Q4 — pertumbuhan positif namun moderat, bukan tiga kali lipat; saya lampirkan versi sumbu-nol dan tren 4 kuartal."</em></p>
          <p><strong>Pelajaran:</strong> analis yang baik tidak hanya <em>membuat</em> chart jujur — ia juga <em>menjaga</em> direksi dari chart yang tidak jujur. Itu bagian dari pekerjaan risiko.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu</h2>

      <Quiz
        question="Bandingkan penjualan 15 produk. Chart terbaik?"
        options={[
          "Pie chart 15 slice",
          "Horizontal bar chart, urut terbesar–terkecil",
          "3D pie chart",
          "Line chart",
        ]}
        correct={1}
        explanation="Bar horizontal mudah dibaca, urutan membantu perbandingan. Pie 15 slice tidak terbaca; 3D mendistorsi; line chart untuk tren waktu, bukan kategori."
      />

      <Quiz
        question="Kamu melihat bar chart 'Pertumbuhan Nasabah' dengan Y mulai dari 8.000 dan dua bar terlihat beda 3x lipat. Apa yang harus dilakukan?"
        options={[
          "Percaya chart — visual tidak berbohong",
          "Cek nilai aktual dan minta versi Y dari nol; beda visual bisa menipu",
          "Ganti ke pie chart",
          "Tambahkan efek 3D agar lebih jelas",
        ]}
        correct={1}
        explanation="Sumbu terpotong membesar-besarkan perbedaan. Selalu verifikasi nilai aktualnya — chart kiri vs kanan di lesson ini memakai data identik tapi bercerita beda."
      />

      <Quiz
        question="Dashboard risiko menampilkan 12 metrik dalam satu chart garis warna-warni. Masalahnya?"
        options={[
          "Tidak ada — semakin banyak semakin baik",
          "Melanggar 'satu chart, satu pesan'; pecah menjadi beberapa chart fokus",
          "Harus diganti pie chart",
          "Warna kurang banyak",
        ]}
        correct={1}
        explanation="Satu chart 12 garis = spaghetti yang tak terbaca. Pecah per tema (likuiditas, kredit, pasar), satu pesan per chart."
      />

      <Quiz
        question="Bar chart nilai 51 vs 52 dengan sumbu Y 50–53. Berapa lie factor-nya, dan artinya?"
        options={[
          "≈ 1 — jujur, visual proporsional dengan data",
          "≈ 2 — sedikit melebih-lebihkan",
          "≈ 51 — distorsi berat, chart membesar-besarkan 51x lipat",
          "≈ 0,5 — chart justru mengecilkan perbedaan",
        ]}
        correct={2}
        explanation="Efek visual = 100% (batang 2x lipat), efek data = 1,96%. LF = 100/1,96 ≈ 51 — jauh di atas batas jujur Tufte (1,05). Cek dengan Lab 1 di atas."
      />

      <Quiz
        question="Komposisi 8 produk DPK harus dipresentasikan ke direksi. Pilihan terbaik?"
        options={[
          "Pie chart 8 slice warna-warni",
          "Stacked bar (atau gabungkan slice kecil jadi 'Lainnya' hingga ≤ 5)",
          "3D pie chart agar terlihat modern",
          "Tabel angka mentah tanpa chart",
        ]}
        correct={1}
        explanation="Mata buruk membandingkan 8 sudut pie. Stacked bar memakai panjang (akurat) dan memungkinkan perbandingan antar periode. Pie hanya boleh ≤ 5 slice."
      />

      <Quiz
        question="Scatterplot tenor vs default membentuk pola huruf U, tapi korelasi Pearson r ≈ 0. Kesimpulan tepat?"
        options={[
          "Tidak ada hubungan — r = 0 membuktikannya",
          "Ada hubungan non-linear (U-shape); r hanya mengukur hubungan linear",
          "Datanya salah, buang saja",
          "Ganti ke pie chart",
        ]}
        correct={1}
        explanation="r ≈ 0 berarti tidak ada hubungan LINEAR, bukan tidak ada hubungan. Pola U = hubungan kuadratik yang nyata. Inilah kenapa Anscombe bersikeras: plot dulu, baru percaya angka."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="card"><ul>
        <li><strong>Si Arsitek:</strong> tujuan dulu, chart kemudian — satu chart, satu pesan. <em>Tidak dipakai saat:</em> kamu belum bisa merumuskan pertanyaan dalam satu kalimat.</li>
        <li><strong>Si Tukang Ukur:</strong> bar chart wajib sumbu Y dari nol; ukur kejujuran dengan <strong>lie factor</strong> (batas 1,05). <em>Tidak dipakai saat:</em> kategorinya bukan diskrit / perbandingannya bukan proporsional.</li>
        <li><strong>Si Pencerita Waktu:</strong> line chart hanya untuk X berurutan waktu; kemiringan = laju perubahan. <em>Tidak dipakai saat:</em> X-nya kategori acak (pakai bar).</li>
        <li><strong>Si Pemeriksa Kejujuran:</strong> histogram mengungkap bentuk (termasuk bimodal) yang disembunyikan angka ringkasan. <em>Tidak dipakai saat:</em> datanya kategorik.</li>
        <li><strong>Si Tukang Kue:</strong> komposisi &gt; 5 kategori → stacked bar, bukan pie. <em>Tidak dipakai saat:</em> ingin bandingkan antar periode (pie tidak bisa).</li>
        <li><strong>Si Mata-Mata Ganda:</strong> scatterplot memvalidasi klaim hubungan; waspadai dual axis. <em>Tidak dipakai saat:</em> salah satu variabel kategorik.</li>
        <li><strong>Prinsip tertinggi:</strong> chart yang tidak bisa dibaca tanpa 3 paragraf penjelasan — atau yang butuh trik sumbu agar terlihat bagus — <strong>sebaiknya tidak dibuat</strong>. Kejujuran visual adalah bagian dari integritas analis risiko.</li>
      </ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a19-eda-end-to-end" className="btn btn-primary btn-sm">Next: A1.9 →</Link>
      </div>
    </div>
  );
}
