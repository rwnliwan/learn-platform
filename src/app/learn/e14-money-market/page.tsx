"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E14Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const mmRatesData = [
    {
      x: ["Giro BI", "Deposito 1 bln", "SRBI 6 bln", "SBN 1 thn", "SBN 5 thn"],
      y: [4.5, 4.8, 5.6, 5.9, 6.6],
      type: "bar",
      marker: { color: ["#94a3b8", "#94a3b8", "#2a7de1", "#5b9bd5", "#e8a838"] },
      text: ["4,5%", "4,8%", "5,6%", "5,9%", "6,6%"],
      textposition: "outside",
    },
  ];

  const trancheData = [
    {
      x: ["Senior (70%)", "Mezzanine (20%)", "Equity (10%)"],
      y: [0, 0, 100],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["rugi 0%", "rugi 0%", "rugi 100%"],
      textposition: "outside",
    },
  ];

  const repoData = [
    {
      x: ["Hari 0", "Hari 1", "Hari 2", "Hari 3", "Hari 4", "Hari 5", "Hari 6", "Hari 7"],
      y: [100, 100.02, 100.04, 100.06, 100.08, 100.1, 100.12, 100.14],
      mode: "lines+markers",
      name: "Nilai repo (pokok + bunga)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Repo: pinjam Rp100 M semalam, biayanya?
# Bank A butuh kas 7 hari. Repo: jual SBN Rp100 M, beli kembali + bunga repo 5,5%.
pokok = 100_000_000_000  # Rp100 miliar
r_repo = 0.055
hari = 7

bunga = pokok * r_repo * hari / 360  # konvensi pasar uang: /360
print(f"Pokok        : Rp{pokok/1e9:.0f} M")
print(f"Bunga repo   : Rp{bunga/1e6:.1f} juta untuk {hari} hari")
print(f"Biaya per hari: Rp{bunga/hari/1e6:.1f} juta")
print()
print("Coba: hari = 1 (overnight) vs hari = 30.")
print("Lalu r_repo = 0.08 (krisis likuiditas!). Biaya melonjak berapa?")`;

  const lab2Code = `# Lab 2 — Waterfall sekuritisasi: siapa menanggung rugi duluan?
# Pool KPR Rp1 T dibagi 3 tranche. Simulasi gagal bayar 15%.
pool = 1_000_000_000_000
tranches = [("Senior", 0.70), ("Mezzanine", 0.20), ("Equity", 0.10)]
default_rate = 0.15
lgd = 0.50  # separuh tak kembali

rugi = pool * default_rate * lgd
print(f"Total kerugian pool: Rp{rugi/1e9:.0f} M ({rugi/pool*100:.1f}% dari pool)")
print()
sisa_rugi = rugi
for nama, porsi in reversed(tranches):  # dari paling junior
    kapasitas = pool * porsi
    serap = min(sisa_rugi, kapasitas)
    sisa_rugi -= serap
    pct = serap / kapasitas * 100
    print(f"{nama:10s}: menyerap Rp{serap/1e9:5.0f} M ({pct:4.0f}% tranche-nya HANGUS)")
print()
print("Coba: default_rate = 0.30. Apakah Senior mulai berdarah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E14 — Financial Markets</span>
        <h1 className="display-title">Pasar Uang &amp; Sekuritisasi:<br />Mesin Likuiditas Keuangan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Bank Butuh Uang Semalam</a></li>
          <li><a href="#mm">Pasar Uang — Parkiran Dana Raksasa</a></li>
          <li><a href="#repo">Repo — Gadai Modern</a></li>
          <li><a href="#sekuritisasi">Sekuritisasi — Sulap Kredit Jadi Obligasi</a></li>
          <li><a href="#tranche">Tranche — Kue Lapis Risiko</a></li>
          <li><a href="#structured">Structured Products — Paket Rakit Sendiri</a></li>
          <li><a href="#lab1">🔬 Lab 1: Biaya Repo</a></li>
          <li><a href="#lab2">🔬 Lab 2: Waterfall Tranche</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Instrumen Likuiditas Mana</a></li>
          <li><a href="#case">📋 Mini-Case: Krisis 2008 Mini</a></li>
          <li><a href="#worked1">🔬 Worked Example: Bunga Repo Semalam</a></li>
          <li><a href="#worked2">🔬 Worked Example: Membeli SBN Diskonto</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Plumbing yang Mampet</a></li>
          <li><a href="#srbi">🔧 Pendalaman: SRBI — Senjata Baru BI</a></li>
          <li><a href="#opt">🔧 Pendalaman: Operasi Pasar Terbuka — Cara BI Menyetir Bunga</a></li>
          <li><a href="#worked4">🔬 Worked Example: Transmisi BI Rate ke Deposito</a></li>
          <li><a href="#worked5">🔬 Worked Example: Commercial Paper vs Deposito</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan instrumen pasar uang utama (termasuk SRBI) dan fungsinya bagi bank &amp; BI.</li>
          <li>Menghitung biaya transaksi repo dan menjelaskan perannya sebagai &ldquo;gadai modern&rdquo;.</li>
          <li>Menjelaskan mekanisme sekuritisasi (pool → SPV → tranche) dengan contoh KPR.</li>
          <li>Menganalisis distribusi kerugian antar tranche dan risiko structured products.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Bank Butuh Uang Semalam</h2>
      <div className="story">
        <p>Jam 15:30, Bank X sadar: kasnya kurang Rp100 miliar untuk memenuhi kewajiban kliring <strong>besok pagi</strong>. Panik? Tidak. Telepon satu bank lain: <em>&ldquo;Repo SBN Rp100 miliar, semalam, 5,5%.&rdquo;</em> Deal dalam 10 menit. SBN-nya &ldquo;digadaikan&rdquo;, kas masuk, besok pagi dibeli kembali + bunga semalam.</p>
        <p>Transaksi triliunan rupiah seperti ini terjadi <strong>setiap hari</strong> — tanpa pasar uang &amp; repo, sistem pembayaran Indonesia <strong>macet</strong>. Lesson ini membedah mesin likuiditas yang tak terlihat itu — plus &ldquo;sulap&rdquo; sekuritisasi yang mengubah kredit macet jadi… produk investasi.</p>
        <p><strong>Twist-nya:</strong> tidak ada nasabah yang antre, tidak ada berita, tidak ada gembar-gembor — tapi <strong>triliunan rupiah berpindah tangan dalam 10 menit</strong> lewat telepon, dengan jaminan &ldquo;digadaikan&rdquo; semalam. Ekonomi modern berjalan di atas <strong>lapisan tak terlihat</strong>: pasar uang. Ia seperti <em>plumbing</em> gedung — tidak pernah dipikirkan sampai mampet, dan saat mampet <strong>seluruh gedung lumpuh</strong>. Tahun 2008, plumbing inilah yang mampet — dan dunia hampir berhenti.</p>
      </div>

      <h2 id="mm">Pasar Uang — Parkiran Dana Raksasa</h2>
      <p><strong>Definisi.</strong> <em>Pasar uang</em> = pasar instrumen utang <strong>≤ 1 tahun</strong> (ingat E1). Pemain utamanya <strong>bank &amp; BI</strong> — bukan ritel. Fungsinya: (1) <strong>manajemen likuiditas</strong> harian bank, (2) <strong>transmisi kebijakan moneter</strong> BI, (3) parkir dana jangka pendek.</p>
      <p><strong>Instrumen kunci Indonesia:</strong></p>
      <ul>
        <li><strong>PUAB</strong> (pasar uang antar bank): pinjam-meminjam antar bank, tenor overnight–1 tahun.</li>
        <li><strong>SRBI</strong> (Sekuritas Rupiah Bank Indonesia): surat berharga BI — instrumen utama operasi moneter &amp; pendalaman pasar uang.</li>
        <li><strong>Deposito &amp; NCD</strong>: simpanan berjangka bank.</li>
        <li><strong>Commercial paper</strong>: utang jangka pendek korporasi.</li>
        <li><strong>Repo</strong>: dibahas khusus di bawah — tulang punggung likuiditas.</li>
      </ul>
      <p><strong>Kepribadian pasar uang:</strong> dia <em>sistem peredaran darah</em> keuangan — tak terlihat, tapi kalau macet (<em>liquidity crunch</em>), seluruh tubuh ekonomi kolaps. Krisis 2008 = pasar uang <strong>beku</strong>: bank takut meminjamkan ke bank lain semalam pun.</p>

      <PlotlyChart
        data={mmRatesData}
        title="Hierarki Bunga: Makin Panjang Tenor, Makin Tinggi (ilustratif)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Bunga (%/tahun)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = bunga instrumen, diurut dari tenor terpendek (kiri) ke terpanjang (kanan).</p>
        <p><strong>Interpretasi:</strong> pola <strong>menanjak</strong> — kompensasi mengunci uang lebih lama (<em>term premium</em>, mirip yield curve E4 versi pendek). SRBI 6 bulan (5,6%) di atas deposito 1 bulan (4,8%): BI memakai SRBI untuk <strong>menyerap likuiditas</strong> — bank lebih tergoda parkir di BI daripada mengucurkan kredit. Inilah moneter beraksi di pasar uang.</p>
      </div>

      <h2 id="repo">Repo — Gadai Modern</h2>
      <p><strong>Definisi.</strong> <em>Repurchase agreement</em> (repo) = <strong>jual</strong> sekuritas (biasanya SBN) hari ini + <strong>janji beli kembali</strong> di tanggal &amp; harga yang disepakati. Ekonominya = <strong>pinjaman beragunan</strong>: kas vs SBN sebagai gadai.</p>
      <Tex math={String.raw`\text{Bunga repo} = \text{Pokok} \times r_{\text{repo}} \times \frac{\text{hari}}{360}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`r_{\text{repo}}`} /> = bunga repo tahunan; konvensi pasar uang memakai <strong>360 hari</strong> (bukan 365!).</p>
      <p><strong>Istilah:</strong> pihak butuh kas = <em>repo seller</em> (jual SBN dulu); pihak kelebihan kas = <em>repo buyer</em>. <strong>Haircut</strong> = diskon agunan (SBN Rp100 M hanya bisa pinjam Rp98 M) — bantalan jika harga SBN jatuh.</p>
      <p><strong>Kepribadian repo:</strong> dia <em>pegadaian antar bank</em> — cepat, beragunan, nyaris bebas risiko kredit. Saking amannya, bunga repo ≈ bunga terendah di pasar (<em>risk-free</em> de facto jangka pendek).</p>
      <p><strong>Kenapa penting bagimu:</strong> repo adalah <strong>denyut likuiditas sistem</strong>. Bunga repo melonjak tajam = bank-bank saling tak percaya = sirene krisis (2008: pasar repo AS beku).</p>

      <PlotlyChart
        data={repoData}
        title="Anatomi Repo 7 Hari: Pokok + Bunga Terakumulasi"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Nilai (Rp M)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = nilai kewajiban beli-kembali dari hari 0 (Rp100 M) ke hari 7.</p>
        <p><strong>Interpretasi:</strong> garis naik <strong>linear pelan</strong> — Rp100 M → Rp100,14 M (bunga Rp140 juta seminggu @5,5%). Sederhana &amp; predictable — itulah daya tarik repo: <strong>kas dengan kepastian</strong>. Bandingkan dengan gejolak harga saham harian!</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> repo mengajarkan prinsip <strong>agunan mengubah segalanya</strong>: pinjaman <em>tanpa</em> agunan (PUAB unsecured) vs <em>dengan</em> agunan SBN (repo) = bunga &amp; risiko beda jauh. Prinsip yang sama menjelaskan kenapa KPR (ada rumah) lebih murah dari KTA (tanpa agunan) — dan kenapa <em>haircut</em> ada.</p>
      </div>

      <h2 id="sekuritisasi">Sekuritisasi — Sulap Kredit Jadi Obligasi</h2>
      <p><strong>Definisi.</strong> <em>Sekuritisasi</em> = mengumpulkan banyak <strong>kredit</strong> (misal 10.000 KPR) menjadi satu pool, memindahkannya ke <strong>SPV</strong> (<em>special purpose vehicle</em> — perusahaan cangkang), lalu menerbitkan <strong>efek beragun aset</strong> (EBA/MBS) yang arus kasnya = cicilan para debitur.</p>
      <p><strong>Alur 4 langkah:</strong></p>
      <ol>
        <li><strong>Originasi:</strong> bank menyalurkan 10.000 KPR.</li>
        <li><strong>Pooling:</strong> KPR dikumpulkan jadi satu pool Rp1 triliun.</li>
        <li><strong>Transfer ke SPV:</strong> pool dijual ke SPV (<em>true sale</em> — lepas dari neraca bank; risiko ikut pindah!).</li>
        <li><strong>Penerbitan:</strong> SPV menerbitkan EBA ber-tranche kepada investor; cicilan KPR → membayar investor.</li>
      </ol>
      <p><strong>Motivasi bank:</strong> (1) <strong>bebaskan modal</strong> (kredit keluar neraca → bisa salurkan kredit baru), (2) <strong>transfer risiko</strong>, (3) <strong>likuiditas</strong>. Di Indonesia: EBA diterbitkan misal oleh SMF (Sarana Multigriya Finansial) untuk KPR.</p>
      <p><strong>Kepribadian sekuritisasi:</strong> dia <em>mesin daur ulang risiko</em> — kredit illiquid (KPR 15 tahun) diubah jadi efek likuid yang bisa diperdagangkan. Brilian saat jujur; bencana saat asal-asalan (2008: KPR subprime AS disulap jadi AAA).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sekuritisasi menghilangkan risiko.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> sekuritisasi <strong>memindahkan &amp; memotong-motong</strong> risiko — tidak menghilangkannya. Total kerugian pool tetap sama; yang berubah = <em>siapa menanggung duluan</em> (tranche!). 2008 membuktikan: risiko yang &ldquo;dipindahkan&rdquo; bisa kembali via jalur tak terduga (bank membeli kembali tranche-nya sendiri!).</p>
      </div>

      <h2 id="tranche">Tranche — Kue Lapis Risiko</h2>
      <p><strong>Definisi.</strong> <em>Tranche</em> = lapisan EBA dengan <strong>urutan penyerapan kerugian</strong> berbeda:</p>
      <ul>
        <li><strong>Equity</strong> (paling bawah, ~10%): menyerap rugi <strong>pertama</strong>. Imbal hasil tertinggi, risiko tertinggi.</li>
        <li><strong>Mezzanine</strong> (~20%): rugi setelah equity habis.</li>
        <li><strong>Senior</strong> (~70%): rugi <strong>terakhir</strong> — &ldquo;aman&rdquo; kecuali bencana besar. Rating bisa AAA.</li>
      </ul>
      <p><strong>Aturan waterfall:</strong> arus kas masuk → bayar senior dulu; kerugian datang → equity menanggung dulu. <strong>Senioritas = urutan makan vs urutan menanggung luka</strong> (ingat E2!).</p>

      <PlotlyChart
        data={trancheData}
        title="Waterfall: Gagal Bayar 15% → Siapa Berdarah? (LGD 50%)"
        layout={{ xaxis: { title: "Tranche" }, yaxis: { title: "% tranche hangus" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = persen tiap tranche yang hangus saat 15% debitur gagal bayar (dengan LGD 50% → rugi pool 7,5%).</p>
        <p><strong>Interpretasi:</strong> <strong>equity (10%) menanggung SEMUA</strong> — hangus 100% (7,5% rugi &lt; 10% kapasitas equity). Senior &amp; mezzanine <strong>tidak tersentuh</strong>. Inilah &ldquo;sihir&rdquo; tranche: dari pool berisiko, tercipta lapisan senior yang <em>terasa</em> aman. Tapi sihirnya runtuh jika rugi &gt; 10% (lihat Lab 2 dengan default 30%!).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> pelajaran 2008 dalam satu kalimat: <strong>tranche senior &ldquo;aman&rdquo; hanya jika asumsi korelasi gagal bayar benar</strong>. Model pra-2008 mengasumsikan gagal bayar KPR <em>tidak berkorelasi</em> (acau di sana-sini). Kenyataannya: saat harga rumah jatuh nasional, <strong>semua gagal bersamaan</strong> (korelasi → 1) — rugi melampaui equity+mezzanine dan <strong>senior ikut berdarah</strong>. Asumsi korelasi = titik buta yang meruntuhkan Wall Street.</p>
      </div>

      <h2 id="structured">Structured Products — Paket Rakit Sendiri</h2>
      <p><strong>Definisi.</strong> <em>Structured product</em> = <strong>kombinasi</strong> instrumen dasar (deposito/obligasi + derivatif) yang dirakit jadi satu paket dengan payoff custom. Contoh: &ldquo;deposito + opsi&rdquo; = pokok dijamin + potensi untung jika IHSG naik (<em>principal protected note</em>).</p>
      <p><strong>Anatomi:</strong> 90% dana → obligasi (jamin pokok); 10% → opsi (mesin upside). Payoff dirakit sesuai pesanan — <em>capital protection</em>, <em>autocallable</em>, dsb.</p>
      <p><strong>Tiga peringatan jujur:</strong></p>
      <ol>
        <li><strong>Kompleksitas = biaya tersembunyi:</strong> margin penerbit disembunyikan dalam struktur — bandingkan dengan rakitan sendiri (beli obligasi + opsi terpisah).</li>
        <li><strong>Risiko penerbit:</strong> &ldquo;pokok dijamin&rdquo; = dijamin <em>oleh penerbit</em> — jika bank penerbit bangkrut, jaminan ikut hangus.</li>
        <li><strong>Likuiditas:</strong> sulit dijual sebelum jatuh tempo tanpa diskon besar.</li>
      </ol>
      <p><strong>Kepribadian:</strong> dia <em>paket wisata all-in</em> — nyaman, tapi kamu tidak tahu harga tiap komponennya. Cocok untuk kebutuhan spesifik; buruk sebagai &ldquo;investasi default&rdquo;.</p>

      <h2 id="lab1">🔬 Lab 1: Biaya Repo</h2>
      <p>Hitung biaya &ldquo;gadai modern&rdquo; Rp100 miliar. Ubah tenor &amp; bunga — rasakan skala pasar uang.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Biaya Repo"
        hint="Coba: pokok = 1_000_000_000_000 (Rp1 TRILIUN, skala bank besar). Biaya hariannya? Inilah mengapa 0,1% selisih bunga = uang besar di pasar uang."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Waterfall Tranche</h2>
      <p>Simulasikan siapa berdarah saat kredit macet. Naikkan default rate sampai senior ikut terluka.</p>
      <PyodideLab
        title="Lab 2 — Simulator Waterfall Sekuritisasi"
        hint="Coba: default_rate = 0.30 lalu 0.45. Pada titik berapa mezzanine habis? Senior mulai berdarah? Inilah skenario 2008 yang dimodelkan."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Instrumen Likuiditas Mana</h2>

      <div className="decision-card">
        <h3>1. Bank butuh kas semalam → <strong>Repo / PUAB overnight</strong></h3>
        <p><strong>Kondisi:</strong> kebutuhan likuiditas harian.</p>
        <p><strong>Kenapa:</strong> tercepat, beragunan (repo), bunga terendah.</p>
        <p><strong>Contoh nyata:</strong> pemenuhan kliring &amp; GWM harian bank.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dana parkir 3–12 bulan → <strong>SRBI / deposito / reksa dana pasar uang</strong></h3>
        <p><strong>Kondisi:</strong> horizon pendek, pokok harus aman.</p>
        <p><strong>Kenapa:</strong> likuid, nilai stabil, sesuai horizon.</p>
        <p><strong>Contoh nyata:</strong> kas perusahaan, dana darurat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Bank mau salurkan kredit baru tapi modal penuh → <strong>Sekuritisasi</strong></h3>
        <p><strong>Kondisi:</strong> neraca penuh, butuh <em>capital relief</em>.</p>
        <p><strong>Kenapa:</strong> pindahkan kredit ke SPV → modal bebas → kredit baru. (Dengan tata kelola &amp; transparansi yang benar!)</p>
        <p><strong>Contoh nyata:</strong> SMF sekuritisasi KPR bank-bank Indonesia.</p>
      </div>

      <div className="decision-card">
        <h3>4. Ditawari structured product &ldquo;pokok dijamin + untung besar&rdquo; → <strong>Bedah dulu</strong></h3>
        <p><strong>Kondisi:</strong> marketing mengkilap.</p>
        <p><strong>Kenapa:</strong> cek 3 hal: (1) siapa penjamin pokok (risiko penerbit!), (2) berapa biaya implisit vs rakit sendiri, (3) bisa jual sebelum jatuh tempo?</p>
        <p><strong>Contoh nyata:</strong> bandingkan dengan: beli SBN + beli opsi sendiri (E10–E11).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Pasar uang = peredaran darah.</strong> Repo macet = sirene krisis.</li>
          <li><strong>Sekuritisasi memindahkan risiko</strong>, bukan menghilangkannya. Tanya: siapa menanggung duluan?</li>
          <li><strong>Tranche senior &ldquo;aman&rdquo; hanya sebagus asumsi korelasinya.</strong> 2008 = pelajarannya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Krisis 2008 Mini</h2>
      <div className="callout">
        <p>Bank Menerbitkan EBA dari pool KPR Rp2 triliun: senior 75% (rating AAA), mezzanine 15%, equity 10%. Model berasumsi gagal bayar <strong>tidak berkorelasi</strong> (default 8%, LGD 50% → rugi 4%). Terjadi resesi properti: harga rumah jatuh 30% nasional, default melonjak ke <strong>35%</strong> dan <strong>berkorelasi</strong> (semua wilayah kena).</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung rugi pool &amp; siapa menanggung berapa. (b) Apakah tranche &ldquo;AAA&rdquo; senior selamat? (c) Di mana kesalahan modelnya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Rugi = 35% × 50% × Rp2 T = <strong>Rp350 M</strong> (17,5% pool). Equity (Rp200 M) <strong>habis total</strong>; sisa Rp150 M → mezzanine (Rp300 M) <strong>hangus 50%</strong>; senior <strong>selamat</strong> (belum tersentuh) — tapi nyaris.</p>
          <p>(b) <strong>Selamat secara nominal, hancur secara harga pasar.</strong> Pasar melihat mezzanine jebol 50% → menuntut diskon besar untuk senior juga (risiko korelasi kini &ldquo;terbukti&rdquo;). Rating AAA diturunkan beruntun. <em>Mark-to-market</em> membunuh sebelum <em>default</em> membunuh.</p>
          <p>(c) <strong>Asumsi korelasi.</strong> Model memakai korelasi rendah dari masa tenang. Krisis = korelasi → 1 (E8: correlation breakdown!). Pelajaran abadi: <strong>uji modelmu dengan asumsi musuh, bukan asumsi teman</strong>.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Repo Rp100 Miliar Semalam — Berapa Bunganya?</h2>
      <p>Bank X repo SBN Rp100 miliar, <strong>overnight</strong> (1 hari), rate <strong>5,5%/tahun</strong>. Berapa bunga yang dibayar besok pagi? (Konvensi pasar uang: tahun = 360 hari.)</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus:</strong> bunga = pokok × rate × (hari/360).</p>
        <p><strong>Hitung:</strong> 100.000.000.000 × 0,055 × (1/360) = <strong>Rp15.277.778</strong> (≈ Rp15,3 juta).</p>
        <p><strong>Artinya:</strong> Bank X &ldquo;menyewa&rdquo; Rp100 miliar semalam seharga Rp15,3 juta — <strong>0,015%</strong> dari pokoknya. Murah? Tentu — karena <strong>ada jaminan</strong> (SBN digadaikan) dan <strong>hanya semalam</strong> (risiko nyaris nol).</p>
        <p><strong>Intuisi:</strong> repo = <strong>gadai modern antar bank</strong>. Bedanya dengan pinjam tanpa jaminan (<em>unsecured interbank</em>): repo rate <em>lebih rendah</em> karena ada kolateral. Selisih keduanya = <strong>harga dari kepercayaan</strong> — dan saat krisis, selisih ini meledak (lihat Konteks!).</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Membeli SBN dengan Diskonto — Harga di Bawah Nominal</h2>
      <p>SPN (<em>Surat Perbendaharaan Negara</em>) 90 hari, nominal Rp1 miliar, didiskonto pada <strong>6%/tahun</strong>. Berapa harga belinya hari ini, dan berapa yield efektifnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Diskonto:</strong> 1.000.000.000 × 0,06 × (90/360) = <strong>Rp15.000.000</strong>.</p>
        <p><strong>Langkah 2 — Harga beli:</strong> 1.000.000.000 − 15.000.000 = <strong>Rp985.000.000</strong>.</p>
        <p><strong>Langkah 3 — Yield efektif (atas dana yang <em>ditanam</em>):</strong> 15.000.000 &divide; 985.000.000 × (360/90) = <strong>6,09%</strong> — sedikit di atas 6% kuotasi, karena basisnya dana riil (985 jt), bukan nominal.</p>
        <p><strong>Intuisi:</strong> instrumen pasar uang <strong>tidak punya kupon</strong> — untungnya = <em>selisih diskonto</em> (beli murah, terima nominal). Mekaniknya identik dengan TVM E3: harga = PV nominal yang didiskonto. Pasar uang = TVM dengan tenor &lt; 1 tahun + dijamin super-aman + super-likuid.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: September 2008 — Saat Plumbing Mampet Total</h2>
      <p>Lehman Brothers bangkrut 15 September 2008. Yang terjadi berikutnya bukan di bursa saham — melainkan di <strong>pasar uang</strong>:</p>
      <ul>
        <li><strong>Pembekuan total:</strong> bank-bank <strong>berhenti saling meminjamkan</strong> semalam — tidak ada yang tahu bank mana yang menyimpan &ldquo;racun&rdquo; subprime. Suku bunga antar bank (LIBOR-OIS spread) meledak dari ~10 bps ke <strong>&gt;350 bps</strong>: harga <em>ketidakpercayaan</em>.</li>
        <li><strong>Run on money market funds:</strong> Reserve Primary Fund — reksa dana pasar uang raksasa AS — &ldquo;<em>broke the buck</em>&rdquo; (NAV jatuh di bawah US$1) karena memegang surat utang Lehman. Nasabah menarik <strong>US$300 miliar</strong> dari money market funds dalam hitungan hari — <em>bank run</em> versi modern, tanpa antrean fisik.</li>
        <li><strong>Respons:</strong> The Fed &amp; bank sentral dunia membuka <strong>fasilitas likuiditas darurat</strong> (pinjaman dengan jaminan longgar) — pada dasarnya menjadi <strong>&ldquo;tukang ledeng terakhir&rdquo;</strong> (<em>lender of last resort</em>) untuk pasar uang. Tanpa itu, sistem pembayaran global berhenti.</li>
      </ul>
      <p><strong>Pelajaran:</strong> (1) <strong>pasar uang = sistem saraf</strong> — ia kecil dibanding pasar modal, tapi kegagalannya <em>sistemik</em>; (2) <strong>kepercayaan = likuiditas</strong> — pasar uang berjalan di atas keyakinan bahwa lawan bayar besok pagi; saat keyakinan hilang, tidak ada harga yang bisa memperbaikinya (bunga berapa pun, tidak ada yang mau meminjamkan!); (3) <strong>&ldquo;aman &amp; likuid&rdquo; ≠ &ldquo;bebas risiko&rdquo;</strong> — Reserve Primary Fund dianggap setara kas, sampai ia tidak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>repo vs reverse repo</strong> — keduanya transaksi <em>yang sama</em> dilihat dari dua sisi! Bank X butuh kas &rarr; <em>repo</em> (jual SBN + janji beli kembali). Bank Y punya kas nganggur &rarr; <em>reverse repo</em> (beli SBN + janji jual kembali). Satu akad, dua nama — seperti &ldquo;pinjam&rdquo; vs &ldquo;meminjamkan&rdquo;. Jangan tertukar saat membaca laporan treasury.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar uang = tanpa risiko, seperti kas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> risikonya <em>kecil</em>, bukan <em>nol</em> — dan jenisnya spesifik: <strong>risiko likuiditas</strong> (2008: tidak ada yang mau meminjamkan!) dan <strong>risiko kredit jangka pendek</strong> (<em>commercial paper</em> perusahaan bisa gagal — Lehman!). Reksa dana pasar uang &ldquo;hampir kas&rdquo; — tapi <em>hampir</em> ≠ <em>sama</em>. Untuk dana yang <strong>harus</strong> tersedia besok pagi (gaji karyawan, kliring), bahkan &ldquo;hampir&rdquo; pun terlalu berisiko — pakai deposito/LPS atau kas murni.</p>
      </div>

      <h2 id="srbi">🔧 Pendalaman: SRBI — Senjata Baru Bank Indonesia</h2>
      <p>Sejak 2023, BI menerbitkan <strong>SRBI</strong> (<em>Sekuritas Rupiah Bank Indonesia</em>) — instrumen pasar uang bertenor 6/9/12 bulan yang bisa dibeli investor (termasuk asing). Kenapa ini penting?</p>
      <ul>
        <li><strong>Fungsi ganda:</strong> (1) <strong>operasi moneter</strong> — BI menyerap likuiditas rupiah (menjual SRBI = menarik rupiah dari peredaran &rarr; mendukung rupiah &amp; mengendalikan inflasi); (2) <strong>pendalaman pasar uang</strong> — memberi <em>benchmark</em> yield jangka pendek yang transparan.</li>
        <li><strong>Daya tarik investor:</strong> yield SRBI kompetitif + tenor pendek + diterbitkan bank sentral (= risiko kredit ~nol) &rarr; menjadi <strong>parkir favorit dana asing</strong> — yang juga berarti <em>arus modal jangka pendek</em> yang bisa keluar-masuk cepat (pedang bermata dua untuk stabilitas rupiah — E12!).</li>
        <li><strong>Untuk ritel:</strong> SRBI tidak dibeli langsung (lelang via bank), tapi yield-nya <strong>menjadi acuan</strong> bunga deposito &amp; reksa dana pasar uang. Saat yield SRBI naik, bunga deposits <em>seharusnya</em> ikut naik — jika bankmu tidak menaikkan, ia menikmati margin lebih tebal dari danamu. <strong>Pengetahuan = daya tawar.</strong></li>
      </ul>
      <p><strong>Benang merah track:</strong> E14 (pasar uang) ↔ E12 (kurs) ↔ E4 (obligasi) = <strong>segitiga kebijakan moneter</strong>. BI rate → SRBI/deposito → kredit &amp; rupiah → inflasi. Analis yang paham segitiga ini bisa membaca <em>niat</em> BI dari tiap lelang SRBI — skill yang membedakan komentator dari analis.</p>


      <h2 id="opt">🔧 Pendalaman: Operasi Pasar Terbuka — Tangan BI di Pasar Uang</h2>
      <p>BI Rate diumumkan — tapi <em>bagaimana</em> BI &ldquo;memaksa&rdquo; bunga pasar mengikutinya? Lewat <strong>Operasi Pasar Terbuka (OPT)</strong> di pasar uang:</p>
      <ul>
        <li><strong>BI ingin bunga NAIK</strong> (lawan inflasi): <strong>jual SRBI/SBN</strong> ke pasar &rarr; rupiah tersedot dari peredaran &rarr; likuiditas ketat &rarr; bunga antar bank naik mengikuti. (Seperti melepas udara dari balon likuiditas.)</li>
        <li><strong>BI ingin bunga TURUN</strong> (stimulus): <strong>beli SBN</strong> dari pasar (<em>quantitative easing</em> versi Indonesia) &rarr; rupiah membanjir &rarr; bunga turun.</li>
        <li><strong>Target operasionalnya:</strong> suku bunga antar bank overnight (<strong>INDONIA</strong>) dijaga <em>di sekitar</em> BI Rate — jika INDONIA melenceng jauh, artinya transmisi macet dan BI menambah/mengurangi OPT.</li>
      </ul>
      <p><strong>Rantai transmisi lengkap:</strong> BI Rate → OPT → INDONIA/pasar uang → <strong>bunga deposito &amp; kredit bank</strong> → konsumsi/investasi → <strong>inflasi &amp; pertumbuhan</strong> → kembali ke keputusan BI Rate berikutnya. <strong>Satu lingkaran kebijakan.</strong> Setiap mata rantai bisa &ldquo;bocor&rdquo;: bank yang tidak meneruskan penurunan bunga ke kredit (margin!), ekspektasi inflasi yang bandel, atau guncangan global (E12!).</p>
      <h2 id="worked4">🔬 Worked Example: BI Rate Turun 0,5% — Berapa yang Sampai ke Kamu?</h2>
      <p>BI memangkas rate 7,00% → <strong>6,50%</strong> (−50 bps). Deposito 1 tahun bankmu saat ini <strong>5,5%</strong>. Berapa deposito barumu — dan berapa penghematan cicilan KPR Rp500 juta?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Transmisi ke deposito:</strong> bank biasanya meneruskan <strong>60–80%</strong> (tidak penuh — margin!). Asumsi 70%: deposito baru ≈ 5,5% − (0,70 × 0,5%) = 5,5% − 0,35% = <strong>5,15%</strong>. Deposito Rp100 juta: bunga tahunan turun Rp5,5 jt → Rp5,15 jt (<strong>−Rp350 ribu</strong>).</p>
        <p><strong>Langkah 2 — Transmisi ke KPR</strong> (floating 9%): turun 0,35% → 8,65%. Cicilan tahunan baru (E3!): A = 500 × 0,0865/(1 − 1,0865<sup>−20</sup>). 1,0865<sup>20</sup> ≈ 5,24 &rarr; A ≈ 500 × 0,0865/0,809 ≈ <strong>Rp53,5 juta</strong> (dari Rp54,8 juta) — <strong>hemat Rp1,3 juta/tahun</strong>.</p>
        <p><strong>Intuisi ganda:</strong> (a) <strong>penabung &ldquo;dirugikan&rdquo;, peminjam &ldquo;diuntungkan&rdquo;</strong> — pemangkasan bunga = <em>transfer</em> dari penabung ke peminjam (inilah kenapa pensiunan protes saat bunga turun!); (b) <strong>transmisi tidak 1:1</strong> — &ldquo;BI turunkan bunga&rdquo; ≠ &ldquo;cicilanmu turun sama besar&rdquo;. Selalu cek <em>berapa yang diteruskan bankmu</em> — dan <strong>tawar</strong> (bank bersaing untuk dana &amp; debitur!).</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>INDONIA</strong> = &ldquo;denyut nadi&rdquo; pasar uang Indonesia (rata-rata bunga pinjaman antar bank overnight). Jika INDONIA <em>di atas</em> BI Rate = likuiditas ketat (bank berebut kas — waspada!). Jika <em>di bawah</em> = longgar. Analis treasury memantau selisih ini <strong>setiap pagi</strong> — ia adalah <em>tekanan darah</em> sistem keuangan: normal = sehat, abnormal = periksa segera.</p>
      </div>


      <h2 id="worked5">🔬 Worked Example: Commercial Paper 7% vs Deposito 5,15% — Mana?</h2>
      <p>Perusahaan AAA menerbitkan <em>commercial paper</em> (CP) 90 hari, yield <strong>7%</strong>. Deposito bankmu <strong>5,15%</strong> (E14 Worked 4!). Dana Rp500 juta, horizon 90 hari. Mana dipilih bendahara perusahaan?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Hasil deposito:</strong> 500 jt × 5,15% × (90/360) = <strong>Rp6.437.500</strong>. Dijamin LPS (≤ Rp2 M &amp; bunga wajar — E15!).</p>
        <p><strong>Langkah 2 — Hasil CP:</strong> 500 jt × 7% × (90/360) = <strong>Rp8.750.000</strong>. Selisih: <strong>+Rp2.312.500</strong>.</p>
        <p><strong>Langkah 3 — Harga selisihnya:</strong> (a) <strong>risiko kredit</strong> — CP = utang perusahaan <em>tanpa agunan &amp; tanpa LPS</em>; jika penerbit gagal (Lehman 2008!), Rp500 juta melayang; (b) <strong>likuiditas</strong> — CP tidak bisa dicairkan sebelum jatuh tempo semudah deposito (penalti/bahkan tidak ada pasar sekunder!); (c) <strong>pajak</strong> — diskonto CP kena PPh final (E15!).</p>
        <p><strong>Keputusan profesional:</strong> untuk <strong>kas operasional</strong> (gaji bulan depan!) &rarr; deposito/LPS — <em>kebutuhan likuiditas mutlak</em> (E14 Myth!). Untuk <strong>kas strategis</strong> menganggur 90 hari + penerbit AAA + diversifikasi beberapa penerbit &rarr; CP layak <em>sebagian</em>. <strong>Aturan bendahara:</strong> <em>&ldquo;jangan kejar 1,85% ekstra dengan uang yang harus ada besok pagi.&rdquo;</em></p>
      </details>


      <h2 id="quiz">✏️ Quiz — Mesin Likuiditas (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fungsi utama pasar uang bagi bank?"
        options={[
          "Spekulasi saham",
          "Manajemen likuiditas harian + transmisi kebijakan moneter BI",
          "Mencari untung besar",
          "Menghindari pajak",
        ]}
        correct={1}
        explanation="Benar: peredaran darah sistem keuangan. Bank menutup kekurangan/klebihan kas harian di sini; BI menyalurkan kebijakan moneter via SRBI/repo."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Repo Rp100 M, 7 hari, bunga 5,5%. Bunga yang dibayar?"
        options={[
          "Rp5,5 M",
          "≈ Rp107 juta (100M × 5,5% × 7/360)",
          "Rp550 juta",
          "Gratis",
        ]}
        correct={1}
        explanation="Benar: konvensi pasar uang = /360. Rp100M × 0,055 × 7/360 ≈ Rp107 juta. Kecil relatif — itulah gunanya agunan SBN."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam sekuritisasi, siapa menanggung kerugian PERTAMA?"
        options={[
          "Tranche senior",
          "Tranche mezzanine",
          "Tranche equity (paling junior)",
          "SPV",
        ]}
        correct={2}
        explanation="Benar: equity = bantalan pertama. Waterfall: rugi masuk dari bawah (equity → mezzanine → senior); arus kas dibayar dari atas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Pelajaran utama 2008 tentang tranche senior AAA?"
        options={[
          "Tranche tidak berguna",
          "Keamanan senior bergantung pada asumsi KORELASI gagal bayar — saat krisis korelasi → 1, senior ikut berdarah",
          "Rating selalu benar",
          "Sekuritisasi harus dilarang",
        ]}
        correct={1}
        explanation="Benar: titik buta = korelasi. Model memakai korelasi masa tenang; krisis menyeret semua default bersamaan. Uji dengan asumsi musuh!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Structured product 'pokok dijamin'. Risiko yang sering dilupakan?"
        options={[
          "Tidak ada risiko",
          "Risiko PENERBIT — jaminan hanya sekuat bank yang menerbitkan; plus biaya tersembunyi & likuiditas rendah",
          "Risiko kurs",
          "Risiko inflasi saja",
        ]}
        correct={1}
        explanation="Benar: 'dijamin' = oleh penerbit. Jika penerbit bangkrut, jaminan hangus. Selalu bedah: siapa penjamin, berapa biaya implisit, bisa exit kapan?"
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Pasar uang</strong> = instrumen ≤ 1 tahun; peredaran darah likuiditas + jalur moneter BI (SRBI, PUAB, repo).</li>
          <li><strong>Repo</strong> = gadai modern (SBN vs kas); bunga = pokok × r × hari/360; barometer kepercayaan antar bank.</li>
          <li><strong>Sekuritisasi</strong>: pool kredit → SPV → EBA ber-tranche; motif bank = modal, risiko, likuiditas.</li>
          <li><strong>Waterfall</strong>: rugi dari equity ke atas; kas dibayar dari senior ke bawah.</li>
          <li>Tranche senior &ldquo;aman&rdquo; <strong>hanya sebagus asumsi korelasinya</strong> — 2008 = buktinya.</li>
          <li><strong>Structured products</strong> = rakitan obligasi + derivatif; waspadai risiko penerbit &amp; biaya tersembunyi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e13-market-risk" className="btn btn-secondary btn-sm">← E13</Link>
        <Link href="/learn/e15-indonesia" className="btn btn-primary btn-sm">Next: E15 →</Link>
      </div>
    </div>
  );
}
