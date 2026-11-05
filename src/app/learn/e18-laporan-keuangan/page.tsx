"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E18Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const profitVsCashData = [
    {
      x: ["2021", "2022", "2023", "2024"],
      y: [50, 65, 80, 100],
      type: "bar",
      name: "Laba bersih (Rp M)",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["2021", "2022", "2023", "2024"],
      y: [45, 20, -10, -40],
      type: "bar",
      name: "Arus kas operasi (Rp M)",
      marker: { color: "#e8a838" },
    },
  ];

  const dupontData = [
    {
      x: ["Margin laba (5%)", "Perputaran aset (1,2×)", "Leverage (2,0×)"],
      y: [5, 120, 200],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#e8a838"] },
      text: ["5%", "1,2×", "2,0×"],
      textposition: "outside",
    },
  ];

  const ratioData = [
    {
      x: ["Current ratio", "DER", "ROA", "Interest coverage"],
      y: [1.8, 0.9, 8.5, 6.2],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["1,8×", "0,9×", "8,5%", "6,2×"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Bedah rasio: sehat atau sekarat?
# PT SEHAT vs PT SEKARAT (angka dalam Rp miliar)
sehat = {"aset_lancar": 800, "liab_jk_pendek": 400, "total_utang": 900,
         "ekuitas": 1100, "laba_bersih": 170, "total_aset": 2000,
         "ebit": 260, "beban_bunga": 40, "penjualan": 2400}
sekarat = {"aset_lancar": 500, "liab_jk_pendek": 600, "total_utang": 1800,
           "ekuitas": 600, "laba_bersih": 150, "total_aset": 2400,
           "ebit": 220, "beban_bunga": 110, "penjualan": 2600}

def rasio(d):
    return {
        "Current ratio": d["aset_lancar"] / d["liab_jk_pendek"],
        "DER": d["total_utang"] / d["ekuitas"],
        "ROA": d["laba_bersih"] / d["total_aset"] * 100,
        "Interest coverage": d["ebit"] / d["beban_bunga"],
    }

for nama, d in [("SEHAT", sehat), ("SEKARAT", sekarat)]:
    print(f"--- PT {nama} (laba Rp{d['laba_bersih']} M) ---")
    for k, v in rasio(d).items():
        print(f"  {k:18s}: {v:5.1f}{'%' if k=='ROA' else 'x'}")
    print()
print("Laba SEKARAT (150) hanya sedikit di bawah SEHAT (170) —")
print("tapi current ratio < 1 & coverage 2,0x = napas tersengal!")
print()
print("Coba: naikkan beban_bunga sekarat jadi 200. Coverage jadi?")`;

  const lab2Code = `# Lab 2 — Laba vs Kas: siapa berbohong?
# PT CANTIK: laba naik terus. Tapi piutang & persediaan menggelembung...
tahun = [2021, 2022, 2023, 2024]
laba = [50, 65, 80, 100]
piutang = [100, 180, 300, 480]   # penjualan kredit tak tertagih?
persediaan = [80, 150, 260, 420]  # barang menumpuk?

print(f"{'Tahun':>6s} {'Laba':>6s} {'Piutang':>8s} {'Persediaan':>11s} {'CFO*':>6s}")
for t, l, pi, pe in zip(tahun, laba, piutang, persediaan):
    # CFO kasar = laba - kenaikan piutang - kenaikan persediaan (vs tahun lalu)
    print(f"{t:>6d} {l:>5d}M {pi:>7d}M {pe:>10d}M")
print()
print("*CFO = arus kas operasi. Rumus kasar: laba - kenaikan modal kerja.")
print("Laba naik 2x lipat, tapi piutang naik 4,8x & persediaan 5,2x!")
print("-> 'Laba' ini belum jadi UANG. Red flag klasik manipulasi/penjualan paksa.")
print()
print("Coba: piutang 2024 = 150 (normal). Bagaimana ceritanya berubah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E18 — Financial Markets • Gap Fill (Job-Relevant)</span>
        <h1 className="display-title">Membaca Laporan Keuangan:<br />Laba Bisa Berbohong</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laba Sama, Nasib Beda</a></li>
          <li><a href="#tiga">Tiga Laporan — Satu Cerita</a></li>
          <li><a href="#laba-rugi">Laporan Laba Rugi — Film Keuntungan</a></li>
          <li><a href="#neraca">Neraca — Foto Kekayaan</a></li>
          <li><a href="#kas">Arus Kas — Kebenaran Pahit</a></li>
          <li><a href="#rasio">Rasio — Empat Keluarga</a></li>
          <li><a href="#dupont">DuPont — Bedah ROE</a></li>
          <li><a href="#redflag">Red Flags — Tanda Bahaya</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bedah Rasio Dua Perusahaan</a></li>
          <li><a href="#lab2">🔬 Lab 2: Laba vs Kas</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Analisis 15 Menit</a></li>
          <li><a href="#case">📋 Mini-Case: Calon Debitur Bank</a></li>
          <li><a href="#worked1">🔬 Worked Example: Membedah ROE dengan DuPont</a></li>
          <li><a href="#worked2">🔬 Worked Example: Laba Rp150 M, Kas Rp10 M</a></li>
          <li><a href="#konteks">🌍 Konteks: Enron &amp; Garuda — Laba yang Dimasak</a></li>
          <li><a href="#redflags">🔧 Pendalaman: 5 Red Flags dalam 10 Menit</a></li>
          <li><a href="#eveh">🔧 Pendalaman: EV/EBITDA — Valuasi yang Netral Utang</a></li>
          <li><a href="#worked4">🔬 Worked Example: P/E Menipu, EV/EBITDA Jujur</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan hubungan tiga laporan keuangan (laba rugi, neraca, arus kas).</li>
          <li>Menghitung dan menginterpretasikan rasio likuiditas, leverage, profitabilitas, dan coverage.</li>
          <li>Mengurai ROE dengan analisis DuPont menjadi tiga pendorongnya.</li>
          <li>Mendeteksi red flags manipulasi/keuangan bermasalah dari tren angka.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Laba Sama, Nasib Beda</h2>
      <div className="story">
        <p>Dua perusahaan, laba bersih sama-sama Rp150 miliar. PT <strong>SEHAT</strong> setahun kemudian baik-baik saja. PT <strong>SEKARAT</strong> — gagal bayar utang, harga sahamnya anjlok 70%. <em>Kok bisa, padahal labanya sama?</em></p>
        <p>Karena <strong>laba ≠ kesehatan</strong>. SEHAT labanya jadi <strong>kas</strong>; SEKARAT labanya nyangkut di <strong>piutang tak tertagih &amp; persediaan menumpuk</strong> — plus utang 3× lipat ekuitas. Semua petunjuknya <strong>tertulis jelas</strong> di laporan keuangan — bagi yang tahu cara membacanya. Kemampuan ini = <strong>syarat eksplisit</strong> lowongan equity research &amp; credit analyst (<em>&ldquo;adept at reading annual reports&rdquo;</em>). Lesson ini mengisinya — jembatan E5/E6 menuju dunia kerja.</p>
        <p><strong>Twist-nya:</strong> angka Rp150 miliar itu <strong>identik</strong> — bukan &ldquo;hampir sama&rdquo;, tapi sama persis. Namun satu perusahaan sehat, satu sekarat. Artinya <strong>laba bersih adalah jawaban atas pertanyaan yang salah</strong> — seperti menilai kesehatan pasien hanya dari berat badan. Yang membedakan SEHAT dan SEKARAT tertulis <em>di dokumen yang sama</em>, <em>di halaman yang sama</em>, <strong>untuk siapa pun yang tahu cara membacanya</strong>. Tidak ada informasi orang dalam. Tidak ada rumus rahasia. Hanya literasi. Lesson ini = literasi itu.</p>
      </div>

      <h2 id="tiga">Tiga Laporan — Satu Cerita</h2>
      <p><strong>Definisi.</strong> Tiga laporan keuangan = tiga sudut pandang <strong>perusahaan yang sama</strong>:</p>
      <ul>
        <li><strong>Laporan Laba Rugi</strong> (<em>income statement</em>): <strong>film</strong> setahun — pendapatan → biaya → laba. (&ldquo;Apakah bisnisnya untung?&rdquo;)</li>
        <li><strong>Neraca</strong> (<em>balance sheet</em>): <strong>foto</strong> di tanggal tertentu — aset = utang + ekuitas. (&ldquo;Apa yang dimiliki &amp; dari mana dananya?&rdquo;)</li>
        <li><strong>Arus Kas</strong> (<em>cash flow</em>): <strong>jejak uang tunai</strong> — operasi, investasi, pendanaan. (&ldquo;Apakah labanya jadi uang?&rdquo;)</li>
      </ul>
      <p><strong>Persamaan abadi neraca:</strong></p>
      <Tex math={String.raw`\text{Aset} = \text{Liabilitas} + \text{Ekuitas}`} block />
      <p><strong>Kepribadian ketiganya:</strong> laba rugi = <em>cerita</em> manajemen (bisa dipoles akuntansi); neraca = <em>daftar harta &amp; utang</em>; arus kas = <em>poligraf</em> — sulit dibohongi karena kas tidak bisa dimanipulasi akrual. <strong>Selalu verifikasi cerita laba dengan jejak kas.</strong></p>

      <h2 id="laba-rugi">Laporan Laba Rugi — Film Keuntungan</h2>
      <p><strong>Alur:</strong> Pendapatan → HPP → <strong>Laba kotor</strong> → Beban operasi → <strong>EBIT</strong> (laba sebelum bunga &amp; pajak) → Bunga → Pajak → <strong>Laba bersih</strong>.</p>
      <p><strong>Tiga margin kunci:</strong></p>
      <Tex math={String.raw`\text{Gross margin} = \frac{\text{Laba kotor}}{\text{Pendapatan}}, \quad \text{EBIT margin} = \frac{EBIT}{\text{Pendapatan}}, \quad \text{Net margin} = \frac{\text{Laba bersih}}{\text{Pendapatan}}`} block />
      <p><strong>Cara baca:</strong> gross margin turun = <em>pricing power</em> melemah / biaya bahan naik; EBIT margin turun = operasi tidak efisien; net margin jauh &lt; EBIT margin = beban bunga/pajak berat.</p>

      <h2 id="neraca">Neraca — Foto Kekayaan</h2>
      <p><strong>Struktur:</strong> <strong>Aset</strong> (lancar: kas, piutang, persediaan; tetap: pabrik, mesin) = <strong>Liabilitas</strong> (jk pendek: utang usaha, utang bank; jk panjang: obligasi) + <strong>Ekuitas</strong> (modal + laba ditahan).</p>
      <p><strong>Yang dicari analis kredit:</strong> seberapa besar <strong>utang vs ekuitas</strong> (leverage), dan apakah <strong>aset lancar cukup</strong> menutup kewajiban jk pendek (likuiditas). Perusahaan bisa untung tapi <strong>mati karena likuiditas</strong> — tidak bisa bayar utang yang jatuh tempo <em>minggu ini</em>.</p>

      <h2 id="kas">Arus Kas — Kebenaran Pahit</h2>
      <p><strong>Tiga aktivitas:</strong></p>
      <ul>
        <li><strong>Operasi (CFO):</strong> kas dari bisnis inti. <strong>Harus positif &amp; mendekati laba bersih</strong> dalam jangka panjang.</li>
        <li><strong>Investasi (CFI):</strong> beli/jual aset (biasanya negatif = ekspansi).</li>
        <li><strong>Pendanaan (CFF):</strong> utang baru, bayar utang, dividen.</li>
      </ul>
      <p><strong>Aturan emas:</strong> <strong>CFO &lt;&lt; laba bersih bertahun-tahun = red flag</strong>. Laba tanpa kas = laba di atas kertas (piutang/persediaan menggelembung — Lab 2!).</p>

      <PlotlyChart
        data={profitVsCashData}
        title="Red Flag Klasik: Laba Naik, Kas Operasi Anjlok"
        layout={{ barmode: "group", xaxis: { title: "Tahun" }, yaxis: { title: "Rp miliar" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang biru = laba bersih, kuning = arus kas operasi, per tahun.</p>
        <p><strong>Interpretasi:</strong> laba <strong>naik konsisten</strong> (50 → 100) — terlihat hebat! Tapi CFO <strong>anjlok ke negatif</strong> (−40). Kesenjangan melebar = laba tidak jadi uang. Kemungkinan: penjualan kredit agresif (piutang), <em>channel stuffing</em> (persediaan), atau manipulasi. <strong>Analis yang hanya baca laba rugi akan tertipu; yang cek arus kas selamat.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan baca analis profesional: <strong>(1)</strong> arus kas operasi vs laba (jujur tidak?), <strong>(2)</strong> neraca: utang &amp; likuiditas (kuat tidak?), <strong>(3)</strong> laba rugi: tren margin (tumbuh sehat tidak?). Kebanyakan pemula membacanya terbalik — mulai dari laba, selesai di laba.</p>
      </div>

      <h2 id="rasio">Rasio — Empat Keluarga</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Keluarga</th><th>Rasio</th><th>Rumus</th><th>Sehat jika</th></tr></thead>
          <tbody>
            <tr><td><strong>Likuiditas</strong></td><td>Current ratio</td><td>Aset lancar / Liabilitas jk pendek</td><td>&gt; 1,2×</td></tr>
            <tr><td><strong>Leverage</strong></td><td>DER</td><td>Total utang / Ekuitas</td><td>&lt; 1,5× (non-bank)</td></tr>
            <tr><td><strong>Coverage</strong></td><td>Interest coverage</td><td>EBIT / Beban bunga</td><td>&gt; 3×</td></tr>
            <tr><td><strong>Profitabilitas</strong></td><td>ROA / ROE</td><td>Laba / Aset / Ekuitas</td><td>Tren naik, vs peers</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Aturan pakai rasio:</strong> (1) bandingkan <strong>tren 3–5 tahun</strong> (bukan 1 titik), (2) bandingkan dengan <strong>peers se-industri</strong> (DER 2× wajar untuk bank, gila untuk ritel), (3) <strong>kombinasikan</strong> — satu rasio tidak pernah cukup.</p>

      <PlotlyChart
        data={ratioData}
        title="Dasbor Rasio PT SEHAT (ilustratif)"
        layout={{ xaxis: { title: "Rasio" }, yaxis: { title: "Nilai" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu rasio kunci PT SEHAT.</p>
        <p><strong>Interpretasi:</strong> current 1,8× (likuid ✓), DER 0,9× (leverage moderat ✓), ROA 8,5% (produktif ✓), coverage 6,2× (bunga ringan ✓). <strong>Semua hijau konsisten</strong> = profil sehat. Bandingkan dengan PT SEKARAT di Lab 1: current &lt;1, DER 3×, coverage 2× — <strong>semua merah konsisten</strong>. Kesehatan = pola, bukan satu angka.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ROE tinggi = perusahaan hebat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ROE = laba/ekuitas — bisa tinggi karena <strong>ekuitasnya kecil</strong> (utang raksasa!), bukan karena operasional hebat. Inilah yang dibedah <strong>DuPont</strong> di bawah: ROE 30% dari margin tinggi ≠ ROE 30% dari leverage 5×. Selalu tanya: <em>ROE tinggi ini dari mana?</em></p>
      </div>

      <h2 id="dupont">DuPont — Bedah ROE</h2>
      <p><strong>Definisi.</strong> Uraikan ROE menjadi tiga pendorong:</p>
      <Tex math={String.raw`ROE = \underbrace{\frac{\text{Laba}}{\text{Penjualan}}}_{\text{margin}} \times \underbrace{\frac{\text{Penjualan}}{\text{Aset}}}_{\text{perputaran}} \times \underbrace{\frac{\text{Aset}}{\text{Ekuitas}}}_{\text{leverage}}`} block />
      <p><strong>Artinya tiap komponen:</strong></p>
      <ul>
        <li><strong>Margin</strong> = efisiensi harga/biaya (<em>pricing power</em>).</li>
        <li><strong>Perputaran aset</strong> = efisiensi operasional (jualan berapa kali dari aset).</li>
        <li><strong>Leverage</strong> = pengali utang (makin besar = makin berisiko!).</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh (klik untuk buka)</summary>
        <p>Margin 5%, perputaran 1,2×, leverage 2,0× → ROE = 0,05 × 1,2 × 2,0 = <strong>12%</strong>.</p>
        <p>Dua perusahaan ROE 12%: A (margin 10%, turnover 1,2, lev 1,0) vs B (margin 3%, turnover 1,0, lev 4,0). <strong>A jauh lebih berkualitas</strong> — ROE-nya dari operasional, bukan utang. B = bom waktu berkedok ROE cantik.</p>
      </details>

      <PlotlyChart
        data={dupontData}
        title="Bedah DuPont: Dari Mana ROE 12% Berasal?"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "Nilai" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = tiga pendorong ROE (5% × 1,2 × 2,0 = 12%).</p>
        <p><strong>Interpretasi:</strong> visual ini memaksa pertanyaan kualitas: seberapa besar kontribusi <strong>leverage</strong> (batang kanan)? ROE yang &ldquo;ditopang&rdquo; leverage = rapuh — saat bunga naik atau laba turun sedikit, ekuitas tipis langsung tergerus. <strong>ROE berkualitas = margin + turnover; ROE semu = leverage.</strong></p>
      </div>

      <h2 id="redflag">Red Flags — Tanda Bahaya</h2>
      <p>Lima pola yang membuat analis kredit/ekuitas <strong>langsung waspada</strong>:</p>
      <ol>
        <li><strong>Laba naik, CFO turun/negatif</strong> (Lab 2) — laba kertas.</li>
        <li><strong>Piutang tumbuh jauh lebih cepat dari penjualan</strong> — penjualan paksa / kolektibilitas jebol.</li>
        <li><strong>Persediaan menggelembung</strong> — barang tak laku / <em>channel stuffing</em>.</li>
        <li><strong>Utang naik, ekuitas stagnan + coverage &lt; 2×</strong> — napas tersengal.</li>
        <li><strong>Auditor berganti / opini wajar dengan pengecualian / laporan telat</strong> — masalah tata kelola.</li>
      </ol>
      <p><strong>Prinsip:</strong> satu red flag = investigasi; <strong>tiga red flag = tinggalkan</strong> (sebagai kreditur maupun investor).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> trik tercepat membaca annual report 200 halaman: <strong>(1)</strong> arus kas operasi vs laba (5 menit), <strong>(2)</strong> tren piutang &amp; persediaan vs penjualan (5 menit), <strong>(3)</strong> DER &amp; interest coverage (3 menit), <strong>(4)</strong> opini auditor + catatan kaki utang (2 menit). <strong>15 menit</strong> untuk putusan awal &ldquo;layak didalami atau buang&rdquo; — inilah <em>screening</em> ala analis profesional.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bedah Rasio Dua Perusahaan</h2>
      <p>Hitung 4 rasio kunci SEHAT vs SEKARAT — labanya mirip, kesehatannya langit-bumi.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Rasio Kesehatan"
        hint="Coba: naikkan beban_bunga SEKARAT ke 200 (coverage jadi ~1,1x = kritis!). Lalu turunkan ekuitasnya ke 300 (DER jadi 6x). Rasakan 'kematian' dalam angka."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Laba vs Kas</h2>
      <p>Selidiki PT CANTIK: labanya naik terus — tapi ke mana uangnya?</p>
      <PyodideLab
        title="Lab 2 — Detektor Laba Kertas"
        hint="Ubah piutang 2024 jadi 150 & persediaan 120 (normal). Ceritanya berubah total: laba = kas. Inilah beda 'tumbuh sehat' vs 'tumbuh dipoles'."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Analisis 15 Menit</h2>

      <div className="decision-card">
        <h3>1. Screening cepat emiten/obligor → <strong>CFO vs laba + DER + coverage</strong></h3>
        <p><strong>Kondisi:</strong> 50 perusahaan, waktu terbatas.</p>
        <p><strong>Kenapa:</strong> tiga cek ini menyaring 80% masalah dalam 15 menit per perusahaan.</p>
        <p><strong>Contoh nyata:</strong> analis kredit menyaring calon debitur korporasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Menilai kualitas ROE → <strong>DuPont: margin vs turnover vs leverage</strong></h3>
        <p><strong>Kondisi:</strong> dua saham ROE sama tinggi.</p>
        <p><strong>Kenapa:</strong> pilih yang ROE-nya dari operasional, bukan utang.</p>
        <p><strong>Contoh nyata:</strong> stock picking value (E6 + E9).</p>
      </div>

      <div className="decision-card">
        <h3>3. Curiga manipulasi → <strong>Tren piutang/persediaan vs penjualan + opini auditor</strong></h3>
        <p><strong>Kondisi:</strong> laba &ldquo;terlalu bagus&rdquo;.</p>
        <p><strong>Kenapa:</strong> manipulasi meninggalkan jejak di modal kerja &amp; catatan auditor.</p>
        <p><strong>Contoh nyata:</strong> hindari value trap (E6 mini-case JAYA!).</p>
      </div>

      <div className="decision-card">
        <h3>4. Keputusan kredit bank → <strong>Coverage + proyeksi arus kas (bukan cuma agunan!)</strong></h3>
        <p><strong>Kondisi:</strong> aplikasi kredit korporasi.</p>
        <p><strong>Kenapa:</strong> agunan = <em>jalan keluar kedua</em>; sumber bayar utama = <strong>arus kas operasi</strong>. Bank yang hanya lihat agunan = bank yang siap sita-sitaan.</p>
        <p><strong>Contoh nyata:</strong> analisis 5C + cash flow lending (Track 1: Credit Risk).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Laba tanpa kas = curigai.</strong> CFO vs laba = cek pertama, selalu.</li>
          <li><strong>ROE tinggi? Bedah DuPont.</strong> Dari operasional atau dari utang?</li>
          <li><strong>Tiga red flag = tinggalkan.</strong> Jangan jatuh cinta pada cerita manajemen.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Calon Debitur Bank</h2>
      <div className="callout">
        <p>PT MAJU mengajukan kredit Rp50 miliar. Data 2024: penjualan Rp400 M (+25%!), laba bersih Rp40 M (+30%!), DER 1,2×, current ratio 1,5×. Terlihat hebat. Kamu tarik detail: piutang naik <strong>80%</strong> (penjualan +25%), CFO <strong>negatif Rp15 M</strong>, interest coverage <strong>2,1×</strong>.</p>
        <p><strong>Pertanyaan:</strong> (a) Identifikasi red flags-nya. (b) Apa pertanyaan tajam untuk manajemen? (c) Keputusan kreditmu + syaratnya (jika tetap diberi)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga red flags:</strong> (1) piutang +80% vs penjualan +25% — penjualan kredit agresif / kolektibilitas jebol; (2) CFO negatif padahal laba +30% — laba kertas; (3) coverage 2,1× — tipis; kenaikan bunga sedikit = gagal bayar bunga.</p>
          <p>(b) &ldquo;Siapa 5 debitur piutang terbesar &amp; umur piutangnya?&rdquo; &ldquo;Kenapa penjualan naik tapi kas tidak masuk?&rdquo; &ldquo;Bagaimana proyeksi CFO 12 bulan ke depan per bulan?&rdquo;</p>
          <p>(c) <strong>Tolak — atau beri dengan syarat ketat:</strong> plafon lebih kecil, tenor pendek, <em>covenant</em> (DER maks, coverage min, laporan bulanan), agunan likuid. Prinsip kredit: <strong>pinjamkan pada arus kas, bukan pada cerita pertumbuhan</strong>.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Membedah ROE 18% — Bagus atau Palsu?</h2>
      <p>PT SEHAT: laba bersih Rp150 M, ekuitas Rp833 M &rarr; ROE = <strong>18%</strong>. Terlihat hebat. Tapi <em>dari mana</em> 18% itu berasal? Dekomposisi <strong>DuPont 3-langkah</strong>:</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`ROE = \frac{\text{Laba}}{\text{Penjualan}} \times \frac{\text{Penjualan}}{\text{Aset}} \times \frac{\text{Aset}}{\text{Ekuitas}}`} block /></p>
      <p style={{ textAlign: "center" }}><em>margin laba &times; perputaran aset &times; leverage</em></p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Data SEHAT:</strong> penjualan Rp1.500 M, aset Rp2.500 M, ekuitas Rp833 M, laba Rp150 M.</p>
        <p>Margin = 150/1.500 = <strong>10%</strong>. Perputaran aset = 1.500/2.500 = <strong>0,6×</strong>. Leverage = 2.500/833 = <strong>3,0×</strong>.</p>
        <p>ROE = 10% × 0,6 × 3,0 = <strong>18%</strong>. ✓</p>
        <p><strong>Baca seperti analis:</strong> margin 10% (sehat!), perputaran 0,6× (lambat — tiap rupiah aset hanya menghasilkan Rp0,6 penjualan), leverage 3,0× (tinggi!). <strong>Sepertiga ROE-nya berasal dari utang</strong> — bukan dari keunggulan operasi.</p>
        <p><strong>Bandingkan dengan SEKARAT</strong> (laba juga Rp150 M!): penjualan Rp3.000 M, aset Rp5.000 M, ekuitas Rp500 M &rarr; margin <strong>5%</strong>, perputaran 0,6×, leverage <strong>10×</strong> (!!). ROE = 5% × 0,6 × 10 = <strong>30%</strong> — <em>lebih tinggi</em> dari SEHAT!</p>
        <p><strong>Twist akuntansi:</strong> ROE SEKARAT (30%) &gt; SEHAT (18%) — tapi SEKARAT berdiri di atas <strong>utang 9× ekuitas</strong> (aset 5.000 − ekuitas 500 = utang 4.500!). Satu guncangan bunga/penjualan = kolaps. <strong>ROE tanpa dekomposisi = angka penipu.</strong> Selalu tanya: <em>ROE ini dari operasi atau dari utang?</em></p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Laba Rp150 Miliar, Kas Operasi Rp10 Miliar?</h2>
      <p>Rekonstruksi SEKARAT. Laba bersih <strong>Rp150 M</strong>. Tapi di laporan arus kas: piutang usaha <strong>naik Rp80 M</strong>, persediaan <strong>naik Rp60 M</strong>. Berapa kas operasi sesungguhnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Logika:</strong> laba akrual mengakui penjualan <em>saat faktur terbit</em> — bukan saat kas diterima. Piutang naik Rp80 M = <strong>Rp80 M &ldquo;laba&rdquo; yang belum jadi kas</strong>. Persediaan naik Rp60 M = kas <em>keluar</em> untuk menimbun barang yang belum terjual.</p>
        <p><strong>Kas operasi ≈</strong> 150 − 80 − 60 = <strong>Rp10 M</strong> (disederhanakan; versi penuh memakai metode tidak langsung dengan depresiasi dll.).</p>
        <p><strong>Tafsir:</strong> dari Rp150 M &ldquo;laba&rdquo;, hanya <strong>Rp10 M yang berupa kas</strong> — 93% masih &ldquo;di jalan&rdquo; (piutang) atau &ldquo;di gudang&rdquo; (persediaan). Jika piutang itu macet &amp; persediaan usang &rarr; laba Rp150 M = <strong>ilusi akuntansi</strong>. Inilah yang terjadi pada SEKARAT: labanya &ldquo;nyangkut&rdquo;, utangnya nyata (bunga harus dibayar dengan <em>kas</em>, bukan dengan laba!).</p>
        <p><strong>Aturan praktis analis:</strong> <strong>baca arus kas operasi DULU, laba kemudian.</strong> Rasio &ldquo;kualitas laba&rdquo; = kas operasi ÷ laba bersih. SEHAT: misal 140/150 = <strong>0,93</strong> (bagus). SEKARAT: 10/150 = <strong>0,07</strong> (alarm!). Di bawah 0,5 bertahun-tahun = perusahaan &ldquo;mencetak laba kertas&rdquo;.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Enron 2001 &amp; Garuda 2018 — Dua Cara Memasak Laba</h2>
      <ul>
        <li><strong>Enron (AS, 2001):</strong> raksasa energi yang labanya &ldquo;tumbuh&rdquo; tiap kuartal — ternyata memakai <strong>akuntansi mark-to-market agresif</strong> (mencatat <em>proyeksi</em> laba 20 tahun sebagai laba <em>hari ini</em>) + ratusan <strong>entitas SPV</strong> di luar neraca untuk menyembunyikan utang. Saat skandal pecah: bangkrut, <strong>US$74 miliar</strong> nilai pasar menguap, akuntannya (Arthur Andersen) ikut hancur. Lahirnya <strong>Sarbanes-Oxley Act</strong> — CEO/CFO kini <em>pidana</em> jika laporan keuangan terbukti manipulatif.</li>
        <li><strong>Garuda Indonesia (2018):</strong> versi lokal — Garuda membukukan <strong>laba bersih US$809 ribu</strong> setelah bertahun-tahun rugi. Komisaris (Chatib Basri &amp; Peter Gontha) menolak menandatangani: laba itu berasal dari <strong>piutang US$239 juta</strong> atas kerja sama dengan Mahata (PT Mahata Aero Teknologi) — <em>pendapatan yang belum diterima kasnya</em>, dari mitra yang kelayakan bayarnya diragukan. Kementerian BUMN &amp; OJK kemudian menyatakan ada <strong>pelanggaran standar akuntansi</strong>; laporan harus disajikan ulang (<em>restatement</em>) menjadi <strong>rugi US$175 juta</strong>. Dua direktur didenda.</li>
      </ul>
      <p><strong>Pola yang sama, dua negara:</strong> <strong>laba diakui sebelum kasnya pasti</strong> (piutang meragukan / proyeksi masa depan). Pertahananmu = Worked 2: <strong>bandingkan laba dengan arus kas</strong> — selalu. Perusahaan jujur: keduanya bergerak seiring. Perusahaan bermasalah: keduanya <em>bercerai</em> bertahun-tahun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan baca analis profesional untuk laporan tahunan: <strong>(1)</strong> arus kas operasi vs laba bersih (kualitas laba); <strong>(2)</strong> utang berbunga vs ekuitas (leverage — Worked 1!); <strong>(3)</strong> catatan kaki (<em>notes</em> — di sinilah &ldquo;mayat disembunyikan&rdquo;: transaksi afiliasi, SPV, perubahan kebijakan akuntansi); <strong>(4)</strong> opini auditor (wajar tanpa pengecualian? atau ada penekanan?). <strong>Manajemen menulis narasi; angka menulis kebenaran; catatan kaki menulis pengakuan.</strong></p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sudah diaudit akuntan publik = pasti benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> audit memberi <strong>keyakinan wajar</strong> (<em>reasonable assurance</em>) — bukan jaminan — bahwa laporan <em>bebas dari salah saji material</em> sesuai standar. Auditor <strong>dibayar oleh perusahaan yang diaudit</strong> (konflik inheren!), bekerja dengan <em>sampling</em>, dan bisa dikelabui kolusi manajemen (Enron!). Audit = <em>rem</em>, bukan <em>jaminan</em>. Tetap lakukan analisismu sendiri — auditor memeriksa kewajaran, <strong>kamu</strong> menilai kesehatan.</p>
      </div>

      <h2 id="redflags">🔧 Pendalaman: 5 Red Flags yang Bisa Dicek dalam 10 Menit</h2>
      <p>Checklist cepat sebelum mengagumi laba perusahaan mana pun:</p>
      <ol>
        <li><strong>Kas operasi &lt; laba bersih bertahun-tahun</strong> (Worked 2!) — laba kertas. Minta penjelasan; tidak ada penjelasan masuk akal = tinggalkan.</li>
        <li><strong>Piutang tumbuh jauh lebih cepat dari penjualan</strong> — &ldquo;menjual&rdquo; ke pelanggan yang tidak membayar (atau ke afiliasi sendiri!). Hitung: pertumbuhan piutang ÷ pertumbuhan penjualan &gt; 1,5× = waspada.</li>
        <li><strong>Leverage meledak + ROE &ldquo;cantik&rdquo;</strong> (Worked 1!) — ROE dari utang, bukan operasi. Cek <em>debt-to-equity</em> &amp; <em>interest coverage</em> (laba operasi ÷ beban bunga &lt; 2× = sesak napas).</li>
        <li><strong>Arus kas investasi &ldquo;aneh&rdquo;</strong> — belanja modal raksasa ke entitas afiliasi, akuisisi mahal berulang (goodwill menggelembung di neraca = bom waktu <em>impairment</em>).</li>
        <li><strong>Auditor berganti / opini tidak wajar / restatement</strong> — ganti auditor 2 tahun beruntun = manajemen &ldquo;berbelanja opini&rdquo;. Restatement = pengakuan laporan lama salah. Keduanya = bendera merah berkibar.</li>
      </ol>
      <p><strong>Penutup:</strong> lima red flags ini tidak membuktikan kecurangan — mereka membuktikan <em>kamu perlu bertanya lebih dalam</em>. Analis hebat bukan yang paling jago matematika; ia yang paling <strong>curiga dengan cara yang terstruktur</strong>. Skeptisisme + checklist = alpha (E9!) yang tidak bisa diambil quant mana pun.</p>
      <p><strong>Penutup track T9:</strong> dari E1 (ke mana uang mengalir) hingga E18 (membaca yang mengalirkannya) — kamu kini memegang <strong>peta lengkap pasar keuangan</strong>: strukturnya, instrumennya, matematikanya (TVM, obligasi, opsi), risikonya (VaR, spread, drawdown), konteksnya (krisis, Indonesia), dan bahasanya (laporan keuangan). Pasar berikutnya yang perlu ditaklukkan: <strong>pasar kerja</strong> — dan ia menghargai persis skill ini.</p>


      <h2 id="eveh">🔧 Pendalaman: EV/EBITDA — Saat P/E Dibutakan Utang</h2>
      <p>P/E (E6) membandingkan harga <em>ekuitas</em> dengan laba <em>ekuitas</em> — tapi dua perusahaan identik operasinya bisa punya P/E beda jauh <strong>hanya karena struktur utangnya beda</strong> (E18 Worked 1: leverage!). Solusi analis: <strong>EV/EBITDA</strong>.</p>
      <ul>
        <li><strong>EV (<em>enterprise value</em>)</strong> = market cap + utang berbunga − kas = <strong>&ldquo;harga beli seluruh perusahaan&rdquo;</strong> (bayar pemegang saham <em>dan</em> lunasi kreditor, dikurangi kas yang ikut dibeli).</li>
        <li><strong>EBITDA</strong> = laba sebelum bunga, pajak, depresiasi, amortisasi ≈ <strong>proksi arus kas operasi</strong> (kasar tapi sebanding antar perusahaan).</li>
        <li><strong>EV/EBITDA</strong> = &ldquo;berapa tahun arus kas operasi untuk membayar seluruh perusahaan?&rdquo; — <strong>netral terhadap struktur modal</strong> (utang vs ekuitas tidak memengaruhi pembilang <em>dan</em> penyebut secara bias).</li>
      </ul>
      <p><strong>Kapan memakai apa:</strong> P/E — cepat, populer, tapi buta utang (cocok untuk bank? <em>tidak</em> — bank = utang adalah bahan bakunya! pakai P/B). EV/EBITDA — standar <em>investment banking</em> untuk akuisisi &amp; pembanding lintas struktur modal. EV/Sales — untuk startup <em>pre-profit</em> (dengan hati-hati!). <strong>Tidak ada rasio yang universal</strong> — ada rasio yang <em>tepat untuk pertanyaannya</em>.</p>
      <h2 id="worked4">🔬 Worked Example: Dua Perusahaan Kembar — P/E Berbohong</h2>
      <p>SEHAT vs SEKARAT versi sederhana. Keduanya: nilai operasi (EV) <strong>Rp3.000 M</strong>, EBITDA <strong>Rp300 M</strong> &rarr; EV/EBITDA = <strong>10×</strong> (identik!). Struktur modal:</p>
      <ul>
        <li>SEHAT: utang Rp500 M, kas Rp200 M &rarr; market cap = 3.000 − 500 + 200 = <strong>Rp2.700 M</strong>. Laba bersih Rp150 M &rarr; P/E = 2.700/150 = <strong>18×</strong>.</li>
        <li>SEKARAT: utang Rp2.000 M, kas Rp100 M &rarr; market cap = 3.000 − 2.000 + 100 = <strong>Rp1.100 M</strong>. Laba bersih (setelah bunga besar!) Rp60 M &rarr; P/E = 1.100/60 = <strong>18,3×</strong>.</li>
      </ul>
      <details className="worked">
        <summary>📐 Analisis (klik untuk buka)</summary>
        <p><strong>P/E berkata:</strong> &ldquo;keduanya ~18× — valuasi sama.&rdquo; <strong>EV/EBITDA berkata:</strong> &ldquo;keduanya 10× — operasi sama.&rdquo; <strong>Keduanya benar — dan keduanya menyembunyikan yang penting:</strong> SEKARAT menanggung <strong>utang 4× lipat</strong> (risiko kebangkrutan jauh lebih tinggi — E5!).</p>
        <p><strong>Yang harus ditanya analis:</strong> <em>kenapa</em> SEKARAT berutang Rp2.000 M? Jika untuk ekspansi produktif (E3: NPV positif!) = wajar. Jika untuk menutup kerugian operasi = <strong>bendera merah</strong> (E18 red flags!). <strong>Rasio memberi angka; struktur modal memberi konteks; arus kas memberi kebenaran.</strong> Tiga lapis — jangan pernah berhenti di lapis pertama.</p>
        <p><strong>Latihan mandiri (2 menit):</strong> ambil satu emiten IDX favoritmu. Hitung: (1) P/E, (2) EV/EBITDA (EV = market cap + utang berbunga − kas; dari laporan kuartalan), (3) Debt/Equity, (4) kas operasi ÷ laba bersih. Jika (4) &lt; 0,5 dua tahun beruntun — <strong>selidiki sebelum kagum</strong>. Inilah <em>workflow</em> analis ekuitas junior dalam 4 angka.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci penutup:</strong> seluruh T9 dalam satu kalimat per lesson — E1: <em>uang ke emiten vs antar investor</em> • E2: <em>pahami aturan main instrumen</em> • E3: <em>samakan zona waktu uang</em> • E4: <em>harga vs yield berlawanan</em> • E5: <em>spread = harga ketakutan</em> • E6: <em>harga ≠ nilai</em> • E7: <em>risiko = medan, bukan destinasi</em> • E8: <em>korelasi = mesin diversifikasi</em> • E9: <em>risiko sistematis yang dihargai</em> • E10: <em>derivatif = transfer risiko</em> • E11: <em>vol = satu-satunya tebakan</em> • E12: <em>kurs = dua sisi</em> • E13: <em>VaR = speedometer</em> • E14: <em>pasar uang = plumbing</em> • E15: <em>verifikasi sebelum transfer</em> • E16: <em>kalahkan biaya &amp; biasmu</em> • E17: <em>sinyal = probabilitas</em> • E18: <em>laba = opini, kas = fakta</em>. <strong>Hafalkan 18 kalimat ini — kamu membawa T9 ke mana pun.</strong></p>
      </div>


      <h2 id="quiz">✏️ Quiz — Membaca Laporan (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Laba bersih naik 30% tapi CFO negatif 2 tahun berturut-turut. Artinya…"
        options={[
          "Perusahaan hebat",
          "Red flag: laba tidak menjadi kas — selidiki piutang/persediaan",
          "Normal saja",
          "Pasti manipulasi — langsung tuduh",
        ]}
        correct={1}
        explanation="Benar: kesenjangan laba vs kas = sinyal bahaya #1. Selidiki dulu (bisa jadi fase investasi berat yang legitimate), jangan langsung menuduh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dua perusahaan ROE 15%. A: margin 12%, leverage 1,2×. B: margin 3%, leverage 5×. Pilih?"
        options={[
          "B — leverage lebih tinggi = lebih agresif",
          "A — ROE dari operasional (margin), bukan dari utang. B rapuh saat bunga naik",
          "Sama saja",
          "Tolak keduanya",
        ]}
        correct={1}
        explanation="Benar: DuPont. ROE B ditopang utang 5× — kenaikan bunga sedikit menggerus ekuitas tipisnya. Kualitas > angka."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Piutang naik 80% sementara penjualan naik 25%. Kemungkinan?"
        options={[
          "Efisiensi meningkat",
          "Penjualan kredit agresif / kolektibilitas memburuk — red flag",
          "Tidak ada artinya",
          "Pasti bagus",
        ]}
        correct={1}
        explanation="Benar: piutang harus tumbuh sejalan penjualan. Kesenjangan besar = channel stuffing, pelonggaran kredit ke pelanggan berisiko, atau fiktif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Interest coverage 1,5× artinya…"
        options={[
          "Aman",
          "EBIT hanya 1,5× beban bunga — napas tersengal; kenaikan bunga/penurunan laba sedikit = gagal bayar bunga",
          "Tidak penting",
          "Perusahaan kaya",
        ]}
        correct={1}
        explanation="Benar: coverage < 2× = zona bahaya. Sehat > 3×. Ini rasio favorit analis kredit untuk menilai 'mampu bayar bunga tidak?'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Urutan baca annual report ala analis profesional?"
        options={[
          "Laba rugi dulu sampai tuntas",
          "Arus kas vs laba → neraca (utang & likuiditas) → tren margin → catatan auditor",
          "Baca dari halaman 1 berurutan",
          "Lihat foto direksi",
        ]}
        correct={1}
        explanation="Benar: mulai dari kejujuran (kas vs laba), lalu kekuatan (neraca), lalu cerita (margin), lalu validasi (auditor). 15 menit untuk screening awal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bank menilai aplikasi kredit. Sumber bayar UTAMA yang benar?"
        options={[
          "Agunan yang besar",
          "Arus kas operasi debitur — agunan hanya jalan keluar kedua",
          "Nama besar pemilik",
          "Laba bersih akuntansi",
        ]}
        correct={1}
        explanation="Benar: cash flow lending. Agunan = mitigasi, bukan sumber bayar. Bank yang hanya lihat agunan = siap sita — bukan analis kredit."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Tiga laporan</strong>: laba rugi (film), neraca (foto: Aset = Liabilitas + Ekuitas), arus kas (poligraf).</li>
          <li><strong>Laba tanpa kas = curigai.</strong> CFO vs laba = cek pertama analis.</li>
          <li><strong>Empat keluarga rasio</strong>: likuiditas (current), leverage (DER), coverage (EBIT/bunga), profitabilitas (ROA/ROE).</li>
          <li><strong>DuPont</strong>: ROE = margin × turnover × leverage — bedakan ROE berkualitas vs ROE utang.</li>
          <li><strong>Lima red flags</strong>: laba vs kas, piutang, persediaan, utang+coverage, auditor.</li>
          <li>Pinjamkan/Investasikan pada <strong>arus kas</strong>, bukan pada cerita.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e17-makro-siklus" className="btn btn-secondary btn-sm">← E17</Link>
        <Link href="/" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}
