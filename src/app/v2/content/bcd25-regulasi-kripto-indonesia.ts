import type { V2Lesson } from "../lib/types";

// ── Figure: alur klasifikasi kepatuhan (ilustrasi pola) ──────────────────
const ALUR_SVG = `<svg viewBox="0 0 620 280" role="img" aria-label="Alur klasifikasi transaksi: pola structuring ke tahan dan eskalasi, transfer besar ke wallet tanpa host ke wajib lapor plus data pengirim, nilai di atas parameter ke wajib lapor, sisanya boleh (ilustrasi)">
<g font-family="var(--font-ui)" text-anchor="middle" font-size="12">
<rect x="230" y="10" width="160" height="44" rx="8" fill="var(--c1)"/><text x="310" y="28" fill="#fff">transaksi masuk</text><text x="310" y="44" fill="#fff" font-size="11">cek pola &amp; nilai</text>
<rect x="30" y="100" width="170" height="52" rx="8" fill="var(--c2)"/><text x="115" y="120" fill="#fff">pola structuring?</text><text x="115" y="136" fill="#fff" font-size="11">≥3 penarikan 90–100%</text><text x="115" y="148" fill="#fff" font-size="11">dari parameter</text>
<rect x="225" y="100" width="170" height="52" rx="8" fill="var(--c2)"/><text x="310" y="120" fill="#fff">transfer ke wallet</text><text x="310" y="136" fill="#fff" font-size="11">tanpa host ≥ parameter?</text>
<rect x="420" y="100" width="170" height="52" rx="8" fill="var(--c2)"/><text x="505" y="120" fill="#fff">nilai ≥ parameter?</text><text x="505" y="136" fill="#fff" font-size="11">jenis apa pun</text>
<rect x="30" y="200" width="170" height="52" rx="8" fill="#d64545"/><text x="115" y="222" fill="#fff">TAHAN &amp; ESKALASI</text><text x="115" y="238" fill="#fff" font-size="11">dugaan penghindaran</text>
<rect x="225" y="200" width="170" height="52" rx="8" fill="#e08a00"/><text x="310" y="222" fill="#fff">WAJIB LAPOR +</text><text x="310" y="238" fill="#fff" font-size="11">data pengirim (Travel Rule)</text>
<rect x="420" y="200" width="170" height="52" rx="8" fill="#e08a00"/><text x="505" y="222" fill="#fff">WAJIB LAPOR</text><text x="505" y="238" fill="#fff" font-size="11">laporan transaksi</text>
<g stroke="var(--chart-grid)" stroke-width="2"><line x1="310" y1="54" x2="115" y2="100"/><line x1="310" y1="54" x2="310" y2="100"/><line x1="310" y1="54" x2="505" y2="100"/><line x1="115" y1="152" x2="115" y2="200"/><line x1="310" y1="152" x2="310" y2="200"/><line x1="505" y1="152" x2="505" y2="200"/></g>
<g fill="var(--text-muted)" font-size="11"><text x="310" y="272">parameter = ambang penyaring INTERNAL contoh ini, bukan ambang resmi</text></g></g></svg>`;

export const bcd25: V2Lesson = {
  slug: "bcd25-regulasi-kripto-indonesia",
  track: "Blockchain Data Scientist",
  module: "Kepatuhan & Regulasi",
  title: "BCD25 — Regulasi Kripto Indonesia: OJK, PPATK, dan Kewajiban Exchange",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan arsitektur pengawasan aset kripto Indonesia — peralihan ke OJK pasca UU P2SK dan peran PPATK — secara konseptual; (2) mendaftar kewajiban inti exchange berlisensi: KYC, pemisahan aset pelanggan, dan pelaporan; (3) menguraikan alur pelaporan transaksi mencurigakan dari sudut pandang exchange sampai ke goAML; (4) menjelaskan Travel Rule untuk transfer aset kripto — informasi apa yang harus ikut “bepergian” bersama dana; (5) mengklasifikasikan skenario transaksi ke “boleh / wajib lapor / tahan & eskalasi” dengan aturan yang eksplisit.",
        "Rutenya: cerita denda yang hampir terjadi → empat konsep inti (arsitektur pengawasan, kewajiban exchange, pelaporan PPATK, Travel Rule) → lab Pyodide (klasifikasi 6 skenario + deteksi structuring) → diagram alur klasifikasi dengan panduan baca → peta keputusan → mini-case → kuis → rangkuman. Estimasi 65 menit; lab-nya ±15 menit.",
        "Catatan kejujuran: lesson ini menyampaikan KERANGKA konseptual yang dikenal publik. Angka ambang, nomor peraturan spesifik, dan tenggat administratif berubah seiring waktu — selalu verifikasi ke sumber resmi OJK/PPATK terbaru sebelum memakai untuk keputusan nyata. Di lab, ambang Rp500 juta adalah PARAMETER PENYARING INTERNAL contoh ini, bukan ambang resmi.",
      ],
      tasks: [],
      reference: "Lima konsep: arsitektur pengawasan → kewajiban exchange → pelaporan PPATK → Travel Rule → klasifikasi.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tiga penarikan yang hampir menjadi denda",
      prose: [
        "Ratna, compliance officer di exchange kripto Jakarta, menerima email dari tim operasional: seorang pengguna melakukan tiga penarikan — Rp480 juta, Rp490 juta, Rp495 juta — dalam 40 menit, semuanya di bawah “batas yang memicu laporan otomatis” versi SOP lama mereka. Tim operasional menganggapnya aman: “kan di bawah ambang, Bu.”",
        "Ratna tidak menganggapnya aman. Polanya berteriak: tiga penarikan berurutan, semuanya menempel di bawah satu angka bulat, dalam jendela waktu sempit. Itu bukan tiga keputusan independen — itu SATU keputusan yang dipecah tiga. Ia menahan dananya, mengeskalasi ke PPATK sebagai transaksi mencurigakan, dan mendokumentasikan semuanya. Sebulan kemudian, pemeriksa menanyakan tepat kasus ini. Karena dokumentasinya lengkap, exchange lolos tanpa temuan.",
        "Twist-nya: SOP yang hanya mengandalkan “ambang angka” justru menciptakan CETAK BIRU penghindaran — pelaku tinggal memecah transaksi di bawahnya. Yang menyelamatkan exchange bukanlah angkanya, melainkan analis yang membaca POLA di balik angka. Regulasi kripto bukan soal menghafal ambang; soal memahami perilaku yang ingin dicegah regulasi itu.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: ambang pelaporan itu seperti garis finish yang terlihat — pelaku yang cerdik tidak akan melewatinya, melainkan berhenti satu langkah sebelumnya, berkali-kali. Tugas compliance adalah melihat larinya, bukan garisnya.",
      ],
      reference: "Pelajaran cerita: pola structuring > ambang angka. Dokumentasi lengkap = tameng saat diperiksa.",
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Konsep",
      title: "Arsitektur Pengawasan — Siapa Mengawasi Siapa",
      prose: [
        "Gambaran konseptualnya: aset kripto di Indonesia kini berada dalam kerangka sektor keuangan yang pengawasannya beralih ke OJK pasca UU P2SK (Undang-Undang Pengembangan dan Penguatan Sektor Keuangan) — sebuah peralihan besar dari rezim sebelumnya yang menempatkan aset kripto sebagai komoditas. Detail teknis peralihan (jadwal, peraturan pelaksana spesifik) terus berkembang — yang perlu kamu pegang adalah ARAHNYA: kripto diperlakukan makin seperti instrumen keuangan, dengan standar perizinan dan pengawasan yang setara.",
        "Dua institusi kuncinya. OJK: pemberi izin dan pengawas perilaku usaha — siapa boleh beroperasi sebagai pedagang aset kripto, standar minimumnya apa, bagaimana pengawasannya. PPATK: garda intelijen keuangan — menerima laporan transaksi (termasuk dari exchange), menganalisisnya, dan meneruskannya ke penegak hukum bila terindikasi tindak pidana. Analogi sederhana: OJK memastikan lapangannya layak main; PPATK mengawasi siapa yang bermain curang.",
        "Kepribadiannya: arsitektur ini seperti sistem keamanan bandara berlapis — OJK memeriksa “maskapai” (apakah exchange layak terbang), PPATK memantau “penumpang mencurigakan” (arus dana). Keduanya tidak bisa digantikan satu sama lain, dan exchange yang patuh harus melayani keduanya: izin dari yang satu, laporan ke yang satunya.",
        "Kenapa analis data perlu tahu ini: setiap metrik yang kamu bangun di exchange pada akhirnya melayani salah satu dari dua tuan ini — laporan berkala ke OJK (kesehatan usaha) atau laporan transaksi ke PPATK (integritas sistem). Memahami “laporan ini untuk siapa dan untuk apa” menentukan desain datanya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Regulasi kripto = melarang kripto”",
        type: "pitfall",
        body: "Yang benar: arah regulasi Indonesia adalah MELEGALISASI dengan syarat — perizinan, standar, pengawasan — bukan pelarangan. Exchange berlisensi justru DILINDUNGI kerangka ini dari kompetisi liar. Analis yang memahami regulasi sebagai “aturan main” (bukan “musuh”) bisa merancang sistem yang patuh SEJAK AWAL, jauh lebih murah daripada menambal setelah kena temuan.",
      },
      hints: [
        "💡 Intuisi: OJK = wasit liga (memastikan klub layak bertanding); PPATK = wasit VAR untuk kecurangan finansial (meninjau ulang momen mencurigakan). Kamu bermain di liga yang sama — kenali kedua wasitnya.",
      ],
      reference: "OJK: perizinan & pengawasan usaha. PPATK: intelijen transaksi. Verifikasi detail terbaru ke sumber resmi.",
    },
    {
      id: "kewajiban",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kewajiban Exchange — Tiga Pilar Kepatuhan",
      prose: [
        "Pilar 1 — KYC (Know Your Customer): exchange wajib mengenali siapa pelanggannya — identitas terverifikasi sebelum bertransaksi. Bukan formalitas: KYC adalah fondasi SEMUA pelaporan berikutnya — laporan transaksi tanpa identitas yang benar = surat tanpa alamat.",
        "Pilar 2 — PEMISAHAN ASET: dana/aset kripto milik pelanggan wajib dipisahkan dari aset operasional perusahaan. Pelajarannya dari sejarah industri: setiap kali exchange besar runtuh dan dana pelanggan ikut lenyap, penyebabnya hampir selalu pencampuran ini. Pemisahan bukan sekadar aturan — ia adalah janji “uangmu tetap milikmu meski kami bangkrut” yang harus bisa dibuktikan ke auditor.",
        "Pilar 3 — PELAPORAN: transaksi-transaksi tertentu wajib dilaporkan ke otoritas (detail di langkah 5). Ditambah kewajiban umum: menyimpan catatan, melatih karyawan mengenali red flag, dan menunjuk penanggung jawab kepatuhan. Exchange tanpa fungsi compliance yang hidup = bom waktu berizin.",
        "Kepribadiannya: tiga pilar ini seperti tiga kaki meja — KYC (tahu SIAPA), pemisahan aset (jaga APA), pelaporan (laporkan KEJADIAN). Meja dengan dua kaki bisa berdiri sebentar — sampai ada yang menyenggolnya. Pemeriksa regulator adalah penyenggol profesional.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “KYC sekali di awal cukup — setelah itu bebas”",
        type: "pitfall",
        body: "Yang benar: KYC adalah PROSES berkelanjutan, bukan stempel sekali. Perilaku pelanggan berubah — akun lama yang tiba-tiba bertransaksi Rp5 miliar butuh peninjauan ulang (ongoing monitoring). Exchange yang “sudah KYC” lalu tidak pernah meninjau ulang sama saja dengan satpam yang memeriksa KTP sekali lalu tidur.",
      },
      hints: [
        "💡 Intuisi: KYC awal = foto KTP; monitoring berkelanjutan = CCTV. Foto memberitahumu siapa yang masuk gedung; CCTV memberitahumu apa yang ia lakukan di dalam.",
      ],
      reference: "Tiga pilar: KYC berkelanjutan, pemisahan aset pelanggan, pelaporan + pencatatan + penanggung jawab.",
    },
    {
      id: "ppatk",
      eyebrow: "Langkah 5 · Konsep",
      title: "Pelaporan ke PPATK — Dari Transaksi ke Intelijen",
      prose: [
        "Alurnya dari sudut pandang exchange: (1) sistem monitoring menandai transaksi (ambang internal, pola seperti structuring di cerita Ratna, atau red flag perilaku); (2) tim compliance menganalisis — apakah ini aktivitas wajar pelanggan atau indikasi pencucian dana/pendanaan terorisme?; (3) bila mencurigakan, disusun laporan transaksi keuangan mencurigakan dan disampaikan ke PPATK melalui sistem goAML; (4) PPATK menganalisis lintas institusi — keunggulan yang tidak dimiliki satu exchange pun: ia melihat pola yang tersebar di BANYAK bank dan exchange sekaligus.",
        "Tiga keranjang laporan yang perlu dikenal: laporan transaksi TUNAI dalam jumlah besar, laporan TRANSFER DANA (termasuk lintas negara), dan laporan TRANSAKSI MENCURIGAKAN — yang terakhir tidak bergantung pada angka, melainkan pada PENILAIAN (seperti kasus Ratna: masing-masing di bawah ambang, tetapi polanya mencurigakan). Inilah kenapa analis pola lebih berharga dari sekadar penjaga ambang.",
        "Kepribadiannya: goAML seperti kotak saran raksasa nasional untuk kecurigaan finansial — setiap institusi memasukkan laporannya, dan PPATK yang membaca semuanya bisa melihat gambar yang tidak terlihat dari satu kotak pun. Laporanmu yang “kecil” bisa menjadi kepingan puzzle kasus besar.",
        "Konsekuensi ketidakpatuhan: keterlambatan atau kesalahan pelaporan berujung sanksi administratif — dan yang lebih mahal: temuan berulang merusak kepercayaan regulator, yang berarti pengawasan makin ketat dan biaya kepatuhan makin mahal. Ratna lolos karena dokumentasinya lengkap — catat itu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Melapor ke PPATK = menuduh pelanggan bersalah”",
        type: "pitfall",
        body: "Yang benar: laporan transaksi mencurigakan adalah PENYAMPAIAN INFORMASI, bukan vonis. PPATK-lah yang menganalisis dan memutuskan tindak lanjutnya bersama penegak hukum. Analis exchange tidak menghakimi — ia memastikan kecurigaan yang beralasan sampai ke pihak yang berwenang menilainya. Tidak melapor karena “kasihan pelanggan” justru melanggar kewajiban.",
      },
      hints: [
        "💡 Intuisi: kamu bukan hakim — kamu saksi yang wajib bicara. Saksi tidak memutuskan bersalah; ia menyampaikan apa yang dilihatnya dengan jujur dan lengkap.",
      ],
      reference: "Alur: tandai → analisis → lapor via goAML → PPATK analisis lintas institusi. Tiga keranjang: tunai, transfer dana, mencurigakan.",
    },
    {
      id: "travel-rule",
      eyebrow: "Langkah 6 · Konsep",
      title: "Travel Rule — Data yang Harus Bepergian Bersama Dana",
      prose: [
        "Definisi: Travel Rule (aturan perjalanan dana, dari Rekomendasi 16 FATF) mewajibkan informasi pengirim dan penerima “ikut bepergian” bersama transfer — untuk transfer antar institusi keuangan, termasuk transfer aset kripto antar penyedia layanan (VASP/exchange). Intinya: dana tidak boleh bergerak ANONIM antar institusi — identitasnya harus menempel.",
        "Informasi yang harus ikut: identitas pengirim (nama, nomor akun/dompet), identitas penerima, dan identitas kedua institusi yang terlibat. Praktiknya di kripto: saat pelanggan menarik dana besar ke wallet di exchange lain (atau wallet tanpa host), exchange pengirim wajib memastikan data yang dipersyaratkan tersedia dan diteruskan sesuai ketentuan — persis skenario T5 di lab.",
        "Kenapa ini penting untuk analis data: Travel Rule mengubah desain sistem transfer — setiap transaksi besar ke pihak ketiga butuh KELENGKAPAN DATA, bukan cuma validasi saldo. Sistem yang tidak dirancang untuk ini akan macet di kasus T5: dana siap, data tidak.",
        "Batasnya — dan ini disengaja tidak diduplikasi dari lesson AML: lesson ini membahas Travel Rule dari sudut EXCHANGE (kewajiban operasional & desain sistem), bukan dari sudut kerangka AML global. Untuk fondasi konseptual FATF-nya, itu wilayah track Fraud & AML — kedua sudut pandang saling melengkapi, tidak mengulang.",
      ],
      formula: String.raw`\text{Transfer valid} = \text{dana} + \text{data pengirim} + \text{data penerima}`,
      formulaNote: "Bukan rumus matematika, melainkan SYARAT KELENGKAPAN: sebuah transfer antar institusi dianggap lengkap bila dananya bergerak DAN datanya menyertai. Contoh lab: T5 (Rp700 juta ke wallet tanpa host) = “wajib lapor + lengkapi data pengirim” — dananya ada, datanya harus dilengkapi. Interpretasi: di era Travel Rule, transfer tanpa data = transfer yang belum selesai.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Transfer kripto kan peer-to-peer — Travel Rule tidak berlaku”",
        type: "pitfall",
        body: "Yang benar: yang diatur adalah TRANSFER YANG MELIBATKAN institusi berizin (exchange/VASP) — bukan transaksi murni antar dompet pribadi. Begitu danamu menyentuh exchange berlisensi (masuk atau keluar), kewajiban informasi berlaku. “Desentralisasi” bukan perisai dari kewajiban institusi yang kamu pakai jasanya.",
      },
      hints: [
        "💡 Intuisi: Travel Rule seperti paspor untuk uang yang bepergian antar negara (institusi) — di dalam negeri sendiri (dompet pribadi ke dompet pribadi) tidak diminta, tetapi begitu melewati perbatasan institusi, paspor wajib ada.",
      ],
      reference: "Travel Rule: data pengirim+penerima menyertai transfer antar institusi. Berlaku saat menyentuh VASP/exchange.",
    },
    {
      id: "lab-klasifikasi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab — Klasifikasikan skenario kepatuhan exchange",
      prose: [
        "Waktunya jadi Ratna. Di bawah ada 6 skenario transaksi SINTETIS dan satu parameter penyaring INTERNAL (Rp500 juta — ingat, ini parameter contoh, bukan ambang resmi). Tugasmu: tulis fungsi `klasifikasi(sken, param)` yang mengembalikan dict id → vonis dengan aturan: (a) pola structuring — ≥3 penarikan masing-masing 90–100% dari param dalam contoh ini → “tahan & eskalasi”; (b) transfer ≥ param ke wallet tanpa host → “wajib lapor + lengkapi data pengirim”; (c) nilai ≥ param → “wajib lapor”; (d) sisanya → “boleh”. Lalu cetak vonis tiap skenario dan daftar id structuring.",
        "Coba: setelah lolos, ubah `PARAM_LAPOR` menjadi 400.0. Skenario mana yang berubah vonisnya — dan apa pelajaran tentang sensitivitas parameter internal? (Petunjuk: parameter internal yang terlalu rendah = banjir laporan; terlalu tinggi = kasus lolos.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi deteksi structuring: kumpulkan penarikan dengan 0,9×param ≤ nilai < param; bila ≥3, tandai id-nya" },
        { id: "t2", text: "Lengkapi aturan vonis per skenario: structuring → tahan & eskalasi; transfer besar ke wallet tanpa host → wajib lapor + data; nilai ≥ param → wajib lapor; else boleh" },
        { id: "t3", text: "Kembalikan (dict vonis, list id structuring terurut) dan cetak keduanya" },
      ],
      expected: "vonis_T5=wajib lapor + lengkapi data pengirim  structuring=['T2', 'T3', 'T4']",
      hints: [
        "💡 Kerjakan dalam dua pass: pass 1 = deteksi structuring (butuh melihat SEMUA skenario dulu); pass 2 = vonis satu per satu.",
        "💡 Untuk transfer ke wallet tanpa host: cek `s[\"jenis\"] == \"transfer\" and s[\"ke\"] == \"wallet_tanpa_host\"`.",
      ],
      code: {
        starter: `# 6 skenario sintetis + parameter INTERNAL contoh (bukan ambang resmi)
PARAM_LAPOR = 500.0  # juta Rp — parameter penyaring internal contoh ini
SKENARIO = [
    {"id": "T1", "jenis": "penarikan", "nilai": 600.0, "ke": "rekening_sendiri"},
    {"id": "T2", "jenis": "penarikan", "nilai": 480.0, "ke": "rekening_sendiri"},
    {"id": "T3", "jenis": "penarikan", "nilai": 490.0, "ke": "rekening_sendiri"},
    {"id": "T4", "jenis": "penarikan", "nilai": 495.0, "ke": "rekening_sendiri"},
    {"id": "T5", "jenis": "transfer", "nilai": 700.0, "ke": "wallet_tanpa_host"},
    {"id": "T6", "jenis": "order", "nilai": 50.0, "ke": "internal"},
]

# TULIS KODEMU
def klasifikasi(sken, param):
    hasil = 

vonis, struct = klasifikasi(SKENARIO, PARAM_LAPOR)
print(f"vonis_T5={vonis['T5']}  structuring={struct}")`,
        lockLines: 11,
        solution: `# 6 skenario sintetis + parameter INTERNAL contoh (bukan ambang resmi)
PARAM_LAPOR = 500.0  # juta Rp — parameter penyaring internal contoh ini
SKENARIO = [
    {"id": "T1", "jenis": "penarikan", "nilai": 600.0, "ke": "rekening_sendiri"},
    {"id": "T2", "jenis": "penarikan", "nilai": 480.0, "ke": "rekening_sendiri"},
    {"id": "T3", "jenis": "penarikan", "nilai": 490.0, "ke": "rekening_sendiri"},
    {"id": "T4", "jenis": "penarikan", "nilai": 495.0, "ke": "rekening_sendiri"},
    {"id": "T5", "jenis": "transfer", "nilai": 700.0, "ke": "wallet_tanpa_host"},
    {"id": "T6", "jenis": "order", "nilai": 50.0, "ke": "internal"},
]

# TULIS KODEMU
def klasifikasi(sken, param):
    kandidat = [s for s in sken
                if s["jenis"] == "penarikan" and param * 0.9 <= s["nilai"] < param]
    struct = sorted(s["id"] for s in kandidat) if len(kandidat) >= 3 else []
    sset = set(struct)
    hasil = {}
    for s in sken:
        if s["id"] in sset:
            hasil[s["id"]] = "tahan & eskalasi"
        elif s["jenis"] == "transfer" and s["ke"] == "wallet_tanpa_host" and s["nilai"] >= param:
            hasil[s["id"]] = "wajib lapor + lengkapi data pengirim"
        elif s["nilai"] >= param:
            hasil[s["id"]] = "wajib lapor"
        else:
            hasil[s["id"]] = "boleh"
    return hasil, struct

vonis, struct = klasifikasi(SKENARIO, PARAM_LAPOR)
print(f"vonis_T5={vonis['T5']}  structuring={struct}")`,
        checks: [
          { kind: "equal", task: "t1", name: "struct", value: ["T2", "T3", "T4"], label: "Structuring T2–T4 terdeteksi", msg: "Tiga penarikan 480–495 (90–100% dari 500)." },
          { kind: "equal", task: "t2", name: "vonis", value: {"T1": "wajib lapor", "T2": "tahan & eskalasi", "T3": "tahan & eskalasi", "T4": "tahan & eskalasi", "T5": "wajib lapor + lengkapi data pengirim", "T6": "boleh"}, label: "Semua vonis benar", msg: "T1 ≥ param → lapor; T5 transfer besar tanpa host → lapor + data; T6 kecil → boleh." },
          { kind: "stdout_matches", task: "t3", pattern: "vonis_T5=wajib lapor \\+ lengkapi data pengirim\\s+structuring=\\['T2', 'T3', 'T4'\\]", label: "`print` menampilkan vonis & structuring", msg: "Format: vonis_T5=...  structuring=[...]." },
        ],
      },
      reference: "Dua pass: deteksi pola dulu, vonis kemudian. Structuring = pola, bukan angka tunggal.",
    },
    {
      id: "chart-alur",
      eyebrow: "Langkah 8 · Visual",
      title: "Membaca diagram alur klasifikasi",
      prose: [
        "Cara membaca: mulai dari kotak atas (transaksi masuk), ikuti tiga pertanyaan berurutan — pola structuring? transfer besar ke wallet tanpa host? nilai ≥ parameter? — masing-masing mengarah ke vonisnya. Interpretasi: diagram ini adalah SOP yang bisa dieksekusi mesin — persis logika fungsi `klasifikasi` di lab. Perhatikan urutannya: pola diperiksa DULU sebelum angka, karena structuring justru bersembunyi di bawah ambang.",
        "Peringatan jujur pada diagram: ia menyederhanakan realitas — di operasional nyata ada puluhan red flag perilaku (frekuensi, jam transaksi, riwayat pelanggan) yang tidak muat di diagram ini. Gunakan sebagai kerangka awal, bukan pengganti analisis.",
      ],
      figure: {
        svg: ALUR_SVG,
        alt: "Diagram alur: tiga pertanyaan klasifikasi menuju empat vonis.",
        caption: "Alur klasifikasi kepatuhan (ilustrasi pola). Pola diperiksa sebelum angka.",
      },
      tasks: [],
      reference: "Visual: pola dulu, angka kemudian. Diagram = SOP yang bisa dieksekusi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta Keputusan",
      title: "Peta keputusan: lapor, tahan, atau boleh?",
      prose: [
        "Skenario 1 — Penarikan Rp600 juta ke rekening sendiri yang terverifikasi: WAJIB LAPOR (nilai ≥ parameter) — tetapi tidak perlu ditahan; ini transaksi besar yang wajar, kewajibanmu hanya melaporkannya.",
        "Skenario 2 — Tiga penarikan Rp480–495 juta dalam 40 menit: TAHAN & ESKALASI — polanya (bukan angkanya) yang mencurigakan. Jangan “meloloskan karena di bawah ambang” — itu tepat yang diharapkan pelaku.",
        "Skenario 3 — Transfer Rp700 juta ke wallet tanpa host: WAJIB LAPOR + LENGKAPI DATA PENGIRIM (Travel Rule) — dananya boleh jalan setelah data lengkap; yang tidak boleh adalah transfer buta data.",
        "Skenario 4 — Order Rp50 juta internal: BOLEH — di bawah parameter, tanpa pola, tanpa pihak ketiga. Jangan membanjiri PPATK dengan laporan noise; kualitas laporan > kuantitas.",
        "Aturan 10 detik: pola dulu, angka kemudian; bila ragu antara “boleh” dan “lapor” — LAPOR (kelebihan laporan bisa dijelaskan, kekurangan laporan = temuan); dokumentasikan ALASAN setiap vonis.",
      ],
      tasks: [],
      reference: "Pola > angka. Ragu → lapor. Dokumentasikan alasan vonis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tamu dari pemeriksa",
      prose: [
        "Enam bulan setelah kasus Ratna, tim pemeriksa datang untuk audit kepatuhan tahunan. Mereka meminta tiga hal: (1) daftar seluruh transaksi yang ditahan tahun ini beserta alasannya; (2) bukti bahwa data Travel Rule untuk transfer besar ke pihak ketiga lengkap; (3) catatan pelatihan karyawan tentang red flag. Exchange tetangga — yang SOP-nya “hanya lapor di atas ambang” — mendapat 7 temuan; exchange Ratna: nihil.",
        "Yang diperiksa bukan cuma angka — melainkan SISTEM: apakah aturan klasifikasi tertulis dan dieksekusi konsisten (seperti fungsi di lab)? apakah setiap vonis “tahan” punya dokumentasi alasan? apakah parameter internal ditinjau berkala (bukan angka mati selamanya)? Pemeriksa yang baik menguji SISTEMMU dengan kasus uji, bukan mempercayai klaimmu.",
        "Pelajaran mini-case: kepatuhan yang baik itu MEMBOSANKAN — SOP tertulis, eksekusi konsisten, dokumentasi lengkap, parameter ditinjau. Tidak ada heroik dadakan. Ratna tidak “menyelamatkan” exchange dengan kecerdasan sesaat; ia membangun mesin yang bekerja bahkan saat ia cuti.",
      ],
      tasks: [],
      reference: "Pemeriksa menguji sistem, bukan klaim. Kepatuhan = SOP + konsistensi + dokumentasi + tinjauan berkala.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Arsitektur: OJK = perizinan & pengawasan usaha; PPATK = intelijen transaksi lintas institusi — keduanya wajib dilayani exchange.",
        "Tiga pilar exchange: KYC berkelanjutan, pemisahan aset pelanggan, pelaporan + pencatatan + penanggung jawab.",
        "Pelaporan PPATK via goAML: tandai → analisis → lapor; tiga keranjang (tunai, transfer dana, mencurigakan) — yang terakhir berbasis penilaian, bukan angka.",
        "Travel Rule: data pengirim + penerima wajib menyertai transfer antar institusi; transfer tanpa data = transfer yang belum selesai.",
        "Klasifikasi: pola structuring diperiksa SEBELUM angka; ragu → lapor; setiap vonis didokumentasikan alasannya.",
        "Detail angka ambang & peraturan spesifik selalu diverifikasi ke sumber resmi terbaru — lesson ini memberi kerangka, bukan angka mati.",
      ],
      quiz: [
        {
          q: "Apa pelajaran utama dari kasus tiga penarikan Ratna (Rp480/490/495 juta)?",
          options: [
            { text: "Ambang pelaporan harus diturunkan agar kasus seperti ini tertangkap", why: "Salah: menurunkan ambang hanya menggeser garis — pelaku akan memecah lebih kecil lagi. Masalahnya bukan posisi garisnya." },
            { text: "SOP berbasis ambang angka saja menciptakan cetak biru penghindaran; yang menyelamatkan adalah analisis POLA", why: "Benar: ketiganya “lolos” aturan ambang tetapi polanya (tiga penarikan menempel di bawah angka bulat dalam 40 menit) berteriak structuring. Regulasi dipatuhi dengan memahami perilaku, bukan menghafal angka.", correct: true },
            { text: "Transaksi di bawah ambang tidak perlu diperhatikan sama sekali", why: "Salah: justru kebalikannya — kasus ini membuktikan transaksi di bawah ambang BISA menjadi yang paling penting." },
            { text: "Ratna seharusnya langsung membekukan permanen tanpa eskalasi", why: "Salah: vonisnya “tahan & eskalasi” — pembekuan permanen butuh proses dan dasar yang lebih kuat." },
          ],
        },
        {
          q: "Apa perbedaan peran OJK dan PPATK terhadap exchange kripto?",
          options: [
            { text: "OJK mengawasi transaksi harian, PPATK memberi izin usaha", why: "Salah: terbalik. OJK = perizinan & pengawasan perilaku usaha; PPATK = intelijen atas laporan transaksi." },
            { text: "OJK: pemberi izin & pengawas usaha; PPATK: penerima & penganalisis laporan transaksi lintas institusi", why: "Benar: analogi bandara — OJK memastikan maskapai layak terbang, PPATK memantau penumpang mencurigakan lintas maskapai.", correct: true },
            { text: "Keduanya melakukan hal yang sama sehingga cukup melapor ke salah satu", why: "Salah: fungsinya berbeda dan tidak saling menggantikan — exchange wajib melayani keduanya." },
            { text: "PPATK hanya mengawasi bank, tidak ada hubungannya dengan kripto", why: "Salah: exchange termasuk pihak pelapor — justru itu alasan lesson ini ada." },
          ],
        },
        {
          q: "Mengapa laporan transaksi mencurigakan BUKAN vonis bersalah terhadap pelanggan?",
          options: [
            { text: "Karena analis exchange tidak punya wewenang menghakimi — ia menyampaikan informasi untuk dianalisis PPATK & penegak hukum", why: "Benar: peran analis = saksi yang wajib bicara, bukan hakim. Tidak melapor karena “kasihan” justru melanggar kewajiban.", correct: true },
            { text: "Karena laporannya tidak dibaca siapa pun", why: "Salah: laporan dibaca dan dianalisis PPATK — bahkan bisa menjadi kepingan puzzle kasus besar lintas institusi." },
            { text: "Karena semua transaksi mencurigakan ternyata tidak bersalah", why: "Salah: generalisasi berbahaya — sebagian memang indikasi kejahatan nyata. Ketidakpastian inilah alasan ada proses analisis lanjutan." },
            { text: "Karena pelanggan bisa menggugat bila dilaporkan", why: "Salah: kerangka pelaporan melindungi pelapor yang beritikad baik; yang berisiko hukum justru TIDAK melapor." },
          ],
        },
        {
          q: "Transfer Rp700 juta ke wallet tanpa host (bukan milik institusi). Kewajiban exchange menurut Travel Rule?",
          options: [
            { text: "Tolak transfernya — wallet tanpa host selalu dilarang", why: "Salah: tidak ada larangan mutlak; yang wajib adalah kelengkapan DATA yang menyertainya." },
            { text: "Wajib lapor + pastikan data pengirim/penerima yang dipersyaratkan lengkap menyertai transfer", why: "Benar: seperti T5 di lab — dana boleh bergerak setelah datanya lengkap. “Transfer valid = dana + data.”", correct: true },
            { text: "Tidak ada kewajiban karena di luar sistem perbankan", why: "Salah: kewajiban menempel pada INSTITUSI berizin yang terlibat, bukan pada rel teknologinya." },
            { text: "Cukup catat internal tanpa melapor", why: "Salah: untuk nilai sebesar ini ke pihak ketiga, pencatatan internal saja tidak memenuhi kewajiban pelaporan." },
          ],
        },
        {
          q: "Pemeriksa menemukan SOP klasifikasi tertulis tetapi parameter internal tidak pernah ditinjau 3 tahun. Temuannya?",
          options: [
            { text: "Tidak ada temuan — yang penting SOP-nya ada", why: "Salah: SOP mati = sistem mati. Pola pelaku berevolusi; parameter yang tidak ditinjau menjadi pajangan." },
            { text: "Temuan: sistem tidak efektif — parameter & aturan harus ditinjau berkala agar tetap relevan dengan pola terkini", why: "Benar: pemeriksa menguji SISTEM dengan kasus uji. Aturan klasifikasi yang tidak pernah dikalibrasi ulang tidak bisa diandalkan mendeteksi pola baru.", correct: true },
            { text: "Temuan ringan — cukup tandatangani ulang SOP-nya", why: "Salah: tanda tangan ulang tanpa tinjauan substansi = formalitas kosong yang justru memperburuk temuan." },
            { text: "Bukan urusan pemeriksa — itu keputusan bisnis internal", why: "Salah: efektivitas sistem kepatuhan adalah inti pemeriksaan — parameter yang usang = sistem yang tidak bekerja." },
          ],
        },
      ],
      next: {
        label: "BCD26 — MEV Lanjutan: Sandwich, Arbitrase & Ekstraksi Nilai",
        href: "/v2/learn/bcd26-mev-lanjutan",
      },
    },
  ],
};
