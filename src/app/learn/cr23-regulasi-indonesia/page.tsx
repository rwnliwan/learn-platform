"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr23Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(8);
  const bmpkData = [
    {
      x: ["Pihak terkait", "1 debitur", "1 grup", "BUMN pembangunan"],
      y: [10, 20, 25, 30],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#e8a838", "#3aa655"] },
      text: ["10%", "20%", "25%", "30%"],
      textposition: "outside",
    },
  ];

  const kpmmTrendData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025", "2026"],
      y: [24.1, 23.8, 25.2, 26.4, 27.1, 26.8],
      type: "scatter",
      mode: "lines+markers",
      name: "KPMM industri (%)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: ["2021", "2022", "2023", "2024", "2025", "2026"],
      y: [12, 12, 12, 12, 12, 12],
      type: "scatter",
      mode: "lines",
      name: "Minimum (8% + buffer)",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
  ];

  const sltpData = [
    {
      x: ["Kolek 1", "Kolek 2", "Kolek 3", "Kolek 4", "Kolek 5"],
      y: [92, 4, 1.5, 1, 1.5],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef9244", "#ef4444", "#991b1b"] },
      text: ["92%", "4%", "1,5%", "1%", "1,5%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator BMPK — batas maksimum pemberian kredit
# BMPK = % dari MODAL bank (POJK). Cek apakah rencana kredit melanggar.
modal_bank = 8000  # Rp miliar
aturan = {
    "Pihak terkait": 0.10,
    "Satu debitur (tidak terkait)": 0.20,
    "Satu grup (tidak terkait)": 0.25,
    "BUMN pembangunan": 0.30,
}
rencana = [
    ("PT Maju (terkait)", "Pihak terkait", 900),
    ("PT Sejahtera", "Satu debitur (tidak terkait)", 1500),
    ("Grup Sejahtera (3 PT)", "Satu grup (tidak terkait)", 2200),
]
print(f"Modal bank: Rp {modal_bank} M")
print(f"{'Debitur':<24} {'Maks BMPK':>10} {'Rencana':>9} {'Status':>8}")
for nama, kat, nominal in rencana:
    maks = aturan[kat] * modal_bank
    st = "OK" if nominal <= maks else "LANGGAR!"
    print(f"{nama:<24} {maks:>8.0f} M {nominal:>7} M {st:>8}")
print()
print("Coba: naikkan rencana PT Maju jadi 900 -> 950. Apa yang terjadi?")
print("Pelanggaran BMPK = sanksi OJK: teguran, denda, hingga pembatasan usaha.")
print("Analis WAJIB cek BMPK sebelum ACC — ini hard limit hukum.")`;

  const lab2Code = `# Lab 2: Simulasi KPMM — berapa kredit bisa tumbuh?
# KPMM = Modal / ATMR. Bank ingin ekspansi kredit tapi jaga KPMM >= 14%.
modal = 8000          # Rp miliar
atmr_saat_ini = 50000 # Rp miliar
bobot_rata2 = 0.75    # bobot risiko rata-rata portofolio baru
target_kpmm = 14.0

kpmm_skrg = modal / atmr_saat_ini * 100
# ATMR maks agar KPMM >= target: ATMR <= Modal / target
atmr_maks = modal / (target_kpmm / 100)
ruang_atmr = atmr_maks - atmr_saat_ini
kredit_baru_maks = ruang_atmr / bobot_rata2

print(f"KPMM saat ini : {kpmm_skrg:.1f}%")
print(f"ATMR maksimum : Rp {atmr_maks:,.0f} M (agar KPMM >= {target_kpmm}%)")
print(f"Ruang ATMR    : Rp {ruang_atmr:,.0f} M")
print(f"Kredit baru maks: Rp {kredit_baru_maks:,.0f} M")
print()
print("Coba: (1) bobot_rata2 0.75 -> 1.0 (kredit lebih berisiko).")
print("      (2) target_kpmm 14 -> 12. Bagaimana ruang tumbuh berubah?")
print("Pelajaran: KPMM adalah REM pertumbuhan — modal membatasi ambisi.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR23 — Credit Risk Analyst</span>
        <h1 className="display-title">Regulasi Indonesia:<br />OJK, BMPK, KPMM &amp; BSMR</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 8 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rambu yang Menyelamatkan</a></li>
          <li><a href="#ojk">OJK &amp; POJK: Wasit Perbankan</a></li>
          <li><a href="#bmpk">BMPK: Jangan Taruh Semua Telur</a></li>
          <li><a href="#kpmm">KPMM: Sabuk Pengaman Modal</a></li>
          <li><a href="#slik">SLIK &amp; BSMR: Mata dan Ijazah</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator BMPK</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Ruang Tumbuh KPMM</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Cek Regulasi Sebelum ACC</a></li>
          <li><a href="#realita">🏛️ Studi Kasus Penegakan Aturan</a></li>
          <li><a href="#case">📋 Mini-Case: Kredit Kilat yang Menabrak Rambu</a></li>
          <li><a href="#quiz">✏️ Quiz (8 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan peran OJK dan POJK kunci di risiko kredit (kualitas aset, BMPK, KPMM).</li>
          <li>Menghitung BMPK dan memverifikasi rencana kredit tidak melanggar.</li>
          <li>Menghitung KPMM dan menganalisis ruang pertumbuhan kredit.</li>
          <li>Menjelaskan fungsi SLIK dan nilai sertifikasi BSMR untuk karir.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Rambu yang Menyelamatkan</h2>
      <div className="story">
        <p>Tahun 1998. Belum ada rambu yang kuat: bank boleh memberi kredit <strong>triliunan ke grup usahanya sendiri</strong>, modal tipis, pengawasan longgar. Ketika krisis datang, puluhan bank <strong>runtuh bersama</strong> — dan rakyat membayar lewat BLBI.</p>
        <p>Pelajaran itu melahirkan <strong>OJK</strong> (2011) dan seperangkat rambu: <strong>BMPK</strong> (batas konsentrasi), <strong>KPMM</strong> (bantalan modal), <strong>kolektibilitas</strong> (standar kualitas aset), <strong>SLIK</strong> (mata bersama).</p>
        <p>Hari ini, analis kredit Bank Nusantara hendak ACC kredit Rp 900 M ke <strong>PT Maju — perusahaan milik komisaris bank</strong>. Tanpa BMPK, ini "bisnis biasa". Dengan BMPK: <strong>ini pelanggaran hukum</strong> jika melebihi 10% modal. Rambu yang dulu tidak ada di 1998, kini <strong>menyelamatkan bank dari dirinya sendiri</strong>.</p>
        <p><strong>Twist-nya:</strong> banyak analis menganggap regulasi = "birokrasi". Padahal setiap pasal POJK ditulis dengan <strong>tinta kegagalan bank</strong> — ada yang bangkrut di balik tiap angka. Lesson ini membuatmu membaca rambu seperti <strong>sejarah</strong>, bukan seperti <strong>hambatan</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="ojk">OJK &amp; POJK: Wasit Perbankan</h2>
      <p><strong>Definisi.</strong> <strong>OJK</strong> (Otoritas Jasa Keuangan) = pengawas bank sejak 2011 (sebelumnya Bank Indonesia). <strong>POJK</strong> = peraturan yang diterbitkan OJK — <strong>hukum</strong> bagi bank.</p>
      <p><strong>POJK kunci risiko kredit:</strong></p>
      <ul>
        <li><strong>Kualitas aset</strong> — standar kolektibilitas 1–5 &amp; CKPN (kolek 2, DPD, restrukturisasi — CR2).</li>
        <li><strong>BMPK</strong> — batas maksimum pemberian kredit per pihak (anti-konsentrasi).</li>
        <li><strong>KPMM</strong> — kecukupan modal minimum (Basel III versi Indonesia).</li>
        <li><strong>Manajemen risiko</strong> — wajib ada satuan kerja manajemen risiko yang independen.</li>
      </ul>
      <p><strong>Kepribadian:</strong> OJK seperti <strong>wasit sepak bola</strong> — tidak bermain, tapi meniup peluit saat pelanggaran. Bank yang "membenci wasit" biasanya yang <strong>ingin curang</strong>. Analis yang baik <strong>bermain dengan wasit</strong>, bukan melawannya.</p>

      <h2 id="bmpk">BMPK: Jangan Taruh Semua Telur</h2>
      <p><strong>Definisi.</strong> <strong>BMPK</strong> (Batas Maksimum Pemberian Kredit) = plafon kredit ke satu pihak/grup sebagai <strong>% modal bank</strong>:</p>

      <PlotlyChart
        data={bmpkData}
        title="BMPK: Batas per Kategori (% dari modal bank)"
        layout={{ xaxis: { title: "Kategori" }, yaxis: { title: "% modal" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = batas maksimum untuk kategori itu.</p>
        <p><strong>Interpretasi:</strong> <strong>pihak terkait paling ketat (10%)</strong> — konflik kepentingan = risiko moral tertinggi. Pelajaran 1998: kredit ke grup sendiri adalah <strong>jalur favorit</strong> pengurasan bank. <strong>Analis WAJIB cek status "terkait/tidak"</strong> sebelum ACC — salah klasifikasi = pelanggaran.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> BMPK dihitung dari <strong>modal</strong>, bukan dari total kredit. Artinya: bank kecil <strong>tidak bisa</strong> memberi kredit jumbo — bukan karena tidak mau, melainkan karena <strong>dilarang</strong>. Inilah mengapa bank kecil fokus UMKM: regulasi membentuk <strong>strategi bisnis</strong>.</p>
      </div>

      <h2 id="kpmm">KPMM: Sabuk Pengaman Modal</h2>
      <p><strong>Definisi.</strong> <strong>KPMM</strong> (Kewajiban Penyediaan Modal Minimum) = versi Indonesia dari <strong>Basel capital adequacy</strong> (CR4a):</p>
      <Tex math={String.raw`\text{KPMM} = \frac{\text{Modal}}{\text{ATMR}} \times 100\% \geq 8\% + \text{buffer}`} block />
      <p><strong>Artinya:</strong> tiap Rp 100 aset berisiko (ATMR) harus didukung modal minimum. Di Indonesia praktiknya bank menjaga <strong>jauh di atas 8%</strong> (industri ~25%+) — karena buffer OJK + kehati-hatian.</p>

      <PlotlyChart
        data={kpmmTrendData}
        title="KPMM Perbankan Indonesia (ilustrasi tren)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "KPMM (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = KPMM industri; garis merah = minimum regulasi.</p>
        <p><strong>Interpretasi:</strong> industri konsisten <strong>2–3× lipat</strong> di atas minimum — perbankan Indonesia <strong>sangat capitalized</strong> (pelajaran 1998 tidak dilupakan). <strong>Tapi</strong>: KPMM tinggi juga berarti <strong>modal menganggur</strong> — trade-off antara keamanan dan ROE. Bank dengan KPMM 30% = aman tapi "malas".</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Regulasi hanya urusan compliance — analis kredit fokus bisnis."</strong></p>
        <p><strong>Yang benar:</strong> BMPK &amp; KPMM <strong>menentukan</strong> apakah kredit boleh diberikan dan berapa banyak. Analis yang mengusulkan kredit melanggar BMPK = usulannya <strong>mati di meja</strong> (atau lebih buruk: lolos lalu jadi temuan OJK). <strong>Cek regulasi adalah langkah pertama analisis, bukan terakhir.</strong></p>
      </div>

      <h2 id="slik">SLIK &amp; BSMR: Mata dan Ijazah</h2>
      <p><strong>SLIK</strong> (Sistem Layanan Informasi Keuangan, dulu BI Checking) = <strong>database kredit nasional</strong> OJK. Tiap bank <strong>wajib lapor</strong> dan boleh <strong>cek</strong> riwayat kredit calon debitur di <strong>semua</strong> bank. Skor SLIK 1–5 = kolektibilitas terburuk di sistem.</p>
      <p><strong>Aturan praktis:</strong> SLIK 3+ di bank lain = <strong>tolak otomatis</strong> (atau verifikasi mendalam). Calon debitur "bersih" di bankmu tapi macet di 3 bank lain = <strong>terlihat di SLIK</strong>. Inilah mengapa "pindah bank untuk kabur dari utang" tidak berhasil.</p>
      <p><strong>BSMR</strong> (Badan Sertifikasi Manajemen Risiko) = lembaga sertifikasi profesi risiko Indonesia. <strong>Sertifikasi BSMR level 1–5</strong> adalah <strong>kredensial standar industri</strong> — banyak lowongan Credit Risk Analyst mencantumkan "BSMR preferred/diutamakan". Level 1 = dasar (cocok untuk analis junior); level 4–5 = enterprise risk (direksi).</p>

      <PlotlyChart
        data={sltpData}
        title="Distribusi Kolektibilitas SLIK Nasional (ilustrasi)"
        layout={{ xaxis: { title: "Kolektibilitas" }, yaxis: { title: "% debitur" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % debitur nasional per kolektibilitas.</p>
        <p><strong>Interpretasi:</strong> <strong>92% lancar</strong> — mayoritas debitur Indonesia membayar tepat waktu (jangan biarkan berita macet menipu: yang macet itu <strong>minoritas berisik</strong>). Tapi 8% bermasalah = <strong>jutaan</strong> orang — SLIK memastikan mereka <strong>tidak bisa mengulang</strong> di bank lain tanpa ketahuan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci (karir):</strong> untuk <strong>lowongan Credit Risk Analyst Indonesia</strong>, tiga hal paling sering dicari: <strong>SQL/Python</strong> (teknis), <strong>pemahaman PSAK 71 &amp; OJK</strong> (regulasi), dan <strong>BSMR</strong> (kredensial). Lesson CR1–CR25 ini membangun dua yang pertama; <strong>BSMR Level 1</strong> adalah langkah berikutnya yang konkret — ujiannya menguji persis materi seperti di track ini.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Wasit, Bukan Lawan</h3>
      <p>Analis junior sering melihat OJK sebagai "penghambat bisnis" — yang membatasi ini-itu. Analis senior melihat OJK sebagai <strong>wasit yang membuat permainan bisa dimainkan</strong>. Tanpa BMPK, bank saling berlomba memberi kredit jumbo ke konglomerasi yang sama — lalu kolaps bersama (1998). Tanpa KPMM, bank berlomba menipiskan modal — lalu meminta bailout (Century). <strong>Regulasi adalah solusi atas kegagalan kolektif</strong> — ia memaksa setiap bank menahan diri, sehingga tidak ada yang bisa "curang" dengan mengambil risiko berlebihan. Bank yang "membenci wasit" biasanya bank yang ingin melanggar.</p>
      <p>Intuisi kedua: <strong>SLIK mengubah kredit dari hubungan menjadi sistem</strong>. Dulu, riwayat kredit adalah "pengetahuan" loan officer — bisa dimanipulasi, bisa hilang saat officer pindah. Kini SLIK mencatat semuanya secara nasional — <strong>reputasi kredit menjadi aset yang portabel dan permanen</strong>. Bagi analis: SLIK adalah <strong>sumber kebenaran</strong> yang tidak bisa dibohongi debitur ("saya tidak punya utang lain" — cek SLIK, selesai). Bagi debitur: perilaku baik di satu bank menjadi modal di semua bank — <strong>insentif untuk jujur</strong>.</p>
      <p>Intuisi ketiga — karir: <strong>BSMR + pemahaman regulasi = tiket masuk</strong>. Lowongan Credit Risk Analyst Indonesia hampir selalu mencantumkan: SQL/Python (teknis), pemahaman POJK/Basel (regulasi), dan sertifikasi BSMR (kredibilitas). Tiga kaki ini — teknis, regulasi, sertifikasi — adalah <strong>tripod karir</strong> analis risiko Indonesia. Lesson ini menyelesaikan kaki kedua; kaki pertama dibangun di lab-lab track ini; kaki ketiga adalah langkahmu berikutnya.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator BMPK</h2>
      <p>Cek tiga rencana kredit — ada yang melanggar?</p>
      <PyodideLab
        title="Lab 1 — Cek BMPK"
        hint="Naikkan rencana PT Maju 900 → 950. Lalu coba: bagaimana jika modal bank turun jadi 7000 (misal rugi)? Batas ikut turun — BMPK 'menyusut' saat bank lemah!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Ruang Tumbuh KPMM</h2>
      <p>Berapa kredit baru bisa diberikan tanpa melanggar KPMM?</p>
      <PyodideLab
        title="Lab 2 — Ruang Tumbuh KPMM"
        hint="Ubah bobot 0.75 → 1.0 dan target 14 → 12. Diskusikan: bank dengan KPMM mepet target harus pilih — tumbuh di segmen aman (bobot rendah) atau tambah modal?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Cek Regulasi Sebelum ACC</h2>

      <div className="decision-card">
        <h3>1. Cek SLIK dulu → <strong>skor 3+ = tolak/verifikasi mendalam</strong></h3>
        <p><strong>Kondisi:</strong> setiap aplikasi baru.</p>
        <p><strong>Aksi:</strong> SLIK adalah <strong>langkah nol</strong> — sebelum analisis apapun. Macet di bank lain = penjelasan wajib.</p>
      </div>

      <div className="decision-card">
        <h3>2. Cek status terkait → <strong>tentukan BMPK yang benar</strong></h3>
        <p><strong>Kondisi:</strong> debitur punya hubungan dengan pemilik/pengurus bank.</p>
        <p><strong>Aksi:</strong> gunakan 10% (bukan 20%). Salah klasifikasi = pelanggaran + temuan OJK.</p>
      </div>

      <div className="decision-card">
        <h3>3. Hitung dampak KPMM → <strong>pastikan ruang modal cukup</strong></h3>
        <p><strong>Kondisi:</strong> kredit besar / ekspansi agresif.</p>
        <p><strong>Aksi:</strong> proyeksikan KPMM pasca-pencairan. Jika mepet target → pilih segmen bobot rendah atau tunda.</p>
      </div>

      <div className="decision-card">
        <h3>4. Dokumentasikan → <strong>jejak audit untuk OJK</strong></h3>
        <p><strong>Kondisi:</strong> selalu.</p>
        <p><strong>Aksi:</strong> setiap keputusan kredit harus bisa dijelaskan ke pemeriksa OJK <strong>2 tahun kemudian</strong>. Tidak terdokumentasi = tidak terjadi.</p>
      </div>

            <div className="decision-card">
        <h3>5. Aturan baru (POJK) terbit dan mengubah perhitungan KPMM — bank mepet batas → <strong>hitung dampak + siapkan rencana, jangan tunggu</strong></h3>
        <p><strong>Kondisi:</strong> POJK baru memperketat bobot risiko segmen tertentu. Bankmu (KPMM 10,5%) menghitung ulang: KPMM turun ke 9,3% — masih di atas 8%, tetapi buffer menipis dan tren mengkhawatirkan.</p>
        <p><strong>Aksi:</strong> (1) <strong>hitung dampak presisi</strong> — segmen mana yang paling terpukul? (2) <strong>komunikasi proaktif ke OJK</strong> — "kami terdampak X, rencana kami Y" (regulator menghargai bank yang datang duluan); (3) <strong>rencana modal</strong> — tahan dividen, siapkan rights issue/subdebt, atau <strong>rebalancing portofolio</strong> ke segmen berbobot rendah; (4) <strong>jangan tunggu tenggat</strong> — penyesuaian di awal murah, di akhir mahal (terburu-buru = keputusan buruk). Prinsip: <strong>regulasi baru = cuaca baru — sesuaikan layar sebelum badai, bukan saat badai</strong>.</p>
        <p><strong>Contoh nyata:</strong> setiap implementasi Basel baru (terakhir: output floor) memicu "musim hitung ulang" di bank-bank Indonesia. Yang siap 1 tahun sebelumnya tenang; yang baru menghitung saat tenggat panik — dan keputusan panik (jor-joran jual aset) merugikan.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>SLIK → BMPK → KPMM</strong>: urutan cek sebelum ACC.</li>
          <li><strong>Terkait = 10%.</strong> Jangan salah klasifikasi.</li>
          <li><strong>KPMM = rem pertumbuhan.</strong> Modal membatasi ambisi.</li>
          <li><strong>BSMR Level 1</strong> = tiket karir berikutnya.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Uji Kepatuhan 4 Lapis: Sebelum Analisis Bisnis</h3>
      <p>Urutan yang benar: kepatuhan DULU, bisnis KEMUDIAN. Empat lapis ini = gerbang yang tidak bisa dinegosiasi.</p>
      <ol>
        <li><strong>Lapis 1 — SLIK</strong> — Cek riwayat nasional. Kolek 3+ di bank lain = tolak otomatis (atau investigasi mendalam). Tidak ada analisis yang bisa mengalahkan fakta SLIK.</li>
        <li><strong>Lapis 2 — BMPK</strong> — Hitung total eksposur grup vs modal. Melampaui = tolak otomatis (atau kecilkan). Tidak ada 'pengecualian informal'.</li>
        <li><strong>Lapis 3 — KPMM / appetite</strong> — Apakah bank punya ruang modal? Apakah sesuai risk appetite (sektor, produk, tenor)? Di luar appetite = butuh persetujuan khusus.</li>
        <li><strong>Lapis 4 — Regulasi spesifik produk</strong> — LTV/FTV untuk KPR? Batas bunga untuk kartu? Aturan penagihan? Setiap produk punya 'peraturan main' sendiri.</li>
        <li><strong>BARU kemudian — analisis bisnis:</strong> — 5C, rasio, DSCR, RAROC, covenant. Analisis terbaik di dunia tidak berguna jika kepatuhannya gagal — karena <strong>pelanggaran = tolak otomatis</strong>.</li>
        <li><strong>Dokumentasikan:</strong> — Setiap lapis dicatat hasil + tanggal + sumber. 'Sudah dicek' tanpa bukti = belum dicek (di mata auditor).</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> jadikan ini halaman 1 setiap memo kredit — sebelum 5C. Analis yang melompati kepatuhan = analis yang membahayakan bank.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ POJK baru terbit — bagaimana analis mengikutinya?</summary>
        <p><strong>Langganan, bukan sekali belajar:</strong> (1) situs OJK (POJK baru), (2) asosiasi profesi (BSMR, perbanas), (3) compliance bank (socialisasi internal — HADIRI, jangan skip). Aturan yang kedaluwarsa = analis yang kedaluwarsa. <strong>Alokasikan 2 jam/bulan</strong> untuk update regulasi.</p>
      </details>
      <details className="worked">
        <summary>❓ OJK vs BI — siapa mengatur apa sekarang?</summary>
        <p><strong>OJK:</strong> pengawasan bank &amp; lembaga keuangan (mikroprudensial, perlindungan konsumen). <strong>BI:</strong> moneter, sistem pembayaran, makroprudensial. Bertemu di <strong>KSSK</strong> (Komite Stabilitas Sistem Keuangan) untuk krisis. Analis kredit: <strong>90% urusanmu dengan OJK</strong>.</p>
      </details>
      <details className="worked">
        <summary>❓ Bank melanggar BMPK sedikit — apa konsekuensinya?</summary>
        <p><strong>Tidak ada 'sedikit' dalam pelanggaran.</strong> Konsekuensi: teguran → denda → kewajiban menurunkan eksposur SEGERA (fire sale = rugi) → pengawasan intensif → (berulang) pembatasan usaha. 'Sedikit' hari ini = preseden untuk 'banyak' besok. <strong>Nol toleransi dimulai dari analis.</strong></p>
      </details>
      <details className="worked">
        <summary>❓ LPS menjamin sampai Rp 2 M — apakah kredit ikut dijamin?</summary>
        <p><strong>Tidak.</strong> LPS menjamin <strong>simpanan</strong> (deposito, tabungan) — bukan kredit. Kredit macet = risiko bank (dan tidak ada yang mengganti). Jangan campur: LPS melindungi <strong>nasabah penyimpan</strong> dari kegagalan bank; tidak melindungi bank dari <strong>kredit macet</strong>.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Studi Kasus Penegakan Aturan</h2>
      <p>Regulasi Indonesia bukan sekadar daftar aturan — ia punya <strong>sejarah, penegakan, dan celah</strong> yang hidup.</p>

      <h3>Dari BI ke OJK: Lahirnya Wasit Baru (2011)</h3>
      <p>Sebelum 2011, bank diawasi <strong>Bank Indonesia</strong>. Sejak UU OJK, pengawasan beralih ke <strong>OJK</strong> (2011, efektif penuh 2014). Transisinya tidak mulus — BI "kehilangan" kewenangan yang dimilikinya puluhan tahun. Bagi analis, yang penting: <strong>arsip aturan BI lama masih berlaku</strong> (diadopsi OJK) kecuali dicabut — sehingga analis senior masih mengutip "PBI" (Peraturan BI) untuk hal-hal yang belum diatur ulang POJK. Memahami dua rezim = memahami mengapa beberapa aturan terasa "warisan".</p>

      <h3>Penegakan: Dari Surat Cinta hingga Cabut Izin</h3>
      <p>OJK punya <strong>tangga sanksi</strong> yang nyata:</p>
      <ul>
        <li><strong>Teguran tertulis</strong> ("surat cinta") — untuk pelanggaran ringan/pertama. Sering diremehkan, tetapi tercatat.</li>
        <li><strong>Denda administratif</strong> — untuk pelanggaran berulang atau material.</li>
        <li><strong>Pembatasan kegiatan usaha</strong> — dilarang ekspansi produk/cabang, dibatasi dividen.</li>
        <li><strong>Pencabutan izin usaha</strong> — hukuman mati. Diterapkan untuk bank/BPR yang tidak bisa disehatkan (beberapa BPR dicabut izinnya tiap tahun — <strong>pelajaran untuk yang mengira "kecil tidak diawasi"</strong>).</li>
      </ul>
      <p>Kasus Century (2008, era BI) dan pencabutan izin BPR bermasalah adalah <strong>bukti wasit meniup peluit</strong> — bukan pajangan. Analis yang mengusulkan pelanggaran ("BMPK-nya dilanggar sedikit, nanti dibereskan") sedang mengusulkan banknya <strong>menantang wasit</strong> — dan wasit Indonesia punya kartu merah.</p>

      <h3>LPS: Jaring Pengaman Nasabah</h3>
      <p><strong>LPS</strong> (Lembaga Penjamin Simpanan) menjamin simpanan nasabah hingga <strong>Rp 2 miliar per nasabah per bank</strong> (batas yang berlaku). Fungsinya: mencegah <strong>bank run</strong> — nasabah tidak perlu panik menarik dana saat bank bermasalah, karena simpanannya dijamin. Bagi analis risiko: LPS adalah <strong>alasan sistemik</strong> mengapa OJK begitu ketat — karena kegagalan bank = uang LPS (publik) yang membayar. Setiap kredit yang kamu setujui diam-diam didukung oleh <strong>jaring pengaman publik</strong> — tanggung jawabnya melampaui bank.</p>

      <h3>UU P2SK (2023): Babak Baru</h3>
      <p>UU Pengembangan dan Penguatan Sektor Keuangan (<strong>UU P2SK</strong>, 2023) adalah reformasi terbesar sektor keuangan Indonesia dalam 20 tahun — memperkuat OJK, mengatur ulang perizinan, dan menyiapkan <strong>transisi pengawasan</strong>. Bagi analis: lanskap regulasi <strong>bergerak</strong> — POJK baru terbit tiap tahun. <strong>Kompetensi regulasi bukan sekali belajar</strong> — melainkan langganan seumur karir. Ikuti situs OJK dan asosiasi profesi; analis yang aturannya kedaluwarsa = analis yang kedaluwarsa.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: uji kepatuhan proposal (klik untuk buka)</summary>
        <p>Proposal: kredit Rp 150 M ke PT Grup Jaya (grup usaha). Modal bank Rp 800 M. Grup sudah punya kredit Rp 40 M di bank ini.</p>
        <p><strong>Langkah 1 — BMPK:</strong> total eksposur grup = 150 + 40 = Rp 190 M = 190/800 = <strong>23,75% modal</strong>. Batas pihak tidak terkait ~20–25% — <strong>mepet/melampaui</strong> (tergantung ketentuan tepat)!<br />
        <strong>Langkah 2 — SLIK:</strong> cek kolektibilitas grup di bank lain — jika ada yang Kolek 3+, red flag.<br />
        <strong>Langkah 3 — KPMM:</strong> RWA tambahan = 190 M × 100% = Rp 190 M → memakan modal 8% × 190 = Rp 15,2 M minimum.<br />
        <strong>Langkah 4 — vonis:</strong> <strong>kecilkan plafon</strong> (misal Rp 100 M → total 140 M = 17,5% modal, aman) ATAU minta pengecualian formal (hampir tidak pernah diberikan untuk BMPK). Jangan "pecah" ke anak perusahaan untuk menghindari BMPK — <strong>itu pelanggaran</strong> (single obligor).</p>
        <p><strong>Pelajaran:</strong> uji kepatuhan <strong>sebelum</strong> analisis bisnis — karena pelanggaran = tolak otomatis, sebagus apapun proposalnya. Urutan yang benar: <strong>SLIK → BMPK → KPMM → analisis</strong> (ingat aturan 10 detik CR25!).</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Bank kecil/BPR tidak diawasi ketat — yang penting bank besar."</strong></p>
        <p><strong>Yang benar:</strong> OJK <strong>mencabut izin</strong> BPR bermasalah setiap tahun — justru karena kecil, mereka tidak "too big to fail" dan tidak diselamatkan. "Terlalu kecil untuk diawasi" tidak ada; yang ada "terlalu kecil untuk diselamatkan". Analis di bank kecil justru harus <strong>lebih disiplin</strong> — tidak ada jaring pengaman kedua.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Kredit Kilat yang Menabrak Rambu</h2>
      <div className="callout">
        <p>Direksi Bank Nusantara ingin <strong>"kredit kilat korporasi"</strong>: plafon Rp 1 T per debitur, proses 3 hari, target Rp 10 T dalam setahun. Modal bank Rp 8 T. Kamu diminta pendapat risiko.</p>
        <ul>
          <li>BMPK satu debitur tidak terkait = 20% × 8 T = <strong>Rp 1,6 T</strong> — plafon Rp 1 T <strong>lolos</strong> BMPK. ✓</li>
          <li>Tapi: 10 debitur × Rp 1 T = Rp 10 T baru. ATMR naik ~Rp 10 T → KPMM turun dari 16% ke <strong>~13%</strong> — mepet target internal 14%!</li>
          <li>Proses 3 hari = <strong>analisis 5C dikorbankan</strong> (CR17b: credit memo butuh verifikasi).</li>
          <li>Konsentrasi: 10 debitur = <strong>12,5% modal per nama</strong> — HHI melonjak (CR15).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> setuju atau tolak? Beri 3 syarat jika setuju bersyarat.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Setuju bersyarat</strong> — BMPK lolos, tapi tiga rambu lain berkedip:</p>
          <p>(1) <strong>KPMM:</strong> batasi tahap 1 = Rp 5 T (KPMM tetap ≥14%), tahap 2 setelah tambah modal / laba ditahan.<br />
          (2) <strong>Proses:</strong> 3 hari hanya untuk <strong>rating A</strong> dengan agunan penuh + SLIK bersih; sisanya ikut proses normal. Kecepatan tanpa standar = BLBI jilid 2.<br />
          (3) <strong>Konsentrasi:</strong> maks 5% modal per nama untuk program kilat (lebih ketat dari BMPK) + diversifikasi sektor wajib.</p>
          <p>Pelajaran: <strong>BMPK lolos ≠ aman</strong>. Regulasi adalah <strong>batas minimum</strong>, bukan standar ideal — bank yang baik menetapkan <strong>rambu internal lebih ketat</strong> dari OJK.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Memecah Grup untuk Menghindari BMPK?</h2>
      <div className="callout">
        <p>RM mengusulkan "solusi kreatif": PT Grup Jaya butuh Rp 190 M (BMPK mepet). Usulannya: pecah menjadi <strong>4 proposal @Rp 47,5 M</strong> ke 4 anak perusahaan grup — "kan beda PT, jadi masing-masing di bawah batas."</p>
        <ul>
          <li>Keempat PT: direksi sama, pemegang saham sama (induk 90%+), kantor sama, rekening operasional terpusat di induk.</li>
          <li>RM berargumen: "Secara hukum beda badan hukum. Ini efisien, bukan pelanggaran."</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis, apa jawabanmu? Jelaskan konsep single obligor dan konsekuensinya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Jawaban: TOLAK usulan itu — ini pelanggaran BMPK.</strong></p>
          <p><strong>Konsep single obligor:</strong> perusahaan-perusahaan dengan <strong>pengendalian bersama</strong> (satu induk mengendalikan 90%+, direksi sama, operasional terpusat) dihitung sebagai <strong>satu pihak</strong> untuk BMPK — <strong>terlepas</strong> dari badan hukum yang berbeda. Tujuannya persis mencegah "kreativitas" seperti ini: risiko ekonominya satu (induk jatuh = semua jatuh, korelasi ≈ 1), sehingga batasnya harus satu.</p>
          <p><strong>Konsekuensi jika dilanggar:</strong> temuan OJK (sanksi administratif, denda), kewajiban <strong>menurunkan eksposur</strong> segera (fire sale = rugi), dan <strong>reputasi</strong> — bank yang ketahuan "mengakali" BMPK masuk radar pengawasan intensif untuk semua hal lain. "Efisien" yang melanggar = bom waktu regulasi.</p>
          <p><strong>Solusi yang benar:</strong> kecilkan plafon ke batas aman, atau sindikasi dengan bank lain (bagi risiko secara legal dan transparan). Kreativitas ada tempatnya — <strong>bukan di kepatuhan</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (8 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bank modal Rp 10 T. Maksimal kredit ke satu debitur TIDAK terkait?"
        options={[
          "Rp 1 T (10%)",
          "Rp 2 T (20%)",
          "Rp 2,5 T (25%)",
          "Rp 3 T (30%)",
        ]}
        correct={1}
        explanation="Benar: 20% × 10 T = Rp 2 T. (25% untuk grup, 30% BUMN pembangunan, 10% pihak terkait.)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa BMPK pihak terkait (10%) lebih ketat?"
        options={[
          "Diskriminasi",
          "Konflik kepentingan: kredit ke grup sendiri adalah jalur favorit pengurasan bank (pelajaran 1998) — risiko moral tertinggi",
          "Agar bank kecil tidak tumbuh",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: setiap angka BMPK ditulis dengan tinta kegagalan bank. 1998 = kredit ke grup sendiri = awal keruntuhan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. KPMM 16%, target internal 14%, rencana ekspansi menurunkan ke 13,5%. Keputusan?"
        options={[
          "Jalan terus — masih di atas 8%",
          "Tahan/batasi: melanggar target INTERNAL (14%) — target internal adalah komitmen ke komisaris, bukan angka hiasan",
          "Turunkan target jadi 12%",
          "Tambah ATMR lagi",
        ]}
        correct={1}
        explanation="Benar: target internal > minimum OJK karena buffer. Menurunkannya agar 'lolos' = manipulasi ambang (seperti CR20 opsi 3)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Calon debitur SLIK kolek 3 di bank lain, tapi bersih di bankmu. Tindakan?"
        options={[
          "ACC — yang penting bersih di sini",
          "Tolak / verifikasi mendalam: SLIK = mata bersama; macet di tempat lain = red flag yang wajib dijelaskan",
          "Minta dia tutup rekening di bank lain",
          "Naikkan bunga saja",
        ]}
        correct={1}
        explanation="Benar: SLIK ada agar 'kabur antar bank' tidak berhasil. Kolek 3 di tempat lain = penjelasan wajib sebelum analisis lanjut."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. BSMR Level 1 paling berguna untuk?"
        options={[
          "Menggantikan pengalaman kerja",
          "Kredensial standar industri: banyak lowongan Credit Risk Analyst mencantumkan BSMR — sinyal kompetensi yang diakui OJK/industri",
          "Naik gaji otomatis",
          "Tidak berguna",
        ]}
        correct={1}
        explanation="Benar: BSMR = sinyal terstandar. Materi ujiannya = persis topik track ini (risiko kredit, regulasi, PSAK 71)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. BMPK lolos tapi KPMM mepet dan analisis 5C dikorbankan. Prinsipnya?"
        options={[
          "BMPK lolos = aman, jalan",
          "Regulasi = batas MINIMUM, bukan standar ideal — bank yang baik pasang rambu internal lebih ketat + jangan korbankan analisis",
          "Abaikan KPMM",
          "Percepat lagi prosesnya",
        ]}
        correct={1}
        explanation="Benar: OJK menetapkan lantai, bukan langit-langit. Risk appetite internal harus lebih konservatif."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. RM mengusulkan memecah kredit Rp 190 M ke 4 anak perusahaan satu grup (direksi & pemegang saham sama) agar 'di bawah BMPK'. Responsmu?"
        options={[
          "Setuju — kan beda PT, efisien",
          "Tolak — single obligor: pengendalian bersama = satu pihak untuk BMPK; ini pelanggaran dengan sanksi OJK",
          "Setuju asal dokumennya rapi",
          "Tanyakan ke direksi",
        ]}
        correct={1}
        explanation="Benar: tolak. Single obligor melihat pengendalian ekonomi, bukan badan hukum. 'Kreativitas' menghindari BMPK = pelanggaran = temuan OJK + kewajiban menurunkan eksposur + reputasi hancur. Solusi benar: kecilkan plafon atau sindikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(7, ok)}
        question="8. POJK baru memperketat bobot risiko; KPMM bank turun 10,5%→9,3%. Langkah pertama yang benar?"
        options={[
          "Tunggu tenggat — masih di atas 8%",
          "Hitung dampak presisi per segmen + komunikasi proaktif ke OJK + rencana modal/rebalancing — penyesuaian di awal murah, di akhir mahal",
          "Sembunyikan dari OJK",
          "Naikkan bunga semua kredit",
        ]}
        correct={1}
        explanation="Benar: proaktif. Hitung dampak, datang ke OJK duluan dengan rencana, siapkan modal/rebalancing. Regulator menghargai bank yang siap; yang panik di tenggat membuat keputusan buruk (jor-joran jual aset)."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>OJK</strong> = wasit; <strong>POJK</strong> = hukum (kualitas aset, BMPK, KPMM, manajemen risiko).</li>
          <li><strong>BMPK</strong>: terkait 10%, debitur 20%, grup 25%, BUMN 30% — dari modal.</li>
          <li><strong>KPMM = Modal/ATMR</strong> — rem pertumbuhan; industri Indonesia ~25%+.</li>
          <li><strong>SLIK</strong> = mata bersama (langkah nol tiap aplikasi).</li>
          <li><strong>BSMR Level 1</strong> = kredensial karir berikutnya.</li>
          <li>Urutan cek: <strong>SLIK → BMPK → KPMM → dokumentasi</strong>. Regulasi = batas minimum.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr22-collection-recovery" className="btn btn-secondary btn-sm">← CR22</Link>
        <Link href="/learn/cr24-fairness-explainability" className="btn btn-primary btn-sm">Next: CR24 →</Link>
      </div>
    </div>
  );
}
