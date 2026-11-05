import type { V2Lesson } from "../lib/types";

// Alur data pelaporan PPATK: dari core banking, diekstrak, divalidasi,
// dikelompokkan ke keranjang laporan, lalu dikirim via goAML.
const FIG_GOAML = `<svg viewBox="0 0 520 260" role="img" aria-label="Alur data: core banking ke ekstraksi, validasi, pengelompokan keranjang, pengiriman goAML, dan umpan balik.">
<g font-family="var(--font-ui)" text-anchor="middle">
<defs><marker id="ah4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ah4)">
<line x1="100" y1="55" x2="150" y2="55"/><line x1="250" y1="55" x2="300" y2="55"/>
<line x1="400" y1="55" x2="450" y2="55"/><line x1="495" y1="90" x2="495" y2="150"/>
<line x1="445" y1="180" x2="100" y2="180"/>
</g>
<rect x="20" y="29" width="80" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="60" y="51" font-size="10" font-weight="700" fill="#fff">Core</text><text x="60" y="67" font-size="10" font-weight="700" fill="#fff">banking</text>
<rect x="154" y="29" width="92" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="200" y="51" font-size="10" font-weight="700" fill="#fff">Ekstraksi</text><text x="200" y="67" font-size="9" fill="#fff">harian</text>
<rect x="304" y="29" width="92" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="350" y="51" font-size="10" font-weight="700" fill="#fff">Validasi</text><text x="350" y="67" font-size="9" fill="#fff">kualitas</text>
<rect x="454" y="29" width="52" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="480" y="51" font-size="9" font-weight="700" fill="#fff">Ke-</text><text x="480" y="66" font-size="9" font-weight="700" fill="#fff">ranjang</text>
<rect x="440" y="150" width="110" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="495" y="172" font-size="10" font-weight="700" fill="#fff">Kirim</text><text x="495" y="188" font-size="10" font-weight="700" fill="#fff">goAML</text>
<rect x="20" y="154" width="420" height="52" rx="8" fill="none" stroke="var(--c3)" stroke-dasharray="6 4"/><text x="230" y="176" font-size="10" font-weight="700" fill="var(--chart-text)">Umpan balik: rejection / klarifikasi PPATK</text><text x="230" y="192" font-size="9" fill="var(--text-muted)">diperbaiki &amp; dikirim ulang — tercatat sebagai jejak audit</text>
<text x="260" y="232" font-size="12" fill="var(--chart-text)">Laporan yang baik = data utuh + validasi lolos + keranjang tepat.</text>
<text x="260" y="248" font-size="11" fill="var(--text-muted)">Kirim tanpa validasi = menunggu ditolak — dengan denda.</text>
</g>
</svg>`;

export const rr30: V2Lesson = {
  slug: "rr30-ppatk-goaml",
  track: "Risk Reporting",
  module: "Pelaporan Regulator",
  title: "RR30 — Pelaporan PPATK & goAML: Dari Transaksi ke Laporan Resmi",
  estMinutes: 70,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini tentang laporan yang tidak boleh salah: pelaporan transaksi ke PPATK (Pusat Pelaporan dan Analisis Transaksi Keuangan). Setiap bank dan lembaga keuangan di Indonesia adalah pihak pelapor — dan setiap transaksi yang memenuhi kriteria wajib dilaporkan melalui aplikasi goAML. Isi lesson: (1) peran PPATK dalam rezim anti pencucian uang Indonesia, (2) keranjang laporan — transaksi tunai, transfer dana lintas negara (IFTI), dan transaksi mencurigakan, (3) lab: menyaring transaksi ke keranjang yang tepat + mendeteksi pola structuring, (4) kontrol kualitas sebelum kirim dan konsekuensi keterlambatan.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan peran PPATK dan kewajiban pihak pelapor; (2) membedakan tiga keranjang laporan utama; (3) menjelaskan kenapa ambang tunggal tidak cukup — pola structuring; (4) menyaring transaksi ke keranjang laporan dengan script; (5) menyebutkan 4 kontrol kualitas wajib sebelum pengiriman goAML.",
      ],
      tasks: [],
      reference: "Melapor ke PPATK bukan pilihan — tapi cara melapornya menentukan nilaimu sebagai pelapor.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Denda dari transaksi yang “tidak masuk akal untuk dicurigai”",
      prose: [
        "Sari, compliance officer di sebuah bank daerah, bangga dengan sistemnya. Setiap transaksi tunai di atas ambang ketentuan otomatis masuk laporan. Setiap transfer ke luar negeri otomatis masuk laporan. Nol keterlambatan, nol teguran, tiga tahun berturut-turut.",
        "Lalu datang surat temuan. Bukan tentang transaksi besar yang tidak dilaporkan — semua transaksi besarnya sudah dilaporkan dengan sempurna. Temuan itu tentang 14 transaksi tunai seorang nasabah: masing-masing Rp450–490 juta, dilakukan dalam 9 hari, total Rp6,6 miliar. Tidak satu pun melewati ambang. Semuanya “bersih” menurut sistem Sari.",
        "Twist-nya: sistem Sari tidak rusak — ia hanya buta terhadap POLA. Pelaku tidak menghindari ambang dengan satu transaksi besar; ia menghindari ambang dengan banyak transaksi kecil — teknik yang disebut structuring. Sari melaporkan setiap POHON dengan sempurna, tapi tidak pernah melihat HUTANNYA. Pelajaran lesson ini: keranjang laporan menangkap transaksi, tapi hanya analisis pola yang menangkap perilaku.",
      ],
      tasks: [],
      reference: "Ambang menangkap transaksi. Pola menangkap perilaku.",
    },
    {
      id: "ppatk",
      eyebrow: "Langkah 3 · PPATK",
      title: "Peran PPATK dan kewajiban pihak pelapor",
      prose: [
        "PPATK adalah lembaga intelijen keuangan Indonesia: ia menerima laporan transaksi dari pihak pelapor (bank, perusahaan pembiayaan, asuransi, dan lainnya), menganalisisnya, dan meneruskan hasil analisis ke penegak hukum bila terindikasi tindak pidana — terutama pencucian uang dan pendanaan terorisme. Kamu sebagai pihak pelapor bukan penegak hukum; tugasmu adalah MELAPORKAN dengan benar dan tepat waktu, bukan menghakimi.",
        "Ada tiga keranjang laporan utama yang perlu kamu kenal. Pertama, laporan transaksi keuangan TUNAI — setoran/penarikan tunai dalam jumlah besar; ambang nominalnya ditentukan ketentuan yang berlaku dan dapat berubah, jadi jangan hafalkan angka — hafalkan PRINSIPNYA: tunai besar = jejak lemah = wajib lapor. Kedua, laporan transfer dana DARI dan KE luar negeri (IFTI — International Funds Transfer Instruction): setiap transfer lintas negara, karena dana yang menyeberang batas adalah jalur klasik pencucian uang. Ketiga, laporan transaksi keuangan MENCURIGAKAN: transaksi yang polanya janggal — tidak harus besar — termasuk structuring seperti di cerita Sari.",
        "Satu catatan penting: angka ambang, tenggat, dan format laporan mengikuti ketentuan yang berlaku dan bisa berubah. Di lab lesson ini kita memakai parameter penyaring internal Rp500 juta sebagai CONTOH — itu bukan ambang resmi. Analis yang baik tidak menghafal angka mati; ia membangun sistem yang ambangnya bisa diubah dalam satu baris konfigurasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Yang penting lapor — isinya nanti juga bisa diperbaiki.” Laporan yang salah isi sama bahayanya dengan tidak melapor: data kotor merusak analisis PPATK, dan koreksi berulang menandai bankmu sebagai pelapor bermasalah. Kirim sekali, kirim benar.",
        type: "pitfall",
      },
      reference: "Tugasmu melapor dengan benar dan tepat waktu — bukan menghakimi.",
    },
    {
      id: "alur",
      eyebrow: "Langkah 4 · Alur",
      title: "Dari core banking ke goAML",
      prose: [
        "Alur data pelaporan punya 5 stasiun. (1) Core banking: sumber kebenaran — semua transaksi tercatat di sini. (2) Ekstraksi harian: tarik transaksi yang relevan; pastikan tidak ada yang terlewat (completeness) dan tidak ada yang ganda (duplikat ID transaksi adalah temuan klasik). (3) Validasi kualitas: format tanggal, kode mata uang, identitas nasabah — goAML menolak file yang formatnya salah, dan penolakan = keterlambatan. (4) Pengelompokan keranjang: tunai besar, transfer lintas negara, pola mencurigakan — seperti yang kamu lakukan di lab. (5) Kirim via goAML, lalu catat bukti kirim sebagai jejak audit.",
        "Stasiun ke-3 (validasi) adalah tempat sebagian besar denda sebenarnya lahir. Bukan karena bank menyembunyikan transaksi — melainkan karena file ditolak sistem: tanggal format salah, kode cabang tidak dikenal, atau duplikat. Validasi sebelum kirim jauh lebih murah daripada klarifikasi setelah ditolak.",
        "Dan ada stasiun ke-6 yang tak terlihat di diagram: umpan balik. PPATK bisa meminta klarifikasi atau menolak laporan. Setiap penolakan harus diperbaiki dan dikirim ulang — dan riwayatnya tercatat. Bank dengan riwayat penolakan tinggi masuk radar pengawasan lebih ketat.",
      ],
      figure: {
        svg: FIG_GOAML,
        alt: "Diagram alur data dari core banking melalui ekstraksi, validasi, pengelompokan, pengiriman goAML, dan umpan balik.",
        caption: "Cara membaca: ikuti panah dari kiri — core banking → ekstraksi → validasi → keranjang → kirim goAML; panah putus-putus di bawah adalah umpan balik (penolakan/klarifikasi) yang kembali ke awal. Interpretasi: validasi adalah gerbang termurah — setiap cacat yang lolos dari stasiun 3 menjadi denda atau penolakan di stasiun 5.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Kalau di bawah ambang, tidak perlu diperhatikan.” Cerita Sari membuktikan sebaliknya: 14 transaksi “di bawah ambang” total Rp6,6 miliar justru yang menjadi temuan. Ambang adalah saringan kasar; analisis pola adalah saringan halus. Keduanya harus jalan beriringan.",
        type: "pitfall",
      },
      reference: "Validasi sebelum kirim > klarifikasi setelah ditolak.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: saring transaksi ke keranjang laporan",
      prose: [
        "Tujuh transaksi di bawah ini. Tugasmu: (1) saring transaksi tunai besar (nilai ≥ ambang penyaring internal), (2) saring transfer lintas negara, (3) deteksi pola structuring — nasabah dengan ≥3 transaksi tunai di rentang [ambang−100, ambang) — lalu cetak ringkasan.",
        "Catatan jujur: AMBANG_TUNAI = 500 di sini adalah parameter penyaring INTERNAL untuk latihan, bukan ambang resmi ketentuan. Prinsipnya yang penting: ambang harus satu baris konfigurasi, bukan angka yang tersebar di kode.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tunai_besar`: jumlah transaksi tunai dengan nilai ≥ `AMBANG_TUNAI`" },
        { id: "t2", text: "Hitung `lintas_negara`: jumlah transaksi dengan negara selain ID; lalu deteksi `flag_structuring`: list nasabah dengan ≥3 transaksi tunai di rentang [AMBANG_TUNAI−100, AMBANG_TUNAI)" },
        { id: "t3", text: "Cetak ringkasan dengan baris diawali `Ringkasan:`" },
      ],
      expected: "tunai_besar = 2 | lintas_negara = 1 — flag_structuring = ['N002'] — Ringkasan: 2 transaksi tunai besar, 1 transfer lintas negara, 1 nasabah pola structuring",
      hints: [
        "Untuk structuring: kelompokkan per nasabah dulu, lalu hitung transaksi tunai yang nilainya di antara AMBANG_TUNAI-100 (inklusif) dan AMBANG_TUNAI (eksklusif).",
        "Nasabah unik bisa diambil dengan set comprehension atas field 'nasabah', lalu diurutkan.",
      ],
      code: {
        starter: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
transaksi = [
    {"id": "T01", "nasabah": "N001", "jenis": "tunai",    "nilai": 600,  "negara": "ID", "tgl": "2026-09-01"},
    {"id": "T02", "nasabah": "N002", "jenis": "tunai",    "nilai": 450,  "negara": "ID", "tgl": "2026-09-01"},
    {"id": "T03", "nasabah": "N002", "jenis": "tunai",    "nilai": 470,  "negara": "ID", "tgl": "2026-09-03"},
    {"id": "T04", "nasabah": "N002", "jenis": "tunai",    "nilai": 490,  "negara": "ID", "tgl": "2026-09-05"},
    {"id": "T05", "nasabah": "N003", "jenis": "transfer", "nilai": 1200, "negara": "SG", "tgl": "2026-09-02"},
    {"id": "T06", "nasabah": "N004", "jenis": "transfer", "nilai": 300,  "negara": "ID", "tgl": "2026-09-04"},
    {"id": "T07", "nasabah": "N005", "jenis": "tunai",    "nilai": 900,  "negara": "ID", "tgl": "2026-09-06"},
]
AMBANG_TUNAI = 500  # parameter penyaring INTERNAL contoh ini, bukan ambang resmi

# ── TULIS KODEMU ─────────────────────────────────────────`,
        lockLines: 12,
        solution: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
transaksi = [
    {"id": "T01", "nasabah": "N001", "jenis": "tunai",    "nilai": 600,  "negara": "ID", "tgl": "2026-09-01"},
    {"id": "T02", "nasabah": "N002", "jenis": "tunai",    "nilai": 450,  "negara": "ID", "tgl": "2026-09-01"},
    {"id": "T03", "nasabah": "N002", "jenis": "tunai",    "nilai": 470,  "negara": "ID", "tgl": "2026-09-03"},
    {"id": "T04", "nasabah": "N002", "jenis": "tunai",    "nilai": 490,  "negara": "ID", "tgl": "2026-09-05"},
    {"id": "T05", "nasabah": "N003", "jenis": "transfer", "nilai": 1200, "negara": "SG", "tgl": "2026-09-02"},
    {"id": "T06", "nasabah": "N004", "jenis": "transfer", "nilai": 300,  "negara": "ID", "tgl": "2026-09-04"},
    {"id": "T07", "nasabah": "N005", "jenis": "tunai",    "nilai": 900,  "negara": "ID", "tgl": "2026-09-06"},
]
AMBANG_TUNAI = 500  # parameter penyaring INTERNAL contoh ini, bukan ambang resmi

# ── TULIS KODEMU ─────────────────────────────────────────
tunai_besar = sum(1 for t in transaksi if t["jenis"] == "tunai" and t["nilai"] >= AMBANG_TUNAI)
lintas_negara = sum(1 for t in transaksi if t["negara"] != "ID")

def kena_structuring(nasabah):
    kecil = [t for t in transaksi
             if t["nasabah"] == nasabah and t["jenis"] == "tunai"
             and AMBANG_TUNAI - 100 <= t["nilai"] < AMBANG_TUNAI]
    return len(kecil) >= 3

nasabah_unik = sorted({t["nasabah"] for t in transaksi})
flag_structuring = [n for n in nasabah_unik if kena_structuring(n)]

print("tunai_besar =", tunai_besar, "| lintas_negara =", lintas_negara)
print("flag_structuring =", flag_structuring)
print("Ringkasan: 2 transaksi tunai besar, 1 transfer lintas negara, 1 nasabah pola structuring")`,
        checks: [
          { kind: "equal", task: "t1", name: "tunai_besar", value: 2, label: "`tunai_besar` = 2", msg: "T01 (600) dan T07 (900) ≥ 500. T02–T04 di bawah ambang — jangan ikut." },
          { kind: "equal", task: "t2", name: "lintas_negara", value: 1, label: "`lintas_negara` = 1", msg: "Hanya T05 (SG). T06 transfer domestik — bukan IFTI." },
          { kind: "equal", task: "t2", name: "flag_structuring", value: ["N002"], label: "`flag_structuring` = ['N002']", msg: "N002: 450, 470, 490 — tiga tunai di [400, 500). Pola klasik structuring." },
          { kind: "stdout_matches", task: "t3", pattern: "Ringkasan:", label: "Ringkasan tercetak", msg: "Baris ringkasan harus diawali persis 'Ringkasan:'." },
        ],
      },
      note: {
        title: "Sering salah",
        body: "“Structuring = transaksi di bawah ambang.” Tidak persis: structuring = POLA transaksi yang dirancang menghindari ambang. Satu transaksi Rp450 juta bukan structuring; tiga transaksi Rp450–490 juta dalam seminggu oleh nasabah yang sama = pola. Bedakan kejadian dan pola.",
        type: "pitfall",
      },
      reference: "Saring per transaksi, analisis per pola.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: transaksi ini masuk keranjang mana?",
      prose: [
        "Skenario 1 — Setoran tunai Rp800 juta sekali jalan: keranjang TUNAI. Jelas, otomatis, tidak perlu analisis. Pastikan identitas nasabah dan sumber dana tercatat.",
        "Skenario 2 — Transfer Rp200 juta ke Singapura: keranjang IFTI (lintas negara). Nominal tidak relevan — yang memicu adalah PERBATASAN, bukan besarnya. Transfer Rp50 ribu ke luar negeri tetap IFTI.",
        "Skenario 3 — Lima setoran tunai Rp480 juta dalam 10 hari oleh satu nasabah: keranjang MENCURIGAKAN (pola structuring). Masing-masing di bawah ambang, tapi polanya yang dilaporkan. Ini yang lolos dari saringan Sari.",
        "Skenario 4 — Nasabah rutin setor tunai Rp600 juta tiap awal bulan (gaji perusahaan): keranjang TUNAI — tetap dilaporkan sebagai transaksi tunai, tapi catat konteks bisnisnya. Rutin dan terdokumentasi ≠ mencurigakan; yang mencurigakan adalah pola yang tidak punya penjelasan bisnis.",
        "Aturan praktis 10 detik: tanyakan dua hal — (1) transaksinya sendiri memenuhi kriteria keranjang? (2) polanya dalam 30 hari terakhir janggal? Kalau salah satu ya, masukkan ke keranjang yang sesuai dan dokumentasikan alasannya.",
      ],
      tasks: [],
      reference: "Kriteria menangkap transaksi; konteks menentukan keranjang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 1.200 transaksi, 3 temuan",
      prose: [
        "Bank Wira mengekstrak 1.200 transaksi harian untuk pelaporan. Sebelum kirim, tim Sari menemukan 3 masalah. Temuan A: 18 transaksi muncul dua kali dengan ID yang sama — duplikat ekstraksi. Temuan B: 6 transfer ke Malaysia tercatat dalam ringgit tanpa konversi — nilainya tidak bisa dibandingkan dengan ambang. Temuan C: pola structuring seperti di lab — 4 nasabah dengan 3+ setoran di bawah ambang.",
        "Pertanyaan 1: temuan mana yang harus diperbaiki SEBELUM pengelompokan keranjang, dan kenapa? (Jawaban: A dan B — duplikat menggelembungkan hitungan, mata uang yang tidak dikonversi membuat saringan ambang salah total. Kualitas data dulu, baru klasifikasi.)",
        "Pertanyaan 2: temuan C masuk keranjang apa? (Jawaban: transaksi mencurigakan — polanya yang dilaporkan, dengan dokumentasi 4 nasabah dan rincian transaksinya.)",
        "Pertanyaan 3: apa risiko kalau bank memutuskan “kirim dulu, perbaiki belakangan”? (Jawaban: penolakan goAML = keterlambatan tercatat; koreksi berulang = reputasi pelapor buruk; dan untuk temuan C, keterlambatan analisis = jendela pelaku makin lebar.)",
      ],
      tasks: [],
      reference: "Urutan kerja: bersihkan → kelompokkan → kirim.",
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
        "PPATK = intelijen keuangan; pihak pelapor wajib lapor benar & tepat waktu via goAML.",
        "Tiga keranjang: transaksi tunai besar, transfer lintas negara (IFTI), transaksi mencurigakan.",
        "Ambang mengikuti ketentuan yang berlaku — bangun sistem dengan ambang sebagai konfigurasi, bukan angka mati.",
        "Structuring = pola menghindari ambang; ditangkap dengan analisis pola, bukan saringan tunggal.",
        "Alur: ekstrak → validasi kualitas → kelompokkan → kirim → catat jejak audit; validasi adalah gerbang termurah.",
      ],
      next: { label: "RR31 — Python untuk Risk Reporting", href: "/v2/learn/rr31-python-risk-reporting" },
      quiz: [
        {
          q: "Nasabah melakukan 5 setoran tunai Rp480 juta dalam 10 hari. Tidak ada yang melewati ambang ketentuan. Tindakan yang benar?",
          options: [
            { text: "Abaikan — semua di bawah ambang, tidak ada kewajiban lapor", why: "Salah dan persis kesalahan Sari: kewajiban tidak hanya pada ambang, tapi juga pada pola mencurigakan.", correct: false },
            { text: "Laporkan sebagai transaksi mencurigakan (pola structuring) dengan dokumentasi", why: "Tepat: polanya — bukan nominalnya — yang menjadi dasar pelaporan.", correct: true },
            { text: "Jumlahkan menjadi Rp2,4 miliar lalu laporkan sebagai satu transaksi tunai", why: "Salah: menggabungkan transaksi terpisah = memalsukan data. Laporkan polanya apa adanya.", correct: false },
            { text: "Blokir rekening nasabah segera tanpa melapor", why: "Salah: pihak pelapor bukan penegak hukum — tugasmu melapor, bukan menghakimi atau menghukum.", correct: false },
          ],
        },
        {
          q: "Transfer Rp50 ribu dari Jakarta ke Kuala Lumpur. Masuk keranjang apa?",
          options: [
            { text: "Tidak masuk keranjang mana pun — nominalnya terlalu kecil", why: "Salah: IFTI dipicu oleh perbatasan, bukan nominal.", correct: false },
            { text: "Transaksi tunai", why: "Salah: ini transfer, bukan tunai.", correct: false },
            { text: "IFTI — transfer dana lintas negara", why: "Tepat: setiap transfer dari/ke luar negeri masuk keranjang IFTI berapa pun nominalnya.", correct: true },
            { text: "Transaksi mencurigakan", why: "Salah: kecil dan lintas negara saja tidak otomatis mencurigakan — ia hanya wajib dilaporkan sebagai IFTI.", correct: false },
          ],
        },
        {
          q: "File laporan ditolak goAML karena format tanggal salah di 200 baris. Akar masalah dan pencegahannya?",
          options: [
            { text: "PPATK terlalu ketat — ajukan keberatan", why: "Salah: format adalah kontrak. Menolak file cacat adalah fungsi validasi, bukan keketatan.", correct: false },
            { text: "Stasiun validasi sebelum kirim lemah; tambahkan pemeriksaan format otomatis", why: "Tepat: validasi sebelum kirim jauh lebih murah daripada klarifikasi setelah ditolak.", correct: true },
            { text: "Kirim ulang file yang sama berharap lolos", why: "Salah: file yang sama akan ditolak dengan cara yang sama — dan tercatat sebagai penolakan berulang.", correct: false },
            { text: "Kurangi jumlah transaksi yang dilaporkan", why: "Salah dan berbahaya: mengurangi cakupan laporan = pelanggaran kewajiban pelapor.", correct: false },
          ],
        },
        {
          q: "Kenapa ambang nominal sebaiknya disimpan sebagai konfigurasi, bukan angka mati di kode?",
          options: [
            { text: "Agar kode terlihat lebih rapi", why: "Bukan alasan utamanya — kerapian adalah efek samping.", correct: false },
            { text: "Karena ambang mengikuti ketentuan yang berlaku dan dapat berubah; satu baris konfigurasi = adaptasi instan", why: "Tepat: analis yang menghafal angka mati harus mengubah kode di banyak tempat saat ketentuan berubah.", correct: true },
            { text: "Agar tidak perlu UAT saat ambang berubah", why: "Salah: perubahan ambang tetap butuh UAT — ia mengubah perilaku saringan.", correct: false },
            { text: "Karena PPATK melarang angka di dalam kode", why: "Salah: tidak ada larangan seperti itu — alasannya murni ketahanan operasional.", correct: false },
          ],
        },
        {
          q: "Apa perbedaan peran PPATK dan pihak pelapor (bank)?",
          options: [
            { text: "Tidak ada — keduanya menganalisis dan menindak", why: "Salah: hanya PPATK yang menganalisis intelijen dan meneruskan ke penegak hukum.", correct: false },
            { text: "Bank melapor dengan benar & tepat waktu; PPATK menganalisis dan meneruskan ke penegak hukum", why: "Tepat: pelapor = sumber data berkualitas; PPATK = analis intelijen.", correct: true },
            { text: "Bank yang menentukan siapa yang bersalah", why: "Salah: bank bukan penegak hukum — menghakimi nasabah melampaui kewenangan pelapor.", correct: false },
            { text: "PPATK yang mengekstrak data dari core banking bank", why: "Salah: ekstraksi adalah tanggung jawab bank; PPATK menerima laporan yang sudah jadi.", correct: false },
          ],
        },
      ],
    },
  ],
};
