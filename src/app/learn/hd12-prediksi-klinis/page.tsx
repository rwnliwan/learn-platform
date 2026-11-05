"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd12PrediksiKlinisPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd12CalData = [{"x": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "y": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "type": "scatter", "mode": "lines", "name": "Ideal", "line": {"dash": "dash", "color": "#94a3b8"}}, {"x": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "y": [0.25, 0.35, 0.42, 0.48, 0.52, 0.58, 0.65, 0.72, 0.8], "type": "scatter", "mode": "lines+markers", "name": "Model B", "line": {"color": "#e8a838"}}];
  const hd12CalDataLayout = {"xaxis": {"title": "Prediksi model"}, "yaxis": {"title": "Frekuensi aktual", "range": [0, 1]}, "showlegend": true};

  const lab1Code = "import random\nrandom.seed(4)\nn = 2000\n# model A: terkalibrasi (prediksi = probabilitas sebenarnya)\n# model B: overconfident (mendorong ke 0/1)\nbrier = {'A': 0.0, 'B': 0.0}\nfor _ in range(n):\n    p_true = random.random()*0.6 + 0.1       # risiko sebenarnya 10-70%\n    y = 1 if random.random() < p_true else 0\n    pA = p_true\n    pB = 0.95 if p_true > 0.4 else 0.05      # overconfident\n    brier['A'] += (pA - y)**2\n    brier['B'] += (pB - y)**2\nprint(f\"Brier A (terkalibrasi) : {brier['A']/n:.4f}\")\nprint(f\"Brier B (overconfident): {brier['B']/n:.4f}  <- lebih buruk!\")\nprint()\nprint('AUC keduanya bisa sama (urutan mirip), tapi Brier membedakan.')\nprint('Dokter butuh A, bukan B.')";

  const lab2Code = "import random\nrandom.seed(8)\ndef evaluasi(prevalensi, n=5000):\n    brier, tp = 0.0, 0\n    for _ in range(n):\n        sakit = random.random() < prevalensi\n        # model lama: skor terkalibrasi untuk prevalensi 20%\n        skor = 0.5 if sakit else 0.15\n        p = skor * (prevalensi/0.2) / (skor*(prevalensi/0.2) + (1-skor))\n        p_model = skor  # model TIDAK tahu prevalensi berubah\n        brier += (p_model - sakit)**2\n    return brier/n\nfor prev in [0.20, 0.25, 0.30, 0.35]:\n    print(f'prevalensi {prev:.0%}: Brier = {evaluasi(prev):.4f}')\nprint()\nprint('Brier memburuk seiring prevalensi bergeser.')\nprint('Diskriminasi (urutan) tetap; kalibrasi (angka) meluruh.')\nprint('-> Jadwalkan rekalibrasi berkala, jangan deploy-dan-lupakan.')";

  const hd12DcData = [{"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.015], "type": "scatter", "mode": "lines+markers", "name": "Model", "line": {"color": "#2a7de1"}}, {"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0.06, 0.045, 0.03, 0.015, 0.0, -0.02, -0.05], "type": "scatter", "mode": "lines+markers", "name": "Obati semua", "line": {"color": "#e8a838"}}, {"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0, 0, 0, 0, 0, 0, 0], "type": "scatter", "mode": "lines", "name": "Obati tak satu pun", "line": {"dash": "dash", "color": "#94a3b8"}}];
  const hd12DcDataLayout = {"xaxis": {"title": "Threshold probabilitas"}, "yaxis": {"title": "Net benefit"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD12 &mdash; Health Data Scientist</span>
        <h1 className="display-title">TRIPOD &amp; Kalibrasi:<br />Model Prediksi yang Dipercaya Dokter</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 95% yang Ditolak Dokter</a></li>
          <li><a href="#kalibrasi">Kalibrasi — Si Jujur tentang Keyakinan</a></li>
          <li><a href="#validasi">Validasi: Internal, Temporal, Eksternal</a></li>
          <li><a href="#tripod">TRIPOD &amp; Utilitas Klinis</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalibrasi vs Diskriminasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Drift Performa</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Uji Transportabilitas</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Dua Sumbu Kualitas Model</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Skor Klinis Indonesia</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Kalibrasi — Ujian Kejujuran Model</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>diskriminasi vs kalibrasi</strong> dan menjelaskan kenapa dokter butuh keduanya.</li>
          <li>Membaca <strong>calibration plot</strong> dan menghitung konsep <strong>Brier score</strong>.</li>
          <li>Merancang skema <strong>validasi</strong> yang benar (temporal/eksternal) dan menghindari leakage.</li>
          <li>Menilai <strong>utilitas klinis</strong> via decision curve dan melapor sesuai <strong>TRIPOD</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model 95% yang Ditolak Dokter</h2>
      <div className="story">
        <p>Tim data science membangun model risiko readmission: <strong>akurasi 95%</strong>. Presentasi ke dokter: ditolak mentah-mentah. “Modelmu bilang pasien ini risiko 80%,” kata dokter senior, “Tapi dari 10 pasien yang kamu bilang 80%, cuma 4 yang benar-benar readmit. <strong>Angkamu tidak bisa dipercaya.</strong>”</p>
      <p>Model itu diskriminatif (bisa mengurutkan) tapi tidak terkalibrasi (angkanya bohong). Dokter tidak butuh ranking — mereka butuh <strong>probabilitas yang jujur</strong> untuk keputusan. Lesson ini tentang membuat model yang dipercaya, bukan sekadar yang menang leaderboard.</p>
      <p><strong>Twist-nya:</strong> model itu <em>memang</em> 95% akurat — dan dokter <em>tetap benar</em> menolaknya. Keduanya tidak bertentangan: akurasi mengukur <strong>ranking</strong> (siapa lebih berisiko dari siapa), dokter butuh <strong>probabilitas jujur</strong> (“80%” harus berarti 8 dari 10). Model yang diskriminatif tapi tidak terkalibrasi seperti <strong>termometer yang urutannya benar tapi angkanya ngawur</strong> — berguna untuk lomba, berbahaya untuk keputusan. Lesson ini tentang membuat angka model bisa dipercaya nyawa.</p>
      </div>

      <h2 id="kalibrasi">Kalibrasi — Si Jujur tentang Keyakinan</h2>
      <p><strong>Definisi.</strong> <strong>Kalibrasi</strong>: kesesuaian probabilitas prediksi dengan frekuensi kejadian sebenarnya. Model terkalibrasi: dari semua pasien yang diprediksi 30%, memang ~30% yang kejadian. <strong>Diskriminasi</strong> (AUC): kemampuan mengurutkan (siapa lebih berisiko).</p>
      <Tex math={String.raw`\text{Brier} = \frac{1}{n}\sum_{i=1}^{n}(p_i - y_i)^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`p_i`} />: probabilitas prediksi pasien i</li>
          <li><Tex math={String.raw`y_i`} />: outcome aktual (1/0)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Brier = rata-rata kuadrat selisih prediksi vs realita (makin kecil makin baik; 0 = sempurna). Ia menghukum <em>overconfidence</em>: prediksi 99% yang salah jauh lebih mahal dari prediksi 60% yang salah.</p>
      <details className="worked">
        <summary>📐 Contoh: dua model, AUC sama, kalibrasi beda</summary>
        <p>Model A dan B: AUC sama 0,80. Pada 100 pasien berisiko prediksi 80%:<br />A: 78 benar-benar readmit → terkalibrasi baik.<br />B: 45 benar-benar readmit → overconfidence parah.<br />Dokter memakai B akan menghabiskan intervensi mahal untuk 55 pasien yang tak butuh. <strong>AUC tidak bisa membedakan A dan B — kalibrasi bisa.</strong></p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Diskriminasi itu peramal yang bisa mengurutkan kuda balap; kalibrasi itu bandar yang jujur soal odds. Dokter butuh bandar jujur — karena mereka bertaruh dengan nyawa dan anggaran.</p>
      <p><strong>Kapan memakai:</strong> Setiap model probabilitas klinis: laporkan calibration plot (slope &amp; intercept) + Brier, bukan hanya AUC.</p>

      <PlotlyChart
        data={hd12CalData}
        title="Calibration Plot: Model B Overconfidence"
        layout={hd12CalDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu X = probabilitas yang diprediksi model, Y = proporsi kejadian sebenarnya pada kelompok itu. Garis putus-putus = kalibrasi sempurna.</p>
        <p><strong>Interpretasi:</strong> Model B (kuning) di atas garis ideal pada prediksi rendah (meremehkan risiko kecil) dan di bawah pada prediksi tinggi (melebih-lebihkan risiko besar) — pola overconfidence klasik. Model seperti ini butuh rekalibrasi (Platt/isotonic) sebelum dipakai dokter.</p>
      </div>

      <h2 id="validasi">Validasi: Internal, Temporal, Eksternal — Tiga Ujian</h2>
      <p><strong>Definisi.</strong> <strong>Internal</strong>: split/bootstrapping dalam satu dataset. <strong>Temporal</strong>: latih masa lalu, uji masa depan (satu situs). <strong>Eksternal</strong>: uji di situs/populasi berbeda — ujian terberat dan paling dipercaya.</p>
      <details className="worked">
        <summary>📐 Contoh: model readmission lolos internal, gagal eksternal</summary>
        <p>AUC internal 0,82 (RS A). Temporal (tahun berikutnya, RS A): 0,78. Eksternal (RS B): <strong>0,65</strong>.<br />Penyebab: RS B punya definisi discharge berbeda + populasi lebih tua + EHR beda kelengkapan.<br />Keputusan: JANGAN deploy di RS B tanpa rekalibrasi/retraining lokal. Inilah kenapa jurnal topik kini mewajibkan validasi eksternal (TRIPOD).<br /><strong>Drift:</strong> performa menurun seiring waktu karena populasi/protokol berubah — butuh monitoring berkala (lihat lab 2).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Validasi internal itu ujian di rumah sendiri (soal bocor ke pola lokal). Temporal itu ujian semester depan (populasi bergeser waktu). Eksternal itu pindah sekolah (sistem, dokter, pasien beda) — yang lulus di sini baru boleh dipamerkan.</p>
      <p><strong>Kapan memakai:</strong> Minimal: temporal. Ideal sebelum deploy: eksternal. Selalu: hindari leakage (lihat HD11) — fitur dari masa depan = nilai ujian palsu.</p>
      <div className="callout callout-warning"><strong>Leakage checklist sebelum validasi:</strong> (1) split berdasarkan WAKTU atau pasien (bukan baris!); (2) imputasi/scaling dihitung dari train saja; (3) tidak ada fitur yang baru tersedia setelah prediction time; (4) label tidak mengandung info masa depan.</div>

      <h2 id="tripod">TRIPOD &amp; Utilitas Klinis — Si Standar Lapor</h2>
      <p><strong>Definisi.</strong> <strong>TRIPOD</strong>: checklist pelaporan model prediksi (populasi, prediktor, outcome, validasi, performa). <strong>Decision curve analysis</strong>: mengukur <em>net benefit</em> model pada berbagai threshold — apakah memakai model lebih baik dari “obati semua” atau “obati tak satu pun”.</p>
      <Tex math={String.raw`\text{Net Benefit} = \frac{TP}{n} - \frac{FP}{n} \times \frac{p_t}{1-p_t}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`TP, FP`} />: true/false positive pada threshold p_t</li>
          <li><Tex math={String.raw`p_t`} />: threshold probabilitas untuk bertindak</li>
          <li><Tex math={String.raw`p_t/(1-p_t)`} />: bobot: seberapa mahal false positive relatif terhadap true positive</li>
      </ul>
      <p><strong>Interpretasi:</strong> Net benefit positif = model berguna pada threshold itu. Jika kurva model di bawah “obati semua” pada threshold operasionalmu, modelmu <em>merugikan</em> walau AUC-nya tinggi.</p>
      <details className="worked">
        <summary>📐 Contoh: decision curve mengubah keputusan</summary>
        <p>Model readmission AUC 0,80. Threshold operasional 20% (intervensi mahal).<br />Net benefit model pada 20%: 0,05. “Obati semua” pada 20%: 0,03. “Obati tak satu pun”: 0.<br />Model menang → layak deploy. Tapi pada threshold 5% (intervensi murah), “obati semua” menang → model tidak berguna di sana.<br /><strong>Utilitas tergantung threshold operasional</strong> — bukan sifat model semata.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> TRIPOD itu notaris: memastikan semua yang penting tercatat sehingga orang lain bisa menilai dan mengulang. Decision curve itu akuntan klinis: menerjemahkan AUC menjadi “berapa pasien terbantu per 100”.</p>
      <p><strong>Kapan memakai:</strong> Setiap publikasi/laporan model klinis: ikuti TRIPOD (+AI untuk ML). Setiap klaim “model siap pakai”: tunjukkan decision curve pada threshold operasional.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Kalibrasi — Ujian Kejujuran Model</h2>
      <details className="worked">
        <summary>📐 Worked example: membaca kurva kalibrasi &amp; Brier score (klik untuk buka)</summary>
        <p>Model readmission memprediksi risiko 10.000 pasien pulang. Kelompokkan prediksi ke desil.</p>
        <p><strong>Langkah 1 — Tabel kalibrasi.</strong> Desil prediksi 70–80% (n=800): readmission aktual = 320 → <strong>40%</strong>. Desil 80–90% (n=500): aktual = 275 → <strong>55%</strong>. Model <em>sistematis overconfident</em>: mengklaim 75% padahal kenyataan 40%.</p>
        <p><strong>Langkah 2 — Brier score.</strong> Rata-rata (prediksi − aktual)² = 0,21. Model “bodoh” yang selalu memprediksi rata-rata populasi (12%) punya Brier 0,106 — <strong>lebih baik</strong> dari model canggihmu! Brier menghukum overconfidence tanpa ampun.</p>
        <p><strong>Langkah 3 — Perbaiki dengan rekalibrasi.</strong> Platt scaling / isotonic regression memetakan 75% → 42% berdasarkan data validasi. Setelah rekalibrasi, Brier turun ke 0,10 dan kurva kalibrasi menempel garis diagonal.</p>
        <p><strong>Langkah 4 — Validasi temporal.</strong> Uji model 2023 pada data 2024: Brier naik lagi ke 0,16 — <strong>drift</strong> (populasi/protokol berubah pasca-pandemi). Model klinis bukan “sekali latih, selamanya pakai”: jadwalkan <strong>monitoring kalibrasi berkala</strong> (lihat mini-case skor sepsis).</p>
        <p><strong>Langkah 5 — Lapor ala TRIPOD.</strong> Publikasi wajib menyertakan kurva kalibrasi + Brier + validasi eksternal/temporal — bukan cuma AUC. Reviewer jurnal yang baik langsung melompat ke gambar kalibrasi sebelum membaca hasil.</p>
        <p><strong>Pelajaran:</strong> AUC menjawab “apakah model mengurutkan dengan benar”; kalibrasi menjawab “apakah angkanya boleh dipercaya”. Dokter hanya peduli yang kedua.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — utilitas klinis &gt; akurasi statistik:</strong> Decision curve analysis bertanya: “pada threshold risiko berapa dokter bertindak, dan berapa <em>net benefit</em>-nya dibanding strategi ‘rawat semua’ atau ‘rawat tak satu pun’?” Model dengan AUC 0,88 bisa punya net benefit <strong>nol</strong> pada threshold yang relevan klinis — artinya secara statistik hebat, secara klinis tidak berguna. Selalu evaluasi model pada <strong>rentang threshold keputusan nyata</strong> (tanya dokter: “risiko berapa persen yang membuatmu bertindak?”), bukan pada threshold 0,5 default yang tidak ada maknanya di klinik.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — skor sepsis yang diprotes perawat:</strong> Mini-case lesson ini mencerminkan realitas implementasi: skor sepsis dengan AUC 0,88 memicu <strong>alarm fatigue</strong> — perawat menerima puluhan alert per shift, 9 dari 10 palsu, lalu mengabaikan semuanya (termasuk yang benar). Masalahnya bukan model, melainkan <strong>ambang + alur kerja</strong>: alert tanpa aksi yang jelas (“lakukan X dalam 30 menit”) hanya menambah beban kognitif. Analis Indonesia yang mendeploy model harus ikut merancang <strong>respons klinisnya</strong> — berapa alert per shift yang manusiawi, siapa yang merespons, apa tindakannya. Model tanpa SOP adalah spam.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Dua Sumbu Kualitas Model (dan Proper Scoring Rules)</h2>
      <p>Setiap model probabilitas dinilai pada <strong>dua sumbu independen</strong> — dan sumbu yang satu tidak bisa menutupi yang lain.</p>
      <p><strong>Sumbu 1 — Diskriminasi:</strong> bisakah model <em>mengurutkan</em> (yang sakit skornya lebih tinggi dari yang sehat)? Diukur: AUC, c-statistic. <strong>Sumbu 2 — Kalibrasi:</strong> apakah <em>angkanya jujur</em> (dari 100 pasien berskor 30%, ~30 benar-benar kejadian)? Diukur: kurva kalibrasi, Brier score, calibration slope/intercept.</p>
      <p><strong>Empat kuadran:</strong> (a) Diskriminasi baik + kalibrasi baik = <strong>deploy</strong>. (b) Diskriminasi baik + kalibrasi buruk = <strong>rekalibrasi</strong> (masih bisa diselamatkan!). (c) Diskriminasi buruk + kalibrasi baik = model “jujur tapi bodoh” (mis. selalu prediksi rata-rata populasi) — <strong>tidak berguna</strong>. (d) Keduanya buruk = buang.</p>
      <p><strong>Mengapa Brier score istimewa (proper scoring rule):</strong> Brier = rata-rata (prediksi − aktual)². Ia <strong>proper</strong>: nilai terbaik dicapai <em>tepat</em> saat kamu melaporkan keyakinanmu yang sebenarnya — tidak ada insentif untuk berbohong (tidak seperti akurasi, yang memberi insentif prediksi ekstrem). Dekomposisinya elegan: Brier = <em>ketidakpastian</em> (irreducible) + <em>miskalibrasi</em> (bisa diperbaiki) − <em>resolusi</em> (diskriminasi). <strong>Optimasi akurasi bisa merusak kalibrasi</strong> — inilah alasan leaderboard Kaggle (akurasi/AUC) sering melahirkan model yang <strong>ditolak dokter</strong>.</p>
      <p><strong>Implikasi praktis:</strong> saat melatih model klinis, <strong>optimasi proper scoring rule</strong> (log-loss/Brier), bukan akurasi. Dan saat mengevaluasi, <strong>selalu</strong> laporkan pasangan (diskriminasi, kalibrasi) — satu tanpa yang lain adalah setengah kebenaran.</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> dokter tidak bertanya “berapa AUC-mu?” — mereka bertanya <strong>“bolehkah saya percaya angka 70% ini?”</strong> Jawab pertanyaan kedua, dan yang pertama menjadi tidak penting.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AUC 0,9 = model siap dipakai dokter&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AUC hanya diskriminasi. Tanpa kalibrasi (angka jujur), validasi eksternal (generalisasi), dan decision curve (utilitas pada threshold operasional), AUC 0,9 bisa menjadi model yang merugikan. Dokter butuh probabilitas yang bisa dipercaya, bukan ranking.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Validasi silang 5-fold sudah cukup untuk klaim generalisasi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> CV menguji generalisasi ke <em>sampel baru dari populasi yang sama</em>. Ia buta terhadap pergeseran waktu (drift), perbedaan situs, dan perbedaan definisi. Untuk klaim “berlaku di RS lain”, butuh validasi eksternal sungguhan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model yang dulu bagus akan selamanya bagus&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Populasi menua, protokol berubah, EHR berganti, pandemi datang — performa model klinis meluruh (drift). Tanpa monitoring berkala + rencana retraining/rekalibrasi, model menjadi fosil yang dipercaya.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Uji Transportabilitas — Model RS A ke RS B</h2>
      <details className="worked">
        <summary>📐 Worked example: checklist validasi eksternal 7 langkah (klik untuk buka)</summary>
        <p>Model prediksi readmission dilatih di RS A (swasta, Jakarta; AUC 0,82, terkalibrasi baik). RS B (pemerintah, daerah) ingin memakai. Jangan langsung deploy — jalankan checklist:</p>
        <p><strong>Langkah 1 — Bandingkan distribusi prediktor.</strong> Usia median: A 58 th, B 47 th. Komorbiditas: A lengkap (EHR rapi), B 30% missing. <strong>Case-mix beda</strong> → performa akan turun; pertanyaannya <em>berapa banyak</em>.</p>
        <p><strong>Langkah 2 — Bandingkan definisi outcome.</strong> “Readmission 30 hari” di A = kembali ke <em>RS A</em>; di B, pasien sering readmit ke RS lain (tidak tercatat!) → <strong>outcome under-ascertained</strong> di B. Model akan <em>terlihat</em> buruk padahal masalahnya definisi.</p>
        <p><strong>Langkah 3 — Uji diskriminasi di B.</strong> AUC di B = 0,74 (turun 8 poin). Masih berguna? Tergantung: AUC 0,74 dengan kalibrasi baik &gt; AUC 0,82 tanpa kalibrasi.</p>
        <p><strong>Langkah 4 — Uji kalibrasi di B (KRUSIAL).</strong> Kurva kalibrasi B: model <em>overpredict</em> di risiko tinggi (klaim 60%, realita 35%) — karena baseline risk B lebih rendah (populasi lebih muda). <strong>Solusi murah: rekalibrasi</strong> (sesuaikan intercept/slope pada data B, tanpa latih ulang fitur) → kalibrasi pulih, AUC tetap 0,74.</p>
        <p><strong>Langkah 5 — Uji fairness per subgrup B.</strong> Kalibrasi per kelompok: pasien BPJS PBI vs umum — jika miskalibrasi per grup, butuh penyesuaian lanjutan (lihat HD13).</p>
        <p><strong>Langkah 6 — Uji utilitas klinis di B.</strong> Decision curve pada threshold operasional B (kapasitas perawat beda dari A!): apakah net benefit &gt; strategi “rawat semua/tidak”?</p>
        <p><strong>Langkah 7 — Keputusan.</strong> Opsi: (a) pakai + rekalibrasi (bila AUC cukup &amp; kalibrasi pulih), (b) latih ulang dengan data B (bila distribusi terlalu beda), (c) tolak (bila tidak ada opsi yang aman). <strong>“Tolak” adalah jawaban yang valid dan profesional</strong> — memaksakan model yang tidak cocok adalah malapraktik analitik.</p>
        <p><strong>Pelajaran:</strong> validasi eksternal bukan “uji AUC di data baru” — melainkan <strong>audit 7 lapis</strong>: distribusi, definisi, diskriminasi, kalibrasi, fairness, utilitas, keputusan. Lewati satu lapis = bom waktu.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Model yang <strong>rekalibrasi</strong> dengan baik di tempat baru sering <em>lebih</em> berguna daripada model baru yang dilatih asal-asalan. Jangan remehkan “sekadar” rekalibrasi — ia adalah 80% nilai transportabilitas dengan 20% usaha.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu laporkan <strong>kalibrasi + diskriminasi + utilitas</strong> sebagai paket. Satu saja = setengah cerita. Template kalimat: “AUC 0,80; calibration slope 0,95; net benefit positif pada threshold 10–30%.”</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Pilih <strong>threshold dari biaya klinis</strong> (berapa mahal FP vs FN), bukan dari Youden index atau 0,5 default. Threshold adalah keputusan klinis-ekonomi, bukan statistik.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bangun <strong>monitoring drift</strong> sejak hari pertama deploy: tracking AUC/kalibrasi per bulan + alert. Model klinis tanpa monitoring = mobil tanpa spidometer.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Brier Score Menghukum Overconfidence</h2>
      <p>Dua model dengan AUC sama: A terkalibrasi, B overconfident. Hitung Brier score keduanya dan buktikan angka menghukum yang sombong.</p>
      <PyodideLab
        title="🔬 Lab 1: Brier Score Menghukum Overconfidence"
        hint="Ubah overconfidence B (0.95/0.05) menjadi lebih ekstrem (0.99/0.01). Lihat Brier meledak — itulah harga keyakinan palsu."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Drift — Model Menua</h2>
      <p>Model dilatih saat prevalensi 20%. Simulasikan prevalensi naik ke 35% (populasi menua) dan lihat kalibrasi meluruh walau diskriminasi tetap.</p>
      <PyodideLab
        title="🔬 Lab 2: Simulasi Drift — Model Menua"
        hint="Inilah kenapa monitoring berkala wajib: AUC-mu bisa tetap 0,80 sementara angka yang keluar makin bohong. Solusi: rekalibrasi berkala."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Skor Klinis Buatan Indonesia — dari Kertas ke Aplikasi</h2>
      <p>Indonesia punya tradisi <strong>skor klinis sederhana</strong> (kertas/kalkulator): mis. skor prediksi DBD berat, skor risiko kaki diabetik. Tantangannya kini: <strong>migrasi ke model digital</strong> — dan jebakannya khas.</p>
      <p><strong>Jebakan 1 — “Skor kertas” yang tidak divalidasi ulang saat didigitalkan.</strong> Skor yang dikembangkan di satu RSUD tahun 2010 (populasi, definisi, alat lab saat itu) dipakai di aplikasi nasional 2024 tanpa re-validasi. <strong>Drift 14 tahun</strong> (populasi menua, definisi berubah, alat lab berganti) membuat kalibrasinya basi. Aturan: setiap migrasi platform = <strong>re-validasi</strong>, bukan copy-paste koefisien.</p>
      <p><strong>Jebakan 2 — Input yang tidak tersedia di puskesmas.</strong> Model RS tersier memakai fitur “kadar troponin” / “CT scan” — tidak ada di puskesmas. Model “hebat” yang butuh input yang tidak ada = <strong>model mati</strong>. Desain untuk <strong>titik layanan terendah</strong> yang akan memakainya: fitur = yang tersedia di puskesmas (tensi, nadi, suhu, gejala).</p>
      <p><strong>Jebakan 3 — Tidak ada loop umpan balik.</strong> Aplikasi skor dipakai, tapi <strong>outcome-nya tidak dicatat kembali</strong> — sehingga tidak ada yang tahu apakah skornya masih akurat. Deploy tanpa monitoring = <strong>terbang buta</strong>. Syarat deploy: definisikan <em>sebelum launch</em> — metrik apa dipantau, seberapa sering, dan ambang rollback-nya.</p>
      <p><strong>Contoh yang benar:</strong> tim yang (1) validasi eksternal di 3 RS berbeda, (2) rekalibrasi per setting, (3) batasi fitur ke yang tersedia di puskesmas, (4) bangun dashboard monitoring kalibrasi bulanan, (5) tulis SOP “apa yang dilakukan perawat untuk tiap rentang skor”. <strong>Lima lapis ini</strong> — bukan AUC — yang membuat model <em>dipakai</em>, bukan sekadar <em>dipublikasikan</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi implementasi:</strong> Di Indonesia, <strong>hambatan terbesar AI klinis bukan akurasi — melainkan alur kerja</strong>. Model 0,80 yang terintegrasi ke alur visite perawat mengalahkan model 0,90 yang butuh login ke aplikasi terpisah. Desain untuk <strong>5 detik</strong> dalam alur yang sudah ada, bukan aplikasi baru yang “canggih”.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh probabilitas untuk keputusan → Kalibrasi dulu</h3>
        <p><strong>Kondisi:</strong> Output dipakai dokter/manajer untuk ambang tindakan.</p>
        <p><strong>Kenapa:</strong> Angka yang tidak jujur = keputusan yang salah arah.</p>
        <p><strong>Contoh nyata:</strong> Skor risiko readmission untuk alokasi perawat kunjungan rumah.</p>
      </div>
      <div className="decision-card">
        <h3>2. Butuh ranking/prioritas → Diskriminasi (AUC) cukup awal</h3>
        <p><strong>Kondisi:</strong> Hanya urutan yang penting (siapa duluan dikunjungi).</p>
        <p><strong>Kenapa:</strong> AUC mengukur kemampuan mengurutkan.</p>
        <p><strong>Contoh nyata:</strong> Daftar prioritas skrining dengan kapasitas terbatas.</p>
      </div>
      <div className="decision-card">
        <h3>3. Klaim siap deploy lintas RS → Validasi eksternal + decision curve</h3>
        <p><strong>Kondisi:</strong> Generalisasi adalah klaimnya.</p>
      <PlotlyChart
        data={hd12DcData}
        title="Decision Curve: Net Benefit vs Threshold"
        layout={hd12DcDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga kurva: biru = pakai model, kuning = obati semua orang, putus-putus = obati tak satu pun. Di tiap threshold, yang tertinggi = strategi terbaik.</p>
        <p><strong>Interpretasi:</strong> Model (biru) menang pada threshold 5–30% — rentang operasional yang masuk akal. Di atas 35%, “obati tak satu pun” lebih baik (intervensi terlalu mahal untuk risiko setinggi itu). Inilah utilitas klinis: bukan “model bagus?” tapi “model berguna pada threshold KITA?”</p>
      </div>
        <p><strong>Kenapa:</strong> Hanya eksternal yang menguji beda populasi/sistem; decision curve membuktikan manfaat.</p>
        <p><strong>Contoh nyata:</strong> Model sepsis untuk 10 RS jaringan.</p>
      </div>
      <div className="decision-card">
        <h3>4. Model sudah deploy → Monitoring drift berkala</h3>
        <p><strong>Kondisi:</strong> Lingkungan berubah (populasi, protokol, EHR).</p>
        <p><strong>Kenapa:</strong> Performa meluruh diam-diam; deteksi dini mencegah kerugian.</p>
        <p><strong>Contoh nyata:</strong> Dashboard bulanan: AUC, calibration slope, distribusi skor.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Laporkan kalibrasi + diskriminasi + utilitas, selalu paket.</li>
          <li>Threshold dari biaya klinis, bukan 0,5.</li>
          <li>Validasi eksternal sebelum klaim generalisasi.</li>
          <li>Monitoring drift sejak hari pertama deploy.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Skor Sepsis: AUC 0,88 Tapi Perawat Protes</h2>
      <div className="callout">
        <p>Model prediksi sepsis AUC 0,88 dideploy di IGD. Sebulan kemudian perawat protes: “alert berbunyi terus, 9 dari 10 ternyata bukan sepsis — kami mulai mengabaikannya.” (alert fatigue).</p>
      <p>Investigasi: threshold default 0,5; prevalensi sepsis di IGD 8%; PPV pada threshold itu hanya 12%.</p>
        <p><strong>Pertanyaan:</strong> Diagnosis masalahnya dan rancang perbaikan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Masalah = threshold salah + PPV rendah pada prevalensi rendah (HD9!). AUC 0,88 tidak menjamin PPV baik. Perbaikan: (1) pilih threshold dari decision curve dengan bobot biaya alert fatigue (FP mahal karena mengikis kepercayaan); (2) naikkan threshold hingga PPV ~30–40% walau sensitivitas turun — alert yang dipercaya &gt; alert yang sering; (3) tampilkan probabilitas terkalibrasi, bukan biner; (4) ukur outcome operasional: time-to-antibiotik, bukan cuma AUC. Pelajaran: model klinis gagal bukan karena statistiknya jelek, tapi karena thresholdnya buta operasional. Libatkan perawat SEBELUM deploy, bukan setelah protes.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan kalibrasi vs diskriminasi?"
        options={["Sama saja",
          "Kalibrasi = kejujuran angka probabilitas; diskriminasi = kemampuan mengurutkan (AUC)",
          "Kalibrasi untuk regresi saja",
          "Diskriminasi tidak penting"]}
        correct={1}
        explanation="Benar: dokter butuh keduanya — ranking untuk prioritas, angka jujur untuk keputusan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Brier score menghukum terutama…"
        options={["Model lambat",
          "Overconfidence — prediksi ekstrem yang salah",
          "Model sederhana",
          "Data kecil"]}
        correct={1}
        explanation="Benar: (p−y)² meledak saat p=99% tapi y=0. Kejujuran tentang ketidakpastian dihargai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model AUC 0,85 di RS A, 0,65 di RS B. Tindakan?"
        options={["Deploy di B juga",
          "Jangan deploy di B tanpa investigasi/rekalibrasi — validasi eksternal gagal",
          "Rata-ratakan saja",
          "Buang modelnya"]}
        correct={1}
        explanation="Benar: generalisasi tidak terbukti. Cari penyebab (populasi, definisi, EHR) sebelum pakai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Decision curve menunjukkan model kalah dari “obati semua” pada threshold operasional. Artinya?"
        options={["Model tetap bagus karena AUC tinggi",
          "Model merugikan pada threshold itu — jangan pakai di sana",
          "Threshold salah hitung",
          "Abaikan saja"]}
        correct={1}
        explanation="Benar: utilitas klinis ditentukan threshold operasional, bukan AUC. Model bisa akurat tapi tak berguna."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Leakage yang paling sering di model EHR?"
        options={["Data terlalu sedikit",
          "Fitur yang baru tersedia SETELAH prediction time (mis. obat yang diberi setelah kecurigaan)",
          "Model terlalu kompleks",
          "Terlalu banyak validasi"]}
        correct={1}
        explanation="Benar: target leakage — memprediksi masa lalu. Tetapkan prediction time eksplisit dan bekukan fitur di sana."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. TRIPOD adalah…"
        options={["Model machine learning baru",
          "Checklist pelaporan model prediksi agar transparan dan reproducible",
          "Tes diagnostik",
          "Regulasi obat"]}
        correct={1}
        explanation="Benar: standar pelaporan (populasi, prediktor, outcome, validasi, performa). TRIPOD+AI untuk model ML."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kalibrasi</strong> (kejujuran angka) sama pentingnya dengan <strong>diskriminasi</strong> (AUC).</li>
          <li><strong>Brier score</strong> menghukum overconfidence; calibration plot menampakkannya.</li>
          <li>Validasi: <strong>internal &lt; temporal &lt; eksternal</strong>. Klaim generalisasi butuh eksternal.</li>
          <li>Cegah <strong>leakage</strong>: prediction time eksplisit, fitur dibekukan sebelumnya.</li>
          <li><strong>Decision curve</strong>: net benefit pada threshold operasional = bukti utilitas.</li>
          <li>Threshold dari <strong>biaya klinis</strong>, bukan default 0,5.</li>
          <li>Waspadai <strong>drift</strong>: monitoring berkala + rencana rekalibrasi.</li>
          <li>Lapor sesuai <strong>TRIPOD</strong>; libatkan klinisi sebelum deploy.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd11-wrangling-ehr" className="btn btn-secondary btn-sm">← HD11</Link>
        <Link href="/learn/hd13-fairness-kesehatan" className="btn btn-primary btn-sm">HD13 →</Link>
      </div>
    </div>
  );
}
