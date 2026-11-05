"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr4aPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const rwaWeightsData = [
    {
      x: ["Kas", "SBN", "KPR LTV<80%", "Korporasi BBB", "UKM", "Kartu kredit"],
      y: [0, 0, 35, 100, 75, 75],
      type: "bar",
      marker: { color: ["#3aa655", "#3aa655", "#2a7de1", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["0%", "0%", "35%", "100%", "75%", "75%"],
      textposition: "outside",
    },
  ];

  const kpmmData = [
    {
      x: ["Bank A (sehat)", "Bank B (pas-pasan)", "Bank C (kritis)"],
      y: [22.5, 12.3, 8.5],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["22,5%", "12,3%", "8,5%"],
      textposition: "outside",
    },
  ];

  const baselTimelineData = [
    {
      x: ["1988", "2004", "2010-2017", "2023+"],
      y: [1, 2, 3, 4],
      type: "scatter",
      mode: "lines+markers+text",
      text: ["Basel I", "Basel II", "Basel III", "Basel III final"],
      textposition: "top center",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 10, color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator RWA & KPMM (Basel Standardised Approach)
# Ubah komposisi aset bank, lalu jalankan.
aset = {
    "Kas":            {"nilai": 100, "bobot": 0.00},
    "SBN":            {"nilai": 200, "bobot": 0.00},
    "KPR":            {"nilai": 300, "bobot": 0.35},
    "Korporasi":      {"nilai": 250, "bobot": 1.00},
    "UKM":            {"nilai": 100, "bobot": 0.75},
    "Kartu kredit":   {"nilai":  50, "bobot": 0.75},
}
modal = 120  # miliar Rp (modal inti + pelengkap)

total_aset = sum(a["nilai"] for a in aset.values())
rwa = sum(a["nilai"] * a["bobot"] for a in aset.values())
kpmm = modal / rwa * 100

print(f"{'Aset':<14} {'Nilai':>7} {'Bobot':>6} {'RWA':>7}")
for nama, a in aset.items():
    print(f"{nama:<14} {a['nilai']:>6.0f}M {a['bobot']*100:>5.0f}% {a['nilai']*a['bobot']:>6.1f}M")
print("-" * 38)
print(f"Total aset         : Rp {total_aset:.0f} M")
print(f"Total RWA          : Rp {rwa:.1f} M")
print(f"KPMM               : {modal}/{rwa:.1f} = {kpmm:.2f}%")
print(f"Batas OJK          : 8% (+buffer)")
print("Status             :", "AMAN" if kpmm >= 10 else "WASPADA" if kpmm >= 8 else "KRITIS!")
print()
print("Coba: pindahkan 100M dari SBN ke Korporasi. RWA naik, KPMM turun.")
print("Aset sama (1000M), tapi 'harga modalnya' beda — itulah RWA.")`;

  const lab2Code = `# Lab 2: SA vs IRB — siapa lebih hemat modal?
# Bank punya portofolio KPR Rp 500 M. Bandingkan kebutuhan modal.
portofolio = 500  # miliar Rp

# Standardised Approach: bobot tetap dari regulator
rwa_sa = portofolio * 0.35
modal_sa = rwa_sa * 0.08

# IRB (ilustrasi): bank pakai PD/LGD internal -> bobot risiko hasil model
# Misal model bilang portofolio ini bagus: bobot efektif 15%
rwa_irb = portofolio * 0.15
modal_irb = rwa_irb * 0.08

print(f"Portofolio KPR     : Rp {portofolio} M")
print(f"SA  : RWA Rp {rwa_sa:.0f} M -> modal min Rp {modal_sa:.1f} M")
print(f"IRB : RWA Rp {rwa_irb:.0f} M -> modal min Rp {modal_irb:.1f} M")
print(f"Hemat modal (IRB)  : Rp {modal_sa - modal_irb:.1f} M")
print()
print("Coba: ubah bobot IRB jadi 0.45 (model bilang portofolio jelek).")
print("IRB jadi LEBIH MAHAL dari SA! IRB = pedang bermata dua:")
print("model bagus -> hemat modal; model jelek -> modal bengkak + validasi ketat.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR4a — Credit Risk Analyst • Regulasi Part 1</span>
        <h1 className="display-title">Basel: Dari Aset Menjadi Modal<br />(SA vs IRB, RWA, KPMM)</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Bank, Aset Sama, Nasib Beda</a></li>
          <li><a href="#basel">Basel — Konstitusi Perbankan Global</a></li>
          <li><a href="#rwa">RWA: Kenapa Rp 1 M Tidak Selalu Rp 1 M</a></li>
          <li><a href="#savsirb">SA vs IRB: Seragam vs Jahitan Sendiri</a></li>
          <li><a href="#kpmm">KPMM: Speedometer Kesehatan Bank Indonesia</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator RWA &amp; KPMM</a></li>
          <li><a href="#lab2">🔬 Lab 2: SA vs IRB — Siapa Lebih Hemat Modal?</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Pilihan Pendekatan &amp; Strategi Modal</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Ekspansi Korporasi vs KPR</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan logika Basel: mengapa regulator mewajibkan modal untuk risiko kredit (tiga pilar).</li>
          <li>Menghitung RWA dengan Standardised Approach dan rasio KPMM — serta menilai status kesehatan bank.</li>
          <li>Membedakan SA vs IRB: kapan bank boleh pakai model internal, apa syaratnya, dan apa trade-off-nya.</li>
          <li>Mengaitkan keputusan bisnis (ekspansi segmen) dengan dampaknya ke KPMM.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Bank, Aset Sama, Nasib Beda</h2>
      <div className="story">
        <p>Tahun 2008, dua bank fiktif — Bank Mawar dan Bank Melati — sama-sama punya aset <strong>Rp 100 triliun</strong>. Di atas kertas, kembar identik.</p>
        <p>Tapi isinya beda. Mawar: 70% asetnya obligasi pemerintah dan KPR prima. Melati: 70% asetnya kredit korporasi spekulatif dan pembiayaan tanpa agunan. Saat krisis datang, Melati kolaps — kerugiannya 5× lipat Mawar. Aset boleh sama, tapi <strong>risikonya tidak sama</strong>.</p>
        <p>Regulator global belajar dari kejadian seperti ini (berulang kali, sejak 1988): <strong>modal minimum tidak boleh dihitung dari total aset mentah</strong>, melainkan dari <strong>aset yang dibobot risikonya</strong> — RWA. Dan standar globalnya bernama <strong>Basel</strong>.</p>
        <p><strong>Twist-nya:</strong> Basel bukan sekadar aturan kepatuhan — ia adalah <strong>harga modal untuk setiap keputusan kredit</strong>. Analis yang paham Basel bisa menjawab pertanyaan direksi: "kalau kita ekspansi Rp 1 T ke segmen X, berapa modal yang terkunci?" Lesson ini memberi alat hitungnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="basel">Basel — Konstitusi Perbankan Global</h2>
      <p><strong>Definisi.</strong> Basel = kerangka regulasi permodalan bank yang disusun Basel Committee on Banking Supervision (bermarkas di Basel, Swiss). Indonesia mengadopsinya via OJK (POJK). Tiga pilarnya:</p>
      <ul>
        <li><strong>Pilar 1 — Modal minimum:</strong> rumus hitung kebutuhan modal untuk risiko kredit, pasar, dan operasional.</li>
        <li><strong>Pilar 2 — Supervisory review:</strong> OJK menilai profil risiko tiap bank (ICAAP) dan bisa meminta modal tambahan (Pilar 2 add-on).</li>
        <li><strong>Pilar 3 — Disiplin pasar:</strong> bank wajib mempublikasikan eksposur risikonya — pasar ikut mengawasi.</li>
      </ul>
      <p><strong>Kepribadian:</strong> Basel itu seperti <strong>kitab undang-undang lalu lintas</strong> — tidak mengajari cara menyetir (itu urusan bank), tapi menetapkan batas kecepatan, sabuk pengaman, dan SIM. Melanggar = ditilang OJK.</p>

      <PlotlyChart
        data={baselTimelineData}
        title="Evolusi Basel: Tiap Krisis Melahirkan Aturan Baru"
        layout={{ xaxis: { title: "" }, yaxis: { title: "", showticklabels: false }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis waktu dari kiri (1988) ke kanan (sekarang). Tiap titik = versi Basel baru.</p>
        <p><strong>Interpretasi:</strong> polanya jelas — <strong>Basel I</strong> lahir setelah krisis utang Amerika Latin, <strong>Basel II</strong> menyempurnakan bobot risiko, <strong>Basel III</strong> lahir dari krisis 2008 (modal lebih tebal + buffer + likuiditas). Pelajaran: regulasi selalu <em>mengejar</em> krisis terakhir. Analis yang paham sejarah ini tidak kaget saat aturan berubah.</p>
      </div>

      <h2 id="rwa">RWA: Kenapa Rp 1 M Tidak Selalu Rp 1 M</h2>
      <p><strong>Definisi.</strong> RWA (<em>Risk-Weighted Assets</em>) = nilai aset <strong>dikalikan bobot risiko</strong>. Aset berisiko rendah (kas, SBN) bobotnya 0% — tidak "memakan" modal. Aset berisiko tinggi bobotnya 100%+.</p>
      <Tex math={String.raw`\text{RWA} = \sum (\text{Nilai Aset}_i \times \text{Bobot Risiko}_i)`} block />
      <p><strong>Artinya tiap simbol:</strong> untuk tiap kelompok aset <Tex math={String.raw`i`} />: kalikan nilai bukunya dengan bobot risiko yang ditetapkan regulator (SA) atau model internal (IRB), lalu jumlahkan semua.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Bank punya: Kas Rp 100 M (bobot 0%), SBN Rp 200 M (bobot 0%), KPR Rp 300 M (bobot 35%), Korporasi Rp 400 M (bobot 100%).</p>
        <p><strong>Langkah 1</strong> — hitung per kelompok: 100×0% = 0; 200×0% = 0; 300×35% = 105; 400×100% = 400.<br />
        <strong>Langkah 2</strong> — jumlahkan: RWA = <strong>Rp 505 M</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan total aset Rp 1.000 M. Separuh aset "tidak memakan modal" (kas+SBN). Inilah mengapa bank gemar menumpuk SBN: <strong>imbal hasil tanpa beban modal</strong>.</p>
      </details>

      <PlotlyChart
        data={rwaWeightsData}
        title="Bobot Risiko SA (Basel) per Jenis Aset — Ilustrasi"
        layout={{ xaxis: { title: "Jenis aset" }, yaxis: { title: "Bobot risiko (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = bobot risiko — "pajak modal" untuk tiap Rp 1 aset.</p>
        <p><strong>Interpretasi:</strong> kas &amp; SBN (0%) = bebas pajak modal; KPR (35%) = pajak ringan; korporasi tanpa rating (100%) = pajak penuh. <strong>Implikasi bisnis:</strong> dua bank dengan aset Rp 1 T bisa punya kebutuhan modal beda 2× lipat tergantung komposisinya. Inilah "harga" strategi bisnis dalam bahasa regulator.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> RWA adalah <strong>kurs tukar antara aset dan modal</strong>. Rp 1 M KPR "ditukar" jadi Rp 350 jt RWA; Rp 1 M korporasi jadi Rp 1 M RWA. Setiap analis kredit yang mengusulkan ekspansi segmen sebenarnya sedang mengusulkan <strong>pembelian RWA</strong> — dan RWA dibayar dengan modal yang mahal.</p>
      </div>

      <h2 id="savsirb">SA vs IRB: Seragam vs Jahitan Sendiri</h2>
      <p>Ada dua cara menentukan bobot risiko:</p>
      <ul>
        <li><strong>SA (<em>Standardised Approach</em>)</strong> — "seragam": bobot ditentukan regulator berdasarkan kategori &amp; rating eksternal. Sederhana, transparan, dipakai mayoritas bank Indonesia.</li>
        <li><strong>IRB (<em>Internal Ratings-Based</em>)</strong> — "jahitan sendiri": bank memakai <strong>model internal PD/LGD/EAD</strong> (yang kita pelajari di CR3!) untuk menghitung bobot via rumus regulator. Hasilnya bisa lebih hemat modal <em>jika</em> portofolio memang bagus — tapi syaratnya berat: data historis panjang, validasi ketat, persetujuan OJK.</li>
      </ul>
      <p><strong>Kepribadian:</strong> SA seperti membeli baju ukuran S/M/L — cepat tapi tidak pas badan. IRB seperti jas tailor — pas dan bisa lebih hemat bahan, tapi butuh penjahit ahli (tim modeling), mahal, dan harus lolos "uji jahitan" (validasi + approval OJK) tiap tahun.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "IRB selalu lebih baik karena modern."</strong></p>
        <p><strong>Yang benar:</strong> IRB hanya menguntungkan jika <strong>modelmu benar-benar bagus</strong> (portofolio berkualitas + data panjang). Model jelek → bobot IRB bisa <em>lebih tinggi</em> dari SA + biaya validasi + risiko teguran OJK. Banyak bank menengah Indonesia rasional bertahan di SA — dan itu keputusan bisnis yang valid, bukan ketertinggalan.</p>
      </div>

      <h2 id="kpmm">KPMM: Speedometer Kesehatan Bank Indonesia</h2>
      <p><strong>Definisi.</strong> KPMM (<em>Kewajiban Penyediaan Modal Minimum</em>) = rasio modal terhadap RWA, versi Indonesia dari CAR (<em>Capital Adequacy Ratio</em>):</p>
      <Tex math={String.raw`\text{KPMM} = \frac{\text{Modal (inti + pelengkap)}}{\text{RWA}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong> pembilang = modal bank (Tier 1: saham + laba ditahan; Tier 2: instrumen pelengkap); penyebut = RWA (total aset berbobot risiko). Batas minimum OJK: <strong>8%</strong> (plus buffer untuk bank besar/sistemik — bisa 10–14% efektif).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Dari contoh RWA di atas: RWA Rp 505 M, modal Rp 80 M.</p>
        <p><strong>Langkah 1</strong> — KPMM = 80 / 505 × 100% = <strong>15,8%</strong>.<br />
        <strong>Langkah 2</strong> — bandingkan dengan batas 8%: buffer 7,8 poin — bank sangat sehat.<br />
        <strong>Langkah 3</strong> — kapasitas ekspansi: tiap Rp 100 M RWA baru "memakan" Rp 8 M modal minimum. Dengan buffer ini bank bisa tambah ~Rp 970 M RWA sebelum menyentuh 8%.</p>
      </details>

      <PlotlyChart
        data={kpmmData}
        title="Ilustrasi KPMM Tiga Bank (batas OJK 8%)"
        layout={{ xaxis: { title: "Bank" }, yaxis: { title: "KPMM (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = KPMM tiap bank; garis imajiner 8% = batas minimum OJK.</p>
        <p><strong>Interpretasi:</strong> Bank A (22,5%) punya ruang ekspansi besar. Bank B (12,3%) masih aman tapi harus menghitung tiap ekspansi. Bank C (8,5%) = <strong>zona merah</strong>: hampir tidak bisa tumbuh, dividen dibatasi, OJK mengawasi ketat. Analis di Bank C hidup dalam dunia yang berbeda dari analis di Bank A — setiap usulan kredit adalah pertarungan memperebutkan modal.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "KPMM tinggi selalu berarti bank hebat."</strong></p>
        <p><strong>Yang benar:</strong> KPMM 25% bisa berarti bank <strong>terlalu takut</strong> menyalurkan kredit (modal menganggur = ROE rendah, pemegang saham tidak senang). KPMM optimal = cukup di atas batas + buffer untuk tumbuh. Bank adalah bisnis <em>menyalurkan</em> risiko dengan harga yang tepat, bukan menghindarinya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan rantai ini: <strong>keputusan kredit → RWA → KPMM → kapasitas tumbuh</strong>. Setiap memo kredit yang kamu tulis diam-diam menggerakkan KPMM bank. Analis yang bisa menghitung "berapa poin KPMM yang dimakan usulan ini" akan didengar direksi — karena ia bicara bahasa mereka.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Modal adalah Harga Kebebasan</h3>
      <p>KPMM sering dibaca sebagai "nilai ujian" bank — makin tinggi makin bagus. Analis senior membacanya sebagai <strong>harga kebebasan beroperasi</strong>. Setiap poin KPMM di atas batas minimum adalah "ruang gerak": ruang untuk tumbuh, ruang untuk salah, ruang untuk membayar dividen. Bank dengan KPMM 9% hidup seperti orang yang gajinya pas-pasan — setiap pengeluaran (baca: setiap kredit baru) harus dihitung mati. Bank dengan KPMM 20% hidup seperti orang dengan tabungan tebal — bisa mengambil peluang tanpa panik. Dua analis dengan skill sama akan punya pengalaman kerja yang <strong>sangat berbeda</strong> di dua bank ini.</p>
      <p>Intuisi kedua: <strong>mengapa 8%?</strong> Angka ini bukan wahyu — melainkan kompromi historis. Basel I (1988) menetapkan 8% setelah melihat bank-bank yang kolaps di krisis utang Amerika Latin umumnya punya modal di bawah itu. Basel III mempertahankannya tapi menambah <strong>buffer</strong> (conservation 2,5%, countercyclical, surcharge bank sistemik) — sehingga "8%" efektif menjadi 10,5–14% untuk bank besar. Pelajarannya: angka regulasi selalu = <strong>pelajaran dari krisis terakhir + margin politik</strong>. Saat kamu melihat angka 8%, bacalah sebagai "inilah seberapa besar luka yang pernah diderita industri ini".</p>
      <p>Intuisi ketiga — yang paling sering dilupakan analis kredit: <strong>RWA adalah bahasa yang dipakai direksi untuk menolak usulanmu</strong>. "Usulan kredit ini bagus, tapi memakan RWA terlalu besar" adalah kalimat yang akan kamu dengar berkali-kali. Analis yang hanya bisa bicara PD dan agunan akan kalah argumen dari analis yang bisa menjawab: "RWA-nya Rp X, memakan Y bps KPMM, dan RAROC-nya Z% — masih di atas hurdle." Tiga kalimat itu = tiket untuk didengar di komite kredit (CR25).</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator RWA &amp; KPMM</h2>
      <p>Jadilah "bendahara modal" bank: ubah komposisi aset, lihat KPMM bergerak.</p>
      <PyodideLab
        title="Lab 1 — RWA & KPMM (Standardised Approach)"
        hint="Coba: (1) pindahkan 100M dari SBN ke Korporasi — berapa poin KPMM hilang? (2) Tambah modal jadi 150 — berapa? Rasakan 'harga modal' tiap segmen."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: SA vs IRB — Siapa Lebih Hemat Modal?</h2>
      <p>Simulasi dilema bank besar: tetap di SA atau investasi ke IRB?</p>
      <PyodideLab
        title="Lab 2 — Perbandingan Kebutuhan Modal SA vs IRB"
        hint="Coba ubah bobot IRB: 0.15 (model bagus) vs 0.45 (model jelek) vs 0.35 (= SA). Pada titik berapa IRB tidak lagi worth it mengingat biaya validasinya?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Pilihan Pendekatan &amp; Strategi Modal</h2>

      <div className="decision-card">
        <h3>1. Bank menengah, data historis &lt; 7 tahun → <strong>tetap di SA</strong></h3>
        <p><strong>Kondisi:</strong> belum punya data default panjang, tim modeling kecil.</p>
        <p><strong>Kenapa SA:</strong> IRB butuh data historis panjang + validasi independen + approval OJK — investasinya tidak kembali jika portofolio tidak jumbo. SA memberi kepastian dan biaya kepatuhan rendah.</p>
        <p><strong>Contoh nyata:</strong> mayoritas BPD dan bank menengah Indonesia memakai SA — keputusan rasional, bukan ketertinggalan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Bank besar, portofolio KPR jumbo berkualitas → <strong>pertimbangkan IRB</strong></h3>
        <p><strong>Kondisi:</strong> data 10+ tahun, PD/LGD internal tervalidasi, portofolio berkualitas (bobot IRB &lt; bobot SA).</p>
        <p><strong>Kenapa IRB:</strong> hemat modal bisa puluhan triliun — modal yang bebas bisa disalurkan jadi kredit baru (atau dividen). Syarat: lolos validasi OJK tiap tahun (CR19).</p>
      </div>

      <div className="decision-card">
        <h3>3. KPMM mepet batas (≤ 10%) → <strong>ekspansi pilih-pilih: kejar bobot rendah</strong></h3>
        <p><strong>Kondisi:</strong> buffer modal tipis, tetap harus tumbuh.</p>
        <p><strong>Strategi:</strong> prioritaskan aset berbobot rendah (KPR LTV rendah 35%, SBN 0%) dan hindari korporasi tanpa rating (100%+). Setiap usulan kredit wajib mencantumkan "konsumsi RWA".</p>
        <p><strong>Contoh nyata:</strong> Bank C di chart — ekspansi Rp 100 M ke korporasi memakan modal 2,8× lipat dibanding ke KPR.</p>
      </div>

      <div className="decision-card">
        <h3>4. Krisis / resesi → <strong>jaga buffer, siapkan Pilar 2</strong></h3>
        <p><strong>Kondisi:</strong> NPL naik → RWA naik (migrasi rating) → KPMM tertekan otomatis.</p>
        <p><strong>Kenapa:</strong> saat krisis, penyebut (RWA) membengkak <em>bersamaan</em> dengan pembilang (modal) tergerus rugi. Bank butuh <strong>capital conservation buffer</strong> — alasan Basel III mewajibkan buffer di atas 8%.</p>
      </div>

            <div className="decision-card">
        <h3>5. KPMM 19%, direksi tergoda ekspansi agresif 30%/tahun → <strong>tahan: hitung dulu RWA-nya</strong></h3>
        <p><strong>Kondisi:</strong> bank sangat sehat (KPMM 19%), direksi ingin "memanfaatkan" dengan ekspansi kredit 30% per tahun, fokus ke korporasi (bobot 100%).</p>
        <p><strong>Kenapa ditahan:</strong> ekspansi 30% ke korporasi = RWA naik ~30%/tahun. Dalam 3 tahun, RWA naik 2,2× lipat — KPMM 19% → ~8,6% (dengan asumsi modal tidak tambah). Bank berpindah dari "sangat sehat" ke "mepet batas" hanya karena <strong>strategi segmen yang rakus modal</strong>. Alternatif cerdas: ekspansi campuran (KPR bobot 35% + korporasi pilihan) — tumbuh 20% dengan RWA naik cuma 12%. Analis yang membawa hitungan ini ke direksi bukan penghambat bisnis — melainkan rem yang menyelamatkan.</p>
        <p><strong>Contoh nyata:</strong> pola ini terjadi di banyak bank Asia pra-1997: ekspansi properti/korporasi berbobot tinggi menggerus modal diam-diam, lalu krisis menuntaskannya. Sejarah tidak berulang persis — tapi RWA selalu menagih.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Setiap kredit = pembelian RWA.</strong> Tanya bobotnya sebelum tanda tangan.</li>
          <li><strong>KPMM = modal / RWA.</strong> Dua cara memperbaikinya: tambah modal (mahal) atau turunkan RWA (strategi).</li>
          <li><strong>SA = pasti &amp; murah; IRB = potensial hemat tapi mahal &amp; diawasi.</strong></li>
          <li><strong>KPMM 8% adalah lantai, bukan target.</strong> Operasi normal butuh buffer di atasnya.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Rantai Modal: 5 Pertanyaan Direksi</h3>
      <p>Setiap usulan ekspansi kredit harus bisa menjawab 5 pertanyaan ini — berurutan. Ini bahasa direksi; kuasai atau tidak didengar.</p>
      <ol>
        <li><strong>Berapa RWA-nya?</strong> — Hitung: EAD × bobot risiko (SA) per segmen. Ini 'harga modal' usulanmu dalam mata uang regulator.</li>
        <li><strong>Berapa poin KPMM yang dimakan?</strong> — RWA baru / total RWA × KPMM saat ini = dampak basis poin. 'Memakan 30 bps KPMM' lebih didengar dari 'butuh modal besar'.</li>
        <li><strong>Apakah masih di atas appetite?</strong> — Bandingkan dengan target internal (bukan sekadar 8%). Di bawah appetite = butuh tambah modal dulu — usulan ditunda.</li>
        <li><strong>Berapa RAROC-nya?</strong> — Return per modal (CR21) ≥ hurdle? Di bawah hurdle = usulan ditolak walau KPMM cukup — modal terbatas harus ke return tertinggi.</li>
        <li><strong>Bagaimana saat stres?</strong> — Uji dengan skenario adverse: KPMM stres masih aman? Usulan yang lolos baseline tetapi jebol saat stres = usulan yang rapuh.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> latih dirimu: untuk setiap memo kredit, tulis 5 jawaban ini di 1 halaman. Analis yang membawa 1 halaman ini ke komite = analis yang didengar.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ KPMM 25% — apakah banknya 'terlalu aman'?</summary>
        <p>Mungkin <strong>tidak efisien</strong>: modal menganggur = ROE rendah = pemegang saham tidak senang. Tetapi 'terlalu aman' lebih baik dari 'kurang modal' — dan untuk bank Indonesia, 20%+ adalah <strong>normal</strong> (buffer trauma 1998 + D-SIB). Nilai optimal = cukup di atas batas + ruang tumbuh, bukan maksimal.</p>
      </details>
      <details className="worked">
        <summary>❓ Bisakah bank 'bermain' dengan RWA untuk menaikkan KPMM?</summary>
        <p>Bisa — dan itulah yang diawasi: <strong>RWA optimization</strong> yang agresif (memakai bobot terendah yang 'bisa dibenarkan') = manipulasi. OJK memvalidasi metodologi; output floor Basel III membatasi. Bank yang RWA-nya 'terlalu indah' = red flag bagi analis eksternal.</p>
      </details>
      <details className="worked">
        <summary>❓ Tier 1 vs Tier 2 — bedanya praktisnya?</summary>
        <p>Tier 1 (saham + laba ditahan) = <strong>menyerap rugi saat bank masih hidup</strong> (going concern). Tier 2 (subordinasi) = menyerap rugi saat <strong>likuidasi</strong> (gone concern). Krisis butuh Tier 1 — itulah mengapa regulator fokus ke CET1. Tier 2 besar + Tier 1 tipis = 'kuat di kertas, rapuh di krisis'.</p>
      </details>
      <details className="worked">
        <summary>❓ Mengapa OJK mewajibkan buffer di atas 8%?</summary>
        <p>Karena 8% adalah <strong>batas minimum</strong>, bukan target operasi. Buffer (conservation 2,5% + D-SIB) memastikan bank <strong>tidak langsung bermasalah</strong> saat rugi — ia 'memakan' buffer dulu dengan konsekuensi dividen dibatasi. Tanpa buffer, setiap guncangan = pelanggaran = krisis kepercayaan.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia punya kisah modal bank yang paling mahal dalam sejarahnya — dan kisah itu menjelaskan mengapa OJK begitu galak soal KPMM.</p>

      <h3>2008: Pelajaran Rp 6,7 Triliun Bernama Century</h3>
      <p>November 2008, krisis finansial global. Bank Century — bank kecil hasil merger — CAR-nya anjlok di bawah batas minimum dan gagal kliring. Pemerintah memutuskan <strong>bailout Rp 6,7 triliun</strong> (angka final; awalnya dikucurkan bertahap) dengan alasan <em>systemic risk</em>: membiarkannya kolaps dikhawatirkan memicu penarikan dana massal di bank-bank lain.</p>
      <p>Kontroversinya (menjadi skandal politik nasional, Pansus Century di DPR) bukan topik lesson ini. Yang relevan untuk analis risiko: <strong>inilah harga ketika modal bank jebol</strong> — bukan banknya saja yang rugi, melainkan uang negara yang turun tangan. Sejak itu, OJK/BI semakin ketat mengawasi KPMM, dan publik semakin paham: CAR bukan angka pajangan. Setiap kali kamu menghitung KPMM di Lab 1, ingatlah: di balik angka 8% ada Rp 6,7 triliun uang pajak yang pernah dipertaruhkan.</p>

      <h3>Arsitektur KPMM Indonesia Hari Ini</h3>
      <p>OJK mengadopsi Basel III melalui ketentuan KPMM. Struktur modal yang wajib dipahami analis:</p>
      <ul>
        <li><strong>Minimum 8%</strong> dari RWA — batas keras. Di bawah ini = bank bermasalah, OJK turun tangan (pembatasan dividen, ekspansi, bahkan pengambilalihan).</li>
        <li><strong>+ Capital conservation buffer 2,5%</strong> — "tabungan wajib". Bank boleh memakainya saat krisis, tapi konsekuensinya pembatasan dividen/bonus otomatis.</li>
        <li><strong>+ Surcharge bank sistemik (D-SIB)</strong> — bank-bank besar Indonesia (BRI, Mandiri, BCA, BNI, dsb.) dikenai tambahan 1–2,5% karena "terlalu besar untuk gagal".</li>
        <li><strong>+ Countercyclical buffer (0–2,5%)</strong> — bisa dinyalakan OJK saat kredit tumbuh terlalu panas.</li>
      </ul>
      <p>Efektifnya, bank besar Indonesia beroperasi dengan target KPMM <strong>di atas 20%</strong> — jauh di atas 8%. Inilah mengapa perbankan Indonesia terlihat "kelebihan modal": itu buffer yang disengaja, dibayar mahal oleh pemegang saham (ROE tertekan), demi stabilitas sistem.</p>

      <h3>Basel III Final: Output Floor</h3>
      <p>Reformasi Basel III tahap akhir (<em>Basel III finalisation</em>) memperkenalkan <strong>output floor 72,5%</strong>: RWA hasil model internal (IRB) tidak boleh lebih rendah dari 72,5% RWA Standardised Approach. Tujuannya: membatasi "penghematan modal" yang terlalu agresif via model. Bagi bank Indonesia yang berminat IRB, ini kabar penting — <strong>keuntungan modal IRB dibatasi</strong>, sehingga kalkulasi biaya-manfaat IRB (mahal!) harus dihitung ulang. Implementasi global bertahap hingga 2028+; OJK mengikuti dengan kalendernya sendiri.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: seberapa cepat modal terkikis (klik untuk buka)</summary>
        <p>Bank Maju: modal Rp 10 T, RWA Rp 80 T → KPMM = <strong>12,5%</strong> (sehat).</p>
        <p><strong>Langkah 1</strong> — krisis: NPL melonjak, CKPN Rp 3 T menggerus laba ditahan → modal turun ke Rp 7 T.<br />
        <strong>Langkah 2</strong> — downgrade rating debitur menaikkan bobot risiko → RWA naik ke Rp 90 T.<br />
        <strong>Langkah 3</strong> — KPMM baru = 7 / 90 = <strong>7,8%</strong> — di bawah 8%! Bank yang "sehat" 6 bulan lalu kini bank bermasalah.</p>
        <p><strong>Pelajaran:</strong> modal terkikis dari <strong>dua sisi sekaligus</strong> (pembilang turun, penyebut naik) — inilah <em>procyclicality</em> yang membuat krisis perbankan bergerak cepat. Buffer 2,5% ada untuk momen seperti ini: dipakai dulu sebelum menyentuh 8%.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Basel cuma urusan bank raksasa global — bank menengah Indonesia tidak perlu pusing."</strong></p>
        <p><strong>Yang benar:</strong> OJK menerapkan ketentuan KPMM ke <strong>semua bank umum</strong> di Indonesia, dengan prinsip proporsionalitas. Bank kecil memang boleh memakai SA yang sederhana — tetapi tetap wajib menghitung RWA, menjaga 8%, dan melaporkan ke OJK. "Terlalu kecil untuk diatur" tidak ada dalam kamus OJK pasca-Century.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Ekspansi Korporasi vs KPR</h2>
      <div className="callout">
        <p>Bank Nusantara (KPMM 13%, RWA Rp 40 T, modal Rp 5,2 T) punya dana Rp 2 T untuk ekspansi. Dua opsi:</p>
        <ul>
          <li><strong>Opsi KPR:</strong> Rp 2 T KPR LTV &lt;80% (bobot 35%) → RWA +Rp 700 M. Margin bunga bersih 3%.</li>
          <li><strong>Opsi Korporasi:</strong> Rp 2 T kredit korporasi tanpa rating (bobot 100%) → RWA +Rp 2 T. Margin bunga bersih 4%.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Hitung KPMM baru untuk tiap opsi. (b) Opsi mana yang "lebih murah" dari sisi modal per rupiah laba? (c) Sebagai analis, opsi mana yang kamu rekomendasikan dan dengan catatan apa?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>KPR:</strong> KPMM = 5,2 / 40,7 = <strong>12,78%</strong> (turun 0,22 poin). <strong>Korporasi:</strong> KPMM = 5,2 / 42 = <strong>12,38%</strong> (turun 0,62 poin — hampir 3× lipat!).</p>
          <p>(b) Laba: KPR = 2 T × 3% = Rp 60 M dengan "biaya modal" 700 M × 8% = Rp 56 M. Korporasi = 2 T × 4% = Rp 80 M dengan biaya modal 2 T × 8% = Rp 160 M. <strong>KPR jauh lebih efisien</strong> dari sisi konsumsi modal — inilah logika RAROC (CR21).</p>
          <p>(c) <strong>Rekomendasi: KPR</strong> — dengan catatan: pastikan LTV benar-benar &lt;80% (verifikasi appraisal!) dan sebar geografis (risiko konsentrasi, CR15). Margin korporasi yang terlihat lebih tinggi ternyata "palsu" setelah dihitung harga modalnya.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bank punya: Kas Rp 100 M (0%), SBN Rp 200 M (0%), KPR Rp 300 M (35%), Korporasi Rp 400 M (100%). Berapa RWA?"
        options={[
          "Rp 1.000 M",
          "Rp 505 M",
          "Rp 700 M",
          "Rp 400 M",
        ]}
        correct={1}
        explanation="Benar: 0 + 0 + 105 + 400 = Rp 505 M. Kas dan SBN tidak memakan modal sama sekali — separuh neraca 'gratis' dari sisi modal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bank dengan RWA Rp 505 M dan modal Rp 80 M. KPMM dan statusnya (batas 8%)?"
        options={[
          "15,8% — sehat, buffer lega",
          "6,3% — di bawah batas, kritis",
          "8,0% — pas di batas",
          "80% — salah hitung",
        ]}
        correct={0}
        explanation="Benar: 80/505 = 15,8% — jauh di atas 8%. Bank punya ruang ekspansi besar sebelum menyentuh batas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan IRB menjadi pilihan yang RASIONAL bagi bank?"
        options={[
          "Selalu — IRB lebih modern",
          "Tidak pernah — SA selalu lebih murah",
          "Jika bank punya data historis panjang, model tervalidasi, portofolio berkualitas, dan lolos approval OJK",
          "Jika bank ingin menghindari validasi",
        ]}
        correct={2}
        explanation="Benar: IRB = investasi. Baru kembali jika model menghasilkan bobot < SA secara konsisten DAN bank sanggup biaya validasi + pengawasan. Tanpa itu, SA adalah pilihan rasional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Saat krisis, KPMM bank cenderung tertekan karena…"
        options={[
          "Hanya karena modal turun",
          "RWA naik (migrasi rating/debitur memburuk) BERSAMAAN dengan modal tergerus rugi — jepitan dua sisi",
          "OJK menaikkan batas minimum",
          "Aset bank menyusut",
        ]}
        correct={1}
        explanation="Benar: jepitan dua sisi — penyebut membengkak saat pembilang menyusut. Inilah alasan Basel III mewajibkan capital buffer DI ATAS minimum 8%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Ekspansi Rp 2 T: KPR (bobot 35%, margin 3%) vs Korporasi tanpa rating (bobot 100%, margin 4%). Mana lebih efisien dari sisi modal?"
        options={[
          "Korporasi — margin 4% > 3%",
          "KPR — konsumsi RWA 2,8× lebih kecil untuk laba yang sebanding; 'harga modal' korporasi melahap keunggulannya",
          "Sama saja — asetnya sama Rp 2 T",
          "Tidak bisa dibandingkan tanpa data PD",
        ]}
        correct={1}
        explanation="Benar: KPR. Margin lebih tinggi tidak otomatis lebih baik — harus dibagi 'harga modal' (RWA × 8%). Inilah inti RAROC: return harus diukur PER UNIT modal yang dikonsumsi."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kasus Bank Century (2008): CAR anjlok di bawah minimum hingga negara menggelontorkan Rp 6,7 T. Pelajaran utama bagi analis risiko?"
        options={[
          "Bank kecil tidak penting bagi sistem",
          "Modal minimum adalah garis pertahanan terakhir — jebolnya modal bank memaksa uang publik turun tangan",
          "Bailout selalu menguntungkan negara",
          "CAR hanya formalitas laporan",
        ]}
        correct={1}
        explanation="Benar: modal adalah pertahanan terakhir sebelum uang publik dipertaruhkan. Century menunjukkan harga kegagalan modal = triliunan rupiah pajak + krisis kepercayaan. Itulah mengapa OJK galak soal KPMM."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Basel III final memperkenalkan output floor 72,5%. Artinya bagi bank yang ingin memakai IRB?"
        options={[
          "RWA model internal tidak boleh lebih rendah dari 72,5% RWA Standardised — penghematan modal via model dibatasi",
          "Modal minimum turun menjadi 72,5% dari sebelumnya",
          "Bank wajib punya 72,5% aset dalam bentuk kas",
          "Tidak ada dampak — hanya untuk bank Eropa",
        ]}
        correct={0}
        explanation="Benar: output floor membatasi seberapa 'hemat' model internal boleh menghitung RWA. Tujuannya mencegah penghematan modal agresif via model. Kalkulasi biaya-manfaat IRB harus memasukkan batas ini."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Basel 3 pilar:</strong> modal minimum (Pilar 1), review OJK (Pilar 2), transparansi pasar (Pilar 3).</li>
          <li><strong>RWA = Σ (aset × bobot risiko)</strong> — "kurs tukar" aset menjadi kebutuhan modal.</li>
          <li><strong>SA</strong> = bobot dari regulator (pasti, murah); <strong>IRB</strong> = bobot dari model internal PD/LGD/EAD (potensial hemat, mahal, diawasi).</li>
          <li><strong>KPMM = Modal / RWA</strong> — minimum 8% (+buffer). Speedometer kesehatan bank Indonesia.</li>
          <li><strong>Setiap keputusan kredit = pembelian RWA</strong> — analis hebat menghitung konsumsi modalnya.</li>
          <li>Kapan TIDAK mengejar KPMM setinggi-tingginya: modal menganggur = ROE rendah — bank adalah bisnis menyalurkan risiko dengan harga tepat, bukan menghindarinya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr3-pd-lgd-ead" className="btn btn-secondary btn-sm">← CR3</Link>
        <Link href="/learn/cr4b-ifrs9-psak71" className="btn btn-primary btn-sm">Next: CR4b →</Link>
      </div>
    </div>
  );
}
