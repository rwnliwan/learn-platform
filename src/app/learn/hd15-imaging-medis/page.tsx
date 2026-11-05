"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd15ImagingMedisPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd15ShortcutData = [{"x": ["Data asli", "Sudut di-crop", "RS lain (eksternal)"], "y": [0.95, 0.62, 0.58], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#e8a838"]}, "text": ["0,95", "0,62", "0,58"], "textposition": "outside"}];
  const hd15ShortcutDataLayout = {"xaxis": {"title": "Kondisi evaluasi"}, "yaxis": {"title": "AUC", "range": [0.4, 1.0]}, "showlegend": false};

  const lab1Code = "# simulasi tag DICOM: (patient_id, modality, manufacturer, label)\nimport random\nrandom.seed(2)\ndata = []\nfor i in range(1000):\n    sakit = random.random() < 0.3\n    # mesin A dipakai di RS wabah -> korelasi mesin-label (shortcut!)\n    mesin = 'A' if (sakit and random.random() < 0.8) or (not sakit and random.random() < 0.2) else 'B'\n    data.append((f'P{i:04d}', 'DX', mesin, sakit))\n# PII check\nprint('Tag (0010,0010) PatientName: ADA -> wajib anonimisasi sebelum riset!')\nprint()\n# distribusi label per mesin\nfor m in ['A', 'B']:\n    sub = [d for d in data if d[2] == m]\n    prev = sum(d[3] for d in sub)/len(sub)\n    print(f'mesin {m}: n={len(sub)}, prevalensi positif={prev:.0%}')\nprint()\nprint('Model bisa mencapai akurasi tinggi HANYA dengan menebak dari mesin.')\nprint('-> Stratifikasi evaluasi per mesin = wajib.')";

  const lab2Code = "TP, FN, TN, FP = 180, 20, 750, 50  # dari uji internal\nsens = TP/(TP+FN); spes = TN/(TN+FP)\nprint(f'Sensitivitas = {sens:.0%}, Spesifisitas = {spes:.0%}')\nfor nama, prev in [('skrining', 0.02), ('rujukan', 0.30)]:\n    ppv = (sens*prev)/(sens*prev + (1-spes)*(1-prev))\n    npv = (spes*(1-prev))/(spes*(1-prev) + (1-sens)*prev)\n    print(f'{nama:<8} (prev {prev:.0%}): PPV={ppv:.0%}  NPV={npv:.0%}')\nprint()\nprint('Skrining: PPV rendah -> butuh konfirmasi radiolog (second reader).')\nprint('Rujukan: PPV baik -> bisa untuk triase prioritas.')\nprint('Model yang sama, peran klinis beda. Konteks menentukan.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD15 &mdash; Health Data Scientist</span>
        <h1 className="display-title">DICOM &amp; Klasifikasi Citra:<br />Melihat Seperti Radiolog</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Foto yang Bicara Dua Bahasa</a></li>
          <li><a href="#dicom">DICOM — Si Amplop Citra Medis</a></li>
          <li><a href="#klasifikasi">Klasifikasi Citra: CNN untuk Diagnosis</a></li>
          <li><a href="#evaluasi">Evaluasi &amp; Batasan Klinis</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Baca Metadata DICOM (Simulasi)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Confusion Matrix &amp; Sens-Spes Citra</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Confusion Matrix → Deploy</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Data-Centric AI</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Teleradiologi 3T</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Mengaudit “Apa yang Dilihat Model”</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan struktur <strong>DICOM</strong> (piksel + metadata) dan mengapa metadata sama pentingnya dengan gambar.</li>
          <li>Menjelaskan cara kerja <strong>CNN untuk klasifikasi citra</strong> secara konseptual (konvolusi, pooling, transfer learning).</li>
          <li>Mengevaluasi model citra dengan <strong>metrik klinis</strong> (sens/spes, bukan cuma akurasi) + validasi eksternal.</li>
          <li>Mengidentifikasi jebakan khas: <strong>shortcut learning, label berisik, spectrum bias</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Foto yang Bicara Dua Bahasa</h2>
      <div className="story">
        <p>Dua foto rontgen dada terlihat identik bagi mata awam. Radiolog membaca yang pertama: “Infiltrat di paru kanan bawah — curiga pneumonia.” Yang kedua: normal. Bedanya? Pola keabuan halus yang butuh 10 tahun latihan untuk dilihat. Kini AI bisa dilatih melihat pola yang sama — dalam seminggu, dari 100.000 contoh.</p>
      <p>Tapi ada kisah horornya: model pendeteksi COVID dari rontgen yang ternyata hanya membaca <strong>merek mesin rontgen</strong> di sudut gambar (shortcut learning). Akurasinya 95% — kepintarannya nol. Lesson ini: cara kerja citra medis untuk analis, plus cara tidak tertipu oleh AI yang “pintar”.</p>
      <p><strong>Twist-nya:</strong> AI itu tidak berbohong soal akurasinya — 95% memang 95%. Yang berbohong adalah <strong>asumsi kita tentang <em>apa</em> yang dipelajarinya</strong>. Model tidak belajar “pola COVID di paru”; ia belajar “foto dari RS rujukan COVID (mesin merek X) vs foto kontrol (mesin merek Y)” — <strong>jalan pintas</strong> yang valid di data latih, bunuh diri di dunia nyata. Akurasi tinggi + pemahaman nol = bom waktu klinis. Lesson ini memberimu detektor bomnya: cara mengaudit <em>apa</em> yang sebenarnya dilihat model.</p>
      </div>

      <h2 id="dicom">DICOM — Si Amplop Citra Medis</h2>
      <p><strong>Definisi.</strong> <strong>DICOM</strong>: standar file citra medis — berisi <strong>piksel</strong> (data gambar) + <strong>metadata</strong> (pasien, modalitas, parameter akuisisi, rumah sakit) dalam tag terstandar.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca tag DICOM</summary>
        <p>Tag (0010,0010) = nama pasien; (0008,0060) = modalitas (CR/DX/MG); (0018,1164) = parameter akuisisi.<br />Analisis: kelompokkan performa model per <strong>modalitas dan merek mesin</strong> (dari metadata).<br />Jika model bagus di mesin A tapi jeblok di mesin B — kamu menemukan shortcut learning sebelum deploy, bukan sesudah.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> DICOM itu amplop pos untuk foto medis: fotonya (piksel) penting, tapi perangko dan alamatnya (metadata: modalitas, tanggal, mesin) sama penting — tanpanya foto tidak bisa diarsipkan, dicari, atau dipercaya.</p>
      <p><strong>Kapan memakai:</strong> Setiap pipeline imaging: baca metadata untuk stratifikasi (beda mesin = beda distribusi!), anonimisasi sebelum riset, dan QC.</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">Tag DICOM        | Isi contoh
-----------------+---------------------------
(0010,0010)      | PatientName (ANONIMISASI!)
(0008,0060)      | Modality = DX (rontgen)
(0008,0070)      | Manufacturer = Merek-X
(0028,0010/11)   | Rows/Columns = 2048x2048
(0028,0103)      | PixelRepresentation</pre>
      <div className="callout callout-warning"><strong>Metadata = PII!</strong> DICOM menyimpan nama, tanggal lahir, bahkan kadang wajah (foto). Anonimisasi DICOM harus membersihkan tag + <em>burned-in annotation</em> (teks terbakar di piksel).</div>

      <h2 id="klasifikasi">Klasifikasi Citra: CNN untuk Diagnosis — Si Mata Bertingkat</h2>
      <p><strong>Definisi.</strong> <strong>CNN</strong>: jaringan yang belajar fitur visual bertingkat — tepi → tekstur → pola → diagnosis. <strong>Transfer learning</strong>: pakai model pra-latih (ImageNet) lalu fine-tune ke citra medis — standar karena data medis berlabel mahal.</p>
      <Tex math={String.raw`\text{Konvolusi: } (I * K)(x,y) = \sum_{i,j} I(x+i, y+j) \cdot K(i,j)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`I`} />: citra input (matriks piksel)</li>
          <li><Tex math={String.raw`K`} />: kernel/filter kecil yang dipelajari (pendeteksi pola)</li>
          <li><Tex math={String.raw`(I*K)(x,y)`} />: peta fitur: seberapa cocok pola K di posisi (x,y)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Kernel adalah “kaca pembesar pola” yang digeser ke seluruh gambar. Lapisan awal belajar tepi/garis; lapisan dalam mengkombinasikannya menjadi “infiltrat” atau “nodul”. Inilah kenapa CNN cocok untuk citra: ia memanfaatkan struktur spasial.</p>
      <details className="worked">
        <summary>📐 Contoh: pipeline klasifikasi pneumonia</summary>
        <p>1. Kumpulkan 50.000 rontgen dengan label radiolog (bukan ICD mentah!).<br />2. Preprocessing: resize, normalisasi, augmentasi (rotasi/crop).<br />3. Transfer learning: ResNet pra-latih → fine-tune.<br />4. Split <strong>per pasien &amp; per RS</strong> (bukan per gambar!) — cegah leakage.<br />5. Evaluasi: sens/spes + validasi RS lain + cek shortcut (heatmap Grad-CAM: apakah model melihat paru atau sudut gambar?).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> CNN itu radiolog magang super: ia belajar dari contoh, bukan dari buku teks. Beri 100.000 contoh bagus → hebat. Beri contoh berlabel ngawur → ia belajar ngawur dengan percaya diri.</p>
      <p><strong>Kapan memakai:</strong> Tugas citra dengan pola visual konsisten: skrining, triase, second reader. Bukan pengganti radiolog untuk kasus kompleks — melainkan penguat.</p>

      <h2 id="evaluasi">Evaluasi &amp; Batasan Klinis — Si Penguji Ketat</h2>
      <p><strong>Definisi.</strong> Model citra dievaluasi dengan <strong>metrik klinis</strong> (sens/spes/PPV pada prevalensi target — HD9), <strong>validasi eksternal</strong> (RS/mesin lain), dan <strong>uji shortcut</strong> (apakah keputusan berbasis anatomi?).</p>
      <details className="worked">
        <summary>📐 Contoh: membongkar shortcut learning</summary>
        <p>Model COVID-rontgen AUC 0,95. Uji: (1) crop sudut gambar (hilangkan teks mesin) → AUC anjlok ke 0,62. (2) Grad-CAM: heatmap menyala di <strong>sudut kiri atas</strong> (tempat merek mesin), bukan di paru.<br />Vonis: model mendeteksi <em>RS asal</em> (yang korelasi dengan COVID), bukan COVID. Perbaikan: harmonisasi/hilangkan artefak, training multi-situs, evaluasi per mesin.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Evaluator model citra itu seperti penguji SIM yang curiga: tidak cukup “bisa jalan lurus” (akurasi) — harus bisa di jalan becek (RS lain), malam hari (mesin beda), tanpa mencontek rambu (shortcut).</p>
      <p><strong>Kapan memakai:</strong> Sebelum klaim “siap klinis” apapun: eksternal + analisis kegagalan per subgrup + heatmap interpretasi.</p>

      <PlotlyChart
        data={hd15ShortcutData}
        title="AUC Model “COVID”: Runtuh Saat Artefak Dihilangkan"
        layout={hd15ShortcutDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga kondisi evaluasi model yang sama. Biru = kondisi training; kuning = kondisi yang menghilangkan jalan pintas.</p>
        <p><strong>Interpretasi:</strong> AUC 0,95 → 0,62 begitu teks mesin di-crop, dan 0,58 di RS lain. Model tidak belajar COVID — ia belajar “rontgen dari RS wabah vs RS biasa”. Inilah kenapa evaluasi model citra WAJIB di luar distribusi training.</p>
      </div>

      <h2 id="pendalaman">🔍 Pendalaman: Mengaudit “Apa yang Dilihat Model”</h2>
      <details className="worked">
        <summary>📐 Worked example: membongkar shortcut learning (klik untuk buka)</summary>
        <p>Model CNN pendeteksi pneumonia dari rontgen dada: akurasi validasi <strong>95%</strong>, AUC 0,97. Siap deploy?</p>
        <p><strong>Langkah 1 — Uji stres distribusi.</strong> Uji pada rontgen dari <strong>RS lain</strong> (mesin beda, populasi beda): akurasi jatuh ke <strong>71%</strong>. Drop 24 poin = sirene shortcut learning.</p>
        <p><strong>Langkah 2 — Visualisasi atensi (Grad-CAM).</strong> Heatmap menunjukkan model fokus pada <strong>sudut kiri atas</strong> — lokasi penanda logam RS dan teks mesin — bukan pada lapangan paru. Model belajar “logo RS rujukan pneumonia”, bukan pneumonia.</p>
        <p><strong>Langkah 3 — Uji ablasi.</strong> Tutupi sudut gambar (crop hanya area paru): akurasi validasi turun ke 78% — konfirmasi bahwa 17 poin akurasi berasal dari artefak, bukan patologi.</p>
        <p><strong>Langkah 4 — Perbaiki dengan benar.</strong> (a) Preprocessing: crop/mask area non-anatomi; (b) latih multi-RS sejak awal (domain generalization); (c) validasi eksternal <em>wajib</em> sebelum klaim klinis. Setelah perbaikan: akurasi validasi 86%, eksternal 83% — <strong>lebih rendah tapi jujur</strong>.</p>
        <p><strong>Langkah 5 — Evaluasi klinis, bukan statistik.</strong> Pada prevalensi pneumonia IGD 15%: PPV model = ~60% — 4 dari 10 “positif” palsu. Keputusan deploy butuh analisis <em>alur kerja</em>: apakah hasil model mengubah tindakan dokter, atau hanya menambah alert yang diabaikan?</p>
        <p><strong>Pelajaran:</strong> untuk AI citra medis, pertanyaan pertama bukan “berapa akurasinya” melainkan <strong>“tunjukkan padaku apa yang dilihatnya”</strong> — Grad-CAM sebelum deployment, selalu.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — DICOM adalah separuh diagnosis:</strong> Analis citra yang hanya memakai piksel membuang separuh informasi: metadata DICOM (usia, posisi pasien, parameter eksposi, merek mesin) sering <strong>lebih prediktif</strong> daripada pikselnya — dan itulah jebakannya (lihat shortcut di atas). Praktik yang benar: (1) catat metadata sebagai kovariat yang harus dikontrol/diuji; (2) normalisasi intensitas per protokol (windowing CT paru ≠ windowing abdomen); (3) waspadai <em>label noise</em> — “ground truth” radiologi antar-dokter hanya sepakat ~80% untuk kasus sulit, jadi model “95% akurat” terhadap label berisik sedang <strong>menghafal ketidaksepakatan dokter</strong>, bukan kebenaran.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — AI retinopati yang anjlok di puskesmas:</strong> Mini-case lesson ini adalah pola nyata program skrining AI di Indonesia: model dilatih pada foto fundus <strong>kamera mahal di RS tersier</strong> (terang, fokus, pasien kooperatif), lalu dipakai di puskesmas dengan <strong>kamera portabel murah</strong> (gelap, blur, katarak pasien tidak diskrining keluar). Akurasi 97% → 70%. Solusinya bukan “model lebih besar”, melainkan <strong>latih pada data deployment</strong> (foto puskesmas asli, termasuk yang jelek) + pipeline <em>quality gate</em> (“foto tidak layak → minta ulang”, bukan “tebak saja”). Pelajaran umum: <strong>kualitas input di titik layanan menentukan batas atas AI</strong> — audit kamera dulu, baru audit model.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Data-Centric AI — Modelnya Sudah Cukup, Datanya Belum</h2>
      <p>Mayoritas kegagalan AI citra medis bukan karena arsitektur kurang canggih — melainkan karena <strong>datanya</strong>. Tiga masalah data yang menentukan:</p>
      <p><strong>1. Label noise: “ground truth” yang berdebat.</strong> Diagnosis radiologi bukan fakta alam — dua radiolog sepakat hanya ~80% untuk kasus sulit (bahkan untuk TB!). Melatih model hingga “100% akurasi training” = <strong>menghafal ketidaksepakatan manusia</strong>. Praktik benar: (a) label <strong>konsensus 2–3 pembaca</strong> untuk data latih inti; (b) ukur <em>inter-reader agreement</em> (kappa) dan jadikan <strong>batas atas realistis</strong> performa (“model 88% vs kesepakatan dokter 85% = sudah setara manusia”); (c) untuk kasus ambigu, latih dengan <strong>label lunak</strong> (probabilitas, bukan 0/1).</p>
      <p><strong>2. Augmentasi yang melanggar fisika.</strong> Flip horizontal pada rontgen dada = <strong>memindahkan jantung ke kanan</strong> (dekstrokardia palsu!) — model belajar anatomi yang salah. Rotasi 90° pada foto fundus = orientasi diskus optikus kacau. Aturan: augmentasi citra medis harus <strong>mempertahankan plausibilitas klinis</strong> — brightness/contrast/noise OK; transformasi geometri ekstrem TIDAK. Konsultasikan ke radiolog sebelum mengaktifkan augmentasi apapun.</p>
      <p><strong>3. Spektrum bias: latih di yang sulit, uji di yang mudah (atau sebaliknya).</strong> Model dilatih pada kasus <em>rujukan tersier</em> (jelas sakit/jelas sehat — spektrum ekstrem) lalu dipakai di <em>skrining puskesmas</em> (banyak borderline) → performa anjlok. <strong>Distribusi keparahan</strong> data latih harus mencerminkan <strong>populasi deployment</strong> — bukan populasi yang “gampang dilabeli”.</p>
      <div className="callout">
        <p><strong>Prinsip data-centric:</strong> sebelum tuning model 1 jam, habiskan <strong>10 jam</strong> untuk: audit label (konsensus? kappa?), audit spektrum (cocok populasi target?), audit artefak (logo? marker?). <strong>80% “keajaiban” AI medis adalah kebersihan data</strong> — 20% sisanya arsitektur.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Akurasi 95% pada citra = siap dipakai klinis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Akurasi didominasi kelas mayoritas; yang penting sens/spes pada prevalensi target + validasi eksternal + uji shortcut. Model 95% yang membaca merek mesin = 0% berguna. Klaim klinis butuh bukti klinis, bukan leaderboard.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin dalam network-nya makin bagus untuk citra medis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Data medis kecil → network raksasa overfit. Transfer learning + augmentasi + regularisasi mengalahkan kedalaman mentah. Arsitektur bukan sihir; data dan evaluasi yang menentukan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Heatmap (Grad-CAM) membuktikan model melihat yang benar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Heatmap itu penjelasan pasca-hoc yang bisa menipu: ia menunjukkan <em>korelasi</em> area dengan keputusan, bukan <em>kausalitas</em>. Heatmap di paru tidak menjamin tidak ada shortcut lain. Ia alat investigasi, bukan sertifikat.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Dari Confusion Matrix ke Keputusan Deploy</h2>
      <details className="worked">
        <summary>📐 Worked example: AI TB dari rontgen — deploy atau tidak? (klik untuk buka)</summary>
        <p>Model deteksi TB dari foto rontgen dada, diuji pada 10.000 pasien puskesmas. Prevalensi TB 5% (500 kasus). Confusion matrix pada threshold 0,5: TP=440, FN=60, FP=480, TN=9.020.</p>
        <p><strong>Langkah 1 — Metrik dasar.</strong> Sensitivitas = 440/500 = <strong>88%</strong>. Spesifisitas = 9.020/9.500 = <strong>95%</strong>. Akurasi = 9.460/10.000 = <strong>94,6%</strong> — terlihat hebat.</p>
        <p><strong>Langkah 2 — PPV (yang penting).</strong> PPV = 440/(440+480) = <strong>47,8%</strong>. Dari 920 “positif AI”, <strong>lebih dari separuh palsu</strong> — 480 orang dirujuk untuk TCM/sputum yang tidak perlu. NPV = 9.020/9.080 = 99,3% — yang “negatif AI” hampir pasti benar negatif.</p>
        <p><strong>Langkah 3 — Terjemahkan ke operasional.</strong> Kapasitas TCM puskesmas: 50 tes/hari. AI menghasilkan 920 rujukan dari 10.000 skrining — <strong>18 hari kerja</strong> hanya untuk menindaklanjuti, separuhnya sia-sia. Apakah sistem kuat? Jika tidak, naikkan threshold (korbankan sensitivitas) atau batasi ke <strong>populasi berisiko</strong> (kontak erat, HIV+) di mana prevalensi 20% → PPV naik ke ~82%.</p>
        <p><strong>Langkah 4 — Bandingkan dengan status quo.</strong> Tanpa AI: dokter puskesmas merujuk berdasarkan gejala — sensitivitas ~70%, spesifisitas ~80%. AI (88%/95%) <strong>lebih baik di keduanya</strong> — tapi hanya berguna jika <em>alur rujukannya</em> siap menampung. Teknologi tanpa kapasitas = <strong>antrean</strong>.</p>
        <p><strong>Langkah 5 — Keputusan.</strong> Deploy <strong>terbatas</strong>: (a) hanya untuk skrining kelompok berisiko (PPV &gt;80%), (b) threshold disetel ulang per kapasitas TCM, (c) semua “positif AI” dikonfirmasi dokter + TCM (AI = <em>triage</em>, bukan diagnosis), (d) monitor PPV bulanan — jika turun, investigasi drift.</p>
        <p><strong>Pelajaran:</strong> confusion matrix bukan jawaban — ia adalah <strong>bahan mentah keputusan operasional</strong>. Analis yang berhenti di “akurasi 94,6%” belum mulai bekerja.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk AI skrining, hafalkan urutan: <strong>prevalensi → PPV → kapasitas tindak lanjut → keputusan</strong>. Akurasi tidak ada di urutan itu — karena ia menjawab pertanyaan yang salah.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Split data <strong>per pasien dan per RS</strong>, bukan per gambar. Gambar dari pasien yang sama di train dan test = leakage yang menggelembungkan performa.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu uji <strong>per subgrup</strong>: mesin, RS, usia, keparahan. Performa agregat menyembunyikan kegagalan pada subgrup penting (lihat HD13).</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Minta <strong>label dari radiolog</strong> (multi-reader + adjudikasi), bukan dari kode ICD. Label adalah langit-langit modelmu — label billing = langit-langit rendah.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Baca Metadata DICOM (Simulasi)</h2>
      <p>Simulasikan parsing tag DICOM: ekstrak modalitas/merek, deteksi PII yang harus dianonimisasi, dan kelompokkan “pasien” per mesin untuk uji shortcut.</p>
      <PyodideLab
        title="🔬 Lab 1: Baca Metadata DICOM (Simulasi)"
        hint="Ubah proporsi mesin A vs B pada kelas positif. Lihat bagaimana korelasi mesin-label muncul — itulah bibit shortcut learning."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Dari Confusion Matrix ke Keputusan Klinis</h2>
      <p>Diberikan confusion matrix model rontgen, hitung sens/spes/PPV pada dua prevalensi (RS rujukan vs skrining). Tentukan layak deploy atau tidak.</p>
      <PyodideLab
        title="🔬 Lab 2: Dari Confusion Matrix ke Keputusan Klinis"
        hint="PPV di skrining (prevalensi 2%) vs rujukan (30%): model yang sama, nasib beda. Inilah HD9 diterapkan ke imaging."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Teleradiologi Indonesia — AI untuk Daerah 3T</h2>
      <p>Indonesia kekurangan radiolog parah: rasio jauh di bawah standar, menumpuk di Jawa-kota besar. Puskesmas di daerah 3T (terdepan, terluar, tertinggal) sering <strong>tidak punya pembaca rontgen</strong> — foto diambil, tapi tidak ada yang membaca. Inilah masalah yang <strong>tepat</strong> untuk AI + teleradiologi.</p>
      <p><strong>Arsitektur yang masuk akal:</strong> (1) <strong>AI triase di titik layanan</strong> — model ringan (bisa jalan offline di laptop puskesmas) memilah: <em>normal</em> (yakin tinggi) / <em>butuh baca dokter</em> / <em>kualitas foto buruk → ulangi</em>. (2) <strong>Teleradiologi untuk yang flagged</strong> — hanya 20–30% foto diteruskan ke radiolog kota (via SATUSEHAT/PACS), bukan 100%. (3) <strong>Loop umpan balik</strong> — bacaan radiolog menjadi label baru untuk <em>re-training</em> berkala (dengan persetujuan etik).</p>
      <p><strong>Tiga syarat keberhasilan (non-teknis!):</strong> ① <strong>Quality gate</strong> — 30% foto puskesmas tidak layak baca (posisi salah, eksposi buruk); AI yang “menebak” dari foto jelek = <strong>malapraktik</strong>. Tolak dan minta ulang. ② <strong>Tanggung jawab hukum</strong> — siapa bertanggung jawab atas miss? Framework: AI = <em>alat bantu triase</em>, diagnosis final = dokter (UU Kesehatan + etik kedokteran). ③ <strong>Pembiayaan</strong> — siapa bayar inferensi AI? Model bisnis: masuk paket kapitasi/INA-CBG, atau subsidi program.</p>
      <p><strong>Pelajaran umum:</strong> AI citra medis yang <strong>paling berdampak</strong> di Indonesia bukan yang paling akurat di lab — melainkan yang <strong>dirancang untuk keterbatasan lapangan</strong> (offline, foto jelek, tanpa radiolog, budget minim). <strong>Desain untuk batasan, bukan untuk leaderboard.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi dampak:</strong> Satu model triase TB yang “hanya” 85% akurat tapi <strong>berjalan di 1.000 puskesmas</strong> menyelamatkan lebih banyak nyawa daripada model 97% yang <strong>hanya jalan di 3 RS pendidikan</strong>. Dampak = akurasi × jangkauan × adopsi. Optimalkan ketiganya.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Skrining/triase bervolume → AI sebagai second reader</h3>
        <p><strong>Kondisi:</strong> Banyak citra, radiolog terbatas; false negative berbahaya.</p>
        <p><strong>Kenapa:</strong> AI cepat + sens tinggi; manusia konfirmasi positif.</p>
        <p><strong>Contoh nyata:</strong> Skrining TB dari rontgen dada di puskesmas.</p>
      </div>
      <div className="decision-card">
        <h3>2. Kasus kompleks/langka → Tetap radiolog, AI pendukung</h3>
        <p><strong>Kondisi:</strong> Pola atipikal, butuh integrasi klinis.</p>
        <p><strong>Kenapa:</strong> AI rapuh di luar distribusi training.</p>
        <p><strong>Contoh nyata:</strong> Tumor langka, citra artefak berat.</p>
      </div>
      <div className="decision-card">
        <h3>3. Klaim siap klinis → Validasi eksternal + uji shortcut</h3>
        <p><strong>Kondisi:</strong> Generalisasi adalah klaimnya.</p>
        <p><strong>Kenapa:</strong> Shortcut learning adalah mode kegagalan #1 imaging AI.</p>
        <p><strong>Contoh nyata:</strong> Uji di 3 RS dengan mesin berbeda + Grad-CAM review.</p>
      </div>
      <div className="decision-card">
        <h3>4. Data kecil berlabel mahal → Transfer learning + augmentasi</h3>
        <p><strong>Kondisi:</strong> &lt; 10.000 citra berlabel.</p>
        <p><strong>Kenapa:</strong> Pra-latih menangkap fitur visual umum; fine-tune hemat data.</p>
        <p><strong>Contoh nyata:</strong> Klasifikasi lesi kulit dengan 3.000 foto.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Split per pasien &amp; per RS, bukan per gambar.</li>
          <li>Label dari radiolog, bukan kode billing.</li>
          <li>Evaluasi per mesin/RS; curigai shortcut.</li>
          <li>Sens/spes + PPV lokal, bukan cuma akurasi.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: AI Retinopati: 97% di Lab, 70% di Puskesmas</h2>
      <div className="callout">
        <p>Model deteksi retinopati diabetik dari foto fundus: akurasi 97% di data training (kamera mahal, RS tersier). Dideploy ke puskesmas (kamera murah, operator tidak terlatih): akurasi anjlok ke 70%, banyak false negative — pasien buta yang seharusnya tertangkap.</p>
      <p>Tidak ada validasi eksternal sebelum deploy. Tidak ada monitoring.</p>
        <p><strong>Pertanyaan:</strong> Analisis akar masalah dan rancang program perbaikan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Akar: domain shift (kamera, operator, populasi) tanpa validasi eksternal; metrik akurasi menyembunyikan FN yang fatal untuk skrining (butuh sens tinggi!). Perbaikan: (1) kumpulkan data puskesmas berlabel (multi-reader); (2) fine-tune/adaptasi domain; (3) evaluasi dengan sens sebagai metrik primer (skrining!); (4) alur: AI triase → yang positif/meragukan ke dokter mata via telemedicine; (5) monitoring bulanan per puskesmas. Pelajaran: performa lab ≠ performa lapangan. Deploy tanpa validasi eksternal = uji coba pada pasien.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. DICOM berisi…"
        options={["Hanya piksel gambar",
          "Piksel + metadata terstandar (pasien, modalitas, mesin)",
          "Hanya teks",
          "Hanya video"]}
        correct={1}
        explanation="Benar: amplop lengkap. Metadata penting untuk arsip, stratifikasi evaluasi, dan — awas — PII yang harus dianonimisasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Shortcut learning pada model COVID-rontgen artinya…"
        options={["Model terlalu cepat",
          "Model memakai artefak (merek mesin di sudut) bukan pola penyakit",
          "Model curang disengaja",
          "Data terlalu sedikit"]}
        correct={1}
        explanation="Benar: korelasi artefak-label dieksploitasi. Terdeteksi via crop test + Grad-CAM + validasi eksternal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Split data citra yang benar?"
        options={["Per gambar acak",
          "Per pasien dan per RS (hindari leakage antar split)",
          "Per piksel",
          "Tidak perlu split"]}
        correct={1}
        explanation="Benar: gambar pasien yang sama di train+test = bocoran. Selalu split di level pasien/RS."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk skrining TB dari rontgen, metrik primer?"
        options={["Akurasi",
          "Sensitivitas (jangan sampai lolos) + PPV lokal",
          "Spesifisitas saja",
          "Kecepatan"]}
        correct={1}
        explanation="Benar (SnNout): skrining butuh tangkap semua; PPV menentukan beban konfirmasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Transfer learning untuk citra medis berguna karena…"
        options={["Selalu lebih akurat",
          "Data berlabel mahal/sedikit — fitur visual umum dari pra-latih menghemat data",
          "Wajib regulasi",
          "Gratis"]}
        correct={1}
        explanation="Benar: 3.000 foto + fine-tune sering mengalahkan training dari nol. Bukan sihir, tapi efisiensi data."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Grad-CAM heatmap menyala di paru. Kesimpulan?"
        options={["Terbukti tidak ada shortcut",
          "Korelasi area-keputusan, bukan bukti kausal — tetap butuh uji eksternal/crop",
          "Model sempurna",
          "Tidak perlu evaluasi lagi"]}
        correct={1}
        explanation="Benar: heatmap = alat investigasi, bukan sertifikat. Shortcut lain bisa tetap ada."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>DICOM</strong> = piksel + metadata; metadata = PII yang wajib dianonimisasi.</li>
          <li><strong>CNN</strong>: fitur bertingkat via konvolusi; <strong>transfer learning</strong> standar untuk data kecil.</li>
          <li>Label dari <strong>radiolog</strong> (multi-reader), bukan kode billing.</li>
          <li>Split <strong>per pasien/RS</strong>; evaluasi <strong>per mesin/RS</strong>.</li>
          <li><strong>Shortcut learning</strong> adalah mode gagal #1 — uji crop + Grad-CAM + eksternal.</li>
          <li>Metrik klinis: <strong>sens/spes + PPV</strong> pada prevalensi target.</li>
          <li>AI citra = <strong>second reader/triase</strong>, bukan pengganti untuk kasus kompleks.</li>
          <li>Performa lab ≠ lapangan: validasi eksternal + monitoring wajib.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd14-nlp-klinis" className="btn btn-secondary btn-sm">← HD14</Link>
        <Link href="/learn/hd16-surveilans-wabah" className="btn btn-primary btn-sm">HD16 →</Link>
      </div>
    </div>
  );
}
