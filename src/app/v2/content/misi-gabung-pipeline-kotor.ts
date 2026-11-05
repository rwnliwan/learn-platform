import type { V2Mission } from "../lib/types";

// ── MISI CAPSTONE #1: Python × Data Engineer ─────────────────────────────
// "Dari Laptop Pendahulu ke Produksi" — pipeline analisis yang tahan data
// kotor: skema berubah, duplikat, sel hilang, encoding rusak, lonjakan volume.
// Dataset 100% SINTETIS (generator seed 42). File:
// public/misi/misi-gabung-pipeline-kotor/transaksi_2026-09.csv (1560 baris)
// public/misi/misi-gabung-pipeline-kotor/transaksi_2026-10.csv (1440 baris,
// skema BERUBAH) + METODE.md.

const BASE = "/misi/misi-gabung-pipeline-kotor";

export const misiGabungPipelineKotor: V2Mission = {
  slug: "misi-gabung-pipeline-kotor",
  track: "Python",
  module: "Misi",
  title: "Misi Pipeline Kotor: Dari Laptop Pendahulu ke Produksi",
  estMinutes: 180,
  role: "Data Engineer — pemilik baru pipeline laporan pendapatan",
  client:
    "CTO PT Kopi Nusantara — pipeline laporan pendapatan harus naik ke produksi sebelum promo 10.10 (volume diprediksi naik 10× lipat)",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Pipeline yang 'jalan di laptop saya'",
      prose: [],
      tasks: [],
      briefing: {
        role: "Data Engineer yang baru bergabung — pemilik baru pipeline laporan pendapatan",
        client:
          "CTO PT Kopi Nusantara (jaringan 40 gerai kopi). Pipeline `hitung_pendapatan.py` peninggalan pendahulunya, Dimas, hanya jalan di laptop pribadi Dimas — bukan di server, tanpa jadwal otomatis, tanpa validasi. Setiap bulan vendor kasir (KasirKita) mengubah format file export CSV tanpa pemberitahuan. Laporan September kemarin kelebihan Rp 1,6 juta karena baris duplikat — dan tidak ada yang sadar selama tiga minggu. Promo 10.10 tinggal tiga minggu: volume transaksi diprediksi naik 10× lipat. Tugasmu: bawa pipeline ini ke produksi. Ia harus tahan skema berubah, tahan data kotor, dan tahan lonjakan volume.",
        story: [
          "Senin, 09:12. Kamu membuka laptop warisan Dimas — dan menemukan satu file Python 60 baris bernama `hitung_pendapatan.py`, tanpa komentar, tanpa README, dengan baris pertama `df = pd.read_csv(\"sept_final_FINAL2.csv\")`. Tidak ada file itu di mana pun. Di folder yang sama: 14 file bernama `sept_final*.csv`, semuanya sedikit berbeda, tidak ada yang tahu mana yang dipakai laporan direksi bulan lalu.",
          "Kamu menjalankan skrip itu ke file September yang dikirim vendor pagi ini. Ia crash di baris 12: `KeyError: 'harga'`. Vendor mengganti nama kolomnya lagi — bulan ini `price`, bulan lalu `harga`, bulan depannya siapa yang tahu. Dimas dulu memperbaikinya dengan tangan setiap bulan, jam 2 pagi, sambil mengumpat. Dimas sudah resign.",
          "CTO menatapmu: “Saya tidak butuh skrip yang jalan sekali. Saya butuh pipeline yang tetap benar waktu vendor iseng, waktu datanya kotor, dan waktu promonya bikin transaksi meledak 10× lipat. Tiga minggu.” Misi ini adalah tiga minggu itu — dimampatkan menjadi satu misi.",
        ],
        objectives: [
          "Membersihkan file transaksi September (1.560 baris kotor) menjadi dataset kanonik dan menghitung total pendapatan yang benar: Rp 45.830.000.",
          "Membangun fungsi `muat_dan_normalkan()` yang tahan terhadap ganti nama kolom, format tanggal campur, dan format harga berantakan — lolos uji file Oktober (skema berubah total) dan uji beban 30.000 baris.",
          "Menemukan minimal 4 suntikan di Laporan Kualitas Data peninggalan Dimas dan menulis Laporan Serah Terima Produksi yang dinilai rubrik.",
        ],
        prereqSummary:
          "Pipeline = rangkaian langkah otomatis dari file mentah menjadi laporan (baca → bersihkan → validasi → agregat). DataFrame pandas adalah tabel di Python: kamu perlu bisa membaca CSV, memfilter baris, dan membuat kolom baru. Skema = daftar nama kolom beserta tipenya — kalau skema berubah diam-diam, kode yang mengasumsikan nama lama akan crash, atau yang lebih parah: jalan terus tapi diam-diam salah.",
        datasetNote:
          "100% SINTETIS — dibuat khusus untuk misi ini (generator `gen_transaksi.py`, seed 42 — lihat METODE.md). Bukan data pelanggan atau keuangan nyata; perusahaan, produk, kota, dan angka semuanya fiktif.\nFile 1: `transaksi_2026-09.csv` — 1.560 baris KOTOR: 60 duplikat, tanggal 4 format campur, harga bertuliskan `Rp 25.000`, 8% nama produk mojibake (`Es CÃ©ndol`), sel-sel kosong.\nFile 2: `transaksi_2026-10.csv` — 1.440 baris dengan skema BERUBAH TOTAL: semua nama kolom diganti + satu kolom baru (`channel`).\nKekotoran dan perubahan skema ini DISENGAJA — itulah latihannya. Lisensi: data sintetis orisinal untuk misi ini.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, dua kepribadian",
      prose: [
        "`transaksi_2026-09.csv` adalah file yang membuat skrip Dimas crash — 1.560 baris, 7 kolom (`order_id, tanggal, customer_id, produk, qty, harga, kota`). Di dalamnya: 60 baris duplikat persis, tanggal dalam 4 format campur (`2026-09-04`, `04/09/2026`, `4 Sep 2026`, dan kosong), harga yang kadang bertuliskan `Rp 25.000`, nama produk yang kadang rusak encoding-nya (`Es CÃ©ndol`), dan sel-sel kosong yang tersebar. Ini file yang harus kamu taklukkan dulu di Lab 1.",
        "`transaksi_2026-10.csv` adalah kejutan bulan depan — 1.440 baris, tapi skemanya BERUBAH TOTAL: `order_id` menjadi `id_pesanan`, `tanggal` menjadi `tgl` (formatnya pun beda: `2026/10/05`, `05-10-2026`, `5 Okt 2026`), `harga` menjadi `price` (kadang `IDR 25.000`), plus satu kolom baru `channel` (Online/Toko/Aplikasi) yang tidak ada di kontrak mana pun. Di Lab 2 kamu membangun pemuat yang tidak peduli vendor mengganti nama apa pun.",
        "Cara membaca chart di bawah: sumbu X = 8 produk, tinggi batang = total pendapatan bersih September (rupiah) SETELAH pembersihan Lab 1 — angka kebenaran yang akan kamu hitung sendiri. Interpretasi: Nasi Goreng Spesial adalah penyumbang terbesar (Rp 9,15 juta), tiga produk teratas menguasai lebih dari separuh pendapatan. Chart ini adalah alat cross-check-mu: kalau angka di laporan Dimas tidak cocok dengan chart ini, pipeline-nya yang salah — bukan chart-nya.",
      ],
      tasks: [
        { id: "t1", text: "Buka `transaksi_2026-09.csv`: catat 7 nama kolom dan minimal 1 contoh kekotoran untuk tiap kolom" },
        { id: "t2", text: "Buka `transaksi_2026-10.csv`: daftarkan kolom yang BERGANTI nama dan kolom yang BARU muncul" },
      ],
      echart: {
        option: {
          title: { text: "Pendapatan bersih per produk — September 2026 (Rp)" },
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: ["Nasi Goreng Spesial", "Soto Ayam Lamongan", "Mie Ayam Bakso", "Gado-Gado Betawi", "Kopi Tubruk", "Es Céndol", "Teh Manis Panas", "Es Teh Manis"],
            axisLabel: { rotate: 30 },
          },
          yAxis: { type: "value", name: "rupiah" },
          series: [
            { type: "bar", data: [9150000, 7180000, 7040000, 6498000, 5625000, 4236000, 3224000, 2877000] },
          ],
        },
        caption: "Data sintetis misi ini — hasil pembersihan Lab 1 (setelah dedup). Total: Rp 45.830.000.",
      },
      note: {
        title: "Miskonsepsi #1: file yang terbuka di Excel = data yang siap diolah",
        type: "pitfall",
        body: "File September terbuka sempurna di Excel — tidak ada error, tidak ada peringatan. Tapi di dalamnya ada 60 duplikat, 4 format tanggal, dan harga bertuliskan teks. Excel menampilkan; pipeline MENGHITUNG. Yang terlihat rapi di mata bisa berantakan di agregat — dan selisihnya di sini Rp 1,6 juta. Aturan: jangan pernah agregat sebelum audit kekotoran.",
      },
      reference: "transaksi_2026-09.csv (1.560 baris, 7 kolom, kotor) vs transaksi_2026-10.csv (1.440 baris, skema berubah + kolom channel). Detail: METODE.md.",
    },
    {
      id: "lab-bersih",
      eyebrow: "Langkah 3 · Lab 1 — Taklukkan file September",
      title: "1.560 baris masuk, berapa yang benar-benar transaksi?",
      prose: [
        "Sebelum pipeline bisa diotomasi, kamu harus tahu persis apa yang salah dengan datanya — dengan tanganmu sendiri, sekali. Tugas lab ini: muat file September, hitung baris kotor dan duplikatnya, normalkan tanggal (4 format!), perbaiki mojibake, rapikan qty/harga/kota, lalu hitung total pendapatan yang BENAR.",
        "Rumus yang kamu implementasikan sederhana — dan justru itu pelajarannya:",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris_kotor` dan `n_duplikat`" },
        { id: "t2", text: "Bersihkan: tanggal, duplikat, produk, qty, harga, kota → `n_baris_bersih`, `n_produk_unik`, `tgl_min`, `tgl_max`" },
        { id: "t3", text: "Hitung `total_pendapatan` = qty × harga per baris, lalu jumlahkan" },
      ],
      expected:
        "n_baris_kotor=1560, n_duplikat=60, n_baris_bersih=1418, n_produk_unik=8, periode 2026-09-01 s.d. 2026-09-30, total_pendapatan=Rp 45.830.000",
      formula: String.raw`R = \sum_{i=1}^{n} q_i \cdot p_i`,
      formulaNote:
        "R = total pendapatan (rupiah); n = jumlah baris BERSIH; q_i = qty baris ke-i; p_i = harga satuan baris ke-i. Interpretasi: tiap baris menyumbang qty × harga, lalu semua dijumlahkan. Contoh: 3 baris (2×15000, 1×12000, 4×8000) → R = 30000 + 12000 + 32000 = Rp 74.000. Satu baris duplikat yang lolos = satu suku GANDA dalam penjumlahan ini — itulah kenapa dedup WAJIB sebelum agregasi, bukan sesudah.",
      hints: [
        "Muat aman: `pd.read_csv(open_url(URL), dtype=str).fillna(\"\")` — semua kolom jadi string, sel kosong jadi string kosong yang mudah dideteksi.",
        "Tanggal campur: `pd.to_datetime(df[\"tanggal\"].replace(\"\", pd.NA), format=\"mixed\", dayfirst=True, errors=\"coerce\")` — tanpa dayfirst=True, \"04/09/2026\" dibaca 9 April!",
        "Harga: buang prefix DULU baru titik ribuan: `.str.strip().str.replace(\"Rp\", \"\", regex=False).str.replace(\".\", \"\", regex=False)` — urutan terbalik = bencana.",
        "Aturan isi: qty kosong → 1; harga kosong → median harga produk itu (`groupby(\"produk\")[\"harga\"].transform(\"median\")`); kota kosong → \"TIDAK_DIKETAHUI\".",
        "Mojibake: `df[\"produk\"].replace({\"Es CÃ©ndol\": \"Es Céndol\"})` — perbaiki SEBELUM mengisi harga kosong, supaya median per produk tidak terpecah menjadi dua produk.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-kotor/transaksi_2026-09.csv\"",
          "",
          "# df sudah dimuat (semua kolom dibaca sebagai string agar aman)",
          "df = pd.read_csv(open_url(URL), dtype=str).fillna(\"\")",
          "",
          "n_baris_kotor = ...",
          "n_duplikat = ...   # petunjuk: df.duplicated().sum()",
          "",
          "# 1) tanggal -> datetime (format campur!). Baris tanpa tanggal dibuang.",
          "df[\"tanggal\"] = ...",
          "df = df.dropna(subset=[\"tanggal\"]).copy()",
          "",
          "# 2) buang duplikat baris penuh (simpan kemunculan pertama)",
          "df = ...",
          "",
          "# 3) rapikan teks: mojibake produk, qty, harga, kota",
          "df[\"produk\"] = ...",
          "df[\"qty\"] = ...",
          "df[\"harga\"] = ...",
          "df[\"kota\"] = ...",
          "",
          "df[\"pendapatan\"] = df[\"qty\"] * df[\"harga\"]",
          "",
          "n_baris_bersih = ...",
          "n_produk_unik = ...",
          "total_pendapatan = ...",
          "tgl_min = ...   # string \"2026-09-01\"",
          "tgl_max = ...",
          "",
          "print(\"kotor:\", n_baris_kotor, \"| duplikat:\", n_duplikat, \"| bersih:\", n_baris_bersih)",
          "print(\"produk unik:\", n_produk_unik, \"| periode:\", tgl_min, \"s.d.\", tgl_max)",
          "print(\"total pendapatan: Rp\", f\"{total_pendapatan:,}\".replace(\",\", \".\"))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-kotor/transaksi_2026-09.csv\"",
          "",
          "# df sudah dimuat (semua kolom dibaca sebagai string agar aman)",
          "df = pd.read_csv(open_url(URL), dtype=str).fillna(\"\")",
          "",
          "n_baris_kotor = len(df)",
          "n_duplikat = int(df.duplicated().sum())",
          "",
          "df[\"tanggal\"] = pd.to_datetime(df[\"tanggal\"].replace(\"\", pd.NA), format=\"mixed\", dayfirst=True, errors=\"coerce\")",
          "df = df.dropna(subset=[\"tanggal\"]).copy()",
          "",
          "df = df.drop_duplicates().copy()",
          "",
          "df[\"produk\"] = df[\"produk\"].replace({\"Es CÃ©ndol\": \"Es Céndol\"})",
          "df[\"qty\"] = pd.to_numeric(df[\"qty\"].str.strip().replace(\"\", pd.NA), errors=\"coerce\").fillna(1).astype(int)",
          "h = (df[\"harga\"].str.strip().str.replace(\"Rp\", \"\", regex=False).str.replace(\"IDR\", \"\", regex=False).str.replace(\".\", \"\", regex=False).str.strip().replace(\"\", pd.NA))",
          "df[\"harga\"] = pd.to_numeric(h, errors=\"coerce\")",
          "df[\"harga\"] = df[\"harga\"].fillna(df.groupby(\"produk\")[\"harga\"].transform(\"median\")).astype(int)",
          "df[\"kota\"] = df[\"kota\"].replace(\"\", pd.NA).fillna(\"TIDAK_DIKETAHUI\")",
          "",
          "df[\"pendapatan\"] = df[\"qty\"] * df[\"harga\"]",
          "",
          "n_baris_bersih = len(df)",
          "n_produk_unik = int(df[\"produk\"].nunique())",
          "total_pendapatan = int(df[\"pendapatan\"].sum())",
          "tgl_min = df[\"tanggal\"].min().strftime(\"%Y-%m-%d\")",
          "tgl_max = df[\"tanggal\"].max().strftime(\"%Y-%m-%d\")",
          "",
          "print(\"kotor:\", n_baris_kotor, \"| duplikat:\", n_duplikat, \"| bersih:\", n_baris_bersih)",
          "print(\"produk unik:\", n_produk_unik, \"| periode:\", tgl_min, \"s.d.\", tgl_max)",
          "print(\"total pendapatan: Rp\", f\"{total_pendapatan:,}\".replace(\",\", \".\"))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris_kotor` = 1560", name: "n_baris_kotor", value: 1560, msg: "File September punya 1560 baris (1500 + 60 duplikat)." },
          { kind: "equal", task: "t1", label: "`n_duplikat` = 60", name: "n_duplikat", value: 60, msg: "60 baris duplikat persis — `df.duplicated().sum()` sebelum dibuang." },
          { kind: "equal", task: "t2", label: "`n_baris_bersih` = 1418", name: "n_baris_bersih", value: 1418, msg: "1560 − 91 (tanggal kosong) − 51 (duplikat tersisa) = 1418. Urutan: dropna tanggal DULU, baru dedup." },
          { kind: "equal", task: "t2", label: "`n_produk_unik` = 8", name: "n_produk_unik", value: 8, msg: "8 produk — mojibake harus dinormalisasi dulu, kalau tidak jadi 9." },
          { kind: "equal", task: "t2", label: "`tgl_min` = 2026-09-01", name: "tgl_min", value: "2026-09-01", msg: "Format string YYYY-MM-DD." },
          { kind: "equal", task: "t2", label: "`tgl_max` = 2026-09-30", name: "tgl_max", value: "2026-09-30", msg: "Format string YYYY-MM-DD." },
          { kind: "equal", task: "t3", label: "`total_pendapatan` = Rp 45.830.000", name: "total_pendapatan", value: 45830000, tol: 1, msg: "qty × harga per baris BERSIH lalu dijumlahkan. Tanpa dedup angkanya Rp 47.442.000 — selisih Rp 1.612.000." },
        ],
      },
    },
    {
      id: "lab-tahan",
      eyebrow: "Langkah 4 · Lab 2 — Tahan skema berubah & volume meledak",
      title: "Vendor mengganti nama kolom? Pipeline tidak boleh peduli",
      prose: [
        "File September sudah takluk. Sekarang musuh yang sebenarnya: file Oktober, yang semua nama kolomnya diganti vendor (`order_id` → `id_pesanan`, `harga` → `price`, ...), format tanggalnya beda lagi, dan ada kolom baru `channel` yang tidak ada di kontrak mana pun. Skrip Dimas crash di file seperti ini. Pipeline produksi tidak boleh crash — ia harus punya KONTRAK SKEMA: daftar kolom kanonik yang dijanjikan ke downstream, kamus alias untuk nama-nama liar vendor, dan aturan tegas untuk kolom tak dikenal (abaikan + catat, jangan crash).",
        "Tugas lab ini: tulis `muat_dan_normalkan(url)` — satu fungsi yang menerima CSV skema apa pun dan mengembalikan DataFrame bersih BERSKEMA KANONIK. Lalu uji dua hal: (1) ia lolos file Oktober yang berantakan, (2) ia tahan uji beban 30.000 baris (simulasi promo 10.10) memakai fungsi yang SAMA — tanpa loop baris, karena loop 30.000 baris adalah cara pipeline mati perlahan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `ALIAS`, tulis `bersihkan()` + `muat_dan_normalkan()`; hitung `n_okt_kotor`, `n_okt_bersih`, `total_pendapatan_okt`, `skema_ok`" },
        { id: "t2", text: "Uji beban: 30.000 baris sintetis lewat fungsi yang sama → `n_stress` (tanpa `iterrows`/loop baris)" },
      ],
      expected:
        "n_okt_kotor=1440, n_okt_bersih=1320, total_pendapatan_okt=Rp 43.347.000, skema_ok=True, n_stress=30000",
      note: {
        title: "Miskonsepsi #2: kode yang jalan = pipeline yang siap produksi",
        type: "pitfall",
        body: "Skrip Dimas JALAN — setiap bulan, setelah diperbaiki manual jam 2 pagi. “Jalan” bukan “siap produksi”. Siap produksi berarti: tahan input yang berubah (kontrak skema), gagal berisik bukan diam-diam (validasi), dan tahan volume 10× lipat (tanpa loop baris). Tiga syarat itu tidak ada di skrip 60 baris — dan ketiganya yang kamu bangun di lab ini.",
      },
      hints: [
        "Rename: `df.rename(columns={c: ALIAS.get(c, c) for c in df.columns})` — kolom tak dikenal seperti `channel` lolos rename apa adanya, lalu dibuang saat kamu seleksi kolom KANONIK.",
        "Kontrak: `hilang = [k for k in KANONIK if k not in df.columns]` lalu `raise ValueError` bila tak kosong — pipeline yang baik GAGAL BERISIK, bukan diam-diam salah.",
        "Locale tanggal: vendor mencampur `Okt` (Indonesia) dan `Oct` (Inggris) — samakan dulu: `.str.replace(\"Okt\", \"Oct\", regex=False)` sebelum `to_datetime`.",
        "Uji beban: bangun DataFrame 30.000 baris langsung di kode (tanpa file), lewatkan ke `bersihkan()` yang sama. Kalau fungsimu butuh loop per baris, di sinilah ia ketahuan lambatnya.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_OKT = \"/misi/misi-gabung-pipeline-kotor/transaksi_2026-10.csv\"",
          "",
          "# Skema KANONIK: kontrak ke downstream. Fungsi harus SELALU mengembalikan ini.",
          "KANONIK = [\"order_id\", \"tanggal\", \"customer_id\", \"produk\", \"qty\", \"harga\"]",
          "",
          "# TUGAS t1a: lengkapi kamus alias (nama liar vendor -> nama kanonik)",
          "ALIAS = {",
          "    \"id_pesanan\": ...,",
          "    \"tgl\": ...,",
          "    \"cust_id\": ...,",
          "    \"nama_produk\": ...,",
          "    \"jumlah\": ...,",
          "    \"price\": ...,",
          "}",
          "",
          "def bersihkan(df):",
          "    \"\"\"Terima DataFrame BERSKEMA KANONIK, kembalikan yang bersih + kolom pendapatan.\"\"\"",
          "    ...",
          "",
          "def muat_dan_normalkan(url):",
          "    \"\"\"Baca CSV skema apa pun -> skema kanonik -> bersih. Kolom tak dikenal diabaikan.\"\"\"",
          "    ...",
          "",
          "okt = muat_dan_normalkan(URL_OKT)",
          "n_okt_kotor = ...",
          "n_okt_bersih = ...",
          "total_pendapatan_okt = ...",
          "skema_ok = ...   # True bila list(okt.columns) == KANONIK + [\"pendapatan\"]",
          "",
          "# TUGAS t2: uji beban 30.000 baris lewat fungsi yang SAMA (tanpa loop baris!)",
          "...",
          "n_stress = ...",
          "",
          "print(\"oktober kotor:\", n_okt_kotor, \"| bersih:\", n_okt_bersih, \"| skema ok:\", skema_ok)",
          "print(\"total Okt: Rp\", f\"{total_pendapatan_okt:,}\".replace(\",\", \".\"))",
          "print(\"uji beban:\", n_stress, \"baris\")",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_OKT = \"/misi/misi-gabung-pipeline-kotor/transaksi_2026-10.csv\"",
          "",
          "# Skema KANONIK: kontrak ke downstream. Fungsi harus SELALU mengembalikan ini.",
          "KANONIK = [\"order_id\", \"tanggal\", \"customer_id\", \"produk\", \"qty\", \"harga\"]",
          "",
          "ALIAS = {",
          "    \"id_pesanan\": \"order_id\",",
          "    \"tgl\": \"tanggal\",",
          "    \"cust_id\": \"customer_id\",",
          "    \"nama_produk\": \"produk\",",
          "    \"jumlah\": \"qty\",",
          "    \"price\": \"harga\",",
          "}",
          "",
          "def bersihkan(df):",
          "    \"\"\"Terima DataFrame BERSKEMA KANONIK, kembalikan yang bersih + kolom pendapatan.\"\"\"",
          "    df = df.copy()",
          "    df[\"tanggal\"] = pd.to_datetime(",
          "        df[\"tanggal\"].str.replace(\"Okt\", \"Oct\", regex=False).replace(\"\", pd.NA),",
          "        format=\"mixed\", dayfirst=True, errors=\"coerce\")",
          "    df = df.dropna(subset=[\"tanggal\"]).copy()",
          "    df = df.drop_duplicates().copy()",
          "    df[\"produk\"] = df[\"produk\"].replace({\"Es CÃ©ndol\": \"Es Céndol\"})",
          "    df[\"qty\"] = pd.to_numeric(df[\"qty\"].str.strip().replace(\"\", pd.NA), errors=\"coerce\").fillna(1).astype(int)",
          "    h = (df[\"harga\"].str.strip().str.replace(\"Rp\", \"\", regex=False).str.replace(\"IDR\", \"\", regex=False).str.replace(\".\", \"\", regex=False).str.strip().replace(\"\", pd.NA))",
          "    df[\"harga\"] = pd.to_numeric(h, errors=\"coerce\")",
          "    df[\"harga\"] = df[\"harga\"].fillna(df.groupby(\"produk\")[\"harga\"].transform(\"median\")).astype(int)",
          "    df[\"pendapatan\"] = df[\"qty\"] * df[\"harga\"]",
          "    return df",
          "",
          "def muat_dan_normalkan(url):",
          "    \"\"\"Baca CSV skema apa pun -> skema kanonik -> bersih. Kolom tak dikenal diabaikan.\"\"\"",
          "    mentah = pd.read_csv(open_url(url), dtype=str).fillna(\"\")",
          "    df = mentah.rename(columns={c: ALIAS.get(c, c) for c in mentah.columns})",
          "    hilang = [k for k in KANONIK if k not in df.columns]",
          "    if hilang:",
          "        raise ValueError(\"kolom wajib hilang: \" + str(hilang))",
          "    return bersihkan(df[KANONIK].copy())",
          "",
          "okt = muat_dan_normalkan(URL_OKT)",
          "n_okt_kotor = len(pd.read_csv(open_url(URL_OKT), dtype=str))",
          "n_okt_bersih = len(okt)",
          "total_pendapatan_okt = int(okt[\"pendapatan\"].sum())",
          "skema_ok = list(okt.columns) == KANONIK + [\"pendapatan\"]",
          "",
          "n = 30000",
          "stress = pd.DataFrame({",
          "    \"order_id\": [\"STRESS-%05d\" % i for i in range(n)],",
          "    \"tanggal\": [\"2026-10-05\"] * n,",
          "    \"customer_id\": [\"C-0001\"] * n,",
          "    \"produk\": [\"Kopi Tubruk\"] * n,",
          "    \"qty\": [\"2\"] * n,",
          "    \"harga\": [\"15000\"] * n,",
          "})",
          "n_stress = len(bersihkan(stress))",
          "",
          "print(\"oktober kotor:\", n_okt_kotor, \"| bersih:\", n_okt_bersih, \"| skema ok:\", skema_ok)",
          "print(\"total Okt: Rp\", f\"{total_pendapatan_okt:,}\".replace(\",\", \".\"))",
          "print(\"uji beban:\", n_stress, \"baris\")",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `muat_dan_normalkan` terdefinisi", name: "muat_dan_normalkan", msg: "Definisikan fungsi muat_dan_normalkan(url)." },
          { kind: "equal", task: "t1", label: "`n_okt_kotor` = 1440", name: "n_okt_kotor", value: 1440, msg: "File Oktober punya 1440 baris (1400 + 40 duplikat)." },
          { kind: "equal", task: "t1", label: "`n_okt_bersih` = 1320", name: "n_okt_bersih", value: 1320, msg: "1440 − tanggal kosong − duplikat = 1320. Alias harus memetakan SEMUA nama liar ke kanonik." },
          { kind: "equal", task: "t1", label: "`total_pendapatan_okt` = Rp 43.347.000", name: "total_pendapatan_okt", value: 43347000, tol: 1, msg: "qty × harga per baris bersih Oktober, dijumlahkan." },
          { kind: "equal", task: "t1", label: "`skema_ok` = True", name: "skema_ok", value: true, msg: "Kolom hasil harus persis KANONIK + pendapatan — kolom channel vendor WAJIB hilang di sini." },
          { kind: "equal", task: "t2", label: "`n_stress` = 30000", name: "n_stress", value: 30000, msg: "30.000 baris sintetis harus lolos fungsi yang sama tanpa kehilangan satu pun." },
          { kind: "forbids", task: "t2", label: "tanpa `iterrows`", token: "iterrows", msg: "Uji beban melatih vectorization — operasi kolom pandas, bukan loop per baris. Di 300.000 baris nanti, loop = pipeline mati." },
        ],
      },
    },
  ],
};

export default misiGabungPipelineKotor;

// ── lanjutan misiGabungPipelineKotor: langkah 5–10 ────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_GABUNG: V2Step[] = [
  {
    id: "peta-keputusan",
    eyebrow: "Langkah 5 · Peta keputusan",
    title: "Empat situasi, empat keputusan — sebelum krisis datang",
    prose: [
      "Lab memberimu perkakas. Langkah ini memberimu REFLEKS: apa yang dilakukan saat pola-pola ini muncul di produksi — sebelum sempat menjadi insiden jam 2 pagi. Untuk tiap skenario, baca kondisinya, pilih responsnya, dan hafalkan alasannya.",
      "Skenario 1 — Skema berubah lagi. Kondisi: file November datang, kolom `price` hilang diganti `amount_idr`, dan ada kolom baru `voucher_kode`. Respons: JANGAN edit skrip manual — tambah alias di kamus ALIAS, tambah aturan untuk kolom baru di kontrak, dan catat perubahan di changelog skema. Alasan: skema yang berubah tiap bulan adalah KONDISI NORMAL vendor ini; memperlakukannya sebagai “keadaan darurat” setiap bulan berarti kamu darurat selamanya.",
      "Skenario 2 — Data hilang <5% dan acak. Kondisi: qty kosong di 3% baris, harga kosong di 5% baris, pola hilang acak (bukan di gerai/produk tertentu). Respons: imputasi terdokumentasi (qty → 1, harga → median produk) dan CATAT di laporan berapa % yang diimputasi. Alasan: di bawah 5% dan acak, imputasi tidak mengubah kesimpulan; tapi imputasi yang TIDAK dicatat = angka yang tidak bisa diaudit.",
      "Skenario 3 — Duplikat terdeteksi di batch baru. Kondisi: 2% baris batch Desember duplikat persis. Respons: JANGAN silent-drop — masukkan ke tabel karantina, kirim alert ke vendor, dan tetap dedup sebelum agregat. Alasan: duplikat adalah GEJALA (bug di export vendor), bukan sekadar sampah. Silent-drop menyembuhkan gejala sambil membiarkan penyakitnya.",
      "Skenario 4 — Volume naik 10× saat promo. Kondisi: 10.10 menghasilkan 300.000 baris, bukan 30.000. Respons: pastikan fungsi pembersih tetap vektor (sudah diuji di Lab 2), pecah batch per hari bila memori menipis, dan pasang timeout + alert durasi. Alasan: pipeline yang “semoga kuat” bukan strategi — angka uji bebanmu adalah strateginya.",
      "Kasus mini — Jumat 16:40, file November masuk: kolom `price` hilang, diganti `amount_idr`. Laporan direksi Senin pagi. Apa 10 menit pertamamu? Jawaban yang benar: JANGAN buru-buru edit kode. (1) Bekukan file mentah (arsip byte-per-byte — bukti). (2) Jalankan `muat_dan_normalkan` dan baca error validasinya — ia memberitahu persis kolom apa yang hilang. (3) Tambah alias + uji di salinan, bukan di produksi. (4) Baru kirim laporan. Urutan ini membedakan engineer dari pemadam kebakaran: yang pertama bekerja dari bukti, yang kedua dari panik.",
      "Aturan praktis 10 detik (tempel di monitor): (1) Arsipkan mentah dulu, olah kemudian. (2) Dedup sebelum agregat — selalu. (3) Skema berubah = tambah alias, bukan edit logika. (4) Gagal berisik (raise + alert), jangan diam-diam. (5) Setiap angka imputasi dicatat di laporan. (6) Klaim “tahan beban” wajib ditemani angka uji.",
    ],
    tasks: [
      { id: "t1", text: "Untuk tiap dari 4 skenario, tulis satu kalimat: respons apa yang kamu ambil dan kenapa" },
    ],
    reference: "Darurat yang berulang bukan darurat — itu proses yang belum ditulis.",
  },
  {
    id: "kuis",
    eyebrow: "Langkah 6 · Kuis",
    title: "Uji refleks pipeline-mu",
    prose: [
      "Empat soal. Bukan hafalan — masing-masing menguji satu keputusan yang akan kamu buat berulang kali sebagai data engineer.",
    ],
    tasks: [
      { id: "t1", text: "Jawab 4 soal — baca feedback tiap jawaban, terutama yang salah" },
    ],
    quiz: [
      {
        q: "Fungsi pembersihmu lolos 30 hari tanpa error, lalu vendor menambah kolom `channel` dan pipeline crash dengan KeyError. Apa akar masalahnya?",
        options: [
          {
            text: "pandas tidak cocok untuk data produksi — harus pindah ke database",
            why: "Salah sasaran. pandas tidak crash karena pandas; ia crash karena kode mengasumsikan daftar kolom yang tetap. Database pun crash kalau skemanya diasumsikan kaku.",
          },
          {
            text: "Tidak ada kontrak skema — kode mengasumsikan nama kolom vendor tidak pernah berubah",
            why: "Benar. Crash-nya bukan di library, tapi di asumsi: kode ditulis seolah skema adalah konstanta, padahal bagi vendor ini ia variabel bulanan. Kontrak skema (alias + kolom kanonik + validasi) adalah obatnya — persis yang kamu bangun di Lab 2.",
            correct: true,
          },
          {
            text: "File CSV Oktober terlalu besar sehingga memori habis",
            why: "Salah. 1.440 baris tidak ada apa-apanya bagi memori — dan error-nya KeyError (kolom), bukan MemoryError.",
          },
          {
            text: "Seharusnya file dibersihkan manual di Excel dulu sebelum masuk pipeline",
            why: "Berbahaya. Pembersihan manual tidak teraudit, tidak terulang, dan menempatkan manusia sebagai single point of failure setiap batch — inilah jebakan yang membuat Dimas lembur tiap bulan.",
          },
        ],
      },
      {
        q: "Setelah `drop_duplicates()`, total pendapatan September turun Rp 1.612.000. Apa arti penurunan ini?",
        options: [
          {
            text: "Data rusak — dedup menghapus transaksi asli, angkanya harus dikembalikan",
            why: "Salah. Duplikat di sini adalah baris PERSIS ganda (order_id sama, semua kolom sama) — bukan dua transaksi kebetulan mirip. Mengembalikannya = mengembalikan kebohongan Rp 1,6 juta.",
          },
          {
            text: "Duplikat menggelembungkan agregat — dedup wajib dilakukan SEBELUM agregasi",
            why: "Benar. Rumus R = Σ q_i · p_i menjumlahkan tiap baris; satu baris ganda = satu suku ganda. Agregat dulu baru dedup = menggelembungkan dulu baru mengaku — urutannya tidak bisa dibalik.",
            correct: true,
          },
          {
            text: "Harga median yang dipakai untuk imputasi terlalu rendah",
            why: "Salah hitung. Imputasi harga hanya mengisi 5% sel kosong dengan median produk — dampaknya puluhan ribu rupiah, bukan 1,6 juta. Satu-satunya komponen sebesar itu adalah 60 baris duplikat.",
          },
          {
            text: "Tidak ada artinya — selisih 3,5% masih dalam toleransi laporan",
            why: "Berbahaya. 3,5% dari pendapatan bulanan 40 gerai adalah angka yang mengubah keputusan (bonus, target, pajak). “Masih wajar” tanpa ambang tertulis = pembenaran, bukan analisis.",
          },
        ],
      },
      {
        q: "Laporan Dimas mengklaim kolom produk “100% valid UTF-8”, tapi 8% baris tertulis `Es CÃ©ndol`. Kenapa klaim itu menyesatkan?",
        options: [
          {
            text: "Karena UTF-8 tidak bisa dipakai untuk teks Indonesia",
            why: "Salah total. UTF-8 menangani semua karakter Indonesia dengan sempurna — masalahnya bukan encoding pilihannya.",
          },
          {
            text: "Valid secara byte tidak sama dengan benar secara teks — mojibake lolos cek encoding",
            why: "Benar. `Es CÃ©ndol` adalah byte yang VALID (bisa di-decode tanpa error) tapi TEKS yang salah — byte UTF-8 yang dibaca sebagai latin-1. Cek “valid UTF-8” mengukur hal yang salah; yang benar dicek adalah distribusi nilai unik kolom (8% nilai aneh = alarm).",
            correct: true,
          },
          {
            text: "Karena 8% terlalu kecil untuk memengaruhi laporan",
            why: "Salah dua kali. Pertama, 8% dari satu produk = produk itu terpecah dua di agregat (Es Céndol vs Es CÃ©ndol). Kedua, “kecil” bukan alasan mengabaikan — ini gejala pipeline export yang rusak.",
          },
          {
            text: "Karena solusinya adalah mengganti semua nama produk menjadi ASCII",
            why: "Salah pendekatan. Menghapus karakter é menyelesaikan gejala dengan merusak data (nama produk resmi memang “Es Céndol”). Yang benar: perbaiki decoding-nya, bukan namanya.",
          },
        ],
      },
      {
        q: "Vendor mengubah format export hampir tiap bulan. Strategi paling tahan untuk 12 bulan ke depan?",
        options: [
          {
            text: "Tambal manual tiap bulan seperti Dimas — cepat dan murah",
            why: "Murah hari ini, mahal selamanya. Strategi ini berskala dengan jam lemburmu, bukan dengan kreativitas vendor — dan ia menempatkanmu sebagai single point of failure (cuti = pipeline mati).",
          },
          {
            text: "Bekukan pipeline dan tuntut vendor tidak pernah mengubah format",
            why: "Kamu tidak mengendalikan vendor. Menuntut dunia berhenti berubah bukan arsitektur — dan dua minggu tanpa laporan akan membuat bisnismu lebih dulu berubah pikiran.",
          },
          {
            text: "Adapter skema (alias → kanonik) + validasi gagal-berisik + tabel karantina + SLA pemberitahuan perubahan dengan vendor",
            why: "Benar. Kamu tidak mencegah perubahan — kamu membuat perubahan menjadi MURAH: alias menampung nama baru, validasi menangkap yang tak dikenal, karantina menampung yang mencurigakan, SLA memberi waktu persiapan. Inilah beda “tahan” vs “berharap”.",
            correct: true,
          },
          {
            text: "Tulis ulang pipeline dari nol setiap kali format berubah",
            why: "Itu bukan strategi, itu hukuman. Menulis ulang 12× setahun = 12 kesempatan memperkenalkan bug baru — dengan biaya yang sama setiap kali.",
          },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Pipeline-mu sudah tahan. Sekarang: strategi apa untuk 12 bulan ke depan?",
    prose: [
      "Lab 1 dan Lab 2 memberimu pipeline yang tahan: kontrak skema, pembersihan terdokumentasi, uji beban lolos. Tapi CTO mengajukan pertanyaan yang lebih besar di rapat: “Oke, pipelinenya tahan. Tapi STRATEGI-nya apa? Vendor ini mengubah format tiap bulan — kita mau main kejar-kejaran selamanya?” Tiga opsi di atas meja. Tidak ada yang gratis. Pilih — dan hidupi konsekuensinya di langkah berikut.",
    ],
    tasks: [
      { id: "t1", text: "Pilih satu opsi. Tulis alasanmu dalam 2 kalimat SEBELUM melihat konsekuensinya" },
    ],
    decision: {
      prompt:
        "Strategi apa yang kamu usulkan ke CTO untuk menghadapi vendor yang mengubah format export tiap bulan? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-tambalan",
          label: "Tambal manual tiap bulan — cepat, murah, seperti Dimas",
          rationale:
            "Membangun lapisan validasi butuh 3 minggu yang tidak ada. Tambal manual hanya butuh 2 jam per bulan — biaya termurah hari ini, dan tim kecil tidak punya waktu untuk arsitektur ideal.",
          nextStepId: "konsekuensi-tambalan",
          consequenceNote:
            "Dua bulan berjalan mulus. Bulan ketiga vendor mengubah format saat kamu cuti — junior menjalankan pipeline dengan mapping lama, laporan direksi salah 4 hari sebelum ada yang sadar. Kamu menjadi single point of failure yang resmi.",
        },
        {
          id: "opt-kontrak",
          label: "Bangun lapisan validasi + karantina + SLA dengan vendor",
          rationale:
            "Perubahan adalah kondisi normal vendor ini — jadi buat perubahan menjadi murah: alias menampung nama baru, validasi gagal berisik, karantina menampung yang mencurigakan, SLA 14 hari memberi waktu persiapan.",
          nextStepId: "konsekuensi-kontrak",
          consequenceNote:
            "Tiga minggu kerja keras. Desember vendor mengubah format lagi — pipeline mengkarantina 47 baris, alert berbunyi, laporan tetap terbit tepat waktu. Vendor menandatangani SLA pemberitahuan 14 hari. Kamu tidak lagi lembur tiap bulan.",
        },
        {
          id: "opt-beku",
          label: "Bekukan pipeline — tuntut vendor patuhi satu format tetap",
          rationale:
            "Akar masalahnya adalah vendor yang tidak disiplin. Selama format dibiarkan liar, tim data selamanya jadi pemadam kebakaran. Tekanan bisnis akan memaksa vendor tertib.",
          nextStepId: "konsekuensi-beku",
          consequenceNote:
            "Pipeline berhenti 2 minggu. Laporan harian mati, operasional protes, dan vendor — perusahaan 5 orang — ternyata tidak MAMPU membekukan format secepat itu. Kamu mencabut pembekuan dan membangun adapter juga — kehilangan 2 minggu untuk pelajaran yang sama.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-tambalan",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: tambal manual tiap bulan",
    prose: [
      "Dua bulan pertama berjalan mulus — setiap awal bulan kamu luangkan 2 jam, update mapping, laporan terbit. CTO memujimu efisien. Lalu bulan ketiga: vendor mengubah `price` menjadi `amount_idr` dan menambah kolom `voucher_kode` — tepat di minggu kamu cuti. Junior yang ditugaskan menjalankan pipeline dengan mapping lamamu. Tidak ada validasi, tidak ada alert: pipeline jalan “sukses” dan menghasilkan laporan dengan 12% baris hilang diam-diam. Direksi baru sadar 4 hari kemudian, saat angka tidak cocok dengan laporan keuangan.",
      "Pelajaran yang mahal: strategi tambalan tidak berskala dengan masalahnya — ia berskala dengan KETERSEDIAANMU. Cuti, sakit, resign: setiap ketiadaanmu adalah jendela kegagalan. Kamu resmi menjadi single point of failure — dengan gaji satu orang menanggung risiko seluruh laporan perusahaan. Di deliverable-mu nanti, setiap proses manual wajib ditemani jawaban: “apa yang terjadi saat saya tidak ada?”",
    ],
    tasks: [
      { id: "t1", text: "Tulis 2 kalimat: dalam skenario ini, apa satu validasi murah yang akan mencegah laporan salah 4 hari?" },
    ],
    note: {
      title: "Bus factor = 1",
      body: "“Bus factor” = berapa orang yang harus tertabrak bus sebelum proyek macet. Pipeline Dimas: 1. Pipeline tambalanmu: tetap 1. Angka ini bukan lelucon — ia adalah metrik risiko yang sah, dan CTO yang baik memintanya dilaporkan.",
    },
  },
  {
    id: "konsekuensi-kontrak",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: validasi + karantina + SLA",
    prose: [
      "Tiga minggu kamu membangun lapisan validasi: kontrak skema kanonik, kamus alias, cek kolom wajib yang gagal berisik, tabel karantina untuk baris mencurigakan, dan alert ke Slack tim. Terasa lama — sampai Desember tiba. Vendor mengubah format lagi (tentu saja): dua kolom berganti nama, satu kolom baru. Pipeline-mu mengkarantina 47 baris yang tidak cocok, membunyikan alert, dan LAPORAN TETAP TERBIT TEPAT WAKTU dengan catatan kaki jujur: “47 baris dikarantina, dalam investigasi vendor”.",
      "Januari, berbekal bukti 3 bulan karantina, kamu dan CTO duduk dengan vendor. Mereka menandatangani SLA: pemberitahuan 14 hari sebelum perubahan format, plus file contoh. Kamu tidak mencegah perubahan — kamu membuatnya MURAH. Dan sejak Desember itu, tidak ada lagi lembur jam 2 pagi. Inilah dividen arsitektur: dibayar di muka, dipanen selamanya.",
    ],
    tasks: [
      { id: "t1", text: "Tulis 2 kalimat: apa bukti (angka!) yang kamu pakai untuk meyakinkan vendor menandatangani SLA?" },
    ],
    note: {
      title: "Karantina > silent-drop",
      body: "47 baris dikarantina BUKAN 47 baris dibuang. Karantina = bukti yang bisa diaudit, dasar negosiasi dengan vendor, dan jejak untuk post-mortem. Silent-drop menghilangkan masalah sekaligus menghilangkan buktinya — dan tanpa bukti, vendor tidak pernah berubah.",
    },
  },
  {
    id: "konsekuensi-beku",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: bekukan pipeline, tuntut vendor tertib",
    prose: [
      "Minggu pertama pembekuan terasa benar: akhirnya ada yang berani bilang “cukup”. Minggu kedua: laporan harian mati, tim operasional menelepon setiap hari, direksi bertanya kenapa dashboard kosong. Vendor — perusahaan 5 orang yang juga melayani 200 klien lain — menjawab jujur: mereka TIDAK BISA membekukan format dalam 2 minggu; roadmap mereka sudah terkunci 6 bulan. Tekanan bisnismu ternyata lebih kecil dari tekanan 200 klien mereka yang lain.",
      "Kamu mencabut pembekuan di hari ke-13 dan membangun adapter alias juga — persis yang ditolak di awal. Dua minggu hilang untuk pelajaran mahal: kamu tidak mengendalikan vendor, dan “menuntut dunia berhenti berubah” bukan arsitektur. Produksi bukan tentang mencegah perubahan; tentang bertahan hidup melewatinya dengan murah. Keputusan yang benar-benar kuat adalah yang tetap benar saat pihak lain tidak kooperatif.",
    ],
    tasks: [
      { id: "t1", text: "Tulis 2 kalimat: apa asumsi tersembunyi di opsi ini yang membuatnya runtuh?" },
    ],
    note: {
      title: "Desain untuk lawan yang tidak kooperatif",
      body: "Asumsinya: vendor akan patuh kalau ditekan cukup keras. Kenyataannya: kamu bukan pelanggan terbesar mereka. Prinsip data engineering: desain pipeline untuk vendor yang SIBUK dan TIDAK PEDULI — karena itulah vendor yang akan kamu temui 90% waktu.",
    },
  },
];

(misiGabungPipelineKotor.steps as V2Step[]).push(...LANJUTAN_GABUNG);

// ── lanjutan misiGabungPipelineKotor: langkah 11–14 ───────────────────────
const LANJUTAN_GABUNG_2: V2Step[] = [
  {
    id: "audit",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Dossier 14 baris: laporan kualitas yang 'siap produksi'",
    prose: [
      "Sebelum menulis laporan serah terima, satu misi audit. Di bawah ini 14 baris “Laporan Kualitas Data Mingguan” peninggalan Dimas — dokumen yang membuat CTO berani bilang pipeline “siap produksi”. Seseorang menyuntikkan 5 sabotase ke dalamnya. Senjatamu: angka lab-mu sendiri — 1.560 baris kotor, 60 duplikat, Rp 45.830.000 bersih, 30.000 baris uji beban.",
      "Cara kerja: bandingkan SETIAP baris dossier dengan apa yang kamu ukur di Lab 1 dan Lab 2. Yang tidak cocok dengan angkamu = kandidat suntikan.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan tiap baris dossier dengan hasil lab-mu; catat yang tidak cocok" },
      { id: "t2", text: "Tulis minimal 4 kejanggalan beserta nomor barisnya sebelum membuka debrief" },
    ],
    auditDossier: {
      version: "gabung-pipeline-kotor-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Kualitas Data Mingguan yang menyatakan pipeline “siap produksi”.",
      columns: ["#", "Pemeriksaan", "Hasil terlapor", "Status"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Pemeriksaan": "Baris mentah September", "Hasil terlapor": "1.560 baris", "Status": "OK" }, claims: [{ label: "Sumber", value: "transaksi_2026-09.csv" }] },
        { rowId: 2, cells: { "#": "2", "Pemeriksaan": "Baris duplikat", "Hasil terlapor": "0 duplikat terdeteksi", "Status": "Bersih" }, claims: [{ label: "Metode", value: "Cek order_id unik — otomatis" }] },
        { rowId: 3, cells: { "#": "3", "Pemeriksaan": "Tanggal kosong", "Hasil terlapor": "91 baris dibuang", "Status": "Ditangani" }, claims: [{ label: "Aturan", value: "Baris tanpa tanggal tak bisa diatribusikan" }] },
        { rowId: 4, cells: { "#": "4", "Pemeriksaan": "Sel kosong keseluruhan", "Hasil terlapor": "0,8% — aman", "Status": "OK" }, claims: [{ label: "Ambang", value: "< 5% = aman (standar tim)" }] },
        { rowId: 5, cells: { "#": "5", "Pemeriksaan": "Produk unik", "Hasil terlapor": "8 produk", "Status": "OK" }, claims: [{ label: "Sumber", value: "Kolom produk setelah normalisasi" }] },
        { rowId: 6, cells: { "#": "6", "Pemeriksaan": "Encoding kolom produk", "Hasil terlapor": "100% valid UTF-8", "Status": "OK" }, claims: [{ label: "Metode", value: "Decode check per baris — tanpa error" }] },
        { rowId: 7, cells: { "#": "7", "Pemeriksaan": "Format tanggal", "Hasil terlapor": "4 format → dinormalisasi", "Status": "OK" }, claims: [{ label: "Aturan", value: "dayfirst=True, format campur" }] },
        { rowId: 8, cells: { "#": "8", "Pemeriksaan": "Harga non-numerik", "Hasil terlapor": "Rp/IDR/titik → dinormalisasi", "Status": "OK" }, claims: [{ label: "Aturan", value: "Buang prefix, buang titik ribuan" }] },
        { rowId: 9, cells: { "#": "9", "Pemeriksaan": "Kota kosong", "Hasil terlapor": "Diisi TIDAK_DIKETAHUI", "Status": "OK" }, claims: [{ label: "Aturan", value: "Terdokumentasi di laporan" }] },
        { rowId: 10, cells: { "#": "10", "Pemeriksaan": "Uji beban 10× volume", "Hasil terlapor": "Lolos — 0,26 detik / 30.000 baris", "Status": "Siap" }, claims: [{ label: "Metode", value: "Batch sintetis, fungsi produksi" }] },
        { rowId: 11, cells: { "#": "11", "Pemeriksaan": "Metadata: stabilitas skema", "Hasil terlapor": "Skema export stabil sejak 2025", "Status": "OK" }, claims: [{ label: "Sumber", value: "Dokumentasi vendor KasirKita" }] },
        { rowId: 12, cells: { "#": "12", "Pemeriksaan": "Metadata: sumber file", "Hasil terlapor": "Export KasirKita v2.1", "Status": "OK" }, claims: [{ label: "Sumber", value: "Header file Oktober" }] },
        { rowId: 13, cells: { "#": "13", "Pemeriksaan": "Total pendapatan September", "Hasil terlapor": "Rp 47.442.000 (final, terrekonsiliasi)", "Status": "Final" }, claims: [{ label: "Rekonsiliasi", value: "Cocok dengan dashboard Dimas" }] },
        { rowId: 14, cells: { "#": "14", "Pemeriksaan": "Rekomendasi", "Hasil terlapor": "Pipeline siap produksi", "Status": "Lanjut" }, claims: [{ label: "Penandatangan", value: "Dimas (sebelum resign)" }] },
      ],
      injections: [
        { key: "duplikat-disembunyikan", rowIds: [2], title: "Duplikat disembunyikan", clue: "Baris 2 mengklaim “0 duplikat terdeteksi” — lab-mu menemukan 60 dengan df.duplicated().sum(). Klaim metodenya (“cek order_id unik”) pun bohong: duplikat di sini duplikat baris PENUH, bukan order_id ganda.", danger: "Cek duplikasi yang salah sasaran = keyakinan palsu. Di produksi, 60 baris ganda = Rp 1,6 juta keputusan yang salah arah." },
        { key: "sel-kosong-dikecilkan", rowIds: [4], title: "Tingkat sel kosong dikecilkan", clue: "Baris 4 mengklaim 0,8% — hitung sendiri dari file mentah: 324 sel kosong dari 10.920 sel = 2,97%, hampir 4× lipat. Ambang “< 5% = aman” sengaja dipasang agar angka palsu tetap terlihat lolos.", danger: "Ambang yang dipilih SETELAH melihat angka bukan kontrol kualitas — itu kostum. Selalu tetapkan ambang sebelum mengukur." },
        { key: "encoding-menyesatkan", rowIds: [6], title: "“100% valid UTF-8” yang menyesatkan", clue: "Baris 6 benar secara teknis — `Es CÃ©ndol` memang byte yang valid, decode tanpa error. Tapi 8% baris produk adalah MOJIBAKE: byte UTF-8 yang dibaca sebagai latin-1. Ceknya mengukur hal yang salah: validitas byte, bukan kebenaran teks.", danger: "Metrik yang salah lebih berbahaya dari tidak ada metrik — ia memberi stempel “OK” pada kerusakan. Ukur distribusi nilai unik, bukan sekadar “bisa di-decode”." },
        { key: "uji-beban-fiktif", rowIds: [10], title: "Uji beban yang tidak pernah ada", clue: "Baris 10 mengklaim “lolos 0,26 detik / 30.000 baris” — angka yang terdengar persis seperti hasil Lab 2-mu. Masalahnya: skrip Dimas memakai loop implisit per baris dan TIDAK PUNYA fungsi uji beban. Angka ini disalin dari tempat lain (atau dikarang) agar baris “Siap” terlihat meyakinkan.", danger: "Klaim ketahanan tanpa artefak uji (skrip + log + tanggal) = fiksi. Di debrief promo 10.10, fiksi seperti ini yang membuat pipeline mati di hari-H." },
        { key: "skema-stabil-dan-total-final", rowIds: [11, 13], title: "Skema “stabil” + total “final” dari skrip lama", clue: "Baris 11 mengklaim skema stabil sejak 2025 — padahal file Oktober mengganti SEMUA nama kolom dan menambah `channel`. Baris 13 mengklaim total “final terrekonsiliasi” Rp 47.442.000 — persis angka TANPA dedup (lab-mu: Rp 45.830.000). Keduanya produk skrip lama Dimas: tanpa kontrak skema, tanpa dedup. “Cocok dengan dashboard Dimas” (klaim baris 13) hanya berarti dua artefak salah yang saling mengiyakan.", danger: "Rekonsiliasi terhadap sumber yang SAMA-SAMA salah bukan verifikasi — itu gema. Verifikasi sejati selalu kembali ke data mentah dengan metode independen." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 12 · Deliverable",
    title: "Laporan Serah Terima Produksi",
    prose: [
      "Semua bukti di tangan: angka bersih September dan Oktober, fungsi yang tahan skema berubah, hasil uji beban, 5 sabotase di laporan lama, dan satu keputusan strategi yang sudah kamu hidupi konsekuensinya. Sekarang tulis artefak portofoliomu: Laporan Serah Terima Produksi — dokumen yang membuat CTO berani menandatangani “pipeline ini milik tim, bukan milik satu orang”.",
    ],
    tasks: [
      { id: "t1", text: "Tulis laporan mengikuti 6 bagian template — tiap klaim ketahanan ditemani ANGKA" },
    ],
    deliverable: {
      template: [
        "Arsitektur pipeline (1 paragraf + daftar komponen): dari file mentah vendor sampai tabel laporan — apa saja tahapnya (baca, normalisasi skema, pembersihan, validasi, agregat) dan di mana tepatnya validasi dipasang.",
        "Kontrak skema: daftar kolom kanonik + tipe tiap kolom; kamus alias untuk nama liar vendor; kebijakan kolom tak dikenal (abaikan + catat di log); apa yang terjadi bila kolom WAJIB hilang (gagal berisik + alert, bukan diam-diam).",
        "Aturan pembersihan: untuk tiap jenis kekotoran (duplikat, tanggal campur, harga ber-format, mojibake, sel kosong) — aturan yang kamu pilih, alasannya, dan berapa baris/sel yang terdampak (angka Lab 1).",
        "Validasi, karantina & alert: checks apa yang jalan tiap batch; ambang mana yang memicu ALERT vs memBLOKIR batch; ke mana alert dikirim dan siapa pemiliknya (nama, bukan “tim”).",
        "Bukti ketahanan: hasil uji skema berubah (file Oktober: 1.440 → 1.320 baris, Rp 43.347.000) + hasil uji beban (30.000 baris, tanpa loop) — angka, bukan klaim.",
        "Batas & risiko sisa (jujur, 3–5 butir): apa yang BELUM ditangani pipeline ini — mis. vendor menghapus kolom wajib, volume 100× lipat, duplikat parsial (bukan baris penuh), perubahan makna kolom tanpa ganti nama.",
      ],
      rubric: [
        { criterion: "Ketahanan skema & adapter", weight: 25, levels: ["Skema di-hardcode / crash saat kolom berubah", "Ada alias tapi tanpa validasi kolom wajib", "Alias + validasi kolom wajib + kolom asing diabaikan dengan log; terbukti lolos file Oktober"] },
        { criterion: "Penanganan data kotor", weight: 25, levels: ["Kekotoran tidak ditangani / angka salah", "Sebagian ditangani, aturan tak terdokumentasi", "Duplikat, tanggal, harga, mojibake, sel kosong — semua ditangani dengan aturan eksplisit; total Rp 45.830.000"] },
        { criterion: "Validasi, karantina & monitoring", weight: 20, levels: ["Tidak ada checks/alert", "Ada checks tanpa ambang dan tanpa pemilik", "Checks + ambang alert vs blokir + tabel karantina + pemilik alert bernama jelas"] },
        { criterion: "Kualitas keputusan arsitektur", weight: 15, levels: ["Keputusan tanpa alasan", "Ada alasan, konsekuensi tak dipikirkan", "Keputusan Langkah 7 dipertahankan dengan trade-off + rencana darurat bila skenario alternatif terjadi"] },
        { criterion: "Kejujuran batas", weight: 15, levels: ["Mengklaim pipeline sempurna / tahan segalanya", "Menyebut sebagian batas", "Batas & risiko sisa eksplisit (3–5 butir), termasuk yang di luar kendali (vendor, volume ekstrem)"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 13 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Lima suntikan di Laporan Kualitas Data peninggalan Dimas:",
      "1) **Duplikat disembunyikan** (baris 2): “0 duplikat terdeteksi” — lab-mu: 60. Metodenya pun fiktif: cek order_id unik tidak menangkap duplikat baris penuh. Satu cek yang salah sasaran memberi stempel “Bersih” pada Rp 1,6 juta kebohongan.",
      "2) **Sel kosong dikecilkan** (baris 4): “0,8% — aman”. Angka sebenarnya: 324/10.920 = 2,97%. Dan ambang “< 5% = aman” dipasang setelah melihat angka — kostum kontrol kualitas, bukan kontrol kualitas.",
      "3) **“100% valid UTF-8” yang menyesatkan** (baris 6): benar secara byte, salah secara teks. 8% baris produk adalah mojibake `Es CÃ©ndol`. Pelajarannya: metrik yang mengukur hal yang salah lebih berbahaya dari tidak ada metrik.",
      "4) **Uji beban fiktif** (baris 10): “lolos 0,26 detik / 30.000 baris” — angka yang tidak pernah dihasilkan skrip Dimas. Klaim ketahanan tanpa artefak (skrip + log + tanggal) adalah fiksi. Di hari promo 10.10, fiksi inilah yang membuat pipeline mati tepat saat paling dibutuhkan.",
      "5) **Skema “stabil” + total “final”** (baris 11 & 13): skema diklaim stabil sejak 2025 padahal Oktober mengganti semua nama kolom; total “terrekonsiliasi” Rp 47.442.000 adalah angka TANPA dedup (yang benar: Rp 45.830.000). “Cocok dengan dashboard Dimas” hanya berarti dua artefak yang salah saling mengiyakan — gema, bukan verifikasi.",
      "Skor deteksimu (x/5) mengukur satu hal: apakah kamu memverifikasi klaim laporan terhadap data mentah dengan metode independen, atau memercayai stempel “siap produksi”.",
      "Refleksi keputusan: tidak ada opsi Langkah 7 yang gratis. Tambalan manual murah hari ini dan menjadi bus factor 1; validasi + SLA mahal di muka dan memanen selamanya; pembekuan terasa tegas tapi runtuh saat vendor tidak kooperatif. Engineer terbaik bukan yang memilih opsi “benar”, melainkan yang bisa menyebut HARGA opsinya — dan menyiapkan rencana bila harga itu datang.",
      "Bahaya nyata terakhir: pipeline yang diam-diam salah lebih berbahaya dari pipeline yang crash. Crash membangunkan orang; angka salah menidurkan mereka — selama tiga minggu, seperti laporan September yang kelebihan Rp 1,6 juta tanpa ada yang sadar. Itulah kenapa aturan #4 di peta keputusanmu berbunyi: gagal berisik, jangan diam-diam.",
      "Tentang misi ini sendiri: 5 suntikan di atas adalah mekanisme IMPOSTOR — disuntikkan dengan sengaja agar kamu berlatih curiga pada dokumen yang “resmi”. Di pekerjaan nyata tidak ada yang menandai suntikannya. Satu-satunya perlindunganmu adalah kebiasaan: verifikasi terhadap sumber mentah, selalu.",
    ],
    tasks: [
      { id: "t1", text: "Hitung skor deteksimu (x/5) dan tulis 1 paragraf: suntikan mana yang paling sulit kamu temukan, dan kenapa" },
    ],
    note: {
      title: "Miskonsepsi #3: pipeline yang tidak error = pipeline yang benar",
      type: "risk",
      body: "Tidak ada error bukan bukti kebenaran — hanya bukti tidak ada yang crash. Skrip Dimas “sukses” setiap bulan sambil menghasilkan angka salah Rp 1,6 juta. Kebenaran pipeline dibuktikan oleh CHECKS (angka yang diverifikasi terhadap sumber independen), bukan oleh tidak adanya traceback.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 14 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tandai misi selesai — dan tulis 1 kalimat: apa yang akan kamu lakukan BERBEDA di pipeline pertamamu di kerja nyata" },
    ],
    summary: [
      "File September: 1.560 baris kotor → 1.418 bersih; 60 duplikat (Rp 1,6 juta), 91 tanggal kosong, mojibake Es Céndol, harga ber-format; total benar Rp 45.830.000.",
      "Kontrak skema: kamus alias (nama liar → kanonik) + validasi kolom wajib yang gagal berisik + kolom tak dikenal diabaikan dengan log — lolos file Oktober (skema berubah total): 1.440 → 1.320 baris, Rp 43.347.000.",
      "Produksi = tahan berubah + gagal berisik + tahan volume: uji beban 30.000 baris tanpa loop baris; klaim ketahanan tanpa artefak uji adalah fiksi.",
      "Lima pola sabotase laporan: duplikat disembunyikan, angka dikecilkan (+ ambang dipasang belakangan), metrik yang mengukur hal yang salah, uji beban fiktif, dan “rekonsiliasi” dua artefak yang sama-sama salah.",
      "Keputusan arsitektur selalu punya harga: tambalan = bus factor 1; validasi + SLA = mahal di muka, panen selamanya; pembekuan = runtuh saat pihak lain tidak kooperatif. Setiap proses manual wajib menjawab: “apa yang terjadi saat saya tidak ada?”",
      "Data: 100% sintetis untuk misi ini (generator seed 42, METODE.md) — pola kekotorannya meniru kasus nyata export POS/ERP.",
    ],
  },
];

(misiGabungPipelineKotor.steps as V2Step[]).push(...LANJUTAN_GABUNG_2);
