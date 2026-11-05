import type { V2Lesson } from "../lib/types";

const FIG_FIELDS = `<svg viewBox="0 0 480 260" role="img" aria-label="Tiga keluarga data field dan horizon sinyalnya.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Keluarga field × horizon sinyal</text>
<text x="16" y="52" font-size="12" fill="var(--chart-text)">Price-volume (cepat)</text>
<rect x="200" y="38" width="120" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="206" y="56" font-size="11" fill="var(--chart-text)">harian–mingguan</text>
<text x="16" y="92" font-size="12" fill="var(--chart-text)">Analyst estimates (menengah)</text>
<rect x="200" y="78" width="180" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="206" y="96" font-size="11" fill="var(--chart-text)">mingguan–bulanan</text>
<text x="16" y="132" font-size="12" fill="var(--chart-text)">Fundamental (lambat)</text>
<rect x="200" y="118" width="240" height="26" fill="var(--c2)" opacity="0.9"/>
<text x="206" y="136" font-size="11" fill="var(--chart-text)">bulanan–kuartalan</text>
<text x="16" y="172" font-size="11" fill="var(--chart-text)">Cara membaca: panjang batang = horizon di mana keluarga field masih relevan.</text>
<text x="16" y="192" font-size="11" fill="var(--chart-text)">Interpretasi: sinyal cepat dari data lambat = basi; sinyal lambat dari data cepat = berisik.</text>
<text x="16" y="216" font-size="11" fill="var(--chart-text)" fill-opacity="0.75">Field mati (fam_/mdf_/snt_/scl12_): batang NOL — tidak hidup di horizon mana pun.</text>
</g>
</svg>`;

export const wqb9: V2Lesson = {
  slug: "wqb9-data-fields",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB9 — Data Fields: Bahan Baku Alpha & Field yang Mati",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Empat puluh alpha di atas tanah mati",
      prose: [
        "Sebuah tim kecil menghabiskan enam minggu membangun 40 alpha di atas keluarga field sentimen media sosial — backtest lokalnya menjanjikan. Saat dipindah ke platform, ke-40-nya error serentak: 'invalid field'. Ternyata keluarga field itu tidak tersedia di akun mereka — dokumentasinya ada, datanya tidak. Enam minggu riset berdiri di atas tanah yang tidak ada.",
        "Yang lebih pahit: seorang anggota tim sebenarnya sudah curiga di minggu kedua ('kok semua contoh memakai field ini gagal?'), tetapi tidak ada yang memverifikasi — karena 'masa iya dokumentasi bohong'. Dokumentasi tidak bohong; ia hanya tidak menjanjikan ketersediaan di setiap akun dan region.",
        "Twist-nya: 40 alpha itu BUKAN sampah — logikanya valid. Yang mati adalah bahan bakunya. Seperti koki yang merancang 40 resep dari bahan yang tidak dijual di kotanya. Lesson ini adalah peta bahan: apa saja keluarga field yang hidup, di horizon mana mereka relevan, dan bagaimana memverifikasi sebelum membangun.",
        "Setelah lesson ini kamu bisa: (1) menyebutkan tiga keluarga field utama beserta contohnya; (2) menjelaskan ts_backfill dan kapan ia dibutuhkan; (3) menjelaskan kenapa family fam_/mdf_/snt_/scl12_ mati total; (4) menjalankan verifikasi field sebelum riset; (5) memasangkan keluarga field dengan horizon sinyal yang tepat.",
      ],
      tasks: [],
      note: {
        title: "Bahan sebelum resep",
        body: "Riset alpha = memasak. Field = bahan. Verifikasi ketersediaan bahan SELALU mendahului perancangan resep — koki profesional mengecek pasar dulu, baru menulis menu.",
      },
      reference: "40 alpha valid + 0 field tersedia = 0 alpha.",
    },
    {
      id: "keluarga",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga keluarga field yang hidup",
      prose: [
        "Keluarga satu: price-volume — close, open, high, low, volume, vwap (harga rata-rata tertimbang volume), returns. Ini bahan tercepat: berubah tiap hari, cocok untuk sinyal harian–mingguan (reversal, momentum, volatilitas). Hampir selalu tersedia dan paling teruji.",
        "Keluarga dua: analyst estimates — est_epsr (estimasi laba per saham analis), est_fcf (estimasi arus kas bebas), dan kerabatnya. Bahan menengah: diperbarui saat analis merevisi, cocok untuk sinyal mingguan–bulanan. Contoh nyata: alpha pemenang memakai ts_corr(est_epsr, est_fcf) — 'perusahaan yang analisnya kompak optimistis'.",
        "Keluarga tiga: fundamental — sales (penjualan), assets (aset), cashflow, dan rasio turunannya (sales/assets = efisiensi aset). Bahan lambat: berubah kuartalan, cocok untuk sinyal bulanan–kuartalan. Contoh: rank(sales/assets) memilih perusahaan yang efisien memakai asetnya.",
        "Cara membaca figur: tiga batang = horizon relevansi tiap keluarga. Interpretasi: memaksa sinyal harian dari data kuartalan = basi sebelum lahir; memaksa sinyal kuartalan dari data harian = berisik. Jodohkan kecepatan sinyal dengan kecepatan bahan — seperti memilih decay.",
      ],
      figure: {
        svg: FIG_FIELDS,
        alt: "Tiga batang horizon: price-volume pendek, estimates menengah, fundamental panjang; field mati nol.",
        caption: "Jodohkan kecepatan sinyal dengan kecepatan bahan bakunya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Field mahal/eksotis = sinyal lebih bagus.” Field eksotis yang jarang dipakai justru berisiko: cakupan historis pendek, definisi berubah, dan — seperti kisah pembuka — bisa mati total di akunmu. Mulai dari yang paling standar, buktikan, baru eksplorasi.",
      },
      hints: [
        "Price-volume: cepat, selalu ada. Estimates: menengah. Fundamental: lambat.",
        "Contoh pemenang nyata memakai ketiganya — tidak ada keluarga yang 'lebih baik' secara mutlak.",
      ],
      reference: "Cepat↔cepat, lambat↔lambat. Bahan standar dulu, eksotis kemudian.",
    },
    {
      id: "mati",
      eyebrow: "Langkah 3 · Konsep",
      title: "Field yang mati & ts_backfill",
      prose: [
        "Pelajaran nyata platform: family field berprefix fam_, mdf_, snt_, scl12_ MATI TOTAL — setiap simulasi yang memakainya invalid, tanpa kecuali. Penyebabnya di sisi penyedia data (field tidak tersedia untuk akun/region ini), bukan kesalahan sintaks. Ciri khasnya: error konsisten 100%, bukan kadang-kadang — itulah bedanya 'field mati' dengan 'bug kode'.",
        "Protokol verifikasi sebelum riset (tiga langkah, lima menit): satu — jalankan SATU simulasi minimal yang hanya memakai field itu (mis. rank(fam_contoh)); dua — bila invalid, coba varian field sekeluarga; tiga — bila seluruh family invalid, nyatakan mati dan JANGAN bangun apa pun di atasnya. Lima menit verifikasi menghemat enam minggu seperti kisah pembuka.",
        "Terpisah dari itu: ts_backfill = operator untuk data yang BERLUBANG tetapi field-nya hidup. Contoh: saham IPO 2 tahun lalu tidak punya data 5 tahun; ts_backfill(metric, 120) mengisi kekosongan dengan nilai tersedia terakhir hingga 120 hari ke belakang. Tanpa ini, satu lubang data meracuni seluruh deret waktu.",
        "Miskonsepsi: 'data kosong = buang sahamnya.' Kadang benar (lubang di tengah = data rusak), tetapi untuk saham muda, backfill adalah solusi standar — membuangnya berarti membuang justru perusahaan-perusahaan muda yang menarik.",
      ],
      formula: String.raw`\text{ts\_backfill}(x, n) = x_t \text{ terakhir yang ada dalam } n \text{ hari}`,
      formulaNote: "x = field berlubang, n = jendela lihat-ke-belakang (hari). Bila tidak ada data dalam n hari → tetap kosong (tidak dikarang).",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Error sekali = field mati.” Satu error bisa jadi salah ketik nama field. Field dinyatakan mati hanya setelah: (a) ejaan terverifikasi benar, (b) gagal konsisten di beberapa simulasi, (c) sekeluarga ikut gagal. Tiga syarat, bukan satu firasat.",
      },
      hints: [
        "Ciri field mati: gagal 100% konsisten, sekeluarga ikut gagal.",
        "ts_backfill = tambal lubang data (field hidup); bukan penghidup field mati.",
      ],
      reference: "Verifikasi 5 menit > 6 minggu riset di atas tanah mati.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Backfill lubang data & deteksi field mati",
      prose: [
        "Deret metrik 10 hari dengan lubang (None) di indeks 1–3 dan 7. Tugasmu: (1) tulis ts_backfill mainan: isi tiap None dengan nilai terakhir yang ada dalam jendela n hari; (2) untuk n = 2 dan n = 5, cetak deret hasil; (3) jawab: lubang mana yang TETAP kosong pada n = 2 dan kenapa? (4) simulasikan 'pemeriksa field': dari daftar hasil simulasi mainan, tandai family yang gagal 100% sebagai MATI.",
        "Eksperimen setelah selesai: ubah n menjadi 1 — berapa banyak lubang tersisa? Rasakan trade-off jendela: terlalu pendek = lubang tersisa; terlalu panjang = data basi ikut dipakai.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `backfill(data, n)`" },
        { id: "t2", text: "Cetak hasil untuk n = 2 dan n = 5" },
        { id: "t3", text: "Tandai family field yang gagal 100% sebagai MATI" },
      ],
      expected: "n=2: [10, 10, 10, None, 14, 15, 16, 16, 18, 19]\nn=5: [10, 10, 10, 10, 14, 15, 16, 16, 18, 19]\nMATI: ['fam_', 'snt_']",
      note: {
        title: "Intuisi",
        body: "Backfill = 'pakai kabar terakhir yang masih dalam jangkauan ingatan'. Jendela n adalah panjang ingatan: di luar itu, lebih jujur mengakui tidak tahu (None) daripada mengarang.",
      },
      hints: [
        "Untuk tiap None di indeks i: cari mundur nilai tak-None dalam n langkah.",
        "Family MATI = semua hasil 'invalid' (bukan sebagian).",
      ],
      code: {
        starter: "# Deret metrik 10 hari (None = lubang). JANGAN UBAH.\ndata = [10, None, None, None, 14, 15, 16, None, 18, 19]\n# Hasil simulasi mainan: (family, status)\nuji = [(\"fam_\", \"invalid\"), (\"fam_\", \"invalid\"), (\"est_\", \"ok\"),\n        (\"snt_\", \"invalid\"), (\"snt_\", \"invalid\"), (\"est_\", \"ok\")]\n\n# TULIS KODEMU\ndef backfill(data, n):\n    return  # list baru; tiap None diisi nilai ASLI terakhir dalam n hari\n\nfor n in (2, 5):\n    print(f\"n={n}: {backfill(data, n)}\")\n\nmati = []\nfor fam in sorted(set(f for f, _ in uji)):\n    hasil = [st for f, st in uji if f == fam]\n    if all(st == \"invalid\" for st in hasil):\n        mati.append(fam)\nprint(f\"MATI: {mati}\")\n",
        lockLines: 6,
        solution: "# Deret metrik 10 hari (None = lubang). JANGAN UBAH.\ndata = [10, None, None, None, 14, 15, 16, None, 18, 19]\n# Hasil simulasi mainan: (family, status)\nuji = [(\"fam_\", \"invalid\"), (\"fam_\", \"invalid\"), (\"est_\", \"ok\"),\n        (\"snt_\", \"invalid\"), (\"snt_\", \"invalid\"), (\"est_\", \"ok\")]\n\n# TULIS KODEMU\ndef backfill(data, n):\n    out = list(data)\n    for i, v in enumerate(data):\n        if v is None:\n            for j in range(i - 1, max(i - n - 1, -1), -1):\n                if data[j] is not None:\n                    out[i] = data[j]\n                    break\n    return out\n\nfor n in (2, 5):\n    print(f\"n={n}: {backfill(data, n)}\")\n\nmati = []\nfor fam in sorted(set(f for f, _ in uji)):\n    hasil = [st for f, st in uji if f == fam]\n    if all(st == \"invalid\" for st in hasil):\n        mati.append(fam)\nprint(f\"MATI: {mati}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "n=2: indeks 3 tetap None", msg: "Lubang 3-hari (indeks 1–3) > jendela 2: indeks 3 tak terjangkau.", pattern: "n=2: \\[10, 10, 10, None, 14, 15, 16, 16, 18, 19\\]" },
          { kind: "stdout_matches", task: "t2", label: "n=5 penuh", msg: "Jendela 5 menjangkau semua lubang.", pattern: "n=5: \\[10, 10, 10, 10, 14, 15, 16, 16, 18, 19\\]" },
          { kind: "stdout_matches", task: "t3", label: "Family mati terdeteksi", msg: "fam_ dan snt_ gagal 100%.", pattern: "MATI: \\['fam_', 'snt_'\\]" }
        ],
      },
      reference: "Backfill = ingatan terbatas. Field mati = gagal 100% sekeluarga.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Memilih bahan baku",
      prose: [
        "Satu: sinyal harian–mingguan → price-volume dulu. Dua: sinyal mingguan–bulanan → analyst estimates. Tiga: sinyal bulanan–kuartalan → fundamental. Empat: field belum pernah dipakai tim → verifikasi 5 menit (satu simulasi minimal) SEBELUM merancang apa pun. Lima: satu error → cek ejaan; error konsisten sekeluarga → nyatakan mati, pindah bahan.",
        "Aturan praktis 10 detik: 'apakah field ini hidup di akunku?' — belum dibuktikan = belum hidup.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Koki terbaik bukan yang punya bahan paling eksotis, melainkan yang paling paham bahan yang ia punya. Tiga keluarga standar sudah cukup untuk ratusan alpha — eksplorasi field baru adalah kemewahan setelah yang standar dikuasai.",
      },
      reference: "Horizon jodoh bahan; verifikasi sebelum merancang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Dua minggu di atas field mati",
      prose: [
        "Data: peneliti A membangun 12 alpha di atas field snt_score. Semua error 'invalid field'. Ia berkata: 'mungkin settings saya salah, saya coba 12 kombinasi settings dulu.'",
        "Pertanyaan: respons tepat? Pembahasan: (1) 12/12 gagal konsisten = pola field mati, bukan settings — mengganti settings 12× tidak mengubah ketersediaan data. (2) Langkah benar: SATU simulasi minimal rank(snt_score) → invalid → coba snt_ lain → invalid semua → nyatakan family mati (5 menit). (3) Keputusan: hentikan 12 alpha, pindahkan logikanya ke field hidup terdekat (mis. estimates), catat family mati di daftar hitam tim agar tidak terulang. (4) Pelajaran: mengenali pola 'gagal 100% konsisten' menghemat minggu — debugging buta adalah pajak ketidaktahuan pola.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam operasional risiko, 'data tidak tersedia' yang tidak terdeteksi = laporan kosong yang dikira lengkap. Protokol verifikasi ketersediaan data adalah kontrol kualitas — di riset alpha maupun di risk reporting.",
      },
      reference: "Gagal 100% konsisten = pola field mati. Verifikasi, nyatakan, pindah.",
    },
    {
      id: "lab-field",
      eyebrow: "Langkah 7 · Lab",
      title: "Inspeksi bahan: hidup atau mati?",
      prose: [
        "Daftar 10 field calon bahan baku. Tugasmu: tulis pengklasifikasi `keluarga(f)` — price-volume (close/open/high/low/volume/vwap/returns), estimates (awalan est_), fundamental (sisanya yang hidup), atau MATI (awalan fam_/mdf_/snt_/scl12_). Cetak klasifikasinya + verdict: berapa field yang bisa dipakai?",
        "Eksperimen setelah selesai: tambahkan field 'scl12_xyz' dan 'assets' — apa klasifikasinya? Mengapa aturan awalan harus dicek SEBELUM aturan lain?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `keluarga(f)` sesuai aturan" },
        { id: "t2", text: "Klasifikasikan 10 field + cetak verdict" },
      ],
      expected: "close -> price-volume\nvolume -> price-volume\nest_epsr -> estimates\nsales -> fundamental\nfam_sent -> MATI\nvwap -> price-volume\nsnt_score -> MATI\ncashflow -> fundamental\nest_fcf -> estimates\nmdf_x -> MATI\nBisa dipakai: 7/10",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Cek daftar hidup dulu, daftar mati belakangan.” Urutan yang benar: cek daftar MATI dulu — karena 'snt_score' terlihat seperti field biasa bila kamu hanya mencocokkan daftar hidup. Blacklist selalu diperiksa sebelum whitelist.",
      },
      hints: [
        "Cek startswith(('fam_','mdf_','snt_','scl12_')) PALING AWAL.",
        "est_ → estimates; daftar price-volume eksplisit; sisanya fundamental.",
      ],
      code: {
        starter: "# Daftar field calon. JANGAN UBAH.\nfields = [\"close\", \"volume\", \"est_epsr\", \"sales\", \"fam_sent\",\n          \"vwap\", \"snt_score\", \"cashflow\", \"est_fcf\", \"mdf_x\"]\nPV = {\"close\", \"open\", \"high\", \"low\", \"volume\", \"vwap\", \"returns\"}\nMATI = (\"fam_\", \"mdf_\", \"snt_\", \"scl12_\")\n\n# TULIS KODEMU\ndef keluarga(f):\n    return  # 'MATI' / 'price-volume' / 'estimates' / 'fundamental'\n\nhidup = 0\nfor f in fields:\n    k = keluarga(f)\n    print(f\"{f} -> {k}\")\n    if k != \"MATI\":\n        hidup += 1\nprint(f\"Bisa dipakai: {hidup}/{len(fields)}\")\n",
        lockLines: 4,
        solution: "# Daftar field calon. JANGAN UBAH.\nfields = [\"close\", \"volume\", \"est_epsr\", \"sales\", \"fam_sent\",\n          \"vwap\", \"snt_score\", \"cashflow\", \"est_fcf\", \"mdf_x\"]\nPV = {\"close\", \"open\", \"high\", \"low\", \"volume\", \"vwap\", \"returns\"}\nMATI = (\"fam_\", \"mdf_\", \"snt_\", \"scl12_\")\n\n# TULIS KODEMU\ndef keluarga(f):\n    if f.startswith(MATI):\n        return \"MATI\"\n    if f in PV:\n        return \"price-volume\"\n    if f.startswith(\"est_\"):\n        return \"estimates\"\n    return \"fundamental\"\n\nhidup = 0\nfor f in fields:\n    k = keluarga(f)\n    print(f\"{f} -> {k}\")\n    if k != \"MATI\":\n        hidup += 1\nprint(f\"Bisa dipakai: {hidup}/{len(fields)}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `keluarga` ada", msg: "Definisikan def keluarga(f).", name: "keluarga" },
          { kind: "stdout_matches", task: "t2", label: "fam_sent MATI", msg: "Awalan fam_ = mati.", pattern: "fam_sent -> MATI" },
          { kind: "stdout_matches", task: "t2", label: "7/10 bisa dipakai", msg: "3 mati: fam_sent, snt_score, mdf_x.", pattern: "Bisa dipakai: 7/10" }
        ],
      },
      reference: "Blacklist dulu, baru whitelist. 5 menit menghemat 6 minggu.",
    },
    {
      id: "fields-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Disiplin point-in-time & jebakan look-ahead",
      prose: [
        "Jebakan termahal dalam riset fundamental bukan field mati — melainkan field yang HIDUP tetapi bohong tentang tanggalnya. Contoh: laba Q3 diumumkan 15 November; periode fiskalnya berakhir 30 September. Database yang rapi mencatat angka itu pada 'Q3' — dan peneliti naif memakai 30 September sebagai tanggal 'diketahui'. Padahal pasar baru tahu pada 15 November: 45 hari look-ahead, 45 hari trading berdasarkan masa depan. Disiplin point-in-time: setiap datum harus membawa TANGGAL PENGETAHUAN (kapan pasar bisa mengetahuinya), bukan tanggal periode. Ilustrasi biayanya: strategi yang sama — versi 'as-reported' (angka revisi final, tanggal periode): Sharpe 2,4; versi 'as-known' (point-in-time, tanggal pengumuman): Sharpe 1,1. Selisih 1,3 Sharpe itu murni bias look-ahead — strategi 2,4 tidak pernah ada di dunia nyata.",
        "Restatement memperparah: perusahaan merevisi laporan keuangannya berbulan-bulan kemudian, dan database menimpa angka lama dengan angka revisi. Backtest yang memakai 'angka final' = backtest yang memakai pengetahuan masa depan. Cara membaca definisi field seperti profesional — checklist lima hal: (1) units — dolar? lembar saham? persen? (2) frequency — harian? kuartalan? (3) coverage — sejarah mulai tahun berapa? (4) point-in-time flag — apakah tanggalnya tanggal pengumuman? (5) revision policy — as-first-reported atau as-revised? Field yang tidak menjawab kelimanya = field yang belum boleh dipakai untuk riset serius.",
        "Katalog jebakan look-ahead. Satu: fiscal-period dating (contoh di atas) — obatnya: lag manual 45–90 hari untuk fundamental, atau pakai field point-in-time bila tersedia. Dua: konstituen masa depan — backtest memakai daftar saham hari ini sehingga pecundang yang bangkrut tidak ikut diuji dan return menggelembung (survivorship bias). Tiga: corporate action tak-disesuaikan — stock split 2:1 tanpa penyesuaian terlihat sebagai 'crash −50%' dan memicu sinyal beli palsu; pastikan deret harga sudah adjusted. Empat: timestamp pengumuman — rilis after-hours tidak bisa ditradingkan hari itu juga; tanggal boleh benar tetapi jamnya salah = delay semu satu hari.",
        "Pola kombinasi field tingkat lanjut — tiga pola yang dipakai profesional. Pola rasio: sales/assets (efisiensi aset) — dua field fundamental lambat menjadi satu sinyal; tulis rank(sales / assets). Pola konfirmasi lintas family: 0.5 × rank(sales/assets) + 0.5 × rank(ts_corr(high, low, 60)) — fundamental (lambat) + price-volume (stabilitas intraday); dua family independen dalam satu baris, bobot sama. Pola pemicu: rank(ts_mean(volume, 20) / ts_mean(volume, 60) − 1) — lonjakan volume relatif (price-volume murni) sebagai konfirmasi waktu entry untuk sinyal lambat. Kaidah kombinasi: campurkan family yang INDEPENDEN (lambat + cepat), bukan yang berkorelasi — dua field price-volume yang mirip hanya menggandakan noise yang sama.",
        "Tentang keluarga keempat — sentimen. Di platform ini family snt_ mati total (pelajaran langkah 3), tetapi polanya layak dipahami: sentimen = mengukur perhatian dan emosi pasar dari teks. Kaidah profesionalnya sama dengan family lain: verifikasi hidup dulu (lima menit), jodohkan horizon (sentimen = cepat, harian–mingguan), dan waspadai revisi data (skor sentimen historis sering dihitung ulang dengan model baru = look-ahead terselubung). Bila suatu hari family-nya hidup di akunmu, perlakukan dengan protokol yang sama — tidak ada family yang istimewa.",
        "Rutinitas verifikasi profesional sebelum memakai field baru — lima menit yang diperluas. Satu: satu simulasi minimal rank(field). Dua: baca definisi — jawab lima checklist. Tiga: plot deret field untuk satu saham selama 5 tahun — cari lompatan tak wajar (tanda revisi atau split tak-disesuaikan). Empat: korelasikan dengan field sekeluarga yang sudah dikenal — bila 'sales' berkorelasi 0,99 dengan field 'sales_baru', itu duplikat, bukan informasi baru. Lima: catat di daftar hitam/putih tim — verifikasi yang tidak dicatat akan diulang enam bulan kemudian oleh orang lain.",
        "Vintage data: as-first-reported vs as-revised. Garis waktu: Q3 berakhir 30 Sep → diumumkan 15 Nov (angka pertama: laba $1,20) → direvisi 20 Mar (laba $1,34, +12%). Database point-in-time menyimpan KEDUANYA dengan stempel tanggal masing-masing. Aturan profesional: sinyal selalu memakai vintage PERTAMA (yang diketahui pasar saat itu); vintage revisi hanya untuk analisis diagnostik. Backtest yang memakai $1,34 seolah diketahui 15 Nov = membeli dengan pengetahuan bulan Maret — dan 'alpha'-nya adalah mesin waktu, bukan keahlian.",
        "Redundansi field dengan angka. Dua kandidat field value: book-to-market dan earnings-yield, korelasi 0,82 — menggabungkan keduanya hampir tidak menambah informasi (sudah 82% sama). Bandingkan: value + momentum, korelasi 0,05 — diversifikasi tulen. Protokol: matriks korelasi semua kandidat field SEBELUM kombinasi; buang bila |ρ| > 0,7 dengan field yang sudah dipakai, kecuali tesismu memang tentang nuansanya. Setiap field baru harus 'membayar sewa' berupa informasi independen — bila tidak, ia hanya menambah parameter dan ilusi kecanggihan.",
        "Jebakan coverage: field estimates mulai 2015, tetapi backtest-mu 2005–2025. Sepuluh tahun pertama = NaN sunyi — backtest 'berhasil' 20 tahun padahal separuhnya kosong, dan bias rezim (hanya menguji era modern) tidak terdeteksi. Pemeriksaan wajib: hitung proporsi non-null PER TAHUN untuk setiap field sebelum backtest panjang. Bila coverage < 80% di tahun-tahun awal, potong periode backtest atau akui batasnya — angka 20 tahun dari 10 tahun data adalah fiksi berlisensi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Field-nya hidup, backtest-nya jalan, Sharpe 2,4 — gas!” Tiga bulan kemudian: tanggalnya tanggal periode, bukan tanggal pengumuman. Sharpe point-in-time-nya 1,1. Field hidup ≠ field jujur — verifikasi tanggal pengetahuannya sebelum merayakan.",
      },
      hints: [
        "Tanggal pengetahuan > tanggal periode — lag 45–90 hari untuk fundamental bila ragu.",
        "Lima checklist definisi: units, frequency, coverage, point-in-time flag, revision policy.",
        "Kombinasikan family independen (lambat + cepat), bukan kembaran sekeluarga.",
      ],
      reference: "Jujur soal tanggal dulu, kombinasi cerdas kemudian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan tentang bahan baku alpha.",
      ],
      tasks: [],
      summary: [
        "Tiga keluarga hidup: price-volume (cepat), estimates (menengah), fundamental (lambat).",
        "Jodohkan horizon sinyal dengan kecepatan bahan.",
        "fam_/mdf_/snt_/scl12_ mati total — verifikasi 5 menit sebelum riset.",
        "ts_backfill menambal lubang data dalam jendela n hari; di luar itu tetap kosong.",
        "Gagal 100% konsisten sekeluarga = field mati, bukan bug settings.",
        "Point-in-time: tanggal pengetahuan (pengumuman), bukan tanggal periode — look-ahead fundamental bisa menggelembungkan Sharpe 1,3+.",
        "Kombinasikan family independen (lambat + cepat); verifikasi 5 checklist definisi sebelum memakai field baru.",
      ],
      quiz: [
        {
          q: "Sinyal reversal harian paling cocok memakai?",
          options: [
            { text: "Price-volume (close, volume, returns)", why: "Benar — cepat dan selalu tersedia.", correct: true },
            { text: "Fundamental kuartalan (sales/assets)", why: "Terlalu lambat untuk sinyal harian — basi sebelum lahir." },
            { text: "Field fam_ yang eksotis", why: "Mati total di platform — tidak bisa dipakai sama sekali." }
          ],
        },
        {
          q: "ts_backfill(x, 120) artinya?",
          options: [
            { text: "Isi lubang dengan nilai terakhir yang ada dalam 120 hari ke belakang", why: "Tepat.", correct: true },
            { text: "Hapus 120 hari data pertama", why: "Terbalik — ini menambal, bukan menghapus." },
            { text: "Mengarang data untuk 120 hari ke depan", why: "Tidak mengarang ke depan; hanya memakai yang sudah ada." }
          ],
        },
        {
          q: "12 simulasi memakai snt_ semua invalid. Kesimpulan?",
          options: [
            { text: "Family snt_ mati — hentikan, pindahkan logika ke field hidup", why: "Benar — pola gagal 100% konsisten.", correct: true },
            { text: "Coba 12 kombinasi settings lagi", why: "Settings tidak memengaruhi ketersediaan data." },
            { text: "Salah ketik — perbaiki ejaan fieldnya", why: "Kemungkinan kecil setelah 12x; verifikasi ejaan cukup sekali." }
          ],
        },
        {
          q: "Data: [10, None, None, None, 14], backfill n=2 (tanpa chaining). Indeks 3?",
          options: [
            { text: "Tetap None — lubang 3 hari melebihi jendela 2 hari", why: "Benar: dari indeks 3, jendela 2 hanya menjangkau indeks 1–2 (keduanya None).", correct: true },
            { text: "Terisi 10 — selalu terisi dari nilai pertama", why: "Salah: jendela membatasi seberapa jauh boleh melihat ke belakang." },
            { text: "Terisi 14 — diambil dari kanan", why: "Backfill hanya melihat ke BELAKANG (masa lalu), tidak ke depan." }
          ],
        },
        {
          q: "Langkah PERTAMA sebelum riset dengan field baru?",
          options: [
            { text: "Satu simulasi minimal hanya memakai field itu", why: "Benar — verifikasi 5 menit.", correct: true },
            { text: "Langsung bangun 10 alpha", why: "Risiko 10 alpha di atas tanah mati." },
            { text: "Baca semua dokumentasi field", why: "Dokumentasi tidak menjamin ketersediaan di akunmu." }
          ],
        },
        {
          q: "Strategi fundamental: versi tanggal-periode Sharpe 2,4; versi point-in-time Sharpe 1,1. Yang benar dipakai?",
          options: [
            { text: "1,1 — tanggal periode mengandung 45+ hari look-ahead", why: "Tepat — 2,4 tidak pernah ada di dunia nyata.", correct: true },
            { text: "2,4 — datanya sama, hanya tanggal beda", why: "Tanggal BEDA = informasi beda; masa depan bukan informasi." },
            { text: "Rata-ratanya, 1,75", why: "Bias tidak dirata-rata — ia dibuang." }
          ],
        },
        {
          q: "Kombinasi field yang paling sehat?",
          options: [
            { text: "0.5×rank(sales/assets) + 0.5×rank(ts_corr(high,low,60)) — fundamental + price-volume independen", why: "Benar — dua family independen, bukan noise ganda.", correct: true },
            { text: "rank(close) + rank(ts_mean(close,5)) — dua-duanya price", why: "Kembaran sekeluarga — menggandakan noise yang sama." },
            { text: "rank(snt_score) — sentimen paling modern", why: "snt_ mati di platform ini — modern tidak berarti hidup." }
          ],
        }
      ],
      reference: "Bahan dulu, resep kemudian. Verifikasi 5 menit menghemat 6 minggu.",
    },
  ],
};
