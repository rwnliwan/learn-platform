import type { V2Lesson } from "../lib/types";

// Omzet harian (ribu Rp) 1–14 Okt 2026 dari lab: 8 Okt anomali (750) — diduplikasi manual.
const BIZ23_HARIAN_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Bagan batang omzet harian: 8 Oktober melonjak jauh di atas hari lain.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="15" y1="30" x2="545" y2="30"/><line x1="15" y1="115" x2="545" y2="115"/><line x1="15" y1="200" x2="545" y2="200"/>
</g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="10" y="204" text-anchor="end">0</text><text x="10" y="119" text-anchor="end">375</text><text x="10" y="34" text-anchor="end">750</text>
</g>
<rect x="24" y="149.0" width="28" height="51.0" rx="3" fill="var(--c1)"/>
<text x="38" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<rect x="64" y="166.0" width="28" height="34.0" rx="3" fill="var(--c1)"/>
<text x="78" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<rect x="104" y="163.7" width="28" height="36.3" rx="3" fill="var(--c1)"/>
<text x="118" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<rect x="144" y="159.2" width="28" height="40.8" rx="3" fill="var(--c1)"/>
<text x="158" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<rect x="184" y="172.8" width="28" height="27.2" rx="3" fill="var(--c1)"/>
<text x="198" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<rect x="224" y="172.8" width="28" height="27.2" rx="3" fill="var(--c1)"/>
<text x="238" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<rect x="264" y="30.0" width="28" height="170.0" rx="3" fill="var(--c4)"/>
<text x="278" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<rect x="304" y="167.4" width="28" height="32.6" rx="3" fill="var(--c1)"/>
<text x="318" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">9</text>
<rect x="344" y="169.4" width="28" height="30.6" rx="3" fill="var(--c1)"/>
<text x="358" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<rect x="384" y="162.6" width="28" height="37.4" rx="3" fill="var(--c1)"/>
<text x="398" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">11</text>
<rect x="424" y="155.8" width="28" height="44.2" rx="3" fill="var(--c1)"/>
<text x="438" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">12</text>
<rect x="464" y="160.1" width="28" height="39.9" rx="3" fill="var(--c1)"/>
<text x="478" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">13</text>
<rect x="504" y="152.4" width="28" height="47.6" rx="3" fill="var(--c1)"/>
<text x="518" y="218" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">14</text>
<text x="280" y="242" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Omzet harian (ribu Rp), 1\u201314 Okt 2026 \u2014 7 Okt tidak ada penjualan.</text>
</svg>`;

export const biz23: V2Lesson = {
  slug: "biz23-python-analis-bi",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI23 — Python untuk Analis BI: Otomatisasi di Luar Power BI",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Power BI hebat di dasbor interaktif — tetapi ada wilayah di mana ia lemah: data kotor yang datang tiap minggu dengan format berbeda, tarikan data dari API, dan pekerjaan berulang yang harus jalan tanpa disentuh manusia. Di situlah Python masuk — bukan menggantikan Power BI, melainkan menjadi \u201Ctangan\u201D yang menyiapkan data sebelum Power BI menampilkannya.",
        "Setelah lesson ini kamu bisa: (1) memutuskan kapan Python lebih tepat daripada Power BI murni (dan kapan tidak); (2) membangun pipeline file \u2192 transform \u2192 output yang bisa dijalankan ulang tiap minggu; (3) membersihkan data kotor khas operasional (nilai hilang, typo case, duplikat) dengan pandas; (4) mendeteksi anomali harian dengan z-score dan menjelaskan artinya dalam bahasa bisnis; (5) menulis checklist \u201C5 baris pertahanan\u201D agar dasbormu tidak pernah lagi terbit dari data basi.",
        "Rute: cerita (dasbor yang rajin tapi salah) → kapan Python menang → pola file-transform-output → rumus z-score + bagan anomali → kapan Python TIDAK dipakai → lab membersihkan 17 baris kotor → peta keputusan → mini-case → checkpoint.",
        "Bekal ringkas: kamu sudah kenal pandas dari track Python (atau dari pengalaman). Di sini kita tidak belajar sintaks dari nol — kita belajar ARSITEKTUR kerja seorang analis BI yang memakai Python sebagai senjata produksi.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Dasbor yang rajin terbit — dari data yang basi",
      prose: [
        "Senin, 06:55. Riko, analis BI di PT Sinar Distribusi, menyelesaikan ritual mingguannya: download CSV penjualan dari cabang Jakarta dan Surabaya, gabung di Excel, rapikan pivot, lalu refresh dataset Power BI sebelum direksi datang jam 08:00. Ritual ini sudah berjalan 11 bulan tanpa cela — Riko bangga menyebutnya \u201Cmesin Senin pagi\u201D.",
        "Senin itu, file Surabaya telat: admin gudang cuti, kirimnya jam 10:00. Rapat direksi tetap jam 08:00. Supaya dasbor \u201Ctidak kosong\u201D, Riko menempelkan data Surabaya minggu lalu ke file minggu ini. Dasbor terbit tepat waktu. Direksi melihat omzet Surabaya \u201Cstabil\u201D dan menyetujui promo besar-besaran — untuk stok yang sebenarnya sudah menipis sejak Kamis.",
        "Twist-nya: tidak ada satu pun angka yang salah hitung. Power BI menjumlah dengan sempurna. Excel tidak corrupt. Yang rusak adalah PROSESNYA — satu keputusan manusia yang lelah (\u201Ctempel saja yang lama\u201D) dan tidak ada satu pun cek otomatis yang berteriak. Dasbor yang rajin terbit justru lebih berbahaya daripada dasbor yang gagal terbit, karena kegagalannya tidak terlihat.",
        "Lesson ini tentang membangun \u201Ctangan Python\u201D di depan Power BI: pipeline kecil yang tiap Senin membersihkan data, menghitung agregat, dan — yang paling penting — BERTERIAK ketika ada yang aneh, sebelum direksi melihat angkanya.",
      ],
      tasks: [],
    },
    {
      id: "kapan-python",
      eyebrow: "Langkah 3 · Kapan Python menang",
      title: "Si Tukang Serbaguna: tiga wilayah di mana Python mengalahkan Power BI",
      prose: [
        "Bayangkan Power BI sebagai koki restoran bintang lima dan Python sebagai tukang serbaguna di dapur belakang. Koki hebat menyajikan hidangan (dasbor) dengan indah — tetapi ia tidak pergi ke pasar, tidak membersihkan ikan, dan tidak memperbaiki kompor. Tiga wilayah itulah Python:",
        "Satu — WRANGLING KOTOR BERULANG. Setiap minggu format CSV berubah: kolom bergeser, ada baris kosong, \u201CKopi A\u201D ditulis \u201Ckopi a\u201D. Di Power Query kamu mengulang klik yang sama; di Python kamu menulis sekali dan menjalankannya selamanya. Aturannya: kalau langkah pembersihanmu LEBIH DARI 10 klik dan harus diulang tiap periode → Python.",
        "Dua — INGESTION DARI API. Data dari marketplace, payment gateway, atau cuaca — semuanya datang lewat API, bukan file. Power BI bisa, tetapi rapuh untuk pagination dan retry. Python (requests) + scheduler = tarikan data yang tahan banting.",
        "Tiga — STATISTIK KHUSUS. Z-score anomali, dekomposisi deret waktu, uji statistik — di DAX rasanya seperti memaku dengan sendok. Di Python (pandas/numpy) itu lima baris.",
        "\uD83D\uDCA1 Intuisi kunci: tanyakan bukan \u201Cbisa tidak di Power BI?\u201D melainkan \u201Cberapa KALI aku akan mengulang ini, dan apa risikonya kalau langkah manualnya salah?\u201D Pekerjaan yang berulang + berisiko = wilayah Python.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: Python menggantikan Power BI",
        type: "pitfall",
        body: "Tidak — mereka melengkapi. Power BI tetap raja untuk eksplorasi ad-hoc (\u201Cklik sana, filter sini, jawab dalam 2 menit\u201D) dan distribusi ke ratusan pengguna non-teknis. Python mengambil alih PEKERJAAN BELAKANG: ingestion, cleaning, dan cek kualitas. Arsitektur sehatnya: Python menyiapkan tabel bersih → Power BI menampilkannya. Yang digantikan Python bukan Power BI-nya, melainkan ritual Senin pagi Riko yang manual.",
      },
      reference: "Berulang + berisiko + butuh statistik khusus \u2192 Python. Ad-hoc + banyak pengguna \u2192 Power BI.",
    },
    {
      id: "pola-pipeline",
      eyebrow: "Langkah 4 · Pola pipeline",
      title: "Pola file → transform → output: kontrak yang bisa diuji",
      prose: [
        "Pipeline Python yang sehat punya tiga gerbang yang jelas. GERBANG 1 — INGEST: baca file/API apa adanya, JANGAN diubah; simpan salinan mentahnya (bronze). GERBANG 2 — TRANSFORM: cleaning dan agregasi yang deterministik (input sama → output sama). GERBANG 3 — OUTPUT: tulis tabel bersih + LAPORAN KUALITAS (berapa baris dibuang dan kenapa).",
        "Laporan kualitas adalah pembeda antara skrip mainan dan pipeline produksi. Riko versi baru tidak lagi \u201Cmenempel data lama\u201D — pipeline-nya mencetak: \u201C17 baris masuk, 14 bersih, 2 dibuang (qty kosong), 1 duplikat\u201D. Kalau Surabaya telat kirim, pipeline mencetak \u201C0 baris baru\u201D dan mengirim ALERT — bukan menebak-nebak.",
        "Tiga aturan kontrak: (1) jangan pernah mengubah file mentah — ia bukti forensikmu; (2) tiap transformasi harus bisa dijalankan ulang dengan hasil identik (idempoten); (3) kegagalan harus BERSUARA (exception + alert), bukan diam-diam menghasilkan angka yang tampak normal.",
        "\uD83D\uDCA1 Intuisi kunci: pipeline yang baik itu seperti kasir yang jujur — ia memberi struk (laporan kualitas) untuk setiap transaksi. Tanpa struk, kamu tidak tahu apakah angkanya benar atau hanya terlihat benar.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: pipeline = skrip panjang yang penting jalan",
        type: "pitfall",
        body: "Skrip yang \u201Cpenting jalan\u201D adalah bom waktu: ia gagal diam-diam (silent failure) dan kamu baru tahu saat direksi bertanya. Pipeline produksi punya TIGA hal yang skrip mainan tidak punya: (1) laporan kualitas tiap run, (2) alert saat anomali, (3) idempotency — dijalankan dua kali hasilnya sama, tidak mendobel data. Di lab kamu membangun ketiganya dalam skala kecil.",
      },
      reference: "Ingest mentah → transform deterministik → output + laporan kualitas. Gagal harus bersuara.",
    },
    {
      id: "zscore",
      eyebrow: "Langkah 5 · Deteksi anomali",
      title: "Z-score: memberi tahu kapan harus berteriak",
      prose: [
        "Rumus penjaga gerbang ini sederhana: z mengukur seberapa jauh sebuah titik dari rata-rata, dalam satuan simpangan baku. z = 3 berarti \u201Ctitik ini 3 simpangan baku di atas normal\u201D — untuk data harian yang wajar, itu nyaris pasti bukan kebetulan.",
        "Cara membaca gambar di bawah: sumbu X = tanggal 1–14 Oktober (7 Oktober tidak ada penjualan — tokonya tutup, bukan data hilang), tinggi batang = omzet harian dalam ribu Rp. Interpretasi: 13 batang berkumpul di 120–225 ribu; satu batang (8 Okt, 750 ribu) menjulang 3,26 simpangan baku di atas rata-rata. Mata manusia langsung menangkapnya — dan z-score adalah cara memberi \u201Cmata\u201D itu pada pipeline yang berjalan tanpa manusia.",
        "Aturan praktis: |z| > 2 = \u201Cperiksa\u201D, |z| > 3 = \u201Ctahan laporan, telepon yang bertanggung jawab\u201D. Catatan jujur: z-score mengasumsikan data kurang-lebih simetris; untuk data yang sangat miring (mis. omzet dengan sedikit transaksi raksasa), ambang 2 bisa terlalu berisik — di situlah intuisi analis tetap dibutuhkan.",
        "\uD83D\uDCA1 Intuisi kunci: z-score bukan pengganti penilaian manusia — ia adalah bel yang membangunkan manusia yang tepat, di waktu yang tepat, SEBELUM angka aneh itu sampai ke meja direksi.",
      ],
      formula: String.raw`z = \frac{x - \mu}{\sigma} \qquad \text{anomali bila } |z| > 2`,
      formulaNote:
        "x = nilai hari yang diperiksa (mis. omzet 8 Okt = 750.000). \u03BC (mu) = rata-rata omzet harian periode itu (210.000). \u03C3 (sigma) = simpangan baku harian (165.432). z = jarak dari rata-rata dalam satuan sigma. |z| > 2 berarti titik itu di luar ~95% rentang normal — layak diperiksa, bukan otomatis salah.",
      figure: {
        svg: BIZ23_HARIAN_SVG,
        alt: "Bagan batang omzet harian: 8 Oktober melonjak jauh di atas hari lain.",
        caption: "Satu batang yang berteriak: 8 Okt (z = 3,26). Inilah yang seharusnya ditangkap pipeline sebelum menjadi keputusan promo.",
      },
      tasks: [],
      reference: "z = (x \u2212 \u03BC)/\u03C3. |z|>2 periksa, |z|>3 tahan laporan.",
    },
    {
      id: "kapan-tidak",
      eyebrow: "Langkah 6 · Batas Python",
      title: "Kapan Python TIDAK dipakai: menghormati wilayah Power BI",
      prose: [
        "Tukang serbaguna yang baik tahu kapan TIDAK turun tangan. Tiga wilayah tetap milik Power BI (atau BI tool apa pun): satu — EKSPLORASI AD-HOC. Direksi bertanya \u201Ckenapa Surabaya turun minggu lalu?\u201D dan butuh jawaban dalam 3 menit: klik-filter-drill di Power BI, bukan menulis skrip. Dua — DISTRIBUSI MASSAL. 200 manajer membuka dasbor di HP: itu pekerjaan semantic model + RLS Power BI, bukan notebook Python. Tiga — GOVERNANCE TERPUSAT. Satu definisi \u201Comzet\u201D yang dipakai semua tim harus hidup di satu tempat (semantic model), bukan tersebar di 14 skrip Python milik 6 analis.",
        "Bahaya nyata pola \u201Csemua di Python\u201D: setiap analis punya definisi omzet sendiri-sendiri di skripnya → rapat direksi dengan tiga angka berbeda (persis masalah yang akan kita selesaikan di lesson BI24 tentang Fabric). Python di dapur, definisi di satu tempat, dasbor di Power BI.",
        "Aturan praktis 10 detik: pekerjaan ini BERULANG tiap periode dan INPUTNYA KOTOR? → Python. Pekerjaan ini SEKALI PAKAI/EKSPLORATIF dan butuh JAWABAN CEPAT? → Power BI. Butuh DIKONSUMSI 200 orang? → Power BI. Butuh STATISTIK KHUSUS? → Python.",
      ],
      tasks: [],
    },
    {
      id: "lab-bersih",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: 5 baris pertahanan — bersihkan, agregat, tangkap anomali",
      requires: ["pandas"],
      prose: [
        "Data penjualan 17 baris (1–14 Okt 2026, dua cabang) — kotor seperti aslinya: ada qty yang kosong, \u201Ckopi a\u201D vs \u201CKopi A\u201D, dan satu baris duplikat persis. Tugasmu tiga tahap: (t1) bersihkan → `bersih` (buang qty kosong, samakan case, buang duplikat); (t2) agregat mingguan → `mingguan` + `minggu41`; (t3) z-score omzet harian → `anomali` (tanggal dengan |z| > 2).",
        "Perhatikan: baris 2026-10-08 (qty 50) itulah \u201Ctempelan minggu lalu\u201D ala Riko — z-score-mu harus menangkapnya. Inilah 5 baris pertahanan yang seharusnya dimiliki setiap pipeline analis.",
        "Coba juga: ubah ambang menjadi |z| > 1.5 — tanggal apa saja yang ikut tertangkap? Apakah semuanya benar-benar aneh, atau ambangmu terlalu berisik? Itulah trade-off yang dihadapi setiap sistem alert.",
      ],
      tasks: [
        { id: "t1", text: "Bersihkan data → `bersih` (dropna qty, title-case produk, drop duplikat)" },
        { id: "t2", text: "Agregat mingguan → `mingguan` (dict minggu ISO → omzet) dan `minggu41`" },
        { id: "t3", text: "Z-score omzet harian → `anomali` (list tanggal dengan |z| > 2)" },
      ],
      expected: "bersih: 14 baris\nminggu 40: 715000\nminggu 41: 1434000\nminggu 42: 581000\nanomali: ['2026-10-08']",
      note: {
        title: "Sering salah",
        body: "Lupa me-reset urutan: title() HARUS sebelum drop_duplicates — kalau tidak, \u201Ckopi a\u201D dan \u201CKopi A\u201D dianggap dua produk berbeda dan duplikatnya lolos. Urutan yang benar: buang yang kosong → samakan format → baru buang duplikat. Ini pola umum: NORMALISASI dulu, DEDUPLIKASI kemudian.",
      },
      hints: [
        "bersih = df.dropna(subset=[\"qty\"]); samakan case dengan .str.title(); lalu .drop_duplicates().",
        "mingguan = bersih.assign(omzet=..., minggu=...).groupby(\"minggu\")[\"omzet\"].sum().to_dict() — minggu ISO via dt.isocalendar().week.",
        "harian = groupby tanggal; z = (harian - harian.mean()) / harian.std(ddof=1); anomali = tanggal dengan abs(z) > 2.",
      ],
      code: {
        starter: `import pandas as pd

# Data penjualan kotor (17 baris) — JANGAN UBAH
rows = [
    ("2026-10-01", "JKT", "Kopi A", 10, 15000),
    ("2026-10-01", "JKT", "kopi a", 5, 15000),
    ("2026-10-02", "JKT", "Kopi A", None, 15000),
    ("2026-10-02", "JKT", "Kopi A", 10, 15000),
    ("2026-10-02", "JKT", "Kopi A", 10, 15000),
    ("2026-10-03", "JKT", "Teh B", 20, 8000),
    ("2026-10-04", "JKT", "Kopi A", 12, 15000),
    ("2026-10-05", "SBY", "Kopi A", 8, 15000),
    ("2026-10-06", "SBY", "Teh B", 15, 8000),
    ("2026-10-07", "SBY", "Teh B", None, 8000),
    ("2026-10-08", "JKT", "Kopi A", 50, 15000),
    ("2026-10-09", "JKT", "Teh B", 18, 8000),
    ("2026-10-10", "SBY", "Kopi A", 9, 15000),
    ("2026-10-11", "SBY", "Kopi A", 11, 15000),
    ("2026-10-12", "JKT", "Kopi A", 13, 15000),
    ("2026-10-13", "SBY", "Teh B", 22, 8000),
    ("2026-10-14", "JKT", "Kopi A", 14, 15000),
]
df = pd.DataFrame(rows, columns=["tanggal", "cabang", "produk", "qty", "harga"])
df["tanggal"] = pd.to_datetime(df["tanggal"])

# ── TULIS KODEMU di bawah garis ini ──
bersih = df.copy()          # t1: hasil pembersihan
mingguan = {}               # t2: dict minggu ISO -> omzet
minggu41 = 0                # t2: omzet minggu 41
anomali = []                # t3: list tanggal aneh
print(f"bersih: {len(bersih)} baris")
for m in sorted(mingguan):
    print(f"minggu {m}: {int(mingguan[m])}")
print(f"anomali: {anomali}")`,
        lockLines: 26,
        solution: `import pandas as pd

# Data penjualan kotor (17 baris) — JANGAN UBAH
rows = [
    ("2026-10-01", "JKT", "Kopi A", 10, 15000),
    ("2026-10-01", "JKT", "kopi a", 5, 15000),
    ("2026-10-02", "JKT", "Kopi A", None, 15000),
    ("2026-10-02", "JKT", "Kopi A", 10, 15000),
    ("2026-10-02", "JKT", "Kopi A", 10, 15000),
    ("2026-10-03", "JKT", "Teh B", 20, 8000),
    ("2026-10-04", "JKT", "Kopi A", 12, 15000),
    ("2026-10-05", "SBY", "Kopi A", 8, 15000),
    ("2026-10-06", "SBY", "Teh B", 15, 8000),
    ("2026-10-07", "SBY", "Teh B", None, 8000),
    ("2026-10-08", "JKT", "Kopi A", 50, 15000),
    ("2026-10-09", "JKT", "Teh B", 18, 8000),
    ("2026-10-10", "SBY", "Kopi A", 9, 15000),
    ("2026-10-11", "SBY", "Kopi A", 11, 15000),
    ("2026-10-12", "JKT", "Kopi A", 13, 15000),
    ("2026-10-13", "SBY", "Teh B", 22, 8000),
    ("2026-10-14", "JKT", "Kopi A", 14, 15000),
]
df = pd.DataFrame(rows, columns=["tanggal", "cabang", "produk", "qty", "harga"])
df["tanggal"] = pd.to_datetime(df["tanggal"])

# ── TULIS KODEMU di bawah garis ini ──
bersih = df.dropna(subset=["qty"]).copy()
bersih["produk"] = bersih["produk"].str.title()
bersih = bersih.drop_duplicates().reset_index(drop=True)
bersih["omzet"] = bersih["qty"] * bersih["harga"]
bersih["minggu"] = bersih["tanggal"].dt.isocalendar().week
mingguan = bersih.groupby("minggu")["omzet"].sum().to_dict()
minggu41 = mingguan[41]
harian = bersih.groupby("tanggal")["omzet"].sum()
z = (harian - harian.mean()) / harian.std(ddof=1)
anomali = harian[abs(z) > 2].index.strftime("%Y-%m-%d").tolist()
print(f"bersih: {len(bersih)} baris")
for m in sorted(mingguan):
    print(f"minggu {m}: {int(mingguan[m])}")
print(f"anomali: {anomali}")`,
        checks: [
          { kind: "defined", task: "t1", name: "bersih", label: "`bersih` terdefinisi", msg: "Isi DataFrame bersih hasil pembersihan." },
          { kind: "uses", task: "t1", token: "dropna", label: "Memakai dropna", msg: "Buang baris dengan qty kosong." },
          { kind: "stdout_matches", task: "t1", pattern: "bersih: 14 baris", label: "14 baris bersih", msg: "17 − 2 (qty kosong) − 1 (duplikat) = 14." },
          { kind: "uses", task: "t2", token: "groupby", label: "Memakai groupby", msg: "Agregat per minggu ISO dengan groupby." },
          { kind: "equal", task: "t2", name: "minggu41", value: 1434000, label: "`minggu41` = 1.434.000", msg: "Omzet minggu 41 dari data bersih." },
          { kind: "stdout_matches", task: "t2", pattern: "minggu 42: 581000", label: "Minggu 42 = 581.000", msg: "Samakan format print dengan contoh." },
          { kind: "defined", task: "t3", name: "anomali", label: "`anomali` terdefinisi", msg: "Isi list tanggal dengan |z| > 2." },
          { kind: "stdout_matches", task: "t3", pattern: "anomali: \\['2026-10-08'\\]", label: "Anomali = 8 Okt", msg: "Hanya 2026-10-08 yang |z| > 2 (z ≈ 3,26)." },
        ],
      },
      reference: "Normalisasi dulu, dedup kemudian. |z| > 2 = periksa.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: Python, Power BI, atau keduanya?",
      prose: [
        "Skenario 1 — CSV mingguan dari 3 cabang, format berubah-ubah: → Python (pandas) membersihkan + agregat → Power BI membaca tabel bersih. Alasan: berulang + kotor = wilayah tukang serbaguna.",
        "Skenario 2 — Direksi tanya \u201Ckenapa turun?\u201D butuh jawab 3 menit: → Power BI langsung (filter/drill). Alasan: eksplorasi ad-hoc, jawaban cepat > presisi pipeline.",
        "Skenario 3 — Tarikan data harian dari API marketplace: → Python (requests + retry) dijadwalkan → tabel staging. Alasan: pagination dan retry rapuh di Power Query.",
        "Skenario 4 — 200 manajer regional buka dasbor di HP tiap pagi: → Power BI (semantic model + RLS). Alasan: distribusi massal dan keamanan baris adalah pekerjaan platform BI.",
        "Skenario 5 — Definisi \u201Comzet\u201D dipakai 4 tim: → SATU definisi di semantic model, bukan di skrip masing-masing. Alasan: definisi tersebar = tiga angka berbeda di rapat (lihat BI24).",
        "Aturan praktis 10 detik: berulang + kotor + butuh statistik khusus → Python. Sekali pakai + butuh cepat + banyak pengguna → Power BI. Definisi bersama → satu tempat, bukan di skrip.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: siapa yang menempel data lama?",
      prose: [
        "Konteks: PT Sinar Distribusi, Senin 06:55. File Surabaya belum masuk. Kamu (menggantikan Riko) punya pipeline lab ini. Data yang ada: 17 baris seperti lab, tetapi tanpa baris 2026-10-08 (qty 50) — hari itu normal, omzetnya 180.000.",
        "Pertanyaan: (1) tanpa anomali buatan, berapa rata-rata dan simpangan baku harian, dan apakah ada hari dengan |z| > 2? (2) Riko versi lama menempel 3 baris Surabaya minggu lalu (total +390.000 tersebar di 12–14 Okt). Hari mana yang kini tertangkap z-score, dan apa vonis yang benar: kirim alert atau diam? (3) Tulis aturan alert produksi: kapan pipeline boleh diam, kapan harus berteriak, kapan harus MENAHAN laporan?",
        "Pembahasan: (1) tanpa tempelan: 13 hari normal (7 Okt tutup), rata-rata ≈ 152.000, simpangan baku ≈ 33.000 — tidak ada |z| > 2; semua wajar. (2) tempelan +390.000 menaikkan 12–14 Okt di atas +2 sigma → alert untuk ketiganya; vonis: TAHAN laporan + telepon gudang Surabaya (data tidak konsisten dengan pola, dan sumbernya \u201Ctempelan\u201D bukan data nyata). (3) aturan: |z| ≤ 2 → diam dan terbit; 2 < |z| ≤ 3 → terbit + alert ke analis; |z| > 3 ATAU sumber data tidak resmi (tempelan/manual) → TAHAN, jangan terbit sampai manusia memverifikasi. Prinsipnya: dasbor yang tidak terbit sehari merugikan; dasbor yang terbit dari data palsu merusak kepercayaan selamanya.",
        "\uD83D\uDCA1 Intuisi kunci: Riko yang lama bukan orang jahat — ia orang baik dengan proses yang buruk. Tugasmu sebagai analis BI modern bukan bekerja lebih keras tiap Senin, melainkan membangun sistem yang membuat \u201Ctempel data lama\u201D menjadi mustahil dilakukan diam-diam.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang Python untuk analis BI. Ingat: Python adalah tangan, bukan pengganti otak dasbor.",
      ],
      tasks: [],
      summary: [
        "Python menang di: wrangling kotor berulang, ingestion API, statistik khusus — bukan menggantikan Power BI.",
        "Pola pipeline: ingest mentah (jangan diubah) → transform deterministik → output + laporan kualitas.",
        "Urutan cleaning: buang yang kosong → normalisasi format → baru dedup.",
        "z = (x − μ)/σ; |z| > 2 periksa, |z| > 3 tahan laporan; z-score butuh data kurang-lebih simetris.",
        "Kegagalan harus bersuara: alert + tahan terbit lebih baik daripada angka yang tampak normal.",
        "Definisi bersama hidup di satu tempat (semantic model), bukan tersebar di skrip tiap analis.",
      ],
      next: { label: "BI24 — Microsoft Fabric: Power BI Naik Kelas ke Lakehouse", href: "/v2/learn/biz24-microsoft-fabric" },
      quiz: [
        {
          q: "Pekerjaan mana yang PALING tepat dipindah ke Python?",
          options: [
            { text: "Menjawab pertanyaan direksi dalam 3 menit dengan filter dasbor", why: "Itu eksplorasi ad-hoc — wilayah Power BI, bukan Python." },
            { text: "Membersihkan CSV mingguan dari 3 cabang yang formatnya selalu berubah", why: "Tepat: berulang + kotor = wilayah tukang serbaguna. Tulis sekali, jalan selamanya.", correct: true },
            { text: "Mendistribusikan dasbor ke 200 manajer dengan keamanan baris", why: "Itu pekerjaan semantic model + RLS Power BI." },
            { text: "Membuat satu definisi omzet untuk semua tim", why: "Definisi bersama harus di satu tempat terpusat, bukan di skrip." },
          ],
        },
        {
          q: "Dalam pola file → transform → output, apa yang TIDAK boleh dilakukan di gerbang ingest?",
          options: [
            { text: "Menyimpan salinan mentah file sumber", why: "Justru itu yang WAJIB dilakukan — bukti forensik." },
            { text: "Mengubah isi file sumber langsung", why: "Tepat: file mentah jangan pernah diubah; transformasi terjadi di gerbang 2 dengan hasil yang bisa diuji ulang.", correct: true },
            { text: "Mencatat jumlah baris yang masuk", why: "Itu bagian laporan kualitas — wajib." },
            { text: "Menjadwalkan ingest tiap Senin jam 06:00", why: "Penjadwalan justru praktik yang baik." },
          ],
        },
        {
          q: "Kenapa .str.title() harus dipanggil SEBELUM .drop_duplicates()?",
          options: [
            { text: "Karena pandas mengharuskannya secara sintaks", why: "Tidak ada keharusan sintaks — ini soal logika." },
            { text: "Agar “kopi a” dan “Kopi A” dikenali sebagai duplikat yang sama", why: "Tepat: normalisasi dulu, dedup kemudian. Tanpa normalisasi, duplikat lolos karena dianggap beda.", correct: true },
            { text: "Agar file CSV-nya lebih kecil", why: "Ukuran file tidak ada hubungannya." },
            { text: "Agar z-score-nya lebih akurat", why: "Z-score dihitung dari angka, bukan dari case huruf." },
          ],
        },
        {
          q: "Omzet harian: μ = 210.000, σ = 165.432. Hari dengan omzet 750.000 memberi z ≈ 3,26. Vonis yang benar?",
          options: [
            { text: "Hapus hari itu dari data — jelas salah", why: "Jangan hapus data sebelum tahu penyebabnya — bisa jadi promo nyata." },
            { text: "Abaikan, karena rata-rata masih terlihat wajar", why: "Rata-rata justru tercemar oleh titik ini — itulah bahayanya." },
            { text: "Tahan laporan dan verifikasi ke sumber (apakah tempelan/duplikasi?)", why: "Tepat: |z| > 3 = tahan + verifikasi manusia. Di kasus Riko, ini tempelan minggu lalu.", correct: true },
            { text: "Terbitkan saja, toh rumusnya sudah benar", why: "Rumus benar tidak menjamin data benar — kegagalan senyap." },
          ],
        },
        {
          q: "Pipeline-mu mencetak “0 baris baru” padahal biasanya 500. Tindakan yang benar?",
          options: [
            { text: "Tempel data kemarin agar dasbor tetap terisi", why: "Itu dosa Riko versi lama — jangan diulangi." },
            { text: "Kirim alert dan tahan terbit sampai sumber diverifikasi", why: "Tepat: 0 baris adalah anomali proses. Bersuara > menebak.", correct: true },
            { text: "Jalankan ulang 3x, siapa tahu berhasil", why: "Retry buta tanpa diagnosis hanya menunda masalah." },
            { text: "Ubah ambang alert agar tidak berisik", why: "Mengubah ambang untuk membungkam alert = membutakan diri sendiri." },
          ],
        },
        {
          q: "Empat analis punya definisi “omzet” berbeda di skrip Python masing-masing. Solusi arsitektur yang benar?",
          options: [
            { text: "Biarkan, yang penting tiap dasbor konsisten internal", why: "Rapat direksi dengan 4 angka omzet berbeda = kekacauan." },
            { text: "Satu definisi di semantic model / lapisan bersama yang dipakai semua", why: "Tepat: definisi bersama hidup di satu tempat. Python menyiapkan data, definisi tinggal di satu rumah.", correct: true },
            { text: "Larang Python, semua kembali ke Excel", why: "Mundur — masalahnya bukan tool-nya, melainkan definisinya." },
            { text: "Minta tiap analis menulis dokumentasi skripnya", why: "Dokumentasi membantu, tetapi tidak menyatukan angka yang berbeda." },
          ],
        },
      ],
    },
  ],
};
