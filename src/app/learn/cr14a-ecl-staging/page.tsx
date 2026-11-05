"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr14aPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const stagingFlowData = [
    {
      x: ["Stage 1", "Stage 2", "Stage 3"],
      y: [90, 7, 3],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["ECL 12 bln", "ECL lifetime", "ECL lifetime (PD 100%)"],
      textposition: "outside",
    },
  ];

  const discountData = [
    {
      x: ["Thn 1", "Thn 2", "Thn 3", "Thn 4", "Thn 5"],
      y: [100, 91, 83, 75, 68],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["100", "91", "83", "75", "68"],
      textposition: "outside",
    },
  ];

  const eclComponentsData = [
    {
      x: ["PD", "LGD", "EAD", "Diskonto", "Skenario"],
      y: [20, 15, 25, 10, 30],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#3aa655", "#94a3b8", "#ef9244"] },
      text: ["20%", "15%", "25%", "10%", "30%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Mesin staging — dari data ke stage ke ECL
# Aturan (ilustrasi praktik bank): SICR jika PD naik >=2x atau DPD>=30.
def tentukan_stage(pd_awal, pd_kini, dpd):
    if dpd > 90:
        return 3, "Default (DPD>90)"
    if pd_kini / pd_awal >= 2.0 or dpd >= 30:
        return 2, "SICR terpenuhi"
    return 1, "Sehat"

def ecl(stage, pd_12m, pd_life, lgd, ead):
    if stage == 1: return pd_12m * lgd * ead
    if stage == 2: return pd_life * lgd * ead
    return 1.0 * lgd * ead  # stage 3: PD=100%

lgd, ead = 0.45, 500
kasus = [
    ("A: PD 1.5%->2.0%, DPD 0", 0.015, 0.020, 0),
    ("B: PD 1.5%->3.5%, DPD 0", 0.015, 0.035, 0),
    ("C: PD 1.5%->1.8%, DPD 35", 0.015, 0.018, 35),
    ("D: PD 2.0%->2.5%, DPD 120", 0.020, 0.025, 120),
]
print(f"{'Kasus':<28} {'Stage':>5} {'ECL':>9}")
for nama, p0, p1, dpd in kasus:
    st, alasan = tentukan_stage(p0, p1, dpd)
    e = ecl(st, p1, p1*4.5, lgd, ead)
    print(f"{nama:<28} {st:>5} Rp {e:>6.1f} jt  ({alasan})")
print()
print("Perhatikan kasus C: PD naik cuma 1.2x TAPI DPD 35 -> Stage 2.")
print("Backstop 30 hari tidak bisa dinegosiasi model.")`;

  const lab2Code = `# Lab 2: Diskonto — rupiah masa depan lebih murah
# ECL Stage 2 = jumlah PD_t x LGD x EAD_t yang DIDISKONTO.
r = 0.10  # suku bunga efektif kredit
ead_awal = 500
lgd = 0.45
pd_tahunan = [0.030, 0.025, 0.020, 0.015, 0.012]

ecl_tanpa_diskonto, ecl_diskonto = 0, 0
ead = ead_awal
print(f"{'Thn':<4} {'EAD':>6} {'Kontribusi':>11} {'Didiskonto':>11}")
for t, p in enumerate(pd_tahunan, 1):
    kontribusi = p * lgd * ead
    didiskonto = kontribusi / (1 + r) ** t
    ecl_tanpa_diskonto += kontribusi
    ecl_diskonto += didiskonto
    print(f"{t:<4} {ead:>6.0f} {kontribusi:>10.2f} {didiskonto:>10.2f}")
    ead *= 0.85  # amortisasi: pokok menyusut tiap tahun
print(f"\nECL tanpa diskonto : Rp {ecl_tanpa_diskonto:.1f} jt")
print(f"ECL didiskonto     : Rp {ecl_diskonto:.1f} jt")
print(f"Selisih            : Rp {ecl_tanpa_diskonto - ecl_diskonto:.1f} jt")
print()
print("Coba: ubah r jadi 0.15. ECL turun — tenor panjang + bunga tinggi")
print("= diskonto besar. Inilah mengapa ECL KPR 20 thn SANGAT sensitif")
print("terhadap asumsi suku bunga.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR14a — Credit Risk Analyst • ECL Part 1</span>
        <h1 className="display-title">ECL Part 1:<br />Staging, Lifetime PD &amp; Diskonto</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tiga Tumpukan yang Beda Harga</a></li>
          <li><a href="#mesin">Mesin ECL: Lima Komponen</a></li>
          <li><a href="#staging">Staging: Menentukan Tumpukan</a></li>
          <li><a href="#lifetime">Lifetime ECL: Menjumlah Masa Depan</a></li>
          <li><a href="#diskonto">Diskonto: Rupiah Masa Depan Lebih Murah</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mesin Staging</a></li>
          <li><a href="#lab2">🔬 Lab 2: Diskonto ECL</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Membangun Rantai ECL</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Salah Stage, Salah Triliunan</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 5 komponen ECL (PD, LGD, EAD, diskonto, skenario) dan perannya.</li>
          <li>Menentukan stage kredit dan menghitung ECL yang sesuai (12-bulan vs lifetime).</li>
          <li>Menghitung ECL lifetime dengan diskonto dan menjelaskan sensitivitasnya terhadap suku bunga.</li>
          <li>Mengidentifikasi kesalahan staging dan dampaknya ke laporan keuangan.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Tiga Tumpukan yang Beda Harga</h2>
      <div className="story">
        <p>Gudang Bank Nusantara. Tiga tumpukan berkas kredit — <strong>nominalnya sama</strong>: Rp 500 juta per berkas.</p>
        <p>Tumpukan 1 (hijau): debitur sehat. "Harganya" (cadangan): <strong>Rp 4,5 juta</strong> per berkas.<br />
        Tumpukan 2 (kuning): risiko naik. "Harganya": <strong>Rp 38 juta</strong> per berkas.<br />
        Tumpukan 3 (merah): sudah macet. "Harganya": <strong>Rp 225 juta</strong> per berkas.</p>
        <p>Berkas yang sama persis — nominal sama, tenor sama — tapi "harganya" beda <strong>50× lipat</strong>. Yang membedakan bukan kertasnya, melainkan <strong>stage</strong>-nya: seberapa besar risiko <em>meningkat</em> sejak kredit lahir.</p>
        <p><strong>Twist-nya:</strong> ECL bukan satu rumus — melainkan <strong>mesin lima komponen</strong> yang outputnya ditentukan stage. Part 1 ini merakit mesinnya: staging → lifetime → diskonto. Part 2 (CR14b) menghitung sampai jurnal akuntansi.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="mesin">Mesin ECL: Lima Komponen</h2>
      <p><strong>Definisi.</strong> ECL (<em>Expected Credit Loss</em>) = ekspektasi kerugian kredit yang <strong>didiskonto</strong> dan <strong>dibobot skenario</strong>. Lima komponennya:</p>
      <ol>
        <li><strong>PD</strong> — peluang default per tahun (PIT, forward-looking). Sudah dibahas: CR10.</li>
        <li><strong>LGD</strong> — porsi hilang saat default. Sudah dibahas: CR12.</li>
        <li><strong>EAD</strong> — exposure saat default (termasuk CCF). Sudah dibahas: CR13.</li>
        <li><strong>Diskonto</strong> — nilai waktu uang (suku bunga efektif). <strong>Baru di lesson ini.</strong></li>
        <li><strong>Skenario</strong> — probability-weighting ekonomi. Sudah dibahas: CR11.</li>
      </ol>
      <p><strong>Kepribadian:</strong> ECL seperti <strong>resep rendang</strong> — lima bumbu yang tak bisa dikurangi. PD/LGD/EAD adalah "dagingnya" (dibahas 3 lesson sebelumnya); diskonto adalah "santan"-nya (lesson ini); skenario adalah "api"-nya (CR11). Kurang satu = bukan rendang.</p>

      <PlotlyChart
        data={eclComponentsData}
        title="Kontribusi Sensitivitas: Komponen Mana Paling Berpengaruh? (ilustrasi)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "Pengaruh ke ECL (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = seberapa besar ECL berubah jika komponen itu salah 10%.</p>
        <p><strong>Interpretasi:</strong> <strong>skenario (30%)</strong> dan <strong>EAD (25%)</strong> paling sensitif — kesalahan di sana paling mahal. <strong>Pelajaran prioritas:</strong> validasi model jangan merata — fokuskan energi ke komponen paling sensitif. Inilah <em>risk-based validation</em>.</p>
      </div>

      <h2 id="staging">Staging: Menentukan Tumpukan</h2>
      <p><strong>Definisi.</strong> <strong>Staging</strong> = mengklasifikasikan tiap kredit ke Stage 1/2/3 (PSAK 71, detail konsep di CR4b). Aturan praktis bank:</p>
      <ul>
        <li><strong>Stage 1:</strong> tidak ada SICR → ECL = <strong>PD 12-bulan</strong> × LGD × EAD.</li>
        <li><strong>Stage 2:</strong> SICR (PD naik ≥2× <em>atau</em> DPD ≥30) → ECL = <strong>PD lifetime</strong> × LGD × EAD.</li>
        <li><strong>Stage 3:</strong> default (DPD &gt;90 <em>atau</em> unlikely-to-pay) → ECL = <strong>100%</strong> × LGD × EAD.</li>
      </ul>
      <p><strong>Halus tapi penting:</strong> <em>curing</em> — kredit bisa <strong>kembali</strong> Stage 2→1 jika membaik (dengan masa percobaan, misal 6 bulan DPD 0). Stage bukan jalan satu arah — tapi juga bukan pintu putar (tidak boleh naik-turun tiap bulan).</p>

      <PlotlyChart
        data={stagingFlowData}
        title="Tiga Tumpukan: Porsi & Harga ECL per Stage (ilustrasi)"
        layout={{ xaxis: { title: "Stage" }, yaxis: { title: "% portofolio" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi portofolio; label = "harga" ECL per stage.</p>
        <p><strong>Interpretasi:</strong> 90% portofolio "murah" (Stage 1), tapi <strong>10% sisanya mendominasi CKPN</strong>: 7% × Rp 38 jt + 3% × Rp 225 jt jauh melampaui 90% × Rp 4,5 jt. <strong>Pelajaran:</strong> kualitas ECL bank ditentukan oleh <strong>akurasi staging 10% ini</strong> — bukan oleh 90% yang sehat.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "ECL Stage 1 = 1/5 dari ECL Stage 2 (12 bulan vs 60 bulan)."</strong></p>
        <p><strong>Yang benar:</strong> tidak selinier itu — karena <strong>PD marginal menurun</strong> seiring waktu (seasoning: yang lemah gugur duluan) dan <strong>EAD menyusut</strong> (amortisasi) serta <strong>diskonto</strong>. Rasio aktual biasanya 4–8×, bukan proporsional tenor. Menghitung asal = salah besar.</p>
      </div>

      <h2 id="lifetime">Lifetime ECL: Menjumlah Masa Depan</h2>
      <p><strong>Definisi.</strong> ECL lifetime = jumlahkan ekspektasi kerugian <strong>tiap tahun sisa tenor</strong>:</p>
      <Tex math={String.raw`\text{ECL}_{\text{lifetime}} = \sum_{t=1}^{T} \frac{\text{PD}_t \times \text{LGD}_t \times \text{EAD}_t}{(1+r)^t}`} block />
      <p><strong>Artinya tiap simbol:</strong> untuk tiap tahun <Tex math={String.raw`t`} /> sampai tenor <Tex math={String.raw`T`} />: kalikan PD/LGD/EAD tahun itu (EAD menyusut karena amortisasi!), bagi dengan <Tex math={String.raw`(1+r)^t`} /> (diskonto), jumlahkan. Untuk multi-skenario: hitung per skenario lalu bobot (CR11).</p>
      <p><strong>Tiga dinamika yang sering dilupakan:</strong></p>
      <ul>
        <li><strong>EAD menyusut</strong> (amortisasi): KPR tahun ke-15 EAD-nya jauh lebih kecil dari tahun ke-1.</li>
        <li><strong>PD marginal berubah</strong>: biasanya turun (seasoning) — tapi bisa naik jika ekonomi memburuk.</li>
        <li><strong>LGD bisa berubah</strong>: agunan terdepresiasi (kendaraan!) → LGD naik seiring waktu.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ECL lifetime <strong>bukan</strong> ECL 12-bulan × tenor. Ia adalah <strong>film</strong>, bukan foto yang digandakan: tiap tahun punya PD, EAD, dan diskonto sendiri. Model ECL yang baik mensimulasikan <em>perjalanan</em> kredit — bukan mengalikan <em>potret</em>-nya.</p>
      </div>

      <h2 id="diskonto">Diskonto: Rupiah Masa Depan Lebih Murah</h2>
      <p><strong>Definisi.</strong> Kerugian Rp 100 jt yang terjadi <strong>5 tahun lagi</strong> tidak sama nilainya dengan Rp 100 jt <strong>hari ini</strong> — didiskonto dengan <strong>suku bunga efektif</strong> (<em>EIR</em>) kredit tersebut.</p>
      <p><strong>Mengapa EIR (bukan BI rate)?</strong> Karena ECL mengukur <strong>nilai kini dari arus kas yang hilang <em>dari kredit ini</em></strong> — dan "harga waktu" kredit ini adalah bunganya sendiri. KPR bunga 8% didiskonto 8%; KTA bunga 18% didiskonto 18%.</p>

      <PlotlyChart
        data={discountData}
        title="Nilai Kini Rp 100 Juta per Tahun (diskonto 10%)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Nilai kini (Rp jt)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = nilai hari ini dari Rp 100 jt yang hilang di tahun itu.</p>
        <p><strong>Interpretasi:</strong> Rp 100 jt di tahun ke-5 hanya "seharga" <strong>Rp 68 jt</strong> hari ini. <strong>Implikasi:</strong> ECL tenor panjang (KPR 20 tahun) <strong>sangat sensitif</strong> terhadap asumsi suku bunga — salah 2% di r = selisih ratusan miliar di portofolio. Inilah komponen ECL yang paling "akuntansi" dan paling sering diremehkan analis risiko.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Diskonto cuma detail teknis — tidak mengubah keputusan."</strong></p>
        <p><strong>Yang benar:</strong> untuk KPR 20 tahun, diskonto bisa memangkas ECL lifetime <strong>30–40%</strong>. "Detail teknis" ini menentukan apakah CKPN Rp 800 M atau Rp 1,1 T — selisih Rp 300 M yang menggerakkan laba. Analis yang mengabaikan diskonto = analis yang salah Rp 300 M.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: ECL adalah Film, Bukan Foto</h3>
      <p>Analogi paling kuat untuk ECL lifetime: ia adalah <strong>film</strong> — tiap tahun punya PD, EAD, dan LGD-nya sendiri — bukan foto 12-bulan yang digandakan. Tiga dinamika yang membuat film ini hidup: (1) <strong>EAD menyusut</strong> karena amortisasi (KPR tahun ke-15 risikonya jauh lebih kecil dari tahun ke-1 — debitur sudah membayar sebagian besar); (2) <strong>PD marginal berubah</strong> — biasanya turun karena seasoning (yang lemah gugur duluan), tetapi bisa naik jika ekonomi memburuk; (3) <strong>LGD bisa berubah</strong> — agunan kendaraan terdepresiasi, sehingga LGD tahun ke-5 lebih tinggi dari tahun ke-1. Analis yang menghitung ECL lifetime dengan asumsi "sama setiap tahun" sedang memutar film yang semua adegannya identik — membosankan dan salah.</p>
      <p>Intuisi kedua: <strong>diskonto bukan sekadar matematika</strong> — ia mencerminkan prinsip ekonomi bahwa kerugian Rp 1 M lima tahun lagi "lebih murah" dari Rp 1 M hari ini (uang bisa diputar). PSAK 71 memakai <strong>suku bunga efektif</strong> (EIR) kredit itu sendiri sebagai tingkat diskonto — bukan suku bunga pasar umum. Mengapa? Karena ECL mengukur kerugian <strong>kredit spesifik ini</strong>, dengan karakteristiknya sendiri. Detail kecil, konsekuensi besar: dua kredit dengan arus kas sama tetapi EIR beda menghasilkan ECL beda.</p>
      <p>Intuisi ketiga tentang staging: <strong>Stage 2 adalah "ruang observasi"</strong> — bukan vonis. Banyak kredit Stage 2 yang sembuh (curing) kembali ke Stage 1. Analis yang memperlakukan Stage 2 = "akan macet" akan salah membaca laporan keuangan: ia mengira bank sekarat, padahal bank sedang <strong>jujur lebih awal</strong>. Justru bank dengan Stage 2 yang transparan dan termonitor lebih sehat dari bank yang Stage 2-nya nol persen (tidak mungkin — pasti ada yang disembunyikan).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> lima komponen ECL (PD, LGD, EAD, diskonto, skenario) seperti lima musisi — salah satu fals, seluruh orkestra sumbang. Analisis sensitivitas (CR14b) memberitahu <strong>musisi mana yang paling menentukan</strong> — dan di sanalah waktu validasimu harus dihabiskan.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Mesin Staging</h2>
      <p>Empat kasus, empat nasib. Tentukan stage-nya, hitung ECL-nya.</p>
      <PyodideLab
        title="Lab 1 — Staging & ECL per Kasus"
        hint="Coba tambah kasus E: PD 1.5%->2.9% (naik 1.93x), DPD 0 — stage berapa? (Jawaban: 1, belum 2x.) Rasakan betapa 'tajam' ambang 2x itu — dan mengapa bank mendokumentasikannya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Diskonto ECL</h2>
      <p>Hitung ECL lifetime dengan dan tanpa diskonto — lihat selisihnya.</p>
      <PyodideLab
        title="Lab 2 — ECL Didiskonto vs Tidak"
        hint="Coba r=0.05 vs r=0.15. Selisihnya = sensitivitas suku bunga. Pertanyaan: untuk KPR 20 tahun (bukan 5), seberapa besar efeknya? (Ubah list pd_tahunan jadi 20 tahun!)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Membangun Rantai ECL</h2>

      <div className="decision-card">
        <h3>1. Data staging tidak konsisten antar cabang → <strong>standardisasi kriteria SICR pusat</strong></h3>
        <p><strong>Kondisi:</strong> cabang A memakai ambang 2×, cabang B memakai "feeling".</p>
        <p><strong>Kenapa:</strong> staging inkonsisten = CKPN tidak bisa dibandingkan = auditor menolak. Kriteria SICR ditetapkan <strong>pusat</strong>, dieksekusi sistem.</p>
      </div>

      <div className="decision-card">
        <h3>2. Portofolio tenor panjang (KPR) → <strong>investasi di kurva PD lifetime &amp; EIR akurat</strong></h3>
        <p><strong>Kondisi:</strong> KPR 15–20 tahun mendominasi.</p>
        <p><strong>Kenapa:</strong> sensitivitas diskonto &amp; amortisasi terbesar di tenor panjang. Salah EIR 2% = ratusan miliar.</p>
      </div>

      <div className="decision-card">
        <h3>3. Validasi model ECL → <strong>prioritaskan komponen paling sensitif</strong></h3>
        <p><strong>Kondisi:</strong> waktu validasi terbatas.</p>
        <p><strong>Aksi:</strong> fokus ke skenario &amp; EAD (paling sensitif, lihat chart) — bukan meratakan energi ke semua komponen.</p>
      </div>

      <div className="decision-card">
        <h3>4. Migrasi stage massal tiba-tiba → <strong>bedakan sebab: model vs ekonomi vs kebijakan</strong></h3>
        <p><strong>Kondisi:</strong> Stage 2 melonjak sekuartal.</p>
        <p><strong>Aksi:</strong> apakah PD model berubah (rekalibrasi?), ekonomi memburuk (satelit?), atau kriteria SICR diubah (kebijakan!)? Tiga sebab, tiga respons berbeda.</p>
      </div>

            <div className="decision-card">
        <h3>5. 500 debitur UMKM tiba-tiba memenuhi kriteria SICR kuantitatif karena model PD di-rekalibrasi → <strong>bedakan migrasi model vs migrasi risiko</strong></h3>
        <p><strong>Kondisi:</strong> setelah rekalibrasi model PD, PD 500 debitur naik &gt;2× — bukan karena debitur memburuk, melainkan karena <strong>modelnya</strong> berubah. Secara mekanis mereka pindah Stage 1→2, ECL melonjak Rp 40 M.</p>
        <p><strong>Aksi:</strong> jangan biarkan migrasi artifisial menghantam laba tanpa penjelasan. Praktik yang benar: (1) dokumentasikan bahwa ini <strong>efek rekalibrasi</strong>, bukan perburukan risiko; (2) pertimbangkan <strong>transisi bertahap</strong> atau pengungkapan khusus ke OJK/auditor; (3) review apakah ambang SICR perlu disesuaikan dengan skala PD baru (karena 2× dari PD yang sudah direkalibrasi bisa terlalu sensitif). Pelajaran: <strong>setiap perubahan model harus diuji dampak staging-nya</strong> sebelum diimplementasikan — bukan sesudahnya.</p>
        <p><strong>Contoh nyata:</strong> bank-bank yang merekalibrasi PD pasca-Covid menghadapi fenomena ini — lonjakan Stage 2 "palsu" yang harus dijelaskan ke direksi dan auditor dengan narasi rekalibrasi, bukan narasi risiko.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Stage menentukan "harga".</strong> 10% portofolio (Stage 2+3) mendominasi CKPN.</li>
          <li><strong>Lifetime ECL = film</strong> (PD/EAD/diskonto per tahun), bukan foto × tenor.</li>
          <li><strong>Diskonto itu material</strong> — terutama tenor panjang.</li>
          <li><strong>Validasi proporsional</strong> — fokus ke komponen paling sensitif.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Governance SICR: 7 Aturan Anti-Manipulasi</h3>
      <p>Ambang SICR adalah 'tombol laba' paling kuat di bank. Tujuh aturan ini mencegahnya disalahgunakan.</p>
      <ol>
        <li><strong>Tetapkan ambang berbasis analisis, bukan keinginan</strong> — 2× PD atau ambang absolut harus didukung benchmark peer + analisis sensitivitas — bukan 'angka yang enak'. Dokumentasikan alasannya.</li>
        <li><strong>Kunci metodologi (change control)</strong> — Perubahan ambang/kriteria SICR hanya via kajian validasi independen + persetujuan dewan komisaris, maksimal 1×/tahun. Tanpa pagar ini = tombol laba.</li>
        <li><strong>Uji dampak SEBELUM implementasi</strong> — Setiap perubahan model/kriteria wajib diuji dampak staging-nya dulu (berapa ribu rekening pindah? ECL naik berapa?). Kejutan Rp 120 M (mini-case 2) tidak boleh terulang.</li>
        <li><strong>Monitor migrasi Stage 2→1 (curing)</strong> — Curing massal tanpa masa percobaan = income smoothing. Audit: apakah syarat curing benar-benar dipenuhi per rekening?</li>
        <li><strong>Pisahkan migrasi model vs migrasi risiko</strong> — Rekalibrasi yang memindahkan 500 rekening = efek model, bukan risiko. Laporkan terpisah — jangan biarkan direksi mengira 'risiko memburuk'.</li>
        <li><strong>Backstop 30 hari tidak bisa ditawar</strong> — DPD ≥30 = SICR otomatis, tanpa pengecualian 'tetapi'. Backstop adalah jaring pengaman terakhir — melubanginya = merusak sistem.</li>
        <li><strong>Laporkan ke OJK/auditor secara proaktif</strong> — Perubahan metodologi + dampaknya dilaporkan — bukan ditemukan auditor. Transparansi = kepercayaan; ketahuan = temuan.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tujuh aturan ini = konstitusi staging. Tempel di ruang komite risiko — dan tegakkan tanpa kecuali.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Staging PSAK 71 di Indonesia melahirkan praktik, perdebatan, dan trik yang wajib dikenal.</p>

      <h3>SICR dalam Praktik Bank Indonesia</h3>
      <p>Bagaimana bank-bank Indonesia menetapkan SICR? Praktik umum yang teramati:</p>
      <ul>
        <li><strong>Kriteria kuantitatif:</strong> PD naik ≥2× sejak origination (atau melewati ambang absolut tertentu). Bank menetapkan sendiri — dan mempertahankannya ke auditor.</li>
        <li><strong>Backstop 30 hari:</strong> DPD ≥30 otomatis SICR — jaring pengaman universal.</li>
        <li><strong>Kriteria kualitatif:</strong> watchlist, restrukturisasi non-distressed, penurunan rating internal signifikan, informasi negatif material.</li>
      </ul>
      <p>Yang menarik: <strong>ambang SICR adalah keputusan paling politis</strong> di bank. Menggeser ambang sedikit = menggeser Stage 2 = menggeser laba ratusan miliar. OJK dan auditor mengawasi konsistensi: bank tidak boleh mengubah ambang SICR tiap kuartal mengikuti "kebutuhan laba". Sekali ditetapkan, metodologinya dikunci dan didokumentasikan.</p>

      <h3>Curing: Jalan Pulang yang Diatur Ketat</h3>
      <p>PSAK 71 membolehkan kredit Stage 2 kembali ke Stage 1 (<em>curing</em>) — tetapi dengan syarat: umumnya <strong>masa percobaan</strong> (misal 6 bulan pembayaran lancar berturut-turut, DPD 0). Tanpa masa percobaan, bank bisa "memainkan" staging: pindahkan ke Stage 2 saat butuh cadangan besar (menekan laba di tahun bagus), kembalikan ke Stage 1 saat butuh laba cantik (<em>income smoothing</em>). Aturan curing yang ketat + dokumentasi = penangkalnya. Analis yang me-review migrasi Stage 2→1 selalu bertanya: <strong>"apakah masa percobaannya benar-benar dipenuhi, atau hanya di atas kertas?"</strong></p>

      <h3>Interaksi Staging dengan Kolektibilitas</h3>
      <p>Indonesia punya <strong>dua bahasa</strong> yang berjalan paralel: kolektibilitas 1–5 (POJK, bahasa lama) dan Stage 1–3 (PSAK 71, bahasa baru). Petanya tidak 1:1 — Kolek 2 (DPK) bisa Stage 1 atau Stage 2 tergantung SICR; Kolek 3–5 umumnya Stage 3. Analis Indonesia harus <strong>fasih dua bahasa</strong>: direksi lama bicara kolektibilitas, auditor dan investor bicara stage. Laporan yang baik menyajikan keduanya dengan rekonsiliasi yang jelas.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: staging dan ECL satu debitur (klik untuk buka)</summary>
        <p>KPR Rp 500 jt, LGD 45%, EIR 9%. Saat origination PD 12-bulan 2%. Kini (tahun ke-3): PD 12-bulan naik ke 5%, DPD 0.</p>
        <p><strong>Langkah 1</strong> — uji SICR: 5% / 2% = 2,5× ≥ 2× → <strong>SICR terpenuhi → Stage 2</strong>.<br />
        <strong>Langkah 2</strong> — ECL Stage 1 (jika tidak SICR): 0,02 × 0,45 × 500 = Rp 4,5 jt.<br />
        <strong>Langkah 3</strong> — ECL Stage 2: lifetime PD (sisa 12 tahun) ≈ 18% → 0,18 × 0,45 × 500 ≈ Rp 40,5 jt (belum didiskonto; dengan diskonto ≈ Rp 33 jt).<br />
        <strong>Langkah 4</strong> — lompatan: Rp 4,5 jt → Rp 33 jt = <strong>7,3× lipat</strong> — tanpa satu hari pun tunggakan!</p>
        <p><strong>Pelajaran:</strong> inilah cliff effect dalam bentuk paling murni — <strong>penilaian risiko</strong> (bukan tunggakan) yang menggerakkan laba. Analis yang hanya memonitor DPD akan terkejut; yang memonitor PD tidak.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Stage 2 = kredit bermasalah yang akan macet."</strong></p>
        <p><strong>Yang benar:</strong> Stage 2 = risiko meningkat signifikan — banyak yang sembuh kembali (curing). Menyamakan Stage 2 dengan NPL seperti menyamakan "demam" dengan "kritis": membuat panik yang tidak perlu, atau lebih buruk — membuat analis mengabaikan Stage 2 yang <strong>benar-benar</strong> memburuk karena "ah, cuma Stage 2". Baca Stage 2 sebagai <strong>daftar pantau</strong>, bukan daftar vonis.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Salah Stage, Salah Triliunan</h2>
      <div className="callout">
        <p>Audit internal Bank Nusantara menemukan: <strong>15.000 rekening KPR</strong> (total Rp 7,5 T) dengan DPD 30–60 hari <strong>masih tercatat Stage 1</strong> — karena sistem staging cabang belum di-update mengikuti backstop 30 hari.</p>
        <ul>
          <li>ECL Stage 1 (PD 12-bln 1%): 0,01 × 0,3 × 7.500 M = <strong>Rp 22,5 M</strong>.</li>
          <li>ECL Stage 2 (lifetime PD ~6%): 0,06 × 0,3 × 7.500 M = <strong>Rp 135 M</strong>.</li>
          <li>Selisih: <strong>Rp 112,5 M</strong> CKPN kurang — dari satu kesalahan operasional.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apa akar masalahnya (model? data? governance?) dan 2 tindakan perbaikannya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Akar masalah: governance + operasional</strong> — bukan model. Kriteria (backstop 30 hari) benar di atas kertas, tapi <strong>eksekusi sistem</strong> di cabang tertinggal. Ini pola umum: bank punya kebijakan bagus, implementasi bolong.</p>
          <p><strong>Tindakan:</strong> (1) <strong>Staging terpusat &amp; otomatis</strong> — tarik logika staging dari sistem cabang ke engine pusat; cabang tidak boleh override tanpa persetujuan. (2) <strong>Rekonsiliasi staging bulanan</strong>: bandingkan DPD vs stage — setiap DPD ≥30 yang masih Stage 1 = exception yang harus dijelaskan. Pelajaran: <strong>rantai ECL sekuat mata rantai operasional terlemahnya</strong>.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Migrasi Massal karena Kebijakan, Bukan Risiko</h2>
      <div className="callout">
        <p>Bank Nusantara mengubah kebijakan: ambang SICR kuantitatif diperketat dari "PD naik ≥3×" menjadi "PD naik ≥2×" (mengikuti praktik pasar). Dampaknya: <strong>8.000 rekening</strong> pindah Stage 1→2 dalam sekuartal, ECL naik Rp 120 M, laba kuartal anjlok 15%.</p>
        <ul>
          <li>Direktur bisnis marah: "Tidak ada debitur yang memburuk! Ini bunuh diri akuntansi!"</li>
          <li>Auditor bertanya: "Apakah perubahan ini konsisten? Atau hanya saat ingin menekan laba?"</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis risiko, bagaimana kamu (a) menjelaskan ke direksi, (b) menjawab auditor, dan (c) memastikan perubahan ini tidak menjadi preseden buruk?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>(a) Ke direksi:</strong> "Rp 120 M bukan kerugian baru — melainkan <strong>pengakuan lebih awal</strong> atas risiko yang memang sudah ada. Ambang lama (3×) terbukti kurang sensitif dibanding peer; kita membayar 'utang kejujuran'. Laba kuartal ini turun, tetapi volatilitas laba masa depan <strong>berkurang</strong> karena deteksi lebih dini."</p>
          <p><strong>(b) Ke auditor:</strong> tunjukkan <strong>benchmark peer</strong> (bank sejenis memakai 2×), dokumentasi persetujuan komite, dan komitmen <strong>konsistensi ke depan</strong> — ambang tidak akan diubah lagi tanpa kajian independen. Auditor takut pada <em>cherry-picking</em>; jawab dengan governance.</p>
          <p><strong>(c) Preseden:</strong> tetapkan kebijakan tertulis: perubahan metodologi SICR hanya boleh atas <strong>kajian validasi independen + persetujuan dewan komisaris</strong>, maksimal 1× per tahun, dengan analisis dampak yang dipublikasikan ke OJK. Tanpa pagar ini, ambang SICR menjadi "tombol laba" — dan itu awal dari masalah besar.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kredit: PD awal 1,5%, PD kini 1,8%, DPD 35. Stage?"
        options={[
          "Stage 1 — PD naik cuma 1,2×",
          "Stage 2 — backstop DPD ≥30 hari memicu SICR apapun kata PD",
          "Stage 3",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Benar: Stage 2. Backstop 30 hari tidak bisa dinegosiasi model — jaring pengaman regulator."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa ECL lifetime BUKAN ECL 12-bulan × tenor?"
        options={[
          "Karena malas menghitung",
          "PD marginal berubah (seasoning), EAD menyusut (amortisasi), dan ada diskonto — ECL lifetime adalah 'film' per tahun, bukan 'foto' yang digandakan",
          "Regulasi melarang perkalian",
          "Tidak ada bedanya",
        ]}
        correct={1}
        explanation="Benar: tiga dinamika itu. Perkalian sederhana mengabaikan amortisasi (EAD turun), seasoning (PD turun), dan nilai waktu uang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. ECL didiskonto dengan suku bunga apa?"
        options={[
          "BI rate",
          "Suku bunga efektif (EIR) kredit itu sendiri — karena mengukur nilai kini arus kas yang hilang dari kredit tersebut",
          "Inflasi",
          "Suka-suka bank",
        ]}
        correct={1}
        explanation="Benar: EIR. 'Harga waktu' tiap kredit = bunganya sendiri. KPR 8% dan KTA 18% punya diskonto berbeda."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Komponen ECL mana yang paling sensitif (salah 10% paling mahal)?"
        options={[
          "Semua sama",
          "Skenario & EAD — kesalahan di sana paling menggerakkan ECL; validasi harus proporsional",
          "Diskonto — selalu paling penting",
          "LGD — tidak pernah salah",
        ]}
        correct={1}
        explanation="Benar: skenario (30%) & EAD (25%) dalam ilustrasi. Prinsip risk-based validation: fokuskan energi ke yang paling sensitif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 15.000 rekening DPD 30–60 masih Stage 1 karena sistem cabang belum update. Ini masalah?"
        options={[
          "Model",
          "Governance & operasional — kriteria benar tapi eksekusi bolong; solusinya staging terpusat + rekonsiliasi bulanan",
          "Data makro",
          "Tidak masalah — DPD kecil",
        ]}
        correct={1}
        explanation="Benar: rantai ECL sekuat mata rantai operasional terlemah. Rp 112,5 M CKPN kurang dari satu kesalahan implementasi — bukan dari model yang salah."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Setelah rekalibrasi model, 500 debitur pindah Stage 1→2 padahal tidak ada yang memburuk. Sikap yang benar?"
        options={[
          "Biarkan — model benar, laba memang harus turun",
          "Bedakan migrasi model vs migrasi risiko: dokumentasikan sebagai efek rekalibrasi, uji dampak staging sebelum implementasi model",
          "Batalkan rekalibrasi — terlalu mahal",
          "Sembunyikan dari direksi",
        ]}
        correct={1}
        explanation="Benar: migrasi artifisial harus diidentifikasi dan dijelaskan — bukan dibiarkan menghantam laba tanpa narasi, bukan pula dibatalkan. Setiap perubahan model wajib diuji dampak staging-nya sebelum go-live."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Kolek 2 (DPK) vs Stage 2 (PSAK 71) — hubungannya?"
        options={[
          "Sama persis — dua nama untuk satu hal",
          "Tidak 1:1 — Kolek 2 bisa Stage 1 atau 2 tergantung SICR; analis Indonesia harus fasih dua bahasa dengan rekonsiliasi yang jelas",
          "Stage 2 selalu lebih buruk dari Kolek 2",
          "Kolektibilitas sudah tidak dipakai lagi",
        ]}
        correct={1}
        explanation="Benar: dua bahasa paralel — kolektibilitas (POJK, berbasis DPD + kualitatif) dan stage (PSAK 71, berbasis SICR). Petanya tidak 1:1. Laporan yang baik menyajikan keduanya dengan rekonsiliasi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ECL = 5 komponen</strong>: PD, LGD, EAD, diskonto, skenario.</li>
          <li><strong>Stage 1</strong> = ECL 12-bulan; <strong>Stage 2/3</strong> = ECL lifetime (PD 100% untuk Stage 3).</li>
          <li><strong>Lifetime ECL = Σ PD_t × LGD_t × EAD_t / (1+r)^t</strong> — film per tahun, bukan foto × tenor.</li>
          <li><strong>Diskonto = EIR</strong>; material untuk tenor panjang (30–40% ECL KPR).</li>
          <li><strong>10% portofolio (Stage 2+3) mendominasi CKPN</strong> — akurasi staging = segalanya.</li>
          <li>Kapan TIDAK percaya ECL: staging inkonsisten antar cabang/sistem — perbaiki operasional dulu.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr13-ead-ccf" className="btn btn-secondary btn-sm">← CR13</Link>
        <Link href="/learn/cr14b-ecl-perhitungan" className="btn btn-primary btn-sm">Next: CR14b →</Link>
      </div>
    </div>
  );
}
