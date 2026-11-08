import type { V2Lesson } from "../lib/types";

// ── Figure: corong measure — populasi → denominator → numerator ───────────
const FUNNEL_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Diagram corong measure HEDIS: 10 anggota populasi menjadi 6 denominator eligible dan 4 numerator poor control">
<text x="150" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Corong measure: siapa yang dihitung, siapa yang tidak</text>
<text x="140" y="62" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">Populasi awal (10)</text>
<rect x="150" y="42" width="340" height="36" rx="4" fill="var(--c1)"/>
<text x="320" y="65" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">10 anggota</text>
<text x="140" y="122" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">Denominator (6)</text>
<rect x="150" y="102" width="204" height="36" rx="4" fill="var(--c2)"/>
<text x="252" y="125" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">6 eligible</text>
<text x="368" y="112" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">−2: tidak continuous enrollment</text>
<text x="368" y="128" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">−2: eksklusi (hospice)</text>
<text x="140" y="182" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">Numerator (4)</text>
<rect x="150" y="162" width="136" height="36" rx="4" fill="var(--c4)"/>
<text x="218" y="185" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">4 poor control</text>
<text x="300" y="185" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">HbA1c &gt; 9% atau tidak dites</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="242">data sintetis</text>
</g>
<text x="150" y="222" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Skor = 4/6 × 100% = 66,7% (semakin RENDAH semakin baik)</text>
</svg>`;

export const hd31: V2Lesson = {
  slug: "hd31-hedis-cms",
  track: "Health Data Science",
  module: "Mutu Layanan Kesehatan",
  title: "Metrik Mutu HEDIS & CMS Star Ratings",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "85% yang dirayakan, 71% yang benar",
      prose: [
        "Tim mutu sebuah RS merayakan capaian program diabetes: “HbA1c terkontrol 85%!” — angka yang dipajang di laporan tahunan dan slide direksi. Lalu datang auditor eksternal yang menghitung ulang memakai spesifikasi HEDIS — standar pengukuran mutu layanan kesehatan yang dipakai asuransi dan regulator Amerika. Hasilnya: 71%. Selisih 14 poin. Manajemen menuduh auditor salah hitung; auditor membuka spesifikasinya — dan tim mutu terdiam.",
        "Twist ganda. Pertama, penyebutnya beda: tim RS menghitung dari SEMUA pasien diabetes yang tercatat tahun itu; HEDIS hanya menghitung yang terdaftar penuh 12 bulan (continuous enrollment) dan mengeluarkan pasien hospice — karena mengukur mutu layanan berarti mengukur yang benar-benar dilayani penuh. Kedua, ukurannya terbalik: measure HEDIS yang dipakai adalah “HbA1c POOR control (>9%)” — semakin RENDAH semakin baik. Tim RS merayakan “85% terkontrol” padahal spesifikasi resminya menghitung kegagalan, bukan keberhasilan. Mereka tidak hanya salah hitung — mereka salah memahami apa yang diukur.",
        "Lesson ini mengajarkan anatomi measure HEDIS (numerator, denominator, eksklusi), konsep continuous enrollment, perbedaan data administratif vs hybrid, logika CMS Star Ratings — dan cara mengadaptasikannya ke indikator mutu RS di Indonesia tanpa mengimpor mentah-mentah sistem Amerika.",
      ],
      tasks: [],
      note: {
        title: "Kenapa analis Indonesia perlu paham HEDIS",
        type: "risk",
        body: "Tiga alasan. Pertama, asuransi kesehatan (termasuk pola pikir BPJS Kesehatan) bergerak ke arah pembayaran berbasis mutu — measure yang terdefinisi ketat seperti HEDIS adalah template-nya. Kedua, rumah sakit yang bekerja sama dengan asuransi internasional atau terakreditasi Joint Commission akan ditanya dengan bahasa measure ini. Ketiga — dan terpenting — disiplin berpikirnya universal: setiap kali kamu melaporkan “cakupan X%”, pertanyaan HEDIS-lah yang menentukan apakah angkamu jujur: siapa penyebutnya? siapa dikeluarkan? periode observasinya berapa? Analis yang menguasai anatomi measure tidak akan pernah lagi melaporkan angka tanpa definisi.",
      },
      reference: "HEDIS = disiplin mendefinisikan measure mutu: numerator, denominator, eksklusi, periode. Berlaku di sistem kesehatan mana pun.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menguraikan anatomi sebuah measure HEDIS — numerator, denominator, eksklusi, continuous enrollment; (2) menghitung skor measure dari data klaim sintetis beserta penyesuaiannya; (3) menjelaskan logika CMS Star Ratings (bobot, cut points, bintang 1–5); (4) merancang adaptasi measure ala-HEDIS untuk indikator mutu RS di Indonesia.",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (anatomi measure, contoh HbA1c poor control, Star Ratings & adaptasi Indonesia) → lab Python (hitung skor measure + bintang dari 10 anggota) → chart corong measure dengan panduan baca → peta keputusan → mini-case adopsi measure di Dinkes → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, rasio dan penyebut: dari lesson dashboard — skor measure adalah rasio; kejujurannya ditentukan definisi penyebut, bukan pembilang. Kedua, data klaim: catatan administratif asuransi (diagnosis berkode ICD, prosedur, tanggal layanan) — sumber utama measure “administrative”. Ketiga, HbA1c: penanda gula darah rata-rata 3 bulan; <8% umumnya terkontrol, >9% buruk — ambang ini yang dipakai measure contoh kita.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: setiap measure mutu adalah jawaban atas tiga pertanyaan — dihitung DARI siapa (denominator), dihitung APA (numerator), dan siapa yang DIKELUARKAN dengan alasan sah (eksklusi). Kuasai tiga pertanyaan ini, dan kamu bisa membaca spesifikasi measure apa pun di dunia.",
      ],
      reference: "Bekal: (1) skor = rasio, penyebut menentukan kejujuran; (2) data klaim = sumber administratif; (3) HbA1c >9% = poor control.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi sebuah measure — tiga pertanyaan sakti",
      prose: [
        "Definisi: measure HEDIS didefinisikan oleh tiga komponen. Denominator: populasi yang BERHAK diukur — mis. anggota usia 18–75 dengan diagnosis diabetes yang terdaftar penuh selama tahun pengukuran (continuous enrollment: terdaftar 12 bulan penuh dengan jeda maksimal 45 hari). Numerator: subset denominator yang memenuhi kriteria mutu — untuk “HbA1c poor control”, numerator = yang HbA1c-nya >9% ATAU tidak dites sama sekali (tidak dites = dianggap buruk — insentif untuk menguji, bukan menyembunyikan). Eksklusi: yang dikeluarkan dengan alasan klinis sah — mis. pasien hospice atau dengan frailty lanjut, karena target kontrol glikemik tidak relevan bagi mereka.",
        "Kepribadiannya: measure HEDIS adalah wasit yang perfeksionis. Ia tidak bertanya “berapa yang berhasil?” sebelum memastikan “pertandingannya adil”: semua pemain benar-benar bermain penuh satu musim (continuous enrollment), dan yang cedera permanen tidak dihitung (eksklusi). Wasit yang menghitung semua orang yang pernah menyentuh lapangan — termasuk yang baru gabung bulan Desember — akan menghukum tim yang anggotanya berganti-ganti. Continuous enrollment adalah cara wasit berkata: saya hanya menilai yang saya layani penuh.",
        "Dua cara pengumpulan data. Administrative: murni dari data klaim (kode diagnosis, prosedur, farmasi) — murah, otomatis, tetapi buta terhadap hasil lab yang tidak terkode. Hybrid: klaim + sampel rekam medis yang ditelaah manual — mahal tetapi menangkap HbA1c aktual dari catatan lab. Pilihan antara keduanya adalah trade-off biaya vs akurasi yang akan kamu putuskan di peta keputusan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Denominator = semua pasien dengan diagnosis itu”",
        type: "pitfall",
        body: "Yang benar: denominator HEDIS JAUH lebih sempit — hanya yang continuous enrollment dan tidak tereksklusi. Analis yang memakai “semua pasien diabetes” sebagai penyebut akan menghasilkan angka yang tidak bisa dibandingkan dengan siapa pun — seperti membandingkan nilai ujian tanpa memastikan pesertanya mengerjakan soal yang sama dalam waktu yang sama. Inilah sumber selisih 85% vs 71% di cerita pembuka.",
      },
      hints: [
        "💡 Intuisi: “tidak dites = dihitung buruk” terlihat kejam, tetapi justru itulah desain insentifnya — measure menghukum ketidaktahuan. Sistem yang menghitung “tidak tahu” sebagai “baik-baik saja” sedang memberi insentif untuk tidak memeriksa.",
      ],
      reference: "Denominator = eligible penuh (continuous enrollment). Numerator = memenuhi kriteria. Eksklusi = alasan klinis sah. Tidak dites = buruk.",
    },
    {
      id: "konsep-contoh",
      eyebrow: "Langkah 4 · Konsep",
      title: "Contoh: HbA1c poor control — measure yang terbalik",
      prose: [
        "Definisi measure: “Hemoglobin A1c (HbA1c) Poor Control (>9.0%)” — persentase anggota denominator yang HbA1c terakhirnya >9,0% atau tidak memiliki hasil tes selama tahun pengukuran. Ini INVERTED measure: semakin RENDAH skornya, semakin BAIK mutunya. Tujuannya: memfokuskan perhatian pada kegagalan — pasien yang paling butuh intervensi — bukan merayakan rata-rata.",
        "Kepribadiannya: measure ini adalah alarm kebakaran, bukan termometer ruangan. Termometer (rata-rata HbA1c) memberi tahu suhu umum; alarm kebakaran hanya berbunyi saat ada yang terbakar — dan itulah yang dibutuhkan manajemen: daftar nama yang harus dihubungi minggu ini, bukan angka cantik untuk laporan tahunan. Inilah kenapa HEDIS memakai poor control, bukan good control: sistem mutu yang baik terobsesi pada kegagalannya.",
        "Contoh langkah-demi-langkah (angka lab lesson ini): 10 anggota diabetes. Continuous enrollment (≥11 bulan) + tidak tereksklusi → denominator = 6 (M1, M2, M5, M6, M7, M8). Yang HbA1c-nya >9% atau tidak dites → numerator = 4 (M2: 9,8; M5: 11,0; M7: tidak dites; M8: 9,1). Skor = 4/6 × 100% = 66,7%. Interpretasi: dua pertiga populasi eligible dalam kontrol buruk — dan M7 (tidak dites) adalah intervensi termurah: jadwalkan tesnya minggu ini.",
      ],
      formula: String.raw`\text{Skor measure} = \frac{\text{Numerator}}{\text{Denominator} - \text{Eksklusi}} \times 100\%`,
      formulaNote: "Skor measure (%, untuk inverted measure: semakin rendah semakin baik). Numerator = anggota denominator yang memenuhi kriteria (di sini: HbA1c >9% atau tidak dites). Denominator = populasi eligible (continuous enrollment). Eksklusi = dikeluarkan dengan alasan klinis sah — dalam praktik HEDIS eksklusi sudah dikeluarkan SEBELUM membentuk denominator; rumus di atas menunjukkan logikanya. Contoh: numerator 4, denominator 6 → skor = 4/6 × 100% = 66,7%.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Skor 66,7% berarti dua pertiga pasien terkontrol baik”",
        type: "pitfall",
        body: "Yang benar: untuk inverted measure, 66,7% berarti dua pertiga dalam kontrol BURUK. Kesalahan membaca arah measure adalah blunder presentasi yang paling memalukan — merayakan angka kegagalan di depan direksi. Kebiasaan aman: selalu tulis arah di samping setiap measure — “(↓ baik)” atau “(↑ baik)”. Satu simbol panah mencegah satu bencana rapat.",
      },
      hints: [
        "💡 Intuisi: saat menerima measure baru, pertanyaan pertamamu bukan “berapa skornya?” melainkan “arah mana yang baik?”. Jawaban pertanyaan kedua menentukan apakah pertanyaan pertama bermakna.",
      ],
      reference: "Poor control = inverted measure (↓ baik). Selalu tandai arah measure. Tidak dites = dihitung buruk.",
    },
    {
      id: "konsep-star",
      eyebrow: "Langkah 5 · Konsep",
      title: "CMS Star Ratings — dan cara mengadaptasi ke Indonesia",
      prose: [
        "Definisi: CMS (Centers for Medicare & Medicaid Services) menggabungkan puluhan measure HEDIS dkk menjadi peringkat bintang 1–5 untuk asuransi/RS. Logikanya tiga langkah: (1) tiap measure diberi skor; (2) measure DIBOBOTI — outcome (hasil klinis) berbobot lebih tinggi daripada process (kepatuhan prosedur), dan measure pengalaman pasien punya bobot sendiri; (3) skor terbobot total dipetakan ke bintang lewat cut points (ambang batas) yang ditetapkan tiap tahun. Bintang 5 = bintang lima mutu; di bawah 3 = lampu kuning.",
        "Kepribadiannya: Star Ratings adalah rapor akhir sekolah. Nilai tiap mata pelajaran (measure) penting, tetapi matematika berbobot 3 SKS dan olahraga 1 SKS — sekolah (CMS) memutuskan apa yang paling menentukan kelulusan. Cut points adalah KKM yang bisa berubah tiap tahun: yang tahun lalu bintang 4 bisa turun ke 3 tanpa kinerjamu berubah — karena standarnya naik. Analis yang paham ini tidak panik saat bintang turun; ia bertanya “cut point-nya berubah atau kinerja kita yang turun?”",
        "Adaptasi Indonesia — prinsipnya, bukan fotokopinya. Jangan impor mentah-mentah (sistem asuransi dan datanya beda); impor ANATOMINYA: (1) definisikan tiap indikator mutu RS dengan numerator/denominator/eksklusi tertulis — mis. “kepatuhan clinical pathway stroke” dengan denominator = pasien stroke yang dirawat ≥24 jam, eksklusi = dirujuk <24 jam; (2) tetapkan arah (↑/↓ baik) di setiap indikator; (3) boboti: outcome (mortalitas, readmisi) lebih berat dari process (kelengkapan asesmen); (4) publikasikan metodologi, bukan hanya angkanya — kepercayaan = transparansi definisi. Inilah HEDIS versi Indonesia: disiplinnya sama, isinya lokal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Bintang 3 berarti mutu sedang — aman”",
        type: "pitfall",
        body: "Yang benar: bintang adalah POSISI RELATIF terhadap cut points tahun itu, bukan nilai absolut mutu. RS bintang 3 tahun ini bisa bermutu sama dengan RS bintang 4 tahun lalu bila cut points naik. Lebih berbahaya lagi: membandingkan bintang antar RS tanpa melihat case-mix (RS rujukan menerima pasien lebih berat) adalah menghukum RS yang menangani kasus sulit. Bintang tanpa konteks adalah gosip berangka.",
      },
      hints: [
        "💡 Intuisi kedua: bobot adalah pernyataan nilai organisasi. Saat merancang sistem bintang lokal, diskusi “measure mana berbobot berapa” sebenarnya diskusi “kita menghargai apa”. Analis yang memfasilitasi diskusi itu sedang membentuk budaya mutu — bukan sekadar menghitung.",
      ],
      reference: "Bintang = skor terbobot vs cut points (relatif, tahunan). Adaptasi: impor anatomi (definisi tertulis + arah + bobot), bukan angkanya.",
    },
    {
      id: "lab-hedis",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Hitung skor measure + bintang dari data klaim",
      prose: [
        "Waktunya menjadi auditor mutu. Di bawah ada data SINTETIS 10 anggota dengan diabetes: bulan terdaftar, status eksklusi (hospice), dan HbA1c terakhir (None = tidak dites). Tugasmu: bentuk denominator (continuous enrollment ≥ 11 bulan DAN tidak tereksklusi), hitung numerator (HbA1c > 9% ATAU tidak dites), skor poor-control, lalu petakan ke bintang dengan cut points contoh.",
        "Coba: setelah lolos, ubah ambang continuous enrollment menjadi 12 bulan penuh — siapa yang keluar dari denominator dan bagaimana skornya berubah? Lalu bayangkan M7 ternyata dites dengan hasil 7,5 — berapa skor barunya? Itulah nilai satu tes yang dijadwalkan tepat waktu.",
      ],
      tasks: [
        { id: "t1", text: "Isi `denominator` = list id anggota: bulan ≥ 11 DAN tidak tereksklusi" },
        { id: "t2", text: "Isi `numerator` = list id denominator: HbA1c > 9.0 ATAU tidak dites (None)" },
        { id: "t3", text: "Isi `skor` = len(numerator)/len(denominator)×100 dan `bintang` dari cut points (≤25:5, ≤40:4, ≤55:3, ≤70:2, else:1)" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan tercetak sesuai format" },
      ],
      expected: "denominator (6): M1, M2, M5, M6, M7, M8\nnumerator (4): M2, M5, M7, M8\nskor poor-control = 66.7% → 2 bintang",
      code: {
        starter: `# Data SINTETIS 10 anggota diabetes (dibuat untuk latihan)
# (id, bulan_terdaftar, eksklusi_hospice, hba1c_terakhir; None = tidak dites)
anggota = [
    ("M1", 12, False, 7.2), ("M2", 12, False, 9.8),
    ("M3", 10, False, 8.1), ("M4", 12, True, 10.2),
    ("M5", 12, False, 11.0), ("M6", 11, False, 8.8),
    ("M7", 12, False, None), ("M8", 12, False, 9.1),
    ("M9", 9, False, 7.5), ("M10", 12, True, 8.0),
]

# TULIS KODEMU
denominator =
numerator =
skor =
bintang =

print("denominator (" + str(len(denominator)) + "): " + ", ".join(denominator))
print("numerator (" + str(len(numerator)) + "): " + ", ".join(numerator))
print(f"skor poor-control = {skor:.1f}% → {bintang} bintang")`,
        lockLines: 9,
        solution: `# Data SINTETIS 10 anggota diabetes (dibuat untuk latihan)
# (id, bulan_terdaftar, eksklusi_hospice, hba1c_terakhir; None = tidak dites)
anggota = [
    ("M1", 12, False, 7.2), ("M2", 12, False, 9.8),
    ("M3", 10, False, 8.1), ("M4", 12, True, 10.2),
    ("M5", 12, False, 11.0), ("M6", 11, False, 8.8),
    ("M7", 12, False, None), ("M8", 12, False, 9.1),
    ("M9", 9, False, 7.5), ("M10", 12, True, 8.0),
]

# TULIS KODEMU
denominator = [m[0] for m in anggota if m[1] >= 11 and not m[2]]
numerator = [i for i in denominator
             for m in anggota if m[0] == i and (m[3] is None or m[3] > 9.0)]
skor = len(numerator) / len(denominator) * 100
bintang = 5 if skor <= 25 else 4 if skor <= 40 else 3 if skor <= 55 else 2 if skor <= 70 else 1

print("denominator (" + str(len(denominator)) + "): " + ", ".join(denominator))
print("numerator (" + str(len(numerator)) + "): " + ", ".join(numerator))
print(f"skor poor-control = {skor:.1f}% → {bintang} bintang")`,
        checks: [
          { kind: "equal", task: "t1", name: "denominator", value: ["M1", "M2", "M5", "M6", "M7", "M8"], label: "`denominator` 6 anggota eligible", msg: "Bulan ≥ 11 dan tidak tereksklusi: M3 (10 bln) keluar, M4 & M10 tereksklusi, M9 (9 bln) keluar." },
          { kind: "equal", task: "t2", name: "numerator", value: ["M2", "M5", "M7", "M8"], label: "`numerator` 4 poor control", msg: "HbA1c > 9% atau tidak dites: M2, M5, M8, dan M7 (None)." },
          { kind: "equal", task: "t3", name: "skor", value: 66.67, tol: 0.01, label: "`skor` = 66,7%", msg: "4/6 × 100%." },
          { kind: "equal", task: "t3", name: "bintang", value: 2, label: "`bintang` = 2", msg: "66,7 ≤ 70 → 2 bintang (inverted: semakin rendah semakin baik)." },
          { kind: "stdout_matches", task: "t4", pattern: "skor poor-control = 66\\.7% → 2 bintang", label: "Ringkasan tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: denominator adalah tempat kejujuran bersembunyi",
        body: "Perhatikan di mana semua keputusan sulit berada: bukan di numerator (menghitung >9% itu trivial), melainkan di denominator — siapa yang eligible, siapa yang tereksklusi, berapa lama continuous enrollment. Dua analis dengan data sama bisa menghasilkan skor beda 14 poin hanya dari definisi denominator — persis cerita pembuka. Kebiasaan profesional: setiap kali melaporkan measure, lampirkan definisi denominator dalam satu kalimat. “Skor 66,7% (denominator: terdaftar ≥11 bulan, eksklusi hospice)” — satu kalimat yang menyelamatkanmu dari tuduhan manipulasi.",
      },
      reference: "Keputusan sulit = di denominator. Laporkan skor SELALU bersama definisi denominator satu kalimat.",
    },
    {
      id: "chart-corong",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca corong measure",
      prose: [
        "Chart di bawah memvisualkan perhitungan lab-mu sebagai corong: dari 10 anggota populasi menjadi 6 denominator eligible menjadi 4 numerator poor control — beserta alasan setiap penyusutan.",
        "Cara membaca: tiga batang horizontal = tiga tahap; panjang batang = jumlah anggota; teks di kanan menjelaskan siapa yang keluar di tiap tahap dan kenapa.",
        "Interpretasi: penyusutan terbesar bukan di numerator (kegagalan klinis), melainkan di denominator — 4 dari 10 anggota tidak eligible (2 tidak continuous enrollment, 2 tereksklusi). Artinya: sebelum memperbaiki layanan, pastikan dulu populasimu terdefinisi benar — 40% “kehilangan” terjadi di definisi, bukan di klinik. Dan skor akhir 66,7% dengan label tegas “semakin RENDAH semakin baik” mencegah blunder presentasi.",
      ],
      tasks: [],
      figure: { svg: FUNNEL_SVG, alt: "Diagram corong measure HEDIS dari populasi ke denominator ke numerator", caption: "Corong measure: 40% penyusutan terjadi di definisi denominator, bukan di klinik (data sintetis)." },
      hints: [
        "💡 Intuisi: gambar corong ini layak ditempel di dinding tim mutu. Setiap kali ada yang bertanya “kenapa skor kita beda dengan RS sebelah?”, jawabannya hampir selalu ada di tahap corong yang definisinya berbeda.",
      ],
      reference: "Visualkan corong measure saat mempresentasikan skor — tunjukkan siapa yang keluar dan kenapa.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Keputusan seputar measure mutu",
      prose: [
        "Skenario 1 — “Memilih sumber data”: kondisi = butuh murah, cepat, otomatis untuk ratusan ribu anggota → administrative (klaim saja). Kondisi = measure-nya butuh hasil lab aktual (HbA1c) dan klaim tidak mengkodekannya → hybrid (klaim + sampel rekam medis). Alasan: jangan bayar mahal untuk yang bisa dihitung murah; jangan pakai yang murah untuk yang butuh akurat.",
        "Skenario 2 — “Skor memburuk tiba-tiba”: kondisi = penurunan tajam tanpa perubahan layanan yang jelas. Keputusan: JANGAN umumkan dulu — cek apakah definisi denominator/eksklusi berubah, apakah ada migrasi sistem pencatatan, apakah continuous enrollment terdampak perubahan kepesertaan. Alasan: 8 dari 10 “krisis mutu” adalah krisis definisi atau data, bukan krisis klinis.",
        "Skenario 3 — “Membandingkan dua RS”: kondisi = RS A skor lebih baik dari RS B. Keputusan: bandingkan HANYA setelah cek case-mix dan definisi denominator yang sama — RS rujukan dengan pasien lebih berat wajar skornya lebih buruk. Alasan: membandingkan tanpa penyesuaian = menghukum yang menangani kasus sulit.",
        "Skenario 4 — “Merancang indikator lokal Indonesia”: kondisi = Dinkes/RS ingin disiplin ala-HEDIS. Keputusan: adopsi ANATOMINYA (numerator/denominator/eksklusi tertulis + arah ↑/↓ + bobot outcome > process), isi dengan indikator lokal (kepatuhan clinical pathway, SPM). Alasan: fotokopi measure Amerika ke sistem Indonesia menghasilkan angka yang tidak relevan; yang universal adalah disiplin definisinya.",
        "Skenario 5 — “Measure vs realitas lapangan”: kondisi = skor bagus tetapi keluhan pasien banyak (atau sebaliknya). Keputusan: percayai lapangan, audit measure-nya — mungkin denominator terlalu sempit (cherry-picking) atau numerator tidak menangkap yang penting bagi pasien. Alasan: measure adalah proksi, bukan kenyataan; saat proksi dan kenyataan bertentangan, yang salah biasanya proksinya.",
        "Aturan praktis 10 detik: definisikan denominator tertulis → tandai arah (↑/↓ baik) → pisahkan perubahan definisi dari perubahan kinerja → bandingkan hanya yang comparable → audit measure saat bertentangan dengan lapangan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengejar skor measure, bukan mutu yang diwakilinya — mis. mengeluarkan pasien “sulit” lewat eksklusi yang diperluas agar skor cantik (gaming). Measure yang di-game berhenti menjadi measure (Hukum Goodhart): angkanya naik, mutunya tidak. Obatnya: audit definisi denominator secara berkala dan ukur outcome yang sulit di-game sebagai pasangan.",
      },
      reference: "Skor memburuk? Cek definisi dulu. Bandingkan hanya yang comparable. Waspadai gaming (Hukum Goodhart).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Adopsi measure di Dinkes",
      prose: [
        "Situasinya: kamu analis Dinkes provinsi. Kepala Dinas terinspirasi HEDIS dan memintamu merancang SATU measure ala-HEDIS untuk program diabetes di 5 RSUD: “persentase pasien diabetes dengan kontrol buruk”. Data yang tersedia: SIMRS tiap RS (tidak seragam formatnya), data kepesertaan BPJS (untuk continuous enrollment proxy). Waktu: 2 bulan sampai pilot.",
        "Pertanyaan analisis: (a) Tulis definisi numerator, denominator, dan eksklusi dalam satu paragraf masing-masing — spesifik dan bisa diimplementasikan. (b) Administrative atau hybrid? Jelaskan trade-off untuk konteks 5 RSUD ini. (c) Bagaimana kamu mencegah gaming (RS memperluas eksklusi agar skor cantik)?",
        "Pembahasan: (a) Denominator: pasien usia 18–75 dengan diagnosis diabetes (ICD-10 E10–E14) yang tercatat di SIMRS RS yang sama ≥11 bulan dalam tahun pengukuran. Numerator: HbA1c terakhir >9% atau tidak ada hasil HbA1c dalam 12 bulan. Eksklusi: pasien hospice/paliatif terdokumentasi, usia >75 dengan frailty berat (kriteria tertulis). Arah: ↓ baik. (b) Hybrid ringan: klaim/SIMRS untuk denominator + verifikasi sampel 30 rekam medis per RS untuk validasi HbA1c — karena format SIMRS tidak seragam, administrative murni berisiko salah kode; full hybrid terlalu mahal untuk pilot. (c) Tiga lapis: definisi eksklusi dikunci di tingkat Dinkes (RS tidak boleh menambah kriteria sendiri); audit sampel silang antar-RS tiap semester; publikasikan distribusi eksklusi per RS — RS dengan eksklusi 3× lipat tetangganya otomatis ter-flag untuk audit mendalam. Transparansi adalah musuh gaming.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Logika anti-gaming ini identik dengan credit risk: bank tidak percaya self-reported income debitur tanpa verifikasi, dan regulator mengaudit definisi “kredit macet” tiap bank agar tidak diperluas seenaknya. Measure mutu dan metrik risiko sama-sama butuh definisi terkunci + audit independen — skill yang kamu latih di sini langsung terbawa ke risk analytics.",
      },
      reference: "Rancang measure lokal: definisi terkunci di pusat, hybrid ringan untuk pilot, audit silang anti-gaming.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Anatomi measure: denominator (eligible, continuous enrollment), numerator (kriteria), eksklusi (alasan klinis sah) — keputusan sulit selalu di denominator.",
        "Tidak dites = dihitung buruk (desain insentif); inverted measure (↓ baik) wajib ditandai arahnya.",
        "Administrative (murah, dari klaim) vs hybrid (mahal, + rekam medis) — pilih berdasar kebutuhan akurasi.",
        "CMS Star Ratings: skor terbobot (outcome > process) vs cut points tahunan — bintang itu relatif, bukan absolut.",
        "Adaptasi Indonesia: impor anatomi (definisi tertulis + arah + bobot), bukan angka Amerika.",
      ],
      quiz: [
        {
          q: "Dua analis menghitung measure yang sama dari data sama dan hasilnya beda 14 poin. Penyebab paling mungkin?",
          options: [
            { text: "Definisi denominator berbeda — siapa yang eligible, continuous enrollment berapa lama, eksklusi apa", why: "Benar: numerator hampir selalu trivial; seluruh perselisihan measure bermukim di denominator.", correct: true },
            { text: "Salah satu analis salah rumus matematika", why: "Salah: rumusnya hanya pembagian; yang kompleks adalah definisi himpunannya." },
            { text: "Data salah satu analis korup", why: "Salah: mungkin, tetapi jauh lebih jarang daripada perbedaan definisi — cek definisi dulu." },
            { text: "Bedanya tidak mungkin sebesar itu", why: "Salah: sangat mungkin — cerita pembuka lesson ini persis 14 poin." },
          ],
        },
        {
          q: "Kenapa HEDIS menghitung “tidak dites HbA1c” sebagai poor control?",
          options: [
            { text: "Desain insentif — menghukum ketidaktahuan agar penyedia rajin menguji, bukan menyembunyikan", why: "Benar: bila “tidak tahu” dihitung baik, insentifnya adalah tidak memeriksa. Measure yang baik menutup celah ini.", correct: true },
            { text: "Karena tidak dites pasti berarti gulanya tinggi", why: "Salah: tidak ada hubungan kausal yang pasti; ini keputusan desain, bukan inferensi klinis." },
            { text: "Agar rumusnya lebih sederhana", why: "Salah: kesederhanaan bukan alasannya; insentiflah alasannya." },
            { text: "Itu kesalahan spesifikasi", why: "Salah: ini disengaja dan didokumentasikan — ciri khas measure yang matang." },
          ],
        },
        {
          q: "RS mendapat bintang 2 untuk measure poor control 66,7%. Apa yang TIDAK boleh disimpulkan?",
          options: [
            { text: "“Mutu RS ini buruk secara absolut” — bintang itu relatif terhadap cut points tahun berjalan", why: "Benar: bintang = posisi vs ambang tahun itu; tanpa konteks cut points dan case-mix, vonis absolut tidak sah.", correct: true },
            { text: "Dua pertiga populasi eligible dalam kontrol buruk", why: "Salah: ini justru kesimpulan yang SAH dari skor 66,7% — masalahnya bukan di sini." },
            { text: "Perlu intervensi pada numerator", why: "Salah: ini respons yang tepat — numerator adalah daftar kerja." },
            { text: "Definisi denominator perlu dilampirkan saat melaporkan", why: "Salah: ini juga praktik yang benar." },
          ],
        },
        {
          q: "Kapan hybrid (klaim + telaah rekam medis) lebih tepat daripada administrative murni?",
          options: [
            { text: "Ketika measure membutuhkan hasil klinis (mis. nilai HbA1c) yang tidak terkode di klaim", why: "Benar: klaim buta terhadap banyak hasil klinis; hybrid membayar mahal untuk akurasi yang administrative tidak bisa beri.", correct: true },
            { text: "Selalu — hybrid selalu lebih baik", why: "Salah: untuk measure yang fully ter-kode di klaim, hybrid hanya membuang biaya." },
            { text: "Tidak pernah — terlalu mahal", why: "Salah: untuk keputusan bernilai besar (kontrak, akreditasi), akurasi sepadan biayanya." },
            { text: "Hanya untuk RS besar", why: "Salah: kriterianya kebutuhan data, bukan ukuran RS." },
          ],
        },
        {
          q: "Skor mutu RS memburuk tajam dalam satu kuartal tanpa perubahan layanan yang jelas. Langkah pertama?",
          options: [
            { text: "Cek perubahan definisi denominator/eksklusi dan migrasi sistem pencatatan sebelum menyimpulkan kinerja turun", why: "Benar: 8 dari 10 “krisis mutu” adalah krisis definisi/data. Diagnosis dulu, vonis kemudian.", correct: true },
            { text: "Umumkan krisis mutu ke publik", why: "Salah: mengumumkan sebelum diagnosis adalah cara tercepat menghancurkan kepercayaan — mungkin tanpa alasan." },
            { text: "Ganti kepala unit terkait", why: "Salah: vonis personalia atas sinyal yang belum terverifikasi." },
            { text: "Naikkan target tahun depan agar terpacu", why: "Salah: menaikkan target di atas data yang belum dipahami hanya menambah distorsi." },
          ],
        },
        {
          q: "Dinkes ingin mengadopsi disiplin HEDIS untuk indikator lokal. Prinsip adaptasi yang benar?",
          options: [
            { text: "Impor anatominya — numerator/denominator/eksklusi tertulis, arah ↑/↓, bobot outcome > process — dengan isi indikator lokal", why: "Benar: yang universal adalah disiplin definisinya; angka dan ambang Amerika tidak relevan untuk sistem Indonesia.", correct: true },
            { text: "Fotokopi semua measure dan cut points Amerika", why: "Salah: sistem asuransi, data, dan epidemiologinya beda — angkanya tidak bermakna di sini." },
            { text: "Cukup pakai namanya agar terlihat modern", why: "Salah: label tanpa disiplin definisi adalah kosmetik." },
            { text: "Tidak perlu — Indonesia sudah punya cukup indikator", why: "Salah: masalahnya bukan jumlah indikator, melainkan banyak indikator tanpa definisi tertulis yang bisa diaudit." },
          ],
        },
      ],
      next: { label: "HD32 — Deployment Real-Time: Streaming & Alert Klinis", href: "/v2/learn/hd32-deployment-realtime" },
    },
  ],
};
