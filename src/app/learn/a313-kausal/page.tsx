"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A313Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const rctData = [
    {
      x: ["Kontrol", "Treatment"],
      y: [12.0, 9.5],
      name: "Default rate (%)",
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1"] },
      text: ["12,0%", "9,5%"],
      textposition: "outside",
    },
  ];

  const didData = [
    {
      x: ["Sebelum", "Sesudah"],
      y: [10.0, 10.5],
      mode: "lines+markers",
      type: "scatter",
      name: "Kontrol (tak dapat program)",
      line: { color: "#94a3b8", width: 3 },
      marker: { size: 10 },
    },
    {
      x: ["Sebelum", "Sesudah"],
      y: [11.0, 8.0],
      mode: "lines+markers",
      type: "scatter",
      name: "Treatment (dapat program)",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 10 },
    },
  ];

  const dagData = [
    {
      x: [1, 3, 2],
      y: [2, 2, 1],
      mode: "markers+text",
      type: "scatter",
      name: "",
      marker: { color: "#2a7de1", size: 40 },
      text: ["X<br>edukasi", "Y<br>default", "Z<br>pendapatan"],
      textposition: "middle center",
    },
  ];

  const lab1Code = `# RCT simulasi: kenapa randomisasi = emas kausal
# Program edukasi keuangan. Efek BENAR: -3 poin default.
# Masalah: yang ikut program biasanya yang SUDAH rajin (seleksi!).
import random, math
random.seed(101)

n = 2000
# 'kerajinan' tak teramati -> mempengaruhi ikut program DAN default
rajin = [random.gauss(0, 1) for _ in range(n)]

# Skenario OBSERVASIONAL: yang rajin lebih mungkin ikut
ikut_obs = [1 if random.random() < 1/(1+math.exp(-(0.5*r))) else 0 for r in rajin]
# Skenario RCT: ikut/tidak acak murni
ikut_rct = [random.randint(0, 1) for _ in range(n)]

def default_rate(ikut, rajin, efek_benar=-0.03):
    y = []
    for d, r in zip(ikut, rajin):
        p = 0.15 - 0.04*r + efek_benar*d   # rajin menurunkan default; program -3 poin
        y.append(1 if random.random() < max(p, 0.01) else 0)
    return y

y_obs = default_rate(ikut_obs, rajin)
y_rct = default_rate(ikut_rct, rajin)

def diff(y, ikut):
    t = [v for v, d in zip(y, ikut) if d == 1]
    c = [v for v, d in zip(y, ikut) if d == 0]
    return sum(t)/len(t) - sum(c)/len(c)

print(f"Efek BENAR program: -3.0 poin")
print(f"Estimasi OBSERVASIONAL (tanpa randomisasi): {diff(y_obs, ikut_obs)*100:+.1f} poin")
print(f"Estimasi RCT (randomisasi)               : {diff(y_rct, ikut_rct)*100:+.1f} poin")
print()
print("Observasional MELEBIH-LEBIHKAN efek (seleksi: yang ikut memang")
print("lebih rajin). RCT memutus panah 'rajin -> ikut' via randomisasi,")
print("sehingga perbandingan treatment vs kontrol = apel vs apel.")
print()
print("COBA: hilangkan seleksi (ikut_obs acak juga). Observasional kini")
print("jujur - seleksi adalah SATU-SATUNYA sumber bias di simulasi ini.")`;

  const lab2Code = `# Difference-in-Differences dari nol
# Program restrukturisasi di Cabang A (treatment), Cabang B kontrol.
# Efek benar: -2.5 poin. Ada tren waktu umum +0.5 (ekonomi memburuk).
import random
random.seed(202)

def gen(cabang_treat, n=800):
    # baseline beda antar cabang (A lebih berisiko dari sananya)
    base = 0.10 if cabang_treat else 0.08
    sebelum = [1 if random.random() < base else 0 for _ in range(n)]
    sesudah_p = base + 0.005 + (-0.025 if cabang_treat else 0)
    sesudah = [1 if random.random() < sesudah_p else 0 for _ in range(n)]
    return sum(sebelum)/n, sum(sesudah)/n

a0, a1 = gen(True); b0, b1 = gen(False)
did = (a1 - a0) - (b1 - b0)
naif_sesudah = a1 - b1          # bandingkan sesudah saja (SALAH)
naif_tren = a1 - a0             # sebelum-sesudah treatment saja (SALAH)

print(f"Cabang A (treatment): {a0:.1%} -> {a1:.1%} (selisih {a1-a0:+.1%})")
print(f"Cabang B (kontrol)  : {b0:.1%} -> {b1:.1%} (selisih {b1-b0:+.1%})")
print()
print(f"Estimasi NAIF (sesudah saja)      : {naif_sesudah*100:+.1f} poin <- bias seleksi!")
print(f"Estimasi NAIF (sebelum-sesudah A) : {naif_tren*100:+.1f} poin <- tercemar tren waktu!")
print(f"Estimasi DiD (benar)              : {did*100:+.1f} poin (benar: -2.5)")
print()
print("DiD = (perubahan treatment) - (perubahan kontrol).")
print("Asumsi kunci: PARALLEL TRENDS - tanpa program, A akan bergerak")
print("seperti B. Uji: plot tren pra-program, harus sejajar!")
print("COBA: buat baseline A=B (0.08). Estimasi naif 'sesudah saja' kini")
print("benar - seleksi hilang, tapi DiD TETAP lebih aman.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.13 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Inferensi Kausal:<br />Dari &ldquo;Berhubungan&rdquo; ke &ldquo;Menyebabkan&rdquo;</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#prasyarat">Prasyarat 2 Menit: Batas Regresi</a></li>
          <li><a href="#cerita">Cerita Pembuka: Program Sukses yang Membunuh Nasabah</a></li>
          <li><a href="#potensial">Potential Outcomes — Bahasa Formal &ldquo;Seandainya&rdquo;</a></li>
          <li><a href="#rct">RCT — Standar Emas (dan Batasnya)</a></li>
          <li><a href="#quasi">Eksperimen Kuasi: DiD, RDD, IV</a></li>
          <li><a href="#dag">DAG — Peta Kecurigaan Confounding</a></li>
          <li><a href="#lab1">🔬 Lab 1: RCT vs Observasional — Seleksi Menipu</a></li>
          <li><a href="#lab2">🔬 Lab 2: Difference-in-Differences dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Desain Kausal Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Apakah Reminder Menurunkan Default?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kerangka potential outcomes dan masalah fundamental inferensi kausal.</li>
          <li>Menjelaskan mengapa RCT mengidentifikasi efek kausal dan apa batasnya di dunia perbankan.</li>
          <li>Membandingkan DiD, RDD, dan IV: asumsi identifikasi masing-masing dan kapan dipakai.</li>
          <li>Menggambar DAG sederhana untuk mengidentifikasi confounder vs collider vs mediator.</li>
        </ul>
      </div>

      {/* PRASYARAT */}
      <h2 id="prasyarat">📦 Prasyarat 2 Menit: Batas Regresi</h2>
      <div className="callout">
        <p>Sejak A3.1 kita mengulang mantra: <strong>koefisien regresi = asosiasi terkontrol, bukan kausalitas</strong>. Lesson ini akhirnya menjawab &ldquo;lalu bagaimana caranya tahu sebab-akibat?&rdquo;. Bekalmu: (1) <strong>omitted variable bias</strong> (A3.1) — variabel tak teramati yang berkorelasi dengan <Tex math={String.raw`x`} /> merusak interpretasi; (2) <strong>Simpson&apos;s paradox</strong> (A1.6) — agregat bisa berlawanan arah dengan subgrup; (3) <strong>eksogenitas</strong> <Tex math={String.raw`E[\varepsilon|X]=0`} /> — asumsi yang hampir tidak pernah benar-benar terpenuhi di data observasional. Inferensi kausal adalah disiplin <em>kapan</em> kita boleh mengklaim sebab-akibat — dan kebanyakan jawabannya adalah &ldquo;tidak, kecuali...&rdquo;.</p>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Program Sukses yang Membunuh Nasabah</h2>
      <div className="story">
        <p>Bank meluncurkan &ldquo;Program Sehat Finansial&rdquo; — edukasi + restrukturisasi untuk nasabah berisiko. Setahun kemudian, evaluasi: nasabah peserta program default <strong>18%</strong>, non-peserta <strong>9%</strong>. Kesimpulan manajemen: &ldquo;program <em>menyebabkan</em> default naik 2× lipat — hentikan!&rdquo;</p>
        <p>Analis yang teliti melihat <em>siapa</em> yang ikut: program ditawarkan ke nasabah yang <strong>sudah menunggak 60+ hari</strong> — kelompok yang memang berisiko tinggi dari sananya! Membandingkan peserta vs non-peserta = membandingkan apel busuk vs apel segar, lalu menyalahkan programnya. Setelah dibandingkan dengan kelompok kontrol yang <em>setara risikonya</em>, program ternyata <strong>menurunkan</strong> default 3 poin.</p>
        <p>Twist-nya: angka 18% vs 9% itu <strong>benar secara matematis</strong> — yang salah adalah lompatan ke &ldquo;menyebabkan&rdquo;. Inilah <strong>selection bias</strong>: perbedaan yang diamati mencerminkan <em>siapa yang dipilih</em>, bukan <em>efek perlakuan</em>. Seluruh lesson ini tentang memisahkan keduanya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="potensial">Potential Outcomes — Bahasa Formal &ldquo;Seandainya&rdquo;</h2>
      <p><strong>Definisi.</strong> Untuk tiap individu <Tex math={String.raw`i`} />, ada dua <strong>potential outcomes</strong>:</p>
      <Tex math={String.raw`Y_i(1) = \text{hasil JIKA diberi treatment}, \qquad Y_i(0) = \text{hasil JIKA tidak}`} block />
      <p>Efek kausal individu: <Tex math={String.raw`\tau_i = Y_i(1) - Y_i(0)`} />. Target umum: <strong>ATE</strong> (<em>average treatment effect</em>) = <Tex math={String.raw`E[Y(1) - Y(0)]`} />.</p>
      <p><strong>Masalah fundamental inferensi kausal:</strong> kita hanya mengamati <strong>satu</strong> dari keduanya! Nasabah yang ikut program: kita lihat <Tex math={String.raw`Y_i(1)`} />, tapi <Tex math={String.raw`Y_i(0)`} />-nya (seandainya ia <em>tidak</em> ikut) <strong>tidak pernah teramati</strong> — itu <em>counterfactual</em>. Yang teramati:</p>
      <Tex math={String.raw`Y_i = D_i Y_i(1) + (1-D_i)Y_i(0), \quad D_i \in \{0,1\}`} block />
      <p>Perbandingan naif <Tex math={String.raw`E[Y|D=1] - E[Y|D=0]`} /> = ATE + <strong>selection bias</strong>:</p>
      <Tex math={String.raw`\underbrace{E[Y|D=1]-E[Y|D=0]}_{\text{teramati}} = \underbrace{E[Y(1)-Y(0)]}_{\text{ATE}} + \underbrace{\big(E[Y(0)|D=1]-E[Y(0)|D=0]\big)}_{\text{selection bias}}`} block />
      <p>Selection bias = &ldquo;seandainya peserta <em>tidak</em> ikut, apakah mereka sama dengan non-peserta?&rdquo; — dalam cerita pembuka: <strong>tidak</strong> (mereka lebih berisiko dari sananya).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap klaim kausal diam-diam membandingkan dengan <strong>dunia paralel yang tidak terjadi</strong>. &ldquo;Program menurunkan default 3 poin&rdquo; artinya &ldquo;dibanding dunia di mana peserta yang <em>sama persis</em> tidak ikut program&rdquo;. Seluruh metode kausal — RCT, DiD, RDD, IV — hanyalah cara berbeda membangun <strong>pengganti yang kredibel</strong> untuk dunia paralel itu. Jika kamu tidak bisa menjelaskan &ldquo;counterfactual saya adalah...&rdquo;, kamu tidak punya klaim kausal.</p>
      </div>

      <h2 id="rct">RCT — Standar Emas (dan Batasnya)</h2>
      <p><strong>Definisi.</strong> RCT (<em>randomized controlled trial</em>): alokasikan treatment <strong>acak</strong>. Randomisasi membuat <Tex math={String.raw`D_i`} /> independen dari <Tex math={String.raw`\{Y_i(0), Y_i(1)\}`} /> → selection bias = 0 → perbandingan rata-rata = ATE:</p>
      <Tex math={String.raw`E[Y|D=1] - E[Y|D=0] = E[Y(1) - Y(0)] = ATE \quad \text{(dengan randomisasi)}`} block />

      <PlotlyChart
        data={rctData}
        title="RCT: default rate treatment vs kontrol"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang — kelompok kontrol vs treatment dari RCT.</p>
        <p><strong>Interpretasi:</strong> selisih 12,0% − 9,5% = <strong>−2,5 poin = ATE</strong> — kredibel <em>karena</em> randomisasi. Tanpa randomisasi, selisih yang sama bisa berarti apa saja (seleksi). <strong>Harga yang dibayar:</strong> biaya, waktu, dan masalah etika — tidak bisa mengacak siapa yang <em>ditolak kreditnya</em>.</p>
      </div>

      <p><strong>Batas RCT di perbankan:</strong> (1) <strong>etika/bisnis</strong> — tidak bisa mengacak penolakan kredit atau suku bunga punitive; (2) <strong>eksternalitas</strong> — efek di satu segmen belum tentu berlaku di segmen lain (<em>external validity</em>); (3) <strong>Hawthorne</strong> — peserta yang tahu diobservasi berperilaku beda; (4) <strong>mahal &amp; lambat</strong> — butuh sampel besar untuk efek kecil. Makanya industri butuh eksperimen kuasi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;A/B testing di produk digital = RCT sempurna.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> A/B test digital mendekati RCT <em>hanya jika</em> randomisasi bersih: tidak ada <strong>interferensi antar unit</strong> (SUTVA — treatment ke A tidak mempengaruhi B; rusak jika nasabah saling berbagi info promo!), tidak ada <strong>attrition selektif</strong> (yang dropout dari treatment beda dari kontrol), dan <strong>novelty effect</strong> (respons awal ≠ respons jangka panjang). A/B test yang &ldquo;signifikan&rdquo; di minggu pertama bisa hilang di bulan ketiga.</p>
      </div>

      <h2 id="quasi">Eksperimen Kuasi: DiD, RDD, IV</h2>
      <p><strong>Definisi.</strong> Ketika randomisasi mustahil, tiga desain andalan:</p>
      <ul>
        <li><strong>DiD</strong> (<em>difference-in-differences</em>): bandingkan <em>perubahan</em> kelompok treatment vs kontrol, sebelum vs sesudah:
          <Tex math={String.raw`\hat{\tau}_{DiD} = (\bar{Y}_{T,post} - \bar{Y}_{T,pre}) - (\bar{Y}_{C,post} - \bar{Y}_{C,pre})`} block />
          <strong>Asumsi kunci: parallel trends</strong> — tanpa treatment, kedua kelompok akan bergerak sejajar. Uji: plot tren pra-periode harus sejajar! DiD membuang <em>perbedaan level</em> antar kelompok (seleksi) dan <em>tren waktu umum</em> sekaligus — dua burung satu batu.</li>
        <li><strong>RDD</strong> (<em>regression discontinuity design</em>): treatment diberikan berdasarkan <strong>ambang</strong> skor (misal kredit disetujui jika skor ≥ 650). Bandingkan yang <em>sedikit di atas</em> vs <em>sedikit di bawah</em> ambang — mereka nyaris identik kecuali treatment. <strong>Asumsi:</strong> tidak ada manipulasi tepat di ambang (tidak ada yang &ldquo;melompat&rdquo; melewati 650 secara strategis). Efek yang diidentifikasi = <strong>LATE</strong> (<em>local</em> — hanya di sekitar ambang!).</li>
        <li><strong>IV</strong> (<em>instrumental variables</em>): cari <strong>instrumen</strong> <Tex math={String.raw`Z`} /> yang (1) <strong>relevan</strong>: mempengaruhi <Tex math={String.raw`D`} /> (treatment), tapi (2) <strong>exclusion</strong>: hanya mempengaruhi <Tex math={String.raw`Y`} /> <em>melalui</em> <Tex math={String.raw`D`} />. Contoh klasik: jarak ke cabang sebagai instrumen untuk &ldquo;punya rekening bank&rdquo;. Estimator Wald: <Tex math={String.raw`\hat{\tau}_{IV} = \frac{Cov(Z,Y)}{Cov(Z,D)}`} />. <strong>Bahaya:</strong> instrumen lemah (relevansi kecil) → estimasi liar; exclusion tidak bisa diuji dari data — harus argumen domain!</li>
      </ul>

      <PlotlyChart
        data={didData}
        title="Difference-in-Differences: mengisolasi efek program"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Default rate (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua garis (kontrol abu-abu, treatment biru) di dua titik waktu.</p>
        <p><strong>Interpretasi:</strong> treatment turun 11→8 (−3), kontrol naik 10→10,5 (+0,5, tren waktu umum). DiD = −3 − (+0,5) = <strong>−3,5 poin</strong>. Perbandingan naif &ldquo;sesudah saja&rdquo; (8 vs 10,5 = −2,5) tercemar perbedaan baseline; &ldquo;sebelum-sesudah treatment saja&rdquo; (−3) tercemar tren waktu. DiD membersihkan keduanya — <em>jika</em> parallel trends benar.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan &ldquo;kartu identitas&rdquo; tiap metode — <strong>apa asumsi yang tidak bisa ditawar</strong>: RCT = randomisasi bersih (SUTVA); DiD = parallel trends; RDD = tanpa manipulasi di ambang (+ efek hanya lokal!); IV = exclusion restriction (tak teruji!). Saat membaca klaim kausal orang lain, langsung tanya asumsi kartu identitasnya — di situlah 90% klaim kausal runtuh.</p>
      </div>

      <h2 id="dag">DAG — Peta Kecurigaan Confounding</h2>
      <p><strong>Definisi.</strong> DAG (<em>directed acyclic graph</em>) = diagram panah sebab-akibat. Tiga peran variabel terhadap hubungan X → Y:</p>
      <ul>
        <li><strong>Confounder</strong> (Z → X dan Z → Y): <em>wajib</em> dikontrol. Contoh: pendapatan → (ikut program, default). Tidak dikontrol → bias.</li>
        <li><strong>Mediator</strong> (X → M → Y): jalur <em>melalui</em> mana X bekerja. <strong>Jangan</strong> dikontrol jika ingin efek total! (Mengontrol mediator = memblokir mekanisme yang ingin diukur.)</li>
        <li><strong>Collider</strong> (X → C ← Y): <strong>JANGAN</strong> dikontrol! Mengontrol collider <em>membuka</em> jalur bias yang tadinya tertutup (<em>Berkson&apos;s paradox</em>). Contoh: teliti &ldquo;efek rajin → IPK&rdquo; hanya di mahasiswa <em>beasiswa</em> (beasiswa ← rajin, beasiswa ← IPK) → muncul korelasi palsu.</li>
      </ul>
      <p>Aturan <strong>backdoor criterion</strong>: kontrol set variabel yang <strong>menutup semua jalur backdoor</strong> (jalur X ← ... → Y) <em>tanpa</em> membuka collider atau memblokir mediator. &ldquo;Kontrol semua variabel&rdquo; adalah strategi yang <strong>salah</strong> — kontrol yang salah lebih buruk dari tidak kontrol!</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Masukkan semua variabel kontrol yang ada — makin banyak makin bersih.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kontrol buta bisa <em>menambah</em> bias! Mengontrol mediator menghapus efek yang ingin diukur (overcontrol); mengontrol collider menciptakan bias dari ketiadaan (Berkson). DAG memaksa berpikir <em>struktur</em> sebelum regresi. Tidak ada jumlah variabel kontrol yang menyelamatkan DAG yang salah.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Inferensi kausal = &ldquo;dari berhubungan ke menyebabkan&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Propensity score — obat &amp; keparahan</summary>
              <p>Data observasional: 1.000 pasien, 300 dapat obat (cenderung berat), 700 tidak. Efek obat?</p>
              <p><strong>Langkah 1</strong> — naive: sembuh 50% (obat) vs 60% (tidak) — obat &ldquo;buruk&rdquo;?! (Confounding: yang berat → diobati.)<br />
              <strong>Langkah 2</strong> — propensity score: P(obat | keparahan, usia, …) via logistik. Matching: tiap pasien obat dipasangkan dengan non-obat ber-skor mirip.<br />
              <strong>Langkah 3</strong> — setelah matching: 55% vs 45% → efek <strong>+10 poin</strong>. (Asumsi: <em>unconfoundedness</em> — semua confounder terukur!)</p>
              <p>Pelajaran: matching = &ldquo;RCT tiruan&rdquo;. Kekuatan &amp; kelemahannya sama: sebagus <em>confounder yang terukur</em>. Yang tak terukur tetap mengancam.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: RDD — beasiswa &amp; nilai 70</summary>
              <p>Beasiswa untuk nilai ≥ 70. Bandingkan yang 69 vs 70 — efek beasiswa pada kelulusan?</p>
              <p><strong>Langkah 1</strong> — di sekitar cutoff, 69 vs 70 ≈ <em>acak</em> (tidak ada yang bisa presisi mengontrol nilai!) → seperti RCT lokal.<br />
              <strong>Langkah 2</strong> — efek = lompatan outcome di cutoff: kelulusan 75% (70) vs 65% (69) → <strong>+10 poin</strong>.<br />
              <strong>Langkah 3</strong> — cek: tidak ada <em>manipulasi</em> (penumpukan tepat di 70?) — McCrary test. Dan efek = <em>lokal</em> (hanya di sekitar 70, bukan untuk semua!).</p>
              <p>Pelajaran: RDD = &ldquo;eksperimen alami&rdquo; dari aturan threshold. Syarat: tidak ada sorting di cutoff + efek lokal. Banyak kebijakan (kredit! pajak!) punya threshold → RDD-lah.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: RCT vs Observasional — Seleksi Menipu</h2>
      <p>Simulasi dengan confounder tak teramati (&ldquo;kerajinan&rdquo;). Lihat observasional melebih-lebihkan efek, RCT jujur.</p>
      <PyodideLab
        title="Lab 1 — Selection Bias vs Randomisasi"
        hint="Hilangkan seleksi (buat ikut_obs acak) — observasional kini jujur. Seleksi = satu-satunya sumber bias."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Difference-in-Differences dari Nol</h2>
      <p>Hitung DiD dan dua estimasi naif. Lihat mengapa keduanya bias dan DiD benar.</p>
      <PyodideLab
        title="Lab 2 — DiD: Dua Burung Satu Batu"
        hint="Buat baseline A=B — estimasi naif 'sesudah saja' kini benar, tapi DiD tetap lebih aman."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Desain Kausal Mana?</h2>

      <div className="decision-card">
        <h3>1. Bisa mengacak, etis, murah → <strong>RCT / A/B test</strong></h3>
        <p><strong>Kondisi:</strong> intervensi bisa dialokasikan acak tanpa masalah etika.</p>
        <p><strong>Kenapa:</strong> standar emas — asumsi paling lemah, interpretasi paling bersih.</p>
        <p><strong>Contoh nyata:</strong> uji desain reminder pembayaran; uji pesan penagihan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ada kelompok kontrol + data sebelum-sesudah → <strong>DiD</strong></h3>
        <p><strong>Kondisi:</strong> program diluncurkan di sebagian unit/waktu; ada pembanding yang bergerak sejajar sebelumnya.</p>
        <p><strong>Kenapa:</strong> membuang seleksi level + tren waktu sekaligus.</p>
        <p><strong>Contoh nyata:</strong> evaluasi program restrukturisasi per cabang; dampak kebijakan baru.</p>
      </div>

      <div className="decision-card">
        <h3>3. Ada ambang aturan yang tegas → <strong>RDD</strong></h3>
        <p><strong>Kondisi:</strong> treatment ditentukan skor ≥ cutoff; tidak ada manipulasi di ambang.</p>
        <p><strong>Kenapa:</strong> nyaris-RCT di sekitar ambang. Tapi efek = lokal di ambang saja!</p>
        <p><strong>Contoh nyata:</strong> efek persetujuan kredit (skor ≥ 650) terhadap default.</p>
      </div>

      <div className="decision-card">
        <h3>4. Ada &ldquo;dorongan acak&rdquo; ke treatment → <strong>IV</strong></h3>
        <p><strong>Kondisi:</strong> ada instrumen yang relevan + exclusion kredibel (argumen domain!).</p>
        <p><strong>Kenapa:</strong> satu-satunya jalan saat seleksi tak teramati dan tak ada ambang/eksperimen.</p>
        <p><strong>Contoh nyata:</strong> efek literasi keuangan (instrumen: jarak ke cabang saat program).</p>
      </div>

      <div className="decision-card">
        <h3>5. Tidak ada desain di atas → <strong>jangan klaim kausal</strong></h3>
        <p><strong>Kondisi:</strong> hanya data observasional tanpa variasi eksogen.</p>
        <p><strong>Kenapa:</strong> regresi + banyak kontrol ≠ kausal. Laporkan sebagai asosiasi; usulkan eksperimen.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;nasabah yang download app lebih lancar&rdquo; — seleksi, bukan efek app.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Sebutkan counterfactual-mu</strong> — tanpa itu, tidak ada klaim kausal.</li>
          <li>Observasional: bedakan seleksi dari efek. Selalu.</li>
          <li>Tiap metode punya 1 asumsi tak-tertawar — hafalkan kartu identitasnya.</li>
          <li>DAG dulu sebelum regresi: confounder dikontrol, mediator &amp; collider JANGAN.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Apakah Reminder Menurunkan Default?</h2>
      <div className="callout">
        <p>Bank mengirim SMS reminder H-3 jatuh tempo ke 50.000 nasabah (dipilih acak dari 100.000; 50.000 sisanya kontrol). Hasil 6 bulan: default kelompok reminder 7,2%, kontrol 8,1%. Tim produk merayakan: &ldquo;reminder menurunkan default 0,9 poin!&rdquo;</p>
        <p>Audit menemukan: (a) 12% kelompok reminder <em>tidak menerima</em> SMS (nomor tidak valid) — tapi tetap dihitung sebagai &ldquo;treatment&rdquo;; (b) nasabah yang tahu dirinya &ldquo;diobservasi&rdquo; (ada survei kepuasan) perilakunya berubah; (c) efek di bulan 1–2 besar, bulan 5–6 hilang.</p>
        <p><strong>Pertanyaan:</strong> (a) Estimasi 0,9 poin itu apa (ITT/LATE/ATE)? (b) Apakah (b) dan (c) mengancam validitas? (c) Rekomendasi keputusan bisnis?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>ITT</strong> (<em>intent-to-treat</em>): efek <em>ditawari</em> reminder, bukan efek <em>menerima</em>. Dengan 12% non-compliance, efek pada yang benar-benar menerima (LATE/TOT) ≈ 0,9/0,88 ≈ <strong>1,02 poin</strong> (asumsi tidak ada defier). ITT adalah estimasi yang <em>policy-relevant</em> (inilah efek program di dunia nyata yang nomornya selalu ada yang invalid!).</p>
          <p>(b) <strong>(b) Hawthorne effect</strong> — mengancam <em>external validity</em>: efek mungkin menyusut saat survei dihentikan. <strong>(c) novelty/fatigue</strong> — efek memudar: bukan alasan menolak, tapi alasan menghitung <em>steady-state effect</em>, bukan efek bulan madu.</p>
          <p>(c) <strong>Lanjutkan dengan monitoring:</strong> ITT 0,9 poin × 50.000 nasabah × LGD rata-rata = penghematan yang jauh melebihi biaya SMS. Tapi ukur ulang tanpa survei (hilangkan Hawthorne) dan pantau fatigue — putuskan berdasarkan efek bulan 4–6, bukan bulan 1–2.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Bedakan ATE, ATT, LATE — kapan masing-masing relevan?</li>
              <li>IV: &ldquo;jarak ke kampus&rdquo; untuk efek pendidikan → gaji. Sebutkan 2 asumsi IV + 1 ancaman untuk masing-masing.</li>
              <li>Mengapa &ldquo;kontrol untuk semua variabel&rdquo; bisa <em>merusak</em> estimasi kausal? (Petunjuk: collider!)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>ATE</strong>: efek rata-rata <em>populasi</em> (kebijakan universal). <strong>ATT</strong>: efek pada yang <em>diobati</em> (evaluasi program). <strong>LATE</strong>: efek pada <em>complier</em> IV (yang perilakunya diubah instrumen) — lokal, tapi sering satu-satunya yang teridentifikasi!</p>
              <p><strong>2.</strong> (a) <strong>Relevansi</strong>: jarak memengaruhi sekolah — ancaman: instrumen lemah (F kecil → bias!). (b) <strong>Exclusion</strong>: jarak hanya via sekolah — ancaman: kampus di kota besar → akses kerja lebih baik (jalur langsung!).</p>
              <p><strong>3.</strong> <strong>Collider bias</strong>: mengontrol variabel yang <em>dipengaruhi</em> oleh treatment &amp; outcome (mis. &ldquo;dirawat di RS&rdquo; dipengaruhi keparahan &amp; obat) → <em>membuka</em> jalur bias yang tadinya tertutup! Aturan: kontrol <em>confounder</em> (sebab bersama), bukan collider/mediator.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Peserta program default 18%, non-peserta 9%. Klaim 'program menyebabkan default 2× lipat' — masalah?"
        options={[
          "Tidak ada — angka jelas",
          "Selection bias: peserta dipilih dari yang sudah berisiko (tunggakan 60+ hari). Perbandingan ini mengukur seleksi, bukan efek",
          "Sample kurang",
          "Harus pakai median",
        ]}
        correct={1}
        explanation="Benar: E[Y|D=1]−E[Y|D=0] = ATE + selection bias. Di sini selection bias mendominasi. Tanpa counterfactual yang kredibel (kelompok setara risiko), angka 18% vs 9% tidak mengatakan apa-apa tentang efek program."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa randomisasi membuat perbandingan rata-rata = efek kausal?"
        options={[
          "Sampel jadi besar",
          "Randomisasi memutus hubungan D dengan potential outcomes (Y(0),Y(1)) → selection bias = 0 → yang tersisa hanya ATE",
          "Menghilangkan variansi",
          "Membuat data normal",
        ]}
        correct={1}
        explanation="Benar: randomisasi menyeimbangkan SEMUA karakteristik (teramati maupun tak teramati) secara ekspektasi. Inilah satu-satunya metode yang tidak butuh asumsi 'tidak ada confounder tak teramati'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. DiD mensyaratkan 'parallel trends'. Cara memverifikasinya?"
        options={[
          "Tidak bisa — asumsi buta",
          "Plot tren KEDUA kelompok di periode PRA-program: harus bergerak sejajar. Jika tidak sejajar sebelum program, asumsi runtuh",
          "Lihat R²",
          "Tanya manajemen",
        ]}
        correct={1}
        explanation="Benar: parallel trends tidak bisa dibuktikan untuk periode pasca (counterfactual tak teramati), tapi bisa DIUJI di pra-periode. Tren pra yang tidak sejajar = red flag keras — cari kontrol lain atau metode lain."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. RDD: kredit disetujui jika skor ≥ 650. Efek yang diidentifikasi berlaku untuk?"
        options={[
          "Semua nasabah",
          "Hanya di sekitar ambang 650 (LATE lokal) — tidak bisa digeneralisasi ke skor 400 atau 800",
          "Hanya yang ditolak",
          "Seluruh populasi",
        ]}
        correct={1}
        explanation="Benar: RDD mengidentifikasi efek LOKAL di cutoff. Nasabah skor 651 vs 649 nyaris identik — tapi nasabah skor 400 sangat beda. Jangan ekstrapolasi efek ambang ke seluruh populasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Meneliti 'efek jam belajar → IPK' dengan mengontrol 'nilai UTS' (yang dipengaruhi jam belajar DAN kecerdasan). Masalah?"
        options={[
          "Tidak ada — kontrol bagus",
          "UTS adalah collider (← jam belajar, ← kecerdasan): mengontrolnya MEMBUKA jalur bias (Berkson's paradox)",
          "Harus kontrol lebih banyak",
          "UTS mediator — boleh dikontrol",
        ]}
        correct={1}
        explanation="Benar: collider yang dikontrol menciptakan korelasi palsu antara penyebabnya. Di antara mahasiswa dengan UTS sama, yang kurang cerdas harus lebih rajin (dan sebaliknya) — muncul hubungan palsu negatif antara rajin dan cerdas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Instrumen Z untuk D (treatment) memenuhi 'relevan' tapi 'exclusion' diragukan (Z mungkin mempengaruhi Y langsung). Akibat?"
        options={[
          "Tidak masalah — relevan sudah cukup",
          "Estimasi IV bias — dan exclusion TIDAK BISA diuji dari data, harus argumen domain. Instrumen meragukan = klaim kausal meragukan",
          "Gunakan OLS saja",
          "Perbesar sampel",
        ]}
        correct={1}
        explanation="Benar: exclusion adalah asumsi tak-teruji — fondasi IV berdiri di atas argumen substantif, bukan statistik. 'Instrumen' yang mempengaruhi Y langsung = confounder berkedok. Skeptisisme terhadap IV selalu sehat."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Potential outcomes:</strong> <Tex math={String.raw`\tau_i=Y_i(1)-Y_i(0)`} />; masalah fundamental = counterfactual tak teramati; naif = ATE + selection bias.</li>
          <li><strong>RCT</strong> = standar emas (randomisasi → selection bias 0); batas: etika, biaya, validitas eksternal, SUTVA.</li>
          <li><strong>DiD</strong> butuh parallel trends; <strong>RDD</strong> butuh tanpa manipulasi (efek lokal!); <strong>IV</strong> butuh exclusion tak-teruji.</li>
          <li><strong>DAG:</strong> confounder dikontrol; mediator &amp; collider JANGAN. Backdoor criterion.</li>
          <li><strong>Jangan</strong> klaim kausal dari observasional tanpa desain; jangan kontrol semua variabel buta-buta.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a312-survival-analysis" className="btn btn-secondary btn-sm">← A3.12</Link>
        <Link href="/learn/a314-explainability" className="btn btn-primary btn-sm">Next: A3.14 →</Link>
      </div>
    </div>
  );
}
