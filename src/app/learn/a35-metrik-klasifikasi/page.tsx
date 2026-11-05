"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A35Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const rocData = [
    {
      x: [0, 0.02, 0.05, 0.1, 0.18, 0.3, 0.45, 0.6, 0.75, 0.88, 1.0],
      y: [0, 0.25, 0.45, 0.62, 0.75, 0.85, 0.91, 0.95, 0.98, 0.995, 1.0],
      mode: "lines",
      type: "scatter",
      name: "Model A (AUC 0,88)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0],
      y: [0, 0.15, 0.32, 0.48, 0.62, 0.74, 0.87, 1.0],
      mode: "lines",
      type: "scatter",
      name: "Model B (AUC 0,71)",
      line: { color: "#e8a838", width: 3 },
    },
    {
      x: [0, 1],
      y: [0, 1],
      mode: "lines",
      type: "scatter",
      name: "Acak (AUC 0,50)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const ksData = [
    {
      x: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      y: [0, 0.08, 0.2, 0.35, 0.5, 0.62, 0.72, 0.8, 0.86, 0.93, 0.97, 0.99, 1.0, 1.0, 1.0],
      mode: "lines",
      type: "scatter",
      name: "Kumulatif default (bad)",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      y: [0, 0.01, 0.03, 0.05, 0.08, 0.12, 0.16, 0.2, 0.25, 0.35, 0.48, 0.62, 0.78, 0.92, 1.0],
      mode: "lines",
      type: "scatter",
      name: "Kumulatif lancar (good)",
      line: { color: "#22c55e", width: 3 },
    },
  ];

  const prData = [
    {
      x: [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      y: [0.85, 0.72, 0.6, 0.45, 0.35, 0.28, 0.22, 0.17, 0.13, 0.09, 0.06, 0.03],
      mode: "lines+markers",
      type: "scatter",
      name: "Kurva Precision-Recall",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 7 },
    },
    {
      x: [0, 1],
      y: [0.03, 0.03],
      mode: "lines",
      type: "scatter",
      name: "Base rate (3%)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Akurasi menipu pada data imbalance: buktikan sendiri
# 1000 nasabah, 30 default (3%). Model A: selalu prediksi "lancar".
# Model B: model logistik sederhana yang jujur tapi tak sempurna.
import random, math
random.seed(9)

n = 1000
skor = [random.gauss(0, 1) for _ in range(n)]
y = [1 if random.random() < 1/(1+math.exp(1.5 + 1.2*s)) else 0 for s in skor]
print(f"Base rate default: {sum(y)/n:.1%}")

# Model A: prediksi semua 0
predA = [0]*n
# Model B: threshold 0.5 pada skor logistik sederhana
predB = [1 if 1/(1+math.exp(1.5+1.2*s)) > 0.10 else 0 for s in skor]

def metrics(y, p):
    tp = sum(1 for a,b in zip(y,p) if a==1 and b==1)
    tn = sum(1 for a,b in zip(y,p) if a==0 and b==0)
    fp = sum(1 for a,b in zip(y,p) if a==0 and b==1)
    fn = sum(1 for a,b in zip(y,p) if a==1 and b==0)
    acc = (tp+tn)/len(y)
    prec = tp/(tp+fp) if tp+fp else 0
    rec = tp/(tp+fn) if tp+fn else 0
    f1 = 2*prec*rec/(prec+rec) if prec+rec else 0
    return acc, prec, rec, f1, tp, fp, fn

for nama, p in [("A (selalu 'lancar')", predA), ("B (model jujur)   ", predB)]:
    acc, prec, rec, f1, tp, fp, fn = metrics(y, p)
    print(f"\n{nama}: akurasi={acc:.1%} | precision={prec:.1%} | recall={rec:.1%} | F1={f1:.3f}")
    print(f"   TP={tp} FP={fp} FN={fn} <- FN = default yang LOLOS tanpa flag!")

print("\nKESIMPULAN: Model A 'akurat 97%' tapi recall 0% - tidak menangkap")
print("SATU PUN default. Akurasi pada data imbalance = metrik penipu.")
print("COBA: naikkan threshold B 0.10 -> 0.30. Precision naik, recall turun.")
print("Itulah tradeoff yang harus dipilih dengan biaya bisnis.")`;

  const lab2Code = `# AUC dari nol: probabilitas ranking benar
# AUC = P(skor(default) > skor(lancar)) untuk pasangan acak.
# Hitung langsung dari definisi - tanpa library.
import random, math
random.seed(4)

def auc_from_scores(y, s):
    pos = [sc for a, sc in zip(y, s) if a == 1]
    neg = [sc for a, sc in zip(y, s) if a == 0]
    win = tie = 0
    for p in pos:
        for q in neg:
            if p > q: win += 1
            elif p == q: tie += 1
    return (win + 0.5*tie)/(len(pos)*len(neg))

n = 2000
# Model BAGUS: skor default memang lebih tinggi
s_good = [random.gauss(0,1) for _ in range(n)]
y = [1 if random.random() < 1/(1+math.exp(1.0 + 1.5*s)) else 0 for s in s_good]
p_good = [1/(1+math.exp(1.0 + 1.5*s)) for s in s_good]
# Model ACAK: skor = noise
p_rand = [random.random() for _ in range(n)]
# Model "pintar tapi salah arah": ranking terbalik
p_flip = [1 - p for p in p_good]

print(f"AUC model bagus  = {auc_from_scores(y, p_good):.3f}")
print(f"AUC model acak   = {auc_from_scores(y, p_rand):.3f}")
print(f"AUC model kebalik= {auc_from_scores(y, p_flip):.3f}  <- di bawah 0.5!")
print()
print("Interpretasi: AUC 0.85 = jika ambil 1 default & 1 lancar acak,")
print("85% model memberi skor lebih tinggi ke yang default.")
print()
print("COBA: AUC tidak peduli KALIBRASI. Kalikan semua p_good dengan 0.1")
print("(probabilitas jadi 10x lebih kecil) lalu hitung AUC lagi - TETAP SAMA!")
print("Itulah kenapa AUC saja tidak cukup untuk pricing (butuh A3.6).")
p_scaled = [p*0.1 for p in p_good]
print(f"AUC setelah skala 0.1x = {auc_from_scores(y, p_scaled):.3f} (sama!)")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.5 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Metrik Klasifikasi:<br />Akurasi 97% yang Tidak Menangkap Satu Pun Penipu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 97% yang Meloloskan Semua Penipu</a></li>
          <li><a href="#cm">Confusion Matrix — Empat Kotak Kebenaran</a></li>
          <li><a href="#roc">ROC &amp; AUC — Metrik Ranking Tanpa Threshold</a></li>
          <li><a href="#ksgini">KS &amp; Gini — Bahasa Regulator</a></li>
          <li><a href="#pr">Precision-Recall &amp; PR-AUC — Saat Imbalance Ekstrem</a></li>
          <li><a href="#brier">Brier Score — Satu-satunya yang Peduli Nilai Probabilitas</a></li>
          <li><a href="#lab1">🔬 Lab 1: Akurasi Menipu di Data Imbalance</a></li>
          <li><a href="#lab2">🔬 Lab 2: AUC dari Nol — Ranking, Bukan Kalibrasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metrik Mana untuk Keputusan Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Memilih Threshold Penolakan Kredit</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung precision, recall, F1 dari confusion matrix dan menjelaskan tradeoff-nya via threshold.</li>
          <li>Menginterpretasikan AUC-ROC sebagai probabilitas ranking dan menjelaskan mengapa ia buta terhadap kalibrasi.</li>
          <li>Menghitung KS dan Gini, serta mengonversi AUC ↔ Gini.</li>
          <li>Memilih metrik yang tepat (ROC-AUC vs PR-AUC vs Brier) berdasarkan base rate dan tujuan keputusan (ranking vs probabilitas vs keputusan biner).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model 97% yang Meloloskan Semua Penipu</h2>
      <div className="story">
        <p>Vendor AI mempresentasikan model deteksi fraud ke bank: <strong>&ldquo;Akurasi 97%!&rdquo;</strong> — angka besar terpampang di slide. Direksi terkesan. Kontrak ditandatangani.</p>
        <p>Di minggu pertama produksi, tim fraud sadar ada yang aneh: <em>tidak satu pun</em> transaksi ditandai mencurigakan. Investigasi 10 menit menemukan jawabannya: fraud rate hanya 3%. Model yang <strong>selalu menjawab &ldquo;bukan fraud&rdquo;</strong> otomatis benar 97% — tanpa menangkap satu pun penipu. Akurasi 97% itu bukan prestasi; itu <strong>kemalasan yang dinilai</strong>.</p>
        <p>Twist-nya: metriknya tidak berbohong — <em>ekspektasi kitalah</em> yang salah. Akurasi menjawab &ldquo;berapa persen tebakan benar?&rdquo;, padahal pertanyaan bisnisnya &ldquo;berapa persen penipu tertangkap, dan berapa nasabah jujur yang terganggu?&rdquo;. Lesson ini: memilih metrik yang menjawab pertanyaan yang benar.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="cm">Confusion Matrix — Empat Kotak Kebenaran</h2>
      <p><strong>Definisi.</strong> Untuk threshold tertentu, setiap prediksi jatuh ke satu dari empat kotak:</p>
      <ul>
        <li><strong>TP</strong> (<em>true positive</em>): diprediksi default, benar default — penipu tertangkap ✓</li>
        <li><strong>FP</strong> (<em>false positive</em>): diprediksi default, ternyata lancar — nasabah bagus ditolak ✗ (biaya: kehilangan bisnis + komplain)</li>
        <li><strong>FN</strong> (<em>false negative</em>): diprediksi lancar, ternyata default — penipu lolos ✗ (biaya: kerugian kredit!)</li>
        <li><strong>TN</strong> (<em>true negative</em>): diprediksi lancar, benar lancar ✓</li>
      </ul>
      <p>Dari sini lahir metrik threshold-dependent:</p>
      <Tex math={String.raw`\text{Precision} = \frac{TP}{TP+FP}, \qquad \text{Recall} = \frac{TP}{TP+FN}, \qquad F_1 = \frac{2 \cdot P \cdot R}{P+R}`} block />
      <ul>
        <li><strong>Precision</strong>: &ldquo;dari yang kita tandai, berapa % yang benar?&rdquo; — rendah = banyak alarm palsu</li>
        <li><strong>Recall</strong> (= sensitivity, TPR): &ldquo;dari semua yang seharusnya tertangkap, berapa % yang tertangkap?&rdquo; — rendah = banyak yang lolos</li>
        <li><strong>F₁</strong>: rata-rata harmonik keduanya — menghukum keras jika salah satunya jeblok</li>
        <li><strong>Specificity</strong> (= TNR): <Tex math={String.raw`TN/(TN+FP)`} /> — &ldquo;nasabah bagus yang tidak diganggu&rdquo;</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca confusion matrix</summary>
        <p>1.000 pengajuan, 100 default aktual. Threshold 10%: TP=70, FP=180, FN=30, TN=720.</p>
        <p><strong>Langkah 1</strong> — Precision = 70/(70+180) = <strong>28%</strong>: dari 250 yang ditolak, hanya 70 yang benar-benar akan default — 180 nasabah bagus ikut ditolak.<br />
        <strong>Langkah 2</strong> — Recall = 70/(70+30) = <strong>70%</strong>: 70% calon default tertangkap, 30 lolos.<br />
        <strong>Langkah 3</strong> — F₁ = 2×0,28×0,70/(0,28+0,70) = <strong>0,40</strong>.<br />
        <strong>Langkah 4</strong> — Akurasi = (70+720)/1000 = <strong>79%</strong> — terlihat &ldquo;lumayan&rdquo;, tapi menyembunyikan 30 default yang lolos dan 180 penolakan salah sasaran.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> precision dan recall adalah <strong>tarik-menambang via threshold</strong>. Turunkan threshold → lebih banyak ditandai → recall naik, precision turun (banyak alarm palsu). Naikkan threshold → sebaliknya. Tidak ada &ldquo;nilai benar&rdquo; — hanya ada <strong>titik yang biayanya paling murah</strong> untuk bisnismu: bandingkan (biaya 1 FN × jumlah FN) vs (biaya 1 FP × jumlah FP).</p>
      </div>

      <h2 id="roc">ROC &amp; AUC — Metrik Ranking Tanpa Threshold</h2>
      <p><strong>Definisi.</strong> Kurva ROC memplot <strong>TPR (recall)</strong> vs <strong>FPR</strong> (<Tex math={String.raw`FP/(FP+TN)`} />) untuk <em>semua</em> threshold dari 0 sampai 1. <strong>AUC</strong> = luas di bawah kurva:</p>
      <Tex math={String.raw`\text{AUC} = P\big(s_{\text{positif}} > s_{\text{negatif}}\big)`} block />
      <p>Artinya: ambil 1 default dan 1 lancar secara acak — AUC = probabilitas model memberi skor lebih tinggi ke yang default. AUC = 0,5 (tebakan acak), 1,0 (sempurna), &lt; 0,5 (terbalik — balik saja prediksinya!).</p>

      <PlotlyChart
        data={rocData}
        title="Kurva ROC: Model A vs Model B vs Acak"
        layout={{ xaxis: { title: "FPR (1 − specificity)" }, yaxis: { title: "TPR (recall)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = FPR (proporsi nasabah bagus yang salah ditandai), vertikal = TPR (proporsi default yang tertangkap). Tiap titik = satu threshold. Makin ke kiri-atas, makin bagus.</p>
        <p><strong>Interpretasi:</strong> Model A (AUC 0,88) mendekati sudut kiri-atas — menangkap 75% default dengan hanya 18% alarm palsu. Model B (AUC 0,71) jauh lebih landai. Garis diagonal = acak. <strong>Cara memilih threshold dari kurva ini:</strong> cari titik yang sesuai <em>budget alarm palsu</em>-mu (misal &ldquo;kita toleransi FPR 20%&rdquo; → tarik garis vertikal di 0,20, baca TPR-nya).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AUC 0,9 berarti model 90% akurat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AUC bukan persen kebenaran — ia probabilitas <em>ranking benar</em> untuk pasangan acak. Model dengan AUC 0,9 bisa tetap punya precision 10% di threshold operasional jika base rate kecil! AUC juga <strong>buta terhadap kalibrasi</strong>: kalikan semua probabilitas dengan 0,1 (jadi jauh kekecilan) — ranking tak berubah, AUC tetap sama. Untuk pricing yang butuh angka probabilitas jujur, AUC saja tidak cukup (butuh Brier/kalibrasi, A3.6).</p>
      </div>

      <h2 id="ksgini">KS &amp; Gini — Bahasa Regulator</h2>
      <p><strong>Definisi.</strong> Dua metrik yang lahir dari dunia perbankan:</p>
      <ul>
        <li><strong>KS</strong> (<em>Kolmogorov-Smirnov</em>): jarak vertikal <strong>maksimum</strong> antara distribusi kumulatif skor kelompok &ldquo;bad&rdquo; vs &ldquo;good&rdquo;:
          <Tex math={String.raw`KS = \max_s |F_{bad}(s) - F_{good}(s)|`} block />
          KS = 0,45 artinya: ada threshold di mana 45% lebih banyak &ldquo;bad&rdquo; yang tertangkap dibanding &ldquo;good&rdquo; yang ikut tertangkap. Praktik bank: KS &gt; 0,3 = cukup baik; &gt; 0,5 = sangat baik.</li>
        <li><strong>Gini</strong> = <Tex math={String.raw`2 \times \text{AUC} - 1`} />. Hanya rescaling AUC ke [0,1] (acak = 0, sempurna = 1). Bank Eropa/IFRS 9 lazim melapor Gini; intinya sama dengan AUC.</li>
      </ul>

      <PlotlyChart
        data={ksData}
        title="Statistik KS: Jarak Maksimum Dua Kurva Kumulatif"
        layout={{ xaxis: { title: "Skor (diurutkan, fraksi populasi)" }, yaxis: { title: "Fraksi kumulatif" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kedua kurva = fraksi kumulatif &ldquo;bad&rdquo; (merah) dan &ldquo;good&rdquo; (hijau) saat kita menyapu skor dari terburuk ke terbaik. Jarak vertikal antar kurva = KS pada titik itu.</p>
        <p><strong>Interpretasi:</strong> jarak maksimum (≈ 0,42) terjadi di sekitar fraksi 0,25 — artinya 25% populasi terbawah menangkap ~50% default tapi hanya ~8% nasabah bagus. KS menjawab pertanyaan operasional: &ldquo;seberapa tajam model memisahkan?&rdquo; — dan titik KS maksimum adalah kandidat threshold yang natural.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> AUC/KS/Gini semuanya mengukur <strong>diskriminasi</strong> (ranking) — bukan <strong>kalibrasi</strong> (apakah &ldquo;PD 10%&rdquo; benar-benar terjadi 10%). Model bisa diskriminatif sempurna tapi kalibrasinya ngawur. Industri kredit memisahkan keduanya secara eksplisit: <em>discrimination</em> (AUC/KS/Gini) untuk ranking, <em>calibration</em> (Brier, kurva kalibrasi) untuk angka probabilitas — dan keduanya wajib lolos validasi.</p>
      </div>

      <h2 id="pr">Precision-Recall &amp; PR-AUC — Saat Imbalance Ekstrem</h2>
      <p><strong>Definisi.</strong> Kurva PR memplot precision vs recall untuk semua threshold. <strong>PR-AUC</strong> = luas di bawahnya. Baseline-nya = <strong>base rate</strong> (bukan 0,5!): model acak pada fraud rate 3% punya PR-AUC ≈ 0,03.</p>
      <p><strong>Kapan PR-AUC mengalahkan ROC-AUC:</strong> saat positif sangat langka (fraud 0,1%, default 3%). ROC-AUC bisa terlihat &ldquo;bagus&rdquo; (0,85) padahal precision di threshold operasional hanya 5% — karena FPR dihitung terhadap TN yang raksasa (1 − specificity terlihat kecil padahal FP absolut besar). Kurva PR tidak bisa bersembunyi: ia langsung menunjukkan &ldquo;dari yang ditandai, berapa % yang benar&rdquo;.</p>

      <PlotlyChart
        data={prData}
        title="Kurva Precision-Recall (base rate 3%)"
        layout={{ xaxis: { title: "Recall", range: [0, 1.02] }, yaxis: { title: "Precision", range: [0, 1.02] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> horizontal = recall (berapa % penipu tertangkap), vertikal = precision (dari yang ditandai, berapa % benar-benar penipu). Garis putus-putus = base rate 3% (tebakan acak).</p>
        <p><strong>Interpretasi:</strong> untuk menangkap 50% penipu (recall 0,5), precision hanya 22% — dari 100 yang ditandai, 78 nasabah jujur terganggu. Kurva ini memaksa diskusi jujur: &ldquo;berapa alarm palsu yang sanggup ditanggung tim investigasi?&rdquo; — pertanyaan yang disembunyikan ROC-AUC yang &ldquo;cantik&rdquo;.</p>
      </div>

      <h2 id="brier">Brier Score — Satu-satunya yang Peduli Nilai Probabilitas</h2>
      <p><strong>Definisi.</strong> Rata-rata kuadrat selisih probabilitas prediksi vs aktual (0/1):</p>
      <Tex math={String.raw`\text{Brier} = \frac{1}{n}\sum_{i=1}^{n}(p_i - y_i)^2`} block />
      <ul>
        <li>Rentang 0 (sempurna) – 1 (terburuk); makin kecil makin baik</li>
        <li>Brier adalah <strong>proper scoring rule</strong>: hanya dimaksimalkan dengan melaporkan probabilitas yang <em>jujur</em> — tidak bisa diakali dengan melebih-lebihkan</li>
        <li>Brier terurai jadi <strong>kalibrasi + ketajaman</strong>: model yang selalu memprediksi base rate (3%) punya Brier &ldquo;lumayan&rdquo; tapi tidak tajam — tidak berguna untuk membedakan risiko</li>
      </ul>
      <p><strong>Kapan Brier wajib:</strong> pricing, pencadangan (ECL/CKPN), dan keputusan berbasis <em>nilai</em> probabilitas — semua tempat di mana &ldquo;PD 10%&rdquo; harus benar-benar berarti 10%.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu metrik cukup — pilih yang tertinggi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> tiap metrik menjawab pertanyaan berbeda: AUC/KS = &ldquo;bisakah me-ranking?&rdquo;; PR-AUC = &ldquo;di base rate kecil, berapa yang benar dari yang ditandai?&rdquo;; Brier = &ldquo;jujurkah angka probabilitasnya?&rdquo;; precision/recall/F1 = &ldquo;di threshold operasional ini, berapa biaya kesalahannya?&rdquo;. Praktik validasi bank: <strong>laporkan paket</strong> (diskriminasi + kalibrasi + threshold operasional), bukan satu angka juara.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Metrik = &ldquo;apa yang dihitung, itu yang dikejar&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Akurasi 97% yang tidak menangkap satupun</summary>
              <p>1.000 transaksi, 30 fraud (3%). Model A: akurasi 97% (prediksi &ldquo;bersih&rdquo; semua). Model B: akurasi 94%, menangkap 25/30 fraud dengan 35 false alarm. Mana dipakai?</p>
              <p><strong>Langkah 1</strong> — A: TP=0! Recall fraud = <strong>0%</strong> — model &ldquo;akurat&rdquo; yang tidak berguna.<br />
              <strong>Langkah 2</strong> — B: precision = 25/60 = 41,7%; recall = 25/30 = <strong>83,3%</strong>; F1 = 0,556.<br />
              <strong>Langkah 3</strong> — biaya: 5 fraud lolos (Rp?) vs 35 investigasi (35 × 15 mnt). Jika 1 fraud = Rp10jt &amp; investigasi Rp100rb: B menghemat 25×10jt − 35×100rb = <strong>Rp246,5jt</strong>.</p>
              <p>Pelajaran: pilih metrik dari <em>matriks biaya</em>, bukan default. Akurasi = metrik untuk data seimbang &amp; biaya simetris — jarang ada di fraud/kredit.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Threshold tuning — dari 0,5 ke optimal</summary>
              <p>Model PD memberi skor. Threshold 0,5: precision 60%, recall 50%. Bisnis: false negative 10× lebih mahal dari false positive. Threshold optimal?</p>
              <p><strong>Langkah 1</strong> — turunkan threshold → recall naik, precision turun. Cari yang meminimalkan <em>biaya ekspektasi</em>: min(FN×10 + FP×1).<br />
              <strong>Langkah 2</strong> — dari kurva PR: threshold 0,3 → precision 45%, recall 80%. Biaya relatif turun 40% vs 0,5.<br />
              <strong>Langkah 3</strong> — aturan: <strong>threshold bukan 0,5 dogmatis</strong> — ia parameter bisnis. Tune di validasi dengan fungsi biaya, bukan F1 buta.</p>
              <p>Pelajaran: model memberi <em>skor</em>; bisnis memberi <em>biaya</em>; threshold = tempat keduanya bertemu. Pisahkan &ldquo;model yang bagus&rdquo; (AUC) dari &ldquo;keputusan yang optimal&rdquo; (threshold).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Akurasi Menipu di Data Imbalance</h2>
      <p>Buktikan model &ldquo;akurasi 97%&rdquo; bisa tidak menangkap satu pun default. Bandingkan metriknya dengan model yang jujur.</p>
      <PyodideLab
        title="Lab 1 — Membedah Confusion Matrix"
        hint="Coba: naikkan threshold model B 0.10 → 0.30. Precision naik, recall turun — pilih titiknya dengan biaya bisnis."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: AUC dari Nol — Ranking, Bukan Kalibrasi</h2>
      <p>Hitung AUC langsung dari definisinya (probabilitas ranking benar), lalu buktikan ia buta terhadap kalibrasi.</p>
      <PyodideLab
        title="Lab 2 — AUC = P(skor⁺ > skor⁻)"
        hint="Perhatikan baris terakhir: probabilitas diskala 10× lebih kecil tapi AUC identik. AUC tidak tahu kalibrasi!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Metrik Mana untuk Keputusan Apa</h2>

      <div className="decision-card">
        <h3>1. Butuh me-ranking nasabah (siapa lebih berisiko?) → <strong>AUC / Gini / KS</strong></h3>
        <p><strong>Kondisi:</strong> keputusan berbasis urutan — prioritas koleksi, segmentasi.</p>
        <p><strong>Kenapa:</strong> threshold-free; mengukur daya pisah murni. Gini = 2×AUC − 1 untuk laporan regulator.</p>
        <p><strong>Contoh nyata:</strong> validasi model PD internal (IRB): Gini ≥ 0,5 umumnya diharapkan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Positif sangat langka + keputusan operasional → <strong>PR-AUC + precision/recall di threshold</strong></h3>
        <p><strong>Kondisi:</strong> fraud 0,1%, base rate kecil; tim investigasi punya kapasitas terbatas.</p>
        <p><strong>Kenapa:</strong> ROC-AUC menutupi banjir FP; kurva PR memaksa bicara soal alarm palsu vs kapasitas.</p>
        <p><strong>Contoh nyata:</strong> tuning model fraud: &ldquo;recall 60% dengan precision 25% = 3 analis cukup?&rdquo;</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh angka probabilitas jujur (pricing, cadangan) → <strong>Brier + kurva kalibrasi</strong></h3>
        <p><strong>Kondisi:</strong> PD dipakai menghitung ekspektasi kerugian / harga.</p>
        <p><strong>Kenapa:</strong> satu-satunya metrik yang menghukum probabilitas tidak jujur. AUC tinggi tidak menjamin PD 10% = 10%.</p>
        <p><strong>Contoh nyata:</strong> ECL/CKPN: salah kalibrasi 2% × portofolio Rp10 T = Rp200 M.</p>
      </div>

      <div className="decision-card">
        <h3>4. Keputusan biner dengan biaya asimetris → <strong>precision/recall/F1 + expected cost</strong></h3>
        <p><strong>Kondisi:</strong> threshold sudah/tengah dipilih; biaya FN ≠ biaya FP.</p>
        <p><strong>Kenapa:</strong> pilih threshold yang meminimalkan <em>biaya ekspektasi</em>, bukan yang memaksimalkan akurasi.</p>
        <p><strong>Contoh nyata:</strong> tolak KTA: FN (default lolos) jauh lebih mahal dari FP (nasabah bagus ditolak).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Akurasi dilarang</strong> untuk data imbalance — laporkan precision/recall atau PR-AUC.</li>
          <li>Ranking → AUC/KS/Gini. Probabilitas jujur → Brier. Keputusan → precision/recall di threshold + biaya.</li>
          <li>AUC buta kalibrasi; kalibrasi buta ranking. <strong>Butuh keduanya</strong> untuk model kredit.</li>
          <li>Selalu tanya: &ldquo;metrik ini menjawab pertanyaan bisnis yang mana?&rdquo; — kalau tidak ada, jangan pakai.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Memilih Threshold Penolakan Kredit</h2>
      <div className="callout">
        <p>Model PD KTA: AUC 0,82, kalibrasi baik. Kamu harus menetapkan threshold penolakan. Data validasi (10.000 pengajuan, base rate 8%):</p>
        <ul>
          <li>Threshold 5%: TP=680, FP=2.760, FN=120 → precision 19,8%, recall 85%</li>
          <li>Threshold 15%: TP=480, FP=920, FN=320 → precision 34,3%, recall 60%</li>
          <li>Biaya: tiap FN (default lolos) = Rp15 jt (rata-rata loss); tiap FP (bagus ditolak) = Rp1,5 jt (margin hilang + akuisisi).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Hitung expected cost tiap threshold. (b) Threshold mana yang dipilih? (c) Apa peran AUC di keputusan ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Cost = FN×15 jt + FP×1,5 jt.<br />
          Threshold 5%: 120×15 + 2.760×1,5 = 1.800 + 4.140 = <strong>Rp5.940 jt</strong>.<br />
          Threshold 15%: 320×15 + 920×1,5 = 4.800 + 1.380 = <strong>Rp6.180 jt</strong>.</p>
          <p>(b) <strong>Threshold 5%</strong> — lebih murah Rp240 jt meski &ldquo;menolak lebih banyak orang&rdquo;. Intuisi: FN 10× lebih mahal dari FP, jadi kita toleran terhadap alarm palsu. (Catatan: ini sebelum mempertimbangkan keadilan &amp; reputasi — A3.14.)</p>
          <p>(c) <strong>AUC tidak dipakai sama sekali</strong> di keputusan ini! AUC hanya bilang &ldquo;model bisa me-ranking&rdquo; — threshold dipilih dari <em>biaya</em>, bukan dari metrik ranking. Inilah pelajaran terbesar lesson ini: metrik evaluasi ≠ aturan keputusan.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>ROC-AUC = 0,5 vs PR-AUC = 0,03 (baseline 3%). Model &ldquo;acak&rdquo;? Jelaskan perbedaan baseline keduanya.</li>
              <li>Kapan memakai <em>balanced accuracy</em>? Kelemahannya?</li>
              <li>KS statistic = 0,45. Interpretasikan + hubungkan dengan AUC.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Ya, acak.</strong> Baseline ROC-AUC selalu 0,5; baseline PR-AUC = prevalensi (3%). PR-AUC informatif untuk imbalance (fokus pada kelas minoritas); ROC bisa terlihat &ldquo;bagus&rdquo; (0,8+) padahal presisi hancur.</p>
              <p><strong>2.</strong> Saat butuh <em>satu angka</em> yang adil untuk kelas tak seimbang (rata-rata recall per kelas). Kelemahan: tetap butuh threshold &amp; buta terhadap <em>ranking</em> (tidak seperti AUC).</p>
              <p><strong>3.</strong> KS = jarak maksimum antara distribusi skor positif &amp; negatif (CDF) = <strong>45%</strong> — pemisahan baik (&gt; 0,4 umum dipakai di credit scoring). Hubungan: KS ≈ 2×AUC − 1 (Gini!). KS 0,45 ↔ AUC ≈ 0,72.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fraud rate 0,5%. Model selalu prediksi 'bukan fraud': akurasi 99,5%. Penilaian tepat?"
        options={[
          "Model sangat bagus",
          "Akurasi menipu — recall 0%, tidak menangkap satu pun fraud. Pakai precision/recall atau PR-AUC",
          "Model perlu lebih banyak data",
          "Naikkan threshold",
        ]}
        correct={1}
        explanation="Benar: akurasi pada imbalance ekstrem mengukur kemalasan, bukan kemampuan. Model ini TP=0 → recall=0. Metrik yang jujur: precision/recall di threshold operasional, atau PR-AUC dengan baseline = base rate."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. AUC = 0,85. Interpretasi yang TEPAT?"
        options={[
          "Model 85% akurat",
          "Jika ambil 1 default dan 1 lancar acak, 85% model memberi skor lebih tinggi ke yang default",
          "85% probabilitas prediksi benar",
          "Model menangkap 85% default",
        ]}
        correct={1}
        explanation="Benar: AUC = P(skor⁺ > skor⁻) — probabilitas ranking benar untuk pasangan acak. Bukan persen akurasi, bukan recall. Dan ia buta terhadap kalibrasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Semua probabilitas model dikali 0,1 (jadi jauh kekecilan). Apa yang terjadi dengan AUC dan Brier?"
        options={[
          "Keduanya tetap",
          "AUC tetap (ranking tak berubah), Brier memburuk (probabilitas jadi tidak jujur)",
          "AUC memburuk, Brier tetap",
          "Keduanya membaik",
        ]}
        correct={1}
        explanation="Benar: transformasi monotonik tidak mengubah urutan → AUC identik. Tapi probabilitasnya kini bohong → Brier (proper scoring rule) menghukumnya. Inilah kenapa pricing butuh Brier/kalibrasi, bukan cuma AUC."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. KS = 0,42. Artinya?"
        options={[
          "Akurasi 42%",
          "Ada threshold di mana selisih kumulatif 'bad' vs 'good' mencapai 42 poin — daya pisah model",
          "42% default tertangkap",
          "Gini = 0,42",
        ]}
        correct={1}
        explanation="Benar: KS = jarak vertikal maksimum dua kurva kumulatif. Titik maksimumnya juga kandidat threshold natural. (Gini = 2×AUC−1, bukan KS.)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan PR-AUC LEBIH informatif daripada ROC-AUC?"
        options={[
          "Selalu",
          "Saat kelas positif sangat langka — ROC-AUC bisa terlihat bagus sementara precision operasional jeblok karena TN raksasa mengecilkan FPR",
          "Saat data seimbang",
          "Tidak pernah",
        ]}
        correct={1}
        explanation="Benar: FPR = FP/(FP+TN) — dengan TN raksasa, FP besar pun terlihat 'kecil'. Kurva PR langsung menunjukkan precision (dari yang ditandai, berapa % benar) — tidak bisa bersembunyi di balik base rate."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model A: AUC 0,88, Brier 0,20. Model B: AUC 0,84, Brier 0,09. Untuk perhitungan cadangan kerugian (ECL), pilih?"
        options={[
          "Model A — AUC lebih tinggi",
          "Model B — cadangan butuh probabilitas yang jujur (kalibrasi), dan Brier mengukurnya; AUC hanya ranking",
          "Rata-ratakan keduanya",
          "Tolak keduanya",
        ]}
        correct={1}
        explanation="Benar: ECL = PD × LGD × EAD — PD yang tidak terkalibrasi langsung menjadi rupiah yang salah. Brier 0,09 vs 0,20 menunjukkan B jauh lebih jujur angkanya. Ranking bagus tidak menyelamatkan probabilitas bohong."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Confusion matrix:</strong> precision = ketepatan tandai; recall = kelengkapan tangkap; F₁ = harmoniknya. Threshold menggeser tradeoff-nya.</li>
          <li><strong>AUC</strong> = P(ranking benar pasangan acak); <strong>KS</strong> = jarak kumulatif maksimum; <strong>Gini</strong> = 2×AUC−1. Semua = diskriminasi, buta kalibrasi.</li>
          <li><strong>PR-AUC</strong> untuk positif langka (baseline = base rate, bukan 0,5).</li>
          <li><strong>Brier</strong> = satu-satunya yang menghukum probabilitas tidak jujur (proper scoring rule) — wajib untuk pricing/cadangan.</li>
          <li><strong>Jangan</strong> pakai akurasi di data imbalance; jangan pilih threshold dari AUC — pilih dari <em>biaya ekspektasi</em>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a34-logistic-glm" className="btn btn-secondary btn-sm">← A3.4</Link>
        <Link href="/learn/a36-kalibrasi" className="btn btn-primary btn-sm">Next: A3.6 →</Link>
      </div>
    </div>
  );
}
