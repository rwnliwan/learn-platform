"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A213Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: Simpson's paradox — agregat vs per segmen (efektivitas dua kampanye)
  const simpsonData = [
    {
      x: ["Kampanye A<br>(agregat)", "Kampanye B<br>(agregat)"],
      y: [62, 55],
      type: "bar",
      name: "Agregat",
      marker: { color: ["#2a7de1", "#e8a838"] },
      text: ["62%", "55%"],
      textposition: "outside",
    },
  ];
  const simpsonSegData = [
    {
      x: ["Segmen muda", "Segmen tua"],
      y: [80, 30],
      name: "Kampanye A",
      type: "bar",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["Segmen muda", "Segmen tua"],
      y: [85, 40],
      name: "Kampanye B",
      type: "bar",
      marker: { color: "#e8a838" },
    },
  ];

  // Chart 2: DiD — dua garis tren paralel lalu divergen setelah intervensi
  const didData = [
    {
      x: ["2023-Q1", "2023-Q2", "2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2"],
      y: [100, 102, 104, 106, 108, 110],
      type: "scatter",
      mode: "lines+markers",
      name: "Kota kontrol (tanpa program)",
      line: { color: "#94a3b8" },
    },
    {
      x: ["2023-Q1", "2023-Q2", "2023-Q3", "2023-Q4", "2024-Q1", "2024-Q2"],
      y: [100, 102, 104, 106, 116, 122],
      type: "scatter",
      mode: "lines+markers",
      name: "Kota perlakuan (program sejak 2024-Q1)",
      line: { color: "#2a7de1" },
    },
  ];

  // Chart 3: DAG konseptual — digambar sebagai anotasi teks via bar (alternatif: deskripsi)
  // Kita pakai scatter kosong dengan anotasi panah sederhana via shapes
  const dagData = [
    {
      x: [1, 2, 3],
      y: [2, 1, 2],
      type: "scatter",
      mode: "markers+text",
      text: ["Usia<br>(confounder)", "Ikut program", "Default"],
      textposition: "top center",
      marker: { size: 28, color: ["#e8a838", "#2a7de1", "#16a34a"] },
      showlegend: false,
    },
  ];

  const lab1Code = `import random

random.seed(130)
# Simpson's paradox: kampanye A "menang" agregat tapi KALAH di tiap segmen.
# Penyebab: komposisi segmen beda (A banyak di segmen yang memang sulit).

# Segmen muda: A 80% (800/1000), B 85% (170/200)
# Segmen tua:  A 30% (60/200),   B 40% (320/800)
def pct(x, n): return x/n

muda_A, muda_B = 800/1000, 170/200
tua_A, tua_B   = 60/200, 320/800
agr_A = (800+60)/(1000+200)
agr_B = (170+320)/(200+800)

print("Per segmen:")
print(f"  Muda: A={muda_A:.0%} vs B={muda_B:.0%} -> B menang")
print(f"  Tua : A={tua_A:.0%} vs B={tua_B:.0%}  -> B menang")
print(f"Agregat: A={agr_A:.0%} vs B={agr_B:.0%} -> A 'menang'?!")
print()
print("Penjelasan: A menghabiskan 83% budget di segmen TUA yang sulit")
print("(konversi rendah untuk SIAPA PUN). Agregat menghukum A atas")
print("komposisi, bukan atas kualitas.")
print()
print("Coba: samakan komposisi (A: 500 muda + 500 tua). Paradox hilang.")`;

  const lab2Code = `import random, statistics as st

random.seed(131)
# Difference-in-Differences: program pelatihan di Kota P (2024-Q1),
# Kota K sebagai kontrol. Efek sebenarnya: +8 poin.

# Tren dasar: keduanya naik 2/kuartal (efek waktu). Program: +8 di P.
def series(base, trend, shock_q=4, shock=0, noise=1.5, qs=6):
    return [base + trend*q + (shock if q >= shock_q else 0) + random.gauss(0, noise)
            for q in range(qs)]

P = series(100, 2, shock=8)   # perlakuan
K = series(100, 2)            # kontrol

# DiD = (P_sesudah - P_sebelum) - (K_sesudah - K_sebelum)
did = (st.mean(P[4:]) - st.mean(P[:4])) - (st.mean(K[4:]) - st.mean(K[:4]))
naif = st.mean(P[4:]) - st.mean(P[:4])  # pre-post tanpa kontrol

print(f"Pre-post naif (hanya kota P): +{naif:.1f} poin")
print(f"DiD (dengan kontrol):         +{did:.1f} poin")
print(f"Efek sebenarnya:              +8.0 poin")
print()
print("Naif melebih-lebihkan (+12) karena ikut menghitung tren waktu")
print("(+2/kuartal x 2 kuartal) yang terjadi JUGA tanpa program.")
print("DiD mengurangkan tren itu via kota kontrol.")
print()
print("Coba: ubah tren K jadi 3 (tren tidak paralel!). DiD ikut bias —")
print("asumsi 'parallel trends' adalah nyawa metode ini.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.13 — Statistika Inferensial</span>
        <h1 className="display-title">Korelasi Bukan Sebab-Akibat:<br />Berpikir Kausal</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> <strong>A/B testing</strong> adalah standar emas kausalitas: <strong>randomisasi</strong> membuat satu-satunya perbedaan sistematis antara grup adalah perlakuannya — sehingga perbedaan hasil <em>pasti</em> disebabkan perlakuan. Tapi dunia nyata sering melarang randomisasi (etika, biaya, waktu). Lesson ini menjawab: <strong>bagaimana menarik kesimpulan sebab-akibat dari data observasional</strong> — keterampilan pembeda di interview data science senior dan analis risiko.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Es Krim dan Tenggelam</a></li>
          <li><a href="#korelasi">Korelasi vs Kausasi — Tiga Penjelasan Alternatif</a></li>
          <li><a href="#confounder">Confounder — Variabel Ketiga yang Mengatur</a></li>
          <li><a href="#simpson">Simpson&rsquo;s Paradox — Agregat Berbohong</a></li>
          <li><a href="#rct">RCT vs Observasional — Tangga Bukti</a></li>
          <li><a href="#did">Difference-in-Differences — Kontrol Waktu</a></li>
          <li><a href="#metode-lain">Senjata Lain: IV, RDD, Matching</a></li>
          <li><a href="#lab1">🔬 Lab 1: Membangun Simpson&rsquo;s Paradox</a></li>
          <li><a href="#lab2">🔬 Lab 2: Difference-in-Differences dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Klaim Kausal</a></li>
          <li><a href="#case">📋 Mini-Case: Apakah Program Pelatihan Menurunkan Default?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>korelasi</strong> dan <strong>kausasi</strong> serta menyebutkan 3 penjelasan alternatif korelasi.</li>
          <li>Mengidentifikasi <strong>confounder</strong> dan menggambar <strong>DAG</strong> sederhana untuk suatu klaim.</li>
          <li>Menjelaskan <strong>Simpson&rsquo;s paradox</strong> dan cara mendeteksinya (cek per segmen).</li>
          <li>Melakukan <strong>difference-in-differences</strong> langkah-demi-langkah dan menyatakan asumsi <em>parallel trends</em>.</li>
          <li>Menyebutkan <strong>IV, RDD, matching</strong> dan kondisi kapan masing-masing dipakai.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Es Krim dan Tenggelam</h2>
      <div className="story">
        <p>Data menunjukkan korelasi kuat: <strong>penjualan es krim naik → kasus tenggelam naik</strong> (r = 0,9). Seorang politisi mengusulkan pelarangan es krim di pantai untuk &ldquo;menyelamatkan nyawa&rdquo;. Terdengar logis dari angkanya.</p>
        <p>Tentu saja itu absurd. Variabel ketiganya: <strong>musim panas</strong> — panas membuat orang beli es krim <em>dan</em> berenang. Es krim tidak menyebabkan tenggelam; keduanya disebabkan panas. Larangan es krim tidak menyelamatkan satu pun perenang.</p>
        <p><strong>Twist-nya:</strong> contoh ini lucu karena jawabannya jelas. Tapi bentuk yang sama — <strong>X berkorelasi dengan Y, padahal Z menyebabkan keduanya</strong> — bersembunyi di keputusan bisnis bernilai miliaran: &ldquo;nasabah yang ikut webinar lebih jarang default → perbanyak webinar&rdquo; (padahal yang ikut webinar memang nasabah yang lebih melek finansial). Bedanya dengan es krim: di bisnis, Z-nya tidak selalu &ldquo;musim panas&rdquo; yang jelas terlihat. Lesson ini melatih mata untuk melihat Z yang tak terlihat.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="korelasi">Korelasi vs Kausasi — Tiga Penjelasan Alternatif</h2>
      <p><strong>Definisi.</strong> <strong>Kausasi</strong> (X menyebabkan Y) berarti <strong>mengintervensi X mengubah Y</strong> — bukan sekadar &ldquo;X dan Y bergerak bersama&rdquo;. Setiap korelasi X–Y punya <strong>empat</strong> penjelasan kandidat:</p>
      <ol>
        <li><strong>X → Y</strong> (kausasi langsung): es krim → tenggelam? (Salah di contoh.)</li>
        <li><strong>Y → X</strong> (kausalitas terbalik): apakah yang tenggelam <em>menyebabkan</em> orang beli es krim? Contoh nyata: &ldquo;kota dengan banyak polisi punya kriminalitas tinggi&rdquo; — bukan polisi menyebabkan kriminalitas, tapi kriminalitas menyebabkan penempatan polisi.</li>
        <li><strong>Z → X dan Z → Y</strong> (confounder): musim panas → keduanya. Contoh bisnis: webinar &amp; default, keduanya ← literasi finansial.</li>
        <li><strong>Kebetulan</strong>: korelasi spurious — &ldquo;konsumsi keju vs kematian terlilit sprei&rdquo; (r = 0,95, keduanya naik seiring waktu).</li>
      </ol>
      <p><strong>Kepribadian perbedaan ini:</strong> korelasi adalah <em>pengamat</em> yang mencatat &ldquo;mereka selalu bersama&rdquo;; kausasi adalah <em>eksperimentalis</em> yang bertanya &ldquo;kalau yang satu kuubah, yang lain ikut?&rdquo;. Pengamat tidak bisa menjawab pertanyaan eksperimentalis — tidak peduli seberapa banyak data observasionalnya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji kausasi dengan <strong>pertanyaan intervensi</strong>: &ldquo;jika saya <em>paksa</em> X berubah (dan tidak ada yang lain berubah), apakah Y ikut?&rdquo; Larang es krim → tenggelam tetap (bukan kausal). Tambah polisi karena lotre penempatan → kriminalitas turun (kausal). Jika pertanyaan intervensinya tidak masuk akal (&ldquo;paksa orang ikut webinar&rdquo;?), klaim kausalnya pun goyah.</p>
      </div>

      <h2 id="confounder">Confounder — Variabel Ketiga yang Mengatur</h2>
      <p><strong>Definisi.</strong> <strong>Confounder</strong> (perancu) adalah variabel Z yang <strong>memengaruhi baik X maupun Y</strong> — menciptakan korelasi X–Y yang palsu (atau menyembunyikan yang asli).</p>
      <p><strong>DAG (Directed Acyclic Graph)</strong> — gambar panah sebab-akibatnya:</p>
      <PlotlyChart
        data={dagData}
        title="DAG: Usia Memengaruhi Keikutsertaan Program DAN Default"
        layout={{ xaxis: { range: [0, 4], showticklabels: false, zeroline: false }, yaxis: { range: [0, 3], showticklabels: false, zeroline: false }, showlegend: false, annotations: [
          { x: 1.5, y: 1.7, text: "", showarrow: true, arrowhead: 2, ax: 0, ay: 0, xref: "x", yref: "y", axref: "x", ayref: "y" },
        ], shapes: [
          { type: "line", x0: 1.15, y0: 1.85, x1: 1.8, y1: 1.2, line: { color: "#64748b", width: 2 } },
          { type: "line", x0: 2.85, y0: 1.85, x1: 2.2, y1: 1.2, line: { color: "#64748b", width: 2 } },
          { type: "line", x0: 2, y0: 0.85, x1: 3, y1: 1.7, line: { color: "#2a7de1", width: 3 } },
        ] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga simpul — Usia (kuning), Ikut program (biru), Default (hijau). Panah abu-abu = usia memengaruhi keduanya; panah biru tebal = efek program yang ingin diukur.</p>
        <p><strong>Interpretasi:</strong> tanpa mengontrol usia, perbandingan &ldquo;ikut vs tidak ikut&rdquo; tercemar: peserta program lebih muda (usia → ikut), dan yang muda memang lebih jarang default (usia → default). <strong>Solusi konseptual:</strong> bandingkan <em>dalam</em> kelompok usia yang sama (stratifikasi) — &ldquo;tutup&rdquo; jalur Z. Inilah ide di balik semua metode penyesuaian: regresi, matching, stratifikasi.</p>
      </div>
      <p><strong>Tiga respons terhadap confounder:</strong> (1) <strong>ukur &amp; kendalikan</strong> (stratifikasi/regresi/matching) — butuh Z teramati; (2) <strong>randomisasi</strong> — memutus panah Z→X secara desain (inilah keajaiban RCT: confounder <em>teramati maupun tak teramati</em> jadi seimbang!); (3) <strong>desain kuasi-eksperimen</strong> (DiD, IV, RDD) — saat randomisasi mustahil.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kontrol semua variabel dalam regresi = kausal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> mengontrol <em>sembarang</em> variabel bisa <strong>menambah</strong> bias, bukan menguranginya! Contoh: mengontrol <strong>mediator</strong> (variabel di <em>jalur</em> X→Y, misal &ldquo;X→keterampilan→Y&rdquo;, kontrol keterampilan) menghapus efek yang ingin diukur. Mengontrol <strong>collider</strong> (variabel yang <em>dipengaruhi</em> X dan Y) bahkan <em>menciptakan</em> korelasi palsu. <strong>DAG dulu, baru putuskan apa yang dikontrol</strong> — bukan sebaliknya.</p>
      </div>

      <h2 id="simpson">Simpson&rsquo;s Paradox — Agregat Berbohong</h2>
      <p><strong>Definisi.</strong> <strong>Paradoks Simpson</strong>: tren di level <strong>agregat</strong> <em>berbalik</em> saat data dipecah per <strong>segmen</strong>. Kampanye A &ldquo;menang&rdquo; 62% vs 55% secara agregat — tapi <strong>kalah di tiap segmen</strong>.</p>

      <PlotlyChart
        data={simpsonData}
        title="Agregat: Kampanye A 'Menang' (62% vs 55%)"
        layout={{ yaxis: { title: "Konversi (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = konversi agregat tiap kampanye.</p>
        <p><strong>Interpretasi:</strong> A unggul 7 poin. Jika berhenti di sini, budget dialihkan ke A. <strong>Jangan berhenti di sini.</strong></p>
      </div>

      <PlotlyChart
        data={simpsonSegData}
        title="Per Segmen: Kampanye B Menang di Keduanya!"
        layout={{ barmode: "group", xaxis: { title: "Segmen" }, yaxis: { title: "Konversi (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap segmen, bandingkan biru (A) vs kuning (B).</p>
        <p><strong>Interpretasi:</strong> B menang di segmen muda (85% vs 80%) DAN segmen tua (40% vs 30%). <strong>Mekanisme paradox:</strong> A menghabiskan 83% budget di segmen tua yang <em>sulit untuk siapa pun</em> (konversi rendah), sementara B fokus di segmen muda yang mudah. Agregat menghukum A atas <strong>komposisi</strong>, bukan kualitas. <strong>Keputusan benar: B lebih baik</strong> — dan A perlu diaudit alokasi segmennya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Simpson&rsquo;s paradox adalah confounder yang terlihat: <strong>segmen</strong> memengaruhi <em>alokasi kampanye</em> (X) dan <em>konversi</em> (Y). Pertahanan: <strong>selalu cek hasil per segmen besar</strong> sebelum merayakan kemenangan agregat — terutama jika komposisi segmen bisa berbeda antar grup (praktis selalu!).</p>
      </div>

      <h2 id="rct">RCT vs Observasional — Tangga Bukti</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Metode</th><th>Kekuatan kausal</th><th>Syarat</th></tr></thead>
          <tbody>
            <tr><td><strong>RCT / A/B test</strong></td><td>🥇 Emas — confounder (teramati &amp; tak teramati) seimbang</td><td>Bisa randomisasi; etis; cukup n</td></tr>
            <tr><td><strong>Kuasi-eksperimen</strong> (DiD, RDD, IV)</td><td>🥈 Perak — kausal <em>dengan asumsi</em> yang bisa diperdebatkan</td><td>Variasi &ldquo;seperti acak&rdquo; dari dunia</td></tr>
            <tr><td><strong>Observasional + kontrol</strong></td><td>🥉 Perunggu — hanya sebaik Z yang terukur</td><td>Semua confounder penting teramati (asumsi kuat!)</td></tr>
            <tr><td><strong>Korelasi mentah</strong></td><td>🏅 Partisipasi — bukan bukti kausal</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Mengapa RCT emas:</strong> randomisasi memutus <em>semua</em> panah Z→X — termasuk Z yang <strong>tidak kamu ketahui keberadaannya</strong>. Tidak ada metode observasional yang bisa melakukan ini; mereka semua berasumsi &ldquo;tidak ada confounder tak teramati yang penting&rdquo; — asumsi yang <strong>tidak bisa diuji dari data itu sendiri</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Dengan big data + ML, kita tidak butuh eksperimen.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> masalah kausalitas bukan masalah <em>jumlah</em> data, melainkan <em>jenis</em> variasi. Satu miliar observasi tanpa variasi acak tetap tidak bisa membedakan &ldquo;X→Y&rdquo; dari &ldquo;Z→keduanya&rdquo; — ML yang canggih hanya memprediksi <em>lebih akurat</em>, bukan <em>lebih kausal</em>. Prediksi butuh korelasi; keputusan butuh kausasi.</p>
      </div>

      <h2 id="did">Difference-in-Differences — Kontrol Waktu</h2>
      <p><strong>Definisi.</strong> <strong>DiD</strong> mengestimasi efek perlakuan dengan <strong>dua selisih</strong>: (sesudah−sebelum di grup perlakuan) <strong>minus</strong> (sesudah−sebelum di grup kontrol):</p>
      <Tex math={String.raw`\hat{\delta}_{DiD} = (\bar{Y}_{P,sesudah} - \bar{Y}_{P,sebelum}) - (\bar{Y}_{K,sesudah} - \bar{Y}_{K,sebelum})`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`P`} /> = grup perlakuan, <Tex math={String.raw`K`} /> = kontrol. Selisih pertama = perubahan di grup perlakuan (efek + tren waktu); selisih kedua = perubahan di kontrol (<em>hanya</em> tren waktu). Pengurangannya mengisolasi <strong>efek</strong>.</p>
      <p><strong>Kepribadian DiD:</strong> si akuntan waktu — &ldquo;saya tidak tahu apa yang terjadi di dunia, tapi apapun itu, ia terjadi di <em>kedua</em> kota — jadi saya kurangkan.&rdquo;</p>
      <p><strong>Asumsi nyawa: parallel trends.</strong> Tanpa program, kedua grup akan bergerak <strong>paralel</strong> (trennya sama). Tidak bisa dibuktikan — tapi bisa <strong>diperiksa</strong>: plot tren pra-perlakuan; jika sudah tidak paralel <em>sebelum</em> program, DiD tidak valid.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: DiD program pelatihan</summary>
        <p>Skor literasi: Kota P (program): sebelum 100 → sesudah 116. Kota K (kontrol): sebelum 100 → sesudah 108.</p>
        <p><strong>Langkah 1</strong> — selisih P: 116 − 100 = +16.<br />
        <strong>Langkah 2</strong> — selisih K: 108 − 100 = +8 (tren waktu!).<br />
        <strong>Langkah 3</strong> — DiD: 16 − 8 = <strong>+8</strong>.</p>
        <p>Analisis naif (pre-post saja) mengklaim +16 — <strong>melebih-lebihkan 2×</strong> karena ikut menghitung tren. DiD mengoreksinya via kontrol.</p>
      </details>

      <PlotlyChart
        data={didData}
        title="DiD: Tren Paralel Pra-Program, Divergen Setelahnya"
        layout={{ xaxis: { title: "Kuartal" }, yaxis: { title: "Skor" }, showlegend: true, shapes: [{ type: "line", x0: "2023-Q4", x1: "2023-Q4", y0: 95, y1: 125, line: { dash: "dash", color: "#c2410c" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua garis tren; garis oranye = mulai program (2024-Q1).</p>
        <p><strong>Interpretasi:</strong> sebelum garis, kedua kota bergerak <strong>paralel</strong> (asumsi terpenuhi ✓). Setelahnya, kota program melesat — celah yang melebar itulah efek DiD. <strong>Jika garis pra-program tidak paralel</strong>, seluruh analisis runtuh — selalu plot ini dulu.</p>
      </div>

      <h2 id="metode-lain">Senjata Lain: IV, RDD, Matching</h2>
      <p><strong>Instrumental Variable (IV):</strong> cari variabel Z yang memengaruhi X <strong>tapi</strong> hanya memengaruhi Y <em>melalui</em> X (tidak ada jalur langsung Z→Y). Contoh klasik: <strong>lotre wajib militer</strong> sebagai instrumen untuk &ldquo;pengaruh dinas militer terhadap pendapatan&rdquo; — lotre memengaruhi siapa yang dinas (relevan) tapi tidak memengaruhi pendapatan selain via dinas (exclusion). Syarat exclusion <strong>tidak bisa diuji</strong> — harus diargumenkan.</p>
      <p><strong>Regression Discontinuity (RDD):</strong> saat perlakuan diberikan berdasarkan <strong>ambang skor</strong> (misal beasiswa untuk nilai ≥ 80). Di sekitar ambang, yang 79 vs 81 <strong>hampir identik</strong> kecuali perlakuannya — seperti randomisasi lokal! Plot hasil vs skor: <strong>lompatan di ambang</strong> = efek kausal. Sangat kredibel, tapi hanya mengukur efek <em>di sekitar ambang</em>.</p>
      <p><strong>Matching / Propensity Score:</strong> untuk tiap individu perlakuan, cari &ldquo;kembaran&rdquo; kontrol dengan karakteristik (Z) mirip, lalu bandingkan. <strong>Kelemahan fundamental:</strong> hanya menyeimbangkan Z yang <em>teramati</em> — confounder tak teramati tetap mengintai. Lebih baik dari mentah, jauh dari RCT.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> semua metode kuasi-eksperimen mencari <strong>&ldquo;randomisasi alami&rdquo;</strong> — variasi di dunia yang <em>seolah</em> mengacak perlakuan (ambang aturan, lotre, waktu peluncuran bertahap). Keterampilan intinya bukan rumusnya, melainkan <strong>matanya</strong>: melihat peluang eksperimen alami dalam kebijakan dan proses bisnis. Analis yang punya mata ini jauh lebih berharga daripada yang hanya bisa menjalankan regresi.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Kausalitas = &ldquo;apa yang terjadi <em>jika</em>&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Simpson — obat yang &ldquo;mematikan&rdquo;</summary>
              <p>Obat vs plasebo. Keseluruhan: sembuh 40% (obat) vs 50% (plasebo) — obat <em>lebih buruk</em>?! Pecah per keparahan: ringan: 90% vs 80%; berat: 30% vs 20%. Obat lebih baik di <em>keduanya</em>!</p>
              <p><strong>Langkah 1</strong> — paradoks: obat menang di tiap strata tapi kalah agregat.<br />
              <strong>Langkah 2</strong> — sebab: dokter memberi obat ke pasien <em>berat</em> (80% pasien obat = berat; 80% plasebo = ringan) — <em>confounding by indication</em>.<br />
              <strong>Langkah 3</strong> — estimasi kausal benar = rata-rata <em>tertimbang populasi</em> dari efek per strata, bukan agregat mentah.</p>
              <p>Pelajaran: agregat tanpa kontrol confounder = kebohongan. Inilah mengapa RCT (randomisasi memutus confounding!) = standar emas.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Diff-in-diff — kampanye yang &ldquo;berhasil&rdquo;?</summary>
              <p>Kota A (kampanye): konversi 5% → 7%. Kota B (kontrol): 5% → 6%. Apakah kampanye berhasil (+2%)?</p>
              <p><strong>Langkah 1</strong> — naive: +2 poin. Tapi B juga naik 1 poin (tren umum!).<br />
              <strong>Langkah 2</strong> — diff-in-diff: (7−5) − (6−5) = <strong>+1 poin</strong> — efek kausal (asumsi tren paralel).<br />
              <strong>Langkah 3</strong> — cek asumsi: tren A &amp; B <em>sebelum</em> kampanye harus paralel. Jika A memang trennya lebih curam → estimasi bias.</p>
              <p>Pelajaran: diff-in-diff = &ldquo;kurangi tren umum&rdquo;. Asumsi kuncinya (parallel trends) <em>bisa &amp; wajib</em> dicek dengan data pra-periode.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Membangun Simpson&rsquo;s Paradox</h2>
      <p>Konstruksikan sendiri paradox-nya: kampanye B menang di <em>tiap</em> segmen tapi kalah agregat. Ubah komposisinya dan saksikan paradox lenyap.</p>
      <PyodideLab
        title="Lab 1 — Simpson's Paradox dari Nol (Live Python)"
        hint="⚡ Live Python. Coba: samakan komposisi (A: 500 muda + 500 tua, dengan rate per segmen sama). Paradox hilang — agregat jadi jujur. Kapan agregat boleh dipercaya?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Difference-in-Differences dari Nol</h2>
      <p>Simulasikan dua kota dengan tren waktu + efek program. Bandingkan estimasi naif (pre-post) vs DiD — lalu rusak asumsi parallel trends dan saksikan DiD ikut bias.</p>
      <PyodideLab
        title="Lab 2 — DiD vs Pre-Post Naif (Live Python)"
        hint="Coba: ubah tren kota K jadi 3 (tidak paralel!). DiD ikut bias — tidak ada metode yang selamat jika asumsinya jebol. Selalu plot tren pra-perlakuan!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Klaim Kausal</h2>

      <div className="decision-card">
        <h3>1. Bisa randomisasi → <strong>RCT / A/B test</strong></h3>
        <p><strong>Kondisi:</strong> kamu mengontrol siapa dapat perlakuan; etis &amp; operasional.</p>
        <p><strong>Kenapa:</strong> standar emas — satu-satunya yang menyeimbangkan confounder tak teramati. Selalu pilih ini jika bisa.</p>
        <p><strong>Contoh nyata:</strong> test fitur aplikasi; randomisasi penawaran kredit.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ada grup kontrol + data sebelum/sesudah → <strong>DiD</strong></h3>
        <p><strong>Kondisi:</strong> program diluncurkan di sebagian wilayah/waktu; ada pembanding yang tak tersentuh.</p>
        <p><strong>Kenapa:</strong> mengontrol tren waktu via grup kontrol. Wajib: cek parallel trends pra-perlakuan.</p>
        <p><strong>Contoh nyata:</strong> dampak program literasi di 5 kota pilot vs 5 kota kontrol.</p>
      </div>

      <div className="decision-card">
        <h3>3. Perlakuan berbasis ambang skor → <strong>RDD</strong></h3>
        <p><strong>Kondisi:</strong> aturan &ldquo;skor ≥ X dapat perlakuan&rdquo; (beasiswa, limit, promo).</p>
        <p><strong>Kenapa:</strong> sekitar ambang ≈ randomisasi lokal. Plot lompatan di ambang sebagai bukti visual.</p>
        <p><strong>Contoh nyata:</strong> efek &ldquo;nasabah prioritas&rdquo; (saldo ≥ Rp500 jt) terhadap retensi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Hanya data observasional, confounder terukur → <strong>kontrol + DAG</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada eksperimen; tapi confounder kunci teramati.</p>
        <p><strong>Kenapa:</strong> stratifikasi/regresi/matching pada Z yang tepat (dari DAG — jangan kontrol mediator/collider!). Akui asumsi &ldquo;no unmeasured confounding&rdquo; sebagai keterbatasan.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;efek webinar terhadap default, dikontrol usia+penghasilan+skor awal&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>5. Hanya korelasi, tanpa desain → <strong>jangan klaim kausal</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;X berkorelasi dengan Y&rdquo; dari data observasional mentah.</p>
        <p><strong>Kenapa:</strong> korelasi = hipotesis, bukan kesimpulan. Laporkan sebagai &ldquo;berhubungan&rdquo; + usulkan eksperimen/kuasi-eksperimen untuk validasi.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;pengguna fitur X lebih loyal&rdquo; → hipotesis untuk A/B test, bukan klaim.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Uji intervensi:</strong> &ldquo;jika X kupaksa berubah, Y ikut?&rdquo; — jika tidak masuk akal, klaim kausal goyah.</li>
          <li><strong>Gambar DAG dulu</strong> — baru putuskan apa yang dikontrol. Jangan kontrol mediator/collider.</li>
          <li><strong>Cek per segmen</strong> sebelum percaya agregat (Simpson mengintai).</li>
          <li><strong>Sebutkan asumsinya</strong> — &ldquo;dengan asumsi tidak ada confounder tak teramati…&rdquo; adalah kalimat kejujuran, bukan kelemahan.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Apakah Program Pelatihan Menurunkan Default?</h2>
      <div className="callout">
        <p>DanaKita menjalankan <strong>program literasi keuangan</strong> (sukarela) di 2024. Data: peserta program default <strong>4%</strong>; non-peserta <strong>9%</strong>. Tim CSR mengklaim: &ldquo;program menurunkan default 5 poin — perluas ke semua nasabah!&rdquo; Biaya perluasan: Rp12 miliar/tahun.</p>
        <p>Data tambahan: peserta rata-rata berusia 28 th, skor kredit awal 720; non-peserta rata-rata 45 th, skor awal 640. Program hanya dibuka di 10 dari 30 kota (kota besar).</p>
        <p><strong>Pertanyaan:</strong> (a) Identifikasi minimal 3 confounder. (b) Mengapa klaim &ldquo;5 poin&rdquo; tidak kredibel? (c) Rancang evaluasi kausal yang defensibel dengan 2 opsi (mahal &amp; murah).</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Usia</strong> (muda → ikut program &amp; memang lebih melek digital), <strong>skor kredit awal</strong> (720 vs 640 — peserta memang lebih sehat <em>sebelum</em> program!), <strong>kota</strong> (hanya kota besar — ekonomi &amp; infrastruktur beda). Ketiganya memengaruhi <em>ikut/tidak</em> dan <em>default</em> — confounder klasik.</p>
          <p>(b) <strong>Seleksi diri (self-selection):</strong> yang ikut adalah yang sudah lebih sehat finansialnya. &ldquo;5 poin&rdquo; mencampur efek program + perbedaan bawaan — kemungkinan besar <em>mayoritasnya</em> adalah perbedaan bawaan. Mengklaim kausal dari sini = es krim vs tenggelam versi korporat.</p>
          <p>(c) <strong>Opsi mahal (emas): RCT</strong> — tawarkan program ke 2.000 nasabah acak, 2.000 kontrol; bandingkan default 12 bulan. <strong>Opsi murah (perak): DiD</strong> — 10 kota program vs 20 kota kontrol, bandingkan <em>perubahan</em> default sebelum–sesudah; cek parallel trends 2022–2023 dulu. <strong>Jangan</strong> perluas Rp12 M/tahun berdasarkan 4% vs 9% mentah — itu keputusan Rp12 miliar dari korelasi.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Es krim vs tenggelam berkorelasi 0,8. Variabel confounder-nya? Bagaimana membuktikan es krim <em>tidak</em> menyebabkan tenggelam?</li>
              <li>Regresi &ldquo;gaji ~ pendidikan&rdquo; memberi koef positif besar. Sebutkan 1 confounder dan arah biasnya.</li>
              <li>Kapan <em>instrumental variable</em> dibutuhkan? (1 kalimat + contoh.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Musim/suhu</strong>: panas → beli es krim + berenang (→ tenggelam). Bukti: kontrol suhu (parsial/regresi multivariat) → korelasi es krim–tenggelam ≈ 0. Atau: tidak ada <em>mekanisme</em> yang masuk akal.</p>
              <p><strong>2.</strong> <strong>Kemampuan/ambisi</strong> (ability bias): orang &ldquo;berbakat&rdquo; sekolah lebih tinggi <em>dan</em> digaji lebih tinggi → koef pendidikan <em>over-estimasi</em> efek kausal sekolah. (Inilah perdebatan Card vs klasik!)</p>
              <p><strong>3.</strong> Saat confounder <em>tak teramati</em> (ability!). Contoh: <strong>jarak ke kampus</strong> sebagai instrumen untuk pendidikan — memengaruhi sekolah tapi (arguably) tidak langsung memengaruhi gaji kecuali via sekolah.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'Nasabah ikut webinar default 4% vs 9% yang tidak ikut.' Klaim kausal 'webinar menurunkan default' bermasalah karena?"
        options={[
          "Sampel terlalu kecil",
          "Self-selection/confounding: yang ikut memang lebih melek finansial (skor awal lebih tinggi) — perbedaan bawaan, bukan efek webinar",
          "Webinar tidak berguna",
          "Harus uji-t bukan perbandingan",
        ]}
        correct={1}
        explanation="Benar. Ini es krim vs tenggelam versi bisnis: Z (literasi/motivasi awal) → ikut webinar DAN → rendah default. Tanpa mengontrol Z atau randomisasi, '5 poin' bukan efek kausal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kampanye A menang agregat tapi kalah di tiap segmen. Penjelasan & tindakan?"
        options={[
          "Data salah — mustahil",
          "Simpson's paradox: komposisi segmen beda (A banyak di segmen sulit). Keputusan dari per-segmen: B lebih baik; audit alokasi A",
          "A tetap menang — agregat yang benar",
          "Gabungkan segmennya",
        ]}
        correct={1}
        explanation="Benar. Agregat mencampur kualitas kampanye dengan komposisi alokasi. Selalu cek per segmen besar sebelum merayakan kemenangan agregat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa RCT disebut 'standar emas' kausalitas?"
        options={[
          "Karena mahal",
          "Karena randomisasi menyeimbangkan confounder TERAMATI maupun TAK TERAMATI — satu-satunya metode dengan properti ini",
          "Karena butuh n besar",
          "Karena selalu etis",
        ]}
        correct={1}
        explanation="Benar. Randomisasi memutus semua panah Z→X, termasuk Z yang tidak kamu ketahui. Semua metode observasional berasumsi 'tidak ada confounder tak teramati penting' — asumsi yang tak bisa diuji dari data."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam DAG X→M→Y (M mediator), kamu mengontrol M dalam regresi. Apa akibatnya?"
        options={[
          "Estimasi lebih akurat",
          "Menghapus (sebagian) efek X→Y yang ingin diukur — mengontrol mediator memblokir jalur kausal itu sendiri",
          "Tidak ada efek",
          "Menambah power",
        ]}
        correct={1}
        explanation="Benar. M adalah mekanisme bekerjanya X — mengontrolnya seperti mengukur efek obat sambil mengontrol 'kadar obat dalam darah'. Aturan: kontrol confounder, JANGAN kontrol mediator/collider. DAG dulu!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Syarat 'nyawa' DiD yang harus diperiksa sebelum percaya hasilnya?"
        options={[
          "n > 1000",
          "Parallel trends: tanpa perlakuan, kedua grup akan bergerak paralel — cek tren pra-perlakuan; jika sudah tidak paralel, DiD tidak valid",
          "Data normal",
          "Tidak ada missing data",
        ]}
        correct={1}
        explanation="Benar. DiD mengurangkan 'tren waktu' via kontrol — yang hanya sah jika trennya memang sama. Plot pra-perlakuan adalah pemeriksaan wajib, bukan opsional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Beasiswa diberikan untuk nilai ≥ 80. Metode kuasi-eksperimen paling tepat untuk efek beasiswa?"
        options={[
          "Bandingkan semua penerima vs bukan penerima",
          "RDD: bandingkan yang 79 vs 81 — di sekitar ambang, keduanya hampir identik kecuali beasiswanya (≈ randomisasi lokal)",
          "DiD",
          "Korelasi nilai vs pendapatan",
        ]}
        correct={1}
        explanation="Benar. Ambang tajam menciptakan 'eksperimen alami': 79 vs 81 beda tipis dalam segala hal kecuali perlakuan. Lompatan hasil di ambang = efek kausal (lokal di sekitar ambang)."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Korelasi ≠ kausasi.</strong> Empat penjelasan: X→Y, Y→X, Z→keduanya, kebetulan. Uji dengan pertanyaan intervensi.</li>
          <li><strong>Confounder</strong> = Z yang memengaruhi X dan Y. Respons: ukur &amp; kontrol (dengan DAG!), randomisasi, atau kuasi-eksperimen.</li>
          <li><strong>Jangan kontrol mediator/collider</strong> — DAG dulu, baru putuskan.</li>
          <li><strong>Simpson&rsquo;s paradox:</strong> agregat bisa berbalik per segmen — selalu cek per segmen.</li>
          <li><strong>Tangga bukti:</strong> RCT (emas) &gt; kuasi-eksperimen (perak, dengan asumsi) &gt; observasional terkontrol (perunggu) &gt; korelasi mentah.</li>
          <li><strong>DiD:</strong> <Tex math={String.raw`(\Delta P) - (\Delta K)`} /> — mengontrol tren waktu; nyawanya <em>parallel trends</em>.</li>
          <li><strong>RDD</strong> (ambang ≈ randomisasi lokal), <strong>IV</strong> (butuh exclusion yang diargumenkan), <strong>matching</strong> (hanya Z teramati).</li>
          <li><strong>Big data tidak menggantikan eksperimen</strong> — masalah kausal adalah jenis variasi, bukan jumlah data.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a212-bayesian" className="btn btn-secondary btn-sm">← A2.12</Link>
        <Link href="/" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}
