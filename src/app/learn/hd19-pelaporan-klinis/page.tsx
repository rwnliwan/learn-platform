"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd19PelaporanKlinisPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd19CheckData = [{"x": ["Desain eksplisit", "Flow peserta", "Definisi variabel", "Bahasa bias", "Missing data", "Generalisasi"], "y": [45, 38, 52, 70, 63, 58], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "38%", "52%", "70%", "63%", "58%"], "textposition": "outside"}];
  const hd19CheckDataLayout = {"xaxis": {"title": "Item STROBE"}, "yaxis": {"title": "% laporan bermasalah", "range": [0, 85]}, "showlegend": false};

  const lab1Code = "laporan = \"\"\"Studi: program diet menurunkan berat 5kg (n=2000, p<0.001).\nMetode: data aplikasi, 12 minggu. Hasil: rata-rata turun 5kg.\nKesimpulan: program efektif.\"\"\"\nchecklist = [\n    ('Desain disebut eksplisit?', 'TIDAK -> observasional tanpa kontrol'),\n    ('Eligibility & flow peserta?', 'TIDAK -> berapa drop-out?'),\n    ('Definisi outcome?', 'KURANG -> berat self-report?'),\n    ('Bias dibahas?', 'TIDAK -> seleksi, confounding'),\n    ('Missing data?', 'TIDAK -> 40% berhenti nimbang?'),\n    ('Analisis sesuai desain?', 'TIDAK -> uji-t naif, abaikan klaster'),\n    ('Keterbatasan diakui?', 'TIDAK'),\n    ('Generalisasi?', 'TIDAK -> pengguna aplikasi != populasi'),\n]\ngagal = sum(1 for _, v in checklist if v.startswith('TIDAK'))\nfor item, nilai in checklist:\n    print(f'[{\"X\" if nilai.startswith(\"TIDAK\") else \"?\"}] {item} {nilai}')\nprint(f'\\nGagal {gagal}/8 item. Laporan seperti ini = siaran pers, bukan sains.')";

  const lab2Code = "a, b = 42, 48  # dua nilai: turun/naik 6 poin\nrasio_data = b/a\n# tinggi visual bila sumbu mulai dari 40\nvisual_menipu = (b-40)/(a-40)\nprint(f'data: {a} vs {b} -> rasio sebenarnya {rasio_data:.2f}x')\nprint(f'sumbu dari 40: batang terlihat {visual_menipu:.1f}x lipat!')\nprint(f'Pembesaran visual: {visual_menipu/rasio_data:.1f}x dari realita')\nprint()\nprint('Aturan: bar chart SELALU dari nol.')\nprint('Pengecualian (line chart zoom) -> beri anotasi JELAS.')\nprint('Prinsip: jangan biarkan grafik berkata lebih dari data.')";

  const hd19DashData = [{"x": ["Kematian", "Readmission", "Kepuasan"], "y": [42, 48, 85], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Versi menipu (sumbu 40)", "text": ["42%", "48%", "85%"], "textposition": "outside"}];
  const hd19DashDataLayout = {"xaxis": {"title": ""}, "yaxis": {"title": "%", "range": [40, 90]}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD19 &mdash; Health Data Scientist</span>
        <h1 className="display-title">STROBE &amp; Dashboard Klinis:<br />Melaporkan Sains dengan Benar</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Grafik yang Membunuh Kepercayaan</a></li>
          <li><a href="#strobe">STROBE, CONSORT, TRIPOD — Si Notaris Sains</a></li>
          <li><a href="#dashboard">Dashboard untuk Klinisi</a></li>
          <li><a href="#komunikasi">Bercerita ke Non-Teknis</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Checklist STROBE Mini</a></li>
          <li><a href="#lab2">🔬 Lab 2: Pilih Visualisasi yang Jujur</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Abstrak Jujur</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Tiga Audiens, Tiga Bahasa</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Komunikasi Krisis</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Forensik Grafik Menipu</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan isi kunci <strong>STROBE, CONSORT, TRIPOD(+AI)</strong> dan memilih yang tepat per desain studi.</li>
          <li>Merancang <strong>dashboard klinis</strong> yang menjawab keputusan, bukan memamerkan grafik.</li>
          <li>Mengomunikasikan temuan statistik ke <strong>audiens non-teknis</strong> (direktur, Kadinkes) tanpa menyesatkan.</li>
          <li>Menyusun <strong>laporan reproducible</strong>: kode, data, versi, lingkungan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Grafik yang Membunuh Kepercayaan</h2>
      <div className="story">
        <p>Analis mempresentasikan ke direktur RS: grafik batang 3D warna-warni menunjukkan “penurunan kematian 50%”. Direktur terkesan — sampai dokter senior bertanya: “Sumbu Y-nya mulai dari 40%, ya? Dan ini data 2 bulan, bukan setahun?” Ruangan hening. Grafik itu benar secara teknis, menipu secara visual. Kepercayaan direktur ke tim data butuh <strong>2 tahun</strong> untuk pulih.</p>
      <p>Analisis terbaik pun mati jika dilaporkan dengan buruk — atau lebih buruk: dilaporkan dengan menipu. Lesson ini tentang dua keterampilan terakhir analis kesehatan: melaporkan sains dengan standar, dan bercerita dengan jujur.</p>
      <p><strong>Twist-nya:</strong> grafik itu <strong>tidak berbohong</strong> — datanya benar, penurunannya nyata, sumbunya berlabel. Dan ia <em>tetap</em> menipu: sumbu Y yang dipotong membuat penurunan kecil terlihat dramatis; 3D membuat perbandingan mustahil dibaca akurat. Inilah yang paling berbahaya dari visualisasi menipu: <strong>ia lolos audit kejujuran data, tapi gagal audit kejujuran persepsi</strong>. Direktur yang tertipu sekali tidak akan percaya lagi — dan kepercayaan yang hilang 2 tahun itu <em>lebih mahal</em> dari grafik tercantik apapun. Lesson ini mengajarkanmu menjadi analis yang <strong>dipercaya</strong>, bukan sekadar analis yang benar.</p>
      </div>

      <h2 id="strobe">STROBE, CONSORT, TRIPOD — Si Notaris Sains</h2>
      <p><strong>Definisi.</strong> <strong>STROBE</strong>: checklist pelaporan studi observasional. <strong>CONSORT</strong>: untuk RCT (diagram alir peserta wajib). <strong>TRIPOD(+AI)</strong>: untuk model prediksi (lihat HD12). Intinya sama: <strong>laporkan cukup detail hingga orang lain bisa menilai dan mengulang</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh: 5 item STROBE yang paling sering dilanggar</summary>
        <p>1. <strong>Desain</strong> disebut eksplisit di judul/abstrak (bukan disembunyikan).<br />2. <strong>Eligibility &amp; rekrutmen</strong>: siapa masuk/keluar, berapa yang hilang di tiap tahap (flow diagram).<br />3. <strong>Definisi variabel</strong>: outcome/paparan/confounder didefinisikan operasional (lihat HD11 fenotipe!).<br />4. <strong>Bias</strong>: upaya mengatasi + keterbatasan yang diakui.<br />5. <strong>Missing data</strong>: berapa % per variabel + cara penanganan (lihat HD8).<br />Lima ini = 80% pertanyaan reviewer. Jawab sebelum ditanya.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Checklist ini seperti notaris: membosankan, tapi tanpanya tidak ada yang percaya transaksimu sah. Jurnal top menolak naskah yang tidak mengikutinya — bukan karena birokrasi, tapi karena terlalu banyak sains buruk lolos tanpa mereka.</p>
      <p><strong>Kapan memakai:</strong> Setiap laporan studi: observasional → STROBE; trial → CONSORT; model prediksi → TRIPOD. Untuk internal RS: versi ringkasnya tetap berguna.</p>

      <PlotlyChart
        data={hd19CheckData}
        title="% Laporan yang Melewatkan Item STROBE Kunci (ilustratif, review literatur)"
        layout={hd19CheckDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = persen laporan observasional yang bermasalah pada tiap item checklist.</p>
        <p><strong>Interpretasi:</strong> 70% tidak membahas bias; 63% diam soal missing data. Artinya: mayoritas laporan gagal di hal yang justru menentukan kepercayaan. Checklist bukan formalitas — ia adalah tempat sebagian besar sains buruk bersembunyi.</p>
      </div>

      <h2 id="dashboard">Dashboard untuk Klinisi — Si Asisten Visite</h2>
      <p><strong>Definisi.</strong> Dashboard klinis yang baik: <strong>satu layar, satu keputusan</strong>. Menjawab “apa yang harus kulakukan?” — bukan “data apa yang ada?” Prinsip: hierarki (ringkasan → detail), alert yang bisa ditindaklanjuti, dan konteks (pembanding, tren).</p>
      <details className="worked">
        <summary>📐 Contoh: dashboard sepsis IGD yang dipakai</summary>
        <p><strong>Atas:</strong> 3 angka besar — pasien berisiko saat ini, median time-to-antibiotik, kepatuhan bundle.<br /><strong>Tengah:</strong> daftar pasien terurut risiko + alasan (SHAP ringkas) + tombol aksi.<br /><strong>Bawah:</strong> tren 30 hari + perbandingan shift.<br /><strong>Yang dibuang:</strong> 12 grafik “menarik” yang tidak mengubah tindakan. Uji: observasi 5 dokter memakai 1 minggu — yang tidak diklik, dihapus.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Dashboard yang baik itu seperti asisten visite yang berbisik: “Dok, 3 pasien ini memburuk — yang ini paling mendesak karena…” Dashboard yang buruk itu seperti arsiparis yang menumpuk 50 grafik di meja dokter dan berkata “silakan cari sendiri”.</p>
      <p><strong>Kapan memakai:</strong> Monitoring operasional (BOR, antrean), kualitas (readmission, infeksi), program (cakupan imunisasi). Desain bersama penggunanya — bukan untuk mereka.</p>
      <div className="callout callout-warning"><strong>Alert fatigue</strong> (lihat HD12): alert yang 90% false positive akan diabaikan — termasuk yang 10% benar. Setiap alert harus: akurat, tepat waktu, dan punya aksi jelas. Kurangi alert, bukan tambah.</div>

      <h2 id="komunikasi">Bercerita ke Non-Teknis — Si Penerjemah Terakhir</h2>
      <p><strong>Definisi.</strong> Komunikasi temuan ke direktur/Kadinkes/publik: <strong>pesan dulu, metode kemudian</strong>; angka absolut (bukan relatif); visual jujur (sumbu dari nol untuk batang); ketidakpastian dinyatakan eksplisit.</p>
      <Tex math={String.raw`\text{Kepercayaan} = \frac{\text{kejujuran tentang ketidakpastian}}{\text{kompleksitas penyajian}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{kejujuran tentang ketidakpastian}`} />: interval, keterbatasan, “yang belum kami tahu”</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus konseptual: kepercayaan naik saat kamu jujur soal batas analisismu, dan turun saat penyajianmu pamer kompleksitas. “Kami 95% yakin efeknya antara 10–30%” lebih dipercaya dari “pasti 22,4%”.</p>
      <details className="worked">
        <summary>📐 Contoh: menyampaikan NNT ke Kadinkes</summary>
        <p><strong>Buruk:</strong> “Intervensi menunjukkan RRR 50% dengan p&lt;0,001 pada model Cox multivariabel.”<br /><strong>Baik:</strong> “Dari 100 anak yang divaksin, 2 terhindar dari campak berat. Biayanya Rp5 juta per anak yang terlindungi. Angka ini bisa bergeser 1–3 tergantung cakupan.”<br />Yang kedua: absolut, ada biaya, ada ketidakpastian — dan bisa dipakai memutuskan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Penerjemah yang baik tidak menerjemahkan kata per kata (p-value, hazard ratio) — ia menerjemahkan <em>makna keputusan</em>. Kadinkes tidak butuh tahu Cox; ia butuh tahu “berapa anak, berapa rupiah, seberapa yakin”.</p>
      <p><strong>Kapan memakai:</strong> Setiap presentasi ke non-teknis: 1 pesan utama per slide, visual jujur, rekomendasi eksplisit dengan caveat.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Forensik Grafik Menipu</h2>
      <details className="worked">
        <summary>📐 Worked example: membedah “stunting turun 5%!” (klik untuk buka)</summary>
        <p>Laporan ke gubernur: grafik batang “prevalensi stunting turun dari 24% ke 19% — turun 5%!” dengan sumbu Y 15–25%.</p>
        <p><strong>Langkah 1 — Cek sumbu.</strong> Sumbu dipotong di 15%: penurunan 5 poin <em>terlihat</em> seperti penurunan 50% secara visual. Gambar ulang dengan sumbu 0: penurunannya nyata tapi jauh kurang dramatis. <strong>Aturan:</strong> untuk perbandingan besaran, sumbu Y mulai dari 0 — kecuali ada alasan kuat yang dinyatakan eksplisit.</p>
        <p><strong>Langkah 2 — Cek “5%” vs “5 poin persen”.</strong> “Turun 5%” ambigu: maksudnya 24% → 19% (turun 5 <em>poin persen</em>) atau turun 5% <em>relatif</em> (24% → 22,8%)? Keduanya beda jauh. Tulis selalu: “turun 5 poin persen (24% → 19%; penurunan relatif 21%)”.</p>
        <p><strong>Langkah 3 — Cek ketidakpastian.</strong> Prevalensi dari survei (SSGI) punya <strong>interval kepercayaan</strong>: 24% (95% CI: 21–27%) vs 19% (95% CI: 16–22%). CI <em>tumpang tindih</em> → penurunan <strong>belum tentu signifikan</strong> secara statistik. Melaporkan “turun!” tanpa CI = mengklaim kemenangan dari noise.</p>
        <p><strong>Langkah 4 — Cek pembanding.</strong> Nasional turun dari 21,6% ke 19,8% pada periode sama — tren provinsi <em>searah tren nasional</em>. Klaim “program kita berhasil” butuh pembanding yang tidak ikut program (difference-in-differences, lihat HD10).</p>
        <p><strong>Langkah 5 — Tulis ulang yang jujur.</strong> “Prevalensi stunting tercatat 19% (turun 5 poin persen dari 24%; 95% CI tumpang tindih — penurunan belum signifikan secara statistik; tren searah nasional).” Kurang heroik — tapi <strong>bisa dipertahankan di depan auditor</strong>.</p>
        <p><strong>Pelajaran:</strong> setiap grafik untuk pengambil keputusan harus lolos <strong>5 cek</strong>: sumbu, satuan persen, ketidakpastian, pembanding, dan “apakah visualnya sebanding dengan klaimnya”.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — dashboard untuk klinisi ≠ dashboard untuk analis:</strong> Dokter visite punya <strong>90 detik per pasien</strong>: dashboard yang benar menampilkan <em>satu angka aksi</em> (“skor sepsis 7 — waspada”) + <em>tren 24 jam</em> + <em>apa yang harus dilakukan</em>. Dashboard analis (20 filter, 15 grafik) di tangan dokter = tidak dibaca = tidak ada. Prinsip desain: <strong>“glanceable, actionable, trustworthy”</strong> — bisa dibaca sekilas, jelas aksinya, sumber datanya transparan. Uji dengan <em>shadowing</em> 1 shift: jika dokter tidak melirik dashboard-mu selama visite, desainmu gagal — sebagus apapun datanya.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — STROBE dan jurnal kesehatan Indonesia:</strong> Checklist STROBE (22 item untuk studi observasional) bukan “birokrasi jurnal” — ia adalah <strong>daftar hal yang analis wajib bisa jawab</strong>: bagaimana partisipan dipilih, bagaimana bias ditangani, berapa yang hilang follow-up. Jurnal kesehatan Indonesia (dari Sinta 2 hingga internasional) makin mensyaratkannya; naskah tanpa flowchart partisipan langsung dicurigai <em>cherry-picking</em>. Praktik terbaik: tulis laporanmu <strong>mengikuti urutan STROBE</strong> sejak awal (metode → partisipan → data deskriptif → outcome → hasil utama → analisis lain) — bukan menempel checklist di akhir. Laporan yang “STROBE-ready” juga otomatis “direksi-ready”: lengkap, jujur, bisa diaudit.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Tiga Audiens, Tiga Bahasa</h2>
      <p>Analisis yang sama harus diceritakan <strong>tiga kali</strong> — dalam tiga bahasa berbeda. Analis yang hanya bisa satu bahasa hanya bisa meyakinkan sepertiga pendengarnya.</p>
      <p><strong>1. Bahasa regulator/auditor: presisi &amp; keterlacakan.</strong> Mereka bertanya: “bagaimana kamu tahu?” Jawab dengan: <strong>metode lengkap</strong> (STROBE/CONSORT/TRIPOD), <strong>flowchart partisipan</strong> (siapa hilang di mana), <strong>analisis sensitivitas</strong>, <strong>kode + data</strong> (reproducibility). Bahasa ini = <strong>pertahanan</strong>: setiap kalimat harus tahan interogasi. Aturan: tidak ada angka tanpa <strong>sumber + metode + keterbatasan</strong>.</p>
      <p><strong>2. Bahasa klinisi: aksi &amp; kepercayaan.</strong> Dokter bertanya: “apa yang harus saya lakukan <em>berbeda</em> besok pagi?” Jawab dengan: <strong>satu rekomendasi jelas</strong>, <strong>angka absolut</strong> (NNT, bukan RR), <strong>untuk pasien seperti apa</strong> (kriteria!), dan <strong>apa risikonya</strong>. Bahasa ini = <strong>keputusan</strong>: buang semua yang tidak mengubah tindakan. Aturan: jika slide-mu tidak mengubah <em>perilaku</em> klinisi, ia <em>gagal</em> — sebagus apapun statistiknya.</p>
      <p><strong>3. Bahasa publik/pembuat kebijakan: makna &amp; kejujuran.</strong> Mereka bertanya: “jadi intinya apa, dan seberapa yakin kamu?” Jawab dengan: <strong>analogi konkret</strong> (“dari 100 orang seperti Anda…”), <strong>ketidakpastian yang jujur</strong> (“kami belum tahu X”), dan <strong>apa yang <em>tidak</em> kami klaim</strong>. Bahasa ini = <strong>kepercayaan</strong>: publik memaafkan ketidakpastian, tapi <strong>tidak memaafkan</strong> ketahuan melebih-lebihkan. Aturan: tidak ada persen tanpa <strong>pembilang-penyebut</strong>; tidak ada klaim tanpa <strong>kualifikasi</strong>.</p>
      <p><strong>Kesalahan klasik: satu slide untuk semua.</strong> Presentasi ke direksi memakai bahasa regulator (membosankan, tidak ada keputusan), ke dokter memakai bahasa publik (tidak cukup detail untuk bertindak), ke auditor memakai bahasa klinisi (tidak bisa diverifikasi). <strong>Siapkan tiga versi</strong> — atau minimal, tiga bagian: <em>metode</em> (apendiks), <em>temuan aksi</em> (inti), <em>makna</em> (pembuka).</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> komunikasi yang baik bukan “menyederhanakan” — melainkan <strong>menerjemahkan tanpa kehilangan kebenaran</strong>. Setiap terjemahan yang menghilangkan kualifikasi penting adalah <strong>kebohongan yang sopan</strong>.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Laporan yang baik = laporan yang lengkap (semua analisis ditampilkan)&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Lengkap ≠ baik. Laporan yang baik = <strong>lengkap tentang yang penting, jujur tentang keterbatasan</strong>. Menampilkan 30 analisis sensitivitas tanpa hierarki = menyembunyikan pesan. Kurasi adalah bagian dari kejujuran.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Visualisasi yang menarik = visualisasi yang baik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 3D, gradien, dan animasi sering <em>mengurangi</em> akurasi baca. Kebaikan visual diukur dari: seberapa cepat dan tepat audiens menangkap pesan yang benar. Uji dengan 5 orang — bukan dengan selera desainer.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Ketidakpastian membuat kita terlihat tidak kompeten&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Sebaliknya: menyembunyikan ketidakpastian yang lalu terbukti salah = menghancurkan kepercayaan permanen (cerita pembuka). “Kami belum tahu X” adalah kalimat profesional, bukan pengakuan kalah.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membedah Abstrak — Sebelum vs Sesudah</h2>
      <details className="worked">
        <summary>📐 Worked example: menulis ulang abstrak yang jujur (klik untuk buka)</summary>
        <p><strong>SEBELUM (abstrak bermasalah):</strong> “Penelitian ini membuktikan program diet efektif menurunkan berat badan secara signifikan (p&lt;0,001). Dari 500 peserta, rata-rata turun 5 kg. Program ini direkomendasikan untuk semua puskesmas.”</p>
        <p><strong>Langkah 1 — Temukan yang hilang.</strong> Desain apa? (tidak disebut — ternyata <em>tanpa kelompok kontrol</em>). “Signifikan” = klinis atau statistik? (hanya p-value). 500 peserta dari berapa yang direkrut? (800 — <strong>300 drop-out hilang</strong> dari cerita). “Semua puskesmas” — populasinya siapa? (karyawan swasta muda, bukan populasi puskesmas).</p>
        <p><strong>Langkah 2 — Tulis ulang dengan struktur jujur.</strong> “<strong>Latar:</strong> … <strong>Metode:</strong> studi <em>pre-post tanpa kontrol</em>, n=500 dari 800 direkrut (drop-out 37,5%), karyawan usia 25–40 tahun, 12 minggu. <strong>Hasil:</strong> penurunan berat rata-rata 5,0 kg (95% CI 4,2–5,8; p&lt;0,001 vs baseline). Analisis sensitivitas: jika drop-out dianggap gagal, estimasi turun ke 3,1 kg. <strong>Keterbatasan:</strong> tanpa kontrol (regresi ke mean &amp; efek musiman tidak terkontrol); populasi tidak mewakili pengunjung puskesmas. <strong>Kesimpulan:</strong> program <em>berhubungan dengan</em> penurunan berat pada populasi studi; <strong>uji terkontrol</strong> dibutuhkan sebelum rekomendasi luas.”</p>
        <p><strong>Langkah 3 — Bandingkan.</strong> Versi jujur: lebih panjang, kurang heroik — tapi <strong>setiap klaim bisa dipertahankan</strong>. Versi lama: 4 klaim bermasalah dalam 3 kalimat (“membuktikan”, “signifikan” tanpa konteks, drop-out hilang, generalisasi liar).</p>
        <p><strong>Langkah 4 — Checklist abstrak (tempel di dinding):</strong> ① Desain disebut? ② n direkrut vs n dianalisis? ③ Efek absolut + CI (bukan cuma p)? ④ Populasi studi = populasi klaim? ⑤ Keterbatasan utama disebut? ⑥ Kata kausal (“membuktikan”, “menyebabkan”) hanya jika desain mendukung?</p>
        <p><strong>Pelajaran:</strong> abstrak adalah <strong>kontrak</strong> dengan pembaca — sebagian besar hanya membaca abstrak. Kontrak yang jujur membangun reputasi; kontrak yang menipu menghancurkannya <strong>sekali ketahuan</strong>.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Tulis abstrak <strong>terakhir</strong>, tapi <strong>uji pertama</strong>: berikan abstrakmu ke kolega tanpa konteks, minta ia menebak desain, n, dan keterbatasan. Jika ia salah tebak, abstrakmu menipu — tulis ulang.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk tiap grafik, tulis <strong>satu kalimat pesan</strong> sebagai judul (“Kematian turun setelah program, terutama di wilayah timur”) — bukan “Grafik kematian 2020–2026”. Judul adalah pesanmu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan <strong>jejak reproducible</strong>: kode + versi data + seed + lingkungan dalam repo. “Angka ini dari mana?” harus terjawab dalam 5 menit, kapan pun.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Akhiri setiap laporan dengan <strong>“apa yang belum kami tahu”</strong> (3 bullet). Ini bukan kelemahan — ini peta jalan riset berikutnya dan tameng dari overclaim.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Audit Laporan dengan Checklist Mini</h2>
      <p>Diberikan ringkasan laporan fiktif, nilai 8 item checklist (STROBE ringkas). Lihat berapa yang gagal — dan tulis perbaikannya.</p>
      <PyodideLab
        title="🔬 Lab 1: Audit Laporan dengan Checklist Mini"
        hint="Pola umum: laporan internal gagal di bias, missing data, dan generalisasi. Tiga ini = tiga pertanyaan yang harus kamu jawab SEBELUM presentasi."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Sumbu Menipu — Lihat Bedanya</h2>
      <p>Plot mental: dua “versi” grafik batang yang sama (sumbu dari 0 vs dari 40). Hitung rasio visual vs rasio data — kuantifikasi kebohongan.</p>
      <PyodideLab
        title="🔬 Lab 2: Sumbu Menipu — Lihat Bedanya"
        hint="Rasio visual = tinggi batang relatif pada sumbu yang dipakai. Inilah kenapa aturan “batang dari nol” ada: batang = perbandingan visual tinggi."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Komunikasi Krisis — Pelajaran dari Pandemi</h2>
      <p>Pandemi COVID-19 adalah <strong>ujian komunikasi sains terbesar</strong> Indonesia — dan rapornya campuran. Tiga pelajaran abadi untuk analis:</p>
      <p><strong>1. “Kami belum tahu” adalah kalimat yang kuat, bukan lemah.</strong> Awal pandemi: efektivitas masker kain, durasi imunitas, risiko anak — <strong>belum diketahui</strong>. Komunikator yang berkata “belum tahu, tapi ini yang kami lakukan sementara” <strong>dipercaya</strong> saat bukti berubah. Yang mengklaim pasti lalu <em>terpaksa</em> mengubah pernyataan <strong>kehilangan</strong> kepercayaan permanen. Aturan: <strong>bedakan “fakta” dari “rekomendasi sementara”</strong> — dan beri tanggal kedaluwarsa pada yang sementara (“rekomendasi ini dievaluasi tiap 2 minggu”).</p>
      <p><strong>2. Angka tanpa konteks = bahan bakar infodemi.</strong> “Efikasi 65%” (tanpa populasi &amp; endpoint) → hoaks “vaksin tidak berguna”. “10.000 kasus hari ini” (tanpa testing rate &amp; positivity) → panik atau apati. Setiap angka publik <strong>wajib</strong> ditemani: <strong>pembanding</strong> (“naik/turun dari kapan”), <strong>keterbatasan</strong> (“angka ini telat 2 minggu”), dan <strong>makna</strong> (“artinya: …”). Analis yang merilis angka telanjang <strong>ikut bertanggung jawab</strong> atas misinterpretasinya.</p>
      <p><strong>3. Kepercayaan dibangun sebelum krisis.</strong> Daerah dengan <strong>komunikasi rutin</strong> (dashboard mingguan, jumpa pers berkala) sebelum pandemi <strong>lebih dipercaya</strong> saat pandemi. Kepercayaan adalah <strong>tabungan</strong>: disetor lewat transparansi kecil yang konsisten, ditarik saat krisis. Analis Dinkes: <strong>mulai publikasikan data rutin yang jujur SEKARANG</strong> — sebelum krisis berikutnya datang.</p>
      <p><strong>Framework WHO untuk infodemi:</strong> dengarkan (social listening — apa yang ditanyakan publik?), pahami (mengapa mereka ragu?), libatkan (komunitas, tokoh agama, kader — <strong>bukan</strong> ceramah satu arah), dan <strong>isi kekosongan informasi</strong> sebelum hoaks mengisinya (<em>prebunking</em> &gt; debunking).</p>
      <div className="tip">
        <p><strong>💡 Intuisi krisis:</strong> dalam krisis, publik tidak butuh analis yang <strong>paling pintar</strong> — mereka butuh yang <strong>paling bisa dipercaya</strong>: konsisten, jujur soal ketidaktahuan, dan hadir <em>sebelum</em> ditanya. Reputasi ini dibangun <strong>bertahun-tahun</strong> sebelum krisis — mulai dari laporan rutinmu berikutnya.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Laporan studi observasional → STROBE</h3>
        <p><strong>Kondisi:</strong> Desain kohort/case-control/cross-sectional.</p>
        <p><strong>Kenapa:</strong> Standar jurnal; menjawab pertanyaan reviewer duluan.</p>
        <p><strong>Contoh nyata:</strong> Laporan faktor risiko TB ke jurnal nasional.</p>
      </div>
      <div className="decision-card">
        <h3>2. Laporan trial → CONSORT (+ diagram alir)</h3>
        <p><strong>Kondisi:</strong> RCT.</p>
        <p><strong>Kenapa:</strong> Transparansi alur peserta = kredibilitas.</p>
        <p><strong>Contoh nyata:</strong> Laporan uji vaksin DBD.</p>
      </div>
      <div className="decision-card">
        <h3>3. Laporan model prediksi → TRIPOD(+AI)</h3>
        <p><strong>Kondisi:</strong> Model klinis.</p>
        <p><strong>Kenapa:</strong> Populasi, prediktor, validasi, performa terdokumentasi.</p>
        <p><strong>Contoh nyata:</strong> Laporan model readmission (lihat HD20).</p>
      </div>
      <div className="decision-card">
        <h3>4. Dashboard operasional → Satu layar, satu keputusan</h3>
        <p><strong>Kondisi:</strong> Dipakai harian oleh klinisi/manajer.</p>
      <PlotlyChart
        data={hd19DashData}
        title="Contoh Visual Menipu: Sumbu Tidak dari Nol"
        layout={hd19DashDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Perhatikan sumbu Y: mulai dari 40, bukan 0. Bandingkan tinggi batang “kematian” vs “readmission”.</p>
        <p><strong>Interpretasi:</strong> Batang readmission terlihat 4x batang kematian — padahal 48 vs 42 (hanya 14% lebih tinggi). Inilah kebohongan visual dari cerita pembuka. Aturan: bar chart dari nol, atau jangan pakai batang.</p>
      </div>
        <p><strong>Kenapa:</strong> Adopsi = fungsi kegunaan, bukan keindahan.</p>
        <p><strong>Contoh nyata:</strong> Dashboard BOR + antrean IGD untuk direktur.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Pilih checklist sesuai desain (STROBE/CONSORT/TRIPOD).</li>
          <li>Judul grafik = satu kalimat pesan.</li>
          <li>Batang dari nol; ketidakpastian selalu tampil.</li>
          <li>Akhiri dengan “apa yang belum kami tahu”.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Laporan ke Gubernur: “Stunting Turun 5%!”</h2>
      <div className="callout">
        <p>Tim menyusun laporan: prevalensi stunting turun dari 30% ke 25% dalam 2 tahun. Slide penuh grafik 3D. Gubernur senang. Kamu diminta review 1 jam sebelum presentasi.</p>
      <p>Temuanmu: (1) definisi stunting berubah (standar WHO baru vs lama); (2) sampel survei tahun ke-2 hanya perkotaan; (3) interval kepercayaan tidak ditampilkan; (4) tidak ada pembanding tren nasional.</p>
        <p><strong>Pertanyaan:</strong> Apa yang kamu lakukan dalam 1 jam itu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tahan klaim “turun 5%”. (1) Samakan definisi dulu — hitung ulang tahun 1 dengan standar baru (atau sebaliknya); tanpa ini, perbandingan tidak valid. (2) Selaraskan sampel: bandingkan perkotaan-vs-perkotaan saja, atau beri bobot. (3) Tambahkan CI: 30% (28–32) vs 25% (22–28) — overlap = “belum tentu turun”. (4) Sederhanakan visual: satu grafik garis jujur &gt; 10 grafik 3D. Sampaikan ke Gubernur: “Angka pastinya belum bisa diklaim turun; yang bisa kami katakan...” + rencana pengukuran yang benar. Lebih baik menunda klaim 1 bulan daripada menarik kembali klaim 1 tahun. Inilah harga dan nilai kejujuran analis.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Untuk studi case-control yang dilaporkan ke jurnal, checklist yang tepat?"
        options={["CONSORT",
          "STROBE",
          "TRIPOD",
          "Tidak perlu"]}
        correct={1}
        explanation="Benar: STROBE = observasional. CONSORT untuk RCT, TRIPOD untuk model prediksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Diagram alir peserta (flow diagram) wajib dalam…"
        options={["Semua laporan",
          "CONSORT (RCT) — tapi praktik baik untuk semua desain",
          "Hanya dashboard",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: CONSORT mewajibkan. Prinsipnya universal: tunjukkan siapa hilang di tiap tahap."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Judul grafik yang baik?"
        options={["Grafik kematian 2020–2026",
          "“Kematian turun setelah program, terutama di timur” (satu kalimat pesan)",
          "Data",
          "Gambar 1"]}
        correct={1}
        explanation="Benar: judul = pesanmu. Pembaca yang hanya baca judul tetap dapat intinya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Bar chart dengan sumbu Y mulai dari 40% adalah…"
        options={["Kreatif",
          "Menipu secara visual — batang menyiratkan perbandingan dari nol",
          "Standar",
          "Wajib"]}
        correct={1}
        explanation="Benar: tinggi batang dibaca sebagai rasio. Dari nol, atau pakai line chart dengan anotasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengakhiri laporan dengan “apa yang belum kami tahu” berguna untuk…"
        options={["Terlihat lemah",
          "Kejujuran + peta riset lanjutan + tameng overclaim",
          "Memperpanjang laporan",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: profesional mengakui batas. Ini membangun kepercayaan jangka panjang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Reproducibility laporan berarti…"
        options={["PDF yang rapi",
          "“Angka ini dari mana?” terjawab dalam 5 menit: kode + versi data + seed + lingkungan",
          "Banyak lampiran",
          "Ditandatangani"]}
        correct={1}
        explanation="Benar: jejak yang bisa diulang. Tanpa ini, angka tidak bisa diaudit — dan yang tidak bisa diaudit tidak bisa dipercaya."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>STROBE</strong> (observasional), <strong>CONSORT</strong> (RCT), <strong>TRIPOD(+AI)</strong> (model) — pilih sesuai desain.</li>
          <li>Lima item yang paling sering gagal: desain eksplisit, flow peserta, definisi variabel, bias, missing data.</li>
          <li>Dashboard: <strong>satu layar, satu keputusan</strong>; desain bersama pengguna; waspadai alert fatigue.</li>
          <li>Komunikasi: pesan dulu, angka absolut, visual jujur, ketidakpastian eksplisit.</li>
          <li>Judul grafik = <strong>satu kalimat pesan</strong>. Batang dari nol.</li>
          <li>Akhiri dengan <strong>“apa yang belum kami tahu”</strong>.</li>
          <li>Reproducible: kode + versi data + seed + lingkungan.</li>
          <li>Kepercayaan = kejujuran tentang ketidakpastian dibagi kompleksitas penyajian.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd18-privasi-etika" className="btn btn-secondary btn-sm">← HD18</Link>
        <Link href="/learn/hd20-capstone-readmission" className="btn btn-primary btn-sm">HD20 →</Link>
      </div>
    </div>
  );
}
