import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A16Page() {
  const linearScatter = [
    {
      x: [150, 155, 160, 165, 170, 175, 180, 185],
      y: [50, 55, 60, 65, 70, 75, 80, 85],
      mode: "markers",
      type: "scatter",
      name: "Tinggi vs Berat",
      marker: { color: "#2a7de1", size: 10 },
    },
  ];

  const nonlinearScatter = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      y: [1, 4, 9, 16, 25, 36, 49, 64],
      mode: "markers",
      type: "scatter",
      name: "y = x²",
      marker: { color: "#e8a838", size: 10 },
    },
  ];

  const outlierScatter = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 20],
      y: [2, 4, 5, 4, 5, 7, 6, 8, 25],
      mode: "markers",
      type: "scatter",
      name: "Dengan 1 outlier",
      marker: { color: ["#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1", "#d33f2e"], size: 10 },
    },
  ];

  const anscombeLike = [
    {
      x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
      y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
      mode: "markers",
      type: "scatter",
      name: "Dataset A (linear)",
      marker: { color: "#2a7de1", size: 10 },
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.6 — Statistika Deskriptif</span>
        <h1 className="display-title">Angka 0,92 yang Menyesatkan: Pearson, Spearman, Kendall</h1>
        <p className="lead">
          Korelasi mengukur "bergerak bersama" — bukan "saling menyebabkan". Tiga koefisien, tiga kepribadian, dan jebakan yang menelan Rp 800 juta.
        </p>
        <p className="meta">≈55 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kampanye Rp 800 Juta yang Tidak Menaikkan Apa-apa</a></li>
          <li><a href="#pearson">Pearson — Si Garis Lurus</a></li>
          <li><a href="#spearman">Spearman — Si Tukang Ranking</a></li>
          <li><a href="#kendall">Kendall — Si Penghitung Pasangan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pearson vs Spearman — Siapa yang Tahan Banting?</a></li>
          <li><a href="#jebakan">Jebakan Korelasi: Anscombe, Simpson, Spurious</a></li>
          <li><a href="#lab2">🔬 Lab 2: Korelasi Spurious dari Tren Bersama</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Koefisien Mana untuk Datamu</a></li>
          <li><a href="#case">📋 Mini-Case: Diversifikasi yang Tidak Mendiversifikasi</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkuman">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung korelasi Pearson langkah-demi-langkah dan menjelaskan arti tiap simbol dalam rumusnya.</li>
          <li>Memilih di antara Pearson, Spearman, dan Kendall berdasarkan jenis hubungan (linear vs monotonik) dan jenis data (interval vs ordinal).</li>
          <li>Memprediksi bagaimana outlier dan hubungan non-linear mengubah masing-masing koefisien — dan membuktikannya di lab.</li>
          <li>Mengenali tiga jebakan klasik (Anscombe, Simpson's paradox, korelasi spurious) dan menjelaskan mengapa "selalu plot dulu".</li>
          <li>Menjelaskan <em>correlation breakdown</em> dalam konteks risiko portofolio: mengapa korelasi historis bukan jaminan diversifikasi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kampanye Rp 800 Juta yang Tidak Menaikkan Apa-apa</h2>
      <div className="story">
        <p>Dimas, analis risiko di sebuah bank, menemukan angka cantik di dashboard: korelasi <strong>0,92</strong> antara frekuensi login mobile banking dan jumlah transaksi per nasabah. Ia presentasi ke direksi dengan satu slide penuh percaya diri: <em>"Naikkan login, transaksi ikut naik."</em></p>
        <p>Disetujui. Rp 800 juta digelontorkan untuk kampanye push notification "Yuk login tiap hari!" Login naik 34%. Transaksi? <strong>Flat.</strong> Nol koma nol.</p>
        <p>Investigasi tiga minggu kemudian menemukan jawabannya — dan jawabannya memalukan sekaligus sederhana: <strong>keduanya naik setiap tanggal gajian.</strong> Gajian (variabel ketiga yang tak pernah diukur) mendorong orang <em>sekaligus</em> login dan bertransaksi. Korelasinya nyata. Kausalitasnya nol. Rp 800 juta membeli pelajaran termahal dalam karier Dimas: <strong>korelasi mengukur "bergerak bersama", bukan "saling menyebabkan".</strong></p>
      </div>

      <h2 id="pearson">Pearson — Si Garis Lurus</h2>
      <p><strong>Definisi.</strong> Koefisien korelasi Pearson (<Tex math={String.raw`r`} />) mengukur <strong>kekuatan hubungan linear</strong> antara dua variabel. Rentang −1 (negatif sempurna) hingga +1 (positif sempurna); 0 = tidak ada hubungan <em>linear</em>.</p>
      <Tex math={String.raw`r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i - \bar{x})^2 \sum(y_i - \bar{y})^2}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`x_i, y_i`} />: pasangan data ke-i (misal tinggi dan berat orang ke-i)</li>
        <li><Tex math={String.raw`\bar{x}, \bar{y}`} />: mean masing-masing variabel — titik acuan "pusat"</li>
        <li><Tex math={String.raw`(x_i - \bar{x})(y_i - \bar{y})`} />: jika x dan y menyimpang ke <em>arah yang sama</em> dari pusatnya, hasil kali positif → menaikkan <Tex math={String.raw`r`} /></li>
        <li>Pembilang = kovariansi × n: "rata-rata kesearahan" kedua variabel</li>
        <li>Penyebut = perkalian jumlah kuadrat simpangan: menormalisasi agar hasil selalu di [−1, 1] — inilah yang membuat <Tex math={String.raw`r`} /> bisa dibandingkan antar pasangan variabel</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: r dari 4 titik (klik untuk buka)</summary>
        <p>Data: (1,2), (2,4), (3,5), (4,7). <Tex math={String.raw`\bar{x} = 2{,}5`} />, <Tex math={String.raw`\bar{y} = 4{,}5`} />.</p>
        <p><strong>Langkah 1</strong> — simpangan x: −1,5; −0,5; 0,5; 1,5. Simpangan y: −2,5; −0,5; 0,5; 2,5.</p>
        <p><strong>Langkah 2</strong> — hasil kali: 3,75; 0,25; 0,25; 3,75 → jumlah = <strong>8</strong>.</p>
        <p><strong>Langkah 3</strong> — penyebut: <Tex math={String.raw`\sqrt{(2{,}25+0{,}25+0{,}25+2{,}25)(6{,}25+0{,}25+0{,}25+6{,}25)} = \sqrt{5 \times 13} \approx 8{,}06`} />.</p>
        <p><Tex math={String.raw`r = 8 / 8{,}06 \approx 0{,}99`} /> → hubungan linear positif sangat kuat. Semua hasil kali positif karena x dan y selalu menyimpang searah.</p>
      </details>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = satu orang; sumbu-x tinggi (cm), sumbu-y berat (kg). Cari: apakah titik-titik membentuk "awan" yang memanjang miring?</p>
        <PlotlyChart
          data={linearScatter}
          title="Pearson Tinggi: Hubungan Linear Kuat (r ≈ 1)"
          layout={{ xaxis: { title: "Tinggi (cm)" }, yaxis: { title: "Berat (kg)" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> titik-titik nyaris membentuk garis lurus menanjak — inilah habitat alami Pearson. Di sinilah <Tex math={String.raw`r`} /> jujur dan maksimal.</p>
      </div>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> 8 titik biru membentuk pola rapi, 1 titik merah terpisah jauh di kanan atas. Bayangkan garis tren <em>dengan</em> dan <em>tanpa</em> titik merah itu.</p>
        <PlotlyChart
          data={outlierScatter}
          title="Satu Outlier Dapat Mengubah Pearson Drastis"
          layout={{ xaxis: { title: "x" }, yaxis: { title: "y" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> satu titik merah menarik seluruh perhitungan — karena rumus Pearson memakai <em>kuadrat</em> simpangan, satu penyimpangan besar mendominasi. Inilah mengapa syarat Pearson mencakup "tidak ada outlier ekstrem". Buktikan sendiri besarnya efek di Lab 1.</p>
      </div>

      <p><strong>Kepribadian Pearson:</strong> ia hanya bisa melihat garis lurus. Beri dia parabola, dia bilang "lumayan lurus" (r ≈ 0,97 untuk y=x² — tinggi tapi menipu). Beri dia satu outlier, dia langsung teralihkan. Cerdas, tapi berpikiran sempit.</p>

      <p><strong>Kapan memakai:</strong> data interval/rasio, hubungan diduga linear, tidak ada outlier ekstrem. Syaratnya — bukan saran, tapi syarat.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "r = 0 berarti tidak ada hubungan."</p>
        <p><strong>Yang benar:</strong> r = 0 hanya berarti tidak ada hubungan <em>linear</em>. Contoh mematikan: <Tex math={String.raw`y = x^2`} /> yang simetris di sekitar nol punya r ≈ 0 — padahal hubungannya deterministik sempurna! Selalu tanya: "nol linear, atau nol betulan?" Jawabannya hanya ada di scatterplot.</p>
      </div>

      <h2 id="spearman">Spearman — Si Tukang Ranking</h2>
      <p><strong>Definisi.</strong> Korelasi Spearman (<Tex math={String.raw`\rho`} />) = Pearson yang dihitung dari <strong>ranking</strong> data, bukan nilainya. Ia mengukur hubungan <strong>monotonik</strong> — "kalau x naik, y cenderung naik (atau turun)" — tanpa peduli bentuk kurvanya.</p>
      <Tex math={String.raw`\rho = 1 - \frac{6\sum d_i^2}{n(n^2-1)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`d_i`} />: selisih <em>ranking</em> x dan y pada data ke-i (bukan selisih nilainya!)</li>
        <li><Tex math={String.raw`n`} />: banyaknya data</li>
        <li>Jika semua ranking cocok sempurna (<Tex math={String.raw`d_i = 0`} /> semua), <Tex math={String.raw`\rho = 1`} /> — persis seperti Pearson, tapi untuk urutan</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: y = x² untuk x = 1..5 (klik untuk buka)</summary>
        <p>Data: x = 1,2,3,4,5 → y = 1,4,9,16,25.</p>
        <p><strong>Langkah 1</strong> — ranking x: 1,2,3,4,5. Ranking y: 1,2,3,4,5 (urutannya sama!).</p>
        <p><strong>Langkah 2</strong> — selisih ranking <Tex math={String.raw`d_i`} />: 0,0,0,0,0 → <Tex math={String.raw`\sum d_i^2 = 0`} />.</p>
        <p><strong>Langkah 3</strong> — <Tex math={String.raw`\rho = 1 - 0 = 1`} />. Sempurna! Pearson hanya ≈ 0,98 karena kurvanya tidak lurus — Spearman tidak peduli kelurusan, hanya urutan.</p>
      </details>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = x, sumbu-y = x². Perhatikan bentuknya: melengkung (parabola), bukan garis lurus — tapi selalu menanjak.</p>
        <PlotlyChart
          data={nonlinearScatter}
          title="Hubungan Kuadrat: Pearson < 1, Spearman = 1"
          layout={{ xaxis: { title: "x" }, yaxis: { title: "y = x²" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> pola "selalu menanjak tapi melengkung" = monotonik non-linear. Pearson ≈ 0,97 (bagus tapi tidak sempurna — ia kecewa karena tidak lurus); Spearman = 1,0 (sempurna — urutannya konsisten). Inilah perbedaan "linear" vs "monotonik" yang terlihat.</p>
      </div>

      <p><strong>Kepribadian Spearman:</strong> ia tidak peduli seberapa jauh jarak antar nilai — hanya siapa di depan siapa. Karena itu outlier tidak bisa menyuapnya: nilai 1 miliar tetap cuma "ranking 1". Tukang ranking yang tidak bisa dibeli.</p>

      <p><strong>Kapan memakai:</strong> data ordinal (rating AAA/AA/A, skala kepuasan), atau hubungan monotonik yang jelas non-linear (dosis vs respons yang jenuh).</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Spearman selalu ≥ Pearson, jadi pakai Spearman saja."</p>
        <p><strong>Yang benar:</strong> tidak ada jaminan urutan begitu — keduanya mengukur hal <em>berbeda</em> (linear vs monotonik). Pada hubungan linear bersih dengan sedikit noise, Pearson justru lebih tepat dan lebih efisien. Pilih berdasarkan <em>jenis hubungan yang kamu cari</em>, bukan angka yang lebih besar.</p>
      </div>

      <h2 id="kendall">Kendall — Si Penghitung Pasangan</h2>
      <p><strong>Definisi.</strong> Korelasi Kendall (<Tex math={String.raw`\tau`} />) menghitung semua <em>pasangan</em> data: pasangan <strong>konkordan</strong> (x dan y bergerak searah) vs <strong>diskordan</strong> (berlawanan arah).</p>
      <Tex math={String.raw`\tau = \frac{\text{konkordan} - \text{diskordan}}{\text{total pasangan}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><strong>Konkordan:</strong> pasangan (i,j) di mana <Tex math={String.raw`x_i > x_j`} /> <em>dan</em> <Tex math={String.raw`y_i > y_j`} /> — keduanya setuju arah</li>
        <li><strong>Diskordan:</strong> pasangan di mana arahnya bertentangan</li>
        <li><strong>Total pasangan</strong> = <Tex math={String.raw`n(n-1)/2`} /> — semua pasangan yang mungkin</li>
        <li><Tex math={String.raw`\tau = 1`} />: semua pasangan searah. <Tex math={String.raw`\tau = -1`} />: semua berlawanan.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: 4 data, 6 pasangan (klik untuk buka)</summary>
        <p>Data: (1,2), (2,3), (3,1), (4,4). Total pasangan = 4×3/2 = <strong>6</strong>.</p>
        <p><strong>Langkah 1</strong> — periksa tiap pasangan (lihat x naik, apakah y ikut naik?): (1,2)-(2,3) ✓ searah; (1,2)-(3,1) ✗ (y turun); (1,2)-(4,4) ✓; (2,3)-(3,1) ✗; (2,3)-(4,4) ✓; (3,1)-(4,4) ✓.</p>
        <p><strong>Langkah 2</strong> — konkordan = 4, diskordan = 2.</p>
        <p><strong>Langkah 3</strong> — <Tex math={String.raw`\tau = (4-2)/6 \approx 0{,}33`} />. Hubungan monotonik positif lemah — satu data "bandel" (3,1) merusak 2 pasangan.</p>
      </details>

      <p><strong>Kepribadian Kendall:</strong> paling sabar dan teliti — memeriksa <em>setiap</em> pasangan satu per satu. Lambat (komputasi O(n²)), tapi paling bisa diandalkan untuk sampel kecil dan paling jujur menghadapi <em>ties</em> (nilai kembar).</p>

      <p><strong>Kapan memakai:</strong> sampel kecil (n &lt; 30), banyak nilai kembar (ties) — misal ranking juri, survei skala Likert pendek.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Kendall dan Spearman bisa dipertukarkan — toh sama-sama rank."</p>
        <p><strong>Yang benar:</strong> untuk data yang sama, nilai <Tex math={String.raw`\tau`} /> biasanya <em>lebih kecil</em> dari <Tex math={String.raw`\rho`} /> — skalanya berbeda, jadi "0,5" Kendall ≠ "0,5" Spearman dalam kekuatan. Kendall lebih konservatif dan punya interpretasi peluang yang bersih (selisih probabilitas pasangan searah vs berlawanan).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> korelasi butuh <em>variasi</em> di kedua variabel. Jika satu variabel konstan (semua nasabah "lunas" — tidak ada yang default), penyebut rumus Pearson = 0 dan <Tex math={String.raw`r`} /> tidak terdefinisi. "Tidak ada variasi → tidak ada korelasi yang bisa dihitung" — jebakan umum saat menganalisis segmen yang terlalu homogen.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Pearson vs Spearman — Siapa yang Tahan Banting?</h2>
      <PyodideLab
        title="🔬 Lab 1: Pearson vs Spearman — Siapa yang Tahan Banting?"
        hint="Ganti outlier (20, 200) jadi (20, 5) — Pearson bisa anjlok, Spearman nyaris tidak bergerak. Itulah bedanya 'peduli nilai' vs 'peduli urutan'."
        defaultCode={`import statistics as st\ndef rankdata(d):\n    s = sorted(d)\n    return [s.index(x) + 1 for x in d]  # tanpa ties, cukup\nx = [1, 2, 3, 4, 5, 6, 7, 8]\ny = [1, 4, 9, 16, 25, 36, 49, 64]  # y = x^2: monotonik, non-linear\nprint("Data parabola (tanpa outlier):")\nprint("  Pearson :", round(st.correlation(x, y), 4))\nprint("  Spearman:", round(st.correlation(rankdata(x), rankdata(y)), 4))\nx2, y2 = x + [20], y + [200]  # COBA UBAH: (20, 200) -> (20, 5)\nprint("Setelah tambah 1 outlier:")\nprint("  Pearson :", round(st.correlation(x2, y2), 4))\nprint("  Spearman:", round(st.correlation(rankdata(x2), rankdata(y2)), 4))`}
      />

      <h2 id="jebakan">Jebakan Korelasi: Anscombe, Simpson, Spurious</h2>

      <h3>Anscombe's Quartet — Empat Dataset, Satu Angka</h3>
      <p>Empat dataset dengan <strong>statistik identik</strong>:</p>
      <ul>
        <li>Mean x = 9, mean y = 7,5</li>
        <li>Pearson r = 0,816</li>
        <li>Garis regresi sama persis</li>
      </ul>
      <p>Tapi scatterplot-nya <strong>sangat beda</strong>: satu linear, satu kurva parabola, satu linear dengan satu outlier raksasa, satu garis vertikal (x konstan)!</p>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> ini baru SATU dari empat dataset Anscombe (yang "normal"). Tiga saudaranya punya angka statistik <em>persis sama</em> — mean, r, regresi — tapi bentuknya: parabola, satu outlier, dan garis vertikal.</p>
        <PlotlyChart
          data={anscombeLike}
          title="Satu dari Anscombe's Quartet — Statistik Sama, Cerita Beda"
          layout={{ xaxis: { title: "x" }, yaxis: { title: "y" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> angka r = 0,816 pada dataset ini berarti "hubungan linear sedang-kuat". Pada saudaranya yang parabola, r = 0,816 berarti <em>hubungan non-linear sempurna yang disalahartikan</em>. Angka yang sama, makna yang berlawanan. <strong>Plot dulu, hitung kemudian.</strong></p>
      </div>

      <h3>Simpson's Paradox — Agregat Berbohong</h3>
      <p>Korelasi di level agregat <strong>berlawanan arah</strong> dengan korelasi di tiap grup.</p>
      <p><strong>Contoh:</strong> obat vs kesembuhan.</p>
      <ul>
        <li>Agregat: obat berkorelasi <em>negatif</em> dengan sembuh (terlihat buruk!)</li>
        <li>Per grup usia: obat <em>positif</em> di setiap grup</li>
      </ul>
      <p>Penjelasan: pasien yang lebih sakit (dan lebih tua) cenderung diberi obat — <strong>usia adalah <em>confounder</em></strong> yang tidak dikontrol. Dalam kredit: "limit besar berkorelasi dengan default tinggi" bisa berbalik setelah dikontrol segmen pendapatan.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Data agregat selalu lebih bisa dipercaya karena n lebih besar."</p>
        <p><strong>Yang benar:</strong> n besar tidak menyembuhkan bias struktural — ia justru membuat kesimpulan yang salah terlihat <em>lebih meyakinkan</em> secara statistik. Selalu pecah per segmen yang relevan (produk, wilayah, vintage) sebelum percaya pada angka agregat.</p>
      </div>

      <h3>Korelasi Spurious — Korelasi Tanpa Hubungan</h3>
      <p>Dua hal berkorelasi tinggi tanpa hubungan logis — karena <em>common cause</em> atau kebetulan murni.</p>
      <p><strong>Contoh klasik:</strong> konsumsi keju vs kematian terlilit sprei (r = 0,95!). Keduanya naik seiring populasi dan waktu — tidak ada yang menyebabkan yang lain.</p>
      <p><strong>Versi keuangannya:</strong> dua saham yang sama-sama uptrend dalam 5 tahun bull market akan berkorelasi tinggi — bukan karena bisnisnya terkait, tapi karena <em>pasarnya</em> yang naik. Inilah alasan diversifikasi semu begitu berbahaya.</p>

      <div className="tip">
        <p><strong>💡 Untuk data time series:</strong> tren bersama adalah pabrik korelasi spurious. Sebelum menghitung korelasi antar dua deret waktu, <em>difference</em> dulu (korelasikan perubahannya, bukan levelnya) atau detrend. Korelasi level harga dua saham uptrend ≈ tidak informatif; korelasi <em>return</em>-nya yang bermakna.</p>
      </div>

      <h2 id="lab2">🔬 Lab 2: Korelasi Spurious dari Tren Bersama</h2>
      <PyodideLab
        title="🔬 Lab 2: Korelasi Spurious dari Tren Bersama"
        hint="Ubah seed (7 → angka lain). Kadang r tetap > 0,9 — dua deret ACAK yang independen bisa terlihat 'berhubungan'. Itulah jebakan tren bersama."
        defaultCode={`import random, statistics as st\nrandom.seed(7)\na = [0]; b = [100]\nfor i in range(50):\n    a.append(a[-1] + random.gauss(2, 1))  # deret acak independen #1\n    b.append(b[-1] + random.gauss(3, 2))  # deret acak independen #2\nprint("Korelasi LEVEL (mentah):", round(st.correlation(a, b), 3))\nprint("Padahal keduanya dibangkitkan acak dan independen!")\nprint("Penyebab: tren naik bersama. Obatnya: differencing.")\nda = [a[i+1] - a[i] for i in range(len(a) - 1)]\ndb = [b[i+1] - b[i] for i in range(len(b) - 1)]\nprint("Korelasi PERUBAHAN (differenced):", round(st.correlation(da, db), 3))\nprint("COBA: ubah seed lalu jalankan ulang beberapa kali.")`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Koefisien Mana untuk Datamu</h2>

      <div className="decision-card">
        <h3>1. Linear, interval/rasio, bersih → Pearson</h3>
        <p><strong>Kondisi:</strong> scatterplot menunjukkan awan memanjang lurus; tidak ada outlier ekstrem; kedua variabel numerik kontinu.</p>
        <p><strong>Kenapa:</strong> paling efisien dan punya interpretasi variansi yang jelas (<Tex math={String.raw`r^2`} /> = proporsi variansi bersama).</p>
        <p><strong>Contoh nyata:</strong> tinggi vs berat badan; suku bunga vs harga obligasi (durasi pendek).</p>
      </div>

      <div className="decision-card">
        <h3>2. Ordinal / monotonik non-linear → Spearman</h3>
        <p><strong>Kondisi:</strong> data ranking/peringkat, atau hubungan "selalu naik tapi melengkung" (efek jenuh, diminishing return).</p>
        <p><strong>Kenapa:</strong> hanya peduli urutan — kebal outlier dan tidak butuh linearitas.</p>
        <p><strong>Contoh nyata:</strong> rating kredit (AAA…D) vs probabilitas default; peringkat kepuasan vs retensi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Sampel kecil, banyak ties → Kendall</h3>
        <p><strong>Kondisi:</strong> n &lt; 30, atau banyak nilai kembar (skala Likert 1–5, ranking juri).</p>
        <p><strong>Kenapa:</strong> paling robust untuk sampel kecil; menangani ties paling jujur; interpretasi peluangnya bersih.</p>
        <p><strong>Contoh nyata:</strong> 12 analis me-ranking 8 skenario risiko — uji kesepakatan antar analis.</p>
      </div>

      <div className="decision-card">
        <h3>4. Time series / kondisi krisis → curigai dulu angkanya</h3>
        <p><strong>Kondisi:</strong> data deret waktu, atau korelasi yang akan dipakai untuk keputusan risiko (diversifikasi, hedging).</p>
        <p><strong>Kenapa:</strong> tren bersama menciptakan spurious; dan korelasi bisa <em>breakdown</em> saat stres (lihat mini-case).</p>
        <p><strong>Contoh nyata:</strong> korelasi return (bukan level harga!); korelasi <em>conditional</em> saat pasar turun &gt; 5%.</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Scatterplot dulu</strong> — bentuknya linear, melengkung, atau aneh? (Anscombe!)</li>
          <li>Linear + bersih → <strong>Pearson</strong>. Melengkung/ordinal → <strong>Spearman</strong>. Kecil + ties → <strong>Kendall</strong>.</li>
          <li>Time series → <strong>difference/detrend dulu</strong> sebelum percaya angka.</li>
          <li>Korelasi ≠ kausalitas. Selalu tanya: <strong>"variabel ketiga apa yang menggerakkan keduanya?"</strong> (pelajaran Rp 800 juta Dimas).</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Diversifikasi yang Tidak Mendiversifikasi</h2>
      <div className="callout">
        <p>Manajer investasi di sebuah bank mengelola dua reksa dana:</p>
        <ul>
          <li>Dana A (obligasi korporat) &amp; Dana B (saham perbankan): korelasi Pearson <strong>−0,15</strong> selama 2019–2024</li>
          <li>Kesimpulan komite: "hampir tidak berkorelasi → diversifikasi bagus" → alokasi 50/50</li>
          <li><strong>Stress test</strong> (skenario krisis likuiditas ala 2008): Dana A <strong>−18%</strong>, Dana B <strong>−22%</strong> — <em>jatuh bersamaan</em></li>
        </ul>
        <p><strong>Pertanyaan:</strong></p>
        <ol>
          <li>(a) Apa yang salah dari kesimpulan "diversifikasi bagus" berdasarkan r = −0,15?</li>
          <li>(b) Metrik atau analisis apa yang seharusnya dipakai selain korelasi historis tunggal?</li>
          <li>(c) Tindakan konkret untuk komite risiko minggu depan?</li>
        </ol>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>Correlation breakdown.</strong> Korelasi dihitung di masa tenang mengasumsikan hubungan <em>stabil</em>. Dalam krisis likuiditas, semua aset berisiko dijual bersamaan (<em>flight to safety</em>) — korelasi yang "rendah" melonjak mendekati +1 tepat saat diversifikasi paling dibutuhkan. Korelasi historis mengukur cuaca kemarin, bukan badai besok.</p>
          <p>(b) <strong>Korelasi kondisional</strong> (hitung r hanya pada hari-hari pasar turun &gt; 3%), <strong>tail dependence</strong> (probabilitas jatuh bersama di ekor distribusi), dan <strong>stress test skenario</strong> — bukan satu angka, tapi distribusi korelasi di berbagai rezim.</p>
          <p>(c) Tetapkan <strong>batas korelasi stres</strong> (bukan korelasi normal) sebagai input alokasi; wajibkan stress test likuiditas tiap kuartal; dokumentasikan asumsi "korelasi stabil" sebagai risiko yang disadari — bukan fakta.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu</h2>

      <Quiz
        question="Hubungan y = x² untuk x positif. Korelasi yang paling tepat?"
        options={[
          "Pearson (linear)",
          "Spearman (monotonik)",
          "Keduanya sama",
          "Tidak ada korelasi",
        ]}
        correct={1}
        explanation="Hubungan monotonik naik tapi non-linear. Pearson mengukur linearitas sehingga underestimate (r ≈ 0,97, bukan 1); Spearman menangkap peringkatnya dengan sempurna (ρ = 1). Pilih koefisien sesuai bentuk hubungan, bukan kebiasaan."
      />

      <Quiz
        question="Apa pelajaran utama dari Anscombe's Quartet?"
        options={[
          "Korelasi selalu akurat",
          "Selalu visualisasikan data",
          "Mean tidak penting",
          "Outlier tidak masalah",
        ]}
        correct={1}
        explanation="Statistik identik (mean, r = 0,816, regresi sama) bisa menyembunyikan pola yang sangat beda: linear, parabola, outlier, garis vertikal. Plot dulu, hitung kemudian — chart adalah alat validasi, bukan dekorasi."
      />

      <Quiz
        question="Dua saham A dan B punya korelasi Pearson −0,8 selama 5 tahun normal. Saat krisis, keduanya jatuh bersamaan. Apa yang terjadi?"
        options={[
          "Korelasi tetap −0,8 — matematika tidak berubah",
          "Correlation breakdown: korelasi bisa melonjak mendekati +1 saat stres",
          "Spearman akan tetap −0,8",
          "Diversifikasi dijamin aman",
        ]}
        correct={1}
        explanation="Dalam krisis, aset yang biasanya bergerak berlawanan bisa jatuh bersamaan (flight to safety / krisis likuiditas). Korelasi historis bukan jaminan — inilah mengapa stress testing ada dan mengapa diversifikasi semu berbahaya."
      />

      <Quiz
        question="Data rating kredit (ordinal: AAA, AA, A, BBB...) vs probabilitas default. Korelasi mana yang valid?"
        options={[
          "Pearson — standar industri",
          "Spearman/Kendall — data ordinal, hubungan monotonik",
          "Tidak bisa dihitung korelasi untuk ordinal",
          "Harus diubah ke angka 1-10 lalu Pearson",
        ]}
        correct={1}
        explanation="Rating adalah ordinal. Spearman/Kendall bekerja pada ranking — tepat untuk ordinal. Mengubah ke angka lalu Pearson mengasumsikan jarak antar rating sama (jarak AAA→AA = BB→B), yang salah secara konsep."
      />

      <Quiz
        question="r = 0,02 antara jam belajar dan nilai ujian pada 200 mahasiswa. Kesimpulan paling tepat?"
        options={[
          "Tidak ada hubungan sama sekali",
          "Tidak ada hubungan LINEAR — tapi bisa ada pola non-linear; cek scatterplot",
          "Pasti ada kesalahan input data",
          "Spearman pasti = 1",
        ]}
        correct={1}
        explanation="r hanya buta terhadap linearitas. Pola U-shape (yang belajar sangat sedikit DAN sangat banyak sama-sama dapat nilai rendah — misal karena burnout) memberi r ≈ 0 dengan hubungan yang nyata. Jangan simpulkan 'tidak ada hubungan' dari satu angka."
      />

      <Quiz
        question="Dua saham berkorelasi 0,9 selama 3 tahun bull market. Manajer menyimpulkan 'saham B bisa jadi pengganti A'. Apa jebakan terbesarnya?"
        options={[
          "Korelasi 0,9 belum cukup tinggi",
          "Korelasi level harga di masa uptrend bisa spurious (tren bersama); uji korelasi return + cek hubungan bisnis fundamentalnya",
          "Harusnya pakai Kendall",
          "Sampel 3 tahun terlalu kecil untuk Pearson",
        ]}
        correct={1}
        explanation="Dua saham yang sama-sama uptrend karena pasarnya naik akan berkorelasi tinggi tanpa hubungan bisnis. Itu korelasi level harga yang spurious. Yang bermakna: korelasi return (perubahan), plus alasan fundamental mengapa keduanya bergerak bersama."
      />

      <h2 id="rangkuman">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Pearson</strong> = kekuatan hubungan <em>linear</em>; efisien tapi buta non-linear dan rentan outlier. JANGAN untuk data ordinal, hubungan melengkung, atau data ber-outlier.</li>
          <li><strong>Spearman</strong> = Pearson-nya ranking; menangkap hubungan <em>monotonik</em> apa pun bentuknya; kebal outlier. JANGAN untuk hubungan non-monotonik (U-shape) — ρ ≈ 0 padahal ada pola.</li>
          <li><strong>Kendall</strong> = penghitung pasangan konkordan vs diskordan; terbaik untuk sampel kecil &amp; banyak ties. JANGAN untuk n besar tanpa alasan (O(n²), skala lebih konservatif).</li>
          <li><strong>Anscombe:</strong> angka sama ≠ cerita sama — selalu plot dulu.</li>
          <li><strong>Simpson:</strong> agregat bisa berbohong — pecah per segmen sebelum percaya.</li>
          <li><strong>Spurious:</strong> tren bersama / common cause menciptakan korelasi palsu — difference/detrend untuk time series.</li>
          <li><strong>Korelasi ≠ kausalitas</strong> — selalu cari variabel ketiga (pelajaran Rp 800 juta). Dan korelasi historis bisa <em>breakdown</em> saat krisis: jangan jadikan satu angka sebagai fondasi diversifikasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a17-missing-data" className="btn btn-primary btn-sm">Next: A1.7 →</Link>
      </div>
    </div>
  );
}
