"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM17Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const roiData = [
    {
      x: ["Katalog data", "dbt + test", "Orkestrasi", "Master data<br>nasabah", "Metrics layer"],
      y: [320, 250, 180, 400, 220],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["3,2x", "2,5x", "1,8x", "4,0x", "2,2x"],
      textposition: "outside",
    },
  ];

  const literasiData = [
    {
      x: ["Tidak paham<br>data", "Bisa baca<br>dashboard", "Bisa tanya<br>jawab data", "Bisa ambil<br>keputusan", "Advokat<br>data"],
      y: [25, 35, 20, 15, 5],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["25%", "35%", "20%", "15%", "5%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: ROI inisiatif data — bicara bahasa direksi (rupiah, bukan teknologi)
# ROI = (Manfaat - Biaya) / Biaya. Manfaat data = jam hemat + risiko hindari + revenue.

def roi(nama, biaya, manfaat, tahun=1):
    net = manfaat - biaya
    r = net / biaya if biaya else 0
    print(f"{nama}:")
    print(f"  Biaya   : Rp{biaya/1e9:.1f} M")
    print(f"  Manfaat : Rp{manfaat/1e9:.1f} M")
    print(f"  ROI     : {r*100:.0f}% ({r:.1f}x) per {tahun} thn ->",
          "LAYAK ✅" if r > 0.5 else "RAGU ⚠")
    print()
    return r

print("== Portofolio inisiatif data (tahunan, ilustratif) ==")
# Katalog: 50 analis hemat 5 jam/minggu x Rp200rb/jam
roi("Katalog data", 800_000_000, 50*5*52*200_000)
# Master data: cegah kampanye ke duplikat + denda risiko
roi("MDM nasabah", 2_000_000_000, 8_000_000_000)
# dbt+test: cegah 2 insiden dashboard/bln x Rp150jt
roi("dbt + test kualitas", 600_000_000, 2*12*150_000_000)
print("Pelajaran: manfaat data = JAM + RISIKO + REVENUE.")
print("'Data adalah aset' tanpa angka = slogan. Dengan angka = strategi.")
print()
print("Coba: ubah jam hemat katalog 5 -> 2 jam/minggu. Masih layak?")`;

  const lab2Code = `# Lab 2: Roadmap — urutkan inisiatif (dampak vs usaha)
# Aturan: kerjakan kuadran "dampak tinggi, usaha rendah" DULU (quick wins).

inisiatif = [
    ("Katalog 50 tabel kritis",      8, 3),
    ("MDM nasabah full",             9, 9),
    ("dbt + test di 5 pipeline",     7, 4),
    ("Data mesh penuh",              6, 10),
    ("Metrics layer 10 metrik inti", 8, 5),
    ("Training literasi direksi",    7, 2),
    ("Feature store",                5, 8),
    ("Sertifikasi dashboard",        7, 3),
]
# (nama, dampak 1-10, usaha 1-10)

def kuadran(d, u):
    if d >= 6 and u <= 5: return "QUICK WIN ⚡ (kerjakan dulu)"
    if d >= 6 and u > 5:  return "STRATEGIS 🏔 (rencanakan matang)"
    if d < 6 and u <= 5:  return "PENGISI 🧩 (sela-sela)"
    return "HINDARI 🕳 (tunda)"

print("ROADMAP (dampak vs usaha):")
for nama, d, u in sorted(inisiatif, key=lambda x: (-x[1], x[2])):
    print(f"  [{d}/10 dampak | {u}/10 usaha] {nama}")
    print(f"      -> {kuadran(d, u)}")
print()
print("Pelajaran: 'data mesh penuh' dampak 6/usaha 10 = HINDARI dulu.")
print("'Training literasi direksi' dampak 7/usaha 2 = quick win yang diremehkan!")
print()
print("Coba: tambah inisiatifmu sendiri dengan skor jujur. Kuadran apa?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM17 — Data Management</span>
        <h1 className="display-title">Strategi Data:<br />Dari Proyek Teknologi ke Senjata Bisnis</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Proyek Rp5 Miliar yang Tidak Dipakai</a></li>
          <li><a href="#strategi">Strategi Data — Kompas, Bukan Peta Buta</a></li>
          <li><a href="#roi">ROI — Bahasa yang Dimengerti Direksi</a></li>
          <li><a href="#roadmap">Roadmap — Urutan yang Menang</a></li>
          <li><a href="#literasi">Literasi Data — Vaksin Buta Angka</a></li>
          <li><a href="#komunikasi">Komunikasi Stakeholder — Seni Menerjemahkan</a></li>
          <li><a href="#karir">Karir — Peta Jalan Data Engineer 2026</a></li>
          <li><a href="#lab1">🔬 Lab 1: ROI — Hitung Sendiri Kelayakannya</a></li>
          <li><a href="#lab2">🔬 Lab 2: Roadmap — Kuadran Dampak vs Usaha</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Strategi & Karir</a></li>
          <li><a href="#worked">🔢 Worked Example: Bedah Proyek Rp5 M</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Komunikasi = Menerjemahkan</a></li>
          <li><a href="#lab3">🔬 Lab 3: Mesin Prioritas Roadmap</a></li>
          <li><a href="#case">📋 Mini-Case: "AI Dulu, Data Nanti"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan komponen strategi data dan kaitannya dengan strategi bisnis.</li>
          <li>Menghitung ROI inisiatif data (manfaat = jam + risiko + revenue).</li>
          <li>Menyusun roadmap berprioritas dengan kuadran dampak vs usaha.</li>
          <li>Merancang program literasi data dan komunikasi stakeholder yang efektif — plus peta karir data engineer.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Proyek Rp5 Miliar yang Tidak Dipakai</h2>
      <div className="story">
        <p>Perusahaan menghabiskan <strong>Rp5 miliar</strong> membangun data warehouse "tercanggih" — 18 bulan. Go-live: tidak ada yang pakai. Analis tetap pakai Excel ("lebih cepat"), direksi tetap minta laporan manual ("lebih dipercaya"), tim bisnis tidak pernah dilibatkan dalam desain. Warehouse menjadi monumen Rp5 miliar yang diakses 3 orang.</p>
        <p>Twist-nya: teknologinya <em>sempurna</em> — yang gagal adalah <strong>strateginya</strong>: tidak ada kaitan dengan tujuan bisnis ("untuk keputusan apa?"), tidak ada sponsor eksekutif, tidak ada literasi pengguna, ROI tidak pernah dihitung. Lesson penutup track ini: <strong>DM1–DM16 adalah <em>kemampuan</em>; DM17 adalah <em>cara kemampuan itu memenangkan perang</em>.</strong> Teknologi tanpa strategi = monumen.</p>
      </div>

      <h2 id="strategi">Strategi Data — Kompas, Bukan Peta Buta</h2>
      <p><strong>Definisi.</strong> Strategi data = rencana <strong>bagaimana data menciptakan nilai bisnis</strong>: visi (mau ke mana), use case prioritas (untuk keputusan apa), kapabilitas (orang + proses + teknologi DM1–16), governance (aturan main), dan ukuran keberhasilan.</p>
      <p><strong>Prinsip #1:</strong> strategi data <strong>menurun dari strategi bisnis</strong> — bukan dari tren teknologi. Bisnis mau "turunkan NPL 2%" → strategi data: "data risiko real-time + scoring + monitoring". "Mau AI" bukan strategi — "mau putuskan X lebih baik dengan data" baru strategi.</p>
      <p><strong>Komponen:</strong></p>
      <ul>
        <li><strong>Visi & prinsip:</strong> "setiap keputusan penting didukung data terpercaya" + prinsip (misal "satu definisi", "privasi by design").</li>
        <li><strong>Use case prioritas:</strong> 3–5 saja, terukur ("turunkan fraud 30%"). Bukan 50.</li>
        <li><strong>Kapabilitas:</strong> maturity saat ini → target (DM9!), gap orang/proses/teknologi.</li>
        <li><strong>Operating model:</strong> tersentral / mesh / hybrid (DM14) — siapa membangun apa.</li>
        <li><strong>Ukuran:</strong> metrik strategi itu sendiri (adopsi, ROI, maturity naik).</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> uji satu kalimat untuk tiap inisiatif: <strong>"ini membantu keputusan bisnis apa?"</strong> Jika jawabannya "teknologinya bagus" — itu proyek TI, bukan strategi data. Strategi selalu berakhir di <em>keputusan</em>.</p>
      </div>

      <h2 id="roi">ROI — Bahasa yang Dimengerti Direksi</h2>
      <p><strong>Rumus:</strong></p>
      <Tex math={String.raw`\text{ROI} = \frac{\text{Manfaat} - \text{Biaya}}{\text{Biaya}} \times 100\%`} block />
      <p><strong>Tiga sumber manfaat data</strong> (yang bisa dihitung!):</p>
      <ul>
        <li><strong>Jam hemat:</strong> 50 analis × 5 jam/minggu × tarif = Rp2,6 M/tahun (katalog!).</li>
        <li><strong>Risiko hindari:</strong> cegah 1 insiden dashboard/bln × Rp150 jt = Rp1,8 M/tahun (test!).</li>
        <li><strong>Revenue / efisiensi:</strong> kampanye tepat sasaran (MDM!), fraud turun (streaming!).</li>
      </ul>
      <p><strong>Yang sulit dihitung</strong> (jangan dipaksa): "budaya data", "keputusan lebih baik" — ukur via <em>proxy</em> (adopsi dashboard, waktu-ke-insight) bukan rupiah khayalan.</p>

      <PlotlyChart
        data={roiData}
        title="Contoh ROI Inisiatif Data (ilustratif, per tahun)"
        layout={{ xaxis: { title: "Inisiatif" }, yaxis: { title: "ROI (x)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = kelipatan pengembalian per rupiah biaya.</p>
        <p><strong>Interpretasi:</strong> "membosankan" (katalog, MDM, metrics layer) ROI-nya <strong>mengalahkan</strong> yang "keren". <strong>Pelajaran:</strong> fondasi data = investasi terbaik — tapi paling sulit dijual karena tidak glamor. Tugasmu: menjualnya dengan angka (Lab 1).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "'Data adalah aset' cukup sebagai justifikasi investasi."</strong></p>
        <p><strong>Yang benar:</strong> slogan bukan strategi. Direksi mendanai <strong>angka</strong>: RpX biaya → RpY manfaat dalam Z bulan. "Aset" yang tidak bisa diukur nilainya = tidak bisa dipertahankan anggarannya. Hitung — atau kehilangan dana ke proyek yang bisa menghitung.</p>
      </div>

      <h2 id="roadmap">Roadmap — Urutan yang Menang</h2>
      <p><strong>Prinsip urutan:</strong> (1) <strong>quick wins dulu</strong> — dampak tinggi, usaha rendah (katalog 50 tabel, training direksi!) untuk bangun kepercayaan & momentum; (2) <strong>fondasi sebelum menara</strong> — kualitas + governance sebelum AI/mesh; (3) <strong>satu domain vertikal</strong> — buktikan end-to-end di 1 domain sebelum melebar.</p>
      <p><strong>Alat:</strong> kuadran dampak vs usaha (Lab 2). Aturan: 70% kapasitas untuk quick wins + fondasi; 30% untuk strategis jangka panjang. Roadmap tanpa quick win = kehilangan sponsor di kuartal 2.</p>
      <p><strong>Anti-pattern:</strong> "big bang 18 bulan" (cerita pembuka!) — tanpa nilai antara = tanpa ampun saat prioritas berubah.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> roadmap yang baik <strong>menolak</strong> lebih banyak daripada menerima. Setiap "ya" untuk inisiatif glamor = "tidak" untuk fondasi. Tugas ahli strategi = menjaga 70% kapasitas untuk yang membosankan tapi menghasilkan.</p>
      </div>

      <h2 id="literasi">Literasi Data — Vaksin Buta Angka</h2>
      <p><strong>Definisi.</strong> Literasi data = kemampuan <strong>membaca, memahami, dan memakai data</strong> untuk keputusan — untuk <em>semua</em> karyawan, bukan hanya tim data.</p>
      <p><strong>Level:</strong> buta → baca dashboard → tanya-jawab data → ambil keputusan → advokat (lihat chart: 60% organisasi masih di 2 level bawah!).</p>
      <p><strong>Program yang berhasil:</strong> (1) <strong>mulai dari pimpinan</strong> — direksi yang buta data = program mati; (2) <strong>kontekstual</strong> — latih dengan <em>data mereka sendiri</em> ("baca dashboard penjualanmu"), bukan teori; (3) <strong>berkelanjutan</strong> — komunitas, klinik data mingguan, bukan sekali seminar; (4) <strong>ukur</strong> — % keputusan didukung data, bukan % hadir training.</p>

      <PlotlyChart
        data={literasiData}
        title="Distribusi Literasi Data Karyawan (estimasi)"
        layout={{ xaxis: { title: "Level" }, yaxis: { title: "% karyawan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi karyawan di tiap level literasi.</p>
        <p><strong>Interpretasi:</strong> 60% masih di level 1–2 — artinya dashboard canggihmu <strong>dibaca salah</strong> oleh mayoritas. <strong>Pelajaran:</strong> investasi literasi = pengganda semua investasi data lainnya. Dashboard tanpa literasi = mobil tanpa SIM massal.</p>
      </div>

      <h2 id="komunikasi">Komunikasi Stakeholder — Seni Menerjemahkan</h2>
      <p><strong>Aturan emas:</strong> bicara <strong>bahasa mereka</strong>, bukan bahasamu:</p>
      <ul>
        <li>Ke <strong>direksi</strong>: "ROI 3,2×, risiko turun, keputusan 2× lebih cepat" — <em>jangan</em> "kami migrasi ke Iceberg".</li>
        <li>Ke <strong>bisnis</strong>: "dashboard ini menjawab pertanyaanmu dalam 8 menit, bukan 3 hari" — demo dengan <em>data mereka</em>.</li>
        <li>Ke <strong>engineer</strong>: kontrak teknis presisi (skema, SLO, Runbook).</li>
      </ul>
      <p><strong>Tiga ritual:</strong> (1) <strong>showcase rutin</strong> — demo nilai tiap sprint (bukan laporan status); (2) <strong>bahasa bersama</strong> — glossary (DM10!) agar tidak debat istilah; (3) <strong>cerita + angka</strong> — "analis Rina hemat 5 jam/minggu" (cerita) + "Rp2,6 M/tahun" (angka).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Pekerjaan data = 100% teknis."</strong></p>
        <p><strong>Yang benar:</strong> survei praktisi: <strong>50–70% waktu</strong> data leader = komunikasi, advokasi, dan politik organisasi. Proyek terbaik yang tidak bisa "dijual" = monumen Rp5 miliar (cerita pembuka). Skill komunikasi = skill teknis yang dikali.</p>
      </div>

      <h2 id="karir">Karir — Peta Jalan Data Engineer 2026</h2>
      <p><strong>Hasil riset lowongan 2026</strong> (Indonesia & global) — pola yang konsisten:</p>
      <ul>
        <li><strong>Fondasi wajib (60% interview):</strong> SQL + Python. Tanpa ini, sisanya tidak relevan.</li>
        <li><strong>Inti modern:</strong> orkestrator (<strong>Airflow</strong> paling sering), <strong>dbt</strong> (tumbuh pesat, muncul di lowongan Indonesia), warehouse/lakehouse (<strong>Snowflake, BigQuery, Databricks</strong>).</li>
        <li><strong>Pembeda:</strong> <strong>Kafka + Spark/Flink</strong> (streaming), <strong>Iceberg/Delta</strong>, data quality/observability, NoSQL (<strong>MongoDB, Redis</strong> di lowongan ID).</li>
        <li><strong>Senior:</strong> Terraform/Kubernetes, FinOps (cost), governance & keamanan, desain arsitektur.</li>
      </ul>
      <p><strong>Gaji Indonesia 2026</strong> (kisaran lowongan): junior Rp5–8 jt, mid Rp8–15 jt, senior Rp15 jt+. Global mid: $130–155 rb/tahun.</p>
      <p><strong>Sertifikasi yang diakui:</strong> Google Professional Data Engineer, AWS Data Engineer Associate, Databricks Data Engineer — <em>pelengkap</em> portofolio, bukan pengganti (bukti produksi &gt; sertifikat).</p>
      <p><strong>Jalur dari track ini:</strong> DM1–DM17 = fondasi konseptual lengkap. Berikutnya: <strong>portofolio</strong> (capstone DM18!) + perdalam 1 cloud + 1 orkestrator + dbt. SQL + Python diasumsikan dari prasyarat (C1–C18, D1–D6).</p>

      <div className="tip">
        <p><strong>💡 Intuisi karir:</strong> pasar tidak membayar "tahu banyak tool" — ia membayar <strong>"pernah membangun sistem yang jalan di produksi"</strong>. Satu pipeline end-to-end yang terdokumentasi (capstone!) mengalahkan 10 sertifikat teori. Bangun, ukur, ceritakan.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: ROI — Hitung Sendiri Kelayakannya</h2>
      <p>Hitung ROI 3 inisiatif dengan angka — rasakan bahasa direksi.</p>
      <PyodideLab
        title="Lab 1 — Dari Teknologi ke Rupiah"
        hint="Coba: ubah jam hemat 5 → 2 jam/minggu. Pada titik berapa katalog tidak lagi layak? Itulah sensitivitas."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Roadmap — Kuadran Dampak vs Usaha</h2>
      <p>Urutkan 8 inisiatif ke kuadran — buktikan kenapa yang glamor sering ditunda.</p>
      <PyodideLab
        title="Lab 2 — Seni Menolak"
        hint="Coba: tambah inisiatifmu dengan skor jujur. Berapa yang masuk 'hindari'?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Strategi & Karir</h2>

      <div className="decision-card">
        <h3>1. Mulai strategi data → <strong>turun dari strategi bisnis; 3–5 use case; quick wins dulu</strong></h3>
        <p><strong>Kondisi:</strong> belum ada arah.</p>
        <p><strong>Kenapa:</strong> "mau AI" bukan strategi. Menang kecil → kepercayaan → dana fondasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Minta anggaran → <strong>ROI berhitung (jam + risiko + revenue)</strong></h3>
        <p><strong>Kondisi:</strong> butuh dana.</p>
        <p><strong>Kenapa:</strong> direksi mendanai angka, bukan slogan. Fondasi membosankan = ROI tertinggi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Dashboard tak dipakai / salah baca → <strong>literasi: latih pimpinan dulu, kontekstual, ukur adopsi</strong></h3>
        <p><strong>Kondisi:</strong> 60% buta data.</p>
        <p><strong>Kenapa:</strong> pengganda semua investasi. Tanpa ini = monumen.</p>
      </div>

      <div className="decision-card">
        <h3>4. Proyek ditolak direksi → <strong>cek bahasa: ROI & cerita, bukan teknologi</strong></h3>
        <p><strong>Kondisi:</strong> "teknologinya bagus" tidak mempan.</p>
        <p><strong>Kenapa:</strong> 50–70% pekerjaan = komunikasi. Terjemahkan: jam, rupiah, risiko.</p>
      </div>

      <div className="decision-card">
        <h3>5. Karir data engineer → <strong>SQL+Python → 1 cloud + Airflow + dbt → portofolio produksi → streaming</strong></h3>
        <p><strong>Kondisi:</strong> mau masuk pasar 2026.</p>
        <p><strong>Kenapa:</strong> urutan riset lowongan. Bukti produksi &gt; sertifikat. Capstone DM18 = langkah pertama portofolio.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Strategi = keputusan bisnis</strong>, bukan daftar teknologi.</li>
          <li><strong>Hitung ROI</strong> atau kehilangan anggaran.</li>
          <li><strong>Quick wins dulu</strong>; tolak yang glamor tapi mahal.</li>
          <li><strong>Karir = bukti produksi.</strong> Bangun, ukur, ceritakan.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Proyek Rp5 Miliar — Bedah Mayatnya</h2>
      <p>PT Maju Jaya membangun "AI demand forecasting" Rp5 miliar (18 bulan). Hasil: <strong>tidak dipakai</strong> tim supply chain. Forensik angkanya — agar kamu tidak mengulanginya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Di mana Rp5 miliar itu pergi? (klik untuk buka)</summary>
        <ul>
          <li>Konsultan &amp; lisensi platform: <strong>Rp2,1 M</strong> (42%)</li>
          <li>6 engineer × 18 bulan: <strong>Rp1,9 M</strong> (38%)</li>
          <li>Infrastruktur cloud: <strong>Rp600 jt</strong> (12%)</li>
          <li>"Change management": <strong>Rp400 jt</strong> (8%) — 2 workshop, 0 adopsi</li>
        </ul>
        <p>Nilai yang dihasilkan: <strong>Rp0</strong> (model akurat 89% tapi tidak dipercaya planner — "angka ini dari mana?"). <Tex math={String.raw`\text{ROI} = \frac{0 - 5\text{M}}{5\text{M}} = -100\%`} block /></p>
        <p>Bukan modelnya yang gagal — <strong>adopsinya</strong>. Pelajaran termahal track ini: <em>akurasi tanpa kepercayaan = Rp0</em>.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — ROI yang seharusnya dihitung SEBELUM mulai</summary>
        <p>Jika tim bertanya dulu ke planner: "keputusan apa yang berubah?" — jawaban: "order quantity mingguan untuk 200 SKU". Nilai: kurangi stockout 3% → 1,5% (margin Rp2 M/bulan × 1,5% = <strong>Rp30 juta/bulan</strong>) + kurangi overstock (hemat modal Rp200 juta).</p>
        <p><Tex math={String.raw`\text{nilai/tahun} = 30 \text{ jt} \times 12 + 200 \text{ jt} = \text{Rp}560 \text{ jt}`} /></p>
        <p>Break-even: <Tex math={String.raw`5\text{M} / 560\text{jt} \approx 9 \text{ tahun}`} /> — <strong>proyek tidak layak sejak di kertas!</strong> Seharusnya: mulai dari <em>heuristik sederhana</em> (moving average, Rp50 juta) → buktikan Rp200 juta nilai → baru investasi model. <strong>Strategi = urutan taruhan kecil yang menang, bukan 1 taruhan besar yang "pasti".</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Roadmap: kuadran dampak vs usaha</summary>
        <p>12 inisiatif dinilai (dampak Rp/tahun, usaha orang-bulan). Contoh 4:</p>
        <ul>
          <li>A: Katalog + pemilik 50 tabel (DM10): dampak Rp851 jt, usaha 3 OB → <strong>rasio 284 jt/OB</strong> ⭐</li>
          <li>B: Test 10 pipeline kritis (DM7): dampak Rp400 jt, usaha 4 OB → 100 jt/OB</li>
          <li>C: AI forecasting: dampak Rp560 jt, usaha 108 OB → <strong>5,2 jt/OB</strong> ☠️</li>
          <li>D: Semantic layer pendapatan (DM14): dampak Rp460 jt, usaha 3 OB → 153 jt/OB</li>
        </ul>
        <p>Urutan rasional: <strong>A → D → B → ... → C terakhir</strong> (atau tidak sama sekali). Perusahaan mengeksekusi C pertama = <strong>memilih rasio terburuk</strong>. Roadmap = <em>urutan</em>, bukan daftar keinginan. Aturan: kerjakan kuadran <strong>dampak tinggi–usaha rendah</strong> dulu sampai habis — kredibilitas tim dibangun dari kemenangan cepat, bukan dari proyek prestisius.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Literasi: vaksin buta angka</summary>
        <p>Survei 200 manajer: 61% tidak bisa bedakan <strong>korelasi vs kausalitas</strong>; 44% membaca <strong>rata-rata tanpa nanya sebaran</strong>. Biaya: 1 keputusan salah per manajer per 2 tahun × Rp50 juta = <Tex math={String.raw`200 \times 0{,}5 \times 50\text{jt} = \text{Rp}5 \text{ M/tahun}`} />.</p>
        <p>Program literasi (4 workshop × Rp25 juta + materi): <strong>Rp100 juta</strong>. Jika mengurangi kesalahan 20%: hemat <strong>Rp1 M/tahun</strong> → ROI 10×. <strong>Literasi = investasi dengan leverage tertinggi</strong> karena 1 orang yang melek angka memperbaiki <em>semua</em> keputusannya, selamanya. Tapi ia tidak "seksi" — makanya selalu kalah anggaran dari proyek AI.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> strategi data yang bagus muat di <strong>1 halaman</strong>: (1) 3 keputusan bisnis yang harus membaik tahun ini, (2) 5 inisiatif berurutan (kuadran!), (3) 3 metrik keberhasilan, (4) 1 hal yang <em>tidak</em> dikerjakan. Strategi 40 halaman = tidak ada strategi. Dan uji jujur: <strong>"apakah strategi ini mengubah alokasi anggaran?"</strong> Tidak = dekorasi.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Uji 1 halaman: apakah strategimu mengubah anggaran?</summary>
        <p>Strategi 40 halaman PT Maju Jaya: alokasi anggaran <strong>tetap sama</strong> seperti tahun lalu (AI 60%, sisanya "rutin").</p>
        <p><Tex math={String.raw`\text{uji jujur} = \text{"pos anggaran apa yang BERUBAH karena strategi ini?"}`} block /></p>
        <p>Jawaban: tidak ada → <strong>itu bukan strategi, itu dekorasi</strong>. Strategi 1 halaman yang memindahkan Rp500 juta dari "AI prestisius" ke "katalog + test" = strategi betulan. <strong>Strategi = keputusan alokasi yang tertulis.</strong> Sisanya = lampiran.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Komunikasi = Menerjemahkan, Bukan Menyederhanakan</h2>
      <p>Kegagalan komunikasi data terbesar = <strong>berbicara dalam bahasa produsen ke konsumen</strong>. Tiga teknik:</p>
      <ul>
        <li><strong>Pyramid principle (Minto):</strong> mulai dari <strong>kesimpulan → alasan → detail</strong>. Salah: "kami membersihkan 1 juta baris, menemukan 3% duplikat, lalu..." (20 slide kemudian: "jadi stok menipis"). Benar: "Stok SKU X habis 2 minggu lagi — karena... — detail di lampiran." <strong>Eksekutif membayar untuk kesimpulan, bukan perjalananmu.</strong></li>
        <li><strong>Angka butuh jangkar.</strong> "Akurasi 89%" = tidak berarti apa-apa. "89% — 4 poin di atas target 85%, tapi 6 poin di bawah kompetitor" = berarti. Selalu sertakan <strong>3 jangkar: target, historis, pembanding</strong>. Angka tanpa jangkar = opini berbaju angka.</li>
        <li><strong>Bahasa risiko untuk direksi.</strong> Direksi tidak memutuskan "pipeline"; mereka memutuskan <strong>risiko vs return</strong>. Terjemahkan: "test coverage 40%" → "peluang 1 dashboard salah per kuartal = 60%, eksposur Rp120 juta". <strong>Orang yang menguasai terjemahan ini = orang yang dapat anggaran.</strong></li>
      </ul>
      <p><strong>Konteks dunia nyata — peta karir data 2026:</strong> tiga jalur (bukan satu tangga!): <strong>teknis dalam</strong> (DE → staff/principal: kedalaman sistem), <strong>analitik</strong> (analis → AE → analytics lead: kedalaman bisnis), <strong>kepemimpinan</strong> (manager → head → CDO: kedalaman organisasi). Kesalahan klasik: engineer hebat dipromosi jadi manajer (jalur berbeda, skill berbeda!) lalu gagal dua-duanya. Pilih jalur dengan jujur: <strong>nikmati sistem → teknis; nikmati keputusan → analitik; nikmati orang → leadership.</strong> Dan semua jalur butuh <strong>portofolio bukti</strong> (capstone DM19!) — bukan sertifikat.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: ""AI dulu, data nanti" — fondasi bisa menyusul."</strong></p>
        <p><strong>Yang benar:</strong> AI di atas data kacau = <strong>kesalahan yang otomatis dan berskala</strong> (mini-case!). Model memakan duplikat, bias, dan definisi ganda — lalu memproduksinya 1 juta kali sehari. Urutan yang benar: <strong>data terpercaya → keputusan lebih baik → otomatisasi → AI</strong>. Perusahaan yang melompati 3 tahap pertama tidak "mempercepat AI" — ia mempercepat <em>kebangkrutan kepercayaan</em>. Fondasi bukan penghambat AI; fondasi = <em>syarat</em> AI.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Prioritaskan Roadmap-mu — Kuadran Otomatis</h2>
      <p>Masukkan inisiatifmu, lihat urutan rasionalnya dari rasio dampak/usaha.</p>
      <PyodideLab
        title="Lab 3 — Mesin Prioritas"
        hint="Coba: tambah inisiatif 'AI chatbot' (dampak 300 jt, usaha 60 OB). Di urutan berapa ia jatuh? Itulah kenapa proyek prestisius harus antre."
        defaultCode={`# Lab 3: prioritaskan inisiatif via rasio dampak/usaha
inisiatif = [
    ("Katalog + pemilik 50 tabel", 851, 3),
    ("Test 10 pipeline kritis",    400, 4),
    ("Semantic layer pendapatan",  460, 3),
    ("AI demand forecasting",      560, 108),
    ("Program literasi manajer",  1000, 2),
    ("Data mesh big-bang",         700, 120),
]
# (nama, dampak Rp jt/tahun, usaha orang-bulan)

diurut = sorted(inisiatif, key=lambda x: x[1]/x[2], reverse=True)
print(f"{'Urutan rasional (rasio dampak/usaha):':50s}")
for i, (nama, dampak, usaha) in enumerate(diurut, 1):
    rasio = dampak / usaha
    kuadran = "QUICK WIN" if dampak >= 400 and usaha <= 4 else (
              "STRATEGIS" if dampak >= 400 else "TANYA ULANG")
    print(f"{i}. {nama:32s} Rp{dampak:>5d} jt / {usaha:>3d} OB = {rasio:6.1f} jt/OB  [{kuadran}]")
print()
print("Aturan: kerjakan dari atas. 'AI forecasting' & 'mesh big-bang'")
print("jatuh ke bawah BUKAN karena tidak penting, tapi karena")
print("modalnya bisa membiayai 10 quick win yang menang duluan.")`}
      />

      <h2 id="case">📋 Mini-Case: "AI Dulu, Data Nanti"</h2>
      <div className="callout">
        <p>Direksi: "Kita mau AI seperti kompetitor! Anggaran Rp3 M untuk tim AI." Kondisi data: tanpa katalog, definisi beda-beda, kualitas tak terukur, akses semrawut. Tim AI 6 bulan: model bagus di laptop, gagal total di produksi ("datanya tidak ada / kotor / tidak boleh diakses"). Rp3 M → demo yang tidak pernah live.</p>
        <p><strong>Pertanyaan:</strong> (a) Kesalahan strateginya? (b) Usulan tandingan yang benar (dengan angka)? (c) Kapan "AI dulu" bisa dibenarkan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Menara tanpa fondasi</strong>: AI = konsumen paling rakus akan data berkualitas & tergovernance. Urutan terbalik.</p>
          <p>(b) <strong>"Rp1 M fondasi dulu, AI menyusul":</strong> katalog + 5 pipeline dbt + test + 1 use case vertikal (fraud) — tunjukkan ROI (Lab 1: 2–4×), baru minta Rp3 M dengan fondasi siap. Bahasa: "AI di atas data kotor = Rp3 M jadi demo".</p>
          <p>(c) <strong>Hampir tidak pernah</strong> untuk AI produksi. Pengecualian: eksplorasi terisolasi (POC) <em>sambil</em> fondasi dibangun paralel — dengan ekspektasi jujur "ini belum produksi".</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: ROI proyek, prioritas kuadran, dan ROI literasi.</p>

      <details className="worked">
        <summary>Soal 1 — ROI: proyek data nilai Rp800 jt/tahun, biaya Rp2 miliar. Berapa ROI? Berapa break-even?</summary>
        <p><Tex math={String.raw`\text{ROI} = \frac{800 - 2000}{2000} = -60\%`} />; break-even = <Tex math={String.raw`2000/800 = 2{,}5 \text{ tahun}`} block /></p>
        <p>ROI negatif di tahun 1–2. Jika dihitung <em>sebelum</em> mulai (bukan sesudah gagal), proyek ini tidak akan didanai — <strong>atau didanai dengan ekspektasi jujur</strong>.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Kuadran: A (dampak 900 jt, usaha 2 OB), B (500 jt, 40 OB), C (300 jt, 3 OB). Urutkan dari rasio terbaik.</summary>
        <p>A: <Tex math={String.raw`900/2 = 450`} />; C: <Tex math={String.raw`300/3 = 100`} />; B: <Tex math={String.raw`500/40 = 12{,}5`} /> (jt/OB).</p>
        <p><strong>Urutan: A → C → B.</strong> B ("AI prestisius") jatuh terakhir — bukan karena tidak penting, tapi karena modalnya membiayai 36 quick win seperti A.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Literasi: 100 manajer, tiap orang rata-rata 1 keputusan salah per 3 tahun × Rp30 juta. Program literasi Rp80 juta mengurangi kesalahan 25%. Berapa ROI?</summary>
        <p>Rugi/tahun = <Tex math={String.raw`100 \times \frac{1}{3} \times 30 \text{ jt} = \text{Rp}1 \text{ M}`} />; hemat = <Tex math={String.raw`0{,}25 \times 1 \text{ M} = \text{Rp}250 \text{ jt}`} />.</p>
        <p><Tex math={String.raw`\text{ROI} = \frac{250-80}{80} = 212\%`} block /></p>
        <p><strong>Literasi = leverage tertinggi</strong>: 1 orang melek angka memperbaiki <em>semua</em> keputusannya, selamanya.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Prinsip #1 strategi data yang benar?"
        options={[
          "Ikuti tren teknologi terbaru",
          "'Mau AI' sebagai visi",
          "Menurun dari strategi bisnis — 'untuk keputusan apa?' Bukan dari teknologi",
          "Beli tool termahal dulu",
        ]}
        correct={2}
        explanation="Benar: strategi berakhir di keputusan bisnis. Teknologi = cara, bukan tujuan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Tiga sumber manfaat data yang bisa dihitung untuk ROI?"
        options={[
          "Jam hemat + risiko yang dihindari + revenue/efisiensi — dengan angka, bukan slogan",
          "Kebahagiaan + semangat + harapan",
          "Hanya revenue",
          "Tidak bisa dihitung",
        ]}
        correct={0}
        explanation="Benar: tiga tuas terukur. 'Data adalah aset' tanpa angka = kehilangan anggaran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Urutan roadmap yang menang?"
        options={[
          "Big bang 18 bulan langsung",
          "Quick wins (dampak tinggi, usaha rendah) → fondasi → satu domain vertikal → baru menara (AI/mesh)",
          "AI dulu, data nanti",
          "Acak saja",
        ]}
        correct={1}
        explanation="Benar: momentum + kepercayaan dulu. Tanpa nilai antara = mati di tengah jalan (cerita Rp5 M)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Program literasi data yang berhasil selalu…"
        options={[
          "Sekali seminar besar",
          "Mulai dari pimpinan + kontekstual (data mereka sendiri) + berkelanjutan + diukur adopsinya",
          "Hanya untuk tim IT",
          "Teori statistik berat",
        ]}
        correct={1}
        explanation="Benar: 4 syarat. Direksi buta data = program mati; teori tanpa konteks = lupa seminggu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Presentasi ke direksi tentang migrasi warehouse sebaiknya…"
        options={[
          "Jelaskan detail Iceberg vs Delta 30 menit",
          "Bahasa mereka: ROI 3,2×, risiko turun, keputusan 2× lebih cepat — teknologi = 1 slide",
          "Penuh jargon agar terlihat pintar",
          "Tanpa angka",
        ]}
        correct={1}
        explanation="Benar: terjemahkan ke jam, rupiah, risiko. 50–70% pekerjaan = komunikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Menurut riset lowongan 2026, fondasi yang ditanyakan ~60% interview data engineer?"
        options={[
          "Kubernetes",
          "SQL + Python — tanpa ini, sisanya tidak relevan. Lalu: Airflow, dbt, 1 cloud warehouse",
          "Hanya sertifikasi",
          "Filosofi data",
        ]}
        correct={1}
        explanation="Benar: urutan pasar — fondasi dulu, inti modern, baru pembeda (Kafka/Spark). Bukti produksi > sertifikat."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Strategi:</strong> turun dari bisnis; 3–5 use case; quick wins → fondasi → menara.</li>
          <li><strong>ROI:</strong> (manfaat−biaya)/biaya; manfaat = jam + risiko + revenue. Hitung atau kehilangan dana.</li>
          <li><strong>Literasi:</strong> pimpinan dulu, kontekstual, berkelanjutan, ukur adopsi.</li>
          <li><strong>Komunikasi:</strong> bahasa stakeholder (rupiah & cerita), bukan jargon.</li>
          <li><strong>Karir 2026:</strong> SQL+Python → Airflow+dbt+1 cloud → portofolio produksi → streaming. Bukti &gt; sertifikat.</li>
          <li><strong>Jangan:</strong> big bang tanpa nilai antara; "AI dulu, data nanti"; slogan tanpa angka.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm16-bi-analytics-engineering" className="btn btn-secondary btn-sm">← DM16</Link>
        <Link href="/learn/dm18-spark-pyspark" className="btn btn-primary btn-sm">Next: DM18 →</Link>
      </div>
    </div>
  );
}
