"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM7Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const dimensiData = [
    {
      x: ["Akurasi", "Kelengkapan", "Konsistensi", "Ketepatan waktu", "Validitas", "Keunikan"],
      y: [96.2, 88.5, 99.1, 93.0, 97.8, 99.9],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["96,2%", "88,5%", "99,1%", "93,0%", "97,8%", "99,9%"],
      textposition: "outside",
    },
  ];

  const costData = [
    {
      x: ["Cegah di sumber", "Perbaiki di pipeline", "Perbaiki setelah dipakai"],
      y: [1, 10, 100],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["1x", "10x", "100x"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Profiling — "CT scan" data sebelum dipercaya
# Dataset: 12 aplikasi kredit (sengaja dikotori 5 masalah. Temukan semuanya!)

data = [
    {"id": "A01", "nama": "Budi",  "umur": 34,  "gaji": 8000000,  "email": "budi@mail.com"},
    {"id": "A02", "nama": "Ani",   "umur": 29,  "gaji": 6500000,  "email": "ani@mail.com"},
    {"id": "A03", "nama": "Cici",  "umur": 250, "gaji": 7000000,  "email": "cici@mail.com"},   # ?
    {"id": "A04", "nama": "Dodi",  "umur": 41,  "gaji": -500000, "email": "dodi@mail.com"},   # ?
    {"id": "A05", "nama": "Eka",   "umur": 35,  "gaji": 9000000,  "email": "budi@mail.com"},   # ?
    {"id": "A06", "nama": "Fajar", "umur": 28,  "gaji": None,     "email": "fajar@mail.com"},  # ?
    {"id": "A02", "nama": "Ani",   "umur": 29,  "gaji": 6500000,  "email": "ani@mail.com"},   # ?
    {"id": "A08", "nama": "Gita",  "umur": 31,  "gaji": 7500000,  "email": "gita AT mail.com"},
    {"id": "A09", "nama": "Hadi",  "umur": 45,  "gaji": 12000000, "email": "hadi@mail.com"},
    {"id": "A10", "nama": "Ira",   "umur": 26,  "gaji": 5500000,  "email": "ira@mail.com"},
    {"id": "A11", "nama": "Joko",  "umur": 38,  "gaji": 8200000,  "email": "joko@mail.com"},
    {"id": "A12", "nama": "Kiki",  "umur": 33,  "gaji": 6800000,  "email": "kiki@mail.com"},
]

def profil(data):
    ids = [d["id"] for d in data]
    umur = [d["umur"] for d in data if isinstance(d["umur"], int)]
    gaji = [d["gaji"] for d in data if isinstance(d["gaji"], int)]
    print(f"Jumlah baris      : {len(data)}")
    print(f"ID unik           : {len(set(ids))} (duplikat: {len(ids)-len(set(ids))})")
    print(f"Umur  : min={min(umur)}, max={max(umur)}")
    print(f"Gaji  : min={min(gaji):,}, missing={sum(1 for d in data if d['gaji'] is None)}")
    print(f"Gaji negatif      : {sum(1 for g in gaji if g < 0)}")
    print(f"Email tanpa '@'   : {sum(1 for d in data if '@' not in d['email'])}")

profil(data)
print()
print("5 masalah di atas = 5 DIMENSI kualitas berbeda. Petakan tiap baris aneh")
print("ke dimensinya: akurasi? validitas? keunikan? kelengkapan?")`;

  const lab2Code = `# Lab 2: Rule test ala dbt — tulis "kontrak kualitas" sebagai kode
# Setiap rule = fungsi yang me-return (lolos, pesan). Pipeline GAGAL jika ada rule merah.

def test_unik(data, kolom):
    vals = [d[kolom] for d in data]
    return (len(vals) == len(set(vals)), f"unik({kolom})")

def test_tidak_kosong(data, kolom):
    ok = all(d.get(kolom) not in (None, "") for d in data)
    return (ok, f"not_null({kolom})")

def test_rentang(data, kolom, lo, hi):
    buruk = [d[kolom] for d in data if isinstance(d.get(kolom), (int, float)) and not (lo <= d[kolom] <= hi)]
    return (not buruk, f"rentang({kolom} {lo}..{hi}) contoh_buruk={buruk[:3]}")

def test_referensi(data, kolom, himpunan_valid):
    buruk = {d[kolom] for d in data if d.get(kolom) not in himpunan_valid}
    return (not buruk, f"referensi({kolom}) invalid={buruk}")

# Data "nasabah" yang akan di-test (sengaja ada 3 pelanggaran)
nasabah = [
    {"id": "N1", "umur": 30, "kota": "JKT"},
    {"id": "N2", "umur": 17, "kota": "SBY"},   # umur di bawah 18?
    {"id": "N2", "umur": 40, "kota": "MDN"},   # id ganda?
    {"id": "N4", "umur": 50, "kota": "XXX"},   # kota tak dikenal?
]
kota_valid = {"JKT", "SBY", "BDG", "MDN"}

rules = [
    test_unik(nasabah, "id"),
    test_tidak_kosong(nasabah, "id"),
    test_rentang(nasabah, "umur", 18, 100),
    test_referensi(nasabah, "kota", kota_valid),
]

gagal = 0
for ok, nama in rules:
    print(("PASS " if ok else "FAIL ") + nama)
    gagal += not ok
print()
print(f"Hasil: {len(rules)-gagal}/{len(rules)} lolos.")
print("Keputusan pipeline:", "LANJUT ke Gold." if gagal == 0 else "BERHENTI + ALERT! Data jangan naik kelas.")
print()
print("Coba: perbaiki data (umur 17->25, id ganda, kota XXX->BDG), jalankan ulang.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM7 — Data Management</span>
        <h1 className="display-title">Kualitas Data:<br />Garbage In, Keputusan Ngaco Out</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp14 Miliar Melayang karena Satu Kolom</a></li>
          <li><a href="#dimensi">6 Dimensi Kualitas — Kacamata Inspeksi</a></li>
          <li><a href="#profiling">Profiling — CT Scan Sebelum Percaya</a></li>
          <li><a href="#rule">Rule & Test — Kontrak yang Dieksekusi Mesin</a></li>
          <li><a href="#observability">Observability — CCTV untuk Pipeline</a></li>
          <li><a href="#lab1">🔬 Lab 1: Profiling — Temukan 5 Masalah Tersembunyi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Rule Test ala dbt</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Masalah Kualitas Apa, Obatnya Apa</a></li>
          <li><a href="#worked">🔢 Worked Example: Audit 1 Juta Baris</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Kualitas = Kontrak, Bukan Sifat</a></li>
          <li><a href="#lab3">🔬 Lab 3: Indeks Kualitas Tertimbang</a></li>
          <li><a href="#case">📋 Mini-Case: Skor Kredit dari Data Hantu</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan dan mengukur 6 dimensi kualitas data (akurasi, kelengkapan, konsistensi, ketepatan waktu, validitas, keunikan).</li>
          <li>Melakukan profiling dataset dan memetakan temuan ke dimensi yang tepat.</li>
          <li>Menulis rule test (unik, not null, rentang, referensi) yang menghentikan pipeline saat data gagal.</li>
          <li>Menjelaskan perbedaan test vs observability dan merancang monitoring kualitas berjalan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp14 Miliar Melayang karena Satu Kolom</h2>
      <div className="story">
        <p>Sebuah bank menyalurkan KUR Rp14 miliar ke 200 debitur — yang ternyata <strong>sudah meninggal</strong>. Bukan fraud, bukan korupsi. Kolom <code className="inline">status_hidup</code> di tabel nasabah tidak pernah di-update dari Dukcapil selama 3 tahun; nilainya basi. Model scoring membaca "hidup", analis membaca "layak", uang cair ke ahli waris fiktif.</p>
        <p>Twist-nya: tidak ada yang <em>salah hitung</em>. Semua query benar, semua dashboard akurat — <strong>akurat menggambarkan data yang salah</strong>. Inilah sifat kualitas data yang paling menakutkan: ia tidak membuat sistem error; ia membuat sistem <em>yakin pada kebohongan</em>. Lesson ini tentang cara tidak menjadi korban berikutnya: mengukur, mengetes, dan memantau kualitas seperti nyawa perusahaan — karena memang begitu.</p>
      </div>

      <h2 id="dimensi">6 Dimensi Kualitas — Kacamata Inspeksi</h2>
      <p>"Kualitas data" terlalu kabur tanpa dimensi. Enam lensa standar industri:</p>
      <ul>
        <li><strong>Akurasi:</strong> apakah nilainya <em>benar di dunia nyata</em>? (Umur 250 = tidak akurat.) Diukur: <Tex math={String.raw`\frac{\text{record benar}}{\text{total record}} \times 100\%`} />. Paling mahal diukur — butuh sumber kebenaran pembanding.</li>
        <li><strong>Kelengkapan (completeness):</strong> apakah yang seharusnya ada, ada? (Gaji kosong 12%.) Rumus sama, pembilang = record terisi.</li>
        <li><strong>Konsistensi:</strong> apakah tidak saling bertentangan? (Total di tabel A ≠ total di tabel B; "Jakarta" vs "JKT".)</li>
        <li><strong>Ketepatan waktu (timeliness):</strong> apakah cukup segar untuk keputusan? (Data kemarin untuk fraud = basi.)</li>
        <li><strong>Validitas:</strong> apakah formatnya benar? (Email tanpa "@", tanggal "32/13/2026".) Dicek dengan rule.</li>
        <li><strong>Keunikan:</strong> apakah tidak ganda? (Nasabah sama 3 baris = risiko hitung ganda.)</li>
      </ul>
      <p><strong>Kepribadian tiap dimensi:</strong> akurasi = <em>detektif</em> (butuh bukti eksternal), kelengkapan = <em>akuntan</em> (hitung yang hilang), konsistensi = <em>hakim</em> (damaikan yang bertentangan), timeliness = <em>kurir</em> (telat = gagal), validitas = <em>penjaga gerbang</em> (format salah = tolak), keunikan = <em>satpam</em> (satu orang satu kartu).</p>

      <PlotlyChart
        data={dimensiData}
        title="Skor 6 Dimensi — Tabel Nasabah (contoh)"
        layout={{ xaxis: { title: "Dimensi" }, yaxis: { title: "Skor %", range: [80, 100] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = skor tiap dimensi (0–100%); sumbu dipotong di 80 agar perbedaan terlihat.</p>
        <p><strong>Interpretasi:</strong> skor terendah = <strong>kelengkapan (88,5%)</strong> — prioritas perbaikan pertama. <strong>Pelajaran:</strong> jangan kejar "100% semua" (mahal); ukur per dimensi, perbaiki yang terendah <em>yang berdampak bisnis</em>. Kualitas = keputusan alokasi, bukan kesempurnaan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> tiap dimensi punya <strong>pemilik perbaikan berbeda</strong>: validitas/keunikan → engineer (rule di pipeline); akurasi/kelengkapan → sumber/operasional (perbaiki proses input); timeliness → arsitektur (batch→streaming, DM6). Salah menugaskan = masalah tidak pernah sembuh.</p>
      </div>

      <h2 id="profiling">Profiling — CT Scan Sebelum Percaya</h2>
      <p><strong>Definisi.</strong> Profiling = statistik deskriptif otomatis atas dataset: jumlah baris, % null per kolom, min/max/mean, distinct count, pola format, distribusi. Tools: <strong>dbt</strong> (test), <strong>Great Expectations</strong> (suite ekspektasi), <strong>Soda</strong>.</p>
      <p><strong>Kapan:</strong> <em>sebelum</em> memakai dataset baru (due diligence data!), dan berkala untuk dataset kritis. Analis yang langsung query tanpa profiling = dokter yang langsung operasi tanpa CT scan.</p>
      <p><strong>Yang dicari:</strong> null abnormal, duplikat key, nilai mustahil (umur 250), distribusi berubah mendadak (kemarin 0% null, hari ini 40% — <em>drift</em>!), format tak terduga.</p>

      <PlotlyChart
        data={costData}
        title="Biaya Perbaikan Masalah Kualitas per Tahap (aturan 1-10-100)"
        layout={{ xaxis: { title: "Tahap ditemukan" }, yaxis: { title: "Biaya relatif (skala log)", type: "log" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang (skala log) = biaya memperbaiki <em>satu</em> masalah kualitas menurut tahap ia ditemukan.</p>
        <p><strong>Interpretasi:</strong> aturan 1-10-100: cegah di sumber (validasi form input) = 1×; perbaiki di pipeline = 10×; perbaiki setelah keputusan bisnis diambil dari data salah = 100× (ingat Rp14 miliar di cerita). <strong>Investasi kualitas paling murah ada di hulu.</strong></p>
      </div>

      <h2 id="rule">Rule & Test — Kontrak yang Dieksekusi Mesin</h2>
      <p><strong>Definisi.</strong> Rule = ekspektasi tertulis yang <strong>dieksekusi otomatis</strong> tiap pipeline jalan: <code className="inline">unique(id)</code>, <code className="inline">not_null(email)</code>, <code className="inline">umur BETWEEN 0 AND 120</code>, <code className="inline">kota IN (daftar_valid)</code>, <code className="inline">total = sum(komponen)</code> (rekonsiliasi!).</p>
      <p><strong>Anatomi rule yang baik:</strong> (1) <strong>nama jelas</strong>, (2) <strong>threshold</strong> (gagal jika &gt;5% null — bukan 0% kaku), (3) <strong>aksi</strong> (warn vs fail — fail = hentikan pipeline, jangan naikkan ke Gold), (4) <strong>pemilik</strong> (siapa di-alert).</p>
      <p><strong>Test di pintu medallion</strong> (DM4): Bronze→Silver (validitas dasar), Silver→Gold (kelengkapan, konsistensi, rekonsiliasi). Data gagal test <strong>tidak naik kelas</strong> — dikarantina + alert, bukan "diperbaiki diam-diam".</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Test kualitas = hapus data kotor otomatis."</strong></p>
        <p><strong>Yang benar:</strong> test yang baik <strong>menghentikan & memberi tahu</strong>, bukan membersihkan diam-diam. Auto-fix menyembunyikan masalah sumber (aturan 1-10-100: masalah harus diperbaiki di hulu!). Pengecualian: pembersihan deterministik & terdokumentasi (standarisasi "JKT"→"Jakarta") — itu transformasi, bukan test.</p>
      </div>

      <h2 id="observability">Observability — CCTV untuk Pipeline</h2>
      <p><strong>Bedanya dengan test:</strong> test = <em>aturan yang kamu tulis</em> ("umur harus 0–120"); observability = <em>mesin yang memperhatikan anomali</em> tanpa kamu tulis aturannya ("volume tabel ini turun 60% dari biasanya!").</p>
      <p><strong>5 pilar observability data</strong> (Monte Carlo dkk.): <strong>freshness</strong> (datanya telat?), <strong>volume</strong> (jumlah baris aneh?), <strong>distribution</strong> (distribusi bergeser?), <strong>schema</strong> (ada kolom baru/hilang?), <strong>lineage</strong> (kalau tabel ini rusak, apa saja yang kena? — DM10).</p>
      <p><strong>Contoh nyata:</strong> jam 3 pagi, volume tabel transaksi turun 70% — bukan karena test gagal (test lolos: format benar!), tapi karena <em>sumber</em> mati sebagian. Hanya observability volume yang menangkap ini. Test = penjaga gerbang; observability = CCTV.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan membangun kualitas: (1) <strong>profiling</strong> sekali (kenal datamu), (2) <strong>rule test</strong> di pintu medallion (otomatis, menghentikan), (3) <strong>observability</strong> berjalan (menangkap yang tak terduga). Banyak tim loncat ke (3) tanpa (1) — seperti pasang CCTV tanpa tahu apa yang normal.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data quality = tugas data engineer saja."</strong></p>
        <p><strong>Yang benar:</strong> engineer membangun <em>mekanismenya</em> (test, monitoring), tapi <strong>definisi "benar"</strong> hanya diketahui bisnis (berapa umur valid? kota apa saja yang diakui?). Kualitas = kontrak bersama: bisnis mendefinisikan, engineer mengeksekusi, steward memantau (DM9). Tanpa definisi bisnis, test hanya menebak.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Profiling — Temukan 5 Masalah Tersembunyi</h2>
      <p>Dataset 12 baris, 5 masalah sengaja ditanam. Profiling menemukan semuanya dalam detik.</p>
      <PyodideLab
        title="Lab 1 — CT Scan Data"
        hint="Coba: tambah baris dengan gaji string 'tujuh juta'. Dimensi apa yang menangkapnya? (Petunjuk: validitas.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Rule Test ala dbt</h2>
      <p>Tulis kontrak kualitas sebagai kode — pipeline hanya lanjut jika semua hijau.</p>
      <PyodideLab
        title="Lab 2 — Kontrak yang Dieksekusi Mesin"
        hint="Coba: perbaiki 3 pelanggaran datanya, jalankan ulang sampai semua PASS. Rasakan 'pintu' medallion."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Masalah Kualitas Apa, Obatnya Apa</h2>

      <div className="decision-card">
        <h3>1. Nilai mustahil / format salah → <strong>rule validitas + tolak di pintu (fail)</strong></h3>
        <p><strong>Kondisi:</strong> umur 250, email tanpa @.</p>
        <p><strong>Kenapa:</strong> deterministik, murah dicek, tidak ada alasan lolos. Akar: perbaiki validasi di sumber (aturan 1-10-100).</p>
      </div>

      <div className="decision-card">
        <h3>2. Duplikat key → <strong>test keunikan + dedup terdokumentasi</strong></h3>
        <p><strong>Kondisi:</strong> ID ganda.</p>
        <p><strong>Kenapa:</strong> duplikat = hitung ganda = semua metrik salah. Tentukan aturan survivorship (baris mana menang) secara eksplisit.</p>
      </div>

      <div className="decision-card">
        <h3>3. Kolom penting banyak kosong → <strong>ukur kelengkapan + kejar ke hulu</strong></h3>
        <p><strong>Kondisi:</strong> gaji 12% null.</p>
        <p><strong>Kenapa:</strong> imputasi (A1.7) hanya obat gejala. Tanya: kenapa kosong? Form tidak wajib? Sumber tidak kirim?</p>
      </div>

      <div className="decision-card">
        <h3>4. Angka antar tabel beda → <strong>rekonsiliasi otomatis (total = sum komponen)</strong></h3>
        <p><strong>Kondisi:</strong> inkonsistensi lintas sistem.</p>
        <p><strong>Kenapa:</strong> untuk risiko & regulasi (DM13), rekonsiliasi bukan opsional — ia bukti angka bisa dipercaya.</p>
      </div>

      <div className="decision-card">
        <h3>5. "Kemarin normal, hari ini aneh" → <strong>observability (volume/distribution/freshness)</strong></h3>
        <p><strong>Kondisi:</strong> anomali tak terduga yang lolos semua rule tertulis.</p>
        <p><strong>Kenapa:</strong> rule hanya menangkap yang kamu duga; CCTV menangkap yang tidak kamu duga.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Profiling dulu</strong> sebelum percaya dataset baru.</li>
          <li><strong>Test di pintu medallion:</strong> gagal = berhenti + alert, bukan auto-fix diam-diam.</li>
          <li><strong>Perbaiki di hulu</strong> (1×) bukan di hilir (100×).</li>
          <li><strong>Definisi "benar" milik bisnis</strong> — engineer mengeksekusi, bukan menebak.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Audit Kualitas Tabel Nasabah 1 Juta Baris</h2>
      <p>Tabel <code className="inline">nasabah</code>: <strong>1.000.000 baris</strong>, 20 kolom. Tim data melakukan audit dimensi per dimensi. Ikuti hitungannya — tiap angka di bawah adalah metrik yang bisa kamu replikasi di Lab 1–2.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Kelengkapan &amp; keunikan: hitung yang hilang dan ganda (klik untuk buka)</summary>
        <p>Kolom <code className="inline">no_hp</code>: 115.000 null. Kolom <code className="inline">nik</code>: 8.000 null + 3.200 duplikat.</p>
        <p><Tex math={String.raw`\text{kelengkapan(no\_hp)} = \frac{1.000.000 - 115.000}{1.000.000} = 88{,}5\%`} block /></p>
        <p><Tex math={String.raw`\text{keunikan(nik)} = \frac{1.000.000 - 3.200}{1.000.000} = 99{,}68\%`} block /></p>
        <p>Dampak bisnis: 115.000 nasabah tak bisa dihubungi → kampanye SMS Rp150/pesan yang <em>rencananya</em> ke 1 juta orang: <Tex math={String.raw`115.000 \times 150 = \text{Rp}17{,}25 \text{ jt}`} /> terbuang per blast jika tidak difilter. 3.200 NIK ganda → risiko <strong>double-counting</strong> di laporan: total nasabah dilaporkan 1.000.000 padahal unik 996.800 (selisih 0,32% — kecil, tapi untuk rasio keuangan yang diawasi regulator (DM13), 0,32% = temuan audit).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Akurasi: sampel 1.000, ekstrapolasi ke 1 juta</summary>
        <p>Akurasi butuh <em>ground truth</em>: tim memverifikasi manual <strong>1.000 sampel</strong> ke Dukcapil; 38 tidak cocok (nama/NIK/tanggal lahir).</p>
        <p><Tex math={String.raw`\hat{p} = \frac{38}{1.000} = 3{,}8\% \text{ tidak akurat}`} /></p>
        <p>Interval kepercayaan 95% untuk proporsi: <Tex math={String.raw`\hat{p} \pm 1{,}96\sqrt{\frac{\hat{p}(1-\hat{p})}{n}} = 3{,}8\% \pm 1{,}18\%`} /></p>
        <p>Estimasi baris tidak akurat di populasi: <Tex math={String.raw`1.000.000 \times (2{,}62\% \text{ s.d. } 4{,}98\%) \approx 26.200 \text{ s.d. } 49.800 \text{ baris}`} block /></p>
        <p>Artinya: <strong>~38.000 nasabah</strong> (titik tengah) datanya salah di dunia nyata — dan tidak ada rule otomatis yang bisa menemukan mereka (formatnya valid!). Inilah kenapa akurasi = dimensi termahal: butuh manusia + sumber pembanding. Keputusan: verifikasi manual hanya untuk <strong>segmen prioritas</strong> (debitur &gt;Rp500 juta, ~40.000 orang) — biaya Rp25.000/verifikasi × 40.000 = <strong>Rp1 miliar</strong>. Mahal, tapi lebih murah dari Rp14 miliar di cerita pembuka.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Konsistensi lintas sistem: rekonsiliasi 3 sumber</summary>
        <p>Total saldo nasabah menurut 3 sistem: core banking Rp8,412 T; data warehouse Rp8,409 T; laporan GL Rp8,415 T.</p>
        <p><Tex math={String.raw`\text{break maks} = \frac{8.415 - 8.409}{8.412} \times 100\% \approx 0{,}071\% = 7{,}1 \text{ bps}`} block /></p>
        <p>Toleransi bank: <strong>5 bps</strong> → <strong>GAGAL</strong> (7,1 &gt; 5). Investigasi: selisih Rp6 miliar berasal dari 1 batch transfer antarbank yang masuk core banking jam 23.58 tapi baru ke warehouse jam 00.07 (beda <em>cutoff</em>!). Solusi bukan "perbaiki angka", tapi <strong>selaraskan definisi cutoff</strong> (DM10: glossary). Pelajaran: 90% break rekonsiliasi = beda definisi/beda waktu, bukan data hilang.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Aturan 1-10-100: memilih di mana berinvestasi</summary>
        <p>Masalah: 12% email invalid di form registrasi (115.000/tahun ≈ 9.600/bulan).</p>
        <ul>
          <li><strong>Cegah di sumber (1×):</strong> validasi regex + konfirmasi OTP di form. Biaya dev: Rp30 juta sekali + Rp500/OTP × 800.000 pendaftar/tahun = <strong>Rp430 juta/tahun</strong>. Email invalid → ~0%.</li>
          <li><strong>Perbaiki di pipeline (10×):</strong> job pembersih + tim 2 orang verifikasi manual susulan: Rp15 juta/bulan gaji × 2 × 12 = <strong>Rp360 juta/tahun</strong> — tapi invalid tetap 4% (tidak semua bisa diperbaiki).</li>
          <li><strong>Setelah dipakai (100×):</strong> kampanye gagal, model scoring bias, denda keluhan: estimasi <strong>Rp2,1 miliar/tahun</strong>.</li>
        </ul>
        <p>Keputusan rasional: <strong>bayar Rp430 juta di hulu</strong>, hemat Rp1,7 miliar. Inilah kenapa lesson ini menaruh 1-10-100 di tengah: <em>kualitas adalah keputusan investasi</em>, dan "nanti saja" adalah pilihan termahal.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> urutan audit yang hemat: <strong>keunikan → validitas → kelengkapan → konsistensi → timeliness → akurasi</strong>, dari termurah ke termahal. Jangan mulai dari akurasi (butuh ground truth!) sebelum yang murah beres. Dan satu metrik jangkar untuk direksi: <strong>"% keputusan yang didukung data terverifikasi"</strong> — kualitas yang tidak nyambung ke keputusan = hobi mahal.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Alert fatigue: 50 alert/hari, hanya 5% actionable</summary>
        <p>Tim memasang test dengan threshold 0% (perfeksionis): 50 alert/hari, 47,5 di antaranya false/noise.</p>
        <p><Tex math={String.raw`\text{waktu buang} = 47{,}5 \times 10 \text{ mnt} = 475 \text{ mnt/hari} \approx 8 \text{ jam}`} block /></p>
        <p><strong>1 FTE penuh</strong> hanya untuk mengabaikan alert! Hasil: semua alert diabaikan — termasuk 2,5 yang penting. Perbaikan: threshold realistis (&gt;5% null, bukan 0%) + severity (page vs email). <strong>Test yang selalu merah = tidak ada test.</strong> Kualitas = sinyal, bukan kebisingan.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Kualitas Itu Kontrak, Bukan Sifat</h2>
      <p>"Data berkualitas" tidak ada tanpa tiga pertanyaan: <strong>untuk keputusan apa? seberapa akurat cukup? siapa yang membayar?</strong> Tabel nasabah 88,5% lengkap = sampah untuk <em>kampanye SMS</em>, tapi cukup untuk <em>analisis demografi agregat</em>. Kualitas = <strong>kecocokan untuk tujuan</strong> (fit for purpose), bukan skor absolut.</p>
      <ul>
        <li><strong>Threshold, bukan kesempurnaan.</strong> Rule "gagal jika null &gt;5%" (bukan 0%) = pengakuan bahwa dunia kotor. Menetapkan 0% = pipeline merah setiap hari = alert fatigue = semua alert diabaikan = sama saja tidak ada test. <strong>Test yang selalu merah = tidak ada test.</strong></li>
        <li><strong>Data quality vs data observability = imun bawaan vs imun adaptif.</strong> Test (aturan tertulis) menangkap <em>patogen yang dikenal</em>; observability (ML atas metadata) menangkap <em>patogen baru</em> (volume anjlok 70% padahal format valid — contoh di section observability). Organisme sehat butuh keduanya; tim yang hanya punya test akan selalu kaget oleh hal yang "tidak terpikirkan".</li>
        <li><strong>Drift = kualitas yang membusuk diam-diam.</strong> Kemarin null 0%, hari ini 40% — bukan karena data kemarin "bagus", tapi karena <em>sumber berubah</em> (deploy aplikasi baru, vendor ganti format). Monitor <strong>distribusi</strong>, bukan cuma rule: pergeseran mean/proporsi adalah gejala awal sebelum rule mana pun pecah.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> di bank, kualitas data bukan departemen — ia <strong>rantai tanggung jawab</strong>: front-office (input benar) → engineer (test di pintu medallion) → steward (pantau tren) → risk (pakai untuk laporan regulator, DM13). Rantai putus di 1 titik = Rp14 miliar di cerita pembuka. Makanya DM9 (governance) menaruh <em>pemilik</em> di tiap rule: tanpa nama di alert, alert = suara angin.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kita beli tool data quality mahal, masalah selesai."</strong></p>
        <p><strong>Yang benar:</strong> tool (Great Expectations, Soda, Monte Carlo) = <em>mesin</em>; yang menentukan hasil = <em>aturan &amp; pemiliknya</em>. Tool tanpa definisi bisnis ("berapa umur valid?") hanya menebak; tool tanpa pemilik alert hanya mengirim email ke /dev/null. 80% program kualitas gagal bukan karena tool-nya jelek, tapi karena tidak ada yang berani menulis <strong>"data ini tidak boleh naik ke Gold jika..."</strong> dan menandatanganinya. Kualitas = keberanian menulis kontrak, bukan belanja lisensi.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Skor Kualitas Tertimbang — Satu Angka untuk Direksi</h2>
      <p>Gabungkan 6 dimensi menjadi 1 skor dengan bobot bisnis. Inilah yang tampil di dashboard governance.</p>
      <PyodideLab
        title="Lab 3 — Indeks Kualitas Data"
        hint="Coba: ubah BOBOT — mis. untuk kampanye SMS, naikkan bobot kelengkapan no_hp. Keputusan prioritas ikut berubah? Itulah 'fit for purpose'."
        defaultCode={`# Lab 3: indeks kualitas tertimbang (0-100) untuk tabel nasabah
# Skor per dimensi (dari audit Worked Example) + bobot bisnis

dimensi = {
    "akurasi":       96.2,
    "kelengkapan":   88.5,
    "konsistensi":   99.1,
    "ketepatan_wkt": 93.0,
    "validitas":     97.8,
    "keunikan":      99.7,
}
# Bobot: untuk KAMPANYE SMS, kelengkapan no_hp paling menentukan
BOBOT = {
    "akurasi": 0.15, "kelengkapan": 0.30, "konsistensi": 0.15,
    "ketepatan_wkt": 0.10, "validitas": 0.15, "keunikan": 0.15,
}
assert abs(sum(BOBOT.values()) - 1.0) < 1e-9, "bobot harus = 1"

skor = sum(dimensi[d] * BOBOT[d] for d in dimensi)
print("Skor per dimensi:")
for d, s in dimensi.items():
    bar = "#" * int(s // 2)
    print(f"  {d:14s} {s:5.1f} {bar}")
print(f"\\nINDEKS KUALITAS TERTIMBANG: {skor:.1f}/100")

if skor >= 95: status = "SIAP PRODUKSI"
elif skor >= 85: status = "PAKAI DENGAN CATATAN"
else: status = "JANGAN NAIK KE GOLD"
print("Status:", status)
print()
print("Terendah: kelengkapan (88,5) x bobot 0,30 = penarik skor utama.")
print("Aksi: validasi OTP di form (aturan 1-10-100, Rp430 jt/thn).")`}
      />

      <h2 id="case">📋 Mini-Case: Skor Kredit dari Data Hantu</h2>
      <div className="callout">
        <p>Fintech memakai model scoring dengan fitur <code className="inline">rata_rata_saldo_6bln</code>. Suatu hari akurasi model anjlok. Investigasi: job sumber mengubah <code className="inline">NULL</code> (tidak ada data) menjadi <code className="inline">0</code> (saldo nol) "agar rapi". Nasabah tanpa riwayat kini terlihat "punya saldo nol 6 bulan" — sinyal yang <em>berbeda total</em> artinya. Model belajar dari kebohongan.</p>
        <p><strong>Pertanyaan:</strong> (a) Dimensi kualitas apa yang rusak? (b) Rule test apa yang menangkap ini? (c) Kenapa "0" ≠ "NULL" adalah pelajaran fundamental?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Akurasi + validitas makna</strong>: nilai berubah arti (tidak-tahu → nol). Formatnya valid, maknanya salah — jenis bug paling licin.</p>
          <p>(b) <strong>Test distribusi/observability</strong>: "% nilai tepat 0 melonjak 5% → 40%" — rule rentang tidak menangkap (0 valid!), tapi monitor distribusi menangkap pergeseran.</p>
          <p>(c) <strong>NULL = "tidak tahu", 0 = "tahu: nol"</strong>. Mencampur keduanya merusak semua statistik (ingat A1.7 missing data). Aturan: jangan pernah "merapikan" NULL jadi 0 tanpa persetujuan tertulis pemilik data.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: kelengkapan &amp; biaya, estimasi akurasi, dan aturan 1-10-100.</p>

      <details className="worked">
        <summary>Soal 1 — Kelengkapan: tabel 2 juta baris, 9% kolom email kosong. Berapa baris tak bisa dihubungi? Jika tiap blast SMS Rp150 dan ada 4 blast/tahun, berapa terbuang jika tidak difilter?</summary>
        <p>Baris kosong = <Tex math={String.raw`2.000.000 \times 0{,}09 = 180.000`} />.</p>
        <p>Terbuang = <Tex math={String.raw`180.000 \times 150 \times 4 = \text{Rp}108 \text{ jt/tahun}`} block /></p>
        <p>Filter 1 baris SQL menghemat Rp108 juta/tahun. <strong>Kelengkapan = uang.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Akurasi: verifikasi 2.000 sampel, 55 tidak cocok. Estimasi % tidak akurat di 2 juta baris + interval 95%.</summary>
        <p><Tex math={String.raw`\hat{p} = 55/2000 = 2{,}75\%`} /></p>
        <p><Tex math={String.raw`CI = 2{,}75\% \pm 1{,}96\sqrt{\frac{0{,}0275 \times 0{,}9725}{2000}} = 2{,}75\% \pm 0{,}72\%`} block /></p>
        <p>Estimasi: <strong>40.600 – 69.400 baris</strong> tidak akurat. Tanpa ground truth, angka ini <em>tidak bisa</em> dihitung — itulah kenapa akurasi termahal.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — 1-10-100: 50.000 record bermasalah/bulan. Opsi A: cegah di sumber Rp80 jt/tahun. Opsi B: bereskan setelah dipakai Rp1,5 M/tahun. Berapa penghematan A vs B?</summary>
        <p><Tex math={String.raw`\text{hemat} = 1{,}5 \text{ M} - 80 \text{ jt} = \text{Rp}1{,}42 \text{ M/tahun}`} block /></p>
        <p>Dan itu belum termasuk kepercayaan &amp; keputusan salah. <strong>"Nanti saja" adalah strategi termahal.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Umur 250 tahun di tabel nasabah melanggar dimensi…"
        options={[
          "Kelengkapan",
          "Validitas (format/aturan nilai) — dan akurasi (tidak benar di dunia nyata)",
          "Ketepatan waktu",
          "Keunikan",
        ]}
        correct={1}
        explanation="Benar: validitas (aturan 0–120 dilanggar) + akurasi (tidak ada manusia umur 250). Rule rentang menangkap ini otomatis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Menurut aturan 1-10-100, di mana investasi kualitas PALING murah?"
        options={[
          "Setelah dashboard jadi",
          "Di sumber/hulu — validasi input, perbaiki proses (1×)",
          "Di tim audit akhir tahun",
          "Tidak perlu investasi",
        ]}
        correct={1}
        explanation="Benar: cegah di hulu = 1×. Perbaiki di pipeline = 10×. Perbaiki setelah keputusan salah = 100× (cerita Rp14 miliar)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Bedanya test kualitas vs observability data?"
        options={[
          "Sama saja",
          "Test = aturan yang kamu tulis & dieksekusi ('umur 0–120'); observability = mesin mendeteksi anomali tak terduga (volume anjlok 70%)",
          "Observability lebih murah selalu",
          "Test tidak butuh aksi saat gagal",
        ]}
        correct={1}
        explanation="Benar: test = penjaga gerbang (aturan diketahui), observability = CCTV (anomali tak terduga). Butuh keduanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Pipeline menemukan 3% baris gagal validitas. Praktik terbaik?"
        options={[
          "Hapus diam-diam agar pipeline hijau",
          "Karantina + hentikan/alert sesuai threshold; perbaiki di sumber; jangan auto-fix diam-diam",
          "Loloskan saja ke Gold",
          "Ubah rule agar lolos",
        ]}
        correct={1}
        explanation="Benar: gagal = berhenti + tahu + perbaiki hulu. Auto-fix diam-diam menyembunyikan masalah sumber."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. NULL diganti 0 'agar rapi' merusak model scoring. Pelajarannya?"
        options={[
          "0 lebih bagus dari NULL",
          "NULL ('tidak tahu') ≠ 0 ('tahu: nol') — mencampurnya mengubah makna & merusak statistik; butuh persetujuan pemilik data",
          "Model harus dihapus",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: ini bug makna, bukan format. Rule rentang tidak menangkap — hanya monitor distribusi/observability yang bisa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Siapa yang mendefinisikan 'data yang benar' untuk rule test?"
        options={[
          "Data engineer menebak sendiri",
          "Bisnis/pemilik data mendefinisikan; engineer mengeksekusi sebagai kode; steward memantau",
          "Vendor database",
          "Tidak perlu definisi",
        ]}
        correct={1}
        explanation="Benar: kualitas = kontrak bersama. Engineer tanpa definisi bisnis hanya bisa menebak — dan tebakan tidak bisa di-test."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>6 dimensi:</strong> akurasi, kelengkapan, konsistensi, ketepatan waktu, validitas, keunikan — ukur per dimensi, perbaiki yang berdampak.</li>
          <li><strong>Profiling:</strong> CT scan sebelum percaya dataset baru.</li>
          <li><strong>Rule test:</strong> kontrak sebagai kode di pintu medallion; gagal = berhenti + alert.</li>
          <li><strong>Observability:</strong> CCTV untuk anomali tak terduga (freshness, volume, distribution, schema, lineage).</li>
          <li><strong>1-10-100:</strong> perbaiki di hulu, bukan hilir.</li>
          <li><strong>Jangan:</strong> auto-fix diam-diam; campur NULL dan 0; jadikan kualitas tugas satu orang.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm6-batch-streaming" className="btn btn-secondary btn-sm">← DM6</Link>
        <Link href="/learn/dm8-data-contract" className="btn btn-primary btn-sm">Next: DM8 →</Link>
      </div>
    </div>
  );
}
