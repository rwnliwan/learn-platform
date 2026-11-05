"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR20Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const roadmapData = [
    {
      x: ["M1: Data & label", "M2: Rule engine", "M3: Fitur", "M4: Model", "M5: Threshold", "M6: Deploy & tulis"],
      y: [15, 20, 20, 20, 15, 10],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["15%", "20%", "20%", "20%", "15%", "10%"],
      textposition: "outside",
    },
  ];

  const finalData = [
    {
      x: ["Rule saja", "ML saja", "Rule + ML", "Rule + ML + prioritas"],
      y: [42, 68, 81, 89],
      type: "bar",
      marker: { color: ["#94a3b8", "#e8a838", "#2a7de1", "#7bc96f"] },
      text: ["42%", "68%", "81%", "89%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# CAPSTONE Lab 1: bangun MINI FRAUD SYSTEM end-to-end (ringkas!)
# Data sintetis: 5000 transaksi, 100 fraud berpola.
import random
random.seed(61)

# --- M1: DATA & LABEL (dengan 'lag' sederhana: 20 fraud belum ketahuan) ---
data = []
for i in range(5000):
    is_fraud = random.random() < 0.02
    v = random.gauss(12, 3) if is_fraud else random.gauss(2.5, 1.5)  # velocity
    d = 1 if (is_fraud and random.random() < 0.7) else (1 if random.random() < 0.1 else 0)  # device baru
    n = random.gauss(3, 2) if is_fraud else random.gauss(0.5, 0.4)  # nominal jt
    v, n = max(0, v), max(0, n)
    # label: 20% fraud 'belum ketahuan' (lag!) -> tak berlabel
    label = 1 if (is_fraud and random.random() < 0.8) else 0
    data.append((v, d, n, label, is_fraud))

# --- M2: RULE ENGINE ---
def rule(v, d, n):
    return (v > 6 and d == 1) or n > 8

# --- M4: MODEL (skor sederhana ~ 'GBM mini') ---
def skor(v, d, n):
    return min(1.0, v/15*0.5 + d*0.3 + min(n/10, 1)*0.2)

# --- M5: THRESHOLD dari kapasitas ---
KAPASITAS = 300
skor_semua = sorted([skor(v, d, n) for v, d, n, _, _ in data], reverse=True)
thr = skor_semua[KAPASITAS]  # ambang agar alert == kapasitas

# --- EVALUASI: rule saja vs rule+model+threshold ---
def evaluasi(pakai):
    tp = fp = 0
    for v, d, n, _, yt in data:
        flag = rule(v, d, n) if pakai == "rule" else (skor(v, d, n) >= thr or rule(v, d, n))
        if flag and yt: tp += 1
        elif flag: fp += 1
    fn = sum(yt for _, _, _, _, yt in data) - tp
    recall = tp / (tp + fn) * 100
    prec = tp / (tp + fp) * 100 if tp + fp else 0
    net = tp * 1_100_000 - fp * 25_000 - fn * 1_100_000
    return recall, prec, net

for p in ["rule", "gabungan"]:
    r, pr, net = evaluasi(p)
    print(f"{p:8s}: recall={r:5.1f}%  precision={pr:5.1f}%  NET=Rp{net/1e6:6.1f} jt")
print(f"\nThreshold dari kapasitas 300: {thr:.3f}")
print("TUGAS: ubah KAPASITAS 300 -> 100. Mana yang recall-nya lebih tahan?")
print("Jawaban biasanya: gabungan — bukti arsitektur berlapis (FR5: rule+ML).")`;

  const lab2Code = `# CAPSTONE Lab 2: analisis BIAYA-MANFAAT threshold (laporan direksi!)
# Untuk tiap threshold kandidat: hitung NET rupiah + cek kapasitas.
import random
random.seed(63)

data = []
for _ in range(20000):
    is_f = random.random() < 0.02
    s = random.gauss(0.75, 0.15) if is_f else random.gauss(0.25, 0.15)
    data.append((max(0, min(1, s)), is_f))

KAPASITAS = 800
print(f"{'Thr':>5s} {'Alert':>6s} {'Recall':>7s} {'Net (jt)':>9s}  Keputusan")
terbaik = None
for thr in [0.3, 0.4, 0.5, 0.6, 0.7]:
    fl = [(s, y) for s, y in data if s >= thr]
    tp = sum(y for _, y in fl)
    fp = len(fl) - tp
    fn = sum(y for _, y in data) - tp
    net = (tp * 1_100_000 - fp * 25_000 - fn * 1_100_000) / 1e6
    rec = tp / (tp + fn) * 100
    muat = len(fl) <= KAPASITAS
    tag = "✅ PILIH" if (muat and (terbaik is None or net > terbaik[1])) else ("❌ jebol" if not muat else "")
    if muat and (terbaik is None or net > terbaik[1]): terbaik = (thr, net)
    print(f"{thr:5.1f} {len(fl):6d} {rec:6.1f}% {net:8.1f}  {tag}")
print(f"\nRekomendasi direksi: threshold {terbaik[0]} (net Rp{terbaik[1]:.1f} jt, muat kapasitas)")
print("TUGAS: tulis 3 kalimat 'mengapa threshold ini' untuk slide direksi.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR20 — Fraud / ML Analytics • CAPSTONE</span>
        <h1 className="display-title">Capstone: Bangun Fraud Detector<br />End-to-End dalam 6 Milestone</h1>
        <div className="meta">Proyek mini &bull; 2 lab capstone &bull; 5 quiz &bull; 1 laporan direksi &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Proyek</a></li>
          <li><a href="#cerita">Cerita Pembuka: Interview yang Dimenangkan Portofolio</a></li>
          <li><a href="#arsitektur">Arsitektur Target: Apa yang Kamu Bangun</a></li>
          <li><a href="#m1">M1: Data &amp; Label (dengan Lag!)</a></li>
          <li><a href="#m2">M2: Rule Engine</a></li>
          <li><a href="#m3">M3: Feature Engineering</a></li>
          <li><a href="#m4">M4: Model Supervised</a></li>
          <li><a href="#m5">M5: Threshold &amp; Analisis Biaya-Manfaat</a></li>
          <li><a href="#m6">M6: Laporan Direksi (Deliverable!)</a></li>
          <li><a href="#lab1">🔬 Lab Capstone 1: Mini Fraud System</a></li>
          <li><a href="#lab2">🔬 Lab Capstone 2: Analisis Biaya Threshold</a></li>
          <li><a href="#worked">📐 Worked Example: Business Case &amp; Presentasi Direksi</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Selesai Mengalahkan Sempurna</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Saat Proyekmu Buntu</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Scope &amp; Build-vs-Buy</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: 90 Hari Membangun dari Nol</a></li>

          <li><a href="#case">📋 Mini-Case: Presentasi 5 Menit ke Direksi</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Capstone</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman Track 2</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Proyek</h2>
      <div className="callout">
        <ul>
          <li>Membangun <strong>fraud detector end-to-end</strong>: rule engine + model ML + threshold berbasis biaya.</li>
          <li>Menerapkan <strong>time split + embargo</strong> pada data berlabel-lag (bukan random split!).</li>
          <li>Menyusun <strong>analisis biaya-manfaat threshold</strong> dalam rupiah untuk direksi.</li>
          <li>Menghasilkan <strong>deliverable portofolio</strong>: laporan 1 halaman + kode + kurva keputusan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Interview yang Dimenangkan Portofolio</h2>
      <div className="story">
        <p>Dua kandidat melamar posisi Fraud Analyst di fintech Jakarta. Kandidat A: &ldquo;Saya bisa Python, SQL, dan XGBoost. Saya pernah ikut bootcamp.&rdquo; Kandidat B membuka laptop: <em>&ldquo;Ini mini fraud detector yang saya bangun — rule engine 6 rule, model XGBoost, threshold saya hitung dari kapasitas 5 investigator dan biaya review Rp25 ribu. Net-nya Rp892 juta per bulan. Ini kurva trade-off-nya, ini kenapa saya pilih threshold 0,6 bukan 0,5, dan ini keterbatasannya.&rdquo;</em></p>
        <p>Kandidat B diterima — <strong>tanpa pengalaman kerja fraud sama sekali</strong>. Pewawancara kemudian berkata: &ldquo;Kami tidak butuh orang yang <em>bisa</em> XGBoost. Kami butuh orang yang <em>berpikir seperti analis fraud</em> — dan portofoliomu membuktikannya dalam 10 menit.&rdquo;</p>
        <p>Twist-nya: yang membedakan B bukan modelnya (standar!), melainkan <strong>keputusan-keputusannya</strong>: kenapa threshold ini, kenapa time split, berapa biayanya, apa keterbatasannya. <strong>Perekrut fraud tidak merekrut &ldquo;tangan yang bisa coding&rdquo; — mereka merekrut &ldquo;otak yang bisa memutuskan&rdquo;</strong>. Capstone ini membangun bukti itu.</p>
      </div>

      <h2 id="arsitektur">Arsitektur Target: Apa yang Kamu Bangun</h2>
      <p>Sistem mini dengan 4 lapis (ingat FR5: berlapis!):</p>
      <ol>
        <li><strong>Rule engine</strong> — 4–6 rule (velocity, device baru, nominal, lokasi) dengan hit rate terukur.</li>
        <li><strong>Feature engineering</strong> — 8+ fitur (window agregat, baseline user, recency).</li>
        <li><strong>Model supervised</strong> — gradient boosting + class weight, validasi <strong>time split</strong>.</li>
        <li><strong>Threshold &amp; antrian</strong> — dari kapasitas + matriks biaya; prioritas skor tertinggi.</li>
      </ol>
      <p><strong>Output akhir:</strong> laporan 1 halaman (format M6) + kode + 3 chart (kurva PR, trade-off threshold, net rupiah).</p>

      <PlotlyChart
        data={roadmapData}
        title="Alokasi Waktu 6 Milestone (%, ilustrasi)"
        layout={{ xaxis: { title: "Milestone" }, yaxis: { title: "% waktu" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = porsi waktu untuk satu milestone.</p>
        <p><strong>Interpretasi:</strong> <strong>data+label+rule+fitur = 55%</strong> — lebih dari setengah proyek <em>bukan</em> modeling! Ini realita kerja fraud analyst: model (20%) adalah bagian kecil. <strong>Pelajaran karir:</strong> yang membedakan profesional bukan &ldquo;bisa modeling&rdquo;, tapi &ldquo;bisa menyiapkan segalanya sebelum modeling&rdquo;.</p>
      </div>

      <h2 id="m1">M1: Data &amp; Label (dengan Lag!)</h2>
      <p><strong>Tugas:</strong> buat (atau pakai) dataset transaksi sintetis dengan <strong>chargeback lag realistis</strong>:</p>
      <ul>
        <li>10.000+ transaksi, fraud rate ~2%, dengan <strong>timestamp</strong>.</li>
        <li>Simulasikan lag: 20–30% fraud &ldquo;belum ketahuan&rdquo; (tak berlabel) — seperti FR4.</li>
        <li><strong>Keputusan yang dinilai:</strong> bagaimana kamu menangani label belum matang? (Embargo? PU? Ditulis eksplisit!)</li>
      </ul>
      <div className="callout callout-warning">
        <p><strong>Jebakan M1:</strong> memakai semua data termasuk 2 bulan terakhir sebagai &ldquo;negatif&rdquo; = mengulang kesalahan PayKu (FR4). Pewawancara senior <em>menunggu</em> kamu menyebut embargo.</p>
      </div>

      <h2 id="m2">M2: Rule Engine</h2>
      <p><strong>Tugas:</strong> tulis 4–6 rule dengan <strong>anatomi lengkap</strong> (FR5): kondisi, aksi, prioritas, expiry, owner.</p>
      <ul>
        <li>Minimal: 1 velocity rule, 1 device rule, 1 nominal rule, 1 kombinasi.</li>
        <li><strong>Ukur hit rate tiap rule</strong> — sajikan tabelnya.</li>
        <li><strong>Keputusan yang dinilai:</strong> rule mana yang <em>hold</em> vs <em>monitor</em>? Mengapa?</li>
      </ul>

      <h2 id="m3">M3: Feature Engineering</h2>
      <p><strong>Tugas:</strong> bangun 8+ fitur (FR6):</p>
      <ul>
        <li>3 window agregat (beda horizon!), 2 baseline-deviasi, 1 recency, 1 impossible-travel-style, 1 kombinasi.</li>
        <li><strong>Dilarang:</strong> &ldquo;nominal mentah&rdquo; tanpa baseline sebagai fitur utama.</li>
        <li><strong>Keputusan yang dinilai:</strong> kenapa window ini? (Selaras tempo serangan — FR6.)</li>
      </ul>

      <h2 id="m4">M4: Model Supervised</h2>
      <p><strong>Tugas:</strong> latih gradient boosting dengan:</p>
      <ul>
        <li><strong>Time split</strong> (bukan random!) + embargo — tulis tanggal split-nya.</li>
        <li>Class weight dari √rasio, tune sampai biaya total berhenti turun.</li>
        <li><strong>Metrik utama: PR-AUC</strong> (+ ROC-AUC sebagai pelengkap).</li>
        <li><strong>Keputusan yang dinilai:</strong> kenapa bukan SMOTE? Kenapa PR-AUC bukan akurasi?</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> M4 adalah milestone <em>termudah dinilai</em> pewawancara — bukan dari angkanya, tapi dari <strong>alasan metodologismu</strong>. &ldquo;PR-AUC 0,81 dengan time split&rdquo; &gt; &ldquo;akurasi 99% dengan random split&rdquo; — yang kedua justru <em>red flag</em> (FR10!).</p>
      </div>

      <h2 id="m5">M5: Threshold &amp; Analisis Biaya-Manfaat</h2>
      <p><strong>Tugas:</strong> tentukan threshold dengan <strong>prosedur 3 langkah</strong> (FR11):</p>
      <ol>
        <li>Hitung <Tex math={String.raw`\tau^* = C_{FP}/(C_{FP}+C_{FN})`} /> dari matriks biaya (tentukan sendiri angkanya + justifikasi!).</li>
        <li>Cek muat kapasitas (asumsikan 5 investigator × 80 review/hari).</li>
        <li>Sajikan <strong>kurva net rupiah vs threshold</strong> — pilih titiknya, jelaskan trade-off-nya.</li>
      </ol>
      <p><strong>Keputusan yang dinilai:</strong> inilah <em>jantung</em> capstone — analis yang bisa bilang &ldquo;threshold 0,6 karena net Rp892 jt dan muat kapasitas; 0,5 memang recall lebih tinggi tapi jebol kapasitas&rdquo; = <strong>berpikir seperti profesional</strong>.</p>

      <h2 id="m6">M6: Laporan Direksi (Deliverable!)</h2>
      <p><strong>Tugas:</strong> tulis laporan <strong>1 halaman</strong> dengan struktur:</p>
      <ul>
        <li><strong>Judul + angka utama:</strong> &ldquo;Fraud detector net RpX jt/bulan&rdquo;.</li>
        <li><strong>Metode (3 baris):</strong> data, model, validasi.</li>
        <li><strong>Keputusan kunci (3 bullet):</strong> threshold + alasannya dalam rupiah.</li>
        <li><strong>Keterbatasan (2 bullet):</strong> apa yang belum ditangani (jujur! — mis. &ldquo;belum menangani APP scam&rdquo;).</li>
        <li><strong>Langkah berikut (2 bullet):</strong> apa yang ditingkatkan jika ada 1 bulan lagi.</li>
      </ul>
      <p><strong>Kenapa 1 halaman:</strong> direksi tidak membaca 20 halaman. Kemampuan <strong>meringkas tanpa kehilangan kebenaran</strong> = skill karir #1.</p>

      <h2 id="lab1">🔬 Lab Capstone 1: Mini Fraud System</h2>
      <p>Prototype end-to-end: data ber-lag → rule → model → threshold kapasitas.</p>
      <PyodideLab
        title="Lab Capstone 1 — Mini Fraud System (M1-M5 ringkas)"
        hint="Ubah KAPASITAS 300 → 100. Mana yang recall-nya lebih tahan: rule saja atau gabungan? Itulah bukti arsitektur berlapis."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab Capstone 2: Analisis Biaya Threshold</h2>
      <PyodideLab
        title="Lab Capstone 2 — Kurva Net Rupiah (M5)"
        hint="Tulis 3 kalimat 'mengapa threshold ini' untuk slide direksi. Latihan meringkas = latihan karir."
        defaultCode={lab2Code}
      />

      <PlotlyChart
        data={finalData}
        title="Recall Tipikal per Arsitektur (ilustrasi — pada precision sebanding)"
        layout={{ xaxis: { title: "Arsitektur" }, yaxis: { title: "Recall (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = recall tipikal satu arsitektur pada precision yang sebanding.</p>
        <p><strong>Interpretasi:</strong> <strong>rule+ML+prioritas (89%)</strong> mengalahkan tiap komponen sendirian — bukti kuantitatif <em>mengapa</em> arsitektur berlapis (FR5). Capstone-mu harus menunjukkan pola yang sama: <strong>kombinasi &gt; bagian</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone = model dengan skor tertinggi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> capstone dinilai dari <strong>keputusan</strong>, bukan skor. &ldquo;PR-AUC 0,81 + threshold beralasan + keterbatasan jujur&rdquo; mengalahkan &ldquo;PR-AUC 0,95 tanpa penjelasan&rdquo; — karena yang kedua berbau kebocoran (FR10) dan pewawancara tahu itu.</p>
      </div>

      <h2 id="worked">📐 Worked Example: Dari Model ke Keputusan Direksi</h2>
      <p>Capstone bukan soal model terbaik — tapi <strong>rekomendasi yang bisa dipertahankan</strong>. Dua contoh pengerjaannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: business case sistem fraud untuk e-wallet baru</summary>
        <p>E-wallet &ldquo;DompetKita&rdquo; baru launching: proyeksi 2 juta transaksi/bulan akhir tahun pertama. Founder bertanya: &ldquo;perlu tim fraud sekarang atau nanti?&rdquo;</p>
        <p><strong>Langkah 1 — estimasi eksposur.</strong> Benchmark industri: fraud rate e-wallet 0,3–0,5%, severity rata-rata Rp380rb. Ambil tengah: E[Loss] = 2.000.000 × 0,004 × 380.000 = <strong>Rp3,04 M/bulan</strong> di akhir tahun 1.</p>
        <p><strong>Langkah 2 — desain bertahap.</strong> Fase 1 (bulan 1–3, volume kecil): 15 rule dasar + 1 analis (biaya Rp35jt/bulan) → potong 40% loss = hemat Rp1,2 M (saat volume penuh). Fase 2 (bulan 4–9): tambah device intelligence + model GBM sederhana (investasi Rp400jt sekali + Rp60jt/bulan) → potong 60% = hemat Rp1,8 M/bulan. Fase 3 (tahun 2): graph + realtime penuh.</p>
        <p><strong>Langkah 3 — rekomendasi.</strong> <strong>Mulai fase 1 SEKARANG</strong> (bukan &ldquo;nanti&rdquo;): biaya Rp35jt/bulan vs eksposur yang tumbuh ke Rp3 M/bulan. Argumen kuncinya: <strong>pertahanan yang dibangun saat volume kecil 10× lebih murah</strong> daripada memadamkan kebakaran saat volume besar — karena rule &amp; data history butuh waktu matang (FR4: label lag!). Menunda = membayar bunga keterlambatan.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menerjemahkan &ldquo;recall 0,72&rdquo; ke bahasa direksi</summary>
        <p>Model capstone-mu: precision 0,25, recall 0,72. Direksi bertanya: &ldquo;bagus atau tidak?&rdquo; — jawaban &ldquo;F1-nya 0,37&rdquo; = kamu gagal berkomunikasi.</p>
        <p><strong>Langkah 1 — ke operasional.</strong> Volume 1 juta trx/bulan, fraud rate 0,2% → 2.000 fraud. Recall 0,72 → <strong>1.440 tertangkap</strong>, 560 lolos. Precision 0,25 → flag = 1.440/0,25 = <strong>5.760 review/bulan</strong> = 288/hari = <strong>4 investigator</strong> (80/hari).</p>
        <p><strong>Langkah 2 — ke rupiah.</strong> Nilai: 1.440 × Rp1,1jt = Rp1,58 M dicegah. Biaya: 5.760 × Rp25rb = Rp144jt + 4 investigator Rp60jt = Rp204jt. <strong>Net: +Rp1,38 M/bulan.</strong></p>
        <p><strong>Langkah 3 — kalimat direksi.</strong> &ldquo;Sistem ini butuh 4 orang dan Rp204jt/bulan, menyelamatkan Rp1,58 M/bulan — <strong>balik modal 7,7×</strong>. Dari 5 fraud, hampir 4 tertangkap. Yang lolos 560 kasus/bulan — itu pekerjaan tahap 2.&rdquo; <strong>Satu paragraf ini lebih berharga daripada 50 halaman metrik.</strong> Capstone yang hebat = analis yang bisa duduk di kedua sisi meja: membangun model <em>dan</em> menjualnya.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Selesai Mengalahkan Sempurna</h2>
      <p>Capstone yang tidak selesai = <strong>nol nilai</strong>, seberapa pun canggih rancangannya. Proyek 90 hari yang mengirim sistem sederhana tapi bekerja mengalahkan proyek 18 bulan yang mati di bulan ke-8 — <em>selalu</em>. <strong>Momentum adalah mata uang organisasi:</strong> setiap pengiriman yang bekerja membeli kepercayaan untuk fase berikutnya; setiap janji yang molor menjualnya.</p>
      <p>Intuisi kedua: <strong>capstone dinilai dari <em>keputusan</em>, bukan dari <em>model</em></strong>. Penilai (direksi, atasan, klien) tidak bertanya &ldquo;AUC-nya berapa?&rdquo; — mereka bertanya &ldquo;kenapa ini prioritas? berapa biayanya? apa risikonya? bagaimana jika gagal?&rdquo; Analis hebat menjawab keduanya; analis luar biasa <strong>menerjemahkan</strong> yang pertama menjadi yang kedua tanpa diminta.</p>
      <p><strong>Kapan ambisi capstone harus DIPOTONG:</strong> (1) <strong>tidak ada hasil parsial dalam 30 hari</strong> — potong scope sampai ada; (2) <strong>dependensi ke &gt; 2 tim</strong> — setiap dependensi = risiko molor eksponensial; (3) <strong>&ldquo;fase 1&rdquo; butuh semuanya selesai</strong> — itu bukan fase, itu big bang berkedok. <strong>Potong sampai yang tersisa bisa dikirim dalam 90 hari oleh tim yang ada.</strong> Sisanya = fase 2.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tulis <strong>definisi selesai</strong> sebelum mulai: &ldquo;dalam 90 hari: 10 rule aktif + dashboard + 1 model shadow, fraud rate turun 30%.&rdquo; <strong>Definisi selesai yang tertulis = perisai dari scope creep</strong> — milikmu dan milik stakeholder.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Saat Proyekmu Buntu</h2>

      <div className="decision-card">
        <h3>1. Model tidak belajar (PR-AUC ~ baseline) → <strong>cek label &amp; fitur, bukan tuning</strong></h3>
        <p><strong>Kenapa:</strong> 80% kasus = label bocor/belum matang (FR4) atau fitur tidak informatif (FR6). Tuning buta = mengobati gejala.</p>
      </div>

      <div className="decision-card">
        <h3>2. Precision hancur → <strong>cek base rate + contamination asumsi + threshold</strong></h3>
        <p><strong>Kenapa:</strong> bukan &ldquo;model jelek&rdquo; — mungkin ekspektasimu yang tidak realistis untuk base rate 0,2% (FR2, FR9).</p>
      </div>

      <div className="decision-card">
        <h3>3. Tidak tahu threshold berapa → <strong>kembali ke M5: biaya + kapasitas</strong></h3>
        <p><strong>Kenapa:</strong> &ldquo;tidak tahu&rdquo; = belum menghitung. Hitung τ*, cek kapasitas, sajikan kurva.</p>
      </div>

      <div className="decision-card">
        <h3>4. Waktu habis, belum sempurna → <strong>selesaikan M6 dengan keterbatasan jujur</strong></h3>
        <p><strong>Kenapa:</strong> proyek selesai dengan keterbatasan &gt; proyek sempurna yang tak pernah selesai. Kejujuran keterbatasan = nilai plus.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Keputusan &gt; skor. Tulis <em>mengapa</em> di tiap milestone.</li>
          <li>Time split + embargo — tidak bisa ditawar.</li>
          <li>Threshold dari biaya + kapasitas — bukan 0,5.</li>
          <li>1 halaman untuk direksi. Kejujuran keterbatasan = nilai plus.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Keputusan Arsitek</h2>
      <p>Capstone melatih keputusan tingkat arsitek. Tiga yang paling menentukan:</p>
      <p><strong>Skenario A — MVP rule vs langsung ML.</strong> Pilih <strong>MVP rule dulu</strong> jika: volume &lt; 500rb trx/bulan, tim &lt; 3 orang, pola fraud belum dipahami. Rule MVP memberi 3 hal yang ML butuhkan: <em>label</em> (dari review), <em>pemahaman pola</em>, dan <em>kredibilitas</em> ke manajemen. Langsung ML tanpa fondasi ini = model mahal yang tidak dipercaya (lihat kasus FR7).</p>
      <p><strong>Skenario B — build vs buy.</strong> <em>Buy</em> (vendor fraud) jika: butuh cepat (&lt; 3 bulan), fraud lintas-merchant (butuh network effect data vendor), tim kecil. <em>Build</em> jika: fraud spesifik unik bisnismu, skala besar (biaya vendor 1–3% GMV menjadi mahal di skala), atau data adalah keunggulan kompetitif. Banyak perusahaan Indonesia yang bijak: <strong>buy untuk fondasi, build untuk diferensiasi</strong>.</p>
      <p><strong>Skenario C — kapan memotong scope.</strong> Tanda scope harus dipotong: timeline &gt; 6 bulan tanpa hasil parsial, dependensi &gt; 3 tim, atau &ldquo;fase 1&rdquo; butuh semua fitur. Potong menjadi: <strong>satu pola fraud + satu kanal + satu metrik sukses</strong> dalam 90 hari. Proyek yang mengirim <em>sesuatu yang bekerja</em> dalam 90 hari mendapat kepercayaan untuk 2 tahun berikutnya; proyek &ldquo;big bang&rdquo; 18 bulan biasanya mati di bulan ke-8.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> capstone yang bagus bukan yang modelnya paling canggih — tapi yang <strong>keputusannya paling bisa dipertahankan</strong> di depan direksi yang skeptis, auditor yang teliti, dan investigator yang sinis. Tiga penonton, satu cerita yang konsisten: itulah ujian sebenarnya.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Roadmap 90 Hari Fintech Baru</h2>
      <p>Fintech lending baru (pola umum 2024–2025): launching dengan <strong>nol</strong> pertahanan fraud — &ldquo;fokus growth dulu&rdquo;. Bulan ke-3: fraud rate 2,1% (7× benchmark!), kerugian Rp1,8 M/bulan, investor bertanya. Konsultan dipanggil. Inilah rencana 90 hari yang benar:</p>
      <ol>
        <li><strong>Hari 1–14 (stop the bleeding):</strong> 10 rule darurat (velocity, device baru + nominal besar, KTP reuse) + 2 analis kontrak. Target: potong 50% loss dalam 2 minggu. <em>Prinsip: jangan bangun rumah saat kebakaran — padamkan dulu.</em></li>
        <li><strong>Hari 15–45 (fondasi data):</strong> pipeline label (definisi fraud vs sengketa, FR4), feature store dasar (20 fitur, FR6), dashboard monitoring. Target: setiap fraud punya label &amp; alasan dalam 7 hari.</li>
        <li><strong>Hari 46–90 (model pertama):</strong> GBM sederhana (bukan deep learning!) di atas 20 fitur, shadow 2 minggu, canary 5%, lalu produksi dengan dua threshold (FR11, FR18).</li>
      </ol>
      <p><strong>Hasil ilustratif pola umum:</strong> fraud rate 2,1% → 0,6% dalam 90 hari; kerugian Rp1,8 M → Rp520jt/bulan; tim 2 → 6 orang. Bukan &ldquo;selesai&rdquo; — tapi <strong>terkendali &amp; terukur</strong>, dengan fondasi untuk tahun kedua (graph, realtime).</p>
      <p><strong>Pelajaran capstone:</strong> urutan <strong>rule → data → model</strong> bukan kemunduran — ia <em>strategi</em>. Setiap fase membiayai fase berikutnya (penghematan fase 1 membayar investasi fase 2) dan membangun kepercayaan organisasi. Arsitek hebat bukan yang merancang sistem sempurna — tapi yang merancang <strong>evolusi yang bisa dibiayai</strong>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Capstone harus pakai teknologi paling canggih biar impressive.&rdquo;<br /><strong>Yang benar:</strong> yang impressive bagi direksi/auditor/investigator adalah <strong>keputusan yang tepat dengan alasan yang jernih</strong> — bukan arsitektur yang rumit. Sistem &ldquo;sederhana&rdquo; yang menghemat Rp1,38 M/bulan mengalahkan sistem &ldquo;canggih&rdquo; yang tidak pernah deploy. Kesederhanaan yang disengaja = kecanggihan tertinggi.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Presentasi 5 Menit ke Direksi</h2>
      <div className="callout">
        <p>Kamu kandidat B dari cerita pembuka. Direksi memberimu <strong>5 menit</strong>: &ldquo;Jelaskan sistemmu dan kenapa kami harus percaya.&rdquo; Drafkan naskah presentasimu (maks 300 kata): angka utama, 3 keputusan kunci, 2 keterbatasan, 1 permintaan.</p>
        <details className="worked">
          <summary>💡 Contoh naskah (klik untuk buka)</summary>
          <p>&ldquo;Sistem fraud detector saya net <strong>Rp892 juta per bulan</strong> setelah biaya operasional — dihitung dari 20.000 transaksi simulasi per hari dengan biaya review Rp25 ribu dan rata-rata loss Rp1,1 juta.</p>
          <p>Tiga keputusan kunci. <strong>Pertama</strong>, validasi time split — bukan random — karena pola fraud berubah tiap bulan; angka 0,81 PR-AUC ini jujur untuk masa depan. <strong>Kedua</strong>, threshold 0,6 — bukan 0,5 — karena pada 0,5 alert jebol 2× kapasitas 400 review/hari tim kita; 0,6 memaksimalkan net dalam kapasitas. <strong>Ketiga</strong>, arsitektur berlapis rule+ML: rule menangkap pola known dalam milidetik, ML menangkap pola unknown, prioritas memastikan 400 slot dipakai di tempat paling padat fraud.</p>
          <p>Dua keterbatasan jujur: sistem belum menangani APP scam (butuh friction, bukan model), dan label simulasi belum seberisik dunia nyata. Satu permintaan: 1 bulan data historis matang untuk validasi ulang sebelum produksi.&rdquo;</p>
          <p><strong>Yang dinilai pewawancara:</strong> angka + alasan + kejujuran + permintaan yang masuk akal. Bukan &ldquo;kecanggihan&rdquo;.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Capstone</h2>
      <details className="worked">
        <summary>Q1: Bagaimana memilih scope capstone yang tepat?</summary>
        <p><strong>Tiga filter:</strong> (1) <em>dampak</em> — selesaikan masalah yang <em>terasa</em> (RpX/bulan atau jam kerja); (2) <em>kelayakan</em> — bisa selesai 90 hari dengan resource ada; (3) <em>visibilitas</em> — hasilnya bisa <em>ditunjukkan</em> (dashboard, angka, demo). <strong>Scope ideal = irisan ketiganya.</strong> Proyek berdampak tapi tak layak = frustrasi; layak tapi tak terlihat = tidak dihargai.</p>
      </details>
      <details className="worked">
        <summary>Q2: Metrik sukses capstone — apa yang meyakinkan?</summary>
        <p><strong>Tiga lapis metrik:</strong> (1) <em>teknis</em> — precision/recall (untuk tim); (2) <em>operasional</em> — flag/hari, jam investigator hemat (untuk manajer); (3) <em>bisnis</em> — rupiah diselamatkan, ROI (untuk direksi). <strong>Presentasikan ketiganya berurutan</strong> — teknis membangun kredibilitas, bisnis menutup keputusan. Capstone yang hanya punya lapis 1 = belum selesai.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana presentasi ke direksi yang skeptis?</summary>
        <p><strong>Struktur 5 menit:</strong> (1) masalah dalam rupiah (30 detik); (2) apa yang dibangun (60 detik, tanpa jargon); (3) hasil dalam rupiah + orang (60 detik); (4) apa risikonya &amp; mitigasinya (60 detik — <em>jujur soal kelemahan = kredibilitas</em>); (5) minta keputusan spesifik (30 detik). <strong>Jangan presentasi model — presentasikan keputusan.</strong> Direksi tidak membeli algoritma; mereka membeli <em>keyakinan</em>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Setelah capstone selesai — apa selanjutnya?</summary>
        <p><strong>Tiga hal:</strong> (1) <em>serah terima operasional</em> — runbook, pemilik, monitoring (FR18); sistem tanpa pemilik = mati dalam 6 bulan; (2) <em>dokumentasi keputusan</em> — kenapa threshold ini, kenapa fitur itu (untuk penggantimu); (3) <em>roadmap fase 2</em> — apa yang sengaja dipotong + kapan dilanjutkan. <strong>Capstone yang hebat berakhir dengan awal yang jelas</strong> — bukan dengan keheningan.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Mengapa kandidat B (portofolio + keputusan beralasan) menang atas kandidat A (bisa XGBoost) tanpa pengalaman?"
        options={[
          "Karena modelnya lebih canggih",
          "Karena ia membuktikan cara BERPIKIR seperti analis fraud: keputusan beralasan (threshold, validasi, biaya) — perekrut merekrut otak yang bisa memutuskan, bukan tangan yang bisa coding",
          "Karena laptopnya bagus",
          "Kebetulan",
        ]}
        correct={1}
        explanation="Benar: keputusan > skill teknis. 'Threshold 0,6 karena net Rp892jt dan muat kapasitas' = bukti berpikir bisnis. Skill coding bisa dilatih; judgment sulit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam capstone, milestone mana yang memakan waktu TERBANYAK dan mengapa?"
        options={[
          "Modeling — paling sulit",
          "Data+label+rule+fitur (55%) — realita kerja: menyiapkan segalanya sebelum modeling adalah pekerjaan utama analis fraud",
          "Laporan — paling lama",
          "Tidak ada",
        ]}
        correct={1}
        explanation="Benar: 55% untuk fondasi. Model 20% adalah bagian kecil. Profesional dibedakan oleh persiapan, bukan oleh tuning."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Capstone-mu PR-AUC 0,95 dengan random split. Reaksi pewawancara senior?"
        options={[
          "Kagum",
          "Red flag — random split untuk fraud = kebocoran temporal (FR10); angka tinggi justru mencurigakan. '0,81 dengan time split' lebih dipercaya",
          "Tidak peduli",
          "Langsung diterima",
        ]}
        correct={1}
        explanation="Benar: red flag. Senior tahu 0,95 + random split = kemungkinan besar bocor. Kejujuran metodologi > angka cantik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Waktu habis, sistem belum sempurna. Langkah terbaik?"
        options={[
          "Lembur sampai sempurna",
          "Selesaikan M6 (laporan 1 halaman) dengan keterbatasan JUJUR — proyek selesai + jujur > sempurna + tak selesai",
          "Sembunyikan keterbatasan",
          "Batalkan proyek",
        ]}
        correct={1}
        explanation="Benar: kejujuran keterbatasan = nilai plus. Profesional tahu batas sistemnya; amatir menyembunyikannya. 'Belum menangani APP scam' = kedewasaan, bukan kegagalan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Satu kalimat yang merangkum seluruh Track 2?"
        options={[
          "'Pakai XGBoost.'",
          "'Fraud detection = keputusan bisnis berlapis (rule+ML+manusia) yang diukur dengan rupiah, divalidasi dengan waktu, dan dijelaskan dengan bahasa manusia.'",
          "'Kumpulkan data sebanyak-banyaknya.'",
          "'Threshold 0,5.'",
        ]}
        correct={1}
        explanation="Benar: itulah sintesis 19 lesson — berlapis (FR5), rupiah (FR9/FR11), waktu (FR4/FR10), bahasa manusia (FR17). Satu kalimat, satu track."
      />

      <h2 id="rangkum">📝 Rangkuman Track 2: Fraud / ML Analytics</h2>
      <div className="callout">
        <ul>
          <li><strong>FR1:</strong> 9 wajah fraud — kenali musuh; prioritas = expected loss, bukan jumlah kasus.</li>
          <li><strong>FR2:</strong> fraud vs AML vs cyber — tiga perang; base rate menentukan presisi (Bayes).</li>
          <li><strong>FR3:</strong> 6 sumber sinyal — analis senior membaca semuanya, bukan cuma nominal.</li>
          <li><strong>FR4:</strong> label datang terlambat &amp; berisik — embargo 90+ hari; perbaiki sumur sebelum pompa.</li>
          <li><strong>FR5:</strong> rule = senjata pertama; velocity relatif; champion-challenger via shadow.</li>
          <li><strong>FR6:</strong> fitur = bahan bakar; window selaras tempo; anomali relatif terhadap baseline.</li>
          <li><strong>FR7:</strong> GBM raja tabel; class weight + threshold dari biaya; SMOTE waspada.</li>
          <li><strong>FR8:</strong> unsupervised = mesin kandidat untuk musuh yang belum punya nama.</li>
          <li><strong>FR9:</strong> PR-AUC &gt; ROC-AUC; semua metrik diterjemahkan ke rupiah.</li>
          <li><strong>FR10:</strong> time split + embargo; musuh adaptif — model statis = target latihan.</li>
          <li><strong>FR11:</strong> threshold = kontrak kapasitas; antrian terurut skor; τ* dari biaya.</li>
          <li><strong>FR12:</strong> graph melihat jaringan; teknik klasik dulu, GNN belakangan; sinyal ≠ vonis.</li>
          <li><strong>FR13:</strong> 200 ms anggaran; fitur &gt; model; feature store = kontrak training-serving.</li>
          <li><strong>FR14:</strong> investigator = guru model; tutup kebocoran funnel; feedback loop = bahan bakar.</li>
          <li><strong>FR15:</strong> AML = lapor benar &amp; tepat waktu; placement titik emas; STR = narasi bukti.</li>
          <li><strong>FR16:</strong> anomali = penyimpangan dari ekspektasi kontekstual; CUSUM untuk pergeseran pelan.</li>
          <li><strong>FR17:</strong> explainability = asuransi; SHAP menjelaskan model; reason code ≤3 alasan.</li>
          <li><strong>FR18:</strong> MLOps = tangga deployment; A/B dalam rupiah; monitor 4 lapis; retrain disiplin.</li>
          <li><strong>FR19:</strong> NLP lawan phishing; LLM = asisten (bukan penentu); verifikasi fakta selalu.</li>
          <li><strong>FR20:</strong> capstone — keputusan &gt; skor; portofolio membuktikan cara berpikir.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr19-nlp-phishing" className="btn btn-secondary btn-sm">← FR19</Link>
        <Link href="/" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}
