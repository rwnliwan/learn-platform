"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr22Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const cureRateData = [
    {
      x: ["DPD 1-30", "DPD 31-60", "DPD 61-90", "DPD 91-180", "DPD 180+"],
      y: [85, 62, 41, 22, 8],
      type: "bar",
      marker: { color: ["#3aa655", "#7bc47f", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["85%", "62%", "41%", "22%", "8%"],
      textposition: "outside",
    },
  ];

  const strategyData = [
    {
      x: ["Reminder", "Intensif", "Visit", "Restruktur", "Hukum"],
      y: [40, 75, 120, 60, 200],
      type: "bar",
      name: "Biaya (Rp ribu/akun)",
      marker: { color: "#94a3b8" },
      yaxis: "y",
    },
    {
      x: ["Reminder", "Intensif", "Visit", "Restruktur", "Hukum"],
      y: [85, 62, 55, 48, 30],
      type: "scatter",
      mode: "lines+markers",
      name: "Cure rate (%)",
      marker: { color: "#2a7de1" },
      yaxis: "y2",
    },
  ];

  const recoveryCurveData = [
    {
      x: [0, 3, 6, 12, 18, 24, 36],
      y: [0, 25, 45, 60, 68, 72, 74],
      type: "scatter",
      mode: "lines+markers",
      name: "Recovery kumulatif (%)",
      line: { color: "#3aa655", width: 3 },
    },
    {
      x: [0, 3, 6, 12, 18, 24, 36],
      y: [5, 28, 47, 61, 68, 72, 74],
      type: "scatter",
      mode: "lines",
      name: "Biaya kumulatif (%)",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Lab 1: Kapan berhenti menagih? — analisis biaya vs recovery
# Setiap strategi: biaya per akun vs probabilitas pulih (cure).
# Nilai ekspektasi = cure_rate x saldo - biaya.
saldo = 10_000_000  # Rp 10 juta
strategi = [
    ("Reminder (SMS/WA)",   40_000, 0.85),
    ("Intensif (telepon)",  75_000, 0.62),
    ("Kunjungan",          120_000, 0.55),
    ("Restrukturisasi",     60_000, 0.48),
    ("Hukum/lelang",     2_000_000, 0.30),
]
print(f"{'Strategi':<20} {'Biaya':>10} {'Cure':>6} {'Nilai ekspektasi':>16}")
for nama, biaya, cure in strategi:
    nilai = cure * saldo - biaya
    print(f"{nama:<20} {biaya:>10,} {cure:>5.0%} Rp {nilai:>11,.0f}")
print()
print("Coba: turunkan saldo jadi 2 juta. Strategi mana yang NILAINYA NEGATIF?")
print("Pelajaran: untuk saldo kecil, kunjungan & hukum RUGI —")
print("cukup reminder + write-off. Inilah segmentasi collection.")`;

  const lab2Code = `# Lab 2: Recovery curve — kapan workout sudah tidak worth it?
# Recovery kumulatif (%) vs biaya kumulatif (%) per bulan workout.
bulan  = [0, 3, 6, 12, 18, 24, 36]
rec    = [0, 25, 45, 60, 68, 72, 74]
cost   = [5, 28, 47, 61, 68, 72, 74]  # biaya sbg % dari saldo (ilustrasi)
saldo  = 100  # Rp 100 (satuan)
print(f"{'Bulan':>5} {'Recovery%':>10} {'Net%':>7}  Keterangan")
for b, r, c in zip(bulan, rec, cost):
    net = r - c
    ket = ""
    if b == 6: ket = "<- titik balik: net mulai turun"
    if b == 24: ket = "<- datar: berhenti di sini?"
    print(f"{b:>5} {r:>10} {net:>6}  {ket}")
print()
print("Coba: ubah cost bulan 12 jadi 70 (biaya membengkak).")
print("Titik balik maju ke bulan berapa?")
print("Inilah input kurva recovery untuk model LGD (CR12):")
print("recovery BERHENTI di titik net maksimum, bukan di 100%.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR22 — Credit Risk Analyst</span>
        <h1 className="display-title">Collection &amp; Recovery:<br />Menagih dengan Strategi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Penagih yang Salah Alamat</a></li>
          <li><a href="#cure">Cure Rate: Waktu Adalah Segalanya</a></li>
          <li><a href="#strategi">Strategi Collection: Dari SMS ke Lelang</a></li>
          <li><a href="#recovery">Recovery Curve: Kapan Berhenti?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kapan Berhenti Menagih?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Recovery Curve</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Eskalasi Collection</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Tim Collection yang Kelelahan</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan cure rate per bucket DPD dan mengapa intervensi dini 10× lebih efektif.</li>
          <li>Membandingkan 5 strategi collection (biaya vs efektivitas) dan memilih per segmen.</li>
          <li>Menganalisis recovery curve untuk menentukan titik berhenti workout (input LGD).</li>
          <li>Merancang segmentasi collection berbasis saldo &amp; DPD.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Penagih yang Salah Alamat</h2>
      <div className="story">
        <p>Dokter IGD tahu <strong>golden hour</strong>: pasien serangan jantung yang ditangani dalam 1 jam pertama punya peluang hidup <strong>jauh</strong> lebih besar. Menunggu 6 jam? Peluangnya anjlok.</p>
        <p>Kredit macet punya golden hour-nya sendiri. Pak Budi telat bayar KTA <strong>5 hari</strong> — lupa, bukan tidak mampu. SMS pengingat: lunas besok. <strong>Cure rate: 85%.</strong> Tapi di bank lain, akun DPD 5 hari <strong>tidak disentuh</strong> — "nanti saja kalau sudah 30 hari." Di hari ke-45, Pak Budi sudah gali lubang tutup lubang ke pinjol. Cure rate: <strong>41%.</strong></p>
        <p><strong>Twist-nya:</strong> bank kedua menghabiskan <strong>10× biaya collection</strong> (telepon, kunjungan, hukum) untuk hasil <strong>setengahnya</strong>. Bukan karena penagihnya malas — melainkan karena <strong>strateginya buta waktu</strong>. Lesson ini tentang menagih seperti dokter IGD: cepat, bertahap, dan tahu kapan berhenti.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="cure">Cure Rate: Waktu Adalah Segalanya</h2>
      <p><strong>Definisi.</strong> <strong>Cure rate</strong> = % akun menunggak yang <strong>kembali lancar</strong> (tanpa restrukturisasi) dalam periode tertentu, per bucket DPD:</p>

      <PlotlyChart
        data={cureRateData}
        title="Cure Rate per Bucket DPD (ilustrasi portofolio retail)"
        layout={{ xaxis: { title: "Bucket DPD" }, yaxis: { title: "Cure rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % akun yang sembuh sendiri per bucket.</p>
        <p><strong>Interpretasi:</strong> penurunan <strong>eksponensial</strong>: 85% → 8%. Setiap bulan penundaan <strong>membunuh</strong> peluang sembuh. DPD 1–30 vs 180+: <strong>10× lipat</strong> bedanya. <strong>Implikasi operasional:</strong> Rp 1 juta untuk reminder DPD 5 hari menyelamatkan 85 akun; Rp 1 juta untuk hukum DPD 180+ menyelamatkan 8. Alokasi collection harus <strong>miring ke awal</strong>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> cure rate seperti <strong>es yang mencair</strong> — di menit pertama masih bisa dibekukan lagi; setelah jadi air, tidak. Kebanyakan bank menginvestasikan <strong>terbalik</strong>: sedikit di awal (murah), banyak di akhir (mahal + sia-sia). <strong>Analis yang baik membalik piramida ini.</strong></p>
      </div>

      <h2 id="strategi">Strategi Collection: Dari SMS ke Lelang</h2>
      <p><strong>Definisi.</strong> <strong>Eskalasi collection</strong> = tangga tindakan dari murah-lunak ke mahal-keras, dipilih berdasar <strong>DPD + saldo + segmentasi risiko</strong>:</p>
      <ol>
        <li><strong>Reminder</strong> (SMS/WA/email) — DPD 1–7. Biaya ~Rp 40 rb. Untuk "lupa bayar".</li>
        <li><strong>Intensif</strong> (telepon) — DPD 8–30. Biaya ~Rp 75 rb. Negosiasi janji bayar.</li>
        <li><strong>Kunjungan</strong> (field visit) — DPD 31–90, saldo besar. Biaya ~Rp 120 rb. Verifikasi kondisi.</li>
        <li><strong>Restrukturisasi</strong> — debitur kooperatif tapi kesulitan (CR2). Win-win.</li>
        <li><strong>Hukum/lelang</strong> — DPD 180+, agunan jelas. Biaya Rp 2 jt+. Senjata terakhir.</li>
      </ol>
      <p><strong>Aturan emas:</strong> <strong>nilai ekspektasi = cure rate × saldo − biaya</strong>. Jika negatif → jangan lakukan (write-off lebih murah). Inilah yang dihitung Lab 1.</p>

      <PlotlyChart
        data={strategyData}
        title="Biaya vs Cure Rate per Strategi (ilustrasi)"
        layout={{ xaxis: { title: "Strategi" }, yaxis: { title: "Biaya (Rp ribu)" }, yaxis2: { title: "Cure rate (%)", overlaying: "y", side: "right" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang (kiri) = biaya per akun; garis (kanan) = cure rate.</p>
        <p><strong>Interpretasi:</strong> <strong>trade-off brutal</strong>: strategi termurah (reminder) justru cure rate tertinggi — karena dipakai di DPD awal. Hukum: biaya <strong>50× lipat</strong> reminder, cure rate <strong>sepertiga</strong>. <strong>Kesimpulan:</strong> eskalasi bukan "makin keras makin berhasil" — melainkan "makin mahal karena yang murah sudah tidak mempan". Urutan tidak boleh dibalik.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Penagih yang galak = collection bagus."</strong></p>
        <p><strong>Yang benar:</strong> collection modern = <strong>operasi data</strong>, bukan operasi otot. Yang menentukan hasil: <strong>kecepatan kontak</strong> (jam, bukan minggu), <strong>segmentasi tepat</strong> (saldo kecil ≠ kunjungan), dan <strong>tawaran yang realistis</strong> (restrukturisasi untuk yang kooperatif). Intimidasi justru menaikkan <strong>risiko reputasi &amp; hukum</strong> (OJK melarang penagihan tidak beretika).</p>
      </div>

      <h2 id="recovery">Recovery Curve: Kapan Berhenti?</h2>
      <p><strong>Definisi.</strong> <strong>Recovery curve</strong> = recovery kumulatif (%) terhadap waktu sejak default. Bentuknya <strong>cekung</strong>: cepat di awal (agunan likuid, debitur kooperatif), melambat, lalu datar.</p>
      <p><strong>Titik berhenti:</strong> workout dihentikan saat <strong>biaya marjinal &gt; recovery marjinal</strong> — titik net maksimum (lihat Lab 2). Melanjutkan setelah itu = <strong>membakar uang</strong> untuk menaikkan angka recovery kotor.</p>
      <p><strong>Kaitan ke LGD (CR12):</strong> kurva inilah <strong>input empiris</strong> model LGD — recovery yang dipakai = recovery pada titik berhenti ekonomis, didiskon ke present value.</p>

      <PlotlyChart
        data={recoveryCurveData}
        title="Recovery Curve: Kumulatif Recovery vs Biaya (ilustrasi)"
        layout={{ xaxis: { title: "Bulan sejak default" }, yaxis: { title: "% dari EAD" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis hijau = recovery kumulatif; garis merah putus-putus = biaya kumulatif.</p>
        <p><strong>Interpretasi:</strong> recovery naik cepat hingga bulan 12 (60%), lalu melambat drastis — 24 bulan tambahan hanya menambah 14 poin. <strong>Jarak</strong> antar garis = net recovery: melebar hingga ~bulan 6–12, lalu menyempit. <strong>Keputusan:</strong> workout intensif 12 bulan, lalu <strong>jual/cessie</strong> sisanya ke distressed buyer — jangan kejar 74% dengan biaya tak terbatas.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> recovery seperti <strong>memeras handuk basah</strong> — perasan pertama keluar banyak air; perasan ke-20 hanya tetesan, tapi tenagamu sama. <strong>Bank yang bijak tahu kapan meletakkan handuknya</strong> (jual ke pihak ketiga) dan kapan terus memeras.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Collection adalah Operasi Data, Bukan Operasi Otot</h3>
      <p>Miskonsepsi paling berbahaya tentang collection: "penagih yang galak = collection bagus." Realitas modern: <strong>yang menentukan hasil adalah kecepatan kontak, segmentasi yang tepat, dan tawaran yang sesuai</strong> — semuanya soal data. Nasabah "lupa bayar" (DPD 5) butuh SMS, bukan debt collector galak. Nasabah "tidak mampu" (DPD 120) butuh restrukturisasi, bukan ancaman. <strong>Salah strategi = biaya terbuang + hubungan rusak + hasil nol.</strong> Collection scorecard (CR9) mengubah penagihan dari kerja otot menjadi kerja otak — dan bank dengan collection cerdas menekan NPL 0,5–1% tanpa menambah satu pun personel.</p>
      <p>Intuisi kedua: <strong>cukup satu rumus — nilai ekspektasi</strong>. Setiap aksi collection harus lolos: <strong>cured amount × cure rate − biaya &gt; 0</strong>. Menagih Rp 500 ribu dengan kunjungan Rp 120 ribu dan cure rate 10% = ekspektasi Rp 50 ribu − Rp 120 ribu = <strong>negatif</strong> — jangan lakukan, write-off lebih murah. Rumus sederhana ini menghentikan 90% pemborosan collection: <strong>aksi yang ekspektasinya negatif adalah amal yang dibayar bank</strong>.</p>
      <p>Intuisi ketiga tentang recovery: <strong>tahu kapan berhenti</strong> sama pentingnya dengan tahu kapan mulai. Recovery curve mendatar setelah titik tertentu — melanjutkan workout melewati titik net maksimum = <strong>membakar uang untuk memeras tetesan</strong>. Tim recovery yang baik punya <strong>disiplin berhenti</strong>: tutup kasus yang tidak ekonomis, fokuskan energi ke yang masih punya harapan. Seperti dokter yang tahu kapan operasi tidak lagi membantu — kebijaksanaan, bukan kekalahan.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kapan Berhenti Menagih?</h2>
      <p>Hitung nilai ekspektasi tiap strategi — temukan yang nilainya negatif.</p>
      <PyodideLab
        title="Lab 1 — Nilai Ekspektasi Collection"
        hint="Turunkan saldo 10 juta → 2 juta. Strategi mana jadi negatif? Diskusikan: apakah 'keadilan' (semua ditagih sama) atau 'ekonomi' (segmentasi) yang benar?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Recovery Curve</h2>
      <p>Temukan titik balik: kapan workout berhenti worth it.</p>
      <PyodideLab
        title="Lab 2 — Titik Berhenti Workout"
        hint="Ubah cost bulan 12 jadi 70. Titik balik maju ke bulan berapa? Hubungkan ke CR12: angka recovery inilah yang masuk model LGD."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Eskalasi Collection</h2>

      <div className="decision-card">
        <h3>1. DPD 1–7 → <strong>reminder otomatis</strong></h3>
        <p><strong>Kondisi:</strong> mayoritas "lupa bayar", cure 85%.</p>
        <p><strong>Aksi:</strong> SMS/WA blast. Murah, otomatis, tanpa manusia. Jangan kirim penagih untuk urusan lupa.</p>
      </div>

      <div className="decision-card">
        <h3>2. DPD 8–90 → <strong>segmentasi: telepon / kunjungi / restruktur</strong></h3>
        <p><strong>Kondisi:</strong> campur lupa + kesulitan.</p>
        <p><strong>Aksi:</strong> saldo kecil → telepon; saldo besar → kunjungi; kooperatif tapi kesulitan → <strong>restrukturisasi</strong> (menyelamatkan lebih murah dari melelang).</p>
      </div>

      <div className="decision-card">
        <h3>3. Nilai ekspektasi negatif → <strong>jangan kejar, write-off/cessie</strong></h3>
        <p><strong>Kondisi:</strong> cure × saldo &lt; biaya.</p>
        <p><strong>Aksi:</strong> akui kekalahan ekonomi. Jual ke buyer (cessie) — dapat 10–20% sekarang &gt; 0% setelah 2 tahun.</p>
      </div>

      <div className="decision-card">
        <h3>4. Titik net maksimum tercapai → <strong>berhenti workout</strong></h3>
        <p><strong>Kondisi:</strong> recovery curve datar, biaya terus jalan.</p>
        <p><strong>Aksi:</strong> tutup file. Angka recovery kotor yang terus dikejar = vanity metric.</p>
      </div>

            <div className="decision-card">
        <h3>5. Collector pihak ketiga ketahuan mengancam debitur → <strong>potong kontrak + lapor + audit semua kasusnya</strong></h3>
        <p><strong>Kondisi:</strong> rekaman viral: collector vendor bank mengancam debitur. Tagihannya "berhasil" (debitur bayar karena takut).</p>
        <p><strong>Aksi:</strong> <strong>tanpa toleransi</strong>: (1) <strong>hentikan</strong> collector itu <em>hari ini juga</em> — bukan "peringatan"; (2) <strong>audit</strong> semua kasus yang ditanganinya — berapa yang "berhasil" dengan cara sama? (3) <strong>lapor ke OJK</strong> secara proaktif + siapkan remediasi ke debitur (minta maaf resmi, kembalikan jika ada kelebihan bayar karena tekanan); (4) <strong>review vendor</strong> — perketat SLA, audit mendadak, rekaman panggilan wajib. "Berhasil menagih" dengan ancaman = <strong>gagal total</strong>: sanksi OJK + gugatan + reputasi hancur biayanya 100× lipat dari tagihan. Prinsip: <strong>tidak ada target collection yang layak dibayar dengan pelanggaran</strong>.</p>
        <p><strong>Contoh nyata:</strong> setiap kasus viral debt collector di Indonesia berakhir sama: bank kena sanksi, direksi minta maaf publik, dan biaya reputasi jauh melampaui nilai tagihan. Pencegahan (seleksi + pengawasan vendor) selalu lebih murah dari pemadaman.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Cure 85% → 8%:</strong> kecepatan = segalanya.</li>
          <li><strong>Nilai ekspektasi &gt; 0</strong> atau jangan lakukan.</li>
          <li><strong>Restrukturisasi &gt; lelang</strong> untuk yang kooperatif.</li>
          <li><strong>Berhenti di titik net maksimum.</strong> Handuk ada batasnya.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Tangga Eskalasi Collection: 6 Anak Tangga</h3>
      <p>Setiap akun menunggak menaiki tangga ini — tidak boleh lompat (kecuali fraud). Setiap anak tangga punya biaya, syarat, dan pintu keluar.</p>
      <ol>
        <li><strong>Tangga 1 — Reminder otomatis (DPD 1–7)</strong> — SMS/WA/email. Biaya ~Rp 40 rb. Untuk 'lupa bayar'. Cure rate tertinggi, biaya terendah — <strong>otomatisasi maksimal</strong> di sini.</li>
        <li><strong>Tangga 2 — Telepon intensif (DPD 8–30)</strong> — Negosiasi janji bayar (PTP — promise to pay). Biaya ~Rp 75 rb. Catat PTP-nya — PTP yang diingkari 2× = naik tangga.</li>
        <li><strong>Tangga 3 — Kunjungan lapangan (DPD 31–90)</strong> — Verifikasi kondisi: usaha masih jalan? debitur kooperatif? Biaya ~Rp 120 rb. Hanya untuk saldo yang <strong>ekonomis</strong> (uji ekspektasi!).</li>
        <li><strong>Tangga 4 — Restrukturisasi (kooperatif + viable)</strong> — Ubah syarat agar bisa bayar. Win-win — tetapi dengan <strong>covenant baru + monitoring ketat</strong> (bukan evergreening).</li>
        <li><strong>Tangga 5 — Remedial khusus (DPD 90–180)</strong> — Tim khusus, negosiasi serius: diskon pelunasan? penjualan agunan sukarela? <strong>Kecepatan</strong> = kunci (cure rate anjlok tiap bulan).</li>
        <li><strong>Tangga 6 — Hukum &amp; lelang (DPD 180+)</strong> — Somasi, gugatan, eksekusi agunan. Biaya Rp 2 jt+. <strong>Senjata terakhir</strong> — mahal, lama, merusak hubungan. Jangan mulai dari sini.</li>
        <li><strong>Pintu keluar di setiap tangga:</strong> — Bayar lunas → turun ke Kolek 1. Restrukturisasi berhasil → Kolek 2 dengan monitoring. Tidak ekonomis → write-off (berhenti dengan aritmetika, bukan emosi).</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tempel tangga ini di ruang collection. Setiap akun harus jelas di tangga berapa — 'tidak tahu' = tidak dikelola.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Debitur marah-marah saat ditagih — bagaimana?</summary>
        <p><strong>Tetap profesional, jangan terpancing.</strong> Dengarkan (sering kemarahan = kepanikan keuangan), jelaskan opsi (restrukturisasi, penjadwalan), catat. Jika mengancam = laporkan (keselamatan dulu). <strong>Penagih yang terpancing emosinya = penagih yang kalah.</strong> Dan ingat batasan OJK: tidak boleh membalas dengan ancaman.</p>
      </details>
      <details className="worked">
        <summary>❓ Kapan write-off vs terus tagih?</summary>
        <p><strong>Aritmetika:</strong> ekspektasi recovery − biaya &gt; 0 = lanjut; &lt; 0 = write-off. Review tiap 3 bulan — cure rate turun terus = saatnya berhenti. Write-off bukan kekalahan; <strong>mengejar yang tidak ekonomis = kekalahan yang lebih mahal</strong>.</p>
      </details>
      <details className="worked">
        <summary>❓ Diskon pelunasan (haircut) — kapan diberikan?</summary>
        <p>Ketika: (1) debitur <strong>kooperatif tetapi tidak mampu penuh</strong>, (2) diskon mempercepat kas masuk (waktu = uang), (3) alternatifnya (lelang 2 tahun) recovery-nya <strong>lebih kecil</strong> setelah biaya + diskonto. Hitung — jangan 'kasihan'. <strong>Diskon yang terhitung = strategi; diskon karena kasihan = kebocoran.</strong></p>
      </details>
      <details className="worked">
        <summary>❓ Collection untuk KPR vs kartu kredit — bedanya?</summary>
        <p><strong>KPR:</strong> ada agunan (rumah) — strateginya <strong>pertahankan</strong> (restrukturisasi dulu, lelang terakhir; rumah = tempat tinggal = sensitif). <strong>Kartu kredit:</strong> tanpa agunan — strateginya <strong>kecepatan</strong> (hubungi di DPD awal; setelah 90 hari, recovery anjlok). Beda agunan = beda strategi.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Collection di Indonesia diatur ketat — dan kisah debt collector-nya legendaris (untuk alasan yang salah).</p>

      <h3>Regulasi Penagihan OJK: Otak Boleh, Otot Dibatasi</h3>
      <p>OJK mengatur tata cara penagihan secara eksplisit:</p>
      <ul>
        <li><strong>Debt collector wajib bersertifikat</strong> (melalui asosiasi) — tidak boleh asal rekrut preman.</li>
        <li><strong>Dilarang</strong> menagih dengan ancaman, kekerasan, atau mempermalukan; dilarang menagih ke pihak yang <strong>bukan</strong> debitur/penjamin (tidak boleh meneror keluarga/kantor).</li>
        <li><strong>Batasan waktu:</strong> penagihan hanya pada jam yang wajar (umumnya 08.00–20.00).</li>
        <li><strong>Tanggung jawab bank:</strong> pelanggaran oleh collector = <strong>sanksi untuk bank</strong> (bukan hanya untuk collector). Bank wajib mengawasi pihak ketiga yang ditunjuknya.</li>
      </ul>
      <p>Implikasinya untuk strategi collection: <strong>"tekan terus" bukan strategi — melainkan pelanggaran</strong>. Kuadran "tidak mampu total" harus ke remedial/legal, bukan ditekan. Collection yang cerdas = collection yang patuh — dan kepatuhan ini justru <strong>memaksa</strong> bank menjadi cerdas (segmentasi, data, tawaran yang tepat) karena jalur otot ditutup.</p>

      <h3>Kasus Viral: Harga Sebuah Ancaman</h3>
      <p>Setiap beberapa tahun, Indonesia diguncang <strong>kasus debt collector viral</strong> — intimidasi, kekerasan, bahkan korban jiwa. Dampaknya selalu sama: <strong>sanksi OJK untuk bank</strong>, gugatan, dan kerusakan reputasi yang biayanya jauh melampaui tagihan yang dikejar. Pelajaran yang dibayar mahal: <strong>satu aksi collection brutal bisa menghapus profit 1.000 akun yang tertagih baik</strong>. Inilah argumen bisnis (bukan sekadar moral) untuk collection yang profesional: <strong>reputasi adalah aset yang tidak ada di neraca, tetapi ada di setiap berita</strong>.</p>

      <h3>Hapus Buku vs Hapus Tagih: Ladang yang Terlupakan</h3>
      <p>Di bank BUMN, kredit yang dihapusbukukan <strong>tetap ditagih</strong> (hapus tagih butuh persetujuan negara — lama dan politis). Akibatnya ada <strong>"ladang" arsip hapus buku</strong> yang jika dikelola baik menghasilkan recovery mengejutkan: debitur yang usahanya bangkit 5 tahun kemudian, ahli waris yang melunasi, agunan yang nilainya naik. Tim recovery yang baik memperlakukan arsip sebagai <strong>portofolio</strong> — di-scoring ulang berkala (siapa yang kini mampu?), bukan sebagai kuburan. <strong>Recovery dari hapus buku = laba murni</strong> (sudah di-write-off, tidak ada CKPN lagi) — insentifnya besar.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: kapan berhenti menagih? (klik untuk buka)</summary>
        <p>Akun KTA Rp 5 jt, DPD 200, tanpa agunan. Pilihan: (a) kunjungan Rp 120 rb, cure rate 8%; (b) telepon Rp 75 rb, cure rate 3%; (c) hentikan, write-off.</p>
        <p><strong>Langkah 1</strong> — ekspektasi (a): 5 jt × 8% − 120 rb = 400 rb − 120 rb = <strong>+Rp 280 rb</strong> ✓ (lakukan).<br />
        <strong>Langkah 2</strong> — ekspektasi (b): 5 jt × 3% − 75 rb = 150 rb − 75 rb = <strong>+Rp 75 rb</strong> ✓ (lakukan jika (a) gagal).<br />
        <strong>Langkah 3</strong> — jika keduanya gagal 2×: cure rate turun ke ~1% → ekspektasi negatif → <strong>berhenti, write-off</strong>. Jangan kejar tetesan dengan biaya ember.</p>
        <p><strong>Pelajaran:</strong> keputusan berhenti bukan "menyerah" — melainkan <strong>aritmetika</strong>. Setiap rupiah biaya collection harus "membeli" ekspektasi recovery yang lebih besar.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Hapus buku = bank menyerah dan tidak menagih lagi."</strong></p>
        <p><strong>Yang benar:</strong> hapus buku = keluar dari neraca, <strong>bukan</strong> keluar dari penagihan. Upaya tagih jalan terus — dan recovery dari akun hapus buku adalah <strong>laba murni</strong>. Bank yang mengelola arsip hapus buku sebagai portofolio (scoring ulang berkala) memanen "uang hilang" bertahun-tahun kemudian.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Tim Collection yang Kelelahan</h2>
      <div className="callout">
        <p>Bank Nusantara: tim collection <strong>lembur tiap bulan</strong>, biaya naik 40%, tapi <strong>recovery turun</strong>. Audit menemukan:</p>
        <ul>
          <li>60% waktu habis untuk <strong>DPD 180+</strong> (cure 8%) — karena "target penyelesaian file lama".</li>
          <li>DPD 1–30 <strong>tidak disentuh 2 minggu</strong> — menunggu "batch" bulanan.</li>
          <li>Semua akun diperlakukan sama: kunjungan untuk saldo Rp 1 juta (!).</li>
          <li>Tidak ada restrukturisasi — "ribet, mending lelang".</li>
        </ul>
        <p><strong>Pertanyaan:</strong> diagnosis + redesign 3 poin.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Diagnosis: piramida terbalik</strong> — sumber daya habis di tempat yang paling tidak produktif.</p>
          <p><strong>Redesign:</strong><br />
          (1) <strong>Balik alokasi:</strong> 70% kapasitas ke DPD 1–30 (reminder otomatis + telepon hari ke-3). Target: cegah 85% masalah sebelum membesar.<br />
          (2) <strong>Segmentasi saldo:</strong> &lt;Rp 5 jt → hanya telepon/SMS (kunjungan dilarang — nilainya negatif); &gt;Rp 50 jt → kunjungan + restrukturisasi.<br />
          (3) <strong>Ubah KPI:</strong> dari "file lama selesai" menjadi <strong>"net recovery"</strong> (recovery − biaya) + cure rate DPD awal. KPI lama menghargai kerja keras di tempat yang salah.</p>
          <p>Pelajaran: <strong>collection yang baik bukan yang paling sibuk — melainkan yang paling cepat dan paling selektif.</strong></p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Ladang Hapus Buku</h2>
      <div className="callout">
        <p>Bank Nusantara punya <strong>arsip hapus buku Rp 80 M</strong> (2.000 akun, rata-rata dihapusbukukan 4 tahun lalu). Selama ini tidak disentuh ("sudah dihapus, ngapain?"). Kamu mengusulkan program recovery arsip.</p>
        <ul>
          <li>Biaya program: Rp 500 jt (2 analis + akses SLIK refresh + telepon).</li>
          <li>Asumsi: 5% akun masih "hidup" (debitur terlacak, usaha jalan) dengan recovery rata-rata 30% dari outstanding.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung ekspektasi recovery program ini. Layak jalan? Bagaimana cara memilih 5% yang "hidup"?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Ekspektasi:</strong> 2.000 × 5% = 100 akun hidup × (Rp 40 jt rata-rata × 30%) = 100 × Rp 12 jt = <strong>Rp 1,2 M</strong> — vs biaya Rp 500 jt. <strong>ROI 140%</strong> — layak jalan!</p>
          <p><strong>Cara memilih 5%:</strong> <strong>scoring ulang arsip</strong> — (1) refresh SLIK: siapa yang kini punya kredit lancar di bank lain? (usaha bangkit!); (2) cek usia &amp; pekerjaan terakhir; (3) prioritaskan yang punya agunan tercatat (meski dulu dinilai tidak ekonomis — harga tanah 4 tahun bisa naik 2×); (4) mulai dari telepon murah (Rp 75 rb/akun), hanya kunjungi yang responsif. <strong>Segmentasi dulu, kunjungi kemudian</strong> — prinsip collection berlaku juga untuk arsip.</p>
          <p><strong>Pelajaran:</strong> hapus buku = keluar dari neraca, bukan keluar dari harapan. Arsip yang dikelola = <strong>laba murni</strong> yang menunggu dipanen.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Cure rate DPD 1-30 = 85%, DPD 180+ = 8%. Implikasi operasional?"
        options={[
          "Fokus ke DPD 180+ karena paling sulit",
          "Miringkan sumber daya ke DPD awal: Rp 1 di awal menyelamatkan 10× lipat dibanding di akhir",
          "Tidak ada bedanya",
          "Tutup divisi collection",
        ]}
        correct={1}
        explanation="Benar: kecepatan = segalanya. Piramida alokasi harus miring ke awal, bukan ke file lama."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Saldo Rp 2 juta, DPD 60. Kunjungan (biaya 120rb, cure 55%). Layak?"
        options={[
          "Ya — kunjungi semua",
          "Tidak: 55% × 2jt − 120rb = 980rb > 0... tunggu, positif? Hitung: ekspektasi 1,1jt − 120rb = 980rb — ternyata masih positif, tapi bandingkan telepon: 62% × 2jt − 75rb = 1,165jt — telepon LEBIH BAIK",
          "Langsung hukum",
          "Write-off saja",
        ]}
        correct={1}
        explanation="Benar: bukan sekadar positif — pilih yang NILAI TERTINGGI. Telepon (1,165jt) > kunjungan (980rb). Segmentasi = optimasi, bukan sekadar layak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan workout harus dihentikan?"
        options={[
          "Saat recovery mencapai 100%",
          "Saat biaya marjinal > recovery marjinal (titik net maksimum) — melanjutkan = membakar uang",
          "Tidak pernah — kejar terus",
          "Saat debitur marah",
        ]}
        correct={1}
        explanation="Benar: titik net maksimum. Recovery kotor 100% tidak realistis; yang dioptimalkan = net."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Debitur kooperatif tapi kesulitan bayar (DPD 45). Strategi terbaik?"
        options={[
          "Langsung lelang agunan",
          "Restrukturisasi (penjadwalan ulang/keringanan) — menyelamatkan lebih murah dari melelang, dan debitur kooperatif = aset",
          "Biarkan saja",
          "Naikkan bunga",
        ]}
        correct={1}
        explanation="Benar: restrukturisasi = win-win. Melelang yang kooperatif menghancurkan nilai (biaya lelang + harga distressed)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Hubungan collection ke model LGD (CR12)?"
        options={[
          "Tidak ada hubungan",
          "Recovery curve dari workout = input empiris LGD; titik berhenti ekonomis menentukan recovery yang dipakai model",
          "LGD menentukan strategi collection",
          "Collection menghapus LGD",
        ]}
        correct={1}
        explanation="Benar: LGD bukan angka teori — ia diestimasi dari kurva recovery aktual. Collection yang buruk = data LGD yang buruk = model yang buruk."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Akun Rp 5 jt DPD 200: kunjungan Rp 120 rb (cure 8%) vs telepon Rp 75 rb (cure 3%). Mana yang dilakukan dulu?"
        options={[
          "Kunjungan — lebih galak pasti lebih berhasil",
          "Hitung ekspektasi: kunjungan +Rp 280 rb, telepon +Rp 75 rb — keduanya positif, lakukan yang ekspektasinya lebih besar dulu (kunjungan), telepon sebagai cadangan",
          "Jangan tagih — DPD 200 pasti gagal",
          "Keduanya sekaligus",
        ]}
        correct={1}
        explanation="Benar: aritmetika, bukan otot. Ekspektasi = cured × cure rate − biaya. Kunjungan +Rp 280 rb > telepon +Rp 75 rb — lakukan yang terbaik dulu. Jika gagal 2× dan ekspektasi negatif → berhenti (write-off)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Collector vendor ketahuan mengancam debitur (tetapi tagihannya 'berhasil'). Tindakan bank?"
        options={[
          "Biarkan — yang penting tertagih",
          "Beri peringatan lisan",
          "Nol toleransi: hentikan hari itu juga, audit semua kasusnya, lapor proaktif ke OJK, perketat pengawasan vendor — tidak ada target yang layak dibayar dengan pelanggaran",
          "Ganti vendor diam-diam",
        ]}
        correct={2}
        explanation="Benar: nol toleransi. 'Berhasil' dengan ancaman = gagal total — sanksi OJK + gugatan + reputasi hancur biayanya 100× tagihan. Bank bertanggung jawab atas pihak ketiganya. Pencegahan selalu lebih murah dari pemadaman."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Cure rate 85% → 8%</strong>: kecepatan intervensi = segalanya.</li>
          <li><strong>Eskalasi</strong>: reminder → telepon → kunjungan → restruktur → hukum. Jangan dibalik.</li>
          <li><strong>Nilai ekspektasi = cure × saldo − biaya.</strong> Negatif = jangan lakukan.</li>
          <li><strong>Berhenti di titik net maksimum</strong> recovery curve.</li>
          <li><strong>Collection = input LGD.</strong> Operasi menentukan model.</li>
          <li>Kapan TIDAK menagih agresif: debitur kooperatif kesulitan → restrukturisasi lebih murah dari lelang.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr21-pricing-risiko" className="btn btn-secondary btn-sm">← CR21</Link>
        <Link href="/learn/cr23-regulasi-indonesia" className="btn btn-primary btn-sm">Next: CR23 →</Link>
      </div>
    </div>
  );
}
