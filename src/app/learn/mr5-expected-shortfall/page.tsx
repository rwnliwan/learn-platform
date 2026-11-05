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

export default function MR5Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // VaR vs ES: dua portofolio dengan VaR 99% SAMA tapi ekor BERBEDA
  const r = rng(55);
  const N = 3000;
  const pnlA: number[] = []; // ekor tipis
  const pnlB: number[] = []; // ekor tebal (skew negatif)
  for (let i = 0; i < N; i++) {
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5;
    pnlA.push(+(u * 5).toFixed(2));
    const tail = r() < 0.02 ? -(10 + r() * 25) : 0;
    pnlB.push(+((u * 4.2) + tail).toFixed(2));
  }
  const sA = [...pnlA].sort((a, b) => a - b);
  const sB = [...pnlB].sort((a, b) => a - b);
  const varA = sA[Math.floor(0.01 * N)], varB = sB[Math.floor(0.01 * N)];
  const esA = sA.slice(0, Math.floor(0.01 * N)).reduce((a, b) => a + b, 0) / Math.floor(0.01 * N);
  const esB = sB.slice(0, Math.floor(0.01 * N)).reduce((a, b) => a + b, 0) / Math.floor(0.01 * N);

  const bins = 36, min = -40, max = 25;
  const mkHist = (arr: number[]) => {
    const c = new Array(bins).fill(0);
    arr.forEach((v) => {
      const b = Math.min(bins - 1, Math.max(0, Math.floor(((v - min) / (max - min)) * bins)));
      c[b]++;
    });
    return c;
  };
  const centers = Array.from({ length: bins }, (_, i) => +((min + (i + 0.5) * (max - min)) / bins).toFixed(1));

  const tailData = [
    { x: centers, y: mkHist(pnlA), type: "bar", name: `Portofolio A (VaR=${varA.toFixed(1)}, ES=${esA.toFixed(1)})`, marker: { color: "#2a7de1" }, opacity: 0.7 },
    { x: centers, y: mkHist(pnlB), type: "bar", name: `Portofolio B (VaR=${varB.toFixed(1)}, ES=${esB.toFixed(1)})`, marker: { color: "#e8a838" }, opacity: 0.7 },
  ];

  const lab1Code = String.raw`import random, math
random.seed(21)

# VaR vs ES: dua portofolio, VaR 99% SAMA, ES BERBEDA JAUH
N = 20_000
# A: normal tipis
pnlA = [random.gauss(0, 5) for _ in range(N)]
# B: normal + lompatan rugi langka tapi dalam (credit-like payoff)
pnlB = [random.gauss(0, 4.2) + (-(10 + random.random() * 25) if random.random() < 0.02 else 0)
        for _ in range(N)]

def var_es(pnl, alpha=0.99):
    s = sorted(pnl)
    k = int((1 - alpha) * N)
    var = -s[k]
    es = -sum(s[:k]) / k
    worst = -min(s)
    return var, es, worst

varA, esA, wA = var_es(pnlA)
varB, esB, wB = var_es(pnlB)
print(f"{'':12s} {'VaR 99%':>10s} {'ES 99%':>10s} {'Terburuk':>10s}  ES/VaR")
print(f"{'Portofolio A':12s} {varA:>10.1f} {esA:>10.1f} {wA:>10.1f}  {esA/varA:.2f}")
print(f"{'Portofolio B':12s} {varB:>10.1f} {esB:>10.1f} {wB:>10.1f}  {esB/varB:.2f}")
print()
print("VaR keduanya mirip -- tapi ES B JAUH lebih besar: ekor B dalam & berbahaya.")
print("Rasio ES/VaR adalah 'detektor ekor': ~1.15 untuk normal, >1.5 = waspadai skew.")
print()
print("Coba: naikkan peluang lompatan 0.02 -> 0.05. Apa yang terjadi pada VaR vs ES?")`;

  const lab2Code = String.raw`import random, math
random.seed(3)

# UJI SUBADDITIVITAS: VaR bisa melanggar, ES tidak pernah.
# Dua obligasi: masing-masing default dgn prob 4%, rugi 100 jika default (independen).
# VaR 95% tiap obligasi = 0 (prob rugi>0 hanya 4% < 5% -> kuantil 95% = 0).
# Tapi portofolio gabungan: prob minimal satu default = 1-0.96^2 = 7.84% > 5%
# -> VaR 95% portofolio = 100 > 0 + 0 = MELANGGAR subadditivitas!

def simulate(n=200_000):
    loss1 = [100 if random.random() < 0.04 else 0 for _ in range(n)]
    loss2 = [100 if random.random() < 0.04 else 0 for _ in range(n)]
    port = [a + b for a, b in zip(loss1, loss2)]
    return loss1, loss2, port

def var_es(losses, alpha=0.95):
    s = sorted(losses, reverse=True)  # kerugian terbesar dulu
    k = int((1 - alpha) * len(s))
    return s[k], sum(s[:k]) / k

l1, l2, p = simulate()
v1, e1 = var_es(l1); v2, e2 = var_es(l2); vp, ep = var_es(p)
print(f"VaR 95% obligasi 1      : {v1}")
print(f"VaR 95% obligasi 2      : {v2}")
print(f"VaR 95% portofolio      : {vp}   <-- LEBIH BESAR dari {v1}+{v2} = {v1+v2}!")
print(f"ES 95% obligasi 1        : {e1:.1f}")
print(f"ES 95% obligasi 2        : {e2:.1f}")
print(f"ES 95% portofolio        : {ep:.1f}  <-- <= {e1+e2:.1f}, subadditif OK")
print()
print("VaR menghukum diversifikasi di sini: menggabung dua aset MENAIKKAN VaR.")
print("ES selalu menghargai diversifikasi: itulah 'koheren'.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR5 — Market Risk Analytics</span>
        <h1 className="display-title">Expected Shortfall:<br />Melihat ke Dalam Ekor yang Disembunyikan VaR</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Portofolio, Satu VaR, Nasib Berbeda</a></li>
          <li><a href="#definisi">Definisi ES: Rata-Rata di Luar Ambang</a></li>
          <li><a href="#koheren">Ukuran Risiko Koheren: Empat Aksioma</a></li>
          <li><a href="#varcacat">Cacat VaR: Contoh Nyata Pelanggaran Subadditivitas</a></li>
          <li><a href="#lab1">🔬 Lab 1: VaR Sama, ES Berbeda — Detektor Ekor</a></li>
          <li><a href="#lab2">🔬 Lab 2: Membuktikan VaR Tidak Koheren</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: ES dalam Praktik — Elicitability, Kalibrasi FRTB, dan 2008</a></li>
          <li><a href="#case">📋 Mini-Case: Memilih Metrik untuk Limit Trading</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan Expected Shortfall sebagai ekspektasi kerugian bersyarat dan menghitungnya dari data.</li>
          <li>Menjelaskan empat aksioma ukuran risiko koheren dan menguji VaR vs ES terhadap masing-masing.</li>
          <li>Mendemonstrasikan pelanggaran subadditivitas VaR dengan contoh konkret — dan menjelaskan mengapa itu berbahaya untuk keputusan diversifikasi.</li>
          <li>Membandingkan ES vs VaR untuk distribusi berekor-tebal dan menafsirkan rasio ES/VaR sebagai &ldquo;detektor ekor&rdquo;.</li>
          <li>Menilai kapan ES wajib dipakai (modal FRTB, limit portofolio skew) dan kapan VaR masih memadai.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dua Portofolio, Satu VaR, Nasib Berbeda</h2>
      <div className="story">
        <p>Komite risiko membandingkan dua desk. <strong>Desk A</strong> (trading saham): VaR 99% = Rp12 miliar. <strong>Desk B</strong> (menjual proteksi kredit): VaR 99% = Rp12 miliar. &ldquo;Risikonya sama,&rdquo; simpul komite. Limit disamakan. Bonus dihitung dengan modal yang sama.</p>
        <p>Setahun kemudian pasar kredit guncang. Desk A rugi Rp15 miliar — sedikit di atas VaR, masih masuk akal. Desk B? <strong>Rugi Rp80 miliar.</strong> Bagaimana mungkin, VaR-nya sama?</p>
        <p>Twist-nya: VaR hanya menandai <em>batas</em> 1% ekor — dan kedua desk memang &ldquo;sama&rdquo; di batas itu. Tapi <strong>bentuk ekornya</strong> beda total: ekor Desk A pendek (rugi di atas VaR hanya sedikit lebih dalam), ekor Desk B <strong>seperti jurang</strong> (sekali jatuh, dalam sekali — itulah sifat menjual proteksi: premi kecil, bencana besar). VaR buta terhadap perbedaan ini. <strong>Expected Shortfall tidak.</strong></p>
        <p>Lesson ini tentang metrik yang melihat ke dalam ekor — dan tentang sifat matematika (&ldquo;koheren&rdquo;) yang membuat ES layak menjadi fondasi modal Basel/FRTB.</p>
      </div>

      <h2 id="definisi">Definisi ES: Rata-Rata di Luar Ambang</h2>
      <p><strong>Definisi.</strong> <strong>Expected Shortfall (ES)</strong> — juga disebut Conditional VaR — adalah <strong>ekspektasi kerugian dengan syarat kerugian melebihi VaR</strong>:</p>
      <Tex math={String.raw`\text{ES}_\alpha = E[\,L \mid L > \text{VaR}_\alpha\,]`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`L`} />: kerugian (positif = rugi)</li>
        <li><Tex math={String.raw`\text{VaR}_\alpha`} />: ambang VaR di tingkat kepercayaan α (dari MR3)</li>
        <li><Tex math={String.raw`E[\cdot \mid \cdot]`} />: ekspektasi (rata-rata) <em>bersyarat</em> — hanya rata-ratakan kejadian di mana syarat terpenuhi</li>
      </ul>
      <p><strong>Versi diskrit (cara hitung dari data):</strong> urutkan kerugian dari terbesar, ambil rata-rata dari <Tex math={String.raw`(1-\alpha)`} /> bagian terburuk:</p>
      <Tex math={String.raw`\text{ES}_{99\%} = \text{rata-rata dari 1\% kerugian terbesar}`} block />
      <p><strong>Cara baca:</strong> &ldquo;ES 99% = Rp28 miliar&rdquo; artinya: <em>jika kita masuk ke 1% hari terburuk, rata-rata kerugiannya Rp28 miliar</em>. Ini menjawab persis pertanyaan yang VaR hindari: <strong>seberapa dalam jurangnya?</strong></p>
      <p><strong>Selalu benar:</strong> <Tex math={String.raw`\text{ES}_\alpha \ge \text{VaR}_\alpha`} /> — rata-rata ekor tidak mungkin lebih kecil dari ambang ekornya. Selisih keduanya mengukur <strong>ketebalan ekor</strong>.</p>

      <PlotlyChart
        data={tailData}
        title="VaR Sama, Ekor Berbeda: Portofolio A (tipis) vs B (tebal)"
        layout={{ barmode: "overlay", xaxis: { title: "P&L harian (Rp juta)" }, yaxis: { title: "Frekuensi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua histogram P&amp;L yang dioverlay. Biru = Portofolio A (ekor tipis), kuning = Portofolio B (ekor tebal, skew negatif). Keduanya punya VaR 99% yang mirip.</p>
        <p><strong>Interpretasi:</strong> VaR keduanya ≈ sama — komite risiko yang hanya melihat VaR akan menyimpulkan &ldquo;risikonya sama&rdquo;. Tapi perhatikan <strong>ekor kiri kuning</strong>: ada batang-batang jauh di kiri (rugi −20 hingga −35) yang tidak dimiliki biru. ES menangkap ini: ES_B jauh lebih besar dari ES_A. <strong>Inilah visual dari &ldquo;VaR buta ekor&rdquo;.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rasio <strong>ES/VaR</strong> adalah &ldquo;detektor ekor&rdquo; yang murah. Untuk distribusi normal, ES₉₉/VaR₉₉ ≈ 1,15. Jika rasiomu 1,5–2+, ekormu tebal/skew — VaR sendirian menipumu. Selalu hitung keduanya; selisihnya adalah informasi, bukan redundansi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ES hanyalah VaR yang lebih konservatif.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ES bukan &ldquo;VaR + margin&rdquo; — ia mengukur <strong>hal yang berbeda</strong> (kedalaman ekor vs frekuensi terlampaui). Untuk distribusi simetris tipis, ES ≈ VaR × 1,15 (hampir sama). Untuk distribusi skew seperti penjualan proteksi, ES bisa <strong>berkali-kali lipat</strong> VaR. Menganggap ES = &ldquo;VaR konservatif&rdquo; melewatkan seluruh poinnya.</p>
      </div>

      <h2 id="koheren">Ukuran Risiko Koheren: Empat Aksioma</h2>
      <p><strong>Definisi.</strong> Artzner dkk. (1999) mendefinisikan ukuran risiko <strong>koheren</strong> — sifat matematika yang <em>seharusnya</em> dimiliki setiap metrik risiko yang waras. Ada empat aksioma untuk ukuran risiko <Tex math={String.raw`\rho`} /> (ρ(X) = modal/risiko posisi X):</p>
      <ol>
        <li><strong>Monotonicity:</strong> jika <Tex math={String.raw`X_1 \le X_2`} /> selalu (X₁ tidak pernah lebih baik dari X₂), maka <Tex math={String.raw`\rho(X_1) \ge \rho(X_2)`} />. <em>Posisi yang selalu lebih buruk → risiko lebih besar.</em> (Aksioma kewarasan.)</li>
        <li><strong>Subadditivitas:</strong> <Tex math={String.raw`\rho(X_1 + X_2) \le \rho(X_1) + \rho(X_2)`} />. <em>Risiko gabungan ≤ jumlah risiko sendiri-sendiri.</em> <strong>Diversifikasi tidak boleh dihukum.</strong></li>
        <li><strong>Positive homogeneity:</strong> <Tex math={String.raw`\rho(cX) = c\,\rho(X)`} /> untuk <Tex math={String.raw`c > 0`} />. <em>Skala posisi 2× → risiko 2×.</em></li>
        <li><strong>Translation invariance:</strong> <Tex math={String.raw`\rho(X + c) = \rho(X) - c`} />. <em>Tambah kas Rp_c_ → risiko turun Rp_c_.</em> (Inilah yang membuat ρ bisa dibaca sebagai &ldquo;kebutuhan modal&rdquo;.)</li>
      </ol>
      <p><strong>Hasil utama:</strong> <strong>ES memenuhi keempatnya</strong> (koheren ✔). <strong>VaR gagal di subadditivitas</strong> (✘) — dan kegagalan itu bukan teori abstrak, melainkan jebakan praktis (lihat bawah).</p>
      <p><strong>Kenapa subadditivitas adalah aksioma terpenting?</strong> Karena tanpanya, metrik bisa berkata: &ldquo;menggabungkan dua portofolio yang terdiversifikasi <em>menaikkan</em> risiko.&rdquo; Itu bukan cuma aneh secara matematika — itu memberi <strong>insentif yang salah</strong>: menghukum diversifikasi, menghargai konsentrasi. Regulator yang memakai metrik non-koheren untuk modal sedang memberi insentif berbahaya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pikirkan empat aksioma sebagai &ldquo;SIM untuk metrik risiko&rdquo;. Monotonicity = bisa bedakan baik vs buruk. Subadditivitas = tidak menghukum diversifikasi. Homogeneity = skala masuk akal. Translation invariance = bisa diterjemahkan jadi kebutuhan modal. VaR <strong>gagal ujian SIM</strong> di tikungan subadditivitas — makanya Basel beralih ke ES di FRTB (MR16).</p>
      </div>

      <h2 id="varcacat">Cacat VaR: Contoh Nyata Pelanggaran Subadditivitas</h2>
      <p>Dua obligasi, masing-masing: default dengan probabilitas <strong>4%</strong>, rugi 100 jika default, 0 jika tidak. Independen.</p>
      <p><strong>VaR 95% tiap obligasi:</strong> P(rugi &gt; 0) = 4% &lt; 5% → kuantil 95% kerugian = <strong>0</strong>. VaR₁ = VaR₂ = 0.</p>
      <p><strong>VaR 95% portofolio gabungan:</strong> P(minimal satu default) = 1 − 0,96² = <strong>7,84%</strong> &gt; 5% → kuantil 95% = <strong>100</strong>.</p>
      <Tex math={String.raw`\text{VaR}(X_1+X_2) = 100 \;\;>\;\; 0 + 0 = \text{VaR}(X_1)+\text{VaR}(X_2) \quad \boldsymbol{\times}`} block />
      <p><strong>Subadditivitas dilanggar.</strong> Menurut VaR, menggabungkan dua obligasi terdiversifikasi <em>menaikkan</em> risiko dari 0 menjadi 100. Saran implisit VaR: &ldquo;jangan diversifikasi&rdquo; — saran yang berbahaya.</p>
      <p><strong>ES tidak pernah begini.</strong> ES 95% tiap obligasi = 100 (rata-rata dari 5% terburuk: 4% × 100 / 5% = 80... tepatnya ekspektasi bersyarat), dan ES gabungan ≤ jumlahnya. Selalu. Terbukti matematis. (Buktikan sendiri di Lab 2.)</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pelanggaran subadditivitas VaR cuma kasus mainan, tidak terjadi di dunia nyata.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ia terjadi tepat di <strong>portofolio kredit/eksotik</strong> — obligasi high-yield, tranche sekuritisasi, portofolio asuransi — di mana payoff-nya <em>lompatan</em> (jump) bukan kontinu. Justru di aset-aset inilah VaR paling sering dipakai untuk limit. Jika limit VaR menghukum diversifikasi, desk akan <strong>berkonsentrasi</strong> untuk &ldquo;menghemat&rdquo; VaR — persis perilaku yang ingin dicegah.</p>
      </div>

      <details className="worked">
        <summary>📐 Contoh hitung ES dari data (klik untuk buka)</summary>
        <p>10 hari P&amp;L (juta): +5, −2, +8, −30, +3, −1, +6, −45, +2, −4.</p>
        <p><strong>Langkah 1</strong> — urutkan kerugian terbesar: 45, 30, 4, 2, 1, ...</p>
        <p><strong>Langkah 2</strong> — VaR 80% = kuantil 20% = <strong>4</strong> (20% hari rugi &gt; 4).</p>
        <p><strong>Langkah 3</strong> — ES 80% = rata-rata 20% terburuk = (45 + 30)/2 = <strong>37,5</strong>.</p>
        <p>VaR bilang &ldquo;ambang 4&rdquo;, ES bilang &ldquo;tapi kalau jebol, rata-rata 37,5&rdquo;. Rasio 9× — detektor ekor berteriak: distribusi ini sangat skew!</p>
      </details>

      <h2 id="lab1">🔬 Lab 1: VaR Sama, ES Berbeda — Detektor Ekor</h2>
      <p>Ubah peluang lompatan (0,02 → 0,05) dan kedalamannya. Amati: VaR bergerak sedikit, ES bergerak banyak. Metrik mana yang &ldquo;merasakan&rdquo; ekor?</p>
      <PyodideLab
        title="Lab 1 — VaR vs ES pada Distribusi Berekor"
        hint="Coba peluang 0.02 → 0.10 dan kedalaman ×2. Lalu hitung rasio ES/VaR — di atas 1.5? 2? Itulah saat VaR sendirian menjadi berbahaya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Membuktikan VaR Tidak Koheren</h2>
      <p>Ubah probabilitas default (0,04 → 0,02 atau 0,10). Pada nilai berapa pelanggaran subadditivitas VaR muncul/hilang? Mengapa ES kebal?</p>
      <PyodideLab
        title="Lab 2 — Uji Subadditivitas: VaR vs ES"
        hint="Coba default prob 0.10: P(minimal satu default) = 19% > 5% → pelanggaran makin parah. ES tetap subadditif selalu — itu teorema, bukan kebetulan."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Kebutuhan modal regulasi (FRTB) → <strong>ES 97,5%</strong></h3>
        <p><strong>Kondisi:</strong> perhitungan capital charge market risk di bawah FRTB IMA.</p>
        <p><strong>Alasan:</strong> regulator memilih ES karena koheren + menangkap tail risk. Bukan pilihan — kewajiban (MR16).</p>
      </div>

      <div className="decision-card">
        <h3>2. Portofolio skew / berekor tebal (kredit, short-vol, eksotik) → <strong>ES sebagai metrik utama</strong></h3>
        <p><strong>Kondisi:</strong> rasio ES/VaR &gt; 1,5; payoff lompatan.</p>
        <p><strong>Alasan:</strong> VaR buta terhadap kedalaman ekor — persis di portofolio seperti inilah bencana bersembunyi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Monitoring harian / limit operasional sederhana → <strong>VaR masih OK (dengan backtest)</strong></h3>
        <p><strong>Kondisi:</strong> portofolio linear, distribusi tidak terlalu skew; butuh angka cepat yang mudah di-backtest.</p>
        <p><strong>Alasan:</strong> VaR lebih mudah di-backtest (hitung pelanggaran vs ekspektasi — MR6); ES sulit di-backtest langsung (butuh elisitabilitas — topik riset aktif). Praktik terbaik: <strong>laporkan keduanya</strong>.</p>
      </div>

      <div className="decision-card">
        <h3>4. Alokasi modal antar unit bisnis → <strong>ES (koheren)</strong></h3>
        <p><strong>Kondisi:</strong> pembagian capital charge yang harus aditif dan tidak menghukum diversifikasi.</p>
        <p><strong>Alasan:</strong> hanya metrik koheren yang memberi insentif benar. Alokasi berbasis VaR bisa menghukum unit yang justru mendiversifikasi.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Selalu hitung ES bersama VaR</strong> — selisihnya adalah informasi ekor, bukan redundansi.</li>
          <li><strong>Rasio ES/VaR &gt; 1,5</strong> → waspadai skew; jangan pakai VaR sendirian untuk limit.</li>
          <li>Untuk <strong>modal &amp; alokasi</strong>: ES (koheren). Untuk <strong>backtest harian</strong>: VaR (teruji).</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: ES dalam Praktik — Elicitability, Kalibrasi FRTB, dan 2008</h2>
      <p>ES menang secara teori (koheren). Tapi praktiknya punya tiga pertanyaan sulit: <strong>(1)</strong> mengapa ES lebih susah di-backtest daripada VaR? <strong>(2)</strong> mengapa FRTB memilih 97,5% — angka yang terdengar acak? <strong>(3)</strong> apa yang akan ditunjukkan ES pada 2008 seandainya dipakai? Ketiganya dijawab di sini.</p>

      <h3>Masalah elicitability: mengapa ES susah di-backtest</h3>
      <p>VaR mudah di-backtest: tiap hari catat apakah kerugian melebihi VaR (ya/tidak) — lalu uji apakah frekuensi pelampauan ≈ 1%. Ini bekerja karena VaR adalah <strong>kuantil</strong>, dan kuantil punya sifat <strong>elicitable</strong>: ada fungsi skor yang minimumnya tepat di kuantil benar, sehingga kamu bisa memverifikasi estimasi dari data.</p>
      <p>ES <strong>tidak elicitable sendirian</strong> (Gneiting, 2011): tidak ada fungsi skor yang memverifikasi ES murni dari data observasi. Intuisinya: ES adalah <em>rata-rata dari ekor yang jarang teramati</em> — dengan 250 hari data dan 99%, ekor hanya berisi ~2–3 observasi. Rata-rata dari 3 titik data sangat berisik; dua model dengan ES &ldquo;benar&rdquo; yang sama bisa memberi backtest yang berbeda jauh hanya karena <em>satu</em> observasi ekstrem jatuh di dalam atau luar sampel.</p>
      <p><strong>Solusi praktik (dan FRTB):</strong> ES <em>bersama</em> VaR pada level yang sama <strong>jointly elicitable</strong> (Fissler &amp; Ziegel, 2016). Artinya: backtest pasangan (VaR 97,5%, ES 97,5%) sekaligus — VaR memberi jangkar frekuensi, ES memberi kedalaman. Inilah alasan FRTB tetap mewajibkan <strong>backtesting VaR 99%/97,5%</strong> (MR6) meski modal dihitung dari ES: VaR adalah &ldquo;alat ukur yang bisa dikalibrasi&rdquo;, ES adalah &ldquo;angka yang dipakai untuk modal&rdquo;. Keduanya dibutuhkan — seperti jam dan penggaris untuk pekerjaan berbeda.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ES menggantikan VaR sepenuhnya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> FRTB memakai ES untuk <strong>modal</strong> tetapi tetap memakai VaR untuk <strong>backtesting</strong> (traffic light, MR6). VaR tidak &ldquo;mati&rdquo; — ia turun pangkat dari raja menjadi inspektur. Analis yang membuang VaR mentah-mentah kehilangan alat validasi terbaiknya; analis yang hanya memakai VaR kehilangan kedalaman ekor. Pasangan ini saling melengkapi, bukan saling menggantikan.</p>
      </div>

      <h3>Mengapa 97,5%? Kalibrasi yang disengaja</h3>
      <p>Angka 97,5% terlihat acak, tapi dipilih dengan presisi. Di bawah <strong>distribusi normal</strong>, ES 97,5% ≈ VaR 99%:</p>
      <Tex math={String.raw`\text{ES}_{97{,}5\%}^{\text{normal}} = \sigma \cdot \frac{\phi(\Phi^{-1}(0{,}975))}{1 - 0{,}975} \approx 2{,}34\,\sigma \quad \text{vs} \quad \text{VaR}_{99\%} = 2{,}33\,\sigma`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\phi`} /> = densitas normal standar; <Tex math={String.raw`\Phi^{-1}`} /> = kuantil normal. Hasilnya: 2,34σ vs 2,33σ — <strong>nyaris identik</strong>.</p>
      <p>Ini disengaja: regulator ingin transisi VaR 99% → ES <strong>tidak mengubah</strong> kebutuhan modal untuk portofolio &ldquo;normal&rdquo; (menghindari guncangan modal mendadak di seluruh industri), tetapi <strong>menaikkan</strong> modal untuk portofolio berekor tebal — tepat di tempat risikonya memang lebih besar. Kalibrasi ini adalah kompromi politik-teknis yang elegan: <em>bank dengan risiko biasa tidak dihukum; bank dengan risiko ekor membayar sesuai risikonya</em>.</p>
      <p><strong>Tapi ada penyesuaian kedua:</strong> FRTB tidak memakai ES 97,5% 10-hari mentah — ia memakai <strong>liquidity-adjusted ES</strong> dengan horizon likuiditas per faktor risiko (10–120 hari, MR16). Rumusnya:</p>
      <Tex math={String.raw`\text{ES} = \sqrt{\text{ES}_1^2 + \sum_{j \ge 2}\left(\text{ES}_j \sqrt{\tfrac{LH_j - LH_{j-1}}{10}}\right)^2}`} block />
      <p><strong>Artinya:</strong> ES dihitung per <em>bucket likuiditas</em> <Tex math={String.raw`j`} /> (makin illiquid → horizon <Tex math={String.raw`LH_j`} /> makin panjang), lalu diagregasi dengan akar jumlah kuadrat. Faktor risiko yang butuh 120 hari untuk dilikuidasi tanpa diskon besar (misal sekuritisasi eksotik) mendapat bobot jauh lebih besar daripada ekuitas liquid (10 hari). Inilah cara FRTB menjawab pelajaran LTCM/2008: <strong>risiko = seberapa besar rugi × seberapa lama kamu terjebak di dalamnya</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: ES 97,5% vs VaR 99% pada distribusi berekor tebal (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Dua portofolio, masing-masing Rp1 triliun. A: return normal, vol harian 1%. B: sama, tapi 1% hari terburuknya berisi crash −8% (ekor tebal).</p>
        <p><strong>Langkah 1 — Portofolio A (normal):</strong> VaR 99% = 2,33 × 1% × 1 T = <strong>Rp23,3 M</strong>. ES 97,5% = 2,34 × 1% × 1 T = <strong>Rp23,4 M</strong>. Nyaris sama — sesuai kalibrasi.</p>
        <p><strong>Langkah 2 — Portofolio B (ekor tebal):</strong> VaR 99% ≈ <strong>Rp23,3 M</strong> juga! (Kuantil 1% belum menyentuh crash −8% jika crash tepat di 1%.) Tapi ES 97,5% = rata-rata 2,5% terburuk — yang <em>termasuk</em> crash −8% — ≈ <strong>Rp45 M</strong>, hampir <strong>2×</strong> VaR.</p>
        <p><strong>Angka ini artinya:</strong> VaR <strong>buta</strong> terhadap perbedaan A dan B — keduanya &ldquo;Rp23,3 M&rdquo;. ES membedakan: B membayar modal hampir 2×. Inilah tepatnya mengapa 2008 terjadi di bawah rezim VaR: seluruh sistem keuangan adalah &ldquo;Portofolio B&rdquo; yang diukur seolah &ldquo;Portofolio A&rdquo;.</p>
      </details>

      <h3>Seandainya 2008 diukur dengan ES</h3>
      <p>Simulasi historis sederhana: portofolio sekuritisasi pra-2008. VaR 99%/10-hari dari data 2005–2007 (tenang): kecil — spread sempit, volatilitas rendah. ES 97,5% dari data yang sama: <strong>juga kecil</strong> — karena ekornya belum berisi krisis. Pelajaran jujurnya: <strong>ES bukan kristal ajaib</strong>; ia tetap sebagus datanya.</p>
      <p>Yang <em>akan</em> berbeda: (1) <strong>Stressed ES</strong> (padanan sVaR di Basel 2.5) memakai jendela krisis — langsung menunjukkan angka besar; (2) <strong>liquidity horizon</strong> FRTB memberi bobot 120-hari ke sekuritisasi — mengalikan ES beberapa kali lipat; (3) ES memaksa pertanyaan &ldquo;seberapa dalam jika jebol&rdquo; — pertanyaan yang VaR bahkan tidak mengajukan. Kombinasi ketiganya akan membuat direksi 2007 melihat angka yang <strong>tidak bisa diabaikan</strong>, bukan VaR hijau yang menidurkan.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan kalimat ini untuk wawancara/rapat: <em>&ldquo;VaR menjawab seberapa sering kita terluka; ES menjawab seberapa parah lukanya; stressed ES menjawab seberapa parah jika luka terburuk dalam sejarah terulang.&rdquo;</em> Tiga lapis pertanyaan, tiga lapis pertahanan. Bank yang hanya punya lapis pertama sedang bertarung dengan satu lapis baju zirah.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: ES historis dengan interpolasi ekor (klik untuk buka)</summary>
        <p><strong>Data:</strong> 250 hari P&amp;L (Rp jt), 5 terburuk: −120, −85, −60, −45, −30. Hitung ES 99% dan ES 97,5%.</p>
        <p><strong>ES 99%:</strong> 1% × 250 = 2,5 observasi. Praktik umum: rata-rata 3 terburuk (konservatif) = (120+85+60)/3 = <strong>Rp88,3 jt</strong>. (Interpolasi presisi: 2 penuh + 0,5× observasi ke-3 = (120+85+0,5×60)/2,5 = <strong>Rp94 jt</strong>.)</p>
        <p><strong>ES 97,5%:</strong> 2,5% × 250 = 6,25 → rata-rata 6 terburuk ≈ (120+85+60+45+30+28)/6 ≈ <strong>Rp61,3 jt</strong> (asumsi terburuk ke-6 = −28).</p>
        <p><strong>Bandingkan dengan VaR 99%</strong> = −60 (kuantil ke-2/3): ES 99% (Rp88–94 jt) <strong>47–57% lebih besar</strong> — premi ekor yang VaR sembunyikan.</p>
        <p><strong>Peringatan jujur:</strong> ES 99% dari 250 hari = rata-rata <strong>2–3 angka</strong> — sangat berisik! Tambah/kurang satu observasi (−120 hilang) → ES jatuh ke Rp68 jt (−28%). Inilah <strong>akar masalah elicitability</strong>: ES butuh <em>banyak</em> data ekor untuk stabil. Praktik: minimum 500–1000 hari, atau lengkapi dengan <strong>EVT (Extreme Value Theory)</strong> untuk memodelkan ekor secara parametrik. Angka ES dari data sedikit = <strong>presisi palsu</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Data kerugian harian (Rp jt): 5, 12, 3, 40, 8, 2, 25, 6, 60, 4. Hitung VaR 80% dan ES 80%. Berapa rasio ES/VaR, dan apa artinya? (klik untuk pembahasan)</summary>
        <p>Urutkan menurun: 60, 40, 25, 12, 8, 6, 5, 4, 3, 2. <strong>VaR 80%</strong> = kerugian yang dilampaui 20% waktu = observasi ke-2 = <strong>40</strong>. <strong>ES 80%</strong> = rata-rata 20% terburuk = (60+40)/2 = <strong>50</strong>.</p>
        <p><strong>Rasio = 50/40 = 1,25</strong> — di atas rasio normal-teoritis (~1,15 untuk 99%; untuk 80% teoritis ~1,4 — jadi 1,25 sebenarnya <em>jinak</em>). Interpretasi: ekor tidak terlalu tebal vs normal. Rasio jauh di atas teoritis (misal 2–3×) = alarm ekor tebal.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Jelaskan mengapa FRTB memakai ES 97,5% untuk modal TETAPI VaR 99%/97,5% untuk backtesting. (klik untuk pembahasan)</summary>
        <p><strong>ES untuk modal:</strong> koheren (subadditif — tidak menghukum diversifikasi), menangkap kedalaman ekor, dan 97,5% dikalibrasi ≈ VaR 99% di bawah normal (transisi mulus, hanya menghukum ekor tebal).</p>
        <p><strong>VaR untuk backtest:</strong> ES <em>tidak elicitable sendirian</em> — tidak bisa diverifikasi murni dari data (ekor 2,5% dari 250 hari = ~6 observasi, terlalu berisik). VaR adalah kuantil yang <em>bisa</em> diuji (hitung pelanggaran). Pasangannya jointly elicitable: VaR = jangkar frekuensi, ES = kedalaman. <strong>VaR = inspektur, ES = raja.</strong></p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Portofolio A dan B punya VaR 99% identik Rp23,3 M, tapi ES 97,5% A = Rp23,4 M dan B = Rp45 M. Jika kamu risk manager dengan satu slot lindung nilai (biaya sama), mana yang dilindungi? Mengapa? (klik untuk pembahasan)</summary>
        <p><strong>Lindungi B.</strong> VaR buta terhadap perbedaan keduanya — justru di sinilah jebakannya. ES menunjukkan B menyimpan risiko bencana ~2× lipat di ekornya (crash −8% yang tidak tertangkap kuantil 1%). Prinsip: <strong>alokasikan perlindungan ke ekor terdalam, bukan ke ambang tertinggi</strong>. Inilah keputusan yang tidak bisa dibuat dengan VaR saja — dan alasan ES ada.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Memilih Metrik untuk Limit Trading</h2>
      <div className="callout">
        <p>Komite risiko menetapkan limit untuk dua desk baru. Data simulasi setahun (250 hari):</p>
        <ul>
          <li><strong>Desk P (prop trading saham):</strong> VaR 99% = Rp10 M, ES 99% = Rp12 M (rasio 1,2)</li>
          <li><strong>Desk Q (menjual CDS proteksi):</strong> VaR 99% = Rp10 M, ES 99% = Rp31 M (rasio 3,1)</li>
          <li>Kerugian terburuk setahun: P = Rp14 M, Q = Rp58 M</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Jika limit disamakan berbasis VaR, apa risikonya? (b) Rancang skema limit yang adil untuk keduanya. (c) Bagaimana backtesting (MR6) berperan untuk tiap desk?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Limit VaR yang sama = subsidi silang risiko.</strong> Desk Q mengambil tail risk 3× lipat dengan &ldquo;harga&rdquo; limit yang sama — insentif untuk memburu premi dengan menjual proteksi (carry kecil, bencana besar). Inilah moral hazard yang diciptakan metrik buta-ekor.</p>
          <p>(b) <strong>Skema adil:</strong> limit berbasis ES (misal ES ≤ Rp15 M untuk keduanya → Desk Q harus memperkecil posisi ~2×), atau limit VaR + <strong>batas rasio ES/VaR</strong> (misal ≤ 1,5 — memaksa desk Q mengubah struktur payoff, bukan cuma ukuran). Tambahan: stress limit eksplisit untuk skenario &ldquo;spread melebar 500 bp&rdquo; (MR7).</p>
          <p>(c) <strong>Backtest VaR</strong> (hitung pelanggaran) bekerja untuk keduanya — tapi untuk Desk Q, pelanggaran jarang (ekor jarang tersentuh) sehingga backtest <strong>lolos palsu</strong> di masa tenang. Untuk ES tidak ada backtest langsung yang sederhana — praktiknya: backtest VaR di <strong>beberapa tingkat kepercayaan</strong> (95%, 97,5%, 99%) untuk &ldquo;memindai&rdquo; ekor, bukan cuma satu titik.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. ES 99% = Rp28 M. Artinya?"
        options={[
          "Kerugian maksimal Rp28 M",
          "Jika masuk 1% hari terburuk, rata-rata kerugiannya Rp28 M",
          "Ada 99% peluang rugi tepat Rp28 M",
          "Sama dengan VaR 99%",
        ]}
        correct={1}
        explanation="Benar. ES = ekspektasi bersyarat di luar ambang VaR. Ia menjawab 'seberapa dalam jika VaR terlampaui' — pertanyaan yang VaR hindari."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Aksioma koherensi yang DILANGGAR VaR?"
        options={[
          "Monotonicity",
          "Subadditivitas — VaR gabungan bisa melebihi jumlah VaR sendiri-sendiri, menghukum diversifikasi",
          "Positive homogeneity",
          "Translation invariance",
        ]}
        correct={1}
        explanation="Benar. Contoh dua obligasi: VaR₁+VaR₂ = 0 tapi VaR gabungan = 100. Satu-satunya aksioma yang gagal pada VaR — dan justru yang paling penting untuk insentif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Rasio ES₉₉/VaR₉₉ portofoliomu = 2,8. Kesimpulan?"
        options={[
          "Normal — tidak ada masalah",
          "Ekor sangat tebal/skew — VaR sendirian berbahaya; pakai ES untuk limit dan selidiki sumber skew-nya",
          "Data salah hitung",
          "Kurangi VaR-nya",
        ]}
        correct={1}
        explanation="Benar. Normal ≈ 1,15. Rasio 2,8 = detektor ekor berteriak — ada payoff lompatan/skew (seperti menjual proteksi). Jangan pakai VaR sendirian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa FRTB memilih ES 97,5% (bukan VaR 99%) untuk modal?"
        options={[
          "Supaya angkanya lebih kecil",
          "ES koheren (tidak menghukum diversifikasi) dan menangkap tail risk — dua sifat yang dibutuhkan untuk modal yang memberi insentif benar",
          "VaR terlalu sulit dihitung",
          "Supaya bank terlihat aman",
        ]}
        correct={1}
        explanation="Benar. Pilihan regulator bukan kosmetik: modal berbasis metrik non-koheren memberi insentif konsentrasi. ES 97,5% ≈ VaR 99% untuk normal, tapi jauh lebih informatif untuk ekor tebal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk monitoring harian operasional, VaR masih dipakai walau tidak koheren. Mengapa?"
        options={[
          "Karena lebih akurat dari ES",
          "Karena VaR mudah di-backtest (hitung pelanggaran vs ekspektasi); ES sulit di-backtest langsung",
          "Karena regulator melarang ES harian",
          "Karena ES tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar. Backtest VaR sederhana: bandingkan jumlah pelanggaran aktual vs ekspektasi (1%). ES butuh uji yang lebih kompleks (elisitabilitas). Praktik terbaik: laporkan keduanya — VaR untuk backtest, ES untuk kedalaman."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Desk menjual proteksi kredit (premi kecil, rugi besar saat default). Metrik limit yang TEPAT?"
        options={[
          "VaR 99% saja — sudah standar",
          "ES (atau VaR + batas rasio ES/VaR + stress limit skenario spread) — payoff skew tidak tertangkap VaR",
          "Tidak perlu limit — preminya stabil",
          "Volatilitas saja",
        ]}
        correct={1}
        explanation="Benar. Payoff 'terima sedikit, rugi besar' adalah kasus klasik buta-ekor VaR. Kombinasi ES + batas rasio + stress skenario memaksa desk membayar 'harga' yang benar untuk tail risk."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ES:</strong> <Tex math={String.raw`\text{ES}_\alpha = E[L \mid L > \text{VaR}_\alpha]`} /> — rata-rata kerugian di luar ambang VaR; selalu ≥ VaR.</li>
          <li><strong>Koheren</strong> = 4 aksioma (monotonicity, subadditivitas, homogeneity, translation invariance). ES lolos semua; VaR gagal subadditivitas.</li>
          <li><strong>VaR bisa menghukum diversifikasi</strong> (contoh dua obligasi) — insentif berbahaya untuk limit/modal.</li>
          <li><strong>Rasio ES/VaR</strong> = detektor ekor murah: ~1,15 normal; &gt;1,5 waspada; &gt;2 bahaya.</li>
          <li><strong>FRTB</strong> memakai ES 97,5% untuk modal — justru karena koheren + menangkap tail.</li>
          <li>Praktik: <strong>laporkan keduanya</strong> — VaR untuk backtest harian, ES untuk kedalaman ekor &amp; alokasi modal.</li>
          <li>Kapan TIDAK cukup ES: ES tetap berbasis model/distribusi — untuk kejadian unprecedented tetap butuh stress test (MR7).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr4-var-lanjut" className="btn btn-secondary btn-sm">← MR4</Link>
        <Link href="/learn/mr6-backtesting" className="btn btn-primary btn-sm">Next: MR6 →</Link>
      </div>
    </div>
  );
}
