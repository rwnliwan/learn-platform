"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM12Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const breachData = [
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [4.24, 4.35, 4.45, 4.45, 4.88, 5.1],
      type: "bar",
      marker: { color: "#ef4444" },
      text: ["$4,24 jt", "$4,35 jt", "$4,45 jt", "$4,45 jt", "$4,88 jt", "$5,1 jt"],
      textposition: "outside",
    },
  ];

  const teknikData = [
    {
      x: ["Masking", "Tokenisasi", "Pseudonymisasi", "Anonymisasi", "Enkripsi"],
      y: [3, 5, 6, 9, 4],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#2a7de1"] },
      text: ["reversibel, format jaga", "reversibel via vault", "reversibel + kunci", "IRREVERSIBEL", "reversibel + kunci"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Masking, tokenisasi, pseudonymisasi — rasakan bedanya
import hashlib, re

data = [
    {"nama": "Budi Santoso", "nik": "3174051201900001", "telp": "081234567890"},
    {"nama": "Ani Wijaya",   "nik": "3174051201900002", "telp": "081298765432"},
]

print("== 1. MASKING: samarkan sebagian, format tetap (untuk analis/CS) ==")
for d in data:
    print(f"  {d['nama'][:1]}*** | NIK {d['nik'][:4]}********{d['nik'][-2:]} | telp {d['telp'][:4]}****{d['telp'][-2:]}")

print()
print("== 2. TOKENISASI: ganti dengan token acak, peta di VAULT terpisah ==")
vault = {}
def tokenize(nilai):
    tok = "TKN-" + hashlib.sha256(nilai.encode()).hexdigest()[:8].upper()
    vault[tok] = nilai
    return tok
for d in data:
    print(f"  NIK -> {tokenize(d['nik'])}")
print("  Vault (TERPISAH & TERKUNCI):", list(vault.items())[0], "...")
print("  Bocor token tanpa vault = tidak berguna. Itulah keamanannya.")

print()
print("== 3. PSEUDONYMISASI: ganti dengan pseudonim deterministik (bisa join!) ==")
def pseudo(nilai, kunci="kunci-rahasia"):
    return "P-" + hashlib.sha256((kunci + nilai).encode()).hexdigest()[:10]
for d in data:
    print(f"  {d['nama']} -> {pseudo(d['nik'])}")
print("  NIK sama -> pseudonim SAMA (bisa join antar tabel), tapi tidak bisa")
print("  dibalik tanpa kunci. Beda dengan anonymisasi yang IRREVERSIBEL.")
print()
print("Coba: pseudonimkan NIK yang sama 2x — hasilnya konsisten? Kenapa itu penting?")`;

  const lab2Code = `# Lab 2: RBAC vs ABAC — siapa boleh lihat apa?
# Skenario: tabel gaji. Aturan: hanya HR & manajer langsung yang boleh lihat gaji timnya.

users = {
    "rina":  {"roles": ["hr"],       "dept": "HR"},
    "budi":  {"roles": ["manager"],  "dept": "Engineering", "tim": ["ani", "cici"]},
    "ani":   {"roles": ["staff"],    "dept": "Engineering"},
    "dimas": {"roles": ["manager"],  "dept": "Marketing",   "tim": ["eko"]},
}
gaji = {"ani": 8000000, "cici": 8500000, "eko": 9000000}

def rbac_ok(user, aksi):
    # RBAC: keputusan dari ROLE saja
    return "hr" in users[user]["roles"] or "manager" in users[user]["roles"]

def abac_ok(user, target):
    # ABAC: keputusan dari ATRIBUT (role + relasi + dept)
    u = users[user]
    if "hr" in u["roles"]: return True
    if "manager" in u["roles"] and target in u.get("tim", []): return True
    return False

print("== RBAC (role saja): 'manager boleh lihat gaji' ==")
for u in ["budi", "dimas"]:
    print(f"  {u} lihat gaji ani: {'BOLEH' if rbac_ok(u, 'lihat') else 'TOLAK'}")
print("  MASALAH: dimas (Marketing) boleh lihat gaji ani (Engineering)!")
print()
print("== ABAC (atribut): 'manajer hanya gaji timnya sendiri' ==")
for u, t in [("budi", "ani"), ("dimas", "ani"), ("rina", "eko"), ("ani", "ani")]:
    print(f"  {u} lihat gaji {t}: {'BOLEH' if abac_ok(u, t) else 'TOLAK'}")
print()
print("Pelajaran: RBAC sederhana tapi kasar; ABAC presisi tapi kompleks.")
print("Mulai dari RBAC; naik ke ABAC saat aturan 'kecuali' menumpuk.")
print("Coba: tambah aturan 'staff boleh lihat gaji SENDIRI' — RBAC atau ABAC?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM12 — Data Management</span>
        <h1 className="display-title">Keamanan & Privasi Data:<br />Benteng di Sekeliling Harta Karun</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 270 Juta Baris di Forum Gelap</a></li>
          <li><a href="#akses">RBAC vs ABAC — Siapa Boleh Masuk Ruangan Mana</a></li>
          <li><a href="#teknik">Lima Teknik Perlindungan: Masking → Enkripsi</a></li>
          <li><a href="#enkripsi">Enkripsi — At-Rest, In-Transit, Kunci</a></li>
          <li><a href="#retensi">Retensi & Hak Hapus — Data Punya Masa Berlaku</a></li>
          <li><a href="#regulasi">UU PDP & GDPR — Aturan Main yang Wajib Tahu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Masking, Tokenisasi, Pseudonymisasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: RBAC vs ABAC dalam Kode</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Lindungi Data Bagaimana</a></li>
          <li><a href="#worked">🔢 Worked Example: Anatomi 270 Jt Baris Bocor</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Privasi = Kontrol, Bukan Rahasia</a></li>
          <li><a href="#lab3">🔬 Lab 3: Uji k-Anonymity</a></li>
          <li><a href="#case">📋 Mini-Case: "Anonym" yang Ternyata Tidak</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan RBAC dan ABAC serta memilih yang tepat sesuai kompleksitas aturan akses.</li>
          <li>Menjelaskan 5 teknik perlindungan data (masking, tokenisasi, pseudonymisasi, anonymisasi, enkripsi) dan kapan masing-masing dipakai.</li>
          <li>Menjelaskan prinsip enkripsi at-rest/in-transit dan manajemen kunci.</li>
          <li>Menjelaskan kewajiban utama UU PDP Indonesia & GDPR yang berdampak pada desain data.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 270 Juta Baris di Forum Gelap</h2>
      <div className="story">
        <p>Suatu pagi, forum gelap menjual "database 270 juta baris" berisi NIK, nama, alamat, nomor HP — diduga dari sebuah institusi besar. Harganya: Rp250 juta. Sekali bocor, data itu <strong>tidak bisa "ditarik kembali"</strong> — ia digandakan selamanya. Korbannya menerima SMS penipuan bertahun-tahun kemudian.</p>
        <p>Twist-nya: investigasi sering menemukan bukan peretasan canggih, melainkan <strong>akses berlebihan yang dibiarkan</strong>: analis junior bisa download 270 juta baris tanpa approval tercatat; backup tidak terenkripsi; tidak ada yang tahu siapa mengakses apa. Keamanan data jarang jebol karena "hacker jenius" — biasanya jebol karena <strong>pintu yang tidak dikunci</strong>. Lesson ini tentang mengunci pintu dengan benar: akses, teknik perlindungan, dan hukum yang mengaturnya.</p>
      </div>

      <h2 id="akses">RBAC vs ABAC — Siapa Boleh Masuk Ruangan Mana</h2>
      <ul>
        <li><strong>RBAC (Role-Based):</strong> akses dari <em>peran</em> — "analis boleh baca tabel Gold; hanya HR boleh baca gaji". <em>Kepribadian: satpam dengan daftar nama peran</em> — sederhana, mudah diaudit. Kelemahan: aturan "kecuali" menumpuk ("manajer boleh lihat gaji <em>timnya sendiri</em>") → ledakan peran.</li>
        <li><strong>ABAC (Attribute-Based):</strong> akses dari <em>atribut</em> — user.dept, user.tim, data.klasifikasi, jam akses. "Manajer boleh lihat gaji JIKA target di timnya DAN jam kerja". <em>Kepribadian: satpam dengan kecerdasan</em> — presisi tinggi, tapi kebijakan kompleks & sulit diaudit sekilas.</li>
      </ul>
      <p><strong>Prinsip least privilege:</strong> beri akses <em>minimum</em> yang dibutuhkan — bukan maksimum yang nyaman. Pelanggaran klasik cerita pembuka: analis junior dengan akses download massal = least privilege dilanggar.</p>
      <p><strong>Aturan praktis:</strong> mulai RBAC (cukup untuk 80% kasus). Naik ke ABAC saat pengecualian menumpuk. Keduanya butuh <strong>approval tercatat + review berkala</strong> ("apakah Budi masih butuh akses ini?") — akses yang tidak pernah dicabut = utang keamanan.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> akses = <strong>kontrak sementara</strong>, bukan hadiah permanen. Praktik terbaik: akses berbasis <em>proyek + kedaluwarsa otomatis</em> ("akses tabel X untuk proyek Y, 90 hari"). Setiap akses abadi adalah insiden yang menunggu waktu.</p>
      </div>

      <h2 id="teknik">Lima Teknik Perlindungan: Masking → Enkripsi</h2>
      <p>Spektrum dari "tetap bisa dipakai" hingga "tidak bisa dibalik":</p>
      <ol>
        <li><strong>Masking:</strong> samarkan sebagian — <code className="inline">0812****90</code>. Format terjaga, bisa dipakai CS/analis. <em>Reversibel oleh yang berwenang</em> (data asli tetap ada).</li>
        <li><strong>Tokenisasi:</strong> ganti dengan token acak; peta asli↔token di <strong>vault</strong> terpisah & terkunci. Bocor token tanpa vault = tidak berguna. Standar untuk nomor kartu (PCI-DSS).</li>
        <li><strong>Pseudonymisasi:</strong> ganti dengan pseudonim <em>deterministik</em> (NIK sama → pseudonim sama) via fungsi + kunci rahasia. <strong>Bisa di-join</strong> antar tabel tanpa tahu identitas asli! Kunci dipegang terpisah.</li>
        <li><strong>Anonymisasi:</strong> <strong>irreversibel</strong> — agregat, generalisasi ("umur 34" → "30–40"), hapus identifier. Tidak bisa dibalik <em>bahkan oleh pemilik</em>. Syarat: benar-benar tidak bisa re-identifikasi (lihat mini-case!).</li>
        <li><strong>Enkripsi:</strong> acak dengan kunci — hanya pemilik kunci bisa baca. Untuk data at-rest & in-transit (di bawah).</li>
      </ol>

      <PlotlyChart
        data={teknikData}
        title="Spektrum Teknik: Kegunaan Analitik vs Keamanan (skor ilustratif)"
        layout={{ xaxis: { title: "Teknik" }, yaxis: { title: "Tingkat keamanan (1-10)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = tingkat keamanan; label = sifat reversibilitas.</p>
        <p><strong>Interpretasi:</strong> trade-off jelas: makin aman, makin susah dipakai analisis. <strong>Pseudonymisasi = sweet spot</strong> untuk analitik (bisa join, identitas tersembunyi). <strong>Anonymisasi</strong> paling aman tapi menghancurkan granularitas. Pilih dari pertanyaan: "data ini untuk <em>dipakai siapa</em>?"</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Hapus nama = data sudah anonym."</strong></p>
        <p><strong>Yang benar:</strong> <strong>SALAH dan berbahaya.</strong> Studi klasik: 87% populasi AS bisa diidentifikasi ulang hanya dari <em>kode pos + tanggal lahir + jenis kelamin</em> (quasi-identifier!). Anonymisasi sejati butuh teknik (k-anonymity, generalisasi) + uji re-identifikasi — bukan sekadar hapus kolom nama. (Detail di mini-case.)</p>
      </div>

      <h2 id="enkripsi">Enkripsi — At-Rest, In-Transit, Kunci</h2>
      <ul>
        <li><strong>In-transit (TLS):</strong> data di jaringan terenkripsi — wajib untuk semua koneksi (aplikasi → database, API). Tanpa ini = penyadap baca plaintext.</li>
        <li><strong>At-rest:</strong> data di disk terenkripsi (AES-256) — melindungi dari <em>pencurian fisik/backup</em>. Database & object storage modern: nyalakan default.</li>
        <li><strong>Manajemen kunci:</strong> enkripsi sekuat <strong>kuncinya</strong>. Praktik: kunci di <strong>KMS/HSM</strong> terpisah (bukan di kode! bukan di repo git!), rotasi berkala, kunci berbeda per sensitivitas.</li>
      </ul>
      <p><strong>Catatan jujur:</strong> enkripsi melindungi dari <em>pencurian storage</em>, BUKAN dari <em>user berwenang yang menyalahgunakan akses</em> (cerita pembuka!) — untuk itu butuh kontrol akses + audit. Lapisan pertahanan berbeda untuk ancaman berbeda (<strong>defense in depth</strong>).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> keamanan = <strong>lapisan</strong>, bukan satu tembok: (1) kontrol akses (siapa boleh), (2) teknik perlindungan (apa yang mereka lihat: masking/token), (3) enkripsi (pencuri storage), (4) audit log (siapa melakukan apa — DM10 operasional). Satu lapis jebol ≠ semua jebol.</p>
      </div>

      <h2 id="retensi">Retensi & Hak Hapus — Data Punya Masa Berlaku</h2>
      <p><strong>Retensi:</strong> berapa lama data disimpan, lalu <strong>dihapus otomatis</strong> (jembatan DM1/DM9). Bukan sekadar hemat storage — menyimpan data pribadi lebih lama dari perlu = <strong>melanggar prinsip minimisasi</strong> + memperbesar blast radius kebocoran.</p>
      <p><strong>Hak hapus ("right to erasure"):</strong> subjek data bisa meminta datanya dihapus. <strong>Tantangan teknisnya nyata:</strong> data tersebar di OLTP + warehouse + backup + lake + <em>golden record</em> (DM11!) + backup tape. Tanpa <strong>inventaris & lineage</strong> (DM10), "hapus semua data Budi" = mustahil dibuktikan. Desain untuk dihapus sejak awal: pseudonymisasi + kunci per subjek (hapus kunci = data jadi anonim seketika — "crypto-shredding").</p>

      <h2 id="regulasi">UU PDP & GDPR — Aturan Main yang Wajib Tahu</h2>
      <p><strong>UU PDP Indonesia (UU No. 27 Tahun 2022):</strong> pelindungan data pribadi — hak subjek data (akses, koreksi, hapus, tarik persetujuan), kewajiban pengendali data (keamanan, pemberitahuan kebocoran), dan <strong>sanksi administratif hingga pidana</strong>. Masa transisi penyesuaian telah berjalan — perlakukan sebagai <em>berlaku</em>, bukan "nanti".</p>
      <p><strong>GDPR (EU 2016/679):</strong> standar global terketat — berlaku ekstrateritorial (perusahaan Indonesia yang memproses data warga EU ikut kena!). Prinsip: lawfulness, <strong>minimisasi</strong>, purpose limitation, akurasi, batas penyimpanan, keamanan. Denda: hingga 4% omzet global.</p>
      <p><strong>Dampak ke desain data (konkret):</strong></p>
      <ul>
        <li><strong>Data minimization:</strong> kumpulkan hanya yang perlu — "simpan semua" (DM1) kini berisiko hukum.</li>
        <li><strong>Consent & purpose:</strong> catat <em>untuk apa</em> data boleh dipakai; pakai di luar tujuan = pelanggaran.</li>
        <li><strong>Breach notification:</strong> kebocoran harus dilaporkan — butuh deteksi (DM7 observability!) + jejak akses.</li>
        <li><strong>Privacy by design:</strong> masking/pseudonymisasi <em>sejak arsitektur</em>, bukan tempelan.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Compliance = urusan legal, bukan engineer."</strong></p>
        <p><strong>Yang benar:</strong> legal menulis <em>kewajiban</em>; engineer membangun <em>kemampuannya</em> (retensi otomatis, hak hapus yang tereksekusi, audit log). Regulator tidak menghukum PDF kebijakan — mereka menguji <strong>sistemnya</strong>. "Tolong hapus data saya" yang tidak bisa dieksekusi = pelanggaran, bukan masalah legal.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Masking, Tokenisasi, Pseudonymisasi</h2>
      <p>Implementasikan tiga teknik dan rasakan bedanya: apa yang bisa di-join, apa yang bisa dibalik.</p>
      <PyodideLab
        title="Lab 1 — Tiga Teknik, Tiga Sifat"
        hint="Coba: pseudonimkan NIK yang sama 2x — konsisten? Itulah kenapa pseudonymisasi bisa untuk join."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: RBAC vs ABAC dalam Kode</h2>
      <p>Simulasikan aturan akses gaji — lihat di mana RBAC bocor dan ABAC menyelamatkan.</p>
      <PyodideLab
        title="Lab 2 — Satpam Sederhana vs Satpam Cerdas"
        hint="Coba: tambah aturan 'staff boleh lihat gaji sendiri'. Mana yang lebih mudah diungkapkan — RBAC atau ABAC?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Lindungi Data Bagaimana</h2>

      <div className="decision-card">
        <h3>1. Analis butuh data tapi tak boleh lihat identitas → <strong>pseudonymisasi / masking</strong></h3>
        <p><strong>Kondisi:</strong> analisis butuh join & pola, bukan identitas.</p>
        <p><strong>Kenapa:</strong> sweet spot — analitik jalan, privasi terjaga. Kunci dipegang terpisah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Nomor kartu / data sangat sensitif → <strong>tokenisasi + vault</strong></h3>
        <p><strong>Kondisi:</strong> hanya segelintir proses butuh nilai asli.</p>
        <p><strong>Kenapa:</strong> bocor token tanpa vault = tidak berguna. Standar industri pembayaran.</p>
      </div>

      <div className="decision-card">
        <h3>3. Publikasi / sharing ke pihak ketiga → <strong>anonymisasi sejati (uji re-identifikasi!)</strong></h3>
        <p><strong>Kondisi:</strong> data keluar dari kontrolmu.</p>
        <p><strong>Kenapa:</strong> hapus nama SAJA tidak cukup (quasi-identifier!). Agregat/generalisasi + uji.</p>
      </div>

      <div className="decision-card">
        <h3>4. Aturan akses sederhana (peran jelas) → <strong>RBAC + least privilege + review berkala</strong></h3>
        <p><strong>Kondisi:</strong> 80% kasus.</p>
        <p><strong>Kenapa:</strong> sederhana & teraudit. Akses berkedaluwarsa, bukan abadi.</p>
      </div>

      <div className="decision-card">
        <h3>5. Aturan "kecuali" menumpuk → <strong>naik ke ABAC</strong></h3>
        <p><strong>Kondisi:</strong> ledakan peran di RBAC.</p>
        <p><strong>Kenapa:</strong> atribut memberi presisi. Harga: kompleksitas kebijakan — dokumentasikan baik-baik.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Least privilege:</strong> akses minimum + kedaluwarsa. Review berkala.</li>
          <li><strong>Pilih teknik dari pemakai:</strong> analis → pseudonim; publik → anonym sejati.</li>
          <li><strong>Enkripsi default:</strong> at-rest + in-transit; kunci di KMS, bukan di kode.</li>
          <li><strong>Desain untuk dihapus:</strong> retensi otomatis + jejak lengkap (UU PDP).</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: 270 Juta Baris — Anatomi Kebocoran &amp; Harganya</h2>
      <p>Insiden fiktif berbasis pola nyata: database 270 juta baris data nasabah (nama, NIK, alamat, no HP) muncul di forum gelap. Harga data: Rp150/baris. Ikuti perhitungannya — dari denda sampai keputusan teknik.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Denda UU PDP: hitung eksposurnya (klik untuk buka)</summary>
        <p>UU PDP: denda administratif hingga <strong>2% dari pendapatan tahunan</strong>. Pendapatan perusahaan: Rp4 triliun.</p>
        <p><Tex math={String.raw`\text{denda maks} = 2\% \times 4 \times 10^{12} = \text{Rp}80 \text{ miliar}`} block /></p>
        <p>Ditambah: ganti rugi perdata (270 juta × Rp1.000 ganti rugi minimal = <strong>Rp270 miliar</strong> potensi tuntutan class action!), biaya forensik &amp; notifikasi (Rp3–5 miliar), dan kehilangan kepercayaan (churn +2% dari 10 juta nasabah × ARPU Rp500.000 = <strong>Rp100 miliar/tahun</strong> pendapatan hilang).</p>
        <p><Tex math={String.raw`\text{total eksposur} \approx 80 + 270 + 5 + 100 = \text{Rp}455 \text{ miliar}`} block /></p>
        <p>Angka ini = <strong>peluru anggaran keamanan</strong>. Setiap rupiah keamanan dibandingkan dengan Rp455 miliar, bukan dengan "budget IT tahun lalu".</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Akar masalah: akses yang terlalu luas</summary>
        <p>Forensik: 1.400 akun punya akses <em>read</em> ke tabel nasabah penuh (termasuk 900 akun vendor &amp; magang!). Prinsip <strong>least privilege</strong> dilanggar 1.400×.</p>
        <p>Model risiko sederhana: peluang 1 akun disusupi per tahun = 0,5% (phishing).</p>
        <p><Tex math={String.raw`P(\text{minimal 1 bobol}) = 1 - (1-0{,}005)^{1400} \approx 1 - e^{-7} \approx 99{,}9\%`} block /></p>
        <p><strong>99,9%</strong> — kebocoran praktis <em>dijamin</em> secara statistik. Dengan RBAC ketat (hanya 40 akun butuh data penuh, sisanya masking): <Tex math={String.raw`1-(1-0{,}005)^{40} \approx 18\%`} />. Masih ada risiko — tapi dari "pasti" menjadi "mungkin". <strong>Keamanan = mengecilkan permukaan serangan sampai matematikanya berpihak padamu.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Masking vs enkripsi vs tokenisasi: pilih dengan angka</summary>
        <p>Tabel 270 juta baris, kolom NIK (16 digit). Tiga opsi:</p>
        <ul>
          <li><strong>Masking dinamis</strong> (<code className="inline">************1234</code> untuk analis): overhead query ~2%, <strong>data asli tetap di disk</strong> (tidak melindungi dari dump database!). Cocok: cegah analis iseng, bukan cegah breach.</li>
          <li><strong>Tokenisasi</strong> (NIK → token acak, peta di vault terpisah): overhead ~5–10%, <strong>dump database tanpa vault = tidak berguna</strong> (token tidak bisa dibalik). Vault 270 juta entri ≈ 15 GB — kecil. Cocok: data yang dipakai operasional tapi tidak boleh bocor.</li>
          <li><strong>Enkripsi kolom</strong> (AES-256): overhead ~10–20% + manajemen kunci (HSM Rp200–500 juta/tahun). Melindungi at-rest; <strong>tidak melindungi dari query sah yang disalahgunakan</strong> (data didekripsi saat dibaca!).</li>
        </ul>
        <p>Kesimpulan: <strong>tidak ada 1 teknik untuk semua ancaman</strong>. Dump database → tokenisasi/enkripsi. Analis iseng → masking + audit log. Akun disusupi → RBAC/ABAC + MFA. Pertahanan = <strong>lapis</strong> (defense in depth), dipilih per vektor serangan.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Retensi: data yang tidak ada tidak bisa bocor</summary>
        <p>Dari 270 juta baris, <strong>90 juta</strong> adalah nasabah tidak aktif &gt;5 tahun (tidak ada kewajiban hukum menyimpan). Biaya simpan: kecil. Risiko simpan:</p>
        <p><Tex math={String.raw`\text{pengurangan risiko} = \frac{90}{270} = 33\%`} /></p>
        <p>Hapus 90 juta baris sesuai kebijakan retensi = <strong>potensi denda turun 33%</strong> (lebih sedikit data = lebih kecil dampak) + biaya nol (DELETE murah!). <strong>Retensi = kontrol keamanan termurah</strong>: satu kebijakan + job terjadwal, tanpa beli tool. Data yang tidak ada = tidak bisa bocor, tidak bisa disalahgunakan, tidak perlu dienkripsi.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> urutan membangun keamanan data: (1) <strong>tahu apa yang dimiliki</strong> (klasifikasi: mana PII? — tanpa ini, melindungi = menembak dalam gelap), (2) <strong>kecilkan akses</strong> (RBAC/ABAC, least privilege), (3) <strong>samarkan yang tidak perlu jelas</strong> (masking/tokenisasi), (4) <strong>enkripsi sisanya</strong>, (5) <strong>hapus yang tidak perlu</strong> (retensi). Tim yang mulai dari (4) tanpa (1) = mengenkripsi dengan rajin data yang seharusnya dihapus.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Vault tokenisasi: berapa besar "brankas"-nya?</summary>
        <p>270 juta NIK ditokenisasi. Tiap entri vault: token (16 byte) + NIK terenkripsi (32 byte) + metadata (8 byte) = 56 byte.</p>
        <p><Tex math={String.raw`270 \times 10^6 \times 56 \text{ B} \approx 15 \text{ GB}`} block /></p>
        <p><strong>15 GB</strong> — muat di 1 disk laptop — untuk membuat dump 270 juta baris <em>tidak berguna</em> bagi pencuri. <strong>Keamanan terbaik = membuat hasil curian tidak laku.</strong> Tokenisasi: murah disimpan, mahal ditembus (butuh vault + kunci + akses — 3 lapis, bukan 1).</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Privasi = Kontrol, Bukan Kerahasiaan</h2>
      <p>Pergeseran paradigma UU PDP/GDPR: privasi bukan "data disembunyikan", tapi <strong>"individu mengontrol nasib datanya"</strong>. Tiga konsekuensi yang mengubah arsitektur:</p>
      <ul>
        <li><strong>Hak hapus (right to erasure) = delete yang <em>benar-benar</em> delete.</strong> "Hapus" di 1 tabel tidak cukup: backup (retensi 30 hari?), replica, lake Bronze (DM4!), log Kafka, cache Redis. Perusahaan dewasa membangun <strong>"tombstone propagation"</strong>: 1 permintaan hapus → antrean → semua sistem konfirmasi. Tanpa ini, "sudah dihapus" = bohong yang bisa dibuktikan forensik.</li>
        <li><strong>Anonimisasi ≠ hapus nama.</strong> Mini-case "anonym yang ternyata tidak": 3 atribut quasi-identifier (kode pos + tgl lahir + jenis kelamin) mengidentifikasi <strong>87% populasi</strong> (penelitian Latanya). Aturan: <strong>k-anonymity</strong> (tiap kombinasi muncul ≥k kali) atau teknik formal (differential privacy). "Hapus kolom nama" = teater privasi.</li>
        <li><strong>Consent = metadata.</strong> "Nasabah X setuju untuk marketing?" = 1 bit yang harus <em>mengalir bersama data</em> ke semua sistem (lineage, DM10). Tanpa consent propagation, tim marketing memakai data yang izinnya sudah dicabut = pelanggaran per penggunaan. Izin bukan dokumen — ia <strong>atribut data</strong>.</li>
      </ul>
      <p><strong>Konteks dunia nyata — RBAC vs ABAC:</strong> RBAC ("role analis boleh baca tabel penjualan") sederhana tapi kaku: 200 role = chaos. ABAC ("boleh baca <em>jika</em> departemen sama <em>dan</em> klasifikasi ≤ internal <em>dan</em> jam kerja") fleksibel tapi kompleks. Pola dewasa: <strong>RBAC untuk 80% kasus standar + ABAC untuk 20% sensitif</strong> (data nasabah, gaji). Dan keduanya butuh <strong>review akses berkala</strong> (tiap 90 hari): akses yang tidak direview = akses yang menumpuk = 1.400 akun di Langkah 2.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data sudah dienkripsi, jadi aman dari kebocoran."</strong></p>
        <p><strong>Yang benar:</strong> enkripsi melindungi <strong>at-rest</strong> (disk dicuri) dan <strong>in-transit</strong> (disadap). Ia <strong>TIDAK</strong> melindungi dari: query sah yang disalahgunakan (data didekripsi untuk dibaca!), akun dengan akses berlebih, atau backup yang kuncinya ikut bocor. 80% kebocoran = <em>akses</em>, bukan <em>kriptografi</em>. Enkripsi tanpa kontrol akses = brankas baja yang kuncinya digantung di pintu.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Uji k-Anonymity — "Anonym"-mu Benar-benar Anonym?</h2>
      <p>Buktikan klaim mini-case: hitung berapa orang yang bisa diidentifikasi ulang dari 3 kolom "non-identitas".</p>
      <PyodideLab
        title="Lab 3 — Serangan Re-identifikasi"
        hint="Coba: naikkan N ke 10000. Apakah % unik turun? Itulah k-anonymity bekerja — tapi cek juga: informasi apa yang hilang saat generalisasi?"
        defaultCode={`# Lab 3: re-identifikasi dari quasi-identifier (kodepos, tgl_lahir, gender)
import random
random.seed(99)
N = 2000

data = []
for i in range(N):
    kodepos = f"10{random.randint(100, 199)}"          # 100 kodepos
    tgl = f"{random.randint(1,28):02d}-{random.randint(1,12):02d}-19{random.randint(60,99)}"
    gender = random.choice(["L", "P"])
    data.append((kodepos, tgl, gender))

from collections import Counter
c = Counter(data)
unik = sum(1 for v in c.values() if v == 1)   # kombinasi hanya 1 orang = teridentifikasi!
k_min = min(c.values())

print(f"Total {N} orang, {len(c)} kombinasi unik")
print(f"Teridentifikasi ulang (unik): {unik} orang ({unik/N*100:.1f}%)")
print(f"k-anonymity saat ini: k={k_min} (target umum: k>=5)")
print()
# Mitigasi: generalisasi kodepos -> 3 digit, tahun lahir saja
c2 = Counter((k[:3], k[1].split('-')[2], k[2]) for k in [d for d in data])
# (kodepos dipotong) -> hitung ulang dengan cepat:
data2 = [(d[0][:3], d[1][-4:], d[2]) for d in data]
c2 = Counter(data2)
unik2 = sum(1 for v in c2.values() if v == 1)
print(f"Setelah generalisasi: teridentifikasi {unik2} ({unik2/N*100:.1f}%), k={min(c2.values())}")
print("Harga privasi: analis kehilangan detail kodepos & tanggal lahir.")`}
      />

      <h2 id="case">📋 Mini-Case: "Anonym" yang Ternyata Tidak</h2>
      <div className="callout">
        <p>Rumah sakit mempublikasikan "data anonym" penelitian: nama & NIK dihapus, tersisa <strong>kode pos + tanggal lahir + jenis kelamin + diagnosa</strong>. Peneliti menggabungkan dengan data voter publik — <strong>berhasil identifikasi ulang 60% pasien</strong>, termasuk diagnosa sensitif. Skandal nasional.</p>
        <p><strong>Pertanyaan:</strong> (a) Kesalahan konseptualnya? (b) Teknik anonymisasi yang benar? (c) Pelajaran untuk data engineer?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Quasi-identifier diabaikan</strong>: kode pos + tgl lahir + gender = sidik jari unik untuk mayoritas orang. "Hapus nama" ≠ anonym.</p>
          <p>(b) <strong>Generalisasi + k-anonymity</strong>: kode pos → 3 digit, tgl lahir → tahun, pastikan tiap kombinasi ≥k orang. Lalu <strong>uji re-identifikasi</strong> sebelum rilis.</p>
          <p>(c) <strong>Anonymisasi = klaim yang harus dibuktikan</strong>, bukan niat baik. Jika tidak bisa buktikan tidak teridentifikasi-ulang, perlakukan sebagai <strong>pseudonym</strong> (masih data pribadi!) — bukan anonym.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: denda UU PDP, permukaan serangan, dan k-anonymity.</p>

      <details className="worked">
        <summary>Soal 1 — Denda: UU PDP denda hingga 2% pendapatan tahunan. Pendapatan Rp2 triliun. Berapa denda maksimal?</summary>
        <p><Tex math={String.raw`0{,}02 \times 2 \times 10^{12} = \text{Rp}40 \text{ miliar}`} block /></p>
        <p>Belum termasuk ganti rugi perdata &amp; churn. <strong>Angka ini = peluru anggaran keamanan.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Permukaan serangan: 800 akun punya akses penuh, peluang 1 akun disusupi 0,3%/tahun. Berapa P(minimal 1 bobol)? Bandingkan jika hanya 30 akun.</summary>
        <p>800 akun: <Tex math={String.raw`1-(1-0{,}003)^{800} \approx 1-e^{-2{,}4} \approx 90{,}9\%`} />.</p>
        <p>30 akun: <Tex math={String.raw`1-(1-0{,}003)^{30} \approx 8{,}6\%`} block /></p>
        <p><strong>90,9% → 8,6%</strong> hanya dengan mengecilkan akses. Keamanan = mengecilkan permukaan sampai matematikanya berpihak padamu.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — k-anonymity: 5.000 orang, 120 kombinasi quasi-identifier hanya muncul 1×. Berapa % teridentifikasi ulang? Berapa k saat ini?</summary>
        <p>Teridentifikasi = <Tex math={String.raw`120/5000 = 2{,}4\%`} />; <Tex math={String.raw`k = 1`} /> (target umum <Tex math={String.raw`k \geq 5`} />).</p>
        <p><strong>Gagal.</strong> Butuh generalisasi (potong kode pos, tahun saja) sampai tiap kombinasi ≥5 orang — dengan harga: analis kehilangan detail.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Manajer Marketing bisa lihat gaji tim Engineering karena aturan 'manager boleh lihat gaji'. Ini kegagalan…"
        options={[
          "Enkripsi",
          "RBAC yang terlalu kasar — butuh ABAC ('manajer hanya timnya sendiri') atau peran lebih granular; + prinsip least privilege",
          "Masking",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: RBAC sederhana bocor saat butuh pengecualian. ABAC/mikro-peran menutupnya. Akses berlebihan = pintu tak terkunci (cerita pembuka)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Butuh join tabel tanpa tahu identitas asli. Teknik tepat?"
        options={[
          "Masking acak tiap baris",
          "Pseudonymisasi deterministik — nilai sama → pseudonim sama (bisa join), tak bisa dibalik tanpa kunci",
          "Hapus semua kolom",
          "Enkripsi tanpa kunci",
        ]}
        correct={1}
        explanation="Benar: pseudonymisasi = sweet spot analitik. Masking acak merusak join; hapus kolom merusak analisis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 'Hapus kolom nama = data anonym.' Tanggapanmu?"
        options={[
          "Setuju, sudah cukup",
          "SALAH — quasi-identifier (kode pos + tgl lahir + gender) bisa identifikasi ulang 87% orang. Butuh generalisasi + k-anonymity + uji",
          "Setuju jika datanya sedikit",
          "Tergantung mood",
        ]}
        correct={1}
        explanation="Benar: ini miskonsepsi paling berbahaya. Anonymisasi = klaim yang dibuktikan, bukan niat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Enkripsi at-rest melindungi dari…"
        options={[
          "User berwenang yang menyalahgunakan akses",
          "Pencurian fisik media/backup — BUKAN dari penyalahgunaan akses resmi (itu tugas kontrol akses + audit)",
          "Semua ancaman",
          "Query lambat",
        ]}
        correct={1}
        explanation="Benar: tiap lapisan untuk ancaman berbeda (defense in depth). Enkripsi ≠ pengganti kontrol akses."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Di bawah UU PDP, saat subjek data meminta penghapusan, tantangan teknis terbesar?"
        options={[
          "Menghapus 1 baris di 1 tabel",
          "Data tersebar di OLTP + warehouse + backup + lake — butuh inventaris & lineage untuk hapus & buktikan tuntas",
          "Tidak ada tantangan",
          "Cukup janji lisan",
        ]}
        correct={1}
        explanation="Benar: 'hapus' harus tereksekusi & terbukti di semua salinan. Desain untuk dihapus sejak awal (crypto-shredding, retensi otomatis)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Prinsip 'privacy by design' berarti…"
        options={[
          "Tambah enkripsi setelah bocor",
          "Masking/pseudonymisasi/minimisasi dirancang SEJAK arsitektur — bukan tempelan setelah jadi",
          "Hanya urusan legal",
          "Tidak kumpulkan data sama sekali",
        ]}
        correct={1}
        explanation="Benar: privasi = keputusan arsitektur hari pertama. Tempelan belakangan = mahal & bocor."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Akses:</strong> RBAC (sederhana) → ABAC (presisi); least privilege + kedaluwarsa + review.</li>
          <li><strong>Teknik:</strong> masking (samarkan) → tokenisasi (vault) → pseudonymisasi (bisa join) → anonymisasi (irreversibel, harus dibuktikan) → enkripsi (kunci di KMS).</li>
          <li><strong>Defense in depth:</strong> akses + teknik + enkripsi + audit — lapis berbeda, ancaman berbeda.</li>
          <li><strong>UU PDP/GDPR:</strong> minimisasi, hak hapus, breach notification — engineer membangun kemampuannya.</li>
          <li><strong>Jangan:</strong> samakan "hapus nama" dengan anonym; akses abadi; privasi sebagai tempelan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm11-master-data" className="btn btn-secondary btn-sm">← DM11</Link>
        <Link href="/learn/dm13-data-risiko-regulasi" className="btn btn-primary btn-sm">Next: DM13 →</Link>
      </div>
    </div>
  );
}
