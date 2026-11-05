"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A36Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const calibGoodData = [
    {
      x: [0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5],
      y: [0.021, 0.048, 0.102, 0.148, 0.205, 0.295, 0.41, 0.49],
      mode: "markers",
      type: "scatter",
      name: "Model terkalibrasi",
      marker: { color: "#22c55e", size: 10 },
    },
    {
      x: [0, 0.55],
      y: [0, 0.55],
      mode: "lines",
      type: "scatter",
      name: "Ideal (prediksi = aktual)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const calibBadData = [
    {
      x: [0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5],
      y: [0.008, 0.02, 0.045, 0.07, 0.1, 0.16, 0.24, 0.32],
      mode: "markers+lines",
      type: "scatter",
      name: "Model overconfident",
      marker: { color: "#ef4444", size: 10 },
      line: { color: "#ef4444", width: 2 },
    },
    {
      x: [0, 0.55],
      y: [0, 0.55],
      mode: "lines",
      type: "scatter",
      name: "Ideal",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const calibCompareData = [
    {
      x: [0.05, 0.1, 0.15, 0.2, 0.3, 0.4],
      y: [0.048, 0.098, 0.152, 0.198, 0.305, 0.395],
      mode: "markers",
      type: "scatter",
      name: "Platt scaling",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [0.05, 0.1, 0.15, 0.2, 0.3, 0.4],
      y: [0.052, 0.101, 0.149, 0.203, 0.298, 0.402],
      mode: "markers",
      type: "scatter",
      name: "Isotonic",
      marker: { color: "#e8a838", size: 9, symbol: "diamond" },
    },
    {
      x: [0, 0.45],
      y: [0, 0.45],
      mode: "lines",
      type: "scatter",
      name: "Ideal",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Kurva kalibrasi dari nol: binning + observed rate
# Model "sombong": probabilitasnya sistematis kekecilan 40%.
import random, math
random.seed(21)

def sigmoid(z): return 1/(1+math.exp(-z))
n = 5000
skor = [random.gauss(0, 1) for _ in range(n)]
p_true = [sigmoid(-2.0 - 1.5*s) for s in skor]
y = [1 if random.random() < p else 0 for p in p_true]
# model sombong: probabilitas dikali 0.6 (sistematis underestimate)
p_pred = [p*0.6 for p in p_true]

# binning: 10 bucket probabilitas
buckets = [[] for _ in range(10)]
for p, yi in zip(p_pred, y):
    b = min(int(p*10), 9)
    buckets[b].append(yi)

print(f"{'bucket':>6} | {'rata2 prediksi':>14} | {'aktual':>7} | n")
print("-"*44)
for i, b in enumerate(buckets):
    if b:
        print(f"{i/10:>4.1f}-{i/10+0.1:.1f} | {sum(p for p, yi in zip(p_pred, y) if min(int(p*10),9)==i)/len(b):>14.3f} | {sum(b)/len(b):>6.1%} | {len(b)}")
print()
print("BACA: kolom 'aktual' KONSISTEN di atas 'rata2 prediksi' ->")
print("model sistematis MEREMEHKAN risiko (underconfident ke arah bawah).")
print("Untuk pricing, ini berarti tarif terlalu murah = rugi!")
print()
print("COBA: ubah 0.6 -> 1.0 (model jujur). Kurva menempel diagonal.")
print("COBA: ubah 0.6 -> 1.8 lalu clip di 1.0: model jadi OVERconfident.")`;

  const lab2Code = `# Platt scaling dari nol: kalibrasi ulang via regresi logistik 1D
# Fit sigmoid(p) pada data kalibrasi TERPISAH (bukan data latih model!).
import random, math
random.seed(33)

def sigmoid(z): return 1/(1+math.exp(-z))
n = 4000
skor = [random.gauss(0, 1) for _ in range(n)]
p_true = [sigmoid(-2.0 - 1.5*s) for s in skor]
y = [1 if random.random() < p else 0 for p in p_true]
p_raw = [min(p*1.7, 0.999) for p in p_true]  # model overconfident

# split: 2000 untuk fit Platt, 2000 untuk evaluasi (simulasi honest)
p_fit, y_fit = p_raw[:2000], y[:2000]
p_ev, y_ev = p_raw[2000:], y[2000:]

def brier(ps, ys): return sum((p-y)**2 for p, y in zip(ps, ys))/len(ps)

# Platt: logit(p_cal) = a + b*logit(p_raw) ; fit via gradient descent
def logit(p): return math.log(p/(1-p))
a, b = 0.0, 1.0
for _ in range(500):
    ga = gb = 0.0
    for p, yi in zip(p_fit, y_fit):
        pc = sigmoid(a + b*logit(p))
        ga += (yi - pc); gb += (yi - pc)*logit(p)
    a += 0.3*ga/len(p_fit); b += 0.3*gb/len(p_fit)
p_cal = [sigmoid(a + b*logit(p)) for p in p_ev]

print(f"Brier SEBELUM kalibrasi: {brier(p_ev, y_ev):.4f}")
print(f"Brier SESUDAH Platt    : {brier(p_cal, y_ev):.4f}")
print(f"Parameter Platt: a={a:.3f}, b={b:.3f}")
print()
print("Cek bucket tengah (prediksi 0.1-0.2):")
for nama, ps in [("mentah  ", p_ev), ("kalibrasi", p_cal)]:
    sel = [yi for p, yi in zip(ps, y_ev) if 0.1 <= p < 0.2]
    avgp = sum(p for p in ps if 0.1 <= p < 0.2)/len(sel)
    print(f"  {nama}: rata2 prediksi={avgp:.3f}, aktual={sum(sel)/len(sel):.3f} (n={len(sel)})")
print()
print("COBA: fit Platt di data LATIH model (p_fit=p_raw[:2000] tapi y dari")
print("data yang sama dengan training) - bedanya kecil di simulasi ini,")
print("tapi di dunia nyata itu mencontek (A3.8: leakage!).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.6 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Kalibrasi Probabilitas:<br />Ketika &ldquo;PD 10%&rdquo; Harus Benar-Benar Berarti 10%</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tarif yang &ldquo;Kompetitif&rdquo; dan Rugi Rp200 Miliar</a></li>
          <li><a href="#definisi">Kalibrasi — Definisi &amp; Kurva Kalibrasi</a></li>
          <li><a href="#ukur">Mengukur Miskalibrasi: ECE, Brier, dan Uji Formal</a></li>
          <li><a href="#platt">Platt Scaling vs Isotonic — Dua Obat Miskalibrasi</a></li>
          <li><a href="#jebakan">Jebakan Kalibrasi: Sampling, Drift, dan Subgrup</a></li>
          <li><a href="#lab1">🔬 Lab 1: Membaca Kurva Kalibrasi dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Platt Scaling dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Kalibrasi, Metode Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Validasi Kalibrasi untuk ECL</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan kalibrasi sempurna dan membaca kurva kalibrasi (reliability diagram) untuk mendiagnosis over/under-confidence.</li>
          <li>Menghitung ECE dan Brier score serta menjelaskan dekomposisi Brier menjadi kalibrasi + ketajaman.</li>
          <li>Membandingkan Platt scaling vs isotonic regression: asumsi, kebutuhan data, dan kapan masing-masing tepat.</li>
          <li>Mengidentifikasi tiga perusak kalibrasi (sampling bias, drift, heterogenitas subgrup) dan pencegahannya.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Tarif yang &ldquo;Kompetitif&rdquo; dan Rugi Rp200 Miliar</h2>
      <div className="story">
        <p>Multifinance &ldquo;CepatCair&rdquo; bangga: model PD baru mereka punya AUC 0,86 — tertinggi yang pernah ada. Tim pricing memakai PD model untuk menetapkan bunga: bunga = PD × LGD + margin. Tarif mereka jadi &ldquo;kompetitif&rdquo; — lebih murah dari pesaing. Penyaluran meledak.</p>
        <p>Setahun kemudian, audit menemukan lubang Rp200 miliar. Investigasi: model itu memang jago <em>me-ranking</em> (AUC 0,86 ✓), tapi probabilitasnya <strong>sistematis kekecilan 40%</strong> — &ldquo;PD 6%&rdquo; dari model ternyata default <strong>10%</strong> di dunia nyata. Tarif yang &ldquo;kompetitif&rdquo; itu sebenarnya <strong>tarif bunuh diri</strong>: mereka menjual risiko Rp10 dengan harga Rp6.</p>
        <p>Twist-nya: tidak ada metrik di dashboard yang menangkap ini — karena dashboard hanya menampilkan AUC. Model yang sempurna me-ranking bisa <em>bencana</em> dalam pricing. Lesson ini tentang memastikan angka probabilitasmu jujur, bukan sekadar urutannya benar.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="definisi">Kalibrasi — Definisi &amp; Kurva Kalibrasi</h2>
      <p><strong>Definisi.</strong> Model <strong>terkalibrasi sempurna</strong> jika:</p>
      <Tex math={String.raw`P(y = 1 \mid \hat{p} = q) = q \quad \text{untuk semua } q`} block />
      <p>Artinya: dari semua kasus di mana model bilang &ldquo;probabilitas q&rdquo;, tepat <strong>q</strong> yang benar-benar terjadi. Model bilang PD 10% ke 1.000 nasabah → ≈ 100 yang default. Tidak 60, tidak 140.</p>
      <p><strong>Kurva kalibrasi</strong> (<em>reliability diagram</em>): kelompokkan prediksi ke bucket (0–5%, 5–10%, ...), plot rata-rata prediksi (x) vs fraksi aktual (y). Sempurna = menempel garis diagonal.</p>

      <PlotlyChart
        data={calibGoodData}
        title="Kurva Kalibrasi SEHAT: menempel diagonal"
        layout={{ xaxis: { title: "Probabilitas prediksi (rata-rata bucket)" }, yaxis: { title: "Fraksi aktual terjadi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = satu bucket prediksi. Sumbu horizontal = rata-rata probabilitas yang diprediksi model; vertikal = fraksi yang benar-benar terjadi. Garis putus-putus = ideal.</p>
        <p><strong>Interpretasi:</strong> titik-titik hijau menempel diagonal — saat model bilang 20%, kenyataannya ≈ 20%. Model ini <strong>jujur</strong>: angkanya bisa langsung dipakai untuk pricing dan pencadangan tanpa koreksi.</p>
      </div>

      <PlotlyChart
        data={calibBadData}
        title="Kurva Kalibrasi SAKIT: di bawah diagonal = overconfident"
        layout={{ xaxis: { title: "Probabilitas prediksi (rata-rata bucket)" }, yaxis: { title: "Fraksi aktual terjadi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti kurva sebelumnya.</p>
        <p><strong>Interpretasi:</strong> titik-titik merah <strong>di bawah diagonal</strong>: model bilang 30%, kenyataannya 16%?? Tunggu — baca dengan benar: titik (0,3; 0,16) berarti &ldquo;saat model memprediksi 30%, aktualnya hanya 16%&rdquo; — model <strong>overconfident</strong> (melebih-lebihkan risiko). Sebaliknya titik <em>di atas</em> diagonal = <strong>underconfident</strong>/meremehkan (kasus CepatCair: prediksi 6%, aktual 10%). <strong>Aturan baca:</strong> di bawah diagonal = model sombong (bilang lebih besar dari kenyataan); di atas = model minder.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kalibrasi dan diskriminasi adalah <strong>dua sumbu independen</strong>. Model A: AUC 0,9 tapi probabilitas ngawur (ranking bagus, angka bohong). Model B: selalu prediksi base rate 5% — terkalibrasi sempurna tapi tidak berguna (angka jujur, tapi tidak membedakan siapa-siapa = tidak <em>tajam</em>). Model kredit yang layak produksi butuh <strong>keduanya</strong>: ranking tajam DAN angka jujur.</p>
      </div>

      <h2 id="ukur">Mengukur Miskalibrasi: ECE, Brier, dan Uji Formal</h2>
      <p><strong>Definisi.</strong> Tiga cara mengukur:</p>
      <ul>
        <li><strong>ECE</strong> (<em>expected calibration error</em>): rata-rata |prediksi − aktual| per bucket, dibobot jumlah isi bucket:
          <Tex math={String.raw`ECE = \sum_{b} \frac{n_b}{n}\,|\bar{p}_b - \bar{y}_b|`} block />
          ECE = 0,03 artinya rata-rata probabilitas meleset 3 poin — interpretasinya langsung dan intuitif.</li>
        <li><strong>Brier score</strong>: <Tex math={String.raw`\frac{1}{n}\sum(p_i - y_i)^2`} /> — terurai menjadi <strong>kalibrasi + ketajaman + ketidakpastian</strong> (<em>uncertainty</em> = variansi base rate, di luar kendali model). Brier menghukum keduanya: tidak jujur <em>dan</em> tidak tajam.</li>
        <li><strong>Uji Hosmer-Lemeshow</strong>: uji chi-square formal &ldquo;apakah prediksi per bucket berbeda signifikan dari aktual?&rdquo;. Catatan: di sampel raksasa, uji ini <em>selalu</em> menolak (terlalu sensitif) — untuk n besar, laporkan ECE + kurva, bukan p-value.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: menghitung ECE</summary>
        <p>Tiga bucket: (n=1000, p̄=0,05, ȳ=0,07), (n=500, p̄=0,15, ȳ=0,12), (n=200, p̄=0,30, ȳ=0,38). Total n = 1700.</p>
        <p><strong>Langkah 1</strong> — selisih per bucket: |0,05−0,07| = 0,02; |0,15−0,12| = 0,03; |0,30−0,38| = 0,08.<br />
        <strong>Langkah 2</strong> — bobot: (1000/1700)×0,02 + (500/1700)×0,03 + (200/1700)×0,08.<br />
        <strong>Langkah 3</strong> — ECE = 0,0118 + 0,0088 + 0,0094 = <strong>0,030</strong> (3 poin).<br />
        Perhatikan bucket ketiga: meleset 8 poin tapi bobotnya kecil (n=200) — ECE tidak panik berlebihan untuk bucket sepi, tidak seperti uji chi-square mentah.</p>
      </details>

      <h2 id="platt">Platt Scaling vs Isotonic — Dua Obat Miskalibrasi</h2>
      <p><strong>Definisi.</strong> Keduanya <strong>kalibrasi ulang</strong> (<em>recalibration</em>) output model memakai data validasi <strong>terpisah</strong>:</p>
      <ul>
        <li><strong>Platt scaling</strong>: fit regresi logistik 1-dimensi dari skor mentah ke probabilitas:
          <Tex math={String.raw`p_{cal} = \sigma(a + b \cdot s_{raw})`} block />
          (<Tex math={String.raw`\sigma`} /> = sigmoid; <Tex math={String.raw`s_{raw}`} /> bisa logit skor mentah.) Hanya 2 parameter — <strong>tidak mengubah ranking</strong> (monotonik), butuh sedikit data, asumsi bentuk S.</li>
        <li><strong>Isotonic regression</strong>: fit fungsi tangga <strong>monotonik non-parametrik</strong> — bebas bentuk apa pun asal tidak turun. Fleksibel untuk miskalibrasi berbentuk aneh (misal model terlalu sombong di tengah tapi minder di ujung), tapi butuh <strong>banyak data</strong> dan bisa overfit di bucket sepi.</li>
      </ul>

      <PlotlyChart
        data={calibCompareData}
        title="Setelah Kalibrasi Ulang: Platt vs Isotonic"
        layout={{ xaxis: { title: "Probabilitas prediksi (setelah kalibrasi)" }, yaxis: { title: "Fraksi aktual" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva kalibrasi setelah dua metode recalibration; garis putus-putus = ideal.</p>
        <p><strong>Interpretasi:</strong> keduanya menempel diagonal — miskalibrasi sistematis berhasil dikoreksi. Keduanya <strong>tidak mengubah AUC</strong> (ranking sama, hanya angkanya dikoreksi). Pilih Platt jika data kalibrasi sedikit (&lt; 1.000) atau miskalibrasinya mulus; pilih isotonic jika data berlimpah dan polanya aneh.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalibrasi ulang di data latih saja cukup.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kalibrasi di data yang dipakai melatih model = <strong>mencontek dua kali</strong>. Model sudah overfit ke data latih (probabilitasnya terlalu pede di sana); Platt yang di-fit di data yang sama hanya &ldquo;mengoreksi&rdquo; kepedean palsu itu — bukan kepedean di dunia nyata. Wajib pakai <strong>data kalibrasi terpisah</strong> (split khusus atau cross-validation out-of-fold). Ini bentuk leakage yang halus (A3.8).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model <em>diskriminatif</em> modern (terutama gradient boosting &amp; deep learning) terkenal <strong>overconfident</strong> — mereka memaksimalkan pemisahan, bukan kejujuran probabilitas. Jadi alur kerja standarnya: <strong>latih untuk ranking → kalibrasi ulang untuk angka</strong>. Jangan heran kalau model terbaikmu butuh &ldquo;terapi kejujuran&rdquo; sebelum dipakai pricing.</p>
      </div>

      <h2 id="jebakan">Jebakan Kalibrasi: Sampling, Drift, dan Subgrup</h2>
      <ul>
        <li><strong>Sampling bias</strong> (A3.4 sudah disinggung): latih di sampel 50:50 (oversampling default) lalu pakai probabilitasnya mentah → probabilitas <strong>sistematis kegedean</strong>. Koreksi: sesuaikan dengan base rate populasi (<em>prior correction</em>):
          <Tex math={String.raw`p_{pop} = \frac{1}{1 + \frac{1-p_s}{p_s}\cdot\frac{\pi_0}{\pi_1}}`} block />
          dengan <Tex math={String.raw`p_s`} /> = probabilitas dari sampel, <Tex math={String.raw`\pi_1/\pi_0`} /> = rasio base rate sampel vs populasi.</li>
        <li><strong>Drift</strong>: kalibrasi hari ini ≠ kalibrasi tahun depan. Ekonomi berubah → hubungan skor-default bergeser. Obat: <strong>monitoring kalibrasi berkala</strong> (bucket aktual vs prediksi per kuartal) + rekalibrasi terjadwal (A3.8: PSI).</li>
        <li><strong>Heterogenitas subgrup</strong>: terkalibrasi secara agregat tapi miskalibrasi per segmen (misal akurat untuk Jawa, meleset untuk luar Jawa). Obat: <strong>kurva kalibrasi per segmen penting</strong> — agregat bisa menyembunyikan ketidakadilan (jembatan ke A3.14).</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AUC tinggi berarti probabilitasnya bisa langsung dipakai.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AUC hanya sertifikat <em>ranking</em>. Kasus CepatCair (AUC 0,86, probabilitas 40% kekecilan) membuktikan ranking sempurna ≠ angka jujur. Aturan validasi: <strong>tidak ada probabilitas yang dipakai untuk pricing/cadangan sebelum lolos uji kalibrasi</strong> — bukan cuma AUC.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Kalibrasi = &ldquo;PD 10% harus berarti 10%&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Miskalibrasi — PD 10% yang sebenarnya 4%</summary>
              <p>Model memprediksi PD 10% untuk 1.000 nasabah. Realisasi: 40 macet (4%). Apa dampaknya &amp; obatnya?</p>
              <p><strong>Langkah 1</strong> — dampak: <strong>over-estimasi 2,5×</strong> → provisi berlebih (modal menganggur!) + pricing terlalu mahal (nasabah bagus kabur ke kompetitor!).<br />
              <strong>Langkah 2</strong> — diagnosis: reliability diagram — bin &ldquo;10%&rdquo; realisasinya 4% (di bawah diagonal).<br />
              <strong>Langkah 3</strong> — obat: <strong>Platt scaling</strong> (regresi logistik di atas skor) atau <strong>isotonic</strong> (nonparametrik, butuh data lebih). Validasi: ECE turun.</p>
              <p>Pelajaran: AUC mengukur <em>ranking</em> (siapa lebih berisiko) — kalibrasi mengukur <em>level</em> (berapa tepatnya). Keduanya dibutuhkan untuk pricing/provisi. Model bisa AUC tinggi tapi miskalibrasi!</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: ECE — satu angka untuk kalibrasi</summary>
              <p>10 bin prediksi. Bin &ldquo;0–10%&rdquo;: prediksi rata-rata 5%, realisasi 7% (n=500). Bin &ldquo;10–20%&rdquo;: 15% vs 14% (n=300). Hitung kontribusi ECE dua bin ini.</p>
              <p><strong>Langkah 1</strong> — ECE = Σ (n<sub>b</sub>/n) × |pred − real|. Bin1: (500/800)×|0,05−0,07| = 0,625×0,02 = 0,0125.<br />
              <strong>Langkah 2</strong> — Bin2: (300/800)×|0,15−0,14| = 0,375×0,01 = 0,00375.<br />
              <strong>Langkah 3</strong> — kontribusi = 0,01625 (1,6 poin). ECE total = jumlahkan semua bin. Target: &lt; 2–3% untuk model produksi.</p>
              <p>Pelajaran: ECE = &ldquo;rata-rata |selisih| tertimbang&rdquo;. Ia satu angka untuk monitoring: ECE naik tiba-tiba = <em>drift kalibrasi</em> (model perlu recalibrate!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Membaca Kurva Kalibrasi dari Nol</h2>
      <p>Bangun kurva kalibrasi dengan binning manual. Diagnosis apakah model sombong, minder, atau jujur.</p>
      <PyodideLab
        title="Lab 1 — Reliability Diagram Manual"
        hint="Coba: 0.6 → 1.0 (model jujur, kurva menempel diagonal). Coba 1.8: model overconfident."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Platt Scaling dari Nol</h2>
      <p>Kalibrasi ulang model overconfident dengan regresi logistik 1D di data terpisah. Ukur perbaikan Brier-nya.</p>
      <PyodideLab
        title="Lab 2 — Recalibration dengan Platt Scaling"
        hint="Perhatikan: data fit Platt TERPISAH dari data evaluasi. Itulah kejujuran metodologis."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Kalibrasi, Metode Apa</h2>

      <div className="decision-card">
        <h3>1. Probabilitas dipakai untuk pricing/cadangan/keputusan nilai → <strong>wajib kalibrasi + validasi</strong></h3>
        <p><strong>Kondisi:</strong> angka probabilitas masuk rumus rupiah (bunga, ECL, limit).</p>
        <p><strong>Kenapa:</strong> miskalibrasi 2% × portofolio besar = kerugian raksasa. AUC tidak melindungi dari ini.</p>
        <p><strong>Contoh nyata:</strong> PD untuk ECL/IFRS 9 — regulator mensyaratkan backtesting kalibrasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Hanya butuh ranking (prioritas koleksi) → <strong>kalibrasi opsional</strong></h3>
        <p><strong>Kondisi:</strong> keputusan = &ldquo;hubungi 100 teratas&rdquo;, bukan berdasarkan nilai probabilitas.</p>
        <p><strong>Kenapa:</strong> ranking hanya butuh urutan benar (AUC/KS cukup). Jangan buang waktu mengkalibrasi yang tidak dipakai.</p>
        <p><strong>Contoh nyata:</strong> daftar prioritas penagihan harian.</p>
      </div>

      <div className="decision-card">
        <h3>3. Miskalibrasi mulus/sistematis + data kalibrasi sedikit → <strong>Platt scaling</strong></h3>
        <p><strong>Kondisi:</strong> kurva kalibrasi menyimpang mulus (bukan zigzag); n kalibrasi &lt; ~1.000.</p>
        <p><strong>Kenapa:</strong> 2 parameter, stabil, tidak mengubah ranking.</p>
        <p><strong>Contoh nyata:</strong> model logistik yang sedikit overconfident.</p>
      </div>

      <div className="decision-card">
        <h3>4. Miskalibrasi berbentuk aneh + data berlimpah → <strong>isotonic regression</strong></h3>
        <p><strong>Kondisi:</strong> pola non-S (sombong di tengah, minder di ujung); n kalibrasi besar.</p>
        <p><strong>Kenapa:</strong> non-parametrik — mengikuti bentuk data apa pun selama monotonik.</p>
        <p><strong>Contoh nyata:</strong> output gradient boosting yang overconfident tidak beraturan.</p>
      </div>

      <div className="decision-card">
        <h3>5. Latih di sampel tidak representatif → <strong>koreksi prior dulu, baru kalibrasi</strong></h3>
        <p><strong>Kondisi:</strong> oversampling/undersampling dipakai saat training.</p>
        <p><strong>Kenapa:</strong> sampling mengubah base rate → probabilitas mentah pasti bias. Koreksi prior mengembalikan ke base rate populasi.</p>
        <p><strong>Contoh nyata:</strong> model fraud dilatih 50:50 padahal populasi 0,1%.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Angka probabilitas untuk rupiah → wajib lolos kalibrasi.</strong> AUC bukan surat izin pricing.</li>
          <li>Di bawah diagonal = sombong; di atas = minder. Baca kurvanya, jangan cuma angkanya.</li>
          <li>Kalibrasi ulang <strong>selalu</strong> di data terpisah — tidak pernah di data latih.</li>
          <li>Cek per segmen: agregat yang cantik bisa menyembunyikan segmen yang dizalimi.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Validasi Kalibrasi untuk ECL</h2>
      <div className="callout">
        <p>Kamu validator independen. Model PD portofolio KPR (Rp8 triliun) mengklaim: AUC 0,84, &ldquo;terkalibrasi&rdquo;. Kamu minta data dan menemukan:</p>
        <ul>
          <li>Bucket PD 2–4% (n=12.000): aktual default 5,8%</li>
          <li>Bucket PD 8–12% (n=3.000): aktual default 9,1%</li>
          <li>Model dilatih dengan oversampling default 5×; tidak ada koreksi prior yang didokumentasikan.</li>
          <li>Kalibrasi hanya dilaporkan agregat — tidak per wilayah.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apakah model &ldquo;terkalibrasi&rdquo;? Hitung arah biasnya. (b) Apa kemungkinan penyebabnya? (c) Rekomendasi validasimu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tidak.</strong> Bucket 2–4%: prediksi rata-rata ≈3%, aktual 5,8% — <strong>underestimate ~2,8 poin</strong> (model minder). Bucket 8–12%: prediksi ≈10%, aktual 9,1% — sedikit overestimate. Pola tidak konsisten = bukan sekadar bias level, tapi bentuk yang salah.</p>
          <p>(b) <strong>Oversampling 5× tanpa koreksi prior</strong> adalah tersangka utama — probabilitas mentah dari sampel yang diperkaya default pasti bias. Kemungkinan juga drift (kondisi ekonomi berubah sejak training).</p>
          <p>(c) <strong>Tolak klaim &ldquo;terkalibrasi&rdquo;.</strong> Minta: (1) koreksi prior + recalibration di data out-of-time terpisah, (2) kurva kalibrasi per wilayah/segmen, (3) backtesting kuartalan terjadwal. Dampak rupiah: underestimate 2,8 poin di bucket terbesar (Rp8T × bobot bucket) = cadangan kurang ratusan miliar — temuan material.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Model A: AUC 0,85, ECE 8%. Model B: AUC 0,80, ECE 1%. Untuk <em>pricing premi</em>, mana? Untuk <em>ranking prioritas collection</em>, mana?</li>
              <li>Platt scaling vs isotonic — kapan masing-masing? (Data &amp; bentuk.)</li>
              <li>Mengapa kalibrasi bisa <em>rusak</em> setelah model di-deploy 6 bulan? (2 sebab.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Pricing → B</strong> (butuh level peluang yang tepat!). <strong>Ranking collection → A</strong> (butuh urutan siapa dulu — level absolut kurang penting). Pilih metrik sesuai <em>penggunaan</em>.</p>
              <p><strong>2.</strong> <strong>Platt</strong>: data sedikit, miskalibrasi berbentuk sigmoid (umum!). <strong>Isotonic</strong>: data banyak (≥ 1.000), bentuk tak beraturan — tapi <em>overfit</em> jika data sedikit (nonparametrik!).</p>
              <p><strong>3.</strong> (a) <strong>Drift</strong>: populasi/perilaku berubah (COVID!). (b) <strong>Feedback loop</strong>: model memengaruhi siapa yang diterima → distribusi skor bergeser. Solusi: monitoring ECE + recalibrate berkala.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kurva kalibrasi menunjukkan titik-titik KONSISTEN di atas diagonal. Artinya?"
        options={[
          "Model overconfident (melebih-lebihkan)",
          "Model underconfident — aktual lebih tinggi dari prediksi; model sistematis meremehkan risiko",
          "Model terkalibrasi sempurna",
          "AUC pasti rendah",
        ]}
        correct={1}
        explanation="Benar: di atas diagonal = 'bilang 6%, kenyataan 10%' = minder/meremehkan. Ini kasus CepatCair — berbahaya untuk pricing karena tarif jadi kemurahan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. ECE = 0,04. Interpretasi tepat?"
        options={[
          "Model 96% akurat",
          "Rata-rata (terbobot) probabilitas meleset 4 poin dari frekuensi aktual",
          "AUC = 0,96",
          "Model tidak bisa dipakai",
        ]}
        correct={1}
        explanation="Benar: ECE adalah rata-rata absolut selisih prediksi vs aktual per bucket. 0,04 = 4 poin. Apakah itu 'besar' tergantung konteks: untuk PD pricing di portofolio raksasa, 4 poin = material."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kenapa kalibrasi ulang TIDAK BOLEH di-fit di data latih model?"
        options={[
          "Terlalu lambat",
          "Model sudah overfit di data latih (probabilitasnya terlalu pede di sana) — Platt hanya mengoreksi kepedean palsu, bukan kepedean di dunia nyata",
          "Platt butuh data kecil",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: ini leakage yang halus. Data latih memberi gambaran kepedean model yang sudah tercemar overfitting. Wajib pakai data kalibrasi terpisah (split khusus / out-of-fold CV)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Model dilatih di sampel 50:50 padahal populasi default 2%. Probabilitas mentah 30% untuk seorang nasabah. Masalah?"
        options={[
          "Tidak ada — 30% tetap 30%",
          "Probabilitas sistematis kegedean karena base rate sampel ≠ populasi — wajib koreksi prior sebelum dipakai",
          "Modelnya pasti overfit",
          "Threshold harus 50%",
        ]}
        correct={1}
        explanation="Benar: sampling mengubah base rate → probabilitas mentah bias ke atas. Koreksi prior mengembalikannya ke skala populasi. Tanpa ini, pricing memakai angka yang membesar-besarkan risiko."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Platt scaling vs isotonic: kapan pilih isotonic?"
        options={[
          "Selalu — lebih fleksibel",
          "Saat data kalibrasi berlimpah dan pola miskalibrasi berbentuk aneh (non-S); Platt untuk kasus mulus/data sedikit",
          "Saat butuh mengubah ranking",
          "Saat data sedikit",
        ]}
        correct={1}
        explanation="Benar: isotonic non-parametrik — kuat untuk pola aneh tapi rakus data dan bisa overfit di bucket sepi. Platt (2 parameter) stabil untuk data sedikit. Keduanya monotonik = tidak mengubah ranking/AUC."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Uji Hosmer-Lemeshow menolak (p<0,001) pada n=2 juta, tapi ECE=0,008 dan kurva menempel diagonal. Kesimpulan?"
        options={[
          "Model miskalibrasi parah — tolak",
          "Uji terlalu sensitif di n raksasa: deviasi 0,8 poin terdeteksi 'signifikan' tapi tidak material. Percayai ECE + kurva",
          "Naikkan jumlah bucket",
          "Buang model",
        ]}
        correct={1}
        explanation="Benar: signifikansi statistik ≠ materialitas (pelajaran A3.1!). Di n=2 juta, perbedaan 0,8 poin pun 'signifikan'. Keputusan validasi harus berbasis materialitas bisnis (ECE, dampak rupiah), bukan p-value semata."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kalibrasi sempurna:</strong> <Tex math={String.raw`P(y=1|\hat{p}=q)=q`} />. Kurva kalibrasi: di bawah diagonal = sombong, di atas = minder.</li>
          <li><strong>Ukur:</strong> ECE (intuitif, poin), Brier (kalibrasi + ketajaman), Hosmer-Lemeshow (formal, tapi terlalu sensitif di n besar).</li>
          <li><strong>Obat:</strong> Platt scaling (mulus, data sedikit) vs isotonic (fleksibel, data banyak) — keduanya di <strong>data terpisah</strong>, tidak mengubah ranking.</li>
          <li><strong>Jebakan:</strong> sampling bias (koreksi prior!), drift (monitoring berkala), heterogenitas subgrup (cek per segmen).</li>
          <li><strong>Jangan</strong> pakai probabilitas untuk rupiah sebelum lolos uji kalibrasi — AUC bukan surat izin pricing.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a35-metrik-klasifikasi" className="btn btn-secondary btn-sm">← A3.5</Link>
        <Link href="/learn/a37-imbalanced-data" className="btn btn-primary btn-sm">Next: A3.7 →</Link>
      </div>
    </div>
  );
}
