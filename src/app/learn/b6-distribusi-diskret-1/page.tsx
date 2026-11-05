import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B6DistribusiDiskret1Page() {
  const chart1 = [{"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "y": [0.1074, 0.2684, 0.302, 0.2013, 0.0881, 0.0264, 0.0055, 0.0008, 0.0001, 0.0, 0.0], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], "textposition": "outside"}];
  const chart2 = [{"x": ["p=0.1", "p=0.3", "p=0.5", "p=0.7", "p=0.9"], "y": [0.09, 0.21, 0.25, 0.21, 0.09], "type": "bar", "marker": {"color": ["#94a3b8", "#2a7de1", "#e8a838", "#2a7de1", "#94a3b8"]}, "text": ["0,09", "0,21", "0,25", "0,21", "0,09"], "textposition": "outside"}];
  const lab1Code = String.raw`import math

def binom_pmf(n, p, k):
    return math.comb(n, k) * (p**k) * ((1-p)**(n-k))

def cetak(n, p):
    print(f"Binomial(n={n}, p={p}): E={n*p:.1f}, SD={(n*p*(1-p))**0.5:.1f}")
    maks = max(binom_pmf(n, p, k) for k in range(n+1))
    for k in range(n+1):
        pk = binom_pmf(n, p, k)
        bar = "#" * int(40 * pk / maks)
        print(f"k={k:>2}  {pk:.4f} {bar}")
    print()

cetak(10, 0.2)
# Coba: cetak(10, 0.5) -> simetris!
# Coba: cetak(10, 0.8) -> miring kiri (cerminan p=0.2)
# Coba: cetak(100, 0.05) -> mirip Poisson? (bandingkan di B6.2)`;
  const lab2Code = String.raw`import math

def binom_sf(n, p, k):
    """P(X >= k) = 1 - P(X <= k-1)""" 
    return 1 - sum(math.comb(n, j)*(p**j)*((1-p)**(n-j)) for j in range(k))

n, p = 1000, 0.05
print(f"E[X]={n*p}, SD={(n*p*(1-p))**0.5:.1f}")
for k in [55, 60, 65, 70, 80]:
    print(f"P(X >= {k}) = {binom_sf(n, p, k):.4%}")
print()
print("P(X>=70) sangat kecil -> 70 gagal BUKAN noise: PD naik / korelasi muncul.")
print("Coba: n=100, p=0.05, k=10. (sampel kecil -> ekor lebih tebal relatif)")`;
  const quizData = [{"question": "X ~ Bernoulli(0,05). E[X] dan Var(X)?", "options": ["0,05 dan 0,05", "0,05 dan 0,0475", "0,5 dan 0,25", "5 dan 4,75"], "correct": 1, "explanation": "Benar: E=p=0,05; Var=p(1−p)=0,0475. Bukan 0,05 (itu Poisson)."}, {"question": "Binomial(5; 0,05): P(X=2) memakai suku C(5,2) karena…", "options": ["Ada 10 urutan gagal", "Ada 10 posisi untuk 2 sukses", "Ada 10 nasabah", "Rumusnya begitu"], "correct": 1, "explanation": "Benar: C(5,2)=10 cara menempatkan 2 sukses di 5 posisi — tiap pola berpeluang p²(1−p)³."}, {"question": "Kapan Binomial TIDAK valid?", "options": ["n=1000, p=0,05 independen", "Default saat krisis (berkorelasi)", "100 lemparan koin adil", "1000 klik iklan independen"], "correct": 1, "explanation": "Benar: krisis merusak independensi — butuh model korelasi (Vasicek, B13)."}, {"question": "Binomial(1000; 0,05): 70 gagal. Kesimpulan tepat?", "options": ["Normal, dekat ekspektasi 50", "Sinyal: ~2,9 SD di atas mean, P(X≥70) kecil", "Pasti PD naik", "Hitungan salah"], "correct": 1, "explanation": "Benar: 2,9 SD = ekor tipis → sinyal kuat ada perubahan. Tapi &ldquo;pasti&rdquo; terlalu kuat — bisa juga korelasi, bukan PD."}, {"question": "Binomial(10; 0,5) bentuknya simetris karena…", "options": ["n besar", "p=0,5 membuat p^k(1−p)^(n−k) simetris terhadap k↔n−k", "Selalu simetris", "Kebetulan"], "correct": 1, "explanation": "Benar: p=0,5 → tiap pola dan cerminannya berpeluang sama. Untuk p≠0,5, miring."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B6 (Part 1) — Probabilitas</span>
        <h1 className="display-title">Distribusi Diskret (1):<br/>Bernoulli &amp; Binomial</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1.000 Nasabah, 5% Gagal — Berapa yang Benar-benar Gagal?</a></li>
          <li><a href="#bern">Bernoulli — Atomnya: Satu Percobaan Ya/Tidak</a></li>
          <li><a href="#binom">Binomial — Jumlah dari n Bernoulli</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bentuk Binomial Berubah dengan p</a></li>
          <li><a href="#lab2">🔬 Lab 2: &ldquo;70 Gagal&rdquo; — Sinyal atau Noise?</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Distribusi Diskret Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: A/B Testing — 55 vs 45 Klik</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>Bernoulli</strong> sebagai &ldquo;atom&rdquo; semua distribusi diskret: satu percobaan ya/tidak.</li><li>Menurunkan <strong>Binomial</strong> sebagai jumlah n Bernoulli independen + menghitung peluangnya.</li><li>Menghitung ekspektasi &amp; varians Binomial (<Tex math={String.raw`np`} />, <Tex math={String.raw`np(1-p)`} />) dan menafsirkannya.</li><li>Memutuskan kapan Binomial valid — dan kapan asumsinya jebol (overdispersi).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 1.000 Nasabah, 5% Gagal — Berapa yang Benar-benar Gagal?</h2>

      <div className="story"><p>Bank punya 1.000 nasabah baru, masing-masing peluang gagal bayar 5% (independen). <em>&ldquo;Berapa nasabah yang akan gagal tahun ini?&rdquo;</em> tanya direksi.</p><p>&ldquo;Ekspektasinya 50,&rdquo; jawab analis. &ldquo;Tapi bisa 40, bisa 65.&rdquo; Direksi mengernyit: <em>&ldquo;Bisa berapa tepatnya? Berapa peluang lebih dari 70 yang gagal?&rdquo;</em></p><p>Ekspektasi (B5) tidak menjawab &ldquo;berapa peluangnya&rdquo; — butuh <strong>distribusi</strong>: peta lengkap peluang untuk tiap kemungkinan jumlah. Distribusi Binomial adalah peta itu untuk &ldquo;jumlah sukses dari n percobaan ya/tidak&rdquo; — dan ia ada di mana-mana: gagal bayar, konversi iklan, A/B testing, kontrol kualitas.</p><p><strong>Twist-nya:</strong> ekspektasi 50 — tapi peluang <em>tepat</em> 50 yang gagal hanya ~11%. Angka &ldquo;rata-rata&rdquo; ternyata bukan angka yang paling mungkin terjadi! Ekspektasi = pusat gravitasi distribusi, bukan prediksi. Direksi yang menuntut &ldquo;angka pastinya&rdquo; sedang meminta sesuatu yang bahkan distribusi lengkap pun tidak bisa berikan — yang bisa diberikan hanyalah peta peluangnya.</p></div>

      <h2 id="bern">Bernoulli — Atomnya: Satu Percobaan Ya/Tidak</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Bernoulli}(p)`} />: <Tex math={String.raw`X=1`} /> (sukses) dengan peluang <Tex math={String.raw`p`} />, <Tex math={String.raw`X=0`} /> (gagal) dengan peluang <Tex math={String.raw`1-p`} />.</p>

      <p><Tex math={String.raw`P(X=1) = p, \quad P(X=0) = 1-p`} block /></p>

      <ul>
<li><Tex math={String.raw`E[X] = p`} /> — ekspektasi = peluangnya sendiri!</li>
<li><Tex math={String.raw`\mathrm{Var}(X) = p(1-p)`} /> — maksimal di p=0,5 (ketidakpastian terbesar), nol di p=0/1.</li>
</ul>

      <p><strong>Kepribadian:</strong> Bernoulli adalah &ldquo;bata LEGO&rdquo; peluang — satu bata sederhana, tapi disusun jadi Binomial, Geometrik, Negatif Binomial, bahkan fondasi regresi logistik (A3.4).</p>

      <p><strong>Contoh:</strong> satu nasabah: gagal (1) p=5% / lancar (0) p=95%. <Tex math={String.raw`E[X]=0{,}05`} /> = PD-nya. (Ya — <strong>PD tidak lain adalah parameter Bernoulli!</strong>)</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Setiap kali melihat &ldquo;ya/tidak&rdquo;, &ldquo;sukses/gagal&rdquo;, &ldquo;default/lancar&rdquo;, &ldquo;klik/tidak&rdquo; — pasang kacamata Bernoulli dulu. Pertanyaan berikutnya selalu: <em>berapa n-nya?</em> (→ Binomial) atau <em>kapan berhentinya?</em> (→ Geometrik, B6.2).</p>
</div>

      <h2 id="binom">Binomial — Jumlah dari n Bernoulli</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Binomial}(n,p)`} />: jumlah sukses dari <Tex math={String.raw`n`} /> percobaan Bernoulli <strong>independen</strong> dengan peluang sukses <Tex math={String.raw`p`} /> yang sama.</p>

      <p><Tex math={String.raw`P(X=k) = \binom{n}{k}\, p^k\, (1-p)^{\,n-k}`} block /></p>

      <ul>
<li><Tex math={String.raw`\binom{n}{k}`} />: banyak cara memilih <em>posisi</em> k sukses dari n (kombinasi — B2!)</li>
<li><Tex math={String.raw`p^k(1-p)^{n-k}`} />: peluang satu pola spesifik (k sukses lalu n−k gagal)</li>
</ul>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>5 nasabah, PD 5% independen. Peluang tepat 2 gagal?</p><p><strong>Langkah 1</strong> — <Tex math={String.raw`n=5,\ k=2,\ p=0{,}05`} />.</p><p><strong>Langkah 2</strong> — <Tex math={String.raw`\binom{5}{2} = 10`} /> pola.</p><p><strong>Langkah 3</strong> — <Tex math={String.raw`P(X=2) = 10 \times 0{,}05^2 \times 0{,}95^3 \approx 0{,}0214`} /> ≈ <strong>2,1%</strong>.</p>
</details>

      <p><strong>Ekspektasi &amp; varians</strong> (dari linearitas B5 — tiap Bernoulli independen):</p>

      <p><Tex math={String.raw`E[X] = np, \qquad \mathrm{Var}(X) = np(1-p)`} block /></p>

      <p>Contoh: 1.000 nasabah, p=5% → E=50, SD = √(1000×0,05×0,95) ≈ <strong>6,9</strong>. Jadi &ldquo;50 ± 14&rdquo; (±2 SD) adalah rentang wajar — 70 gagal (2,9 SD di atas mean) adalah sinyal, bukan noise!</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Binomial berlaku untuk semua &ldquo;jumlah kejadian&rdquo;.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika: (1) n tetap, (2) tiap percobaan ya/tidak, (3) p sama, (4) independen. Jebol satu saja → bukan Binomial. Contoh jebol: default saat krisis (tidak independen — butuh Vasicek/B13), jumlah klaim per bulan (n tidak tetap — butuh Poisson/B6.2), sampling tanpa pengembalian dari populasi kecil (butuh Hipergeometrik).</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Varians Binomial = np.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Itu Poisson! Binomial: np(1−p). Untuk p kecil keduanya mirip (inilah aproksimasi Poisson — B6.2), tapi untuk p=0,5 bedanya 2x lipat. Salah rumus = salah interval kepercayaan.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aproksimasi cepat: jika <Tex math={String.raw`np \geq 10`} /> dan <Tex math={String.raw`n(1-p) \geq 10`} />, Binomial ≈ Normal(<Tex math={String.raw`np,\ np(1-p)`} />) — jembatan ke B7.1 dan ke interval kepercayaan Wald (A2.3).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Binomial(10, 0.2): Peta Peluang Jumlah Sukses"
  layout={{"xaxis": {"title": "k = jumlah sukses"}, "yaxis": {"title": "P(X=k)"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = kemungkinan jumlah sukses (0–10), tinggi batang = peluangnya. Total semua batang = 1.</p>
<p><strong>Interpretasi:</strong> Puncak di k=2 (= np = ekspektasi). Bentuknya miring kanan karena p kecil. <strong>Cara membaca distribusi:</strong> cari puncak (moda ≈ ekspektasi), lihat sebaran (SD), dan baca peluang ekor langsung dari tinggi batang — misal P(X≥5) = jumlah batang 5–10.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Var(Bernoulli) = p(1−p): Maksimal di Tengah"
  layout={{"xaxis": {"title": "p"}, "yaxis": {"title": "Varians"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = peluang sukses, tinggi batang = varians satu percobaan.</p>
<p><strong>Interpretasi:</strong> Ketidakpastian maksimal saat p=0,5 (koin adil — paling tidak bisa ditebak) dan nol di ujung (pasti). <strong>Implikasi bisnis:</strong> segmen dengan PD ~50% adalah yang paling &ldquo;liar&rdquo; — butuh sampel terbesar untuk diestimasi presisi (ini materi power/sample size, A2.10).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Binomial = &ldquo;hitung sukses dari n percobaan&rdquo; — kuasai polanya sekali, pakai selamanya.</p>

            <details className="worked">
              <summary>📐 Kasus 1: P(tepat 50 gagal dari 1.000)</summary>
              <p>n = 1.000, p = 0,05. Berapa peluang <em>tepat</em> 50 nasabah gagal?</p>
              <p><strong>Langkah 1</strong> — rumus: P(X=50) = C(1000,50) × 0,05<sup>50</sup> × 0,95<sup>950</sup>.<br />
              <strong>Langkah 2</strong> — hitung (pakai Python/kalkulator): ≈ <strong>0,0577 ≈ 5,8%</strong>.<br />
              <strong>Langkah 3</strong> — bandingkan dengan ekspektasi: mean = np = 50 — tapi P(tepat di mean) hanya 5,8%! Distribusi <em>menyebar</em>: P(40–60) ≈ 68%.</p>
              <p>Pelajaran: mean = 50 bukan &ldquo;yang akan terjadi&rdquo;. Yang informatif: sebaran di sekitarnya (SD = √(1000×0,05×0,95) ≈ 6,89).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: &ldquo;70 gagal&rdquo; — sinyal atau noise?</summary>
              <p>Terjadi 70 gagal (ekspektasi 50). Apakah model p = 5% masih bisa dipercaya, atau PD sebenarnya naik?</p>
              <p><strong>Langkah 1</strong> — standarkan: z = (70 − 50)/6,89 ≈ <strong>2,90</strong>.<br />
              <strong>Langkah 2</strong> — P(X ≥ 70) ≈ P(Z ≥ 2,90) ≈ <strong>0,19%</strong> (aproksimasi Normal; eksak Binomial ≈ 0,21%).<br />
              <strong>Langkah 3</strong> — interpretasi: jika p benar 5%, kejadian ≥70 hanya 2 dari 1.000 tahun. Sangat tidak mungkin → <strong>sinyal</strong>: PD kemungkinan naik (atau asumsi independen jebol — B13!).</p>
              <p>Pelajaran: distribusi mengubah &ldquo;70 vs 50&rdquo; (terlihat dekat) menjadi &ldquo;2,9 SD&rdquo; (sangat jauh). Tanpa distribusi, kamu tidak tahu mana yang dekat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: A/B testing — 55 vs 45 klik</summary>
              <p>Iklan A: 55 klik dari 1.000 tayang. Iklan B: 45 klik dari 1.000 tayang. Apakah A benar-benar lebih baik?</p>
              <p><strong>Langkah 1</strong> — H0: p sama = 0,05. Selisih teramati: 10 klik.<br />
              <strong>Langkah 2</strong> — SD selisih dua Binomial ≈ √(1000×0,05×0,95 + 1000×0,05×0,95) ≈ 9,75.<br />
              <strong>Langkah 3</strong> — z = 10/9,75 ≈ 1,03 → p-value ≈ 30%. <strong>Tidak signifikan</strong> — selisih 55 vs 45 sangat wajar sebagai noise.</p>
              <p>Pelajaran: &ldquo;menang 10 klik&rdquo; terdengar meyakinkan sampai kamu membaginya dengan standar deviasi. Inilah mengapa A/B test butuh uji (A2.11!), bukan sekadar &ldquo;angka lebih besar&rdquo;.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Bentuk Binomial Berubah dengan p</h2>

      <p>Fungsi pmf Binomial dihitung manual (rumus B2+B5). Ubah n dan p, amati bentuknya.</p>

      <PyodideLab
  title="Lab 1 — Peta Binomial Interaktif"
  hint="Bandingkan cetak(100, 0.05) dengan Poisson(5) di B6.2 — inilah &lt;strong>aproksimasi Poisson&lt;/strong>."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: &ldquo;70 Gagal&rdquo; — Sinyal atau Noise?</h2>

      <p>1.000 nasabah, PD 5%. Tahun ini 70 gagal. Hitung P(X ≥ 70) — jika sangat kecil, ada yang berubah (bukan noise).</p>

      <PyodideLab
  title="Lab 2 — Ekor Binomial untuk Deteksi Anomali"
  hint="Inilah logika &lt;strong>backtesting&lt;/strong> (MR6): bandingkan realisasi vs distribusi yang diprediksi model."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Distribusi Diskret Mana?</h2>

      <div className="decision-card">
<h3>1. Satu percobaan ya/tidak → <strong>Bernoulli(p)</strong></h3>
<p><strong>Kondisi data:</strong> Hasil biner tunggal: satu nasabah, satu klik, satu tes.</p>
<p><strong>Kenapa:</strong> Atomnya — E=p, Var=p(1−p). Semua yang lain dibangun dari ini.</p>
<p><strong>Contoh nyata:</strong> PD per nasabah = parameter Bernoulli.</p>
</div>

      <div className="decision-card">
<h3>2. Jumlah sukses dari n tetap, p sama, independen → <strong>Binomial(n,p)</strong></h3>
<p><strong>Kondisi data:</strong> n percobaan berulang identik: 1.000 nasabah, 100 klik iklan.</p>
<p><strong>Kenapa:</strong> Jumlah n Bernoulli independen. E=np, Var=np(1−p).</p>
<p><strong>Contoh nyata:</strong> Distribusi jumlah gagal bayar portofolio (asumsi independen).</p>
</div>

      <div className="decision-card">
<h3>3. n tidak tetap / p sangat kecil → <strong>tunggu B6.2 (Poisson)</strong></h3>
<p><strong>Kondisi data:</strong> Menghitung kejadian per periode/wilayah: klaim per bulan, fraud per hari.</p>
<p><strong>Kenapa:</strong> Binomial dengan n besar & p kecil → Poisson(λ=np). Lebih sederhana.</p>
<p><strong>Contoh nyata:</strong> Jumlah klaim asuransi per bulan.</p>
</div>

      <div className="decision-card">
<h3>4. &ldquo;Berapa percobaan sampai sukses pertama&rdquo; → <strong>tunggu B6.2 (Geometrik)</strong></h3>
<p><strong>Kondisi data:</strong> Waktu tunggu, bukan jumlah dalam n tetap.</p>
<p><strong>Kenapa:</strong> Struktur soalnya terbalik: n acak, k=1 tetap.</p>
<p><strong>Contoh nyata:</strong> Berapa nasabah dihubungi sampai 1 setuju.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Hitung dulu: <strong>n tetap?</strong> Ya → Binomial (cek independen + p sama).</li><li>E = np selalu; Var = np(1−p) — bukan np.</li><li>Realisasi &gt; E + 3 SD → sinyal, bukan noise (gunakan ekor, bukan firasat).</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: A/B Testing — 55 vs 45 Klik</h2>

      <div className="callout">
<p>Tim marketing: varian A diklik 45 dari 1.000 tayang, varian B 55 dari 1.000. <em>&ldquo;B menang 22%!&rdquo;</em> klaim mereka.</p><p><strong>Pertanyaan:</strong> (a) Jika sebenarnya A dan B sama (p=0,05), berapa SD selisih klik? (b) Apakah selisih 10 signifikan?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Tiap varian ~ Binomial(1000, 0,05): Var = 47,5, SD ≈ 6,9. Selisih dua independen: Var = 95, SD ≈ <strong>9,7</strong>.</p><p>(b) Selisih 10 ≈ <strong>1 SD</strong> — sangat wajar sebagai noise! Klaim &ldquo;menang 22%&rdquo; adalah ilusi persen dari angka kecil. Butuh selisih ~20 (2 SD) untuk mulai curiga, ~30 untuk yakin. <strong>Pelajaran:</strong> tanpa distribusi, &ldquo;55 vs 45&rdquo; terlihat meyakinkan; dengan Binomial, ia cuma noise. Ini fondasi A/B testing (A2.11).</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Koin adil dilempar 10×. Berapa peluang tepat 7 angka? Berapa peluang minimal 8 angka?</li>
              <li>QC: tiap unit cacat dengan peluang 2% (independen). Dari 50 unit, berapa peluang ditemukan minimal 2 cacat?</li>
              <li>n = 400, p = 0,1. Hitung mean dan SD Binomial. Jika teramati 52 &ldquo;sukses&rdquo;, berapa z-score-nya? Sinyal atau noise?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> P(X=7) = C(10,7)×0,5<sup>10</sup> = 120/1024 ≈ <strong>11,7%</strong>. P(X≥8) = (C(10,8)+C(10,9)+C(10,10))/1024 = (45+10+1)/1024 = 56/1024 ≈ <strong>5,5%</strong>.</p>
              <p><strong>2.</strong> 1 − P(0) − P(1) = 1 − 0,98<sup>50</sup> − 50×0,02×0,98<sup>49</sup> ≈ 1 − 0,364 − 0,372 = <strong>26,4%</strong>.</p>
              <p><strong>3.</strong> Mean = 40; SD = √(400×0,1×0,9) = 6. z = (52−40)/6 = <strong>2,0</strong> → p ≈ 2,3%: <strong>sinyal lemah</strong> (menarik tapi belum konklusif — butuh replikasi).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Bernoulli(p):</strong> satu ya/tidak; E=p, Var=p(1−p) — atom semua distribusi diskret.</li><li><strong>Binomial(n,p):</strong> jumlah n Bernoulli independen; <Tex math={String.raw`P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}`} />; E=np, Var=np(1−p).</li><li><strong>Syarat:</strong> n tetap, p sama, independen — jebol → bukan Binomial.</li><li><strong>Ekor untuk sinyal:</strong> realisasi &gt; E+3SD = anomali, bukan noise.</li><li><strong>Jangan</strong> samakan Var Binomial (np(1−p)) dengan Poisson (λ).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b5-variabel-acak-ekspektasi" className="btn btn-secondary btn-sm">← ← B5</Link>
        <Link href="/learn/b6-distribusi-diskret-2" className="btn btn-primary btn-sm">Next: B6.2 →</Link>
      </div>
    </div>
  );
}
