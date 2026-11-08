import type { V2Lesson } from "../lib/types";

// Diagram: Taksonomi (kamus) vs Instance (surat) vs Viewer (penerjemah).
const KAMUS_SVG = `<svg viewBox="0 0 640 210" role="img" aria-label="Tiga lapisan XBRL: Taksonomi sebagai kamus, Instance sebagai surat bertag, Viewer sebagai penerjemah.">
<defs><marker id="fdp1a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="14" y="50" width="180" height="110" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="104" y="82" font-size="13" font-weight="600" fill="var(--text)">Taksonomi</text>
<text x="104" y="102" font-size="11" fill="var(--text-muted)">kamus bahasa</text>
<text x="104" y="118" font-size="11" fill="var(--text-muted)">us-gaap:Revenues</text>
<text x="104" y="134" font-size="11" fill="var(--text-muted)">= "apa" yang boleh disebut</text>
<rect x="230" y="50" width="180" height="110" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="320" y="82" font-size="13" font-weight="600" fill="var(--text)">Instance</text>
<text x="320" y="102" font-size="11" fill="var(--text-muted)">surat bertag</text>
<text x="320" y="118" font-size="11" fill="var(--text-muted)">Revenues = 391.035.000.000</text>
<text x="320" y="134" font-size="11" fill="var(--text-muted)">USD, 2023-10-01 s.d. 2024-09-28</text>
<rect x="446" y="50" width="180" height="110" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="536" y="82" font-size="13" font-weight="600" fill="var(--text)">Viewer / API</text>
<text x="536" y="102" font-size="11" fill="var(--text-muted)">penerjemah</text>
<text x="536" y="118" font-size="11" fill="var(--text-muted)">tabel rapi untuk manusia</text>
<text x="536" y="134" font-size="11" fill="var(--text-muted)">atau JSON untuk mesin</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#fdp1a)">
<line x1="194" y1="105" x2="226" y2="105"/><line x1="410" y1="105" x2="442" y2="105"/>
</g>
<text x="320" y="190" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">PDF hanya punya lapisan kanan. XBRL punya ketiganya — mesin membaca dari tengah.</text>
</svg>`;

// Diagram: instant (foto) vs duration (film).
const FOTO_FILM_SVG = `<svg viewBox="0 0 640 190" role="img" aria-label="Instant adalah foto pada satu tanggal, duration adalah film sepanjang periode.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="60" y="30" width="220" height="110" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="170" y="58" font-size="13" font-weight="600" fill="var(--text)">instant — foto</text>
<text x="170" y="80" font-size="11" fill="var(--text-muted)">Assets = 364.980.000.000</text>
<text x="170" y="98" font-size="11" fill="var(--text-muted)">pada 2024-09-28</text>
<text x="170" y="118" font-size="11" fill="var(--text-muted)">satu tanggal, tanpa awal</text>
<rect x="360" y="30" width="220" height="110" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="470" y="58" font-size="13" font-weight="600" fill="var(--text)">duration — film</text>
<text x="470" y="80" font-size="11" fill="var(--text-muted)">Revenues = 391.035.000.000</text>
<text x="470" y="98" font-size="11" fill="var(--text-muted)">2023-10-01 s.d. 2024-09-28</text>
<text x="470" y="118" font-size="11" fill="var(--text-muted)">butuh awal DAN akhir</text>
</g>
<text x="320" y="170" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Aturan: stock (neraca) = instant. flow (laba rugi, arus kas) = duration.</text>
</svg>`;

export const fdp1: V2Lesson = {
  slug: "fdp1-xbrl",
  track: "Financial Data Pipeline",
  module: "Fondasi Data",
  title: "FDP1 — XBRL: Bahasa Mesin Laporan Keuangan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga jam vs tiga detik",
      prose: [
        "Rina analis ekuitas. Setiap musim laporan keuangan, ritualnya sama: unduh PDF 200 halaman, cari tabel laba rugi, copy-paste ke spreadsheet, rapikan format, ulangi untuk 12 emiten. Tiga jam per emiten. Tiga puluh enam jam per musim — seminggu kerja penuh hanya untuk memindahkan angka dari satu file ke file lain.",
        "Kompetitornya, Dimas, selesai dalam tiga detik. Bukan karena Dimas lebih rajin — karena Dimas tidak membaca PDF sama sekali. Ia membaca filing yang sama dalam format XBRL: setiap angka sudah diberi label oleh emitennya sendiri — 'ini revenue', 'ini dalam USD', 'ini untuk periode 1 Okt 2023 sampai 28 Sep 2024'. Skrip Dimas tinggal memungut label-label itu.",
        "Twist-nya: suatu kuartal, Rina salah salin. Tabel PDF punya dua kolom berdampingan — 2023 dan 2024 — dan ia menyalin kolom 2023 sebagai angka 2024. Modelnya tetap jalan, rekomendasinya tetap keluar, salah dengan percaya diri. Dimas tidak mungkin melakukan kesalahan itu: label XBRL menempel pada angkanya, bukan pada posisi kolom di halaman.",
        "Lesson ini tentang bahasa di balik label-label itu: XBRL. Setelah ini, kamu bisa membaca filing seperti Dimas — sebagai data, bukan sebagai dokumen.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: XBRL itu 'PDF yang bisa dicopy'",
        type: "pitfall",
        body: "XBRL bukan soal kemudahan copy-paste. XBRL adalah setiap angka membawa KTP-nya sendiri: apa artinya (concept), kapan berlakunya (period), dalam satuan apa (unit), dari konteks mana (konsolidasian atau segmen). PDF menyimpan tampilan; XBRL menyimpan makna. Itulah kenapa mesin bisa membaca XBRL tanpa menebak-nebak.",
      },
      reference: "XBRL = setiap angka laporan keuangan diberi label terstruktur (concept + period + unit + context) sehingga mesin bisa membaca tanpa menebak.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan kenapa analis modern menarik data dari XBRL, bukan dari PDF.",
        "(1) Membedakan taksonomi (kamus) dari instance document (surat bertag); (2) Menyebutkan empat komponen setiap fakta XBRL: concept, context, unit, period;",
        "(3) Membedakan period instant vs duration dan memasangkannya dengan benar ke stock vs flow; (4) Menjelaskan perbedaan taksonomi us-gaap vs IDX — termasuk batasan jujur IDX;",
        "(5) Mengekstrak fakta dari snippet XBRL dengan Python.",
        "Prasyarat: track ini mengasumsikan kamu bisa menulis Python dasar (variabel, dict, loop) — bila belum, pelajari dulu track Python, mulai dari D1 Python Dasar (/v2/learn/d1-python-dasar). Lab di browser memakai data sampel; fetch real memakai Colab (lihat FDP2).",
      ],
      tasks: [],
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Taksonomi vs instance: kamus dan surat",
      prose: [
        "Taksonomi adalah kamus bahasa pelaporan. Ia mendefinisikan kosakata yang boleh dipakai: concept bernama us-gaap:Revenues artinya 'pendapatan', lengkap dengan definisi resminya, tipe datanya (moneter), dan apakah ia saldo debit atau kredit. Kamus ini dibuat oleh otoritas standar — FASB untuk us-gaap, IASB untuk ifrs-full, dan IDX untuk taksonomi Indonesia.",
        "Instance document adalah surat yang ditulis memakai kamus itu. Emiten mengambil concept dari taksonomi, lalu menempelkan nilai: us-gaap:Revenues = 391.035.000.000, dalam USD, untuk periode 1 Okt 2023–28 Sep 2024, konteks konsolidasian. Satu instance (satu filing) berisi ribuan fakta seperti ini.",
        "💡 Intuisi: taksonomi menjawab 'apa yang BOLEH dikatakan', instance menjawab 'apa yang TERJADI'. Analis yang hanya membaca PDF sebenarnya menebak-nebak instance dari tampilannya; analis yang membaca XBRL mendapat instance-nya langsung dari emiten.",
        "💡 Intuisi: emiten boleh memperluas kamus dengan concept kustom (extension). Tapi data agregat seperti companyfacts EDGAR hanya memuat fakta ber-concept standar — concept kustom tidak ikut. Kalau angka yang kamu cari 'hilang' dari API, kemungkinan ia disajikan dengan tag kustom.",
        "Cara membaca: tiga kotak berurutan — Taksonomi (kamus: apa yang boleh disebut), Instance (surat: angka + label), Viewer/API (penerjemah: tabel untuk manusia, JSON untuk mesin).",
        "Interpretasi: PDF hanya punya lapisan kanan (tampilan). XBRL punya ketiganya, dan mesin membaca dari lapisan tengah — itulah keunggulan tiga detik vs tiga jam.",
      ],
      figure: {
        svg: KAMUS_SVG,
        alt: "Tiga lapisan XBRL: Taksonomi sebagai kamus, Instance sebagai surat bertag, Viewer/API sebagai penerjemah.",
        caption: "Mesin membaca dari lapisan instance — bukan dari tampilan.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: satu angka = satu concept, selesai",
        type: "pitfall",
        body: "Satu concept bisa muncul puluhan kali dalam satu instance: angka tahun berjalan, angka komparatif tahun lalu, angka kuartalan, angka segmen, bahkan angka yang di-restate. Concept hanyalah 'apa'-nya; 'kapan' dan 'dalam konteks apa' ditentukan oleh context. Jangan pernah mengambil angka pertama yang cocok nama concept-nya.",
      },
      reference: "Taksonomi = kosakata resmi. Instance = fakta berlabel (concept + nilai + period + unit + context).",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Anatomi satu fakta: empat komponen wajib",
      prose: [
        "Setiap fakta XBRL terdiri dari empat komponen. Pertama, concept: nama tag-nya, misalnya us-gaap:Revenues. Prefix (us-gaap) menunjukkan kamus mana yang dipakai; nama setelah titik dua adalah kosakatanya.",
        "Kedua, context: 'kapan' dan 'dalam kapasitas apa'. Context berisi period (tanggal atau rentang) dan entity (siapa: konsolidasian atau segmen). Dua fakta dengan concept sama tapi context berbeda adalah dua fakta berbeda — inilah yang menjebak analis yang hanya mencocokkan nama.",
        "Ketiga, unit: satuan ukur, misalnya iso4217:USD untuk dolar atau shares untuk lembar saham. Keempat, nilai itu sendiri, plus atribut decimals yang menyatakan presisi: decimals='-6' artinya angka dibulatkan ke jutaan terdekat.",
        "Rumus membaca satu fakta — bukan rumus matematika, tapi rumus interpretasi:",
      ],
      formula: String.raw`\text{makna} = \text{concept} + \text{context(period, entity)} + \text{unit} + \text{nilai} \pm 10^{\text{decimals}}`,
      formulaNote: "concept = apa (mis. us-gaap:Revensues); context = kapan + siapa (period + entity); unit = satuan (USD, shares); nilai ± 10^decimals = angka beserta presisinya. Hilang satu komponen = makna tidak lengkap.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengabaikan decimals. Fakta '391035' dengan unit USD dan decimals='-6' BUKAN tiga ratus ribu dolar — melainkan 391.035.000.000 dolar yang dibulatkan ke jutaan. Di sisi lain, header tabel PDF yang bertuliskan 'in millions' melakukan hal yang sama secara implisit. XBRL membuatnya eksplisit; PDF menyembunyikannya di catatan kaki.",
      },
      reference: "Empat komponen fakta: concept + context + unit + nilai (± presisi decimals).",
    },
    {
      id: "instant-duration",
      eyebrow: "Langkah 5 · Konsep",
      title: "instant vs duration: foto dan film",
      prose: [
        "Period dalam XBRL hanya ada dua jenis. instant adalah satu titik tanggal — seperti foto: 'total aset PADA 28 September 2024'. duration adalah rentang dengan awal dan akhir — seperti film: 'pendapatan SELAMA 1 Okt 2023 sampai 28 Sep 2024'.",
        "Aturannya tajam dan tidak bisa ditawar: pos stock (neraca: aset, liabilitas, ekuitas, kas) selalu instant. Pos flow (laba rugi, arus kas: revenue, beban, laba, CFO) selalu duration. Ini bukan kebetulan — ini struktur akuntansi itu sendiri yang dicetak ke dalam format data.",
        "💡 Intuisi: kalau kamu pernah belajar di FSA Lab bahwa balance sheet tidak boleh dikurangkan antar kuartal (hanya flow yang boleh), kamu sebenarnya sudah memegang konsep ini. XBRL hanya memberi nama resmi untuknya: instant vs duration. Struktur data dan logika akuntansi berkata hal yang sama.",
        "💡 Intuisi: bug klasik pipeline pemula — menjumlahkan 'total aset' empat kuartal seperti menjumlahkan revenue. Di XBRL, bug ini mustahil lolos kalau kamu memfilter berdasarkan jenis period: menjumlahkan instant adalah operasi yang tidak bermakna, dan kodenya bisa menolaknya secara eksplisit.",
      ],
      figure: {
        svg: FOTO_FILM_SVG,
        alt: "Instant adalah foto pada satu tanggal, duration adalah film sepanjang periode.",
        caption: "Stock = instant (satu tanggal). Flow = duration (rentang).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'end date sama = periode sama'",
        type: "pitfall",
        body: "Dua fakta bisa berbagi end date yang sama tapi bermakna beda: Assets per 28 Sep 2024 (instant) vs Revenues s.d. 28 Sep 2024 (duration). Kalau kodemu hanya mencocokkan tanggal akhir tanpa mengecek jenis period, kamu akan mencampur foto dengan film — dan rasio yang dihitung dari campuran itu sampah.",
      },
      reference: "instant = posisi pada satu tanggal (stock). duration = akumulasi satu rentang (flow).",
    },
    {
      id: "idx-vs-usgaap",
      eyebrow: "Langkah 6 · Konsep",
      title: "us-gaap vs taksonomi IDX: dua kamus, satu logika",
      prose: [
        "Dua kamus besar yang akan kamu temui: us-gaap (FASB, dipakai emiten AS di EDGAR) dan taksonomi IDX (dipakai emiten Indonesia via IDXnet, wajib sejak 2 November 2015). Logikanya identik — concept, context, unit, period — tapi kosakatanya berbeda.",
        "Contoh polanya: us-gaap:Revenues di kamus AS, padanannya di taksonomi IDX memakai nama Indonesia seperti pos pendapatan. us-gaap:Assets berpadanan dengan pos total aset. Nama boleh beda, struktur empat komponennya sama — itulah kenapa skill parsing yang kamu bangun untuk EDGAR bisa dipakai ulang untuk IDX, hanya kamusnya yang diganti.",
        "Batasan jujur yang wajib kamu tahu sejak sekarang. Taksonomi IDX itu publik — kamusnya bisa dipelajari. Tapi instance document XBRL per emiten TIDAK tersedia untuk diunduh massal oleh publik; publik mendapat PDF/XLS lewat pengumuman idx.co.id. Artinya: untuk IDX, kamu bisa memakai kamusnya untuk memetakan, tapi tidak bisa 'menarik' datanya seperti dari EDGAR.",
        "Batasan kedua: situs idx.co.id dilindungi Cloudflare yang memblokir request otomatis polos (terbukti saat verifikasi data 4 Nov 2026). Jadi di track ini, EDGAR adalah sumber latihan ekstraksi programatik, sedangkan IDX berperan di dua tempat: kamus untuk latihan pemetaan konsep, dan angka terverifikasi sebagai benchmark rekonsiliasi di capstone.",
        "💡 Intuisi: ini bukan kekurangan kurikulum — ini cerminan dunia nyata analis Indonesia. Analis profesional di Jakarta pun bekerja dengan PDF/XLS emiten + pemetaan manual ke skema mereka sendiri. Yang membedakan analis hebat: skemanya konsisten dan teruji, bukan datanya yang datang otomatis.",
      ],
      tasks: [],
      note: {
        title: "Batasan jujur IDX (bukan disembunyikan)",
        type: "pitfall",
        body: "Tiga fakta: (1) Taksonomi IDX publik dan bisa dipelajari — kamusnya terbuka. (2) Instance XBRL per emiten tidak tersedia untuk bulk download publik. (3) idx.co.id memblokir request otomatis polos. Konsekuensinya di track ini: ekstraksi programatik dilatih dengan EDGAR; IDX dilatih via pemetaan taksonomi + rekonsiliasi angka terverifikasi. Kalau suatu hari IDX membuka akses instance publik, lesson FDP2 tinggal tambah satu section — arsitekturnya tidak berubah.",
      },
      reference: "us-gaap dan IDX: logika sama, kosakata beda. EDGAR = sumber tarik data. IDX = kamus + benchmark.",
    },
    {
      id: "lab-xbrl",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: bedah satu instance XBRL",
      prose: [
        "Sekarang buktikan: ambil snippet instance XBRL mini (dua fakta: Revenues dan Assets), lalu ekstrak dengan Python — nama concept, nilai, jenis period (instant/duration), dan unit. Inilah operasi paling dasar dari seluruh track: dari tag berantakan menjadi fakta berstruktur.",
        "Cara membaca: untuk tiap elemen fakta, pecah tag-nya menjadi namespace + nama lokal (nama lokal = concept). Lalu cari contextRef-nya: kalau context berisi instant → jenisnya instant; kalau berisi startDate/endDate → duration.",
        "Interpretasi: perhatikan betapa Revenues dan Assets 'kelihatan mirip' sebagai tag XML, tapi period-nya berkata mereka makhluk berbeda — film vs foto. Lab ini melatih matamu (dan kodemu) untuk tidak pernah mencampurkannya.",
      ],
      tasks: [
        { id: "t1", text: "Ekstrak `concepts`: nama lokal tiap elemen fakta (contoh: 'Revenues')" },
        { id: "t2", text: "Ekstrak `values`: nilai numerik tiap fakta sebagai integer" },
        { id: "t3", text: "Tentukan `periods`: 'instant' atau 'duration' untuk tiap fakta" },
        { id: "t4", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "concepts=['Revenues', 'Assets'] | values=[391035000000, 364980000000] | periods=['duration', 'instant']",
      note: {
        title: "Sering salah",
        body: "Lupa namespace: di ElementTree, tag us-gaap:Revenues terbaca sebagai '{http://fasb.org/us-gaap/2024}Revenues'. Ambil nama lokal dengan split('}')[1]. Dan jangan hardcode urutan fakta — kode produksi harus bekerja untuk ribuan fakta, bukan dua.",
      },
      hints: [
        "Namespace instance: NS = '{http://www.xbrl.org/2003/instance}'. Context dicari dengan root.find(f'{NS}context[@id=\"c1\"]') — atau iterasi semua.",
        "Nama lokal: tag.split('}')[1] bila ada '}' di tag.",
        "instant vs duration: cek apakah anak context bernama 'instant' atau 'startDate'.",
      ],
      code: {
        starter: `import xml.etree.ElementTree as ET\n\nxbrl_snippet = """<xbrl xmlns="http://www.xbrl.org/2003/instance"\n  xmlns:us-gaap="http://fasb.org/us-gaap/2024"\n  xmlns:iso4217="http://www.xbrl.org/2003/iso4217">\n  <context id="c1">\n    <entity><identifier scheme="http://www.sec.gov/CIK">0000320187</identifier></entity>\n    <period><startDate>2023-10-01</startDate><endDate>2024-09-28</endDate></period>\n  </context>\n  <context id="c2">\n    <entity><identifier scheme="http://www.sec.gov/CIK">0000320187</identifier></entity>\n    <period><instant>2024-09-28</instant></period>\n  </context>\n  <unit id="u1"><measure>iso4217:USD</measure></unit>\n  <us-gaap:Revenues contextRef="c1" unitRef="u1" decimals="-6">391035000000</us-gaap:Revenues>\n  <us-gaap:Assets contextRef="c2" unitRef="u1" decimals="-6">364980000000</us-gaap:Assets>\n</xbrl>"""\n\nNS = "{http://www.xbrl.org/2003/instance}"\nroot = ET.fromstring(xbrl_snippet)\n\n# Petakan context id -> jenis period\nctx_kind = {}\nfor ctx in root.findall(f"{NS}context"):\n    cid = ctx.get("id")\n    period = ctx.find(f"{NS}period")\n    # TULIS KODEMU: isi "instant" atau "duration"\n    ctx_kind[cid] = \n\nconcepts, values, periods = [], [], []\nfor el in root:\n    if el.tag.startswith("{http://fasb.org/us-gaap"):\n        # TULIS KODEMU: nama lokal concept\n        concepts.append()\n        # TULIS KODEMU: nilai integer\n        values.append()\n        # TULIS KODEMU: jenis period dari contextRef\n        periods.append()\n\nprint(f"concepts={concepts}")\nprint(f"values={values}")\nprint(f"periods={periods}")`,
        lockLines: 23,
        solution: `import xml.etree.ElementTree as ET\n\nxbrl_snippet = """<xbrl xmlns="http://www.xbrl.org/2003/instance"\n  xmlns:us-gaap="http://fasb.org/us-gaap/2024"\n  xmlns:iso4217="http://www.xbrl.org/2003/iso4217">\n  <context id="c1">\n    <entity><identifier scheme="http://www.sec.gov/CIK">0000320187</identifier></entity>\n    <period><startDate>2023-10-01</startDate><endDate>2024-09-28</endDate></period>\n  </context>\n  <context id="c2">\n    <entity><identifier scheme="http://www.sec.gov/CIK">0000320187</identifier></entity>\n    <period><instant>2024-09-28</instant></period>\n  </context>\n  <unit id="u1"><measure>iso4217:USD</measure></unit>\n  <us-gaap:Revenues contextRef="c1" unitRef="u1" decimals="-6">391035000000</us-gaap:Revenues>\n  <us-gaap:Assets contextRef="c2" unitRef="u1" decimals="-6">364980000000</us-gaap:Assets>\n</xbrl>"""\n\nNS = "{http://www.xbrl.org/2003/instance}"\nroot = ET.fromstring(xbrl_snippet)\n\n# Petakan context id -> jenis period\nctx_kind = {}\nfor ctx in root.findall(f"{NS}context"):\n    cid = ctx.get("id")\n    period = ctx.find(f"{NS}period")\n    ctx_kind[cid] = "instant" if period.find(f"{NS}instant") is not None else "duration"\n\nconcepts, values, periods = [], [], []\nfor el in root:\n    if el.tag.startswith("{http://fasb.org/us-gaap"):\n        concepts.append(el.tag.split("}")[1])\n        values.append(int(el.text))\n        periods.append(ctx_kind[el.get("contextRef")])\n\nprint(f"concepts={concepts}")\nprint(f"values={values}")\nprint(f"periods={periods}")`,
        checks: [
          { kind: "equal", task: "t1", name: "concepts", value: ["Revenues", "Assets"], label: "`concepts` tepat", msg: "Dua fakta: Revenues dan Assets (nama lokal, tanpa prefix namespace)." },
          { kind: "equal", task: "t2", name: "values", value: [391035000000, 364980000000], label: "`values` tepat", msg: "Revenues = 391.035.000.000, Assets = 364.980.000.000." },
          { kind: "equal", task: "t3", name: "periods", value: ["duration", "instant"], label: "`periods` tepat", msg: "Revenues = duration (film), Assets = instant (foto)." },
          { kind: "stdout_matches", task: "t4", pattern: "concepts=\\['Revenues', 'Assets'\\]", label: "`print` menampilkan concepts", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "periods=\\['duration', 'instant'\\]", label: "`print` menampilkan periods", msg: "Baris terakhir: periods=['duration', 'instant']." },
        ],
      },
      reference: "Bedah instance = pecah tag jadi concept + petakan context jadi jenis period.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 8 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 PDF menjawab 'berapa angkanya', XBRL menjawab 'berapa, apa, kapan, dalam satuan apa, dari siapa'. Empat jawaban tambahan itulah yang membuat analis mesin 1000x lebih cepat — bukan karena mesinnya pintar, tapi karena pertanyaannya sudah dijawab oleh emiten di dalam label.",
        "💡 decimals bukan hiasan. Analis yang mengabaikannya akan mengira '391035' berarti tiga ratus ribu — padahal dengan decimals='-6' ia berarti 391 miliar yang dibulatkan. Di PDF, informasi yang sama bersembunyi di header 'in millions'. XBRL memaksanya eksplisit.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: label adalah kontrak",
        body: "Bayangkan setiap angka laporan keuangan menandatangani kontrak: 'saya adalah Revenues, untuk periode ini, dalam satuan ini, dari entitas ini'. PDF adalah kontrak lisan — bisa disalahdengar (salah kolom, salah tahun). XBRL adalah kontrak tertulis yang ditandatangani emiten dan bisa diverifikasi mesin. Seluruh track ini pada dasarnya tentang membaca kontrak tertulis, bukan mendengar kabar burung.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kapan pakai XBRL, kapan cukup PDF",
      prose: [
        "XBRL bukan jawaban untuk semua kebutuhan. Peta ini membantumu memilih alat yang tepat — salah pilih berarti kerja sia-sia atau, lebih buruk, angka yang salah dengan percaya diri.",
        "Skenario 1 — Butuh 3 angka satu emiten untuk presentasi besok. Kondisi: satu laporan tahunan, deadline dekat. Keputusan: buka PDF / viewer XBRL, baca manual. Menulis parser untuk 3 angka adalah over-engineering.",
        "Skenario 2 — Butuh deret revenue 20 emiten selama 10 tahun. Kondisi: analisis komparatif lintas emiten. Keputusan: XBRL via API (EDGAR). Copy-paste 200 tabel = 600 jam; skrip = 60 detik + waktu verifikasi.",
        "Skenario 3 — Butuh angka emiten Indonesia untuk model. Kondisi: filing IDX hanya ada PDF/XLS publik. Keputusan: baca PDF/XLS + petakan manual ke skema kanonismu (pelajaran FDP6). Jangan menunggu API IDX yang tidak ada.",
        "Skenario 4 — Angka 'hilang' dari hasil API. Kondisi: concept yang dicari tidak ketemu. Keputusan: cek dulu apakah emiten memakai tag kustom (extension) — buka viewer filing-nya, cari posnya, catat tag aslinya. Baru putuskan fallback concept (FDP5).",
        "Aturan praktis 10 detik: satu-dua angka → baca manual. Puluhan angka berulang → XBRL. Emiten Indonesia → PDF + pemetaan manual ke skema yang sama.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira 'XBRL = otomatis benar'. XBRL hanya memindahkan kejujuran emiten ke format mesin — kalau emiten salah men-tag (terjadi!), mesin akan salah dengan efisien. Itulah kenapa track ini diakhiri dengan rekonsiliasi: mesin memungut, manusia memverifikasi.",
      },
      reference: "Sedikit angka → manual. Banyak angka berulang → XBRL. IDX → PDF + pemetaan manual.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: jebakan 'in millions'",
      prose: [
        "Dua analis membaca emiten yang sama. Analis PDF melihat tabel dengan header 'in millions' dan baris Revenue: 391,035. Ia mencatat revenue = 391.035 (tiga ratus sembilan puluh satu ribu). Analis XBRL membaca fakta: nilai 391035000000, unit USD, decimals='-6'.",
        "Hitung: berapa revenue sebenarnya dalam USD penuh menurut analis XBRL? Dan berapa kali lipat kesalahan analis PDF bila ia memakai 391.035 sebagai dolar penuh? (Petunjuk: decimals='-6' berarti nilai sudah dalam satuan penuh, dibulatkan ke jutaan — tidak perlu dikali lagi.)",
        "Interpretasi: inilah kenapa 'in millions' di PDF adalah jebakan abadi analis junior, dan kenapa XBRL menyatakannya eksplisit lewat decimals. Satu header yang terlewat = kesalahan 1.000.000x.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `revenue_benar` (USD penuh) dari fakta XBRL" },
        { id: "t2", text: "Hitung `faktor_salah` = revenue_benar / 391035 (angka mentah analis PDF)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "revenue_benar=391035000000 | faktor_salah=1000000.0x",
      hints: [
        "revenue_benar = 391035000000 (nilai fakta sudah dalam USD penuh).",
        "faktor_salah = revenue_benar / 391035.",
        "Format: f\"revenue_benar={revenue_benar}\" dan f\"faktor_salah={faktor_salah}x\"",
      ],
      code: {
        starter: `# Mini-case: jebakan "in millions"\n# Fakta XBRL: nilai=391035000000, unit=USD, decimals="-6"\n# Analis PDF mencatat: 391035 (mengira dolar penuh)\n\n# TULIS KODEMU\nrevenue_benar = \nfaktor_salah = \n\nprint(f"revenue_benar={revenue_benar}")\nprint(f"faktor_salah={faktor_salah}x")`,
        lockLines: 5,
        solution: `# Mini-case: jebakan "in millions"\n# Fakta XBRL: nilai=391035000000, unit=USD, decimals="-6"\n# Analis PDF mencatat: 391035 (mengira dolar penuh)\n\n# TULIS KODEMU\nrevenue_benar = 391035000000\nfaktor_salah = revenue_benar / 391035\n\nprint(f"revenue_benar={revenue_benar}")\nprint(f"faktor_salah={faktor_salah}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "revenue_benar", value: 391035000000, tol: 1, label: "`revenue_benar` = 391.035.000.000", msg: "Nilai fakta sudah dalam USD penuh; decimals hanya menyatakan presisi." },
          { kind: "equal", task: "t2", name: "faktor_salah", value: 1000000.0, tol: 1e-6, label: "`faktor_salah` = 1.000.000x", msg: "391.035.000.000 / 391.035 = 1.000.000. Satu header terlewat = sejuta kali lipat." },
          { kind: "stdout_matches", task: "t3", pattern: "revenue_benar=391035000000", label: "`print` menampilkan revenue", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "decimals = presisi, bukan skala. 'in millions' di PDF = decimals implisit yang mudah terlewat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Taksonomi = kamus resmi (apa yang boleh dikatakan); instance = surat bertag (angka + label).",
        "Satu fakta XBRL = concept + context (period + entity) + unit + nilai (± presisi decimals).",
        "instant = foto pada satu tanggal (stock); duration = film satu rentang (flow).",
        "us-gaap vs IDX: logika sama, kosakata beda. EDGAR bisa ditarik programatik; IDX = kamus + benchmark (instance bulk tidak publik).",
        "decimals menyatakan presisi, bukan skala — 'in millions' di PDF adalah jebakan sejuta kali lipat.",
      ],
      next: { label: "FDP2 — EDGAR API: Menarik Fakta Tanpa API Key", href: "/v2/learn/fdp2-edgar" },
      quiz: [
        {
          q: "Apa beda taksonomi dan instance document?",
          options: [
            { text: "Taksonomi mendefinisikan kosakata yang boleh dipakai; instance berisi fakta (nilai + label) yang memakai kosakata itu", why: "Tepat: kamus vs surat. Emiten menulis instance memakai concept dari taksonomi.", correct: true },
            { text: "Instance lebih baru dari taksonomi", why: "Bukan soal versi waktu. Satu taksonomi dipakai oleh ribuan instance dari banyak emiten dan tahun." },
            { text: "Tidak ada bedanya, dua nama untuk hal yang sama", why: "Berbeda peran: tanpa taksonomi, label di instance tidak punya definisi resmi." },
            { text: "Taksonomi adalah PDF-nya, instance adalah spreadsheet-nya", why: "Keduanya bukan soal format tampilan. Taksonomi = kamus kosakata resmi; instance = fakta berlabel yang memakai kosakata itu." }
          ],
        },
        {
          q: "Fakta 'us-gaap:Assets = 364.980.000.000, instant 2024-09-28, USD' — komponen mana yang menjawab 'kapan'?",
          options: [
            { text: "decimals", why: "Decimals menjawab presisi angka, bukan waktu." },
            { text: "concept (us-gaap:Assets)", why: "Concept menjawab 'apa', bukan 'kapan'." },
            { text: "unit (USD)", why: "Unit menjawab 'dalam satuan apa', bukan 'kapan'." },
            { text: "context — bagian period (instant 2024-09-28)", why: "Tepat: context membawa period (kapan) dan entity (siapa).", correct: true }
          ],
        },
        {
          q: "Kenapa 'total aset' harus ber-period instant, bukan duration?",
          options: [
            { text: "Karena nilainya selalu lebih besar dari revenue", why: "Besar-kecil nilai tidak menentukan jenis period." },
            { text: "Karena aset adalah posisi pada satu titik waktu (stock), bukan akumulasi satu rentang", why: "Tepat: foto vs film. Menjumlahkan instant antar kuartal tidak bermakna — seperti menumpuk empat foto dan mengira jadi film.", correct: true },
            { text: "Karena SEC melarang duration untuk neraca", why: "Bukan larangan arbitrer — ini konsekuensi logis dari makna akuntansinya." },
            { text: "Tidak harus — boleh saja pakai duration", why: "Salah: duration untuk stock menghasilkan angka ganda yang menyesatkan." }
          ],
        },
        {
          q: "Pernyataan jujur tentang data IDX untuk pipeline programatik:",
          options: [
            { text: "Data IDX tidak bisa dipakai sama sekali untuk pipeline", why: "Terlalu pesimis: taksonominya bisa dipetakan dan angka terverifikasinya jadi benchmark rekonsiliasi." },
            { text: "Instance XBRL semua emiten IDX bisa diunduh massal gratis seperti EDGAR", why: "Salah — inilah batasan kerasnya: instance per emiten tidak tersedia untuk bulk download publik." },
            { text: "Taksonomi IDX publik (bisa dipelajari), tapi instance bulk tidak tersedia publik dan situsnya memblokir request otomatis polos", why: "Tepat: kamusnya terbuka, gudangnya tidak. Makanya track ini memakai EDGAR untuk latihan tarik data dan IDX untuk pemetaan + benchmark.", correct: true },
            { text: "IDX tidak punya taksonomi XBRL sama sekali", why: "Salah: IDX Taxonomy 2014/2020 ada dan publik; XBRL wajib via IDXnet sejak 2 Nov 2015." }
          ],
        },
        {
          q: "Fakta bernilai 391035, unit USD, decimals='-6'. Analis mencatat '391.035 dolar'. Kesalahannya?",
          options: [
            { text: "Salah karena harus dikali 1.000.000 lagi", why: "Tidak perlu dikali: 391035000000 SUDAH nilai penuhnya. Yang salah adalah membaca 391035 sebagai nilai penuh." },
            { text: "Salah karena USD harus dikonversi dulu ke rupiah", why: "Konversi mata uang soal lain; kesalahan di sini murni soal presisi vs skala." },
            { text: "Tidak ada — 391035 memang tiga ratus sembilan puluh satu ribu", why: "Salah: decimals='-6' berarti nilai dibulatkan ke jutaan — angka penuhnya 391.035.000.000." },
            { text: "Salah sejuta kali lipat: nilai sebenarnya 391.035.000.000 dolar (dibulatkan ke jutaan)", why: "Tepat: decimals menyatakan presisi, bukan skala. Nilai fakta sudah dalam satuan penuh.", correct: true }
          ],
        },
      ],
    },
  ],
};
