"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM13Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bcbsData = [
    {
      x: ["Tata kelola", "Arsitektur &<br>infrastruktur", "Akurasi &<br>integritas", "Kelengkapan", "Ketepatan<br>waktu", "Adaptabilitas", "Akurasi<br>laporan", "Komprehensif", "Kejelasan", "Frekuensi", "Distribusi"],
      y: [6.5, 5.0, 6.0, 7.0, 5.5, 4.5, 6.8, 7.2, 6.0, 7.5, 6.2],
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const reconData = [
    {
      x: ["Sumber A<br>(core)", "Sumber B<br>(risiko)", "Selisih"],
      y: [1250.5, 1248.2, 2.3],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#ef4444"] },
      text: ["Rp1.250,5 M", "Rp1.248,2 M", "Rp2,3 M ⚠"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Rekonsiliasi — "apakah dua sumber bicara hal yang sama?"
# Aturan: total_risiko vs total_finance harus selisih < 0,1%. Jika tidak: ALERT.

def rekonsiliasi(sumber_a, sumber_b, nama_a="Finance", nama_b="Risiko", toleransi=0.001):
    selisih = abs(sumber_a - sumber_b)
    batas = toleransi * max(sumber_a, sumber_b)
    print(f"  {nama_a}: Rp{sumber_a:,.1f} M".replace(",", "."))
    print(f"  {nama_b}: Rp{sumber_b:,.1f} M".replace(",", "."))
    print(f"  Selisih : Rp{selisih:,.2f} M (batas: Rp{batas:,.2f} M)".replace(",", "."))
    if selisih <= batas:
        print("  Status: REKONSIL ✅ — boleh lapor ke regulator.")
        return True
    print("  Status: BREAK ❌ — JANGAN lapor! Investigasi dulu.")
    return False

print("== Kasus 1: normal ==")
rekonsiliasi(1250.5, 1250.1)
print()
print("== Kasus 2: selisih Rp2,3 M (seperti chart!) ==")
ok = rekonsiliasi(1250.5, 1248.2)
print()
print("Break Rp2,3 M bisa berarti: transaksi belum masuk, definisi beda,")
print("atau kurs salah. Semuanya harus terjawab SEBELUM laporan dikirim.")
print()
print("Coba: ubah toleransi jadi 0.005 (0,5%). Keputusan berubah? Bahayanya apa?")`;

  const lab2Code = `# Lab 2: Agregasi risiko — dari posisi ke laporan (prinsip BCBS 239)
# Laporan regulator butuh: eksposur per sektor, lengkap & bisa di-drill-down.

posisi = [
    {"debitur": "D01", "sektor": "Properti",   "eksposur": 500, "rating": "BB"},
    {"debitur": "D02", "sektor": "Properti",   "eksposur": 300, "rating": "B"},
    {"debitur": "D03", "sektor": "Energi",     "eksposur": 800, "rating": "BBB"},
    {"debitur": "D04", "sektor": "Energi",     "eksposur": 200, "rating": "BB"},
    {"debitur": "D05", "sektor": "Ritel",      "eksposur": 150, "rating": "A"},
    # ("D06", "Properti", 400) HILANG dari feed! -> masalah kelengkapan
]

from collections import defaultdict
agregat = defaultdict(int)
for p in posisi:
    agregat[p["sektor"]] += p["eksposur"]

total = sum(agregat.values())
print("LAPORAN EKSPOSUR PER SEKTOR (Rp M):")
for sektor, exp in sorted(agregat.items(), key=lambda x: -x[1]):
    print(f"  {sektor:<10} Rp{exp:>6} M  ({exp/total*100:.1f}%)")

print()
print("UJI BCBS 239:")
print(f"  Kelengkapan : {len(posisi)} posisi. (D06 hilang = break kelengkapan!)")
konsentrasi = max(agregat.values()) / total
print(f"  Konsentrasi : sektor terbesar {konsentrasi*100:.0f}% -> {'WASPADA' if konsentrasi > 0.4 else 'aman'}")
print("  Drill-down  : tiap angka harus bisa ditelusur ke debitur (lineage!).")
print()
print("Coba: tambah D06 Properti 400. Bagaimana konsentrasi & keputusan berubah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM13 — Data Management</span>
        <h1 className="display-title">Data untuk Risiko & Regulasi:<br />Ketika Angka Harus Bisa Dipertahankan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 48 Jam yang Menjadi 6 Minggu</a></li>
          <li><a href="#bcbs">BCBS 239 — 14 Prinsip yang Lahir dari Krisis</a></li>
          <li><a href="#agregasi">Agregasi Risiko — Dari Posisi ke Laporan</a></li>
          <li><a href="#rekonsiliasi">Rekonsiliasi — Dua Sumber, Satu Kebenaran</a></li>
          <li><a href="#reporting">Regulatory Reporting — Laporan yang Bisa Diaudit</a></li>
          <li><a href="#lab1">🔬 Lab 1: Rekonsiliasi dengan Toleransi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Agregasi Eksposur + Uji BCBS 239</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Data Layak Lapor?</a></li>
          <li><a href="#worked">🔢 Worked Example: Triase Break Rp6 M</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Laporan = Ujian Akhir Track</a></li>
          <li><a href="#lab3">🔬 Lab 3: Detektif Break Otomatis</a></li>
          <li><a href="#case">📋 Mini-Case: Break Rp2,3 Miliar di H-1 Laporan</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan latar dan 3 kelompok prinsip BCBS 239.</li>
          <li>Melakukan agregasi eksposur risiko dan menguji kelengkapan, konsentrasi, dan drill-down.</li>
          <li>Merancang rule rekonsiliasi dengan toleransi dan keputusan break vs lolos.</li>
          <li>Menjelaskan syarat laporan regulasi yang bisa diaudit (jejak, versi, persetujuan).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 48 Jam yang Menjadi 6 Minggu</h2>
      <div className="story">
        <p>Krisis 2008. Regulator bertanya ke bank-bank besar: <em>"berapa eksposur kalian ke subprime mortgage — sekarang?"</em> Jawaban tercepat datang <strong>6 minggu</strong> kemudian. Sebagian bank tidak pernah bisa menjawab dengan yakin. Bukan karena datanya tidak ada — tapi karena tersebar di 14 sistem, definisi beda, agregasi manual via spreadsheet, dan tidak ada yang berani menandatangani angkanya.</p>
        <p>Twist-nya: krisis itu <em>memperparah</em> dirinya karena <strong>tidak ada yang tahu siapa menanggung risiko apa</strong> — keputusan diambil buta. Dari trauma inilah lahir <strong>BCBS 239</strong> (2013): 14 prinsip agar bank <em>selalu</em> bisa agregasi risiko dengan cepat dan benar — bahkan saat krisis. Lesson ini tentang standar tertinggi data management: angka yang harus bisa dipertahankan di depan regulator.</p>
      </div>

      <h2 id="bcbs">BCBS 239 — 14 Prinsip yang Lahir dari Krisis</h2>
      <p><strong>Definisi.</strong> <em>Principles for effective risk data aggregation and risk reporting</em> — standar Basel Committee untuk bank sistemik (G-SIB). Tiga kelompok:</p>
      <ul>
        <li><strong>I. Tata kelola & infrastruktur (prinsip 1–2):</strong> governance agregasi risiko kuat; arsitektur data yang mendukung (bukan 14 sistem lepas!).</li>
        <li><strong>II. Kapabilitas agregasi (3–6):</strong> <strong>akurasi & integritas</strong>, <strong>kelengkapan</strong> (semua risiko material tercakup!), <strong>ketepatan waktu</strong> (krisis = butuh harian/intraday), <strong>adaptabilitas</strong> (bisa jawab pertanyaan <em>ad-hoc</em> regulator — bukan hanya laporan rutin!).</li>
        <li><strong>III. Praktik pelaporan (7–11):</strong> akurat, komprehensif, jelas, frekuensi tepat, didistribusikan ke pengambil keputusan.</li>
        <li><strong>IV. Pengawasan (12–14):</strong> untuk regulator & dewan — review, remediasi, kerja sama.</li>
      </ul>
      <p><strong>Prinsip paling "menggigit":</strong> <strong>adaptabilitas</strong> — bank harus bisa menjawab pertanyaan yang <em>belum pernah ditanya</em> (misal "eksposur ke sektor X di negara Y untuk debitur rating &lt; BB"). Ini mustahil dengan spreadsheet manual; butuh <strong>data terintegrasi + lineage + kamus tunggal</strong> — seluruh track DM ini!</p>

      <PlotlyChart
        data={bcbsData}
        title="Contoh Self-Assessment BCBS 239 (skala 1-10)"
        layout={{ xaxis: { title: "Prinsip" }, yaxis: { title: "Skor kepatuhan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = skor kepatuhan tiap prinsip (10 = patuh penuh).</p>
        <p><strong>Interpretasi:</strong> pola umum: <strong>adaptabilitas (4,5) & arsitektur (5,0) terendah</strong> — bank bisa lapor rutin, tapi kelabakan saat ditanya hal baru. <strong>Pelajaran:</strong> compliance sejati ≠ "laporan terkirim"; = "siap ditanya apa saja". Itulah beda level yang diuji BCBS 239.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> BCBS 239 pada dasarnya adalah <strong>"ujian akhir" seluruh track DM</strong>: governance (DM9) + kualitas (DM7) + lineage (DM10) + master data (DM11) + arsitektur (DM4/DM14). Bank yang patuh = bank yang data management-nya matang. Bukan kebetulan — memang dirancang begitu.</p>
      </div>

      <h2 id="agregasi">Agregasi Risiko — Dari Posisi ke Laporan</h2>
      <p><strong>Definisi.</strong> Agregasi = menggabungkan posisi risiko granular (per debitur/transaksi) menjadi tampilan portofolio (per sektor/rating/wilayah) — <strong>tanpa kehilangan kemampuan drill-down</strong> ke detail.</p>
      <p><strong>Syarat agregasi yang benar:</strong></p>
      <ul>
        <li><strong>Lengkap:</strong> semua eksposur material masuk — satu feed hilang = laporan salah (Lab 2: D06!).</li>
        <li><strong>Konsisten:</strong> definisi "eksposur" sama di semua sumber (glossary DM10).</li>
        <li><strong>Drill-down:</strong> tiap angka agregat bisa ditelusur ke posisi individual (lineage kolom-level).</li>
        <li><strong>Tepat waktu:</strong> agregat kemarin untuk krisis hari ini = basi.</li>
      </ul>
      <p><strong>Jebakan klasik:</strong> double-counting (posisi di dua sistem), netting salah (saling hapus yang tidak boleh), FX rate beda antar sumber, dan <strong>missing feed diam-diam</strong> (tidak ada error — data hanya... tidak ada).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Agregasi = SUM() di Excel."</strong></p>
        <p><strong>Yang benar:</strong> SUM mudah; yang sulit = <strong>menjamin yang di-SUM itu lengkap, konsisten, dan bisa ditelusur</strong>. Agregasi risiko = 10% aritmatika + 90% kontrol (kelengkapan feed, rekonsiliasi, definisi tunggal, jejak). Spreadsheet manual = tidak teraudit = tidak patuh BCBS 239.</p>
      </div>

      <h2 id="rekonsiliasi">Rekonsiliasi — Dua Sumber, Satu Kebenaran</h2>
      <p><strong>Definisi.</strong> Rekonsiliasi = membandingkan dua sumber yang <em>seharusnya</em> sama (finance vs risiko, hulu vs hilir pipeline) dan <strong>menyelidiki selisihnya</strong>.</p>
      <p><strong>Anatomi rule rekonsiliasi:</strong></p>
      <ul>
        <li><strong>Pasangan:</strong> apa vs apa (tabel A kolom X vs tabel B kolom Y).</li>
        <li><strong>Toleransi:</strong> selisih &lt; 0,1% = lolos (pembulatan wajar); di atasnya = <strong>break</strong>.</li>
        <li><strong>Aksi break:</strong> <strong>JANGAN kirim laporan</strong> — investigasi, perbaiki, dokumentasikan. Break yang "dimaafkan" tanpa jejak = bom waktu audit.</li>
      </ul>
      <p>Rumus keputusan:</p>
      <Tex math={String.raw`\text{Break jika } \frac{|A - B|}{\max(A,B)} > \text{toleransi}`} block />
      <p><strong>Kenapa toleransi tidak boleh longgar:</strong> toleransi 0,5% pada Rp1,2 triliun = Rp6 miliar "boleh hilang" tanpa alarm (Lab 1!). Toleransi = keputusan risiko, bukan kemalasan.</p>

      <PlotlyChart
        data={reconData}
        title="Contoh Break Rekonsiliasi: Selisih Rp2,3 M"
        layout={{ xaxis: { title: "Sumber" }, yaxis: { title: "Rp Miliar" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = total menurut dua sumber; batang merah = selisihnya.</p>
        <p><strong>Interpretasi:</strong> selisih Rp2,3 M dari Rp1.250 M = 0,18% &gt; toleransi 0,1% → <strong>BREAK</strong>. Kecil relatif, tapi prinsipnya: <em>setiap</em> break harus punya penjelasan tertulis sebelum laporan jalan. <strong>Pelajaran:</strong> rekonsiliasi bukan soal angkanya kecil — soal <em>disiplin tidak mengirim angka yang tidak bisa dijelaskan</em>.</p>
      </div>

      <h2 id="reporting">Regulatory Reporting — Laporan yang Bisa Diaudit</h2>
      <p><strong>Syarat laporan regulasi</strong> (OJK, BI, Basel):</p>
      <ul>
        <li><strong>Jejak penuh:</strong> tiap angka → sumber → transformasi → versi kode (lineage + versioning, DM10/DM5).</li>
        <li><strong>Rekonsiliasi lolos:</strong> tidak ada break terbuka saat kirim.</li>
        <li><strong>Persetujuan:</strong> ditandatangani pemilik data (akuntabilitas! DM9).</li>
        <li><strong>Immutability:</strong> snapshot laporan <strong>tidak bisa diubah diam-diam</strong> — koreksi = versi baru + alasan.</li>
        <li><strong>Ketepatan waktu:</strong> telat = denda, bahkan jika angkanya benar.</li>
      </ul>
      <p><strong>Prinsip inti:</strong> regulator tidak hanya menilai <em>angkanya</em> — mereka menilai <em>proses yang menghasilkan angka</em>. "Angka benar tapi tidak bisa dijelaskan caranya" = tidak patuh.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> beda laporan direksi vs regulator: direksi butuh <em>insight</em>; regulator butuh <em>bukti</em>. Pipeline yang sama bisa melayani keduanya — asal dirancang dengan jejak, versi, dan rekonsiliasi sejak awal. Menambahnya belakangan = 10× biaya (aturan 1-10-100, DM7).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Regulatory reporting = urusan tim compliance saja."</strong></p>
        <p><strong>Yang benar:</strong> compliance menulis <em>apa</em> yang dilaporkan; <strong>data engineer + steward</strong> membangun <em>kemampuan</em> melaporkannya (agregasi, rekonsiliasi, jejak). Bank yang "tidak bisa jawab 48 jam" (cerita pembuka) gagal di <em>kemampuan</em>, bukan di niat compliance.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Rekonsiliasi dengan Toleransi</h2>
      <p>Bangun rule rekonsiliasi: kapan lolos, kapan break — dan kenapa toleransi adalah keputusan risiko.</p>
      <PyodideLab
        title="Lab 1 — Penjaga Gerbang Laporan"
        hint="Coba: ubah toleransi 0,1% → 0,5%. Keputusan berubah? Hitung berapa rupiah yang 'boleh hilang'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Agregasi Eksposur + Uji BCBS 239</h2>
      <p>Agregasi posisi per sektor, lalu uji: lengkap? konsentrasi? bisa drill-down?</p>
      <PyodideLab
        title="Lab 2 — Dari Posisi ke Laporan Regulator"
        hint="Coba: tambah D06 (Properti, 400). Konsentrasi berubah bagaimana? Keputusan apa yang muncul?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Data Layak Lapor?</h2>

      <div className="decision-card">
        <h3>1. Ada break rekonsiliasi terbuka → <strong>JANGAN kirim; investigasi + dokumentasikan</strong></h3>
        <p><strong>Kondisi:</strong> selisih &gt; toleransi tanpa penjelasan.</p>
        <p><strong>Kenapa:</strong> mengirim angka tak terjawab = pelanggaran prinsip akurasi. Telat + benar &gt; tepat waktu + salah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Feed sumber hilang diam-diam → <strong>monitor kelengkapan feed (observability)</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada error, tapi data tidak datang.</p>
        <p><strong>Kenapa:</strong> missing feed = laporan tidak lengkap tanpa peringatan. Butuh CCTV volume/freshness (DM7).</p>
      </div>

      <div className="decision-card">
        <h3>3. Regulator bertanya hal baru (ad-hoc) → <strong>uji adaptabilitas: bisa jawab dalam 48 jam?</strong></h3>
        <p><strong>Kondisi:</strong> pertanyaan di luar laporan rutin.</p>
        <p><strong>Kenapa:</strong> ini ujian BCBS 239 sesungguhnya. Butuh data terintegrasi + glossary tunggal + lineage.</p>
      </div>

      <div className="decision-card">
        <h3>4. Angka agregat dipertanyakan → <strong>drill-down ke posisi via lineage</strong></h3>
        <p><strong>Kondisi:</strong> "angka Rp500 M ini dari mana?"</p>
        <p><strong>Kenapa:</strong> agregat tanpa jejak = tidak bisa dipertahankan. Lineage kolom-level = bukti.</p>
      </div>

      <div className="decision-card">
        <h3>5. Koreksi laporan yang sudah dikirim → <strong>versi baru + alasan tertulis, jangan edit diam-diam</strong></h3>
        <p><strong>Kondisi:</strong> salah hitung setelah kirim.</p>
        <p><strong>Kenapa:</strong> immutability + audit trail. Koreksi transparan = patuh; edit diam-diam = pelanggaran.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Break = berhenti.</strong> Tidak ada laporan di atas selisih tak terjawab.</li>
          <li><strong>Toleransi = keputusan risiko</strong>, bukan kemalasan. Hitung rupiahnya.</li>
          <li><strong>Setiap angka bisa di-drill-down</strong> — atau jangan laporkan.</li>
          <li><strong>Uji adaptabilitas berkala:</strong> "bisa jawab pertanyaan baru dalam 48 jam?"</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Break Rp2,3 Miliar di H-1 Laporan</h2>
      <p>Bank <strong>PT Aman</strong> wajib lapor eksposur ke regulator tiap kuartal. H-1 deadline: agregat risiko dari 3 sistem = Rp8,412 T (treasury), Rp8,409 T (kredit), Rp8,415 T (GL). Selisih maks <strong>Rp6 miliar</strong>. Deadline 48 jam. Ikuti triasenya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Apakah Rp6 miliar "material"? (klik untuk buka)</summary>
        <p><Tex math={String.raw`\text{break relatif} = \frac{6 \text{ M}}{8.412 \text{ T}} = 0{,}071\% = 7{,}1 \text{ bps}`} block /></p>
        <p>Toleransi internal bank: <strong>5 bps</strong> untuk laporan regulator → <strong>BREAK</strong> (7,1 &gt; 5). Aturan BCBS 239 Prinsip 3 (akurasi): agregasi harus "largely accurate" — dan regulator tidak menerima "hanya 7 bps" sebagai alasan. Kenapa ketat? Karena <strong>break kecil bisa menyembunyikan break besar yang saling meniadakan</strong>: +Rp50 M di satu portofolio dan −Rp44 M di lainnya = net Rp6 M. Net terlihat kecil, gross-nya Rp94 M salah!</p>
        <p><Tex math={String.raw`\text{aturan emas: selidiki GROSS break, bukan NET}`} block /></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Triase 48 jam: pohon keputusan</summary>
        <p>Jam 0–4: <strong>apakah break = beda cutoff?</strong> Treasury cutoff 17.00, kredit 23.59. Transaksi 17.00–23.59 = Rp4,1 M → menjelaskan <strong>68%</strong> break. Bukan error — beda definisi (DM10: glossary!). Sisa unexplained: Rp1,9 M (2,3 bps &lt; 5 ✓ untuk porsi ini).</p>
        <p>Jam 4–12: <strong>apakah sisa = timing feed?</strong> Feed kredit telat 2 jam (DM6: batch) → 340 transaksi Rp1,2 M belum masuk. Sisa: Rp0,7 M (0,8 bps).</p>
        <p>Jam 12–24: <strong>apakah sisa = mapping?</strong> 12 kode produk baru belum dipetakan ke kategori risiko → Rp0,7 M "hilang" dari agregat (bukan hilang uangnya — hilang <em>klasifikasinya</em>!). Perbaiki mapping, rerun.</p>
        <p>Jam 24: break = <strong>0,0 bps</strong>. Laporan terkirim H-0 dengan <em>rekonsiliasi terlampir</em> (bukti tiap rupiah bisa ditelusuri — Prinsip 7 BCBS 239: traceability).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Kenapa "48 jam jadi 6 minggu" di cerita pembuka?</summary>
        <p>Cerita pembuka: bank lain butuh <strong>6 minggu</strong> untuk kasus serupa. Bedanya bukan orangnya — <strong>infrastrukturnya</strong>:</p>
        <ul>
          <li>Tanpa lineage (DM10): 2 minggu hanya untuk tahu "angka ini dari mana".</li>
          <li>Tanpa definisi cutoff tertulis: 1 minggu debat "siapa yang benar".</li>
          <li>Tanpa agregasi otomatis: 2 minggu kumpulkan spreadsheet via email.</li>
          <li>Tanpa rekonsiliasi harian: break menumpuk 90 hari → 1 minggu mengurai.</li>
        </ul>
        <p><Tex math={String.raw`\text{biaya 6 minggu} = 6 \times 5 \text{ orang} \times \text{Rp}2 \text{ jt/hari} \times 5 = \text{Rp}300 \text{ jt}`} /></p>
        <p>+ risiko denda keterlambatan + reputasi. <strong>BCBS 239 bukan birokrasi — ia asuransi terhadap 6 minggu panik.</strong> Bank yang patuh = bank yang bisa menjawab regulator dalam 48 jam, bukan 6 minggu.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — 14 prinsip BCBS 239: yang paling sering gagal</summary>
        <p>Dari 14 prinsip, 3 yang paling sering menjadi temuan:</p>
        <ul>
          <li><strong>Prinsip 2 (arsitektur &amp; infrastruktur):</strong> agregasi masih manual via spreadsheet. Target: straight-through processing.</li>
          <li><strong>Prinsip 6 (adaptabilitas):</strong> "bisakah agregasi ad-hoc dalam krisis?" — 2008: bank tidak tahu eksposur Lehman-nya selama berminggu-minggu. Uji: minta 1 laporan ad-hoc, ukur jamnya.</li>
          <li><strong>Prinsip 9 (kejelasan laporan):</strong> laporan 200 halaman yang tidak dibaca direksi = gagal. Aturan: 1 halaman eksekutif + lampiran.</li>
        </ul>
        <p>Self-assessment bank dewasa: nilai tiap prinsip 1–4 tiap tahun (DM9: maturity). Regulator tidak menuntut sempurna — menuntut <strong>tren membaik + jujur tentang gap</strong>.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> rekonsiliasi punya 3 level: <strong>(1) balance</strong> (total sama?), <strong>(2) posisi</strong> (per portofolio sama?), <strong>(3) transaksi</strong> (per baris sama?). Level 1 murah tapi buta (netting menyembunyikan); level 3 mahal tapi pasti. Pola dewasa: <strong>level 1 harian otomatis + drill-down ke level 3 hanya saat break</strong>. Jangan bayar level 3 untuk semua, setiap hari — itu paranoia yang tidak terjangkau.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Restatement: harga 1 laporan yang terlanjur salah</summary>
        <p>Laporan kuartal terlanjur terkirim dengan angka salah (Rp120 juta selisih, DM10). Biaya restatement:</p>
        <p>Investigasi: 5 orang × 3 hari × Rp2 juta = <strong>Rp30 juta</strong>; surat ke regulator + notulen direksi; <em>kepercayaan</em> (regulator kini mengaudit lebih dalam — biaya tak terlihat terbesar).</p>
        <p><Tex math={String.raw`\text{biaya cegah (test harian)} \approx \text{Rp}5 \text{ jt/thn} \ll \text{Rp}30 \text{ jt} + \text{kepercayaan}`} block /></p>
        <p><strong>Rekonsiliasi harian = premi asuransi termurah di perbankan.</strong> Bank yang "menghemat" Rp5 juta/tahun test membayar Rp30 juta + reputasi per insiden.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Laporan Regulator = Ujian Akhir Seluruh Track</h2>
      <p>Laporan ke regulator adalah <strong>ujian integrasi</strong> dari DM1–DM12: ia menguji lifecycle (DM1), model (DM2), ACID sumber (DM3a), pipeline (DM5), kualitas (DM7), kontrak (DM8), governance (DM9), lineage (DM10), master data (DM11), dan keamanan (DM12) — sekaligus. Tiga intuisi:</p>
      <ul>
        <li><strong>"Largely accurate" ≠ sempurna.</strong> BCBS 239 Prinsip 3 tidak menuntut 0 break — menuntut <strong>proses</strong>: toleransi tertulis, investigasi terdokumentasi, tren membaik. Regulator mengaudit <em>sistem pengendalian</em>, bukan angka tunggal. Bank dengan break 7 bps + investigasi rapi &gt; bank dengan break 0 bps yang "kebetulan" (tidak bisa menjelaskan kenapa nol!).</li>
        <li><strong>Traceability = "tunjukkan kerjamu".</strong> Setiap angka laporan harus bisa ditelusuri: laporan → agregat → tabel → sumber → transaksi asli (lineage DM10 + SCD DM2 untuk "nilai saat itu"). Tanpa ini, angka = klaim tanpa bukti. Auditor tidak bertanya "berapa angkanya?" — bertanya <strong>"buktikan"</strong>.</li>
        <li><strong>Stres + krisis = ujian adaptabilitas.</strong> Prinsip 6: saat krisis, regulator minta laporan <em>ad-hoc</em> ("eksposur ke sektor X, sekarang!"). Bank dengan agregasi kaku (hanya laporan standar) gagal — bukan karena datanya tidak ada, tapi karena <em>pipelinenya tidak bisa ditanya hal baru</em>. Fleksibilitas agregasi = kesiapan krisis.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola "laporan sebagai kode" — definisi laporan di Git (DM5: dbt), test rekonsiliasi otomatis tiap run (DM7), lineage terlampir otomatis (DM10), akses dibatasi (DM12). Saat regulator bertanya, bank tidak "membuat laporan" — ia <strong>mengeksekusi ulang pipeline yang sudah diaudit</strong> dan menyerahkan buktinya. Inilah puncak DataOps untuk regulasi: <em>kepatuhan sebagai efek samping</em>, bukan proyek dadakan tiap kuartal.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Regulatory reporting = urusan tim compliance, bukan tim data."</strong></p>
        <p><strong>Yang benar:</strong> compliance menulis <em>apa</em> yang dilaporkan; tim data membangun <em>mesin</em> yang angkanya bisa dipercaya. 90% temuan BCBS 239 = masalah <strong>data</strong> (agregasi manual, lineage putus, definisi beda) — bukan masalah pemahaman regulasi. Tim data yang berkata "itu urusan compliance" akan tetap begadang H-1 laporan, karena yang rusak = pipelinenya. Regulasi = spesifikasi; data = implementasi.</p>
      </div>

      <div className="callout">
        <h3>✅ Checklist Kesiapan Laporan Regulator (10 poin, H-7)</h3>
        <ol>
          <li>Rekonsiliasi 3 sumber: break &lt; toleransi (bps) — <strong>gross</strong>, bukan net.</li>
          <li>Definisi cutoff selaras &amp; tertulis (treasury/kredit/GL).</li>
          <li>Kode produk baru terpetakan ke kategori risiko (tidak ada "hilang klasifikasi").</li>
          <li>Lineage lengkap: tiap angka bisa ditelusuri ke transaksi (Prinsip 7).</li>
          <li>SCD benar: agregat memakai "nilai saat itu", bukan nilai kini.</li>
          <li>Test kualitas hijau 7 hari terakhir (tidak ada break menggantung).</li>
          <li>Akses laporan dibatasi (need-to-know) + audit trail.</li>
          <li>Versi laporan &amp; changelog: apa berubah vs kuartal lalu + kenapa.</li>
          <li>Uji ad-hoc: 1 pertanyaan regulator tak terduga dijawab &lt; 48 jam (Prinsip 6).</li>
          <li>Tanda tangan pemilik data + risk — <strong>nama, bukan "tim"</strong>.</li>
        </ol>
        <p>Lolos 10/10 = tidur nyenyak H-1. Gagal 1 = lembur + risiko denda. <strong>Kepatuhan = checklist yang dijalankan, bukan dokumen yang disimpan.</strong></p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Triase Break Otomatis — Pohon Keputusan dalam Kode</h2>
      <p>Otomatiskan Langkah 2: klasifikasikan break ke cutoff / timing / mapping / misteri.</p>
      <PyodideLab
        title="Lab 3 — Detektif Break"
        hint="Coba: ubah transaksi menjadi semua di luar jam cutoff (mis. jam 10.00). Klasifikasi apa yang keluar? Itulah bedanya 'beda definisi' vs 'data hilang'."
        defaultCode={`# Lab 3: triase break rekonsiliasi otomatis
# 3 sumber, cutoff berbeda. Temukan penjelas break Rp6 M.

transaksi = [
    # (jam, nominal_M, kode_produk, masuk_feed_kredit)
    (18.5, 2.0, "KPR-A", True), (20.0, 1.1, "KPR-A", True),
    (22.0, 1.0, "KTA-B", True), (19.0, 1.2, "KMK-X", False),  # feed telat!
    (21.5, 0.7, "NEW-1", True),                               # kode belum dipetakan!
]
CUTOFF_TREASURY = 17.0
KODE_VALID = {"KPR-A", "KTA-B"}

total_treasury = 8412_000  # juta rupiah (Rp8.412 T)
total_kredit   = 8409_000
break_awal = total_treasury - total_kredit
print(f"Break awal: Rp{break_awal:,} jt")

# Triase berlapis
beda_cutoff = sum(n for j, n, k, f in transaksi if j > CUTOFF_TREASURY) * 1000
sisa1 = break_awal - beda_cutoff
print(f"1) Beda cutoff (17.00-23.59): menjelaskan Rp{beda_cutoff:,} jt -> sisa Rp{sisa1:,} jt")

telat_feed = sum(n for j, n, k, f in transaksi if not f) * 1000
sisa2 = sisa1 - telat_feed
print(f"2) Feed telat: menjelaskan Rp{telat_feed:,} jt -> sisa Rp{sisa2:,} jt")

blm_map = sum(n for j, n, k, f in transaksi if k not in KODE_VALID) * 1000
sisa3 = sisa2 - blm_map
print(f"3) Kode belum dipetakan: menjelaskan Rp{blm_map:,} jt -> sisa Rp{sisa3:,} jt")

print()
if sisa3 == 0:
    print("HASIL: break 100% terjelaskan. Bukan data hilang!")
    print("Aksi: selaraskan definisi cutoff + percepat feed + daftarkan kode baru.")
else:
    print(f"HASIL: misteri Rp{sisa3:,} jt -> eskalasi ke investigasi manual.")`}
      />

      <h2 id="case">📋 Mini-Case: Break Rp2,3 Miliar di H-1 Laporan</h2>
      <div className="callout">
        <p>H-1 batas lapor OJK, rekonsiliasi finance vs risiko <strong>break Rp2,3 M</strong> (0,18% &gt; toleransi 0,1%). Tim finance: "kecil, loloskan saja biar tidak telat — denda telat Rp500 juta." Tim risiko: "jangan — kalau salah, dendanya lebih besar + reputasi."</p>
        <p><strong>Pertanyaan:</strong> (a) Keputusan yang benar menurut prinsip? (b) Investigasi 4 jam menemukan: kurs USD/IDR beda sumber (finance pakai kurs BI, risiko pakai kurs internal). Solusinya? (c) Pencegahan agar tidak terulang tiap bulan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Jangan kirim.</strong> Prinsip akurasi &gt; ketepatan waktu; break tanpa penjelasan = laporan tak terjawab. Minta perpanjangan/dispensasi dengan penjelasan resmi lebih baik dari laporan salah.</p>
          <p>(b) <strong>Standarisasi sumber kurs</strong> (reference data tunggal! DM11) + dokumentasikan break & resolusinya sebagai jejak audit.</p>
          <p>(c) <strong>Golden source kurs</strong> di MDM + rule rekonsiliasi otomatis harian (jangan tunggu H-1!) + glossary "kurs yang dipakai = kurs BI". Masalah bulanan = masalah sistemik, bukan insiden.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: materialitas break, triase, dan gross vs net.</p>

      <details className="worked">
        <summary>Soal 1 — Materialitas: agregat treasury Rp12,5 T vs kredit Rp12,48 T. Berapa break dalam bps? Toleransi 5 bps — lolos?</summary>
        <p><Tex math={String.raw`\text{break} = \frac{12{,}5-12{,}48}{12{,}5} = 0{,}16\% = 16 \text{ bps} > 5 \text{ bps}`} block /></p>
        <p><strong>BREAK — investigasi wajib.</strong> "Hanya 16 bps" bukan alasan; regulator mengaudit <em>proses</em>, bukan angka.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Triase: break Rp8 miliar. Analisis: 70% beda cutoff, 20% feed telat, sisanya misteri. Berapa rupiah tiap kategori?</summary>
        <p>Cutoff: <Tex math={String.raw`0{,}7 \times 8 \text{ M} = \text{Rp}5{,}6 \text{ M}`} />; timing: <Tex math={String.raw`0{,}2 \times 8 \text{ M} = \text{Rp}1{,}6 \text{ M}`} />; misteri: <strong>Rp800 jt</strong>.</p>
        <p>90% break = <strong>beda definisi/waktu, bukan data hilang</strong>. Hanya Rp800 jt yang butuh forensik dalam.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Gross vs net: portofolio A +Rp30 M, portofolio B −Rp28 M. Net break Rp2 M. Harus puas?</summary>
        <p><strong>Tidak.</strong> Gross = <Tex math={String.raw`30 + 28 = \text{Rp}58 \text{ M}`} /> salah arah berlawanan yang saling meniadakan. <strong>Selidiki gross, bukan net</strong> — net kecil bisa menyembunyikan dua kesalahan besar.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Pelajaran utama krisis 2008 yang melahirkan BCBS 239?"
        options={[
          "Bank kurang modal",
          "Bank tidak bisa agregasi eksposur risiko dengan cepat & benar saat dibutuhkan — data tersebar, definisi beda, tak teraudit",
          "Regulator kurang kerja",
          "Teknologi belum ada",
        ]}
        correct={1}
        explanation="Benar: trauma 'tidak tahu siapa menanggung risiko apa'. BCBS 239 = standar agar selalu bisa jawab, bahkan saat krisis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Prinsip BCBS 239 yang paling 'menggigit' dan kenapa?"
        options={[
          "Frekuensi laporan",
          "Adaptabilitas — harus bisa jawab pertanyaan ad-hoc yang belum pernah ditanya (butuh data terintegrasi + glossary + lineage, bukan spreadsheet)",
          "Format PDF",
          "Bahasa laporan",
        ]}
        correct={1}
        explanation="Benar: laporan rutin bisa dihafal; pertanyaan baru menguji arsitektur data sesungguhnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Rekonsiliasi break Rp2,3 M (0,18%) vs toleransi 0,1%. Tindakan benar?"
        options={[
          "Loloskan — kecil",
          "JANGAN kirim laporan; investigasi sampai terjawab + dokumentasikan; kirim setelah jelas atau minta dispensasi resmi",
          "Naikkan toleransi diam-diam",
          "Sembunyikan break",
        ]}
        correct={1}
        explanation="Benar: disiplin 'angka tak terjawab tidak dikirim'. Toleransi = keputusan risiko tertulis, bukan alat loloskan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kenapa agregasi risiko ≠ sekadar SUM()?"
        options={[
          "Karena SUM sulit",
          "Karena tantangannya = kelengkapan (feed hilang?), konsistensi definisi, hindari double-count, dan drill-down teraudit — 10% aritmatika, 90% kontrol",
          "Karena harus pakai Excel",
          "Tidak ada bedanya",
        ]}
        correct={1}
        explanation="Benar: yang di-SUM harus benar dulu. Spreadsheet manual = tidak teraudit = tidak patuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Syarat laporan regulasi yang bisa diaudit?"
        options={[
          "Angka besar dan rapi",
          "Jejak penuh (lineage + versi kode) + rekonsiliasi lolos + persetujuan owner + immutability snapshot",
          "Dikirim tepat waktu saja",
          "Format warna-warni",
        ]}
        correct={1}
        explanation="Benar: regulator menilai PROSES, bukan hanya angka. 'Benar tapi tak bisa dijelaskan' = tidak patuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Feed D06 hilang diam-diam (tidak ada error). Kontrol apa yang menangkap ini?"
        options={[
          "Rule validitas format",
          "Observability kelengkapan/volume feed — 'kemarin 6 feed, hari ini 5' + ekspektasi jumlah sumber terdaftar",
          "Tidak bisa ditangkap",
          "Tunggu komplain regulator",
        ]}
        correct={1}
        explanation="Benar: missing feed = anomali ketiadaan — hanya CCTV (bukan rule format) yang menangkap 'yang seharusnya ada tapi tidak ada'."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>BCBS 239:</strong> 14 prinsip — governance, agregasi (akurat/lengkap/tepat waktu/adaptif), pelaporan, pengawasan. Ujian akhir track DM.</li>
          <li><strong>Agregasi:</strong> lengkap + konsisten + drill-down + tepat waktu. Waspadai double-count & missing feed.</li>
          <li><strong>Rekonsiliasi:</strong> break = berhenti; toleransi = keputusan risiko berhitung rupiah.</li>
          <li><strong>Reporting:</strong> jejak + versi + persetujuan + immutability. Regulator menilai proses.</li>
          <li><strong>Jangan:</strong> kirim angka tak terjawab; toleransi longgar diam-diam; agregasi via spreadsheet manual.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm12-keamanan-privasi" className="btn btn-secondary btn-sm">← DM12</Link>
        <Link href="/learn/dm14-arsitektur-modern" className="btn btn-primary btn-sm">Next: DM14 →</Link>
      </div>
    </div>
  );
}
