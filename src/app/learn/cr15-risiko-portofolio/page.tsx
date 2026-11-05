"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr15Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const concentrationData = [
    {
      x: ["Tersebar (100 debitur)", "Terkonsentrasi (5 debitur)"],
      y: [16, 16],
      type: "bar",
      name: "EL (Rp jt)",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Tersebar (100 debitur)", "Terkonsentrasi (5 debitur)"],
      y: [25, 180],
      type: "bar",
      name: "UL / Credit VaR (Rp jt)",
      marker: { color: "#ef4444" },
    },
  ];

  const vasicekData = [
    {
      x: [0, 5, 10, 15, 20, 25, 30, 35, 40],
      y: [0, 2, 8, 20, 38, 60, 78, 90, 96],
      type: "scatter",
      mode: "lines",
      name: "Distribusi kerugian (korelasi 20%)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0, 5, 10, 15, 20, 25, 30, 35, 40],
      y: [0, 15, 45, 70, 85, 93, 97, 99, 100],
      type: "scatter",
      mode: "lines",
      name: "Tanpa korelasi (independen)",
      line: { color: "#3aa655", width: 2, dash: "dash" },
    },
  ];

  const hhiData = [
    {
      x: ["Bank A (sebar)", "Bank B (sedang)", "Bank C (konsentrasi)"],
      y: [0.02, 0.08, 0.25],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["0,02", "0,08", "0,25"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Konsentrasi vs diversifikasi — EL sama, UL beda
# Rp 1 M disalurkan dua cara. Simulasi 10.000x, lihat sebarannya.
import random
random.seed(101)

def simulasi(n_debitur, pd=0.04, lgd=0.4, total=1000, n_sim=10000):
    per = total / n_debitur
    rugi = []
    for _ in range(n_sim):
        # korelasi sederhana: guncangan bersama mempengaruhi semua
        guncangan = random.gauss(0, 1)
        r = 0
        for _ in range(n_debitur):
            # debitur default jika "kesehatan" < ambang (terpengaruh guncangan)
            sehat = random.gauss(0, 1) * 0.9 + guncangan * 0.44
            ambang = -1.75  # ~PD 4%
            if sehat < ambang:
                r += per * lgd
        rugi.append(r)
    rugi.sort()
    el = sum(rugi) / len(rugi)
    var99 = rugi[int(0.99 * len(rugi))]
    return el, var99 - el  # UL = VaR99 - EL

for n, nama in [(100, "Tersebar (100)"), (5, "Konsentrasi (5)")]:
    el, ul = simulasi(n)
    print(f"{nama:<18}: EL Rp {el:>6.1f} jt | UL Rp {ul:>6.1f} jt")
print()
print("EL nyaris sama. UL konsentrasi 5-7x lipat!")
print("Inilah 'harga' konsentrasi — dibayar dengan MODAL (CR3).")`;

  const lab2Code = `# Lab 2: HHI — mengukur konsentrasi satu angka
# HHI = jumlah kuadrat pangsa tiap debitur. Makin besar = makin terkonsentrasi.
def hhi(pangsa):
    return sum(p**2 for p in pangsa)

# Tiga bank, total kredit sama (Rp 1000 M)
bank_a = [10]*100          # 100 debitur @10M
bank_b = [50]*20           # 20 debitur @50M
bank_c = [400, 200, 100, 100, 50, 50, 50, 50]  # 8 debitur timpang

for nama, p in [("A (sebar)", bank_a), ("B (sedang)", bank_b), ("C (timpang)", bank_c)]:
    total = sum(p)
    shares = [x/total for x in p]
    print(f"Bank {nama:<10}: HHI = {hhi(shares):.4f}  (debitur terbesar {max(shares)*100:.0f}%)")
print()
print("Patokan: HHI < 0.01 tersebar; 0.01-0.10 sedang; > 0.10 terkonsentrasi.")
print("Coba: buat bank D dengan 1 debitur 700M + sisanya kecil.")
print("HHI meledak — dan itulah 'single name concentration' yang")
print("diawasi OJK (batas BMPK!).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR15 — Credit Risk Analyst</span>
        <h1 className="display-title">Risiko Portofolio:<br />Konsentrasi, Korelasi &amp; Credit VaR</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 20 Warung vs 1 Mal</a></li>
          <li><a href="#konsentrasi">Konsentrasi: Semua Telur Satu Keranjang</a></li>
          <li><a href="#korelasi">Korelasi Default: Tenggelam Bersama</a></li>
          <li><a href="#vasicek">Vasicek &amp; Credit VaR: Mengukur Ekor</a></li>
          <li><a href="#lab1">🔬 Lab 1: Konsentrasi vs Diversifikasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: HHI — Satu Angka Konsentrasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Mengelola Konsentrasi</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Sindikasi Rp 500 M</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa EL sama tidak berarti risiko sama (konsentrasi menciptakan UL).</li>
          <li>Menghitung HHI dan menginterpretasikan tingkat konsentrasi portofolio.</li>
          <li>Menjelaskan korelasi default dan model Vasicek satu faktor.</li>
          <li>Menghitung credit VaR sederhana dan mengaitkannya dengan modal.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 20 Warung vs 1 Mal</h2>
      <div className="story">
        <p>Pak Haji punya Rp 1 miliar. Opsi A: pinjamkan ke <strong>20 warung</strong> @Rp 50 juta. Opsi B: pinjamkan ke <strong>1 mal</strong> Rp 1 miliar. Bunga sama, agunan proporsional sama, EL sama: Rp 16 juta.</p>
        <p>Tahun paceklik tiba. Di Opsi A: 3 warung gagal — rugi Rp 60 juta. Pahit, tapi hidup terus. Di Opsi B: mal-nya kebakaran + sepi pengunjung — <strong>rugi Rp 400 juta sekaligus</strong>. Pak Haji bangkrut.</p>
        <p><strong>EL-nya sama. Nasibnya beda langit-bumi.</strong> Inilah pelajaran paling mahal di risiko kredit: <strong>rata-rata (EL) tidak membunuh — sebaran (UL) yang membunuh</strong>. Dan sebaran ditentukan oleh dua hal: <strong>konsentrasi</strong> dan <strong>korelasi</strong>.</p>
        <p><strong>Twist-nya:</strong> seluruh arsitektur modal Basel (CR4a) pada dasarnya adalah <strong>harga untuk konsentrasi &amp; korelasi</strong>. Lesson ini membedah mesinnya: dari HHI sampai Vasicek.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="konsentrasi">Konsentrasi: Semua Telur Satu Keranjang</h2>
      <p><strong>Definisi.</strong> <strong>Risiko konsentrasi</strong> = risiko akibat eksposur <strong>terpusat</strong> pada sedikit debitur (<em>single-name</em>), sektor, atau wilayah. Diukur dengan <strong>HHI</strong> (<em>Herfindahl-Hirschman Index</em>):</p>
      <Tex math={String.raw`\text{HHI} = \sum_{i} s_i^2`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`s_i`} /> = pangsa debitur ke-<Tex math={String.raw`i`} /> dari total portofolio. HHI = 1/n untuk n debitur sama besar (tersebar sempurna); mendekati 1 untuk satu debitur dominan. Patokan: &lt;0,01 tersebar; 0,01–0,10 sedang; &gt;0,10 terkonsentrasi.</p>
      <p><strong>Di Indonesia:</strong> OJK mengatur <strong>BMPK</strong> (<em>Batas Maksimum Pemberian Kredit</em>) — misal: ke satu debitur ≤ 20–25% modal bank. Melanggar BMPK = pelanggaran serius.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Portofolio Rp 1000 M: debitur A 400 M, B 200 M, sisanya 8 debitur @50 M.</p>
        <p><strong>Langkah 1</strong> — pangsa: 0,4; 0,2; 0,05 ×8.<br />
        <strong>Langkah 2</strong> — HHI = 0,16 + 0,04 + 8×0,0025 = <strong>0,22</strong>.<br />
        <strong>Langkah 3</strong> — 0,22 &gt; 0,10 = <strong>terkonsentrasi</strong>. Debitur A sendiri (40%) = "too big to fail" versi mini bank ini.</p>
      </details>

      <PlotlyChart
        data={hhiData}
        title="HHI Tiga Bank (total kredit sama)"
        layout={{ xaxis: { title: "Bank" }, yaxis: { title: "HHI" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = HHI. Garis imajiner 0,10 = ambang konsentrasi.</p>
        <p><strong>Interpretasi:</strong> Bank C (0,25) sangat terkonsentrasi — <strong>butuh modal jauh lebih besar</strong> dari Bank A untuk portofolio nominal yang sama. Inilah <em>granularity adjustment</em> Basel: konsentrasi membayar "pajak" modal.</p>
      </div>

      <PlotlyChart
        data={concentrationData}
        title="EL Sama, UL Beda: Harga Konsentrasi (Rp Juta)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Rp Juta" }, barmode: "group", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kelompok batang; abu-abu = EL, merah = UL (credit VaR 99% − EL).</p>
        <p><strong>Interpretasi:</strong> EL identik (Rp 16 jt) — tapi UL konsentrasi (Rp 180 jt) <strong>7× lipat</strong> tersebar (Rp 25 jt). <strong>Total "harga" risiko</strong> (EL+UL): 41 jt vs 196 jt. Inilah jawaban kuantitatif atas cerita pembuka — dan alasan modal ada (CR3).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> diversifikasi adalah <strong>satu-satunya "makan siang gratis"</strong> di keuangan — mengurangi UL <strong>tanpa</strong> mengurangi expected return (bunga). Bank yang menolak diversifikasi demi "fokus pada yang dikuasai" sedang menolak makan siang gratis.</p>
      </div>

      <h2 id="korelasi">Korelasi Default: Tenggelam Bersama</h2>
      <p><strong>Definisi.</strong> <strong>Korelasi default</strong> = kecenderungan debitur <strong>gagal bersamaan</strong>. Penyebab: faktor bersama (resesi, harga komoditas, bencana) yang memukul banyak debitur sekaligus. Korelasi 0 = independen (tenggelam sendiri-sendiri); korelasi tinggi = <strong>tenggelam bersama</strong>.</p>
      <p><strong>Mengapa penting:</strong> 100 debitur independen dengan PD 4% → kerugian terdistribusi normal (hukum bilangan besar). 100 debitur <strong>berkorelasi</strong> → distribusi <strong>miring kanan dengan ekor tebal</strong>: biasanya rugi kecil, kadang rugi raksasa. <strong>Ekor inilah yang membunuh bank.</strong></p>
      <p><strong>Kepribadian:</strong> korelasi seperti <strong>tali yang mengikat perahu-perahu</strong> — saat badai, perahu terikat terbalik bersamaan; perahu bebas terbalik sendiri-sendiri. Diversifikasi antar <em>sektor/wilayah yang tidak berkorelasi</em> = memotong talinya.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "100 debitur beda nama = terdiversifikasi."</strong></p>
        <p><strong>Yang benar:</strong> 100 debitur <strong>sektor batubara di Kalimantan</strong> = 100 nama, <strong>satu risiko</strong> (harga batubara). Diversifikasi sejati = sebar antar <strong>faktor risiko</strong> (sektor, wilayah, segmen) — bukan antar nama. Inilah <em>wrong-way concentration</em> yang paling sering luput.</p>
      </div>

      <h2 id="vasicek">Vasicek &amp; Credit VaR: Mengukur Ekor</h2>
      <p><strong>Definisi.</strong> <strong>Model Vasicek</strong> (satu faktor) = model standar Basel untuk kerugian portofolio: tiap debitur punya <strong>faktor bersama</strong> (ekonomi, korelasi ρ) + <strong>faktor idiosinkratik</strong> (nasib sendiri). Rumus kerugian pada persentil keyakinan <Tex math={String.raw`q`} /> (misal 99,9% untuk Basel):</p>
      <Tex math={String.raw`\text{VaR}_q = \Phi\left(\frac{\Phi^{-1}(\text{PD}) + \sqrt{\rho}\cdot\Phi^{-1}(q)}{\sqrt{1-\rho}}\right) \times \text{LGD} \times \text{EAD}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\Phi`} /> = distribusi normal kumulatif; <Tex math={String.raw`\rho`} /> = korelasi aset (Basel: 12–24% untuk korporasi); <Tex math={String.raw`q`} /> = tingkat keyakinan (99,9% = "1 dalam 1000 tahun"). Hasilnya = % portofolio yang hilang pada skenario seburuk itu.</p>
      <p><strong>Credit VaR</strong> = kerugian pada persentil ekstrem <strong>dikurangi EL</strong> — inilah <strong>UL</strong> yang harus ditutup modal. Rantai lengkap: Vasicek → VaR → UL → modal (inilah Pilar 1 Basel untuk IRB!).</p>

      <PlotlyChart
        data={vasicekData}
        title="Distribusi Kerugian: Dampak Korelasi (CDF, %)"
        layout={{ xaxis: { title: "Kerugian (Rp M)" }, yaxis: { title: "Peluang kumulatif (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = kerugian, Y = peluang kerugian ≤ X. Garis biru = dengan korelasi; hijau putus-putus = independen.</p>
        <p><strong>Interpretasi:</strong> dengan korelasi, kurva <strong>lebih landai di ekor kanan</strong> — peluang rugi &gt;Rp 25 M jauh lebih besar. Credit VaR 99% (tarik garis vertikal di Y=99): independen ≈ Rp 18 M, berkorelasi ≈ Rp 32 M. <strong>Korelasi hampir menggandakan kebutuhan modal</strong> — tanpa mengubah EL sedikit pun.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan rantai Basel: <strong>PD/LGD/EAD per debitur → Vasicek (korelasi ρ) → distribusi kerugian → VaR 99,9% → UL = VaR − EL → modal</strong>. Setiap parameter IRB yang kamu hitung (CR10–CR13) bermuara di sini. Inilah "mesin" Pilar 1 yang sebenarnya.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Satu-satunya Makan Siang Gratis</h3>
      <p>"Diversifikasi adalah satu-satunya makan siang gratis di keuangan" — kalimat ini benar, tetapi <strong>gratisnya ada syaratnya</strong>: korelasi harus rendah. 100 debitur batubara Kalimantan = 100 nama, satu risiko (CR18). Diversifikasi sejati = sebar across <strong>faktor risiko</strong> (sektor, wilayah, ukuran), bukan sekadar jumlah nama. Analis yang menghitung "jumlah debitur" sebagai ukuran diversifikasi sedang menghitung <strong>ilusi</strong>.</p>
      <p>Intuisi kedua: <strong>HHI menerjemahkan "terasa terkonsentrasi" menjadi angka</strong>. HHI 0,22 vs ambang 0,10 — bukan sekadar "lebih besar", melainkan bahasa yang bisa dibawa ke komite: "portofolio kita 2,2× ambang konsentrasi". Angka membuat diskusi objektif: bukan "saya merasa" melainkan "ukurannya sekian". Inilah kekuatan metrik konsentrasi — ia <strong>mempersenjatai insting</strong> dengan angka.</p>
      <p>Intuisi ketiga — rantai Basel: PD/LGD/EAD per debitur → Vasicek (korelasi ρ) → distribusi kerugian → VaR 99,9% → UL → modal. Hafalkan rantai ini, karena ia adalah <strong>anatomi lengkap</strong> bagaimana risiko individual menjadi kebutuhan modal bank. Setiap mata rantai bisa ditanya "mengapa begini?" — dan analis yang bisa menjawab semuanya memahami risiko kredit dari atom hingga organisme.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Konsentrasi vs Diversifikasi</h2>
      <p>Simulasi Monte Carlo 10.000×: EL sama, UL beda. Buktikan sendiri.</p>
      <PyodideLab
        title="Lab 1 — Harga Konsentrasi (Monte Carlo)"
        hint="Coba ubah n_debitur jadi 20, 50. Lihat UL turun mengikuti 1/√n (hukum bilangan besar). Pertanyaan: mengapa UL tidak pernah nol meski n=1000? (Jawaban: korelasi — guncangan bersama.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: HHI — Satu Angka Konsentrasi</h2>
      <p>Hitung HHI tiga bank — dan rasakan kapan satu debitur mendominasi.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator HHI"
        hint="Coba bank D: [700, 50, 50, 50, 50, 50, 50]. HHI-nya? Bandingkan dengan ambang BMPK: 700M vs modal bank (misal 2000M) = 35% — melanggar batas 20-25%!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Mengelola Konsentrasi</h2>

      <div className="decision-card">
        <h3>1. Single-name &gt;10% portofolio → <strong>turunkan via sindikasi / sekuritisasi / lindung nilai</strong></h3>
        <p><strong>Kondisi:</strong> satu debitur mendominasi.</p>
        <p><strong>Aksi:</strong> jual sebagian ke bank lain (sindikasi/sub-partisipasi), atau sekuritisasi. Jangan "menikmati" margin besarnya — UL-nya lebih besar.</p>
      </div>

      <div className="decision-card">
        <h3>2. Konsentrasi sektor (misal 40% di batubara) → <strong>limit sektor + diversifikasi bertahap</strong></h3>
        <p><strong>Kondisi:</strong> HHI sektor tinggi.</p>
        <p><strong>Aksi:</strong> tetapkan limit sektor (% portofolio), arahkan pertumbuhan baru ke sektor berkorelasi rendah. Tidak bisa dijual cepat — butuh 2–3 tahun.</p>
      </div>

      <div className="decision-card">
        <h3>3. Korelasi tidak terukur → <strong>pakai asumsi konservatif Basel</strong></h3>
        <p><strong>Kondisi:</strong> data korelasi tidak cukup.</p>
        <p><strong>Kenapa:</strong> korelasi sulit diestimasi (default jarang!). Basel memberi ρ 12–24% — pakai itu, jangan asumsi 0 (bunuh diri) atau estimasi ngawur.</p>
      </div>

      <div className="decision-card">
        <h3>4. Portofolio granular tapi sewilayah → <strong>waspadai korelasi geografis</strong></h3>
        <p><strong>Kondisi:</strong> 10.000 debitur tapi 80% di satu provinsi.</p>
        <p><strong>Kenapa:</strong> bencana/kerusuhan lokal = korelasi tinggi. Granular ≠ terdiversifikasi (pelajaran miskonsepsi di atas).</p>
      </div>

            <div className="decision-card">
        <h3>5. Limit sektor batubara sudah 95% terpakai, ada proposal tambang bagus → <strong>tolak atau minta pengecualian dengan harga</strong></h3>
        <p><strong>Kondisi:</strong> limit sektor batubara Rp 500 M, terpakai Rp 475 M. Proposal baru: tambang dengan DSCR 2×, manajemen bagus, butuh Rp 100 M. Secara individual: layak. Secara portofolio: melanggar limit.</p>
        <p><strong>Aksi:</strong> dua opsi sehat: (1) <strong>tolak dengan penjelasan portofolio</strong> — "bukan karena proposalnya jelek, melainkan karena keranjangnya sudah penuh"; atau (2) <strong>setujui dengan harga konsentrasi</strong> — pricing lebih tinggi (mencerminkan modal tambahan untuk UL) + tenor lebih pendek + covenant ketat. Yang tidak boleh: setujui diam-diam dengan melanggar limit ("nanti direvisi"). Limit yang bisa dilanggar diam-diam = bukan limit.</p>
        <p><strong>Contoh nyata:</strong> bank-bank yang disiplin limit sektor batubara sebelum harga jatuh 2015–2016 selamat; yang "kecolongan" karena proposal individualnya bagus-bagus menanggung NPL sektoral. Proposal bagus + keranjang penuh = tetap tolak. Disiplin portofolio mengalahkan kecemerlangan individual.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>EL sama ≠ risiko sama.</strong> Tanya UL-nya.</li>
          <li><strong>HHI &gt;0,10 = waspada.</strong> BMPK = batas hukum.</li>
          <li><strong>Diversifikasi antar faktor</strong> (sektor/wilayah), bukan antar nama.</li>
          <li><strong>Vasicek → VaR → UL → modal.</strong> Inilah mesin Pilar 1.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Dashboard Konsentrasi: 7 Metrik Wajib</h3>
      <p>BMPK saja tidak cukup (CR15). Tujuh metrik ini = pagar konsentrasi yang sesungguhnya — pantau kuartalan.</p>
      <ol>
        <li><strong>HHI per nama</strong> — Ambang 0,10. Di atasnya = terkonsentrasi. Sederhana, objektif, bisa dibawa ke komite.</li>
        <li><strong>HHI per FAKTOR (sektor/wilayah)</strong> — 30 debitur batubara = HHI faktor 0,81 walau HHI nama 0,027. Inilah metrik yang menangkap 'satu risiko dalam 30 amplop'.</li>
        <li><strong>Top 10 eksposur / total</strong> — &gt;30% = waspada; &gt;50% = bahaya. Sederhana tetapi ampuh — 'berapa % nasib bank di 10 tangan?'</li>
        <li><strong>Eksposur sektor / limit sektor</strong> — Per sektor: terpakai berapa % dari limit? 95%+ = rem darurat — proposal baru butuh pengecualian formal.</li>
        <li><strong>Korelasi intra-portofolio (estimasi)</strong> — Rata-rata korelasi pair sektor utama. Naik = diversifikasi semu — 'semua bergerak bersama'.</li>
        <li><strong>Single-name terbesar / modal</strong> — Harus &lt; BMPK dengan margin aman (bukan mepet). Mepet = tidak ada ruang untuk pertumbuhan nasabah itu.</li>
        <li><strong>UL konsentrasi / UL tersebar (rasio)</strong> — Dari model Vasicek: berapa 'harga' konsentrasi dalam modal? Angka ini = bahasa uang untuk direksi.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tujuh metrik, satu dashboard, review kuartalan di komite risiko. Konsentrasi yang tidak diukur = konsentrasi yang tumbuh liar.</p>

      <details className="worked">
        <summary>❓ Bagaimana mengukur konsentrasi untuk portofolio ritel massal (jutaan debitur)?</summary>
        <p>Per <strong>nama</strong> tidak relevan (jutaan nama kecil) — ukur per <strong>faktor</strong>: sektor pekerjaan, wilayah, vintage, produk. Ritel: konsentrasi = '80% debitur di 3 kota' atau '60% di sektor informal'. <strong>HHI per faktor</strong> tetap berlaku — hanya faktornya yang berbeda dari korporasi.</p>
      </details>
      <details className="worked">
        <summary>❓ Diversifikasi internasional — apakah selalu baik?</summary>
        <p>Tidak selalu — ia menambah <strong>country risk</strong> (CR18) dan kompleksitas (hukum, bahasa, data). Diversifikasi yang baik = ke negara yang <strong>korelasinya rendah</strong> dengan Indonesia DAN risikonya dipahami. Ekspansi ke negara yang tidak dipahami = <strong>diversifikasi buta</strong> — menambah risiko, bukan menguranginya.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia adalah studi kasus konsentrasi yang hidup — dari BMPK hingga konglomerasi.</p>

      <h3>BMPK: Pagar Konstitusi Indonesia</h3>
      <p>OJK mengatur <strong>BMPK</strong> (Batas Maksimum Pemberian Kredit): eksposur ke satu pihak/grup dibatasi sebagai % modal bank (untuk pihak tidak terkait, batasnya sekitar 20–25% modal; pihak terkait lebih ketat). Tujuannya persis pelajaran lesson ini: <strong>mencegah "gajah" tunggal menenggelamkan bank</strong>. Pelanggaran BMPK = temuan serius OJK — bukan sekadar administrasi.</p>
      <p>Tetapi BMPK punya <strong>celah konseptual</strong>: ia membatasi per nama/grup, bukan per <strong>faktor risiko bersama</strong>. Bank bisa patuh BMPK (tidak ada debitur &gt;20% modal) tetapi tetap terkonsentrasi: 30 debitur batubara yang masing-masing 3% modal = 90% portofolio terpapar satu harga komoditas! Inilah mengapa analis modern melengkapi BMPK dengan <strong>limit sektor</strong> dan <strong>analisis korelasi</strong> — pagar nama saja tidak cukup, perlu pagar faktor.</p>

      <h3>Konglomerasi: Risiko Nama Besar</h3>
      <p>Struktur ekonomi Indonesia didominasi <strong>grup usaha besar</strong> (konglomerasi) — satu grup bisa punya puluhan perusahaan di sektor berbeda. Tantangan analis: <strong>siapa "satu debitur"?</strong> Aturan <em>single obligor</em>: perusahaan-perusahaan dalam satu grup dengan pengendalian bersama dihitung sebagai <strong>satu eksposur</strong> untuk BMPK. Bank yang "memecah" kredit ke 10 anak perusahaan grup yang sama lalu mengklaim "terdiversifikasi" = melanggar semangat aturan (dan akan ditindak OJK saat ketahuan).</p>
      <p>Kasus yang berulang: grup yang terlihat sehat tiba-tiba kolaps karena <strong>utang silang</strong> antar anak perusahaan — yang satu jatuh, menarik yang lain (korelasi intra-grup ≈ 1). Analisis grup = analisis <strong>konsolidasi</strong>, bukan analisis per perusahaan.</p>

      <h3>1998: Pelajaran Konsentrasi Properti</h3>
      <p>Krisis 1998: bank-bank Indonesia terkonsentrasi di <strong>properti dan grup terafiliasi</strong> — saat properti jatuh, NPL meledak serentak (korelasi ≈ 1 di dalam sektor). Inilah trauma yang melahirkan BMPK yang ketat dan kehati-hatian terhadap <strong>related lending</strong> (kredit ke pihak terkait). Setiap analis kredit Indonesia bekerja di atas fondasi trauma 1998 — memahami sejarah ini menjelaskan mengapa aturannya seketat ini.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: HHI dan "biaya" konsentrasi (klik untuk buka)</summary>
        <p>Portofolio Rp 1.000 M: A 400 M, B 200 M, 8 debitur @50 M (contoh lesson).</p>
        <p><strong>Langkah 1</strong> — HHI = 0,4² + 0,2² + 8×0,05² = 0,16 + 0,04 + 0,02 = <strong>0,22</strong> (terkonsentrasi, &gt;0,10).<br />
        <strong>Langkah 2</strong> — bandingkan dengan portofolio tersebar sempurna (20 debitur @50 M): HHI = 20 × 0,05² = <strong>0,05</strong>.<br />
        <strong>Langkah 3</strong> — dari chart lesson: UL konsentrasi ≈ Rp 180 jt vs tersebar Rp 25 jt untuk EL yang sama (Rp 16 jt). <strong>"Harga" konsentrasi = Rp 155 jt modal tambahan</strong> — untuk portofolio Rp 1 M yang sama!</p>
        <p><strong>Pelajaran:</strong> konsentrasi bukan sekadar "risiko" abstrak — ia punya <strong>harga modal</strong> yang konkret. Rp 155 jt modal yang terkunci = Rp 155 jt yang tidak bisa disalurkan sebagai kredit baru. Inilah biaya opportunity konsentrasi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Patuh BMPK = terdiversifikasi. Selesai."</strong></p>
        <p><strong>Yang benar:</strong> BMPK membatasi per nama/grup — tetapi 30 debitur batubara @3% modal = 90% eksposur satu faktor, dan semuanya patuh BMPK! Diversifikasi sejati butuh <strong>limit sektor + analisis korelasi</strong>. BMPK adalah pagar minimum, bukan strategi diversifikasi.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Sindikasi Rp 500 M</h2>
      <div className="callout">
        <p>Bank Nusantara ditawari memimpin <strong>sindikasi Rp 500 M</strong> ke perusahaan tambang (margin 5%, PD 3%, LGD 40%). Modal bank Rp 4 T. Saat ini eksposur tambang bank: <strong>Rp 800 M</strong> (dari total kredit Rp 20 T).</p>
        <ul>
          <li>EL tambahan: 0,03 × 0,4 × 500 = <strong>Rp 6 M</strong> — kecil, "murah".</li>
          <li>Tapi: porsi tambang menjadi Rp 1,3 T (6,5% portofolio) + korelasi sektor tinggi.</li>
          <li>BMPK: 500/4000 = 12,5% modal — di bawah batas 20%, <strong>lolos hukum</strong>.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> ikut atau tidak? Analisis melampaui "lolos BMPK".</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Lolos hukum ≠ lolos risiko.</strong> Analisis:</p>
          <p>(1) <strong>Konsentrasi sektor:</strong> 6,5% di satu sektor siklikal — jika harga batubara jatuh 40% (pernah terjadi), PD sektor bisa 3%→9% <em>serentak</em> (korelasi!). EL sektor: 0,09×0,5×1300 = Rp 58,5 M vs Rp 15,6 M normal — <strong>UL sektoral raksasa</strong>.<br />
          (2) <strong>Harga tidak sepadan:</strong> margin 5% terlihat menarik, tapi setelah dihitung <strong>RAROC</strong> (return per modal UL — CR21), kemungkinan di bawah hurdle rate bank.<br />
          (3) <strong>Keputusan:</strong> ikut <strong>sebagian</strong> (misal Rp 150 M) + jual sisanya (sub-partisipasi), ATAU minta pricing lebih tinggi + covenant harga komoditas. Pelajaran: <strong>BMPK adalah lantai hukum, bukan persetujuan risiko</strong>.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: 30 Debitur, Satu Risiko</h2>
      <div className="callout">
        <p>Bank Nusantara bangga: "Tidak ada debitur di atas 5% modal — kami patuh BMPK dan terdiversifikasi!" Data: 30 debitur, masing-masing 3% modal (total 90% dari portofolio komersial) — <strong>semuanya perusahaan batubara di Kalimantan</strong>.</p>
        <ul>
          <li>HHI per nama: 30 × 0,03² = 0,027 — terlihat tersebar sempurna!</li>
          <li>Harga batubara jatuh 50% dalam setahun.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apa yang salah dengan klaim "terdiversifikasi"? Hitung ulang risiko dengan lensa faktor dan jelaskan mengapa HHI per nama menipu di sini.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Yang salah:</strong> HHI per nama mengukur konsentrasi <strong>nama</strong>, bukan konsentrasi <strong>faktor</strong>. 30 nama dengan korelasi ≈ 1 (satu harga komoditas, satu wilayah) = <strong>satu risiko raksasa</strong> yang dibagi 30 amplop.</p>
          <p><strong>Hitungan lensa faktor:</strong> perlakukan 30 debitur sebagai <strong>satu eksposur faktor</strong> 90% portofolio → HHI faktor = 0,9² = <strong>0,81</strong> — konsentrasi ekstrem! Saat harga batubara jatuh 50%, PD melonjak serentak di 30 debitur (bukan independen) — kerugian portofolio ≈ 30 × kerugian individual, tanpa manfaat diversifikasi sama sekali.</p>
          <p><strong>Pelajaran:</strong> diversifikasi = sebar across <strong>faktor risiko</strong> (sektor, wilayah, ukuran), bukan sekadar jumlah nama. "100 debitur beda nama = terdiversifikasi" adalah miskonsepsi paling mahal di lesson ini.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dua portofolio Rp 1 M: 100 debitur vs 5 debitur. PD, LGD sama. Mana benar?"
        options={[
          "Risiko sama — EL-nya sama",
          "UL portofolio 5 debitur 5–7× lipat — EL sama, sebaran (UL) beda; konsentrasi membayar 'pajak' modal",
          "Portofolio 5 debitur lebih aman (mudah dimonitor)",
          "Tidak bisa dibandingkan",
        ]}
        correct={1}
        explanation="Benar: EL = rata-rata; UL = sebaran. Konsentrasi melebarkan sebaran tanpa mengubah rata-rata — dan modal membayar sebaran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. HHI = 0,22. Interpretasi?"
        options={[
          "Tersebar baik",
          "Terkonsentrasi (>0,10) — satu/beberapa debitur mendominasi; butuh perhatian modal & limit",
          "HHI tidak penting",
          "Semakin tinggi semakin baik",
        ]}
        correct={1}
        explanation="Benar: 0,22 > 0,10 = terkonsentrasi. HHI mengkuadratkan pangsa — debitur 40% sendiri menyumbang 0,16."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 100 debitur semuanya perusahaan batubara Kalimantan. Terdiversifikasi?"
        options={[
          "Ya — 100 nama beda",
          "Tidak — satu faktor risiko (harga batubara); diversifikasi sejati = antar faktor (sektor/wilayah/segmen)",
          "Ya — Kalimantan luas",
          "Tergantung PD-nya",
        ]}
        correct={1}
        explanation="Benar: 100 nama, satu risiko. Korelasi tinggi = tenggelam bersama. Ini wrong-way concentration klasik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam model Vasicek, peran korelasi ρ?"
        options={[
          "Tidak ada — hanya PD yang penting",
          "ρ menentukan seberapa 'bersama' debitur gagal — makin tinggi, ekor distribusi kerugian makin tebal, VaR & modal makin besar",
          "ρ menurunkan modal",
          "ρ hanya untuk pasar saham",
        ]}
        correct={1}
        explanation="Benar: ρ = perekat. Tanpa korelasi, hukum bilangan besar menjinakkan portofolio; dengan korelasi, ekor tebal membutuhkan modal besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Sindikasi Rp 500 M lolos BMPK (12,5% < 20%). Berarti aman?"
        options={[
          "Ya — hukum sudah membolehkan",
          "Belum tentu — BMPK = lantai hukum; analisis konsentrasi sektor, korelasi, dan RAROC bisa menyimpulkan 'terlalu mahal risikonya'",
          "Ya — margin 5% pasti untung",
          "Tidak — tolak semua sindikasi",
        ]}
        correct={1}
        explanation="Benar: kepatuhan ≠ kehati-hatian. BMPK mencegah kebangkrutan tunggal; manajemen konsentrasi mencegah erosi modal perlahan."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. 30 debitur batubara @3% modal (total 90% portofolio), semua patuh BMPK. HHI per nama 0,027 (tersebar). Apakah terdiversifikasi?"
        options={[
          "Ya — patuh BMPK dan HHI rendah",
          "Tidak — korelasi ≈ 1 (satu harga komoditas): ini satu risiko raksasa dalam 30 amplop; HHI faktor = 0,81 (ekstrem)",
          "Ya — 30 nama cukup banyak",
          "Tidak bisa dinilai",
        ]}
        correct={1}
        explanation="Benar: diversifikasi = sebar across faktor risiko, bukan jumlah nama. 30 debitur satu sektor = satu risiko. BMPK membatasi nama; limit sektor + analisis korelasi membatasi faktor."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Limit sektor 95% terpakai, proposal tambang individual bagus masuk. Keputusan terbaik?"
        options={[
          "Setujui — proposalnya bagus, itu yang penting",
          "Tolak dengan penjelasan portofolio, atau setujui dengan harga konsentrasi (pricing + tenor + covenant) — limit yang dilanggar diam-diam bukan limit",
          "Naikkan limit diam-diam",
          "Serahkan ke direksi tanpa rekomendasi",
        ]}
        correct={1}
        explanation="Benar: disiplin portofolio mengalahkan kecemerlangan individual. Opsi sehat: tolak dengan alasan keranjang penuh, atau setujui dengan harga yang mencerminkan modal tambahan untuk UL. Melanggar limit diam-diam menghancurkan governance."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Konsentrasi</strong> melebarkan sebaran (UL) tanpa mengubah rata-rata (EL) — diukur HHI.</li>
          <li><strong>Korelasi default</strong> = tenggelam bersama; menciptakan ekor tebal yang membunuh bank.</li>
          <li><strong>Vasicek</strong>: faktor bersama (ρ) + idiosinkratik → distribusi kerugian → <strong>Credit VaR = UL + EL</strong>.</li>
          <li><strong>Rantai modal</strong>: PD/LGD/EAD → Vasicek → VaR 99,9% → UL → modal (Pilar 1 IRB).</li>
          <li><strong>BMPK</strong> = batas hukum OJK; bukan persetujuan risiko.</li>
          <li>Kapan TIDAK khawatir konsentrasi: eksposur kecil absolut + granular + faktor tersebar — di sana EL mendominasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr14b-ecl-perhitungan" className="btn btn-secondary btn-sm">← CR14b</Link>
        <Link href="/learn/cr16-stress-testing" className="btn btn-primary btn-sm">Next: CR16 →</Link>
      </div>
    </div>
  );
}
