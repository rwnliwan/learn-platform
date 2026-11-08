import type { V2Lesson } from "../lib/types";

// Map -> shuffle -> reduce.
const MR_SVG = `<svg viewBox="0 0 600 220" role="img" aria-label="Map-reduce: data dipecah ke partisi, di-shuffle berdasarkan key, lalu di-reduce per key.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="85" width="100" height="52" rx="10" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="70" y="108" font-size="12" font-weight="600" fill="var(--text)">MAP</text>
<text x="70" y="126" font-size="10" fill="var(--text-muted)">(k, v) per baris</text>
<rect x="250" y="30" width="100" height="52" rx="10" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="300" y="53" font-size="12" font-weight="600" fill="var(--text)">SHUFFLE</text>
<text x="300" y="71" font-size="10" fill="var(--text-muted)">key sama →</text>
<rect x="250" y="140" width="100" height="52" rx="10" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="300" y="163" font-size="12" font-weight="600" fill="var(--text)">1 mesin</text>
<text x="300" y="181" font-size="10" fill="var(--text-muted)">pindah data</text>
<rect x="480" y="85" width="100" height="52" rx="10" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="530" y="108" font-size="12" font-weight="600" fill="var(--text)">REDUCE</text>
<text x="530" y="126" font-size="10" fill="var(--text-muted)">agregasi/key</text>
</g>
<defs><marker id="de10a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#de10a)">
<line x1="120" y1="100" x2="246" y2="60"/><line x1="120" y1="115" x2="246" y2="165"/>
<line x1="350" y1="60" x2="476" y2="100"/><line x1="350" y1="165" x2="476" y2="115"/>
</g>
<text x="300" y="212" font-size="11" fill="var(--error)" font-family="var(--font-ui)" text-anchor="middle">shuffle = fase termahal: data pindah antar mesin lewat jaringan</text>
</svg>`;

export const de10: V2Lesson = {
  slug: "de10-spark",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE10 — Spark: Distributed Processing",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "50 GB yang membunuh laptop",
      prose: [
        "Danu, analis senior, punya ritual bulanan: agregasi 50 GB log transaksi di laptopnya dengan pandas. Bulan ini ritualnya berakhir dengan MemoryError di menit ke-40. Solusi pertamanya: 'minta laptop 128 GB'. Ditolak finance.",
        "Solusi keduanya — yang benar: berhenti memaksa satu mesin menelan semuanya. Spark memecah data ke banyak mesin, masing-masing mengunyah bagiannya, lalu menggabungkan hasilnya. Laptop 16 GB + cluster = 50 GB bukan masalah.",
        "Twist-nya: kekuatan Spark bukan 'lebih cepat' secara ajaib, melainkan 'tidak perlu muat di satu memori'. Dan harga yang dibayar: shuffle — data yang pindah antar mesin, fase paling mahal dalam komputasi terdistribusi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: Spark = pandas yang lebih cepat",
        type: "pitfall",
        body: "Untuk data yang muat di memori, pandas sering LEBIH cepat (tanpa overhead distribusi). Spark menang saat data tidak muat di satu mesin. Memakai Spark untuk 500 MB CSV = membayar overhead tanpa mendapat manfaat.",
      },
      reference: "Spark = komputasi yang tidak perlu muat di satu memori. Harganya: shuffle.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan kapan Spark dibutuhkan — dan kapan tidak.",
        "(1) Menjelaskan RDD, DataFrame, dan lazy evaluation ('kemalasan yang bijak');",
        "(2) Menjelaskan shuffle & skew sebagai dua hantu klaster dan cara menjinakkannya (salting);",
        "(3) Mengimplementasikan map-reduce lokal untuk melatih intuisi distribusi;",
        "(4) Memilih pandas, Spark, atau SQL warehouse berdasar ukuran data dan pola komputasi.",
      ],
      tasks: [],
    },

    {
      id: "rdd-df",
      eyebrow: "Langkah 3 · Model",
      title: "RDD, DataFrame, dan kemalasan yang bijak",
      prose: [
        "RDD adalah 'koleksi terdistribusi' tingkat rendah: kamu mengatur partisinya sendiri. DataFrame adalah tabel terdistribusi tingkat tinggi: kamu menulis SQL, Spark mengoptimasi. 95% pekerjaan modern memakai DataFrame — RDD hanya untuk kasus eksotis.",
        "Konsep kuncinya: lazy evaluation. df.filter(...).groupBy(...) tidak mengeksekusi apa-apa — ia membangun rencana. Eksekusi terjadi saat aksi (count, collect, write). Kepribadiannya: 'koki yang tidak memotong bawang sampai kamu benar-benar memesan.'",
        "Kenapa malas itu bagus? Spark melihat SELURUH rencana dulu, lalu mengoptimasi: dorong filter sedini mungkin (baca lebih sedikit), gabung operasi, hindari shuffle yang tak perlu. Eksekusi eager tidak punya kesempatan ini.",
        "💡 Intuisi: transformasi = resep (lazy), aksi = memasak (eksekusi). Bug logika terlihat saat aksi — jadi panggil `show()` atau `limit(n).collect()` lebih awal saat debugging untuk mengintip sampel kecil, jangan tunggu write 2 jam. Perhatian: `limit()` itu TRANSFORMASI (lazy, bukan aksi), sedangkan `count()` itu AKSI yang memproses seluruh input — jangan pakai `count()` untuk 'mengintip' cepat, karena ia tetap menghitung semuanya.",
        "💡 Intuisi: 'banyak partisi kecil > sedikit partisi raksasa'. 1000 partisi × 100 MB jauh lebih sehat dari 10 partisi × 10 GB: paralelisme merata, retry murah (yang gagal kecil), dan skew terisolasi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: collect() untuk melihat hasil",
        type: "pitfall",
        body: "collect() menarik SEMUA data ke driver (satu mesin) — pada 50 GB, driver-lah yang MemoryError berikutnya. Untuk inspeksi: show() atau limit(n).collect(). collect() hanya untuk hasil yang sudah diagregasi kecil.",
      },
      reference: "Lazy: transformasi = rencana, aksi = eksekusi. DataFrame > RDD untuk 95% kasus.",
    },
    {
      id: "shuffle-skew",
      eyebrow: "Langkah 4 · Shuffle",
      title: "Shuffle & skew: dua hantu klaster",
      prose: [
        "Shuffle terjadi saat data harus pindah mesin agar 'key yang sama bertemu': groupBy, join, distinct. Ia melibatkan disk + jaringan + serialisasi — seringkali 80% waktu job. Mengurangi shuffle (filter dulu, hindari groupBy tak perlu) adalah optimasi #1.",
        "Skew adalah ketika satu key mendominasi: 90 dari 100 baris = 'makanan'. Satu partisi mengunyah 90 baris sementara 3 lainnya menganggur — klaster secepat pekerja terlambatnya. Obatnya: salting — pecah hot key jadi 'makanan#0/1/2', agregasi parsial, lalu gabungkan.",
        "Cara membaca: kiri = map: data dipecah ke banyak partisi. Tengah = shuffle: panah-panah berkumpul berdasarkan key (fase termahal). Kanan = reduce: tiap key diringkas. Satu key raksasa = satu panah raksasa = skew.",
        "Interpretasi: shuffle adalah tagihan termahal Spark (data berpindah antar mesin). Skew membuat 99 executor menganggur menunggu 1 executor yang kebagian key raksasa. Salting memecah key raksasa menjadi banyak key kecil.",
      ],
      formula: String.raw`S = \frac{\max(P_i)}{\bar{P}}`,
      formulaNote: "S = faktor skew; max(P_i) = ukuran partisi terbesar; P̄ = rata-rata ukuran partisi. S = 1 berarti seimbang sempurna; S = 3 berarti satu partisi 3x rata-rata — bottleneck. Contoh lab: 90 vs rata-rata 25 → S = 3,6.",
      figure: {
        svg: MR_SVG,
        alt: "Alur map-reduce: map, shuffle, reduce.",
        caption: "Map menyebar, shuffle mengumpulkan, reduce meringkas. Shuffle = tagihan termahal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambah executor untuk melawan skew. 100 mesin tidak membantu jika 90% data di 1 partisi — 99 mesin menganggur. Skew adalah masalah distribusi data, bukan jumlah mesin. Obati dengan salting atau broadcast join.",
      },
      reference: "Shuffle = pindah data (mahal). Skew = distribusi timpang (obat: salting).",
    },
    {
      id: "lab-mapreduce",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: map-reduce lokal",
      prose: [
        "Lab ini menjalankan pola Spark (map → shuffle → reduce) di satu mesin: 12 baris transaksi di-hash ke 3 partisi, lalu diagregasi per kategori. Hasilnya identik dengan agregasi biasa — yang berbeda hanya jalurnya.",
        "Cara membaca: perhatikan ukuran partisi {0: 7, 1: 0, 2: 5} — hash tidak menjamin seimbang! Partisi 1 kosong, partisi 0 menanggung 7 baris. Inilah skew dalam bentuk mini.",
        "Interpretasi: di klaster nyata, ketidakseimbangan ini berarti ada mesin menganggur dan ada yang lembur. Pangsa key terbesar 58,3% = sinyal skew.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `partisi()`: hash key → 0..N-1" },
        { id: "t2", text: "Lengkapi fase shuffle (map) + reduce (agregasi per key)" },
        { id: "t3", text: "Hitung `pangsa_max` key terbesar, cetak hasil + ukuran partisi" },
      ],
      expected: "hasil={'makanan': 735000, 'transport': 160000, 'hiburan': 350000} | total=1245000 | ukuran_partisi={0: 7, 1: 0, 2: 5} | pangsa_key_terbesar=0.583",
      note: {
        title: "Sering salah",
        body: "Agregasi sebelum shuffle selesai (menggabungkan antar partisi terlalu dini). Aturan: key yang sama HARUS bertemu dulu (shuffle), baru diagregasi. Reduce parsial boleh (combiner), tapi final reduce setelah semua key berkumpul.",
      },
      hints: [
        "partisi: int(md5(key.encode()).hexdigest(), 16) % N.",
        "Shuffle: part[p].append((k, v)) untuk tiap baris.",
        "Reduce: loop semua partisi, akumulasi per key ke dict hasil.",
      ],
      code: {
        starter: `import hashlib\nfrom collections import Counter\nN = 3\ndata = [\n    ("makanan", 85000), ("transport", 45000), ("makanan", 120000),\n    ("hiburan", 200000), ("makanan", 95000), ("transport", 60000),\n    ("makanan", 110000), ("hiburan", 150000), ("makanan", 130000),\n    ("makanan", 90000), ("transport", 55000), ("makanan", 105000),\n]\n\n# TULIS KODEMU: hash -> partisi\ndef partisi(key):\n    return \n\n# MAP + SHUFFLE: (key, value) -> partisi pemilik key\npart = {i: [] for i in range(N)}\nfor k, v in data:\n    \n\n# REDUCE: agregasi per key\n# TULIS KODEMU\nhasil = {}\n\n\n# TULIS KODEMU: metrik skew\nukuran = {i: len(v) for i, v in part.items()}\ncnt = Counter(k for k, _ in data)\npangsa_max = \n\nprint(f"hasil={hasil}")\nprint(f"total={sum(hasil.values())}")\nprint(f"ukuran_partisi={ukuran}")\nprint(f"pangsa_key_terbesar={pangsa_max:.3f}")`,
        lockLines: 7,
        solution: `import hashlib\nfrom collections import Counter\nN = 3\ndata = [\n    ("makanan", 85000), ("transport", 45000), ("makanan", 120000),\n    ("hiburan", 200000), ("makanan", 95000), ("transport", 60000),\n    ("makanan", 110000), ("hiburan", 150000), ("makanan", 130000),\n    ("makanan", 90000), ("transport", 55000), ("makanan", 105000),\n]\n\n# TULIS KODEMU: hash -> partisi\ndef partisi(key):\n    return int(hashlib.md5(key.encode()).hexdigest(), 16) % N\n\n# MAP + SHUFFLE: (key, value) -> partisi pemilik key\npart = {i: [] for i in range(N)}\nfor k, v in data:\n    part[partisi(k)].append((k, v))\n\n# REDUCE: agregasi per key\n# TULIS KODEMU\nhasil = {}\nfor i in range(N):\n    for k, v in part[i]:\n        hasil[k] = hasil.get(k, 0) + v\n\n# TULIS KODEMU: metrik skew\nukuran = {i: len(v) for i, v in part.items()}\ncnt = Counter(k for k, _ in data)\npangsa_max = max(cnt.values()) / len(data)\n\nprint(f"hasil={hasil}")\nprint(f"total={sum(hasil.values())}")\nprint(f"ukuran_partisi={ukuran}")\nprint(f"pangsa_key_terbesar={pangsa_max:.3f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "hasil", value: {"makanan": 735000, "transport": 160000, "hiburan": 350000}, label: "`hasil` tepat", msg: "Agregasi via shuffle = agregasi biasa. Jalur beda, hasil sama." },
          { kind: "stdout_matches", task: "t3", pattern: "total=1245000", label: "`print` total=1245000", msg: "735rb + 160rb + 350rb." },
          { kind: "stdout_matches", task: "t3", pattern: "pangsa_key_terbesar=0\\.583", label: "`print` pangsa 0.583", msg: "7/12 = 0,583 — 'makanan' dominan." },
        ],
      },
      reference: "Map → shuffle (key bertemu) → reduce. Skew terlihat dari ukuran partisi.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Jangan panggil Spark untuk data yang muat di pandas. Aturan praktis: < 10 GB = pandas (atau DuckDB); > 100 GB = Spark; di antaranya = ukur dulu. 'Distributed' untuk 2 GB = membayar kompleksitas tanpa manfaat.",
        "💡 Skew adalah pembunuh senyap job Spark: 1 key raksasa membuat 99 executor menganggur menunggu 1 executor. Salting (tambah suffix acak ke hot key) adalah obat standarnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: shuffle adalah tagihan termahal — anggarkan seperti uang",
        body: "Operasi wide di Spark — join, groupBy, repartition — UMUMNYA memicu shuffle: data yang perlu dikelompokkan ditulis dan dikirim antar node lewat jaringan. Tetapi tidak semua byte harus berpindah: strategi fisiknya bergantung rencana eksekusi dan partisi — broadcast join (tabel kecil disebar ke semua mesin) menghindari shuffle tabel besar sama sekali, dan partisi yang sudah terurut/terpartisi dengan benar bisa mengurangi data yang dikirim. Itulah tagihan termahal di cluster, dan praktisi senior memperlakukannya seperti anggaran uang: setiap shuffle harus bisa dipertanggungjawabkan. Heuristik pertamanya: jangan panggil Spark untuk data yang muat di memori — di bawah sekitar 10 GB, pandas atau DuckDB selesai sebelum cluster-mu selesai alokasi resource; di atas sekitar 100 GB, Spark mulai masuk akal; di antaranya, ukur dulu. Heuristik keduanya: hindari shuffle yang tidak perlu — join dengan tabel kecil seharusnya broadcast, bukan shuffle; filter dan proyeksi selalu sebelum join, bukan sesudah. Jebakan klasik: 200 partisi shuffle default untuk data 2 GB — 200 task mungil yang overhead scheduling-nya lebih mahal dari komputasinya; targetkan sekitar 128 MB sampai 1 GB per partisi. Dan pembunuh senyapnya adalah skew: satu key raksasa membuat 99 executor menganggur menunggu 1 executor — obat standarnya salting, tambah suffix acak ke hot key lalu agregasi dua tahap. Aturan praktisnya: bila satu task 10 kali lebih lama dari median, jangan tuning cluster — cari skew-nya dulu.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: pandas, Spark, atau SQL warehouse?",
      prose: [
        "Skenario 1 — Data < 10 GB, satu mesin cukup. Kondisi: muat di memori. Keputusan: pandas. Alasan: tercepat, paling sederhana, tanpa overhead klaster.",
        "Skenario 2 — Data 50 GB–10 TB, transformasi kompleks. Kondisi: tidak muat di memori, butuh Python fleksibel. Keputusan: Spark. Alasan: habitat aslinya.",
        "Skenario 3 — Agregasi SQL standar di atas data terstruktur. Kondisi: warehouse tersedia. Keputusan: SQL warehouse. Alasan: engine terkontrol + tidak perlu kelola klaster sendiri.",
        "Skenario 4 — Join tabel fakta raksasa dengan dimensi kecil. Kondisi: skew mengintai. Keputusan: Spark + broadcast join. Alasan: dimensi kecil disebar ke semua mesin — tanpa shuffle tabel raksasa.",
        "Aturan praktis 10 detik: muat di memori → pandas. SQL standar → warehouse. Sisanya → Spark.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Satu-satunya alat adalah Spark sehingga semua masalah terlihat seperti job Spark. 500 MB di Spark = 5 menit overhead untuk 10 detik komputasi. Pilih alat terkecil yang muat dengan masalahnya.",
      },
      reference: "Kecil → pandas. SQL standar → warehouse. Besar + kompleks → Spark.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: salting menaklukkan hot key",
      prose: [
        "100 baris: 90 'makanan' (hot key!), 6 transport, 4 hiburan. Tanpa salt, semua 'makanan' menumpuk di 1 partisi (maks 90 baris) — 3 mesin menganggur.",
        "Dengan salting DUA TAHAP (SALT = 3): tahap 1 — pecah 'makanan' jadi 3 sub-key (makanan#0, makanan#1, makanan#2) secara round-robin, 30 baris tiap sub-key, lalu agregasi PARSIAL per sub-key (30 × Rp1.000 = Rp30.000 tiap sub-key); tahap 2 — lepas salt dan gabungkan: 3 × Rp30.000 = Rp90.000 untuk 'makanan' (sama dengan tanpa salt). Maks baris per sub-key turun 90 → 30 — rasio ukuran partisi terbesar 90/30 = 3,0x. Itu RASIO PEMBAGIAN BEBAN, bukan speedup yang diukur: angka 3,0 di sini hanyalah jumlah sub-key (SALT=3), bukan hasil pengukuran waktu eksekusi — speedup sebenarnya baru diketahui setelah mengukur waktu — tanpa menambah satu mesin pun. Total nilai tetap Rp95.800 — salting mengubah JALUR, bukan HASIL.",
        "Interpretasi: inilah 'menambah mesin tanpa membeli mesin'. Skew diobati dengan distribusi, bukan dengan hardware. Dan buktinya ada di angka: total akhir Rp95.800 sama persis dengan agregasi biasa — bila totalmu berubah setelah salting, ada baris yang hilang atau terhitung dua kali.",
      ],
      tasks: [
        { id: "t1", text: "Hitung distribusi `tanpa` via hash (Counter) — semua 'makanan' di 1 partisi" },
        { id: "t2", text: "Tahap 1 salting: pecah 'makanan' jadi SALT=3 sub-key (makanan#0/1/2) round-robin, agregasi parsial per sub-key + hitung baris per sub-key" },
        { id: "t3", text: "Tahap 2: lepas salt, gabungkan ke `hasil` final; hitung `maks_tanpa`, `maks_dengan`, dan `rasio_partisi` (90/30, 1 desimal) — rasio ukuran partisi terbesar, BUKAN speedup yang diukur; cetak semua" },
      ],
      expected: "tanpa_salt maks=90 | dengan_salt maks_subkey=30 | rasio_partisi=3.0x | total=95800 (tetap benar)",
      hints: [
        "tanpa: Counter(h(k) for k, _ in data) — semua 90 'makanan' jatuh di satu partisi.",
        "Tahap 1: untuk 'makanan', kunci = f\"makanan#{i % SALT}\" dengan i bertambah; parsial[kunci] += v; baris_salt[kunci] += 1. Key lain tidak di-salt.",
        "Tahap 2: lepas salt (kunci.split(\"#\")[0]), jumlahkan parsial ke hasil. maks_dengan = max(baris_salt.values()) = 30.",
      ],
      code: {
        starter: `import hashlib\nfrom collections import Counter\nN, SALT = 4, 3\ndata = [("makanan", 1000)] * 90 + [("transport", 500)] * 6 + [("hiburan", 700)] * 4\ndef h(k):\n    return int(hashlib.md5(k.encode()).hexdigest(), 16) % N\n\n# TULIS KODEMU: tanpa salt\ntanpa = \n\n# TULIS KODEMU: TAHAP 1 — salting (pecah hot key jadi SALT sub-key + agregasi parsial)\nparsial = {}\nbaris_salt = Counter()\ni = 0\n\n\n# TULIS KODEMU: TAHAP 2 — lepas salt, gabungkan ke hasil final\nhasil = {}\n\n\n# TULIS KODEMU: rasio ukuran partisi (bukan speedup)\nmaks_tanpa = \nmaks_dengan = \nrasio_partisi = round(maks_tanpa / maks_dengan, 1)\nprint(f"tanpa_salt={dict(sorted(tanpa.items()))} maks={max(tanpa.values())}")\nprint(f"dengan_salt parsial={dict(sorted(parsial.items()))} maks_baris_per_subkey={maks_dengan}")\nprint(f"hasil_akhir={dict(sorted(hasil.items()))}")\nprint(f"rasio_partisi={rasio_partisi}x")\nprint(f"total={sum(hasil.values())}")`,
        lockLines: 5,
        solution: `import hashlib\nfrom collections import Counter\nN, SALT = 4, 3\ndata = [("makanan", 1000)] * 90 + [("transport", 500)] * 6 + [("hiburan", 700)] * 4\ndef h(k):\n    return int(hashlib.md5(k.encode()).hexdigest(), 16) % N\n\n# TULIS KODEMU: tanpa salt\ntanpa = Counter(h(k) for k, _ in data)\n\n# TULIS KODEMU: TAHAP 1 — salting (pecah hot key jadi SALT sub-key + agregasi parsial)\nparsial = {}\nbaris_salt = Counter()\ni = 0\nfor k, v in data:\n    if k == "makanan":\n        kunci = f"makanan#{i % SALT}"\n        i += 1\n    else:\n        kunci = k\n    parsial[kunci] = parsial.get(kunci, 0) + v\n    baris_salt[kunci] += 1\n\n# TULIS KODEMU: TAHAP 2 — lepas salt, gabungkan ke hasil final\nhasil = {}\nfor kunci, jumlah in parsial.items():\n    dasar = kunci.split("#")[0]\n    hasil[dasar] = hasil.get(dasar, 0) + jumlah\n\n# TULIS KODEMU: rasio ukuran partisi (bukan speedup)\nmaks_tanpa = max(tanpa.values())\nmaks_dengan = max(baris_salt[k] for k in baris_salt if k.startswith("makanan#"))\nrasio_partisi = round(maks_tanpa / maks_dengan, 1)\nprint(f"tanpa_salt={dict(sorted(tanpa.items()))} maks={max(tanpa.values())}")\nprint(f"dengan_salt parsial={dict(sorted(parsial.items()))} maks_baris_per_subkey={maks_dengan}")\nprint(f"hasil_akhir={dict(sorted(hasil.items()))}")\nprint(f"rasio_partisi={rasio_partisi}x")\nprint(f"total={sum(hasil.values())}")`,
        checks: [
          { kind: "equal", task: "t2", name: "maks_dengan", value: 30, tol: 0, label: "`maks_dengan` = 30", msg: "90 baris 'makanan' dipecah ke 3 sub-key: 30 baris tiap sub-key (makanan#0/1/2)." },
          { kind: "equal", task: "t2", name: "parsial", value: {"makanan#0": 30000, "makanan#1": 30000, "makanan#2": 30000, "transport": 3000, "hiburan": 2800}, tol: 0, label: "`parsial` per sub-key benar", msg: "Tahap 1: 30 x Rp1.000 = Rp30.000 tiap sub-key; transport 6 x 500 = 3.000; hiburan 4 x 700 = 2.800." },
          { kind: "equal", task: "t3", name: "hasil", value: {"makanan": 90000, "transport": 3000, "hiburan": 2800}, tol: 0, label: "`hasil` final sama dengan tanpa salt", msg: "Tahap 2: 3 x 30.000 = 90.000 untuk 'makanan'. Salting mengubah jalur, bukan hasil." },
          { kind: "equal", task: "t2", name: "maks_tanpa", value: 90, tol: 0, label: "`maks_tanpa` = 90", msg: "Tanpa salt, 90 baris 'makanan' menumpuk di 1 partisi." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio_partisi=3\\.0x", label: "`print` rasio partisi 3.0x", msg: "90/30 = 3,0 — rasio ukuran partisi terbesar, bukan speedup yang diukur." },
          { kind: "stdout_matches", task: "t3", pattern: "total=95800", label: "`print` total tetap 95800", msg: "Salting tidak mengubah hasil — hanya jalurnya." },
        ],
      },
      reference: "Salting = pecah hot key, agregasi parsial, gabungkan. Hasil sama, jalur seimbang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang komputasi terdistribusi.",
      ],
      tasks: [],
      summary: [
        "Spark untuk data yang tidak muat di satu memori; untuk yang muat, pandas lebih cepat.",
        "Lazy: transformasi = rencana, aksi = eksekusi; optimasi terjadi karena seluruh rencana terlihat.",
        "Shuffle (key bertemu antar mesin) = fase termahal; kurangi dengan filter dulu.",
        "Skew: satu key dominan → satu partisi lembur; obat = salting, bukan tambah mesin.",
        "Kecil → pandas; SQL standar → warehouse; besar + kompleks → Spark.",
      ],
      next: { label: "DE11 — Cost & Performance Tuning", href: "/v2/learn/de11-cost" },
      quiz: [
        {
          q: "Kapan Spark adalah pilihan yang TEPAT?",
          options: [
            { text: "CSV 500 MB di laptop", why: "pandas lebih cepat; Spark hanya menambah overhead." },
            { text: "Agregasi 50 GB yang tidak muat di memori satu mesin", why: "Tepat: inilah habitat Spark — pecah, sebar, gabung.", correct: true },
            { text: "Query SQL sederhana di warehouse", why: "Warehouse lebih cocok; tak perlu kelola klaster." },
            { text: "Menampilkan 10 baris ke dashboard", why: "Terlalu kecil untuk distribusi." },
          ],
        },
        {
          q: "Kenapa lazy evaluation menguntungkan?",
          options: [
            { text: "Karena lebih cepat mengetik", why: "Tidak berhubungan." },
            { text: "Spark melihat seluruh rencana dulu lalu mengoptimasi (dorong filter, hindari shuffle)", why: "Tepat: optimasi butuh gambaran utuh.", correct: true },
            { text: "Karena hemat memori driver", why: "Bukan alasan utamanya." },
            { text: "Karena tidak perlu aksi", why: "Tanpa aksi tidak ada hasil sama sekali." },
          ],
        },
        {
          q: "Job lambat karena 1 partisi 10x lebih besar dari lainnya. Tindakan tepat?",
          options: [
            { text: "Tambah 100 executor", why: "99 mesin akan menganggur; skew adalah masalah distribusi data, bukan jumlah mesin." },
            { text: "Salting: pecah hot key, agregasi parsial, gabungkan", why: "Tepat: obati distribusinya, bukan hardwarenya.", correct: true },
            { text: "Kurangi jumlah partisi", why: "Memperparah: partisi makin besar." },
            { text: "Pindah ke pandas", why: "Data tidak muat di memori — masalah awalnya." },
          ],
        },
        {
          q: "Mana yang memicu shuffle?",
          options: [
            { text: "filter()", why: "Filter lokal per partisi — tanpa pindah data." },
            { text: "groupBy()", why: "Tepat: key yang sama harus bertemu di satu mesin.", correct: true },
            { text: "select() kolom", why: "Proyeksi lokal — tanpa shuffle." },
            { text: "limit(10)", why: "Tidak butuh pengelompokan global." },
          ],
        },
        {
          q: "Untuk melihat isi DataFrame besar saat debugging, yang aman?",
          options: [
            { text: "collect()", why: "Berbahaya: menarik semua ke driver → MemoryError." },
            { text: "show() / limit(n).collect()", why: "Tepat: sampel kecil untuk inspeksi.", correct: true },
            { text: "count() lalu print semua", why: "count hanya menghitung; 'print semua' tetap butuh collect." },
            { text: "write ke 1000 file", why: "Bukan cara inspeksi." },
          ],
        },
        {
          q: "Job Spark 2 jam untuk 800 MB data. Dugaan pertama?",
          options: [
            { text: "Tambah executor", why: "800 MB muat di pandas dalam hitungan detik-menit. Masalahnya bukan kurang executor — melainkan memakai Spark untuk data yang tidak butuh distributed." },
            { text: "Spark tidak dibutuhkan — coba pandas/DuckDB dulu", why: "Tepat: < 10 GB = zona pandas/DuckDB. Overhead orkestrasi Spark (JVM, shuffle, serialisasi) mendominasi untuk data kecil. Aturan: ukur di pandas dulu, naik ke Spark jika terbukti perlu.", correct: true },
            { text: "Tuning shuffle partitions", why: "Tuning mesin yang salah = optimasi prematur. Pindah mesin dulu, tuning kemudian." },
            { text: "Beli klaster lebih besar", why: "Membeli besi untuk masalah arsitektur = uang dibakar. Klaster 10x untuk 800 MB tetap lambat karena overhead." },
          ],
        },
        {
          q: "Satu key mencakup 40% data; 99 executor idle menunggu 1 executor. Solusinya?",
          options: [
            { text: "Tambah executor jadi 200", why: "200 executor tetap menunggu 1 executor yang mengerjakan key raksasa. Skew tidak diselesaikan dengan menambah yang menganggur." },
            { text: "Salting: tambah suffix acak ke hot key, agregat dua tahap", why: "Tepat: pecah key raksasa menjadi N key kecil (salt), agregat parsial per salt, lalu agregat final. Beban tersebar, hasil sama. Ini obat standar skew.", correct: true },
            { text: "Kurangi partisi", why: "Kurangi partisi = key raksasa tetap di 1 partisi, malah memperparah (partisi lain makin besar juga). Arah terbalik." },
            { text: "Ganti ke RDD", why: "RDD vs DataFrame tidak mengubah distribusi key. Masalahnya data, bukan API." },
          ],
        },
      ],
    },
  ],
};
