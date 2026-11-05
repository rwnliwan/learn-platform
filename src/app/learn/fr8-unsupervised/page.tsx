"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR8Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const methodData = [
    {
      x: ["Isolation Forest", "LOF", "One-Class SVM", "Autoencoder", "Rule pakar"],
      y: [0.83, 0.76, 0.71, 0.86, 0.79],
      type: "bar",
      marker: { color: "#b06fc9" },
      text: ["0,83", "0,76", "0,71", "0,86", "0,79"],
      textposition: "outside",
    },
  ];

  const contamData = [
    {
      x: ["0,1%", "0,5%", "1%", "2%", "5%", "10%"],
      y: [28, 52, 66, 74, 70, 58],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["28%", "52%", "66%", "74%", "70%", "58%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Isolation Forest INTI: anomali = mudah diisolasi (sedikit split)
# Simulasi 1D: 200 normal (sekitar 0), 5 anomali (jauh). Hitung 'kedalaman isolasi'.
import random
random.seed(3)

normal = [random.gauss(0, 1) for _ in range(200)]
anomali = [8.5, -7.2, 9.1, -8.8, 7.9]
semua = [(x, "normal") for x in normal] + [(x, "ANOMALI") for x in anomali]

def kedalaman_isolasi(x, data, depth=0):
    # split acak: pilih titik tengah rentang; ulangi sampai x terisolasi
    if len(data) <= 1 or depth > 20:
        return depth
    lo, hi = min(d for d, _ in data), max(d for d, _ in data)
    if hi == lo:
        return depth
    split = random.uniform(lo, hi)
    sisa = [(d, l) for d, l in data if (d <= split) == (x <= split)]
    return kedalaman_isolasi(x, sisa, depth + 1)

print("Anomali (harusnya kedalaman KECIL = mudah diisolasi):")
for x in anomali:
    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10
    print(f"  x={x:+5.1f}  kedalaman rata-rata={d:4.1f}")
print("Normal (harusnya kedalaman BESAR):")
for x in [0.1, -0.5, 0.8]:
    d = sum(kedalaman_isolasi(x, semua) for _ in range(10)) / 10
    print(f"  x={x:+5.1f}  kedalaman rata-rata={d:4.1f}")
print()
print("COBA UBAH: anomali 8.5 -> 2.5 (dekat normal).")
print("Kedalamannya membesar = makin sulit dibedakan. Itulah batas IF:") 
print("anomali yang 'mirip normal' tidak tertangkap.")`;

  const lab2Code = `# Autoencoder INTI: latih 'meniru' normal; anomali = gagal ditiru
# Model super-sederhana: prediksi = mean (kompresi ekstrem). Error = |x - mean|.
import random, statistics as st
random.seed(8)

# Latih HANYA pada data normal (semi-supervised!)
train_normal = [random.gauss(100, 10) for _ in range(500)]  # nominal normal (rb Rp)
mu = st.mean(train_normal)

def reconstruction_error(x):
    return abs(x - mu)

uji = [95, 105, 110, 90, 500, 20, 1000, 98]  # 500, 20, 1000 = anomali?
ambang = 40
for x in uji:
    err = reconstruction_error(x)
    status = "🚨 ANOMALI" if err > ambang else "✅ normal"
    print(f"nominal={x:4d}  error={err:6.1f}  {status}")
print()
print("COBA UBAH: train_normal campur 50 anomali (latih pada data KOTOR).")
print("mu bergeser, error anomali mengecil = 'buta'. Pelajaran PENTING:")
print("autoencoder HARUS dilatih pada data yang (cukup) bersih.")
print("Latih pada data kotor = mengajari model bahwa anomali itu normal.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR8 — Fraud / ML Analytics</span>
        <h1 className="display-title">Unsupervised: Menangkap Penipu<br />yang Belum Punya Nama</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Serangan yang Tak Ada di Buku</a></li>
          <li><a href="#kapan">Kapan Unsupervised: 4 Situasi</a></li>
          <li><a href="#iforest">Isolation Forest: Anomali = Mudah Diisolasi</a></li>
          <li><a href="#lof">LOF: Anomali = Tetangga yang Jauh</a></li>
          <li><a href="#autoenc">Autoencoder: Gagal Meniru = Tertangkap</a></li>
          <li><a href="#lab1">🔬 Lab 1: Inti Isolation Forest</a></li>
          <li><a href="#lab2">🔬 Lab 2: Inti Autoencoder</a></li>
          <li><a href="#worked">📐 Worked Example: Isolation Forest &amp; Contamination</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Mendefinisikan &ldquo;Normal&rdquo; itu Mahal</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Metode Apa, Kapan</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Tanpa Label?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Toko Fiktif &amp; Settlement Aneh</a></li>

          <li><a href="#case">📋 Mini-Case: Produk Baru, Nol Label, 30 Hari</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Unsupervised</a></li>

          <li><a href="#latihan">Latihan Mandiri: Berpikir Tanpa Label</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>kapan unsupervised tepat</strong> (vs supervised) dalam 4 situasi konkret.</li>
          <li>Menjelaskan ide inti <strong>Isolation Forest</strong> (isolasi cepat = anomali) dan parameter contamination.</li>
          <li>Menjelaskan ide inti <strong>LOF</strong> (densitas lokal) dan kapan ia mengalahkan Isolation Forest.</li>
          <li>Menjelaskan ide inti <strong>autoencoder</strong> (reconstruction error) dan syarat data latihnya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Serangan yang Tak Ada di Buku</h2>
      <div className="story">
        <p>Januari 2026, e-wallet &ldquo;DanaKita&rdquo; meluncurkan fitur &ldquo;Patungan Online&rdquo;. Tiga minggu kemudian, Rp340 juta hilang lewat pola yang <strong>belum pernah ada</strong>: 300 akun membuat 1.500 &ldquo;patungan&rdquo; fiktif Rp200–300 ribu, mengundang akun-akun boneka sebagai peserta, lalu menarik dananya sebelum &ldquo;acara&rdquo; tiba.</p>
        <p>Model supervised mereka — yang hebat menangkap carding dan ATO — <strong>skornya 0,12</strong> untuk semua transaksi ini. &ldquo;Normal,&rdquo; katanya. Tentu saja: ia tidak pernah <em>dilatih</em> melihat pola ini. Label untuk serangan baru butuh 3 bulan matang (FR4). Selama 3 bulan itu, siapa yang menjaga?</p>
        <p>Twist-nya: yang akhirnya menangkap adalah <strong>Isolation Forest 20 baris</strong> yang dipasang &ldquo;sementara&rdquo; saat peluncuran — &ldquo;sementara&rdquo; yang ternyata menemukan anomali &ldquo;300 akun dengan pola patungan identik&rdquo; di minggu ke-2. Lesson ini: <strong>supervised menjaga dari musuh yang dikenal; unsupervised menjaga dari musuh yang belum punya nama</strong>. Keduanya dibutuhkan.</p>
      </div>

      <h2 id="kapan">Kapan Unsupervised: 4 Situasi</h2>
      <ol>
        <li><strong>Produk/fitur baru, nol label</strong> (kasus DanaKita) — supervised tidak bisa jalan tanpa label (FR4).</li>
        <li><strong>Serangan baru (zero-day fraud)</strong> — pola belum ada di training data; supervised buta.</li>
        <li><strong>Eksplorasi:</strong> &ldquo;ada apa di data kami yang belum kami ketahui?&rdquo; — clustering anomali menemukan pola untuk dijadikan rule baru (umpan balik ke FR5!).</li>
        <li><strong>Pelapis (ensemble):</strong> skor anomali sebagai <em>fitur</em> untuk model supervised — &ldquo;seberapa aneh transaksi ini menurut IF?&rdquo; adalah fitur yang kuat.</li>
      </ol>
      <p><strong>Batas jujurnya:</strong> unsupervised tidak tahu apa itu &ldquo;fraud&rdquo; — ia hanya tahu &ldquo;aneh&rdquo;. Transaksi aneh-tapi-legit (mahar pernikahan Rp50 juta sekali seumur hidup) ikut ketangkap. <strong>Unsupervised = mesin kandidat, bukan mesin vonis.</strong> Vonis tetap butuh investigator atau label.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> supervised bertanya <em>&ldquo;apakah ini seperti fraud yang pernah kulihat?&rdquo;</em>; unsupervised bertanya <em>&ldquo;apakah ini seperti apapun yang pernah kulihat?&rdquo;</em> Pertanyaan kedua lebih lemah tapi <strong>tidak butuh masa lalu</strong> — itulah nilainya saat masa lalu belum ada.</p>
      </div>

      <h2 id="iforest">Isolation Forest: Anomali = Mudah Diisolasi</h2>
      <p><strong>Ide inti</strong> (satu kalimat): bangun pohon dengan <strong>split acak</strong>; titik yang terisolasi dalam <em>sedikit</em> split = anomali, karena ia &ldquo;berdiri sendiri&rdquo; jauh dari kerumunan.</p>
      <p><strong>Analoginya:</strong> di kelas 200 murid yang seragam, &ldquo;siswa yang memakai topi merah&rdquo; teridentifikasi dalam 1 pertanyaan (&ldquo;siapa yang pakai topi merah?&rdquo;). Siswa normal butuh banyak pertanyaan bertingkat. <strong>Anomali = mudah dideskripsikan sebagai &ldquo;yang beda&rdquo;</strong>.</p>
      <p>Skor anomali formal:</p>
      <Tex math={String.raw`s(x) = 2^{-\frac{E[h(x)]}{c(n)}}`} block />
      <ul>
        <li><Tex math={String.raw`h(x)`} />: kedalaman (jumlah split) untuk mengisolasi <Tex math={String.raw`x`} /> — kecil = anomali.</li>
        <li><Tex math={String.raw`E[h(x)]`} />: rata-rata kedalaman di banyak pohon acak.</li>
        <li><Tex math={String.raw`c(n)`} />: kedalaman rata-rata pohon BST dengan <Tex math={String.raw`n`} /> titik (normalisasi).</li>
        <li><strong>Interpretasi:</strong> <Tex math={String.raw`s \to 1`} /> = anomali jelas; <Tex math={String.raw`s \approx 0{,}5`} /> = normal; <Tex math={String.raw`s < 0{,}5`} /> = sangat normal.</li>
      </ul>
      <p><strong>Parameter terpenting: contamination</strong> = perkiraan % anomali di data (mis. 0,01 untuk 1%). Ini menentukan ambang: &ldquo;anggap 1% skor tertinggi sebagai anomali.&rdquo; <strong>Salah tebak contamination = salah ambang total.</strong></p>

      <PlotlyChart
        data={contamData}
        title="Dampak Salah Tebak Contamination (detection rate anomali sintetis)"
        layout={{ xaxis: { title: "Contamination yang di-set" }, yaxis: { title: "Detection rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = nilai contamination yang kita set (anomali sejati = 2%), tinggi batang = detection rate.</p>
        <p><strong>Interpretasi:</strong> set 0,1% → hanya tangkap 28% (terlalu sempit). Set 10% → 58% tapi banjir false positive (tidak terlihat di chart!). <strong>Set 2% (tebakan benar) → 74%, terbaik.</strong> Pelajaran: contamination bukan hyperparameter untuk di-grid-search buta — ia adalah <strong>asumsi bisnis</strong> (&ldquo;menurutmu berapa % transaksi aneh?&rdquo;) yang harus dijustifikasi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Isolation Forest tidak butuh parameter — unsupervised = bebas tuning.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> contamination adalah parameter yang <strong>menentukan segalanya</strong> dan tidak bisa dipelajari dari data (tidak ada label!). &ldquo;Unsupervised&rdquo; bukan berarti &ldquo;tanpa asumsi&rdquo; — asumsinya hanya disembunyikan di parameter.</p>
      </div>

      <h2 id="lof">LOF: Anomali = Tetangga yang Jauh</h2>
      <p><strong>Ide inti:</strong> LOF (Local Outlier Factor) membandingkan <strong>kepadatan lokal</strong> suatu titik dengan kepadatan tetangganya. Titik di daerah jarang yang dikelilingi daerah padat = anomali.</p>
      <p><strong>Kapan LOF mengalahkan Isolation Forest:</strong> data dengan <strong>multi-densitas</strong> — mis. transaksi ritel (padat, kecil-kecil) vs transaksi korporat (jarang, besar-besar). IF dengan satu ambang global akan menandai <em>semua</em> transaksi korporat sebagai anomali. LOF menilai &ldquo;aneh <em>dibanding tetangganya</em>&rdquo; — transaksi korporat Rp1 M normal di antara sesama korporat.</p>
      <p><strong>Harga yang dibayar:</strong> LOF butuh hitung jarak ke tetangga = <strong>mahal</strong> (O(n²) naif) dan sensitif terhadap pilihan <Tex math={String.raw`k`} /> (jumlah tetangga). Untuk real-time scoring jutaan transaksi, IF jauh lebih murah.</p>

      <h2 id="autoenc">Autoencoder: Gagal Meniru = Tertangkap</h2>
      <p><strong>Ide inti</strong> (tiga langkah):</p>
      <ol>
        <li><strong>Latih</strong> neural network untuk <em>meniru</em> inputnya (kompres → rekonstruksi) <strong>hanya pada data normal</strong>.</li>
        <li><strong>Ukur</strong> reconstruction error: <Tex math={String.raw`e(x) = \|x - \hat{x}\|^2`} />.</li>
        <li><strong>Tandai</strong> anomali jika <Tex math={String.raw`e(x)`} /> &gt; ambang — model &ldquo;tidak bisa meniru&rdquo; apa yang tidak pernah dipelajarinya.</li>
      </ol>
      <p><strong>Analoginya:</strong> pemalsu uang yang hanya pernah melihat Rp100 ribu asli. Disodori Rp100 ribu palsu yang bagus — ia menirunya dengan baik (lolos!). Disodori uang Monopoli — ia gagal total (tertangkap). Autoencoder hanya pandai meniru yang <em>pernah dilihatnya</em>.</p>
      <p><strong>Syarat mati-hidup:</strong> data latih harus <strong>(cukup) bersih</strong>. Latih pada data kotor (campur fraud) = mengajari model meniru fraud = buta (lihat Lab 2). <strong>Kapan mengalahkan IF:</strong> pola anomali <strong>kompleks &amp; non-linear</strong> (interaksi 20 fitur) yang tidak tertangkap split acak sederhana.</p>

      <PlotlyChart
        data={methodData}
        title="Perbandingan Metode Unsupervised (AUC, ilustrasi — dataset fraud tabular)"
        layout={{ xaxis: { title: "Metode" }, yaxis: { title: "AUC", range: [0.6, 1.0] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = AUC satu metode unsupervised pada dataset fraud tabular tipikal.</p>
        <p><strong>Interpretasi:</strong> tidak ada yang dominan mutlak — autoencoder (0,86) dan IF (0,83) berkejaran, rule pakar (0,79) tidak jauh tertinggal! <strong>Pelajaran:</strong> untuk unsupervised, <strong>pemahaman domain (rule pakar) ≈ algoritma canggih</strong>. Dan semuanya kalah dari supervised berlabel matang (0,93+) — unsupervised adalah <em>jembatan</em>, bukan tujuan akhir.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Unsupervised bisa menggantikan supervised — tidak butuh label sama sekali.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> unsupervised tidak mengenal &ldquo;fraud&rdquo; — hanya &ldquo;aneh&rdquo;. Tanpa label, kamu tidak bisa mengukur precision/recall, tidak bisa tuning threshold secara prinsipil, dan tidak bisa membedakan &ldquo;aneh jahat&rdquo; dari &ldquo;aneh wajar&rdquo;. Peran tepatnya: <strong>deteksi dini + eksplorasi + fitur untuk supervised</strong>.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Inti Isolation Forest</h2>
      <p>Bangun intuisi &ldquo;anomali = mudah diisolasi&rdquo; dengan tangan sendiri.</p>
      <PyodideLab
        title="Lab 1 — Kedalaman Isolasi: Anomali vs Normal"
        hint="Ubah anomali 8.5 → 2.5 (mendekati normal). Pada titik berapa ia tidak lagi 'mudah diisolasi'? Itulah batas deteksi IF."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Inti Autoencoder</h2>
      <PyodideLab
        title="Lab 2 — Reconstruction Error & Data Kotor"
        hint="Campurkan anomali ke data latih. Lihat error anomali menyusut — buktikan bahwa 'latih pada data bersih' bukan saran, tapi syarat."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Berpikir Seperti Isolation Forest</h2>
      <p>Unsupervised tidak &ldquo;belajar fraud&rdquo; — ia belajar <em>apa itu normal</em>, lalu menunjuk yang tidak normal. Dua contoh cara memakainya dengan benar.</p>

      <details className="worked">
        <summary>📐 Contoh 1: intuisi path length — kenapa anomali &ldquo;terisolasi&rdquo; lebih cepat</summary>
        <p>Bayangkan 100 titik transaksi di ruang 2D (sumbu: nominal, velocity). Isolation Forest memotong ruang secara acak berulang-ulang sampai tiap titik sendirian di kotaknya. Jumlah potongan = <em>path length</em>.</p>
        <p><strong>Titik normal</strong> (nominal Rp200rb, velocity 2/hari): bergerombol dengan 90 titik lain — butuh <strong>±12 potongan</strong> untuk mengisolasinya. <strong>Titik anomali</strong> (nominal Rp45jt, velocity 40/jam): sendirian di sudut ruang — cukup <strong>±4 potongan</strong>.</p>
        <p><strong>Skor anomali</strong> = fungsi dari path length relatif terhadap rata-rata: makin pendek path, makin anomali. Rumus intuisinya:</p>
        <Tex math={String.raw`s(x) = 2^{-\frac{E[h(x)]}{c(n)}}`} block />
        <p><Tex math={String.raw`E[h(x)]`} /> = rata-rata path length titik x, <Tex math={String.raw`c(n)`} /> = path rata-rata normal untuk n titik. Jika s(x) mendekati 1 → anomali; mendekati 0,5 → normal. Angka ini artinya: <strong>seberapa &ldquo;murah&rdquo; mengisolasi titik ini dibanding titik biasa</strong> — anomali itu murah diisolasi karena ia memang tidak punya teman.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih contamination — parameter yang paling sering salah</summary>
        <p><em>Contamination</em> = tebakanmu: berapa % data yang anomali. Model akan mem-flag tepat sebesar itu. Salah tebak = salah hasil, seakurat apa pun algoritmanya.</p>
        <p><strong>Kasus:</strong> 200.000 transaksi merchant, kamu set contamination = 5% → 10.000 flag. Investigasi sampel 500 flag: hanya 60 fraud (precision 12%). Tim protes.</p>
        <p><strong>Langkah 1 — estimasi base rate riil.</strong> Dari audit historis (FR4), fraud aktual ±0,8%. Anomali &ldquo;menarik&rdquo; (termasuk error sistem &amp; perilaku unik legit) mungkin 2–3× lipatnya.</p>
        <p><strong>Langkah 2 — set ulang.</strong> contamination = 2% → 4.000 flag. Precision naik ke 21% (840 fraud tertangkap dari sampel yang sama proporsinya) — <em>dan</em> beban review turun 60%.</p>
        <p><strong>Langkah 3 — validasi dengan injeksi.</strong> Selipkan 200 kasus fraud <em>diketahui</em> ke data, jalankan model: berapa yang tertangkap di 2%? Jika &lt; 70%, contamination terlalu kecil atau fitur kurang. Ini <strong>kalibrasi unsupervised dengan supervised spot-check</strong> — praktik yang membedakan pemakaian serius vs asal jalan.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Mendefinisikan &ldquo;Normal&rdquo; itu Mahal</h2>
      <p>Supervised bertanya &ldquo;mana yang jahat?&rdquo; — unsupervised bertanya <strong>&ldquo;mana yang biasa?&rdquo;</strong> Dan ternyata, mendefinisikan &ldquo;biasa&rdquo; jauh lebih sulit dari kelihatannya: perilaku 10 juta nasabah = 10 juta definisi normal yang berbeda, berubah tiap musim, tiap promo, tiap gajian. Unsupervised yang baik bukan yang pintar matematika — tapi yang <strong>memodelkan normalitas secara personal &amp; kontekstual</strong>.</p>
      <p>Intuisi kedua: <strong>unsupervised adalah mesin hipotesis, bukan mesin vonis</strong>. Output-nya bukan &ldquo;ini fraud&rdquo; melainkan &ldquo;ini <em>layak dilihat manusia</em>&rdquo;. Organisasi yang memakai skor anomali untuk auto-block akan menghukum sultan, turis, dan siapa pun yang hidupnya tidak rata-rata. Organisasi yang memakainya untuk <em>triage</em> menemukan sindikat yang tidak dicari siapa pun. <strong>Posisikan sebagai radar, bukan peluru.</strong></p>
      <p><strong>Kapan unsupervised TIDAK boleh dipakai:</strong> (1) <strong>ada label cukup</strong> (&gt; 1.000 positif) — supervised hampir selalu menang; (2) <strong>data &ldquo;normal&rdquo;-nya sendiri kotor</strong> (banyak fraud tak terdeteksi di training) — model belajar bahwa fraud = normal; (3) <strong>untuk keputusan yang butuh penjelasan hukum</strong> — &ldquo;anomali&rdquo; bukan alasan yang bisa dipertahankan di pengadilan; (4) <strong>tanpa kapasitas review</strong> — 10.000 anomali tanpa investigator = 10.000 baris yang tidak dibaca siapa pun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> nilai unsupervised terbesar bukan di <em>skornya</em> — tapi di <strong>eksplorasinya</strong>. Analis yang rutin menjalankan clustering atas data baru menemukan pola yang tidak ada di hipotesis siapa pun. Jadwalkan &ldquo;jam eksplorasi&rdquo; mingguan: tanpa target, tanpa KPI — hanya <em>melihat</em>. Banyak temuan terbesar lahir dari sini.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Metode Apa, Kapan</h2>

      <div className="decision-card">
        <h3>1. Butuh cepat, murah, real-time → <strong>Isolation Forest</strong></h3>
        <p><strong>Kondisi:</strong> jutaan transaksi/hari, butuh skor dalam milidetik.</p>
        <p><strong>Kenapa:</strong> training cepat, scoring O(log n), sedikit parameter. Set contamination dari asumsi bisnis.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;penjaga sementara&rdquo; DanaKita saat peluncuran fitur baru.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data multi-densitas (ritel vs korporat) → <strong>LOF</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;normal&rdquo; punya beberapa kepadatan berbeda; ambang global salah sasaran.</p>
        <p><strong>Kenapa:</strong> menilai aneh <em>relatif terhadap tetangga</em>, bukan absolut.</p>
        <p><strong>Catatan:</strong> mahal komputasi — untuk batch/offline, bukan real-time.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pola kompleks, data latih bersih tersedia → <strong>Autoencoder</strong></h3>
        <p><strong>Kondisi:</strong> anomali melibatkan interaksi banyak fitur; punya sampel &ldquo;normal&rdquo; tepercaya.</p>
        <p><strong>Kenapa:</strong> menangkap non-linearitas yang lolos dari split acak IF.</p>
        <p><strong>Syarat:</strong> latih pada data bersih; monitor reconstruction error threshold.</p>
      </div>

      <div className="decision-card">
        <h3>4. Sudah ada label matang → <strong>supervised (kembali ke FR7)</strong></h3>
        <p><strong>Kondisi:</strong> label cukup &amp; matang, pola stabil.</p>
        <p><strong>Kenapa:</strong> supervised selalu menang jika label tersedia — unsupervised turun jadi <em>fitur pelapis</em> (&ldquo;skor IF&rdquo; sebagai input GBM).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Unsupervised = <strong>mesin kandidat</strong>, bukan mesin vonis.</li>
          <li>Contamination = asumsi bisnis, bukan hyperparameter buta.</li>
          <li>Autoencoder wajib latih pada data <strong>bersih</strong>.</li>
          <li>Hasil unsupervised terbaik = <strong>rule baru</strong> (umpan ke FR5) atau <strong>fitur baru</strong> (umpan ke FR7).</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Memilih Metode Tanpa Label</h2>
      <p>Tiga skenario di mana unsupervised adalah jawaban — dan satu di mana ia bukan:</p>
      <p><strong>Skenario A — serangan baru tanpa contoh (cold start).</strong> Modus refund fiktif muncul minggu ini, nol label. Isolation Forest di atas fitur velocity + amount langsung bisa dipakai <em>hari ini</em> untuk triage — supervised butuh 200+ label (FR4: butuh berminggu-minggu). Aturan: <strong>unsupervised untuk minggu pertama, supervised untuk bulan berikutnya</strong>.</p>
      <p><strong>Skenario B — Isolation Forest vs Autoencoder.</strong> Data tabular murni (angka-angka fitur) → Isolation Forest: cepat, stabil, mudah dijelaskan. Data kompleks berdimensi tinggi (urutan event, embedding teks) → Autoencoder: reconstruction error sebagai skor anomali. Jangan pakai autoencoder untuk data tabular sederhana — seperti memakai truk kontainer untuk belanja sayur.</p>
      <p><strong>Skenario C — clustering untuk triage, bukan vonis.</strong> 10.000 anomali dari Isolation Forest terlalu banyak di-review. Cluster menjadi 20 grup → investigator memeriksa <em>perwakilan tiap cluster</em>. Sering ditemukan: 3 cluster = pola fraud jelas (blokir massal), 12 cluster = perilaku unik tapi legit (whitelist), 5 cluster = abu-abu. Clustering mengubah 10.000 keputusan menjadi <strong>20 keputusan</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>anomali ≠ fraud</strong> — anomali = &ldquo;tidak biasa&rdquo;, fraud = &ldquo;jahat&rdquo;. Sultan yang belanja Rp500jt/tahun adalah anomali statistik tapi pelanggan terbaikmu. Unsupervised menemukan yang <em>aneh</em>; investigator (dan label) menentukan yang <em>jahat</em>. Jangan pernah auto-block dari skor unsupervised murni.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Merchant Fiktif Ketahuan dari Pola Settlement</h2>
      <p>Modus yang merugikan agregator pembayaran lokal: &ldquo;merchant&rdquo; fiktif mendaftarkan toko online abal-abal, lalu menggesek kartu-kartu curian di tokonya sendiri — dana settlement mengalir ke rekeningnya sebagai &ldquo;hasil penjualan&rdquo; yang sah. Tidak ada label fraud di awal: kartu-kartunya baru dilaporkan hilang berminggu-minggu kemudian.</p>
      <p><strong>Yang ditemukan clustering + Isolation Forest</strong> (pola umum dari temuan sejenis):</p>
      <ol>
        <li><strong>Settlement velocity ekstrem:</strong> merchant umur 12 hari dengan settlement Rp380jt — vs median merchant seumur Rp4jt (95× lipat).</li>
        <li><strong>Ticket size seragam:</strong> 95% transaksi tepat Rp1.850.000 — toko asli punya variasi nominal.</li>
        <li><strong>Jam transaksi:</strong> 80% terjadi 01.00–04.00 — toko &ldquo;online&rdquo; yang ramainya jam 2 pagi.</li>
        <li><strong>Refund rate 0%:</strong> toko dengan ratusan transaksi tanpa satu pun refund/komplain = tidak ada pelanggan sungguhan.</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> 35 merchant fiktif × Rp380jt = <strong>Rp13,3 miliar</strong> settlement fraud dalam 1 kuartal — semuanya lolos dari rule &amp; model supervised karena <em>tidak ada label</em> saat itu. Ditemukan justru oleh analis yang menjalankan clustering rutin tiap minggu atas merchant baru.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Unsupervised learning sudah ketinggalan zaman sejak ada deep learning.&rdquo;<br /><strong>Yang benar:</strong> untuk <em>cold-start detection</em> dan <em>eksplorasi</em>, Isolation Forest 2008 masih mengalahkan banyak model modern — karena masalahnya bukan kecanggihan algoritma, tapi <strong>ketiadaan label</strong>. Pilih senjata sesuai medan, bukan sesuai tahun publikasi paper-nya.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Produk Baru, Nol Label, 30 Hari</h2>
      <div className="callout">
        <p>Kamu Head of Fraud di bank yang meluncurkan <strong>transfer BI-FAST ke e-wallet</strong> minggu depan. Nol histori, nol label. Direksi bertanya: &ldquo;Bagaimana kita tidak kebobolan seperti DanaKita?&rdquo; Kamu punya 30 hari sebelum peluncuran untuk menyiapkan pertahanan.</p>
        <p><strong>Pertanyaan:</strong> rancang rencana 30 hari: apa yang dipasang hari H-30, H-7, H+1, H+30? (Spesifik: metode apa, peran apa.)</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>H-30:</strong> rule pakar dari produk sejenis (velocity, nominal, device baru) — ditulis dari pengalaman investigator, bukan data. <strong>H-7:</strong> Isolation Forest dilatih pada transaksi <em>normal</em> produk sejenis terdekat (transfer antarbank) sebagai &ldquo;penjaga sementara&rdquo; + definisi contamination awal (asumsi 0,5%).</p>
          <p><strong>H+1 (peluncuran):</strong> semua rule + IF jalan dalam mode <em>monitor + hold selektif</em>; investigator siaga dengan guideline &ldquo;kasus baru&rdquo;. <strong>H+7 s.d. H+30:</strong> tiap anomali IF yang terkonfirmasi investigator → jadi <strong>rule baru</strong> (FR5) atau <strong>label pertama</strong> untuk supervised mini.</p>
          <p><strong>Pelajaran:</strong> pertahanan produk baru = <strong>tangga</strong>: rule (hari 1) → unsupervised (minggu 1) → label terkumpul → supervised (bulan 3+). Tidak ada lompatan.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Unsupervised</h2>
      <details className="worked">
        <summary>Q1: Apa bedanya outlier, anomali, dan fraud?</summary>
        <p><strong>Outlier</strong> = titik jauh secara statistik (bisa karena salah input data). <strong>Anomali</strong> = pola tidak biasa yang <em>menarik</em> (butuh konteks untuk menilai). <strong>Fraud</strong> = anomali yang <em>terbukti jahat</em> (butuh investigasi). Hubungannya: semua fraud (hampir) adalah anomali, tapi <strong>sebagian besar anomali bukan fraud</strong> — melainkan sultan, error sistem, atau perilaku unik yang sah. Jangan pernah menyamakan ketiganya dalam SOP.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana memilih contamination jika tidak tahu base rate?</summary>
        <p><strong>Estimasi dulu, jangan tebak.</strong> Cara: (1) audit sampel acak (FR4) untuk estimasi kasar; (2) mulai dari 1–2% dan <em>kalibrasi dengan injeksi</em> (selipkan kasus diketahui, ukur recall — worked example 2); (3) sesuaikan dengan <em>kapasitas review</em>: contamination × volume ≤ kapasitas. Contamination bukan parameter magis — ia <strong>anggaran alarm</strong> yang harus dipertanggungjawabkan.</p>
      </details>
      <details className="worked">
        <summary>Q3: Kapan butuh autoencoder / deep learning untuk anomali?</summary>
        <p>Untuk <strong>data kompleks berdimensi tinggi</strong>: urutan event, embedding teks/gambar, sinyal sensor. Untuk data tabular fraud biasa: <strong>Isolation Forest cukup</strong> — lebih cepat 100×, lebih stabil, lebih mudah dijelaskan. Aturan: <em>naik ke deep hanya jika yang sederhana terbukti mentok</em> — bukan karena paper-nya baru.</p>
      </details>
      <details className="worked">
        <summary>Q4: False positive unsupervised tinggi sekali — normal?</summary>
        <p><strong>Ya, dan itu by design.</strong> Unsupervised mengorbankan presisi demi <em>cakupan</em> — tugasnya memastikan tidak ada yang terlewat, bukan memastikan semua yang ditangkap bersalah. Solusinya bukan &ldquo;menaikkan akurasi&rdquo; (tidak ada label untuk diukur!) melainkan <strong>lapisan triage</strong>: clustering (FR8 peta lanjutan), scoring gabungan dengan rule, dan prioritas by expected value. Terima sifatnya, rancang alirannya.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Berpikir Tanpa Label</h2>
      <p>Tiga latihan untuk menguji pemahamanmu. Kerjakan dulu, baru buka kunci jawaban.</p>
      <p><strong>1.</strong> Dari 50 titik data, satu titik terisolasi dalam 3 potongan, rata-rata titik lain 11 potongan. Perkirakan skor anomalinya (mendekati 1, 0,5, atau 0?) dan jelaskan artinya.</p>
      <p><strong>2.</strong> Kamu memonitor 80.000 transaksi/hari dengan kapasitas review 1.600/hari. Contamination berapa yang operasional? Jika audit menunjukkan base rate fraud 0,5%, apakah contamination itu cukup?</p>
      <p><strong>3.</strong> Sebutkan satu skenario di mana kamu <em>menolak</em> memakai unsupervised meski tidak ada label — dan apa alternatifnya.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Mendekati <strong>1</strong> — path jauh di bawah rata-rata = sangat mudah diisolasi = sangat anomali. Artinya: titik ini <em>layak dilihat manusia</em>, bukan otomatis &ldquo;fraud&rdquo;.</p>
        <p><strong>2.</strong> 1.600/80.000 = <strong>2%</strong>. Dengan base rate 0,5%, contamination 2% memberi ruang 4x untuk anomali non-fraud (error sistem, perilaku unik) — <strong>masuk akal</strong>, tapi validasi dengan injeksi kasus diketahui (worked example 2).</p>
        <p><strong>3.</strong> Contoh: <strong>keputusan yang butuh penjelasan hukum</strong> (blokir nasabah korporat) — &ldquo;anomali&rdquo; bukan alasan yang bisa dipertahankan. Alternatif: rule berbasis hipotesis + investigasi manual hingga label terkumpul.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Ide inti Isolation Forest dalam satu kalimat?"
        options={[
          "Menghitung jarak ke tetangga terdekat",
          "Split acak berulang — titik yang terisolasi dalam sedikit split = anomali",
          "Meniru data normal dengan neural network",
          "Menghitung rata-rata",
        ]}
        correct={1}
        explanation="Benar: anomali 'berdiri sendiri' sehingga cepat terisolasi oleh split acak. Normal butuh banyak split untuk dipisahkan dari kerumunan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kamu set contamination=0,1% padahal anomali sejati 2%. Akibatnya?"
        options={[
          "Tidak ada efek",
          "Hanya 28% anomali tertangkap — ambang terlalu sempit karena asumsi salah",
          "Semua tertangkap",
          "Model error",
        ]}
        correct={1}
        explanation="Benar: contamination menentukan ambang ('anggap X% teratas sebagai anomali'). Salah asumsi = salah ambang total. Ini asumsi bisnis, bukan angka ajaib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Data punya dua kepadatan: ritel (padat, kecil) dan korporat (jarang, besar). Metode terbaik?"
        options={[
          "Isolation Forest dengan ambang global",
          "LOF — menilai 'aneh dibanding tetangganya', tidak menandai semua korporat sebagai anomali",
          "Rata-rata",
          "Hapus data korporat",
        ]}
        correct={1}
        explanation="Benar: LOF. Ambang global IF akan menandai seluruh transaksi korporat (Rp1 M yang normal di dunianya) sebagai anomali. LOF relatif terhadap lingkungan lokal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Autoencoder dilatih pada data campur fraud (kotor). Apa yang terjadi?"
        options={[
          "Makin pintar",
          "Model belajar meniru fraud juga → reconstruction error fraud mengecil → buta terhadap anomali",
          "Tidak ada efek",
          "Training lebih cepat",
        ]}
        correct={1}
        explanation="Benar: syarat mati-hidup autoencoder = data latih (cukup) bersih. 'Gagal meniru' hanya bermakna jika yang ditiru adalah normal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Peran PALING tepat unsupervised dalam arsitektur fraud dewasa?"
        options={[
          "Menggantikan supervised sepenuhnya",
          "Deteksi dini pola baru + eksplorasi + skor anomali sebagai fitur untuk supervised; temuan terbaik jadi rule baru",
          "Hanya untuk laporan",
          "Tidak ada peran",
        ]}
        correct={1}
        explanation="Benar: unsupervised = jembatan. Ia menemukan 'musuh yang belum punya nama', lalu temuan itu dimatangkan jadi rule (FR5) atau label untuk supervised (FR7)."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Supervised</strong> = &ldquo;seperti fraud yang pernah kulihat?&rdquo;; <strong>unsupervised</strong> = &ldquo;seperti apapun yang pernah kulihat?&rdquo; — untuk pola baru &amp; nol label.</li>
          <li><strong>Isolation Forest</strong>: <Tex math={String.raw`s(x) = 2^{-E[h(x)]/c(n)}`} /> — anomali = cepat terisolasi; contamination = asumsi bisnis penentu ambang.</li>
          <li><strong>LOF</strong>: anomali = kepadatan jauh di bawah tetangga — untuk data multi-densitas; mahal komputasi.</li>
          <li><strong>Autoencoder</strong>: <Tex math={String.raw`e(x) = \|x-\hat{x}\|^2`} /> — wajib latih pada data bersih; untuk pola kompleks non-linear.</li>
          <li>Unsupervised = <strong>mesin kandidat, bukan vonis</strong> — tidak kenal &ldquo;fraud&rdquo;, hanya &ldquo;aneh&rdquo;.</li>
          <li>Output terbaik: <strong>rule baru</strong> atau <strong>fitur baru</strong> untuk supervised.</li>
          <li>Kapan TIDAK pakai unsupervised: label sudah matang &amp; pola stabil — supervised menang telak.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr7-supervised-ml" className="btn btn-secondary btn-sm">← FR7</Link>
        <Link href="/learn/fr9-evaluasi" className="btn btn-primary btn-sm">Next: FR9 →</Link>
      </div>
    </div>
  );
}
