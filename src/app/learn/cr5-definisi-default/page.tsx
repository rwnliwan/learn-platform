"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr5Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const windowData = [
    {
      x: ["Jan-24", "Jul-24", "Jan-25", "Jul-25", "Jan-26"],
      y: [1, 1, 1, 1, 1],
      type: "scatter",
      mode: "lines",
      line: { color: "#94a3b8", width: 8 },
      name: "Observation window",
    },
    {
      x: ["Jan-25", "Jul-25", "Jan-26"],
      y: [1.15, 1.15, 1.15],
      type: "scatter",
      mode: "lines",
      line: { color: "#2a7de1", width: 8 },
      name: "Performance window",
    },
  ];

  const censoringData = [
    {
      x: ["A: default bln-8", "B: lunas bln-10", "C: masih jalan (censored)", "D: default bln-14"],
      y: [8, 10, 12, 14],
      type: "bar",
      marker: { color: ["#ef4444", "#3aa655", "#e8a838", "#ef4444"] },
      text: ["default ✓", "lunas (censored)", "belum jelas (censored)", "di luar window!"],
      textposition: "outside",
    },
  ];

  const defaultRateData = [
    {
      x: ["DPD 90+", "Unlikely to pay", "Bangkrut", "Restrukturisasi distressed"],
      y: [62, 21, 9, 8],
      type: "bar",
      marker: { color: ["#ef4444", "#ef9244", "#8b1a1a", "#e8a838"] },
      text: ["62%", "21%", "9%", "8%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Mesin definisi default (Basel)
# Ubah dpd / kondisi debitur, lihat apakah "default" menurut Basel.
dpd = 95
unlikely_to_pay = False   # mis: usaha bangkrut tapi baru telat 10 hari
bangkrut = False
restrukturisasi_distressed = False  # potong pokok karena debitur kesulitan

is_default = (
    dpd > 90
    or unlikely_to_pay
    or bangkrut
    or restrukturisasi_distressed
)

print(f"DPD                          : {dpd} hari")
print(f"Unlikely to pay              : {unlikely_to_pay}")
print(f"Bangkrut                     : {bangkrut}")
print(f"Restrukturisasi distressed   : {restrukturisasi_distressed}")
print(f"DEFAULT (Basel)?             : {'YA' if is_default else 'TIDAK'}")
print()
print("Coba 1: dpd=10, unlikely_to_pay=True  -> default? (jawaban: YA!)")
print("Coba 2: dpd=120 tapi debitur bayar penuh besok -> tetap YA.")
print("Default = status regulasi, BUKAN vonis akhir. Debitur bisa sembuh (curing).")`;

  const lab2Code = `# Lab 2: Right-censoring — jebakan menghitung default rate
# 1000 kredit diamati 12 bulan. Hitung default rate yang BENAR vs NAIF.
import random
random.seed(42)

n = 1000
default_dalam_window = 0
censored = 0   # lunas lebih awal / data belum cukup umur

for i in range(n):
    umur = random.choice([6, 12, 12, 12, 18])  # bulan observasi tersedia
    if umur < 12:
        censored += 1
        continue
    # peluang default 3% dalam 12 bulan
    if random.random() < 0.03:
        default_dalam_window += 1

rate_benar = default_dalam_window / (n - censored) * 100
rate_naif = default_dalam_window / n * 100

print(f"Total kredit        : {n}")
print(f"Censored (umur<12)  : {censored}")
print(f"Default dlm window  : {default_dalam_window}")
print(f"Default rate BENAR  : {default_dalam_window}/{n-censored} = {rate_benar:.2f}%")
print(f"Default rate NAIF   : {default_dalam_window}/{n} = {rate_naif:.2f}%  <- UNDERESTIMATE!")
print()
print("Pelajaran: penyebut harus yang 'berkesempatan' default penuh 12 bulan.")
print("Censored ikut di penyebut = default rate terlihat lebih kecil = PD underestimate.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR5 — Credit Risk Analyst</span>
        <h1 className="display-title">Kapan Nasabah Dinyatakan "Gagal"?<br />Definisi Default &amp; Jendela Waktu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Telat 95 Hari tapi Punya Uang</a></li>
          <li><a href="#definisi">Definisi Default Basel: Dua Pintu Menuju "Gagal"</a></li>
          <li><a href="#window">Observation vs Performance Window</a></li>
          <li><a href="#censor">Right-Censoring: Data yang Belum Bercerita</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mesin Definisi Default</a></li>
          <li><a href="#lab2">🔬 Lab 2: Jebakan Right-Censoring</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Default atau Belum?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Default Rate yang Menyesatkan</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyebutkan definisi default Basel (DPD &gt;90 hari ATAU unlikely-to-pay) dan menerapkannya pada kasus.</li>
          <li>Membedakan observation window vs performance window dalam pembangunan model PD.</li>
          <li>Menjelaskan right-censoring dan menghitung default rate yang benar (tidak underestimate).</li>
          <li>Mengidentifikasi kapan definisi default boleh disesuaikan (misal: DPD 90 vs 180 untuk segmen tertentu).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Telat 95 Hari tapi Punya Uang</h2>
      <div className="story">
        <p>Pak Darmawan, pengusaha furniture Jepara, telat bayar cicilan <strong>95 hari</strong>. Menurut buku: <strong>default</strong> (DPD &gt;90). Tim remedial bersiap melelang agunannya.</p>
        <p>Tapi analis Rina menemukan fakta aneh: rekening Pak Darmawan penuh — <strong>Rp 800 juta menganggur</strong>. Ia tidak bangkrut. Ia hanya... <em>kekeuh</em> tidak mau bayar karena bersengketa dengan bank soal biaya provisi. Uangnya ada, kemauannya tidak.</p>
        <p>Di sisi lain, Bu Ratna — pemilik katering — baru telat <strong>12 hari</strong>, tapi dapur cateringnya <strong>kebakaran habis</strong> dan tidak berasuransi. Uang tidak ada, usaha tidak ada.</p>
        <p><strong>Twist-nya:</strong> menurut definisi default Basel, <strong>keduanya default</strong> — Pak Darmawan lewat pintu "DPD &gt;90", Bu Ratna lewat pintu "unlikely to pay". Definisi default ternyata punya <strong>dua pintu</strong>, dan pintu kedua tidak peduli berapa hari telatnya. Lesson ini membahas mengapa definisi ini adalah fondasi seluruh model PD.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="definisi">Definisi Default Basel: Dua Pintu Menuju "Gagal"</h2>
      <p><strong>Definisi.</strong> Basel (diadopsi OJK) menyatakan debitur <strong>default</strong> jika SALAH SATU terpenuhi:</p>
      <ul>
        <li><strong>Pintu 1 — Kuantitatif:</strong> DPD &gt; 90 hari untuk kewajiban material. (Untuk retail tertentu, regulator membolehkan 180 hari — misal KPR di beberapa yurisdiksi.)</li>
        <li><strong>Pintu 2 — Kualitatif (<em>unlikely to pay</em>):</strong> bank menilai debitur <strong>tidak mungkin membayar penuh</strong> tanpa eksekusi agunan — misal: bangkrut, usaha tutup, restrukturisasi distressed (potong pokok karena kesulitan).</li>
      </ul>
      <p><strong>Kepribadian:</strong> definisi default seperti <strong>definisi "sakit" di RS</strong> — ada yang diukur angka (demam &gt;38°C = pintu kuantitatif), ada yang dinilai dokter (pucat, lemas = pintu kualitatif). Keduanya sah. Bank yang hanya mengandalkan pintu DPD akan <strong>terlambat</strong> mengenali Bu Ratna yang dapurnya kebakaran.</p>

      <PlotlyChart
        data={defaultRateData}
        title="Ilustrasi Komposisi Pemicu Default (portofolio bank)"
        layout={{ xaxis: { title: "Pemicu default" }, yaxis: { title: "% dari total default" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = porsi kasus default yang terpicu oleh masing-masing pintu.</p>
        <p><strong>Interpretasi:</strong> 62% default terdeteksi via DPD 90+ — pintu kuantitatif memang dominan. Tapi <strong>38% datang dari pintu kualitatif</strong> (unlikely-to-pay, bangkrut, restrukturisasi distressed). Bank yang definisi default-nya "cuma DPD 90" akan <strong>melewatkan sepertiga kasus</strong> — PD-nya underestimate, modalnya kurang.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> definisi default adalah <strong>"target"</strong> yang dipelajari semua model PD (CR7, CR10). Ganti definisinya → ganti targetnya → ganti seluruh modelnya. Itulah mengapa bank <strong>mendokumentasikan definisi default-nya</strong> dan tidak boleh diam-diam mengubahnya (regulator mengawasi — mengubah definisi = mengubah modal).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Default = tamat. Debitur tidak bisa kembali."</strong></p>
        <p><strong>Yang benar:</strong> default adalah <strong>status regulasi</strong>, bukan vonis mati. Debitur bisa <strong>sembuh (<em>curing</em>)</strong> — bayar lunas tunggakannya dan kembali performing (dengan masa percobaan). Pak Darmawan yang akhirnya bayar setelah sengketanya selesai = default yang sembuh. Model yang baik memperhitungkan peluang curing (mempengaruhi LGD — CR12).</p>
      </div>

      <h2 id="window">Observation vs Performance Window</h2>
      <p><strong>Definisi.</strong> Untuk membangun model PD, kita butuh dua jendela waktu yang <strong>tidak boleh tumpang tindih sembarangan</strong>:</p>
      <ul>
        <li><strong>Observation window</strong> — periode di mana kita <strong>mengamati karakteristik</strong> debitur (umur, penghasilan, skor, mutasi). "Foto" kondisi debitur.</li>
        <li><strong>Performance window</strong> — periode <strong>setelahnya</strong> di mana kita melihat <strong>apakah ia default</strong> (biasanya 12 bulan). "Film" kelanjutannya.</li>
      </ul>
      <p><strong>Aturan emas:</strong> karakteristik diambil dari <em>sebelum</em> performance window — <strong>tidak boleh mengintip masa depan</strong> (<em>look-ahead bias</em>). Memakai data "setelah default" untuk memprediksi default = curang.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Bank membangun model PD Januari 2026.</p>
        <p><strong>Langkah 1</strong> — observation window: karakteristik per <strong>Januari 2024</strong> (skor, DPD saat itu, umur kredit).<br />
        <strong>Langkah 2</strong> — performance window: apakah default selama <strong>Jan 2024 – Jan 2025</strong> (12 bulan).<br />
        <strong>Langkah 3</strong> — label: 1 = default dalam window, 0 = tidak.<br />
        <strong>Langkah 4</strong> — latih model: karakteristik (Jan 2024) → label (setahun kemudian).</p>
        <p>Kenapa tidak pakai data 2025? Karena model dipakai untuk memprediksi <strong>masa depan yang belum terjadi</strong> — ia harus belajar dari pola "dulu → kemudian", bukan "kemudian → kemudian".</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Makin panjang performance window, makin bagus modelnya."</strong></p>
        <p><strong>Yang benar:</strong> 12 bulan adalah standar Basel karena <strong>selaras dengan PD 1-tahun</strong> yang dipakai modal. Window 3 tahun mencampuradukkan siklus ekonomi (tahun krisis + tahun boom dalam satu label) — modelnya jadi "rata-rata yang tidak mewakili apapun". Untuk lifetime PD (PSAK 71), pendekatannya beda: rantai PD 1-tahun per tahun (CR10/CR14), bukan window 5 tahun sekaligus.</p>
      </div>

      <h2 id="censor">Right-Censoring: Data yang Belum Bercerita</h2>
      <p><strong>Definisi.</strong> <em>Right-censoring</em> = observasi yang <strong>belum lengkap</strong> di sisi kanan (waktu): kredit yang lunas lebih awal, atau yang umurnya belum mencapai 12 bulan saat data ditarik.</p>
      <p><strong>Mengapa berbahaya:</strong> kredit yang censored <strong>belum berkesempatan penuh</strong> untuk default 12 bulan. Kalau ikut dihitung di penyebut default rate → default rate <strong>kelihatan lebih kecil</strong> dari seharusnya → PD underestimate → modal kurang. Ini jebakan klasik analis junior.</p>
      <Tex math={String.raw`\text{Default Rate} = \frac{\text{Default dalam 12 bln}}{\text{Kredit dengan observasi penuh 12 bln (tidak censored)}}`} block />
      <p><strong>Artinya:</strong> penyebut HANYA kredit yang benar-benar diamati penuh 12 bulan. Yang censored dikeluarkan (atau ditangani dengan metode survival analysis — CR lanjutan).</p>

      <PlotlyChart
        data={censoringData}
        title="Empat Nasib Kredit dalam Window 12 Bulan (ilustrasi)"
        layout={{ xaxis: { title: "Kredit" }, yaxis: { title: "Bulan observasi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = berapa lama kredit teramati. Warna merah = default, hijau/kuning = censored.</p>
        <p><strong>Interpretasi:</strong> hanya A dan D yang "berkesempatan penuh". B lunas di bulan 10 (tidak sempat default di bulan 11–12 — censored). C masih berjalan (belum 12 bulan — censored). <strong>D default di bulan 14 = TIDAK dihitung</strong> (di luar window 12 bulan!). Disiplin window ini yang membedakan analis senior dari junior.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> right-censoring seperti <strong>menilai film dari 30 menit pertama</strong> — yang keluar bioskop di menit 30 (lunas awal) tidak bisa dibilang "tidak nangis di ending". Keluarkan mereka dari penilaian, atau akui ketidakpastianmu. Dalam modeling, ketidakjujuran soal censoring = PD palsu.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Definisi adalah Senjata (dan Perisai)</h3>
      <p>Definisi default terlihat seperti urusan kamus. Sesungguhnya ia adalah <strong>parameter paling politis</strong> dalam risk modeling: setiap model PD (CR7, CR10) "belajar" dari label default historis. Ubah definisinya — misal longgarkan ambang DPD dari 90 ke 120 hari — dan <strong>seluruh model berubah</strong>: PD turun, ECL turun, kebutuhan modal turun, laba naik. Itulah mengapa regulator mengunci definisi ini: bank tidak boleh diam-diam "mempercantik" definisi untuk menghemat modal. Definisi default = <strong>konstitusi</strong> yang melindungi kejujuran seluruh bangunan risiko.</p>
      <p>Intuisi kedua: <strong>ambang materialitas</strong>. Basel membolehkan bank menetapkan ambang "kewajiban material" — tunggakan receh (misal Rp 50 ribu karena biaya admin) tidak otomatis memicu default meski DPD &gt; 90. Tanpa ambang ini, jutaan nasabah ritel akan "default" karena selisih administrasi — noise yang menenggelamkan sinyal. Analis harus tahu ambang materialitas banknya: ia menentukan seberapa sensitif radar default-mu.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dua pintu default (kuantitatif &amp; kualitatif) mencerminkan dua kegagalan yang berbeda: pintu DPD menangkap <strong>ketidakmampuan yang terlihat</strong> (telat bayar), pintu unlikely-to-pay menangkap <strong>ketidakmampuan yang belum terlihat</strong> (bangkrut diam-diam, usaha tutup). Bank yang hanya memakai pintu DPD seperti dokter yang hanya mendiagnosis dari demam — melewatkan pasien yang sakit tanpa demam.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Mesin Definisi Default</h2>
      <p>Uji dua pintu default Basel pada berbagai skenario debitur.</p>
      <PyodideLab
        title="Lab 1 — Simulator Definisi Default Basel"
        hint="Coba: (1) dpd=10, unlikely_to_pay=True — default? (2) dpd=200, semua False kecuali... ya tetap default. (3) restrukturisasi_distressed=True, dpd=0 — default? Renungkan mengapa."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Jebakan Right-Censoring</h2>
      <p>Hitung default rate dengan benar vs naif — lihat selisihnya.</p>
      <PyodideLab
        title="Lab 2 — Default Rate: Benar vs Naif"
        hint="Jalankan berulang dengan seed berbeda. Perhatikan: metode naif SELALU underestimate. Bayangkan underestimate 0,5% ini dikali Rp 50 T portofolio — berapa modal yang 'hilang'?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Default atau Belum?</h2>

      <div className="decision-card">
        <h3>1. DPD &gt;90 hari, kewajiban material → <strong>DEFAULT (pintu kuantitatif)</strong></h3>
        <p><strong>Kondisi:</strong> telat &gt;90 hari, jumlahnya material (bukan Rp 50 ribu biaya admin).</p>
        <p><strong>Aksi:</strong> tandai default → Stage 3 (PSAK 71) → CKPN penuh → alihkan ke remedial. Tidak perlu menunggu "niat" debitur.</p>
      </div>

      <div className="decision-card">
        <h3>2. DPD kecil tapi usaha bangkrut / tutup → <strong>DEFAULT (pintu kualitatif)</strong></h3>
        <p><strong>Kondisi:</strong> unlikely-to-pay: bangkrut, usaha tutup, pemilik kabur.</p>
        <p><strong>Kenapa:</strong> menunggu DPD 90 = menunggu 3 bulan sambil berharap. Bank yang disiplin langsung tandai default — CKPN dibentuk lebih awal (dan jujur).</p>
        <p><strong>Contoh nyata:</strong> Bu Ratna (dapur kebakaran, tanpa asuransi) — default di hari ke-12, bukan hari ke-91.</p>
      </div>

      <div className="decision-card">
        <h3>3. Restrukturisasi dengan potong pokok karena kesulitan → <strong>DEFAULT</strong></h3>
        <p><strong>Kondisi:</strong> <em>distressed restructuring</em> — bank mengalah karena debitur tidak mampu.</p>
        <p><strong>Kenapa:</strong> Basel tegas: konsesi akibat kesulitan = default. (Beda dengan restrukturisasi komersial biasa — misal negosiasi ulang suku bunga saat pasar turun.)</p>
      </div>

      <div className="decision-card">
        <h3>4. Telat bayar karena sengketa administratif, dana ada → <strong>tetap DEFAULT jika DPD &gt;90</strong></h3>
        <p><strong>Kondisi:</strong> Pak Darmawan — mampu tapi tidak mau (sengketa).</p>
        <p><strong>Kenapa:</strong> pintu kuantitatif tidak peduli <em>alasan</em>. Status default dicatat; kalau sengketa selesai dan ia bayar → <strong>curing</strong> (kembali performing setelah masa percobaan). Disiplin definisi &gt; drama individual.</p>
      </div>

      <div className="decision-card">
        <h3>5. Membangun model PD → <strong>observation SEBELUM performance, 12 bulan, tangani censoring</strong></h3>
        <p><strong>Kondisi:</strong> menyiapkan dataset modeling.</p>
        <p><strong>Aturan:</strong> karakteristik dari sebelum window (anti look-ahead); label dari 12 bulan setelahnya; censored dikeluarkan dari penyebut. Dokumentasikan definisi default yang dipakai — ia adalah "kontrak" modelmu.</p>
      </div>

            <div className="decision-card">
        <h3>6. Debitur protes "saya tidak default, kan sudah restrukturisasi" → <strong>jelaskan distressed restructuring</strong></h3>
        <p><strong>Kondisi:</strong> debitur korporasi direstrukturisasi dengan haircut 30% pokok. Ia (dan RM-nya) keberatan dicap "default" di SLIK — "reputasi kami hancur!"</p>
        <p><strong>Aksi:</strong> jelaskan dengan tenang: (1) haircut karena kesulitan keuangan = kerugian nyata bagi bank — itulah definisi default pintu kualitatif, berlaku global; (2) status ini <strong>melindungi debitur juga</strong> — karena memaksa bank membentuk cadangan yang cukup, sehingga bank tidak perlu menekan debitur secara membabi buta; (3) ada jalan pulang: curing setelah masa percobaan. Jangan negosiasi definisi — <strong>definisi bukan barang dagangan</strong>. Yang bisa dinegosiasi: struktur restrukturisasi yang mempercepat curing.</p>
        <p><strong>Contoh nyata:</strong> dalam restrukturisasi korporasi besar, perdebatan status default vs "lancar yang direstrukturisasi" selalu muncul — dan bank yang tegas sejak awal justru lebih dipercaya OJK/auditor daripada yang "baik hati" lalu ketahuan.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Dua pintu default:</strong> DPD &gt;90 ATAU unlikely-to-pay. Hafal keduanya.</li>
          <li><strong>Default = status, bukan vonis.</strong> Bisa sembuh (curing).</li>
          <li><strong>Observation → performance.</strong> Jangan intip masa depan.</li>
          <li><strong>Censored keluar dari penyebut.</strong> Kalau tidak, PD-mu bohong.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Keputusan Default: Pohon Keputusan 6 Cabang</h3>
      <p>Ragu apakah suatu kasus = default? Ikuti pohon ini — berurutan, berhenti di cabang pertama yang 'ya'.</p>
      <ol>
        <li><strong>DPD &gt;90 hari &amp; material?</strong> — Ya → DEFAULT (pintu kuantitatif). Tidak perlu analisis lebih lanjut — kecuali di bawah ambang materialitas.</li>
        <li><strong>Di bawah ambang materialitas?</strong> — Ya → bukan default (noise administratif). Catat dan monitor — jika membesar, kembali ke cabang 1.</li>
        <li><strong>Unlikely to pay?</strong> — Bangkrut, usaha tutup, tidak ada prospek bayar tanpa eksekusi agunan → DEFAULT (pintu kualitatif), berapapun DPD-nya.</li>
        <li><strong>Restrukturisasi distressed?</strong> — Ada haircut/pengurangan NPV karena kesulitan debitur → DEFAULT. Penjadwalan biasa tanpa kerugian = bukan.</li>
        <li><strong>Sengketa administratif murni?</strong> — Dana ada, hanya sengketa (biaya, denda) → bukan default — tetapi wajib diselesaikan &amp; didokumentasikan. Jangan biarkan menjadi DPD &gt;90.</li>
        <li><strong>Masih ragu?</strong> — Eskalasi ke komite risiko — JANGAN putuskan sendiri. Definisi default bukan barang dagangan; keraguan = sinyal untuk kolektif, bukan untuk kompromi.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tempel pohon ini di dinding tim remedial. Konsistensi definisi = fondasi seluruh model PD bank.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Nasabah telat 95 hari karena sistem bank error (autodebet gagal) — default?</summary>
        <p>Secara <strong>definisi</strong>: DPD &gt;90 + material = default (pintu kuantitatif tidak mengenal 'alasan'). Tetapi bank yang waras akan: (1) catat sebagai default sesuai definisi (konsistensi!), (2) <strong>segera perbaiki</strong> dan proses curing kilat, (3) perbaiki sistemnya. Definisi tidak dinegosiasi; penanganannya yang manusiawi.</p>
      </details>
      <details className="worked">
        <summary>❓ Mengapa ambang 90 hari, bukan 60 atau 120?</summary>
        <p>90 hari = <strong>kompromi empiris global</strong>: di bawah 90, sebagian besar keterlambatan masih 'sembuh' (lupa, administratif); di atas 90, pola gagal bayar menjadi struktural. Basel mengadopsinya sebagai standar agar <strong>antarbank dan antarnegara bisa dibandingkan</strong>. Bukan angka mistis — melainkan konvensi yang didukung data.</p>
      </details>
      <details className="worked">
        <summary>❓ Default di satu fasilitas = default di semua fasilitas debitur yang sama?</summary>
        <p>Umumnya <strong>ya</strong> (cross-default): jika debitur default di KTA-nya, KPR-nya pun dinilai ulang — karena <strong>ketidakmampuan membayar adalah kondisi debitur</strong>, bukan kondisi fasilitas. Pengecualian: fasilitas dengan sumber pembayaran terpisah yang terbukti independen (jarang).</p>
      </details>
      <details className="worked">
        <summary>❓ Apakah 'default' tercatat permanen di SLIK?</summary>
        <p>Tidak permanen — tetapi <strong>riwayatnya tercatat</strong> selama periode retensi SLIK (umumnya 5 tahun ke belakang terlihat). Debitur yang curing dan lancar 2–3 tahun = riwayat membaik. SLIK adalah <strong>memori</strong>, bukan vonis abadi — dan itulah insentif untuk sembuh.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Definisi default Basel diadopsi OJK — tetapi penerapannya di Indonesia punya warna lokal yang wajib dipahami.</p>

      <h3>SLIK: Buku Rapor Nasional</h3>
      <p>Sejak 2018, <strong>SLIK OJK</strong> (Sistem Layanan Informasi Keuangan) menggantikan BI Checking/SID sebagai pusat data kredit nasional. Setiap bank dan lembaga keuangan <strong>wajib melaporkan</strong> status kredit debiturnya — termasuk status default/kolektibilitas — ke SLIK setiap bulan. Artinya: definisi default bankmu bukan urusan internal; ia <strong>dipublikasikan ke seluruh sistem keuangan</strong> via SLIK.</p>
      <p>Konsekuensinya dua arah: (1) bank yang definisi default-nya longgar akan terlihat "terlalu bersih" dibanding bank lain — OJK bisa membandingkan dan bertanya; (2) debitur yang default di satu bank <strong>otomatis tercatat</strong> dan mempersulitnya meminjam di bank lain. SLIK membuat definisi default menjadi <strong>kontrak sosial</strong> antarbank — kejujuranmu melindungi bank lain, dan sebaliknya.</p>

      <h3>Restrukturisasi Distressed = Default?</h3>
      <p>Kasus klasik Indonesia: debitur korporasi direstrukturisasi dengan <strong>potongan pokok (haircut)</strong> karena kesulitan keuangan. Menurut Basel: <strong>ya, ini default</strong> (distressed restructuring — pintu kualitatif), meski DPD-nya 0 setelah restrukturisasi. Banyak debitur (dan RM!) protes: "kan sudah bayar sesuai jadwal baru, kok dibilang default?"</p>
      <p>Jawaban analis: karena bank <strong>merelakan sebagian tagihannya</strong> akibat kesulitan debitur — itu kerugian kredit yang nyata, bukan penjadwalan administratif. Menyembunyikannya = menyembunyikan kerugian. Kasus-kasus restrukturisasi korporasi besar Indonesia (lihat CR17b) hampir selalu melibatkan penilaian ini — dan perdebatan "default atau tidak" bisa menentukan ratusan miliar CKPN.</p>

      <h3>Curing: Jalan Pulang dari Default</h3>
      <p>POJK dan praktik Indonesia mengenal <strong>curing</strong>: debitur yang default bisa kembali ke status performing setelah membayar tunggakan dan melewati <strong>masa percobaan</strong> (umumnya 3–12 bulan pembayaran lancar, tergantung kebijakan bank dan ketentuan). Ini penting karena: (1) memberi insentif debitur untuk sembuh, (2) mempengaruhi LGD (recovery via curing = LGD rendah). Analis yang paham curing tidak menulis-off debitur secara mental — ia menghitung <strong>peluang sembuh</strong> sebagai bagian valuasi.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: default atau bukan? (klik untuk buka)</summary>
        <p>Empat kasus, tentukan status default (definisi Basel/OJK):</p>
        <p><strong>Kasus A</strong> — KPR telat 95 hari, outstanding Rp 400 jt. → <strong>DEFAULT</strong> (pintu kuantitatif: DPD &gt; 90, material).<br />
        <strong>Kasus B</strong> — Kartu kredit telat 100 hari, tunggakan Rp 80 ribu (biaya admin yang disengketakan), limit Rp 20 jt. → <strong>Bukan default</strong> — di bawah ambang materialitas bank (misal Rp 1 jt); sengketa administratif.<br />
        <strong>Kasus C</strong> — Perusahaan DPD 0, tetapi pabriknya kebakaran total, asuransi tidak cukup, direksi menyatakan tidak sanggup bayar. → <strong>DEFAULT</strong> (pintu kualitatif: unlikely to pay).<br />
        <strong>Kasus D</strong> — KMK direstrukturisasi: tenor +2 tahun, bunga turun, <strong>pokok dipotong 30%</strong> karena usaha sekarat. → <strong>DEFAULT</strong> (distressed restructuring).</p>
        <p><strong>Pelajaran:</strong> DPD hanyalah satu pintu. Tiga dari empat kasus di atas ditentukan oleh <strong>penilaian</strong>, bukan hitungan hari — itulah mengapa definisi default butuh analis, bukan sekadar sistem.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Default = bangkrut = tamat. Tidak ada jalan kembali."</strong></p>
        <p><strong>Yang benar:</strong> default adalah <strong>status regulasi</strong>, bukan vonis mati. Banyak debitur default yang sembuh (curing) dan kembali menjadi nasabah baik — bahkan ada yang akhirnya naik kelas. Bank yang memperlakukan setiap default sebagai "sampah" akan menyia-nyiakan recovery; bank yang paham curing menghitung peluang sembuh sebagai aset (mempengaruhi LGD dan strategi collection).</p>
      </div>

      <h2 id="case">📋 Mini-Case: Default Rate yang Menyesatkan</h2>
      <div className="callout">
        <p>Tim modeling Bank Nusantara melaporkan: <strong>"Default rate KUR 2025 hanya 1,2% — portofolio sangat sehat!"</strong> Direksi ingin ekspansi agresif. Kamu diminta verifikasi. Temuanmu:</p>
        <ul>
          <li>Perhitungan memakai <strong>semua</strong> 50.000 rekening KUR yang dicairkan Jan–Des 2025 (data ditarik Jan 2026).</li>
          <li>40% di antaranya dicairkan <strong>Jul–Des 2025</strong> — umurnya belum 12 bulan (censored!).</li>
          <li>Definisi default yang dipakai: <strong>DPD &gt;180 hari</strong> (bukan 90) — "karena KUR itu program pemerintah".</li>
          <li>Kasus unlikely-to-pay <strong>tidak dicatat</strong> sebagai default.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> ada berapa masalah metodologis? Estimasi arah biasnya dan rekomendasi perbaikanmu.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tiga masalah, semuanya menekan default rate ke bawah:</strong></p>
          <p>(1) <strong>Censoring diabaikan</strong> — 40% rekening belum berumur 12 bulan ikut jadi penyebut. Koreksi kasar: penyebut benar ≈ 30.000, bukan 50.000 → default rate naik ~1,67× lipat.<br />
          (2) <strong>Definisi DPD 180</strong> — menyimpang dari Basel 90 tanpa justifikasi kuat. Kredit yang default di hari 91–180 "hilang" dari hitungan.<br />
          (3) <strong>Pintu kualitatif diabaikan</strong> — sepertiga kasus default (pelajaran chart di atas) tidak tercatat.</p>
          <p><strong>Rekomendasi:</strong> hitung ulang dengan window 12 bulan penuh + definisi Basel 90 hari + catat unlikely-to-pay; sajikan <strong>rentang</strong> (1,2% naif vs ~2,5–3% terkoreksi) ke direksi. Ekspansi agresif berdasarkan angka 1,2% = membangun di atas pasir.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Debitur telat 12 hari tapi pabriknya kebakaran total tanpa asuransi. Status default (Basel)?"
        options={[
          "Belum default — DPD belum 90 hari",
          "Default — pintu kualitatif (unlikely to pay), DPD tidak relevan",
          "Tunggu 90 hari dulu baru putuskan",
          "Hanya default jika ia mengaku bangkrut",
        ]}
        correct={1}
        explanation="Benar: default via unlikely-to-pay. Pintu kualitatif tidak menunggu DPD 90 — bank yang disiplin langsung mencadangkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa observation window harus SEBELUM performance window?"
        options={[
          "Supaya datanya lebih banyak",
          "Mencegah look-ahead bias — model harus belajar dari 'dulu → kemudian', seperti saat dipakai memprediksi masa depan",
          "Aturan OJK semata",
          "Supaya komputasi lebih cepat",
        ]}
        correct={1}
        explanation="Benar: anti look-ahead bias. Model yang 'mengintip' data setelah default = curang — performanya di atas kertas bagus, di dunia nyata hancur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 1000 kredit, 200 censored (umur <12 bln), 24 default dalam window. Default rate yang benar?"
        options={[
          "24/1000 = 2,4%",
          "24/800 = 3,0% — censored dikeluarkan dari penyebut",
          "24/200 = 12%",
          "(24+200)/1000 = 22,4%",
        ]}
        correct={1}
        explanation="Benar: 3,0%. Yang censored belum berkesempatan penuh 12 bulan — memasukkannya ke penyebut = underestimate (2,4% vs 3,0% — selisih 25%!)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Debitur default (DPD 120) lalu 6 bulan kemudian melunasi semua tunggakan dan bayar lancar 12 bulan. Apa yang terjadi?"
        options={[
          "Tetap default selamanya — tidak bisa kembali",
          "Bisa curing — kembali performing setelah masa percobaan, sesuai kebijakan bank",
          "Otomatis hapus dari sistem",
          "Default-nya dibatalkan seolah tidak pernah terjadi",
        ]}
        correct={1}
        explanation="Benar: curing. Default = status, bukan vonis mati. Riwayat default-nya tetap tercatat (mempengaruhi PD model), tapi statusnya bisa pulih."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bank mengubah definisi default internal dari DPD 90 menjadi DPD 180 'agar NPL turun'. Masalahnya?"
        options={[
          "Tidak masalah — definisi internal bebas",
          "Menyimpang dari Basel tanpa justifikasi = PD underestimate, modal kurang, dan akan ditindak OJK/auditor; NPL turun semu",
          "Malah bagus untuk laba",
          "Hanya masalah pelaporan",
        ]}
        correct={1}
        explanation="Benar: definisi default adalah 'kontrak' model dan modal. Mengubahnya diam-diam = memalsukan risiko. Perubahan definisi harus didokumentasikan, dijustifikasi, dan disetujui — bukan alat kosmetik NPL."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Nasabah telat 100 hari untuk tunggakan Rp 80 ribu (sengketa biaya admin), limit kartu Rp 20 jt, riwayat selalu lancar. Default?"
        options={[
          "Ya — DPD > 90 hari otomatis default tanpa kecuali",
          "Bukan default — di bawah ambang materialitas dan bersifat sengketa administratif, bukan ketidakmampuan bayar",
          "Ya — semua tunggakan di atas 90 hari adalah default",
          "Tergantung mood analis",
        ]}
        correct={1}
        explanation="Benar: ambang materialitas menyaring noise administratif. Default mengukur ketidakmampuan/ketidakmauan bayar yang material — bukan selisih Rp 80 ribu yang disengketakan. Tanpa ambang ini, jutaan nasabah ritel 'default' karena administrasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Debitur default 2 tahun lalu, kini telah membayar lunas tunggakan + 12 bulan cicilan lancar berturut-turut. Status yang tepat?"
        options={[
          "Tetap default selamanya — sekali default, selamanya default",
          "Bisa curing kembali ke performing setelah masa percobaan terpenuhi — default adalah status, bukan vonis mati",
          "Otomatis hapus dari SLIK",
          "Naik menjadi debitur prioritas",
        ]}
        correct={1}
        explanation="Benar: curing. Setelah melunasi tunggakan dan melewati masa percobaan (umumnya 3–12 bulan lancar), debitur kembali performing. Inilah insentif untuk sembuh — dan peluang sembuh ini ikut dihitung dalam LGD."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Default (Basel)</strong>: DPD &gt;90 hari ATAU unlikely-to-pay — dua pintu, keduanya sah.</li>
          <li><strong>Observation window</strong> (karakteristik, "dulu") → <strong>performance window</strong> 12 bulan (label default, "kemudian"). Jangan intip masa depan.</li>
          <li><strong>Right-censoring</strong>: kredit belum berumur penuh dikeluarkan dari penyebut default rate.</li>
          <li><strong>Default = status regulasi</strong>, bisa sembuh (curing) — tapi riwayatnya tetap tercatat.</li>
          <li><strong>Definisi default = target seluruh model PD</strong> — mengubahnya = mengubah segalanya. Dokumentasikan.</li>
          <li>Kapan TIDAK pakai DPD 90 mentah-mentah: segmen dengan justifikasi kuat (misal KPR 180 hari di yurisdiksi tertentu) — tapi harus eksplisit dan disetujui.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr4b-ifrs9-psak71" className="btn btn-secondary btn-sm">← CR4b</Link>
        <Link href="/learn/cr6-analisis-portofolio" className="btn btn-primary btn-sm">Next: CR6 →</Link>
      </div>
    </div>
  );
}
