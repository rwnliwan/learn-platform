"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM11Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const dupData = [
    {
      x: ["Tunggal (golden)", "Duplikat 2x", "Duplikat 5x"],
      y: [100000, 115000, 160000],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["100 rb nasabah", "115 rb baris", "160 rb baris"],
      textposition: "outside",
    },
  ];

  const matchData = [
    {
      x: ["Deterministic", "Probabilistic<br>(rendah)", "Probabilistic<br>(tinggi)", "Manual review"],
      y: [70, 20, 8, 2],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#ef4444"] },
      text: ["70%", "20%", "8%", "2%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Entity resolution — "Budi", "Budi Santoso", "B. Santoso": 1 orang atau 3?
# Aturan: deterministic (cocok persis) + probabilistic (skor kemiripan).

import re
def norm(nama):
    return re.sub(r"[^a-z ]", "", nama.lower()).strip()

def jaccard(a, b):
    sa, sb = set(a.split()), set(b.split())
    return len(sa & sb) / len(sa | sb) if sa | sb else 0

records = [
    ("R1", "Budi Santoso", "0812-3456", "Jakarta"),
    ("R2", "Budi Santoso", "08123456", "JKT"),       # format beda
    ("R3", "B. Santoso", "0812-3456", "Jakarta"),    # singkatan
    ("R4", "Budi Santosa", "0812-9999", "Bandung"),  # nama mirip, kota beda!
    ("R5", "Ani Wijaya", "0811-2222", "Surabaya"),
]

print("== DETERMINISTIC: NIK/telp persis sama ==")
by_telp = {}
for rid, nama, telp, kota in records:
    t = re.sub(r"[^0-9]", "", telp)
    by_telp.setdefault(t, []).append(rid)
for t, rids in by_telp.items():
    if len(rids) > 1: print(f"  telp {t}: {rids} -> KEMBARAN PASTI")

print()
print("== PROBABILISTIC: skor kemiripan nama ==")
for i in range(len(records)):
    for j in range(i+1, len(records)):
        a, b = records[i], records[j]
        s = jaccard(norm(a[1]), norm(b[1]))
        kota_sama = a[3][:3].lower() == b[3][:3].lower() or True
        print(f"  {a[0]} vs {b[0]}: skor={s:.2f} ->", end=" ")
        if s >= 0.5 and a[3] == b[3]: print("KEMBARAN (kota sama)")
        elif s >= 0.5: print("REVIEW MANUAL (nama mirip, kota beda!)")
        else: print("beda orang")
print()
print("Pelajaran: R4 mirip nama tapi kota beda -> JANGAN auto-merge.")
print("False merge (gabung orang beda) LEBIH berbahaya dari duplikat.")
print("Coba: ubah ambang 0.5 -> 0.9. Apa yang terjadi ke R2/R3?")`;

  const lab2Code = `# Lab 2: Survivorship — 3 sumber bilang beda, siapa menang?
# Golden record = 1 versi "kebenaran" hasil aturan survivorship per kolom.

sumber = {
    "core_banking": {"nama": "BUDI SANTOSO", "telp": "0812-3456", "kota": "Jakarta",   "update": "2026-09-01"},
    "mobile_app":   {"nama": "Budi Santoso", "telp": "0812-3456", "kota": "JKT",       "update": "2026-10-10"},
    "call_center":  {"nama": "Budi Santoso", "telp": "0812-9999", "kota": "Jakarta",   "update": "2026-10-05"},
}

# Aturan survivorship: nama -> format Title Case dari sumber terbaru;
# telp -> sumber terbaru; kota -> kamus standar.
def golden(sumber):
    urut = sorted(sumber.items(), key=lambda kv: kv[1]["update"], reverse=True)
    terbaru = urut[0][1]
    hasil = {
        "nama": terbaru["nama"].title(),
        "telp": terbaru["telp"],
        "kota": {"jkt": "Jakarta", "jakarta": "Jakarta"}.get(terbaru["kota"].lower(), terbaru["kota"]),
    }
    hasil["_jejak"] = [(s, v["update"]) for s, v in urut]
    return hasil

g = golden(sumber)
print("GOLDEN RECORD:")
for k, v in g.items(): print(f"  {k}: {v}")
print()
print("Catatan: telp diambil dari mobile_app (terbaru, 2026-10-10).")
print("TAPI: bagaimana jika 'terbaru' justru salah input? -> butuh aturan")
print("kepercayaan per sumber (misal: core_banking menang untuk nama legal).")
print()
print("Coba: ubah aturan — nama selalu dari core_banking. Apa yang berubah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM11 — Data Management</span>
        <h1 className="display-title">Master Data & Golden Record:<br />Satu Kebenaran untuk Tiap Entitas</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tiga Budi Santoso</a></li>
          <li><a href="#master">Master vs Reference vs Transaksional</a></li>
          <li><a href="#resolution">Entity Resolution — Detektif Kembaran</a></li>
          <li><a href="#golden">Golden Record & Survivorship — Satu Kebenaran</a></li>
          <li><a href="#mdm">MDM — Gaya Implementasi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Entity Resolution — Kembaran atau Bukan?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Survivorship — Siapa Menang?</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Strategi Master Data</a></li>
          <li><a href="#worked">🔢 Worked Example: 1 Jt Baris → 812 Rb Entitas</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Golden Record = Demokrasi Atribut</a></li>
          <li><a href="#lab3">🔬 Lab 3: Survivorship per Atribut</a></li>
          <li><a href="#case">📋 Mini-Case: Merge yang Menggabungkan Orang Salah</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan master data, reference data, dan data transaksional beserta contohnya.</li>
          <li>Menjelaskan pendekatan entity resolution (deterministic vs probabilistic) dan kapan memakai manual review.</li>
          <li>Merancang aturan survivorship untuk membangun golden record dari banyak sumber.</li>
          <li>Memilih gaya implementasi MDM (registry, coexistence, centralized) sesuai kebutuhan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Tiga Budi Santoso</h2>
      <div className="story">
        <p>Bank punya 3 record: "Budi Santoso" (core banking, Jakarta), "B. Santoso" (mobile app, JKT), "Budi Santosa" (call center, Bandung). Sistem menghitung <strong>3 nasabah</strong>. Marketing mengirim 3 promo (buang uang), risiko menghitung eksposur 3× (salah), dan Budi menerima 3 surat yang namanya beda-beda (kesal).</p>
        <p>Twist-nya: dua di antaranya memang orang yang sama (typo + singkatan), tapi yang ketiga <strong>benar-benar orang lain</strong> di Bandung. Auto-merge buta akan menggabungkan orang yang salah — bencana privasi. Tidak-merge = duplikat selamanya. Inilah dilema <strong>entity resolution</strong>: seni memutuskan "ini kembaran atau bukan" — dan lesson tentang membangun <strong>satu kebenaran</strong> (golden record) tanpa mengorbankan yang tidak bersalah.</p>
      </div>

      <h2 id="master">Master vs Reference vs Transaksional</h2>
      <ul>
        <li><strong>Master data:</strong> entitas inti bisnis yang <em>dibagi</em> lintas sistem — nasabah, produk, cabang, karyawan. <em>Berubah pelan</em>, tapi dipakai di mana-mana. <em>Kepribadian: kartu identitas perusahaan</em> — harus satu dan konsisten.</li>
        <li><strong>Reference data:</strong> daftar nilai baku — kode negara, kode pos, jenis transaksi, status. <em>Berubah sangat jarang</em>, dipakai sebagai <em>kamus validasi</em>. <em>Kepribadian: kamus bahasa</em> — semua orang merujuk ke edisi yang sama.</li>
        <li><strong>Transaksional:</strong> kejadian — transaksi, klik, pembayaran. <em>Bertambah terus</em>, milik satu sistem. Bukan master (tidak dibagi sebagai "kebenaran entitas").</li>
      </ul>
      <p><strong>Kenapa dibedakan:</strong> master/reference butuh <strong>tata kelola khusus</strong> (satu pemilik, satu definisi, sinkronisasi lintas sistem) karena <em>semua</em> sistem bergantung padanya. Transaksi cukup dikelola sistem pemiliknya.</p>

      <PlotlyChart
        data={dupData}
        title="Dampak Duplikat: 100 Ribu Nasabah Nyata vs Tercatat"
        layout={{ xaxis: { title: "Skenario" }, yaxis: { title: "Baris tercatat" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = jumlah baris di tabel untuk 100 ribu nasabah nyata.</p>
        <p><strong>Interpretasi:</strong> duplikat 5× = 60 ribu "nasabah hantu" — semua metrik (total nasabah, rata-rata saldo, NPL) ikut salah. <strong>Pelajaran:</strong> duplikat master data bukan masalah kosmetik; ia meracuni <em>setiap</em> angka yang diturunkan darinya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> reference data terlihat sepele sampai ia salah: satu kode negara salah = semua laporan regional salah. Perlakukan reference data seperti <strong>konstanta fisika</strong> — perubahan butuh persetujuan tertulis + versioning (DM8).</p>
      </div>

      <h2 id="resolution">Entity Resolution — Detektif Kembaran</h2>
      <p><strong>Definisi.</strong> Entity resolution = menentukan record-record mana yang merujuk ke <strong>entitas dunia nyata yang sama</strong>. Tiga pendekatan:</p>
      <ul>
        <li><strong>Deterministic:</strong> aturan pasti — NIK sama → kembaran. Presisi tinggi, recall rendah (typo lolos).</li>
        <li><strong>Probabilistic:</strong> skor kemiripan (nama 0,8 + telp sama + kota beda = ?) → ambang batas. <em>Blocking</em> dulu (bandingkan hanya dalam blok: kota sama) agar tidak O(n²).</li>
        <li><strong>Manual review:</strong> skor di zona abu-abu → manusia memutuskan. Mahal tapi aman.</li>
      </ul>
      <p><strong>Aturan emas:</strong> <strong>false merge (gabung orang beda) &gt;&gt; false duplicate (biarkan ganda)</strong>. Menggabungkan dua orang = pelanggaran privasi + data korup; membiarkan duplikat = inefisiensi. Saat ragu: <strong>jangan merge</strong> — kirim ke review.</p>

      <PlotlyChart
        data={matchData}
        title="Distribusi Keputusan Matching (praktik umum)"
        layout={{ xaxis: { title: "Jalur keputusan" }, yaxis: { title: "% pasangan kandidat" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi pasangan record yang diputus tiap jalur.</p>
        <p><strong>Interpretasi:</strong> 70% selesai otomatis (deterministic), 28% butuh skor, <strong>2% butuh manusia</strong> — kecil tapi kritis. <strong>Pelajaran:</strong> desain sistem untuk 2% itu (antrean review + SLA), bukan berharap 100% otomatis. Otomatisasi penuh = false merge menunggu waktu.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "AI/ML bisa entity resolution 100% otomatis tanpa salah."</strong></p>
        <p><strong>Yang benar:</strong> ML menaikkan akurasi skor, tapi <strong>ambiguitas inheren</strong> tetap ada ("Budi Santoso" kembar nama beda orang — tidak ada algoritma yang bisa tahu tanpa data tambahan). Desain yang benar = otomatisasi + <strong>jalur review manusia</strong> untuk zona abu-abu + aturan "saat ragu, jangan merge".</p>
      </div>

      <h2 id="golden">Golden Record & Survivorship — Satu Kebenaran</h2>
      <p><strong>Definisi.</strong> Golden record = <strong>satu versi "kebenaran"</strong> per entitas, hasil menggabungkan banyak sumber via <strong>aturan survivorship</strong>: untuk tiap kolom, tentukan <em>sumber mana menang</em>.</p>
      <p><strong>Contoh aturan survivorship:</strong></p>
      <ul>
        <li><code className="inline">nama_legal</code> → core_banking selalu menang (sumber otoritatif).</li>
        <li><code className="inline">no_telp</code> → sumber dengan <code className="inline">update_terbaru</code> menang.</li>
        <li><code className="inline">kota</code> → kamus standar ("JKT" → "Jakarta") + sumber terbaru.</li>
        <li><strong>Kepercayaan per sumber:</strong> bobot — Dukcapil &gt; core banking &gt; input manual.</li>
      </ul>
      <p><strong>Wajib:</strong> simpan <strong>jejak</strong> (lineage! DM10) — "nilai ini dari sumber X tanggal Y via aturan Z". Golden record tanpa jejak = tidak bisa diaudit, tidak bisa diperbaiki saat aturan salah.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> "terbaru menang" adalah default yang <em>berbahaya</em> — data terbaru bisa jadi salah input. Aturan survivorship yang matang = <strong>otoritas per kolom</strong> (siapa sumber kebenaran untuk kolom ini?) + kebaruan sebagai tie-breaker, bukan raja.</p>
      </div>

      <h2 id="mdm">MDM — Gaya Implementasi</h2>
      <p>Tiga gaya Master Data Management:</p>
      <ul>
        <li><strong>Registry:</strong> tidak menyimpan data — hanya <em>indeks</em> "record X di sistem A = record Y di sistem B". Ringan, cepat mulai. Cocok: awal perjalanan, banyak sistem legacy.</li>
        <li><strong>Coexistence:</strong> hub master + sistem sumber tetap jalan; sinkronisasi dua arah. Seimbang. Cocok: transisi bertahap.</li>
        <li><strong>Centralized:</strong> satu hub otoritatif; semua sistem baca/tulis via hub. Paling rapi, paling mahal & lama. Cocok: greenfield / regulasi ketat.</li>
      </ul>
      <p><strong>Nasihat praktis:</strong> mulai dari <strong>registry untuk 1 domain</strong> (nasabah), buktikan nilai (duplikat turun, kampanye tepat), baru perluas. Big-bang MDM = proyek 2 tahun yang sering mati di tengah.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Beli software MDM = master data beres."</strong></p>
        <p><strong>Yang benar:</strong> software MDM = mesin; <strong>aturan survivorship + owner + proses stewardship</strong> = bahan bakar. MDM tanpa aturan yang disepakati bisnis = mesin mahal tanpa sopir. 70% kegagalan MDM = masalah organisasi, bukan teknologi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Entity Resolution — Kembaran atau Bukan?</h2>
      <p>Terapkan deterministic + probabilistic pada 5 record, rasakan zona abu-abunya.</p>
      <PyodideLab
        title="Lab 1 — Detektif Kembaran"
        hint="Coba: ubah ambang 0.5 → 0.9. Trade-off apa yang terjadi? (Petunjuk: recall vs presisi.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Survivorship — Siapa Menang?</h2>
      <p>Bangun golden record dari 3 sumber yang saling bertentangan + simpan jejaknya.</p>
      <PyodideLab
        title="Lab 2 — Satu Kebenaran"
        hint="Coba: ubah aturan — nama selalu dari core_banking. Kapan 'terbaru menang' berbahaya?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Strategi Master Data</h2>

      <div className="decision-card">
        <h3>1. Duplikat merajalela, banyak sistem legacy → <strong>mulai registry untuk 1 domain</strong></h3>
        <p><strong>Kondisi:</strong> belum ada MDM, butuh kemenangan cepat.</p>
        <p><strong>Kenapa:</strong> indeks kembaran memberi nilai tanpa merombak sistem. Buktikan, baru perluas.</p>
      </div>

      <div className="decision-card">
        <h3>2. Kembaran jelas (ID sama) → <strong>deterministic matching</strong></h3>
        <p><strong>Kondisi:</strong> ada identifier kuat (NIK, NPWP).</p>
        <p><strong>Kenapa:</strong> murah, presisi tinggi. Tapi tetap validasi format NIK (bisa typo!).</p>
      </div>

      <div className="decision-card">
        <h3>3. Tanpa ID kuat, data kotor → <strong>probabilistic + blocking + manual review</strong></h3>
        <p><strong>Kondisi:</strong> nama/alamat saja.</p>
        <p><strong>Kenapa:</strong> skor + ambang + zona abu-abu ke manusia. Aturan: saat ragu, jangan merge.</p>
      </div>

      <div className="decision-card">
        <h3>4. Banyak sumber bertentangan → <strong>golden record + survivorship per kolom + jejak</strong></h3>
        <p><strong>Kondisi:</strong> 3+ sistem punya versi beda untuk entitas sama.</p>
        <p><strong>Kenapa:</strong> tanpa aturan menang, tiap tim pilih sesukanya → angka beda-beda (DM1). Jejak = bisa diaudit.</p>
      </div>

      <div className="decision-card">
        <h3>5. Butuh otoritas penuh / regulasi ketat → <strong>centralized MDM</strong></h3>
        <p><strong>Kondisi:</strong> greenfield atau wajib satu sumber kebenaran.</p>
        <p><strong>Kenapa:</strong> paling rapi. Tapi mahal & lama — jangan mulai dari sini kecuali harus.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Saat ragu, jangan merge</strong> — false merge &gt;&gt; duplikat.</li>
          <li><strong>Survivorship per kolom</strong> (otoritas dulu, kebaruan kemudian).</li>
          <li><strong>Golden record wajib berjejak</strong> (sumber + tanggal + aturan).</li>
          <li><strong>Mulai registry 1 domain</strong> — bukan big-bang.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: 1 Juta Baris, Berapa "Budi Santoso" Asli?</h2>
      <p>Tiga sistem (core banking, kartu kredit, mobile app) masing-masing punya tabel nasabah: 400.000 + 350.000 + 250.000 = <strong>1.000.000 baris</strong>. Berapa manusia unik sebenarnya? Ikuti entity resolution-nya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Blocking: dari 1 triliun pasangan ke 2 juta (klik untuk buka)</summary>
        <p>Perbandingan naif semua-pasangan: <Tex math={String.raw`\binom{10^6}{2} \approx 5 \times 10^{11}`} /> = <strong>500 miliar pasangan</strong> — mustahil.</p>
        <p><strong>Blocking</strong> by kode pos (1.000 kode pos, ~1.000 baris/kode): pasangan per blok = <Tex math={String.raw`\binom{1000}{2} \approx 500.000`} />; total = <Tex math={String.raw`1.000 \times 500.000 = 5 \times 10^8`} /> = 500 juta. Masih besar — tambah blocking key kedua (3 huruf nama depan, ~17.576 kombinasi):</p>
        <p><Tex math={String.raw`\text{pasangan} \approx \frac{10^6}{17.576} \text{ per blok} \to \binom{57}{2} \times 17.576 \approx 28 \text{ juta}`} block /></p>
        <p>Dari 500 miliar → 28 juta (<strong>18.000× reduksi</strong>) hanya dengan 2 blocking key. Harga: pasangan kembar yang <em>beda blok</em> (typo di kode pos!) hilang — trade-off recall vs komputasi yang harus disadari, bukan kecelakaan.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Scoring: "Budi Santoso" vs "Budy Santoso"</summary>
        <p>Pasangan kandidat dinilai (probabilistic record linkage, Fellegi-Sunter):</p>
        <ul>
          <li>NIK sama persis: <strong>+8 poin</strong> (sangat diskriminatif)</li>
          <li>Nama mirip (Jaro-Winkler 0,92): <strong>+4 poin</strong></li>
          <li>Tgl lahir sama: <strong>+5 poin</strong></li>
          <li>No HP beda: <strong>−3 poin</strong> (orang ganti nomor — penalti kecil)</li>
        </ul>
        <p>Total <strong>14 poin</strong>; threshold match = 10 → <strong>MATCH</strong>. Hasil run: 1.000.000 baris → <strong>812.000 entitas unik</strong> (188.000 duplikat terdeteksi!). Validasi sampel 500 pasangan: presisi 98,2%, recall 94,5%.</p>
        <p><Tex math={String.raw`\text{false merge} = 500 \times (1-0{,}982) \approx 9 \text{ pasangan}`} /> — 9 pasang orang <em>berbeda</em> digabung (mini-case "merge yang menggabungkan orang salah"!). Untuk data finansial, 9 false merge = 9 potensi pelanggaran privasi. Makanya threshold untuk bank <strong>lebih tinggi</strong> (presisi &gt; recall): lebih baik 1 orang terpecah 2 (bisa digabung manual) daripada 2 orang tergabung 1 (bocor data).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Golden record &amp; survivorship: siapa menang?</summary>
        <p>Entitas E-812 (Budi Santoso) punya 3 versi: core banking (nama lengkap, alamat 2019), kartu kredit (nama singkat, alamat 2024), mobile app (email terverifikasi OTP, alamat 2023). Aturan survivorship:</p>
        <ul>
          <li><code className="inline">nama</code> → sumber <strong>terverifikasi KTP</strong> menang (core banking).</li>
          <li><code className="inline">alamat</code> → <strong>terbaru</strong> menang (kartu kredit, 2024).</li>
          <li><code className="inline">email</code> → <strong>terverifikasi OTP</strong> menang (mobile app).</li>
          <li><code className="inline">no_hp</code> → terbaru + terverifikasi menang.</li>
        </ul>
        <p>Golden record = <strong>Frankenstein terbaik</strong>: tiap atribut dari sumber paling tepercaya untuk atribut itu. Bukan "satu sumber menang semua" — itu pola naif yang membuang verifikasi OTP dari mobile app.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Nilai bisnis: 188.000 duplikat = berapa rupiah?</summary>
        <p>Sebelum MDM: kampanye SMS ke 1.000.000 "nasabah" (188.000 ganda) @Rp150 = <strong>Rp28,2 juta terbuang</strong> per blast; 12 blast/tahun = <strong>Rp338 juta/tahun</strong>. Setelah MDM: blast ke 812.000 unik. Plus: laporan regulator (DM13) tidak lagi double-count; model churn (DM14: feature store) tidak lagi melihat "2 orang" yang sama. <strong>Biaya MDM</strong> (tool + 1 FTE, Rp800 juta/tahun) vs <strong>penghematan langsung Rp338 juta + risiko denda + akurasi model</strong> — payback &lt; 2 tahun untuk bank menengah.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> bedakan 3 jenis data dengan uji "berapa kali berubah?": <strong>master</strong> (pelanggan, produk — jarang berubah, dipakai semua orang) vs <strong>reference</strong> (kode negara, kurs — berubah sangat jarang, <em>standar</em> bersama) vs <strong>transaksional</strong> (pembelian — selalu bertambah, milik 1 proses). Yang butuh MDM = master + reference. MDM untuk data transaksional = salah alamat (itu warehouse/DM4).</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Steward: berapa banyak yang butuh manusia?</summary>
        <p>Dari 188.000 duplikat, 95% auto-match (skor &gt; threshold), 5% abu-abu butuh steward.</p>
        <p><Tex math={String.raw`188.000 \times 0{,}05 = 9.400 \text{ review} \times 2 \text{ mnt} = 18.800 \text{ mnt} \approx 313 \text{ jam}`} block /></p>
        <p>313 jam ≈ <strong>2 bulan 1 FTE</strong> — sekali saja (saat inisialisasi). Setelah itu: puluhan review/minggu (data baru). <strong>Anggaran steward = 20–30% biaya implementasi/tahun.</strong> Yang lupa ini punya golden record yang membusuk — akurat di hari peluncuran, sampah 2 tahun kemudian.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Golden Record = Demokrasi Atribut</h2>
      <p>Tiga intuisi yang memisahkan MDM dewasa dari "proyek dedup":</p>
      <ul>
        <li><strong>Survivorship per atribut, bukan per record.</strong> Insting pemula: "pilih 1 sumber paling bagus, pakai semua field-nya". Masalah: tidak ada sumber yang terbaik di <em>semua</em> atribut. Pola dewasa = <strong>matriks kepercayaan</strong>: baris = atribut, kolom = sumber, isi = skor (0–100) dari verifikasi + kebaruan + kelengkapan. Golden record = argmax per baris. Matriks ini <em>didokumentasikan</em> — saat sumber berubah kualitas, skor di-update, golden record berubah otomatis.</li>
        <li><strong>MDM gaya registry vs warehouse vs coexistence.</strong> <strong>Registry</strong>: tidak menyimpan data, hanya peta "E-812 = (sysA:123, sysB:456)" — murah, tapi tiap baca harus gabung real-time. <strong>Centralized</strong>: simpan golden record fisik — cepat dibaca, tapi butuh sinkronisasi balik. <strong>Coexistence</strong>: golden record + publish perubahan ke sumber (sumber tetap "kotor" tapi terhubung). Pilih registry saat sumber tidak boleh diubah (legacy); centralized saat butuh 1 API cepat; coexistence saat sumber tetap sistem operasional.</li>
        <li><strong>Entity resolution tidak pernah "selesai".</strong> Data baru datang tiap hari; threshold yang pas tahun ini meleset tahun depan (kualitas sumber berubah). MDM = <strong>proses berjalan</strong> (steward meninjau pasangan abu-abu tiap minggu, DM9) bukan proyek 6 bulan. Anggaran "pemeliharaan MDM" = 20–30% biaya implementasi per tahun — yang lupa ini punya golden record yang membusuk.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> bank hasil merger (3 core banking jadi 1) = kasus MDM tersulit: <em>tidak ada</em> NIK bersama di awal (sistem lama pakai ID internal). Solusi bertahap: (1) deterministic match by NIK di mana ada (±60%), (2) probabilistic untuk sisanya, (3) <strong>data steward</strong> meninjau 5% abu-abu, (4) golden record diterbitkan sebagai <strong>API master</strong> yang dipakai semua aplikasi baru. Hasil 18 bulan: 2,1 juta baris → 1,7 juta nasabah unik. Tanpa ini, "satu nasabah satu pandang" (single customer view) = mitos.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Beli tool MDM mahal = master data beres."</strong></p>
        <p><strong>Yang benar:</strong> tool MDM = <em>mesin</em>; yang menentukan = <strong>aturan survivorship + threshold match + steward</strong>. Tool tanpa aturan = mesin tanpa supir: ia akan menggabungkan orang salah dengan sangat efisien (mini-case!). 70% kegagalan MDM = masalah <em>governance</em> (tidak ada yang berani memutuskan "sumber mana menang untuk alamat?"), bukan teknologi. Mulai dari 1 entitas (pelanggan), 3 sumber, aturan tertulis 1 halaman — buktikan nilainya, baru skala.</p>
      </div>

      <div className="callout">
        <h3>📊 Contoh Matriks Kepercayaan (3 sumber × 4 atribut)</h3>
        <p>Skor 0–100 per (atribut, sumber) — didokumentasikan, bukan di-hardcode:</p>
        <ul>
          <li><strong>nama:</strong> core banking 95 (verifikasi KTP) &gt; kartu kredit 60 &gt; mobile app 50.</li>
          <li><strong>alamat:</strong> kartu kredit 90 (terbaru 2024) &gt; mobile app 70 &gt; core banking 40 (2019!).</li>
          <li><strong>email:</strong> mobile app 95 (OTP) &gt; lainnya 30.</li>
          <li><strong>no_hp:</strong> mobile app 90 (OTP) &gt; lainnya 50.</li>
        </ul>
        <p>Golden record = <strong>argmax per baris</strong> — tidak ada satu sumber yang menang semua. Saat kualitas sumber berubah, <strong>update skornya</strong> (bukan kodenya) — golden record mengikuti otomatis.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Survivorship — Siapa Menang per Atribut?</h2>
      <p>Terapkan matriks kepercayaan: bangun golden record dari 3 sumber yang saling bertentangan.</p>
      <PyodideLab
        title="Lab 3 — Demokrasi Atribut"
        hint="Coba: ubah TRUST['mobile_app']['email'] dari 95 ke 40. Golden record ikut berubah? Itulah kenapa matriks didokumentasikan, bukan di-hardcode."
        defaultCode={`# Lab 3: golden record dari matriks kepercayaan (per atribut!)
sumber = {
    "core_banking": {"nama": "Budi Santoso", "alamat": "Jl. Mawar 1, JKT (2019)",
                     "email": "budi@lama.com", "no_hp": "0811000111"},
    "kartu_kredit": {"nama": "B. Santoso", "alamat": "Jl. Melati 9, BDG (2024)",
                     "email": "budi@lama.com", "no_hp": "0811000111"},
    "mobile_app":   {"nama": "Budi", "alamat": "Jl. Mawar 1, JKT (2023)",
                     "email": "budi.s@baru.com", "no_hp": "0822000222"},
}
# Matriks kepercayaan 0-100 per (atribut, sumber): verifikasi + kebaruan
TRUST = {
    "nama":   {"core_banking": 95, "kartu_kredit": 60, "mobile_app": 50},
    "alamat": {"core_banking": 40, "kartu_kredit": 90, "mobile_app": 70},
    "email":  {"core_banking": 30, "kartu_kredit": 30, "mobile_app": 95},
    "no_hp":  {"core_banking": 50, "kartu_kredit": 50, "mobile_app": 90},
}

golden, asal = {}, {}
for attr in ["nama", "alamat", "email", "no_hp"]:
    pemenang = max(TRUST[attr], key=lambda s: TRUST[attr][s])
    golden[attr] = sumber[pemenang][attr]
    asal[attr] = f"{pemenang} (skor {TRUST[attr][pemenang]})"

print("GOLDEN RECORD E-812:")
for attr, val in golden.items():
    print(f"  {attr:7s} = {val:28s} <- {asal[attr]}")
print()
print("Perhatikan: TIDAK ADA satu sumber yang menang semua.")
print("'Pilih sumber terbaik' (naif) akan membuang email terverifikasi OTP.")`}
      />

      <h2 id="case">📋 Mini-Case: Merge yang Menggabungkan Orang Salah</h2>
      <div className="callout">
        <p>Bank menjalankan auto-merge "nama mirip 80% + kota sama". Hasil: <strong>"Ahmad Hidayat" (Jakarta)</strong> tergabung dengan <strong>"Ahmad Hidayah" (Jakarta)</strong> — dua orang berbeda! Rekening mereka tercampur di golden record: Ahmad H. menerima tagihan kartu kredit milik Ahmad H. yang lain. Komplain → investigasi → permintaan maaf publik.</p>
        <p><strong>Pertanyaan:</strong> (a) Di mana letak kesalahan desainnya? (b) Perbaikan sistemnya? (c) Bagaimana memulihkan golden record yang sudah tercemar?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Auto-merge pada zona abu-abu</strong> tanpa verifikasi identifier kuat + tanpa manual review. Nama mirip ≠ orang sama.</p>
          <p>(b) <strong>Deterministic dulu</strong> (NIK/telp cocok = merge); skor 0,5–0,9 = <strong>antrean review manusia</strong>, bukan auto-merge. Ambang auto-merge hanya untuk skor sangat tinggi + identifier pendukung.</p>
          <p>(c) <strong>Unmerge via jejak</strong> (DM10): karena golden record menyimpan sumber+aturan, merge bisa dibalik per entitas. Tanpa jejak = tidak bisa diperbaiki. Inilah harga "merge buta".</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: blocking, scoring match, dan survivorship.</p>

      <details className="worked">
        <summary>Soal 1 — Blocking: 2 juta baris, blocking by kota (5.000 kota, ~400 baris/kota). Berapa pasangan kandidat? Bandingkan dengan tanpa blocking.</summary>
        <p>Per blok: <Tex math={String.raw`\binom{400}{2} = 79.800`} /> → total <Tex math={String.raw`5.000 \times 79.800 \approx 399 \text{ juta}`} />.</p>
        <p>Tanpa blocking: <Tex math={String.raw`\binom{2 \times 10^6}{2} \approx 2 \times 10^{12}`} block /></p>
        <p><strong>5.000× reduksi.</strong> Harga: kembaran yang beda blok (typo kota!) hilang — trade-off yang harus disadari.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Scoring: NIK sama (+8), nama mirip 0,88 (+3), tanggal lahir beda (−6). Total vs threshold 10. Match atau review manual?</summary>
        <p><Tex math={String.raw`8 + 3 - 6 = 5 < 10`} block /></p>
        <p><strong>Review manual.</strong> NIK sama kuat, tapi tanggal lahir beda = red flag (mungkin NIK typo/kembar identik!). Untuk bank: threshold tinggi, presisi &gt; recall — lebih baik 1 orang terpecah 2 daripada 2 orang tergabung 1.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Survivorship: 3 sumber memberi kota berbeda — core banking "Jakarta (2019)", kartu kredit "Bandung (2024)", mobile app "Jakarta (2023)". Aturan: terbaru menang. Kota mana di golden record? Kenapa?</summary>
        <p><strong>Bandung (2024)</strong> — data terbaru. Tapi waspada: "terbaru" kalah dari "terverifikasi" jika aturannya begitu (matriks kepercayaan!). <strong>Golden record = argmax matriks, bukan tebakan.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bedanya master data vs reference data vs transaksional?"
        options={[
          "Sama saja",
          "Master = entitas inti lintas sistem (nasabah); reference = daftar baku (kode negara); transaksional = kejadian (transaksi)",
          "Master = yang paling besar ukurannya",
          "Reference = data rahasia",
        ]}
        correct={1}
        explanation="Benar: master/reference butuh tata kelola khusus karena dibagi lintas sistem; transaksi milik sistem pemiliknya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. 'Budi Santoso' vs 'Budi Santosa' (kota beda), skor kemiripan 0,85. Keputusan tepat?"
        options={[
          "Auto-merge — skor tinggi",
          "JANGAN auto-merge — kirim ke manual review; false merge (gabung orang beda) jauh lebih berbahaya dari duplikat",
          "Hapus keduanya",
          "Biarkan, tidak penting",
        ]}
        correct={1}
        explanation="Benar: aturan emas — saat ragu, jangan merge. Nama mirip + kota beda = zona abu-abu klasik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Tiga sumber memberi no_telp berbeda. Aturan survivorship yang paling defensibel?"
        options={[
          "Pilih acak",
          "Sumber dengan update terbaru menang — tapi untuk kolom kritis, otoritas sumber (misal core banking untuk nama legal) mengalahkan kebaruan",
          "Selalu yang terpendek",
          "Gabungkan semua nomor",
        ]}
        correct={1}
        explanation="Benar: otoritas per kolom dulu, kebaruan sebagai tie-breaker. 'Terbaru menang' buta berbahaya (bisa salah input)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Golden record WAJIB menyimpan…"
        options={[
          "Hanya nilai final",
          "Jejak: nilai dari sumber X tanggal Y via aturan Z — agar bisa diaudit dan di-unmerge",
          "Password sumber",
          "Tidak perlu apa-apa",
        ]}
        correct={1}
        explanation="Benar: tanpa jejak, golden record = kotak hitam yang tidak bisa diperbaiki saat salah (mini-case)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Perusahaan dengan banyak sistem legacy ingin mulai MDM. Langkah terbaik?"
        options={[
          "Big-bang centralized 2 tahun",
          "Mulai registry untuk 1 domain (nasabah) — ringan, cepat memberi nilai, baru perluas",
          "Beli software termahal",
          "Tunda 5 tahun",
        ]}
        correct={1}
        explanation="Benar: kemenangan kecil dulu. Big-bang MDM sering mati di tengah; 70% kegagalan = organisasi, bukan teknologi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dalam entity resolution, teknik 'blocking' berfungsi untuk…"
        options={[
          "Memblokir user",
          "Membatasi perbandingan hanya dalam blok (misal kota sama) agar tidak O(n²) — 1 juta record = 1 triliun perbandingan tanpa blocking",
          "Menghapus duplikat otomatis",
          "Mengenkripsi nama",
        ]}
        correct={1}
        explanation="Benar: blocking = optimasi komputasi. Bandingkan hanya kandidat plausibel, bukan semua pasangan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Master:</strong> entitas inti lintas sistem; <strong>reference:</strong> daftar baku; <strong>transaksional:</strong> kejadian.</li>
          <li><strong>Entity resolution:</strong> deterministic (pasti) + probabilistic (skor) + manual review (zona abu-abu).</li>
          <li><strong>Aturan emas:</strong> saat ragu, jangan merge — false merge &gt;&gt; duplikat.</li>
          <li><strong>Golden record:</strong> survivorship per kolom (otoritas &gt; kebaruan) + jejak lengkap.</li>
          <li><strong>MDM:</strong> registry → coexistence → centralized; mulai kecil.</li>
          <li><strong>Jangan:</strong> auto-merge zona abu-abu; beli tool tanpa aturan; big-bang.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm10-metadata-lineage" className="btn btn-secondary btn-sm">← DM10</Link>
        <Link href="/learn/dm12-keamanan-privasi" className="btn btn-primary btn-sm">Next: DM12 →</Link>
      </div>
    </div>
  );
}