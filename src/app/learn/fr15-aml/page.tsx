"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR15Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const typologyData = [
    {
      x: ["Structuring", "Layering", "Trade-based", "Mule network", "Crypto mixing", "Shell company"],
      y: [28, 24, 12, 18, 10, 8],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["28%", "24%", "12%", "18%", "10%", "8%"],
      textposition: "outside",
    },
  ];

  const alertData = [
    {
      x: ["TM rule longgar", "TM rule sedang", "TM rule ketat", "TM + ML triase"],
      y: [8, 22, 45, 38],
      type: "bar",
      marker: { color: ["#e05252", "#e8a838", "#e8a838", "#7bc96f"] },
      text: ["8%", "22%", "45%", "38%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Simulasi STRUCTURING: deteksi pola 'di bawah ambang lapor'
# Aturan: transaksi tunai >= Rp500 jt wajib lapor (ambang ilustrasi).
# Structuring = pecah jadi < ambang agar tak terlapor.
import random
random.seed(43)

AMBANG_LAPOR = 500  # juta Rp

# Nasabah A: 1 setoran 480 jt (di bawah ambang, 1x)
# Nasabah B: 10 setoran 48 jt dalam 5 hari (total 480 jt)
setoran_A = [480]
setoran_B = [48]*10

def deteksi_structuring(setoran, hari):
    total = sum(setoran)
    n = len(setoran)
    # sinyal: banyak setoran di bawah ambang, total mendekati/melebihi ambang
    di_bawah = sum(1 for s in setoran if s < AMBANG_LAPOR)
    skor = (di_bawah / n) * (total / AMBANG_LAPOR) * (n / hari)
    return total, skor

for nama, s, h in [("A (1x 480jt)", setoran_A, 1), ("B (10x 48jt/5hr)", setoran_B, 5)]:
    total, skor = deteksi_structuring(s, h)
    status = "🚨 STRUCTURING?" if skor > 1.5 else "✅ wajar"
    print(f"{nama:20s} total={total} jt  skor={skor:.2f}  {status}")
print()
print("COBA UBAH: setoran_B = [48]*10 -> [480] (sama dgn A).")
print("Skor anjlok. Pelajaran: structuring BUKAN soal nominal —")
print("melainkan POLA: frekuensi x kedekatan ke ambang x total.")`;

  const lab2Code = `# Alert tuning: dari 1000 alert jadi 300 tanpa kehilangan temuan
# 1000 alert TM, 50 di antaranya 'true positive' (kasus nyata).
# Strategi: (1) naikkan ambang, (2) tambah filter 'whitelist', (3) skor ML triase.
import random
random.seed(47)

# (skor_rule, is_true, is_whitelist)
alerts = []
for _ in range(50):
    alerts.append((random.gauss(75, 10), 1, random.random() < 0.05))
for _ in range(950):
    alerts.append((random.gauss(40, 15), 0, random.random() < 0.30))
random.shuffle(alerts)

def evaluasi(f):
    pilih = [a for a in alerts if f(a)]
    tp = sum(a[1] for a in pilih)
    return len(pilih), tp

strategi = [
    ("Semua alert          ", lambda a: True),
    ("Ambang skor >= 60    ", lambda a: a[0] >= 60),
    ("Ambang 60 + no whitelist", lambda a: a[0] >= 60 and not a[2]),
]
print(f"{'Strategi':26s} {'Alert':>5s} {'TP':>3s}  Kehilangan")
for nama, f in strategi:
    n, tp = evaluasi(f)
    print(f"{nama} {n:5d} {tp:3d}  {50-tp} kasus hilang")
print()
print("COBA UBAH: ambang 60 -> 70.")
print("Alert makin sedikit, tapi TP ikut hilang. Pelajaran alert tuning:")
print("tiap filter = trade-off. Ukur 'kasus hilang', bukan cuma 'alert berkurang'.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR15 — Fraud / ML Analytics</span>
        <h1 className="display-title">AML: Memburu Uang Kotor<br />di Balik Transaksi Bersih</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp12 Miliar yang &ldquo;Bersih&rdquo;</a></li>
          <li><a href="#tahapan">3 Tahap Pencucian: Placement, Layering, Integration</a></li>
          <li><a href="#tipologi">Tipologi: 6 Pola yang Wajib Dikenal</a></li>
          <li><a href="#kyc">KYC/CDD/EDD: Kenali Nasabahmu (Betulan)</a></li>
          <li><a href="#sanksi">Sanctions &amp; PEP Screening</a></li>
          <li><a href="#str">STR/SAR: Dari Alert ke Laporan PPATK</a></li>
          <li><a href="#tuning">Alert Tuning: Perang Melawan False Positive</a></li>
          <li><a href="#lab1">🔬 Lab 1: Deteksi Structuring</a></li>
          <li><a href="#lab2">🔬 Lab 2: Alert Tuning</a></li>
          <li><a href="#worked">📐 Worked Example: Structuring &amp; Risk Scoring</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Ikuti Uangnya, Bukan Orangnya</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Respons per Temuan</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: STR, Blokir, atau Pantau?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Aliran Dana Judol Triliunan</a></li>

          <li><a href="#case">📋 Mini-Case: 3 Alert, 1 STR — Pilih dengan Benar</a></li>
          <li><a href="#faq">❓ Tanya Jawab: AML</a></li>

          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>3 tahap pencucian uang</strong> dan 6 tipologi utama beserta jejak transaksinya.</li>
          <li>Membedakan <strong>KYC, CDD, dan EDD</strong> serta kapan masing-masing diterapkan.</li>
          <li>Menjelaskan alur <strong>sanctions/PEP screening</strong> dan penanganannya.</li>
          <li>Menyusun <strong>narasi STR</strong> yang memenuhi standar dan melakukan <strong>alert tuning</strong> yang defensibel.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp12 Miliar yang &ldquo;Bersih&rdquo;</h2>
      <div className="story">
        <p>Sebuah bank menengah bangga: &ldquo;Sistem fraud kami bagus — loss cuma 0,1%!&rdquo; Lalu PPATK datang dengan daftar 40 rekening: <strong>Rp12 miliar dana judi online</strong> mengalir lewat bank mereka selama 8 bulan. Tidak satu pun ditandai sistem fraud. Kenapa? Karena <strong>tidak ada yang dicuri</strong> — tidak ada korban, tidak ada chargeback, tidak ada &ldquo;anomali&rdquo; versi fraud.</p>
        <p>Dana itu masuk sebagai &ldquo;pembayaran jasa&rdquo;, dipecah ke 200 rekening, dikumpulkan lagi, lalu dikirim ke luar negeri sebagai &ldquo;pembayaran impor&rdquo;. Setiap langkah <strong>terlihat seperti bisnis normal</strong>. Yang membuatnya kriminal bukan transaksinya — melainkan <strong>asal-usulnya</strong> (judi online) dan <strong>tujuannya</strong> (menyamarkan).</p>
        <p>Twist-nya: bank itu <strong>didenda dan diwajibkan memperbaiki sistem AML</strong> — bukan karena kehilangan uang (mereka tidak rugi sepeser pun!), tapi karena <strong>gagal melapor</strong>. Lesson ini (ingat FR2): <strong>kemenangan AML bukan &ldquo;uang selamat&rdquo; melainkan &ldquo;laporan benar dan tepat waktu&rdquo;</strong>.</p>
      </div>

      <h2 id="tahapan">3 Tahap Pencucian: Placement, Layering, Integration</h2>
      <p>Model klasik (masih dipakai PPATK/FATF hingga kini):</p>
      <ol>
        <li><strong>Placement</strong> — uang kotor <em>masuk</em> ke sistem keuangan. Titik paling rentan bagi pencuci (uang masih &ldquo;bau&rdquo;). Contoh: setoran tunai besar, beli kripto, top-up e-wallet massal.</li>
        <li><strong>Layering</strong> — uang <em>diacak</em> jejaknya: transfer berlapis, pecah-gabung, lintas negara, lewat shell company. Tujuannya: <strong>memutus rantai bukti</strong> asal-usul.</li>
        <li><strong>Integration</strong> — uang &ldquo;bersih&rdquo; <em>kembali</em> ke ekonomi: beli properti, investasi, gaya hidup. Sulit dibedakan dari uang halal.</li>
      </ol>
      <p><strong>Implikasi deteksi:</strong> makin ke kanan, makin sulit. <strong>Placement adalah titik emas</strong> — di sinilah ambang lapor transaksi tunai, KYC, dan monitoring setoran bekerja. Layering butuh graph analytics (FR12). Integration sering hanya tertangkap via <strong>ketidakcocokan profil</strong> (&ldquo;gaji Rp10 juta/bulan, beli apartemen Rp5 M tunai&rdquo;).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fraud mengejar <em>kecepatan</em> (kuras sebelum ketahuan); money laundering mengejar <em>ketidakjelasan</em> (makin banyak lapisan makin baik). Karena itu <strong>velocity rule yang hebat untuk fraud bisa buta untuk AML</strong> — layering justru <em>menghindari</em> kecepatan mencolok. Dua musuh, dua tempo.</p>
      </div>

      <h2 id="tipologi">Tipologi: 6 Pola yang Wajib Dikenal</h2>

      <PlotlyChart
        data={typologyData}
        title="Frekuensi Tipologi dalam STR (ilustrasi industri)"
        layout={{ xaxis: { title: "Tipologi" }, yaxis: { title: "% STR" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = pangsa laporan transaksi mencurigakan (STR) yang melibatkan tipologi itu.</p>
        <p><strong>Interpretasi:</strong> <strong>structuring (28%) + layering (24%) = lebih dari setengah</strong> — dua pola &ldquo;klasik&rdquo; masih mendominasi. <strong>Pelajaran:</strong> kuasai dulu yang klasik sebelum berburu yang eksotis (crypto mixing 10%). Penjahat memakai yang <em>terbukti berhasil</em>, bukan yang canggih.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Tipologi</th><th>Pola</th><th>Jejak transaksi</th></tr></thead>
          <tbody>
            <tr><td><strong>Structuring</strong></td><td>Pecah transaksi agar di bawah ambang lapor</td><td>Banyak setoran sedikit di bawah ambang, berdekatan waktu</td></tr>
            <tr><td><strong>Layering</strong></td><td>Transfer berlapis lintas rekening/negara</td><td>Rantai panjang, fan-out/fan-in, siklus (graph! FR12)</td></tr>
            <tr><td><strong>Trade-based</strong></td><td>Manipulasi invoice impor/ekspor (over/under-invoicing)</td><td>Nilai tak wajar vs harga pasar; barang tak masuk akal</td></tr>
            <tr><td><strong>Mule network</strong></td><td>Rekening keledai menampung &amp; meneruskan</td><td>Masuk besar → keluar cepat ke banyak tujuan</td></tr>
            <tr><td><strong>Crypto mixing</strong></td><td>Kripto diacak via mixer/tumbler</td><td>Deposit ke alamat mixer terknown; pola hop cepat</td></tr>
            <tr><td><strong>Shell company</strong></td><td>Perusahaan cangkang tanpa aktivitas riil</td><td>Alamat kantor fiktif, direksi nomine, transaksi tak sesuai bidang usaha</td></tr>
          </tbody>
        </table>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AML = versi besar dari fraud detection.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> keduanya memakai data transaksi, tapi <strong>pertanyaannya beda</strong> (FR2): fraud = &ldquo;transaksi ini sah?&rdquo; (butuh milidetik), AML = &ldquo;dana ini hasil kejahatan?&rdquo; (butuh minggu investigasi + pelaporan). Tool boleh mirip, tapi <strong>proses, metrik, dan tujuannya berbeda</strong>.</p>
      </div>

      <h2 id="kyc">KYC/CDD/EDD: Kenali Nasabahmu (Betulan)</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Level</th><th>Kapan</th><th>Apa yang dilakukan</th></tr></thead>
          <tbody>
            <tr><td><strong>KYC</strong> (Know Your Customer)</td><td>Pembukaan rekening</td><td>Verifikasi identitas: KTP, wajah, data dasar</td></tr>
            <tr><td><strong>CDD</strong> (Customer Due Diligence)</td><td>Berkala + saat profil berubah</td><td>Pahami profil: pekerjaan, penghasilan, tujuan rekening, pola transaksi wajar</td></tr>
            <tr><td><strong>EDD</strong> (Enhanced DD)</td><td>Nasabah berisiko tinggi</td><td>CDD + sumber dana, struktur kepemilikan, media negatif, kunjungan lapangan</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Yang sering salah kaprah:</strong> KYC ≠ sekali verifikasi KTP lalu selesai. <strong>CDD berkelanjutan</strong> = bandingkan <em>perilaku aktual</em> vs <em>profil</em>: &ldquo;wiraswasta penghasilan Rp20 jt/bulan&rdquo; yang terima Rp2 M/bulan = <strong>profil mismatch</strong> → pemicu EDD. Inilah &ldquo;baseline per user&rdquo; versi AML (bandingkan FR6!).</p>
      <p><strong>Risk-based approach:</strong> tidak semua nasabah diperlakukan sama — skor risiko nasabah (negara, pekerjaan, produk, channel) menentukan <strong>kedalaman</strong> uji tuntas. PEP (politically exposed person) = otomatis EDD.</p>

      <h2 id="sanksi">Sanctions &amp; PEP Screening</h2>
      <p><strong>Definisi.</strong> Screening = cocokkan nasabah &amp; transaksi terhadap <strong>daftar sanksi</strong> (PBB, OFAC AS, UE) dan <strong>daftar PEP</strong> (pejabat publik + keluarga/dekatnya).</p>
      <ul>
        <li><strong>Kapan:</strong> saat onboarding, berkala, dan <strong>real-time untuk transfer lintas negara</strong> (sebelum dana dikirim!).</li>
        <li><strong>Tantangan:</strong> <strong>false positive nama</strong> — &ldquo;Muhammad Ali&rdquo; cocok dengan 50 entri sanksi (nama umum!). Butuh <strong>fuzzy matching + data pembeda</strong> (tgl lahir, kewarganegaraan).</li>
        <li><strong>Jika cocok (true hit):</strong> <strong>bekukan/blokir</strong> + lapor — bukan sekadar &ldquo;catat&rdquo;. Pelanggaran sanksi = denda miliaran + pidana.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> sanctions screening adalah <strong>satu-satunya kontrol fraud/AML yang bersifat &ldquo;hukum internasional&rdquo;</strong> — salah meloloskan = perusahaan ikut melanggar sanksi PBB/AS. Karena itu ia dijalankan <strong>sebelum</strong> transaksi (pre-transaction), bukan sesudah.</p>
      </div>

      <h2 id="str">STR/SAR: Dari Alert ke Laporan PPATK</h2>
      <p><strong>Definisi.</strong> STR (Suspicious Transaction Report) = laporan transaksi mencurigakan ke <strong>PPATK</strong> (Indonesia; SAR di AS). Ini <strong>kewajiban hukum</strong> — bukan pilihan.</p>
      <p><strong>Alur:</strong> alert TM → investigasi (kumpulkan bukti, analisis tipologi) → keputusan komite → <strong>narasi STR</strong> → kirim ke PPATK via goAML → tindak lanjut (bekukan jika diminta).</p>
      <p><strong>Narasi STR yang baik</strong> (ini yang dinilai PPATK):</p>
      <ul>
        <li><strong>Siapa:</strong> identitas + profil nasabah vs perilaku.</li>
        <li><strong>Apa:</strong> pola transaksi spesifik (tanggal, nominal, frekuensi) — bukan &ldquo;mencurigakan&rdquo; saja.</li>
        <li><strong>Mengapa curiga:</strong> tipologi yang diduga + <em>mengapa</em> pola ini cocok (mis. &ldquo;9 setoran Rp480–495 jt dalam 10 hari, total Rp4,4 M — pola structuring menghindari ambang lapor&rdquo;).</li>
        <li><strong>Ke mana:</strong> aliran dana (graph ringkas).</li>
      </ul>
      <p><strong>Penting:</strong> <strong>tipping-off dilarang</strong> — jangan beri tahu nasabah bahwa ia dilaporkan. Ini pidana.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;STR = menuduh nasabah penjahat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> STR = &ldquo;kami melihat pola yang <em>tidak bisa kami jelaskan secara wajar</em>, silakan PPATK yang menilai&rdquo;. Bank <strong>bukan hakim</strong> — tugasnya <strong>melapor dengan narasi berkualitas</strong>. STR yang buruk (&ldquo;mencurigakan&rdquo; tanpa bukti) = sampah untuk intelijen.</p>
      </div>

      <h2 id="tuning">Alert Tuning: Perang Melawan False Positive</h2>
      <p>Sistem transaction monitoring klasik terkenal dengan <strong>95%+ false positive</strong> — lebih parah dari fraud (FR2)! Penyebab: rule generik (&ldquo;transaksi &gt;Rp500 jt&rdquo;) tanpa konteks profil.</p>
      <p><strong>Strategi tuning yang defensibel:</strong></p>
      <ol>
        <li><strong>Segmentasi:</strong> ambang berbeda per segmen (ritel vs korporat vs PEP) — bukan satu ambang untuk semua.</li>
        <li><strong>Whitelist:</strong> nasabah terverifikasi dengan pola jelas (gaji rutin) dikecualikan dari rule tertentu.</li>
        <li><strong>ML triase:</strong> skor ML memprioritaskan alert rule (seperti FR11) — bukan menggantikan rule (regulator suka rule yang explainable!).</li>
        <li><strong>Ukur &ldquo;kasus hilang&rdquo;:</strong> tiap pengetatan diuji: berapa true positive yang ikut hilang? (Lab 2).</li>
      </ol>

      <PlotlyChart
        data={alertData}
        title="Hit Rate Alert TM per Strategi Tuning (ilustrasi)"
        layout={{ xaxis: { title: "Strategi" }, yaxis: { title: "Hit rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = hit rate alert (presisi) satu strategi tuning.</p>
        <p><strong>Interpretasi:</strong> rule longgar 8% → ketat 45% — tapi <strong>waspada</strong>: pengetatan buta juga membuang true positive (lihat Lab 2). <strong>TM + ML triase (38%)</strong> sedikit di bawah rule ketat, tapi dengan <strong>temuan lebih banyak</strong> (tidak membuang kasus). <strong>Pelajaran:</strong> optimasi hit rate saja = jebakan; optimasi <em>temuan per slot investigator</em> = benar.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Deteksi Structuring</h2>
      <p>Bangun intuisi &ldquo;pola, bukan nominal&rdquo;.</p>
      <PyodideLab
        title="Lab 1 — Structuring: Di Bawah Ambang, Di Atas Curiga"
        hint="Ubah pola setoran B. Pada kombinasi frekuensi × kedekatan ambang berapa skor melewati 1,5? Itulah logika rule structuring."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Alert Tuning</h2>
      <PyodideLab
        title="Lab 2 — Tuning: Alert Berkurang, Kasus Jangan Hilang"
        hint="Ubah ambang 60 → 70 → 50. Catat trade-off 'alert vs kasus hilang'. Inilah yang dilaporkan ke regulator saat tuning."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung Pola Pencucian</h2>
      <p>AML adalah tentang <strong>pola di atas ambang</strong> — dua contoh cara menghitungnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: mendeteksi structuring dari pola setoran</summary>
        <p>Ambang pelaporan transaksi tunai (CTR): Rp500jt (ilustratif). Rekening R menerima setoran tunai 14 hari terakhir: 480jt, 495jt, 470jt, 490jt, 485jt, 475jt — total <strong>Rp2,895 miliar</strong>, tidak satu pun menyentuh ambang.</p>
        <p><strong>Langkah 1 — uji statistik sederhana.</strong> Peluang setoran acak jatuh <em>persis</em> di rentang 470–495jt enam kali beruntun? Jika setoran normal tersebar 50jt–1M, peluang satu setoran di 470–495jt ≈ 5%. Enam kali beruntun: 0,05⁶ ≈ <strong>1 banding 64 juta</strong> — mustahil kebetulan.</p>
        <p><strong>Langkah 2 — fitur pendukung.</strong> Setoran selalu jam 10.00–10.30 (jam buka cabang yang sama), selalu pecahan Rp100rb (ciri uang tunai terkumpul), tidak ada aktivitas usaha yang menjelaskan arus kas tunai sebesar itu di profil nasabah (toko kelontong).</p>
        <p><strong>Langkah 3 — keputusan.</strong> Bukan &ldquo;tangkap&rdquo; — tapi <strong>naikkan ke EDD + siapkan STR</strong>: kumpulkan 30 hari pola lengkap, petakan rekening tujuan (layering?), lalu laporkan ke PPATK. Structuring <em>adalah</em> indikasi TPPU yang paling klasik — penjahatnya memberi tahu kita lewat usahanya <em>menghindari</em> ambang.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: risk scoring nasabah (CDD → EDD)</summary>
        <p>Bank menilai risiko nasabah baru dengan skor berbobot (0–100):</p>
        <p><strong>Faktor &amp; bobot:</strong> negara domisili risiko tinggi: 25; jenis usaha tunai-intensif: 20; PEP/keluarga PEP: 25; histori transaksi tidak sesuai profil: 15; struktur kepemilikan kompleks (nominee): 15.</p>
        <p><strong>Nasabah X:</strong> perusahaan dagang, direksi nominee (15), usaha tunai-intensif (20), 3 bulan pertama transaksi 10× proyeksi awal (15). Total = <strong>50</strong>.</p>
        <p><strong>Interpretasi:</strong> &lt; 30 = CDD standar; 30–60 = <strong>EDD</strong> (verifikasi sumber dana, kunjungan usaha, monitoring ketat); &gt; 60 = tolak/akhiri hubungan. Skor 50 → EDD: bank wajib <em>memahami</em> dari mana uangnya — bukan sekadar mencatat. Angka ini artinya <strong>kewajiban menggali, bukan vonis bersalah</strong>. Banyak bank gagal bukan karena tidak punya skor, tapi karena skor 50 tidak mengubah perlakuan apa pun.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Ikuti Uangnya, Bukan Orangnya</h2>
      <p>Pepatah investigasi klasik: <strong>&ldquo;follow the money.&rdquo;</strong> Orang bisa berbohong, dokumen bisa dipalsukan, tapi <strong>uang yang bergerak meninggalkan jejak yang konsisten</strong> — karena ia harus melewati sistem perbankan yang tercatat. Analis AML yang hebat tidak memulai dari &ldquo;siapa yang mencurigakan?&rdquo; tapi dari &ldquo;<em>aliran</em> mana yang tidak masuk akal?&rdquo; — lalu mengikuti alirannya sampai ke orangnya.</p>
      <p>Intuisi kedua: <strong>pencucian adalah pajak atas kejahatan</strong> — pelaku <em>membayar</em> (waktu, biaya, risiko, potongan ke mule) untuk membuat uangnya terlihat bersih. Tugas sistem AML: <strong>naikkan pajak itu setinggi mungkin</strong> sampai kejahatannya tidak lagi menguntungkan. Kamu tidak harus menangkap semua — cukup buat biayanya lebih mahal daripada keuntungannya. <em>Deterrence through economics.</em></p>
      <p><strong>Kapan pendekatan AML standar TIDAK tepat:</strong> (1) <strong>fraud murni tanpa pencucian</strong> (kartu curian langsung belanja) — itu ranah fraud, jangan dipaksakan jadi STR; (2) <strong>transaksi kecil tunggal tanpa pola</strong> — pantau, jangan eskalasi; membanjiri PPATK dengan noise merusak kredibilitasmu; (3) <strong>saat korban butuh diselamatkan SEKARANG</strong> — selamatkan dulu (logika fraud), lengkapi STR kemudian. <strong>Urutan: selamatkan → petakan → laporkan.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kualitas program AML diukur bukan dari <strong>berapa STR dikirim</strong>, tapi dari <strong>berapa yang berkualitas</strong> (ditindaklanjuti PPATK/penegak hukum) + <strong>ketepatan waktu</strong> + <strong>kelengkapan jejak</strong>. 100 STR berkualitas &gt; 10.000 STR asal kirim.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Respons per Temuan</h2>

      <div className="decision-card">
        <h3>1. Profil mismatch (perilaku ≠ profil CDD) → <strong>EDD + pantau ketat</strong></h3>
        <p><strong>Kenapa:</strong> belum tentu kriminal — tapi wajib dipahami. Minta sumber dana.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;gaji Rp10 jt&rdquo; terima Rp2 M/bulan → EDD.</p>
      </div>

      <div className="decision-card">
        <h3>2. Pola tipologi jelas (structuring, layering) → <strong>investigasi penuh → STR</strong></h3>
        <p><strong>Kenapa:</strong> kewajiban lapor. Narasi berkualitas = siapa + apa + mengapa + ke mana.</p>
        <p><strong>Ingat:</strong> jangan tipping-off!</p>
      </div>

      <div className="decision-card">
        <h3>3. Sanctions/PEP true hit → <strong>bekukan + lapor segera</strong></h3>
        <p><strong>Kenapa:</strong> ini hukum internasional — bukan &ldquo;nanti saja&rdquo;.</p>
        <p><strong>Catatan:</strong> pastikan true hit (verifikasi identitas pembeda) sebelum beku — salah beku = gugatan.</p>
      </div>

      <div className="decision-card">
        <h3>4. Alert TM membanjir (95% FP) → <strong>tuning bersegmen + ML triase</strong></h3>
        <p><strong>Kenapa:</strong> investigator yang tenggelam = temuan nol. Ukur &ldquo;kasus hilang&rdquo; tiap pengetatan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>AML = <strong>lapor benar &amp; tepat waktu</strong>, bukan &ldquo;uang selamat&rdquo;.</li>
          <li>Placement = titik emas deteksi; layering = graph; integration = profil mismatch.</li>
          <li>STR = narasi bukti, bukan tuduhan. <strong>Tipping-off = pidana.</strong></li>
          <li>Tuning TM: ukur <strong>kasus hilang</strong>, bukan cuma alert berkurang.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Respons AML</h2>
      <p>Menemukan pola mencurigakan bukan akhir — ia awal dari tiga pilihan sulit:</p>
      <p><strong>Skenario A — pantau dulu vs blokir sekarang.</strong> Pantau jika: indikasi jaringan (butuh petakan 2–4 minggu untuk STR yang kuat), nilai belum kritis, dan ada koordinasi dengan PPATK/penegak hukum. Blokir jika: dana akan hilang (transfer keluar negeri segera), ada korban yang bisa diselamatkan (fraud), atau perintah regulator. Aturan: <strong>kesabaran untuk jaringan, kecepatan untuk korban</strong>.</p>
      <p><strong>Skenario B — kapan STR wajib.</strong> Bukan &ldquo;saat yakin 100%&rdquo; — standar STR adalah <strong>indikasi patut diduga</strong>, bukan pembuktian. Menunggu kepastian = STR terlambat = pelanggaran kewajiban lapor. Tapi juga bukan &ldquo;semua yang aneh&rdquo; — bank yang mengirim 10.000 STR/bulan berkualitas rendah akan kehilangan kredibilitas di mata PPATK. Keseimbangan: <strong>STR untuk pola, pantau untuk anomali tunggal</strong>.</p>
      <p><strong>Skenario C — tipping-off dalam praktik.</strong> Nasabah EDD menanyakan kenapa dananya &ldquo;ditahan untuk verifikasi&rdquo;. Skrip yang aman: alasan prosedural generik, tidak menyebut investigasi/PPATK/AML, tawarkan jalur resmi (cabang). Semua staf front-office <strong>wajib</strong> dilatih skrip ini — satu slip &ldquo;bapak sedang kami investigasi&rdquo; = pelanggaran pidana. Ini bukan teori: ini <em>pelatihan berulang</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tujuan AML bukan menangkap penjahat — itu tugas penegak hukum. Tujuan bank adalah <strong>membangun jejak yang lengkap &amp; bisa diaudit</strong>: KYC benar, monitoring jalan, STR tepat waktu. Regulator menghukum <em>sistem yang tidak ada</em>, bukan <em>penjahat yang lolos</em>. Mainkan peranmu, bukan peran polisi.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: PPATK &amp; Aliran Judi Online</h2>
      <p>PPATK melaporkan perputaran dana judi online mencapai <strong>ratusan triliun rupiah per tahun</strong> (angka resmi PPATK 2023–2024 menyebut &gt; Rp300 triliun). Skala ini tidak mungkin tanpa <strong>infrastruktur pencucian industri</strong>:</p>
      <ol>
        <li><strong>Placement:</strong> deposit pemain via transfer bank, e-wallet, pulsa, bahkan QRIS — dipecah kecil-kecil (structuring di level pemain).</li>
        <li><strong>Layering:</strong> dikumpulkan ke rekening-rekening mule (FR1), diputar antar bank dalam hitungan menit, sebagian ke kripto via P2P.</li>
        <li><strong>Integration:</strong> dicairkan untuk operasional (server, iklan, gaji admin) &amp; keuntungan bandar — sebagian dibelanjakan aset di dalam &amp; luar negeri.</li>
      </ol>
      <p><strong>Di mana sistem AML bank berperan:</strong> ribuan rekening mule dengan pola <em>fan-in cepat → fan-out cepat</em> adalah sinyal yang <em>bisa</em> ditangkap monitoring transaksi — <strong>jika</strong> bank memantau pola lintas-rekening (graph, FR12), bukan per-rekening. Rekening individual terlihat &ldquo;sibuk tapi wajar&rdquo;; jaringannya berteriak.</p>
      <p><strong>Pelajaran untuk analis AML:</strong> kejahatan triliunan rupiah tidak dilakukan dengan transaksi triliunan rupiah — ia dilakukan dengan <strong>jutaan transaksi kecil yang terkoordinasi</strong>. Sistem yang hanya mencari &ldquo;transaksi besar mencurigakan&rdquo; buta terhadap ancaman terbesarnya. Cari <em>koordinasinya</em>, bukan <em>nominalnya</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;AML = urusan compliance, bukan urusan data.&rdquo;<br /><strong>Yang benar:</strong> compliance tanpa data = <em>teater</em> — checklist terisi, kejahatan jalan terus. AML modern adalah <strong>disiplin data</strong> (monitoring, graph, tuning) yang <em>dilaksanakan</em> oleh compliance. Analis data yang paham AML adalah salah satu profil paling langka &amp; mahal di industri keuangan Indonesia.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 3 Alert, 1 STR — Pilih dengan Benar</h2>
      <div className="callout">
        <p>Tiga alert TM pagi ini (kapasitas investigasi penuh hari ini — hanya 1 yang bisa diinvestigasi mendalam):</p>
        <ul>
          <li><strong>A:</strong> Nasabah ritel, 9 setoran tunai Rp480–495 jt dalam 10 hari (total Rp4,4 M). Profil: wiraswasta omzet Rp50 jt/bulan.</li>
          <li><strong>B:</strong> Korporat ekspor, transfer Rp8 M ke supplier di Singapura. Profil: eksportir furnitur, omzet Rp100 M/tahun, 5 tahun jadi nasabah.</li>
          <li><strong>C:</strong> Nasabah baru 2 bulan, terima Rp300 jt dari 15 pengirim berbeda lalu kirim ke 1 rekening luar negeri. Profil: mahasiswa.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Urutkan prioritas investigasi. (b) Mana yang paling layak jadi STR? Tulis draf narasi 3 kalimat.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>A &gt; C &gt; B.</strong> A = structuring klasik (9× di bawah ambang + profil mismatch ekstrem: Rp4,4 M vs omzet Rp50 jt). C = pola mule/layering (fan-in lalu kirim luar negeri + profil mismatch mahasiswa). B = nominal besar tapi <strong>sesuai profil</strong> (eksportir Rp100 M/tahun transfer Rp8 M = wajar) — prioritas terendah.</p>
          <p>(b) <strong>A paling layak STR.</strong> Draf narasi: &ldquo;Nasabah X (wiraswasta, omzet dinyatakan Rp50 jt/bulan) melakukan 9 setoran tunai Rp480–495 juta pada 3–12 Okt 2026 (total Rp4,4 Miliar), masing-masing sedikit di bawah ambang kewajiban lapor. Pola ini konsisten dengan <em>structuring</em> untuk menghindari pelaporan. Dana belum bergerak keluar; mohon analisis lebih lanjut.&rdquo;</p>
          <p><strong>Pelajaran:</strong> nominal besar ≠ mencurigakan; <strong>profil mismatch + pola</strong> = mencurigakan. Dan STR yang baik = fakta + tipologi, bukan tuduhan.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: AML</h2>
      <details className="worked">
        <summary>Q1: Apa bedanya CTR, STR, dan kapan masing-masing?</summary>
        <p><strong>CTR</strong> (Cash Transaction Report) = laporan <em>otomatis</em> untuk transaksi tunai ≥ ambang (fakta, bukan kecurigaan). <strong>STR</strong> (Suspicious Transaction Report) = laporan <em>analitis</em> saat ada indikasi mencurigakan — <strong>tidak ada ambang nominal</strong>; Rp5jt yang berpola bisa di-STR-kan, Rp5M yang wajar tidak perlu. CTR = &ldquo;ini terjadi&rdquo;; STR = &ldquo;ini mencurigakan <em>menurut analisis kami</em>&rdquo;. Keduanya wajib, jalurnya beda.</p>
      </details>
      <details className="worked">
        <summary>Q2: Tipping-off — contoh konkret yang sering kejadian?</summary>
        <p><strong>Kejadian klasik:</strong> CS yang tidak terlatih menjawab &ldquo;rekening Bapak sedang dalam investigasi PPATK&rdquo; saat nasabah protes transaksinya ditahan. Atau: relationship manager &ldquo;memberi tahu&rdquo; nasabah korporat agar &ldquo;hati-hati&rdquo;. Keduanya = <strong>pelanggaran pidana</strong>. Pencegahannya bukan sekadar SOP — tapi <strong>simulasi &amp; drill berkala</strong>: uji CS dengan skenario, seperti latihan kebakaran. Satu slip = satu perkara.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana dengan kripto — apakah di luar jangkauan AML?</summary>
        <p><strong>Tidak.</strong> Di Indonesia, pedagang aset kripto adalah <strong>Pihak Pelapor</strong> dengan kewajiban AML (KYC, monitoring, STR). Memang lebih sulit (pseudonim, lintas negara), tapi <strong>titik masuk/keluar fiat</strong> (on/off-ramp via bank) tetap terpantau — dan di situlah pertarungan dimenangkan. Kripto bukan &ldquo;tak terlacak&rdquo;; ia <em>pseudonim dengan jejak permanen</em> (blockchain tidak lupa).</p>
      </details>
      <details className="worked">
        <summary>Q4: Denda AML — seberapa besar risikonya untuk bank menengah?</summary>
        <p><strong>Sangat material:</strong> denda administratif dapat mencapai <strong>miliaran–puluhan miliar rupiah</strong> per rangkaian pelanggaran, <em>plus</em> pembatasan usaha, <em>plus</em> biaya remidiasi (worked example 2). Dan yang tidak terlihat: <strong>kehilangan koresponden bank asing</strong> (de-risking) — yang bisa melumpuhkan bisnis trade finance. <strong>Matematikanya selalu: mencegah 5× lebih murah daripada mengobati.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 9 setoran Rp480-495 jt dalam 10 hari (ambang lapor Rp500 jt). Ini tipologi apa?"
        options={[
          "Layering",
          "Structuring — pecah transaksi agar di bawah ambang lapor; polanya: frekuensi × kedekatan ke ambang",
          "Transaksi normal",
          "Integration",
        ]}
        correct={1}
        explanation="Benar: structuring. Bukan nominalnya yang salah — Rp480 jt sendirian legal. Yang kriminal adalah POLA penghindaran pelaporan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Tahap pencucian mana yang PALING rentan bagi pencuci (titik emas deteksi)?"
        options={[
          "Integration — sudah bersih",
          "Placement — uang kotor pertama masuk sistem, masih 'bau', paling banyak jejak",
          "Layering — sudah teracak",
          "Semua sama",
        ]}
        correct={1}
        explanation="Benar: placement. Di sinilah ambang lapor tunai, KYC, dan monitoring setoran bekerja. Makin ke kanan makin sulit — karena itu cegah di kiri."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Nasabah 'gaji Rp10 jt/bulan' membeli apartemen Rp5 M tunai. Respons tepat?"
        options={[
          "Abaikan — hak nasabah",
          "Profil mismatch → EDD: minta sumber dana, bandingkan perilaku vs profil CDD",
          "Langsung laporkan polisi",
          "Blokir tanpa investigasi",
        ]}
        correct={1}
        explanation="Benar: EDD. CDD berkelanjutan = perilaku harus konsisten dengan profil. Mismatch = pemicu pendalaman, bukan vonis langsung."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Screening sanksi menemukan 'true hit' (identitas terkonfirmasi cocok daftar sanksi). Tindakan?"
        options={[
          "Catat saja, lanjutkan transaksi",
          "Bekukan + lapor segera — pelanggaran sanksi = denda miliaran + pidana; tapi pastikan TRUE hit (verifikasi pembeda) sebelum beku",
          "Beri tahu nasabah dulu",
          "Tunggu minggu depan",
        ]}
        correct={1}
        explanation="Benar: bekukan + lapor. Ini hukum internasional. 'Beri tahu nasabah dulu' = tipping-off (pidana). Pastikan true hit karena salah beku = gugatan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Apa yang membuat narasi STR berkualitas (standar PPATK)?"
        options={[
          "'Nasabah mencurigakan, mohon ditindak'",
          "Siapa (profil vs perilaku) + apa (pola spesifik: tanggal/nominal/frekuensi) + mengapa curiga (tipologi) + ke mana (aliran dana)",
          "Copy-paste alert",
          "Tuduhan 'pasti pencucian uang'",
        ]}
        correct={1}
        explanation="Benar: fakta + tipologi, bukan tuduhan. Bank bukan hakim — tugasnya memberi intelijen yang bisa ditindaklanjuti, bukan vonis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Tim TM menaikkan ambang: alert turun 1000→300, tapi 5 true positive ikut hilang. Penilaian?"
        options={[
          "Berhasil — alert berkurang",
          "Gagal sebagian — ukur 'kasus hilang', bukan cuma 'alert berkurang'; 5 kasus hilang mungkin = Rp miliaran + pelanggaran kewajiban lapor",
          "Tidak masalah",
          "Naikkan lagi ambangnya",
        ]}
        correct={1}
        explanation="Benar: tuning diukur dari kasus hilang. Di AML, melewatkan kasus nyata = potensi pelanggaran kewajiban lapor (denda!) — jauh lebih mahal dari 'efisiensi' alert."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>3 tahap:</strong> placement (titik emas) → layering (graph) → integration (profil mismatch).</li>
          <li><strong>6 tipologi:</strong> structuring, layering, trade-based, mule, crypto mixing, shell company — klasik mendominasi.</li>
          <li><strong>KYC/CDD/EDD:</strong> verifikasi → pahami profil → dalami yang berisiko. CDD = bandingkan perilaku vs profil.</li>
          <li><strong>Sanctions/PEP screening:</strong> pre-transaction; true hit = bekukan + lapor.</li>
          <li><strong>STR:</strong> narasi bukti (siapa+apa+mengapa+ke mana) ke PPATK; <strong>tipping-off = pidana</strong>.</li>
          <li><strong>Alert tuning:</strong> segmentasi + whitelist + ML triase; ukur <em>kasus hilang</em>.</li>
          <li>Kemenangan AML = <strong>lapor benar &amp; tepat waktu</strong> — bukan &ldquo;uang selamat&rdquo;.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr14-case-management" className="btn btn-secondary btn-sm">← FR14</Link>
        <Link href="/learn/fr16-anomali-time-series" className="btn btn-primary btn-sm">Next: FR16 →</Link>
      </div>
    </div>
  );
}
