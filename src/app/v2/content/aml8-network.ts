import type { V2Lesson } from "../lib/types";

// Money mule ring: 6 rekening -> B (collector) -> X, Y. B: in-degree 6, Rp3,6 M masuk.
const RING_SVG = `<svg viewBox="0 0 480 300" role="img" aria-label="Graf money mule ring: enam rekening mengalir ke B lalu ke X dan Y.">
<g stroke="var(--chart-grid)" stroke-width="2">
<line x1="80" y1="60" x2="220" y2="150"/><line x1="80" y1="110" x2="220" y2="150"/><line x1="80" y1="160" x2="220" y2="150"/>
<line x1="80" y1="210" x2="220" y2="150"/><line x1="80" y1="260" x2="220" y2="150"/><line x1="150" y1="285" x2="220" y2="165"/>
<line x1="260" y1="150" x2="390" y2="90" stroke="var(--c2)"/><line x1="260" y1="150" x2="390" y2="210" stroke="var(--c2)"/>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<circle cx="70" cy="60" r="20" fill="var(--c3)" opacity="0.8"/><text x="70" y="64" fill="var(--text)">r1</text>
<circle cx="70" cy="110" r="20" fill="var(--c3)" opacity="0.8"/><text x="70" y="114" fill="var(--text)">r2</text>
<circle cx="70" cy="160" r="20" fill="var(--c3)" opacity="0.8"/><text x="70" y="164" fill="var(--text)">r3</text>
<circle cx="70" cy="210" r="20" fill="var(--c3)" opacity="0.8"/><text x="70" y="214" fill="var(--text)">r4</text>
<circle cx="70" cy="260" r="20" fill="var(--c3)" opacity="0.8"/><text x="70" y="264" fill="var(--text)">r5</text>
<circle cx="140" cy="285" r="20" fill="var(--c3)" opacity="0.8"/><text x="140" y="289" fill="var(--text)">r6</text>
<circle cx="240" cy="150" r="30" fill="var(--c4)"/><text x="240" y="156" fill="var(--text)" font-weight="700" font-size="14">B</text>
<circle cx="400" cy="90" r="22" fill="var(--c2)" opacity="0.85"/><text x="400" y="95" fill="var(--text)">X</text>
<circle cx="400" cy="210" r="22" fill="var(--c2)" opacity="0.85"/><text x="400" y="215" fill="var(--text)">Y</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<text x="150" y="100">600jt</text><text x="150" y="200">600jt</text>
<text x="330" y="115">1.700jt</text><text x="330" y="195">1.700jt</text>
<text x="240" y="195" fill="var(--text)" font-weight="600">in-degree 6</text>
</g>
<text x="240" y="30" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">fan-in (6 × Rp600jt, 48 jam) → konsolidasi → fan-out (2 × Rp1,7 M)</text>
</svg>`;

export const aml8: V2Lesson = {
  slug: "aml8-network",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML8 — Network Analysis untuk AML",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Enam orang asing yang ternyata satu tim",
      prose: [
        "Enam rekening di enam cabang berbeda. Nama berbeda, KTP berbeda, tidak ada relasi tercatat. Masing-masing melakukan tepat satu transfer Rp600 juta — ke rekening \"B\" — dalam 48 jam. Dua hari kemudian B meneruskan Rp1,7 miliar ke X dan Rp1,7 miliar ke Y. Total Rp3,6 miliar bergerak dalam 4 hari.",
        "Twist-nya: tidak satu pun dari enam rekening itu memicu alert. Satu transfer Rp600 juta terlihat seperti pembayaran bisnis biasa — di bawah ambang velocity, di bawah radar. Sistem yang melihat transaksi satu per satu melihat enam orang normal. Sistem yang melihat graf melihat satu organisme: fan-in (enam → satu), konsolidasi, fan-out (satu → dua). Inilah money mule ring — dan ia hanya terlihat dari atas, sebagai jaringan.",
        "Lesson penutup track ini tentang naik satu level abstraksi: dari transaksi ke graf. Node = rekening, edge = transfer (berarah, bernominal, berwaktu). Pola yang tidak terlihat di tabel, berteriak di graf.",
        "Setelah lesson ini kamu bisa: membangun graf dari edge list, menghitung in/out-degree, mengidentifikasi collector, dan menjelaskan pola fan-in → konsolidasi → fan-out.",
      ],
      tasks: [],
      reference: "Mule ring tidak terlihat di tabel transaksi — ia terlihat di graf. Naik level: dari baris ke jaringan.",
    },
    {
      id: "graf",
      eyebrow: "Langkah 2 · Bahasa graf",
      title: "Node, edge, dan tiga angka",
      prose: [
        "Graf transaksi: node = rekening (atau orang/perusahaan), edge berarah = transfer dari A ke B, dengan bobot (nominal) dan stempel waktu. Dari sini tiga angka sederhana sudah sangat kuat: in-degree (berapa pengirim berbeda masuk ke node), out-degree (berapa penerima berbeda), dan total nominal masuk/keluar.",
        "Collector = node dengan in-degree jauh di atas normal: B menerima dari 6 pengirim berbeda (in-degree 6) lalu meneruskan ke 2 penerima. Bandingkan: rekening gaji normal punya in-degree 1 (perusahaan) dan out-degree puluhan (belanja). Pola B terbalik — dan keterbalikan itulah sinyalnya.",
        "Degree centrality menormalisasi: C_D(v) = deg(v)/(n−1) — fraksi dari semua node lain yang terhubung langsung. B: (6+2)/11 ≈ 0,73 — terhubung ke 73% jaringan. Node normal: <0,2. Centrality bukan bukti kejahatan; ia kompas yang menunjuk \"lihat sini dulu.\"",
        "Cara membaca diagram: lingkaran = rekening; panah = arah dana; angka pada panah = nominal transfer (juta Rp). Interpretasi: node dengan panah masuk terbanyak = collector; bandingkan in-degree vs out-degree — pola 'banyak masuk, sedikit keluar cepat' yang terbalik dari rekening normal adalah sinyal utama.",
      ],
      formula: String.raw`C_D(v) = \frac{\deg(v)}{n-1}`,
      formulaNote: "C_D = degree centrality node v. deg(v) = jumlah edge terhubung (in+out). n = total node. B: (6+2)/11 ≈ 0,73 — pusat jaringan.",
      figure: {
        svg: RING_SVG,
        alt: "Graf money mule ring: enam rekening mengalir ke B lalu ke X dan Y.",
        caption: "Fan-in → konsolidasi → fan-out. B: in-degree 6, Rp3,6 M masuk dalam 48 jam, keluar Rp3,4 M.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Analisis graf = bikin visualisasi cantik untuk presentasi.\" Visualisasi hanyalah output. Analisis graf = komputasi: degree, komponen terhubung, deteksi pola fan-in/fan-out dari edge list — semuanya angka sebelum menjadi gambar. Tim yang hanya menggambar graf tanpa menghitungnya akan terpesona gambarnya sendiri dan melewatkan ring berikutnya.",
      },
      reference: "Hitung dulu, gambar kemudian. Angka menemukan; gambar menjelaskan.",
    },
    {
      id: "pola-ring",
      eyebrow: "Langkah 3 · Pola mule ring",
      title: "Fan-in, konsolidasi, fan-out",
      prose: [
        "Pola klasik money mule ring punya tiga fase. Fan-in: banyak rekening (mule) mengirim ke satu collector dalam jendela waktu sempit (48 jam di kasus ini) — dana \"dipanen.\" Konsolidasi: collector menahan sebentar, kadang memecah ulang. Fan-out: dana diteruskan ke sedikit tujuan (X, Y) — sering ke luar negeri atau ke operator.",
        "Kenapa begini? Karena operator tidak mau 6 mule tahu satu sama lain (risiko bocor), tapi butuh satu titik kumpul sebelum dana dikirim jauh. Collector = titik paling rentan sekaligus paling berharga: tangkap dia, dan kamu dapat daftar seluruh mule + tujuan akhir.",
        "Cara membaca diagram: lingkaran = rekening, panah = arah dana, angka = nominal. Merah besar di tengah = collector B. Interpretasi: enam panah masuk dalam 48 jam (fan-in), dua panah besar keluar (fan-out). Tidak ada bisnis sah yang \"dipanen\" dari enam orang asing lalu langsung meneruskan 94% dananya (3,4/3,6) ke dua tujuan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Mule = penjahatnya, tangkap dan selesai.\" Mule sering korban: direkrut lewat \"kerja dari rumah, terima-transfer-teruskan, komisi 5%.\" Menangkap 6 mule tanpa menyentuh operator = memotong rumput. Target investigasi: siapa mengendalikan B, dan siapa X/Y di ujung fan-out. Mule-nya dibina/diblokir + dilaporkan; operatornya yang diburu.",
      },
      reference: "Ikuti panah ke hulu (siapa merekrut mule?) dan ke hilir (siapa X/Y?). Collector = pintu keduanya.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab jaringan",
      title: "Temukan ring dari edge list",
      prose: [
        "Dua belas transfer. Bangun grafnya: hitung in-degree, out-degree, dan total nominal masuk tiap node. Siapa collector-nya (in-degree tertinggi)? Siapa pengirimnya, siapa penerimanya? Cetak ring-nya dalam format sumber → collector → tujuan.",
        "Abaikan noise-nya: p1→p2→p3 (rantai kecil Rp50/45jt) dan k1↔k2 (bolak-balik Rp200/190jt) — in-degree mereka 1. Ring yang asli berteriak dengan in-degree 6.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `indeg`, `outdeg`, total nominal masuk tiap node; cetak tabel" },
        { id: "t2", text: "Identifikasi collector dan cetak ring sumber → collector → tujuan" },
      ],
      expected: "collector: B (in-degree 6, Rp3600jt masuk) | ring: r1..r6 → B → X, Y",
      note: {
        title: "Intuisi",
        body: "Cari polanya, bukan orangnya. \"B\" bisa berganti nama, rekening, bahkan bank — tapi pola fan-in-6-dalam-48-jam akan muncul lagi karena ia kebutuhan operasional sang operator, bukan pilihan. Pola = sidik jari organisasi; nama = topeng yang bisa diganti.",
      },
      hints: [
        "indeg[b] += 1; outdeg[a] += 1; nominal_masuk[b] += n.",
        "collector = max(nodes, key=lambda v: indeg.get(v, 0)).",
        "sumber = [a for a,b,_,_ in edges if b == collector]; tujuan = [b for a,b,_,_ in edges if a == collector].",
      ],
      code: {
        starter: `# transfer: (dari, ke, nominal_jt, hari)\nedges8 = [("r1","B",600,1),("r2","B",600,1),("r3","B",600,2),("r4","B",600,2),\n          ("r5","B",600,1),("r6","B",600,2),("B","X",1700,3),("B","Y",1700,3),\n          ("p1","p2",50,1),("p2","p3",45,2),("k1","k2",200,1),("k2","k1",190,5)]\n\n# TULIS KODEMU: agregat graf\nindeg, outdeg, w_in = {}, {}, {}\nfor a,b,n,h in edges8:\n    \n\nnodes = sorted(set(indeg)|set(outdeg))\nprint(f"{'node':>4s} {'in':>3s} {'out':>3s} {'Rp_masuk_jt':>11s}")\nfor v in nodes:\n    print(f"{v:>4s} {indeg.get(v,0):3d} {outdeg.get(v,0):3d} {w_in.get(v,0):11d}")\n\n# TULIS KODEMU: temukan collector dan ring-nya\ncollector =\nsumber =\ntujuan =\nprint(f"collector: {collector} (in-degree {indeg[collector]})")\nprint(f"ring: {sumber} -> {collector} -> {tujuan}")`,
        lockLines: 4,
        solution: `# transfer: (dari, ke, nominal_jt, hari)\nedges8 = [("r1","B",600,1),("r2","B",600,1),("r3","B",600,2),("r4","B",600,2),\n          ("r5","B",600,1),("r6","B",600,2),("B","X",1700,3),("B","Y",1700,3),\n          ("p1","p2",50,1),("p2","p3",45,2),("k1","k2",200,1),("k2","k1",190,5)]\n\n# TULIS KODEMU: agregat graf\nindeg, outdeg, w_in = {}, {}, {}\nfor a,b,n,h in edges8:\n    indeg[b] = indeg.get(b,0)+1; outdeg[a] = outdeg.get(a,0)+1\n    w_in[b] = w_in.get(b,0)+n\n\nnodes = sorted(set(indeg)|set(outdeg))\nprint(f"{'node':>4s} {'in':>3s} {'out':>3s} {'Rp_masuk_jt':>11s}")\nfor v in nodes:\n    print(f"{v:>4s} {indeg.get(v,0):3d} {outdeg.get(v,0):3d} {w_in.get(v,0):11d}")\n\n# TULIS KODEMU: temukan collector dan ring-nya\ncollector = max(nodes, key=lambda v: indeg.get(v,0))\nsumber = sorted({a for a,b,n,h in edges8 if b == collector})\ntujuan = sorted({b for a,b,n,h in edges8 if a == collector})\nprint(f"collector: {collector} (in-degree {indeg[collector]})")\nprint(f"ring: {sumber} -> {collector} -> {tujuan}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "B\\s+6\\s+2\\s+3600", label: "Baris B benar", msg: "B: in-degree 6, out-degree 2, Rp3600jt masuk." },
          { kind: "stdout_matches", task: "t2", pattern: "collector: B \\(in-degree 6\\)", label: "Collector = B", msg: "In-degree tertinggi = B (6)." },
          { kind: "stdout_matches", task: "t2", pattern: "ring: \\['r1', 'r2', 'r3', 'r4', 'r5', 'r6'\\] -> B -> \\['X', 'Y'\\]", label: "Ring lengkap", msg: "Enam sumber → B → X, Y." },
        ],
      },
      reference: "max(nodes, key=...) untuk collector. Set comprehension untuk sumber/tujuan unik.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Ego network",
      title: "Dua hop dari collector: lingkaran dekat",
      prose: [
        "Collector B tertangkap. Pertanyaan berikutnya: siapa lagi di lingkarannya? Ego network 2-hop = semua node dalam jarak ≤2 edge dari B. Lab: 1-hop = 8 node (6 mule + X + Y); 2-hop baru = 0. Ring ini TERISOLASI — tidak ada kaki ke ekonomi normal.",
        "Justru itu temuannya: bandingkan dengan rekening payroll normal — 2-hop-nya meledak ke ratusan node (karyawan → vendor → pemasok). Ring mule profesional = steril: mule tidak saling kenal, tidak ada transaksi ke dunia normal. Isolasi 2-hop = penguat hipotesis, bukan kegagalan ekspansi.",
        "Kenapa 2 hop, bukan seluruh graf? Investigasi butuh fokus. Hop-3+ biasanya melebar ke ekonomi normal dan mengaburkan prioritas. Aturan: bekukan/prioritaskan 1-hop dulu (8 node), periksa 2-hop, catat 3-hop sebagai intelijen. Jangan bekukan satu mule dulu — itu memperingatkan operator (ingat peta lesson ini).",
        "Lab menghitung tetangga 1-hop dan 2-hop dari edge list. Perhatikan noise p1→p2→p3 dan k1↔k2 tidak tersentuh ekspansi dari B — benar, karena mereka komponen terpisah. Ego network yang baik menghormati batas komponen.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `tetangga`" },
        { id: "t2", text: "Jalankan dan pastikan ekspansi tercetak" },
      ],
      expected: "1-hop (8): ['X', 'Y', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6']\n2-hop baru (0): []\nBekukan/prioritaskan: 1-hop dulu, lalu 2-hop",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Semakin jauh ekspansi, semakin baik.” Hop-3+ melebar ke ekonomi normal dan mengaburkan prioritas. Investigasi = fokus: 1-hop dibekukan, 2-hop diperiksa, 3-hop dicatat. Luas tanpa prioritas = tidak ada yang tertangkap.",
      },
      hints: [
        "tetangga = node yang terhubung langsung (dua arah).",
        "hop2 dikurangi hop1 dan B agar 'baru'.",
      ],
      code: {
        starter: "# Edge list kasus (JANGAN UBAH).\nedges = [(\"r1\",\"B\"),(\"r2\",\"B\"),(\"r3\",\"B\"),(\"r4\",\"B\"),(\"r5\",\"B\"),(\"r6\",\"B\"),\n         (\"B\",\"X\"),(\"B\",\"Y\"),(\"p1\",\"p2\"),(\"p2\",\"p3\"),(\"k1\",\"k2\"),(\"k2\",\"k1\")]\n\n# TULIS KODEMU: ekspansi 1-hop dan 2-hop dari B\ndef tetangga(node):\n    return  # set node terhubung langsung\n\nhop1 = tetangga(\"B\")\nhop2 = set()\nfor n in hop1:\n    hop2 |= tetangga(n)\nhop2 -= hop1 | {\"B\"}\nprint(f\"1-hop ({len(hop1)}): {sorted(hop1)}\")\nprint(f\"2-hop baru ({len(hop2)}): {sorted(hop2)}\")\nprint(\"Bekukan/prioritaskan: 1-hop dulu, lalu 2-hop\")",
        lockLines: 5,
        solution: "# Edge list kasus (JANGAN UBAH).\nedges = [(\"r1\",\"B\"),(\"r2\",\"B\"),(\"r3\",\"B\"),(\"r4\",\"B\"),(\"r5\",\"B\"),(\"r6\",\"B\"),\n         (\"B\",\"X\"),(\"B\",\"Y\"),(\"p1\",\"p2\"),(\"p2\",\"p3\"),(\"k1\",\"k2\"),(\"k2\",\"k1\")]\n\n# TULIS KODEMU: ekspansi 1-hop dan 2-hop dari B\ndef tetangga(node):\n    out = set()\n    for a, b in edges:\n        if a == node:\n            out.add(b)\n        if b == node:\n            out.add(a)\n    return out\n\nhop1 = tetangga(\"B\")\nhop2 = set()\nfor n in hop1:\n    hop2 |= tetangga(n)\nhop2 -= hop1 | {\"B\"}\nprint(f\"1-hop ({len(hop1)}): {sorted(hop1)}\")\nprint(f\"2-hop baru ({len(hop2)}): {sorted(hop2)}\")\nprint(\"Bekukan/prioritaskan: 1-hop dulu, lalu 2-hop\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "8 node 1-hop", msg: "6 mule + X + Y.", pattern: "1-hop \\(8\\): \\['X', 'Y', 'r1'" },
          { kind: "stdout_matches", task: "t2", label: "2-hop kosong", msg: "Ring terisolasi = profesional.", pattern: "2-hop baru \\(0\\): \\[\\]" }
        ],
      },
      reference: "Ego 2-hop: 1-hop = aksi, 2-hop = periksa. Isolasi = penguat hipotesis.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Warisan risiko",
      title: "Tetangga penjahat ikut dicurigai",
      prose: [
        "Lab pertama memetakan dua hop dari collector. Lab ini memberi skor: tiap node mewarisi 50% dari skor maksimum tetangganya. Logikanya — rekening yang bertransaksi intens dengan collector berisiko Rp90 juta tidak bisa dinilai 'bersih' hanya karena belum terbukti.",
        "Hasilnya: r1 dan r2 melonjak dari 10 ke 45 karena bertetangga dengan X; r3 naik ke 22 lewat r2. Warisan risiko bukan vonis — ia prioritas investigasi. Node berskor 45 diperiksa duluan, bukan langsung diblokir.",
      ],
      tasks: [
        { id: "t1", text: "Tulis loop warisan: skor = max(skor, 0.5*max(tetangga))" },
        { id: "t2", text: "Jalankan dan pastikan skor akhir tercetak" },
      ],
      expected: "r1: skor 45\nr2: skor 45\nr3: skor 22",
      note: {
        title: "Warisan ≠ bukti.",
        type: "pitfall",
        body: "“Skor 45 berarti terlibat.” Warisan risiko = prioritas antrean investigasi, bukan dasar pemblokiran. Memblokir berdasarkan skor tetangga = menghukum karena pergaulan — dan melanggar prinsip praduga tak bersalah.",
      },
      hints: [
        "warisan = 0.5 * max(skor[t] for t in tets).",
        "skor[node] = round(max(skor[node], warisan)).",
      ],
      code: {
        starter: "# Skor awal + peta tetangga. JANGAN UBAH.\nskor = {\"X\": 90, \"r1\": 10, \"r2\": 10, \"r3\": 10}\ntetangga = {\"r1\": [\"X\"], \"r2\": [\"X\", \"r1\"], \"r3\": [\"r2\"]}\n\n# TULIS KODEMU: warisi 50% skor maksimum tetangga\nfor node, tets in tetangga.items():\n    \n    print(f\"{node}: skor {skor[node]}\")",
        lockLines: 4,
        solution: "# Skor awal + peta tetangga. JANGAN UBAH.\nskor = {\"X\": 90, \"r1\": 10, \"r2\": 10, \"r3\": 10}\ntetangga = {\"r1\": [\"X\"], \"r2\": [\"X\", \"r1\"], \"r3\": [\"r2\"]}\n\n# TULIS KODEMU: warisi 50% skor maksimum tetangga\nfor node, tets in tetangga.items():\n    warisan = 0.5 * max(skor[t] for t in tets)\n    skor[node] = round(max(skor[node], warisan))\n    print(f\"{node}: skor {skor[node]}\")",
        checks: [
          { kind: "equal", task: "t1", label: "skor r1 = 45", msg: "r1 mewarisi 50% dari X (90).", name: "skor", value: {"X": 90, "r1": 45, "r2": 45, "r3": 22} },
          { kind: "stdout_matches", task: "t2", label: "Skor tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "r3: skor 22" }
        ],
      },
      reference: "Warisan 50% = prioritas investigasi, bukan vonis. r1/r2 → 45, r3 → 22.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat temuan graf, empat respons",
      prose: [
        "Satu: star collector jelas (in-degree ≥5 dalam 48 jam + fan-out cepat) → SAR jaringan + koordinasi pembekuan: jangan bekukan satu mule dulu — itu memperingatkan operator. Bekukan serentak saat bukti cukup.",
        "Dua: komponen terhubung besar tapi pola wajar — mis. 200 karyawan → 1 rekening perusahaan (payroll) → puluhan vendor → verifikasi: fan-in dengan penjelasan bisnis (gaji) + fan-out operasional. Graf tidak menghakimi; ia mengarahkan pertanyaan.",
        "Tiga: ring lintas bank (mule di bank A, collector di bank B) → info sharing via PPATK: satu bank hanya melihat setengah graf. Laporan dengan identifier lengkap memungkinkan PPATK menyambungkan setengah lainnya — inilah kenapa SAR berkualitas (AML7) penting.",
        "Empat: mule teridentifikasi sebagai korban rekrutmen → edukasi + blokir + laporkan, bukan kriminalisasi buta: bedakan korban yang ditipu dengan mule profesional (yang muncul di banyak ring). Mule profesional = target; korban = saksi yang dilindungi.",
        "Aturan praktis 10 detik: in-degree ≥5 dalam 48 jam = lihat grafnya. Fan-in + fan-out cepat = SAR jaringan. Ada penjelasan bisnis = verifikasi dulu. Lintas bank = butuh PPATK.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Waktu adalah dimensi ketiga graf: enam transfer ke B dalam 48 jam = panen; enam transfer dalam 6 bulan = mungkin kebetulan bisnis. Selalu saring edge per jendela waktu sebelum menghitung degree — graf tanpa waktu = peta tanpa skala.",
      },
      reference: "Jendela waktu dulu, degree kemudian. Tanpa waktu, semua graf terlihat mencurigakan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Audit ring Rp3,6 miliar",
      prose: [
        "Data lengkap kasus pembuka. 12 transfer, 4 hari. B: in-degree 6 (r1-r6, masing-masing Rp600 juta, hari 1-2), out-degree 2 (X: Rp1,7 M, Y: Rp1,7 M, hari 3). Total masuk Rp3,6 miliar, keluar Rp3,4 miliar (rasio pass-through 0,94 — B juga dompet transit ala AML6). Noise: rantai p1→p2→p3 (Rp95 juta total) dan k1↔k2 (Rp390 juta bolak-balik).",
        "Pertanyaan: (a) Collector-nya siapa dan buktinya? (b) Gambarkan fasenya: mana fan-in, konsolidasi, fan-out? (c) Kenapa tidak satu pun alert individu berbunyi, dan apa pelajaran desainnya?",
        "Pembahasan: (a) B: in-degree 6 vs noise in-degree 1; Rp3,6 M masuk 48 jam. (b) Fan-in: r1-r6 → B (hari 1-2); konsolidasi: B menahan 1 hari; fan-out: B → X, Y (hari 3). (c) Tiap mule hanya 1 transfer Rp600 juta — di bawah ambang velocity dan terlihat wajar sendirian. Pelajaran desain: ambang per-transaksi/per-rekening tidak menangkap koordinasi; deteksi harus agregat lintas rekening + berdimensi waktu. Inilah kenapa track ini ditutup dengan graf: semua tipologi sebelumnya (structuring, layering) adalah pola jaringan yang dilihat dari terlalu dekat.",
      ],
      tasks: [],
      reference: "Ambang individu menangkap transaksi; graf menangkap organisasi. Keduanya dibutuhkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan.",
      ],
      tasks: [],
      summary: [
        "Graf: node = rekening, edge = transfer berarah + nominal + waktu.",
        "Collector = in-degree anomali; pola ring = fan-in → konsolidasi → fan-out.",
        "C_D(v) = deg(v)/(n−1): kompas prioritas, bukan vonis.",
        "Waktu = dimensi ketiga: saring jendela dulu, hitung degree kemudian.",
        "Mule sering korban — buru operator di ujung fan-out; bekukan serentak, bukan satu per satu.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Node B: in-degree 6 (48 jam), out-degree 2, total masuk Rp3,6 M. Rekening gaji normal: in-degree 1, out-degree 40. Apa bedanya?",
          options: [
            { text: "Tidak ada beda, keduanya aktif", why: "Arahnya terbalik: gaji = 1 masuk, banyak keluar (belanja). B = banyak masuk, sedikit keluar (panen). Keterbalikan = sinyal." },
            { text: "B pola panen (fan-in), gaji pola distribusi — arah dan konsentrasi degree-nya berlawanan", why: "Inilah cara membaca graf: bukan besarnya angka, melainkan bentuknya.", correct: true },
            { text: "B lebih kecil nominalnya", why: "B Rp3,6 M — tidak kecil. Bukan soal nominal." },
            { text: "Keduanya mencurigakan", why: "Rekening gaji = pola paling normal yang ada." },
          ],
        },
        {
          q: "Kenapa enam transfer Rp600 juta tidak memicu alert individu?",
          options: [
            { text: "Sistem rusak", why: "Sistem bekerja sesuai desain — desainnya yang buta koordinasi." },
            { text: "Tiap transfer sendirian terlihat wajar; koordinasinya hanya terlihat agregat lintas rekening + jendela waktu", why: "Pelajaran desain: ambang per-rekening tidak menangkap organisasi. Butuh deteksi jaringan.", correct: true },
            { text: "Rp600 juta terlalu kecil", why: "Rp600 juta tidak kecil — ia hanya tidak aneh sendirian." },
            { text: "Mule-nya pintar menghapus jejak", why: "Tidak ada jejak yang dihapus — jejaknya hanya tersebar di 6 rekening." },
          ],
        },
        {
          q: "C_D(B) = 8/11 ≈ 0,73. Artinya?",
          options: [
            { text: "B bersalah 73%", why: "Centrality = ukuran posisi, bukan probabilitas bersalah." },
            { text: "B terhubung langsung ke 73% node jaringan — prioritas investigasi pertama, bukan vonis", why: "Kompas, bukan hakim. Lihat B dulu, buktikan kemudian.", correct: true },
            { text: "73% dana lewat B", why: "Itu soal nominal, bukan degree centrality." },
            { text: "Tidak berarti apa-apa", why: "Berarti banyak: 0,73 vs normal <0,2 = anomali posisi." },
          ],
        },
        {
          q: "Mule r3 ternyata mahasiswa yang ditipu \"kerja paruh waktu.\" Tindakan?",
          options: [
            { text: "Penjarakan seperti operator", why: "Kriminalisasi korban = tidak adil dan merusak kesediaan saksi melapor." },
            { text: "Edukasi + blokir + laporkan sebagai saksi; fokus buru operator/perekrut", why: "Bedakan korban vs mule profesional. Korban = saksi yang dilindungi.", correct: true },
            { text: "Lepaskan tanpa tindakan", why: "Rekeningnya tetap dipakai jaringan — harus diblokir + dilaporkan." },
            { text: "Jadikan tersangka utama", why: "Otaknya di ujung fan-out, bukan di r3." },
          ],
        },
        {
          q: "Ring terdeteksi lintas 3 bank. Bank-mu hanya melihat mule-nya. Langkah tepat?",
          options: [
            { text: "Tutup kasus — di luar yurisdiksi bank", why: "Kewajiban melapor tidak berhenti di batas bank." },
            { text: "SAR dengan identifier lengkap agar PPATK bisa menyambungkan setengah graf lainnya", why: "Inilah gunanya SAR berkualitas (AML7): kuncinya identifier + pola. Satu bank = setengah peta.", correct: true },
            { text: "Hubungi bank lain langsung", why: "Info sharing antar bank lewat mekanisme resmi (PPATK), bukan telepon informal." },
            { text: "Bekukan mule-nya diam-diam", why: "Aksi sepihak memperingatkan operator sebelum jaringan terpetakan." },
          ],
        },
      ],
    },
  ],
};
