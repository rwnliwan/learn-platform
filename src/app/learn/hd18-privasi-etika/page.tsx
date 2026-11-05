"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd18PrivasiEtikaPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd18KanData = [{"x": ["Data mentah", "k=3", "k=5", "k=10"], "y": [87, 22, 9, 2], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["87%", "22%", "9%", "2%"], "textposition": "outside"}];
  const hd18KanDataLayout = {"xaxis": {"title": "Level proteksi"}, "yaxis": {"title": "% record unik (berisiko)", "range": [0, 100]}, "showlegend": false};

  const lab1Code = "import random\nrandom.seed(44)\n# dataset 'anonim': (kodepos, tgl_lahir, gender, diagnosis)\nanonim = [(f'90{i%50:02d}', f'{1950+i%40}-{(i%12)+1:02d}', 'L' if i%2 else 'P',\n           random.choice(['TB','DBD','DM'])) for i in range(200)]\n# data pemilih publik: (nama, kodepos, tgl_lahir, gender)\npemilih = [(f'Orang-{i}', c, t, g) for i,(c,t,g,_) in enumerate(anonim)]\ncocok_unik = 0\nfor nama, c, t, g in pemilih:\n    kandidat = [a for a in anonim if a[0]==c and a[1]==t and a[2]==g]\n    if len(kandidat) == 1:\n        cocok_unik += 1\nprint(f'Teridentifikasi unik: {cocok_unik}/{len(pemilih)} ({cocok_unik/len(pemilih):.0%})')\nprint('Tanpa nama, hanya 3 kolom “non-identitas”.')\nprint('-> Inilah serangan Sweeney. Generalisasi kodepos/tanggal = pertahanan.')";

  const lab2Code = "import random\nrandom.seed(55)\ndef laplace(skala):\n    u = random.random() - 0.5\n    return -skala * (1 if u < 0 else -1) * __import__('math').log(1-2*abs(u))\ntrue_count = 1234\nprint(f\"{'epsilon':>8} {'rilis':>8} {'error':>8}\")\nfor eps in [2.0, 1.0, 0.5, 0.1]:\n    rilis = true_count + laplace(1/eps)\n    print(f'{eps:>8} {rilis:>8.0f} {abs(rilis-true_count)/true_count:>7.1%}')\nprint()\nprint('Epsilon kecil -> noise besar -> privasi kuat, angka goyang.')\nprint('Untuk n=1234, error <1% bahkan di eps=0.1. Untuk n=8, noise')\nprint('mendominasi -> sel kecil otomatis terlindungi. Itulah DP bekerja.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD18 &mdash; Health Data Scientist</span>
        <h1 className="display-title">k-Anonymity &amp; Differential Privacy:<br />Rahasia Pasien di Era Data</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Gubernur yang Teridentifikasi</a></li>
          <li><a href="#deid">De-identifikasi &amp; k-Anonymity</a></li>
          <li><a href="#dp">Differential Privacy — Si Matematikawan</a></li>
          <li><a href="#federated">Federated Learning &amp; Tata Kelola</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Serangan Re-identifikasi &amp; k-Anonymity</a></li>
          <li><a href="#lab2">🔬 Lab 2: Noise Differential Privacy</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Memilih Epsilon</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Hierarki Proteksi Data</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Berbagi Data SATUSEHAT</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Menghitung Risiko Re-identifikasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>serangan re-identifikasi</strong> via quasi-identifier (kasus nyata).</li>
          <li>Menerapkan <strong>k-anonymity, l-diversity</strong> dan mengenali keterbatasannya.</li>
          <li>Menjelaskan <strong>differential privacy</strong> (epsilon) secara intuitif + trade-off privasi-utilitas.</li>
          <li>Merancang tata kelola: <strong>IRB/komite etik, DUA, UU PDP</strong>, dan kapan memakai <strong>federated learning</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Gubernur yang Teridentifikasi</h2>
      <div className="story">
        <p>1990-an, Massachusetts merilis data klaim kesehatan yang “dianonimkan” (nama dihapus). Peneliti Latanya Sweeney membeli data pemilih seharga $20, lalu mencocokkan <strong>kode pos + tanggal lahir + jenis kelamin</strong> — dan menemukan <strong>rekam medis Gubernur</strong>, termasuk diagnosis dan resepnya. Tanpa nama. Hanya tiga kolom “non-identitas”.</p>
      <p>Tiga kolom yang terlihat tidak berbahaya mengidentifikasi 87% populasi AS. Di Indonesia, kombinasi kecamatan + tanggal lahir + diagnosis langka sama mematikannya. Lesson ini tentang cara berbagi data tanpa mengkhianati pasien — karena kepercayaan publik adalah infrastruktur yang paling mahal untuk dibangun ulang.</p>
      <p><strong>Twist-nya:</strong> data itu <em>sudah</em> “dianonimkan” — nama dihapus, sesuai prosedur. Dan gubernur <em>tetap</em> teridentifikasi, hanya dengan tiga kolom yang <strong>tidak ada yang mengira berbahaya</strong>. Inilah pelajaran paling pahit privasi data: <strong>“tidak ada nama” ≠ “tidak bisa dikenali”</strong>. Identitas tidak tinggal di satu kolom; ia tinggal di <em>kombinasi</em> kolom. Setiap analis yang merilis “data anonim” tanpa menguji re-identifikasi sedang bermain rolet dengan privasi ribuan orang — dan Sweeney menunjukkan pelurunya selalu ada.</p>
      </div>

      <h2 id="deid">De-identifikasi &amp; k-Anonymity — Si Penyamar</h2>
      <p><strong>Definisi.</strong> <strong>Quasi-identifier</strong>: kolom yang tidak mengidentifikasi sendiri tapi deadly dalam kombinasi (umur, wilayah, tanggal). <strong>k-anonymity</strong>: tiap kombinasi quasi-identifier dimiliki minimal k orang. <strong>l-diversity</strong>: tiap kelompok-k juga beragam nilai sensitifnya.</p>
      <Tex math={String.raw`\text{Setiap pola quasi-identifier muncul} \geq k \text{ kali}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`k`} />: ambang anonimitas (umum: k=5)</li>
      </ul>
      <p><strong>Interpretasi:</strong> k=5: penyerang yang tahu umur+wilayah+diagnosismu hanya bisa mempersempit ke 5 orang, bukan 1. l-diversity menutup celah: bila kelima-limanya HIV-positif, anonimitasmu semu.</p>
      <details className="worked">
        <summary>📐 Contoh: generalisasi mencapai k=3</summary>
        <p>Data: (35 th, Kec. A, TB), (35, Kec. A, DBD), (36, Kec. A, TB) → pola (35, Kec.A) hanya 2 orang &lt; k=3.<br /><strong>Generalisasi:</strong> umur 35–36 → rentang “35–39”; Kec. A tetap.<br />Kini pola (35–39, Kec.A) = 3 orang ✓.<br /><strong>Harga:</strong> presisi umur hilang — analisis yang butuh umur tepat melemah. Inilah trade-off abadi privasi-utilitas.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> k-anonymity itu seperti menyamar di kerumunan: kamu aman bila ada minimal k−1 orang berpenampilan sama. l-diversity memastikan kerumunanmu tidak semuanya membawa rahasia yang sama.</p>
      <p><strong>Kapan memakai:</strong> Rilis dataset untuk riset: generalisasi + supresi hingga k terpenuhi; cek l-diversity untuk atribut sensitif.</p>

      <PlotlyChart
        data={hd18KanData}
        title="Risiko Re-identifikasi vs k-Anonymity (ilustratif)"
        layout={hd18KanDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = persen record yang unik (bisa diidentifikasi) pada tiap level. Makin kanan makin protektif.</p>
        <p><strong>Interpretasi:</strong> Data mentah: 87% unik (kasus Sweeney). k=5 memangkas ke 9%. Tapi perhatikan: tidak pernah nol — dan utilitas ikut turun. k-anonymity adalah mitigasi, bukan jaminan; untuk jaminan matematis lihat differential privacy.</p>
      </div>

      <h2 id="dp">Differential Privacy — Si Matematikawan</h2>
      <p><strong>Definisi.</strong> <strong>Differential privacy (DP)</strong>: jaminan bahwa hasil analisis <strong>hampir sama</strong> baik dengan maupun tanpa satu orang dalam data. Dicapai dengan menambah <strong>noise terkalibrasi</strong> (skala 1/epsilon). <strong>Epsilon kecil = privasi kuat, utilitas turun.</strong></p>
      <Tex math={String.raw`P[M(D) \in S] \leq e^{\epsilon} \cdot P[M(D') \in S]`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`M`} />: mekanisme (query + noise)</li>
          <li><Tex math={String.raw`D, D'`} />: dataset yang beda tepat 1 orang</li>
          <li><Tex math={String.raw`\epsilon`} />: budget privasi: kecil = ketat (umum 0,1–1)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus: kehadiranmu mengubah peluang output maksimal e^epsilon kali. Epsilon 0,1 → hampir tak terdeteksi kamu ada di data. Berbeda dengan k-anonymity, DP tahan terhadap <em>informasi latar penyerang apapun</em> — jaminan matematis, bukan harapan.</p>
      <details className="worked">
        <summary>📐 Contoh: hitung kasus DBD dengan DP</summary>
        <p>Kasus sebenarnya: 1.234. Sensitivitas query “count” = 1 (satu orang mengubah count max 1).<br />Noise Laplace skala 1/ε; ε=0,5 → noise ~ ±2.<br />Rilis: 1.236 (atau 1.232 — acak). Untuk agregat besar, noise tak berarti; untuk sel kecil (&lt;10), noise mendominasi — <strong>itulah proteksinya bekerja</strong>.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> DP itu seperti menjawab wartawan sambil berbisik dengan dadu di tangan: jawabannya benar secara statistik, tapi tak pernah cukup presisi untuk mengkhianati satu orang. Epsilon adalah volume bisikanmu.</p>
      <p><strong>Kapan memakai:</strong> Rilis statistik resmi, dashboard publik, query berulang ke data sensitif — di mana budget privasi harus dikelola.</p>

      <h2 id="federated">Federated Learning &amp; Tata Kelola — Si Arsitek Kepercayaan</h2>
      <p><strong>Definisi.</strong> <strong>Federated learning</strong>: model dilatih di tiap RS (data tidak pindah); hanya <em>update model</em> yang dikirim ke server pusat. <strong>Tata kelola</strong>: IRB/komite etik, <strong>DUA</strong> (perjanjian penggunaan data), dan <strong>UU PDP Indonesia</strong> (persetujuan, hak hapus, keamanan).</p>
      <details className="worked">
        <summary>📐 Contoh: checklist tata kelola proyek</summary>
        <p>1. <strong>Persetujuan etik</strong> (komite etik RS/universitas) — untuk data pasien, hampir selalu wajib.<br />2. <strong>Dasar hukum UU PDP</strong>: persetujuan eksplisit / kepentingan publik / kontrak — dokumentasikan.<br />3. <strong>DUA</strong>: siapa akses, untuk apa, berapa lama, larangan re-identifikasi.<br />4. <strong>Minimisasi</strong>: minta kolom yang dibutuhkan saja.<br />5. <strong>Keamanan</strong>: enkripsi, akses terbatas, audit log.<br />6. <strong>Rencana publikasi</strong>: agregat aman (DP/k-anonymity) untuk yang dipublikasi.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Federated learning itu seperti ujian nasional tanpa mengumpulkan lembar jawaban: tiap sekolah menilai sendiri, hanya nilai rata-rata yang dikirim ke pusat. Datanya diam, pengetahuannya jalan.</p>
      <p><strong>Kapan memakai:</strong> Kolaborasi multi-RS tanpa berbagi data mentah (riset, model bersama). Tata kelola: SELALU — sebelum satu baris data bergerak.</p>
      <div className="callout callout-warning"><strong>Federated learning bukan sihir privasi:</strong> update model bisa membocorkan data (model inversion). Kombinasikan dengan DP pada update + agregasi aman. “Data tidak pindah” ≠ “privasi terjamin”.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Menghitung Risiko Re-identifikasi</h2>
      <details className="worked">
        <summary>📐 Worked example: apakah “kecamatan + usia + diagnosis” aman dirilis? (klik untuk buka)</summary>
        <p>Dinkes ingin merilis dashboard publik kasus HIV per kecamatan (mini-case lesson ini): kolom = kecamatan, kelompok usia 10-tahunan, jenis kelamin, status.</p>
        <p><strong>Langkah 1 — Hitung ukuran sel.</strong> Kecamatan Sukamaju: perempuan, usia 20–29, HIV positif → <strong>n = 2</strong>. Dua orang. Siapapun yang tahu “ada perempuan 20-an di Sukamaju yang baru didiagnosis HIV” (tetangga, kader, mantan) bisa menebak dengan peluang 50%.</p>
        <p><strong>Langkah 2 — Uji k-anonymity.</strong> Syarat k=5: tiap kombinasi quasi-identifier harus muncul ≥5 kali. Sel n=2 <strong>gagal</strong> → wajib digabung: naikkan ke level kabupaten, atau gabung kelompok usia 20–39, atau sensor sel kecil (“&lt;5”).</p>
        <p><strong>Langkah 3 — Pertimbangkan pengetahuan latar.</strong> k-anonymity tidak melindungi dari <strong>homogeneity attack</strong>: jika sel n=8 semuanya HIV positif, penyerang tetap tahu status tiap orang di sel itu tanpa perlu tahu siapa siapa. Untuk data sensitif (HIV, TB, kesehatan jiwa): butuh <strong>l-diversity</strong> (variasi nilai sensitif dalam sel) atau tidak rilis granularitas itu sama sekali.</p>
        <p><strong>Langkah 4 — Alternatif: differential privacy.</strong> Rilis <em>hitungan ber-noise</em>: count + Laplace(1/ε). Dengan ε=1, sel n=2 menjadi “2 ± noise” — penyerang tidak bisa yakin apakah angka 2 itu nyata atau noise. Harga: utilitas turun untuk sel kecil (inilah trade-off privasi-utilitas yang fundamental).</p>
        <p><strong>Langkah 5 — Keputusan tata kelola.</strong> Untuk dashboard <em>publik</em>: agregasi minimal kabupaten + sensor sel &lt;5. Untuk <em>peneliti</em>: akses via data enclave dengan perjanjian, bukan unduhan bebas. <strong>Granularitas adalah hak akses</strong> — makin publik, makin kasar.</p>
        <p><strong>Pelajaran:</strong> “data anonim” tanpa angka k, tanpa uji serangan, tanpa tata kelola = <strong>janji kosong</strong>. Tulis ketiganya sebelum rilis.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — privasi adalah anggaran, bukan saklar:</strong> Differential privacy mengubah privasi dari “aman/tidak” menjadi <strong>anggaran matematika (ε)</strong>: tiap query menghabiskan sebagian anggaran; total kebocoran terkontrol. Intuisinya: ε kecil = noise besar = privasi kuat, utilitas rendah. Praktiknya (mis. US Census 2020 memakai ε total ~19 untuk ratusan tabel): tetapkan <strong>anggaran privasi tahunan</strong> per dataset, catat tiap rilis. Tanpa pembukuan ε, “kami pakai differential privacy” hanya slogan — karena 100 query @ ε=1 sama bocornya dengan tanpa proteksi.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — UU PDP dan data kesehatan:</strong> UU No. 27/2022 (PDP) mengkategorikan <strong>data kesehatan sebagai data pribadi spesifik</strong> — pelanggarannya berlapis pidana. Untuk analis Indonesia ini berarti tiga kewajiban praktis: (1) <strong>dasar pemrosesan</strong> — riset butuh persetujuan eksplisit atau mandat regulasi (tidak cukup “data sudah ada”); (2) <strong>penilaian dampak (DPIA)</strong> sebelum merilis/membagikan dataset kesehatan; (3) <strong>hak hapus</strong> — arsitektur data harus memungkinkan penghapusan per subjek (bertentangan dengan “sekali latih model, data melekat selamanya”). Ditambah: transfer data kesehatan ke luar negeri makin dibatasi. <strong>Kepatuhan bukan urusan legal belaka — ia menentukan arsitektur teknis</strong> (federated learning, data enclave) yang kamu pilih di HD18 ini.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Hierarki Proteksi Data Kesehatan</h2>
      <p>Tidak semua data butuh proteksi sama. Analis profesional memakai <strong>hierarki berlapis</strong> — dari yang paling terbuka hingga paling tertutup:</p>
      <p><strong>Lapis 1 — Data publik agregat.</strong> Statistik nasional/provinsi (mis. dashboard Kemenkes). Proteksi: <strong>agregasi kasar + sensor sel kecil + noise DP</strong>. Risiko: rendah. <strong>Lapis 2 — Data riset ter-de-identifikasi.</strong> Baris per pasien tanpa identifier langsung, untuk peneliti. Proteksi: <strong>k-anonymity + l-diversity + perjanjian penggunaan (DUA)</strong>. Risiko: sedang — re-identifikasi mungkin dengan data luar (lihat Sweeney). <strong>Lapis 3 — Data enclave.</strong> Peneliti bekerja <em>di dalam</em> lingkungan aman (tidak bisa unduh); hanya hasil agregat yang keluar (diperiksa petugas). Proteksi: <strong>kontrol akses + audit + output checking</strong>. Risiko: rendah-sedang. <strong>Lapis 4 — Federated learning.</strong> Data <em>tidak pernah keluar</em> dari RS; hanya <em>update model</em> yang dikirim ke server pusat. Proteksi: <strong>arsitektur</strong> (+ DP pada update bila perlu). Risiko: rendah untuk data mentah — tapi <strong>update model bisa bocor</strong> (model inversion attack) bila tanpa DP.</p>
      <p><strong>Prinsip pemilihan:</strong> mulai dari lapis <strong>paling terbuka yang masih aman</strong> untuk pertanyaanmu — bukan dari yang paling tertutup. Kebanyakan analisis kebijakan cukup Lapis 1–2. Memaksa semua riset ke Lapis 4 = <strong>keamanan teater</strong> yang membunuh produktivitas tanpa menambah proteksi nyata.</p>
      <p><strong>Jebakan “anonimisasi sekali, aman selamanya”:</strong> data yang “aman” hari ini bisa <strong>tidak aman besok</strong> — karena data pembanding baru muncul (bocoran data lain, media sosial, dataset publik baru). De-identifikasi <strong>bukan peristiwa</strong>, melainkan <strong>proses berkelanjutan</strong>: review ulang tiap rilis baru, pantau lanskap data luar. <strong>Tidak ada dataset yang “sudah anonim” secara permanen.</strong></p>
      <div className="callout">
        <p><strong>Prinsip:</strong> privasi = <strong>manajemen risiko</strong>, bukan status biner. Tanyakan selalu: <strong>“siapa penyerangnya, apa yang ia tahu, dan berapa biayanya?”</strong> — lalu pilih lapis yang membuat serangan <em>lebih mahal dari nilainya</em>.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data sudah anonim sehingga bebas dipakai untuk apa saja&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> “Anonim” tanpa evaluasi sisa risiko = klaim kosong (kasus Sweeney). Anonimitas adalah spektrum + konteks: data yang anonim untuk publikasi agregat belum tentu anonim untuk dibagikan ke pihak dengan data pembanding. Selalu: ukur, batasi akses, perjanjian.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Persetujuan pasien (consent) menyelesaikan semua masalah etik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Consent sering tidak informed (formulir panjang tak dibaca) dan tidak mencakup penggunaan sekunder 10 tahun kemudian. Etik butuh lebih: minimisasi, keamanan, akuntabilitas, dan — untuk kelompok rentan — pertimbangan keadilan (lihat HD13).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Federated learning = tidak perlu izin etik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tetap butuh! Data dipakai untuk riset = butuh persetujuan etik dan dasar hukum, walau tidak pindah server. Arsitektur teknis tidak menggantikan tata kelola.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Memilih Epsilon untuk Rilis Data</h2>
      <details className="worked">
        <summary>📐 Worked example: anggaran privasi untuk dashboard Dinkes (klik untuk buka)</summary>
        <p>Dinkes akan merilis <strong>20 tabel</strong> agregat (kasus per kecamatan × kelompok usia) dengan differential privacy. Berapa epsilon (ε) per tabel?</p>
        <p><strong>Langkah 1 — Pahami arti ε.</strong> ε mengontrol <strong>batas kebocoran privasi</strong>: ε kecil = noise besar = privasi kuat. Aturan praktis literatur: ε <strong>0,1–1</strong> per query = kuat; ε &gt; 10 = lemah (hampir tanpa proteksi).</p>
        <p><strong>Langkah 2 — Komposisi: anggaran dibagi.</strong> Teorema komposisi dasar: 20 tabel @ ε=1 → total ε = <strong>20</strong> (bocor!). Untuk total ε ≤ 2 (target tahunan), maka per tabel ε = 2/20 = <strong>0,1</strong>. <strong>Inilah mengapa “kami pakai DP” tanpa pembukuan = omong kosong</strong>: 100 query @ ε=1 sama dengan tanpa proteksi.</p>
        <p><strong>Langkah 3 — Hitung noise-nya.</strong> Sensitivitas count = 1 (satu orang mengubah count maks 1). Noise Laplace skala = 1/ε = 1/0,1 = <strong>10</strong>. Untuk sel kecamatan berpopulasi 50.000 dengan 200 kasus: 200 ± ~10 → <strong>tetap berguna</strong>. Untuk sel kecil (5 kasus): 5 ± ~10 → <strong>tidak berguna</strong> (noise &gt; sinyal).</p>
        <p><strong>Langkah 4 — Keputusan desain.</strong> Karena noise membunuh sel kecil: (a) <strong>agregasi dulu</strong> (kabupaten, bukan kecamatan) untuk tabel publik; (b) <strong>alokasikan ε tidak merata</strong> — tabel penting (tren provinsi) dapat ε lebih besar, tabel minor ε kecil; (c) <strong>sensor + DP</strong>: sel &lt;10 tidak dirilis sama sekali (hemat anggaran untuk yang penting).</p>
        <p><strong>Langkah 5 — Tata kelola.</strong> Tetapkan <strong>anggaran privasi tahunan</strong> per dataset (mis. ε=2/tahun), catat tiap rilis di <strong>buku kas privasi</strong>, dan publikasikan metodologinya. Anggaran habis = <strong>tidak ada rilis lagi</strong> tahun itu (atau pakai data sintetis). Kedengarannya ekstrem — tapi itulah <strong>arti matematis</strong> dari “privasi terjamin”.</p>
        <p><strong>Pelajaran:</strong> differential privacy mengubah privasi dari <strong>janji</strong> menjadi <strong>akuntansi</strong>. Dan akuntansi yang tidak dibukukan = penggelapan.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kali vendor mengklaim “data kami differential-private”, tanyakan <strong>dua angka</strong>: ε-nya berapa, dan total komposisinya berapa. Tidak bisa jawab = tidak pakai DP.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Terapkan <strong>prinsip minimisasi</strong> secara agresif: untuk tiap kolom, tanya “apa yang rusak bila kolom ini tidak ada?” Kolom yang tidak ada = kolom yang tidak bisa bocor.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Pisahkan peran: <strong>data engineer</strong> (lihat teridentifikasi) vs <strong>analis</strong> (hanya de-id). Segregasi akses adalah pertahanan termurah dan paling efektif.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Dokumentasikan keputusan privasi seperti keputusan metode: <strong>apa risikonya, apa mitigasinya, siapa menyetujui</strong>. Jejak audit ini yang ditanya saat insiden — bukan niat baikmu.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Serangan Re-identifikasi Sederhana</h2>
      <p>Diberikan dataset “anonim” (tanpa nama) + data pemilih publik. Cocokkan quasi-identifier dan hitung berapa yang teridentifikasi unik.</p>
      <PyodideLab
        title="🔬 Lab 1: Serangan Re-identifikasi Sederhana"
        hint="Ubah granularitas kode pos (5 digit → 3 digit). Lihat identifikasi unik anjlok — itulah generalisasi bekerja."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Noise Differential Privacy</h2>
      <p>Tambahkan noise Laplace ke query count dengan berbagai epsilon. Lihat trade-off: privasi kuat (epsilon kecil) = angka goyang.</p>
      <PyodideLab
        title="🔬 Lab 2: Noise Differential Privacy"
        hint="Coba count kecil (n=8, mis. kasus langka di kecamatan) vs besar (n=5000). DP melindungi yang kecil dengan “mengaburkan” — tepat di mana risiko terbesar."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Berbagi Data SATUSEHAT Tanpa Mengkhianati Pasien</h2>
      <p>SATUSEHAT mengintegrasikan data ratusan faskes — <strong>harta karun riset</strong> sekaligus <strong>risiko privasi nasional</strong>. Bagaimana Indonesia berbagi data ini dengan aman? Inilah arsitektur yang sedang dibangun — dan yang harus kamu pahami:</p>
      <p><strong>Prinsip 1 — Persetujuan &amp; dasar hukum.</strong> UU PDP: data kesehatan = <strong>data pribadi spesifik</strong> → butuh <strong>persetujuan eksplisit</strong> atau <strong>mandat regulasi</strong>. “Data sudah ada di sistem” <strong>bukan</strong> izin riset. Praktik: <em>consent management</em> terintegrasi (pasien mengatur izin via aplikasi), + <em>secondary use</em> hanya untuk tujuan yang disetujui/dimandatkan.</p>
      <p><strong>Prinsip 2 — Data minimization.</strong> Peneliti TB tidak butuh data <em>kesehatan jiwa</em> pasien. Akses diberikan <strong>per proyek, per variabel, per periode</strong> — bukan “akses database”. Setiap kolom yang dibuka harus <strong>dibenarkan</strong> di proposal etik.</p>
      <p><strong>Prinsip 3 — Lapis akses (lihat hierarki di atas).</strong> Dashboard publik (Lapis 1) ← agregat DP. Peneliti (Lapis 2–3) ← de-identifikasi + DUA + enclave. RS (Lapis 4) ← federated untuk model nasional tanpa data keluar.</p>
      <p><strong>Prinsip 4 — Hak subjek data.</strong> Pasien berhak: tahu datanya dipakai untuk apa, <strong>menarik persetujuan</strong>, meminta <strong>penghapusan</strong>. Implikasi teknis yang dalam: arsitektur harus mendukung <em>penghapusan per subjek</em> — termasuk dari <strong>dataset training model</strong> (machine unlearning — frontier riset!). Membangun sistem tanpa tombol hapus = <strong>membangun pelanggaran</strong>.</p>
      <p><strong>Peran analis:</strong> kamu adalah <strong>penjaga gerbang</strong> — yang menulis DPIA (penilaian dampak privasi), yang memutuskan granularitas rilis, yang menolak permintaan “data mentahnya saja”. <strong>Keberanian menolak</strong> adalah skill etik terpenting — dan yang paling sulit, karena penolakanmu melawan atasan yang berkuasa.</p>
      <div className="tip">
        <p><strong>💡 Intuisi etik:</strong> uji terakhir setiap keputusan data: <strong>“beranikah saya menjelaskan ini ke pasiennya, tatap muka?”</strong> — Jika tidak, jangan lakukan. Tidak ada metrik utilitas yang mengalahkan <strong>kepercayaan publik</strong> — sekali hilang, butuh dekade membangun ulang.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Rilis dataset riset → k-anonymity + l-diversity + DUA</h3>
        <p><strong>Kondisi:</strong> Data baris-per-orang dibagikan ke pihak ketiga.</p>
        <p><strong>Kenapa:</strong> Praktis, dipahami reviewer; DUA menutup sisa risiko.</p>
        <p><strong>Contoh nyata:</strong> Dataset TB untuk peneliti universitas.</p>
      </div>
      <div className="decision-card">
        <h3>2. Statistik publik berulang → Differential privacy</h3>
        <p><strong>Kondisi:</strong> Agregat dirilis rutin/publik; query bisa berulang.</p>
        <p><strong>Kenapa:</strong> Jaminan matematis + budget privasi terkontrol.</p>
        <p><strong>Contoh nyata:</strong> Dashboard kasus mingguan per kecamatan.</p>
      </div>
      <div className="decision-card">
        <h3>3. Kolaborasi multi-RS tanpa share data → Federated + DP</h3>
        <p><strong>Kondisi:</strong> Data tidak boleh keluar institusi.</p>
        <p><strong>Kenapa:</strong> Model jalan, data diam; DP pada update cegah inversion.</p>
        <p><strong>Contoh nyata:</strong> Model prediksi bersama 5 RS.</p>
      </div>
      <div className="decision-card">
        <h3>4. Setiap proyek data pasien → Tata kelola dulu</h3>
        <p><strong>Kondisi:</strong> Tanpa kecuali.</p>
        <p><strong>Kenapa:</strong> Kepercayaan publik &gt; kecepatan analisis.</p>
        <p><strong>Contoh nyata:</strong> Checklist: etik, UU PDP, minimisasi, keamanan, audit.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Quasi-identifier dalam kombinasi = identifier.</li>
          <li>Ukur sisa risiko; jangan klaim “anonim” buta.</li>
          <li>DP: epsilon kecil = privasi kuat.</li>
          <li>Tata kelola dulu, analisis kemudian.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Dashboard Publik Kasus HIV per Kecamatan</h2>
      <div className="callout">
        <p>Dinkes ingin dashboard publik: kasus HIV per kecamatan per bulan untuk transparansi. Di kecamatan kecil, ada bulan dengan <strong>1–2 kasus</strong>. Tim IT berkata: “nama tidak ditampilkan, jadi aman.”</p>
      <p>Kamu diminta review sebelum launch.</p>
        <p><strong>Pertanyaan:</strong> Apa risikonya dan rancang solusi 3 lapis.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Risiko: sel kecil (1–2 kasus) + kecamatan + bulan = re-identifikasi mudah bagi warga lokal (“siapa yang ke klinik bulan lalu?”) — stigma HIV membuat dampaknya devastating. Solusi 3 lapis: (1) <strong>Supresi sel kecil</strong>: tampilkan “&lt;5” untuk count di bawah ambang; (2) <strong>Agregasi</strong>: level kabupaten untuk publik, kecamatan hanya untuk petugas berizin; (3) <strong>DP</strong>: tambahkan noise terkalibrasi pada count publik. Plus: kajian etik + dasar UU PDP sebelum launch. Pelajaran: transparansi tanpa proteksi = membahayakan yang paling rentan. “Tidak ada nama” bukan argumen privasi.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kasus Sweeney (Gubernur teridentifikasi) membuktikan…"
        options={["Anonimisasi mustahil",
          "Quasi-identifier (kodepos+tgl lahir+gender) dalam kombinasi bisa mengidentifikasi unik",
          "Data pemilih ilegal",
          "Gubernur ceroboh"]}
        correct={1}
        explanation="Benar: 87% populasi AS unik dengan 3 kolom. Hapus nama ≠ anonim."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. k-anonymity = 5 artinya…"
        options={["5 kolom dihapus",
          "Tiap kombinasi quasi-identifier dimiliki minimal 5 orang",
          "5% data dibuang",
          "5 lapis enkripsi"]}
        correct={1}
        explanation="Benar: bersembunyi di kerumunan minimal 5. l-diversity menutup celah kerumunan yang homogen."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Epsilon kecil dalam differential privacy berarti…"
        options={["Privasi lemah",
          "Privasi kuat (noise besar), utilitas turun",
          "Tidak ada noise",
          "Komputasi cepat"]}
        correct={1}
        explanation="Benar: trade-off fundamental. Epsilon = volume bisikan privasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Keunggulan DP atas k-anonymity?"
        options={["Lebih mudah",
          "Jaminan matematis tahan info latar penyerang apapun",
          "Tanpa noise",
          "Gratis"]}
        correct={1}
        explanation="Benar: k-anonymity = harapan (bisa jebol dengan info baru); DP = bukti."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Federated learning tetap butuh persetujuan etik karena…"
        options={["Teknisnya sulit",
          "Data tetap dipakai untuk riset — arsitektur tidak menggantikan tata kelola",
          "Server mahal",
          "Modelnya besar"]}
        correct={1}
        explanation="Benar: “data tidak pindah” ≠ “privasi terjamin” (model inversion!) dan ≠ “bebas etik”."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Prinsip PERTAMA sebelum proyek data pasien berjalan?"
        options={["Pilih model ML",
          "Tata kelola: persetujuan etik, dasar UU PDP, minimisasi, DUA",
          "Beli server",
          "Rekrut analis"]}
        correct={1}
        explanation="Benar: kepercayaan publik adalah infrastruktur termahal. Tata kelola dulu, analisis kemudian."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Quasi-identifier</strong> dalam kombinasi = identifier (pelajaran Sweeney).</li>
          <li><strong>k-anonymity</strong>: kerumunan minimal k; <strong>l-diversity</strong>: kerumunan beragam.</li>
          <li><strong>Differential privacy</strong>: jaminan matematis via noise; epsilon kecil = privasi kuat.</li>
          <li><strong>Federated learning</strong>: data diam, model jalan — tetap butuh DP + etik.</li>
          <li>Terapkan <strong>minimisasi</strong> agresif + segregasi akses.</li>
          <li><strong>UU PDP</strong>: dasar hukum, persetujuan, hak subjek, keamanan.</li>
          <li>Sel kecil (&lt;5) = bahaya — supresi/agregasi/DP.</li>
          <li>Dokumentasikan keputusan privasi seperti keputusan metode.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd17-ekonomi-kesehatan" className="btn btn-secondary btn-sm">← HD17</Link>
        <Link href="/learn/hd19-pelaporan-klinis" className="btn btn-primary btn-sm">HD19 →</Link>
      </div>
    </div>
  );
}
