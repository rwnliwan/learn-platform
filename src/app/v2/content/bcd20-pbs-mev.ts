import type { V2Lesson } from "../lib/types";

// ── Figure: pangsa pasar builder blok + HHI ──────────────────────────────
const BUILDER_SVG = `<svg viewBox="0 0 600 290" role="img" aria-label="Diagram batang pangsa pasar enam builder blok">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="235.0" x2="560" y2="235.0"/>
<line x1="48" y1="189.4" x2="560" y2="189.4"/>
<line x1="48" y1="143.9" x2="560" y2="143.9"/>
<line x1="48" y1="98.3" x2="560" y2="98.3"/>
<line x1="48" y1="52.8" x2="560" y2="52.8"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="239.0">0%</text>
<text x="42" y="193.4">10%</text>
<text x="42" y="147.9">20%</text>
<text x="42" y="102.3">30%</text>
<text x="42" y="56.8">40%</text>
</g><g>
<rect x="68.5" y="61.9" width="44.4" height="173.1" fill="var(--c1)" opacity="0.9"/>
<text x="90.7" y="53.9" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">38%</text>
<text x="90.7" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B1</text>
<rect x="153.8" y="134.8" width="44.4" height="100.2" fill="var(--c1)" opacity="0.9"/>
<text x="176.0" y="126.8" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">22%</text>
<text x="176.0" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B2</text>
<rect x="239.1" y="166.7" width="44.4" height="68.3" fill="var(--c1)" opacity="0.9"/>
<text x="261.3" y="158.7" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">15%</text>
<text x="261.3" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B3</text>
<rect x="324.5" y="189.4" width="44.4" height="45.6" fill="var(--c1)" opacity="0.9"/>
<text x="346.7" y="181.4" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">10%</text>
<text x="346.7" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B4</text>
<rect x="409.8" y="198.6" width="44.4" height="36.4" fill="var(--c1)" opacity="0.9"/>
<text x="432.0" y="190.6" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">8%</text>
<text x="432.0" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B5</text>
<rect x="495.1" y="203.1" width="44.4" height="31.9" fill="var(--c1)" opacity="0.9"/>
<text x="517.3" y="195.1" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">7%</text>
<text x="517.3" y="251" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">B6</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">pangsa blok yang dibangun per builder — HHI = 2.366 (data ilustratif)</text><text x="560" y="265" text-anchor="end">builder</text></g></svg>`;

export const bcd20: V2Lesson = {
  slug: "bcd20-pbs-mev",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "PBS & MEV Supply Chain: Siapa Membangun Blokmu",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Blok yang tidak dibangun oleh pembuatnya",
      prose: [
        "Kamu menjalankan validator Ethereum. Slot-mu tiba — giliranmu mengusulkan blok. Kamu tidak merakitnya sendiri. Sebaliknya, sebuah perangkat lunak bernama MEV-boost melelang hak itu ke pasar: beberapa “builder” menawar, kamu mengambil penawaran tertinggi, menandatangani header-nya, dan blok terbit — dibangun oleh orang lain, ditandatangani olehmu. Hari ini, lebih dari 90% blok Ethereum lahir dengan cara ini.",
        "Twist-nya: Ethereum yang kita rayakan sebagai desentralisasi ternyata punya titik sentralisasi di tempat yang tak terduga — bukan di consensus (validator tersebar ribuan), melainkan di PEMBANGUNAN BLOK (segelintir builder merakit mayoritas blok). Dan siapa yang merakit blok menentukan segalanya: transaksi mana yang masuk duluan, siapa yang kena sandwich, dan — yang paling sensitif — transaksi siapa yang DIAM-DIAM tidak dimasukkan (sensor, seperti kasus Tornado Cash pasca-sanksi OFAC).",
        "Di lesson ini kamu memetakan rantai pasoknya: proposer, builder, relay, dan lelang order flow — lalu mengukurnya dengan metrik sentralisasi. Karena “terdesentralisasi” adalah klaim yang harus diverifikasi dengan data, bukan diterima dari brosur.",
      ],
      tasks: [],
      note: {
        title: "Batas lesson ini — baca dulu",
        type: "risk",
        body: "Lesson bcd8 membahas DETEKSI MEV di mempool: mengenali pola sandwich/arbitrase dari urutan transaksi dan menghitung profitnya — sudut pandang transaksi individual. Lesson INI tidak mengulang itu — ia membahas STRUKTUR RANTAI PASOK di atas mempool: siapa builder/relay/proposer, bagaimana lelang order flow bekerja, dan seberapa terkonsentrasi kekuasaan membangun blok (metrik HHI). Kalau pertanyaanmu “transaksi ini sandwich atau bukan?”, kembali ke bcd8; kalau pertanyaanmu “apakah pasar pembangunan blok sehat?”, lanjutkan di sini.",
      },
      reference: "bcd8 = forensik transaksi MEV (mikro). bcd20 = struktur pasar & sentralisasi pembangunan blok (makro).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga peran PBS (builder, relay, proposer) dan aliran lelang MEV-boost; (2) menjelaskan order flow auction — dari mana builder mendapat transaksi eksklusif dan kenapa itu penting; (3) menghitung HHI dan metrik sentralisasi lain dari data pangsa builder/relay; (4) menilai risiko sensor dan sentralisasi dari struktur pasar — dan tahu kapan pasar “terlihat kompetitif” tetapi sebenarnya tidak.",
        "Rutenya: cerita + batas lesson → bekal ringkas → tiga konsep inti (PBS, order flow auction, metrik sentralisasi) → lab Pyodide (kalkulator HHI) → chart pangsa builder dengan panduan baca → peta keputusan → mini-case relay → kuis → rangkuman. Estimasi 52 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. MEV (maximal extractable value) adalah profit yang bisa diekstrak dengan mengatur/menyisipkan transaksi dalam blok — dua polanya: arbitrase (menyeimbangkan harga antar-DEX, fungsi pasar yang sehat) dan sandwich/frontrun (mengapit transaksi korban, pajak atas pengguna). Pola-pola ini terdeteksi dari URUTAN transaksi di mempool/blok: beli–jual mengapit dalam satu blok = sandwich. Lesson ini naik satu level: bukan “siapa yang di-sandwich?”, melainkan “siapa yang MENJUAL hak mengatur urutan itu?”",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bcd8 bertanya tentang PENCURI di pasar (siapa yang sandwich siapa). Lesson ini bertanya tentang PEMILIK PASAR (siapa yang mengatur lapak dan memungut sewa lapak). Kejahatan jalanan vs ekonomi politik — keduanya nyata, levelnya beda.",
      ],
      reference: "Bekal: MEV = profit dari pengaturan urutan (arbitrase vs sandwich); terdeteksi dari pola urutan di mempool.",
    },
    {
      id: "konsep-pbs",
      eyebrow: "Langkah 3 · Konsep",
      title: "PBS — Si Pemisah Tugas",
      prose: [
        "Definisi: Proposer-Builder Separation (PBS) memisahkan dua pekerjaan yang dulu dilakukan validator sendirian: (1) BUILDER — entitas spesialis yang merakit blok paling menguntungkan dari mempool + order flow privat, lalu menawar ke proposer lewat relay; (2) RELAY — perantara tepercaya yang memvalidasi blok builder (valid, tidak curang) dan menyembunyikan isinya dari proposer sampai ia berkomitmen (mencegah pencurian MEV oleh proposer); (3) PROPOSER — validator yang memilih bid tertinggi, menandatangani header, dan mempublikasikan blok. Implementasinya hari ini: MEV-boost (out-of-protocol), dengan enshrinement (masuk ke protokol) sebagai arah jangka panjang.",
        "Kepribadiannya: PBS adalah lelang konstruksi yang jujur tentang insentifnya. Sebelum PBS, validator besar dengan akses order flow privat punya keunggulan tak terlihat — MEV mengalir diam-diam ke yang paling terhubung. PBS memaksa semuanya ke meja lelang terbuka: builder bersaing, proposer mengambil yang tertinggi, dan keuntungan MEV “didistribusikan” ke validator (dan via staking, ke delegator). Masalahnya: meja lelangnya sendiri bisa dikuasai segelintir pemain — dan relay sebagai “wasit tepercaya” adalah titik kepercayaan yang ironis di sistem tanpa kepercayaan.",
        "Kapan memakai: kerangka PBS dipakai untuk menganalisis (a) desentralisasi aktual Ethereum — bukan dari jumlah validator, melainkan dari pangsa builder/relay; (b) insiden sensor — relay/builder yang memfilter transaksi (mis. OFAC-compliant relay pasca-sanksi Tornado Cash); (c) evolusi desain — ePBS, inclusion list, dan encrypted mempool adalah respons atas kelemahan struktur ini.",
      ],
      formula: String.raw`\text{bid}_{\text{menang}} = \max_i(\text{nilai MEV blok}_i) \quad\text{proposer terima} = \text{bid}_{\text{menang}}`,
      formulaNote: "Bukan rumus kriptografi — melainkan logika lelangnya: tiap builder i menawar sebesar nilai yang bisa ia ekstrak dari blok yang ia rakit; proposer rasional mengambil tertinggi. Interpretasi: proposer tidak perlu tahu ISI blok untuk mendapat bayaran maksimal — dan justru ketidaktahuan itulah yang dijaga relay. Konsekuensinya: builder dengan order flow eksklusif terbaik SELALU menang — lelang yang “terbuka” tetapi dimenangkan oleh yang punya informasi privat.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Ribuan validator = Ethereum terdesentralisasi penuh”",
        type: "pitfall",
        body: "Yang benar: desentralisasi punya LAPISAN. Consensus (siapa menandatangani) memang tersebar; tetapi block building (siapa MERAKIT isi) terkonsentrasi pada segelintir builder, dan relay menambah titik kepercayaan. Klaim “terdesentralisasi” yang hanya menghitung validator sedang mengukur suhu dengan termometer yang salah.",
      },
      hints: [
        "💡 Intuisi: bedakan HAK (proposer menandatangani — tersebar) dari KUASA (builder menentukan isi — terkonsentrasi). Dalam setiap sistem, tanyakan: siapa yang memegang kuasa SESUNGGUHNYA, bukan siapa yang memegang stempelnya.",
      ],
      reference: "PBS: builder merakit → relay memvalidasi & menyembunyikan → proposer memilih bid tertinggi. Kuasa di builder.",
    },
    {
      id: "konsep-orderflow",
      eyebrow: "Langkah 4 · Konsep",
      title: "Order Flow Auction — Si Lelang Gelap",
      prose: [
        "Definisi: order flow adalah ARUS TRANSAKSI (terutama dari dompet/RPC) yang BISA dilihat sebelum masuk mempool publik. Order flow auction (OFA): dompet/melelang hak mengeksekusi aliran transaksinya kepada builder/searcher dengan penawar tertinggi — imbalannya “eksekusi lebih baik” (atau cashback) bagi pengguna. Varian ekstremnya: EXCLUSIVE order flow — aliran yang hanya diberikan ke SATU builder, memberinya keunggulan informasi privat yang tak bisa ditandingi builder lain.",
        "Kepribadiannya: OFA adalah pasar gelap yang melegalkan diri — TradFi menyebutnya payment for order flow (PFOF), praktik yang kontroversial di pasar saham (Robinhood vs SEC). Logikanya sama: “pesananmu berharga karena seseorang bisa profit darinya; kami jual informasi itu dan berbagi hasilnya denganmu.” Masalahnya juga sama: pengguna mendapat eksekusi “lebih baik” dari alternatif yang buruk, sementara nilai sesungguhnya dari order flow-nya tidak pernah ia ketahui. Dan di level sistem: builder dengan exclusive flow terbesar menjadi tak terkalahkan — lelang PBS berubah menjadi formalitas.",
        "Kapan memakai: konsep ini dipakai untuk (a) menjelaskan dominasi builder tertentu — bukan karena algoritmanya lebih pintar, melainkan karena flow-nya eksklusif; (b) menilai klaim “eksekusi terbaik” dompet — tanyakan ke mana flow-nya dijual; (c) memahami sentralisasi struktural: selama order flow bisa dimonopoli, pasar builder tidak akan pernah benar-benar kompetitif.",
      ],
      formula: String.raw`\text{keunggulan builder} \propto \text{nilai order flow eksklusif} \gg \text{keunggulan algoritma}`,
      formulaNote: "Ketidaksamaan informal tetapi fundamental: dalam praktik, akses ke flow privat yang besar mengalahkan optimasi algoritma perakitan blok. Contoh mental: builder A dengan algoritma brilian tetapi hanya melihat mempool publik vs builder B dengan algoritma biasa tetapi menerima 30% order flow dompet populer secara eksklusif — B menang hampir selalu. Interpretasi: kompetisi builder BUKAN kompetisi teknologi, melainkan kompetisi AKSES INFORMASI — dan akses bisa dibeli/dimonopoli.",
      tasks: [],
      hints: [
        "💡 Intuisi: dalam setiap lelang, tanyakan bukan “siapa penawar tertinggi?” melainkan “siapa yang TAHU paling banyak sebelum menawar?”. Asimetri informasi adalah bapak dari semua keunggulan pasar — di TradFi maupun di blok.",
      ],
      reference: "OFA = lelang hak atas arus transaksi. Exclusive flow = keunggulan tak terkalahkan → lelang jadi formalitas.",
    },
    {
      id: "konsep-hhi",
      eyebrow: "Langkah 5 · Konsep",
      title: "Metrik Sentralisasi — Si Termometer Kekuasaan",
      prose: [
        "Definisi: Herfindahl-Hirschman Index (HHI) mengukur konsentrasi pasar: HHI = Σ s_i², dengan s_i = pangsa pasar (%) tiap pemain. Skala 0–10.000. Klasifikasi DOJ (Departemen Kehakiman AS, untuk merger): < 1.500 = kompetitif; 1.500–2.500 = terkonsentrasi sedang; > 2.500 = sangat terkonsentrasi. Untuk PBS, hitung HHI untuk BUILDER (pangsa blok dibangun) dan RELAY (pangsa blok disalurkan) secara terpisah — keduanya adalah titik kuasa yang berbeda. Metrik pendamping: pangsa 2 teratas (dominasi), dan integrasi vertikal (builder yang juga searcher/relay — konflik kepentingan).",
        "Kepribadiannya: HHI adalah termometer yang jujur karena ia menghukum dominasi secara kuadratik — satu pemain 38% (38² = 1.444) sendirian sudah hampir mencapai ambang “sedang”, sementara enam pemain @ ~17% hanya menghasilkan ~1.700. Ia menangkap intuisi “sedikit raksasa lebih berbahaya dari banyak pemain sedang” ke dalam satu angka. Kelemahannya: ia buta terhadap KOORDINASI — dua builder “independen” yang dimiliki satu grup tetap terlihat terpisah di HHI.",
        "Kapan memakai: HHI adalah bahasa standar laporan kesehatan PBS — pantau trennya, bukan titiknya. Sinyal bahaya: HHI builder naik persisten; pangsa relay OFAC-compliant > 50% (mayoritas blok melewati filter sensor — sensor menjadi default, bukan pengecualian); builder teratas terintegrasi vertikal dengan searcher dominan (ia bisa memprioritaskan MEV-nya sendiri).",
      ],
      formula: String.raw`\text{HHI} = \sum_{i=1}^{n} s_i^2 \qquad s_i = \text{pangsa (\%) pemain }i`,
      formulaNote: "s_i dalam persen (0–100), sehingga HHI maksimum 10.000 (monopoli). Contoh: pangsa [38, 22, 15, 10, 8, 7] → HHI = 1444+484+225+100+64+49 = 2.366 — “terkonsentrasi sedang”, mendekati ambang tinggi 2.500. Interpretasi: dua pemain teratas (60% pangsa) menyumbang 1.928 dari 2.366 — HHI memberi tahu bahwa masalahnya BUKAN “ada 6 builder”, melainkan “2 di antaranya menguasai 60%”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Ada 6 builder yang aktif — pasarnya kompetitif”",
        type: "pitfall",
        body: "Yang benar: JUMLAH pemain tidak sama dengan KOMPETISI — pangsa yang menentukan. Enam builder dengan HHI 2.366 (dua teratas 60%) adalah pasar terkonsentrasi sedang menurut standar DOJ. Analis yang menghitung kepala, bukan pangsa, akan melaporkan “sehat” untuk pasar yang sakit.",
      },
      hints: [
        "💡 Intuisi: HHI menghukum secara kuadratik karena kekuasaan tumbuh secara kuadratik — pemain 2× lebih besar bukan 2× lebih berkuasa, melainkan 4× lebih menentukan hasil lelang. Itulah kenapa dominasi kecil terasa jauh lebih besar.",
      ],
      reference: "HHI = Σ s_i². DOJ: <1500 kompetitif, 1500–2500 sedang, >2500 sangat terkonsentrasi. Hitung terpisah untuk builder & relay.",
    },
    {
      id: "lab-hhi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Kalkulator kesehatan pasar builder",
      prose: [
        "Waktunya jadi pengawas pasarnya. Di bawah ada pangsa 6 builder sintetis (persen blok yang dibangun). Tugasmu: tulis tiga fungsi — `hhi(shares)`, `klasifikasi(h)` (\"kompetitif\"/\"sedang\"/\"tinggi\" per ambang DOJ), dan `pangsa_teratas(shares, n)` — lalu jalankan laporannya.",
        "Coba: setelah lolos, ubah pangsa menjadi [25, 24, 18, 12, 11, 10] (lebih merata). Berapa HHI-nya? Bandingkan dengan klasifikasi DOJ — itulah “jarak” pasar saat ini dari kompetisi yang sehat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `hhi(shares)`: jumlahkan kuadrat tiap pangsa" },
        { id: "t2", text: "Lengkapi `klasifikasi(h)`: <1500 kompetitif, <2500 sedang, selain itu tinggi" },
        { id: "t3", text: "Lengkapi `pangsa_teratas(shares, n)`: jumlahkan n pangsa terbesar" },
        { id: "t4", text: "Jalankan dan pastikan dua baris laporan tercetak" },
      ],
      expected: "HHI=2366 klasifikasi=sedang\ntop2=60%",
      hints: [
        "`pangsa_teratas`: `sum(sorted(shares, reverse=True)[:n])`.",
        "Skenario merata [25,24,18,12,11,10]: HHI = 1.890 — masih “sedang”, tetapi jauh dari ambang tinggi 2.500.",
      ],
      code: {
        starter: `# Pangsa builder SINTETIS (% blok dibangun) — bukan data mainnet asli
shares = [38, 22, 15, 10, 8, 7]

# TULIS KODEMU: tiga fungsi di bawah ini
def hhi(shares):
    return

def klasifikasi(h):
    return

def pangsa_teratas(shares, n):
    return

h = hhi(shares)
print(f"HHI={h} klasifikasi={klasifikasi(h)}")
print(f"top2={pangsa_teratas(shares, 2)}%")`,
        lockLines: 2,
        solution: `# Pangsa builder SINTETIS (% blok dibangun) — bukan data mainnet asli
shares = [38, 22, 15, 10, 8, 7]

# TULIS KODEMU: tiga fungsi di bawah ini
def hhi(shares):
    return sum(s * s for s in shares)

def klasifikasi(h):
    if h < 1500:
        return "kompetitif"
    if h < 2500:
        return "sedang"
    return "tinggi"

def pangsa_teratas(shares, n):
    return sum(sorted(shares, reverse=True)[:n])

h = hhi(shares)
print(f"HHI={h} klasifikasi={klasifikasi(h)}")
print(f"top2={pangsa_teratas(shares, 2)}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "h", value: 2366, tol: 0, label: "`h` (HHI) = 2366", msg: "38²+22²+15²+10²+8²+7² = 2366." },
          { kind: "stdout_matches", task: "t2", pattern: "klasifikasi=sedang", label: "Klasifikasi = sedang", msg: "1500 ≤ 2366 < 2500 → terkonsentrasi sedang (DOJ)." },
          { kind: "stdout_matches", task: "t4", pattern: "top2=60%", label: "Dua teratas = 60%", msg: "38 + 22 = 60 — mayoritas blok dari dua builder." },
        ],
      },
      reference: "HHI = Σ s²; DOJ: <1500 / 1500–2500 / >2500. Pantau tren, bukan titik.",
    },
    {
      id: "chart-builder",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca batang builder seperti regulator",
      prose: [
        "Chart di bawah memplot pangsa 6 builder dari lab-mu (data ilustratif, polanya meniru mainnet).",
        "Cara membaca: sumbu Y = % blok yang dibangun; tinggi batang = pangsa tiap builder; angka di atas batang = persentasenya.",
        "Interpretasi: B1 (38%) + B2 (22%) = 60% — DUA entitas merakit mayoritas blok Ethereum. Inilah yang ditangkap HHI 2.366: bukan “ada 6 builder” (terdengar sehat), melainkan “duopoli efektif” (terdengar — dan memang — mengkhawatirkan). Tanyakan sebagai analis: siapa pemilik B1 dan B2? Apakah mereka terafiliasi? Apakah relay yang mereka pakai memfilter transaksi (OFAC-compliant)? Bila jawaban ketiganya mengarah ke konsentrasi lebih lanjut, “terkonsentrasi sedang” di atas kertas bisa berarti “sangat terkonsentrasi” dalam praktik — HHI buta terhadap koordinasi, analis tidak boleh buta.",
      ],
      figure: {
        svg: BUILDER_SVG,
        alt: "Diagram batang pangsa 6 builder: 38%, 22%, 15%, 10%, 8%, 7%. HHI 2.366.",
        caption: "Pangsa blok per builder (ilustratif). Dua teratas = 60%; HHI = 2.366 (sedang, dekat ambang tinggi).",
      },
      tasks: [],
      note: {
        title: "Intuisi: proposer yang banyak adalah teater bila builder-nya sedikit",
        body: "PBS terlihat desentralisasi bila kamu menghitung proposer — ribuan validator bergiliran mengusulkan blok. Tetapi blok tidak dirakit oleh proposer; ia dirakit oleh builder. Dan bila 2 builder merakit 60 persen blok, \"desentralisasi proposer\" hanyalah teater di atas panggung yang lampunya dipegang duopoli. Heuristik analis: ikuti perakitan, bukan pengusulan — siapa yang memilih urutan transaksi, dialah yang memegang dua kekuasaan tersembunyi: ekstraksi (MEV — memilih transaksi mana yang menguntungkan untuk didahulukan) dan sensor (transaksi mana yang tidak pernah masuk blok). Jebakan metriknya: HHI 2.366 terbaca \"konsentrasi sedang\", tetapi HHI buta terhadap koordinasi — dua builder yang terafiliasi atau memakai relay yang sama secara efektif adalah satu. Maka aturan praktisnya: selidiki kepemilikan dan afiliasi dua teratas, periksa relay mereka (apakah memfilter transaksi demi kepatuhan OFAC?), dan lacak dari mana order flow eksklusif berasal — dompet, bot Telegram, aggregator. Siapa yang menguasai order flow menguasai lelang, dan lelang yang pesertanya itu-itu saja bukan pasar bebas. Tren lebih penting dari titik: pangsa pemimpin yang naik 3 kuartal berturut-turut jarang berbalik sendiri — pasar yang bergerak ke konsentrasi harus diperingatkan sebelum menyentuh ambang, bukan sesudah.",
      },
      reference: "Hitung kepala = 6 (sehat). Hitung pangsa = duopoli (sakit). Analis menghitung pangsa.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Menilai & merespons struktur pasar PBS",
      prose: [
        "Lima skenario yang dihadapi analis protokol:",
        "Skenario 1 — HHI builder naik 3 kuartal berturut-turut. → Peringatkan: selidiki penyebabnya (exclusive order flow ke pemimpin? integrasi vertikal?) sebelum menyentuh ambang 2.500. Alasan: tren lebih penting dari titik — pasar yang bergerak ke konsentrasi jarang berbalik sendiri.",
        "Skenario 2 — Relay OFAC-compliant menyalurkan > 50% blok. → Tandai risiko sensor SISTEMIK: transaksi yang difilter tidak hanya tertunda, melainkan berisiko tidak masuk berbulan-bulan. Alasan: sensor menjadi default arsitektur, bukan pilihan — ini perubahan sifat jaringan, bukan insiden.",
        "Skenario 3 — Pengguna bertanya “dompet mana memberi eksekusi terbaik?” → Jawab dengan data: bandingkan harga eksekusi vs harga pasar + lacak ke mana order flow dompet itu dijual. Alasan: “eksekusi terbaik” tanpa transparansi order flow = klaim pemasaran; analis memverifikasi, bukan mengutip brosur.",
        "Skenario 4 — Proposal ePBS / inclusion list diajukan. → Evaluasi: apakah ia mengurangi kuasa builder (inclusion list memaksa transaksi tertentu masuk) atau hanya memindahkan kuasa (ke komite baru)? Alasan: setiap “solusi desentralisasi” harus diuji terhadap pertanyaan yang sama — siapa memegang kuasa sesungguhnya setelah perubahan?",
        "Skenario 5 — Builder teratas juga operator searcher dominan (integrasi vertikal). → Tandai konflik kepentingan: ia bisa memprioritaskan MEV-nya sendiri di atas bid terbaik untuk proposer. Alasan: lelang yang wasitnya juga pemain bukan lelang — ukur apakah bid-nya memang kompetitif atau formalitas.",
        "Aturan praktis 10 detik: HHI builder? HHI relay? Pangsa sensor-compliant? Integrasi vertikal? → bila 2+ merah, pasarnya sakit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menilai desentralisasi Ethereum HANYA dari distribusi validator/staking — lalu menyimpulkan “sangat desentralisasi”. Itu seperti menilai demokrasi dari jumlah TPS tanpa melihat siapa menghitung suara. Bangun dashboard BERLAPIS: consensus, block building, relay — tiga angka, tiga cerita.",
      },
      reference: "Dashboard PBS sehat: HHI builder + HHI relay + pangsa sensor-compliant + peta integrasi vertikal.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Relay Patuh dan transaksi yang tak kunjung masuk",
      prose: [
        "Skenario (sintetis, untuk latihan — pola meniru kejadian nyata pasca-sanksi OFAC terhadap Tornado Cash): Relay R (memfilter transaksi terkait alamat sanksi OFAC) menyalurkan 55% blok; Builder B1 (38% pangsa) hanya memakai relay R. Seorang pengguna sah (bukan kriminal — peneliti keamanan yang menguji mixer untuk audit) mengirim transaksi yang “tercemar” (pernah berinteraksi dengan alamat sanksi). Transaksinya tidak masuk blok selama 3 minggu — fee-nya wajar, mempool tidak padat.",
        "Pertanyaan analisis: (1) Kenapa transaksinya tidak masuk padahal fee wajar? (2) Berapa % blok yang secara struktural tidak akan memuatnya? (3) Apa implikasi dan respons analis?",
        "Pembahasan: (1) Bukan masalah fee — masalah FILTER: B1 (38%) via relay R yang memfilter + relay R menyalurkan 55% blok total — transaksinya hanya bisa masuk lewat 45% blok yang tidak memakai filter, dan itupun bersaing. (2) Secara struktural ~55%+ kapasitas jaringan tertutup untuknya — bukan sensor satu aktor jahat, melainkan sensor sebagai properti EMERGEN dari pasar yang terkonsentrasi. (3) Implikasi: netralitas jaringan (censorship resistance) — proposisi nilai inti Ethereum — tergerus bukan oleh serangan, melainkan oleh insentif pasar + kepatuhan. Respons analis: ukur dan laporkan “waktu-tunggu transaksi terfilter” sebagai metrik kesehatan; dukung evaluasi inclusion list / desain anti-sensor — karena yang tidak diukur tidak akan diperbaiki.",
        "Pelajaran: sensor paling berbahaya bukan yang diumumkan — melainkan yang menjadi default arsitektur sementara semua orang sibuk menghitung jumlah validator.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko kepatuhan dua arah: di satu sisi regulator menuntut pemfilteran; di sisi lain pengguna menuntut netralitas. Analis tidak memihak — ia MENGUKUR: berapa % blok terfilter, berapa lama transaksi tertunda, siapa yang mengendalikan filter. Tanpa angka, debatnya hanya slogan.",
      },
      reference: "Sensor emergen = properti pasar terkonsentrasi, bukan ulah satu aktor. Ukur waktu-tunggu terfilter.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "PBS: builder merakit (kuasa isi) → relay memvalidasi & menyembunyikan → proposer menandatangani (hak). >90% blok via MEV-boost.",
        "Order flow auction: arus transaksi dilelang; exclusive flow memberi keunggulan tak terkalahkan — kompetisi builder = kompetisi akses informasi.",
        "HHI = Σ s_i²; DOJ: <1500 kompetitif, 1500–2500 sedang, >2500 sangat terkonsentrasi. Hitung terpisah untuk builder & relay.",
        "Batas lesson: bcd8 = forensik transaksi MEV (mikro); lesson ini = struktur pasar & sentralisasi (makro).",
        "Aturan pakai: HHI builder + HHI relay + pangsa sensor-compliant + integrasi vertikal — 2+ merah = pasar sakit.",
      ],
      quiz: [
        {
          q: "Peran relay dalam PBS?",
          options: [
            { text: "Memvalidasi blok builder dan menyembunyikan isinya dari proposer sampai ia berkomitmen — mencegah pencurian MEV", why: "Benar: relay adalah wasit tepercaya: cek validitas + jaga kerahasiaan isi agar proposer tidak mencuri peluang MEV builder.", correct: true },
            { text: "Merakit blok paling menguntungkan dari mempool", why: "Salah: itu peran BUILDER — relay tidak merakit, ia memvalidasi dan meneruskan." },
            { text: "Menandatangani dan mempublikasikan blok", why: "Salah: itu peran PROPOSER (validator) — relay tidak punya kunci validator." },
            { text: "Melelang order flow ke searcher", why: "Salah: itu order flow auction (dompet/melelang) — relay tidak terlibat dalam lelang flow." },
          ],
        },
        {
          q: "Pangsa builder [38, 22, 15, 10, 8, 7]. HHI dan klasifikasinya?",
          options: [
            { text: "2.366 — terkonsentrasi sedang (mendekati ambang tinggi 2.500)", why: "Benar: 1444+484+225+100+64+49 = 2.366; 1500 ≤ HHI < 2500 = sedang menurut DOJ.", correct: true },
            { text: "100 — sangat kompetitif karena ada 6 pemain", why: "Salah: menghitung kepala bukan pangsa; 100 bahkan bukan hasil rumus HHI yang benar (Σs² dengan s dalam persen)." },
            { text: "6.000 — sangat terkonsentrasi", why: "Salah: aritmetikanya salah — 2.366, bukan 6.000. Selalu hitung, jangan tebak." },
            { text: "Tidak bisa dihitung tanpa data relay", why: "Salah: HHI builder dihitung dari pangsa builder saja; HHI relay adalah metrik TERPISAH yang juga perlu dihitung." },
          ],
        },
        {
          q: "Kenapa exclusive order flow berbahaya bagi kompetisi builder?",
          options: [
            { text: "Builder dengan flow eksklusif selalu menang lelang — keunggulan informasi privat mengalahkan keunggulan algoritma", why: "Benar: lelang tetap “terbuka” secara formal, tetapi hasilnya sudah ditentukan oleh siapa memegang flow — kompetisi menjadi teater.", correct: true },
            { text: "Karena melanggar kode etik MEV", why: "Salah: tidak ada kode etik yang dilanggar — masalahnya STRUKTURAL (pasar tidak kompetitif), bukan moral." },
            { text: "Karena membuat gas lebih mahal untuk semua", why: "Salah: efeknya pada sentralisasi pasar builder, bukan langsung pada harga gas pengguna." },
            { text: "Tidak berbahaya — justru meningkatkan efisiensi", why: "Salah: “efisiensi” jangka pendek (eksekusi lebih baik) dibayar dengan konsentrasi kuasa jangka panjang." },
          ],
        },
        {
          q: "Relay OFAC-compliant menyalurkan >50% blok. Implikasinya?",
          options: [
            { text: "Sensor menjadi default arsitektur — transaksi terfilter secara struktural kesulitan masuk, bukan karena satu aktor jahat", why: "Benar: ini sensor EMERGEN dari konsentrasi pasar — properti sistem, bukan insiden. Mengancam proposisi censorship resistance.", correct: true },
            { text: "Tidak masalah — 50% blok sisanya cukup", why: "Salah: “cukup” mengabaikan penundaan berminggu-minggu dan fakta bahwa mayoritas kapasitas tertutup — netralitasnya sudah berubah sifat." },
            { text: "Solusinya menambah jumlah relay", why: "Salah: menambah relay yang SAMA-SAMA compliant tidak mengubah pangsa terfilter — yang penting pangsa NON-compliant, bukan jumlah relay." },
            { text: "Hanya berdampak pada kriminal", why: "Salah: filter berbasis alamat sanksi menangkap juga peneliti, auditor, dan pengguna sah yang “tercemar” — seperti mini-case." },
          ],
        },
        {
          q: "Apa beda fokus bcd8 vs lesson ini?",
          options: [
            { text: "bcd8 = deteksi pola MEV per transaksi di mempool (mikro); lesson ini = struktur rantai pasok + metrik sentralisasi builder/relay (makro)", why: "Benar: batas eksplisit lesson — dua level analisis yang komplementer atas fenomena MEV yang sama.", correct: true },
            { text: "bcd8 untuk Bitcoin, lesson ini untuk Ethereum", why: "Salah: keduanya tentang Ethereum/MEV — bedanya level analisis, bukan chain." },
            { text: "Lesson ini menggantikan bcd8", why: "Salah: forensik transaksi tetap dibutuhkan (mis. mengukur kerugian korban sandwich) — makro tidak menggantikan mikro." },
            { text: "Tidak ada beda — keduanya tentang MEV", why: "Salah: “tentang MEV” seperti “tentang ekonomi” — level analisisnya yang menentukan pertanyaan dan metriknya." },
          ],
        },
      ],
    },
  ],
};
