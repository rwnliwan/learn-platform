"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E17Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const invCurveData = [
    {
      x: ["2021", "2022-Q1", "2022-Q3", "2023", "2024"],
      y: [1.2, 0.4, -0.5, -1.0, -0.3],
      mode: "lines+markers",
      name: "Spread 10Y−2Y (pp, ilustratif AS)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const cycleData = [
    {
      x: ["Ekspansi awal", "Ekspansi lanjut", "Puncak", "Kontraksi", "Lembah"],
      y: [8, 12, 6, -4, -2],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#ef4444", "#94a3b8"] },
      text: ["+8%", "+12%", "+6%", "−4%", "−2%"],
      textposition: "outside",
    },
  ];

  const creditCycleData = [
    {
      x: ["Fase 1: Pemulihan", "Fase 2: Ekspansi", "Fase 3: Puncak", "Fase 4: Krisis"],
      y: [1.5, 1.2, 2.5, 6.0],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#e8a838", "#ef4444"] },
      text: ["1,5%", "1,2%", "2,5%", "6,0%"],
      textposition: "outside",
    },
  ];

  const pmiData = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu"],
      y: [52, 51, 49.5, 48, 47, 48.5, 50.5, 52],
      mode: "lines+markers",
      name: "PMI Manufaktur (ilustratif)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Klasifikasi bentuk yield curve (otomatis)
# Masukkan yield per tenor (%), program mengklasifikasi bentuknya.
yields = {
    "3 bulan": 5.5,
    "2 tahun": 5.0,
    "5 tahun": 5.2,
    "10 tahun": 5.8,
    "30 tahun": 6.1,
}
tenors = list(yields.keys())
vals = list(yields.values())

naik = sum(1 for i in range(len(vals)-1) if vals[i+1] > vals[i])
turun = sum(1 for i in range(len(vals)-1) if vals[i+1] < vals[i])

print("Yield curve:")
for t, v in yields.items():
    print(f"  {t:10s}: {v:.1f}%")
print()
if naik >= 3:
    print("-> NORMAL (menanjak): ekonomi sehat, ekspektasi normal.")
elif turun >= 3:
    print("-> INVERTED (menurun): WASPADA — pasar bertaruh resesi!")
else:
    print("-> FLAT/DATAR: transisi — pasar tidak yakin arah.")
print()
print("Coba: ubah jadi 3bln=6.5, 2thn=6.0, 5thn=5.5, 10thn=5.0, 30thn=4.8")`;

  const lab2Code = `# Lab 2 — Dashboard siklus: baca 4 indikator sekaligus
# Aturan sederhana: gabungkan sinyal jadi satu 'skor resesi'
indikator = {
    "Spread 10Y-2Y (pp)": -0.8,   # negatif = inverted = bahaya
    "PMI": 47.5,                   # < 50 = kontraksi
    "Inflasi (% yoy)": 6.2,        # tinggi = BI hawkish
    "Pengangguran (%)": 5.8,       # naik = melemah
}

skor = 0
aturan = []
if indikator["Spread 10Y-2Y (pp)"] < 0:
    skor += 2; aturan.append("Kurva inverted (+2 bahaya)")
if indikator["PMI"] < 50:
    skor += 2; aturan.append("PMI kontraksi (+2 bahaya)")
if indikator["Inflasi (% yoy)"] > 4:
    skor += 1; aturan.append("Inflasi panas (+1)")
if indikator["Pengangguran (%)"] > 5.5:
    skor += 1; aturan.append("Pengangguran naik (+1)")

print("Sinyal terbaca:")
for a in aturan: print("  -", a)
print(f"\\nSkor bahaya resesi: {skor}/6")
print("0-1: ekspansi | 2-3: waspada | 4+: siaga resesi")
print()
print("Coba: ubah semua ke angka 'sehat'. Skor jadi 0 — tapi ingat,")
print("indikator = kaca spion + perkiraan cuaca, BUKAN ramalan pasti.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E17 — Financial Markets</span>
        <h1 className="display-title">Membaca Siklus:<br />Dari Kurva ke Krisis</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Sinyal yang Selalu Benar?</a></li>
          <li><a href="#inversi">Inversi Yield Curve — Sirene Resesi</a></li>
          <li><a href="#siklus">Siklus Bisnis — Empat Musim Ekonomi</a></li>
          <li><a href="#kredit">Siklus Kredit — Pesta &amp; Mabuk Utang</a></li>
          <li><a href="#indikator">Indikator — Dasbor Pilot Ekonomi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Klasifikasi Yield Curve</a></li>
          <li><a href="#lab2">🔬 Lab 2: Dashboard Skor Resesi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Posisi per Fase Siklus</a></li>
          <li><a href="#case">📋 Mini-Case: 2022 — Inversi Tanpa Resesi?</a></li>
          <li><a href="#worked1">🔬 Worked Example: Membaca Inversi Kurva</a></li>
          <li><a href="#worked2">🔬 Worked Example: Pertumbuhan Riil vs Nominal</a></li>
          <li><a href="#konteks">🌍 Konteks: 2020 — Resesi Tersingkat, Pemulihan Terliar</a></li>
          <li><a href="#indikator">🔧 Pendalaman: Tiga Jenis Indikator</a></li>
          <li><a href="#dalio">🔧 Pendalaman: Siklus Utang Besar Ray Dalio</a></li>
          <li><a href="#worked4">🔬 Worked Example: Rasio Utang/PDB — Kapan Berbahaya?</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa inversi yield curve memprediksi resesi dan keterbatasannya.</li>
          <li>Menggambarkan empat fase siklus bisnis beserta karakteristik tiap fase.</li>
          <li>Menjelaskan siklus kredit (ekspansi → puncak → krisis) dan perannya dalam krisis finansial.</li>
          <li>Membaca indikator leading/lagging utama (PMI, inflasi, pengangguran, spread) untuk menilai posisi siklus.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Sinyal yang Selalu Benar?</h2>
      <div className="story">
        <p>Sejak 1976, setiap kali <strong>yield curve AS terinversi</strong> (bunga jangka pendek &gt; jangka panjang), <strong>resesi selalu menyusul</strong> dalam 6–24 bulan. Delapan dari delapan. Rekor sempurna. Tahun 2022 kurva terinversi lagi — para ekonom menyiapkan liang resesi 2023… <strong>yang tidak datang-datang</strong> (atau datang sangat jinak).</p>
        <p>Apakah rekor sempurna itu rusak? Atau sinyalnya hanya <em>tertunda</em>? Lesson penutup track ini merangkum <strong>cara membaca denyut ekonomi</strong>: kurva, siklus, dan indikator — plus kerendahan hati bahwa <strong>siklus bukan ramalan</strong>, melainkan <em>manajemen probabilitas</em>.</p>
        <p><strong>Twist-nya:</strong> rekor 8-dari-8 itu <strong>nyata</strong> — dan tetap tidak memberitahumu <em>kapan</em>, <em>seberapa dalam</em>, atau <em>apakah kali ini berbeda</em>. Indikator ekonomi seperti <strong>ramalan cuaca</strong>: &ldquo;80% hujan&rdquo; tidak bilang jam berapa, di mana persisnya, atau apakah kamu butuh payung atau jas hujan. Investor yang memakai sinyal makro sebagai <em>ramalan pasti</em> akan kecewa; yang memakainya sebagai <strong>manajemen probabilitas</strong> — menyiapkan payung <em>dan</em> kacamata hitam — akan bertahan. Lesson ini: cara membaca langit, tanpa jadi peramal cuaca gadungan.</p>
      </div>

      <h2 id="inversi">Inversi Yield Curve — Sirene Resesi</h2>
      <p><strong>Definisi.</strong> <em>Inversi</em> = yield tenor <strong>pendek</strong> (2 tahun) <strong>lebih tinggi</strong> dari tenor <strong>panjang</strong> (10 tahun). Ukuran standar: <strong>spread 10Y−2Y &lt; 0</strong>.</p>
      <p><strong>Logika ekonominya</strong> (3 langkah):</p>
      <ol>
        <li>Bank sentral <strong>menaikkan</strong> bunga pendek untuk melawan inflasi → yield 2Y naik.</li>
        <li>Pasar yakin pengetatan ini akan <strong>mengerem ekonomi</strong> → bank sentral <em>terpaksa</em> memangkas bunga di masa depan → yield 10Y (rata-rata ekspektasi bunga masa depan) <strong>tetap rendah</strong>.</li>
        <li>Hasil: 2Y &gt; 10Y = pasar <strong>bertaruh</strong> pada perlambatan/resesi.</li>
      </ol>
      <p><strong>Kepribadian inversi:</strong> dia <em>alarm kebakaran</em> — berbunyi <strong>sebelum</strong> api terlihat (lead 6–24 bulan), tapi kadang <strong>false alarm</strong> (1998: inversi tanpa resesi AS) atau <strong>terlambat padam</strong> (2022–2024: resesi tak kunjung tiba karena pasar tenaga kerja kuat &amp; stimulus fiskal).</p>

      <PlotlyChart
        data={invCurveData}
        title="Menuju Inversi: Spread 10Y−2Y Menyelam ke Negatif (ilustratif AS)"
        layout={{ xaxis: { title: "Periode" }, yaxis: { title: "Spread (pp)" }, showlegend: false, shapes: [{ type: "line", x0: "2021", x1: "2024", y0: 0, y1: 0, line: { color: "#94a3b8", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = selisih yield 10 tahun minus 2 tahun. Di bawah nol = terinversi.</p>
        <p><strong>Interpretasi:</strong> 2021: +1,2 (normal). 2022-Q3: <strong>menyelam ke −0,5</strong> — sirene berbunyi. 2023: −1,0 (inversi dalam). Menurut sejarah, resesi &ldquo;seharusnya&rdquo; tiba 2023–2024. <strong>Pelajaran:</strong> sinyal = <strong>probabilitas, bukan kepastian</strong> — konteks (pasar kerja, fiskal) bisa menunda/meniadakan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kurva terinversi = jual semua saham SEKARANG.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> inversi memprediksi resesi 6–24 bulan ke depan — dan <strong>saham sering masih NAIK berbulan-bulan</strong> setelah inversi (puncak pasar biasanya <em>setelah</em> inversi!). Respons profesional: <strong>kurangi risiko bertahap</strong> (turunkan beta, tambah kualitas/likuiditas — E9, E8), bukan panik jual semua. <em>Timing</em> pasar dari satu sinyal = bunuh diri finansial.</p>
      </div>

      <h2 id="siklus">Siklus Bisnis — Empat Musim Ekonomi</h2>
      <p><strong>Definisi.</strong> <em>Siklus bisnis</em> = fluktuasi aktivitas ekonomi di sekitar tren jangka panjang. Empat fase:</p>
      <ol>
        <li><strong>Ekspansi awal (pemulihan):</strong> PDB naik dari lembah, pengangguran tinggi tapi turun, bunga rendah, <strong>saham siklikal &amp; small-cap</strong> memimpin.</li>
        <li><strong>Ekspansi lanjut:</strong> ekonomi panas, inflasi naik, bank sentral mengetatkan, <strong>komoditas &amp; value</strong> bersinar.</li>
        <li><strong>Puncak → kontraksi:</strong> pertumbuhan negatif 2 kuartal (<em>resesi teknis</em>), laba turun, <strong>defensif (konsumer, kesehatan) + obligasi</strong> bertahan.</li>
        <li><strong>Lembah:</strong> pesimisme maksimal, valuasi murah — <strong>titik entry terbaik</strong> bagi yang berani (tapi paling menakutkan).</li>
      </ol>
      <p><strong>Kepribadian siklus:</strong> dia <em>empat musim</em> — tidak ada yang abadi. Investor terbaik bukan yang menebak musim dengan sempurna, tapi yang <strong>berpakaian sesuai musim</strong> (alokasi adaptif) dan <strong>menanam di musim dingin</strong> (beli saat takut).</p>

      <PlotlyChart
        data={cycleData}
        title="Return Saham per Fase Siklus: Beli Saat Takut (ilustratif)"
        layout={{ xaxis: { title: "Fase" }, yaxis: { title: "Return tahunan (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = rata-rata return saham di fase tersebut (ilustratif).</p>
        <p><strong>Interpretasi:</strong> return <strong>terbaik di ekspansi awal</strong> (+12%) — justru saat berita masih suram dan pengangguran tinggi. Di <strong>puncak</strong> (+6%) euforia maksimal tapi return menipis. <strong>Pelajaran abadi:</strong> pasar <em>mendahului</em> ekonomi 6–12 bulan — membeli saat &ldquo;aman&rdquo; (puncak) = membeli mahal; membeli saat &ldquo;menakutkan&rdquo; (lembah/awal ekspansi) = membeli murah.</p>
      </div>

      <h2 id="kredit">Siklus Kredit — Pesta &amp; Mabuk Utang</h2>
      <p><strong>Definisi.</strong> <em>Siklus kredit</em> = ekspansi &amp; kontraksi <strong>ketersediaan kredit</strong> — pendorong utama gelembung &amp; krisis finansial (Hyman Minsky: <em>&ldquo;stabilitas melahirkan ketidakstabilan&rdquo;</em>):</p>
      <ol>
        <li><strong>Pemulihan:</strong> bank hati-hati, spread lebar, hanya peminjam terbaik dapat kredit.</li>
        <li><strong>Ekspansi:</strong> kepercayaan kembali, standar <strong>melonggar</strong>, spread menyempit (E5!).</li>
        <li><strong>Puncak (euforia):</strong> &ldquo;kali ini beda&rdquo; — <em>covenant-lite</em>, leverage gila, <strong>kualitas kredit terburuk</strong> justru di sini.</li>
        <li><strong>Krisis (Minsky moment):</strong> gagal bayar naik → bank mengetat brutal → <em>credit crunch</em> → resesi.</li>
      </ol>
      <p><strong>Indikator fase:</strong> <strong>credit spread</strong> (E5!) — spread super tipis di tengah euforia = bahaya; <strong>pertumbuhan kredit vs PDB</strong>; standar penyaluran kredit (survei perbankan).</p>

      <PlotlyChart
        data={creditCycleData}
        title="Siklus Kredit: Spread Tertipis Justru Saat Paling Berbahaya"
        layout={{ xaxis: { title: "Fase" }, yaxis: { title: "Credit spread BBB (pp)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = rata-rata spread obligasi BBB di tiap fase siklus kredit (ilustratif).</p>
        <p><strong>Interpretasi:</strong> <strong>paradoks Minsky</strong>: spread <strong>tertipis (1,2%) di fase ekspansi</strong> — saat risiko <em>sebenarnya</em> sedang menumpuk (standar longgar)! Pasar merasa paling aman tepat sebelum paling berbahaya. <strong>Pelajaran:</strong> jangan ukur risiko dari <em>harga</em> risiko (spread) — ukur dari <em>kualitas fundamental</em> (leverage, standar kredit).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pepatah Wall Street: <em>&ldquo;bull markets are born on pessimism, grow on skepticism, mature on optimism, and die on euphoria.&rdquo;</em> (Templeton). Siklus kredit menambahkan: <strong>krisis finansial lahir dari kredit buruk yang disalurkan di masa euforia</strong> — bukan dari masa resesi. Waspadalah saat semua orang bilang &ldquo;aman&rdquo;.</p>
      </div>

      <h2 id="indikator">Indikator — Dasbor Pilot Ekonomi</h2>
      <p>Tiga golongan indikator:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Golongan</th><th>Contoh</th><th>Kegunaan</th></tr></thead>
          <tbody>
            <tr><td><strong>Leading</strong> (mendahului)</td><td>Spread 10Y−2Y, PMI, klaim pengangguran awal, izin bangunan</td><td>Prakiraan — tapi noisy &amp; bisa false signal</td></tr>
            <tr><td><strong>Coincident</strong> (bersamaan)</td><td>PDB, penjualan ritel, produksi industri</td><td>Konfirmasi posisi kini</td></tr>
            <tr><td><strong>Lagging</strong> (tertinggal)</td><td>Tingkat pengangguran, inflasi inti, NPL bank</td><td>Konfirmasi — jangan pakai untuk prediksi!</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>PMI</strong> (Purchasing Managers&rsquo; Index): survei manajer pembelian; <strong>&gt; 50 = ekspansi</strong>, &lt; 50 = kontraksi. <strong>Kenapa disukai:</strong> rilis <em>awal bulan</em> (jauh sebelum PDB kuartalan) — <em>nowcasting</em> tercepat.</p>
      <p><strong>Untuk Indonesia:</strong> pantau <strong>PMI manufaktur BI</strong>, <strong>inflasi IHK</strong> (target BI 2,5±1%), <strong>pertumbuhan kredit</strong>, <strong>neraca perdagangan</strong>, dan <strong>RDG BI</strong> (E12, E15).</p>

      <PlotlyChart
        data={pmiData}
        title="PMI: Menyelam ke Kontraksi, Lalu Pulih (ilustratif)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "PMI" }, showlegend: false, shapes: [{ type: "line", x0: "Jan", x1: "Agu", y0: 50, y1: 50, line: { color: "#94a3b8", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = PMI; garis putus-putus di 50 = batas ekspansi/kontraksi.</p>
        <p><strong>Interpretasi:</strong> Mar–Jun di bawah 50 (kontraksi 4 bulan) → Jul menembus ke atas (50,5) → sinyal <strong>pemulihan awal</strong>. Profesional tidak bereaksi pada <em>satu</em> angka, tapi pada <strong>tren 3 bulan + konfirmasi</strong> indikator lain. Satu PMI jelek = noise; empat bulan + spread inverted = pola.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Ekonom memprediksi resesi, jadi pasti terjadi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> bahkan indikator terbaik = <strong>probabilitas</strong>, bukan vonis. Ekonom terkenal &ldquo;memprediksi 9 dari 5 resesi terakhir&rdquo; (candaan Samuelson) — terlalu banyak false alarm. Gunakan indikator untuk <strong>menyesuaikan probabilitas &amp; posisi</strong> (kurangi beta, tambah kas), bukan untuk <em>all-in/all-out timing</em>.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Klasifikasi Yield Curve</h2>
      <p>Masukkan yield per tenor — program mengklasifikasi bentuk kurva &amp; sinyalnya.</p>
      <PyodideLab
        title="Lab 1 — Pengklasifikasi Yield Curve Otomatis"
        hint="Coba tiga skenario: (1) normal: 3bln=4.0, 2thn=4.5, 5thn=5.0, 10thn=5.5, 30thn=6.0; (2) inverted (contoh di hint); (3) flat: semua 5.5. Rasakan bedanya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Dashboard Skor Resesi</h2>
      <p>Gabungkan 4 indikator jadi satu skor bahaya. Ubah angkanya — lihat skor bergerak.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Skor Bahaya Resesi"
        hint="Coba skenario 'stagflasi': PMI 48, inflasi 7%, spread -0.5, pengangguran 6%. Skor tinggi TAPI inflasi panas = BI tidak bisa memangkas bunga = resesi lebih menyakitkan!"
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> indikator seperti <strong>ramalan cuaca</strong>: berguna untuk bawa payung (kurangi risiko), bodoh untuk membatalkan seluruh perjalanan hidup (jual semua). <strong>Posisi siklikal = penyesuaian bertahap</strong>, bukan saklar on/off.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Posisi per Fase Siklus</h2>

      <div className="decision-card">
        <h3>1. Ekspansi awal (PMI &gt; 50 baru, kurva menormal) → <strong>Ambil risiko: siklikal, saham, durasi panjang</strong></h3>
        <p><strong>Kondisi:</strong> pemulihan terkonfirmasi, valuasi masih murah.</p>
        <p><strong>Kenapa:</strong> return terbaik historis di fase ini; bunga masih rendah.</p>
        <p><strong>Contoh nyata:</strong> tambah beta portofolio (E9), obligasi tenor panjang (E4).</p>
      </div>

      <div className="decision-card">
        <h3>2. Ekspansi lanjut (inflasi panas, BI hawkish) → <strong>Kurangi durasi, tambah kualitas</strong></h3>
        <p><strong>Kondisi:</strong> euforia mulai, spread kredit super tipis.</p>
        <p><strong>Kenapa:</strong> risiko pengetatan; waspadai kualitas kredit memburuk (paradoks Minsky).</p>
        <p><strong>Contoh nyata:</strong> obligasi tenor pendek, saham defensif berneraca kuat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Inversi kurva / sinyal resesi → <strong>Defensif bertahap, bukan panik</strong></h3>
        <p><strong>Kondisi:</strong> spread 10Y−2Y negatif, PMI melemah.</p>
        <p><strong>Kenapa:</strong> probabilitas resesi naik (6–24 bulan); tapi pasar bisa naik dulu.</p>
        <p><strong>Contoh nyata:</strong> turunkan beta, tambah kas/SBN pendek, siapkan &ldquo;peluru&rdquo; untuk lembah.</p>
      </div>

      <div className="decision-card">
        <h3>4. Lembah / krisis (berita mengerikan) → <strong>Beli bertahap yang berkualitas</strong></h3>
        <p><strong>Kondisi:</strong> pesimisme maksimal, valuasi murah historis.</p>
        <p><strong>Kenapa:</strong> return ekspektasi tertinggi justru di sini (E7: asimetri). <em>Dollar-cost averaging</em> mengalahkan usaha <em>timing</em> dasar sempurna.</p>
        <p><strong>Contoh nyata:</strong> cicil ETF indeks/blue chip saat IHSG −30% dari puncak.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Inversi = alarm, bukan vonis.</strong> Kurangi risiko bertahap; jangan all-out.</li>
          <li><strong>Pasar mendahului ekonomi 6–12 bulan.</strong> Beli saat menakutkan, waspada saat euforia.</li>
          <li><strong>Spread tipis + euforia = bahaya.</strong> Ukur risiko dari fundamental, bukan harga risiko.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: 2022 — Inversi Tanpa Resesi?</h2>
      <div className="callout">
        <p>Akhir 2022: kurva AS terinversi dalam (−1pp). Konsensus: resesi 2023 &ldquo;pasti&rdquo;. Kamu mengurangi saham 50% ke kas. Hasil: 2023 saham AS <strong>naik 24%</strong>, resesi tak kunjung tiba hingga 2024. Kamu kehilangan reli + membayar <em>opportunity cost</em> besar.</p>
        <p><strong>Pertanyaan:</strong> (a) Di mana kesalahan logikanya? (b) Respons berbasis probabilitas yang benar saat itu? (c) Pelajaran tentang &ldquo;rekor sempurna&rdquo; indikator?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Mengubah probabilitas menjadi kepastian + all-out timing.</strong> Inversi menaikkan P(resesi) — bukan P=100%. Konteks unik (pasar kerja super ketat, tabungan pandemi, fiskal longgar) menunda resesi. Satu sinyal ≠ seluruh gambaran.</p>
          <p>(b) <strong>Penyesuaian bertahap:</strong> turunkan beta 20–30% (bukan 50%+), tambah durasi obligasi pendek &amp; kas, <em>tulis rencana beli</em> jika koreksi datang. Lindungi tanpa mematikan upside.</p>
          <p>(c) <strong>Rekor historis ≠ hukum fisika.</strong> Setiap &ldquo;pola sempurna&rdquo; lahir dari sampel terbatas dengan konteks tertentu. Hormati sinyal sebagai <strong>Bayesian update</strong> (naikkan probabilitas bahaya), bukan sebagai ramalan dukun.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Menghitung &ldquo;Sinyal Resesi&rdquo; dari Kurva</h2>
      <p>Data obligasi pemerintah AS: yield <strong>2 tahun = 4,8%</strong>, yield <strong>10 tahun = 4,2%</strong>. Hitung spread dan tafsirkan.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Spread:</strong> 10Y − 2Y = 4,2% − 4,8% = <strong>−60 bps</strong> (negatif = <em>inversi</em>).</p>
        <p><strong>Langkah 2 — Logika ekonomi:</strong> normalnya, meminjamkan 10 tahun (risiko lebih lama) menuntut bunga <em>lebih tinggi</em>. Inversi = pasar <strong>rela dibayar lebih murah</strong> untuk 10 tahun — karena yakin <strong>bunga akan <em>turun</em> di masa depan</strong> (biasanya karena resesi memaksa bank sentral memangkas).</p>
        <p><strong>Langkah 3 — Rekor historis:</strong> sejak 1976, setiap inversi 10Y-2Y AS diikuti resesi dalam 6–24 bulan — <strong>8 dari 8</strong>. <em>Tapi</em>: jeda bervariasi (6–24 bulan!), kedalaman bervariasi, dan 2022–2023 menunjukkan inversi <em>bisa</em> berakhir tanpa resesi parah (atau &ldquo;resesi teknis&rdquo; ringan).</p>
        <p><strong>Cara pakai yang benar:</strong> inversi = <strong>naikkan kewaspadaan, bukan jual semua</strong>. Respons profesional: periksa <em>konfirmasi</em> (data tenaga kerja melemah? kredit mengetat? — lihat Pendalaman), siapkan likuiditas, <em>rebalance</em> (E8) — bukan <em>market timing</em> all-in/all-out yang datanya gagal total.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: PDB Tumbuh 8% — Benarkah Makin Makmur?</h2>
      <p>Berita: &ldquo;Ekonomi tumbuh <strong>8%</strong>!&rdquo; Inflasi tahun yang sama: <strong>3%</strong>. Berapa pertumbuhan <em>riil</em> (daya beli)?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus kasar:</strong> riil ≈ nominal − inflasi = 8% − 3% = <strong>5%</strong>.</p>
        <p><strong>Langkah 2 — Rumus tepat:</strong> (1,08 / 1,03) − 1 = <strong>4,85%</strong>. (Selisih kecil; kasar cukup untuk berita.)</p>
        <p><strong>Langkah 3 — Kenapa ini penting untuk investor:</strong> return sahammu 12% nominal saat inflasi 6% = <strong>5,7% riil</strong>. Gaji naik 10% saat inflasi 8% = <strong>naik 1,9% beneran</strong>. Semua angka ekonomi &amp; investasi <strong>wajib</strong> dibaca dalam versi riil sebelum dirayakan — E7 mengajarkan hal yang sama untuk return!</p>
        <p><strong>Jebakan lanjutan:</strong> &ldquo;pertumbuhan&rdquo; juga bisa berasal dari <strong>utang</strong> (pemerintah/bank sentral menggelontor stimulus) — PDB naik hari ini, tagihan datang kemudian (inflasi / krisis utang). Tanyakan selalu: <em>pertumbuhan ini dibiayai apa?</em></p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2020 — Resesi Tersingkat &amp; Pemulihan Terliar dalam Sejarah</h2>
      <p>Februari–Maret 2020: COVID menghantam. S&amp;P 500 jatuh <strong>−34% dalam 33 hari</strong> — tercepat dalam sejarah. Lalu yang terjadi <em>tidak pernah</em> terjadi sebelumnya:</p>
      <ul>
        <li><strong>Resesi tersingkat AS:</strong> hanya <strong>2 bulan</strong> (Feb–Apr 2020) — pemulihan pasar saham tercepat: kembali ke puncak dalam ~5 bulan, lalu reli ke rekor baru.</li>
        <li><strong>Stimulus tak preseden:</strong> The Fed memangkas ke ~0% + <em>quantitative easing</em> triliunan dolar; pemerintah AS menggelontorkan cek langsung ke warga. Uang beredar meledak &rarr; <strong>inflasi 2021–2022</strong> (9% di AS!) &rarr; kenaikan bunga tercepat 40 tahun (E4: 2022 bond crash!).</li>
        <li><strong>Pelajaran siklus:</strong> (1) <strong>siklus bisa &ldquo;dipaksa&rdquo;</strong> oleh kebijakan — resesi 2020 bukan siklus bisnis normal melainkan <em>shutdown</em> artifisial; (2) <strong>obat punya efek samping</strong> — stimulus 2020 = inflasi 2022 = krisis obligasi 2022 = satu rantai sebab-akibat; (3) <strong>pasar ≠ ekonomi</strong> — pasar saham pulih saat pengangguran masih tinggi, karena pasar menghargai <em>masa depan + likuiditas</em>, bukan koran hari ini.</li>
      </ul>
      <p><strong>Untuk Indonesia:</strong> BI &amp; pemerintah menempuh jalur serupa (bunga rendah, PEN). IHSG jatuh ke ~3.900 (Maret 2020) lalu reli. Investor yang memahami &ldquo;siklus kebijakan&rdquo; — bukan sekadar &ldquo;siklus ekonomi&rdquo; — bisa membaca <em>niat</em> bank sentral dari tiap keputusan bunga (E14: segitiga moneter!).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan <strong>tiga rezim kebijakan</strong>: (1) <strong>Easing</strong> (bunga turun, likuiditas longgar) &rarr; angin buritan untuk saham &amp; obligasi; (2) <strong>Tightening</strong> (bunga naik) &rarr; angin depan — valuasi terkompresi (E6: DDM dengan r naik!); (3) <strong>Netral</strong> &rarr; fundamental perusahaan yang bicara. 80% &ldquo;misteri&rdquo; pergerakan IHSG tahunan = rezim ini, bukan berita harian.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Resesi = saatnya jual semua dan tunggu di kas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data <strong>menghancurkan</strong> strategi ini: sebagian besar <em>return</em> pasar terkonsentrasi di <strong>segelintir hari terbaik</strong> — yang sering muncul <em>tepat setelah</em> hari-hari terburuk (2020: hari-hari terbaik pasar = di tengah kepanikan!). <em>Market timing</em> menuntut <strong>dua</strong> keputusan benar (keluar <em>dan</em> masuk kembali) — data menunjukkan investor yang mencoba <em>underperform</em> signifikan vs yang diam. Resesi = <strong>waktu membeli bertahap</strong> (rebalancing!), bukan kabur.</p>
      </div>

      <h2 id="indikator">🔧 Pendalaman: Tiga Jenis Indikator — Jangan Baca Speedometer sebagai GPS</h2>
      <ul>
        <li><strong>Leading</strong> (mendahului): yield curve (Worked 1!), indeks manufaktur PMI, klaim pengangguran awal, izin bangunan. <em>Gunanya:</em> peringatan dini. <em>Kelemahan:</em> <strong>false positive</strong> — &ldquo;meramal 9 dari 5 resesi terakhir&rdquo; (lelucon ekonom!).</li>
        <li><strong>Coincident</strong> (bersamaan): PDB, penjualan ritel, produksi industri, tingkat pengangguran. <em>Gunanya:</em> konfirmasi &ldquo;kita <em>sedang</em> di mana&rdquo;. <em>Kelemahan:</em> data <strong>direvisi</strong> — angka PDB &ldquo;resmi&rdquo; bisa berubah 3 kali!</li>
        <li><strong>Lagging</strong> (terlambat): pengangguran puncak (tertinggi <em>setelah</em> resesi berakhir!), inflasi inti, suku bunga kredit macet. <em>Gunanya:</em> konfirmasi tren sudah mapan. <em>Kelemahan:</em> tidak berguna untuk antisipasi — tapi bagus untuk <strong>validasi</strong> (&ldquo;apakah pemulihan ini nyata?&rdquo;).</li>
      </ul>
      <p><strong>Cara profesional membaca:</strong> <strong>triangulasi</strong> — satu leading (kurva) + satu coincident (PMI/tenaga kerja) + satu lagging (pengangguran). Ketiganya selaras melemah = probabilitas resesi tinggi. Satu sinyal sendirian = <em>noise</em>. Dan selalu ingat inversi 2022–2023: <strong>sinyal terbaik pun punya false positive</strong> — makanya responsnya <em>persiapan</em> (likuiditas, diversifikasi, rebalance), bukan <em>ramalan</em> (jual semua).</p>
      <p><strong>Penutup track T9:</strong> E1–E17 membangun satu mesin: struktur pasar → instrumen → TVM → obligasi → kredit → ekuitas → risiko → diversifikasi → harga risiko → derivatif → opsi → FX → risk management → pasar uang → Indonesia → efisiensi → siklus. <strong>Keuangan = satu bahasa</strong> dengan banyak dialek. Kamu kini bisa membacanya. E18 (laporan keuangan) = kamus untuk dialek perusahaannya.</p>


      <h2 id="dalio">🔧 Pendalaman: Siklus Utang Besar (<em>Big Debt Cycle</em>) — Pola 75 Tahunan</h2>
      <p>Ray Dalio (Bridgewater) berargumen: di balik siklus bisnis pendek (5–10 tahun, E17!), ada <strong>siklus utang besar 50–75 tahun</strong> yang berakhir dengan <em>deleveraging</em> menyakitkan atau krisis. Mekaniknya:</p>
      <ol>
        <li><strong>Fase ekspansi utang:</strong> bunga rendah + optimisme &rarr; utang tumbuh <em>lebih cepat</em> dari pendapatan. Terlihat makmur (PDB naik!) — tapi <strong>pertumbuhan dibeli dengan utang</strong> (E17 Worked 2: &ldquo;dibiayai apa?&rdquo;).</li>
        <li><strong>Titik jenuh:</strong> beban bunga ≈ batas kemampuan bayar. Bank sentral <em>tidak bisa</em> menurunkan bunga lagi (sudah ~0% — 2010-an!) &rarr; <strong>jebakan likuiditas</strong>.</li>
        <li><strong>Deleveraging:</strong> utang harus turun — lewat <strong>(a)</strong> penghematan menyakitkan (depresi), <strong>(b)</strong> restrukturisasi/default massal, <strong>(c)</strong> cetak uang (inflasi — &ldquo;pajak tersembunyi&rdquo; atas penabung!), atau <strong>(d)</strong> redistribusi. 2008 = (a)+(b); 2020–2022 = (c).</li>
      </ol>
      <p><strong>Indikator fase:</strong> <strong>rasio utang/PDB</strong> total (pemerintah + swasta) yang terus menanjak tiap siklus; <strong>suku bunga riil mendekati nol/negatif</strong> (E3!); <strong>ketimpangan</strong> melebar (utang menguntungkan pemilik aset). Dalio kontroversial — tapi kerangkanya memaksa pertanyaan yang benar: <em>&ldquo;pertumbuhan ini organik atau berutang?&rdquo;</em></p>
      <h2 id="worked4">🔬 Worked Example: Membaca Rasio Utang — Tiga Negara</h2>
      <details className="worked">
        <summary>📐 Tiga studi kasus (klik untuk buka)</summary>
        <p><strong>Kasus A — Jepang:</strong> utang pemerintah ~260% PDB (tertinggi dunia maju!). Tapi: 90%+ dipegang <strong>domestik</strong>, bank sentral memegang ~50%, suku bunga ~0%. <strong>Kesimpulan:</strong> rasio mengerikan, risiko krisis <em>rendah</em> (tidak bergantung kreditur asing; bisa cetak yen). Pelajaran: <strong>struktur utang &gt; angka utang.</strong></p>
        <p><strong>Kasus B — Indonesia 1998:</strong> utang pemerintah &ldquo;hanya&rdquo; ~60% PDB — tapi <strong>utang swasta berdenominasi dolar</strong> masif + cadangan devisa tipis. <strong>Kesimpulan:</strong> angka &ldquo;kecil&rdquo;, risiko <em>ekstrem</em> (currency mismatch — E12!). Pelajaran: <strong>denominasi &amp; jatuh tempo &gt; angka.</strong></p>
        <p><strong>Kasus C — AS kini:</strong> utang federal &gt;120% PDB + defisit persisten + bunga tinggi (2022+). Beban bunga &gt; anggaran pertahanan! <strong>Kesimpulan:</strong> &ldquo;istimewa&rdquo; karena dolar = cadangan dunia (masih ada pembeli!), tapi lintasannya <strong>tidak sustain</strong> — pasar obligasi suatu hari bisa menuntut premi (E4: yield naik &rarr; harga jatuh &rarr; 2022 terulang?).</p>
        <p><strong>Aturan baca:</strong> jangan tanya &ldquo;utangnya besar?&rdquo; — tanya <strong>(1)</strong> siapa krediturnya? <strong>(2)</strong> denominasi apa? <strong>(3)</strong> untuk apa utangnya (produktif vs konsumtif)? <strong>(4)</strong> bagaimana lintasan bunga vs pertumbuhannya (<em>r vs g</em>: jika bunga &gt; pertumbuhan, rasio <em>otomatis</em> memburuk!). Empat jawaban = diagnosis; satu angka = tebakan.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang pemerintah seperti utang rumah tangga — harus dilunasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> pemerintah (berdaulat, bermata uang sendiri) <strong>tidak pernah &ldquo;melunasi&rdquo;</strong> — ia <em>me-rollover</em> (terbitkan baru untuk bayar yang jatuh tempo) <em>selamanya</em>. Yang penting bukan &ldquo;lunas&rdquo;, melainkan <strong>lintasan rasio utang/PDB</strong>: jika PDB tumbuh &gt; bunga, rasio turun <em>sendiri</em> tanpa pelunasan. Analogi rumah tangga = <strong>menyesatkan total</strong> — rumah tangga tidak bisa mencetak rupiah, menaikkan pajak, atau hidup selamanya. (Pengecualian: utang <em>valas</em> — di situlah 1998 terjadi!)</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Membaca Siklus (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Spread 10Y−2Y = −0,8pp. Artinya…"
        options={[
          "Ekonomi sehat",
          "Kurva terinversi — pasar bertaruh suku bunga akan turun (risiko resesi naik)",
          "Inflasi nol",
          "Waktunya all-in saham",
        ]}
        correct={1}
        explanation="Benar: inversi = pasar mengharapkan perlambatan → bank sentral akan memangkas bunga. Sirene resesi (lead 6–24 bulan), bukan vonis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Respons tepat saat kurva terinversi?"
        options={[
          "Jual semua saham hari ini juga",
          "Abaikan total",
          "Kurangi risiko BERTAHAP (turunkan beta, tambah kualitas/kas) — pasar bisa naik dulu berbulan-bulan",
          "Beli saham gorengan",
        ]}
        correct={2}
        explanation="Benar: probabilitas, bukan kepastian. Puncak pasar sering terjadi SETELAH inversi. Penyesuaian bertahap > all-out timing."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Paradoks Minsky: kapan risiko kredit SEBENARNYA tertinggi?"
        options={[
          "Saat krisis (spread lebar)",
          "Saat ekspansi/euforia — spread tipis tapi standar kredit longgar & leverage menumpuk",
          "Tidak pernah",
          "Saat resesi berakhir",
        ]}
        correct={1}
        explanation="Benar: pasar merasa paling aman tepat sebelum paling berbahaya. Ukur risiko dari fundamental (leverage, standar), bukan dari harga risiko (spread)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. PMI = 47 selama 4 bulan berturut-turut. Artinya…"
        options={[
          "Ekspansi kuat",
          "Kontraksi manufaktur (di bawah 50) — sinyal leading pelemahan",
          "Tidak ada artinya",
          "Inflasi pasti turun",
        ]}
        correct={1}
        explanation="Benar: PMI < 50 = kontraksi. 4 bulan tren = pola, bukan noise. Leading indicator — rilis cepat, cocok untuk nowcasting."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Return saham historis TERBAIK terjadi di fase…"
        options={[
          "Puncak euforia",
          "Ekspansi awal — saat berita masih suram (pasar mendahului ekonomi)",
          "Kontraksi terdalam",
          "Tidak ada pola",
        ]}
        correct={1}
        explanation="Benar: pasar mendahului ekonomi 6–12 bulan. Membeli saat 'aman' (puncak) = membeli mahal; membeli saat menakutkan = membeli murah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Tingkat pengangguran termasuk indikator…"
        options={[
          "Leading",
          "Lagging — mengonfirmasi setelah fakta; jangan pakai untuk prediksi",
          "Coincident",
          "Tidak termasuk indikator",
        ]}
        correct={1}
        explanation="Benar: lagging. Pengangguran naik SETELAH ekonomi melemah (perusahaan PHK belakangan). Untuk prediksi pakai leading (spread, PMI)."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Inversi kurva (10Y−2Y &lt; 0)</strong> = pasar bertaruh resesi; sirene probabilitas (6–24 bulan), bukan vonis.</li>
          <li><strong>Siklus bisnis</strong>: ekspansi awal → lanjut → puncak/kontraksi → lembah. Pasar mendahului 6–12 bulan.</li>
          <li><strong>Siklus kredit</strong> (Minsky): stabilitas → euforia → krisis. Risiko tertinggi saat semua merasa aman.</li>
          <li><strong>Indikator</strong>: leading (spread, PMI) untuk prakiraan; lagging (pengangguran) hanya konfirmasi.</li>
          <li>Respons = <strong>penyesuaian bertahap</strong>, bukan all-in/all-out. Hormati sinyal sebagai update probabilitas.</li>
          <li>Track 9 selesai! Capstone: efficient frontier app + VaR/ES — menerapkan E8 &amp; E13.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e16-efisiensi-pasar" className="btn btn-secondary btn-sm">← E16</Link>
        <Link href="/learn/e18-laporan-keuangan" className="btn btn-primary btn-sm">Next: E18 →</Link>
      </div>
    </div>
  );
}
