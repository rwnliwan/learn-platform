"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM14Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const meshData = [
    {
      x: ["Monolit tersentral<br>(tim data pusat)", "Data mesh<br>(domain + platform)"],
      y: [12, 3],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["12 minggu antre", "3 minggu"],
      textposition: "outside",
    },
  ];

  const productData = [
    {
      x: ["Discoverable", "Addressable", "Trustworthy", "Self-serve", "Interoperable"],
      y: [8.0, 7.5, 6.0, 7.0, 8.5],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["mudah ditemukan", "alamat unik", "SLO jelas", "layanan mandiri", "standar bersama"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Data product — nilai "kualitas produk", bukan "punya tabel"
# Skor tiap karakteristik 1-10. Produk data yang baik: semua tinggi & seimbang.

def nilai_produk(nama, skor):
    # skor: dict karakteristik -> 1..10
    rata = sum(skor.values()) / len(skor)
    terendah = min(skor.items(), key=lambda x: x[1])
    print(f"Produk: {nama}  (rata-rata {rata:.1f}/10)")
    for k, v in skor.items():
        bar = "#" * v + "-" * (10 - v)
        print(f"  {k:<14} [{bar}] {v}")
    print(f"  -> Titik lemah: '{terendah[0]}' ({terendah[1]}/10). Perbaiki ini dulu!")
    return rata

print("== Produk A: 'tabel_transaksi_final_v2' (punya tabel, tanpa produk mindset) ==")
nilai_produk("tabel_transaksi_final_v2", {
    "discoverable": 3, "addressable": 4, "trustworthy": 5,
    "self-serve": 2, "interoperable": 4,
})
print()
print("== Produk B: 'data-produk-transaksi' (dikelola sebagai produk) ==")
nilai_produk("data-produk-transaksi", {
    "discoverable": 9, "addressable": 9, "trustworthy": 8,
    "self-serve": 8, "interoperable": 9,
})
print()
print("Pelajaran: bedanya bukan teknologi — melainkan DISIPLIN produk:")
print("katalog, SLO, dokumentasi, standar. Itulah 'data as a product'.")
print("Coba: nilai satu tabel di kantormu dengan 5 karakteristik ini.")`;

  const lab2Code = `# Lab 2: Feature store — lawan "training-serving skew"
# Masalah: fitur saat training (batch) BEDA dengan saat serving (real-time) -> model ngaco.

# Tanpa feature store: dua kode terpisah (DRIFT menunggu waktu!)
def fitur_training(nasabah_id):
    # dihitung dari warehouse, kemarin
    return {"rata_saldo_30h": 5000000, "jml_transaksi_7h": 12}

def fitur_serving(nasabah_id):
    # dihitung dari stream, kini — LOGIKA BEDA!
    return {"rata_saldo_30h": 4800000, "jml_transaksi_7h": 15}

print("TANPA feature store:")
print("  training:", fitur_training("N001"))
print("  serving :", fitur_serving("N001"), "<- BEDA! Model dilatih di dunia lain.")
print()
# Dengan feature store: SATU definisi, dua penyajian (offline + online)
class FeatureStore:
    def definisi(self, nasabah_id):
        # SATU logika, dipakai training & serving
        return {"rata_saldo_30h": 4900000, "jml_transaksi_7h": 14}
    def offline(self, nid): return self.definisi(nid)   # batch, untuk training
    def online(self, nid):  return self.definisi(nid)   # low-latency, untuk serving

fs = FeatureStore()
print("DENGAN feature store (satu definisi):")
print("  training:", fs.offline("N001"))
print("  serving :", fs.online("N001"), "<- SAMA. Skew hilang.")
print()
print("Pelajaran: feature store = 'data contract' untuk ML (DM8):")
print("satu definisi fitur, dipakai konsisten di training & produksi.")
print("Coba: ubah definisi() — kedua jalur ikut berubah otomatis. Itulah gunanya.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM14 — Data Management</span>
        <h1 className="display-title">Arsitektur Modern:<br />Mesh, Produk Data & Toko Fitur</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Antrean 12 Minggu ke Tim Data</a></li>
          <li><a href="#mesh">Data Mesh — 4 Prinsip Desentralisasi</a></li>
          <li><a href="#product">Data Product — Data sebagai Produk</a></li>
          <li><a href="#semantic">Semantic/Metrics Layer — Satu Bahasa Angka</a></li>
          <li><a href="#feature">Feature Store — Gudang Fitur ML</a></li>
          <li><a href="#lab1">🔬 Lab 1: Nilai "Produk"-mu (5 Karakteristik)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Feature Store vs Training-Serving Skew</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Butuh Arsitektur Apa</a></li>
          <li><a href="#worked">🔢 Worked Example: Antrean 12 Minggu</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Mesh = Desentralisasi Disiplin</a></li>
          <li><a href="#lab3">🔬 Lab 3: Simulasi Antrean Sentral vs Mesh</a></li>
          <li><a href="#case">📋 Mini-Case: Mesh yang Kebablasan</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 4 prinsip data mesh dan kapan ia tepat vs berlebihan.</li>
          <li>Menilai sebuah dataset sebagai data product dengan 5 karakteristik.</li>
          <li>Menjelaskan fungsi metrics layer dalam mencegah sengketa definisi.</li>
          <li>Menjelaskan masalah training-serving skew dan cara feature store mengatasinya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Antrean 12 Minggu ke Tim Data</h2>
      <div className="story">
        <p>Perusahaan dengan 1 tim data pusat (8 orang) melayani 40 tim produk. Antrean request: <strong>12 minggu</strong>. Tim fraud butuh tabel baru "secepatnya" — dapatnya kuartal depan. Tim-tim mulai membangun <em>pipeline bayangan</em> sendiri-sendiri: 5 versi "tabel transaksi", definisi beda-beda, tidak ada yang tahu mana benar. Tim data pusat menjadi <strong>bottleneck sekaligus tidak dipercaya</strong>.</p>
        <p>Twist-nya: solusinya bukan "tambah 20 data engineer" — melainkan <strong>mengubah siapa membangun apa</strong>. <strong>Data mesh</strong> (Zhamak Dehghani, 2019) membalik model: tim domain (yang paham datanya) membangun <em>data product</em>-nya sendiri; tim platform pusat menyediakan <em>perkakas mandiri</em> (self-serve). Sentralisasi pengetahuan domain mustahil — jadi desentralisasikan pembangunnya, sentralisasikan standarnya.</p>
      </div>

      <h2 id="mesh">Data Mesh — 4 Prinsip Desentralisasi</h2>
      <ol>
        <li><strong>Domain ownership:</strong> tim yang <em>menghasilkan & paham</em> data (tim payments, tim risiko) memiliki pipeline-nya — bukan tim data pusat yang buta domain. (Jembatan DM9: owner = domain!)</li>
        <li><strong>Data as a product:</strong> tiap domain menerbitkan <em>produk data</em> — dengan SLO, dokumentasi, dukungan — bukan "tabel seadanya". Konsumen = pelanggan yang harus dilayani.</li>
        <li><strong>Self-serve platform:</strong> tim pusat berubah dari "tukang pipeline" menjadi <strong>penyedia platform</strong>: template pipeline, katalog, orkestrasi, monitoring — yang bisa dipakai mandiri tiap domain.</li>
        <li><strong>Federated governance:</strong> standar global (keamanan, interoperabilitas, definisi inti) ditetapkan bersama (council, DM9); implementasi lokal di domain.</li>
      </ol>
      <p><strong>Kepribadian:</strong> data mesh itu seperti <em>federalisme</em>: negara bagian (domain) mengatur urusannya sendiri, pemerintah federal (platform) sediakan infrastruktur & konstitusi (standar). Lawannya: kerajaan tersentral — efisien saat kecil, macet saat besar.</p>

      <PlotlyChart
        data={meshData}
        title="Waktu Tunggu Request Data: Tersentral vs Mesh (ilustratif)"
        layout={{ xaxis: { title: "Model" }, yaxis: { title: "Minggu" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = waktu dari request sampai data tersedia.</p>
        <p><strong>Interpretasi:</strong> mesh memangkas antrean karena domain melayani dirinya sendiri. <strong>Tapi</strong> (lihat mini-case): tanpa standar federasi yang kuat, kecepatan ini dibayar dengan <em>kekacauan definisi</em>. Mesh = desentralisasi <em>terdisiplin</em>, bukan anarki.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data mesh = setiap tim bebas bikin apa saja."</strong></p>
        <p><strong>Yang benar:</strong> justru mesh <em>menuntut</em> standar federasi yang kuat (prinsip 4): format interoperabel, definisi inti bersama, keamanan seragam. Tanpa itu = "data anarchy" — 40 tim, 40 definisi "pendapatan". Mesh tanpa governance = kekacauan yang terdesentralisasi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> mesh tepat saat <strong>skala organisasi</strong> (bukan skala data!) menjadi masalah: banyak domain, tim pusat jadi bottleneck. Perusahaan 50 orang dengan 1 tim data = <strong>jangan mesh</strong> — overhead-nya tidak sepadan. Aturan: <em>rasakan dulu sakitnya sentralisasi</em>, baru desentralisasi.</p>
      </div>

      <h2 id="product">Data Product — Data sebagai Produk</h2>
      <p><strong>Definisi.</strong> Data product = dataset yang dikelola <strong>seperti produk</strong>: ada pemilik, pengguna, SLO, dokumentasi, versioning, dan dukungan. Lima karakteristik (nilai di Lab 1):</p>
      <ul>
        <li><strong>Discoverable:</strong> mudah ditemukan (katalog, DM10).</li>
        <li><strong>Addressable:</strong> punya alamat/identifikasi unik & stabil.</li>
        <li><strong>Trustworthy:</strong> kualitas terukur + SLO jelas (DM7/DM8).</li>
        <li><strong>Self-serve:</strong> bisa dipakai mandiri (akses jelas, contoh query).</li>
        <li><strong>Interoperable:</strong> mengikuti standar bersama (format, definisi inti).</li>
      </ul>
      <p><strong>Bedanya dengan "tabel":</strong> tabel = artefak teknis; produk = <em>komitmen layanan</em>. "Tabel transaksi_final_v2" tanpa owner/SLO/dok = bukan produk — ia liabilitas (DM1).</p>

      <h2 id="semantic">Semantic/Metrics Layer — Satu Bahasa Angka</h2>
      <p><strong>Definisi.</strong> Metrics/semantic layer = <strong>lapisan definisi metrik tunggal</strong> antara warehouse dan tools BI: "pendapatan = SUM(...) WHERE ... " ditulis <em>sekali</em>, dipakai semua dashboard.</p>
      <p><strong>Masalah yang dibunuh:</strong> 5 dashboard, 5 definisi "pendapatan" (mini-case DM1!). Dengan metrics layer (dbt Semantic Layer, Cube, LookML): definisi hidup di <em>satu</em> tempat berversi — dashboard hanya <em>mengonsumsi</em>.</p>
      <p><strong>Kenapa ini "governance yang tereksekusi":</strong> glossary (DM10) = definisi di dokumen; metrics layer = definisi di <em>kode yang dijalankan</em>. Yang kedua tidak bisa "lupa diikuti".</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> metrics layer adalah <strong>jembatan DM10 (glossary) → DM5 (dbt)</strong>: definisi bisnis yang bisa dieksekusi mesin. Jika organisasimu masih debat angka antar dashboard, ini obat paling manjur — sebelum data mesh, sebelum AI.</p>
      </div>

      <h2 id="feature">Feature Store — Gudang Fitur ML</h2>
      <p><strong>Masalah: training-serving skew.</strong> Model dilatih dengan fitur dari warehouse (batch, kemarin) tapi serving memakai fitur dari stream (real-time, kini) — <strong>logika perhitungannya beda</strong> → model "bekerja" di training, ngaco di produksi. Ini pembunuh model ML #1 yang tidak terlihat di metrik training.</p>
      <p><strong>Definisi.</strong> Feature store = repositori <strong>definisi fitur tunggal</strong> dengan dua penyajian: <strong>offline store</strong> (batch, untuk training) dan <strong>online store</strong> (low-latency, untuk serving) — <em>dari logika yang sama</em> (Lab 2). Contoh: Feast, Tecton, Databricks Feature Store.</p>
      <p><strong>Bonus:</strong> fitur yang sudah ada bisa <strong>dipakai ulang</strong> antar model (tidak reinvent "rata_saldo_30h" 5×), lengkap dengan dokumentasi & versioning — persis filosofi data product untuk ML.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Feature store = database cepat untuk ML."</strong></p>
        <p><strong>Yang benar:</strong> kecepatan (online store) hanya separuh cerita. Nilai intinya = <strong>konsistensi definisi</strong> training vs serving + reuse + governance fitur. Database cepat tanpa definisi tunggal = skew yang cepat.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Nilai "Produk"-mu (5 Karakteristik)</h2>
      <p>Skor dua dataset sebagai produk data — rasakan bedanya tabel vs produk.</p>
      <PyodideLab
        title="Lab 1 — Dari Tabel ke Produk"
        hint="Coba: nilai satu tabel di kantormu. Karakteristik apa yang paling rendah? Itulah PR pertamamu."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Feature Store vs Training-Serving Skew</h2>
      <p>Simulasikan skew yang membunuh model, lalu sembuhkan dengan definisi tunggal.</p>
      <PyodideLab
        title="Lab 2 — Satu Definisi, Dua Penyajian"
        hint="Coba: ubah definisi() di FeatureStore. Kedua jalur ikut berubah — itulah konsistensi."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Butuh Arsitektur Apa</h2>

      <div className="decision-card">
        <h3>1. Tim data pusat jadi bottleneck (antrean berminggu-minggu) → <strong>pertimbangkan mesh</strong></h3>
        <p><strong>Kondisi:</strong> banyak domain, skala organisasi besar.</p>
        <p><strong>Kenapa:</strong> desentralisasi pembangun + self-serve platform. Tapi wajib prinsip 4 (federated governance).</p>
      </div>

      <div className="decision-card">
        <h3>2. Dashboard beda-beda angkanya → <strong>metrics layer dulu</strong></h3>
        <p><strong>Kondisi:</strong> sengketa definisi antar tim.</p>
        <p><strong>Kenapa:</strong> satu definisi tereksekusi &gt; 10 dokumen glossary. Obat termurah sebelum restrukturisasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Model ML ngaco di produksi padahal training bagus → <strong>cek skew → feature store</strong></h3>
        <p><strong>Kondisi:</strong> metrik training ≠ produksi.</p>
        <p><strong>Kenapa:</strong> 90% kasus = definisi fitur beda. Satu definisi, dua store.</p>
      </div>

      <div className="decision-card">
        <h3>4. Organisasi kecil (&lt;100 orang, 1 tim data) → <strong>JANGAN mesh</strong></h3>
        <p><strong>Kondisi:</strong> belum rasakan sakit sentralisasi.</p>
        <p><strong>Kenapa:</strong> overhead federasi &gt; manfaat. Fokus: warehouse rapi + dbt + katalog.</p>
      </div>

      <div className="decision-card">
        <h3>5. Dataset dipakai banyak tim tanpa owner → <strong>angkat jadi data product</strong></h3>
        <p><strong>Kondisi:</strong> tabel populer tapi tak terurus.</p>
        <p><strong>Kenapa:</strong> beri owner + SLO + dokumentasi (5 karakteristik). Produk &gt; tabel.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Mesh = obat skala organisasi</strong>, bukan default. Rasakan sakitnya dulu.</li>
          <li><strong>Mesh tanpa federated governance = anarki.</strong></li>
          <li><strong>Metrics layer</strong> sebelum debat definisi berikutnya.</li>
          <li><strong>Feature store</strong> = konsistensi definisi ML, bukan sekadar cepat.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Antrean 12 Minggu — Matematika Bottleneck</h2>
      <p>Tim data pusat: 8 engineer, tiap request domain butuh rata-rata <strong>3 minggu</strong> kerja. Request masuk: <strong>4 per minggu</strong> dari 6 domain. Antrean stabil di <strong>12 minggu</strong>. Ikuti hitungannya — lalu lihat apa yang berubah dengan data mesh.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Hukum Little: kenapa antrean 12 minggu tak terhindarkan (klik untuk buka)</summary>
        <p>Kapasitas tim: <Tex math={String.raw`\mu = \frac{8 \text{ orang}}{3 \text{ minggu}} \approx 2{,}67 \text{ request/minggu}`} />. Kedatangan: <Tex math={String.raw`\lambda = 4 \text{ request/minggu}`} />.</p>
        <p><Tex math={String.raw`\rho = \frac{\lambda}{\mu} = \frac{4}{2{,}67} = 1{,}5 > 1`} block /></p>
        <p>Utilisasi 150% = <strong>sistem tidak stabil</strong>: antrean tumbuh <em>tanpa batas</em> (tambah 1,33 request/minggu selamanya). Antrean 12 minggu bukan "tim lambat" — ia <strong>matematika</strong>. Solusi: naikkan μ (tambah orang — mahal, lambat) atau turunkan λ (kurangi request ke tim pusat). <strong>Data mesh memilih yang kedua</strong>: domain mengerjakan sendiri, λ ke tim pusat turun.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Mesh: berapa banyak yang pindah ke domain?</summary>
        <p>Setelah mesh: tiap domain punya 2 data engineer sendiri (12 orang total di domain). 70% request (standar: pipeline domain sendiri) dikerjakan domain; 30% (platform, keamanan, lintas-domain) tetap ke tim pusat (kini jadi <strong>platform team</strong>).</p>
        <p><Tex math={String.raw`\lambda_{\text{pusat}} = 4 \times 0{,}3 = 1{,}2 \text{/minggu} < \mu = 2{,}67 \checkmark`} /></p>
        <p><Tex math={String.raw`\rho = \frac{1{,}2}{2{,}67} = 0{,}45`} /> → antrean rata-rata (M/M/1): <Tex math={String.raw`W_q = \frac{\rho}{\mu(1-\rho)} = \frac{0{,}45}{2{,}67 \times 0{,}55} \approx 0{,}3 \text{ minggu} \approx 2 \text{ hari}`} block /></p>
        <p><strong>12 minggu → 2 hari</strong> untuk request platform. Request domain: dikerjakan tetangga sendiri, tanpa antre pusat sama sekali. Total headcount naik 8 → 20 — tapi <strong>throughput naik 3× lipat</strong> karena paralelisme domain. Inilah inti mesh: bukan "tanpa tim pusat", tapi <strong>tim pusat berhenti jadi bottleneck</strong>.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Semantic layer: 1 definisi vs 47 dashboard (DM16!)</summary>
        <p>Tanpa semantic layer: 47 dashboard × definisi "pendapatan" sendiri-sendiri. Rata-rata tiap dashboard butuh <strong>4 jam/bulan</strong> rekonsiliasi "kenapa beda dengan dashboard sebelah" = 188 jam/bulan = <strong>Rp37,6 juta/bulan</strong> (Rp200.000/jam).</p>
        <p>Dengan semantic layer (1 definisi <code className="inline">pendapatan</code> berversi, dipakai semua): rekonsiliasi → ~0. Biaya bangun: 1 FTE 3 bulan ≈ <strong>Rp150 juta</strong>. Payback: <Tex math={String.raw`150/37{,}6 \approx 4 \text{ bulan}`} />. Plus manfaat tak terukur: direksi berhenti debat definisi (DM10: glossary dalam bentuk executable!).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Feature store: harga training-serving skew</summary>
        <p>Model churn dilatih dengan fitur <code className="inline">rata_saldo_30h</code> dari warehouse (batch, T+1), tapi serving menghitung dari stream (real-time). Skew: 12% prediksi salah arah karena definisi "30 hari" beda (kalender vs 720 jam!). Dampak: 12% × 10.000 prediksi/hari × Rp50.000 biaya intervensi salah = <strong>Rp60 juta/hari</strong> terbuang.</p>
        <p>Feature store: <strong>1 definisi fitur, 2 penyajian</strong> (offline untuk training, online untuk serving, dari <em>kode yang sama</em>). Skew → 0. Biaya: infrastruktur + disiplin definisi. <strong>Pelajaran: di ML, "data" = fitur; inkonsistensi fitur = model berbohong pada dirinya sendiri.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> 4 prinsip mesh dalam 1 kalimat: <strong>domain memiliki datanya</strong> (bukan tim pusat), <strong>data sebagai produk</strong> (ada pemilik, SLA, konsumen — DM8!), <strong>platform self-service</strong> (tim pusat = AWS-nya internal), <strong>federated governance</strong> (aturan global minimal + otonomi lokal — DM9). Yang paling sering gagal = prinsip 1 tanpa 3: domain disuruh mandiri tapi tidak diberi platform → mereka bangun 6 "platform" sendiri-sendiri = kekacauan terdistribusi.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Platform team: 1 tim melayani 20 domain</summary>
        <p>Platform team (8 orang) menyediakan: template pipeline, katalog, guardrail keamanan, CI/CD. 20 domain × 2 data product = 40 pipeline berjalan <strong>tanpa</strong> 40 tim platform.</p>
        <p><Tex math={String.raw`\text{leverage} = \frac{40 \text{ pipeline}}{8 \text{ orang}} = 5 \text{ pipeline/orang}`} block /></p>
        <p>Bandingkan model lama: 8 orang mengerjakan request 1 per 1 (2,67/minggu). <strong>Mesh memindahkan tim pusat <em>ke atas</em> (leverage 5×), bukan menghilangkannya.</strong> Tim pusat yang dibubarkan = 20 domain membangun 20 "platform" ala kadarnya = biaya 20×.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Mesh = Desentralisasi dengan Disiplin</h2>
      <p>Data mesh sering disalahartikan sebagai "bubar tim data". Yang benar: <strong>reorganisasi siapa melayani siapa</strong>.</p>
      <ul>
        <li><strong>Sentralisasi vs desentralisasi = trade-off konsistensi vs kecepatan.</strong> Tim pusat: 1 definisi pendapatan (konsisten!) tapi antre 12 minggu (lambat!). Mesh: tiap domain cepat, risiko 6 definisi pendapatan (inkonsisten!). <strong>Federated governance + semantic layer</strong> = penyeimbangnya: otonomi lokal untuk <em>kecepatan</em>, kontrak global untuk <em>hal yang harus sama</em> (definisi kunci, keamanan, kualitas minimal). Desentralisasi tanpa federasi = anarki; sentralisasi tanpa otonomi = birokrasi.</li>
        <li><strong>"Data sebagai produk" = punya product manager-nya.</strong> Produk tanpa PM = fitur ngawur. Data product yang serius punya: <strong>nama pemilik</strong>, <strong>dokumen pengguna</strong> (bukan untuk engineer — untuk konsumen!), <strong>SLA</strong> (DM8), <strong>changelog</strong>, dan <strong>pengukuran kepuasan konsumen</strong> (NPS internal!). Kalau "data product"-mu tidak ada yang mengukur kepuasan pemakainya, itu tabel biasa berkostum produk.</li>
        <li><strong>Kapan TIDAK butuh mesh (mini-case "mesh yang kebablasan"!):</strong> &lt;50 orang data, &lt;5 domain, 1 warehouse cukup → mesh = overhead (federated governance untuk 3 tim = rapat yang tidak perlu). <strong>Aturan praktis: mulai mesh saat antrean ke tim pusat &gt; 4 minggu <em>dan</em> domain punya ≥2 engineer yang mampu mandiri.</strong> Di bawah itu: monolit yang rapi (warehouse + dbt + kontrak) menang telak.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola adopsi bertahap yang bekerja — <strong>"mesh tipis"</strong>: (1) tetapkan 3–5 data product per domain prioritas (bukan semua!), (2) bangun platform self-service minimal (template pipeline + katalog, DM10), (3) federated governance untuk 10 aturan global saja. Ukur: antrean request &amp; waktu-ke-insight per domain. Yang gagal = "big bang mesh": reorganisasi 200 orang sekaligus tanpa platform siap → 6 bulan kekacauan → kembali ke sentralisasi dengan trauma.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data mesh = tidak perlu tim data pusat lagi."</strong></p>
        <p><strong>Yang benar:</strong> mesh <em>membutuhkan</em> tim platform pusat yang <strong>lebih kuat</strong> dari sebelumnya — karena kini melayani 20 tim mandiri, bukan mengerjakan request satu per satu. Bedanya: dari <em>tukang</em> (mengerjakan pipeline orang) menjadi <em>pabrik perkakas</em> (menyediakan template, katalog, guardrail). Tim pusat yang dibubarkan = domain membangun sendiri-sendiri = 6 duplikasi platform = biaya 6×. Mesh memindahkan tim pusat <em>ke atas</em> (leverage), bukan menghilangkannya.</p>
      </div>

      <div className="callout">
        <h3>📜 10 Aturan Global Federated Governance (contoh konkret)</h3>
        <p>Federasi = sedikit aturan global yang <em>tidak bisa ditawar</em> + otonomi untuk sisanya. Contoh 10 aturan yang bekerja:</p>
        <ol>
          <li><strong>Klasifikasi data wajib</strong> (public/internal/confidential/restricted) — tanpa ini, keamanan (DM12) tidak bisa otomatis.</li>
          <li><strong>Definisi 20 metrik inti</strong> di semantic layer — 1 arti "pendapatan" untuk semua domain.</li>
          <li><strong>Kontrak untuk data product</strong> yang dipakai &gt;1 domain (DM8) — pemilik + SLA + changelog.</li>
          <li><strong>Test kualitas minimal</strong> di pintu Gold: unik, not-null, rekonsiliasi (DM7).</li>
          <li><strong>Lineage otomatis</strong> untuk semua pipeline produksi (DM10).</li>
          <li><strong>Retensi &amp; hak hapus</strong> mengikuti kebijakan pusat (DM12).</li>
          <li><strong>Penamaan &amp; katalog</strong>: semua tabel terdaftar + pemilik terisi.</li>
          <li><strong>Enkripsi &amp; akses</strong>: standar keamanan minimum per klasifikasi.</li>
          <li><strong>Audit trail</strong>: siapa mengubah apa, kapan — untuk semua data product.</li>
          <li><strong>Proses pengecualian</strong>: cara resmi meminta dispensasi (dengan expiry!) — aturan tanpa jalan keluar = aturan yang dilanggar diam-diam.</li>
        </ol>
        <p><strong>Di luar 10 ini: otonomi penuh.</strong> Domain memilih tool, jadwal, dan modelnya sendiri. Federasi yang mendaftar 50 aturan = sentralisasi berkedok mesh.</p>
      </div>

      <div className="callout">
        <h3>📦 Contoh Spesifikasi Data Product (1 halaman)</h3>
        <p><strong>Nama:</strong> <code className="inline">penjualan_bersih_harian</code> &nbsp;|&nbsp; <strong>Domain:</strong> Revenue &nbsp;|&nbsp; <strong>Pemilik:</strong> Tim Revenue Analytics</p>
        <ul>
          <li><strong>Konsumen &amp; keputusan:</strong> direksi (review mingguan), tim finance (closing bulanan) — keputusan: target vs realisasi.</li>
          <li><strong>Kontrak:</strong> grain 1 kategori × 1 hari; SLA siap 06.00; SLO 95%; definisi "bersih" = gross − retur − diskon.</li>
          <li><strong>Kualitas:</strong> 5 test (unik, not-null, rekonsiliasi ke GL ±5 bps); kelengkapan ≥ 99,5%.</li>
          <li><strong>Akses:</strong> klasifikasi internal; role <code className="inline">analis</code> baca, <code className="inline">publik</code> tidak.</li>
          <li><strong>Siklus hidup:</strong> retensi 3 tahun → arsip; changelog tiap perubahan; deprecation 30 hari.</li>
          <li><strong>Umpan balik:</strong> NPS konsumen diukur tiap kuartal (target ≥ 8).</li>
        </ul>
        <p>6 poin ini = <strong>bedanya "tabel" vs "produk"</strong>. Produk tanpa konsumen terdaftar + SLA + NPS = tabel berkostum. Tulis 1 halaman ini <em>sebelum</em> membangun pipeline — ia adalah desainnya.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Simulasi Antrean — Sentral vs Mesh</h2>
      <p>Buktikan Hukum Little: simulasikan 26 minggu request, lihat antrean meledak vs stabil.</p>
      <PyodideLab
        title="Lab 3 — Matematika Bottleneck"
        hint="Coba: ubah KE_PUSAT dari 0.3 ke 0.6 (mesh setengah hati). Di titik berapa antrean mulai meledak lagi? (Petunjuk: saat λ > μ.)"
        defaultCode={`# Lab 3: simulasi antrean request data (26 minggu)
import random
random.seed(11)

MINGGU = 26
LAMDA = 4.0        # request/minggu masuk
KAPASITAS = 8/3    # tim pusat: 8 orang / 3 minggu per request
KE_PUSAT = 0.3     # mesh: 30% request tetap ke pusat

def simulasi(lamda_ke_pusat):
    antrean = 0
    total_tunggu = 0
    n = 0
    maks = 0
    for _ in range(MINGGU):
        datang = sum(1 for _ in range(20) if random.random() < lamda_ke_pusat/20)
        antrean += datang
        # kapasitas: kerjakan min(antrean, kapasitas) per minggu
        selesai = min(antrean, KAPASITAS + random.uniform(-0.5, 0.5))
        antrean -= selesai
        total_tunggu += antrean; n += 1; maks = max(maks, antrean)
    return total_tunggu/n, maks

rata_sentral, maks_sentral = simulasi(LAMDA)            # semua ke pusat
rata_mesh, maks_mesh = simulasi(LAMDA * KE_PUSAT)       # mesh

print(f"Sentralisasi (λ={LAMDA:.1f} > μ={KAPASITAS:.2f}): antrean rata-rata {rata_sentral:.1f} mgg, maks {maks_sentral:.0f}")
print(f"Mesh (λ={LAMDA*KE_PUSAT:.1f} < μ={KAPASITAS:.2f})      : antrean rata-rata {rata_mesh:.1f} mgg, maks {maks_mesh:.0f}")
print()
print("Saat λ > μ, antrean TUMBUH TANPA BATAS (12 minggu hanyalah awal).")
print("Mesh bukan soal teknologi — soal memindahkan λ ke bawah μ.")`}
      />

      <h2 id="case">📋 Mini-Case: Mesh yang Kebablasan</h2>
      <div className="callout">
        <p>Perusahaan mengadopsi "data mesh" — tiap dari 12 domain membangun pipeline sendiri, <strong>tanpa</strong> platform self-serve dan <strong>tanpa</strong> standar federasi ("biar agile!"). Setahun kemudian: 12 definisi "pengguna aktif", 3 format tanggal, 2 tim membeli tool duplikat, dan tidak ada yang bisa jawab "total pendapatan perusahaan" tanpa rapat 5 tim.</p>
        <p><strong>Pertanyaan:</strong> (a) Prinsip mesh mana yang dilanggar? (b) Apakah solusinya "kembali tersentral"? (c) Langkah perbaikan konkret?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Prinsip 3 & 4</strong>: tanpa self-serve platform (tiap tim reinvent) dan tanpa federated governance (tanpa standar) — yang terjadi bukan mesh, melainkan anarki.</p>
          <p>(b) <strong>Tidak.</strong> Masalahnya bukan desentralisasi, melainkan <em>desentralisasi tanpa disiplin</em>. Kembali tersentral = kembali ke antrean 12 minggu.</p>
          <p>(c) <strong>Bangun yang hilang:</strong> (1) council tetapkan 10 definisi inti + standar format (DM9/DM10); (2) tim platform sediakan template pipeline + katalog (DM5/DM10); (3) metrics layer untuk metrik lintas-domain. Domain tetap membangun — di atas rel yang sama.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: Hukum Little, efek mesh, dan ekonomi semantic layer.</p>

      <details className="worked">
        <summary>Soal 1 — Little: request λ=5/minggu, kapasitas tim μ=3/minggu. Berapa utilisasi? Sistem stabil?</summary>
        <p><Tex math={String.raw`\rho = 5/3 \approx 1{,}67 > 1`} block /></p>
        <p><strong>Tidak stabil</strong> — antrean tumbuh tanpa batas (+2 request/minggu selamanya). Antrean 12 minggu bukan "tim lambat", ia <strong>matematika</strong>.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Mesh: 65% request pindah ke domain. Berapa λ ke tim pusat? Berapa utilisasi &amp; antrean rata-rata (M/M/1)?</summary>
        <p><Tex math={String.raw`\lambda = 5 \times 0{,}35 = 1{,}75\text{/minggu}; \quad \rho = 1{,}75/3 \approx 0{,}58`} /></p>
        <p><Tex math={String.raw`W_q = \frac{0{,}58}{3 \times 0{,}42} \approx 0{,}46 \text{ minggu} \approx 3 \text{ hari`} block /></p>
        <p><strong>12 minggu → 3 hari.</strong> Mesh bukan soal teknologi — soal memindahkan λ ke bawah μ.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Semantic layer: 8 definisi "pendapatan" × 5 jam rekonsiliasi/bulan × Rp200.000. Berapa biaya/bulan? Jika membangun semantic layer Rp120 juta, berapa payback?</summary>
        <p><Tex math={String.raw`8 \times 5 \times 200.000 = \text{Rp}8 \text{ jt/bulan}`} /> → payback <Tex math={String.raw`120/8 = 15 \text{ bulan}`} block /></p>
        <p>15 bulan — plus manfaat tak terukur (direksi berhenti debat definisi). <strong>Satu definisi executable &gt; 8 definisi di kepala orang.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Empat prinsip data mesh?"
        options={[
          "Domain ownership, data as a product, self-serve platform, federated governance",
          "Satu warehouse, satu tim, satu tool, satu laporan",
          "Semua tersentral",
          "Tanpa governance",
        ]}
        correct={0}
        explanation="Benar: desentralisasi pembangun (1-2) + sentralisasi kemampuan & standar (3-4). Hilang satu = pincang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kapan data mesh TIDAK tepat?"
        options={[
          "Perusahaan besar dengan banyak domain",
          "Organisasi kecil (1 tim data, belum ada bottleneck) — overhead federasi tidak sepadan; rasakan sakitnya dulu",
          "Saat butuh kecepatan",
          "Tidak pernah salah",
        ]}
        correct={1}
        explanation="Benar: mesh = obat skala organisasi. Untuk tim kecil: warehouse rapi + dbt + katalog sudah cukup."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Bedanya 'tabel' vs 'data product'?"
        options={[
          "Ukuran file",
          "Produk = komitmen layanan: owner + SLO + dokumentasi + versioning + dukungan; tabel = artefak teknis tanpa janji",
          "Harga",
          "Tidak ada beda",
        ]}
        correct={1}
        explanation="Benar: produk diukur dari 5 karakteristik (Lab 1). Tabel tanpa itu = liabilitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Lima dashboard menunjukkan 5 angka 'pendapatan' berbeda. Obat paling manjur?"
        options={[
          "Rapat mingguan menyamakan",
          "Metrics layer: definisi ditulis sekali di kode berversi, dikonsumsi semua dashboard — definisi tereksekusi, bukan dokumen",
          "Hapus 4 dashboard",
          "Rata-ratakan kelimanya",
        ]}
        correct={1}
        explanation="Benar: glossary di dokumen bisa 'lupa diikuti'; metrics layer tidak bisa — ia yang dijalankan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Model ML akurat di training tapi ngaco di produksi. Dugaan pertama?"
        options={[
          "Data training kurang",
          "Training-serving skew: definisi fitur beda antara pipeline training & serving — obatnya feature store (satu definisi, dua store)",
          "Model terlalu kecil",
          "Server kurang",
        ]}
        correct={1}
        explanation="Benar: pembunuh #1 yang tak terlihat di metrik training. Feature store = data contract untuk ML."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Perusahaan 'mesh' tanpa standar federasi berakhir kacau. Diagnosis?"
        options={[
          "Mesh memang selalu gagal",
          "Itu bukan mesh — prinsip 3 (self-serve platform) & 4 (federated governance) dilanggar; yang terjadi anarki terdesentralisasi",
          "Kurang domain",
          "Terlalu banyak governance",
        ]}
        correct={1}
        explanation="Benar: mesh = desentralisasi TERdisiplin. Solusinya lengkapi yang hilang, bukan kembali tersentral."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Data mesh:</strong> 4 prinsip — domain own, produk, self-serve platform, federated governance. Obat skala organisasi.</li>
          <li><strong>Data product:</strong> discoverable, addressable, trustworthy, self-serve, interoperable.</li>
          <li><strong>Metrics layer:</strong> satu definisi tereksekusi untuk semua dashboard — akhir sengketa angka.</li>
          <li><strong>Feature store:</strong> satu definisi fitur untuk training & serving — bunuh skew.</li>
          <li><strong>Jangan:</strong> mesh untuk tim kecil; mesh tanpa standar; samakan cepat dengan konsisten.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm13-data-risiko-regulasi" className="btn btn-secondary btn-sm">← DM13</Link>
        <Link href="/learn/dm15-cloud-dataops" className="btn btn-primary btn-sm">Next: DM15 →</Link>
      </div>
    </div>
  );
}
