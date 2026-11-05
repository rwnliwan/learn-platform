import type { V2Lesson } from "../lib/types";

// Konsentrasi holder: 10 address teratas vs 190 sisanya (data sintetis seed 7).
const CONC_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Diagram batang: 10 address teratas menguasai 43 persen supply, 190 address sisanya 57 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="20" x2="440" y2="20"/><line x1="40" y1="70" x2="440" y2="70"/><line x1="40" y1="120" x2="440" y2="120"/><line x1="40" y1="170" x2="440" y2="170"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="34" y="24">100%</text><text x="34" y="74">75%</text><text x="34" y="124">50%</text><text x="34" y="174">25%</text></g>
<rect x="90" y="20" width="120" height="103" fill="var(--c4)"/>
<rect x="90" y="123" width="120" height="47" fill="var(--c1)"/>
<rect x="270" y="20" width="120" height="150" fill="var(--c1)" opacity="0.55"/>
<text x="150" y="112" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">43%</text>
<text x="150" y="150" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">57%</text>
<text x="330" y="100" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">190 address</text>
<text x="150" y="192" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">10 address teratas</text>
<text x="330" y="192" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">190 address sisanya</text>
</svg>`;

const BCD1_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Rasio visibilitas per use-case: audit supply 95, wash trading 70, atribusi identitas 30, prediksi harga 20 persen."><text x="142" y="55.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Audit supply</text><rect x="150" y="42.25" width="298.3" height="18" rx="3" fill="var(--c1)"/><text x="454.3" y="55.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">95%: TERANG</text><text x="142" y="97.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Wash trading</text><rect x="150" y="84.75" width="219.8" height="18" rx="3" fill="var(--c2)"/><text x="375.8" y="97.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">70%: REMANG</text><text x="142" y="140.25" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Atribusi identitas</text><rect x="150" y="127.25" width="94.2" height="18" rx="3" fill="var(--c3)"/><text x="250.2" y="140.25" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">30%: GELAP</text><text x="142" y="182.75" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Prediksi harga</text><rect x="150" y="169.75" width="62.8" height="18" rx="3" fill="var(--c4)"/><text x="218.8" y="182.75" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">20%: GELAP</text></svg>`;

export const bcd1: V2Lesson = {
  slug: "bcd1-lanskap",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD1 — Apa yang Bisa Dianalisis On-Chain",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Melihat semuanya, tidak tahu apa-apa",
      prose: [
        "Maret 2022. Seorang analis di firma forensik kripto membuka dompet 0x7a…9f. Dalam 2 jam, dompet itu menerima 12.000 ETH dari 40.000 address berbeda. Ia bisa melihat setiap wei yang masuk — timestamp, nominal, address pengirim — semuanya. Transparan total. Dan ia tidak tahu apa-apa: siapa pemiliknya? Exchange? Mixer? Peretas?",
        "Tiga hari kemudian jawabannya muncul — bukan dari satu transaksi, melainkan dari polanya: 40.000 address itu semuanya pernah menerima dana dari satu dompet deposit exchange yang sama, dan arus keluarnya selalu dibulatkan ke 100 ETH. Itu deposit batching sebuah exchange besar. Transparansi memberinya data; analisis memberinya makna.",
        "Itulah paradoks yang akan kamu kuasai di track ini: blockchain adalah dataset publik paling lengkap di dunia keuangan — dan paling bisu. Ia mencatat SEMUA transaksi, tetapi tidak memberi tahu siapa pun. Tugas blockchain data scientist: mengubah catatan bisu menjadi jawaban.",
        "Tujuan lesson ini: (1) memetakan jenis pertanyaan yang bisa dijawab data on-chain; (2) memahami batas antara yang terlihat dan yang tidak; (3) menghitung ukuran konsentrasi paling dasar — karena 'terdesentralisasi' sering kali hanya klaim. Peta lesson: cerita → jenis pertanyaan → batas data → lab konsentrasi → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan apa yang bisa dan tidak bisa dianalisis dari data on-chain dengan contoh konkret; (2) menghitung rasio konsentrasi CR-10 dan HHI untuk distribusi token; (3) memetakan lima jenis pertanyaan bisnis ke data on-chain yang menjawabnya; (4) mengenali batas analisis: apa yang tetap gelap meski semua data terbuka.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Blockchain itu anonim, jadi tidak bisa dianalisis.\" Salah total — blockchain itu pseudonim, bukan anonim. Address adalah ID permanen yang perilakunya terekam selamanya. Analis tidak butuh nama; ia butuh pola. Justru karena semua histori publik dan tidak bisa dihapus, blockchain LEBIH bisa dianalisis daripada data bank yang tersebar di sistem tertutup.",
      },
      reference: "On-chain = semua transaksi publik + pseudonim. Analisis = mengubah catatan menjadi entitas, pola, dan risiko.",
    },
    {
      id: "jenis-pertanyaan",
      eyebrow: "Langkah 2 · Jenis pertanyaan",
      title: "Lima pertanyaan yang dibayar mahal",
      prose: [
        "Satu — Aliran dana (flow): ke mana uang bergerak? Ini fondasi investigasi forensik, pelacakan peretasan, dan AML. Pertanyaan tipikal: 'dari dompet peretas, ke exchange mana dana dicairkan?'",
        "Dua — Konsentrasi & distribusi: siapa menguasai apa? Top-10 holder menguasai berapa persen supply? Klaim 'desentralisasi' bisa diuji dengan angka, bukan whitepaper.",
        "Tiga — Kesehatan protokol (DeFi): berapa TVL yang nyata vs ganda-dihitung? Apakah likuiditas cukup dalam untuk menampung penarikan besar?",
        "Empat — Perilaku & anomali: pola apa yang tidak wajar? Wash trading NFT, sandwich attack, atau dompet yang tiba-tiba aktif setelah 3 tahun diam.",
        "Lima — Valuasi & tokenomics: apakah distribusi token sehat? Kapan unlock besar berikutnya, dan siapa yang bisa membanjiri pasar?",
        "Kelima jenis ini adalah kerangka seluruh track: bcd2–bcd4 fondasi data & DeFi, bcd5–bcd8 tokenomics/fraud/MEV, bcd9–bcd12 SQL, graph, risk scoring, dan capstone investigasi.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: bertanya sebelum mengunduh",
        body: "Analis junior mengunduh 'seluruh data chain' lalu bingung mau apa. Analis senior mulai dari pertanyaan: 'saya ingin tahu apakah likuiditas pool ini cukup untuk exit Rp5 miliar'. Pertanyaan menentukan tabel, kolom, dan jendela waktu yang dibutuhkan — bukan sebaliknya. Dataset on-chain itu tak berujung; pertanyaanlah yang memangkasnya.",
      },
      reference: "Lima lensa: aliran dana, konsentrasi, kesehatan protokol, anomali perilaku, tokenomics.",
    },
    {
      id: "batas-data",
      eyebrow: "Langkah 3 · Batas data",
      title: "Yang terlihat, yang tidak, dan yang menipu",
      prose: [
        "Yang terlihat: setiap transaksi (pengirim, penerima, nominal, fee, waktu blok), setiap event log kontrak (Transfer, Swap, Mint), dan saldo setiap address di setiap blok. Tidak ada yang bisa menghapus atau mengubahnya.",
        "Yang tidak terlihat: identitas pemilik (kecuali ia mengumumkannya), niat ('apakah ini bayar utang atau layering?'), dan semua yang terjadi off-chain — kesepakatan OTC, chat Telegram, perintah dari bos.",
        "Yang menipu: angka yang terlihat benar tetapi menyesatkan. Volume DEX bisa 80% wash trading. TVL bisa dihitung ganda antar protokol. '10.000 holder' bisa berarti 10.000 address milik 3 orang. Setiap metrik on-chain butuh definisi yang defensif — inilah mengapa track ini ada.",
        "Cara membaca diagram di bawah: sumbu Y = pangsa supply, dua batang = 10 address teratas vs 190 sisanya. Interpretasi: 5% address menguasai 43% supply — klaim 'desentralisasi penuh' patut dipertanyakan, dan 10 dompet ini adalah titik risiko konsentrasi.",
      ],
      figure: {
        svg: CONC_SVG,
        alt: "Diagram batang: 10 address teratas menguasai 43 persen supply, 190 sisanya 57 persen.",
        caption: "Distribusi token sintetis (200 holder): 10 address teratas = 43% supply. Konsentrasi seperti ini umum di token baru.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: on-chain itu neraca, bukan laporan laba rugi",
        body: "Data on-chain mencatat PERPINDAHAN nilai dengan sempurna, tetapi tidak mencatat MAKNA ekonominya. Transfer 100 ETH bisa berarti jual-beli, pinjam-meminjam, atau pindah kantong sendiri — chain tidak mencatat alasannya. Karena itu analis on-chain selalu memasangkan data chain dengan label off-chain (exchange, mixer, peretas yang diketahui) dan pola perilaku. Tanpa label, kamu punya peta tanpa nama jalan.",
      },
      reference: "Terlihat: transaksi, event, saldo. Tak terlihat: identitas & niat. Menipu: volume/TVL/holder yang bisa dimanipulasi.",
    },
    {
      id: "lab-konsentrasi",
      eyebrow: "Langkah 4 · Lab",
      title: "Mengukur konsentrasi: CR-10 dan HHI",
      prose: [
        "Dua ukuran standar konsentrasi. Concentration Ratio CR-k = pangsa supply yang dipegang k holder terbesar. Herfindahl-Hirschman Index (HHI) = jumlah kuadrat pangsa tiap holder — menghukum dominasi satu-dua pemain raksasa lebih keras daripada CR.",
        "Aturan baca kasar (dipinjam dari analisis antitrust): HHI di bawah 0,15 = tersebar; 0,15–0,25 = terkonsentrasi sedang; di atas 0,25 = sangat terkonsentrasi. Untuk token kripto, HHI di atas 0,25 pada token yang mengklaim desentralisasi adalah red flag tata kelola.",
        "Lab: 200 address dengan saldo sintetis berpola pareto (seed 7 — mirip distribusi token nyata). Hitung total supply, pangsa 10 terbesar, dan HHI. Lalu jawab: apakah token ini 'terdesentralisasi'?",
      ],
      formula: String.raw`CR_k = \frac{\sum_{i=1}^{k} b_{(i)}}{\sum_{i=1}^{n} b_i} \qquad HHI = \sum_{i=1}^{n} s_i^2`,
      formulaNote: "b_(i) = saldo holder terbesar ke-i setelah diurutkan; s_i = pangsa holder i = b_i / total supply. HHI memakai pangsa desimal (0–1), sehingga rentangnya 0–1.",
      tasks: [
        { id: "t1", text: "Hitung `total` supply dan `top10_share` (CR-10)" },
        { id: "t2", text: "Hitung `hhi` dari seluruh holder" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "total=820480810  top10_share=0.433  hhi=0.0283",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"HHI kecil berarti aman.\" HHI 0,028 terlihat tersebar — tetapi CR-10 = 43%! HHI menghukum dominasi EKSTREM satu pemain; ia bisa kecil walau 10 pemain menguasai hampir separuh supply. Selalu laporkan CR-k BERSAMA HHI. Satu metrik tidak pernah cukup — ini tema berulang di seluruh track.",
      },
      hints: [
        "Urutkan saldo menurun: sorted(balances.values(), reverse=True).",
        "Pangsa = saldo / total. HHI = jumlah dari pangsa**2.",
        "top10_share = sum(srt[:10]) / total",
      ],
      code: {
        starter: `import random\nrandom.seed(7)  # JANGAN DIUBAH: data sintetis deterministik\nbalances = {f"0x{i:04x}": int(1_000_000 * random.paretovariate(1.16)) for i in range(200)}\n\n# TULIS KODEMU: total supply, pangsa 10 terbesar, HHI\ntotal = \nsrt = sorted(balances.values(), reverse=True)\ntop10_share = \nhhi = \n\nprint(f"total={total}  top10_share={top10_share:.3f}  hhi={hhi:.4f}")`,
        lockLines: 2,
        solution: `import random\nrandom.seed(7)  # JANGAN DIUBAH: data sintetis deterministik\nbalances = {f"0x{i:04x}": int(1_000_000 * random.paretovariate(1.16)) for i in range(200)}\n\n# TULIS KODEMU: total supply, pangsa 10 terbesar, HHI\ntotal = sum(balances.values())\nsrt = sorted(balances.values(), reverse=True)\ntop10_share = sum(srt[:10]) / total\nhhi = sum((b / total) ** 2 for b in balances.values())\n\nprint(f"total={total}  top10_share={top10_share:.3f}  hhi={hhi:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 820480810, tol: 1, label: "`total` = 820480810", msg: "total = sum(balances.values())." },
          { kind: "equal", task: "t1", name: "top10_share", value: 0.4328, tol: 0.001, label: "`top10_share` ≈ 0.433", msg: "Urutkan menurun, ambil 10 pertama, bagi total." },
          { kind: "equal", task: "t2", name: "hhi", value: 0.0283, tol: 0.001, label: "`hhi` ≈ 0.0283", msg: "Jumlahkan (saldo/total)**2 untuk semua holder." },
          { kind: "stdout_matches", task: "t3", pattern: "top10_share=0\\.43", label: "Output menampilkan top10_share", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "CR-k = pangsa k terbesar. HHI = Σ pangsa². Laporkan keduanya, jangan satu saja.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Pertanyaan apa → data apa",
      prose: [
        "Skenario 1 — 'Apakah token ini terkonsentrasi di segelintir tangan?' → data: seluruh saldo holder (state trie / token holder snapshot) → metrik: CR-10 + HHI. Contoh nyata: token governance yang 3 dompetnya bisa meloloskan proposal apa pun.",
        "Skenario 2 — 'Ke mana perginya dana curian?' → data: edge list transfer dari address sumber → teknik: graph traversal hop-per-hop (bcd10). Contoh nyata: pelacakan peretasan exchange.",
        "Skenario 3 — 'Apakah volume DEX ini organik?' → data: trade log + pola address → teknik: deteksi wash trading / circular trade (bcd6). Contoh nyata: token baru dengan volume Rp50 miliar tetapi 90% dari 20 address yang saling bertransaksi.",
        "Skenario 4 — 'Apakah protokol ini aman untuk dititipi dana?' → data: TVL, kedalaman likuiditas, event admin (mint, pause, upgrade) → teknik: analisis DeFi + tokenomics (bcd4, bcd5). Contoh nyata: audit likuiditas sebelum treasury perusahaan masuk ke yield farm.",
        "Skenario 5 — 'Dompet ini boleh dilayani exchange?' → data: histori address + label (mixer, sanctions) → teknik: risk scoring (bcd11). Contoh nyata: screening deposit untuk kepatuhan AML.",
        "Aturan praktis 10 detik: (1) tulis pertanyaannya dalam satu kalimat; (2) sebutkan tabel/kolom yang menjawabnya; (3) sebutkan SATU metrik yang bisa salah dan pasangannya. Kalau langkah 3 tidak bisa dijawab, pertanyaannya belum tajam.",
      ],
      tasks: [],
      reference: "Petakan dulu: pertanyaan → data → teknik → metrik + pasangannya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Token 'desentralisasi' dengan 43% di 10 dompet",
      prose: [
        "Sebuah proyek DeFi mengklaim '100% community owned, fully decentralized'. Kamu menarik snapshot holder: 200 address, total supply 820.480.810 token. Sepuluh address teratas memegang 43,3% supply; HHI = 0,028.",
        "Tim proyek membela diri: 'HHI kami cuma 0,028 — itu tersebar!' Bagaimana kamu menjawab dengan angka? Dan apa risiko nyatanya bagi investor ritel?",
        "Pembahasan: HHI rendah hanya berarti tidak ada SATU raksasa ekstrem — ia tidak membantah bahwa 10 dompet menguasai 43%. Dengan quorum governance tipikal 10–20%, 10 dompet ini (bahkan 3–4 di antaranya) bisa meloloskan proposal sepihak: menaikkan fee, mencetak token, atau menguras treasury. Klaim 'community owned' runtuh oleh CR-10, bukan HHI. Jawaban analis: laporkan KEDUANYA, dan uji skenario: 'berapa dompet terkecil yang bisa mencapai quorum?' — itulah angka yang relevan untuk tata kelola.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Konsentrasi holder adalah risiko tata kelola DAN risiko likuiditas: jika 2–3 dompet menjual bersamaan, slippage menghancurkan harga dan memicu likuidasi berantai di lending protocol. Selalu pasangkan analisis konsentrasi dengan simulasi 'bagaimana jika top-3 menjual 50% dalam sehari'.",
      },
      reference: "Uji klaim desentralisasi dengan CR-10 + simulasi quorum, bukan HHI saja.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Peta visibilitas: yang terang, yang remang, yang gelap",
      prose: [
        "Blockchain disebut `transparan` — tapi transparan tidak berarti semuanya terlihat. Bagi datanya menjadi tiga zona. ZONA TERANG (100% terlihat): semua transaksi, saldo, timestamp, fee, kode smart contract. ZONA REMANG (terlihat tapi ambigu): SIAPA di balik address (pseudonim!), NIAT di balik transaksi (beli vs cuci?), NILAI wajar NFT. ZONA GELAP (tidak terlihat sama sekali): data off-chain (identitas KYC di exchange, perjanjian OTC), private mempool / transaksi privat, dan layer-2 yang belum settle. Analis hebat tahu persis di zona mana ia bekerja — dan tidak mengklaim kepastian untuk zona remang/gelap.",
        "Contoh zona remang yang mahal: `paus Rp4 triliun` dari cerita lesson ini. Data TERANG: 12.000 address menerima dari satu sumber. Klaim `satu paus` = interpretasi zona REMANG (bisa jadi exchange dengan 12.000 nasabah!). Kesalahan analis pemula: menyajikan interpretasi remang sebagai fakta terang. Aturan: setiap klaim beri LABEL zona. `12.000 address menerima 4T dari sumber X [TERANG]. Kemungkinan besar exchange [REMANG, confidence 70%].` Label ini yang membedakan analis dari peramal.",
        "Contoh zona gelap yang menipu: exchange melaporkan volume Rp10 triliun/hari. Data on-chain hanya menunjukkan Rp2 triliun deposit/withdrawal. Selisih Rp8 triliun = trading OFF-CHAIN di dalam order book exchange (tidak tercatat di chain!). Analis yang menghitung `aktivitas chain` lalu menyimpulkan `volume exchange` sedang membandingkan apel dengan kebun apel. Selalu tanya: `data ini mencakup transaksi off-chain?` Jika tidak — dan hampir selalu tidak — tulis batasnya eksplisit.",
        "Rasio visibilitas per use-case: audit supply token = 95% terlihat (terang). Deteksi wash trading = 70% (pola terlihat, niat remang). Atribusi identitas = 30% (butuh data off-chain: label exchange, OSINT). Prediksi harga dari data on-chain = < 20% (harga ditentukan order book off-chain!). Mengetahui rasio ini MENCEGAH dua dosa: overclaim (`data on-chain membuktikan X`) dan underuse (`tidak ada yang bisa dianalisis`).",
        "Kasus nyata zona gelap: mixer Tornado Cash. Data terang: 100 ETH masuk dari A, 100 ETH keluar ke B (waktu berbeda). Hubungan A→B = ZONA GELAP (kriptografi memutus tautan). Analis yang mengklaim `A mengirim ke B via mixer` tanpa bukti tambahan = fitnah berbasis tebakan. Yang BISA dilakukan: analisis heuristik (timing, nominal) dengan confidence RENDAH + label remang. Kejujuran tentang kegelapan adalah kompetensi, bukan kelemahan.",
        "Untuk tiap analisis yang kamu buat, tulis `peta visibilitas` 3 baris: (1) apa yang 100% terlihat + sumbernya; (2) apa yang diinterpretasi + confidence + alternatifnya; (3) apa yang tidak terlihat + bagaimana itu membatasi kesimpulan. Tiga baris ini = 5 menit kerja yang mengubah laporanmu dari `kelihatan pintar` menjadi `bisa dipertanggungjawabkan`. Di depan auditor, regulator, atau direksi — yang kedua jauh lebih berharga.",
        "Terakhir: visibilitas BERUBAH seiring waktu. Dulu MEV tidak terlihat (2020); sekarang dashboard MEV real-time. Dulu identitas exchange gelap; sekarang label komunitas + data Arkham. Setiap kuartal, tanyakan: `zona apa yang baru terang?` Analis yang update peta visibilitasnya tiap kuartal selalu selangkah di depan yang memakai peta 2023.",
      ],
      formula: String.raw`V = \frac{\text{data terlihat}}{\text{data dibutuhkan}} \times 100\%`,
      formulaNote: "V = rasio visibilitas untuk SATU pertanyaan spesifik (bukan untuk `blockchain` secara umum!). > 80% = analisis kuat; 40–80% = butuh label confidence; < 40% = jangan klaim, cari data tambahan. Hitung per pertanyaan, bukan per dataset.",
      figure: {
        svg: BCD1_DEEP_SVG,
        alt: "Diagram batang rasio visibilitas: audit supply 95%, wash trading 70%, atribusi identitas 30%, prediksi harga 20%.",
        caption: "Cara membaca: panjang batang = % pertanyaan yang bisa dijawab murni dari data on-chain. Interpretasi: tidak semua pertanyaan `blockchain` sama terbukanya — audit supply hampir fully visible, prediksi harga < 20% (harga ada di order book off-chain). Kenali zonamu sebelum klaim.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: transparan ≠ semuanya terlihat",
        body: "`Blockchain itu transparan` adalah slogan, bukan strategi analisis. Yang transparan: transaksi, saldo, kode. Yang tetap gelap: siapa, niat, dan semua yang off-chain. Analis profesional melabeli setiap klaim dengan zonanya — dan tidak pernah menyajikan tebakan remang sebagai fakta terang.",
      },
      reference: "Tulis peta visibilitas 3 baris untuk tiap analisis. Update tiap kuartal.",
    },
    {
      id: "konsensus-dasar",
      eyebrow: "Langkah 8 · Konsensus",
      title: "Bagaimana jaringan sepakat: konsensus",
      prose: [
        "Bayangkan ruang rapat berisi 10.000 komputer yang tidak saling kenal, tidak saling percaya, dan sebagian di antaranya penipu. Tugas mereka: menyepakati SATU buku kas — siapa memiliki apa, dalam urutan apa. Tidak ada ketua rapat, tidak ada server pusat, tidak ada yang bisa mengetuk palu. Inilah masalah yang dipecahkan konsensus: bagaimana ribuan pihak yang saling curiga mencapai satu kebenaran bersama tanpa wasit.",
        "Tiga keluarga pendekatan besar menjawab pertanyaan yang sama — 'siapa yang boleh menulis halaman berikutnya, dan bagaimana yang lain memverifikasinya?' Proof-of-work berkata: yang boleh menulis adalah yang pertama memecahkan teka-teki komputasi yang mahal — tiket lotrenya dibayar dengan listrik. Proof-of-stake berkata: penulis dipilih dari mereka yang mempertaruhkan koinnya sebagai jaminan — curang, jaminannya dipotong. BFT klasik berkata: komite kecil yang sudah saling dikenal menandatangani bersama — cepat dan pasti, tetapi komitenya harus kecil.",
        "Perbedaan yang penting untuk analis: proof-of-work dan proof-of-stake memberi kepastian PROBABILISTIK — kesepakatan menguat setiap kali satu blok baru ditumpuk di atasnya, tetapi secara teori selalu bisa dibalik. BFT memberi kepastian DETERMINISTIK — begitu dua pertiga komite menandatangani, selesai, titik. Harganya: komite kecil berarti lebih tersentralisasi, jadi tidak cocok untuk jaringan terbuka beranggotakan ribuan node anonim.",
        "Semua desain ini berdiri di atas satu asumsi: MAYORITAS kekuatan itu jujur. Serangan 51% adalah nama konsepnya — jika satu pihak menguasai lebih dari separuh kekuatan (komputasi di PoW, taruhan di PoS), ia bisa menulis ulang beberapa halaman terakhir sesuai versinya: membatalkan pembayarannya sendiri setelah barang diterima. Ini bukan teori belaka: beberapa chain kecil pernah mengalaminya. Harga serangan = harga menyewa atau membeli 51% kekuatan itu — dan untuk chain besar, harganya astronomis.",
        "Kenapa analis data harus peduli dengan mesin di bawah datanya? Karena konsensus menentukan DUA sifat data yang kamu baca setiap hari: kecepatan blok — berapa lama satu 'halaman' ditutup (10 menit vs 12 detik mengubah granularitas timestamp analisismu); dan seberapa sering reorganisasi terjadi — seberapa besar kemungkinan data 'final' kemarin berubah hari ini. Memahami mesinnya membuatmu membaca datanya dengan benar.",
        "💡 Intuisi: konsensus itu juri tanpa ketua. Bayangkan 10.000 juri anonim harus sepakat pada satu vonis tanpa pernah bertemu. Aturannya dirancang agar jujur LEBIH MENGUNTUNGKAN daripada curang: di PoW, menyerang berarti membakar listrik untuk hasil yang belum pasti; di PoS, menyerang berarti mempertaruhkan — dan kehilangan — taruhannya sendiri. Keamanan blockchain bukan soal 'tidak bisa diserang', melainkan 'menyerang itu rugi'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Konsensus berarti semua node menyetujui setiap transaksi.\" Tidak. Node menyetujui ATURAN permainannya — lalu masing-masing mengikuti rantai terpanjang/terberat sesuai aturan itu, tanpa perlu berunding per transaksi. Yang disepakati adalah prosedurnya; hasilnya mengikuti sendiri. Karena itu node baru bisa 'mengejar' seluruh sejarah sendirian hanya dengan memeriksa aturan, tanpa bertanya ke siapa pun.",
      },
      reference: "Konsensus = prosedur tanpa wasit agar ribuan pihak yang tak saling percaya sepakat pada satu riwayat. PoW/PoS = kepastian probabilistik; BFT = deterministik.",
    },
    {
      id: "finality",
      eyebrow: "Langkah 9 · Finality",
      title: "Finality: kapan transaksi dianggap selesai",
      prose: [
        "Transaksimu 'masuk blok' — apakah ia selesai? Belum tentu. Bedakan dua hal: kuitansi vs dana benar-benar masuk. Kuitansi = bukti sementara bahwa sesuatu tercatat; dana masuk = tidak bisa ditarik kembali. Di blockchain proof-of-work, blok baru adalah kuitansi. Finality adalah titik di mana membatalkannya menjadi praktis mustahil — dan titik itu BERGESER tergantung seberapa besar nilainya.",
        "Finalitas probabilistik bekerja seperti ini: setiap blok baru yang ditumpuk di atas transaksimu disebut satu 'konfirmasi', dan peluang penyerang mengejar lalu menulis ulang turun EKSPONENSIAL — bukan linear — terhadap jumlah konfirmasi. Karena itu warung kopi berani menerima 0-konfirmasi untuk Rp20 ribu (risikonya lebih murah daripada biaya menunggu), tetapi exchange menuntut 12, 30, bahkan 60 konfirmasi untuk deposit Rp5 miliar. Angka-angka itu bukan magis — itu harga risiko yang diterjemahkan ke jumlah blok.",
        "Ada juga finalitas deterministik — atau versi ekonominya. Beberapa protokol punya 'checkpoint': begitu rantai melewati titik tertentu, aturan melarang reorganisasi melewati titik itu. Titik. Di desain lain, finalitasnya EKONOMI: membalikkan sejarah berarti menghancurkan taruhan raksasa milik penyerang sendiri, sehingga serangan yang 'berhasil' pun merugi. Intinya sama: ada garis yang setelah dilewati, sejarah dikunci.",
        "Reorganisasi (reorg) adalah saat jaringan membuang beberapa blok terakhir dan menggantinya dengan versi saingan yang lebih 'berat'. Dampaknya ke data — dan ini penting untuk analis: transaksimu bisa BERPINDAH blok (dari blok 100 menjadi 101), atau HILANG total digantikan transaksi penyerang (inilah double spend). Blok yang kalah disebut blok yatim: valid, tetapi tidak masuk sejarah resmi. Konsekuensi praktisnya: jendela data yang belum final TIDAK BOLEH diperlakukan sebagai fakta final. Dasbor yang menghitung 'deposit hari ini' dari transaksi 1-konfirmasi bisa berubah angkanya besok pagi — dan itu bukan bug datamu.",
        "Aturan praktisnya: semakin besar nilai, semakin banyak konfirmasi yang ditunggu sebelum dianggap final — kebijakan konfirmasi per nilai transaksi. Exchange besar mempublikasikan tabelnya: deposit kecil butuh belasan konfirmasi, deposit raksasa butuh puluhan. Untuk analis, terjemahannya: beri LABEL kematangan pada setiap angka — 'final' vs 'menunggu N konfirmasi'. Laporan yang mencampur keduanya tanpa label sedang membandingkan apel matang dengan apel mentah.",
        "💡 Intuisi: konfirmasi itu lapis beton. Setiap blok baru menuang satu lapis beton lagi di atas transaksimu. Membatalkannya berarti membobol SEMUA lapis sekaligus sebelum lapis berikutnya dituang — dan tiap lapis membuat pekerjaan berikutnya lebih berat secara eksponensial. Itulah kenapa tabel di lab nanti berbentuk jurang, bukan lereng landai.",
        "Lab: ukur sendiri seberapa curam jurangnya. Rumus sederhana warisan lampiran whitepaper Bitcoin (versi gambler's ruin): peluang penyerang berporsi kekuatan q menyalip rantai yang sudah unggul z blok adalah (q/p)^z, dengan p = 1 − q. Hitung untuk q = 10% dan q = 30% pada z = 1 sampai 6, lalu jawab: berapa konfirmasi agar risiko di bawah 1% saat penyerang memegang 30% kekuatan?",
      ],
      formula: String.raw`P(z) = \left(\frac{q}{p}\right)^z \quad \text{untuk } q < p`,
      formulaNote: "P(z) = peluang penyerang menyalip rantai yang sudah unggul z blok. q = porsi kekuatan penyerang (0–1); p = 1 − q = porsi kekuatan jujur; z = jumlah konfirmasi. Jika q ≥ p (penyerang mayoritas), P(z) = 1 — ia pasti menang cepat atau lambat. Ini versi sederhana; versi penuh memakai distribusi Poisson, tetapi polanya sama: risiko runtuh EKSPONENSIAL terhadap z.",
      tasks: [
        { id: "t1", text: "Implementasikan fungsi `peluang(q, z)` sesuai rumus (kembalikan 1.0 bila q ≥ p)" },
        { id: "t2", text: "Bangun `tabel` untuk semua pasangan Q_LIST × Z_LIST, lalu cetak sebagai tabel" },
        { id: "t3", text: "Tentukan `butuh_z_q03`: z terkecil sehingga peluang(0.3, z) < 0,01, lalu cetak" },
      ],
      expected: "Risiko runtuh eksponensial terhadap z. q=0,1: z=6 → ≈0,00019%. q=0,3: z=5 → 1,45% (belum cukup), z=6 → 0,62% → butuh_z_q03 = 6.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"6 konfirmasi = 100% aman.\" Salah. Keamanan adalah FUNGSI dari dua variabel — jumlah konfirmasi DAN kekuatan penyerang — bukan angka tetap. Enam konfirmasi melawan penyerang 10% berarti risiko 0,00019% (abaikan saja); melawan penyerang 40% berarti (0,4/0,6)^6 ≈ 8,8% — masih sangat nyata. Jangan hafal angka konfirmasi; hitung dari q yang kamu asumsikan.",
      },
      hints: [
        "q ≥ p artinya penyerang menguasai mayoritas — kembalikan 1.0 langsung.",
        "Rumus intinya satu baris: (q / (1 - q)) ** z.",
        "Untuk t3: iterasi Z_LIST, ambil z pertama dengan peluang(0.3, z) < 0.01.",
      ],
      code: {
        starter: `Q_LIST = [0.1, 0.3]  # porsi kekuatan penyerang (tetap, jangan diubah)
Z_LIST = [1, 2, 3, 4, 5, 6]  # jumlah konfirmasi (tetap, jangan diubah)

# TULIS KODEMU: definisikan peluang(q, z), bangun tabel, tentukan butuh_z_q03
def peluang(q, z):
    
`,
        lockLines: 2,
        solution: `Q_LIST = [0.1, 0.3]  # porsi kekuatan penyerang (tetap, jangan diubah)
Z_LIST = [1, 2, 3, 4, 5, 6]  # jumlah konfirmasi (tetap, jangan diubah)

# TULIS KODEMU: definisikan peluang(q, z), bangun tabel, tentukan butuh_z_q03
def peluang(q, z):
    p = 1 - q
    if q >= p:
        return 1.0
    return (q / p) ** z

tabel = {q: [peluang(q, z) for z in Z_LIST] for q in Q_LIST}

print("z | q=0.1      | q=0.3")
for i, z in enumerate(Z_LIST):
    print(f"{z} | {tabel[0.1][i]:.6f} | {tabel[0.3][i]:.4f}")

butuh_z_q03 = next(z for z in Z_LIST if peluang(0.3, z) < 0.01)
print(f"butuh_z_q03 = {butuh_z_q03}")

risiko_q01_z6 = tabel[0.1][5]
risiko_q03_z1 = tabel[0.3][0]`,
        checks: [
          { kind: "defined", task: "t1", name: "peluang", label: "Fungsi `peluang` terdefinisi", msg: "Definisikan def peluang(q, z): ..." },
          { kind: "equal", task: "t1", name: "risiko_q01_z6", value: 0.0000018817, tol: 1e-9, label: "peluang(0.1, 6) ≈ 1,88e-6", msg: "(0.1/0.9)**6 — pastikan rumus (q/p)**z dipakai." },
          { kind: "equal", task: "t1", name: "risiko_q03_z1", value: 0.4285714286, tol: 1e-9, label: "peluang(0.3, 1) ≈ 0,4286", msg: "(0.3/0.7)**1 — cek pembagi p = 1 - q." },
          { kind: "equal", task: "t3", name: "butuh_z_q03", value: 6, label: "`butuh_z_q03` = 6", msg: "z=5 memberi 1,45% (masih ≥ 1%), z=6 memberi 0,62% — ambil yang pertama di bawah 0,01." },
          { kind: "stdout_matches", task: "t2", pattern: "z \\| q=0\\.1", label: "Tabel tercetak dengan header", msg: "Cetak header lalu satu baris per z." },
          { kind: "stdout_matches", task: "t3", pattern: "butuh_z_q03 = 6", label: "Jawaban t3 tercetak", msg: "print(f\"butuh_z_q03 = {butuh_z_q03}\")." },
        ],
      },
      reference: "Finality = titik di mana pembatalan praktis mustahil. Probabilistik: risiko turun eksponensial per konfirmasi. Kebijakan: makin besar nilai, makin banyak konfirmasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Blockchain = dataset publik pseudonim: semua transaksi terlihat, identitas tidak.",
        "Lima lensa analisis: aliran dana, konsentrasi, kesehatan protokol, anomali, tokenomics.",
        "CR-k mengukur pangsa k terbesar; HHI menghukum dominasi ekstrem — laporkan keduanya.",
        "Angka on-chain bisa menipu (wash volume, TVL ganda); definisikan metrik secara defensif.",
        "Mulai dari pertanyaan, bukan dari unduhan data.",
      ],
      next: { label: "BCD2 — Membaca Data Chain", href: "/learn/bcd2-data" },
      quiz: [
        {
          q: "Mengapa blockchain disebut pseudonim, bukan anonim?",
          options: [
            { text: "Karena nama pemilik tertulis di blok", why: "Tidak ada nama di blok — hanya address heksadesimal." },
            { text: "Karena address adalah ID permanen yang seluruh perilakunya terekam publik selamanya", why: "Pola perilaku address bisa dianalisis dan dilabeli tanpa tahu nama pemiliknya.", correct: true },
            { text: "Karena semua orang tahu pemilik tiap address", why: "Justru tidak — identitas hanya diketahui bila pemilik mengumumkannya." },
            { text: "Karena transaksi bisa dihapus", why: "Transaksi on-chain tidak bisa dihapus — itu inti imutabilitasnya." },
          ],
        },
        {
          q: "Token: CR-10 = 43%, HHI = 0,028. Klaim 'fully decentralized' — penilaianmu?",
          options: [
            { text: "Valid, HHI kecil berarti tersebar", why: "HHI kecil hanya berarti tak ada satu raksasa ekstrem; 10 dompet tetap kuasai 43%." },
            { text: "Meragukan — 10 dompet menguasai 43% bisa mengendalikan governance walau HHI kecil", why: "Quorum tipikal 10–20%: segelintir dompet bisa meloloskan proposal sepihak.", correct: true },
            { text: "Tidak bisa dinilai tanpa harga token", why: "Konsentrasi adalah soal distribusi, bukan harga." },
            { text: "Aman karena holder-nya 200", why: "Jumlah holder tidak menjamin sebaran — 200 address bisa milik segelintir orang." },
          ],
        },
        {
          q: "Analis ingin tahu 'apakah volume DEX ini organik'. Data + teknik yang tepat?",
          options: [
            { text: "Saldo holder + HHI", why: "Itu untuk konsentrasi, bukan keorganikan volume." },
            { text: "Trade log + pola address: deteksi wash trading / circular trade", why: "Volume palsu terlihat dari address yang saling bertransaksi berulang.", correct: true },
            { text: "Harga token + market cap", why: "Harga tidak membedakan volume asli vs palsu." },
            { text: "Jumlah node validator", why: "Tidak relevan dengan volume trading." },
          ],
        },
        {
          q: "Apa yang TIDAK bisa dijawab murni dari data on-chain?",
          options: [
            { text: "Saldo sebuah address", why: "Saldo tercatat eksplisit di state chain." },
            { text: "Total fee yang dibayar sebuah address", why: "Fee tercatat di setiap transaksi." },
            { text: "Niat di balik sebuah transfer (utang vs layering vs pindah kantong)", why: "Chain mencatat perpindahan nilai, bukan alasan ekonominya — butuh label off-chain.", correct: true },
            { text: "Timestamp sebuah transaksi", why: "Timestamp blok tercatat permanen." },
          ],
        },
        {
          q: "Aturan praktis sebelum menyentuh data — yang paling tepat?",
          options: [
            { text: "Unduh semua data dulu, pertanyaan menyusul", why: "Dataset on-chain tak berujung — tanpa pertanyaan kamu tenggelam." },
            { text: "Tulis pertanyaan satu kalimat, sebutkan tabel/kolomnya, dan siapkan metrik pasangan untuk tiap metrik", why: "Ini memangkas data yang dibutuhkan dan mencegah salah baca satu metrik.", correct: true },
            { text: "Mulai dari visualisasi yang paling bagus", why: "Visual tanpa pertanyaan = dekorasi." },
            { text: "Fokus ke harga, sisanya menyusul", why: "Harga adalah output pasar, bukan fondasi analisis on-chain." },
          ],
        },
        {
          q: "Analis mengklaim `paus X mengirim 100 ETH ke mixer lalu ke bandar Y` hanya dari data deposit/withdrawal mixer. Masalahnya?",
          options: [
            { text: "Tidak ada — datanya transparan, jadi pasti benar", why: "Yang transparan: 100 ETH masuk dari X, 100 ETH keluar ke Y (waktu berbeda). HUBUNGANNYA = zona gelap (kriptografi mixer memutus tautan). Transparan ≠ semuanya terlihat." },
            { text: "Klaim zona gelap disajikan sebagai fakta — butuh label confidence + bukti tambahan", why: "Tepat. Hubungan X→Y via mixer adalah zona GELAP; heuristik timing/nominal hanya memberi confidence rendah (zona remang). Klaim tanpa label = fitnah berbasis tebakan.", correct: true },
            { text: "Mixer tidak tercatat di blockchain", why: "Salah — deposit dan withdrawal mixer TERCATAT (terang). Yang tidak tercatat adalah TAUTAN di antaranya." },
            { text: "100 ETH terlalu kecil untuk dianalisis", why: "Nominal tidak relevan dengan masalahnya. Masalahnya adalah zona visibilitas klaim, bukan ukuran transaksi." },
          ],
        },
      ],
    },
  ],
};
