import type { V2Lesson } from "../lib/types";

const FIG_ADOPSI = `<svg viewBox="0 0 600 340" role="img" aria-label="Bar chart jumlah UserOperation per minggu selama 8 minggu, naik dari 1.200 ke 8.400.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">UserOperation per minggu — 8 minggu adopsi smart account</text>
<line x1="80" y1="40" x2="80" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="80" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="46" y="66" font-size="10" fill="var(--chart-text)">8.000</text>
<text x="46" y="160" font-size="10" fill="var(--chart-text)">4.000</text>
<text x="52" y="254" font-size="10" fill="var(--chart-text)">0</text>
<rect x="90" y="229" width="48" height="31" fill="var(--c1)" opacity="0.85"/>
<text x="114" y="221" font-size="10" fill="var(--chart-text)" text-anchor="middle">1.200</text>
<text x="114" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 1</text>
<rect x="152" y="212" width="48" height="48" fill="var(--c1)" opacity="0.85"/>
<text x="176" y="204" font-size="10" fill="var(--chart-text)" text-anchor="middle">1.850</text>
<text x="176" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 2</text>
<rect x="214" y="197" width="48" height="63" fill="var(--c1)" opacity="0.85"/>
<text x="238" y="189" font-size="10" fill="var(--chart-text)" text-anchor="middle">2.400</text>
<text x="238" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 3</text>
<rect x="276" y="179" width="48" height="81" fill="var(--c2)" opacity="0.85"/>
<text x="300" y="171" font-size="10" fill="var(--chart-text)" text-anchor="middle">3.100</text>
<text x="300" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 4</text>
<rect x="338" y="150" width="48" height="110" fill="var(--c2)" opacity="0.85"/>
<text x="362" y="142" font-size="10" fill="var(--chart-text)" text-anchor="middle">4.200</text>
<text x="362" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 5</text>
<rect x="400" y="126" width="48" height="134" fill="var(--c2)" opacity="0.85"/>
<text x="424" y="118" font-size="10" fill="var(--chart-text)" text-anchor="middle">5.100</text>
<text x="424" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 6</text>
<rect x="462" y="82" width="48" height="178" fill="var(--c3)" opacity="0.85"/>
<text x="486" y="74" font-size="10" fill="var(--chart-text)" text-anchor="middle">6.800</text>
<text x="486" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 7</text>
<rect x="524" y="40" width="48" height="220" fill="var(--c3)" opacity="0.85"/>
<text x="548" y="32" font-size="10" fill="var(--chart-text)" text-anchor="middle">8.400</text>
<text x="548" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Mg 8</text>
<text x="90" y="312" font-size="11" fill="var(--chart-text)">Naik 7x dalam 8 minggu — tetapi pertumbuhan ini tidak terlihat dari transaksi EOA biasa.</text>
</g>
</svg>`;

export const bcd28: V2Lesson = {
  slug: "bcd28-erc4337",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD28 — ERC-4337: Account Abstraction & Analitik UserOperation",
  estMinutes: 62,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dana masih utuh, tetapi pemiliknya tidak bisa masuk",
      prose: [
        "Rani menyimpan seed phrase dompetnya di catatan ponsel. Ponselnya rusak, cadangannya tidak ada, dan dana setara Rp18 juta di alamat itu tidak bisa disentuh selamanya — bukan karena dicuri, melainkan karena satu-satunya kunci masuk hilang. Di kota lain, Bimo menghadapi masalah kebalikannya: ia punya token senilai jutaan rupiah dan kunci lengkap, tetapi saldo ETH-nya nol. Ia tidak bisa membayar gas, jadi ia tidak bisa memindahkan tokennya sendiri untuk membeli ETH. Dua orang, dua jalan buntu, satu akar yang sama: akun Ethereum klasik menuntut satu kunci privat untuk segalanya dan menuntut ETH untuk setiap gerakan pertama.",
        "Smart account memutus kedua jalan buntu itu. Pemulihan tidak lagi bergantung pada satu seed phrase: guardian (teman, perangkat kedua, layanan pemulihan) bisa menyetujui penggantian kunci — social recovery. Gas tidak lagi wajib dibayar sendiri dalam ETH: paymaster bisa menanggungnya, atau pengguna membayar dengan token yang ia pegang. Rani generasi berikutnya tidak kehilangan dana karena satu catatan hilang; Bimo bisa bergerak tanpa harus membeli ETH lebih dulu.",
        "Twist untuk analis: aktivitas smart account TIDAK tercatat sebagai transaksi EOA biasa. Yang terlihat di rantai adalah satu transaksi dari bundler ke kontrak EntryPoint; di dalamnya, puluhan aksi pengguna dari puluhan smart account berbeda dieksekusi sebagai panggilan internal. Analis yang hanya membaca transaksi reguler — menghitung alamat aktif, volume, dan pengguna baru dari tabel transaksi standar — akan buta total terhadap segmen pengguna ini dan melaporkan pertumbuhan yang salah tanpa pernah tahu ia salah.",
        "Prasyarat diringkas: transaksi Ethereum klasik dikirim akun dari luar rantai (EOA) yang menandatangani dengan kunci privat dan membayar gas dalam ETH; kontrak pintar adalah akun yang dikendalikan kode. Lesson ini membaca standar ERC-4337 dari kursi analis data — objek datanya, aktornya, metriknya — bukan dari kursi developer kontrak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap migrasi pengguna ke smart account membuat dashboard berbasis transaksi EOA semakin meremehkan aktivitas riil. Tim yang mengalokasikan budget, menilai pertumbuhan wallet, atau mendeteksi anomali dari data yang buta terhadap UserOperation sedang mengambil keputusan di atas peta yang kehilangan satu negara.",
      },
      reference: "Masalahnya kunci dan gas; butanya ada di data.",
    },
    {
      id: "dua-dunia-akun",
      eyebrow: "Langkah 2 · Konsep",
      title: "Dua dunia akun: EOA vs contract account",
      prose: [
        "Si Akun Satu Kunci. EOA (externally owned account) adalah alamat yang dikendalikan satu kunci privat. Ia bisa memulai transaksi, tetapi logikanya nol: tidak ada aturan pemulihan, tidak ada batas belanja, tidak ada persetujuan berlapis. Siapa memegang kuncinya adalah pemiliknya — dan siapa kehilangannya kehilangan segalanya, seperti Rani. Contract account adalah alamat yang dikendalikan KODE: ia tidak bisa memulai transaksi sendiri, tetapi bisa menjalankan logika apa pun saat dipanggil — validasi tanda tangan kustom, banyak penanda tangan, batas harian, kunci sesi.",
        "Account abstraction adalah gagasan membuat akun pengguna berperilaku seperti contract account: logika validasi dan eksekusinya bisa diprogram. Empat masalah yang diselesaikannya: (1) gas abstraction — biaya bisa dibayar dengan token ERC-20 atau disponsori paymaster, bukan wajib ETH milik sendiri; (2) social recovery — guardian menyetujui rotasi kunci, seed phrase bukan lagi titik gagal tunggal; (3) batching — banyak aksi (approve + swap + deposit) dieksekusi sebagai satu operasi bertanda tangan sekali; (4) session keys — kunci sementara berizin sempit (mis. hanya untuk game, hanya 1 jam, batas nilai kecil) sehingga pengguna tidak menandatangani setiap klik kecil dengan kunci utama.",
        "Satu konsekuensi yang sering luput: karena logika akun adalah kode, dua smart account bisa punya aturan validasi yang sama sekali berbeda — satu memakai kunci perangkat plus biometrik, satu memakai persetujuan tiga guardian. Di data, keduanya sama-sama tampil sebagai sender UserOperation; analis tidak bisa mengasumsikan model keamanan yang sama untuk semua smart account.",
        "Bagi analis, perbedaan operasionalnya tajam: satu EOA menghasilkan transaksi yang pengirimnya adalah penggunanya sendiri; satu smart account menghasilkan UserOperation yang pengirim on-chain-nya adalah bundler. Menggabungkan keduanya dalam satu metrik “jumlah transaksi” tanpa label segmen adalah mencampur dua satuan yang berbeda perilaku, biaya, dan maknanya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“ERC-4337 mengubah protokol Ethereum.” Salah — dan ini mitos paling awet soal topik ini. ERC-4337 berjalan sepenuhnya di LEVEL APLIKASI: UserOperation beredar di mempool alternatif, bundler mengirimnya sebagai transaksi biasa, dan kontrak EntryPoint yang mengeksekusinya. Tidak ada hard fork, tidak ada perubahan aturan konsensus. Justru karena ia tidak mengubah protokol, ia bisa berjalan di banyak rantai EVM apa adanya.",
      },
      reference: "EOA dikunci satu kunci; smart account dikunci kode.",
    },
    {
      id: "anatomi-userop",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi UserOperation dan tiga aktornya",
      prose: [
        "UserOperation (UserOp) adalah objek mirip transaksi yang dikirim pengguna smart account. Field intinya: sender (alamat smart account pengirim), nonce (urutan anti-replay), callData (aksi yang diminta — kontrak tujuan dan datanya, bisa berisi banyak aksi sekaligus), callGasLimit (gas untuk eksekusi aksi), verificationGasLimit (gas untuk verifikasi tanda tangan dan validasi akun), preVerificationGas (kompensasi biaya bundler di luar rantai, mis. calldata), maxFeePerGas dan maxPriorityFeePerGas (plafon harga gas, mengikuti pola EIP-1559), paymasterAndData (alamat paymaster penanggung biaya bila ada, plus data pendukungnya; kosong bila pengguna membayar sendiri), dan signature (tanda tangan menurut skema akun itu — tidak harus ECDSA kunci tunggal).",
        "Tiga aktor menggerakkannya. BUNDLER mengumpulkan UserOp dari alt mempool (mempool khusus UserOp, terpisah dari mempool transaksi biasa), mensimulasikannya, lalu mengemas banyak UserOp menjadi SATU transaksi ke EntryPoint. ENTRYPOINT adalah kontrak tunggal tepercaya — alamat yang terkenal di mainnet dan banyak rantai EVM adalah 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 — yang memverifikasi tiap UserOp, memotong deposit atau menagih paymaster, lalu mengeksekusi callData-nya. PAYMASTER adalah kontrak penanggung biaya: ia menyetujui mensponsori UserOp tertentu (mis. semua pengguna baru wallet X selama 30 hari) dan membayar gas-nya, bisa dibayar balik dalam token ERC-20.",
        "Alurnya satu napas: pengguna menandatangani UserOp → UserOp masuk alt mempool → bundler mengambil dan mengemasnya bersama UserOp lain → satu transaksi bundler memanggil EntryPoint → EntryPoint memvalidasi (akun valid? paymaster setuju?) → mengeksekusi aksi pengguna → biaya dipotong dari deposit akun atau dari paymaster. Satu baris “transaksi sukses” dari bundler di explorer bisa berarti 80 pengguna berbeda baru saja bertransaksi.",
        "Rumus kerja analis — plafon biaya satu UserOperation:",
      ],
      formula: String.raw`C_{max} = (G_{call} + G_{verify} + G_{pre}) \times F_{max}`,
      formulaNote: "C_max = plafon biaya total satu UserOp; G_call = callGasLimit (gas eksekusi aksi); G_verify = verificationGasLimit (gas verifikasi dan validasi); G_pre = preVerificationGas (kompensasi overhead bundler); F_max = maxFeePerGas (harga gas maksimum yang disetujui pengguna). Satuan: gas dalam unit gas, F_max biasanya dalam gwei (1 gwei = 10^-9 ETH), hasil perkalian dalam gwei. Contoh angka: (90.000 + 70.000 + 21.000) × 25 gwei = 181.000 × 25 = 4.525.000 gwei = 0,004525 ETH. Ini PLAFON, bukan tagihan final: biaya aktual memakai gas yang benar-benar terpakai dan harga gas efektif, lalu sisanya dikembalikan — analis yang melaporkan C_max sebagai biaya riil melebih-lebihkan pengeluaran pengguna.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pikirkan UserOp sebagai formulir pesanan, bukan truk pengirimnya. Formulir itu diisi dan ditandatangani pengguna, dikumpulkan kurir (bundler) bersama formulir orang lain ke dalam satu truk, dan diproses di satu loket resmi (EntryPoint). Mencari “transaksi Rani” di data truk tidak akan ketemu — yang tercatat adalah truknya. Data pengguna ada di formulirnya: itulah mengapa analis ERC-4337 bekerja dari event dan call EntryPoint, bukan dari tabel transaksi mentah.",
      },
      reference: "UserOp itu formulirnya; transaksi bundler itu truknya.",
    },
    {
      id: "metrik-analitik",
      eyebrow: "Langkah 4 · Konsep",
      title: "Metrik analitik: membaca adopsi dari UserOperation",
      prose: [
        "Empat metrik inti membentuk dashboard adopsi account abstraction. ADOPTION: jumlah smart account aktif (sender unik per periode) dan jumlah UserOperation per hari — dua angka ini menjawab “berapa orang” dan “seberapa sering”. SPONSORSHIP RATE: persentase UserOp yang biaya gasnya dibayar paymaster — ukuran seberapa besar adopsi ditopang subsidi, bukan permintaan organik murni. SUCCESS RATE: persentase UserOp yang eksekusinya berhasil; UserOp yang gagal tetap menelan biaya verifikasi, jadi kegagalan di sini bukan gratis. BIAYA RATA-RATA per UserOp: total biaya dibagi jumlah UserOp — angka yang dibandingkan pengguna (dan analis) terhadap biaya transaksi EOA untuk aksi yang sama.",
        "Metrik yang sama menyimpan bacaan risiko. KONSENTRASI BUNDLER: bila satu bundler mengemas 92% dari semua bundle, ekosistem punya titik gagal tunggal — bundler itu berhenti, sensor, atau bermasalah, dan mayoritas pengguna smart account ikut macet meski rantai sehat. KONSENTRASI PAYMASTER: satu paymaster menanggung hampir semua sponsor berarti pertumbuhan bisa berhenti pada hari subsidinya berhenti. PAYMASTER ABUSE: sponsor yang longgar diserang Sybil — ribuan akun sekali pakai menguras dana sponsor untuk aktivitas tak bernilai; di data, gejalanya adalah sponsorship rate naik bersamaan dengan sender unik meledak tetapi retensi dan nilai per akun runtuh.",
        "Satu potongan lagi yang wajib ada di dashboard yang sama: pangsa tiap bundler dan tiap paymaster per periode (share of bundles, share of sponsored gas). Metrik adopsi tanpa tabel pangsa menyembunyikan konsentrasi sampai konsentrasi itu berubah menjadi insiden.",
        "Aturan pelaporan yang sehat: selalu sajikan metrik smart account TERPISAH dari metrik EOA, lalu sajikan gabungannya sebagai tambahan — jangan pernah sebaliknya. Tren gabungan bisa terlihat datar justru karena penurunan EOA menutupi ledakan smart account, dan keputusan produk yang lahir dari rata-rata itu akan salah arah.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Sponsorship rate tinggi = adopsi sehat.” Sponsorship tinggi berarti adopsi yang DIBELI. Ia sehat hanya selama ada bukti pengguna bertahan setelah sponsor dicabut. Laporkan sponsorship rate selalu berdampingan dengan retensi akun pasca-sponsor — angka pertama tanpa angka kedua adalah brosur marketing, bukan analisis.",
      },
      reference: "Adopsi, sponsor, sukses, biaya — pisahkan dari EOA.",
    },
    {
      id: "lab-userop",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung metrik adopsi dari 12 UserOperation",
      prose: [
        "Dataset berisi 12 UserOperation: sender, paymaster (string kosong berarti tidak disponsori), tiga komponen gas (call, verify, pre), max_fee dalam gwei, dan success. Total gas satu UserOp = call + verify + pre; biayanya = total gas × max_fee, dalam gwei.",
        "Tugasmu: (1) hitung jumlah UserOp, success rate (%), dan sponsorship rate (%); (2) hitung rata-rata total gas dan total biaya dalam gwei serta ETH; (3) cetak vonis sponsoring dengan ambang: sponsorship rate ≥ 70% → SPONSOR TINGGI, 40–69% → SPONSOR SEDANG, di bawah 40% → SPONSOR RENDAH.",
        "Hasil yang benar: 10 dari 12 berhasil (83,33%), 9 dari 12 disponsori (75,00%), rata-rata gas 172.250, total biaya 46.688.000 gwei = 0,046688 ETH, vonis SPONSOR TINGGI. Perhatikan dua UserOp gagal tetap masuk hitungan biaya — verifikasi dan pengemasan mereka benar-benar terjadi dan benar-benar dibayar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n`, `success_rate`, dan `sponsorship_rate`" },
        { id: "t2", text: "Hitung `avg_gas`, `total_gwei`, dan `total_eth`" },
        { id: "t3", text: "Tentukan `vonis` dari ambang sponsorship dan cetak semua hasil" },
      ],
      expected: "n=12\nsuccess_rate=83.33%\nsponsorship_rate=75.00%\navg_gas=172250.0\ntotal_biaya=46688000 gwei = 0.046688 ETH\nvonis=SPONSOR TINGGI",
      note: {
        title: "💡 Intuisi",
        body: "Dua paymaster muncul di dataset (0xPM1 enam kali, 0xPM2 tiga kali) dan tiga UserOp membayar sendiri. Sponsorship 75% dengan paymaster terbesar memegang 6 dari 9 sponsor (67%) sudah memberi sinyal konsentrasi awal — di data produksi, tabel sederhana per paymaster seperti ini adalah tempat audit subsidi dimulai.",
      },
      hints: [
        "Sponsored = paymaster bukan string kosong: sum(1 for o in ops if o['paymaster']).",
        "Total gas per UserOp = o['call'] + o['verify'] + o['pre']; biaya = total gas × o['max_fee'].",
        "Konversi: 1 ETH = 1.000.000.000 gwei, jadi total_eth = total_gwei / 1_000_000_000.",
      ],
      code: {
        starter: "# Dataset UserOperation. JANGAN UBAH.\n# paymaster '' = tidak disponsori; max_fee dalam gwei.\nops = [\n    {'sender': '0xA1', 'paymaster': '0xPM1', 'call': 90000, 'verify': 70000, 'pre': 21000, 'max_fee': 25, 'success': True},\n    {'sender': '0xA2', 'paymaster': '0xPM1', 'call': 75000, 'verify': 65000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xA3', 'paymaster': '0xPM2', 'call': 120000, 'verify': 80000, 'pre': 21000, 'max_fee': 30, 'success': True},\n    {'sender': '0xA4', 'paymaster': '', 'call': 60000, 'verify': 50000, 'pre': 21000, 'max_fee': 15, 'success': True},\n    {'sender': '0xA5', 'paymaster': '0xPM1', 'call': 85000, 'verify': 60000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xA6', 'paymaster': '0xPM2', 'call': 100000, 'verify': 75000, 'pre': 21000, 'max_fee': 25, 'success': False},\n    {'sender': '0xA7', 'paymaster': '', 'call': 70000, 'verify': 55000, 'pre': 21000, 'max_fee': 18, 'success': True},\n    {'sender': '0xA8', 'paymaster': '0xPM1', 'call': 95000, 'verify': 70000, 'pre': 21000, 'max_fee': 22, 'success': True},\n    {'sender': '0xA9', 'paymaster': '0xPM2', 'call': 80000, 'verify': 60000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xB1', 'paymaster': '0xPM1', 'call': 110000, 'verify': 80000, 'pre': 21000, 'max_fee': 28, 'success': True},\n    {'sender': '0xB2', 'paymaster': '', 'call': 65000, 'verify': 50000, 'pre': 21000, 'max_fee': 16, 'success': False},\n    {'sender': '0xB3', 'paymaster': '0xPM1', 'call': 88000, 'verify': 62000, 'pre': 21000, 'max_fee': 24, 'success': True},\n]\n\n# TULIS KODEMU\nn = \nsukses = \nsponsor = \ntotal_gas_semua = \ntotal_gwei = \nsuccess_rate = \nsponsorship_rate = \navg_gas = \ntotal_eth = \nvonis = \nprint(f'n={n}')\nprint(f'success_rate={success_rate:.2f}%')\nprint(f'sponsorship_rate={sponsorship_rate:.2f}%')\nprint(f'avg_gas={avg_gas:.1f}')\nprint(f'total_biaya={total_gwei} gwei = {total_eth:.6f} ETH')\nprint(f'vonis={vonis}')\n",
        lockLines: 16,
        solution: "# Dataset UserOperation. JANGAN UBAH.\n# paymaster '' = tidak disponsori; max_fee dalam gwei.\nops = [\n    {'sender': '0xA1', 'paymaster': '0xPM1', 'call': 90000, 'verify': 70000, 'pre': 21000, 'max_fee': 25, 'success': True},\n    {'sender': '0xA2', 'paymaster': '0xPM1', 'call': 75000, 'verify': 65000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xA3', 'paymaster': '0xPM2', 'call': 120000, 'verify': 80000, 'pre': 21000, 'max_fee': 30, 'success': True},\n    {'sender': '0xA4', 'paymaster': '', 'call': 60000, 'verify': 50000, 'pre': 21000, 'max_fee': 15, 'success': True},\n    {'sender': '0xA5', 'paymaster': '0xPM1', 'call': 85000, 'verify': 60000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xA6', 'paymaster': '0xPM2', 'call': 100000, 'verify': 75000, 'pre': 21000, 'max_fee': 25, 'success': False},\n    {'sender': '0xA7', 'paymaster': '', 'call': 70000, 'verify': 55000, 'pre': 21000, 'max_fee': 18, 'success': True},\n    {'sender': '0xA8', 'paymaster': '0xPM1', 'call': 95000, 'verify': 70000, 'pre': 21000, 'max_fee': 22, 'success': True},\n    {'sender': '0xA9', 'paymaster': '0xPM2', 'call': 80000, 'verify': 60000, 'pre': 21000, 'max_fee': 20, 'success': True},\n    {'sender': '0xB1', 'paymaster': '0xPM1', 'call': 110000, 'verify': 80000, 'pre': 21000, 'max_fee': 28, 'success': True},\n    {'sender': '0xB2', 'paymaster': '', 'call': 65000, 'verify': 50000, 'pre': 21000, 'max_fee': 16, 'success': False},\n    {'sender': '0xB3', 'paymaster': '0xPM1', 'call': 88000, 'verify': 62000, 'pre': 21000, 'max_fee': 24, 'success': True},\n]\n\n# TULIS KODEMU\nn = len(ops)\nsukses = sum(1 for o in ops if o['success'])\nsponsor = sum(1 for o in ops if o['paymaster'])\ntotal_gas_semua = sum(o['call'] + o['verify'] + o['pre'] for o in ops)\ntotal_gwei = sum((o['call'] + o['verify'] + o['pre']) * o['max_fee'] for o in ops)\nsuccess_rate = round(sukses / n * 100, 2)\nsponsorship_rate = round(sponsor / n * 100, 2)\navg_gas = total_gas_semua / n\ntotal_eth = total_gwei / 1_000_000_000\nif sponsorship_rate >= 70:\n    vonis = 'SPONSOR TINGGI'\nelif sponsorship_rate >= 40:\n    vonis = 'SPONSOR SEDANG'\nelse:\n    vonis = 'SPONSOR RENDAH'\nprint(f'n={n}')\nprint(f'success_rate={success_rate:.2f}%')\nprint(f'sponsorship_rate={sponsorship_rate:.2f}%')\nprint(f'avg_gas={avg_gas:.1f}')\nprint(f'total_biaya={total_gwei} gwei = {total_eth:.6f} ETH')\nprint(f'vonis={vonis}')\n",
        checks: [
          { kind: "equal", task: "t1", name: "n", value: 12, tol: 0, label: "`n` = 12", msg: "Jumlah seluruh UserOperation di dataset." },
          { kind: "equal", task: "t1", name: "success_rate", value: 83.33, tol: 0.01, label: "success rate ≈ 83,33%", msg: "10 dari 12 UserOp berhasil." },
          { kind: "equal", task: "t1", name: "sponsorship_rate", value: 75, tol: 0.01, label: "sponsorship rate = 75,00%", msg: "9 dari 12 UserOp punya paymaster." },
          { kind: "equal", task: "t2", name: "avg_gas", value: 172250, tol: 1, label: "rata-rata gas = 172.250", msg: "Total gas 2.067.000 dibagi 12." },
          { kind: "equal", task: "t2", name: "total_gwei", value: 46688000, tol: 1, label: "total biaya = 46.688.000 gwei", msg: "Jumlah (call + verify + pre) × max_fee semua UserOp." },
          { kind: "defined", task: "t3", name: "vonis", label: "`vonis` terdefinisi", msg: "Vonis dari ambang sponsorship rate." },
          { kind: "stdout_matches", task: "t3", label: "success rate tercetak", msg: "Format dua desimal dengan tanda %.", pattern: "success_rate=83.33%" },
          { kind: "stdout_matches", task: "t3", label: "vonis tercetak", msg: "75% masuk ambang ≥ 70%.", pattern: "vonis=SPONSOR TINGGI" },
        ],
      },
      reference: "Hitung formulirnya, bukan truknya.",
    },
    {
      id: "chart-adopsi",
      eyebrow: "Langkah 6 · Chart",
      title: "Tren adopsi: pertumbuhan yang tidak terlihat dari EOA",
      prose: [
        "Figur ini menampilkan jumlah UserOperation per minggu selama 8 minggu pada sebuah ekosistem wallet yang baru meluncurkan smart account.",
        "Cara membaca: sumbu X = minggu (Mg 1 sampai Mg 8); sumbu Y = jumlah UserOperation yang dieksekusi EntryPoint minggu itu; angka di atas tiap batang adalah nilai persisnya. Warna batang menggelap mengikuti fase pertumbuhan — awal peluncuran, pertumbuhan, lalu akselerasi.",
        "Interpretasi: volume naik dari 1.200 ke 8.400 UserOp per minggu — tumbuh 7x, atau +600%, dalam 8 minggu, dan kenaikannya mempercepat (lonjakan terbesar justru di dua minggu terakhir: +1.700 lalu +1.600). Ini pola adopsi yang masih berada di fase akselerasi, belum melandai. Kontrasnya: bila minggu-minggu yang sama hanya dibaca dari transaksi EOA, seri ini praktis tidak muncul sama sekali — yang tercatat hanyalah beberapa ratus transaksi bundler. Dua analis dengan sumber data berbeda akan menulis dua laporan pertumbuhan yang bertolak belakang dari rantai yang sama, dan yang benar adalah yang membaca UserOperation.",
        "Catatan kehati-hatian: jumlah UserOperation bukan jumlah pengguna. Satu pengguna aktif bisa mengirim puluhan UserOp sehari, dan batching membuat satu UserOp membawa banyak aksi sekaligus. Pasangkan seri volume ini dengan sender unik per minggu sebelum menyebutnya pertumbuhan pengguna — volume yang naik karena segelintir akun makin aktif adalah cerita yang berbeda dari adopsi yang meluas.",
      ],
      tasks: [],
      figure: {
        svg: FIG_ADOPSI,
        alt: "Bar chart UserOperation per minggu: 1.200, 1.850, 2.400, 3.100, 4.200, 5.100, 6.800, 8.400.",
        caption: "Adopsi smart account naik 7x dalam 8 minggu — tak terlihat dari transaksi EOA.",
      },
      reference: "Trennya di UserOp, bukan di transaksi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan memisahkan smart account dari EOA",
      prose: [
        "Skenario 1 — Dashboard “pengguna aktif” hanya menghitung pengirim transaksi EOA → pisahkan segera: tambahkan sender unik dari UserOperation sebagai segmen sendiri. Selama keduanya dicampur atau segmen AA diabaikan, angka pengguna aktifmu meremehkan kenyataan dan makin salah setiap minggu adopsi naik.",
        "Skenario 2 — Sponsorship rate di atas 70% dan satu paymaster menanggung mayoritasnya → perlakukan pertumbuhan sebagai disubsidi: laporkan biaya sponsor per akun aktif, pantau saldo deposit paymaster, dan siapkan skenario “sponsor berhenti” sebelum manajemen merayakan angka adopsi.",
        "Skenario 3 — Membandingkan biaya antar-wallet atau antar-rantai → pakai rata-rata biaya per UserOp dan pisahkan porsi yang disponsori. Membandingkan biaya UserOp yang disponsori penuh dengan biaya EOA yang dibayar sendiri adalah membandingkan harga subsidi dengan harga pasar.",
        "Skenario 4 — Success rate UserOp anjlok tiba-tiba sementara transaksi EOA normal → curigai lapisan AA dulu: pecah success rate per bundler dan per paymaster. Kegagalan terpusat di satu bundler berarti masalah infrastruktur pengemasan; terpusat di satu paymaster berarti penolakan sponsor; menyebar rata berarti masalah di sisi pengguna atau rantai.",
        "Skenario 5 — Melaporkan pertumbuhan ke manajemen → sajikan tiga baris yang tidak bisa ditawar: aktivitas EOA, aktivitas smart account, dan gabungan berlabel jelas. Satu angka gabungan tanpa rincian menyembunyikan migrasi antar-segmen yang justru paling penting secara strategis.",
        "Aturan 10 detik: (1) sumber datanya membaca UserOp atau hanya transaksi? (2) sponsored atau organik? (3) terkonsentrasi di bundler/paymaster siapa? Tiga jawaban itu menentukan apakah sebuah angka adopsi boleh dipercaya.",
      ],
      tasks: [],
      reference: "Pisahkan segmennya, labeli subsidinya, cek konsentrasinya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Wallet menilai adopsi AA: bagus, rapuh, atau keduanya?",
      prose: [
        "Penyedia wallet W meluncurkan smart account dan meninjau datanya setelah satu kuartal: 48.200 UserOperation per bulan dan terus naik; sponsorship rate 78% (satu paymaster milik W sendiri menanggung 84% dari seluruh sponsor); success rate 91%; dan satu bundler menangani 92% dari semua bundle. Biaya sponsor bulanan W setara Rp310 juta dan naik sebanding dengan volume.",
        "Pertanyaan: (1) Dari empat angka itu, mana bukti adopsi yang kuat dan mana sinyal kerapuhan? (2) Apa yang terjadi pada metrik “pengguna aktif” W bila paymaster menghentikan sponsor bulan depan — dan angka pendamping apa yang harus diperiksa hari ini untuk memprediksinya? (3) Rekomendasi data apa yang kamu tulis untuk tim W: metrik apa yang ditambah ke dashboard sebelum kuartal berikutnya?",
        "Pembahasan: (1) Bukti kuat: volume 48.200 UserOp/bulan yang naik dan success rate 91% menunjukkan produk dipakai dan infrastruktur bekerja. Sinyal rapuh: sponsorship 78% dengan satu paymaster (84%) berarti adopsi disubsidi satu anggaran, dan satu bundler 92% berarti eksekusi bergantung satu operator — dua titik gagal tunggal di dua lapisan berbeda. (2) Bila sponsor berhenti, pengguna yang selama ini tidak pernah membayar gas akan menghadapi biaya sendiri untuk pertama kali; sebagian besar kemungkinan berhenti bertransaksi, sehingga pengguna aktif bisa runtuh jauh lebih cepat daripada naiknya. Angka pendamping penentunya adalah retensi dan aktivitas akun-akun yang subsidinya sudah berakhir atau yang pernah membayar sendiri — cohorts itulah prediktor jujurnya, bukan sponsorship rate. (3) Tambahkan: retensi per cohort sponsor, pangsa bundler dan paymaster (dengan ambang peringatan konsentrasi), biaya sponsor per akun aktif yang bertahan 30 hari, dan success rate per bundler — supaya kerapuhan terlihat di dashboard sebelum terlihat di tagihan.",
      ],
      tasks: [],
      reference: "Adopsinya nyata; fondasinya dua titik gagal tunggal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah — soal adopsi, aktor, rumus biaya, dan cara membacanya sebagai analis. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "Smart account menyelesaikan dua jalan buntu EOA: kunci hilang tanpa pemulihan, dan tidak bisa bergerak tanpa ETH untuk gas — lewat social recovery dan gas abstraction.",
        "ERC-4337 berjalan di level aplikasi lewat EntryPoint, tanpa hard fork: UserOp beredar di alt mempool dan dikemas bundler menjadi transaksi biasa.",
        "UserOperation membawa sender, nonce, callData, tiga komponen gas (call, verification, preVerification), maxFeePerGas, paymasterAndData, dan signature; plafon biayanya (G_call + G_verify + G_pre) × F_max.",
        "Metrik inti analis: adoption (sender unik, UserOp per hari), sponsorship rate, success rate, dan rata-rata biaya per UserOp — selalu terpisah dari metrik EOA.",
        "Risiko dibaca dari konsentrasi: satu bundler dominan dan satu paymaster dominan adalah dua titik gagal tunggal; sponsorship tinggi tanpa retensi pasca-sponsor adalah adopsi yang dibeli.",
        "Analis yang hanya membaca transaksi EOA buta terhadap seluruh segmen smart account — aktivitasnya tercatat sebagai panggilan internal di dalam transaksi bundler ke EntryPoint.",
      ],
      quiz: [
        {
          q: "Pernyataan yang benar tentang ERC-4337:",
          options: [
            { text: "Ia berjalan di level aplikasi lewat kontrak EntryPoint, tanpa mengubah protokol atau hard fork", why: "Benar: UserOp beredar di alt mempool dan dieksekusi EntryPoint sebagai aplikasi di atas rantai.", correct: true },
            { text: "Ia mengubah aturan konsensus Ethereum agar semua akun menjadi kontrak", why: "Salah: tidak ada perubahan konsensus — justru itu keunggulan desainnya." },
            { text: "Ia menghapus kebutuhan gas untuk semua pengguna", why: "Salah: gas tetap dibayar — oleh pengguna lewat depositnya, atau oleh paymaster." },
            { text: "Ia hanya bisa berjalan di satu rantai khusus", why: "Salah: karena level aplikasi, ia berjalan di banyak rantai EVM." },
          ],
        },
        {
          q: "Tugas bundler dalam alur ERC-4337 adalah:",
          options: [
            { text: "Mengumpulkan UserOp dari alt mempool dan mengemasnya menjadi satu transaksi ke EntryPoint", why: "Benar: bundler adalah pengemas dan pengirim on-chain-nya.", correct: true },
            { text: "Menanggung biaya gas semua pengguna atas nama protokol", why: "Salah: itu peran paymaster, dan hanya untuk UserOp yang ia setujui." },
            { text: "Memvalidasi tanda tangan dan mengeksekusi callData setiap UserOp", why: "Salah: validasi dan eksekusi adalah tugas EntryPoint." },
            { text: "Menyimpan kunci privat pengguna smart account", why: "Salah: kunci tetap di sisi pengguna; bundler hanya meneruskan UserOp bertanda tangan." },
          ],
        },
        {
          q: "Satu UserOp: callGasLimit 100.000, verificationGasLimit 50.000, preVerificationGas 21.000, maxFeePerGas 20 gwei. Plafon biayanya:",
          options: [
            { text: "3.420.000 gwei = 0,00342 ETH — dari (100.000 + 50.000 + 21.000) × 20", why: "Benar: total gas 171.000 dikali 20 gwei.", correct: true },
            { text: "2.000.000 gwei — dari callGasLimit × maxFeePerGas saja", why: "Salah: mengabaikan verificationGasLimit dan preVerificationGas." },
            { text: "171.000 gwei — itu total gasnya, bukan biayanya", why: "Salah: 171.000 adalah unit gas; biaya harus dikali harga per gas." },
            { text: "3.420 ETH — tertukar satuan gwei dan ETH", why: "Salah: 3.420.000 gwei = 0,00342 ETH, bukan 3.420 ETH." },
          ],
        },
        {
          q: "Sponsorship rate 78% pada sebuah wallet paling tepat dibaca sebagai:",
          options: [
            { text: "78% UserOp biaya gasnya dibayar paymaster — adopsi kuat tetapi ditopang subsidi yang harus diuji retensinya", why: "Benar: definisinya persis itu, dan interpretasinya menuntut angka retensi pendamping.", correct: true },
            { text: "78% pengguna membayar gas dari kantong sendiri", why: "Salah: kebalikannya — sponsored berarti dibayar paymaster." },
            { text: "78% UserOp berhasil dieksekusi", why: "Salah: itu success rate, metrik yang berbeda." },
            { text: "78% smart account berisiko diretas", why: "Salah: sponsorship rate tidak mengukur keamanan akun." },
          ],
        },
        {
          q: "Analis menghitung pengguna aktif hanya dari pengirim transaksi EOA. Kesalahan terbesarnya:",
          options: [
            { text: "Ia melewatkan seluruh pengguna smart account, karena aksi mereka tercatat sebagai panggilan internal di dalam transaksi bundler ke EntryPoint", why: "Benar: segmen AA tidak muncul sebagai pengirim transaksi — undercount sistematis yang membesar seiring adopsi.", correct: true },
            { text: "Ia menghitung setiap bundler sebagai satu pengguna", why: "Sebagian benar sebagai gejala, tetapi kesalahan terbesarnya adalah kehilangan seluruh segmen penggunanya, bukan salah hitung bundler." },
            { text: "Tidak ada kesalahan — UserOp otomatis tercatat sebagai transaksi pengirimnya", why: "Salah: pengirim on-chain-nya adalah bundler, bukan pengguna." },
            { text: "Ia akan mendapat angka yang terlalu besar", why: "Salah arah: kesalahannya undercount, bukan overcount." },
          ],
        },
      ],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“UserOp tidak muncul di tabel transaksi saya, berarti segmen smart account memang masih kecil.” Ketiadaan di tabelmu adalah sifat cara pencatatan ERC-4337, bukan bukti soal ukuran segmennya. Sebelum menyimpulkan apa pun tentang adopsi, buktikan dulu pipeline datamu benar-benar membaca event dan panggilan EntryPoint — instrumen yang buta tidak bisa melaporkan “nol” yang bisa dipercaya.",
      },
      hints: [
        "Uji cepat: jelaskan alur UserOp → alt mempool → bundler → EntryPoint dengan menyebut siapa membayar gas di tiap skenario.",
        "Ingat: biaya = (call + verify + pre) × maxFee; sponsored ≠ organik; satu bundler 92% = titik gagal tunggal.",
      ],
      next: { label: "BCD29 — Mikrostruktur Pasar Kripto", href: "/v2/learn/bcd29-mikrostruktur-pasar" },
      reference: "Baca formulirnya, pisahkan segmennya, uji subsidinya.",
    },
  ],
};
