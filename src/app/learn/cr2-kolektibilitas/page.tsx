"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr2Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const kolekData = [
    {
      x: ["1-Lancar", "2-DPK", "3-Kurang Lancar", "4-Diragukan", "5-Macet"],
      y: [88.5, 6.2, 1.8, 1.2, 2.3],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef9244", "#ef4444", "#8b1a1a"] },
      text: ["88,5%", "6,2%", "1,8%", "1,2%", "2,3%"],
      textposition: "outside",
    },
  ];

  const nplTrendData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [3.2, 2.9, 2.7, 2.5, 2.4],
      type: "scatter",
      mode: "lines+markers",
      name: "NPL gross",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [1.1, 0.9, 0.8, 0.7, 0.6],
      type: "scatter",
      mode: "lines+markers",
      name: "NPL net",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const dpdBucketData = [
    {
      x: ["Current (0)", "1–30", "31–60", "61–90", ">90 hari"],
      y: [885, 45, 17, 12, 41],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef9244", "#ef4444", "#8b1a1a"] },
      text: ["885 M", "45 M", "17 M", "12 M", "41 M"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator DPD & Kolektibilitas (POJK)
# Ubah tanggal_jatuh_tempo / tanggal_laporan, lalu jalankan.
from datetime import date

tanggal_jatuh_tempo = date(2026, 8, 15)   # cicilan seharusnya dibayar
tanggal_laporan     = date(2026, 10, 13)  # hari ini (tanggal analisis)

dpd = (tanggal_laporan - tanggal_jatuh_tempo).days
if dpd < 0: dpd = 0  # bayar lebih awal = DPD 0

if dpd == 0:   kolek = "1 - Lancar"
elif dpd <= 90: kolek = "2 - Dalam Perhatian Khusus (DPK)"
else:           kolek = "3/4/5 - Kurang Lancar / Diragukan / Macet (NPL!)"

print(f"DPD               : {dpd} hari")
print(f"Kolektibilitas    : {kolek}")
print(f"Termasuk NPL?     : {'YA' if dpd > 90 else 'TIDAK'}")
print()
print("Coba: mundurkan tanggal_jatuh_tempo ke 2026-06-01.")
print("Lihat bagaimana status berubah dari DPK menjadi NPL di hari ke-91.")`;

  const lab2Code = `# Lab 2: NPL Gross vs NPL Net — dua wajah yang sama
# Ubah angka-angka di bawah, lalu jalankan.
total_kredit = 1000.0   # miliar Rp
kolek_345    = 29.8     # Kolek 3+4+5, miliar Rp
ckpn         = 22.0     # cadangan yang sudah dibentuk, miliar Rp

npl_gross = kolek_345 / total_kredit * 100
npl_net   = (kolek_345 - ckpn) / total_kredit * 100
coverage  = ckpn / kolek_345 * 100

print(f"NPL gross  = {kolek_345}/{total_kredit} = {npl_gross:.2f}%")
print(f"NPL net    = ({kolek_345}-{ckpn})/{total_kredit} = {npl_net:.2f}%")
print(f"Coverage   = {ckpn}/{kolek_345} = {coverage:.1f}%")
print()
print("Coba: naikkan ckpn jadi 29.8 (coverage 100%). NPL net = 0%!")
print("Bank terlihat 'bersih' — tapi uang cadangannya terkunci Rp 29,8 M.")
print("Itulah trade-off: coverage tinggi = aman tapi mahal.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR2 — Credit Risk Analyst</span>
        <h1 className="display-title">DPD &amp; Kolektibilitas:<br />Bahasa Resmi Kredit Macet</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Telat 45 Hari — Macet atau Belum?</a></li>
          <li><a href="#dpd">DPD — Jam Dinding Setiap Kredit</a></li>
          <li><a href="#kolek">Kolektibilitas 1–5: Lampu Lalu Lintas OJK</a></li>
          <li><a href="#npl">NPL: Satu Angka yang Menggerakkan Direksi</a></li>
          <li><a href="#wo">Write-off &amp; Restrukturisasi: Dua Jalan Keluar</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator DPD &amp; Kolektibilitas</a></li>
          <li><a href="#lab2">🔬 Lab 2: NPL Gross vs NPL Net</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: DPD Naik — Apa Aksinya?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: NPL Naik — Salah Siapa?</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung DPD dari tanggal jatuh tempo dan menentukan kolektibilitas 1–5 sesuai ketentuan OJK.</li>
          <li>Menghitung NPL gross, NPL net, dan coverage ratio — serta menjelaskan mengapa ketiganya bisa bercerita beda.</li>
          <li>Membedakan write-off (hapus buku) vs hapus tagih, dan mengenali praktik <em>evergreening</em> dalam restrukturisasi.</li>
          <li>Menganalisis kenaikan NPL: apakah karena debitur memburuk, write-off berkurang, atau pertumbuhan kredit melambat.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Telat 45 Hari — Macet atau Belum?</h2>
      <div className="story">
        <p>Rabu sore, tim collection Bank Nusantara menatap daftar tunggakan. Nama "PT Sinar Abadi" menyala kuning: <strong>telat 45 hari</strong>, outstanding Rp 2 M. Debt collector senior, Pak Warto, mengusulkan: <em>"Sita agunannya saja, ini sudah macet!"</em></p>
        <p>Analis Rina menggeleng. <em>"Belum macet, Pak. 45 hari itu Kolektibilitas 2 — Dalam Perhatian Khusus. Macet itu Kolektibilitas 5, telatnya di atas 180 hari atau sudah tidak ada harapan."</em> Pak Warto mendengus: <em>"Telat ya telat!"</em></p>
        <p>Sebulan kemudian Sinar Abadi membayar lunas — ternyata telat karena direktur keuangannya opname di RS. Kalau agunannya disita di hari ke-45, bank kehilangan nasabah bagus dan kena masalah hukum.</p>
        <p><strong>Twist-nya:</strong> "macet" bukan perasaan — melainkan <strong>definisi resmi berlapis</strong> (DPD → kolektibilitas → NPL) yang menentukan berapa <strong>miliar rupiah cadangan</strong> yang harus dikunci bank. Salah label Rp 2 M ini saja bisa menggeser laba cabang. Lesson ini mengajarkan bahasanya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="dpd">DPD — Jam Dinding Setiap Kredit</h2>
      <p><strong>Definisi.</strong> DPD (<em>Days Past Due</em>) = jumlah hari keterlambatan pembayaran, dihitung dari <strong>tanggal jatuh tempo tertua yang belum dibayar</strong> sampai tanggal laporan:</p>
      <Tex math={String.raw`\text{DPD} = \text{Tanggal Laporan} - \text{Tanggal Jatuh Tempo Tertua Belum Dibayar}`} block />
      <p><strong>Artinya tiap simbol:</strong> tanggal laporan = "hari ini" versi analis (tanggal cut-off data); tanggal jatuh tempo tertua = cicilan paling lama yang masih nunggak — bukan cicilan terakhir. Kalau cicilan Januari dan Februari nunggak, DPD dihitung dari Januari.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Cicilan Rp 5 jt jatuh tempo tiap tanggal 15. Nasabah terakhir bayar untuk cicilan 15 Agustus. Hari ini 13 Oktober.</p>
        <p><strong>Langkah 1</strong> — jatuh tempo tertua belum dibayar = 15 September (cicilan September).<br />
        <strong>Langkah 2</strong> — DPD = 13 Okt − 15 Sep = <strong>28 hari</strong>.<br />
        <strong>Langkah 3</strong> — status: DPD 28 → Kolektibilitas 2 (DPK). Belum NPL.</p>
        <p>Catatan: cicilan Agustus sudah lewat 59 hari tapi <strong>sudah dibayar</strong> — tidak dihitung. DPD selalu dari yang <em>belum dibayar</em>.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> DPD adalah <strong>bahasa universal</strong> risiko kredit — dari analis Jakarta sampai regulator Basel, semua bicara DPD. DPD 0 = "sehat", DPD 90+ = "zona merah global" (definisi default Basel, detail di CR5). Kuasai DPD, dan kamu bisa membaca laporan risiko bank mana pun di dunia.</p>
      </div>

      <h2 id="kolek">Kolektibilitas 1–5: Lampu Lalu Lintas OJK</h2>
      <p><strong>Definisi.</strong> OJK (dulu BI) mewajibkan bank mengklasifikasikan setiap kredit ke 5 kolektibilitas berdasarkan ketepatan pembayaran (dan prospek usaha untuk korporasi):</p>
      <ul>
        <li><strong>Kolek 1 — Lancar</strong> 🟢: bayar tepat waktu (DPD 0). Tidak ada masalah.</li>
        <li><strong>Kolek 2 — Dalam Perhatian Khusus (DPK)</strong> 🟡: menunggak 1–90 hari. "Batuk-batuk" — perlu perhatian, belum sakit.</li>
        <li><strong>Kolek 3 — Kurang Lancar</strong> 🟠: menunggak 91–180 hari (atau prospek usaha melemah).</li>
        <li><strong>Kolek 4 — Diragukan</strong> 🔴: menunggak 181–270 hari.</li>
        <li><strong>Kolek 5 — Macet</strong> ⬛: menunggak &gt;270 hari, atau sudah tidak ada prospek (bangkrut, hilang).</li>
      </ul>
      <p><strong>Kepribadian tiap kolektibilitas:</strong> bayangkan lampu lalu lintas yang makin merah. Kolek 1–2 = "masih bisa diselamatkan dengan telepon dan kunjungan". Kolek 3 = "mulai siapkan cadangan besar". Kolek 4–5 = "ruang ICU — tim remedial/legal ambil alih".</p>

      <PlotlyChart
        data={kolekData}
        title="Ilustrasi Distribusi Kolektibilitas Bank Umum (pola umum)"
        layout={{ xaxis: { title: "Kolektibilitas" }, yaxis: { title: "% dari total kredit" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> lima batang = lima kolektibilitas, warna dari hijau ke hitam mengikuti tingkat keparahan. Tinggi batang = porsi kredit.</p>
        <p><strong>Interpretasi:</strong> pola sehat berbentuk <strong>"tangga turun"</strong> — makin parah makin kecil. Yang wajib diwaspadai: <strong>Kolek 2 (DPK) yang menggelembung</strong> (6,2% di sini). DPK adalah "ruang tunggu NPL" — kalau ekonomi memburuk, inilah yang pertama jatuh ke Kolek 3. Analis cerdas memonitor DPK, bukan cuma NPL.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kolektibilitas hanya soal telat bayar."</strong></p>
        <p><strong>Yang benar:</strong> untuk kredit <strong>korporasi/komersial</strong>, OJK menilai 3 pilar: prospek usaha, kinerja debitur, DAN kemampuan bayar. Perusahaan yang bayar tepat waktu tapi industrinya kolaps (misal: batubara saat harga jatuh) bisa diturunkan kolektibilitasnya <em>meski DPD-nya 0</em>. Ini disebut <strong>downgrade kualitatif</strong> — dan sering jadi sumber konflik antara RM (yang bela nasabah) dan analis risiko.</p>
      </div>

      <h2 id="npl">NPL: Satu Angka yang Menggerakkan Direksi</h2>
      <p><strong>Definisi.</strong> NPL (<em>Non-Performing Loan</em>) = kredit Kolektibilitas 3, 4, 5 dibagi total kredit:</p>
      <Tex math={String.raw`\text{NPL gross} = \frac{\text{Kolek 3} + \text{Kolek 4} + \text{Kolek 5}}{\text{Total Kredit}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong> pembilang = outstanding kredit bermasalah (kolek 3–5); penyebut = seluruh outstanding kredit bank. OJK memberi perhatian khusus bila NPL gross &gt; 5%.</p>
      <p><strong>NPL net</strong> mengurangkan cadangan (CKPN) yang sudah dibentuk:</p>
      <Tex math={String.raw`\text{NPL net} = \frac{(\text{Kolek 3+4+5}) - \text{CKPN}}{\text{Total Kredit}} \times 100\%`} block />
      <p>Dan <strong>coverage ratio</strong> mengukur seberapa tebal "bantal" cadangan terhadap NPL:</p>
      <Tex math={String.raw`\text{Coverage} = \frac{\text{CKPN}}{\text{Kolek 3+4+5}} \times 100\%`} block />
      <p><strong>Interpretasi angka:</strong> coverage 75% artinya tiap Rp 100 kredit macet sudah "dibayar di muka" Rp 75 lewat cadangan. Coverage tinggi = bank defensif (aman tapi laba tertahan); coverage rendah = bank agresif (laba cantik tapi rapuh).</p>

      <PlotlyChart
        data={nplTrendData}
        title="Ilustrasi Tren NPL Gross vs Net Bank (2021–2025)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "NPL (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = NPL gross, garis biru = NPL net. Jarak vertikal keduanya = cadangan (CKPN) yang sudah dibentuk.</p>
        <p><strong>Interpretasi:</strong> NPL gross turun 3,2% → 2,4% — terlihat membaik. Tapi <strong>selalu tanya: turun karena apa?</strong> Tiga kemungkinan: (1) debitur benar-benar membaik, (2) bank agresif write-off (kredit macet dihapus dari pembilang), (3) total kredit tumbuh cepat (penyebut membesar). Analis yang hanya baca headline "NPL turun" tanpa cek ketiganya = analis yang gampang dibohongi angka.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NPL turun pasti kabar baik."</strong></p>
        <p><strong>Yang benar:</strong> NPL adalah <strong>rasio</strong> — bisa turun karena pembilang mengecil (bagus: debitur sembuh/write-off) ATAU penyebut membesar (netral: kredit tumbuh). Lebih licik lagi: bank bisa menekan NPL dengan <strong>restrukturisasi agresif</strong> (kredit macet "disulap" jadi lancar di atas kertas — <em>evergreening</em>). Selalu bedah: NPL gross vs net, write-off, pertumbuhan kredit, dan Kolek 2.</p>
      </div>

      <h2 id="wo">Write-off &amp; Restrukturisasi: Dua Jalan Keluar</h2>
      <p><strong>Write-off (hapus buku):</strong> bank menghapus kredit macet dari neraca — mengakui kerugian. Penting: di Indonesia ada dua tahap: <strong>hapus buku</strong> (keluar dari neraca, tapi upaya tagih jalan terus) vs <strong>hapus tagih</strong> (benar-benar dilepas, butuh persetujuan khusus). Hapus buku ≠ menyerah.</p>
      <p><strong>Restrukturisasi:</strong> mengubah syarat kredit agar debitur bisa bayar — turun bunga, perpanjang tenor, potong pokok, konversi ke saham. Diatur POJK (dan sempat dilonggarkan saat Covid-19). Tujuannya <strong>menyelamatkan yang masih bisa diselamatkan</strong>, bukan menyembunyikan yang sudah mati.</p>
      <p><strong>Kepribadian:</strong> write-off itu seperti amputasi — menyakitkan tapi menghentikan infeksi. Restrukturisasi itu seperti fisioterapi — butuh pasien yang masih mau sembuh. Keduanya gagal kalau diagnosisnya salah.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> restrukturisasi yang sehat punya <strong>covenant baru + monitoring ketat</strong>. Restrukturisasi yang cuma "perpanjang tenor biar Kolek 1 lagi" tanpa perbaikan usaha = <em>evergreening</em> — menunda bom waktu. Saat audit/OJK datang, inilah yang pertama dibongkar.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Kolektibilitas adalah Bahasa Kekuasaan</h3>
      <p>Lima angka kolektibilitas terlihat seperti label administratif. Sebenarnya, tiap angka adalah <strong>tarif pajak yang berbeda atas laba bank</strong>. Kolek 1 → CKPN kecil (PSAK 71 Stage 1, ECL 12 bulan). Kolek 2 → waspada, potensi Stage 2. Kolek 3–5 → Stage 3, ECL lifetime dengan PD 100% — cadangan melonjak dan langsung memakan laba. Jadi ketika analis "menaikkan kolektibilitas" seorang debitur, ia sesungguhnya sedang <strong>menandatangani cek cadangan</strong> atas nama bank. Itulah mengapa perpindahan Kolek 2 → 3 selalu diperdebatkan sengit antara tim bisnis ("jangan, nanti laba cabang jebol") dan tim risiko ("wajib, ini aturan").</p>
      <p>Intuisi kedua: <strong>DPD 90 adalah bahasa global</strong>. Definisi default Basel (CR5) memakai ambang 90 hari — artinya Kolek 3+ Indonesia selaras dengan standar dunia. Analis Indonesia yang paham DPD bisa membaca laporan risiko bank di Singapura, London, atau New York tanpa penerjemah. Tapi ingat asimetrinya: DPD mudah dihitung, sulit ditagih. Angka 90 hari lahir dari riset perilaku pembayaran lintas negara — bukan angka mistis. Di bawah 90 hari, sebagian besar debitur masih "lupa atau kesulitan sementara"; di atasnya, pola gagal bayar menjadi struktural.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator DPD &amp; Kolektibilitas</h2>
      <p>Mesin penentu status kredit. Ubah tanggalnya, lihat statusnya berubah.</p>
      <PyodideLab
        title="Lab 1 — DPD & Kolektibilitas (POJK)"
        hint="Coba: geser tanggal_jatuh_tempo mundur bulan per bulan. Catat di DPD berapa status berubah DPK → NPL. Itulah 'garis merah' hari ke-91."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: NPL Gross vs NPL Net</h2>
      <p>Dua wajah dari angka yang sama. Mainkan cadangannya, rasakan trade-off-nya.</p>
      <PyodideLab
        title="Lab 2 — NPL Gross vs Net & Coverage"
        hint="Coba: (1) ckpn = 0 — lihat NPL net = NPL gross (bank tanpa bantal). (2) ckpn = kolek_345 — NPL net jadi 0%. Berapa laba yang dikorbankan untuk itu?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: DPD Naik — Apa Aksinya?</h2>

      <div className="decision-card">
        <h3>1. DPD 1–30 (Kolek 2 awal) → <strong>Reminder &amp; pahami sebab</strong></h3>
        <p><strong>Kondisi:</strong> telat ringan, pertama kali. Seringkali administratif (lupa, salah tanggal, gangguan transfer).</p>
        <p><strong>Aksi:</strong> telepon/SMS otomatis + konfirmasi. Tanya sebabnya — bedakan "lupa" vs "tidak mampu". Biaya collection termurah di sini; tiap Rp 1 yang dicegah di tahap ini menghemat Rp 10 di tahap field.</p>
        <p><strong>Contoh nyata:</strong> nasabah KPR telat 5 hari karena payroll kantor mundur — reminder selesai dalam 1 telepon.</p>
      </div>

      <div className="decision-card">
        <h3>2. DPD 31–90 (Kolek 2 lanjut) → <strong>Intensif + kunjungan</strong></h3>
        <p><strong>Kondisi:</strong> telat 1–3 bulan. Pola mulai terbentuk — ini bukan lupa lagi.</p>
        <p><strong>Aksi:</strong> kunjungan lapangan, verifikasi usaha/pekerjaan masih jalan, tawarkan restrukturisasi ringan (penjadwalan ulang). Masuk radar <em>early warning</em> (CR9).</p>
        <p><strong>Contoh nyata:</strong> pedagang KMK telat 60 hari — omzet turun 40% karena jalan digali. Solusi: grace period 2 bulan, bukan sita.</p>
      </div>

      <div className="decision-card">
        <h3>3. DPD 91–180 (Kolek 3) → <strong>Remedial + cadangan besar</strong></h3>
        <p><strong>Kondisi:</strong> resmi NPL. CKPN melonjak (PSAK 71 Stage 3 — CR14).</p>
        <p><strong>Aksi:</strong> alihkan ke tim remedial khusus; negosiasi restrukturisasi formal dengan covenant; siapkan langkah hukum (somasi). Setiap bulan menunggak, peluang sembuh turun drastis (lihat roll rate di CR6).</p>
      </div>

      <div className="decision-card">
        <h3>4. DPD &gt;270 / prospek hilang (Kolek 5) → <strong>Recovery: lelang, hapus buku, atau hapus tagih</strong></h3>
        <p><strong>Kondisi:</strong> macet total. Agunan dieksekusi (lelang), sisa tagihan ditagih atau dihapusbukukan.</p>
        <p><strong>Aksi:</strong> lelang agunan via KPKNL/balai lelang; klaim asuransi kredit (kalau ada); hapus buku bila recovery cost &gt; expected recovery. Upaya tagih tetap jalan pasca hapus buku.</p>
        <p><strong>Contoh nyata:</strong> KPR macet 2 tahun — rumah dilelang Rp 700 jt dari outstanding Rp 800 jt; sisa Rp 100 jt ditagih bertahap.</p>
      </div>

      <PlotlyChart
        data={dpdBucketData}
        title="Ilustrasi Distribusi Outstanding per Bucket DPD (Rp M)"
        layout={{ xaxis: { title: "Bucket DPD" }, yaxis: { title: "Outstanding (Rp M)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = total outstanding di bucket DPD tersebut (angka ilustratif).</p>
        <p><strong>Interpretasi:</strong> perhatikan <strong>bucket 1–30 (Rp 45 M)</strong> — jauh lebih besar dari bucket 31–90. Ini normal: sebagian besar "sembuh" sebelum 30 hari. Tapi Rp 45 M ini adalah <strong>bahan bakar NPL masa depan</strong> — kalau ekonomi memburuk, merekalah yang mengalir ke kanan. Inilah logika <em>flow rate</em> (CR6).</p>
      </div>

            <div className="decision-card">
        <h3>5. DPD 0 di bank kita, tapi SLIK menunjukkan tunggakan di bank lain → <strong>perlakukan sebagai Kolek 2 mental</strong></h3>
        <p><strong>Kondisi:</strong> debitur bayar tepat waktu ke kita, tapi SLIK OJK mencatat ia menunggak 60 hari di dua bank lain. Secara administratif di pembukuan kita ia Kolek 1.</p>
        <p><strong>Aksi:</strong> jangan tunggu ia menunggak di kita juga. Debitur yang kesulitan membayar bank lain sedang memprioritaskan — dan prioritas bisa bergeser ke kita bulan depan. Naikkan intensitas monitoring, siapkan skenario restrukturisasi antisipatif, dan pertimbangkan downgrade kualitatif bila prospek usahanya memburuk. SLIK adalah radar; bank yang tidak membacanya terbang buta.</p>
        <p><strong>Contoh nyata:</strong> debitur KMK membayar kita lancar 6 bulan — ternyata dengan cara menunggak KTA di 3 bank lain hingga total tunggakannya Rp 400 jt. Saat ketahuan, kolektibilitasnya langsung direvisi dan limitnya dibekukan sebelum menjadi NPL di pembukuan kita.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>DPD 0 ≠ aman absolut</strong> — cek juga Kolek 2 dan prospek usaha (downgrade kualitatif).</li>
          <li><strong>Selalu tanya: NPL gross atau net?</strong> Selisihnya = cadangan = cerita kehati-hatian bank.</li>
          <li><strong>NPL turun? Bedah tiga penyebab:</strong> debitur sembuh, write-off, atau kredit tumbuh.</li>
          <li><strong>Kolek 2 menggelembung = alarm dini</strong> — NPL 6 bulan ke depan sedang "dimasak" di sana.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Checklist 10 Menit Membaca NPL Bank</h3>
      <p>Diberi laporan keuangan bank? Dalam 10 menit, jawab 8 pertanyaan ini sebelum menyimpulkan apapun tentang 'kesehatan' NPL-nya.</p>
      <ol>
        <li><strong>NPL gross atau net?</strong> — Selalu catat keduanya. Selisihnya = CKPN = cerita kehati-hatian. Bank yang hanya memamerkan net menyembunyikan setengah cerita.</li>
        <li><strong>Berapa write-off-nya?</strong> — NPL turun + write-off besar = 'dibersihkan', bukan 'disembuhkan'. Minta angka write-off 3 tahun terakhir.</li>
        <li><strong>Bagaimana Kolek 2-nya?</strong> — DPK menggelembung = NPL masa depan sedang dimasak. NPL stabil + DPK naik = bom waktu.</li>
        <li><strong>Berapa coverage-nya?</strong> — Di bawah 50% = bantal tipis (agresif); di atas 100% = defensif (tetapi mahal). Trennya lebih penting dari titiknya.</li>
        <li><strong>Berapa porsi restrukturisasi?</strong> — Restrukturisasi besar + NPL rendah = 'ketenangan yang disubsidi'. Tanyakan skema dan umurnya.</li>
        <li><strong>Tumbuh berapa kreditnya?</strong> — NPL turun karena penyebut tumbuh 30% = pengenceran, bukan penyembuhan. Kualitas kredit baru belum teruji.</li>
        <li><strong>Segmen mana penyumbangnya?</strong> — Minta breakdown per segmen. Satu segmen beracun bisa disembunyikan agregat yang sehat.</li>
        <li><strong>Bagaimana vs peer?</strong> — NPL 3% saat industri 2% = masalah relatif. Selalu bandingkan dengan rata-rata industri OJK.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> jadikan ini template analisis setiap kali membaca laporan bank — 8 pertanyaan, 10 menit, nol headline yang menipu.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ DPD 91 tetapi debitur sudah janji bayar minggu depan — tetap Kolek 3?</summary>
        <p>Ya — <strong>tetap Kolek 3</strong>. Kolektibilitas mengukur FAKTA (hari keterlambatan), bukan janji. Janji bayar = bahan pertimbangan collection, bukan alasan mengubah klasifikasi. Mengubah karena 'janji' = manipulasi. Setelah ia benar-benar bayar, kolektibilitas diperbarui.</p>
      </details>
      <details className="worked">
        <summary>❓ Bisakah Kolek 5 kembali ke Kolek 1?</summary>
        <p>Bisa — via <strong>curing</strong>: lunasi tunggakan + bayar lancar selama masa percobaan (umumnya 3–12 bulan). Bukan otomatis; harus memenuhi syarat dan didokumentasikan. 'Sembuh' adalah status yang diperoleh, bukan diberikan.</p>
      </details>
      <details className="worked">
        <summary>❓ Mengapa write-off menurunkan NPL tetapi tidak menambah laba?</summary>
        <p>Karena kerugian <strong>sudah diakui</strong> saat CKPN dibentuk (kuartal-kuartal sebelumnya). Write-off hanya memindahkan: Dr. CKPN / Cr. Kredit. NPL gross turun (pembilang berkurang), laba tidak bergerak. Inilah mengapa 'NPL turun karena write-off' = kosmetik, bukan penyembuhan.</p>
      </details>
      <details className="worked">
        <summary>❓ Restrukturisasi Covid sudah berakhir — apa yang harus diwaspadai?</summary>
        <p>Kredit yang 'lancar' selama stimulus tetapi fundamentalnya tidak sembuh. Waspadai: <strong>lonjakan Kolek 2→3</strong> pasca-stimulus, debitur yang direstrukturisasi 2–3× (evergreening), dan sektor yang belum pulih (pariwisata, tekstil). Stimulus berakhir = diagnosis yang tertunda akhirnya ditegakkan.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia punya episode kolektibilitas paling dramatis dalam sejarah perbankan modern: <strong>restrukturisasi Covid-19</strong>. Memahaminya = memahami mengapa kolektibilitas bukan sekadar angka.</p>

      <h3>2020–2024: Eksperimen Restrukturisasi Terbesar</h3>
      <p>Saat pandemi menghantam (2020), OJK menerbitkan <strong>POJK 11/POJK.03/2020</strong> (stimulus): kredit yang direstrukturisasi karena Covid <strong>tetap boleh dinilai "lancar"</strong> — kolektibilitasnya tidak turun meski debitur kesulitan bayar. Tujuannya mulia: mencegah NPL meledak serentak dan memberi napas bagi dunia usaha.</p>
      <p>Skalanya luar biasa: pada puncaknya, <strong>ratusan triliun rupiah</strong> kredit berada dalam status restrukturisasi Covid — sebagian besar tercatat Kolek 1 "lancar" di atas kertas. NPL perbankan Indonesia tetap di kisaran 3% — terlihat tenang. Tapi analis senior tahu: itu ketenangan yang <strong>disubsidi regulasi</strong>.</p>
      <p>Stimulus ini diperpanjang berkali-kali dan akhirnya <strong>berakhir Maret 2024</strong>. Saat itulah ujian sesungguhnya datang: kredit restrukturisasi yang belum sembuh harus dinilai apa adanya. Bank-bank yang selama 4 tahun "menunda diagnosis" tiba-tiba harus mengakui Kolek 3–5 dan membentuk CKPN besar-besaran. Pelajaran abadinya: <strong>kolektibilitas yang ditahan oleh regulasi bukan kolektibilitas yang sembuh</strong> — seperti demam yang diturunkan parasetamol, infeksinya tetap ada.</p>

      <h3>Hapus Buku vs Hapus Tagih: Dua Kematian yang Berbeda</h3>
      <p>Di bank BUMN Indonesia, ada lapisan birokrasi tambahan: <strong>hapus tagih</strong> (melepas hak tagih sepenuhnya) untuk kredit macet besar membutuhkan persetujuan pemegang saham (negara) — prosesnya panjang dan politis. Akibatnya, banyak kredit macet "abadi" nangkring di hapus buku bertahun-tahun: tidak di neraca, tapi upaya tagih jalan terus oleh tim remedial.</p>
      <p>Bagi analis, ini berarti: <strong>recovery bisa datang dari tempat tak terduga</strong> — debitur yang dihapusbukukan 5 tahun lalu tiba-tiba melunasi setelah usahanya bangkit. Tim recovery yang baik memperlakukan arsip hapus buku sebagai "ladang", bukan "kuburan" (detail CR22).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: efek tebing 90 hari terhadap CKPN (klik untuk buka)</summary>
        <p>Kredit KMK Rp 1 M, LGD 50%. Bandingkan DPD 85 vs DPD 95 hari.</p>
        <p><strong>DPD 85 (Kolek 2):</strong> PSAK 71 Stage 1 atau 2 — misal ECL 12 bulan dengan PD 8% → CKPN ≈ 0,08 × 0,5 × 1000 = <strong>Rp 40 jt</strong>.</p>
        <p><strong>DPD 95 (Kolek 3):</strong> Stage 3, PD = 100%, ECL lifetime → CKPN ≈ 1,0 × 0,5 × 1000 = <strong>Rp 500 jt</strong>.</p>
        <p>Selisih <strong>10 hari</strong> keterlambatan → selisih cadangan <strong>Rp 460 jt</strong>. Inilah "tebing" (cliff effect) kolektibilitas: garis administratif 90 hari menerjemahkan diri menjadi ratusan juta rupiah laba. Analis yang lalai memonitor DPD 80-an sedang membiarkan tebing itu mendekat tanpa peringatan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap kali membaca "NPL bank X turun", tanyakan tiga hal sebelum percaya: (1) berapa write-off-nya, (2) berapa porsi restrukturisasi stimulus/reguler, (3) bagaimana Kolek 2-nya bergerak. Tiga pertanyaan ini membedakan analis dari pembaca headline.</p>
      </div>

      <h2 id="case">📋 Mini-Case: NPL Naik — Salah Siapa?</h2>
      <div className="callout">
        <p>Bank Nusantara, laporan kuartal: NPL gross naik dari <strong>2,8% → 3,4%</strong> dalam setahun. Direksi panik, menuduh tim kredit "kendor". Kamu diminta membedah. Data:</p>
        <ul>
          <li>Total kredit: Rp 50 T → Rp 52 T (tumbuh hanya 4%, di bawah target 10%).</li>
          <li>Kolek 3+4+5: Rp 1,4 T → Rp 1,77 T.</li>
          <li>Write-off tahun ini: Rp 200 M (tahun lalu Rp 600 M — direksi menahan write-off "demi laba").</li>
          <li>Kolek 2: Rp 2,0 T → Rp 2,1 T (relatif stabil).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apakah kenaikan NPL karena kualitas debitur memburuk? Atau ada penyebab lain? Apa rekomendasi 2 langkahmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Bukan (terutama) debitur.</strong> Bedahnya: (1) <strong>Write-off ditahan</strong> — tahun lalu Rp 600 M kredit macet dibersihkan dari pembilang; tahun ini cuma Rp 200 M, jadi Rp 400 M "sampah lama" masih nangkring di NPL. (2) <strong>Penyebut loyo</strong> — kredit cuma tumbuh 4%, tidak cukup "mengencerkan" NPL. Kolek 2 stabil = arus masalah baru tidak memburuk.</p>
          <p><strong>Rekomendasi:</strong> (1) Lanjutkan write-off untuk kolek 5 yang recovery-nya tidak ekonomis — NPL bersih lebih jujur daripada NPL cantik. (2) Jangan salahkan tim kredit; fokus ke akselerasi penyaluran sehat agar penyebut tumbuh. Pelajaran: <strong>NPL adalah rasio — baca pembilang DAN penyebut</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Cicilan jatuh tempo 15 September belum dibayar. Hari ini 13 Oktober. DPD dan kolektibilitasnya?"
        options={[
          "DPD 28, Kolek 1 (Lancar)",
          "DPD 28, Kolek 2 (DPK) — belum NPL",
          "DPD 59, Kolek 2 (DPK)",
          "DPD 91, Kolek 3 (NPL)",
        ]}
        correct={1}
        explanation="Benar: DPD dihitung dari jatuh tempo TERTUA yang BELUM dibayar (15 Sep, bukan 15 Agu yang sudah dibayar) = 28 hari → Kolek 2 (1–90 hari). Belum NPL."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bank A: NPL gross 3%, coverage 80%. Bank B: NPL gross 3%, coverage 30%. Mana yang lebih defensif?"
        options={[
          "Bank A — cadangannya jauh lebih tebal untuk NPL yang sama",
          "Bank B — cadangannya kecil, labanya lebih besar",
          "Sama saja — NPL-nya sama",
          "Tidak bisa dibandingkan",
        ]}
        correct={0}
        explanation="Benar: Bank A. NPL sama tapi Bank A sudah mencadangkan 80% (Rp 80 per Rp 100 NPL) vs Bank B cuma 30%. Kalau kondisi memburuk, Bank B yang akan kelabakan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Perusahaan bayar tepat waktu (DPD 0) tapi harga komoditasnya anjlok 50% dan 2 pesaing bangkrut. Analis risiko sebaiknya?"
        options={[
          "Tetap Kolek 1 — DPD 0 berarti lancar",
          "Pertimbangkan downgrade kualitatif — prospek usaha adalah pilar penilaian selain DPD",
          "Langsung Kolek 5",
          "Tunggu sampai telat bayar dulu",
        ]}
        correct={1}
        explanation="Benar: downgrade kualitatif. OJK menilai 3 pilar (prospek usaha, kinerja, kemampuan bayar) — DPD 0 tidak otomatis Kolek 1 untuk segmen komersial. Menunggu telat = menunggu terlambat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. NPL bank turun dari 4% ke 2,5% dalam setahun. Mana penjelasan yang PALING butuh diverifikasi sebelum merayakan?"
        options={[
          "Debitur banyak yang sembuh dan bayar lunas",
          "Bank melakukan write-off Rp 1,5 T kredit macet",
          "Kredit tumbuh 30% sehingga penyebut membesar",
          "Semua di atas harus diverifikasi — NPL adalah rasio",
        ]}
        correct={3}
        explanation="Benar: semuanya. NPL = pembilang/penyebut. Write-off membersihkan pembilang (tapi mengakui rugi), pertumbuhan kredit mengencerkan (tapi kualitas kredit baru belum teruji). Rayakan setelah bedah, bukan sebelum."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Restrukturisasi kredit: mana yang merupakan red flag evergreening?"
        options={[
          "Perpanjang tenor + turun bunga + covenant ketat + monitoring bulanan",
          "Perpanjang tenor berulang kali agar status kembali Kolek 1, tanpa perbaikan arus kas debitur",
          "Konversi sebagian utang menjadi saham dengan valuasi independen",
          "Penjadwalan ulang dengan grace period 3 bulan untuk debitur yang usahanya masih jalan",
        ]}
        correct={1}
        explanation="Benar: evergreening. Ciri khasnya: status akuntansi membaik (Kolek 1) sementara realitas ekonomi tidak berubah. Restrukturisasi sehat selalu dibarengi perbaikan fundamental + pengamanan (covenant/monitoring)."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Stimulus restrukturisasi Covid (POJK 11/2020) berakhir Maret 2024. Kredit restrukturisasi yang ternyata belum sembuh akan:"
        options={[
          "Tetap Kolek 1 selamanya — status stimulus permanen",
          "Dinilai apa adanya — yang belum sembuh turun ke Kolek 3–5 dan bank membentuk CKPN besar",
          "Otomatis dihapusbukukan",
          "Dialihkan menjadi kredit baru dengan bunga 0%",
        ]}
        correct={1}
        explanation="Benar: stimulus berakhir = penilaian kembali apa adanya. Kredit yang 'lancar di atas kertas' selama 4 tahun tapi fundamentalnya tidak sembuh akan turun kolektibilitas dan menghantam laba via CKPN. Kolektibilitas yang ditahan regulasi bukan kesembuhan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Debitur DPD 0 di bank kita, tetapi SLIK mencatat tunggakan 60 hari di dua bank lain. Sikap analis yang tepat?"
        options={[
          "Tetap Kolek 1 — yang penting bayar ke kita lancar",
          "Waspada: perlakukan sebagai sinyal Kolek 2 — naikkan monitoring, siapkan skenario antisipatif",
          "Langsung turunkan ke Kolek 5",
          "Abaikan SLIK — data bank lain bukan urusan kita",
        ]}
        correct={1}
        explanation="Benar: waspada. Debitur memprioritaskan pembayaran — giliran kita bisa tiba bulan depan. SLIK adalah radar dini; mengabaikannya = terbang buta. Downgrade kualitatif bisa dipertimbangkan bila prospek memburuk."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>DPD</strong> = hari keterlambatan dari jatuh tempo tertua belum dibayar — bahasa universal risiko kredit.</li>
          <li><strong>Kolektibilitas 1–5</strong>: 1 lancar, 2 DPK (1–90 hari), 3–5 = NPL. Untuk korporasi ada 3 pilar (bukan cuma DPD).</li>
          <li><strong>NPL gross vs net</strong>: selisihnya = CKPN. <strong>Coverage</strong> = tebal bantal cadangan.</li>
          <li><strong>NPL adalah rasio</strong> — bedah pembilang (write-off, kesembuhan) dan penyebut (pertumbuhan kredit) sebelum simpulkan.</li>
          <li><strong>Write-off:</strong> hapus buku ≠ hapus tagih. <strong>Restrukturisasi</strong> sehat = perbaikan fundamental + covenant; evergreening = bom waktu.</li>
          <li>Kapan TIDAK mengandalkan DPD: debitur korporasi dengan prospek industri runtuh — downgrade kualitatif mendahului DPD.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr1-produk-kredit" className="btn btn-secondary btn-sm">← CR1</Link>
        <Link href="/learn/cr3-pd-lgd-ead" className="btn btn-primary btn-sm">Next: CR3 →</Link>
      </div>
    </div>
  );
}
