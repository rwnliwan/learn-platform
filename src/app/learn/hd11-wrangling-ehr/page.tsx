"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd11WranglingEhrPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd11FenData = [{"x": ["Hanya kode E11", "E11 ATAU HbA1c", "E11 ATAU HbA1c ATAU obat", "+ eksklusi gestasional"], "y": [62, 78, 91, 94], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["62%", "78%", "91%", "94%"], "textposition": "outside"}];
  const hd11FenDataLayout = {"xaxis": {"title": "Definisi fenotipe"}, "yaxis": {"title": "PPV vs chart review (%)", "range": [0, 110]}, "showlegend": false};

  const lab1Code = "pasien = [\n    {'id':'P1','kode':['E11'],'hba1c':7.2,'obat':['metformin'],'hamil':False,'usia':55},\n    {'id':'P2','kode':['R73.09'],'hba1c':6.8,'obat':[],'hamil':False,'usia':50},\n    {'id':'P3','kode':['E11'],'hba1c':5.9,'obat':[],'hamil':False,'usia':45},\n    {'id':'P4','kode':['O24'],'hba1c':7.5,'obat':['insulin'],'hamil':True,'usia':30},\n    {'id':'P5','kode':[],'hba1c':8.1,'obat':[],'hamil':False,'usia':60},\n    {'id':'P6','kode':['E10'],'hba1c':9.0,'obat':['insulin'],'hamil':False,'usia':25},\n    {'id':'P7','kode':['E11'],'hba1c':None,'obat':['metformin'],'hamil':False,'usia':16},\n    {'id':'P8','kode':['I10'],'hba1c':5.5,'obat':[],'hamil':False,'usia':58},\n]\nTHR = 6.5\nfor p in pasien:\n    inklusi = ('E11' in p['kode'] or (p['hba1c'] or 0) >= THR\n                or 'metformin' in p['obat'])\n    eksklusi = p['hamil'] or p['usia'] < 18 or 'E10' in p['kode']\n    status = 'T2DM' if (inklusi and not eksklusi) else 'bukan'\n    alasan = []\n    if eksklusi: alasan.append('eksklusi')\n    print(f\"{p['id']}: {status:<6} {'/'.join(alasan) if alasan else 'memenuhi inklusi' if inklusi else 'tak memenuhi inklusi'}\")\nprint()\nprint('P4: hamil -> eksklusi (gestasional). P6: E10 -> tipe 1, bukan T2DM.')\nprint('P7: usia<18 -> eksklusi. P2: tanpa kode tapi HbA1c tinggi -> MASUK.')\nprint('Fenotipe menangkap yang kode-saja lewatkan (P2, P5).')";

  const lab2Code = "import statistics as st\n# (hari, nilai) — A diukur tiap jam saat krisis, B tiap bulan\nA = [(0, 180+i) for i in range(24)] + [(1, 150)]           # 25 titik\nB = [(0, 120), (30, 118), (60, 122)]                        # 3 titik\nmentah = [v for _, v in A+B]\nprint(f'rata-rata MENTAH semua titik : {st.mean(mentah):.1f} <- didominasi A')\n# agregasi: median per hari per pasien, lalu rata-rata per pasien\ndef agregasi(data):\n    harian = {}\n    for h, v in data:\n        harian.setdefault(h, []).append(v)\n    med_harian = [st.median(v) for v in harian.values()]\n    return st.mean(med_harian)\nprint(f'A agregat harian: {agregasi(A):.1f}')\nprint(f'B agregat harian: {agregasi(B):.1f}')\nprint(f'rata-rata per PASIEN  : {(agregasi(A)+agregasi(B))/2:.1f} <- suara setara')\nprint()\nprint('Tanpa agregasi, model belajar: banyak diukur = sakit.')\nprint('Itu benar secara statistik, menyesatkan secara klinis.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD11 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Fenotipe &amp; OMOP:<br />Menjinakkan Data EHR Mentah</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 17 Definisi “Diabetes”</a></li>
          <li><a href="#fenotipe">Fenotipe — Si Penerjemah Klinik ke Kode</a></li>
          <li><a href="#omop">OMOP CDM &amp; SQL Kohort</a></li>
          <li><a href="#harmonisasi">Harmonisasi Unit &amp; Waktu Tak Beraturan</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Aturan Fenotipe Diabetes</a></li>
          <li><a href="#lab2">🔬 Lab 2: Agregasi Time Series Tak Beraturan</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Query Kohort OMOP</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Waktu sebagai Musuh</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Harmonisasi 5 RS</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Validasi Fenotipe seperti Ilmuwan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menulis <strong>aturan fenotipe</strong> (definisi kohort komputabel) dari definisi klinis, dengan logika inklusi/eksklusi eksplisit.</li>
          <li>Menjelaskan struktur <strong>OMOP CDM</strong> (person, condition_occurrence, drug_exposure, measurement) dan menulis query kohort sederhana.</li>
          <li>Mengidentifikasi masalah <strong>harmonisasi unit</strong> dan <strong>time series tak beraturan</strong> pada data EHR.</li>
          <li>Mengevaluasi kualitas fenotipe via <strong>chart review / validasi silang</strong> sumber.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 17 Definisi “Diabetes”</h2>
      <div className="story">
        <p>Sebuah studi multi-RS ingin meneliti diabetes. RS A mendefinisikan: “ada kode E11”. RS B: “HbA1c ≥ 6,5%”. RS C: “ada resep metformin”. Hasil prevalensi: 4%, 11%, 7%. Studi yang sama, penyakit yang sama — tiga jawaban. Bukan karena populasinya beda, tapi karena <strong>definisinya</strong> beda.</p>
      <p>Di data EHR, “pasien diabetes” bukanlah fakta yang tinggal diambil — ia adalah <strong>konstruksi</strong> yang harus didefinisikan, ditulis sebagai aturan komputabel (fenotipe), dan divalidasi. Lesson ini tentang pekerjaan paling underrated dalam analitik kesehatan: mengubah catatan klinis menjadi variabel yang bisa dipercaya.</p>
      <p><strong>Twist-nya:</strong> ketiga RS itu <em>semuanya benar</em> menurut definisinya masing-masing — dan studi gabungannya tetap <em>salah total</em>. Inilah paradoks fenotipe: <strong>tidak ada definisi “pasien diabetes” yang netral</strong>; tiap definisi adalah <em>pilihan</em> yang menentukan siapa masuk dan siapa hilang (kode E11 menangkap yang terdiagnosis; HbA1c menangkap yang diperiksa; metformin menangkap yang diobati). Analis yang tidak menulis definisinya eksplisit sedang membiarkan <em>kebiasaan RS</em> menentukan <em>hasil risetnya</em> — tanpa ia sadari.</p>
      </div>

      <h2 id="fenotipe">Fenotipe — Si Penerjemah Klinik ke Kode</h2>
      <p><strong>Definisi.</strong> <strong>Fenotipe komputabel</strong>: aturan eksplisit yang mengubah data EHR mentah menjadi label klinis (“pasien diabetes” = kode E11 ATAU HbA1c ≥ 6,5% ATAU resep antidiabetik, dengan eksklusi diabetes gestasional).</p>
      <details className="worked">
        <summary>📐 Contoh: fenotipe “Diabetes Tipe 2”</summary>
        <p><strong>Inklusi</strong> (salah satu): kode ICD E11; HbA1c ≥ 6,5% (LOINC 4548-4); resep metformin/insulin (RxNorm).<br /><strong>Eksklusi:</strong> kode kehamilan (O24 = diabetes gestasional); usia &lt; 18.<br /><strong>Tanggal index:</strong> kejadian inklusi pertama.<br /><strong>Validasi:</strong> ambil 50 chart acak, minta dokter nilai — hitung PPV fenotipe (target ≥ 90%).<br />Tanpa langkah validasi, ini sekadar tebakan berlabel.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Fenotipe itu penerjemah antara dua bahasa: dokter berkata “pasien ini DM” (intuisi klinis), mesin butuh “WHERE ... AND NOT ...” (logika boolean). Penerjemah yang buruk = studi yang meneliti populasi yang salah.</p>
      <p><strong>Kapan memakai:</strong> Setiap kali mengambil kohort/outcome/kovariat dari EHR: definisikan tertulis, versikan, validasi — jangan query ad-hoc.</p>

      <PlotlyChart
        data={hd11FenData}
        title="PPV Fenotipe Diabetes vs Kompleksitas Aturan (ilustratif)"
        layout={hd11FenDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Empat definisi dari sederhana (kiri) ke lengkap (kanan). Tinggi batang = PPV saat divalidasi dokter via chart review.</p>
        <p><strong>Interpretasi:</strong> Hanya kode E11: PPV 62% — banyak salah label (upcoding, rule-out). Menambah lab + obat + eksklusi menaikkan ke 94%. Pelajaran mahal: <strong>definisi satu baris = label sampah</strong>; fenotipe yang baik adalah hasil iterasi validasi.</p>
      </div>

      <h2 id="omop">OMOP CDM &amp; SQL Kohort — Si Gudang Standar</h2>
      <p><strong>Definisi.</strong> <strong>OMOP CDM</strong> (OHDSI): skema standar untuk data observasional — tabel person, visit_occurrence, condition_occurrence, drug_exposure, measurement, procedure_occurrence, observation. Semua kode dimapping ke <strong>concept_id</strong> standar.</p>
      <details className="worked">
        <summary>📐 Contoh: query kohort T2DM di OMOP (konseptual)</summary>
        <p>1. <strong>person</strong>: usia ≥ 18 saat index.<br />2. <strong>condition_occurrence</strong>: concept_id diabetes tipe 2 (atau descendant-nya).<br />3. <strong>measurement</strong>: HbA1c ≥ 6,5.<br />4. <strong>drug_exposure</strong>: metformin.<br />Gabungkan dengan logika fenotipe di atas; index date = min(tanggal kejadian).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> OMOP itu gudang dengan rak berlabel standar: barang dari pemasok manapun (RS manapun) ditaruh di rak yang sama. Analis tidak perlu tahu gudang asal — cukup tahu nomor rak.</p>
      <p><strong>Kapan memakai:</strong> Riset multi-situs, studi yang harus reproducible lintas institusi, atau membangun pipeline kohort yang tahan lama.</p>
      <div className="code-header"><span className="code-lang">sql</span></div><pre className="codebox">-- Kohort T2DM sederhana di OMOP CDM
SELECT DISTINCT p.person_id,
       MIN(c.condition_start_date) AS index_date
FROM person p
JOIN condition_occurrence c ON c.person_id = p.person_id
JOIN concept_ancestor ca
  ON ca.descendant_concept_id = c.condition_concept_id
WHERE ca.ancestor_concept_id = 201826  -- T2DM (standar)
  AND p.year_of_birth &lt;= EXTRACT(YEAR FROM c.condition_start_date) - 18
GROUP BY p.person_id;</pre>

      <h2 id="harmonisasi">Harmonisasi Unit &amp; Waktu Tak Beraturan</h2>
      <p><strong>Definisi.</strong> EHR mencatat lab dalam <strong>unit berbeda</strong> (mg/dL vs mmol/L), nama lokal berbeda, dan <strong>waktu tak beraturan</strong> (pasien sakit diukur tiap jam, yang sehat tiap tahun) — pola kunjungan itu sendiri mengandung informasi (informed presence bias).</p>
      <Tex math={String.raw`x_{mmol/L} = \frac{x_{mg/dL}}{18} \quad \text{(glukosa)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`x_{mg/dL}`} />: nilai glukosa dalam mg/dL (umum di Indonesia)</li>
          <li><Tex math={String.raw`x_{mmol/L}`} />: nilai dalam mmol/L (standar internasional)</li>
          <li><Tex math={String.raw`18`} />: faktor konversi glukosa (beda tiap analit!)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Tanpa konversi, glukosa 180 mg/dL dan 10 mmol/L terlihat sebagai dua pasien berbeda padahal sama. Aturan: mapping ke LOINC + konversi ke unit standar + simpan unit asli untuk audit.</p>
      <details className="worked">
        <summary>📐 Contoh: jebakan waktu tak beraturan</summary>
        <p>Model memprediksi kematian memakai “jumlah pengukuran lab” sebagai fitur — akurasinya tinggi! Ternyata: pasien sekarat diukur tiap jam, yang stabil tiap bulan. Fitur itu bukan sinyal biologis, melainkan <strong>sinyal perhatian dokter</strong> (informed presence).<br />Solusi: agregasi per jendela waktu (rata-rata/median per hari), atau jadikan frekuensi sebagai kovariat eksplisit — jangan biarkan model “menemukan”nya diam-diam.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Data EHR itu seperti buku harian yang ditulis hanya saat ada drama: makin seru hidupmu, makin tebal bukunya. Analis naif mengira tebal = penting; analis waspada tahu tebal = sering sakit.</p>
      <p><strong>Kapan memakai:</strong> Setiap pipeline EHR: (1) mapping unit via LOINC, (2) agregasi jendela waktu, (3) perlakukan frekuensi kunjungan sebagai informasi, bukan noise.</p>
      <div className="callout callout-warning"><strong>Informed presence bias:</strong> frekuensi data ∼ tingkat keparahan. Model yang memakai “jumlah kunjungan” mentah sebagai fitur sedang memprediksi “siapa yang sering ke dokter”, bukan “siapa yang sakit” — kecuali itu memang pertanyaanmu.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Validasi Fenotipe seperti Ilmuwan</h2>
      <details className="worked">
        <summary>📐 Worked example: membangun &amp; memvalidasi fenotipe diabetes (klik untuk buka)</summary>
        <p>Target: definisi komputabel “pasien diabetes tipe 2” dari EHR satu RS (n=200.000).</p>
        <p><strong>Langkah 1 — Tulis aturan kandidat.</strong> Aturan A (longgar): ≥1 kode E11. Aturan B (ketat): ≥2 kode E11 <em>atau</em> HbA1c ≥6,5% <em>atau</em> resep antidiabetik — dengan pengecualian kode kehamilan (O24).</p>
        <p><strong>Langkah 2 — Validasi chart review (gold standard).</strong> Ambil 200 sampel acak, minta 2 dokter menilai manual buta terhadap aturan. Hasil Aturan A: PPV 72% (28% false positive — banyak “rule-out diabetes” yang dikode E11 untuk pemeriksaan). Aturan B: PPV 94%, sensitivitas 88%.</p>
        <p><strong>Langkah 3 — Hitung dampak ke prevalensi.</strong> Aturan A → 14% “diabetes”; Aturan B → 9,5%. Selisih 4,5 poin persen = <strong>9.000 pasien salah label</strong> dari 200.000. Setiap analisis downstream (model prediksi, studi asosiasi) mewarisi kesalahan ini.</p>
        <p><strong>Langkah 4 — Uji transportabilitas.</strong> Terapkan Aturan B di RS lain: PPV turun ke 81% — karena RS kedua jarang memesan HbA1c (pola praktik beda). <strong>Fenotipe tidak portable tanpa re-validasi.</strong> Dokumentasikan <em>konteks validasi</em> (RS, periode, versi EHR) bersama aturannya.</p>
        <p><strong>Langkah 5 — Publikasikan fenotipe.</strong> Simpan sebagai kode + definisi + metrik validasi (PPV, sensitivitas, n chart review) — praktik standar repositori seperti <strong>PheKB</strong>. Fenotipe tanpa metrik validasi = opini berbaju kode.</p>
        <p><strong>Pelajaran:</strong> 80% waktu proyek EHR habis di sini — dan 80% nilai proyek ditentukan di sini. Fenotipe yang divalidasi buruk membuat model terbaik sekalipun memprediksi <em>label yang salah</em> dengan sangat akurat.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — harmonisasi waktu lebih sulit dari harmonisasi kode:</strong> Menggabungkan dua RS bukan cuma soal “kode A = kode B”. Waktu pengukuran EHR <strong>tak beraturan dan informatif</strong>: pasien sakit diukur tiap jam, pasien stabil tiap bulan. Agregasi naif (“rata-rata gula darah per pasien”) memberi bobot berlebih pada periode krisis — rata-ratanya menggambarkan <em>saat-saat terburuk</em>, bukan kondisi tipikal. Solusi: agregasi sadar-waktu (rata-rata per episode, last-observation-carried-forward dengan batas kedaluwarsa, atau model yang memakai <em>jarak antar pengukuran</em> sebagai fitur). Aturan praktis: <strong>jika frekuensi pengukuran berkorelasi dengan keparahan, setiap agregasi sederhanamu bias</strong> — buktikan dulu tidak, baru rata-ratakan.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — model sepsis yang “terlalu bagus”:</strong> Mini-case lesson ini punya padanan nyata: model prediksi sepsis yang dilatih di satu RS Indonesia mencapai AUC 0,95 — lalu anjlok di RS lain. Investigasi: fitur terkuatnya adalah <strong>kode pesan antibiotik broad-spectrum</strong> — yang <em>diberikan setelah</em> dokter mencurigai sepsis. Model itu tidak memprediksi sepsis; ia <strong>membaca pikiran dokter</strong> (label leakage). Pelajaran untuk setiap proyek EHR Indonesia: sebelum merayakan metrik, lakukan <strong>“audit waktu”</strong> — untuk tiap fitur, tanyakan “apakah informasi ini <em>sudah ada</em> pada saat prediksi harus dibuat?” Jika tidak, buang — seberharga apapun fitur itu.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Waktu dalam EHR Adalah Musuh (yang Bisa Dijinakkan)</h2>
      <p>Data EHR bukan time series rapi — ia adalah <strong>jejak kaki di pasir</strong>: dalam di tempat yang sering diinjak (krisis), tipis di tempat yang jarang (sehat). Tiga sifat waktu EHR yang harus dihormati:</p>
      <p><strong>1. Ketidakberaturan yang informatif.</strong> Pasien diukur <em>karena</em> ada alasan klinis: gula darah dicek tiap jam saat krisis, tiap 6 bulan saat stabil. Maka <strong>frekuensi pengukuran = sinyal keparahan</strong>. Agregasi naif (“rata-rata gula darah”) memberi bobot berlebih pada krisis. Solusi: (a) agregasi per <em>episode klinis</em>, bukan per pengukuran; (b) jadikan <em>frekuensi/jarak pengukuran</em> sebagai fitur eksplisit; (c) model joint longitudinal-survival bila dropout terkait outcome.</p>
      <p><strong>2. Waktu tercatat ≠ waktu terjadi.</strong> Tanggal <em>input</em> diagnosis bisa berminggu setelah onset (back-entry saat visite berikutnya); tanggal <em>hasil lab keluar</em> ≠ tanggal <em>sampel diambil</em>. Untuk analisis “waktu ke kejadian”, salah 2 minggu bisa membalik urutan sebab-akibat (lihat immortal time bias, HD10). Selalu tanyakan: <strong>“tanggal ini menandai apa: kejadian, pencatatan, atau pelaporan?”</strong></p>
      <p><strong>3. Jendela observasi yang berlubang.</strong> Pasien pindah RS → “hilang” 2 tahun → muncul lagi. Periode kosong <strong>bukan</strong> “tidak sakit” — melainkan “tidak terpantau”. Menghitung “bebas kejadian 2 tahun” dari lubang observasi = <strong>menghitung ketiadaan data sebagai kesehatan</strong>. Solusi: batasi analisis pada <strong>observation period</strong> yang terverifikasi (ada encounter), dan perlakukan celah sebagai sensor — bukan sebagai bukti.</p>
      <div className="callout">
        <p><strong>Prinsip wrangling waktu:</strong> sebelum agregasi apapun, gambar <strong>timeline 5 pasien sampel</strong> (kapan encounter, kapan lab, kapan ada lubang). 15 menit menggambar menghindarkan 15 hari debugging agregasi yang salah.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kolom diagnosis di EHR bisa langsung dipakai sebagai label&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kode EHR dibuat untuk billing/alur kerja, bukan kebenaran (lihat HD2: upcoding, rule-out coding). Label butuh fenotipe: kombinasi kode + lab + obat + eksklusi + validasi chart review. Label mentah = label berisik = model berisik.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau datanya sudah di OMOP berarti sudah bersih&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> OMOP menstandarkan <em>struktur dan kosakata</em>, bukan kualitas isi. Kode yang salah tetap salah walau concept_id-nya standar; unit yang tidak dikonversi tetap campur. ETL ke OMOP adalah awal, bukan akhir, quality control.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak fitur dari EHR makin bagus untuk model&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Fitur EHR penuh dengan kebocoran masa depan (lihat HD12: leakage) dan artefak proses (informed presence). 20 fitur yang dipahami &gt; 2.000 fitur mentah. Kurasi &gt; kuantitas.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Query Kohort Diabetes di OMOP CDM</h2>
      <details className="worked">
        <summary>📐 Worked example: dari pertanyaan ke SQL OMOP (klik untuk buka)</summary>
        <p>Pertanyaan: “Pasien diabetes tipe 2 baru terdiagnosis 2022–2023, usia 30–70, tanpa riwayat kanker.” Database OMOP CDM.</p>
        <p><strong>Langkah 1 — Terjemahkan ke konsep OMOP.</strong> “Diabetes tipe 2” → concept_id 201826 (SNOMED, <em>dengan</em> seluruh descendant-nya via concept_ancestor — jangan query satu ID!). “Kanker” → konsep induk neoplasma ganas + descendants. “Baru terdiagnosis” → <strong>pertama kali</strong> muncul di condition_occurrence.</p>
        <p><strong>Langkah 2 — Tulis kerangka SQL.</strong> (a) Ambil semua condition_occurrence diabetes tipe 2 (join concept_ancestor untuk descendants). (b) Untuk tiap pasien, ambil <strong>tanggal pertama</strong> (index date). (c) Filter index date 2022–2023. (d) <strong>Washout</strong>: pastikan tidak ada diagnosis diabetes <em>sebelumnya</em> (365 hari observasi sebelum index — cek observation_period!). (e) Eksklusi: ada konsep kanker <em>kapan saja</em> sebelum index. (f) Usia di index 30–70 (dari person.birth_datetime).</p>
        <p><strong>Langkah 3 — Jebakan yang ditangkap OMOP.</strong> ① <strong>Observation period</strong>: pasien tanpa observation_period mencakup 2021 → “baru terdiagnosis 2022” mungkin <em>kasus lama yang baru tercatat</em> — syaratkan observasi kontinu ≥365 hari sebelum index. ② <strong>Visit context</strong>: diagnosis dari visit rawat jalan vs IGD vs klaim — bobot kepercayaannya beda; catat sumbernya. ③ <strong>Konsep “history of”</strong>: condition “history of diabetes” ≠ diabetes aktif — eksklusi/pisahkan.</p>
        <p><strong>Langkah 4 — Validasi output.</strong> n kohort = 12.400. Cek kewarasan: distribusi usia (puncak 50–60 ✓), rasio laki:perempuan (~1:1 ✓), % dengan HbA1c dalam 90 hari index (harusnya &gt;60% — jika 10%, fenotipemu menangkap yang salah). <strong>Kohort tanpa cek kewarasan = angka lotre.</strong></p>
        <p><strong>Langkah 5 — Dokumentasikan fenotipe.</strong> Simpan: definisi + SQL + versi vocabulary OMOP + tanggal eksekusi + n per langkah attrition (flowchart: 200.000 → … → 12.400). Attrition table ini <strong>wajib</strong> di publikasi — ia menunjukkan di mana pasien “hilang” dan apakah hilangnya masuk akal.</p>
        <p><strong>Pelajaran:</strong> 90% “query kohort” yang gagal bukan gagal karena SQL-nya salah — melainkan karena <strong>definisinya tidak operasional</strong>. Tulis definisi dulu (bahasa manusia), baru SQL.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> OMOP CDM adalah <strong>bahasa bersama</strong> riset observasional dunia (OHDSI network: ratusan database, satu query jalan di semua). Menguasainya = analisismu <strong>replikabel lintas-negara</strong> — kredensial yang langka di Asia Tenggara.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Versikan fenotipemu seperti kode: <strong>“T2DM v1.2 (2026-01-15)”</strong> dengan changelog. Studi yang tidak bisa menyebut versi definisinya tidak reproducible.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk tiap measurement penting, buat <strong>tabel mapping unit</strong>: nama lokal → LOINC → unit standar → faktor konversi → contoh nilai wajar (range check). Ini mencegah 180 vs 10 tercampur.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu plot <strong>distribusi frekuensi kunjungan</strong> sebelum modeling. Jika prediktor kuatmu berkorelasi dengan frekuensi, kamu mungkin memodelkan perilaku dokter, bukan biologi pasien.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Terapkan Aturan Fenotipe Diabetes</h2>
      <p>Diberikan 8 pasien sintetis (kode, HbA1c, obat, hamil). Terapkan aturan fenotipe T2DM dan lihat siapa yang masuk/keluar serta kenapa.</p>
      <PyodideLab
        title="🔬 Lab 1: Terapkan Aturan Fenotipe Diabetes"
        hint="Ubah threshold HbA1c 6.5 → 7.0. Berapa pasien yang keluar? Itulah sensitivitas definisimu terhadap satu angka — dokumentasikan!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Agregasi Time Series Tak Beraturan</h2>
      <p>Pasien A (sakit, diukur tiap jam) vs B (stabil, tiap bulan). Agregasikan ke jendela harian (median) dan bandingkan dengan rata-rata mentah yang bias ke A.</p>
      <PyodideLab
        title="🔬 Lab 2: Agregasi Time Series Tak Beraturan"
        hint="Lihat: rata-rata mentah didominasi pasien A (banyak titik). Agregasi harian + rata-rata per pasien memberi suara setara. Inilah informed presence bias secara kuantitatif."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Menggabungkan 5 RS Indonesia — Misi (Hampir) Mustahil</h2>
      <p>Studi multi-RS Indonesia: 5 RS, 5 sistem informasi berbeda, 5 “bahasa” diagnosis, 5 satuan lab. Inilah <strong>proyek harmonisasi nyata</strong> — dan anatominya:</p>
      <p><strong>Minggu 1–2: Inventarisasi (bukan coding!).</strong> Kunjungi tiap RS (fisik/virtual): apa SIMRS-nya? siapa mengisi diagnosis — dokter atau petugas coding? satuan HbA1c: % atau mmol/mol? “Gula darah puasa” vs “gula darah sewaktu” — dibedakan atau dicampur? <strong>80% masalah harmonisasi ditemukan di sini</strong>, bukan di SQL.</p>
      <p><strong>Minggu 3–4: Kamus harmonisasi.</strong> Buat tabel mapping: kode_lokal_RS_A → konsep standar; satuan → konversi (mg/dL ↔ mmol/L: bagi 18); definisi → samakan (“hipertensi” = ≥2 pengukuran ≥140/90, bukan 1). <strong>Keputusan sulit:</strong> RS yang tidak mencatat variabel kunci — <em>drop RS-nya</em> atau <em>drop variabelnya</em>? Tidak ada jawaban benar; dokumentasikan dan uji sensitivitas keduanya.</p>
      <p><strong>Minggu 5–6: Validasi silang.</strong> Setelah harmonisasi: bandingkan distribusi tiap variabel antar-RS. RS dengan rata-rata HbA1c 2 poin lebih tinggi — <strong>populasi beda atau satuan salah?</strong> Investigasi: ternyata satu RS memakai metode lab berbeda (bias sistematis +0,5%). Koreksi atau stratifikasi.</p>
      <p><strong>Pelajaran abadi:</strong> harmonisasi multi-sumber <strong>bukan</strong> masalah teknis — ia masalah <strong>antropologi</strong>: memahami <em>kebiasaan manusia</em> di tiap RS. Analis yang “hanya” bisa SQL akan gagal; analis yang mau menelepon petugas rekam medis akan berhasil. <strong>Angkat teleponmu.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi karier:</strong> “Memimpin harmonisasi data multi-faskes” adalah pengalaman yang <strong>sangat langka</strong> di Indonesia — dan justru yang paling dibutuhkan era SATUSEHAT. Dokumentasikan proyekmu sebagai case study: sumber, masalah per sumber, keputusan, validasi. Satu case study ini bernilai lebih dari 3 sertifikasi.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh label dari EHR → Tulis fenotipe + validasi</h3>
        <p><strong>Kondisi:</strong> Kohort, outcome, atau kovariat dari data operasional.</p>
        <p><strong>Kenapa:</strong> Kode mentah tidak cukup; butuh aturan multi-sumber + chart review.</p>
        <p><strong>Contoh nyata:</strong> Fenotipe T2DM: E11 ATAU HbA1c≥6,5 ATAU obat, eksklusi gestasional.</p>
      </div>
      <div className="decision-card">
        <h3>2. Multi-situs / reproducible → OMOP CDM</h3>
        <p><strong>Kondisi:</strong> Banyak sumber atau studi harus bisa diulang orang lain.</p>
        <p><strong>Kenapa:</strong> Skema + kosakata standar; query portabel (jaringan OHDSI).</p>
        <p><strong>Contoh nyata:</strong> Studi efek obat lintas 5 RS dengan satu query.</p>
      </div>
      <div className="decision-card">
        <h3>3. Lab/obat nama lokal berantakan → Mapping LOINC/RxNorm + konversi unit</h3>
        <p><strong>Kondisi:</strong> Nilai sama, nama/satuan beda antar sumber.</p>
        <p><strong>Kenapa:</strong> Tanpa ini, 180 mg/dL dan 10 mmol/L jadi dua pasien berbeda.</p>
        <p><strong>Contoh nyata:</strong> Harmonisasi glukosa 3 RS sebelum analisis.</p>
      </div>
      <div className="decision-card">
        <h3>4. Pengukuran tak beraturan → Agregasi jendela + perlakukan frekuensi</h3>
        <p><strong>Kondisi:</strong> Frekuensi ukur terkait keparahan (hampir selalu).</p>
        <p><strong>Kenapa:</strong> Cegah informed presence bias; jadikan frekuensi kovariat eksplisit bila informatif.</p>
        <p><strong>Contoh nyata:</strong> Median harian untuk data ICU; frekuensi kunjungan sebagai fitur terpisah.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Definisi kohort = fenotipe tertulis + berversi.</li>
          <li>Validasi dengan chart review (target PPV ≥90%).</li>
          <li>Mapping unit via LOINC; simpan unit asli.</li>
          <li>Frekuensi kunjungan = informasi, bukan noise.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Model Prediksi Sepsis yang “Terlalu Bagus”</h2>
      <div className="callout">
        <p>Tim RS membangun model prediksi sepsis dari EHR: <strong>AUC 0,97</strong>. Semua antusias. Kamu diminta review sebelum deploy.</p>
      <p>Temuanmu: fitur terkuat adalah <strong>“kultur darah dipesan”</strong> dan <strong>“antibiotik spektrum luas diberikan”</strong> — keduanya terjadi <em>setelah</em> dokter mencurigai sepsis. Label sepsis diambil dari kode ICD saat pulang.</p>
        <p><strong>Pertanyaan:</strong> Apa yang salah dan bagaimana memperbaikinya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Leakage temporal + label berisik. (1) Fitur “kultur darah” dan “antibiotik” adalah <em>akibat</em> kecurigaan klinis — model memprediksi masa lalu, bukan masa depan (target leakage). AUC 0,97 adalah ilusi. (2) Label ICD sepsis tidak andal (lihat HD2: coding untuk billing; definisi Sepsis-3 butuh SOFA). Perbaikan: definisikan prediction time yang jelas (mis. 6 jam sebelum kecurigaan), hanya pakai fitur yang tersedia <em>sebelum</em> titik itu, label via kriteria Sepsis-3 terfenotipe (bukan ICD mentah), dan validasi prospektif silent-mode. Pelajaran: AUC tinggi pada data EHR lebih sering berarti kebocoran daripada kecerdasan.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fenotipe komputabel adalah…"
        options={["Kode ICD mentah",
          "Aturan eksplisit multi-sumber (kode+lab+obat+eksklusi) yang terv alidasi untuk mendefinisikan kondisi klinis",
          "Diagnosis dokter",
          "Nama kolom database"]}
        correct={1}
        explanation="Benar: fenotipe = terjemahan klinik → logika boolean yang divalidasi. Kode mentah saja PPV-nya rendah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Glukosa 180 mg/dL vs 10 mmol/L tanpa konversi unit akan…"
        options={["Baik-baik saja",
          "Dianggap dua nilai berbeda padahal sama — merusak analisis",
          "Otomatis terkonversi",
          "Hanya masalah tampilan"]}
        correct={1}
        explanation="Benar: 180/18 = 10. Harmonisasi unit via LOINC adalah langkah wajib, bukan opsional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Informed presence bias artinya…"
        options={["Dokter selalu benar",
          "Frekuensi pengukuran terkait keparahan — data lebih tebal untuk yang lebih sakit",
          "Pasien informed consent",
          "Data selalu lengkap"]}
        correct={1}
        explanation="Benar: buku harian hanya ditulis saat ada drama. Model yang memakai frekuensi mentah memodelkan perilaku dokter."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk studi multi-RS yang reproducible, pilih…"
        options={["Tiap RS pakai skema sendiri",
          "OMOP CDM",
          "Kirim screenshot",
          "Gabung manual di Excel"]}
        correct={1}
        explanation="Benar: OMOP = skema + kosakata standar → satu query jalan di semua situs."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Validasi fenotipe yang tepat?"
        options={["Percaya saja",
          "Chart review sampel acak oleh klinisi, hitung PPV",
          "Tanya vendor EHR",
          "Lihat jumlah kode"]}
        correct={1}
        explanation="Benar: kebenaran klinis hanya bisa dinilai manusia yang membaca chart. Target PPV ≥ 90%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Fitur “antibiotik diberikan” untuk prediksi sepsis SEBELUM kecurigaan klinis adalah…"
        options={["Fitur terbaik",
          "Target leakage — terjadi setelah kecurigaan, memprediksi masa lalu",
          "Wajib dipakai",
          "Tidak masalah"]}
        correct={1}
        explanation="Benar: fitur yang merupakan akibat dari yang diprediksi = kebocoran. AUC 0,97-nya ilusi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Fenotipe</strong>: aturan inklusi/eksklusi multi-sumber, berversi, tervalidasi chart review.</li>
          <li>Kode mentah saja PPV rendah — kombinasikan kode + lab + obat.</li>
          <li><strong>OMOP CDM</strong>: skema standar untuk riset multi-situs yang reproducible.</li>
          <li>Harmonisasi: <strong>LOINC/RxNorm + konversi unit</strong>; simpan unit asli.</li>
          <li><strong>Informed presence bias</strong>: frekuensi ukur ∼ keparahan — agregasi + perlakukan eksplisit.</li>
          <li>Waspadai <strong>target leakage</strong>: fitur dari masa depan relatif terhadap prediction time.</li>
          <li>Kurasi &gt; kuantitas: 20 fitur dipahami &gt; 2.000 fitur mentah.</li>
          <li>Lesson ini adalah “pekerjaan kotor” yang menentukan kualitas semua lesson pemodelan (HD12, HD20).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd10-kausal-observasional" className="btn btn-secondary btn-sm">← HD10</Link>
        <Link href="/learn/hd12-prediksi-klinis" className="btn btn-primary btn-sm">HD12 →</Link>
      </div>
    </div>
  );
}
