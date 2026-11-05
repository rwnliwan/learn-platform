"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr20Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const kriData = [
    {
      x: ["NPL gross", "NPL net", "Coverage", "Cost of risk"],
      y: [2.8, 0.9, 68, 1.4],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1", "#3aa655", "#ef9244"] },
      text: ["2,8%", "0,9%", "68%", "1,4%"],
      textposition: "outside",
    },
  ];

  const corTrendData = [
    {
      x: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
      y: [1.1, 1.2, 1.3, 1.5, 1.8, 2.1],
      type: "scatter",
      mode: "lines+markers",
      name: "Cost of risk (%)",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2"],
      y: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
      type: "scatter",
      mode: "lines",
      name: "Appetite max 1,5%",
      line: { color: "#2a7de1", width: 2, dash: "dash" },
    },
  ];

  const heatmapData = [
    {
      x: ["KPR", "KMK", "KTA", "Kartu"],
      y: ["NPL", "DPK", "Coverage"],
      z: [[2.1, 4.8, 5.2, 9.5], [5.0, 8.2, 10.1, 14.0], [75, 60, 55, 80]],
      type: "heatmap",
      colorscale: "RdYlGn",
      reversescale: true,
      showscale: true,
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator KRI — dari angka mentah ke dashboard
# Data Bank Nusantara (Rp Miliar)
total_kredit = 50000
kolek_345 = 1400
ckpn = 950
beban_ckpn_kuartal = 175  # beban CKPN kuartal berjalan (annualized x4)
laba_sebelum_ckpn = 900

npl_gross = kolek_345 / total_kredit * 100
npl_net = (kolek_345 - ckpn) / total_kredit * 100
coverage = ckpn / kolek_345 * 100
cor = beban_ckpn_kuartal * 4 / total_kredit * 100
laba_bersih = laba_sebelum_ckpn - beban_ckpn_kuartal

print(f"NPL gross   : {npl_gross:.2f}%   {'OK' if npl_gross<5 else 'AWAS!'}")
print(f"NPL net     : {npl_net:.2f}%")
print(f"Coverage    : {coverage:.0f}%    {'tebal' if coverage>60 else 'tipis'}")
print(f"Cost of risk: {cor:.2f}%    {'di atas appetite 1.5%' if cor>1.5 else 'dalam appetite'}")
print(f"Laba bersih : Rp {laba_bersih} M (CKPN memakan {beban_ckpn_kuartal/laba_sebelum_ckpn*100:.0f}% laba!)")
print()
print("Coba: naikkan beban_ckpn_kuartal jadi 300. Lihat laba & CoR.")
print("Inilah mengapa direksi SANGAT peduli CoR — ia langsung memakan bonus mereka.")`;

  const lab2Code = `# Lab 2: Traffic light KRI — otomatisasi penilaian
# Aturan: hijau < appetite, kuning 1-1.2x appetite, merah > 1.2x appetite.
def traffic_light(nama, nilai, appetite, lebih_kecil_bagus=True):
    if lebih_kecil_bagus:
        if nilai <= appetite: status = "HIJAU"
        elif nilai <= appetite*1.2: status = "KUNING"
        else: status = "MERAH"
    else:
        if nilai >= appetite: status = "HIJAU"
        elif nilai >= appetite*0.8: status = "KUNING"
        else: status = "MERAH"
    return nama, nilai, appetite, status

kris = [
    traffic_light("NPL gross (%)", 2.8, 5.0),
    traffic_light("Cost of risk (%)", 2.1, 1.5),
    traffic_light("Coverage (%)", 68, 60, lebih_kecil_bagus=False),
    traffic_light("DPK (%)", 6.2, 8.0),
    traffic_light("Konsentrasi sektor (%)", 22, 20),
]
print(f"{'KRI':<22} {'Aktual':>7} {'Appetite':>9} {'Lampu':>7}")
merah = 0
for nama, nilai, app, st in kris:
    print(f"{nama:<22} {nilai:>7} {app:>9} {st:>7}")
    if st == "MERAH": merah += 1
print(f"\nLampu merah: {merah} -> {'ESKALASI KE KOMITE' if merah>0 else 'AMAN'}")
print()
print("Coba: ubah nilai CoR jadi 1.2. Dashboard jadi hijau semua.")
print("Inilah dashboard yang dilihat direksi tiap bulan —")
print("pekerjaanmu sebagai analis adalah memastikan angkanya JUJUR.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR20 — Credit Risk Analyst</span>
        <h1 className="display-title">Monitoring &amp; KRI:<br />Dashboard Risiko Kredit</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Lampu Merah yang Tidak Dilihat</a></li>
          <li><a href="#kri">KRI: Lima Angka yang Wajib Dipantau</a></li>
          <li><a href="#cor">Cost of Risk: Harga Risiko per Tahun</a></li>
          <li><a href="#dashboard">Dashboard: Dari Angka ke Keputusan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator KRI</a></li>
          <li><a href="#lab2">🔬 Lab 2: Traffic Light Otomatis</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Lampu Menyala — Apa Aksi?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Dashboard Hijau, Bank Berdarah</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 5 KRI utama (NPL gross/net, coverage, cost of risk, DPK) dan menghitungnya.</li>
          <li>Menganalisis tren cost of risk terhadap risk appetite.</li>
          <li>Merancang dashboard traffic-light dengan ambang eskalasi yang jelas.</li>
          <li>Mengidentifikasi manipulasi dashboard (cherry-picking metrik).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Lampu Merah yang Tidak Dilihat</h2>
      <div className="story">
        <p>Kokpit pesawat punya ratusan lampu. Pilot tidak memantau semuanya — ia memantau <strong>yang merah</strong>. Suatu hari, lampu tekanan oli menyala merah. Co-pilot melihat, tapi berkata: <em>"Ah, sensornya mungkin rusak. Lanjutkan."</em> Tiga puluh menit kemudian: mesin mati.</p>
        <p>Bank Nusantara, 2025. Dashboard risiko menunjukkan <strong>cost of risk 2,1%</strong> — di atas appetite 1,5% — selama <strong>dua kuartal</strong>. Analis junior melaporkannya. Atasannya: <em>"NPL masih 2,8%, aman. Mungkin cuma musiman."</em> Dua kuartal kemudian: NPL melonjak ke 4,5%, CKPN meledak Rp 600 miliar.</p>
        <p><strong>Twist-nya:</strong> masalahnya bukan tidak ada data — melainkan <strong>tidak ada yang bertindak</strong> atas lampu merah. Lesson ini tentang membangun dashboard yang <strong>tidak bisa diabaikan</strong>: KRI yang tepat, ambang yang jelas, dan eskalasi yang otomatis.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="kri">KRI: Lima Angka yang Wajib Dipantau</h2>
      <p><strong>Definisi.</strong> <strong>KRI</strong> (<em>Key Risk Indicator</em>) = metrik yang dipantau berkala untuk mendeteksi <strong>perubahan profil risiko</strong>. Lima yang wajib ada di dashboard kredit:</p>
      <ol>
        <li><strong>NPL gross</strong> — % kredit macet (kolek 3–5). Ambang OJK: &lt;5%.</li>
        <li><strong>NPL net</strong> — setelah dikurangi CKPN. Mengukur <strong>eksposur bersih</strong>.</li>
        <li><strong>Coverage ratio</strong> — CKPN/NPL. Mengukur <strong>ketebalan bantal</strong>.</li>
        <li><strong>Cost of risk (CoR)</strong> — beban CKPN tahunan / total kredit. Mengukur <strong>"harga" risiko per tahun</strong>.</li>
        <li><strong>DPK (Kolek 2)</strong> — % dalam perhatian khusus. <strong>Indikator awal</strong> (leading).</li>
      </ol>
      <p><strong>Kepribadian:</strong> lima KRI seperti <strong>lima tanda vital pasien</strong> — tensi, nadi, suhu, saturasi, pernapasan. Dokter tidak mendiagnosis dari satu tanda; ia membaca <strong>kombinasinya</strong>. NPL normal + CoR tinggi = demam yang belum terlihat di termometer.</p>

      <PlotlyChart
        data={kriData}
        title="Lima KRI Bank Nusantara (kuartal berjalan)"
        layout={{ xaxis: { title: "KRI" }, yaxis: { title: "%" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu KRI (satuan %).</p>
        <p><strong>Interpretasi:</strong> NPL gross 2,8% (aman, &lt;5%) + coverage 68% (tebal) = terlihat sehat. Tapi <strong>CoR 1,4%</strong> mendekati appetite 1,5% — <strong>lampu kuning</strong>. Kombinasi "NPL rendah + CoR naik" = bank sedang <strong>mencadangkan agresif</strong> (mungkin antisipasi) ATAU kualitas memburuk tapi belum jadi NPL. Selidiki — jangan rayakan dulu.</p>
      </div>

      <h2 id="cor">Cost of Risk: Harga Risiko per Tahun</h2>
      <p><strong>Definisi.</strong></p>
      <Tex math={String.raw`\text{Cost of Risk} = \frac{\text{Beban CKPN tahunan}}{\text{Rata-rata total kredit}} \times 100\%`} block />
      <p><strong>Artinya:</strong> berapa % dari portofolio yang "dimakan" cadangan tiap tahun. CoR 1,4% = dari tiap Rp 100 kredit, Rp 1,4 menjadi beban cadangan tahun ini.</p>
      <p><strong>Mengapa direksi peduli:</strong> CoR langsung menggerus <strong>laba</strong> (lihat Lab 1: CKPN memakan 19% laba!). CoR naik 0,5 poin di portofolio Rp 50 T = <strong>Rp 250 miliar</strong> laba hilang. Inilah KRI yang paling "terasa" di bonus direksi.</p>

      <PlotlyChart
        data={corTrendData}
        title="Cost of Risk vs Risk Appetite (6 kuartal)"
        layout={{ xaxis: { title: "Kuartal" }, yaxis: { title: "CoR (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = CoR aktual; garis biru putus-putus = batas appetite 1,5%.</p>
        <p><strong>Interpretasi:</strong> CoR <strong>menembus appetite 2 kuartal berturut-turut</strong> dan trennya naik (1,1 → 2,1). Ini <strong>bukan musiman</strong> — ini struktural. Aturan governance: <strong>pelanggaran appetite 2 kuartal = eskalasi wajib ke komite risiko</strong> dengan action plan. "Mungkin musiman" bukan action plan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NPL rendah = risiko terkendali."</strong></p>
        <p><strong>Yang benar:</strong> NPL adalah <strong>lagging indicator</strong> (mencerminkan masa lalu). CoR dan DPK adalah <strong>leading indicator</strong> (mencerminkan masa depan). Bank bisa punya NPL 2% (cantik) sementara CoR 2,5% (berdarah) — karena sedang mencadangkan untuk masalah yang <em>akan</em> jadi NPL. Pantau keduanya.</p>
      </div>

      <h2 id="dashboard">Dashboard: Dari Angka ke Keputusan</h2>
      <p><strong>Prinsip dashboard yang baik:</strong></p>
      <ul>
        <li><strong>Traffic light</strong> — hijau/kuning/merah vs appetite. Otak manusia memproses warna 60.000× lebih cepat dari angka.</li>
        <li><strong>Tren, bukan titik</strong> — 6–8 kuartal ke belakang. Satu titik = tidak ada cerita.</li>
        <li><strong>Drill-down</strong> — klik NPL → per segmen → per vintage → per cabang. Masalah selalu bersembunyi di detail.</li>
        <li><strong>Eskalasi otomatis</strong> — lampu merah 2 periode = wajib dibahas komite (bukan "nanti").</li>
      </ul>

      <PlotlyChart
        data={heatmapData}
        title="Heatmap KRI per Segmen (ilustrasi)"
        layout={{ xaxis: { title: "Segmen" }, yaxis: { title: "KRI" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sel = nilai KRI per segmen; merah = buruk, hijau = baik. (Catatan: coverage dibalik — tinggi = baik.)</p>
        <p><strong>Interpretasi:</strong> <strong>Kartu kredit</strong> merah di NPL (9,5%) tapi hijau di coverage (80%) — berisiko tapi dicadangkan tebal. <strong>KTA</strong> merah di NPL (5,2%) + DPK tinggi (10,1%) + coverage rendah (55%) — <strong>triple merah</strong>: segmen paling berbahaya. Dashboard seperti ini membuat prioritas <strong>langsung terlihat</strong> tanpa membaca 50 halaman laporan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dashboard terbaik menjawab <strong>tiga pertanyaan dalam 30 detik</strong>: (1) apa yang merah? (2) trennya ke mana? (3) siapa yang bertanggung jawab menindaklanjuti? Jika butuh 30 menit menjelaskan dashboard, dashboardnya gagal — bukan audiensnya.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Leading vs Lagging — Dua Mata Waktu</h3>
      <p>Lima KRI terbagi dua keluarga: <strong>lagging</strong> (NPL gross/net, coverage — menceritakan masa lalu) dan <strong>leading</strong> (DPK/Kolek 2, CoR — menceritakan masa depan). Analis yang hanya memonitor NPL seperti sopir yang hanya melihat <strong>kaca spion</strong> — ia tahu ke mana mobil <em>telah</em> pergi, bukan ke mana ia <em>akan</em> pergi. DPK yang menggelembung adalah <strong>kaca depan</strong>: ia menunjukkan NPL 6 bulan ke depan. CoR yang merangkak naik menunjukkan laba 2 kuartal ke depan. <strong>Dashboard yang baik selalu punya keduanya</strong> — spion untuk akuntabilitas, kaca depan untuk aksi.</p>
      <p>Intuisi kedua: <strong>appetite bukan ramalan — melainkan janji</strong>. Risk appetite (misal: CoR ≤1,5%, NPL &lt;5%) adalah janji direksi kepada komisaris dan OJK: "inilah batas risiko yang kami berani ambil." Melanggar appetite bukan sekadar "angka merah" — melainkan <strong>pelanggaran janji</strong> yang wajib dijelaskan dan diperbaiki. Inilah mengapa eskalasi otomatis penting: lampu merah 2 periode = wajib dibahas komite. Tanpa mekanisme ini, appetite menjadi hiasan dinding.</p>
      <p>Intuisi ketiga tentang dashboard: <strong>prinsip 30 detik</strong> — direksi harus bisa menjawab "apa yang merah, trennya ke mana, siapa pemilik masalahnya" dalam 30 detik. Dashboard dengan 50 metrik = tidak ada metrik yang dibaca. Lima KRI + traffic light + tren 8 kuartal + drill-down = cukup. <strong>Dashboard yang baik mengurangi pertanyaan, bukan menambahnya.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan pasangan ini: <strong>NPL = apa yang terjadi</strong> (akuntabilitas), <strong>DPK + CoR = apa yang akan terjadi</strong> (aksi). Rapat komite risiko yang sehat menghabiskan 20% waktu untuk NPL (masa lalu) dan 80% untuk DPK/CoR/vintage (masa depan). Rapat yang 100% membahas NPL = rapat arkeologi.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator KRI</h2>
      <p>Dari angka mentah ke lima KRI — plus dampaknya ke laba.</p>
      <PyodideLab
        title="Lab 1 — Lima KRI & Dampak Laba"
        hint="Coba naikkan beban_ckpn_kuartal 175 → 300. Perhatikan: CoR, laba, dan % laba yang 'dimakan'. Inilah mengapa CoR adalah KRI favorit direksi."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Traffic Light Otomatis</h2>
      <p>Otomatisasi penilaian: hijau/kuning/merah vs appetite + eskalasi.</p>
      <PyodideLab
        title="Lab 2 — Dashboard Traffic Light"
        hint="Ubah nilai-nilainya dan lihat lampu berubah. Diskusikan: siapa yang menetapkan 'appetite'? (Jawaban: dewan komisaris atas usulan direksi — bukan analis sendirian.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Lampu Menyala — Apa Aksi?</h2>

      <div className="decision-card">
        <h3>1. Satu KRI kuning 1 kuartal → <strong>pantau + catat penjelasan</strong></h3>
        <p><strong>Kondisi:</strong> CoR 1,6% (appetite 1,5%) pertama kali.</p>
        <p><strong>Aksi:</strong> investigasi ringan: musiman atau struktural? Dokumentasikan. Jangan abaikan — kuning adalah merah yang sopan.</p>
      </div>

      <div className="decision-card">
        <h3>2. KRI merah 2 kuartal → <strong>eskalasi wajib ke komite + action plan</strong></h3>
        <p><strong>Kondisi:</strong> CoR 2,1% dua kuartal berturut-turut.</p>
        <p><strong>Aksi:</strong> paparan ke komite risiko: sebab (bedah segmen), dampak (proyeksi laba/KPMM), aksi (perketat origination, tambah collection). Tanpa action plan = lampu merah yang diabaikan.</p>
      </div>

      <div className="decision-card">
        <h3>3. Leading (DPK/CoR) merah tapi lagging (NPL) hijau → <strong>bertindak SEKARANG</strong></h3>
        <p><strong>Kondisi:</strong> DPK naik, NPL masih rendah.</p>
        <p><strong>Kenapa:</strong> ini <strong>jendela emas</strong> — masalah terdeteksi sebelum jadi NPL. Intervensi kini 10× lebih murah dari nanti (CR9).</p>
      </div>

      <div className="decision-card">
        <h3>4. Semua hijau tapi tren memburuk → <strong>tantang appetite-nya</strong></h3>
        <p><strong>Kondisi:</strong> CoR 1,4% (di bawah 1,5%) tapi naik 6 kuartal berturut-turut.</p>
        <p><strong>Aksi:</strong> mungkin appetite terlalu longgar, atau tren akan menembus. Naikkan ke komite: "apakah 1,5% masih tepat?"</p>
      </div>

            <div className="decision-card">
        <h3>5. DPK naik 3 kuartal berturut-turut tetapi NPL tetap datar → <strong>jangan rayakan NPL — selidiki DPK</strong></h3>
        <p><strong>Kondisi:</strong> DPK (Kolek 2) naik 5% → 6,5% → 7,8% dalam 3 kuartal. NPL tetap 2,8%. Direksi santai: "NPL kita stabil."</p>
        <p><strong>Aksi:</strong> ini pola klasik <strong>"tenang sebelum badai"</strong> — atau pola <strong>evergreening</strong> (DPK ditahan agar tidak jatuh ke NPL via restrukturisasi agresif). Selidiki: (1) <strong>drill-down</strong> — segmen/vintage/cabang mana yang DPK-nya naik? (2) <strong>alasan</strong> — apakah restrukturisasi melonjak di saat yang sama? (3) <strong>roll rate</strong> — apakah DPK→Kolek 3 memburuk (artinya DPK memang beracun) atau stabil (DPK "jinak")? Jika roll rate memburuk + restrukturisasi naik = <strong>bom waktu yang disembunyikan</strong>. Eskalasi ke komite dengan proyeksi: "DPK 7,8% dengan roll rate X% = NPL +Y poin dalam 2 kuartal."</p>
        <p><strong>Contoh nyata:</strong> banyak bank yang "NPL stabil" 2022–2023 ternyata menumpuk DPK + restrukturisasi — dan NPL-nya meledak 2024 saat stimulus berakhir. Analis yang membaca DPK sudah memperingatkan sejak 2022; yang hanya membaca NPL terkejut di 2024.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Lima KRI:</strong> NPL gross/net, coverage, CoR, DPK.</li>
          <li><strong>Leading vs lagging:</strong> DPK/CoR = masa depan; NPL = masa lalu.</li>
          <li><strong>Merah 2× = eskalasi wajib.</strong> Bukan opsional.</li>
          <li><strong>Dashboard 30 detik:</strong> apa merah, tren ke mana, siapa bertindak.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Rapat Komite Risiko yang Efektif: Agenda 60 Menit</h3>
      <p>Komite risiko yang baik bukan yang lama — melainkan yang memutuskan. Agenda 60 menit ini = standar.</p>
      <ol>
        <li><strong>Menit 0–5: traffic light</strong> — 5 KRI: apa yang merah/kuning? Tanpa diskusi — hanya fakta. Merah 2 periode = otomatis masuk agenda aksi.</li>
        <li><strong>Menit 5–20: deep dive SATU masalah</strong> — Bukan 10 masalah dangkal — melainkan 1 masalah mendalam (drotasi tiap bulan). Bulan ini: DPK kartu kredit. Bulan depan: vintage KMK.</li>
        <li><strong>Menit 20–35: proyeksi &amp; skenario</strong> — Dengan tren ini, NPL 2 kuartal lagi berapa? CoR? Butuh aksi apa SEKARANG agar tidak terjadi?</li>
        <li><strong>Menit 35–50: keputusan</strong> — Setiap masalah merah = keputusan: siapa, apa, kapan. Tanpa pemilik + deadline = bukan keputusan, melainkan harapan.</li>
        <li><strong>Menit 50–60: appetite review</strong> — Apakah appetite masih relevan? Ekonomi berubah = appetite mungkin perlu direvisi (via komisaris — bukan diam-diam).</li>
        <li><strong>Aturan main:</strong> — Tidak ada presentasi &gt;10 slide. Data dibagikan H-2 (rapat untuk memutuskan, bukan membaca). Yang tidak hadir = dianggap setuju.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> enam puluh menit, satu deep dive, keputusan konkret. Komite yang 3 jam membahas 20 topik = komite yang tidak memutuskan apa-apa.</p>

      <details className="worked">
        <summary>❓ KRI untuk unit syariah — beda?</summary>
        <p><strong>Prinsip sama, istilah beda:</strong> NPL → NPF (<em>Non-Performing Financing</em>), CKPN → PPAP, bunga → margin/bagi hasil. Ambang dan logikanya identik — hanya akadnya yang berbeda. Analis yang paham konvensional <strong>langsung bisa</strong> membaca KRI syariah dengan kamus istilah.</p>
      </details>
      <details className="worked">
        <summary>❓ Seberapa cepat KRI harus tersedia setelah tutup bulan?</summary>
        <p>Praktik baik: <strong>H+5 kerja</strong> untuk KRI utama (NPL, DPK, CoR), H+10 untuk drill-down lengkap. KRI yang tersedia H+30 = <strong>sejarah</strong>, bukan monitoring. Investasi di otomasi data = investasi di kecepatan keputusan. Analis yang menunggu data 30 hari = analis yang selalu terlambat.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Monitoring KRI di Indonesia punya ritme regulasi dan praktik yang spesifik.</p>

      <h3>Laporan Berkala ke OJK: Radar Regulator</h3>
      <p>Bank umum Indonesia wajib menyampaikan <strong>laporan berkala</strong> ke OJK — termasuk kualitas aset (kolektibilitas, NPL), permodalan (KPMM), dan profil risiko. Artinya: KRI yang kamu pantau internal <strong>juga dibaca OJK</strong> — dengan pembanding antarbank. Bank yang NPL-nya 4% saat rata-rata industri 2,5% akan mendapat "surat cinta" OJK: penjelasan tertulis + rencana aksi. Analis yang menyiapkan KRI internal sebaiknya selalu menyiapkan <strong>narasi pembanding industri</strong> — karena itulah yang ditanyakan pertama.</p>

      <h3>Ambang 5%: Garis Psikologis Nasional</h3>
      <p>OJK memberi perhatian khusus pada bank dengan <strong>NPL gross &gt;5%</strong> — bukan sekadar angka, melainkan <strong>ambang psikologis</strong> yang memicu pengawasan intensif. Bank yang mendekati 5% biasanya melakukan "manajemen NPL" agresif: mempercepat write-off, restrukturisasi, atau penjualan kredit macet (<em>loan sale</em>) ke perusahaan pembiayaan/distressed fund. Analis harus bisa membedakan <strong>perbaikan fundamental</strong> (debitur sembuh) dari <strong>perbaikan kosmetik</strong> (NPL dipindah ke tempat lain) — keduanya menurunkan angka, hanya satu yang menyehatkan.</p>

      <h3>CoR sebagai Bahasa Laba</h3>
      <p>Di Indonesia, <strong>Cost of Risk</strong> adalah metrik yang paling diperhatikan analis saham perbankan: CoR 1,4% vs 2,0% bisa menjadi selisih <strong>rekomendasi beli vs jual</strong>. Mengapa? Karena CoR langsung menerjemahkan risiko menjadi laba — bahasa yang dimengerti investor. Analis risiko yang bisa menjelaskan "mengapa CoR naik" dalam bahasa investor (bukan bahasa DPD) menjadi <strong>jembatan</strong> antara divisi risiko dan pasar modal — peran yang langka dan mahal.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: membaca dashboard 30 detik (klik untuk buka)</summary>
        <p>Dashboard Q3 Bank Nusantara: NPL gross 2,8% 🟢 (appetite &lt;5%) | NPL net 0,9% 🟢 | Coverage 68% 🟢 | CoR 1,6% 🔴 (appetite ≤1,5%) | DPK 7,5% 🟡 (naik dari 5,8% dua kuartal lalu).</p>
        <p><strong>Langkah 1 — apa yang merah?</strong> CoR 1,6% — melanggar appetite 2 kuartal berturut-turut.<br />
        <strong>Langkah 2 — trennya ke mana?</strong> DPK naik 5,8% → 7,5% — <strong>leading indicator</strong> memburuk; NPL (lagging) masih tenang.<br />
        <strong>Langkah 3 — cerita lengkapnya:</strong> bank terlihat sehat di kaca spion (NPL 2,8%), tetapi kaca depan menunjukkan badai: DPK menggelembung → NPL akan naik 2 kuartal lagi → CoR sudah naik duluan (CKPN antisipatif via PSAK 71!).<br />
        <strong>Langkah 4 — aksi:</strong> eskalasi ke komite <strong>sekarang</strong> (lampu merah 2 periode = wajib), drill-down DPK per segmen/vintage, siapkan penambahan CKPN.</p>
        <p><strong>Pelajaran:</strong> 30 detik, 4 langkah — dari angka ke keputusan. Itulah dashboard yang bekerja.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NPL di bawah 5% = semua aman."</strong></p>
        <p><strong>Yang benar:</strong> NPL adalah <strong>lagging indicator</strong> — ia menceritakan 6–12 bulan yang lalu. Bank bisa punya NPL 2,8% yang "aman" sementara DPK-nya menggelembung dan CoR-nya melanggar appetite — badai yang belum tiba. "Aman" hanya boleh disimpulkan setelah membaca <strong>leading indicator</strong> (DPK, CoR, vintage, flow rate).</p>
      </div>

      <h2 id="case">📋 Mini-Case: Dashboard Hijau, Bank Berdarah</h2>
      <div className="callout">
        <p>Laporan tahunan Bank Nusantara: <strong>"NPL 2,8% — di bawah rata-rata industri 3,1%. Kinerja risiko sangat baik."</strong> Kamu diminta second opinion. Temuanmu:</p>
        <ul>
          <li>CoR: <strong>2,3%</strong> (industri 1,2%) — hampir 2× lipat!</li>
          <li>Write-off tahun ini: <strong>Rp 1,2 T</strong> (tahun lalu Rp 300 M) — NPL "dibersihkan" agresif.</li>
          <li>DPK naik 5% → 8% dalam setahun.</li>
          <li>Coverage turun 75% → 55% (CKPN dipakai untuk write-off).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apakah klaim "sangat baik" valid? Tulis penilaian 3 poin.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tidak valid — cherry-picking NPL.</strong> Tiga poin:</p>
          <p>(1) <strong>NPL cantik karena write-off</strong>, bukan karena debitur sembuh: Rp 1,2 T dibersihkan (4× tahun lalu). NPL gross "asli" (tanpa write-off) ≈ 5%+.<br />
          (2) <strong>CoR 2,3% vs industri 1,2%</strong> — bank membayar <strong>2× lipat</strong> "harga risiko" dibanding peers. Laba tergerus diam-diam.<br />
          (3) <strong>DPK naik + coverage turun</strong> — masalah masa depan membesar sementara bantal menipis. Kombinasi terburuk.</p>
          <p>Kesimpulan: <strong>dashboard yang hanya menampilkan NPL = cermin menipu</strong>. Lima KRI harus dibaca bersama — dan analis yang jujur tidak membiarkan satu metrik cantik menutupi empat yang berdarah.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: CoR Melanggar, NPL Tenang — Apa Artinya?</h2>
      <div className="callout">
        <p>Bank Nusantara Q2–Q3 2026:</p>
        <ul>
          <li>NPL gross: 2,7% → 2,8% (stabil, di bawah appetite 5%).</li>
          <li>CoR: 1,3% → 1,7% (melanggar appetite 1,5%!).</li>
          <li>DPK: 6,0% → 7,2%. Coverage: 70% → 75%.</li>
          <li>Direktur keuangan bingung: "NPL stabil kok beban cadangan naik? Ada yang salah dengan model ECL?"</li>
        </ul>
        <p><strong>Pertanyaan:</strong> jelaskan paradoks ini. Apakah model ECL salah? Apa yang harus dilakukan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tidak ada paradoks — ini PSAK 71 bekerja dengan benar.</strong> CoR naik karena <strong>ECL forward-looking</strong>: DPK naik (leading) + prakiraan ekonomi memburuk → SICR massal → migrasi Stage 1→2 → ECL melonjak — <strong>sebelum</strong> NPL bergerak. NPL (lagging) masih tenang karena DPK belum "jatuh". Coverage naik 70%→75% mengonfirmasi: bank <strong>menambah bantal</strong> antisipatif.</p>
          <p><strong>Model tidak salah — ia justru jujur lebih awal.</strong> Yang salah adalah ekspektasi direktur bahwa "NPL stabil = cadangan stabil" — itu logika era PSAK 55 (incurred loss). Di era PSAK 71, <strong>cadangan bergerak mendahului NPL</strong>.</p>
          <p><strong>Aksi:</strong> (1) jelaskan ke direksi dengan bahasa leading/lagging (bukan rumus); (2) drill-down DPK — segmen mana yang memburuk? (3) pastikan CoR kembali ke appetite dalam 2 kuartal via aksi (collection, limit) — atau revisi appetite dengan persetujuan komisaris jika perburukan struktural. Jangan "memperbaiki" model agar CoR turun — itu <em>earnings management</em>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Beban CKPN tahunan Rp 700 M, rata-rata total kredit Rp 50 T. Cost of risk?"
        options={[
          "1,4%",
          "0,7%",
          "14%",
          "7%",
        ]}
        correct={0}
        explanation="Benar: 700/50.000 = 1,4%. Artinya tiap Rp 100 kredit 'dimakan' Rp 1,4 cadangan per tahun."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. NPL 2,8% (rendah) tapi CoR 2,3% (tinggi, 2× industri). Interpretasi?"
        options={[
          "Bank sehat — NPL rendah",
          "Waspada: bank mencadangkan agresif untuk masalah yang belum jadi NPL (atau write-off besar membersihkan NPL) — baca CoR + DPK + write-off",
          "CoR tidak penting",
          "Pasti salah hitung",
        ]}
        correct={1}
        explanation="Benar: kombinasi ini = red flag. NPL lagging bisa 'dibersihkan'; CoR leading menunjukkan harga sebenarnya. Selidiki write-off & DPK."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. KRI mana yang merupakan LEADING indicator?"
        options={[
          "NPL gross",
          "DPK (Kolek 2) & Cost of Risk — mencerminkan masalah masa depan sebelum jadi NPL",
          "Coverage ratio",
          "Tidak ada",
        ]}
        correct={1}
        explanation="Benar: DPK = ruang tunggu NPL; CoR = harga antisipasi. NPL = akibat yang datang belakangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. CoR menembus appetite 2 kuartal berturut-turut. Tindakan governance yang benar?"
        options={[
          "Tunggu kuartal ketiga — mungkin musiman",
          "Eskalasi wajib ke komite risiko dengan bedah sebab + proyeksi dampak + action plan",
          "Ubah appetite agar tidak merah",
          "Sembunyikan dari laporan",
        ]}
        correct={1}
        explanation="Benar: eskalasi + action plan. 'Mungkin musiman' bukan respons governance. (Opsi 3 = memanipulasi ambang!)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dashboard ideal untuk direksi harus?"
        options={[
          "Menampilkan 50 metrik lengkap",
          "Menjawab 3 pertanyaan dalam 30 detik (apa merah, tren ke mana, siapa bertindak) + tren + drill-down + eskalasi otomatis",
          "Hanya menampilkan yang hijau",
          "Tanpa warna — angka saja",
        ]}
        correct={1}
        explanation="Benar: dashboard = alat keputusan, bukan arsip. 50 metrik = tidak ada yang dibaca. Warna + tren + aksi."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. NPL stabil 2,8% tetapi DPK naik 5,8%→7,5% dan CoR melanggar appetite. Interpretasi yang benar?"
        options={[
          "Aman — NPL di bawah 5%",
          "Waspada: leading indicator (DPK, CoR) memburuk — NPL (lagging) akan menyusul 1–2 kuartal lagi; eskalasi sekarang",
          "Model ECL rusak",
          "Kurangi CKPN agar CoR turun",
        ]}
        correct={1}
        explanation="Benar: baca kaca depan, bukan cuma spion. DPK menggelembung + CoR naik = badai 1–2 kuartal ke depan (atau evergreening yang disembunyikan — selidiki!). Eskalasi mengikuti aturan: lampu merah 2 periode = wajib komite."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Mengapa risk appetite yang dilanggar 2 periode berturut-turut wajib dieskalasi ke komite (bukan 'nanti')?"
        options={[
          "Formalitas saja",
          "Appetite adalah janji direksi ke komisaris/OJK — pelanggaran berulang tanpa aksi = janji dilanggar; eskalasi memaksa keputusan (aksi korektif atau revisi appetite resmi)",
          "Agar rapat ada bahasan",
          "OJK menghitung jumlah rapat",
        ]}
        correct={1}
        explanation="Benar: appetite = janji, bukan hiasan. Eskalasi otomatis mencegah 'nanti' yang tidak pernah datang. Pilihannya jelas: perbaiki (aksi) atau ubah janjinya secara resmi (revisi appetite via komisaris) — bukan diam."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>5 KRI</strong>: NPL gross, NPL net, coverage, cost of risk, DPK.</li>
          <li><strong>CoR = beban CKPN / total kredit</strong> — "harga" risiko yang langsung memakan laba.</li>
          <li><strong>Leading (DPK, CoR) vs lagging (NPL)</strong> — baca keduanya, bertindak dari leading.</li>
          <li><strong>Merah 2× = eskalasi wajib</strong> + action plan.</li>
          <li><strong>Dashboard 30 detik</strong>: warna, tren, drill-down, eskalasi.</li>
          <li>Kapan TIDAK percaya dashboard: hanya 1 metrik ditampilkan (cherry-picking) — minta lima-limanya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr19-validasi-model" className="btn btn-secondary btn-sm">← CR19</Link>
        <Link href="/learn/cr21-pricing-risiko" className="btn btn-primary btn-sm">Next: CR21 →</Link>
      </div>
    </div>
  );
}
