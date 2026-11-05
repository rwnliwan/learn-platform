"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR17Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Utilisasi limit per desk (% dari limit)
  const limitData = [
    {
      x: ["Rates", "FX", "Ekuitas", "Kredit", "Komoditas"],
      y: [92, 65, 110, 78, 45],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1", "#ef4444", "#2a7de1", "#2a7de1"] },
    },
  ];
  const limitLayout: any = {
    xaxis: { title: "Desk" },
    yaxis: { title: "Utilisasi limit VaR (%)" },
    showlegend: false,
    shapes: [
      { type: "line", x0: -0.5, x1: 4.5, y0: 100, y1: 100, line: { color: "#ef4444", width: 2, dash: "dash" } },
      { type: "line", x0: -0.5, x1: 4.5, y0: 80, y1: 80, line: { color: "#e8a838", width: 1.5, dash: "dot" } },
    ],
    annotations: [
      { x: 4.3, y: 102, text: "Batas (100%)", showarrow: false, font: { color: "#ef4444", size: 11 } },
      { x: 4.3, y: 82, text: "Peringatan (80%)", showarrow: false, font: { color: "#e8a838", size: 11 } },
    ],
  };

  // Risk appetite cascade: dari board ke desk (ilustrasi alokasi)
  const cascadeData = [
    {
      x: ["Board (total)", "Divisi Markets", "Divisi Treasury", "Desk Rates", "Desk FX", "Desk Ekuitas"],
      y: [500, 300, 200, 120, 80, 100],
      type: "bar",
      marker: { color: ["#1e3a5f", "#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#e8a838"] },
    },
  ];

  const lab1Code = String.raw`# SIMULASI PELANGGARAN LIMIT: kapan limit 'terpakai' dan apa yang terjadi.
# Limit VaR desk = 100. Utilisasi harian berfluktuasi. Aturan:
#   >= 80%: peringatan (amber) -> risk manager menelepon desk
#   >= 100%: pelanggaran (red) -> trading DIHENTIKAN sampai eksposur turun
#   3x pelanggaran/bulan -> review limit & strategi oleh komite

import random
random.seed(17)

limit = 100
util, breaches, ambers = 70.0, 0, 0
print("Hari | Utilisasi | Status")
for day in range(1, 31):
    util += random.gauss(2, 8)   # drift naik + noise (desk agresif!)
    util = max(20, util)
    if util >= 100:
        status, breaches = "MERAH (breach! trading stop)", breaches + 1
        util = 85  # forced de-risking
    elif util >= 80:
        status, ambers = "KUNING (peringatan)", ambers + 1
    else:
        status = "hijau"
    if day % 5 == 0 or "MERAH" in status:
        print(f"{day:>4d} | {util:>8.0f}% | {status}")
print()
print(f"Total: {ambers} peringatan, {breaches} pelanggaran dalam sebulan.")
print("Coba: ubah drift 2 -> 0 (desk disiplin). Berapa breach tersisa?")
print("Limit tanpa eskalasi = dekorasi. Yang penting BUKAN angkanya,")
print("tapi APA YANG TERJADI saat tersentuh.")`;

  const lab2Code = String.raw`# RISK APPETITE CASCADE: alokasi limit top-down dengan diversifikasi.
# Board: total VaR appetite 500. Divisi & desk mendapat alokasi.
# Kunci: jumlah alokasi desk BISA > total (diversifikasi!) -- tapi butuh buffer.

import math

board = 500
# Alokasi per desk (standalone VaR limit)
desks = {"Rates": 150, "FX": 100, "Ekuitas": 130, "Kredit": 90, "Komoditas": 60}
total_alokasi = sum(desks.values())
print(f"Total alokasi desk: {total_alokasi} vs appetite board: {board}")
print(f"Rasio: {total_alokasi/board:.2f}x -- diversifikasi 'membayar' {(total_alokasi-board)}")
print()
# Tapi korelasi naik saat krisis -> manfaat diversifikasi menyusut -> butuh BUFFER
# Buffer = board - VaR agregat aktual. Jika buffer < 0 -> BREACH appetite!
korelasi_normal, korelasi_krisis = 0.3, 0.8
# VaR agregat ~ sqrt(sum vi^2 + 2*rho*sum_{i<j} vi*vj) -- aproksimasi
v = list(desks.values())
def agregat(rho):
    s1 = sum(x*x for x in v)
    s2 = sum(v[i]*v[j] for i in range(len(v)) for j in range(i+1, len(v)))
    return math.sqrt(s1 + 2*rho*s2)

for label, rho in [("Normal", korelasi_normal), ("Krisis", korelasi_krisis)]:
    agg = agregat(rho)
    print(f"Korelasi {label:6s} (rho={rho}): VaR agregat = {agg:.0f}  "
          f"-> {'OK' if agg <= board else 'BREACH APPETITE!'} (buffer {board-agg:+.0f})")
print()
print("Pelajaran: appetite yang 'pas' di masa normal bisa JEBOL di krisis")
print("karena diversifikasi menguap. Sisakan buffer -- atau turunkan alokasi.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR17 — Market Risk Analytics</span>
        <h1 className="display-title">Limit, Risk Appetite &amp;<br />Laporan Risiko Harian</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Limit yang Tidak Pernah Tersentuh</a></li>
          <li><a href="#appetite">Risk Appetite: Selera Risiko Dewan</a></li>
          <li><a href="#jenislimit">Jenis-Jenis Limit</a></li>
          <li><a href="#eskalasi">Eskalasi Pelanggaran: Limit Tanpa Gigi</a></li>
          <li><a href="#laporan">Laporan Risiko Harian: Anatomi</a></li>
          <li><a href="#ipv">IPV: Memverifikasi Harga Sendiri</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Pelanggaran Limit</a></li>
          <li><a href="#lab2">🔬 Lab 2: Alokasi Appetite &amp; Buffer Diversifikasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Kerviel &amp; Leeson — Ketika Limit Hanya di Kertas</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan yang Tidak Dibaca</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan hirarki risk appetite: dari pernyataan dewan hingga limit desk — dan mengapa jumlah alokasi bisa melebihi total.</li>
          <li>Membedakan jenis limit (VaR, sensitivitas, notional, stop-loss, konsentrasi) dan kapan tiap jenis menjadi pengaman utama.</li>
          <li>Merancang prosedur eskalasi pelanggaran limit yang punya &ldquo;gigi&rdquo; (konsekuensi nyata).</li>
          <li>Menyusun struktur laporan risiko harian yang dibaca pengambil keputusan (bukan sekadar arsip).</li>
          <li>Menjelaskan IPV (Independent Price Verification) dan mengapa verifikasi harga adalah fungsi risiko, bukan akuntansi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Limit yang Tidak Pernah Tersentuh</h2>
      <div className="story">
        <p>Bank memiliki <strong>limit VaR Rp100 miliar</strong> untuk desk kredit. Selama 3 tahun, utilisasi tidak pernah melewati 60%. Komite risiko bangga: &ldquo;Disiplin kami bagus.&rdquo; Lalu 2008: dalam 2 minggu, kerugian desk mencapai <strong>Rp400 miliar</strong> — 4× limit — <em>tanpa satu pun pelanggaran limit tercatat sebelumnya</em>.</p>
        <p>Bagaimana mungkin? Investigasi menemukan: limit VaR dihitung dari <strong>data masa tenang</strong> (ingat MR2!) — VaR-nya sendiri yang salah, bukan disiplinnya. Dan yang lebih buruk: <strong>tidak ada limit sensitivitas</strong> (DV01, CS01) — desk menumpuk eksposur ke <em>satu faktor</em> (spread perumahan AS) yang tidak terlihat di angka VaR agregat.</p>
        <p>Twist-nya: <strong>limit yang tidak pernah tersentuh sama berbahayanya dengan tidak ada limit</strong> — ia memberi ilusi kontrol. Limit yang sehat <em>sesekali</em> tersentuh (itu tandanya ia mengikat!), punya <strong>lapisan ganda</strong> (VaR + sensitivitas + konsentrasi), dan yang terpenting: <strong>ditegakkan</strong> saat tersentuh. Lesson ini tentang merancang sistem limit yang hidup — dari selera dewan hingga laporan harian.</p>
      </div>

      <h2 id="appetite">Risk Appetite: Selera Risiko Dewan</h2>
      <p><strong>Definisi.</strong> <strong>Risk appetite</strong> = jumlah &amp; jenis risiko yang <strong>dewan direksi bersedia ambil</strong> untuk mencapai tujuan strategis. Dinyatakan dalam <strong>Risk Appetite Statement (RAS)</strong> — dokumen yang mengikat, bukan slogan.</p>
      <p><strong>Hirarki (cascade):</strong></p>
      <ol>
        <li><strong>Board:</strong> &ldquo;Total VaR ≤ Rp500 M; kerugian stres ≤ Rp2 T; tidak ada kerugian &gt; Rp1 T dalam setahun.&rdquo;</li>
        <li><strong>Divisi:</strong> alokasi ke Markets, Treasury, dll.</li>
        <li><strong>Desk:</strong> limit operasional per desk/trader.</li>
      </ol>
      <p><strong>Paradoks alokasi:</strong> jumlah limit desk (150+100+130+90+60 = <strong>530</strong>) <em>boleh</em> melebihi appetite board (500) — karena <strong>diversifikasi</strong> antar desk membuat VaR agregat &lt; jumlahnya. Tapi ini <strong>pedang bermata dua</strong>: saat krisis, korelasi → 1, diversifikasi menguap, dan agregat <strong>menembus</strong> appetite (buktikan di Lab 2!).</p>

      <PlotlyChart
        data={cascadeData}
        title="Risk Appetite Cascade: Alokasi Limit (Rp miliar)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Limit VaR (Rp miliar)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = alokasi limit di tiap tingkat — dari board (500) turun ke divisi lalu ke desk.</p>
        <p><strong>Interpretasi:</strong> total alokasi desk (530) &gt; appetite board (500) — <strong>disengaja</strong>, mengandalkan diversifikasi. <strong>Risikonya:</strong> jika korelasi antar desk melonjak (krisis), VaR agregat bisa menembus 500 tanpa satu pun desk melanggar limitnya! Inilah mengapa butuh <strong>buffer</strong> dan <strong>limit agregat</strong> yang dipantau terpisah — bukan cuma limit per desk.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> risk appetite yang baik menyebut <strong>angka + kondisi</strong>: &ldquo;VaR ≤ 500 <em>dalam kondisi normal</em>; kerugian stres ≤ 2T <em>dalam skenario X</em>&rdquo;. Appetite tanpa skenario = angka tanpa makna. Dan yang paling penting: appetite harus <strong>dapat ditolak</strong> — jika bisnis ingin melampaui, ada proses persetujuan eksplisit, bukan &ldquo;ya sudah jalan saja&rdquo;.</p>
      </div>

      <h2 id="jenislimit">Jenis-Jenis Limit</h2>
      <p>Limit yang sehat <strong>berlapis</strong> — tiap jenis menangkap risiko yang lolos dari jenis lain:</p>
      <ul>
        <li><strong>VaR/ES limit:</strong> batas kerugian agregat (probabilistik). <em>Kelemahan:</em> buta ekor (VaR), buta konsentrasi faktor.</li>
        <li><strong>Sensitivitas limit:</strong> DV01, CS01, delta, vega per faktor. <em>Menangkap:</em> konsentrasi ke satu faktor yang disembunyikan agregat VaR.</li>
        <li><strong>Notional limit:</strong> batas nilai nominal posisi. <em>Menangkap:</em> ukuran mentah — kasar tapi tidak bisa &ldquo;dimanipulasi&rdquo; model.</li>
        <li><strong>Stop-loss limit:</strong> batas kerugian aktual kumulatif (misal bulanan). <em>Menangkap:</em> &ldquo;model salah&rdquo; — jika rugi aktual menembus, hentikan dulu, selidiki kemudian.</li>
        <li><strong>Konsentrasi limit:</strong> batas eksposur ke satu obligor/sektor/negara. <em>Menangkap:</em> &ldquo;telur dalam satu keranjang&rdquo;.</li>
        <li><strong>Liquidity limit:</strong> batas % ADV, tenor maksimal. <em>Menangkap:</em> risiko terjebak (MR13).</li>
      </ul>
      <p><strong>Aturan:</strong> tidak ada <em>satu</em> limit yang cukup. VaR tanpa sensitivitas = buta konsentrasi. Sensitivitas tanpa stop-loss = buta model-salah. <strong>Minimal tiga lapis</strong> untuk setiap desk material.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Semakin banyak limit semakin aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> limit yang terlalu banyak/ketat = <strong>diabaikan atau diakali</strong> (trader mengoptimasi <em>di sekitar</em> limit — &ldquo;limit gaming&rdquo;). Kualitas &gt; kuantitas: sedikit limit yang <strong>dipahami, dipantau, dan ditegakkan</strong> mengalahkan 50 limit yang hanya ada di dokumen. Setiap limit harus punya <strong>pemilik, pemantau, dan konsekuensi</strong>.</p>
      </div>

      <h2 id="eskalasi">Eskalasi Pelanggaran: Limit Tanpa Gigi</h2>
      <p><strong>Definisi.</strong> <strong>Eskalasi</strong> = apa yang terjadi <em>otomatis</em> saat limit tersentuh. Tanpa ini, limit = saran.</p>
      <p><strong>Struktur tipikal:</strong></p>
      <ul>
        <li><strong>80% (amber):</strong> peringatan otomatis → risk manager menghubungi desk → rencana pengurangan <em>sukarela</em>.</li>
        <li><strong>100% (red/breach):</strong> <strong>trading dihentikan</strong> untuk menambah risiko → desk wajib menurunkan eksposur dalam X hari → lapor ke komite.</li>
        <li><strong>Breach berulang:</strong> review limit + strategi + <em>insentif</em> (apakah limit terlalu ketat? atau desk terlalu agresif?).</li>
      </ul>

      <PlotlyChart
        data={limitData}
        title="Utilisasi Limit VaR per Desk (%)"
        layout={limitLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = utilisasi limit tiap desk. Garis kuning titik-titik = ambang peringatan 80%; garis merah = batas 100%.</p>
        <p><strong>Interpretasi:</strong> <strong>Desk Ekuitas breach (110%)</strong> — trading tambah-risiko harus <em>berhenti hari ini</em>, bukan &ldquo;besok dikurangi&rdquo;. <strong>Desk Rates (92%)</strong> di zona amber — telepon risk manager <em>sekarang</em>, bukan menunggu merah. <strong>Pola sehat:</strong> utilisasi 60–90% (limit mengikat tapi tidak mencekik). Utilisasi &lt; 30% terus-menerus = limit terlalu longgar (atau bisnis menyusut — selidiki!).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>limit yang tidak pernah tersentuh = limit yang tidak bekerja.</strong> Jika semua desk selalu di bawah 50%, limitmu bukan pengaman — melainkan dekorasi. Kalibrasi yang sehat: limit <em>sesekali</em> tersentuh (amber), <em>jarang</em> dilanggar (red), dan <em>selalu</em> ditindaklanjuti saat tersentuh.</p>
      </div>

      <h2 id="laporan">Laporan Risiko Harian: Anatomi</h2>
      <p><strong>Definisi.</strong> <strong>Laporan risiko harian</strong> = paket informasi yang diterima pengambil keputusan <em>setiap pagi</em> sebelum pasar buka. Tujuannya <strong>satu</strong>: memungkinkan keputusan <em>hari ini</em>.</p>
      <p><strong>Anatomi laporan yang dibaca</strong> (bukan yang diarsip):</p>
      <ol>
        <li><strong>Ringkasan eksekutif (1 halaman):</strong> VaR/ES vs limit, P&amp;L kemarin vs ekspektasi, breach &amp; amber, <em>satu paragraf</em> &ldquo;apa yang berubah &amp; apa aksinya&rdquo;.</li>
        <li><strong>P&amp;L explain:</strong> dekomposisi per faktor (MR1) + unexplained. <em>Unexplained besar = headline, bukan footnote.</em></li>
        <li><strong>Utilisasi limit:</strong> per desk, dengan tren (bukan cuma snapshot).</li>
        <li><strong>Sensitivitas kunci:</strong> DV01, CS01, delta, vega — top exposures.</li>
        <li><strong>Stress &amp; skenario:</strong> hasil skenario standar vs appetite.</li>
        <li><strong>Konsentrasi:</strong> top-10 eksposur per obligor/sektor.</li>
        <li><strong>Kualitas data:</strong> IPV exception, data stale — <em>jujur tentang apa yang tidak diketahui</em>.</li>
      </ol>
      <p><strong>Aturan emas:</strong> jika laporan butuh &gt; 15 menit untuk dipahami intinya, ia <strong>gagal</strong>. Halaman 1 harus menjawab: &ldquo;apakah kita aman? jika tidak, apa yang harus dilakukan hari ini?&rdquo;</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Laporan risiko yang baik = laporan yang lengkap.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> laporan 200 halaman yang tidak dibaca = <strong>nol nilai</strong>. Kelengkapan tanpa hirarki = kuburan informasi. Prinsip: <strong>1 halaman untuk keputusan, lampiran untuk investigasi</strong>. Setiap tabel harus punya &ldquo;jadi apa?&rdquo; — jika tidak ada aksi yang bisa diambil darinya, buang dari laporan harian (pindah ke mingguan/bulanan).</p>
      </div>

      <h2 id="ipv">IPV: Memverifikasi Harga Sendiri</h2>
      <p><strong>Definisi.</strong> <strong>IPV (Independent Price Verification)</strong> = fungsi independen (bukan trader, bukan front office) yang <strong>memverifikasi harga</strong> (mark) yang dipakai untuk valuasi portofolio — dengan <strong>sumber independen</strong> (broker quote, konsensus, model independen).</p>
      <p><strong>Kenapa ini fungsi risiko:</strong> trader punya <strong>insentif</strong> untuk mark yang menguntungkan (bonus berbasis P&amp;L!). Tanpa IPV, valuasi = &ldquo;kata trader&rdquo;. Kasus klasik: mark obligasi illiquid yang &ldquo;optimis&rdquo; 2% — untuk portofolio Rp5 T = <strong>Rp100 M</strong> P&amp;L fiktif.</p>
      <p><strong>Mekanisme:</strong></p>
      <ol>
        <li>Bandingkan mark trader vs sumber independen → hitung <strong>selisih (variance)</strong>.</li>
        <li>Selisih &gt; threshold → <strong>adjustment</strong> (valuation reserve) + investigasi.</li>
        <li>Laporkan ke komite: tren variance per desk = <strong>indikator integritas</strong>.</li>
      </ol>
      <p><strong>Kaitan dengan risiko pasar:</strong> VaR/ES/limit semuanya <strong>dibangun di atas harga</strong>. Harga salah → semua angka salah. IPV adalah <strong>fondasi</strong> yang memastikan bangunan di atasnya tidak berdiri di atas pasir.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> IPV menjawab pertanyaan yang tidak pernah ditanyakan laporan lain: <strong>&ldquo;apakah angka-angka ini benar?&rdquo;</strong> Semua metrik canggih (VaR, ES, Greeks) tidak berguna jika input harganya fiktif. Dalam hierarki kebutuhan analis risiko: <strong>data benar &gt; model canggih</strong>. Selalu.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi Pelanggaran Limit</h2>
      <p>Ubah drift (2 → 0 → −1) dan lihat frekuensi breach. Berapa drift maksimal agar breach &lt; 1×/bulan?</p>
      <PyodideLab
        title="Lab 1 — Dinamika Utilisasi & Eskalasi Limit"
        hint="Coba drift=5 (sangat agresif): breach berkali-kali → forced de-risking berulang → 'limit churn'. Inilah mengapa eskalasi harus naik tingkat, bukan sekadar reset."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Alokasi Appetite &amp; Buffer Diversifikasi</h2>
      <p>Ubah korelasi krisis (0,8 → 0,95). Seberapa besar buffer yang dibutuhkan agar appetite tidak jebol?</p>
      <PyodideLab
        title="Lab 2 — Cascade Appetite: Diversifikasi Bisa Menguap"
        hint="Coba korelasi=1.0 (krisis total): agregat = jumlah alokasi = 530 > 500. Inilah 'diversification breakdown' — alasan stress test (MR7) wajib, bukan opsional."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Menetapkan risk appetite → <strong>Angka + skenario + proses persetujuan pelampauan</strong></h3>
        <p><strong>Kondisi:</strong> RAS tahunan dewan.</p>
        <p><strong>Alasan:</strong> appetite tanpa skenario = angka tanpa makna; tanpa proses pelampauan = akan dilanggar diam-diam.</p>
      </div>

      <div className="decision-card">
        <h3>2. Mendesain limit desk → <strong>Minimal 3 lapis: VaR/ES + sensitivitas + stop-loss</strong></h3>
        <p><strong>Kondisi:</strong> setiap desk material.</p>
        <p><strong>Alasan:</strong> tiap lapis menangkap kegagalan lapis lain (agregat vs konsentrasi vs model-salah). Tambah konsentrasi &amp; likuiditas untuk portofolio besar.</p>
      </div>

      <div className="decision-card">
        <h3>3. Limit tersentuh → <strong>Eskalasi otomatis sesuai level (amber/red)</strong></h3>
        <p><strong>Kondisi:</strong> monitoring harian.</p>
        <p><strong>Alasan:</strong> kecepatan &gt; kesempurnaan. Amber = telepon hari ini; red = stop tambah risiko hari ini. Tidak ada &ldquo;nanti&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Meragukan angka laporan → <strong>IPV: verifikasi harga independen</strong></h3>
        <p><strong>Kondisi:</strong> rutin bulanan + saat pasar stres.</p>
        <p><strong>Alasan:</strong> semua metrik dibangun di atas harga. Variance IPV yang membesar = sinyal dini masalah (atau kecurangan).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Limit</strong> = angka + pemilik + pemantau + konsekuensi. Tanpa konsekuensi = saran.</li>
          <li><strong>3 lapis minimum</strong>: VaR/ES + sensitivitas + stop-loss.</li>
          <li><strong>Laporan harian</strong>: 1 halaman keputusan + lampiran investigasi.</li>
          <li><strong>Data benar &gt; model canggih</strong> — IPV adalah fondasi.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Kerviel &amp; Leeson — Ketika Limit Hanya di Kertas</h2>
      <p>Dua nama yang wajib dikenal setiap risk manager: <strong>Nick Leeson</strong> (Barings, 1995 — US$1,4 miliar, bank 233 tahun bangkrut) dan <strong>Jérôme Kerviel</strong> (Société Générale, 2008 — €4,9 miliar, kerugian rogue trading terbesar sejarah). Keduanya <strong>bukan</strong> kegagalan model VaR — keduanya adalah kegagalan <strong>limit, kontrol, dan tata kelola</strong>. Pelajaran untuk MR17.</p>

      <h3>Leeson (Barings, 1995): ketika penjaga gawang merangkap striker</h3>
      <p>Leeson adalah <strong>kepala trading <em>dan</em> kepala settlement/back-office</strong> di kantor Barings Singapura — ia mengawasi dirinya sendiri. Kerugian trading disembunyikan di <strong>akun error 88888</strong> yang hanya ia yang bisa lihat. Tidak ada segregasi tugas (<em>segregation of duties</em>) — kontrol paling dasar dalam keuangan.</p>
      <p><strong>Pelajaran limit:</strong> limit VaR/posisi Barings <em>ada</em> — tapi Leeson yang melaporkan angkanya sendiri. <strong>Limit tanpa verifikasi independen = dekorasi.</strong> Inilah alasan fungsi risiko harus <strong>independen dari front office</strong> (prinsip yang kini diwajibkan Basel): yang mengukur risiko tidak boleh yang mengambil risiko.</p>

      <h3>Kerviel (SocGen, 2008): limit yang diakali dari dalam</h3>
      <p>Kerviel lebih canggih: ia <strong>mantan staf back-office</strong> yang paham cara kerja sistem kontrol — lalu menjadi trader. Ia membangun posisi futures ekuitas <strong>€50 miliar</strong> (lebih besar dari kapitalisasi SocGen!) sambil memalsukan hedge penyeimbang di sistem. Sistem limit melihat &ldquo;posisi netral&rdquo;; kenyataannya directional raksasa.</p>
      <p><strong>Tiga kegagalan kontrol:</strong></p>
      <ol>
        <li><strong>Limit hanya memeriksa <em>net</em>, bukan <em>gross</em>:</strong> posisi long €50 M + &ldquo;hedge&rdquo; palsu short €50 M = net nol → lolos limit. <strong>Pelajaran:</strong> selalu ada <strong>limit gross/notional</strong> di samping limit net/VaR — karena net bisa dipalsukan, gross tidak (butuh modal nyata).</li>
        <li><strong>Alert yang diabaikan:</strong> sistem <em>sebenarnya</em> memunculkan peringatan — tapi dianggap &ldquo;noise&rdquo; dan tidak ditindaklanjuti. <strong>Pelajaran:</strong> eskalasi yang tidak ditindaklanjuti = tidak ada eskalasi. Setiap alert harus punya <strong>pemilik dan tenggat</strong>.</li>
        <li><strong>Pengetahuan kontrol dipakai menyerang:</strong> Kerviel tahu <em>kapan</em> kontrol dijalankan dan <em>apa</em> yang diperiksa. <strong>Pelajaran:</strong> kontrol harus mencakup <strong>pemeriksaan acak/mendadak</strong> dan rotasi tugas — pola yang bisa diprediksi bisa diakali.</li>
      </ol>
      <p>Ironisnya: Kerviel <em>untung</em> besar sebelum ketahuan (posisi €50 M sempat profit €1,4 Miliar!). Ia tidak mencuri uang — ia <strong>mencuri risiko</strong>: mengambil taruhan raksasa atas nama bank tanpa izin. Saat pasar berbalik Januari 2008, bank terpaksa melikuidasi €50 M dalam 3 hari di pasar panik — <strong>biaya likuidasi</strong> (MR13!) mengubah kerugian menjadi €4,9 Miliar.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: merancang kerangka limit berlapis (klik untuk buka)</summary>
        <p><strong>Desk ekuitas derivatif</strong>, modal dialokasikan Rp2 T. Rancang limit berlapis:</p>
        <p><strong>Langkah 1 — risk appetite (level direksi):</strong> kerugian maksimum yang bisa diterima dari desk ini dalam setahun = <strong>5% dari modal = Rp100 M</strong>. Ini &ldquo;langit-langit&rdquo; yang tidak bisa dinegosiasi.</p>
        <p><strong>Langkah 2 — VaR limit (level desk):</strong> VaR 99%/1-hari ≤ <strong>Rp25 M</strong> (≈ Rp100 M / 4 — buffer karena VaR harian ≠ kerugian tahunan; ada ES dan stres di atasnya).</p>
        <p><strong>Langkah 3 — limit sensitivitas (level trader):</strong> delta ≤ Rp800 M notional ekuivalen; vega ≤ Rp15 M per 1% vol; gamma ≤ Rp5 M per 1%². <strong>Mengapa perlu?</strong> Karena VaR Rp25 M bisa dicapai dengan (a) posisi kecil bervol tinggi, atau (b) posisi raksasa dengan hedge palsu (Kerviel!). Limit sensitivitas <strong>menutup celah (b)</strong>.</p>
        <p><strong>Langkah 4 — limit gross:</strong> gross notional ≤ <strong>Rp4 T</strong> (2× modal). Menangkap &ldquo;net nol, gross gila&rdquo;.</p>
        <p><strong>Langkah 5 — stop-loss:</strong> kerugian kumulatif bulanan &gt; <strong>Rp40 M</strong> → posisi dipotong otomatis 50%; &gt; Rp60 M → tutup semua + review. Stop-loss adalah <strong>rem mekanis</strong> yang tidak butuh rapat.</p>
        <p><strong>Angka ini artinya:</strong> lima lapis limit saling mengunci — VaR menangkap risiko agregat, sensitivitas menangkap komposisi, gross menangkap skala, stop-loss menangkap realisasi. <strong>Satu lapis saja = Kerviel bisa lewat.</strong> Dan semuanya butuh <strong>pemilik independen</strong> (fungsi risiko, bukan trader) + <strong>eskalasi yang ditindaklanjuti</strong> — dua hal yang gagal di Barings dan SocGen.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Rogue trader = orang jahat yang tidak terdeteksi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Leeson dan Kerviel <strong>terdeteksi oleh sistem</strong> — lalu sinyalnya diabaikan atau mereka mengakali pemeriksaannya. Masalahnya bukan &ldquo;tidak ada alarm&rdquo;, melainkan <strong>alarm tanpa respons</strong> dan <strong>kontrol yang bisa diprediksi</strong>. Pelajaran untuk analis: saat kamu menulis laporan limit, pastikan ada <strong>jalur eskalasi yang hidup</strong> — laporan pelanggaran yang berhenti di inbox adalah surat yang tidak pernah dikirim.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji setiap kerangka limit dengan pertanyaan Kerviel: <em>&ldquo;bisakah trader cerdas menyembunyikan posisi €50 miliar dari sistem ini?&rdquo;</em> Jika jawabannya &ldquo;mungkin&rdquo; — tambahkan lapis yang menangkapnya: limit gross, verifikasi hedge ke counterparty (bukan cuma ke sistem internal), rekonsiliasi kas vs posisi. <strong>Kontrol yang baik berasumsi diserang</strong> — seperti keamanan siber. Kepercayaan itu baik; verifikasi itu wajib.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: laporan 1-halaman yang benar-benar dibaca (klik untuk buka)</summary>
        <p><strong>Struktur (contoh desk FX):</strong></p>
        <p><strong>Baris 1 — angka kunci:</strong> VaR Rp18 M / 25 M (72% 🟢) | ES Rp26 M | Backtest 1 🟢 | Skenario &ldquo;IDR −20%&rdquo;: −Rp210 M / 250 M (84% 🟡) | Stop-loss MTD: −Rp12 M / 40 M (30% 🟢).</p>
        <p><strong>Baris 2 — apa yang berubah:</strong> &ldquo;Vega naik 40% minggu ini (posisi carry IDR/JPY baru). Skenario utilization 84% — tertinggi 6 bulan.&rdquo;</p>
        <p><strong>Baris 3 — keputusan yang diminta:</strong> &ldquo;Minta persetujuan tambah limit skenario ke Rp300 M <em>atau</em> potong posisi carry 30%. Rekomendasi saya: potong — biaya carry tidak sebanding dengan risiko skenario.&rdquo;</p>
        <p><strong>Baris 4 — keterbatasan:</strong> &ldquo;Skenario mengasumsikan likuiditas normal; gap risk (CHF 2015) tidak tertangkap.&rdquo;</p>
        <p><strong>Mengapa ini dibaca:</strong> 4 baris = <strong>status → perubahan → keputusan → kejujuran</strong>. Direksi tidak butuh 40 halaman — ia butuh <em>jawaban atas</em>: &ldquo;aman? apa yang berubah? apa maumu? apa yang tidak kamu tahu?&rdquo; Laporan yang tidak meminta keputusan = <strong>arsip</strong>; laporan yang meminta = <strong>instrumen</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Trader melaporkan posisi &ldquo;netral&rdquo; (long Rp2 T + short Rp2 T). VaR net = Rp5 M (kecil). Identifikasi 2 celah kontrol dan limit apa yang menutupnya. (klik untuk pembahasan)</summary>
        <p><strong>Celah 1 — hedge palsu (Kerviel):</strong> short Rp2 T mungkin fiktif / tidak terkonfirmasi ke counterparty. <strong>Limit penutup:</strong> verifikasi independen posisi ke sumber eksternal (konfirmasi counterparty, bukan cuma sistem internal).</p>
        <p><strong>Celah 2 — gross raksasa:</strong> gross Rp4 T dengan VaR net Rp5 M = leverage tersembunyi; jika &ldquo;hedge&rdquo; gagal, eksposur sebenarnya Rp4 T. <strong>Limit penutup:</strong> <strong>limit gross/notional</strong> (misal ≤ Rp1 T) + limit per <em>leg</em>, bukan cuma net. Prinsip: <strong>net bisa dipalsukan, gross butuh uang beneran</strong>.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Sistem memunculkan 15 alert limit dalam sebulan, semuanya &ldquo;dijelaskan&rdquo; oleh trader dan ditutup tanpa tindakan. Apa masalahnya dan apa perbaikan sistemnya? (klik untuk pembahasan)</summary>
        <p><strong>Masalah:</strong> <strong>alarm fatigue + eskalasi mati</strong> — persis pola pra-Kerviel. Alert yang selalu &ldquo;dijelaskan&rdquo; = kontrol yang tidak mengontrol.</p>
        <p><strong>Perbaikan:</strong> (1) <strong>threshold dinamis</strong> — alert berulang dari trader yang sama naik level otomatis (ke atasan + risk); (2) <strong>sampling independen</strong> — sebagian alert diverifikasi fungsi risiko tanpa pemberitahuan; (3) <strong>metrik &ldquo;alert-to-action ratio&rdquo;</strong> dilaporkan ke komite — jika 15/15 ditutup tanpa tindakan, itu <em>temuan audit</em>, bukan keberhasilan.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Jelaskan mengapa IPV harus independen dari front office, dengan contoh angka. (klik untuk pembahasan)</summary>
        <p><strong>Insentif:</strong> bonus trader berbasis P&amp;L → insentif mark optimis. Contoh: obligasi illiquid Rp5 T, mark &ldquo;optimis&rdquo; 2% = <strong>Rp100 M P&amp;L fiktif</strong> = bonus fiktif + VaR/limit yang salah dasar.</p>
        <p><strong>Independensi:</strong> IPV membandingkan dengan broker quote/konsensus; selisih &gt; threshold → <strong>valuation adjustment</strong> + investigasi. Tanpa independensi, &ldquo;verifikasi&rdquo; = meminta maling menilai barang curiannya. Hierarki analis: <strong>data benar &gt; model canggih</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Laporan yang Tidak Dibaca</h2>
      <div className="callout">
        <p>Bank XYZ punya laporan risiko harian <strong>180 halaman</strong> — lengkap: VaR, Greeks, stress, konsentrasi, IPV. Setiap pagi dikirim ke 40 orang. Lalu:</p>
        <ul>
          <li>Utilisasi limit Desk Kredit mencapai <strong>97%</strong> selama 3 minggu — <strong>tidak ada yang menelepon</strong> (angka itu ada di halaman 94)</li>
          <li>Unexplained P&amp;L <strong>Rp30 M</strong> muncul 5 hari berurutan — <strong>tidak diinvestigasi</strong> (halaman 112)</li>
          <li>IPV variance obligasi illiquid <strong>Rp80 M</strong> — <strong>tidak di-adjust</strong> (halaman 157)</li>
          <li>Sebulan kemudian: kerugian <strong>Rp350 M</strong> dari posisi yang &ldquo;sudah terlihat&rdquo; di laporan</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa yang gagal — data, model, atau manusia? (b) Rancang ulang laporan ini. (c) Pelajaran tentang &ldquo;kelengkapan&rdquo;?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Manusia/proses — bukan data/model.</strong> Semua sinyal <em>ada</em> di laporan! Yang gagal: <strong>hirarki informasi</strong> (sinyal kritis terkubur di halaman 94+), <strong>akuntabilitas</strong> (40 penerima = tidak ada yang merasa bertanggung jawab), dan <strong>eskalasi</strong> (tidak ada tindakan otomatis).</p>
          <p>(b) <strong>Rancangan ulang:</strong> (1) <em>Halaman 1</em>: 5 angka + 3 warna (hijau/kuning/merah) + 1 paragraf aksi. (2) <em>Aturan:</em> amber/red <strong>otomatis</strong> memicu telepon &amp; tenggat — tidak menunggu dibaca. (3) <em>Pemilik:</em> tiap metrik ada <strong>satu nama</strong> penanggung jawab. (4) <em>180 halaman → lampiran</em> on-demand, bukan kiriman harian.</p>
          <p>(c) <strong>Kelengkapan ≠ kegunaan.</strong> Laporan yang &ldquo;lengkap&rdquo; tapi tidak dibaca = <strong>teater kepatuhan</strong>. Nilai laporan = <strong>keputusan yang diubahnya</strong>, bukan halaman yang dihasilkannya. Ukur: &ldquo;berapa aksi yang dipicu laporan bulan ini?&rdquo; — jika nol, laporanmu gagal.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Total limit desk (530) > appetite board (500). Ini?"
        options={[
          "Kesalahan — harus sama",
          "Disengaja: mengandalkan diversifikasi antar desk — TAPI butuh buffer karena diversifikasi menguap saat krisis",
          "Tidak masalah sama sekali",
          "Harus dikurangi segera",
        ]}
        correct={1}
        explanation="Benar. Over-alkasi = praktik normal DENGAN syarat: ada buffer + limit agregat terpisah. Tanpa itu, krisis (korelasi→1) menembus appetite tanpa satu pun desk breach."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Desk tidak pernah menyentuh limitnya selama 3 tahun. Kesimpulan?"
        options={[
          "Disiplin yang bagus",
          "Waspada: limit yang tak pernah tersentuh mungkin tidak mengikat (terlalu longgar) atau modelnya salah — limit sehat sesekali tersentuh",
          "Naikkan limitnya",
          "Tidak perlu dipantau",
        ]}
        correct={1}
        explanation="Benar. Limit = pagar. Pagar yang tak pernah disentuh mungkin terlalu jauh (tidak melindungi apa-apa) atau lahannya yang salah ukur (model salah, ingat cerita pembuka)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Utilisasi limit 110% (breach). Tindakan TEPAT?"
        options={[
          "Tunggu besok, mungkin turun sendiri",
          "Hentikan penambahan risiko HARI INI + wajib turunkan eksposur dalam tenggat + lapor komite — eskalasi otomatis, bukan diskusi",
          "Naikkan limitnya agar tidak breach",
          "Sembunyikan dari laporan",
        ]}
        correct={1}
        explanation="Benar. Breach = rem darurat, bukan saran. 'Menaikkan limit agar tidak breach' adalah kecurangan paling klasik — limit mengikuti risiko, bukan sebaliknya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa perlu limit sensitivitas (DV01/CS01) SELAIN limit VaR?"
        options={[
          "Agar terlihat canggih",
          "VaR agregat bisa menyembunyikan konsentrasi ke satu faktor — limit sensitivitas menangkap 'telur dalam satu keranjang' yang lolos dari angka agregat",
          "VaR tidak bisa dihitung",
          "Regulator melarang VaR saja",
        ]}
        correct={1}
        explanation="Benar. Inilah pelajaran cerita pembuka: VaR 'aman' sementara eksposur ke satu faktor (spread perumahan) menumpuk tak terlihat. Lapis ganda = jaring pengaman ganda."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. IPV menemukan mark trader 2% lebih optimis dari sumber independen untuk portofolio Rp5 T. Artinya?"
        options={[
          "Tidak material",
          "Potensi P&L fiktif Rp100 M — butuh adjustment + investigasi; semua metrik risiko di atas harga ini ikut salah",
          "Trader pasti curang",
          "Abaikan — 2% kecil",
        ]}
        correct={1}
        explanation="Benar. 2% × Rp5T = Rp100M — sangat material. Dan karena VaR/limit dihitung dari harga ini, fondasi seluruh kerangka risiko retak. IPV = fondasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Laporan harian 180 halaman dikirim ke 40 orang, tapi sinyal kritis terlewat. Akar masalah?"
        options={[
          "Data kurang lengkap",
          "Hirarki & akuntabilitas: sinyal terkubur tanpa halaman-1 keputusan; 40 penerima = tidak ada pemilik; tanpa eskalasi otomatis",
          "Model terlalu sederhana",
          "Perlu lebih banyak halaman",
        ]}
        correct={1}
        explanation="Benar. Ini kegagalan DESAIN INFORMASI, bukan data. Solusi: 1 halaman keputusan + eskalasi otomatis + satu pemilik per metrik. Nilai laporan = keputusan yang diubahnya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Risk appetite:</strong> selera dewan (angka + skenario + proses pelampauan); cascade ke divisi → desk.</li>
          <li><strong>Over-alokasi</strong> desk &gt; appetite = normal (diversifikasi) — tapi butuh <strong>buffer</strong> untuk krisis.</li>
          <li><strong>Limit berlapis:</strong> VaR/ES + sensitivitas + stop-loss (+ konsentrasi, likuiditas). Minimal 3 lapis.</li>
          <li><strong>Eskalasi:</strong> amber (80%) = telepon; red (100%) = stop tambah risiko. Tanpa gigi = dekorasi.</li>
          <li><strong>Laporan harian:</strong> 1 halaman keputusan + lampiran; nilai = keputusan yang diubah.</li>
          <li><strong>IPV:</strong> verifikasi harga independen — fondasi semua metrik; variance besar = bendera merah.</li>
          <li>Limit yang tak pernah tersentuh = waspada; data benar &gt; model canggih.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr16-regulasi-frtb" className="btn btn-secondary btn-sm">← MR16</Link>
        <Link href="/learn/mr18-validasi-model" className="btn btn-primary btn-sm">Next: MR18 →</Link>
      </div>
    </div>
  );
}
