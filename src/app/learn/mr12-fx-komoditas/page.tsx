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

export default function MR12Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Spot vs futures: basis yang melebar saat krisis (contoh komoditas)
  const r = rng(77);
  const N = 100;
  const days = Array.from({ length: N }, (_, i) => i + 1);
  const spot: number[] = [];
  const fut: number[] = [];
  let s = 100;
  for (let i = 0; i < N; i++) {
    const crisis = i > 60 && i < 80;
    const u = (r() + r() + r() - 1.5) * (crisis ? 6 : 2);
    s = Math.max(50, s + u);
    const basis = crisis ? 4 + r() * 4 : 0.5 + r() * 1; // basis melebar saat krisis
    spot.push(+s.toFixed(1));
    fut.push(+(s + basis).toFixed(1));
  }
  const basisData = [
    { x: days, y: spot, type: "scatter", mode: "lines", name: "Harga spot", line: { color: "#2a7de1", width: 2 } },
    { x: days, y: fut, type: "scatter", mode: "lines", name: "Harga futures", line: { color: "#e8a838", width: 2 } },
    { x: days, y: fut.map((f, i) => +(f - spot[i]).toFixed(1)), type: "bar", name: "Basis (F−S)", marker: { color: "#94a3b8" }, yaxis: "y2", opacity: 0.5 },
  ];

  // P&L hedge dengan basis risk: unhedged vs hedged (sisa basis)
  const hedgePnl = days.map((_, i) => {
    const ds = i === 0 ? 0 : spot[i] - spot[i - 1];
    const df = i === 0 ? 0 : fut[i] - fut[i - 1];
    return { ds, df };
  });
  let cumUn = 0, cumHe = 0;
  const unhedgedPath: number[] = [0];
  const hedgedPath: number[] = [0];
  hedgePnl.forEach(({ ds, df }) => {
    cumUn += -ds; // short spot (produsen), rugi saat harga naik
    cumHe += -ds + df; // hedge long futures: sisa = basis change
    unhedgedPath.push(+cumUn.toFixed(1));
    hedgedPath.push(+cumHe.toFixed(1));
  });

  const hedgeData = [
    { x: days, y: unhedgedPath.slice(1), type: "scatter", mode: "lines", name: "Tanpa hedge (eksposur penuh)", line: { color: "#ef4444", width: 2 } },
    { x: days, y: hedgedPath.slice(1), type: "scatter", mode: "lines", name: "Dengan futures hedge (sisa basis risk)", line: { color: "#2a7de1", width: 2 } },
  ];

  const lab1Code = String.raw`# FX RISK: translasi eksposur USD ke IDR & dampak ke VaR.
# Perusahaan punya piutang USD 10 juta, jatuh tempo 90 hari. Spot USD/IDR 16.000.
# Volatilitas harian USD/IDR: 0.6%. Berapa VaR 99%/1-hari eksposur ini (dalam IDR)?

import math
usd_exposure = 10_000_000
spot = 16_000
idr_exposure = usd_exposure * spot
sigma_fx = 0.006  # 0.6% harian

var_fx = 2.33 * sigma_fx * idr_exposure
print(f"Eksposur: USD {usd_exposure:,} = Rp {idr_exposure:,.0f}")
print(f"VaR 99%/1-hari FX: Rp {var_fx:,.0f}  ({var_fx/idr_exposure:.2%} dari eksposur)")
print()
# Hedge dengan forward 90 hari: kunci kurs. Biaya = forward points.
# Misal forward 90d = 16.120 (IDR melemah sesuai selisih suku bunga).
fwd = 16_120
locked = usd_exposure * fwd
print(f"Forward 90d: {fwd:,} -> nilai terkunci Rp {locked:,.0f}")
print(f"Biaya hedge (vs spot): Rp {locked - idr_exposure:,.0f} ({(fwd/spot-1):.2%})")
print()
print("Coba: naikkan sigma_fx jadi 0.015 (krisis). Kapan biaya forward")
print("menjadi LEBIH MURAH daripada menanggung VaR-nya?")`;

  const lab2Code = String.raw`# BASIS RISK: hedge futures tidak sempurna.
# Produsen CPO short 1.000 ton spot, hedge long futures 1.000 ton.
# P&L hedge = -(dS) + (dF) = -d(Basis). Jika basis konstan -> hedge sempurna.
# Jika basis bergerak -> sisa risiko = perubahan basis.

import random
random.seed(8)
days = 60
# Skenario A: basis stabil (contango normal)
# Skenario B: basis bergejolak (krisis logistik)
for label, basis_vol in [("Basis stabil", 0.3), ("Basis bergejolak", 2.5)]:
    S, basis = 100.0, 2.0
    pnl_unhedged, pnl_hedged = 0.0, 0.0
    worst_hedged = 0.0
    for _ in range(days):
        dS = random.gauss(0, 2.0)
        dBasis = random.gauss(0, basis_vol)
        S += dS
        basis += dBasis
        pnl_unhedged += -dS            # short spot
        pnl_hedged += -dS + (dS + dBasis)  # + long futures (dF = dS + dBasis)
        worst_hedged = min(worst_hedged, pnl_hedged)
    print(f"{label}:")
    print(f"  P&L tanpa hedge (60 hari) : {pnl_unhedged:+.1f}")
    print(f"  P&L dengan hedge          : {pnl_hedged:+.1f}")
    print(f"  P&L terburuk intraday hedge: {worst_hedged:+.1f}")
    print()
print("Pelajaran: hedge mengubah risiko HARGA menjadi risiko BASIS.")
print("Basis yang 'biasanya stabil' bisa meledak saat krisis (lihat chart).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR12 — Market Risk Analytics</span>
        <h1 className="display-title">FX, Komoditas &amp; Basis Risk:<br />Hedge yang Tidak Pernah Sempurna</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Hedge yang Berkhianat</a></li>
          <li><a href="#fx">Risiko FX: Translasi, Transaksi, Ekonomi</a></li>
          <li><a href="#komod">Komoditas: Spot vs Futures</a></li>
          <li><a href="#basis">Basis Risk: Sisa yang Tidak Bisa Di-hedge</a></li>
          <li><a href="#lab1">🔬 Lab 1: VaR Eksposur FX &amp; Biaya Forward</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Basis Risk</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Tiga Guncangan FX/Komoditas yang Menghancurkan Model</a></li>
          <li><a href="#case">📋 Mini-Case: Eksportir yang &ldquo;Terlindungi&rdquo;</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan tiga jenis eksposur FX (transaksi, translasi, ekonomi) dan menentukan mana yang perlu di-hedge.</li>
          <li>Menghitung VaR eksposur FX dan membandingkannya dengan biaya hedging (forward points).</li>
          <li>Menjelaskan hubungan spot-futures komoditas (cost of carry) dan mengapa keduanya tidak bergerak 1:1.</li>
          <li>Mendefinisikan basis risk dan mengkuantifikasi sisa risiko setelah hedging.</li>
          <li>Memilih instrumen hedge yang tepat (forward vs futures vs opsi) sesuai jenis eksposur dan trade-off-nya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Hedge yang Berkhianat</h2>
      <div className="story">
        <p>Produsen CPO di Kalimantan menjual 1.000 ton per bulan. Untuk &ldquo;aman&rdquo;, ia <strong>hedge penuh</strong> dengan futures CPO di bursa — short spot (produksi), long futures. Teorinya: apa pun yang terjadi pada harga, keduanya saling menghapus. Laporan ke direksi: &ldquo;risiko harga <strong>nol</strong>&rdquo;.</p>
        <p>Lalu krisis logistik: kapal tersendat, gudang penuh. Harga <strong>spot lokal anjlok</strong> (kelebihan pasokan di pelabuhan) sementara harga <strong>futures acuan naik</strong> (pasar global khawatir pasokan). Selisih keduanya — <strong>basis</strong> — melebar dari Rp2 juta menjadi Rp12 juta per ton. Hasilnya: hedge yang &ldquo;sempurna&rdquo; itu <strong>rugi Rp10 miliar</strong> — dari posisi yang diklaim &ldquo;risikonya nol&rdquo;.</p>
        <p>Twist-nya: hedge tidak menghilangkan risiko — ia <strong>menukarnya</strong>. Risiko harga (besar, terlihat) ditukar dengan <strong>basis risk</strong> (kecil biasanya, mematikan saat krisis). Dan basis risk punya sifat jahat: ia <strong>meledak tepat saat kamu paling butuh hedge bekerja</strong> — karena penyebab krisis harga dan penyebab basis melebar sering <em>sama</em> (gangguan logistik, misalnya).</p>
      </div>

      <h2 id="fx">Risiko FX: Translasi, Transaksi, Ekonomi</h2>
      <p><strong>Definisi.</strong> Tiga wajah eksposur valuta asing:</p>
      <ul>
        <li><strong>Transaksi:</strong> piutang/utang dalam valas yang <em>sudah pasti</em> (kontrak ditandatangani). Contoh: piutang USD 10 juta jatuh tempo 90 hari. → <strong>Hedge-able</strong> dengan forward (jumlah &amp; waktu diketahui).</li>
        <li><strong>Translasi:</strong> penjabaran laporan keuangan anak perusahaan luar negeri ke mata uang induk. Tidak ada arus kas aktual — tapi mempengaruhi <strong>ekuitas &amp; rasio modal</strong> yang dilaporkan. → Biasanya <strong>tidak di-hedge</strong> (mahal, dan &ldquo;kerugian&rdquo;-nya akuntansi).</li>
        <li><strong>Ekonomi (operating):</strong> dampak <em>jangka panjang</em> pergerakan kurs ke daya saing. Contoh: rupiah menguat permanen → eksportir kalah bersaing dengan Vietnam. → <strong>Tidak bisa di-hedge</strong> dengan derivatif (butuh keputusan bisnis: relokasi, diversifikasi pasar).</li>
      </ul>
      <p><strong>Aturan praktis:</strong> hedge yang <strong>pasti</strong> (transaksi), laporkan yang <strong>akuntansi</strong> (translasi), strategikan yang <strong>struktural</strong> (ekonomi). Mencampuradukkannya = buang biaya hedge untuk risiko yang salah.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanya tiga hal sebelum hedge FX: (1) <strong>apakah arusnya pasti?</strong> (kalau belum pasti — misal tender yang belum menang — forward bisa menjadi spekulasi!), (2) <strong>berapa lama?</strong> (forward panjang mahal; pertimbangkan opsi), (3) <strong>apa yang benar-benar dilindungi</strong> — nilai rupiahnya, atau daya saingnya? Jawaban berbeda → instrumen berbeda.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Semua eksposur FX harus di-hedge.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> hedging <strong>berbiaya</strong> (forward points = selisih suku bunga). Untuk eksposur kecil/volatilitas rendah, biaya hedge bisa melebihi manfaatnya. Dan eksposur <em>ekonomi</em> tidak bisa di-hedge dengan derivatif sama sekali. Keputusan hedge = <strong>perbandingan biaya vs risiko</strong>, bukan refleks.</p>
      </div>

      <h2 id="komod">Komoditas: Spot vs Futures</h2>
      <p><strong>Definisi.</strong> Harga <strong>spot</strong> = harga kini untuk penyerahan segera. Harga <strong>futures</strong> = harga yang disepakati kini untuk penyerahan di masa depan. Hubungan teoritis (<strong>cost of carry</strong>):</p>
      <Tex math={String.raw`F = S \cdot e^{(r + u - y)T}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`F, S`} />: harga futures &amp; spot</li>
        <li><Tex math={String.raw`r`} />: suku bunga (biaya pendanaan)</li>
        <li><Tex math={String.raw`u`} />: biaya penyimpanan (storage) — besar untuk komoditas fisik!</li>
        <li><Tex math={String.raw`y`} />: <strong>convenience yield</strong> — &ldquo;kenyamanan&rdquo; memegang fisik (bisa dipakai produksi kapan saja)</li>
        <li><Tex math={String.raw`T`} />: tenor kontrak</li>
      </ul>
      <p><strong>Dua rezim:</strong></p>
      <ul>
        <li><strong>Contango</strong> (F &gt; S): pasar santai, pasokan cukup. Convenience yield rendah.</li>
        <li><strong>Backwardation</strong> (F &lt; S): pasar panik kekurangan barang — convenience yield melonjak (pegang fisik <em>sekarang</em> sangat berharga).</li>
      </ul>
      <p><strong>Kenapa penting untuk risiko:</strong> transisi contango → backwardation (atau sebaliknya) = <strong>perubahan basis yang tajam</strong> — dan itulah yang membunuh hedge di cerita pembuka.</p>

      <h2 id="basis">Basis Risk: Sisa yang Tidak Bisa Di-hedge</h2>
      <p><strong>Definisi.</strong> <strong>Basis</strong> = selisih harga instrumen hedge vs harga eksposur yang dilindungi:</p>
      <Tex math={String.raw`\text{Basis} = F_{\text{hedge}} - S_{\text{eksposur}}`} block />
      <p><strong>Basis risk</strong> = risiko bahwa basis <strong>berubah</strong> selama periode hedge. P&amp;L posisi ter-hedge:</p>
      <Tex math={String.raw`P\&L_{\text{hedged}} = -\Delta(\text{Basis})`} block />
      <p><strong>Artinya:</strong> hedge sempurna (1:1) tidak menghilangkan P&amp;L — ia mengubahnya menjadi <strong>perubahan basis</strong>. Jika basis konstan → P&amp;L nol (hedge bekerja). Jika basis bergerak → itulah sisa risikomu.</p>
      <p><strong>Sumber basis risk:</strong></p>
      <ul>
        <li><strong>Lokasi:</strong> spot lokal vs futures acuan global (kasus CPO di cerita).</li>
        <li><strong>Kualitas/grade:</strong> komoditasmu vs spesifikasi kontrak futures.</li>
        <li><strong>Waktu:</strong> jatuh tempo eksposur vs jatuh tempo kontrak (harus <em>roll</em> → roll risk).</li>
        <li><strong>Cross-hedge:</strong> tidak ada futures untuk komoditasmu → pakai futures komoditas <em>mirip</em> (misal hedge avtur dengan futures minyak mentah).</li>
      </ul>

      <PlotlyChart
        data={basisData}
        title="Spot vs Futures: Basis Melebar Saat Krisis (hari 60-80)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Harga" }, yaxis2: { title: "Basis", overlaying: "y", side: "right" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> biru = spot, kuning = futures (sumbu kiri). Batang abu-abu = basis/F−S (sumbu kanan).</p>
        <p><strong>Interpretasi:</strong> hari 1–60: basis kecil &amp; stabil (~1) — hedge &ldquo;bekerja&rdquo;. Hari 60–80 (krisis logistik): basis <strong>meledak ke ~8</strong> — spot dan futures bergerak <em>berlawanan arah</em>. <strong>Inilah momen hedge berkhianat:</strong> basis risk yang &ldquo;kecil&rdquo; 95% dari waktu menjadi dominan tepat saat krisis.</p>
      </div>

      <PlotlyChart
        data={hedgeData}
        title="P&L Kumulatif: Tanpa Hedge vs Dengan Futures Hedge"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "P&L kumulatif" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> merah = P&amp;L tanpa hedge (liar mengikuti harga), biru = dengan hedge futures.</p>
        <p><strong>Interpretasi:</strong> hedge <strong>meredam 90%+ volatilitas</strong> di masa normal — jelas bermanfaat. Tapi perhatikan hari 60–80: garis biru <strong>berayun tajam</strong> — itulah basis risk yang terealisasi. <strong>Kesimpulan jujur:</strong> hedge = tukar risiko besar (harga) dengan risiko kecil-tapi-licik (basis). Jangan laporkan &ldquo;risiko nol&rdquo; — laporkan &ldquo;risiko basis tersisa RpX&rdquo;.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Hedge ratio optimal selalu 1:1.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> hedge ratio optimal (<strong>minimum-variance</strong>) = <Tex math={String.raw`h^* = \rho \cdot \sigma_S / \sigma_F`} /> — tergantung <strong>korelasi</strong> spot-futures. Jika korelasi 0,8 (bukan 1,0), hedge 1:1 <em>over-hedge</em>. Untuk cross-hedge (komoditas beda), h* bisa 0,6–0,7. Hitung dari data, jangan asumsikan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap hedge punya <strong>tiga lapis</strong>: (1) risiko yang dihapus (harga), (2) risiko yang tersisa (basis), (3) risiko <em>baru</em> yang diciptakan (margin call futures! likuiditas!). Hedge futures butuh margin harian — saat pasar bergerak melawanmu, kamu butuh <strong>kas</strong> sebelum hedge &ldquo;terbukti benar&rdquo;. Banyak hedge yang benar secara ekonomi gagal karena <strong>kehabisan likuiditas</strong> di tengah jalan.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: VaR Eksposur FX &amp; Biaya Forward</h2>
      <p>Ubah volatilitas FX dan tenor. Pada titik mana biaya forward menjadi lebih murah daripada menanggung risikonya?</p>
      <PyodideLab
        title="Lab 1 — Keputusan Hedge FX: Biaya vs Risiko"
        hint="Coba sigma 0.6% → 2% (krisis EM). VaR meledak sementara biaya forward relatif tetap — di sinilah hedge menjadi 'murah' secara risiko."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Basis Risk</h2>
      <p>Ubah volatilitas basis. Berapa besar basis_vol agar &ldquo;hedge&rdquo; justru lebih berisiko daripada tidak hedge?</p>
      <PyodideLab
        title="Lab 2 — Hedge Mengubah Risiko Harga menjadi Risiko Basis"
        hint="Coba basis_vol=5.0 (cross-hedge buruk): P&L hedged bisa LEBIH LIAR dari unhedged. Hedge yang buruk lebih berbahaya dari tidak hedge."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Eksposur FX transaksi (pasti, jatuh tempo jelas) → <strong>Forward (kunci kurs)</strong></h3>
        <p><strong>Kondisi:</strong> jumlah &amp; waktu diketahui pasti.</p>
        <p><strong>Alasan:</strong> forward mengunci kurs tanpa premi di depan (biaya = forward points). Jangan pakai opsi jika tidak butuh fleksibilitas — premi opsi mahal untuk kepastian.</p>
      </div>

      <div className="decision-card">
        <h3>2. Eksposur belum pasti / butuh fleksibilitas → <strong>Opsi FX (bayar premi untuk hak)</strong></h3>
        <p><strong>Kondisi:</strong> tender belum menang, volume tidak pasti.</p>
        <p><strong>Alasan:</strong> forward untuk eksposur yang belum pasti = <strong>spekulasi</strong> (jika tender gagal, kamu pegang posisi FX telanjang!). Opsi memberi perlindungan tanpa kewajiban.</p>
      </div>

      <div className="decision-card">
        <h3>3. Hedge komoditas dengan futures → <strong>Hitung h* + ukur &amp; laporkan basis risk</strong></h3>
        <p><strong>Kondisi:</strong> ada futures yang cukup berkorelasi.</p>
        <p><strong>Alasan:</strong> jangan asumsikan 1:1; estimasi hedge ratio minimum-variance dari data. Selalu laporkan sisa basis risk sebagai angka — bukan &ldquo;nol&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tidak ada futures yang cocok → <strong>Cross-hedge hati-hati atau terima risiko</strong></h3>
        <p><strong>Kondisi:</strong> komoditas eksotis, korelasi rendah (&lt; 0,7).</p>
        <p><strong>Alasan:</strong> cross-hedge dengan korelasi rendah bisa <em>menambah</em> risiko (basis risk &gt; risiko harga). Kadang keputusan terbaik = <strong>tidak hedge</strong> + siapkan buffer modal.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Pasti</strong> → forward. <strong>Belum pasti</strong> → opsi. <strong>Struktural</strong> → strategi bisnis.</li>
          <li>Hedge = <strong>tukar</strong> risiko, bukan hapus — ukur &amp; laporkan sisanya (basis).</li>
          <li>Hedge ratio dari <strong>data</strong> (<Tex math={String.raw`h^*=\rho\sigma_S/\sigma_F`} />), bukan asumsi 1:1.</li>
          <li>Siapkan <strong>likuiditas margin</strong> — hedge yang benar bisa mati kehabisan kas.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Tiga Guncangan FX/Komoditas yang Menghancurkan Model</h2>
      <p>Risiko FX dan komoditas punya ciri khas: <strong>harganya ditentukan politik dan perang</strong> sebanyak oleh ekonomi. Tiga episode — 1997, 2015, 2020 — menunjukkan bagaimana &ldquo;asumsi wajar&rdquo; model VaR hancur dalam hitungan jam, plus contoh hitung forward FX langkah-demi-langkah.</p>

      <h3>1997: Krisis Asia — ketika &ldquo;peg&rdquo; bukan janji</h3>
      <p>Sebelum Juli 1997, baht Thailand dipatok (~25 THB/USD), rupiah Indonesia dikelola dalam band sempit. Korporasi Asia meminjam <strong>dolar murah</strong> besar-besaran — mengasumsikan kurs &ldquo;stabil&rdquo;. Lalu Thailand melepas patokannya (2 Juli 1997):</p>
      <ul>
        <li><strong>THB:</strong> −50%+ dalam hitungan bulan. <strong>IDR:</strong> dari ~2.400 ke <strong>~16.000 per USD</strong> (−85%) pada 1998.</li>
        <li>Korporasi dengan utang USD dan pendapatan rupiah: kewajiban <strong>berlipat 6×</strong> dalam rupiah — bangkrut massal.</li>
        <li><strong>Pelajaran VaR:</strong> VaR dari data 1994–1996 (rezim peg) menunjukkan risiko FX nyaris nol — karena <em>rezimnya</em> menekan volatilitas. Begitu rezim pecah, distribusi berubah total. <strong>VaR tidak bisa melihat perubahan rezim yang belum ada di datanya</strong> — untuk risiko FX rezim-terpaku, skenario &ldquo;peg pecah&rdquo; (MR7) wajib ada.</li>
      </ul>

      <h3>2015: Franc shock — 30% dalam 20 menit</h3>
      <p>15 Januari 2015, Swiss National Bank <strong>tiba-tiba</strong> melepas patok EUR/CHF 1,20 — tanpa peringatan. Franc menguat <strong>~30% dalam menit</strong>. Broker-broker forex global bangkrut dalam sehari (klien rugi melebihi saldonya — <em>negative balance</em>); hedge fund rugi miliaran dolar.</p>
      <p><strong>Pelajaran untuk risk manager:</strong> (1) <strong>Janji bank sentral bukan data</strong> — SNB berulang kali menegaskan akan mempertahankan patok; (2) VaR 10-hari tidak relevan untuk lompatan 20-menit — butuh <strong>stress skenario &ldquo;kebijakan berubah tiba-tiba&rdquo;</strong>; (3) risiko <strong>gap</strong> tidak bisa di-hedge dengan stop-loss (stop tereksekusi jauh dari harga yang diinginkan — <em>slippage</em> brutal).</p>

      <h3>2020: Minyak negatif — harga yang &ldquo;mustahil&rdquo;</h3>
      <p>20 April 2020: futures minyak WTI untuk Mei jatuh ke <strong>−US$37 per barel</strong>. Harga negatif — penjual <em>membayar</em> pembeli untuk mengambil minyaknya. Penyebab: penyimpanan Cushing penuh + kontrak berjangka jatuh tempo + tidak ada yang mau serah terima fisik saat lockdown.</p>
      <p><strong>Pelajaran model:</strong> (1) Model harga komoditas yang mengasumsikan harga ≥ 0 (lognormal — MR15) <strong>rusak total</strong>; (2) <strong>basis fisik vs finansial</strong>: yang jatuh adalah kontrak berjangka jatuh tempo, bukan &ldquo;minyak&rdquo; secara abstrak — risiko <strong>delivery/operasional</strong> tidak tertangkap VaR harga; (3) korelasi lintas-komoditas pecah — model portofolio energi yang mengandalkan korelasi historis memberi angka sampah.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: harga forward FX dari paritas suku bunga (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Eksportir akan menerima <strong>USD 5 juta</strong> dalam 90 hari. Spot USD/IDR = 16.000. Suku bunga IDR 90-hari = 6% p.a., USD = 5% p.a. Berapa forward rate yang &ldquo;wajar&rdquo; (tanpa arbitrase)?</p>
        <p><strong>Langkah 1 — rumus covered interest parity:</strong> <Tex math={String.raw`F = S \times \frac{1 + r_{IDR} \cdot \tau}{1 + r_{USD} \cdot \tau}`} />, dengan <Tex math={String.raw`\tau = 90/360 = 0{,}25`} />.</p>
        <p><strong>Langkah 2 — hitung:</strong> <Tex math={String.raw`F = 16{.}000 \times \frac{1 + 0{,}06 \times 0{,}25}{1 + 0{,}05 \times 0{,}25} = 16{.}000 \times \frac{1{,}015}{1{,}0125} \approx 16{.}039{,}5`} />.</p>
        <p><strong>Langkah 3 — forward points:</strong> 16.039,5 − 16.000 = <strong>+39,5 poin</strong> (IDR &ldquo;diskon&rdquo; terhadap USD karena suku bunga IDR lebih tinggi — <em>forward premium</em> untuk USD).</p>
        <p><strong>Langkah 4 — nilai hedge:</strong> eksportir mengunci penerimaan = 5 jt × 16.039,5 = <strong>Rp80,20 miliar</strong> — pasti, apapun yang terjadi pada spot 90 hari ke depan.</p>
        <p><strong>Angka ini artinya:</strong> biaya &ldquo;asuransi&rdquo; FX ≈ selisih suku bunga — di sini hanya Rp197,5 juta dari Rp80 miliar (0,25%). <strong>Murah</strong> — karena itulah eksposur transaksi wajib di-hedge. Bandingkan dengan 1997: korporasi yang <em>tidak</em> membayar 0,25% ini kehilangan 85% nilai kewajibannya. Asuransi termurah adalah yang dibeli sebelum kebakaran.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Hedge FX menghilangkan risiko.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> hedge <strong>menukar</strong> satu risiko dengan risiko lain: risiko pasar → <strong>risiko basis</strong> (forward vs aktual tidak pas sempurna), <strong>risiko likuiditas</strong> (margin call pada kontrak futures saat kurs bergerak berlawanan sebelum jatuh tempo), dan <strong>risiko lawan</strong> (counterparty — MR14). Eksportir yang hedge USD 5 juta dengan forward lalu kontraknya <em>batal</em> kini memegang <strong>spekulasi murni</strong> USD 5 juta. Hedge yang jumlah/waktunya meleset = judi berkedok manajemen risiko.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk setiap eksposur FX/komoditas, tanyakan <em>&ldquo;apa yang bisa membuat lindung nilai saya gagal tepat saat saya paling membutuhkannya?&rdquo;</em> — jawabannya hampir selalu salah satu dari: (a) <strong>rezim berubah</strong> (peg pecah, kebijakan berbalik), (b) <strong>likuiditas hilang</strong> (tidak bisa roll forward), (c) <strong>basis meledak</strong> (fisik vs finansial berpisah). Tiga pertanyaan ini adalah &ldquo;stress test mini&rdquo; untuk setiap program hedging.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: carry trade unwind 2008 — ketika &ldquo;uang gratis&rdquo; menagih (klik untuk buka)</summary>
        <p><strong>Strategi carry:</strong> pinjam JPY di 0,5%, investasikan di AUD 7% — kantongi selisih ~6,5%/tahun. Sebelum 2008, triliunan dolar mengikuti strategi ini. Asumsinya: <strong>JPY tidak menguat tiba-tiba</strong>.</p>
        <p><strong>Unwind (Okt–Des 2008):</strong> panik global → investor menutup carry trade → beli kembali JPY → JPY <strong>menguat 20%+ terhadap AUD dalam 2 bulan</strong>.</p>
        <p><strong>Hitungan:</strong> posisi Rp10 T ekuivalen. Keuntungan bunga 3 bulan ≈ 10 T × 6,5% × 0,25 = <strong>Rp162 M</strong>. Kerugian FX = 10 T × 20% = <strong>Rp2 T</strong> — <strong>12×</strong> keuntungan bunganya, terhapus dalam 8 minggu.</p>
        <p><strong>Pelajaran risiko:</strong> (1) carry trade = <strong>short volatilitas FX</strong> (untung kecil stabil, rugi besar sesekali — profil yang sama dengan short opsi, MR11); (2) VaR dari data tenang <em>tidak mengandung</em> unwind — butuh skenario &ldquo;risk-off global&rdquo; (MR7); (3) <strong>crowded trade</strong>: saat semua orang di sisi yang sama, pintu keluarnya sempit — likuiditas (MR13) adalah bagian dari risiko FX.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — hedging program vs hedging transaksional:</strong> korporasi besar tidak hedge per transaksi (mahal, berisik) — mereka memakai <strong>program hedge berlapis</strong>: misal lindungi 80% eksposur 1-bulan, 50% eksposur 3-bulan, 20% eksposur 12-bulan (<em>layered hedging</em>). Logikanya: eksposur dekat = pasti → hedge penuh; eksposur jauh = belum pasti → hedge parsial (opsi). <strong>Aturan penetapan rasio:</strong> hedge ratio = keyakinan arus × (1 − toleransi risiko). Arus 100% pasti + toleransi nol → 100% forward. Tender belum menang (peluang 40%) → <em>jangan</em> forward; pakai opsi atau tunggu. Setiap program hedge wajib punya <strong>matriks</strong>: sumbu X = kepastian arus, sumbu Y = horizon — isi selnya = instrumen yang dipakai. Tanpa matriks ini, keputusan hedge = intuisi trader, bukan kebijakan perusahaan.</p>
      </div>
      <p><strong>Tiga biaya hedge yang sering dilupakan:</strong> (1) <strong>forward points</strong> (selisih suku bunga — kecil untuk tenor pendek, besar untuk tenor panjang &amp; mata uang berbunga tinggi); (2) <strong>margin/collateral</strong> pada futures — arus kas keluar saat kurs bergerak berlawanan <em>sebelum</em> jatuh tempo (risiko likuiditas!); (3) <strong>biaya kesempatan</strong> — forward mengunci kurs: jika IDR <em>menguat</em>, eksportir &ldquo;rugi&rdquo; vs tidak hedge (inilah mengapa opsi — bukan forward — dipakai saat arah tidak jelas: premi = harga untuk tetap bisa ikut untung).</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Spot USD/IDR 15.500, r_IDR 5,5% p.a., r_USD 4,5% p.a., tenor 180 hari. Hitung forward rate dan forward points. (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`F = 15{.}500 \times \frac{1+0{,}055 \times 0{,}5}{1+0{,}045 \times 0{,}5} = 15{.}500 \times \frac{1{,}0275}{1{,}0225} \approx 15{.}575{,}8`} />. Forward points = <strong>+75,8</strong>.</p>
        <p><strong>Catatan:</strong> forward &ldquo;wajar&rdquo; <em>hanya</em> dari selisih suku bunga — bukan prediksi kurs! Jika pasar forward jauh dari angka ini → ada <strong>peluang arbitrase</strong> (atau kontrol modal / biaya yang belum dimodelkan).</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Korporasi berutang USD 100 juta (1996) dengan pendapatan rupiah, tanpa hedge. Kurs 2.400 → 16.000. Hitung kelipatan kewajiban dalam rupiah dan jelaskan mengapa VaR 1994–1996 tidak menangkap ini. (klik untuk pembahasan)</summary>
        <p><strong>Kelipatan:</strong> 16.000/2.400 = <strong>6,67×</strong> — kewajiban Rp240 M menjadi Rp1,6 T. Ekuitas banyak korporasi <em>negatif</em> seketika.</p>
        <p><strong>VaR buta karena:</strong> data 1994–1996 berasal dari <strong>rezim peg/band</strong> — volatilitas artifisial rendah. VaR mengukur risiko <em>dalam rezim</em>, bukan risiko <em>rezimnya pecah</em>. Untuk risiko FX rezim-terpaku, skenario &ldquo;peg pecah&rdquo; (MR7) <strong>wajib</strong> — VaR saja = mengasumsikan janji bank sentral sebagai hukum fisika.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Eksportir hedge piutang USD 5 juta dengan forward, lalu kontrak dagangnya BATAL. Apa posisinya sekarang? Apa yang seharusnya dilakukan? (klik untuk pembahasan)</summary>
        <p><strong>Posisi sekarang: spekulasi murni</strong> short USD 5 juta (wajib jual USD 5 juta di kurs forward tanpa underlying). Jika USD menguat, rugi tanpa ada penerimaan yang mengimbanginya.</p>
        <p><strong>Yang seharusnya:</strong> (1) <strong>unwind/offset</strong> forward segera (biaya unwind = pelajaran mahal tapi terbatas); (2) ke depan: gunakan <strong>opsi</strong> (bukan kewajiban) untuk eksposur belum pasti, atau forward dengan klausul <em>cancelable</em>; (3) aturan: <strong>hedge hanya untuk arus yang pasti</strong> — ketidakpastian arus = ketidakpastian hedge.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Eksportir yang &ldquo;Terlindungi&rdquo;</h2>
      <div className="callout">
        <p>PT Ekspor Jaya: piutang <strong>USD 20 juta</strong> per kuartal dari buyer AS. Kebijakan: &ldquo;hedge 100% dengan forward 90 hari&rdquo;. Q3 2026:</p>
        <ul>
          <li>Forward dikunci di <strong>16.100</strong> (spot saat itu 16.000)</li>
          <li>Rupiah <strong>menguat</strong> ke 15.400 (bank sentral intervensi agresif)</li>
          <li>Buyer <strong>menunda pembayaran 60 hari</strong> (masalah logistik) — forward jatuh tempo <em>sebelum</em> dolar diterima!</li>
          <li>Perusahaan harus <strong>roll</strong> forward di kurs baru yang merugikan + bayar margin</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa yang salah dari &ldquo;hedge 100%&rdquo; ini? (b) Bagaimana seharusnya hedging dirancang untuk eksposur berisiko-waktu? (c) Pelajaran tentang basis risk di sini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Dua kesalahan:</strong> (1) <em>Hedge 100% dari eksposur yang waktunya tidak pasti</em> — ketika pembayaran tertunda, forward menjadi <strong>spekulasi berarah</strong> (perusahaan &ldquo;short USD&rdquo; tanpa underlying). (2) <em>Tidak ada fleksibilitas</em> — forward = kewajiban, bukan hak.</p>
          <p>(b) <strong>Rancangan benar:</strong> hedge <strong>bertahap</strong> (misal 50% saat kontrak, tambah saat kepastian waktu meningkat) + gunakan <strong>opsi</strong> untuk porsi yang tidak pasti waktunya + <strong>klausa fleksibilitas</strong> (window forward, bukan tanggal tetap). Aturan: <strong>persentase hedge ≤ tingkat kepastian</strong>.</p>
          <p>(c) Ini <strong>basis risk waktu</strong>: mismatch antara jatuh tempo hedge vs arus kas aktual. Basis tidak selalu soal harga — bisa soal <strong>waktu, lokasi, kualitas</strong>. Setiap dimensi mismatch = basis risk.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Piutang USD 10 juta pasti jatuh tempo 90 hari. Instrumen hedge TEPAT?"
        options={[
          "Opsi — selalu paling aman",
          "Forward 90 hari — jumlah & waktu pasti, kunci kurs tanpa premi di depan",
          "Tidak usah hedge",
          "Beli saham",
        ]}
        correct={1}
        explanation="Benar. Eksposur pasti → forward (kewajiban mengunci = tepat karena arusnya pasti). Opsi membuang premi untuk fleksibilitas yang tidak dibutuhkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Tender proyek luar negeri BELUM tentu menang, tapi ingin proteksi FX. Yang tepat?"
        options={[
          "Forward penuh sekarang",
          "Opsi FX — memberi hak tanpa kewajiban; forward untuk eksposur tak pasti = spekulasi jika tender gagal",
          "Tidak ada yang bisa dilakukan",
          "Pinjam USD",
        ]}
        correct={1}
        explanation="Benar. Ketidakpastian = butuh opsi (hak, bukan kewajiban). Forward mengunci dua arah — jika tender gagal, posisi FX telanjang = spekulasi murni."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Hedge futures 1:1 tapi korelasi spot-futures hanya 0,7. Masalahnya?"
        options={[
          "Tidak ada — 1:1 selalu benar",
          "Over-hedge: hedge ratio optimal h* = ρ·σS/σF < 1 — hedge 1:1 justru menambah risiko",
          "Under-hedge",
          "Korelasi tidak penting",
        ]}
        correct={1}
        explanation="Benar. h* proporsional terhadap korelasi. Dengan ρ=0,7, hedge 1:1 kebanyakan — sisanya menjadi posisi spekulatif arah basis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Setelah hedge futures sempurna (1:1, korelasi 1), P&L yang tersisa adalah?"
        options={[
          "Nol — hedge sempurna",
          "Perubahan basis: −Δ(F−S) — basis risk tidak pernah nol di dunia nyata",
          "Tetap risiko harga penuh",
          "Keuntungan pasti",
        ]}
        correct={1}
        explanation="Benar. Bahkan hedge 'sempurna' pun menyisakan basis risk. 'Risiko nol' setelah hedge adalah klaim yang salah — yang benar 'risiko harga → risiko basis'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan basis risk PALING berbahaya?"
        options={[
          "Saat pasar tenang",
          "Saat krisis — basis meledak tepat ketika hedge paling dibutuhkan (penyebabnya sering sama dengan penyebab krisis harga)",
          "Tidak pernah",
          "Hanya untuk FX",
        ]}
        correct={1}
        explanation="Benar. Basis risk bersifat 'penjahat saat krisis': kecil & stabil 95% waktu, meledak di 5% waktu kritis. Inilah mengapa stress test harus menyertakan skenario basis melebar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Anak perusahaan di Singapura rugi translasi Rp50 M karena SGD melemah (tidak ada arus kas aktual). Haruskah di-hedge?"
        options={[
          "Ya — semua eksposur harus di-hedge",
          "Umumnya tidak — translasi adalah efek akuntansi tanpa arus kas; biaya hedge nyata untuk 'kerugian' yang tidak ada arusnya",
          "Ya dengan opsi",
          "Tutup anak perusahaan",
        ]}
        correct={1}
        explanation="Benar. Translasi ≠ transaksi. Hedge translasi = bayar biaya nyata untuk melindungi angka akuntansi — biasanya tidak worth it. Fokus hedge pada arus kas (transaksi)."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>FX:</strong> transaksi (hedge, pasti) vs translasi (akuntansi, biasanya tidak) vs ekonomi (struktural, tidak bisa).</li>
          <li><strong>Komoditas:</strong> <Tex math={String.raw`F = S e^{(r+u-y)T}`} /> — contango (santai) vs backwardation (panik kekurangan).</li>
          <li><strong>Basis</strong> = F − S; <strong>basis risk</strong> = perubahan basis = sisa P&amp;L setelah hedge.</li>
          <li>Hedge = <strong>tukar</strong> risiko harga → risiko basis (+ risiko likuiditas margin). Tidak pernah &ldquo;nol&rdquo;.</li>
          <li><strong>Hedge ratio optimal:</strong> <Tex math={String.raw`h^* = \rho\sigma_S/\sigma_F`} /> — dari data, bukan asumsi 1:1.</li>
          <li>Persentase hedge ≤ tingkat kepastian; siapkan kas untuk margin; stress-test skenario basis melebar.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr11-options-risk" className="btn btn-secondary btn-sm">← MR11</Link>
        <Link href="/learn/mr13-risiko-likuiditas" className="btn btn-primary btn-sm">Next: MR13 →</Link>
      </div>
    </div>
  );
}
