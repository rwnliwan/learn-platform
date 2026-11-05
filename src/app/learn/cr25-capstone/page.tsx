"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr25Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(8);
  const ratioTrendData = [
    {
      x: ["2023", "2024", "2025"],
      y: [1.8, 1.5, 1.2],
      type: "scatter",
      mode: "lines+markers",
      name: "Current ratio",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: ["2023", "2024", "2025"],
      y: [2.1, 2.6, 3.2],
      type: "scatter",
      mode: "lines+markers",
      name: "DER",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["2023", "2024", "2025"],
      y: [8.2, 6.1, 4.3],
      type: "scatter",
      mode: "lines+markers",
      name: "Interest coverage",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const waterfallData = [
    {
      x: ["EBITDA", "Pajak", "Capex", "Δ Modal kerja", "Arus kas bebas", "Bunga", "Sisa utang"],
      y: [45, -8, -15, -12, 10, -18, -8],
      type: "bar",
      marker: { color: ["#3aa655", "#ef9244", "#ef9244", "#ef9244", "#2a7de1", "#ef4444", "#991b1b"] },
      text: ["45", "−8", "−15", "−12", "10", "−18", "−8"],
      textposition: "outside",
    },
  ];

  const eclWaterfallData = [
    {
      x: ["EAD", "× PD", "= EL kotor", "LGD adj.", "ECL final"],
      y: [50, 0, 0, 0, 0],
      type: "bar",
      marker: { color: "#94a3b8" },
      text: ["Rp 50 M"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: CAPSTONE — Analisis PT Sinar Abadi dari NOL
# Kamu menerima paket kredit. Kerjakan SEMUA langkah analis:
# 1) Rasio 2) PD 3) ECL 4) Pricing 5) Keputusan.
# Data keuangan PT Sinar Abadi (Rp Miliar):
aset_lancar, liab_lancar = 120, 100
total_utang, ekuitas = 320, 100
ebitda, beban_bunga = 45, 10.5
laba_bersih = 8
arus_kas_operasi = 10

# --- LANGKAH 1: Rasio (CR17a) ---
cr = aset_lancar / liab_lancar
der = total_utang / ekuitas
icr = ebitda / beban_bunga
print("== LANGKAH 1: RASIO ==")
print(f"Current ratio     : {cr:.2f}  {'OK' if cr>1.2 else 'LEMAH'}")
print(f"DER               : {der:.2f}x {'BERBAHAYA' if der>2.5 else 'OK'}")
print(f"Interest coverage : {icr:.1f}x {'mepet' if icr<3 else 'OK'}")
print()
# --- LANGKAH 2: PD dari rating internal (CR17b) ---
# Mapping: ICR<2 -> CCC (PD 8%), 2-4 -> B (PD 4%), 4-7 -> BB (PD 1.5%), >7 -> BBB (PD 0.5%)
pd = 0.08 if icr<2 else 0.04 if icr<4 else 0.015 if icr<7 else 0.005
rating = "CCC" if icr<2 else "B" if icr<4 else "BB" if icr<7 else "BBB"
print(f"== LANGKAH 2: RATING & PD ==\nRating internal: {rating}, PD 12 bln: {pd:.1%}")
print()
# --- LANGKAH 3: ECL (CR14) ---
ead, lgd = 50, 0.45
ecl = ead * pd * lgd
print(f"== LANGKAH 3: ECL ==\nEAD Rp {ead} M x PD {pd:.1%} x LGD {lgd:.0%} = Rp {ecl:.2f} M")
print()
# --- LANGKAH 4: Pricing (CR21) ---
cof, opex = 6.0, 1.5
el_pct = pd * lgd * 100
biaya_modal = 8.0 * 18 / 100
bunga_min = cof + opex + el_pct + biaya_modal + 1.0
print(f"== LANGKAH 4: PRICING ==\nBunga minimum: {bunga_min:.2f}%")
print()
print("== LANGKAH 5: KEPUTUSAN (tulis di memo, Lab 2) ==")
print("Pertanyaan: DER 3.2x + ICR 4.3x + arus kas bebas hanya 10 M.")
print("Apakah bunga minimum cukup mengkompensasi? Syarat apa yang dipasang?")`;

  const lab2Code = `# Lab 2: GENERATOR MEMO KREDIT — deliverable capstone
# Memo kredit = produk kerja analis (CR17b). Template ini memastikan
# tidak ada bagian yang lupa. Isi, lalu salin jadi dokumenmu.
memo = {
    "nasabah": "PT Sinar Abadi (distributor FMCG, Jawa Timur)",
    "permohonan": "KMK Rp 50 M, tenor 12 bulan, revolving",
    "tujuan": "Modal kerja musiman (Lebaran & akhir tahun)",
    "analisis_keuangan": [
        "Current ratio 1.20x — likuiditas mepet, tren turun 3 thn",
        "DER 3.20x — leverage BERBAHAYA (>2.5x)",
        "Interest coverage 4.3x — mampu bayar bunga, tapi buffer tipis",
        "Arus kas operasi Rp 10 M — hanya 20% dari plafon diminta",
    ],
    "risiko_utama": [
        "1. Leverage tinggi: guncangan penjualan -> gagal bayar",
        "2. Konsentrasi pelanggan: 40% penjualan ke 2 modern market",
        "3. Siklus musiman: kebutuhan KMK melonjak 2x saat peak",
    ],
    "mitigasi": [
        "Agunan: piutang + persediaan (fidusia), coverage 120%",
        "Covenant: DER <= 3.0x, diuji kuartalan",
        "Pencairan bertahap sesuai musim (tidak sekaligus 50 M)",
    ],
    "parameter": "Rating BB | PD 1.5% | LGD 45% | ECL Rp 0.34 M | Bunga min 11.7%",
    "rekomendasi": "SETUJU BERSYARAT: plafon Rp 35 M (bukan 50 M), tenor 12 bln, covenant DER, agunan fidusia 120%",
}
print("=" * 60)
print("MEMO KREDIT — KOMITE (ringkas)")
print("=" * 60)
for k, v in memo.items():
    print(f"\n[{k.upper().replace('_',' ')}]")
    if isinstance(v, list):
        for item in v: print(f"  - {item}")
    else: print(f"  {v}")
print("\n" + "=" * 60)
print("Tugas: ubah 'rekomendasi' jadi versimu (setuju/tolak/bersyarat)")
print("dengan 3 alasan. Inilah deliverable yang dinilai komite.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR25 — Credit Risk Analyst · CAPSTONE</span>
        <h1 className="display-title">Capstone: Analisis Kredit<br />End-to-End + Memo Kredit</h1>
        <div className="meta">60–90 menit (studi kasus penuh) &bull; 2 lab &bull; 8 quiz &bull; 1 deliverable</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Berkas di Meja</a></li>
          <li><a href="#brief">Brief Kasus: PT Sinar Abadi</a></li>
          <li><a href="#langkah1">Langkah 1–2: Rasio &amp; Rating/PD</a></li>
          <li><a href="#langkah3">Langkah 3: ECL &amp; Staging</a></li>
          <li><a href="#langkah4">Langkah 4: Pricing &amp; Struktur</a></li>
          <li><a href="#lab1">🔬 Lab 1: Analisis End-to-End</a></li>
          <li><a href="#lab2">🔬 Lab 2: Generator Memo Kredit</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Framework Komite</a></li>
          <li><a href="#realita">🏛️ Dari Kelas ke Ruang Komite</a></li>
          <li><a href="#case">📋 Deliverable: Memo Kredit Final</a></li>
          <li><a href="#quiz">✏️ Quiz (8 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman Track</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengintegrasikan CR1–CR24 dalam satu analisis kredit korporasi end-to-end.</li>
          <li>Menghitung rasio → rating/PD → ECL → pricing → rekomendasi dari data mentah.</li>
          <li>Menyusun memo kredit profesional sebagai deliverable komite.</li>
          <li>Mempertahankan rekomendasi dengan argumen risiko vs mitigasi.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Berkas di Meja</h2>
      <div className="story">
        <p>Senin pagi, 08:00. Di mejamu: <strong>berkas aplikasi kredit</strong> PT Sinar Abadi — distributor FMCG Jawa Timur, plafon <strong>Rp 50 miliar</strong>. Relationship manager sudah janji ke nasabah: <em>"Pasti cair minggu ini."</em> Komite kredit: <strong>Kamis</strong>. Kamu punya 4 hari.</p>
        <p>Berkasnya tebal: 3 tahun laporan keuangan, proyeksi, daftar agunan, SLIK. Di sinilah <strong>24 lesson</strong> diuji — bukan sebagai teori, melainkan sebagai <strong>alat kerja</strong>: rasio (CR17a), rating (CR17b), PD/LGD (CR3, CR10, CR12), ECL (CR14), pricing (CR21), regulasi (CR23), memo (CR17b).</p>
        <p><strong>Twist-nya:</strong> RM berbisik: <em>"Nasabah ini penting. Tolong dibuat bagus."</em> Di sinilah integritas analis diuji — <strong>sebelum</strong> angka-angkanya. Lesson ini mensimulasikan persis itu: kamu mengerjakan analisisnya, lalu <strong>mempertahankan</strong> rekomendasimu. Selamat datang di pekerjaanmu.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="brief">Brief Kasus: PT Sinar Abadi</h2>
      <p><strong>Fakta dasar</strong> (dari berkas):</p>
      <ul>
        <li>Distributor FMCG, Surabaya; berdiri 2008; 180 karyawan.</li>
        <li>Permohonan: <strong>KMK Rp 50 M</strong>, tenor 12 bulan, revolving — modal kerja musiman.</li>
        <li>Penjualan Rp 420 M (2025); 40% ke 2 jaringan modern market.</li>
        <li>Agunan: piutang + persediaan (fidusia), nilai Rp 60 M.</li>
        <li>SLIK: kolek 1, tidak ada tunggakan historis.</li>
      </ul>
      <p><strong>Keuangan 3 tahun (Rp Miliar):</strong></p>
      <ul>
        <li>Aset lancar 150 → 135 → <strong>120</strong>; liabilitas lancar 83 → 90 → <strong>100</strong>.</li>
        <li>Total utang 294 → 312 → <strong>320</strong>; ekuitas 140 → 120 → <strong>100</strong>.</li>
        <li>EBITDA 57 → 51 → <strong>45</strong>; beban bunga 7 → 8,4 → <strong>10,5</strong>.</li>
        <li>Arus kas operasi: 28 → 18 → <strong>10</strong>.</li>
      </ul>
      <p><strong>Kepribadian kasus:</strong> seperti <strong>pasien yang terlihat sehat</strong> — masih jalan, masih bicara — tapi hasil lab menunjukkan <strong>tren memburuk 3 tahun</strong> di semua parameter. Analis yang hanya membaca "tahun terakhir" akan lolos; yang membaca <strong>tren</strong> akan waspada.</p>

      <h2 id="langkah1">Langkah 1–2: Rasio &amp; Rating/PD</h2>

      <PlotlyChart
        data={ratioTrendData}
        title="Tren Rasio PT Sinar Abadi (2023–2025)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Rasio" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga garis = current ratio (biru), DER (merah), interest coverage (kuning).</p>
        <p><strong>Interpretasi:</strong> <strong>semua memburuk</strong>: likuiditas 1,8→1,2 (mepet), DER 2,1→3,2 (berbahaya, &gt;2,5), coverage 8,2→4,3 (buffer menipis). <strong>Tren 3 tahun &gt; 1 titik:</strong> ini bukan fluktuasi — ini <strong>struktur yang memburuk</strong>. Rating internal: <strong>BB</strong> (dari ICR 4,3x), PD 12 bulan <strong>1,5%</strong>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> satu tahun = foto; tiga tahun = film. <strong>Kredit adalah pertaruhan tentang masa depan</strong> — dan masa depan paling baik diprediksi dari <strong>arah</strong>, bukan posisi. DER yang naik 3 tahun = perusahaan yang <strong>memakan ekuitasnya sendiri</strong>.</p>
      </div>

      <h2 id="langkah3">Langkah 3: ECL &amp; Staging</h2>
      <p><strong>Parameter:</strong> EAD Rp 50 M (plafon penuh, KMK revolving → CCF tinggi), PD 1,5%, LGD 45% (agunan fidusia piutang/persediaan — likuiditas sedang).</p>
      <Tex math={String.raw`\text{ECL}_{12m} = 50 \times 1{,}5\% \times 45\% = \text{Rp } 0{,}34 \text{ M}`} block />
      <p><strong>Staging (CR14a):</strong> SLIK kolek 1, tidak ada SICR → <strong>Stage 1</strong> (ECL 12 bulan). <strong>Tapi</strong>: tren memburuk 3 tahun = <strong>watchlist</strong> — tetapkan <strong>pemicu SICR</strong> eksplisit: DER &gt;3,5x atau coverage &lt;3x → pindah Stage 2 (lifetime ECL ≈ Rp 1,5 M+). Tulis di memo.</p>

      <PlotlyChart
        data={waterfallData}
        title="Cash Waterfall PT Sinar Abadi 2025 (Rp Miliar)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Rp Miliar" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dari EBITDA (45) dikurangi pajak, capex, modal kerja → arus kas bebas (10) → bayar bunga (18) → sisa (−8).</p>
        <p><strong>Interpretasi:</strong> <strong>sisa NEGATIF Rp 8 M</strong> — arus kas bebas (10) tidak cukup menutup bunga (18)! Perusahaan <strong>membayar bunga dari... apa?</strong> Kemungkinan: menarik utang baru / menunda bayar supplier. <strong>Ini red flag terbesar kasus ini</strong> — lebih penting dari semua rasio. KMK Rp 50 M akan menjadi <strong>oksigen</strong> — atau <strong>candu</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Laba positif = bisa bayar utang."</strong></p>
        <p><strong>Yang benar:</strong> laba bersih Rp 8 M tapi <strong>arus kas bebas minus</strong> — bunga Rp 10,5 M dibayar dari kas operasi Rp 10 M yang <strong>hampir habis</strong>. <strong>Utang dibayar dengan kas, bukan dengan laba.</strong> Cash waterfall (CR17b) adalah kebenaran terakhir.</p>
      </div>

      <h2 id="langkah4">Langkah 4: Pricing &amp; Struktur</h2>
      <p><strong>Bunga minimum</strong> (CR21): CoF 6% + opex 1,5% + EL (1,5%×45% = 0,68%) + biaya modal (8%×18% = 1,44%) + margin 1% = <strong>~10,6%</strong>. Pasar KMK korporasi menengah: 10–12% → <strong>ajukan 11,5%</strong> (buffer di atas minimum).</p>
      <p><strong>Struktur mitigasi:</strong></p>
      <ul>
        <li><strong>Plafon Rp 35 M</strong> (bukan 50 M) — selaras dengan arus kas (kas operasi 10 M tidak menopang 50 M).</li>
        <li><strong>Pencairan bertahap</strong> mengikuti musim (peak Lebaran/akhir tahun).</li>
        <li><strong>Covenant:</strong> DER ≤3,0x + coverage ≥3,5x, diuji kuartalan → pelanggaran = renegosiasi.</li>
        <li><strong>Agunan:</strong> fidusia piutang + persediaan, coverage 120%, asuransi.</li>
        <li><strong>Pemicu SICR</strong> eksplisit untuk staging.</li>
      </ul>
      <p><strong>Kepribadian:</strong> struktur seperti <strong>helm + sabuk pengaman</strong> — bukan karena kamu yakin akan kecelakaan, melainkan karena <strong>kamu tidak bisa yakin tidak akan</strong>. Analis yang baik bukan yang menghindari risiko, melainkan yang <strong>memberi harga dan pagar</strong> pada risiko.</p>

            <h3>🎯 Intuisi Lanjutan: Dari Pelajaran ke Profesi</h3>
      <p>Dua puluh empat lesson sebelumnya mengajarkan <strong>alat</strong> — capstone mengajarkan <strong>pekerjaan</strong>. Perbedaannya: alat menjawab "bagaimana menghitung", pekerjaan menjawab "apa yang harus kulakukan <strong>Senin pagi</strong> dengan tumpukan berkas di meja". Tiga hal yang membedakan analis profesional dari lulusan kursus: (1) <strong>prioritas</strong> — tahu mana yang dihitung dulu saat waktu terbatas (urutan: SLIK → BMPK → KPMM → 5C → rasio → tren → kas); (2) <strong>keberanian</strong> — berani menulis "TOLAK" saat data berkata tolak, meski RM menekan; (3) <strong>narasi</strong> — mengubah angka menjadi cerita yang bisa diputuskan direksi. <strong>Alat tanpa ketiganya = teknisi; alat dengan ketiganya = analis.</strong></p>
      <p>Intuisi kedua: <strong>integritas adalah satu-satunya aset yang tidak bisa direstrukturisasi</strong>. Sekali analis ketahuan "membuat bagus" — angkanya tidak akan pernah dipercaya lagi, oleh siapapun. Karir 30 tahun bisa hancur oleh satu memo yang tidak jujur. Tekanan akan selalu ada (RM, nasabah, target) — dan justru itulah <strong>ujian profesi</strong>: analis dibayar bukan untuk menyenangkan, melainkan untuk <strong>benar</strong>. "Dibuat bagus" yang ketahuan = karir selesai; "ditolak dengan jujur" yang ternyata benar = reputasi terbangun.</p>
      <p>Intuisi ketiga — peta jalan karir: track ini memberimu <strong>fondasi teknis</strong> (PD/LGD/EAD, ECL, RAROC, validasi). Langkah berikutnya yang konkret: (1) <strong>sertifikasi BSMR</strong> level 1–2 (diakui industri Indonesia); (2) <strong>portofolio SQL/Python</strong> — analisis vintage/roll rate dari data nyata (skill yang paling dicari lowongan); (3) <strong>magang/asisten analis</strong> — pengalaman membaca berkas nyata tidak tergantikan. <strong>Belajar tidak berhenti di lesson 25 — ia baru mulai.</strong></p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Analisis End-to-End</h2>
      <p>Lima langkah analis dalam satu skrip — dari rasio hingga keputusan.</p>
      <PyodideLab
        title="Lab 1 — Capstone: 5 Langkah Analisis"
        hint="Jalankan, pahami tiap langkah. Coba skenario stres: ebitda 45 → 30 (penjualan turun 20%). Bagaimana ICR, rating, PD, ECL, bunga minimum berubah? Inilah stress testing mini (CR16)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Generator Memo Kredit</h2>
      <p>Template memo — deliverable yang dibawa ke komite Kamis.</p>
      <PyodideLab
        title="Lab 2 — Memo Kredit"
        hint="Ubah bagian 'rekomendasi' jadi versimu sendiri: setuju / tolak / bersyarat — dengan 3 alasan. Bandingkan dengan contoh. Tidak ada jawaban tunggal yang benar; yang dinilai = KONSISTENSI argumen dengan data."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Framework Komite</h2>

      <div className="decision-card">
        <h3>1. Integritas dulu → <strong>tolak "dibuat bagus"</strong></h3>
        <p><strong>Kondisi:</strong> tekanan RM/nasabah.</p>
        <p><strong>Aksi:</strong> analisis apa adanya. Reputasi analis = <strong>satu-satunya aset</strong> yang tidak bisa di-restrukturisasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Tren &gt; titik → <strong>nilai arah 3 tahun</strong></h3>
        <p><strong>Kondisi:</strong> selalu.</p>
        <p><strong>Aksi:</strong> semua memburuk = waspada struktural, bukan fluktuasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Kas &gt; laba → <strong>cash waterfall memutuskan</strong></h3>
        <p><strong>Kondisi:</strong> laba positif tapi kas minus.</p>
        <p><strong>Aksi:</strong> selidiki dari mana bunga dibayar. KMK untuk <strong>likuiditas sementara</strong> = OK; untuk <strong>menutup lubang struktural</strong> = tolak.</p>
      </div>

      <div className="decision-card">
        <h3>4. Harga + pagar → <strong>jangan tolak mentah jika bisa distruktur</strong></h3>
        <p><strong>Kondisi:</strong> risiko teridentifikasi tapi termitigasi.</p>
        <p><strong>Aksi:</strong> plafon lebih kecil + covenant + agunan + pricing tepat = <strong>setuju bersyarat</strong> lebih baik dari tolak (bisnis tetap jalan, risiko terkendali).</p>
      </div>

            <div className="decision-card">
        <h3>5. Lulus track ini — apa selanjutnya? → <strong>30-60-90 hari pertama sebagai analis</strong></h3>
        <p><strong>Kondisi:</strong> kamu menyelesaikan 25 lesson. Ilmu ada — pengalaman belum. Tiga bulan pertama menentukan.</p>
        <p><strong>Rencana 30-60-90:</strong></p>
        <p><strong>30 hari — jadi spons:</strong> pelajari <strong>portofolio bank barumu</strong> (segmen apa? NPL berapa? vintage bagaimana?), kenali <strong>template memo</strong> bank itu (setiap bank punya formatnya), dan bangun hubungan dengan <strong>RM</strong> (mereka sumber informasi — dan sumber tekanan; kenali keduanya). Jangan sok tahu — <strong>dengarkan dulu</strong>.</p>
        <p><strong>60 hari — kirim sinyal:</strong> tulis <strong>1 memo yang sangat bagus</strong> (lengkap: fakta → risiko → mitigasi → rekomendasi + RAROC + covenant). Satu memo brilian lebih berharga dari 10 memo biasa — ia menjadi <strong>reputasi awalmu</strong>. Sambil itu: mulai <strong>sertifikasi BSMR level 1</strong>.</p>
        <p><strong>90 hari — bangun sistem:</strong> buat <strong>dashboard KRI pribadimu</strong> untuk portofolio yang kamu pegang (NPL, DPK, CoR, vintage per segmen). Analis yang datang ke komite dengan dashboard sendiri = analis yang <strong>dipercaya</strong>. Pada titik ini, kamu bukan lagi "anak baru" — melainkan "analis yang pegang datanya".</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik (seluruh track)</h3>
        <ol>
          <li><strong>SLIK → BMPK → KPMM</strong> sebelum analisis.</li>
          <li><strong>5C → rasio → tren → kas.</strong></li>
          <li><strong>PD × LGD × EAD → ECL → staging.</strong></li>
          <li><strong>RAROC ≥ hurdle → harga.</strong> Limit untuk konsentrasi.</li>
          <li><strong>Monitor: 5 KRI, merah 2× = eskalasi.</strong></li>
          <li><strong>Memo: fakta → risiko → mitigasi → rekomendasi.</strong></li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Checklist Memo Kredit Sempurna: 10 Elemen</h3>
      <p>Memo kredit adalah 'produk akhir' analis. Sepuluh elemen ini = standar memo yang lolos komite — dan membangun reputasimu.</p>
      <ol>
        <li><strong>1. Ringkasan eksekutif (½ halaman)</strong> — Keputusan yang diusulkan + 3 alasan utama + angka kunci (plafon, tenor, bunga, RAROC). Direksi membaca ini dulu — kadang HANYA ini.</li>
        <li><strong>2. Fakta debitur</strong> — Siapa, apa bisnisnya, sejak kapan, siapa pemiliknya. Faktual, terverifikasi — bukan 'katanya'.</li>
        <li><strong>3. Analisis 5C</strong> — Character (SLIK!), Capacity (DSCR dari kas), Capital, Collateral (nilai likuidasi!), Conditions. Berurutan, lengkap.</li>
        <li><strong>4. Analisis keuangan</strong> — Rasio 3 tahun + tren + arus kas vs laba. Tabel rapi, tren jelas, red flag ditandai.</li>
        <li><strong>5. Tiga risiko utama</strong> — Bukan 10 — tiga. Yang paling mungkin membunuh pembayaran kembali. Jujur, spesifik, dengan probabilitas.</li>
        <li><strong>6. Mitigasi per risiko</strong> — Setiap risiko punya mitigasi: covenant, agunan, struktur, pricing. Risiko tanpa mitigasi = alasan tolak.</li>
        <li><strong>7. Kepatuhan</strong> — SLIK ✓, BMPK ✓, KPMM/appetite ✓, regulasi produk ✓. Satu halaman — tetapi wajib.</li>
        <li><strong>8. Parameter (PD/LGD/EAD → ECL → RAROC)</strong> — Angka risiko + harga. RAROC vs hurdle = vonis ekonomi.</li>
        <li><strong>9. Struktur yang diusulkan</strong> — Plafon, tenor, pencairan bertahap, covenant (lengkap dengan definisi!), agunan, pricing.</li>
        <li><strong>10. Rekomendasi + tanda tangan</strong> — Setuju / tolak / bersyarat — <strong>dengan nama terang</strong>. Memo tanpa rekomendasi tegas = bukan memo, melainkan esai.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> cetak 10 elemen ini sebagai template. Setiap memo yang kamu tulis mengikuti urutan ini — konsisten, lengkap, dan <strong>berani</strong>.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Memo ditolak komite — apakah aku gagal?</summary>
        <p><strong>Tidak</strong> — memo yang jujur dan ditolak (dengan alasan bisnis yang valid) = <strong>pekerjaan yang benar</strong>. Yang gagal = memo yang 'dibuat bagus' lalu macet 2 tahun kemudian. Reputasi analis dibangun dari <strong>kejujuran yang konsisten</strong>, bukan dari approval rate 100%.</p>
      </details>
      <details className="worked">
        <summary>❓ RM marah karena aku menolak pengajuannya — bagaimana?</summary>
        <p><strong>Profesional, bukan personal.</strong> Jelaskan dengan data (bukan emosi), tawarkan struktur alternatif jika memungkinkan, dan dokumentasikan. RM yang baik akan menghargai analis yang <strong>konsisten</strong> — karena ia tahu analis itu tidak akan 'meloloskan' pengajuan bermasalah kompetitor juga. <strong>Ketegasan yang adil = dihormati.</strong></p>
      </details>
      <details className="worked">
        <summary>❓ Gaji analis risiko — apakah sepadan?</summary>
        <p><strong>Ya, dan tumbuh.</strong> Entry: UMR+ hingga belasan juta (bank besar). 5 tahun + BSMR: 2–3× lipat. CRO bank menengah: ratusan juta/bulan. Tetapi yang lebih penting: <strong>skill-nya transferable</strong> (fintech, konsultan, regulator, multifinance) — dan <strong>tidak bisa diotomatisasi penuh</strong> (judgment + integritas). Karir yang defensif di era AI.</p>
      </details>
      <details className="worked">
        <summary>❓ AI akan menggantikan analis kredit?</summary>
        <p><strong>Menggantikan sebagian, memperkuat sebagian.</strong> Yang tergantikan: hitung rasio, tarik SLIK, monitoring rutin (otomatisasi). Yang TIDAK tergantikan: <strong>judgment</strong> (kasus abu-abu), <strong>negosiasi</strong> (covenant, restrukturisasi), <strong>integritas</strong> (berani tolak), dan <strong>tanggung jawab</strong> (tanda tangan memo). Analis yang hanya 'menghitung' = terancam; analis yang 'memutuskan' = aman. <strong>Jadilah yang memutuskan.</strong></p>
      </details>

            {/* 10. MINI-CASE = DELIVERABLE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Dari Kelas ke Ruang Komite</h2>
      <p>Capstone ini mensimulasikan pekerjaan nyata. Berikut <strong>peta medan</strong> profesi analis risiko kredit di Indonesia.</p>

      <h3>Sehari sebagai Analis Risiko Kredit</h3>
      <p>Gambaran realistis (bank menengah Indonesia):</p>
      <ul>
        <li><strong>08.00–10.00:</strong> review berkas pengajuan baru — cek SLIK, hitung rasio cepat, tentukan "layak proses / tolak awal". Sehari 3–5 berkas.</li>
        <li><strong>10.00–12.00:</strong> analisis mendalam 1 berkas besar — laporan keuangan 3 tahun, kunjungan/site visit (untuk UKM/korporasi), tulis memo.</li>
        <li><strong>13.00–15.00:</strong> komite kredit — presentasikan 1–2 memo, jawab pertanyaan direksi ("berapa RAROC-nya? covenant-nya apa?").</li>
        <li><strong>15.00–17.00:</strong> monitoring portofolio — review KRI, tindak lanjuti EWS alert, update watchlist.</li>
      </ul>
      <p>Keterampilan yang paling dipakai: <strong>menulis</strong> (memo!), <strong>berbicara</strong> (komite!), dan <strong>bertanya</strong> (ke RM, ke nasabah, ke data). Analis yang hanya bisa menghitung tetapi tidak bisa menulis memo yang meyakinkan = setengah analis.</p>

      <h3>Jenjang Karir &amp; Sertifikasi</h3>
      <p>Jalur karir tipikal Indonesia:</p>
      <ul>
        <li><strong>Analis (0–3 tahun):</strong> review berkas, hitung rasio, tulis memo. Gaji: UMR+ hingga belasan juta (bank besar).</li>
        <li><strong>Senior analis / AVP (3–7 tahun):</strong> putuskan berkas menengah, validasi model, pimpin tim kecil.</li>
        <li><strong>Manager / Head of credit risk (7–12 tahun):</strong> tetapkan kebijakan, appetite, limit; duduk di komite.</li>
        <li><strong>Direktur risiko (CRO):</strong> tanggung jawab penuh ke OJK dan dewan komisaris.</li>
      </ul>
      <p><strong>BSMR</strong> (Badan Sertifikasi Manajemen Risiko) level 1–5 adalah <strong>mata uang kredibilitas</strong> — banyak bank mewajibkan level tertentu untuk promosi. Sertifikasi internasional (FRM) menjadi pembeda untuk bank asing/multinasional. <strong>Investasi terbaik analis muda: sertifikasi + portofolio analisis nyata.</strong></p>

      <h3>Wawancara Kerja: Pertanyaan yang Pasti Keluar</h3>
      <p>Dari pola lowongan Credit Risk Analyst Indonesia, pertanyaan yang <strong>hampir pasti</strong> muncul:</p>
      <ul>
        <li>"Jelaskan PD, LGD, EAD dengan contoh." (CR3 — kamu bisa.)</li>
        <li>"Bagaimana kamu menilai pengajuan KMK Rp 10 M?" (CR1+CR17 — 5C, DSCR, SLIK, agunan.)</li>
        <li>"NPL naik — apa yang kamu lakukan?" (CR2+CR6+CR20 — bedah vintage, DPK, roll rate.)</li>
        <li>"Jelaskan PSAK 71 staging." (CR4b+CR14 — SICR, cliff effect.)</li>
        <li>"Ceritakan saat kamu menolak pengajuan yang ditekan bisnis." (<strong>integritas</strong> — siapkan cerita capstone ini!)</li>
      </ul>
      <p>Pertanyaan terakhir adalah <strong>penentu</strong> — pewawancara tidak menguji jawaban benar/salah, melainkan <strong>karakter</strong>. Ceritakan kasus Sinar Abadi ini dengan struktur: fakta → analisis → tekanan → keputusan → hasil. Itulah <strong>portofolio karaktermu</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh: elevator pitch 60 detik (klik untuk buka)</summary>
        <p><em>"Saya analis risiko kredit. Keahlian saya: menilai pengajuan kredit korporasi dan UKM — dari analisis laporan keuangan, perhitungan DSCR dan RAROC, hingga staging ECL sesuai PSAK 71. Saya terbiasa memakai data: vintage analysis untuk kualitas origination, SLIK untuk verifikasi, dan stress test untuk kecukupan modal. Prinsip saya: angka harus jujur — saya pernah menolak pengajuan Rp 50 M karena arus kas tidak menutup bunga, meski ditekan. Keputusan itu menyelamatkan bank dari CKPN miliaran. Saya juga tersertifikasi BSMR level 2."</em></p>
        <p><strong>Struktur pitch:</strong> siapa → apa yang bisa → bukti (angka!) → prinsip → kredibilitas. <strong>60 detik, 5 elemen, 0 filler.</strong> Latih sampai natural — ini yang membedakan kandidat yang diingat dari yang dilupakan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci (karir):</strong> tiga investasi dengan ROI tertinggi untuk analis muda Indonesia: (1) <strong>BSMR level 1–2</strong> (kredibilitas instan), (2) <strong>portofolio SQL/Python</strong> dengan analisis kredit nyata (bukti skill), (3) <strong>kemampuan menulis memo</strong> (pembeda yang langka). Teknis bisa dipelajari; <strong>integritas + komunikasi</strong> yang membedakan karir 10 tahun.</p>
      </div>

      <h2 id="case">📋 Deliverable: Memo Kredit Final</h2>
      <div className="callout">
        <p><strong>Tugas capstone</strong> (kumpulkan sebagai bukti penyelesaian track):</p>
        <ol>
          <li>Jalankan Lab 1 dengan <strong>skenario stres</strong> (EBITDA −30%): catat perubahan ICR → rating → PD → ECL → bunga minimum.</li>
          <li>Susun <strong>memo kredit lengkap</strong> (pakai template Lab 2): fakta, 3 risiko utama, mitigasi, parameter, rekomendasi + 3 alasan.</li>
          <li>Tulis <strong>1 paragraf</strong>: apa yang kamu katakan ke RM yang meminta "dibuat bagus"?</li>
        </ol>
        <details className="worked">
          <summary>💡 Contoh jawaban skenario stres (klik untuk buka)</summary>
          <p>EBITDA 45 → 31,5: ICR 4,3x → <strong>3,0x</strong> (mepet!); rating BB → <strong>B</strong>; PD 1,5% → <strong>4%</strong>; ECL Rp 0,34 M → <strong>Rp 0,9 M</strong> (2,7×); bunga minimum 10,6% → <strong>~12%</strong>.</p>
          <p><strong>Keputusan stres:</strong> <strong>TOLAK</strong> atau plafon Rp 20 M dengan agunan keras — karena pada skenario turun 30% (sangat mungkin untuk distributor FMCG saat daya beli melemah), coverage bunga <strong>hampir jebol</strong>. KMK Rp 50 M pada perusahaan ini = <strong>menambah utang untuk membayar utang</strong>.</p>
          <p>Paragraf ke RM: <em>"Saya paham nasabah ini penting — justru karena penting, kita tidak boleh memberinya kredit yang akan menenggelamkannya. Rp 35 M dengan struktur yang benar menyelamatkan hubungan jangka panjang; Rp 50 M tanpa struktur menghancurkan keduanya: nasabah macet, kita menanggung CKPN."</em></p>
        </details>
      </div>

            <h2 id="case2">📋 Deliverable 2: Surat untuk Dirimu Setahun Lagi</h2>
      <div className="callout">
        <p><strong>Tugas refleksi</strong> (untuk dirimu sendiri, bukan dinilai):</p>
        <p>Tulis surat 1 halaman untuk dirimu <strong>setahun dari sekarang</strong> — saat kamu (semoga) sudah bekerja sebagai analis risiko kredit. Isinya:</p>
        <ol>
          <li><strong>Tiga prinsip</strong> dari track ini yang tidak boleh kamu langgar (contoh: "angka harus jujur", "kas &gt; laba", "tahu kapan berhenti").</li>
          <li><strong>Satu kegagalan</strong> yang kamu antisipasi (contoh: "tekanan pertama untuk membuat bagus") — dan <strong>kalimat</strong> yang akan kamu ucapkan saat itu terjadi.</li>
          <li><strong>Satu skill</strong> yang akan kamu kuasai tahun ini (contoh: "SQL window function untuk roll rate" atau "BSMR level 2").</li>
        </ol>
        <details className="worked">
          <summary>💡 Contoh surat (klik untuk buka)</summary>
          <p><em>"Untuk Septian, Oktober 2027. Tiga prinsipku: (1) Tidak ada memo yang kubuat-bagus — reputasiku satu-satunya aset yang tidak bisa direstrukturisasi. (2) Kas lebih jujur dari laba — mulai analisis dari arus kas, selalu. (3) Tahu kapan berhenti — menagih yang tidak ekonomis = membakar uang bank.</em></p>
          <p><em>Kegagalan yang kuantisipasi: RM langganan memintaku 'meloloskan' pengajuan temannya. Kalimatku: 'Saya paham posisimu — justru karena nasabah ini penting bagimu, kita tidak boleh memberinya kredit yang akan menenggelamkannya. Mari cari struktur yang benar.'</em></p>
          <p><em>Skill tahun ini: BSMR level 2 + portofolio analisis vintage dari data publik OJK. Sampai jumpa di komite kredit. — Septian, 2026."</em></p>
          <p><strong>Mengapa surat ini penting:</strong> tekanan pertama selalu datang saat kamu <strong>lupa</strong> prinsipmu — bukan saat kamu tidak tahu. Surat ini adalah <strong>jangkar</strong> untuk hari itu.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Ujian Akhir Track (8 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. DER 2,1 → 3,2 dalam 3 tahun. Sinyal utama?"
        options={[
          "Fluktuasi normal",
          "Perusahaan memakan ekuitasnya sendiri — struktur memburuk, bukan fluktuasi. Tren > titik",
          "Semakin tinggi semakin baik",
          "Tidak relevan untuk KMK",
        ]}
        correct={1}
        explanation="Benar: tren 3 tahun satu arah = struktural. Analis menilai film, bukan foto."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Laba Rp 8 M tapi arus kas bebas negatif setelah bayar bunga. Kesimpulan?"
        options={[
          "Sehat — laba positif",
          "Red flag terbesar: utang dibayar dengan KAS bukan laba — selidiki dari mana bunga dibayar sebelum ACC",
          "Laba tidak penting",
          "Naikkan plafon",
        ]}
        correct={1}
        explanation="Benar: cash waterfall = kebenaran terakhir. Laba tanpa kas = fatamorgana."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. ECL Stage 1 Rp 0,34 M. Kapan pindah Stage 2?"
        options={[
          "Saat sudah macet",
          "Saat SICR: tetapkan pemicu eksplisit (misal DER >3,5x atau coverage <3x) — jangan tunggu macet (CR14a)",
          "Tidak pernah",
          "Otomatis tiap tahun",
        ]}
        correct={1}
        explanation="Benar: staging = forward-looking. Pemicu eksplisit di memo = disiplin, bukan firasat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Bunga minimum 10,6%, pasar 10-12%. Strategi pricing?"
        options={[
          "Pasang 9% agar menang tender",
          "11,5%: di atas minimum (buffer) + dalam rentang pasar — di bawah minimum = subsidi pemegang saham",
          "Pasang 15% maksimal",
          "Ikuti kompetitor termurah",
        ]}
        correct={1}
        explanation="Benar: tidak di bawah minimum (bunuh diri), tidak terlalu di atas pasar (adverse selection). Buffer = profesionalisme."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. RM meminta 'dibuat bagus'. Respons analis?"
        options={[
          "Ikuti — RM yang bawa nasabah",
          "Tolak dengan argumen: integritas = satu-satunya aset analis; kredit yang menenggelamkan nasabah menghancurkan keduanya",
          "Buat dua versi memo",
          "Laporkan RM ke OJK",
        ]}
        correct={1}
        explanation="Benar: independensi analis (CR19: three lines). Argumen bisnis — bukan moral — paling meyakinkan RM."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Skenario stres EBITDA −30% mengubah keputusan jadi TOLAK. Pelajaran?"
        options={[
          "Stress testing tidak berguna",
          "Keputusan kredit harus tahan terhadap skenario buruk yang masuk akal — jika hanya lolos di skenario baik, itu bukan keputusan melainkan harapan",
          "Jangan pernah pakai skenario stres",
          "Stres selalu berarti tolak",
        ]}
        correct={1}
        explanation="Benar: inilah guna CR16. Kredit yang hanya hidup di skenario optimis = harapan, bukan analisis."
      />

      {/* 12. RANGKUMAN TRACK */}
            <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Tiga bulan pertama sebagai analis baru. Prioritas yang benar?"
        options={[
          "Langsung tunjukkan kepintaran — kritik model lama di minggu pertama",
          "30 hari jadi spons (pelajari portofolio + template + RM), 60 hari kirim 1 memo brilian, 90 hari bangun dashboard KRI pribadi",
          "Fokus sertifikasi saja — kerja nanti",
          "Ikuti semua kata RM senior",
        ]}
        correct={1}
        explanation="Benar: 30-60-90. Dengarkan dulu, kirim sinyal lewat 1 memo brilian, lalu bangun sistem (dashboard). Reputasi analis dibangun dari memo pertama yang meyakinkan — bukan dari kritik di minggu pertama."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(7, ok)}
        question="8. Di wawancara kerja, pewawancara bertanya: 'Ceritakan saat kamu menolak pengajuan yang ditekan bisnis.' Apa yang sebenarnya diuji?"
        options={[
          "Pengetahuan teknis PD/LGD",
          "Karakter/integritas — bukan jawaban benar/salah, melainkan bukti kamu berani benar saat ditekan; siapkan cerita dengan struktur fakta → analisis → tekanan → keputusan → hasil",
          "Kemampuan berbohong",
          "Tidak penting — formalitas",
        ]}
        correct={1}
        explanation="Benar: ini ujian karakter — penentu. Pewawancara mencari bukti integritas, bukan teori. Struktur yang menang: fakta, analisis, tekanan yang dihadapi, keputusan, dan hasil. Kasus Sinar Abadi di capstone ini adalah bahan ceritamu."
      />

      <h2 id="rangkum">📝 Rangkuman Track: Credit Risk Analyst</h2>
      <div className="callout">
        <ul>
          <li><strong>Fondasi (CR1–CR5):</strong> produk, kolektibilitas, PD/LGD/EAD, Basel/KPMM, PSAK 71, definisi default.</li>
          <li><strong>Data &amp; model (CR6–CR13):</strong> SQL portofolio, scorecard, reject inference, behavioral, PD/LGD/EAD modeling, forward-looking.</li>
          <li><strong>ECL &amp; portofolio (CR14–CR16):</strong> staging &amp; perhitungan ECL, konsentrasi &amp; VaR, stress testing.</li>
          <li><strong>Korporasi &amp; validasi (CR17–CR19):</strong> analisis keuangan, credit memo, industry/country/ESG, validasi model.</li>
          <li><strong>Bisnis (CR20–CR24):</strong> KRI &amp; dashboard, pricing &amp; RAROC, collection, regulasi OJK &amp; BSMR, fairness.</li>
          <li><strong>Capstone (CR25):</strong> integrasikan semuanya → memo kredit → pertahankan.</li>
          <li><strong>Langkah karir:</strong> BSMR Level 1 → lamar Credit Risk Analyst dengan portofolio memo + lab ini.</li>
        </ul>
        <p>🎓 <strong>Selamat!</strong> Kamu menyelesaikan 29 lesson Credit Risk Analyst. Yang membedakan analis hebat bukan rumus yang dihafal — melainkan <strong>keberanian berkata tidak</strong> saat angka berkata tidak.</p>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr24-fairness-explainability" className="btn btn-secondary btn-sm">← CR24</Link>
        <Link href="/" className="btn btn-secondary btn-sm">Daftar Materi</Link>
      </div>
    </div>
  );
}
