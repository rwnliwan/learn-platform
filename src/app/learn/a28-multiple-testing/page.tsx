"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A28Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: peluang ≥1 false positive vs jumlah uji (alpha=5%)
  const mVals = [1, 2, 5, 10, 20, 50, 100];
  const fwerData = [
    {
      x: mVals,
      y: mVals.map((m) => (1 - Math.pow(0.95, m)) * 100),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#c2410c" },
      name: "Peluang ≥1 false positive (%)",
    },
  ];

  // Chart 2: perbandingan metode — berapa hipotesis ditolak (ilustrasi 20 p-value)
  const pvals = [0.001, 0.004, 0.008, 0.012, 0.019, 0.028, 0.04, 0.06, 0.09, 0.12, 0.18, 0.25, 0.33, 0.45, 0.55, 0.66, 0.75, 0.85, 0.93, 0.99];
  const idx = pvals.map((_, i) => i + 1);
  const bonfLine = idx.map(() => 0.05 / 20);
  const bhLine = idx.map((i) => (i * 0.05) / 20);
  const compareData = [
    {
      x: idx,
      y: [...pvals].sort((a, b) => a - b),
      type: "scatter",
      mode: "markers",
      marker: { color: "#2a7de1", size: 8 },
      name: "p-value terurut",
    },
    {
      x: idx,
      y: bonfLine,
      type: "scatter",
      mode: "lines",
      name: "Ambang Bonferroni (α/m)",
      line: { dash: "dash", color: "#c2410c" },
    },
    {
      x: idx,
      y: bhLine,
      type: "scatter",
      mode: "lines",
      name: "Ambang BH (i·α/m)",
      line: { dash: "dot", color: "#16a34a" },
    },
  ];

  // Chart 3: FWER vs FDR — ekspektasi jumlah false positive
  const fwerFdrData = [
    {
      x: ["Tanpa koreksi<br>(20 uji)", "Bonferroni", "Holm", "BH (FDR 5%)"],
      y: [1.0, 0.05, 0.05, 0.35],
      type: "bar",
      marker: { color: ["#c2410c", "#2a7de1", "#2a7de1", "#16a34a"] },
      text: ["~1,0 FP", "~0,05 FP", "~0,05 FP", "~0,35 FP"],
      textposition: "outside",
    },
  ];

  const lab1Code = `import random

random.seed(88)
# 20 hipotesis, SEMUANYA SALAH (tidak ada efek nyata).
# Berapa kali kita "menemukan" sesuatu yang signifikan palsu?
ALPHA = 0.05
M = 20
TRIALS = 5000

false_trials = 0
fp_counts = []
for _ in range(TRIALS):
    # 20 p-value dari H0 yang benar -> uniform(0,1)
    pvals = [random.random() for _ in range(M)]
    fp = sum(1 for p in pvals if p < ALPHA)
    fp_counts.append(fp)
    if fp >= 1:
        false_trials += 1

print(f"{M} uji, semuanya H0 benar, α={ALPHA}:")
print(f"Peluang ≥1 'temuan' palsu = {false_trials/TRIALS:.1%}")
print(f"Teori: 1 - 0.95^20 = {1 - 0.95**20:.1%}")
print(f"Rata-rata false positive per eksperimen = {sum(fp_counts)/TRIALS:.2f}")
print()
print("Coba: ubah M jadi 100. Peluangnya -> ~99.4%.")
print("Tanpa koreksi, 'menemukan sesuatu' hampir PASTI — semuanya palsu.")`;

  const lab2Code = `import random

random.seed(99)
# Simulasi: 20 uji, 5 di antaranya PUNYA efek nyata (p kecil),
# 15 tidak ada efek (p uniform). Bandingkan 3 metode koreksi.

def bonferroni(pvals, alpha=0.05):
    m = len(pvals)
    return [p < alpha/m for p in pvals]

def holm(pvals, alpha=0.05):
    m = len(pvals)
    order = sorted(range(m), key=lambda i: pvals[i])
    rej = [False]*m
    for k, i in enumerate(order):
        if pvals[i] < alpha/(m-k):
            rej[i] = True
        else:
            break
    return rej

def bh(pvals, alpha=0.05):
    m = len(pvals)
    order = sorted(range(m), key=lambda i: pvals[i])
    rej = [False]*m
    # cari k terbesar dengan p_(k) <= k*alpha/m
    k_max = 0
    for k, i in enumerate(order, start=1):
        if pvals[i] <= k*alpha/m:
            k_max = k
    for k in range(k_max):
        rej[order[k]] = True
    return rej

# 5 efek nyata -> p-value kecil; 15 null -> p uniform
true_p = [0.001, 0.004, 0.008, 0.015, 0.03]
null_p = [random.random() for _ in range(15)]
pvals = true_p + null_p
random.shuffle(pvals)

for name, fn in [("Tanpa koreksi", lambda p: [x < 0.05 for x in p]),
                 ("Bonferroni", bonferroni), ("Holm", holm), ("BH", bh)]:
    rej = fn(pvals)
    # 5 p-value pertama dalam list asli = efek nyata (sebelum shuffle, lacak via nilai)
    tp = sum(1 for p, r in zip(pvals, rej) if r and p in true_p)
    fp = sum(1 for p, r in zip(pvals, rej) if r and p not in true_p)
    print(f"{name:>14}: menolak {sum(rej):>2} | benar {tp} | palsu {fp}")

print()
print("Amati: Bonferroni/Holm aman tapi bisa melewatkan efek kecil;")
print("BH menangkap lebih banyak dengan 'pajak' false positive terkendali.")
print("Coba: ubah true_p jadi [0.001,0.01,0.02,0.03,0.04] — siapa yang masih menangkap?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.8 — Statistika Inferensial</span>
        <h1 className="display-title">Jelly Bean yang Menyebabkan Jerawat:<br />Multiple Testing</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> <strong>Uji hipotesis</strong> mengendalikan error Tipe I (false positive) pada α = 5% — <em>untuk satu uji</em>. <strong>Effect size</strong> mengingatkan bahwa &ldquo;signifikan&rdquo; belum tentu penting. Lesson ini menangani jebakan berikutnya: apa yang terjadi pada 5% itu ketika kamu menjalankan <strong>20, 50, atau 1.000 uji sekaligus</strong>? Jawaban singkatnya: ia meledak — dan ada tiga cara standar menjinakkannya.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Jelly Bean Hijau Penyebab Jerawat</a></li>
          <li><a href="#masalah">Masalahnya — Error yang Menumpuk</a></li>
          <li><a href="#bonferroni">Bonferroni — Palu Godam yang Sederhana</a></li>
          <li><a href="#holm">Holm — Palu yang Lebih Cerdas</a></li>
          <li><a href="#bh">Benjamini–Hochberg — Mengendalikan Proporsi, Bukan Keberadaan</a></li>
          <li><a href="#fwer-fdr">FWER vs FDR — Dua Filosofi Pengendalian</a></li>
          <li><a href="#lab1">🔬 Lab 1: Saksikan False Positive Meledak</a></li>
          <li><a href="#lab2">🔬 Lab 2: Adu Tiga Metode Koreksi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Koreksi Mana</a></li>
          <li><a href="#case">📋 Mini-Case: 50 Varian Strategi Trading</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung <strong>family-wise error rate</strong> (FWER) untuk m uji dan menjelaskan mengapa ia meledak.</li>
          <li>Menerapkan <strong>koreksi Bonferroni</strong> dan menjelaskan kapan ia terlalu konservatif.</li>
          <li>Menerapkan <strong>prosedur Holm</strong> langkah-demi-langkah dan menjelaskan mengapa ia selalu ≥ Bonferroni dalam power.</li>
          <li>Menerapkan <strong>prosedur Benjamini–Hochberg</strong> dan menjelaskan perbedaan <strong>FDR vs FWER</strong>.</li>
          <li>Memilih koreksi yang tepat untuk skenario konfirmatori vs eksploratori — termasuk di dunia trading/alpha research.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Jelly Bean Hijau Penyebab Jerawat</h2>
      <div className="story">
        <p>Sebuah komik sains terkenal menggambarkan ilmuwan menguji apakah jelly bean menyebabkan jerawat. Mereka menguji 20 warna — ungu, coklat, merah, … — masing-masing dengan uji pada α = 5%. Hasil: 19 warna &ldquo;tidak signifikan&rdquo;. Satu warna — <strong>hijau</strong> — signifikan (p &lt; 0,05)!</p>
        <p>Headline keesokan harinya: <strong>&ldquo;JELLY BEAN HIJAU MENYEBABKAN JERAWAT — TERBUKTI SECARA ILMIAH!&rdquo;</strong></p>
        <p>Tentu saja itu omong kosong. Dengan 20 uji pada α = 5%, peluang <em>minimal satu</em> false positive adalah <strong>64%</strong> — bahkan jika jelly bean tidak berpengaruh sama sekali. &ldquo;Temuan&rdquo; itu hampir pasti kebetulan yang dicari-cari.</p>
        <p><strong>Twist-nya:</strong> ini bukan lelucon — ini mekanisme di balik <strong>krisis replikasi</strong> sains, <strong>strategi trading</strong> yang &ldquo;bagus di backtest, hancur di live&rdquo;, dan <strong>A/B test</strong> yang &ldquo;menang&rdquo; lalu gagal direplikasi. Setiap kali kamu menguji banyak hal dan melaporkan yang &ldquo;menarik&rdquo;, kamu sedang mengulangi eksperimen jelly bean hijau.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="masalah">Masalahnya — Error yang Menumpuk</h2>
      <p><strong>Definisi.</strong> <strong>Family-wise error rate</strong> (FWER) adalah peluang membuat <strong>minimal satu</strong> error Tipe I di antara <Tex math={String.raw`m`} /> uji:</p>
      <Tex math={String.raw`FWER = P(\text{minimal satu false positive}) = 1 - (1-\alpha)^m \quad \text{(jika uji independen)}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`m`} /> jumlah uji; <Tex math={String.raw`\alpha`} /> tingkat signifikansi per uji; <Tex math={String.raw`(1-\alpha)^m`} /> peluang <em>tidak satu pun</em> false positive. Untuk m = 20, α = 0,05: FWER = 1 − 0,95²⁰ ≈ <strong>64%</strong>.</p>
      <p><strong>Kepribadian masalah ini:</strong> si pencuri yang tak terlihat — tiap uji terlihat &ldquo;aman&rdquo; (5%!), tapi kolektifnya berbahaya. Seperti 20 orang masing-masing melempar koin yang 5% &ldquo;curang&rdquo; — peluang <em>seseorang</em> dapat hasil curang jadi besar.</p>
      <p><strong>Kapan ini menyerang:</strong> menguji banyak segmen/varian/fitur sekaligus; mencoba banyak transformasi sampai &ldquo;menarik&rdquo;; backtest banyak strategi; genome-wide association studies (1 juta SNP!); A/B test dengan 10 metrik.</p>

      <PlotlyChart
        data={fwerData}
        title="Peluang ≥1 False Positive Meledak dengan Jumlah Uji (α = 5%)"
        layout={{ xaxis: { title: "Jumlah uji (m)" }, yaxis: { title: "FWER (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = berapa banyak uji dijalankan; vertikal = peluang minimal satu temuan palsu.</p>
        <p><strong>Interpretasi:</strong> pada m = 1, risikonya 5% (terkendali). Pada m = 20 sudah 64%; pada m = 100, <strong>99,4%</strong> — temuan palsu hampir pasti. <strong>Pesan:</strong> &ldquo;saya cuma pakai α = 5%&rdquo; tidak ada artinya tanpa menyebut <em>berapa uji</em> yang dijalankan. Jumlah uji adalah bagian dari metode — menyembunyikannya = menyembunyikan risiko.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> masalahnya bukan p-value-nya — p-value tiap uji tetap valid <em>untuk uji itu sendiri</em>. Masalahnya adalah <strong>seleksi</strong>: kamu menjalankan 20 uji lalu <em>melaporkan yang terkecil</em>. p-value minimum dari 20 uji bukan lagi berdistribusi uniform — ia bias ke kecil. Semua koreksi di lesson ini pada dasarnya mengoreksi <strong>bias seleksi</strong> ini.</p>
      </div>

      <h2 id="bonferroni">Bonferroni — Palu Godam yang Sederhana</h2>
      <p><strong>Definisi.</strong> <strong>Koreksi Bonferroni</strong>: bagi α dengan jumlah uji, lalu uji tiap hipotesis pada ambang yang lebih ketat:</p>
      <Tex math={String.raw`\text{Tolak } H_{0i} \text{ jika } p_i < \frac{\alpha}{m}`} block />
      <p><strong>Artinya:</strong> dengan m = 20 dan α = 5%, ambang per uji menjadi 0,05/20 = <strong>0,0025</strong>. Hanya p-value di bawah itu yang &ldquo;signifikan&rdquo;. Dijamin: FWER ≤ α (via Bonferroni inequality — berlaku bahkan jika uji saling berkorelasi!).</p>
      <p><strong>Kepribadian Bonferroni:</strong> si palu godam — sederhana, tidak butuh asumsi apa pun, selalu aman. Tapi ia memukul semua hipotesis sama kerasnya, termasuk yang sebenarnya punya efek nyata tapi sedang.</p>
      <p><strong>Kelemahan:</strong> <strong>sangat konservatif</strong> saat m besar. Dengan 1.000 uji, ambang = 0,00005 — efek nyata yang sedang hampir mustahil lolos (power anjlok). Bonferroni mengendalikan false positive dengan cara mengorbankan banyak true positive.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Bonferroni</summary>
        <p>20 warna jelly bean, α = 5%. p-value terkecil yang teramati: hijau p = 0,03.</p>
        <p><strong>Langkah 1</strong> — ambang Bonferroni: 0,05/20 = 0,0025.<br />
        <strong>Langkah 2</strong> — bandingkan: 0,03 &gt; 0,0025 → <strong>gagal menolak</strong>.<br />
        <strong>Langkah 3</strong> — kesimpulan: tidak ada bukti jelly bean hijau menyebabkan jerawat. Headline dibatalkan.</p>
        <p>Perhatikan: tanpa koreksi, p = 0,03 &ldquo;signifikan&rdquo; dan headline terbit. Koreksi mengubah keputusan — itulah gunanya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bonferroni selalu pilihan yang benar karena paling aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;paling aman dari false positive&rdquo; ≠ &ldquo;paling benar&rdquo;. Keamanan Bonferroni dibayar dengan <strong>power yang hancur</strong> saat m besar — kamu akan melewatkan banyak efek nyata (error Tipe II meledak). Jika tujuanmu <em>eksplorasi</em> (menemukan kandidat untuk ditindaklanjuti), Bonferroni terlalu kejam. Pilih koreksi sesuai tujuan — bukan yang paling ketat secara membabi buta.</p>
      </div>

      <h2 id="holm">Holm — Palu yang Lebih Cerdas</h2>
      <p><strong>Definisi.</strong> <strong>Prosedur Holm</strong> (step-down) mengurutkan p-value dari terkecil ke terbesar, lalu menguji satu per satu dengan ambang yang <em>melonggar</em>:</p>
      <Tex math={String.raw`\text{Urutkan } p_{(1)} \le p_{(2)} \le \cdots \le p_{(m)}. \text{ Tolak } H_{(k)} \text{ jika } p_{(k)} < \frac{\alpha}{m-k+1}. \text{ Berhenti di kegagalan pertama.}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`p_{(k)}`} /> = p-value terkecil ke-k; ambang untuk yang terkecil = α/m (sama seperti Bonferroni), untuk yang kedua = α/(m−1) (sedikit lebih longgar), dst. Begitu satu gagal, <strong>berhenti</strong> — sisanya otomatis gagal.</p>
      <p><strong>Kepribadian Holm:</strong> si ahli strategi — &ldquo;hipotesis yang sudah terbukti bersalah tidak perlu dihitung lagi dalam jatah kesalahan.&rdquo; Setiap penolakan &ldquo;membebaskan&rdquo; sebagian budget α untuk hipotesis berikutnya.</p>
      <p><strong>Sifat kunci:</strong> Holm <strong>selalu menolak minimal sebanyak Bonferroni</strong> (uniformly more powerful) — dengan jaminan FWER yang sama (≤ α) dan tanpa asumsi tambahan. Tidak ada alasan memakai Bonferroni jika Holm tersedia — kecuali kamu butuh ambang tunggal yang simpel untuk komunikasi.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Holm</summary>
        <p>m = 4, α = 0,05. p-value terurut: 0,008; 0,015; 0,03; 0,40.</p>
        <p><strong>Langkah 1</strong> — p₍₁₎ = 0,008 &lt; 0,05/4 = 0,0125 → tolak.<br />
        <strong>Langkah 2</strong> — p₍₂₎ = 0,015 &lt; 0,05/3 ≈ 0,0167 → tolak.<br />
        <strong>Langkah 3</strong> — p₍₃₎ = 0,03 &lt; 0,05/2 = 0,025? <strong>Tidak</strong> → berhenti.<br />
        <strong>Hasil:</strong> 2 penolakan.</p>
        <p>Bonferroni (ambang 0,0125 untuk semua) hanya menolak 1 (0,008). Holm menangkap satu tambahan — gratis, tanpa mengorbankan jaminan FWER.</p>
      </details>

      <h2 id="bh">Benjamini–Hochberg — Mengendalikan Proporsi, Bukan Keberadaan</h2>
      <p><strong>Definisi.</strong> Prosedur <strong>Benjamini–Hochberg (BH)</strong> mengendalikan <strong>False Discovery Rate (FDR)</strong> — <em>proporsi</em> temuan yang palsu — bukan peluang <em>adanya</em> temuan palsu:</p>
      <Tex math={String.raw`\text{Urutkan } p_{(1)} \le \cdots \le p_{(m)}. \text{ Cari } k^* = \max\{k : p_{(k)} \le \tfrac{k}{m}\alpha\}. \text{ Tolak } H_{(1)} \dots H_{(k^*)}.`} block />
      <p><strong>Artinya:</strong> bandingkan p-value terurut ke-k dengan garis lurus <Tex math={String.raw`k\alpha/m`} />; tolak semua sampai titik terakhir di mana p-value masih di bawah garis. Jaminan: <Tex math={String.raw`E[\text{FP} / \text{total penolakan}] \le \alpha`} /> — dari semua yang kamu klaim &ldquo;temuan&rdquo;, maksimal α yang palsu (rata-rata).</p>
      <p><strong>Kepribadian BH:</strong> si manajer portofolio — &ldquo;saya tidak menuntut <em>nol</em> kesalahan; saya menuntut kesalahan ≤ 5% <em>dari yang saya laporkan</em>.&rdquo; Jauh lebih longgar dari Bonferroni/Holm — dan jauh lebih powerful untuk eksplorasi.</p>
      <p><strong>Kapan memakai:</strong> <strong>eksplorasi skala besar</strong> — skrining ribuan fitur/gen/strategi untuk ditindaklanjuti. Kamu rela ada sedikit palsu di antara temuan, asal mayoritasnya nyata. Standar di genomik, neuroimaging, dan skrining fitur ML.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci — visual BH:</strong> plot p-value terurut vs garis <Tex math={String.raw`k\alpha/m`} /> (lihat chart perbandingan di bawah). BH menolak semua titik di kiri titik persimpangan <em>terakhir</em>. Perhatikan triknya: ia tidak berhenti di persimpangan <em>pertama</em> (seperti Holm) — ia melompat ke yang terakhir. Itulah sumber power tambahannya: &ldquo;jika p-value ke-7 lolos garisnya, maka 1–6 ikut lolos meski ada yang di atas garis.&rdquo;</p>
      </div>

      <h2 id="fwer-fdr">FWER vs FDR — Dua Filosofi Pengendalian</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th></th><th>FWER (Bonferroni/Holm)</th><th>FDR (BH)</th></tr></thead>
          <tbody>
            <tr><td><strong>Yang dikendalikan</strong></td><td>P(≥1 false positive) ≤ α</td><td>E[FP / total temuan] ≤ α</td></tr>
            <tr><td><strong>Artinya</strong></td><td>&ldquo;Hampir pasti TIDAK ADA temuan palsu&rdquo;</td><td>&ldquo;Maksimal α dari temuanku yang palsu&rdquo;</td></tr>
            <tr><td><strong>Kekuatan</strong></td><td>Rendah (konservatif)</td><td>Tinggi (longgar)</td></tr>
            <tr><td><strong>Cocok untuk</strong></td><td>Konfirmatori: uji klinis, keputusan final</td><td>Eksploratori: skrining, feature selection</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Analogi:</strong> FWER seperti bandara yang menuntut <em>nol</em> barang terlarang lolos — pemeriksaannya lambat dan banyak penumpang tertahan. FDR seperti kurator galeri yang menerima ≤5% karya palsu di antara yang dipamerkan — pamerannya kaya, sesekali ada yang palsu tapi proporsinya terkendali.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;q-value / adjusted p-value sama dengan p-value biasa.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <strong>adjusted p-value</strong> (Bonferroni: min(1, m·p); BH: versi FDR-nya) adalah p-value yang <em>sudah dikoreksi</em> — kamu membandingkannya langsung dengan α (bukan dengan α/m lagi). Jangan koreksi dua kali! Jika software melaporkan &ldquo;adjusted p = 0,04&rdquo;, itu sudah siap dibandingkan dengan 0,05.</p>
      </div>

      <PlotlyChart
        data={compareData}
        title="Tiga Metode pada 20 p-value: Siapa Menolak Berapa"
        layout={{ xaxis: { title: "Peringkat p-value (terurut)" }, yaxis: { title: "p-value", type: "log" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik biru = 20 p-value terurut (skala log). Garis oranye = ambang Bonferroni (datar); garis hijau = ambang BH (menanjak).</p>
        <p><strong>Interpretasi:</strong> Bonferroni hanya menolak 2 (titik di bawah garis oranye). BH menolak 6 — titik-titik di bawah garis hijau sampai persimpangan terakhir. <strong>Enam vs dua dari data yang sama</strong> — itulah perbedaan filosofi FWER vs FDR dalam bentuk visual. Holm (tidak digambar) ada di antaranya: menolak 3.</p>
      </div>

      <PlotlyChart
        data={fwerFdrData}
        title="Ekspektasi Jumlah False Positive per Metode (20 uji, semua H0 benar)"
        layout={{ yaxis: { title: "Rata-rata false positive" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = rata-rata banyaknya temuan palsu jika eksperimen diulang (semua hipotesis sebenarnya salah).</p>
        <p><strong>Interpretasi:</strong> tanpa koreksi: ~1 temuan palsu per eksperimen (sesuai teori 20×0,05). Bonferroni/Holm menekannya ke ~0,05. BH membiarkan ~0,35 — <em>sengaja</em>, karena ia mengendalikan <em>proporsi</em>, bukan <em>keberadaan</em>. Pilih sesuai harga yang sanggup kamu bayar.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Multiple testing = &ldquo;keberuntungan yang disangka skill&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: 20 analis, 1 &ldquo;bintang&rdquo; — seleksi</summary>
              <p>20 analis backtest strategi acak (tanpa edge). Satu mencetak Sharpe 2,0 (p = 0,02). Rekrut dia?</p>
              <p><strong>Langkah 1</strong> — tanpa koreksi: p = 0,02 &lt; 0,05 → &ldquo;signifikan&rdquo;!<br />
              <strong>Langkah 2</strong> — dengan koreksi (20 analis): P(minimal satu p &lt; 0,05 | semua nol edge) = 1 − 0,95<sup>20</sup> ≈ <strong>64%</strong>.<br />
              <strong>Langkah 3</strong> — Bonferroni: ambang = 0,0025 → p = 0,02 <strong>gagal</strong>. BH: kemungkinan besar juga gagal.<br />
              <strong>Langkah 4</strong> — putusan: jangan rekrut dari <em>satu</em> backtest. Minta <em>out-of-sample</em> / track record live.</p>
              <p>Pelajaran: &ldquo;terbaik dari 20&rdquo; ≠ &ldquo;terbaik&rdquo;. Setiap kompetisi/seleksi (hiring, fund selection, &ldquo;strategi terbaik&rdquo;) = multiple testing terselubung.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Subgroup — &ldquo;obat manjur untuk pria kidal&rdquo;</summary>
              <p>Uji klinis gagal (p = 0,3). Peneliti mengiris 20 subgroup; satu (&ldquo;pria 40–50&rdquo;) p = 0,03. Klaim berhasil?</p>
              <p><strong>Langkah 1</strong> — 20 subgroup × α 5% → ekspektasi false positive = <strong>1</strong>. Satu &ldquo;temuan&rdquo; = tepat ekspektasi noise!<br />
              <strong>Langkah 2</strong> — Holm: p terkecil 0,03 vs ambang 0,05/20 = 0,0025 → gagal.<br />
              <strong>Langkah 3</strong> — yang benar: jadikan <em>hipotesis</em> untuk uji konfirmasi baru (preregistrasi!), bukan kesimpulan.</p>
              <p>Pelajaran: &ldquo;data dredging&rdquo; = jelly bean hijau versi farmasi. Regulator (FDA) menuntut <em>endpoint primer preregistrasi</em> — justru untuk mencegah ini.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Saksikan False Positive Meledak</h2>
      <p>Simulasi 5.000 eksperimen × 20 uji — semuanya H0 benar (tidak ada efek). Hitung seberapa sering &ldquo;temuan signifikan&rdquo; palsu muncul.</p>
      <PyodideLab
        title="Lab 1 — Eksperimen Jelly Bean (Live Python)"
        hint="⚡ Live Python. Coba: ubah M jadi 100. Peluang ≥1 temuan palsu → ~99,4%. Renungkan: paper dengan 100 analisis dan 3 'temuan signifikan' tanpa koreksi = ?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Adu Tiga Metode Koreksi</h2>
      <p>20 uji dengan 5 efek nyata + 15 null. Bandingkan: tanpa koreksi vs Bonferroni vs Holm vs BH — siapa menangkap berapa, siapa memalsukan berapa.</p>
      <PyodideLab
        title="Lab 2 — Bonferroni vs Holm vs BH (Live Python)"
        hint="Coba: ubah true_p jadi efek-efek kecil [0.001, 0.01, 0.02, 0.03, 0.04]. Siapa yang masih menangkap? Itulah harga konservatisme."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Koreksi Mana</h2>

      <div className="decision-card">
        <h3>1. Sedikit uji (m &lt; 10), keputusan final → <strong>Holm</strong></h3>
        <p><strong>Kondisi:</strong> uji klinis dengan 3 endpoint, A/B test dengan 4 metrik primer.</p>
        <p><strong>Kenapa:</strong> FWER terkendali, selalu ≥ Bonferroni dalam power, tanpa asumsi. Tidak ada alasan pakai Bonferroni murni.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;dari 4 metrik, 2 signifikan setelah koreksi Holm&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh ambang tunggal yang simpel dikomunikasikan → <strong>Bonferroni</strong></h3>
        <p><strong>Kondisi:</strong> laporan ke non-teknis / regulator yang butuh aturan &ldquo;satu angka&rdquo;.</p>
        <p><strong>Kenapa:</strong> &ldquo;ambang kami 0,05/20 = 0,0025&rdquo; mudah dijelaskan. Sedikit kurang power dari Holm — harga sebuah kesederhanaan.</p>
        <p><strong>Contoh nyata:</strong> SOP validasi model: &ldquo;semua uji lolos α/m&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>3. Skrining besar (ratusan–ribuan), eksplorasi → <strong>BH (FDR)</strong></h3>
        <p><strong>Kondisi:</strong> 500 kandidat fitur, 1.000 varian strategi, 20.000 gen.</p>
        <p><strong>Kenapa:</strong> FDR 5% berarti dari 100 temuan, ~5 palsu — dapat diterima untuk skrining yang dilanjutkan validasi. Power jauh di atas Holm.</p>
        <p><strong>Contoh nyata:</strong> skrining 800 alpha signal → 40 kandidat untuk backtest mendalam.</p>
      </div>

      <div className="decision-card">
        <h3>4. Uji berurutan / hierarkis (gatekeeping) → <strong>prosedur berurutan khusus</strong></h3>
        <p><strong>Kondisi:</strong> uji primer dulu; uji sekunder hanya jika primer signifikan (umum di uji klinis).</p>
        <p><strong>Kenapa:</strong> struktur hierarki menghemat budget α — tidak perlu koreksi penuh untuk semua. Di luar cakupan lesson ini, tapi ketahui istilahnya: <em>fixed-sequence</em> dan <em>fallback procedure</em>.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;uji revenue dulu; jika signifikan, baru uji retensi&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>5. Analisis eksploratori tanpa hipotesis awal → <strong>anggap temuan sebagai hipotesis, bukan kesimpulan</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;coba-coba&rdquo; 50 segmentasi sampai satu menarik.</p>
        <p><strong>Kenapa:</strong> tidak ada koreksi yang menyelamatkan <em>p-hacking</em> murni. Yang benar: laporkan sebagai <strong>eksploratori</strong>, lalu <strong>replikasi pada data baru</strong> (atau preregistrasi). Koreksi untuk eksplorasi terencana; replikasi untuk penemuan tak terencana.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;temuan ini dari data mining — butuh validasi out-of-sample sebelum diklaim&rdquo;.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Hitung &amp; laporkan m</strong> (jumlah uji) — selalu. Menyembunyikan m = menyembunyikan risiko.</li>
          <li><strong>Konfirmatori → Holm</strong> (FWER). <strong>Eksploratori besar → BH</strong> (FDR).</li>
          <li><strong>Adjusted p-value</strong> dibandingkan langsung dengan α — jangan koreksi dua kali.</li>
          <li>Koreksi tidak menyelamatkan p-hacking — untuk temuan tak terencana, <strong>replikasi</strong> adalah obatnya.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: 50 Varian Strategi Trading</h2>
      <div className="callout">
        <p>Tim quant menguji <strong>50 varian strategi</strong> pada data historis 5 tahun. Tiga varian &ldquo;signifikan&rdquo; (p = 0,01; 0,03; 0,04) dengan Sharpe 1,1–1,4. Tim ingin mengalokasikan modal ke ketiganya.</p>
        <p><strong>Pertanyaan:</strong> (a) Tanpa koreksi, berapa ekspektasi false positive dari 50 uji? (b) Terapkan Bonferroni dan BH (α=5%) — varian mana yang bertahan? (c) Rekomendasi alokasi modal yang defensibel?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Ekspektasi FP = 50 × 0,05 = <strong>2,5</strong>. Tiga &ldquo;temuan&rdquo; ≈ ekspektasi palsu — <strong>sangat mungkin ketiganya noise</strong>. FWER = 1 − 0,95⁵⁰ ≈ 92%.</p>
          <p>(b) <strong>Bonferroni:</strong> ambang = 0,001 — tidak satu pun lolos (0,01 &gt; 0,001). <strong>BH:</strong> urutkan; cek 0,01 ≤ 1×0,05/50 = 0,001? Tidak → k* = 0 → tidak ada yang lolos. <strong>Kesimpulan: tidak ada bukti</strong> untuk satu pun varian.</p>
          <p>(c) <strong>Jangan alokasikan modal</strong> berdasarkan backtest tanpa koreksi ini. Langkah defensibel: (1) akui ketiga &ldquo;temuan&rdquo; konsisten dengan noise; (2) jika tetap penasaran, uji <em>out-of-sample</em> (data yang belum pernah dipakai — bukan mengutak-atik periode sampai &ldquo;lolos&rdquo;); (3) ke depan, tetapkan <strong>protokol multiple testing</strong> sebelum backtest massal (BH untuk skrining + validasi out-of-sample untuk finalis). Pelajaran mahal: <strong>strategi terbaik dari 50 backtest hampir selalu adalah yang paling beruntung, bukan yang paling bagus</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>100 uji, semua H0 benar, α = 5%. Berapa ekspektasi jumlah false positive? Berapa P(minimal satu)?</li>
              <li>p-value terurut: 0,001; 0,01; 0,02; 0,03 (m=4, α=5%). Terapkan Holm — berapa yang ditolak?</li>
              <li>Kapan FDR (BH) <em>lebih tepat</em> dari FWER (Holm)? Beri contoh.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Ekspektasi = 100 × 0,05 = <strong>5</strong>. P(min ≥1) = 1 − 0,95<sup>100</sup> ≈ <strong>99,4%</strong> — false positive hampir pasti!</p>
              <p><strong>2.</strong> Holm: 0,001 &lt; 0,0125 ✓; 0,01 &lt; 0,0167 ✓; 0,02 &lt; 0,025 ✓; 0,03 &lt; 0,05 ✓ → <strong>4 ditolak</strong>! (Bonferroni hanya 1 — lihat power Holm.)</p>
              <p><strong>3.</strong> <strong>Eksplorasi/skrining</strong>: 1.000 kandidat fitur/gen/strategi untuk ditindaklanjuti — rela 5% temuan palsu demi menangkap sinyal. FWER untuk keputusan <em>final</em> (uji klinis, rilis model).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 20 uji independen pada α=5%, semua H0 benar. Peluang ≥1 false positive?"
        options={[
          "5%",
          "1 − 0,95²⁰ ≈ 64%",
          "100%",
          "0,25%",
        ]}
        correct={1}
        explanation="Benar: FWER = 1 − (1−α)ᵐ. Inilah aritmetika di balik jelly bean hijau — dan mengapa 'saya cuma pakai α=5%' tidak lengkap tanpa menyebut m."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Setelah koreksi Bonferroni (m=20), p=0,03 menjadi tidak signifikan. Apa yang terjadi?"
        options={[
          "Datanya berubah",
          "Ambang diperketat ke 0,0025 untuk mengendalikan FWER — p=0,03 tidak cukup kuat untuk 20 uji",
          "Ujinya salah",
          "α diubah jadi 3%",
        ]}
        correct={1}
        explanation="Benar. Datanya sama; yang berubah adalah standar buktinya. Dengan 20 kesempatan, 'p=0,03' tidak lagi luar biasa — ia diharapkan muncul ~1× secara kebetulan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa Holm selalu ≥ Bonferroni dalam power?"
        options={[
          "Karena rumusnya lebih rumit",
          "Karena ambangnya melonggar (α/(m−k+1)) setiap ada penolakan — hipotesis yang terbukti tidak 'memakan' budget α",
          "Karena memakai FDR",
          "Karena mengasumsikan independensi",
        ]}
        correct={1}
        explanation="Benar. Setiap penolakan membebaskan sebagian budget kesalahan untuk hipotesis berikutnya. Jaminan FWER-nya sama dengan Bonferroni — power gratis tanpa harga."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Skrining 1.000 kandidat fitur untuk model. Koreksi paling tepat?"
        options={[
          "Tanpa koreksi — nanti juga ketahuan",
          "Bonferroni — paling aman",
          "BH (FDR) — eksplorasi skala besar; rela 5% temuan palsu demi menangkap sinyal; finalis divalidasi terpisah",
          "Holm — untuk semua kasus",
        ]}
        correct={2}
        explanation="Benar. Bonferroni pada m=1.000 (ambang 0,00005) akan membunuh hampir semua sinyal. FDR mengendalikan proporsi palsu — tepat untuk skrining yang dilanjutkan validasi. Holm/Bonferroni untuk keputusan final, bukan skrining."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Software melaporkan 'adjusted p-value (BH) = 0,04'. Interpretasi?"
        options={[
          "Bandingkan dengan α/m lagi",
          "Sudah dikoreksi — bandingkan langsung dengan α=0,05 → signifikan pada FDR 5%",
          "Tidak valid",
          "Kalikan lagi dengan m",
        ]}
        correct={1}
        explanation="Benar. Adjusted p-value = p-value setelah koreksi — siap dibandingkan dengan α. Mengoreksi dua kali (membandingkan adjusted p dengan α/m) adalah kesalahan ganda yang membuat uji terlalu konservatif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Analis mencoba 50 segmentasi, menemukan 1 yang 'signifikan' (p=0,02), lalu melaporkannya saja. Masalah terbesar?"
        options={[
          "p=0,02 kurang kecil",
          "Seleksi temuan tanpa koreksi/replikasi — ini p-hacking; ekspektasi false positive dari 50 uji ≈ 2,5, jadi temuan tunggal sangat mungkin palsu",
          "Segmentasinya terlalu banyak",
          "Harus pakai α=1%",
        ]}
        correct={1}
        explanation="Benar. Ini jelly bean hijau versi korporat. Koreksi (BH/Holm) atau — lebih baik untuk temuan tak terencana — replikasi pada data baru. Melaporkan 'yang menarik saja' tanpa menyebut 49 lainnya = menyembunyikan m."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>FWER</strong> = <Tex math={String.raw`1-(1-\alpha)^m`} /> — meledak dengan m: 20 uji → 64%, 100 uji → 99%.</li>
          <li><strong>Bonferroni:</strong> tolak jika <Tex math={String.raw`p_i < \alpha/m`} /> — simpel, tanpa asumsi, tapi konservatif untuk m besar.</li>
          <li><strong>Holm:</strong> step-down dengan ambang <Tex math={String.raw`\alpha/(m-k+1)`} /> — selalu ≥ Bonferroni dalam power, FWER sama.</li>
          <li><strong>BH:</strong> kendalikan <strong>FDR</strong> (proporsi temuan yang palsu) — untuk skrining/eksplorasi skala besar.</li>
          <li><strong>FWER</strong> = &ldquo;hampir pasti nol palsu&rdquo; (konfirmatori). <strong>FDR</strong> = &ldquo;≤α dari temuanku palsu&rdquo; (eksploratori).</li>
          <li><strong>Adjusted p-value</strong> dibandingkan langsung dengan α — jangan koreksi dua kali.</li>
          <li><strong>Jangan:</strong> menyembunyikan m; memakai Bonferroni untuk skrining 1.000; mengklaim temuan dari p-hacking tanpa replikasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a27-effect-size" className="btn btn-secondary btn-sm">← A2.7</Link>
        <Link href="/learn/a29-bootstrap" className="btn btn-primary btn-sm">Next: A2.9 →</Link>
      </div>
    </div>
  );
}
