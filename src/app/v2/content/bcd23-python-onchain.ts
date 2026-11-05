import type { V2Lesson } from "../lib/types";

// ── Figure: peel chain (ilustrasi pola) ──────────────────────────────────
const PEEL_SVG = `<svg viewBox="0 0 620 240" role="img" aria-label="Rantai peel: A ke B 10, B ke C 9,6, C ke D 9,2, D ke F 9,1 (ilustrasi)">
<g font-family="var(--font-ui)" text-anchor="middle">
<g fill="var(--c1)"><circle cx="80" cy="110" r="30"/><circle cx="220" cy="110" r="30"/><circle cx="360" cy="110" r="30"/><circle cx="500" cy="110" r="30"/></g>
<g fill="#fff" font-size="16" font-weight="700"><text x="80" y="116">A</text><text x="220" y="116">B</text><text x="360" y="116">C</text><text x="500" y="116">D</text></g>
<g stroke="var(--chart-grid)" stroke-width="2" marker-end="url(#ph)"><defs><marker id="ph" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/></marker></defs><line x1="112" y1="110" x2="186" y2="110"/><line x1="252" y1="110" x2="326" y2="110"/><line x1="392" y1="110" x2="466" y2="110"/></g>
<g fill="var(--chart-text)" font-size="13"><text x="149" y="95">10,0</text><text x="289" y="95">9,6</text><text x="429" y="95">9,2</text></g>
<g fill="var(--text-muted)" font-size="11"><text x="310" y="30">peel chain: tiap hop sedikit mengecil — sisa "dikupas" ke alamat perubahan</text><text x="310" y="180">deteksi = rantai dengan penurunan kecil berurutan (di lab: toleransi 0,5)</text></g></g></svg>`;

export const bcd23: V2Lesson = {
  slug: "bcd23-python-onchain",
  track: "Blockchain Data Scientist",
  module: "Tooling Analis",
  title: "BCD23 — Python untuk Analisis On-Chain: Saat Query SQL Tidak Cukup",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan model data on-chain (UTXO vs account-based) dan kenapa ia istimewa dibanding data bursa; (2) menjalankan workflow analis lengkap — ambil data blok, parsing event, agregasi per alamat, sampai metrik arus dana; (3) memutuskan KAPAN Python mengalahkan SQL (graf, heuristik, data tak terstruktur) dan kapan SQL tetap menang; (4) mendeteksi pola peel chain dan mengelompokkan alamat menjadi entitas dengan heuristik; (5) menyebut batas heuristik — kapan clustering salah dan kenapa false positive berbahaya di kasus compliance.",
        "Rutenya: cerita dompet misterius → empat konsep inti (model data, workflow, Python vs SQL, heuristik entitas) → lab Pyodide (arus neto, rantai peel, ringkasan entitas di atas data sintetis) → diagram peel chain dengan panduan baca → peta keputusan → mini-case investigasi exchange → kuis → rangkuman. Estimasi 65 menit; lab-nya ±15 menit.",
        "Satu batas di awal: lesson ini tentang TEKNIK analisis — bukan cara melacak orang sungguhan. Semua alamat di sini sintetis. Di dunia nyata, analisis on-chain yang menyentuh identitas tunduk pada aturan privasi dan prosedur hukum — dan kesimpulan heuristik tidak pernah 100% pasti.",
      ],
      tasks: [],
      reference: "Lima konsep: model data → workflow → Python vs SQL → heuristik entitas → batas heuristik.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Dompet terbesar yang ternyata bukan siapa-siapa",
      prose: [
        "Dinda, analis data di sebuah exchange kripto Jakarta, diminta menjawab pertanyaan direksi: “Siapa whale terbesar di platform kita bulan ini?” Query SQL-nya rapi: GROUP BY alamat, SUM masuk, ORDER BY DESC. Jawabannya muncul dalam 2 detik — alamat 0x7F… dengan arus masuk Rp48 miliar. Direksi mengangguk. Laporan dikirim.",
        "Seminggu kemudian tim compliance menelepon panik: alamat yang sama muncul di daftar pantauan internal. Dinda menyelidiki lebih dalam — kali ini dengan Python, bukan SQL. Ia menarik GRAF transaksinya: 0x7F… menerima ratusan transfer kecil dari alamat-alamat yang semuanya didanai oleh SATU alamat induk yang sama — dompet panas (hot wallet) exchange mereka sendiri. “Whale terbesar” itu bukan pelanggan. Itu cermin: dana internal yang berputar-putar antar dompet operasional.",
        "Twist-nya: query agregasi menjawab “alamat mana yang terbesar” dengan benar secara matematis — tetapi pertanyaannya salah. Yang direksi butuhkan bukan alamat, melainkan ENTITAS. Dan entitas tidak bisa dihitung dengan GROUP BY: ia harus dibangun dari hubungan antar-alamat — graf, heuristik, dan sedikit kecurigaan yang sehat. Itulah wilayah Python.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: SQL menjawab pertanyaan tentang BARIS (berapa total per alamat); Python menjawab pertanyaan tentang HUBUNGAN (alamat mana yang sebenarnya satu pemilik). Pertanyaan bisnis hampir selalu tentang hubungan.",
      ],
      reference: "Pelajaran cerita: agregasi per alamat ≠ analisis entitas. Entitas dibangun dari graf, bukan GROUP BY.",
    },
    {
      id: "model-data",
      eyebrow: "Langkah 3 · Konsep",
      title: "Model Data On-Chain — Si Buku Kas Publik",
      prose: [
        "Definisi: blockchain adalah buku kas publik yang append-only — setiap transfer tercatat selamanya sebagai (pengirim, penerima, jumlah, blok). Dua model dominan: UTXO (Bitcoin — “koin” sebagai output transaksi yang belum dibelanjakan, seperti uang tunai pecahan) dan account-based (Ethereum — setiap alamat punya SALDO, seperti rekening bank). Analis harus tahu modelnya karena cara menghitung “saldo” dan “arus” berbeda: di UTXO kamu menjumlahkan output yang belum terpakai; di account-based kamu membaca state saldo per blok.",
        "Kepribadiannya: blockchain adalah buku kas yang jujur TAPI anonim — ia mencatat setiap rupiah yang bergerak dengan presisi sempurna, tetapi tidak pernah menulis NAMA pemiliknya. Kejujuran tanpa identitas: mimpi buruk akuntan, surga analis — asal kamu tahu cara memberi nama pada yang tak bernama (itulah heuristik entitas di langkah 6).",
        "Tiga sifat yang membuatnya istimewa dibanding data bursa: (1) lengkap — seluruh sejarah tersedia, tidak ada “data hilang karena retensi”; (2) final — begitu terkonfirmasi, tidak bisa diedit diam-diam; (3) terbuka — siapa pun bisa memverifikasi ulang analisismu. Konsekuensinya: analis on-chain yang baik selalu bisa menunjukkan JEJAK perhitungannya — dan analis yang tidak bisa, patut dicurigai.",
        "Kapan memakai pemahaman ini: sebelum menulis satu baris kode pun, tanyakan “model datanya apa?” — karena salah model = salah hitung. Contoh klasik: menghitung “volume” di UTXO dengan menjumlahkan semua output akan menggandakan hitungan (output yang sama muncul sebagai input transaksi berikutnya). Di lab lesson ini kita memakai model sederhana account-based: tiap transfer = (pengirim, penerima, jumlah).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data on-chain = data yang sudah bersih”",
        type: "pitfall",
        body: "Yang benar: data on-chain LENGKAP, bukan BERSIH. Ia penuh dengan noise operasional: transfer internal exchange (seperti di cerita), dusting attack (ribuan transfer receh untuk menandai alamat), dan wash trading. Langkah pertama analis bukanlah menghitung — melainkan MEMBUANG: filter transfer internal, kenali pola dusting, pisahkan ekonomi riil dari sirkulasi internal. Agregasi sebelum filtering = angka besar yang tidak berarti apa-apa.",
      },
      hints: [
        "💡 Intuisi: perlakukan blockchain seperti CCTV jalan raya — ia merekam semua mobil dengan sempurna, tetapi tidak memberitahumu mana mobil pribadi, mana armada taksi, dan mana mobil yang sama bolak-balik. Mengelompokkan “mobil yang sama” adalah pekerjaan heuristik.",
      ],
      reference: "UTXO (Bitcoin) vs account-based (Ethereum). Lengkap, final, terbuka — tapi penuh noise operasional.",
    },
    {
      id: "workflow",
      eyebrow: "Langkah 4 · Konsep",
      title: "Workflow Analis — Dari Blok ke Insight",
      prose: [
        "Workflow baku ada empat tahap. (1) AMBIL: tarik data dari node/arsip (atau dataset terstruktur — di lab ini datanya sudah tertanam). (2) PARSING: ubah log mentah menjadi tabel transfer (pengirim, penerima, jumlah, blok/waktu) — di sinilah event log smart contract di-decode. (3) AGREGASI: hitung per alamat — total masuk, total keluar, arus neto, jumlah transaksi, alamat lawan. (4) ENTITAS & METRIK: gabungkan alamat menjadi entitas, hitung metrik arus dana (konsentrasi, retensi, kecepatan).",
        "Metrik kuncinya — arus neto per alamat: net(a) = masuk(a) − keluar(a). Alamat dengan net positif besar = akumulator (menimbun); net negatif besar = distributor (menyebar). Lalu konsentrasi: pangsa entitas terbesar = |net terbesar| / total masuk. Konsentrasi tinggi = sedikit pihak mengendalikan arus — sinyal risiko (untuk exchange: ketergantungan pada sedikit market maker; untuk investigasi: titik intervensi).",
        "Kepribadiannya: workflow ini seperti kerja detektif — 80% waktunya dihabiskan di tahap 1–2 (membersihkan dan memahami data), 20% di tahap 3–4 (yang terlihat keren di laporan). Analis junior ingin langsung ke metrik; analis senior tahu metrik dari data kotor adalah kebohongan yang rapi.",
      ],
      formula: String.raw`\mathrm{net}(a) = \sum \mathrm{masuk}(a) - \sum \mathrm{keluar}(a)`,
      formulaNote: "net(a) = arus neto alamat a; Σmasuk(a) = total semua transfer yang diterima a; Σkeluar(a) = total semua transfer yang dikirim a. Contoh dari lab: alamat B menerima 10,0 + 5,0 dan mengirim 9,6 → net(B) = 15,0 − 9,6 = 5,4 (akumulator kecil). Interpretasi: tanda net menunjukkan PERAN — positif = menimbun, negatif = menyebar, mendekati nol = perantara (pass-through).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Makin banyak data on-chain makin bagus analisisnya”",
        type: "pitfall",
        body: "Yang benar: on-chain memberi SELURUH sejarah — dan sebagian besarnya tidak relevan dengan pertanyaanmu. Menarik 3 tahun data untuk menjawab “arus minggu ini” hanya menambah biaya komputasi dan noise. Praktik yang benar: batasi jendela waktu dan himpunan alamat RELEVAN dulu (berdasarkan pertanyaan), baru perdalam. Data lake tanpa pertanyaan = kuburan yang mahal.",
      },
      hints: [
        "💡 Intuisi: net(a) ≈ neraca kas alamat itu. Seperti membaca rekening koran: yang masuk dikurangi yang keluar memberitahumu apakah ia menabung, berbelanja, atau sekadar lewat.",
      ],
      reference: "Empat tahap: ambil → parsing → agregasi → entitas & metrik. 80% kerja di dua tahap pertama.",
    },
    {
      id: "python-vs-sql",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan Python Mengalahkan SQL — Si Tukang Graf",
      prose: [
        "Aturan praktisnya sederhana. SQL menang untuk: agregasi per alamat/entitas yang SUDAH terdefinisi, filter rentang waktu, join dengan label yang sudah ada — semua yang berbentuk “hitung X per Y”. Python menang untuk: (1) ANALISIS GRAF — mengikuti rantai transfer hop demi hop (seperti peel chain di lab), yang di SQL butuh recursive CTE yang lambat dan menyakitkan; (2) HEURISTIK — aturan “jika A maka B” yang bercabang (clustering, deteksi pola); (3) DATA TAK TERSTRUKTUR — parsing event log, ABI decoding, teks.",
        "Kepribadiannya: SQL adalah akuntan yang rapi — cepat, tepat, tapi hanya menjawab pertanyaan yang strukturnya sudah jelas. Python adalah detektif lapangan — lebih lambat untuk hal sederhana, tetapi satu-satunya yang bisa mengikuti jejak yang berbelok-belok. Analis on-chain profesional memakai keduanya: SQL untuk menyaring lautan menjadi kolam, Python untuk menyelami kolamnya.",
        "Contoh konkret dari cerita Dinda: query “top alamat by volume” = SQL, 2 detik, jawaban salah-arah. Pertanyaan lanjutannya — “alamat-alamat ini didanai oleh siapa?” — butuh traversal graf mundur 3 hop + heuristik funding bersama = Python. Pelajaran umumnya: begitu pertanyaanmu mengandung kata “pola”, “rantai”, “jaringan”, atau “kelompok”, SQL sudah mencapai batasnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Analis on-chain modern tidak butuh SQL lagi”",
        type: "pitfall",
        body: "Yang benar: justru sebaliknya — SQL adalah gerbangnya. 90% pekerjaan dimulai dengan query agregasi untuk menemukan APA yang menarik (anomali volume, alamat baru yang besar), baru 10% dilanjutkan Python untuk MENGAPA-nya. Analis yang hanya bisa Python akan tenggelam menarik data mentah; analis yang hanya bisa SQL akan berhenti di permukaan. Lowongan Kraken/Glassnode mensyaratkan keduanya bukan tanpa alasan.",
      },
      hints: [
        "💡 Intuisi: SQL = jaring pukat (menangkap banyak ikan cepat); Python = kail pancing (menangkap ikan yang spesifik, satu per satu, dengan umpan yang tepat). Kamu butuh keduanya untuk makan malam yang layak.",
      ],
      reference: "SQL: agregasi & filter. Python: graf, heuristik, data tak terstruktur. Alur kerja: SQL menyaring, Python menyelami.",
    },
    {
      id: "heuristik",
      eyebrow: "Langkah 6 · Konsep",
      title: "Heuristik Entitas — Memberi Nama pada yang Tak Bernama",
      prose: [
        "Definisi: heuristik entitas adalah aturan praktis untuk menebak alamat-alamat mana yang dikendalikan pihak yang sama. Dua yang paling terkenal: (1) common-input-ownership (UTXO): semua input dalam satu transaksi diasumsikan milik satu pemilik — karena butuh private key masing-masing untuk menandatanganinya; (2) change-address: output “kembalian” yang kembali ke pengirim menandai alamat miliknya sendiri. Ditambah heuristik perilaku: alamat-alamat yang didanai oleh satu sumber dalam waktu berdekatan kemungkinan satu operator.",
        "Peel chain — pola khas yang kamu deteksi di lab: satu alamat mengirim jumlah besar ke alamat baru, menyimpan sedikit sebagai “kembalian” (peel), lalu mengulanginya — A→B (10,0), B→C (9,6), C→D (9,2). Pola ini muncul di wallet operasional exchange DAN di pencucian dana — kontekslah yang membedakan, bukan polanya. Aturan deteksi lab: rantai dengan penurunan kecil berurutan (toleransi 0,5).",
        "Batas heuristik — dan ini PENTING: heuristik adalah tebakan berpendidikan, bukan bukti. CoinJoin (banyak pemilik dalam satu transaksi) MEMATAHKAN common-input-ownership. Alamat exchange yang dipakai bersama jutaan pengguna membuat “satu alamat = satu entitas” pun salah arah. Di kasus compliance, kesimpulan heuristik tanpa verifikasi independen = tuduhan yang bisa menghancurkan orang yang salah. Aturan profesional: laporkan TINGKAT KEYAKINAN, bukan kepastian.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Kalau grafnya terhubung, pasti satu orang”",
        type: "pitfall",
        body: "Yang benar: keterhubungan graf ≠ kepemilikan bersama. Satu transaksi CoinJoin menghubungkan puluhan pemilik yang tidak saling kenal; satu alamat deposit exchange dipakai jutaan pengguna. Heuristik memberi HIPOTESIS (“kemungkinan satu operator”), bukan VONIS. Analis yang menulis “alamat X milik orang Y” berdasarkan satu heuristik sedang melakukan hal yang di dunia nyata bisa menjadi fitnah.",
      },
      hints: [
        "💡 Intuisi: heuristik seperti mengenali tulisan tangan — dua surat dengan tulisan mirip KEMUNGKINAN dari orang yang sama, tetapi bisa juga dari dua orang yang belajar di sekolah yang sama. Kamu butuh bukti kedua sebelum menuduh.",
      ],
      reference: "Heuristik: common-input, change address, funding bersama. Selalu sertakan tingkat keyakinan; verifikasi independen untuk kasus compliance.",
    },
    {
      id: "lab-onchain",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab — Arus neto, peel chain, dan ringkasan entitas",
      prose: [
        "Waktunya jadi Dinda versi Python. Di bawah ada 9 transfer SINTETIS antar alamat A–H (bukan data blockchain asli). Tugasmu: tulis tiga fungsi — `net_flow(tx)` (dict alamat → arus neto = terima − kirim), `peel_chain(tx, max_drop=0.5)` (rantai alamat terpanjang dengan penurunan jumlah kecil berurutan), dan `entity_summary(net)` (total arus masuk, alamat dengan |net| terbesar, jumlah alamat) — lalu cetak ringkasannya.",
        "Coba: setelah lolos, ubah `max_drop=0.5` menjadi `0.05`. Rantai apa yang tersisa — dan apa artinya untuk trade-off deteksi (toleransi longgar = rantai panjang tapi mungkin noise; toleransi ketat = presisi tapi rantai terpotong)? Lalu tambahkan satu transfer fiktif (\"X\", \"A\", 50.0) dan lihat bagaimana `top_addr` berubah — simulasi whale baru muncul.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `net_flow(tx)`: untuk tiap (pengirim, penerima, jumlah): kurangi pengirim, tambahkan penerima" },
        { id: "t2", text: "Lengkapi `peel_chain(tx, max_drop=0.5)`: dari tiap alamat, ikuti edge keluar terbesar yang jumlahnya menurun ≤ max_drop; kembalikan rantai terpanjang" },
        { id: "t3", text: "Lengkapi `entity_summary(net)`: total arus masuk (jumlah net positif), alamat dengan |net| terbesar, jumlah alamat" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan tercetak: net B, panjang rantai, dan alamat terbesar" },
      ],
      expected: "net_B=5.4  rantai=5  top=A(-13.0)",
      hints: [
        "💡 `net` adalah dict: inisialisasi dengan `net.get(alamat, 0.0)` sebelum menambah/mengurangi.",
        "💡 Untuk peel chain: bangun dict `keluar` (pengirim → list (penerima, jumlah)), lalu dari tiap alamat ikuti edge yang memenuhi syarat penurunan.",
      ],
      code: {
        starter: `# 9 transfer sintetis: (pengirim, penerima, jumlah, blok)
TX = [
    ("A", "B", 10.0, 101),
    ("B", "C", 9.6, 102),
    ("C", "D", 9.2, 103),
    ("E", "B", 5.0, 104),
    ("D", "F", 9.1, 105),
    ("G", "H", 2.0, 106),
    ("H", "G", 1.9, 107),
    ("A", "F", 3.0, 108),
    ("F", "E", 4.0, 109),
]

# TULIS KODEMU
def net_flow(tx):
    net = 

def peel_chain(tx, max_drop=0.5):
    rantai = 

def entity_summary(net):
    ringkasan = 

net = net_flow(TX)
rantai = peel_chain(TX)
ringkasan = entity_summary(net)
print(f"net_B={net['B']:.1f}  rantai={len(rantai)}  top={ringkasan['top_addr']}({net[ringkasan['top_addr']]:.1f})")`,
        lockLines: 13,
        solution: `# 9 transfer sintetis: (pengirim, penerima, jumlah, blok)
TX = [
    ("A", "B", 10.0, 101),
    ("B", "C", 9.6, 102),
    ("C", "D", 9.2, 103),
    ("E", "B", 5.0, 104),
    ("D", "F", 9.1, 105),
    ("G", "H", 2.0, 106),
    ("H", "G", 1.9, 107),
    ("A", "F", 3.0, 108),
    ("F", "E", 4.0, 109),
]

# TULIS KODEMU
def net_flow(tx):
    net = {}
    for s, r, a, _b in tx:
        net[s] = round(net.get(s, 0.0) - a, 1)
        net[r] = round(net.get(r, 0.0) + a, 1)
    return net

def peel_chain(tx, max_drop=0.5):
    keluar = {}
    for s, r, a, _b in tx:
        keluar.setdefault(s, []).append((r, a))
    terbaik = []
    for awal in keluar:
        rantai = [awal]
        kini, jml = awal, None
        while True:
            kandidat = [(r, a) for r, a in keluar.get(kini, [])
                        if (jml is None or (a < jml and jml - a <= max_drop))
                        and r not in rantai]
            if not kandidat:
                break
            r, a = max(kandidat, key=lambda x: x[1])
            rantai.append(r)
            jml, kini = a, r
        if len(rantai) > len(terbaik):
            terbaik = rantai
    return terbaik

def entity_summary(net):
    total_masuk = round(sum(v for v in net.values() if v > 0), 1)
    top = max(net, key=lambda k: abs(net[k]))
    return {"total_in": total_masuk, "top_addr": top, "n_addr": len(net)}

net = net_flow(TX)
rantai = peel_chain(TX)
ringkasan = entity_summary(net)
print(f"net_B={net['B']:.1f}  rantai={len(rantai)}  top={ringkasan['top_addr']}({net[ringkasan['top_addr']]:.1f})")`,
        checks: [
          { kind: "equal", task: "t1", name: "net", value: {"A": -13.0, "B": 5.4, "C": 0.4, "D": 0.1, "E": -1.0, "F": 8.1, "G": -0.1, "H": 0.1}, label: "`net_flow` menghitung arus neto semua alamat", msg: "Terima − kirim per alamat. B: 10,0+5,0−9,6 = 5,4." },
          { kind: "equal", task: "t2", name: "rantai", value: ["A", "B", "C", "D", "F"], label: "`peel_chain` menemukan rantai A→B→C→D→F", msg: "Penurunan tiap hop ≤ 0,5: 10,0→9,6→9,2→9,1." },
          { kind: "equal", task: "t3", name: "ringkasan", value: {"total_in": 14.1, "top_addr": "A", "n_addr": 8}, label: "`entity_summary` benar", msg: "Total masuk 14,1; |net| terbesar = A (13,0); 8 alamat." },
          { kind: "stdout_matches", task: "t4", pattern: "net_B=5\\.4\\s+rantai=5\\s+top=A\\(-13\\.0\\)", label: "`print` menampilkan ringkasan", msg: "Format: net_B=...  rantai=...  top=...(...)." },
        ],
      },
      reference: "net = terima − kirim. Peel chain = penurunan kecil berurutan. Konsentrasi = |net| terbesar / total masuk.",
    },
    {
      id: "chart-peel",
      eyebrow: "Langkah 8 · Visual",
      title: "Membaca diagram peel chain",
      prose: [
        "Cara membaca: tiap lingkaran = alamat; panah = transfer dengan jumlahnya di atas garis. Interpretasi: rantai A→B→C→D menunjukkan pola peel klasik — jumlah “dikupas” sedikit di tiap hop (10,0 → 9,6 → 9,2 → 9,1): ciri dompet operasional yang memecah dana, BUKAN empat pemilik berbeda. Analis yang menghitung “4 alamat aktif” dari data ini sedang menghitung bayangan, bukan orang.",
        "Batas visual ini: diagram hanya menampilkan SATU rantai yang terdeteksi — ia tidak membuktikan keempat alamat milik satu entitas (ingat batas heuristik di langkah 6). Gunakan sebagai hipotesis awal investigasi, lalu verifikasi dengan heuristik kedua (mis. waktu transaksi berdekatan, funding bersama).",
      ],
      figure: {
        svg: PEEL_SVG,
        alt: "Diagram rantai peel: A ke B 10, B ke C 9,6, C ke D 9,2.",
        caption: "Peel chain hasil lab (ilustrasi pola). Penurunan kecil berurutan = ciri dompet operasional.",
      },
      tasks: [],
      reference: "Visual: lingkaran = alamat, panah = transfer. Peel = kupasan kecil berurutan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta Keputusan",
      title: "Peta keputusan: SQL, Python, atau keduanya?",
      prose: [
        "Skenario 1 — “Top 10 alamat by volume bulan ini”: PAKAI SQL. Agregasi sederhana, jawaban dalam detik. Syarat: kamu sadar jawabannya alamat, bukan entitas — sampaikan batasnya di laporan.",
        "Skenario 2 — “Ikuti dana dari alamat X sejauh 5 hop”: PAKAI PYTHON. Traversal graf; recursive CTE di SQL akan lambat dan sulit dibaca. Mulai dari SQL untuk mengambil subgraph relevan, lanjutkan Python untuk traversal.",
        "Skenario 3 — “Kelompokkan 10 ribu alamat menjadi entitas”: PAKAI PYTHON (heuristik clustering) — tetapi VALIDASI dengan sampel manual. Heuristik tanpa validasi = mesin fitnah otomatis.",
        "Skenario 4 — “Dashboard harian arus masuk/keluar exchange”: PAKAI SQL (+ scheduler). Pola berulang, definisi stabil — otomasi, bukan eksplorasi.",
        "Aturan 10 detik: pertanyaan tentang JUMLAH → SQL; tentang HUBUNGAN/POLA → Python; tentang KEPUTUSAN COMPLIANCE → keduanya + verifikasi manusia.",
      ],
      tasks: [],
      reference: "Jumlah → SQL. Hubungan/pola → Python. Compliance → keduanya + manusia.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: alarm palsu di meja Dinda",
      prose: [
        "Sebulan setelah insiden hot wallet, sistem monitoring Dinda membunyikan alarm: sebuah cluster 40 alamat mengirim total Rp12 miliar ke satu alamat baru dalam 2 jam. Heuristik funding bersama menandai mereka “satu entitas”. Tim compliance siap membekukan. Dinda menahan: ia memeriksa WAKTU — ke-40 alamat didanai 6 bulan lalu dari sumber berbeda, dan pola pengirimannya sinkron sempurna seperti script.",
        "Analisis Dinda: (1) funding TIDAK bersama (sumber berbeda, waktu berjauhan) → heuristik entitas LEMAH; (2) sinkronisitas sempurna + jumlah bulat → ciri BOT/otomasi, bukan satu pemilik manual — kemungkinan besar layanan payroll kripto atau batch payout merchant yang memakai banyak alamat; (3) keputusan: JANGAN bekukan atas dasar heuristik tunggal — eskalasi ke tim dengan permintaan verifikasi KYC merchant, sambil pantau.",
        "Dua minggu kemudian terkonfirmasi: itu payout batch sebuah payroll kripto berlisensi. Pembekuan akan menjadi insiden layanan. Pelajaran mini-case: heuristik yang benar pun bisa salah konteks — dan di compliance, biaya false positive (reputasi, hukum) sering lebih besar dari biaya investigasi tambahan.",
      ],
      tasks: [],
      reference: "Heuristik lemah + konteks salah = alarm palsu. Verifikasi sebelum tindakan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Blockchain = buku kas publik append-only; UTXO (Bitcoin) vs account-based (Ethereum) menentukan cara menghitung saldo & arus.",
        "Workflow: ambil → parsing → agregasi → entitas & metrik; 80% kerja di dua tahap pertama; filter noise SEBELUM agregasi.",
        "net(a) = terima − kirim; tanda menunjukkan peran (akumulator/distributor/perantara); konsentrasi = |net| terbesar / total masuk.",
        "SQL untuk jumlah & agregasi; Python untuk graf, heuristik, data tak terstruktur; alur umum: SQL menyaring, Python menyelami.",
        "Heuristik entitas (common-input, change address, funding bersama) = hipotesis, bukan vonis; sertakan tingkat keyakinan; CoinJoin & alamat bersama mematahkannya.",
        "Peel chain = penurunan kecil berurutan khas dompet operasional — polanya sama untuk exchange & pencucian dana; konteks yang membedakan.",
      ],
      quiz: [
        {
          q: "Mengapa query “top alamat by volume” Dinda memberi jawaban yang menyesatkan?",
          options: [
            { text: "Query-nya salah — seharusnya memakai Python dari awal", why: "Salah: query-nya benar untuk PERTANYAAN yang diajukan (top alamat). Masalahnya bukan tools, melainkan pertanyaannya: direksi butuh entitas, bukan alamat." },
            { text: "Agregasi per alamat tidak bisa melihat hubungan antar-alamat — hot wallet internal tampak sebagai whale", why: "Benar: GROUP BY menjawab “alamat mana terbesar” dengan tepat, tetapi entitas (hot wallet = banyak alamat satu operator) tak terlihat tanpa analisis graf/hubungan.", correct: true },
            { text: "SQL tidak bisa menjumlahkan angka sebesar Rp48 miliar", why: "Salah: SQL tidak punya masalah dengan angka besar. Masalahnya semantik, bukan kapasitas hitung." },
            { text: "Data on-chain tidak lengkap sehingga query-nya kekurangan data", why: "Salah: justru sebaliknya — data on-chain lengkap. Yang kurang adalah INTERPRETASI (filter transfer internal + heuristik entitas)." },
          ],
        },
        {
          q: "Alamat X: total terima 100, total kirim 98. Perannya menurut konsep arus neto?",
          options: [
            { text: "Akumulator — menimbun dana", why: "Salah: akumulator punya net positif BESAR. net(X) = 2, nyaris nol." },
            { text: "Perantara (pass-through) — dana lewat, hampir tidak tersisa", why: "Benar: net = 100 − 98 = 2 ≈ 0. Ciri perantara: volume besar, sisa kecil — seperti dompet operasional atau mixer.", correct: true },
            { text: "Distributor — menyebar dana", why: "Salah: distributor punya net negatif besar (mengirim jauh lebih banyak dari yang diterima — biasanya dari saldo lama)." },
            { text: "Tidak bisa ditentukan tanpa tahu harganya", why: "Salah: peran dibaca dari ARUS (terima vs kirim), bukan dari harga asetnya." },
          ],
        },
        {
          q: "Kapan Python LEBIH TEPAT daripada SQL dalam analisis on-chain?",
          options: [
            { text: "Menghitung total volume harian exchange selama setahun", why: "Salah: ini agregasi per hari — wilayah SQL (cepat, sederhana)." },
            { text: "Mengikuti rantai transfer 5 hop dari satu alamat + mendeteksi pola peel", why: "Benar: traversal graf dan deteksi pola berurutan adalah wilayah Python — recursive CTE di SQL lambat dan sulit dibaca untuk ini.", correct: true },
            { text: "Menampilkan dashboard jumlah transaksi per jam", why: "Salah: agregasi waktu = SQL + scheduler. Pola berulang dan stabil." },
            { text: "Selalu — Python menggantikan SQL sepenuhnya", why: "Salah: mitos yang dibantah lesson ini. 90% pekerjaan dimulai dari query SQL untuk menemukan apa yang menarik." },
          ],
        },
        {
          q: "Heuristik common-input-ownership menyatakan semua input satu transaksi milik satu pemilik. Kapan heuristik ini GAGAL?",
          options: [
            { text: "Saat transaksi memakai CoinJoin — banyak pemilik tak saling kenal dalam satu transaksi", why: "Benar: CoinJoin sengaja menggabungkan input banyak pemilik untuk privasi — asumsi “satu transaksi = satu pemilik” runtuh total.", correct: true },
            { text: "Saat jumlahnya sangat besar", why: "Salah: besar-kecil jumlah tidak memengaruhi logika kepemilikan input." },
            { text: "Saat transaksi terjadi di blockchain UTXO", why: "Salah: heuristik ini justru DIRANCANG untuk model UTXO." },
            { text: "Tidak pernah — ini aturan pasti kriptografi", why: "Salah: ini heuristik perilaku, bukan aturan kriptografi. Kriptografi hanya membuktikan tanda tangan valid, bukan siapa pemiliknya." },
          ],
        },
        {
          q: "Tim compliance ingin membekukan cluster 40 alamat berdasarkan SATU heuristik funding bersama. Sikap analis yang tepat?",
          options: [
            { text: "Bekukan segera — heuristik sudah cukup sebagai bukti", why: "Salah: heuristik = hipotesis, bukan bukti. Pembekuan butuh verifikasi independen; false positive di compliance mahal (reputasi, hukum)." },
            { text: "Tahan dulu: verifikasi dengan heuristik kedua + konteks (waktu, pola), eskalasi dengan tingkat keyakinan", why: "Benar: seperti Dinda — cek funding, waktu, pola perilaku; laporkan keyakinan bukan kepastian; biarkan keputusan di tangan proses resmi.", correct: true },
            { text: "Abaikan — heuristik tidak pernah bisa dipakai di compliance", why: "Salah: terlalu jauh. Heuristik BOLEH dipakai sebagai pemicu investigasi — hanya tidak boleh menjadi satu-satunya dasar tindakan." },
            { text: "Minta datanya dihapus karena melanggar privasi", why: "Salah: data on-chain bersifat publik; isu privasi muncul saat menghubungkannya ke identitas — yang justru butuh prosedur hukum, bukan penghapusan." },
          ],
        },
      ],
      next: { label: "BCD24 — Menulis Riset Kripto Berkualitas Institusional", href: "/learn/bcd24-riset-institusional" },
    },
  ],
};
