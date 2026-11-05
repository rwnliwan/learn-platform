"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr16Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const migrationData = [
    {
      x: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"],
      y: [92, 88, 85, 80, 72, 60, 45],
      type: "bar",
      name: "Tetap (%)",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"],
      y: [7, 10, 12, 15, 20, 28, 35],
      type: "bar",
      name: "Downgrade (%)",
      marker: { color: "#ef9244" },
    },
    {
      x: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"],
      y: [1, 2, 3, 5, 8, 12, 20],
      type: "bar",
      name: "Default (%)",
      marker: { color: "#ef4444" },
    },
  ];

  const stressData = [
    {
      x: ["Baseline", "Stres ringan", "Stres berat"],
      y: [14, 13.2, 11.5],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["14,0%", "13,2%", "11,5%"],
      textposition: "outside",
      name: "KPMM",
    },
  ];

  const reverseData = [
    {
      x: ["NPL 5%", "NPL 8%", "NPL 12%", "NPL 15%"],
      y: [13.0, 11.8, 9.5, 7.2],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#ef4444", width: 3 },
      name: "KPMM vs NPL",
    },
  ];

  const lab1Code = `# Lab 1: Migration matrix — memutar rating setahun ke depan
# Matriks transisi (baris=rating awal, kolom=rating akhir 1 thn).
# Hitung distribusi rating portofolio tahun depan.
rating = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "D"]
# [tetap, downgrade 1, downgrade 2+, default] — disederhanakan
migrasi = {
    "AAA": [0.92, 0.07, 0.01, 0.00],
    "AA":  [0.05, 0.85, 0.09, 0.01],
    "A":   [0.03, 0.10, 0.82, 0.05],
    "BBB": [0.02, 0.05, 0.80, 0.13],
    "BB":  [0.01, 0.03, 0.75, 0.21],
}
portofolio = {"AAA": 100, "AA": 200, "A": 300, "BBB": 250, "BB": 150}  # Rp M

default_baru = 0
for r, nilai in portofolio.items():
    t, d1, d2, df = migrasi[r]
    default_baru += nilai * df
    print(f"{r:<4}: Rp {nilai:>4}M -> default Rp {nilai*df:>6.1f}M")

print(f"\nTotal default baru setahun: Rp {default_baru:.1f}M")
print(f"dari Rp {sum(portofolio.values())}M = {default_baru/sum(portofolio.values())*100:.2f}%")
print()
print("Coba: skenario stres — gandakan kolom default (df*2, kurangi 'tetap').")
print("Itulah stress migration: matriks yang 'miring ke bawah'.")`;

  const lab2Code = `# Lab 2: Stress test KPMM — apakah bank selamat?
# Skenario: NPL naik -> CKPN naik (laba turun) + RWA naik (migrasi).
modal_awal = 5200   # Rp M
rwa_awal = 40000    # Rp M
npl_awal = 0.025

def stress_test(npl_stress):
    # CKPN tambahan: (npl naik) x coverage 60% x total kredit 50.000M
    ckpn_tambahan = (npl_stress - npl_awal) * 50000 * 0.60
    modal = modal_awal - ckpn_tambahan
    # RWA naik 15% per 5pp kenaikan NPL (migrasi rating)
    rwa = rwa_awal * (1 + (npl_stress - npl_awal) * 3)
    kpmm = modal / rwa * 100
    return ckpn_tambahan, modal, rwa, kpmm

print(f"{'Skenario':<14} {'NPL':>6} {'CKPN+':>8} {'KPMM':>7} {'Status':>10}")
for nama, npl in [("Baseline", 0.025), ("Ringan", 0.05), ("Berat", 0.10)]:
    c, m, rwa, k = stress_test(npl)
    status = "AMAN" if k >= 12 else ("WASPADA" if k >= 9 else "KRITIS!")
    print(f"{nama:<14} {npl*100:>5.1f}% {c:>7.0f}M {k:>6.2f}% {status:>10}")
print()
print("Perhatikan jepitan dua sisi (CR4a): modal turun + RWA naik.")
print("Coba: ubah coverage 0.60 -> 0.80. KPMM stres berat makin dalam.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR16 — Credit Risk Analyst</span>
        <h1 className="display-title">Stress Test:<br />Menyiksa Portofolio di Atas Kertas</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Latihan Kebakaran yang Menyelamatkan Bank</a></li>
          <li><a href="#konsep">Stress Test: Skenario Buruk yang Disengaja</a></li>
          <li><a href="#migrasi">Migration Matrix: Peta Perpindahan Rating</a></li>
          <li><a href="#reverse">Reverse Stress Test: Mencari Titik Mati</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Migration Matrix</a></li>
          <li><a href="#lab2">🔬 Lab 2: Stress Test KPMM</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Merancang Skenario</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Skenario "Terlalu Ekstrem"?</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tujuan stress test dan merancang skenario (baseline, adverse, severely adverse).</li>
          <li>Membaca migration matrix dan menggunakannya untuk memproyeksikan default.</li>
          <li>Menghitung dampak skenario stres ke CKPN, modal, dan KPMM.</li>
          <li>Menjelaskan reverse stress test dan menggunakannya untuk menetapkan risk appetite.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Latihan Kebakaran yang Menyelamatkan Bank</h2>
      <div className="story">
        <p>Setiap tahun, gedung Bank Nusantara mengadakan <strong>latihan kebakaran</strong> — alarm berbunyi, semua turun lewat tangga darurat. Tidak ada api sungguhan. Tapi saat kebakaran <em>betulan</em> terjadi di 2023, evakuasi berjalan mulus: tidak ada korban.</p>
        <p><strong>Stress test</strong> adalah latihan kebakaran untuk neraca bank: <em>"bagaimana jika pengangguran 12%, harga properti jatuh 40%, rupiah melemah 30% — <strong>bersamaan</strong>?"</em> Tidak ada krisis sungguhan — tapi bank menghitung: berapa CKPN tambahan? Berapa KPMM tersisa? Tindakan apa yang disiapkan?</p>
        <p>Bank yang rajin latihan (dan <strong>bertindak</strong> atas hasilnya: tambah modal, kurangi eksposur) selamat dari 2008, 2020. Bank yang menganggapnya formalitas... tidak ada di sini untuk bercerita.</p>
        <p><strong>Twist-nya:</strong> stress test terbaik bukan yang skenarionya paling seram — melainkan yang <strong>hasilnya mengubah keputusan</strong>. Lesson ini mengajarkan cara merancangnya agar tidak menjadi formalitas.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="konsep">Stress Test: Skenario Buruk yang Disengaja</h2>
      <p><strong>Definisi.</strong> <strong>Stress test</strong> = menghitung dampak <strong>skenario ekonomi buruk</strong> (tapi <em>plausible</em>) terhadap kerugian, laba, dan modal bank. Tiga jenis skenario:</p>
      <ul>
        <li><strong>Baseline</strong> — proyeksi normal (untuk perbandingan).</li>
        <li><strong>Adverse</strong> — resesi moderat (misal: GDP −2%, pengangguran 9%).</li>
        <li><strong>Severely adverse</strong> — krisis berat (GDP −5%, pengangguran 12%, properti −40%).</li>
      </ul>
      <p><strong>Rantai transmisi</strong> (mekanisme stres → neraca):</p>
      <ol>
        <li>Skenario makro → <strong>model satelit</strong> (CR11) → PD/LGD naik.</li>
        <li>PD/LGD naik → <strong>ECL/CKPN naik</strong> → laba turun → <strong>modal turun</strong>.</li>
        <li>Migrasi rating → <strong>RWA naik</strong> (bobot risiko naik).</li>
        <li>Modal turun + RWA naik → <strong>KPMM jatuh</strong> (jepitan dua sisi!).</li>
      </ol>
      <p><strong>Kepribadian:</strong> stress test seperti <strong>simulasi gempa untuk gedung</strong> — insinyur tidak menunggu gempa betulan untuk tahu gedungnya roboh di skala berapa. Tujuannya bukan meramal gempa, melainkan <strong>memastikan gedung tidak roboh saat gempa datang</strong>.</p>

      <PlotlyChart
        data={stressData}
        title="Dampak Skenario ke KPMM (ilustrasi)"
        layout={{ xaxis: { title: "Skenario" }, yaxis: { title: "KPMM (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = KPMM hasil simulasi skenario (dari 14% baseline).</p>
        <p><strong>Interpretasi:</strong> stres berat → KPMM 11,5% — masih di atas 8%, tapi buffer menipis. <strong>Keputusan yang diambil dari sini:</strong> tambah modal? Kurangi eksposur berisiko? Batasi dividen? Stress test yang tidak menghasilkan <strong>action plan</strong> = latihan kebakaran tanpa tangga darurat.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> skenario harus <strong>parah tapi masuk akal</strong> (<em>severe but plausible</em>). Terlalu ringan = tidak menguji apa-apa. Terlalu ekstrem ("meteor jatuh") = tidak ada yang bertindak (dianggap fiksi). Patokan: <strong>lebih buruk dari resesi historis terburuk</strong>, tapi masih bisa dibayangkan terjadi.</p>
      </div>

      <h2 id="migrasi">Migration Matrix: Peta Perpindahan Rating</h2>
      <p><strong>Definisi.</strong> <strong>Migration matrix</strong> = tabel probabilitas <strong>perpindahan rating</strong> dalam 1 tahun: berapa % dari rating AAA yang tetap AAA, turun ke AA, ..., default (D). Baris = rating awal, kolom = rating akhir; jumlah tiap baris = 100%.</p>
      <p><strong>Dua kegunaan:</strong> (1) <strong>proyeksi</strong> — kalikan dengan portofolio saat ini → distribusi rating tahun depan → default baru; (2) <strong>stres</strong> — "miringkan" matriks ke bawah (naikkan probabilitas downgrade) untuk skenario buruk.</p>

      <PlotlyChart
        data={migrationData}
        title="Migration Matrix 1 Tahun: Tetap vs Downgrade vs Default (%)"
        layout={{ xaxis: { title: "Rating awal" }, yaxis: { title: "%" }, barmode: "stack", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = 100% debitur rating itu; warna = nasib setahun kemudian (biru tetap, oranye downgrade, merah default).</p>
        <p><strong>Interpretasi:</strong> pola <strong>monotonik</strong>: makin rendah rating awal, makin besar porsi merah (default). AAA → default ~0%; CCC → 20%. <strong>Untuk stres:</strong> geser massa dari biru ke oranye/merah (misal: downgrade BBB 15%→30%) — dan hitung ulang. Inilah cara "menerjemahkan" skenario makro menjadi migrasi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Migration matrix historis bisa langsung dipakai untuk stres."</strong></p>
        <p><strong>Yang benar:</strong> matriks historis = <strong>rata-rata masa lalu</strong> (termasuk tahun boom). Untuk stres, matriks harus <strong>disesuaikan</strong> (di-<em>stress</em>): naikkan probabilitas downgrade/default sesuai skenario. Memakai matriks rata-rata untuk skenario krisis = menguji banjir dengan data musim kemarau.</p>
      </div>

      <h2 id="reverse">Reverse Stress Test: Mencari Titik Mati</h2>
      <p><strong>Definisi.</strong> <strong>Reverse stress test</strong> = dibalik: bukan "skenario X → dampak Y", melainkan <strong>"dampak fatal Y → skenario apa yang menyebabkannya?"</strong> Contoh: "NPL berapa yang membuat KPMM jebol 8%?" → jawab: 15% → "skenario apa yang membuat NPL 15%?"</p>
      <p><strong>Kegunaan:</strong> menetapkan <strong>risk appetite</strong> ("kita tidak boleh...") dan menemukan <strong>titik buta</strong> — kombinasi faktor yang tidak terpikirkan dalam skenario normal (misal: NPL naik <em>bersamaan</em> dengan rush penarikan dana).</p>

      <PlotlyChart
        data={reverseData}
        title="Reverse Stress Test: NPL vs KPMM (di mana titik matinya?)"
        layout={{ xaxis: { title: "NPL (%)" }, yaxis: { title: "KPMM (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = KPMM sebagai fungsi NPL. Tarik garis horizontal di 8% (batas OJK).</p>
        <p><strong>Interpretasi:</strong> KPMM menyentuh 8% di sekitar <strong>NPL 13–14%</strong> — itulah <strong>titik mati</strong> bank ini. Pertanyaan lanjutan: "skenario apa yang membawa NPL ke 13%?" — dan "apa yang kita lakukan <em>sebelum</em> sampai sana?" (early warning + contingency plan). Inilah inti reverse stress test: <strong>mulai dari kematian, rancang pencegahannya</strong>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> stress test normal menjawab <strong>"seberapa sakit?"</strong>; reverse stress test menjawab <strong>"apa yang membunuh kita?"</strong>. Bank hanya butuh satu dari keduanya untuk bertahan — tapi butuh keduanya untuk <em>tidur nyenyak</em>.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Jepitan Dua Sisi</h3>
      <p>Mekanisme stress test yang paling penting untuk dihayati: <strong>jepitan dua sisi</strong> — modal turun (pembilang: CKPN menggerus laba) DAN RWA naik (penyebut: downgrade menaikkan bobot) <strong>bersamaan</strong>. KPMM tidak turun linear mengikuti skenario — ia <strong>jatuh lebih cepat</strong> karena kedua sisi bergerak berlawanan arah. Analis yang hanya menghitung "berapa CKPN tambahan" (satu sisi) akan underestimate kejatuhan KPMM. Selalu hitung keduanya — seperti memeriksa tekanan darah sistolik DAN diastolik.</p>
      <p>Intuisi kedua: <strong>skenario harus "severe but plausible"</strong> — dua kata yang bertentangan dan justru itulah intinya. Terlalu ringan = tidak menguji apa-apa (ujian yang semua lulus = bukan ujian). Terlalu berat (misal: "meteor jatuh") = tidak bisa ditindaklanjuti (tidak ada aksi yang masuk akal). Seni stress test = menemukan <strong>skenario terburuk yang masih bisa diperdebatkan secara serius di ruang direksi</strong>. Itulah mengapa skenario berbasis sejarah (1998, 2008, 2020) kuat: "ini pernah terjadi" mengakhiri perdebatan plausibilitas.</p>
      <p>Intuisi ketiga: <strong>reverse stress test adalah alat risk appetite</strong>. Alih-alih bertanya "skenario X dampaknya apa?", ia bertanya "apa yang membunuh kita?" — lalu menetapkan pagar agar skenario itu tidak terjadi (limit, trigger, contingency plan). Bank yang hanya punya stress test normal tahu "seberapa sakit"; bank yang punya reverse tahu <strong>"di mana garis kematiannya"</strong> — dan hidup menjauh darinya.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Simulasi Migration Matrix</h2>
      <p>Putar matriks transisi satu tahun ke depan — lalu "miringkan" untuk skenario stres.</p>
      <PyodideLab
        title="Lab 1 — Proyeksi Default via Migration Matrix"
        hint="Coba: gandakan kolom default (df*2) untuk skenario stres. Berapa default baru? Bandingkan dengan baseline — selisihnya = 'harga' skenario stres."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Stress Test KPMM</h2>
      <p>Tiga skenario, satu pertanyaan: apakah bank selamat?</p>
      <PyodideLab
        title="Lab 2 — KPMM di Bawah Stres"
        hint="Coba: (1) coverage 0.6 → 0.8. (2) NPL stres berat 10% → 15% (cari titik mati seperti reverse stress test!). Pada NPL berapa status jadi KRITIS?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Merancang Skenario</h2>

      <div className="decision-card">
        <h3>1. Skenario terlalu ringan → <strong>keraskan: lebih buruk dari krisis historis</strong></h3>
        <p><strong>Kondisi:</strong> "stres" tapi KPMM hampir tidak bergerak.</p>
        <p><strong>Kenapa:</strong> stress test yang tidak menemukan masalah = tidak menguji apa-apa. Skenario harus membuat direksi <em>tidak nyaman</em>.</p>
      </div>

      <div className="decision-card">
        <h3>2. Skenario terlalu ekstrem/fiksi → <strong>mundurkan ke plausible</strong></h3>
        <p><strong>Kondisi:</strong> "meteor jatuh ke Jakarta".</p>
        <p><strong>Kenapa:</strong> tidak ada yang bertindak atas fiksi. <em>Severe but plausible</em> = ambang aksi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Hasil stres menunjukkan KPMM mepet → <strong>action plan konkret</strong></h3>
        <p><strong>Kondisi:</strong> stres berat → KPMM 9%.</p>
        <p><strong>Aksi:</strong> contingency plan: batasi dividen, siapkan penerbitan modal, kurangi eksposur berisiko, perketat underwriting. Stress test tanpa action = formalitas.</p>
      </div>

      <div className="decision-card">
        <h3>4. Menetapkan risk appetite → <strong>reverse stress test</strong></h3>
        <p><strong>Kondisi:</strong> dewan komisaris tanya "seberapa jauh kita berani?"</p>
        <p><strong>Cara:</strong> cari titik mati (KPMM 8%), lalu tetapkan batas jauh sebelumnya (misal: NPL tidak boleh &gt;8%, konsentrasi sektor &lt;15%). Appetite = jarak aman dari titik mati.</p>
      </div>

            <div className="decision-card">
        <h3>5. Hasil stress test: KPMM stres 9,2% (di atas 8%, tapi mepet) → <strong>bertindak sekarang, bukan saat menyentuh 8%</strong></h3>
        <p><strong>Kondisi:</strong> skenario severely adverse menghasilkan KPMM 9,2% — masih di atas batas OJK 8%. Direksi santai: "kan masih lolos."</p>
        <p><strong>Aksi:</strong> 9,2% dengan asumsi model yang <strong>pasti optimis di beberapa titik</strong> (model selalu menyederhanakan) = zona kuning tua. Tindakan proporsional: (1) <strong>tahan dividen sebagian</strong> sebagai buffer (lebih mudah dijelaskan saat sehat daripada saat krisis); (2) <strong>siapkan contingency capital plan</strong> — dari mana modal tambahan jika skenario memburuk (rights issue? subordinasi? jual aset?); (3) <strong>ketatkan limit sektor paling sensitif</strong> hasil stress test. Prinsip: <strong>modal disiapkan saat murah (sehat), bukan saat mahal (krisis)</strong> — rights issue saat krisis = dilusi brutal.</p>
        <p><strong>Contoh nyata:</strong> bank-bank yang menambah modal pada 2019 (saat sehat, valuasi bagus) menghadapi 2020 dengan tenang; yang menunggu hingga tertekan harus rights issue dengan harga saham jatuh — menghukum pemegang saham lama 2× (krisis + dilusi).</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Severe but plausible.</strong> Bikin tidak nyaman, tapi bisa dibayangkan.</li>
          <li><strong>Rantai = satelit → ECL → modal + RWA → KPMM.</strong> Jangan lompat.</li>
          <li><strong>Stres matriks migrasi</strong> — jangan pakai rata-rata historis mentah.</li>
          <li><strong>Reverse: mulai dari kematian.</strong> Titik mati → appetite → pencegahan.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Merancang Skenario Stres: 8 Prinsip</h3>
      <p>Skenario yang buruk = stress test yang sia-sia. Delapan prinsip ini = standar perancangan.</p>
      <ol>
        <li><strong>Severe but plausible (bukan fantasi)</strong> — Uji plausibilitas: 'pernah terjadi?' (1998/2008/2020 = ya) atau 'bisa diperdebatkan serius di direksi?' (ya). Meteor jatuh = tidak.</li>
        <li><strong>Relevan dengan portofolio</strong> — Bank UMKM: skenario pengangguran + daya beli. Bank tambang: skenario harga komoditas. Skenario generik = tidak menguji apa-apa.</li>
        <li><strong>Kombinasi faktor (bukan tunggal)</strong> — Krisis nyata = kombinasi (komoditas jatuh + rupiah melemah + bunga naik). Satu faktor = underestimate — yang membunuh adalah kombinasi.</li>
        <li><strong>Transmisi lengkap (jepitan dua sisi)</strong> — Makro → PD/LGD → ECL → modal TURUN + RWA NAIK → KPMM. Satu sisi = optimis 1+ poin.</li>
        <li><strong>Horizon cukup (2–3 tahun)</strong> — Dampak kredit menetes 2–3 tahun (vintage!). Skenario 1 tahun = memotong ekor kerugian.</li>
        <li><strong>Aksi yang jelas per hasil</strong> — Setiap hasil skenario → keputusan: tambah modal? tahan dividen? jual aset? Skenario tanpa aksi = latihan akademis.</li>
        <li><strong>Reverse untuk titik mati</strong> — Lengkapi dengan reverse stress test: 'NPL berapa yang membunuh kita?' — menetapkan risk appetite yang konkret.</li>
        <li><strong>Dokumentasi &amp; tantangan independen</strong> — Skenario di-challenge oleh pihak independen (bukan pembuatnya). 'Kenapa tidak lebih parah?' harus bisa dijawab.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> delapan prinsip ini = kredibilitas stress test di mata OJK. Skenario yang tidak memenuhi = temuan validasi.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia menjalankan stress test dengan trauma 1998 sebagai guru dan OJK sebagai pengawas.</p>

      <h3>1998: Stress Test yang Tidak Perlu Disimulasikan</h3>
      <p>Krisis 1998 adalah <strong>stress test sungguhan</strong>: rupiah anjlok 80%, suku bunga SBI mencapai 70%, NPL perbankan melonjak di atas 50%, puluhan bank dilikuidasi/dimerger (BPPN/IBRA dibentuk). Setiap skenario "severely adverse" bank Indonesia hari ini <strong>dibandingkan dengan 1998</strong> — "apakah skenario kita separah 1998?" Jika belum, masih plausible. Trauma ini juga menjelaskan mengapa perbankan Indonesia kini <strong>kelebihan modal</strong> (KPMM 20%+) — buffer yang dibayar mahal sebagai premi trauma.</p>

      <h3>OJK Stress Test: Ujian Nasional Perbankan</h3>
      <p>OJK secara berkala meminta bank-bank (terutama bank sistemik) melakukan <strong>stress test</strong> dengan skenario yang ditetapkan/divalidasi regulator — mencakup risiko kredit, pasar, dan likuiditas. Hasilnya dipakai untuk menilai <strong>kecukupan modal ke depan</strong> (bukan hanya hari ini) dan bisa berujung pada <strong>permintaan tambah modal</strong> atau pembatasan dividen. Bagi analis, ini berarti: pekerjaan stress test bukan latihan akademis — <strong>hasilnya dibaca OJK dan bisa mengubah kebijakan bank</strong>.</p>

      <h3>2020: Stress Test Dadakan</h3>
      <p>Pandemi adalah stress test yang tidak direncanakan: dalam hitungan minggu, bank-bank Indonesia harus menjawab "bagaimana jika PDB −3%?" — dengan model yang tidak punya preseden. Yang bekerja: <strong>judgment + skenario ekstrem + overlay</strong> (CR11). Yang gagal: model yang kaku menunggu data historis. Pelajaran: <strong>stress test bukan soal presisi model — melainkan soal kesiapan berpikir</strong>. Bank yang punya budaya "bagaimana jika?" selamat lebih cepat dari bank yang punya model sempurna tetapi kaku.</p>

      <h3>Migration Matrix Stres: Dari Rata-rata ke Badai</h3>
      <p>Praktik penting: <strong>matriks migrasi historis tidak boleh langsung dipakai untuk stres</strong> — ia adalah rata-rata masa lalu (termasuk tahun boom). Untuk skenario adverse, matriks harus <strong>di-stress</strong>: probabilitas downgrade/default dinaikkan (misal dengan mengalikan faktor stres atau menggeser distribusi). Bank Indonesia yang membangun matriks dari data 2015–2019 (tenang) lalu memakainya mentah untuk skenario resesi = <strong>meremehkan badai dengan data cuaca cerah</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: jepitan dua sisi (klik untuk buka)</summary>
        <p>Bank Sehat: modal Rp 10 T, RWA Rp 70 T → KPMM 14,3%. Skenario severely adverse:</p>
        <p><strong>Langkah 1 — sisi pembilang:</strong> ECL tambahan Rp 2 T → modal turun ke Rp 8 T.<br />
        <strong>Langkah 2 — sisi penyebut:</strong> downgrade massal menaikkan bobot → RWA naik ke Rp 80 T.<br />
        <strong>Langkah 3 — KPMM stres</strong> = 8 / 80 = <strong>10%</strong> (dari 14,3% — jatuh 4,3 poin!).<br />
        <strong>Langkah 4</strong> — bandingkan jika hanya hitung satu sisi: 8/70 = 11,4% (salah optimis 1,4 poin).</p>
        <p><strong>Pelajaran:</strong> jepitan dua sisi membuat KPMM jatuh <strong>lebih cepat</strong> dari perkiraan satu sisi. Selisih 1,4 poin = selisih antara "masih nyaman" dan "OJK menelepon". Selalu hitung keduanya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Stress test yang bagus = model yang paling canggih."</strong></p>
        <p><strong>Yang benar:</strong> stress test yang bagus = <strong>skenario yang diperdebatkan serius + transmisi yang lengkap + aksi yang jelas</strong>. Model Vasicek tercanggih tidak berguna jika skenarionya "GDP −0,5%" (tidak menguji apa-apa) atau hasilnya tidak diterjemahkan menjadi keputusan (tambah modal? batasi dividen? jual aset?). Presisi model <strong>kalah penting</strong> dari kualitas skenario dan keberanian bertindak.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Skenario "Terlalu Ekstrem"?</h2>
      <div className="callout">
        <p>Tim risiko Bank Nusantara mengusulkan skenario <em>severely adverse</em>: GDP −4%, pengangguran 12%, harga properti −35%. Hasil: KPMM jatuh 14% → <strong>8,7%</strong>. Direksi protes:</p>
        <ul>
          <li><em>"Terlalu ekstrem! Tidak pernah terjadi!"</em> (Padahal 1998: GDP −13%, 2020: −2% dalam sekuartal.)</li>
          <li><em>"Kalau dipublikasikan, pasar panik!"</em></li>
          <li>Usulan tandingan: pakai skenario "ringan saja" agar hasilnya bagus.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis, bagaimana kamu mempertahankan skenariomu? Apa risiko menyetujui skenario ringan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Pertahankan dengan tiga argumen:</strong> (1) <strong>Preseden historis:</strong> 1998 jauh lebih buruk — skenario ini <em>plausible</em> secara historis Indonesia. (2) <strong>Tujuan:</strong> stress test bukan ramalan (tidak harus "mungkin terjadi tahun ini"), melainkan <strong>uji ketahanan</strong> — seperti uji tabrak mobil (tidak ada yang berharap tabrakan, tapi mobil harus lolos). (3) <strong>Hasil 8,7% justru kabar baik:</strong> bank <em>selamat</em> dari skenario seberat ini — itu yang ingin didengar OJK/pasar.</p>
          <p><strong>Risiko skenario ringan:</strong> (1) <strong>formalitas berbahaya</strong> — memberi rasa aman palsu; (2) <strong>OJK menolak</strong> — regulator menilai kewajaran skenario (ICAAP); (3) saat krisis betulan datang, bank tidak punya contingency plan — dan direksi akan bertanya "kenapa stress test tidak menangkap ini?" <strong>Pelajaran: skenario yang "nyaman" = stress test yang gagal.</strong></p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Titik Mati Bank Nusantara</h2>
      <div className="callout">
        <p>Tim risiko diminta menjalankan <strong>reverse stress test</strong>: "NPL berapa yang membuat KPMM Bank Nusantara menyentuh 8%?" Data: modal Rp 10 T, RWA Rp 70 T (KPMM 14,3%), total kredit Rp 100 T, LGD rata-rata 45%.</p>
        <p><strong>Pertanyaan:</strong> estimasi titik matinya (NPL berapa?), lalu identifikasi: skenario apa yang realistis bisa membawa NPL ke sana? Apa pagar yang dipasang hari ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Langkah 1</strong> — target: KPMM 8% → dengan RWA naik (asumsi 85 T saat stres), modal minimum = 0,08 × 85 = Rp 6,8 T → modal boleh terkikis Rp 3,2 T.<br />
          <strong>Langkah 2</strong> — kikisan modal ≈ CKPN tambahan ≈ NPL_inkremen × LGD × kredit. 3,2 T = NPL × 0,45 × 100 T → NPL_inkremen ≈ <strong>7,1%</strong> → total NPL ≈ 2,5% + 7,1% ≈ <strong>9,6%</strong>.<br />
          <strong>Langkah 3</strong> — titik mati ≈ <strong>NPL 10%</strong> (dengan asumsi di atas).</p>
          <p><strong>Skenario realistis:</strong> kombinasi — harga komoditas jatuh 40% (sektor 30% portofolio) + rupiah melemah 25% (debitur berutang valas) + suku bunga naik 300 bps. Tidak ada satu faktor yang cukup — <strong>kombinasilah yang membunuh</strong> (inilah gunanya reverse: menemukan kombinasi).</p>
          <p><strong>Pagar hari ini:</strong> limit sektor komoditas 30% (jangan naik), trigger review jika NPL sektor &gt;5%, contingency plan rights issue siap dokumen. <em>"Tahu garis kematiannya = hidup menjauh darinya."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Syarat skenario stress test yang baik?"
        options={[
          "Seringan mungkin agar hasil bagus",
          "Severe but plausible — lebih buruk dari krisis historis tapi masih bisa dibayangkan; membuat direksi tidak nyaman tapi mau bertindak",
          "Se-ekstrem mungkin (meteor jatuh)",
          "Sama dengan baseline",
        ]}
        correct={1}
        explanation="Benar: parah tapi masuk akal. Terlalu ringan = tidak menguji; terlalu fiksi = tidak ada yang bertindak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Rantai transmisi stress test yang benar?"
        options={[
          "Skenario → langsung KPMM",
          "Skenario makro → satelit (PD/LGD naik) → ECL/CKPN naik (modal turun) + RWA naik (migrasi) → KPMM jatuh",
          "Skenario → naikkan suku bunga → selesai",
          "Tidak ada rantai baku",
        ]}
        correct={1}
        explanation="Benar: rantai lengkap. Melompati langkah = angka tidak bisa dipertahankan (auditor akan bertanya 'PD naiknya dari mana?')."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Untuk skenario stres, migration matrix yang dipakai?"
        options={[
          "Matriks historis rata-rata — apa adanya",
          "Matriks yang di-stress (probabilitas downgrade/default dinaikkan sesuai skenario) — rata-rata historis = data musim kemarau untuk uji banjir",
          "Matriks tahun terbaik",
          "Tidak perlu matriks",
        ]}
        correct={1}
        explanation="Benar: matriks harus dimiringkan. Memakai rata-rata (termasuk tahun boom) untuk skenario krisis = underestimate sistematis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Apa itu reverse stress test?"
        options={[
          "Stress test yang dibatalkan",
          "Mulai dari dampak fatal (KPMM jebol) → cari skenario penyebabnya → tetapkan risk appetite & pencegahan",
          "Stress test untuk tahun lalu",
          "Stress test yang hasilnya bagus",
        ]}
        correct={1}
        explanation="Benar: dibalik. Berguna untuk menetapkan batas (appetite) dan menemukan titik buta yang luput dari skenario normal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Direksi minta skenario 'diringankan' agar hasil bagus. Responsmu?"
        options={[
          "Ikuti saja — mereka atasan",
          "Tolak dengan argumen: preseden historis, tujuan uji ketahanan (bukan ramalan), dan hasil 8,7% justru bukti ketahanan; skenario ringan = rasa aman palsu + ditolak OJK",
          "Buat dua versi: asli dan palsu",
          "Berhenti kerja",
        ]}
        correct={1}
        explanation="Benar: pertahankan integritas dengan argumen. Stress test yang 'nyaman' gagal pada tujuannya — dan analis yang menandatanganinya ikut bertanggung jawab saat krisis datang."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Stress test menghitung CKPN tambahan Rp 2 T tetapi RWA dianggap tetap. Apa yang terlewat dan seberapa besar dampaknya?"
        options={[
          "Tidak ada — RWA memang tetap",
          "Jepitan dua sisi: downgrade menaikkan RWA juga — contoh: KPMM 14,3% → 10% (bukan 11,4% jika RWA tetap); selisih 1,4 poin = selisih 'nyaman' vs 'OJK menelepon'",
          "RWA selalu turun saat stres",
          "CKPN tidak memengaruhi modal",
        ]}
        correct={1}
        explanation="Benar: stres menekan pembilang (modal via CKPN) DAN menggelembungkan penyebut (RWA via downgrade) bersamaan. Menghitung satu sisi = optimis 1+ poin KPMM — selisih yang bisa menentukan hidup-mati keputusan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Hasil stress test: KPMM stres 9,2% (masih di atas 8%). Respons yang tepat?"
        options={[
          "Santai — kan masih lolos",
          "Bertindak proporsional sekarang: tahan sebagian dividen, siapkan contingency capital plan, ketatkan limit sensitif — modal disiapkan saat murah (sehat), bukan saat mahal (krisis)",
          "Sembunyikan hasil dari OJK",
          "Naikkan target pertumbuhan",
        ]}
        correct={1}
        explanation="Benar: 9,2% dengan model yang pasti optimis di beberapa titik = zona kuning tua. Modal termurah disiapkan saat bank sehat — rights issue saat krisis = dilusi brutal bagi pemegang saham."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Stress test</strong> = latihan kebakaran neraca: skenario buruk → ECL → modal + RWA → KPMM.</li>
          <li><strong>Skenario</strong>: severe but plausible — bikin tidak nyaman, bisa dibayangkan.</li>
          <li><strong>Migration matrix</strong> = peta perpindahan rating; untuk stres, matriksnya "dimiringkan".</li>
          <li><strong>Reverse stress test</strong> = dari titik mati ke skenario — untuk risk appetite.</li>
          <li><strong>Tanpa action plan = formalitas.</strong> Hasil harus mengubah keputusan.</li>
          <li>Kapan TIDAK stress test: untuk keputusan harian operasional — di sana ECL PIT sudah cukup.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr15-risiko-portofolio" className="btn btn-secondary btn-sm">← CR15</Link>
        <Link href="/learn/cr17a-corporate-credit-1" className="btn btn-primary btn-sm">Next: CR17a →</Link>
      </div>
    </div>
  );
}
