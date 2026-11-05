"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM9Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const maturityData = [
    {
      x: ["Level 1<br>Awal", "Level 2<br>Berulang", "Level 3<br>Terdefinisi", "Level 4<br>Terkelola", "Level 5<br>Optimal"],
      y: [35, 30, 20, 10, 5],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["35%", "30%", "20%", "10%", "5%"],
      textposition: "outside",
    },
  ];

  const damaData = [
    {
      x: ["Tata Kelola", "Arsitektur", "Pemodelan", "Penyimpanan", "Keamanan", "Integrasi", "Dokumen", "Warehouse", "Metadata", "Kualitas"],
      y: [8.5, 6.0, 7.0, 7.5, 8.0, 6.5, 5.0, 7.0, 5.5, 7.8],
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Lab 1: Maturity assessment — nilai sendiri organisasi (contoh bank fiktif)
# Jawab 8 pertanyaan (0=tidak ada, 1=ad-hoc, 2=terdefinisi, 3=terkelola).
# Coba ubah jawaban sesuai organisasimu (atau organisasimu impian).

jawaban = {
    "Ada data owner tertulis per domain?": 1,
    "Definisi metrik tunggal (glossary)?": 0,
    "Kebijakan retensi & penghapusan?": 1,
    "Test kualitas otomatis di pipeline?": 2,
    "Katalog data bisa dicari?": 0,
    "Akses data pakai approval tercatat?": 1,
    "Lineage kritis terdokumentasi?": 0,
    "Dewan/komite data bertemu rutin?": 1,
}

def level(skor):
    return ["Level 1: Awal", "Level 2: Berulang", "Level 3: Terdefinisi",
            "Level 4: Terkelola", "Level 5: Optimal"][min(skor, 4)]

print("=== HASIL ASSESSMENT ===")
for tanya, skor in jawaban.items():
    print(f"  [{skor}] {tanya}")
rata = sum(jawaban.values()) / len(jawaban)
print()
print(f"Rata-rata: {rata:.2f} -> {level(round(rata))}")
print()
terendah = sorted(jawaban.items(), key=lambda x: x[1])[:2]
print("Prioritas perbaikan (2 terendah):")
for t, s in terendah:
    print(f"  - {t} (skor {s})")
print()
print("Pelajaran: maturity model mengubah 'governance kita buruk' menjadi")
print("'kita level 2, target level 3 tahun ini via 2 perbaikan ini' — terukur.")`;

  const lab2Code = `# Lab 2: RACI — siapa melakukan apa? (anti "saling lempar")
# Kasus: tabel 'nasabah' butuh definisi tunggal kolom 'status_aktif'.

raci = [
    # aktivitas,              Responsible,   Accountable,  Consulted,    Informed
    ("Usulkan definisi",      "Steward",     "Owner",      "Analis",     "Engineer"),
    ("Setujui definisi",      "Owner",       "Owner",      "Council",    "Semua tim"),
    ("Implementasi di pipeline", "Engineer", "Steward",    "Owner",      "Analis"),
    ("Sosialisasi & latih",   "Steward",     "Owner",      "-",          "Semua tim"),
    ("Audit kepatuhan",       "Steward",     "Council",    "Owner",      "Direksi"),
]

print("RACI definisi 'status_aktif':")
print(f"{'Aktivitas':<24} {'R':<10} {'A':<10} {'C':<10} {'I'}")
for a, r, ac, c, i in raci:
    print(f"{a:<24} {r:<10} {ac:<10} {c:<10} {i}")

print()
print("Aturan RACI: tepat SATU A (accountable) per baris — jika dua, tidak ada yang")
print("benar-benar bertanggung jawab. Itulah obat 'saling lempar'.")
print()
print("Coba: tambah aktivitas 'Hapus data nasabah tutup rekening' — siapa R/A/C/I-nya?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM9 — Data Management</span>
        <h1 className="display-title">Data Governance:<br />Siapa Berhak Memutuskan soal Data?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Denda Rp32 Miliar karena "Tidak Ada yang Tahu"</a></li>
          <li><a href="#apa">Governance ≠ Management — Wasit vs Pemain</a></li>
          <li><a href="#dama">DAMA-DMBOK — Peta 10 Wilayah</a></li>
          <li><a href="#peran">Owner, Steward, Council — Tiga Pilar Manusia</a></li>
          <li><a href="#kebijakan">Kebijakan — Aturan Main Tertulis</a></li>
          <li><a href="#maturity">Maturity Model — Dari Kacau ke Optimal</a></li>
          <li><a href="#lab1">🔬 Lab 1: Maturity Assessment Mini</a></li>
          <li><a href="#lab2">🔬 Lab 2: RACI — Obat Saling Lempar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Mulai Governance dari Mana</a></li>
          <li><a href="#worked">🔢 Worked Example: Skor 1,4 → 2,8</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Wasit vs Pemain</a></li>
          <li><a href="#lab3">🔬 Lab 3: Kalkulator Pajak Kekacauan</a></li>
          <li><a href="#case">📋 Mini-Case: "Data Siapa Ini?"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan data governance vs data management dengan contoh konkret.</li>
          <li>Menyebutkan 10 area DAMA-DMBOK dan posisi governance di antaranya.</li>
          <li>Membedakan peran owner, steward, dan data council beserta akuntabilitasnya (RACI).</li>
          <li>Melakukan maturity assessment sederhana dan menentukan 2 prioritas perbaikan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Denda Rp32 Miliar karena "Tidak Ada yang Tahu"</h2>
      <div className="story">
        <p>Sebuah bank multinasional didenda regulator setara Rp32 miliar. Bukan karena fraud — karena saat regulator meminta <em>"tunjukkan eksposur kalian ke sektor properti dalam 48 jam"</em>, bank butuh <strong>6 minggu</strong>. Datanya ada, tersebar di 14 sistem, definisi "eksposur properti" beda-beda, tidak ada yang bisa memastikan angkanya benar. Regulator menyimpulkan: bank ini <strong>tidak mengendalikan datanya sendiri</strong>.</p>
        <p>Twist-nya: bank itu punya data engineer terbaik dan warehouse termahal. Yang tidak punya: <strong>seseorang yang berwenang memutuskan</strong> definisi, pemilik tiap data, dan kebijakan yang ditegakkan. Teknologi tanpa governance = mobil balap tanpa pengemudi. Inilah lesson tentang <em>siapa berhak memutuskan</em> — pertanyaan yang membosankan sampai dendanya datang.</p>
      </div>

      <h2 id="apa">Governance ≠ Management — Wasit vs Pemain</h2>
      <p><strong>Definisi DAMA:</strong> <strong>Data governance</strong> = wewenang & kontrol atas pengelolaan data (siapa memutuskan, aturan apa). <strong>Data management</strong> = eksekusinya (membangun pipeline, membersihkan data).</p>
      <p><strong>Kepribadian:</strong> governance = <em>wasit + pembuat peraturan</em>; management = <em>pemain di lapangan</em>. Wasit tidak menendang bola — tapi tanpa wasit, pertandingan jadi tawuran. Contoh konkret:</p>
      <ul>
        <li>Governance memutuskan: "definisi 'nasabah aktif' = X, owner-nya Bu Rina, retensi 5 tahun." (DM1, DM8)</li>
        <li>Management mengeksekusi: engineer membangun pipeline sesuai definisi itu; steward mendokumentasikan.</li>
      </ul>
      <p><strong>Kenapa dibedakan:</strong> agar keputusan (otoritas) tidak dicampur dengan pelaksana (yang bisa bias ke kepentingan teknis). Owner bisnis memutuskan <em>apa yang benar</em>; engineer memutuskan <em>bagaimana membangunnya</em>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Governance = birokrasi yang memperlambat."</strong></p>
        <p><strong>Yang benar:</strong> governance yang <em>buruk</em> = birokrasi. Governance yang <em>baik</em> justru <strong>mempercepat</strong>: analis tidak buang 3 minggu debat definisi (DM1), engineer tidak rebuild karena requirement berubah-ubah, audit lewat tanpa panik. Yang lambat = tidak adanya keputusan, bukan adanya.</p>
      </div>

      <h2 id="dama">DAMA-DMBOK — Peta 10 Wilayah</h2>
      <p><strong>Definisi.</strong> DAMA-DMBOK (Data Management Body of Knowledge) = kerangka standar industri: <strong>10 area pengetahuan</strong> dengan <strong>Data Governance di pusat</strong> — ia mengarahkan 9 lainnya:</p>
      <ol>
        <li><strong>Data Governance</strong> (pusat) — wewenang & kontrol</li>
        <li>Data Architecture — rancangan (DM14)</li>
        <li>Data Modeling & Design (DM2)</li>
        <li>Data Storage & Operations (DM3, DM15)</li>
        <li>Data Security (DM12)</li>
        <li>Data Integration & Interoperability (DM5, DM6)</li>
        <li>Documents & Content (data tak terstruktur)</li>
        <li>Data Warehousing & BI (DM4, DM16)</li>
        <li>Metadata (DM10)</li>
        <li>Data Quality (DM7)</li>
      </ol>
      <p><strong>Cara pakai:</strong> bukan untuk dihafal — untuk <strong>diagnosis</strong>: "masalah kita di area mana?" (Lihat chart: area metadata & dokumen biasanya skor terendah — itulah kenapa DM10 ada.) DMBOK memberi <em>bahasa bersama</em> lintas tim.</p>

      <PlotlyChart
        data={damaData}
        title="Contoh Skor Kematangan per Area DMBOK (bank fiktif)"
        layout={{ xaxis: { title: "Area" }, yaxis: { title: "Skor /10" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = skor kematangan tiap area DMBOK (0–10).</p>
        <p><strong>Interpretasi:</strong> pola klasik: keamanan & kualitas lumayan, <strong>metadata & dokumen jeblok</strong> — persis seperti kebanyakan perusahaan. <strong>Pelajaran:</strong> DMBOK mengubah keluhan kabur ("data kita berantakan") menjadi diagnosis presisi ("metadata 5,5/10 — bangun katalog dulu"). Itulah fungsi kerangka kerja.</p>
      </div>

      <h2 id="peran">Owner, Steward, Council — Tiga Pilar Manusia</h2>
      <ul>
        <li><strong>Data Owner:</strong> <em>pemilik akuntabilitas</em> — biasanya pimpinan bisnis (Head of Retail). Wewenang: menyetujui definisi, kebijakan akses, retensi. <strong>Disalahkan</strong> jika datanya kacau. (Satu domain = satu owner, DM1.)</li>
        <li><strong>Data Steward:</strong> <em>tangan operasional</em> — menjaga definisi, kualitas, dokumentasi harian. Tahu detail, tapi tidak punya wewenang final. Jembatan bisnis ↔ teknis.</li>
        <li><strong>Data Council:</strong> <em>parlemen</em> — perwakilan tiap domain + TI + legal + risiko, bertemu rutin. Tugas: putuskan hal lintas-domain ("definisi 'pendapatan' untuk SEMUA divisi"), selesaikan sengketa, setujui kebijakan.</li>
      </ul>
      <p><strong>RACI</strong> (Lab 2): untuk tiap keputusan, tetapkan <strong>R</strong>esponsible (mengerjakan), <strong>A</strong>ccountable (tepat 1 orang — disalahkan), <strong>C</strong>onsulted (dimintai pendapat), <strong>I</strong>nformed (diberi tahu). Satu A per baris = obat "saling lempar".</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> steward tanpa owner = sekretaris tanpa bos (tidak ada yang mengesahkan); owner tanpa steward = bos tanpa staf (keputusan tidak tereksekusi); council tanpa keduanya = rapat tanpa hasil. Ketiganya satu paket — dan ketiganya butuh <strong>nama orang nyata</strong>, bukan "tim".</p>
      </div>

      <h2 id="kebijakan">Kebijakan — Aturan Main Tertulis</h2>
      <p><strong>Definisi.</strong> Kebijakan = aturan tertulis yang <strong>ditegakkan</strong> (bukan imbauan). Contoh isi:</p>
      <ul>
        <li><strong>Akses:</strong> "data nasabah hanya untuk peran X dengan approval tercatat" (teknis: RBAC — DM12).</li>
        <li><strong>Retensi:</strong> "data transaksi disimpan 5 tahun, lalu dihapus otomatis" (DM1).</li>
        <li><strong>Kualitas:</strong> "tabel Gold wajib lolos 100% test kritis sebelum dipakai laporan" (DM7).</li>
        <li><strong>Privasi:</strong> "NIK wajib masking untuk analis" (DM12).</li>
      </ul>
      <p><strong>Siklus hidup kebijakan:</strong> rancang (council) → sosialisasi → <strong>tegakkan otomatis</strong> (di pipeline/tool, bukan diharap diingat) → audit → revisi. Kebijakan yang hanya di PDF = dekorasi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Bikin dokumen kebijakan 100 halaman = governance selesai."</strong></p>
        <p><strong>Yang benar:</strong> kebijakan yang tidak ditegakkan otomatis = fiksi. Ujiannya: "apakah pelanggaran <em>terdeteksi & ditindak</em>?" Jika data sensitif masih bisa di-download analis tanpa approval tercatat, kebijakanmu hanya kertas. Mulai dari 5 kebijakan yang ditegakkan, bukan 100 yang diangan-angankan.</p>
      </div>

      <h2 id="maturity">Maturity Model — Dari Kacau ke Optimal</h2>
      <p><strong>Definisi.</strong> 5 level kematangan (CMMI-style):</p>
      <ol>
        <li><strong>Initial:</strong> heroik individual, tidak ada proses. ("Tanya Budi kalau mau data.")</li>
        <li><strong>Repeatable:</strong> ada pola tapi tergantung orang.</li>
        <li><strong>Defined:</strong> proses tertulis & diikuti.</li>
        <li><strong>Managed:</strong> diukur dengan metrik (SLO! — DM8).</li>
        <li><strong>Optimizing:</strong> perbaikan berkelanjutan otomatis.</li>
      </ol>
      <p><strong>Gunanya:</strong> mengubah "kita buruk" → "kita level 2, target level 3 via 2 perbaikan" (Lab 1). <strong>Aturan main:</strong> nilai jujur (kebanyakan org = level 1–2, lihat chart), naik <strong>satu level per area per tahun</strong> — lompat 1→4 = fantasi.</p>

      <PlotlyChart
        data={maturityData}
        title="Distribusi Kematangan Governance (estimasi industri)"
        layout={{ xaxis: { title: "Level" }, yaxis: { title: "% organisasi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi organisasi di tiap level.</p>
        <p><strong>Interpretasi:</strong> 65% masih di level 1–2 — jadi jika organisasimu di sana, kamu <em>normal</em>, bukan gagal. <strong>Pelajaran karir:</strong> justru ini peluang — orang yang bisa membawa org dari level 2 ke 3 sangat dicari (dan dibayar mahal), karena di situlah nilai bisnis terbesar tercipta.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> governance = <strong>maraton bertahap</strong>, bukan proyek 3 bulan. Mulai dari <em>satu domain kritis</em> (misal data nasabah), buktikan nilai (audit lewat, definisi tunggal), baru perluas. Kemenangan kecil yang nyata &gt; program raksasa yang mangkrak.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Maturity Assessment Mini</h2>
      <p>Nilai 8 pertanyaan, dapatkan levelmu + 2 prioritas perbaikan.</p>
      <PyodideLab
        title="Lab 1 — Cermin Kematangan"
        hint="Coba: ubah jawaban sesuai kantormu (jujur!). Di level berapa kamu? Apa 2 perbaikan termurah?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: RACI — Obat Saling Lempar</h2>
      <p>Susun matriks akuntabilitas untuk satu keputusan data nyata.</p>
      <PyodideLab
        title="Lab 2 — Satu A per Baris"
        hint="Coba: tambah aktivitas penghapusan data. Siapa A-nya? (Petunjuk: yang disalahkan regulator.)"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Mulai Governance dari Mana</h2>

      <div className="decision-card">
        <h3>1. Belum ada apa-apa → <strong>tunjuk owner + steward untuk 1 domain kritis</strong></h3>
        <p><strong>Kondisi:</strong> level 1, semua ad-hoc.</p>
        <p><strong>Kenapa:</strong> manusia dulu, dokumen kemudian. Nama orang nyata &gt; komite abstrak.</p>
      </div>

      <div className="decision-card">
        <h3>2. Definisi berbeda-beda antar tim → <strong>glossary bisnis + council mengesahkan</strong></h3>
        <p><strong>Kondisi:</strong> "nasabah aktif" 3 arti (DM1).</p>
        <p><strong>Kenapa:</strong> sengketa definisi = sengketa wewenang — hanya council lintas-domain bisa memutus.</p>
      </div>

      <div className="decision-card">
        <h3>3. Kebijakan ada tapi dilanggar → <strong>tegakkan otomatis di tool/pipeline</strong></h3>
        <p><strong>Kondisi:</strong> PDF 100 halaman, pelanggaran jalan terus.</p>
        <p><strong>Kenapa:</strong> kebijakan = kode (RBAC, masking otomatis, test pintu). Yang tidak tereksekusi = fiksi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tidak tahu mulai dari mana → <strong>maturity assessment → 2 prioritas terendah</strong></h3>
        <p><strong>Kondisi:</strong> semua terasa berantakan.</p>
        <p><strong>Kenapa:</strong> assessment mengubah kabut menjadi daftar. Naik satu level per tahun per area.</p>
      </div>

      <div className="decision-card">
        <h3>5. Regulator/audit datang → <strong>lineage + bukti kepatuhan (bukan janji)</strong></h3>
        <p><strong>Kondisi:</strong> butuh buktikan kontrol.</p>
        <p><strong>Kenapa:</strong> auditor tidak percaya kata-kata — mereka minta jejak: siapa akses apa, kapan, atas dasar apa (DM10, DM12).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Governance = siapa memutuskan;</strong> management = siapa mengeksekusi.</li>
          <li><strong>Satu A per keputusan</strong> (RACI) — obat saling lempar.</li>
          <li><strong>Kebijakan = kode</strong>, bukan PDF.</li>
          <li><strong>Mulai kecil:</strong> 1 domain, 5 kebijakan, naik 1 level/tahun.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Maturity Assessment — Dari Skor 1,4 ke 3,2</h2>
      <p>PT Maju Jaya menilai 5 kapabilitas governance (skala 1–5: 1=initial/kacau, 5=optimized). Ikuti penilaiannya, hitung skornya, lalu hitung <em>apa yang berubah</em> saat skor naik.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Nilai kondisi awal (klik untuk buka)</summary>
        <p>Hasil assessment (wawancara 12 orang, bukti dokumen):</p>
        <ul>
          <li>Kepemilikan data (ownership): <strong>1</strong> — "data siapa ini?" tidak terjawab (mini-case!)</li>
          <li>Kualitas &amp; test: <strong>2</strong> — test ada di 2 pipeline dari 23</li>
          <li>Metadata &amp; katalog: <strong>1</strong> — dokumentasi di kepala 3 orang senior</li>
          <li>Keamanan &amp; privasi: <strong>2</strong> — akses by request manual, tanpa review berkala</li>
          <li>Manajemen siklus (retensi/arsip): <strong>1</strong> — "simpan semua selamanya"</li>
        </ul>
        <p><Tex math={String.raw`\text{skor awal} = \frac{1+2+1+2+1}{5} = 1{,}4`} block /></p>
        <p>Level 1,4 = <strong>"Initial"</strong>: heroik individual, tidak berulang. Ciri: kalau 1 orang resign, pengetahuannya ikut resign.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Harga level 1,4: ukur "pajak kekacauan"</summary>
        <p>Survei internal 40 analis/engineer:</p>
        <ul>
          <li>Waktu mencari/memverifikasi data per minggu: rata-rata <strong>6 jam/orang</strong> ("tabel mana yang benar?", "tanya siapa?").</li>
          <li>40 orang × 6 jam × Rp200.000/jam (loaded cost) × 48 minggu = <strong>Rp2,3 miliar/tahun</strong> dibayar untuk <em>kebingungan</em>.</li>
          <li>Insiden 1 tahun: 3 dashboard salah angka (rata-rata ketahuan 11 hari kemudian), 1 akses data sensitif tak teraudit.</li>
        </ul>
        <p><Tex math={String.raw`\text{pajak kekacauan} \approx \text{Rp}2{,}3 \text{ M/thn} + 3 \text{ insiden} + 1 \text{ risiko denda}`} block /></p>
        <p>Angka Rp2,3 miliar inilah <strong>peluru ROI governance</strong> (DM17): bukan "program bagus", tapi "pajak yang bisa dihapus".</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Intervensi 12 bulan &amp; skor baru</summary>
        <p>Tiga intervensi termurah-berdampak (bukan semuanya sekaligus!):</p>
        <ul>
          <li><strong>Daftarkan pemilik</strong> untuk 50 tabel kritis (RACI, Lab 2): ownership 1 → <strong>3</strong>.</li>
          <li><strong>Katalog + glossary</strong> 50 tabel kritis (DM10): metadata 1 → <strong>3</strong>.</li>
          <li><strong>Test dbt di pintu medallion</strong> 10 pipeline kritis (DM5/DM7): kualitas 2 → <strong>3</strong>.</li>
        </ul>
        <p>Keamanan 2 → 3 (review akses triwulanan), siklus 1 → 2 (kebijakan retensi tertulis).</p>
        <p><Tex math={String.raw`\text{skor akhir} = \frac{3+3+3+3+2}{5} = 2{,}8`} /></p>
        <p>Biaya program: 2 FTE steward (Rp1,2 M/tahun) + tooling (Rp300 jt) = <strong>Rp1,5 M</strong>. Hasil terukur: waktu cari data turun 6 → 2,5 jam/minggu → hemat <Tex math={String.raw`40 \times 3{,}5 \times 200.000 \times 48 = \text{Rp}1{,}34 \text{ M/tahun}`} />; insiden dashboard salah: 3 → 0. <strong>Payback &lt; 14 bulan</strong> — sebelum menghitung denda yang dihindari (cerita Rp32 miliar!).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Kenapa tidak langsung target 5?</summary>
        <p>Level 5 (optimized: otomatisasi penuh, AI-assisted governance) butuh ~3–5 tahun &amp; puluhan miliar. Kurva biaya-manfaat governance <strong>cekung</strong>: lompatan 1→3 memberi 80% manfaat dengan 20% biaya; 3→5 memberi 20% manfaat sisanya dengan 80% biaya. <strong>Target rasional perusahaan menengah: level 3 ("defined") yang konsisten</strong> — proses tertulis, pemilik jelas, terukur. Mengejar level 5 di tahun pertama = program mati karena "mahal dan tidak terlihat hasil".</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> governance ≠ birokrasi. Ujiannya satu kalimat: <strong>"apakah aturan ini membuat keputusan lebih cepat &amp; lebih aman?"</strong> Kebijakan akses yang jelas = analis tidak menunggu 2 minggu approval (lebih cepat!) + data sensitif terlindungi (lebih aman!). Aturan yang hanya memperlambat tanpa menambah keamanan = birokrasi berkedok governance — cabut.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Data council: berapa biaya 1 jam yang mengubah segalanya?</summary>
        <p>Council bulanan: 5 orang × 1 jam × Rp1 juta (loaded cost) = <strong>Rp5 juta/bulan</strong>.</p>
        <p>Yang dihasilkan 1 jam itu: 1 kebijakan diputuskan (bukan didiskusikan 3 bulan), 3 tabel didaftarkan pemiliknya, 2 insiden di-review akarnya.</p>
        <p><Tex math={String.raw`\text{ROI 1 jam} = \frac{\text{Rp}2{,}3 \text{ M pajak/tahun}/12}{\text{Rp}5 \text{ jt}} \approx 38\times`} block /></p>
        <p><strong>Governance termurah = ritme, bukan dokumen.</strong> 1 jam/bulan yang konsisten mengalahkan komite megah yang rapat 1× setahun.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Wasit vs Pemain — Kenapa Governance Selalu Kalah Popularitas</h2>
      <p>Governance = <strong>wasit</strong> (menetapkan &amp; mengawasi aturan main); management = <strong>pemain</strong> (menjalankan: ingest, transform, layani). Wasit tidak mencetak gol — makanya governance selalu kalah populer dari "proyek AI". Tiga intuisi agar wasitnya dihormati:</p>
      <ul>
        <li><strong>Wasit dibayar untuk mencegah, dan pencegahan tidak terlihat.</strong> Tidak ada yang merayakan "denda Rp32 miliar yang <em>tidak</em> terjadi". Solusi: <strong>ukur yang dicegah</strong> — hitung pajak kekacauan (Langkah 2) <em>sebelum</em> program, jadikan baseline. Tanpa baseline, governance = biaya; dengan baseline, governance = investasi dengan ROI.</li>
        <li><strong>DAMA-DMBOK 10 wilayah = peta, bukan daftar belanja.</strong> 10 area (arsitektur, modeling, storage, keamanan, integrasi, dokumen, warehouse, metadata, kualitas, ...) tidak harus dikerjakan semua. Mulai dari <strong>3 yang sakit</strong> (assessment Langkah 1: ownership, metadata, kualitas). Peta yang mencoba dikunjungi semua kotanya sekaligus = turis kelelahan, bukan penjelajah.</li>
        <li><strong>Kebijakan tanpa pemilik = puisi.</strong> Setiap kebijakan butuh 3 nama (RACI Lab 2): <strong>Accountable</strong> (1 orang, disalahkan jika gagal), <strong>Responsible</strong> (yang mengerjakan), <strong>Consulted/Informed</strong>. Kebijakan "data sensitif harus dimasking" tanpa nama accountable = tidak ada yang dimasking. Tinta tanpa nama = dekorasi.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola council yang bekerja di perusahaan menengah — <strong>Data Council bulanan 60 menit</strong>: 1 pemilik bisnis (accountable), 1 steward, 1 engineer, 1 security, 1 risk. Agenda tetap: (1) insiden kualitas bulan ini, (2) 1 kebijakan baru/diubah, (3) 1 tabel kritis didaftarkan pemiliknya. <em>Hanya itu.</em> Governance yang hidup = ritme kecil yang konsisten, bukan dokumen besar yang sekali jadi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Governance = melarang orang pakai data (biar aman)."</strong></p>
        <p><strong>Yang benar:</strong> governance yang baik = <strong>mempercepat akses yang aman</strong>. Contoh: katalog + klasifikasi otomatis → analis langsung tahu "tabel ini public, pakai saja" vs "tabel ini restricted, butuh approval X" — tanpa menunggu 2 minggu. Melarang semua = shadow IT (orang download ke laptop pribadi = <em>lebih</em> tidak aman!). Tujuan wasit bukan menghentikan pertandingan, tapi memastikan <strong>pertandingan berjalan cepat dan adil</strong>.</p>
      </div>

      <div className="callout">
        <h3>📄 Template Kebijakan 1 Halaman (contoh: masking data sensitif)</h3>
        <p><strong>Judul:</strong> Masking Data Nasabah di Lingkungan Non-Produksi</p>
        <ol>
          <li><strong>Tujuan (1 kalimat):</strong> mencegah eksposur NIK/no HP di dev/staging/analytics sandbox.</li>
          <li><strong>Ruang lingkup:</strong> semua tabel berklasifikasi <em>confidential+</em>; semua environment kecuali produksi.</li>
          <li><strong>Aturan:</strong> NIK → mask 12 digit pertama; no HP → mask 8 digit pertama; nama → inisial. Pengecualian butuh approval tertulis pemilik data, maksimal 30 hari.</li>
          <li><strong>Accountable:</strong> [nama, jabatan] — disalahkan jika ditemukan data asli di dev.</li>
          <li><strong>Responsible:</strong> [tim data platform] — implementasi masking di pipeline.</li>
          <li><strong>Verifikasi:</strong> scan otomatis tiap minggu; temuan → alert ke Accountable &lt; 24 jam.</li>
          <li><strong>Review:</strong> tiap 6 bulan atau setelah insiden.</li>
        </ol>
        <p><strong>7 poin, 1 halaman, 2 nama.</strong> Kebijakan yang butuh 10 halaman untuk 1 aturan = tidak akan dibaca. Mulai dari 5 kebijakan seperti ini (bukan 50 sekaligus).</p>
      </div>

      <div className="callout">
        <h3>📊 Contoh Matriks RACI: siapa melakukan apa (1 kebijakan)</h3>
        <p>Kebijakan: "semua tabel <em>confidential+</em> wajib punya pemilik terdaftar".</p>
        <ul>
          <li><strong>Responsible (mengerjakan):</strong> data steward — mendata 50 tabel kritis, menghubungi calon pemilik.</li>
          <li><strong>Accountable (1 orang, disalahkan jika gagal):</strong> Head of Data — menandatangani daftar pemilik tiap kuartal.</li>
          <li><strong>Consulted (dimintai pendapat):</strong> security (klasifikasi), legal (UU PDP), pemilik bisnis (validasi).</li>
          <li><strong>Informed (diberi tahu):</strong> semua analis (via katalog + pengumuman).</li>
        </ul>
        <p>Aturan RACI: <strong>tepat 1 Accountable</strong> (2 = tidak ada), Responsible bisa banyak, dan <strong>kosong = tidak terjadi</strong>. Tempel matriks ini di tiap kebijakan — 5 menit yang mencegah 6 bulan saling lempar.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Kalkulator Pajak Kekacauan — ROI Governance-mu</h2>
      <p>Masukkan angka organisasimu, lihat berapa "pajak" yang dibayar tiap tahun tanpa governance.</p>
      <PyodideLab
        title="Lab 3 — Harga Sebuah Kekacauan"
        hint="Coba: ubah JAM_CARI dari 6 ke 2 (efek katalog bagus). Berapa Rp yang 'kembali'? Itulah business case untuk DM10."
        defaultCode={`# Lab 3: kalkulator pajak kekacauan (biaya tanpa governance)
JML_ANALIS = 40
JAM_CARI_PER_MINGGU = 6   # "tabel mana yang benar? tanya siapa?"
COST_PER_JAM = 200_000     # loaded cost
MINGGU = 48
INSIDEN_PER_TAHUN = 3     # dashboard salah angka
BIAYA_PER_INSIDEN = 150_000_000  # investigasi + keputusan salah + reputasi

pajak_waktu = JML_ANALIS * JAM_CARI_PER_MINGGU * COST_PER_JAM * MINGGU
pajak_insiden = INSIDEN_PER_TAHUN * BIAYA_PER_INSIDEN
total = pajak_waktu + pajak_insiden

print(f"Pajak waktu (kebingungan) : Rp{pajak_waktu:>15,.0f}/thn")
print(f"Pajak insiden ({INSIDEN_PER_TAHUN}x)      : Rp{pajak_insiden:>15,.0f}/thn")
print(f"{'='*52}")
print(f"TOTAL PAJAK KEKACAUAN        : Rp{total:>15,.0f}/thn")
print()
BIAYA_PROGRAM = 1_500_000_000  # 2 steward + tooling
print(f"Biaya program governance     : Rp{BIAYA_PROGRAM:>15,.0f}/thn")
print(f"Selisih                      : Rp{total-BIAYA_PROGRAM:>15,.0f}/thn")
print()
print("Belum termasuk: denda regulator (cerita Rp32 M) yang dihindari.")
print("Tanya ke atasan: 'mau bayar pajak ini tiap tahun, atau investasinya?'")`}
      />

      <h2 id="case">📋 Mini-Case: "Data Siapa Ini?"</h2>
      <div className="callout">
        <p>Tabel <code className="inline">nasabah_prioritas</code> dipakai 6 tim. Marketing menggunakannya untuk kampanye; Risiko untuk limit; tiba-tiba Legal meminta hapus 2.000 baris (permintaan hapus data UU PDP). Marketing protes ("kampanye jalan!"), Risiko panik ("model kami pakai itu!"), Legal mengancam ("denda!"). Tidak ada yang tahu <strong>siapa berhak memutuskan</strong>. Rapat 3 jam tanpa keputusan.</p>
        <p><strong>Pertanyaan:</strong> (a) Kegagalan governance apa ini? (b) Siapa seharusnya memutuskan, dan atas dasar apa? (c) Struktur apa yang mencegah terulang?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tidak ada owner tertulis + tidak ada kebijakan retensi/penghapusan</strong> — keputusan ad-hoc saat krisis.</p>
          <p>(b) <strong>Data owner domain nasabah</strong> memutuskan (dia A di RACI), dengan masukan Legal (C) — karena kewajiban hukum (UU PDP) mengalahkan kepentingan kampanye. Keputusan didokumentasikan.</p>
          <p>(c) <strong>Owner tertulis + kebijakan penghapusan + council</strong> untuk sengketa lintas-domain. Krisis berikutnya = eksekusi prosedur, bukan rapat darurat.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: skor maturity, pajak kekacauan, dan RACI.</p>

      <details className="worked">
        <summary>Soal 1 — Maturity: 5 kapabilitas dinilai [2, 2, 1, 3, 2]. Berapa skor rata-rata? Level apa? Apa prioritasnya?</summary>
        <p><Tex math={String.raw`\text{skor} = \frac{2+2+1+3+2}{5} = 2{,}0`} block /></p>
        <p>Level 2 ("managed" awal): proses ada tapi belum konsisten. Prioritas = kapabilitas <strong>skor 1</strong> (metadata/katalog) — naikkan yang terendah dulu, bukan yang sudah 3.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Pajak kekacauan: 25 analis × 4 jam/minggu mencari data × Rp250.000/jam × 48 minggu. Berapa pajak per tahun?</summary>
        <p><Tex math={String.raw`25 \times 4 \times 250.000 \times 48 = \text{Rp}1{,}2 \text{ miliar/tahun}`} block /></p>
        <p>Rp1,2 miliar dibayar untuk <em>kebingungan</em>. Inilah angka yang dibawa ke direksi saat meminta anggaran governance — bukan "program bagus", tapi "pajak yang bisa dihapus".</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — RACI: kebijakan "data sensitif wajib dimasking" ditulis tanpa nama Accountable. Apa yang terjadi dalam 6 bulan?</summary>
        <p><strong>Tidak ada yang dimasking.</strong> Engineer menunggu "keputusan bisnis", bisnis mengira "sudah diurus engineer", auditor menemukan pelanggaran. <strong>Kebijakan tanpa nama = puisi.</strong> Perbaikan: 1 nama Accountable + 1 nama Responsible + tanggal review.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bedanya data governance vs data management?"
        options={[
          "Sama saja",
          "Governance = wewenang & keputusan (siapa memutuskan, aturan apa); management = eksekusi (membangun pipeline). Wasit vs pemain",
          "Governance = teknis, management = bisnis",
          "Management lebih penting",
        ]}
        correct={1}
        explanation="Benar: pisahkan otoritas dari pelaksana. Owner bisnis memutuskan 'apa yang benar'; engineer memutuskan 'bagaimana membangunnya'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam RACI, aturan emas untuk kolom Accountable (A) adalah…"
        options={[
          "Sebanyak mungkin orang",
          "Tepat SATU orang per aktivitas — jika dua, tidak ada yang benar-benar bertanggung jawab",
          "Boleh kosong",
          "Sama dengan Responsible",
        ]}
        correct={1}
        explanation="Benar: satu A = obat saling lempar. A = yang disalahkan jika gagal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Posisi Data Governance dalam DAMA-DMBOK?"
        options={[
          "Salah satu dari 10 area, di pusat — mengarahkan 9 area lainnya",
          "Tidak termasuk",
          "Hanya untuk bank",
          "Sama dengan data quality",
        ]}
        correct={0}
        explanation="Benar: governance di pusat roda DMBOK — ia memberi wewenang & arah ke semua area (arsitektur, kualitas, keamanan, dll)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kebijakan 100 halaman tapi pelanggaran jalan terus. Diagnosis & obat?"
        options={[
          "Tambah jadi 200 halaman",
          "Kebijakan = fiksi jika tak ditegakkan. Obat: tegakkan otomatis di tool/pipeline (RBAC, masking, test pintu); mulai dari 5 yang tereksekusi",
          "Hapus semua kebijakan",
          "Salahkan karyawan",
        ]}
        correct={1}
        explanation="Benar: ujiannya 'apakah pelanggaran terdeteksi & ditindak?' Kebijakan = kode, bukan PDF."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Organisasi di maturity level 2 ingin ke level 4 dalam 3 bulan. Penilaianmu?"
        options={[
          "Bisa dengan konsultan mahal",
          "Fantasi — naik satu level per area per tahun sudah ambisius; lompat = fondasi rapuh",
          "Bisa jika lembur",
          "Level tidak penting",
        ]}
        correct={1}
        explanation="Benar: maturity = perubahan perilaku & budaya, bukan instalasi tool. Bertahap dan terukur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Sengketa definisi 'pendapatan' antar 4 divisi. Siapa memutus?"
        options={[
          "Divisi yang paling keras suaranya",
          "Data council lintas-domain — satu-satunya forum berwenang atas hal lintas-domain",
          "Data engineer",
          "Biarkan beda-beda",
        ]}
        correct={1}
        explanation="Benar: sengketa lintas-domain butuh forum lintas-domain. Council memutus, didokumentasikan, disosialisasikan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Governance ≠ management:</strong> wasit (keputusan) vs pemain (eksekusi).</li>
          <li><strong>DAMA-DMBOK:</strong> 10 area, governance di pusat — pakai untuk diagnosis, bukan hafalan.</li>
          <li><strong>Tiga pilar:</strong> owner (akuntabilitas) + steward (operasional) + council (lintas-domain), dengan nama nyata.</li>
          <li><strong>RACI:</strong> satu A per keputusan.</li>
          <li><strong>Kebijakan = kode;</strong> maturity = naik 1 level/tahun; mulai dari 1 domain.</li>
          <li><strong>Jangan:</strong> samakan dokumen dengan governance; lompat level; biarkan keputusan tanpa pemilik.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm8-data-contract" className="btn btn-secondary btn-sm">← DM8</Link>
        <Link href="/learn/dm10-metadata-lineage" className="btn btn-primary btn-sm">Next: DM10 →</Link>
      </div>
    </div>
  );
}
