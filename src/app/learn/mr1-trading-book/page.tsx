"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


// PRNG deterministik agar chart konsisten antar render
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function MR1Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Simulasi P&L harian: trading book (volatile, fat tail) vs banking book (akrual halus)
  const r = rng(42);
  const days = Array.from({ length: 60 }, (_, i) => i + 1);
  const pnlTrading = days.map(() => {
    const u = (r() + r() + r() + r() - 2) * 8; // ~normal, sd ~4.6
    const shock = r() < 0.05 ? (r() < 0.5 ? -1 : 1) * (12 + r() * 10) : 0; // fat tail
    return +(u + shock).toFixed(1);
  });
  const pnlBanking = days.map((_, i) => +(1.2 + Math.sin(i / 9) * 0.4 + (r() - 0.5) * 0.6).toFixed(1));

  const pnlData = [
    { x: days, y: pnlTrading, type: "scatter", mode: "lines", name: "Trading book", line: { color: "#e8a838", width: 2 } },
    { x: days, y: pnlBanking, type: "scatter", mode: "lines", name: "Banking book (akrual)", line: { color: "#2a7de1", width: 2 } },
  ];

  const lab1Code = String.raw`# Sensitivitas = seberapa besar nilai berubah jika faktor risiko bergerak
# Contoh: obligasi 10 tahun, kupon 7%, nominal 1 miliar, yield 7%
# Kita hitung perubahan harga jika yield naik 1 bp (0.01%) -> inilah DV01

nominal = 1_000_000_000
kupon = 0.07
y0 = 0.07
n = 10

def harga_obligasi(y):
    # harga = PV kupon + PV nominal
    pv = sum((nominal * kupon) / (1 + y) ** t for t in range(1, n + 1))
    pv += nominal / (1 + y) ** n
    return pv

p0 = harga_obligasi(y0)
p1 = harga_obligasi(y0 + 0.0001)  # yield +1 bp
dv01 = p0 - p1  # positif: harga turun saat yield naik

print(f"Harga awal      : Rp {p0:,.0f}")
print(f"Harga (+1 bp)   : Rp {p1:,.0f}")
print(f"DV01            : Rp {dv01:,.0f}  <- sensitivitas thd suku bunga")
print(f"Artinya: tiap yield naik 1 bp, bank rugi Rp {dv01:,.0f}")

# Coba: ubah kupon jadi 0.05 atau tenor n jadi 5, lalu jalankan ulang.
# Perhatikan: tenor lebih panjang -> DV01 lebih besar (lebih sensitif).`;

  const lab2Code = String.raw`# P&L Explain: dekomposisi P&L harian menjadi kontribusi tiap faktor risiko
# Rumus: dV ~ S1*df1 + S2*df2 + ...  (aproksimasi orde-1)
# Data: sensitivitas desk + pergerakan faktor kemarin

# Sensitivitas (dalam Rp per unit pergerakan faktor)
sens = {
    "Suku bunga (DV01 x100bp)": -850_000_000,   # Rp -850 jt per +100 bp
    "FX USD/IDR (per Rp100)":    120_000_000,   # Rp +120 jt per +Rp100
    "Ekuitas (delta x1%)":       300_000_000,   # Rp +300 jt per +1%
    "Credit spread (per +10bp)": -200_000_000,  # Rp -200 jt per +10 bp
}
# Pergerakan faktor kemarin (dalam unit yang sama)
move = {
    "Suku bunga (DV01 x100bp)": 0.35,   # yield naik 35 bp
    "FX USD/IDR (per Rp100)":   1.5,    # rupiah melemah Rp150
    "Ekuitas (delta x1%)":       -0.8,   # IHSG turun 0.8%
    "Credit spread (per +10bp)": 2.0,    # spread melebar 20 bp
}

print("P&L Explain (aproksimasi orde-1):")
print("-" * 52)
total = 0
for k in sens:
    kontribusi = sens[k] * move[k]
    total += kontribusi
    print(f"{k:32s} Rp {kontribusi:>12,.0f}")
print("-" * 52)
print(f"{'Total prediksi':32s} Rp {total:>12,.0f}")

pnl_aktual = -510_000_000  # misal P&L aktual kemarin
print(f"{'P&L aktual':32s} Rp {pnl_aktual:>12,.0f}")
print(f"{'Unexplained':32s} Rp {pnl_aktual - total:>12,.0f}")
print()
print("Unexplained besar? -> ada faktor yang belum dimodelkan,")
print("atau aproksimasi linear tidak cukup (butuh orde-2: gamma/convexity).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">MR1 — Market Risk Analytics</span>
        <h1 className="display-title">Trading Book vs Banking Book:<br />Satu Klasifikasi, Beda Nasib Modal</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Obligasi yang Pindah Kamar</a></li>
          <li><a href="#book">Trading Book vs Banking Book</a></li>
          <li><a href="#faktor">Faktor Risiko: Lima Arah Angin Pasar</a></li>
          <li><a href="#sens">Sensitivitas: Bahasa Umum Semua Risiko Pasar</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung DV01 Obligasi Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: P&amp;L Explain — Bedah P&amp;L Harian</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Klasifikasi &amp; Pengukuran</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Ketika Boundary Disalahgunakan — Pelajaran 2008</a></li>
          <li><a href="#case">📋 Mini-Case: Reklasifikasi yang Mengguncang Modal</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan trading book vs banking book — termasuk kriteria batas (boundary) yang dipakai regulator, bukan sekadar &ldquo;niat&rdquo;.</li>
          <li>Mengidentifikasi lima faktor risiko pasar utama dan memetakan tiap posisi ke faktornya.</li>
          <li>Menghitung sensitivitas orde-1 (contoh: DV01) dari definisi <Tex math={String.raw`S = \partial V / \partial f`} /> dan menafsirkan angkanya dalam rupiah.</li>
          <li>Menyusun P&amp;L explain sederhana: memecah P&amp;L harian menjadi kontribusi tiap faktor risiko.</li>
          <li>Menilai kapan suatu posisi butuh pengukuran risiko pasar harian vs akrual — dan kenapa salah klasifikasi berakibat ke modal.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Obligasi yang Pindah Kamar</h2>
      <div className="story">
        <p>Bank Nusantara memegang obligasi korporasi Rp500 miliar. Selama ini obligasi itu dicatat di <strong>banking book</strong> — diniatkan dipegang sampai jatuh tempo, nilainya di buku stabil, P&amp;L tenang seperti air danau. Lalu datang direktur treasury baru: <em>&ldquo;Obligasi ini likuid, kita bisa jual kapan saja kalau harga bagus. Pindahkan ke trading book.&rdquo;</em></p>
        <p>Sekali pindah kamar, segalanya berubah. Obligasi itu kini dinilai <strong>mark-to-market setiap hari</strong>. P&amp;L berayun Rp±8 miliar per hari. Yang lebih mengejutkan: <strong>kebutuhan modal bank melonjak</strong>, karena trading book wajib dihitung VaR-nya dan dikenai capital charge risiko pasar — sementara di banking book ia hanya makan capital charge risiko kredit yang jauh lebih kecil.</p>
        <p>Twist-nya: keputusan itu <strong>tidak bisa seenaknya dibolak-balik</strong>. Regulator (Basel) menetapkan boundary ketat antara trading dan banking book — ada daftar instrumen yang <em>wajib</em> masuk trading book, ada yang <em>dilarang</em>, dan reklasifikasi butuh persetujuan. Klasifikasi bukan soal niat sesaat; ia menentukan <strong>cara ukur, cara lapor, dan berapa modal yang harus disiapkan</strong>.</p>
        <p>Lesson ini membangun fondasinya: di mana posisi dicatat, apa yang menggerakkan nilainya, dan bagaimana mengukur kepekaannya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="book">Trading Book vs Banking Book — Dua Kamar, Dua Aturan Main</h2>
      <p><strong>Definisi.</strong> Bank membagi posisinya menjadi dua &ldquo;kamar&rdquo; akuntansi dan regulasi:</p>
      <ul>
        <li><strong>Trading book:</strong> posisi yang dipegang untuk <strong>diperdagangkan jangka pendek</strong> — mengambil untung dari pergerakan harga, market-making, atau lindung nilai (hedging) posisi trading lain. Dinilai <strong>mark-to-market</strong> (harga pasar harian), P&amp;L diakui setiap hari.</li>
        <li><strong>Banking book:</strong> posisi yang dipegang untuk <strong>jangka panjang / sampai jatuh tempo</strong> — kredit yang disalurkan, obligasi hold-to-maturity. Umumnya dinilai <strong>amortised cost</strong> (biaya perolehan diamortisasi), P&amp;L mengalir halus via akrual bunga.</li>
      </ul>

      <p><strong>Kenapa pembedanya penting?</strong> Karena tiga hal ikut berubah:</p>
      <ol>
        <li><strong>Cara ukur:</strong> trading book → mark-to-market harian + VaR/ES harian. Banking book → akrual + analisis sensitivitas berkala (IRRBB — dibahas di MR10).</li>
        <li><strong>Modal:</strong> trading book kena <em>market risk capital charge</em> (FRTB — MR16); banking book kena <em>credit risk capital charge</em>.</li>
        <li><strong>Perilaku P&amp;L:</strong> trading book berayun liar; banking book tenang — tapi ketenangan itu bisa menipu (risiko tetap ada, hanya tidak terlihat harian).</li>
      </ol>

      <PlotlyChart
        data={pnlData}
        title="Pola P&L Harian: Trading Book vs Banking Book (simulasi 60 hari)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "P&L harian (Rp juta)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = hari ke-, vertikal = P&amp;L harian dalam Rp juta. Garis kuning = trading book (mark-to-market), garis biru = banking book (akrual).</p>
        <p><strong>Interpretasi:</strong> trading book berayun ±10 juta dengan sesekali <strong>lonjakan ekstrem</strong> (hari ~20 dan ~50) — itulah <em>fat tail</em> yang membuat VaR diperlukan. Banking book nyaris datar di sekitar +1 juta/hari (akrual bunga). <strong>Jebakan:</strong> garis biru yang tenang bukan berarti tanpa risiko — risiko suku bunganya (IRRBB) hanya belum &ldquo;muncul&rdquo; di P&amp;L harian.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Banking book tidak punya risiko pasar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> banking book bebas dari <em>fluktuasi harga harian</em>, tapi tetap punya <strong>risiko suku bunga struktural (IRRBB)</strong> — misal kredit fixed-rate 10 tahun didanai deposito 1 bulan: kalau suku bunga naik, margin (NII) tergerus dan nilai ekonomis (EVE) turun. Risikonya nyata, hanya diukur dengan metrik berbeda (MR10). &ldquo;Tidak terlihat di P&amp;L harian&rdquo; ≠ &ldquo;tidak ada&rdquo;.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> boundary trading/banking book adalah <strong>keputusan regulasi</strong>, bukan sekadar niat trader. Basel menetapkan <em>presumptive list</em>: misal instrumen ekuitas listed dan posisi sekuritisasi tertentu <strong>wajib</strong> trading book; ada pula yang <strong>dilarang</strong> masuk trading book. Reklasifikasi butuh alasan kuat + persetujuan. Kalau kamu analis dan melihat posisi &ldquo;aneh&rdquo; di salah satu book — pertanyakan klasifikasinya dulu sebelum percaya angkanya.</p>
      </div>

      <p><strong>Kepribadian dua book:</strong> trading book itu seperti <em>pedagang harian di pasar</em> — hidup dari ayunan harga, tidur dengan grafik. Banking book seperti <em>pemilik kos</em> — penghasilan bulanan stabil dari sewa (bunga), tapi kalau harga properti anjlok struktural, kekayaannya tetap tergerus diam-diam.</p>

      <h2 id="faktor">Faktor Risiko: Lima Arah Angin Pasar</h2>
      <p><strong>Definisi.</strong> <strong>Faktor risiko</strong> adalah variabel pasar yang pergerakannya mengubah nilai portofolio: suku bunga, nilai tukar, harga ekuitas, credit spread, harga komoditas. Setiap posisi bisa dipetakan ke satu atau lebih faktor.</p>
      <p><strong>Contoh pemetaan:</strong></p>
      <ul>
        <li>Obligasi fixed-rate → <strong>suku bunga</strong> + <strong>credit spread</strong> penerbit</li>
        <li>Saham → <strong>harga ekuitas</strong> (indeks/sektor)</li>
        <li>Kredit USD ke eksportir → <strong>FX USD/IDR</strong> + suku bunga</li>
        <li>Opsi saham → ekuitas + <strong>volatilitas implisit</strong> (faktor orde-2, dibahas MR11)</li>
      </ul>
      <p>Kenapa dipetakan? Karena risiko pasar tidak diukur per posisi satu-satu — melainkan <strong>per faktor, diagregasi</strong>. Dua posisi berbeda yang sensitif ke faktor yang sama bisa saling menghapus (hedge) atau justru menumpuk (konsentrasi). Tanpa pemetaan faktor, kamu buta terhadap keduanya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pikirkan faktor risiko seperti <strong>arah angin</strong>, dan posisi seperti <strong>layar kapal</strong>. Sensitivitas = luas layar yang menghadap tiap arah angin. Kapal (portofolio) yang layarnya menghadap semua arah angin dengan seimbang tidak akan oleng ke satu arah — itulah diversifikasi. Tapi kalau semua layar menghadap utara dan angin utara bertiup kencang — itulah konsentrasi risiko.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Risiko tiap posisi bisa dijumlahkan langsung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> risiko diagregasi <strong>per faktor dengan memperhitungkan korelasi</strong>, bukan dijumlah mentah. Posisi A rugi Rp10 M saat suku bunga naik dan posisi B untung Rp10 M saat suku bunga naik → risiko bersihnya ~nol (hedge alami), bukan Rp20 M. Penjumlahan mentah mengabaikan efek saling menghapus — dan justru di sinilah banyak kesalahan limit terjadi.</p>
      </div>

      <h2 id="sens">Sensitivitas: Bahasa Umum Semua Risiko Pasar</h2>
      <p><strong>Definisi.</strong> <strong>Sensitivitas</strong> mengukur seberapa besar nilai posisi <Tex math={String.raw`V`} /> berubah jika faktor risiko <Tex math={String.raw`f`} /> bergerak sedikit:</p>
      <Tex math={String.raw`S = \frac{\partial V}{\partial f} \approx \frac{\Delta V}{\Delta f}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`V`} />: nilai posisi/portofolio (dalam rupiah)</li>
        <li><Tex math={String.raw`f`} />: faktor risiko (misal yield obligasi, kurs USD/IDR)</li>
        <li><Tex math={String.raw`S`} />: sensitivitas — &ldquo;tiap faktor bergerak 1 unit, nilai berubah S rupiah&rdquo;</li>
        <li><Tex math={String.raw`\partial V / \partial f`} />: turunan parsial — kemiringan kurva nilai terhadap faktor, faktor lain dianggap tetap</li>
      </ul>
      <p><strong>Contoh konkret (DV01):</strong> obligasi Rp1 miliar, tenor 10 tahun, kupon 7%. Jika yield naik 1 bp (0,01%), harga turun ≈ Rp700 ribu. Maka <strong>DV01 = Rp700 ribu per bp</strong> — inilah sensitivitas suku bunga obligasi itu. (Hitung sendiri di Lab 1.)</p>

      <p><strong>P&amp;L explain — dekomposisi orde-1.</strong> Dengan sensitivitas tiap faktor, P&amp;L harian bisa &ldquo;dijelaskan&rdquo;:</p>
      <Tex math={String.raw`\Delta V \approx \sum_{i} S_i \cdot \Delta f_i`} block />
      <p><strong>Artinya:</strong> perubahan nilai ≈ jumlah dari (sensitivitas ke faktor-i × pergerakan faktor-i). Sisa yang tidak dijelaskan (&ldquo;unexplained P&amp;L&rdquo;) adalah sinyal: ada faktor yang belum dimodelkan, atau hubungan nilai-faktor tidak linear (butuh orde-2: gamma/convexity — MR4, MR8, MR11).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Desk punya: DV01 portofolio = <strong>−Rp850 juta per +100 bp</strong>; delta FX = <strong>+Rp120 juta per +Rp100</strong> (USD/IDR melemah).</p>
        <p><strong>Langkah 1</strong> — catat pergerakan kemarin: yield +35 bp; USD/IDR melemah Rp150.</p>
        <p><strong>Langkah 2</strong> — kalikan: suku bunga → −850 jt × 0,35 = <strong>−Rp297,5 jt</strong>; FX → +120 jt × 1,5 = <strong>+Rp180 jt</strong>.</p>
        <p><strong>Langkah 3</strong> — jumlahkan: prediksi P&amp;L ≈ −Rp117,5 jt. Jika P&amp;L aktual −Rp400 jt, maka <strong>unexplained = −Rp282,5 jt</strong> — wajib diinvestigasi (mungkin credit spread melebar yang belum dimasukkan).</p>
      </details>

      <p><strong>Kapan memakai sensitivitas:</strong> selalu — ini fondasi limit harian (MR17), input VaR parametrik (MR3), dan SBM di FRTB (MR16). Sensitivitas orde-1 cukup untuk pergerakan kecil; untuk pergerakan besar atau instrumen non-linear (opsi), butuh orde-2.</p>
      <p><strong>Kapan TIDAK cukup:</strong> saat hubungan nilai-faktor melengkung tajam (opsi mendekati expiry, obligasi dengan embedded option) — aproksimasi linear akan sistematis salah arah. Di situlah delta-gamma (MR4) dan convexity (MR8) masuk.</p>

      {/* LABS */}
      <h2 id="lab1">🔬 Lab 1: Hitung DV01 Obligasi Sendiri</h2>
      <p>Ubah kupon, tenor, atau yield awal — lalu lihat bagaimana DV01 (sensitivitas) berubah. Tanya: obligasi seperti apa yang paling sensitif terhadap suku bunga?</p>
      <PyodideLab
        title="Lab 1 — DV01 dari Definisi"
        hint="Coba: tenor n = 10 → 3 → 30. Atau kupon 0.07 → 0.00 (zero-coupon). Obligasi mana yang DV01-nya terbesar? Kenapa?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: P&amp;L Explain — Bedah P&amp;L Harian</h2>
      <p>Ubah pergerakan faktor (dict <code className="inline">move</code>) sesuai skenario versimu: misal yield +100 bp dan IHSG −3% di hari yang sama. Berapa prediksi P&amp;L? Faktor mana dominan?</p>
      <PyodideLab
        title="Lab 2 — Dekomposisi P&L per Faktor Risiko"
        hint="Coba skenario 'krisis mini': suku bunga +1.0 (100bp), ekuitas -3.0, spread +5.0. Lalu bandingkan kontribusi tiap faktor — faktor mana yang paling menyakitkan desk ini?"
        defaultCode={lab2Code}
      />

      {/* PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Klasifikasi &amp; Pengukuran</h2>

      <div className="decision-card">
        <h3>1. Posisi dipegang untuk trading jangka pendek / market-making → <strong>Trading book</strong></h3>
        <p><strong>Kondisi:</strong> ada niat jual dalam waktu dekat, atau posisi lindung nilai atas posisi trading. Contoh: obligasi yang aktif ditransaksikan desk, saham untuk market-making.</p>
        <p><strong>Konsekuensi:</strong> mark-to-market harian, VaR/ES harian, market risk capital charge. P&amp;L berayun — siapkan limit (MR17).</p>
      </div>

      <div className="decision-card">
        <h3>2. Posisi dipegang sampai jatuh tempo / untuk yield → <strong>Banking book</strong></h3>
        <p><strong>Kondisi:</strong> kredit yang disalurkan, obligasi hold-to-maturity. Tidak ada niat trading.</p>
        <p><strong>Konsekuensi:</strong> amortised cost, P&amp;L akrual halus. Tapi <strong>wajib</strong> ukur IRRBB (EVE &amp; NII, MR10) — ketenangan akrual bukan izin untuk buta risiko.</p>
      </div>

      <div className="decision-card">
        <h3>3. Instrumen di daftar wajib regulator → <strong>Ikuti presumptive list</strong></h3>
        <p><strong>Kondisi:</strong> ekuitas listed, sekuritisasi tertentu, dan instrumen yang secara eksplisit diwajibkan masuk trading book oleh Basel/FRTB.</p>
        <p><strong>Konsekuensi:</strong> tidak ada diskresi — niat manajemen tidak relevan. Cek daftar regulasi dulu sebelum klasifikasi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Mau reklasifikasi antar book → <strong>Butuh justifikasi + persetujuan</strong></h3>
        <p><strong>Kondisi:</strong> perubahan strategi bisnis yang genuine (bukan untuk mempercantik angka modal/P&amp;L).</p>
        <p><strong>Konsekuensi:</strong> dokumentasikan alasan, dapatkan persetujuan (manajemen + regulator bila disyaratkan), dan pahami dampaknya ke modal <em>sebelum</em> pindah — seperti cerita Bank Nusantara di awal.</p>
      </div>

      <div className="decision-card">
        <h3>5. Mengukur risiko posisi apa pun → <strong>Petakan ke faktor dulu, baru ukur</strong></h3>
        <p><strong>Kondisi:</strong> posisi baru masuk portofolio (produk apa pun).</p>
        <p><strong>Konsekuensi:</strong> identifikasi faktor risikonya → hitung sensitivitas per faktor → agregasikan dengan korelasi. Tanpa pemetaan faktor, angka risiko tidak bisa dibandingkan antar desk.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tanya dulu:</strong> ini trading book atau banking book? (menentukan cara ukur &amp; modal)</li>
          <li><strong>Petakan:</strong> faktor risiko apa yang menggerakkan posisi ini?</li>
          <li><strong>Ukur:</strong> sensitivitas per faktor dalam rupiah per unit — bukan sekadar &ldquo;besar/kecil&rdquo;.</li>
          <li><strong>Agregatkan dengan korelasi</strong> — jangan jumlah mentah.</li>
        </ol>
      </div>

      {/* MINI-CASE */}
      <h2 id="dalam">🔬 Pendalaman: Ketika Boundary Disalahgunakan — Pelajaran dari Krisis 2008</h2>
      <p>Batas trading book vs banking book terdengar administratif — sampai kamu melihat apa yang terjadi ketika bank menggunakannya untuk <strong>menyembunyikan risiko</strong>. Bagian ini membedah tiga hal: (1) insentif memindahkan posisi antar book, (2) contoh angka bagaimana &ldquo;pindah kamar&rdquo; mengubah modal dan P&amp;L, dan (3) bagaimana Basel merespons setelah 2008.</p>

      <h3>Mengapa bank tergoda &ldquo;pindah kamar&rdquo;?</h3>
      <p>Modal yang wajib disiapkan untuk trading book dan banking book dihitung dengan <strong>aturan berbeda</strong>. Sebelum krisis 2008, aturan modal untuk <em>market risk</em> (trading book) secara umum <strong>lebih ringan</strong> daripada aturan modal <em>credit risk</em> (banking book) untuk aset berisiko sejenis. Akibatnya muncul insentif: pindahkan aset berisiko kredit — terutama <strong>sekuritisasi</strong> (CDO, MBS) — ke trading book, supaya kebutuhan modalnya turun. Di atas kertas bank terlihat lebih efisien memodali; pada kenyataannya risiko kreditnya tidak berkurang satu rupiah pun.</p>
      <p>Masalahnya berlipat: posisi sekuritisasi itu <strong>tidak likuid</strong>. Mark-to-market harian mensyaratkan ada harga pasar yang bisa diobservasi. Ketika pasar sekuritisasi membeku pada 2007–2008, &ldquo;harga pasar&rdquo; tidak ada — valuasi berubah menjadi <strong>mark-to-model</strong> (tebakan model), dan VaR yang dihitung dari data masa tenang menjadi tidak relevan. Bank memegang risiko yang tidak bisa dijual, diukur dengan model yang tidak bisa dipercaya, dengan modal yang dihitung seolah risikonya ringan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau sudah mark-to-market, risikonya pasti ketahuan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> mark-to-market hanya sejujur harga pasarnya. Untuk posisi illiquid, tidak ada harga pasar — yang ada hanya <em>model</em> bank itu sendiri. Krisis 2008 menunjukkan bank bisa melaporkan nilai &ldquo;wajar&rdquo; untuk aset yang sebenarnya tidak laku dijual. Itulah alasan FRTB (MR16) memperkenalkan konsep <strong>modellability</strong>: faktor risiko yang tidak punya cukup data harga observasi kena <em>capital add-on</em> (NMRF), bukan dihitung VaR seenaknya.</p>
      </div>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: bagaimana &ldquo;pindah kamar&rdquo; mengubah angka modal (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Bank memegang portofolio sekuritisasi senilai <strong>Rp2 triliun</strong>. Dua perlakuan:</p>
        <p><strong>Langkah 1 — di banking book (credit risk):</strong> dengan bobot risiko 100% dan rasio modal minimum 8%, kebutuhan modal = 8% × Rp2 triliun = <strong>Rp160 miliar</strong>. P&amp;L mengalir via akrual; penurunan nilai pasar tidak langsung memukul laporan laba rugi.</p>
        <p><strong>Langkah 2 — di trading book (market risk, aturan pra-2008):</strong> kebutuhan modal dihitung dari VaR 10-hari. Dengan volatilitas masa tenang, VaR ≈ 1,5% × Rp2 triliun = Rp30 miliar; modal ≈ 3× VaR (multiplier Basel) = <strong>Rp90 miliar</strong> — hampir <strong>separuh</strong> dari perlakuan banking book.</p>
        <p><strong>Langkah 3 — bandingkan insentifnya:</strong> bank &ldquo;menghemat&rdquo; Rp70 miliar modal hanya dengan memindahkan klasifikasi — tanpa menjual satu aset pun, tanpa mengurangi risiko sesungguhnya. Inilah <strong>regulatory arbitrage</strong>: keuntungan regulasi tanpa pengurangan risiko ekonomi.</p>
        <p><strong>Langkah 4 — yang terjadi saat krisis:</strong> harga sekuritisasi jatuh 40%. Kerugian ekonomi = Rp800 miliar — <strong>hampir 9×</strong> modal Rp90 miliar yang disiapkan. Bank yang &ldquo;efisien modal&rdquo; ternyata kekurangan modal justru saat paling dibutuhkan. Pelajaran: <strong>modal yang dihitung dari asumsi salah lebih berbahaya daripada tidak punya angka sama sekali</strong>, karena ia memberi rasa aman palsu.</p>
        <p><strong>Angka ini artinya:</strong> klasifikasi book bukan sekadar label akuntansi — ia menentukan <em>berapa banyak penyangga yang kamu bawa ke medan perang</em>. Salah kamar = salah hitung penyangga = bangkrut saat perang datang.</p>
      </details>

      <h3>Respons regulasi: dari Basel 2.5 ke FRTB</h3>
      <p>Krisis 2008 memaksa regulator menutup celah ini bertahap:</p>
      <ul>
        <li><strong>Basel 2.5 (2009):</strong> memperkenalkan <strong>Stressed VaR</strong> — VaR dihitung ulang memakai data periode krisis 12 bulan, lalu dijumlahkan ke VaR normal. Bank tidak bisa lagi bersembunyi di balik data masa tenang. Juga ada <em>incremental risk charge</em> untuk risiko default/migrasi di trading book.</li>
        <li><strong>FRTB (2016, implementasi bertahap):</strong> merombak total — boundary trading/banking book <strong>diperketat</strong> dengan daftar instrumen yang wajib masuk trading book dan yang dilarang; VaR diganti <strong>Expected Shortfall 97,5%</strong> (MR5, MR16); faktor risiko illiquid kena <em>add-on</em>; desk yang mau pakai model internal harus lolos <strong>P&amp;L attribution test</strong> dan <strong>backtesting</strong> (MR6).</li>
      </ul>
      <p>Intuisi di balik semua ini sederhana: <strong>aturan pengukuran harus mengikuti sifat ekonomis risiko, bukan label administratifnya</strong>. Kalau sebuah posisi secara ekonomi berperilaku seperti risiko kredit jangka panjang yang illiquid, maka modalnya harus mencerminkan itu — apapun kamarnya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci untuk analis:</strong> setiap kali kamu melihat metrik risiko sebuah desk, tanyakan tiga hal: <strong>(1)</strong> di book mana posisi ini dicatat — dan apakah klasifikasinya masuk akal secara ekonomi? <strong>(2)</strong> apakah ada harga pasar yang benar-benar diobservasi, atau ini mark-to-model? <strong>(3)</strong> apakah modal/limit dihitung dari periode data yang mencakup masa stres? Tiga pertanyaan ini saja sudah cukup untuk menangkap sebagian besar &ldquo;kecelakaan&rdquo; 2008 sebelum terjadi.</p>
      </div>

      <p><strong>Kaitan dengan COVID crash (Maret 2020):</strong> pola yang sama berulang dalam bentuk berbeda. Likuiditas pasar obligasi korporat menguap dalam hitungan hari; spread melebar 3–4×; posisi trading book yang &ldquo;likuid&rdquo; tiba-tiba tidak bisa dijual tanpa diskon besar. Bank-bank dengan kerangka FRTB yang lebih matang (likuiditas horizon per faktor risiko, MR16) menyerap guncangan lebih baik — bukan karena mereka meramal COVID, tapi karena <strong>aturan mainnya sudah mengasumsikan likuiditas bisa hilang</strong>.</p>

      <details className="worked">
        <summary>📐 Bedah angka: P&amp;L explain multi-faktor — dari angka ke keputusan (klik untuk buka)</summary>
        <p><strong>Desk multi-aset, P&amp;L kemarin −Rp850 jt.</strong> Sensitivitas: DV01 −Rp400 jt/bp... (dalam per 100 bp: −Rp40 M), delta saham +Rp25 M/%, sensitivitas spread −Rp30 M/100bp, vega +Rp8 M/vol-point.</p>
        <p><strong>Pergerakan kemarin:</strong> yield +40 bp, IHSG −2%, spread +50 bp, vol +3 poin.</p>
        <p><strong>Dekomposisi:</strong> yield: (−40 M)×0,40 = <strong>−Rp16 M</strong>... koreksi satuan: DV01 −Rp400 jt per bp → −400 jt × 40 = <strong>−Rp16 M</strong>. Saham: 25 M × (−2) = <strong>−Rp50 M</strong>. Spread: −30 M × 0,5 = <strong>−Rp15 M</strong>. Vega: 8 M × 3 = <strong>+Rp24 M</strong>. Total prediksi = <strong>−Rp57 M</strong>... vs aktual −Rp850 jt?? <strong>Unexplained = −Rp793 jt</strong> — MASIF.</p>
        <p><strong>Investigasi (yang benar):</strong> unexplained 14× prediksi = <strong>bukan noise</strong>. Kemungkinan: (a) <strong>event idiosinkratik</strong> — satu obligasi gagal bayar / downgrade (periksa P&amp;L per posisi!); (b) <strong>jump intraday</strong> yang tidak tertangkap sensitivitas harian; (c) <strong>kesalahan booking</strong> besar. Hasil investigasi (ilustrasi): satu obligasi BUMN di-downgrade → spread-nya melebar 400 bp sendirian (bukan 50 bp indeks) → −Rp120 M... masih kurang. Ternyata juga ada <strong>cut-loss paksa</strong> Rp650 M (likuidasi di pasar tipis — MR13!).</p>
        <p><strong>Pelajaran:</strong> P&amp;L explain bukan soal &ldquo;prediksi akurat&rdquo; — ia adalah <strong>mesin pendeteksi anomali</strong>. Unexplained besar = <em>undangan investigasi</em>, bukan kegagalan model. Desk yang baik merayakan unexplained besar — karena ia baru saja menemukan sesuatu yang tidak diketahui kemarin.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <p>Tiga soal untuk menguji pemahamanmu sebelum lanjut. Kerjakan dulu, baru buka pembahasannya.</p>
      <details className="worked">
        <summary>Soal 1 — Bank memegang obligasi korporat Rp3 T yang <strong>tidak diperdagangkan 6 bulan terakhir</strong> (tidak ada harga pasar), dicatat di trading book dengan mark-to-model. Apa tiga masalahnya? (klik untuk pembahasan)</summary>
        <p><strong>(1) Klasifikasi meragukan:</strong> trading book mensyaratkan <em>niat diperdagangkan jangka pendek</em> + kemampuan mark-to-market. Tidak ada perdagangan 6 bulan → niatnya patut dipertanyakan; kemungkinan regulatory arbitrage (modal lebih ringan).</p>
        <p><strong>(2) Valuasi fiktif:</strong> tanpa harga observasi, &ldquo;mark-to-market&rdquo; = mark-to-model bank sendiri. VaR/ES dari posisi ini mencerminkan <em>asumsi model</em>, bukan risiko pasar. Di bawah FRTB, faktor risikonya <strong>non-modellable</strong> → kena NMRF add-on.</p>
        <p><strong>(3) Likuiditas ilusi:</strong> VaR 10-hari mengasumsikan bisa keluar dalam 10 hari — padahal 6 bulan tidak ada yang mau beli. Liquidity horizon (MR16) yang benar mungkin 120 hari, bukan 10.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Desk melaporkan P&amp;L explain: prediksi −Rp117,5 jt, aktual −Rp400 jt (unexplained −Rp282,5 jt). Tuliskan 3 hipotesis penyebab + cara memverifikasi masing-masing. (klik untuk pembahasan)</summary>
        <p><strong>Hipotesis A — faktor belum dimodelkan:</strong> misal credit spread melebar 20 bp dengan sensitivitas −Rp14 jt/bp → −Rp280 jt ≈ unexplained. Verifikasi: tambahkan faktor spread ke model, hitung ulang.</p>
        <p><strong>Hipotesis B — non-linearitas:</strong> pergerakan besar → orde-1 tidak cukup; gamma/convexity menyumbang. Verifikasi: hitung ulang dengan orde-2 (MR4/MR8).</p>
        <p><strong>Hipotesis C — data/sistem:</strong> harga input basi (stale price) atau booking salah tanggal. Verifikasi: IPV (MR17) — bandingkan mark dengan sumber independen.</p>
        <p>Urutkan investigasi dari yang termurah (C) ke termahal (B) — disiplin analis yang baik.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Mengapa Basel 2.5 memperkenalkan Stressed VaR? Jawab dalam 3 kalimat. (klik untuk pembahasan)</summary>
        <p>Karena VaR dari data masa tenang memberi modal yang terlalu kecil tepat sebelum krisis (pengalaman 2008). Stressed VaR memaksa bank menghitung VaR dengan data periode krisis dan <em>menjumlahkannya</em> ke VaR normal — sehingga modal tetap tinggi di masa tenang. Intinya: <strong>menabung saat cerah untuk bertahan saat badai</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Reklasifikasi yang Mengguncang Modal</h2>
      <div className="callout">
        <p>Bank Nusantara memegang obligasi korporasi <strong>Rp500 miliar</strong>, tenor 7 tahun, di banking book (amortised cost). Treasury mengusulkan pindah ke trading book agar &ldquo;fleksibel dijual&rdquo;. Data pendukung:</p>
        <ul>
          <li>DV01 portofolio obligasi: <strong>−Rp3,2 miliar per +100 bp</strong></li>
          <li>Volatilitas yield harian: <strong>8 bp</strong> (standar deviasi)</li>
          <li>Di banking book: capital charge risiko kredit ≈ <strong>Rp40 miliar</strong> (8% × ATMR)</li>
          <li>Di trading book: estimasi VaR 99%/10-hari ≈ <strong>Rp55 miliar</strong> → capital charge pasar bisa <strong>3–4× VaR</strong> (≈ Rp165–220 miliar, sebelum diversifikasi)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Hitung perkiraan P&amp;L harian 1-sigma dari posisi ini jika masuk trading book. (b) Apakah reklasifikasi &ldquo;gratis&rdquo;? (c) Apa yang harus dicek sebelum menyetujui?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Sensitivitas per 1 bp = Rp3,2 M / 100 = <strong>Rp32 juta/bp</strong>. Vol harian 8 bp → 1-sigma P&amp;L harian ≈ 32 jt × 8 = <strong>±Rp256 juta/hari</strong>. Dalam sebulan (±20 hari, acak) bisa ±Rp1,1 miliar — jauh dari &ldquo;tenang&rdquo;.</p>
          <p>(b) <strong>Tidak gratis.</strong> Capital charge melonjak dari ~Rp40 M ke ~Rp165–220 M (4–5× lipat). Fleksibilitas jual dibayar dengan modal yang jauh lebih besar + P&amp;L yang berayun + kewajiban pelaporan harian.</p>
          <p>(c) Cek: (1) apakah instrumen ini <em>boleh</em> pindah menurut boundary Basel — bukan sekadar mau; (2) apakah strategi trading-nya genuine (rencana jual konkret) atau hanya akal-akalan; (3) persetujuan formal + dokumentasi; (4) kesiapan infrastruktur pengukuran harian (VaR, limit, P&amp;L explain).</p>
        </details>
      </div>

      {/* QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bank memindahkan obligasi Rp500 M dari banking book ke trading book. Dampak PALING langsung ke pengukuran risiko?"
        options={[
          "Tidak ada — obligasinya sama",
          "Obligasi kini mark-to-market harian + wajib dihitung VaR/ES harian + kena market risk capital charge",
          "Risiko kreditnya hilang",
          "P&L menjadi selalu positif",
        ]}
        correct={1}
        explanation="Benar. Klasifikasi menentukan cara ukur: trading book = mark-to-market harian, VaR/ES harian, dan capital charge risiko pasar (yang biasanya jauh lebih besar dari charge kredit untuk posisi yang sama)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. DV01 portofolio = −Rp32 juta per +1 bp. Yield naik 25 bp. Estimasi perubahan nilai?"
        options={[
          "−Rp800 juta",
          "−Rp32 juta",
          "+Rp800 juta",
          "−Rp8 juta",
        ]}
        correct={0}
        explanation="Benar: ΔV ≈ S × Δf = −32 jt × 25 = −Rp800 juta. Tanda negatif = nilai turun saat yield naik (hubungan terbalik harga obligasi vs yield)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. P&L aktual −Rp400 jt, tapi P&L explain dari semua faktor hanya −Rp120 jt. Interpretasi tepat?"
        options={[
          "Model sudah sempurna, abaikan selisihnya",
          "Ada unexplained −Rp280 jt — selidiki: faktor belum dimodelkan, data salah, atau butuh orde-2 (non-linearitas)",
          "Sensitivitas pasti salah hitung, buang saja",
          "P&L aktual yang salah",
        ]}
        correct={1}
        explanation="Benar. Unexplained P&L besar adalah sinyal investigasi — bukan untuk diabaikan. Penyebab umum: faktor risiko yang belum dimasukkan (misal basis/liquidity), atau aproksimasi linear tidak cukup untuk pergerakan besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dua posisi: A rugi Rp10 M saat suku bunga naik, B untung Rp10 M saat suku bunga naik. Risiko suku bunga bersih?"
        options={[
          "Rp20 M (dijumlah)",
          "Rp10 M (diambil yang terbesar)",
          "≈ Rp0 — keduanya saling menghapus (hedge alami), risiko diukur per faktor dengan korelasi",
          "Tidak bisa dihitung",
        ]}
        correct={2}
        explanation="Benar. Risiko diagregasi per faktor dengan korelasi. A dan B bereaksi berlawanan terhadap faktor yang sama → netting alami. Menjumlah mentah (Rp20 M) melebih-lebihkan risiko."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Manakah pernyataan BENAR tentang boundary trading/banking book?"
        options={[
          "Sepenuhnya tergantung niat trader hari itu",
          "Regulator menetapkan daftar instrumen yang wajib/dilarang masuk trading book; reklasifikasi butuh justifikasi dan persetujuan",
          "Bank boleh memindahkan posisi setiap hari untuk optimasi modal",
          "Boundary hanya berlaku untuk bank besar",
        ]}
        correct={1}
        explanation="Benar. Basel menetapkan presumptive list (wajib trading book untuk instrumen tertentu) dan melarang regulatory arbitrage antar book. Pindah-pindah seenaknya untuk mempercantik modal adalah pelanggaran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Obligasi di banking book (amortised cost) menunjukkan P&L stabil. Apa yang TETAP harus diwaspadai?"
        options={[
          "Tidak ada — amortised cost berarti aman",
          "Risiko suku bunga struktural (IRRBB): kenaikan suku bunga menggerus NII dan nilai ekonomis (EVE) walau tidak terlihat di P&L harian",
          "Risiko ini otomatis hilang setelah 1 tahun",
          "Hanya risiko operasional",
        ]}
        correct={1}
        explanation="Benar. Ketenangan akrual menutupi IRRBB: mismatch repricing antara aset dan liabilitas. Inilah alasan MR10 (EVE & NII) ada — banking book diukur dengan metrik berbeda, bukan tidak diukur."
      />

      {/* RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Trading book</strong> = diniatkan dagang, mark-to-market harian, VaR/ES harian, market risk capital charge. <strong>Banking book</strong> = dipegang lama, amortised cost, P&amp;L akrual — tapi tetap punya IRRBB.</li>
          <li><strong>Boundary antar book</strong> diatur regulator (presumptive list); reklasifikasi butuh justifikasi + persetujuan — bukan alat optimasi modal.</li>
          <li><strong>Faktor risiko</strong> (suku bunga, FX, ekuitas, spread, komoditas) adalah &ldquo;arah angin&rdquo;; setiap posisi dipetakan ke faktornya sebelum diukur.</li>
          <li><strong>Sensitivitas</strong> <Tex math={String.raw`S = \partial V/\partial f`} /> adalah bahasa umum risiko pasar; contoh: DV01 = perubahan nilai per 1 bp.</li>
          <li><strong>P&amp;L explain:</strong> <Tex math={String.raw`\Delta V \approx \sum S_i \Delta f_i`} /> — unexplained besar = sinyal investigasi.</li>
          <li>Agregasi risiko <strong>per faktor dengan korelasi</strong>, jangan jumlah mentah.</li>
          <li>Kapan TIDAK cukup orde-1: pergerakan besar atau instrumen non-linear (opsi) → butuh orde-2 (MR4/MR8/MR11).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/mr2-volatilitas" className="btn btn-primary btn-sm">Next: MR2 →</Link>
      </div>
    </div>
  );
}
