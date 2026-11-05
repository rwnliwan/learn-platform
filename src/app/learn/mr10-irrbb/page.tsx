"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR10Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // EVE vs NII: sensitivitas terhadap parallel shock untuk bank contoh
  const shocks = [-300, -200, -100, 0, 100, 200, 300];
  // Bank: aset long (KPR 15Y), liab short (deposito 1Y) -> EVE turun saat rate naik; NII turun saat rate naik
  const dEVE = [14.2, 9.1, 4.4, 0, -4.1, -7.9, -11.2]; // % dari modal
  const dNII = [6.5, 4.2, 2.0, 0, -1.9, -3.7, -5.3]; // % dari NII tahunan

  const eveData = [
    { x: shocks, y: dEVE, type: "scatter", mode: "lines+markers", name: "ΔEVE (% modal)", line: { color: "#2a7de1", width: 2.5 } },
    { x: shocks, y: dNII, type: "scatter", mode: "lines+markers", name: "ΔNII (% NII)", line: { color: "#e8a838", width: 2.5 } },
  ];

  // Gap report: repricing gap per bucket
  const gapData = [
    {
      x: ["<1M", "1-3M", "3-6M", "6-12M", "1-3Y", "3-5Y", ">5Y"],
      y: [-120, -80, -40, 60, 150, 220, 380],
      type: "bar",
      name: "Repricing gap (Rp miliar)",
      marker: { color: ["#ef4444", "#ef4444", "#ef4444", "#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1"] },
    },
  ];

  const lab1Code = String.raw`# IRRBB: hitung EVE & NII sensitivity dari repricing gap sederhana.
# Neraca (Rp miliar):
#   Aset: KPR fixed 15Y Rp5.000 (repricing 15Y), Kredit floating Rp3.000 (repricing 3M)
#   Liabilitas: Deposito 1Y Rp4.500 (repricing 1Y), CASA Rp3.000 (repricing 1M, beta 0.3)

# --- 1) REPRICING GAP per bucket ---
buckets = ["1M", "3M", "1Y", "5Y", "15Y"]
rsa = {"1M": 0, "3M": 3000, "1Y": 0, "5Y": 0, "15Y": 5000}      # rate-sensitive assets
rsl = {"1M": 3000, "3M": 0, "1Y": 4500, "5Y": 0, "15Y": 0}      # rate-sensitive liab.
print("Bucket |   RSA |   RSL |   Gap (RSA-RSL)")
for b in buckets:
    print(f"{b:>6s} | {rsa[b]:>5.0f} | {rsl[b]:>5.0f} | {rsa[b]-rsl[b]:>+8.0f}")

# --- 2) NII sensitivity 12 bulan: shock +200bp paralel ---
# Hanya bucket <= 1Y yang repricing dalam 12 bulan.
# CASA: beta 0.3 -> deposito CASA hanya naik 60bp saat pasar +200bp
shock = 0.02
d_nii = 0.0
for b in ["1M", "3M", "1Y"]:
    d_nii += rsa[b] * shock
d_nii -= rsl["1M"] * shock * 0.3   # CASA beta 0.3
d_nii -= rsl["1Y"] * shock          # deposito 1Y repricing penuh
print(f"\nShock +200bp paralel -> dNII 12M = Rp {d_nii:,.0f} miliar")
print("Negatif: bank 'liability-sensitive' jangka pendek -> margin tergerus.")

# --- 3) EVE sensitivity: PV seluruh arus kas, shock +200bp ---
# Sederhananya: dEVE ~ -(D_aset*A - D_liab*L) * shock
D_aset = (5000 * 8.0 + 3000 * 0.25) / 8000   # duration rata-rata aset
D_liab = (4500 * 1.0 + 3000 * 0.1) / 7500    # duration rata-rata liabilitas
d_eve = -(D_aset * 8000 - D_liab * 7500) * shock
print(f"Shock +200bp paralel -> dEVE = Rp {d_eve:,.0f} miliar")
print(f"Rasio thd modal (misal Rp1.000 M): {abs(d_eve)/1000:.1%} {'-> MELEBIHI 15%!' if abs(d_eve)/1000 > 0.15 else '-> aman'}")
print()
print("Coba: ubah CASA beta 0.3 -> 0.8 (deposito sensitif). Apa yg terjadi pd NII?")`;

  const lab2Code = String.raw`# EVE vs NII bisa BERBEDA ARAH! Simulasi 6 skenario Basel.
# Bank: aset panjang fixed, liab pendek. Skenario: paralel up/down, steepener, flattener, short up/down.

scenarios = {
    "Paralel +200bp":      {"1M": 200, "1Y": 200, "5Y": 200, "15Y": 200},
    "Paralel -200bp":      {"1M": -200, "1Y": -200, "5Y": -200, "15Y": -200},
    "Steepener (short-65, long+150)": {"1M": -65, "1Y": -40, "5Y": 80, "15Y": 150},
    "Flattener (short+150, long-65)": {"1M": 150, "1Y": 100, "5Y": -20, "15Y": -65},
    "Short rate +250bp":   {"1M": 250, "1Y": 200, "5Y": 60, "15Y": 20},
    "Short rate -250bp":   {"1M": -250, "1Y": -200, "5Y": -60, "15Y": -20},
}
# KRD bank (tahun): aset 15Y dominan di long; liab di short
krd = {"1M": -0.3, "1Y": -1.0, "5Y": 0.5, "15Y": 7.0}  # bersih aset-liab
modal = 1000  # Rp miliar

print(f"{'Skenario':32s} {'dEVE/RpM':>9s} {'dEVE/Modal':>11s}")
worst = None
for name, sh in scenarios.items():
    deve = -sum(krd[b] * sh[b] / 10000 * 8000 for b in krd)  # Rp miliar
    ratio = abs(deve) / modal
    flag = " <-- TERBURUK" if worst is None or ratio > worst[1] else ""
    if worst is None or ratio > worst[1]:
        worst = (name, ratio)
    print(f"{name:32s} {deve:>9.0f} {ratio:>10.1%}{flag}")
print()
print(f"Skenario terburuk: {worst[0]} ({worst[1]:.1%} dari modal)")
print("Basel: dEVE > 15% modal pada skenario manapun = outlier -> tindak lanjut wajib.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR10 — Market Risk Analytics</span>
        <h1 className="display-title">IRRBB: Risiko Suku Bunga<br />yang Bersembunyi di Banking Book</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kejatuhan yang Tidak Terlihat di P&amp;L</a></li>
          <li><a href="#eve">EVE: Nilai Ekonomis Bank</a></li>
          <li><a href="#nii">NII: Laba Bunga 12 Bulan ke Depan</a></li>
          <li><a href="#gap">Repricing Gap: Peta Mismatch</a></li>
          <li><a href="#duaarah">Kenapa EVE dan NII Bisa Berbeda Arah</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung EVE &amp; NII Sensitivity</a></li>
          <li><a href="#lab2">🔬 Lab 2: 6 Skenario Basel — Cari yang Terburuk</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Krisis S&amp;L 1980-an dan Standar Basel IRRBB</a></li>
          <li><a href="#case">📋 Mini-Case: Bank dengan &ldquo;Dua Wajah&rdquo;</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan IRRBB (Interest Rate Risk in the Banking Book) dan mengapa banking book yang &ldquo;tenang&rdquo; tetap punya risiko suku bunga.</li>
          <li>Menghitung sensitivitas EVE dan NII terhadap shock suku bunga dari repricing gap.</li>
          <li>Membedakan EVE (jangka panjang, nilai kini) vs NII (jangka pendek, arus laba) — dan menjelaskan kapan keduanya berbeda arah.</li>
          <li>Membaca repricing gap report dan mengidentifikasi bucket mismatch yang berbahaya.</li>
          <li>Menerapkan 6 skenario standar Basel untuk IRRBB dan aturan outlier 15%.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kejatuhan yang Tidak Terlihat di P&amp;L</h2>
      <div className="story">
        <p>2022–2023. Bank-bank di AS memegang obligasi jangka panjang (dibeli saat suku bunga ~0%) yang didanai deposito jangka pendek. Di pembukuan <strong>banking book</strong> (amortised cost), semuanya tenang: P&amp;L stabil, tidak ada mark-to-market harian. Lalu The Fed menaikkan suku bunga dari 0% ke 5%+ dalam setahun.</p>
        <p>Yang terjadi: nilai <strong>ekonomis</strong> obligasi-obligasi itu anjlok 15–20% — tapi tidak muncul di P&amp;L karena akuntansi amortised cost. <strong>Kerugian itu nyata secara ekonomi, tapi tidak terlihat.</strong> Ketika deposan panik dan menarik dananya, bank terpaksa <em>menjual</em> obligasi itu — dan kerugian &ldquo;tak terlihat&rdquo; itu tiba-tiba menjadi <strong>kerugian nyata</strong> Rp-ratusan triliun. Beberapa bank kolaps (kasus Silicon Valley Bank, 2023).</p>
        <p>Twist-nya: semua informasi untuk memprediksi ini <strong>sudah ada</strong> — di repricing gap report dan perhitungan EVE. Risikonya bukan &ldquo;tidak terukur&rdquo;, melainkan <strong>tidak ditindaklanjuti</strong>. Inilah IRRBB: risiko suku bunga di banking book, diukur dengan dua lensa — <strong>EVE</strong> (nilai jangka panjang) dan <strong>NII</strong> (laba jangka pendek).</p>
      </div>

      <h2 id="eve">EVE: Nilai Ekonomis Bank</h2>
      <p><strong>Definisi.</strong> <strong>EVE (Economic Value of Equity)</strong> = nilai kini seluruh arus kas masa depan bank (aset − liabilitas − off-balance sheet), didiskon dengan kurva pasar:</p>
      <Tex math={String.raw`\text{EVE} = PV(\text{aset}) - PV(\text{liabilitas}) + PV(\text{off-BS})`} block />
      <p><strong>Artinya:</strong> EVE = &ldquo;berapa nilai bank <em>sebenarnya</em> hari ini jika semua arus kas masa depan dinilai dengan harga pasar&rdquo;. Berbeda dengan nilai buku akuntansi — EVE <strong>tidak bisa disembunyikan</strong> oleh amortised cost.</p>
      <p><strong>Sensitivitas EVE</strong> terhadap shock paralel:</p>
      <Tex math={String.raw`\Delta\text{EVE} \approx -(D_A \cdot A - D_L \cdot L) \cdot \Delta y`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`D_A, D_L`} /> = duration rata-rata aset &amp; liabilitas; <Tex math={String.raw`A, L`} /> = nilai aset &amp; liabilitas; <Tex math={String.raw`\Delta y`} /> = shock yield. Selisih <Tex math={String.raw`D_A \cdot A - D_L \cdot L`} /> = <strong>duration gap</strong> — jantung IRRBB.</p>
      <p><strong>Intuisi:</strong> bank tipikal (KPR 15Y didanai deposito 1Y) punya <strong>duration gap positif besar</strong> → suku bunga naik → EVE <strong>turun tajam</strong>. Inilah yang membunuh SVB: obligasi long-end didanai deposito short-end.</p>
      <p><strong>Aturan Basel:</strong> jika ΔEVE &gt; <strong>15% dari Tier 1 capital</strong> pada <em>salah satu</em> dari 6 skenario standar → bank = <strong>outlier</strong> → wajib tindak lanjut (kurangi risiko / tambah modal).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;EVE turun tidak masalah selama tidak dijual — kan cuma di atas kertas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> EVE mengukur <strong>kapasitas ekonomi</strong> bank menyerap guncangan. SVB membuktikan: kerugian &ldquo;kertas&rdquo; menjadi nyata begitu ada <strong>penarikan dana</strong> (likuiditas!) yang memaksa penjualan. EVE + risiko likuiditas = kombinasi mematikan. &ldquo;Tidak akan dijual&rdquo; adalah asumsi, bukan jaminan.</p>
      </div>

      <h2 id="nii">NII: Laba Bunga 12 Bulan ke Depan</h2>
      <p><strong>Definisi.</strong> <strong>NII (Net Interest Income)</strong> = pendapatan bunga − biaya bunga, diproyeksikan <strong>12 bulan ke depan</strong> (atau 3–5 tahun untuk analisis lebih panjang) di bawah tiap skenario suku bunga.</p>
      <Tex math={String.raw`\Delta\text{NII}_{12m} \approx \sum_{\text{bucket} \le 12m} \text{Gap}_{\text{bucket}} \cdot \Delta y \cdot (\text{beta adjustment})`} block />
      <p><strong>Artinya:</strong> hanya bucket yang <strong>repricing dalam 12 bulan</strong> yang mempengaruhi NII; <strong>beta</strong> = seberapa besar suku bunga produk mengikuti suku bunga pasar (CASA/deposito tidak 1:1!).</p>
      <p><strong>Konsep kunci — beta deposito:</strong> saat BI rate naik 100bp, bunga deposito mungkin cuma naik 30bp (beta 0,3) — bank menahan sebagian. Tapi saat turun, deposan menuntut penurunan cepat (beta asimetris!). <strong>Beta yang salah = NII sensitivity yang salah.</strong></p>
      <p><strong>Kepribadian NII vs EVE:</strong> NII seperti <em>laporan laba rugi tahunan</em> — peduli arus kas 12 bulan ke depan, yang dilihat direksi &amp; investor. EVE seperti <em>neraca ekonomis sejati</em> — peduli seluruh masa depan, yang dilihat regulator &amp; analis kredit. Bank yang sehat butuh keduanya hijau.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>behavioral assumption</strong> adalah bagian tersulit IRRBB: kapan CASA (giro/tabungan tanpa jatuh tempo kontraktual) &ldquo;repricing&rdquo;? Kapan KPR dilunasi lebih awal (prepayment)? Asumsi ini — bukan rumusnya — yang paling menentukan hasil. Selalu tanya: &ldquo;asumsi perilaku apa yang dipakai, dan seberapa sensitif hasilnya jika asumsi berubah?&rdquo;</p>
      </div>

      <h2 id="gap">Repricing Gap: Peta Mismatch</h2>
      <p><strong>Definisi.</strong> <strong>Repricing gap</strong> per bucket waktu = aset yang repricing − liabilitas yang repricing di bucket itu. Gap positif = <strong>asset-sensitive</strong> (untung saat rate naik); negatif = <strong>liability-sensitive</strong> (rugi saat rate naik).</p>

      <PlotlyChart
        data={gapData}
        title="Repricing Gap per Bucket (Rp miliar; merah = liability-sensitive)"
        layout={{ xaxis: { title: "Bucket repricing" }, yaxis: { title: "Gap (Rp miliar)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = gap (RSA − RSL) di bucket itu. Merah (negatif) = liabilitas lebih banyak repricing → liability-sensitive. Biru (positif) = asset-sensitive.</p>
        <p><strong>Interpretasi:</strong> bank ini <strong>liability-sensitive di jangka pendek</strong> (&lt;6 bulan: merah) tapi <strong>asset-sensitive di jangka panjang</strong> (&gt;6 bulan: biru). Artinya: kenaikan suku bunga <strong>menggerus NII 12-bulan</strong> (beban bunga naik duluan) tapi <strong>menaikkan nilai</strong> aset jangka panjang relatif… — tunggu, justru sebaliknya untuk EVE (lihat bawah). <strong>Struktur gap seperti inilah yang membuat EVE dan NII bisa berbeda arah.</strong></p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Gap nol = tidak ada risiko suku bunga.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> gap nol per bucket hanya menetralkan <strong>repricing risk paralel</strong>. Masih ada: <strong>basis risk</strong> (aset ikut JIBOR, liabilitas ikut BI rate — keduanya bisa bergerak beda!), <strong>yield curve risk</strong> (twist), dan <strong>option risk</strong> (prepayment KPR, penarikan CASA). Gap report = peta, bukan benteng.</p>
      </div>

      <h2 id="duaarah">Kenapa EVE dan NII Bisa Berbeda Arah</h2>
      <p>Ini salah satu konsep paling membingungkan — dan paling penting — di IRRBB:</p>
      <ul>
        <li><strong>EVE</strong> melihat <strong>seluruh</strong> arus kas masa depan (15 tahun KPR ikut hitung penuh).</li>
        <li><strong>NII</strong> hanya melihat <strong>12 bulan</strong> ke depan (KPR 15Y yang tidak repricing = tidak ikut).</li>
      </ul>
      <p><strong>Contoh:</strong> bank dengan KPR fixed 15Y (tidak repricing 12 bulan) didanai deposito 1Y:</p>
      <ul>
        <li>Suku bunga <strong>naik</strong> → NII <strong>turun</strong> (biaya deposito naik, pendapatan KPR tetap) TAPI…</li>
        <li>…EVE juga <strong>turun</strong> (duration gap positif). Di sini searah.</li>
      </ul>
      <p><strong>Kasus berbeda arah:</strong> bank dengan kredit <em>floating</em> (repricing cepat) + obligasi fixed jangka panjang di aset, didanai deposito ber-beta-rendah:</p>
      <ul>
        <li>Suku bunga <strong>naik</strong> → NII <strong>naik</strong> (pendapatan floating naik duluan, biaya deposito lambat) — direksi senang!</li>
        <li>Tapi EVE <strong>turun</strong> (nilai obligasi long-end anjlok) — regulator waspada.</li>
      </ul>
      <p><strong>Pelajaran:</strong> jangan kelola IRRBB hanya dengan satu lensa. Direksi yang hanya lihat NII bisa merasa aman sementara <strong>nilai ekonomis bank tergerus</strong> — bom waktu seperti SVB.</p>

      <PlotlyChart
        data={eveData}
        title="ΔEVE vs ΔNII terhadap Parallel Shock (bank contoh)"
        layout={{ xaxis: { title: "Parallel shock (bp)" }, yaxis: { title: "Perubahan (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = shock paralel (bp), sumbu-y = perubahan relatif. Biru = ΔEVE (% modal), kuning = ΔNII (% NII tahunan).</p>
        <p><strong>Interpretasi:</strong> keduanya turun saat rate naik (bank liability-sensitive &amp; duration gap positif) — tapi <strong>skalanya beda jauh</strong>: +300bp menggerus EVE <strong>11,2% dari modal</strong> tapi NII cuma <strong>5,3%</strong>. <strong>EVE lebih sensitif</strong> karena menangkap seluruh 15 tahun KPR, bukan cuma 12 bulan. Inilah mengapa aturan 15% Basel memakai EVE — ia lensa yang lebih jujur untuk solvabilitas.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>NII = film 12 bulan ke depan</strong> (apa yang dilihat investor/direksi). <strong>EVE = seluruh serial</strong> (apa yang menentukan bank bertahan). Mengelola hanya NII = mengemudi sambil melihat 10 meter ke depan. Keduanya harus masuk dashboard — dan jika arahnya berbeda, <strong>EVE yang menang</strong> untuk keputusan solvabilitas.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Hitung EVE &amp; NII Sensitivity</h2>
      <p>Ubah beta CASA (0,3 → 0,8) dan lihat dampaknya ke NII. Mengapa asumsi perilaku deposan begitu menentukan?</p>
      <PyodideLab
        title="Lab 1 — EVE & NII dari Repricing Gap"
        hint="Coba shock -200bp (rate TURUN): apakah NII naik? Tidak selalu — floor 0% pada deposito bisa membuat NII turun saat rate turun (margin terkompresi)!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: 6 Skenario Basel — Cari yang Terburuk</h2>
      <p>Ubah KRD bank (misal buat bank asset-sensitive jangka pendek). Skenario mana yang kini terburuk? Mengapa bukan paralel?</p>
      <PyodideLab
        title="Lab 2 — Enam Skenario Standar Basel"
        hint="Coba KRD = {'1M': 0.5, '1Y': 1.0, '5Y': -2.0, '15Y': -3.0} (profil terbalik): skenario terburuk akan BERGESER. Struktur neraca menentukan skenario pembunuh."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Kesehatan solvabilitas jangka panjang → <strong>EVE + aturan 15%</strong></h3>
        <p><strong>Kondisi:</strong> assessment kecukupan modal, laporan regulator.</p>
        <p><strong>Alasan:</strong> EVE menangkap seluruh horizon; outlier 15% = trigger wajib tindak lanjut. Tidak bisa dinegosiasi dengan &ldquo;tapi NII kami bagus&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. Perencanaan laba / anggaran tahunan → <strong>NII 12-bulan</strong></h3>
        <p><strong>Kondisi:</strong> budgeting, proyeksi laba, komunikasi investor.</p>
        <p><strong>Alasan:</strong> yang dilihat pasar adalah laba. Tapi sertakan asumsi beta secara eksplisit — NII tanpa beta = fiksi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Desain lindung nilai (hedging) → <strong>KRD per bucket (lihat MR8)</strong></h3>
        <p><strong>Kondisi:</strong> memilih instrumen hedge (swap, obligasi).</p>
        <p><strong>Alasan:</strong> EVE/NII agregat tidak memberi tahu <em>di mana</em> mismatch-nya. Hedge butuh peta bucket.</p>
      </div>

      <div className="decision-card">
        <h3>4. Review asumsi → <strong>Uji sensitivitas behavioral assumption</strong></h3>
        <p><strong>Kondisi:</strong> validasi model IRRBB (lihat MR18).</p>
        <p><strong>Alasan:</strong> hasil EVE/NII paling sensitif ke asumsi CASA &amp; prepayment — bukan ke rumus. Stress-test asumsinya, bukan cuma angkanya.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>EVE</strong> untuk solvabilitas (aturan 15%), <strong>NII</strong> untuk laba. Butuh keduanya.</li>
          <li>Jika EVE dan NII berbeda arah → <strong>percaya EVE</strong> untuk keputusan bertahan hidup.</li>
          <li><strong>Asumsi perilaku</strong> (CASA, prepayment) &gt; rumus. Tanya asumsinya dulu.</li>
          <li>Gap nol ≠ aman — masih ada basis, twist, dan option risk.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Krisis S&amp;L 1980-an dan Standar Basel IRRBB</h2>
      <p>Sebelum SVB 2023, ada preseden yang lebih dahsyat: <strong>krisis Savings &amp; Loan (S&amp;L) AS 1980-an</strong> — hampir 3.000 institusi gagal, biaya talangan ~US$160 miliar. Penyebabnya murni <strong>IRRBB</strong>: meminjam pendek, meminjamkan panjang fixed-rate, lalu suku bunga meledak. Ditambah standar Basel IRRBB modern — bagian ini melengkapi pemahaman strukturalmu.</p>

      <h3>Anatomi krisis S&amp;L: textbook IRRBB</h3>
      <p>Model bisnis S&amp;L sederhana: terima deposito jangka pendek (bunga mengambang, repricing cepat), salurkan <strong>KPR fixed-rate 30 tahun</strong> (repricing lambat). Selama suku bunga stabil/rendah, margin (NII) positif dan semua bahagia.</p>
      <p>Lalu Paul Volcker (The Fed) menaikkan suku bunga hingga <strong>~20%</strong> (1981) untuk membunuh inflasi:</p>
      <ol>
        <li><strong>NII runtuh:</strong> biaya dana (deposito) melonjak mengikuti suku bunga pasar, sementara pendapatan (KPR fixed 8–9%) terkunci. <strong>Margin menjadi negatif</strong> — bank membayar deposan lebih mahal daripada yang diterima dari debitur.</li>
        <li><strong>EVE hancur:</strong> nilai kini portofolio KPR 30-tahun jatuh 40–50% saat didiskon dengan yield 15%+, sementara kewajiban (deposito pendek) nilainya nyaris tidak berubah. <strong>Ekuitas ekonomis tergerus</strong> jauh sebelum kerugian muncul di laporan akuntansi.</li>
        <li><strong>Kematian lambat:</strong> karena akuntansi <em>amortised cost</em>, kerugian tidak terlihat di P&amp;L — institusi beroperasi sebagai <strong>&ldquo;zombie&rdquo;</strong> (bangkrut secara ekonomi, hidup secara akuntansi) selama bertahun-tahun, memperbesar biaya akhir talangan.</li>
      </ol>
      <p><strong>Paralel dengan SVB 2023:</strong> mekanismenya <em>identik</em> (duration gap + kenaikan suku bunga + unrealized loss), hanya arahnya sedikit berbeda — SVB mati cepat karena deposannya kabur (risiko likuiditas mempercepat realisasi), S&amp;L mati lambat karena deposannya dijamin pemerintah. Pelajarannya sama: <strong>duration gap yang tidak di-hedge adalah bom waktu dengan sumbu = siklus suku bunga</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: NII dan EVE bank sederhana di dua skenario suku bunga (klik untuk buka)</summary>
        <p><strong>Neraca (Rp triliun):</strong> Aset: KPR fixed 10Y Rp80 (kupon 8%), SBN floating Rp20. Kewajiban: deposito 1-bulan Rp70 (bunga 3%), obligasi 5Y Rp20 (kupon 5%). Ekuitas Rp10.</p>
        <p><strong>Skenario dasar</strong> (suku bunga tetap): NII = (80×8% + 20×5%) − (70×3% + 20×5%) = (6,4 + 1,0) − (2,1 + 1,0) = <strong>Rp4,3 T/tahun</strong>.</p>
        <p><strong>Skenario +300 bp</strong> (tahun pertama): deposito repricing → 6%: biaya deposito = 70×6% = 4,2. Aset fixed tidak berubah; SBN floating naik → 8%: 20×8% = 1,6. NII baru = (6,4 + 1,6) − (4,2 + 1,0) = <strong>Rp2,8 T</strong> — turun <strong>35%</strong>!</p>
        <p><strong>EVE:</strong> nilai kini KPR 10Y didiskon 8% → 11%: Rp80 T → ≈ Rp66 T (−Rp14 T). Deposito pendek: nilai ≈ tetap. EVE (aset − kewajiban) turun ≈ <strong>Rp14 T — melebihi seluruh ekuitas Rp10 T</strong>. Secara ekonomi bank <em>insolven</em>, meski NII masih positif Rp2,8 T!</p>
        <p><strong>Angka ini artinya:</strong> inilah &ldquo;dua wajah&rdquo; IRRBB — <strong>NII bilang &ldquo;masih untung&rdquo;</strong> sementara <strong>EVE bilang &ldquo;sudah bangkrut&rdquo;</strong>. Keduanya benar dari sudutnya masing-masing: NII = arus kas 12 bulan ke depan; EVE = seluruh masa depan. Bank yang hanya memantau NII bisa bangkrut dengan laporan laba yang masih hijau — persis jebakan S&amp;L dan SVB.</p>
      </details>

      <h3>Standar Basel IRRBB (2016): enam skenario shock</h3>
      <p>Basel menerbitkan standar IRRBB khusus (2016, berlaku bertahap) yang mewajibkan bank mengukur ΔEVE di bawah <strong>enam skenario shock</strong> standar:</p>
      <ul>
        <li><strong>Parallel up/down:</strong> seluruh kurva ±200–400 bp (tergantung mata uang).</li>
        <li><strong>Steepener / flattener:</strong> ujung pendek vs panjang bergerak berlawanan (risiko bentuk kurva — ingat MR9!).</li>
        <li><strong>Short rate up/down:</strong> hanya ujung pendek yang bergerak.</li>
      </ul>
      <p><strong>Aturan outlier:</strong> jika ΔEVE terburuk melebihi <strong>15% dari Tier 1 capital</strong>, bank dicap <em>outlier</em> — wajib menambah modal atau mengurangi eksposur. Angka 15% ini adalah &ldquo;garis merah&rdquo; kuantitatif pertama untuk IRRBB dalam sejarah regulasi.</p>
      <p><strong>Yang membuat IRRBB sulit dimodelkan</strong> (dan mengapa standar ini penting): <strong>behavioral assumptions</strong>. Deposito tanpa jatuh tempo (CASA/giro) — kapan &ldquo;repricing&rdquo;-nya? Nasabah bisa menarik kapan saja, tapi secara historis saldonya stabil bertahun-tahun. KPR — kapan dilunasi dipercepat (prepayment)? Jawabannya tergantung <strong>perilaku nasabah</strong>, bukan kontrak. Model IRRBB yang baik menghabiskan 80% tenaganya di asumsi behavioral ini — dan validasinya (MR18) wajib menguji sensitivitas hasil terhadap asumsi tersebut.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IRRBB hanya masalah bank tradisional.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> setiap institusi dengan <strong>mismatch jatuh tempo</strong> punya IRRBB — termasuk dana pensiun (kewajiban 30 tahun vs aset 10 tahun), asuransi jiwa, bahkan fintech lending yang mendanai kredit 12-bulan dengan pendanaan 1-bulan. Dan di sisi trading: <strong>setiap pemegang obligasi</strong> (MR8) terpapar risiko suku bunga — hanya saja diukur dengan duration/DV01, bukan EVE/NII. Risikonya satu; bahasanya dua.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan pasangan ini — <strong>NII = lensa 12 bulan</strong> (apakah kita masih menghasilkan laba tahun ini?), <strong>EVE = lensa keabadian</strong> (apakah ekuitas kita masih ada?). Keduanya bisa berlawanan arah: strategi yang menaikkan NII jangka pendek (misal: perpanjang tenor aset berbunga tinggi) bisa <em>menghancurkan</em> EVE. Keputusan ALCO (Asset-Liability Committee) yang sehat selalu menimbang keduanya — dan waspadai siapa pun yang hanya menunjukkan satu.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: sensitivitas asumsi CASA — ketika &ldquo;perilaku&rdquo; menentukan hasil (klik untuk buka)</summary>
        <p><strong>Bank:</strong> giro/tabungan (CASA) Rp60 T. Dua asumsi behavioral:</p>
        <p><strong>Asumsi konservatif:</strong> CASA dianggap repricing dalam <strong>1 tahun</strong> (nasabah kabur cepat) → durasi kewajiban pendek → ΔEVE untuk +200 bp = <strong>−Rp8 T</strong>.</p>
        <p><strong>Asumsi agresif:</strong> CASA dianggap stabil <strong>5 tahun</strong> (saldo inti lengket) → durasi kewajiban panjang → ΔEVE = <strong>−Rp2 T</strong>.</p>
        <p><strong>Selisih: Rp6 T</strong> — 4× lipat — dari <em>satu asumsi perilaku</em> yang tidak tertulis di kontrak mana pun!</p>
        <p><strong>Pelajaran validasi (MR18):</strong> (1) hasil IRRBB <strong>didominasi asumsi behavioral</strong>, bukan matematika canggihnya; (2) validator wajib meminta <strong>studi perilaku historis</strong> (seberapa stabil saldo CASA 10 tahun terakhir? saat suku bunga naik 2018, berapa yang kabur?); (3) laporkan <strong>rentang</strong>, bukan titik: &ldquo;ΔEVE −Rp2 T hingga −Rp8 T tergantung asumsi&rdquo; — <strong>kejujuran rentang &gt; presisi palsu</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Bank: aset Rp100 T (durasi 4 tahun), kewajiban Rp90 T (durasi 1 tahun). Suku bunga naik 200 bp paralel. Estimasi ΔEVE. Apa artinya bagi ekuitas Rp10 T? (klik untuk pembahasan)</summary>
        <p>ΔEVE ≈ −(D<sub>A</sub>×A − D<sub>L</sub>×L) × Δy = −(4×100 − 1×90) × 0,02 = −(400−90)×0,02 = <strong>−Rp6,2 T</strong>.</p>
        <p><strong>Artinya:</strong> 62% ekuitas (Rp10 T) tergerus oleh <em>satu</em> shock 200 bp — bank menjadi <strong>outlier</strong> (di atas 15% Tier 1 → wajib tindakan). Dan ini <em>sebelum</em> mempertimbangkan opsi perilaku (prepayment, penarikan CASA). Duration gap 3,1 tahun (= 4 − 0,9) adalah bomnya; 200 bp adalah pemicunya.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Mengapa S&amp;L 1980-an &ldquo;mati lambat&rdquo; sedangkan SVB 2023 &ldquo;mati cepat&rdquo;, padahal penyebabnya sama (duration gap + suku bunga naik)? (klik untuk pembahasan)</summary>
        <p><strong>S&amp;L:</strong> deposan ritel + dijamin pemerintah (tidak kabur) + akuntansi amortised cost → kerugian tidak terlihat → <strong>zombie bertahun-tahun</strong> (mati lambat, biaya talangan membengkak).</p>
        <p><strong>SVB:</strong> deposan korporat tidak dijamin (kabur!) + mark-to-market sebagian + media sosial mempercepat panik → <strong>unrealized loss terpaksa direalisasi dalam 48 jam</strong> (mati cepat).</p>
        <p><strong>Pelajaran:</strong> kecepatan kematian ditentukan <strong>struktur pendanaan</strong> (siapa deposanmu?), bukan besar kerugiannya. IRRBB + risiko likuiditas (MR13) = kombinasi yang menentukan <em>apakah</em> dan <em>secepat apa</em> kamu mati.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Sebutkan 6 skenario shock Basel IRRBB dan jelaskan mengapa &ldquo;steepener&rdquo; bisa lebih berbahaya daripada &ldquo;parallel up&rdquo; untuk bank tertentu. (klik untuk pembahasan)</summary>
        <p><strong>Enam skenario:</strong> parallel up, parallel down, steepener, flattener, short rate up, short rate down.</p>
        <p><strong>Steepener lebih berbahaya</strong> untuk bank dengan <strong>aset durasi menengah + kewajiban pendek</strong>: parallel up menaikkan semua yield (aset dan kewajiban sama-sama terdiskon lebih berat — efek bersih moderat), sedangkan steepener (pendek turun, panjang naik) <strong>menaikkan diskonto aset panjang</strong> sambil <strong>tidak</strong> menurunkan nilai kewajiban pendek secara proporsional → ΔEVE lebih negatif. Inilah mengapa <strong>risiko bentuk kurva</strong> (MR9) tidak tertangkap oleh shock paralel saja.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Bank dengan &ldquo;Dua Wajah&rdquo;</h2>
      <div className="callout">
        <p>Bank MNO melaporkan: <strong>NII naik 8%</strong> YoY (direksi puas, bonus cair). Tapi laporan IRRBB menunjukkan:</p>
        <ul>
          <li>ΔEVE skenario paralel +200bp = <strong>−18% dari Tier 1</strong> (outlier! &gt; 15%)</li>
          <li>Penyebab: KPR fixed 15Y Rp5 T didanai deposito 1Y; obligasi HTM Rp3 T (amortised cost, unrealized loss Rp450 M tak terlihat di P&amp;L)</li>
          <li>NII naik karena: kredit floating repricing cepat + beta deposito rendah (0,2)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Jelaskan paradoks &ldquo;NII naik, EVE jebol&rdquo;. (b) Apa yang harus dilakukan komite risiko? (c) Kaitkan dengan kasus SVB.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Dua wajah:</strong> NII (12 bulan) naik karena pendapatan floating naik lebih cepat dari biaya deposito (beta rendah) — <em>efek jangka pendek</em>. EVE (seluruh horizon) jebol karena nilai kini KPR 15Y + obligasi anjlok saat rate naik — <em>realitas jangka panjang</em>. Keduanya benar; yang satu menenangkan, yang satu memperingatkan.</p>
          <p>(b) <strong>Tindakan:</strong> (1) Akui status outlier → buat rencana remediasi (tidak bisa &ldquo;tunggu reda&rdquo;). (2) Kurangi duration gap: perpanjang liabilitas (terbitkan obligasi 5Y) atau swap fixed-to-floating untuk sebagian KPR. (3) Transparansi: ungkapkan unrealized loss HTM ke komite — &ldquo;tak terlihat&rdquo; bukan strategi. (4) Uji skenario penarikan deposito (likuiditas!) — karena itulah pemicu yang mengubah kerugian kertas jadi nyata.</p>
          <p>(c) <strong>SVB persis begini:</strong> NII terlihat OK, EVE jebol diam-diam, lalu bank run memaksa penjualan obligasi → kerugian kertas menjadi nyata → kolaps. Pelajaran: <strong>IRRBB tanpa manajemen likuiditas = bom berpewaktu</strong>.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. ΔEVE = −18% dari Tier 1 pada skenario paralel +200bp. Status bank menurut Basel?"
        options={[
          "Aman — masih di bawah 20%",
          "Outlier (>15%) — wajib tindak lanjut: kurangi risiko atau tambah modal",
          "Tidak ada aturan",
          "Cukup laporkan saja",
        ]}
        correct={1}
        explanation="Benar. Aturan 15% Basel: ΔEVE melebihi 15% Tier 1 di skenario manapun = outlier. Ini trigger regulasi, bukan sekadar info."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bank liability-sensitive jangka pendek. Suku bunga naik 200bp. Dampak ke NII 12-bulan?"
        options={[
          "NII naik",
          "NII turun — biaya liabilitas (repricing cepat) naik mendahului pendapatan aset",
          "NII tidak berubah",
          "NII menjadi nol",
        ]}
        correct={1}
        explanation="Benar. Liability-sensitive = RSL > RSA di bucket pendek → beban bunga naik duluan. Inilah mekanisme 'margin tergerus' saat rate naik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa EVE dan NII bisa berbeda arah?"
        options={[
          "Karena salah hitung",
          "EVE melihat SELURUH arus kas masa depan; NII hanya 12 bulan — horizon berbeda, sinyal berbeda",
          "Karena memakai mata uang berbeda",
          "Tidak mungkin berbeda arah",
        ]}
        correct={1}
        explanation="Benar. Perbedaan horizon = perbedaan lensa. NII bisa naik (jangka pendek) sementara EVE jebol (jangka panjang) — dan untuk solvabilitas, EVE yang menang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Beta deposito 0,3 artinya?"
        options={[
          "Deposito tidak terpengaruh suku bunga",
          "Saat suku bunga pasar naik 100bp, bunga deposito hanya naik ~30bp — bank menahan sebagian",
          "Deposito naik 300bp",
          "Beta tidak relevan",
        ]}
        correct={1}
        explanation="Benar. Beta < 1 = sticky deposit — menguntungkan saat rate naik (margin melebar) tapi asumsi ini harus diuji: saat krisis kepercayaan, deposan bisa pergi (beta mendadak → 1 atau dananya hilang)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Repricing gap per bucket semuanya nol. Kesimpulan?"
        options={[
          "Tidak ada risiko suku bunga sama sekali",
          "Repricing risk paralel netral — tapi masih ada basis risk, yield curve risk (twist), dan option risk (prepayment/CASA)",
          "EVE pasti nol",
          "Bank kebal krisis",
        ]}
        correct={1}
        explanation="Benar. Gap report hanya menangkap SATU dari empat sumber IRRBB Basel (repricing, yield curve, basis, option). Nol di satu dimensi ≠ nol di semua."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Asumsi paling kritis dalam model IRRBB?"
        options={[
          "Rumus diskonto",
          "Behavioral assumptions: kapan CASA repricing & kapan KPR prepay — asumsi ini paling menentukan hasil, bukan rumusnya",
          "Jumlah bucket",
          "Warna chart",
        ]}
        correct={1}
        explanation="Benar. Model IRRBB = asumsi perilaku + aritmetika. Validasi model (MR18) harus stress-test ASUMSI-nya: apa jadinya jika CASA pergi 2x lebih cepat dari asumsi?"
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>IRRBB</strong> = risiko suku bunga di banking book — &ldquo;tenang&rdquo; di P&amp;L tapi nyata secara ekonomi.</li>
          <li><strong>EVE</strong> = PV(aset) − PV(liabilitas); sensitivitas ≈ <Tex math={String.raw`-(D_A A - D_L L)\Delta y`} />; outlier jika &gt; 15% Tier 1.</li>
          <li><strong>NII</strong> = proyeksi laba bunga 12 bulan; hanya bucket ≤ 12M yang ikut; beta deposito kritis.</li>
          <li><strong>EVE vs NII bisa berbeda arah</strong> (horizon beda) — untuk solvabilitas, percaya EVE.</li>
          <li><strong>Repricing gap</strong> = peta mismatch; gap nol ≠ aman (masih ada basis/twist/option risk).</li>
          <li><strong>Behavioral assumptions</strong> (CASA, prepayment) = bagian tersulit — uji sensitivitasnya.</li>
          <li>IRRBB + risiko likuiditas = kombinasi yang membunuh (pelajaran SVB 2023).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr9-kurva-yield" className="btn btn-secondary btn-sm">← MR9</Link>
        <Link href="/learn/mr11-options-risk" className="btn btn-primary btn-sm">Next: MR11 →</Link>
      </div>
    </div>
  );
}
