"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr13Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const utilizationData = [
    {
      x: ["0–20%", "20–40%", "40–60%", "60–80%", "80–100%"],
      y: [1.5, 2.2, 3.5, 6.0, 12.0],
      type: "bar",
      marker: { color: ["#3aa655", "#2a7de1", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["1,5%", "2,2%", "3,5%", "6%", "12%"],
      textposition: "outside",
    },
  ];

  const ccfData = [
    {
      x: ["Sehat", "Menurun", "Kritis"],
      y: [0.1, 0.35, 0.7],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["10%", "35%", "70%"],
      textposition: "outside",
    },
  ];

  const eadComponentsData = [
    {
      x: ["Outstanding", "Undrawn × CCF"],
      y: [60, 28],
      type: "bar",
      marker: { color: ["#2a7de1", "#ef9244"] },
      text: ["Rp 60 jt", "Rp 28 jt"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator EAD & CCF
# Kartu kredit: limit 100 jt, terpakai 60 jt. Berapa EAD?
limit = 100       # juta Rp
outstanding = 60  # terpakai saat ini
undrawn = limit - outstanding

# CCF tergantung kondisi: sehat 10%, menurun 35%, kritis 70%
for kondisi, ccf in [("Sehat", 0.10), ("Menurun", 0.35), ("Kritis", 0.70)]:
    ead = outstanding + undrawn * ccf
    print(f"{kondisi:<8}: EAD = {outstanding} + {undrawn}x{ccf:.2f} = Rp {ead:.1f} jt")

print()
print("Coba: ubah outstanding jadi 95 (hampir max).")
print("Undrawn kecil -> CCF tidak masalah. Bahaya terbesar = limit BESAR")
print("yang BELUM dipakai (undrawn besar) + debitur kritis.")`;

  const lab2Code = `# Lab 2: Utilisasi sebagai prediktor — jebakan "limit tidur"
# 5000 nasabah kartu kredit. Lihat hubungan utilisasi vs default.
import random, math
random.seed(77)

nasabah = []
for _ in range(5000):
    util = random.betavariate(2, 5)  # kebanyakan utilisasi rendah
    # PD naik eksponensial dengan utilisasi
    pd = 0.01 * math.exp(2.2 * util)
    nasabah.append((util, random.random() < pd))

bands = [(0,0.2),(0.2,0.4),(0.4,0.6),(0.6,0.8),(0.8,1.01)]
print(f"{'Utilisasi':<10} {'N':>6} {'Default rate':>13}")
for lo, hi in bands:
    b = [d for u, d in nasabah if lo <= u < hi]
    rate = sum(b)/len(b)*100 if b else 0
    print(f"{int(lo*100)}-{int(hi*100):<6}% {len(b):>6} {rate:>12.2f}%")
print()
print("Pelajaran ganda: (1) utilisasi tinggi = PD tinggi (prediktor!);")
print("(2) utilisasi RENDAH + limit BESAR = EAD tersembunyi (CCF!).")
print("Analis memantau KEDUANYA: yang satu untuk PD, yang satu untuk EAD.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR13 — Credit Risk Analyst</span>
        <h1 className="display-title">EAD &amp; CCF:<br />Exposure Saat Gagal Bayar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Limit Rp 100 Juta yang "Tidak Terpakai"</a></li>
          <li><a href="#ead">EAD: Foto di Momen Kecelakaan</a></li>
          <li><a href="#ccf">CCF: Kebiasaan Buruk Sebelum Jatuh</a></li>
          <li><a href="#util">Utilisasi: Pedang Bermata Dua</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator EAD &amp; CCF</a></li>
          <li><a href="#lab2">🔬 Lab 2: Utilisasi vs Default</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Mengelola EAD</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Bom Limit Tidur</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung EAD untuk fasilitas revolving: outstanding + undrawn × CCF.</li>
          <li>Menjelaskan mengapa CCF naik saat debitur memburuk (adverse drawdown).</li>
          <li>Menganalisis utilisasi limit sebagai prediktor PD sekaligus sumber EAD tersembunyi.</li>
          <li>Merancang kebijakan limit (pemotongan limit tidur) untuk mengendalikan EAD.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Limit Rp 100 Juta yang "Tidak Terpakai"</h2>
      <div className="story">
        <p>Bu Sinta punya kartu kredit limit <strong>Rp 100 juta</strong>, terpakai cuma <strong>Rp 10 juta</strong>. Ia bangga: <em>"Saya hemat, tidak seperti tetangga yang limitnya jebol."</em></p>
        <p>Lalu usahanya goyah. Dalam 3 bulan sebelum akhirnya macet, ia menarik: Rp 30 juta (bayar supplier), Rp 25 juta (gaji karyawan), Rp 20 juta (tutup lubang)... Total saat default: <strong>Rp 85 juta</strong> — dari yang tadinya "cuma" Rp 10 juta.</p>
        <p>Bank mencatat kerugiannya dari Rp 85 juta — <strong>8,5× lipat</strong> dari yang terlihat saat ia "hemat". Limit yang tidak terpakai ternyata bukan "tidak ada risiko" — melainkan <strong>risiko yang sedang tidur</strong>.</p>
        <p><strong>Twist-nya:</strong> debitur yang kesulitan <strong>cenderung menghabiskan limitnya sebelum macet</strong> — seperti orang tenggelam yang meraih apa saja. Fenomena ini bernama <strong>CCF</strong> (<em>Credit Conversion Factor</em>), dan lesson ini mengukurnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="ead">EAD: Foto di Momen Kecelakaan</h2>
      <p><strong>Definisi.</strong> <strong>EAD</strong> (<em>Exposure at Default</em>) = total tagihan bank <strong>pada saat</strong> debitur default. Dua jenis fasilitas:</p>
      <ul>
        <li><strong>Term loan</strong> (KPR, KTA angsuran): EAD ≈ <strong>sisa pokok</strong> (+ tunggakan bunga). Pasti, tidak bisa ditarik lagi.</li>
        <li><strong>Revolving</strong> (kartu kredit, cerukan, KMK revolving): EAD = <strong>outstanding + (undrawn × CCF)</strong> — karena debitur bisa menarik sisa limit sebelum macet.</li>
      </ul>
      <Tex math={String.raw`\text{EAD} = \text{Outstanding} + (\text{Undrawn} \times \text{CCF})`} block />
      <p><strong>Artinya tiap simbol:</strong> outstanding = yang sudah terpakai hari ini; undrawn = limit − outstanding (sisa yang <em>bisa</em> ditarik); CCF = % dari undrawn yang diperkirakan <em>akan</em> ditarik sebelum default.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Kartu kredit: limit Rp 100 jt, outstanding Rp 60 jt, CCF 35% (kondisi menurun).</p>
        <p><strong>Langkah 1</strong> — undrawn = 100 − 60 = Rp 40 jt.<br />
        <strong>Langkah 2</strong> — tambahan = 40 × 35% = Rp 14 jt.<br />
        <strong>Langkah 3</strong> — EAD = 60 + 14 = <strong>Rp 74 jt</strong> (bukan 60!).</p>
        <p>Selisih Rp 14 jt = "utang masa depan" yang belum terjadi tapi harus dicadangkan hari ini.</p>
      </details>

      <PlotlyChart
        data={eadComponentsData}
        title="Komponen EAD: Terlihat vs Tersembunyi (Rp Juta)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "Rp Juta" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang biru = outstanding (terlihat hari ini); oranye = undrawn × CCF (tersembunyi).</p>
        <p><strong>Interpretasi:</strong> <strong>32% dari EAD tidak terlihat</strong> di laporan hari ini (28/88). Bank yang menghitung EL dari outstanding saja <strong>underestimate sepertiga</strong> eksposur kartu kreditnya. Inilah mengapa CCF wajib dalam perhitungan ECL dan modal.</p>
      </div>

      <h2 id="ccf">CCF: Kebiasaan Buruk Sebelum Jatuh</h2>
      <p><strong>Definisi.</strong> <strong>CCF</strong> (<em>Credit Conversion Factor</em>) = % dari limit yang belum ditarik yang diperkirakan <strong>akan ditarik</strong> sebelum default. Diestimasi dari <strong>data historis</strong>: lihat debitur yang default 12 bulan lalu — berapa % undrawn mereka yang "menguap" menjadi outstanding?</p>
      <p><strong>Fakta kunci:</strong> CCF <strong>naik saat debitur memburuk</strong> — debitur sehat CCF ~10%, debitur kritis CCF ~70%. Ini <strong>adverse drawdown</strong>: yang paling butuh (kritis) justru paling agresif menarik.</p>
      <p><strong>Kepribadian:</strong> CCF seperti <strong>mengukur seberapa rakus orang makan saat tahu kapal akan tenggelam</strong> — yang panik mengambil paling banyak. Bank yang memakai CCF flat (sama untuk semua) sedang meremehkan yang kritis dan melebihkan yang sehat.</p>

      <PlotlyChart
        data={ccfData}
        title="CCF Naik Mengikuti Kondisi Debitur (ilustrasi)"
        layout={{ xaxis: { title: "Kondisi debitur" }, yaxis: { title: "CCF" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = CCF historis untuk debitur dengan kondisi tersebut setahun sebelum default.</p>
        <p><strong>Interpretasi:</strong> debitur kritis menarik <strong>70%</strong> sisa limitnya — 7× lipat dari yang sehat. <strong>Implikasi:</strong> CCF harus <strong>kondisional</strong> (beda per segmen/kondisi), bukan satu angka. Dan limit besar + debitur memburuk = kombinasi paling berbahaya (lihat mini-case).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "EAD = outstanding hari ini. Limit yang belum dipakai bukan risiko."</strong></p>
        <p><strong>Yang benar:</strong> untuk fasilitas revolving, <strong>komitmen = risiko</strong>. Bank sudah <em>berjanji</em> menyediakan limit — dan janji itu akan ditagih tepat saat bank paling tidak ingin membayarnya (saat debitur kritis). Inilah paradoks komitmen kredit: <strong>asuransi yang diklaim saat perusahaan asuransi ikut kesulitan</strong>.</p>
      </div>

      <h2 id="util">Utilisasi: Pedang Bermata Dua</h2>
      <p><strong>Definisi.</strong> <strong>Utilisasi</strong> = outstanding / limit. Ia adalah <strong>pedang bermata dua</strong>:</p>
      <ul>
        <li><strong>Mata 1 — prediktor PD:</strong> utilisasi tinggi → PD tinggi (debitur kepepet). Utilisasi &gt;80% = sinyal EWS (CR9).</li>
        <li><strong>Mata 2 — sumber EAD tersembunyi:</strong> utilisasi <em>rendah</em> + limit <em>besar</em> = undrawn besar = CCF bisa meledak.</li>
      </ul>
      <p>Debitur paling berbahaya untuk EAD: <strong>limit jumbo, utilisasi kecil, kondisi memburuk</strong> — "bom tidur".</p>

      <PlotlyChart
        data={utilizationData}
        title="Default Rate per Band Utilisasi (ilustrasi)"
        layout={{ xaxis: { title: "Utilisasi limit" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = default rate 12 bulan untuk nasabah di band utilisasi itu.</p>
        <p><strong>Interpretasi:</strong> hubungan <strong>eksponensial</strong>: 80–100% utilisasi → default 12% (8× lipat dari 0–20%). <strong>Dua aksi:</strong> (1) utilisasi tinggi = naikkan PD / intervensi EWS; (2) utilisasi rendah + limit besar = pantau EAD via CCF. Analis yang hanya melihat satu sisi melewatkan separuh cerita.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan pasangan ini: <strong>utilisasi tinggi → soal PD</strong>; <strong>limit besar menganggur → soal EAD</strong>. Saat me-review portofolio kartu kredit, tanyakan keduanya: "siapa yang utilisasinya meledak?" DAN "berapa total undrawn dari limit tidur?" — jawaban kedua sering lebih mengejutkan.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Komitmen adalah Utang yang Belum Lahir</h3>
      <p>EAD mengajarkan pelajaran yang kontraintuitif: <strong>risiko terbesar seringkali yang tidak terlihat di laporan hari ini</strong>. Outstanding Rp 60 jt terlihat; undrawn Rp 40 jt × CCF tidak terlihat — tetapi wajib dicadangkan. Analis yang hanya membaca outstanding seperti nahkoda yang hanya melihat gunung es di permukaan. Fasilitas revolving (kartu kredit, cerukan, KMK) adalah <strong>janji bank untuk meminjamkan di masa depan</strong> — dan janji itu akan ditagih tepat saat bank paling tidak ingin meminjamkan (saat debitur sekarat).</p>
      <p>Intuisi kedua: <strong>CCF adalah cermin perilaku panik</strong>. Debitur sehat menarik 10% sisa limitnya; debitur kritis 70%. Ini <em>adverse drawdown</em> — seleksi alam terbalik: yang paling butuh (paling berisiko) mengambil paling banyak. Implikasinya dalam: <strong>CCF tidak boleh satu angka</strong> — ia harus kondisional pada kondisi debitur. Bank yang memakai CCF flat 35% untuk semua nasabah sedang mensubsidi debitur kritis dengan cadangan yang kurang.</p>
      <p>Intuisi ketiga — "bom tidur": kombinasi <strong>limit jumbo + utilisasi kecil + kondisi memburuk</strong>. Di laporan terlihat aman (outstanding kecil), tetapi undrawn raksasa siap ditarik. Inilah profil nasabah korporasi dengan fasilitas <em>standby</em> yang tiba-tiba ditarik penuh saat krisis — fenomena yang berulang di setiap resesi. <strong>Review limit menganggur adalah pekerjaan EAD</strong>, bukan pekerjaan bisnis.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan pasangan: <strong>utilisasi tinggi → masalah PD</strong> (debitur kepepet, EWS berbunyi); <strong>limit besar menganggur → masalah EAD</strong> (bom tidur, CCF mengintai). Saat me-review portofolio, tanyakan keduanya — karena keduanya bisa benar secara bersamaan pada nasabah yang berbeda.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator EAD &amp; CCF</h2>
      <p>Tiga kondisi debitur, tiga EAD berbeda — dari limit yang sama.</p>
      <PyodideLab
        title="Lab 1 — EAD per Kondisi Debitur"
        hint="Coba: (1) outstanding=95 — lihat CCF jadi tidak relevan. (2) outstanding=10, limit=100, kondisi kritis — EAD bisa 73 dari outstanding 10! Itulah bom tidur."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Utilisasi vs Default</h2>
      <p>5000 nasabah simulasi. Buktikan utilisasi adalah prediktor sekaligus peringatan EAD.</p>
      <PyodideLab
        title="Lab 2 — Utilisasi: Prediktor Ganda"
        hint="Perhatikan pola eksponensial default rate. Pertanyaan: band utilisasi mana yang 'termurah' untuk diintervensi? (Petunjuk: 60-80% — masih bisa diselamatkan, PD belum meledak.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Mengelola EAD</h2>

      <div className="decision-card">
        <h3>1. Limit tidur besar (&gt;12 bulan tidak aktif) → <strong>pangkas limit</strong></h3>
        <p><strong>Kondisi:</strong> utilisasi &lt;10%, limit Rp 100 jt, tidak aktif setahun.</p>
        <p><strong>Kenapa:</strong> undrawn Rp 90 jt × CCF = EAD hantu. Pemangkasan ke Rp 25 jt menghapus ~Rp 45 jt EAD <strong>tanpa mengganggu</strong> nasabah (ia tidak pakai juga). Ini "diet" EAD termurah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Debitur memburuk + limit besar → <strong>bekukan/turunkan limit proaktif</strong></h3>
        <p><strong>Kondisi:</strong> sinyal EWS merah (CR9) + undrawn besar.</p>
        <p><strong>Aksi:</strong> turunkan limit mendekati outstanding (atau bekukan penarikan). Cegah adverse drawdown <em>sebelum</em> terjadi. Butuh dasar kontrak yang kuat — pastikan klausulnya ada sejak akad.</p>
      </div>

      <div className="decision-card">
        <h3>3. Mendesain produk revolving baru → <strong>CCF kondisional sejak awal</strong></h3>
        <p><strong>Kondisi:</strong> peluncuran kartu kredit / KMK revolving.</p>
        <p><strong>Aksi:</strong> estimasi CCF per segmen dari data historis (atau benchmark). Jangan pakai CCF flat — dan jangan lupakan EAD dalam perhitungan pricing (CR21).</p>
      </div>

      <div className="decision-card">
        <h3>4. Utilisasi melonjak 60–80% → <strong>intervensi EWS, bukan potong limit membabi buta</strong></h3>
        <p><strong>Kondisi:</strong> utilisasi naik tajam tapi belum kritis.</p>
        <p><strong>Kenapa:</strong> potong limit saat debitur kepepet = mendorongnya ke default (self-fulfilling). Hubungi dulu, pahami sebab — potong limit adalah obat keras untuk kondisi kritis, bukan untuk semua.</p>
      </div>

            <div className="decision-card">
        <h3>5. Nasabah korporasi sehat minta naikkan limit standby 2× "buat jaga-jaga" → <strong>setujui dengan MAC clause + pricing komitmen</strong></h3>
        <p><strong>Kondisi:</strong> debitur rating A minta fasilitas standby Rp 50 M → Rp 100 M "untuk antisipasi". Bisnis senang (fee komitmen), risiko waspada (EAD naik).</p>
        <p><strong>Aksi:</strong> jangan tolak mentah (nasabah bagus butuh fleksibilitas), tetapi: (1) pasang <strong>MAC clause</strong> (<em>material adverse change</em>) — bank boleh menahan penarikan jika kondisi keuangan memburuk drastis; (2) kenakan <strong>commitment fee</strong> yang mencerminkan biaya modal EAD (jangan gratis — yang gratis akan dipakai maksimal saat krisis); (3) review tahunan dengan trigger otomatis jika rating turun 2 notch. Fasilitas standby yang "murah dan tanpa syarat" = <strong>asuransi gratis yang akan diklaim saat badai</strong>.</p>
        <p><strong>Contoh nyata:</strong> pada krisis 2020, perusahaan-perusahaan menarik fasilitas standby secara massal — bank yang MAC clause-nya lemah terpaksa mengucurkan dana ke debitur yang memburuk, memperbesar EAD tepat saat PD meledak. Pelajaran mahal tentang "jaga-jaga".</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>EAD revolving = outstanding + undrawn × CCF.</strong> Jangan hitung outstanding saja.</li>
          <li><strong>CCF naik saat kritis</strong> — pakai CCF kondisional.</li>
          <li><strong>Limit tidur = EAD hantu.</strong> Pangkas yang tidak aktif.</li>
          <li><strong>Utilisasi = dua sisi:</strong> tinggi → PD; rendah+limit besar → EAD.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Audit EAD: 8 Titik Buta Fasilitas Revolving</h3>
      <p>EAD revolving = outstanding + (undrawn × CCF). Delapan titik buta ini tempat EAD bersembunyi.</p>
      <ol>
        <li><strong>Limit tidur (utilisasi &lt;10%, 12 bulan)</strong> — Pangkas otomatis. Limit yang tidak dipakai 12 bulan = EAD gratis yang menunggu adverse drawdown. Pembersihan rutin menghemat CKPN + modal.</li>
        <li><strong>Fasilitas standby korporasi</strong> — Review tahunan wajib. Tanpa MAC clause = bom tidur. Dengan MAC clause = fleksibilitas yang aman.</li>
        <li><strong>CCF flat vs kondisional</strong> — Audit: apakah bank memakai CCF kondisional (per kondisi debitur)? Flat = salah dua arah (CR13 mini-case 2).</li>
        <li><strong>Cerukan (overdraft)</strong> — CCF cerukan &gt; kartu kredit (lebih mudah ditarik). Pastikan parameternya berbeda — menyamakan = underestimate.</li>
        <li><strong>KMK revolving evergreen</strong> — Diperpanjang otomatis tiap tahun tanpa review = EAD abadi untuk debitur yang mungkin sudah memburuk. Wajib review tahunan.</li>
        <li><strong>Komitmen yang belum ditarik sama sekali</strong> — Fasilitas disetujui tetapi 0% ditarik = 100% undrawn = EAD penuh × CCF. Jangan abaikan karena 'belum dipakai'.</li>
        <li><strong>Garansi / LC (kontinjensi)</strong> — Bank garansi &amp; L/C = EAD kontinjensi dengan CCF sendiri (Basel: 20–100% tergantung jenis). Sering terlupakan dalam agregasi EAD.</li>
        <li><strong>Wrong-way exposure</strong> — EAD naik BERSAMAAN dengan PD naik (nasabah tarik limit saat sekarat) = korelasi berbahaya. Identifikasi segmen dengan pola ini — cadangannya harus lebih tebal.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> audit EAD tahunan: 8 titik buta, per segmen. EAD yang tidak terlihat = modal yang tidak disiapkan = kejutan saat krisis.</p>

      <details className="worked">
        <summary>❓ Bagaimana EAD untuk kredit sindikasi (banyak bank)?</summary>
        <p>EAD dihitung <strong>per bank</strong> sesuai porsinya: EAD_bank = porsi × EAD_total. Jika bank memegang 30% dari fasilitas Rp 1 T dengan CCF 50% dan undrawn Rp 400 M: EAD = 0,3 × (600 jt + 400 jt × 50%) = 0,3 × 800 jt = <strong>Rp 240 jt</strong>. Jangan hitung dari total fasilitas — hitung dari <strong>eksposurmu</strong>.</p>
      </details>
      <details className="worked">
        <summary>❓ EAD untuk derivatif (swap, forward) — bagaimana?</summary>
        <p>Derivatif punya EAD <strong>counterparty</strong> yang dihitung via <strong>SA-CCR</strong> (Standardised Approach for Counterparty Credit Risk): replacement cost + potential future exposure (add-on × notional). Kompleks — tetapi prinsipnya sama: <strong>berapa tagihanmu SAAT lawan default</strong>, termasuk potensi masa depan. Untuk analis kredit korporasi umum: cukup tahu ia ada dan material untuk debitur dengan derivatif besar.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia adalah laboratorium EAD yang hidup — dari kartu kredit hingga KMK korporasi.</p>

      <h3>Kartu Kredit: Pabrik EAD Tersembunyi</h3>
      <p>Indonesia punya <strong>puluhan juta kartu kredit</strong> beredar dengan total limit ratusan triliun rupiah — tetapi utilisasi rata-rata hanya 20–30%. Artinya: <strong>mayoritas "risiko kartu kredit" berbentuk undrawn</strong>, bukan outstanding. Saat resesi (misal 2020), pola adverse drawdown muncul: nasabah yang pendapatannya terganggu menarik limitnya — outstanding naik <strong>bersamaan</strong> dengan PD naik. <em>Wrong-way exposure</em>: EAD membesar tepat saat risiko membesar.</p>
      <p>Respons industri yang sehat: <strong>pemangkasan limit tidur</strong> — limit kartu yang tidak aktif 6–12 bulan diturunkan otomatis. Ini memangkas EAD tanpa mengganggu nasabah aktif (yang tidak sadar limitnya dipangkas karena tidak dipakai). Bank yang rajin "membersihkan" limit tidur menghemat CKPN dan modal secara signifikan.</p>

      <h3>KMK Revolving Korporasi: Bom Tidur</h3>
      <p>Kasus klasik Indonesia: perusahaan mendapat <strong>fasilitas KMK revolving Rp 100 M</strong>, dipakai Rp 20 M. Terlihat ringan. Saat usahanya memburuk, ia menarik Rp 80 M sisanya untuk "bertahan" — lalu default dengan EAD Rp 100 M, bukan Rp 20 M. Inilah mengapa analis korporasi (CR17) wajib me-review <strong>undrawn commitment</strong> setiap debitur — dan mengapa covenant sering membatasi penarikan saat rasio keuangan memburuk (<em>material adverse change clause</em>).</p>

      <h3>Aturan Konversi Basel &amp; OJK</h3>
      <p>Basel mengatur <strong>CCF standar</strong> untuk pendekatan SA: komitmen revolving tanpa syarat umumnya 10–50% tergantung jenis dan tenor (angka pastinya mengikuti ketentuan OJK yang mengadopsi Basel). Untuk IRB, bank mengestimasi CCF sendiri dari data historis — dengan syarat: <strong>CCF kondisional</strong> (lebih tinggi untuk debitur yang memburuk), bukan flat. OJK memvalidasi ini dalam proses persetujuan IRB.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: EAD tiga fasilitas (klik untuk buka)</summary>
        <p>Nasabah memiliki: (a) KPR sisa pokok Rp 400 jt; (b) kartu kredit limit Rp 50 jt, outstanding Rp 10 jt, CCF 40%; (c) cerukan limit Rp 30 jt, outstanding Rp 25 jt, CCF 60% (kondisi memburuk).</p>
        <p><strong>Langkah 1</strong> — KPR (term loan): EAD = <strong>Rp 400 jt</strong> (pasti).<br />
        <strong>Langkah 2</strong> — kartu: undrawn = 50−10 = 40; EAD = 10 + 40×40% = <strong>Rp 26 jt</strong> (bukan 10!).<br />
        <strong>Langkah 3</strong> — cerukan: undrawn = 30−25 = 5; EAD = 25 + 5×60% = <strong>Rp 28 jt</strong>.<br />
        <strong>Langkah 4</strong> — total EAD = 400 + 26 + 28 = <strong>Rp 454 jt</strong>.</p>
        <p><strong>Pelajaran:</strong> outstanding total "terlihat" = 435 jt; EAD = 454 jt. Selisih Rp 19 jt = utang masa depan yang belum lahir tetapi sudah harus dicadangkan. Untuk nasabah kritis, selisih ini bisa puluhan persen.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Limit yang belum dipakai bukan risiko — kan belum dipinjam."</strong></p>
        <p><strong>Yang benar:</strong> komitmen = janji yang akan ditagih — dan ditagih <strong>tepat saat debitur paling butuh</strong> (adverse drawdown). Mengabaikan undrawn = mengabaikan sepertiga EAD portofolio revolving. Inilah mengapa CCF ada: mengubah janji menjadi angka.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Bom Limit Tidur</h2>
      <div className="callout">
        <p>Audit portofolio kartu kredit Bank Nusantara menemukan:</p>
        <ul>
          <li>50.000 kartu dengan limit total <strong>Rp 5 T</strong>, outstanding hanya <strong>Rp 1,2 T</strong> (utilisasi 24%).</li>
          <li>30% kartu <strong>tidak aktif &gt;12 bulan</strong> — tapi limitnya tetap penuh (total undrawn Rp 1,1 T).</li>
          <li>CCF historis debitur kritis: <strong>60%</strong>.</li>
          <li>Skenario stres: 5% pemegang kartu "tidur" mengalami kesulitan bersamaan (PHK massal sektor).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung EAD tersembunyi dari skenario stres. Apa rekomendasi kebijakan limitmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>EAD tersembunyi:</strong> 5% × Rp 1,1 T = Rp 55 M undrawn terdampak × CCF 60% = <strong>Rp 33 M</strong> EAD tambahan — muncul <em>bersamaan</em> dengan gelombang default (korelasi!). Dan ini <em>belum termasuk</em> undrawn kartu aktif.</p>
          <p><strong>Rekomendasi:</strong> (1) <strong>Program pemangkasan limit tidur</strong>: turunkan limit kartu tidak aktif &gt;12 bulan ke maks 2× pemakaian historis — target hapus Rp 500 M EAD hantu dalam 6 bulan. (2) <strong>Aturan limit dinamis</strong>: limit turun otomatis jika sinyal EWS merah (dengan pemberitahuan + klausul kontrak). (3) <strong>Laporkan EAD (bukan outstanding)</strong> di dashboard direksi — agar "bom tidur" terlihat.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Audit Menemukan CCF Flat</h2>
      <div className="callout">
        <p>Audit internal menemukan: bank memakai <strong>CCF flat 35%</strong> untuk semua kartu kredit — dari nasabah prima hingga yang kritis. Data historis menunjukkan CCF aktual: nasabah sehat 12%, nasabah waspada 40%, nasabah kritis 72%.</p>
        <ul>
          <li>Portofolio: 1 juta kartu, total undrawn Rp 40 T.</li>
          <li>Komposisi: 80% sehat, 15% waspada, 5% kritis.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung EAD tersembunyi (undrawn × CCF) versi flat vs versi kondisional. Berapa underestimatenya? Mengapa ini berbahaya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Versi flat:</strong> 40 T × 35% = <strong>Rp 14 T</strong>.<br />
          <strong>Versi kondisional:</strong> (32 T × 12%) + (6 T × 40%) + (2 T × 72%) = 3,84 + 2,4 + 1,44 = <strong>Rp 7,68 T</strong>.</p>
          <p>Menarik: <strong>flat justru OVERESTIMATE total</strong> (14 T vs 7,68 T) — karena 80% portofolio sehat yang CCF-nya cuma 12% "dihukum" 35%! Tetapi untuk <strong>segmen kritis</strong>, flat 35% vs aktual 72% = <strong>underestimate 2× lipat</strong> — tepat di segmen yang paling penting.</p>
          <p><strong>Bahaya:</strong> CCF flat salah di kedua arah — membebani segmen sehat (tidak kompetitif) dan meremehkan segmen kritis (kurang cadangan). Inilah mengapa Basel/OJK menuntut <strong>CCF kondisional</strong> untuk IRB. Satu angka untuk semua = tidak adil sekaligus tidak aman.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kartu kredit: limit Rp 100 jt, outstanding Rp 60 jt, CCF 35%. EAD?"
        options={[
          "Rp 60 jt (outstanding saja)",
          "Rp 74 jt (60 + 40×35%)",
          "Rp 100 jt (limit penuh)",
          "Rp 14 jt",
        ]}
        correct={1}
        explanation="Benar: 60 + (100−60)×0,35 = 74. Rp 14 jt adalah 'utang masa depan' yang harus dicadangkan hari ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa CCF debitur kritis (70%) jauh lebih tinggi dari yang sehat (10%)?"
        options={[
          "Bank sengaja menaikkan",
          "Adverse drawdown: yang kesulitan cenderung menghabiskan limit sebelum macet — seperti orang tenggelam meraih apa saja",
          "Salah hitung",
          "Regulasi mewajibkan",
        ]}
        correct={1}
        explanation="Benar: perilaku rasional dari sisi debitur (bertahan hidup) = bencana dari sisi bank. CCF harus kondisional, bukan flat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Utilisasi 90% vs utilisasi 10% (limit Rp 100 jt). Mana benar?"
        options={[
          "90% lebih berbahaya untuk PD; 10% + limit besar = EAD tersembunyi (undrawn 90 jt × CCF)",
          "10% selalu aman",
          "90% selalu lebih baik (nasabah aktif)",
          "Tidak ada bedanya",
        ]}
        correct={0}
        explanation="Benar: pedang bermata dua. Utilisasi tinggi = sinyal PD; utilisasi rendah + limit besar = bom EAD. Analis memantau keduanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. 30% kartu tidak aktif 12 bulan dengan total undrawn Rp 1,1 T. Tindakan termurah?"
        options={[
          "Biarkan — tidak dipakai = tidak berisiko",
          "Pangkas limit kartu tidur ke 2× pemakaian historis — hapus EAD hantu tanpa ganggu nasabah aktif",
          "Tutup semua kartunya",
          "Naikkan limitnya agar dipakai",
        ]}
        correct={1}
        explanation="Benar: diet EAD termurah. Nasabah tidak aktif tidak terganggu (ia tidak pakai juga), tapi bank menghapus ratusan miliar EAD hantu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk KPR angsuran (term loan), EAD dihitung sebagai?"
        options={[
          "Outstanding + undrawn × CCF",
          "Sisa pokok (+ tunggakan) — tidak ada penarikan lagi, jadi tidak butuh CCF",
          "Limit awal",
          "Selalu sama dengan EAD kartu kredit",
        ]}
        correct={1}
        explanation="Benar: term loan tidak revolving — EAD pasti (sisa pokok). CCF hanya untuk fasilitas yang BISA ditarik lagi. Beda produk, beda formula."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bank memakai CCF flat 35% untuk semua kartu kredit; data aktual: sehat 12%, kritis 72%. Apa masalahnya?"
        options={[
          "Tidak ada — flat lebih sederhana",
          "Salah dua arah: segmen sehat overestimate (tidak kompetitif), segmen kritis underestimate 2× (kurang cadangan tepat di segmen terpenting)",
          "Flat selalu underestimate",
          "CCF tidak penting",
        ]}
        correct={1}
        explanation="Benar: flat salah di kedua arah. Yang sehat 'dihukum' berlebihan, yang kritis diremehkan — padahal segmen kritis yang menentukan kecukupan cadangan. CCF harus kondisional pada kondisi debitur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Debitur korporasi: fasilitas standby Rp 100 M, terpakai Rp 20 M, kondisi memburuk. Mengapa analis harus waspada meski 'baru pakai 20%'?"
        options={[
          "Tidak perlu waspada — kecil",
          "Bom tidur: ia bisa menarik Rp 80 M sisanya sebelum default (adverse drawdown) — EAD bisa 5× outstanding. Wajib ada MAC clause",
          "Fasilitas standby tidak bisa ditarik",
          "EAD = outstanding, titik",
        ]}
        correct={1}
        explanation="Benar: adverse drawdown. Debitur yang memburuk menarik limit maksimal sebelum macet — EAD mendekati Rp 100 M, bukan Rp 20 M. Inilah fungsi MAC clause: menahan penarikan saat kondisi memburuk drastis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>EAD</strong> = exposure SAAT default. Revolving: outstanding + undrawn × CCF.</li>
          <li><strong>CCF</strong> = % undrawn yang ditarik sebelum default — <strong>naik saat kritis</strong> (adverse drawdown).</li>
          <li><strong>Utilisasi</strong> pedang bermata dua: tinggi → PD; rendah + limit besar → EAD tersembunyi.</li>
          <li><strong>Limit tidur = EAD hantu</strong> — pangkas yang tidak aktif &gt;12 bulan.</li>
          <li><strong>Komitmen = risiko</strong> — janji limit ditagih tepat saat bank paling tidak ingin membayar.</li>
          <li>Kapan TIDAK butuh CCF: term loan (KPR/KTA angsuran) — EAD = sisa pokok.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr12-lgd" className="btn btn-secondary btn-sm">← CR12</Link>
        <Link href="/learn/cr14a-ecl-staging" className="btn btn-primary btn-sm">Next: CR14a →</Link>
      </div>
    </div>
  );
}
