import type { V2Mission } from "../lib/types";

// ── MISI JARING MULE: Jejak Layering di Blockchain ──────────────────────
// Misi B (edge) — Fraud/AML. Dataset: BitcoinHeist (CC BY 4.0, 2.916.697
// alamat; slice tipologi layering 3.000 alamat, seed 42) + daftar sanksi OFAC
// XBT/ETH (public domain), pin baru 2026-10-15 13:34 WITA, commit 6ae2472c439b.
// File: public/misi/misi-jaring-mule/dompet.csv (bersih) +
// dompet_audit.csv (4 injeksi terdokumentasi) + ofac_pinned.csv. Metode: METODE.md.
// BEDA dari pilot misi-jejak-dana-blockchain (atribusi ransomware + join OFAC):
// misi ini murni sudut AML — tipologi layering, smurfing/structuring, jaringan
// mule — berbasis fitur agregat per alamat (tanpa edge list / graph).

const BASE = "/misi/misi-jaring-mule";

export const misiJaringMule: V2Mission = {
  slug: "misi-jaring-mule",
  track: "Fraud/AML",
  module: "Misi",
  title: "Jaring Mule: Jejak Layering di Blockchain",
  estMinutes: 160,
  role: "AML Analyst (analis anti pencucian uang) di bursa kripto",
  client:
    "Head of Compliance — FIU meminta penjelasan atas 3 klaster dompet mencurigakan; kamu harus menentukan: laporkan sebagai STR/SAR, pantau lanjutan, atau tutup sebagai false positive — dengan bukti tipologi",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tiga klaster, satu surat dari FIU",
      prose: [],
      tasks: [],
      briefing: {
        role: "AML Analyst (analis anti pencucian uang) di bursa kripto",
        client:
          "Head of Compliance. Unit intelijen keuangan (FIU) mengirim permintaan penjelasan resmi: sistem transaction monitoring bursa menandai 3 klaster dompet dengan pola yang konsisten dengan tipologi layering — tahap tengah pencucian uang di mana dana dipecah, diputar lewat banyak alamat, lalu digabung kembali untuk mengaburkan asal-usulnya. Kamu harus menentukan nasib tiap klaster: laporkan sebagai STR/SAR (Suspicious Transaction Report), masukkan enhanced monitoring, atau tutup sebagai false positive — masing-masing dengan bukti tipologi yang bisa dipertahankan di depan regulator.",
        story: [
          "Selasa, 10:15. Head of Compliance meneruskan surat FIU ke mejamu — tiga klaster dompet, 3.000 alamat, semuanya lolos screening sanksi (tidak ada yang cocok daftar OFAC) dan hampir semuanya berlabel “white” di data riset. “Inilah yang membuat saya tidak bisa tidur,” katanya. “Klaster pertama memutar dana lewat ribuan putaran split-merge — persis seperti peel chain di buku teks layering. Klaster kedua punya ribuan lawan transaksi — fan-out seperti jaringan mule. Klaster ketiga bergerak dalam pecahan-pecahan kecil tapi bervolume — bau smurfing. Tapi...” Ia berhenti. “Tapi pola yang sama persis juga dihasilkan oleh payout afiliasi, payroll kripto, dan hot wallet exchange. Kalau kita file STR untuk semuanya, kita membekukan bisnis yang sah. Kalau kita tutup semuanya, dan satu klaster ternyata jaringan mule sungguhan — FIU akan bertanya kenapa analisnya buta.”",
          "Kamu memahami dilemanya lebih dalam dari kebanyakan orang. Layering pada dasarnya adalah TEKNIK, bukan vonis — memecah dan menggabung dana adalah hal yang dilakukan setiap exchange setiap hari. Smurfing adalah soal NIAT (menghindari ambang pelaporan), bukan soal nominal kecil — payroll kripto yang sah juga dibayar dalam pecahan kecil. Dan “mule” adalah soal PERAN dalam jaringan kriminal, bukan soal jumlah tetangga — hot wallet exchange punya tetangga terbanyak di seluruh blockchain. Tugasmu bukan menemukan pola — polanya sudah ditemukan sistem. Tugasmu adalah menimbang: kapan pola menjadi bukti yang cukup untuk bertindak?",
          "Senjatamu: dataset BitcoinHeist — 2,9 juta alamat Bitcoin dengan fitur agregat per alamat (looped: berapa kali dana dipecah lalu digabung kembali; neighbors: jumlah lawan transaksi; income; count) — di-slice menjadi 3.000 alamat yang PALING menonjol secara tipologi: 1.000 putaran tertinggi, 1.000 tetangga terbanyak, 1.000 pecahan-kecil-bervolume. Ditambah satu kejujuran yang wajib kamu pegang sejak awal: dataset ini TIDAK punya edge list — kamu tidak bisa menelusuri hop per hop. Kamu bekerja seperti analis tipologi sungguhan: membaca bentuk dari agregat, lalu memutuskan dengan segala keterbatasannya. Seseorang juga telah menyabotase salinan auditnya. Temukan sabotase itu — karena analis yang tidak bisa membedakan data kotor dari temuan sah tidak layak menandatangani STR.",
        ],
        objectives: [
          "Mengukur fitur tipologi (looped, neighbors, income, count) pada 3 klaster dan menguji dua hipotesis: “mule = banyak tetangga + uang kecil” dan “smurfing = pecahan kecil + volume tinggi” — dengan angka, bukan firasat.",
          "Melakukan join dompet vs daftar sanksi OFAC (pin baru 2026-10-15) dan menilai apa arti “tidak ada yang cocok” bagi keputusanmu.",
          "Menulis memo STR untuk Head of Compliance: rekomendasi LAPORKAN / PANTAU / TUTUP per klaster, lengkap dengan bukti tipologi, keputusan yang tidak diambil, dan batas-batas datanya.",
        ],
        prereqSummary:
          "Placement–layering–integration: tiga tahap pencucian uang — menempatkan dana kotor ke sistem (placement), mengaburkan jejaknya lewat transaksi berlapis (layering), lalu memakainya seolah sah (integration). Smurfing/structuring: memecah transaksi menjadi nominal kecil untuk menghindari ambang pelaporan — kuncinya adalah NIAT menghindari, bukan nominalnya. STR/SAR (Suspicious Transaction Report): laporan transaksi mencurigakan ke FIU — bukan vonis bersalah, melainkan eskalasi resmi agar FIU bisa menyelidiki; analis yang menandatanganinya bertanggung jawab atas kualitas buktinya.",
        datasetNote:
          "Sumber primer: BitcoinHeist Ransomware Address Dataset (UCI ML Repository), lisensi CC BY 4.0 — atribusi: “UCI ML Repository”. Diunduh 2026-10-15; badge lisensi terverifikasi di halaman dataset pada tanggal yang sama.\nSlice (BERBEDA dari pilot misi-jejak-dana-blockchain yang fokus atribusi ransomware): 3.000 alamat fokus TIPOLOGI LAYERING — (a) 1.000 looped tertinggi, (b) 1.000 neighbors tertinggi, (c) 1.000 acak dari pool income < P25 & count > P75 populasi (193.483 alamat unik), seed 42. Nilai fitur asli tidak diubah.\nOrakel: daftar sanksi OFAC via tool 0xB10C (data OFAC = public domain AS), PIN BARU 2026-10-15 13:34 WITA, cabang lists commit 6ae2472c439b (berbeda dari pin pilot): 532 alamat XBT + 120 ETH. Hasil join: 0 cocok di slice ini — dan itu FAKTA yang harus kamu tafsirkan, bukan kegagalan.\nKejujuran: BitcoinHeist TIDAK memuat edge list/graph transaksi — misi ini analisis TIPOLOGI berbasis fitur agregat per alamat, BUKAN literal hop-tracing. Label “white” artinya “tidak teridentifikasi sebagai ransomware oleh peneliti” — BUKAN “terbukti bersih”. File dompet_audit.csv SENGAJA dikotori (4 injeksi terdokumentasi di METODE.md — jangan dibaca dulu).",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali tiga klaster sebelum menyentuh angka",
      prose: [
        "`dompet.csv` — 3.000 baris, satu baris = satu dompet unik. Kolom: `address` (alamat Bitcoin penuh — dibutuhkan untuk join sanksi), `year`, `day` (hari ke-n dalam tahun), `length` (estimasi mixing rounds menurut dokumentasi dataset), `weight` (derajat merge: makin besar, makin banyak input digabung ke sedikit output), `count` (jumlah transaksi dalam pola merge), `looped` (jumlah transaksi yang memecah dana, memutarnya lewat jalur berbeda, lalu menggabungkannya kembali — fitur yang PALING dekat dengan definisi layering), `neighbors` (jumlah alamat lawan transaksi — fan-out/fan-in), `income_satoshi` (total pemasukan dalam satoshi; 1 BTC = 100.000.000 satoshi), `label` (nama keluarga ransomware menurut riset, atau `white`), `klaster` (asal grup seleksi: `putaran_tinggi`, `tetangga_ekstrem`, `pecahan_kecil`), `is_sanctioned` (hasil join vs OFAC XBT: 1 = cocok).",
        "`dompet_audit.csv` — salinan yang dikirim unit pelapor, 3.002 baris (ada baris tambahan!) plus kolom `catatan_audit`. Seseorang menyuntikkan 4 sabotase tanpa pengumuman: label yang disanitasi, angka income yang dirusak, alamat duplikat, dan klaim satu-fitur yang menyesatkan. Detailnya ada di `METODE.md` — membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
        "`ofac_pinned.csv` — daftar sanksi yang di-pin baru: 532 alamat XBT + 120 alamat ETH, kolom `address, aset, tanggal_pin` (2026-10-15 13:34 WITA, commit 6ae2472c439b). Alamat dataset adalah BTC, sehingga hanya XBT yang bisa cocok — daftar ETH dibundel sebagai referensi lintas-rantai (jaringan mule sungguhan jarang satu-rantai).",
        "Aturan main data room: (1) baseline dan hipotesis HANYA dari file bersih; (2) kecurigaan HANYA dari file audit; (3) setiap klaim tipologi wajib punya angka — “kelihatannya seperti layering” bukan bukti.",
      ],
      tasks: [
        { id: "t1", text: "Buka `dompet.csv`: catat jumlah baris dan sebaran `klaster` (harusnya 1.000 + 1.000 + 1.000)" },
        { id: "t2", text: "Buka `ofac_pinned.csv`: berapa alamat XBT yang di-sanksi, dan kapan tanggal pin-nya" },
      ],
      note: {
        title: "Miskonsepsi #1: neighbors tinggi = pasti money mule",
        type: "pitfall",
        body: "Logikanya terdengar masuk akal: mule berhubungan dengan banyak orang, jadi dompet dengan ribuan tetangga pasti sarang mule. Kenyataannya: dompet dengan tetangga TERBANYAK di blockchain adalah hot wallet exchange — satu alamat penampungan setoran ribuan nasabah. Tetangga banyak mengukur POPULARITAS, bukan kriminalitas. Di misi ini kamu akan menguji sendiri: berapa persen dompet “tetangga ekstrem” yang berlabel non-white? Siap-siap terkejut.",
      },
      reference:
        "dompet.csv (bersih, 3.000 baris, 12 kolom) vs dompet_audit.csv (3.002 baris + catatan_audit, 4 sabotase). ofac_pinned.csv (652 alamat, pin 2026-10-15 13:34 WITA).",
    },
    {
      id: "lab-eda",
      eyebrow: "Langkah 3 · Lab 1 — Skor tipologi yang menemukan nol mule",
      title: "Heuristik “mule” andalanmu — diuji data, bukan dipercaya",
      prose: [
        "Setiap analis AML punya heuristik andalan. Salah satu yang paling populer: money mule = banyak lawan transaksi (neighbors tinggi) TAPI uangnya kecil-kecil (income rendah) — karena mule adalah kurir, bukan bandar. Kedengarannya tajam. Lab ini mengujinya langsung pada 3.000 dompet: hitung median dan P95 `looped`, korelasi `neighbors` vs `income_satoshi`, lalu terapkan skornya — kandidat mule = neighbors di atas P95 DAN income di bawah median.",
        "Peringatan jujur sebelum kamu menjalankan kode: kalau skormu menghasilkan NOL kandidat, itu bukan bug di kodemu. Itu temuan. Dan temuan “heuristik andalanku tidak menemukan apa-apa di data nyata” adalah salah satu pelajaran termahal — sekaligus termurah — dalam karier analis.",
        "Lab ini memakai file bersih (`dompet.csv`), dimuat dengan `open_url` — path relatif ke situs ini, tanpa token.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; hitung `n_baris` dan `n_nonwhite` (baris dengan label != white)" },
        { id: "t2", text: "Hitung `med_looped` (median) dan `p95_looped` (persentil 95) dari kolom `looped`" },
        { id: "t3", text: "Hitung `corr_ni` = korelasi log1p(neighbors) vs log1p(income_satoshi); terapkan skor mule (neighbors > P95 neighbors DAN income < median income) -> `n_kandidat`; print semuanya" },
      ],
      expected:
        "n_baris=3000, n_nonwhite=11, med_looped=2170.0, p95_looped=13449.25, corr_ni=0.913, n_kandidat=0 — NOL kandidat. Itu temuannya, bukan bug.",
      note: {
        title: "Miskonsepsi #2: pola transaksi = bukti kejahatan",
        type: "pitfall",
        body: "Dari 3.000 dompet yang DIPILIH karena polanya paling “mencurigakan”, hanya 11 (0,37%) berlabel non-white — bahkan LEBIH RENDAH dari rata-rata populasi (1,42%). Klaster putaran-tertinggi? 998 dari 1.000 berlabel white. Bentuk transaksi (shape) bukanlah siapa pelakunya. Heuristik “banyak tetangga + uang kecil” menemukan NOL kandidat karena di data nyata, tetangga banyak selalu berpasangan dengan uang besar (korelasi 0,913) — pola exchange, bukan pola mule. Pelajarannya: tipologi mendeteksi BENTUK, bukan KESALAHAN. Bentuk yang sama dipakai penjahat dan bisnis sah — yang membedakan adalah konteks (KYC, sanksi, intel kasus), bukan angkanya.",
      },
      hints: [
        "Muat: `pd.read_csv(open_url(\"/misi/misi-jaring-mule/dompet.csv\"))` — butuh `from pyodide.http import open_url` dan `import numpy as np`.",
        "P95: `df[\"looped\"].quantile(0.95)`. Korelasi log: `np.log1p(df[\"neighbors\"]).corr(np.log1p(df[\"income_satoshi\"]))` — log1p dipakai karena sebarannya sangat menceng (skewed).",
        "Skor mule: `(df[\"neighbors\"] > df[\"neighbors\"].quantile(0.95)) & (df[\"income_satoshi\"] < df[\"income_satoshi\"].median())` — hitung `.sum()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jaring-mule/dompet.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "n_baris = ...",
          "n_nonwhite = ...            # label != \"white\"",
          "",
          "med_looped = ...",
          "p95_looped = ...",
          "",
          "p95_neigh = df[\"neighbors\"].quantile(0.95)",
          "med_income = df[\"income_satoshi\"].median()",
          "corr_ni = ...               # korelasi log1p(neighbors) vs log1p(income_satoshi)",
          "n_kandidat = ...            # neighbors > p95_neigh DAN income_satoshi < med_income",
          "",
          "print(\"baris:\", n_baris, \"| non-white:\", n_nonwhite)",
          "print(\"median looped:\", med_looped, \"| P95 looped:\", p95_looped)",
          "print(\"korelasi log neighbors-income:\", round(corr_ni, 3))",
          "print(\"kandidat mule:\", n_kandidat)",
        ].join("\n"),
        lockLines: 6,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jaring-mule/dompet.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "n_baris = len(df)",
          "n_nonwhite = int((df[\"label\"] != \"white\").sum())",
          "",
          "med_looped = float(df[\"looped\"].median())",
          "p95_looped = float(df[\"looped\"].quantile(0.95))",
          "",
          "p95_neigh = df[\"neighbors\"].quantile(0.95)",
          "med_income = df[\"income_satoshi\"].median()",
          "corr_ni = float(np.log1p(df[\"neighbors\"]).corr(np.log1p(df[\"income_satoshi\"])))",
          "n_kandidat = int(((df[\"neighbors\"] > p95_neigh) & (df[\"income_satoshi\"] < med_income)).sum())",
          "",
          "print(\"baris:\", n_baris, \"| non-white:\", n_nonwhite)",
          "print(\"median looped:\", med_looped, \"| P95 looped:\", p95_looped)",
          "print(\"korelasi log neighbors-income:\", round(corr_ni, 3))",
          "print(\"kandidat mule:\", n_kandidat)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus DataFrame dari dompet.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 3000", name: "n_baris", value: 3000, msg: "File bersih punya tepat 3.000 baris (1.000 × 3 klaster)." },
          { kind: "equal", task: "t1", label: "`n_nonwhite` = 11", name: "n_nonwhite", value: 11, msg: "Hanya 11 dari 3.000 berlabel non-white — 0,37%, di bawah rata-rata populasi 1,42%." },
          { kind: "equal", task: "t2", label: "`med_looped` = 2170.0", name: "med_looped", value: 2170.0, tol: 1, msg: "Median looped pada slice ini (slice memang dipilih dari yang tertinggi)." },
          { kind: "equal", task: "t2", label: "`p95_looped` ≈ 13449", name: "p95_looped", value: 13449.25, tol: 1, msg: "Persentil 95 looped — 5% dompet memutar dana lebih dari ~13 ribu kali." },
          { kind: "equal", task: "t3", label: "`corr_ni` ≈ 0.913", name: "corr_ni", value: 0.913, tol: 0.01, msg: "Korelasi log1p(neighbors) vs log1p(income_satoshi): sangat positif — tetangga banyak = uang besar." },
          { kind: "equal", task: "t3", label: "`n_kandidat` = 0", name: "n_kandidat", value: 0, msg: "NOL kandidat — bukan bug. Heuristik “banyak tetangga + uang kecil” tidak menemukan apa pun karena korelasinya justru positif kuat." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Join kebenaran",
      title: "Tiga klaster lolos sanksi — buktikan dengan JOIN",
      prose: [
        "Di slice 3.000 dompet, join vs OFAC menghasilkan NOL kecocokan. Klaim “tidak ada yang tersanksi” harus bisa dibuktikan ulang kapan pun — dan di dunia nyata, screening sanksi berjalan OTOMATIS di setiap setoran masuk, bukan sebagai proyek triwulanan. Lab ini melatih mekaniknya dalam skala kecil: 12 dompet (termasuk satu berlabel ransomware yang TIDAK tersanksi — label riset bukan daftar sanksi) dan 4 entri sanksi.",
        "Tugasmu: JOIN `dompet` vs `sanksi`, tampilkan yang cocok beserta tipologinya (`neighbors`, `looped`), urutkan dari neighbors tertinggi. Tepat 3 baris yang harus kembali — kalau lebih atau kurang, query-mu salah.",
      ],
      tasks: [
        { id: "t1", text: "JOIN dompet vs sanksi; tampilkan address, label, neighbors, looped yang cocok, urut neighbors menurun" },
      ],
      expected: "3 kecocokan: 1JaringMule02… (neighbors 2310), 3LapisanDana02… (neighbors 410), 1SmurfKecil02… (neighbors 3)",
      sqlLab: {
        task: "Tampilkan address, label, neighbors, dan looped dari dompet yang address-nya muncul di tabel sanksi. Urutkan dari neighbors tertinggi.",
        schema: [
          "CREATE TABLE dompet (address TEXT, label TEXT, neighbors INTEGER, looped INTEGER, income_satoshi INTEGER);",
          "CREATE TABLE sanksi (address TEXT, aset TEXT);",
        ].join("\n"),
        seedData: [
          "INSERT INTO dompet VALUES",
          "('1JaringMule01xK7pL2mQ9wE4rT6yU3iO5pA', 'white', 842, 120, 45000000),",
          "('1JaringMule02xK7pL2mQ9wE4rT6yU3iO5pB', 'white', 2310, 45, 120000000),",
          "('1JaringMule03xK7pL2mQ9wE4rT6yU3iO5pC', 'princetonLocky', 12, 11980, 380000000),",
          "('3LapisanDana01aB2cD3eF4gH5jK6mN8pQ0rS', 'white', 96, 30, 28000000),",
          "('3LapisanDana02aB2cD3eF4gH5jK6mN8pQ0tT', 'white', 410, 980, 95000000),",
          "('3LapisanDana03aB2cD3eF4gH5jK6mN8pQ0uU', 'white', 55, 14100, 210000000),",
          "('1SmurfKecil01zX2cV3bN4mL5kJ6hG7fD8sA9', 'white', 2, 0, 32000000),",
          "('1SmurfKecil02zX2cV3bN4mL5kJ6hG7fD8sB0', 'white', 3, 5, 41000000),",
          "('1BersihWalet01qW2eR3tY4uI5oP6aS7dF8gH', 'white', 8, 12, 500000000),",
          "('1BersihWalet02qW2eR3tY4uI5oP6aS7dF8gJ', 'white', 15, 3, 1200000000),",
          "('1BersihWalet03qW2eR3tY4uI5oP6aS7dF8gK', 'white', 6, 40, 80000000),",
          "('1BersihWalet04qW2eR3tY4uI5oP6aS7dF8gL', 'white', 22, 8, 300000000);",
          "INSERT INTO sanksi VALUES",
          "('1JaringMule02xK7pL2mQ9wE4rT6yU3iO5pB', 'XBT'),",
          "('3LapisanDana02aB2cD3eF4gH5jK6mN8pQ0tT', 'XBT'),",
          "('1SmurfKecil02zX2cV3bN4mL5kJ6hG7fD8sB0', 'XBT'),",
          "('1TidakTerdaftar9999xXxXxXxXxXxXxXx9999', 'XBT');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT address, label, neighbors, looped\nFROM dompet\n",
        solution: [
          "SELECT d.address, d.label, d.neighbors, d.looped",
          "FROM dompet d JOIN sanksi s ON d.address = s.address",
          "ORDER BY d.neighbors DESC;",
        ].join("\n"),
        expectedColumns: ["address", "label", "neighbors", "looped"],
        expectedRows: [
          ["1JaringMule02xK7pL2mQ9wE4rT6yU3iO5pB", "white", 2310, 45],
          ["3LapisanDana02aB2cD3eF4gH5jK6mN8pQ0tT", "white", 410, 980],
          ["1SmurfKecil02zX2cV3bN4mL5kJ6hG7fD8sB0", "white", 3, 5],
        ],
        orderMatters: true,
      },
    },
    {
      id: "lab-tipologi",
      eyebrow: "Langkah 5 · Lab 3 — Uji hipotesis smurfing",
      title: "“Pecahan kecil bervolume” — benarkah itu structuring?",
      prose: [
        "Klaster ketiga dipilih karena pola yang “berbau” structuring: income kecil tapi count tinggi — pecahan-pecahan kecil dalam volume besar, seperti seseorang memecah setoran agar tidak mencolok. Hipotesisnya: pola count-tinggi-terkonsentrasi-di-income-kecil adalah sidik jari smurfing. Lab ini mengujinya dengan jujur: bagi income menjadi tiga bucket (kecil: di bawah P25; tengah; besar: di atas median), lalu hitung di tiap bucket — berapa persen alamat yang count-nya di atas P90?",
        "Kalau hipotesis benar, bucket “kecil” harusnya juara. Kalau hasilnya terbalik — baca baik-baik apa kata datanya, karena di situlah bedanya analis yang mengikuti bukti dengan analis yang mengikuti firasat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p90_count` (persentil 90 kolom `count`) dari `df`" },
        { id: "t2", text: "Bagi income jadi 3 bucket: kecil (< P25), tengah, besar (>= median); hitung `prop_kecil`, `prop_tengah`, `prop_besar` = persen alamat per bucket dengan count > p90_count" },
        { id: "t3", text: "Tentukan `bucket_tertinggi` (string: \"kecil\", \"tengah\", atau \"besar\"); print semuanya" },
      ],
      expected:
        "p90_count=12523.0 | prop_kecil=4.1%, prop_tengah=10.8%, prop_besar=12.2% — TERBALIK dari hipotesis: volume tinggi justru mengikuti income besar.",
      hints: [
        "Bucket: `kecil = df[df[\"income_satoshi\"] < df[\"income_satoshi\"].quantile(0.25)]`, `besar = df[df[\"income_satoshi\"] >= df[\"income_satoshi\"].median()]`, tengah = sisanya.",
        "Proporsi: `(b[b[\"count\"] > p90_count].shape[0] / b.shape[0] * 100)` lalu `round(..., 1)`.",
        "Jangan kaget kalau hasilnya “terbalik” — itu memang temuannya. Tulis apa adanya.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jaring-mule/dompet.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "p90_count = ...",
          "",
          "q25 = df[\"income_satoshi\"].quantile(0.25)",
          "med = df[\"income_satoshi\"].median()",
          "kecil = ...    # income_satoshi < q25",
          "tengah = ...   # q25 <= income_satoshi < med",
          "besar = ...    # income_satoshi >= med",
          "",
          "def prop(b):",
          "    return round((b[\"count\"] > p90_count).mean() * 100, 1)",
          "",
          "prop_kecil = ...",
          "prop_tengah = ...",
          "prop_besar = ...",
          "bucket_tertinggi = ...   # string: \"kecil\" / \"tengah\" / \"besar\"",
          "",
          "print(\"P90 count:\", p90_count)",
          "print(\"proporsi count>P90 -> kecil:\", prop_kecil, \"% | tengah:\", prop_tengah, \"% | besar:\", prop_besar, \"%\")",
          "print(\"bucket tertinggi:\", bucket_tertinggi)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-jaring-mule/dompet.csv\"",
          "df = pd.read_csv(open_url(URL))",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "p90_count = float(df[\"count\"].quantile(0.90))",
          "",
          "q25 = df[\"income_satoshi\"].quantile(0.25)",
          "med = df[\"income_satoshi\"].median()",
          "kecil = df[df[\"income_satoshi\"] < q25]",
          "tengah = df[(df[\"income_satoshi\"] >= q25) & (df[\"income_satoshi\"] < med)]",
          "besar = df[df[\"income_satoshi\"] >= med]",
          "",
          "def prop(b):",
          "    return round((b[\"count\"] > p90_count).mean() * 100, 1)",
          "",
          "prop_kecil = prop(kecil)",
          "prop_tengah = prop(tengah)",
          "prop_besar = prop(besar)",
          "props = {\"kecil\": prop_kecil, \"tengah\": prop_tengah, \"besar\": prop_besar}",
          "bucket_tertinggi = max(props, key=props.get)",
          "",
          "print(\"P90 count:\", p90_count)",
          "print(\"proporsi count>P90 -> kecil:\", prop_kecil, \"% | tengah:\", prop_tengah, \"% | besar:\", prop_besar, \"%\")",
          "print(\"bucket tertinggi:\", bucket_tertinggi)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus DataFrame dari dompet.csv." },
          { kind: "equal", task: "t1", label: "`p90_count` = 12523.0", name: "p90_count", value: 12523.0, tol: 1, msg: "Persentil 90 kolom count pada slice ini." },
          { kind: "equal", task: "t2", label: "`prop_kecil` = 4.1", name: "prop_kecil", value: 4.1, tol: 0.15, msg: "Persen alamat income-kecil dengan count > P90." },
          { kind: "equal", task: "t2", label: "`prop_tengah` = 10.8", name: "prop_tengah", value: 10.8, tol: 0.15, msg: "Persen alamat income-tengah dengan count > P90." },
          { kind: "equal", task: "t2", label: "`prop_besar` = 12.2", name: "prop_besar", value: 12.2, tol: 0.15, msg: "Persen alamat income-besar dengan count > P90 — TERTINGGI, kebalikan hipotesis." },
          { kind: "equal", task: "t3", label: "`bucket_tertinggi` = \"besar\"", name: "bucket_tertinggi", value: "besar", msg: "Bucket dengan proporsi count>P90 tertinggi adalah “besar” — volume tinggi mengikuti uang besar." },
        ],
      },
    },
  ],
};

export default misiJaringMule;

// ── lanjutan misiJaringMule: keputusan + cabang + audit + deliverable ───
import type { V2Step } from "../lib/types";

const LANJUTAN_MULE: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "STR, pantau, atau tutup? FIU menunggu jawabanmu",
    prose: [
      "Bukti terkumpul — dan inilah yang membuat misi ini “edge”: tidak ada kecocokan sanksi OFAC, hanya 11 dari 3.000 dompet berlabel non-white, heuristik mule-mu menemukan NOL kandidat, dan hipotesis smurfing-mu terbalik oleh data. Yang tersisa hanyalah BENTUK: 3.000 dompet dengan pola transaksi paling ekstrem di antara 2,9 juta alamat — bentuk yang konsisten dengan layering, dan konsisten juga dengan bisnis kripto yang sah.",
      "Head of Compliance butuh keputusanmu SEKARANG, satu per klaster — tapi aturannya satu paket: pilihanmu menentukan bukti apa yang terbuka di langkah berikut. Tidak ada opsi yang aman. Ada opsi yang jujur tentang ketidaktahuannya, dan ada yang tidak.",
    ],
    tasks: [],
    decision: {
      prompt: "Rekomendasimu untuk 3 klaster dompet? (Keputusan final — seperti memo yang sudah dikirim ke Head of Compliance.)",
      options: [
        {
          id: "opt-str",
          label: "FILE STR + BEKUKAN: laporkan 3 klaster ke FIU, bekukan sementara",
          rationale: "Bentuknya terlalu konsisten dengan tipologi layering untuk diabaikan. Kalau satu klaster ternyata jaringan mule dan kita tidak bertindak, FIU akan bertanya kenapa analisnya diam.",
          nextStepId: "temuan-str",
          consequenceNote: "Dua klaster ternyata payout afiliasi dan hot wallet exchange dengan KYC lengkap — false positive yang mahal dan memalukan. Satu klaster memang bermasalah, tapi pembekuan prematur tanpa bukti kuat membuat posisi hukummu lemah di banding administratif.",
        },
        {
          id: "opt-monitoring",
          label: "ENHANCED MONITORING 30 hari: kumpulkan bukti sebelum bertindak",
          rationale: "Bentuk saja tidak cukup untuk STR yang kuat. Awasi ketat, kumpulkan konteks KYC dan pola lanjutan, lalu putuskan dengan bukti — bukan dengan firasat.",
          nextStepId: "temuan-monitoring",
          consequenceNote: "Satu klaster menguat menjadi STR yang tak terbantahkan; satu klaster terkonfirmasi false positive dan ditutup rapi; satu klaster keburu memindahkan dana sebelum bukti cukup. Monitoring membeli informasi — dengan harga.",
        },
        {
          id: "opt-tutup",
          label: "TUTUP sebagai false positive, dengan rasional tertulis",
          rationale: "Nol kecocokan sanksi, label nyaris semua white, heuristik tidak menemukan apa-apa. Bukti tidak cukup untuk STR — analis yang baik tidak menuduh tanpa bukti.",
          nextStepId: "temuan-tutup",
          consequenceNote: "Empat bulan kemudian, satu alamat klaster pecahan_kecil muncul dalam kasus mule regional. Temuan audit intern: “penutupan prematur — analis memperlakukan ketiadaan bukti sebagai bukti ketiadaan.” Rasionalmu yang rapi justru menjadi barang bukti kelalaianmu.",
        },
      ],
    },
  },
  {
    id: "temuan-str",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Kamu memfilekan STR dan membekukan ketiganya",
    prose: [
      "STR dikirim, tiga klaster dibekukan hari itu juga. Dua minggu kemudian hasilnya masuk — dan rasanya seperti disiram air dingin. Klaster `tetangga_ekstrem`: hot wallet sebuah exchange teregulasi, KYC lengkap, penjelasan tertulis rapi — mereka bahkan berterima kasih atas “ketelitianmu” dengan nada yang tidak bisa disalahartikan. Klaster `putaran_tinggi`: payout afiliasi program besar yang memang dirancang berputar. Dua false positive, dua nasabah institusional yang pindah ke kompetitor, satu tim legal yang lembur menangani banding administratif — yang kamu KALAHI, karena pembekuanmu berdiri di atas “bentuk yang mencurigakan”, bukan bukti.",
      "Satu kabar baik: klaster `pecahan_kecil` memang menunjukkan koordinasi lanjutan dan FIU membuka penyelidikan. Tapi kemenangan itu tidak menutupi pelajaran mahalnya: ketegasan tanpa presisi adalah bentuk lain dari kecerobohan. Regulator menghargai keberanian melapor — tapi nasabah dan pengadilan menghargai bukti.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "STR yang baik menuduh dengan PRESISI: klaster mana, indikator apa, ambang apa. “Laporkan semuanya, biar FIU yang memilah” bukan strategi — itu melempar tanggung jawab analis ke regulator. Tulis di memomu: bukti apa yang SEHARUSNYA kamu kumpulkan dulu sebelum menekan tombol STR.",
    },
  },
  {
    id: "temuan-monitoring",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Kamu mengawasi — dan data mulai bicara",
    prose: [
      "Tiga puluh hari enhanced monitoring. Hasilnya adalah potret jujur dari profesi ini — tidak menang penuh, tidak kalah penuh. Klaster `pecahan_kecil`: pola koordinasi waktu antar-dompet menguat, dan permintaan KYC lanjutan mengembalikan identitas yang tidak konsisten — STR kedua yang kamu filekan jauh lebih kuat dari STR pertama yang tidak pernah kamu kirim; FIU menilainya “laporan yang matang”. Klaster `tetangga_ekstrem`: terkonfirmasi hot wallet exchange — ditutup sebagai false positive dengan dokumentasi rapi, tanpa drama, tanpa nasabah yang kabur.",
      "Tapi ada harga yang kamu bayar: klaster `putaran_tinggi` memindahkan sebagian besar dananya ke rantai lain pada hari ke-22 — sebelum bukti kontekstualmu cukup untuk bertindak. Mungkin itu hanya rebalancing operasional yang sah. Mungkin juga bukan. Kamu tidak akan pernah tahu — dan ketidak-tahuan itulah harga monitoring.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Monitoring tanpa ambang eskalasi yang eksplisit hanyalah menunda keputusan. Tulis di memomu: sinyal APA yang dalam 30 hari akan mengubah “pantau” menjadi “STR”, dan sinyal apa yang mengubahnya menjadi “tutup”. Tanpa itu, monitoring = keputusan yang tidak berani mengaku sebagai keputusan.",
    },
  },
  {
    id: "temuan-tutup",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Kamu menutupnya — dengan rasional yang rapi",
    prose: [
      "Rasional tertulismu memang rapi: nol kecocokan sanksi, 99,6% label white, heuristik mule menemukan nol kandidat, hipotesis smurfing terbalik oleh data. Tiga klaster ditutup sebagai false positive. Empat bulan yang tenang.",
      "Lalu email dari tim investigasi: satu alamat dari klaster `pecahan_kecil` muncul dalam berkas kasus jaringan mule regional yang ditangani FIU. Bukan vonis bahwa seluruh klaster kriminal — tapi cukup untuk satu pertanyaan yang tidak bisa kamu jawab dengan rasional rapi: “Analis punya pola yang belum dijelaskan — kenapa tidak dipantau saja dulu?” Temuan audit intern lebih pedas: “Analis memperlakukan ketiadaan bukti sebagai bukti ketiadaan. Label ‘white’ dibaca sebagai vonis bersih — padahal artinya hanya ‘tidak teridentifikasi sebagai ransomware oleh peneliti’.”",
      "Pelajaran termahal misi ini: standar untuk MENUTUP kasus sama tingginya dengan standar untuk MEMBUKA STR. Keduanya butuh bukti afirmatif. “Tidak cukup bukti untuk menuduh” bukanlah “cukup bukti untuk membebaskan”.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Penutupan yang benar berbunyi: “ditutup KARENA [bukti tandingan], DENGAN risiko sisa [X], dan akan dibuka kembali JIKA [pemicu].” Tulis format itu di memomu — untuk ketiga klaster, apa pun keputusan akhirmu.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 19 dompet: temukan 4 sabotase",
    prose: [
      "Misi audit. Di bawah ini 19 dompet — dossier yang diklaim “semua terverifikasi, tidak ada temuan”. Empat sabotase disuntikkan tanpa pengumuman. Tapi ingat pelajaran Lab 1 dan Lab 3: dossier ini juga memuat dompet berlabel riset ransomware dan pola yang “mencurigakan tapi sah” — itu BUKAN sabotase, itu temuan audit yang legitimate dan bagian dari pekerjaanmu menilainya.",
      "Senjatamu: (1) bandingkan dengan file BERSIH — label dan income apa yang berubah? (2) cek alamat ganda — satu dompet, dua riwayat? (3) curigai klaim satu-fitur — premis benar tidak menjamin penalaran benar. Tandai yang janggal, lalu buka debrief.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-jaring-mule-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier unit pelapor mengklaim 19 dompet berikut “terverifikasi — tidak ada temuan” (cuplikan dompet_audit.csv; Pemasukan dalam satoshi).",
      columns: ["Dompet", "Tetangga", "Putaran", "Pemasukan"],
      rows: [
        { rowId: 1, cells: { "Dompet": "16xx…45ug7", "Tetangga": "2", "Putaran": "0", "Pemasukan": "37.500.000" }, claims: [{ label: "Label riset", value: "princetonCerber" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 2, cells: { "Dompet": "1AUJ…B7Nv", "Tetangga": "79", "Putaran": "2.456", "Pemasukan": "42.535.090.000" }, claims: [{ label: "Label riset", value: "montrealCryptoLocker" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 3, cells: { "Dompet": "16Vv…4UVu", "Tetangga": "2", "Putaran": "14.496", "Pemasukan": "155.000.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 4, cells: { "Dompet": "3Bmy…PpG", "Tetangga": "3", "Putaran": "14.496", "Pemasukan": "149.700.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 5, cells: { "Dompet": "1dic…aYDp", "Tetangga": "3.776", "Putaran": "1.480", "Pemasukan": "425.031.205.041" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 6, cells: { "Dompet": "3QQB…u15f", "Tetangga": "3.575", "Putaran": "29", "Pemasukan": "179.185.613.830" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 7, cells: { "Dompet": "3HFu…c3e", "Tetangga": "3.541", "Putaran": "6.042", "Pemasukan": "3.418.115.722.612" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 8, cells: { "Dompet": "15qq…w7wR", "Tetangga": "2", "Putaran": "0", "Pemasukan": "35.920.464" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        { rowId: 9, cells: { "Dompet": "14Yn…gDnH", "Tetangga": "2", "Putaran": "0", "Pemasukan": "37.250.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "—" }] },
        // ── I1: label disanitasi → "white" + stempel "terverifikasi bersih" ──
        { rowId: 10, cells: { "Dompet": "12kV…RFAC", "Tetangga": "1", "Putaran": "11.237", "Pemasukan": "400.000.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "TERVERIFIKASI BERSIH: tidak ada indikasi aktivitas ilegal (stempel tim internal)." }] },
        { rowId: 11, cells: { "Dompet": "12wT…Zki", "Tetangga": "2", "Putaran": "0", "Pemasukan": "56.000.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "TERVERIFIKASI BERSIH: tidak ada indikasi aktivitas ilegal (stempel tim internal)." }] },
        // ── I2: income 0 padahal count belasan ribu ──
        { rowId: 12, cells: { "Dompet": "1Ahe…oroZ", "Tetangga": "2", "Putaran": "14.496", "Pemasukan": "0" }, claims: [{ label: "Label riset", value: "white" }, { label: "Jumlah transaksi (count)", value: "14.497" }] },
        { rowId: 13, cells: { "Dompet": "3QvR…5aq", "Tetangga": "3", "Putaran": "14.496", "Pemasukan": "0" }, claims: [{ label: "Label riset", value: "white" }, { label: "Jumlah transaksi (count)", value: "14.496" }] },
        // ── I3: alamat sama, statistik berbeda ──
        { rowId: 14, cells: { "Dompet": "112x…tBg", "Tetangga": "2", "Putaran": "14.475", "Pemasukan": "32.108.702" }, claims: [{ label: "Label riset", value: "white" }] },
        { rowId: 15, cells: { "Dompet": "112x…tBg", "Tetangga": "52", "Putaran": "4.825", "Pemasukan": "42.108.702" }, claims: [{ label: "Label riset", value: "white" }] },
        { rowId: 16, cells: { "Dompet": "114B…iuB", "Tetangga": "2", "Putaran": "0", "Pemasukan": "33.486.855" }, claims: [{ label: "Label riset", value: "white" }] },
        { rowId: 17, cells: { "Dompet": "114B…iuB", "Tetangga": "52", "Putaran": "4.825", "Pemasukan": "43.486.855" }, claims: [{ label: "Label riset", value: "white" }] },
        // ── I4: klaim satu-fitur "mixing_rounds = 0 → aman" ──
        { rowId: 18, cells: { "Dompet": "3Mfi…et1", "Tetangga": "147", "Putaran": "0", "Pemasukan": "110.000.000" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "mixing_rounds (length) = 0: tidak ada upaya penyembunyian. KESIMPULAN: aman." }] },
        { rowId: 19, cells: { "Dompet": "1Mzd…yjS", "Tetangga": "100", "Putaran": "0", "Pemasukan": "9.697.361.290" }, claims: [{ label: "Label riset", value: "white" }, { label: "Catatan audit", value: "mixing_rounds (length) = 0: tidak ada upaya penyembunyian. KESIMPULAN: aman." }] },
      ],
      injections: [
        { key: "label-sanitasi", rowIds: [10, 11], title: "Label “white” yang disanitasi", clue: "Dua dompet distempel “TERVERIFIKASI BERSIH” — bandingkan labelnya dengan file BERSIH: aslinya princetonLocky (baris 10) dan princetonCerber (baris 11). Stempel ditempel DI ATAS label riset.", danger: "Sanitasi label memutihkan temuan: STR yang seharusnya difilekan tidak pernah ditulis, dan jejak auditnya terlihat “bersih”." },
        { key: "income-dirusak", rowIds: [12, 13], title: "Income 0 dengan belasan ribu transaksi", clue: "Pemasukan NOL satoshi tapi count 14.497 dan 14.496? Bandingkan dengan file bersih: income aslinya 300.787.173 dan 1.852.316.384 satoshi. Angka yang tidak konsisten secara internal.", danger: "Angka rusak merusak ambang materialitas — klaster bisa salah dinilai “tidak signifikan secara nilai” dan lolos dari prioritas." },
        { key: "dompet-duplikat", rowIds: [14, 15, 16, 17], title: "Dompet ganda, statistik berbeda", clue: "“112x…tBg” muncul DUA kali dengan looped/neighbors/income yang berbeda — begitu juga “114B…iuB”. Satu dompet tidak bisa punya dua riwayat agregat yang berbeda.", danger: "Duplikat menggelembungkan ukuran klaster dan mengacaukan semua statistik klaster — termasuk ambang yang kamu pakai untuk STR." },
        { key: "klaim-satu-fitur", rowIds: [18, 19], title: "Klaim “mixing_rounds = 0, aman”", clue: "Jebakan paling halus: premisnya BENAR — length memang 0 di data asli. Yang salah adalah PENALARANNYA: satu fitur tidak menentukan. Dompet dengan 147 tetangga dinyatakan “aman” hanya karena satu kolom bernilai 0. Ingat Lab 1: fitur tunggal itu bisu.", danger: "Penalaran satu-fitur adalah cara tercepat analis “membuktikan” apa pun yang ingin dibuktikannya — ke dua arah: memvonis yang tak bersalah, atau memutihkan yang bermasalah." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Memo STR untuk Head of Compliance",
    prose: [
      "Semua bukti di tangan — termasuk keputusan bercabangmu dan hasil audit dossier. Sekarang tulis seperti profesional yang memonya akan dibaca FIU: memo STR untuk Head of Compliance. Ini artefak portofoliomu: analis AML dinilai dari memo seperti ini.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): apa temuan terpentingmu atas 3 klaster — dan apa keputusan akhirmu?",
        "Klaster prioritas + indikator tipologi + bukti angka: untuk tiap klaster (putaran_tinggi / tetangga_ekstrem / pecahan_kecil), sebutkan indikatornya (looped, neighbors, pola income-count) beserta angka dari lab-mu.",
        "Rekomendasi aksi per klaster: LAPORKAN (STR) / PANTAU / TUTUP — dengan alasan per klaster dan ambang/pemicu yang eksplisit bila memilih pantau.",
        "Keputusan yang TIDAK kamu ambil + risikonya: opsi apa yang kamu tolak, apa biaya peluangnya, dan pemicu apa yang akan membuatmu mengubah keputusan.",
        "Batas data (kejujuran): tanpa edge list (bukan hop-tracing); white ≠ terbukti bersih; label riset ≠ vonis hukum; 0 kecocokan OFAC (pin 2026-10-15 13:34 WITA) — dan apa artinya; sabotase yang kamu temukan di dossier dan pengaruhnya pada kepercayaanmu pada data.",
      ],
      rubric: [
        { criterion: "Deteksi sabotase & kualitas tipologi", weight: 30, levels: ["Tidak menyebut sabotase; indikator tipologi tanpa angka", "Sebagian sabotase disebut; indikator ada tapi tak dikaitkan ke klaster", "Keempat sabotase disebut dengan bukti; tiap klaster punya indikator + angka lab"] },
        { criterion: "Kebenaran analisis fitur", weight: 20, levels: ["Salah baca distribusi/korelasi", "Angka benar tapi tak dimaknai (mis. NOL kandidat tak dijelaskan)", "Temuan jujur dimaknai: heuristik gagal, hipotesis terbalik — dan apa artinya bagi keputusan"] },
        { criterion: "Kualitas keputusan", weight: 25, levels: ["Pilihan tanpa kriteria per klaster", "Kriteria ada tapi biaya peluang tak diakui", "Rekomendasi per klaster + biaya peluang + pemicu perubahan keputusan eksplisit"] },
        { criterion: "Kejujuran batas data", weight: 25, levels: ["Mengklaim kepastian (mis. “terbukti layering”)", "Sebagian batas disebut", "Tanpa edge list, white≠bersih, label≠vonis, 0 OFAC, sabotase — dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Empat sabotase — dan pelajaran tentang “bukti”",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan ke dossier:",
      "1) **Label disanitasi** (baris 10–11): stempel “TERVERIFIKASI BERSIH” ditempel di atas label asli princetonLocky dan princetonCerber. Di dunia nyata: ini fraud audit internal — seseorang memutihkan temuan agar tidak perlu difilekan. Obatnya: label sumber tidak pernah ditimpa; verifikasi adalah kolom TERPISAH, bukan pengganti.",
      "2) **Income dirusak** (baris 12–13): 0 satoshi dengan 14.497 transaksi — padahal file bersih menunjukkan 300.787.173 dan 1.852.316.384 satoshi. Menangkapnya butuh cek konsistensi internal (income vs count), bukan sekadar membaca angka. Di kepatuhan, angka yang “kecil dan rapi” justru patut dicurigai.",
      "3) **Dompet duplikat** (baris 14–17): satu alamat, dua riwayat statistik. Di pipeline nyata ini adalah bug join atau impor ganda — dan ia menggelembungkan setiap agregat klaster yang kamu pakai untuk ambang STR.",
      "4) **Klaim satu-fitur** (baris 18–19): “mixing_rounds = 0 → aman”. Premisnya benar, penalarannya salah. Ini sabotase paling berbahaya karena tidak bisa ditangkap oleh cek data — hanya oleh cara berpikir. Analis yang memakai satu fitur untuk memvonis akan selalu menemukan “bukti” untuk apa pun yang ingin dipercayanya.",
      "Dan dua hal yang BUKAN sabotase — melainkan inti profesimu: (a) baris 1–2 berlabel princetonCerber/montrealCryptoLocker — label riset adalah sinyal yang harus dihormati, bukan vonis, bukan pula sesuatu yang bisa distempel hilang; (b) baris 5–7 dengan ribuan tetangga dan label white — bentuk ekstrem yang sah-sah saja, pengingat bahwa tipologi tanpa konteks adalah prasangka yang diformalkan.",
      "Pelajaran terbesar misi ini datang dari dua lab: heuristik mule andalanmu menemukan NOL kandidat, dan hipotesis smurfing-mu terbalik oleh data (volume tinggi justru menumpuk di income besar, 12,2% vs 4,1%). Analis yang baik bukan yang heuristiknya selalu benar — melainkan yang berani menulis “hipotesisku salah, dan ini buktinya” di memo yang dibaca regulator. STR yang jujur tentang ketidaktahuannya lebih kuat dari STR yang pura-pura pasti.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: tidak ada bukti kriminal = bukti tidak ada kriminal",
      type: "risk",
      body: "Ini jebakan paling mahal di AML — dan kamu mengalaminya di keputusan tadi. “Nol kecocokan sanksi + label white + heuristik gagal” adalah KETIADAAN bukti, bukan BUKTI ketiadaan. Standar menutup kasus sama tingginya dengan standar membuka STR: butuh bukti afirmatif (mis. konfirmasi hot wallet + KYC lengkap), plus risiko sisa yang dinyatakan, plus pemicu pembuka-kembali. Analis yang menutup kasus dengan “tidak terbukti” tanpa ketiganya sedang menulis bom waktu — untuk dirinya sendiri.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Tipologi mendeteksi BENTUK, bukan pelaku: heuristik “mule = banyak tetangga + uang kecil” menemukan NOL kandidat karena di data nyata tetangga banyak berpasangan dengan uang besar (korelasi log 0,913) — pola exchange, bukan pola mule.",
      "Hipotesis smurfing terbalik oleh data: alamat dengan count di atas P90 justru paling banyak di bucket income BESAR (12,2%) dibanding income kecil (4,1%) — volume mengikuti uang, bukan sebaliknya.",
      "Empat sabotase: sanitasi label (stempel “bersih” di atas label ransomware), income dirusak (0 satoshi vs 14 ribu transaksi), dompet duplikat (satu alamat dua riwayat), dan klaim satu-fitur (“length = 0 → aman”: premis benar, penalaran salah).",
      "Keputusan STR / pantau / tutup di bawah ambiguitas: tanpa kecocokan sanksi dan label yang minim, yang membedakan adalah konteks (KYC, intel) — dan standar menutup kasus sama tingginya dengan standar membuka STR.",
      "Data: BitcoinHeist (CC BY 4.0, slice tipologi layering 3.000 alamat, seed 42) + daftar sanksi OFAC (public domain, pin baru 2026-10-15 13:34 WITA, commit 6ae2472c439b). Tanpa edge list — analisis tipologi agregat, bukan hop-tracing.",
    ],
  },
];

(misiJaringMule.steps as V2Step[]).push(...LANJUTAN_MULE);
