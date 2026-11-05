import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A14Page() {
  const rightSkew = [
    {
      x: [5, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 12, 13, 15, 18, 22, 30, 45, 60, 90, 150],
      type: "histogram",
      name: "Pendapatan (juta Rp)",
      marker: { color: "#e8a838" },
    },
  ];

  const leftSkew = [
    {
      x: [20, 35, 50, 55, 58, 60, 60, 62, 63, 65, 65, 66, 67, 68, 68, 69, 70, 70, 71, 72, 73, 74],
      type: "histogram",
      name: "Nilai ujian (mudah)",
      marker: { color: "#2a7de1" },
    },
  ];

  const symmetric = [
    {
      x: [160, 162, 164, 165, 166, 167, 168, 168, 169, 170, 170, 171, 172, 172, 173, 174, 175, 176, 178, 180],
      type: "histogram",
      name: "Tinggi badan (cm)",
      marker: { color: "#3d9a50" },
    },
  ];

  const kurtData = [
    {
      x: [100,100,100,100,100,100,100,100,100,100,100,100,99,101,80,120,75,125],
      type: "histogram",
      name: "Leptokurtik (ekor tebal)",
      marker: { color: "#e8a838" },
      opacity: 0.65,
    },
    {
      x: [96,97,98,98,99,99,99,100,100,100,100,100,101,101,101,102,102,103,104],
      type: "histogram",
      name: "Mesokurtik (normal)",
      marker: { color: "#2a7de1" },
      opacity: 0.65,
    },
    {
      x: [90,92,94,96,98,100,102,104,106,108,110],
      type: "histogram",
      name: "Platikurtik (ekor tipis)",
      marker: { color: "#3d9a50" },
      opacity: 0.65,
    },
  ];

  const transformDemo = [
    {
      x: [5, 8, 12, 50, 200, 6, 9, 14, 60, 180, 7, 10, 40, 120, 90],
      type: "histogram",
      name: "Sebelum (asli)",
      marker: { color: "#e8a838" },
      opacity: 0.7,
    },
    {
      x: [15.4, 15.9, 16.3, 17.7, 19.1, 15.6, 16.0, 16.5, 17.9, 19.0, 15.8, 16.1, 17.5, 18.6, 18.3],
      type: "histogram",
      name: "Sesudah (log)",
      marker: { color: "#2a7de1" },
      opacity: 0.7,
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.4 — Statistika Deskriptif</span>
        <h1 className="display-title">Skewness &amp; Kurtosis: Membaca Ekor yang Menyimpan Risiko</h1>
        <p className="meta">45–60 menit • 2 lab • 5 quiz • 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: VaR Rp 2 Miliar yang Jebol Rp 8 Miliar</a></li>
          <li><a href="#skewness">Skewness — Si Tukang Miring</a></li>
          <li><a href="#kurtosis">Kurtosis — Si Penjaga Ekor Tebal</a></li>
          <li><a href="#transformasi">Transformasi Data — Para Penjinak Bentuk</a></li>
          <li><a href="#lab1">🔬 Lab 1: Satu Outlier Mengubah Skew &amp; Kurtosis</a></li>
          <li><a href="#lab2">🔬 Lab 2: Adu Transformasi — Log vs Akar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Bentuk Dataku Perlu Diapakan?</a></li>
          <li><a href="#case">📋 Mini-Case: Distribusi LGD yang Miring dan Berekor Tebal</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung dan menginterpretasikan skewness (<Tex math={String.raw`\gamma_1`} />) dan kurtosis (<Tex math={String.raw`\gamma_2`} />) — termasuk arti tiap simbol rumusnya.</li>
          <li>Membaca histogram dan menentukan arah kemiringan serta ketebalan ekor tanpa menghitung.</li>
          <li>Menjelaskan mengapa asumsi normalitas runtuh pada data leptokurtik — dan apa harganya dalam manajemen risiko.</li>
          <li>Memilih transformasi yang tepat (log / akar / Box-Cox) dan tahu kapan <strong>tidak</strong> mentransformasi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: VaR Rp 2 Miliar yang Jebol Rp 8 Miliar</h2>
      <div className="story">
        <p>
          Divisi treasury sebuah bank melaporkan ke direksi: <strong>"Value at Risk 99% portofolio = Rp 2 miliar."</strong>
          Artinya, menurut model, kerugian harian di atas Rp 2 miliar seharusnya terjadi kurang dari 1% hari —
          kira-kira 2–3 hari dalam setahun. Modelnya rapi: mean, SD, lalu VaR dihitung dengan rumus distribusi normal.
        </p>
        <p>
          Saat guncangan pasar datang, portofolio rugi <strong>Rp 8 miliar dalam sehari</strong> — empat kali lipat VaR.
          Menurut model normal, kejadian itu berpeluang 0,0001%: "sekali dalam 4.000 tahun". Nyatanya terjadi
          <em>tahun ini juga</em>. Audit forensik menemukan: return portofolio selama ini <strong>leptokurtik</strong> —
          ekornya tebal, crash kecil-menengah terjadi jauh lebih sering dari ramalan kurva normal yang mulus.
        </p>
        <p>
          <strong>Model tidak salah hitung — model salah mengira bentuk dunia.</strong>
          Mean dan SD memberi tahu lokasi dan sebaran. Tapi <em>bentuk</em> distribusi — miring ke mana,
          setebal apa ekornya — itulah yang menyimpan risiko sesungguhnya. Hari ini kita belajar membacanya.
        </p>
      </div>

      <h2 id="skewness">1. Skewness — Si Tukang Miring</h2>
      <p><strong>Definisi.</strong> Ukuran <em>asimetri</em> distribusi — ke arah mana ekornya memanjang.</p>
      <Tex math={String.raw`\gamma_1 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^3`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\gamma_1`} /> ("gamma satu"): koefisien skewness — angka tunggal peras seluruh bentuk jadi satu nilai.</li>
        <li><Tex math={String.raw`\frac{x_i - \bar{x}}{s}`} />: data yang <em>dibakukan</em> (z-score) — simpangan dibagi SD agar satuannya hilang dan data apa pun bisa dibandingkan.</li>
        <li><Tex math={String.raw`^3`} /> (pangkat tiga): <strong>kuncinya</strong> — pangkat ganjil <em>mempertahankan tanda</em>. Simpangan positif tetap positif, negatif tetap negatif. Kalau ekor kanan lebih panjang/berat, suku positif menang → <Tex math={String.raw`\gamma_1 > 0`} />.</li>
        <li><Tex math={String.raw`\frac{1}{n}\sum`} />: rata-ratakan semuanya.</li>
      </ul>
      <p><strong>Interpretasi:</strong></p>
      <ul>
        <li><Tex math={String.raw`\gamma_1 = 0`} />: Simetris (normal)</li>
        <li><Tex math={String.raw`\gamma_1 > 0`} />: Miring kanan (right skew) — ekor panjang di kanan</li>
        <li><Tex math={String.raw`\gamma_1 < 0`} />: Miring kiri (left skew) — ekor panjang di kiri</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: hitung skewness manual</summary>
        <p>Data: 4, 5, 6, 7, 18. Mean = 8; SD sampel ≈ 5,70.</p>
        <p><strong>Langkah 1</strong> — bakukan: (4−8)/5,70 = −0,70; (5−8)/5,70 = −0,53; (6−8)/5,70 = −0,35; (7−8)/5,70 = −0,18; (18−8)/5,70 = 1,75.<br />
        <strong>Langkah 2</strong> — pangkatkan tiga: −0,345; −0,146; −0,043; −0,005; <strong>+5,397</strong>.<br />
        <strong>Langkah 3</strong> — rata-ratakan: (−0,345 − 0,146 − 0,043 − 0,005 + 5,397)/5 ≈ <strong>0,97</strong>.</p>
        <p><Tex math={String.raw`\gamma_1 \approx 0{,}97 > 0`} /> → miring kanan. Perhatikan: satu data 18 menyumbang +5,4 sendirian — pangkat tiga membuat <strong>satu titik jauh mengalahkan empat titik dekat</strong>. Itulah mengapa skewness sensitif outlier.</p>
      </details>

      <p><strong>Kepribadian Skewness:</strong> dia tukang miring yang namanya menipu — "miring kanan" bukan berarti <em>massanya</em> condong kanan, melainkan <em>ekornya</em> menjulur kanan sementara massanya menumpuk di kiri. Aturan visualnya: <strong>mean selalu tertarik ke arah ekor</strong> — right skew → mean &gt; median (lihat A1.2).</p>
      <p><strong>Kapan memakai:</strong> diagnosa awal tiap dataset ("apakah mean jujur di sini?"); pemicu keputusan transformasi; sinyal risiko pada data loss/return.</p>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = pendapatan (juta Rp), tinggi batang = frekuensi. Cari di mana batang tertinggi (massa data), lalu ikuti ke arah mana batang-batang kecil menjulur (ekor).</p>
        <PlotlyChart
          data={rightSkew}
          title="Right Skew: Pendapatan (mean > median)"
          layout={{ xaxis: { title: "Juta Rp" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> massa menumpuk di 5–13 juta, ekor menjulur sampai 150 juta → <strong>miring kanan</strong>. Mean tertarik ke ekor (mean &gt; median). <strong>Contoh nyata:</strong> pendapatan, loss kredit, klaim asuransi — hampir semua data "uang dengan batas bawah nol" miring kanan.</p>
      </div>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti di atas — massa vs ekor. Kali ini perhatikan sisi kirinya.</p>
        <PlotlyChart
          data={leftSkew}
          title="Left Skew: Nilai Ujian yang Terlalu Mudah"
          layout={{ xaxis: { title: "Nilai" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> massa menumpuk di 60–74 (nilai tinggi), ekor menjulur ke kiri sampai 20 → <strong>miring kiri</strong>. Mean &lt; median. <strong>Contoh nyata:</strong> nilai ujian yang terlalu mudah, usia pensiun (mayoritas 55–60, sedikit yang pensiun dini).</p>
      </div>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> bandingkan simetri kiri-kanan terhadap puncaknya.</p>
        <PlotlyChart
          data={symmetric}
          title="Simetris: Tinggi Badan (mean ≈ median)"
          layout={{ xaxis: { title: "cm" }, yaxis: { title: "Frekuensi" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> kiri-kanan seimbang, mean ≈ median ≈ modus. Inilah satu-satunya kondisi di mana mean adalah ringkasan yang jujur tanpa kualifikasi.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Implikasi risiko:</strong> right skew pada <em>loss</em> = bahaya. Ekor kanan berarti potensi loss besar. Kalau distribusi loss miring kanan tapi kamu hanya lihat mean, kamu meremehkan skenario terburuk.</p>
      </div>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Skew positif artinya datanya condong ke kanan."</p>
        <p><strong>Yang benar:</strong> yang condong ke kanan adalah <em>ekornya</em> — massanya justru menumpuk di <em>kiri</em> (lihat chart pendapatan: batang tertinggi di 5–13 juta, bukan di 150 juta). Nama skewness = arah <strong>ekor</strong>, bukan arah massa. Analis yang salah membaca ini akan mencari "mayoritas" di tempat yang salah.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Diagnosa 5 detik tanpa rumus:</strong> bandingkan mean vs median. Mean &gt; median → curigai right skew. Mean &lt; median → curigai left skew. Selisihnya makin besar relatif terhadap SD, makin parah miringnya. Ini bukan pengganti <Tex math={String.raw`\gamma_1`} />, tapi triase tercepat sebelum kamu buka Python.</p>
      </div>

      <h2 id="kurtosis">2. Kurtosis — Si Penjaga Ekor Tebal</h2>
      <p><strong>Definisi.</strong> Ukuran "ketebalan ekor" — seberapa sering kejadian ekstrem muncul dibanding prediksi normal.</p>
      <Tex math={String.raw`\gamma_2 = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{x_i - \bar{x}}{s}\right)^4 - 3`} block />
      <p>(−3 agar distribusi normal = 0 — disebut <em>excess kurtosis</em>.)</p>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\gamma_2`} /> ("gamma dua"): excess kurtosis — nol berarti "setebal ekor normal".</li>
        <li><Tex math={String.raw`^4`} /> (pangkat empat): pangkat <em>genap</em> — tanda hilang, yang dihitung murni <strong>jarak ekstrem</strong>. Satu data 4 SD dari mean menyumbang 4⁴ = <strong>256x</strong> dibanding data di mean. Inilah mengapa kurtosis adalah radar kejadian ekstrem.</li>
        <li><Tex math={String.raw`- 3`} />: kurtosis mentah distribusi normal = 3; dikurangi agar normal menjadi acuan nol.</li>
      </ul>
      <p><strong>Interpretasi:</strong></p>
      <ul>
        <li><Tex math={String.raw`\gamma_2 = 0`} />: Normal (mesokurtik)</li>
        <li><Tex math={String.raw`\gamma_2 > 0`} />: Ekor tebal (leptokurtik) — lebih banyak outlier</li>
        <li><Tex math={String.raw`\gamma_2 < 0`} />: Ekor tipis (platikurtik) — lebih sedikit outlier</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca tiga nilai kurtosis</summary>
        <p>Diberikan excess kurtosis tiga dataset:</p>
        <p><strong>(a)</strong> <Tex math={String.raw`\gamma_2 = 0`} /> → mesokurtik: ekor setebal normal. Contoh: tinggi badan.<br />
        <strong>(b)</strong> <Tex math={String.raw`\gamma_2 = 4{,}2`} /> → leptokurtik: ekor <em>tebal</em>. Contoh: return saham harian — crash −10% terjadi jauh lebih sering dari ramalan normal.<br />
        <strong>(c)</strong> <Tex math={String.raw`\gamma_2 = -0{,}8`} /> → platikurtik: ekor <em>tipis</em>, data menyebar merata tanpa kejutan. Contoh: distribusi mendekati uniform.</p>
        <p>Angka (b) inilah yang membunuh model VaR di cerita pembuka: model mengira ekor setipis normal, kenyataannya setebal (b).</p>
      </details>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga histogram bertumpuk (kuning = leptokurtik, biru = normal, hijau = platikurtik). Jangan lihat puncaknya — <strong>lihat ujung-ujungnya</strong> (nilai jauh dari 100).</p>
        <PlotlyChart
          data={kurtData}
          title="Kurtosis: Tebalnya Ekor, Bukan Tajamnya Puncak"
          layout={{ barmode: "overlay", xaxis: { title: "Nilai" }, yaxis: { title: "Frekuensi" }, showlegend: true }}
        />
        <p><strong>Interpretasi:</strong> yang kuning menumpuk rapat di tengah TAPI punya titik-titik jauh di 75–80 dan 120–125 — <strong>itulah</strong> ekor tebal: tenang di tengah, brutal di ujung. Inilah profil return saham dan kerugian kredit: "biasanya kalem, sesekali bencana".</p>
      </div>

      <p><strong>Kepribadian Kurtosis:</strong> dia penjaga ekor yang pendiam — tidak peduli di mana pusat data atau miring ke mana; satu-satunya pertanyaannya: "seberapa sering hal gila terjadi?" Pangkat empat membuatnya paranoid dengan benar: satu kejadian 4-SD berteriak 256x lebih keras dari data normal.</p>
      <p><strong>Kapan memakai:</strong> validasi asumsi model risiko; deteksi "kejadian ekstrem lebih sering dari dugaan"; pembanding antar portofolio ("portofolio mana yang ekornya lebih tebal?").</p>

      <div className="callout callout-warning">
        <p><strong>Mengapa penting untuk risiko?</strong> Model normal <em>underestimate</em> kejadian ekstrem. Jika data leptokurtik tapi kamu pakai asumsi normal, kamu <strong>meremehkan risiko</strong> — persis kesalahan yang mahal saat krisis. Aturan praktis: <Tex math={String.raw`\gamma_2 > 1`} /> pada data return/loss → jangan percaya VaR normal.</p>
      </div>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Kurtosis tinggi berarti puncaknya runcing."</p>
        <p><strong>Yang benar:</strong> kurtosis mengukur <strong>bobot ekor</strong>, bukan ketajaman puncak. Distribusi bisa berpunck datar tapi berekor tebal (lihat yang kuning di chart: puncaknya tidak istimewa, ekornya yang berbahaya). Fokus ke ujung-ujung, bukan ke tengah.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Skewness dan kurtosis adalah pasangan diagnosa:</strong> skewness menjawab "ke arah mana bahayanya?", kurtosis menjawab "seberapa sering bahayanya?". Loss kredit yang <em>right-skewed dan leptokurtik</em> = kombinasi paling berbahaya: potensi loss besar (ekor kanan) yang terjadi lebih sering dari dugaan (ekor tebal). Kalau laporan risikomu hanya menampilkan mean dan SD, dua informasi ini hilang total.</p>
      </div>

      <h2 id="transformasi">3. Transformasi Data — Para Penjinak Bentuk</h2>
      <p>Kalau bentuk data bermasalah (sangat miring) tapi modelmu butuh normalitas (regresi linear), solusinya: <strong>ubah bentuk datanya</strong> — dengan fungsi yang menarik ekor yang terlalu panjang.</p>

      <h3>Log Transform — Si Penjinak Ekor</h3>
      <Tex math={String.raw`y = \log(x)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`y`} />: nilai baru (yang distribusinya lebih simetris).</li>
        <li><Tex math={String.raw`x`} />: nilai asli. <strong>Syarat: <Tex math={String.raw`x > 0`} /></strong> — log nol/negatif tidak terdefinisi.</li>
        <li>Mengapa menjinakkan? Log <em>memampatkan</em> angka besar jauh lebih agresif dari angka kecil: 200 jt → 19,1 sedangkan 5 jt → 15,4 (log natural). Ekor kanan yang membentang 195 juta kini hanya membentang 3,7 — kemiringan runtuh.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah</summary>
        <p>Pendapatan (juta Rp): 5, 8, 12, 50, 200 — sangat right-skewed (bentangan 195).</p>
        <p><strong>Langkah 1</strong> — log natural tiap nilai: ln(5 jt)=15,4; ln(8 jt)=15,9; ln(12 jt)=16,3; ln(50 jt)=17,7; ln(200 jt)=19,1.<br />
        <strong>Langkah 2</strong> — bentangan baru: 19,1 − 15,4 = 3,7 (dari 195!) dan jarak antar titik jauh lebih merata.</p>
        <p>Hasil: distribusi jauh lebih simetris. <strong>Catatan:</strong> untuk data yang mengandung nol, pakai <Tex math={String.raw`\log(x+1)`} />.</p>
      </details>

      <p><strong>Kepribadian Log:</strong> dia penjinak paling agresif — spesialis ekor kanan positif (pendapatan, harga, loss). Tapi ingat: dia mengubah makna. Model atas <Tex math={String.raw`\log`} />(pendapatan) memprediksi <em>rata-rata geometrik/median</em>, bukan mean rupiah. Jelaskan ini ke bisnis sebelum presentasi.</p>
      <p><strong>Kapan memakai:</strong> data right-skewed positif untuk model ber-asumsi normalitas (regresi linear). <em>Jangan pakai:</em> data mengandung nol/negatif (tanpa +1), atau left skew (dia menarik ke arah yang salah).</p>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua histogram bertumpuk — kuning = data asli, biru = setelah log transform. Perhatikan perubahan bentuknya, bukan nilai sumbunya.</p>
        <PlotlyChart
          data={transformDemo}
          title="Efek Log Transform pada Data Skewed"
          layout={{ barmode: "overlay", xaxis: { title: "Nilai" }, yaxis: { title: "Frekuensi" }, showlegend: true }}
        />
        <p><strong>Interpretasi:</strong> yang kuning menjulur jauh ke kanan (sangat miring); yang biru mengumpul simetris. Transformasi berhasil <em>jika</em> bentuknya membaik — selalu verifikasi dengan histogram sesudahnya, jangan asal transform.</p>
      </div>

      <h3>Square Root — Si Pelembut</h3>
      <Tex math={String.raw`y = \sqrt{x}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`y`} /> nilai baru; <Tex math={String.raw`x \ge 0`} /> nilai asli. Efeknya seperti log tapi <strong>lebih lembut</strong> — cocok untuk kemiringan sedang.</p>
      <p><strong>Kepribadian:</strong> adik log yang tidak seagresif kakaknya. Spesialis data <em>count</em> (jumlah kejadian: jumlah klaim, jumlah transaksi fraud per hari) yang biasanya miring kanan tapi tidak separah data uang.</p>
      <p><strong>Kapan memakai:</strong> data count dengan skew sedang; saat log terasa "terlalu kuat" dan merusak interpretasi.</p>

      <h3>Box-Cox — Si Pencari Lambda</h3>
      <Tex math={String.raw`y = \frac{x^\lambda - 1}{\lambda}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\lambda`} /> ("lambda"): parameter yang <em>dicari otomatis</em> dari data (maksimum likelihood) — bukan tebakanmu.</li>
        <li><Tex math={String.raw`\lambda = 0`} /> → menjadi log; <Tex math={String.raw`\lambda = 1`} /> → tanpa transformasi; <Tex math={String.raw`\lambda = 0{,}5`} /> → akar kuadrat. Satu rumus mencakup semuanya.</li>
      </ul>
      <p><strong>Kepribadian:</strong> dia si perfeksionis — tidak menebak-nebak, melainkan mengoptimasi. Tapi butuh <Tex math={String.raw`x > 0`} /> dan hasilnya (<Tex math={String.raw`\lambda = 0{,}37`} />) sulit dijelaskan ke direksi.</p>
      <p><strong>Kapan memakai:</strong> kamu ingin transformasi "terbaik" secara statistik dan audiensnya teknis. <em>Jangan pakai:</em> jika interpretabilitas ke bisnis lebih penting dari normalitas sempurna.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Data miring → langsung log transform. Selalu."</p>
        <p><strong>Yang benar:</strong> tiga pengecualian. (1) <strong>Left skew:</strong> log menarik ke arah yang salah — refleksikan dulu atau pakai Yeo-Johnson. (2) <strong>Model nonparametrik/tree-based:</strong> random forest tidak peduli bentuk distribusi — transformasi hanya membuang waktu dan merusak interpretasi. (3) <strong>Stakeholder butuh angka asli:</strong> "rata-rata log-pendapatan 16,2" tidak bisa dipresentasikan ke direksi tanpa diterjemahkan balik.</p>
      </div>

      <h2>Kapan Transformasi Dibutuhkan?</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>Transform jika...</th><th>Tidak perlu jika...</th></tr>
          </thead>
          <tbody>
            <tr><td>Model asumsi normalitas (regresi linear)</td><td>Model nonparametrik / tree-based</td></tr>
            <tr><td>Skewness ekstrem (|γ₁| &gt; 2)</td><td>Interpretasi asli lebih penting</td></tr>
            <tr><td>Ingin stabilkan variansi</td><td>Transformasi merusak makna bisnis</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="lab1">🔬 Lab 1: Satu Outlier Mengubah Skew &amp; Kurtosis</h2>
      <p>
        Mulai dari data simetris 20 titik. Tambahkan <em>satu</em> outlier jauh di kanan —
        lalu lihat skewness dan kurtosis bereaksi. Fungsi di bawah murni Python (tanpa scipy).
      </p>
      <PyodideLab
        title="Lab 1 — Sensitivitas γ₁ dan γ₂ terhadap outlier"
        hint="Coba outlier = 30 → 60 → 120. Pada titik berapa |γ₁| > 2 (ambang 'sangat miring')? Bandingkan: mana yang meledak duluan, skewness atau kurtosis?"
        defaultCode={`import statistics as st

base = [48, 49, 50, 51, 52] * 4   # 20 data simetris, mean = 50
outlier = 120                       # <-- ubah: 30, 60, 120, 200
data = base + [outlier]

def skewness(x):
    m, s = st.mean(x), st.stdev(x)
    return sum(((v - m) / s) ** 3 for v in x) / len(x)

def excess_kurtosis(x):
    m, s = st.mean(x), st.stdev(x)
    return sum(((v - m) / s) ** 4 for v in x) / len(x) - 3

print(f"n = {len(data)}, outlier = {outlier}")
print(f"mean   = {st.mean(data):.1f}   median = {st.median(data):.1f}")
print(f"skewness (g1)        = {skewness(data):+.2f}")
print(f"excess kurtosis (g2) = {excess_kurtosis(data):+.2f}")
print()
print("Aturan baca: |g1|>1 miring jelas, |g1|>2 sangat miring.")
print("g2>1 waspadai ekor tebal -> jangan percaya VaR normal.")`}
      />

      <h2 id="lab2">🔬 Lab 2: Adu Transformasi — Log vs Akar</h2>
      <p>
        Data pendapatan sangat right-skewed. Bandingkan skewness sebelum transformasi,
        sesudah log, dan sesudah akar kuadrat — transform mana yang paling menormalkan?
      </p>
      <PyodideLab
        title="Lab 2 — Duel penjinak ekor"
        hint="Coba tambah outlier ekstrem (misal 2000) ke data. Transform mana yang tetap waras? Kapan log 'terlalu kuat' dibanding akar?"
        defaultCode={`import math, statistics as st

data = [5, 6, 7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 12, 13,
        15, 18, 22, 30, 45, 60, 90, 150]   # juta Rp; <-- tambah 2000 di ujung

def skewness(x):
    m, s = st.mean(x), st.stdev(x)
    return sum(((v - m) / s) ** 3 for v in x) / len(x)

log_t = [math.log(v) for v in data]
sqrt_t = [math.sqrt(v) for v in data]

print(f"asli : skew = {skewness(data):+.2f}")
print(f"log  : skew = {skewness(log_t):+.2f}")
print(f"akar : skew = {skewness(sqrt_t):+.2f}")
print()
pemenang = min([("log", abs(skewness(log_t))), ("akar", abs(skewness(sqrt_t)))], key=lambda t: t[1])
print(f"Paling simetris: {pemenang[0]}")
print("Ingat: pemenang statistik belum tentu pemenang bisnis -")
print("cek juga apakah hasilnya masih bisa dijelaskan ke direksi.")`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Bentuk Dataku Perlu Diapakan?</h2>

      <div className="decision-card">
        <h3>1. |γ₁| &gt; 1 — miring jelas → <strong>waspada mean, pertimbangkan transform</strong></h3>
        <p><strong>Kondisi:</strong> skewness di luar ±1, atau mean vs median beda jauh relatif terhadap SD.</p>
        <p><strong>Pakai:</strong> median untuk "nilai tipikal"; jika model butuh normalitas (regresi linear) → transformasi (kartu 2).</p>
        <p><strong>Contoh nyata:</strong> distribusi loss kredit γ₁ = +2,6 → jangan laporkan mean loss sebagai "kerugian tipikal".</p>
      </div>

      <div className="decision-card">
        <h3>2. Right-skew positif + model butuh normalitas → <strong>log transform</strong></h3>
        <p><strong>Kondisi:</strong> semua x &gt; 0, ekor kanan panjang (pendapatan, harga, loss).</p>
        <p><strong>Pakai:</strong> log dulu (paling umum); kalau terlalu agresif, coba akar kuadrat; kalau mau optimal otomatis → Box-Cox.</p>
        <p><strong>Contoh nyata:</strong> regresi "pendapatan ~ pendidikan + pengalaman" — regresikan log(pendapatan), bukan pendapatan mentah.</p>
      </div>

      <div className="decision-card">
        <h3>3. Leptokurtik (γ₂ &gt; 1) + model risiko → <strong>buang asumsi normal</strong></h3>
        <p><strong>Kondisi:</strong> return/loss dengan ekor tebal.</p>
        <p><strong>Pakai:</strong> VaR historis / expected shortfall / distribusi t — bukan VaR normal. Transformasi tidak memperbaiki ekor tebal (log menjinakkan skew, bukan kurtosis).</p>
        <p><strong>Contoh nyata:</strong> pelajaran cerita pembuka — VaR normal Rp 2 M vs realita Rp 8 M.</p>
      </div>

      <div className="decision-card">
        <h3>4. Left skew → <strong>JANGAN log langsung</strong></h3>
        <p><strong>Kondisi:</strong> ekor di kiri (nilai ujian mudah, usia pensiun).</p>
        <p><strong>Pakai:</strong> refleksikan dulu (<Tex math={String.raw`x' = \text{maks} - x`} />) baru log, atau pakai Yeo-Johnson yang menangani dua arah.</p>
        <p><strong>Contoh nyata:</strong> log pada data left-skew justru memperparah kemiringan — arah tarikannya salah.</p>
      </div>

      <div className="decision-card">
        <h3>5. Interpretasi bisnis &gt; normalitas → <strong>jangan transform</strong></h3>
        <p><strong>Kondisi:</strong> model tree-based (tak peduli distribusi), atau audiens butuh angka asli.</p>
        <p><strong>Pakai:</strong> model nonparametrik, atau laporkan median/IQR pada skala asli.</p>
        <p><strong>Contoh nyata:</strong> random forest prediksi NPL — biarkan DPD mentah; "rata-rata log-DPD 2,1" tak bermakna di rapat direksi.</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Plot histogram.</strong> Ekor ke kanan → right skew; titik jauh di ujung → curigai ekor tebal.</li>
          <li><strong>Mean vs median.</strong> Beda jauh = miring; pakai median untuk "tipikal".</li>
          <li><strong>γ₂ &gt; 1 pada return/loss</strong> → VaR normal dilarang; pakai historis/expected shortfall.</li>
          <li><strong>Transform itu obat, bukan vitamin:</strong> hanya jika model butuh normalitas — dan selalu verifikasi histogram sesudahnya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Distribusi LGD yang Miring dan Berekor Tebal</h2>
      <div className="callout">
        <p>Kamu analis risiko kredit. Dari 1.000 kredit yang macet, LGD (<em>loss given default</em>):</p>
        <ul>
          <li>900 kredit: LGD 5–20% (ada agunan, tertagih sebagian)</li>
          <li>80 kredit: LGD 30–60% (agunan bermasalah)</li>
          <li>20 kredit: LGD 90–100% (tanpa agunan, macet total)</li>
        </ul>
        <p>Statistiknya: mean LGD = 18%, median = 12%, γ₁ = +2,6, excess kurtosis γ₂ = 8,4.</p>
        <p><strong>Pertanyaan:</strong> (a) Bolehkah memakai mean LGD 18% sebagai "kerugian tipikal" untuk CKPN? (b) Tim modeling ingin regresi linear LGD terhadap fitur debitur — langkah apa sebelum modeling? (c) Jika VaR portofolio dihitung dengan asumsi normal, apa risikonya?</p>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>Tidak.</strong> γ₁ = +2,6 (sangat miring kanan): mean 18% tertarik 20 kredit bencana; "tipikal" yang jujur = median 12%. Untuk CKPN, pakai <strong>distribusi per bucket LGD × exposure</strong> — expected loss total tetap memakai mean tertimbang exposure (itu benar secara agregat), tapi jangan sebut 18% sebagai "tipikal".</p>
          <p>(b) <strong>Transformasi dulu:</strong> LGD dalam (0,1) dan sangat miring → kandidat: logit transform <Tex math={String.raw`\log(p/(1-p))`} /> (standar untuk proporsi) atau Box-Cox; verifikasi residual model normal <em>sesudahnya</em>. Alternatif jujur: model dua tahap (probabilitas LGD ekstrem vs besaran LGD normal) — sering lebih baik dari satu regresi dipaksa.</p>
          <p>(c) <strong>VaR normal akan jebol</strong> seperti cerita pembuka: γ₂ = 8,4 berarti kejadian LGD 90–100% terjadi jauh lebih sering dari ramalan normal. Pakai <strong>expected shortfall</strong> atau VaR historis — dan siapkan modal untuk ekor, bukan untuk rata-rata.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <Quiz
        question="Data loss kredit: kebanyakan kecil, sedikit sangat besar. Skewness-nya?"
        options={[
          "Negatif (miring kiri)",
          "Nol (simetris)",
          "Positif (miring kanan)",
          "Tidak bisa ditentukan",
        ]}
        correct={2}
        explanation="Ekor panjang di kanan (loss besar). Ini pola umum data risiko — dan alasan kenapa mean loss bisa menipu."
      />

      <Quiz
        question="Kamu pakai model normal untuk return saham (leptokurtik). Apa risikonya?"
        options={[
          "Overestimate risiko",
          "Underestimate kejadian ekstrem",
          "Tidak ada masalah",
          "Model jadi lebih akurat",
        ]}
        correct={1}
        explanation="Ekor tebal = crash terjadi lebih sering dari prediksi normal. Model meremehkan risiko. Inilah salah satu pelajaran dari krisis 2008."
      />

      <Quiz
        question="Data pendapatan sangat right-skewed akan dipakai untuk regresi linear (asumsi normalitas). Langkah terbaik?"
        options={[
          "Langsung pakai — regresi tidak peduli distribusi",
          "Log transform, lalu cek apakah distribusi membaik",
          "Hapus semua data di atas Rp 50 juta",
          "Ganti ke model tree-based tanpa cek apa pun",
        ]}
        correct={1}
        explanation="Regresi linear mengasumsikan residual normal — prediktor yang sangat skewed merusaknya. Log transform adalah langkah pertama yang tepat; verifikasi hasilnya, bukan asal transform."
      />

      <Quiz
        question="Distribusi loss: γ₁ = +2,3. Di mana massa data dan di mana bahayanya?"
        options={[
          "Massa di kanan, bahaya di kiri",
          "Massa di kiri (loss kecil), bahaya di ekor kanan (loss besar)",
          "Massa dan bahaya sama-sama di tengah",
          "Tidak bisa ditentukan dari skewness",
        ]}
        correct={1}
        explanation="Tepat: skew positif = ekor di kanan, massa di kiri. Mayoritas loss kecil (massa kiri), tapi bahaya sesungguhnya di ekor kanan — sedikit, tapi besar. Inilah profil risiko kredit klasik."
      />

      <Quiz
        question="Seorang junior berkata: 'Kurtosis portofolio kita tinggi, berarti return-nya menumpuk runcing di tengah — aman.' Status klaim ini?"
        options={[
          "Benar — puncak runcing = stabil",
          "Salah — kurtosis mengukur bobot ekor, bukan puncak; kurtosis tinggi = kejadian ekstrem lebih sering",
          "Benar sebagian — hanya untuk data normal",
          "Tidak relevan untuk portofolio",
        ]}
        correct={1}
        explanation="Salah total — dan salah yang berbahaya. Kurtosis tinggi = ekor tebal = crash terjadi lebih sering dari dugaan. 'Runcing di tengah' justru sering berpasangan dengan 'brutal di ujung'."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Skewness (γ₁)</strong> = arah ekor; pangkat tiga mempertahankan tanda. <em>Jangan pakai:</em> berasumsi mean jujur saat |γ₁| &gt; 1 — pakai median.</li>
          <li><strong>Kurtosis (γ₂)</strong> = tebal ekor; pangkat empat menghitung ekstrem. <em>Jangan pakai:</em> VaR/asumsi normal saat γ₂ &gt; 1 pada return/loss.</li>
          <li><strong>Log transform</strong> = penjinak ekor kanan (x &gt; 0). <em>Jangan pakai:</em> untuk left skew, data nol/negatif, atau saat interpretasi asli lebih penting.</li>
          <li><strong>Akar kuadrat</strong> = versi lembut untuk data count. <strong>Box-Cox</strong> = optimasi otomatis λ (teknis saja).</li>
          <li><strong>Mean tertarik ke ekor;</strong> massa vs ekor jangan tertukar (miskonsepsi skew).</li>
          <li><strong>Transformasi itu obat:</strong> verifikasi histogram sesudahnya; kalau model tree-based atau audiens butuh angka asli — jangan transform.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a15-kuantil-outlier" className="btn btn-primary btn-sm">Next: A1.5 →</Link>
      </div>
    </div>
  );
}
