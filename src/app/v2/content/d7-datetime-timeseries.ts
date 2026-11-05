import type { V2Lesson } from "../lib/types";

export const d7: V2Lesson = {
  slug: "d7-datetime-timeseries",
  track: "Python",
  module: "pandas",
  title: "D7 Datetime & Time Series: Waktu sebagai Data",
  estMinutes: 55,
  steps: [
    {
      id: "dt-period",
      eyebrow: "Langkah 1 · .dt & period",
      title: "Cerita pembuka: 'bulan lalu' yang salah",
      prose: [
        "Seorang analis menghitung transaksi bulan lalu dengan `df[df.tanggal.dt.month == 8]` — hasilnya mencampur Agustus 2025 dan 2026. Laporan salah, tidak ada yang sadar 2 minggu. Waktu adalah dimensi paling menipu: zona, format, bulan-tanpa-tahun.",
        "Obatnya: jangan filter komponen tunggal. Pakai period tahun-bulan — `df['tanggal'].dt.to_period('M') == '2026-08'` — atau rentang eksplisit setengah terbuka. `.dt` memberi akses komponen (year, dayofweek), tapi period menjaga tahunnya.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Filter `df` ke Agustus 2026 memakai `to_period('M')`" },
        { id: "t2", text: "Hitung `n` = jumlah baris hasil filter" },
      ],
      expected: "n=1",
      note: {
        title: "Sering salah",
        body: "Memakai `.dt.month == 8` untuk 'Agustus'. Itu semua Agustus semua tahun — seperti GROUP BY bulan tanpa tahun. Selalu sertakan tahun: period 'YYYY-MM' atau rentang eksplisit.",
      },
      hints: [
        "mask = df['tanggal'].dt.to_period('M') == '2026-08'.",
        "n = int(mask.sum()).",
        "Hanya 2026-08-10 yang cocok; 2025-08-15 tidak.",
      ],
      code: {
        starter: `import pandas as pd\n\ndf = pd.DataFrame({\n    'tanggal': pd.to_datetime(['2025-08-15', '2026-08-10', '2026-09-01']),\n    'jumlah': [100, 200, 300]})\n\n# TULIS KODEMU: filter Agustus 2026 saja\nmask = \nn = \n\nprint(f"n={n}")`,
        lockLines: 5,
        solution: `import pandas as pd\n\ndf = pd.DataFrame({\n    'tanggal': pd.to_datetime(['2025-08-15', '2026-08-10', '2026-09-01']),\n    'jumlah': [100, 200, 300]})\n\n# TULIS KODEMU: filter Agustus 2026 saja\nmask = df['tanggal'].dt.to_period('M') == '2026-08'\nn = int(mask.sum())\n\nprint(f"n={n}")`,
        checks: [
          { kind: "equal", task: "t2", name: "n", value: 1, tol: 1e-9, label: "`n` = 1", msg: "Hanya 2026-08-10; 2025-08-15 tersaring." },
          { kind: "stdout_matches", task: "t2", pattern: "n=1", label: "`print` menampilkan n", msg: "Format: n=1." },
        ],
      },
      reference: "df['t'].dt.to_period('M') == '2026-08'. Jangan .dt.month saja.",
    },
    {
      id: "resample",
      eyebrow: "Langkah 2 · resample",
      title: "GROUP BY versi waktu",
      prose: [
        "`resample` butuh DatetimeIndex: `df.set_index('tanggal').sort_index()`, lalu `.resample('W').sum()` untuk total mingguan, `'ME'` untuk bulanan. Ini GROUP BY untuk dimensi waktu.",
        "Perhatikan tanggal yang hilang: `resample('D').sum()` mengisi hari kosong dengan 0 (sum), bukan NaN. Bedakan 'tidak ada transaksi' (0) dari 'data hilang' (NaN) — keputusan bisnis yang berbeda.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Set index tanggal + sort, lalu `weekly` = resample mingguan (sum)" },
        { id: "t2", text: "Ambil `minggu1` = total minggu pertama" },
      ],
      expected: "minggu1=1125000",
      note: {
        title: "Sering salah",
        body: "Memanggil `resample` tanpa `set_index` datetime — error. Atau lupa `sort_index` sehingga jendela rolling/resample kacau. Urutan: set_index dulu, sort, baru resample.",
      },
      hints: [
        "ts = df.set_index('tanggal').sort_index()['jumlah'].",
        "weekly = ts.resample('W').sum().",
        "minggu1 = int(weekly.iloc[0])  # minggu berakhir 2026-09-06",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-02,300000\n2026-09-03,250000\n2026-09-05,75000\n2026-09-08,150000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])\n\n# TULIS KODEMU\nts = \nweekly = \nminggu1 = \n\nprint(f"minggu1={minggu1}")\nprint(weekly.to_dict())`,
        lockLines: 11,
        solution: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-02,300000\n2026-09-03,250000\n2026-09-05,75000\n2026-09-08,150000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])\n\n# TULIS KODEMU\nts = df.set_index("tanggal").sort_index()["jumlah"]\nweekly = ts.resample("W").sum()\nminggu1 = int(weekly.iloc[0])\n\nprint(f"minggu1={minggu1}")\nprint(weekly.to_dict())`,
        checks: [
          { kind: "equal", task: "t2", name: "minggu1", value: 1125000, tol: 1e-9, label: "`minggu1` = 1125000", msg: "500rb + 300rb + 250rb + 75rb (1-5 Sep)." },
          { kind: "stdout_matches", task: "t2", pattern: "minggu1=1125000", label: "`print` menampilkan minggu1", msg: "Format: minggu1=1125000." },
        ],
      },
      reference: "set_index + sort_index dulu. 'D'/'W'/'ME'/'QE'. rolling(n), shift(n), pct_change().",
    },
    {
      id: "rolling",
      eyebrow: "Langkah 3 · rolling & shift",
      title: "Rata-rata bergerak dan lag",
      prose: [
        "`rolling(3).mean()` menghaluskan noise — tren terlihat. `shift(1)` menggeser data: kemarin untuk hari ini, LAG-nya pandas. `pct_change()` memberi pertumbuhan (baru-lama)/lama dalam satu baris.",
        "Pola laporan: `resample('ME').sum()` lalu `pct_change(12)` = YoY bulanan. Dua baris menjadi analisis tahunan. Tapi ingat tepi jendela: MA-3 di titik awal hanya dari 1-2 data — belum stabil.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Hitung `ma3` = rolling 3 dari `ts`" },
        { id: "t2", text: "Ambil `terakhir` = nilai MA-3 terakhir, dibulatkan" },
      ],
      expected: "terakhir=1233333",
      note: {
        title: "Sering salah",
        body: "Memakai `rolling(7, center=True)` untuk fitur prediksi — center memakai 3 hari ke depan, itu lookahead. Untuk sinyal, selalu trailing (default) + shift(1).",
      },
      hints: [
        "ma3 = ts.rolling(3).mean().",
        "terakhir = int(round(ma3.iloc[-1])).",
        "(500rb + 2jt + 1,2jt) / 3 = 1233333.",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])\nts = df.set_index("tanggal").sort_index()["jumlah"]\n\n# TULIS KODEMU\nma3 = \nterakhir = \n\nprint(f"terakhir={terakhir}")`,
        lockLines: 8,
        solution: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"])\nts = df.set_index("tanggal").sort_index()["jumlah"]\n\n# TULIS KODEMU\nma3 = ts.rolling(3).mean()\nterakhir = int(round(ma3.iloc[-1]))\n\nprint(f"terakhir={terakhir}")`,
        checks: [
          { kind: "equal", task: "t2", name: "terakhir", value: 1233333, tol: 1.0, label: "`terakhir` = 1233333", msg: "Rata-rata 3 terakhir: (500rb + 2jt + 1,2jt)/3." },
          { kind: "stdout_matches", task: "t2", pattern: "terakhir=1233333", label: "`print` menampilkan terakhir", msg: "Format: terakhir=1233333." },
        ],
      },
      reference: "rolling(n).mean() untuk MA; shift(1) untuk lag; pct_change() untuk growth.",
    },
    {
      id: "lookahead",
      eyebrow: "Langkah 4 · Lookahead",
      title: "Dosa time series",
      prose: [
        "Lookahead bias: memakai info masa depan untuk keputusan masa lalu. `rolling(3).mean()` untuk sinyal hari ini mencakup hari ini — bocor. Yang benar: `shift(1).rolling(3).mean()`, hanya masa lalu.",
        "Bangun kedua versi dan bandingkan: 1 dari 7 hari memberi sinyal berbeda. Backtest dengan sinyal bocor terlihat akurat — menipu. Di kredit sama: 'DPD 90 hari' sebagai fitur prediksi saat pencairan adalah lookahead, karena belum terjadi. Fitur harus point-in-time.",
      ],
      requires: ["pandas"],
      tasks: [
        { id: "t1", text: "Buat `sinyal_bocor` (tanpa shift) dan `sinyal_aman` (shift 1)" },
        { id: "t2", text: "Hitung `beda` = jumlah hari dengan sinyal berbeda" },
      ],
      expected: "beda=1 dari 7 hari",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model kredit yang 'sempurna' di backtest lalu hancur di produksi hampir selalu lookahead: fitur mengandung info masa depan. Tanya selalu: apakah nilai ini sudah diketahui saat keputusan dibuat?",
      },
      hints: [
        "sinyal_bocor = df['jumlah'] > df['jumlah'].rolling(3).mean().",
        "sinyal_aman = df['jumlah'] > df['jumlah'].shift(1).rolling(3).mean().",
        "beda = int((sinyal_bocor != sinyal_aman).sum())",
      ],
      code: {
        starter: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-02,300000\n2026-09-03,250000\n2026-09-05,75000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"]).sort_values("tanggal")\n\n# TULIS KODEMU\nsinyal_bocor = \nsinyal_aman = \nbeda = \n\nprint(f"beda={beda} dari {len(df)} hari")`,
        lockLines: 10,
        solution: `import pandas as pd, io\n\ncsv = """tanggal,jumlah\n2026-09-01,500000\n2026-09-02,300000\n2026-09-03,250000\n2026-09-05,75000\n2026-09-10,2000000\n2026-09-12,500000\n2026-09-15,1200000"""\ndf = pd.read_csv(io.StringIO(csv), parse_dates=["tanggal"]).sort_values("tanggal")\n\n# TULIS KODEMU\nsinyal_bocor = df["jumlah"] > df["jumlah"].rolling(3).mean()\nsinyal_aman = df["jumlah"] > df["jumlah"].shift(1).rolling(3).mean()\nbeda = int((sinyal_bocor != sinyal_aman).sum())\n\nprint(f"beda={beda} dari {len(df)} hari")`,
        checks: [
          { kind: "equal", task: "t2", name: "beda", value: 1, tol: 1e-9, label: "`beda` = 1", msg: "Satu hari (lonjakan 2jt) memberi sinyal berbeda." },
          { kind: "stdout_matches", task: "t2", pattern: "beda=1 dari 7 hari", label: "`print` menampilkan beda", msg: "Format: beda=1 dari 7 hari." },
        ],
      },
      reference: "Fitur prediksi hari-T hanya dari data < T. shift(1) = pola aman standar.",
    },
    {
      id: "timezone",
      eyebrow: "Langkah 5 · Timezone",
      title: "Simpan UTC, tampil lokal",
      prose: [
        "`tz_localize('Asia/Jakarta')` memasang zona pada datetime naive; `tz_convert('UTC')` mengubah zona yang sudah sadar. Jangan campur naive dan aware — error. Aturan: simpan UTC, konversi saat tampil.",
        "Server UTC + user WIB = selisih 7 jam. 'Transaksi hari ini' bisa salah hari karenanya. Bahkan untuk data domestik: selalu eksplisit tentang zona. Timezone tidak penting sampai ia penting — lalu sudah terlambat.",
      ],
      tasks: [],
      reference: "tz_localize = pasang zona (naive); tz_convert = ubah zona. Simpan UTC.",
    },
    {
      id: "advanced-tz",
      eyebrow: "Langkah 6 · Advanced",
      title: "Advanced: pipeline tz-aware, resample vs rolling, jebakan DST",
      prose: [
        "Tiga penguasaan waktu yang memisahkan analis junior dari senior. Pertama, PIPELINE TZ-AWARE yang baku: parse → `tz_localize` (beri tahu zona WAKTU SUMBER pada timestamp naive — \"jam ini adalah jam Jakarta\") → `tz_convert(\"UTC\")` untuk disimpan dan dihitung → `tz_convert` ke lokal hanya saat ditampilkan. Aturannya keras: jangan pernah mencampur naive dan aware dalam satu operasi (pandas melempar TypeError — dan itu melindungimu), dan jangan pernah menyimpan \"jam dinding\" tanpa zona untuk data lintas wilayah. UTC adalah satu-satunya zona yang tidak pernah berbohong.",
        "Kedua, RESAMPLE vs ROLLING — dua cara meringkas waktu yang menjawab pertanyaan berbeda. `resample(\"ME\")` memotong waktu menjadi bin kalender tetap (bulanan, label di tepi kanan bin secara default) — untuk pelaporan kalender (\"NPL per bulan\"). `rolling(3)` menggeser jendela sepanjang tiap titik — untuk indikator trailing (\"rata-rata NPL 3 bulan terakhir per tanggal\"). Jebakan label: resample(\"ME\") memberi label akhir bulan — bila kamu join hasilnya ke tabel berlabel awal bulan, semuanya miss 1 bulan diam-diam. Jebakan kedua: rolling().mean() di titik t memakai t-2..t (aman, tidak melihat masa depan); tetapi `.shift(-1)` atau rolling dengan center=True mengintip ke depan — dosa lookahead dari Langkah 4 dalam wujud baru.",
        "Ketiga, JEBAKAN DST (Daylight Saving Time): Indonesia tidak punya DST, tetapi data dari server AS/Eropa punya — dan DST adalah ritus pendewasaan setiap analis. Dua monster: waktu AMBIGU (saat fall-back, jam 01:00–02:00 terjadi DUA KALI — timestamp yang sama merujuk dua momen berbeda) dan waktu NONEXISTENT (saat spring-forward, jam 02:00–03:00 tidak pernah ada — timestamp di rentang itu fiktif). pandas: `tz_localize(..., ambiguous=\"NaT\")` menandai yang ambigu sebagai missing alih-alih menebak, `nonexistent=\"shift_forward\"` menggeser yang fiktif. Agregasi per jam atas data naive dari server DST akan menggandakan jam yang berulang — selisihnya kecil per jam, tetapi cukup untuk membuat rekonsiliasi dengan payment gateway selisih miliaran. Aturan: konversi ke UTC SEBELUM agregasi apa pun — di UTC tidak ada DST, tidak ada ambiguitas.",
      ],
      tasks: [],
      reference: "localize (sumber) → UTC (simpan/hitung) → lokal (tampil). resample = bin kalender; rolling = jendela geser. DST: ambiguous/nonexistent — agregasi selalu di UTC.",
    },
    {
      id: "minicase-jam-ganda",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: jam yang terjadi dua kali",
      prose: [
        "Skenario (angka konkret): e-commerce dengan server di US Eastern menarik data transaksi per jam untuk laporan harian. Pada 1 November 2026 (fall-back DST), jam 01:00–02:00 terjadi dua kali. Script agregasi memakai timestamp naive hasil konversi mentah: `df.groupby(df[\"waktu\"].dt.hour)` — jam 1 muncul dua kali dan TERGABUNG menjadi satu bin. Hasil: bin jam-1 mencatat 25.000 transaksi, dua kali lipat jam normal — dan total harian selisih Rp 1,2 miliar dibanding settlement payment gateway. Tim finance menahan laporan 6 jam; analis lembur mencari \"transaksi fiktif\" yang tidak ada.",
        "Pertanyaan analisis: (1) Mengapa groupby menggabungkan dua jam yang berbeda? (2) Di titik mana seharusnya zona waktu ditangani? (3) Bagaimana struktur agregasi yang benar?",
        "Pembahasan: (1) Timestamp naive tidak membawa informasi offset — 01:30 EDT dan 01:30 EST terlihat identik sebagai string/jam, padahal momennya beda 1 jam; groupby atas representasi naive menggabungkan keduanya. (2) Di titik PARSE: `tz_localize(\"US/Eastern\", ambiguous=\"NaT\")` saat membaca — yang ambigu ditandai, bukan ditebak; lalu `tz_convert(\"UTC\")` sebelum agregasi apa pun. (3) Agregasi selalu di UTC (tidak ada DST, tidak ada ambiguitas); konversi ke lokal hanya untuk label tampilan. Bonus: assert rekonsiliasi — total per jam di UTC harus sama dengan total settlement gateway; selisih > 0,1% = alarm.",
        "Kaitan ke karier: bug DST tidak bisa di-debug dari chart — ia hanya terlihat saat rekonsiliasi gagal. Pipeline yang \"selalu benar kecuali 2 hari setahun\" adalah jenis bug yang membuat analis senior memeriksa zona waktu SEBELUM melihat datanya.",
      ],
      tasks: [],
      reference: "Parse: localize dengan ambiguous/nonexistent eksplisit; agregasi di UTC; rekonsiliasi vs sumber kebenaran.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 8 · Intuisi",
      title: "Intuisi: waktu adalah koordinat, bukan label",
      prose: [
        "Heuristik penutup: perlakukan timestamp seperti koordinat GPS — tanpa sistem referensi (zona), angkanya tidak berarti.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: waktu adalah koordinat, bukan label",
        body: "Kesalahan waktu tidak pernah terlihat \"salah\" — chart-nya tetap rapi, angkanya tetap masuk akal, hanya saja bergeser. Heuristik pertama: UTC untuk disimpan dan dihitung, lokal hanya untuk ditampilkan — satu kalimat ini mencegah 90% bug waktu lintas sistem. Heuristik kedua: jangan pernah mencampur naive dan aware — TypeError yang dilempar pandas adalah temanmu; yang berbahaya adalah konversi diam-diam via string. Heuristik ketiga: DST adalah pajak yang hanya dibayar 2 hari setahun tetapi tagihannya besar — untuk data dari zona ber-DST, tangani ambiguous/nonexistent secara eksplisit di titik parse, bukan saat agregasi sudah aneh. Heuristik keempat: resample menjawab \"per kalender\", rolling menjawab \"per jendela trailing\" — salah pilih berarti menjawab pertanyaan yang tidak ditanya; dan label bin (tepi kanan vs kiri) harus cocok dengan tabel yang di-join. Heuristik kelima, yang paling senior: setiap agregat waktu butuh sumber kebenaran eksternal untuk rekonsiliasi (settlement gateway, total harian core banking) — tanpa itu, kamu tidak akan pernah tahu jam gandamu menggandakan angka.",
      },
      reference: "UTC simpan/hitung; naive+aware jangan campur; DST eksplisit di parse; resample vs rolling sesuai pertanyaan; selalu rekonsiliasi.",
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
          q: "df[df.tanggal.dt.month == 8]...",
          options: [
            { text: "Benar untuk Agustus 2026", why: "Tidak — ia mengambil semua Agustus semua tahun." },
            { text: "Salah: campur semua Agustus semua tahun", why: "Pakai period YYYY-MM atau rentang eksplisit.", correct: true },
            { text: "Error", why: "Tidak error — diam-diam salah, itu bahayanya." },
            { text: "Hasil kosong", why: "Tidak kosong — justru kebanyakan." },
          ],
        },
        {
          q: "resample butuh...",
          options: [
            { text: "Tidak ada syarat", why: "Ada: DatetimeIndex." },
            { text: "DatetimeIndex (set_index + sort)", why: "Index harus datetime dan terurut.", correct: true },
            { text: "Kolom string tanggal", why: "Harus datetime, bukan string." },
            { text: "GroupBy dulu", why: "resample adalah groupby-nya waktu — tidak perlu groupby manual." },
          ],
        },
        {
          q: "Sinyal 'di atas MA-7' yang benar (anti lookahead)...",
          options: [
            { text: "rolling(7).mean()", why: "Mencakup hari ini — bocor untuk sinyal hari ini." },
            { text: "shift(1).rolling(7).mean()", why: "Hanya masa lalu. center=True justru bocor.", correct: true },
            { text: "expanding().mean()", why: "Itu rata-rata semua histori — bukan MA-7." },
            { text: "rolling(7, center=True).mean()", why: "Center memakai masa depan — lookahead." },
          ],
        },
        {
          q: "tz_localize vs tz_convert...",
          options: [
            { text: "Sama saja", why: "Beda: localize untuk naive, convert untuk yang sudah sadar zona." },
            { text: "localize = pasang zona (naive), convert = ubah zona", why: "Pasang dulu, baru ubah.", correct: true },
            { text: "convert lebih cepat", why: "Bukan soal kecepatan." },
            { text: "localize menghapus zona", why: "Itu tz_naive — kebalikannya." },
          ],
        },
      ],
      summary: [
        ".dt untuk komponen; period YYYY-MM untuk filter bulan.",
        "resample = agregat waktu (butuh DatetimeIndex); rolling = MA; shift/pct_change = lag/growth.",
        "Timezone: localize lalu convert; simpan UTC, tampil lokal.",
        "Lookahead: fitur hanya dari masa lalu — shift(1) pola aman.",
        "Bug waktu bersembunyi lama karena hasilnya masuk akal: pasang assert.",
      ],
      next: { label: "D8-1 — Visualisasi matplotlib", href: "/learn/d8-visualisasi-1" },
    },
  ],
};
