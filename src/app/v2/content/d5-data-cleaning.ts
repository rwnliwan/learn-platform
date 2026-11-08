import type { V2Lesson } from "../lib/types";

const CSV_KOTOR = `id,nama,kota,penghasilan,dpd,updated_at
1,Andi,Jakarta,8500000,0,2026-09-01
2,Budi,Bandung,12000000,15,2026-09-01
3,Citra,Jakarta,6700000,45,2026-09-01
4,Dewi,Surabaya,15000000,0,2026-09-01
5,Eko,Jakarta,,90,2026-09-01
2,Budi,Bandung,12500000,15,2026-09-05
6,Fahri,Medan,500000000,5,2026-09-01
7,Gita,Jakarta,abc,10,2026-09-01`;

const CSV_WARUNG = `id,nama_barang,harga_satuan,stok,tgl_update
101,Indomie Goreng,3500,120,2026-10-01
102,Kopi Kapal Api,12000,80,2026-10-01
103,Teh Botol,5000,,2026-10-01
104,Aqua 600ml,4000,200,2026-10-01
105,Chitato,11000,45,2026-10-01
102,Kopi Kapal Api,12500,75,2026-10-05
106,Pocky,9000,60,2026-10-01
107,Sari Roti,gratis,90,2026-10-01
108,Ultra Milk,8000,,2026-10-01`;

export const d5: V2Lesson = {
  slug: "d5-data-cleaning",
  track: "Python",
  module: "pandas",
  title: "D5 Data Cleaning: dtype, Missing, Duplikat, Outlier",
  estMinutes: 60,
  steps: [
    {
      id: "dtype",
      eyebrow: "Langkah 1 · dtype",
      title: "Cerita pembuka: 80% waktu untuk cleaning",
      prose: [
        "Survei industri konsisten: data scientist menghabiskan 80% waktu untuk cleaning. Bukan karena lambat — karena data nyata kotor: tipe salah, hilang, duplikat, outlier, teks berantakan. Kabar baik: 90% cleaning adalah pola berulang yang bisa dihafal.",
        "Langkah pertama selalu perbaiki tipe. `pd.to_numeric(..., errors='coerce')` mengubah yang gagal jadi NaN tanpa crash; `pd.to_datetime` untuk tanggal; `astype('category')` untuk kolom sedikit nilai unik. Banyak error hilang setelah tipe benar — jadi dtype dulu, baru lainnya.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Konversi kolom `penghasilan` ke numerik dengan `errors='coerce'`" },
        { id: "t2", text: "Hitung `n_gagal` = berapa yang jadi NaN" },
      ],
      expected: "n_gagal=2",
      note: {
        title: "Sering salah",
        body: "Mengabaikan hasil `errors='coerce'` tanpa menghitung berapa yang jadi NaN. Jika banyak yang gagal, format datamu tidak seperti dugaan — investigasi, jangan abaikan. Selalu ukur: `df['x'].isna().sum()` setelah konversi.",
      },
      hints: [
        "Konsep: kolom angka yang tersimpan sebagai teks harus diperbaiki tipenya SEBELUM dianalisis. Nilai yang tidak bisa dikonversi jangan membuat program crash — tandai sebagai kosong (NaN), lalu ukur berapa banyak yang gagal: itu bahan investigasi.",
        "Clue: `to_numeric` dengan mode toleran `errors='coerce'`, lalu `isna().sum()` untuk menghitung yang gagal.",
        "Skeleton: df['penghasilan'] = ...(df['penghasilan'], ...)\nn_gagal = ....sum()",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\nprint("dtype awal:", df['penghasilan'].dtype)\n\n# TULIS KODEMU\ndf['penghasilan'] = \nn_gagal = \n\nprint(f"n_gagal={n_gagal}")`,
        lockLines: 6,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\nprint("dtype awal:", df['penghasilan'].dtype)\n\n# TULIS KODEMU\ndf['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\nn_gagal = int(df['penghasilan'].isna().sum())\n\nprint(f"n_gagal={n_gagal}")`,
        checks: [
          { kind: "equal", task: "t2", name: "n_gagal", value: 2, tol: 1e-9, label: "`n_gagal` = 2", msg: "Eko (kosong) dan Gita ('abc') gagal konversi." },
          { kind: "stdout_matches", task: "t2", pattern: "n_gagal=2", label: "`print` menampilkan n_gagal", msg: "Format: n_gagal=2." },
        ],
      },
      reference: "pd.to_numeric(..., errors='coerce') / pd.to_datetime. Ukur isna().sum() setelahnya.",
    },
    {
      id: "missing",
      eyebrow: "Langkah 2 · Missing",
      title: "Deteksi, pahami, tindakan — lalu tandai",
      prose: [
        "Jangan imputasi buta. Tanya dulu mengapa hilang: jika gaji Eko hilang karena ia pengangguran, imputasi median salah total. Setelah memilih strategi — misal median untuk numerik skew — tandai yang diimputasi: `df['gaji_imputed'] = df['penghasilan'].isna()`.",
        "Dan jangan imputasi sebelum split train-test: memakai statistik full data membocorkan info test (data leakage, D10/D12). Imputasi memakai statistik train saja.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Tandai `df['gaji_imputed']` lalu imputasi median ke `penghasilan`" },
        { id: "t2", text: "Hitung `n_imputed` dan `median_imputasi`" },
      ],
      expected: "n_imputed=2  median=12250000",
      note: {
        title: "Sering salah",
        body: "Mengisi semua missing dengan rata-rata tanpa bertanya mekanismenya. Missing 60% yang struktural (mis. alasan_telat hanya diisi jika telat) bukan missing — mengisinya menghancurkan sinyal. Pahami dulu, baru pilih teknik.",
      },
      hints: [
        "Konsep: imputasi tanpa memahami kenapa data hilang itu menebak. Median cocok untuk angka yang miring (skew) — tapi kamu harus bisa membedakan baris asli vs baris yang kamu isi sendiri, jadi tandai dulu SEBELUM mengisi.",
        "Clue: `median()` untuk statistiknya, `isna()` untuk penandanya, `fillna()` untuk mengisinya.",
        "Skeleton: median_imputasi = df['penghasilan']....\ndf['gaji_imputed'] = ...\ndf['penghasilan'] = df['penghasilan']....(median_imputasi)",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\ndf['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\n\n# TULIS KODEMU: tandai, hitung median, imputasi\nmedian_imputasi = \ndf['gaji_imputed'] = \ndf['penghasilan'] = \nn_imputed = int(df['gaji_imputed'].sum())\n\nprint(f"n_imputed={n_imputed}  median={median_imputasi:.0f}")`,
        lockLines: 5,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\ndf['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\n\n# TULIS KODEMU: tandai, hitung median, imputasi\nmedian_imputasi = df['penghasilan'].median()\ndf['gaji_imputed'] = df['penghasilan'].isna()\ndf['penghasilan'] = df['penghasilan'].fillna(median_imputasi)\nn_imputed = int(df['gaji_imputed'].sum())\n\nprint(f"n_imputed={n_imputed}  median={median_imputasi:.0f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "median_imputasi", value: 12250000.0, tol: 1e-9, label: "`median_imputasi` = 12250000", msg: "Median dari nilai valid (termasuk duplikat Budi 12,5jt)." },
          { kind: "equal", task: "t2", name: "n_imputed", value: 2, tol: 1e-9, label: "`n_imputed` = 2", msg: "Dua baris ditandai sebelum diimputasi." },
          { kind: "stdout_matches", task: "t2", pattern: "n_imputed=2\\s+median=12250000", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Tandai imputasi: df['x_imputed'] = df['x'].isna(). Jangan imputasi sebelum split.",
    },
    {
      id: "duplikat",
      eyebrow: "Langkah 3 · Duplikat",
      title: "Aturan menang yang eksplisit",
      prose: [
        "Duplikat sempurna (semua kolom sama) lawan duplikat parsial (id sama, atribut beda) — yang kedua butuh aturan menang. Di data ini, id 2 muncul dua kali dengan penghasilan berbeda dan tanggal update berbeda.",
        "Pola: sort dulu berdasarkan `updated_at`, lalu `drop_duplicates('id', keep='last')` — terbaru menang. Jangan `drop_duplicates` buta tanpa subset yang dipikirkan: definisikan dulu apa itu duplikat bagimu.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `n_dup` = duplikat pada kolom `id`" },
        { id: "t2", text: "Dedup dengan aturan terbaru menang, hitung `n_akhir`" },
      ],
      expected: "n_dup=1  n_akhir=7",
      note: {
        title: "Sering salah",
        body: "Memakai `drop_duplicates()` tanpa subset — hanya menghapus baris identik penuh. Duplikat parsial (id sama, atribut beda) lolos dan meracuni agregat. Selalu pikirkan subset key-nya.",
      },
      hints: [
        "Konsep: duplikat parsial (id sama, atribut beda) butuh ATURAN MENANG yang eksplisit — putuskan dulu baris mana yang bertahan (misalnya data terbaru), baru buang sisanya. Dan ukur dulu: berapa duplikatnya?",
        "Clue: `duplicated()` untuk menghitung, `sort_values()` untuk mengurutkan, `drop_duplicates()` dengan `keep` untuk aturan menang.",
        "Skeleton: n_dup = ....sum()\ndf = df....('updated_at')....('id', keep=...)",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nn_dup = \ndf = \nn_akhir = len(df)\n\nprint(f"n_dup={n_dup}  n_akhir={n_akhir}")`,
        lockLines: 4,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU\nn_dup = int(df.duplicated('id').sum())\ndf = df.sort_values('updated_at').drop_duplicates('id', keep='last')\nn_akhir = len(df)\n\nprint(f"n_dup={n_dup}  n_akhir={n_akhir}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_dup", value: 1, tol: 1e-9, label: "`n_dup` = 1", msg: "id 2 muncul dua kali." },
          { kind: "equal", task: "t2", name: "n_akhir", value: 7, tol: 1e-9, label: "`n_akhir` = 7", msg: "8 - 1 = 7; yang terbaru (12,5jt) menang." },
          { kind: "stdout_matches", task: "t2", pattern: "n_dup=1\\s+n_akhir=7", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "df.duplicated(subset). Sort + drop_duplicates(subset, keep='first'/'last').",
    },
    {
      id: "outlier",
      eyebrow: "Langkah 4 · Outlier",
      title: "Deteksi dengan IQR, tindakan dengan investigasi",
      prose: [
        "Metode IQR: batas atas = Q3 + 1,5 x IQR. Di data ini batasnya Rp 24.750.000 — gaji Fahri Rp 500 juta jauh di atasnya. Tapi outlier bukan vonis: gaji 500jt mungkin direktur (valid!), bukan typo.",
        "Aturan: investigasi dulu, lalu putuskan tercatat — perbaiki jika salah input, winsorize dengan `clip(upper=batas)` jika valid tapi ekstrem, atau biarkan untuk model robust. Jangan hapus diam-diam: outlier mungkin fraud atau peluang.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `batas_atas` IQR dari `penghasilan`" },
        { id: "t2", text: "Hitung `n_outlier` = baris di atas batas" },
      ],
      expected: "batas=24750000  n_outlier=1",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di deteksi fraud, outlier adalah targetnya — bukan sampahnya. Menghapus outlier buta-buta sebelum analisis fraud sama dengan membuang barang bukti. Bedakan 'outlier untuk dibersihkan' dan 'outlier untuk diselidiki' sejak awal.",
      },
      hints: [
        "Konsep: outlier dideteksi dari sebaran data, bukan firasat. Metode IQR memakai kuartil: nilai di atas pagar Q3 + 1,5×IQR layak dicurigai — tapi tetap investigasi dulu sebelum memutuskan tindakan.",
        "Clue: `quantile()` untuk Q1 dan Q3, lalu perbandingan boolean untuk menghitung yang di atas batas.",
        "Skeleton: q1, q3 = df['penghasilan']....\nbatas_atas = ... + 1.5 * (...)\nn_outlier = (...).sum()",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\ndf['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\ndf = df.sort_values('updated_at').drop_duplicates('id', keep='last')\n\n# TULIS KODEMU\nq1, q3 = \nbatas_atas = \nn_outlier = \n\nprint(f"batas={batas_atas:.0f}  n_outlier={n_outlier}")`,
        lockLines: 6,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_KOTOR}"""\ndf = pd.read_csv(io.StringIO(csv))\ndf['penghasilan'] = pd.to_numeric(df['penghasilan'], errors='coerce')\ndf = df.sort_values('updated_at').drop_duplicates('id', keep='last')\n\n# TULIS KODEMU\nq1, q3 = df['penghasilan'].quantile([0.25, 0.75])\nbatas_atas = q3 + 1.5 * (q3 - q1)\nn_outlier = int((df['penghasilan'] > batas_atas).sum())\n\nprint(f"batas={batas_atas:.0f}  n_outlier={n_outlier}")`,
        checks: [
          { kind: "equal", task: "t1", name: "batas_atas", value: 24750000.0, tol: 1.0, label: "`batas_atas` = 24750000", msg: "Q3 + 1.5 x IQR dari penghasilan valid." },
          { kind: "equal", task: "t2", name: "n_outlier", value: 1, tol: 1e-9, label: "`n_outlier` = 1", msg: "Hanya Fahri (500jt) di atas batas." },
          { kind: "stdout_matches", task: "t2", pattern: "batas=24750000\\s+n_outlier=1", label: "`print` menampilkan keduanya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "IQR: q3 + 1.5*iqr. z-score memakai mean/SD — bisa dibutakan outlier sendiri.",
    },
    {
      id: "regex",
      eyebrow: "Langkah 5 · Regex",
      title: "Bedah teks kotor dengan .str",
      prose: [
        "Nomor HP berantakan: '0812-3456-789', '+62 812 3456 789', '08123456789', 'tidak punya'. Accessor `.str` memberi operasi string vectorized: `.str.replace(r'\\D', '', regex=True)` membuang semua non-digit.",
        "Tiga pola menyelamatkan 80% kasus teks: `\\D` (buang non-digit), `\\s+` (spasi berlebih), `^...$` (validasi penuh). Untuk ekstrak kode dari 'JKT-001': `.str.extract(r'([A-Z]+)-\\d+')`.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Buat `hp_bersih` = digit saja dari kolom `hp`" },
        { id: "t2", text: "Buat `hp_valid` = panjang 10-14 digit, hitung `n_valid`" },
      ],
      expected: "n_valid=3",
      note: {
        title: "Sering salah",
        body: "Lupa `regex=True` di `str.replace` versi baru, atau menulis pola tanpa raw string sehingga backslash hilang. Selalu pakai raw string `r'...'` untuk regex.",
      },
      hints: [
        "Konsep: teks kotor dibersihkan dengan pola, bukan satu per satu. Accessor `.str` menerapkan pola ke seluruh kolom sekaligus: pertama saring hanya digitnya, lalu validasi panjangnya.",
        "Clue: `str.replace()` dengan pola regex, `str.len()` untuk panjang, `between()` untuk rentang valid.",
        "Skeleton: df['hp_bersih'] = df['hp'].str.replace(..., '', regex=True)\ndf['hp_valid'] = df['hp_bersih'].str.len().(...)\nn_valid = ....sum()",
      ],
      code: {
        starter: `import pandas as pd\n\ndf = pd.DataFrame({\n    "nama": ["Andi", "Budi", "Citra", "Dewi"],\n    "hp": ["0812-3456-789", "+62 812 3456 789", "08123456789", "tidak punya"],\n})\n\n# TULIS KODEMU\ndf['hp_bersih'] = \ndf['hp_valid'] = \nn_valid = \n\nprint(f"n_valid={n_valid}")\nprint(df[['hp', 'hp_bersih']].to_string())`,
        lockLines: 6,
        solution: `import pandas as pd\n\ndf = pd.DataFrame({\n    "nama": ["Andi", "Budi", "Citra", "Dewi"],\n    "hp": ["0812-3456-789", "+62 812 3456 789", "08123456789", "tidak punya"],\n})\n\n# TULIS KODEMU\ndf['hp_bersih'] = df['hp'].str.replace(r'\\D', '', regex=True)\ndf['hp_valid'] = df['hp_bersih'].str.len().between(10, 14)\nn_valid = int(df['hp_valid'].sum())\n\nprint(f"n_valid={n_valid}")\nprint(df[['hp', 'hp_bersih']].to_string())`,
        checks: [
          { kind: "equal", task: "t2", name: "n_valid", value: 3, tol: 1e-9, label: "`n_valid` = 3", msg: "'tidak punya' jadi string kosong — tidak valid." },
          { kind: "stdout_matches", task: "t2", pattern: "n_valid=3", label: "`print` menampilkan n_valid", msg: "Format: n_valid=3." },
        ],
      },
      reference: "Pol a regex: r'\\D' (non-digit), r'\\s+' (spasi), r'^...$' (validasi penuh) via .str.",
    },
    {
      id: "minicase-audit",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Audit cleaning: laporan kualitas 5 kalimat",
      prose: [
        "Kamu menerima CSV 50.000 baris, atasan minta analisis siap besok pagi. Checklist 10 langkah: dtypes, missing per kolom, duplikat, validitas range, konsistensi bisnis, outlier, teks, tanggal, relasi antar tabel, snapshot sebelum/sesudah.",
        "Laporan contoh: dari 50.000 baris, 3% missing penghasilan (diimputasi median, ditandai), 1,2% duplikat (terbaru menang), 7 outlier di atas batas IQR (2 dikoreksi typo, 5 valid dipertahankan), 0 inkonsistensi status. Data siap analisis dengan catatan terlampir. Laporan cleaning adalah kepercayaan: analis yang melampirkan catatan data 1 paragraf adalah analis yang dipercaya angkanya.",
      ],
      tasks: [],
      reference: "Checklist: dtype, missing, duplikat, range, konsistensi, outlier, teks, tanggal, relasi, snapshot.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi",
      title: "Intuisi: cleaning adalah kontrak validitas, bukan fase",
      prose: [
        "Data cleaning yang baik tidak terlihat seperti bersih-bersih — terlihat seperti kontrak eksplisit tentang apa yang dianggap valid.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: cleaning adalah kontrak validitas, bukan fase",
        body: "Kesalahan termahal dalam cleaning bukan data kotor yang lolos — melainkan data BERSIH yang dibuang atau diubah tanpa jejak. Heuristik pertama: jangan pernah membersihkan sebelum memeriksa — describe, value_counts, dan contoh baris aneh dulu, transformasi kemudian; cleaning buta mengubah \"data aneh tapi benar\" menjadi \"data rapi tapi salah\". Heuristik kedua: karantina, jangan hapus — baris bermasalah dipisah ke tabel quarantine dengan alasannya, bukan di-drop diam-diam; 3 bulan kemudian seseorang akan bertanya \"ke mana 2.317 baris itu pergi\" dan kamu harus bisa menjawab. Heuristik ketiga: simpan mentahnya — pipeline cleaning harus bisa di-rerun dari data mentah kapan pun; file mentah adalah satu-satunya kebenaran yang tidak bisa direkayasa ulang. Heuristik keempat: cleaning sebagai kode dengan assert — setiap asumsi (gaji >= 0, id unik, tanggal tidak di masa depan) ditulis sebagai pemeriksaan yang gagal berisik, bukan komentar yang dilupakan. Dan aturan 80/20: perbaikan dtype + penanganan missing yang jujur menutupi 80% masalah cleaning nyata — sisanya (regex, outlier, fuzzy match) adalah 20% yang memakan 80% waktumu, jadi kerjakan hanya bila keputusannya berubah karenanya.",
      },
      reference: "Periksa dulu; karantina bukan hapus; simpan mentah; asumsi = assert; 80/20 — kerjakan yang mengubah keputusan.",
    },
    {
      id: "transfer-warung",
      kind: "transfer",
      eyebrow: "Transfer check · tanpa petunjuk",
      title: "Kasus baru: data stok koperasi UMKM",
      requires: ["pandas"],
      prose: [
        "Skenario BARU — tanpa petunjuk, tanpa hasil yang diharapkan. Kamu membantu koperasi UMKM merapikan data stok 9 barang dari catatan warung: kolom `harga_satuan` tercampur teks, dan ada `id` yang tercatat dua kali dengan harga berbeda.",
        "Terapkan pola yang sama seperti langkah 1–3: perbaiki tipe dengan mode toleran dan ukur yang gagal; hitung duplikat pada kunci `id`, lalu terapkan aturan terbaru menang berdasarkan `tgl_update`.",
      ],
      tasks: [
        { id: "t1", text: "Konversi `harga_satuan` ke numerik (mode toleran), hitung `n_gagal_harga` = yang jadi NaN" },
        { id: "t2", text: "Hitung `n_dup_id` = duplikat pada `id`; dedup terbaru menang, hitung `n_akhir`" },
      ],
      noLiteral: ["n_gagal_harga", "n_dup_id", "n_akhir"],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """${CSV_WARUNG}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU: konversi harga, hitung gagal, dedup terbaru menang\ndf['harga_satuan'] = \nn_gagal_harga = \nn_dup_id = \ndf = \nn_akhir = len(df)\n\nprint(f"n_gagal_harga={n_gagal_harga}  n_dup_id={n_dup_id}  n_akhir={n_akhir}")`,
        lockLines: 14,
        solution: `import pandas as pd, io\n\ncsv = """${CSV_WARUNG}"""\ndf = pd.read_csv(io.StringIO(csv))\n\n# TULIS KODEMU: konversi harga, hitung gagal, dedup terbaru menang\ndf['harga_satuan'] = pd.to_numeric(df['harga_satuan'], errors='coerce')\nn_gagal_harga = int(df['harga_satuan'].isna().sum())\nn_dup_id = int(df.duplicated('id').sum())\ndf = df.sort_values('tgl_update').drop_duplicates('id', keep='last')\nn_akhir = len(df)\n\nprint(f"n_gagal_harga={n_gagal_harga}  n_dup_id={n_dup_id}  n_akhir={n_akhir}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_gagal_harga", value: 1, tol: 1e-9, label: "Cek 1 · n_gagal_harga benar", msg: "Pastikan konversi memakai mode toleran lalu hitung nilai kosongnya — jangan menebak angkanya." },
          { kind: "equal", task: "t2", name: "n_dup_id", value: 1, tol: 1e-9, label: "Cek 2 · n_dup_id benar", msg: "Hitung duplikat pada kolom kunci `id` — bukan baris yang identik penuh." },
          { kind: "equal", task: "t2", name: "n_akhir", value: 8, tol: 1e-9, label: "Cek 3 · n_akhir benar", msg: "Urutkan dulu berdasarkan `tgl_update`, lalu terapkan aturan terbaru menang." },
        ],
      },
      reference: "coerce + ukur yang gagal; sort + drop_duplicates(subset, keep='last').",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "errors='coerce' pada to_numeric...",
          options: [
            { text: "Error jika gagal", why: "Tidak — justru sebaliknya, ia mencegah error." },
            { text: "Gagal jadi NaN tanpa crash", why: "Toleran: yang gagal jadi NaN, lalu ukur berapa banyak.", correct: true },
            { text: "Hapus baris yang gagal", why: "Tidak menghapus — hanya menandai NaN." },
            { text: "Abaikan kolomnya", why: "Kolom tetap ada, tipenya diperbaiki." },
          ],
        },
        {
          q: "Imputasi sebelum split train-test...",
          options: [
            { text: "Praktik yang baik", why: "Tidak — statistik full data membocorkan info test." },
            { text: "Data leakage — pakai statistik train saja", why: "Imputasi memakai statistik train saja, lalu terapkan ke test.", correct: true },
            { text: "Aman selama memakai median", why: "Leakage bukan soal median vs mean — statistik apa pun yang dihitung dari data test sudah merembes ke train." },
            { text: "Wajib dilakukan", why: "Wajib justru menghindarinya." },
          ],
        },
        {
          q: "Outlier valid tapi ekstrem sebaiknya...",
          options: [
            { text: "Selalu hapus", why: "Menghapus tanpa investigasi = menghapus informasi; mungkin itu fraud." },
            { text: "Investigasi, lalu cap/pertahankan + catat", why: "Keputusan tercatat: perbaiki, winsorize, atau biarkan.", correct: true },
            { text: "Abaikan saja", why: "Tanpa investigasi kamu tidak tahu ia valid atau salah input." },
            { text: "Winsorize otomatis tanpa mencatat", why: "Winsorize boleh dipakai, tapi tanpa catatan audit trail-nya hilang — keputusan harus tercatat." },
          ],
        },
        {
          q: "Fungsi cleaning ideal mengembalikan...",
          options: [
            { text: "Nilai saja", why: "Tanpa status, kualitas cleaning tidak terukur." },
            { text: "(nilai, status) — untuk laporan kualitas", why: "Status memungkinkan audit trail dan metrik.", correct: true },
            { text: "Error selalu", why: "Tidak — hanya untuk input yang benar-benar invalid." },
            { text: "Tidak mengembalikan apa-apa", why: "Fungsi harus mengembalikan hasil yang bisa dipakai." },
          ],
        },
      ],
      summary: [
        "dtype dulu: to_numeric/to_datetime (coerce) + category.",
        "Missing: pahami mekanisme, pilih strategi, tandai yang diimputasi.",
        "Duplikat: ukur, lalu aturan menang eksplisit (sort + keep).",
        "Outlier: deteksi IQR/z-score, investigasi sebelum tindakan.",
        "Laporkan % + audit trail. Jangan imputasi sebelum split.",
      ],
      next: { label: "D6 — Wrangling", href: "/v2/learn/d6-wrangling" },
    },
  ],
};
