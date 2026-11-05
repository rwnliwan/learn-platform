"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR22Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const winRateData = [
    {
      x: ["Fraud (10.4)", "Processing error (12.x)", "Consumer dispute (13.x)"],
      y: [18, 45, 38],
      type: "bar",
      marker: { color: ["#e05252", "#e8a838", "#2a7de1"] },
      text: ["18%", "45%", "38%"],
      textposition: "outside",
    },
  ];

  const lifecycleData = [
    {
      x: ["Chargeback", "Representment", "Pre-arbitration", "Arbitration"],
      y: [1000, 350, 80, 15],
      type: "bar",
      marker: { color: ["#e05252", "#e8a838", "#e8a838", "#b06fc9"] },
      text: ["1000", "350", "80", "15"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Ekonomi chargeback: dari 'gross' ke 'net' setelah representment
# 1000 chargeback @ Rp1,1 jt. Win rate 30% -> berapa yang kembali?
N_CB, AVG = 1000, 1_100_000
WIN_RATE = 0.30
BIAYA_REPRESENT = 150_000  # biaya per kasus (SDM + fee)

gross = N_CB * AVG
kembali = N_CB * WIN_RATE * AVG
biaya = N_CB * BIAYA_REPRESENT
net_loss = gross - kembali + biaya

print(f"Gross chargeback : Rp{gross/1e9:.2f} M")
print(f"Kembali (menang) : Rp{kembali/1e9:.2f} M ({WIN_RATE*100:.0f}%)")
print(f"Biaya proses     : Rp{biaya/1e6:.0f} jt")
print(f"NET LOSS         : Rp{net_loss/1e9:.2f} M")
print()
print("COBA UBAH: WIN_RATE 0.30 -> 0.15 (bukti buruk).")
print("Net loss naik Rp165 jt. Pelajaran: representment BUKAN 'gratis' —")
print("ia investasi dengan ROI. Win rate rendah + biaya tetap = bakar uang.")`;

  const lab2Code = `# Kualitas bukti vs win rate: 'compelling evidence' itu apa?
# Simulasi: tiap bukti menambah peluang menang (diminishing return).
import random
random.seed(73)

# Bobot bukti (compelling evidence per kategori sengketa)
bobot = {
    "bukti pengiriman (resi + diterima)": 0.25,
    "riwayat transaksi sebelumnya (nasabah lama)": 0.15,
    "kecocokan AVS/CVV + 3DS": 0.20,
    "komunikasi dengan pembeli": 0.10,
    "foto produk diterima": 0.12,
}
base = 0.10  # win rate tanpa bukti

def win_rate(bukti_terpilih):
    w = base + sum(bobot[b] for b in bukti_terpilih)
    return min(w, 0.85)

semua = list(bobot.keys())
for n in range(0, 6):
    wr = win_rate(semua[:n])
    print(f"{n} bukti: win rate = {wr*100:4.1f}%")
print()
print("COBA RENUNGKAN: bukti ke-5 hanya +2 poin (diminishing return).")
print("Pelajaran operasional: kumpulkan 3 bukti TERKUAT, bukan 10 bukti")
print("sembarangan — tiap bukti = waktu investigator (FR11: kapasitas!).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR22 — Fraud / ML Analytics • JOB SKILL</span>
        <h1 className="display-title">Chargeback &amp; Dispute:<br />Perang yang Terjadi Setelah Uang Hilang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp1,1 Miliar yang &ldquo;Hilang&rdquo; Padahal Bisa Kembali</a></li>
          <li><a href="#siklus">Siklus Dispute: 4 Babak Perang</a></li>
          <li><a href="#reason">Reason Code: Bahasa Resmi Perang</a></li>
          <li><a href="#represent">Representment: Seni Merebut Kembali</a></li>
          <li><a href="#ekonomi">Ekonomi: Dari Gross ke Net</a></li>
          <li><a href="#program">Program Monitoring: VDMP &amp; Batas yang Tak Boleh Disentuh</a></li>
          <li><a href="#lab1">🔬 Lab 1: Gross vs Net Chargeback</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kualitas Bukti vs Win Rate</a></li>
          <li><a href="#worked">📐 Worked Example: Chargeback Rate &amp; Ekonomi Representment</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Chargeback adalah Cermin</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Lawan atau Relakan?</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Fight, Accept, atau Cegah?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Friendly Fraud Pasca-Liburan</a></li>

          <li><a href="#case">📋 Mini-Case: 1.000 Chargeback, Budget Terbatas</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Chargeback</a></li>

          <li><a href="#latihan">Latihan Mandiri: Ekonomi Chargeback</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menggambarkan <strong>siklus dispute 4 babak</strong> (chargeback → representment → pre-arb → arbitration).</li>
          <li>Membaca <strong>reason code</strong> (kategori 10/12/13) dan implikasinya untuk strategi.</li>
          <li>Menghitung <strong>win rate</strong> dan <strong>net loss</strong> setelah representment.</li>
          <li>Menentukan <strong>kapan melawan vs merelakan</strong> chargeback berdasarkan ROI.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp1,1 Miliar yang &ldquo;Hilang&rdquo; Padahal Bisa Kembali</h2>
      <div className="story">
        <p>Marketplace &ldquo;TokoMaju&rdquo; mencatat chargeback <strong>Rp1,1 miliar</strong> kuartal lalu. Manajemen menganggapnya &ldquo;biaya fraud yang tak terhindarkan&rdquo; dan mengikhlaskan. Lalu analis baru memeriksa: <strong>40% dari chargeback itu berkategori &ldquo;consumer dispute&rdquo;</strong> (barang tak sampai / tak sesuai) — dan TokoMaju punya <strong>resi pengiriman + foto diterima</strong> untuk hampir semuanya.</p>
        <p>Mereka mengajukan representment untuk 400 kasus itu. <strong>Menang 152 kasus. Rp167 juta kembali.</strong> Uang yang &ldquo;hilang&rdquo; ternyata hanya <em>diparkir</em> di proses yang tidak pernah dijalankan.</p>
        <p>Twist-nya: selama ini TokoMaju <strong>tidak pernah melawan satu pun</strong> chargeback — karena &ldquo;tidak ada yang tahu caranya&rdquo;. Rp167 juta itu bukan kemenangan analisis canggih; itu kemenangan <strong>pengetahuan proses</strong>. Lesson ini: <strong>fraud analyst yang paham dispute lifecycle menyelamatkan uang yang bahkan tidak dihitung sebagai &ldquo;loss yang bisa dicegah&rdquo;</strong> — dan itulah kenapa lowongan global menuntut &ldquo;deep working knowledge of chargebacks and dispute processes&rdquo;.</p>
      </div>

      <h2 id="siklus">Siklus Dispute: 4 Babak Perang</h2>
      <ol>
        <li><strong>Chargeback:</strong> bank penerbit (issuer) menarik dana dari merchant/acquirer atas komplain pemegang kartu. Uang <em>pergi</em>.</li>
        <li><strong>Representment:</strong> merchant melawan dengan <strong>bukti</strong> (compelling evidence). Jika menang, uang <em>kembali</em>.</li>
        <li><strong>Pre-arbitration:</strong> issuer tidak terima → sengketa babak 2. Merchant boleh menyerah atau lanjut.</li>
        <li><strong>Arbitration:</strong> network (Visa/Mastercard) jadi hakim. <strong>Biaya besar</strong> (ratusan USD) + yang kalah bayar — hanya untuk kasus besar.</li>
      </ol>

      <PlotlyChart
        data={lifecycleData}
        title="Funnel Dispute: Dari 1.000 Chargeback (ilustrasi)"
        layout={{ xaxis: { title: "Babak" }, yaxis: { title: "Jumlah kasus" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kasus yang mencapai babak itu.</p>
        <p><strong>Interpretasi:</strong> dari 1.000 chargeback, hanya 350 yang dilawan (representment) — <strong>65% direlakan tanpa perlawanan!</strong> Dari yang dilawan, 80 lanjut ke pre-arb, 15 ke arbitration. <strong>Pelajaran:</strong> kebocoran terbesar bukan di &ldquo;kalah sengketa&rdquo; — melainkan di &ldquo;tidak pernah melawan&rdquo;. Disiplin proses &gt; kehebatan argumen.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> chargeback <strong>bukan vonis akhir</strong> — ia adalah <em>babak pertama</em>. Perusahaan yang memperlakukan chargeback sebagai &ldquo;biaya&rdquo; menyerahkan uang yang sebenarnya bisa direbut kembali. Mindset yang benar: <strong>chargeback = klaim yang harus diverifikasi, bukan tagihan yang harus dibayar</strong>.</p>
      </div>

      <h2 id="reason">Reason Code: Bahasa Resmi Perang</h2>
      <p>Setiap chargeback membawa <strong>reason code</strong> — kategori resmi alasannya. Visa mengelompokkan jadi 4 famili (10/11/12/13):</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Famili</th><th>Arti</th><th>Contoh</th><th>Strategi</th></tr></thead>
          <tbody>
            <tr><td><strong>10.x</strong></td><td>Fraud</td><td>10.4: &ldquo;bukan saya yang transaksi&rdquo;</td><td>Sulit menang (18%) — fokus <strong>pencegahan</strong> (3DS, AVS), bukan perlawanan</td></tr>
            <tr><td><strong>11.x</strong></td><td>Authorization</td><td>11.3: limit terlampaui</td><td>Perbaiki <strong>proses</strong> otorisasi</td></tr>
            <tr><td><strong>12.x</strong></td><td>Processing error</td><td>12.6: double charge</td><td>Menang <strong>45%</strong> — bukti sistem mudah; perbaiki <strong>bug</strong></td></tr>
            <tr><td><strong>13.x</strong></td><td>Consumer dispute</td><td>13.1: barang tak diterima</td><td>Menang <strong>38%</strong> — kumpulkan <strong>bukti pengiriman</strong> sejak hari pertama</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Pelajaran strategis:</strong> reason code menentukan <strong>di mana uangmu kembali</strong>. Kategori 10 (fraud) = terima kekalahan, invest di pencegahan. Kategori 12/13 = <strong>lawan</strong> — win rate 38–45% dengan bukti yang tepat.</p>

      <PlotlyChart
        data={winRateData}
        title="Win Rate Representment per Kategori (ilustrasi industri)"
        layout={{ xaxis: { title: "Kategori" }, yaxis: { title: "Win rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % representment yang menang per kategori.</p>
        <p><strong>Interpretasi:</strong> fraud (18%) = <strong>jangan buang resources melawan</strong> — kecuali ada bukti 3DS kuat. Processing error (45%) &amp; consumer dispute (38%) = <strong>medan perang yang menguntungkan</strong>. <strong>Alokasi:</strong> 80% effort representment ke 12.x/13.x, 20% ke 10.x yang punya bukti kuat.</p>
      </div>

      <h2 id="represent">Representment: Seni Merebut Kembali</h2>
      <p><strong>Compelling evidence</strong> — bukti yang memenangkan sengketa — berbeda per kategori:</p>
      <ul>
        <li><strong>13.1 (barang tak diterima):</strong> resi pengiriman + <strong>bukti diterima</strong> (tanda tangan/foto) + lacak.</li>
        <li><strong>13.3 (tak sesuai deskripsi):</strong> deskripsi produk saat dibeli + foto + komunikasi pembeli.</li>
        <li><strong>10.4 (fraud):</strong> bukti <strong>3DS/AVS/CVV cocok</strong> + riwayat transaksi nasabah sebelumnya + kecocokan device.</li>
        <li><strong>12.6 (double charge):</strong> log sistem menunjukkan 1 otorisasi valid + refund untuk duplikatnya.</li>
      </ul>
      <p><strong>Prinsip emas:</strong> bukti <strong>dikumpulkan saat transaksi</strong>, bukan saat sengketa. Resi yang tidak disimpan = perang yang kalah sebelum mulai. <strong>Desain sistem yang baik menyimpan &ldquo;paket bukti&rdquo; otomatis</strong> untuk tiap transaksi berisiko.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Chargeback fraud (10.4) tidak bisa dilawan — pasrah saja.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> win rate 18% ≠ 0%. Dengan <strong>3DS + bukti kuat</strong>, liability shift melindungi merchant (transaksi 3DS yang di-chargeback fraud = tanggung jawab issuer, bukan merchant!). &ldquo;Pasrah&rdquo; yang benar = <strong>pasrah melawan, investasi di pencegahan</strong> (3DS) — bukan pasrah total.</p>
      </div>

      <h2 id="ekonomi">Ekonomi: Dari Gross ke Net</h2>
      <Tex math={String.raw`\text{Net Loss} = N_{CB} \cdot \bar{L} - N_{CB} \cdot w \cdot \bar{L} + N_{CB} \cdot C_{\text{rep}}`} block />
      <ul>
        <li><Tex math={String.raw`N_{CB}`} />: jumlah chargeback; <Tex math={String.raw`\bar{L}`} />: rata-rata nilai.</li>
        <li><Tex math={String.raw`w`} />: win rate representment.</li>
        <li><Tex math={String.raw`C_{\text{rep}}`} />: biaya per representment (SDM + fee).</li>
      </ul>
      <p><strong>Keputusan ROI:</strong> lawan hanya jika <Tex math={String.raw`w \cdot \bar{L} > C_{\text{rep}}`} /> — ekspektasi kembali melebihi biaya melawan. Chargeback Rp100 ribu dengan biaya representment Rp150 ribu = <strong>jangan dilawan</strong> (kecuali untuk data/preseden).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> representment = <strong>investasi</strong>, bukan &ldquo;keadilan&rdquo;. Tiap kasus = taruhan Rp150 ribu untuk peluang menang <em>w</em> × Rp1,1 juta. Analis yang baik = <strong>manajer portofolio sengketa</strong>: pilih kasus dengan expected value positif.</p>
      </div>

      <h2 id="program">Program Monitoring: VDMP &amp; Batas yang Tak Boleh Disentuh</h2>
      <p>Network mengawasi <strong>rasio chargeback</strong> merchant — lewat ambang = denda &amp; bisa <strong>dicabut</strong> kemampuan terima kartu:</p>
      <ul>
        <li><strong>Visa VDMP</strong> (dispute monitoring): waspada jika &gt;0,9% dispute rate atau &gt;100 dispute/bulan.</li>
        <li><strong>Mastercard ECP</strong>: ambang serupa untuk excessive chargeback.</li>
        <li><strong>Implikasi:</strong> chargeback bukan cuma &ldquo;uang hilang&rdquo; — ia adalah <strong>metrik kesehatan</strong> yang diawasi network. Merchant dengan rasio tinggi = <strong>risiko eksistensial</strong>.</li>
      </ul>
      <p><strong>Untuk analis:</strong> pantau <strong>chargeback rate per merchant/kategori</strong> sebagai KPI — dan hubungkan ke <strong>pencegahan di hulu</strong> (3DS, deskripsi jelas, CS responsif). Menurunkan chargeback 0,2% bisa menyelamatkan <em>seluruh bisnis kartu</em>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Chargeback urusan finance, bukan fraud analyst.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> chargeback = <strong>label</strong> (FR4!), <strong>metrik kesehatan</strong>, dan <strong>peluang recovery</strong> — ketiganya ranah analis. Analis yang mengabaikan dispute = mengabaikan sepertiga pekerjaannya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Gross vs Net Chargeback</h2>
      <p>Hitung berapa yang sebenarnya hilang — dan berapa yang bisa kembali.</p>
      <PyodideLab
        title="Lab 1 — Ekonomi Representment"
        hint="Ubah WIN_RATE 0.30 → 0.15. Lihat net loss naik — buktikan representment adalah investasi dengan ROI, bukan 'gratis'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Kualitas Bukti vs Win Rate</h2>
      <PyodideLab
        title="Lab 2 — Compelling Evidence"
        hint="Renungkan: bukti ke-5 cuma +2 poin. Kumpulkan 3 TERKUAT, bukan 10 sembarangan — tiap bukti = waktu investigator."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung Siklus Chargeback</h2>
      <p>Chargeback = <strong>fraud yang menagih balik</strong> — plus biaya, plus risiko program monitoring. Dua contoh hitungannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: chargeback rate &amp; ambang program monitoring</summary>
        <p>Merchant memproses 40.000 transaksi/bulan. Chargeback masuk: 55 kasus. Nilai rata-rata Rp1,2jt.</p>
        <p><strong>Langkah 1 — chargeback rate.</strong> 55/40.000 = <strong>0,1375%</strong> = 13,75 bps.</p>
        <p><strong>Langkah 2 — bandingkan ambang.</strong> Visa VDMP: waspada di 0,9% (90 bps)?? — tidak, ambang program: <strong>≥ 100 chargeback DAN rate ≥ 0,9%</strong> (angka ilustratif, bervariasi per skema). Dengan 55 kasus &amp; 0,14%, merchant ini <strong>aman jauh</strong> dari program.</p>
        <p><strong>Langkah 3 — tapi hitung biayanya.</strong> 55 × Rp1,2jt = Rp66jt barang hilang + 55 × Rp350rb fee chargeback = Rp19,25jt → <strong>total Rp85,25jt/bulan</strong>. &ldquo;Aman dari program&rdquo; ≠ &ldquo;tidak masalah&rdquo; — Rp85jt/bulan = Rp1 M/tahun menguap diam-diam. Pelajaran: <strong>program monitoring adalah batas katastrofal, bukan target operasional</strong>. Target sehat: &lt; 0,3%.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: ekonomi representment — kapan melawan Rp500rb?</summary>
        <p>Chargeback Rp500rb masuk. Opsi: (a) terima (rugi Rp500rb + fee Rp350rb), (b) lawan via representment (biaya dokumen &amp; admin Rp150rb, peluang menang 35%).</p>
        <p><strong>Langkah 1 — nilai ekspektasian melawan.</strong> E = 0,35 × Rp500rb − Rp150rb = Rp175rb − Rp150rb = <strong>+Rp25rb</strong>. Secara matematis: lawan!</p>
        <p><strong>Langkah 2 — tapi ada biaya tersembunyi.</strong> Win rate 35% adalah <em>rata-rata</em> — untuk reason code &ldquo;tidak mengenal transaksi&rdquo; dengan bukti AVS+CVV+device match, win rate 55%; untuk &ldquo;barang tidak diterima&rdquo; tanpa resi, win rate 12%. Hitung <strong>per reason code</strong>, bukan rata-rata.</p>
        <p><strong>Langkah 3 — aturan operasional.</strong> Lawan jika: (nilai × win_rate_reason_code) &gt; biaya + Rp50rb margin. Untuk Rp500rb dengan win rate 55%: Rp275rb &gt; Rp200rb → <strong>lawan</strong>. Dengan win rate 12%: Rp60rb &lt; Rp200rb → <strong>terima &amp; fokus cegah</strong>. Dan: <strong>first-party fraud yang terbukti</strong> (pelanggan berbohong) → lawan <em>selalu</em> (bukan soal rupiah — soal memberi sinyal bahwa berbohong tidak gratis).</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Chargeback adalah Cermin</h2>
      <p>Setiap chargeback adalah <strong>surat dari masa depan yang gagal dicegah</strong> — ia menceritakan <em>di mana</em> pertahananmu bocor, 30-90 hari setelah kebocoran terjadi. Merchant yang hanya &ldquo;mengurus&rdquo; chargeback = membaca surat lalu membuangnya. Merchant yang <strong>membaca polanya</strong> = memperbaiki atap sebelum hujan berikutnya. <strong>Reason code adalah diagnosis; pola reason code adalah prognosis.</strong></p>
      <p>Intuisi kedua: <strong>chargeback punya dua wajah</strong> — <em>biaya</em> (uang hilang + fee) dan <em>informasi</em> (pola serangan + kelemahan produk). Kebanyakan merchant hanya melihat wajah pertama. Padahal wajah kedua sering <em>lebih berharga</em>: lonjakan &ldquo;tidak mengenal transaksi&rdquo; = serangan carding aktif; lonjakan &ldquo;barang tidak diterima&rdquo; = masalah logistik <em>atau</em> friendly fraud terorganisir. <strong>Bayar untuk informasinya dengan membaca; jangan bayar dua kali dengan mengabaikan.</strong></p>
      <p><strong>Kapan strategi chargeback standar TIDAK berlaku:</strong> (1) <strong>digital goods instan</strong> — tidak ada &ldquo;pengiriman&rdquo; yang bisa dibuktikan; pertahanannya = 3DS + device, bukan representment; (2) <strong>langganan</strong> — mayoritas chargeback = kegagalan UX pembatalan, bukan fraud; perbaiki produk, bukan tim dispute; (3) <strong>nilai mikro</strong> — biaya melawan &gt; nilai; terima + cegah massal via pola. <strong>Kenali <em>jenis</em> bisnismu sebelum menyalin playbook orang.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> buat <strong>dashboard reason code mingguan</strong> — tren per kategori, win rate per kategori, biaya per kategori. <strong>Dashboard ini adalah rapat strategi fraud-mu yang paling jujur</strong> — ia tidak bisa dibohongi dengan narasi.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Lawan atau Relakan?</h2>

      <div className="decision-card">
        <h3>1. Kategori 12.x/13.x + bukti kuat → <strong>lawan (representment)</strong></h3>
        <p><strong>Kenapa:</strong> win rate 38–45%, expected value positif.</p>
      </div>

      <div className="decision-card">
        <h3>2. Kategori 10.x (fraud) tanpa 3DS → <strong>relakan; investasi di pencegahan</strong></h3>
        <p><strong>Kenapa:</strong> win rate 18% — biaya melawan &gt; ekspektasi kembali. Perkuat 3DS untuk liability shift.</p>
      </div>

      <div className="decision-card">
        <h3>3. Nilai kecil (&lt; biaya representment) → <strong>relakan (kecuali preseden)</strong></h3>
        <p><strong>Kenapa:</strong> <Tex math={String.raw`w \cdot \bar{L} < C_{\text{rep}}`} /> = taruhan rugi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Rasio chargeback dekati ambang VDMP → <strong>mode krisis: pencegahan hulu</strong></h3>
        <p><strong>Kenapa:</strong> taruhannya bukan uang — tapi <strong>hak menerima kartu</strong>. 3DS + CS + deskripsi jelas, segera.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Chargeback = <strong>babak pertama</strong>, bukan vonis.</li>
          <li>Reason code menentukan <strong>strategi</strong>: 10.x = cegah; 12.x/13.x = lawan.</li>
          <li>Lawan jika <Tex math={String.raw`w \cdot \bar{L} > C_{\text{rep}}`} />.</li>
          <li>Bukti dikumpulkan <strong>saat transaksi</strong>, bukan saat sengketa.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Strategi per Reason Code</h2>
      <p>Tidak semua chargeback diperlakukan sama. Tiga skenario:</p>
      <p><strong>Skenario A — &ldquo;tidak mengenal transaksi&rdquo; (10.4).</strong> Ini <strong>third-party fraud</strong> klasik. Respons: lawan dengan bukti teknis (AVS, CVV, device fingerprint, IP geolocation) — win rate tertinggi (40–60%). Paralel: perkuat 3-D Secure untuk pola ini. <em>Jangan</em> salahkan CS — ini serangan, bukan layanan.</p>
      <p><strong>Skenario B — &ldquo;barang tidak diterima&rdquo; (13.3).</strong> Dua kemungkinan: merchant memang lalai (perbaiki logistik!) atau <strong>friendly fraud</strong> (pelanggan terima barang lalu menyangkal). Pembedanya: resi + foto serah terima + histori pelanggan. Jika bukti pengiriman kuat → lawan agresif + tandai pelanggan. Jika lemah → terima, perbaiki SOP, jangan ulangi.</p>
      <p><strong>Skenario C — &ldquo;langganan dibatalkan tapi tetap ditagih&rdquo;.</strong> Ini <strong>bukan fraud</strong> — ini kegagalan produk/billing. Melawan = membuang uang + merusak reputasi. Respons benar: perbaiki alur pembatalan (satu klik, konfirmasi jelas), refund proaktif sebelum jadi chargeback. Setiap chargeback kategori ini = <strong>bug produk yang menagihmu Rp850rb</strong> (nilai + fee).</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Chargeback selalu salah merchant — terima saja, jangan dilawan.&rdquo;<br /><strong>Yang benar:</strong> 20–40% chargeback di e-commerce adalah <strong>friendly fraud</strong> — pelanggan yang berbohong. Menerima semua = <strong>mensubsidi kebohongan</strong> dan mengundang pengulangan. Lawan yang layak dilawan (dengan bukti), terima yang memang salahmu, cegah yang bisa dicegah. Tiga kata kerja, tiga nasib berbeda.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Travel Online &amp; Gelombang Januari</h2>
      <p>Pola tahunan di OTA (online travel agent) Indonesia: <strong>Januari–Februari</strong> = gelombang chargeback untuk booking hotel &amp; tiket <strong>November–Desember</strong> (liburan akhir tahun).</p>
      <p><strong>Anatomi (pola umum):</strong> pelanggan memesan hotel Rp4jt untuk liburan → menginap &amp; menikmati → Januari mengajukan chargeback &ldquo;tidak mengenal transaksi&rdquo;. Bukti OTA: login dari device &amp; IP yang sama dengan histori, e-tiket dibuka 12×, check-in terkonfirmasi properti. <strong>Ini bukan pencurian — ini penyesalan yang dibungkus kebohongan.</strong></p>
      <p><strong>Angka ilustratif:</strong> 400 chargeback &ldquo;liburan&rdquo; × Rp4jt = <strong>Rp1,6 M</strong> per musim. Win rate representment dengan bukti digital lengkap: 62% → Rp992jt kembali. Biaya: Rp60jt admin. <strong>Net: +Rp932jt</strong> — dari &ldquo;pekerjaan admin&rdquo; yang sering diremehkan.</p>
      <p><strong>Pelajaran sistemik:</strong> (1) <strong>kumpulkan bukti <em>sebelum</em> dibutuhkan</strong>: log device, IP, pembukaan e-tiket, konfirmasi properti — semua otomatis tersimpan; representment tanpa bukti = donasi. (2) <strong>tandai &amp; bagikan</strong>: pelanggan friendly fraud masuk daftar pantau — transaksi berikutnya butuh verifikasi ekstra. (3) <strong>komunikasikan ke pelanggan</strong>: &ldquo;kami mencatat pola ini&rdquo; adalah deterrent yang murah &amp; legal. Pencegahan terbaik = penjahat tahu kamu <em>melihat</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> chargeback adalah <strong>satu-satunya jenis fraud yang mengirimimu tagihan rinci</strong> — reason code, nominal, tenggat. Perlakukan setiap chargeback sebagai <em>laporan intelijen gratis</em>: pola reason code = peta kelemahan bisnismu. Yang hanya &ldquo;mengurus&rdquo; chargeback rugi dua kali; yang <em>membacanya</em> untung dari pelajarannya.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 1.000 Chargeback, Budget Terbatas</h2>
      <div className="callout">
        <p>TokoMaju: 1.000 chargeback kuartal ini (total Rp1,1 M). Komposisi: 600× kategori 10.4 (fraud, rata-rata Rp1,2 jt), 250× kategori 13.1 (barang tak sampai, Rp900 rb), 150× kategori 12.6 (double charge, Rp800 rb). Budget representment: <strong>400 kasus</strong> (biaya Rp150 rb/kasus). Bukti tersedia: resi lengkap untuk 13.1; log sistem untuk 12.6; 3DS hanya untuk 100 dari 600 kasus 10.4.</p>
        <p><strong>Pertanyaan:</strong> alokasikan 400 slot. Hitung ekspektasi kembali.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Prioritas by expected value:</strong></p>
          <ul>
            <li><strong>12.6 (150 kasus):</strong> win 45% × Rp800 rb = Rp360 rb ekspektasi &gt; Rp150 rb biaya → <strong>ambil semua 150</strong>. Kembali ≈ 150×0,45×800rb = <strong>Rp54 jt</strong>.</li>
            <li><strong>13.1 (250 kasus):</strong> win 38% × Rp900 rb = Rp342 rb &gt; Rp150 rb → <strong>ambil semua 250</strong>. Kembali ≈ 250×0,38×900rb = <strong>Rp85,5 jt</strong>.</li>
            <li><strong>10.4:</strong> sisa slot 0! Tapi jika ada: hanya 100 dengan 3DS (win ~30% × Rp1,2 jt = Rp360 rb &gt; biaya → layak; tanpa 3DS: 18% × 1,2jt = Rp216 rb &gt; Rp150 rb — <em>masih</em> layak secara ekspektasi, tapi prioritas setelah 12.x/13.x).</li>
          </ul>
          <p><strong>Total kembali ≈ Rp139,5 jt</strong> dari 400 kasus (biaya Rp60 jt) — <strong>net +Rp79,5 jt</strong>. <strong>Pelajaran:</strong> alokasi = portofolio expected value. &ldquo;Melawan semua&rdquo; = buang slot ke kasus negatif-EV; &ldquo;tidak melawan&rdquo; = buang Rp139 jt.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Chargeback</h2>
      <details className="worked">
        <summary>Q1: Win rate representment yang &ldquo;bagus&rdquo; itu berapa?</summary>
        <p><strong>Benchmark kasar:</strong> 30-45% untuk portofolio campuran; 50-65% untuk &ldquo;tidak mengenal transaksi&rdquo; dengan bukti teknis lengkap (3DS, device match); &lt; 20% untuk &ldquo;barang tidak diterima&rdquo; tanpa resi. Tapi yang lebih penting dari angka absolut: <strong>trennya</strong> — win rate turun 3 bulan beruntun = kualitas bukti atau pola serangan berubah. <em>Ukur per reason code, bukan rata-rata.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: Apakah 3-D Secure menghilangkan chargeback fraud?</summary>
        <p><strong>Mengurangi drastis, tidak menghilangkan.</strong> 3DS menggeser <em>liability</em> ke penerbit (issuer) untuk transaksi terautentikasi — merchant terlindungi dari &ldquo;tidak mengenal transaksi&rdquo;. Tapi: (1) <strong>friction</strong> — konversi bisa turun 5-15% jika UX buruk; (2) tidak melindungi dari <em>friendly fraud</em> (&ldquo;barang tidak diterima&rdquo;); (3) penjahat beralih ke <em>merchant tanpa 3DS</em>. <strong>3DS = helm yang bagus — tetap butuh pengendara yang waspada.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Friendly fraud — bagaimana membuktikannya?</summary>
        <p><strong>Tiga lapis bukti:</strong> (1) <em>teknis</em> — device/IP sama dengan histori, login &amp; pemakaian tercatat; (2) <em>perilaku</em> — e-tiket dibuka berkali-kali, barang diterima (resi + foto); (3) <em>riwayat</em> — pola dispute berulang pelanggan ini. <strong>Kumpulkan ketiganya <em>sebelum</em> dibutuhkan</strong> — logging yang baik = amunisi representment. Dan: tandai pelakunya — <em>pencegahan berikutnya lebih murah dari pembuktian ini</em>.</p>
      </details>
      <details className="worked">
        <summary>Q4: Biaya total chargeback — apa saja yang dihitung?</summary>
        <p><strong>Lima komponen:</strong> (1) nilai transaksi hilang; (2) fee chargeback (Rp200-500rb per kasus); (3) biaya representment (admin + dokumen); (4) biaya operasional (tim dispute); (5) <strong>risiko program monitoring</strong> (denda + pembatasan). Kebanyakan merchant hanya menghitung (1) — padahal (2)-(5) bisa <strong>menggandakan</strong> total. <em>Hitung semuanya — baru keputusannya jujur.</em></p>
      </details>

      <details className="worked">
        <summary>Q5: Apa bedanya representment, pre-arbitration, dan arbitration?</summary>
        <p><strong>Tiga tingkat sengketa:</strong> (1) <em>representment</em> — merchant melawan chargeback dengan bukti (biaya rendah); (2) <em>pre-arbitration</em> — issuer menolak representment, merchant melawan lagi (biaya naik); (3) <em>arbitration</em> — skema kartu memutuskan (biaya tinggi + yang kalah bayar fee). <strong>Aturan ekonomi:</strong> naik tingkat hanya jika (nilai x peluang menang) &gt; biaya kumulatif. <em>Kebanyakan kasus berhenti di tingkat 1 — dan itu benar.</em></p>
      </details>
      <details className="worked">
        <summary>Q6: Bagaimana 3-D Secure menurunkan chargeback — dan apa harganya?</summary>
        <p><strong>Manfaat:</strong> transaksi terautentikasi → <em>liability shift</em> ke issuer untuk &ldquo;tidak mengenal transaksi&rdquo; → chargeback fraud turun 70-90%. <strong>Harga:</strong> friction — setiap langkah autentikasi tambahan menurunkan konversi 3-10% (terutama versi lama). <strong>Strategi modern:</strong> <em>risk-based 3DS</em> — hanya tantang transaksi berisiko (frictionless untuk yang aman). <em>Keamanan tanpa membunuh konversi.</em></p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Ekonomi Chargeback</h2>
      <p><strong>1.</strong> 25.000 transaksi/bulan, 40 chargeback. Hitung chargeback rate (%, bps). Aman dari program monitoring? Tapi berapa biaya totalnya (nilai rata-rata Rp800rb, fee Rp350rb)?</p>
      <p><strong>2.</strong> Chargeback Rp2jt, reason &ldquo;tidak mengenal transaksi&rdquo;, bukti 3DS + device match lengkap (win rate 55%), biaya representment Rp150rb. Lawan atau terima? Hitung.</p>
      <p><strong>3.</strong> Reason code &ldquo;langganan dibatalkan tapi tetap ditagih&rdquo; naik 3x dalam 2 bulan. Ini fraud atau bukan? Apa respons pertamamu — ke tim dispute atau tim produk?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Rate = 40/25.000 = <strong>0,16% = 16 bps</strong> — jauh di bawah ambang program (±0,9%). Tapi biaya = 40 x (800rb+350rb) = <strong>Rp46jt/bulan = Rp552jt/tahun</strong>. <em>Aman dari program bukan berarti tidak masalah.</em></p>
        <p><strong>2.</strong> E = 0,55 x 2jt - 150rb = 1,1jt - 150rb = <strong>+Rp950rb → LAWAN</strong>. Dengan bukti kuat, ini <em>investasi</em> bukan biaya.</p>
        <p><strong>3.</strong> <strong>Bukan fraud — ini bug produk/billing.</strong> Respons pertama: <strong>tim produk</strong> (perbaiki alur pembatalan!) + refund proaktif. Melawan chargeback-nya = membuang uang. <em>Setiap chargeback kategori ini = bug yang menagihmu Rp850rb+.</em></p>
      </details>

      <p><strong>4.</strong> Merchant voucher digital: 200 chargeback/bulan &ldquo;tidak mengenal transaksi&rdquo;, win rate representment hanya 18%. Tulis strategi 3 langkah (bukan sekadar &ldquo;lawan lebih giat&rdquo;).</p>
      <details className="worked">
        <summary>Jawaban</summary>
        <p>(1) <strong>Aktifkan 3DS risk-based</strong> — voucher digital = tidak ada bukti pengiriman; satu-satunya bukti kuat adalah autentikasi. (2) <strong>Velocity + device check pre-purchase</strong> — cegah sebelum terjadi. (3) <strong>Terima sisa yang lolos sebagai biaya</strong> — win rate 18% artinya melawan = membuang uang; alihkan budget ke pencegahan. <em>Strategi &gt; semangat.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 65% chargeback tidak pernah dilawan (representment). Apa kebocoran terbesarnya?"
        options={[
          "Kalah sengketa",
          "'Tidak pernah melawan' — uang yang bisa kembali (Rp167 jt di kasus TokoMaju) hilang karena disiplin proses, bukan karena kalah argumen",
          "Biaya representment",
          "Tidak ada",
        ]}
        correct={1}
        explanation="Benar: kebocoran = tidak melawan. Dari 1.000 chargeback, 350 dilawan. Disiplin proses (lawan yang layak) > kehebatan argumen."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Chargeback kategori 10.4 (fraud) tanpa 3DS. Strategi terbaik?"
        options={[
          "Lawan semua — pantang menyerah",
          "Relakan perlawanannya; investasi di PENCEGAHAN (3DS untuk liability shift) — win rate 18% tidak menutup biaya",
          "Abaikan",
          "Tuntut issuer",
        ]}
        correct={1}
        explanation="Benar: reason code menentukan strategi. 10.x = medan perang yang merugikan; menangkan perangnya di hulu (3DS), bukan di meja sengketa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan representment TIDAK layak secara ekonomi?"
        options={[
          "Selalu layak",
          "Jika w × L < C_rep — ekspektasi kembali lebih kecil dari biaya melawan (mis. chargeback Rp100rb, biaya Rp150rb)",
          "Jika win rate tinggi",
          "Tidak pernah",
        ]}
        correct={1}
        explanation="Benar: representment = investasi. Taruhan dengan expected value negatif = bakar uang. Hitung dulu, baru lawan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Apa itu 'compelling evidence' dan kapan dikumpulkan?"
        options={[
          "Bukti seadanya, dikumpulkan saat sengketa",
          "Bukti yang memenangkan sengketa (resi+bukti terima, 3DS, log) — DIKUMPULKAN SAAT TRANSAKSI, bukan saat sengketa",
          "Surat pengacara",
          "Tidak penting",
        ]}
        correct={1}
        explanation="Benar: bukti = disiapkan di hulu. Resi yang tidak disimpan = perang yang kalah sebelum mulai. Sistem baik menyimpan 'paket bukti' otomatis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Rasio chargeback merchant mendekati ambang VDMP Visa. Taruhannya?"
        options={[
          "Hanya uang",
          "EKSISTENSIAL — denda + bisa dicabut hak terima kartu. Respons: mode krisis pencegahan hulu (3DS, CS, deskripsi jelas)",
          "Tidak ada",
          "Pindah network",
        ]}
        correct={1}
        explanation="Benar: chargeback rate = metrik kesehatan yang diawasi network. Di ambang batas, taruhannya bukan 'uang hilang' tapi 'bisnis kartu'."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>4 babak:</strong> chargeback → representment → pre-arbitration → arbitration.</li>
          <li><strong>Reason code</strong> menentukan strategi: 10.x = cegah; 12.x/13.x = lawan (win 38–45%).</li>
          <li><strong>Net loss</strong> = gross − kembali + biaya; lawan jika <Tex math={String.raw`w\cdot\bar{L} > C_{\text{rep}}`} />.</li>
          <li><strong>Bukti dikumpulkan saat transaksi</strong> — paket bukti otomatis.</li>
          <li><strong>VDMP/ECP:</strong> rasio chargeback = metrik eksistensial, bukan sekadar uang.</li>
          <li>Chargeback = <strong>label + metrik + peluang recovery</strong> — ranah analis, bukan cuma finance.</li>
          <li>Kapan TIDAK melawan: EV negatif atau kategori 10.x tanpa bukti — alihkan ke pencegahan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr21-sql-fraud" className="btn btn-secondary btn-sm">← FR21</Link>
        <Link href="/learn/fr23-regulasi-indonesia" className="btn btn-primary btn-sm">Next: FR23 →</Link>
      </div>
    </div>
  );
}
