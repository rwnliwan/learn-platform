"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr21Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const pricingWaterfallData = [
    {
      x: ["Cost of fund", "+ Biaya ops", "+ EL", "+ Modal (UL)", "+ Target laba", "= Bunga"],
      y: [6.0, 2.0, 1.8, 1.5, 1.2, 12.5],
      type: "bar",
      marker: { color: ["#94a3b8", "#94a3b8", "#ef9244", "#e8a838", "#3aa655", "#2a7de1"] },
      text: ["6%", "2%", "1,8%", "1,5%", "1,2%", "12,5%"],
      textposition: "outside",
    },
  ];

  const rarocData = [
    {
      x: ["KPR prima", "KMK UKM", "Kartu kredit", "Korporasi BB"],
      y: [22, 18, 25, 12],
      type: "bar",
      marker: { color: ["#3aa655", "#2a7de1", "#3aa655", "#ef4444"] },
      text: ["22%", "18%", "25%", "12%"],
      textposition: "outside",
    },
  ];

  const hurdleData = [
    {
      x: ["8%", "10%", "12%", "15%", "18%"],
      y: [12, 14, 16, 19, 22],
      type: "scatter",
      mode: "lines+markers",
      name: "Bunga minimum vs Hurdle rate",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator risk-based pricing — bangun bunga dari nol
# Komponen bunga kredit (%, per tahun):
cost_of_fund = 6.0   # bunga dana (deposito)
biaya_ops    = 2.0   # operasional + akuisisi
pd, lgd      = 0.04, 0.45
el           = pd * lgd * 100          # expected loss (%)
modal_ul     = 8.0   # % modal untuk UL (dari Vasicek)
target_roe   = 18.0  # target return on equity bank
biaya_modal  = modal_ul * target_roe / 100  # "sewa" modal
target_laba  = 1.2

bunga = cost_of_fund + biaya_ops + el + biaya_modal + target_laba
print(f"Cost of fund      : {cost_of_fund:.1f}%")
print(f"Biaya operasional : {biaya_ops:.1f}%")
print(f"EL (PDxLGD)       : {el:.1f}%")
print(f"Biaya modal (UL)  : {biaya_modal:.2f}%  (= {modal_ul}% modal x {target_roe}% ROE)")
print(f"Target laba       : {target_laba:.1f}%")
print(f"BUNGA MINIMUM     : {bunga:.2f}%")
print()
print("Coba: naikkan pd jadi 0.08 (2x lipat). Bunga naik berapa?")
print("Lalu naikkan target_roe jadi 25. Komponen mana paling sensitif?")
print("Inilah mengapa bank dengan target ROE tinggi HARUS pasang bunga tinggi.")`;

  const lab2Code = `# Lab 2: RAROC — apakah kredit ini layak?
# RAROC = (Pendapatan - Biaya - EL) / Modal ekonomis
def raroc(pendapatan, biaya_ops, el, modal_eko):
    return (pendapatan - biaya_ops - el) / modal_eko * 100

hurdle = 18.0  # target ROE bank
kasus = [
    ("KPR prima",      12.5, 2.0, 0.9, 35),
    ("KMK UKM",        14.0, 3.0, 2.2, 48),
    ("Kartu kredit",   24.0, 5.0, 6.5, 50),
    ("Korporasi BB",   10.5, 1.5, 1.8, 60),
]
print(f"{'Segmen':<14} {'RAROC':>7}  {'Keputusan':>10}")
for nama, pend, bop, el, me in kasus:
    r = raroc(pend, bop, el, me)
    kep = "TERIMA" if r >= hurdle else "TOLAK/DISKON"
    print(f"{nama:<14} {r:>6.1f}%  {kep:>10}")
print(f"\nHurdle rate: {hurdle}%")
print()
print("Perhatikan 'Korporasi BB': bunga 10.5% terlihat OK, tapi RAROC")
print("hanya 12% < 18% — DITOLAK (atau bunga dinaikkan).")
print("Inilah jebakan 'margin tinggi = bagus' — harus dibagi modalnya!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR21 — Credit Risk Analyst</span>
        <h1 className="display-title">Risk-Based Pricing &amp; RAROC:<br />Memberi Harga pada Risiko</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Harga untuk Satu Uang</a></li>
          <li><a href="#komponen">Anatomi Bunga: Lima Lapisan</a></li>
          <li><a href="#raroc">RAROC: Return per Rupiah Modal</a></li>
          <li><a href="#limit">Limit Setting: Pagar Pembatas</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator Risk-Based Pricing</a></li>
          <li><a href="#lab2">🔬 Lab 2: RAROC per Segmen</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Terima, Tolak, atau Naikkan Harga?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Perang Bunga KPR</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 5 komponen bunga kredit (cost of fund → target laba) dan menghitung bunga minimum.</li>
          <li>Menghitung RAROC dan menggunakannya untuk keputusan ACC/tolak/naikkan harga.</li>
          <li>Membedakan pricing berbasis EL vs berbasis modal (UL) — kapan masing-masing dominan.</li>
          <li>Merancang limit setting (plafon, tenor, konsentrasi) sebagai pelengkap pricing.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Harga untuk Satu Uang</h2>
      <div className="story">
        <p>Warung Bu Ani menjual <strong>gula yang sama</strong> dengan dua harga: Rp 18.000/kg untuk tetangga yang <strong>bayar tunai</strong>, Rp 20.000/kg untuk yang <strong>bon</strong> (bayar akhir bulan). <em>"Yang bon ada risiko tidak bayar — jadi harganya beda,"</em> katanya polos.</p>
        <p>Bu Ani baru saja menemukan <strong>risk-based pricing</strong> — harga yang mencerminkan risiko — tanpa kuliah keuangan.</p>
        <p>Bank melakukan hal yang sama dengan presisi matematis: KPR PNS bunga 7%, KTA wiraswasta 14%, kartu kredit 24%. Bukan karena bank "suka-suka" — melainkan karena <strong>lima lapisan biaya</strong> di balik bunga, dua di antaranya adalah <strong>harga risiko</strong> (EL dan modal untuk UL).</p>
        <p><strong>Twist-nya:</strong> banyak bank <em>gagal</em> menghitung dua lapisan itu — memberi bunga "kompetitif" yang ternyata <strong>di bawah harga risiko</strong>. Mereka tumbuh cepat... dan bangkrut pelan-pelan. Lesson ini memastikan kamu bisa menghitung harga yang benar.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="komponen">Anatomi Bunga: Lima Lapisan</h2>
      <p><strong>Definisi.</strong> Bunga kredit = tumpukan 5 komponen:</p>
      <ol>
        <li><strong>Cost of fund</strong> — harga dana bank (bunga deposito/obligasi). ~6%.</li>
        <li><strong>Biaya operasional</strong> — akuisisi, proses, collection. ~2%.</li>
        <li><strong>Expected Loss</strong> — PD × LGD (CR3). "Biaya" risiko rata-rata.</li>
        <li><strong>Biaya modal (UL)</strong> — modal ekonomis × target ROE. "Sewa" modal untuk kejutan.</li>
        <li><strong>Target laba</strong> — margin pemegang saham.</li>
      </ol>
      <Tex math={String.raw`\text{Bunga} = \text{CoF} + \text{Opex} + \text{EL} + (\text{Modal}_{\text{UL}} \times \text{ROE}_{\text{target}}) + \text{Margin}`} block />

      <PlotlyChart
        data={pricingWaterfallData}
        title="Anatomi Bunga 12,5%: Lima Lapisan (ilustrasi KTA)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu lapisan; batang terakhir = total bunga.</p>
        <p><strong>Interpretasi:</strong> dari 12,5%, hanya <strong>1,2% yang benar-benar "laba"</strong> — sisanya biaya! Dan <strong>3,3%</strong> (EL + modal) adalah <strong>harga risiko</strong>. Bank yang memberi bunga 10% "agar kompetitif" sebenarnya <strong>mensubsidi</strong> 2,5% — rugi struktural yang baru ketahuan 2 tahun kemudian.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dua lapisan risiko (EL + modal) adalah yang <strong>paling sering diremehkan</strong> — karena tidak terlihat di laporan laba hari ini. Cost of fund &amp; opex terlihat; EL baru terlihat saat macet; modal tidak terlihat sama sekali (opportunity cost). <strong>Analis pricing yang baik adalah "pengacara" dua lapisan tak terlihat ini.</strong></p>
      </div>

      <h2 id="raroc">RAROC: Return per Rupiah Modal</h2>
      <p><strong>Definisi.</strong> <strong>RAROC</strong> (<em>Risk-Adjusted Return on Capital</em>) = laba setelah risiko dibagi <strong>modal ekonomis</strong> (modal untuk UL):</p>
      <Tex math={String.raw`\text{RAROC} = \frac{\text{Pendapatan} - \text{Biaya} - \text{EL}}{\text{Modal Ekonomis}} \times 100\%`} block />
      <p><strong>Artinya:</strong> bukan "berapa laba", melainkan <strong>"berapa laba per rupiah modal yang dikunci"</strong>. Keputusan: RAROC ≥ hurdle rate (target ROE, misal 18%) → TERIMA; di bawah → TOLAK atau naikkan harga.</p>
      <p><strong>Kepribadian:</strong> RAROC seperti <strong>mengukur efisiensi bahan bakar</strong> — bukan "berapa jauh mobil melaju" (laba absolut), melainkan "berapa km per liter" (laba per modal). Mobil (kredit) yang larinya jauh tapi boros = tidak efisien.</p>

      <PlotlyChart
        data={rarocData}
        title="RAROC per Segmen vs Hurdle 18% (ilustrasi)"
        layout={{ xaxis: { title: "Segmen" }, yaxis: { title: "RAROC (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = RAROC segmen; garis imajiner 18% = hurdle rate.</p>
        <p><strong>Interpretasi:</strong> <strong>Korporasi BB (12%) di bawah hurdle</strong> — meski bunganya 10,5% dan "terlihat" menguntungkan! Modalnya besar (UL tinggi karena konsentrasi) sehingga return per modal kecil. <strong>Pelajaran:</strong> bunga tinggi ≠ bagus; RAROC yang menentukan. Inilah jebakan "margin" yang menjebak banyak bankir.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Bunga tinggi = kredit menguntungkan."</strong></p>
        <p><strong>Yang benar:</strong> kartu kredit bunga 24% dengan RAROC 25% (lolos hurdle) vs korporasi bunga 10,5% dengan RAROC 12% (gagal). <strong>Yang menentukan bukan bunga, melainkan bunga − EL − biaya, dibagi modal.</strong> Bunga tinggi dengan EL &amp; modal lebih tinggi = rugi yang mahal.</p>
      </div>

      <h2 id="limit">Limit Setting: Pagar Pembatas</h2>
      <p><strong>Definisi.</strong> <strong>Limit</strong> = batas maksimum eksposur: per debitur, per sektor, per produk, per tenor. Pricing mengatur <strong>harga</strong>; limit mengatur <strong>kuantitas</strong>. Keduanya harus jalan beriringan.</p>
      <p><strong>Jenis limit:</strong></p>
      <ul>
        <li><strong>Limit debitur</strong> — maks % modal (BMPK OJK) atau berbasis rating.</li>
        <li><strong>Limit sektor</strong> — maks % portofolio (misal: properti ≤15%).</li>
        <li><strong>Limit produk</strong> — maks % untuk produk berisiko (kartu kredit ≤10%).</li>
        <li><strong>Limit tenor</strong> — makin berisiko, makin pendek (KK 1 tahun vs KPR 20 tahun).</li>
      </ul>
      <p><strong>Kepribadian:</strong> jika pricing adalah <strong>harga tiket</strong>, limit adalah <strong>kapasitas stadion</strong> — tiket semahal apapun tidak berguna jika stadionnya roboh karena kelebihan muatan. Limit mencegah <strong>konsentrasi</strong> yang tidak bisa diatasi pricing (CR15).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada risiko yang <strong>tidak bisa di-harga-kan</strong> — hanya bisa di-batasi. Contoh: single-name Rp 1 T dengan PD 1% — bunganya "cukup" 8%, tapi jika default, bank goyang. <strong>Limit = pengakuan bahwa tidak semua risiko bisa dibeli dengan harga.</strong></p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Harga vs Pagar — Dua Alat yang Tidak Saling Menggantikan</h3>
      <p>Pricing (harga) dan limit (pagar) adalah <strong>dua alat untuk dua masalah berbeda</strong>. Harga menyelesaikan masalah <strong>rata-rata</strong>: EL yang bisa dihitung dicakup dalam bunga. Pagar menyelesaikan masalah <strong>ekor</strong>: risiko yang tidak bisa dihitung/di-harga-kan dengan wajar (single-name jumbo, konsentrasi sektor) hanya bisa dibatasi. Analis yang mencoba "meng-harga-kan" segalanya akan memberi bunga 40% ke debitur mustahil — yang tidak akan diambil siapapun (atau diambil oleh yang paling putus asa = adverse selection). <strong>Ada risiko yang harganya tak terhingga — untuknya, pagar adalah satu-satunya jawaban.</strong></p>
      <p>Intuisi kedua tentang RAROC: ia menjawab pertanyaan pemegang saham yang sebenarnya: <strong>"untuk setiap rupiah modal yang kukunci, berapa kembaliannya?"</strong> Laba Rp 100 M dengan modal Rp 1 T (RAROC 10%) <strong>lebih buruk</strong> dari laba Rp 30 M dengan modal Rp 150 M (RAROC 20%) — meski labanya 3× lipat! Inilah mengapa direksi (yang mewakili pemegang saham) terobsesi RAROC, bukan laba absolut. Analis yang mengusulkan kredit "laba besar" tanpa menghitung modalnya sedang mengusulkan <strong>pemborosan modal</strong> — dan akan ditolak oleh siapa pun yang paham.</p>
      <p>Intuisi ketiga: <strong>lima lapisan bunga</strong> (cost of fund, operasional, EL, modal, laba) adalah <strong>alat negosiasi</strong>. Saat debitur protes "bunga kalian mahal", analis yang bisa membedah — "3,3% dari 12,5% adalah harga risiko Bapak (EL+modal); bank lain yang menawarkan 10% entah meremehkan risiko Bapak atau membakar modalnya" — mengubah negosiasi dari tawar-menawar menjadi <strong>edukasi</strong>. Nasabah yang paham harga risikonya sendiri = nasabah yang tidak kabur karena selisih 0,5%.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator Risk-Based Pricing</h2>
      <p>Susun bunga dari 5 lapisan — dan lihat mana yang paling sensitif.</p>
      <PyodideLab
        title="Lab 1 — Anatomi Bunga"
        hint="Coba: (1) pd 0.04 → 0.08. (2) target_roe 18 → 25. (3) Bandingkan: menaikkan PD vs menaikkan ROE — mana yang lebih 'mahal' bagi nasabah?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: RAROC per Segmen</h2>
      <p>Empat segmen, satu hurdle. Mana yang lolos?</p>
      <PyodideLab
        title="Lab 2 — RAROC Decision"
        hint="Ubah hurdle jadi 15 atau 22 — berapa segmen lolos? Diskusikan: hurdle DITURUNKAN agar semua lolos = keputusan bisnis atau manipulasi? (Jawaban: hurdle = biaya modal pemegang saham; menurunkannya tanpa dasar = mensubsidi.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Terima, Tolak, atau Naikkan Harga?</h2>

      <div className="decision-card">
        <h3>1. RAROC ≥ hurdle → <strong>TERIMA</strong></h3>
        <p><strong>Kondisi:</strong> harga menutup semua lapisan + target.</p>
        <p><strong>Aksi:</strong> ACC dengan limit wajar. Monitor berkala.</p>
      </div>

      <div className="decision-card">
        <h3>2. RAROC &lt; hurdle tapi dekat → <strong>NAIKKAN HARGA / tambah mitigasi</strong></h3>
        <p><strong>Kondisi:</strong> selisih 2–5 poin.</p>
        <p><strong>Aksi:</strong> bunga +1–2%, atau minta agunan tambahan (turunkan LGD → naikkan RAROC), atau perpendek tenor.</p>
      </div>

      <div className="decision-card">
        <h3>3. RAROC jauh di bawah hurdle → <strong>TOLAK</strong></h3>
        <p><strong>Kondisi:</strong> selisih &gt;5 poin.</p>
        <p><strong>Kenapa:</strong> menaikkan bunga secukupnya akan membuat nasabah kabur (adverse selection: yang mau bayar bunga 25% = yang paling berisiko!).</p>
      </div>

      <div className="decision-card">
        <h3>4. Risiko tidak bisa di-harga-kan → <strong>LIMIT (bukan harga)</strong></h3>
        <p><strong>Kondisi:</strong> konsentrasi single-name/sektor.</p>
        <p><strong>Aksi:</strong> batasi kuantitas. Harga tidak menyelesaikan konsentrasi.</p>
      </div>

      <PlotlyChart
        data={hurdleData}
        title="Bunga Minimum vs Hurdle Rate (ilustrasi sensitivitas)"
        layout={{ xaxis: { title: "Hurdle rate (target ROE %)" }, yaxis: { title: "Bunga minimum (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = bunga minimum yang dibutuhkan untuk tiap target ROE.</p>
        <p><strong>Interpretasi:</strong> hubungan <strong>linear menanjak</strong>: target ROE 18% → bunga min ~14%; target 12% → ~11%. <strong>Pelajaran strategis:</strong> bank dengan target ROE agresif <strong>tidak bisa</strong> bersaing di segmen bunga murah — ia harus bermain di segmen berisiko (dengan pricing tepat) atau menurunkan targetnya. Strategi bisnis = pilihan hurdle.</p>
      </div>

            <div className="decision-card">
        <h3>5. Debitur korporasi bagus minta bunga di bawah break-even ("bank lain berani 9%") → <strong>jangan ikut bakar modal; tawarkan struktur</strong></h3>
        <p><strong>Kondisi:</strong> debitur rating A minta bunga 9% — di bawah break-even-mu (10,2%). Ia mengancam pindah ke bank kompetitor yang "berani 9%". Bisnis panik kehilangan nasabah besar.</p>
        <p><strong>Aksi:</strong> <strong>jangan samakan harga dengan membakar modal</strong> — tetapi jangan juga melepas mentah-mentah. Opsi: (1) <strong>bedah lima lapis</strong> ke debitur — tunjukkan bahwa 9% berarti bank <strong>merugi</strong> setelah risiko (edukasi, bukan emosi); (2) <strong>tawarkan struktur</strong>: bunga 9,5% + agunan tambahan (LGD turun → break-even turun) atau tenor lebih pendek (UL turun); (3) <strong>kecilkan plafon</strong> — layani sebagian di harga wajar, sisanya silakan ke kompetitor. Jika kompetitor berani 9%, <strong>mungkin model risikonya berbeda — atau mungkin ia sedang membakar modalnya</strong>. Jangan ikut membakar milikmu untuk memenangkan satu nasabah.</p>
        <p><strong>Contoh nyata:</strong> perang bunga korporasi selalu ada pemenangnya (nasabah) dan pecundangnya (bank yang pricing-nya jebol lalu NPL). Bank yang disiplin pricing mungkin kehilangan beberapa nasabah — tetapi memenangkan <strong>perang profitabilitas</strong> jangka panjang.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Bunga = 5 lapisan.</strong> Jangan lupakan EL + biaya modal.</li>
          <li><strong>RAROC ≥ hurdle = terima.</strong> Bunga tinggi ≠ bagus.</li>
          <li><strong>Adverse selection:</strong> bunga terlalu tinggi mengusir yang bagus.</li>
          <li><strong>Limit untuk yang tak bisa di-harga-kan.</strong></li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Membedah Bunga: Template 5 Lapis</h3>
      <p>Setiap proposal kredit harus menyertakan bedah 5 lapis ini. Jika satu lapis tidak bisa diisi = analisis belum selesai.</p>
      <ol>
        <li><strong>Lapis 1 — Cost of fund</strong> — Berapa harga dana bank saat ini? (deposito + obligasi, rata-rata tertimbang). Bukan 'kira-kira 6%' — melainkan angka treasury terkini.</li>
        <li><strong>Lapis 2 — Biaya operasional</strong> — Akuisisi + proses + collection per segmen. Ritel massal: tinggi per rupiah (tetapi skala besar). Korporasi: rendah per rupiah (tetapi custom).</li>
        <li><strong>Lapis 3 — Expected Loss</strong> — PD × LGD dari model (bukan 'feeling'). Untuk pricing: PD PIT terkini. Dokumentasikan sumbernya.</li>
        <li><strong>Lapis 4 — Biaya modal</strong> — Modal ekonomis (untuk UL) × target ROE. Lapis yang paling sering 'lupa' — dan paling mahal jika lupa.</li>
        <li><strong>Lapis 5 — Margin</strong> — Target laba pemegang saham. Bukan 'sisa' — melainkan target eksplisit (misal 1–2%). Jika 5 lapis dijumlah &gt; bunga pasar = segmen tidak layak (atau bank tidak efisien).</li>
        <li><strong>Uji kewajaran:</strong> — Bandingkan bunga hasil bedah vs bunga pasar. Selisih &gt;2% = salah satu lapis salah hitung — cari.</li>
        <li><strong>Dokumentasikan:</strong> — Setiap lapis punya sumber angka. 'Bunga 12%' tanpa bedah = harga tanpa dasar = tidak bisa dipertahankan saat ditantang.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> wajibkan template ini untuk setiap proposal di atas Rp 10 M. Pricing tanpa bedah = tebak-tebakan yang mahal.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Bunga impas di bawah bunga pasar — apa artinya?</summary>
        <p>Artinya bank <strong>tidak efisien atau risikonya terlalu tinggi</strong> untuk segmen itu. Pilihan: (1) perbaiki efisiensi (turunkan opex/CoF), (2) perbaiki risiko (seleksi lebih ketat → EL turun), atau (3) <strong>keluar dari segmen</strong>. Memaksa masuk dengan bunga pasar = bakar modal.</p>
      </details>
      <details className="worked">
        <summary>❓ RAROC vs ROE — bedanya?</summary>
        <p><strong>ROE</strong> = laba / ekuitas (akuntansi, seluruh bank). <strong>RAROC</strong> = laba setelah risiko / modal ekonomis (per keputusan/satuan bisnis). RAROC adalah 'ROE yang sudah dibersihkan dari risiko' — untuk <strong>keputusan alokasi</strong>. ROE untuk laporan; RAROC untuk keputusan.</p>
      </details>
      <details className="worked">
        <summary>❓ Hurdle rate — siapa yang menetapkan?</summary>
        <p><strong>Direksi + komisaris</strong> (bukan analis) — berbasis target ROE pemegang saham + biaya modal. Analis <strong>memakai</strong> hurdle, bukan menetapkan. Tetapi analis wajib <strong>menantang</strong> jika hurdle tidak realistis (terlalu tinggi = tidak ada bisnis yang lolos; terlalu rendah = modal dihamburkan).</p>
      </details>
      <details className="worked">
        <summary>❓ Limit vs pricing — kapan pakai mana?</summary>
        <p><strong>Pricing</strong> untuk risiko yang bisa dihitung (EL) — 'bayar lebih untuk risiko lebih'. <strong>Limit</strong> untuk risiko yang tidak bisa di-harga-kan wajar (konsentrasi, ketidakpastian ekstrem) — 'tidak boleh, berapapun harganya'. Keduanya dipakai bersama — bukan salah satu.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Pricing kredit di Indonesia dibentuk oleh struktur biaya, regulasi, dan kompetisi yang khas.</p>

      <h3>Struktur Bunga Indonesia: Mengapa Berlapis-lapis</h3>
      <p>Suku bunga kredit Indonesia termasuk <strong>tinggi</strong> dibanding negara maju — dan lima lapisannya menjelaskan mengapa:</p>
      <ul>
        <li><strong>Cost of fund ~6%:</strong> bunga deposito Indonesia tinggi (inflasi + premi risiko negara). Bank tidak bisa memberi kredit di bawah harga dananya sendiri.</li>
        <li><strong>Operasional ~2%:</strong> akuisisi, verifikasi lapangan (mahal untuk UMKM!), collection — ekonomi Indonesia yang geografisnya luas membuat operasional mahal.</li>
        <li><strong>EL:</strong> bervariasi 1–8% tergantung segmen (CR3).</li>
        <li><strong>Biaya modal:</strong> modal mahal (target ROE 15–18%) × UL — untuk segmen berisiko, lapis ini besar.</li>
      </ul>
      <p>Total: KPR ~8–10%, KMK ~10–13%, KTA/kartu kredit ~18–30%. Setiap lapis bisa diaudit — dan <strong>harus</strong> bisa diaudit saat debitur atau OJK bertanya.</p>

      <h3>KUR: Pricing yang Disubsidi Negara</h3>
      <p>KUR adalah <strong>anomali pricing</strong>: bunga 6% jauh di bawah "harga pasar" 11%+ (CR1). Selisihnya dibayar negara sebagai subsidi. Bagi analis, KUR mengajarkan: <strong>harga tidak selalu = risiko</strong> — ada harga yang dibentuk kebijakan. Tetapi risikonya tetap nyata (bank menanggung NPL-nya), sehingga <strong>seleksi tidak boleh longgar</strong> hanya karena "bunganya murah". Harga murah + seleksi longgar = bencana yang disubsidi.</p>

      <h3>Batas Bunga dan Perlindungan Konsumen</h3>
      <p>OJK mengatur <strong>batas bunga</strong> untuk produk tertentu (kartu kredit, pinjol) demi perlindungan konsumen. Implikasinya untuk pricing: jika batas bunga <strong>di bawah</strong> bunga impas (break-even) suatu segmen, bank <strong>tidak boleh</strong> "mengakali" dengan biaya tersembunyi — ia harus <strong>memperketat seleksi</strong> (menurunkan EL) atau <strong>keluar dari segmen</strong> itu. Inilah mekanisme pasar yang sehat: batas bunga memaksa bank menjadi <strong>lebih baik dalam memilih risiko</strong>, bukan lebih licik dalam menyembunyikan harga.</p>

      <h3>RAROC dan Hurdle Rate di Bank Indonesia</h3>
      <p>Bank-bank besar Indonesia memakai <strong>hurdle rate</strong> 15–20% (target ROE) untuk RAROC. Praktiknya: setiap proposal kredit korporasi besar mencantumkan <strong>RAROC</strong> — di bawah hurdle = tolak (atau minta pricing lebih tinggi / struktur lebih aman). Inilah mengapa "bunga 10,5% terlihat menguntungkan" bisa ditolak: RAROC-nya 12% &lt; hurdle 18%. <strong>Bunga tanpa RAROC = harga tanpa biaya modal = ilusi.</strong></p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: RAROC dua segmen (klik untuk buka)</summary>
        <p>Hurdle rate 18%. Modal ekonomis = 12% × RWA (ilustrasi).</p>
        <p><strong>Segmen A — KPR Rp 100 M:</strong> bunga 9%, CoF 6%, Opex 1%, EL 0,5% → laba = 100 × (9−6−1−0,5)% = Rp 1,5 M. RWA = 35% × 100 = 35 → modal = 12% × 35 = Rp 4,2 M. RAROC = 1,5/4,2 = <strong>35,7%</strong> ✓ (jauh di atas hurdle!).<br />
        <strong>Segmen B — Korporasi Rp 100 M:</strong> bunga 10,5%, CoF 6%, Opex 0,5%, EL 1,2% → laba = 100 × (10,5−6−0,5−1,2)% = Rp 2,8 M. RWA = 100% × 100 = 100 → modal = Rp 12 M. RAROC = 2,8/12 = <strong>23,3%</strong> ✓ (lolos, tetapi...).</p>
        <p><strong>Interpretasi:</strong> keduanya lolos hurdle — tetapi KPR <strong>jauh lebih efisien modal</strong> (35,7% vs 23,3%). Jika modal terbatas (KPMM mepet), bank memprioritaskan KPR — <strong>bukan karena labanya lebih besar</strong> (Rp 1,5 M &lt; Rp 2,8 M!), melainkan karena <strong>return per rupiah modal</strong> lebih tinggi. Inilah logika alokasi modal yang menggerakkan strategi bank.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kredit dengan laba absolut terbesar = kredit terbaik."</strong></p>
        <p><strong>Yang benar:</strong> contoh di atas membuktikan sebaliknya: korporasi laba Rp 2,8 M vs KPR Rp 1,5 M — tetapi RAROC KPR (35,7%) jauh di atas korporasi (23,3%). Pemegang saham dibayar dari <strong>return per modal</strong>, bukan laba absolut. Mengabaikan modal = mengabaikan biaya sesungguhnya.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Perang Bunga KPR</h2>
      <div className="callout">
        <p>Kompetitor meluncurkan <strong>KPR bunga 5,5%</strong> (pasar: 7%). Direksi Bank Nusantara panik: <em>"Ikuti! Kalau tidak, nasabah kabur!"</em> Datamu:</p>
        <ul>
          <li>Cost of fund 6% + opex 1% = <strong>7%</strong> — bunga 5,5% sudah <strong>di bawah biaya dasar</strong>!</li>
          <li>EL KPR 0,9% + biaya modal 1,1% + margin target 1% → bunga minimum sehat = <strong>10%</strong>.</li>
          <li>Kompetitor kemungkinan <strong>promo 1 tahun</strong> (floating setelahnya) atau <strong>mensubsidi</strong> untuk akuisisi.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> ikuti perang bunga? Susun respons 3 poin.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Jangan ikuti membabi buta.</strong> Tiga poin:</p>
          <p>(1) <strong>Matematika tidak berbohong:</strong> 5,5% &lt; 7% (CoF+opex) = <strong>rugi pasti</strong> sebelum risiko dihitung. Mengikuti = mensubsidi nasabah dengan modal pemegang saham.<br />
          (2) <strong>Adverse selection:</strong> nasabah yang pindah karena bunga termurah = yang paling sensitif harga = cenderung <strong>risiko lebih tinggi</strong> (yang bagus tidak repot pindah demi 1,5%).<br />
          (3) <strong>Respons cerdas:</strong> promo <strong>terbatas</strong> (1 tahun fixed, lalu floating normal) + unggulkan <strong>layanan</strong> (proses cepat, fleksibilitas) — bersaing di <em>value</em>, bukan <em>price</em>. Atau: ikuti <strong>selektif</strong> hanya untuk segmen prima (PD rendah → EL kecil → bunga minimum lebih rendah).</p>
          <p>Pelajaran: <strong>perang harga tanpa perhitungan RAROC = bunuh diri bersama</strong> — pemenangnya yang paling cepat sadar.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Laba Besar vs RAROC — Mana yang Dipilih?</h2>
      <div className="callout">
        <p>Modal terbatas (KPMM mepet 10%). Dua proposal, masing-masing butuh plafon Rp 100 M — hanya satu yang bisa disetujui:</p>
        <ul>
          <li><strong>Proposal X — Korporasi:</strong> bunga 11%, laba (setelah semua biaya + EL) Rp 3,2 M, RWA Rp 100 M.</li>
          <li><strong>Proposal Y — KPR massal:</strong> bunga 9%, laba Rp 1,6 M, RWA Rp 35 M.</li>
          <li>Hurdle rate 18%. Modal ekonomis = 12% × RWA.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> direksi tergoda X ("labanya 2× lipat!"). Hitung RAROC keduanya dan beri rekomendasi.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>RAROC X:</strong> modal = 12% × 100 = Rp 12 M → 3,2/12 = <strong>26,7%</strong> ✓.<br />
          <strong>RAROC Y:</strong> modal = 12% × 35 = Rp 4,2 M → 1,6/4,2 = <strong>38,1%</strong> ✓.</p>
          <p><strong>Rekomendasi: pilih Y.</strong> Keduanya lolos hurdle — tetapi Y menghasilkan <strong>38,1% per rupiah modal</strong> vs 26,7%. Dengan modal terbatas, Y "membayar" modalnya jauh lebih baik. Sisa modal (Rp 7,8 M yang tidak dipakai X) bisa dipakai untuk <strong>dua Y lagi</strong> — total laba 3 × 1,6 = Rp 4,8 M &gt; Rp 3,2 M!</p>
          <p>Kalimat ke direksi: <em>"X labanya lebih besar, tetapi Y lebih efisien modal — dan dengan modal yang sama kita bisa mendanai tiga Y. Laba total: Rp 4,8 M vs Rp 3,2 M. Modal terbatas harus dipakai untuk return tertinggi, bukan laba terbesar."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Komponen bunga kredit yang PALING sering diremehkan?"
        options={[
          "Cost of fund",
          "EL + biaya modal (UL) — tidak terlihat di laba hari ini, tapi menentukan apakah bunga menutup risiko",
          "Biaya operasional",
          "Target laba",
        ]}
        correct={1}
        explanation="Benar: dua lapisan tak terlihat. CoF & opex terlihat; EL baru terlihat saat macet; biaya modal tidak terlihat sama sekali."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kredit: pendapatan 14%, biaya 3%, EL 2,2%, modal ekonomis 48%. RAROC? (hurdle 18%)"
        options={[
          "18,3% — terima",
          "8,8/48 = 18,3% — pas di hurdle, terima (mepet!)",
          "29% — terima",
          "10% — tolak",
        ]}
        correct={1}
        explanation="Benar: (14−3−2,2)/48 = 18,3% — lolos tipis. Mepet = sensitif: EL naik sedikit saja langsung gagal. Pertimbangkan buffer."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa bunga SANGAT tinggi bisa kontraproduktif?"
        options={[
          "Tidak pernah — makin tinggi makin untung",
          "Adverse selection: nasabah bagus kabur (dapat bunga murah di tempat lain), yang tersisa = yang paling berisiko — PD naik mengalahkan kenaikan bunga",
          "Regulasi melarang",
          "Nasabah suka bunga tinggi",
        ]}
        correct={1}
        explanation="Benar: harga menyaring kualitas. Bunga 30% tidak menarik nasabah prima — hanya yang putus asa. Kenaikan bunga ≠ kenaikan laba."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Single-name Rp 1 T, PD 1%, bunga 8% (RAROC lolos). Masalahnya?"
        options={[
          "Tidak ada — RAROC lolos",
          "Konsentrasi: jika default, bank goyang — risiko ini tidak bisa di-harga-kan, hanya bisa di-batasi (limit)",
          "Bunga kurang tinggi",
          "PD terlalu rendah",
        ]}
        correct={1}
        explanation="Benar: limit untuk yang tak bisa di-harga-kan. RAROC mengukur rata-rata; konsentrasi = ekor. Keduanya harus dipakai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kompetitor KPR 5,5% (di bawah CoF+opex 7%). Respons terbaik?"
        options={[
          "Ikuti 5% — rebut pasar",
          "Jangan ikuti membabi buta: rugi pasti; waspadai adverse selection; respons via promo terbatas/value/layanan — atau ikuti selektif segmen prima",
          "Tutup bisnis KPR",
          "Laporkan ke OJK",
        ]}
        correct={1}
        explanation="Benar: matematika tidak berbohong — 5,5% < biaya dasar = subsidi. Perang harga tanpa RAROC = bunuh diri bersama."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Proposal X laba Rp 3,2 M (RAROC 26,7%), proposal Y laba Rp 1,6 M (RAROC 38,1%), modal terbatas. Mana yang dipilih dan mengapa?"
        options={[
          "X — labanya 2× lipat",
          "Y — return per rupiah modal lebih tinggi; dengan modal yang sama bisa mendanai 3× Y (total laba Rp 4,8 M > Rp 3,2 M)",
          "Keduanya — langgar saja KPMM",
          "Tolak keduanya",
        ]}
        correct={1}
        explanation="Benar: Y. Pemegang saham dibayar dari return per modal, bukan laba absolut. Modal terbatas = alokasikan ke RAROC tertinggi. Tiga Y mengalahkan satu X."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Kompetitor menawarkan bunga di bawah break-even-mu ke nasabah bagus. Respons terbaik?"
        options={[
          "Samakan harganya — jangan kehilangan nasabah",
          "Tolak mentah-mentah",
          "Jangan bakar modal: bedah lima lapis (edukasi), tawarkan struktur (agunan/tenor/plafon) agar break-even turun — harga tanpa RAROC = ilusi",
          "Laporkan kompetitor ke OJK",
        ]}
        correct={2}
        explanation="Benar: disiplin pricing. Bedah lapisan untuk edukasi, lalu struktur ulang agar harga wajar tercapai (agunan menurunkan LGD, tenor pendek menurunkan UL). Ikut-ikutan harga di bawah break-even = membakar modal sendiri."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Bunga = CoF + opex + EL + biaya modal + margin.</strong> Dua tengah = harga risiko.</li>
          <li><strong>RAROC = (pendapatan − biaya − EL) / modal ekonomis.</strong> ≥ hurdle = terima.</li>
          <li><strong>Bunga tinggi ≠ untung.</strong> Adverse selection mengintai.</li>
          <li><strong>Limit</strong> untuk risiko yang tak bisa di-harga-kan (konsentrasi).</li>
          <li><strong>Perang harga tanpa RAROC = bunuh diri.</strong></li>
          <li>Kapan TIDAK pakai RAROC kaku: nasabah strategis (cross-sell besar) — tapi hitung <em>total relationship RAROC</em>, bukan per produk.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr20-monitoring-kri" className="btn btn-secondary btn-sm">← CR20</Link>
        <Link href="/learn/cr22-collection-recovery" className="btn btn-primary btn-sm">Next: CR22 →</Link>
      </div>
    </div>
  );
}
