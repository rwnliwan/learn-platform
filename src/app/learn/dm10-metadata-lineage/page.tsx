"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM10Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const searchData = [
    {
      x: ["Tanpa katalog", "Dengan katalog"],
      y: [45, 8],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["45 menit", "8 menit"],
      textposition: "outside",
    },
  ];

  const metaData = [
    {
      x: ["Teknis", "Bisnis", "Operasional"],
      y: [40, 35, 25],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#94a3b8"] },
      text: ["skema, tipe, null%", "definisi, owner", "jadwal, freshness"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Katalog mini — "Google untuk data"
# Tanpa katalog: analis harus tanya sana-sini. Dengan katalog: search!

katalog = [
    {"nama": "bronze_transaksi", "domain": "payments",
     "deskripsi": "Log mentah transaksi dari core banking (JSON)",
     "owner": "Tim Core Banking", "kualitas": "mentah - JANGAN untuk laporan",
     "kolom": ["id", "payload_json", "received_at"]},
    {"nama": "silver_nasabah", "domain": "customer",
     "deskripsi": "Data nasabah bersih, deduplikasi, SCD2",
     "owner": "Data Steward (Rina)", "kualitas": "terkurasi",
     "kolom": ["nasabah_id", "nama", "kota", "valid_from", "valid_to"]},
    {"nama": "gold_penjualan_harian", "domain": "sales",
     "deskripsi": "Agregat penjualan per hari per cabang - RESMI untuk direksi",
     "owner": "Tim Analytics", "kualitas": "gold - SLO 99%",
     "kolom": ["tanggal", "cabang_id", "total_nominal", "jumlah_transaksi"]},
    {"nama": "gold_risiko_nasabah", "domain": "risk",
     "deskripsi": "Skor risiko per nasabah untuk limit kredit",
     "owner": "Tim Risiko (Budi)", "kualitas": "gold - butuh approval akses",
     "kolom": ["nasabah_id", "skor", "kelas_risiko"]},
]

def cari(keyword):
    hasil = [t for t in katalog
             if keyword.lower() in (t["nama"] + t["deskripsi"] + t["domain"]).lower()]
    for t in hasil:
        print(f"  {t['nama']}")
        print(f"    {t['deskripsi']}")
        print(f"    owner: {t['owner']} | {t['kualitas']}")
    if not hasil: print("  (tidak ketemu — inilah yang terjadi TANPA katalog)")

print('Analis baru cari "penjualan":')
cari("penjualan")
print()
print('Analis cari "risiko":')
cari("risiko")
print()
print("Tanpa katalog, analis butuh 45 menit tanya sana-sini (lihat chart).")
print("Dengan katalog: 8 menit + langsung tahu owner & boleh dipakai untuk apa.")
print()
print("Coba: cari 'nasabah' — berapa tabel? Mana yang Gold?")`;

  const lab2Code = `# Lab 2: Lineage — "kalau tabel ini rusak, apa saja yang kena?"
# Graph: sumber -> ... -> dashboard. Telusuri DUA arah.

edges = [  # (dari, ke)
    ("core_banking", "bronze_transaksi"),
    ("bronze_transaksi", "silver_transaksi"),
    ("silver_transaksi", "gold_penjualan_harian"),
    ("silver_transaksi", "gold_risiko_nasabah"),
    ("gold_penjualan_harian", "dashboard_direksi"),
    ("gold_penjualan_harian", "laporan_ojk"),
    ("gold_risiko_nasabah", "dashboard_direksi"),
    ("hr_system", "silver_nasabah"),
    ("silver_nasabah", "gold_risiko_nasabah"),
]

def downstream(node, edges, visited=None):
    visited = visited or set()
    for a, b in edges:
        if a == node and b not in visited:
            visited.add(b); downstream(b, edges, visited)
    return visited

def upstream(node, edges, visited=None):
    visited = visited or set()
    for a, b in edges:
        if b == node and a not in visited:
            visited.add(a); upstream(a, edges, visited)
    return visited

rusak = "silver_transaksi"
print(f"INSIDEN: '{rusak}' korup!")
print("Terdampak (downstream):")
for t in sorted(downstream(rusak, edges)):
    print(f"  - {t}")
print()
print("Akar masalah (upstream) dari 'dashboard_direksi':")
for t in sorted(upstream("dashboard_direksi", edges)):
    print(f"  - {t}")
print()
print("Tanpa lineage: butuh rapat 2 jam untuk petakan ini (ingat DM1).")
print("Dengan lineage: 2 detik + alert otomatis ke semua owner terdampak.")
print()
print("Coba: 'core_banking' down — apa saja yang kena?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM10 — Data Management</span>
        <h1 className="display-title">Metadata & Lineage:<br />Peta Harta Karun Dataran Data</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 45 Menit untuk Satu Tabel</a></li>
          <li><a href="#metadata">Metadata — Data tentang Data</a></li>
          <li><a href="#katalog">Katalog — Google untuk Data</a></li>
          <li><a href="#glossary">Glossary Bisnis — Kamus Satu Bahasa</a></li>
          <li><a href="#lineage">Lineage — Silsilah Data</a></li>
          <li><a href="#lab1">🔬 Lab 1: Katalog Mini — Search, Bukan Tanya</a></li>
          <li><a href="#lab2">🔬 Lab 2: Lineage — Lacak Dampak & Akar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metadata Apa untuk Siapa</a></li>
          <li><a href="#worked">🔢 Worked Example: 45 Menit → 40 Detik</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Lineage = Silsilah Angka</a></li>
          <li><a href="#lab3">🔬 Lab 3: Radar Blast Radius</a></li>
          <li><a href="#case">📋 Mini-Case: Kolom Misterius "flag_x"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 3 jenis metadata (teknis, bisnis, operasional) beserta contohnya.</li>
          <li>Menjelaskan fungsi katalog data dan informasi minimal tiap entri.</li>
          <li>Menyusun entri glossary bisnis yang mencegah sengketa definisi.</li>
          <li>Membaca lineage dua arah (upstream/downstream) untuk analisis dampak & akar masalah.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 45 Menit untuk Satu Tabel</h2>
      <div className="story">
        <p>Analis baru, hari pertama, ditugasi "hitung total penjualan bulan lalu". Sederhana? Ia butuh <strong>45 menit</strong> hanya untuk menemukan tabel yang benar: ada <code className="inline">penjualan</code>, <code className="inline">penjualan_v2</code>, <code className="inline">penjualan_final</code>, <code className="inline">penjualan_final_beneran</code>. Ia tanya 4 orang, dapat 3 jawaban beda. Akhirnya pakai <code className="inline">penjualan_final</code> — yang ternyata tabel percobaan intern 2023.</p>
        <p>Twist-nya: perusahaan itu punya 2.000 tabel dan <strong>nol</strong> katalog. Setiap analis baru mengulang ritual 45 menit ini — 50 analis × 45 menit × tiap butuh tabel baru = ribuan jam terbuang per tahun. Dan yang lebih mahal: <em>keputusan berdasarkan tabel yang salah</em>. Metadata & katalog bukan dokumentasi "nice to have" — ia adalah <strong>infrastruktur pencarian</strong> yang menentukan apakah datamu bisa ditemukan dan dipercaya.</p>
      </div>

      <h2 id="metadata">Metadata — Data tentang Data</h2>
      <p><strong>Definisi.</strong> Metadata = informasi yang menjelaskan data. Tiga jenis:</p>
      <ul>
        <li><strong>Teknis:</strong> nama tabel/kolom, tipe data, null%, jumlah baris, skema. <em>"Apa bentuknya?"</em> — dihasilkan otomatis oleh tool.</li>
        <li><strong>Bisnis:</strong> definisi ("nasabah aktif = ..."), owner, glossary, aturan pakai. <em>"Apa artinya & siapa pemiliknya?"</em> — ditulis manusia, paling berharga, paling sering kosong.</li>
        <li><strong>Operasional:</strong> jadwal pipeline, freshness terakhir, siapa mengakses, kapan diubah. <em>"Bagaimana keadaannya?"</em> — untuk monitoring (DM7).</li>
      </ul>

      <PlotlyChart
        data={metaData}
        title="Komposisi Metadata Ideal vs Kenyataan Umum"
        layout={{ xaxis: { title: "Jenis" }, yaxis: { title: "% kelengkapan tipikal" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = seberapa lengkap tiap jenis metadata di perusahaan tipikal.</p>
        <p><strong>Interpretasi:</strong> teknis paling lengkap (otomatis), <strong>bisnis paling bolong</strong> (butuh manusia menulis). Padahal bisnis-lah yang menjawab "bolehkah saya pakai tabel ini untuk laporan direksi?" <strong>Pelajaran:</strong> investasi metadata = investasi menulis definisi & owner, bukan beli tool mahal.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> metadata teknis menjawab "ADA apa", bisnis menjawab "BOLEH pakai untuk apa". Analis yang hanya punya metadata teknis = punya peta tanpa legenda: tahu ada jalan, tidak tahu ke mana ia menuju.</p>
      </div>

      <h2 id="katalog">Katalog — Google untuk Data</h2>
      <p><strong>Definisi.</strong> Katalog data = <strong>inventaris terpusat yang bisa dicari</strong> atas semua aset data: tabel, dashboard, definisi, owner, kualitas, lineage. Contoh tools: Amundsen, DataHub (open source), Atlan, Alation.</p>
      <p><strong>Entri katalog yang berguna (minimal):</strong> nama + deskripsi bahasa manusia, <strong>owner</strong> (nama orang!), domain, <strong>klasifikasi kualitas</strong> (mentah/terkurasi/gold — jembatan DM4), glossary terkait, lineage ringkas, cara akses + siapa boleh.</p>
      <p><strong>Yang membedakan katalog hidup vs mati:</strong> (1) <strong>terintegrasi alur kerja</strong> (analis menemukannya saat butuh, bukan wiki terpisah), (2) <strong>ada pemilik tiap entri</strong>, (3) <strong>sinyal sosial</strong> (berapa orang pakai? rating? "tabel ini deprecated, pakai X").</p>

      <PlotlyChart
        data={searchData}
        title="Waktu Menemukan Tabel yang Tepat"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Menit" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = waktu rata-rata analis menemukan tabel yang benar.</p>
        <p><strong>Interpretasi:</strong> katalog memangkas 45 → 8 menit (~5×). Kalikan 50 analis × tiap minggu = <strong>alasan bisnis katalog</strong> dalam satu angka. Inilah cara menjual proyek metadata ke manajemen: bukan "dokumentasi", tapi "jam kerja".</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Beli tool katalog = metadata selesai."</strong></p>
        <p><strong>Yang benar:</strong> tool hanya menyediakan <em>rak</em>; <strong>isinya</strong> (definisi, owner, deskripsi) harus ditulis manusia — dan manusia hanya menulis jika ada <strong>insentif & pemilik</strong> (steward, DM9). Katalog tanpa konten = perpustakaan tanpa buku. Mulai dari 50 tabel kritis yang terisi penuh, bukan 2.000 yang kosong.</p>
      </div>

      <h2 id="glossary">Glossary Bisnis — Kamus Satu Bahasa</h2>
      <p><strong>Definisi.</strong> Glossary = daftar <strong>istilah bisnis + definisi tunggal yang disahkan</strong> + owner istilah. Contoh entri yang baik:</p>
      <div className="callout">
        <p><strong>"Nasabah aktif"</strong> = nasabah dengan ≥1 transaksi finansial dalam 30 hari kalender terakhir.<br />
        Owner: Head of Retail Banking (Rina). Disahkan: council 2026-03-01. Berlaku untuk: semua laporan.<br />
        Bukan: "punya rekening" / "pernah login" (itu definisi lama v0, deprecated 2025).</p>
      </div>
      <p><strong>Anatomi entri glossary:</strong> istilah, definisi presisi (angka, bukan kata sifat!), owner, tanggal pengesahan, versi, istilah terkait, <strong>definisi yang digantikan</strong> (agar yang lama tidak gentayangan).</p>
      <p><strong>Kenapa ini senjata anti-DM1-mini-case:</strong> 3 definisi "nasabah aktif" tidak akan terjadi jika glossary ada dan dashboard wajib merujuk entri glossary (bukan definisi karangan tiap tim).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> definisi yang baik mengandung <strong>angka & batas</strong> ("≥1 transaksi", "30 hari kalender"), bukan kata sifat ("cukup aktif", "baru-baru ini"). Jika definisimu tidak bisa di-test oleh mesin (DM7), ia bukan definisi — ia puisi.</p>
      </div>

      <h2 id="lineage">Lineage — Silsilah Data</h2>
      <p><strong>Definisi.</strong> Lineage = peta <strong>asal-usul & aliran</strong> data: tabel A → transformasi → tabel B → dashboard C. Dua arah pakai:</p>
      <ul>
        <li><strong>Downstream (dampak):</strong> "tabel X rusak → apa saja yang kena?" → alert semua owner, prioritaskan perbaikan. (Tanpa ini: rapat 2 jam, DM1.)</li>
        <li><strong>Upstream (akar):</strong> "angka dashboard aneh → dari mana asalnya?" → telusuri ke sumber, temukan transformasi yang salah.</li>
      </ul>
      <p><strong>Tingkat lineage:</strong> tabel-level ("A → B") cukup untuk dampak; <strong>kolom-level</strong> ("kolom X dari A.sum(Y)") untuk audit & debug presisi — lebih mahal dibangun, tapi untuk data regulasi (DM13) sering wajib.</p>
      <p><strong>Dari mana lineage didapat:</strong> (1) <strong>parsing kode</strong> (dbt <code className="inline">ref()</code> memberi lineage gratis! — DM5), (2) <strong>query log</strong> database, (3) <strong>manual</strong> untuk yang kritis. Praktik: otomatis untuk 80%, manual untuk 20% kritis.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Lineage = dokumentasi arsitektur yang digambar sekali."</strong></p>
        <p><strong>Yang benar:</strong> lineage yang digambar manual <strong>basi dalam seminggu</strong> (pipeline berubah terus). Lineage harus <strong>dihasilkan otomatis</strong> dari kode/log — diagram statis = fosil. Nilai lineage = selalu kini, bukan pernah benar.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Katalog Mini — Search, Bukan Tanya</h2>
      <p>Rasakan bedanya: cari tabel lewat katalog vs tanya sana-sini.</p>
      <PyodideLab
        title="Lab 1 — Google untuk Data"
        hint="Coba: cari 'nasabah'. Berapa tabel muncul? Mana yang Gold dan siapa ownernya? Itulah jawaban 8 menit."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Lineage — Lacak Dampak & Akar</h2>
      <p>Simulasikan insiden: tabel korup — siapa saja yang kena? Angka aneh — dari mana asalnya?</p>
      <PyodideLab
        title="Lab 2 — Silsilah Dua Arah"
        hint="Coba: 'core_banking' down. Daftar semua yang kena — itulah blast radius yang harus di-alert."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Metadata Apa untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Analis baru / banyak tabel → <strong>katalog searchable + klasifikasi kualitas</strong></h3>
        <p><strong>Kondisi:</strong> ratusan+ tabel, onboarding lambat, salah pakai tabel.</p>
        <p><strong>Kenapa:</strong> 45 → 8 menit per pencarian; label "mentah vs gold" mencegah tragedi tabel percobaan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Sengketa definisi antar tim → <strong>glossary bisnis berversi + disahkan council</strong></h3>
        <p><strong>Kondisi:</strong> "aktif" 3 arti.</p>
        <p><strong>Kenapa:</strong> satu istilah, satu definisi berangka, satu owner, versi tercatat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Insiden pipeline / angka aneh → <strong>lineage otomatis dua arah</strong></h3>
        <p><strong>Kondisi:</strong> butuh tahu dampak & akar cepat.</p>
        <p><strong>Kenapa:</strong> downstream = siapa di-alert; upstream = di mana bugnya. Hasilkan dari kode (dbt), bukan gambar manual.</p>
      </div>

      <div className="decision-card">
        <h3>4. Audit / regulasi → <strong>lineage kolom-level untuk data kritis</strong></h3>
        <p><strong>Kondisi:</strong> harus buktikan asal angka laporan.</p>
        <p><strong>Kenapa:</strong> "angka ini dari kolom X tabel Y via transformasi Z" = bukti, bukan janji (DM13).</p>
      </div>

      <div className="decision-card">
        <h3>5. Metadata sepi peminat → <strong>integrasikan ke alur kerja + beri pemilik</strong></h3>
        <p><strong>Kondisi:</strong> katalog sepi, wiki basi.</p>
        <p><strong>Kenapa:</strong> metadata yang tidak dipakai saat bekerja = mati. Tampilkan di tool analis, wajibkan owner per entri.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Setiap tabel butuh:</strong> deskripsi 1 kalimat + owner (nama!) + label kualitas.</li>
          <li><strong>Definisi = angka</strong>, bukan kata sifat.</li>
          <li><strong>Lineage otomatis</strong> dari kode; manual hanya untuk yang kritis.</li>
          <li><strong>Mulai dari 50 tabel kritis</strong> yang terisi penuh.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: 45 Menit → 40 Detik — Ekonomi Sebuah Katalog</h2>
      <p>Cerita pembuka: analis butuh <strong>45 menit</strong> untuk menjawab "tabel mana yang benar untuk laporan penjualan?" (tanya 3 orang, buka 5 tabel, bandingkan angka). Dengan katalog + lineage, jawabannya <strong>40 detik</strong>. Hitung nilai ekonominya — dan nilai lineage saat insiden.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Nilai katalog: waktu pencarian × orang × frekuensi (klik untuk buka)</summary>
        <p>40 analis, tiap orang rata-rata <strong>3 pencarian tabel/minggu</strong> @ 45 menit.</p>
        <p><Tex math={String.raw`\text{jam/minggu} = 40 \times 3 \times 0{,}75 = 90 \text{ jam}`} /></p>
        <p><Tex math={String.raw`\text{biaya/tahun} = 90 \times 200.000 \times 48 = \text{Rp}864 \text{ jt}`} block /></p>
        <p>Dengan katalog (40 detik/pencarian ≈ 0,011 jam): <Tex math={String.raw`40 \times 3 \times 0{,}011 \times 200.000 \times 48 = \text{Rp}12{,}7 \text{ jt/tahun}`} />.</p>
        <p><strong>Hemat: Rp851 juta/tahun</strong> — hanya dari "menemukan tabel". Katalog (Rp150–300 juta/tahun tooling + 0,5 FTE kurasi) membayar dirinya <strong>~3× lipat</strong> lewat satu fungsi: <em>search</em>. Inilah kenapa Lab 1 lesson ini berjudul "Search, bukan tanya".</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Nilai lineage: blast radius insiden</summary>
        <p>Tabel <code className="inline">stg_transaksi</code> korup (sumber ganti format diam-diam). Tanpa lineage: tim <strong>manual tracing</strong> — 2 engineer × 3 hari menelusuri "apa saja yang baca tabel ini?" Sementara itu 4 dashboard &amp; 1 laporan regulator (DM13!) menampilkan angka salah.</p>
        <p>Dengan lineage otomatis: query 1 detik → <strong>blast radius = 4 dashboard + 1 laporan + 2 model ML</strong>. Respons: bekukan 7 downstream dalam 15 menit, perbaiki sumber, backfill (DM5).</p>
        <p><Tex math={String.raw`\text{MTTR tanpa lineage} = 3 \text{ hari}; \quad \text{dengan lineage} = 4 \text{ jam}`} /></p>
        <p>Selisih 68 jam × 7 konsumen menampilkan angka salah. Untuk laporan regulator: 68 jam angka salah = <strong>potensi denda + kewajiban restatement</strong>. Lineage = <em>asuransi insiden</em>: nilainya nol saat normal, tak ternilai saat krisis.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Glossary: harga satu kata yang beda arti</summary>
        <p>Kata "pendapatan": tim finance = <em>gross</em> (Rp120 M/bulan), tim produk = <em>net setelah refund</em> (Rp112 M/bulan). Selisih <strong>Rp8 M/bulan (6,7%)</strong>. Rapat direksi: dua angka berbeda untuk "satu" kata → 2 jam debat × 8 direktur × Rp2 juta/jam = <strong>Rp32 juta per rapat</strong> — dan rapat seperti ini terjadi <em>tiap bulan</em>.</p>
        <p>Glossary (1 definisi disepakati + pemilik): biaya pembuatan ≈ 20 istilah × 2 jam × Rp500.000 = <strong>Rp20 juta sekali</strong>. Payback: <Tex math={String.raw`20 \text{ jt} / 32 \text{ jt} < 1 \text{ rapat}`} />. <strong>Satu rapat yang tidak terbuang sudah membayar seluruh glossary.</strong> Metadata bisnis termurah dengan ROI tercepat di track ini.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — 3 jenis metadata, 3 ROI berbeda</summary>
        <p><strong>Teknis</strong> (skema, tipe, nullability): ROI = pipeline tidak rusak saat skema berubah (otomatis dari scanner). <strong>Operasional</strong> (jadwal run, pemilik, SLA): ROI = MTTR insiden (Langkah 2). <strong>Bisnis</strong> (definisi, glossary, klasifikasi sensitivitas): ROI = rapat tidak debat + patuh regulasi (Langkah 3). Prioritas adopsi untuk tim kecil: <strong>operasional → bisnis → teknis</strong> — karena scanner teknis bisa otomatis belakangan, tapi "siapa pemilik tabel ini" tidak bisa di-scan dari mana pun.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> metadata yang <strong>ditulis manual</strong> membusuk dalam 3 bulan (tidak ada yang update). Metadata yang <strong>dipanen otomatis</strong> (scanner skema, parser SQL → lineage, log query → popularitas) tetap segar. Aturan: <em>otomatiskan yang bisa</em> (teknis, lineage, usage), <em>kurasi manual hanya yang tidak bisa</em> (definisi bisnis, pemilik). Katalog yang 100% manual = wiki yang mati.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Popularitas sebagai sinyal kepercayaan otomatis</summary>
        <p>Katalog memanen query log: <code className="inline">mart_penjualan</code> dipakai <strong>40×/minggu oleh 12 orang</strong>; <code className="inline">penjualan_final_v2_baru</code> dipakai <strong>0× dalam 90 hari</strong>.</p>
        <p>Tanpa bertanya siapa pun, katalog tahu: yang pertama = <strong>tepercaya</strong> (lolos uji 12 analis), yang kedua = <strong>kandidat arsip</strong>.</p>
        <p><Tex math={String.raw`\text{kepercayaan} \propto \text{penggunaan nyata} \times \text{diversitas pengguna}`} block /></p>
        <p><strong>Metadata terbaik = efek samping.</strong> Tidak ada yang mengetik "tabel ini tepercaya" — kepercayaan <em>dipanen</em> dari perilaku. Inilah bedanya katalog hidup vs wiki mati.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Lineage = Silsilah untuk "Kenapa Angka Ini Berubah?"</h2>
      <p>Pertanyaan paling ditakuti analis: <strong>"Kenapa angka dashboard beda dari kemarin?"</strong> Tanpa lineage: tebak-tebakan 3 hari. Dengan lineage: telusuri <em>upstream</em> (sumber → transformasi → tabel ini) dalam menit. Tiga intuisi:</p>
      <ul>
        <li><strong>Lineage column-level &gt; table-level.</strong> Tahu "dashboard X baca tabel Y" tidak cukup saat tabel Y punya 200 kolom dan yang berubah hanya <code className="inline">diskon</code>. Lineage kolom: <code className="inline">dashboard.pendapatan_bersih ← mart.diskon ← stg.promo.pct</code> → akar masalah ketemu dalam 1 lompatan, bukan 200.</li>
        <li><strong>Lineage = mesin "bagaimana jika".</strong> Sebelum mengubah kolom (DM8: breaking change), query downstream-nya: "siapa saja yang kena?" — 4 dashboard + 1 model ML → rencanakan migrasi. Tanpa ini, "cuma nambah kolom" meruntuhkan 4 dashboard (DM8 mini-case persis ini!).</li>
        <li><strong>Lineage untuk privasi (DM12):</strong> "data NIK mengalir ke mana saja?" — jawab dalam detik untuk audit UU PDP. Tanpa lineage: 3 minggu forensik manual. Metadata = bukti kepatuhan.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola yang bekerja — <strong>lineage otomatis dari parser SQL + dbt</strong> (<code className="inline">ref()</code> sudah membangun graf, DM5). Tidak ada yang mengetik lineage manual. Tim yang mencoba "dokumentasikan lineage di Excel" menyerah dalam 2 bulan; tim yang memanennya dari kode mendapatkannya gratis selamanya. <strong>Metadata terbaik = efek samping dari kerja yang sudah dilakukan</strong> (kode, query log, scanner) — bukan pekerjaan tambahan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Katalog data = wiki/dokumentasi yang ditulis tim data."</strong></p>
        <p><strong>Yang benar:</strong> wiki = <em>kuburan dokumentasi</em> (ditulis sekali, basi selamanya). Katalog modern = <strong>mesin pencari hidup</strong>: skema dipanen otomatis tiap ada perubahan, popularitas dihitung dari query log ("dipakai 40 orang/minggu" = sinyal kepercayaan), pemilik wajib diisi (DM9). Uji katalog: cari tabel yang kamu tidak kenal — jika dalam 1 menit kamu tahu <em>isinya apa, siapa pemiliknya, seberapa dipercaya</em>, katalognya hidup. Jika tidak, itu wiki berkedok katalog.</p>
      </div>

      <div className="callout">
        <h3>🗂️ Contoh Entri Katalog yang "Hidup" (vs wiki mati)</h3>
        <p><strong>Tabel:</strong> <code className="inline">mart_penjualan</code> &nbsp;|&nbsp; <strong>Pemilik:</strong> Tim Revenue Analytics (Budi) &nbsp;|&nbsp; <strong>Klasifikasi:</strong> internal</p>
        <ul>
          <li><strong>Deskripsi (1 kalimat):</strong> penjualan bersih harian per kategori, sumber kebenaran untuk laporan direksi.</li>
          <li><strong>Grain:</strong> 1 baris = 1 kategori × 1 hari. <strong>Refresh:</strong> tiap jam 06.00. <strong>Retensi:</strong> 3 tahun.</li>
          <li><strong>Kualitas:</strong> test 5/5 hijau 30 hari terakhir; kelengkapan 99,8%.</li>
          <li><strong>Popularitas (otomatis):</strong> dipakai 40×/minggu oleh 12 orang — <strong>tepercaya</strong>.</li>
          <li><strong>Lineage:</strong> <code className="inline">stg_transaksi → silver_transaksi → mart_penjualan</code> (klik untuk graf).</li>
          <li><strong>Definisi kunci:</strong> "penjualan bersih" = gross − retur − diskon (lihat glossary).</li>
        </ul>
        <p>Semua kecuali deskripsi &amp; pemilik = <strong>dipanen otomatis</strong>. Analis baru memahami tabel ini dalam <strong>1 menit</strong> — vs 45 menit "tanya sana-sini" di cerita pembuka. <strong>Itulah katalog yang hidup.</strong></p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Blast Radius — Simulasi Dampak Insiden</h2>
      <p>Bangun graf lineage mini, "rusakkan" satu tabel, lihat siapa saja yang kena dalam sekejap.</p>
      <PyodideLab
        title="Lab 3 — Radar Blast Radius"
        hint="Coba: rusakkan 'mart_pendapatan' (hilir) vs 'stg_transaksi' (hulu). Kenapa yang hulu jauh lebih menakutkan? Itulah kenapa test di hulu (DM7)."
        defaultCode={`# Lab 3: blast radius dari graf lineage (BFS downstream)
# Graf: {node: [downstream...]}
lineage = {
    "stg_transaksi":  ["silver_transaksi", "stg_promo"],
    "stg_promo":      ["silver_transaksi"],
    "silver_transaksi": ["mart_penjualan", "mart_pendapatan"],
    "mart_penjualan": ["dashboard_sales", "model_churn"],
    "mart_pendapatan": ["dashboard_finance", "laporan_regulator"],
    "dashboard_sales": [], "dashboard_finance": [],
    "model_churn": [], "laporan_regulator": [],
}
TIPE = {"stg_transaksi":"SUMBER", "stg_promo":"SUMBER", "silver_transaksi":"SILVER",
        "mart_penjualan":"GOLD", "mart_pendapatan":"GOLD", "dashboard_sales":"DASHBOARD",
        "dashboard_finance":"DASHBOARD", "model_churn":"ML", "laporan_regulator":"REGULATOR"}

def blast_radius(rusak):
    kena, antre = [], [rusak]
    while antre:
        node = antre.pop(0)
        for d in lineage[node]:
            if d not in kena:
                kena.append(d); antre.append(d)
    return kena

for target in ["stg_transaksi", "mart_pendapatan"]:
    kena = blast_radius(target)
    kritis = [k for k in kena if TIPE[k] in ("REGULATOR", "ML")]
    print(f"RUSAK: {target} ({TIPE[target]})")
    print(f"  -> {len(kena)} downstream kena: {kena}")
    print(f"  -> KRITIS: {kritis if kritis else '-'}")
    print()
print("Tanpa lineage: butuh 2 engineer x 3 hari untuk tahu daftar ini.")
print("Dengan lineage: 1 detik. Itulah MTTR 3 hari vs 4 jam.")`}
      />

      <h2 id="case">📋 Mini-Case: Kolom Misterius "flag_x"</h2>
      <div className="callout">
        <p>Tabel <code className="inline">gold_nasabah</code> punya kolom <code className="inline">flag_x</code> (0/1, 30% = 1). Tidak ada di katalog, tidak ada di glossary. Tim risiko memakainya sebagai fitur model ("kayaknya penting"); tim audit bertanya "ini apa?" — tidak ada yang tahu. Ternyata: sisa eksperimen intern 2024 yang lupa dihapus, artinya <strong>tidak jelas</strong>.</p>
        <p><strong>Pertanyaan:</strong> (a) Kegagalan metadata apa saja di sini? (b) Langkah beres-beres yang benar? (c) Kebijakan apa agar tidak terulang?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga lapis gagal:</strong> tanpa deskripsi (teknis kosong), tanpa definisi bisnis (glossary kosong), tanpa owner (tidak ada yang ditanya).</p>
          <p>(b) <strong>Jangan langsung hapus!</strong> Cek lineage: siapa memakai <code className="inline">flag_x</code>? Umumkan deprecated + tanggal hapus (etika DM8), migrasi konsumen, baru hapus. Hapus buta = insiden baru.</p>
          <p>(c) <strong>Kontrak kolom</strong>: kolom baru wajib entri katalog + definisi sebelum merge (via review dbt); kolom tanpa owner & definisi &gt;90 hari = kandidat hapus otomatis.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: ekonomi katalog, MTTR lineage, dan harga satu kata.</p>

      <details className="worked">
        <summary>Soal 1 — Katalog: 30 analis × 2 pencarian tabel/minggu × 45 menit × Rp200.000/jam × 48 minggu. Berapa biaya/tahun? Bandingkan jika katalog memangkas pencarian menjadi 1 menit.</summary>
        <p>Tanpa: <Tex math={String.raw`30 \times 2 \times 0{,}75 \times 200.000 \times 48 = \text{Rp}864 \text{ jt/tahun}`} />.</p>
        <p>Dengan: <Tex math={String.raw`30 \times 2 \times \frac{1}{60} \times 200.000 \times 48 = \text{Rp}19{,}2 \text{ jt/tahun}`} block /></p>
        <p><strong>Hemat Rp844,8 juta/tahun</strong> — hanya dari "menemukan tabel". Katalog Rp300 jt/tahun membayar dirinya ~3×.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Lineage: insiden tabel rusak. Tanpa lineage: 2 engineer × 3 hari tracing. Dengan lineage: 15 menit. Jika 5 dashboard menampilkan angka salah selama itu, berapa "jam-dashboard-salah" di tiap skenario?</summary>
        <p>Tanpa: <Tex math={String.raw`3 \times 24 \times 5 = 360`} /> jam-dashboard.</p>
        <p>Dengan: <Tex math={String.raw`0{,}25 \times 5 = 1{,}25`} /> jam-dashboard.</p>
        <p><Tex math={String.raw`\text{rasio} = 360 / 1{,}25 = 288\times`} block /></p>
        <p>288× lebih sedikit kebohongan yang tampil. <strong>Lineage = asuransi insiden.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Glossary: dua definisi "pendapatan" beda 5% dari Rp200 M/bulan. Berapa selisihnya? Jika glossary Rp20 juta mencegah 1 rapat debat sia-sia (Rp32 juta), berapa payback-nya?</summary>
        <p>Selisih = <Tex math={String.raw`0{,}05 \times 200 \text{ M} = \text{Rp}10 \text{ M/bulan}`} />.</p>
        <p>Payback = <Tex math={String.raw`20/32 < 1 \text{ rapat}`} block /></p>
        <p><strong>Satu rapat yang tidak terbuang membayar seluruh glossary.</strong> Metadata bisnis termurah dengan ROI tercepat.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Tiga jenis metadata dan contohnya?"
        options={[
          "Teknis (skema, tipe), bisnis (definisi, owner), operasional (jadwal, freshness) — ketiganya dibutuhkan",
          "Hanya teknis yang penting",
          "Metadata = backup data",
          "Tidak ada jenisnya",
        ]}
        correct={0}
        explanation="Benar: teknis (apa bentuknya), bisnis (apa artinya & milik siapa), operasional (bagaimana keadaannya). Bisnis paling sering kosong & paling berharga."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kenapa tool katalog saja tidak menyelesaikan masalah metadata?"
        options={[
          "Karena mahal",
          "Karena tool hanya menyediakan rak — isi (definisi, owner) harus ditulis manusia dengan insentif & pemilik; katalog kosong = perpustakaan tanpa buku",
          "Karena tidak ada yang butuh",
          "Karena tidak bisa dicari",
        ]}
        correct={1}
        explanation="Benar: 80% masalah katalog = masalah konten & adopsi, bukan tool. Mulai dari 50 tabel kritis terisi penuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Ciri definisi glossary yang BAIK?"
        options={[
          'Mengandung angka & batas presisi ("≥1 transaksi dalam 30 hari kalender") + owner + versi',
          'Kata sifat puitis ("cukup aktif")',
          "Tanpa owner biar fleksibel",
          "Tidak perlu versi",
        ]}
        correct={0}
        explanation="Benar: definisi yang bisa di-test mesin. 'Cukup aktif' bukan definisi — ia puisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Tabel silver_transaksi korup. Dengan lineage, langkah PERTAMA yang benar?"
        options={[
          "Rapat 2 jam untuk petakan dampak",
          "Query downstream lineage: daftar semua tabel/dashboard terdampak → alert owner-nya; lalu telusuri upstream untuk akar masalah",
          "Sembunyikan dari tim lain",
          "Hapus tabelnya",
        ]}
        correct={1}
        explanation="Benar: dua arah lineage — downstream untuk blast radius & alert, upstream untuk root cause. 2 detik vs 2 jam."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk audit regulasi, level lineage yang biasanya dibutuhkan?"
        options={[
          "Tidak butuh lineage",
          "Kolom-level untuk data kritis: 'angka ini dari kolom X via transformasi Z' = bukti, bukan janji",
          "Cukup tahu nama database",
          "Diagram di PowerPoint",
        ]}
        correct={1}
        explanation="Benar: audit butuh bukti presisi. Tabel-level cukup untuk operasional; kolom-level untuk pembuktian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Lineage yang digambar manual di diagram memiliki masalah…"
        options={[
          "Terlalu akurat",
          "Basi dalam seminggu — pipeline berubah terus; lineage harus dihasilkan otomatis dari kode/log",
          "Terlalu murah",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: nilai lineage = selalu kini. dbt ref() memberi lineage gratis — manfaatkan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Metadata:</strong> teknis (bentuk) + bisnis (arti & owner) + operasional (keadaan). Bisnis paling bolong & berharga.</li>
          <li><strong>Katalog:</strong> Google untuk data — searchable, ber-owner, berlabel kualitas; mulai dari 50 tabel kritis.</li>
          <li><strong>Glossary:</strong> satu istilah, satu definisi berangka, satu owner, berversi.</li>
          <li><strong>Lineage:</strong> dua arah (dampak & akar), dihasilkan otomatis, kolom-level untuk audit.</li>
          <li><strong>Jangan:</strong> beli tool tanpa isi; definisi puitis; diagram lineage manual yang basi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm9-governance" className="btn btn-secondary btn-sm">← DM9</Link>
        <Link href="/learn/dm11-master-data" className="btn btn-primary btn-sm">Next: DM11 →</Link>
      </div>
    </div>
  );
}
