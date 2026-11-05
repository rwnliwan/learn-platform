"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E10Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const callPayoffData = [
    {
      x: [80, 90, 100, 110, 120, 130],
      y: [-5, -5, -5, 5, 15, 25],
      mode: "lines+markers",
      name: "Long call (strike 100, premi 5)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const putPayoffData = [
    {
      x: [70, 80, 90, 100, 110, 120],
      y: [25, 15, 5, -5, -5, -5],
      mode: "lines+markers",
      name: "Long put (strike 100, premi 5)",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const forwardData = [
    {
      x: [80, 90, 100, 110, 120, 130],
      y: [-20, -10, 0, 10, 20, 30],
      mode: "lines+markers",
      name: "Long forward (harga deal 100)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [80, 90, 100, 110, 120, 130],
      y: [20, 10, 0, -10, -20, -30],
      mode: "lines+markers",
      name: "Short forward",
      line: { color: "#ef4444", width: 3, dash: "dash" },
    },
  ];

  const lab1Code = `# Lab 1 — Payoff call: batasi rugi, lepas untung
# Beli call: strike 100, premi 5. Harga saham saat jatuh tempo = S
strike, premi = 100, 5

def payoff_call(S):
    return max(S - strike, 0) - premi

print(f"{'Harga S':>8s} {'Payoff':>8s}")
for S in [80, 90, 100, 105, 110, 130]:
    p = payoff_call(S)
    print(f"{S:8d} {p:+8.0f}")
print()
print("Rugi MAKSIMAL = premi (5), untung TIDAK TERBATAS.")
print("Titik impas (breakeven) =", strike + premi)
print()
print("Coba: premi = 15 (opsi mahal). Berapa breakeven sekarang?")`;

  const lab2Code = `# Lab 2 — Put-call parity: mesin arbitrase
# C + PV(K) = P + S   ->   jika tidak sama, ada arbitrase!
S, K, r, T = 100, 100, 0.06, 1.0
C, P = 8, 10  # harga pasar call & put

import math
pv_k = K / math.exp(r * T)
kiri = C + pv_k   # call + PV(strike)
kanan = P + S     # put + saham

print(f"C + PV(K) = {kiri:.2f}")
print(f"P + S     = {kanan:.2f}")
print(f"Selisih   = {kiri-kanan:+.2f}")
if abs(kiri - kanan) > 0.5:
    print("-> PARITAS RUSAK! Arbitrase: beli sisi murah, jual sisi mahal.")
else:
    print("-> Paritas terjaga (wajar).")
print()
print("Coba: C = 12 (call kemahalan). Strategi arbitrase apa yang jalan?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E10 — Financial Markets</span>
        <h1 className="display-title">Derivatif: Kontrak<br />tentang Masa Depan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Petani dan Harga Beras</a></li>
          <li><a href="#forward">Forward — Janji Jual-Beli</a></li>
          <li><a href="#futures">Futures — Forward yang Terstandarisasi</a></li>
          <li><a href="#opsi">Opsi — Hak, Bukan Kewajiban</a></li>
          <li><a href="#payoff">Payoff — Membaca Diagram Untung-Rugi</a></li>
          <li><a href="#paritas">Put-Call Parity — Hukum Kekekalan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Payoff Call</a></li>
          <li><a href="#lab2">🔬 Lab 2: Put-Call Parity</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Lindung Nilai atau Spekulasi?</a></li>
          <li><a href="#case">📋 Mini-Case: Eksportir vs Spekulan</a></li>
          <li><a href="#worked1">🔬 Worked Example: Payoff Forward Pak Tani</a></li>
          <li><a href="#worked2">🔬 Worked Example: Call vs Put — Breakeven</a></li>
          <li><a href="#konteks">🌍 Konteks: AIG 2008 &amp; Nikel 2022 — Derivatif Menggigit</a></li>
          <li><a href="#margin">🔧 Pendalaman: Margin &amp; Leverage Futures</a></li>
          <li><a href="#swap">🔧 Pendalaman: Swap — Pertukaran Arus Kas</a></li>
          <li><a href="#worked4">🔬 Worked Example: Interest Rate Swap — Siapa Bayar ke Siapa?</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan forward, futures, dan opsi (call/put) — hak vs kewajiban, OTC vs bursa.</li>
          <li>Menggambar dan membaca diagram payoff untuk long/short forward, call, dan put.</li>
          <li>Menghitung breakeven dan menjelaskan intrinsic value vs time value opsi.</li>
          <li>Menggunakan put-call parity untuk mendeteksi mispricing/arbitrase.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Petani dan Harga Beras</h2>
      <div className="story">
        <p>Pak Tani akan panen 10 ton beras 3 bulan lagi. Harga hari ini Rp12.000/kg — tapi 3 bulan lagi bisa Rp10.000 (banjir panen) atau Rp15.000 (gagal panen massal). Ia tidak mau berjudi dengan penghidupannya. Seorang pedagang menawar: <em>&ldquo;Saya beli 10 ton hasil panenmu 3 bulan lagi, harga pasti Rp12.000/kg — deal?&rdquo;</em></p>
        <p>Pak Tani <strong>setuju</strong>. Ia melepas peluang harga naik — demi <strong>kepastian</strong>. Inilah kontrak <strong>forward</strong> dalam bentuk paling purba: <em>menukar ketidakpastian dengan kepastian</em>. Seluruh dunia derivatif modern — triliunan dolar — dibangun di atas logika sesederhana ini.</p>
        <p><strong>Twist-nya:</strong> perhatikan yang <em>dilepas</em> Pak Tani: ia melepas <strong>peluang</strong> harga naik — barang yang belum ada, dari panen yang belum terjadi. Derivatif memperdagangkan <strong>masa depan yang belum ada</strong> dengan harga hari ini. Dan karena yang diperdagangkan adalah <em>janji tentang masa depan</em>, derivatif bisa dipakai untuk dua hal yang berlawanan: <strong>menghapus</strong> risiko (Pak Tani) atau <strong>menciptakannya dari nol</strong> (spekulan). Instrumennya netral — niatnya yang menentukan apakah ini asuransi atau kasino.</p>
      </div>

      <h2 id="forward">Forward — Janji Jual-Beli</h2>
      <p><strong>Definisi.</strong> <em>Forward</em> = kontrak <strong>OTC</strong> (antar dua pihak) untuk membeli/menjual aset di <strong>tanggal masa depan</strong> dengan <strong>harga yang disepakati hari ini</strong> (<em>delivery price</em>). <strong>Kedua pihak WAJIB mengeksekusi</strong> — tidak bisa mundur.</p>
      <p><strong>Payoff long forward</strong> (pihak yang setuju <em>membeli</em>):</p>
      <Tex math={String.raw`\text{Payoff} = S_T - K`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`S_T`} /> = harga pasar saat jatuh tempo; <Tex math={String.raw`K`} /> = harga deal. Jika pasar di atas deal → untung; di bawah → rugi. <strong>Simetris, tak terbatas dua arah.</strong></p>
      <p><strong>Kepribadian forward:</strong> dia <em>jabat tangan yang mengikat</em> — sederhana, fleksibel (nominal &amp; tanggal suka-suka), tapi mengandung <strong>risiko counterparty</strong>: kalau lawanmu kabur/bangkrut sebelum tanggalnya, kontrakmu jadi kertas.</p>
      <p><strong>Kapan dipakai:</strong> lindung nilai yang <em>disesuaikan kebutuhan</em> (eksportir, importir, korporasi) — di pasar OTC via bank.</p>

      <PlotlyChart
        data={forwardData}
        title="Payoff Forward: Simetris, Tak Terbatas Dua Arah (K=100)"
        layout={{ xaxis: { title: "Harga pasar saat jatuh tempo" }, yaxis: { title: "Payoff" }, showlegend: true, shapes: [{ type: "line", x0: 80, x1: 130, y0: 0, y1: 0, line: { color: "#94a3b8", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = harga pasar nanti, sumbu Y = untung/rugi. Garis biru = pihak pembeli (long), merah putus-putus = penjual (short).</p>
        <p><strong>Interpretasi:</strong> garis <strong>lurus diagonal</strong> — untung dan rugi simetris, tak terbatas. Inilah &ldquo;harga&rdquo; kepastian Pak Tani: ia <em>wajib</em> jual di 100 walau pasar 130. Forward = <strong>asuransi yang menghapus upside juga</strong>.</p>
      </div>

      <h2 id="futures">Futures — Forward yang Terstandarisasi</h2>
      <p><strong>Definisi.</strong> <em>Futures</em> = forward yang <strong>distandarisasi</strong> (ukuran kontrak, tanggal baku) dan diperdagangkan di <strong>bursa</strong> dengan <strong>kliring terpusat</strong> + <strong>margin harian</strong> (<em>mark-to-market</em>).</p>
      <p><strong>Tiga beda kunci vs forward:</strong></p>
      <ul>
        <li><strong>Likuiditas:</strong> bisa ditutup kapan saja di bursa (jual kontraknya kembali) — forward OTC sulit &ldquo;keluar&rdquo;.</li>
        <li><strong>Risiko counterparty:</strong> nyaris nol — kliring menjadi lawan tiap transaksi.</li>
        <li><strong>Margin harian:</strong> untung/rugi <strong>dicairkan tiap hari</strong> (<em>variation margin</em>), bukan menunggu jatuh tempo. Akun margin tidak boleh di bawah <em>maintenance margin</em> — kalau tidak, <em>margin call</em>!</li>
      </ul>
      <p><strong>Kepribadian futures:</strong> forward yang <em>naik kelas</em> — seragam, transparan, disiplin harian. Harganya: fleksibilitas (tanggal &amp; nominal baku, tidak bisa custom).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Futures = judi harga masa depan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> futures adalah <strong>alat</strong> — netral. Petani menggunakannya untuk <em>menghilangkan</em> risiko (hedging); spekulan untuk <em>mengambil</em> risiko (leverage). Menyalahkan futures atas kerugian spekulan = menyalahkan pisau atas luka iris. Yang menentukan = <strong>tujuan &amp; ukuran posisimu</strong>.</p>
      </div>

      <h2 id="opsi">Opsi — Hak, Bukan Kewajiban</h2>
      <p><strong>Definisi.</strong> <em>Opsi</em> = <strong>hak</strong> (bukan kewajiban!) untuk membeli (<strong>call</strong>) atau menjual (<strong>put</strong>) aset di harga <strong>strike</strong> (<Tex math={String.raw`K`} />) sebelum/pada tanggal <strong>kedaluwarsa</strong>. Hak ini dibeli dengan <strong>premi</strong> — dan premi bisa <strong>hangus total</strong>.</p>
      <p><strong>Anatomi harga opsi:</strong></p>
      <Tex math={String.raw`\text{Premi} = \text{Intrinsic value} + \text{Time value}`} block />
      <ul>
        <li><Tex math={String.raw`\text{Intrinsic} = \max(S-K, 0)`} /> (call): nilai jika dieksekusi <em>sekarang</em>.</li>
        <li><strong>Time value</strong>: nilai <em>peluang</em> harga bergerak menguntungkan sebelum kedaluwarsa — <strong>menyusut tiap hari</strong> (<em>time decay</em>, theta di E11).</li>
      </ul>
      <p><strong>Kepribadian opsi:</strong> dia <em>tiket lotre yang cerdas</em> — rugi maksimal = harga tiket (premi), untung bisa raksasa. Tapi tiketnya <strong>kedaluwarsa</strong>: benar arah tapi salah <em>waktu</em> = tetap hangus. Inilah yang membunuh waran Dimas di E2.</p>
      <p><strong>Kapan dipakai:</strong> proteksi asimetris (put sebagai &ldquo;asuransi portofolio&rdquo;), spekulasi terukur (rugi dibatasi premi).</p>

      <h2 id="payoff">Payoff — Membaca Diagram Untung-Rugi</h2>
      <p><strong>Long call</strong> (beli hak beli, strike 100, premi 5):</p>
      <Tex math={String.raw`\text{Payoff} = \max(S_T - K, 0) - \text{premi}`} block />
      <p><strong>Long put</strong> (beli hak jual):</p>
      <Tex math={String.raw`\text{Payoff} = \max(K - S_T, 0) - \text{premi}`} block />
      <p><strong>Breakeven call</strong> = <Tex math={String.raw`K + \text{premi}`} />; <strong>breakeven put</strong> = <Tex math={String.raw`K - \text{premi}`} />.</p>

      <PlotlyChart
        data={callPayoffData}
        title="Long Call: Rugi Terbatas, Untung Tak Terbatas (K=100, premi=5)"
        layout={{ xaxis: { title: "Harga saham saat jatuh tempo" }, yaxis: { title: "Payoff" }, showlegend: false, shapes: [{ type: "line", x0: 80, x1: 130, y0: 0, y1: 0, line: { color: "#94a3b8", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = harga saham nanti, sumbu Y = untung/rugi bersih (sudah dikurangi premi).</p>
        <p><strong>Interpretasi:</strong> bentuk <strong>hoki</strong> (hockey stick): datar di −5 (rugi maksimal = premi, tak peduli seberapa jatuh saham) lalu menanjak tanpa batas. Titik impas di 105. <strong>Bandingkan dengan forward</strong> (garis lurus): opsi <em>memotong</em> sisi rugi dengan harga premi — itulah &ldquo;asuransi&rdquo;-nya.</p>
      </div>

      <PlotlyChart
        data={putPayoffData}
        title="Long Put: Asuransi Portofolio (K=100, premi=5)"
        layout={{ xaxis: { title: "Harga saham saat jatuh tempo" }, yaxis: { title: "Payoff" }, showlegend: false, shapes: [{ type: "line", x0: 70, x1: 120, y0: 0, y1: 0, line: { color: "#94a3b8", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti call, tapi cermin: untung saat harga <em>jatuh</em>.</p>
        <p><strong>Interpretasi:</strong> put = <strong>asuransi</strong>: jika pegang saham Rp100 jt + beli put strike 100 premi 5%, portofoliomu <strong>tidak bisa jatuh di bawah Rp95 jt</strong> — dengan biaya premi. Manajer dana memakai ini menjelang pemilu/krisis: tidur nyenyak dengan harga premi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan 4 diagram: <strong>long forward /</strong> (diagonal naik), <strong>short forward \</strong> (diagonal turun), <strong>long call ⌐</strong> (hoki ke kanan), <strong>long put ¬</strong> (hoki ke kiri). Short opsi = cerminnya (terima premi, tanggung risiko tak terbatas — <em>menjual asuransi</em>). Kalau bisa menggambar keempatnya dari ingatan, kamu sudah menguasai 80% intuisi derivatif.</p>
      </div>

      <h2 id="paritas">Put-Call Parity — Hukum Kekekalan</h2>
      <p><strong>Definisi.</strong> Untuk opsi Eropa (<em>exercise</em> hanya saat kedaluwarsa) dengan strike &amp; tenor sama:</p>
      <Tex math={String.raw`C + PV(K) = P + S`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`C`} /> = harga call; <Tex math={String.raw`P`} /> = harga put; <Tex math={String.raw`PV(K)`} /> = present value strike (didiskonto risk-free); <Tex math={String.raw`S`} /> = harga saham kini.</p>
      <p><strong>Maknanya:</strong> &ldquo;call + kas sebesar PV(strike)&rdquo; <strong>identik</strong> dengan &ldquo;put + saham&rdquo; — keduanya memberi payoff <Tex math={String.raw`\max(S_T, K)`} />. Jika pasar melanggar paritas → <strong>arbitrase</strong>: beli sisi murah, jual sisi mahal, kantongi selisih bebas risiko.</p>
      <details className="worked">
        <summary>📐 Contoh arbitrase (klik untuk buka)</summary>
        <p>S=100, K=100, PV(K)=94, C=12 (kemahalan), P=4.</p>
        <p>Kiri (C+PV(K)) = 106; kanan (P+S) = 104. <strong>Selisih 2.</strong><br />
        Strategi: <strong>jual</strong> sisi mahal (jual call @12, pinjam PV(K)=94 → terima 106) dan <strong>beli</strong> sisi murah (beli put @4, beli saham @100 → bayar 104). Kantongi <strong>Rp2 bebas risiko</strong> hari ini; semua arus kas masa depan saling meniadakan. Inilah mengapa pelanggaran paritas <strong>langsung diserbu</strong> algo trading — kesempatan hidup hitungan detik.</p>
      </details>
      <p><strong>Kepribadian paritas:</strong> dia <em>hukum kekekalan energi</em>-nya derivatif — bukan teori indah, melainkan <strong>mesin arbitrase</strong> yang memaksa harga tetap konsisten. Trader opsi memakai ini tiap hari untuk sintesis posisi (&ldquo;tidak ada put yang likuid? buat dari call + saham&rdquo;).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi mahal = pasti bagus dibeli.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> premi mahal = pasar mengharapkan <strong>pergerakan besar</strong> (<em>implied volatility</em> tinggi, E11). Membeli opsi mahal = bertaruh pergerakannya <em>lebih besar lagi</em> dari ekspektasi pasar. Banyak pembeli opsi rugi bukan karena salah arah, tapi karena <strong>pergerakannya &ldquo;kurang besar&rdquo;</strong> dibanding yang sudah dibayar di premi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Payoff Call</h2>
      <p>Rasakan bentuk hoki: rugi dibatasi premi, untung tak terbatas. Ubah premi dan lihat breakeven bergeser.</p>
      <PyodideLab
        title="Lab 1 — Tabel Payoff Long Call"
        hint="Coba: premi = 15, lalu premi = 2. Premi mahal = breakeven jauh = butuh 'keajaiban' lebih besar. Inilah mengapa timing & valuasi premi (E11) krusial."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Put-Call Parity</h2>
      <p>Uji paritas dengan harga pasar. Jika rusak — rancang arbitrasenya.</p>
      <PyodideLab
        title="Lab 2 — Detektor Arbitrase Put-Call Parity"
        hint="Coba: C = 12, P = 4 (call kemahalan). Lalu C = 4, P = 12 (put kemahalan — sisi mana yang dijual?). Pikirkan simetrinya."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> paritas mengajarkan <strong>cara berpikir sintesis</strong>: setiap posisi bisa dibangun dari kombinasi lain. Butuh proteksi downside tapi put tidak likuid? Beli call + taruh kas = payoff sama. Trader profesional jarang &ldquo;membeli produk&rdquo; — mereka <strong>merakit payoff</strong> dari komponen termurah.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Lindung Nilai atau Spekulasi?</h2>

      <div className="decision-card">
        <h3>1. Punya eksposur nyata, mau kepastian penuh → <strong>Forward</strong></h3>
        <p><strong>Kondisi:</strong> eksportir/importir dengan jadwal &amp; nominal jelas.</p>
        <p><strong>Kenapa:</strong> custom, tanpa premi. Harga: lepas upside + risiko counterparty bank.</p>
        <p><strong>Contoh nyata:</strong> eksportir kunci kurs USD/IDR untuk penerimaan 6 bulan lagi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh lindung nilai yang likuid &amp; bisa ditutup kapan saja → <strong>Futures</strong></h3>
        <p><strong>Kondisi:</strong> eksposur standar, mungkin perlu keluar cepat.</p>
        <p><strong>Kenapa:</strong> bursa + kliring + margin harian. Harga: margin call harian bisa menekan kas.</p>
        <p><strong>Contoh nyata:</strong> fund manager lindungi portofolio saham dengan futures indeks.</p>
      </div>

      <div className="decision-card">
        <h3>3. Mau proteksi tapi tetap ikut upside → <strong>Long put (asuransi)</strong></h3>
        <p><strong>Kondisi:</strong> takut jatuh, tapi tidak mau lepas potensi naik.</p>
        <p><strong>Kenapa:</strong> rugi dibatasi premi; upside terbuka. Harga: premi hangus jika pasar tenang (asuransi memang &ldquo;dibuang&rdquo; saat tak ada klaim).</p>
        <p><strong>Contoh nyata:</strong> beli put indeks menjelang pemilu sebagai &ldquo;biaya tidur nyenyak&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Spekulasi arah dengan modal kecil → <strong>Opsi (pahami premi dulu!)</strong></h3>
        <p><strong>Kondisi:</strong> view kuat, siap rugi 100% premi.</p>
        <p><strong>Kenapa:</strong> leverage alami. <strong>Peringatan:</strong> butuh benar arah <em>dan</em> besar gerakan <em>dan</em> timing — tiga syarat sekaligus. Mayoritas pembeli opsi ritel rugi.</p>
        <p><strong>Contoh nyata:</strong> (lebih baik) paper-trade dulu 3 bulan sebelum uang sungguhan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Ada eksposur → hedging.</strong> Tanpa eksposur → spekulasi. Jujur pada dirimu yang mana.</li>
          <li><strong>Forward/futures = wajib eksekusi</strong> (simetris). <strong>Opsi = hak</strong> (asimetris, bayar premi).</li>
          <li><strong>C + PV(K) = P + S.</strong> Paritas rusak = arbitrase (tapi cepat hilang).</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Eksportir vs Spekulan</h2>
      <div className="callout">
        <p>PT Ekspor Jaya akan terima USD 1 juta dalam 6 bulan. Kurs kini Rp16.000/USD. <strong>Andi</strong> (direktur keuangan) mengunci forward di Rp16.200. <strong>Bimo</strong> (kawannya, tanpa bisnis dolar) membeli call USD/IDR strike Rp16.200 premi Rp200 dengan modal Rp200 juta (leverage implisit!). 6 bulan kemudian kurs Rp17.500.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung hasil masing-masing dalam rupiah. (b) Siapa hedging, siapa spekulasi — dan apa beda fundamentalnya? (c) Jika kurs malah jatuh ke Rp15.000, bagaimana nasib keduanya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Andi:</strong> terima 1 jt × 16.200 = <strong>Rp16,2 M</strong> (pasti, apapun kurs pasar). <strong>Bimo:</strong> payoff call = (17.500−16.200) × 1 jt = Rp1,3 M − premi Rp200 jt = <strong>+Rp1,1 M</strong> (untung 550% dari modal!).</p>
          <p>(b) <strong>Andi = hedging</strong> (punya eksposur USD riil; forward <em>menghilangkan</em> risiko). <strong>Bimo = spekulasi</strong> (tanpa eksposur; opsi <em>menciptakan</em> eksposur ber-leverage). Instrumen boleh sama-sama derivatif — <strong>tujuannya</strong> yang membedakan.</p>
          <p>(c) Kurs 15.000: <strong>Andi</strong> tetap terima Rp16,2 M (ia melepas upside Rp1,3 M — harga kepastian). <strong>Bimo</strong>: call hangus → <strong>rugi 100%</strong> (Rp200 jt melayang). Inilah asimetri: Bimo butuh benar arah; Andi tidak peduli arah.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Payoff Forward — Siapa Untung Saat Panen Tiba?</h2>
      <p>Forward: pedagang setuju membeli 10 ton beras 3 bulan lagi @ <strong>Rp12.000/kg</strong> (total kontrak Rp120 juta). Tiga skenario harga spot saat panen:</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Skenario A — banjir panen, spot Rp10.000/kg:</strong> Pak Tani menjual @ 12.000 (kontrak!) &rarr; <strong>untung Rp2.000/kg × 10 ton = Rp20 juta</strong> vs jual spot. Pedagang rugi Rp20 juta (membayar 12.000 untuk barang 10.000).</p>
        <p><strong>Skenario B — gagal panen, spot Rp15.000/kg:</strong> Pak Tani <em>tetap</em> menjual @ 12.000 &rarr; <strong>kehilangan peluang Rp30 juta</strong>. Pedagang untung Rp30 juta.</p>
        <p><strong>Skenario C — spot tepat Rp12.000:</strong> tidak ada yang untung/rugi — tapi Pak Tani tidur nyenyak 3 bulan. <strong>Ketenangan = produk yang ia beli</strong>, dibayar dengan peluang yang dilepas.</p>
        <p><strong>Intuisi:</strong> payoff forward = <strong>garis lurus simetris</strong> (E2!): untung satu pihak = rugi pihak lain, <em>zero-sum</em>. Tidak ada &ldquo;pemenang bersama&rdquo; — tapi ada <strong>pertukaran risiko yang saling menguntungkan</strong>: pedagang (yang bisa menyimpan/menjual) menanggung risiko yang tidak bisa ditanggung petani. Derivatif = <strong>pasar untuk risiko itu sendiri</strong>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Call vs Put — Harga Breakeven &amp; Asimetri</h2>
      <p>Saham MAJU Rp1.500. Opsi 3 bulan, strike Rp1.500: <strong>call Rp120</strong>, <strong>put Rp110</strong>. Kamu beli 1 kontrak call (100 lembar). Kapan untung?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Breakeven call:</strong> strike + premi = 1.500 + 120 = <strong>Rp1.620</strong>. Di bawah itu: rugi (sebagian/seluruh premi). Di atas itu: untung tak terbatas.</p>
        <p><strong>Langkah 2 — Tiga titik:</strong> saham 1.550 &rarr; payoff max(1.550−1.500,0)=50 − 120 = <strong>rugi 70/kontrak-lembar</strong> (saham naik tapi kamu tetap rugi!); 1.700 &rarr; 200−120 = <strong>untung 80</strong>; 1.400 &rarr; 0−120 = <strong>rugi 120</strong> (maksimum).</p>
        <p><strong>Langkah 3 — Bandingkan dengan put:</strong> beli put @110, breakeven = 1.500 − 110 = <strong>Rp1.390</strong>. Put = <strong>asuransi portofolio</strong>: jika pegang saham 1.500 + beli put, kerugian mentok di ~1.390 + premi — seperti <em>stop-loss</em> yang dijamin kontrak, bukan harapan.</p>
        <p><strong>Intuisi:</strong> pembeli opsi membayar <strong>premi untuk asimetri</strong> (rugi terbatas, untung terbuka). Matematikanya kejam: karena premi hangus jika salah, pembeli opsi harus <em>benar lebih sering / lebih besar</em> dari kelihatannya. Inilah kenapa <strong>penjual opsi</strong> (yang memungut premi) menang dalam jangka panjang <em>jika</em> terdiversifikasi — dengan risiko sesekali rugi besar (ekor kiri, E7!).</p>
      </details>

      <h2 id="konteks">🌍 Konteks: AIG 2008 &amp; Nikel 2022 — Saat Derivatif Menggigit Balik</h2>
      <ul>
        <li><strong>AIG, 2008:</strong> raksasa asuransi AS menjual <strong>CDS</strong> (E5!) senilai ratusan miliar dolar atas obligasi subprime — memungut premi kecil, menanggung risiko gagal bayar massal. Saat pasar runtuh, kewajiban CDS-nya meledak; AIG nyaris bangkrut dan diselamatkan pemerintah AS (<strong>US$182 miliar</strong>). Pelajaran: <strong>menjual asuransi atas risiko yang berkorelasi</strong> (semua default bersamaan) = bunuh diri yang dibayar premi.</li>
        <li><strong>Nikel LME, Maret 2022:</strong> harga nikel melonjak <strong>250% dalam 2 hari</strong> (dari ~US$29 ribu ke &gt;US$100 ribu/ton) karena <em>short squeeze</em>: Tsingshan (produsen raksasa) memegang short futures raksasa, dipaksa membeli kembali (<em>margin call</em>) di harga gila. LME sampai <strong>membatalkan transaksi</strong> — kontroversi raksasa. Pelajaran: <strong>short derivatif = rugi tak terbatas</strong>, dan likuiditas bisa hilang tepat saat kamu paling butuh keluar.</li>
      </ul>
      <p><strong>Benang merah:</strong> kedua bencana bukan karena &ldquo;derivatif itu jahat&rdquo; — melainkan karena <strong>leverage + korelasi + ilusi likuiditas</strong>. Derivatif = <em>pengungkit</em>: mengungkit lindung nilai Pak Tani, tapi juga mengungkit kesalahan AIG &amp; Tsingshan. Aturan mainnya (margin, kliring — lihat Pendalaman) ada justru untuk menjinakkan pengungkit ini.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>forward vs futures</strong>: forward = kontrak <em>privat</em> OTC (fleksibel, tapi ada risiko lawan wanprestasi); futures = kontrak <em>standar</em> di bursa dengan <strong>kliring terpusat + margin harian</strong> (likuid, tapi kaku). Petani &amp; pedagang beras memakai forward; spekulan &amp; hedger institusi memakai futures. Pilihannya = <em>trade-off</em> fleksibilitas vs keamanan — pola yang sama seperti bursa vs OTC di E1!</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kontrak berjangka/forex = investasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> futures/forex dengan leverage 1:100 = <strong>spekulasi jangka super-pendek</strong>, bukan investasi. &ldquo;Investasi&rdquo; = membeli <em>arus kas masa depan</em> (dividen, kupon, laba). Derivatif ber-leverage tidak punya arus kas — ia <em>taruhan arah</em> dengan jam yang terus berdetak (margin call!). Boleh dipakai untuk hedging (tujuan jelas, ukuran terukur) — tapi jangan sebut &ldquo;investasi&rdquo;.</p>
      </div>

      <h2 id="margin">🔧 Pendalaman: Margin — Kenapa Futures Bisa Melipatgandakan (dan Menghancurkan)</h2>
      <p>Futures nikel: kontrak 6 ton @ US$30.000/ton = nilai nosional <strong>US$180.000</strong>. Tapi untuk memegangnya kamu hanya setor <strong>margin awal ~US$15.000</strong> (ilustratif). Artinya:</p>
      <ul>
        <li><strong>Leverage implisit:</strong> 180.000 &divide; 15.000 = <strong>12×</strong>. Harga naik 5% &rarr; untung US$9.000 = <strong>+60%</strong> dari marginmu. Harga turun 5% &rarr; rugi 60%.</li>
        <li><strong>Margin harian (<em>mark-to-market</em>):</strong> tiap sore, untung/rugi <em>disetel tunai</em>. Rugi 2 hari beruntun = margin menipis &rarr; <strong>margin call</strong>: setor tambahan <em>atau</em> posisimu dilikuidasi paksa — persis yang menghantam Tsingshan.</li>
        <li><strong>Kenapa sistem ini ada:</strong> kliring terpusat + margin harian = <strong>risiko lawan transaksi nyaris nol</strong> (kamu bertransaksi dengan kliring, bukan dengan orangnya). Inilah keunggulan futures atas forward OTC — dengan harga: <strong>tidak ada &ldquo;tunggu sampai harga kembali&rdquo;</strong>; pasar menagihmu <em>setiap hari</em>.</li>
      </ul>
      <p><strong>Aturan bertahan:</strong> (1) jangan pernah leverage yang margin call-nya bisa melebihi seluruh modalmu; (2) ukuran posisi dari <em>berapa kamu rela rugi</em>, bukan dari <em>berapa kamu ingin untung</em>; (3) ingat: <strong>leverage = meminjam waktu</strong> — ia mempercepat hasil <em>dan</em> mempercepat kematian.</p>


      <h2 id="swap">🔧 Pendalaman: Swap — Derivatif Terbesar yang Tak Pernah Kamu Dengar</h2>
      <p>Pasar derivatif terbesar di dunia bukan opsi, bukan futures — melainkan <strong>interest rate swap (IRS)</strong>: nosional ratusan <em>triliun</em> dolar. Mekaniknya sederhana — <strong>dua pihak saling bertukar arus kas bunga</strong>:</p>
      <ul>
        <li><strong>Struktur tipikal:</strong> Pihak A membayar <strong>bunga tetap</strong> (misal 6%), menerima <strong>bunga mengambang</strong> (misal JIBOR/SOFR + spread). Pihak B sebaliknya. <strong>Pokok tidak dipertukarkan</strong> — hanya <em>selisih bunganya</em> (netting!).</li>
        <li><strong>Kenapa ada yang mau?</strong> Perusahaan X berutang <em>floating</em> (takut bunga naik) &rarr; swap menjadi <em>fixed</em> (kepastian — jiwanya Pak Tani!). Perusahaan Y berutang <em>fixed</em> tapi yakin bunga turun &rarr; swap menjadi <em>floating</em>. <strong>Keduanya mendapat yang diinginkan tanpa melunasi &amp; menerbitkan ulang utang</strong> (yang mahal &amp; lama).</li>
        <li><strong>Keunggulan komparatif:</strong> X bisa pinjam fixed murah tapi <em>ingin</em> floating; Y bisa pinjam floating murah tapi <em>ingin</em> fixed &rarr; pinjam di pasar masing-masing yang termurah, lalu <strong>swap</strong> — keduanya lebih hemat! (Teori yang sama dengan perdagangan internasional — Ricardo di pasar modal.)</li>
      </ul>
      <p><strong>Risiko yang sering dilupakan:</strong> swap = kontrak <strong>jangka panjang bilateral</strong> (5–10 tahun!) &rarr; <strong>risiko counterparty</strong> (E1!) — jika lawan bangkrut, lindung nilaimu hilang <em>tepat saat kamu paling butuh</em> (2008!). Makanya pasca-2008 swap standar <strong>wajib kliring terpusat</strong> (<em>central clearing</em>).</p>
      <h2 id="worked4">🔬 Worked Example: IRS Rp100 Miliar — Simulasi 2 Tahun</h2>
      <p>PT Maju berutang Rp100 M <em>floating</em> (JIBOR + 1%). Takut bunga naik, ia swap: <strong>bayar fixed 7%</strong>, terima JIBOR + 1%. Tahun 1 JIBOR = 5%; Tahun 2 JIBOR = 8%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Tahun 1 (JIBOR 5%):</strong> bayar fixed: 7% × 100 M = Rp7 M. Terima: (5%+1%) × 100 M = Rp6 M. <strong>Net: bayar Rp1 M</strong> ke lawan swap. Total biaya utang: floating (6 M) + net swap (1 M) = <strong>Rp7 M = 7% fixed</strong>. ✓ (Tanpa swap: 6 M — swap &ldquo;merugikan&rdquo; Rp1 M tahun ini!)</p>
        <p><strong>Tahun 2 (JIBOR 8%):</strong> bayar fixed Rp7 M. Terima: 9% × 100 M = Rp9 M. <strong>Net: terima Rp2 M</strong>. Total biaya: 9 M − 2 M = <strong>Rp7 M = 7% fixed</strong>. ✓ (Tanpa swap: Rp9 M — swap <em>menghemat</em> Rp2 M!)</p>
        <p><strong>Intuisi:</strong> swap <strong>bukan</strong> alat mencari untung — ia alat membeli <strong>kepastian</strong> (7% pasti, 2 tahun). Tahun 1 &ldquo;rugi&rdquo; Rp1 M = <strong>premi kepastian</strong> (seperti premi asuransi — E10!). CFO yang paham tidak menyesali tahun 1 — ia <em>membayar untuk tidur nyenyak</em>. Yang tidak paham akan memaki swap-nya setiap kali JIBOR turun. <strong>Hedging yang disesali saat berhasil = hedging yang tidak dipahami tujuannya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> semua derivatif menjawab <strong>satu</strong> dari tiga kebutuhan: <strong>(1) lindung nilai</strong> (<em>hedge</em> — Pak Tani, PT Maju: <em>mengurangi</em> risiko yang sudah ada); <strong>(2) spekulasi</strong> (<em>menambah</em> risiko untuk return — harus sadar &amp; terukur); <strong>(3) arbitrase</strong> (<em>mengunci</em> selisih harga bebas risiko — Worked 2 E12!). Sebelum menyentuh derivatif apa pun, tulis satu kalimat: <em>&ldquo;saya memakai ini untuk nomor berapa?&rdquo;</em> — jika jawabannya kabur, jangan sentuh.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Kontrak Masa Depan (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan fundamental forward vs opsi?"
        options={[
          "Tidak ada bedanya",
          "Forward: kedua pihak WAJIB eksekusi. Opsi: pemegang punya HAK (boleh tidak eksekusi)",
          "Forward lebih mahal",
          "Opsi hanya untuk saham",
        ]}
        correct={1}
        explanation="Benar: kewajiban vs hak. Konsekuensinya: forward gratis di awal (tanpa premi) tapi payoff simetris; opsi bayar premi tapi rugi dibatasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Long call strike 100, premi 5. Breakeven?"
        options={[
          "100",
          "95",
          "105 (strike + premi)",
          "110",
        ]}
        correct={2}
        explanation="Benar: 105. Harga harus naik menutup premi dulu sebelum untung. Di bawah 100 rugi maksimal = premi 5."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Keunggulan futures dibanding forward OTC?"
        options={[
          "Lebih murah selalu",
          "Standar, likuid (bisa ditutup kapan saja), risiko counterparty minimal via kliring",
          "Tanpa margin",
          "Bisa custom tanggal",
        ]}
        correct={1}
        explanation="Benar: standardisasi + bursa + kliring + margin harian. Harganya: kurang fleksibel (tanggal/nominal baku) dan ada margin call harian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Put-call parity: C + PV(K) = P + S. Jika kiri > kanan…"
        options={[
          "Tidak ada artinya",
          "Ada peluang arbitrase: jual sisi kiri (mahal), beli sisi kanan (murah)",
          "Beli call saja",
          "Pasar efisien sempurna",
        ]}
        correct={1}
        explanation="Benar: jual mahal, beli murah — keduanya mereplikasi payoff identik max(S_T,K), jadi selisihnya = profit bebas risiko (sampai pasar mengoreksi)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Investor memegang saham Rp100 jt dan membeli put strike 100 premi 5%. Fungsi put ini?"
        options={[
          "Spekulasi agar untung besar",
          "Asuransi: portofolio tidak bisa jatuh di bawah Rp95 jt",
          "Menambah dividen",
          "Menghindari pajak",
        ]}
        correct={1}
        explanation="Benar: protective put = asuransi portofolio. Biaya premi = 'biaya tidur nyenyak'. Jika pasar naik, premi hangus tapi saham untung."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bimo (tanpa bisnis dolar) beli call USD/IDR dengan leverage. Ini…"
        options={[
          "Hedging",
          "Spekulasi — menciptakan eksposur tanpa underlying exposure",
          "Arbitrase",
          "Investasi jangka panjang",
        ]}
        correct={1}
        explanation="Benar: spekulasi. Derivatif yang sama di tangan Andi (ada eksposur) = hedging; di tangan Bimo (tanpa eksposur) = taruhan ber-leverage. Niat & posisi menentukan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Forward</strong> = janji wajib eksekusi (OTC, custom); payoff simetris <Tex math={String.raw`S_T - K`} />.</li>
          <li><strong>Futures</strong> = forward terstandarisasi di bursa + kliring + margin harian.</li>
          <li><strong>Opsi</strong> = HAK (bukan kewajiban); premi = intrinsic + time value; bisa hangus total.</li>
          <li>Diagram payoff: forward <strong>/</strong>, call <strong>⌐</strong> (breakeven K+premi), put <strong>¬</strong> (breakeven K−premi).</li>
          <li><strong>Put-call parity: C + PV(K) = P + S</strong> — mesin arbitrase &amp; sintesis posisi.</li>
          <li>Ada eksposur → <strong>hedging</strong>; tanpa eksposur → <strong>spekulasi</strong>. Jujur pada dirimu.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e9-capm" className="btn btn-secondary btn-sm">← E9</Link>
        <Link href="/learn/e11-black-scholes" className="btn btn-primary btn-sm">Next: E11 →</Link>
      </div>
    </div>
  );
}
