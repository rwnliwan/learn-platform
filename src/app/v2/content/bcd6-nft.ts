import type { V2Lesson } from "../lib/types";

// Pola wash: A->B->A dan A->C->A melingkar; C->D, E->F->G normal.
const WASH_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Diagram perdagangan NFT: A-B-A dan A-C-A membentuk lingkaran wash trading, sedangkan C-D dan E-F-G adalah rantai normal.">
<g font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600" text-anchor="middle">
<text x="110" y="60">A</text><text x="250" y="60">B</text><text x="110" y="180">C</text><text x="250" y="180">D</text><text x="380" y="120">E</text><text x="430" y="170">F</text><text x="380" y="210">G</text></g>
<g stroke="var(--c4)" stroke-width="2.5" fill="none" marker-end="url(#wa)"><defs><marker id="wa" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--c4)" stroke-width="1.5"/></marker></defs>
<path d="M125,60 Q185,30 235,55"/><path d="M235,70 Q185,100 125,70"/>
<path d="M125,180 Q160,110 125,75"/><path d="M110,75 Q80,120 110,170"/></g>
<text x="180" y="34" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">wash: A⇄B</text>
<text x="60" y="128" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">wash: A⇄C</text>
<g stroke="var(--c1)" stroke-width="2" fill="none"><line x1="265" y1="180" x2="300" y2="180"/><line x1="390" y1="132" x2="418" y2="158"/><line x1="422" y1="182" x2="392" y2="198"/></g>
<text x="285" y="170" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">normal</text>
<text x="240" y="222" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Lingkaran A→B→A→C→A = wash trading · rantai E→F→G = distribusi normal</text>
</svg>`;

const BCD6_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Volume PixelApe: tercatat 1.200 ETH vs volume asli 820 ETH setelah buang wash."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">600</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1200</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">1.200 ETH</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Tercatat</text><rect x="294.7" y="70.7" width="129.6" height="109.3" rx="3" fill="var(--c1)"/><text x="359.5" y="64.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">820 ETH</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Asli</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">ETH / 30 hari</text></svg>`;

export const bcd6: V2Lesson = {
  slug: "bcd6-nft",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD6 — Data NFT: Wash Trading & Valuasi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Koleksi yang 'terjual' 5 kali dalam sehari",
      prose: [
        "Koleksi NFT PixelApe #4421 terjual 5 kali dalam 24 jam: 5 ETH → 5,2 → 5,5 → 5,8 → 6,1. 'Naik terus! Bullish!' tulis akun-akun kripto. Seorang kolektor FOMO membelinya di 6,5 ETH. Seminggu kemudian: tidak ada penawaran di atas 2 ETH. Ia rugi 70%.",
        "Yang tidak ia lihat: kelima 'penjualan' itu adalah A→B→A→C→A — dua dompet yang sama memantulkan NFT bolak-balik sambil menaikkan harga tiap putaran. Tidak ada pembeli baru sama sekali. Volume Rp4 miliar koleksi itu dalam sebulan? 92% di antaranya wash.",
        "Twist-nya: di pasar tradisional, wash trading adalah kejahatan yang disembunyikan. Di NFT, ia dilakukan TERANG-TERANGAN di blockchain publik — dan tetap menipu, karena yang dilihat orang hanyalah 'harga naik terus'. Lesson ini: mendeteksi pola melingkar dan menilai NFT tanpa tertipu volume. Tujuan: (1) mendeteksi wash trade dari pola reciprocal; (2) membangun metrik volume 'bersih'; (3) kerangka valuasi NFT yang defensif. Peta: cerita → anatomi wash → lab deteksi → valuasi → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga sidik jari wash trading dengan contoh; (2) menghitung rasio wash dari data transaksi; (3) menilai NFT secara defensif (floor yang jujur); (4) memutuskan kapan curiga vs kapan menilai wajar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Volume tinggi = permintaan tinggi.\" Di NFT, volume adalah metrik TERMUDAH dimanipulasi: dua dompet + sedikit fee gas = volume tak terbatas. Chainalysis pernah menemukan satu koleksi dengan 97% volume wash. Selalu tanyakan: berapa volume dari PEMBELI UNIK yang tidak saling bertransaksi?",
      },
      reference: "Volume NFT ≠ permintaan. Uji: pembeli unik + tidak resiprokal.",
    },
    {
      id: "anatomi-wash",
      eyebrow: "Langkah 2 · Anatomi wash",
      title: "Tiga sidik jari perdagangan palsu",
      prose: [
        "Satu — Resiprokal (A→B→A): NFT kembali ke penjual semula dalam waktu singkat. Ini sidik jari paling jelas — dalam pasar normal, barang yang dijual jarang dibeli balik dari pembelinya dalam hitungan blok.",
        "Dua — Harga menanjak artifisial: tiap putaran naik sedikit (5 → 5,2 → 5,5) untuk memalsukan tren. Pembeli normal menawar TURUN, bukan menaikkan harga barang yang baru dibelinya.",
        "Tiga — Lingkaran tertutup: A→B→C→A. Lebih sulit dideteksi daripada resiprokal langsung, tetapi graf transaksi (bcd10) membongkarnya: komponen yang aliran NFT-nya tidak pernah keluar.",
        "Motifnya: memanipulasi 'floor price' dan ranking marketplace (yang mengurutkan berdasar volume), lalu menjual ke FOMO buyer di harga palsu — persis korban di cerita pembuka.",
      ],
      figure: {
        svg: WASH_SVG,
        alt: "Diagram perdagangan NFT: A-B-A dan A-C-A membentuk lingkaran wash trading, sedangkan C-D dan E-F-G adalah rantai normal.",
        caption: "Lingkaran A⇄B dan A⇄C = wash (NFT kembali ke penjual). Rantai E→F→G = distribusi normal ke tangan baru. Cara membaca: panah = arah NFT; lingkaran panah (A→B→A) = NFT kembali ke penjual = sidik jari wash; rantai lurus = pindah ke pemilik baru. Interpretasi: 5 dari 8 transaksi membentuk lingkaran — 62,5% `aktivitas` koleksi ini adalah udara.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: ikuti NFT-nya, bukan uangnya",
        body: "Untuk wash trading NFT, unit analisisnya adalah BARANG (tokenId), bukan uang. Pertanyaan kuncinya: 'dalam 30 hari terakhir, berapa tangan BERBEDA yang benar-benar memegang NFT ini?' Jika jawabannya 2 (A dan B memantulkan), maka 5 'penjualan' = 0 penemuan harga. Lacak tokenId sebagai 'paspor' — setiap cap (transfer) tercatat; paspor yang hanya bolak-balik dua kota = perjalanan palsu.",
      },
      reference: "Unit analisis wash NFT = tokenId. Hitung tangan berbeda, bukan jumlah penjualan.",
    },
    {
      id: "lab-wash",
      eyebrow: "Langkah 3 · Lab",
      title: "Menangkap lingkaran",
      prose: [
        "Delapan penjualan sintetis (penjual, pembeli, harga ETH, blok). Aturan deteksi: penjualan i adalah wash jika ada penjualan j berlawanan arah (pembeli↔penjual bertukar) dalam selisih ≤ 10 blok.",
        "Tugasmu: hitung jumlah penjualan wash, total penjualan, dan daftar pasangan address yang terlibat wash.",
      ],
      formula: String.raw`\text{wash}(i) \iff \exists j: s_j = b_i \land b_j = s_i \land |blk_i - blk_j| \le 10`,
      formulaNote: "s_i, b_i = penjual & pembeli penjualan i; blk = nomor blok. Artinya: ada transaksi berlawanan arah antara pasangan yang sama dalam jendela 10 blok.",
      tasks: [
        { id: "t1", text: "Hitung `wash_count` (penjualan yang memenuhi aturan)" },
        { id: "t2", text: "Bangun `wash_pairs` (pasangan address wash, terurut)" },
        { id: "t3", text: "Cetak `wash_count`, total, dan `wash_pairs`" },
      ],
      expected: "wash=5 dari 8  pairs=[['A', 'B'], ['A', 'C']]",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"A menjual ke B lalu B menjual ke C = wash.\" BUKAN — itu rantai distribusi normal (barang berpindah ke tangan baru). Wash butuh ARUS BALIK: barang kembali ke penjual semula (langsung atau via perantara). Salah kaprah ini membuat analis menuduh flipper normal sebagai manipulator.",
      },
      hints: [
        "Untuk tiap penjualan i, cari j dengan penjual/pembeli bertukar & selisih blok ≤ 10.",
        "Gunakan set agar penjualan tidak terhitung ganda.",
        "Pasangan dinormalisasi: sorted([s, b]) sebagai list.",
      ],
      code: {
        starter: `# (penjual, pembeli, harga_eth, blok)\nsales = [("A","B",5.0,100),("B","A",5.1,101),("C","D",3.0,102),("A","C",5.0,103),\n         ("C","A",5.2,104),("E","F",2.0,105),("F","G",2.1,106),("B","A",5.0,107)]\n\n# TULIS KODEMU: tandai penjualan wash (resiprokal dalam <= 10 blok)\nwash_idx = set()\nfor i, (s1, b1, _, blk1) in enumerate(sales):\n    for j, (s2, b2, _, blk2) in enumerate(sales):\n        if :\n            wash_idx.add(i); wash_idx.add(j)\n\nwash_count = len(wash_idx)\nwash_pairs = [list(p) for p in sorted({tuple(sorted([sales[i][0], sales[i][1]])) for i in wash_idx})]\n\nprint(f"wash={wash_count} dari {len(sales)}  pairs={wash_pairs}")`,
        lockLines: 4,
        solution: `# (penjual, pembeli, harga_eth, blok)\nsales = [("A","B",5.0,100),("B","A",5.1,101),("C","D",3.0,102),("A","C",5.0,103),\n         ("C","A",5.2,104),("E","F",2.0,105),("F","G",2.1,106),("B","A",5.0,107)]\n\n# TULIS KODEMU: tandai penjualan wash (resiprokal dalam <= 10 blok)\nwash_idx = set()\nfor i, (s1, b1, _, blk1) in enumerate(sales):\n    for j, (s2, b2, _, blk2) in enumerate(sales):\n        if i != j and s2 == b1 and b2 == s1 and abs(blk1 - blk2) <= 10:\n            wash_idx.add(i); wash_idx.add(j)\n\nwash_count = len(wash_idx)\nwash_pairs = [list(p) for p in sorted({tuple(sorted([sales[i][0], sales[i][1]])) for i in wash_idx})]\n\nprint(f"wash={wash_count} dari {len(sales)}  pairs={wash_pairs}")`,
        checks: [
          { kind: "equal", task: "t1", name: "wash_count", value: 5, tol: 0, label: "`wash_count` = 5", msg: "A⇄B (3 penjualan) + A⇄C (2 penjualan) = 5. C-D dan E-F-G bukan wash." },
          { kind: "equal", task: "t2", name: "wash_pairs", value: [["A", "B"], ["A", "C"]], tol: 0, label: "`wash_pairs` = [['A','B'],['A','C']]", msg: "Normalisasi pasangan dengan sorted." },
          { kind: "stdout_matches", task: "t3", pattern: "wash=5 dari 8", label: "Output menampilkan wash=5 dari 8", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Wash = arus balik (langsung/via perantara) dalam jendela waktu sempit.",
    },
    {
      id: "valuasi",
      eyebrow: "Langkah 4 · Valuasi defensif",
      title: "Menilai barang yang tidak punya arus kas",
      prose: [
        "NFT tidak menghasilkan arus kas — valuasinya murni soal 'berapa orang mau membayar'. Kerangka defensif tiga lapis. Satu — harga BERSIH: buang semua penjualan wash, ambil median penjualan organik 90 hari terakhir (median, bukan rata-rata — tahan terhadap outlier).",
        "Dua — likuiditas: berapa penjualan organik per bulan? NFT dengan median 10 ETH tetapi 1 penjualan per 6 bulan = tidak likuid; valuasi '10 ETH' hanya teori sampai ada pembeli. Haircut 30–50% untuk koleksi tidak likuid.",
        "Tiga — komparabel: bandingkan dengan trait sejenis di koleksi yang sama (rarity tier), bukan dengan 'penjualan termahal sepanjang masa' yang mungkin wash.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: floor price adalah harga PENAWAR, bukan harga TRANSAKSI",
        body: "Floor price = harga listing TERENDAH, bukan harga jual terakhir. Di pasar sepi, floor bisa dipatok 10 ETH sementara tidak ada yang beli di atas 4 ETH selama berbulan-bulan. Analis valuasi memakai HARGA TRANSAKSI organik (apa yang benar-benar dibayar), bukan harga pajangan. Beda keduanya = 'ilusi likuiditas'.",
      },
      reference: "Valuasi = median penjualan organik + haircut likuiditas + komparabel trait.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan curiga, kapan nilai",
      prose: [
        "Skenario 1 — Koleksi baru, volume meledak, harga naik tiap jam → curiga wash: hitung % resiprokal < 24 jam. Di atas 50% = jangan sentuh sebagai investasi.",
        "Skenario 2 — Menilai NFT untuk agunan pinjaman → pakai median penjualan organik 90 hari MINUS haircut likuiditas (30–50%). Jangan pernah pakai floor price.",
        "Skenario 3 — Marketplace menyusun ranking 'top collection' → pakai volume BERSIH (buang wash) + jumlah pembeli unik. Ranking kotor = mempromosikan manipulator.",
        "Skenario 4 — Investigasi: 'apakah penjualan 6,1 ETH kemarin organik?' → lacak paspor tokenId: berapa tangan berbeda dalam 30 hari? Jika ≤ 2 = manipulasi harga untuk exit ke FOMO buyer.",
        "Aturan praktis 10 detik: (1) buang wash dulu, baru hitung apa pun; (2) median > rata-rata; (3) transaksi > listing. Urutan ini tidak bisa dibalik.",
      ],
      tasks: [],
      reference: "Buang wash → median organik → haircut likuiditas. Urutan tetap.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "PixelApe #4421: dari 6,1 ETH ke 2 ETH",
      prose: [
        "Data: 5 penjualan 24 jam (5 → 5,2 → 5,5 → 5,8 → 6,1 ETH), pola A→B→A→C→A. Volume koleksi sebulan: Rp4 miliar, 92% wash. Korban membeli di 6,5 ETH; seminggu kemudian bid tertinggi 2 ETH.",
        "Valuasi defensif pasca-kejadian: buang 5 penjualan wash → penjualan organik terakhir = 1,8 ETH (3 minggu sebelumnya). Likuiditas: 2 penjualan organik/bulan → haircut 40%. Nilai wajar ≈ 1,8 × 0,6 ≈ 1,1 ETH. Korban membayar 6,5 ETH — 6× nilai wajar.",
        "Pembahasan: (a) kenaikan harga berurutan + resiprokal cepat = dua sidik jari yang masing-masing cukup untuk curiga; (b) marketplace yang menampilkan 'harga terakhir 6,1 ETH' tanpa label wash ikut andil — desain metrik adalah keputusan etis; (c) pelajaran: JANGAN PERNAH membeli di puncak 'tren' yang seluruhnya dibentuk ≤ 3 dompet.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Lending protocol yang menerima NFT sebagai agunan dengan valuasi 'harga terakhir' (termasuk wash) = memberi pinjaman Rp10 miliar dengan agunan Rp2 miliar. Standar yang sehat: agunan NFT = median organik × (1 − haircut), loan-to-value ≤ 40%. Wash trading bukan cuma masalah kolektor — ia risiko kredit.",
      },
      reference: "Agunan NFT = median organik × (1 − haircut), LTV ≤ 40%.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Rasio wash: berapa volume yang asli",
      prose: [
        "Koleksi PixelApe: volume 30 hari = 1.200 ETH. Terdengar likuid. Bedah: 5 pasang address (A⇄B, A⇄C, ...) bertransaksi 380 ETH bolak-balik (kriteria wash lesson ini: lingkaran A→B→A). Rasio wash = 380/1200 = 31,7%. Volume ASLI = 820 ETH. Tapi yang lebih penting: HARGA. Wash terjadi di 6,1 ETH (memompa `harga terakhir`), transaksi asli di 1,8–2,2 ETH. Floor yang JUJUR = 2 ETH (dari transaksi asli), bukan 6,1 ETH (dari wash). Selisih 3x = jebakan valuasi.",
        "Rumus valuasi defensif: floor_jujur = median harga transaksi NON-wash 30 hari. Untuk PixelApe: [2,1, 1,9, 2,2, 1,8, 2,0, ...] → median 2,0 ETH. Bandingkan `floor tercatat` 6,1 ETH (termasuk wash). DISKON WASH = 1 − 2,0/6,1 = 67%. Aturan: diskon > 30% = jangan beli di harga tercatat; tawar di floor_jujur atau tinggalkan. Pembeli yang membayar 6,1 ETH membeli `harga`, bukan `nilai` — dan harganya palsu.",
        "Tiga level pembersihan data: LEVEL 1 (mudah): hapus transaksi lingkaran langsung (A⇄B) — menangkap 70% wash amatir. LEVEL 2 (sedang): hapus juga rantai A→B→C→A (3 hop) + transaksi < 1 jam dengan harga > 2x median — total 90%. LEVEL 3 (sulit): wash lintas-wallet-terklaster (bcd3!) + wash lintas-koleksi. Untuk keputusan BELI pribadi, level 1–2 cukup (15 menit via script). Untuk LAPORAN/INVESTASI, butuh level 3 (atau akui batasnya).",
        "Contoh biaya tidak membersihkan: investor membeli 10 PixelApe @ 6,1 ETH = 61 ETH (`floor` tercatat). Floor jujur 2 ETH → nilai riil 20 ETH. Saat wash berhenti (pelaku kehabisan modal/ketahuan), harga kembali ke 2 ETH → rugi 41 ETH (67%). Waktu yang dibutuhkan untuk `membersihkan`: 15 menit script level 1–2. 15 menit vs 41 ETH — audit termurah kedua setelah audit distribusi token.",
        "Waspadai `wash musiman`: pelaku wash HANYA saat akan menjual (pump 3 hari, jual, hilang). Volume 30 hari terlihat `rata-rata oke` (rasio wash 15%), tapi 3 hari terakhir rasio 80%! Selalu hitung rasio wash per MINGGU, bukan per bulan. Grafik mingguan yang menunjukkan lonjakan = pola pump-and-dump klasik. Rata-rata bulanan menyembunyikan kejahatan mingguan — sama seperti rata-rata menyembunyikan outlier (pelajaran statistik dasar!).",
        "Terakhir: wash trading bukan satu-satunya polusi. `Fake floor`: pelaku listing 100 NFT @ 100 ETH (tidak pernah terjual) agar `floor` terlihat tinggi di aggregator yang menghitung dari LISTING, bukan TRANSAKSI. Selalu pakai floor dari TRANSAKSI (jual-beli nyata), bukan listing. Dan `bid palsu`: bid tinggi yang tidak pernah dieksekusi untuk memancing FOMO. Tiga polusi (wash, fake floor, bid palsu) = tiga alasan valuasi NFT butuh pembersihan data dulu, intuisi kemudian.",
        "Satu teknik verifikasi independen: bandingkan floor_jujur dari DUA sumber yang tidak terkait — transaksi on-chain (median 2 ETH) vs harga lelang OTC/peer-to-peer di forum (mis. 1,9 ETH). Jika keduanya bertemu di ~2 ETH, confidence TINGGI. Jika OTC 0,8 ETH (jauh di bawah), artinya bahkan 2 ETH masih kemahalan — pasar OTC (tanpa wash, karena settlement langsung antar dompet) adalah cermin yang lebih jujur. Aturan: satu sumber bisa dimanipulasi; dua sumber independen yang sepakat sulit dimanipulasi bersamaan. Untuk pembelian di atas 5 ETH, verifikasi OTC adalah 30 menit yang wajib.",
      ],
      formula: String.raw`WR = \frac{V_{wash}}{V_{total}} \quad ; \quad floor_{jujur} = \text{median}(P_{non\text{-}wash})`,
      formulaNote: "WR = rasio wash; V_wash = volume transaksi lingkaran/rantai wash; floor_jujur = median harga transaksi BERSIH 30 hari. WR > 30% atau diskon > 30% = jangan beli di harga tercatat.",
      figure: {
        svg: BCD6_DEEP_SVG,
        alt: "Diagram batang volume: tercatat 1.200 ETH vs asli 820 ETH (31,7% wash).",
        caption: "Cara membaca: dua batang = volume tercatat vs volume setelah buang transaksi wash (ETH/30 hari). Interpretasi: 31,7% volume = udara (bolak-balik pelaku). Lebih penting: HARGA wash (6,1 ETH) vs harga asli (2 ETH) — floor jujur = median transaksi bersih, bukan harga terakhir.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: beli nilai, bukan harga",
        body: "Harga terakhir 6,1 ETH adalah FAKTA transaksi (memang ada yang bayar) tapi BUKAN nilai (yang bayar = pelaku wash itu sendiri). Valuasi defensif = median transaksi BERSIH. Jika selisihnya > 30%, yang kamu lihat adalah panggung, bukan pasar.",
      },
      reference: "Hitung rasio wash MINGGUAN (bukan bulanan). Floor dari transaksi, bukan listing.",
    },
    {
      id: "standar-token-nft",
      eyebrow: "Tambahan · BC2",
      title: "ERC-721 vs ERC-1155: standar di balik NFT",
      prose: [
        "NFT di lesson ini sejauh ini dibahas dari sisi pasar (wash trading, valuasi) — tetapi NFT adalah TOKEN dengan standar teknis, dan standar itu menentukan apa yang bisa dihitung analis. Tiga standar token Ethereum yang perlu dibedakan. ERC-20 (lihat BCD2): FUNGIBLE — tiap unit sama (1 USDC = 1 USDC), saldo dicatat per alamat, transfer via event Transfer. ERC-721: NON-FUNGIBLE — tiap token UNIK dengan tokenId sendiri (avatar nomor 1 berbeda dari avatar nomor 2, walau dari koleksi yang sama); kepemilikan dicatat per tokenId; transfer via event Transfer yang sama namanya tetapi dengan tokenId, bukan jumlah.",
        "ERC-1155: MULTI-TOKEN — satu kontrak bisa menampung BANYAK jenis token sekaligus, fungible maupun non-fungible: 100 pedang identik (fungible, jumlah 100) DAN 1 pedang legendaris unik (non-fungible) hidup di kontrak yang sama, dibedakan oleh id. Transfernya memakai event TransferSingle (satu jenis) atau TransferBatch (banyak jenis sekaligus — satu transaksi memindahkan 5 jenis item game sekaligus, hemat gas dibanding 5 transaksi ERC-721 terpisah).",
        "Kapan memakai yang mana — dan apa artinya bagi analis: koleksi 10.000 avatar unik (tiap avatar berbeda) → ERC-721; tiap tokenId adalah satu baris data. Item game dengan stok (100 pedang identik, 50 perisai identik) → ERC-1155; jumlah per id adalah saldonya, seperti ERC-20 per jenis. Kesalahan analisis klasik: menghitung 'jumlah NFT' di kontrak ERC-1155 dengan menghitung transfer — transfer batch memindahkan banyak jenis sekaligus, dan saldo per id (bukan jumlah transfer) yang menentukan berapa item yang benar-benar ada.",
        "Untuk membaca data: ERC-721 — lacak ownerOf(tokenId) dan event Transfer(from, to, tokenId). ERC-1155 — lacak balanceOf(alamat, id) dan event TransferSingle/TransferBatch. Keduanya bisa dibaca dengan bekal BCD2 (event log) — hanya nama event dan artinya yang berbeda. Dan satu catatan kejujuran: standar tidak menjamin NILAI — NFT ERC-721 dari koleksi tanpa pembeli tetap tidak likuid (lihat langkah valuasi lesson ini); standar menjelaskan STRUKTUR, bukan harga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Semua NFT itu ERC-721.” Bukan — item game bervolume besar dan tiket event umumnya ERC-1155 (batch + multi-jenis dalam satu kontrak). Menyebut standar yang salah berarti membaca event yang salah — dan menghitung jumlah yang salah.",
      },
      quiz: [
        {
          q: "Koleksi 10.000 avatar unik vs 100 pedang identik di satu game. Standar yang tepat?",
          options: [
            { text: "Keduanya ERC-20", why: "Salah: ERC-20 fungible murni — tidak bisa membedakan avatar nomor 1 dari nomor 2." },
            { text: "Avatar ERC-721 (unik per tokenId); pedang ERC-1155 (100 identik dalam satu id, batch-able)", why: "Benar: keunikan → 721; stok identik multi-jenis → 1155.", correct: true },
            { text: "Keduanya ERC-721", why: "Salah: 100 pedang identik tidak butuh 100 token unik — ERC-1155 jauh lebih hemat." },
            { text: "Avatar ERC-1155; pedang ERC-721", why: "Salah: terbalik — avatar unik butuh 721, pedang identik butuh 1155." },
          ],
        },
      ],
      reference: "ERC-20 fungible; ERC-721 unik per tokenId; ERC-1155 multi-jenis + batch dalam satu kontrak.",
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
        "Standar token NFT: ERC-721 unik per tokenId; ERC-1155 multi-jenis + batch; ERC-20 fungible (BCD2).",
        "Wash = arus balik (resiprokal/lingkaran) dalam jendela sempit — bukan rantai distribusi.",
        "Unit analisis = tokenId; hitung tangan berbeda, bukan jumlah penjualan.",
        "Volume NFT termudah dimanipulasi — selalu hitung versi bersihnya.",
        "Valuasi = median penjualan organik + haircut likuiditas; floor price = harga pajangan.",
        "Buang wash DULU, baru hitung metrik apa pun.",
      ],
      next: { label: "BCD7 — Deteksi Fraud On-Chain", href: "/v2/learn/bcd7-fraud" },
      quiz: [
        {
          q: "Pola A→B→C→A dalam 2 jam untuk satu NFT. Ini…",
          options: [
            { text: "Distribusi normal ke tangan baru", why: "NFT kembali ke A — tidak ada tangan baru di ujungnya." },
            { text: "Wash trading lingkaran: NFT kembali ke penjual semula via perantara", why: "Arus balik = sidik jari wash, walau lewat perantara.", correct: true },
            { text: "Bukan apa-apa — hanya 3 penjualan", why: "Jumlah kecil tidak menghapus pola melingkarnya." },
            { text: "Arbitrase", why: "Arbitrase butuh selisih harga antar pasar — ini satu barang diputar." },
          ],
        },
        {
          q: "A→B→C (tangan terus berganti, tanpa arus balik). Ini…",
          options: [
            { text: "Wash trading", why: "Tidak ada arus balik — ini distribusi/flipping normal." },
            { text: "Rantai distribusi normal: barang berpindah ke tangan baru", why: "Setiap langkah = pemilik baru yang berbeda.", correct: true },
            { text: "Pasti manipulasi", why: "Flipper membeli-mjual cepat adalah aktivitas pasar yang sah." },
            { text: "Tidak bisa dinilai", why: "Bisa — kriteria arus baliknya jelas tidak terpenuhi." },
          ],
        },
        {
          q: "Menilai NFT sebagai agunan. Praktik paling defensif?",
          options: [
            { text: "Pakai floor price saat ini", why: "Floor = harga pajangan, bukan transaksi; bisa dipatok manipulator." },
            { text: "Median penjualan organik 90 hari (buang wash) minus haircut likuiditas", why: "Transaksi riil + penalti tidak likuid = valuasi yang bisa dipertahankan.", correct: true },
            { text: "Pakai harga penjualan termahal", why: "Termahal sering justru wash untuk memanipulasi persepsi." },
            { text: "Pakai rata-rata semua penjualan", why: "Rata-rata rapuh terhadap outlier + tercemar wash." },
          ],
        },
        {
          q: "Koleksi: volume Rp4 miliar/bulan, tetapi 92% wash. Kesimpulan untuk ranking marketplace?",
          options: [
            { text: "Tetap peringkatkan berdasar volume total", why: "Itu mempromosikan manipulator ke puncak ranking." },
            { text: "Peringkatkan berdasar volume bersih + pembeli unik", why: "Metrik bersih mengembalikan fungsi ranking: menemukan permintaan riil.", correct: true },
            { text: "Hapus koleksinya", why: "Terlalu jauh — bersihkan metriknya, bukan menghukum koleksinya." },
            { text: "Volume tetap valid karena tercatat on-chain", why: "Tercatat ≠ bermakna. Wash tercatat dengan sempurna dan tetap palsu." },
          ],
        },
        {
          q: "Mengapa harga menanjak tiap putaran (5 → 5,2 → 5,5) adalah sidik jari wash?",
          options: [
            { text: "Karena harga kripto selalu naik", why: "Tidak selalu — dan pola mekanisnya yang mencurigakan." },
            { text: "Pembeli normal menawar turun; kenaikan mekanis tiap putaran memalsukan tren untuk memancing FOMO", why: "Pola 'naik sedikit tiap putaran' = koreografi, bukan penemuan harga.", correct: true },
            { text: "Karena fee gas naik", why: "Kenaikan 0,2–0,3 ETH jauh melampaui fee gas." },
            { text: "Bukan sidik jari apa-apa", why: "Kombinasi resiprokal + kenaikan mekanis = dua sidik jari sekaligus." },
          ],
        },
        {
          q: "Koleksi: floor tercatat 6,1 ETH, tapi 31,7% volume adalah wash di 6,1 ETH; transaksi asli median 2 ETH. Tindakan TEPAT?",
          options: [
            { text: "Beli di 6,1 — itu harga pasar yang tercatat", why: "`Tercatat` ≠ `nilai`. 6,1 ETH adalah harga yang dibentuk pelaku wash sendiri. Membeli di situ = membeli panggung." },
            { text: "Tawar di ~2 ETH (floor jujur) atau tinggalkan; diskon wash 67%", why: "Tepat. floor_jujur = median transaksi bersih = 2 ETH. Diskon 67% > 30% = jangan sentuh harga tercatat.", correct: true },
            { text: "Beli lalu ikut wash agar harga naik", why: "Ikut wash = manipulasi pasar (ilegal di banyak yurisdiksi) + kamu menjadi exit liquidity pelaku yang lebih dulu. Jangan." },
            { text: "Tunggu 1 bulan — wash pasti berhenti sendiri", why: "Wash berhenti hanya jika pelaku kehabisan modal/ketahuan — tidak ada jadwalnya. Menunggu tanpa analisis = berharap." },
          ],
        },
      ],
    },
  ],
};
