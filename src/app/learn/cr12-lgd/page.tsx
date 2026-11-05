"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr12Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const recoveryCurveData = [
    {
      x: ["0", "6", "12", "18", "24", "36", "48", "60"],
      y: [0, 15, 30, 42, 50, 58, 62, 65],
      type: "scatter",
      mode: "lines+markers",
      name: "Kumulatif recovery (%)",
      line: { color: "#3aa655", width: 3 },
    },
  ];

  const lgdDistData = [
    {
      x: ["0–10%", "10–30%", "30–50%", "50–70%", "70–90%", "90–100%"],
      y: [25, 12, 8, 6, 9, 40],
      type: "bar",
      marker: { color: ["#3aa655", "#2a7de1", "#e8a838", "#ef9244", "#ef4444", "#8b1a1a"] },
      text: ["25%", "12%", "8%", "6%", "9%", "40%"],
      textposition: "outside",
    },
  ];

  const downturnData = [
    {
      x: ["Normal", "Resesi"],
      y: [35, 55],
      type: "bar",
      marker: { color: ["#2a7de1", "#ef4444"] },
      text: ["LGD 35%", "LGD 55%"],
      textposition: "outside",
      name: "LGD",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator LGD workout — dari default sampai recovery
# Kredit Rp 500 jt default. Ikuti arusnya sampai recovery final.
ead = 500  # juta Rp

arus = [
    ("Penjualan agunan (thn 1)", 280),
    ("Penjualan agunan (thn 2)", 40),
    ("Cicilan debitur (thn 1-3)", 45),
    ("Klaim asuransi", 25),
]
biaya = [
    ("Biaya lelang & hukum", 30),
    ("Biaya collection", 20),
]

total_masuk = sum(v for _, v in arus)
total_biaya = sum(v for _, v in biaya)
# Diskonto: recovery thn 2-3 dinilai lebih rendah (r=10%)
diskonto = 40 * 0.17 + 45 * 0.25  # penyederhanaan nilai waktu
recovery_bersih = total_masuk - total_biaya - diskonto
lgd = 1 - recovery_bersih / ead

print(f"EAD                    : Rp {ead} jt")
print(f"Total recovery kotor   : Rp {total_masuk} jt")
print(f"Total biaya            : Rp {total_biaya} jt")
print(f"Diskonto waktu         : Rp {diskonto:.0f} jt")
print(f"Recovery bersih        : Rp {recovery_bersih:.0f} jt")
print(f"LGD = 1 - {recovery_bersih:.0f}/{ead} = {lgd*100:.1f}%")
print()
print("Coba: naikkan 'Biaya lelang' jadi 80 (sengketa hukum).")
print("LGD naik — biaya & waktu adalah 'pencuri' recovery yang senyap.")`;

  const lab2Code = `# Lab 2: Distribusi LGD bimodal — rata-rata menipu
# 1000 kasus default. LGD tidak terpusat di tengah!
import random
random.seed(33)

lgd_list = []
for _ in range(1000):
    r = random.random()
    if r < 0.25:
        lgd_list.append(random.uniform(0, 10))    # sembuh/agunan bagus
    elif r < 0.40:
        lgd_list.append(random.uniform(10, 70))   # sebagian
    else:
        lgd_list.append(random.uniform(70, 100))  # hilang total

rata = sum(lgd_list) / len(lgd_list)
median = sorted(lgd_list)[500]
p90 = sorted(lgd_list)[900]
print(f"Rata-rata LGD : {rata:.1f}%")
print(f"Median LGD    : {median:.1f}%")
print(f"P90 LGD       : {p90:.1f}%  (10% kasus terburuk di atas ini!)")
print()
print("Perhatikan: rata-rata 45% tapi hampir TIDAK ADA kasus yang")
print("LGD-nya '45%'. Realitanya: sembuh total ATAU hilang total.")
print("Model LGD harus memodelkan DUA rezim ini (two-stage), bukan")
print("satu regresi linear ke rata-rata.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR12 — Credit Risk Analyst</span>
        <h1 className="display-title">LGD: Berapa yang Kembali<br />Saat Nasabah Gagal?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rumah Rp 800 Juta yang Kembali Rp 390 Juta</a></li>
          <li><a href="#workout">Workout LGD: Akuntansi Penyelamatan</a></li>
          <li><a href="#kurva">Recovery Curve: Waktu Adalah Pencuri</a></li>
          <li><a href="#downturn">Downturn LGD: Saat Semua Menjual Bersamaan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator LGD Workout</a></li>
          <li><a href="#lab2">🔬 Lab 2: Distribusi LGD Bimodal</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Menekan LGD</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Agunan "Senilai" Rp 1 M</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung workout LGD dari arus recovery: hasil lelang + cicilan − biaya − diskonto waktu.</li>
          <li>Menjelaskan recovery curve dan mengapa kecepatan recovery menentukan LGD.</li>
          <li>Membedakan LGD normal vs downturn LGD dan kapan memakai masing-masing.</li>
          <li>Mengidentifikasi mengapa distribusi LGD bimodal dan implikasinya bagi modeling.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Rumah Rp 800 Juta yang Kembali Rp 390 Juta</h2>
      <div className="story">
        <p>KPR Pak Bambang macet: outstanding <strong>Rp 500 juta</strong>, agunan rumah dinilai <strong>Rp 800 juta</strong> saat akad. Tim remedial santai: <em>"Agunan 160% dari utang — aman."</em></p>
        <p>Tiga tahun kemudian, realisasinya:</p>
        <ul>
          <li>Rumah laku lelang <strong>Rp 620 juta</strong> (pasar turun + lelang selalu diskon).</li>
          <li>Biaya lelang, hukum, appraisal: <strong>Rp 50 juta</strong>.</li>
          <li>Pak Bambang mencicil Rp 45 juta selama proses.</li>
          <li>Nilai waktu: recovery tahun ke-2–3 <strong>didiskonto</strong>.</li>
        </ul>
        <p>Total kembali bersih: <strong>Rp 390 juta</strong>. LGD = 1 − 390/500 = <strong>22%</strong>. Bukan 0% seperti dibayangkan — dan ini kasus <em>bagus</em> (ada agunan properti!).</p>
        <p><strong>Twist-nya:</strong> agunan Rp 800 juta ≠ recovery Rp 800 juta. Di antara keduanya ada <strong>diskon lelang, biaya, waktu, dan ekonomi</strong> — empat pencuri yang memakan recovery. Lesson ini menghitung jejak mereka satu per satu.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="workout">Workout LGD: Akuntansi Penyelamatan</h2>
      <p><strong>Definisi.</strong> <strong>Workout LGD</strong> = 1 − (recovery bersih / EAD), di mana recovery bersih = <strong>semua arus masuk</strong> (lelang agunan, cicilan, klaim asuransi) <strong>dikurangi biaya</strong> (hukum, lelang, collection) dan <strong>didiskonto</strong> ke nilai kini.</p>
      <Tex math={String.raw`\text{LGD} = 1 - \frac{\sum_t \frac{\text{Recovery}_t - \text{Biaya}_t}{(1+r)^t}}{\text{EAD}}`} block />
      <p><strong>Artinya tiap simbol:</strong> jumlahkan untuk tiap periode <Tex math={String.raw`t`} /> setelah default: recovery dikurangi biaya, didiskonto dengan <Tex math={String.raw`r`} /> (biasanya suku bunga kredit itu sendiri); bagi dengan EAD; kurangkan dari 1. Alternatif: <strong>market LGD</strong> — dari harga pasar obligasi/kredit macet (untuk korporasi besar yang diperdagangkan).</p>
      <p><strong>Kepribadian:</strong> workout LGD seperti <strong>laporan keuangan proyek penyelamatan</strong> — tiap rupiah masuk dan keluar dicatat, waktu dihargai. Bank yang tidak mendiskonto recovery 3 tahun = mengklaim "kembali Rp 100" padahal nilai kini cuma Rp 75.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Data cerita pembuka: EAD Rp 500 jt; lelang Rp 620 jt (thn 1–2); cicilan Rp 45 jt; biaya Rp 50 jt; r = 10%.</p>
        <p><strong>Langkah 1</strong> — arus bersih didiskonto ≈ Rp 390 jt (perhitungan Lab 1).<br />
        <strong>Langkah 2</strong> — recovery rate = 390/500 = 78%.<br />
        <strong>Langkah 3</strong> — LGD = 1 − 78% = <strong>22%</strong>.</p>
        <p>Perhatikan: <strong>haircut agunan</strong> = (800−620)/800 = 22,5% — agunan "menyusut" sebelum dipakai. Inilah mengapa bank memakai <strong>nilai likuidasi</strong> (bukan nilai pasar) saat menilai agunan di awal.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada <strong>tiga potongan</strong> antara nilai agunan dan recovery: (1) <strong>haircut pasar</strong> (lelang &lt; nilai pasar, apalagi saat krisis); (2) <strong>biaya</strong> (hukum/lelang bisa 10–20%); (3) <strong>waktu</strong> (diskonto 2–3 tahun). Agunan Rp 800 jt → recovery Rp 390 jt bukan anomali — melainkan <strong>normal</strong>. Analis yang memakai nilai agunan mentah sedang berhalusinasi.</p>
      </div>

      <h2 id="kurva">Recovery Curve: Waktu Adalah Pencuri</h2>
      <p><strong>Definisi.</strong> <strong>Recovery curve</strong> = % kumulatif yang berhasil dipulihkan per bulan sejak default. Bentuk umum: <strong>curam di awal, mendatar kemudian</strong> — yang mudah kembali duluan (cicilan sukarela, agunan likuid), sisanya alot.</p>

      <PlotlyChart
        data={recoveryCurveData}
        title="Recovery Curve Tipikal: % Kumulatif per Bulan Sejak Default"
        layout={{ xaxis: { title: "Bulan sejak default" }, yaxis: { title: "Recovery kumulatif (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = waktu sejak default; Y = % EAD yang sudah kembali (kumulatif).</p>
        <p><strong>Interpretasi:</strong> 50% kembali dalam 24 bulan pertama — <strong>kecepatan adalah segalanya</strong>. Setelah bulan 36, kurva mendatar: tiap bulan tambahan hanya menambah 1–2%. <strong>Implikasi bisnis:</strong> investasi di <strong>kecepatan eksekusi</strong> (lelang cepat, hukum efisien) sering lebih menguntungkan daripada "menunggu harga bagus". Waktu yang dihemat = diskonto yang dihemat.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Semakin lama menunggu, semakin tinggi harga jual agunan."</strong></p>
        <p><strong>Yang benar:</strong> menunggu = <strong>diskonto waktu + biaya penitipan + risiko harga turun</strong>. Kecuali ada alasan kuat (pasar sedang crash sementara), <strong>eksekusi cepat</strong> hampir selalu menang secara nilai kini. Recovery curve yang mendatar adalah buktinya: bulan 36–60 hanya menambah ~7%.</p>
      </div>

      <h2 id="downturn">Downturn LGD: Saat Semua Menjual Bersamaan</h2>
      <p><strong>Definisi.</strong> <strong>Downturn LGD</strong> = LGD pada kondisi ekonomi buruk — dipakai untuk <strong>modal (Basel/IRB)</strong>. Logikanya: saat resesi, <strong>PD naik DAN LGD naik bersamaan</strong> (korelasi default–LGD): agunan properti jatuh tepat saat banyak debitur macet dan semua bank melelang bareng.</p>
      <p><strong>Aturan Basel:</strong> LGD untuk modal = <strong>max(LGD rata-rata jangka panjang, LGD downturn)</strong> — ambil yang lebih konservatif. Tidak boleh memakai LGD masa boom untuk modal.</p>

      <PlotlyChart
        data={downturnData}
        title="LGD Normal vs Downturn (ilustrasi segmen properti)"
        layout={{ xaxis: { title: "Kondisi ekonomi" }, yaxis: { title: "LGD (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = LGD kondisi normal vs resesi.</p>
        <p><strong>Interpretasi:</strong> LGD melonjak 35% → 55% saat resesi — <strong>hampir 60% lebih buruk</strong>. Kombinasikan dengan PD yang juga naik 2× (CR10): EL saat resesi bisa <strong>3× lipat</strong> normal. Inilah <strong>korelasi PD–LGD</strong> yang membuat krisis begitu brutal — dua mesin kerugian menyala bersamaan.</p>
      </div>

      <PlotlyChart
        data={lgdDistData}
        title="Distribusi LGD: Bimodal (Jarang di Tengah!)"
        layout={{ xaxis: { title: "LGD" }, yaxis: { title: "% kasus default" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % kasus default dengan LGD di rentang itu.</p>
        <p><strong>Interpretasi:</strong> distribusi <strong>bimodal</strong>: menumpuk di 0–10% (sembuh/agunan bagus — 25%) dan 90–100% (hilang total — 40%), <strong>jarang di tengah</strong>. Rata-rata 45% hampir tidak pernah terjadi pada kasus individual! <strong>Implikasi modeling:</strong> regresi linear ke rata-rata = salah alat. Praktik benar: <strong>model dua tahap</strong> (tahap 1: sembuh vs tidak; tahap 2: jika tidak, berapa LGD-nya).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> LGD seperti <strong>hasil operasi</strong> — pasien sembuh total atau tidak tertolong; jarang "setengah sembuh". Karena itu EL = PD × LGD × EAD memakai <strong>rata-rata</strong> LGD dengan sadar: ia benar untuk portofolio (hukum bilangan besar), tapi <strong>menyesatkan</strong> untuk satu kasus. Jangan pernah bilang "LGD nasabah ini 45%" — bilang "distribusinya bimodal, ekspektasinya 45%".</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Tiga Potongan dan Satu Pencuri</h3>
      <p>Antara nilai agunan di atas kertas dan recovery bersih ada <strong>tiga potongan</strong>: (1) <strong>haircut pasar</strong> — lelang selalu di bawah nilai pasar, apalagi saat krisis (semua orang menjual bersamaan); (2) <strong>biaya</strong> — pengacara, balai lelang, penitipan, pajak; (3) <strong>diskonto waktu</strong> — Rp 1 M yang kembali 3 tahun lagi hanya bernilai ~Rp 750 jt hari ini (r=10%). Analis yang memakai "nilai agunan" mentah untuk LGD sedang menghitung dengan tiga potongan yang dilupakan — LGD-nya akan <strong>underestimate sistematis</strong>.</p>
      <p>Lalu ada <strong>satu pencuri: waktu</strong>. Recovery curve menunjukkan 50% kembali dalam 24 bulan pertama, lalu mendatar. Setiap bulan tambahan setelah itu = biaya jalan terus, diskonto menggerogoti, dan peluang sembuh menyusut. <strong>Kecepatan adalah strategi LGD</strong>: tim remedial yang mengeksekusi dalam 12 bulan vs 36 bulan bisa berbeda LGD 15–20 poin untuk kasus yang sama. Inilah mengapa KPI tim recovery harus berbasis <strong>waktu</strong>, bukan sekadar nominal.</p>
      <p>Intuisi terakhir: <strong>distribusi LGD itu bimodal</strong> — menumpuk di 0–10% (sembuh/agunan bagus) dan 90–100% (hilang total), jarang di tengah. Artinya rata-rata LGD 45% <strong>menyesatkan</strong>: hampir tidak ada kasus yang LGD-nya benar-benar 45%! Untuk pricing portofolio, rata-rata boleh dipakai; untuk menilai <strong>satu kasus</strong>, tanyakan: "ini tipe yang sembuh atau tipe yang hilang?" — bukan "berapa rata-ratanya".</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator LGD Workout</h2>
      <p>Ikuti aliran rupiah dari default sampai recovery bersih — dan temukan para "pencuri".</p>
      <PyodideLab
        title="Lab 1 — Workout LGD Step-by-Step"
        hint="Coba: (1) naikkan biaya lelang jadi 80 — berapa LGD? (2) Hapus diskonto (jadi 0) — berapa? Rasakan kontribusi masing-masing 'pencuri'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Distribusi LGD Bimodal</h2>
      <p>1000 kasus default simulasi. Buktikan rata-rata menipu.</p>
      <PyodideLab
        title="Lab 2 — Bimodalitas LGD"
        hint="Perhatikan median vs rata-rata vs P90. Pertanyaan: jika bank hanya mencadangkan berdasarkan rata-rata 45%, apa yang terjadi pada 40% kasus dengan LGD 70-100%? (Jawaban: di sanalah UL/modal bekerja — CR3.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Menekan LGD</h2>

      <div className="decision-card">
        <h3>1. Saat origination: nilai agunan dengan <strong>nilai likuidasi</strong> → <strong>LGD rendah sejak lahir</strong></h3>
        <p><strong>Kondisi:</strong> pengajuan kredit dengan agunan.</p>
        <p><strong>Aksi:</strong> appraisal independen + haircut (properti 20–30%, kendaraan 40%+) + cek legalitas (SHM vs girik!). LGD ditentukan <strong>sebelum</strong> akad, bukan saat lelang.</p>
      </div>

      <div className="decision-card">
        <h3>2. Saat remedial: <strong>eksekusi cepat</strong> → <strong>recovery curve curam</strong></h3>
        <p><strong>Kondisi:</strong> sudah default.</p>
        <p><strong>Aksi:</strong> lelang dalam 6–12 bulan pertama (zona curam kurva). Jangan tunggu "harga bagus" — diskonto + biaya memakan penantian.</p>
      </div>

      <div className="decision-card">
        <h3>3. Untuk modal (IRB): pakai <strong>downturn LGD</strong> → <strong>konservatif</strong></h3>
        <p><strong>Kondisi:</strong> perhitungan RWA/modal.</p>
        <p><strong>Kenapa:</strong> Basel mewajibkan max(rata-rata, downturn). Memakai LGD boom untuk modal = bom waktu regulasi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Membangun model LGD: <strong>dua tahap</strong> → <strong>hormati bimodalitas</strong></h3>
        <p><strong>Kondisi:</strong> development model.</p>
        <p><strong>Cara:</strong> tahap 1 (klasifikasi: sembuh vs rugi) + tahap 2 (regresi: jika rugi, berapa?). Satu regresi linear = salah alat.</p>
      </div>

            <div className="decision-card">
        <h3>5. Agunan bagus tapi debitur kooperatif dan usaha masih jalan → <strong>restrukturisasi dulu, lelang kemudian</strong></h3>
        <p><strong>Kondisi:</strong> KMK Rp 2 M macet (Kolek 4), agunan ruko senilai Rp 3 M (KJPP), debitur kooperatif — usahanya turun 40% tetapi masih beroperasi dan beritikad bayar.</p>
        <p><strong>Kenapa restrukturisasi dulu:</strong> lelang sekarang = haircut 25–40% + biaya + 2 tahun waktu → recovery bersih mungkin Rp 1,6 M (LGD 20%). Restrukturisasi (tenor +2 tahun, cicilan disesuaikan arus kas) dengan peluang sembuh 60% → expected recovery Rp 2 M × 60% + lelang tertunda × 40% ≈ Rp 1,9 M. <strong>Memberi kesempatan sembuh seringkali lebih menguntungkan dari eksekusi cepat</strong> — asal debitur kooperatif dan usaha viable. Lelang adalah opsi terakhir, bukan refleks pertama.</p>
        <p><strong>Contoh nyata:</strong> pola ini adalah inti program restrukturisasi Covid: menunda eksekusi untuk debitur viable menghasilkan recovery jauh lebih baik daripada lelang massal di pasar yang jatuh. Kesabaran yang terkalkulasi = LGD rendah.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Agunan ≠ recovery.</strong> Kurangi haircut + biaya + diskonto waktu.</li>
          <li><strong>Kecepatan = uang.</strong> Eksekusi di zona curam recovery curve.</li>
          <li><strong>LGD naik saat resesi</strong> — pakai downturn untuk modal.</li>
          <li><strong>Distribusi bimodal</strong> — model dua tahap, bukan satu regresi.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Checklist Penilaian Agunan: 10 Pertanyaan Sebelum Percaya</h3>
      <p>Nilai agunan di atas kertas ≠ recovery. Sepuluh pertanyaan ini mengubah 'nilai KJPP' menjadi 'estimasi LGD yang jujur'.</p>
      <ol>
        <li><strong>Berapa nilai LIKUIDASI (bukan pasar)?</strong> — Nilai pasar − haircut lelang (20–40%) = nilai likuidasi. Bank yang memakai nilai pasar mentah = menghitung dengan fantasi.</li>
        <li><strong>Apakah ikatannya sempurna?</strong> — Hak Tanggungan terdaftar (bukan SKMHT)? Fidusia didaftarkan? Ikatan cacat = eksekusi terhambat = LGD naik 10–20 poin.</li>
        <li><strong>Berapa lama eksekusi realistis?</strong> — Jawa kota besar: 1–2 tahun. Luar Jawa / sengketa: 2–4 tahun. Setiap tahun = diskonto ~10% + biaya. Waktu adalah pencuri — hitung kerugiannya.</li>
        <li><strong>Apakah ada sengketa?</strong> — Sengketa waris, tumpang tindih sertifikat, gugatan pihak ketiga = eksekusi bertahun-tahun. Cek BPN + pengadilan sebelum percaya.</li>
        <li><strong>Bagaimana kondisi pasar saat eksekusi?</strong> — Agunan properti di pasar yang jatuh (semua orang jual bareng) = haircut 2× normal. Nilai dengan skenario pasar buruk, bukan kini.</li>
        <li><strong>Apakah agunannya terdepresiasi?</strong> — Kendaraan −15%/tahun, mesin −10%/tahun, persediaan bisa basi. Proyeksikan nilai SAAT eksekusi, bukan hari ini.</li>
        <li><strong>Berapa biayanya?</strong> — Pengacara 5–10%, balai lelang 2–5%, pajak, penitipan. Total 10–20% dari hasil — jangan lupa mengurangkan.</li>
        <li><strong>Apakah debitur kooperatif?</strong> — Kooperatif + usaha viable = restrukturisasi mungkin lebih baik dari lelang (recovery lebih tinggi). Tidak kooperatif = lelang cepat sebelum aset dirusak.</li>
        <li><strong>Apakah ada AYDA existing?</strong> — Bank sudah pegang AYDA lama yang belum laku = sinyal pasar lesu untuk aset sejenis. Jangan nilai optimis di pasar pesimis.</li>
        <li><strong>Berapa LGD downturn-nya?</strong> — Untuk modal: pakai LGD kondisi buruk (CR12). LGD rata-rata untuk ECL, LGD downturn untuk modal — dua angka, dua keperluan.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> wajibkan checklist ini untuk setiap agunan di atas Rp 1 M. 10 pertanyaan, 30 menit — beda antara LGD 20% dan LGD 50%.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Recovery di Indonesia punya lembaga, aturan, dan kisah yang spesifik — memahaminya menentukan LGD-mu realistis atau fantasi.</p>

      <h3>KPKNL &amp; Balai Lelang: Jalur Resmi Eksekusi</h3>
      <p>Agunan kredit macet di Indonesia dieksekusi melalui <strong>lelang</strong> — via KPKNL (Kantor Pelayanan Kekayaan Negara dan Lelang) untuk agunan yang diikat hak tanggungan/fidusia tertentu, atau balai lelang swasta. Fakta yang wajib diketahui analis:</p>
      <ul>
        <li><strong>Harga lelang pertama</strong> biasanya dipatok di bawah nilai pasar (untuk menarik peminat) — dan sering <strong>tidak laku</strong> di lelang pertama, sehingga diulang dengan harga lebih rendah. Dua-tiga kali lelang gagal = harga turun 20–40% dari nilai awal.</li>
        <li><strong>Waktu</strong>: dari default hingga uang lelang cair bisa <strong>1–3 tahun</strong> (tergantung perlawanan debitur, sengketa, kelengkapan dokumen). Setiap tahun = diskonto + biaya.</li>
        <li><strong>AYDA</strong> (Agunan Yang Diambil Alih): jika lelang gagal total, bank boleh mengambil alih agunan — tetapi AYDA wajib dijual maksimal <strong>1 tahun</strong> (dapat diperpanjang dengan persetujuan OJK), karena bank dilarang berbisnis properti.</li>
      </ul>
      <p>Analis LGD yang memakai "nilai KJPP" (penilai independen) mentah tanpa haircut lelang + diskonto waktu = analis yang belum pernah melihat hasil lelang sungguhan.</p>

      <h3>Hak Tanggungan &amp; Fidusia: Kualitas Pengikatan</h3>
      <p>Di Indonesia, agunan tanah diikat dengan <strong>Hak Tanggungan</strong>, agunan bergerak (kendaraan, persediaan, piutang) dengan <strong>fidusia</strong>. Kualitas pengikatan menentukan LGD:</p>
      <ul>
        <li>Hak Tanggungan yang <strong>tidak didaftarkan sempurna</strong> (masih SKMHT, belum APHT) = eksekusi terhambat = LGD naik.</li>
        <li>Fidusia persediaan: barangnya bisa <strong>habis terjual</strong> sebelum dieksekusi — agunan menguap. LGD fidusia persediaan tanpa monitoring = fantasi.</li>
        <li>Agunan yang <strong>disengketakan</strong> (sengketa waris, tumpang tindih sertifikat) = eksekusi bertahun-tahun.</li>
      </ul>
      <p>Pelajaran: <strong>LGD bukan fungsi nilai agunan — melainkan fungsi kualitas pengikatan × kecepatan eksekusi × kondisi pasar</strong>.</p>

      <h3>Downturn LGD: Pelajaran 1998 &amp; 2020</h3>
      <p>Krisis 1998: harga properti anjlok 50–80%, lelang sepi peminat — LGD aktual jauh di atas LGD normal. Inilah asal-usul konsep <strong>downturn LGD</strong> di Basel: LGD untuk modal wajib memakai kondisi buruk, bukan rata-rata. Bank Indonesia yang membangun model LGD internal wajib mengestimasi downturn LGD — biasanya dari data krisis historis atau skenario stres. LGD "rata-rata" untuk ECL, LGD "downturn" untuk modal — dua angka, dua keperluan (lagi-lagi!).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: dari nilai agunan ke recovery bersih (klik untuk buka)</summary>
        <p>KPR macet: outstanding Rp 800 jt, nilai pasar rumah (KJPP) Rp 1 M.</p>
        <p><strong>Langkah 1</strong> — haircut lelang: laku di lelang kedua Rp 750 jt (25% di bawah KJPP).<br />
        <strong>Langkah 2</strong> — biaya: pengacara + lelang + pajak = Rp 60 jt → bersih Rp 690 jt.<br />
        <strong>Langkah 3</strong> — waktu: cair 2 tahun setelah default, r = 10% → nilai kini = 690 / 1,21 ≈ <strong>Rp 570 jt</strong>.<br />
        <strong>Langkah 4</strong> — recovery rate = 570/800 = 71% → <strong>LGD = 29%</strong>.</p>
        <p><strong>Pelajaran:</strong> agunan "senilai Rp 1 M" untuk utang Rp 800 jt (coverage 125%!) ternyata menghasilkan LGD 29% — bukan 0%. Tiga potongan + satu pencuri bekerja. Inilah mengapa bank memakai <strong>nilai likuidasi</strong> (bukan nilai pasar) sejak awal.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Agunan 125% dari utang = tidak mungkin rugi."</strong></p>
        <p><strong>Yang benar:</strong> contoh di atas membuktikan sebaliknya: coverage 125% → LGD 29% setelah haircut lelang, biaya, dan diskonto waktu. Agunan bukan perisai ajaib — ia adalah <strong>barang yang harus dijual di pasar yang sedang jatuh, dengan biaya, dalam waktu lama</strong>. Analis yang paham ini memakai nilai likuidasi konservatif sejak underwriting.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Agunan "Senilai" Rp 1 M</h2>
      <div className="callout">
        <p>PT Maju Jaya mengajukan kredit <strong>Rp 800 juta</strong> dengan agunan ruko "senilai Rp 1 M" (appraisal internal marketing). Tim bisnis: <em>"LTV 80%, aman!"</em> Kamu verifikasi:</p>
        <ul>
          <li>Appraisal independen: nilai pasar <strong>Rp 850 juta</strong>; nilai likuidasi (lelang cepat): <strong>Rp 600 juta</strong>.</li>
          <li>Ruko di kawasan yang <strong>sepi</strong> — 3 ruko sebelahnya sudah 2 tahun tidak laku.</li>
          <li>Estimasi biaya lelang + hukum: <strong>Rp 60 juta</strong>; waktu eksekusi 2 tahun (r = 10%).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung recovery realistis dan LGD. Apakah LTV 80% "aman"?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Recovery realistis:</strong> 600 − 60 = Rp 540 jt, didiskonto 2 tahun @10% ≈ Rp 446 jt. LGD = 1 − 446/800 = <strong>44%</strong> — bukan "aman"!</p>
          <p><strong>LTV menipu:</strong> 800/1000 = 80% (klaim marketing) vs 800/600 = <strong>133%</strong> (realita likuidasi) — kredit ini <em>under-collateralized</em>. Tiga pelajaran: (1) appraisal harus <strong>independen</strong> (marketing punya insentif), (2) pakai <strong>nilai likuidasi</strong>, bukan pasar, (3) <strong>likuiditas agunan</strong> (kawasan sepi) sama pentingnya dengan nilainya. Rekomendasi: tolak, atau turunkan plafon ke Rp 400 jt + agunan tambahan.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Lelang Sekarang atau Tunggu?</h2>
      <div className="callout">
        <p>KPR macet: outstanding Rp 800 jt, rumah dinilai KJPP Rp 1 M (2023). Pilihan tim remedial:</p>
        <ul>
          <li><strong>Opsi A — lelang sekarang:</strong> estimasi laku Rp 750 jt (pasar lesu), biaya Rp 60 jt, cair 1 tahun → nilai kini ≈ Rp 627 jt → LGD ≈ 22%.</li>
          <li><strong>Opsi B — tunggu 2 tahun:</strong> pasar diproyeksi pulih, estimasi laku Rp 900 jt, biaya Rp 80 jt (penitipan 2 tahun), cair tahun ke-3 → nilai kini = (900−80)/1,331 ≈ Rp 616 jt → LGD ≈ 23%.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> opsi mana yang lebih baik secara angka? Faktor non-angka apa yang bisa membalikkan keputusan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Secara angka: hampir seri</strong> (Rp 627 jt vs Rp 616 jt) — kenaikan harga yang ditunggu <strong>dimakan diskonto waktu dan biaya</strong>. Inilah "pencuri waktu" bekerja: menunggu hanya worth it jika kenaikan harga <strong>jauh</strong> melampaui diskonto + biaya.</p>
          <p><strong>Faktor non-angka yang bisa membalikkan:</strong> (1) <strong>risiko debitur merusak/menguasai aset</strong> — rumah yang ditempati debitur bermasalah bisa rusak nilainya; (2) <strong>aturan AYDA</strong> — jika sudah diambil alih, wajib jual ≤1 tahun; (3) <strong>sinyal pasar</strong> — jika pasar diprediksi <em>turun</em> (bukan pulih), menunggu = bunuh diri; (4) <strong>biaya oportunitas tim</strong> — kasus menggantung menyita kapasitas remedial.</p>
          <p>Keputusan: <strong>lelang sekarang</strong> (angka seri, risiko menunggu lebih besar). Prinsip: <em>"waktu adalah pencuri — jangan beri ia kunci gudang."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. EAD Rp 500 jt, recovery bersih didiskonto Rp 390 jt. LGD?"
        options={[
          "78%",
          "22% (1 − 390/500)",
          "110%",
          "0%",
        ]}
        correct={1}
        explanation="Benar: 1 − 0,78 = 22%. Ingat: recovery sudah bersih (dikurangi biaya) dan didiskonto — bukan angka kotor."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa Basel mewajibkan downturn LGD untuk modal?"
        options={[
          "Agar bank untung",
          "PD dan LGD naik bersamaan saat resesi (korelasi) — memakai LGD masa boom = modal kurang tepat saat paling dibutuhkan",
          "Supaya perhitungan rumit",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: korelasi PD–LGD. Agunan jatuh tepat saat default membludak — modal harus disiapkan untuk skenario itu, bukan untuk masa indah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Distribusi LGD bimodal. Implikasi untuk modeling?"
        options={[
          "Pakai rata-rata saja — cukup",
          "Model dua tahap (sembuh/tidak, lalu berapa) — satu regresi linear salah alat karena jarang ada kasus di tengah",
          "LGD tidak bisa dimodelkan",
          "Pakai median",
        ]}
        correct={1}
        explanation="Benar: hormati bimodalitas. Regresi linear memprediksi '45%' untuk semua — angka yang hampir tidak pernah terjadi pada kasus individual."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Agunan dinilai Rp 800 jt (pasar). Untuk estimasi LGD yang jujur, pakai?"
        options={[
          "Rp 800 jt — nilai pasar",
          "Nilai likuidasi (lelang cepat) dikurangi biaya dan didiskonto — karena itulah yang benar-benar kembali",
          "Rp 0 — agunan tidak berguna",
          "Nilai saat akad 10 tahun lalu",
        ]}
        correct={1}
        explanation="Benar: nilai likuidasi − biaya − diskonto. Tiga potongan (haircut, biaya, waktu) memisahkan 'nilai di kertas' dari 'uang kembali'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Recovery curve mendatar setelah bulan 36. Keputusan bisnis?"
        options={[
          "Tunggu terus — pasti naik lagi",
          "Eksekusi cepat di zona curam (0–24 bulan); penantian panjang mahal (diskonto + biaya) dengan tambahan minimal",
          "Hentikan semua upaya",
          "Naikkan biaya collection",
        ]}
        correct={1}
        explanation="Benar: kecepatan = uang. 50% recovery datang di 24 bulan pertama; bulan 36–60 hanya menambah ~7% dengan biaya dan diskonto yang terus berjalan."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Agunan dinilai KJPP Rp 1 M untuk utang Rp 800 jt (coverage 125%). Setelah haircut lelang 25%, biaya Rp 60 jt, dan diskonto 2 tahun (r=10%), LGD-nya?"
        options={[
          "0% — agunan lebih besar dari utang",
          "~29% — tiga potongan + pencuri waktu bekerja",
          "125%",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: ~29%. 1000→750 (haircut), →690 (biaya), →570 nilai kini (diskonto) → recovery 71% → LGD 29%. Coverage di atas kertas bukan jaminan — yang menentukan adalah nilai likuidasi bersih kini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Distribusi LGD bersifat bimodal (menumpuk di 0–10% dan 90–100%). Implikasinya untuk analisis SATU kasus?"
        options={[
          "Pakai rata-rata 45% — selalu tepat",
          "Rata-rata menyesatkan untuk kasus individual: tanyakan 'ini tipe yang sembuh atau tipe yang hilang?' — bukan 'berapa rata-ratanya'",
          "LGD tidak bisa diestimasi per kasus",
          "Semua kasus LGD-nya 45%",
        ]}
        correct={1}
        explanation="Benar: hampir tidak ada kasus yang LGD-nya benar-benar 45%. Rata-rata boleh untuk portofolio, tetapi untuk satu kasus, klasifikasikan tipenya (sembuh vs hilang) — karena realitasnya bimodal."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Workout LGD</strong> = 1 − (recovery − biaya, didiskonto) / EAD. Tiga pencuri: haircut, biaya, waktu.</li>
          <li><strong>Recovery curve</strong>: curam di awal, mendatar kemudian — eksekusi cepat menang.</li>
          <li><strong>Downturn LGD</strong> untuk modal: PD &amp; LGD naik bersamaan saat resesi.</li>
          <li><strong>Distribusi bimodal</strong> → model dua tahap, bukan satu regresi.</li>
          <li><strong>Nilai agunan ≠ recovery</strong> — pakai nilai likuidasi independen.</li>
          <li>Kapan TIDAK mengandalkan agunan: pasar illiquid / sengketa hukum — di sana LGD mendekati tanpa agunan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr11-forward-looking" className="btn btn-secondary btn-sm">← CR11</Link>
        <Link href="/learn/cr13-ead-ccf" className="btn btn-primary btn-sm">Next: CR13 →</Link>
      </div>
    </div>
  );
}
