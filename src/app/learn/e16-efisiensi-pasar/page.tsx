"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E16Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const biasData = [
    {
      x: ["Pilih A: pasti +Rp10 jt", "Pilih B: 50% +Rp25 jt / 50% Rp0"],
      y: [82, 18],
      type: "bar",
      marker: { color: ["#2a7de1", "#94a3b8"] },
      text: ["82%", "18%"],
      textposition: "outside",
    },
  ];

  const overfitData = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      y: [100, 104, 108, 113, 118, 124, 130, 137, 144, 152, 160, 169],
      mode: "lines",
      name: "Backtest (in-sample): +69%",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      y: [100, 99, 97, 98, 95, 96, 93, 94, 91, 92, 89, 87],
      mode: "lines",
      name: "Live (out-of-sample): −13%",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const emhData = [
    {
      x: ["Lemah", "Semi-kuat", "Kuat"],
      y: [1, 2, 3],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#94a3b8"] },
      text: ["Harga lampau", "+ Info publik", "+ Info privat"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Loss aversion: ukur biasmu sendiri
# Pertanyaan klasik Kahneman-Tversky. Jawab JUJUR (ketik a atau b).
print("Skenario 1 (UNTUNG):")
print("  a. Pasti dapat Rp10 jt")
print("  b. 50% dapat Rp25 jt, 50% dapat Rp0")
print("     -> Nilai ekspektasi b = Rp12,5 jt > Rp10 jt (a)")
print()
print("Skenario 2 (RUGI):")
print("  c. Pasti rugi Rp10 jt")
print("  d. 50% rugi Rp25 jt, 50% rugi Rp0")
print("     -> Nilai ekspektasi d = -Rp12,5 jt < -Rp10 jt (c)")
print()
print("Mayoritas manusia: pilih a (takut risiko saat untung),")
print("tapi pilih d (NEKAT saat rugi)!")
print("Itulah loss aversion: rugi Rp1 terasa ~2x lebih sakit dari untung Rp1.")
print()
print("Dampak trading: profit diambil cepat-cepat (a),")
print("tapi rugi dibiarkan membesar (d) — 'nanti juga balik'.")`;

  const lab2Code = `# Lab 2 — Data snooping: 'strategi hebat' dari keacakan murni
# Cari 'pola' di data ACAK. Dengan cukup banyak percobaan, PASTI ketemu yang 'bagus'.
import random
random.seed(123)
n_hari = 250

# 1 strategi diuji pada data acak murni (tidak ada pola sebenarnya!)
rets = [random.gauss(0, 1) for _ in range(n_hari)]
# 'Strategi': beli jika 3 hari naik berturut-turut (aturan ngawur)
sinyal_untung, n_trade = 0, 0
for i in range(3, n_hari - 1):
    if rets[i-3] > 0 and rets[i-2] > 0 and rets[i-1] > 0:
        n_trade += 1
        if rets[i+1] > 0: sinyal_untung += 1

print(f"Aturan ngawur pada data ACAK: menang {sinyal_untung}/{n_trade} ({sinyal_untung/n_trade*100:.0f}%)")
print()
# Sekarang: coba 1000 aturan ngawur, pilih yang TERBAIK
terbaik = 0
for _ in range(1000):
    rets = [random.gauss(0, 1) for _ in range(n_hari)]
    menang = sum(1 for r in rets if r > 0.8)  # aturan: 'beli jika return > 0.8'
    terbaik = max(terbaik, menang)
print(f"Dari 1000 aturan ngawur, yang 'terbaik' menang {terbaik}x dari {n_hari} hari.")
print("-> Inilah data snooping: menguji cukup banyak, yang acak pun terlihat HEBAT.")
print("Solusi: data OUT-OF-SAMPLE yang belum pernah disentuh!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E16 — Financial Markets</span>
        <h1 className="display-title">Apakah Pasar Bisa Dikalahkan?<br />Efisiensi, Bias &amp; Jebakan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Monyet vs Fund Manager</a></li>
          <li><a href="#emh">Hipotesis Pasar Efisien — Tiga Level</a></li>
          <li><a href="#behavioral">Behavioral Finance — Otakmu Musuhnya</a></li>
          <li><a href="#bias">Empat Bias Paling Mematikan</a></li>
          <li><a href="#micro">Microstructure — Dapur Pertarungan</a></li>
          <li><a href="#backtest">Jebakan Backtest — Lima Dosa</a></li>
          <li><a href="#lab1">🔬 Lab 1: Ukur Loss Aversion-mu</a></li>
          <li><a href="#lab2">🔬 Lab 2: Data Snooping</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Bertahan dari Dirimu Sendiri</a></li>
          <li><a href="#case">📋 Mini-Case: Strategi &ldquo;Sempurna&rdquo;</a></li>
          <li><a href="#worked1">🔬 Worked Example: Matematika Fee 2% vs 0,2%</a></li>
          <li><a href="#worked2">🔬 Worked Example: 1.000 Strategi Acak — Satu &ldquo;Sempurna&rdquo;</a></li>
          <li><a href="#konteks">🌍 Konteks: Taruhan Buffett &amp; Meme Stocks</a></li>
          <li><a href="#paradoks">🔧 Pendalaman: Paradoks Grossman-Stiglitz</a></li>
          <li><a href="#behavioral">🔧 Pendalaman: Behavioral Finance — Musuh di Dalam Kepala</a></li>
          <li><a href="#worked4">🔬 Worked Example: Harga Loss Aversion</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tiga bentuk hipotesis pasar efisien dan implikasinya bagi strategi investasi.</li>
          <li>Mengidentifikasi empat bias perilaku utama dan dampaknya pada keputusan trading.</li>
          <li>Menjelaskan konsep dasar market microstructure (spread, market impact, likuiditas).</li>
          <li>Mendeteksi lima jebakan backtest (look-ahead, survivorship, overfitting, biaya, snooping).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Monyet vs Fund Manager</h2>
      <div className="story">
        <p>Tahun 1973, ekonom <strong>Burton Malkiel</strong> menulis kalimat legendaris: <em>&ldquo;Monyet yang melempar dart ke halaman koran saham akan mengalahkan mayoritas manajer investasi.&rdquo;</em> Setengah abad kemudian datanya <strong>mendukungnya</strong>: ~90% reksa dana saham aktif AS <strong>kalah dari indeks</strong> dalam 15 tahun (setelah fee).</p>
        <p>Apakah pasar <em>terlalu</em> efisien untuk dikalahkan? Atau manusia <em>terlalu</em> bias untuk menang? Jawabannya — seperti biasa — <strong>keduanya</strong>. Lesson ini membedah mengapa mengalahkan pasar begitu sulit: pasarnya adaptif, otakmu bias, dan backtest-mu berbohong.</p>
        <p><strong>Twist-nya:</strong> Malkiel tidak bilang manajer investasi itu bodoh — datanya bilang mereka <strong>kalah oleh biaya mereka sendiri</strong>. Monyet tidak membayar fee 2%, tidak membayar pajak atas trading-nya, dan tidak perlu &ldquo;tampil sibuk&rdquo; agar klien tidak kabur. Pertanyaan sebenarnya bukan &ldquo;bisakah manusia mengalahkan monyet?&rdquo; melainkan <strong>&ldquo;bisakah manusia mengalahkan pasar <em>setelah</em> membayar semua biayanya?&rdquo;</strong> — dan di situlah ceritanya menjadi jauh lebih menarik, karena jawabannya: <em>kadang bisa, caranya spesifik, dan pasar belajar darimu</em>.</p>
      </div>

      <h2 id="emh">Hipotesis Pasar Efisien — Tiga Level</h2>
      <p><strong>Definisi.</strong> <em>Efficient Market Hypothesis</em> (EMH): harga <strong>mencerminkan semua informasi</strong> yang tersedia — sehingga tidak ada yang bisa konsisten mengalahkan pasar <em>dengan informasi itu</em>. Tiga bentuk:</p>
      <ul>
        <li><strong>Lemah:</strong> harga mencerminkan <strong>data historis</strong> → analisis teknikal tidak berguna.</li>
        <li><strong>Semi-kuat:</strong> + <strong>semua info publik</strong> → analisis fundamental (laporan keuangan) tidak memberi keunggulan <em>sistematis</em>.</li>
        <li><strong>Kuat:</strong> + <strong>info privat/insider</strong> → bahkan orang dalam tidak bisa menang (terbukti <strong>salah</strong> — insider trading memang menguntungkan, makanya ilegal!).</li>
      </ul>
      <p><strong>Implikasi praktis:</strong> makin efisien pasar (saham US large-cap), makin sulit dikalahkan → <strong>pakai indeks murah</strong>. Makin tidak efisien (saham kecil Indonesia, obligasi daerah), makin besar peluang analis rajin → <strong>riset aktif bisa membayar</strong>.</p>

      <PlotlyChart
        data={emhData}
        title="Tiga Level Efisiensi: Informasi Apa yang 'Sudah di Harga'?"
        layout={{ xaxis: { title: "Bentuk EMH" }, yaxis: { title: "Cakupan informasi", showticklabels: false }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu bentuk EMH; label = jenis informasi yang diklaim sudah tercermin di harga.</p>
        <p><strong>Interpretasi:</strong> makin ke kanan, klaimnya makin kuat — dan makin <strong>diragukan</strong>. Bentuk lemah cukup didukung data; bentuk kuat terbukti salah (insider memang bisa untung). <strong>Posisi bijak:</strong> pasar <em>cukup</em> efisien sehingga mengalahkannya sulit &amp; mahal — tapi tidak sempurna, sehingga anomali &amp; bias perilaku menciptakan celah (lihat bawah).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau pasar efisien, harga tidak akan pernah crash.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> EMH <strong>tidak</strong> mengklaim harga selalu &ldquo;benar&rdquo; — hanya bahwa <em>penyimpangan tidak bisa dieksploitasi sistematis</em> dengan informasi tersedia. Gelembung &amp; crash <strong>bisa</strong> terjadi di pasar efisien (informasi &amp; ekspektasi berubah). &ldquo;Efisien&rdquo; ≠ &ldquo;tenang&rdquo; ≠ &ldquo;benar&rdquo;.</p>
      </div>

      <h2 id="behavioral">Behavioral Finance — Otakmu Musuhnya</h2>
      <p><strong>Definisi.</strong> <em>Behavioral finance</em> = studi <strong>bias psikologis sistematis</strong> yang membuat investor menyimpang dari rasionalitas — dirintis Kahneman &amp; Tversky (Nobel 2002). Intinya: <strong>musuh terbesarmu bukan pasar — melainkan otakmu sendiri</strong>.</p>
      <p><strong>Temuan fondasi — Prospect Theory:</strong> manusia menilai <strong>perubahan</strong> (untung/rugi), bukan kekayaan total — dan <strong>rugi Rp1 terasa ~2× lebih menyakitkan</strong> dari nikmatnya untung Rp1 (<em>loss aversion</em>).</p>

      <PlotlyChart
        data={biasData}
        title="Eksperimen Klasik: 82% Menolak Taruhan yang 'Menguntungkan'"
        layout={{ xaxis: { title: "Pilihan" }, yaxis: { title: "% responden" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> responden memilih antara kepastian Rp10 jt vs 50% peluang Rp25 jt (nilai ekspektasi Rp12,5 jt).</p>
        <p><strong>Interpretasi:</strong> <strong>82%</strong> memilih kepastian — <em>menolak</em> taruhan dengan ekspektasi lebih tinggi! Saat untung, manusia <strong>takut risiko</strong>. Tapi balik skenarionya ke <em>kerugian</em>: mayoritas justru <strong>nekat berjudi</strong> (pilih 50% rugi Rp25 jt daripada pasti rugi Rp10 jt). Asimetri inilah yang membuat investor <strong>take profit terlalu cepat &amp; cut loss terlalu lambat</strong> — resep klasik portofolio berdarah.</p>
      </div>

      <h2 id="bias">Empat Bias Paling Mematikan</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Bias</th><th>Gejala</th><th>Obat</th></tr></thead>
          <tbody>
            <tr><td><strong>Overconfidence</strong></td><td>Merasa bisa prediksi; overtrading; posisi terlalu besar</td><td>Catat prediksi &amp; skor akurasimu; batasi frekuensi trading</td></tr>
            <tr><td><strong>Loss aversion</strong></td><td>Take profit cepat, biarkan rugi membesar (&ldquo;nanti balik&rdquo;)</td><td>Aturan cut-loss <em>tertulis sebelum</em> beli; evaluasi portofolio berkala</td></tr>
            <tr><td><strong>Herding</strong></td><td>Beli karena viral/pom-pom; FOMO di puncak</td><td>Checklist fundamental <em>sebelum</em> ikut keramaian; waspadai grup pom-pom</td></tr>
            <tr><td><strong>Anchoring</strong></td><td>Terpaku harga beli (&ldquo;balik modal dulu baru jual&rdquo;)</td><td>Nilai dari harga <em>kini</em> &amp; prospek, bukan harga belimu — sunk cost!</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Kepribadian bias:</strong> mereka <em>autopilot evolusioner</em> — berguna di sabana (takut rugi = bertahan hidup), <strong>berbahaya</strong> di pasar. Kamu tidak bisa &ldquo;berpikir positif&rdquo; menghilangkannya — hanya bisa <strong>membangun sistem</strong> yang menahannya (aturan tertulis, otomatisasi).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bias termahal ritel Indonesia = <strong>herding + overconfidence</strong>: beli saham viral di puncak (FOMO), lalu <strong>loss aversion</strong> menolak cut loss (&ldquo;nanti balik&rdquo;), diakhiri <strong>anchoring</strong> (&ldquo;tunggu balik modal&rdquo; — 3 tahun kemudian masih −70%). Satu rangkaian bias = satu portofolio kuburan. <strong>Obatnya selalu sama: aturan tertulis SEBELUM emosi datang.</strong></p>
      </div>

      <h2 id="micro">Microstructure — Dapur Pertarungan</h2>
      <p><strong>Definisi.</strong> <em>Market microstructure</em> = studi <strong>mekanisme perdagangan</strong> itu sendiri: bagaimana order di-match, siapa menyediakan likuiditas, dan berapa biayanya. Tiga konsep inti (ingat E6!):</p>
      <ul>
        <li><strong>Bid-ask spread</strong> = kompensasi market maker atas (1) risiko inventory &amp; (2) risiko <em>adverse selection</em> (takut bertransaksi dengan yang lebih tahu!).</li>
        <li><strong>Market impact</strong> = harga bergerak <em>karena</em> ordermu — makin besar order vs likuiditas, makin dalam lukanya (E6 Lab 2).</li>
        <li><strong>Likuiditas semu:</strong> order book terlihat tebal, tapi <em>menghilang</em> saat dibutuhkan (HFT membatalkan order sepersekian detik sebelum eksekusi) — <strong>jangan percaya kedalaman layar saat panik</strong>.</li>
      </ul>
      <p><strong>Implikasi:</strong> strategi yang &ldquo;untung&rdquo; di atas kertas bisa <strong>buntung setelah biaya mikro</strong> — terutama frekuensi tinggi di saham tidak likuid. Inilah mengapa backtest <strong>wajib</strong> memasukkan spread + impact (lihat bawah).</p>

      <h2 id="backtest">Jebakan Backtest — Lima Dosa</h2>
      <p>Backtest = menguji strategi di data historis. <strong>90% backtest &ldquo;hebat&rdquo; adalah ilusi.</strong> Lima dosa:</p>
      <ol>
        <li><strong>Look-ahead bias:</strong> memakai info yang <em>belum ada</em> saat itu (misal: beli saham <em>karena</em> laporan keuangan yang baru rilis 3 bulan kemudian). <strong>Obat:</strong> <em>point-in-time</em> data.</li>
        <li><strong>Survivorship bias:</strong> hanya menguji saham yang <em>masih hidup</em> — yang bangkrut/delisting hilang dari data → return terlihat lebih indah. <strong>Obat:</strong> database termasuk delisting.</li>
        <li><strong>Overfitting:</strong> 20 parameter di-tune sampai pas dengan masa lalu — seperti jas dijahit <em>persis</em> mengikuti lekuk tubuh kemarin; dipakai besok sobek. <strong>Obat:</strong> sedikit parameter + validasi out-of-sample.</li>
        <li><strong>Biaya diabaikan:</strong> backtest tanpa spread, fee, pajak, slippage. <strong>Obat:</strong> kurangi 0,5–1% per round-trip (konservatif).</li>
        <li><strong>Data snooping:</strong> mencoba 1.000 strategi, memamerkan 1 yang &ldquo;berhasil&rdquo; — padahal itu <strong>kebetulan statistik</strong> (Lab 2!). <strong>Obat:</strong> koreksi multiple testing; uji di data yang <em>belum pernah disentuh</em>.</li>
      </ol>

      <PlotlyChart
        data={overfitData}
        title="Kisah Klasik Overfitting: Backtest Sempurna, Live Berdarah"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Nilai (Rp jt)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = kinerja di data backtest (in-sample); garis merah = kinerja <em>uang sungguhan</em> setelahnya (out-of-sample).</p>
        <p><strong>Interpretasi:</strong> backtest +69% setahun — <strong>terlalu bagus untuk jadi kenyataan</strong> (red flag #1!). Live: −13%. Kesenjangan ini = overfitting + biaya + rezim berubah. <strong>Aturan:</strong> makin sempurna backtest-nya, makin curigai. Strategi jujur punya backtest yang &ldquo;biasa saja&rdquo; tapi <em>robust</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Strategiku backtest 5 tahun selalu untung — pasti aman dipakai.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> backtest = <strong>ujian yang soalnya sudah bocor</strong> (kamu men-tune sampai lolos). Kelulusan sejati = <strong>paper trade / forward test</strong> 3–6 bulan di data yang belum pernah dipakai tuning. Dan bahkan itu pun tidak menjamin — rezim pasar berubah (E17!).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Ukur Loss Aversion-mu</h2>
      <p>Jalankan eksperimen Kahneman-Tversky klasik. Jawab jujur — lalu lihat polanya.</p>
      <PyodideLab
        title="Lab 1 — Eksperimen Prospect Theory"
        hint="Diskusikan dengan teman: minta mereka jawab SEBELUM melihat penjelasan. Bandingkan — bias ini universal, bukan 'kamu saja'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Data Snooping</h2>
      <p>Buktikan: dengan 1.000x percobaan, data <strong>acak murni</strong> pun menghasilkan &ldquo;strategi hebat&rdquo;.</p>
      <PyodideLab
        title="Lab 2 — Mesin 'Strategi Hebat' Palsu"
        hint="Ubah n_hari = 1000 (data lebih panjang). Apakah 'strategi terbaik' masih terlihat hebat? Data panjang = lebih sulit menipu (tapi tetap bisa!)."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> rumus skeptis backtest: <strong>kepercayaan ∝ (out-of-sample profit) / (jumlah strategi yang dicoba × kompleksitas)</strong>. Satu strategi sederhana yang untung moderat di 3 periode berbeda &gt; 1 strategi 20-parameter yang &ldquo;sempurna&rdquo; di 1 periode. Kesederhanaan = robustness.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Bertahan dari Dirimu Sendiri</h2>

      <div className="decision-card">
        <h3>1. Godaan trading harian / sinyal viral → <strong>Hitung dulu ekspektasi biayanya</strong></h3>
        <p><strong>Kondisi:</strong> FOMO, &ldquo;cuan cepat&rdquo;.</p>
        <p><strong>Kenapa:</strong> spread + fee + pajak + overconfidence = ekspektasi negatif untuk mayoritas ritel. EMH bentuk lemah: pola chart sudah &ldquo;di harga&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> paper-trade 3 bulan &amp; catat — biarkan datamu sendiri yang bicara.</p>
      </div>

      <div className="decision-card">
        <h3>2. Portofolio merah &amp; ingin &ldquo;tunggu balik modal&rdquo; → <strong>Evaluasi dari nol (zero-based)</strong></h3>
        <p><strong>Kondisi:</strong> anchoring + loss aversion aktif.</p>
        <p><strong>Kenapa:</strong> harga belimu = sunk cost, tidak relevan. Tanya: &ldquo;apakah aku akan BELI saham ini hari ini di harga sekarang?&rdquo; Jika tidak → jual.</p>
        <p><strong>Contoh nyata:</strong> review portofolio tiap kuartal dengan checklist tertulis.</p>
      </div>

      <div className="decision-card">
        <h3>3. Menemukan &ldquo;strategi hebat&rdquo; → <strong>Siksa dengan 5 dosa backtest</strong></h3>
        <p><strong>Kondisi:</strong> backtest indah.</p>
        <p><strong>Kenapa:</strong> cek look-ahead, survivorship, overfitting, biaya, snooping — <em>sebelum</em> uang sungguhan. Lalu forward-test.</p>
        <p><strong>Contoh nyata:</strong> kurangi return backtest 30–50% sebagai &ldquo;diskon kejujuran&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Pasar efisien &amp; kamu sibuk → <strong>Indeks murah + rebalance berkala</strong></h3>
        <p><strong>Kondisi:</strong> tidak punya waktu/keunggulan riset.</p>
        <p><strong>Kenapa:</strong> mengakui keterbatasan = strategi rasional. Biaya rendah + disiplin mengalahkan 90% stock-picker amatir.</p>
        <p><strong>Contoh nyata:</strong> ETF indeks + kontribusi rutin + rebalance tahunan (E8!).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Aturan tertulis sebelum emosi.</strong> Cut-loss, alokasi, review — tulis saat tenang.</li>
          <li><strong>Backtest sempurna = curigai.</strong> Minta out-of-sample + potong biaya.</li>
          <li><strong>Harga belimu tidak penting.</strong> Keputusan dari harga kini &amp; prospek.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Strategi &ldquo;Sempurna&rdquo;</h2>
      <div className="callout">
        <p>Sebuah grup Telegram menjual &ldquo;AI trading bot&rdquo; Rp15 juta: backtest 3 tahun menunjukkan return <strong>+212%</strong>, win rate 78%, max drawdown cuma 4%. Testimoni memukau. Kamu tertarik.</p>
        <p><strong>Pertanyaan:</strong> (a) Terapkan 5 dosa backtest — apa yang harus kamu tanyakan? (b) Tanda bahaya apa yang sudah terlihat dari angkanya? (c) Keputusanmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Look-ahead?</strong> (data point-in-time?) <strong>Survivorship?</strong> (saham delisting ikut?) <strong>Overfitting?</strong> (berapa parameter?) <strong>Biaya?</strong> (spread+fee+slippage masuk?) <strong>Snooping?</strong> (berapa strategi dicoba sebelum yang ini dipamerkan?) — penjual yang menolak menjawab = jawaban.</p>
          <p>(b) <strong>Win rate 78% + MaxDD 4% + return 212%</strong> = kombinasi yang hampir mustahil tanpa <em>tail risk</em> tersembunyi (E7/E11: profil &ldquo;jual asuransi&rdquo;!). Atau murni overfit. Either way: curigai.</p>
          <p>(c) <strong>Tolak / minta forward-test live 6 bulan</strong> dengan akun terverifikasi pihak ketiga. Uang Rp15 juta lebih baik untuk ETF indeks. Prinsip 2L (E15): tidak logis + tidak transparan = jangan.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Fee 2% vs 0,2% — Perang 30 Tahun</h2>
      <p>Dua investor menanam <strong>Rp100 juta</strong>, return pasar kotor <strong>8%/tahun</strong>, horizon <strong>30 tahun</strong>. A memakai reksa dana aktif (fee 2%/thn); B memakai index fund (fee 0,2%/thn).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Return bersih:</strong> A: 8% − 2% = 6%. B: 8% − 0,2% = 7,8%.</p>
        <p><strong>Langkah 2 — Nilai akhir:</strong> A: 100 × (1,06)<sup>30</sup> = 100 × 5,743 = <strong>Rp574 juta</strong>. B: 100 × (1,078)<sup>30</sup> = 100 × 9,540 = <strong>Rp954 juta</strong>.</p>
        <p><strong>Selisih: Rp380 juta</strong> — B berakhir <strong>66% lebih kaya</strong> dari modal &ldquo;hanya&rdquo; 1,8%/tahun lebih murah!</p>
        <p><strong>Intuisi:</strong> fee = <strong>pajak majemuk</strong> (<em>compounding tax</em>). 2% terlihat &ldquo;kecil&rdquo; — tapi ia memakan <strong>25%</strong> dari return kotor 8% <em>setiap tahun</em>, selama 30 tahun. Agar manajer aktif <em>impas</em> vs index, ia harus mengalahkan pasar <strong>1,8%/tahun konsisten</strong> — data SPIVA: ~90% gagal dalam 15 tahun. <strong>Fee adalah peramal kinerja terbaik</strong>: makin murah, makin besar peluang menang.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Dari 1.000 Strategi Acak, Satu Terlihat &ldquo;Sempurna&rdquo;</h2>
      <p>Analogi <em>data mining</em>: kamu menguji <strong>1.000 strategi trading acak</strong> pada data historis 10 tahun. Secara kebetulan murni, berapa yang terlihat &ldquo;hebat&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Peluang satu strategi acak terlihat bagus:</strong> misal peluang &ldquo;untung 5 tahun beruntun&rdquo; murni kebetulan = (1/2)<sup>5</sup> = <strong>3,125%</strong>.</p>
        <p><strong>Langkah 2 — Dari 1.000 strategi:</strong> 1.000 × 3,125% ≈ <strong>31 strategi</strong> akan terlihat &ldquo;hebat&rdquo; — <em>padahal semuanya acak</em>.</p>
        <p><strong>Langkah 3 — Ilustrasi nyata:</strong> inilah cara kerja <strong>backtest palsu</strong>: uji ribuan variasi, tampilkan 1 yang terbaik, sembunyikan 999 yang gagal. Ditambah <em>survivorship bias</em> (dana yang bangkrut hilang dari database!) &rarr; &ldquo;rata-rata dana aktif&rdquo; terlihat lebih bagus dari kenyataan.</p>
        <p><strong>Pertahanan:</strong> (1) minta <strong>out-of-sample test</strong> (uji di data yang <em>tidak</em> dipakai membangun strategi); (2) tanya <strong>berapa strategi yang diuji</strong> sebelum yang ini; (3) curigai <strong>Sharpe &gt; 2</strong> tanpa penjelasan ekonomi yang masuk akal. Backtest = <em>kesaksian tersangka tentang dirinya sendiri</em> — butuh verifikasi independen.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Taruhan Sejuta Dolar Buffett &amp; Pemberontakan Meme Stocks</h2>
      <ul>
        <li><strong>Taruhan Buffett (2008–2017):</strong> Warren Buffett bertaruh <strong>US$1 juta</strong> bahwa <strong>index fund S&amp;P 500</strong> mengalahkan <em>portofolio hedge fund</em> pilihan manajer top dalam 10 tahun. Hasil: index +125,8% vs hedge fund +36,3%. Buffett menang telak — <strong>bukan</strong> karena ia meramal pasar, tapi karena aritmetika fee (Worked 1!) + satu dekade pasar naik.</li>
        <li><strong>GameStop 2021 (meme stocks):</strong> kebalikannya — ritel Reddit <strong>mengalahkan hedge fund raksasa</strong> (Melvin Capital rugi US$6,8 miliar) lewat <em>short squeeze</em> terkoordinasi. Bukti pasar <strong>tidak selalu efisien</strong> — harga bisa terlepas jauh dari fundamental oleh <em>arus &amp; koordinasi</em>.</li>
      </ul>
      <p><strong>Kedua peristiwa benar bersamaan</strong> — dan justru itu intinya: pasar <strong>cukup efisien</strong> sehingga mengalahkannya <em>setelah biaya</em> sangat sulit (Buffett), tapi <strong>cukup tidak efisien</strong> sehingga anomali &amp; gelembung terjadi (GME). Posisi cerdas: <strong>indeks sebagai inti portofolio</strong> (murah, menang aritmetika) + <strong>skeptisisme aktif</strong> pada klaim &ldquo;strategi pasti cuan&rdquo; (mahal, kalah data).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga &ldquo;rasa&rdquo; efisiensi (Fama): <strong>lemah</strong> — harga lampau tidak bisa memprediksi (analisis teknikal murni = sia-sia); <strong>setengah kuat</strong> — semua info publik sudah di harga (analisis laporan keuangan <em>telat</em> = sia-sia; <em>lebih cepat/lebih pintar mengolah</em> = mungkin bisa); <strong>kuat</strong> — bahkan info orang dalam sudah di harga (terbukti <em>salah</em>: insider trading menguntungkan — makanya ilegal!). Untuk ritel: asumsikan <strong>setengah kuat</strong> — keunggulanmu bukan info, melainkan <strong>biaya rendah + horizon panjang + disiplin</strong>.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar efisien = harga selalu benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> efisien = <strong>tidak ada pola <em>yang bisa dieksploitasi murah</em></strong> — bukan &ldquo;harga = nilai fundamental&rdquo;. Gelembung dot-com &amp; GME terjadi <em>di dalam</em> pasar yang &ldquo;efisien&rdquo;: semua orang <em>tahu</em> harganya gila, tapi <strong>tidak ada cara murah &amp; aman</strong> untuk bertaruh melawannya (<em>limits to arbitrage</em>: short bisa rugi tak terbatas, klien kabur sebelum harga kembali normal). Efisien ≠ rasional; efisien = <em>susah dicurangi</em>.</p>
      </div>

      <h2 id="paradoks">🔧 Pendalaman: Paradoks yang Menyelamatkan Profesi Analis</h2>
      <p><strong>Paradoks Grossman-Stiglitz (1980):</strong> <em>jika</em> pasar perfectly efisien (semua info sudah di harga), <strong>tidak ada insentif</strong> untuk riset — kenapa bayar analis jika harganya sudah benar? Tapi jika <em>tidak ada</em> yang riset, harga <em>tidak akan</em> benar. Kontradiksi!</p>
      <ul>
        <li><strong>Resolusinya:</strong> pasar berada di <strong>keseimbangan</strong>: cukup efisien sehingga riset <em>rata-rata</em> tidak menghasilkan alpha setelah biaya — tapi <strong>cukup tidak efisien</strong> sehingga riset <em>terbaik</em> (informasi unik, pengolahan superior, horizon berbeda) masih dibayar. Analis tidak mati — <strong>analis rata-rata</strong> yang mati.</li>
        <li><strong>Implikasi untukmu:</strong> keunggulan yang tersisa bagi analis fundamental: (1) <strong>horizon</strong> — pasar terobsesi kuartal berikutnya; analis 5-tahun melihat yang terlewat; (2) <strong>perilaku</strong> — disiplin saat semua panik (E7!); (3) <strong>ceruk</strong> — saham kecil Indonesia yang tidak diliput analis besar = inefisiensi yang masih bisa dipanen (dengan risiko likuiditas!).</li>
        <li><strong>Dan pasar <em>adaptif</em>:</strong> anomali yang dipublikasikan <em>cenderung melemah</em> (semua orang mengejarnya) — <em>Adaptive Markets Hypothesis</em> (Lo). Edge = <strong>bergerak</strong>, bukan properti tetap. Inilah kenapa &ldquo;strategi abadi&rdquo; tidak ada — yang abadi hanya <strong>prinsip</strong>: biaya rendah, diversifikasi, disiplin.</li>
      </ul>


      <h2 id="behavioral">🔧 Pendalaman: Behavioral Finance — Jika Pasar (Hampir) Efisien, Kenapa Kita Kalah?</h2>
      <p>Jawaban E16: <strong>biaya</strong>. Jawaban pelengkap: <strong>otakmu</strong>. <em>Behavioral finance</em> (Kahneman-Tversky, Thaler — Nobel!) memetakan bias yang membuat investor <em>sistematis</em> merugi:</p>
      <ul>
        <li><strong>Loss aversion:</strong> rasa sakit rugi Rp1 juta ≈ <strong>2×</strong> senangnya untung Rp1 juta. Akibat: <em>menahan saham rugi</em> (&ldquo;nanti balik&rdquo;) + <em>menjual saham untung terlalu cepat</em> (<em>disposition effect</em>) — portofolio penuh &ldquo;mayat&rdquo; yang dipertahankan &amp; &ldquo;bintang&rdquo; yang dijual prematur.</li>
        <li><strong>Overconfidence:</strong> 80%+ investor merasa &ldquo;di atas rata-rata&rdquo; (mustahil secara statistik!). Akibat: <strong>overtrading</strong> — studi Odean: investor yang paling sering trading <em>underperform</em> ~6%/tahun vs yang diam (biaya + keputusan buruk!).</li>
        <li><strong>Recency bias:</strong> &ldquo;saham naik 3 tahun &rarr; akan naik terus&rdquo;. Akibat: <strong>beli di puncak</strong> (FOMO 2021!) &amp; <strong>jual di dasar</strong> (panik 2020!) — kebalikan dari rebalancing E8.</li>
        <li><strong>Anchoring:</strong> &ldquo;beli @ Rp2.000, kini Rp1.200 — tunggu balik ke 2.000&rdquo;. Harga belimu = <strong>jangkar arbitrer</strong> yang tidak ada hubungannya dengan nilai wajar (E6!). Keputusan sehat: <em>&ldquo;apakah aku beli hari ini di Rp1.200?&rdquo;</em> — jika tidak, jual.</li>
        <li><strong>Herding:</strong> &ldquo;semua beli, masa aku tidak?&rdquo; — bahan bakar gelembung &amp; crash (GME 2021 kedua sisinya!).</li>
      </ul>
      <p><strong>Pertahanan sistematis (bukan tekad!):</strong> (1) <strong>aturan tertulis</strong> — kriteria beli/jual <em>sebelum</em> emosi datang (E8: rebalancing bands!); (2) <strong>otomatisasi</strong> — nabung rutin ETF (E15) memotong FOMO &amp; panik sekaligus; (3) <strong>jurnal keputusan</strong> — tulis <em>alasan</em> tiap transaksi; review tiap 6 bulan untuk melihat biasmu sendiri beraksi; (4) <strong>pre-mortem</strong> — sebelum beli, tulis: &ldquo;setahun lagi investasi ini gagal — apa penyebabnya?&rdquo; (memaksa otak mencari bukti <em>kontra</em>).</p>
      <h2 id="worked4">🔬 Worked Example: Harga Loss Aversion — Rp2 Juta yang Hilang Diam-Diam</h2>
      <p>Portofolio Rp50 juta: Saham A (beli Rp20 jt → kini <strong>Rp14 jt</strong>, −30%), Saham B (beli Rp20 jt → kini <strong>Rp28 jt</strong>, +40%), Kas Rp10 jt. Kamu butuh <strong>Rp8 juta</strong> tunai. Mana yang dijual?</p>
      <details className="worked">
        <summary>📐 Analisis langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Pilihan naluriah (disposition effect):</strong> jual B (untung!) — &ldquo;kunci keuntungan&rdquo;, pertahankan A — &ldquo;nanti balik ke 20 jt&rdquo;. Jual Rp8 jt dari B (tersisa Rp20 jt B).</p>
        <p><strong>Pertanyaan rasional:</strong> lupakan harga beli (sunk cost!). Tanya: <em>&ldquo;dengan Rp34 jt (A+B kini), bagaimana alokasi terbaik ke depan?&rdquo;</em> Jika analisis fundamental (E18!) bilang prospek A <em>memburuk</em> &amp; B <em>membaik</em> — menjual B = <strong>menjual pemenang &amp; memelihara pecundang</strong>!</p>
        <p><strong>Hitung biaya biasnya:</strong> misal setahun kemudian A → Rp10 jt (−29% lagi), B → Rp36 jt (+29%). Skenario naluriah: A 14→10 (rugi 4) + B 20→25,7 (untung 5,7, setelah jual 8) = <strong>Rp35,7 jt</strong>. Skenario rasional (jual A Rp8 jt, pegang B penuh): A 6→4,3 + B 28→36 = <strong>Rp40,3 jt</strong>. <strong>Selisih: Rp4,6 juta</strong> — harga satu keputusan bias.</p>
        <p><strong>Intuisi:</strong> <em>&ldquo;harga belimu adalah sejarah, bukan strategi.&rdquo;</em> Setiap hari portofoliomu = <strong>keputusan baru</strong>: &ldquo;apakah aku <em>membeli</em> komposisi ini hari ini?&rdquo; Jika tidak — ubah. Pajak 0,1% atas penjualan (E15) jauh lebih murah dari Rp4,6 juta bias.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> gabungkan E16 + behavioral: pasar <em>cukup efisien</em> sehingga edge informasimu kecil, <strong>dan</strong> otakmu bias sehingga ekseksimu buruk — <em>kombinasi mematikan</em> bagi stock-picker aktif. Solusi yang didukung data: <strong>ETF indeks murah (netralisir efisiensi) + aturan otomatis (netralisir bias)</strong>. &ldquo;Kecerdasan&rdquo; investasimu bukan di memilih saham — melainkan di <strong>merancang sistem yang kebal terhadap dirimu sendiri</strong>.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Musuh Terbesar (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. EMH bentuk semi-kuat mengklaim…"
        options={[
          "Analisis teknikal pasti berhasil",
          "Semua info PUBLIK sudah tercermin di harga — analisis fundamental tidak memberi keunggulan sistematis",
          "Insider tidak bisa untung",
          "Pasar tidak pernah crash",
        ]}
        correct={1}
        explanation="Benar: semi-kuat = historis + publik. Bentuk kuat (termasuk info privat) terbukti salah — insider trading memang menguntungkan, makanya dilarang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Investor cepat take profit tapi membiarkan rugi membesar. Bias apa?"
        options={[
          "Overconfidence",
          "Loss aversion — takut risiko saat untung, nekat saat rugi",
          "Herding",
          "Anchoring",
        ]}
        correct={1}
        explanation="Benar: loss aversion (Prospect Theory). Rugi Rp1 terasa ~2× lebih sakit — makanya orang 'tunggu balik' dan memotong untung terlalu cepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Saham turun 40% dari harga belimu. Respons bebas anchoring?"
        options={[
          "'Tunggu balik modal dulu'",
          "Evaluasi zero-based: apakah akan BELI di harga sekarang? Jika tidak, jual — harga beli = sunk cost",
          "Beli lagi agar rata-rata turun",
          "Lupakan saja",
        ]}
        correct={1}
        explanation="Benar: harga beli tidak relevan untuk keputusan kini. 'Balik modal' = anchoring. Keputusan dari harga kini + prospek + opportunity cost."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Backtest hanya memakai saham yang masih tercatat hari ini. Dosanya?"
        options={[
          "Look-ahead bias",
          "Survivorship bias — yang bangkrut hilang dari data, return terlihat lebih indah",
          "Overfitting",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: survivorship. Database jujur mencakup saham delisting/bangkrut. Tanpa itu, backtest = 'sejarah para pemenang'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dari 1.000 strategi yang dicoba, 1 terlihat hebat di backtest. Ini…"
        options={[
          "Bukti strategi hebat",
          "Data snooping — kebetulan statistik dari multiple testing; wajib uji out-of-sample",
          "Overfitting",
          "Look-ahead bias",
        ]}
        correct={1}
        explanation="Benar: snooping. Makin banyak dicoba, makin besar peluang 'temuan' palsu. Lihat Lab 2: data acak murni pun menghasilkan 'pemenang'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Backtest strategi frekuensi tinggi untung 30%/tahun TANPA memasukkan spread & fee. Masalahnya?"
        options={[
          "Tidak masalah — biaya kecil",
          "Biaya microstructure (spread + fee + slippage + pajak) bisa menghapus seluruh 'keuntungan' — wajib dimasukkan konservatif",
          "Strategi pasti tetap untung",
          "Fee tidak ada di Indonesia",
        ]}
        correct={1}
        explanation="Benar: microstructure memakan return, terutama frekuensi tinggi. Aturan: kurangi 0,5–1% per round-trip; jika masih untung, lanjutkan ke forward-test."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>EMH</strong>: lemah (teknikal mati) → semi-kuat (fundamental sulit) → kuat (terbukti salah). Pasar <em>cukup</em> efisien.</li>
          <li><strong>Empat bias mematikan</strong>: overconfidence, loss aversion, herding, anchoring. Obat = <strong>aturan tertulis</strong>.</li>
          <li><strong>Microstructure</strong>: spread + market impact + likuiditas semu = biaya nyata yang memakan strategi kertas.</li>
          <li><strong>Lima dosa backtest</strong>: look-ahead, survivorship, overfitting, biaya diabaikan, data snooping.</li>
          <li>Backtest sempurna = curigai. <strong>Forward-test</strong> di data tak tersentuh = ujian sesungguhnya.</li>
          <li>Musuh terbesarmu bukan pasar — <strong>otakmu sendiri</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e15-indonesia" className="btn btn-secondary btn-sm">← E15</Link>
        <Link href="/learn/e17-makro-siklus" className="btn btn-primary btn-sm">Next: E17 →</Link>
      </div>
    </div>
  );
}
