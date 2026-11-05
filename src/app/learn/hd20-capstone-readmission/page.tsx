"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd20CapstoneReadmissionPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd20FlowData = [{"x": ["Rawat inap", "Eksklusi: <24 jam", "Eksklusi: meninggal", "Eksklusi: terencana", "Kohort final"], "y": [50000, 42000, 40500, 38000, 38000], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["50.000", "42.000", "40.500", "38.000", "38.000"], "textposition": "outside"}];
  const hd20FlowDataLayout = {"xaxis": {"title": "Tahap"}, "yaxis": {"title": "n"}, "showlegend": false};

  const hd20EvalData = [{"x": ["AUC", "Cal. slope", "Net benefit", "TPR gap"], "y": [0.78, 0.99, 1, 0], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1"]}, "text": ["0,78", "0,99", "positif", "9→2%"], "textposition": "outside"}];
  const hd20EvalDataLayout = {"xaxis": {"title": "Metrik"}, "yaxis": {"title": "Nilai", "range": [0, 1.2]}, "showlegend": false};

  const lab1Code = "import random, statistics as st\nrandom.seed(100)\nn = 5000\ndata = []\nfor _ in range(n):\n    usia = random.gauss(60, 15)\n    komorbid = random.randint(0, 5)\n    los = max(1, random.gauss(6, 3))\n    # risiko sebenarnya (logit)\n    logit = -3 + 0.03*usia + 0.4*komorbid + 0.1*los\n    p = 1/(1+2.718**(-logit))\n    readmit = random.random() < p\n    data.append((usia, komorbid, los, readmit))\n# skor sederhana (bobot asal, untuk demo pipeline)\nskor = [0.03*u + 0.4*k + 0.1*l for u, k, l, _ in data]\ny = [r for *_, r in data]\n# AUC kasar via Mann-Whitney\npos = [s for s, yy in zip(skor, y) if yy]\nneg = [s for s, yy in zip(skor, y) if not yy]\nauc = sum(1 for a in pos for b in neg if a > b)/len(pos)/len(neg)\nprint(f'n={n}, readmission rate={sum(y)/n:.1%}')\nprint(f'AUC skor sederhana = {auc:.2f}')\nprint()\nprint('Pipeline: definisi -> fitur pre-discharge -> missing -> model -> evaluasi.')\nprint('Di proyek nyata: ganti skor ini dengan logistic/GBM + validasi temporal.')";

  const lab2Code = "import random\nrandom.seed(101)\n# (grup, prediksi, outcome)\ndata = []\nfor _ in range(3000):\n    bpjs = random.random() < 0.6\n    p_true = random.random()*0.3 + 0.05\n    pred = p_true + (0.04 if bpjs else -0.02)  # miskalibrasi per grup\n    y = random.random() < p_true\n    data.append((bpjs, min(0.99, max(0.01, pred)), y))\nprint(f\"{'grup':<8} {'rata_pred':>9} {'rate_aktual':>11} {'gap':>6}\")\nfor bpjs, nama in [(True, 'BPJS'), (False, 'swasta')]:\n    g = [d for d in data if d[0] == bpjs]\n    rp = sum(d[1] for d in g)/len(g); ra = sum(d[2] for d in g)/len(g)\n    print(f'{nama:<8} {rp:>9.1%} {ra:>11.1%} {abs(rp-ra):>5.1%}')\nprint()\nprint('BPJS: prediksi sistematis lebih tinggi dari realita (overestimate).')\nprint('-> Rekalibrasi per grup sebelum deploy. Jangan rata-ratakan masalahnya.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD20 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Capstone:<br />Model Risiko Readmission End-to-End</h1>
        <div className="meta">60–90 menit • proyek terbimbing • 4 quiz • laporan TRIPOD</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Brief dari Direktur</a></li>
          <li><a href="#tahap1">Tahap 1 — Definisi &amp; Fenotipe</a></li>
          <li><a href="#tahap2">Tahap 2 — Wrangling &amp; Leakage Check</a></li>
          <li><a href="#tahap3">Tahap 3 — Model, Kalibrasi &amp; Fairness</a></li>
          <li><a href="#tahap4">Tahap 4 — Laporan TRIPOD &amp; Presentasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pipeline Fitur Readmission</a></li>
          <li><a href="#lab2">🔬 Lab 2: Audit Fairness &amp; Kalibrasi Model</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Laporan TRIPOD 1 Halaman</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Pre-Mortem Proyek</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Presentasi ke Direksi</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Daftar Periksa Capstone — 10 Jebakan Mematikan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Merancang <strong>proyek analitik kesehatan end-to-end</strong>: dari brief sampai laporan.</li>
          <li>Menerapkan <strong>fenotipe, cegah leakage, kalibrasi, validasi temporal, audit fairness</strong> dalam satu pipeline.</li>
          <li>Menulis <strong>laporan sesuai TRIPOD</strong> + presentasi untuk direktur non-teknis.</li>
          <li>Mengintegrasikan seluruh track HD1–HD19 menjadi satu deliverable portofolio.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Brief dari Direktur</h2>
      <div className="story">
        <p>Email Senin pagi: “Tim Data, readmission 30-hari kita 18% — di atas rata-rata nasional 14%. Direksi minta <strong>model prediksi readmission</strong> agar perawat bisa intervensi dini. Deadline 1 bulan. Budget: akses EHR 3 tahun. Tolong presentasikan ke direksi.”</p>
      <p>Ini capstone-mu: semua lesson HD1–HD19 dipakai sekaligus. Tidak ada jawaban tunggal yang benar — yang dinilai adalah <strong>proses yang defensibel</strong>: definisi yang jelas, leakage yang dicegah, kalibrasi yang jujur, fairness yang diaudit, dan laporan yang bisa dipertanggungjawabkan.</p>
      <p><strong>Twist-nya:</strong> email itu terlihat seperti permintaan <em>model</em> — padahal yang diminta direksi sebenarnya adalah <em>kepercayaan</em>. “Model prediksi readmission” yang akurat tapi tidak terkalibrasi, bocor leakage, bias terhadap pasien miskin, dan dilaporkan dengan grafik menipu <strong>lebih berbahaya daripada tidak punya model sama sekali</strong> — karena ia memberi pembenaran statistik untuk keputusan yang buruk. Capstone ini tidak menilai apakah modelmu “pintar”; ia menilai apakah <strong>seorang dokter berani mempertaruhkan pasiennya pada proses kerjamu</strong>. Itu standar yang jauh lebih tinggi — dan tepat itulah standar analis kesehatan profesional.</p>
      </div>

      <h2 id="tahap1">Tahap 1 — Definisi &amp; Fenotipe (Minggu 1)</h2>
      <p><strong>Definisi.</strong> Tetapkan: <strong>outcome</strong> (readmission tak terencana &lt;30 hari pasca-pulang), <strong>populasi</strong> (dewasa, rawat inap ≥24 jam, eksklusi meninggal/pindah), <strong>prediction time</strong> (saat discharge), dan <strong>fenotipe kovariat</strong> (komorbid via HD11).</p>
      <details className="worked">
        <summary>📐 Contoh: keputusan definisi kunci</summary>
        <p><strong>Readmission terencana</strong> (kemoterapi terjadwal) → eksklusi (bukan kegagalan kualitas).<br /><strong>Meninggal &lt;30 hari tanpa readmit</strong> → competing risk (HD6): analisis sensitivitas.<br /><strong>Prediction time</strong> = jam discharge: fitur hanya yang tersedia SEBELUM itu (cegah leakage, HD11).<br />Dokumentasikan semua dalam <strong>protokol 2 halaman</strong> ditandatangani klinisi.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti membuat kontrak sebelum bangun rumah: mahal di awal (diskusi klinisi 1 minggu), murah di akhir (tidak ada bongkar pasang definisi).</p>
      <p><strong>Kapan memakai:</strong> Selalu mulai di sini. Model yang dibangun di atas definisi kabur = istana pasir.</p>

      <PlotlyChart
        data={hd20FlowData}
        title="Flow Kohort: Dari 50.000 ke 38.000 (CONSORT-style)"
        layout={hd20FlowDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang menyusut di tiap kriteria eksklusi. Inilah flow diagram yang wajib ada di laporan.</p>
        <p><strong>Interpretasi:</strong> 24% data terekslusi dengan alasan terdokumentasi. Flow seperti ini = transparansi; tanpanya, reviewer curiga kamu membuang yang tidak cocok. Setiap eksklusi harus bisa dipertahankan di depan klinisi.</p>
      </div>

      <h2 id="tahap2">Tahap 2 — Wrangling &amp; Leakage Check (Minggu 2)</h2>
      <p><strong>Definisi.</strong> Bangun fitur dari EHR (demografi, komorbid, lab terakhir, LOS, riwayat kunjungan), tangani missing (MICE, HD8), harmonisasi unit (HD11), lalu <strong>audit leakage</strong>: pastikan tak ada fitur dari masa depan.</p>
      <Tex math={String.raw`\text{Fitur valid} \iff t_{fitur} < t_{prediction} \quad \forall \text{ fitur}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`t_{fitur}`} />: waktu ketersediaan fitur</li>
          <li><Tex math={String.raw`t_{prediction}`} />: waktu prediksi (discharge)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Satu fitur bocor (mis. “obat pasca-pulang”) bisa menggelembungkan AUC 0,75 → 0,95. Audit ini bukan opsional.</p>
      <details className="worked">
        <summary>📐 Contoh: leakage yang tertangkap</summary>
        <p>Fitur “jumlah diagnosis saat readmission” lolos ke training — AUC 0,93! Audit: diagnosis itu dicatat <em>saat readmit</em> (masa depan relatif terhadap discharge).<br />Setelah dibuang: AUC 0,76 — jujur dan masih berguna.<br /><strong>Prosedur audit:</strong> untuk tiap fitur, tulis t_ketersediaan; uji ablasi (buang fitur top, lihat AUC anjlok tidak wajar).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti sterilisasi alat operasi: membosankan, tak terlihat, tapi satu keteledoran = infeksi (leakage) yang membunuh kredibilitas.</p>
      <p><strong>Kapan memakai:</strong> Sebelum modeling apapun. Leakage check adalah gerbang, bukan hiasan.</p>

      <h2 id="tahap3">Tahap 3 — Model, Kalibrasi &amp; Fairness (Minggu 3)</h2>
      <p><strong>Definisi.</strong> Latih model (regresi logistik baseline + gradient boosting), split <strong>temporal</strong> (2023–2024 train, 2025 test), evaluasi: <strong>AUC + kalibrasi + decision curve</strong> (HD12), lalu <strong>audit fairness per grup</strong> (HD13: wilayah, usia, pembiayaan).</p>
      <details className="worked">
        <summary>📐 Contoh: hasil evaluasi lengkap</summary>
        <p>AUC temporal 0,78. Calibration slope 0,92 (sedikit overfit, rekalibrasi isotonic → 0,99).<br />Decision curve: net benefit positif pada threshold 15–40% (rentang operasional perawat).<br /><strong>Fairness:</strong> TPR pasien BPJS 72% vs asuransi swasta 81% — disparitas 9 poin. Akar: fitur “kunjungan kontrol” bias ke swasta (informed presence). Mitigasi: threshold per grup + tambah fitur klinis murni.<br />Keputusan: deploy dengan threshold 25% + monitoring bulanan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti ujian tiga mata: pintar (AUC), jujur (kalibrasi), adil (fairness). Lulus dua saja = tidak lulus.</p>
      <p><strong>Kapan memakai:</strong> Urutan evaluasi: diskriminasi → kalibrasi → utilitas → fairness. Jangan optimasi threshold sebelum kalibrasi benar.</p>

      <PlotlyChart
        data={hd20EvalData}
        title="Ringkasan Evaluasi: Empat Lensa"
        layout={hd20EvalDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Empat metrik kunci: diskriminasi, kalibrasi, utilitas, fairness (gap TPR sebelum→sesudah mitigasi).</p>
        <p><strong>Interpretasi:</strong> Model “cukup pintar” (0,78), terkalibrasi (0,99), berguna (net benefit positif), dan disparitas terpangkas 9%→2%. Inilah laporan yang membuat direksi percaya: bukan satu angka, tapi empat lensa.</p>
      </div>

      <h2 id="tahap4">Tahap 4 — Laporan TRIPOD &amp; Presentasi (Minggu 4)</h2>
      <p><strong>Definisi.</strong> Tulis laporan <strong>TRIPOD</strong> (populasi, prediktor, outcome, validasi, performa, keterbatasan) + <strong>slide direksi</strong> (1 pesan per slide, angka absolut, rekomendasi + caveat) + repo reproducible.</p>
      <details className="worked">
        <summary>📐 Contoh: slide 1 untuk direksi</summary>
        <p><strong>Judul:</strong> “Model menemukan 7 dari 10 pasien berisiko readmit — menghemat ~Rp3 M/tahun”<br /><strong>Isi:</strong> Dari 100 pasien risiko tinggi, 35 benar-benar readmit (PPV 35%); intervensi perawat (telepon + kunjungan) mencegah ~30% di antaranya; biaya intervensi Rp50jt/bulan vs penghematan Rp250jt/bulan.<br /><strong>Caveat jujur:</strong> angka dari validasi 2025 satu RS; butuh monitoring; disparitas BPJS terpantau.<br />Inilah HD19 dalam aksi: absolut, ada biaya, ada ketidakpastian.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti sidang skripsi + pitching investor digabung: reviewer menilai ketelitianmu, direksi menilai kegunaanmu. Keduanya harus puas dengan dokumen yang sama.</p>
      <p><strong>Kapan memakai:</strong> Deliverable akhir: laporan + slide + repo + rencana monitoring (drift dashboard bulanan, HD12).</p>
      <div className="callout"><strong>Checklist serah terima:</strong> (1) laporan TRIPOD; (2) repo reproducible (kode+versi data+seed); (3) dashboard monitoring (AUC, kalibrasi, fairness per grup, bulanan); (4) SOP: siapa bertindak saat alert drift; (5) jadwal review 6 bulanan dengan klinisi.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Daftar Periksa Capstone — 10 Jebakan Mematikan</h2>
      <details className="worked">
        <summary>📐 Worked example: audit end-to-end proyek readmission (klik untuk buka)</summary>
        <p>Kamu memimpin proyek 1 bulan: prediksi readmission 30-hari dari EHR 3 tahun (n=40.000 pulang). Berikut audit tahap per tahap:</p>
        <p><strong>Tahap 1 — Definisi (HD1, HD11).</strong> “Readmission” = rawat inap ulang <em>tak terencana</em> dalam 30 hari <em>di RS yang sama</em>? Pasien yang readmit ke RS lain <strong>tak terlihat</strong> → outcome salah ukur (label bias). Keputusan: definisikan eksplisit + catat keterbatasannya di laporan; jangan klaim “readmission nasional”.</p>
        <p><strong>Tahap 2 — Leakage (HD11, HD12).</strong> Fitur “lama rawat” dan “kode discharge” — apakah tersedia <em>saat prediksi dibuat</em> (saat pulang)? “Rencana kontrol ulang” yang ditulis dokter <em>setelah</em> melihat risiko = leakage. Audit waktu tiap fitur: buang yang bocor, seberharga apapun.</p>
        <p><strong>Tahap 3 — Missing (HD8).</strong> Skor nyeri pulang kosong 30% — dan MNAR (yang sakit tidak mengisi). Jangan imputasi mean; pakai indikator missing + analisis sensitivitas, dan laporkan.</p>
        <p><strong>Tahap 4 — Model &amp; kalibrasi (HD12).</strong> AUC 0,78 — cukup. Tapi kurva kalibrasi menunjukkan overconfident di risiko tinggi. Rekalibrasi isotonic; Brier 0,19 → 0,15. Validasi temporal (latih 2021–22, uji 2023): AUC turun ke 0,74 — laporkan keduanya, jangan cuma yang bagus.</p>
        <p><strong>Tahap 5 — Fairness (HD13).</strong> TPR pasien BPJS PBI 12 poin <em>lebih rendah</em> dari pasien umum pada threshold operasional — model sistematis melewatkan pasien miskin yang butuh intervensi. Mitigasi: threshold per grup + audit label (apakah “readmission tercatat” meremehkan kelompok yang readmit ke RS lain?).</p>
        <p><strong>Tahap 6 — Threshold &amp; utilitas (HD9, HD17).</strong> Direksi minta threshold 10% (“tangkap semua!”): PPV hanya 18% → perawat dibanjiri 5 alarm palsu per 1 benar → alarm fatigue dalam 2 minggu. Hitung <em>net benefit</em> per threshold + kapasitas perawat (maks 8 intervensi/hari) → threshold operasional 25%.</p>
        <p><strong>Tahap 7 — Laporan (HD18, HD19).</strong> Tulis ala TRIPOD: partisipan, prediktor, missing, performa (diskriminasi + kalibrasi), validasi, keterbatasan. Grafik untuk direksi: sumbu dari 0, CI ditampilkan, satuan “poin persen” eksplisit. Dashboard perawat: 1 angka aksi + tren + SOP respons.</p>
        <p><strong>Tahap 8 — Monitoring pasca-deploy (HD12).</strong> Jadwalkan evaluasi kalibrasi tiap 3 bulan; definisikan <em>kriteria rollback</em> (“jika Brier naik &gt;0,02, kembali ke skrining manual”). Model tanpa rencana monitoring = proyek yang belum selesai.</p>
        <p><strong>Pelajaran capstone:</strong> nilai proyek bukan di AUC — melainkan di <strong>berapa jebakan yang kamu temukan sendiri sebelum reviewer menemukannya</strong>. Daftar 8 tahap ini adalah CV-mu sebagai analis kesehatan.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — “defensibilitas” adalah mata uang profesional:</strong> Di ruang direksi, tidak ada yang bisa memverifikasi rumusmu — yang mereka nilai adalah <strong>apakah kamu bisa menjawab setiap “bagaimana kalau…”</strong>: bagaimana kalau datanya bias, bagaimana kalau modelnya salah, bagaimana kalau pasiennya miskin. Analis junior menyiapkan jawaban untuk pertanyaan yang <em>diharapkan</em>; analis senior menyiapkan jawaban untuk <em>serangan</em>. Latihan: sebelum presentasi, minta teman memainkan peran “direktur yang skeptis + dokter yang sinis + auditor yang kejam” selama 30 menit. Jika argumenmu selamat, laporanmu siap.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — dari capstone ke karier:</strong> Proyek readmission seperti ini adalah <strong>portofolio ideal</strong> untuk melamar Health Data Scientist di Indonesia: ia memaksa integrasi EHR (HD1/HD11), statistik (HD3–HD10), ML (HD12–HD15), fairness (HD13), dan komunikasi (HD19) — tepat spektrum yang ditanya di interview. Dokumentasikan sebagai <strong>case study 2 halaman</strong>: masalah → 8 tahap audit → keputusan sulit (threshold 25% vs permintaan direksi 10%) → hasil. Satu case study sedalam ini <strong>mengalahkan 5 proyek Kaggle</strong> di mata hiring manager kesehatan — karena menunjukkan judgment, bukan cuma coding.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Pre-Mortem — Bunuh Proyekmu Sebelum Ia Bunuh Kariermu</h2>
      <p>Teknik dari psikolog Gary Klein: <strong>bayangkan proyekmu sudah gagal total</strong> — lalu tulis <em>mengapa</em>. Pre-mortem 1 jam menemukan lebih banyak risiko daripada review 1 minggu, karena ia memberi <strong>izin untuk pesimis</strong>.</p>
      <p><strong>Pre-mortem proyek readmission (contoh):</strong> “Satu tahun kemudian, model dibatalkan direksi. Mengapa?” — (1) <strong>Alarm fatigue</strong>: threshold 10% membanjiri perawat → mereka matikan alert → model “tidak dipakai”. (2) <strong>Drift tak terdeteksi</strong>: tidak ada monitoring → kalibrasi basi 8 bulan tanpa sadar → dokter kehilangan kepercayaan. (3) <strong>Skandal fairness</strong>: jurnalis menemukan model merugikan pasien miskin → RS disorot → proyek dibekukan. (4) <strong>Leakage terlambat ketahuan</strong>: auditor eksternal menemukan fitur bocor → semua hasil dibatalkan → kredibilitas tim hancur. (5) <strong>Outcome salah</strong>: ternyata “readmission” yang diprediksi sebagian besar <em>terencana</em> (kemoterapi terjadwal) → intervensi sia-sia.</p>
      <p><strong>Ubah tiap skenario menjadi pencegahan:</strong> (1) → threshold berbasis kapasitas + pilot. (2) → dashboard monitoring + kriteria rollback <em>sebelum</em> launch. (3) → audit fairness <em>sebelum</em> deploy + dokumentasi. (4) → audit waktu tiap fitur + review independen. (5) → definisi outcome “tak terencana” dengan validasi chart review.</p>
      <p><strong>Aturan pre-mortem:</strong> lakukan <strong>di awal proyek</strong> (bukan akhir), libatkan <strong>orang luar</strong> (mereka tidak buta seperti tim), dan tulis <strong>5 skenario kegagalan + pencegahannya</strong> di dokumen proyek. Dokumen ini adalah <strong>asuransi karier</strong>: jika gagal, kamu bisa tunjukkan kamu <em>mengantisipasi</em> — bukan <em>lalai</em>.</p>
      <div className="callout">
        <p><strong>Prinsip capstone:</strong> analis junior bertanya “bagaimana agar proyek ini <em>berhasil</em>?” — analis senior bertanya “<strong>bagaimana proyek ini bisa <em>gagal</em>, dan apa yang kulakukan hari ini untuk mencegahnya?</strong>” — Pertanyaan kedua 10× lebih berharga.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone = dapat AUC tertinggi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Capstone dinilai dari <strong>proses defensibel</strong>: definisi jelas, leakage dicegah, kalibrasi jujur, fairness diaudit, laporan transparan. AUC 0,76 yang jujur &gt; AUC 0,93 yang bocor. Di dunia nyata, yang kedua dipecat setelah audit.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu model untuk semua RS&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Model ini valid untuk SATU RS, periode tertentu. Klaim generalisasi butuh validasi eksternal (HD12). Tulis batas ini eksplisit — itu kekuatan, bukan kelemahan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Setelah deploy, proyek selesai&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Deploy adalah <em>tengah</em> proyek, bukan akhir. Drift, perubahan protokol, dan EHR baru akan menggerogoti performa. Tanpa monitoring + owner yang jelas, model menjadi fosil dalam 1–2 tahun.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Laporan TRIPOD Satu Halaman</h2>
      <details className="worked">
        <summary>📐 Worked example: ringkasan model readmission ala TRIPOD (klik untuk buka)</summary>
        <p><strong>JUDUL:</strong> Model prediksi readmission 30-hari tak terencana, RS X, 2021–2023.</p>
        <p><strong>SUMBER DATA &amp; PARTISIPAN:</strong> EHR RS X, pasien dewasa pulang hidup 2021–2023 (n=40.000). Eksklusi: meninggal saat rawat (n=800), pulang paksa (n=1.200), data tidak lengkap &lt;50% (n=300). <strong>Outcome:</strong> readmission tak terencana ≤30 hari <em>ke RS X</em> (keterbatasan: readmit ke RS lain tidak tercatat — estimasi undercount ~15% dari studi validasi telepon).</p>
        <p><strong>PREDIKTOR:</strong> 24 fitur, semua <strong>tersedia saat pulang</strong> (audit waktu: 3 fitur kandidat dibuang karena leakage — “rencana kontrol” ditulis setelah skor dihitung). Missing: skor nyeri 30% (MNAR — ditangani dengan indikator + analisis sensitivitas, HD8).</p>
        <p><strong>METODE:</strong> Gradient boosting, validasi temporal (latih 2021–22, uji 2023). Penanganan imbalance: class weight (bukan SMOTE — menjaga kalibrasi).</p>
        <p><strong>HASIL:</strong> AUC 0,78 (95% CI 0,75–0,81); <strong>kalibrasi</strong>: slope 0,94, intercept −0,08 setelah rekalibrasi isotonic; Brier 0,15. <strong>Fairness</strong>: TPR BPJS PBI 61% vs umum 73% pada threshold operasional — <strong>gap diakui</strong>, mitigasi threshold per grup diusulkan (belum diimplementasi — status: <em>open issue</em>).</p>
        <p><strong>THRESHOLD OPERASIONAL:</strong> 25% (net benefit maksimal pada kapasitas 8 intervensi/hari; PPV 34%, sensitivitas 58%). <strong>BUKAN</strong> 10% yang diminta direksi — dengan alasan terdokumentasi (alarm fatigue, HD12).</p>
        <p><strong>KETERBATASAN (jujur):</strong> (1) Single-center — butuh validasi eksternal. (2) Outcome undercount ~15%. (3) Gap fairness PBI belum tertutup. (4) Drift: re-evaluasi tiap 6 bulan, kriteria rollback Brier &gt;0,18.</p>
        <p><strong>KESIMPULAN:</strong> model layak <strong>pilot terbatas</strong> (2 bangsal, 3 bulan) dengan monitoring — <strong>bukan</strong> roll-out penuh. Keputusan akhir setelah pilot.</p>
        <p><strong>Pelajaran:</strong> satu halaman ini mengandung <strong>semua</strong> yang direksi, dokter, dan auditor butuhkan — dan yang terpenting: <strong>kejujuran tentang apa yang belum beres</strong>. Laporan yang berani menulis “open issue” lebih dipercaya daripada yang mengklaim sempurna.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Latih menulis <strong>ringkasan 1 halaman</strong> untuk setiap proyek — paksa dirimu memadatkan 3 bulan kerja menjadi: data, metode, hasil (diskriminasi + kalibrasi!), keterbatasan, keputusan. Jika tidak muat 1 halaman, analisismu <strong>belum matang</strong>.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Kerjakan <strong>berurutan tahap 1→4</strong>; jangan loncat ke modeling sebelum definisi dikunci. 80% kegagalan proyek analitik lahir di tahap 1–2.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan <strong>decision log</strong>: tiap keputusan penting (definisi, eksklusi, threshold) + alasan + tanggal. Ini yang ditanya direksi 6 bulan kemudian.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Presentasikan <strong>kegagalan</strong> juga (leakage yang tertangkap, disparitas awal). Kejujuran tentang proses = kredibilitas tertinggi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Pipeline Fitur Readmission (Simulasi)</h2>
      <p>Bangkitkan kohort sintetis (n=5.000): usia, komorbid, LOS, lab. Terapkan aturan: fitur hanya dari sebelum discharge; bangun skor sederhana; ukur AUC kasar.</p>
      <PyodideLab
        title="🔬 Lab 1: Pipeline Fitur Readmission (Simulasi)"
        hint="Coba tambahkan fitur bocor (‘obat_pasca_pulang’ yang korelasi dengan outcome). Lihat AUC melonjak — lalu buang dan rasakan AUC jujur."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Audit Kalibrasi &amp; Fairness Model</h2>
      <p>Diberikan prediksi dan outcome per grup, hitung calibration-in-the-large per grup + disparitas TPR. Tentukan: lolos deploy atau perlu mitigasi?</p>
      <PyodideLab
        title="🔬 Lab 2: Audit Kalibrasi &amp; Fairness Model"
        hint="Kriteria lolos: |rata prediksi − rate aktual| < 3% per grup DAN disparitas TPR < 5%. Berapa grup yang gagal? Itulah backlog mitigasimu."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Presentasi ke Direksi RS Indonesia</h2>
      <p>Kamu presentasi model readmission ke direksi RS di Indonesia. Ruangan: direktur (dokter senior, sibuk), kabag keuangan (peduli biaya), komite medik (skeptis pada “AI”). <strong>Strategi presentasi 20 menit:</strong></p>
      <p><strong>Menit 0–3 — Masalah dalam bahasa mereka.</strong> Bukan “AUC 0,78”. Melainkan: “Readmission kita 18% vs nasional 14%. Tiap 1% = ~120 pasien/tahun = RpX miliar biaya + penalti mutu. <strong>Separuh readmission bisa dicegah</strong> dengan intervensi dini — tapi perawat tidak tahu <em>siapa</em> yang berisiko.” — <strong>Uang + mutu + orang</strong>: tiga bahasa direksi.</p>
      <p><strong>Menit 3–10 — Solusi + bukti (jujur).</strong> “Model memprediksi risiko saat pulang. Akurasi: dari 100 pasien risiko tinggi, 34 benar-benar kembali (PPV 34%) — <strong>3× lebih baik</strong> dari tebak acak. Yang penting: <strong>angkanya jujur</strong> (terkalibrasi) dan <strong>sudah diuji</strong> di data 2023 yang tidak dipakai melatih.” Tunjukkan <strong>kurva kalibrasi</strong> (satu gambar!) — bukan ROC.</p>
      <p><strong>Menit 10–15 — Apa yang diminta dari mereka.</strong> “Kami minta <strong>pilot 3 bulan di 2 bangsal</strong>: perawat dapat daftar 8 pasien risiko tertinggi tiap pagi + SOP kunjungan rumah. Biaya: X jam perawat/minggu. <strong>Tolak</strong> permintaan threshold 10% — dengan alasan: …” — <strong>Berani menolak</strong> permintaan direksi yang salah (dengan data!) adalah momen yang menentukan reputasimu: penurut tidak dipercaya, penolak berdasar <strong>dihormati</strong>.</p>
      <p><strong>Menit 15–20 — Risiko &amp; monitoring.</strong> “Risiko: model bisa basi (kami pantau tiap bulan), bisa bias ke pasien miskin (kami audit — ini angkanya, dan ini rencananya). <strong>Kriteria berhenti</strong> kami tetapkan <em>sebelum</em> mulai.” — Direksi Indonesia menghormati analis yang <strong>datang dengan rem</strong>, bukan cuma gas.</p>
      <p><strong>Etika presentasi Indonesia:</strong> (1) <strong>Jangan menggurui dokter senior</strong> — framing: “model <em>membantu</em> pengalaman dokter, bukan menggantikan”. (2) <strong>Libatkan komite medik sejak awal</strong> — penolakan di akhir 10× lebih mahal dari konsultasi di awal. (3) <strong>Bahasa Indonesia yang baik</strong> — presentasi campur Inggris berlebihan <strong>menurunkan</strong> kepercayaan di banyak RS daerah.</p>
      <div className="tip">
        <p><strong>💡 Intuisi terakhir capstone:</strong> proyek yang <strong>dipresentasikan dengan baik tapi biasa-biasa saja</strong> sering menang atas proyek <strong>brilian tapi tidak bisa dijelaskan</strong>. 20 menit di ruang direksi = <strong>ujian akhir</strong> yang sebenarnya. Kuasai, dan seluruh track HD1–HD20 menjadi <strong>karier</strong> — bukan sekadar sertifikat.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Mulai proyek → Kunci definisi + prediction time</h3>
        <p><strong>Kondisi:</strong> Selalu, tanpa kecuali.</p>
        <p><strong>Kenapa:</strong> Fondasi semua tahap berikutnya.</p>
        <p><strong>Contoh nyata:</strong> Protokol 2 halaman ditandatangani klinisi.</p>
      </div>
      <div className="decision-card">
        <h3>2. Pilih fitur → Audit t_ketersediaan per fitur</h3>
        <p><strong>Kondisi:</strong> Sebelum modeling.</p>
        <p><strong>Kenapa:</strong> Satu leakage merusak segalanya.</p>
        <p><strong>Contoh nyata:</strong> Buang fitur pasca-discharge; uji ablasi.</p>
      </div>
      <div className="decision-card">
        <h3>3. Evaluasi → Empat lensa (AUC, kalibrasi, utilitas, fairness)</h3>
        <p><strong>Kondisi:</strong> Sebelum klaim apapun.</p>
        <p><strong>Kenapa:</strong> Satu lensa = buta tiga sisi.</p>
        <p><strong>Contoh nyata:</strong> Decision curve + audit TPR per grup.</p>
      </div>
      <div className="decision-card">
        <h3>4. Serah terima → TRIPOD + monitoring + owner</h3>
        <p><strong>Kondisi:</strong> Deploy.</p>
        <p><strong>Kenapa:</strong> Model tanpa monitoring = fosil.</p>
        <p><strong>Contoh nyata:</strong> Dashboard bulanan + SOP drift + review 6 bulanan.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Definisi dulu, model kemudian.</li>
          <li>Leakage check = gerbang wajib.</li>
          <li>Empat lensa evaluasi, selalu.</li>
          <li>Deploy = tengah proyek, bukan akhir.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Direksi Minta Threshold 10% (“Tangkap Semua!”)</h2>
      <div className="callout">
        <p>Model readmission siap. Direksi: “Set threshold 10% — tangkap semua yang berisiko!” Pada threshold 10%: sensitivitas 90%, PPV 12%. Kapasitas perawat: 50 intervensi/bulan. Pasien risiko &gt;10%: 400/bulan.</p>
        <p><strong>Pertanyaan:</strong> Apa masalahnya dan apa rekomendasi threshold-mu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>400 pasien &gt; kapasitas 50 = 350 tidak terintervensi + alert fatigue (88% false positive → perawat berhenti percaya). Rekomendasi: threshold 25% → ~60 pasien/bulan (sesuai kapasitas), PPV 35%, sensitivitas 65%. Jelaskan trade-off dengan decision curve: pada kapasitas terbatas, <strong>presisi mengalahkan recall</strong> — 50 intervensi tepat sasaran &gt; 400 alarm yang diabaikan. Tawarkan bertahap: mulai 25%, tambah perawat bila terbukti hemat, baru turunkan threshold. Pelajaran capstone: model terbaik pun gagal bila threshold buta operasional.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Langkah PERTAMA proyek model klinis yang benar?"
        options={["Pilih algoritma ML",
          "Kunci definisi outcome/populasi/prediction time bersama klinisi",
          "Kumpulkan semua fitur",
          "Tuning hyperparameter"]}
        correct={1}
        explanation="Benar: kontrak definisi dulu. 80% kegagalan lahir di tahap 1–2, bukan di modeling."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Fitur “jumlah diagnosis saat readmission” untuk prediksi saat discharge adalah…"
        options={["Fitur terbaik",
          "Target leakage — dari masa depan relatif terhadap prediction time",
          "Wajib dipakai",
          "Netral"]}
        correct={1}
        explanation="Benar: t_fitur > t_prediction. Audit ketersediaan per fitur adalah gerbang wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Urutan evaluasi model klinis yang benar?"
        options={["AUC saja cukup",
          "Diskriminasi → kalibrasi → utilitas (decision curve) → fairness",
          "Fairness dulu",
          "Tergantung mood"]}
        correct={1}
        explanation="Benar: empat lensa berurutan. Satu lensa = buta tiga sisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Disparitas TPR 9 poin antar grup pembiayaan ditemukan. Tindakan?"
        options={["Sembunyikan",
          "Investigasi akar (fitur bias), mitigasi (threshold per grup/fitur adil), laporkan transparan",
          "Hapus grup minoritas",
          "Naikkan threshold global"]}
        correct={1}
        explanation="Benar: audit → mitigasi → lapor. Fairness adalah bagian deliverable, bukan lampiran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Setelah deploy, yang WAJIB ada?"
        options={["Tidak ada, proyek selesai",
          "Monitoring drift berkala + owner + SOP + jadwal review klinisi",
          "Hapus kode lama",
          "Lupakan"]}
        correct={1}
        explanation="Benar: deploy = tengah proyek. Tanpa monitoring, model menjadi fosil dalam 1–2 tahun."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Direksi minta threshold 10% (tangkap semua) tapi kapasitas 50/bulan vs 400 pasien. Rekomendasi?"
        options={["Ikuti saja",
          "Threshold 25% sesuai kapasitas: presisi > recall saat sumber daya terbatas + decision curve",
          "Threshold 50%",
          "Tanpa threshold"]}
        correct={1}
        explanation="Benar: 400 alarm yang diabaikan < 50 intervensi tepat. Threshold adalah keputusan operasional, bukan statistik."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Capstone = <strong>proses defensibel</strong>, bukan AUC tertinggi.</li>
          <li>Tahap 1: <strong>definisi + prediction time</strong> dikunci bersama klinisi.</li>
          <li>Tahap 2: wrangling + <strong>leakage audit</strong> per fitur.</li>
          <li>Tahap 3: <strong>empat lensa</strong> — diskriminasi, kalibrasi, utilitas, fairness.</li>
          <li>Tahap 4: <strong>TRIPOD + slide direksi + repo + monitoring</strong>.</li>
          <li>Threshold dari <strong>kapasitas operasional</strong>, bukan default.</li>
          <li>Deploy = tengah proyek; <strong>monitoring + owner</strong> wajib.</li>
          <li>Selamat — kamu kini punya <strong>portofolio end-to-end</strong> Health Data Science.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd19-pelaporan-klinis" className="btn btn-secondary btn-sm">← HD19</Link>
        <Link href="/learn/bi1-biologi-molekuler" className="btn btn-primary btn-sm">BI1 →</Link>
      </div>
    </div>
  );
}
