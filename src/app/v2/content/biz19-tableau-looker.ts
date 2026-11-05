import type { V2Lesson } from "../lib/types";

// ── Figure: kurva belajar vs kedalaman governance tiga tool BI ──────────
const TOOL_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram perbandingan tiga tool BI: kecepatan analisis mandiri vs kekuatan governance">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="70" y1="216" x2="500" y2="216"/>
<line x1="70" y1="166" x2="500" y2="166"/><line x1="70" y1="116" x2="500" y2="116"/>
<line x1="70" y1="66" x2="500" y2="66"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="64" y="219">rendah</text><text x="64" y="119">skor</text><text x="64" y="69">tinggi</text>
</g>
<g font-size="12" font-family="var(--font-ui)">
<circle cx="140" cy="96" r="34" fill="var(--c1)" opacity="0.85"/>
<text x="140" y="100" text-anchor="middle" font-weight="700" fill="#fff">T</text>
<text x="140" y="150" text-anchor="middle" fill="var(--text)">Tableau</text>
<text x="140" y="166" text-anchor="middle" font-size="10" fill="var(--text-muted)">eksplorasi: 9</text>
<text x="140" y="180" text-anchor="middle" font-size="10" fill="var(--text-muted)">governance: 6</text>
<circle cx="280" cy="116" r="34" fill="var(--c2)" opacity="0.85"/>
<text x="280" y="120" text-anchor="middle" font-weight="700" fill="#fff">P</text>
<text x="280" y="170" text-anchor="middle" fill="var(--text)">Power BI</text>
<text x="280" y="186" text-anchor="middle" font-size="10" fill="var(--text-muted)">eksplorasi: 7</text>
<text x="280" y="200" text-anchor="middle" font-size="10" fill="var(--text-muted)">governance: 7</text>
<circle cx="420" cy="86" r="34" fill="var(--chart-text)" opacity="0.7"/>
<text x="420" y="90" text-anchor="middle" font-weight="700" fill="var(--bg)">L</text>
<text x="420" y="140" text-anchor="middle" fill="var(--text)">Looker</text>
<text x="420" y="156" text-anchor="middle" font-size="10" fill="var(--text-muted)">eksplorasi: 6</text>
<text x="420" y="170" text-anchor="middle" font-size="10" fill="var(--text-muted)">governance: 9</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="70" y="30">posisi tiap tool pada dua sumbu (ilustrasi — bukan benchmark resmi vendor)</text>
<text x="70" y="244">semakin ke atas = semakin kuat pada sumbu itu</text>
</g>
</svg>`;

const LAB_SETUP = `metrik = {
    "definisi_resmi": {
        "revenue": "SUM(harga * qty) WHERE status = 'lunas'",
        "npl_rate": "SUM(CASE WHEN dpd > 90 THEN 1 ELSE 0 END) / COUNT(*)",
    }
}

laporan_a = [  # analis A menghitung manual di spreadsheet
    {"nama": "revenue versi A", "rumus": "SUM(harga * qty)"},          # lupa filter status
    {"nama": "npl versi A", "rumus": "dpd > 60"},                      # ambang beda
]
`;

export const biz19: V2Lesson = {
  slug: "biz19-tableau-looker",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "Tableau & Looker: Dunia BI di Luar Power BI — Memilih Senjata Sesuai Medan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga dashboard, tiga angka revenue, satu rapat yang ricuh",
      prose: [
        "Di sebuah bank digital, tiga tim memakai tiga tool berbeda. Tim marketing memakai Tableau dan melaporkan revenue kuartal Rp 84 miliar. Tim finance memakai Power BI dan melaporkan Rp 79 miliar. Tim risk memakai Looker dan melaporkan Rp 81 miliar. Rapat direksi berubah menjadi debat kusir: angka mana yang benar? Setelah dua hari investigasi, jawabannya memalukan — ketiganya benar menurut rumusnya masing-masing. Marketing menjumlah semua transaksi tercatat; finance hanya yang statusnya lunas; risk memakai definisi lunas tetapi periode cut-off-nya beda satu hari.",
        "Twist-nya: masalahnya bukan tool-nya. Tableau tidak salah, Power BI tidak salah, Looker tidak salah — ketiganya menghitung dengan sempurna apa yang diminta. Yang tidak pernah ada adalah definisi tunggal tentang apa itu \"revenue\". Perusahaan itu membeli tiga mesin hitung canggih tetapi lupa menyepakati apa yang dihitung. Setiap tool baru yang dibeli tanpa semantic layer hanya menambah satu versi kebenaran baru.",
        "Lesson ini tentang dua dunia di luar Power BI yang wajib kamu kenal — Tableau (raja eksplorasi visual) dan Looker (penjaga definisi terpusat) — plus cara memilih di antara ketiganya. Bekal ringkas dari lesson dashboard (diringkas 2–3 kalimat agar mandiri): dashboard yang baik melayani satu audiens dengan satu cerita per layar, menaruh KPI terpenting paling atas, dan selalu bisa ditelusuri (drill-down) dari angka ringkas ke detailnya. Prinsip itu berlaku di tool apa pun — yang dibahas di sini adalah perbedaan senjatanya, bukan prinsip perangnya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini relevan untuk kariermu",
        type: "risk",
        body: "Lowongan BI analyst di bank digital Indonesia secara eksplisit mensyaratkan Tableau atau Looker di samping Power BI. Alasannya terlihat di cerita ini: perusahaan besar jarang single-tool. Analis yang hanya bisa satu tool akan gagap saat pindah tim — analis yang paham filosofi tiap tool bisa produktif di mana pun dalam seminggu.",
      },
      reference: "Tool menghitung dengan sempurna; yang gagal adalah definisi. Kenali filosofi tiap tool sebelum memilih.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita tiga angka revenue. (2) Peta ini. (3) Konsep: Tableau — Si Pelukis (VizQL dan LOD). (4) Konsep: Looker — Si Penjaga Definisi (LookML). (5) Konsep: perbandingan jujur tiga ekosistem + biaya. (6) Lab: buktikan sendiri kenapa definisi terpusat menang. (7) Chart: peta posisi tiap tool. (8) Peta keputusan: skenario pemilihan tool. (9) Mini-case: bank digital memilih stack BI. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan cara kerja Tableau — VizQL, drag-and-drop, dan LOD expressions untuk agregasi multi-level; (2) menjelaskan cara kerja Looker — LookML sebagai semantic layer dan model versioned di Git; (3) membandingkan Tableau, Looker, dan Power BI pada sumbu eksplorasi vs governance vs biaya; (4) memberi rekomendasi tool dengan argumen untuk skenario nyata — bukan karena \"yang lagi hype\".",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, prinsip dashboard: satu layar satu cerita, KPI terpenting di atas, angka ringkas bisa di-drill-down ke detail — berlaku universal di semua tool. Kedua, ide model data: tabel fakta (transaksi) dan dimensi (produk, waktu), plus agregasi (SUM, COUNT, rata-rata) — kalau dua istilah ini asing, bayangkan fakta sebagai struk belanja dan dimensi sebagai label di struk itu.",
        "Rutenya: cerita → peta → dua tool (Tableau, Looker) → perbandingan → lab definisi → chart posisi → peta keputusan → mini-case → kuis. Estimasi 50 menit; lab-nya ±12 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: hafalkan satu kalimat per tool — Tableau: “visualisasi dulu, pertanyaan menyusul” (eksplorasi tercepat). Looker: “definisi dulu, visualisasi menyusul” (konsistensi tertinggi). Power BI: “di tengah, terikat ekosistem Microsoft”. Hampir semua perbedaan turun dari tiga kalimat ini.",
      ],
      reference: "Satu kalimat per tool: Tableau = eksplorasi tercepat; Looker = konsistensi tertinggi; Power BI = tengah + ekosistem Microsoft.",
    },
    {
      id: "konsep-tableau",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tableau — Si Pelukis (VizQL: seret, jatuhkan, jadi visual)",
      prose: [
        "Definisi: Tableau adalah platform BI yang menerjemahkan gestur drag-and-drop menjadi query visual lewat VizQL (Visual Query Language) — kamu menyeret \"Kategori\" ke kolom dan \"Revenue\" ke baris, Tableau menyusun query agregasinya di balik layar dan me-render chart terbaik untuk kombinasi itu (Show Me). Filosofinya: kecepatan eksplorasi — analis bisa menjawab 10 pertanyaan ad-hoc dalam 10 menit tanpa menulis satu pun query.",
        "Kepribadiannya: Tableau adalah pelukis jalanan yang melukis wajahmu dalam 5 menit — cepat, hidup, dan memancing “oh!” dari penonton. Kekuatannya justru di ketidakterdugaan: pola yang tidak kamu cari sering muncul sendiri saat kamu bermain-main dengan visual. Kelemahannya adalah sisi lain koin yang sama: karena tiap analis bebas meracik sendiri, dua analis bisa sampai pada dua definisi \"revenue\" yang berbeda — persis tragedi di cerita pembuka — kecuali ada governance yang kuat.",
        "Senjata khasnya: LOD expressions (Level of Detail) — cara menghitung agregasi pada granularitas berbeda dari tampilan. Contoh: {FIXED [Kategori] : SUM([Revenue])} menghitung total per kategori SEKALIPUN tampilannya per produk — seperti subquery/GROUP BY dalam satu baris. Tiga varian: FIXED (abaikan filter tampilan, hitung pada level yang ditentukan), INCLUDE (tambahkan dimensi ke level tampilan), EXCLUDE (kurangi dimensi). Kapan memakai Tableau: tim analis yang banyak pertanyaan ad-hoc, budaya data-driven yang menghargai eksplorasi mandiri, dan perusahaan yang siap membayar lisensinya yang premium.",
      ],
      formula: String.raw`\text{pangsa} = \frac{\text{SUM}([\text{Revenue}])}{\{\text{FIXED} : \text{SUM}([\text{Revenue}])\}}`,
      formulaNote: "Simbol: SUM([Revenue]) = total revenue pada konteks tampilan aktif (mis. satu produk); {FIXED : SUM([Revenue])} = total revenue SELURUH data, dihitung pada level tetap yang mengabaikan dimensi tampilan. Interpretasi: pangsa = kontribusi baris ini terhadap total — pembilang berubah mengikuti baris tampilan, penyebut selalu total keseluruhan. Contoh angka: produk Kopi A Rp2,16 miliar dibagi total Rp11,72 miliar = 18,4%. Tanpa FIXED, penyebut ikut terpotong per baris dan hasilnya selalu 100% — bug LOD paling umum: lupa menentukan level.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tableau = Power BI yang lebih mahal, fiturnya sama”",
        type: "pitfall",
        body: "Yang benar: filosofinya berbeda. Tableau lahir dari riset visualisasi (Stanford) dan unggul pada eksplorasi visual bebas; Power BI lahir dari ekosistem Excel/SQL Server dan unggul pada integrasi Microsoft + harga. Membeli Tableau lalu memakainya seperti Power BI (sekadar dashboard statis bulanan) adalah pemborosan — seperti membeli mobil sport untuk antar jemput dalam gang.",
      },
      hints: [
        "💡 Intuisi LOD: baca FIXED sebagai “hitung seolah-olah tampilannya tidak ada”. Setiap kali angkamu terlihat aneh (pangsa selalu 100%, total tidak cocok), tanyakan: “pada LEVEL apa angka ini seharusnya dihitung, dan pada level apa ia tampil?” — 90% bug Tableau adalah salah level.",
      ],
      reference: "Tableau = eksplorasi visual tercepat (VizQL + Show Me + LOD). Harga: kebebasan tiap analis = risiko definisi ganda.",
    },
    {
      id: "konsep-looker",
      eyebrow: "Langkah 4 · Konsep",
      title: "Looker — Si Penjaga Definisi (LookML: metrik sebagai kode)",
      prose: [
        "Definisi: Looker adalah platform BI yang memisahkan DEFINISI data dari VISUALISASI-nya. Semua logika bisnis ditulis sekali dalam LookML — bahasa pemodelan deklaratif yang versioned di Git — sebagai views (tabel), explores (titik awal analisis), dan measures/dimensions (definisi metrik). Analis bisnis tidak menulis SQL; mereka memilih dari daftar definisi resmi (“Revenue”, “NPL Rate”) dan Looker menerjemahkannya menjadi SQL ke data warehouse (BigQuery, Snowflake, dsb.).",
        "Kepribadiannya: jika Tableau adalah pelukis jalanan yang bebas, Looker adalah notaris — kaku, teliti, dan semua yang keluar dari tangannya sah secara definisi. Tragedi tiga angka revenue di cerita pembuka TIDAK BISA terjadi di Looker yang dikelola benar: hanya ada satu definisi \"revenue\" di LookML, dipakai semua tim, berubah hanya lewat pull request yang di-review. Harganya: analis tidak bisa “iseng” mendefinisikan metrik baru di dashboard — harus lewat tim data/modeler, sehingga kecepatan eksplorasi ad-hoc lebih lambat.",
        "Kapan memakai Looker: perusahaan yang KONSISTENSI angkanya lebih penting dari kecepatan eksplorasi — bank, asuransi, fintech yang diawasi regulator; tim data yang sudah kuat (punya modeler yang menulis LookML); arsitektur modern dengan data warehouse terpusat. Contoh LookML: measure revenue { type: sum sql: ${harga} * ${qty} ;; filters: [status: \"lunas\"] } — filter \"lunas\" terkunci di definisi, tidak bisa “lupa” seperti analis A di lab nanti. Catatan jujur: sejak akuisisi Google (2019), Looker terikat erat ekosistem Google Cloud — pertimbangkan bila warehouse-mu bukan BigQuery.",
      ],
      formula: String.raw`\text{revenue}_{\text{resmi}} = \sum_{i \in \{\text{status}=\text{lunas}\}} \text{harga}_i \times \text{qty}_i`,
      formulaNote: "Simbol: i = tiap baris transaksi; himpunan {status=lunas} = hanya baris berstatus lunas yang dijumlahkan. Interpretasi: definisi resmi mengunci filter di dalam metrik — analis pemakai tidak bisa menghasilkankan angka tanpa filter itu. Contoh angka: 100 ribu transaksi @Rp1 juta = Rp100 miliar tercatat, tetapi 6 ribu belum lunas → revenue resmi = Rp94 miliar. Di Tableau/Power BI tanpa governance, analis yang lupa filter melaporkan Rp100 miliar — selisih Rp6 miliar yang memicu debat direksi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Looker lambat dan kaku — Tableau selalu lebih baik untuk analis”",
        type: "pitfall",
        body: "Yang benar: “lebih baik” tergantung apa yang dioptimasi. Untuk analis yang pekerjaannya menjawab 20 pertanyaan ad-hoc sehari, Tableau memang lebih cepat. Untuk perusahaan yang angka KPI-nya dipakai untuk keputusan direksi dan laporan regulator, kekakuan Looker adalah FITUR — ia mencegah tepat satu bencana: dua orang melaporkan angka berbeda untuk metrik yang sama. Pilih berdasarkan risiko, bukan kenyamanan.",
      },
      hints: [
        "💡 Intuisi LookML: anggap LookML sebagai kontrak antara tim data dan tim bisnis — “inilah arti revenue, ditandatangani, versioned di Git”. Setiap debat angka di rapat direksi seharusnya berakhir dengan membuka file LookML, bukan dengan adu spreadsheet.",
      ],
      reference: "Looker = satu definisi resmi (LookML, versioned di Git) untuk semua pemakai. Konsistensi > kecepatan eksplorasi.",
    },
    {
      id: "konsep-banding",
      eyebrow: "Langkah 5 · Konsep",
      title: "Perbandingan jujur: tiga ekosistem, tiga harga, tiga jebakan",
      prose: [
        "Definisi perbandingan — tiga sumbu yang paling menentukan pilihan: (1) kecepatan eksplorasi ad-hoc — Tableau 9/10, Power BI 7/10, Looker 6/10; (2) kekuatan governance/konsistensi — Looker 9/10, Power BI 7/10, Tableau 6/10 (tanpa governance tambahan); (3) total biaya — Power BI termurah (terikat lisensi Microsoft yang biasanya sudah ada), Tableau premium per-user, Looker enterprise dengan harga platform. Angka-angka ini ilustrasi, bukan benchmark resmi — tetapi urutannya stabil di berbagai survei industri.",
        "Kepribadian tiap ekosistem: Tableau — komunitas visualisasi terbesar (Tableau Public penuh inspirasi), konektor data sangat luas, tetapi governance metrik harus dibangun sendiri (atau beli Tableau Data Catalog). Power BI — DAX paling ekspresif untuk kalkulasi kompleks, integrasi Excel/Azure mulus, tetapi terjebak ekosistem Microsoft dan model governance-nya (dataset bersama) butuh disiplin. Looker — LookML + Git = metrik sebagai kode yang bisa di-review/di-test, tetapi butuh tim modeler dan paling nyaman di atas BigQuery.",
        "Kapan memakai apa — ringkasnya: pilih Tableau bila tim analis besar, pertanyaan ad-hoc deras, dan perusahaan siap membayar untuk kecepatan eksplorasi. Pilih Looker bila angka harus konsisten lintas tim (bank/fintech teregulasi) dan tim data cukup kuat menulis LookML. Pilih/betah di Power BI bila sudah dalam ekosistem Microsoft dan butuh rasio kapabilitas/harga terbaik. Jebakan umum: membeli tool karena “kompetitor pakai” tanpa memetakan siapa yang akan memeliharanya — tool BI tanpa pemilik = dashboard basi dalam setahun.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kita beli Tableau DAN Looker DAN Power BI, biar semua senang.” Hasilnya: tiga definisi revenue seperti cerita pembuka — dikali tiga tool. Aturan: standarkan SATU semantic layer (definisi metrik) dulu, baru pilih tool visualisasi. Tool bisa banyak; kebenaran harus satu.",
      },
      hints: [
        "💡 Intuisi pembeli: tanyakan tiga hal sebelum tanda tangan — (1) siapa yang menulis definisi metrik dan di mana? (2) siapa yang me-refresh data dan seberapa sering? (3) siapa yang menghapus dashboard basi? Vendor tidak pernah menanyakan ketiganya — tetapi ketiganya menentukan apakah investasimu hidup atau mati.",
      ],
      reference: "Eksplorasi: Tableau > Power BI > Looker. Governance: Looker > Power BI > Tableau. Biaya: Power BI < Tableau < Looker (umumnya).",
    },
    {
      id: "lab-definisi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Buktikan kenapa definisi terpusat menang",
      prose: [
        "Waktunya praktik. Di bawah ada “definisi resmi” metrik (ala LookML — satu sumber kebenaran) dan dua laporan analis yang menghitung manual (ala spreadsheet bebas). Data transaksi kecil sudah disiapkan: tiap baris berisi harga, qty, status (\"lunas\"/\"pending\"), dan dpd.",
        "Tugasmu: tulis fungsi `revenue_resmi(data)` yang memakai definisi resmi (hanya status lunas — tiru analis A yang lupa filter, lalu bandingkan), dan `npl_rate_resmi(data)` = proporsi baris dengan dpd > 90. Lalu hitung selisihnya: berapa rupiah “revenue versi A” melebih-lebihkan angka resmi?",
        "Coba: setelah lolos, ubah definisi resmi (mis. ambang NPL dari 90 menjadi 60) di SATU tempat — perhatikan semua pemakai definisi ikut berubah konsisten. Itulah yang tidak bisa dilakukan 10 spreadsheet yang masing-masing punya rumus sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `revenue_resmi`: jumlahkan `harga*qty` HANYA untuk baris berstatus 'lunas'" },
        { id: "t2", text: "Lengkapi `npl_rate_resmi`: proporsi baris dengan `dpd > 90`; isi `selisih` = revenue versi A − revenue resmi" },
        { id: "t3", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "Revenue resmi: 9000000 | Revenue versi A: 15000000 | Selisih: 6000000 | NPL rate: 0.4",
      code: {
        starter:
          LAB_SETUP +
          `
transaksi = [
    {"harga": 1000000, "qty": 2, "status": "lunas",   "dpd": 0},
    {"harga": 1000000, "qty": 3, "status": "lunas",   "dpd": 120},
    {"harga": 1000000, "qty": 1, "status": "pending", "dpd": 0},
    {"harga": 1000000, "qty": 4, "status": "lunas",   "dpd": 10},
    {"harga": 1000000, "qty": 5, "status": "pending", "dpd": 200},
]

def revenue_resmi(data):
    total = 0
    for t in data:
        if :
            total +=
    return total

def revenue_versi_a(data):  # analis A: lupa filter status (jangan diubah)
    return sum(t["harga"] * t["qty"] for t in data)

def npl_rate_resmi(data):
    npl =

    return npl / len(data)

rev_resmi = revenue_resmi(transaksi)
rev_a = revenue_versi_a(transaksi)
selisih =
npl = npl_rate_resmi(transaksi)

print("Revenue resmi:", rev_resmi)
print("Revenue versi A:", rev_a)
print("Selisih:", selisih)
print("NPL rate:", npl)`,
        lockLines: 20,
        solution:
          LAB_SETUP +
          `
transaksi = [
    {"harga": 1000000, "qty": 2, "status": "lunas",   "dpd": 0},
    {"harga": 1000000, "qty": 3, "status": "lunas",   "dpd": 120},
    {"harga": 1000000, "qty": 1, "status": "pending", "dpd": 0},
    {"harga": 1000000, "qty": 4, "status": "lunas",   "dpd": 10},
    {"harga": 1000000, "qty": 5, "status": "pending", "dpd": 200},
]

def revenue_resmi(data):
    total = 0
    for t in data:
        if t["status"] == "lunas":
            total += t["harga"] * t["qty"]
    return total

def revenue_versi_a(data):  # analis A: lupa filter status (jangan diubah)
    return sum(t["harga"] * t["qty"] for t in data)

def npl_rate_resmi(data):
    npl = sum(1 for t in data if t["dpd"] > 90)

    return npl / len(data)

rev_resmi = revenue_resmi(transaksi)
rev_a = revenue_versi_a(transaksi)
selisih = rev_a - rev_resmi
npl = npl_rate_resmi(transaksi)

print("Revenue resmi:", rev_resmi)
print("Revenue versi A:", rev_a)
print("Selisih:", selisih)
print("NPL rate:", npl)`,
        checks: [
          { kind: "equal", task: "t1", name: "rev_resmi", value: 9000000, tol: 1e-9, label: "`rev_resmi` = 9.000.000", msg: "Hanya 3 baris lunas: (2+3+4) × Rp1 juta = Rp9 juta." },
          { kind: "equal", task: "t2", name: "selisih", value: 6000000, tol: 1e-9, label: "`selisih` = 6.000.000", msg: "Versi A (semua status) = Rp15 juta; resmi (lunas saja) = Rp9 juta." },
          { kind: "equal", task: "t2", name: "npl", value: 0.4, tol: 1e-9, label: "`npl` = 0,4", msg: "Dua baris ber-dpd > 90 (120 dan 200) dari 5 baris = 0,4." },
          { kind: "stdout_matches", task: "t3", pattern: "NPL rate: 0\\.4", label: "NPL rate tercetak 0,4", msg: "Dua baris ber-dpd > 90 (120 dan 200) dari 5 baris." },
        ],
      },
      reference: "Satu definisi resmi (LookML) dipakai semua → tidak ada “versi A”. Ubah definisi sekali → semua konsisten.",
    },
    {
      id: "chart-posisi",
      eyebrow: "Langkah 7 · Chart",
      title: "Peta posisi: tidak ada tool yang menang di semua sumbu",
      prose: [
        "Chart di bawah memetakan tiga tool pada dua sumbu: kecepatan eksplorasi ad-hoc dan kekuatan governance/konsistensi. Skor 1–10 bersifat ilustratif (bukan benchmark resmi vendor), tetapi posisi relatifnya mencerminkan konsensus industri.",
        "Cara membaca: tiap lingkaran = satu tool; posisi vertikal = skor pada sumbu itu (semakin atas semakin kuat); label di bawah tiap lingkaran = dua skornya. Tidak ada sumbu “harga” di chart — anggap Power BI termurah, Tableau premium, Looker enterprise.",
        "Interpretasi: Tableau tertinggi di eksplorasi (9) tetapi terendah di governance (6) — cocok untuk tim analis yang haus ad-hoc, berbahaya bila definisi tidak dikelola. Looker kebalikannya: governance 9, eksplorasi 6 — cocok untuk bank/fintech teregulasi, membuat frustrasi analis yang ingin iseng. Power BI di tengah (7/7) — bukan yang terbaik di sumbu mana pun, tetapi rasio kapabilitas/harga terbaik dan pilihan aman bila ragu. Pelajaran chart: pilih tool berdasarkan sumbu yang PALING berisiko bagimu — risiko inkonsistensi angka → Looker; risiko analis lambat menjawab → Tableau.",
      ],
      figure: {
        svg: TOOL_SVG,
        alt: "Diagram posisi tiga tool BI. Tableau: eksplorasi 9, governance 6. Power BI: 7 dan 7. Looker: eksplorasi 6, governance 9.",
        caption: "Posisi relatif Tableau, Power BI, dan Looker (ilustrasi). Tidak ada yang unggul di semua sumbu — pilih berdasarkan risiko terbesarmu.",
      },
      tasks: [],
      reference: "Risiko inkonsistensi → Looker. Risiko analis lambat → Tableau. Ragu + hemat → Power BI.",
      note: {
        title: "Intuisi: beli untuk tim yang ada, bukan tim yang diimpikan",
        body: "Pilih tool BI untuk tim yang kamu PUNYA hari ini, bukan tim yang kamu impikan tahun depan. Ini heuristik pembelian yang paling sering dilanggar: perusahaan membeli tool dengan governance terbaik, padahal tidak ada satu pun analis yang bisa menulis bahasa definisinya — hasilnya shelfware miliaran rupiah sambil menunggu rekrutmen yang tidak pernah datang. Aturan praktisnya: sebelum tanda tangan, hitung orang yang BISA mengoperasikan tool itu hari ini. Butuh minimal 2 orang yang fasih bahasa definisinya (LookML/DAX); kalau nol, anggarkan 6 bulan hiring + training ATAU pilih tool yang lebih sederhana. Jebakan kedua: vendor demo ke eksekutif, bukan ke analis yang akan hidup di dalamnya setiap hari. Beri tiga analismu hak veto — mereka yang akan merasakan sakitnya tiap Senin pagi, bukan direksi. Jebakan ketiga: harga lisensi hanyalah sekitar 30% dari tagihan sebenarnya. Tambahkan implementasi, training, satu admin (0,5–1 FTE), dan biaya migrasi definisi lama. \"Murah per user\" yang butuh konsultan 6 bulan bukan murah. Dan yang keempat: tanyakan siapa yang menghapus dashboard basi dan siapa yang me-refresh data — vendor tidak pernah membahas ini, tetapi inilah yang menentukan apakah tool-mu jadi aset atau kuburan dalam 18 bulan. Tool yang tepat untuk tim yang salah adalah tool yang salah.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Memilih tool BI tanpa menyesal",
      prose: [
        "Lima skenario pemilihan yang dihadapi tiap perusahaan:",
        "Skenario 1 — Startup 20 orang, satu analis, butuh dashboard investor bulan depan, budget minim. → Power BI (atau bahkan spreadsheet + chart). Alasan: time-to-value tercepat dengan biaya terendah; governance belum jadi risiko nyata.",
        "Skenario 2 — Bank digital 500 orang, 40 analis, angka KPI dipakai direksi dan dilaporkan ke regulator. → Looker (+ warehouse terpusat). Alasan: risiko inkonsistensi angka adalah risiko terbesar — satu definisi resmi mengalahkan 40 spreadsheet.",
        "Skenario 3 — Perusahaan riset/konsultan, analis senior, pertanyaan ad-hoc deras dari klien, visual harus memukau. → Tableau. Alasan: kecepatan eksplorasi dan kualitas visual adalah produk yang dijual; analisnya cukup senior untuk mengelola definisi sendiri.",
        "Skenario 4 — Korporat Microsoft-shop (Office 365, Azure, tim finance di Excel). → Power BI. Alasan: integrasi bawaan (single sign-on, Excel, Teams) dan lisensi yang biasanya sudah termasuk — resistensi adopsi minimal.",
        "Skenario 5 — Sudah terlanjur tiga tool seperti cerita pembuka. → JANGAN beli tool keempat: bangun semantic layer dulu — satu definisi metrik tertulis dan terpusat yang dibaca semua tool — baru konsolidasi. Alasan: menambah tool tanpa definisi tunggal hanya menambah versi kebenaran.",
        "Aturan praktis 10 detik: tanya “apa yang paling menyakitkan tahun lalu — analis lambat menjawab, atau angka yang tidak cocok?” Lambat → Tableau; tidak cocok → Looker; dua-duanya belum parah + budget ketat → Power BI. Dan apa pun pilihanmu: definisikan metriknya DULU di satu tempat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih tool karena demo sales-nya paling memukau. Demo selalu memakai data bersih dan pertanyaan yang sudah disiapkan. Minta proof-of-concept dengan DATA-MU dan PERTANYAAN-MU selama 2 minggu — di situlah beda governance, performa, dan biaya operasional terlihat.",
      },
      reference: "Sakitnya lambat → Tableau; sakitnya angka beda → Looker; budget ketat → Power BI; sudah banyak tool → semantic layer dulu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bank digital memilih stack BI: tender tiga vendor",
      prose: [
        "Skenario (sintetis, angka konkret): Bank Digital Nusantara (400 karyawan, 25 analis tersebar di 6 tim) memakai spreadsheet + query manual. Tahun lalu terjadi 3 insiden “angka beda di rapat direksi” (biaya investigasi ±Rp 450 juta total). Tender: Vendor T (Tableau, Rp 1,8 miliar/tahun untuk 100 user), Vendor L (Looker, Rp 2,4 miliar/tahun termasuk implementasi LookML 3 bulan), Vendor P (Power BI Premium, Rp 900 juta/tahun — sudah termasuk lisensi Microsoft existing). Syarat regulator: definisi KPI kredit harus konsisten dan terdokumentasi.",
        "Pertanyaan analisis: (1) Hitung payback sederhana tiap opsi terhadap biaya insiden Rp 450 juta/tahun — asumsi tiap opsi menghilangkan 80% insiden. (2) Selain uang, faktor apa yang paling menentukan keberhasilan tiap opsi? (3) Rekomendasimu dan satu syarat keberhasilannya?",
        "Pembahasan: (1) Penghematan ≈ 0,8 × Rp450 juta = Rp360 juta/tahun untuk semua opsi. Secara payback murni, tidak ada yang “balik modal” dari insiden saja — P: Rp900 jt vs hemat Rp360 jt; T: Rp1,8 M; L: Rp2,4 M. Artinya justifikasi tidak boleh hanya dari insiden — nilai sebenarnya adalah kecepatan analis (jam kerja dihemat) dan kepercayaan direksi pada angka. (2) Faktor penentu: T — kedisiplinan governance (tanpa itu, insiden berulang); L — ketersediaan modeler LookML internal setelah konsultan pergi (tanpa itu, perubahan definisi macet); P — kematangan tim dalam memakai dataset bersama (tanpa itu, tiap tim bikin dataset sendiri = insiden baru). (3) Rekomendasi: L (Looker) — karena syarat regulator (konsistensi + dokumentasi KPI kredit) adalah kebutuhan yang tidak bisa ditawar, dan LookML menjawabnya secara struktural, bukan prosedural. Syarat keberhasilan: rekrut/kontrak minimal 2 modeler LookML internal sebelum konsultan selesai — definisi harus hidup di dalam perusahaan, bukan di slide vendor.",
        "Kaitan ke karier: saat interview BI analyst dan ditanya “Tableau atau Looker?”, jawaban senior tidak memilih — ia bertanya balik: “apa risiko terbesar perusahaan ini — kecepatan atau konsistensi?” Pewawancara langsung tahu kamu berpikir seperti pemilik masalah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk bank, “angka beda di rapat direksi” bukan sekadar malu — ia bisa menjadi temuan audit regulator bila KPI kredit yang dilaporkan tidak konsisten. Biaya Rp450 juta investigasi adalah yang terlihat; biaya reputasi ke regulator tidak tercatat di mana pun. Inilah kenapa governance BI di bank adalah masalah risiko, bukan masalah IT.",
      },
      reference: "Payback insiden saja tidak cukup — nilai BI = kecepatan analis + kepercayaan angka + kepatuhan.",
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
        "Tableau = eksplorasi visual tercepat (VizQL drag-and-drop, Show Me, LOD expressions FIXED/INCLUDE/EXCLUDE untuk agregasi multi-level) — risiko: definisi ganda tanpa governance.",
        "Looker = konsistensi tertinggi (LookML: metrik sebagai kode, versioned di Git, satu definisi resmi untuk semua) — harga: eksplorasi ad-hoc lebih lambat, butuh modeler.",
        "Perbandingan: eksplorasi Tableau > Power BI > Looker; governance Looker > Power BI > Tableau; biaya umumnya Power BI < Tableau < Looker.",
        "Tragedi tiga angka revenue bukan salah tool — melainkan tidak adanya definisi tunggal; menambah tool tanpa semantic layer hanya menambah versi kebenaran.",
        "Pilih berdasarkan risiko terbesar: lambat menjawab → Tableau; angka tidak cocok → Looker; budget ketat → Power BI; sudah banyak tool → semantic layer dulu.",
      ],
      quiz: [
        {
          q: "Akar masalah tiga angka revenue berbeda di cerita pembuka adalah…",
          options: [
            { text: "Tidak adanya definisi tunggal tentang apa itu \"revenue\" — tiap tim memakai rumus dan cut-off sendiri", why: "Benar: ketiga tool menghitung dengan sempurna. Yang gagal adalah kesepakatan definisi — masalah governance, bukan teknologi.", correct: true },
            { text: "Tableau/Power BI/Looker memiliki bug perhitungan", why: "Salah: tidak ada bug — tiap angka benar menurut rumusnya masing-masing. Menyalahkan tool melewatkan pelajaran sebenarnya." },
            { text: "Datanya berbeda di tiap tool", why: "Salah: sumber datanya sama; yang berbeda adalah rumus (filter status, cut-off periode) yang dipakai tiap tim." },
            { text: "Terlalu banyak analis sehingga koordinasi gagal", why: "Salah: jumlah analis bukan akar masalah — 40 analis dengan satu definisi resmi akan menghasilkan satu angka." },
          ],
        },
        {
          q: "Kapan LOD expression FIXED dibutuhkan di Tableau?",
          options: [
            { text: "Saat agregasi harus dihitung pada level berbeda dari granularitas tampilan — mis. penyebut pangsa harus total keseluruhan walau tampilannya per produk", why: "Benar: FIXED mengunci level perhitungan mengabaikan dimensi tampilan. Tanpa itu, penyebut ikut terpotong per baris dan pangsa selalu 100%.", correct: true },
            { text: "Saat data perlu di-refresh otomatis tiap jam", why: "Salah: refresh adalah urusan koneksi/extract, bukan LOD. LOD mengatur LEVEL agregasi, bukan jadwal." },
            { text: "Saat ingin mengunci dashboard agar tidak bisa diedit user", why: "Salah: itu urusan permission/publish, bukan LOD expression." },
            { text: "FIXED tidak pernah dibutuhkan — filter biasa selalu cukup", why: "Salah: filter mengubah data yang masuk; FIXED mengubah level agregasi tanpa mengubah data. Dua hal berbeda." },
          ],
        },
        {
          q: "Keunggulan struktural LookML dibanding definisi metrik di spreadsheet adalah…",
          options: [
            { text: "Definisi ditulis sekali, versioned di Git, dipakai semua tim — perubahan lewat review, tidak bisa \"lupa filter\" diam-diam", why: "Benar: inilah inti semantic layer. Analis A di lab tidak bisa menghasilkan revenue tanpa filter lunas karena filternya terkunci di definisi.", correct: true },
            { text: "LookML menghitung lebih cepat daripada spreadsheet", why: "Salah: kecepatan bukan keunggulannya — konsistensi dan auditability yang menjadi keunggulan." },
            { text: "LookML gratis sedangkan spreadsheet berbayar", why: "Salah: Looker adalah platform enterprise berbayar; spreadsheet justru yang murah." },
            { text: "LookML tidak butuh tim data sama sekali", why: "Salah: kebalikannya — LookML BUTUH modeler yang menulis dan memeliharanya. Itu biaya yang harus dianggarkan." },
          ],
        },
        {
          q: "Bank yang KPI kreditnya dilaporkan ke regulator dan pernah 3× insiden angka beda. Rekomendasi paling tepat?",
          options: [
            { text: "Looker — karena kebutuhan konsistensi + dokumentasi definisi KPI adalah kebutuhan regulator yang tidak bisa ditawar", why: "Benar: risikonya adalah inkonsistensi angka (plus temuan audit). LookML menjawabnya secara struktural. Syarat: siapkan modeler internal.", correct: true },
            { text: "Tableau — karena analisnya paling banyak dan butuh kecepatan", why: "Salah: kecepatan bukan risiko terbesar di sini — konsistensi angka untuk regulator adalah. Tableau tanpa governance kuat mengulang insiden." },
            { text: "Tetap spreadsheet — paling murah dan fleksibel", why: "Salah: spreadsheet adalah sumber insidennya. Menghemat lisensi sambil membayar Rp450 juta/tahun biaya investigasi adalah false economy." },
            { text: "Beli ketiganya agar tiap tim senang", why: "Salah: tiga tool tanpa definisi tunggal = tiga versi kebenaran. Ini mengulang tragedi cerita pembuka." },
          ],
        },
        {
          q: "Perusahaan sudah memakai Tableau, Power BI, DAN Looker dengan definisi metrik berbeda-beda. Langkah pertama yang benar?",
          options: [
            { text: "Bangun semantic layer (satu definisi metrik) dulu, baru konsolidasi tool — menambah tool tanpa definisi tunggal hanya menambah versi kebenaran", why: "Benar: ini skenario 5 peta keputusan. Masalahnya bukan jumlah tool, melainkan tidak adanya kebenaran tunggal.", correct: true },
            { text: "Beli tool BI keempat yang lebih modern", why: "Salah: menambah tool keempat menambah versi kebenaran keempat. Arahnya salah total." },
            { text: "Larang analis membuat dashboard baru selama setahun", why: "Salah: melarang tidak memperbaiki definisi — hanya membekukan kekacauan yang ada." },
            { text: "Pilih satu tool secara acak dan hapus dua lainnya", why: "Salah: menghapus tool tanpa menyatukan definisi tidak menjamin angka jadi konsisten — definisinya tetap berbeda di tool yang tersisa." },
          ],
        },
      ],
    },
  ],
};
