"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR1Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const channelData = [
    {
      x: ["Kartu kredit", "E-wallet", "Transfer bank", "COD"],
      y: [3.8, 0.45, 0.24, 0.1],
      type: "bar",
      marker: { color: ["#e05252", "#e8a838", "#2a7de1", "#7bc96f"] },
      text: ["3,80%", "0,45%", "0,24%", "0,10%"],
      textposition: "outside",
    },
  ];

  const lossShareData = [
    {
      x: ["Card fraud", "ATO", "Application", "Synthetic ID", "First-party", "Merchant", "Mule/Insider", "APP scam"],
      y: [34, 18, 9, 12, 15, 4, 5, 3],
      type: "bar",
      marker: { color: "#e05252" },
    },
  ];

  const lab1Code = `# Data sintetis marketplace Indonesia (1 bulan)
total_trx   = 10000          # total transaksi
fraud_trx   = 120            # transaksi fraud terkonfirmasi
avg_fraud   = 875_000        # rata-rata nilai transaksi fraud (Rp)
avg_normal  = 320_000        # rata-rata nilai transaksi normal (Rp)

fraud_rate = fraud_trx / total_trx
loss       = fraud_trx * avg_fraud
omzet      = total_trx * avg_normal

print(f"Fraud rate      : {fraud_rate*100:.2f}%  ({fraud_rate*10000:.0f} bps)")
print(f"Kerugian fraud  : Rp {loss/1e9:.2f} M")
print(f"Loss / omzet    : {loss/omzet*100:.2f}%")
print()
print("COBA UBAH: avg_fraud 875_000 -> 350_000.")
print("Fraud rate TETAP, tapi kerugian anjlok. Pelajaran: rate saja tidak cukup,")
print("nilai (severity) menentukan seberapa sakitnya.")`;

  const lab2Code = `# Konsentrasi fraud per kanal pembayaran (data sintetis)
kanal = {
    "Kartu kredit":  (2500, 95),
    "E-wallet":      (4000, 18),
    "Transfer bank":  (2500, 6),
    "COD":           (1000, 1),
}
print(f"{'Kanal':15s} {'Fraud rate':>10s}   Kontribusi thd total fraud")
for k, (t, f) in kanal.items():
    share = f / sum(v[1] for v in kanal.values()) * 100
    print(f"{k:15s} {f/t*100:9.2f}%   {share:5.1f}% dari semua fraud")
print()
print("COBA UBAH: pindahkan 1 kasus dari 'Transfer bank' ke 'E-wallet'.")
print("Lihat: share berubah, tapi rate kartu kredit tetap juara.")
print("Prioritas pertahanan = rate TINGGI x volume BESAR = kartu kredit.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">FR1 — Fraud / ML Analytics</span>
        <h1 className="display-title">9 Wajah Fraud:<br />Kenali Musuhmu Sebelum Membangun Senjata</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Chargeback Rp2,3 Miliar dalam 30 Hari</a></li>
          <li><a href="#taksonomi">Taksonomi: 9 Tipe Fraud yang Wajib Dihafal</a></li>
          <li><a href="#ekonomi">Ekonomi Fraud: Rumus Kerugian yang Menentukan Prioritas</a></li>
          <li><a href="#ato">ATO vs Synthetic Identity: Akun Asli yang Dibajak vs Manusia yang Tak Pernah Ada</a></li>
          <li><a href="#firstparty">First-Party Fraud: Saat Pelakunya Justru Pelangganmu</a></li>
          <li><a href="#mule">Mule Account &amp; Insider: Rantai Terlemah Ada di Dalam</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Fraud Rate &amp; Kerugian Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: Di Kanal Mana Fraud Paling Pekat?</a></li>
          <li><a href="#worked">📐 Worked Example: Expected Loss &amp; Breakeven Pertahanan</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Membaca Fraud seperti Epidemiolog</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Fraud Apa yang Diperangi Duluan</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Dilema Prioritas</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Jaringan Mule &amp; Judol 2024–2025</a></li>

          <li><a href="#case">📋 Mini-Case: Prioritas 90 Hari Tim Fraud TokoMaju</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Lanskap Fraud</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyebutkan 9 tipe fraud utama beserta <strong>mekanisme serangannya</strong> — bukan sekadar namanya.</li>
          <li>Menghitung fraud rate, loss rate, dan expected loss dari data transaksi mentah.</li>
          <li>Membedakan ATO, synthetic identity, first-party, dan mule account dari pola jejak datanya.</li>
          <li>Menentukan prioritas pertahanan (kanal/tipe mana duluan) berdasarkan <strong>rate × severity × volume</strong>.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Chargeback Rp2,3 Miliar dalam 30 Hari</h2>
      <div className="story">
        <p>Marketplace &ldquo;TokoMaju&rdquo; sedang naik daun. September 2026: GMV pecah rekor. Lalu Oktober tiba — email dari bank: <strong>chargeback Rp2,3 miliar</strong> dalam 30 hari. Kartu-kartu curian dipakai borong iPhone dan emas batangan, barang dikirim ke alamat kos-kosan, lalu pemilik kartu asli komplain.</p>
        <p>Tim IT sigap: mereka pasang verifikasi OTP untuk semua pembayaran kartu. Chargeback turun… lalu <strong>naik lagi</strong>, kali ini lewat akun-akun yang lolos KYC dengan KTP asli. KTP-nya asli, orangnya ada — tapi &ldquo;orang&rdquo; itu dibayar Rp200 ribu untuk meminjamkan identitasnya.</p>
        <p>Twist-nya: musuh yang mereka lawan <strong>bukan satu jenis</strong>. Ada pencuri kartu (card fraud), ada pembajak akun (ATO), ada pemilik identitas yang menjual dirinya sendiri (mule). Satu senjata — OTP — tidak bisa membunuh tiga musuh yang berbeda. Lesson ini: <strong>kenali dulu wajah-wajahnya, baru bangun senjatanya.</strong></p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="taksonomi">Taksonomi: 9 Tipe Fraud yang Wajib Dihafal</h2>
      <p>Fraud di pembayaran digital Indonesia (dan global) mengelompok ke 9 pola. Hafalkan mekanismenya — karena tiap pola meninggalkan <strong>jejak data yang berbeda</strong>, dan jejak itulah yang nanti jadi fitur model ML-mu (FR6).</p>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>#</th><th>Tipe</th><th>Mekanisme serangan</th><th>Jejak data khas</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Card fraud (CNP)</strong></td><td>Kartu curian dipakai belanja online (card-not-present); barang bernilai tinggi, cepat laku</td><td>Nominal besar, kategori elektronik/emas, alamat kirim ≠ alamat tagihan</td></tr>
            <tr><td>2</td><td><strong>ATO</strong> (account takeover)</td><td>Akun pelanggan dibajak (phishing/credential stuffing), lalu dipakai belanja atau tarik dana</td><td>Login dari device/IP baru + perubahan alamat/email, lalu transaksi besar</td></tr>
            <tr><td>3</td><td><strong>Application fraud</strong></td><td>Pengajuan (kredit/akun) dengan data palsu atau curian</td><td>Dokumen tidak konsisten, device dipakai banyak aplikasi</td></tr>
            <tr><td>4</td><td><strong>Synthetic identity</strong></td><td>Identitas &ldquo;Frankenstein&rdquo;: KTP asli + data lain palsu; dibina berbulan-bulan lalu &ldquo;bust-out&rdquo;</td><td>Akun tua tapi tiba-tiba agresif; tidak ada jejak kredit wajar</td></tr>
            <tr><td>5</td><td><strong>First-party</strong></td><td>Pelanggan sendiri: sanggah transaksi asli (friendly fraud), klaim &ldquo;barang tak sampai&rdquo; palsu</td><td>Riwayat bagus, lalu dispute; pola &ldquo;ambil barang + minta refund&rdquo; berulang</td></tr>
            <tr><td>6</td><td><strong>Merchant fraud</strong></td><td>Toko fiktif memproses transaksi kartu curian lalu menarik dananya (atau kolusi)</td><td>Merchant baru, volume meledak, refund rate anomali</td></tr>
            <tr><td>7</td><td><strong>Mule account</strong></td><td>Rekening &ldquo;keledai&rdquo;: menampung lalu meneruskan dana hasil kejahatan (dibayar per transaksi)</td><td>Dana masuk besar → keluar cepat ke banyak tujuan (fan-out)</td></tr>
            <tr><td>8</td><td><strong>Insider fraud</strong></td><td>Orang dalam menyalahgunakan akses (refund manual, bocorkan data)</td><td>Aksi di luar pola kerja normal; override limit oleh user yang sama</td></tr>
            <tr><td>9</td><td><strong>APP scam</strong> (authorized push payment)</td><td>Korban <em>sendiri</em> yang mentransfer — ditipu via socmed/WA (modus &ldquo;undangan nikah&rdquo;, arisan online)</td><td>Transfer sukarela ke rekening baru; tidak ada anomali teknis sama sekali</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={lossShareData}
        title="Kontribusi Tiap Tipe terhadap Total Kerugian (ilustrasi industri, %)"
        layout={{ xaxis: { title: "Tipe fraud" }, yaxis: { title: "% dari total kerugian" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = tipe fraud, tinggi batang = pangsa kerugian. Ini data ilustrasi pola industri umum, bukan angka resmi satu perusahaan.</p>
        <p><strong>Interpretasi:</strong> card fraud + ATO + first-party mendominasi kerugian. Tapi perhatikan: <strong>APP scam kecil di grafik bukan berarti tidak penting</strong> — ia tumbuh paling cepat dan paling sulit dideteksi mesin karena transaksinya &ldquo;sah&rdquo; secara teknis. Prioritas ≠ sekadar batang tertinggi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Fraud = hacker membobol sistem.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> mayoritas fraud modern <strong>tidak membobol apa pun</strong>. First-party fraud memakai akun asli. APP scam memakai transfer sukarela korban. Synthetic identity lolos KYC resmi. Yang dibobol bukan server — melainkan <em>kepercayaan</em> pada identitas, dan itu tidak bisa ditambal dengan firewall.</p>
      </div>

      <h2 id="ekonomi">Ekonomi Fraud: Rumus Kerugian yang Menentukan Prioritas</h2>
      <p>Tim fraud yang dewasa tidak bertanya &ldquo;berapa banyak kasus?&rdquo; melainkan <strong>&ldquo;berapa rupiah hilang, dan berapa biaya menghentikannya?&rdquo;</strong> Tiga metrik dasar:</p>

      <p><strong>1. Fraud rate</strong> — seberapa pekat fraud di arus transaksimu:</p>
      <Tex math={String.raw`\text{Fraud Rate} = \frac{\text{jumlah transaksi fraud}}{\text{total transaksi}} \times 10.000 \text{ bps}`} block />
      <ul>
        <li>Hasil dinyatakan dalam <strong>bps</strong> (basis points): 1% = 100 bps. Industri kartu global berkisar puluhan bps.</li>
        <li>Contoh: 120 fraud dari 10.000 transaksi = <strong>120 bps = 1,2%</strong>.</li>
      </ul>

      <p><strong>2. Expected loss</strong> — perkiraan rupiah yang akan hilang:</p>
      <Tex math={String.raw`\mathbb{E}[\text{Loss}] = P(\text{fraud}) \times \mathbb{E}[\text{nominal} \mid \text{fraud}] \times N`} block />
      <ul>
        <li><Tex math={String.raw`P(\text{fraud})`} />: peluang satu transaksi adalah fraud (= fraud rate).</li>
        <li><Tex math={String.raw`\mathbb{E}[\text{nominal} \mid \text{fraud}]`} />: rata-rata nilai <em>jika</em> fraud terjadi (severity).</li>
        <li><Tex math={String.raw`N`} />: total transaksi.</li>
        <li>Contoh: 1,2% × Rp875 ribu × 10.000 = <strong>Rp105 juta</strong> per 10.000 transaksi.</li>
      </ul>
      <p><strong>Interpretasi angka ini:</strong> expected loss adalah &ldquo;anggaran musuh&rdquo;. Setiap rupiah yang kamu keluarkan untuk pertahanan (rule, model, investigator) harus dibandingkan dengan angka ini — itulah fondasi analisis biaya-manfaat di FR11.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fraud rate rendah bisa tetap mematikan jika severity tinggi. 10 kasus × Rp100 juta (Rp1 M) jauh lebih sakit dari 1.000 kasus × Rp50 ribu (Rp50 jt). <strong>Jangan prioritaskan berdasarkan jumlah kasus — prioritaskan berdasarkan expected loss.</strong></p>
      </div>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: dari data ke keputusan</summary>
        <p>TokoMaju, 1 bulan: 200.000 transaksi, 340 fraud terkonfirmasi, rata-rata nominal fraud Rp1,1 juta.</p>
        <p><strong>Langkah 1</strong> — fraud rate = 340/200.000 = 0,17% = <strong>17 bps</strong>.<br />
        <strong>Langkah 2</strong> — expected loss = 0,0017 × 1.100.000 × 200.000 = <strong>Rp374 juta/bulan</strong>.<br />
        <strong>Langkah 3</strong> — tim fraud beranggotakan 4 orang (biaya ~Rp60 juta/bulan) + tool Rp40 juta. Total biaya pertahanan Rp100 juta &lt; Rp374 juta → <strong>investasi pertahanan masuk akal</strong>, bahkan masih ada ruang.</p>
      </details>

      <h2 id="ato">ATO vs Synthetic Identity: Akun Asli yang Dibajak vs Manusia yang Tak Pernah Ada</h2>
      <p>Dua tipe ini sering tertukar, padahal perlakuannya berlawanan:</p>
      <ul>
        <li><strong>ATO</strong> = akun <em>legit</em> yang direbut. Korbannya nyata dan akan komplain. Jejaknya: <strong>perubahan mendadak</strong> — device baru, lokasi baru, lalu transaksi menyimpang dari baseline (FR6: deviasi dari baseline per user).</li>
        <li><strong>Synthetic identity</strong> = &ldquo;manusia&rdquo; yang <em>tidak pernah ada</em>. Tidak ada korban yang komplain — justru itu masalahnya: fraud-nya baru ketahuan saat &ldquo;bust-out&rdquo; (pinjaman besar lalu hilang). Jejaknya: <strong>ketiadaan yang mencurigakan</strong> — tidak ada riwayat wajar, nomor HP/email baru, alamat fiktif.</li>
      </ul>
      <p><strong>Kepribadian keduanya:</strong> ATO itu pencuri yang masuk lewat jendela — berisik, meninggalkan jejak perubahan. Synthetic identity itu penyusup yang membangun rumah di tanah kosong — sunyi berbulan-bulan, lalu membakar semuanya sekaligus.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;KYC yang kuat menghilangkan synthetic identity.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> KYC memverifikasi <em>dokumen</em>, bukan <em>keberadaan manusia di balik gabungan dokumen</em>. Synthetic identity memakai KTP asli orang lain + nama/alamat/telepon palsu — tiap dokumen lolos verifikasi sendiri-sendiri. Yang gagal adalah <strong>entity resolution</strong>: menyadari bahwa &ldquo;7 identitas berbeda&rdquo; memakai foto, device, atau alamat yang sama (ini wilayah FR12, graph analytics).</p>
      </div>

      <h2 id="firstparty">First-Party Fraud: Saat Pelakunya Justru Pelangganmu</h2>
      <p><strong>Definisi.</strong> Pemegang akun yang sah menyalahgunakan sistem: menyanggah transaksi yang memang ia lakukan (&ldquo;friendly fraud&rdquo;), mengklaim barang tak sampai padahal sampai, atau sengaja gagal bayar cicilan (first-party default).</p>
      <p><strong>Kenapa sulit:</strong> tidak ada anomali teknis. Device-nya benar, OTP-nya benar, perilakunya mirip pelanggan normal — karena memang <em>ia</em> pelanggan normal… sampai ia memutuskan tidak jujur. Model yang hanya melihat &ldquo;apakah ini perilaku aneh?&rdquo; akan buta total.</p>
      <p><strong>Yang membedakan:</strong> pola <em>niat</em>, bukan pola teknis — riwayat dispute berulang, klaim &ldquo;tak sampai&rdquo; padahal kurir mencatat diterima, refund ke rekening berbeda. Di sinilah <strong>fitur perilaku lintas waktu</strong> (FR6) dan <strong>feedback loop investigator</strong> (FR14) menjadi senjata utama.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> third-party fraud (kartu curian, ATO) meninggalkan jejak <em>teknis</em>; first-party fraud meninggalkan jejak <em>motif</em>. Kalau modelmu hanya makan fitur teknis (device, IP, velocity), ia buta terhadap separuh medan perang. Desain fitur harus mencakup riwayat klaim/dispute per user.</p>
      </div>

      <h2 id="mule">Mule Account &amp; Insider: Rantai Terlemah Ada di Dalam</h2>
      <p><strong>Mule account</strong> adalah rekening transit: dana hasil fraud masuk, dipecah, diteruskan ke banyak tujuan (fan-out) dalam hitungan menit. Pemiliknya sering &ldquo;tidak merasa bersalah&rdquo; — ia dibayar Rp200–500 ribu per &ldquo;bantuan&rdquo; lewat iklan lowongan kerja palsu di Telegram.</p>
      <p><strong>Insider fraud</strong> adalah orang dalam: CS yang memproses refund fiktif ke rekening kerabat, analis yang membocorkan daftar kartu. Frekuensinya rendah, tapi <strong>severity-nya ekstrem</strong> — ia tahu persis di mana alarm dimatikan.</p>
      <p><strong>Benang merahnya:</strong> keduanya adalah masalah <strong>jaringan</strong>, bukan transaksi tunggal. Satu mule tidak berarti apa-apa; <em>50 mule yang semuanya menerima dana dari 3 rekening yang sama dalam 2 jam</em> adalah sebuah ring. Itulah mengapa FR12 (graph analytics) adalah pasangan wajib lesson ini.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Hitung Fraud Rate &amp; Kerugian Sendiri</h2>
      <p>Jalankan kode, lalu ubah angka-angkanya. Rasakan bagaimana severity mengubah cerita.</p>
      <PyodideLab
        title="Lab 1 — Fraud Rate, bps, dan Expected Loss"
        hint="Coba: avg_fraud 875_000 → 350_000 → 2_000_000. Fraud rate tidak bergerak, tapi kerugian berubah drastis. Itulah bedanya rate vs severity."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Di Kanal Mana Fraud Paling Pekat?</h2>
      <PyodideLab
        title="Lab 2 — Konsentrasi Fraud per Kanal Pembayaran"
        hint="Ubah jumlah kasus antar kanal. Amati: kanal mana yang rate-nya tertinggi? Mana yang kontribusinya terbesar? Keduanya harus dijawab sebelum alokasi budget."
        defaultCode={lab2Code}
      />

      <PlotlyChart
        data={channelData}
        title="Fraud Rate per Kanal Pembayaran (data sintetis, %)"
        layout={{ xaxis: { title: "Kanal" }, yaxis: { title: "Fraud rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = kanal pembayaran, tinggi batang = fraud rate (persen transaksi fraud). Label persen di atas tiap batang.</p>
        <p><strong>Interpretasi:</strong> kartu kredit 3,80% — hampir <strong>8× lipat</strong> e-wallet. Ini pola klasik: kartu (terutama CNP) adalah kanal paling rentan karena &ldquo;jarak&rdquo; antara pemilik kartu dan transaksi paling jauh. COD nyaris nol — sulit menipu saat bayar tunai di depan kurir. <strong>Implikasi praktis:</strong> tiap rupiah budget deteksi paling efektif dipasang di kartu kredit dulu.</p>
      </div>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="worked">📐 Worked Example: Dari Angka ke Keputusan Prioritas</h2>
      <p>Dua contoh pengerjaan penuh — cara analis fraud mengubah data mentah menjadi keputusan &ldquo;perangi yang mana duluan&rdquo; dan &ldquo;layak tidak investasi pertahanannya&rdquo;.</p>

      <details className="worked">
        <summary>📐 Contoh 1: rate × severity — kartu kredit vs e-wallet, mana yang diperangi duluan?</summary>
        <p>Data TokoMaju, 1 bulan. <strong>Kartu kredit:</strong> 2.500 transaksi, 95 fraud, rata-rata nominal fraud Rp1,4 juta. <strong>E-wallet:</strong> 4.000 transaksi, 18 fraud, rata-rata nominal fraud Rp380 ribu.</p>
        <p><strong>Langkah 1 — fraud rate.</strong> Kartu kredit: 95/2.500 = 3,80%. E-wallet: 18/4.000 = 0,45%. Kartu kredit &ldquo;lebih pekat&rdquo; 8,4× lipat.</p>
        <p><strong>Langkah 2 — severity (kerugian per kejadian).</strong> Kartu kredit Rp1,4 juta vs e-wallet Rp380 ribu — selisih 3,7× lipat.</p>
        <p><strong>Langkah 3 — expected loss.</strong> Kartu kredit: 95 × Rp1,4 jt = <strong>Rp133 juta</strong>. E-wallet: 18 × Rp380 rb = <strong>Rp6,84 juta</strong>. Total fraud dua kanal ini 113 kasus, tapi kartu kredit menyumbang <strong>95% kerugiannya</strong>.</p>
        <p><strong>Keputusan:</strong> tim 3 orang dialokasikan 80% ke kartu kredit (3-D Secure, velocity rule, device check), 20% ke e-wallet (monitoring dasar). Intuisi kuncinya: <strong>prioritas = rate × severity × volume</strong> — bukan rate saja, bukan volume saja. Kanal dengan rate tertinggi belum tentu yang paling merugikan kalau nominalnya kecil.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: breakeven — kapan membangun tim fraud layak secara finansial?</summary>
        <p>Rumus expected loss satu periode:</p>
        <Tex math={String.raw`E[	ext{Loss}] = N 	imes r 	imes s`} block />
        <p><Tex math={String.raw`N`} /> = jumlah transaksi, <Tex math={String.raw`r`} /> = fraud rate, <Tex math={String.raw`s`} /> = rata-rata severity (Rp per fraud). Angka ini artinya: <strong>kerugian yang &ldquo;dijadwalkan&rdquo; terjadi tiap bulan kalau tidak ada yang diubah</strong>.</p>
        <p>Contoh: N = 200.000, r = 0,17%, s = Rp1,1 juta → E[Loss] = 200.000 × 0,0017 × 1.100.000 = <strong>Rp374 juta/bulan</strong>.</p>
        <p><strong>Langkah 1 — biaya pertahanan.</strong> 4 analis (Rp60 juta/bulan total) + tool/device-intelligence Rp40 juta = <strong>Rp100 juta/bulan</strong>.</p>
        <p><strong>Langkah 2 — efektivitas realistis.</strong> Pertahanan yang bagus memotong 40–60% loss, bukan 100%. Ambil 50%: penghematan = Rp187 juta/bulan.</p>
        <p><strong>Langkah 3 — ROI.</strong> Rp187 jt − Rp100 jt = <strong>+Rp87 juta/bulan</strong>. Layak. <em>Tapi</em> kalau fraud rate hanya 0,03% (E[Loss] = Rp66 juta), penghematan 50% = Rp33 juta &lt; biaya Rp100 juta → <strong>tidak layak bangun tim sendiri</strong>; lebih murah pakai layanan managed-fraud atau asuransi chargeback. Pelajaran: pertahanan fraud adalah keputusan investasi, bukan kewajiban moral.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Membaca Fraud seperti Epidemiolog</h2>
      <p>Epidemiolog tidak bertanya &ldquo;siapa yang sakit?&rdquo; dulu — ia bertanya <strong>&ldquo;di mana kasusnya mengelompok, seberapa cepat menyebar, dan siapa yang paling rentan?&rdquo;</strong> Analis fraud yang hebat berpikir sama. Taksonomi 9 tipe bukan daftar hafalan — ia <strong>peta penyebaran penyakit</strong>: card fraud mengelompok di e-commerce barang likuid, ATO meledak saat ada kebocoran data, mule tumbuh subur di musim pendaftaran massal (tahun ajaran baru = target rekrutmen mahasiswa).</p>
      <p>Intuisi kedua: <strong>fraud yang terlihat hanyalah puncak gunung es</strong>. Setiap 1 kasus terkonfirmasi, ada 3–5 yang tidak ketahuan (FR4: estimasi prior). Artinya angka &ldquo;Rp374 juta/bulan&rdquo; di worked example adalah <em>batas bawah</em>. Analis senior selalu menyajikan dua angka: <em>terkonfirmasi</em> (fakta) dan <em>terestimasi</em> (fakta + model). Direksi yang hanya melihat angka terkonfirmasi akan selalu <em>under-invest</em> di pertahanan.</p>
      <p><strong>Kapan taksonomi ini TIDAK dipakai:</strong> (1) saat serangan <em>baru</em> yang belum masuk 9 tipe — jangan paksakan klasifikasi; perlakukan sebagai &ldquo;tipe-10 sementara&rdquo; dan dokumentasikan polanya; (2) saat presentasi ke direksi — mereka butuh <em>rupiah per kategori</em>, bukan nama Latin; (3) untuk first-party vs third-party, taksonomi teknis kurang — yang dibutuhkan adalah <em>standar bukti</em> (FR1 peta lanjutan skenario C).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan taksonomi bukan untuk ujian — tapi agar saat investigator berkata &ldquo;ada pola refund aneh&rdquo;, otakmu langsung menjawab: <em>first-party atau insider? jejak datanya apa? siapa yang diuntungkan?</em> Taksonomi adalah <strong>kecepatan berpikir</strong>, bukan koleksi label.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Fraud Apa yang Diperangi Duluan</h2>

      <div className="decision-card">
        <h3>1. Expected loss terbesar + jejak teknis jelas → <strong>bangun deteksi otomatis duluan (card fraud, ATO)</strong></h3>
        <p><strong>Kondisi:</strong> card fraud 3,8% rate, jejaknya jelas (nominal besar, alamat mismatch). ATO punya sinyal perubahan device/IP yang kuat.</p>
        <p><strong>Kenapa:</strong> ROI tertinggi — pola jelas = rule/model sederhana sudah memotong besar. Ini &ldquo;buah tergantung rendah&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> TokoMaju memasang velocity rule + device check untuk kartu: chargeback turun 40% dalam 6 minggu.</p>
      </div>

      <div className="decision-card">
        <h3>2. Severity ekstrem tapi frekuensi rendah → <strong>kontrol manual + dual approval (insider, merchant fraud)</strong></h3>
        <p><strong>Kondisi:</strong> 2–3 kasus per kuartal, tapi sekali kejadian Rp500 juta+.</p>
        <p><strong>Kenapa:</strong> ML butuh volume untuk belajar; kasus langka = model buta. Kontrol proses (segregation of duties, maker-checker) lebih efektif.</p>
        <p><strong>Contoh nyata:</strong> refund manual &gt;Rp5 juta wajib approval dua orang — menutup celah CS nakal.</p>
      </div>

      <div className="decision-card">
        <h3>3. Tidak ada anomali teknis → <strong>serang via edukasi + graph (APP scam, mule)</strong></h3>
        <p><strong>Kondisi:</strong> korban transfer sukarela; mule terlihat seperti nasabah biasa.</p>
        <p><strong>Kenapa:</strong> mesin tidak bisa membedakan &ldquo;transfer sukarela karena ditipu&rdquo; dari &ldquo;transfer sukarela biasa&rdquo;. Senjatanya: peringatan di UI saat transfer ke rekening baru (friction), dan graph untuk menemukan ring mule.</p>
        <p><strong>Contoh nyata:</strong> pop-up &ldquo;Apakah kamu kenal penerima? Waspada penipuan&rdquo; + jeda 30 menit untuk rekening baru menurunkan APP scam signifikan di beberapa bank.</p>
      </div>

      <div className="decision-card">
        <h3>4. Pelakunya pelanggan sendiri → <strong>fitur perilaku + dispute history (first-party)</strong></h3>
        <p><strong>Kondisi:</strong> dispute rate naik, pola &ldquo;barang diterima tapi klaim tak sampai&rdquo; berulang di akun-akun tertentu.</p>
        <p><strong>Kenapa:</strong> fitur teknis tidak mempan; yang mempan adalah memori — &ldquo;akun ini sudah 4× klaim tak sampai dalam 3 bulan&rdquo;. Butuh feedback loop investigator (FR14).</p>
        <p><strong>Contoh nyata:</strong> flag &ldquo;serial claimer&rdquo;: klaim ke-3 dalam 90 hari otomatis butuh bukti video unboxing.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Hitung <strong>expected loss per tipe</strong> (rate × severity × volume) — bukan jumlah kasus.</li>
          <li>Jejak teknis jelas → otomasi (rule/ML). Jejak motif → proses + manusia.</li>
          <li>Kasus langka + rugi besar → kontrol manual, jangan paksakan ML.</li>
          <li>Setiap tipe fraud butuh <strong>senjata berbeda</strong> — satu model untuk semua = tidak ada yang optimal.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Dilema Prioritas</h2>
      <p>Peta di atas menjawab &ldquo;fraud apa yang diperangi duluan&rdquo; dalam kondisi normal. Tiga skenario di bawah ini adalah versi sulitnya — yang membedakan analis junior dan senior.</p>
      <p><strong>Skenario A — rate tinggi &amp; severity rendah vs rate rendah &amp; severity tinggi.</strong> Contoh: voucher abuse (rate 2%, severity Rp25 ribu) vs ATO korporat (rate 0,02%, severity Rp85 juta). Expected loss voucher = 0,02 × 25.000 × volume; ATO = 0,0002 × 85.000.000 × volume. Hitung keduanya dalam rupiah per bulan — yang angkanya lebih besar menang, <em>kecuali</em> ATO korporat membawa risiko reputasi (satu kasus viral = ratusan juta biaya PR). Aturan: rupiah dulu, reputasi sebagai penimbang.</p>
      <p><strong>Skenario B — tipe fraud baru tanpa histori.</strong> Misal muncul modus &ldquo;refund fiktif via CS&rdquo; yang belum pernah tercatat. Tidak ada data = tidak ada model. Respons yang benar: (1) pasang <strong>rule sementara</strong> 2–4 minggu untuk mengumpulkan sampel berlabel, (2) catat pola manual oleh investigator, (3) baru latih model setelah &gt;200 kasus terkonfirmasi. Yang salah: menunggu &ldquo;data cukup&rdquo; sambil kerugian berjalan, atau langsung percaya model yang dilatih dari 12 sampel.</p>
      <p><strong>Skenario C — first-party vs third-party, standar buktinya beda.</strong> Third-party (kartu curian): bukti teknis (device, IP, velocity) cukup untuk blokir otomatis. First-party (pelanggan menyangkal transaksinya sendiri): butuh <strong>jejak niat</strong> — histori dispute, pola pemakaian normal sebelum sangkalan, tanda tangan digital. Blokir otomatis pelanggan yang salah = kehilangan customer seumur hidup. Aturan: makin dekat pelaku ke &ldquo;pelangganmu sendiri&rdquo;, makin tinggi standar bukti sebelum bertindak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> fraud yang paling sering dibicarakan di konferensi <strong>bukan</strong> fraud yang paling merugikan bisnismu. Deepfake dan AI-fraud ramai dibahas, tapi untuk kebanyakan perusahaan Indonesia, kartu curian + ATO + mule masih menyumbang 80%+ kerugian. Ukur di datamu sendiri sebelum mengejar tren.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Mule Account untuk Judi Online</h2>
      <p>Sepanjang 2024–2025, PPATK berulang kali menyoroti satu pola: <strong>rekening keledai (mule account)</strong> sebagai tulang punggung aliran dana judi online. Mekanismenya sederhana dan murah — justru itu yang membuatnya masif.</p>
      <p><strong>Anatomi modus (pola umum dari berbagai pengungkapan):</strong></p>
      <ol>
        <li><strong>Rekrutmen:</strong> pemilik rekening asli &ldquo;meminjamkan&rdquo; rekening + ATM + OTP-nya dengan imbalan Rp200–500 ribu. Targetnya mahasiswa, pekerja informal, warga yang butuh uang cepat.</li>
        <li><strong>Penampungan:</strong> dana deposit pemain judi mengalir masuk ke ratusan rekening mule — masing-masing dipecah agar tidak mencolok.</li>
        <li><strong>Layering:</strong> dana diputar cepat: mule → mule lain → e-wallet → kripto, sering dalam hitungan menit.</li>
        <li><strong>Integrasi:</strong> sebagian dicairkan tunai via ATM, sebagian dibelanjakan aset.</li>
      </ol>
      <p><strong>Angka ilustratif skalanya:</strong> 1.000 rekening mule × Rp50 juta perputaran/bulan = <strong>Rp50 miliar perputaran per bulan</strong> dari satu jaringan — dengan &ldquo;modal rekrutmen&rdquo; hanya Rp200–500 juta. Rasio leverage inilah yang membuat pemberantasan harus memutus <em>jaringannya</em> (graph analytics, FR12), bukan mengejar satu rekening.</p>
      <p><strong>Jejak data yang ditinggalkan</strong> (inilah yang jadi fitur model): rekening baru berumur &lt; 90 hari dengan perputaran jauh di atas profil nasabah; pola <em>fan-in lalu fan-out cepat</em> (banyak masuk, langsung keluar ke banyak tujuan); transaksi di jam-jam tidak wajar; device yang sama dipakai belasan rekening berbeda.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Pemilik rekening mule itu korban, jadi tidak bisa ditindak.&rdquo;<br /><strong>Yang benar:</strong> secara hukum mereka bisa dijerat TPPU sebagai pihak yang membantu (UU No. 8/2010). Dan dari sisi pertahanan bank, &ldquo;korban&rdquo; atau bukan tidak mengubah fakta: rekeningnya adalah infrastruktur kejahatan dan harus dibekukan. Rasa kasihan tidak boleh menunda pemutusan jaringan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Prioritas 90 Hari Tim Fraud TokoMaju</h2>
      <div className="callout">
        <p>Kamu Head of Fraud di TokoMaju. Data kuartal terakhir (per bulan, rata-rata):</p>
        <ul>
          <li><strong>Card fraud:</strong> 340 kasus, rata-rata Rp1,1 jt → loss Rp374 jt/bln</li>
          <li><strong>ATO:</strong> 90 kasus, rata-rata Rp2,4 jt → loss Rp216 jt/bln</li>
          <li><strong>First-party (klaim palsu):</strong> 1.200 kasus, rata-rata Rp180 rb → loss Rp216 jt/bln</li>
          <li><strong>Mule network:</strong> 1 ring terdeteksi, loss Rp900 jt (sekali, 3 bulan lalu)</li>
        </ul>
        <p>Budget 90 hari ke depan hanya cukup untuk <strong>2 inisiatif</strong>. Pilihan: (a) rule engine kartu, (b) deteksi ATO (device fingerprint), (c) sistem skor &ldquo;serial claimer&rdquo;, (d) graph analytics untuk mule ring.</p>
        <p><strong>Pertanyaan:</strong> dua inisiatif mana yang kamu pilih, dan mengapa? (Tidak ada jawaban tunggal yang benar — yang dinilai alasannya.)</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Pilihan defensibel: (a) + (b).</strong> Card fraud (Rp374 jt/bln) dan ATO (Rp216 jt/bln) adalah expected loss <em>berulang</em> terbesar dengan jejak teknis paling jelas — ROI otomasi tertinggi. Dalam 90 hari keduanya bisa memotong 30–50% loss.</p>
          <p><strong>Kenapa bukan (d)?</strong> Mule ring Rp900 jt memang terbesar sekali kejadian, tapi frekuensinya tak tentu dan butuh graph infra yang belum ada — payoff-nya di luar 90 hari. Masukkan ke roadmap kuartal berikut, bukan sekarang.</p>
          <p><strong>Kenapa bukan (c)?</strong> First-party loss-nya setara ATO (Rp216 jt), tapi butuh dispute history + feedback loop yang belum ada datanya — fondasinya (FR14) harus dibangun dulu. Urutan yang benar: (a)+(b) sekarang, (c) setelah feedback loop jalan, (d) setelah infra graph siap.</p>
          <p><strong>Pelajaran:</strong> prioritas = expected loss berulang × kemudahan eksekusi × kesiapan data. Bukan sekadar &ldquo;yang kerugiannya terbesar&rdquo;.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="faq">❓ Tanya Jawab: Lanskap Fraud</h2>
      <p>Empat pertanyaan yang paling sering muncul setelah mempelajari taksonomi — dijawab dengan jujur, termasuk yang jawabannya &ldquo;tergantung&rdquo;.</p>
      <details className="worked">
        <summary>Q1: Apa bedanya fraud, scam, dan penipuan biasa?</summary>
        <p><strong>Fraud</strong> = kecurangan dalam <em>sistem pembayaran/transaksi</em> (kartu curian, ATO, chargeback palsu) — korbannya pemilik dana, pelakunya mengeksploitasi sistem. <strong>Scam</strong> = korban <em>dibujuk</em> menyerahkan uang/OTP sendiri (phishing, investasi bodong) — korbannya ikut &ldquo;berpartisipasi&rdquo;. Bedanya penting karena <strong>pertahanannya beda</strong>: fraud dilawan dengan deteksi transaksi, scam dilawan dengan edukasi + behavioral. Banyak perusahaan salah kaprah memakai senjata fraud untuk melawan scam — lalu heran kenapa tidak mempan.</p>
      </details>
      <details className="worked">
        <summary>Q2: Kenapa kartu kredit selalu juara fraud rate? Bukankah keamanannya paling canggih?</summary>
        <p>Justru karena <strong>nilai &amp; likuiditasnya</strong>: limit besar + bisa dipakai lintas negara + barang digital instan = target paling menguntungkan. Keamanan (3DS, tokenisasi) menaikkan <em>biaya serangan</em>, tapi selama <em>keuntungannya</em> tetap tinggi, penjahat tetap datang — seperti rumah mewah dengan satpam tetap lebih menarik bagi maling daripada gubuk tanpa kunci. Pelajaran: <strong>keamanan mengurangi, tidak menghilangkan; yang menentukan adalah rasio untung-rugi penjahat</strong>.</p>
      </details>
      <details className="worked">
        <summary>Q3: First-party fraud (pelanggan sendiri) — bisa dipidana?</summary>
        <p>Bisa, tapi <strong>jarang sepadan</strong>: nilai per kasus kecil (Rp500rb–5jt), pembuktian &ldquo;niat&rdquo; sulit, biaya hukum besar. Praktik industri: <em>blacklist lunak</em> (tolak transaksi berikutnya, tutup akun), laporkan ke <em>shared blacklist</em> antar-merchant jika ada, pidanakan hanya untuk <strong>sindikat first-party</strong> (puluhan akun terkoordinasi). Aturan praktis: hukum untuk efek jera kolektif, blacklist untuk kasus individual.</p>
      </details>
      <details className="worked">
        <summary>Q4: UMKM dengan 500 transaksi/bulan perlu memahami semua ini?</summary>
        <p>Tidak semua — tapi <strong>tiga hal wajib</strong>: (1) kenali 2–3 tipe yang relevan dengan bisnismu (e.g. toko online: card fraud + friendly fraud); (2) hitung expected loss-mu (worked example 2) — jika &lt; Rp5jt/bulan, asuransi/chargeback protection lebih murah dari tim; (3) punya <em>rencana respons</em> 1 halaman: siapa dihubungi, kapan bekukan, kapan lapor. UMKM tidak butuh divisi fraud — butuh <strong>kewaspadaan terstruktur</strong>.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Transaksi Rp15 juta memakai kartu curian untuk beli emas batangan, dikirim ke alamat kos. Ini tipe fraud apa?"
        options={[
          "First-party fraud",
          "Card fraud (CNP)",
          "APP scam",
          "Insider fraud",
        ]}
        correct={1}
        explanation="Benar: card fraud CNP — kartu curian dipakai tanpa kehadiran fisik kartu, target barang bernilai tinggi dan mudah dijual kembali (emas, elektronik)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Akun 8 bulan tidak aktif, tiba-tiba login dari device baru di kota berbeda lalu transfer Rp5 juta. Pola ini paling cocok dengan…"
        options={[
          "Synthetic identity",
          "Merchant fraud",
          "Account takeover (ATO)",
          "Mule account",
        ]}
        correct={2}
        explanation="Benar: ATO — kuncinya adalah PERUBAHAN mendadak pada akun legit (device baru + lokasi baru + transaksi menyimpang). Synthetic identity tidak punya 'akun lama yang berubah'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dua skenario: (A) 1.000 kasus × Rp50 ribu, (B) 10 kasus × Rp100 juta. Mana yang harus diprioritaskan?"
        options={[
          "A — kasusnya 100× lebih banyak",
          "B — expected loss Rp1 M vs Rp50 jt",
          "Sama saja",
          "Tergantung mood tim",
        ]}
        correct={1}
        explanation="Benar: B. Expected loss A = Rp50 juta, B = Rp1 miliar (20× lipat). Jumlah kasus menipu — yang menentukan adalah rate × severity × volume."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa APP scam (korban transfer sukarela karena ditipu) sulit dideteksi model ML transaksional?"
        options={[
          "Datanya terlalu sedikit",
          "Secara teknis transaksinya sah — tidak ada anomali device, IP, atau perilaku yang bisa dibedakan dari transfer normal",
          "Model ML tidak bisa membaca nominal",
          "Karena pakai QRIS",
        ]}
        correct={1}
        explanation="Benar: tidak ada jejak teknis. Korban memakai device sendiri, OTP sendiri, ke rekening yang 'valid'. Senjata yang tepat adalah friction di UI + edukasi, bukan sekadar model."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 'KTP asli + nama palsu + nomor baru, dibina 6 bulan lalu bust-out Rp50 juta.' Ini…"
        options={[
          "Application fraud biasa",
          "Synthetic identity",
          "First-party fraud",
          "Card fraud",
        ]}
        correct={1}
        explanation="Benar: synthetic identity — identitas 'Frankenstein' gabungan data asli dan palsu, dibina (dibangun riwayat) lalu bust-out. Tidak ada korban yang komplain karena 'orangnya' tidak ada."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>9 tipe fraud</strong> — card, ATO, application, synthetic identity, first-party, merchant, mule, insider, APP scam — masing-masing punya mekanisme dan jejak data berbeda.</li>
          <li><strong>Prioritas = expected loss</strong>: <Tex math={String.raw`P(\text{fraud}) \times \mathbb{E}[\text{nominal}\mid\text{fraud}] \times N`} /> — bukan jumlah kasus.</li>
          <li><strong>ATO</strong> = perubahan mendadak di akun asli; <strong>synthetic identity</strong> = manusia yang tak pernah ada (tidak ada yang komplain).</li>
          <li><strong>First-party</strong> meninggalkan jejak motif (bukan teknis) — butuh memori dispute, bukan sekadar fitur device.</li>
          <li><strong>Mule &amp; insider</strong> adalah masalah jaringan — satu transaksi tidak berarti apa-apa, polanya baru terlihat di graph.</li>
          <li><strong>Satu senjata tidak membunuh semua musuh</strong> — tiap tipe butuh pendekatan deteksi berbeda.</li>
          <li>Kapan TIDAK pakai ML: kasus langka + rugi besar (insider) → kontrol proses lebih tepat.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/fr2-fraud-vs-aml" className="btn btn-primary btn-sm">Next: FR2 →</Link>
      </div>
    </div>
  );
}
