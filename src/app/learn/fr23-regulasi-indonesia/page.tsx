"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR23Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const timelineData = [
    {
      x: ["UU 15/2002", "UU 8/2010 TPPU", "POJK APU-PPT", "UU PDP 27/2022", "UU P2SK 4/2023"],
      y: [1, 2, 3, 4, 5],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["2002", "2010", "2015+", "2022", "2023"],
      textposition: "outside",
    },
  ];

  const careerData = [
    {
      x: ["Fraud Analyst", "AML Analyst", "Senior/Lead", "Manager", "Head/AVP"],
      y: [8, 9, 15, 25, 45],
      type: "bar",
      marker: { color: ["#7bc96f", "#7bc96f", "#e8a838", "#e8a838", "#e05252"] },
      text: ["8 jt", "9 jt", "15 jt", "25 jt", "45 jt"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Risk scoring nasabah (CDD): siapa wajib EDD?
# Skor = w1*negara + w2*pekerjaan + w3*produk + w4*transaksi
import random
random.seed(77)

NASABAH = [
    # (nama, negara_risiko, pekerjaan_risiko, produk_risiko, trx_vs_profil)
    ("N1: karyawan swasta, tabungan, trx wajar",      1, 1, 1, 1),
    ("N2: wiraswasta, giro, trx 5x profil",           2, 3, 2, 4),
    ("N3: PEP daerah, tabungan, trx wajar",           3, 5, 1, 1),
    ("N4: importir, valas, negara risiko tinggi",     5, 3, 4, 2),
    ("N5: mahasiswa, e-wallet, trx 20x profil",       1, 1, 2, 5),
]
w = {"negara": 0.25, "pekerjaan": 0.25, "produk": 0.2, "trx": 0.3}

print(f"{'Nasabah':42s} {'Skor':>5s}  Keputusan")
for nama, ng, pk, pr, tx in NASABAH:
    skor = w["negara"]*ng + w["pekerjaan"]*pk + w["produk"]*pr + w["trx"]*tx
    kep = "🔴 EDD" if skor >= 3.0 else ("🟡 CDD ketat" if skor >= 2.0 else "🟢 CDD standar")
    print(f"{nama:42s} {skor:5.2f}  {kep}")
print()
print("COBA UBAH: bobot trx 0.3 -> 0.5 (lebih berat ke perilaku).")
print("N5 (mahasiswa, trx 20x) melonjak ke EDD. Pelajaran: bobot =")
print("KEBIJAKAN RISIKO perusahaan — bukan angka teknis. Direksi yang menetapkan.")`;

  const lab2Code = `# Simulasi denda keterlambatan lapor: 'berapa harga 1 hari telat?'
# Ilustrasi: denda administratif + risiko reputasi (skor).
import random
random.seed(79)

# Skenario: 5 STR terlambat X hari. Denda ilustrasi Rp50 jt/hari/kasus (angka contoh!)
DENDA_PER_HARI = 50_000_000
kasus = [("K1", 3), ("K2", 7), ("K3", 1), ("K4", 14), ("K5", 0)]

total = 0
print(f"{'Kasus':>5s} {'Telat':>5s}  Denda (ilustrasi)")
for k, hari in kasus:
    denda = hari * DENDA_PER_HARI
    total += denda
    flag = "🔴" if hari > 5 else ("🟡" if hari > 0 else "🟢")
    print(f"{k:>5s} {hari:4d}h  Rp{denda/1e9:5.2f} M  {flag}")
print(f"\nTotal ilustrasi: Rp{total/1e9:.2f} M")
print()
print("PENTING: angka denda ilustrasi — yang nyata = KETENTUAN BERLAKU.")
print("Pelajaran: keterlambatan lapor = BIAYA PASTI (denda) vs")
print("'hemat' waktu investigasi = PENGHEMATAN SEMU. Lapor tepat waktu.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR23 — Fraud / ML Analytics • REGULASI ID</span>
        <h1 className="display-title">Regulasi Indonesia: Main di Lapangan<br />OJK, PPATK &amp; UU TPPU</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Denda yang Lebih Mahal dari Fraud-nya</a></li>
          <li><a href="#worked">📐 Worked Example: Timeline STR &amp; Eksposur Sanksi</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Kepatuhan adalah Aset</a></li>

          <li><a href="#peta">Peta Regulasi: Siapa Mengatur Apa</a></li>
          <li><a href="#tppu">UU TPPU: Tiga Pilar Kewajiban</a></li>
          <li><a href="#apuppt">APU-PPT: Framework Harianmu</a></li>
          <li><a href="#lapor">Kewajiban Lapor: LTKT, LTKM &amp; STR</a></li>
          <li><a href="#pdp">UU PDP: Batas Privasi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Risk Scoring Nasabah (CDD)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Harga Keterlambatan Lapor</a></li>
          <li><a href="#sertifikasi">Jalur Sertifikasi: CAMS, CFE &amp; Peta Karir</a></li>
          <li><a href="#peta2">🗺️ Peta Keputusan: Respons Temuan Regulasi</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Jalur Eskalasi</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Pelajaran dari Denda AML</a></li>

          <li><a href="#case">📋 Mini-Case: Audit OJK 30 Hari Lagi</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Regulasi Indonesia</a></li>

          <li><a href="#latihan">Latihan Mandiri: Kepatuhan dalam Angka</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>peran OJK, PPATK, BI</strong> dalam ekosistem anti-fraud/AML Indonesia.</li>
          <li>Menyebutkan <strong>3 pilar kewajiban UU TPPU</strong> dan implementasinya (APU-PPT).</li>
          <li>Membedakan <strong>LTKT, LTKM, dan STR</strong> beserta alurnya.</li>
          <li>Menyusun <strong>rencana sertifikasi</strong> (CAMS/CFE) dan peta karir fraud/AML.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Denda yang Lebih Mahal dari Fraud-nya</h2>
      <div className="story">
        <p>Bank &ldquo;NusaBank&rdquo; (ya, mereka lagi) kehilangan Rp300 juta akibat fraud — sudah diikhlaskan. Lalu datang surat OJK: <strong>denda administratif + perintah perbaikan</strong> karena <strong>3 STR terlambat dilaporkan</strong> (14, 21, dan 30 hari melewati batas). Total denda + biaya konsultan perbaikan: <strong>Rp1,2 miliar</strong> — <strong>4× lipat</strong> dari fraud-nya sendiri.</p>
        <p>Direktur kepatuhan berkata getir: <em>&ldquo;Kami kalah bukan karena tidak bisa menangkap penipu — tapi karena tidak paham <strong>aturan mainnya</strong>.&rdquo;</em></p>
        <p>Twist-nya: analis fraud terbaik pun <strong>tidak berguna</strong> bagi perusahaan jika ia buta regulasi — karena di Indonesia, <strong>kemenangan fraud/AML diukur dari kepatuhan</strong> (FR2, FR15). Lesson ini: peta lapangan tempatmu bermain — OJK, PPATK, UU TPPU, dan tiket masuk profesinya (sertifikasi).</p>
      </div>

      <h2 id="worked">📐 Worked Example: Menghitung Kewajiban Regulasi</h2>
      <p>Regulasi = <strong>tenggat &amp; angka</strong>. Dua contoh cara menghitungnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: timeline pelaporan — dari temuan ke STR</summary>
        <p>Senin, 12 Oktober 2026: tim AML menemukan pola structuring (6 setoran @Rp480jt, contoh FR15). Kapan STR harus sampai ke PPATK?</p>
        <p><strong>Langkah 1 — identifikasi kewajiban.</strong> Transaksi keuangan mencurigakan → wajib lapor STR ke PPATK. Batas umum praktik: <strong>14 hari kerja</strong> sejak indikasi diketahui (ketentuan detail mengikuti regulasi terkini — selalu cek update PPATK!).</p>
        <p><strong>Langkah 2 — hitung hari kerja.</strong> 12 Okt (Senin) = hari ke-0. 14 hari kerja → <strong>30 Oktober 2026</strong> (Jumat), tanpa libur nasional di antaranya.</p>
        <p><strong>Langkah 3 — rencanakan mundur.</strong> Investigasi internal + persetujuan komite: 7 hari kerja (selesai 21 Okt). Penyusunan STR + review legal: 5 hari (selesai 28 Okt). Buffer: 2 hari. <strong>Mulai hari ini</strong> — bukan &ldquo;minggu depan&rdquo;. Keterlambatan 1 hari = temuan audit; keterlambatan sistematis = sanksi.</p>
        <p><strong>Langkah 4 — yang sering lupa.</strong> Selama 14 hari itu: <strong>jangan tipping-off</strong> (FR15, skenario C) — nasabah tidak boleh tahu ia dilaporkan. Dan: dokumentasikan <em>setiap</em> langkah dengan timestamp — &ldquo;kami menemukannya tanggal X, melaporkannya tanggal Y&rdquo; adalah bukti kepatuhanmu saat diperiksa.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: eksposur sanksi — harga sebuah program AML yang lemah</summary>
        <p>Bank menengah: 2 juta nasabah, program AML dinilai &ldquo;tidak memadai&rdquo; dalam pemeriksaan (monitoring tidak jalan 8 bulan, 40 STR terlambat).</p>
        <p><strong>Langkah 1 — sanksi administratif.</strong> Ilustratif: denda per pelanggaran kewajiban lapor dapat mencapai <strong>miliaran rupiah</strong> + teguran tertulis + pembatasan kegiatan usaha tertentu. 40 STR terlambat × denda per kejadian = eksposur puluhan miliar — <em>sebelum</em> reputasi.</p>
        <p><strong>Langkah 2 — biaya remidiasi.</strong> Konsultan + sistem baru + rekrutmen: Rp15–30 M sekali + Rp5 M/tahun operasional. Ditambah: pemeriksaan lanjutan 2 tahun (biaya audit &amp; pelaporan ekstra).</p>
        <p><strong>Langkah 3 — bandingkan dengan investasi.</strong> Membangun program AML yang benar sejak awal: Rp8–12 M/tahun. <strong>Rasio: 1 : 5+</strong> — mencegah 5× lebih murah daripada mengobati. Angka ini adalah <em>business case</em> untuk direksi yang bertanya &ldquo;kenapa budget compliance besar?&rdquo;: karena alternatifnya bukan &ldquo;hemat&rdquo; — alternatifnya adalah denda + remidiasi + pengawasan ketat.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Kepatuhan adalah Aset</h2>
      <p>Di pasar keuangan, <strong>kepercayaan adalah mata uang yang paling keras</strong> — dan kepatuhan adalah cara mencetaknya. Bank dengan program AML/KYC yang kuat mendapatkan: nasabah korporat besar (yang melakukan due diligence ke banknya!), koresponden bank asing (yang memutus hubungan dengan bank berisiko), dan <em>valuasi lebih tinggi</em>. <strong>Kepatuhan bukan pajak — ia premi asuransi yang membayar dividen kepercayaan.</strong></p>
      <p>Intuisi kedua: <strong>regulator adalah <em>partner</em> yang menyamar sebagai pengawas</strong>. PPATK tidak ingin bankmu didenda — ia ingin <em>intelijen berkualitas</em>. OJK tidak ingin usahamu mati — ia ingin <em>sistem keuangan stabil</em>. Bank yang proaktif berkonsultasi, melaporkan tepat waktu, dan jujur soal kelemahannya <strong>diperlakukan berbeda</strong> dari yang defensif dan menutupi. <em>Hubungan regulator = hubungan jangka panjang; investasikan.</em></p>
      <p><strong>Kapan &ldquo;kepatuhan&rdquo; menjadi checkbox yang berbahaya:</strong> (1) <strong>training formalitas</strong> — tanda tangan hadir tanpa pemahaman (FR23 kasus: front-liner tidak tahu tipping-off); (2) <strong>SOP yang tidak pernah diuji</strong> — prosedur STR yang belum pernah dijalankan dalam simulasi; (3) <strong>metrik vanity</strong> — &ldquo;100% staf sudah training&rdquo; tanpa mengukur pemahaman. <strong>Kepatuhan yang tidak diuji = teater.</strong> Uji dengan simulasi, audit mendadak, dan pertanyaan langsung.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bangun <strong>dashboard kepatuhan</strong> dengan metrik yang sama seriusnya dengan metrik fraud: STR on-time rate, KYC freshness, tuning log, hasil simulasi tipping-off. <strong>Yang tidak diukur = tidak dikelola = akan ditemukan pemeriksa.</strong></p>
      </div>

      <h2 id="peta">Peta Regulasi: Siapa Mengatur Apa</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Lembaga</th><th>Peran</th><th>Yang diawasi darimu</th></tr></thead>
          <tbody>
            <tr><td><strong>OJK</strong></td><td>Pengawas industri jasa keuangan</td><td>Program APU-PPT bank/fintech, kepatuhan POJK, denda administratif</td></tr>
            <tr><td><strong>PPATK</strong></td><td>Financial Intelligence Unit — intelijen keuangan</td><td>Laporan STR/LTKT/LTKM via goAML; analisis &amp; teruskan ke penegak hukum</td></tr>
            <tr><td><strong>BI</strong></td><td>Otoritas sistem pembayaran</td><td>Keamanan pembayaran (QRIS, BI-FAST), perlindungan konsumen</td></tr>
            <tr><td><strong>BSSN</strong></td><td>Keamanan siber nasional</td><td>Insiden siber, ketahanan sistem</td></tr>
            <tr><td><strong>Kepolisian/Kejaksaan</strong></td><td>Penegak hukum</td><td>Penyidikan tindak pidana (berdasar analisis PPATK)</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={timelineData}
        title="Tonggak Regulasi Keuangan Indonesia (ilustrasi)"
        layout={{ xaxis: { title: "Regulasi" }, yaxis: { title: "Urutan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = tonggak regulasi, label = tahun.</p>
        <p><strong>Interpretasi:</strong> fondasi (2002) → UU TPPU (2010) → penguatan APU-PPT (2015+) → <strong>UU PDP (2022)</strong> → UU P2SK (2023). <strong>Dua gelombang:</strong> 2010-an = melawan kejahatan keuangan; 2020-an = melindungi data &amp; konsumen. Analis modern hidup di <strong>irisan keduanya</strong> — kejar penipu TANPA langgar privasi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> OJK = <strong>wasit</strong> (mengawasi permainanmu); PPATK = <strong>intelijen</strong> (menerima laporanmu, menganalisis, meneruskan ke polisi). Jangan tertukar: <strong>kamu melapor KE PPATK, dan diawasi OLEH OJK</strong>. Salah alamat lapor = pelanggaran.</p>
      </div>

      <h2 id="tppu">UU TPPU: Tiga Pilar Kewajiban</h2>
      <p>UU No. 8 Tahun 2010 tentang Pencegahan dan Pemberantasan TPPU mewajibkan <strong>pihak pelapor</strong> (bank, fintech, asuransi, dll.):</p>
      <ol>
        <li><strong>Kenali nasabah (CDD):</strong> identifikasi, verifikasi, pantau transaksi vs profil — fondasi FR15.</li>
        <li><strong>Laporkan:</strong> transaksi mencurigakan (STR), transaksi tunai besar (LTKT), transfer dari/luar negeri (LTKM) ke PPATK.</li>
        <li><strong>Simpan &amp; rahasiakan:</strong> dokumen 5 tahun; <strong>dilarang tipping-off</strong> (pidana!).</li>
      </ol>
      <p><strong>Pidana TPPU:</strong> maksimal 20 tahun penjara + denda Rp10 miliar — untuk <em>pelaku</em>. Untuk <em>pihak pelapor</em> yang lalai: <strong>sanksi administratif OJK</strong> (denda, pembatasan kegiatan, pencabutan izin!) — inilah yang menghantui direksi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Yang penting tidak rugi — lapor belakangan tidak apa.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kasus NusaBank: fraud Rp300 jt, denda Rp1,2 M. <strong>Keterlambatan lapor = pelanggaran tersendiri</strong>, terlepas dari ada-tidaknya kerugian. Regulator tidak menilai &ldquo;niat baik&rdquo; — ia menilai <strong>kepatuhan pada tenggat</strong>.</p>
      </div>

      <h2 id="apuppt">APU-PPT: Framework Harianmu</h2>
      <p><strong>APU-PPT</strong> (Anti Pencucian Uang &amp; Pencegahan Pendanaan Terorisme) = implementasi operasional UU TPPU di tiap lembaga. Lima pilarnya:</p>
      <ol>
        <li><strong>Kebijakan &amp; prosedur</strong> tertulis (disetujui direksi).</li>
        <li><strong>Risk-based approach:</strong> skor risiko nasabah (lihat Lab 1!) → kedalaman CDD/EDD.</li>
        <li><strong>Monitoring transaksi</strong> berkelanjutan (inilah TM system — FR15).</li>
        <li><strong>Pelaporan</strong> ke PPATK (LTKT/LTKM/STR via goAML).</li>
        <li><strong>Pelatihan &amp; audit:</strong> karyawan terlatih; audit independen berkala.</li>
      </ol>
      <p><strong>Untuk analis:</strong> APU-PPT adalah <strong>job description</strong>-mu yang ditulis regulator. &ldquo;Monitoring transaksi&rdquo; = pekerjaan harianmu; &ldquo;risk-based&rdquo; = alasan kamu memprioritaskan; &ldquo;pelaporan&rdquo; = output akhirmu.</p>

      <h2 id="lapor">Kewajiban Lapor: LTKT, LTKM &amp; STR</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Laporan</th><th>Isi</th><th>Sifat</th></tr></thead>
          <tbody>
            <tr><td><strong>LTKT</strong></td><td>Transaksi keuangan <strong>tunai</strong> ≥ Rp500 juta (akumulasi 1 hari)</td><td>Otomatis by ambang</td></tr>
            <tr><td><strong>LTKM</strong></td><td>Transfer <strong>dari/luar negeri</strong> (sesuai ketentuan)</td><td>Otomatis by ambang</td></tr>
            <tr><td><strong>STR</strong></td><td>Transaksi <strong>mencurigakan</strong> (tanpa ambang!)</td><td>By <strong>penilaian analis</strong> — inilah pekerjaanmu</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Bedakan:</strong> LTKT/LTKM = <strong>aturan ambang</strong> (sistematis, otomatis). STR = <strong>penilaian</strong> (butuh analis yang paham tipologi — FR15!). STR tidak punya ambang nominal — Rp5 juta pun wajib dilapor jika polanya structuring.</p>
      <p><strong>Alur:</strong> analis → komite → narasi STR (FR15) → <strong>goAML</strong> (portal PPATK) → PPATK analisis → teruskan ke penegak hukum jika cukup bukti.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> LTKT/LTKM = <strong>sensor otomatis</strong>; STR = <strong>penilaian manusia</strong>. Sensor bisa dibeli vendor; penilaian tidak bisa — <strong>inilah nilai jualmu sebagai analis</strong>. Perusahaan membayar untuk judgment, bukan untuk &ldquo;bisa klik tombol lapor&rdquo;.</p>
      </div>

      <h2 id="pdp">UU PDP: Batas Privasi</h2>
      <p>UU No. 27/2022 (PDP) = <strong>kendala</strong> sekaligus <strong>pelindung</strong> analis:</p>
      <ul>
        <li><strong>Dasar pemrosesan:</strong> analisis fraud/AML punya dasar hukum (kewajiban UU TPPU) — <strong>bukan</strong> berarti bebas: tetap <strong>proporsional &amp; minimal</strong> (FR17).</li>
        <li><strong>Hak subjek data:</strong> nasabah berhak tahu data apa dipakai untuk keputusan otomatis tentangnya → <strong>reason code</strong> (FR17) bukan sekadar bagus — ia <strong>hak hukum</strong>.</li>
        <li><strong>Denda:</strong> hingga 2% pendapatan tahunan — <strong>lebih besar</strong> dari banyak denda APU-PPT. Pelanggaran privasi bisa lebih mahal dari pelanggaran AML!</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Demi keamanan, UU PDP tidak berlaku untuk fraud.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kewajiban AML = <em>dasar hukum</em> memproses data, <strong>bukan</strong> pengecualian dari prinsip PDP. Proporsionalitas, minimalisasi, keamanan data tetap berlaku penuh. &ldquo;Demi keamanan&rdquo; tanpa proporsionalitas = pelanggaran PDP.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Risk Scoring Nasabah (CDD)</h2>
      <p>Bangun risk-based approach: siapa wajib EDD?</p>
      <PyodideLab
        title="Lab 1 — Risk Scoring: CDD vs EDD"
        hint="Ubah bobot. Lihat keputusan berubah — buktikan bahwa bobot = kebijakan risiko direksi, bukan angka teknis."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Harga Keterlambatan Lapor</h2>
      <PyodideLab
        title="Lab 2 — Denda Keterlambatan (ilustrasi)"
        hint="Angka denda ilustrasi — yang nyata = ketentuan berlaku. Pelajarannya: telat lapor = biaya pasti vs 'hemat' waktu = penghematan semu."
        defaultCode={lab2Code}
      />

      <h2 id="sertifikasi">Jalur Sertifikasi: CAMS, CFE &amp; Peta Karir</h2>
      <p><strong>Dua sertifikasi yang paling dicari</strong> (muncul eksplisit di lowongan):</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Sertifikasi</th><th>Fokus</th><th>Cocok untuk</th></tr></thead>
          <tbody>
            <tr><td><strong>CAMS</strong> (Certified Anti-Money Laundering Specialist)</td><td>AML global: tipologi, regulasi, program kepatuhan</td><td>AML analyst, compliance — <strong>wajib</strong> untuk karir AML serius</td></tr>
            <tr><td><strong>CFE</strong> (Certified Fraud Examiner)</td><td>Fraud: investigasi, pencegahan, hukum</td><td>Fraud analyst/investigator — kredibilitas investigasi</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={careerData}
        title="Peta Gaji Karir Fraud/AML Jakarta (ilustrasi, Rp juta/bulan)"
        layout={{ xaxis: { title: "Jenjang" }, yaxis: { title: "Gaji (Rp jt/bln)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kisaran gaji bulanan per jenjang (ilustrasi pasar Jakarta 2026).</p>
        <p><strong>Interpretasi:</strong> analis (8–9 jt) → lead (15 jt) → manager (25 jt) → head (45 jt). <strong>Lompatan terbesar: analis → lead</strong> — dan pembedanya bukan &ldquo;teknis&rdquo;, melainkan <strong>judgment + komunikasi + sertifikasi</strong>. Inilah ROI belajar track ini.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi karir:</strong> urutan yang terbukti: <strong>SQL + investigasi (FR21)</strong> → kerja 1–2 tahun → <strong>CAMS/CFE</strong> → lead. Sertifikasi tanpa pengalaman = kertas; pengalaman tanpa sertifikasi = lambat naik. Kombinasi = akselerator.</p>
      </div>

      <h2 id="peta2">🗺️ Peta Keputusan: Respons Temuan Regulasi</h2>

      <div className="decision-card">
        <h3>1. Temuan tipologi jelas → <strong>investigasi → STR via goAML (jangan tipping-off!)</strong></h3>
        <p><strong>Kenapa:</strong> kewajiban hukum; narasi berkualitas (FR15).</p>
      </div>

      <div className="decision-card">
        <h3>2. Ambang LTKT/LTKM terlampaui → <strong>lapor otomatis tepat waktu</strong></h3>
        <p><strong>Kenapa:</strong> sistematis — tidak ada alasan telat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data ingin dipakai untuk fitur baru → <strong>uji PDP: dasar hukum + proporsional + minimal</strong></h3>
        <p><strong>Kenapa:</strong> denda PDP bisa &gt; denda AML.</p>
      </div>

      <div className="decision-card">
        <h3>4. Audit OJK mendekat → <strong>rapikan: kebijakan, audit trail, bukti pelatihan</strong></h3>
        <p><strong>Kenapa:</strong> auditor menilai <em>proses terdokumentasi</em>, bukan &ldquo;niat baik&rdquo;.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Lapor KE PPATK, diawasi OLEH OJK</strong> — jangan tertukar.</li>
          <li>STR = penilaian (tanpa ambang); LTKT/LTKM = ambang otomatis.</li>
          <li><strong>Tipping-off = pidana.</strong> Titik.</li>
          <li>PDP berlaku penuh — proporsional &amp; minimal, walau demi keamanan.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Lapor ke Mana, Kapan Libatkan Siapa</h2>
      <p>Tiga keputusan routing yang salah satunya bisa jadi masalah pidana:</p>
      <p><strong>Skenario A — PPATK vs OJK vs BI vs Kepolisian.</strong> <strong>PPATK:</strong> STR (indikasi TPPU/pendanaan terorisme) — intelijen keuangan, bukan penyidik. <strong>OJK:</strong> laporan kepatuhan, pelanggaran prudensial, perlindungan konsumen. <strong>BI:</strong> sistem pembayaran &amp; PUJK terkait. <strong>Kepolisian/Kejaksaan:</strong> tindak pidana (laporan polisi). Satu kasus bisa menyentuh ketiganya — <strong>urutannya</strong>: STR ke PPATK (kewajiban), laporan internal ke OJK/BI sesuai ketentuan, lapor polisi jika ada korban/kerugian pidana. Salah alamat = kewajiban dianggap tidak terpenuhi.</p>
      <p><strong>Skenario B — kapan libatkan legal internal vs eksternal.</strong> Internal cukup untuk: STR rutin, respons pemeriksaan biasa. Eksternal (law firm) untuk: indikasi melibatkan direksi/pejabat, potensi pidana korporasi, sengketa dengan regulator. Aturan: <strong>jika temuan bisa menyentuh direksi, investigator internal punya konflik kepentingan</strong> — libatkan pihak independen sejak hari pertama.</p>
      <p><strong>Skenario C — tipping-off: garis merahnya.</strong> Dilarang: memberi tahu nasabah/calon tersangka bahwa ia dilaporkan atau dipantau. Diperbolehkan: prosedur standar yang berlaku umum (&ldquo;transaksi Bapak perlu verifikasi rutin&rdquo;). Area abu-abu: menolak transaksi tanpa penjelasan — amannya: siapkan <strong>skrip yang disetujui legal</strong> untuk setiap skenario, latihkan ke semua front-liner. Pelanggaran tipping-off = <strong>pidana</strong>, bukan administratif — ini garis yang tidak boleh dilewati sekali pun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> regulator tidak menghukum bank yang <em>kecolongan</em> satu kasus — ia menghukum bank yang <strong>tidak punya sistem</strong> untuk menangkapnya. Pertanyaan pemeriksa bukan &ldquo;kenapa lolos?&rdquo; melainkan &ldquo;di mana SOP-nya, di mana laporannya, di mana perbaikannya?&rdquo;. Sistem yang jujur tentang kegagalannya &gt; sistem yang sempurna di atas kertas.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Anatomi Sebuah Sanksi</h2>
      <p>Pola umum dari berbagai sanksi administratif di sektor keuangan Indonesia (kompilasi, bukan satu kasus spesifik): bank dikenai denda miliaran rupiah + pembatasan ekspansi — bukan karena terlibat kejahatan, tapi karena <strong>program AML-nya tidak berfungsi</strong>.</p>
      <p><strong>Temuan pemeriksa yang berulang:</strong></p>
      <ol>
        <li><strong>Monitoring fiktif:</strong> sistem ada, tapi threshold tidak pernah di-tuning 3 tahun — 0 STR dari segmen berisiko tinggi (padahal volume besar).</li>
        <li><strong>KYC kedaluwarsa:</strong> 40% nasabah korporat tidak pernah di-review ulang sejak onboarding 5 tahun lalu — pemilik manfaat sudah berganti, bank tidak tahu.</li>
        <li><strong>STR terlambat sistematis:</strong> rata-rata 60 hari dari temuan ke pelaporan — pola, bukan insiden.</li>
        <li><strong>Training formalitas:</strong> seluruh staf &ldquo;sudah training&rdquo; (tanda tangan hadir), tapi front-liner tidak tahu apa itu tipping-off saat ditanya langsung.</li>
      </ol>
      <p><strong>Pelajaran untuk analis:</strong> keempat temuan ini <strong>terdeteksi dari data</strong> — bukan dari wawancara. 0 STR dari segmen berisiko = anomali statistik. KYC kedaluwarsa = query umur data. STR terlambat = selisih tanggal. Artinya: <strong>analis data adalah garda terdepan kepatuhan</strong> — dashboard yang jujur akan berteriak <em>sebelum</em> pemeriksa datang. Bangun metrik kepatuhan (STR on-time rate, KYC freshness, tuning log) dengan serius yang sama seperti metrik fraud.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Regulasi = beban yang menghambat bisnis.&rdquo;<br /><strong>Yang benar:</strong> regulasi yang dipahami = <strong>keunggulan kompetitif</strong>. Bank dengan program AML kuat mendapat kepercayaan korporat &amp; koresponden bank asing — yang lemah kehilangan keduanya. Di pasar keuangan, <em>kepercayaan adalah mata uang</em> — dan kepatuhan adalah cara mencetaknya.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Audit OJK 30 Hari Lagi</h2>
      <div className="callout">
        <p>OJK mengumumkan audit APU-PPT ke bankmu <strong>30 hari lagi</strong>. Kondisi: 12 STR terlambat 5–30 hari (belum dilaporkan!), program training karyawan terakhir 2 tahun lalu, tidak ada dokumentasi risk scoring nasabah, TM rule belum di-tuning 1 tahun.</p>
        <p><strong>Pertanyaan:</strong> rencana 30 hari (prioritas + urutan). Mana yang dikerjakan dulu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Minggu 1 — hentikan pendarahan:</strong> (1) laporkan 12 STR yang terlambat <strong>sekarang</strong> (telat + dilaporkan &gt; telat + disembunyikan — yang kedua = pelanggaran berlapis); (2) dokumentasikan <em>mengapa</em> telat + rencana perbaikan (auditor menghargai kejujuran + remediation).</p>
          <p><strong>Minggu 2–3 — fondasi:</strong> (3) susun dokumentasi risk scoring (pakai Lab 1 sebagai draft!); (4) jalankan training kilat APU-PPT untuk semua staf terkait (catat kehadiran — bukti!).</p>
          <p><strong>Minggu 4 — tuning:</strong> (5) tuning TM rule (FR15) + dokumentasikan metodologinya.</p>
          <p><strong>Prinsip:</strong> auditor menilai <strong>proses + dokumentasi + itikad perbaikan</strong>. &ldquo;Kami telat tapi sudah lapor + perbaiki&rdquo; &gt;&gt; &ldquo;kami sembunyikan dan berharap lolos&rdquo;. <strong>Pelajaran karir:</strong> menghadapi regulator = menghadapi manusia — kejujuran + sistem &gt; kesempurnaan palsu.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Regulasi Indonesia</h2>
      <details className="worked">
        <summary>Q1: PPATK vs OJK vs BI — siapa mengawasi apa?</summary>
        <p><strong>PPATK:</strong> intelijen keuangan — menerima STR/CTR, menganalisis, meneruskan ke penegak hukum. Bukan penyidik, bukan pemberi sanksi langsung. <strong>OJK:</strong> pengawas industri jasa keuangan — kepatuhan, sanksi administratif, perlindungan konsumen. <strong>BI:</strong> sistem pembayaran &amp; moneter. <strong>Satu kasus bisa menyentuh ketiganya</strong> — kenali jalurnya (FR23 peta lanjutan skenario A). <em>Salah alamat = kewajiban dianggap tidak terpenuhi.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: STR terlambat 1 hari — seberapa serius?</summary>
        <p><strong>Satu kali, dengan alasan jelas &amp; terdokumentasi:</strong> biasanya menjadi catatan pembinaan. <strong>Berpola/sistematis:</strong> temuan pemeriksaan → sanksi administratif → denda. Yang dinilai bukan keterlambatan tunggal — tapi <strong>apakah sistemmu <em>dirancang</em> untuk tepat waktu</strong>. Punya SOP + kalender + pemilik + buffer = bukti itikad; tidak punya = bukti kelalaian. <em>Bangun sistemnya, bukan alasannya.</em></p>
      </details>
      <details className="worked">
        <summary>Q3: Karyawan melanggar tipping-off — siapa yang bertanggung jawab?</summary>
        <p><strong>Keduanya:</strong> karyawan secara <em>pidana individual</em>, perusahaan secara <em>administratif</em> (gagal melatih &amp; mengawasi). Pembelaan perusahaan yang diterima: <strong>bukti training berkala + simulasi + skrip yang disetujui legal + penindakan internal</strong>. Tanpa itu, &ldquo;kami sudah melarang&rdquo; tidak cukup. <em>Tanggung jawab perusahaan = tanggung jawab atas sistemnya.</em></p>
      </details>
      <details className="worked">
        <summary>Q4: UMKM/fintech kecil — kewajiban AML-nya sama dengan bank besar?</summary>
        <p><strong>Prinsipnya sama, proporsional pelaksanaannya</strong> — pendekatan <em>risk-based</em>: kewajiban menyesuaikan <em>risiko &amp; skala</em>. Fintech kecil tidak butuh divisi AML 20 orang — tapi <strong>wajib</strong> punya: penanggung jawab, KYC dasar, monitoring yang sesuai skala, dan pelaporan. <em>Proporsional bukan opsional.</em> Dan: tumbuh tanpa membangun kepatuhan = menumpuk utang regulasi yang ditagih sekaligus saat pemeriksaan pertama.</p>
      </details>

      <details className="worked">
        <summary>Q5: Bagaimana menyiapkan diri menghadapi pemeriksaan OJK/PPATK?</summary>
        <p><strong>Empat persiapan:</strong> (1) <em>data room</em> — SOP, tuning log, laporan STR/CTR, hasil audit internal, <em>terorganisir &amp; mutakhir</em>; (2) <em>mock audit</em> — simulasi pemeriksaan tiap tahun oleh pihak independen; (3) <em>narasumber siap</em> — siapa menjelaskan apa (jangan tunjuk orang dadakan); (4) <em>temuan lama sudah ditutup</em> — temuan berulang = sinyal sistemik = sanksi berat. <strong>Pemeriksaan yang lancar = hasil kerja 364 hari sebelumnya.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Whistleblowing — perlindungan dan perannya di AML?</summary>
        <p><strong>Whistleblower internal</strong> sering menjadi sumber temuan terbesar (insider fraud, pelanggaran prosedur). Kewajiban perusahaan: <strong>saluran aman + perlindungan dari retaliasi + tindak lanjut serius</strong> — diatur dalam ketentuan tata kelola. Praktik terbaik: saluran dikelola <em>independen</em> (bukan atasan langsung terlapor), SLA tindak lanjut tertulis. <strong>Budaya &ldquo;aman melapor&rdquo; = sistem deteksi termurah</strong> yang tidak bisa dibeli dari vendor.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Kepatuhan dalam Angka</h2>
      <p><strong>1.</strong> Indikasi structuring ditemukan Selasa, 13 Oktober 2026. Batas lapor 14 hari kerja. Hitung deadline-nya (asumsi tanpa libur nasional) dan buat rencana mundurnya dalam 3 tahap.</p>
      <p><strong>2.</strong> Tiga temuan — routing ke mana masing-masing? (a) pola layering Rp8M; (b) nasabah protes pemblokiran ke OJK; (c) karyawan memberi tahu nasabah bahwa ia &ldquo;sedang dipantau PPATK&rdquo;.</p>
      <p><strong>3.</strong> CS menerima telepon dari nasabah yang transaksinya ditahan saat ia dalam pantauan EDD. Tulis skrip 2 kalimat yang aman (tanpa tipping-off).</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> 14 hari kerja dari 13 Okt (Sel) = <strong>2 November 2026</strong> (Senin). Rencana mundur: investigasi + komite s.d. 21 Okt; penyusunan STR + review legal s.d. 28 Okt; buffer + submit s.d. 2 Nov. <em>Mulai hari ini.</em></p>
        <p><strong>2.</strong> (a) <strong>STR ke PPATK</strong> (indikasi TPPU); (b) <strong>respons formal ke OJK</strong> + siapkan reason code (FR17); (c) <strong>insiden tipping-off</strong> — investigasi internal + lapor ke legal/PPATK sesuai ketentuan; karyawan diproses. <em>Urutannya menentukan, bukan kecepatannya saja.</em></p>
        <p><strong>3.</strong> Contoh: &ldquo;Transaksi Bapak sedang dalam <strong>verifikasi rutin</strong> sesuai prosedur kami; mohon menunggu maksimal 1x24 jam, atau Bapak dapat datang ke cabang terdekat dengan identitas.&rdquo; <strong>Tanpa</strong> kata: investigasi, pantauan, AML, PPATK.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kamu menemukan pola structuring. Lapor ke siapa, dan siapa yang mengawasimu?"
        options={[
          "Lapor ke OJK, diawasi PPATK",
          "Lapor KE PPATK (via goAML), diawasi OLEH OJK — jangan tertukar",
          "Lapor ke polisi langsung",
          "Tidak perlu lapor",
        ]}
        correct={1}
        explanation="Benar: PPATK = penerima laporan (intelijen); OJK = pengawas kepatuhanmu. Salah alamat = pelanggaran prosedur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Perbedaan LTKT dan STR?"
        options={[
          "Sama saja",
          "LTKT = otomatis by ambang (tunai ≥Rp500jt/hari); STR = by PENILAIAN analis, tanpa ambang nominal — Rp5 juta pun wajib jika polanya structuring",
          "STR untuk tunai",
          "LTKT untuk luar negeri",
        ]}
        correct={1}
        explanation="Benar: ambang vs penilaian. STR adalah tempat judgment analis bekerja — dan tempat nilaimu sebagai profesional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 'Demi keamanan, UU PDP tidak berlaku untuk analisis fraud.' Pernyataan ini…"
        options={[
          "Benar",
          "Salah — kewajiban AML = dasar hukum memproses, BUKAN pengecualian dari proporsionalitas & minimalisasi PDP",
          "Benar untuk bank besar",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Benar: salah. Denda PDP (2% pendapatan) bisa > denda AML. Keamanan tanpa proporsionalitas = pelanggaran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Nasabah bertanya: 'Apakah saya sedang dilaporkan ke PPATK?' Jawaban benar?"
        options={[
          "Jujur: 'Ya, Bapak dilaporkan'",
          "TIDAK BOLEH memberi tahu — tipping-off = pidana. Jawab sesuai SOP tanpa mengonfirmasi/menyangkal status laporan",
          "Alihkan ke Google",
          "Tutup telepon",
        ]}
        correct={1}
        explanation="Benar: tipping-off = pidana. Ini bukan soal 'sopan santun' — ini hukum. SOP komunikasi harus disiapkan SEBELUM kejadian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Urutan karir yang paling didukung bukti pasar?"
        options={[
          "Langsung CAMS tanpa pengalaman",
          "SQL + investigasi → pengalaman 1-2 tahun → CAMS/CFE → lead — sertifikasi tanpa pengalaman = kertas; pengalaman tanpa sertifikasi = lambat",
          "Hanya andalkan Python/ML",
          "Tidak perlu belajar lagi",
        ]}
        correct={1}
        explanation="Benar: fondasi (SQL+investigasi) → pengalaman → sertifikasi → akselerasi. Track ini (FR1-FR23) = fondasinya; CAMS/CFE = akseleratornya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Lapor KE PPATK, diawasi OLEH OJK;</strong> BI = pembayaran, BSSN = siber.</li>
          <li><strong>UU TPPU 3 pilar:</strong> kenali nasabah, laporkan, simpan &amp; rahasiakan.</li>
          <li><strong>APU-PPT 5 pilar</strong> = job description yang ditulis regulator.</li>
          <li><strong>LTKT/LTKM</strong> = ambang otomatis; <strong>STR</strong> = penilaian analis (tanpa ambang!).</li>
          <li><strong>Tipping-off = pidana.</strong> UU PDP berlaku penuh — proporsional &amp; minimal.</li>
          <li><strong>CAMS</strong> (AML) + <strong>CFE</strong> (fraud) = tiket akselerasi karir setelah 1–2 tahun pengalaman.</li>
          <li>Kemenangan di Indonesia = <strong>kepatuhan</strong> — analis buta regulasi = tidak berguna bagi perusahaan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr22-chargeback" className="btn btn-secondary btn-sm">← FR22</Link>
        <Link href="/" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}
