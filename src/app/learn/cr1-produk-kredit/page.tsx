"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr1Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const portfolioMixData = [
    {
      x: ["KPR & Konsumsi", "UKM", "Korporasi", "Kartu Kredit"],
      y: [38, 27, 25, 10],
      type: "bar",
      marker: { color: ["#2a7de1", "#3aa655", "#e8a838", "#ef4444"] },
      text: ["38%", "27%", "25%", "10%"],
      textposition: "outside",
    },
  ];

  const nplBySegmentData = [
    {
      x: ["KPR", "UKM", "Korporasi", "Kartu Kredit"],
      y: [2.1, 4.8, 3.2, 9.5],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#64748b", "#ef4444"] },
      text: ["2,1%", "4,8%", "3,2%", "9,5%"],
      textposition: "outside",
    },
  ];

  const cycleData = [
    {
      x: ["Origination", "Underwriting", "Pencairan", "Monitoring", "Collection", "Recovery"],
      y: [100, 62, 45, 45, 12, 4],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["100 aplikan", "62 lolos", "45 cair", "45 dimonitor", "12 bermasalah", "4 recovery"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: DSCR — napas keuangan debitur
# Ubah angka-angka di bawah, lalu jalankan.
arus_kas_operasi = 120  # juta Rp per tahun
kewajiban_utang  = 100  # cicilan pokok + bunga per tahun, juta Rp

dscr = arus_kas_operasi / kewajiban_utang
print(f"Arus kas operasi : Rp {arus_kas_operasi} jt/thn")
print(f"Kewajiban utang  : Rp {kewajiban_utang} jt/thn")
print(f"DSCR             : {dscr:.2f}x")
print()
if dscr >= 1.25:
    print("Keputusan: LAYAK — napas lega, ada buffer 25%+")
elif dscr >= 1.0:
    print("Keputusan: MARGINAL — lolos tapi tanpa buffer; waspadai guncangan")
else:
    print("Keputusan: TOLAK — arus kas tidak menutup cicilan (Capacity gagal)")
print()
print("Coba: turunkan arus_kas_operasi jadi 90. Pada titik berapa DSCR < 1.0?")
print("Itulah 'titik mati' capacity debitur ini.")`;

  const lab2Code = `# Lab 2: Komposisi portofolio vs kontribusi NPL
# Total kredit bank Rp 1.000 M. Ubah porsi & NPL tiap segmen.
segmen = {
    "KPR":        {"porsi": 0.38, "npl": 0.021},
    "UKM":        {"porsi": 0.27, "npl": 0.048},
    "Korporasi":  {"porsi": 0.25, "npl": 0.032},
    "Kartu":      {"porsi": 0.10, "npl": 0.095},
}
total = 1000  # miliar Rp
npl_total = 0
print(f"{'Segmen':<10} {'Kredit':>8} {'NPL Rp':>8} {'Kontribusi':>11}")
for nama, s in segmen.items():
    kredit = total * s["porsi"]
    npl_rp = kredit * s["npl"]
    npl_total += npl_rp
    print(f"{nama:<10} {kredit:>7.0f}M {npl_rp:>7.1f}M {npl_rp:>10.1f}M")
print("-" * 42)
print(f"NPL portofolio = {npl_total/total*100:.2f}%  (Rp {npl_total:.1f} M)")
print()
print("Coba: naikkan npl Kartu jadi 0.15. Segmen kecil (10%) tapi")
print("kontribusinya meledak — inilah mengapa kartu kredit 'kecil tapi pedas'.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR1 — Credit Risk Analyst</span>
        <h1 className="display-title">Kredit Bukan Sekadar Utang:<br />Produk, 5C, dan Siklus Hidupnya</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Nasabah, Dua Nasib</a></li>
          <li><a href="#produk">Empat Suku Besar Keluarga Kredit</a></li>
          <li><a href="#lima-c">5C — Lima Jurus Menilai Debitur</a></li>
          <li><a href="#siklus">Siklus Kredit: Dari Lamaran sampai Lunas (atau Macet)</a></li>
          <li><a href="#lab1">🔬 Lab 1: DSCR — Napas Keuangan Debitur</a></li>
          <li><a href="#lab2">🔬 Lab 2: Komposisi Portofolio vs Kontribusi NPL</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Produk Apa untuk Siapa</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: KPR vs KMK di Bank Nusantara</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan empat keluarga produk kredit (retail/KPR, UKM, korporasi, kartu kredit) dari sisi ticket size, tenor, agunan, dan pola risikonya.</li>
          <li>Menerapkan 5C (Character, Capacity, Capital, Collateral, Conditions) pada kasus pengajuan kredit nyata, termasuk menghitung DSCR.</li>
          <li>Menjelaskan enam tahap siklus kredit dan mengapa kredit macet hampir selalu "lahir" di tahap origination/underwriting, bukan di collection.</li>
          <li>Menghitung kontribusi NPL tiap segmen terhadap NPL portofolio bank.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Nasabah, Dua Nasib</h2>
      <div className="story">
        <p>Senin pagi di Bank Nusantara, cabang Surabaya. Dua pengajuan kredit masuk ke meja analis Rina — <strong>keduanya Rp 500 juta</strong>.</p>
        <p>Nasabah pertama: Budi, karyawan BUMN, gaji Rp 25 juta/bulan, mengajukan <strong>KPR</strong> tenor 15 tahun untuk rumah di Sidoarjo. Nasabah kedua: Pak Haji Slamet, pedagang grosir, omzet Rp 200 juta/bulan, mengajukan <strong>KMK (Kredit Modal Kerja)</strong> tenor 1 tahun untuk stok dagangan menjelang Lebaran.</p>
        <p>Angka pinjamannya sama persis. Tapi Rina memperlakukan keduanya <strong>seperti dua spesies berbeda</strong>: dokumen yang diminta beda, cara menilai kemampuan bayar beda, agunannya beda, bahkan definisi "macet"-nya beda.</p>
        <p>Setahun kemudian: KPR Budi lancar jaya. KMK Pak Haji macet di bulan ke-8 — dagangannya sepi, stok menumpuk. Rina tidak kaget. <em>"Risiko KMK memang begitu,"</em> katanya. <em>"Makanya bunganya lebih tinggi dari KPR."</em></p>
        <p><strong>Twist-nya:</strong> "kredit Rp 500 juta" bukan satu hal yang sama. Produk menentukan segalanya — cara menilai, cara memonitor, cara menagih, bahkan cara menghitung kerugiannya. Lesson ini adalah peta wilayahnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="produk">Empat Suku Besar Keluarga Kredit</h2>
      <p><strong>Definisi.</strong> Produk kredit adalah "kemasan" pinjaman yang menentukan <strong>kepada siapa</strong> diberikan, <strong>untuk apa</strong>, <strong>berapa lama</strong>, dan <strong>dengan jaminan apa</strong>. Empat keluarga besarnya:</p>

      <h3>1. Retail / Konsumsi — "Si Rutin yang Ramai"</h3>
      <p>KPR, KKB (kendaraan), multiguna, KTA. Ciri: ticket kecil–menengah (puluhan juta–miliaran), tenor panjang (KPR sampai 20–30 tahun), agunan jelas (rumah/kendaraan), jumlah debitur <strong>sangat banyak</strong>.</p>
      <p><strong>Kepribadian:</strong> seperti kawanan semut — satu ekor mati tidak terasa, tapi kalau satu koloni sakit (PHK massal, pandemi), efeknya sistemik. Risiko dinilai <strong>secara statistik/portofolio</strong>, bukan satu per satu.</p>

      <h3>2. UKM — "Si Pejuang yang Lincah tapi Rapuh"</h3>
      <p>KUR, KMK, KI (kredit investasi) untuk usaha kecil-menengah. Ciri: ticket menengah, laporan keuangan sering <strong>tidak rapi</strong> (banyak yang belum diaudit), arus kas musiman.</p>
      <p><strong>Kepribadian:</strong> seperti memancing di laut — hasilnya besar tapi ombaknya tidak bisa diprediksi. Analis UKM harus jago "membaca" usaha dari kunjungan lapangan, bukan cuma dari kertas. Di Indonesia, segmen ini didorong pemerintah (KUR bersubsidi) — volumenya besar, risikonya juga.</p>

      <h3>3. Korporasi — "Si Gajah yang Ditimbang Satu per Satu"</h3>
      <p>Kredit sindikasi, bilateral, trade finance untuk perusahaan besar. Ciri: ticket raksasa (puluhan–ratusan miliar), tenor terstruktur, dianalisis <strong>per debitur</strong> oleh tim khusus.</p>
      <p><strong>Kepribadian:</strong> seperti gajah di ruang tamu — satu saja jatuh, seisi rumah goyang. Satu debitur korporasi macet bisa menggerus modal bank. Makanya ada analisis laporan keuangan mendalam (ini materi CR17).</p>

      <h3>4. Kartu Kredit — "Si Kecil yang Pedas"</h3>
      <p><strong>Tanpa agunan</strong>, revolving (bisa tarik-bayar-tarik lagi), bunga tertinggi. Ciri: ticket kecil, jumlah kartu jutaan, pola bayar sangat sensitif terhadap perilaku.</p>
      <p><strong>Kepribadian:</strong> seperti cabai rawit — kecil tapi kalau NPL-nya naik, pedasnya terasa di laporan laba rugi. NPL kartu kredit di Indonesia historis di atas segmen lain (lihat chart di bawah).</p>

      <PlotlyChart
        data={portfolioMixData}
        title="Ilustrasi Komposisi Kredit Bank Umum Indonesia (per segmen)"
        layout={{ xaxis: { title: "Segmen" }, yaxis: { title: "% dari total kredit" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = segmen produk, tinggi batang = porsi terhadap total kredit bank (angka ilustratif pola umum bank umum Indonesia).</p>
        <p><strong>Interpretasi:</strong> konsumsi/KPR mendominasi (~38%) — bank Indonesia sangat bertumpu pada rumah tangga. Artinya: kesehatan portofolio bank = kesehatan dompet masyarakat (gaji, PHK, daya beli). Analis risiko kredit yang tidak paham ekonomi rumah tangga seperti dokter yang tidak tahu anatomi.</p>
      </div>

      <PlotlyChart
        data={nplBySegmentData}
        title="Ilustrasi NPL per Segmen (pola umum bank Indonesia)"
        layout={{ xaxis: { title: "Segmen" }, yaxis: { title: "NPL (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = rasio kredit macet (NPL) tiap segmen. Garis merah imajiner di 5% = ambang yang bikin OJK mulai bertanya-tanya.</p>
        <p><strong>Interpretasi:</strong> kartu kredit (9,5%) jauh di atas KPR (2,1%) — tanpa agunan + perilaku konsumtif = risiko tertinggi. Tapi ingat Lab 2: NPL portofolio adalah <strong>rata-rata tertimbang</strong>, jadi segmen kecil ber-NPL tinggi bisa "menenggelamkan" segmen besar yang sehat. Inilah mengapa bank mematok limit eksposur per segmen.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kredit dengan agunan besar pasti aman."</strong></p>
        <p><strong>Yang benar:</strong> agunan hanya mengurangi <strong>kerugian saat sudah macet</strong> (ini namanya LGD — materi CR12), bukan mengurangi <strong>peluang macetnya</strong> (PD — materi CR3/CR10). Rumah Rp 1 M sebagai agunan tidak mencegah debitur kehilangan pekerjaan. Bank yang terlena agunan = bank yang kaget saat agunan ternyata sulit dijual (ingat: agunan macet dijual saat pasar sedang jatuh — semua orang jual bareng).</p>
      </div>

      <h2 id="lima-c">5C — Lima Jurus Menilai Debitur</h2>
      <p>Sejak zaman bankir berjas tiga potong, ada lima lensa untuk menilai calon debitur. Masih dipakai sampai sekarang — termasuk di model scorecard modern (CR7):</p>
      <ul>
        <li><strong>Character</strong> — kemauan bayar. Riwayat kredit (cek SLIK OJK!), reputasi, kejujuran data. Debitur yang <em>bisa</em> bayar tapi <em>tidak mau</em> = mimpi buruk collection.</li>
        <li><strong>Capacity</strong> — kemampuan bayar dari arus kas. <strong>Raja dari semua C.</strong> Diukur dengan DSCR:</li>
      </ul>
      <Tex math={String.raw`\text{DSCR} = \frac{\text{Arus Kas Operasi}}{\text{Kewajiban Utang (cicilan + bunga)}}`} block />
      <p><strong>Artinya tiap simbol:</strong> pembilang = kas yang dihasilkan usaha/gaji per periode (bukan laba akuntansi!); penyebut = total cicilan pokok + bunga yang jatuh tempo. DSCR 1,25x artinya tiap Rp 1 cicilan didukung Rp 1,25 arus kas — ada buffer 25%.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Warung Bu Ani: laba operasi Rp 120 jt/thn, cicilan bank Rp 80 jt/thn, cicilan motor Rp 20 jt/thn.</p>
        <p><strong>Langkah 1</strong> — total kewajiban = 80 + 20 = Rp 100 jt/thn.<br />
        <strong>Langkah 2</strong> — DSCR = 120 / 100 = <strong>1,2x</strong>.<br />
        <strong>Langkah 3</strong> — interpretasi: lolos tipis. Buffer cuma 20% — kalau omzet turun 20% (misal jalan depan warung digali 3 bulan), DSCR jatuh ke ~0,96x = tidak sanggup bayar. Analis yang baik menulis ini di memo: "sensitif terhadap gangguan omzet".</p>
      </details>

      <ul>
        <li><strong>Capital</strong> — modal sendiri yang dipertaruhkan debitur ("skin in the game"). DP 30% untuk KPR bukan sekadar aturan — debitur yang sudah setor Rp 300 jt dari kantongnya sendiri akan berjuang lebih keras daripada yang 100% dibiayai bank.</li>
        <li><strong>Collateral</strong> — agunan sebagai "sabuk pengaman kedua". Aturan emas: <strong>kredit diberikan karena capacity, bukan karena collateral</strong>. Agunan yang bagus tidak menyelamatkan cash flow yang buruk.</li>
        <li><strong>Conditions</strong> — kondisi ekonomi di sekitar debitur: musim, harga komoditas, regulasi, daya beli. Pedagang grosir menjelang Lebaran (cerita pembuka) vs pedagang yang sama saat daya beli anjlok — orangnya sama, condition-nya beda, risikonya beda.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan 5C bukan alfabetis — melainkan urutan <strong>prioritas</strong>. Character × Capacity adalah "mesin" pembayaran; Capital + Collateral adalah "rem darurat"; Conditions adalah "cuaca". Bank yang membalik urutan (terpukau agunan mewah, mengabaikan arus kas) sedang menabung masalah.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "5C itu checklist formalitas — yang penting skor kreditnya lolos."</strong></p>
        <p><strong>Yang benar:</strong> 5C adalah <strong>kerangka berpikir</strong>, bukan formulir. Scorecard modern (CR7) pada dasarnya adalah 5C yang dikuantifikasi: character → riwayat SLIK, capacity → rasio DSR/DBR, capital → LTV, collateral → coverage agunan, conditions → variabel makro. Memahami 5C membuatmu paham <em>mengapa</em> model meminta variabel itu — bukan sekadar mengisi.</p>
      </div>

      <h2 id="siklus">Siklus Kredit: Dari Lamaran sampai Lunas (atau Macet)</h2>
      <p><strong>Definisi.</strong> Siklus kredit = perjalanan hidup sebuah pinjaman dalam 6 tahap. Tiap tahap punya "penjaga gerbang" dan risiko khasnya:</p>
      <ol>
        <li><strong>Origination</strong> — pengajuan &amp; akuisisi. Nasabah datang (atau dicari marketing). Risiko: <em>adverse selection</em> — yang paling semangat mengajukan sering yang paling butuh (baca: paling berisiko).</li>
        <li><strong>Underwriting</strong> — analisis &amp; keputusan (5C, scorecard, komite kredit). <strong>Gerbang terpenting.</strong> 80% nasib kredit ditentukan di sini.</li>
        <li><strong>Disbursement</strong> — pencairan. Risiko: dana tidak dipakai sesuai tujuan (kredit modal kerja dipakai beli mobil).</li>
        <li><strong>Monitoring</strong> — pemantauan berkala: mutasi rekening, SLIK, kunjungan. Di sinilah <em>early warning</em> bekerja (CR9).</li>
        <li><strong>Collection</strong> — penagihan saat menunggak (desk collection → field collection). Tujuannya <strong>menyelamatkan</strong>, bukan menghukum.</li>
        <li><strong>Recovery</strong> — penyelamatan terakhir: restrukturisasi, lelang agunan, hapus buku (write-off). Kadang masih ada <em>recovery</em> bertahun-tahun setelah write-off.</li>
      </ol>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kredit macet <strong>lahir di origination, baru ketahuan di collection</strong>. Seperti penyakit — gejalanya muncul belakangan, tapi infeksinya sejak awal. Analis hebat menghabiskan energi di hulu (underwriting yang tajam), bukan memadamkan api di hilir.</p>
      </div>

      <PlotlyChart
        data={cycleData}
        title="Corong Siklus Kredit: dari 100 aplikan (ilustrasi)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "Jumlah" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang menyusut dari kiri ke kanan — seperti corong. Setiap tahap menyaring sebagian.</p>
        <p><strong>Interpretasi:</strong> dari 100 aplikan, hanya 45 yang cair — underwriting menolak 55. Ini <strong>normal dan sehat</strong>: bank yang meloloskan 95 dari 100 aplikan bukan bank murah hati, melainkan bank yang 2 tahun lagi NPL-nya meledak. Penolakan adalah produk samping yang diinginkan dari underwriting yang baik.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Produk adalah 'Habitat' Risiko</h3>
      <p>Analis junior sering langsung lompat ke angka — PD berapa, skor berapa. Analis senior bertanya dulu: <strong>ini produk apa?</strong> Sebab setiap produk adalah habitat dengan hukum alamnya sendiri. Model PD yang dilatih dari data KPR lalu dipakai menilai KMK bukan sekadar kurang akurat — melainkan <strong>salah spesies</strong>. KPR dinilai dari stabilitas penghasilan; KMK dinilai dari siklus dagang; kartu kredit dinilai dari perilaku. Variabel yang prediktif di satu habitat bisa bisu di habitat lain.</p>
      <p>Implikasi praktisnya: saat kamu membaca laporan portofolio bank, <strong>jangan pernah baca angka agregat tanpa peta produknya</strong>. "NPL 3%" tidak berarti apa-apa sebelum kamu tahu: 3% dari apa? Kalau 80% portofolio adalah KPR, 3% itu buruk. Kalau 80%-nya kartu kredit dan KMK, 3% itu prestasi. Konteks produk mengubah makna setiap angka di lesson-lesson berikutnya — dari DPD (CR2) sampai ECL (CR14).</p>
      <p>Satu intuisi terakhir tentang harga: <strong>bunga kredit = harga sewa uang + harga risiko + biaya + margin</strong>. Produk tanpa agunan dan NPL tinggi (kartu kredit) <em>harus</em> mahal — bukan karena bank serakah, melainkan karena aritmetika. Bank yang menjual kartu kredit dengan bunga KPR sedang mensubsidi kerugian masa depan dengan modalnya sendiri. Setiap produk punya "bunga impas" (<em>break-even rate</em>) yang ditentukan EL-nya (CR3) — dan analis yang bisa menghitungnya tidak akan pernah tertipu promo "bunga 0%".</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: DSCR — Napas Keuangan Debitur</h2>
      <p>DSCR adalah denyut nadi capacity. Ubah angka di bawah dan rasakan kapan debitur "sesak napas".</p>
      <PyodideLab
        title="Lab 1 — Simulator DSCR"
        hint="Coba: turunkan arus_kas_operasi bertahap (120 → 100 → 90 → 80). Pada titik berapa keputusan berubah dari LAYAK menjadi TOLAK? Itulah margin of safety debitur."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Komposisi Portofolio vs Kontribusi NPL</h2>
      <p>NPL bank bukan rata-rata biasa — melainkan rata-rata <strong>tertimbang porsi kredit</strong>. Buktikan sendiri efek "kecil tapi pedas".</p>
      <PyodideLab
        title="Lab 2 — NPL Tertimbang Portofolio"
        hint="Coba: naikkan npl 'Kartu' dari 0.095 ke 0.15, lalu bandingkan dengan menaikkan npl 'KPR' ke 0.05. Mana yang lebih mengguncang NPL total? Mengapa?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Produk Apa untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Karyawan tetap, beli rumah pertama → <strong>KPR</strong></h3>
        <p><strong>Kondisi:</strong> penghasilan tetap &amp; terdokumentasi (slip gaji), tujuan jelas (rumah tinggal), agunan = rumahnya sendiri.</p>
        <p><strong>Kenapa KPR:</strong> tenor panjang menekan cicilan bulanan sehingga DSR masuk akal; agunan properti cenderung apresiasi; debitur punya insentif kuat mempertahankan rumah tinggalnya.</p>
        <p><strong>Contoh nyata:</strong> Budi di cerita pembuka — gaji Rp 25 jt, cicilan KPR Rp 7 jt (DSR 28%, di bawah batas umum 30–35%).</p>
      </div>

      <div className="decision-card">
        <h3>2. Pedagang/UMKM butuh stok dagangan → <strong>KMK / KUR</strong></h3>
        <p><strong>Kondisi:</strong> kebutuhan musiman &amp; berulang, arus kas fluktuatif, laporan keuangan sederhana.</p>
        <p><strong>Kenapa KMK:</strong> tenor pendek (≤1 tahun, bisa diperpanjang) mengikuti siklus dagang; plafon revolving — tarik saat butuh, bayar saat panen. KUR menambah subsidi bunga pemerintah untuk usaha mikro.</p>
        <p><strong>Contoh nyata:</strong> Pak Haji Slamet — KMK Rp 500 jt untuk stok Lebaran. Risiko: kalau Lebaran sepi, stok + utang menumpuk bersamaan.</p>
      </div>

      <div className="decision-card">
        <h3>3. Perusahaan butuh pabrik baru → <strong>Kredit Investasi Korporasi</strong></h3>
        <p><strong>Kondisi:</strong> ticket besar, tenor 5–10 tahun, proyeksi arus kas proyek tersedia, laporan keuangan diaudit.</p>
        <p><strong>Kenapa KI korporasi:</strong> cicilan diselaraskan dengan ramp-up proyek (grace period saat konstruksi); dianalisis per debitur oleh relationship manager + credit analyst; covenant mengikat (CR17).</p>
        <p><strong>Contoh nyata:</strong> perusahaan manufaktur bangun pabrik Rp 200 M — bank menilai proyeksi EBITDA 10 tahun, bukan slip gaji.</p>
      </div>

      <div className="decision-card">
        <h3>4. Kebutuhan konsumtif kecil, cepat, tanpa agunan → <strong>Kartu kredit / KTA</strong></h3>
        <p><strong>Kondisi:</strong> ticket kecil (jutaan–puluhan juta), keputusan harus cepat (menit–hari), tanpa agunan.</p>
        <p><strong>Kenapa kartu/KTA:</strong> dinilai dengan scorecard statistik (CR7), bukan analisis manual — tidak ekonomis menganalisis Rp 10 jt selama 2 minggu. Bunga tinggi mengkompensasi NPL tinggi.</p>
        <p><strong>Contoh nyata:</strong> karyawan butuh Rp 15 jt untuk biaya RS — cair dalam 1 hari via skor, bukan via komite.</p>
      </div>

            <div className="decision-card">
        <h3>5. Nasabah butuh rumah SEKALIGUS modal usaha → <strong>pisahkan menjadi dua produk</strong></h3>
        <p><strong>Kondisi:</strong> wirausahawan mengajukan "KPR" Rp 800 jt untuk ruko — tinggal sekaligus usaha. Godaan: satu akad, satu agunan, praktis.</p>
        <p><strong>Kenapa dipisah:</strong> KPR dinilai dari penghasilan stabil + tenor panjang; KMK dinilai dari arus kas usaha + tenor pendek. Dicampur = tenor salah (usaha butuh fleksibilitas, KPR kaku), monitoring salah (bayar lancar dari gaji menutupi usaha yang sekarat), dan kolektibilitas salah. Praktik sehat: KPR untuk porsi hunian + KMK untuk porsi usaha — dua akad, dua penilaian, dua monitoring.</p>
        <p><strong>Contoh nyata:</strong> debitur ruko di Surabaya: KPR Rp 500 jt (15 tahun, dari gaji istri PNS) + KMK Rp 300 jt (1 tahun revolving, dari omzet toko). Saat tokonya sepi 2020, KMK-nya direstrukturisasi — KPR-nya tetap lancar. Kalau dicampur, keduanya ikut "sakit".</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tanya dulu tujuannya</strong> — produktif (usaha) vs konsumtif menentukan keluarga produk.</li>
          <li><strong>Cek capacity dulu, agunan kemudian</strong> — DSCR &lt; 1 = berhenti, apapun agunannya.</li>
          <li><strong>Ticket kecil + banyak debitur → statistik</strong>; ticket besar + sedikit debitur → analisis manual mendalam.</li>
          <li><strong>Tanpa agunan = bunga harus menutup NPL</strong> — kalau tidak, produknya bunuh diri perlahan.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: 7 Pertanyaan Sebelum Memilih Produk</h3>
      <p>Setiap pengajuan kredit harus melewati 7 pertanyaan ini — berurutan. Satu jawaban 'tidak' = kembali ke pertanyaan sebelumnya, bukan lanjut.</p>
      <ol>
        <li><strong>Apa tujuannya?</strong> — Produktif (usaha) vs konsumtif menentukan keluarga produk. Tujuan yang tidak jelas = pengajuan yang tidak jelas — tolak atau minta klarifikasi.</li>
        <li><strong>Apakah capacity-nya cukup?</strong> — Hitung DSCR/DSR dari arus kas yang terverifikasi. Di bawah 1,0× = berhenti, apapun agunannya. Ini pertanyaan termurah yang paling sering dilewatkan.</li>
        <li><strong>Berapa skin in the game-nya?</strong> — DP/modal sendiri di bawah 20% = debitur tidak cukup 'terluka' jika gagal. Minta tambah DP atau tolak.</li>
        <li><strong>Apakah agunannya executable?</strong> — Bukan sekadar ada — tetapi: ikatan sempurna? (Hak Tanggungan/fidusia terdaftar), nilai likuidasi (bukan pasar), dan bisa dieksekusi dalam 2 tahun?</li>
        <li><strong>Bagaimana condition-nya?</strong> — Musim, harga komoditas, regulasi sektor — orang yang sama di cuaca berbeda = risiko berbeda. Nilai dengan skenario, bukan titik.</li>
        <li><strong>Apakah pricing-nya menutup EL?</strong> — Hitung bunga impas (CR21). Jika bunga yang diminta di bawah impas = bank mensubsidi risiko — tolak atau struktur ulang.</li>
        <li><strong>Siapa yang memonitor?</strong> — Tentukan pemilik monitoring + frekuensinya SEBELUM pencairan. Kredit tanpa pemilik monitoring = anak tanpa orang tua.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> cetak 7 pertanyaan ini dan tempel di mejamu. Setiap memo kredit yang kamu tulis harus menjawab ketujuhnya — berurutan, tanpa lompat.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Mana yang lebih berisiko: KPR Rp 500 jt atau KMK Rp 500 jt?</summary>
        <p>KMK — jauh. KPR: agunan properti, tenor panjang menekan cicilan, debitur karyawan berpenghasilan tetap. KMK: tanpa agunan keras (sering hanya persediaan), tenor pendek, arus kas musiman. Angka pinjamannya sama; 'spesies risikonya' beda — itulah pelajaran utama lesson ini.</p>
      </details>
      <details className="worked">
        <summary>❓ Bisakah satu debitur punya 3 produk sekaligus?</summary>
        <p>Bisa dan umum: KPR + kartu kredit + KTA. Analis wajib melihat <strong>total eksposur</strong> (di bank ini + di SLIK bank lain), bukan per produk. Debitur dengan 3 produk lancar = baik; dengan 3 produk + utilisasi 90% = gali lubang tutup lubang.</p>
      </details>
      <details className="worked">
        <summary>❓ Mengapa bank tetap menyalurkan kartu kredit padahal NPL-nya 9,5%?</summary>
        <p>Karena <strong>aritmetika</strong>: bunga 24% − EL 8% − biaya 8% = masih untung 8%. NPL tinggi bukan masalah jika <strong>harganya menutup</strong>. Masalahnya hanya jika bunga dibatasi regulasi di bawah break-even — maka bank harus memperketat seleksi atau keluar.</p>
      </details>
      <details className="worked">
        <summary>❓ KUR bunganya 6% — bagaimana bank tidak rugi?</summary>
        <p>Tidak rugi karena <strong>negara membayar selisihnya</strong> (subsidi). Bank menerima bunga pasar (misal 11%) — 6% dari debitur, sisanya dari pemerintah. Tetapi <strong>risiko gagal bayar tetap di bank</strong> — subsidi ≠ asuransi.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Semua konsep di lesson ini hidup di dunia nyata Indonesia — dengan aturan main dan kisah yang spesifik. Dua hal wajib kamu kenal: <strong>program KUR</strong> dan <strong>aturan main produk OJK</strong>.</p>

      <h3>KUR: Eksperimen Kredit Terbesar Indonesia</h3>
      <p>KUR (Kredit Usaha Rakyat) adalah program pemerintah: bunga disubsidi negara sehingga UMKM bisa pinjam dengan bunga ringan (sekitar 6% per tahun pada era subsidi penuh). Volumenya raksasa — ratusan triliun rupiah disalurkan ke jutaan debitur mikro. Dari sisi produk, KUR adalah KMK/KI versi massal: ticket kecil, debitur sangat banyak, laporan keuangan sederhana.</p>
      <p><strong>Yang sering disalahpahami:</strong> subsidi pemerintah menanggung <strong>selisih bunga</strong>, bukan <strong>risiko gagal bayar</strong>. Kalau debitur KUR macet, yang menanggung kerugiannya tetap bank penyalur (atau penjamin seperti Jamkrindo/Askrindo untuk porsi yang dijamin — dan penjamin pun punya syarat ketat). Analis di bank penyalur KUR tetap menilai 5C dengan serius; "kan disubsidi" bukan alasan melonggarkan underwriting. Justru tantangannya: volume jutaan debitur membuat analisis manual mustahil — di sinilah scorecard massal (CR7) menjadi nyawa program.</p>
      <p><strong>Kepribadian KUR:</strong> seperti program vaksinasi massal — manfaatnya besar bagi ekonomi, tapi pelaksanaannya butuh sistem (skor, monitoring otomatis) karena tidak mungkin memeriksa satu per satu dengan teliti. Bank yang menyalurkan KUR tanpa mesin risiko yang kuat sedang bermain api dengan uang negara.</p>

      <h3>Aturan Main Produk dari OJK</h3>
      <p>OJK mengatur tiap keluarga produk dengan aturan berbeda — karena risikonya beda:</p>
      <ul>
        <li><strong>KPR:</strong> aturan <em>loan-to-value</em> (dulu LTV, kini FTV — <em>financing-to-value</em>). Saat ekonomi lesu, OJK/BI melonggarkan FTV hingga 100% (DP 0%) untuk mendongkrak pasar properti; saat panas, diperketat. Analis KPR wajib mengikuti siklus kebijakan ini — pelonggaran FTV hari ini adalah NPL 2–3 tahun ke depan jika underwriting ikut longgar.</li>
        <li><strong>Kartu kredit:</strong> OJK membatasi bunga dan mengatur praktik penagihan. Batas bunga kartu kredit di Indonesia termasuk yang diatur paling eksplisit — bank tidak bebas mematok berapapun meski risikonya tinggi. Artinya: ruang pricing terbatas, sehingga seleksi (PD) menjadi satu-satunya tuas (ingat Peta Keputusan CR3).</li>
        <li><strong>KMK/KI korporasi:</strong> aturan BMPK (Batas Maksimum Pemberian Kredit) membatasi eksposur ke satu grup — "gajah" tidak boleh terlalu besar di satu bank (detail CR23).</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: bunga impas KUR vs kartu kredit (klik untuk buka)</summary>
        <p>Asumsi biaya dana + operasional = 8% untuk kedua produk.</p>
        <p><strong>KUR:</strong> EL ≈ PD 5% × LGD 60% = 3%. Bunga impas ≈ 8% + 3% = <strong>11%</strong>. Subsidi pemerintah menutup selisih ke bunga 6% — bank tetap impas, negara membayar premi risikonya.</p>
        <p><strong>Kartu kredit:</strong> EL ≈ PD 9% × LGD 85% ≈ 7,7%. Bunga impas ≈ 8% + 7,7% = <strong>15,7%</strong> — belum termasuk modal untuk UL. Inilah mengapa bunga kartu kredit belasan–puluhan persen: aritmetika, bukan keserakahan.</p>
        <p><strong>Pelajaran:</strong> setiap produk punya "harga pokok" risikonya. Analis yang bisa menghitung bunga impas bisa menilai: apakah pricing bank menutup risiko, atau sedang bakar modal?</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kredit program pemerintah (KUR) pasti aman karena dijamin negara."</strong></p>
        <p><strong>Yang benar:</strong> yang disubsidi adalah <strong>bunga</strong>, bukan risiko kreditnya. Penjaminan (jika ada) hanya mencakup porsi tertentu dengan syarat klaim yang ketat — keterlambatan klaim, dokumen kurang, atau pelanggaran prosedur bisa membuat klaim ditolak. Bank penyalur yang underwriting-nya asal-asalan tetap menanggung NPL KUR di laporannya. "Program pemerintah" bukan jimat anti-rugi.</p>
      </div>

      <h2 id="case">📋 Mini-Case: KPR vs KMK di Bank Nusantara</h2>
      <div className="callout">
        <p>Data setahun terakhir Bank Nusantara (cabang Surabaya):</p>
        <ul>
          <li><strong>KPR:</strong> 2.000 debitur, outstanding Rp 800 M, NPL 2,1%, rata-rata LTV 75%, tenor rata-rata 14 tahun.</li>
          <li><strong>KMK:</strong> 500 debitur, outstanding Rp 200 M, NPL 6,5%, 60% tanpa agunan tambahan selain persediaan, tenor rata-rata 11 bulan.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Hitung NPL portofolio gabungan. (b) Direksi ingin ekspansi KMK 2× lipat karena margin bunganya lebih tinggi. Sebagai analis, apa 2 kekhawatiran utamamu dan data apa yang kamu minta sebelum setuju?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) NPL gabungan = (800 × 2,1% + 200 × 6,5%) / 1000 = (16,8 + 13) / 1000 = <strong>2,98%</strong>. Perhatikan: KMK hanya 20% porsi tapi menyumbang 13/29,8 ≈ <strong>44% dari total NPL</strong>!</p>
          <p>(b) Kekhawatiran 1: <strong>konsentrasi risiko</strong> — NPL gabungan akan naik ke (800×2,1% + 400×6,5%)/1200 = 3,57%, mendekati ambang perhatian OJK. Kekhawatiran 2: <strong>capacity musiman</strong> — KMK sensitif terhadap siklus dagang; ekspansi 2× tanpa memperkuat monitoring = menabung NPL. Data yang diminta: vintage curve KMK per kohort pencairan (CR6), distribusi DSCR debitur KMK, dan hasil stress test (CR16) bila omzet turun 20%.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dari 5C, mana yang disebut 'raja' dan mengapa?"
        options={[
          "Collateral — karena agunan menjamin bank tidak rugi",
          "Capacity — karena pembayaran cicilan datang dari arus kas, bukan dari agunan",
          "Capital — karena modal besar pasti aman",
          "Conditions — karena ekonomi menentukan segalanya",
        ]}
        correct={1}
        explanation="Benar: Capacity. Cicilan dibayar dari arus kas setiap bulan — agunan baru berguna setelah macet (dan nilainya bisa jatuh saat krisis). Bank yang membalik urutan ini menabung masalah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Warung Bu Ani: arus kas Rp 120 jt/thn, total cicilan Rp 100 jt/thn. DSCR dan interpretasinya?"
        options={[
          "0,83x — tidak layak",
          "1,2x — layak tapi buffer tipis, sensitif terhadap penurunan omzet",
          "2,0x — sangat aman",
          "1,0x — pas, tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: 120/100 = 1,2x. Lolos, tapi buffer hanya 20% — penurunan omzet 20% saja sudah membuat DSCR < 1. Analis yang baik mencatat sensitivitas ini di memo kredit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa kartu kredit bunganya paling tinggi di antara produk kredit?"
        options={[
          "Bank serakah",
          "Tanpa agunan + NPL historis tertinggi → bunga harus mengkompensasi expected loss",
          "Biaya operasional kartu paling mahal",
          "Regulasi OJK mewajibkan bunga tinggi",
        ]}
        correct={1}
        explanation="Benar: tanpa agunan berarti LGD tinggi (hampir 100%), dan NPL segmen ini tertinggi. Bunga = harga risiko. Kalau bunga tidak menutup expected loss, produknya merugi struktural."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kredit macet 'lahir di origination, baru ketahuan di collection'. Artinya?"
        options={[
          "Tim collection tidak becus",
          "Akar masalah biasanya keputusan underwriting yang longgar; gejalanya baru muncul belakangan",
          "Origination harus dihapus",
          "Collection tidak penting",
        ]}
        correct={1}
        explanation="Benar: seperti penyakit — infeksi di awal, gejala belakangan. Underwriting yang tajam mencegah; collection yang bagus hanya mengobati. Energi terbesar harus di hulu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bank meloloskan 95 dari 100 aplikan kredit. Sebagai analis risiko, reaksimu?"
        options={[
          "Bagus — inklusif dan mendukung pertumbuhan",
          "Waspada — seleksi terlalu longgar; adverse selection; NPL 2 tahun lagi berisiko meledak",
          "Netral — tidak ada hubungannya dengan risiko",
          "Bagus — pangsa pasar naik",
        ]}
        correct={1}
        explanation="Benar: waspada. Approval rate 95% nyaris tanpa filter = adverse selection (yang paling butuh = yang paling berisiko justru paling semangat mengajukan). Bank sehat menolak sebagian aplikan — penolakan adalah output yang diinginkan dari underwriting."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Pemerintah mensubsidi bunga KUR hingga ke 6%. Debitur KUR kemudian macet. Siapa yang menanggung kerugian pokoknya?"
        options={[
          "Pemerintah — kan program pemerintah, pasti dijamin penuh",
          "Bank penyalur (dan penjamin sesuai porsi & syarat klaim) — subsidi hanya menutup selisih bunga, bukan risiko gagal bayar",
          "Debitur lain yang lancar — dananya dipakai menutup",
          "Tidak ada yang rugi — kredit program tidak dicatat sebagai NPL",
        ]}
        correct={1}
        explanation="Benar: subsidi = selisih bunga, bukan asuransi gagal bayar. Risiko kredit tetap di bank penyalur (atau penjamin sesuai kontrak dengan syarat ketat). 'Program pemerintah' bukan jimat — underwriting KUR harus tetap tajam."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Wirausahawan mengajukan satu kredit Rp 800 jt untuk ruko (tinggal + usaha). Praktik analis yang paling sehat?"
        options={[
          "Setujui satu akad KPR — praktis, agunannya jelas",
          "Pisahkan: KPR untuk porsi hunian + KMK untuk porsi usaha — dua penilaian, dua tenor, dua monitoring",
          "Tolak — ruko tidak bisa dijaminkan",
          "Setujui sebagai KMK semua — tenor pendek lebih aman bagi bank",
        ]}
        correct={1}
        explanation="Benar: pisahkan. Hunian (penghasilan stabil, tenor panjang) dan usaha (arus kas fluktuatif, tenor pendek) adalah dua spesies risiko. Dicampur = tenor, penilaian, dan monitoring semuanya salah alamat."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Empat keluarga produk:</strong> retail/KPR (banyak, statistik), UKM (lincah tapi rapuh), korporasi (gajah, dianalisis satu per satu), kartu kredit (kecil tapi pedas).</li>
          <li><strong>5C:</strong> Character × Capacity adalah mesin pembayaran; Capital + Collateral rem darurat; Conditions cuaca. Capacity adalah raja — ukur dengan DSCR.</li>
          <li><strong>Agunan ≠ aman:</strong> agunan menurunkan LGD, bukan PD.</li>
          <li><strong>Siklus 6 tahap:</strong> origination → underwriting → disbursement → monitoring → collection → recovery. Macet lahir di hulu.</li>
          <li><strong>NPL portofolio = rata-rata tertimbang</strong> — segmen kecil ber-NPL tinggi bisa mendominasi.</li>
          <li>Kapan TIDAK pakai pola pikir produk massal: ticket raksasa korporasi — di sana statistik kalah oleh analisis fundamental per debitur.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/cr2-kolektibilitas" className="btn btn-primary btn-sm">Next: CR2 →</Link>
      </div>
    </div>
  );
}
