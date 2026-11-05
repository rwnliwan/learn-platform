"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr7bPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const cutoffData = [
    {
      x: [500, 550, 600, 650, 700, 750],
      y: [85, 78, 68, 55, 40, 25],
      type: "scatter",
      mode: "lines+markers",
      name: "Approval rate (%)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [500, 550, 600, 650, 700, 750],
      y: [12, 9, 6.5, 4.2, 2.5, 1.5],
      type: "scatter",
      mode: "lines+markers",
      name: "Bad rate di yang di-ACC (%)",
      line: { color: "#ef4444", width: 3 },
      yaxis: "y2",
    },
  ];

  const ksData = [
    {
      x: [400, 450, 500, 550, 600, 650, 700, 750, 800],
      y: [2, 8, 20, 38, 60, 78, 90, 97, 100],
      type: "scatter",
      mode: "lines",
      name: "Kumulatif Good",
      line: { color: "#3aa655", width: 3 },
    },
    {
      x: [400, 450, 500, 550, 600, 650, 700, 750, 800],
      y: [15, 35, 58, 78, 90, 96, 99, 100, 100],
      type: "scatter",
      mode: "lines",
      name: "Kumulatif Bad",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const swapSetData = [
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [0.55, 0.52, 0.38, 0.30],
      type: "bar",
      marker: { color: ["#3aa655", "#3aa655", "#e8a838", "#ef4444"] },
      text: ["0,55", "0,52", "0,38", "0,30"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: PDO scaling — dari log-odds ke skor "cantik"
# Rumus industri: Skor = Offset + Factor * log-odds(good)
# Syarat: PDO=20 (skor +20 saat odds double), skor 600 <-> odds 50:1
import math

pdo = 20
base_odds = 50      # odds 50:1 pada skor 600
base_score = 600

factor = pdo / math.log(2)
offset = base_score - factor * math.log(base_odds)

def to_score(p_good):
    odds = p_good / (1 - p_good)
    return offset + factor * math.log(odds)

print(f"Factor = {factor:.2f}, Offset = {offset:.2f}")
print(f"{'Peluang lancar':<15} {'Skor':>6}")
for p in [0.99, 0.97, 0.95, 0.90, 0.80, 0.60]:
    print(f"{p*100:<14.0f}% {to_score(p):>6.0f}")
print()
print("Cek: peluang 98.04% (odds 50:1) -> skor", round(to_score(50/51)))
print("Coba: ubah pdo jadi 30. Skor jadi lebih 'meregang' —")
print("beda risiko yang sama terlihat lebih besar. PDO = 'zoom' skor.")`;

  const lab2Code = `# Lab 2: Simulasi cut-off — approval vs bad rate
# 10.000 aplikan dengan skor & status. Cari cut-off terbaik.
import random
random.seed(11)

# Bangkitkan populasi: skor ~ normal(620, 80); bad prob turun dgn skor
import math
aplikan = []
for _ in range(10000):
    skor = int(random.gauss(620, 80))
    p_bad = 1 / (1 + math.exp((skor - 550) / 45))
    aplikan.append((skor, random.random() < p_bad))

print(f"{'Cut-off':<8} {'Approval':>9} {'Bad rate':>9}")
for co in [550, 600, 650, 700]:
    acc = [b for s, b in aplikan if s >= co]
    appr = len(acc) / len(aplikan) * 100
    bad = sum(acc) / len(acc) * 100 if acc else 0
    print(f"{co:<8} {appr:>8.1f}% {bad:>8.2f}%")
print()
print("Coba: cut-off 575, 625, 675. Rasakan trade-off-nya:")
print("tiap +50 poin cut-off, bad rate turun ~2-3 poin TAPI")
print("approval turun ~10-15 poin. Tidak ada yang gratis.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR7b — Credit Risk Analyst • Scorecard Part 2</span>
        <h1 className="display-title">Scorecard Part 2:<br />Skala Skor PDO, Cut-off &amp; Monitoring</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Skor 650 — Angka Keramat yang Diperdebatkan</a></li>
          <li><a href="#pdo">PDO Scaling: Menyulap Peluang Jadi Skor Cantik</a></li>
          <li><a href="#cutoff">Cut-off: Garis Hidup-Mati yang Penuh Trade-off</a></li>
          <li><a href="#validasi">Validasi Diskriminasi: KS, Gini &amp; Swap Set</a></li>
          <li><a href="#monitoring">Monitoring: Scorecard Bisa Kedaluwarsa</a></li>
          <li><a href="#lab1">🔬 Lab 1: PDO Scaling</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Cut-off</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Menetapkan &amp; Menjaga Cut-off</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Cut-off Diturunkan Demi Target</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan rumus PDO scaling dan menghitung skor dari peluang (dan sebaliknya).</li>
          <li>Menganalisis trade-off cut-off: approval rate vs bad rate, dan memilih cut-off berbasis biaya.</li>
          <li>Menghitung/menginterpretasikan KS dan Gini sebagai ukuran daya beda model.</li>
          <li>Menjelaskan mengapa scorecard perlu dimonitor (population stability, swap set) dan kapan harus dibangun ulang.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Skor 650 — Angka Keramat yang Diperdebatkan</h2>
      <div className="story">
        <p>Rapat direksi Bank Nusantara memanas. Tim bisnis mengusulkan: <em>"Turunkan cut-off KTA dari 650 ke 620! Approval naik 15%, target tercapai!"</em> Tim risiko menolak: <em>"Bad rate naik dari 4% ke 7% — NPL meledak 6 bulan lagi!"</em></p>
        <p>Direktur utama menoleh ke analis Rina: <em>"Kamu yang buat modelnya. Angka 650 itu datang dari mana? Kenapa bukan 640 atau 660?"</em></p>
        <p>Rina menarik napas. <em>"650 bukan angka keramat, Pak. Ia adalah titik di mana <strong>keuntungan dari nasabah yang di-ACC sama dengan kerugian dari yang macet</strong>. Turunkan ke 620, dan tiap nasabah tambahan justru <strong>merugikan</strong> bank Rp 2 juta."</em> Ruangan hening. Bisnis meminta buktinya. Rina membuka laptop...</p>
        <p><strong>Twist-nya:</strong> di balik satu angka "650" ada <strong>matematika trade-off</strong> yang bisa dihitung — bukan firasat. Part 2 ini mengajarkan cara menghitungnya, plus cara mengubah peluang model menjadi skor yang dimengerti manusia.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="pdo">PDO Scaling: Menyulap Peluang Jadi Skor Cantik</h2>
      <p><strong>Definisi.</strong> Model logistik menghasilkan <strong>peluang</strong> (0–100%) — sulit dicerna bisnis ("PD 3,7%" tidak intuitif). <strong>PDO scaling</strong> mengubahnya menjadi <strong>skor</strong> (misal 300–850) dengan dua parameter:</p>
      <ul>
        <li><strong>PDO</strong> (<em>Points to Double Odds</em>): berapa poin skor untuk <strong>menggandakan odds</strong> kelancaran. PDO 20 = tiap +20 poin, odds lancar 2× lipat.</li>
        <li><strong>Base score &amp; base odds</strong>: titik jangkar — misal skor 600 ↔ odds 50:1.</li>
      </ul>
      <Tex math={String.raw`\text{Skor} = \text{Offset} + \text{Factor} \times \ln(\text{odds})`} block />
      <p><strong>Artinya tiap simbol:</strong> odds = p_lancar / p_default; <Tex math={String.raw`\text{Factor} = \frac{\text{PDO}}{\ln 2}`} /> (PDO 20 → factor ≈ 28,85); <Tex math={String.raw`\text{Offset} = 600 - \text{Factor} \times \ln(50)`} /> (agar odds 50:1 tepat skor 600).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>PDO 20, base 600 ↔ odds 50:1. Nasabah dengan peluang lancar 98% (PD 2%).</p>
        <p><strong>Langkah 1</strong> — odds = 0,98/0,02 = 49 ≈ 50:1.<br />
        <strong>Langkah 2</strong> — factor = 20/ln(2) = 28,85; offset = 600 − 28,85×ln(50) = 487,2.<br />
        <strong>Langkah 3</strong> — skor = 487,2 + 28,85×ln(49) = <strong>≈ 599</strong> ✓ (mendekati 600, sesuai jangkar).</p>
        <p>Artinya intuitif: <strong>skor 620 vs 600 = odds 2× lipat</strong> (karena PDO 20). Bisnis langsung paham: "nasabah 620 dua kali lebih aman dari 600".</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> PDO adalah <strong>"zoom"</strong> skor. PDO besar (30) = skor meregang — beda risiko kecil terlihat besar (bagus untuk diferensiasi halus, tapi skor jadi "loncat-loncat"). PDO kecil (15) = skor memadat. Industri Indonesia umum memakai PDO 15–25. Yang penting: <strong>konsisten</strong> — jangan ganti PDO tiap tahun, atau tren skor tidak bisa dibandingkan.</p>
      </div>

      <h2 id="cutoff">Cut-off: Garis Hidup-Mati yang Penuh Trade-off</h2>
      <p><strong>Definisi.</strong> Cut-off = skor minimum untuk ACC. Di atasnya diterima, di bawahnya ditolak. Menentukan dua metrik yang <strong>tarik-menarik</strong>:</p>
      <ul>
        <li><strong>Approval rate</strong> = % aplikan yang di-ACC (bisnis suka tinggi).</li>
        <li><strong>Bad rate</strong> = % dari yang di-ACC yang akhirnya default (risiko suka rendah).</li>
      </ul>
      <p><strong>Cara rasional memilih cut-off:</strong> hitung <strong>profit per skor</strong> — pendapatan bunga dari yang lancar <em>minus</em> kerugian dari yang macet. Cut-off optimal = titik di mana nasabah marjinal <strong>impas</strong> (profit = 0). Di bawah titik itu, tiap ACC tambahan = bakar uang.</p>

      <PlotlyChart
        data={cutoffData}
        title="Trade-off Cut-off: Approval vs Bad Rate"
        layout={{ xaxis: { title: "Cut-off skor" }, yaxis: { title: "Approval rate (%)" }, yaxis2: { title: "Bad rate (%)", overlaying: "y", side: "right" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru (kiri) = approval rate; garis merah (kanan) = bad rate. Geser cut-off ke kanan = makin ketat.</p>
        <p><strong>Interpretasi:</strong> cut-off 550 → approval 85% tapi bad rate 12% (mengerikan). Cut-off 750 → bad rate 1,5% tapi approval cuma 25% (bisnis mati). <strong>Zona rasional: 600–700</strong> — di sinilah analisis profit marjinal menentukan angka pastinya. Perhatikan: hubungan <strong>non-linear</strong> — menurunkan cut-off di daerah rendah jauh lebih "mahal" (bad rate meledak) dibanding di daerah tinggi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Cut-off harus memaksimalkan akurasi model."</strong></p>
        <p><strong>Yang benar:</strong> cut-off memaksimalkan <strong>profit</strong>, bukan akurasi. Menolak nasabah bagus (false negative) = kehilangan bunga; menerima nasabah jelek (false positive) = kehilangan pokok. Karena <strong>biayanya tidak simetris</strong> (pokok &gt;&gt; bunga), cut-off optimal biasanya <em>lebih ketat</em> dari yang memaksimalkan akurasi. Inilah <em>cost-sensitive decision</em> — favorit soal interview.</p>
      </div>

      <h2 id="validasi">Validasi Diskriminasi: KS, Gini &amp; Swap Set</h2>
      <p><strong>KS (<em>Kolmogorov-Smirnov</em>):</strong> jarak maksimum antara kurva kumulatif Good vs Bad. KS 45% = pada skor tertentu, 45% lebih banyak Good yang sudah "terkumpul" dibanding Bad — model memisahkan dengan baik. Patokan: &lt;20% lemah, 20–40% sedang, 40–60% kuat, &gt;60% curigai (leakage?).</p>
      <p><strong>Gini:</strong> = 2×AUC − 1. Mengukur daya beda keseluruhan. Gini 0,55 (AUC 0,775) = standar bagus scorecard retail Indonesia. Gini = 0 berarti model tidak lebih baik dari koin.</p>
      <p><strong>Swap set analysis:</strong> bandingkan keputusan model <strong>baru vs lama</strong> — siapa yang "ditukar" (dulu ditolak sekarang ACC, dan sebaliknya)? Swap set yang sehat: yang masuk punya bad rate rendah, yang keluar punya bad rate tinggi.</p>

      <PlotlyChart
        data={ksData}
        title="Kurva KS: Jarak Maksimum Good vs Bad"
        layout={{ xaxis: { title: "Skor" }, yaxis: { title: "Kumulatif (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis hijau = kumulatif nasabah lancar, merah = kumulatif yang default, diurutkan dari skor terendah. Jarak vertikal terbesar = KS.</p>
        <p><strong>Interpretasi:</strong> jarak maksimum (~45 poin) terjadi di sekitar skor 550–600 — di sinilah model <strong>paling jago membedakan</strong>. Tidak kebetulan: daerah inilah biasanya cut-off berada. KS yang <strong>menyempit dari tahun ke tahun</strong> = model melemah (lihat monitoring di bawah).</p>
      </div>

      <h2 id="monitoring">Monitoring: Scorecard Bisa Kedaluwarsa</h2>
      <p><strong>Definisi.</strong> Scorecard dilatih dari data <strong>masa lalu</strong> — dunia berubah (ekonomi, perilaku, kompetitor, fraud). <strong>Monitoring</strong> = memeriksa tiap bulanapakah model masih valid:</p>
      <ul>
        <li><strong>PSI</strong> (<em>Population Stability Index</em>): apakah distribusi skor aplikan masih sama? PSI &gt;0,25 = populasi bergeser signifikan (model mungkin tidak relevan lagi).</li>
        <li><strong>Gini/KS out-of-time:</strong> daya beda di data terbaru — turun &gt;10 poin = alarm.</li>
        <li><strong>Bad rate per skor:</strong> apakah skor 650 masih berarti PD 4%? Kalau kini 7% = kalibrasi rusak.</li>
      </ul>
      <p><strong>Kepribadian:</strong> scorecard seperti <strong>vaksin</strong> — dibuat dari virus masa lalu, perlu <em>booster</em> (rebuild) saat virus bermutasi. Bank yang memakai scorecard 2019 untuk menilai aplikan 2026 tanpa monitoring = memakai peta 2019 untuk jalan 2026.</p>

      <PlotlyChart
        data={swapSetData}
        title="Ilustrasi Peluruhan Gini: Model Menua"
        layout={{ xaxis: { title: "Kuartal" }, yaxis: { title: "Gini out-of-time" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = Gini di data terbaru per kuartal (model dilatih 2024).</p>
        <p><strong>Interpretasi:</strong> Gini meluruh 0,55 → 0,30 dalam setahun — <strong>model kedaluwarsa</strong>. Penyebab umum: pergeseran populasi (segmen baru), perubahan perilaku (post-pandemi), atau <em>concept drift</em>. Aksi: rebuild dengan data terbaru (atau minimal rekalibrasi). Aturan praktis: <strong>rebuild tiap 1–2 tahun</strong>, monitor tiap bulan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Model sudah divalidasi sekali, aman selamanya."</strong></p>
        <p><strong>Yang benar:</strong> validasi awal hanya membuktikan model <em>pernah</em> bagus. OJK dan auditor meminta <strong>monitoring berkelanjutan</strong> — PSI, Gini out-of-time, bad rate per skor — dengan <em>action trigger</em> yang jelas. Model tanpa monitoring = mobil tanpa speedometer.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>diskriminasi</strong> (bisa membedakan bagus vs jelek — Gini/KS) dari <strong>kalibrasi</strong> (skor 650 benar-benar = PD 4% — CR10). Model bisa diskriminatif tapi miskalibrasi (ranking benar, angkanya meleset) — dan untuk ECL/CKPN, <strong>kalibrasi yang menentukan rupiahnya</strong>.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Cut-off adalah Kontrak Sosial</h3>
      <p>Cut-off terlihat seperti angka teknis. Sesungguhnya ia adalah <strong>kontrak antara divisi bisnis dan divisi risiko</strong>, ditulis dalam angka. Bisnis menandatangani "kami menerima bad rate X%"; risiko menandatangani "kami memberi approval Y%". Setiap kali cut-off digeser, kontrak itu dinegosiasi ulang — dengan konsekuensi nyata: menurunkan cut-off 20 poin = ribuan nasabah baru + puluhan miliar potensi kerugian. Analis yang mempresentasikan cut-off tanpa menghitung <strong>harga</strong> pergeserannya (berapa bad debt tambahan vs berapa bunga tambahan) sedang mempresentasikan setengah analisis.</p>
      <p>Intuisi kedua tentang PDO: mengapa industri repot-repot mengubah peluang menjadi skor 300–900? Karena <strong>manusia tidak berpikir dalam peluang</strong>. "PD 3,7%" tidak memicu intuisi; "skor 640" memicu ("di atas 600, lumayan"). PDO scaling adalah <strong>desain antarmuka</strong> untuk otak manusia — sama seperti suhu dalam Celsius vs Kelvin: angkanya berbeda, fisikanya sama, tetapi yang satu bisa dipakai sehari-hari. Analis yang paham ini tidak akan meremehkan "kosmetik" — kosmetik yang baik membuat model <strong>dipakai</strong>, dan model yang tidak dipakai = tidak ada gunanya.</p>
      <p>Intuisi ketiga: <strong>monitoring adalah pengakuan kerendahan hati</strong>. PSI, Gini out-of-time, bad rate per skor — semuanya berangkat dari premis: "modelku pasti akan kedaluwarsa, pertanyaannya kapan." Bank yang tidak memonitor bukan bank yang modelnya abadi — melainkan bank yang tidak tahu modelnya sudah mati. Seperti SIM yang harus diperpanjang: bukan karena kamu tiba-tiba tidak bisa menyetir, melainkan karena kondisi (jalan, kendaraan, aturan) berubah.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: PDO Scaling</h2>
      <p>Ubah peluang jadi skor — dan pahami arti "20 poin = 2× lipat".</p>
      <PyodideLab
        title="Lab 1 — Kalkulator PDO Scaling"
        hint="Coba: (1) verifikasi skor 600 ↔ odds 50:1. (2) Ubah pdo jadi 30 — bagaimana 'kerenggangan' skor berubah? (3) Hitung: nasabah PD 10% vs PD 5% — beda berapa poin skor?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Cut-off</h2>
      <p>10.000 aplikan simulasi. Kamu yang tentukan cut-off — rasakan tarik-menariknya.</p>
      <PyodideLab
        title="Lab 2 — Trade-off Approval vs Bad Rate"
        hint="Coba cut-off 575, 625, 675. Hitung 'harga' tiap penurunan 50 poin: berapa approval dikorbankan per 1 poin bad rate yang dihemat? Di titik mana harga jadi terlalu mahal?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Menetapkan &amp; Menjaga Cut-off</h2>

      <div className="decision-card">
        <h3>1. Menetapkan cut-off awal → <strong>analisis profit marjinal per skor</strong></h3>
        <p><strong>Kondisi:</strong> model baru mau deploy.</p>
        <p><strong>Cara:</strong> untuk tiap band skor, hitung: (pendapatan bunga × % lancar) − (kerugian × % default). Cut-off = skor terendah dengan profit ≥ 0. Sajikan sebagai tabel ke direksi — bukan "feeling".</p>
      </div>

      <div className="decision-card">
        <h3>2. Bisnis minta turunkan cut-off → <strong>minta mereka bayar "harganya"</strong></h3>
        <p><strong>Kondisi:</strong> tekanan target akuisisi.</p>
        <p><strong>Aksi:</strong> hitung Δ bad rate × outstanding = tambahan CKPN. Tanya balik: "siap menaikkan budget CKPN Rp X M?" Keputusan menjadi <strong>bisnis</strong> (risiko vs return), bukan perang opini.</p>
      </div>

      <div className="decision-card">
        <h3>3. PSI &gt;0,25 atau Gini turun &gt;10 poin → <strong>investigasi, siapkan rebuild</strong></h3>
        <p><strong>Kondisi:</strong> monitoring berbunyi.</p>
        <p><strong>Aksi:</strong> cek penyebab (segmen baru? perubahan form? fraud?). Sementara: naikkan cut-off sementara (pengaman) sambil rebuild dengan data terbaru.</p>
      </div>

      <div className="decision-card">
        <h3>4. Model baru vs lama → <strong>swap set analysis sebelum ganti</strong></h3>
        <p><strong>Kondisi:</strong> kandidat model pengganti.</p>
        <p><strong>Aksi:</strong> pastikan yang "masuk" (dulu tolak, kini ACC) memang berkualitas, dan yang "keluar" memang berisiko. Model baru dengan Gini lebih tinggi tapi swap set aneh = jangan deploy.</p>
      </div>

            <div className="decision-card">
        <h3>5. Fintech kompetitor menawarkan proses 5 menit tanpa survei → <strong>jangan panik menurunkan cut-off; adu kecepatan di tempat lain</strong></h3>
        <p><strong>Kondisi:</strong> kompetitor digital mencairkan KTA dalam 5 menit. Tim bisnis menekan: "turunkan cut-off kita supaya approval naik, atau kita kalah!"</p>
        <p><strong>Kenapa jangan:</strong> menurunkan cut-off = mengimpor risiko (bad rate naik) — sementara keunggulan kompetitor adalah <strong>kecepatan</strong>, bukan kelonggaran. Respons yang benar: percepat proses untuk nasabah <strong>di atas cut-off</strong> (auto-approve skor 700+ dalam 5 menit), pertahankan cut-off untuk zona abu-abu. Menurunkan standar demi kecepatan = menukar keunggulan sementara dengan kerugian permanen.</p>
        <p><strong>Contoh nyata:</strong> bank-bank yang ikut-ikutan "KTA 5 menit" dengan melonggarkan cut-off pada 2019–2021 menuai NPL-nya pada 2022–2023. Yang bertahan: mereka yang mengotomasi keputusan untuk skor tinggi, bukan yang menurunkan palang untuk semua.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>PDO = zoom skor.</strong> +PDO poin = odds 2× lipat. Jangan ganti-ganti.</li>
          <li><strong>Cut-off = titik impas profit</strong>, bukan titik akurasi maksimum.</li>
          <li><strong>Monitor tiap bulan</strong> (PSI, Gini OOT, bad rate per skor); rebuild tiap 1–2 tahun.</li>
          <li><strong>Diskriminasi ≠ kalibrasi.</strong> Ranking benar belum tentu angkanya benar.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Siklus Hidup Scorecard: Kalender Tahunan</h3>
      <p>Scorecard bukan 'bangun sekali, pakai selamanya'. Ini kalender wajibnya — tempel di dinding tim modeling.</p>
      <ol>
        <li><strong>Bulanan: PSI &amp; distribusi skor</strong> — PSI &gt;0,25 = investigasi. Distribusi bergeser = populasi berubah — model mungkin menilai dunia yang sudah tidak ada.</li>
        <li><strong>Kuartalan: Gini/KS out-of-time</strong> — Turun &gt;10 poin dari development = alarm. Jangan tunggu tahunan — kedaluwarsa tidak menunggu jadwal.</li>
        <li><strong>Kuartalan: bad rate per skor</strong> — Skor 650 masih = PD 4%? Jika kini 7% = kalibrasi rusak — rekalibrasi, bukan sekadar cut-off baru.</li>
        <li><strong>Semesteran: swap set analysis</strong> — Bandingkan dengan challenger model / data terbaru. Siapa yang 'ditukar' keputusannya — dan apakah pertukaran itu benar?</li>
        <li><strong>Tahunan: review cut-off</strong> — Profit per band dihitung ulang. Cut-off tahun lalu belum tentu optimal tahun ini — ekonomi berubah, cut-off ikut.</li>
        <li><strong>2–3 tahunan: rebuild</strong> — Siklus normal scorecard ritel. Lebih cepat jika: PSI kronis, strategi akuisisi berubah, atau produk baru.</li>
        <li><strong>Setiap ada perubahan strategi: review ad-hoc</strong> — Kanal baru, segmen baru, merger — semua memicu review. Model kedaluwarsa BERSAMA strategi bisnis.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> kalender ini = bukti governance ke OJK/auditor. Bank yang tidak punya kalender = bank yang tidak memonitor = temuan.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ PDO 20 vs PDO 30 — mana yang dipakai?</summary>
        <p>Tergantung kebutuhan: PDO 20 = <strong>skor 'padat'</strong> (beda risiko kecil = beda skor kecil) — cocok untuk populasi homogen. PDO 30 = <strong>skor 'meregang'</strong> — beda kecil terlihat besar, bagus untuk diferensiasi. Praktik Indonesia: PDO 20 umum untuk ritel. Yang penting: <strong>konsisten</strong> — jangan ganti PDO tiap tahun (skor tidak comparable).</p>
      </details>
      <details className="worked">
        <summary>❓ Cut-off optimal berubah tiap tahun — normal?</summary>
        <p>Normal — ekonomi, kompetisi, dan biaya berubah. Tetapi perubahan harus <strong>berbasis analisis profit</strong> (bukan 'feeling' atau tekanan target). Dan setiap perubahan = <strong>reject inference</strong> baru untuk wilayah yang dibuka (CR8!).</p>
      </details>
      <details className="worked">
        <summary>❓ Gini turun 5 poin — panik atau tidak?</summary>
        <p>Belum panik — <strong>waspada</strong>. Aturan praktis: turun &gt;10 poin = alarm (investigasi + siapkan rebuild); 5–10 poin = monitor ketat kuartalan. Satu titik tidak menentukan; <strong>tren 3 kuartal</strong> yang menentukan.</p>
      </details>
      <details className="worked">
        <summary>❓ Model baru vs lama — siapa yang memutuskan ganti?</summary>
        <p><strong>Komite risiko/model</strong> — bukan tim modeling sendirian. Keputusannya berbasis: swap set analysis + validasi independen + analisis biaya-manfaat (termasuk explainability). Model adalah <strong>aset bank</strong>, bukan mainan tim data.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Di Indonesia, angka "skor 600" bukan sekadar teori — ia hidup di ruang-ruang keputusan kredit setiap hari.</p>

      <h3>Angka Keramat di Industri Indonesia</h3>
      <p>Meski tiap bank punya kalibrasi sendiri, pola umumnya mirip: <strong>skor 600–650</strong> adalah zona cut-off untuk banyak produk ritel Indonesia. Di bawahnya = zona merah (tolak atau survei ketat), di atasnya = zona hijau. Nasabah yang skornya 595 vs 605 mengalami nasib berbeda total — padahal risiko aktualnya hampir sama. Inilah <strong>ketidakadilan inheren cut-off</strong>: garis tegas di atas spektrum kontinu.</p>
      <p>Praktik yang sehat (dan diawasi OJK dari sisi perlindungan konsumen): bank wajib bisa <strong>menjelaskan alasan penolakan</strong> secara umum ("riwayat kredit", "penghasilan tidak memenuhi") — tidak boleh "komputer bilang tidak". Inilah salah satu alasan scorecard logistik + binning tetap dominan di Indonesia dibanding model black-box: <strong>keputusan yang tidak bisa dijelaskan = keputusan yang tidak bisa dipertahankan</strong> saat nasabah protes atau OJK bertanya.</p>

      <h3>PSI dan Pergeseran Populasi: Kasus Digital Lending</h3>
      <p>Contoh nyata kedaluwarsa model: bank yang scorecard-nya dilatih dari data nasabah cabang (2018–2021) lalu membuka <strong>akuisisi digital</strong> (2022+). Populasi aplikan berubah total: lebih muda, lebih urban-digital, tanpa riwayat cabang. PSI meledak di atas 0,25 dalam 2 kuartal — distribusi skor bergeser karena <strong>populasinya</strong> bergeser, bukan karena modelnya rusak. Gini out-of-time anjlok 15 poin.</p>
      <p>Pelajaran: <strong>model tidak kedaluwarsa sendirian — ia kedaluwarsa bersama strategi bisnis</strong>. Setiap perubahan besar strategi akuisisi (kanal baru, segmen baru, produk baru) wajib memicu review model. Analis yang duduk di rapat strategi bukan "tukang hitung yang diajak" — melainkan <strong>penjaga gerbang</strong> yang memastikan strategi baru tidak menghancurkan model lama.</p>

      <h3>Swap Set: Bahasa Diplomasi Model Baru</h3>
      <p>Mengganti scorecard lama dengan yang baru selalu politis: tim bisnis takut approval turun, tim risiko takut bad rate naik. <strong>Swap set analysis</strong> adalah bahasa diplomasinya: ia menunjukkan <em>siapa tepatnya</em> yang nasibnya berubah — "dari 10.000 aplikan, 800 yang dulu ditolak kini di-ACC (dengan bad rate estimasi 6%), 500 yang dulu di-ACC kini ditolak". Angka konkret ini mengubah debat abstrak ("model baru lebih baik") menjadi negosiasi konkret ("apakah kita mau 800 nasabah ini dengan risiko 6%?"). Model baru yang tidak bisa melewati swap set = model yang belum siap produksi, sebaik apapun Gini-nya.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: memilih cut-off dari profit (klik untuk buka)</summary>
        <p>Data per band skor (10.000 aplikan):</p>
        <p>Band 550–600: 2.000 aplikan, bad rate 12%. Band 600–650: 3.000 aplikan, bad rate 6%. Band 650+: 5.000 aplikan, bad rate 2%. Asumsi: tiap nasabah lancar memberi profit Rp 2 jt, tiap default rugi Rp 15 jt.</p>
        <p><strong>Langkah 1</strong> — profit/band = (lancar × 2 jt) − (default × 15 jt):<br />
        550–600: (1.760 × 2) − (240 × 15) = 3.520 − 3.600 = <strong>−Rp 80 jt</strong> (rugi!).<br />
        600–650: (2.820 × 2) − (180 × 15) = 5.640 − 2.700 = <strong>+Rp 2.940 jt</strong>.<br />
        650+: (4.900 × 2) − (100 × 15) = 9.800 − 1.500 = <strong>+Rp 8.300 jt</strong>.</p>
        <p><strong>Langkah 2</strong> — cut-off optimal ≈ <strong>600</strong>: band 550–600 merugi, band di atasnya untung.</p>
        <p><strong>Pelajaran:</strong> cut-off bukan soal "risiko rendah", melainkan <strong>profit marjinal = 0</strong>. Band yang profitnya negatif ditolak — meski 88% anggotanya lancar. Inilah kekejaman aritmetika cut-off.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> simpan kalimat ini untuk komite kredit: "Setiap 10 poin penurunan cut-off menambah Rp X miliar pendapatan bunga dan Rp Y miliar expected loss." Analis yang bisa mengucapkan kalimat ini mengendalikan ruangan — karena ia menerjemahkan statistik menjadi <strong>bahasa uang</strong>.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Cut-off Diturunkan Demi Target</h2>
      <div className="callout">
        <p>Q3 2026, direksi Bank Nusantara <strong>menurunkan cut-off KTA 650 → 620</strong> agar target akuisisi tercapai. Data 6 bulan kemudian:</p>
        <ul>
          <li>Approval naik 15% (target tercapai 🎉).</li>
          <li>Bad rate segmen baru (skor 620–649): <strong>11%</strong> vs 4% di atas 650.</li>
          <li>Tambahan CKPN: Rp 45 M — <strong>melampaui</strong> tambahan pendapatan bunga Rp 30 M.</li>
          <li>Vintage Q3-2026 KTA mulai menunjukkan pola NPL di atas normal (CR6).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung "harga" keputusan ini dan susun rekomendasi 2 poin untuk direksi.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Harga keputusan:</strong> net −Rp 15 M (45 − 30) dalam 6 bulan — <em>belum termasuk</em> biaya collection dan modal untuk UL yang lebih tinggi. Setiap nasabah tambahan di band 620–649 rata-rata <strong>merugikan</strong> bank. Target tercapai, laba bocor.</p>
          <p><strong>Rekomendasi:</strong> (1) <strong>Kembalikan cut-off ke 650</strong> (atau 640 dengan pricing lebih tinggi — CR21: kompensasi risiko via bunga, bukan via volume). (2) <strong>Tetapkan governance:</strong> perubahan cut-off wajib lewat analisis profit marjinal + persetujuan komite risiko — bukan keputusan target semata. Pelajaran: <strong>cut-off adalah keputusan risiko, bukan keputusan sales</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. PDO 20 artinya?"
        options={[
          "Skor maksimum 20",
          "Setiap +20 poin skor, odds kelancaran berlipat 2×",
          "PD turun 20%",
          "Cut-off harus 20",
        ]}
        correct={1}
        explanation="Benar: Points to Double Odds. PDO 20 → skor 620 dua kali lebih aman dari 600. Inilah yang membuat skor intuitif bagi bisnis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa cut-off optimal BUKAN yang memaksimalkan akurasi?"
        options={[
          "Akurasi tidak penting",
          "Biaya salah tidak simetris: menerima yang macet (rugi pokok) jauh lebih mahal dari menolak yang bagus (rugi bunga) — cut-off memaksimalkan profit",
          "Regulator melarang akurasi",
          "Akurasi tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: cost-sensitive decision. False positive (ACC yang macet) = hilang pokok ratusan juta; false negative (tolak yang bagus) = hilang bunga. Cut-off menyeimbangkan rupiah, bukan jumlah benar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. KS = 45%. Artinya?"
        options={[
          "Model 45% akurat",
          "Pada skor tertentu, selisih kumulatif Good vs Bad mencapai 45 poin — daya beda kuat",
          "45% aplikan ditolak",
          "Error model 45%",
        ]}
        correct={1}
        explanation="Benar: KS = jarak maksimum kurva kumulatif. 45% = kuat (patokan 40–60%). Bukan akurasi — melainkan kemampuan memisahkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. PSI = 0,3 pada monitoring bulanan. Tindakan?"
        options={[
          "Abaikan — PSI tidak penting",
          "Investigasi pergeseran populasi; siapkan rekalibrasi/rebuild — model mungkin tidak lagi mewakili aplikan saat ini",
          "Langsung hapus model",
          "Turunkan cut-off",
        ]}
        correct={1}
        explanation="Benar: PSI >0,25 = populasi bergeser signifikan. Model dilatih untuk 'dunia lama' — perlu diverifikasi sebelum dipercaya untuk 'dunia baru'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Model A: Gini 0,60 tapi kalibrasi meleset (skor 650 = PD aktual 8%, bukan 4%). Model B: Gini 0,50 tapi kalibrasi pas. Untuk perhitungan CKPN (PSAK 71), pilih?"
        options={[
          "Model A — Gini lebih tinggi selalu menang",
          "Model B — CKPN butuh angka PD yang benar (kalibrasi); ranking bagus tidak cukup untuk menghitung rupiah cadangan",
          "Keduanya sama",
          "Buang keduanya",
        ]}
        correct={1}
        explanation="Benar: Model B. ECL = PD × LGD × EAD — butuh PD yang benar angkanya, bukan cuma ranking yang benar. Diskriminasi tanpa kalibrasi = tahu siapa lebih berisiko tapi salah hitung cadangannya."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bank membuka akuisisi digital; 2 kuartal kemudian PSI 0,35 dan Gini out-of-time turun 15 poin. Diagnosis dan aksi?"
        options={[
          "Model rusak total — buang dan bangun dari nol segera",
          "Pergeseran populasi: aplikan digital berbeda dari populasi latih (nasabah cabang). Aksi: segmentasi/review model, validasi ulang di populasi baru",
          "Naikkan cut-off 50 poin — pasti beres",
          "Abaikan — PSI hanya angka",
        ]}
        correct={1}
        explanation="Benar: ini pergeseran populasi, bukan kerusakan model. Model dilatih di 'dunia cabang' dipakai di 'dunia digital'. Solusinya: validasi ulang, kemungkinan model/rekalibrasi khusus segmen digital — bukan sekadar menggeser cut-off."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Mengapa industri memakai skor 300–900 (PDO scaling) padahal model menghasilkan peluang yang lebih 'murni'?"
        options={[
          "Supaya terlihat canggih",
          "Manusia tidak berpikir dalam peluang — skor adalah antarmuka yang intuitif ('640 di atas 600, lumayan'); model yang tidak dipakai = tidak berguna",
          "OJK mewajibkan format 300–900",
          "Peluang tidak bisa disimpan di database",
        ]}
        correct={1}
        explanation="Benar: ini desain antarmuka untuk otak manusia. 'PD 3,7%' tidak memicu intuisi; 'skor 640' langsung bisa dipakai bisnis, dijelaskan ke nasabah, dan dipertahankan ke auditor. Kosmetik yang baik membuat model dipakai."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>PDO scaling</strong>: Skor = Offset + Factor × ln(odds). PDO = poin untuk odds 2× lipat.</li>
          <li><strong>Cut-off</strong> = titik impas profit marjinal — bukan akurasi maksimum (biaya tidak simetris).</li>
          <li><strong>KS</strong> = jarak kumulatif maks Good vs Bad; <strong>Gini</strong> = 2×AUC−1; <strong>swap set</strong> = uji model baru vs lama.</li>
          <li><strong>Monitoring</strong>: PSI, Gini out-of-time, bad rate per skor — tiap bulan. Rebuild 1–2 tahun.</li>
          <li><strong>Diskriminasi ≠ kalibrasi</strong> — untuk CKPN, kalibrasi yang menentukan rupiah.</li>
          <li>Kapan TIDAK menaikkan cut-off sebagai solusi: populasi bergeser (PSI tinggi) — obati penyebabnya (rebuild), bukan gejalanya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr7a-application-scorecard-1" className="btn btn-secondary btn-sm">← CR7a</Link>
        <Link href="/learn/cr8-reject-inference" className="btn btn-primary btn-sm">Next: CR8 →</Link>
      </div>
    </div>
  );
}
