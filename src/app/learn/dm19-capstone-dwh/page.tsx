"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM19Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const phaseData = [
    {
      x: ["1. Staging<br>(Bronze)", "2. Bersih<br>(Silver)", "3. Mart<br>(Gold)", "4. Test<br>kualitas", "5. Katalog &<br>lineage"],
      y: [20, 25, 25, 15, 15],
      type: "bar",
      marker: { color: ["#e8a838", "#e8a838", "#2a7de1", "#2a7de1", "#2a7de1"] },
      text: ["20%", "25%", "25%", "15%", "15%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# CAPSTONE Lab 1: Bangun mini-DWH end-to-end (SQLite = warehouse mini)
# Skenario: bank mini "Bank Maju" — 3 sumber berantakan -> 1 mart tepercaya.
import sqlite3
db = sqlite3.connect(":memory:")

# ===== FASE 1: STAGING (Bronze) — terima mentah apa adanya =====
db.execute("CREATE TABLE stg_transaksi (raw_id TEXT, payload TEXT, received_at TEXT)")
db.execute("CREATE TABLE stg_nasabah (raw_id TEXT, payload TEXT, received_at TEXT)")
mentah_tx = [
    ("R1", '{"id":"T001","nasabah":"N001","nominal":"500000","tgl":"01/10/2026"}'),
    ("R2", '{"id":"T002","nasabah":"N002","nominal":1200000,"tgl":"2026-10-01"}'),
    ("R3", '{"id":"T003","nasabah":"N001","nominal":"250.000","tgl":"01-10-2026"}'),
    ("R4", '{"id":"T002","nasabah":"N002","nominal":1200000,"tgl":"2026-10-01"}'),  # duplikat!
    ("R5", '{"id":"T004","nasabah":"N999","nominal":900000,"tgl":"2026-10-02"}'),   # nasabah hantu!
]
mentah_ns = [
    ("S1", '{"id":"N001","nama":"Budi Santoso","kota":"Jakarta"}'),
    ("S2", '{"id":"N002","nama":"Ani Wijaya","kota":"JKT"}'),
]
db.executemany("INSERT INTO stg_transaksi VALUES (?,?,'2026-10-12')", mentah_tx)
db.executemany("INSERT INTO stg_nasabah VALUES (?,?,'2026-10-12')", mentah_ns)

# ===== FASE 2: BERSIH (Silver) — dedup, standarisasi, validasi =====
import json, re
def bersih_nominal(v): return int(str(v).replace(".", ""))
def bersih_tgl(t):
    t = t.replace("/", "-")
    if len(t) == 10 and t[4] != "-": p = t.split("-"); return f"{p[2]}-{p[1]}-{p[0]}"
    return t
def bersih_kota(k): return {"jkt": "Jakarta"}.get(k.lower(), k)

db.execute("""CREATE TABLE silver_transaksi AS
              SELECT 'x' as id, 'x' as nasabah_id, 0 as nominal, 'x' as tgl WHERE 0""")
db.execute("""CREATE TABLE silver_nasabah AS
              SELECT 'x' as id, 'x' as nama, 'x' as kota WHERE 0""")
seen = set()
for raw_id, payload in db.execute("SELECT raw_id, payload FROM stg_transaksi"):
    d = json.loads(payload)
    if d["id"] in seen: continue          # dedup!
    seen.add(d["id"])
    db.execute("INSERT INTO silver_transaksi VALUES (?,?,?,?)",
               (d["id"], d["nasabah"], bersih_nominal(d["nominal"]), bersih_tgl(d["tgl"])))
for raw_id, payload in db.execute("SELECT raw_id, payload FROM stg_nasabah"):
    d = json.loads(payload)
    db.execute("INSERT INTO silver_nasabah VALUES (?,?,?)",
               (d["id"], d["nama"], bersih_kota(d["kota"])))

# ===== FASE 3: MART (Gold) — star schema siap dashboard =====
db.execute("""CREATE TABLE dim_nasabah AS SELECT id as nasabah_id, nama, kota FROM silver_nasabah""")
db.execute("""CREATE TABLE fakta_transaksi AS
              SELECT t.id as transaksi_id, t.nasabah_id, t.nominal, t.tgl
              FROM silver_transaksi t
              JOIN dim_nasabah n ON n.nasabah_id = t.nasabah_id""")  # N999 (hantu) TERBUANG di sini!
db.execute("""CREATE TABLE gold_penjualan_harian AS
              SELECT tgl, COUNT(*) as n_transaksi, SUM(nominal) as total
              FROM fakta_transaksi GROUP BY tgl""")

print("== MART SIAP ==")
for r in db.execute("SELECT * FROM gold_penjualan_harian"): print(" ", r)
print("dim_nasabah:", db.execute("SELECT * FROM dim_nasabah").fetchall())
print()
print("Perhatikan: T002 duplikat -> 1 baris. N999 (tanpa master) -> dibuang + harus di-ALERT.")
print("(Itulah gunanya test kualitas di Lab 2!)")
print()
print("TUGASMU: tambah 1 sumber 'stg_produk' + dim_produk, lalu buat gold per kota.")`;

  const lab2Code = `# CAPSTONE Lab 2: Test kualitas + katalog + lineage — "pintu" dan "peta"
import sqlite3, json
db = sqlite3.connect(":memory:")
# (asumsikan tabel dari Lab 1 sudah ada — kita bangun ulang ringkas)
db.execute("CREATE TABLE fakta_transaksi (transaksi_id TEXT, nasabah_id TEXT, nominal INTEGER, tgl TEXT)")
db.executemany("INSERT INTO fakta_transaksi VALUES (?,?,?,?)", [
    ("T001", "N001", 500000, "2026-10-01"),
    ("T002", "N002", 1200000, "2026-10-01"),
    ("T003", "N001", 250000, "2026-10-01"),
])
db.execute("CREATE TABLE dim_nasabah (nasabah_id TEXT, nama TEXT, kota TEXT)")
db.executemany("INSERT INTO dim_nasabah VALUES (?,?,?)", [
    ("N001", "Budi Santoso", "Jakarta"), ("N002", "Ani Wijaya", "Jakarta")])

print("== TEST KUALITAS (pintu Silver->Gold) ==")
tests = []
tests.append(("unique(transaksi_id)",
    db.execute("SELECT COUNT(*)=COUNT(DISTINCT transaksi_id) FROM fakta_transaksi").fetchone()[0] == 1))
tests.append(("not_null(nominal)",
    db.execute("SELECT COUNT(*) FROM fakta_transaksi WHERE nominal IS NULL").fetchone()[0] == 0))
tests.append(("nominal > 0",
    db.execute("SELECT COUNT(*) FROM fakta_transaksi WHERE nominal <= 0").fetchone()[0] == 0))
tests.append(("fk_valid (nasabah ada di dim)",
    db.execute("""SELECT COUNT(*) FROM fakta_transaksi f LEFT JOIN dim_nasabah n
                  ON f.nasabah_id=n.nasabah_id WHERE n.nasabah_id IS NULL""").fetchone()[0] == 0))
gagal = [n for n, ok in tests if not ok]
for n, ok in tests: print(f"  {'PASS' if ok else 'FAIL'} {n}")
print("  =>", "GOLD LOLOS ✅" if not gagal else f"GOLD DITAHAN ❌: {gagal}")
print()
print("== KATALOG (entri tiap aset) ==")
katalog = {
    "fakta_transaksi": {"deskripsi": "Transaksi bersih, grain=1 transaksi", "owner": "Kamu",
                        "kualitas": "gold", "sla": "harian 06:00"},
    "dim_nasabah": {"deskripsi": "Master nasabah SCD1", "owner": "Kamu", "kualitas": "gold"},
    "gold_penjualan_harian": {"deskripsi": "RESMI untuk direksi", "owner": "Kamu", "kualitas": "gold"},
}
for t, m in katalog.items(): print(f"  {t}: {m['deskripsi']} | owner={m['owner']}")
print()
print("== LINEAGE ==")
for a, b in [("stg_transaksi", "silver_transaksi"), ("stg_nasabah", "silver_nasabah"),
             ("silver_transaksi", "fakta_transaksi"), ("silver_nasabah", "dim_nasabah"),
             ("fakta_transaksi", "gold_penjualan_harian")]:
    print(f"  {a} -> {b}")
print()
print("TUGASMU: (1) rusak 1 data (nominal negatif) -> test harus FAIL;")
print("(2) tambah entri katalog untuk tabel barumu; (3) gambar lineage lengkap.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM19 — Data Management • CAPSTONE</span>
        <h1 className="display-title">Capstone: Mini Data Warehouse<br />dari Nol sampai Dipercaya</h1>
        <div className="meta">60–90 menit &bull; proyek akhir &bull; 5 fase &bull; rubrik penilaian</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan & Hasil Akhir</a></li>
          <li><a href="#cerita">Cerita Pembuka: Wawancara yang Dimenangkan Portofolio</a></li>
          <li><a href="#arsitektur">Arsitektur Capstone</a></li>
          <li><a href="#fase1">Fase 1–3: Staging → Mart (Lab 1)</a></li>
          <li><a href="#fase4">Fase 4: Test Kualitas (Lab 2a)</a></li>
          <li><a href="#fase5">Fase 5: Katalog & Lineage (Lab 2b)</a></li>
          <li><a href="#rubrik">Rubrik Penilaian Diri</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan Capstone</a></li>
          <li><a href="#worked">🔢 Worked Example: Anggaran 8 Jam</a></li>
          <li><a href="#intuisi">🧠 Intuisi: 5 Keputusan Penentu Nilai</a></li>
          <li><a href="#lab3">🔬 Lab 3: Auditor Capstone</a></li>
          <li><a href="#case">📋 Mini-Case: Review Produksi</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman Track</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan & Hasil Akhir</h2>
      <div className="callout">
        <p><strong>Misi:</strong> bangun mini data warehouse "Bank Maju" end-to-end — dari 3 sumber berantakan menjadi <strong>1 mart yang bisa dipertanggungjawabkan</strong>.</p>
        <ul>
          <li><strong>Hasil 1:</strong> pipeline staging → silver → gold (star schema) yang berjalan.</li>
          <li><strong>Hasil 2:</strong> suite test kualitas yang <em>terbukti</em> menangkap data rusak (buktikan dengan merusak data!).</li>
          <li><strong>Hasil 3:</strong> katalog + lineage untuk semua aset — orang lain bisa paham tanpa bertanya padamu.</li>
          <li><strong>Hasil 4 (portofolio):</strong> README 1 halaman: masalah → arsitektur → keputusan → hasil. <em>Ini yang ditunjukkan ke recruiter.</em></li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Wawancara yang Dimenangkan Portofolio</h2>
      <div className="story">
        <p>Dua kandidat melamar Data Engineer. Kandidat A: "Saya bisa Airflow, dbt, Spark, Kafka" — daftar tool 20 baris. Kandidat B membuka laptop: <em>"Ini mini warehouse saya — 3 sumber berantakan, saya bangun staging→mart, ini test yang menangkap duplikat, ini katalognya, ini keputusan desain saya dan kenapa."</em> Interviewer bertanya 45 menit — semuanya tentang <em>keputusan</em>, bukan hafalan. Kandidat B diterima.</p>
        <p>Twist-nya: kandidat B tidak lebih pintar — ia hanya punya <strong>bukti</strong>. Pasar 2026 tidak membayar "tahu tool"; ia membayar "pernah membangun yang jalan". Capstone ini = <strong>bukti pertamamu</strong>. Kerjakan serius: inilah yang membedakanmu dari 200 pelamar lain.</p>
      </div>

      <h2 id="arsitektur">Arsitektur Capstone</h2>
      <p><strong>Bank Maju</strong> (fiktif): 3 sumber — core banking (transaksi, format campur), HR/mobile (nasabah, kota tidak standar), + 1 sumber buatanmu. Target: mart <code className="inline">gold_penjualan_harian</code> & <code className="inline">gold_risiko_kota</code> yang <strong>tersertifikasi</strong> (DM16).</p>
      <p><strong>Keputusan arsitektur yang harus kamu buat & dokumentasikan</strong> (inilah yang ditanya interview!):</p>
      <ul>
        <li><strong>Grain fakta:</strong> "satu baris = satu transaksi berhasil" (DM2).</li>
        <li><strong>Idempotency:</strong> job bisa di-rerun aman — bagaimana? (DM5)</li>
        <li><strong>SCD:</strong> nasabah pindah kota → Type 1 atau 2? Kenapa? (DM2)</li>
        <li><strong>Aturan survivorship:</strong> sumber bertentangan → siapa menang? (DM11)</li>
        <li><strong>Toleransi rekonsiliasi:</strong> berapa? Kenapa angka itu? (DM13)</li>
      </ul>

      <PlotlyChart
        data={phaseData}
        title="Alokasi Usaha 5 Fase Capstone"
        layout={{ xaxis: { title: "Fase" }, yaxis: { title: "% usaha" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi usaha tiap fase.</p>
        <p><strong>Interpretasi:</strong> 70% usaha = bangun & bersihkan (fase 1–3) — realita data engineering! Test + katalog "hanya" 30% tapi <strong>menentukan kepercayaan</strong>. <strong>Pelajaran:</strong> pemula meremehkan fase 4–5; profesional tahu di situlah "dipercaya" dimenangkan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> capstone yang bagus = <strong>keputusan yang dijelaskan</strong>, bukan kode terpanjang. Setiap pilihan (grain, SCD, toleransi) tulis <em>kenapa</em>-nya 2 kalimat di README. Interviewer membaca alasannya, bukan baris kodenya.</p>
      </div>

      <h2 id="fase1">Fase 1–3: Staging → Mart (Lab 1)</h2>
      <p>Jalankan Lab 1 — ia membangun <strong>3 fase inti</strong> dalam SQLite (warehouse mini):</p>
      <ol>
        <li><strong>Staging (Bronze):</strong> terima mentah apa adanya — JANGAN bersihkan di sini (ELT! DM4).</li>
        <li><strong>Silver:</strong> dedup (T002!), standarisasi format (nominal, tanggal, kota), buang yang tak valid.</li>
        <li><strong>Gold (mart):</strong> star schema — <code className="inline">dim_nasabah</code> + <code className="inline">fakta_transaksi</code> + agregat harian. Perhatikan: transaksi N999 (nasabah hantu) <strong>terbuang di JOIN</strong> — catat sebagai temuan untuk di-alert, bukan didiamkan!</li>
      </ol>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi capstone: "Yang penting kodenya jalan."</strong></p>
        <p><strong>Yang benar:</strong> yang penting = <strong>keputusan + bukti</strong>. Kode jalan tapi tanpa test/katalog/keputusan tertulis = "script", bukan "warehouse". Bedakan dirimu: setiap fase punya <em>artefak kepercayaan</em> (test lolos, katalog terisi, lineage tergambar).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bangun Mini-DWH (3 Fase)</h2>
      <PyodideLab
        title="Capstone Lab 1 — Staging → Silver → Gold"
        hint="TUGAS: tambah sumber 'stg_produk' + dim_produk, lalu buat gold_penjualan_per_kota. Dokumentasikan grain & keputusanmu."
        defaultCode={lab1Code}
      />

      <h2 id="fase4">Fase 4: Test Kualitas — Buktikan Pintumu Berfungsi</h2>
      <p>Test yang tidak pernah gagal = belum terbukti. <strong>Tugas wajib:</strong></p>
      <ol>
        <li>Tulis ≥5 test (unik, not null, rentang, FK valid, rekonsiliasi total).</li>
        <li><strong>Sengaja rusak 1 data</strong> (nominal negatif / duplikat ID) → pastikan test <strong>FAIL</strong> dan pipeline <strong>berhenti</strong>.</li>
        <li>Perbaiki data → test <strong>PASS</strong> lagi. Dokumentasikan siklus ini di README (screenshot/output).</li>
      </ol>
      <p>Ini mensimulasikan <strong>CI/CD data</strong> (DM15) dalam miniatur — dan menjadi cerita wawancara terbaikmu: <em>"test saya pernah menangkap..."</em></p>

      <h2 id="fase5">Fase 5: Katalog & Lineage — Orang Lain Paham Tanpa Bertanya</h2>
      <p><strong>Tugas wajib:</strong></p>
      <ol>
        <li><strong>Katalog:</strong> tiap tabel punya deskripsi 1 kalimat + owner (namamu!) + label kualitas + definisi grain.</li>
        <li><strong>Lineage:</strong> gambar aliran sumber → staging → silver → gold → (bayangkan) dashboard. Tandai di mana test berada.</li>
        <li><strong>Uji "orang asing":</strong> minta teman/AI membaca katalogmu — bisakah ia menjawab "tabel mana untuk laporan direksi?" tanpa bertanya padamu? Jika tidak, katalogmu belum cukup.</li>
      </ol>

      <h2 id="lab2">🔬 Lab 2: Test + Katalog + Lineage</h2>
      <PyodideLab
        title="Capstone Lab 2 — Pintu, Peta, dan Bukti"
        hint="TUGAS: (1) rusak 1 data → test harus FAIL; (2) tambah entri katalog; (3) lengkapi lineage untuk tabel barumu."
        defaultCode={lab2Code}
      />

      <h2 id="rubrik">Rubrik Penilaian Diri</h2>
      <div className="callout">
        <p>Nilai jujur 0–2 per baris (0=belum, 1=sebagian, 2=penuh). Target: ≥10/14.</p>
        <ul>
          <li>Pipeline 3 fase berjalan end-to-end (staging → silver → gold).</li>
          <li>Grain & keputusan desain (SCD, survivorship, idempotency) tertulis.</li>
          <li>≥5 test kualitas + terbukti menangkap data rusak (FAIL→PASS).</li>
          <li>Katalog lengkap: deskripsi + owner + label kualitas tiap tabel.</li>
          <li>Lineage tergambar: sumber → ... → gold.</li>
          <li>Kasus tepi ditangani: duplikat, nasabah hantu, format campur.</li>
          <li>README 1 halaman: masalah → arsitektur → keputusan → hasil.</li>
        </ul>
        <p><strong>Aturan:</strong> di bawah 10 = ulangi fase yang bolong. Portofolio yang jujur &gt; portofolio yang "selesai" tapi rapuh.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi portofolio:</strong> README yang menang = <strong>masalah → keputusan sulit → hasil terukur</strong>. Contoh: "Duplikat T002 & nasabah hantu N999 (masalah) → dedup + FK-valid test + alert (keputusan) → 0 duplikat, 100% FK valid, test terbukti menangkap (hasil)." Tiga kalimat ini &gt; 500 baris kode tanpa cerita.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan Capstone</h2>

      <div className="decision-card">
        <h3>1. Sumber format campur → <strong>staging mentah (ELT), bersihkan di Silver</strong></h3>
        <p><strong>Kenapa:</strong> mentah tersimpan = bisa re-process; transformasi terdokumentasi & ter-test.</p>
      </div>

      <div className="decision-card">
        <h3>2. Duplikat / data hantu → <strong>dedup + FK test + ALERT (jangan diam)</strong></h3>
        <p><strong>Kenapa:</strong> data dibuang harus tercatat — silent drop = bom audit.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh kepercayaan → <strong>test yang terbukti FAIL + katalog + lineage</strong></h3>
        <p><strong>Kenapa:</strong> "dipercaya" = bukti, bukan klaim. Tiga artefak ini = bukti.</p>
      </div>

      <div className="decision-card">
        <h3>4. Presentasi ke recruiter → <strong>README: masalah → keputusan → hasil terukur</strong></h3>
        <p><strong>Kenapa:</strong> mereka menilai cara berpikirmu, bukan hafalan tool.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik (penutup track)</h3>
        <ol>
          <li><strong>Keputusan tertulis &gt; kode panjang.</strong></li>
          <li><strong>Test yang tak pernah FAIL = belum terbukti.</strong></li>
          <li><strong>Katalog = orang asing paham tanpa bertanya.</strong></li>
          <li><strong>Portofolio = bukti, bukan daftar tool.</strong></li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Anggaran 8 Jam — Dari Nol ke "Siap Diwawancara"</h2>
      <p>Capstone ini dirancang untuk <strong>±8 jam</strong> kerja fokus. Berikut pembagian waktu yang realistis (diambil dari phaseData di lesson ini) + apa yang dihasilkan tiap jamnya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Alokasi waktu per fase (klik untuk buka)</summary>
        <p><Tex math={String.raw`\text{total} = 8 \text{ jam} = 480 \text{ menit}`} block /></p>
        <ul>
          <li><strong>Fase 1 (Staging/Bronze, 20% = 96 mnt):</strong> terima 3 sumber berantakan apa adanya. Output: 2 tabel staging + 5 baris sampel terdokumentasi. <em>Jebakan:</em> tergoda "membersihkan sedikit" di staging — jangan! Bronze = cermin mentah.</li>
          <li><strong>Fase 2 (Silver, 25% = 120 mnt):</strong> dedup, standarisasi format, validasi. Output: tabel bersih + <strong>decision log</strong> ("T002 duplikat → keep first, alasan: ..."). Ini fase paling "berpikir".</li>
          <li><strong>Fase 3 (Gold/Mart, 25% = 120 mnt):</strong> star schema + agregat. Output: 1 fact + 2 dimensi + 1 tabel agregat siap dashboard.</li>
          <li><strong>Fase 4 (Test, 15% = 72 mnt):</strong> ≥5 test + <strong>buktikan FAIL→PASS</strong> (masukkan data rusak sengaja, lihat test merah, perbaiki). Test yang tidak pernah merah = belum terbukti.</li>
          <li><strong>Fase 5 (Katalog+Lineage, 15% = 72 mnt):</strong> katalog + diagram lineage + README 1 halaman.</li>
        </ul>
        <p>Catatan: 72 menit untuk katalog terasa "mahal" — tapi <strong>README + katalog = yang dibaca pewawancara pertama kali</strong>, bukan kodemu. Alokasi ini = investasi di kesan pertama.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Ukuran "cukup": kapan berhenti nambah?</summary>
        <p>Target kuantitatif capstone "cukup":</p>
        <ul>
          <li>Baris kode pipeline: <strong>150–300</strong> (di bawah 150 = terlalu main-main; di atas 500 = over-engineering untuk portofolio).</li>
          <li>Test: <strong>≥5</strong>, tiap test punya <em>nama, threshold, aksi saat gagal</em>.</li>
          <li>Keputusan desain tertulis: <strong>≥5</strong> ("kenapa SCD Type 1 bukan 2 untuk dim_kota? karena...").</li>
          <li>Kasus tepi ditangani: <strong>≥3</strong> (duplikat, FK hantu, format campur — ketiganya ada di Lab 1!).</li>
        </ul>
        <p><Tex math={String.raw`\text{skor rubrik} \geq \frac{10}{14} \approx 71\%`} /> = lulus. Di bawah itu = ulangi fase yang bolong (bukan "tambah fitur baru"!). <strong>Kedalaman &gt; keluasan:</strong> 5 test yang terbukti menangkap error &gt; 15 test yang tidak pernah dijalankan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> pewawancara senior membaca portofolio dalam <strong>90 detik</strong>: README (30 dtk) → arsitektur (30 dtk) → 1 keputusan sulit (30 dtk). Jika 90 detik itu tidak menjawab "masalah apa, keputusan apa, hasil apa" — kode 1.000 baris tidak dibaca. <strong>Capstone = esai argumentatif yang kebetulan punya kode</strong>, bukan sebaliknya.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — 90 detik yang menentukan: anatomi kesan pertama</summary>
        <p>Pewawancara senior: 30 detik README → 30 detik diagram arsitektur → 30 detik 1 keputusan sulit.</p>
        <p>Jika 90 detik itu menjawab "masalah–keputusan–hasil", peluang lolos ke tahap berikut ≈ <strong>70%</strong> (pola dari umpan balik 15+ pewawancara). Jika tidak — kode 1.000 baris <strong>tidak dibaca</strong>.</p>
        <p><Tex math={String.raw`\text{investasi 72 menit katalog+README} \rightarrow \text{menang di 90 detik pertama}`} block /></p>
        <p><strong>Capstone = esai argumentatif yang kebetulan punya kode.</strong> Alokasikan waktu seperti itu.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: 5 Keputusan yang Menentukan Nilai Capstone-mu</h2>
      <p>Yang membedakan capstone "lulus" vs "menang wawancara" bukan jumlah tabel — tapi <strong>keputusan sulit yang didokumentasikan</strong>:</p>
      <ul>
        <li><strong>1. Grain fact:</strong> 1 baris = 1 apa? (1 transaksi? 1 transaksi-hari-nasabah?) Salah grain = semua agregat salah <em>dan tidak ada test yang menangkap</em> (test mengasumsikan grain benar!). Tulis grain di 1 kalimat di README.</li>
        <li><strong>2. SCD untuk dimensi yang berubah:</strong> kota nasabah berubah → Type 1 (timpa, sejarah hilang) atau Type 2 (versi baru)? Jawaban "tergantung": untuk <em>analisis</em> butuh Type 2 (DM2); untuk <em>operasional</em> cukup Type 1. Yang dinilai = <strong>alasannya</strong>, bukan pilihannya.</li>
        <li><strong>3. Survivorship (DM11):</strong> 2 sumber bilang kota berbeda → siapa menang? Aturan tertulis ("terbaru menang, kecuali terverifikasi KTP") &gt; "saya pilih yang pertama".</li>
        <li><strong>4. Idempotency (DM5):</strong> pipeline dijalankan 2× (retry!) → angka tetap sama? Buktikan dengan menjalankan 2× dan menunjukkan total tidak berubah. Ini <strong>demo 30 detik yang paling mengesankan</strong> di wawancara.</li>
        <li><strong>5. Apa yang TIDAK dikerjakan:</strong> "streaming tidak dipakai karena volume 5 baris/hari (DM6)" — keputusan <em>tidak</em> memakai teknologi = tanda kedewasaan. Tulis 3 hal yang sengaja tidak dikerjakan + alasannya.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> pola presentasi 5 menit yang menang — <strong>"1 masalah nyata → 2 keputusan tersulit → 3 angka hasil"</strong>. Contoh: "Sumber mengirim format tanggal 3 macam (masalah) → saya pilih standarisasi di Silver bukan Bronze + SCD Type 1 untuk kota (keputusan) → 0 duplikat, 100% FK valid, 5/5 test hijau (hasil)." Struktur ini bekerja untuk <em>setiap</em> wawancara data — hafalkan polanya, bukan skripnya.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Capstone harus pakai teknologi paling canggih (Spark, Kafka, Airflow) biar mengesankan."</strong></p>
        <p><strong>Yang benar:</strong> pewawancara senior <em>curiga</em> pada capstone dengan 8 teknologi untuk 5.000 baris data — itu sinyal "tidak bisa memilih". Yang mengesankan = <strong>teknologi <em>tepat</em> + alasan tertulis</strong>: "SQLite cukup untuk 5.000 baris (DM18: &lt;10 GB = DuckDB/SQLite), Airflow tidak dipakai karena 1 cron + idempotency cukup (DM5)". Kesederhanaan yang beralasan = senioritas. Kompleksitas tanpa alasan = junioritas berkostum.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Auditor Capstone — Nilai Sendiri Sebelum Dinilai Orang</h2>
      <p>Jalankan checklist rubrik sebagai kode: jujur isi status tiap item, lihat skor &amp; rekomendasi fasenya.</p>
      <PyodideLab
        title="Lab 3 — Cermin Jujur Capstone"
        hint="Coba: isi semua 'penuh' lalu turunkan 1 item ke 'belum'. Rekomendasi apa yang keluar? Itulah gunanya rubrik: preskripsi, bukan vonis."
        defaultCode={`# Lab 3: auditor kesiapan capstone (rubrik lesson ini, sebagai kode)
# Isi JUJUR: "penuh" / "sebagian" / "belum"
penilaian = {
    "Pipeline 3 fase end-to-end":       "penuh",
    "Grain & keputusan desain tertulis": "sebagian",
    ">=5 test, terbukti FAIL->PASS":    "belum",
    "Katalog + owner + label kualitas":  "sebagian",
    "Lineage tergambar":                 "belum",
    "Kasus tepi (>=3) ditangani":        "penuh",
    "README 1 halaman":                  "belum",
}
SKOR = {"penuh": 2, "sebagian": 1, "belum": 0}
SARAN = {
    "Pipeline 3 fase end-to-end":       "-> kerjakan Lab 1 sampai tuntas",
    "Grain & keputusan desain tertulis": "-> tulis 5 keputusan (lihat Intuisi Mendalam)",
    ">=5 test, terbukti FAIL->PASS":    "-> Fase 4: masukkan data rusak, lihat merah, perbaiki",
    "Katalog + owner + label kualitas":  "-> Fase 5: 1 baris deskripsi + nama per tabel",
    "Lineage tergambar":                 "-> Fase 5: gambar sumber -> silver -> gold",
    "Kasus tepi (>=3) ditangani":        "-> cek: duplikat, FK hantu, format campur",
    "README 1 halaman":                  "-> pola: masalah -> keputusan -> hasil",
}

total = sum(SKOR[v] for v in penilaian.values())
print(f"SKOR: {total}/14  (target lulus: >=10)\\n")
for item, status in penilaian.items():
    mark = "✅" if status == "penuh" else ("⚠️" if status == "sebagian" else "❌")
    print(f"  {mark} {item}: {status}")
print()
if total >= 10:
    print("STATUS: SIAP DIWAWANCARAKAN. Tinggal latih presentasi 5 menit.")
else:
    print("STATUS: BELUM. Perbaiki yang bertanda ❌/⚠️ dulu:")
    for item, status in penilaian.items():
        if status != "penuh":
            print(f"   {SARAN[item]}")`}
      />

      <h2 id="case">📋 Mini-Case: Review Produksi — Capstone-mu Dipertanyakan</h2>
      <div className="callout">
        <p>Capstone "Bank Maju"-mu selesai dan lolos rubrik 12/14. Sekarang simulasi <strong>review arsitektur</strong> sebelum naik produksi. Reviewer (seorang staff data engineer) menemukan 3 temuan — tiap temuan ada angkanya:</p>
        <ul>
          <li><strong>Temuan 1:</strong> tabel <code className="inline">gold_penjualan_harian</code> tumbuh <strong>2%/hari</strong> (365 baris/hari × 30 kolom, tanpa partisi). Query dashboard full-scan. Dalam <strong>180 hari</strong>, ukuran = 65.700 baris × ~200 byte ≈ <strong>13 MB</strong> — kecil. Tapi tabel <code className="inline">silver_transaksi</code> tumbuh <strong>50.000 baris/hari</strong>: 180 hari = <strong>9 juta baris ≈ 1,8 GB</strong>, dan job Silver me-rebuild <em>full</em> tiap hari (bukan incremental!). Waktu rebuild hari ke-180 ≈ <strong>6×</strong> hari pertama.</li>
          <li><strong>Temuan 2:</strong> 5 test kualitas hanya jalan <strong>saat kamu klik "run" manual</strong> di lab. Tidak ada jadwal, tidak ada alert. Data rusak yang masuk hari Sabtu ketahuan <strong>Senin pagi</strong> (48 jam buta).</li>
          <li><strong>Temuan 3:</strong> kolom <code className="inline">flag_x</code> di staging <strong>tanpa pemilik dan tanpa definisi</strong> (DM10!). Dua analis menafsirkan beda: "exclude" vs "include" → selisih <strong>Rp120 juta</strong> di 2 versi laporan.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Untuk temuan 1, apa perbaikan arsitekturnya (incremental? partisi?) dan bagaimana kamu <em>membuktikan</em> rebuild time tidak meledak? (b) Untuk temuan 2, rancang penjadwalan + alert minimal yang menutup 48 jam buta — ingat error budget (DM8)! (c) Untuk temuan 3, siapa yang harus memutuskan arti <code className="inline">flag_x</code>, dan apa yang terjadi pada 2 laporan yang sudah terlanjur beda?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Incremental load</strong>: Silver hanya proses <em>delta</em> (50.000 baris/hari, konstan!) bukan rebuild 9 juta baris. Tambah <strong>partisi tanggal</strong> di Silver/Gold (DM4: query 7 hari = 1/26 data). Bukti: ukur waktu rebuild hari ke-1, 30, 90 — harus <strong>flat</strong> (±10%), bukan naik 6×. Ini <strong>test performa</strong>, bukan cuma test kebenaran.</p>
          <p>(b) <strong>Jadwalkan test tiap pipeline run</strong> (DM5: orkestrator) + <strong>alert ke pemilik</strong> (DM9: nama di alert!) dengan threshold: FAIL = hentikan promosi ke Gold + notifikasi &lt;15 menit. 48 jam buta → <strong>&lt;1 jam</strong>. Error budget: izinkan 1 keterlambatan/kuartal untuk perbaikan — jangan kejar 100% sampai tim takut deploy.</p>
          <p>(c) <strong>Pemilik bisnis</strong> (bukan engineer!) yang memutuskan — engineer mengeksekusi definisinya sebagai test (DM7/DM9). Dua laporan yang beda: <strong>restate</strong> yang salah + catat di changelog (DM13: traceability). Pelajaran capstone: <strong>kolom tanpa pemilik = utang yang berbunga tiap hari</strong> — daftarkan pemiliknya <em>sebelum</em> tabel dipakai, bukan sesudah selisih Rp120 juta.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: anggaran fase, skor rubrik, dan incremental vs full rebuild.</p>

      <details className="worked">
        <summary>Soal 1 — Anggaran: 8 jam capstone, alokasi 20/25/25/15/15%. Berapa menit tiap fase (staging, silver, gold, test, katalog)?</summary>
        <p><Tex math={String.raw`480 \times [0{,}20; 0{,}25; 0{,}25; 0{,}15; 0{,}15] = [96; 120; 120; 72; 72] \text{ menit}`} block /></p>
        <p>72 menit katalog terasa mahal — tapi <strong>README + katalog = yang dibaca pewawancara pertama kali</strong>.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Rubrik: nilai [2, 1, 0, 2, 1, 2, 1] untuk 7 kriteria (maks 14). Lulus (≥10)? Fase apa yang diperbaiki?</summary>
        <p>Total = <Tex math={String.raw`2+1+0+2+1+2+1 = 9 < 10`} /> → <strong>BELUM lulus</strong>.</p>
        <p>Perbaiki yang bernilai 0 ("test terbukti FAIL→PASS") → +2 = 11 ✓. <strong>Rubrik = preskripsi, bukan vonis</strong>: ia bilang <em>fase mana</em> yang bolong.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Incremental: Silver 9 juta baris, rebuild full 2 menit/juta baris. Tiap hari tambah 50.000 baris (0,1 menit). Bandingkan biaya harian full vs incremental selama 30 hari.</summary>
        <p>Full: <Tex math={String.raw`9 \times 2 = 18 \text{ menit/hari} \;\Rightarrow\; 540 \text{ menit/bulan}`} />.</p>
        <p>Incremental: <Tex math={String.raw`0{,}1 \text{ menit/hari} \;\Rightarrow\; 3 \text{ menit/bulan}`} block /></p>
        <p><strong>180× lebih murah</strong> — dan full rebuild <em>memburuk tiap hari</em> (data tumbuh), incremental <strong>flat selamanya</strong>. Reviewer produksi mengecek ini.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Kesiapan Capstone (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa staging (Bronze) harus menerima data MENTAH, bukan langsung dibersihkan?"
        options={[
          "Agar hemat kode",
          "ELT: mentah tersimpan = bisa re-process & audit; pembersihan terdokumentasi & ter-test di Silver. Data yang dibuang di awal tidak bisa kembali",
          "Agar cepat",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: keputusan satu arah (DM4). Mentah = opsi masa depan + bukti audit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Transaksi N999 (nasabah tidak ada di dim) terbuang di JOIN. Praktik benar?"
        options={[
          "Diamkan — yang penting mart bersih",
          "Catat + alert sebagai temuan kualitas (FK test FAIL atau quarantine) — silent drop = bom audit; hulu harus tahu",
          "Hapus staging-nya juga",
          "Ubah jadi N001",
        ]}
        correct={1}
        explanation="Benar: setiap baris yang dibuang = temuan yang harus tercatat & ditindaklanjuti di hulu (aturan 1-10-100)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Bagaimana MEMBUKTIKAN test kualitasmu berfungsi?"
        options={[
          "Lihat semua PASS",
          "Sengaja rusak 1 data → pastikan FAIL + pipeline berhenti → perbaiki → PASS. Test yang tak pernah gagal = belum terbukti",
          "Percaya saja",
          "Hapus test yang gagal",
        ]}
        correct={1}
        explanation="Benar: siklus FAIL→PASS yang terdokumentasi = bukti + cerita wawancara terbaik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. README portofolio yang memenangkan wawancara berisi…"
        options={[
          "Daftar 20 tool yang dikuasai",
          "Masalah → keputusan sulit (grain, SCD, toleransi) → hasil terukur. Cara berpikir > hafalan tool",
          "Foto cluster",
          "Copy-paste dokumentasi",
        ]}
        correct={1}
        explanation="Benar: recruiter menilai keputusan & bukti. Tiga kalimat masalah→keputusan→hasil > 500 baris tanpa cerita."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Setelah capstone, langkah karir berikutnya menurut riset lowongan 2026?"
        options={[
          "Hafal 10 tool lagi",
          "Perdalam 1 cloud + Airflow + dbt di proyek nyata; portofolio produksi; baru ke streaming (Kafka/Spark). Bukti > sertifikat",
          "Langsung melamar arsitek",
          "Berhenti belajar",
        ]}
        correct={1}
        explanation="Benar: urutan pasar — fondasi (SQL+Python) → inti modern → pembeda. Capstone = bukti pertama; tambah 1–2 proyek produksi."
      />

      <h2 id="rangkum">📝 Rangkuman Track 8: Data Management</h2>
      <div className="callout">
        <ul>
          <li><strong>DM1:</strong> lifecycle 5 tahap; DIKW; OLTP vs OLAP dipisah; tiap dataset butuh owner + retensi.</li>
          <li><strong>DM2:</strong> ER sebelum DDL; 3NF untuk tulis, star schema untuk baca; SCD2 untuk histori.</li>
          <li><strong>DM3A/B:</strong> ACID untuk uang; NoSQL untuk scale-out; CAP = keputusan per fitur.</li>
          <li><strong>DM4:</strong> ELT + lakehouse (Delta/Iceberg); medallion Bronze→Silver→Gold; Parquet = uang.</li>
          <li><strong>DM5:</strong> orkestrator &gt; cron; dbt = SQL sebagai kode; idempoten → retry aman.</li>
          <li><strong>DM6:</strong> batch default; streaming jika nilai waktu membenarkan; CDC via WAL; Kafka = log.</li>
          <li><strong>DM7:</strong> 6 dimensi; profiling → test → observability; perbaiki di hulu (1-10-100).</li>
          <li><strong>DM8:</strong> kontrak tertulis; SLO = angka; error budget = rem; rename = breaking.</li>
          <li><strong>DM9:</strong> governance = siapa memutuskan; RACI satu A; kebijakan = kode.</li>
          <li><strong>DM10:</strong> katalog searchable; glossary berangka; lineage otomatis dua arah.</li>
          <li><strong>DM11:</strong> saat ragu jangan merge; survivorship per kolom; golden record berjejak.</li>
          <li><strong>DM12:</strong> least privilege; pseudonymisasi untuk analis; anonym = klaim yang dibuktikan; UU PDP.</li>
          <li><strong>DM13:</strong> BCBS 239 = ujian akhir; break = berhenti; regulator menilai proses.</li>
          <li><strong>DM14:</strong> mesh untuk skala org; metrics layer akhiri sengketa; feature store bunuh skew.</li>
          <li><strong>DM15:</strong> tagihan = metrik; IaC; CI/CD data; RPO/RTO dari bisnis.</li>
          <li><strong>DM16:</strong> KPI 5 syarat; dashboard tersertifikasi; analytics engineer.</li>
          <li><strong>DM17:</strong> strategi = keputusan bisnis; ROI berhitung; quick wins; bukti produksi.</li>
          <li><strong>DM18:</strong> Spark untuk data besar; lazy; shuffle = musuh; jangan collect() buta.</li>
          <li><strong>DM19:</strong> buktikan dengan capstone — keputusan tertulis + test terbukti + katalog.</li>
        </ul>
        <p><strong>Selamat!</strong> Kamu menyelesaikan Track 8. Langkah berikutnya: kerjakan capstone dengan serius, lalu tunjukkan ke dunia. 🎓</p>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm18-spark-pyspark" className="btn btn-secondary btn-sm">← DM18</Link>
        <Link href="/" className="btn btn-primary btn-sm">Selesai — Daftar Materi ✓</Link>
      </div>
    </div>
  );
}
