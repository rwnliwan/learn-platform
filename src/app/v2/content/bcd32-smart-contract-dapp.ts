import type { V2Lesson } from "../lib/types";

export const bcd32: V2Lesson = {
  slug: "bcd32-smart-contract-dapp",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD32 — Smart Contract dan DApp End-to-End: dari Solidity ke Mainnet",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Donasi Rp 500 ribu yang biayanya Rp 72 ribu — salah hitung gas",
      prose: [
        "Sebuah yayasan ingin menerima donasi lewat smart contract: tiap donasi mencetak satu token tanda terima di rantai. Timnya menulis kontrak Solidity, men-deploy ke mainnet, dan menguji dengan satu donasi. Semuanya jalan. Lalu donasi ke-100 masuk — dan bendahara bertanya kenapa total biaya transaksi sudah Rp 582 ribu untuk donasi yang masuk hanya Rp 50 juta.",
        "Jawabannya ada di aritmetika gas yang tidak pernah dihitung sebelum deploy. Deploy kontrak menghabiskan 1.200.000 gas. Setiap pencetakan token menghabiskan 85.000 gas. Pada harga gas 20 gwei dan harga ETH 3.000 dolar, deploy saja sudah 72 dolar, satu mint 5,10 dolar, dan 1 deploy ditambah 100 mint menjadi 582 dolar. Kontraknya benar; ekonominya tidak pernah dimodelkan.",
        "Lesson ini mengajarkan alur end-to-end menulis dan men-deploy smart contract serta DApp: Solidity, Remix, Truffle/Hardhat, ABI, dan ekonomi gas. Setelah lesson ini kamu bisa: (1) membaca struktur kontrak Solidity dan menjelaskan tiap bagiannya; (2) membedakan alur Remix, Truffle, dan Hardhat; (3) menghitung biaya deploy dan interaksi dari gas, harga gas, dan harga ETH; (4) menjelaskan peran ABI sebagai jembatan antara DApp dan kontrak; (5) menilai kapan deploy ke mainnet layak dan kapan testnet atau L2 lebih masuk akal.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BCD7 menyebut Solidity sepintas saat mengajarkan cara membaca kode honeypot, dan BCD30 mengajarkan kelas exploit kontrak dari sudut pandang audit. Tidak ada lesson yang mengajarkan MENULIS dan MEN-DEPLOY kontrak end-to-end — Solidity, Remix, Truffle/Hardhat, ABI, dan hitung-hitungan gas. Lesson ini mengisi celah itu dari sudut pandang analis data: bukan menjadi developer Solidity, melainkan memahami alur dan ekonominya cukup untuk mengaudit klaim sebuah proyek.",
      },
      reference: "Deploy 1.200.000 gas = 72 dolar; 1 mint 85.000 gas = 5,10 dolar; 1 deploy + 100 mint = 582 dolar (20 gwei, ETH 3.000 dolar).",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca alur smart contract end-to-end dan menghitung biayanya sebelum uang keluar.",
        "(1) Membaca struktur kontrak Solidity: state, fungsi, event, dan modifier;",
        "(2) Membedakan Remix, Truffle, dan Hardhat — kapan memakai yang mana;",
        "(3) Menghitung biaya gas deploy dan interaksi dari tiga angka: gas, harga gas, harga ETH;",
        "(4) Menjelaskan ABI dan cara DApp memanggil kontrak lewatnya;",
        "(5) Memutuskan mainnet vs testnet vs L2 dari hitungan biaya, bukan dari slogan.",
      ],
      tasks: [],
    },
    {
      id: "solidity",
      eyebrow: "Langkah 3 · Teori",
      title: "Solidity: anatomi satu kontrak donasi",
      prose: [
        "Kontrak Solidity adalah program yang tinggal di rantai dan dieksekusi oleh semua node. Kontrak donasi minimal punya empat bagian. State variables: data yang tersimpan permanen di rantai — misalnya totalDonasi dan peta alamat ke jumlah donasi. Fungsi: perilaku — donasi() menerima ETH dan mencetak token tanda terima; tarik() memindahkan dana ke yayasan. Event: catatan di log rantai — DonasiMasuk(donor, jumlah) — yang bisa dibaca analis tanpa memanggil kontrak. Modifier: penjaga — hanyaBendahara memastikan hanya alamat bendahara yang bisa memanggil tarik().",
        "Tiga sifat yang membedakan kontrak dari program biasa. Pertama, immutability: setelah deploy, kodenya tidak bisa diubah — bug ikut terkunci bersama fitur (kecuali pola proxy upgradeable, yang dibahas BCD30). Kedua, eksekusi deterministik: semua node menjalankan kode yang sama dan harus sampai pada hasil yang sama — tidak ada angka acak, tidak ada jam dinding, tidak ada panggilan API eksternal. Ketiga, semua penyimpanan dan komputasi dibayar per satuan gas — kode yang boros penyimpanan adalah kode yang mahal dipakai.",
        "Untuk analis, keterampilan yang paling berharga bukan menulis Solidity dari nol, melainkan MEMBACANYA: menemukan fungsi yang mengubah saldo, modifier yang membatasi siapa bisa memanggil apa, dan event yang menandai apa yang terjadi. BCD7 sudah mengajarkan membaca kode untuk mendeteksi honeypot; di sini kamu membaca kode untuk memahami ekonomi sebuah produk — berapa biaya tiap aksi bagi penggunanya.",
      ],
      tasks: [],
      note: {
        title: "Solidity bukan satu-satunya bahasa",
        body: "Ekosistem EVM memakai Solidity sebagai bahasa utama, dengan Vyper sebagai alternatif yang lebih sederhana dan aman. Di luar EVM, ada Rust untuk Solana dan Move untuk Aptos/Sui. Lesson ini memakai Solidity karena ia bahasa yang paling sering ditemui analis saat membaca kontrak di Etherscan — tetapi pola berpikirnya (state, fungsi, event, gas) berlaku di semua rantai.",
      },
      reference: "Empat bagian kontrak: state, fungsi, event, modifier. Immutability + deterministik + gas = tiga sifat pembeda.",
    },
    {
      id: "toolchain",
      eyebrow: "Langkah 4 · Teori",
      title: "Remix, Truffle, Hardhat: tiga jalan ke rantai yang sama",
      prose: [
        "Remix adalah IDE berbasis browser: tulis kontrak, klik Compile, klik Deploy, pilih jaringan — selesai dalam lima menit. Ia jalan terbaik untuk belajar, prototipe, dan verifikasi cepat. Kelemahannya: tidak ada pengujian otomatis yang serius, tidak ada manajemen dependensi, dan tidak ada pipeline deploy yang bisa diulang — Remix adalah bengkel, bukan pabrik.",
        "Truffle adalah framework klasik: proyek terstruktur dengan folder contracts, migrations, dan test; perintah migrate men-deploy berurutan dengan nomor migrasi; test memakai Mocha/Chai. Hardhat adalah penerusnya yang kini dominan: lingkungan pengembangan lokal (Hardhat Network), konsol interaktif, plugin yang kaya, dan skrip deploy dalam JavaScript/TypeScript. Untuk proyek nyata 2026, Hardhat adalah pilihan default; Truffle tetap ditemui di proyek lama dan tutorial lama.",
        "Alur end-to-end yang sama di ketiganya: (1) tulis dan compile — compiler mengubah Solidity menjadi bytecode plus ABI; (2) test di jaringan lokal — jalankan skenario donasi, tarik, dan kasus gagal; (3) deploy ke testnet — Sepolia untuk Ethereum — dengan ETH testnet gratis dari faucet; (4) verifikasi kode di Etherscan — supaya siapa pun bisa membaca sumbernya, bukan hanya bytecode; (5) deploy ke mainnet — hanya setelah audit dan setelah hitungan gas disetujui. Langkah 3 dan 4 adalah yang paling sering dilewati tim yang terburu-buru — dan yang paling mahal konsekuensinya.",
        "ABI — Application Binary Interface — adalah jembatan antara DApp dan kontrak. ABI adalah daftar fungsi dan event dalam format JSON: nama fungsi, tipe argumen, dan apa yang dikembalikan. DApp (frontend JavaScript) memakai ABI plus alamat kontrak untuk membangun panggilan transaksi lewat library seperti ethers.js atau viem. Tanpa ABI, frontend tidak tahu cara berbicara dengan kontrak; tanpa alamat, ia tidak tahu kontrak yang mana. Analis memakai ABI untuk hal yang sama dari arah berlawanan: mendekode data transaksi mentah menjadi panggilan fungsi yang bisa dibaca manusia.",
      ],
      tasks: [],
      note: {
        title: "Testnet bukan mainnet murahan",
        body: "Testnet memakai ETH yang tidak bernilai — tetapi gas, urutan blok, dan perilaku kontraknya sama. Aturan praktis: bila sebuah alur belum pernah jalan mulus di testnet, ia tidak boleh menyentuh mainnet. Faucet Sepolia memberi ETH testnet gratis; tidak ada alasan melewati langkah ini kecuali terburu-buru — dan terburu-buru adalah penyebab nomor satu deploy yang mahal.",
      },
      reference: "Alur: compile → test lokal → testnet → verifikasi Etherscan → mainnet. ABI = JSON daftar fungsi + event.",
    },
    {
      id: "lab-gas",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator biaya deploy dan mint",
      prose: [
        "Lab ini membangun kalkulator biaya gas: dari gas deploy, gas per mint, jumlah mint, harga gas, dan harga ETH, hitung biaya deploy, biaya satu mint, total gas, total ETH, dan total dolar.",
        "Hitung dulu di kepala. Biaya deploy: 1.200.000 gas dikali 20 gwei sama dengan 24.000.000 gwei sama dengan 0,024 ETH; 0,024 dikali 3.000 sama dengan 72 dolar. Biaya satu mint: 85.000 dikali 20 sama dengan 1.700.000 gwei sama dengan 0,0017 ETH; 0,0017 dikali 3.000 sama dengan 5,10 dolar. Total gas: 1.200.000 ditambah 100 dikali 85.000 sama dengan 9.700.000 gas. Total ETH: 9.700.000 dikali 20 gwei sama dengan 194.000.000 gwei sama dengan 0,194 ETH. Total dolar: 0,194 dikali 3.000 sama dengan 582 dolar.",
        "Tugas lab: tulis fungsi yang menerima deploy_gas, mint_gas, jumlah_mint, gwei, dan harga_eth — lalu mencetak lima angka: deploy_usd, mint_usd, total_gas, total_eth, total_usd. Lima angka ini adalah jawaban atas pertanyaan bendahara: berapa biaya produk ini sebelum satu donasi pun masuk.",
        "Setelah lolos, coba eksperimen: naikkan harga gas menjadi 100 gwei (jam sibuk) dan lihat total menjadi 2.910 dolar — lalu tanyakan: pada harga gas berapa yayasan ini harus pindah ke L2, di mana gas per mint bisa 100 kali lebih murah?",
      ],
      tasks: [
        { id: "t1", text: "Hitung biaya deploy dan biaya satu mint dalam dolar" },
        { id: "t2", text: "Hitung total gas dan total ETH untuk 1 deploy + 100 mint" },
        { id: "t3", text: "Hitung total biaya dalam dolar" },
      ],
      expected: "deploy_usd=72.0\nmint_usd=5.1\ntotal_gas=9700000\ntotal_eth=0.194\ntotal_usd=582.0",
      hints: [
        "Biaya ETH = gas dikali gwei, dibagi 1.000.000.000 (1 ETH = 1 miliar gwei).",
        "Biaya dolar = biaya ETH dikali harga ETH.",
        "Total gas = deploy_gas ditambah jumlah_mint dikali mint_gas.",
        "Jangan membulatkan total_eth — 0,194 adalah nilai eksaknya.",
      ],
      code: {
        starter: `# Kalkulator biaya gas: deploy kontrak donasi + pencetakan token.\ndeploy_gas = 1200000\nmint_gas = 85000\njumlah_mint = 100\ngwei = 20\nharga_eth = 3000\n\n# TULIS KODEMU: hitung lima angka biaya di bawah ini.\n# Cetak, per baris: deploy_usd, mint_usd, total_gas,\n# total_eth, total_usd.\n\n\nkalkulator_gas(deploy_gas, mint_gas, jumlah_mint, gwei, harga_eth)`,
        lockLines: 5,
        solution: `# Kalkulator biaya gas: deploy kontrak donasi + pencetakan token.\ndeploy_gas = 1200000\nmint_gas = 85000\njumlah_mint = 100\ngwei = 20\nharga_eth = 3000\n\n\ndef kalkulator_gas(deploy_gas, mint_gas, jumlah_mint, gwei, harga_eth):\n    deploy_usd = deploy_gas * gwei / 1_000_000_000 * harga_eth\n    mint_usd = mint_gas * gwei / 1_000_000_000 * harga_eth\n    total_gas = deploy_gas + jumlah_mint * mint_gas\n    total_eth = total_gas * gwei / 1_000_000_000\n    total_usd = total_eth * harga_eth\n    print(f"deploy_usd={deploy_usd}")\n    print(f"mint_usd={mint_usd}")\n    print(f"total_gas={total_gas}")\n    print(f"total_eth={total_eth}")\n    print(f"total_usd={total_usd}")\n\n\nkalkulator_gas(deploy_gas, mint_gas, jumlah_mint, gwei, harga_eth)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "deploy_usd=72.0", label: "Deploy 72 dolar", msg: "1.200.000 x 20 gwei = 0,024 ETH x 3.000 = 72 dolar." },
          { kind: "stdout_matches", task: "t1", pattern: "mint_usd=5.1", label: "Satu mint 5,10 dolar", msg: "85.000 x 20 gwei = 0,0017 ETH x 3.000 = 5,10 dolar." },
          { kind: "stdout_matches", task: "t2", pattern: "total_gas=9700000", label: "Total gas 9.700.000", msg: "1.200.000 + 100 x 85.000 = 9.700.000 gas." },
          { kind: "stdout_matches", task: "t2", pattern: "total_eth=0.194", label: "Total 0,194 ETH", msg: "9.700.000 x 20 gwei = 194.000.000 gwei = 0,194 ETH." },
          { kind: "stdout_matches", task: "t3", pattern: "total_usd=582.0", label: "Total 582 dolar", msg: "0,194 ETH x 3.000 = 582 dolar. Inilah angka yang harus dilihat bendahara SEBELUM deploy." },
        ],
      },
      reference: "Deploy 72 dolar; mint 5,10 dolar; total gas 9.700.000; total 0,194 ETH = 582 dolar.",
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 6 · Teori",
      title: "Mainnet, testnet, atau L2: keputusan dari hitungan",
      prose: [
        "Pertanyaan 'deploy di mana' dijawab dengan tiga angka: biaya per aksi, nilai per aksi, dan frekuensi aksi. Donasi rata-rata yayasan ini Rp 500 ribu (sekitar 16 dolar). Biaya mint 5,10 dolar adalah 32 persen dari nilai donasi — pajak tersembunyi yang memakan sepertiga niat baik. Pada harga gas 100 gwei, biaya mint menjadi 25,50 dolar — lebih besar dari donasinya. Produk yang biaya transaksinya 32 persen dari nilai transaksi bukan produk, melainkan donasi untuk validator.",
        "Pilihan yang tersedia: (1) tetap di mainnet bila nilai per aksi besar — donasi korporat Rp 50 juta tidak merasakan biaya 5 dolar; (2) pindah ke L2 (Arbitrum, Optimism, Base) bila aksi kecil dan sering — biaya per mint bisa turun 10 sampai 100 kali; (3) batching — kumpulkan 100 donasi lalu mint sekali per hari, sehingga biaya deploy dan mint dibagi 100 donatur; (4) tunda on-chain — catat donasi off-chain dan hanya settle agregatnya di rantai. Keempatnya sah; yang tidak sah adalah tidak menghitung.",
        "Untuk analis, pelajaran umumnya: setiap klaim produk 'terdesentralisasi, transparan, murah' harus diuji dengan kalkulator, bukan diterima dari situsnya. Hitung biaya per pengguna per aksi, bandingkan dengan nilai per aksi, dan tanyakan siapa yang membayar selisihnya. Bila jawabannya 'pengguna tidak sadar', produk itu sedang menyembunyikan biaya — dan analis yang menemukannya sedang melakukan pekerjaannya.",
      ],
      tasks: [],
      note: {
        title: "Aturan 5 persen",
        body: "Aturan praktis untuk produk ritel on-chain: bila biaya transaksi melebihi 5 persen dari nilai transaksi median, cari L2, batching, atau jalur off-chain. Di bawah 5 persen, mainnet masih bisa dipertahankan. Yayasan ini di 32 persen — jauh melewati ambang — sehingga L2 atau batching bukan optimasi, melainkan syarat hidup produknya.",
      },
      reference: "Biaya mint 5,10 dolar = 32 persen dari donasi 16 dolar. Ambang praktis: biaya di atas 5 persen dari nilai transaksi = cari alternatif.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: yayasan memilih ulang arsitekturnya",
      prose: [
        "Kembali ke yayasan. Setelah melihat angka 582 dolar untuk 100 donasi pertama, timnya menghitung tiga skenario. Skenario mainnet murni: 1.000 donasi setahun berarti 1 deploy + 1.000 mint = 86.200.000 gas = 1,724 ETH = 5.172 dolar per tahun. Skenario L2 dengan biaya per mint 50 kali lebih murah: sekitar 103 dolar per tahun ditambah biaya jembatan sekali. Skenario batching harian di mainnet: 365 mint per tahun, bukan 1.000 — 1 deploy ditambah 365 mint sama dengan 32.225.000 gas sama dengan 0,6445 ETH sama dengan 1.934 dolar per tahun.",
        "Keputusan: donasi dicatat off-chain secara real-time, dan setiap malam satu transaksi batch mencetak seluruh token tanda terima hari itu di L2 — biaya per donatur turun di bawah 10 sen. Mainnet dipakai hanya untuk satu hal: menyimpan hash harian agregat sebagai jangkar audit. Yayasan tetap 'on-chain' dalam arti yang bisa diverifikasi — tetapi biayanya masuk akal.",
        "Tiga hal yang membuat keputusan ini benar. Pertama, dihitung sebelum dibangun ulang — bukan setelah uang habis. Kedua, kebutuhan nyata (bukti donasi yang bisa diverifikasi) dipisah dari kemewahan (tiap donasi sebagai transaksi mainnet sendiri). Ketiga, arsitektur mengikuti ekonomi: rantai dipakai di mana ia memberi nilai (jangkar audit), bukan di mana ia paling mahal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Kesalahan yayasan bukan memilih mainnet — melainkan tidak menghitung dulu. Kalkulator gas adalah alat analis yang paling murah dan paling sering menyelamatkan proyek: lima menit menghitung menghemat 5.172 dolar setahun. Bawa kalkulator ini ke setiap klaim 'murah' yang kamu temui.",
      },
      reference: "Mainnet murni 1.000 donasi = 5.172 dolar/tahun; batching harian = 1.934 dolar; L2 + batching = sekitar 103 dolar.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Empat bagian kontrak: state, fungsi, event, modifier.",
        "Alur: compile → test lokal → testnet → verifikasi Etherscan → mainnet.",
        "Lab: deploy 72 dolar; mint 5,10 dolar; total 0,194 ETH = 582 dolar.",
        "ABI adalah JSON daftar fungsi dan event — jembatan DApp ke kontrak.",
        "Biaya di atas 5 persen dari nilai transaksi = cari L2, batching, atau off-chain.",
      ],
      next: { label: "BCD33 — Blockchain Permissioned: Hyperledger Fabric dan R3 Corda", href: "/v2/learn/bcd33-fabric-corda" },
      quiz: [
        {
          q: "Deploy 1.200.000 gas dan 100 mint @ 85.000 gas, harga gas 20 gwei, ETH 3.000 dolar. Berapa total biayanya?",
          options: [
            { text: "582 dolar (0,194 ETH)", why: "Tepat: total gas 9.700.000 x 20 gwei = 0,194 ETH x 3.000 = 582 dolar.", correct: true },
            { text: "72 dolar — hanya deploy yang dihitung", why: "Salah: 72 dolar hanya deploy. 100 mint menambah 510 dolar lagi." },
            { text: "5.172 dolar — itu biaya 1.000 donasi setahun", why: "Salah: 5.172 dolar adalah skenario mainnet murni untuk 1.000 donasi, bukan 100 mint." },
            { text: "510 dolar — hanya mint yang dihitung", why: "Salah: 510 dolar hanya 100 mint. Deploy 72 dolar ikut dihitung." },
          ],
        },
        {
          q: "Apa peran ABI bagi sebuah DApp?",
          options: [
            { text: "ABI adalah bytecode kontrak yang dieksekusi node", why: "Salah: bytecode dieksekusi node; ABI adalah daftar fungsi dan event dalam JSON untuk pemanggil." },
            { text: "ABI menyimpan saldo dan state kontrak", why: "Salah: state disimpan di rantai, bukan di ABI. ABI hanya menjelaskan cara memanggil." },
            { text: "ABI adalah daftar fungsi dan event (JSON) yang dipakai frontend untuk membangun panggilan ke kontrak", why: "Tepat: tanpa ABI frontend tidak tahu nama fungsi, tipe argumen, dan apa yang dikembalikan.", correct: true },
            { text: "ABI menggantikan alamat kontrak", why: "Salah: ABI dan alamat adalah pasangan — ABI menjelaskan CARA memanggil, alamat menjelaskan kontrak YANG MANA." },
          ],
        },
        {
          q: "Kapan Remix adalah pilihan yang tepat, dan kapan bukan?",
          options: [
            { text: "Remix tepat untuk belajar dan prototipe cepat; bukan untuk proyek dengan test otomatis dan pipeline deploy berulang", why: "Tepat: Remix adalah bengkel — cepat untuk mencoba, tidak punya test serius dan manajemen dependensi.", correct: true },
            { text: "Remix tepat untuk semua proyek, termasuk produksi besar", why: "Salah: proyek besar butuh test otomatis, plugin, dan skrip deploy berulang — wilayah Hardhat." },
            { text: "Remix hanya untuk membaca kontrak, tidak bisa deploy", why: "Salah: Remix bisa compile dan deploy langsung dari browser — itu justru kekuatannya." },
            { text: "Remix sudah tidak dipakai sejak Truffle lahir", why: "Salah: ketiganya hidup berdampingan dengan peran berbeda; Remix tetap jalan tercepat untuk mencoba ide." },
          ],
        },
        {
          q: "Donasi median 16 dolar, biaya mint 5,10 dolar. Apa vonis yang benar?",
          options: [
            { text: "Wajar — biaya transaksi on-chain memang begitu", why: "Salah: 5,10 dolar adalah 32 persen dari donasi. 'Memang begitu' bukan vonis — hitung dulu alternatifnya." },
            { text: "Tidak layak di mainnet apa adanya — 32 persen melewati ambang 5 persen; cari L2, batching, atau off-chain", why: "Tepat: biaya di atas 5 persen dari nilai transaksi berarti arsitektur harus berubah, bukan pengguna yang disalahkan.", correct: true },
            { text: "Naikkan donasi minimum menjadi 100 dolar agar rasionya kecil", why: "Salah: menaikkan minimum mengusir donatur kecil — menyelesaikan rasio dengan mengorbankan misi yayasan." },
            { text: "Pindah ke testnet agar gratis", why: "Salah: testnet memakai ETH tak bernilai — donasi nyata tidak bisa dicatat di sana." },
          ],
        },
        {
          q: "Mengapa verifikasi kode di Etherscan termasuk langkah wajib sebelum mainnet?",
          options: [
            { text: "Supaya gas deploy lebih murah", why: "Salah: verifikasi tidak mengubah gas. Ia mengubah keterbacaan." },
            { text: "Supaya siapa pun bisa membaca sumber kontrak, bukan hanya bytecode — tanpa itu klaim keamanan tidak bisa diperiksa", why: "Tepat: kontrak tak terverifikasi adalah kotak hitam; analis, auditor, dan pengguna tidak bisa memeriksa apa yang sebenarnya di-deploy.", correct: true },
            { text: "Supaya kontrak tidak bisa di-upgrade", why: "Salah: verifikasi tidak ada hubungannya dengan upgradeability — itu ditentukan pola proxy." },
            { text: "Supaya transaksi lebih cepat dikonfirmasi", why: "Salah: kecepatan konfirmasi ditentukan gas dan kongesti, bukan verifikasi." },
          ],
        },
      ],
    },
  ],
};
