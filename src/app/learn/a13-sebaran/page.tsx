import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import Tex from "@/components/Tex";
import PyodideLab from "@/components/PyodideLab";
import Link from "next/link";


export default function A13Page() {
  const spreadData = [
    {
      x: [73, 74, 74, 75, 75, 75, 76, 76, 77, 75],
      type: "histogram",
      name: "Kelas A (stabil)",
      marker: { color: "#2a7de1" },
      opacity: 0.7,
    },
    {
      x: [40, 50, 60, 65, 70, 75, 80, 85, 90, 100],
      type: "histogram",
      name: "Kelas B (volatile)",
      marker: { color: "#e8a838" },
      opacity: 0.7,
    },
  ];

  const empiricalData = [
    {
      x: [62, 65, 66, 68, 69, 70, 70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 80, 82, 85, 88],
      type: "histogram",
      name: "Data (mean=75, SD≈7)",
      marker: { color: "#2a7de1" },
      histnorm: "probability",
    },
  ];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">A1.3 — Statistika Deskriptif</span>
        <h1 className="display-title">Ukuran Sebaran: Mean Sama, Nasib Beda</h1>
        <p className="meta">45–60 menit • 2 lab • 5 quiz • 1 mini-case</p>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Cabang, NPL Sama, Satu Bangkrut</a></li>
          <li><a href="#range">Range — Si Tukang Intip Ujung</a></li>
          <li><a href="#variansi">Variansi — Si Penghitung yang Bisu Satuan</a></li>
          <li><a href="#sd">Standar Deviasi — Si Penerjemah</a></li>
          <li><a href="#iqr">IQR — Si Penjaga Tengah yang Kebal</a></li>
          <li><a href="#mad">MAD — Si Paling Kebal</a></li>
          <li><a href="#cv">CV — Si Pembanding Apel vs Jeruk</a></li>
          <li><a href="#semidev">Semi-Deviation — Si Pesimis yang Realistis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Geser Outlier, Lihat SD Meledak (IQR Diam)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji Aturan Empiris 68–95–99,7</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Ukuran Sebaran Mana yang Jujur?</a></li>
          <li><a href="#case">📋 Mini-Case: Dua Portofolio, Expected Loss Sama, Modal Beda Jauh</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung range, variansi, SD, IQR, MAD, dan CV langkah-demi-langkah — sambil menjelaskan arti tiap simbol rumusnya.</li>
          <li>Memilih ukuran sebaran yang tepat (dan yang robust) untuk data bersih vs data ber-outlier.</li>
          <li>Membuktikan lewat lab bahwa satu outlier meledakkan SD/range tapi tidak menggerakkan IQR/MAD.</li>
          <li>Menerapkan CV untuk membandingkan volatilitas antar portofolio beda skala, dan semi-deviation untuk downside risk.</li>
          <li>Menjelaskan ke manajemen mengapa <strong>mean tanpa sebaran = setengah cerita</strong> — dengan angka.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dua Cabang, NPL Sama, Satu Bangkrut</h2>
      <div className="story">
        <p>
          Tahun 2023, dua cabang Bank Maju Jaya sama-sama melaporkan <strong>NPL rata-rata 3%</strong>
          selama lima tahun. Direksi memberi keduanya rapor "sehat" dan modal cadangan yang sama.
        </p>
        <p>
          Cabang Harmoni: NPL tahunan 2,8% – 3,1% – 2,9% – 3,2% – 3,0%. Stabil seperti detak jantung atlet.
          Cabang Glodok: NPL tahunan 0,5% – 0,8% – 1,2% – 2,0% – <strong>10,5%</strong>.
          Rata-ratanya juga 3%. Matematikanya benar.
        </p>
        <p>
          Tahun 2024, satu debitur korporasi Glodok gagal bayar Rp 40 miliar. Cadangan yang disiapkan
          untuk "rata-rata 3%" jebol dalam sebulan. Glodok kolaps; Harmoni baik-baik saja.
          <strong>Angka rata-ratanya benar — tapi tanpa sebaran, angka itu dusta.</strong>
          Inilah yang kita bedah hari ini: tujuh cara mengukur sebaran, dan kapan masing-masing berbohong.
        </p>
      </div>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua histogram bertumpuk. Sumbu horizontal = nilai, tinggi batang = frekuensi. Biru = Kelas A, kuning = Kelas B.</p>
        <PlotlyChart
          data={spreadData}
          title="Rata-rata Sama (75), Sebaran Beda Jauh"
          layout={{ barmode: "overlay", xaxis: { title: "Nilai" }, yaxis: { title: "Frekuensi" }, showlegend: true }}
        />
        <p><strong>Interpretasi:</strong> kedua kelas rata-ratanya 75 — tapi Kelas A menumpuk rapat di 73–77 (hasil bisa diprediksi), sedangkan Kelas B menyebar 40–100 (hasil lotre). <strong>Mean tanpa sebaran menyembunyikan perbedaan terpenting.</strong> Dalam risiko kredit: dua portofolio dengan <em>expected loss</em> sama tapi volatilitas beda → modal yang dibutuhkan beda jauh.</p>
      </div>

      <h2 id="range">1. Range — Si Tukang Intip Ujung</h2>
      <p><strong>Definisi.</strong> Selisih nilai terbesar dan terkecil — seberapa lebar "bentangan" datamu.</p>
      <Tex math={String.raw`\text{Range} = \max - \min`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\max`} />: nilai terbesar dalam data.</li>
        <li><Tex math={String.raw`\min`} />: nilai terkecil dalam data.</li>
        <li>Range hanya memakai <strong>2 titik</strong> — 8 data di tengahnya diabaikan total.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah</summary>
        <p>Data DPD (hari): 40, 73, 75, 77, 100.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`\max = 100`} />, <Tex math={String.raw`\min = 40`} />.<br />
        <strong>Langkah 2</strong> — Range = 100 − 40 = <strong>60 hari</strong>.</p>
        <p>Artinya: bentangan keterlambatan 60 hari. Tapi perhatikan — tiga data di tengah (73, 75, 77) tidak memengaruhi hasil sama sekali.</p>
      </details>

      <p><strong>Kepribadian Range:</strong> dia tukang intip yang hanya melihat dua ujung jalan lalu pulang melapor. Cepat, murah, dan <em>sangat mudah ditipu</em>: satu data ekstrem (salah input, satu debitur anomali) langsung merusak laporannya.</p>
      <p><strong>Kapan memakai:</strong> cek cepat kewarasan data ("kok range DPD 0–900 hari? ada yang salah input?"). Jangan pernah jadikan satu-satunya ukuran.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Range besar = data bervariasi secara merata."</p>
        <p><strong>Yang benar:</strong> range 60 bisa berarti data tersebar merata — atau 9 data menumpuk di satu titik plus 1 outlier jauh. Range tidak bisa membedakan keduanya. Kalau butuh tahu "apakah variasinya merata atau hanya ulah satu titik", pakai SD atau IQR.</p>
      </div>

      <h2 id="variansi">2. Variansi — Si Penghitung yang Bisu Satuan</h2>
      <p><strong>Definisi.</strong> Rata-rata kuadrat jarak tiap data dari rata-rata — seberapa jauh data "menyimpang", dikuadratkan agar positif.</p>

      <h3>Variansi Populasi</h3>
      <Tex math={String.raw`\sigma^2 = \frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\sigma^2`} /> ("sigma kuadrat"): variansi populasi — target yang ingin kita ketahui.</li>
        <li><Tex math={String.raw`N`} />: seluruh anggota populasi.</li>
        <li><Tex math={String.raw`\mu`} /> ("mu"): rata-rata populasi (yang sebenarnya).</li>
        <li><Tex math={String.raw`x_i - \mu`} />: simpangan data ke-<Tex math={String.raw`i`} /> dari rata-rata.</li>
        <li><Tex math={String.raw`^2`} />: dikuadratkan — agar simpangan negatif tidak saling menghapus, dan simpangan besar "dihukum" lebih berat.</li>
        <li><Tex math={String.raw`\frac{1}{N}\sum`} />: rata-ratakan kuadrat simpangan itu.</li>
      </ul>

      <h3>Variansi Sampel</h3>
      <Tex math={String.raw`s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`s^2`} />: variansi sampel — tebakan kita atas <Tex math={String.raw`\sigma^2`} />.</li>
        <li><Tex math={String.raw`\bar{x}`} />: rata-rata <em>sampel</em> (pengganti <Tex math={String.raw`\mu`} /> yang tak diketahui).</li>
        <li><Tex math={String.raw`n-1`} />: <strong>koreksi Bessel</strong> — bukan <Tex math={String.raw`n`} />. Karena <Tex math={String.raw`\bar{x}`} /> dihitung <em>dari data yang sama</em>, simpangan terlihat lebih kecil dari sebenarnya; pembagi <Tex math={String.raw`n-1`} /> mengoreksinya agar tebakan tidak bias sistematis (<em>unbiased</em>).</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: variansi sampel</summary>
        <p>Data: 8, 10, 12 (juta Rp). Mean = 10.</p>
        <p><strong>Langkah 1</strong> — simpangan: (8−10) = −2, (10−10) = 0, (12−10) = 2.<br />
        <strong>Langkah 2</strong> — kuadratkan: 4, 0, 4.<br />
        <strong>Langkah 3</strong> — jumlahkan lalu bagi <Tex math={String.raw`n-1 = 2`} />: (4+0+4)/2 = <strong>4</strong>.</p>
        <p>Variansi sampel = 4 — tapi satuannya "juta Rp kuadrat" (Rp²). Tidak bermakna bisnis. Itulah mengapa kita butuh penerjemahnya: SD.</p>
      </details>

      <p><strong>Kepribadian Variansi:</strong> dia akuntan yang teliti tapi bisu — menghitung dengan sempurna dalam bahasa yang tak dimengerti siapa pun (satuan kuadrat). Semua teori statistik dibangun di atasnya, tapi jangan pernah menampilkannya mentah ke manajemen.</p>
      <p><strong>Kapan memakai:</strong> perhitungan teoretis, dekomposisi risiko portofolio, rumus-rumus statistik. Untuk <em>komunikasi</em>, selalu konversi ke SD.</p>

      <div className="tip">
        <p><strong>💡 Kenapa dikuadratkan, bukan nilai absolut?</strong> Dua alasan: (1) kuadrat bisa diturunkan (kalkulus) — nilai absolut tidak mulus di nol, jadi seluruh teori statistik klasik dibangun di atas kuadrat; (2) kuadrat "menghukum" simpangan besar secara progresif — simpangan 2x lipat berkontribusi 4x. Inilah mengapa variansi/SD <em>sangat sensitif outlier</em>: satu data 10x lebih jauh menyumbang 100x ke variansi.</p>
      </div>

      <h2 id="sd">3. Standar Deviasi — Si Penerjemah</h2>
      <p><strong>Definisi.</strong> Akar dari variansi — mengembalikan sebaran ke satuan asli data.</p>
      <Tex math={String.raw`s = \sqrt{s^2}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`s`} />: standar deviasi sampel — "rata-rata tipikal penyimpangan dari mean", dalam satuan asli.</li>
        <li><Tex math={String.raw`\sqrt{\ }`} />: akar kuadrat — membatalkan kuadrat di variansi sehingga Rp² kembali menjadi Rp.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (lanjutan contoh variansi)</summary>
        <p>Variansi sampel tadi = 4 (juta Rp)².</p>
        <p><strong>Langkah 1</strong> — akarkan: <Tex math={String.raw`s = \sqrt{4} = 2`} />.<br />
        <strong>Langkah 2</strong> — kembalikan satuan: <strong>SD = Rp 2 juta</strong>.</p>
        <p>Interpretasi bisnis: "pendapatan debitur menyimpang rata-rata sekitar Rp 2 juta dari rata-ratanya." Jauh lebih bermakna dari "variansi 4 juta Rp kuadrat".</p>
      </details>

      <p><strong>Kepribadian SD:</strong> dia penerjemah setia variansi — semua ketelitian akuntan, tapi berbicara bahasa manusia (satuan asli). Ukuran sebaran default untuk data yang <em>relatif bersih dan simetris</em>. Kelemahannya diwarisi dari orang tuanya: karena dibangun dari kuadrat, dia ikut panik saat ada outlier.</p>
      <p><strong>Kapan memakai:</strong> data simetris tanpa outlier ekstrem; laporan ke manajemen; semua konteks "±" (aturan empiris, confidence interval).</p>

      <h3>Aturan Empiris (data mendekati normal)</h3>
      <ul>
        <li>±1 SD: ~68% data</li>
        <li>±2 SD: ~95% data</li>
        <li>±3 SD: ~99,7% data</li>
      </ul>

      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai, sumbu vertikal = proporsi data. Data ini mean = 75, SD ≈ 7. Bayangkan garis di 68 (= 75−7) dan 82 (= 75+7).</p>
        <PlotlyChart
          data={empiricalData}
          title="Aturan Empiris: Mayoritas Data di ±1 SD"
          layout={{ xaxis: { title: "Nilai" }, yaxis: { title: "Proporsi" }, showlegend: false }}
        />
        <p><strong>Interpretasi:</strong> sebagian besar batang menumpuk di 68–82 (±1 SD) — sesuai prediksi ~68%. Aturan ini <em>hanya</em> berlaku jika bentuk data mendekati normal/simetris. Kalau datamu miring (lihat A1.4), aturan ini runtuh — jangan dipaksakan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Aturan jempol range/4:</strong> untuk data yang kira-kira normal, <Tex math={String.raw`s \approx \text{range}/4`} />. Cek cepat: data nilai 40–100 (range 60) → SD ≈ 15. Kalau SD hitunganmu 35, curigai ada outlier atau salah rumus. <strong>Tes kewarasan kedua:</strong> kalau mean ± 2SD melewati batas mustahil (misal DPD negatif, atau probabilitas &gt; 100%), distribusimu miring — aturan empiris tidak berlaku.</p>
      </div>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "SD kecil = data bagus / risiko rendah."</p>
        <p><strong>Yang benar:</strong> SD kecil hanya berarti data <em>menumpuk rapat</em> — bisa menumpuk di tempat yang buruk (misal semua debitur DPD 89 hari: SD kecil, tapi semuanya hampir macet!). Selalu baca SD <em>bersama</em> mean/lokasinya. SD menjawab "seberapa menyebar", bukan "seberapa baik".</p>
      </div>

      <h2 id="iqr">4. IQR — Si Penjaga Tengah</h2>
      <p><strong>Definisi.</strong> Lebar "badan" data — selisih kuartil 3 dan kuartil 1, yaitu rentang yang memuat 50% data di tengah.</p>
      <Tex math={String.raw`IQR = Q_3 - Q_1`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`Q_1`} /> (kuartil 1): nilai yang memotong 25% data terbawah.</li>
        <li><Tex math={String.raw`Q_3`} /> (kuartil 3): nilai yang memotong 25% data teratas.</li>
        <li><Tex math={String.raw`Q_3 - Q_1`} />: 50% data tengah terbentang selebar ini — 25% terbawah dan 25% teratas (tempat outlier bersembunyi) <em>diabaikan total</em>.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (dengan outlier!)</summary>
        <p>Data: 1, 3, 5, 7, 9, 11, 13, 100.</p>
        <p><strong>Langkah 1</strong> — Q1 = median separuh bawah (1,3,5,7) = (3+5)/2 = <strong>4</strong>.<br />
        <strong>Langkah 2</strong> — Q3 = median separuh atas (9,11,13,100) = (11+13)/2 = <strong>12</strong>.<br />
        <strong>Langkah 3</strong> — IQR = 12 − 4 = <strong>8</strong>.</p>
        <p>Outlier 100 tidak menggerakkan IQR sama sekali — bandingkan dengan SD data ini (≈ 32!) yang hancur oleh satu angka. Inilah arti <strong>robust</strong>.</p>
      </details>

      <p><strong>Kepribadian IQR:</strong> dia penjaga gerbang tengah yang tenang — seperti median (lihat A1.2), dia hanya peduli urutan dan mengabaikan drama di ujung-ujung. Satu miliarder masuk ke data gaji? IQR tidak melirik.</p>
      <p><strong>Kapan memakai:</strong> data miring atau ber-outlier — gaji, DPD, loss kredit. Pasangan setianya median (median + IQR = ringkasan robust lengkap).</p>

      <h2 id="mad">5. MAD — Si Paling Kebal</h2>
      <p><strong>Definisi.</strong> Median dari jarak absolut tiap data ke median — "penyimpangan tipikal dari nilai tipikal".</p>
      <Tex math={String.raw`\text{MAD} = \text{median}(|x_i - \text{median}(x)|)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\text{median}(x)`} />: nilai tengah data — jangkar yang kebal outlier.</li>
        <li><Tex math={String.raw`|x_i - \text{median}(x)|`} />: jarak absolut tiap data ke median (tanda ± dihapus).</li>
        <li><Tex math={String.raw`\text{median}(\dots)`} /> terluar: ambil nilai <em>tengah</em> dari jarak-jarak itu — bukan rata-ratanya, agar satu jarak raksasa tidak mendominasi.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah</summary>
        <p>Data: 1, 3, 5, 7, 100. Median = 5.</p>
        <p><strong>Langkah 1</strong> — jarak absolut ke median: |1−5|=4, |3−5|=2, |5−5|=0, |7−5|=2, |100−5|=95 → [4, 2, 0, 2, 95].<br />
        <strong>Langkah 2</strong> — median dari [0, 2, 2, 4, 95] = <strong>2</strong>.</p>
        <p>MAD = 2 — "data tipikal menyimpang 2 dari median". Jarak raksasa 95 tenggelam tanpa jejak. SD data ini ≈ 42 — 21x lipat lebih panik dari MAD.</p>
      </details>

      <p><strong>Kepribadian MAD:</strong> dia IQR yang naik level — memakai median <em>dua kali</em> (jangkarnya median, ringkasannya median). <em>Breakdown point</em> 50%: separuh datamu boleh rusak total dan dia tetap waras. Standar emas deteksi outlier di sistem fraud.</p>
      <p><strong>Kapan memakai:</strong> deteksi anomali/fraud, data sangat kotor, kapan pun kamu tidak percaya pada data ujung.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "Kalau SD sudah dihitung, IQR/MAD tidak perlu."</p>
        <p><strong>Yang benar:</strong> justru <em>selisih</em> SD vs IQR/MAD adalah diagnostik. SD ≈ IQR/1,35 → data relatif bersih. SD jauh lebih besar dari IQR → ada outlier/skew yang sedang ditutupi SD. Analis senior selalu membandingkan keduanya — seperti memeriksa suhu dengan dua termometer berbeda.</p>
      </div>

      <h2 id="cv">6. CV — Si Pembanding Apel vs Jeruk</h2>
      <p><strong>Definisi.</strong> SD relatif terhadap mean, dalam persen — "volatilitas per unit nilai".</p>
      <Tex math={String.raw`CV = \frac{s}{\bar{x}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`s`} />: standar deviasi (sebaran absolut).</li>
        <li><Tex math={String.raw`\bar{x}`} />: rata-rata (skala/nilai).</li>
        <li><Tex math={String.raw`\frac{s}{\bar{x}}`} />: sebaran <em>dibagi</em> skala — menghilangkan pengaruh besar-kecilnya angka.</li>
        <li><Tex math={String.raw`\times 100\%`} />: jadikan persen agar mudah dibaca.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: dua saham</summary>
        <p>Saham A: mean Rp 10.000, SD Rp 1.000. Saham B: mean Rp 100.000, SD Rp 5.000.</p>
        <p><strong>Langkah 1</strong> — CV A = 1000/10000 × 100% = <strong>10%</strong>.<br />
        <strong>Langkah 2</strong> — CV B = 5000/100000 × 100% = <strong>5%</strong>.</p>
        <p>SD B lima kali A — tapi <em>relatif terhadap harganya</em>, A dua kali lebih volatil. Tanpa CV, kamu salah menyimpulkan.</p>
      </details>

      <p><strong>Kepribadian CV:</strong> dia penerjemah antar-bahasa — membuat volatilitas Rp 10 ribu dan Rp 100 ribu bisa dibandingkan apel-ke-apel. Syaratnya satu: mean tidak boleh nol atau negatif (pembagi runtuh).</p>
      <p><strong>Kapan memakai:</strong> membandingkan risiko/volatilitas antar aset, cabang, atau portofolio yang skalanya beda jauh.</p>

      <div className="myth">
        <p className="t">🚨 Miskonsepsi: "SD lebih besar = lebih berisiko. Titik."</p>
        <p><strong>Yang benar:</strong> SD absolut tanpa konteks skala menyesatkan. Portofolio Rp 10 M dengan SD Rp 100 jt (CV 1%) jauh lebih tenang dari portofolio Rp 500 jt dengan SD Rp 50 jt (CV 10%) — meski SD-nya "lebih kecil". <strong>Risiko yang dibandingkan harus relatif.</strong></p>
      </div>

      <h2 id="semidev">7. Semi-Deviation — Si Pesimis yang Realistis</h2>
      <p><strong>Definisi.</strong> Seperti SD, tapi hanya menghitung simpangan <em>di bawah</em> target — volatilitas ke atas bukan risiko.</p>
      <Tex math={String.raw`\text{Semidev} = \sqrt{\frac{1}{n}\sum_{x_i < T}(x_i - T)^2}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`T`} />: target (bisa mean, bisa target return / ambang NPL).</li>
        <li><Tex math={String.raw`x_i < T`} />: <strong>hanya</strong> data di bawah target yang dihitung — data di atas target dibuang.</li>
        <li>Sisanya identik dengan SD: kuadratkan simpangan, rata-ratakan, akarkan.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: return reksadana vs target 8%</summary>
        <p>Return 5 tahun: 12%, 15%, −4%, 10%, 6%. Target <Tex math={String.raw`T = 8\%`} />.</p>
        <p><strong>Langkah 1</strong> — ambil yang &lt; 8%: −4% dan 6%.<br />
        <strong>Langkah 2</strong> — simpangan kuadrat: (−4−8)² = 144, (6−8)² = 4.<br />
        <strong>Langkah 3</strong> — Semidev = √((144+4)/5) = √(29,6) ≈ <strong>5,44%</strong>.</p>
        <p>Tahun-tahun bagus (12%, 15%) tidak "mengurangi" risiko — benar secara intuisi investor: naik 20% bukan risiko.</p>
      </details>

      <p><strong>Kepribadian Semi-deviation:</strong> dia pesimis yang sehat — SD menghukum naik-turun sama rata, padahal tidak ada investor yang mengeluh portofolionya <em>naik terlalu konsisten</em>. Semi-deviation hanya mencatat sisi yang menyakitkan.</p>
      <p><strong>Kapan memakai:</strong> laporan risiko investasi, <em>downside risk</em>, Sortino ratio. <em>Jangan pakai:</em> saat upside volatility memang relevan (misal risiko operasional dua arah).</p>

      <div className="tip">
        <p><strong>💡 SD vs semi-dev bisa memberi ranking berbeda</strong> — dan itu informasi, bukan error. Dua reksadana bisa punya SD sama tapi semi-dev jauh beda (satu volatile karena sering melonjak, satunya volatile karena sering anjlok). Kalau rankingnya beda, tanyakan: "volatilitasnya datang dari sisi mana?" — jawaban itu sering lebih penting dari angkanya.</p>
      </div>

      <h2>Tabel Ringkasan</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th>Ukuran</th><th>Robust?</th><th>Satuan</th><th>Kapan Pakai</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Range</strong></td><td>❌</td><td>Asli</td><td>Cepat, kasar</td></tr>
            <tr><td><strong>Variansi</strong></td><td>❌</td><td>Kuadrat</td><td>Perhitungan teoretis</td></tr>
            <tr><td><strong>SD</strong></td><td>❌</td><td>Asli</td><td>Umum, data simetris</td></tr>
            <tr><td><strong>IQR</strong></td><td>✅</td><td>Asli</td><td>Data skewed, outlier</td></tr>
            <tr><td><strong>MAD</strong></td><td>✅✅</td><td>Asli</td><td>Sangat robust</td></tr>
            <tr><td><strong>CV</strong></td><td>❌</td><td>%</td><td>Bandingkan skala beda</td></tr>
            <tr><td><strong>Semi-dev</strong></td><td>❌</td><td>Asli</td><td>Downside risk</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="lab1">🔬 Lab 1: Geser Outlier, Lihat SD Meledak (IQR Diam)</h2>
      <p>
        Data DPD 10 debitur (hari): 5 angka normal + 1 yang akan kamu jadikan outlier.
        Naikkan outlier-nya bertahap, lalu perhatikan: SD dan range ikut panik — IQR dan MAD diam.
      </p>
      <PyodideLab
        title="Lab 1 — Robustness showdown: SD vs IQR vs MAD"
        hint="Coba outlier = 30 → 100 → 500. Pada titik berapa SD menjadi 2x IQR? Itulah ambang 'SD tidak lagi mewakili sebaran tipikal'."
        defaultCode={`import statistics as st

normal = [8, 10, 11, 9, 12, 10, 11, 9, 10]  # DPD tipikal (hari)
outlier = 100                                # <-- ubah: 30, 100, 500, 1000
data = normal + [outlier]

mean = st.mean(data)
sd = st.stdev(data)
rng = max(data) - min(data)
q1, _, q3 = st.quantiles(data, n=4)
iqr = q3 - q1
med = st.median(data)
mad = st.median([abs(x - med) for x in data])

print(f"data    = {data}")
print(f"mean    = {mean:.1f} hari")
print(f"SD      = {sd:.1f}  (meledak {sd/iqr:.1f}x IQR!)")
print(f"range   = {rng}")
print(f"IQR     = {iqr:.1f}  <- diam")
print(f"MAD     = {mad:.1f}  <- diam")
print()
print("Kesimpulan: satu data ekstrem menghancurkan SD & range,")
print("tapi IQR/MAD tetap melaporkan sebaran 9 debitur yang normal.")`}
      />

      <h2 id="lab2">🔬 Lab 2: Uji Aturan Empiris 68–95–99,7</h2>
      <p>
        Bangkitkan 2000 data dari distribusi normal (mean 75, SD 7), lalu verifikasi:
        benarkah ~68% jatuh dalam ±1 SD? Kemudian <em>rusak</em> datanya dengan 50 outlier —
        dan lihat aturannya runtuh.
      </p>
      <PyodideLab
        title="Lab 2 — Kapan aturan empiris berlaku (dan kapan runtuh)"
        hint="Ubah n_outlier = 0 → 50 → 200. Pada titik berapa '% dalam ±1 SD' menjauh dari 68%? Itulah harga asumsi normalitas pada data kotor."
        defaultCode={`import random, statistics as st
random.seed(42)

n_outlier = 0   # <-- ubah: 0, 50, 200
data = [random.gauss(75, 7) for _ in range(2000)]
data += [random.gauss(150, 5) for _ in range(n_outlier)]  # outlier jauh

mean, sd = st.mean(data), st.stdev(data)
for k in (1, 2, 3):
    pct = sum(1 for x in data if abs(x - mean) <= k * sd) / len(data) * 100
    print(f"dalam ±{k} SD : {pct:5.1f}%   (teori: {[68, 95, 99.7][k-1]}%)")

print()
print("mean ± 2SD =", f"{mean-2*sd:.1f} s/d {mean+2*sd:.1f}")
print("Catatan: dengan outlier banyak, 'batas bawah' bisa jadi mustahil,")
print("dan % dalam ±1SD meleset jauh dari 68% -> aturan empiris RUNTUH.")`}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Ukuran Sebaran Mana yang Jujur?</h2>

      <div className="decision-card">
        <h3>1. Data bersih &amp; simetris, untuk laporan umum → <strong>SD</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada outlier ekstrem, bentuk kira-kira simetris (cek histogram). Contoh: tinggi badan, nilai ujian normal.</p>
        <p><strong>Kenapa:</strong> memakai semua informasi, satu bahasa dengan teori statistik (aturan empiris, confidence interval).</p>
        <p><strong>Contoh nyata:</strong> "rata-rata DPD 12 hari, SD 4 hari" di dashboard operasional.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ada outlier / data miring → <strong>IQR (+ median)</strong></h3>
        <p><strong>Kondisi:</strong> SD jauh lebih besar dari IQR/1,35, atau histogram miring. Contoh: gaji, loss kredit, DPD.</p>
        <p><strong>Kenapa:</strong> robust — satu data ekstrem tidak menggerakkan. Pasangan median+IQR = ringkasan jujur data kotor.</p>
        <p><strong>Contoh nyata:</strong> "median loss Rp 2 jt, IQR Rp 1–5 jt" — bukan "mean loss Rp 8 jt, SD Rp 40 jt" yang didominasi 3 debitur raksasa.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data sangat kotor / deteksi anomali → <strong>MAD</strong></h3>
        <p><strong>Kondisi:</strong> kamu curiga &gt;10% data bermasalah, atau membangun aturan deteksi fraud otomatis.</p>
        <p><strong>Kenapa:</strong> breakdown point 50% — separuh data boleh rusak. Standar industri untuk <em>outlier detection</em>.</p>
        <p><strong>Contoh nyata:</strong> flag transaksi jika |x − median| &gt; 3 × MAD (aturan robust ala "3-sigma").</p>
      </div>

      <div className="decision-card">
        <h3>4. Bandingkan volatilitas beda skala → <strong>CV</strong></h3>
        <p><strong>Kondisi:</strong> dua aset/portofolio/cabang dengan nilai rata-rata jauh berbeda.</p>
        <p><strong>Kenapa:</strong> SD absolut menyesatkan antar-skala; CV menormalkan per unit nilai.</p>
        <p><strong>Contoh nyata:</strong> cabang mikro (mean kredit Rp 5 jt) vs cabang korporasi (mean Rp 5 M) — bandingkan CV NPL-nya, bukan SD rupiahnya.</p>
      </div>

      <div className="decision-card">
        <h3>5. Yang dipedulikan hanya sisi buruk → <strong>Semi-deviation</strong></h3>
        <p><strong>Kondisi:</strong> konteks investasi/risiko — upside volatility bukan masalah.</p>
        <p><strong>Kenapa:</strong> tidak menghukum kenaikan; mengukur murni <em>downside risk</em>.</p>
        <p><strong>Contoh nyata:</strong> memilih antara dua reksadana bervolatilitas sama — pilih yang semi-dev-nya kecil (jatuhnya jarang, naiknya sering).</p>
      </div>

      <div className="callout">
        <p><strong>🧭 Aturan praktis 10 detik</strong></p>
        <ol>
          <li><strong>Lihat histogram dulu.</strong> Simetris bersih → SD. Miring/kotor → IQR/MAD.</li>
          <li><strong>Bandingkan SD vs IQR/1,35.</strong> Jauh beda = ada yang disembunyikan SD.</li>
          <li><strong>Beda skala?</strong> → CV. Peduli downside saja? → semi-dev.</li>
          <li><strong>Selalu laporkan pemusatan + sebaran berpasangan:</strong> mean+SD, atau median+IQR. Satu tanpa yang lain = setengah cerita.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Dua Portofolio, Expected Loss Sama, Modal Beda Jauh</h2>
      <div className="callout">
        <p>Kamu analis risiko. Dua portofolio KUR, masing-masing 2.000 debitur. Kerugian tahunan (% dari outstanding) 5 tahun terakhir:</p>
        <ul>
          <li><strong>Portofolio P (ritel mikro):</strong> 1,8% – 2,1% – 2,0% – 1,9% – 2,2% → mean = <strong>2,0%</strong></li>
          <li><strong>Portofolio Q (korporasi kecil):</strong> 0,5% – 0,8% – 1,2% – 2,5% – 5,0% → mean = <strong>2,0%</strong></li>
        </ul>
        <p>Direktur bertanya: "Expected loss sama, jadi modal cadangannya sama, kan?"</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung SD dan IQR masing-masing — portofolio mana yang butuh modal lebih besar, dan berapa kali lipat risikonya? (b) Ukuran apa yang kamu tampilkan di slide direksi, dan mengapa bukan SD saja untuk Q?</p>
        <details>
          <summary>💡 Pembahasan</summary>
          <p>(a) <strong>P:</strong> SD ≈ 0,16%, IQR = 2,1 − 1,85 = 0,25%. <strong>Q:</strong> SD ≈ 1,85%, IQR = 3,75 − 0,65 = 3,1%. SD Q <strong>~12x</strong> SD P — dengan mean yang <em>identik</em>. Jawaban ke direktur: <strong>tidak, modalnya tidak sama.</strong> Q butuh buffer jauh lebih besar; tahun buruk Q (5%) menghabiskan 2,5 tahun expected loss sekaligus.</p>
          <p>(b) Di slide: untuk P, "mean 2,0% ± SD 0,16%" (data bersih → SD jujur). Untuk Q, tampilkan <strong>median 1,2% + IQR + skenario stres (tahun terburuk 5%)</strong> — SD Q (1,85%) masih "merapikan" cerita karena datanya miring kanan; satu angka SD menyembunyikan bahwa 3 dari 5 tahun Q sebenarnya di bawah 1,5%. Pelajaran: <strong>mean tanpa sebaran = setengah cerita; SD tanpa bentuk distribusi = seperempat cerita.</strong></p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <Quiz
        question="Dua reksadana: A (mean 10%, SD 2%), B (mean 10%, SD 8%). Mana lebih berisiko?"
        options={[
          "Sama, mean-nya sama",
          "B, karena sebarannya lebih lebar",
          "A, karena lebih stabil",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Mean sama tapi B punya SD 4x lipat — hasilnya jauh lebih tidak pasti. Inilah mengapa mean tanpa SD = setengah cerita."
      />

      <Quiz
        question="Data gaji ada outlier (direktur). Ukuran sebaran apa yang paling tepat?"
        options={[
          "Standar deviasi",
          "IQR atau MAD",
          "Range",
          "Variansi",
        ]}
        correct={1}
        explanation="IQR/MAD robust terhadap outlier. SD dan range akan meledak karena satu gaji direktur — buktikan sendiri di Lab 1."
      />

      <Quiz
        question="Saham X: harga Rp 50.000, SD Rp 5.000. Saham Y: harga Rp 500.000, SD Rp 25.000. Mana yang relatif lebih volatil?"
        options={[
          "Y — SD-nya 5x lebih besar",
          "X — CV 10% vs Y 5%",
          "Sama — keduanya naik",
          "Tidak bisa dibandingkan",
        ]}
        correct={1}
        explanation="CV X = 5000/50000 = 10%, CV Y = 25000/500000 = 5%. Relatif terhadap harga, X dua kali lebih volatil meski SD absolutnya lebih kecil."
      />

      <Quiz
        question="Mengapa dalam laporan risiko bank, SD (bukan variansi) yang ditampilkan ke manajemen?"
        options={[
          "SD lebih akurat dari variansi",
          "Variansi satuannya kuadrat (Rp²) — tidak bermakna bisnis; SD kembali ke satuan asli (Rp)",
          "Regulator melarang variansi",
          "SD lebih mudah dihitung",
        ]}
        correct={1}
        explanation="Variansi Rp 4 juta² tidak bisa diinterpretasi. SD Rp 2 juta langsung bermakna: 'rata-rata penyimpangan dari mean sekitar Rp 2 juta'."
      />

      <Quiz
        question="Dua reksadana punya SD sama (6%), tapi reksadana M sering anjlok dalam, reksadana N sering melonjak. Ukuran apa yang membedakan keduanya untuk investor?"
        options={[
          "Range — karena menangkap ekstrem",
          "Semi-deviation — M punya downside risk lebih besar meski SD sama",
          "CV — karena skalanya beda",
          "Tidak ada — SD sama berarti risiko sama",
        ]}
        correct={1}
        explanation="Tepat: SD menghukum naik dan turun sama rata, padahal investor hanya tersakiti oleh sisi bawah. Semi-deviation M >> N — itulah perbedaan yang relevan untuk keputusan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Range</strong> = intip ujung; cepat tapi rapuh. <em>Jangan pakai</em> sendirian untuk keputusan.</li>
          <li><strong>Variansi</strong> = fondasi teori, satuan kuadrat. <em>Jangan pakai</em> untuk komunikasi ke non-teknis.</li>
          <li><strong>SD</strong> = default untuk data bersih &amp; simetris. <em>Jangan pakai</em> saat ada outlier/skew berat — dia ikut panik.</li>
          <li><strong>IQR</strong> = robust untuk data kotor; pasangan median. <em>Jangan pakai</em> jika kamu butuh sensitivitas terhadap tiap data (dia sengaja mengabaikan ujung).</li>
          <li><strong>MAD</strong> = paling kebal (breakdown 50%); standar deteksi anomali. <em>Jangan pakai</em> saat teori downstream butuh variansi (banyak rumus memakai SD).</li>
          <li><strong>CV</strong> = bandingkan volatilitas beda skala. <em>Jangan pakai</em> jika mean ≈ 0/negatif.</li>
          <li><strong>Semi-deviation</strong> = downside risk; untuk investor. <em>Jangan pakai</em> saat upside volatility memang relevan.</li>
          <li><strong>Diagnostik senior:</strong> SD vs IQR/1,35 — jauh beda berarti ada outlier/skew yang disembunyikan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/a14-skewness-kurtosis" className="btn btn-primary btn-sm">Next: A1.4 →</Link>
      </div>
    </div>
  );
}
