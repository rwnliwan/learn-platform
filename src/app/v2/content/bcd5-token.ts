import type { V2Lesson } from "../lib/types";

// Vesting tim: cliff 12 bulan lalu linear 24 bulan; penanda "sekarang = bulan 3".
const VEST_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Jadwal vesting tim: nol persen sampai bulan 12, lalu naik linear sampai 100 persen di bulan 36. Penanda sekarang di bulan 3.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="50" y1="30" x2="450" y2="30"/><line x1="50" y1="80" x2="450" y2="80"/><line x1="50" y1="130" x2="450" y2="130"/><line x1="50" y1="180" x2="450" y2="180"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="44" y="34">100%</text><text x="44" y="84">75%</text><text x="44" y="134">50%</text><text x="44" y="184">0%</text></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="50" y="200">0</text><text x="150" y="200">12</text><text x="250" y="200">24</text><text x="350" y="200">36 bln</text></g>
<line x1="50" y1="180" x2="150" y2="180" stroke="var(--c1)" stroke-width="3"/>
<line x1="150" y1="180" x2="350" y2="30" stroke="var(--c1)" stroke-width="3"/>
<line x1="350" y1="30" x2="450" y2="30" stroke="var(--c1)" stroke-width="3"/>
<circle cx="150" cy="180" r="6" fill="var(--c4)"/><text x="150" y="168" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">cliff 12 bln</text>
<line x1="83" y1="20" x2="83" y2="190" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="83" y="14" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">sekarang (bln 3): 0% vested</text>
<text x="250" y="120" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">linear 24 bulan</text>
</svg>`;

const BCD5_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Kurva Lorenz: diagonal kesetaraan vs kurva NOVA yang menempel sumbu X lalu melonjak (Gini 0,93)."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100% holder</text><polyline points="46.0,180.0 255.0,100.0 464.0,20.0" fill="none" stroke="var(--chart-grid)" stroke-width="2.5"/><polyline points="46.0,180.0 338.6,172.0 422.2,167.2 443.1,148.0 464.0,20.0" fill="none" stroke="var(--c4)" stroke-width="2.5"/><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">abu=diagonal, merah=NOVA</text></svg>`;

export const bcd5: V2Lesson = {
  slug: "bcd5-token",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD5 — Tokenomics & Distribusi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tim yang 'cuma pegang 5%' — ternyata 60%",
      prose: [
        "Token NOVA diluncurkan dengan whitepaper rapi: 'Tim hanya 5%, 95% untuk komunitas.' Harganya terbang 8× dalam sebulan. Lalu di bulan kedua, harga longsor 70% dalam seminggu tanpa berita apa pun. Komunitas menuduh 'bandar buang barang'. Tim membantah: 'Kami masih hold 5% kami.'",
        "Seorang analis on-chain iseng memetakan: 40 address 'komunitas' yang menjual duluan ternyata semuanya didanai dari SATU address deployer di hari peluncuran — pola clustering bcd3. 'Komunitas' itu adalah tim dengan kostum. Alokasi tim sebenarnya: 5% resmi + 55% via address boneka = 60%.",
        "Twist-nya: tokenomics yang tertulis di whitepaper adalah JANJI; tokenomics yang sebenarnya tertulis di CHAIN. Dan chain tidak bisa berbohong — hanya bisa disembunyikan di balik banyak address. Tugasmu: membaca distribusi yang sebenarnya. Tujuan: (1) mengukur konsentrasi holder dengan HHI/CR; (2) membaca jadwal vesting dan cliff; (3) menyusun daftar red flag distribusi. Peta: cerita → anatomi alokasi → vesting → lab konsentrasi → red flag → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membaca alokasi token dan menemukan kepemilikan tersembunyi (kasus NOVA 5%→60%); (2) menghitung kurva vesting (cliff + linear) untuk tanggal tertentu; (3) mengukur konsentrasi dengan HHI dan kurva Lorenz; (4) menyusun daftar periksa red flag distribusi sebelum menyentuh token.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Alokasi tim kecil = distribusi sehat.\" Alokasi resmi hanyalah label. Yang menentukan adalah KEPEMILIKAN EFEKTIF: cluster address yang didanai deployer, vesting contract yang bisa di-upgrade, dan 'ecosystem fund' yang dikontrol tim via multisig 2-of-3 orang dalam. Selalu verifikasi: jumlahkan cluster, bukan baca pie chart whitepaper.",
      },
      reference: "Tokenomics janji (whitepaper) vs tokenomics nyata (chain). Verifikasi via cluster, bukan pie chart.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 2 · Anatomi alokasi",
      title: "Membaca pembagian kue yang sebenarnya",
      prose: [
        "Alokasi tipikal: tim & advisor (10–20%), investor (10–20%), treasury/ecosystem (20–40%), komunitas/airdrop/staking reward (sisanya). Angka-angka ini baru bermakna bersama JADWALNYA: kapan masing-masing boleh dijual.",
        "Tiga pertanyaan wajib untuk tiap alokasi: (1) Berapa persen dari TOTAL supply (bukan dari circulating — circulating bisa dimanipulasi dengan menahan sirkulasi)? (2) Kapan unlock-nya (cliff + linear)? (3) Siapa yang mengontrol kunci pelepasnya (vesting contract immutable vs multisig tim)?",
        "Jebakan 'circulating supply': tim bisa mengklaim 'hanya 10% circulating milik tim' sementara 50% total supply duduk di vesting contract yang mereka kontrol — dan vesting contract-nya bisa di-upgrade. Kapitalisasi pasar yang jujur memakai FULLY DILUTED valuation (harga × total supply), bukan market cap circulating.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: unlock adalah jadwal banjir",
        body: "Setiap unlock besar = peningkatan supply beredar yang bisa dijual. Pasar yang rasional sudah 'mendiskon' unlock yang diketahui — tetapi pasar kripto sering tidak. Pola yang terbukti: harga melemah 2–4 minggu SEBELUM unlock besar (orang depan menjual duluan) lalu kadang rebound sesudahnya ('sell the rumor' terbalik). Kalender unlock adalah kalender risiko — analis tokenomics menghafalnya seperti trader menghafal jadwal FOMC.",
      },
      reference: "Tanya 3 hal per alokasi: % dari TOTAL supply, jadwal unlock, siapa pegang kunci.",
    },
    {
      id: "vesting",
      eyebrow: "Langkah 3 · Vesting",
      title: "Cliff, linear, dan bulan ke-3 yang menipu",
      prose: [
        "Vesting standar tim: cliff 12 bulan (tidak ada yang bisa dijual selama setahun), lalu linear 24 bulan (setiap bulan 1/24 terbuka). Rumus: vested(t) = 0 jika t < cliff; = (t − cliff)/durasi jika di antaranya; = 1 jika lewat.",
        "Cara membaca diagram: sumbu X = bulan sejak peluncuran, Y = % alokasi tim yang sudah bisa dijual. Datar 0% sampai bulan 12 (cliff), lalu naik lurus ke 100% di bulan 36. Garis putus-putus = 'sekarang' (bulan 3): 0% vested — tim BELUM BISA menjual apa pun. Interpretasi: tekanan jual dari tim = NOL hari ini, tetapi kalender risiko dimulai bulan 12. Analis menandai dua tanggal: cliff (banjir pertama) dan akhir linear (banjir terakhir).",
        "Yang menipu: 'vesting' via multisig tim BUKAN vesting — itu janji. Vesting yang benar = smart contract immutable yang tidak bisa diubah tim. Verifikasi: baca contract-nya, bukan pengumumannya.",
      ],
      figure: {
        svg: VEST_SVG,
        alt: "Jadwal vesting tim: nol persen sampai bulan 12, lalu naik linear sampai 100 persen di bulan 36. Penanda sekarang di bulan 3.",
        caption: "Vesting tim: cliff 12 bulan, linear 24 bulan. Di bulan ke-3, 0% bisa dijual — tekanan jual tim = nol (untuk sekarang).",
      },
      formula: String.raw`V(t) = \begin{cases} 0 & t < c \ \frac{t-c}{d} & c \le t < c+d \ 1 & t \ge c+d \end{cases}`,
      formulaNote: "V(t) = fraksi alokasi yang sudah terbuka di bulan t; c = cliff (bulan); d = durasi linear (bulan). Contoh: c=12, d=24 → di bulan 18, V = (18−12)/24 = 25%.",
      tasks: [],
      note: {
        title: "💡 Intuisi: cliff menciptakan 'kematian yang terjadwal'",
        body: "Cliff 12 bulan berarti di bulan ke-12, SEBAGIAN BESAR tim membuka kunci BERSAMAAN — dan mereka sudah menunggu setahun untuk menjual. Ini bukan bug, ini fitur yang bisa diprediksi. Trader profesional tidak menunggu tanggalnya; mereka menjual 2–4 minggu sebelumnya. Pelajaran analis: risiko terbesar bukan pada tanggal unlock, melainkan pada ANTISIPASI pasar terhadapnya.",
      },
      reference: "Vesting valid = contract immutable. Tandai tanggal cliff & akhir linear di kalender risiko.",
    },
    {
      id: "lab-distribusi",
      eyebrow: "Langkah 4 · Lab",
      title: "Mengaudit distribusi 100 holder",
      prose: [
        "Data sintetis: 100 holder berpola pareto (seed 11). Alokasi tim resmi = 25% dari total supply, vesting cliff 12 bulan — sekarang bulan ke-3 (vested = 0%).",
        "Tugasmu: (1) hitung pangsa 10 holder terbesar dan HHI; (2) hitung % tim yang sudah vested di bulan 3; (3) tentukan red flag = True jika (top10 > 50% DAN alokasi tim > 20%).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `top10_share` dan `hhi`" },
        { id: "t2", text: "Hitung `vested_pct` tim di bulan ke-3" },
        { id: "t3", text: "Tentukan `red_flag` (bool)" },
        { id: "t4", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "top10_share=0.643  hhi=0.0818  vested_pct=0.0  red_flag=True",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Vested 0% berarti tidak ada risiko dari tim.\" Vested 0% HARI INI — tetapi 25% supply akan mulai terbuka 9 bulan lagi, dan pasar mulai mendiskonnya dari sekarang. Analis yang hanya melihat 'saat ini' akan kaget di bulan 12. Selalu laporkan jadwal MASA DEPAN, bukan cuma status hari ini.",
      },
      hints: [
        "top10_share & hhi seperti lab bcd1.",
        "Vesting: t=3 < cliff=12 → vested_pct = 0.0.",
        "red_flag = (top10_share > 0.5) and (0.25 > 0.2).",
      ],
      code: {
        starter: `import random\nrandom.seed(11)  # JANGAN DIUBAH\nbalances = sorted([int(random.paretovariate(1.3) * 10000) for _ in range(100)], reverse=True)\nTEAM_ALLOC = 0.25  # 25% dari total supply\nCLIFF, NOW = 12, 3\n\n# TULIS KODEMU\ntotal = sum(balances)\ntop10_share = \nhhi = \nvested_pct = \nred_flag = \n\nprint(f"top10_share={top10_share:.3f}  hhi={hhi:.4f}  vested_pct={vested_pct}  red_flag={red_flag}")`,
        lockLines: 4,
        solution: `import random\nrandom.seed(11)  # JANGAN DIUBAH\nbalances = sorted([int(random.paretovariate(1.3) * 10000) for _ in range(100)], reverse=True)\nTEAM_ALLOC = 0.25  # 25% dari total supply\nCLIFF, NOW = 12, 3\n\n# TULIS KODEMU\ntotal = sum(balances)\ntop10_share = sum(balances[:10]) / total\nhhi = sum((b / total) ** 2 for b in balances)\nvested_pct = 0.0 if NOW < CLIFF else (NOW - CLIFF) / 24\nred_flag = (top10_share > 0.5) and (TEAM_ALLOC > 0.2)\n\nprint(f"top10_share={top10_share:.3f}  hhi={hhi:.4f}  vested_pct={vested_pct}  red_flag={red_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "top10_share", value: 0.643, tol: 0.002, label: "`top10_share` ≈ 0.643", msg: "10 terbesar / total. Konsentrasi ekstrem." },
          { kind: "equal", task: "t1", name: "hhi", value: 0.0818, tol: 0.002, label: "`hhi` ≈ 0.0818", msg: "Σ (b/total)²." },
          { kind: "equal", task: "t2", name: "vested_pct", value: 0.0, tol: 1e-9, label: "`vested_pct` = 0.0", msg: "Bulan 3 < cliff 12 → belum ada yang terbuka." },
          { kind: "equal", task: "t3", name: "red_flag", value: true, tol: 0, label: "`red_flag` = True", msg: "top10 64% > 50% dan tim 25% > 20% → dua red flag." },
          { kind: "stdout_matches", task: "t4", pattern: "red_flag=True", label: "Output menampilkan red_flag", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Konsentrasi + jadwal vesting + kepemilikan efektif = tiga pilar audit distribusi.",
    },
    {
      id: "redflag",
      eyebrow: "Langkah 5 · Red flag",
      title: "Daftar periksa distribusi berbahaya",
      prose: [
        "Satu — Top-10 > 50%: segelintir dompet mengendalikan pasar & governance. Dua — Tim + investor > 40% total supply: 'komunitas' hanyalah penonton. Tiga — Alamat deployer mendanai banyak 'holder komunitas': kepemilikan boneka (pola NOVA di cerita pembuka). Empat — Unlock besar < 90 hari tanpa penjelasan: banjir terjadwal. Lima — Vesting via multisig yang bisa di-upgrade: janji, bukan kunci.",
        "Skor cepat: tiap red flag = 1 poin. 0 = sehat; 1–2 = waspada, gali lebih dalam; ≥3 = jangan sentuh tanpa diskon risiko besar. Ini bukan sains pasti — ini triase.",
        "Catatan jujur: tidak ada ambang universal. Token governance butuh distribusi lebih sehat daripada token utilitas murni; stablecoin butuh yang paling sehat. Kalibrasi ambangmu terhadap KATEGORI token, bukan angka mati.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk analis risiko kredit/fintech: pola 'kepemilikan boneka via banyak address' adalah TEKNIK yang sama dengan pemecahan pinjaman fiktif (satu debitur, banyak KTP). Skill membaca cluster + distribusi ini transferable langsung ke deteksi fraud perbankan — beda domain, pola sama.",
      },
      reference: "5 red flag, skor triase 0/1–2/≥3. Kalibrasi ambang per kategori token.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Menilai token sebelum menyentuh",
      prose: [
        "Skenario 1 — Investasi jangka panjang: cek % tim+investor dari TOTAL supply, jadwal unlock 2 tahun ke depan, dan HHI. Tolak jika insider > 40% atau cliff besar < 6 bulan.",
        "Skenario 2 — Listing di exchange: cek distribusi untuk risiko 'listing dump' — holder terkonsentrasi + unlock dekat = harga listing rawan dibanting insider. Syaratkan lock-up tambahan.",
        "Skenario 3 — Menerima token sebagai agunan (lending): cek likuiditas riil + konsentrasi. Agunan yang 60% dipegang 10 dompet = agunan yang bisa hilang nilainya saat mereka menjual. Terapkan haircut besar.",
        "Skenario 4 — Due diligence proyek: verifikasi klaim whitepaper vs cluster on-chain (kasus NOVA). Selisih > 10% = temuan audit.",
        "Aturan praktis 10 detik: (1) fully diluted valuation, bukan circulating; (2) kalender unlock 12 bulan ke depan; (3) cluster, bukan pie chart. Tiga-tiganya harus lolos.",
      ],
      tasks: [],
      reference: "FDV + kalender unlock + verifikasi cluster. Tiga lolos = lanjut.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "NOVA: 5% yang ternyata 60%",
      prose: [
        "Data kasus NOVA: alokasi resmi tim 5%. Analis menemukan 40 address 'komunitas' yang semuanya menerima dana awal dari deployer address dalam 48 jam peluncuran, masing-masing 1,375% supply. Total = 55%. Ditambah 5% resmi = 60% efektif.",
        "Harga: naik 8× bulan pertama (akumulasi + hype), lalu −70% dalam seminggu saat 40 address mulai menjual berurutan (bukan bersamaan — menjual bergelombang agar tidak memicu panic detector). Kerugian ritel: estimasi Rp180 miliar.",
        "Pembahasan: (a) pola pendanaan serentak dari deployer = sidik jari cluster (bcd3); (b) penjualan bergelombang = taktik menghindari deteksi — analis harus melihat AGREGAT cluster, bukan per address; (c) pelajaran proses: audit distribusi WAJIB sebelum listing/dukungan, bukan sesudah crash. Checklist yang gagal di sini: verifikasi cluster (red flag #3) + konsentrasi efektif (red flag #1).",
      ],
      tasks: [],
      reference: "Audit distribusi = sebelum listing, bukan sesudah crash. Lihat agregat cluster.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Kurva Lorenz & Gini: seberapa timpang token ini",
      prose: [
        "Lab lesson ini menghitung top10_share dan HHI. Sekarang visualisasikan ketimpangan dengan KURVA LORENZ: sumbu X = % holder terkecil→terbesar, sumbu Y = % supply yang mereka kuasai. Garis diagonal = kesetaraan sempurna (10% holder = 10% supply). Kurva NOVA: 90% holder terkecil hanya menguasai 8% supply — kurva menempel sumbu X lalu melonjak di ujung. Semakin JAUH kurva dari diagonal, semakin timpang. Luas area antara diagonal dan kurva × 2 = KOEFISIEN GINI (0 = setara, 1 = satu orang kuasai semua).",
        "Contoh angka: token SEHAT (distribusi luas): Gini 0,65 (crypto wajar timpang — jangan harapkan 0,2 seperti negara Nordik!). Token NOVA: Gini 0,93 — 90% holder berebut 8% supply. Token SCAM tipikal: Gini > 0,95 + top10 > 80%. Aturan praktis: Gini < 0,75 = distribusi wajar; 0,75–0,90 = waspada (cek siapa top holder); > 0,90 = bahaya (satu keputusan paus = harga -50%).",
        "Kenapa Gini lebih baik dari top10_share saja? Karena top10 bisa MENIPU via sybil: paus memecah 60% supply ke 600 address kecil — top10_share terlihat `hanya` 15%! Tapi kurva Lorenz TETAP menunjukkan ketimpangan jika 600 address itu terklaster (bcd3: clustering!) atau punya pola vesting sama. Kombinasikan: Gini + clustering + analisis vesting = paus bersembunyi sulit lolos. Satu metrik = bisa diakali; tiga metrik silang = mahal diakali.",
        "Contoh kasus NOVA dibedah: klaim tim `cuma pegang 5%`. Audit: tim 5% + advisor 8% + `ecosystem fund` 20% (dikuasai tim!) + `liquidity` 12% (tidak dikunci!) + investor awal 15% (vesting 3 bulan!) = 60% terkendali insider. Kurva Lorenz: 95% holder = 12% supply → Gini 0,91. Vesting: cliff 3 bulan untuk investor — `bulan ke-3 yang menipu` (lesson ini): harga pump 2 bulan, lalu 15% supply unlock sekaligus → -70%. Tiga analisis (alokasi + Lorenz + vesting) masing-masing menangkap sebagian; ketiganya = gambaran utuh.",
        "Jadwalkan `audit distribusi` SEBELUM beli/masuk: (1) hitung Gini + top10 dari 100 holder teratas (15 menit via script); (2) baca vesting schedule (cliff kapan? berapa % unlock per bulan?); (3) cek `ecosystem/liquidity` wallet — apakah benar dikunci (kontrak vesting) atau bebas dipakai tim? Jika (3) tidak terverifikasi on-chain, anggap dikuasai tim. Total 1 jam untuk menghindari -70%. Rasio 1 jam vs -70% portofolio = audit termurah dalam crypto.",
        "Waspadai `distribusi yang membaik palsu`: tim mengirim token ke 10.000 address kecil (airdrop) — Gini TURUN (terlihat lebih baik!), tapi 10.000 address tidak pernah aktif (tidak ada transaksi). Filter: hitung Gini hanya untuk holder AKTIF (transaksi < 90 hari) atau dengan saldo > $100. NOVA pasca-airdrop: Gini semua holder 0,82 (`membaik`!), Gini holder aktif 0,93 (aslinya). Airdrop ke address mati = make-up statistik.",
      ],
      formula: String.raw`G = \frac{A}{A+B} \quad ; \quad \text{ketimpangan parah} \iff G > 0{,}90`,
      formulaNote: "G = koefisien Gini; A = luas antara diagonal kesetaraan dan kurva Lorenz; B = luas di bawah kurva. Praktis: hitung via script dari distribusi holder. < 0,75 wajar; 0,75–0,90 waspada; > 0,90 bahaya. Selalu filter holder aktif!",
      figure: {
        svg: BCD5_DEEP_SVG,
        alt: "Kurva Lorenz NOVA jauh di bawah diagonal: 90% holder hanya kuasai 8% supply (Gini 0,93).",
        caption: "Cara membaca: sumbu X = % holder (terkecil→terbesar), sumbu Y = % supply; diagonal abu = kesetaraan sempurna; kurva merah = NOVA. Interpretasi: 90% holder berebut 8% supply — kurva menempel sumbu X (Gini 0,93). Satu keputusan 10% teratas = harga -50%.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: Gini holder aktif, bukan Gini semua holder",
        body: "Airdrop ke 10.000 address mati menurunkan Gini `di atas kertas` (0,93 → 0,82) tanpa mengubah kekuasaan sedikit pun. Selalu filter: hanya holder aktif (< 90 hari) atau saldo > $100. Make-up statistik adalah red flag itu sendiri — tim yang sehat tidak butuh make-up.",
      },
      reference: "Audit 1 jam sebelum masuk: Gini + vesting + verifikasi kunci wallet tim.",
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
        "Tokenomics nyata = yang tercatat di chain (cluster), bukan pie chart whitepaper.",
        "Tanya per alokasi: % dari TOTAL supply, jadwal unlock, siapa pegang kunci.",
        "Vesting: cliff = banjir terjadwal; pasar bereaksi pada antisipasi, bukan tanggalnya.",
        "Red flag: top-10 > 50%, insider > 40%, holder boneka, unlock dekat, vesting abal-abal.",
        "Gunakan fully diluted valuation, bukan circulating market cap.",
      ],
      next: { label: "BCD6 — Data NFT: Wash Trading & Valuasi", href: "/v2/learn/bcd6-nft" },
      quiz: [
        {
          q: "Tim klaim 'hanya 5%', tetapi 40 address yang didanai deployer memegang 55%. Kepemilikan efektif tim?",
          options: [
            { text: "5% — ikuti whitepaper", why: "Whitepaper adalah klaim; chain menunjukkan 60% efektif." },
            { text: "60% — jumlahkan cluster yang terbukti terkait deployer", why: "Kepemilikan efektif = resmi + boneka yang ter-cluster.", correct: true },
            { text: "55% — hanya yang boneka", why: "Jangan lupakan 5% resminya." },
            { text: "Tidak bisa ditentukan", why: "Bisa — pola pendanaan serentak dari deployer adalah bukti cluster." },
          ],
        },
        {
          q: "Vesting: cliff 12 bulan, linear 24 bulan. Berapa % terbuka di bulan ke-18?",
          options: [
            { text: "25% — (18−12)/24", why: "Rumus linear setelah cliff: (t−c)/d.", correct: true },
            { text: "75%", why: "Itu (18/24) — lupa cliff 12 bulan pertama = 0%." },
            { text: "50%", why: "Tidak ada dasarnya." },
            { text: "0% — masih dalam cliff", why: "Cliff berakhir bulan 12; bulan 18 sudah linear." },
          ],
        },
        {
          q: "Mengapa memakai circulating market cap bisa menyesatkan?",
          options: [
            { text: "Karena harganya fluktuatif", why: "Fluktuasi harga masalah terpisah." },
            { text: "Karena tim bisa menahan sirkulasi untuk mengecilkan penyebut — valuasi jujur memakai total supply (FDV)", why: "Circulating dapat direkayasa; FDV = harga × total supply.", correct: true },
            { text: "Karena circulating selalu lebih besar", why: "Kebalik — circulating ≤ total supply." },
            { text: "Tidak menyesatkan sama sekali", why: "Menyesatkan saat porsi terkunci besar dan dikontrol insider." },
          ],
        },
        {
          q: "'Vesting' yang dikontrol multisig tim 2-of-3 (bisa di-upgrade). Penilaianmu?",
          options: [
            { text: "Sama kuatnya dengan vesting contract immutable", why: "Multisig yang bisa upgrade = tim bisa mengubah jadwal kapan saja." },
            { text: "Itu janji, bukan kunci — perlakukan alokasinya sebagai likuid", why: "Keamanan vesting = ketidakmampuan mengubahnya.", correct: true },
            { text: "Lebih aman karena ada manusia pengawas", why: "'Pengawas' yang juga penerima = konflik kepentingan." },
            { text: "Tidak relevan untuk analisis", why: "Sangat relevan — ini beda antara terkunci dan pura-pura terkunci." },
          ],
        },
        {
          q: "Unlock besar 30% supply dalam 60 hari. Langkah analis yang paling tepat?",
          options: [
            { text: "Abaikan — pasar pasti sudah mendiskon", why: "Pasar kripto sering TIDAK mendiskon dengan benar." },
            { text: "Tandai sebagai risiko kalender: antisipasi pelemahan 2–4 minggu sebelumnya, siapkan skenario", why: "Pola historis: jual antisipatif sebelum unlock besar.", correct: true },
            { text: "Beli sekarang karena pasti rebound sesudahnya", why: "'Pasti rebound' tidak dijamin — itu spekulasi, bukan analisis." },
            { text: "Jual semua posisi kripto", why: "Reaksi berlebihan — satu token ≠ seluruh pasar." },
          ],
        },
        {
          q: "Token X: Gini semua holder 0,78 (`wajar`), tapi Gini holder aktif 0,94. Interpretasi TEPAT?",
          options: [
            { text: "Distribusi sehat — Gini 0,78 di bawah 0,90", why: "0,78 mencakup 10.000 address airdrop yang MATI (tidak aktif). Yang menggerakkan harga = holder AKTIF dengan Gini 0,94 = bahaya." },
            { text: "Make-up statistik via airdrop; yang relevan Gini aktif 0,94 = bahaya", why: "Tepat. Airdrop ke address mati menurunkan Gini kertas tanpa mengubah kekuasaan. 94% ketimpangan di holder aktif = satu keputusan paus bisa -50%.", correct: true },
            { text: "Beli saja — Gini akan membaik sendiri", why: "Gini tidak `membaik sendiri`; paus tidak berbagi sukarela. Menunggu = menunggu unlock berikutnya." },
            { text: "Gini tidak berguna untuk token", why: "Gini + filter aktif + clustering + vesting = 4 lapis yang sulit diakali bersamaan. Satu metrik bisa diakali; empat tidak." },
          ],
        },
      ],
    },
  ],
};
