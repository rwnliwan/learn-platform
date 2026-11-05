"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr17aPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const leverageData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [1.2, 1.5, 1.9, 2.4, 3.1],
      type: "scatter",
      mode: "lines+markers",
      name: "Debt/Equity PT Maju Jaya",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [1.5, 1.5, 1.5, 1.5, 1.5],
      type: "scatter",
      mode: "lines",
      name: "Rata-rata industri",
      line: { color: "#2a7de1", width: 2, dash: "dash" },
    },
  ];

  const dscrData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [2.8, 2.4, 1.9, 1.4, 1.05],
      type: "bar",
      marker: { color: ["#3aa655", "#3aa655", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["2,8×", "2,4×", "1,9×", "1,4×", "1,05×"],
      textposition: "outside",
    },
  ];

  const marginData = [
    {
      x: ["Gross margin", "EBITDA margin", "Net margin"],
      y: [28, 18, 6],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["28%", "18%", "6%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator rasio kredit — PT Maju Jaya (Rp M)
# Neraca & laba-rugi ringkas. Hitung rasio kuncinya.
# --- NERACA ---
kas = 50; piutang = 120; persediaan = 180; aset_lancar = kas+piutang+persediaan
aset_tetap = 650; total_aset = aset_lancar + aset_tetap
utang_lancar = 280; utang_jk_panjang = 420; total_utang = utang_lancar + utang_jk_panjang
ekuitas = total_aset - total_utang
# --- LABA RUGI ---
pendapatan = 900; hpp = 648; laba_kotor = pendapatan - hpp
beban_operasi = 90; ebitda = laba_kotor - beban_operasi
bunga = 60; cicilan_pokok = 40; laba_bersih = 54

cr = aset_lancar / utang_lancar
der = total_utang / ekuitas
dscr = ebitda / (bunga + cicilan_pokok)
icr = ebitda / bunga
gross = laba_kotor / pendapatan * 100
net = laba_bersih / pendapatan * 100

print(f"Current ratio (likuiditas) : {cr:.2f}x   {'OK' if cr>1.2 else 'LEMAH!'}")
print(f"Debt/Equity (leverage)     : {der:.2f}x   {'WASPADA' if der>2 else 'OK'}")
print(f"DSCR (kemampuan bayar)     : {dscr:.2f}x   {'KRITIS!' if dscr<1.2 else 'OK'}")
print(f"Interest coverage          : {icr:.2f}x")
print(f"Gross margin               : {gross:.0f}%")
print(f"Net margin                 : {net:.0f}%  <- tipis!")
print()
print("Coba: naikkan bunga jadi 90 (refinancing mahal). DSCR jadi?")
print("Inilah sensitivitas: leverage tinggi + bunga naik = spiral.")`;

  const lab2Code = `# Lab 2: Tren 5 tahun — angka sesaat vs perjalanan
# Rasio tahun ini "OK" bisa menipu. Lihat trennya.
tahun = [2021, 2022, 2023, 2024, 2025]
der   = [1.2, 1.5, 1.9, 2.4, 3.1]
dscr  = [2.8, 2.4, 1.9, 1.4, 1.05]
cr    = [1.8, 1.6, 1.4, 1.2, 1.0]

print(f"{'Thn':<5} {'D/E':>5} {'DSCR':>5} {'CR':>5}  {'Status':>10}")
for t, d, s, c in zip(tahun, der, dscr, cr):
    st = "SEHAT" if s > 1.5 and d < 2 else ("WASPADA" if s > 1.2 else "KRITIS")
    print(f"{t:<5} {d:>5.1f} {s:>5.2f} {c:>5.1f}  {st:>10}")
print()
print("2021: semua hijau. 2025: semua merah.")
print("Pelajaran: analisis kredit = MEMBACA TREN, bukan memotret.")
print("Perusahaan tidak bangkrut tiba-tiba — ia memburuk perlahan")
print("sementara analis yang hanya lihat 'tahun ini' tertidur.")
print()
print("Coba: ubah der 2025 jadi 1.8 (manajemen injeksi modal).")
print("DSCR tetap 1.05 — leverage membaik tapi kemampuan bayar tetap kritis!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR17a — Credit Risk Analyst • Corporate Part 1</span>
        <h1 className="display-title">Kredit Korporasi Part 1:<br />Membaca Laporan Keuangan &amp; Rasio</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laba Naik, Perusahaan Mati</a></li>
          <li><a href="#tiga">Tiga Laporan: Satu Cerita</a></li>
          <li><a href="#rasio">Empat Keluarga Rasio Kredit</a></li>
          <li><a href="#tren">Tren &gt; Snapshot: Membaca Perjalanan</a></li>
          <li><a href="#jebakan">Jebakan Laporan: Yang Tidak Ditulis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator Rasio Kredit</a></li>
          <li><a href="#lab2">🔬 Lab 2: Tren 5 Tahun</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Rasio Bicara — Apa Aksi?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: PT Maju Jaya — Layak Rp 200 M?</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan hubungan tiga laporan keuangan (neraca, laba-rugi, arus kas).</li>
          <li>Menghitung 4 keluarga rasio kredit: likuiditas, leverage, coverage, profitabilitas.</li>
          <li>Menganalisis tren rasio 5 tahun (bukan snapshot) untuk menilai arah perusahaan.</li>
          <li>Mengidentifikasi jebakan kualitas laba: akrual agresif, one-off, related party.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Laba Naik, Perusahaan Mati</h2>
      <div className="story">
        <p>PT Maju Jaya melaporkan <strong>laba bersih naik 30%</strong> tahun 2025. Direksi bank bertepuk tangan — pengajuan kredit Rp 200 miliar hampir disetujui.</p>
        <p>Lalu analis Rina membuka <strong>laporan arus kas</strong>: arus kas operasi <strong>negatif Rp 80 miliar</strong>. Lho? Ternyata: penjualan naik, tapi <strong>piutangnya menumpuk</strong> (pelanggan tidak bayar-bayar) dan <strong>persediaan membengkak</strong> (barang tidak laku). "Laba"-nya terjebak di gudang dan di piutang — <strong>tidak ada kasnya</strong>.</p>
        <p>Tiga bulan kemudian Maju Jaya gagal bayar cicilan pertama. Laba naik 30%, perusahaan mati.</p>
        <p><strong>Twist-nya:</strong> laba adalah <strong>opini</strong> (akuntansi), kas adalah <strong>fakta</strong>. Analis kredit korporasi tidak membaca laba — ia <strong>menginterogasi</strong> laporan keuangan. Part 1 ini mengajarkan interogasinya: dari tiga laporan sampai rasio.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="tiga">Tiga Laporan: Satu Cerita</h2>
      <p><strong>Definisi singkat &amp; peran masing-masing:</strong></p>
      <ul>
        <li><strong>Neraca</strong> — <em>foto</em> di satu tanggal: Aset = Utang + Ekuitas. Menjawab: "apa yang dimiliki vs apa yang dipinjam?"</li>
        <li><strong>Laba-rugi</strong> — <em>film</em> satu periode: pendapatan − biaya = laba. Menjawab: "apakah bisnisnya menguntungkan?"</li>
        <li><strong>Arus kas</strong> — <em>kas nyata</em> masuk/keluar: operasi, investasi, pendanaan. Menjawab: "apakah ada uang betulan?"</li>
      </ul>
      <p><strong>Hubungannya:</strong> laba (laba-rugi) → menambah ekuitas (neraca) → tapi hanya jika menjadi kas (arus kas). Rantai yang putus di mana saja = masalah. Kasus Maju Jaya: rantai putus di <strong>laba → kas</strong> (piutang &amp; persediaan).</p>
      <p><strong>Kepribadian:</strong> tiga laporan seperti <strong>tiga saksi</strong> — neraca si fotografer, laba-rugi si pendongeng, arus kas si jujur. Analis yang baik tidak percaya satu saksi — ia <strong>mencari yang tidak konsisten</strong> di antara ketiganya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> mulai analisis dari <strong>arus kas operasi</strong>, bukan laba. Aturan: <strong>arus kas operasi harus ≥ 80% laba bersih</strong> secara konsisten. Jika laba Rp 100 M tapi kas operasi Rp 20 M (atau negatif) — interogasi piutang, persediaan, dan kebijakan akrualnya. Di sinilah kebanyakan "laba palsu" ketahuan.</p>
      </div>

      <h2 id="rasio">Empat Keluarga Rasio Kredit</h2>

      <h3>1. Likuiditas — "Bisa bayar tagihan bulan ini?"</h3>
      <Tex math={String.raw`\text{Current Ratio} = \frac{\text{Aset Lancar}}{\text{Utang Lancar}}`} block />
      <p>Patokan: &gt;1,2× sehat; &lt;1,0× = <strong>utang jangka pendek lebih besar dari aset lancar</strong> — bahaya. Tapi waspada: aset lancar bisa berupa <strong>persediaan basi</strong> — cek kualitasnya.</p>

      <h3>2. Leverage — "Seberapa banyak hidup dari utang?"</h3>
      <Tex math={String.raw`\text{Debt to Equity} = \frac{\text{Total Utang}}{\text{Ekuitas}}`} block />
      <p>Patokan umum: &lt;2× wajar (tergantung industri — properti/infrastruktur wajar lebih tinggi). Leverage tinggi = <strong>tidak ada ruang untuk salah</strong>: sedikit guncangan → ekuitas habis.</p>

      <h3>3. Coverage — "Sanggup bayar cicilan?" (RAJA rasio kredit!)</h3>
      <Tex math={String.raw`\text{DSCR} = \frac{\text{EBITDA}}{\text{Cicilan Pokok} + \text{Bunga}} \quad ; \quad \text{ICR} = \frac{\text{EBITDA}}{\text{Bunga}}`} block />
      <p><strong>Artinya:</strong> EBITDA = laba sebelum bunga, pajak, depresiasi, amortisasi (proksi kas operasi); DSCR = berapa kali kas menutup <em>seluruh</em> kewajiban utang; ICR = khusus bunga. Patokan: DSCR &gt;1,25× aman; &lt;1,0× = <strong>tidak sanggup bayar</strong> (ingat CR1!).</p>

      <h3>4. Profitabilitas — "Bisnisnya sehat?"</h3>
      <p>Gross margin, EBITDA margin, net margin — dan <strong>trennya</strong>. Margin menipis 5 tahun berturut-turut = <em>structural decline</em> (bukan masalah sementara).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>PT Maju Jaya (Rp M): aset lancar 350, utang lancar 280, total utang 700, ekuitas 300, EBITDA 162, bunga 60, cicilan pokok 40.</p>
        <p><strong>Langkah 1</strong> — CR = 350/280 = <strong>1,25×</strong> (pas-pasan).<br />
        <strong>Langkah 2</strong> — D/E = 700/300 = <strong>2,33×</strong> (di atas 2 — waspada).<br />
        <strong>Langkah 3</strong> — DSCR = 162/(60+40) = <strong>1,62×</strong> (masih OK).<br />
        <strong>Langkah 4</strong> — vonis sementara: <em>leverage tinggi tapi masih sanggup bayar</em> — layak dengan syarat (covenant!). Tapi... lihat tren di bawah.</p>
      </details>

      <PlotlyChart
        data={marginData}
        title="Margin PT Maju Jaya: Tergerus di Setiap Lapis (%)"
        layout={{ xaxis: { title: "Tingkat margin" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = margin di tiga level (kotor → EBITDA → bersih).</p>
        <p><strong>Interpretasi:</strong> gross 28% → net cuma 6%! <strong>22 poin hilang</strong> di beban operasi, bunga, dan pajak. Net margin 6% = <strong>sangat tipis</strong> — kenaikan bunga 2% atau penurunan penjualan 5% bisa menghapus laba sepenuhnya. Perusahaan seperti ini <strong>tidak punya shock absorber</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Rasio dalam batas normal = perusahaan sehat."</strong></p>
        <p><strong>Yang benar:</strong> rasio adalah <strong>foto</strong> — penipu ulung berpose bagus untuk foto. Yang penting adalah <strong>tren 3–5 tahun</strong> + <strong>kualitas angka</strong> (apakah piutangnya nyata?). Rasio "OK" dengan tren memburuk = pasien yang masih tersenyum tapi hasil lab-nya merah semua.</p>
      </div>

      <h2 id="tren">Tren &gt; Snapshot: Membaca Perjalanan</h2>

      <PlotlyChart
        data={leverageData}
        title="Debt/Equity PT Maju Jaya vs Industri (5 tahun)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Debt/Equity (×)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = D/E Maju Jaya; garis biru putus-putus = rata-rata industri.</p>
        <p><strong>Interpretasi:</strong> 2021 masih di bawah industri (1,2 vs 1,5) — terlihat sehat. Tapi <strong>trennya menanjak 5 tahun berturut-turut</strong> hingga 3,1 (2× industri!). Inilah <strong>leverage creep</strong>: utang ditambah tiap tahun untuk menutup lubang. Snapshot 2023 (1,9) "masih OK" — trennya yang berteriak.</p>
      </div>

      <PlotlyChart
        data={dscrData}
        title="DSCR PT Maju Jaya: Menuju Titik Kritis (5 tahun)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "DSCR (×)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = DSCR tahun itu. Garis imajiner 1,25 = batas aman; 1,0 = titik mati.</p>
        <p><strong>Interpretasi:</strong> DSCR <strong>turun 5 tahun berturut-turut</strong>: 2,8 → 1,05. Tahun 2025 tinggal 1,05× — <strong>satu guncangan kecil</strong> (pelanggan telat bayar, bunga naik) = tidak sanggup bayar. <strong>Kombinasi mematikan:</strong> leverage naik + DSCR turun = perusahaan meminjam lebih banyak sementara kemampuannya membayar menyusut. Inilah pola klasik pra-default.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> analis kredit membaca laporan seperti <strong>dokter membaca rekam medis</strong> — bukan satu hasil lab, melainkan <strong>trennya</strong>. Tiga tren yang paling ditakuti: (1) leverage naik, (2) DSCR turun, (3) arus kas operasi &lt; laba bersih melebar. Satu saja = waspada; tiga sekaligus = tolak (atau pricing sangat tinggi + covenant ketat).</p>
      </div>

      <h2 id="jebakan">Jebakan Laporan: Yang Tidak Ditulis</h2>
      <p>Lima hal yang tidak terlihat di rasio standar:</p>
      <ul>
        <li><strong>Akrual agresif:</strong> mengakui pendapatan sebelum kas diterima (piutang membengkak). Cek: piutang tumbuh &gt; penjualan tumbuh.</li>
        <li><strong>One-off:</strong> laba dari jual aset (tidak berulang) menyamar sebagai laba operasi. Cek: <em>other income</em>.</li>
        <li><strong>Related party:</strong> transaksi dengan perusahaan grup (harga tidak wajar). Cek: catatan atas laporan keuangan.</li>
        <li><strong>Off-balance sheet:</strong> garansi, sewa operasi, SPV. Cek: komitmen &amp; kontinjensi.</li>
        <li><strong>Opini audit:</strong> WTP (wajar tanpa pengecualian) vs WDP vs disclaimer. <strong>Disclaimer = jangan sentuh.</strong></li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Laporan sudah diaudit, pasti benar."</strong></p>
        <p><strong>Yang benar:</strong> audit memastikan <strong>kewajaran penyajian</strong> (sesuai standar), bukan <strong>kebenaran bisnis</strong>. Auditor tidak menjamin piutang akan terbayar — hanya bahwa pencatatannya sesuai PSAK. <strong>Analis kredit membaca LEBIH SKEPTIS dari auditor</strong> — karena yang dipertaruhkan bukan opini, melainkan uang.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Tiga Saksi dan Satu Pembohong</h3>
      <p>Neraca, laba-rugi, dan arus kas adalah <strong>tiga saksi</strong> yang bersaksi tentang perusahaan yang sama — dan analis hebat mendengarkan ketiganya sambil mencari <strong>ketidakkonsistenan</strong>. Laba naik tetapi arus kas operasi turun = saksi tidak kompak = ada yang disembunyikan (biasanya: penjualan kredit yang agresif menumpuk piutang, atau biaya yang dikapitalisasi). Aturan praktis: <strong>arus kas operasi ≥ 80% laba bersih</strong> secara konsisten. Di bawah itu, tanyakan ke mana larinya laba.</p>
      <p>Intuisi kedua: <strong>tren mengalahkan snapshot, tetapi kualitas mengalahkan tren</strong>. Rasio DSCR 1,6× terlihat baik — sampai kamu lihat trennya: 2,4× → 2,0× → 1,6× dalam tiga tahun. Arahnya jelas: menuju 1,0× dalam dua tahun. Sebaliknya, DSCR 1,2× yang naik dari 0,9× → 1,0× → 1,2× adalah cerita pemulihan. <strong>Angka tanpa tren = foto tanpa konteks.</strong> Tetapi tren pun bisa menipu jika kualitas angkanya buruk — laba yang direkayasa (<em>earnings management</em>) menghasilkan tren yang indah dan palsu. Urutan analisis yang benar: <strong>kualitas dulu, tren kemudian, snapshot terakhir</strong>.</p>
      <p>Intuisi ketiga — raja rasio: mengapa <strong>coverage (DSCR/ICR) adalah raja</strong>? Karena kredit dibayar dari kas, bukan dari aset, bukan dari laba akuntansi. Perusahaan bisa punya aset Rp 1 T dan tetap gagal bayar cicilan Rp 10 M/bulan jika kasnya macet di piutang. DSCR menjawab satu-satunya pertanyaan yang penting bagi bank: <strong>"apakah kas yang dihasilkan cukup untuk membayar kami?"</strong> Rasio lain (likuiditas, leverage, profitabilitas) adalah konteks; coverage adalah vonis.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator Rasio Kredit</h2>
      <p>Masukkan angka PT Maju Jaya — keluarkan vonis rasio.</p>
      <PyodideLab
        title="Lab 1 — Empat Keluarga Rasio"
        hint="Coba: (1) naikkan bunga 60 → 90. (2) Turunkan ekuitas 300 → 150 (rugi menumpuk). Rasakan mana yang paling cepat membunuh DSCR vs D/E."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Tren 5 Tahun</h2>
      <p>Snapshot menipu. Tren bercerita. Bandingkan keduanya.</p>
      <PyodideLab
        title="Lab 2 — Dari Snapshot ke Tren"
        hint="Coba ubah der 2025 jadi 1.8 (injeksi modal) — DSCR tetap kritis! Pelajaran: leverage bisa 'di-makeup' modal, tapi kemampuan bayar tidak bisa dibohongi."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Rasio Bicara — Apa Aksi?</h2>

      <div className="decision-card">
        <h3>1. DSCR &lt;1,0 → <strong>TOLAK (atau restrukturisasi total)</strong></h3>
        <p><strong>Kondisi:</strong> kas tidak menutup kewajiban.</p>
        <p><strong>Kenapa:</strong> memberi kredit ke DSCR &lt;1 = meminjamkan ke yang pasti tidak bisa bayar. Satu-satunya jalan: injeksi ekuitas dulu, baru bicara kredit.</p>
      </div>

      <div className="decision-card">
        <h3>2. DSCR 1,0–1,25 + tren turun → <strong>ACC bersyarat: covenant ketat</strong></h3>
        <p><strong>Kondisi:</strong> masih sanggup tapi rapuh.</p>
        <p><strong>Aksi:</strong> covenant DSCR minimum, dividend lock-up, pelaporan kuartalan. (Detail covenant: Part 2.)</p>
      </div>

      <div className="decision-card">
        <h3>3. Arus kas operasi &lt;&lt; laba bersih → <strong>investigasi kualitas laba</strong></h3>
        <p><strong>Kondisi:</strong> laba cantik, kas jelek.</p>
        <p><strong>Aksi:</strong> bedah piutang (umur? tertagih?), persediaan (laku?), one-off. Jangan ACC sebelum lubangnya jelas.</p>
      </div>

      <div className="decision-card">
        <h3>4. Rasio OK tapi tren 5 tahun memburuk → <strong>pricing risiko + tenor pendek</strong></h3>
        <p><strong>Kondisi:</strong> masih lolos ambang, tapi arah salah.</p>
        <p><strong>Aksi:</strong> bunga lebih tinggi (kompensasi), tenor 1–3 tahun (jangan kunci 10 tahun), review tahunan wajib.</p>
      </div>

            <div className="decision-card">
        <h3>5. Rasio bagus tetapi auditor memberikan opini WDP (Wajar Dengan Pengecualian) → <strong>perlakukan seperti red flag merah</strong></h3>
        <p><strong>Kondisi:</strong> DSCR 1,8×, D/E 1,5× — semua rasio dalam batas. Tetapi laporan keuangan diaudit dengan opini WDP karena auditor tidak bisa memverifikasi piutang Rp 200 M ke pihak afiliasi.</p>
        <p><strong>Aksi:</strong> <strong>abaikan rasio-rasionya</strong> — angka dari laporan yang tidak bisa diverifikasi = angka fiksi. Opsi: (1) tolak sampai ada audit WTP (Wajar Tanpa Pengecualian); (2) jika tetap ingin proses, <strong>koreksi manual</strong>: keluarkan piutang tak terverifikasi dari aset lancar (current ratio anjlok), hitung ulang semua rasio, dan naikkan pricing sebagai kompensasi ketidakpastian; (3) wajibkan audit WTP sebagai <strong>covenant</strong> (affirmative). Prinsip: <strong>kualitas &gt; tren &gt; snapshot</strong> — dan WDP merusak kualitas di akarnya.</p>
        <p><strong>Contoh nyata:</strong> banyak kasus gagal bayar korporasi Indonesia didahului opini audit non-WTP 1–2 tahun sebelumnya. Opini audit adalah <strong>EWS yang gratis</strong> — analis yang mengabaikannya buta dengan sengaja.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Kas dulu, laba kemudian.</strong> Arus kas operasi ≥80% laba bersih.</li>
          <li><strong>DSCR adalah raja.</strong> &lt;1,0 = berhenti.</li>
          <li><strong>Tren &gt; snapshot.</strong> 5 tahun, bukan 1 tahun.</li>
          <li><strong>Audit ≠ jaminan.</strong> Baca lebih skeptis dari auditor.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Bedah Laporan Keuangan: Urutan 12 Langkah</h3>
      <p>Diberi laporan keuangan 3 tahun? Ikuti 12 langkah ini — berurutan, tanpa lompat. Total waktu: 2–3 jam untuk analisis mendalam.</p>
      <ol>
        <li><strong>Cek opini audit</strong> — WTP? Jika tidak — berhenti. Angka dari laporan tak terverifikasi = fiksi. (CR17a decision 5)</li>
        <li><strong>Baca arus kas operasi vs laba</strong> — Rasio &lt;80% konsisten = red flag. Ke mana larinya laba? (piutang? persediaan?)</li>
        <li><strong>Hitung DSCR dari KAS (bukan EBITDA)</strong> — Untuk padat modal kerja: FCF-based. Definisi mengubah vonis (CR17b).</li>
        <li><strong>Hitung leverage (D/E) + tren</strong> — &gt;2,5× atau naik 3 tahun = ruang napas menipis. Koreksi revaluasi aset!</li>
        <li><strong>Hitung likuiditas (current ratio)</strong> — &lt;1,2× = bahaya jangka pendek. Koreksi piutang afiliasi!</li>
        <li><strong>Bedah margin 3 tahun</strong> — Gross → EBITDA → net. Menipis terus = structural decline, bukan siklus.</li>
        <li><strong>Cek piutang: umur + konsentrasi + afiliasi</strong> — DSO naik + konsentrasi pelanggan + porsi afiliasi besar = triple red flag.</li>
        <li><strong>Cek utang: jatuh tempo + mata uang + off-BS</strong> — Profil jatuh tempo menumpuk? Mismatch rupiah vs dolar? Jaminan silang?</li>
        <li><strong>Bandingkan vs industri</strong> — Rasio tanpa pembanding = angka mengambang. Di atas/di bawah rata-rata industri? Mengapa?</li>
        <li><strong>Baca CALK (catatan)</strong> — Transaksi afiliasi, kontinjensi, sengketa hukum — bom selalu di catatan, bukan di neraca.</li>
        <li><strong>Susun 3 risiko utama</strong> — Bukan 10 — tiga. Yang paling mungkin membunuh pembayaran kembali.</li>
        <li><strong>Tulis vonis + struktur</strong> — Setuju/tolak/bersyarat + plafon + covenant + pricing. Tanpa struktur = analisis belum selesai.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> cetak sebagai template. Setiap memo kredit korporasi yang kamu tulis mengikuti 12 langkah ini — konsisten, lengkap, bisa diaudit.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Analisis laporan keuangan korporasi Indonesia punya medan perang yang nyata — dari konglomerasi hingga BUMN karya.</p>

      <h3>Garuda, Sritex, Waskita: Tiga Pelajaran Mahal</h3>
      <p>Tiga kasus restrukturisasi korporasi terbesar Indonesia dalam beberapa tahun terakhir — semuanya bisa dibaca dengan rasio lesson ini:</p>
      <ul>
        <li><strong>Garuda Indonesia (PKPU 2021, homologasi 2022):</strong> utang belasan miliar dolar AS, ekuitas negatif bertahun-tahun (leverage tak terhingga secara matematis), arus kas operasi negatif kronis. Rasio-rasio sudah "berteriak" jauh sebelum PKPU — analis yang membaca tren tidak terkejut. Pelajaran: <strong>ekuitas negatif + arus kas negatif persisten = hitung mundur</strong>, bukan "tantangan sementara".</li>
        <li><strong>Sritex (PKPU 2021):</strong> raksasa tekstil yang gagal bayar obligasi global. Laba-rugi masih menunjukkan penjualan besar, tetapi <strong>arus kas operasi vs laba tidak kompak</strong> dan utang valas membengkak saat rupiah melemah. Pelajaran: waspadai <strong>mismatch mata uang</strong> — pendapatan rupiah, utang dolar (risiko konversi, CR18).</li>
        <li><strong>Waskita Karya (restrukturisasi 2023+):</strong> BUMN karya dengan proyek penugasan masif — piutang (tagihan ke pemberi kerja) menumpuk, arus kas operasi negatif meski "laba" tercatat. Pelajaran klasik: <strong>laba tanpa kas = fatamorgana</strong>; dan untuk BUMN, analisis harus memasukkan <strong>risiko penugasan negara</strong> (proyek dipaksakan demi target, bukan demi ekonomi).</li>
      </ul>

      <h3>Jebakan Khas Laporan Keuangan Indonesia</h3>
      <p>Analis korporasi Indonesia wajib waspada pada pola-pola ini:</p>
      <ul>
        <li><strong>Revaluasi aset:</strong> aset tetap direvaluasi naik → ekuitas naik → D/E terlihat membaik — tanpa satu rupiah kas pun masuk. Selalu hitung leverage <strong>dengan dan tanpa</strong> revaluasi.</li>
        <li><strong>Piutang afiliasi:</strong> piutang ke perusahaan grup yang tidak pernah dibayar = <strong>penyertaan terselubung</strong>, bukan aset lancar. Koreksi current ratio.</li>
        <li><strong>Pendapatan diakui di muka:</strong> proyek konstruksi mengakui pendapatan berbasis progres — pastikan progresnya <strong>nyata</strong> (opname lapangan), bukan sekadar jurnal.</li>
        <li><strong>Utang tersembunyi:</strong> <em>off-balance-sheet</em> via perusahaan cangkang atau jaminan silang — baca catatan atas laporan keuangan (CALK), bukan sekadar neraca.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: mendeteksi laba tanpa kas (klik untuk buka)</summary>
        <p>PT Contoh (Rp M), 3 tahun:</p>
        <p>Laba bersih: 100 → 120 → 150 (naik terus, indah!).<br />
        Arus kas operasi: 90 → 55 → 20 (anjlok!).<br />
        Piutang usaha: 80 → 160 → 300 (meledak).</p>
        <p><strong>Langkah 1</strong> — rasio kas/laba: 90% → 46% → 13%. Jauh di bawah 80% — <strong>saksi tidak kompak</strong>.<br />
        <strong>Langkah 2</strong> — ke mana larinya laba? Piutang +220 M dalam 2 tahun ≈ selisih kas vs laba. Perusahaan <strong>"menjual" ke pelanggan yang tidak membayar</strong> (atau mengakui penjualan agresif).<br />
        <strong>Langkah 3</strong> — vonis: tren laba indah = <strong>fatamorgana piutang</strong>. DSCR dari laba terlihat baik; DSCR dari kas = bahaya. Tolak, atau setujui hanya dengan jaminan piutang yang diverifikasi + covenant arus kas.</p>
        <p><strong>Pelajaran:</strong> inilah mengapa lesson ini memerintahkan "mulai dari arus kas". Laba bisa dipoles; kas sulit dibohongi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Perusahaan BUMN pasti aman — kan dijamin negara."</strong></p>
        <p><strong>Yang benar:</strong> tidak ada <strong>jaminan eksplisit</strong> negara atas utang BUMN (kecuali dijamin khusus). Kasus Waskita membuktikan BUMN bisa direstrukturisasi dengan haircut. "BUMN" adalah faktor kualitatif positif (kemungkinan dukungan), bukan pengganti analisis — dan dukungan negara pun datang dengan <strong>syarat politis</strong> yang bisa merugikan kreditur swasta.</p>
      </div>

      <h2 id="case">📋 Mini-Case: PT Maju Jaya — Layak Rp 200 M?</h2>
      <div className="callout">
        <p>PT Maju Jaya (manufaktur furnitur, Jepara) mengajukan <strong>kredit investasi Rp 200 M</strong> tenor 7 tahun untuk ekspansi pabrik. Data 2025:</p>
        <ul>
          <li>Laba bersih <strong>naik 30%</strong> (Rp 54 M). Arus kas operasi: <strong>−Rp 80 M</strong>.</li>
          <li>D/E 3,1× (industri 1,5×); DSCR 1,05×; net margin 6%.</li>
          <li>Piutang naik 60% (penjualan naik 25%); persediaan naik 45%.</li>
          <li>Opini audit: WTP. Direksi: keluarga pendiri, 2 generasi.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> putuskan: ACC / tolak / bersyarat? Susun 3 argumen.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Keputusan: TOLAK (atau tunda sampai restrukturisasi keuangan).</strong> Tiga argumen:</p>
          <p>(1) <strong>DSCR 1,05× + tren turun 5 tahun</strong> — tidak ada buffer untuk cicilan Rp 200 M baru. Menambah utang ke DSCR kritis = mempercepat default.<br />
          (2) <strong>Laba semu:</strong> arus kas operasi negatif + piutang/persediaan membengkak = laba terjebak di modal kerja. Ekspansi pabrik menambah kapasitas saat <strong>barang tidak laku</strong> (persediaan +45%) — salah obat.<br />
          (3) <strong>Leverage 3,1×</strong> — tidak ada ruang salah; net margin 6% tidak punya shock absorber.</p>
          <p><strong>Jalan keluar (jika direksi memaksa):</strong> injeksi ekuitas Rp 100 M dulu (turunkan D/E), plafon Rp 100 M (bukan 200), tenor 3 tahun + covenant DSCR &gt;1,3×. Pelajaran: <strong>kredit tidak menyembuhkan perusahaan sakit — ia mempercepat kematiannya</strong>.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Laba Naik, Kas Anjlok — Vonismu?</h2>
      <div className="callout">
        <p>PT Sinar Jaya mengajukan KMK Rp 50 M. Data 3 tahun (Rp M):</p>
        <ul>
          <li>Laba bersih: 80 → 100 → 130.</li>
          <li>Arus kas operasi: 75 → 40 → 15.</li>
          <li>Piutang: 60 → 140 → 260 (60% ke 2 pelanggan afiliasi).</li>
          <li>D/E: 1,8× → 2,1× → 2,4×. DSCR (dari EBITDA): 1,7× → 1,5× → 1,4×.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> RM berkata "labanya naik terus, DSCR masih 1,4× — layak!" Setuju atau tolak? Susun argumen 3 poin + struktur mitigasi jika setuju bersyarat.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Keputusan: TOLAK — atau setuju dengan struktur sangat ketat.</strong> Tiga argumen:</p>
          <p><strong>1. Laba tanpa kas = fatamorgana.</strong> Rasio kas/laba 94% → 40% → 12%. Kenaikan laba Rp 50 M "didanai" kenaikan piutang Rp 200 M — perusahaan menjual ke pelanggan yang tidak membayar (afiliasi pula!). DSCR 1,4× dari EBITDA menipu; DSCR dari <strong>kas operasi</strong> sudah di bawah 1×.</p>
          <p><strong>2. Konsentrasi + afiliasi = bom ganda.</strong> 60% piutang ke 2 pelanggan afiliasi = bukan piutang dagang normal, melainkan <strong>transfer pricing / penyedotan kas</strong> potensial. Jika afiliasi bermasalah, piutang Rp 156 M menguap.</p>
          <p><strong>3. Tren leverage memburuk</strong> 1,8× → 2,4× — ruang napas menipis sementara kualitas aset memburuk.</p>
          <p><strong>Jika setuju bersyarat:</strong> plafon maksimal Rp 20 M (bukan 50 M) + jaminan piutang <strong>non-afiliasi</strong> yang diverifikasi + covenant arus kas operasi (bukan EBITDA!) min 1,2× + audit WTP tahunan + pelaporan piutang afiliasi bulanan. Tanpa ini semua = tolak.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Laba naik 30% tapi arus kas operasi negatif. Kesimpulan analis?"
        options={[
          "Perusahaan hebat — ACC",
          "Interogasi kualitas laba: piutang & persediaan membengkak = laba terjebak, bukan kas; selidiki sebelum putuskan",
          "Arus kas tidak penting",
          "Naikkan plafon — laba naik",
        ]}
        correct={1}
        explanation="Benar: laba = opini, kas = fakta. Divergensi laba vs kas adalah red flag #1 analisis kredit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. DSCR 1,05 dengan tren turun 5 tahun (2,8 → 1,05). Artinya?"
        options={[
          "Masih di atas 1,0 — aman",
          "Kritis: hampir tidak sanggup bayar + arah memburuk — satu guncangan = default; pola klasik pra-default",
          "DSCR tidak penting",
          "Bagus untuk ekspansi",
        ]}
        correct={1}
        explanation="Benar: DSCR raja rasio kredit. 1,05 tanpa buffer + tren turun = bom waktu. Menambah utang = mempercepat ledakan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa analis membaca TREN 5 tahun, bukan snapshot 1 tahun?"
        options={[
          "Supaya laporan tebal",
          "Perusahaan memburuk perlahan — snapshot bisa 'OK' sementara tren berteriak; default diprediksi dari arah, bukan posisi",
          "Regulasi mewajibkan 5 tahun",
          "Tidak ada bedanya",
        ]}
        correct={1}
        explanation="Benar: default = proses, bukan peristiwa. Tren leverage naik + DSCR turun 5 tahun = pola pra-default yang tidak terlihat di snapshot."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Piutang tumbuh 60% sementara penjualan tumbuh 25%. Indikasi?"
        options={[
          "Penjualan hebat",
          "Akrual agresif / pelanggan tidak bayar — pendapatan diakui tapi kas tidak masuk; cek umur piutang & kebijakan kreditnya",
          "Normal",
          "Bagus untuk likuiditas",
        ]}
        correct={1}
        explanation="Benar: piutang yang tumbuh jauh di atas penjualan = red flag kualitas laba. Uang 'penjualan' itu mungkin tidak pernah datang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Opini audit WTP (wajar tanpa pengecualian). Berarti?"
        options={[
          "Perusahaan pasti sehat — ACC saja",
          "Kewajaran penyajian sesuai standar — BUKAN jaminan bisnis sehat; analis membaca lebih skeptis dari auditor",
          "Tidak perlu analisis lagi",
          "Audit menjamin piutang tertagih",
        ]}
        correct={1}
        explanation="Benar: audit ≠ due diligence kredit. Auditor memastikan pembukuan wajar; analis memastikan uang kembali."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Laba bersih naik 80→130, tetapi arus kas operasi anjlok 75→15 dan piutang meledak 60→260. Diagnosis?"
        options={[
          "Perusahaan sehat — laba naik",
          "Fatamorgana piutang: laba tidak menjadi kas — penjualan ke pelanggan yang tidak membayar (mungkin afiliasi); DSCR dari kas sudah bahaya",
          "Arus kas tidak penting",
          "Piutang besar = aset besar = bagus",
        ]}
        correct={1}
        explanation="Benar: saksi tidak kompak. Rasio kas/laba 94%→12% = red flag klasik. Laba yang tidak menjadi kas, terutama menumpuk di piutang afiliasi, adalah pola yang mendahului banyak kasus gagal bayar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Rasio-rasio bagus, tetapi opini audit WDP karena piutang afiliasi tak terverifikasi. Sikap analis?"
        options={[
          "Tetap pakai rasio — kan angkanya bagus",
          "Abaikan rasio: angka dari laporan tak terverifikasi = fiksi; minta WTP atau koreksi manual + covenant audit",
          "Opini audit tidak relevan untuk kredit",
          "Naikkan plafon karena rasio bagus",
        ]}
        correct={1}
        explanation="Benar: kualitas > tren > snapshot. WDP merusak fondasi kualitas — semua rasio turunannya tidak bisa dipercaya. Opini audit adalah EWS gratis yang tidak boleh diabaikan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Tiga laporan</strong>: neraca (foto), laba-rugi (film), arus kas (fakta). Cari yang tidak konsisten.</li>
          <li><strong>Empat rasio</strong>: likuiditas (CR), leverage (D/E), coverage (DSCR — raja!), profitabilitas (margin + tren).</li>
          <li><strong>Kas ≥80% laba</strong> — jika tidak, interogasi.</li>
          <li><strong>Tren 5 tahun &gt; snapshot</strong> — default adalah proses.</li>
          <li><strong>Jebakan</strong>: akrual agresif, one-off, related party, off-balance sheet, opini audit.</li>
          <li>Kapan TIDAK mengandalkan rasio: perusahaan startup/proyek (belum ada historis) — di sana proyeksi + agunan + sponsor yang bicara (Part 2).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr16-stress-testing" className="btn btn-secondary btn-sm">← CR16</Link>
        <Link href="/learn/cr17b-corporate-credit-2" className="btn btn-primary btn-sm">Next: CR17b →</Link>
      </div>
    </div>
  );
}
