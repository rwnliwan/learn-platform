import type { V2Lesson } from "../lib/types";

// Medallion: bronze 12 baris -> silver 9 (3 ditolak) -> gold 2 cabang; checksum 1.281.000.
const BIZ24_MEDALLION_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram medallion: bronze 12 baris menjadi silver 9 baris lalu gold 2 agregat cabang.">
<defs><marker id="b24a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)">
<rect x="20" y="60" width="140" height="130" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="90" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)">BRONZE</text>
<text x="90" y="112" text-anchor="middle" font-size="11" fill="var(--text-muted)">mentah, 12 baris</text>
<text x="90" y="130" text-anchor="middle" font-size="11" fill="var(--text-muted)">3 sumber, apa adanya</text>
<text x="90" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">12</text>
<rect x="210" y="60" width="140" height="130" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="280" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)">SILVER</text>
<text x="280" y="112" text-anchor="middle" font-size="11" fill="var(--text-muted)">bersih, 9 baris</text>
<text x="280" y="130" text-anchor="middle" font-size="11" fill="var(--text-muted)">3 ditolak + alasan</text>
<text x="280" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">9</text>
<rect x="400" y="60" width="140" height="130" rx="10" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="470" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)">GOLD</text>
<text x="470" y="112" text-anchor="middle" font-size="11" fill="var(--text-muted)">siap bisnis</text>
<text x="470" y="130" text-anchor="middle" font-size="11" fill="var(--text-muted)">JKT 825rb · SBY 456rb</text>
<text x="470" y="162" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">2</text>
<line x1="160" y1="125" x2="205" y2="125" stroke="var(--text-muted)" stroke-width="2" marker-end="url(#b24a)"/>
<line x1="350" y1="125" x2="395" y2="125" stroke="var(--text-muted)" stroke-width="2" marker-end="url(#b24a)"/>
<text x="182" y="115" text-anchor="middle" font-size="10" fill="var(--text-muted)">validasi</text>
<text x="372" y="115" text-anchor="middle" font-size="10" fill="var(--text-muted)">agregasi</text>
<text x="280" y="228" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Checksum: total silver 1.281.000 = total gold 1.281.000 \u2713</text>
</g>
</svg>`;

export const biz24: V2Lesson = {
  slug: "biz24-microsoft-fabric",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI24 — Microsoft Fabric: Power BI Naik Kelas ke Lakehouse",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Di BI23, tiga analis dengan empat definisi omzet menghasilkan empat angka berbeda. Lesson ini menyelesaikan akar masalahnya di tingkat ARSITEKTUR: Microsoft Fabric dan konsep OneLake — satu salinan data yang dibaca banyak mesin, dengan lapisan kualitas berjenjang (medallion) sebelum data sampai ke dasbor.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan masalah \u201Cbanyak salinan, banyak kebenaran\u201D dan cara OneLake mengatasinya; (2) membedakan Lakehouse vs Warehouse dan memilihnya dari kebutuhan; (3) merancang alur medallion bronze → silver → gold beserta cek kualitas tiap gerbang; (4) menjelaskan peran Data Pipeline, Dataflow Gen2, dan Direct Lake dalam bahasa bisnis; (5) menulis kriteria \u201Clkak Fabric\u201D untuk organisasimu.",
        "Rute: cerita (rapat dengan tiga angka) → OneLake si danau satu pintu → lakehouse vs warehouse → medallion + lab simulasi → bingkai jujur (apa yang tidak bisa dicoba di browser) → peta keputusan → mini-case migrasi → checkpoint.",
        "Catatan jujur di awal: Microsoft Fabric adalah layanan cloud berbayar — tidak bisa diklik-coba di browser ini. Yang kamu latih di sini adalah KEPUTUSAN ARSITEKTURNYA: kapan lakehouse, kapan warehouse, dan bagaimana merancang lapisan kualitas. Lab mensimulasikan logika medallion dengan kode Python murni, pola 1:1 dengan konsep aslinya.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Rapat direksi dengan tiga angka pendapatan",
      prose: [
        "Kamis, 09:00, PT Maju Bersama. Maya, Head of Data, memproyeksikan tiga slide. Slide Finance: pendapatan Q3 Rp4,2 M (dari Excel yang dirapikan manual). Slide Marketing: Rp4,7 M (dari dataset Power BI yang mereka bangun sendiri). Slide Operasional: Rp3,9 M (dari laporan vendor logistik). Tiga angka, tiga tim, tiga \u201Ckebenaran\u201D — dan direksi menatap Maya: \u201Cjadi yang benar yang mana?\u201D",
        "Investigasi seminggu kemudian menemukan akar yang memalukan: ketiga tim MENGUNDUH data yang sama dari ERP, lalu masing-masing membersihkan dengan caranya sendiri. Finance membuang retur, Marketing tidak; Operasional memakai tanggal kirim, yang lain tanggal faktur. Tidak ada yang salah hitung — sama seperti kasus Riko di BI23, yang rusak adalah arsitekturnya: N salinan × M definisi = N×M kebenaran.",
        "Twist-nya: solusinya BUKAN melarang tim membuat laporan sendiri. Solusinya adalah memastikan semua tim MEMBACA DARI SATU SALINAN yang sama — dengan definisi yang disepakati di lapisan gold. Itulah janji OneLake di Microsoft Fabric: satu danau data, banyak mesin yang memancing di dalamnya.",
        "Di lesson ini kamu belajar arsitekturnya: OneLake, lakehouse vs warehouse, dan medallion — tiga ide yang mengubah \u201Csiapa yang benar?\u201D menjadi \u201Ckita semua membaca danau yang sama.\u201D",
      ],
      tasks: [],
    },
    {
      id: "onelake",
      eyebrow: "Langkah 3 · OneLake",
      title: "OneLake — Si Danau Satu Pintu",
      prose: [
        "Bayangkan data perusahaanmu sebagai danau. Arsitektur lama: setiap tim menggali SUMURNYA SENDIRI — mengambil air (data) dari sumber, menyimpannya di ember masing-masing (file Excel, dataset Power BI terpisah, database tim). Air di tiap ember berbeda kejernihannya karena tiap tim \u201Cmembersihkan\u201D dengan caranya. Hasilnya: rapat dengan tiga angka.",
        "OneLake membalik polanya: SATU danau, banyak dermaga. Data mentah mendarat sekali di danau (dalam format terbuka: Delta/Parquet di atas penyimpanan objek). Tim Finance, Marketing, dan Operasional tidak lagi mengunduh dan menyimpan salinan — mereka memancing langsung dari danau yang sama, lewat mesin yang mereka suka: Power BI, Spark, atau SQL.",
        "Kepribadiannya: OneLake adalah \u201Cperpustakaan pusat\u201D, bukan \u201Cfotokopian\u201D. Dulu tiap tim memfotokopi buku lalu mencoret-coret salinannya; kini semua membaca buku induk yang sama, dan coretan (transformasi) dicatat sebagai lapisan yang bisa diaudit. Satu salinan kebenaran untuk data mentah; definisi bersama untuk data siap bisnis.",
        "Konsekuensi praktisnya: duplikasi penyimpanan turun, tetapi yang lebih penting — PERDEBATAN ANGKA turun. Ketika Marketing dan Finance berselisih, mereka tidak lagi berdebat \u201Cdatamu vs dataku\u201D; mereka membuka lapisan gold yang sama dan berdebat tentang definisinya — perdebatan yang sehat dan bisa diselesaikan.",
        "\uD83D\uDCA1 Intuisi kunci: OneLake tidak menyelesaikan perbedaan definisi bisnis (itu pekerjaan manusia di lapisan gold). Yang ia selesaikan adalah perbedaan yang TIDAK DISENGAJA — tiga salinan yang diam-diam berbeda karena dibersihkan tiga cara.",
      ],
      tasks: [],
      reference: "Satu danau (format terbuka) → banyak mesin baca. Salinan mentah = satu; definisi = disepakati di gold.",
    },
    {
      id: "lakehouse-warehouse",
      eyebrow: "Langkah 4 · Lakehouse vs Warehouse",
      title: "Lakehouse vs Warehouse: gudang terbuka vs brankas",
      prose: [
        "Dua bangunan di tepi danau. WAREHOUSE (gudang klasik): brankas SQL yang rapi — skema ketat saat tulis, query cepat, cocok untuk laporan terstruktur yang polanya sudah jelas. LAKEHOUSE: gudang terbuka — file Delta/Parquet yang bisa dibaca banyak mesin (Spark untuk ML, SQL untuk BI), dengan transaksi ACID sehingga tidak korup saat ditulis bersamaan.",
        "Analoginya: warehouse seperti brankas bank — aman dan teratur, tetapi hanya bisa dibuka dengan kunci bank (mesin SQL itu). Lakehouse seperti gudang dengan pintu standar: siapa pun dengan forklift standar (Spark, Python, Power BI via Direct Lake) bisa mengambil barang. Fleksibilitas vs keteraturan.",
        "Di Fabric keduanya hidup berdampingan di atas OneLake yang sama — dan inilah poin pentingnya: kamu tidak harus memilih SELAMANYA. Pola umum: data mentah dan eksplorasi di lakehouse; tabel-tabel yang sudah stabil dan dipakai ratusan pengguna dipublikasikan ke warehouse/semantic model.",
        "\uD83D\uDCA1 Intuisi kunci: tanya \u201Csiapa yang membaca dan seberapa sering polanya berubah?\u201D Pola baca stabil + banyak pengguna → warehouse. Pola berubah-ubah + butuh ML/Python → lakehouse.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: lakehouse = data lake lama yang diganti nama",
        type: "pitfall",
        body: "Data lake lama adalah \u201Crawa\u201D: file ditumpuk tanpa transaksi, tanpa skema — mudah korup dan sulit dipercaya (itulah kenapa ia dijuluki data swamp). Lakehouse menambahkan TIGA hal yang membedakannya: (1) format tabel terbuka dengan ACID (Delta Lake) — tulis bersamaan tidak merusak data; (2) time travel — bisa melihat versi kemarin; (3) bisa di-query langsung mesin SQL/BI tanpa dipindah. Namanya mirip, sifatnya beda kelas.",
      },
      reference: "Warehouse = brankas SQL untuk pola stabil. Lakehouse = gudang terbuka (Delta/Parquet + ACID) untuk fleksibilitas.",
    },
    {
      id: "medallion",
      eyebrow: "Langkah 5 · Medallion",
      title: "Medallion: tiga gerbang kualitas sebelum dasbor",
      prose: [
        "Medallion adalah cara menata danau menjadi tiga zona. BRONZE: mentah apa adanya — 12 baris dari tiga sumber, persis seperti diterima (termasuk yang kotor). Tujuannya forensik: kalau ada yang aneh di hilir, kamu bisa menelusur ke aslinya. SILVER: bersih dan TERTIP — tipe data benar, duplikat dibuang, yang ditolak DICATAT ALASANNYA (bukan dibuang diam-diam). GOLD: siap bisnis — agregat per cabang dengan definisi yang disepakati.",
        "Cara membaca gambar di bawah: tiga kotak — bronze (12 baris mentah), silver (9 baris bersih, 3 ditolak beralasan), gold (2 agregat cabang: JKT 825rb, SBY 456rb). Panah berlabel menunjukkan gerbangnya: validasi (bronze→silver) dan agregasi (silver→gold). Interpretasi: angka 12→9→2 bukan \u201Cdata hilang\u201D — melainkan JEJAK KUALITAS yang bisa diaudit. Checksum di bawah (1.281.000 = 1.281.000) membuktikan tidak ada rupiah yang tercecer di perjalanan.",
        "Aturan tiap gerbang: bronze TIDAK BOLEH diubah (append-only); silver WAJIB mencatat penolakan (siapa, kenapa); gold WAJIB punya definisi tertulis (\u201Comzet = sum(qty×harga) setelah retur\u201D) dan checksum terhadap silver. Tanpa aturan ini, medallion hanya tiga folder dengan nama logam.",
        "\uD83D\uDCA1 Intuisi kunci: medallion menjawab pertanyaan Maya di rapat: \u201Cangka Marketing dan Finance beda — selisihnya nyangkut di gerbang mana?\u201D Dengan jejak 12→9→2, jawabannya bisa dilacak dalam menit, bukan seminggu investigasi.",
      ],
      figure: {
        svg: BIZ24_MEDALLION_SVG,
        alt: "Diagram medallion: bronze 12 baris menjadi silver 9 baris lalu gold 2 agregat cabang.",
        caption: "Tiga gerbang, satu jejak audit: 12 → 9 → 2, dengan checksum 1.281.000 yang cocok di kedua sisi.",
      },
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: gold = salin silver lalu GROUP BY, selesai",
        type: "pitfall",
        body: "Agregasi tanpa definisi dan tanpa checksum adalah cara baru membuat \u201Ctiga angka berbeda\u201D. Gold yang benar punya: (1) definisi tertulis yang disepakati semua tim, (2) checksum terhadap silver (total harus cocok), (3) pemilik yang jelas kalau angkanya dipertanyakan. Di lab, checksum 1.281.000 = 1.281.000 adalah bukti gerbang agregasimu tidak menelan rupiah.",
      },
      reference: "Bronze append-only · silver catat penolakan · gold definisi + checksum.",
    },
    {
      id: "komponen",
      eyebrow: "Langkah 6 · Komponen Fabric",
      title: "Komponen Fabric dalam bahasa bisnis (dan bingkai jujur)",
      prose: [
        "Tiga komponen yang perlu kamu kenal — cukup untuk berdiskusi dengan tim data, tanpa harus bisa mengkliknya hari ini. DATA PIPELINE: orkestrasi \u201Cpindahkan data dari A ke B jam 2 pagi\u201D — mirip Airflow (lihat D19 di track Python) tetapi terintegrasi. DATAFLOW GEN2: transformasi visual (Power Query) yang hasilnya ditulis ke lakehouse — jembatan bagi analis yang belum menulis Python. DIRECT LAKE: Power BI membaca file Delta/Parquet LANGSUNG tanpa import/duplikasi — dasbor tetap cepat tanpa dataset ganda.",
        "Bingkai jujur: Fabric adalah layanan cloud BERBAYAR dengan kapasitas (SKU) yang tidak murah untuk perusahaan kecil. Tidak semua organisasi butuh Fabric — idenya (satu danau + medallion + definisi bersama) bisa diterapkan dengan tool lain. Yang kamu bawa pulang dari lesson ini adalah POLA PIKIRNYA, bukan tombol-tombolnya.",
        "Kapan Fabric masuk akal: (1) sudah terinvestasi di ekosistem Microsoft (Power BI Premium); (2) >3 tim memakai data yang sama dengan definisi berselisih; (3) ada kebutuhan ML + BI di atas data yang sama. Kapan TIDAK: satu tim, satu dasbor, data < 100 GB — itu seperti membeli truk tronton untuk belanja mingguan.",
      ],
      tasks: [],
    },
    {
      id: "lab-medallion",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: bangun tiga gerbang medallion",
      prose: [
        "12 baris mentah dari tiga sumber (bronze) — dengan qty kosong, format \u201C15.000\u201D, tanggal \u201C2026/10/06\u201D, typo case, satu duplikat, satu qty negatif. Tugasmu: (t1) bangun `silver` (list dict) + `ditolak` (list tuple id–alasan) dengan aturan: qty kosong → tolak, qty negatif → tolak, duplikat konten → tolak, sisanya dinormalisasi (case, format angka, format tanggal); (t2) bangun `emas` (dict cabang → omzet) dan cetak checksum silver vs gold.",
        "Perhatikan: baris yang ditolak TIDAK hilang — ia tercatat di `ditolak` beserta alasannya. Itulah beda medallion dengan \u201Cskrip pembersih biasa\u201D: jejak auditnya utuh.",
        "Coba juga: apa yang terjadi pada checksum jika kamu \u201Clupa\u201D mencatat satu penolakan dan malah membuangnya diam-diam? Checksum tetap cocok — dan itulah pelajaran pentingnya: checksum menjaga ANGKA, tetapi hanya catatan penolakan yang menjaga KEPERCAYAAN.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `silver` + `ditolak`: parsing, normalisasi, tolak beralasan" },
        { id: "t2", text: "Bangun `emas` (cabang → omzet) dan cetak checksum" },
      ],
      expected: "bronze: 12 -> silver: 9 (ditolak: 3)\ntolak TRX003: qty kosong\ntolak TRX007: duplikat\ntolak TRX011: qty negatif\nemas JKT: 825000\nemas SBY: 456000\nchecksum: 1281000 == 1281000",
      note: {
        title: "Sering salah",
        body: "Kunci dedup harus memakai nilai yang SUDAH dinormalisasi: (tanggal, cabang, produk.lower(), qty, harga). Kalau memakai produk apa adanya, \u201Ckopi a\u201D vs \u201CKopi A\u201D dianggap beda dan duplikat TRX007 lolos. Normalisasi dulu, baru bandingkan — pola yang sama seperti di BI23.",
      },
      hints: [
        "Pecah tiap baris dengan split(\",\"), lalu tangani: qty kosong → ditolak; int(harga.replace(\".\", \"\")); tanggal .replace(\"/\", \"-\").",
        "Kunci dedup = (tgl, cabang, produk.lower(), qty, harga); simpan yang sudah terlihat di set.",
        "emas[cabang] += qty*harga; checksum = sum omzet silver vs sum emas.values().",
      ],
      code: {
        starter: `# 12 baris mentah dari tiga sumber (bronze) — JANGAN UBAH
bronze = [
    "TRX001,2026-10-01,JKT,Kopi A,10,15000",
    "TRX002,2026-10-01,JKT,kopi a,5,15000",
    "TRX003,2026-10-02,JKT,Kopi A,,15000",
    "TRX004,2026-10-02,JKT,Kopi A,8,15.000",
    "TRX005,2026-10-03,SBY,Teh B,20,8000",
    "TRX006,2026-10-04,SBY,Teh B,15,8000",
    "TRX007,2026-10-04,SBY,Teh B,15,8000",
    "TRX008,2026-10-05,JKT,Kopi A,12,15000",
    "TRX009,2026/10/06,JKT,Kopi A,9,15000",
    "TRX010,2026-10-07,SBY,Teh B,22,8000",
    "TRX011,2026-10-08,JKT,Kopi A,-4,15000",
    "TRX012,2026-10-08,JKT,Kopi A,11,15000",
]

# ── TULIS KODEMU di bawah garis ini ──
silver = []        # t1: list dict baris bersih
ditolak = []       # t1: list (id, alasan)
emas = {}          # t2: dict cabang -> omzet
print(f"bronze: {len(bronze)} -> silver: {len(silver)} (ditolak: {len(ditolak)})")
for tid, alasan in ditolak:
    print(f"tolak {tid}: {alasan}")
for cabang in sorted(emas):
    print(f"emas {cabang}: {emas[cabang]}")
print(f"checksum: {sum(r['omzet'] for r in silver)} == {sum(emas.values())}")`,
        lockLines: 16,
        solution: `# 12 baris mentah dari tiga sumber (bronze) — JANGAN UBAH
bronze = [
    "TRX001,2026-10-01,JKT,Kopi A,10,15000",
    "TRX002,2026-10-01,JKT,kopi a,5,15000",
    "TRX003,2026-10-02,JKT,Kopi A,,15000",
    "TRX004,2026-10-02,JKT,Kopi A,8,15.000",
    "TRX005,2026-10-03,SBY,Teh B,20,8000",
    "TRX006,2026-10-04,SBY,Teh B,15,8000",
    "TRX007,2026-10-04,SBY,Teh B,15,8000",
    "TRX008,2026-10-05,JKT,Kopi A,12,15000",
    "TRX009,2026/10/06,JKT,Kopi A,9,15000",
    "TRX010,2026-10-07,SBY,Teh B,22,8000",
    "TRX011,2026-10-08,JKT,Kopi A,-4,15000",
    "TRX012,2026-10-08,JKT,Kopi A,11,15000",
]

# ── TULIS KODEMU di bawah garis ini ──
silver = []        # t1: list dict baris bersih
ditolak = []       # t1: list (id, alasan)
terlihat = set()
for baris in bronze:
    tid, tgl, cabang, produk, qty_s, harga_s = [p.strip() for p in baris.split(",")]
    if not qty_s:
        ditolak.append((tid, "qty kosong")); continue
    qty = int(qty_s)
    harga = int(harga_s.replace(".", ""))
    tgl = tgl.replace("/", "-")
    kunci = (tgl, cabang, produk.lower(), qty, harga)
    if kunci in terlihat:
        ditolak.append((tid, "duplikat")); continue
    if qty < 0:
        ditolak.append((tid, "qty negatif")); continue
    terlihat.add(kunci)
    silver.append({"id": tid, "tgl": tgl, "cabang": cabang, "produk": produk.title(),
                   "qty": qty, "harga": harga, "omzet": qty * harga})
emas = {}          # t2: dict cabang -> omzet
for r in silver:
    emas[r["cabang"]] = emas.get(r["cabang"], 0) + r["omzet"]
print(f"bronze: {len(bronze)} -> silver: {len(silver)} (ditolak: {len(ditolak)})")
for tid, alasan in ditolak:
    print(f"tolak {tid}: {alasan}")
for cabang in sorted(emas):
    print(f"emas {cabang}: {emas[cabang]}")
print(f"checksum: {sum(r['omzet'] for r in silver)} == {sum(emas.values())}")`,
        checks: [
          { kind: "defined", task: "t1", name: "silver", label: "`silver` terdefinisi", msg: "Isi list dict baris bersih." },
          { kind: "defined", task: "t1", name: "ditolak", label: "`ditolak` terdefinisi", msg: "Catat tiap penolakan beserta alasannya." },
          { kind: "stdout_matches", task: "t1", pattern: "bronze: 12 -> silver: 9 \\(ditolak: 3\\)", label: "9 bersih, 3 ditolak", msg: "12 − 3 penolakan = 9." },
          { kind: "stdout_matches", task: "t1", pattern: "tolak TRX003: qty kosong", label: "TRX003 ditolak", msg: "qty kosong wajib ditolak beralasan." },
          { kind: "stdout_matches", task: "t1", pattern: "tolak TRX007: duplikat", label: "TRX007 duplikat", msg: "Kunci dedup memakai produk.lower()." },
          { kind: "stdout_matches", task: "t1", pattern: "tolak TRX011: qty negatif", label: "TRX011 ditolak", msg: "qty negatif wajib ditolak beralasan." },
          { kind: "stdout_matches", task: "t2", pattern: "emas JKT: 825000", label: "Gold JKT = 825.000", msg: "Jumlahkan omzet silver cabang JKT." },
          { kind: "stdout_matches", task: "t2", pattern: "emas SBY: 456000", label: "Gold SBY = 456.000", msg: "Jumlahkan omzet silver cabang SBY." },
          { kind: "stdout_matches", task: "t2", pattern: "checksum: 1281000 == 1281000", label: "Checksum cocok", msg: "Total silver harus sama dengan total gold." },
        ],
      },
      reference: "Tolak beralasan, jangan buang diam-diam. Checksum menjaga angka; catatan menjaga kepercayaan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: butuh Fabric, atau cukup pola pikirnya?",
      prose: [
        "Skenario 1 — 3+ tim, definisi berselisih, sudah di Power BI Premium: → evaluasi Fabric (OneLake + lakehouse). Alasan: masalahnya arsitektural, bukan orangnya.",
        "Skenario 2 — Satu tim, satu dasbor, data < 100 GB: → JANGAN beli Fabric; terapkan medallion dengan tool yang ada (folder bronze/silver/gold + skrip). Alasan: truk tronton untuk belanja mingguan.",
        "Skenario 3 — Butuh ML dan BI di atas data yang sama: → lakehouse (Delta/Parquet terbuka). Alasan: satu salinan dibaca Spark dan Power BI sekaligus.",
        "Skenario 4 — Laporan keuangan yang polanya stabil, 500 pengguna: → warehouse/semantic model. Alasan: brankas untuk pola baca yang mapan.",
        "Skenario 5 — \u201CKami mau Fabric tapi budget belum ada\u201D: → mulai dari DISIPLINNYA: satu folder mentah append-only, catatan penolakan, definisi gold tertulis. Alasan: 80% manfaat Fabric adalah disiplin, 20% tool-nya.",
        "Aturan praktis 10 detik: hitung \u201Cberapa salinan data mentah yang hidup hari ini?\u201D Lebih dari 2 dan sering berselisih → kamu butuh danau, bukan ember baru.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: proposal migrasi Maya",
      prose: [
        "Konteks: PT Maju Bersama. Maya mengusulkan: (1) hentikan unduhan ERP per tim — satu ingestion malam ke OneLake (bronze); (2) tim data pusat mengelola silver dengan aturan penolakan tercatat; (3) definisi \u201Cpendapatan\u201D disepakati tertulis di gold: sum(qty×harga) setelah retur, tanggal = tanggal faktur. Estimasi biaya Fabric: Rp180 jt/tahun. Biaya status quo: tiap kuartal ±2 minggu investigasi selisih angka (3 analis × Rp15 jt/bulan ≈ Rp90 jt/kuartal waktu terbuang) + satu keputusan salah per tahun (estimasi Rp500 jt).",
        "Pertanyaan: (1) hitung payback kasar proposal ini dalam setahun; (2) apa risiko TERBESAR migrasi ini — teknis atau manusia? (3) jika direksi menolak budget Fabric, apa versi \u201Ctanpa Fabric\u201D yang tetap menyelesaikan masalah tiga angka?",
        "Pembahasan: (1) penghematan ≈ 4×90 jt + 500 jt = Rp860 jt/tahun vs biaya 180 jt → payback ~2,5 bulan. (2) manusia: tim yang terbiasa \u201Cbersih sendiri\u201D akan resistensi; definisi gold butuh negosiasi politik antar-tim (Finance vs Marketing soal perlakuan retur). Teknologi adalah bagian mudah. (3) versi tanpa Fabric: satu folder jaringan append-only untuk file mentah + satu skrip cleaning pusat (pola lab ini) + dokumen definisi yang ditandatangani ketiga kepala tim + dasbor membaca dari tabel gold bersama. Disiplinnya sama; yang hilang hanya kemudahan managed service.",
        "\uD83D\uDCA1 Intuisi kunci: Maya tidak menjual \u201CFabric\u201D — ia menjual \u201Cberakhirnya rapat tiga angka\u201D. Teknologi apa pun yang mencapai itu (Fabric, medallion manual, atau data contract) adalah jawaban yang benar. Jangan jatuh cinta pada tool; jatuh cintalah pada masalah yang ia selesaikan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang Fabric dan medallion. Ingat: danau satu, definisi satu.",
      ],
      tasks: [],
      summary: [
        "OneLake: satu salinan data mentah (format terbuka), banyak mesin baca — mengakhiri N salinan × M definisi.",
        "Warehouse = brankas SQL untuk pola stabil; lakehouse = gudang terbuka (Delta/Parquet + ACID) untuk fleksibilitas ML + BI.",
        "Medallion: bronze append-only (forensik) → silver (tolak beralasan) → gold (definisi tertulis + checksum).",
        "Data Pipeline = orkestrasi; Dataflow Gen2 = transformasi visual; Direct Lake = Power BI baca Delta langsung.",
        "Fabric masuk akal bila: ekosistem Microsoft + banyak tim + definisi berselisih; jika tidak, terapkan disiplinnya dulu.",
        "Teknologi bagian mudah; negosiasi definisi antar-tim adalah bagian sulit.",
      ],
      next: { label: "BI25 — Report Automation: Dashboard yang Memperbarui Dirinya", href: "/learn/biz25-report-automation" },
      quiz: [
        {
          q: "Akar masalah “tiga angka pendapatan” di cerita adalah…",
          options: [
            { text: "Ada analis yang salah hitung", why: "Tidak ada yang salah hitung — ketiganya benar menurut definisinya masing-masing." },
            { text: "Tiga salinan data yang dibersihkan dengan tiga cara berbeda", why: "Tepat: N salinan × M definisi. Solusinya satu danau + definisi bersama, bukan analis yang lebih teliti.", correct: true },
            { text: "Power BI-nya error", why: "Tool-nya sehat; arsitekturnya yang sakit." },
            { text: "Datanya kurang banyak", why: "Volume bukan masalah — salinan dan definisilah masalahnya." },
          ],
        },
        {
          q: "Perbedaan UTAMA lakehouse dibanding data lake lama adalah…",
          options: [
            { text: "Namanya lebih modern", why: "Nama tidak mengubah sifat." },
            { text: "Format tabel terbuka dengan ACID + time travel + bisa di-query langsung", why: "Tepat: Delta/Parquet + transaksi + time travel = data lake yang bisa dipercaya.", correct: true },
            { text: "Hanya bisa dibaca oleh Spark", why: "Justru sebaliknya — banyak mesin bisa membaca." },
            { text: "Tidak butuh skema sama sekali", why: "Lakehouse tetap punya skema tabel; bedanya fleksibel, bukan tanpa skema." },
          ],
        },
        {
          q: "Di lapisan silver, baris yang ditolak harus…",
          options: [
            { text: "Dihapus diam-diam agar data bersih", why: "Itu menghilangkan jejak audit — kepercayaan hilang." },
            { text: "Dicatat beserta alasannya", why: "Tepat: penolakan beralasan adalah jejak kualitas. Angka dijaga checksum, kepercayaan dijaga catatan.", correct: true },
            { text: "Diperbaiki otomatis tanpa dicatat", why: "Perbaikan otomatis tanpa catatan = perubahan tak terlacak." },
            { text: "Dipindah ke bronze lagi", why: "Bronze append-only untuk data mentah; penolakan adalah metadata silver." },
          ],
        },
        {
          q: "Checksum “1.281.000 = 1.281.000” membuktikan…",
          options: [
            { text: "Data mentahnya sudah benar", why: "Checksum tidak menilai kebenaran data mentah — hanya kelengkapan perpindahan." },
            { text: "Tidak ada rupiah yang hilang/tercipta antara silver dan gold", why: "Tepat: checksum menjaga kelengkapan agregasi, bukan kebenaran bisnis.", correct: true },
            { text: "Definisi pendapatannya sudah disepakati", why: "Itu pekerjaan manusia di dokumen definisi, bukan angka." },
            { text: "Tidak ada duplikat di bronze", why: "Dedup terjadi di gerbang bronze→silver, bukan dibuktikan checksum." },
          ],
        },
        {
          q: "Perusahaan satu tim, satu dasbor, data 40 GB, belum ada konflik definisi. Keputusan Fabric yang tepat?",
          options: [
            { text: "Beli Fabric sekarang agar future-proof", why: "Truk tronton untuk belanja mingguan." },
            { text: "Terapkan disiplin medallion dengan tool yang ada; evaluasi Fabric saat masalahnya muncul", why: "Tepat: 80% manfaat adalah disiplin. Beli tool saat arsitekturnya memang butuh.", correct: true },
            { text: "Tunggu sampai ada 10 tim baru", why: "Menunggu masalah membesar bukan strategi." },
            { text: "Pindah semua ke spreadsheet agar sederhana", why: "Mundur — masalah skala kecil bukan alasan meninggalkan praktik baik." },
          ],
        },
        {
          q: "Direct Lake dalam Fabric memungkinkan Power BI untuk…",
          options: [
            { text: "Mengimpor seluruh data ke dataset internal", why: "Itu mode Import lama — justru yang ingin dihindari." },
            { text: "Membaca file Delta/Parquet langsung tanpa duplikasi dataset", why: "Tepat: cepat tanpa dataset ganda — dasbor membaca danau yang sama.", correct: true },
            { text: "Menulis kembali ke lakehouse", why: "Direct Lake adalah mode baca." },
            { text: "Menggantikan kebutuhan data engineer", why: "Tidak — pipeline dan medallion tetap butuh perancang." },
          ],
        },
      ],
    },
  ],
};
