import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A17Page() {
  const missingBar = [
    {
      x: ["nama", "tanggal_lahir", "pekerjaan", "penghasilan", "no_hp"],
      y: [0, 2, 5, 15, 8],
      type: "bar",
      marker: { color: ["#3d9a50", "#3d9a50", "#e8a838", "#d33f2e", "#e8a838"] },
      text: ["0%", "2%", "5%", "15%", "8%"],
      textposition: "auto",
    },
  ];

  const varianceDemo = [
    {
      x: ["SD asli", "SD setelah imputasi mean"],
      y: [2.5, 1.8],
      type: "bar",
      marker: { color: ["#2a7de1", "#d33f2e"] },
      text: ["2,50", "1,80 (underestimate!)"],
      textposition: "auto",
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.7 — Statistika Deskriptif</span>
        <h1 className="display-title">Missing Data: Lubang yang (Kadang) Bercerita</h1>
        <p className="lead">
          Dataset nyata selalu berlubang. MCAR, MAR, MNAR — kenali mengapa data hilang sebelum memutuskan cara menambalnya.
        </p>
        <p className="meta">≈50 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model AUC 0,91 yang Gagal di Produksi</a></li>
          <li><a href="#mekanisme">Tiga Mekanisme Missing: MCAR, MAR, MNAR</a></li>
          <li><a href="#strategi">Strategi Penanganan: Hapus, Tambal, atau Dengarkan</a></li>
          <li><a href="#lab1">🔬 Lab 1: MCAR vs MNAR — Siapa yang Membiaskan Mean?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Imputasi Mean Merusak Variansi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Strategi Mana untuk Pola Missing-mu</a></li>
          <li><a href="#case">📋 Mini-Case: Kolom Penghasilan 15% Kosong</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkuman">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengklasifikasikan pola missing ke MCAR, MAR, atau MNAR dari deskripsi kasus nyata — dan menjelaskan mengapa klasifikasinya menentukan obatnya.</li>
          <li>Menulis definisi formal tiap mekanisme dalam notasi peluang dan mengartikan tiap simbolnya.</li>
          <li>Membuktikan lewat simulasi bahwa MNAR membiaskan mean sementara MCAR tidak, serta bahwa imputasi mean mengecilkan variansi secara artifisial.</li>
          <li>Memilih strategi penanganan (hapus, imputasi sederhana, imputasi cerdas, indikator missing) yang defensible untuk tiap mekanisme.</li>
          <li>Mengenali missing struktural dan menjelaskan mengapa "mengisinya dengan apapun" adalah kesalahan konsep — plus kapan "hilangnya" itu sendiri adalah feature terbaik.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model AUC 0,91 yang Gagal di Produksi</h2>
      <div className="story">
        <p>Sinta, analis kredit di sebuah bank, baru saja merayakan: model scoring-nya mencapai <strong>AUC 0,91</strong> di data training. Direksi mengangguk puas. Model di-deploy ke produksi.</p>
        <p>Enam bulan kemudian, angka default <strong>2,3× lipat</strong> dari prediksi. Sinta panik dan membongkar pipeline. Temuannya membuat lututnya lemas: di data training, semua baris dengan kolom <em>penghasilan</em> kosong <strong>dihapus</strong> (listwise deletion — "biar bersih"). Di produksi, baris yang sama <strong>diisi median</strong> oleh skrip ETL ("biar tidak error").</p>
        <p>Dan inilah twist-nya: kelompok "penghasilan kosong" itu <strong>default 3× lebih sering</strong> daripada rata-rata. Model Sinta tidak pernah belajar mengenali mereka — di training mereka dibuang, di produksi mereka disamarkan jadi "nasabah median yang aman". <strong>Data yang dibuang saat training dan data yang ditambal saat produksi adalah kelompok yang sama: kelompok berisiko tertinggi.</strong></p>
        <p>Lubang di dataset bukan selalu kekosongan. Kadang, lubang itu sendiri adalah pesannya.</p>
      </div>

      <h2 id="mekanisme">Tiga Mekanisme Missing: MCAR, MAR, MNAR</h2>
      <p>Sebelum memilih strategi, kenali <em>mengapa</em> data hilang. Mekanismenya menentukan obatnya — salah diagnosis, salah pengobatan. Ketiga mekanisme punya definisi formal dalam notasi peluang; pahami, karena inilah bahasa yang dipakai paper dan dokumentasi model.</p>

      <h3>MCAR — Si Kebetulan Murni</h3>
      <p><strong>Definisi.</strong> Hilangnya <strong>tidak berhubungan dengan apapun</strong> — tidak dengan nilai yang hilang, tidak dengan variabel lain. Murni kecelakaan.</p>
      <Tex math={String.raw`P(R \mid Y_{obs}, Y_{mis}) = P(R)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`R`} />: indikator missing (1 = hilang, 0 = teramati) — "apakah data ini hilang?"</li>
        <li><Tex math={String.raw`Y_{obs}`} />: nilai-nilai yang teramati</li>
        <li><Tex math={String.raw`Y_{mis}`} />: nilai-nilai yang hilang (yang tidak kita lihat)</li>
        <li>Keseluruhan rumus: peluang sebuah data hilang <strong>sama saja</strong> apapun nilai variabel lain maupun nilai yang hilang itu sendiri — koin yang adil, tidak memihak siapa pun</li>
      </ul>
      <p><strong>Contoh:</strong> sensor rusak acak, file corrupt saat transfer, responden menumpahkan kopi ke kuesioner halaman 3.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: apakah ini MCAR? (klik untuk buka)</summary>
        <p>Survei 1.000 nasabah, 40 tidak menjawab pertanyaan "usia" karena <em>halaman kuesioner robek acak</em> di percetakan.</p>
        <p><strong>Langkah 1</strong> — tanya: apakah robeknya halaman berhubungan dengan usia responden? Tidak — robek di percetakan, sebelum kuesioner dibagikan.</p>
        <p><strong>Langkah 2</strong> — tanya: apakah berhubungan dengan variabel lain (pendapatan, wilayah)? Tidak juga.</p>
        <p><strong>Kesimpulan: MCAR.</strong> 960 responden yang tersisa adalah sampel acak yang representatif. Hapus 40 baris masih OK secara bias (tapi tetap buang informasi — lihat mitos di bawah).</p>
      </details>

      <p><strong>Kepribadian MCAR:</strong> satu-satunya mekanisme yang "jujur". Ia mengambil korban secara acak seperti undian — yang tersisa tetap cerminan populasi. Langka di dunia nyata, tapi menjadi patokan ideal.</p>

      <p><strong>Kapan "obatnya" sederhana:</strong> MCAR dan missing &lt; 5% → hapus baris masih valid (tidak bias).</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "MCAR berarti boleh abaikan missing-nya begitu saja."</p>
        <p><strong>Yang benar:</strong> "tidak bias" ≠ "tidak ada biaya". Menghapus 20% baris (walau MCAR) membuang 20% informasi: standard error membesar, power uji turun, interval kepercayaan melebar. Dan MCAR murni <em>jarang</em> — jangan klaim MCAR tanpa bukti (uji Little's MCAR test, atau bandingkan distribusi variabel lain antara yang missing vs tidak).</p>
      </div>

      <h3>MAR — Si Bisa Ditebak</h3>
      <p><strong>Definisi.</strong> Hilangnya <strong>berhubungan dengan variabel lain yang teramati</strong> — tapi <em>tidak</em> dengan nilai yang hilang itu sendiri (setelah mengontrol variabel teramati).</p>
      <Tex math={String.raw`P(R \mid Y_{obs}, Y_{mis}) = P(R \mid Y_{obs})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li>Simbol sama seperti MCAR, tapi ruas kanan sekarang memuat <Tex math={String.raw`Y_{obs}`} /></li>
        <li>Artinya: peluang hilang <strong>boleh</strong> bergantung pada variabel yang teramati (misal jabatan), <strong>asalkan</strong> setelah memperhitungkan variabel itu, nilai yang hilang sendiri tidak lagi memengaruhi peluang hilangnya</li>
        <li>Implikasi praktis: karena polanya "tertulis" di variabel teramati, kita bisa <strong>memodelkannya</strong> — inilah mengapa imputasi cerdas bekerja baik untuk MAR</li>
      </ul>
      <p><strong>Contoh:</strong> direktur cenderung tidak mengisi kolom gaji (missing berhubungan dengan <em>jabatan</em> yang teramati). Laki-laki lebih jarang mengisi survei depresi (berhubungan dengan <em>gender</em> yang teramati).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: direktur yang bungkam (klik untuk buka)</summary>
        <p>Data 500 karyawan: kolom gaji 12% kosong. Kamu curiga, lalu tabulasi:</p>
        <p><strong>Langkah 1</strong> — % missing per jabatan: staff 3%, manager 8%, direktur <strong>45%</strong>. Pola jelas: missing berhubungan dengan jabatan (teramati).</p>
        <p><strong>Langkah 2</strong> — tanya: di <em>dalam</em> kelompok direktur, apakah yang gajinya lebih tinggi lebih bungkam? Jika tidak ada bukti itu → MAR.</p>
        <p><strong>Kesimpulan: MAR.</strong> Kita bisa memprediksi "siapa yang missing" dari jabatan — dan mengimputasi gaji direktur dari pola gaji direktur lain (bukan dari rata-rata seluruh karyawan!).</p>
      </details>

      <p><strong>Kepribadian MAR:</strong> ia meninggalkan jejak. Seperti pencuri yang terekam CCTV — kamu tidak melihat wajahnya (nilainya), tapi kamu tahu dari pintu mana ia masuk (variabel teramati). Jejak itu cukup untuk merekonstruksi.</p>

      <p><strong>Kapan "obatnya" bekerja:</strong> imputasi berbasis model (regresi, KNN, MICE) yang memakai variabel teramati — inilah mekanisme tempat imputasi cerdas bersinar.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "'Random' di MAR berarti missing-nya acak."</p>
        <p><strong>Yang benar:</strong> nama "Missing At Random" adalah salah satu istilah paling menyesatkan dalam statistika. MAR justru berarti missing-nya <em>sistematis</em> (berpola!) — tapi polanya bisa dijelaskan oleh variabel yang teramati. "Random" di sini artinya "acak <em>setelah</em> mengontrol variabel teramati". Jangan tertipu namanya.</p>
      </div>

      <h3>MNAR — Si Penyembunyi</h3>
      <p><strong>Definisi.</strong> Hilangnya <strong>berhubungan dengan nilai yang hilang itu sendiri</strong> — sesuatu yang tidak bisa kita amati. Inilah yang paling berbahaya.</p>
      <Tex math={String.raw`P(R \mid Y_{obs}, Y_{mis}) \text{ bergantung pada } Y_{mis}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li>Ruas kiri sama, tapi sekarang <Tex math={String.raw`Y_{mis}`} /> — nilai yang <em>tidak terlihat</em> — ikut menentukan peluang hilangnya</li>
        <li>Artinya: alasan data hilang justru adalah <em>nilainya sendiri</em>. Orang bangkrut tidak melaporkan kebangkrutan; peminum berat tidak mengisi survei konsumsi alkohol</li>
        <li>Implikasi brutal: <strong>tidak ada</strong> variabel teramati yang bisa sepenuhnya menjelaskan polanya — data yang ada tidak cukup untuk memperbaiki diri sendiri</li>
      </ul>
      <p><strong>Contoh:</strong> survei kebangkrutan — yang bangkrut tidak merespons. Sensor yang mati justru saat suhu melebihi batasnya (nilai ekstrem mematikan sensor!).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: survei yang menipu diri sendiri (klik untuk buka)</summary>
        <p>Survei pendapatan: respons rate 70%. Rata-rata pendapatan responden = Rp 12 juta.</p>
        <p><strong>Langkah 1</strong> — tanya: siapa yang tidak merespons? Data sensus menunjukkan non-responden terkonsentrasi di dua ujung: sangat kaya (enggan pamer) dan sangat miskin (malu/ Sulit dijangkau).</p>
        <p><strong>Langkah 2</strong> — karena <em>tingkat pendapatan itu sendiri</em> memengaruhi peluang merespons → <strong>MNAR</strong>.</p>
        <p><strong>Kesimpulan:</strong> Rp 12 juta bukan estimasi yang bisa "diperbaiki" dengan imputasi dari data responden — karena data responden <em>secara sistematis</em> kehilangan kedua ujung. Butuh data eksternal (sensus, pajak) atau model seleksi eksplisit. Inilah tragedi Sinta: kelompok missing-nya adalah kelompok yang perilakunya paling berbeda.</p>
      </details>

      <p><strong>Kepribadian MNAR:</strong> ia menghapus jejaknya sendiri. Seperti pencuri yang mematikan CCTV <em>karena</em> ia mau mencuri — alasan hilangnya bukti adalah kejahatannya sendiri. Kamu tidak bisa merekonstruksi dari dalam; butuh informasi dari luar.</p>

      <p><strong>Kapan waspada maksimal:</strong> selalu. Asumsikan MNAR mungkin sampai terbukti sebaliknya — terutama untuk data sensitif (pendapatan, kesehatan, kepatuhan).</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "MICE (multiple imputation) bisa memperbaiki MNAR."</p>
        <p><strong>Yang benar:</strong> MICE mengasumsikan MAR. Untuk MNAR, MICE hanya mengulang bias dengan rapi — hasilnya terlihat meyakinkan tapi tetap salah arah. MNAR butuh <em>asumsi eksplisit</em> tentang mekanisme missing-nya (selection model, pattern-mixture model) atau data eksternal. Yang paling jujur sering kali: <strong>laporkan keterbatasan analisismu</strong> dan lakukan sensitivity analysis ("bagaimana jika non-responden 20% lebih buruk?").</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>Mekanisme</th><th>Pola</th><th>Contoh</th><th>Penanganan</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>MCAR</strong></td><td>Acak total</td><td>Sensor rusak</td><td>Hapus baris OK (jika &lt; 5%)</td></tr>
            <tr><td><strong>MAR</strong></td><td>Terkait variabel lain</td><td>Direktur tak isi gaji</td><td>Imputasi cerdas (regresi/KNN/MICE)</td></tr>
            <tr><td><strong>MNAR</strong></td><td>Terkait nilainya sendiri</td><td>Bangkrut tak lapor</td><td>Waspada; tak bisa diperbaiki penuh</td></tr>
          </tbody>
        </table>
      </div>

      <div className="tip">
        <p><strong>💡 Cara membedakan MAR vs MNAR dalam praktik:</strong> bandingkan distribusi variabel <em>teramati</em> antara kelompok missing vs tidak missing. Jika berbeda jelas (misal yang missing penghasilannya 80% wiraswasta) → minimal MAR, dan kamu tahu variabel apa yang menjelaskan polanya. Jika <em>tidak</em> berbeda → jangan bernapas lega: bisa jadi MCAR, bisa jadi MNAR yang rapi. Ketidakmampuan membedakan MAR dan MNAR dari data saja adalah fakta matematis — putuskan berdasarkan <em>logika domain</em>, bukan hanya statistik.</p>
      </div>

      <h2 id="strategi">Strategi Penanganan: Hapus, Tambal, atau Dengarkan</h2>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = nama kolom, tinggi batang = % baris yang kosong di kolom itu. Warna = tingkat bahaya (hijau &lt; 5%, kuning 5–10%, merah &gt; 10%).</p>
        <PlotlyChart
          data={missingBar}
          title="% Missing per Kolom — Laporkan Ini Dulu!"
          layout={{ yaxis: { title: "% Missing" }, xaxis: { title: "Kolom" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> kolom <em>penghasilan</em> (15%, merah) adalah prioritas — terlalu besar untuk dihapus diam-diam. <em>no_hp</em> (8%) dan <em>pekerjaan</em> (5%) butuh cek pola. <em>nama</em> (0%) aman. <strong>Langkah pertama analisis missing data selalu: laporkan tabel ini</strong> — sebelum satu baris pun dihapus atau diimputasi.</p>
      </div>

      <h3>Hapus (Deletion)</h3>
      <ul>
        <li><strong>Listwise:</strong> hapus baris yang punya missing apapun. Simpel, tapi boros — 5 kolom × 5% missing bisa berarti 25% baris hilang!</li>
        <li><strong>Pairwise:</strong> pakai data tersedia per analisis. Tiap analisis memakai n berbeda → hasil inkonsisten antar tabel.</li>
      </ul>
      <p><strong>Kapan OK:</strong> MCAR dan missing &lt; 5%, n besar. Di luar itu, penghapusan adalah keputusan analitis yang butuh justifikasi tertulis.</p>

      <h3>Imputasi Sederhana — Cepat tapi Beracun</h3>
      <ul>
        <li><strong>Mean/Median:</strong> cepat tapi merusak variansi — semua imputasi nilainya sama → sebaran menyusut artifisial (bukti di Lab 2).</li>
        <li><strong>Modus:</strong> untuk kategori.</li>
        <li><strong>Forward/Backward fill:</strong> untuk time series (dengan catatan di tips).</li>
      </ul>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = standar deviasi sebelum vs sesudah 30% data diimputasi dengan mean. Seharusnya imputasi menambah informasi (n naik) — tapi lihat arah batangnya.</p>
        <PlotlyChart
          data={varianceDemo}
          title="Bahaya Imputasi Mean: SD Jadi Underestimate"
          layout={{ yaxis: { title: "SD" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> SD <em>turun</em> dari 2,50 ke 1,80 — padahal tidak ada informasi baru yang masuk! Semua nilai imputasi = mean → tidak menambah variasi → variansi menyusut. Akibatnya: standard error kekecilan, p-value terlalu optimis, interval kepercayaan terlalu sempit. <strong>Imputasi mean menciptakan ilusi presisi.</strong></p>
      </div>

      <h3>Imputasi Cerdas</h3>
      <ul>
        <li><strong>Regresi:</strong> prediksi nilai missing dari variabel lain (untuk MAR — memakai "jejak" yang ditinggalkan).</li>
        <li><strong>KNN:</strong> pinjam nilai dari tetangga terdekat yang mirip.</li>
        <li><strong>Multiple Imputation (MICE):</strong> buat <em>beberapa</em> versi imputasi yang berbeda → analisis tiap versi → gabungkan hasilnya. <em>Gold standard</em> — satu-satunya yang jujur tentang ketidakpastian imputasi.</li>
      </ul>
      <p><strong>Kapan OK:</strong> MAR (atau MCAR dengan missing besar). Untuk MNAR, semua ini hanya "mengulang bias dengan rapi" — butuh asumsi eksplisit atau data eksternal.</p>

      <h3>Dengarkan Lubangnya: Kolom Indikator Missing</h3>
      <p>Strategi yang paling sering dilupakan: <strong>tambah kolom <code className="inline">penghasilan_missing</code> (1/0)</strong>. Kadang "hilangnya" sendiri adalah sinyal — dalam cerita Sinta, indikator inilah yang 3× lebih prediktif terhadap default daripada nilai penghasilannya!</p>
      <p><strong>Kapan OK:</strong> hampir selalu sebagai <em>pelengkap</em> (bukan pengganti) imputasi. Model yang baik memakai nilai imputasi <em>dan</em> fakta bahwa nilainya dulu hilang.</p>

      <div className="callout callout-warning">
        <p><strong>⛔ Jangan Lakukan Ini</strong></p>
        <ul>
          <li><strong>Imputasi mean lalu hitung SD / uji hipotesis</strong> — SD underestimate → kesimpulan palsu signifikan.</li>
          <li><strong>Hapus tanpa cek mekanisme</strong> — bisa membuang tepat kelompok yang paling penting (tragedi Sinta).</li>
          <li><strong>Isi dengan 0</strong> — 0 adalah <em>nilai</em>, bukan "tidak tahu"! Penghasilan 0 = tidak berpenghasilan, beda total dengan tidak diketahui. (Ingat skala rasio: 0 = tidak ada.)</li>
          <li><strong>Imputasi memakai variabel target (leakage)</strong> — mengimputasi <em>penghasilan</em> dengan model yang memakai <em>status default</em> sebagai prediktor membocorkan target ke feature. Imputasi boleh memakai feature lain, jangan target.</li>
        </ul>
      </div>

      <div className="tip">
        <p><strong>💡 Untuk time series</strong> (forward-fill): hanya valid jika gap pendek dan prosesnya kontinu (harga saham intraday, suhu per jam). Gap panjang atau proses yang bisa melompat (status nasabah, rating) → forward-fill menciptakan "fakta" palsu. Untuk gap panjang: buat indikator <code className="inline">is_imputed</code> atau biarkan kosong dengan penanganan eksplisit.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: MCAR vs MNAR — Siapa yang Membiaskan Mean?</h2>
      <PyodideLab
        title="🔬 Lab 1: MCAR vs MNAR — Siapa yang Membiaskan Mean?"
        hint="Ubah ambang 12 jadi 10 atau 14. Perhatikan: bias MNAR membesar saat ambang makin 'memakan' populasi — sementara MCAR tetap jujur berapapun % yang hilang."
        defaultCode={`import random, statistics as st\nrandom.seed(42)\ntrue = [random.gauss(10, 3) for _ in range(1000)]  # penghasilan (juta)\ntrue_mean = st.mean(true)\nmcar = [x for x in true if random.random() > 0.2]  # 20% hilang ACAK\nmnar = [x for x in true if x < 12]  # yang kaya (>12) tidak melapor; COBA UBAH 12\nprint("mean sebenarnya         :", round(true_mean, 2))\nprint("mean MCAR (20% acak)     :", round(st.mean(mcar), 2))\nprint("mean MNAR (kaya bungkam) :", round(st.mean(mnar), 2))\nprint("bias MNAR               :", round(st.mean(mnar) - true_mean, 2))\nprint()\nprint("MCAR: yang hilang acak -> sisa data tetap cerminan populasi.")\nprint("MNAR: yang hilang justru kelompok terkaya -> mean underestimate.")`}
      />

      <h2 id="lab2">🔬 Lab 2: Imputasi Mean Merusak Variansi</h2>
      <PyodideLab
        title="🔬 Lab 2: Imputasi Mean Merusak Variansi"
        hint="Ubah 0,3 jadi 0,5 (50% missing). Lihat seberapa parah SD menyusut — lalu bayangkan analis yang mengklaim 'data jadi lebih stabil'."
        defaultCode={`import random, statistics as st\nrandom.seed(11)\ndata = [random.gauss(50, 10) for _ in range(200)]\nobs = [x for x in data if random.random() > 0.3]  # 30% hilang; COBA UBAH 0.3\nm = st.mean(obs)\nimp = obs + [m] * (len(data) - len(obs))  # tambal semua dengan mean\nprint("SD data asli            :", round(st.stdev(data), 2))\nprint("SD setelah imputasi mean:", round(st.stdev(imp), 2))\nprint()\nprint("n kembali penuh TAPI variansi MENYUSUT.")\nprint("Inilah ilusi presisi: SE mengecil, p-value terlalu optimis.")`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Strategi Mana untuk Pola Missing-mu</h2>

      <div className="decision-card">
        <h3>1. MCAR &amp; missing &lt; 5%, n besar → hapus baris, laporkan</h3>
        <p><strong>Kondisi:</strong> terbukti (atau sangat plausible) acak total; proporsi kecil; sampel masih besar setelah dihapus.</p>
        <p><strong>Kenapa:</strong> tidak bias, simpel, transparan. Biaya informasi kecil.</p>
        <p><strong>Contoh nyata:</strong> 2% tanggal_lahir kosong karena bug form lama yang sudah diperbaiki — hapus, catat di dokumentasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. MAR → imputasi cerdas + kolom indikator</h3>
        <p><strong>Kondisi:</strong> pola missing bisa dijelaskan variabel teramati (jabatan, wilayah, segmen).</p>
        <p><strong>Kenapa:</strong> MICE/regresi/KNN memakai "jejak" di variabel teramati; indikator missing menangkap sisa sinyal dari faktanya hilang.</p>
        <p><strong>Contoh nyata:</strong> gaji direktur yang bungkam → imputasi dari pola gaji per jabatan + kolom <code className="inline">gaji_missing</code>.</p>
      </div>

      <div className="decision-card">
        <h3>3. MNAR (atau dicurigai MNAR) → jangan imputasi buta</h3>
        <p><strong>Kondisi:</strong> data sensitif (pendapatan, kesehatan, kepatuhan) atau ada alasan domain bahwa nilainya sendiri menyebabkan hilang.</p>
        <p><strong>Kenapa:</strong> imputasi dari data yang ada hanya mengulang bias. Butuh asumsi eksplisit, data eksternal, atau sensitivity analysis.</p>
        <p><strong>Contoh nyata:</strong> survei kebangkrutan → laporkan rentang skenario ("jika non-responden 20% lebih buruk, estimasi jadi X–Y"), cari data pembanding eksternal.</p>
      </div>

      <div className="decision-card">
        <h3>4. Missing struktural → jadikan kategori sendiri</h3>
        <p><strong>Kondisi:</strong> kolom memang tidak relevan untuk sebagian baris (alasan_tolak untuk yang disetujui, tanggal_meninggal untuk yang hidup).</p>
        <p><strong>Kenapa:</strong> "missing"-nya bermakna — mengisinya (dengan apapun!) merusak makna kolom.</p>
        <p><strong>Contoh nyata:</strong> <code className="inline">alasan_tolak_pinjaman</code> kosong untuk yang disetujui → kategori "Tidak ditolak", bukan imputasi.</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Laporkan % missing per kolom dulu</strong> — sebelum hapus/imputasi apapun.</li>
          <li><strong>Diagnosis mekanisme</strong> (MCAR/MAR/MNAR/struktural) dari logika domain + pola di variabel teramati.</li>
          <li>MCAR kecil → hapus. MAR → MICE + indikator. MNAR → waspada + sensitivity. Struktural → kategori sendiri.</li>
          <li><strong>Jangan pernah isi 0</strong> untuk "tidak tahu" — dan jangan imputasi memakai target (leakage).</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Kolom Penghasilan 15% Kosong</h2>
      <div className="callout">
        <p>Kamu analis risiko di bank. Dataset 10.000 aplikasi kredit:</p>
        <ul>
          <li>Kolom <code className="inline">penghasilan</code>: <strong>15% kosong</strong> (1.500 aplikasi)</li>
          <li>Cek pola: yang missing <strong>2× lebih sering wiraswasta</strong> dan terkonsentrasi di 3 wilayah — jadi bukan acak total</li>
          <li><strong>Default rate</strong> kelompok penghasilan-missing: <strong>9,1%</strong> vs 3,2% populasi keseluruhan</li>
          <li>Tim modeling mengusulkan: "isi saja dengan median, biar model bisa jalan"</li>
        </ul>
        <p><strong>Pertanyaan:</strong></p>
        <ol>
          <li>(a) Mekanisme apa yang paling mungkin? MCAR, MAR, atau MNAR — dan apa buktinya?</li>
          <li>(b) Strategi penanganan yang defensible untuk training model scoring?</li>
          <li>(c) Apa yang wajib kamu laporkan ke komite risiko?</li>
        </ol>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>MAR mengarah ke MNAR.</strong> Pola jelas terkait variabel teramati (wiraswasta, wilayah) → minimal MAR. Tapi default rate 3× lipat pada kelompok missing adalah <em>red flag</em> MNAR: kemungkinan nilai penghasilan itu sendiri (rendah/tidak stabil) ikut menyebabkan orang tidak melapor. Perlakukan sebagai MNAR sampai terbukti sebaliknya.</p>
          <p>(b) <strong>Jangan isi median</strong> (itu tragedi Sinta jilid 2 — menyamarkan kelompok berisiko 9,1% jadi "nasabah median"). Yang defensible: <strong>MICE</strong> memakai pekerjaan/wilayah/usia sebagai prediktor <strong>+ kolom <code className="inline">penghasilan_missing</code></strong> sebagai feature — karena "hilangnya" sendiri prediktif. Plus <strong>sensitivity analysis</strong>: bagaimana skor berubah jika kelompok missing diasumsikan 20% lebih buruk.</p>
          <p>(c) Tiga hal: (1) 15% missing dengan pola non-acak — bukan "data kotor biasa"; (2) kelompok missing default 9,1% — mereka adalah segmen risiko tersendiri, bukan "rata-rata"; (3) model yang di-training tanpa perlakuan khusus akan <em>systematically underestimate</em> risiko segmen ini — sertakan batasan ini di model risk documentation.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu</h2>

      <Quiz
        question="Kolom gaji kosong lebih sering untuk jabatan direktur. Mekanisme apa?"
        options={[
          "MCAR",
          "MAR",
          "MNAR",
          "Tidak ada missing",
        ]}
        correct={1}
        explanation="Missing berhubungan dengan variabel teramati (jabatan) — bukan acak, tapi polanya bisa diprediksi dari variabel lain. Itulah MAR: 'random' setelah mengontrol variabel teramati."
      />

      <Quiz
        question="Kenapa imputasi mean merusak analisis?"
        options={[
          "Mean selalu salah",
          "Mengurangi variansi secara artifisial",
          "Terlalu lambat",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Semua nilai imputasi = mean → tidak menambah variasi → SD underestimate → standard error kekecilan → p-value terlalu optimis → kesimpulan 'signifikan' yang palsu. Lihat Lab 2 untuk buktinya."
      />

      <Quiz
        question="Kolom 'alasan_tolak_pinjaman' kosong untuk semua nasabah yang DISETUJUI. Mekanisme apa dan bagaimana menanganinya?"
        options={[
          "MCAR — hapus barisnya",
          "MAR — imputasi dengan KNN",
          "MNAR/struktural — missing-nya bermakna (tidak ditolak = tidak ada alasan); jangan imputasi, perlakukan sebagai kategori sendiri",
          "Isi dengan 0",
        ]}
        correct={2}
        explanation="Ini missing struktural: kolom hanya relevan untuk yang ditolak. Mengisinya (dengan apapun) merusak makna kolom. Solusi: jadikan 'Tidak ditolak' sebagai kategori tersendiri, atau analisis subset yang ditolak saja."
      />

      <Quiz
        question="Dataset 10.000 baris, kolom penghasilan 15% missing (MAR). Mana strategi terbaik?"
        options={[
          "Hapus 1.500 baris (listwise)",
          "Isi semua dengan mean",
          "MICE / imputasi berbasis model + kolom indikator missing",
          "Isi dengan 0",
        ]}
        correct={2}
        explanation="15% terlalu besar untuk dihapus (buang informasi + potensi bias). Mean merusak variansi; 0 merusak makna. MICE mempertahankan variansi dan jujur soal ketidakpastian; kolom indikator menangkap sinyal dari 'hilangnya' itu sendiri."
      />

      <Quiz
        question="Setelah imputasi mean pada 30% data, seorang analis melaporkan SD turun dari 2,5 ke 1,8 lalu mengklaim 'data jadi lebih stabil'. Kesalahan fatalnya?"
        options={[
          "Tidak ada — SD turun memang berarti lebih stabil",
          "SD menyusut secara artifisial karena nilai imputasi tidak bervariasi; 'lebih stabil' adalah ilusi dari metode, bukan perbaikan data",
          "Seharusnya memakai median, bukan mean",
          "Seharusnya menghapus saja 30% datanya",
        ]}
        correct={1}
        explanation="Penyusutan SD adalah artefak imputasi (semua nilai tambalan identik), bukan cerminan realitas. Mengklaim 'lebih stabil' lalu memakai SD itu untuk uji hipotesis = membangun kesimpulan di atas ilusi presisi."
      />

      <Quiz
        question="Kolom 'pendapatan_tambahan' 40% missing, terbukti MCAR (uji Little tidak signifikan), n = 50.000. Tindakan paling defensible?"
        options={[
          "Isi semua dengan 0 agar dataset 'lengkap'",
          "Hapus baris yang missing — MCAR & n besar, sisa 30.000 baris tetap representatif; laporkan % yang dihapus",
          "Wajib MICE karena missing > 5%",
          "Buang kolomnya sekalian",
        ]}
        correct={1}
        explanation="MCAR + n besar = listwise deletion valid tanpa bias; 30.000 baris sisa lebih dari cukup. MICE boleh tapi overkill; yang wajib adalah transparansi (% dihapus, hasil uji MCAR). Isi 0 merusak makna; buang kolom membuang informasi yang valid."
      />

      <h2 id="rangkuman">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>MCAR</strong> = hilang acak total; satu-satunya yang "jujur". JANGAN hapus diam-diam jika &gt; 5% atau n kecil — tetap ada biaya informasi.</li>
          <li><strong>MAR</strong> = hilang berpola tapi bisa dijelaskan variabel teramati ("random" yang menyesatkan namanya). JANGAN imputasi mean — pakai MICE/regresi/KNN yang memakai jejaknya.</li>
          <li><strong>MNAR</strong> = hilangnya disebabkan nilainya sendiri; tidak bisa diperbaiki penuh dari dalam data. JANGAN pura-pura MICE menyembuhkannya — butuh asumsi eksplisit, data eksternal, atau sensitivity analysis.</li>
          <li><strong>Missing struktural</strong> = kolom tak relevan untuk subset → kategori sendiri. JANGAN imputasi apapun ke dalamnya.</li>
          <li><strong>Kolom indikator missing</strong> = hampir selalu tambahkan; kadang "hilangnya" lebih prediktif dari nilainya. JANGAN bangun indikator dari kebocoran target (leakage).</li>
          <li><strong>0 ≠ "tidak tahu".</strong> Dan urutan kerja yang benar: laporkan % missing → diagnosis mekanisme → pilih strategi → dokumentasikan. Jangan jadi Sinta.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a18-visualisasi" className="btn btn-primary btn-sm">Next: A1.8 →</Link>
      </div>
    </div>
  );
}
