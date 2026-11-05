import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A19Page() {
  const defaultRate = [
    {
      x: ["< 5 jt", "5–10 jt", "> 10 jt"],
      y: [18, 9, 4],
      type: "bar",
      marker: { color: ["#d33f2e", "#e8a838", "#3d9a50"] },
      text: ["18%", "9%", "4%"],
      textposition: "auto",
    },
  ];

  const incomeHist = [
    {
      x: [3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 14, 16, 20, 25, 35, 50, 80, 150, 500],
      type: "histogram",
      name: "Penghasilan (juta Rp)",
      marker: { color: "#2a7de1" },
    },
  ];

  const purposeBar = [
    {
      x: ["Modal kerja", "Konsumsi", "Investasi"],
      y: [60, 25, 15],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["60%", "25%", "15%"],
      textposition: "auto",
    },
  ];

  const purposeDefault = [
    {
      x: ["Modal kerja", "Konsumsi"],
      y: [6, 12],
      type: "bar",
      marker: { color: ["#3d9a50", "#d33f2e"] },
      text: ["6%", "12% (2x lipat!)"],
      textposition: "auto",
    },
  ];

  const missingSignal = [
    {
      x: ["Penghasilan terisi", "Penghasilan missing"],
      y: [9, 22],
      type: "bar",
      marker: { color: ["#2a7de1", "#d33f2e"] },
      text: ["9%", "22%"],
      textposition: "auto",
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.9 — Statistika Deskriptif</span>
        <h1 className="display-title">EDA End-to-End:<br />Dari Data Mentah ke Keputusan Direksi</h1>
        <p className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</p>
        <p className="lead">
          Menggabungkan semua — dari data mentah ke insight yang bisa dieksekusi.
        </p>
      </div>

      <div className="callout">
        <p><strong>Skenario:</strong> Kamu dapat dataset pengajuan kredit: 10.000 baris, 15 kolom. Bos minta: "Kasih tahu pola apa yang kamu temukan."</p>
        <p>Ini workflow EDA sistematis — memakai semua yang dipelajari di A1.1 sampai A1.8.</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model Termahal Kalah dari EDA 3 Jam</a></li>
          <li><a href="#k-grain">Konsep 1: Si Interogator — Grain &amp; Kamus Data</a></li>
          <li><a href="#k-kualitas">Konsep 2: Si Auditor — Kualitas Data</a></li>
          <li><a href="#k-univariat">Konsep 3: Si Potret Diri — Analisis Univariate</a></li>
          <li><a href="#k-bivariat">Konsep 4: Si Matchmaker — Bivariate vs Target</a></li>
          <li><a href="#k-bahasa">Konsep 5: Si Penerjemah — Insight ke Bahasa Bisnis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pipeline EDA — Bangkitkan Data &amp; Periksa Univariate</a></li>
          <li><a href="#lab2">🔬 Lab 2: Pipeline EDA — Bivariate &amp; Rekomendasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Temuan EDA → Tindakan</a></li>
          <li><a href="#case">📋 Mini-Case: Proyek EDA Kredit Mikro 10.000 Nasabah</a></li>
          <li><a href="#checklist">✅ Checklist EDA</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="card"><ul>
        <li>Menjalankan <strong>pipeline EDA lengkap</strong> (grain → kualitas → univariate → bivariate → rekomendasi) pada dataset kredit tanpa melewatkan langkah.</li>
        <li>Menghitung dan menginterpretasi <strong>missing rate</strong> dan <strong>default rate per segmen</strong> — termasuk mendeteksi ketika <em>missing itu sendiri</em> adalah sinyal.</li>
        <li>Mengaitkan setiap temuan EDA dengan konsep A1 yang tepat (mean vs median, outlier, korelasi, visualisasi) dan menjelaskan <strong>mengapa</strong> pilihannya benar.</li>
        <li>Menerjemahkan temuan statistik menjadi <strong>rekomendasi bisnis</strong> yang bisa dieksekusi — dan mengenali kapan EDA saja sudah cukup tanpa modeling.</li>
      </ul></div>

      <h2 id="cerita">Cerita Pembuka: Model Termahal Kalah dari EDA 3 Jam</h2>
      <div className="story">
        <p>Bank Nusantara punya masalah: default kredit mikro naik. Tim data science dikerahkan — dua minggu tuning XGBoost, ratusan eksperimen, AUC mentok di <strong>0,71</strong>. "Butuh data lebih banyak," kata mereka.</p>
        <p>Lalu Dini, analis senior yang baru kembali dari cuti, minta dataset mentahnya. Ia tidak buka XGBoost. Ia buka notebook kosong dan bertanya seperti detektif: <em>satu baris ini sebenarnya apa? kolom ini kenapa 15% kosong? kenapa penghasilan ada yang 500 juta?</em> Tiga jam kemudian ia kembali dengan tiga temuan: default terkonsentrasi di penghasilan &lt; 5 juta (18% vs 4%), kredit konsumsi default 2× lipat dari modal kerja, dan — yang paling mengejutkan — <strong>pengajuan dengan penghasilan kosong punya default 22%</strong>, pola yang cocok dengan aplikasi fiktif.</p>
        <p><strong>Twist-nya:</strong> rekomendasi Dini tidak butuh model sama sekali — verifikasi manual untuk segmen &lt; 5 juta, pricing dibedakan per tujuan kredit, dan penghasilan kosong langsung masuk antrean investigasi. Enam bulan kemudian default turun 30%. Model termahal kalah dari EDA tiga jam — <strong>karena EDA bertanya "data ini apa?", bukan "model apa yang cocok?"</strong>. Lesson ini mengajarkanmu menjadi Dini.</p>
      </div>

      <h2 id="k-grain">Konsep 1: Si Interogator — Grain &amp; Kamus Data</h2>
      <p><strong>Definisi.</strong> <strong>Grain</strong> adalah jawaban atas pertanyaan <em>"satu baris = apa?"</em> — unit observasi terkecil dalam dataset. <strong>Kamus data</strong> (data dictionary) mendokumentasikan setiap kolom: definisi bisnis, tipe, dan skala pengukuran (nominal/ordinal/interval/rasio, ingat A1.1).</p>

      <p><strong>Tanya dulu</strong> (ingat A1.1 — grain!):</p>
      <ul>
        <li>Satu baris = ? → <strong>Satu pengajuan kredit</strong> (bukan satu nasabah — satu nasabah bisa mengajukan 3×!)</li>
        <li>Periode? → Jan 2024 – Des 2025</li>
        <li>Target? → <code className="inline">default_12m</code> (1 = gagal bayar dalam 12 bulan)</li>
      </ul>
      <p><strong>Kamus data:</strong> Dokumentasikan setiap kolom — tipe, skala pengukuran (nominal/ordinal/interval/rasio), definisi bisnis. Tanpa ini, analis berikutnya akan salah mengartikan kolommu.</p>

      <details className="worked"><summary>📐 Contoh pengerjaan: grain yang salah merusak semua hitungan (klik untuk buka)</summary>
        <p>Dataset 10.000 baris pengajuan dari 8.500 nasabah unik (1.500 nasabah mengajukan ulang).</p>
        <p><strong>Langkah 1</strong> — analis junior mengira satu baris = satu nasabah → melapor "10.000 nasabah".</p>
        <p><strong>Langkah 2</strong> — ia hitung "rata-rata pengajuan per nasabah" = 10.000/10.000 = 1. Salah total.</p>
        <p><strong>Langkah 3</strong> — yang benar: grain = <em>pengajuan</em>. Jumlah nasabah = 8.500 (deduplikasi by ID). Rata-rata pengajuan per nasabah = 10.000/8.500 ≈ 1,18.</p>
        <p><strong>Pelajaran:</strong> COUNT, rata-rata, dan rate semuanya bergantung pada grain. Salah grain = semua angka di bawahnya salah arti — <em>meski perhitungannya benar</em>.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> grain adalah <strong>kontrak makna</strong> antara kamu dan data. Setiap metrik yang kamu hitung ("rata-rata", "persentase", "total") diam-diam mengasumsikan grain tertentu. Tulis grain di baris pertama notebook-mu — sebelum satu pun kode analisis.</div>

      <p><strong>Kapan memakai:</strong> selalu — langkah nol setiap proyek data, sebelum EDA maupun modeling. Di dunia kerja: tanyakan ke pemilik bisnis, jangan tebak dari nama file.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Grain itu obvious — lihat saja datanya."</b><br />
      <b>Yang benar:</b> grain hampir tidak pernah obvious. Tabel "transaksi" bisa berisi satu baris per item, per struk, atau per hari-per-toko. Tabel "pengajuan kredit" bisa per pengajuan atau per nasabah. Satu-satunya cara yang aman: <strong>tanya dan dokumentasikan</strong>. Asumsi grain yang salah adalah bug paling mahal — ia tidak error, ia hanya menghasilkan jawaban yang salah dengan percaya diri.</div>

      <h2 id="k-kualitas">Konsep 2: Si Auditor — Kualitas Data</h2>
      <p><strong>Definisi.</strong> Audit kualitas memeriksa <strong>apakah data layak dianalisis</strong> sebelum analisis dimulai: missing (kosong), duplikat, outlier, dan inkonsistensi logis. Prinsipnya: <em>model canggih di atas data kotor = sampah yang meyakinkan.</em></p>

      <p><strong>Rumus: missing rate</strong> — seberapa parah kekosongan tiap kolom:</p>
      <Tex math={String.raw`\text{missing rate} = \frac{n_{\text{missing}}}{n} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`n_{\text{missing}}`} />: jumlah baris yang kosong pada kolom itu.</li>
        <li><Tex math={String.raw`n`} />: total baris dataset.</li>
      </ul>
      <p>Contoh: <code className="inline">penghasilan</code> kosong di 1.500 dari 10.000 baris → missing rate = 15%.</p>

      <ul>
        <li><strong>Missing:</strong> Kolom apa yang banyak kosong? (<code className="inline">penghasilan</code> 15% missing — ingat A1.7!)</li>
        <li><strong>Duplikat:</strong> Ada nasabah ganda? (cek by ID + tanggal — grain!)</li>
        <li><strong>Outlier:</strong> Umur 250? Penghasilan negatif? (ingat A1.5 — investigasi dulu, jangan langsung hapus!)</li>
        <li><strong>Konsistensi:</strong> Tanggal lahir &gt; tanggal pengajuan? Tenor 0 bulan?</li>
      </ul>

      <details className="worked"><summary>📐 Contoh pengerjaan: audit 10 menit yang menyelamatkan proyek (klik untuk buka)</summary>
        <p><strong>Langkah 1 — missing:</strong> hitung missing rate per kolom. <code className="inline">penghasilan</code> 15%, sisanya &lt; 1%.</p>
        <p><strong>Langkah 2 — duplikat:</strong> 10.000 baris, 9.982 ID unik → 18 duplikat. Cek: pengajuan ganda di hari yang sama → gabungkan, jangan double-count.</p>
        <p><strong>Langkah 3 — outlier:</strong> umur max = 250 (salah input, investigasi → 25?), penghasilan max = 500 jt (mungkin valid — pengusaha; tandai, jangan hapus).</p>
        <p><strong>Langkah 4 — konsistensi:</strong> 3 baris tanggal lahir &gt; tanggal pengajuan → data entry error, eksklusi + laporkan ke tim input.</p>
        <p><strong>Hasil:</strong> 10 menit audit → dataset bersih + 1 temuan awal (missing penghasilan 15% — yang nanti jadi sinyal emas di Konsep 4).</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> auditor yang baik <strong>mencurigai setiap anomali tapi tidak menghakimi</strong>. Umur 250 hampir pasti salah input; penghasilan 500 juta mungkin pengusaha kaya. Aturannya: <em>investigasi dulu, hapus terakhir</em> — outlier yang dihapus tanpa investigasi adalah temuan yang dibuang.</div>

      <p><strong>Kapan memakai:</strong> setiap dataset baru, sebelum analisis apapun. Di production: jadikan automated data-quality checks (bukan sekali jalan).</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Missing = sampah, hapus saja barisnya."</b><br />
      <b>Yang benar:</b> missing sering kali <strong>bukan acak</strong> — dan ketidakacakannya adalah informasi (A1.7). Di case ini, penghasilan kosong justru menandai risiko tertinggi (22% default). Menghapus baris missing = membuang sinyal terbaikmu + membuat sampel bias. Perlakukan missing sebagai <em>kandidat fitur</em>, bukan sampah.</div>

      <div className="callout">
        <p><strong>Aturan:</strong> Jangan sentuh modeling sebelum kualitas data jelas. Model canggih di atas data kotor = sampah yang meyakinkan.</p>
      </div>

      <h2 id="k-univariat">Konsep 3: Si Potret Diri — Analisis Univariate</h2>
      <p><strong>Definisi.</strong> Analisis univariate memotret <strong>satu variabel dalam satu waktu</strong>: bagaimana bentuknya, di mana pusatnya, seberapa menyebar. Ini fondasi — kamu tidak bisa memahami hubungan antar variabel sebelum memahami tiap variabel sendiri (A1.2–A1.5).</p>
      <p>Untuk setiap kolom penting:</p>
      <ul>
        <li><strong>Numerik:</strong> Histogram + boxplot. Skewed? Outlier? (A1.2–A1.5)</li>
        <li><strong>Kategori:</strong> Bar chart frekuensi. Imbalanced? (A1.8)</li>
      </ul>

      <PlotlyChart
        data={incomeHist}
        title="Penghasilan: Right-Skewed dengan Outlier 500jt"
        layout={{ xaxis: { title: "Juta Rp" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = penghasilan (juta Rp), tinggi batang = jumlah pengajuan di rentang itu.</p>
        <p><strong>Interpretasi:</strong> massa menumpuk di kiri (3–16 jt) dengan ekor panjang ke kanan hingga 500 jt — <strong>right-skewed</strong>. Mean akan tertarik ke ekor; median (8 jt) mewakili tipikal. Outlier 500 jt: investigasi, jangan auto-hapus.</p>
      </div>
      <p><strong>Temuan contoh:</strong></p>
      <ul>
        <li><code className="inline">penghasilan</code>: right-skewed, median 8jt, ada outlier 500jt → pakai <strong>median</strong>, bukan mean (A1.2, A1.4)</li>
      </ul>

      <PlotlyChart
        data={purposeBar}
        title="Komposisi Tujuan Kredit"
        layout={{ xaxis: { title: "Tujuan" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu tujuan kredit, tinggi = persentasenya. Hanya 3 kategori → terbaca jelas (A1.8: pie ≤ 5, bar selalu aman).</p>
        <p><strong>Interpretasi:</strong> 60% modal kerja, 25% konsumsi, 15% investasi — portofolio didominasi kredit produktif. Kabar baik untuk kualitas portofolio… sampai kita lihat default rate-nya di Konsep 4.</p>
      </div>
      <ul>
        <li><code className="inline">tujuan_kredit</code>: 60% modal kerja, 25% konsumsi, 15% investasi</li>
      </ul>

      <details className="worked"><summary>📐 Contoh pengerjaan: checklist univariate 1 variabel (klik untuk buka)</summary>
        <p>Variabel: <code className="inline">tenor_bulan</code> (numerik).</p>
        <p><strong>Langkah 1</strong> — plot histogram. Bentuk? Menumpuk di 12 &amp; 24 &amp; 36 (tenor standar produk) — <strong>multimodal karena desain produk</strong>, bukan anomali.</p>
        <p><strong>Langkah 2</strong> — pusat &amp; sebar: median 24, range 6–60. Ada nilai 0? → inkonsistensi (kembali ke Si Auditor).</p>
        <p><strong>Langkah 3</strong> — catat: "tenor diskrit mengikuti paket produk; pakai sebagai kategori ordinal saat bivariate."</p>
        <p><strong>Pelajaran:</strong> univariate yang baik selalu bertanya <em>"apakah bentuk ini masuk akal secara bisnis?"</em> — bukan sekadar melaporkan angka.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> univariate adalah <strong>wawancara perkenalan</strong> dengan tiap variabel. Variabel yang tidak kamu kenal bentuknya akan mengkhianatimu di tahap modeling — biasanya sebagai bug yang baru ketahuan setelah presentasi.</div>

      <p><strong>Kapan memakai:</strong> untuk setiap kolom penting, sebelum bivariate. Prioritaskan: target, variabel yang diduga prediktif, dan kolom dengan missing tinggi.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Univariate itu langkah basa-basi — yang penting kan hubungan dengan target."</b><br />
      <b>Yang benar:</b> hubungan dengan target tidak bisa diinterpretasi tanpa memahami tiap variabelnya. Contoh: default rate "tinggi" di segmen penghasilan &gt; 100 jt ternyata hanya 3 orang (sampel kecil!) — fakta yang hanya ketahuan dari histogram univariatenya. Bivariate tanpa univariate = kesimpulan di atas pasir.</div>

      <h2 id="k-bivariat">Konsep 4: Si Matchmaker — Bivariate vs Target</h2>
      <p><strong>Definisi.</strong> Analisis bivariate memasangkan <strong>setiap variabel dengan target</strong> (<code className="inline">default_12m</code>) untuk menemukan kandidat penyebab risiko. Ini inti EDA untuk analis risiko: <em>variabel apa yang membedakan nasabah macet dari yang lancar?</em></p>

      <p><strong>Rumus: default rate per segmen</strong> — metrik utama babak ini:</p>
      <Tex math={String.raw`DR = \frac{n_{\text{default}}}{n_{\text{segmen}}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`DR`} />: default rate segmen itu (dalam persen).</li>
        <li><Tex math={String.raw`n_{\text{default}}`} />: jumlah nasabah macet di segmen itu.</li>
        <li><Tex math={String.raw`n_{\text{segmen}}`} />: total nasabah di segmen itu.</li>
      </ul>
      <p>Contoh: segmen penghasilan &lt; 5 jt berisi 2.000 nasabah, 360 macet → DR = 360/2.000 × 100% = <strong>18%</strong>.</p>

      <PlotlyChart
        data={defaultRate}
        title="Default Rate per Segmen Penghasilan"
        layout={{ xaxis: { title: "Penghasilan" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu segmen penghasilan, tinggi = default rate-nya. Sumbu Y dari 0 — perbandingan proporsional (A1.8!).</p>
        <p><strong>Interpretasi:</strong> pola menurun monoton: 18% → 9% → 4%. Segmen &lt; 5 jt risikonya <strong>4,5× lipat</strong> dari segmen &gt; 10 jt. Ini temuan terkuat — besar efeknya, stabil polanya, langsung bisa jadi kebijakan.</p>
      </div>
      <div className="callout">
        <p><strong>Insight:</strong> Penghasilan rendah = risiko <strong>4,5x lipat</strong> (18% vs 4%)! Ini temuan yang langsung bisa jadi kebijakan.</p>
      </div>

      <PlotlyChart
        data={purposeDefault}
        title="Default Rate per Tujuan Kredit"
        layout={{ xaxis: { title: "Tujuan" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> bandingkan tinggi dua batang (sumbu dari 0).</p>
        <p><strong>Interpretasi:</strong> kredit konsumsi default <strong>2× lipat</strong> modal kerja (12% vs 6%). Masuk akal secara bisnis: konsumsi tidak menghasilkan arus kas untuk membayar cicilan. Kandidat kebijakan: pricing dibedakan per tujuan.</p>
      </div>

      <PlotlyChart
        data={missingSignal}
        title="Sinyal Tersembunyi: Default Rate saat Penghasilan Missing"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> bandingkan default rate pengajuan dengan penghasilan terisi vs kosong.</p>
        <p><strong>Interpretasi:</strong> penghasilan kosong → default <strong>22%</strong>, vs 9% yang terisi. Missing bukan acak — ia menandai pola berisiko (pengajuan tak terverifikasi / fiktif). Inilah "missing itu sinyal" (A1.7) dalam wujud nyata: temuan yang hanya muncul karena kita <em>tidak</em> menghapus missing di Konsep 2.</p>
      </div>

      <p><strong>Korelasi:</strong> Cek antar variabel numerik (waspadai multikolinearitas — A1.6). Plot scatterplot untuk pasangan penting; jangan percaya angka korelasi saja (Anscombe!).</p>

      <details className="worked"><summary>📐 Contoh pengerjaan: dari DR ke hipotesis kebijakan (klik untuk buka)</summary>
        <p><strong>Langkah 1</strong> — hitung DR per segmen untuk tiap variabel kandidat (penghasilan, tujuan, tenor, umur…).</p>
        <p><strong>Langkah 2</strong> — urutkan berdasarkan <strong>besaran efek</strong> (rasio DR tertinggi vs terendah), bukan sekadar "signifikan". Penghasilan: 4,5×. Tujuan: 2×. Umur: 1,2× (lemah).</p>
        <p><strong>Langkah 3</strong> — cek stabilitas: apakah pola 18→9→4 monoton dan masuk akal bisnis? Ya — makin mapan, makin lancar.</p>
        <p><strong>Langkah 4</strong> — rumuskan hipotesis kebijakan: "verifikasi manual penghasilan &lt; 5 jt akan memangkas default segmen itu." Siap diuji — inilah jembatan EDA → keputusan.</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> analis junior melaporkan <em>"variabel X signifikan"</em>. Analis senior melaporkan <em>"segmen X default 4,5× lipat dari segmen Y — kalau kita perketat verifikasi di sana, ini estimasi dampaknya"</em>. <strong>Besaran efek + bahasa bisnis</strong> itulah yang membuat EDA-mu dibaca direksi, bukan cuma disimpan.</div>

      <p><strong>Kapan memakai:</strong> setelah univariate selesai, untuk semua variabel kandidat vs target. Ulangi tiap ada data baru (monitoring!): pola DR bisa bergeser.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "EDA membuktikan X menyebabkan default."</b><br />
      <b>Yang benar:</b> EDA menemukan <strong>asosiasi</strong>, bukan kausalitas. Penghasilan rendah <em>berhubungan</em> dengan default tinggi — tapi penyebabnya bisa variabel ketiga (misal: pekerjaan informal → penghasilan rendah <em>dan</em> tak terverifikasi). EDA menghasilkan <strong>hipotesis berprioritas</strong>; pembuktian kausal butuh desain lanjutan. Jangan tulis "menyebabkan" di laporan — tulis "terkonsentrasi pada" atau "berhubungan dengan".</div>

      <h2 id="k-bahasa">Konsep 5: Si Penerjemah — Insight ke Bahasa Bisnis</h2>
      <p><strong>Definisi.</strong> Tahap penerjemah mengubah temuan statistik menjadi <strong>rekomendasi yang bisa dieksekusi</strong> oleh non-teknis: apa masalahnya, seberapa besar, apa yang harus dilakukan, siapa yang melakukannya.</p>

      <p><strong>Temuan:</strong></p>
      <ol>
        <li>Default terkonsentrasi di penghasilan &lt; 5jt (18% vs 4%)</li>
        <li>Tujuan konsumsi default 2x modal kerja</li>
        <li>Missing penghasilan sendiri prediktif (default 22%!) — ingat A1.7: <em>missing itu sinyal</em></li>
      </ol>
      <p><strong>Rekomendasi (bahasa bisnis):</strong></p>
      <ul>
        <li>Perketat verifikasi penghasilan &lt; 5jt</li>
        <li>Bedakan pricing per tujuan kredit</li>
        <li>Jangan abaikan missing — itu sinyal, bukan sampah</li>
      </ul>

      <details className="worked"><summary>📐 Contoh pengerjaan: satu temuan, dua versi kalimat (klik untuk buka)</summary>
        <p><strong>Temuan statistik:</strong> DR segmen &lt; 5 jt = 18% vs 4% baseline; n = 2.000.</p>
        <p><strong>Versi analis junior:</strong> <em>"Variabel penghasilan signifikan terhadap default (p &lt; 0,001)."</em> → Direksi: "…jadi ngapain?"</p>
        <p><strong>Versi Si Penerjemah:</strong> <em>"2.000 nasabah berpenghasilan di bawah 5 juta gagal bayar 4,5× lebih sering. Usulan: verifikasi slip gaji manual untuk segmen ini mulai bulan depan — estimasi memangkas 120 kasus macet per kuartal. Penanggung jawab: tim verifikasi."</em> → Direksi: "Setuju, jalan."</p>
        <p><strong>Formula kalimat rekomendasi:</strong> [siapa terdampak + berapa banyak] → [seberapa parah, dalam rasio] → [tindakan konkret + kapan] → [estimasi dampak + penanggung jawab].</p>
      </details>

      <div className="tip"><b>💡 Intuisi kunci:</b> insight yang tidak mengubah keputusan adalah <strong>trivia</strong>. Sebelum menulis rekomendasi, tanya: <em>"kalau direksi setuju, apa yang berubah Senin pagi?"</em> Kalau jawabannya "tidak ada", temuanmu belum matang — gali lagi atau buang.</div>

      <p><strong>Kapan memakai:</strong> di akhir setiap EDA — dan sebenarnya sejak awal: EDA yang baik sudah memikirkan "keputusan apa yang akan dibantu temuan ini?" sebelum mulai.</p>

      <div className="myth"><b className="t">🚨 Miskonsepsi: "Insight yang bagus = insight yang kompleks/canggih."</b><br />
      <b>Yang benar:</b> insight terbaik di case ini — <em>"penghasilan kosong = risiko 22%"</em> — ditemukan dengan <strong>satu bar chart</strong>, bukan model. Direksi tidak membayar kecanggihan; mereka membayar <strong>kejelasan yang bisa dieksekusi</strong>. Kompleksitas tanpa kejelasan adalah biaya, bukan nilai.</div>

      <h2 id="lab1">🔬 Lab 1: Pipeline EDA — Bangkitkan Data &amp; Periksa Univariate</h2>
      <p>Lab ini menjalankan <strong>dua tahap pertama pipeline</strong> pada data kredit sintetis (2.000 pengajuan): bangkitkan data → audit kualitas → potret univariate. Perhatikan bagaimana missing dan outlier muncul — persis seperti data asli.</p>
      <PyodideLab
        title="🔬 Lab 1: Bangkitkan Data + Audit + Univariate"
        hint="Coba ubah: seed (lihat apakah pola stabil?), p_missing (0.05 → 0.30 — kapan missing jadi masalah?), atau tambah outlier manual."
        defaultCode={`import random
random.seed(42)  # ubah seed -> pola harus tetap stabil

# ---- Bangkitkan 2000 pengajuan kredit sintetis ----
n = 2000
penghasilan, tujuan, default = [], [], []
p_missing = 0.15  # proporsi penghasilan kosong

for i in range(n):
    # penghasilan: lognormal-ish, median ~8jt
    inc = round(random.lognormvariate(2.1, 0.7), 1)
    if random.random() < 0.02:   # segelintir pengusaha kaya
        inc = round(random.uniform(100, 500), 1)
    miss = random.random() < p_missing
    tj = random.choices(["modal_kerja", "konsumsi", "investasi"],
                        weights=[60, 25, 15])[0]
    # peluang default: naik kalau miskin / konsumsi / missing
    p = 0.04 + (0.14 if inc < 5 else 0) + (0.06 if tj == "konsumsi" else 0) + (0.13 if miss else 0)
    d = 1 if random.random() < p else 0
    penghasilan.append(None if miss else inc)
    tujuan.append(tj)
    default.append(d)

# ---- SI AUDITOR: kualitas data ----
terisi = [x for x in penghasilan if x is not None]
missing_rate = (n - len(terisi)) / n * 100
print(f"n = {n}, missing penghasilan = {missing_rate:.1f}%")
print(f"max penghasilan = {max(terisi):.1f} jt  <- outlier? investigasi!")

# ---- SI POTRET DIRI: univariate ----
s = sorted(terisi)
median = s[len(s)//2]
mean = sum(terisi)/len(terisi)
print(f"\\nUnivariate penghasilan (terisi saja):")
print(f"  mean   = {mean:.1f} jt")
print(f"  median = {median:.1f} jt")
print(f"  mean/median = {mean/median:.2f}  {'<- miring kanan! pakai median' if mean/median > 1.2 else ''}")

from collections import Counter
print(f"\\nKomposisi tujuan: {dict(Counter(tujuan))}")
print(f"Overall default rate = {sum(default)/n*100:.1f}%")`}
      />

      <h2 id="lab2">🔬 Lab 2: Pipeline EDA — Bivariate &amp; Rekomendasi</h2>
      <p>Lanjutan Lab 1: pasangkan tiap variabel dengan target (<strong>Si Matchmaker</strong>), hitung default rate per segmen, lalu tulis rekomendasi bisnisnya (<strong>Si Penerjemah</strong>).</p>
      <PyodideLab
        title="🔬 Lab 2: Bivariate + Rekomendasi Bisnis"
        hint="Coba: ubah batas segmen (< 5jt jadi < 7jt) — apakah temuan 4,5x lipat tetap stabil? Temuan yang goyah saat batas digeser sedikit = temuan yang lemah."
        defaultCode={`import random
random.seed(42)
n = 2000
rows = []
for i in range(n):
    inc = round(random.lognormvariate(2.1, 0.7), 1)
    if random.random() < 0.02:
        inc = round(random.uniform(100, 500), 1)
    miss = random.random() < 0.15
    tj = random.choices(["modal_kerja", "konsumsi", "investasi"],
                        weights=[60, 25, 15])[0]
    p = 0.04 + (0.14 if inc < 5 else 0) + (0.06 if tj == "konsumsi" else 0) + (0.13 if miss else 0)
    rows.append((None if miss else inc, tj, miss, 1 if random.random() < p else 0))

def dr(sub):
    return sum(r[3] for r in sub)/len(sub)*100 if sub else 0

# ---- SI MATCHMAKER: default rate per segmen ----
seg_rendah = [r for r in rows if r[0] is not None and r[0] < 5]
seg_tinggi = [r for r in rows if r[0] is not None and r[0] > 10]
print(f"DR penghasilan < 5jt  : {dr(seg_rendah):.1f}% (n={len(seg_rendah)})")
print(f"DR penghasilan > 10jt : {dr(seg_tinggi):.1f}% (n={len(seg_tinggi)})")
print(f"Rasio risiko = {dr(seg_rendah)/dr(seg_tinggi):.1f}x lipat")

for tj in ["modal_kerja", "konsumsi"]:
    sub = [r for r in rows if r[1] == tj]
    print(f"DR tujuan {tj:11s}: {dr(sub):.1f}% (n={len(sub)})")

sub_miss = [r for r in rows if r[2]]
sub_isi = [r for r in rows if not r[2]]
print(f"DR penghasilan missing: {dr(sub_miss):.1f}% vs terisi {dr(sub_isi):.1f}%")

# ---- SI PENERJEMAH: tulis rekomendasi ----
print("\\n=== REKOMENDASI (bahasa bisnis) ===")
print(f"1. {len(seg_rendah)} nasabah < 5jt gagal bayar {dr(seg_rendah)/dr(seg_tinggi):.1f}x lebih sering -> verifikasi manual segmen ini.")
print("2. Kredit konsumsi 2x modal kerja -> bedakan pricing per tujuan.")
print(f"3. Penghasilan kosong = {dr(sub_miss):.1f}% default -> jadikan antrean investigasi, JANGAN dihapus." )`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Temuan EDA → Tindakan</h2>
      <p>Setiap temuan EDA menuntut respons berbeda. Empat skenario + aturan cepat:</p>

      <div className="decision-card">
        <h3>1. Ketemu outlier (umur 250, penghasilan 500 jt) → Investigasi, bukan auto-hapus</h3>
        <p><strong>Kondisi:</strong> nilai ekstrem muncul di audit/univariate.</p>
        <p><strong>Tindakan:</strong> cek ke sistem sumber / konfirmasi bisnis. Salah input → perbaiki. Valid tapi langka → tandai, analisis sensitivitas (hasil berubah drastis tanpanya?). <strong>Contoh nyata:</strong> penghasilan 500 jt ternyata direktur — menghapusnya menghilangkan segmen premium dari analisismu.</p>
      </div>

      <div className="decision-card">
        <h3>2. Missing 15% dan prediktif (DR 22%) → Jadikan fitur + investigasi pola</h3>
        <p><strong>Kondisi:</strong> missing rate tinggi <em>dan</em> berhubungan dengan target.</p>
        <p><strong>Tindakan:</strong> buat indikator <code className="inline">is_missing</code>, jangan imputasi-buta (mean-imputation menyembunyikan sinyal!). Selidiki <em>mengapa</em> kosong — di case ini polanya cocok aplikasi tak terverifikasi. <strong>Contoh nyata:</strong> kolom "pekerjaan" kosong menandai pengajuan via agen — segmen dengan insentif berbeda.</p>
      </div>

      <div className="decision-card">
        <h3>3. Dua variabel korelasi 0,92 (plafon vs penghasilan) → Waspadai multikolinearitas</h3>
        <p><strong>Kondisi:</strong> scatterplot + Pearson menunjukkan dua variabel bergerak hampir identik.</p>
        <p><strong>Tindakan:</strong> untuk EDA: laporkan keduanya tapi catat redundansinya. Untuk modeling: pilih satu (yang lebih stabil/murah didapat) atau gabungkan (rasio plafon/penghasilan — justru bisa jadi fitur risiko!). Jangan masukkan keduanya mentah-mentah ke regresi. <strong>Contoh nyata:</strong> "total limit kartu" vs "jumlah kartu × limit rata-rata" — sama saja, pilih satu.</p>
      </div>

      <div className="decision-card">
        <h3>4. Distribusi bimodal (dua punuk) → Segmentasi sebelum apapun</h3>
        <p><strong>Kondisi:</strong> histogram menunjukkan dua kelompok (ingat A1.8 — Si Pemeriksa Kejujuran).</p>
        <p><strong>Tindakan:</strong> jangan hitung satu angka ringkasan untuk dua populasi. Pisahkan segmen, jalankan bivariate per segmen — polanya bisa <em>berbalik</em> (Simpson's paradox!). <strong>Contoh nyata:</strong> tenor 12 vs 36 bulan = dua produk berbeda; DR gabungan menipu, DR per produk jujur.</p>
      </div>

      <div className="decision-card" style={{ borderColor: "var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Grain dulu</strong> — satu baris = apa? Tulis di baris pertama notebook.</li>
          <li><strong>Audit sebelum analisis</strong> — missing, duplikat, outlier, konsistensi. 10 menit yang menyelamatkan.</li>
          <li><strong>Univariate sebelum bivariate</strong> — kenali tiap variabel sebelum dipasangkan.</li>
          <li>Laporkan <strong>besaran efek</strong> (4,5× lipat), bukan sekadar "signifikan".</li>
          <li>Akhiri dengan <strong>kalimat bisnis</strong>: siapa → apa → kapan → dampak.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Proyek EDA Kredit Mikro 10.000 Nasabah</h2>
      <div className="card">
        <p>Kamu analis risiko di Bank Sejahtera. Dataset <code className="inline">kredit_mikro_10k.csv</code> — 10.000 baris, 15 kolom, periode Jan 2024 – Des 2025:</p>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead><tr><th>Kolom</th><th>Tipe</th><th>Contoh</th><th>Catatan</th></tr></thead>
            <tbody>
              <tr><td><code className="inline">id_pengajuan</code></td><td>ID</td><td>KM-000123</td><td>Grain: 1 baris = 1 pengajuan</td></tr>
              <tr><td><code className="inline">tgl_pengajuan</code></td><td>Tanggal</td><td>2024-03-15</td><td>—</td></tr>
              <tr><td><code className="inline">umur</code></td><td>Numerik</td><td>34</td><td>Max 250?! → audit</td></tr>
              <tr><td><code className="inline">penghasilan</code></td><td>Numerik (jt)</td><td>8,5</td><td>15% missing</td></tr>
              <tr><td><code className="inline">pekerjaan</code></td><td>Kategori</td><td>wiraswasta</td><td>—</td></tr>
              <tr><td><code className="inline">tujuan_kredit</code></td><td>Kategori</td><td>modal_kerja</td><td>60/25/15</td></tr>
              <tr><td><code className="inline">tenor_bulan</code></td><td>Numerik</td><td>24</td><td>Paket: 6/12/24/36</td></tr>
              <tr><td><code className="inline">plafon</code></td><td>Numerik (jt)</td><td>50</td><td>Korelasi 0,92 dgn penghasilan?</td></tr>
              <tr><td><code className="inline">dp_persen</code></td><td>Numerik</td><td>20</td><td>—</td></tr>
              <tr><td><code className="inline">riwayat_telat_6m</code></td><td>Numerik</td><td>1</td><td>Jumlah keterlambatan 6 bln terakhir</td></tr>
              <tr><td><code className="inline">jumlah_kartu</code></td><td>Numerik</td><td>2</td><td>—</td></tr>
              <tr><td><code className="inline">domisili</code></td><td>Kategori</td><td>kota</td><td>kota/desa</td></tr>
              <tr><td><code className="inline">skor_biro</code></td><td>Numerik</td><td>680</td><td>300–850</td></tr>
              <tr><td><code className="inline">penghasilan_missing</code></td><td>Flag</td><td>0/1</td><td>Kamu yang membuatnya (A1.7!)</td></tr>
              <tr><td><code className="inline">default_12m</code></td><td>Target</td><td>0/1</td><td>1 = gagal bayar 12 bln</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>Tugasmu — kerjakan berurutan (tulis jawaban sebelum buka pembahasan):</strong></p>
        <ol>
          <li><strong>Si Interogator:</strong> apa grain-nya? Berapa nasabah unik jika 1.500 mengajukan ulang?</li>
          <li><strong>Si Auditor:</strong> 4 hal yang kamu cek + apa yang kamu lakukan untuk umur = 250?</li>
          <li><strong>Si Potret Diri:</strong> chart apa untuk <code className="inline">penghasilan</code> dan <code className="inline">tujuan_kredit</code>? Ukuran pusat apa untuk penghasilan?</li>
          <li><strong>Si Matchmaker:</strong> 3 variabel yang kamu prioritaskan untuk DR per segmen + alasannya.</li>
          <li><strong>Si Penerjemah:</strong> tulis 2 rekomendasi dalam bahasa bisnis (format: siapa → apa → kapan → dampak).</li>
        </ol>
        <details className="worked"><summary>💡 Pembahasan</summary>
          <p><strong>1. Grain:</strong> 1 baris = 1 pengajuan. Nasabah unik = 10.000 − 1.500 = <strong>8.500</strong>. Semua rate "per nasabah" harus dideduplikasi dulu.</p>
          <p><strong>2. Audit:</strong> missing per kolom (penghasilan 15%), duplikat ID, outlier (umur 250 → <strong>investigasi ke sistem sumber</strong>; kemungkinan salah input 25 — perbaiki, jangan hapus diam-diam), konsistensi (tgl lahir &gt; tgl pengajuan?).</p>
          <p><strong>3. Univariate:</strong> penghasilan → histogram (right-skewed → <strong>median</strong>); tujuan_kredit → bar chart frekuensi (3 kategori, imbalanced tapi wajar).</p>
          <p><strong>4. Matchmaker — prioritas:</strong> (a) penghasilan (efek terbesar, 4,5×), (b) tujuan_kredit (2×, actionable via pricing), (c) <code className="inline">penghasilan_missing</code> flag (22% — sinyal, bukan sampah). Plafon ditahan dulu: korelasi 0,92 dengan penghasilan = redundan.</p>
          <p><strong>5. Penerjemah (contoh):</strong> <em>"(a) 2.000 pengajuan berpenghasilan &lt; 5 jt gagal bayar 4,5× lebih sering — usulan: verifikasi manual segmen ini mulai bulan depan, estimasi −120 kasus macet/kuartal, PIC tim verifikasi. (b) Pengajuan tanpa data penghasilan (15%) default 22% — usulan: masukkan ke antrean investigasi fraud, jangan auto-approve, PIC tim risiko."</em></p>
          <p><strong>Pelajaran penutup:</strong> lima langkah ini — bukan model — yang menurunkan default 30% di cerita pembuka. EDA yang sistematis <em>adalah</em> analisisnya, bukan pemanasan.</p>
        </details>
      </div>

      <h2 id="checklist">✅ Checklist EDA</h2>
      <div className="callout">
        <ul>
          <li>☐ Grain didokumentasikan</li>
          <li>☐ Missing/lengkap per kolom</li>
          <li>☐ Distribusi setiap variabel (plot!)</li>
          <li>☐ Hubungan dengan target</li>
          <li>☐ Outlier diinvestigasi (bukan langsung hapus)</li>
          <li>☐ Insight ditulis dalam bahasa bisnis</li>
        </ul>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu</h2>

      <Quiz
        question="Langkah pertama EDA sebelum analisis apapun?"
        options={[
          "Langsung buat histogram semua kolom",
          "Pahami grain (satu baris = apa) dan buat kamus data",
          "Hapus semua outlier",
          "Jalankan model machine learning",
        ]}
        correct={1}
        explanation="Tanpa grain yang jelas, semua hitungan (COUNT, rata-rata, rate) bisa salah arti. Kamus data mencegah salah tafsir kolom. Ini fondasi — A1.1."
      />

      <Quiz
        question="Ditemukan: missing penghasilan punya default rate 22% (vs 9% rata-rata). Tindakan tepat?"
        options={[
          "Hapus baris missing — datanya tidak lengkap",
          "Isi dengan mean lalu lupakan",
          "Perlakukan missing sebagai sinyal: buat indikator + investigasi polanya",
          "Abaikan — missing tidak penting",
        ]}
        correct={2}
        explanation="Missing yang prediktif adalah temuan berharga (A1.7). Menghapusnya membuang sinyal; mengisinya dengan mean menyembunyikannya. Jadikan feature!"
      />

      <Quiz
        question="Manajer bertanya: 'Jadi variabel apa yang paling menentukan default?' Jawaban EDA yang tepat?"
        options={[
          "Penghasilan — default 18% vs 4% (4,5x lipat), temuan terkuat dan stabil",
          "Umur — korelasi Pearson 0,3",
          "Semua variabel sama penting",
          "Tidak bisa disimpulkan dari EDA",
        ]}
        correct={0}
        explanation="EDA yang baik menghasilkan hipotesis berprioritas dalam bahasa bisnis: besaran efek (4,5x), bukan sekadar 'signifikan'. Korelasi 0,3 tanpa konteks efek tidak cukup untuk keputusan."
      />

      <Quiz
        question="Boxplot penghasilan: median 8 jt, Q3 12 jt, whisker kanan memanjang sampai 500 jt. Interpretasi dan ukuran pusat yang tepat?"
        options={[
          "Simetris — pakai mean",
          "Right-skewed dengan outlier — pakai median (8 jt), investigasi outlier 500 jt",
          "Datanya rusak — hapus semua di atas 12 jt",
          "Distribusi normal — pakai mean dan SD saja",
        ]}
        correct={1}
        explanation="Whisker kanan panjang = ekor kanan = right-skewed (A1.4). Mean tertarik ke ekor; median mewakili tipikal. Outlier 500 jt diinvestigasi dulu (bisa pengusaha valid), bukan auto-hapus (A1.5)."
      />

      <Quiz
        question="Plafon dan penghasilan berkorelasi 0,92. Untuk analisis risiko, tindakan tepat?"
        options={[
          "Masukkan keduanya ke model — semakin banyak semakin baik",
          "Waspadai multikolinearitas: laporkan redundansinya, pilih satu atau buat rasio plafon/penghasilan",
          "Hapus keduanya — korelasi tinggi = tidak berguna",
          "Abaikan korelasi antar prediktor, yang penting dengan target",
        ]}
        correct={1}
        explanation="Korelasi 0,92 = keduanya membawa informasi hampir sama (A1.6). Di regresi ini mengacaukan koefisien. Solusi: pilih satu atau rekayasa fitur rasio — yang justru bisa lebih prediktif terhadap default."
      />

      <Quiz
        question="Junior melapor 'rata-rata 1,18 pengajuan per nasabah' dari 10.000 baris / 10.000 'nasabah'. Kesalahannya?"
        options={[
          "Pembagiannya salah hitung",
          "Grain salah: 1 baris = 1 pengajuan, bukan 1 nasabah — nasabah uniknya 8.500",
          "Harusnya pakai median, bukan mean",
          "Tidak ada kesalahan",
        ]}
        correct={1}
        explanation="Grain = pengajuan, bukan nasabah. Dengan 1.500 pengajuan ulang, nasabah unik = 8.500 dan rata-rata yang benar = 10.000/8.500 ≈ 1,18 — angkanya kebetulan mirip, tapi logikanya salah total. Salah grain = semua metrik 'per nasabah' salah arti."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="card"><ul>
        <li><strong>Si Interogator:</strong> grain = kontrak makna (satu baris = apa?) + kamus data. <em>Tidak dipakai saat:</em> tidak pernah — ini selalu langkah nol.</li>
        <li><strong>Si Auditor:</strong> missing rate, duplikat, outlier, konsistensi — investigasi dulu, hapus terakhir. <em>Tidak dipakai saat:</em> tidak pernah — data kotor = analisis sampah.</li>
        <li><strong>Si Potret Diri:</strong> univariate tiap variabel (histogram/boxplot/bar) sebelum dipasangkan. <em>Tidak dipakai saat:</em> variabel sudah dikenal bentuknya dari EDA sebelumnya (tetap spot-check!).</li>
        <li><strong>Si Matchmaker:</strong> default rate per segmen; prioritaskan <strong>besaran efek</strong> (4,5×), bukan sekadar signifikansi. <em>Tidak dipakai saat:</em> target belum terdefinisi jelas.</li>
        <li><strong>Si Penerjemah:</strong> insight → rekomendasi bisnis (siapa → apa → kapan → dampak). <em>Tidak dipakai saat:</em> temuan tidak mengubah keputusan Senin pagi — gali lagi atau buang.</li>
        <li><strong>Prinsip tertinggi:</strong> EDA bukan "lihat-lihat data" — ini <strong>investigasi sistematis</strong> yang menghasilkan hipotesis berprioritas. Seringkali insight EDA saja sudah cukup untuk keputusan bisnis; model adalah opsional, kejelasan adalah kewajiban.</li>
      </ul></div>

      <p><strong>Peta A1:</strong> A1.1 (tipe data) → A1.2 (pemusatan) → A1.3 (sebaran) → A1.4 (bentuk) → A1.5 (outlier) → A1.6 (korelasi) → A1.7 (missing) → A1.8 (visualisasi) → <strong>A1.9 (gabungkan semua)</strong>.</p>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/" className="btn btn-primary btn-sm">Selesai A1 ✓</Link>
      </div>
    </div>
  );
}
