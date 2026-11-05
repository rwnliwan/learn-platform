import type { V2Lesson } from "../lib/types";

// ── Figure: arsitektur semantic layer ────────────────────────────────────
const ARSITEKTUR_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Diagram arsitektur semantic layer: banyak tool BI membaca satu definisi metrik">
<g font-size="12" font-family="var(--font-ui)">
<rect x="30" y="30" width="130" height="44" rx="8" fill="var(--chart-text)" opacity="0.35"/>
<text x="95" y="48" text-anchor="middle" fill="var(--text)">Warehouse</text>
<text x="95" y="64" text-anchor="middle" font-size="10" fill="var(--text-muted)">tabel mentah</text>
<rect x="30" y="110" width="130" height="44" rx="8" fill="var(--chart-text)" opacity="0.35"/>
<text x="95" y="128" text-anchor="middle" fill="var(--text)">dbt models</text>
<text x="95" y="144" text-anchor="middle" font-size="10" fill="var(--text-muted)">tabel bersih</text>
<rect x="195" y="60" width="150" height="90" rx="10" fill="var(--c1)" opacity="0.9"/>
<text x="270" y="84" text-anchor="middle" font-weight="700" fill="#fff">SEMANTIC LAYER</text>
<text x="270" y="102" text-anchor="middle" font-size="10" fill="#fff">satu definisi metrik</text>
<text x="270" y="118" text-anchor="middle" font-size="10" fill="#fff">revenue, NPL, churn…</text>
<text x="270" y="134" text-anchor="middle" font-size="10" fill="#fff">versioned di Git</text>
<rect x="380" y="20" width="110" height="40" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="435" y="44" text-anchor="middle" fill="#fff">Tableau</text>
<rect x="380" y="72" width="110" height="40" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="435" y="96" text-anchor="middle" fill="#fff">Power BI</text>
<rect x="380" y="124" width="110" height="40" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="435" y="148" text-anchor="middle" fill="#fff">Looker</text>
<rect x="380" y="176" width="110" height="40" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="435" y="200" text-anchor="middle" fill="#fff">Notebook/API</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.5" opacity="0.7">
<line x1="160" y1="52" x2="195" y2="85"/><line x1="160" y1="132" x2="195" y2="115"/>
<line x1="345" y1="90" x2="380" y2="40"/><line x1="345" y1="100" x2="380" y2="92"/>
<line x1="345" y1="112" x2="380" y2="144"/><line x1="345" y1="122" x2="380" y2="196"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="30" y="200">tanpa layer ini: tiap tool mendefinisikan ulang metriknya sendiri</text>
<text x="30" y="218">dengan layer ini: definisi ditulis sekali, dipakai semua tool</text>
<text x="30" y="252">contoh implementasi: dbt Semantic Layer, LookML, Cube</text>
</g>
</svg>`;

const LAB_SETUP = `KAMUS_METRIK = {
    # Definisi resmi — SATU-SATUNYA tempat definisi boleh berubah.
    # Semua "tool" di bawah membaca dari sini.
    "revenue": {
        "deskripsi": "Total nilai transaksi LUNAS (harga * qty)",
        "filter": lambda t: t["status"] == "lunas",
        "agregasi": lambda rows: sum(t["harga"] * t["qty"] for t in rows),
    },
    "npl_rate": {
        "deskripsi": "Proporsi pinjaman dengan dpd > 90 hari",
        "filter": lambda t: True,
        "agregasi": lambda rows: sum(1 for t in rows if t["dpd"] > 90) / len(rows),
    },
}

transaksi = [
    {"harga": 2000000, "qty": 1, "status": "lunas",   "dpd": 0},
    {"harga": 2000000, "qty": 2, "status": "lunas",   "dpd": 95},
    {"harga": 2000000, "qty": 1, "status": "pending", "dpd": 0},
    {"harga": 2000000, "qty": 3, "status": "lunas",   "dpd": 5},
]
`;

export const biz20: V2Lesson = {
  slug: "biz20-semantic-layer",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "Semantic Layer: Satu Definisi Metrik untuk Semua Tool",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Perang definisi yang dimenangkan dengan satu file",
      prose: [
        "Tahun 2023, sebuah e-commerce Indonesia punya masalah klasik: tim growth melaporkan churn 4,2%, tim finance 5,8%, tim product 3,9%. Tiga angka, tiga tim, semuanya “benar” — growth menghitung churn dari pengguna aktif bulanan, finance dari pelanggan berbayar, product dari instalasi aplikasi. Setiap rapat KPI dimulai dengan 20 menit debat definisi sebelum membahas keputusan. Lalu head of data melakukan satu hal yang mengubah segalanya: ia menulis definisi churn SEKALI dalam sebuah file berversion (ala kode program), dan memaksa semua dashboard membaca dari file itu.",
        "Twist-nya: angka churn tidak menjadi “lebih akurat” — tidak ada yang berubah pada datanya. Yang berubah adalah sifat perdebatannya: dari “angka siapa yang benar?” menjadi “apakah definisinya perlu diubah?”. Dan pertanyaan kedua punya jawaban prosedural — ajukan perubahan, review, setujui, semua dashboard ikut berubah otomatis. Perusahaan itu tidak membeli tool baru sama sekali; ia membangun semantic layer — lapisan tipis berisi definisi metrik yang duduk di antara data dan semua tool BI.",
        "Lesson ini tentang tren terpanas BI 2024–2026: dbt Semantic Layer, LookML, dan Cube — tiga implementasi dari ide yang sama. Catatan kejujuran: sumber primer industri untuk tren ini belum sempat dibuka saat lesson disusun; klaim arsitekturnya diringkas dari dokumentasi publik ketiga produk tersebut, dan kamu didorong memverifikasinya sendiri. Bekal ringkas dari dua lesson prasyarat (diringkas agar mandiri): dari lesson governance metrik — metrik tanpa pemilik dan tanpa definisi tertulis akan hanyut menjadi banyak versi; dari lesson modeling — tabel fakta menyimpan kejadian, tabel dimensi menyimpan atribut, dan agregasi yang konsisten lahir dari model yang rapi. Semantic layer adalah kelanjutan logis keduanya: definisi metrik yang rapi, tertulis, dan terpusat.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini tren 2024–2026, bukan sekadar teori",
        type: "risk",
        body: "Pemicunya konkret: perusahaan kini memakai 3–5 tool BI sekaligus (Tableau untuk analis, Looker untuk eksekutif, notebook untuk data science), dan AI agents mulai bertanya langsung ke data (“berapa churn bulan ini?”). Tanpa semantic layer, tiap tool dan tiap agent mendefinisikan ulang metriknya sendiri — kekacauan definisi dikali jumlah pemakai. Layer ini adalah jawaban industrinya.",
      },
      reference: "Semantic layer = definisi metrik tertulis, terpusat, berversion — duduk di antara data dan semua tool/AI yang bertanya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita perang churn. (2) Peta ini. (3) Konsep: semantic layer — Si Penerjemah Tunggal. (4) Konsep: tiga implementasi — dbt Semantic Layer, LookML, Cube. (5) Konsep: metrik sebagai kode — versioning dan testing. (6) Lab: bangun semantic layer mini dalam Python. (7) Chart: arsitektur dengan vs tanpa layer. (8) Peta keputusan: kapan membangun, kapan belum perlu. (9) Mini-case: e-commerce menstandardisasi 40 metrik. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan apa itu semantic layer dan masalah apa yang ia selesaikan; (2) membedakan tiga implementasi populer — dbt Semantic Layer, LookML, Cube — beserta trade-off-nya; (3) menulis definisi metrik sebagai kode yang bisa di-version dan di-test; (4) memutuskan kapan perusahaan perlu membangun semantic layer dan kapan itu over-engineering.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, governance metrik: metrik butuh pemilik, definisi tertulis, dan proses perubahan — tanpa itu tiap tim menciptakan versinya sendiri. Kedua, modeling: fakta = kejadian yang dijumlahkan, dimensi = atribut pemotong; semantic layer duduk DI ATAS model ini dan memberi nama + rumus resmi untuk agregasi yang dipakai berulang. Ketiga, ide versioning dari dunia software: perubahan tercatat, bisa di-review, bisa di-rollback — semantic layer menerapkan disiplin yang sama pada definisi bisnis.",
        "Rutenya: cerita → peta → tiga konsep inti → lab → chart arsitektur → peta keputusan → mini-case → kuis. Estimasi 50 menit; lab-nya ±12 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: semantic layer menjawab pertanyaan “di mana kebenaran tinggal?” Jawaban lama: “di dashboard masing-masing” (banyak kebenaran). Jawaban baru: “di satu file berversion yang dibaca semua tool” (satu kebenaran, banyak tampilan).",
      ],
      reference: "Tujuan: konsep + 3 implementasi + metrik-sebagai-kode + keputusan bangun vs tunda. Mandiri dengan bekal diringkas.",
    },
    {
      id: "konsep-definisi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Semantic Layer — Si Penerjemah Tunggal",
      prose: [
        "Definisi: semantic layer adalah lapisan abstraksi yang memetakan tabel fisik di warehouse menjadi KONSEP BISNIS — metrik (revenue, churn, NPL), dimensi (kategori, wilayah), dan relasinya — dengan definisi tunggal yang bisa dibaca oleh tool BI, notebook, API, bahkan AI agent. Analis tidak lagi menulis SUM(CASE WHEN status='lunas'...) di tiap dashboard; mereka meminta \"revenue\" dan layer yang menerjemahkannya menjadi query yang benar.",
        "Kepribadiannya: semantic layer adalah penerjemah resmi PBB — 50 delegasi boleh bicara dalam bahasanya masing-masing (Tableau, Power BI, Python), tetapi satu penerjemah memastikan semua mendengar ARTINYA yang sama. Tanpa dia, tiap delegasi menebak-nebak arti istilah — dan “revenue” terdengar berbeda di tiap telinga. Dengan dia, perdebatan pindah ke tempat yang benar: bukan “angkamu salah”, melainkan “apakah terjemahannya perlu direvisi?” — dan revisi dilakukan sekali, di satu tempat.",
        "Kapan memakai: saat metrik yang sama dipakai di ≥2 tempat (dashboard + laporan regulator + notebook data science), saat jumlah analis >10 (koordinasi definisi manual tidak lagi skalabel), atau saat AI agent mulai query data langsung (agent tidak bisa “bertanya ke analis” — ia butuh definisi yang bisa dibaca mesin). Tiga komponennya: (1) definisi metrik — nama, rumus, filter, unit; (2) definisi dimensi dan relasi — apa yang bisa menjadi pemotong; (3) akses — API/query interface agar semua tool membaca dari sumber yang sama.",
      ],
      formula: String.raw`\text{revenue} := \left\{ \text{filter}: status = \text{lunas},\; \text{agregasi}: \sum \text{harga}_i \times \text{qty}_i \right\}`,
      formulaNote: "Simbol := berarti “didefinisikan sebagai” — ini BUKAN persamaan matematika yang dihitung sekali, melainkan DEFINISI yang disimpan dan dipakai ulang. Komponen: filter = syarat baris yang masuk; agregasi = cara menggabungkan baris menjadi satu angka. Interpretasi: setiap kali ada yang meminta “revenue”, layer menerapkan filter lalu agregasi — hasilnya selalu konsisten apa pun tool-nya. Contoh angka: 4 baris @Rp2 juta dengan qty 1,2,1,3 dan satu baris pending → revenue = (1+2+3) × Rp2 juta = Rp12 juta. Tanpa layer, analis yang lupa filter melaporkan Rp14 juta.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Semantic layer = view di database”",
        type: "pitfall",
        body: "Yang benar: view menyelesaikan separuh masalah (query tersimpan di database) tetapi tidak menyelesaikan akses lintas tool — notebook Python tidak membaca view sebagai “metrik bernama”, dan view tidak punya versioning/review ala kode. Semantic layer = view + katalog metrik + versioning + API akses. View adalah fondasi yang bagus; layer adalah bangunannya.",
      },
      hints: [
        "💡 Intuisi: uji apakah perusahaanmu butuh semantic layer dengan pertanyaan “berapa definisi churn yang hidup saat ini?” Kalau jawabannya “tidak tahu” atau “lebih dari satu”, kamu sudah membayar pajak kekacauan definisi — hanya belum menagihnya sebagai proyek.",
      ],
      reference: "Satu definisi := dipakai semua tool. Perdebatan pindah dari “angkamu salah” ke “definisinya perlu direvisi?”.",
    },
    {
      id: "konsep-implementasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga implementasi: dbt Semantic Layer, LookML, Cube — Si Tiga Bersaudara",
      prose: [
        "Definisi ketiganya — satu ide, tiga baju: (1) dbt Semantic Layer — definisi metrik ditulis dalam YAML di samping model dbt yang sudah ada (semantic_models + metrics), lalu di-query lewat API/GraphQL oleh tool apa pun; cocok bila timmu SUDAH memakai dbt. (2) LookML (Looker) — bahasa pemodelan deklaratif milik Looker, paling matang dan ekspresif, tetapi terikat ekosistem Looker/Google. (3) Cube — semantic layer headless open-source: definisikan metrik sekali dalam JavaScript/YAML, expose lewat API ke puluhan tool BI; cocok bila ingin netral vendor dan butuh caching/pre-aggregasi.",
        "Kepribadian ketiganya: dbt Semantic Layer adalah anak bungsu yang mewarisi rumah — kalau keluargamu sudah tinggal di dbt, ia pilihan termurah (definisi tinggal di repo yang sama dengan transformasi). LookML adalah kakak sulung yang mapan — paling kaya fitur dan teruji di enterprise, tetapi menikah dengan ekosistem Google. Cube adalah sepupu mandiri — open-source, netral vendor, dengan pre-aggregasi untuk query cepat, tetapi butuh tim yang mengoperasikannya sendiri.",
        "Kapan memakai apa: sudah punya dbt + ingin cepat → dbt Semantic Layer (definisi menyatu dengan pipeline). Sudah/akan pakai Looker → LookML (jangan lawan arusnya). Multi-tool + ingin netral vendor + butuh performa via pre-aggregasi → Cube. Jujur diakui: perbandingan ini disusun dari dokumentasi publik ketiga produk (bukan dari implementasi langsung) — verifikasi dengan proof-of-concept memakai metrik-MU sebelum berkomitmen, karena detail (dukungan fungsi, caching, pricing) berubah cepat.",
      ],
      formula: String.raw`\text{biaya\_kekacauan} = n_{\text{tool}} \times n_{\text{metrik}} \times p_{\text{beda}} \times c_{\text{insiden}}`,
      formulaNote: "Model mental (bukan rumus empiris): n_tool = jumlah tool BI, n_metrik = jumlah metrik penting, p_beda = peluang definisinya berbeda per tool, c_insiden = biaya rata-rata satu insiden angka-beda (investigasi + keputusan salah + reputasi). Interpretasi: biaya tumbuh PERKALIAN jumlah tool dan metrik — dengan semantic layer, n_tool efektif menjadi 1 untuk urusan definisi. Contoh angka: 4 tool × 30 metrik × peluang 30% × Rp50 juta = Rp1,8 miliar eksposur per tahun. Inilah matematika yang menjual proyek semantic layer ke direksi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Pakai dbt berarti otomatis punya semantic layer”",
        type: "pitfall",
        body: "Yang benar: dbt menyelesaikan TRANSFORMASI (tabel bersih), bukan SEMANTIK (definisi metrik bernama yang bisa di-query tool). dbt Semantic Layer adalah FITUR TAMBAHAN di atas dbt — semantic_models dan metrics harus ditulis eksplisit. Banyak tim “sudah dbt” tetapi metriknya tetap tersebar di 50 dashboard — karena tidak ada yang menulis definisinya.",
      },
      hints: [
        "💡 Intuisi pemilihan: urutan keputusannya — (1) tool BI apa yang sudah/akan dipakai? (2) tim sudah bisa apa (dbt? LookML? JS)? (3) butuh netral vendor? Jawaban (1) biasanya sudah menentukan 80%: melawan ekosistem yang ada hampir selalu lebih mahal daripada mengikutinya.",
      ],
      reference: "Sudah dbt → dbt Semantic Layer; sudah/akan Looker → LookML; multi-tool netral vendor → Cube. Verifikasi via PoC.",
    },
    {
      id: "konsep-kode",
      eyebrow: "Langkah 5 · Konsep",
      title: "Metrik sebagai Kode — Si Arsiparis yang Bisa Di-test",
      prose: [
        "Definisi: “metrik sebagai kode” berarti definisi metrik diperlakukan seperti software — ditulis sebagai teks berversion di Git, di-review lewat pull request, di-test otomatis (apakah revenue bulan ini dalam rentang wajar? apakah definisi baru merusak dashboard lama?), dan di-deploy dengan jejak perubahan. Perubahan definisi churn dari “30 hari tidak aktif” menjadi “45 hari” bukan lagi bisik-bisik di rapat — melainkan commit dengan alasan, reviewer, dan tanggal berlaku.",
        "Kepribadiannya: arsiparis yang cerewet tetapi menyelamatkan. Setiap metrik punya akta kelahiran (kapan didefinisikan, oleh siapa, untuk keputusan apa) dan riwayat hidup (kapan definisinya berubah dan kenapa). Saat direksi bertanya “kenapa churn naik bulan ini?”, analis tidak menebak — ia membuka riwayat: “definisinya diubah 3 Maret dari 30 ke 45 hari; kenaikan ini artefak definisi, bukan perilaku pelanggan.” Tanpa arsiparis ini, setiap perubahan definisi terlihat seperti perubahan bisnis.",
        "Kapan memakai disiplin ini: selalu, bahkan SEBELUM punya tool semantic layer — spreadsheet berisi kamus metrik (nama, definisi, pemilik, tanggal) yang di-review tiap kuartal sudah menyelesaikan 50% masalah. Tiga test otomatis yang paling bernilai: (1) konsistensi — metrik yang sama dari dua jalur query harus sama; (2) kewajaran — nilai di luar rentang historis memicu alert, bukan diam-diam tampil; (3) regresi definisi — perubahan definisi tidak boleh mengubah angka historis tanpa label versi baru.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mendefinisikan metrik dengan sempurna di dokumen 40 halaman yang tidak dibaca siapa pun. Definisi yang tidak bisa dibaca MESIN (di-query tool) akan dilanggar diam-diam — tiap analis tetap menulis rumusnya sendiri. Aturan: definisi harus executable (bisa dijalankan), bukan sekadar dokumentasi. Dokumen menjelaskan KENAPA; kode menegakkan APA.",
      },
      hints: [
        "💡 Intuisi arsiparis: setiap metrik wajib punya tiga metadata — PEMILIK (siapa yang memutuskan definisinya), VERSI (kapan terakhir berubah), dan KONSUMEN (dashboard/keputusan apa yang memakainya). Metrik tanpa ketiganya adalah metrik yatim piatu — ia akan ditinggalkan atau disalahartikan.",
      ],
      reference: "Definisi metrik = kode: versioned, reviewed, tested, deployed. Dokumen menjelaskan kenapa; kode menegakkan apa.",
    },
    {
      id: "lab-layer",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun semantic layer mini",
      prose: [
        "Waktunya praktik. KAMUS_METRIK di atas adalah semantic layer mini: tiap metrik punya deskripsi, filter, dan agregasi. Tiga \"tool\" di bawah (fungsi) semuanya MEMBACA dari kamus yang sama — tidak ada yang menulis rumusnya sendiri.",
        "Tugasmu: lengkapi fungsi `tanya(metrik, data)` — ia harus mengambil definisi dari KAMUS_METRIK, menerapkan filter, lalu agregasi — kemudian pakai untuk mengisi `rev_dashboard`, `rev_laporan`, dan `npl_api`. Kuncinya: ketiga \"tool\" harus menghasilkan angka yang SAMA untuk metrik yang sama.",
        "Coba: setelah lolos, ubah definisi \"revenue\" di KAMUS_METRIK (mis. hapus filter lunas) dan jalankan ulang — semua tool ikut berubah konsisten. Lalu kembalikan. Itulah bedanya dengan 10 spreadsheet: perubahan definisi = satu baris, bukan sepuluh file.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `tanya`: ambil definisi dari KAMUS_METRIK, filter baris, terapkan agregasi" },
        { id: "t2", text: "Isi `rev_dashboard`, `rev_laporan` (keduanya tanya \"revenue\"), dan `npl_api` (tanya \"npl_rate\")" },
        { id: "t3", text: "Jalankan dan pastikan dashboard dan laporan menunjukkan angka revenue yang sama" },
      ],
      expected: "Dashboard revenue: 12000000 | Laporan revenue: 12000000 | API NPL rate: 0.25",
      code: {
        starter:
          LAB_SETUP +
          `
def tanya(nama_metrik, data):
    definisi = KAMUS_METRIK[nama_metrik]
    baris = [t for t in data if ]
    return

# Tiga "tool" membaca dari SATU kamus — tidak ada rumus sendiri
rev_dashboard =
rev_laporan =
npl_api =

print("Dashboard revenue:", rev_dashboard)
print("Laporan revenue:", rev_laporan)
print("API NPL rate:", npl_api)`,
        lockLines: 22,
        solution:
          LAB_SETUP +
          `
def tanya(nama_metrik, data):
    definisi = KAMUS_METRIK[nama_metrik]
    baris = [t for t in data if definisi["filter"](t)]
    return definisi["agregasi"](baris)

# Tiga "tool" membaca dari SATU kamus — tidak ada rumus sendiri
rev_dashboard = tanya("revenue", transaksi)
rev_laporan = tanya("revenue", transaksi)
npl_api = tanya("npl_rate", transaksi)

print("Dashboard revenue:", rev_dashboard)
print("Laporan revenue:", rev_laporan)
print("API NPL rate:", npl_api)`,
        checks: [
          { kind: "equal", task: "t2", name: "rev_dashboard", value: 12000000, tol: 1e-9, label: "`rev_dashboard` = 12.000.000", msg: "(1+2+3) × Rp2 juta — baris pending tidak ikut." },
          { kind: "equal", task: "t2", name: "rev_laporan", value: 12000000, tol: 1e-9, label: "`rev_laporan` = 12.000.000", msg: "Dua tool membaca definisi yang sama → angka sama. Itulah gunanya layer." },
          { kind: "equal", task: "t2", name: "npl_api", value: 0.25, tol: 1e-9, label: "`npl_api` = 0,25", msg: "Satu baris ber-dpd > 90 (95) dari 4 baris = 0,25." },
          { kind: "stdout_matches", task: "t3", pattern: "Dashboard revenue: 12000000\\s+Laporan revenue: 12000000", label: "Dua tool mencetak angka sama", msg: "Konsistensi lintas tool adalah seluruh poin lesson ini." },
        ],
      },
      reference: "tanya() = satu-satunya pintu ke definisi. Tool boleh banyak; pintu tetap satu.",
    },
    {
      id: "chart-arsitektur",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca arsitektur: dengan vs tanpa semantic layer",
      prose: [
        "Diagram di bawah menunjukkan arsitektur BI modern dengan semantic layer di tengah: warehouse dan dbt models di kiri, layer di tengah, empat tool konsumen di kanan.",
        "Cara membaca: kotak kiri = sumber data (warehouse = tabel mentah, dbt models = tabel bersih hasil transformasi); kotak tengah berwarna = SEMANTIC LAYER tempat definisi metrik tinggal; kotak kanan = konsumen (Tableau, Power BI, Looker, Notebook/API). Garis = aliran definisi: semua konsumen membaca dari layer yang sama.",
        "Interpretasi: tanpa kotak tengah, tiap garis akan langsung dari data ke tiap tool — dan tiap garis membawa definisinya sendiri (4 tool × 30 metrik = 120 definisi potensial yang bisa berbeda). Dengan kotak tengah, definisi ditulis sekali dan garis-garis itu hanya membawa PERMINTAAN (“beri aku revenue”), bukan rumus. Pelajaran diagram: semantic layer tidak menambah kompleksitas — ia MEMINDAHKAN kompleksitas definisi dari N tempat (tersebar, tak terlihat) ke 1 tempat (terpusat, terlihat, bisa di-review).",
      ],
      figure: {
        svg: ARSITEKTUR_SVG,
        alt: "Diagram arsitektur: warehouse dan dbt models di kiri mengalir ke semantic layer di tengah, lalu ke empat konsumen di kanan (Tableau, Power BI, Looker, Notebook/API).",
        caption: "Arsitektur BI dengan semantic layer: definisi ditulis sekali di tengah, dibaca semua tool di kanan.",
      },
      tasks: [],
      reference: "Layer memindahkan kompleksitas definisi dari N tempat tersebar ke 1 tempat terpusat.",
      note: {
        title: "Intuisi: kanonisasi 5 metrik yang paling diperdebatkan dulu",
        body: "Jangan membangun semantic layer untuk 40 metrik sekaligus — itu cara tercepat membuat proyek 6 bulan yang tidak dipakai siapa pun. Heuristik praktisinya: kanonisasi 5 metrik yang PALING DIPERDEBATKAN dulu. Tanyakan ke tiap tim: \"metrik apa yang paling sering bikin rapat ricuh karena angkanya beda?\" — biasanya churn, revenue, active user, CAC. Lima itu adalah sprint pertamamu. Setiap metrik kanonis butuh tiga hal: definisi sebagai kode (bisa di-test, bisa di-version), satu nama pemilik, dan test otomatis yang gagal kalau definisinya berubah diam-diam. Buktikan nilainya dalam satu kuartal: \"perang definisi churn selesai, 3 tim kini memakai angka yang sama\". BARU perluas ke 10, 20, 40. Jebakan big-bang: tim data menghilang 6 bulan memodelkan 40 metrik \"sempurna\", kembali dengan layer yang tidak ada yang meminta — analis sudah terlanjur membangun definisi sendiri-sendiri dan tidak mau pindah. Adopsi tidak bisa dipaksakan; ia harus dimenangkan metrik per metrik. Aturan keduanya: semantic layer yang tidak dipakai minimal 2 tool konsumen = dokumentasi mahal. Nilainya justru muncul saat SATU definisi melayani BANYAK konsumen (dashboard + laporan + notebook + AI agent) — di situlah inkonsistensi mati. Mulai kecil, menangkan yang paling berdarah, lalu biarkan kemenangan itu yang menjual sisanya.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Membangun atau menunda semantic layer?",
      prose: [
        "Lima skenario keputusan yang dihadapi head of data:",
        "Skenario 1 — Startup 15 orang, 1 analis, 1 dashboard, metrik masih dicari-cari (product-market fit). → TUNDA. Alasan: definisi metriknya sendiri belum stabil — membangun layer untuk definisi yang berubah tiap minggu adalah over-engineering. Cukup kamus metrik di spreadsheet yang di-review bulanan.",
        "Skenario 2 — Scale-up 150 orang, 8 analis, 3 tool BI, 2 insiden angka-beda tahun lalu. → BANGUN SEKARANG. Alasan: pajak kekacauan sudah nyata; mulai dari 10–15 metrik terpenting, bukan semuanya sekaligus.",
        "Skenario 3 — Bank/fintech teregulasi, KPI dilaporkan ke regulator. → BANGUN + prioritaskan. Alasan: konsistensi dan dokumentasi definisi adalah kebutuhan kepatuhan — semantic layer memberi jejak audit gratis.",
        "Skenario 4 — Tim sudah pakai dbt tetapi metrik tersebar di dashboard. → Aktifkan dbt Semantic Layer. Alasan: biaya marjinal terkecil — definisi tinggal di repo yang sama dengan transformasi; tidak perlu tool baru.",
        "Skenario 5 — AI agent/chatbot akan diberi akses tanya-jawab ke data. → BANGUN DULU SEBELUM AGENT LIVE. Alasan: agent tidak bisa bertanya “maksud revenue yang mana?” ke analis — ia butuh definisi yang bisa dibaca mesin. Agent tanpa semantic layer = mesin halusinasi angka yang fasih.",
        "Aturan praktis 10 detik: (analis > 10 ATAU tool > 2 ATAU ada regulator ATAU ada AI agent) DAN metrik inti sudah stabil → bangun. Selain itu → kamus spreadsheet + review rutin cukup.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun semantic layer sebagai proyek “big bang” 6 bulan yang mendefinisikan 200 metrik sekaligus. Hasilnya: definisi basi sebelum selesai karena bisnis berubah. Mulai dari 10–15 metrik yang dipakai direksi, buktikan nilainya dalam 1 kuartal, baru perluas. Layer yang hidup dengan 15 metrik mengalahkan museum 200 metrik.",
      },
      reference: "Bangun bila: analis>10 / tool>2 / regulator / AI agent — dan metrik inti stabil. Mulai dari 15 metrik, bukan 200.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Standardisasi 40 metrik dalam satu kuartal",
      prose: [
        "Skenario (sintetis, angka konkret): E-commerce MajuBersama (300 karyawan, 18 analis, 4 tool BI) mencatat 5 insiden angka-beda tahun lalu (rata-rata biaya investigasi Rp 90 juta per insiden = Rp 450 juta/tahun). Audit menemukan 40 metrik “inti”, tetapi definisi revenue ada 6 versi, churn 4 versi, CAC 3 versi. Head of data mengusulkan proyek semantic layer 1 kuartal: 2 engineer (Rp 60 juta/bulan/orang) + 1 analis (Rp 35 juta/bulan) = Rp 465 juta total.",
        "Pertanyaan analisis: (1) Apakah proyek ini layak secara finansial dengan payback sederhana? (2) Metrik mana yang distandardisasi dulu — dan kenapa urutannya penting? (3) Risiko terbesar proyek ini dan mitigasinya?",
        "Pembahasan: (1) Biaya Rp465 juta vs penghematan insiden: bila insiden turun 80% = Rp360 juta/tahun. Payback > 1 tahun bila hanya dari insiden — TETAPI nilai sebenarnya: jam analis yang dihemat (18 analis × 2 jam/minggu debat definisi × Rp 200 ribu/jam ≈ Rp 374 juta/tahun) + keputusan yang tidak lagi salah arah. Total manfaat realistis >Rp700 juta/tahun → payback < 8 bulan. (2) Urutan: revenue dulu (dipakai semua tim + direksi, 6 versi = risiko terbesar), lalu churn (4 versi, dipakai growth+finance), lalu CAC. Prinsip: urutkan berdasarkan (jumlah versi × dampak keputusan) — bukan alfabetis. (3) Risiko terbesar: analis tetap memakai rumus lama di dashboardnya (adopsi gagal). Mitigasi: matikan akses tulis definisi lama secara bertahap + jadikan layer satu-satunya sumber untuk dashboard direksi (paksaan yang elegan: angka direksi hanya dari layer).",
        "Kaitan ke karier: proyek seperti ini adalah portofolio emas untuk BI analyst/manager — ia menunjukkan kamu berpikir dalam sistem, bukan dashboard. Ceritakan dengan angka: “menurunkan 6 definisi revenue menjadi 1, menghemat Rp700 juta/tahun”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Enam versi revenue berarti ada enam angka yang bisa dikutip untuk keputusan investasi — dan analis bisa (sadar atau tidak) memilih versi yang mendukung narasi yang diinginkan. Ini bukan sekadar inefisiensi; ini risiko integritas keputusan. Semantic layer adalah kontrol internal atas angka, setara dengan rekonsiliasi di finance.",
      },
      reference: "Urutkan standardisasi: jumlah versi × dampak keputusan. Adopsi dipaksa elegan via dashboard direksi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Semantic layer = lapisan definisi metrik tunggal (nama, rumus, filter) di antara data dan semua tool/AI — ditulis sekali, dibaca semua, berversion seperti kode.",
        "Tiga implementasi: dbt Semantic Layer (termurah bila sudah dbt), LookML (paling matang, terikat Looker/Google), Cube (open-source netral vendor + pre-aggregasi) — pilih mengikuti ekosistem yang ada.",
        "Metrik sebagai kode: versioned di Git, di-review via pull request, di-test otomatis (konsistensi, kewajaran, regresi definisi) — dokumen menjelaskan kenapa, kode menegakkan apa.",
        "Biaya kekacauan tumbuh perkalian (tool × metrik × peluang beda × biaya insiden); layer membuatnya menjadi 1 untuk urusan definisi.",
        "Bangun bila analis>10 / tool>2 / ada regulator / ada AI agent dan metrik inti stabil — mulai dari 15 metrik terpenting, bukan big bang 200 metrik.",
      ],
      next: { label: "BI21 — Analytics Engineering & dbt untuk BI", href: "/v2/learn/biz21-analytics-engineering" },
      quiz: [
        {
          q: "Masalah utama yang diselesaikan semantic layer adalah…",
          options: [
            { text: "Banyaknya versi definisi metrik yang hidup di tiap tool/dashboard sehingga angka tidak konsisten lintas tim", why: "Benar: inilah “pajak kekacauan definisi” — 4 tool × 30 metrik = potensi 120 definisi berbeda. Layer menyatukannya di satu tempat.", correct: true },
            { text: "Lambatnya query ke data warehouse", why: "Salah: performa query adalah masalah optimasi database/caching (Cube punya pre-aggregasi, tetapi itu efek samping — bukan masalah utamanya)." },
            { text: "Mahalnya lisensi tool BI", why: "Salah: layer tidak menurunkan harga lisensi — ia menurunkan biaya inkonsistensi dan duplikasi kerja definisi." },
            { text: "Kurangnya visualisasi yang menarik di dashboard", why: "Salah: visualisasi adalah ranah tool BI; layer justru tidak mengurusi tampilan sama sekali — ia mengurusi arti angka." },
          ],
        },
        {
          q: "Tim sudah memakai dbt untuk transformasi tetapi metrik masih tersebar di 50 dashboard. Langkah paling hemat?",
          options: [
            { text: "Aktifkan dbt Semantic Layer — definisi metrik ditulis di repo yang sama dengan transformasi, tanpa tool baru", why: "Benar: biaya marjinal terkecil karena ekosistem dan skill sudah ada. Ini skenario 4 peta keputusan.", correct: true },
            { text: "Beli Looker dan tulis ulang semua definisi di LookML", why: "Salah: mahal dan melawan ekosistem yang ada — migrasi tool + tulis ulang definisi + latih tim, padahal masalahnya hanya definisi tersebar." },
            { text: "Tulis ulang semua dashboard dalam satu tool saja", why: "Salah: menyatukan tool tanpa menyatukan definisi tidak menjamin konsistensi — definisi tetap bisa berbeda antar dashboard." },
            { text: "Buat dokumen definisi 40 halaman dan wajibkan dibaca", why: "Salah: dokumen yang tidak executable akan dilanggar diam-diam. Definisi harus bisa dibaca mesin, bukan hanya manusia." },
          ],
        },
        {
          q: "Kenapa AI agent yang bertanya langsung ke data WAJIB didahului semantic layer?",
          options: [
            { text: "Agent tidak bisa bertanya klarifikasi ke analis — ia butuh definisi metrik yang bisa dibaca mesin, kalau tidak ia menghalusinasi angka dengan fasih", why: "Benar: ini skenario 5 peta keputusan. Agent tanpa definisi resmi akan meracik rumusnya sendiri per pertanyaan — kekacauan definisi otomatis.", correct: true },
            { text: "Karena AI agent tidak bisa menjalankan SQL", why: "Salah: agent justru bisa menjalankan SQL — masalahnya bukan kemampuan teknis, melainkan tidak tahu definisi bisnis yang benar." },
            { text: "Karena semantic layer mempercepat LLM", why: "Salah: tidak ada hubungan dengan kecepatan inferensi model." },
            { text: "Tidak wajib — cukup beri agent akses ke semua tabel mentah", why: "Salah: akses tabel mentah tanpa definisi = agent menebak arti kolom dan rumus — tepat resep halusinasi angka." },
          ],
        },
        {
          q: "Perubahan definisi churn dari “30 hari tidak aktif” menjadi “45 hari” dikelola dengan benar bila…",
          options: [
            { text: "Dicatat sebagai commit berversion dengan alasan, di-review, dan angka historis diberi label versi definisi", why: "Benar: inilah “metrik sebagai kode” — arsiparis yang cerewet. Tanpa label versi, kenaikan churn terlihat seperti perubahan perilaku pelanggan.", correct: true },
            { text: "Diumumkan di grup chat tim data", why: "Salah: pengumuman chat tenggelam dalam seminggu dan tidak terhubung ke dashboard yang terdampak." },
            { text: "Langsung diubah di semua dashboard satu per satu", why: "Salah: mengubah 20 dashboard manual tidak meninggalkan jejak kapan-kenapa, dan pasti ada yang terlewat." },
            { text: "Tidak perlu dicatat selama angkanya masih masuk akal", why: "Salah: “masuk akal” bukan kontrol. Perubahan definisi tanpa jejak adalah sumber artefak analisis yang paling sulit dilacak." },
          ],
        },
        {
          q: "Startup 15 orang, 1 analis, 1 dashboard, definisi metrik masih berubah tiap minggu. Keputusan tepat?",
          options: [
            { text: "Tunda semantic layer — bangun kamus metrik sederhana di spreadsheet dengan review bulanan; definisi yang belum stabil tidak layak di-layer-kan", why: "Benar: ini skenario 1 peta keputusan. Membangun layer untuk definisi yang berubah tiap minggu adalah over-engineering.", correct: true },
            { text: "Bangun full semantic layer sekarang agar “siap scale”", why: "Salah: premature standardization — biaya setup dan pemeliharaan melebihi manfaat saat metrik belum stabil." },
            { text: "Beli tool BI enterprise termahal sebagai investasi", why: "Salah: tool mahal tidak menyelesaikan ketidakstabilan definisi — malah menguncinya dengan biaya tinggi." },
            { text: "Larang perubahan definisi selama setahun", why: "Salah: startup yang belum product-market fit HARUS bereksperimen dengan definisi; melarangnya membunuh pembelajaran." },
          ],
        },
      ],
    },
  ],
};
