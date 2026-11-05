"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM8Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const sloData = [
    {
      x: ["Freshness ≤ 2 jam", "Completeness ≥ 99%", "Validitas ≥ 99,5%", "Availability 99,9%"],
      y: [97.5, 99.2, 98.1, 99.95],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1", "#ef4444", "#2a7de1"] },
      text: ["97,5% (GAGAL)", "99,2% (lolos)", "98,1% (GAGAL)", "99,95% (lolos)"],
      textposition: "outside",
    },
  ];

  const ebData = [
    {
      x: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
      y: [100, 85, 60, 20],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#ef4444"] },
      text: ["100%", "85%", "60%", "20%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: SLO & Error Budget — "boleh gagal berapa kali?"
# Kontrak: freshness <= 120 menit, diukur per hari selama 30 hari.

import random
random.seed(11)
harian_menit = [random.gauss(45, 25) for _ in range(30)]
harian_menit[7] = 200    # insiden: sumber telat
harian_menit[21] = 150   # insiden kecil

SLO = 120
lolos = sum(1 for m in harian_menit if m <= SLO)
skor = lolos / len(harian_menit) * 100
target = 95.0  # SLO: 95% hari harus <= 120 menit

print(f"SLO: freshness <= {SLO} mnt, target {target}% hari")
print(f"Hasil: {lolos}/{len(harian_menit)} hari lolos = {skor:.1f}%")
print("Status:", "LOLOS ✅" if skor >= target else "GAGAL ❌")
print()
budget_hari = len(harian_menit) * (1 - target/100)
terpakai = len(harian_menit) - lolos
print(f"Error budget: {budget_hari:.1f} hari gagal/bulan. Terpakai: {terpakai} hari.")
print("Sisa budget:", "AMAN — boleh ambil risiko rilis." if terpakai <= budget_hari
      else "HABIS — freeze perubahan, fokus stabilitas!")
print()
print("Coba: tambah 1 insiden lagi (harian_menit[3] = 300). Apa keputusanmu sebagai owner?")`;

  const lab2Code = `# Lab 2: Deteksi BREAKING CHANGE skema — sebelum kontrak dilanggar
# Kontrak v1: tabel transaksi {id, nasabah_id, nominal, tgl}.
# Tim sumber "iseng" mengubah tanpa pemberitahuan. Deteksi otomatis!

kontrak_v1 = {"id": "string", "nasabah_id": "string", "nominal": "int", "tgl": "date"}

def cek_kontrak(kontrak, batch_baru, nama_batch):
    masalah = []
    kolom_baru = set(batch_baru[0].keys()) - set(kontrak.keys())
    kolom_hilang = set(kontrak.keys()) - set(batch_baru[0].keys())
    if kolom_hilang: masalah.append(f"KOLOM HILANG: {kolom_hilang} (BREAKING!)")
    if kolom_baru: masalah.append(f"kolom baru: {kolom_baru} (non-breaking, info saja)")
    for baris in batch_baru[:3]:
        for k, tipe in kontrak.items():
            v = baris.get(k)
            if k == "nominal" and isinstance(v, str):
                masalah.append(f"TIPE BERUBAH: nominal jadi string '{v}' (BREAKING!)")
                break
    print(f"[{nama_batch}]", "LOLOS ✅" if not masalah else "DITOLAK ❌")
    for m in masalah: print("   -", m)
    return not masalah

batch_ok = [{"id": "T1", "nasabah_id": "N1", "nominal": 500000, "tgl": "2026-10-12"}]
batch_nakal_1 = [{"id": "T2", "nasabah_id": "N2", "nominal": "750000", "tgl": "2026-10-12"}]  # nominal string!
batch_nakal_2 = [{"id": "T3", "nasabah_id": "N3", "tgl": "2026-10-12"}]  # nominal HILANG!

cek_kontrak(kontrak_v1, batch_ok, "batch normal")
cek_kontrak(kontrak_v1, batch_nakal_1, "sumber ubah tipe")
cek_kontrak(kontrak_v1, batch_nakal_2, "sumber hapus kolom")
print()
print("Inilah 'pintu' kontrak: breaking change DITOLAK + pemilik sumber di-alert,")
print("bukan dibiarkan merambat ke 10 dashboard downstream.")
print("Coba: buat batch dengan kolom BARU 'channel' — breaking atau tidak?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM8 — Data Management</span>
        <h1 className="display-title">Data Contract & SLA:<br />Perjanjian Tertulis Antar Tim Data</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kolom yang Hilang di Hari Gajian</a></li>
          <li><a href="#kontrak">Data Contract — Akta Nikah Produsen & Konsumen</a></li>
          <li><a href="#sla">SLA, SLO, SLI — Janji yang Bisa Diukur</a></li>
          <li><a href="#errorbudget">Error Budget — Jatah Gagal yang Sehat</a></li>
          <li><a href="#versioning">Versioning & Breaking Change — Etika Mengubah</a></li>
          <li><a href="#lab1">🔬 Lab 1: SLO & Error Budget dalam Angka</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi Breaking Change Otomatis</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kontrak Seperti Apa untuk Siapa</a></li>
          <li><a href="#worked">🔢 Worked Example: Kontrak Tabel Gaji</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Kontrak = API untuk Data</a></li>
          <li><a href="#lab3">🔬 Lab 3: Wasit Kontrak Otomatis</a></li>
          <li><a href="#case">📋 Mini-Case: "Cuma Nambah Kolom" yang Meruntuhkan 4 Dashboard</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan isi data contract dan kenapa ia mencegah "perubahan diam-diam" antar tim.</li>
          <li>Membedakan SLA/SLO/SLI dan menghitung skor SLO + error budget dari data insiden.</li>
          <li>Menggunakan error budget untuk keputusan "boleh rilis vs freeze".</li>
          <li>Mengklasifikasikan perubahan skema menjadi breaking vs non-breaking dan menentukan penanganannya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kolom yang Hilang di Hari Gajian</h2>
      <div className="story">
        <p>Tim payroll menarik <code className="inline">gaji_pokok</code> dari tabel HR setiap tanggal 25. Suatu bulan, tim HR "merapikan" tabel: kolom diganti jadi <code className="inline">basic_salary</code> — tanpa pemberitahuan, tanpa changelog. Job payroll gagal total. 3.000 karyawan terima gaji <strong>telat 4 hari</strong>. HR menyalahkan data engineer ("kok tidak adaptif?"); engineer menyalahkan HR ("kok ubah diam-diam?").</p>
        <p>Twist-nya: <em>keduanya benar dan keduanya salah</em> — karena tidak ada <strong>perjanjian tertulis</strong> tentang siapa boleh mengubah apa. Di dunia API, ini diselesaikan dengan versioning & contract. Di dunia data, jawabannya sama: <strong>data contract</strong>. Lesson ini tentang membuat janji antar tim menjadi eksplisit, terukur, dan ditegakkan mesin — bukan sekadar "tolong kabari ya".</p>
      </div>

      <h2 id="kontrak">Data Contract — Akta Nikah Produsen & Konsumen</h2>
      <p><strong>Definisi.</strong> Data contract = perjanjian eksplisit antara <strong>produsen data</strong> (tim sumber) dan <strong>konsumen</strong> (tim downstream) tentang: <strong>skema</strong> (kolom + tipe), <strong>semantik</strong> (arti tiap kolom — "aktif" = login 30 hari?), <strong>kualitas</strong> (SLO: freshness, completeness), <strong>perubahan</strong> (bagaimana versioning & pemberitahuan), dan <strong>pemilik</strong> (siapa dihubungi saat rusak).</p>
      <p><strong>Kepribadian:</strong> data contract itu seperti <em>akta nikah</em>: tidak romantis, tapi mencegah perang saat masalah datang. Tanpa kontrak, setiap perubahan skema = "kejutan"; dengan kontrak, perubahan = "prosedur". (Jembatan DM7: rule test adalah <em>penegakan</em> kontrak oleh mesin.)</p>
      <p><strong>Isi minimal kontrak yang berguna:</strong></p>
      <ul>
        <li><strong>Skema berversi:</strong> <code className="inline">transaksi.v1 = {"{id: string, nominal: int, ...}"}</code></li>
        <li><strong>SLO terukur:</strong> "freshness ≤ 2 jam, 95% hari" (bukan "secepatnya"!)</li>
        <li><strong>Kebijakan perubahan:</strong> breaking change → versi baru + pemberitahuan 14 hari</li>
        <li><strong>Kontak & eskalasi:</strong> siapa di-pager jam 3 pagi</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> kontrak yang baik ditulis <strong>sebelum</strong> ada masalah, saat semua pihak masih akur. Menulis kontrak <em>setelah</em> insiden = menawar saat kebakaran. Mulai dari 1 tabel kritis (misal tabel payroll di cerita) — bukan 500 tabel sekaligus.</p>
      </div>

      <h2 id="sla">SLA, SLO, SLI — Janji yang Bisa Diukur</h2>
      <ul>
        <li><strong>SLI (Indicator):</strong> <em>ukuran mentah</em> — "freshness tadi malam: 47 menit". Fakta, bukan janji.</li>
        <li><strong>SLO (Objective):</strong> <em>target internal</em> — "95% hari, freshness ≤ 120 menit". Janji tim ke tim.</li>
        <li><strong>SLA (Agreement):</strong> <em>janji kontraktual</em> ke pihak luar — biasanya dengan <strong>konsekuensi</strong> (penalti, kredit). Jangan tulis SLA ke semua orang; SLA = komitmen hukum.</li>
      </ul>
      <p>Rumus skor SLO generik:</p>
      <Tex math={String.raw`\text{Skor SLO} = \frac{\text{periode yang memenuhi target}}{\text{total periode}} \times 100\%`} block />
      <p>Contoh: 28 dari 30 hari freshness ≤ 120 menit → 93,3%. Jika SLO = 95% → <strong>gagal</strong>, walau "hampir".</p>
      <p><strong>SLO data yang umum:</strong> freshness (data ≤ X jam), completeness (≥ 99% record), validitas (≥ 99,5% lolos rule), availability (99,9% = ~43 menit down/bulan).</p>

      <PlotlyChart
        data={sloData}
        title="Contoh Skor SLO vs Target (merah = gagal)"
        layout={{ xaxis: { title: "SLO" }, yaxis: { title: "Skor %" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = skor tercapai; warna merah = di bawah target.</p>
        <p><strong>Interpretasi:</strong> 2 dari 4 SLO gagal — tapi perhatikan: availability 99,95% "lolos" dengan margin tipis. <strong>Pelajaran:</strong> SLO memaksa diskusi jujur "seberapa bagus <em>cukup</em>?" — 100% = mustahil & mahal; 95% = eksplisit menerima 5% kegagalan. Tanpa SLO, ekspektasi = "jangan pernah gagal" (mustahil) atau "terserah" (kacau).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "SLO 100% = tim yang bagus."</strong></p>
        <p><strong>Yang benar:</strong> SLO 100% = tim yang <strong>tidak jujur atau boros</strong>. Mengejar 100% membutuhkan biaya eksponensial (redundansi gila-gilaan) untuk 1% terakhir yang nilainya kecil. SLO yang sehat = <strong>sedikit di bawah sempurna</strong>, dengan sisa "jatah gagal" (error budget) dipakai untuk berinovasi. Google SRE: "100% adalah target yang salah."</p>
      </div>

      <h2 id="errorbudget">Error Budget — Jatah Gagal yang Sehat</h2>
      <p><strong>Definisi.</strong> Error budget = <Tex math={String.raw`100\% - \text{SLO}`} /> = "jatah gagal" yang <em>diizinkan</em>. SLO 95% → budget 5% (1,5 hari/bulan boleh gagal).</p>
      <p><strong>Cara pakai (keputusan operasional):</strong></p>
      <ul>
        <li><strong>Budget masih banyak</strong> → boleh ambil risiko: rilis fitur, migrasi, eksperimen. Gagal sesekali = <em>diharapkan</em>.</li>
        <li><strong>Budget menipis/habis</strong> → <strong>freeze</strong>: stop perubahan, fokus stabilitas sampai budget pulih.</li>
      </ul>
      <p><strong>Kepribadian:</strong> error budget itu seperti <em>uang jajan risiko</em>: anak yang tidak pernah boleh gagal = tidak pernah belajar; yang boros = bangkrut. Budget membuat trade-off inovasi vs stabilitas menjadi <strong>angka</strong>, bukan debat kusir.</p>

      <PlotlyChart
        data={ebData}
        title="Error Budget Terkuras 4 Minggu (contoh)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Sisa budget %" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = sisa error budget tiap minggu.</p>
        <p><strong>Interpretasi:</strong> minggu 4 tersisa 20% — <strong>keputusan: freeze rilis</strong>, fokus ke stabilitas. Tanpa angka ini, tim akan terus "coba rilis cepat" sambil pelanggan menderita. <strong>Pelajaran:</strong> error budget mengubah "jangan rilis!" (perintah) menjadi "budget habis" (fakta) — jauh lebih mudah diterima tim.</p>
      </div>

      <h2 id="versioning">Versioning & Breaking Change — Etika Mengubah</h2>
      <p><strong>Klasifikasi perubahan skema:</strong></p>
      <ul>
        <li><strong>Non-breaking (aman):</strong> tambah kolom <em>nullable</em> baru; tambah nilai enum baru. Konsumen lama tidak rusak.</li>
        <li><strong>Breaking (berbahaya):</strong> hapus kolom; rename kolom; ubah tipe (<code className="inline">int → string</code>); ubah makna ("aktif" definisinya diganti!).</li>
      </ul>
      <p><strong>Etika mengubah (prosedur kontrak):</strong> (1) breaking change → <strong>versi baru</strong> (<code className="inline">transaksi.v2</code>), v1 tetap jalan selama masa transisi (misal 90 hari); (2) <strong>umumkan dulu</strong> (changelog + notifikasi ke semua konsumen terdaftar — butuh lineage DM10 untuk tahu siapa saja!); (3) <strong>pintu otomatis</strong> menolak batch yang melanggar kontrak v-current (Lab 2).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Rename kolom itu perubahan kecil."</strong></p>
        <p><strong>Yang benar:</strong> rename = <strong>hapus + tambah</strong> bagi mesin — semua query <code className="inline">SELECT gaji_pokok</code> langsung mati (cerita pembuka!). Tidak ada "perubahan kecil" pada skema terkontrak; yang ada hanya breaking vs non-breaking. Kalau ragu, anggap breaking.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kontrak tanpa <strong>lineage</strong> (DM10) = surat tanpa alamat — kamu tidak tahu siapa yang harus diberi tahu saat berubah. Dan kontrak tanpa <strong>pintu otomatis</strong> (Lab 2) = aturan tanpa polisi. Tiga serangkai: kontrak (janji) + lineage (tahu siapa) + test (tegakkan).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: SLO & Error Budget dalam Angka</h2>
      <p>Hitung skor SLO dari 30 hari data freshness, lalu putuskan: boleh rilis atau freeze?</p>
      <PyodideLab
        title="Lab 1 — Dari Insiden ke Keputusan"
        hint="Coba: tambah 1 insiden lagi. Pada titik berapa keputusanmu berubah dari 'boleh rilis' jadi 'freeze'?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Deteksi Breaking Change Otomatis</h2>
      <p>Bangun "pintu kontrak": batch yang melanggar skema ditolak sebelum merusak downstream.</p>
      <PyodideLab
        title="Lab 2 — Polisi Skema"
        hint="Coba: tambah kolom baru 'channel' — breaking atau tidak? Kenapa aturannya begitu?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Kontrak Seperti Apa untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Tabel dipakai 10+ tim / laporan direksi → <strong>kontrak penuh + SLO + pintu otomatis</strong></h3>
        <p><strong>Kondisi:</strong> dampak perubahan besar, banyak konsumen.</p>
        <p><strong>Kenapa:</strong> di sinilah "cuma rename kolom" menelan korban terbanyak. Investasi kontrak sebanding risikonya.</p>
      </div>

      <div className="decision-card">
        <h3>2. Eksperimen internal 1 tim → <strong>kontrak ringan (skema + kontak saja)</strong></h3>
        <p><strong>Kondisi:</strong> konsumen tunggal, dampak terbatas.</p>
        <p><strong>Kenapa:</strong> kontrak penuh = birokrasi. Sesuaikan berat kontrak dengan blast radius.</p>
      </div>

      <div className="decision-card">
        <h3>3. Janji ke pihak eksternal / regulator → <strong>SLA formal (dengan konsekuensi)</strong></h3>
        <p><strong>Kondisi:</strong> komitmen hukum/bisnis.</p>
        <p><strong>Kenapa:</strong> SLA = janji + penalti. Jangan obral SLA; tiap SLA menaikkan biaya operasionalmu.</p>
      </div>

      <div className="decision-card">
        <h3>4. Error budget habis → <strong>freeze perubahan, fokus stabilitas</strong></h3>
        <p><strong>Kondisi:</strong> SLO jebol berulang.</p>
        <p><strong>Kenapa:</strong> menambah fitur di atas fondasi goyang = mempercepat keruntuhan. Budget adalah rem yang objektif.</p>
      </div>

      <div className="decision-card">
        <h3>5. Breaking change tak terhindarkan → <strong>versi baru + masa transisi + umumkan via lineage</strong></h3>
        <p><strong>Kondisi:</strong> skema harus berubah secara fundamental.</p>
        <p><strong>Kenapa:</strong> v1 tetap hidup 90 hari memberi konsumen waktu migrasi — tanpa drama hari gajian.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tulis kontrak sebelum insiden</strong> — mulai dari 1 tabel kritis.</li>
          <li><strong>SLO = angka</strong> ("95% ≤ 2 jam"), bukan kata sifat ("secepatnya").</li>
          <li><strong>Budget habis = freeze.</strong> Bukan debat, fakta.</li>
          <li><strong>Rename = breaking.</strong> Kalau ragu, versikan.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Kontrak Tabel Gaji — Dari Janji ke Angka</h2>
      <p>Tabel <code className="inline">payroll_gaji</code> dipakai tim payroll tiap tanggal 25. Kontraknya: <strong>tersedia ≤ jam 06.00</strong>, <strong>kelengkapan ≥ 99,5%</strong>, <strong>skema v3</strong>. Ikuti bagaimana janji diterjemahkan menjadi SLO, SLI, dan error budget — lalu apa yang terjadi saat dilanggar.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — SLI &amp; SLO: ukur janjinya (klik untuk buka)</summary>
        <p>SLI (indikator): <em>% bulan di mana tabel siap ≤ 06.00 tanggal 25</em> dan <em>% baris lengkap</em>.</p>
        <p>Data 12 bulan terakhir: 11 bulan tepat waktu (1 bulan telat 40 menit), kelengkapan rata-rata 99,7%.</p>
        <p><Tex math={String.raw`\text{SLI ketepatan} = \frac{11}{12} = 91{,}7\%`} /></p>
        <p>SLO yang ditulis di kontrak: <strong>95%</strong> tepat waktu per tahun. <Tex math={String.raw`91{,}7\% < 95\%`} /> → <strong>SLO DILANGGAR</strong>. Tanpa kontrak tertulis, "telat 40 menit sekali setahun" = insiden kecil yang dilupakan. Dengan kontrak: ia <strong>pelanggaran terukur</strong> yang memicu konsekuensi (lihat error budget).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Error budget: jatah gagal yang sehat</summary>
        <p><Tex math={String.raw`\text{error budget} = 100\% - \text{SLO} = 100\% - 95\% = 5\%`} block /></p>
        <p>Per tahun: <Tex math={String.raw`5\% \times 12 \text{ bulan} = 0{,}6 \text{ bulan}`} /> ≈ <strong>1 keterlambatan ditoleransi per tahun</strong>. Realita: 1 keterlambatan terjadi → budget <strong>habis 100%</strong> (1 dari 1 jatah).</p>
        <p>Aturan error budget: <strong>budget habis = feature freeze</strong>. Tim produsen dilarang menambah kolom/fitur baru sampai keandalan pulih (mis. 3 bulan berturut-turut tepat waktu). Ini <em>kontrak dua arah</em>: konsumen berhak menuntut, produsen berhak menolak request baru saat sedang memperbaiki. Tanpa mekanisme ini, "janji" = basa-basi.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Harga pelanggaran: rupiahnya</summary>
        <p>Keterlambatan 40 menit tanggal 25: 8.500 karyawan gajian telat → 1.200 komplain ke HR → tim HR lembur 3 jam × 5 orang × Rp150.000 = <strong>Rp2,25 juta</strong> + denda keterlambatan transfer massal Rp5 juta + <em>kepercayaan</em> (tak terukur, termahal).</p>
        <p><Tex math={String.raw`\text{biaya 1 pelanggaran} \approx \text{Rp}7{,}25 \text{ jt} + \text{kepercayaan}`} /></p>
        <p>Bandingkan dengan biaya pencegahan: job monitoring + alert (Rp2 juta/bulan = Rp24 juta/tahun). <strong>1 pelanggaran (Rp7,25 jt) &lt; Rp24 jt/tahun?</strong> Secara rupiah murni, monitoring "lebih mahal" — tapi kepercayaan karyawan bukan line item yang bisa dinegosiasi. Inilah kenapa SLO untuk payroll/gaji selalu ketat: <strong>biaya reputasi &gt;&gt; biaya teknis</strong>.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Versioning: "cuma nambah kolom" yang meruntuhkan 4 dashboard</summary>
        <p>Produsen menambah kolom <code className="inline">tunjangan_kinerja</code> dan <em>mengganti nama</em> <code className="inline">gaji_pokok</code> → <code className="inline">gaji_dasar</code> ("biar konsisten"). 4 dashboard konsumen pakai <code className="inline">SELECT *</code>:</p>
        <ul>
          <li>2 dashboard error total (kolom tidak ditemukan) → <strong>down 6 jam</strong>.</li>
          <li>2 dashboard <em>diam-diam salah</em>: <code className="inline">SELECT *</code> menggeser posisi kolom → tunjangan masuk ke kolom gaji di chart. Salah tanpa error = terburuk.</li>
        </ul>
        <p>Dengan kontrak versioning: rename = <strong>breaking change</strong> → wajib <strong>major version (v3 → v4)</strong> + masa transisi 30 hari (v3 tetap jalan, deprecated) + notifikasi ke semua konsumen terdaftar. Biaya: 30 hari menjalankan 2 versi (±Rp3 juta komputasi). Harga tanpa versioning: 4 dashboard salah/down + kepercayaan (lagi). <strong>Aturan: tambah kolom = minor (aman); rename/hapus/ubah tipe = major (butuh transisi).</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> kontrak data terbaik ditulis <strong>mundur dari insiden</strong>: "apa yang paling menyakitkan jika berubah?" → itulah yang dikontrakkan (skema, SLA, definisi). Kontrak yang mencoba mengontrakkan <em>segalanya</em> = 40 halaman yang tidak dibaca siapa pun. Tiga klausul yang paling sering menyelamatkan: (1) definisi kolom kunci, (2) SLA ketersediaan, (3) kebijakan breaking change.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Kontrak sebagai kode: 30 baris YAML vs 40 halaman PDF</summary>
        <p>Kontrak PDF 40 halaman: dibaca 1×, basi 3 bulan kemudian, tidak ada yang mengeksekusi. Kontrak YAML (ODCS) 30 baris: di Git, di-review, <strong>dieksekusi pipeline tiap run</strong>.</p>
        <p>Biaya tulis: PDF 40 jam vs YAML 4 jam. Nilai: PDF = <strong>niat baik</strong>; YAML = <strong>penegakan</strong> (breaking change = CI merah = deploy tertolak).</p>
        <p><Tex math={String.raw`\frac{\text{nilai}}{\text{biaya}}: \text{ YAML } \gg \text{ PDF}`} block /></p>
        <p><strong>Kontrak yang tidak dieksekusi mesin = saran.</strong> Tulis kontrak di tempat yang bisa menggagalkan deploy.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Kontrak = API untuk Data</h2>
      <p>Software engineer tidak akan memakai API tanpa dokumentasi + versioning + SLA. Tapi tim data memakai <em>tabel</em> tanpa ketiganya setiap hari. Data contract = memperlakukan dataset sebagai <strong>produk API</strong>:</p>
      <ul>
        <li><strong>Produsen ↔ konsumen, bukan hulu ↔ hilir.</strong> "Hulu/hilir" = hubungan teknis; "produsen/konsumen" = hubungan <em>layanan</em>. Pergeseran kata ini penting: produsen punya <strong>kewajiban layanan</strong> (komunikasi perubahan!), konsumen punya <strong>kewajiban adaptasi</strong> (baca changelog!). Tanpa kontrak, keduanya saling menyalahkan saat rusak — dengan kontrak, ada wasitnya (teks).</li>
        <li><strong>Kontrak hidup di kode, bukan di PDF.</strong> Kontrak ideal = <em>executable</em>: skema di-registry (Avro/Protobuf), test dbt memverifikasi SLO tiap run (DM5/DM7), breaking change terdeteksi CI (Lab 2 lesson ini). PDF 40 halaman = niat baik; test yang gagal saat kontrak dilanggar = penegakan.</li>
        <li><strong>Data mesh membutuhkan kontrak sebagai fondasinya</strong> (DM14): desentralisasi tanpa kontrak = 20 tim memproduksi 20 dialek data. Kontrak = <em>protokol</em> yang membuat desentralisasi tidak menjadi anarki. Urutan adopsi yang benar: kontrak dulu, mesh kemudian.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola "kontrak sebagai kode" yang dipakai perusahaan dewasa — <strong>Open Data Contract Standard (ODCS)</strong>: YAML berisi pemilik, SLA, skema, kualitas ekspektasi. Disimpan di Git, di-review seperti kode, dieksekusi pipeline. Saat analis baru join dan bertanya "tabel ini bisa dipercaya?", jawabannya bukan "tanya Budi" — tapi <strong>baca kontraknya</strong> (sinergi dengan DM10: katalog).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kontrak data = dokumen hukum yang ditandatangani direksi."</strong></p>
        <p><strong>Yang benar:</strong> kontrak yang efektif = <strong>ringkas, berversi, dan dieksekusi mesin</strong>. Dokumen hukum 40 halaman tidak mencegah kolom hilang di hari gajian; test otomatis yang memblokir deploy saat skema berubah = mencegah. Tanda kontrak yang sehat: <strong>produsen takut melanggarnya karena mesin akan protes</strong>, bukan karena "nanti ditegur". Mulai dari 1 halaman: pemilik, 3 kolom kunci + definisinya, SLA, dan aturan breaking change. Itu sudah mengalahkan 90% perusahaan.</p>
      </div>

      <div className="callout">
        <h3>📝 Contoh Kontrak YAML Minimal (30 baris yang mengeksekusi)</h3>
        <p>Kontrak <code className="inline">payroll_gaji</code> sebagai kode (ODCS-style, disederhanakan):</p>
        <ul>
          <li><strong>Pemilik:</strong> tim People Data (Ani) — <strong>konsumen terdaftar:</strong> payroll, finance (2 tim).</li>
          <li><strong>SLA:</strong> tersedia ≤ jam 06.00 tiap tanggal 25; <strong>SLO:</strong> 95% tepat waktu/tahun.</li>
          <li><strong>Skema v3:</strong> <code className="inline">nik: string (wajib)</code>, <code className="inline">gaji_pokok: int (wajib, ≥ 0)</code>, <code className="inline">tgl_gajian: date (wajib)</code>.</li>
          <li><strong>Kualitas:</strong> kelengkapan ≥ 99,5%; keunikan(nik) = 100%.</li>
          <li><strong>Breaking change:</strong> rename/hapus/ubah tipe = major → versi baru + transisi 30 hari + notifikasi konsumen.</li>
          <li><strong>Penegakan:</strong> CI menolak deploy yang melanggar skema/SLA; pelanggaran SLO → feature freeze produsen.</li>
        </ul>
        <p>30 baris ini <strong>dieksekusi mesin tiap run</strong> — vs PDF 40 halaman yang dibaca 1× lalu basi. <strong>Kontrak yang tidak bisa menggagalkan deploy = saran.</strong></p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Detektor Pelanggaran Kontrak Otomatis</h2>
      <p>Tulis pemeriksa kontrak mini: bandingkan skema &amp; SLA aktual vs kontrak, keluarkan vonis.</p>
      <PyodideLab
        title="Lab 3 — Wasit Kontrak"
        hint="Coba: ubah skema_aktual (hapus kolom 'gaji_pokok' atau ubah tipenya). Vonis apa yang keluar? Itulah breaking change detector."
        defaultCode={`# Lab 3: wasit kontrak data — skema + SLA
KONTRAK = {
    "tabel": "payroll_gaji",
    "versi": 3,
    "kolom_wajib": {"nik": "string", "gaji_pokok": "int", "tgl_gajian": "date"},
    "sla_jam": 6,          # siap <= jam 06.00 tgl 25
    "slo_tepat_waktu": 0.95,
}

# Simulasi kondisi aktual bulan ini (UBAH untuk eksperimen!)
skema_aktual = {"nik": "string", "gaji_pokok": "int", "tgl_gajian": "date",
                "tunjangan_kinerja": "int"}   # produsen "cuma nambah kolom"
siap_jam = 6.67          # siap jam 06:40 -> telat!
riwayat_tepat = [1,1,1,1,1,1,1,1,1,1,1,0]  # 11/12 tepat waktu

pelanggaran = []
# 1) Cek breaking change: kolom wajib hilang / tipe berubah
for kol, tipe in KONTRAK["kolom_wajib"].items():
    if kol not in skema_aktual:
        pelanggaran.append(f"BREAKING: kolom '{kol}' HILANG")
    elif skema_aktual[kol] != tipe:
        pelanggaran.append(f"BREAKING: '{kol}' berubah tipe {tipe}->{skema_aktual[kol]}")
# kolom baru = minor, bukan breaking
baru = set(skema_aktual) - set(KONTRAK["kolom_wajib"])
if baru: print(f"INFO: kolom baru {baru} -> minor change, aman.")

# 2) Cek SLA bulan ini
if siap_jam > KONTRAK["sla_jam"]:
    pelanggaran.append(f"SLA: siap jam {siap_jam:.2f} > {KONTRAK['sla_jam']}.00")

# 3) Cek SLO tahunan
sli = sum(riwayat_tepat) / len(riwayat_tepat)
if sli < KONTRAK["slo_tepat_waktu"]:
    pelanggaran.append(f"SLO: {sli:.1%} < {KONTRAK['slo_tepat_waktu']:.0%} -> FEATURE FREEZE")

print("Vonis wasit kontrak:")
if pelanggaran:
    for p in pelanggaran: print("  ⛔", p)
else:
    print("  ✅ Semua klausul terpenuhi. Lanjut.")
print()
print("Refleksi: tanpa wasit otomatis, siapa yang menangkap 'cuma nambah kolom'?")`}
      />

      <h2 id="case">📋 Mini-Case: "Cuma Nambah Kolom" yang Meruntuhkan 4 Dashboard</h2>
      <div className="callout">
        <p>Tim sumber menambah kolom <code className="inline">diskon</code> ke tabel transaksi — non-breaking, seharusnya aman. Tapi 4 dashboard error. Investigasi: dashboard memakai <code className="inline">SELECT *</code>; kolom baru menggeser <strong>posisi ordinal</strong> yang dipakai kode lama (<code className="inline">row[7]</code> kini menunjuk kolom berbeda!). Angka diskon masuk ke kolom pajak.</p>
        <p><strong>Pertanyaan:</strong> (a) Siapa yang salah — tim sumber atau dashboard? (b) Dua praktik apa yang mencegah ini? (c) Pelajaran tentang "non-breaking"?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Keduanya</strong>: sumber tidak mengumumkan (langgar etika kontrak); dashboard memakai <code className="inline">SELECT *</code> + akses ordinal (praktik rapuh).</p>
          <p>(b) (1) <strong>Kontrak + changelog</strong>: umumkan dulu; (2) <strong>larang SELECT *</strong> di kode produksi — sebut kolom eksplisit by name.</p>
          <p>(c) "Non-breaking" hanya berlaku untuk konsumen yang <strong>sehat</strong> (akses by name). Kontrak melindungi yang disiplin; ia tidak menyelamatkan kode rapuh. Standarisasi konsumen sama pentingnya.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: SLO &amp; error budget, breaking change, dan harga pelanggaran.</p>

      <details className="worked">
        <summary>Soal 1 — SLO: 10 bulan terakhir, 8 bulan tabel siap tepat waktu. SLO kontrak 90%. Apakah SLO dilanggar? Berapa error budget-nya?</summary>
        <p>SLI = <Tex math={String.raw`8/10 = 80\% < 90\%`} /> → <strong>DILANGGAR</strong>.</p>
        <p>Error budget = <Tex math={String.raw`100\% - 90\% = 10\% \;\Rightarrow\; 10\% \times 10 = 1 \text{ keterlambatan}`} block /></p>
        <p>Jatah 1, terjadi 2 → budget habis 200%. Konsekuensi: <strong>feature freeze</strong> sampai 3 bulan berturut-turut tepat waktu.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Versioning: produsen menghapus kolom <code className="inline">kode_cabang</code> yang dipakai 3 dashboard. Jenis change apa? Apa yang wajib dilakukan?</summary>
        <p><strong>Major (breaking change)</strong>. Wajib: naikkan versi (v3→v4), masa transisi 30 hari (v3 tetap hidup, deprecated), notifikasi ke 3 konsumen terdaftar. <strong>Hapus kolom ≠ "bersih-bersih" — ia pemutusan kontrak.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Harga: tabel gaji telat 1 jam. 5.000 karyawan; tim HR lembur (4 orang × 2 jam × Rp200.000) + denda transfer Rp3 juta. Total biaya langsung?</summary>
        <p><Tex math={String.raw`4 \times 2 \times 200.000 + 3.000.000 = 1{,}6 \text{ jt} + 3 \text{ jt} = \text{Rp}4{,}6 \text{ jt}`} block /></p>
        <p>Kecil dibanding biaya monitoring (Rp24 jt/tahun)? Ya — tapi <strong>kepercayaan 5.000 karyawan</strong> tidak ada di perhitungan ini. Itulah kenapa SLO gaji selalu ketat.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bedanya SLI, SLO, dan SLA?"
        options={[
          "Sama saja, istilah marketing",
          "SLI = ukuran mentah (fakta); SLO = target internal (janji tim); SLA = janji kontraktual ke luar dengan konsekuensi",
          "SLA paling ringan",
          "SLO tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: tiga lapis — fakta, janji internal, janji hukum. Jangan obral SLA; tiap SLA = biaya operasional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. SLO 95% → error budget 5%. Budget habis di minggu ke-3. Keputusan tepat?"
        options={[
          "Tetap rilis, kejar target fitur",
          "Freeze perubahan non-kritis; fokus stabilitas sampai budget pulih",
          "Naikkan SLO jadi 99% agar terlihat bagus",
          "Sembunyikan dari manajemen",
        ]}
        correct={1}
        explanation="Benar: budget adalah rem objektif. 'Budget habis' = fakta, bukan opini — itulah gunanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Tim sumber me-rename kolom gaji_pokok → basic_salary tanpa pemberitahuan. Ini…"
        options={[
          "Perubahan kecil yang wajar",
          "Breaking change — rename = hapus+tambah bagi mesin; wajib versi baru + pemberitahuan via kontrak",
          "Bukan masalah jika datanya sama",
          "Tanggung jawab konsumen untuk menebak",
        ]}
        correct={1}
        explanation="Benar: tidak ada 'rename kecil'. Cerita pembuka menunjukkan harganya: gaji 3.000 orang telat 4 hari."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Menambah kolom nullable baru ke tabel terkontrak termasuk…"
        options={[
          "Breaking change",
          "Non-breaking — konsumen lama (akses by name) tidak rusak",
          "Dilarang keras",
          "Harus ganti versi mayor",
        ]}
        correct={1}
        explanation="Benar: tambah nullable = aman untuk konsumen sehat. Tapi tetap umumkan (changelog) — dan pastikan konsumen tidak pakai SELECT *."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kenapa SLO 100% adalah target yang salah?"
        options={[
          "Karena tidak keren",
          "Karena biaya mengejar 1% terakhir eksponensial; SLO sehat sedikit di bawah sempurna agar ada budget untuk inovasi",
          "Karena tidak bisa dihitung",
          "Karena pelanggan tidak peduli",
        ]}
        correct={1}
        explanation="Benar: 100% = tidak jujur atau boros. Google SRE: sisakan jatah gagal yang sehat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Tiga serangkai penegakan kontrak yang efektif?"
        options={[
          "Kontrak + rapat + harapan",
          "Kontrak (janji tertulis) + lineage (tahu siapa konsumennya) + pintu otomatis/test (tegakkan oleh mesin)",
          "Hanya dokumentasi wiki",
          "Hanya chat grup",
        ]}
        correct={1}
        explanation="Benar: janji tanpa tahu siapa yang terdampak = surat tanpa alamat; tanpa penegakan mesin = aturan tanpa polisi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Data contract:</strong> skema + semantik + SLO + kebijakan perubahan + pemilik — ditulis sebelum insiden.</li>
          <li><strong>SLI/SLO/SLA:</strong> fakta → janji internal → janji hukum. SLO = angka, bukan kata sifat.</li>
          <li><strong>Error budget:</strong> 100% − SLO; habis = freeze. Rem objektif, bukan debat.</li>
          <li><strong>Breaking vs non-breaking:</strong> hapus/rename/ubah tipe = breaking → versi baru + transisi + umumkan.</li>
          <li><strong>Jangan:</strong> ubah skema diam-diam; obral SLA; pakai SELECT * di produksi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm7-kualitas-data" className="btn btn-secondary btn-sm">← DM7</Link>
        <Link href="/learn/dm9-governance" className="btn btn-primary btn-sm">Next: DM9 →</Link>
      </div>
    </div>
  );
}
