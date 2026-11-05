"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR14Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const funnelData = [
    {
      x: ["Alert", "Dibuka", "Investigasi penuh", "Terkonfirmasi fraud", "Jadi label training"],
      y: [1000, 700, 400, 120, 85],
      type: "bar",
      marker: { color: ["#94a3b8", "#e8a838", "#e8a838", "#e05252", "#7bc96f"] },
      text: ["1000", "700", "400", "120", "85"],
      textposition: "outside",
    },
  ];

  const feedbackData = [
    {
      x: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6"],
      y: [0.55, 0.62, 0.68, 0.73, 0.77, 0.80],
      type: "scatter",
      mode: "lines+markers",
      name: "PR-AUC (dengan feedback loop)",
      line: { color: "#7bc96f", width: 3 },
      marker: { size: 8 },
    },
    {
      x: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6"],
      y: [0.55, 0.54, 0.53, 0.52, 0.51, 0.50],
      type: "scatter",
      mode: "lines+markers",
      name: "PR-AUC (tanpa feedback loop)",
      line: { color: "#e05252", width: 3 },
      marker: { size: 8 },
    },
  ];

  const lab1Code = `# Feedback loop: nilai 1 label investigator
# Tiap label benar dari investigator = 'pelajaran' untuk model.
# Simulasi: model belajar dari N label, ukur akurasinya.
import random
random.seed(41)

# 'Kebenaran': fraud jika (velocity > 6 dan device_baru) atau (nominal > 8)
def kebenaran(v, d, n):
    return 1 if (v > 6 and d == 1) or n > 8 else 0

# Model awal: hanya tahu 'nominal > 8' (buta terhadap pola velocity+device)
def model_awal(v, d, n):
    return 1 if n > 8 else 0

# Kumpulkan label dari investigator (simulasi: 200 kasus direview, label SEMPURNA)
random.seed(42)
label_baru = []
for _ in range(200):
    v, d, n = random.gauss(4, 3), random.choice([0, 1]), random.gauss(3, 3)
    v, n = max(0, v), max(0, n)
    label_baru.append((v, d, n, kebenaran(v, d, n)))

# Model 'belajar': jika banyak fraud berlabel punya (v>6, d=1), tambah rule itu
fraud_vd = sum(1 for v, d, n, y in label_baru if y == 1 and v > 6 and d == 1)
print(f"Fraud berlabel berpola (v>6, device baru): {fraud_vd}")
print("-> Model menambahkan pola ini ke logikanya (inilah 'belajar').")

def model_baru(v, d, n):
    return 1 if (n > 8 or (v > 6 and d == 1)) else 0

# Uji pada 1000 kasus baru
random.seed(99)
uji = [(max(0, random.gauss(4,3)), random.choice([0,1]), max(0, random.gauss(3,3))) for _ in range(1000)]
def akurasi(m):
    benar = sum(1 for v, d, n in uji if m(v, d, n) == kebenaran(v, d, n))
    return benar / len(uji) * 100

print(f"Akurasi model AWAL : {akurasi(model_awal):.1f}%")
print(f"Akurasi model BARU : {akurasi(model_baru):.1f}%  (+{akurasi(model_baru)-akurasi(model_awal):.1f} poin)")
print()
print("COBA UBAH: label_baru 200 -> 50 (sedikit feedback).")
print("Kenaikan menyusut. Pelajaran: feedback loop = BAHAN BAKAR model.")
print("Tanpa label investigator, model membeku di pengetahuan lama.")`;

  const lab2Code = `# Kualitas antrian: ukur 'kebocoran funnel' investigator
# Funnel: alert -> dibuka -> investigasi penuh -> konfirmasi -> jadi label
funnel = {
    "Alert masuk": 1000,
    "Dibuka": 700,
    "Investigasi penuh": 400,
    "Terkonfirmasi fraud": 120,
    "Jadi label training": 85,
}
tahap = list(funnel.items())
print(f"{'Tahap':22s} {'Jumlah':>6s}  Konversi dari tahap sblmnya")
for i, (nama, n) in enumerate(tahap):
    konv = f"{n/tahap[i-1][1]*100:5.1f}%" if i > 0 else "   -"
    print(f"{nama:22s} {n:6d}  {konv}")
print()
bocor = (tahap[3][1] - tahap[4][1]) / tahap[3][1] * 100
print(f"KEBOCORAN: {bocor:.0f}% fraud terkonfirmasi TIDAK jadi label training!")
print()
print("COBA RENUNGKAN: 35 kasus fraud 'hilang' di administrasi.")
print("Itu = 35 pelajaran yang tidak pernah sampai ke model.")
print("Pelajaran: feedback loop butuh DISIPLIN PROSES, bukan sekadar tools.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR14 — Fraud / ML Analytics</span>
        <h1 className="display-title">Case Management: Manusia di Ujung<br />Tombak (dan Ujung Feedback)</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 35 Pelajaran yang Hilang di Administrasi</a></li>
          <li><a href="#siklus">Siklus Hidup Kasus: Dari Alert ke Label</a></li>
          <li><a href="#kerja">Meja Kerja Investigator: Apa yang Mereka Butuhkan</a></li>
          <li><a href="#feedback">Feedback Loop: Bahan Bakar Model</a></li>
          <li><a href="#kualitas">Kualitas &amp; Konsistensi: Dua Investigator, Satu Kebenaran?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Nilai 1 Label Investigator</a></li>
          <li><a href="#lab2">🔬 Lab 2: Audit Kebocoran Funnel</a></li>
          <li><a href="#worked">📐 Worked Example: Kapasitas Investigator &amp; Sampling QA</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Manusia adalah Bottleneck Termahal</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Kebijakan Case Management</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Alur Case</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Backlog Lebaran &amp; 15 Investigator</a></li>

          <li><a href="#case">📋 Mini-Case: Investigator Mogok — Perbaiki Sistemnya</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Case Management</a></li>

          <li><a href="#latihan">Latihan Mandiri: Operasi Investigasi</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menggambarkan <strong>siklus hidup kasus fraud</strong> dari alert hingga menjadi label training.</li>
          <li>Merancang <strong>meja kerja investigator</strong> (informasi apa yang mereka butuhkan untuk memutuskan).</li>
          <li>Menjelaskan <strong>feedback loop</strong>: bagaimana keputusan investigator menjadi bahan bakar model.</li>
          <li>Mengukur dan menjaga <strong>kualitas label</strong> (konsistensi antar investigator).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 35 Pelajaran yang Hilang di Administrasi</h2>
      <div className="story">
        <p>Audit tahunan &ldquo;BankMega&rdquo; menemukan angka aneh: 120 kasus <strong>terkonfirmasi fraud</strong> oleh investigator — tapi hanya 85 yang masuk training set model. <strong>35 pelajaran hilang</strong> — bukan karena investigasi yang buruk, tapi karena <strong>administrasi</strong>: investigator lupa mengisi kolom &ldquo;keputusan final&rdquo;, form yang membingungkan, dan tidak ada yang mengecek.</p>
        <p>35 kasus = 35 pola serangan yang <strong>tidak pernah dipelajari model</strong>. Termasuk 12 kasus pola &ldquo;patungan fiktif&rdquo; — yang 4 bulan kemudian menyerang lagi, dan model buta total. &ldquo;Kenapa model tidak belajar?&rdquo; tanya direksi. Jawabannya memalukan: <strong>bukan modelnya yang bodoh — gurunya yang tidak pernah menyerahkan PR</strong>.</p>
        <p>Twist-nya: perbaikannya bukan AI canggih — melainkan <strong>form yang lebih sederhana + notifikasi + KPI</strong>. Tiga bulan kemudian, 99% kasus terkonfirmasi menjadi label. Model &ldquo;tiba-tiba&rdquo; membaik — tanpa satu baris pun perubahan algoritma. Lesson ini: <strong>case management yang buruk = ML yang kelaparan</strong>. Rantai paling lemah dari AI fraud sering kali adalah <em>formulir</em>.</p>
      </div>

      <h2 id="siklus">Siklus Hidup Kasus: Dari Alert ke Label</h2>
      <ol>
        <li><strong>Alert lahir:</strong> rule/model menandai transaksi (dengan skor + reason code).</li>
        <li><strong>Triase:</strong> antrian terurut prioritas (FR11); investigator mengambil teratas.</li>
        <li><strong>Investigasi:</strong> kumpulkan bukti — riwayat user, device, graph relasi, hubungi nasabah jika perlu.</li>
        <li><strong>Keputusan:</strong> <em>fraud terkonfirmasi / bukan fraud / tidak cukup bukti</em> — <strong>wajib</strong> disertai alasan terstruktur.</li>
        <li><strong>Aksi:</strong> blokir akun, hold dana, laporkan ke PPATK (jika AML), masukkan ke daftar hitam.</li>
        <li><strong>Label kembali:</strong> keputusan + bukti → training set (feedback loop) → model berikutnya lebih pintar.</li>
      </ol>

      <PlotlyChart
        data={funnelData}
        title="Funnel Kasus: Dari 1.000 Alert ke 85 Label (ilustrasi)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "Jumlah" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = jumlah kasus yang mencapai tahap itu; menyusut ke kanan = kebocoran.</p>
        <p><strong>Interpretasi:</strong> dua kebocoran kritis: (1) <strong>1.000 → 700 dibuka</strong> — 30% alert tidak pernah disentuh (kapasitas! FR11); (2) <strong>120 → 85 jadi label</strong> — 29% pelajaran hilang di administrasi. <strong>Funnel ini adalah KPI kesehatan sistem fraud-mu</strong> — ukur tiap minggu.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> funnel kasus = <strong>pipa bahan bakar ML</strong>. Kebocoran di ujung (120→85) sama merusaknya dengan kebocoran di awal — bahkan lebih: kasus terkonfirmasi adalah label <em>termahal</em> (bayar dengan waktu investigator) dan <em>paling berharga</em> (pasti benar). Kehilangan 1 label terkonfirmasi &gt; kehilangan 10 alert tak tersentuh.</p>
      </div>

      <h2 id="kerja">Meja Kerja Investigator: Apa yang Mereka Butuhkan</h2>
      <p>Investigator memutuskan dalam <strong>3–5 menit per kasus</strong>. Meja kerja (case UI) yang baik menyajikan — dalam <strong>satu layar, tanpa klik berlebihan</strong>:</p>
      <ul>
        <li><strong>Kenapa ditandai:</strong> skor + reason code (&ldquo;velocity 12× + device baru&rdquo;) — bukan sekadar &ldquo;skor 0,87&rdquo;.</li>
        <li><strong>Konteks user:</strong> umur akun, riwayat transaksi (grafik!), baseline vs saat ini.</li>
        <li><strong>Konteks jaringan:</strong> &ldquo;device ini dipakai 12 akun&rdquo; — mini graph.</li>
        <li><strong>Riwayat keputusan:</strong> &ldquo;akun ini pernah ditandai 2×, keduanya bukan fraud&rdquo; — mencegah vonis berulang.</li>
        <li><strong>Aksi satu klik:</strong> konfirmasi/tolak + alasan terstruktur (dropdown, bukan esai bebas!).</li>
      </ul>
      <p><strong>Prinsip desain:</strong> tiap klik tambahan = waktu × ribuan kasus = kapasitas terbuang. <strong>Alasan terstruktur</strong> (dropdown kategori) &gt; teks bebas — karena alasan itulah yang menjadi <strong>fitur/label</strong> untuk model berikutnya.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Investigator hanya eksekutor — yang penting modelnya pintar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> investigator adalah <strong>guru</strong> model (pemberi label), <strong>penemu pola</strong> (sumber rule baru — FR5), dan <strong>juri terakhir</strong> (keputusan final). Model tanpa investigator = murid tanpa guru: tidak pernah belajar dari kesalahan. Investasi pada tools investigator = investasi pada ML.</p>
      </div>

      <h2 id="feedback">Feedback Loop: Bahan Bakar Model</h2>
      <p><strong>Definisi.</strong> Feedback loop = aliran <strong>keputusan investigator → label → training ulang → model baru → keputusan lebih baik</strong>. Tanpa loop ini, model membeku pada pengetahuan saat training (dan mati oleh drift — FR10).</p>

      <PlotlyChart
        data={feedbackData}
        title="Dampak Feedback Loop: PR-AUC 6 Minggu (ilustrasi)"
        layout={{ xaxis: { title: "Minggu" }, yaxis: { title: "PR-AUC", range: [0.45, 0.85] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis hijau = model dengan feedback loop mingguan; garis merah = tanpa (model statis).</p>
        <p><strong>Interpretasi:</strong> dengan loop, PR-AUC <strong>naik</strong> 0,55 → 0,80 (belajar dari kesalahan). Tanpa loop, <strong>turun</strong> 0,55 → 0,50 (drift memakan). <strong>Selisih 0,30 dalam 6 minggu</strong> = nilai proses, bukan nilai algoritma. Inilah bukti kuantitatif bahwa &ldquo;formulir&rdquo; bisa lebih berharga dari &ldquo;model baru&rdquo;.</p>
      </div>

      <p><strong>Tiga syarat loop yang sehat:</strong></p>
      <ol>
        <li><strong>Kecepatan:</strong> label kembali dalam <strong>hari</strong>, bukan bulan. Label 3 bulan kemudian = pelajaran basi.</li>
        <li><strong>Kelengkapan:</strong> 100% keputusan terkonfirmasi tercatat (tutup kebocoran 120→85!).</li>
        <li><strong>Kualitas:</strong> label benar — ukur konsistensi antar investigator (lihat bawah).</li>
      </ol>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> feedback loop yang lambat = <strong>mengemudi sambil melihat spion 3 bulan lalu</strong>. Penipu sudah di tikungan berikutnya. Kecepatan loop (hari, bukan bulan) adalah keunggulan kompetitif yang tak bisa dibeli dengan GPU.</p>
      </div>

      <h2 id="kualitas">Kualitas &amp; Konsistensi: Dua Investigator, Satu Kebenaran?</h2>
      <p>Label dari investigator <strong>bukan kebenaran objektif</strong> — ia adalah <em>penilaian manusia</em> yang bisa salah dan tidak konsisten:</p>
      <ul>
        <li><strong>Ukur:</strong> sampel kasus dinilai 2 investigator independen (blind) → hitung <strong>tingkat kesepakatan</strong>. Di bawah 85% = masalah.</li>
        <li><strong>Sumber inkonsistensi:</strong> guideline kabur (&ldquo;kapan disebut fraud?&rdquo;), kelelahan (shift malam), bias konfirmasi (&ldquo;skor tinggi pasti fraud&rdquo;).</li>
        <li><strong>Perbaiki:</strong> guideline tertulis + contoh batas, kalibrasi rutin (bedah kasus bersama mingguan), rotasi agar tidak &ldquo;buta pola&rdquo;.</li>
      </ul>
      <p><strong>Ingat FR4:</strong> noise label 5–15% adalah normal. Yang tidak normal = <strong>tidak mengukurnya</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Label dari investigator pasti benar — mereka kan ahlinya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ahli pun lelah, bias, dan tidak konsisten — terutama pada kasus ambigu (&ldquo;tidak cukup bukti&rdquo;). Label adalah <em>penilaian terbaik yang tersedia</em>, bukan kebenaran mutlak. Ukur, kalibrasi, dan jangan pernah menganggapnya suci.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Nilai 1 Label Investigator</h2>
      <p>Ukur sendiri seberapa berharga feedback investigator.</p>
      <PyodideLab
        title="Lab 1 — Feedback Loop: Dari Label ke Akurasi"
        hint="Ubah label_baru 200 → 50. Lihat kenaikan akurasi menyusut — itulah 'harga' feedback yang sedikit."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Audit Kebocoran Funnel</h2>
      <PyodideLab
        title="Lab 2 — Funnel Kasus: Di Mana Bocornya?"
        hint="Ubah angka funnel sesuai timmu (kira-kira). Kebocoran mana yang paling mahal? Itulah prioritas perbaikan proses."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Matematika Tim Investigasi</h2>
      <p>Case management adalah <strong>operasi</strong> — dan operasi tunduk pada matematika antrean. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: berapa investigator yang dibutuhkan?</summary>
        <p>Volume: 6.000 flag/hari. Satu review rata-rata 6 menit (buka case, cek histori, putuskan, catat alasan).</p>
        <p><strong>Langkah 1 — kebutuhan mentah.</strong> 6.000 × 6 menit = 36.000 menit = <strong>600 jam kerja/hari</strong>.</p>
        <p><strong>Langkah 2 — kapasitas per orang.</strong> 8 jam shift × 75% produktif (istirahat, meeting, QA) = 6 jam efektif = <strong>60 case/hari/orang</strong>.</p>
        <p><strong>Langkah 3 — headcount.</strong> 6.000/60 = <strong>100 investigator</strong> — mustahil untuk kebanyakan perusahaan. Inilah momen kebenaran: <em>bukan</em> &ldquo;rekrut 100 orang&rdquo;, melainkan <strong>turunkan flag via threshold &amp; auto-decision</strong> (FR11): dengan dua threshold, 60% flag jadi auto-decision → 2.400 case/hari → 40 orang. Masih besar — maka prioritaskan lagi: hanya skor 0,05–0,70 yang manual (1.500/hari → 25 orang). <strong>Matematika kapasitas adalah argumen paling jujur untuk otomasi.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: sampling QA — berapa case di-review ulang?</summary>
        <p>Ingin mengestimasi <em>error rate</em> investigator (keputusan yang salah) dengan margin ±3% pada tingkat kepercayaan 95%.</p>
        <p><strong>Langkah 1 — rumus ukuran sampel.</strong></p>
        <Tex math={String.raw`n = \frac{Z^2 \times p(1-p)}{e^2}`} block />
        <p><Tex math={String.raw`Z`} /> = 1,96 (95%), <Tex math={String.raw`p`} /> = 0,15 (tebakan awal error rate 15%), <Tex math={String.raw`e`} /> = 0,03.</p>
        <p><strong>Langkah 2 — hitung.</strong> n = (3,8416 × 0,15 × 0,85)/0,0009 = 0,4898/0,0009 ≈ <strong>544 case</strong>.</p>
        <p><strong>Langkah 3 — operasionalkan.</strong> 544 case/bulan ÷ 20 hari kerja ≈ <strong>27 case/hari</strong> di-review ulang oleh senior (blind: tidak tahu keputusan awal). Hasilnya bukan untuk menghukum — tapi untuk <strong>mengukur disagreement rate</strong> dan menemukan pola kesalahan sistematis (misal: semua investigator salah menangani pola X → butuh training, bukan teguran). Tim tanpa QA sampling = tim yang tidak tahu seberapa salah ia.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Manusia adalah Bottleneck Termahal</h2>
      <p>Dalam seluruh pipeline fraud — data, model, rule, threshold — <strong>komponen termahal &amp; paling lambat adalah manusia yang me-review</strong>. Satu investigator = 60–80 case/hari = Rp25–50rb per keputusan. Setiap desain sistem (threshold, auto-decision, triage) pada dasarnya adalah <strong>manajemen kelangkaan perhatian manusia</strong>. Analis yang merancang tanpa menghitung kapasitas manusia = merancang mobil tanpa menghitung bensin.</p>
      <p>Intuisi kedua: <strong>kualitas keputusan manusia menurun dengan kelelahan — dan itu menular ke model</strong>. Investigator lelah → label buruk → model buruk bulan depan → lebih banyak false positive → investigator makin lelah. Ini <strong>spiral kematian kualitas</strong>. Melindungi investigator (beban wajar, tooling bagus, rotasi tugas) bukan &ldquo;HR issue&rdquo; — ia <strong>pemeliharaan aset data</strong> yang paling kritis.</p>
      <p><strong>Kapan case management manual TIDAK dibutuhkan:</strong> (1) <strong>pola dengan precision &gt; 95% stabil</strong> — auto-decision dengan banding; (2) <strong>nilai terlalu kecil</strong> untuk biaya review (Rp25rb review untuk sengketa Rp30rb = rugi pasti); (3) <strong>keputusan darurat serangan</strong> — kecepatan &gt; ketelitian sementara. Tapi: <strong>otomatisasi tanpa jalur banding = arogansi sistem</strong> — selalu sediakan cara bagi manusia untuk mengoreksi mesin.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ukur tim bukan dari <strong>case selesai</strong> tapi dari <strong>rupiah diselamatkan per jam</strong>. Dan ukur <em>sistem</em> dari <strong>berapa keputusan yang TIDAK butuh manusia</strong> — setiap auto-decision yang aman = jam manusia yang dibebaskan untuk yang abu-abu.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Kebijakan Case Management</h2>

      <div className="decision-card">
        <h3>1. Investigator kewalahan (banyak alert tak tersentuh) → <strong>perketat threshold + prioritas (FR11)</strong></h3>
        <p><strong>Kenapa:</strong> masalah kapasitas, bukan kemalasan. Jangan salahkan manusia atas matematika yang salah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Label tidak kembali ke training (bocor 120→85) → <strong>perbaiki proses: form sederhana + notifikasi + KPI</strong></h3>
        <p><strong>Kenapa:</strong> ini kebocoran termahal — label terkonfirmasi = bahan bakar termahal.</p>
        <p><strong>Contoh nyata:</strong> BankMega: 85→119 label (99%) dalam 3 bulan hanya dengan perbaikan form.</p>
      </div>

      <div className="decision-card">
        <h3>3. Investigator tidak konsisten (&lt;85% sepakat) → <strong>kalibrasi: guideline + bedah kasus mingguan</strong></h3>
        <p><strong>Kenapa:</strong> label inkonsisten = noise (FR4) = model bingung.</p>
      </div>

      <div className="decision-card">
        <h3>4. Pola baru ditemukan investigator → <strong>jalur cepat ke rule (FR5)</strong></h3>
        <p><strong>Kenapa:</strong> investigator adalah radar pola baru terbaik — lebih cepat dari menunggu label matang untuk retrain.</p>
        <p><strong>Proses:</strong> temuan → analis verifikasi → rule darurat (hari) → label → model (bulan).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Ukur <strong>funnel mingguan</strong>: alert → dibuka → konfirmasi → label.</li>
          <li><strong>100% keputusan terkonfirmasi</strong> harus jadi label — tidak ada pengecualian.</li>
          <li>Alasan <strong>terstruktur</strong> (dropdown), bukan esai bebas.</li>
          <li>Kalibrasi investigator rutin — label adalah penilaian, bukan kebenaran mutlak.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Mendesain Siklus Hidup Case</h2>
      <p>Tiga keputusan desain yang menentukan apakah tim investigasi efektif atau sekadar sibuk:</p>
      <p><strong>Skenario A — kapan auto-close tanpa manusia.</strong> Syarat: (1) precision pola &gt; 95% di 90 hari data, (2) nilai &lt; Rp500rb, (3) ada mekanisme banding nasabah yang mudah. Contoh: &ldquo;device terkonfirmasi jahat + pola identik dengan 1.000 kasus sebelumnya&rdquo; → auto-block + notifikasi. Yang <em>tidak</em> boleh auto-close: first-party (butuh penilaian niat), nilai besar, nasabah korporat. Aturan: <strong>otomatisasi yang jelas-jelas, manusia untuk yang abu-abu</strong>.</p>
      <p><strong>Skenario B — kapan eskalasi ke senior.</strong> Bukan &ldquo;kasus sulit&rdquo; (terlalu subjektif) — tapi <strong>pemicu objektif</strong>: nilai &gt; Rp50jt, nasabah korporat/pemerintah, indikasi insider, atau investigator ragu &gt; 10 menit. Eskalasi harus <em>murah</em> (satu klik, tanpa paperwork) — eskalasi yang ribet tidak akan dipakai saat dibutuhkan.</p>
      <p><strong>Skenario C — kapan case menjadi training data.</strong> Tidak semua keputusan investigator layak jadi label (FR4): hanya yang (1) melewati QA atau konsensus 2 investigator, (2) berumur &gt; contamination window, (3) lengkap alasannya (reason code terisi). Case yang diputuskan terburu-buru tanpa alasan = <strong>label sampah</strong> yang meracuni model. Kualitas loop tertutup ini menentukan apakah sistemmu <em>belajar</em> atau sekadar <em>berputar</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Investigator senior selalu benar.&rdquo;<br /><strong>Yang benar:</strong> disagreement rate antar investigator (bahkan senior) normalnya <strong>10–20%</strong> — terutama untuk first-party &amp; kasus abu-abu. Ini bukan aib; ini <em>data</em>: menunjukkan di mana definisi &amp; SOP perlu diperjelas. Tim yang mengklaim 0% disagreement biasanya tidak mengukur, bukan tidak bersalah.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Tim 15 Orang vs Lonjakan Mudik</h2>
      <p>Bank menengah Indonesia: tim fraud 15 investigator, kapasitas 900 case/hari. H-7 Lebaran: volume transaksi naik 2,5× (THR, tiket, parsel) dan — mengikuti volumenya — flag naik ke 2.800/hari. Backlog tumbuh 1.900/hari.</p>
      <p><strong>Hari ke-4:</strong> backlog 7.600 case, SLA 24 jam jebol total, investigator lembur 12 jam, error rate naik (kelelahan), 3 orang mengundurkan diri bulan berikutnya. Biaya: bukan cuma lembur — tapi <strong>kehilangan orang terlatih</strong> yang butuh 6 bulan untuk diganti.</p>
      <p><strong>Yang seharusnya disiapkan (playbook musiman):</strong> (1) <strong>tenaga cadangan terlatih</strong>: 10 staf CS dilatih dasar investigasi tiap kuartal, dipanggil saat lonjakan — seperti relawan bencana; (2) <strong>mode hemat</strong>: threshold sementara diketatkan + auto-decision diperluas untuk pola jelas, sehingga case manual turun 40%; (3) <strong>triage eksplisit</strong>: backlog diurutkan by expected value (FR11) — Rp50jt+ didahulukan, Rp100rb ditunda tanpa rasa bersalah; (4) <strong>batas lembur</strong>: investigator lelah = keputusan buruk = label buruk = model buruk bulan depan. Melindungi tim <em>adalah</em> melindungi kualitas sistem.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> case management yang baik tidak diukur dari <strong>berapa case selesai</strong>, tapi dari <strong>berapa rupiah diselamatkan per jam investigator</strong>. Seribu case Rp50rb yang selesai &lt; sepuluh case Rp50jt yang tertangani. Sibuk ≠ efektif.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Investigator Mogok — Perbaiki Sistemnya</h2>
      <div className="callout">
        <p>Tim 12 investigator &ldquo;PayKu&rdquo; mogok kerja informal: mereka hanya membuka 40% alert (&ldquo;percuma, kebanyakan sampah&rdquo;), form keputusan 15 kolom (&ldquo;ribet&rdquo;), dan tidak ada yang tahu apakah keputusan mereka dipakai (&ldquo;buat apa capek-capek?&rdquo;). Model stagnan 4 bulan.</p>
        <p><strong>Pertanyaan:</strong> rancang paket perbaikan 30 hari (proses + tools + insentif). Urutkan prioritas.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Minggu 1 — hentikan pendarahan:</strong> (1) naikkan threshold agar alert ≤ kapasitas (FR11) — &ldquo;sampah&rdquo; berkurang, kepercayaan kembali; (2) sederhanakan form: 15 kolom → 5 (keputusan + 3 alasan dropdown + catatan opsional).</p>
          <p><strong>Minggu 2–3 — tutup loop:</strong> (3) dashboard &ldquo;labelmu dipakai&rdquo;: tiap investigator melihat berapa labelnya masuk training + dampaknya ke model — <strong>makna kerja</strong> adalah insentif terkuat; (4) notifikasi: kasus terkonfirmasi yang belum jadi label &gt;24 jam → peringatan.</p>
          <p><strong>Minggu 4 — kualitas:</strong> (5) kalibrasi pertama: bedah 20 kasus ambigu bersama; tetapkan guideline tertulis.</p>
          <p><strong>Urutan penting:</strong> kapasitas dulu (minggu 1) — meminta disiplin dari orang yang tenggelam = sia-sia. Baru setelah beban wajar, tuntut kelengkapan. <strong>Pelajaran:</strong> masalah &ldquo;manusia&rdquo; hampir selalu masalah <em>sistem</em> yang membuat manusia gagal.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Case Management</h2>
      <details className="worked">
        <summary>Q1: Berapa rasio ideal investigator vs volume?</summary>
        <p><strong>Hitung mundur dari kapasitas:</strong> 1 investigator ≈ 60–80 review/hari (efektif). Jadi 6.000 flag/hari butuh ±100 orang — yang berarti <strong>targetmu seharusnya bukan rekrut 100 orang, melainkan turunkan flag ke &lt; 1.500/hari</strong> via threshold + auto-decision. Rasio &ldquo;ideal&rdquo; = <em>sedikit mungkin manusia untuk hasil maksimal</em> — manusia adalah sumber daya paling mahal, pakai untuk yang paling abu-abu.</p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana mencegah burnout investigator?</summary>
        <p><strong>Empat hal terbukti:</strong> (1) <em>beban wajar</em> — antrean yang selalu 3× kapasitas = keputusasaan terstruktur; (2) <em>variasi tugas</em> — rotasi antara review rutin, investigasi dalam, dan proyek perbaikan; (3) <em>umpan balik</em> — tunjukkan &ldquo;keputusanmu menangkap RpX bulan ini&rdquo; (makna!); (4) <em>jalur karir</em> — investigator senior → analis → spesialis. <strong>Turnover investigator = kehilangan label berkualitas</strong> — biayanya tidak terlihat di laporan, tapi ada di performa model 6 bulan kemudian.</p>
      </details>
      <details className="worked">
        <summary>Q3: QA sampling — berapa persen case harus di-review ulang?</summary>
        <p><strong>Berdasarkan statistik, bukan perasaan:</strong> hitung ukuran sampel untuk margin error yang diinginkan (worked example 2: ±3% → ~544 case/bulan). Praktik umum: <strong>5–10% untuk tim kecil, 2–5% untuk tim besar</strong> — dengan <em>oversampling</em> pada keputusan berisiko tinggi (nilai besar, banding). QA bukan untuk menghukum — tapi untuk <strong>mengukur &amp; memperbaiki sistem</strong>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Tooling apa yang paling berdampak untuk investigator?</summary>
        <p><strong>Yang menghemat klik &amp; konteks:</strong> (1) <em>single-pane view</em> — semua info kasus di 1 layar (tidak 7 tab); (2) <em>reason code otomatis</em> dari model (FR17) — investigator verifikasi, bukan menebak; (3) <em>one-click actions</em> dengan jejak audit; (4) <em>histori keputusan serupa</em> — &ldquo;kasus mirip diputuskan bagaimana?&rdquo;. <strong>Setiap 30 detik yang dihemat × 80 case × 20 orang = 13 jam/hari.</strong> Tooling = leverage.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Operasi Investigasi</h2>
      <p><strong>1.</strong> Flag 4.500/hari, 1 review = 7 menit, produktivitas 70% dari 8 jam shift. Berapa investigator dibutuhkan? Jika hanya ada 25 orang, apa 2 langkah pertamamu?</p>
      <p><strong>2.</strong> Backlog 5.000 case, tim 20 orang (60 case/hari/orang). Bagaimana kamu memprioritaskan? Tulis aturan triase 2 baris.</p>
      <p><strong>3.</strong> Kamu ingin mengukur error rate dengan margin ±5%, tebakan awal 10%. Hitung ukuran sampel QA per bulan (Z=1,96).</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Kebutuhan = 4.500 x 7 = 31.500 menit = 525 jam. Per orang = 8 x 0,7 = 5,6 jam = <strong>48 case</strong> → butuh <strong>94 orang</strong>. Dengan 25 orang: (1) <strong>turunkan flag via threshold/auto-decision</strong> ke ±1.200/hari; (2) <strong>triase by expected value</strong> — kerjakan yang mahal dulu.</p>
        <p><strong>2.</strong> Contoh: &ldquo;Urutkan by (skor x nominal); kerjakan dari atas sampai kapasitas habis; sisanya auto-tunda 24 jam dengan pemberitahuan.&rdquo; <em>Prioritas eksplisit mengalahkan FIFO yang adil tapi bodoh.</em></p>
        <p><strong>3.</strong> n = (3,8416 x 0,1 x 0,9)/0,0025 = 0,3457/0,0025 ≈ <strong>138 case/bulan</strong> ≈ 7/hari. <em>Statistik, bukan perasaan.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 120 kasus terkonfirmasi fraud, hanya 85 jadi label training. Apa masalah terbesarnya?"
        options={[
          "Investigator tidak kompeten",
          "Kebocoran administrasi — 35 label termahal & paling berharga hilang; model kehilangan 35 pelajaran",
          "Modelnya jelek",
          "Data kurang",
        ]}
        correct={1}
        explanation="Benar: kebocoran proses. Label terkonfirmasi = bahan bakar termahal (waktu investigator) & paling berharga (pasti benar). Perbaikannya: form sederhana + notifikasi + KPI."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa alasan keputusan harus TERSTRUKTUR (dropdown), bukan teks bebas?"
        options={[
          "Agar rapi",
          "Karena alasan itulah yang menjadi fitur/label untuk model berikutnya — teks bebas tidak bisa dipakai ML",
          "Agar cepat",
          "Tidak penting",
        ]}
        correct={1}
        explanation="Benar: alasan terstruktur = data. 'Alasan: velocity' bisa jadi fitur/label; esai bebas 3 paragraf tidak bisa dimakan model. Desain form = desain data masa depan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dua investigator hanya sepakat 70% pada sampel blind. Tindakan?"
        options={[
          "Pecat yang salah",
          "Kalibrasi: guideline tertulis + bedah kasus mingguan — inkonsistensi = noise label (FR4)",
          "Abaikan",
          "Tambah investigator",
        ]}
        correct={1}
        explanation="Benar: kalibrasi. 70% < 85% ambang sehat. Label inkonsisten = noise yang membingungkan model. Sumbernya biasanya guideline kabur + kelelahan, bukan ketidakmampuan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Investigator menemukan pola serangan baru hari ini. Jalur tercepat ke pertahanan?"
        options={[
          "Tunggu 3 bulan untuk retrain model",
          "Temuan → verifikasi analis → rule darurat (hari ini) → label terkumpul → model (bulan depan)",
          "Abaikan sampai ada label",
          "Langsung retrain",
        ]}
        correct={1}
        explanation="Benar: investigator = radar tercepat. Rule darurat menjembatani 90 hari menunggu label matang (FR10). Inilah kenapa jalur 'temuan → rule' harus formal, bukan informal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 'Model tanpa investigator = murid tanpa guru.' Maksudnya?"
        options={[
          "Model butuh diawasi",
          "Investigator adalah pemberi label (guru), penemu pola, dan juri terakhir — tanpa feedback loop, model membeku & mati oleh drift",
          "Investigator lebih pintar dari model",
          "Model tidak berguna",
        ]}
        correct={1}
        explanation="Benar: tiga peran — guru (label), radar (pola baru), juri (keputusan final). Investasi pada tools investigator = investasi pada ML itu sendiri."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Siklus kasus:</strong> alert → triase → investigasi → keputusan → aksi → <strong>label kembali</strong>.</li>
          <li><strong>Funnel</strong> (alert→label) = KPI kesehatan sistem; kebocoran 120→85 = kehilangan bahan bakar termahal.</li>
          <li><strong>Meja kerja:</strong> satu layar — skor + reason code + konteks + aksi satu klik + alasan terstruktur.</li>
          <li><strong>Feedback loop</strong> (cepat, lengkap, berkualitas) = yang membedakan model hidup vs mati.</li>
          <li><strong>Kalibrasi investigator</strong>: ukur kesepakatan blind; &lt;85% = perbaiki guideline.</li>
          <li>Masalah &ldquo;manusia&rdquo; hampir selalu masalah <strong>sistem</strong> — perbaiki proses dulu.</li>
          <li>Kapan TIDAK butuh loop cepat: pola stabil + drift rendah — tapi tetap jaga kelengkapan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr13-realtime" className="btn btn-secondary btn-sm">← FR13</Link>
        <Link href="/learn/fr15-aml" className="btn btn-primary btn-sm">Next: FR15 →</Link>
      </div>
    </div>
  );
}
