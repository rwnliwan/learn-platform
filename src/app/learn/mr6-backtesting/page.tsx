"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function MR6Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Backtest visual: VaR 99% vs P&L aktual 250 hari, tandai pelanggaran (berkelompok!)
  const r = rng(66);
  const N = 250;
  const var99 = 10;
  const pnl: number[] = [];
  for (let i = 0; i < N; i++) {
    const cluster = i > 150 && i < 175; // periode stres: pelanggaran berkelompok
    const sd = cluster ? 9 : 4;
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5;
    pnl.push(+(u * sd).toFixed(1));
  }
  const days = pnl.map((_, i) => i + 1);
  const breachIdx = pnl.map((v, i) => (v < -var99 ? i : -1)).filter((i) => i >= 0);

  const btData = [
    { x: days, y: pnl, type: "scatter", mode: "lines", name: "P&L aktual", line: { color: "#2a7de1", width: 1.5 } },
    {
      x: days, y: days.map(() => -var99), type: "scatter", mode: "lines", name: "VaR 99%",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
    {
      x: breachIdx.map((i) => i + 1), y: breachIdx.map((i) => pnl[i]), type: "scatter", mode: "markers",
      name: "Pelanggaran", marker: { color: "#ef4444", size: 9, symbol: "x" },
    },
  ];

  const lab1Code = String.raw`import math

# UJI KUPIEC POF (Proportion of Failures)
# H0: probabilitas pelanggaran = p (misal 1% utk VaR 99%)
# LR = -2 ln[ (1-p)^(T-x) * p^x ] + 2 ln[ (1-x/T)^(T-x) * (x/T)^x ]  ~ chi2(1)

def kupiec(T, x, p=0.01):
    if x == 0 or x == T:
        return float('inf'), 0.0  # kasus degenerat
    phat = x / T
    lr = (-2 * math.log((1 - p) ** (T - x) * p ** x)
          + 2 * math.log((1 - phat) ** (T - x) * phat ** x))
    # p-value dari chi-square df=1: P(chi2 > lr)
    pval = 1 - math.erf(math.sqrt(lr / 2)) if lr > 0 else 1.0
    return lr, pval

print(f"{'Skenario':28s} {'x':>3s} {'LR':>7s} {'p-value':>8s}  Keputusan (5%)")
for label, T, x in [("Normal: 3 pelanggaran/250h", 250, 3),
                    ("Batas: 5 pelanggaran/250h", 250, 5),
                    ("Buruk: 9 pelanggaran/250h", 250, 9),
                    ("Krisis: 15 pelanggaran/250h", 250, 15)]:
    lr, pv = kupiec(T, x)
    verdict = "TOLAK H0 (model salah kalibrasi)" if pv < 0.05 else "gagal tolak H0"
    print(f"{label:28s} {x:>3d} {lr:>7.2f} {pv:>8.4f}  {verdict}")

print()
print("Coba: x=4 (di bawah ekspektasi 2.5? tidak -- ekspektasi=2.5).")
print("Uji ini dua arah: pelanggaran TERLALU SEDIKIT pun mencurigakan")`;

  const lab2Code = String.raw`# UJI CHRISTOFFERSEN: pelanggaran harus ACAK (independen), bukan berkelompok.
# Model rantai Markov 2-state: 0=tidak langgar, 1=langgar.
# Hitung transisi: n00, n01, n10, n11. Jika pelanggaran berkelompok,
# P(1|1) >> P(1|0) -> tolak independensi.

def christoffersen(seq):
    n00 = n01 = n10 = n11 = 0
    for a, b in zip(seq, seq[1:]):
        if a == 0 and b == 0: n00 += 1
        elif a == 0 and b == 1: n01 += 1
        elif a == 1 and b == 0: n10 += 1
        else: n11 += 1
    p01 = n01 / (n00 + n01) if (n00 + n01) else 0
    p11 = n11 / (n10 + n11) if (n10 + n11) else 0
    return (n00, n01, n10, n11), p01, p11

# Skenario A: 8 pelanggaran TERSBAR acak
import random
random.seed(1)
seqA = [0] * 250
for i in random.sample(range(250), 8):
    seqA[i] = 1
# Skenario B: 8 pelanggaran BERKELOMPOK (2 cluster x 4 hari berurutan)
seqB = [0] * 250
for i in list(range(100, 104)) + list(range(180, 184)):
    seqB[i] = 1

for label, seq in [("Tersebar acak", seqA), ("Berkelompok", seqB)]:
    (n00, n01, n10, n11), p01, p11 = christoffersen(seq)
    print(f"{label}:")
    print(f"  P(langgar | kemarin tidak langgar) = {p01:.3f}")
    print(f"  P(langgar | kemarin langgar)       = {p11:.3f}")
    print(f"  -> {'BERKELOMPOK! Model gagal saat dibutuhkan' if p11 > 3 * p01 else 'independen OK'}")
    print()
print("Kupiec menghitung JUMLAH; Christoffersen menghitung POLA.")
print("Keduanya lolos = model terkalibrasi DAN pelanggaran tidak berkelompok.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR6 — Market Risk Analytics</span>
        <h1 className="display-title">Backtesting VaR:<br />Mengadili Model dengan Data Nyata</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Lolos Ujian tapi Gagal di Lapangan</a></li>
          <li><a href="#konsep">Konsep Dasar: Pelanggaran &amp; Dua Jenis P&amp;L</a></li>
          <li><a href="#kupiec">Uji Kupiec: Apakah Jumlahnya Benar?</a></li>
          <li><a href="#christ">Uji Christoffersen: Apakah Polanya Acak?</a></li>
          <li><a href="#traffic">Traffic Light Basel: Hijau, Kuning, Merah</a></li>
          <li><a href="#pnlattr">P&amp;L Attribution: Hipotetis vs Aktual</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji Kupiec Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji Christoffersen — Deteksi Gerombolan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Zona Lampu Lalu Lintas — Ketika Backtest Menentukan Modalmu</a></li>
          <li><a href="#case">📋 Mini-Case: Zona Kuning yang Diabaikan</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan logika backtesting: membandingkan prediksi VaR dengan P&amp;L aktual dan menghitung &ldquo;pelanggaran&rdquo;.</li>
          <li>Membedakan P&amp;L hipotetis vs aktual dan menjelaskan kapan memakai masing-masing.</li>
          <li>Menghitung dan menafsirkan uji Kupiec POF (likelihood ratio) untuk kalibrasi frekuensi.</li>
          <li>Menghitung dan menafsirkan uji Christoffersen untuk independensi pelanggaran (deteksi clustering).</li>
          <li>Menerapkan traffic light Basel (zona hijau/kuning/merah) dan menjelaskan konsekuensi modal tiap zona.</li>
          <li>Mengidentifikasi keterbatasan backtesting — apa yang tidak bisa diuji oleh backtest.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model yang Lolos Ujian tapi Gagal di Lapangan</h2>
      <div className="story">
        <p>Sebuah bank dengan bangga melaporkan: <strong>&ldquo;Backtest VaR kami hijau selama 2 tahun — hanya 4 pelanggaran dari 500 hari, sesuai ekspektasi 5.&rdquo;</strong> Validator puas, regulator puas. Model dinyatakan &ldquo;sehat&rdquo;.</p>
        <p>Lalu krisis mini datang. Dalam <strong>10 hari berurutan</strong>, VaR terlampaui <strong>7 kali</strong> — kerugian Rp120 miliar. Bagaimana model &ldquo;sehat&rdquo; bisa gagal sebrutal itu?</p>
        <p>Twist-nya: backtest mereka hanya menghitung <strong>jumlah</strong> pelanggaran (uji Kupiec lolos), tapi tidak pernah menguji <strong>polanya</strong>. Tujuh pelanggaran itu terjadi <strong>beruntun</strong> — pelanggaran yang berkelompok justru terjadi saat model paling dibutuhkan. Uji independensi (Christoffersen) akan menangkap ini — tapi tidak ada yang menjalankannya.</p>
        <p>Lesson ini tentang mengadili model dengan benar: bukan cuma &ldquo;berapa kali salah&rdquo;, tapi juga &ldquo;apakah salahnya bergerombol&rdquo;, &ldquo;apa kata lampu lalu lintas Basel&rdquo;, dan &ldquo;apakah P&amp;L yang dipakai untuk menguji sudah benar&rdquo;.</p>
      </div>

      <h2 id="konsep">Konsep Dasar: Pelanggaran &amp; Dua Jenis P&amp;L</h2>
      <p><strong>Definisi.</strong> <strong>Backtesting</strong> membandingkan prediksi VaR kemarin dengan hasil aktual hari ini. Jika kerugian aktual &gt; VaR → <strong>pelanggaran (exception/breach)</strong>. Untuk VaR 99% selama T=250 hari, ekspektasi pelanggaran = <strong>2,5 kali</strong>.</p>
      <p><strong>Dua jenis P&amp;L untuk backtest</strong> — dan pilihan ini penting:</p>
      <ul>
        <li><strong>P&amp;L hipotetis (HPL):</strong> P&amp;L <em>jika posisi kemarin tidak berubah</em> (frozen portfolio, revaluasi dengan harga hari ini). Menguji <strong>murni model VaR</strong> — tanpa campur tangan trading intraday.</li>
        <li><strong>P&amp;L aktual (APL):</strong> P&amp;L sesungguhnya termasuk trading intraday, fee, komisi. Menguji <strong>model + aktivitas trading</strong>.</li>
      </ul>
      <p>Basel memakai keduanya. Jika HPL lolos tapi APL gagal → modelnya benar, tapi <strong>trading intraday</strong> yang bermasalah. Jika keduanya gagal → modelnya yang salah.</p>

      <PlotlyChart
        data={btData}
        title="Backtest 250 Hari: P&L Aktual vs VaR 99% (simulasi)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "P&L (Rp miliar)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = P&amp;L harian, garis merah putus-putus = −VaR 99% (Rp10 M). Tanda X merah = pelanggaran (P&amp;L di bawah −VaR).</p>
        <p><strong>Interpretasi:</strong> ada <strong>9 pelanggaran</strong> — jauh di atas ekspektasi 2,5. Lebih penting: pelanggaran <strong>bergerombol di hari 150–175</strong> (periode stres). Jumlahnya gagal uji Kupiec, polanya gagal uji Christoffersen. <strong>Model ini gagal dua kali</strong> — dan justru gagal saat paling dibutuhkan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> selalu backtest dengan <strong>HPL dulu</strong>. HPL mengisolasi kualitas model dari kebisingan aktivitas trading. Kalau langsung pakai APL dan gagal, kamu tidak tahu apakah yang rusak modelnya atau tradernya — dan keduanya butuh obat berbeda.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Backtest hijau = model benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> backtest hanya menguji <strong>kalibrasi frekuensi historis</strong> — &ldquo;apakah 1% kejadian terjadi ~1% dari waktu <em>di masa lalu</em>&rdquo;. Ia tidak menguji: apakah model benar untuk <strong>krisis yang belum terjadi</strong>, apakah ekornya tepat (butuh ES, MR5), atau apakah modelnya <strong>tepat untuk alasan yang benar</strong> (dua model salah bisa sama-sama &ldquo;lolos&rdquo;). Backtest = syarat perlu, bukan syarat cukup.</p>
      </div>

      <h2 id="kupiec">Uji Kupiec: Apakah Jumlahnya Benar?</h2>
      <p><strong>Definisi.</strong> <strong>Uji Kupiec POF</strong> (Proportion of Failures, 1995) menguji H₀: probabilitas pelanggaran = p (misal 1% untuk VaR 99%). Statistik uji adalah <strong>likelihood ratio</strong>:</p>
      <Tex math={String.raw`LR_{POF} = -2\ln\left[\frac{(1-p)^{T-x}\,p^{\,x}}{(1-\hat{p})^{T-x}\,\hat{p}^{\,x}}\right] \sim \chi^2(1)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`T`} />: jumlah hari observasi (standar: 250)</li>
        <li><Tex math={String.raw`x`} />: jumlah pelanggaran teramati</li>
        <li><Tex math={String.raw`p`} />: probabilitas pelanggaran teoritis (0,01 untuk VaR 99%)</li>
        <li><Tex math={String.raw`\hat{p} = x/T`} />: probabilitas pelanggaran teramati</li>
        <li><Tex math={String.raw`\chi^2(1)`} />: distribusi chi-square 1 derajat bebas — tolak H₀ jika LR &gt; 3,84 (α=5%)</li>
      </ul>
      <p><strong>Intuisi:</strong> pembilang = likelihood data <em>jika model benar</em> (p=1%); penyebut = likelihood data <em>dengan p terbaik menurut data</em>. Jika keduanya jauh berbeda → LR besar → model ditolak. Sederhana: <strong>apakah frekuensi pelanggaran sesuai janji model?</strong></p>

      <details className="worked">
        <summary>📐 Contoh hitung manual (klik untuk buka)</summary>
        <p>T = 250 hari, x = 7 pelanggaran, p = 0,01. Maka <Tex math={String.raw`\hat{p} = 7/250 = 0{,}028`} />.</p>
        <p><strong>Langkah 1</strong> — hitung LR: <Tex math={String.raw`LR = -2\ln[(0{,}99)^{243}(0{,}01)^7] + 2\ln[(0{,}972)^{243}(0{,}028)^7] \approx 5{,}42`} />.</p>
        <p><strong>Langkah 2</strong> — bandingkan dengan χ²(1) kritis 3,84 (5%). 5,42 &gt; 3,84 → <strong>tolak H₀</strong>.</p>
        <p><strong>Kesimpulan:</strong> 7 pelanggaran terlalu banyak untuk VaR 99% — model <em>underestimate</em> risiko (atau periode ini memang luar biasa; investigasi lanjut wajib).</p>
      </details>

      <h2 id="christ">Uji Christoffersen: Apakah Polanya Acak?</h2>
      <p><strong>Definisi.</strong> Uji Kupiec buta terhadap <strong>urutan</strong> — 7 pelanggaran tersebar acak vs 7 pelanggaran beruntun diperlakukan sama. <strong>Uji Christoffersen</strong> (1998) menguji <strong>independensi</strong>: pelanggaran hari ini tidak boleh diprediksi dari pelanggaran kemarin.</p>
      <p><strong>Cara kerja:</strong> modelkan deret pelanggaran sebagai rantai Markov 2-state (0 = tidak langgar, 1 = langgar). Hitung matriks transisi:</p>
      <Tex math={String.raw`\Pi = \begin{pmatrix} 1-\pi_{01} & \pi_{01} \\ 1-\pi_{11} & \pi_{11} \end{pmatrix}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\pi_{01} = P(\text{langgar} \mid \text{kemarin tidak langgar})`} />, <Tex math={String.raw`\pi_{11} = P(\text{langgar} \mid \text{kemarin langgar})`} />. H₀ independensi: <Tex math={String.raw`\pi_{01} = \pi_{11}`} />. Jika <Tex math={String.raw`\pi_{11} \gg \pi_{01}`} /> → pelanggaran <strong>berkelompok</strong> → tolak.</p>
      <p><strong>Kenapa ini penting:</strong> pelanggaran berkelompok berarti model gagal <strong>beradaptasi</strong> — setelah sehari jebol, ia tidak &ldquo;belajar&rdquo; (volatilitas tidak di-update, lihat MR2). Dan kegagalan beruntun = kerugian terkompounding — jauh lebih mematikan daripada pelanggaran tersebar.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cukup uji Kupiec saja.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kupiec + Christoffersen = <strong>uji gabungan (conditional coverage)</strong>. Kupiec menjawab &ldquo;apakah jumlahnya benar&rdquo;, Christoffersen menjawab &ldquo;apakah waktunya acak&rdquo;. Model bisa lolos Kupiec tapi gagal Christoffersen (kasus cerita pembuka) — dan kegagalan pola justru yang paling berbahaya karena terjadi saat krisis.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pelanggaran yang berkelompok adalah <strong>gejala model tidak adaptif</strong> — biasanya estimator volatilitas yang terlalu lambat (MR2) atau HS dengan jendela basi. Obatnya bukan &ldquo;naikkan VaR manual&rdquo;, melainkan perbaiki <em>responsivitas</em> model (EWMA/Filtered HS).</p>
      </div>

      <h2 id="traffic">Traffic Light Basel: Hijau, Kuning, Merah</h2>
      <p><strong>Definisi.</strong> Basel menerjemahkan jumlah pelanggaran 250-hari (VaR 99%) menjadi <strong>zona</strong> dengan konsekuensi modal langsung:</p>
      <ul>
        <li><strong>🟢 Hijau (0–4 pelanggaran):</strong> model OK. Multiplier modal = <strong>3,0×</strong>.</li>
        <li><strong>🟡 Kuning (5–9 pelanggaran):</strong> perlu perhatian. Multiplier naik bertahap <strong>3,4× → 3,85×</strong> (makin banyak pelanggaran, makin besar).</li>
        <li><strong>🔴 Merah (≥10 pelanggaran):</strong> model ditolak. Multiplier = <strong>4,0×</strong> + regulator bisa <strong>mencabut izin model internal</strong> (kembali ke pendekatan standar yang lebih mahal).</li>
      </ul>
      <p><strong>Kenapa zona kuning ada:</strong> 5–9 pelanggaran masih <em>mungkin</em> terjadi karena sial (probabilitasnya tidak nol untuk model benar) — jadi tidak langsung dihukum mati, tapi &ldquo;denda&rdquo; via multiplier. Ini <strong>insentif ekonomi</strong>: model yang akurat = modal lebih murah.</p>
      <p><strong>Catatan:</strong> multiplier 3–4× diterapkan ke VaR rata-rata 60-hari. Artinya modal ≈ 3–4× VaR — angka yang jauh lebih besar dari VaR itu sendiri. Inilah &ldquo;harga ketidakpastian model&rdquo;.</p>

      <h2 id="pnlattr">P&amp;L Attribution: Hipotetis vs Aktual</h2>
      <p><strong>Definisi.</strong> <strong>P&amp;L attribution (PLA)</strong> menjelaskan <em>perbedaan</em> antara P&amp;L yang diprediksi model risiko (RTPL — risk-theoretical P&amp;L, dari sensitivitas) dan P&amp;L aktual (APL):</p>
      <Tex math={String.raw`\text{APL} = \text{RTPL} + \text{Unexplained}`} block />
      <p><strong>Artinya:</strong> RTPL = P&amp;L menurut faktor risiko yang dimodelkan (<Tex math={String.raw`\sum S_i \Delta f_i`} />, MR1); unexplained = sisanya.</p>
      <p><strong>Dua uji di FRTB (MR16):</strong></p>
      <ul>
        <li><strong>Uji korelasi Spearman</strong> antara RTPL dan HPL — harus tinggi (model menangkap arah pergerakan).</li>
        <li><strong>Uji Kolmogorov-Smirnov</strong> — distribusi RTPL vs HPL tidak boleh berbeda jauh.</li>
      </ul>
      <p><strong>Interpretasi praktis:</strong> unexplained yang besar &amp; persisten = <strong>faktor risiko hilang</strong> (misal basis risk tidak dimodelkan), <strong>data salah</strong>, atau <strong>non-linearitas</strong> yang diabaikan. PLA adalah &ldquo;alarm dini&rdquo; kualitas model — sering berbunyi <em>sebelum</em> backtest gagal.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> backtest bertanya &ldquo;apakah model salah?&rdquo; (ya/tidak). PLA bertanya &ldquo;<em>di mana</em> model salah?&rdquo; (faktor apa yang hilang). Analis yang hanya menjalankan backtest seperti dokter yang hanya cek suhu — PLA adalah pemeriksaan darahnya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Uji Kupiec Sendiri</h2>
      <p>Ubah jumlah pelanggaran x dan amati kapan keputusan berubah. Berapa x minimal agar model ditolak di 5%? Apakah x=0 (tidak pernah langgar) juga mencurigakan?</p>
      <PyodideLab
        title="Lab 1 — Uji Kupiec POF (Likelihood Ratio)"
        hint="Coba x=0: LR=inf → ditolak! Pelanggaran TERLALU SEDIKIT juga menolak H0 — model terlalu konservatif (buang modal sia-sia). Uji ini dua arah."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Uji Christoffersen — Deteksi Gerombolan</h2>
      <p>Ubah pola cluster di <code className="inline">seqB</code> (misal 8 pelanggaran tersebar vs 2 cluster). Kapan π₁₁ jauh melebihi π₀₁?</p>
      <PyodideLab
        title="Lab 2 — Uji Independensi Christoffersen"
        hint="Coba cluster 8 hari BERURUTAN penuh (range(100,108)): P(1|1) akan sangat tinggi. Itulah pola 'model tidak belajar' — paling berbahaya."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Validasi rutin model VaR → <strong>Kupiec + Christoffersen (conditional coverage)</strong></h3>
        <p><strong>Kondisi:</strong> review berkala (kuartalan/tahunan) atau setelah perubahan model.</p>
        <p><strong>Alasan:</strong> Kupiec saja tidak cukup — pola pelanggaran sama pentingnya dengan jumlahnya. Selalu jalankan berpasangan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Backtest gagal (zona kuning/merah) → <strong>Diagnosis bertahap: HPL vs APL → PLA → estimator</strong></h3>
        <p><strong>Kondisi:</strong> pelanggaran melebihi ekspektasi.</p>
        <p><strong>Alasan:</strong> (1) Bandingkan HPL vs APL — jika HPL lolos, masalahnya trading intraday, bukan model. (2) Jalankan PLA — faktor apa yang hilang? (3) Cek responsivitas estimator volatilitas. Jangan langsung &ldquo;naikkan VaR manual&rdquo; — itu mengobati gejala.</p>
      </div>

      <div className="decision-card">
        <h3>3. Model untuk modal regulasi → <strong>Traffic light Basel (250 hari, VaR 99%)</strong></h3>
        <p><strong>Kondisi:</strong> pelaporan ke regulator.</p>
        <p><strong>Alasan:</strong> zona menentukan multiplier modal (3,0×–4,0×). Zona merah = risiko kehilangan izin model internal. Pantau jumlah pelanggaran <em>berjalan</em> (rolling), bukan cuma tahunan.</p>
      </div>

      <div className="decision-card">
        <h3>4. Alarm dini sebelum backtest gagal → <strong>P&amp;L Attribution harian</strong></h3>
        <p><strong>Kondisi:</strong> monitoring kualitas model sehari-hari.</p>
        <p><strong>Alasan:</strong> unexplained P&amp;L yang membesar adalah sinyal <em>leading</em> — muncul sebelum pelanggaran menumpuk. Di FRTB, PLA adalah syarat kelulusan IMA (MR16).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Uji jumlah</strong> (Kupiec) + <strong>uji pola</strong> (Christoffersen) — selalu berpasangan.</li>
          <li><strong>HPL dulu</strong> untuk mengadili model; APL untuk mengadili trading.</li>
          <li>Backtest hijau ≠ model benar — ia hanya syarat perlu. Pasangkan dengan <strong>stress test</strong> (MR7).</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Zona Lampu Lalu Lintas — Ketika Backtest Menentukan Modalmu</h2>
      <p>Backtesting bukan sekadar uji statistik akademis — hasilnya <strong>langsung menentukan</strong> berapa modal yang harus disiapkan bank. Bagian ini membedah mekanisme <strong>traffic light</strong> Basel dengan angka, kisah nyata zona merah 2008, dan batas fundamental backtesting yang harus kamu pahami.</p>

      <h3>Mekanisme zona: dari pelanggaran ke multiplier</h3>
      <p>Basel memakai 250 hari perdagangan, VaR 99% 1-hari. Ekspektasi pelanggaran: 250 × 1% = <strong>2,5</strong>. Zona ditentukan dari jumlah pelanggaran <Tex math={String.raw`x`} />:</p>
      <ul>
        <li><strong>🟢 Hijau</strong> (x ≤ 4): model OK. Multiplier <Tex math={String.raw`m_c = 3{,}0`} />.</li>
        <li><strong>🟡 Kuning</strong> (5 ≤ x ≤ 9): model patut dicurigai. Multiplier naik bertahap <strong>3,0 → 3,85</strong> (x=5 → 3,40; x=6 → 3,50; x=7 → 3,65; x=8 → 3,75; x=9 → 3,85).</li>
        <li><strong>🔴 Merah</strong> (x ≥ 10): model ditolak. Multiplier <strong>4,0</strong> + kewajiban investigasi dan perbaikan model.</li>
      </ul>
      <p>Multiplier mengalikan VaR rata-rata 60-hari menjadi kebutuhan modal. Jadi <strong>setiap pelanggaran ekstra menaikkan modal secara mekanis</strong> — inilah insentif regulasi agar bank menjaga modelnya jujur.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: dari 7 pelanggaran ke kebutuhan modal (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Bank mencatat <strong>7 pelanggaran</strong> dalam 250 hari. VaR 99% rata-rata 60-hari = Rp200 miliar.</p>
        <p><strong>Langkah 1 — tentukan zona:</strong> x = 7 → <strong>zona kuning</strong>, multiplier = <strong>3,65</strong>.</p>
        <p><strong>Langkah 2 — hitung modal:</strong> 3,65 × Rp200 M = <strong>Rp730 miliar</strong>.</p>
        <p><strong>Langkah 3 — bandingkan skenario:</strong> jika hanya 4 pelanggaran (hijau): 3,0 × 200 = Rp600 M. Tiga pelanggaran ekstra &ldquo;berharga&rdquo; <strong>Rp130 miliar</strong> modal tambahan — yang harus disediakan dari ekuitas termahal bank.</p>
        <p><strong>Langkah 4 — zona merah:</strong> jika 10 pelanggaran: 4,0 × 200 = Rp800 M, <strong>plus</strong> regulator mempertanyakan kelayakan model internal — bank terancam dipaksa kembali ke Standardised Approach yang modalnya bisa <strong>jauh lebih besar</strong>.</p>
        <p><strong>Angka ini artinya:</strong> backtesting bukan ujian lulus/gagal yang abstrak — ia adalah <strong>tuas modal</strong>. Setiap pelanggaran yang tercatat di sistem backtest <em>langsung</em> diterjemahkan menjadi rupiah modal. Inilah mengapa data P&amp;L untuk backtest harus <strong>bersih</strong> (lihat jebakan P&amp;L di bawah).</p>
      </details>

      <h3>Kisah nyata: zona merah massal 2008</h3>
      <p>Pada 2008, <strong>banyak bank global serentak masuk zona kuning dan merah</strong> — bukan karena model mereka tiba-tiba bodoh, melainkan karena asumsi dasarnya runtuh: volatilitas 10× lipat, korelasi menuju 1, likuiditas hilang. Regulator menghadapi dilema: menghukum semua bank dengan multiplier 4,0 di tengah krisis berarti <strong>memaksa mereka melepas aset</strong> (untuk memenuhi modal) — yang justru memperdalam krisis (procyclicality).</p>
      <p>Responsnya pragmatis: beberapa yurisdiksi memberi <strong>keringanan sementara</strong>, tetapi pelajaran strukturalnya diabadikan dalam Basel 2.5/III: <strong>Stressed VaR</strong> (MR4) memastikan modal sudah tinggi <em>sebelum</em> krisis, sehingga multiplier backtest tidak perlu menjadi algojo saat krisis. Filosofinya: <em>hukum model yang buruk di masa tenang; jangan menghukum semua orang di masa panik</em>.</p>
      <p><strong>Pola yang sama di Maret 2020:</strong> COVID crash menghasilkan pelanggaran beruntun di banyak bank dalam hitungan hari (pelanggaran yang <em>berkelompok</em> — inilah mengapa uji independensi Christoffersen penting). Regulator (termasuk OJK mengikuti Basel) lagi-lagi memberi fleksibilitas penilaian. Pelajarannya konsisten: <strong>backtest menguji kalibrasi model terhadap sejarah, bukan ketahanan terhadap masa depan yang belum pernah terjadi</strong>.</p>

      <h3>Jebakan data: P&amp;L kotor vs bersih</h3>
      <p>Pelanggaran dihitung dari <strong>actual P&amp;L vs VaR</strong>. Tapi P&amp;L aktual mengandung komponen <strong>bukan risiko pasar</strong>: fee, komisi, intraday trading, dan perubahan valuasi intraday. Bank yang aktif trading intraday bisa mencatat &ldquo;pelanggaran&rdquo; yang sebenarnya berasal dari <em>keputusan trading baru</em>, bukan kegagalan model VaR posisi kemarin.</p>
      <p>Solusi standar: <strong>hypothetical P&amp;L</strong> — P&amp;L yang <em>akan</em> terjadi jika posisi tidak diubah sepanjang hari (frozen portfolio). Basel mewajibkan backtest terhadap <em>keduanya</em> (actual dan hypothetical). Jika hypothetical lolos tapi actual gagal → masalahnya <strong>aktivitas trading</strong>, bukan model. Jika keduanya gagal → masalahnya <strong>model</strong>. Membedakan keduanya menghemat investigasi berminggu-minggu.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Backtest hijau = model benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> backtest hijau hanya berarti <em>frekuensi pelanggaran sesuai janji dalam 250 hari terakhir</em>. Ia tidak menguji: (1) apakah ES benar (ekor bisa jauh lebih dalam — MR5); (2) apakah pelanggaran <em>berkelompok</em> (butuh uji Christoffersen); (3) apakah model tahan terhadap krisis yang belum ada di data (butuh stress test — MR7); (4) apakah P&amp;L yang dipakai bersih. <strong>Backtest adalah syarat perlu, bukan syarat cukup</strong> — seperti rem yang berfungsi tidak menjamin mobil aman dikemudikan ugal-ugalan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci untuk analis:</strong> saat menerima laporan &ldquo;backtest hijau&rdquo;, tanyakan empat hal: <strong>(1)</strong> berapa tepatnya x — 0 atau 4? (0 pelanggaran dari 250 hari justru <em>mencurigakan</em>: model mungkin terlalu konservatif = modal terbuang); <strong>(2)</strong> apakah pelanggarannya tersebar acak atau bergerombol? <strong>(3)</strong> P&amp;L apa yang dipakai — actual atau hypothetical? <strong>(4)</strong> kapan terakhir model diuji terhadap skenario stres? Empat pertanyaan ini membedakan analis yang membaca angka dari analis yang membaca <em>risiko</em>.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: membaca p-value — &ldquo;gagal tolak&rdquo; bukan &ldquo;terbukti benar&rdquo; (klik untuk buka)</summary>
        <p><strong>Kasus:</strong> T=250, x=3, VaR 99%. LR Kupiec ≈ 0,08 → p-value ≈ 0,78. <strong>Kesimpulan benar:</strong> &ldquo;gagal menolak H₀ pada 5%&rdquo; — <strong>bukan</strong> &ldquo;model terbukti benar&rdquo;.</p>
        <p><strong>Mengapa bedanya penting:</strong> dengan 250 hari, uji Kupiec punya <strong>power rendah</strong> — ia hanya bisa mendeteksi model yang <em>sangat</em> salah. Model yang underestimate risiko 2× (p aktual 2% vs 1%) punya peluang <strong>~50%</strong> untuk tetap &ldquo;lolos&rdquo;! Backtest hijau = &ldquo;tidak cukup bukti untuk menghukum&rdquo;, <strong>bukan</strong> &ldquo;terbukti tidak bersalah&rdquo;.</p>
        <p><strong>Implikasi praktis:</strong> (1) jangan pakai backtest sebagai <em>satu-satunya</em> validasi (butuh stress + konseptual — MR18); (2) perhatikan <strong>arah</strong> pelanggaran: 0 pelanggaran dari 250 hari (p-value ≈ 0,08 <em>di sisi konservatif</em>) justru mencurigakan — model mungkin <strong>terlalu konservatif</strong> = modal terbuang; (3) regulator tahu keterbatasan ini — itulah mengapa ada <strong>multiplier minimum 3,0</strong> bahkan untuk zona hijau: <em>ketidakpastian model dihargai eksplisit</em>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — T=250, x=4 pelanggaran, VaR 99%. (a) Zona apa? Multiplier? (b) Hitung kira-kira LR Kupiec — tolak H₀ di 5%? (klik untuk pembahasan)</summary>
        <p><strong>(a)</strong> x=4 → <strong>zona hijau</strong>, multiplier <strong>3,0</strong> — batas atas hijau (x=5 sudah kuning).</p>
        <p><strong>(b)</strong> <Tex math={String.raw`\hat{p} = 4/250 = 0{,}016`} />. <Tex math={String.raw`LR = -2\ln[(0{,}99)^{246}(0{,}01)^4] + 2\ln[(0{,}984)^{246}(0{,}016)^4] \approx 0{,}76`} /> &lt; 3,84 → <strong>gagal tolak H₀</strong>. Konsisten: hijau = model diterima. Perhatikan 4 pelanggaran &gt; ekspektasi 2,5 tapi masih &ldquo;dalam toleransi statistik&rdquo; — zona hijau bukan berarti sempurna.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Dua bank, masing-masing 6 pelanggaran dari 250 hari. Bank A: pelanggaran tersebar acak. Bank B: 6 pelanggaran dalam 2 minggu (Maret 2020). Mana yang lebih bermasalah menurut kerangka lengkap? Mengapa? (klik untuk pembahasan)</summary>
        <p><strong>Bank B lebih bermasalah.</strong> Uji Kupiec (frekuensi) memberi hasil <em>sama</em> untuk keduanya — inilah keterbatasannya. Uji <strong>Christoffersen</strong> (independensi) akan menolak Bank B: pelanggaran bergerombol = model gagal menangkap <strong>volatility clustering</strong> (MR2). Secara ekonomi: Bank B mengalami <em>kegagalan model saat stres</em> — tepat saat model paling dibutuhkan. Pelajaran: <strong>selalu uji independensi, bukan cuma frekuensi</strong>.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Backtest hypothetical P&amp;L lolos (2 pelanggaran) tapi actual P&amp;L gagal (9 pelanggaran). Apa diagnosisnya? Langkah apa selanjutnya? (klik untuk pembahasan)</summary>
        <p><strong>Diagnosis:</strong> model VaR-nya <em>benar</em> — yang salah adalah <strong>aktivitas trading intraday</strong> (posisi berubah sepanjang hari; actual P&amp;L mencakup trading baru yang tidak ada saat VaR dihitung).</p>
        <p><strong>Langkah:</strong> (1) jangan utak-atik model — ia tidak bersalah; (2) investigasi desk: apakah intraday trading melanggar mandat? apakah limit intraday ada? (3) pertimbangkan <strong>limit intraday</strong> terpisah (MR17). Kasus ini menunjukkan mengapa Basel mewajibkan backtest <em>keduanya</em> — tanpanya, model yang benar bisa dihukum karena kesalahan operasional.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Zona Kuning yang Diabaikan</h2>
      <div className="callout">
        <p>Bank DEF melaporkan backtest tahunan: <strong>7 pelanggaran</strong> dari 250 hari (VaR 99%) — <strong>zona kuning</strong>, multiplier 3,65×. Manajemen: &ldquo;Masih kuning, belum merah. Lanjut.&rdquo; Tidak ada investigasi.</p>
        <ul>
          <li>5 dari 7 pelanggaran terjadi dalam <strong>2 minggu berurutan</strong> (cluster)</li>
          <li>PLA menunjukkan unexplained P&amp;L membesar 3 bulan terakhir (faktor credit spread tidak dimodelkan)</li>
          <li>Tahun berikutnya: 12 pelanggaran → <strong>zona merah</strong>, izin model internal dicabut → modal naik Rp1,2 triliun</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa yang seharusnya dilakukan saat zona kuning? (b) Bagaimana Christoffersen &amp; PLA bisa mencegah zona merah? (c) Hitung &ldquo;biaya mengabaikan&rdquo;: bandingkan denda multiplier vs biaya investigasi.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Zona kuning = peringatan, bukan vonis bebas.</strong> Prosedur yang benar: investigasi tiap pelanggaran (apakah HPL/APL?), uji Christoffersen, review PLA. Kuning adalah <em>kesempatan murah</em> untuk memperbaiki sebelum merah.</p>
          <p>(b) <strong>Christoffersen</strong> akan menangkap clustering 5-dalam-2-minggu → sinyal model tidak adaptif → perbaiki estimator (EWMA/Filtered HS). <strong>PLA</strong> sudah berbunyi 3 bulan sebelumnya (spread tak dimodelkan) → tambah faktor risiko. Keduanya adalah <strong>leading indicator</strong>; zona merah adalah <em>lagging</em>.</p>
          <p>(c) <strong>Biaya mengabaikan:</strong> kenaikan modal Rp1,2 T (dan modal itu &ldquo;mati&rdquo; — tidak bisa dipakai bisnis) vs biaya investigasi (beberapa analis × beberapa minggu ≈ ratusan juta). Rasio ~1000:1. <strong>Validasi model adalah investasi termurah di bank.</strong></p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. VaR 99%, 250 hari, 7 pelanggaran. Uji Kupiec (5%)?"
        options={[
          "Lolos — 7 masih wajar",
          "Tolak H0 — LR ≈ 5,42 > 3,84, model underestimate risiko",
          "Tidak bisa diuji",
          "Perlu 500 hari dulu",
        ]}
        correct={1}
        explanation="Benar. Ekspektasi = 2,5; 7 pelanggaran memberi LR ≈ 5,42 melebihi kritis 3,84. Model ditolak — frekuensi pelanggaran tidak sesuai janji 1%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Backtest HPL lolos tapi APL gagal. Diagnosis?"
        options={[
          "Model VaR salah total",
          "Model benar, tapi aktivitas trading intraday (atau fee/komisi) menyebabkan penyimpangan — investigasi desk, bukan model",
          "Data harga salah",
          "VaR harus dinaikkan 2x",
        ]}
        correct={1}
        explanation="Benar. HPL mengisolasi model (posisi frozen); APL mencakup trading. HPL lolos + APL gagal = model OK, eksekusi/aktivitas yang bermasalah. Obatnya beda!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 8 pelanggaran terjadi dalam 2 cluster berurutan. Uji Kupiec lolos (8 < ambang tolak). Apa yang terlewat?"
        options={[
          "Tidak ada — lolos berarti aman",
          "Uji independensi (Christoffersen): pelanggaran berkelompok = model tidak adaptif, gagal saat krisis — justru pola paling berbahaya",
          "Perlu uji normalitas",
          "VaR harus diganti ES",
        ]}
        correct={1}
        explanation="Benar. Kupiec buta urutan. Cluster = P(langgar|kemarin langgar) tinggi = model tidak 'belajar' dari kegagalan. Inilah yang membunuh di krisis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Zona kuning Basel (7 pelanggaran) berarti?"
        options={[
          "Model dilarang",
          "Multiplier modal naik (3,65x) sebagai 'denda' — peringatan untuk investigasi, belum pencabutan izin",
          "Tidak ada konsekuensi",
          "VaR harus dihitung ulang setiap jam",
        ]}
        correct={1}
        explanation="Benar. Kuning = denda ekonomi via multiplier, bukan hukuman mati. Tujuannya memberi insentif: model akurat = modal murah. Abaikan kuning → risiko merah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. PLA menunjukkan unexplained P&L besar dan persisten selama 3 bulan, tapi backtest masih hijau. Tindakan?"
        options={[
          "Abaikan — backtest hijau berarti aman",
          "Investigasi SEGERA: ada faktor risiko yang tidak dimodelkan / data salah / non-linearitas — PLA adalah alarm dini sebelum backtest gagal",
          "Kurangi VaR",
          "Ganti model besok",
        ]}
        correct={1}
        explanation="Benar. PLA = leading indicator, backtest = lagging. Unexplained persisten berarti model sistematis buta terhadap sesuatu — menunggu backtest gagal = menunggu kerugian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Keterbatasan FUNDAMENTAL backtesting?"
        options={[
          "Terlalu mahal",
          "Hanya menguji kalibrasi frekuensi historis — tidak bisa menguji ketahanan terhadap krisis yang belum terjadi (butuh stress test) dan tidak menguji ketepatan ekor (butuh ES)",
          "Tidak bisa dihitung untuk VaR 99%",
          "Hanya berlaku untuk saham",
        ]}
        correct={1}
        explanation="Benar. Backtest = 'apakah model benar TENTANG MASA LALU'. Untuk masa depan yang unprecedented butuh stress test (MR7); untuk kedalaman ekor butuh ES (MR5). Tiga pilar saling melengkapi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Backtest</strong> = bandingkan VaR vs P&amp;L aktual; hitung pelanggaran (ekspektasi 2,5/250 hari untuk VaR 99%).</li>
          <li><strong>HPL</strong> (posisi frozen) mengadili model; <strong>APL</strong> mengadili model + trading.</li>
          <li><strong>Kupiec POF:</strong> <Tex math={String.raw`LR \sim \chi^2(1)`} /> — uji jumlah pelanggaran (tolak jika &gt; 3,84).</li>
          <li><strong>Christoffersen:</strong> uji independensi — pelanggaran berkelompok = model tidak adaptif.</li>
          <li><strong>Traffic light:</strong> hijau (0–4, 3,0×), kuning (5–9, 3,4–3,85×), merah (≥10, 4,0× + risiko cabut izin).</li>
          <li><strong>PLA:</strong> APL = RTPL + unexplained — alarm dini kualitas model (Spearman + KS di FRTB).</li>
          <li>Backtest hijau = <strong>syarat perlu, bukan cukup</strong> — pasangkan dengan stress test &amp; ES.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr5-expected-shortfall" className="btn btn-secondary btn-sm">← MR5</Link>
        <Link href="/learn/mr7-stress-test" className="btn btn-primary btn-sm">Next: MR7 →</Link>
      </div>
    </div>
  );
}
