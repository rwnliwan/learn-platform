import Quiz from "@/components/Quiz";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";


export default function A12Page() {
  const salaryDistData = [
    {
      x: ["8 jt (×9)", "500 jt (×1)"],
      y: [9, 1],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838"] },
      text: [9, 1],
      textposition: "outside",
    },
  ];

  const symData = [
    {
      x: [140, 145, 150, 155, 160, 165, 170, 175, 180],
      y: [2, 8, 20, 32, 40, 32, 20, 8, 2],
      type: "bar",
      marker: { color: "#2a7de1" },
      name: "Tinggi badan (cm)",
    },
  ];

  const skewData = [
    {
      x: ["5 jt", "8 jt", "12 jt", "20 jt", "50 jt", "200 jt"],
      y: [45, 30, 12, 7, 4, 2],
      type: "bar",
      marker: { color: "#e8a838" },
    },
  ];

  const catData = [
    {
      x: ["Hitam", "Putih", "Silver", "Merah"],
      y: [38, 30, 20, 12],
      type: "bar",
      marker: { color: ["#e2e8f0", "#94a3b8", "#64748b", "#ef4444"] },
    },
  ];

  const meanMedianData = [
    {
      x: ["Tanpa outlier", "Dengan outlier (100)"],
      y: [10, 27.6],
      name: "Mean",
      type: "bar",
      marker: { color: "#e8a838" },
    },
    {
      x: ["Tanpa outlier", "Dengan outlier (100)"],
      y: [10, 10],
      name: "Median",
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `gaji = [8, 8, 8, 8, 8, 8, 8, 8, 8, 500]  # juta; ubah 500 sesukamu
import statistics as st
mean = st.mean(gaji); median = st.median(gaji)
print(f"mean   = {mean:.1f} jt")
print(f"median = {median:.1f} jt")
print(f"mean/median = {mean/median:.1f}x  <- semakin jauh dari 1, semakin menipu mean")`;

  const lab2Code = `import statistics as st
data = [70, 75, 80, 85, 200]  # ubah sesukamu, coba tambah outlier
n = len(data)
mean = st.mean(data)
median = st.median(data)
uniq = len(set(data))
mode = st.mode(data) if uniq < n else "tidak ada (semua unik)"
# trimmed 20%: buang 1 terkecil & 1 terbesar
s = sorted(data); k = max(1, int(0.2*n))
trimmed = sum(s[k:-k])/len(s[k:-k]) if len(s[k:-k])>0 else float('nan')
print(f"data    = {data}")
print(f"mean    = {mean:.1f}")
print(f"median  = {median:.1f}")
print(f"mode    = {mode}")
print(f"trim20% = {trimmed:.1f}")
print()
print("Kesimpulan:", "mean hancur oleh outlier!" if abs(mean-median)>10 else "data relatif bersih")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A1.2 — Statistika Deskriptif</span>
        <h1 className="display-title">Mean, Median, Modus:<br />Kapan Masing-Masing Menipu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Gaji Rata-Rata 57 Juta?</a></li>
          <li><a href="#mean">Mean — Si Pekerja Keras yang Gampang Dipengaruhi</a></li>
          <li><a href="#median">Median — Si Penengah yang Tenang</a></li>
          <li><a href="#modus">Modus — Si Pemenang Voting</a></li>
          <li><a href="#lab1">🔬 Lab 1: Geser Outlier, Lihat Mean Lari</a></li>
          <li><a href="#lab2">🔬 Lab 2: Bandingkan Semua Ukuran (Live)</a></li>
          <li><a href="#weighted">Mean Tertimbang &amp; Trimmed Mean</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Pakai yang Mana</a></li>
          <li><a href="#case">📋 Mini-Case: Metrik Dashboard Risiko Kredit</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan mean, median, modus dengan bahasa sendiri — termasuk kapan ketiganya <strong>semua menipu</strong>.</li>
          <li>Menghitung ketiganya langkah-demi-langkah dari data mentah, termasuk mean tertimbang dan trimmed mean.</li>
          <li>Menentukan ukuran mana yang jujur untuk tiap jenis data (simetris, miring, ada outlier, data kategorik).</li>
          <li>Membaca histogram skew dan mengaitkannya dengan posisi relatif mean vs median.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Gaji Rata-Rata 57 Juta?</h2>
      <div className="story">
        <p>Startup &ldquo;MajuTerus&rdquo; mengumumkan: <em>&ldquo;Rata-rata gaji karyawan kami Rp57 juta!&rdquo;</em> — terdengar fantastis. Kamu melamar sebagai analis. Di hari pertama, kamu intip data aslinya: 9 karyawan digaji Rp8 juta, 1 CEO digaji Rp500 juta. Rata-rata = (9&times;8 + 500)/10 = <strong>57,2 juta</strong>. Tekniknya benar. Kesimpulannya? Menyesatkan total.</p>
        <p>Inilah pelajaran pertama statistika: <strong>angka yang benar secara matematis bisa salah secara makna</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="mean">Mean — Si Pekerja Keras yang Gampang Dipengaruhi</h2>
      <p><strong>Definisi.</strong> Mean (rata-rata hitung) adalah jumlah seluruh data dibagi banyaknya data:</p>
      <Tex math={String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\bar{x}`} /> (&ldquo;x-bar&rdquo;): rata-rata sampel yang kita hitung</li>
        <li><Tex math={String.raw`n`} />: banyaknya data</li>
        <li><Tex math={String.raw`x_i`} />: data ke-<Tex math={String.raw`i`} /> (<Tex math={String.raw`x_1`} /> data pertama, <Tex math={String.raw`x_2`} /> data kedua, dst.)</li>
        <li><Tex math={String.raw`\sum`} />: &ldquo;jumlahkan semua&rdquo;</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Data nilai ujian 5 orang: 70, 80, 75, 90, 85.</p>
        <p><strong>Langkah 1</strong> — jumlahkan: 70 + 80 + 75 + 90 + 85 = 400.<br />
        <strong>Langkah 2</strong> — bagi dengan <Tex math={String.raw`n = 5`} />: 400 / 5 = <strong>80</strong>.</p>
        <p>Mean = 80. Setiap nilai &ldquo;menyumbang&rdquo; penuh ke hasil — dan justru itu kelemahannya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Rata-rata selalu mewakili mayoritas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Mean hanya mewakili mayoritas jika data simetris tanpa outlier ekstrem. Pada data miring (seperti gaji startup di atas), mean mewakili <em>tidak ada siapa pun</em> — bukan mayoritas (8 jt), bukan CEO (500 jt), melainkan angka fiktif 57,2 jt yang tidak dialami siapa pun.</p>
      </div>

      <p><strong>Kepribadian mean:</strong> dia demokratis tapi naif. Setiap data didengar sama rata — termasuk data ekstrem yang seharusnya dicurigai. Satu CEO bergaji 500 juta menggeser mean 9 karyawan dari 8 juta menjadi 57,2 juta. Dalam istilah teknis: mean <strong>tidak robust</strong> (tidak kebal) terhadap outlier.</p>
      <p><strong>Kapan memakai mean:</strong> data simetris tanpa outlier ekstrem (misal: tinggi badan orang dewasa, nilai ujian yang menyebar normal). Di situlah mean adalah ringkasan terbaik — ia memakai <em>semua</em> informasi data.</p>

      <PlotlyChart
        data={salaryDistData}
        title="Distribusi Gaji Startup MajuTerus (n=10)"
        layout={{ xaxis: { title: "Gaji" }, yaxis: { title: "Jumlah orang" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai gaji, tinggi batang = jumlah orang. Cari di mana massa data menumpuk (di sanalah &lsquo;kebanyakan orang&rsquo;), lalu lihat apakah ada batang yang terpisah jauh — itulah outlier yang akan menggeser mean.</p>
        <p><strong>Interpretasi:</strong> 9 dari 10 data menumpuk di 8 juta, satu data terpisah jauh di 500 juta. Ini pola <strong>miring kanan</strong> (right-skewed): ekor panjang ke kanan. Pada pola ini mean (57,2) tertarik ke ekor, sedangkan median (8) tetap di tumpukan mayoritas. <strong>Aturan praktis:</strong> mean selalu &ldquo;tertarik&rdquo; ke arah ekor yang panjang.</p>
      </div>

      <h2 id="median">Median — Si Penengah yang Tenang</h2>
      <p><strong>Definisi.</strong> Median adalah nilai tengah setelah data <strong>diurutkan</strong>:</p>
      <ul>
        <li><Tex math={String.raw`n`} /> ganjil: ambil data ke-<Tex math={String.raw`\frac{n+1}{2}`} />.</li>
        <li><Tex math={String.raw`n`} /> genap: rata-rata dari dua data tengah.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah</summary>
        <p>Data gaji (juta): 8, 8, 8, 8, 8, 8, 8, 8, 8, 500. Sudah urut, <Tex math={String.raw`n = 10`} /> (genap).</p>
        <p>Dua data tengah: data ke-5 = 8, data ke-6 = 8. Median = (8+8)/2 = <strong>8</strong>.</p>
        <p>Median = 8 juta — persis gaji mayoritas. CEO 500 juta tidak menggesernya sama sekali.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> median hanya peduli <strong>urutan</strong>, bukan <strong>besar nilai</strong>. CEO mau digaji 500 juta atau 5 miliar — selama tetap jadi data terbesar, median tidak bergerak. Inilah mengapa median disebut <strong>robust</strong>: kebal terhadap outlier.</p>
      </div>

      <p><strong>Kapan memakai median:</strong> data miring (skewed) atau ada outlier — gaji, harga rumah, waktu tunggu layanan. Median menjawab: &ldquo;berapa pengalaman <em>tipikal</em>?&rdquo;</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Median selalu lebih baik dari mean.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> median membuang informasi besar-kecil nilai (hanya pakai urutan). Pada data simetris bersih, mean lebih efisien — ia memakai seluruh informasi. Tidak ada yang &ldquo;selalu&rdquo; menang; yang ada adalah &ldquo;cocok untuk data seperti apa&rdquo;.</p>
      </div>

      <PlotlyChart
        data={meanMedianData}
        title="Mean vs Median: Efek Satu Outlier"
        layout={{ barmode: "group", yaxis: { title: "Juta Rp" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kelompok batang (tanpa vs dengan outlier). Batang kuning = mean, biru = median.</p>
        <p><strong>Interpretasi:</strong> satu data 100 membuat mean melonjak dari 10 ke 27,6 — sedangkan median tidak bergerak sama sekali. Inilah visual dari &ldquo;robust&rdquo;: median kebal, mean tidak.</p>
      </div>

      <h2 id="modus">Modus — Si Pemenang Voting</h2>
      <p><strong>Definisi.</strong> Modus adalah nilai yang <strong>paling sering muncul</strong>. Satu-satunya ukuran pemusatan yang bisa dipakai untuk data kategorik (warna favorit, jenis keluhan).</p>
      <p><strong>Contoh:</strong> ukuran sepatu terjual: 40, 41, 42, 42, 42, 43 → modus = <strong>42</strong>. Untuk restock, info inilah yang paling berguna — bukan rata-rata ukuran 41,7 yang tidak ada di rak.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data selalu punya satu modus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data bisa <strong>tidak punya modus</strong> (semua nilai muncul sekali) atau <strong>multi-modus/bimodal</strong> (dua nilai sama-sama sering). Bimodal sering jadi sinyal ada <strong>dua kelompok berbeda</strong> dalam data — misal kepuasan pelanggan menumpuk di 2 dan 9 (yang kecewa vs yang puas), bukan &ldquo;rata-rata 5,5 yang biasa saja&rdquo;.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> modus menjawab &ldquo;yang paling umum&rdquo;, bukan &ldquo;yang tipikal&rdquo;. Untuk data kategorik nominal (ingat A1.1!), modus adalah satu-satunya ukuran pemusatan yang valid — mean/median tidak bermakna untuk kategori.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Geser Outlier, Lihat Mean Lari</h2>
      <p>Ubah gaji CEO (data terakhir), lalu jalankan. Perhatikan: mean ikut lari, median diam.</p>
      <PyodideLab
        title="Lab 1 — Sensitivitas Mean terhadap Outlier"
        hint="Coba: 500 → 50 → 5000. Pada titik berapa mean jadi 2× median? Itulah ambang “mean tidak lagi mewakili”."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Bandingkan Semua Ukuran (Live)</h2>
      <PyodideLab
        title="Lab 2 — Mean vs Median vs Modus vs Trimmed (Live Python)"
        hint="⚡ Live Python — edit kodenya langsung, klik Jalankan, tidak perlu install apa-apa. Coba tambah outlier ekstrem ke data."
        defaultCode={lab2Code}
      />

      <h2 id="weighted">Mean Tertimbang &amp; Trimmed Mean — Senjata Lanjutan</h2>

      <h3>Mean tertimbang (weighted mean)</h3>
      <p>Tidak semua data bobotnya sama. Nilai akhir kuliah: tugas 30%, UTS 30%, UAS 40%.</p>
      <Tex math={String.raw`\bar{x}_w = \frac{\sum w_i x_i}{\sum w_i}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\bar{x}_w`} />: rata-rata tertimbang</li>
        <li><Tex math={String.raw`w_i`} />: bobot data ke-<Tex math={String.raw`i`} /> (misal 0,3 untuk tugas)</li>
        <li><Tex math={String.raw`x_i`} />: nilai data ke-<Tex math={String.raw`i`} /></li>
      </ul>
      <p><strong>Contoh:</strong> tugas 80, UTS 70, UAS 90 → (0,3&times;80 + 0,3&times;70 + 0,4&times;90) = 24 + 21 + 36 = <strong>81</strong>. Bukan rata-rata biasa (80) — UAS berbobot lebih besar.</p>
      <p><strong>Kapan dipakai:</strong> survei dengan kelompok berukuran beda, portofolio (return tertimbang modal), IPK (SKS sebagai bobot).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> weighted mean = &ldquo;mean yang menghormati perbedaan pentingnya tiap data&rdquo;. IHSG memakai kapitalisasi pasar sebagai bobot — saham raksasa lebih menentukan indeks daripada saham kecil.</p>
      </div>

      <h3>Trimmed mean — kompromi elegan</h3>
      <p>Buang <Tex math={String.raw`p`} />% data terkecil dan terbesar, lalu rata-ratakan sisanya. Trimmed mean 10%: buang 10% terbawah + 10% teratas.</p>
      <p><strong>Contoh:</strong> nilai juri [70, 75, 80, 85, 200] — juri terakhir salah input. Mean biasa = 102 (hancur). Trimmed 20% (buang 1 terkecil + 1 terbesar → [75,80,85]): mean = <strong>80</strong>. Masuk akal!</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> trimmed mean = &ldquo;mean yang sudah divaksin outlier&rdquo;. Makin besar % trim, makin mirip median (robust tapi boros info). Trim 0% = mean biasa; trim mendekati 50% ≈ median.</p>
      </div>

      <h3>Geometric &amp; Harmonic Mean</h3>
      <p><strong>Geometric mean</strong> — untuk data perkalian/pertumbuhan (return investasi):</p>
      <Tex math={String.raw`G = \sqrt[n]{x_1 \times x_2 \times \cdots \times x_n}`} block />
      <p><strong>Contoh:</strong> return tahunan +10%, −5%, +20%:</p>
      <Tex math={String.raw`G = \sqrt[3]{1.10 \times 0.95 \times 1.20} - 1 = 7.8\%`} block />
      <div className="callout callout-warning">
        <p><strong>Jangan pakai mean aritmatika untuk return!</strong> (10 − 5 + 20)/3 = 8,3% — melebih-lebihkan hasil sebenarnya.</p>
      </div>
      <p><strong>Harmonic mean</strong> — untuk rata-rata kecepatan/rate:</p>
      <Tex math={String.raw`H = \frac{n}{\frac{1}{x_1} + \frac{1}{x_2} + \cdots + \frac{1}{x_n}}`} block />
      <p><strong>Contoh:</strong> pergi 60 km/jam, pulang 40 km/jam (jarak sama):</p>
      <Tex math={String.raw`H = \frac{2}{\frac{1}{60} + \frac{1}{40}} = 48 \text{ km/jam}`} block />
      <p>Bukan (60+40)/2 = 50! Karena lebih banyak waktu dihabiskan pada kecepatan lambat.</p>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Pakai yang Mana</h2>
      <p>Setiap kondisi data di bawah dilengkapi <strong>gambaran bentuk datanya</strong> — perhatikan bentuk grafiknya, karena bentuklah yang menentukan pilihanmu.</p>

      <div className="decision-card">
        <h3>1. Data simetris, tanpa outlier → <strong>Mean</strong></h3>
        <p><strong>Kondisi data:</strong> nilai menyebar merata di kiri-kanan pusat, tidak ada yang ekstrem. Contoh: tinggi badan 100 orang dewasa — kebanyakan di tengah (165–175 cm), sedikit yang sangat pendek/tinggi, simetris.</p>
        <PlotlyChart data={symData} title="Simetris: Tinggi Badan Dewasa" layout={{ xaxis: { title: "Tinggi (cm)" }, yaxis: { title: "Frekuensi" }, showlegend: false }} />
        <p><strong>Kenapa mean:</strong> memakai <em>semua</em> informasi tiap data; paling efisien secara statistik. Mean ≈ median ≈ modus (ketiganya berimpit di tengah).</p>
        <p><strong>Contoh nyata:</strong> rata-rata tinggi badan untuk desain kursi pesawat.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data miring / ada outlier → <strong>Median</strong></h3>
        <p><strong>Kondisi data:</strong> mayoritas menumpuk di satu sisi, ada ekor panjang atau titik jauh. Contoh: gaji (mayoritas 5–15 jt, segelintir 100 jt+), harga rumah, waktu tunggu.</p>
        <PlotlyChart data={skewData} title="Miring Kanan: Distribusi Gaji" layout={{ xaxis: { title: "Gaji" }, yaxis: { title: "Frekuensi" }, showlegend: false }} />
        <p><strong>Kenapa median:</strong> robust — tidak terpengaruh outlier. Mewakili <em>pengalaman tipikal</em>. Pada grafik, median tetap di tumpukan mayoritas sementara mean tertarik ke ekor.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;gaji tipikal&rdquo; di job posting; harga rumah median per kota; DPD median portofolio kredit.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data kategorik → <strong>Modus</strong></h3>
        <p><strong>Kondisi data:</strong> nilai berupa label/kategori, bukan angka. Contoh: warna mobil terlaris, jenis keluhan pelanggan, rating kepuasan.</p>
        <PlotlyChart data={catData} title="Kategorik: Warna Mobil Terlaris" layout={{ xaxis: { title: "Warna" }, yaxis: { title: "Terjual" }, showlegend: false }} />
        <p><strong>Kenapa modus:</strong> satu-satunya ukuran pusat yang valid — mean/median tidak bermakna untuk kategori.</p>
        <p><strong>Contoh nyata:</strong> restock ukuran sepatu paling laku; prioritas perbaikan berdasarkan keluhan tersering.</p>
      </div>

      <div className="decision-card">
        <h3>4. Bobot tiap data beda → <strong>Weighted Mean</strong></h3>
        <p><strong>Kondisi data:</strong> tiap observasi punya bobot kepentingan berbeda. Contoh: return portofolio (saham A modal 70%, saham B 30%).</p>
        <p><strong>Kenapa weighted mean:</strong> menghormati perbedaan bobot. Rumus: <Tex math={String.raw`\bar{x}_w = \frac{\sum w_i x_i}{\sum w_i}`} />.</p>
        <p><strong>Contoh nyata:</strong> IPK (SKS sebagai bobot); IHSG (kapitalisasi pasar sebagai bobot).</p>
      </div>

      <div className="decision-card">
        <h3>5. Outlier ringan, ingin tetap pakai mean → <strong>Trimmed Mean</strong></h3>
        <p><strong>Kondisi data:</strong> ada beberapa nilai ekstrem tapi tidak parah; kamu ingin kekebalan outlier tanpa membuang terlalu banyak informasi.</p>
        <p><strong>Kenapa trimmed mean:</strong> buang p% terkecil &amp; terbesar, rata-ratakan sisanya. Kompromi antara mean (informatif) dan median (robust).</p>
        <p><strong>Contoh nyata:</strong> skor juri olahraga (buang nilai tertinggi &amp; terendah); rata-rata harga setelah buang promo anomali.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Lihat bentuk data dulu</strong> (histogram) — bukan langsung hitung.</li>
          <li>Simetris bersih → <strong>mean</strong>. Miring/ada outlier → <strong>median</strong>. Kategori → <strong>modus</strong>.</li>
          <li>Kalau ragu, laporkan <strong>keduanya</strong> (mean + median) + bentuk distribusinya.</li>
          <li>Selalu tanya: &ldquo;angka ini mewakili <em>siapa</em>?&rdquo; — kalau tidak mewakili siapa pun, jangan pakai.</li>
        </ol>
      </div>

      {/* Hubungan mean-median-modus */}
      <div className="callout">
        <p><strong>Hubungan untuk distribusi unimodal:</strong></p>
        <ul>
          <li>Simetris: <Tex math={String.raw`\text{mean} \approx \text{median} \approx \text{modus}`} /></li>
          <li>Miring kanan (right skew): <Tex math={String.raw`\text{mean} > \text{median} > \text{modus}`} /></li>
          <li>Miring kiri (left skew): <Tex math={String.raw`\text{mean} < \text{median} < \text{modus}`} /></li>
        </ul>
        <p>Ingat urutan ini — akan dipakai terus di A1.4 (skewness).</p>
      </div>

      {/* Kalkulator */}
      <h2 id="simulasi">Simulasi: Outlier vs Mean &amp; Median</h2>
      <p>
        Coba data gaji: <code className="inline">8, 9, 10, 11, 12</code> lalu tambah <code className="inline">100</code> (direktur).
        Perhatikan mean melonjak tapi median tidak bergerak!
      </p>
      <StatsCalculator defaultValues="8, 9, 10, 11, 12" title="🧮 Simulasi Efek Outlier" />

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Metrik Dashboard Risiko Kredit</h2>
      <div className="callout">
        <p>Kamu analis risiko di fintech. Dashboard menampilkan <strong>&ldquo;Rata-rata keterlambatan bayar: 8,4 hari&rdquo;</strong>. Direksi tenang-tenang saja. Kamu curiga, lalu tarik distribusinya:</p>
        <ul>
          <li>900 nasabah telat 1–5 hari (lupa, lalu bayar)</li>
          <li>90 nasabah telat 20–40 hari (kesulitan cashflow)</li>
          <li>10 nasabah telat 300+ hari (macet total, potensi gagal bayar)</li>
        </ul>
        <p>Mean ≈ 8,4 hari (tertarik 10 nasabah macet). Median ≈ 3 hari. Modus = 2 hari.</p>
        <p><strong>Pertanyaan:</strong> metrik mana yang jujur untuk (a) laporan ke direksi soal kesehatan portofolio, (b) penentuan cadangan kerugian (CKPN)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Median (3 hari)</strong> untuk gambaran tipikal — tapi WAJIB disertai: &ldquo;% nasabah &gt;30 hari&rdquo; dan &ldquo;total exposure 10 nasabah macet&rdquo;. Satu angka tidak cukup.</p>
          <p>(b) Untuk CKPN, bukan soal mean/median — tapi <strong>distribusi per bucket</strong> (current, 1–30, 31–60, 61–90, &gt;90 hari) karena tiap bucket punya probabilitas gagal bayar beda. Inilah pelajaran penting: <strong>kadang jawaban yang benar bukan &ldquo;pilih mean/median/modus&rdquo;, melainkan &ldquo;jangan ringkas jadi satu angka&rdquo;</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <Quiz
        question="1. Startup 10 orang: 9 digaji 8 jt, CEO 500 jt. HRD melapor 'rata-rata gaji 57,2 jt'. Sebagai analis, respons terbaik?"
        options={[
          "Setuju — angkanya benar secara matematis",
          "Laporkan median (8 jt) sebagai gaji tipikal, sertakan distribusi & % di tiap rentang — satu angka menyesatkan",
          "Laporkan modus saja",
          "Minta CEO turunkan gaji",
        ]}
        correct={1}
        explanation="Benar: median 8 jt. 'Rata-rata 57,2 jt' benar dihitung tapi salah dimaknai — tidak dialami siapa pun. Analis jujur memberi median + distribusi, bukan satu angka cantik."
      />

      <Quiz
        question="2. Data: 70, 80, 75, 90, 85. Mana yang BUKAN sifat mean?"
        options={[
          "Mean selalu berada di antara nilai terkecil dan terbesar",
          "Mean memakai seluruh informasi data",
          "Mean kebal terhadap outlier",
          "Satu data ekstrem dapat menggeser mean jauh",
        ]}
        correct={2}
        explanation="Benar: mean TIDAK kebal outlier — itu sifat median. Mean memakai semua info (kekuatan) tapi justru itu yang membuatnya rentan (kelemahan). Ia memang selalu berada di antara nilai min dan maks — itu sifat yang benar."
      />

      <Quiz
        question="3. Kepuasan pelanggan (skala 1–10) menumpuk di 2 dan 9. Rata-rata = 5,5. Interpretasi tepat?"
        options={[
          "Pelanggan cukup puas (5,5)",
          "Data bimodal — ada dua kelompok (kecewa vs puas); selidiki pemisahnya, jangan laporkan 5,5 saja",
          "Median pasti 5,5 juga",
          "Buang data 2 dan 9 sebagai outlier",
        ]}
        correct={1}
        explanation="Benar: bimodal = sinyal dua populasi. Rata-rata 5,5 tidak dialami siapa pun. Langkah benar: segmentasi, cari penyebab perbedaan."
      />

      <Quiz
        question="4. Untuk dashboard 'waktu tunggu tipikal' layanan dengan beberapa keluhan ekstrem menunggu berjam-jam, metrik terbaik?"
        options={[
          "Mean waktu tunggu",
          "Median waktu tunggu",
          "Modus waktu tunggu",
          "Waktu tunggu maksimum",
        ]}
        correct={1}
        explanation="Benar: median — robust terhadap beberapa kasus ekstrem, mewakili pengalaman tipikal pelanggan. Modus tidak stabil untuk data kontinu yang miring; maksimum hanya mencerminkan satu kasus terburuk."
      />

      <Quiz
        question="5. Nilai akhir = 0,3 × tugas + 0,3 × UTS + 0,4 × UAS. Ini contoh penerapan…"
        options={[
          "Median",
          "Modus",
          "Weighted mean",
          "Trimmed mean",
        ]}
        correct={2}
        explanation="Benar: weighted mean — tiap komponen punya bobot berbeda sesuai kepentingannya."
      />

      <Quiz
        question="6. Juri memberi [70, 78, 80, 85, 200] (terakhir salah input). Cara paling defensibel mendapat skor adil?"
        options={[
          "Mean biasa (102,6)",
          "Median (80)",
          "Trimmed mean 20% (buang 70 & 200 → 81)",
          "Modus (tidak ada)",
        ]}
        correct={2}
        explanation="Benar: trimmed mean 20% = 81. Median (80) selamat dari error di sini, tapi trimmed mean memakai lebih banyak informasi (3 data valid vs 1 titik tengah) sambil membuang yang jelas rusak. Prinsipnya: buang yang jelas rusak, jangan biarkan satu error menghancurkan hasil."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Mean</strong> memakai semua info tapi naif terhadap outlier — untuk data simetris bersih.</li>
          <li><strong>Median</strong> kebal outlier (hanya peduli urutan) — untuk data miring; mewakili &ldquo;tipikal&rdquo;.</li>
          <li><strong>Modus</strong> satu-satunya untuk kategori; waspadai bimodal = sinyal dua kelompok.</li>
          <li><strong>Weighted mean</strong> saat bobot beda; <strong>trimmed mean</strong> sebagai kompromi robust.</li>
          <li><strong>Geometric mean</strong> untuk return/pertumbuhan; <strong>harmonic mean</strong> untuk kecepatan/rate.</li>
          <li>Mean selalu tertarik ke ekor yang panjang (aturan visual dari histogram).</li>
          <li>Kadang jawaban benar = <strong>jangan ringkas jadi satu angka</strong> — tampilkan distribusinya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a13-sebaran" className="btn btn-primary btn-sm">Next: A1.3 →</Link>
      </div>
    </div>
  );
}
