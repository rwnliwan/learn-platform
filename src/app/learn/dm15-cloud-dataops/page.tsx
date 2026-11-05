"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM15Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const costData = [
    {
      x: ["Compute", "Storage", "Network<br>egress", "Lainnya"],
      y: [55, 20, 15, 10],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1", "#e8a838", "#94a3b8"] },
      text: ["55%", "20%", "15%", "10%"],
      textposition: "outside",
    },
  ];

  const rpoData = [
    {
      x: ["Backup harian", "Replikasi<br>antar-region", "Multi-region<br>aktif-aktif"],
      y: [24, 0.25, 0.01],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["RPO 24 jam", "RPO 15 mnt", "RPO ~detik"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: FinOps — bedah tagihan cloud data (angka ilustratif)
# Total: $12.400/bln. Di mana pemborosannya?

tagihan = {
    "warehouse compute (24/7)": 5200,
    "warehouse compute (idle malam)": 1600,   # <- ?
    "storage (hot, 80 TB)": 1900,
    "storage (bisa archive, 40 TB)": 920,     # <- ?
    "egress antar-region": 1100,              # <- ?
    "dashboard refresh tiap 5 mnt": 680,      # <- ?
}

total = sum(tagihan.values())
print(f"Total: \${total:,}/bln")
print()
print("Kandidat penghematan:")
hemat = 0
rencana = [
    ("warehouse compute (idle malam)", "auto-suspend + schedule: hemat 70%", 0.70),
    ("storage (bisa archive, 40 TB)", "pindah ke archive tier: hemat 80%", 0.80),
    ("egress antar-region", "proses di region sama: hemat 60%", 0.60),
    ("dashboard refresh tiap 5 mnt", "refresh per jam: hemat 80%", 0.80),
]
for nama, aksi, pct in rencana:
    h = tagihan[nama] * pct
    hemat += h
    print(f"  - {nama}: \${tagihan[nama]:,} -> {aksi} (-\${h:,.0f})")
print()
print(f"Potensi hemat: \${hemat:,.0f}/bln ({hemat/total*100:.0f}%) -> \${total-hemat:,.0f}/bln")
print()
print("Pelajaran: 80% pemborosan = keputusan ARSITEKTUR (idle, tier, region, refresh),")
print("bukan 'nego harga'. FinOps = desain + disiplin, bukan kupon diskon.")
print("Coba: refresh dashboard per 15 mnt (hemat 50% bukan 80%) — total baru?")`;

  const lab2Code = `# Lab 2: RPO/RTO — pilih strategi backup sesuai "mahal-nya downtime"
# Rumus: biaya proteksi harus < ekspektasi kerugian.

def analisis(nama, rpo_jam, rto_jam, biaya_bln, rugi_per_jam):
    ekspektasi_rugi = rpo_jam * rugi_per_jam / 30  # amortisasi kasar per bulan
    print(f"{nama}:")
    print(f"  RPO {rpo_jam} jam | RTO {rto_jam} jam | biaya \${biaya_bln}/bln")
    print(f"  Ekspektasi rugi data/bln: ~\${ekspektasi_rugi:,.0f}")
    print(f"  Putusan: {'SEIMBANG ✅' if biaya_bln < ekspektasi_rugi * 3 else 'KEMAHALAN ⚠'}")
    print()

print("Skenario: core banking (rugi downtime $50.000/jam)")
analisis("Backup harian", 24, 8, 500, 50000)
analisis("Replikasi antar-region", 0.25, 1, 8000, 50000)
print("Skenario: data lake analitik (rugi $500/jam)")
analisis("Backup harian", 24, 8, 500, 500)
analisis("Replikasi antar-region", 0.25, 1, 8000, 500)
print("Pelajaran: strategi DR mengikuti NILAI data — bukan satu pola untuk semua.")
print("Coba: rugi $5.000/jam — strategi mana yang seimbang?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM15 — Data Management</span>
        <h1 className="display-title">Cloud & DataOps:<br />Infrastruktur sebagai Kode, Tagihan Terkendali</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tagihan $48.000 di Bulan Pertama</a></li>
          <li><a href="#storage">Object Storage — Fondasi Tak Terlihat</a></li>
          <li><a href="#iac">IaC — Infrastruktur sebagai Kode</a></li>
          <li><a href="#cicd">CI/CD untuk Data — Deploy Pipeline Tanpa Doa</a></li>
          <li><a href="#finops">FinOps — Tagihan sebagai Metrik Teknik</a></li>
          <li><a href="#dr">Backup & DR — RPO/RTO</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bedah Tagihan (FinOps Praktis)</a></li>
          <li><a href="#lab2">🔬 Lab 2: RPO/RTO — Seimbang atau Kemahalan?</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Operasional Data</a></li>
          <li><a href="#worked">🔢 Worked Example: Bedah $48.000</a></li>
          <li><a href="#intuisi">🧠 Intuisi: IaC = Jangan Klik, Tulis</a></li>
          <li><a href="#lab3">🔬 Lab 3: Kalkulator Kontrak DR</a></li>
          <li><a href="#case">📋 Mini-Case: Deploy Jumat Sore yang Menghapus Partisi</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan peran object storage dan tiering dalam arsitektur data modern.</li>
          <li>Menjelaskan manfaat Infrastructure as Code untuk environment data.</li>
          <li>Merancang pipeline CI/CD untuk dbt/pipeline: test → review → deploy bertahap.</li>
          <li>Menghitung trade-off biaya cloud dan memilih strategi backup/DR via RPO/RTO.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Tagihan $48.000 di Bulan Pertama</h2>
      <div className="story">
        <p>Perusahaan migrasi ke cloud dengan semangat "pay as you go". Bulan pertama: <strong>$48.000</strong> — 6× anggaran. Penyebab: warehouse menyala 24/7 tanpa auto-suspend, 40 TB data dingin di tier panas, dashboard refresh tiap 5 menit, dan transfer data antar-region yang tidak disadari. Tidak ada yang "salah" secara teknis — semua "bekerja". Hanya saja <em>tidak ada yang memiliki tagihannya</em>.</p>
        <p>Twist-nya: cloud tidak mahal — <strong>cloud yang tidak dikelola</strong> yang mahal. "Pay as you go" juga berarti "pay for every mistake, every minute". Lesson ini tentang DataOps: memperlakukan infrastruktur data seperti software (kode, test, deploy aman) <em>dan</em> memperlakukan tagihan seperti metrik teknik yang dipantau — bukan kejutan akhir bulan.</p>
      </div>

      <h2 id="storage">Object Storage — Fondasi Tak Terlihat</h2>
      <p><strong>Definisi.</strong> Object storage (S3, GCS, Azure Blob) = penyimpanan <em>nyaris tak terbatas</em>, murah, diakses via API — fondasi data lake modern (DM4). Bukan filesystem (tidak ada folder beneran — "folder" = prefix nama), bukan database.</p>
      <p><strong>Tiering:</strong> hot (sering diakses) → cool → archive (murah, lambat diambil). <strong>Lifecycle policy otomatis:</strong> "objek &gt;90 hari → cool; &gt;1 tahun → archive". Data dingin di tier panas = membakar uang (Lab 1).</p>
      <p><strong>Dua biaya siluman:</strong> (1) <strong>egress</strong> — keluar data antar-region/internet <em>bayar mahal</em> (masuk gratis!); (2) <strong>request</strong> — jutaan GET kecil-kecil menumpuk. Desain: proses di region yang sama dengan data; gabungkan file kecil (compaction).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> aturan emas cloud storage: <strong>"data diam = murah, data bergerak = mahal"</strong>. Setiap arsitektur yang memindahkan data bolak-balik antar-region harus bisa menjelaskan kenapa — karena tagihannya menjelaskan sendiri.</p>
      </div>

      <h2 id="iac">IaC — Infrastruktur sebagai Kode</h2>
      <p><strong>Definisi.</strong> Infrastructure as Code (Terraform, Pulumi) = infrastruktur <strong>didefinisikan dalam file berversi</strong>, bukan diklik di console. <code className="inline">terraform apply</code> membangun; git mencatat <em>siapa mengubah apa</em>.</p>
      <p><strong>Kenapa untuk data:</strong> (1) <strong>reproducibility</strong> — environment dev/staging/prod identik ("di laptop saya bisa" mati); (2) <strong>audit</strong> — siapa membuka akses bucket X? lihat git; (3) <strong>disaster recovery</strong> — infrastruktur bisa dibangun ulang dari kode dalam jam; (4) <strong>review</strong> — perubahan infra di-review seperti kode.</p>
      <p><strong>Cakupan untuk data engineer:</strong> tidak perlu jadi ahli Terraform — cukup paham: bucket + lifecycle policy, warehouse + auto-suspend, IAM role, secret di secret manager ( <strong>jangan di kode!</strong> ). Lowongan 2026 menulis "Terraform" sebagai <em>preferred</em> — nilai plus nyata.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Klik console lebih cepat daripada nulis Terraform."</strong></p>
        <p><strong>Yang benar:</strong> untuk <em>satu</em> resource, ya. Untuk <em>organisasi</em>: klik = tidak terekam, tidak ter-review, tidak terreproduksi, dan "kok di prod beda dengan staging?" selamanya. Kecepatan klik dibayar dengan <strong>utang operasional</strong> berbunga harian.</p>
      </div>

      <h2 id="cicd">CI/CD untuk Data — Deploy Pipeline Tanpa Doa</h2>
      <p><strong>CI (Continuous Integration):</strong> tiap pull request → <strong>test otomatis</strong>: dbt test, SQL lint, <em>data test</em> di sample (DM7!), dan <strong>plan/preview</strong> ("perubahan ini akan mengubah tabel X"). Merge hanya jika hijau.</p>
      <p><strong>CD (Continuous Deployment):</strong> deploy bertahap: dev → staging → prod, dengan <strong>gate</strong>: test lolos + approval manusia untuk yang kritis. Untuk data: deploy = versi pipeline/dbt baru — <strong>bukan</strong> overwrite data prod tanpa ampun.</p>
      <p><strong>Spesifik data (beda dengan app biasa):</strong></p>
      <ul>
        <li><strong>Backward compatibility:</strong> perubahan model tidak boleh merusak downstream (kontrak! DM8) — CI cek breaking change.</li>
        <li><strong>Blue/green tabel:</strong> tulis ke tabel baru, validasi, baru swap — bukan timpa langsung.</li>
        <li><strong>Rollback data:</strong> via time travel (Delta/Iceberg, DM4) atau snapshot — "deploy salah" bisa di-undo.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> CI/CD data = <strong>kepercayaan untuk bergerak cepat</strong>. Tanpa test otomatis, tiap deploy = doa; dengan test, deploy Jumat sore pun tenang (mini-case menunjukkan sebaliknya!). Investasi test = kebebasan bergerak.</p>
      </div>

      <h2 id="finops">FinOps — Tagihan sebagai Metrik Teknik</h2>
      <p><strong>Definisi.</strong> FinOps = disiplin mengelola biaya cloud sebagai <strong>tanggung jawab bersama</strong> (bukan "urusan finance"): tagihan <strong>diatribusikan per tim/produk</strong> (tagging!), dipantau seperti metrik, ada budget + alert.</p>
      <p><strong>Anatomi tagihan data</strong> (lihat chart): compute mendominasi — dan compute = <strong>keputusan arsitektur</strong> (auto-suspend? ukuran warehouse? refresh dashboard?).</p>
      <Tex math={String.raw`\text{Biaya compute} = \text{ukuran} \times \text{durasi nyala} \times \text{tarif}`} block />
      <p>Tiga tuas: kecilkan ukuran (right-sizing), matikan saat idle (auto-suspend), kurangi frekuensi (refresh per jam bukan per 5 menit).</p>

      <PlotlyChart
        data={costData}
        title="Komposisi Tagihan Cloud Data Tipikal"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "% tagihan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi tiap komponen dari total tagihan.</p>
        <p><strong>Interpretasi:</strong> compute 55% = target utama. <strong>Tapi</strong> jangan abaikan egress 15% — ia "pajak siluman" yang sering tak disadari sampai membengkak. <strong>Pelajaran:</strong> optimasi = ukur dulu per komponen (tagging per tim!), bukan tebak.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Optimasi biaya = minta diskon ke vendor."</strong></p>
        <p><strong>Yang benar:</strong> diskon = 10–20%, sekali. <strong>Desain</strong> (auto-suspend, tiering, kurangi scan) = 40–70%, selamanya (Lab 1 membuktikan). FinOps yang baik = arsitek yang sadar biaya, bukan negosiator ulung.</p>
      </div>

      <h2 id="dr">Backup & DR — RPO/RTO</h2>
      <ul>
        <li><strong>RPO (Recovery Point Objective):</strong> "berapa banyak data <em>boleh hilang</em>?" — RPO 24 jam = backup harian cukup. Ditentukan oleh <strong>bisnis</strong>, bukan IT.</li>
        <li><strong>RTO (Recovery Time Objective):</strong> "berapa lama <em>boleh down</em>?" — RTO 1 jam butuh replikasi siaga, bukan restore dari tape 8 jam.</li>
      </ul>
      <p><strong>Spektrum strategi:</strong> backup berkala (murah, RPO jam–hari) → snapshot + replikasi (menengah) → multi-region aktif-aktif (mahal, RPO ~detik). <strong>Aturan:</strong> biaya proteksi harus &lt; ekspektasi kerugian (Lab 2). Core banking = aktif-aktif; lake analitik = backup harian cukup.</p>
      <p><strong>Yang sering lupa:</strong> (1) <strong>test restore!</strong> — backup yang belum pernah di-restore = harapan, bukan proteksi; (2) backup <strong>terenkripsi & terpisah</strong> (ransomware mengincar backup juga); (3) <strong>retensi backup</strong> selaras kebijakan (DM9).</p>

      <PlotlyChart
        data={rpoData}
        title="RPO per Strategi DR (skala log)"
        layout={{ xaxis: { title: "Strategi" }, yaxis: { title: "RPO (jam, skala log)", type: "log" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang (skala log) = data maksimal yang boleh hilang.</p>
        <p><strong>Interpretasi:</strong> jurang 3 orde magnitudo — dan biaya mengikuti jurang yang sama. <strong>Pelajaran:</strong> jangan samakan strategi untuk semua data. Tanya bisnis: "1 jam data ini hilang = rugi berapa?" — jawabannya menentukan RPO, bukan sebaliknya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> DR bukan proyek IT — ia <strong>keputusan bisnis berhitung uang</strong> (Lab 2). Data engineer menyediakan <em>opsi + harganya</em>; bisnis memilih <em>risikonya</em>. Dokumentasikan pilihan itu — saat bencana, tidak ada waktu debat.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bedah Tagihan (FinOps Praktis)</h2>
      <p>Bedah tagihan $12.400/bulan — temukan 4 pemborosan dan hitung penghematannya.</p>
      <PyodideLab
        title="Lab 1 — Dari $12.400 ke Sehat"
        hint="Coba: ubah asumsi hemat refresh (80% → 50%). Berapa total baru? Itulah sensitivitas keputusan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: RPO/RTO — Seimbang atau Kemahalan?</h2>
      <p>Uji dua strategi DR untuk dua nilai data berbeda — rasakan kapan mahal = wajar.</p>
      <PyodideLab
        title="Lab 2 — DR Berhitung Uang"
        hint="Coba: rugi $5.000/jam. Strategi mana yang seimbang? Itulah cara bicara dengan bisnis."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Operasional Data</h2>

      <div className="decision-card">
        <h3>1. Tagihan membengkak → <strong>tagging per tim + bedah per komponen + atasi compute dulu</strong></h3>
        <p><strong>Kondisi:</strong> tidak tahu siapa menghabiskan apa.</p>
        <p><strong>Kenapa:</strong> yang tak diatribusikan tak bisa dioptimasi. Compute (auto-suspend, right-size) = tuas terbesar.</p>
      </div>

      <div className="decision-card">
        <h3>2. Environment "kok beda" antar dev/prod → <strong>IaC (Terraform) + git</strong></h3>
        <p><strong>Kondisi:</strong> klik console manual.</p>
        <p><strong>Kenapa:</strong> reproducibility + audit + review. Satu sumber kebenaran infrastruktur.</p>
      </div>

      <div className="decision-card">
        <h3>3. Deploy pipeline menegangkan → <strong>CI/CD: test otomatis + blue/green + rollback</strong></h3>
        <p><strong>Kondisi:</strong> deploy = doa.</p>
        <p><strong>Kenapa:</strong> test = kepercayaan. Breaking change tertangkap di CI, bukan di prod (DM8).</p>
      </div>

      <div className="decision-card">
        <h3>4. Tentukan strategi backup → <strong>tanya bisnis RPO/RTO + hitung ekspektasi rugi</strong></h3>
        <p><strong>Kondisi:</strong> semua data diperlakukan sama.</p>
        <p><strong>Kenapa:</strong> core banking ≠ lake analitik. Biaya proteksi &lt; ekspektasi kerugian.</p>
      </div>

      <div className="decision-card">
        <h3>5. Data dingin menumpuk di tier panas → <strong>lifecycle policy otomatis</strong></h3>
        <p><strong>Kondisi:</strong> storage mahal tanpa sebab.</p>
        <p><strong>Kenapa:</strong> "&gt;90 hari → cool, &gt;1 tahun → archive" — sekali setting, hemat selamanya.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tagihan = metrik teknik.</strong> Tag per tim, alert anomali.</li>
          <li><strong>Infrastruktur = kode.</strong> Tidak ada klik manual di prod.</li>
          <li><strong>Deploy = test + blue/green + rollback.</strong></li>
          <li><strong>Backup yang tak pernah di-restore = harapan.</strong> Test!</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Bedah Tagihan $48.000</h2>
      <p>Startup <strong>PT Kilat</strong> kaget: tagihan cloud bulan pertama <strong>$48.000</strong> (±Rp768 juta) vs anggaran $8.000. Ikuti forensiknya — tiap temuan ada angka dan obatnya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Temuan 1: cluster "lupa dimatikan" (klik untuk buka)</summary>
        <p>Cluster Spark dev: 20 node × $1,20/jam, jalan 24/7 selama 30 hari (tidak ada auto-shutdown!).</p>
        <p><Tex math={String.raw`20 \times 1{,}20 \times 24 \times 30 = \$17.280`} block /></p>
        <p><strong>36%</strong> dari tagihan — untuk cluster yang dipakai ~3 jam/hari! Utilisasi aktual: <Tex math={String.raw`3/24 = 12{,}5\%`} />.</p>
        <p>Obat: auto-shutdown idle 30 menit + jadwal (mati 20.00–08.00). Biaya baru: <Tex math={String.raw`20 \times 1{,}20 \times 12 \times 22 \text{ hari kerja} \approx \$6.336`} /> → <strong>hemat $10.944/bulan (63%)</strong>. Pelajaran FinOps #1: <strong>bayar untuk komputasi yang <em>terjadi</em>, bukan yang <em>tersedia</em>.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Temuan 2: 340 TB "sampah premium"</summary>
        <p>Storage: 500 TB total, <strong>340 TB</strong> tidak diakses &gt;90 hari — tapi di tier <em>Standard</em> ($23/TB/bulan) bukan <em>Archive</em> ($4/TB/bulan).</p>
        <p><Tex math={String.raw`\text{sekarang} = 340 \times 23 = \$7.820\text{/bln}`} /></p>
        <p><Tex math={String.raw`\text{lifecycle policy} = 340 \times 4 = \$1.360\text{/bln}`} /></p>
        <p><strong>Hemat $6.460/bulan (83%)</strong> dengan 1 lifecycle rule (otomatis pindah tier setelah 90 hari). Plus: 120 TB di antaranya = backup ganda + log lama → hapus (retensi, DM12): hemat tambahan <Tex math={String.raw`120 \times 23 = \$2.760`} />/bulan. Pelajaran #2: <strong>data punya suhu — simpan data dingin di freezer, bukan di kulkas.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Temuan 3: query tanpa partisi (DM4!) + transfer lintas region</summary>
        <p>Query scan 2 TB/hari tanpa partition pruning (seharusnya 60 GB): <Tex math={String.raw`2.000 \text{ GB} \times \$0{,}005 = \$10\text{/hari} = \$300\text{/bln}`} /> vs seharusnya $9/bulan. Transfer data Jakarta → Singapura 15 TB/bulan @ $0,12/GB = <strong>$1.800/bulan</strong> — pindahkan komputasi ke region data (data gravity!), bukan sebaliknya.</p>
        <p>Total temuan 1–3: <Tex math={String.raw`10.944 + 6.460 + 2.760 + 291 + 1.800 = \$22.255\text{/bln}`} /> dihemat → tagihan $48.000 → <strong>~$25.700</strong>. Masih 3× anggaran — tapi kini <em>terjelaskan</em>: sisanya = pertumbuhan wajar yang butuh anggaran baru, bukan kebocoran.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — RPO/RTO: berapa harga "tidak pernah down"?</summary>
        <p>Backup multi-region aktif-aktif: RPO 0 (tidak ada data hilang), RTO 5 menit. Biaya: replikasi lintas region 50 TB/bulan ($6.000) + standby cluster ($4.000) = <strong>$10.000/bulan</strong>.</p>
        <p>Alternatif: backup harian 1 region: RPO 24 jam, RTO 4 jam. Biaya: <strong>$800/bulan</strong>.</p>
        <p>Selisih: <strong>$9.200/bulan = $110.400/tahun</strong>. Kapan worth it? Jika 1 jam downtime = Rp500 juta (transaksi mati): downtime tahunan yang ditoleransi = <Tex math={String.raw`110{,}4 \text{ jt} / 500 \text{ jt} \approx 0{,}22 \text{ jam} = 13 \text{ menit/tahun}`} />. Butuh &lt;13 menit downtime/tahun → bayar mahal. Butuh &lt;4 jam → backup harian cukup. <strong>RPO/RTO = kontrak dengan bisnis, bukan spesifikasi teknis.</strong> Tanya dulu "berapa rupiah 1 jam mati?", baru desain DR-nya.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> 3 kebocoran cloud abadi: <strong>(1) idle</strong> (jalan tapi tidak dipakai — auto-shutdown!), <strong>(2) tier salah</strong> (data dingin di storage panas — lifecycle policy!), <strong>(3) arsitektur boros</strong> (scan tanpa partisi, transfer lintas region — desain!). Urutan perbaikannya juga itu: matikan yang nganggur (hari ini), pindahkan tier (minggu ini), desain ulang (kuartal ini). FinOps = <strong>tagihan sebagai code review</strong>: tiap PR yang menambah biaya harus bisa menjelaskan kenapa.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Guardrail: 1 baris policy mencegah $3.600/bulan</summary>
        <p>Policy IaC: <em>"tolak instance &gt; $5/jam tanpa label cost-center"</em>. Seorang engineer iseng menyalakan 1 instance $5/jam "sebentar" — lupa 30 hari.</p>
        <p><Tex math={String.raw`5 \times 24 \times 30 = \$3.600\text{/bulan yang dicegah}`} block /></p>
        <p><strong>Mencegah (1 baris policy, Rp0) vs mengobati (tagihan $3.600 + rapat + blame).</strong> Di cloud, kebocoran termahal = yang <em>tidak ada yang melarang</em>. Guardrail = niat baik yang dieksekusi mesin.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: IaC = "Jangan Klik, Tulis"</h2>
      <p>Setiap klik di console cloud = <strong>konfigurasi yang tidak berversi, tidak bisa di-review, tidak bisa direplikasi</strong>. Insiden klasik: "kok di production beda dengan staging?" — karena production di-klik manual 3 bulan lalu oleh orang yang sudah resign. IaC (Terraform/Pulumi) mengubah infrastruktur menjadi <strong>kode yang di-review</strong>:</p>
      <ul>
        <li><strong>Reprodusibilitas:</strong> environment baru (DR region!) = 1 perintah, bukan 200 klik. RTO 4 jam mustahil tanpa IaC — membangun ulang manual butuh 3 hari.</li>
        <li><strong>Drift detection:</strong> "kok ada bucket baru yang tidak di Terraform?" = temuan otomatis tiap malam. Klik manual = drift; drift = "kok tagihannya naik?"</li>
        <li><strong>Cost guardrail sebagai kode:</strong> policy "dilarang instance &gt; $5/jam tanpa label cost-center" = ditolak saat <code className="inline">terraform plan</code>, bukan saat tagihan datang. <strong>Mencegah lebih murah daripada mengobati — di cloud, mencegah = 1 baris policy.</strong></li>
      </ul>
      <p><strong>Konteks dunia nyata — CI/CD untuk data (bedanya dengan software!):</strong> deploy pipeline data ≠ deploy API. Tiga keunikan: (1) <strong>state</strong>: pipeline punya data historis — deploy versi baru tidak boleh merusak data lama (migrasi + backfill, DM5); (2) <strong>verifikasi = data</strong>: test bukan "apakah kode jalan?" tapi "apakah <em>angka</em> benar?" (dbt test, DM7); (3) <strong>rollback = data</strong>: rollback kode mudah, rollback <em>data yang sudah ditulis versi baru</em> = butuh strategi (tulis ke tabel versi baru, swap atomik). Pipeline CI/CD data yang dewasa: <strong>lint SQL → test di data sampel → deploy ke staging → validasi angka vs produksi → promosi</strong>. Yang loncat langsung ke produksi = deploy Jumat sore di mini-case.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Cloud = bayar sesuai pakai, jadi pasti lebih murah dari on-prem."</strong></p>
        <p><strong>Yang benar:</strong> cloud = bayar sesuai pakai <em>dengan meter yang jalan 24/7 untuk semua yang lupa dimatikan</em>. On-prem: beli sekali, "gratis" setelahnya (padahal capex + listrik + orang). Cloud lebih murah <strong>jika dan hanya jika</strong> ada disiplin FinOps (auto-shutdown, lifecycle, guardrail). Tanpa disiplin: $48.000/bulan untuk yang seharusnya $8.000. Cloud bukan sihir penghemat — ia <strong>pengungkit</strong>: mengungkit efisiensi yang disiplin, dan mengungkit keborosan yang ceroboh, sama kuatnya.</p>
      </div>

      <div className="callout">
        <h3>🧾 Checklist Review Tagihan Bulanan (10 pos, 30 menit)</h3>
        <ol>
          <li>Top 5 layanan termahal — ada yang naik &gt;20% vs bulan lalu? Kenapa?</li>
          <li>Instance idle: ada yang utilisasi &lt;15% &gt;7 hari? Matikan/jadwalkan.</li>
          <li>Storage: berapa % di tier Standard yang tidak diakses 90 hari? Pindahkan.</li>
          <li>Orphan: disk/snapshot/load balancer tanpa pemilik? Hapus.</li>
          <li>Query termahal: top 10 query by scan — ada yang tanpa partisi?</li>
          <li>Transfer lintas region: bisa dipindah komputasinya ke region data?</li>
          <li>Commitment: ada pola pemakaian stabil &gt;1 tahun? Beli reserved/savings plan.</li>
          <li>Label/tag: % biaya tanpa cost-center — yang tidak berlabel = tidak terkendali.</li>
          <li>Anomali: alert otomatis untuk lonjakan &gt;15% harian.</li>
          <li>Keputusan: 1 aksi penghematan dicatat + pemilik + deadline — tiap bulan.</li>
        </ol>
        <p><strong>30 menit/bulan</strong> mencegah $48.000 berikutnya. FinOps = <strong>ritme</strong>, bukan proyek. Yang tidak di-review tiap bulan = bocor tiap bulan.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Pilih RPO/RTO — Kontrak dengan Bisnis</h2>
      <p>Hitung trade-off DR: masukkan biaya downtime, lihat strategi termurah yang memenuhi kontrak.</p>
      <PyodideLab
        title="Lab 3 — Kalkulator Kontrak DR"
        hint="Coba: naikkan BIAYA_DOWNTIME_PER_JAM ke 5 miliar (bank). Strategi mana yang kini 'termurah'? Itulah kenapa bank bayar mahal untuk DR."
        defaultCode={`# Lab 3: pilih strategi DR dari biaya downtime vs biaya proteksi
BIAYA_DOWNTIME_PER_JAM = 500_000_000  # Rp500 jt/jam (e-commerce menengah)
DOWNTIME_TAHUNAN_JAM = 8              # ekspektasi tanpa DR serius

strategi = [
    # (nama, biaya/bln Rp, RPO, RTO, downtime sisa jam/thn)
    ("Backup harian 1 region",   12_800_000, "24 jam", "4 jam",   6.0),
    ("Backup + standby 1 region", 48_000_000, "1 jam", "1 jam",  1.5),
    ("Multi-region aktif-aktif", 160_000_000, "0",     "5 mnt",   0.1),
]

print(f"Ekspektasi rugi tanpa DR serius: Rp{BIAYA_DOWNTIME_PER_JAM*DOWNTIME_TAHUNAN_JAM:,.0f}/thn\\n")
terbaik, biaya_terbaik = None, float("inf")
for nama, biaya_bln, rpo, rto, sisa in strategi:
    total = biaya_bln*12 + BIAYA_DOWNTIME_PER_JAM*sisa
    print(f"{nama}\\n  RPO {rpo}, RTO {rto} | biaya proteksi Rp{biaya_bln*12:,.0f}/thn")
    print(f"  + sisa rugi Rp{BIAYA_DOWNTIME_PER_JAM*sisa:,.0f} = TOTAL Rp{total:,.0f}/thn")
    if total < biaya_terbaik: terbaik, biaya_terbaik = nama, total
print(f"\\nTERBAIK (total cost of ownership): {terbaik}")
print("Moral: DR termurah bukan yang proteksinya termurah,")
print("melainkan yang TOTAL (proteksi + sisa risiko) terkecil.")`}
      />

      <h2 id="case">📋 Mini-Case: Deploy Jumat Sore yang Menghapus Partisi</h2>
      <div className="callout">
        <p>Engineer deploy perubahan dbt Jumat 17:30 — tanpa test, langsung ke prod. Model salah filter tanggal: <strong>overwrite 30 hari partisi Gold dengan data 1 hari</strong>. Dashboard Senin pagi salah total. Tidak ada yang sadar sampai direksi bertanya "kok penjualannya anjlok?". Rollback manual: 2 hari.</p>
        <p><strong>Pertanyaan:</strong> (a) Berapa lapis pertahanan yang dilanggar? (b) Dengan CI/CD + praktik benar, apa yang terjadi di tiap lapis? (c) Aturan tim apa setelah ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Empat lapis:</strong> tanpa test/CI, tanpa blue/green (timpa langsung), tanpa review, tanpa freeze Jumat sore.</p>
          <p>(b) <strong>CI:</strong> data test menangkap filter salah → merge ditolak. <strong>Blue/green:</strong> tulis tabel baru → validasi → swap; prod tak tersentuh. <strong>Time travel:</strong> rollback = 1 query, bukan 2 hari.</p>
          <p>(c) <strong>"Tidak ada deploy langsung ke prod"</strong> + CI wajib hijau + perubahan destruktif butuh approval + larangan deploy Jumat sore untuk yang berisiko. Aturan ditulis, bukan diingat.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: cluster idle, tier storage, dan kontrak DR.</p>

      <details className="worked">
        <summary>Soal 1 — Idle: 12 node × $0,90/jam × 24 jam × 30 hari, utilisasi aktual 15%. Berapa total? Berapa yang terbuang?</summary>
        <p>Total = <Tex math={String.raw`12 \times 0{,}9 \times 24 \times 30 = \$7.776`} />; terpakai <Tex math={String.raw`7.776 \times 0{,}15 = \$1.166`} />.</p>
        <p><Tex math={String.raw`\text{terbuang} = 7.776 - 1.166 = \$6.610\text{/bulan}`} block /></p>
        <p>$6.610/bulan untuk <em>tidak dipakai</em>. Auto-shutdown 30 menit idle = obat termurah di cloud.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Tier: 200 TB data dingin di Standard ($23/TB) vs Archive ($4/TB). Berapa hemat per bulan dengan lifecycle policy?</summary>
        <p><Tex math={String.raw`(23-4) \times 200 = \$3.800\text{/bulan} = \$45.600\text{/tahun}`} block /></p>
        <p><strong>1 lifecycle rule</strong> — 5 menit kerja — menghemat $45.600/tahun. FinOps = menemukan uang di sela konfigurasi.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — DR: downtime Rp2 juta/jam. Strategi A: Rp50 jt/bln, sisa downtime 5 jam/thn. Strategi B: Rp200 jt/bln, sisa 0,2 jam/thn. Mana total cost terkecil?</summary>
        <p>A: <Tex math={String.raw`50 \times 12 + 2 \times 5 = 600 + 10 = \text{Rp}610 \text{ jt/thn}`} />.</p>
        <p>B: <Tex math={String.raw`200 \times 12 + 2 \times 0{,}2 = 2.400 + 0{,}4 = \text{Rp}2.400{,}4 \text{ jt/thn}`} block /></p>
        <p><strong>A menang telak.</strong> DR termurah ≠ proteksi termurah — tapi <strong>total (proteksi + sisa risiko)</strong> terkecil. Jangan bayar $2,4 M untuk melindungi risiko Rp10 jt.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Komponen tagihan cloud data yang biasanya terbesar dan tuas utamanya?"
        options={[
          "Storage — hapus semua data",
          "Compute (55%) — right-sizing + auto-suspend + kurangi frekuensi refresh. Compute = keputusan arsitektur",
          "Egress — tidak bisa dioptimasi",
          "Tidak ada yang dominan",
        ]}
        correct={1}
        explanation="Benar: compute mendominasi dan sepenuhnya dikendalikan desain. 'Pay as you go' = bayar tiap keputusan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kenapa Infrastructure as Code (Terraform) penting untuk tim data?"
        options={[
          "Agar terlihat modern",
          "Reproducibility (dev=staging=prod) + audit via git + rebuild cepat saat DR + review perubahan — klik console = utang operasional",
          "Agar lebih lambat",
          "Tidak penting",
        ]}
        correct={1}
        explanation="Benar: 4 manfaat IaC. 'Kok di prod beda?' adalah pajak klik manual."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Praktik deploy dbt yang AMAN ke produksi?"
        options={[
          "Langsung overwrite tabel prod",
          "CI (test+lint+preview) → review → blue/green (tulis baru, validasi, swap) + rollback via time travel",
          "Deploy Jumat 17:30 tanpa test",
          "Minta tolong doa",
        ]}
        correct={1}
        explanation="Benar: tiap lapis mencegah mini-case. Test = kepercayaan untuk bergerak cepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. RPO vs RTO?"
        options={[
          "Sama saja",
          "RPO = berapa banyak data boleh hilang (ditentukan bisnis); RTO = berapa lama boleh down. Keduanya menentukan strategi & biaya DR",
          "RPO untuk aplikasi saja",
          "Ditentukan vendor",
        ]}
        correct={1}
        explanation="Benar: dua pertanyaan bisnis yang menerjemahkan ke strategi teknis + tagihan. Beda data, beda jawaban."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Backup yang belum pernah di-test restore adalah…"
        options={[
          "Proteksi penuh",
          "Harapan — bukan proteksi. Ditambah: harus terenkripsi, terpisah (ransomware), dan retensinya selaras kebijakan",
          "Tidak perlu",
          "Cukup ada",
        ]}
        correct={1}
        explanation="Benar: uji restore berkala adalah bagian DR, bukan opsional. Banyak 'backup' gagal saat dibutuhkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Egress antar-region mahal. Desain yang benar?"
        options={[
          "Abaikan, kecil",
          "Proses di region yang sama dengan data; 'data diam = murah, data bergerak = mahal' — tiap transfer antar-region harus beralasan",
          "Pindah semua tiap jam",
          "Tidak ada solusi",
        ]}
        correct={1}
        explanation="Benar: aturan emas — minimalkan gerakan data. Arsitektur mengikuti data, bukan sebaliknya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Object storage:</strong> fondasi lake; tiering + lifecycle policy; waspadai egress & request.</li>
          <li><strong>IaC:</strong> infra sebagai kode berversi — reproducibility, audit, rebuild, review.</li>
          <li><strong>CI/CD data:</strong> test otomatis + blue/green + rollback; breaking change tertangkap di CI.</li>
          <li><strong>FinOps:</strong> tagihan = metrik teknik per tim; optimasi = desain (40–70%), bukan diskon.</li>
          <li><strong>DR:</strong> RPO/RTO dari bisnis; biaya proteksi &lt; ekspektasi rugi; test restore!</li>
          <li><strong>Jangan:</strong> klik manual di prod; deploy tanpa test; samakan strategi DR semua data.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm14-arsitektur-modern" className="btn btn-secondary btn-sm">← DM14</Link>
        <Link href="/learn/dm16-bi-analytics-engineering" className="btn btn-primary btn-sm">Next: DM16 →</Link>
      </div>
    </div>
  );
}
