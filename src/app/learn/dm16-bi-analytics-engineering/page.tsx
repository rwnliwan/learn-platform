"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM16Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const kpiData = [
    {
      x: ["Akurat", "Relevan", "Tepat waktu", "Dapat ditindak-<br>lanjuti", "Jelas<br>pemiliknya"],
      y: [9.0, 8.5, 7.0, 6.0, 5.5],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["definisi tunggal", "dorong keputusan", "segar", "ada aksi", "ada owner"],
      textposition: "outside",
    },
  ];

  const dashData = [
    {
      x: ["Tanpa governance<br>(47 dashboard)", "Dengan governance<br>(12 tersertifikasi)"],
      y: [47, 12],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["47, tak terurus", "12, tersertifikasi"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: KPI yang baik vs vanity metric — uji dengan 5 syarat
# Syarat KPI: akurat, relevan, tepat waktu, actionable, ber-owner.

def nilai_kpi(nama, definisi, syarat):
    print(f"KPI: {nama}")
    print(f"  Definisi: {definisi}")
    lolos = sum(syarat.values())
    for s, v in syarat.items():
        print(f"  [{'OK' if v else 'XX'}] {s}")
    print(f"  Skor: {lolos}/5 ->", "KPI SEHAT ✅" if lolos >= 4 else "VANITY / RUSAK ❌")
    print()
    return lolos

nilai_kpi(
    "NPL Ratio",
    "kredit bermasalah (kolektibilitas 3-5) / total kredit, per bulan",
    {"akurat (definisi tunggal)": True,
     "relevan (pengaruhi keputusan)": True,
     "tepat waktu (bulanan)": True,
     "actionable (ada aksi jika naik)": True,
     "ber-owner (Tim Risiko)": True},
)

nilai_kpi(
    "'Total download aplikasi'",
    "jumlah download kumulatif sejak 2019",
    {"akurat (definisi tunggal)": True,
     "relevan (pengaruhi keputusan)": False,   # naik terus, tidak informatif
     "tepat waktu": True,
     "actionable (ada aksi?)": False,            # mau diapakan?
     "ber-owner": False},                        # tidak ada yang merasa memiliki
)

print("Pelajaran: vanity metric TERLIHAT bagus tapi tidak mengubah keputusan.")
print("'Total download' selalu naik — ia tidak pernah memberi sinyal.")
print("Coba: rancang KPI 'tingkat aktivasi' (download -> transaksi pertama).")
print("Skor berapa?")`;

  const lab2Code = `# Lab 2: Sertifikasi dashboard — checklist governance sebelum "resmi"
# Dashboard boleh menyandang "TERCERTIFIKASI ✅" hanya jika semua lolos.

def sertifikasi(nama, checklist):
    print(f"Dashboard: {nama}")
    gagal = [k for k, v in checklist.items() if not v]
    for k, v in checklist.items():
        print(f"  [{'OK' if v else 'XX'}] {k}")
    if not gagal:
        print("  => TERSERTIFIKASI ✅ — boleh dipakai direksi.")
    else:
        print(f"  => BELUM SERTIFIKASI ❌ — {len(gagal)} syarat gagal:")
        for g in gagal: print(f"     - {g}")
    print()
    return not gagal

sertifikasi("Penjualan Nasional", {
    "sumber = Gold (bukan Bronze/Excel)": True,
    "definisi metrik ikut metrics layer": True,
    "owner tertulis": True,
    "refresh terjadwal & termonitor": True,
    "akses sesuai klasifikasi data": True,
})

sertifikasi("Analisis Cepat Q3 (dibuat intern)", {
    "sumber = Gold (bukan Bronze/Excel)": False,   # dari CSV email!
    "definisi metrik ikut metrics layer": False,
    "owner tertulis": False,                        # intern sudah lulus
    "refresh terjadwal & termonitor": False,
    "akses sesuai klasifikasi data": True,
})

print("Pelajaran: sertifikasi = 'SIM' untuk dashboard.")
print("Tanpa SIM boleh jalan-jalan (eksplorasi), tapi tidak boleh bawa")
print("penumpang (keputusan direksi).")
print("Coba: dashboard apa di kantormu yang lolos semua? Yang tidak?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM16 — Data Management</span>
        <h1 className="display-title">BI & Analytics Engineering:<br />Dari Dashboard Liar ke Angka Resmi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 47 Dashboard, 0 Kebenaran</a></li>
          <li><a href="#kpi">KPI — Metrik yang Menggerakkan Keputusan</a></li>
          <li><a href="#ae">Analytics Engineering — Profesi di Tengah</a></li>
          <li><a href="#gov">Governance Dashboard — SIM untuk Dashboard</a></li>
          <li><a href="#desain">Desain Dashboard yang Jujur</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji KPI — Sehat atau Vanity?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Sertifikasi Dashboard</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: BI yang Sehat</a></li>
          <li><a href="#worked">🔢 Worked Example: KPI Hijau, Kapal Tenggelam</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Dashboard = Produk</a></li>
          <li><a href="#lab3">🔬 Lab 3: Detektor Vanity Metric</a></li>
          <li><a href="#case">📋 Mini-Case: KPI yang "Hijau" Saat Kapal Tenggelam</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Merancang KPI yang memenuhi 5 syarat (akurat, relevan, tepat waktu, actionable, ber-owner) dan mengenali vanity metric.</li>
          <li>Menjelaskan peran analytics engineer di antara data engineer dan analis.</li>
          <li>Menerapkan checklist sertifikasi dashboard (governance) sebelum dashboard dipakai untuk keputusan resmi.</li>
          <li>Menghindari jebakan desain dashboard yang menyesatkan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 47 Dashboard, 0 Kebenaran</h2>
      <div className="story">
        <p>Perusahaan punya <strong>47 dashboard</strong> penjualan. Rapat direksi: "penjualan bulan lalu berapa?" — tiga direktur menunjukkan tiga angka dari tiga dashboard berbeda. Investigasi: dashboard dibuat 6 orang dalam 3 tahun, dari sumber beda (satu dari CSV email!), definisi "penjualan" beda-beda, 30 di antaranya tidak pernah dibuka lagi sejak dibuat.</p>
        <p>Twist-nya: masalahnya bukan kurang dashboard — melainkan <strong>tidak ada yang bertanggung jawab atas kebenarannya</strong>. Setiap dashboard lahir dari "tolong bikinin cepat", tidak ada yang pensiun, tidak ada yang disertifikasi. Lesson ini tentang ujung tombak data management yang paling terlihat: <strong>lapisan BI</strong> — tempat semua kerja keras DM1–DM15 <em>dinilai</em> oleh pengguna. Di sinilah kepercayaan dibangun atau dihancurkan.</p>
      </div>

      <h2 id="kpi">KPI — Metrik yang Menggerakkan Keputusan</h2>
      <p><strong>Definisi.</strong> KPI (Key Performance Indicator) = metrik yang <strong>menggerakkan keputusan</strong> — bukan sekadar angka menarik. Lima syarat (uji di Lab 1):</p>
      <ol>
        <li><strong>Akurat:</strong> definisi tunggal & tereksekusi (metrics layer, DM14).</li>
        <li><strong>Relevan:</strong> berubahnya angka <em>mengubah keputusan</em> — jika tidak, itu vanity metric.</li>
        <li><strong>Tepat waktu:</strong> segar sesuai ritme keputusan (harian untuk operasional, bulanan untuk strategi).</li>
        <li><strong>Actionable:</strong> jelas <em>aksi</em> apa jika angka bergerak ("NPL naik → perketat approval").</li>
        <li><strong>Ber-owner:</strong> ada nama yang bertanggung jawab atas angkanya.</li>
      </ol>
      <p><strong>Vanity metric:</strong> terlihat bagus, tidak mengubah keputusan — "total download kumulatif" (selalu naik!), "total user terdaftar" (termasuk yang mati). Lawannya: <strong>actionable metric</strong> — "tingkat aktivasi minggu ini" (bisa turun → ada aksi).</p>

      <PlotlyChart
        data={kpiData}
        title="Skor 5 Syarat KPI — Contoh 'NPL Ratio' (sehat)"
        layout={{ xaxis: { title: "Syarat" }, yaxis: { title: "Skor /10" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = skor tiap syarat KPI (0–10).</p>
        <p><strong>Interpretasi:</strong> NPL Ratio sehat: akurat & relevan tinggi. Perhatikan "ber-owner" 5,5 — titik lemah umum! <strong>Pelajaran:</strong> KPI tanpa owner = angka yatim — saat bergerak aneh, tidak ada yang bertindak. Syarat #5 sering dilupakan, padahal penentu aksi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Semakin banyak KPI semakin baik kontrolnya."</strong></p>
        <p><strong>Yang benar:</strong> <strong>dashboard dengan 40 KPI = tidak ada KPI.</strong> Perhatian manusia terbatas — 5–7 KPI per dashboard, tiap KPI punya aksi. Lebih dari itu = kebisingan. "Key" di KPI berarti <em>sedikit dan penting</em>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> uji satu kalimat untuk tiap KPI: <strong>"jika angka ini turun 20% besok, apa yang kita lakukan?"</strong> Jika jawabannya "tidak tahu" — itu bukan KPI, itu hiasan. Buang atau turunkan jadi metrik pendukung.</p>
      </div>

      <h2 id="ae">Analytics Engineering — Profesi di Tengah</h2>
      <p><strong>Definisi.</strong> Analytics engineer = peran <strong>di antara</strong> data engineer dan analis: ia membangun <strong>dataset siap-analisis</strong> (dbt models, marts, dokumentasi, test) agar analis <em>percaya diri</em> memakai data tanpa jadi engineer.</p>
      <ul>
        <li><strong>Data engineer:</strong> platform & pipeline mentah → bersih (Bronze → Silver).</li>
        <li><strong>Analytics engineer:</strong> Silver → <strong>Gold yang bermakna bisnis</strong> (marts, definisi metrik, dokumentasi).</li>
        <li><strong>Analis:</strong> Gold → insight & dashboard.</li>
      </ul>
      <p><strong>Kenapa peran ini lahir:</strong> analis menulis SQL berantakan tanpa test; engineer tidak paham bisnis. Analytics engineer = <strong>software engineering untuk SQL</strong> (git, test, review, dokumentasi — DM5) + <strong>pemahaman bisnis</strong>. Lowongan 2026: "Analytics Engineer (dbt)" tumbuh pesat — jembatan karir ideal dari analis menuju engineer.</p>

      <h2 id="gov">Governance Dashboard — SIM untuk Dashboard</h2>
      <p><strong>Masalah:</strong> 47 dashboard liar (cerita pembuka). <strong>Solusi: sertifikasi</strong> — dashboard boleh menyandang "resmi/terpercaya" hanya jika lolos checklist (Lab 2):</p>
      <ul>
        <li>Sumber = <strong>Gold tersertifikasi</strong> (bukan CSV email / Bronze).</li>
        <li>Metrik mengikuti <strong>metrics layer</strong> (DM14).</li>
        <li><strong>Owner tertulis</strong> + kontak.</li>
        <li><strong>Refresh terjadwal & termonitor</strong> (bukan manual).</li>
        <li>Akses sesuai <strong>klasifikasi data</strong> (DM12).</li>
        <li><strong>Tanggal kedaluwarsa review</strong> (misal 6 bulan — dashboard basi = dicabut sertifikasinya!).</li>
      </ul>
      <p><strong>Dua kelas dashboard:</strong> <strong>tersertifikasi</strong> (boleh untuk keputusan resmi) vs <strong>eksplorasi</strong> (bebas, tapi berlabel jelas "belum terverifikasi"). Keduanya boleh ada — yang tidak boleh = eksplorasi <em>menyamar</em> resmi.</p>

      <PlotlyChart
        data={dashData}
        title="Rasionalisasi Dashboard: 47 → 12"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Jumlah dashboard" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = jumlah dashboard sebelum vs sesudah program sertifikasi.</p>
        <p><strong>Interpretasi:</strong> 47 → 12 bukan "penghapusan brutal" — 30 tidak pernah dibuka (pensiunkan!), sisanya digabung/diduplikasi. <strong>Pelajaran:</strong> governance dashboard = <em>kurasi</em>: lebih sedikit, lebih dipercaya. Kepercayaan naik saat pilihan turun.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Self-service BI = semua orang bikin dashboard sendiri tanpa aturan."</strong></p>
        <p><strong>Yang benar:</strong> self-service yang sehat = <strong>bebas eksplorasi di atas fondasi terkendali</strong> (Gold tersertifikasi + metrics layer). Kebebasan tanpa fondasi = 47 dashboard liar. Kebebasan di atas fondasi = analis produktif + angka konsisten. "Self-service" ≠ "tanpa governance".</p>
      </div>

      <h2 id="desain">Desain Dashboard yang Jujur</h2>
      <p>Empat jebakan visual (jembatan A1.8):</p>
      <ul>
        <li><strong>Sumbu terpotong:</strong> bar chart Y mulai dari 80 membuat naik 2% terlihat 2× lipat — manipulatif.</li>
        <li><strong>Tanpa konteks:</strong> angka "Rp50 M" tanpa pembanding (target? bulan lalu?) = tidak informatif. Selalu: aktual vs target vs periode lalu.</li>
        <li><strong>Terlalu banyak:</strong> 40 KPI + 12 warna = kebisingan. Aturan: 5–7 KPI, 1 pesan per chart.</li>
        <li><strong>Tanpa timestamp:</strong> "data per kapan?" — dashboard tanpa "diperbarui: ..." = bom kepercayaan (angka basi disangka segar).</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dashboard yang baik menjawab <strong>3 pertanyaan dalam 10 detik</strong>: (1) apa yang terjadi? (2) apakah itu bagus/buruk? (3) apa yang harus saya lakukan? Jika butuh 5 menit menjelaskan dashboardmu — desainnya gagal, bukan audiensnya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Uji KPI — Sehat atau Vanity?</h2>
      <p>Uji dua metrik dengan 5 syarat KPI — rasakan bedanya angka sehat vs vanity.</p>
      <PyodideLab
        title="Lab 1 — Detektor Vanity Metric"
        hint="Coba: rancang KPI 'tingkat aktivasi' sendiri dan nilai. Syarat mana yang paling sulit dipenuhi?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Sertifikasi Dashboard</h2>
      <p>Terapkan checklist sertifikasi pada dua dashboard — siapa dapat SIM, siapa tidak.</p>
      <PyodideLab
        title="Lab 2 — SIM untuk Dashboard"
        hint="Coba: dashboard apa di kantormu yang lolos semua checklist? Berapa yang tidak?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: BI yang Sehat</h2>

      <div className="decision-card">
        <h3>1. Metrik baru diusulkan → <strong>uji 5 syarat KPI dulu</strong></h3>
        <p><strong>Kondisi:</strong> "tolong tambahkan metrik X".</p>
        <p><strong>Kenapa:</strong> mencegah vanity metric masuk dashboard. Tidak lolos = metrik pendukung, bukan KPI.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dashboard liar menjamur → <strong>program sertifikasi + rasionalisasi</strong></h3>
        <p><strong>Kondisi:</strong> puluhan dashboard tak terurus.</p>
        <p><strong>Kenapa:</strong> dua kelas (tersertifikasi vs eksplorasi berlabel); pensiunkan yang tak dibuka.</p>
      </div>

      <div className="decision-card">
        <h3>3. Analis & engineer saling lempar → <strong>peran analytics engineer (dbt)</strong></h3>
        <p><strong>Kondisi:</strong> SQL analis tak ter-test; engineer tak paham bisnis.</p>
        <p><strong>Kenapa:</strong> jembatan: software engineering untuk SQL + pemahaman bisnis.</p>
      </div>

      <div className="decision-card">
        <h3>4. Angka beda antar dashboard → <strong>metrics layer (DM14)</strong></h3>
        <p><strong>Kondisi:</strong> sengketa definisi.</p>
        <p><strong>Kenapa:</strong> definisi tunggal tereksekusi — bukan dokumen.</p>
      </div>

      <div className="decision-card">
        <h3>5. Dashboard membingungkan → <strong>desain ulang: 5–7 KPI, konteks, timestamp</strong></h3>
        <p><strong>Kondisi:</strong> butuh penjelasan panjang.</p>
        <p><strong>Kenapa:</strong> 10 detik: apa terjadi, bagus/buruk, apa aksi. Sumbu jujur.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>KPI = 5 syarat.</strong> Gagal 1 = bukan KPI.</li>
          <li><strong>Dashboard resmi = tersertifikasi.</strong> Sisanya berlabel eksplorasi.</li>
          <li><strong>5–7 KPI per dashboard.</strong> Lebih = kebisingan.</li>
          <li><strong>Selalu: timestamp + pembanding + aksi.</strong></li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: KPI "Hijau" Saat Kapal Tenggelam</h2>
      <p>PT Maju Jaya bangga: dashboard "pertumbuhan pengguna" <strong>hijau +12%/bulan</strong> 6 bulan berturut-turut. Tapi pendapatan stagnan. Ikuti forensiknya — ini mini-case lesson ini dalam versi angka penuh.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Bedah +12%: vanity vs actionable (klik untuk buka)</summary>
        <p>Definisi KPI: <code className="inline">pengguna_baru = COUNT(DISTINCT user_id) WHERE created_at bulan ini</code>. Angka: 100.000 → 112.000 → 125.440 (+12%/bulan ✔ hijau).</p>
        <p>Tapi: <strong>68%</strong> "pengguna baru" tidak pernah transaksi (install → buka sekali → hilang). Definisi alternatif (actionable): <code className="inline">pengguna_aktif_bayar = COUNT(DISTINCT user_id) WHERE transaksi &gt; 0 dalam 30 hari</code>: 32.000 → 31.200 → 30.100 (<strong>−2%/bulan</strong> 🔴).</p>
        <p><Tex math={String.raw`\text{yang hijau} = \text{pendaftaran}; \quad \text{yang penting} = \text{pembayar}`} block /></p>
        <p>KPI pertama = <strong>vanity metric</strong>: naik sendiri, tidak bisa diaksi ("bagus, teruskan!"). KPI kedua = <strong>actionable</strong>: turun → investigasi → aksi (perbaiki onboarding). <strong>Uji vanity 10 detik:</strong> "jika angka ini naik 2×, keputusan apa yang berubah?" Tidak ada jawaban = vanity.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — 47 dashboard: biaya duplikasi definisi</summary>
        <p>Audit: 47 dashboard, <strong>11 definisi "pendapatan"</strong> berbeda (gross, net, net-setelah-pajak, ...). Tiap bulan: 3 jam rekonsiliasi per konflik × 11 = 33 jam × Rp200.000 = <strong>Rp6,6 juta/bulan</strong> + 1 keputusan salah per kuartal (rata-rata biaya Rp120 juta).</p>
        <p>Solusi analytics engineering: <strong>1 model dbt</strong> <code className="inline">mart_pendapatan</code> (DM5) + <strong>sertifikasi dashboard</strong> (hanya dashboard bersertifikat boleh dipakai rapat direksi). Setelah 4 bulan: 47 → <strong>19 dashboard</strong> (28 diarsipkan!), 11 definisi → <strong>1</strong>.</p>
        <p><Tex math={String.raw`\text{penghematan} = 6{,}6 \text{ jt/bln} + \frac{120 \text{ jt}}{3} = \text{Rp}46{,}6 \text{ jt/bln}`} block /></p>
        <p>Plus: analis baru onboarding 3 minggu → 4 hari (tahu "mana yang benar"). <strong>Governance dashboard (SIM untuk dashboard) = menghapus dashboard, bukan menambah.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Desain jujur: sumbu Y yang menipu</summary>
        <p>Chart "pertumbuhan" dengan sumbu Y <strong>dipotong di 90</strong> (bukan 0): kenaikan 100 → 103 terlihat <strong>naik 30%</strong> secara visual padahal 3%.</p>
        <p><Tex math={String.raw`\text{efek visual} = \frac{103-90}{100-90} = 1{,}3\times \text{ vs realita } 1{,}03\times`} /></p>
        <p>Aturan desain jujur: <strong>sumbu Y bar chart mulai dari 0</strong> (panjang batang = proporsional nilai); line chart boleh tidak dari 0 <em>jika</em> diberi label jelas. Tiga dosa dashboard: sumbu terpotong tanpa label, <em>cherry-picking</em> periode ("lihat 7 hari terakhir!" — kenapa bukan 30?), dan rata-rata tanpa sebaran (mean naik karena 1 outlier, median turun!). Analis yang baik = <strong>pengacara angka yang jujur</strong>, bukan yang membuat angka terlihat bagus.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Analytics engineer: ROI peran "di tengah"</summary>
        <p>Sebelum AE: analis menulis SQL di 47 dashboard (duplikasi, tidak di-test); engineer menolak "itu bukan pipeline". Kesenjangan = <strong>zona mati</strong>: transformasi kritis tanpa pemilik.</p>
        <p>2 AE × Rp35 juta/bulan = Rp840 juta/tahun. Yang mereka bereskan: 28 dashboard duplikat diarsipkan (hemat Rp6,6 jt/bln rekonsiliasi), test di 15 model (0 insiden angka salah dalam 8 bulan vs 3 sebelumnya), onboarding analis 3 minggu → 4 hari (8 analis baru × 17 hari × Rp800.000 = <strong>Rp109 juta</strong>). Total terukur: <Tex math={String.raw`(6{,}6 \times 12) + 109 \approx \text{Rp}188 \text{ jt/tahun}`} /> + insiden nol. <strong>AE = peran dengan ROI paling mudah dihitung di tim data</strong> — karena pekerjaannya = menghapus pemborosan yang terlihat.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> hierarki kebutuhan dashboard (bawah → atas): <strong>benar</strong> (angka bisa dipercaya — test!) → <strong>jelas</strong> (tahu apa yang dilihat — definisi!) → <strong>cepat</strong> (load &lt;3 detik — agregat!) → <strong>indah</strong> (terakhir!). 90% dashboard gagal di level 1–2 tapi di-makeover di level 4. <strong>Dashboard cantik dengan angka salah = kebohongan berdesain bagus.</strong></p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Amnesty: 47 → 19 dashboard, berapa hemat maintenance-nya?</summary>
        <p>Tiap dashboard: maintenance ~Rp2 juta/bulan (refresh monitoring, tanya jawab "kok beda?", update saat skema berubah).</p>
        <p><Tex math={String.raw`(47-19) \times 2 \text{ jt} = \text{Rp}56 \text{ jt/bulan} = \text{Rp}672 \text{ jt/tahun}`} block /></p>
        <p><strong>Menghapus 28 dashboard = "proyek" Rp672 juta/tahun.</strong> Tidak ada kode baru, tidak ada teknologi baru — hanya keberanian bertanya "ini masih dipakai?" tiap 6 bulan. <strong>Keberanian menghapus = fitur governance paling langka.</strong></p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Dashboard = Produk, Bukan Laporan</h2>
      <p>Pergeseran mental analytics engineering: dashboard bukan "laporan yang dibuatkan", tapi <strong>produk dengan pengguna, pemilik, dan siklus hidup</strong>:</p>
      <ul>
        <li><strong>Setiap dashboard butuh "alasan hidup" tertulis.</strong> 1 kalimat: "dashboard ini dipakai <em>siapa</em> untuk <em>keputusan apa</em>, <em>kapan</em>?" Tidak bisa jawab = kandidat arsip. Dari 47 dashboard PT Maju Jaya, 28 tidak bisa menjawab — mereka "dibuat untuk rapat sekali 2 tahun lalu". <strong>Sertifikasi</strong> = SIM-nya: tanpa pemilik + alasan + refresh terjadwal, dashboard = kendaraan tanpa SIM (Lab 2!).</li>
        <li><strong>AE tinggal di antara dua dunia.</strong> Keterampilan inti: <strong>SQL kelas produksi</strong> (bukan query sekali pakai — berversi, di-test, terdokumentasi) + <strong>empati analis</strong> (tahu keputusan apa yang dikejar). AE yang hanya bisa kode = engineer murah; AE yang hanya bisa analisis = analis mahal. Nilainya = <strong>jembatan</strong>: mengubah pertanyaan bisnis menjadi model data yang bisa dipakai 100 orang.</li>
        <li><strong>Self-service BI ≠ "analis bikin sendiri semua".</strong> Pola dewasa: <strong>lapisan terkurasi</strong> (model dbt bersertifikat — 1 definisi benar) + <strong>lapisan eksplorasi</strong> (analis bebas, tapi hasilnya <em>tidak</em> boleh jadi "angka resmi" sebelum dikurasi). Tanpa lapisan terkurasi: 11 definisi pendapatan. Tanpa eksplorasi: analis antre ke AE (DM14: bottleneck lagi!).</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> ritual yang bekerja — <strong>"dashboard amnesty" tiap 6 bulan</strong>: semua pemilik dashboard ditanya "masih dipakai? untuk keputusan apa?". Tidak jawab dalam 2 minggu = diarsipkan otomatis (bisa dikembalikan). Perusahaan yang menjalankan ini 2×: dashboard turun 40–60%, <em>kepercayaan</em> naik (yang tersisa = yang dirawat). Keberanian menghapus = fitur governance yang paling langka.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Makin banyak dashboard = makin data-driven."</strong></p>
        <p><strong>Yang benar:</strong> 47 dashboard dengan 11 definisi = <strong>makin bingung-driven</strong>. Organisasi data-driven = <em>sedikit</em> dashboard yang <strong>dipercaya, dipakai, dan memicu aksi</strong>. Metrik kesehatannya bukan jumlah dashboard, tapi: <strong>% dashboard dibuka tiap minggu</strong> (dipakai?), <strong>% keputusan rapat merujuk dashboard</strong> (berdampak?), <strong>waktu dari pertanyaan ke jawaban</strong> (cepat?). Dashboard yang tidak dibuka 90 hari = sampah digital yang membayar biaya maintenance.</p>
      </div>

      <div className="callout">
        <h3>✅ Checklist Sertifikasi Dashboard (8 kriteria)</h3>
        <p>Dashboard "bersertifikat" (boleh dipakai rapat direksi) wajib lolos 8 ini:</p>
        <ol>
          <li><strong>Pemilik bernama</strong> + tanggal review terakhir (&lt; 6 bulan).</li>
          <li><strong>Alasan hidup 1 kalimat</strong>: siapa memakai untuk keputusan apa, kapan.</li>
          <li><strong>Sumber terkurasi</strong>: hanya baca model dbt bersertifikat (bukan query ad-hoc).</li>
          <li><strong>Definisi tertulis</strong>: tiap KPI punya definisi + rumus di glossary.</li>
          <li><strong>Test hijau</strong>: pipeline di belakangnya lolos test kualitas 30 hari terakhir.</li>
          <li><strong>Refresh terjadwal &amp; terdokumentasi</strong>: "update tiap jam 06.00" — bukan "kadang".</li>
          <li><strong>Desain jujur</strong>: sumbu tidak menipu, periode tidak cherry-picked, ada pembanding.</li>
          <li><strong>Dipakai</strong>: dibuka ≥1×/minggu 90 hari terakhir — tidak dipakai = tidak diperpanjang.</li>
        </ol>
        <p>Dari 47 dashboard PT Maju Jaya, hanya <strong>19</strong> lolos — 28 diarsipkan. <strong>Sertifikasi = SIM:</strong> tanpa SIM, dashboard = kendaraan tanpa izin operasi.</p>
      </div>

      <div className="callout">
        <h3>🌳 Contoh KPI Tree: dari "naik 20%" ke metrik yang bisa dikerjakan</h3>
        <p>Target direksi: "pendapatan naik 20%". KPI tree memecahnya sampai ke metrik yang bisa <em>diaksi tim</em>:</p>
        <ul>
          <li><strong>L0 (direksi):</strong> pendapatan +20% → <strong>L1:</strong> pengguna bayar × ARPU.</li>
          <li><strong>L2 (growth):</strong> pengguna bayar = akuisisi × aktivasi × retensi. Target: retensi 30% → 40% (paling murah!).</li>
          <li><strong>L3 (tim):</strong> retensi = onboarding selesai × notifikasi dibuka × repeat order. Tiap tim punya <strong>1 metrik</strong>: tim onboarding → "% selesai tutorial"; tim CRM → "% notifikasi dibuka".</li>
        </ul>
        <p>Aturan KPI tree: <strong>setiap metrik L3 harus bisa diaksi 1 tim dalam 1 sprint</strong>. Metrik yang tidak ada pemiliknya = hiasan pohon. Dan tiap cabang butuh <strong>definisi tunggal</strong> (DM14: semantic layer) — atau pohonnya tumbuh 11 definisi "pendapatan".</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Detektor Vanity Metric — Uji 10 Detik Otomatis</h2>
      <p>Nilai KPI-mu dengan 3 uji: bisa diaksi? ada pembanding? tidak bisa "hijau palsu"?</p>
      <PyodideLab
        title="Lab 3 — Ujian KPI"
        hint="Coba: buat KPI-mu sendiri (mis. 'jumlah download'). Lolos berapa uji? Kebanyakan KPI perusahaan hanya lolos 1 dari 3."
        defaultCode={`# Lab 3: uji kelayakan KPI (vanity vs actionable)
kpis = [
    {"nama": "Pengguna baru (registrasi)", "aksi": False, "pembanding": False,
     "anti_hijau_palsu": False},   # naik sendiri, tak bisa diaksi
    {"nama": "Pengguna bayar 30 hari", "aksi": True, "pembanding": True,
     "anti_hijau_palsu": True},    # turun -> investigasi onboarding
    {"nama": "Total pageview", "aksi": False, "pembanding": True,
     "anti_hijau_palsu": False},   # bisa naik karena bot!
]

print("UJI KPI (3 syarat KPI sehat):")
print(" 1) Bisa diaksi  2) Ada pembanding  3) Tak bisa 'hijau palsu'\\n")
sehat = 0
for k in kpis:
    lolos = sum([k["aksi"], k["pembanding"], k["anti_hijau_palsu"]])
    status = "SEHAT" if lolos == 3 else ("WASPADA" if lolos == 2 else "VANITY")
    if lolos == 3: sehat += 1
    print(f"  [{status:7s}] {k['nama']} ({lolos}/3)")
print(f"\\n{sehat}/{len(kpis)} KPI sehat.")
print()
print("'Total pageview' gagal uji 3: bot + auto-refresh bisa menghijaukannya")
print("tanpa 1 rupiah pendapatan. KPI tanpa anti-hijau-palsu = bom waktu.")`}
      />

      <h2 id="case">📋 Mini-Case: KPI yang "Hijau" Saat Kapal Tenggelam</h2>
      <div className="callout">
        <p>Dashboard direksi menunjukkan <strong>"Total Nasabah: 2,1 juta" hijau naik</strong> — semua senang. Tiga bulan kemudian audit: 400 ribu di antaranya <strong>tidak pernah transaksi</strong> (akun mati), 150 ribu <strong>duplikat</strong> (DM11!). Nasabah <em>aktif</em> sebenarnya turun 12%. KPI "hijau" menyembunyikan kapal yang tenggelam.</p>
        <p><strong>Pertanyaan:</strong> (a) Syarat KPI mana yang dilanggar? (b) KPI pengganti yang sehat? (c) Kegagalan governance apa di baliknya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Akurat</strong> (definisi "nasabah" tidak tunggal — termasuk mati & duplikat) dan <strong>relevan/actionable</strong> (angka naik tapi tidak memberi sinyal bahaya — vanity metric!).</p>
          <p>(b) <strong>"Nasabah aktif"</strong> (definisi glossary DM10: ≥1 transaksi 30 hari) + <strong>"tingkat aktivasi"</strong> — keduanya bisa turun → memicu aksi.</p>
          <p>(c) <strong>Tiga lapis:</strong> tanpa glossary tunggal (DM10), tanpa dedup master data (DM11), tanpa sertifikasi dashboard (DM16) — KPI dibangun di atas fondasi rapuh. Inilah kenapa track DM berurutan.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: uji vanity, ekonomi sertifikasi, dan sumbu menipu.</p>

      <details className="worked">
        <summary>Soal 1 — Vanity: pendaftar 50.000 → 58.000 (+16%), pengguna bayar 12.000 → 11.500 (−4%). KPI mana yang vanity? Uji 10 detiknya?</summary>
        <p><strong>Pendaftar = vanity</strong> (hijau, tapi tidak bisa diaksi); <strong>pengguna bayar = actionable</strong> (merah → investigasi onboarding).</p>
        <p>Uji 10 detik: "jika pendaftar naik 2×, keputusan apa yang berubah?" — tidak ada jawaban = vanity. <strong>Hijau yang tidak mengubah keputusan = dekorasi.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Sertifikasi: 35 dashboard, 7 definisi "pendapatan", tiap konflik butuh 5 jam rekonsiliasi/bulan × Rp200.000. Berapa biaya/bulan? Program sertifikasi Rp100 juta — payback?</summary>
        <p><Tex math={String.raw`7 \times 5 \times 200.000 = \text{Rp}7 \text{ jt/bulan}`} /> → payback <Tex math={String.raw`100/7 \approx 14 \text{ bulan}`} block /></p>
        <p>Plus: analis baru onboarding berminggu-minggu → berhari-hari. <strong>Menghapus dashboard = fitur.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Sumbu menipu: chart batang 200 → 206, sumbu Y mulai dari 180. Berapa "efek visual" vs kenaikan riil?</summary>
        <p>Visual: <Tex math={String.raw`\frac{206-180}{200-180} = 1{,}3\times`} />; riil: <Tex math={String.raw`206/200 = 1{,}03\times`} block /></p>
        <p>Kenaikan 3% terlihat 30%. <strong>Bar chart wajib mulai dari 0</strong> — atau beri label besar "sumbu dipotong". Analis jujur &gt; analis yang membuat angka terlihat bagus.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'Total download kumulatif sejak 2019' sebagai KPI utama. Penilaianmu?"
        options={[
          "KPI bagus — angkanya besar",
          "Vanity metric — selalu naik, tidak mengubah keputusan, tidak actionable. Ganti 'tingkat aktivasi'",
          "Cukup tambah warna",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: uji 'jika turun 20% apa aksinya?' — tidak ada jawaban = bukan KPI."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Peran analytics engineer menjembatani…"
        options={[
          "Data engineer (platform/pipeline) dan analis (insight) — membangun Gold bermakna bisnis dengan praktik software engineering (dbt, test, dokumentasi)",
          "HR dan finance",
          "Tidak ada",
          "Vendor dan klien",
        ]}
        correct={0}
        explanation="Benar: ia lahir dari celah — SQL analis tak ter-test, engineer tak paham bisnis. Jembatan karir analis → engineer."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dashboard dari CSV email dipakai direksi. Menurut governance dashboard…"
        options={[
          "Tidak masalah jika angkanya bagus",
          "TIDAK boleh untuk keputusan resmi — sumber bukan Gold tersertifikasi; maksimal berlabel 'eksplorasi/belum terverifikasi'",
          "Boleh jika dibuat cepat",
          "Hapus CSV-nya saja",
        ]}
        correct={1}
        explanation="Benar: dua kelas dashboard. Eksplorasi boleh ada — tapi tidak boleh menyamar resmi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dashboard tanpa timestamp 'diperbarui: ...' berisiko…"
        options={[
          "Tidak ada risiko",
          "Angka basi disangka segar — bom kepercayaan. Selalu tampilkan freshness",
          "Terlalu jujur",
          "Loading lambat",
        ]}
        correct={1}
        explanation="Benar: kepercayaan = tahu data se-segar apa. Tanpa timestamp, pengguna menebak — dan tebakan salah itu mahal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Lima dashboard beda angka 'pendapatan'. Solusi struktural?"
        options={[
          "Pilih yang paling bagus",
          "Metrics layer (DM14): satu definisi tereksekusi dikonsumsi semua — bukan dokumen glossary saja",
          "Rata-ratakan",
          "Hapus semua",
        ]}
        correct={1}
        explanation="Benar: definisi di kode yang dijalankan tidak bisa 'lupa diikuti'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Aturan jumlah KPI per dashboard yang sehat?"
        options={[
          "Sebanyak mungkin — 40",
          "5–7 KPI, tiap punya aksi. Lebih = kebisingan; 'Key' berarti sedikit dan penting",
          "1 saja selalu",
          "Tidak ada aturan",
        ]}
        correct={1}
        explanation="Benar: perhatian terbatas. 10 detik: apa terjadi, bagus/buruk, apa aksi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>KPI:</strong> 5 syarat — akurat, relevan, tepat waktu, actionable, ber-owner. Vanity ≠ KPI.</li>
          <li><strong>Analytics engineer:</strong> jembatan engineer–analis; software engineering untuk SQL (dbt).</li>
          <li><strong>Governance dashboard:</strong> sertifikasi (SIM) — resmi vs eksplorasi berlabel; pensiunkan yang basi.</li>
          <li><strong>Desain jujur:</strong> sumbu tidak terpotong, ada konteks & timestamp, 5–7 KPI.</li>
          <li><strong>Jangan:</strong> 47 dashboard liar; CSV email untuk direksi; vanity metric sebagai KPI.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm15-cloud-dataops" className="btn btn-secondary btn-sm">← DM15</Link>
        <Link href="/learn/dm17-strategi-data" className="btn btn-primary btn-sm">Next: DM17 →</Link>
      </div>
    </div>
  );
}
