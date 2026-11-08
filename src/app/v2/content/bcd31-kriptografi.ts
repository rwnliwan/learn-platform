import type { V2Lesson } from "../lib/types";

export const bcd31: V2Lesson = {
  slug: "bcd31-kriptografi",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD31 — Kriptografi Blockchain: Hash, Merkle Tree dan Tanda Tangan Digital",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Auditor yang tidak perlu melihat seluruh daftar",
      prose: [
        "Sebuah exchange mengklaim memegang dana nasabah 1 banding 1. Auditor datang dan berkata: buktikan bahwa akun saya — satu akun di antara 2 juta akun — ada di daftar cadangan kalian, tanpa saya harus mengunduh daftar 2 juta akun itu, dan tanpa kalian membuka saldo semua nasabah lain. Kedengarannya mustahil. Jawabannya adalah tiga alat kriptografi yang menopang seluruh data on-chain: hash, Merkle tree, dan tanda tangan digital.",
        "Lesson ini melengkapi fondasi yang belum dibahas di track ini. BCD1 sudah menjelaskan konsensus — bagaimana jaringan sepakat lewat proof-of-work, proof-of-stake, dan BFT, serta apa itu serangan 51 persen — dan BCD2 sudah memakai hash sebagai ID transaksi. Yang belum pernah dibedah sistematis adalah mesin di bawahnya: apa sebenarnya hash itu, bagaimana satu hash tunggal bisa mewakili jutaan transaksi, dan bagaimana sebuah tanda tangan membuktikan kepemilikan tanpa membocorkan kunci. Setelah lesson ini kamu bisa: (1) menjelaskan tiga sifat hash dan menguji efek avalanche; (2) membangun Merkle tree dan memverifikasi satu transaksi dengan bukti sepanjang log n; (3) menjelaskan pola sign-verify dan membaca alamat sebagai turunan hash dari kunci publik.",
      ],
      tasks: [],
      note: {
        title: "Yang tidak diulang di sini",
        body: "Konsensus (PoW, PoS, BFT, serangan 51 persen, finalitas) sudah tuntas di BCD1 — lesson ini tidak mengulanginya kecuali satu kalimat rujukan di peta keputusan. Fokus di sini adalah tiga primitif kriptografi yang membuat data konsensus itu bisa dipercaya.",
      },
      reference: "Hash = sidik jari data. Merkle tree = satu sidik jari untuk jutaan data. Tanda tangan = bukti kepemilikan tanpa membuka kunci.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca klaim kriptografi sebuah proyek dan mengujinya dengan angka, bukan dengan slogan.",
        "(1) Menjelaskan tiga sifat hash — deterministik, avalanche, dan tahan preimage — beserta konsekuensi analitisnya;",
        "(2) Membangun Merkle tree dari 8 transaksi, menghitung root-nya, dan memverifikasi satu daun dengan bukti 3 hash;",
        "(3) Menjelaskan pola sign dengan kunci privat dan verify dengan kunci publik, serta membaca alamat sebagai hash dari kunci publik;",
        "(4) Membedakan klaim yang bisa dibuktikan kriptografi (keanggotaan, otentikasi, integritas) dari klaim yang tidak bisa (misal kejujuran isi data).",
      ],
      tasks: [],
    },
    {
      id: "hash",
      eyebrow: "Langkah 3 · Teori",
      title: "Hash: sidik jari yang tidak bisa dipalsukan pelan-pelan",
      prose: [
        "Fungsi hash kriptografi, misalnya SHA-256, mengubah masukan sepanjang apa pun menjadi sidik jari 256 bit yang selalu sama panjangnya — 64 karakter heksadesimal. Tiga sifatnya yang penting untuk analis. Pertama, deterministik: masukan yang sama selalu menghasilkan hash yang sama, di komputer mana pun, kapan pun. Kedua, avalanche: mengubah SATU huruf saja mengubah sebagian besar keluarannya — pada contoh lab, mengganti satu huruf pada kalimat transfer mengubah 62 dari 64 karakter hex. Ketiga, tahan preimage: dari hash-nya saja, praktis mustahil menemukan kembali masukan aslinya — satu-satunya jalan adalah menebak masukan satu per satu.",
        "Konsekuensi analitisnya langsung. Hash di BCD2 dipakai sebagai ID transaksi justru karena sifat pertama dan kedua: ID itu stabil (bisa dirujuk lintas sistem) dan sensitif (transaksi yang diubah satu wei saja mendapat ID yang sama sekali berbeda). Sifat ketiga yang membuat hash bisa dipakai untuk komitmen: exchange bisa mempublikasikan hash daftar cadangannya hari ini, dan tidak bisa mengubah daftar itu besok tanpa hash-nya berubah — siapa pun bisa memeriksa.",
        "Yang hash TIDAK bisa lakukan sama pentingnya. Hash tidak membuktikan bahwa datanya benar — hanya bahwa datanya tidak berubah sejak di-hash. Daftar cadangan yang isinya karangan tetapi di-hash dengan jujur tetap lolos uji hash. Analis yang menulis 'terverifikasi hash, jadi datanya benar' sedang mengklaim sesuatu yang tidak dibuktikan hash. Hash membuktikan integritas, bukan kejujuran.",
      ],
      tasks: [],
      formula: String.raw`\text{SHA-256}(x) \in \{0,1\}^{256}`,
      formulaNote: "Keluaran selalu 256 bit (64 karakter hex) apa pun panjang masukannya. Satu bit masukan berubah, rata-rata separuh bit keluaran berubah — itulah avalanche.",
      note: {
        title: "Sering salah",
        body: "Mengira dua masukan berbeda tidak mungkin punya hash sama. Secara teori tabrakan itu ada — ruang keluarannya berhingga — tetapi menemukannya butuh usaha sekitar 2 pangkat 128 percobaan, jauh di luar jangkauan praktis. 'Praktis mustahil' bukan 'mustahil secara matematis', dan analis yang jujur memakai kata pertama.",
      },
      reference: "Deterministik + avalanche + tahan preimage = sidik jari yang bisa dipercaya untuk integritas.",
    },
    {
      id: "merkle",
      eyebrow: "Langkah 4 · Teori",
      title: "Merkle tree: satu hash untuk jutaan transaksi",
      prose: [
        "Merkle tree menyusun hash secara berpasangan seperti turnamen. Delapan hash transaksi dipasangkan menjadi empat hash, lalu dua, lalu satu: root. Root itu adalah sidik jari seluruh blok — mengubah satu transaksi di daun mana pun mengubah root-nya. Inilah yang disimpan di header blok: bukan 8 transaksi, bukan 8.000 transaksi, melainkan satu hash 32 byte.",
        "Kekuatan sebenarnya ada pada bukti keanggotaan (Merkle proof). Untuk membuktikan transaksi ke-3 ada di blok berisi 8 transaksi, kamu tidak perlu membawa 8 transaksi — cukup 3 hash saudara di sepanjang jalur dari daun ke root: saudara daun, saudara induk, saudara kakek. Verifikasi tinggal menghitung hash berpasangan tiga kali dan membandingkannya dengan root. Panjang bukti tumbuh logaritmik: blok 1.024 transaksi butuh bukti 10 hash; blok 1 juta transaksi butuh 20 hash. Inilah yang membuat light client mungkin: ponsel yang hanya menyimpan header blok tetap bisa memverifikasi satu transaksi dengan bukti 20 hash.",
        "Untuk analis, Merkle proof adalah alat audit yang konkret. Klaim 'akunmu ada di daftar cadangan' bisa dijawab dengan: tunjukkan daunnya, tunjukkan buktinya, saya hitung sendiri root-nya dan bandingkan dengan root yang dipublikasikan. Bila cocok, keanggotaan terbukti tanpa membuka daftar. Bila proyek menolak memberikan bukti tetapi tetap mengklaim 'sudah diverifikasi', itu bukan keterbatasan teknis — itu pilihan untuk tidak transparan.",
      ],
      tasks: [],
      formula: String.raw`\text{panjang bukti} = \log_2(n)`,
      formulaNote: "Untuk n daun, bukti keanggotaan berisi log basis 2 dari n hash. Contoh: 8 daun menjadi 3 hash; 1.024 daun menjadi 10 hash; 1.048.576 daun menjadi 20 hash.",
      note: {
        title: "Sering salah",
        body: "Mengira Merkle proof membuktikan transaksi itu VALID. Proof hanya membuktikan transaksi itu ADA di dalam kumpulan yang di-root-kan. Transaksi yang ada di blok tetapi melanggar aturan (misal double spend yang lolos karena bug) tetap terbukti 'ada' — validitas adalah urusan aturan konsensus di BCD1, bukan urusan Merkle tree.",
      },
      reference: "Root = sidik jari seluruh kumpulan. Bukti = log n hash. Verifikasi = hitung ulang jalur ke root.",
    },
    {
      id: "tanda-tangan",
      eyebrow: "Langkah 5 · Teori",
      title: "Tanda tangan digital: bukti kepemilikan tanpa membuka kunci",
      prose: [
        "Tanda tangan digital bekerja dengan sepasang kunci: kunci privat yang dirahasiakan, dan kunci publik yang boleh disebar. Menandatangani berarti mengolah hash pesan dengan kunci privat menjadi tanda tangan; siapa pun bisa memverifikasi dengan kunci publik bahwa tanda tangan itu hanya mungkin dibuat oleh pemegang kunci privat — tanpa pernah melihat kunci privatnya. Pola ini, sign dengan privat dan verify dengan publik, adalah satu-satunya alasan 'kepemilikan' bisa dibuktikan di blockchain: tidak ada KTP, tidak ada username, hanya kemampuan menandatangani.",
        "Alamat adalah turunan dari kunci publik, bukan kunci itu sendiri. Di Ethereum, alamat adalah 20 byte terakhir dari hash keccak-256 kunci publik. Artinya, alamat bisa dibagikan bebas tanpa membocorkan kunci publik penuh — dan tentu tanpa membocorkan kunci privat. Analis yang menemukan kunci publik seseorang dari tanda tangannya di chain tidak menemukan apa-apa yang rahasia: kunci publik memang dirancang untuk dilihat.",
        "Lab di bawah memakai contoh mainan RSA kecil (n 3.233, kunci publik 17, kunci privat 2.753) agar aritmetikanya bisa diikuti dengan tangan: hash pesan 123 ditandatangani menjadi 2.746, dan verifikasi RSA mainan mengembalikannya ke 123. Blockchain nyata memakai ECDSA di atas kurva eliptik, bukan RSA — polanya identik (privat menandatangani, publik memverifikasi), tetapi verifikasi ECDSA hanya menjawab sah atau tidak sah, bukan memulihkan pesan; verifikasi yang gagal berarti pesan atau penandatangan tidak cocok. Satu peringatan praktis: tanda tangan membuktikan SIAPA yang menandatangani, bukan APA yang ditandatangani itu benar — transaksi penipuan yang ditandatangani pemilik sah tetap sah secara kriptografi.",
      ],
      tasks: [],
      formula: String.raw`\text{verify}(m, \text{sign}(m, sk), pk) = \text{true}`,
      formulaNote: "Tanda tangani pesan m dengan kunci privat sk, verifikasi dengan kunci publik pk: verifikasi menjawab benar (true) bila dan hanya bila pasangan kuncinya cocok. Untuk RSA mainan di lab, verifikasi memulihkan pesan (123 menjadi tanda tangan 2.746, verifikasi mengembalikan 123) — tetapi verifikasi ECDSA yang dipakai blockchain nyata hanya menjawab sah atau tidak sah (pesan/hash sebagai masukan), bukan memulihkan pesan.",
      note: {
        title: "Sering salah",
        body: "Mengira alamat SAMA DENGAN kunci publik. Alamat adalah hash yang dipotong dari kunci publik. Akibatnya: dari alamat saja kamu tidak bisa mendapatkan kunci publiknya — kunci publik baru terungkap saat pemiliknya pertama kali menandatangani transaksi dari alamat itu.",
      },
      reference: "Privat menandatangani, publik memverifikasi. Alamat = hash kunci publik yang dipotong.",
    },
    {
      id: "lab-kripto",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: avalanche, Merkle root, dan tanda tangan mainan",
      prose: [
        "Sekarang buktikan ketiganya dengan kode. Delapan transaksi mainan tx1 sampai tx8, masing-masing 'Alice ke Bob' 10 sampai 80 ETH. Pertama, uji avalanche: hash kalimat 'Transfer 100 ETH ke Alice' dan kalimat yang sama dengan satu huruf diubah ('Alicf') — 8 karakter hex pertama berubah total, dan dari 64 karakter, 62 berbeda. Kedua, bangun Merkle tree dari 8 daun dan hitung root-nya: 8c7f265871b5605623de3cdfcfa68f8a7ac3865e2ad0fca9e9d67cd2ac7601e3, dengan bukti untuk daun indeks 2 sepanjang 3 hash. Ketiga, tanda tangan mainan RSA: hash pesan 123, kunci privat 2.753, tanda tangan 2.746, verifikasi mengembalikan 123.",
        "Perhatikan urutan penggabungan di Merkle tree: pasangan selalu digabung kiri lalu kanan (hash kiri tambah hash kanan), dan bukti diverifikasi dengan memperhatikan posisi — saudara di kiri digabung di depan, saudara di kanan digabung di belakang. Menukar urutan menghasilkan root yang berbeda, dan verifikasi gagal. Itulah kenapa implementasi Merkle proof yang ceroboh (selalu menggabung tanpa memperhatikan posisi) adalah bug klasik.",
        "Setelah lolos, coba eksperimen: ubah satu transaksi (misal tx3 dari 30 menjadi 31 ETH) dan lihat root berubah total — lalu coba verifikasi bukti lama terhadap root baru: gagal. Itulah integritas yang dimaksud teori: satu perubahan kecil, root baru, bukti lama mati.",
      ],
      tasks: [
        { id: "t1", text: "Hitung h1 dan h2 (SHA-256 dua kalimat yang beda satu huruf) lalu hitung `beda` = jumlah karakter hex yang berbeda" },
        { id: "t2", text: "Bangun Merkle tree dari 8 daun dan hitung `root`" },
        { id: "t3", text: "Bangun bukti Merkle untuk daun indeks 2 dan verifikasi sehingga `verifikasi_merkle` True" },
        { id: "t4", text: "Hitung tanda tangan mainan `sig` = 123 pangkat 2753 mod 3233, lalu verifikasi sehingga `verifikasi_tanda_tangan` True" },
      ],
      expected: "h1=58337ebe\nh2=969d3f6b\nbeda=62\nroot=8c7f265871b5605623de3cdfcfa68f8a7ac3865e2ad0fca9e9d67cd2ac7601e3\nproof=3\nverifikasi_merkle=True\nsig=2746\nverifikasi_tanda_tangan=True",
      hints: [
        "Avalanche: bandingkan karakter per karakter kedua string hex, hitung yang berbeda.",
        "Merkle: lapis demi lapis, pasangkan (0,1), (2,3), ... dan hash gabungan string hex-nya.",
        "Bukti: di tiap lapis ambil saudara indeks (idx xor 1), lalu idx dibagi 2.",
        "Tanda tangan: pow(123, 2753, 3233) di Python langsung memberi 2746; verifikasi pow(sig, 17, 3233).",
      ],
      code: {
        starter: `import hashlib\n\ndef sha(teks):\n    return hashlib.sha256(teks.encode()).hexdigest()\n\n# t1: avalanche — satu huruf berubah\nh1 = sha("Transfer 100 ETH ke Alice")\nh2 = sha("Transfer 100 ETH ke Alicf")\nbeda = 0  # TULIS KODEMU: hitung karakter hex yang berbeda\n\n# t2: Merkle tree 8 transaksi\ntxs = [f"tx{i+1}: Alice->Bob {10*(i+1)} ETH" for i in range(8)]\ndaun = [sha(t) for t in txs]\n\ndef merkle_root(hashes):\n    return ""  # TULIS KODEMU: gabung berpasangan sampai satu hash\n\nroot = merkle_root(daun)\n\n# t3: bukti Merkle untuk daun indeks 2\nproof = []  # TULIS KODEMU: kumpulkan hash saudara tiap lapis\nverifikasi_merkle = False  # TULIS KODEMU: hitung ulang jalur ke root, bandingkan\n\n# t4: tanda tangan mainan RSA (n=3233, e=17, d=2753), hash pesan 123\nsig = 0  # TULIS KODEMU: pow(123, 2753, 3233)\nverifikasi_tanda_tangan = False  # TULIS KODEMU: pow(sig, 17, 3233) == 123\n\nprint(f"h1={h1[:8]}")\nprint(f"h2={h2[:8]}")\nprint(f"beda={beda}")\nprint(f"root={root}")\nprint(f"proof={len(proof)}")\nprint(f"verifikasi_merkle={verifikasi_merkle}")\nprint(f"sig={sig}")\nprint(f"verifikasi_tanda_tangan={verifikasi_tanda_tangan}")`,
        lockLines: 4,
        solution: `import hashlib\n\ndef sha(teks):\n    return hashlib.sha256(teks.encode()).hexdigest()\n\n# t1: avalanche — satu huruf berubah\nh1 = sha("Transfer 100 ETH ke Alice")\nh2 = sha("Transfer 100 ETH ke Alicf")\nbeda = sum(1 for a, b in zip(h1, h2) if a != b)\n\n# t2: Merkle tree 8 transaksi\ntxs = [f"tx{i+1}: Alice->Bob {10*(i+1)} ETH" for i in range(8)]\ndaun = [sha(t) for t in txs]\n\ndef merkle_root(hashes):\n    lapis = hashes[:]\n    while len(lapis) > 1:\n        berikut = []\n        for i in range(0, len(lapis), 2):\n            berikut.append(sha(lapis[i] + lapis[i+1]))\n        lapis = berikut\n    return lapis[0]\n\nroot = merkle_root(daun)\n\n# t3: bukti Merkle untuk daun indeks 2\nproof = []\nlapis = daun[:]\nidx = 2\nwhile len(lapis) > 1:\n    proof.append(lapis[idx ^ 1])\n    berikut = []\n    for i in range(0, len(lapis), 2):\n        berikut.append(sha(lapis[i] + lapis[i+1]))\n    lapis = berikut\n    idx //= 2\n\nh = daun[2]\nidx = 2\nfor saudara in proof:\n    if idx % 2 == 0:\n        h = sha(h + saudara)\n    else:\n        h = sha(saudara + h)\n    idx //= 2\nverifikasi_merkle = (h == root)\n\n# t4: tanda tangan mainan RSA (n=3233, e=17, d=2753), hash pesan 123\nsig = pow(123, 2753, 3233)\nverifikasi_tanda_tangan = (pow(sig, 17, 3233) == 123)\n\nprint(f"h1={h1[:8]}")\nprint(f"h2={h2[:8]}")\nprint(f"beda={beda}")\nprint(f"root={root}")\nprint(f"proof={len(proof)}")\nprint(f"verifikasi_merkle={verifikasi_merkle}")\nprint(f"sig={sig}")\nprint(f"verifikasi_tanda_tangan={verifikasi_tanda_tangan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "beda", value: 62, label: "`beda` = 62 dari 64 karakter hex", msg: "Satu huruf berubah mengubah 62 dari 64 karakter hex — itulah avalanche. Bandingkan h1 dan h2 karakter per karakter." },
          { kind: "stdout_matches", task: "t2", pattern: "root=8c7f265871b5605623de3cdfcfa68f8a7ac3865e2ad0fca9e9d67cd2ac7601e3", label: "Merkle root 8 transaksi benar", msg: "Root harus 8c7f26...01e3. Periksa urutan gabung kiri lalu kanan di tiap lapis." },
          { kind: "stdout_matches", task: "t3", pattern: "proof=3", label: "Bukti Merkle daun indeks 2 sepanjang 3 hash", msg: "8 daun berarti bukti log2(8) = 3 hash. Ambil saudara (idx xor 1) di tiap lapis." },
          { kind: "stdout_matches", task: "t3", pattern: "verifikasi_merkle=True", label: "Verifikasi Merkle mengembalikan True", msg: "Hitung ulang jalur dari daun ke root dengan memperhatikan posisi saudara (kiri/kanan), lalu bandingkan dengan root." },
          { kind: "equal", task: "t4", name: "sig", value: 2746, label: "Tanda tangan mainan = 2746", msg: "sig = pow(123, 2753, 3233) = 2746. Verifikasi pow(2746, 17, 3233) harus mengembalikan 123." },
        ],
      },
      reference: "Avalanche 62 dari 64 karakter. Root 8 daun = 8c7f26...01e3. Bukti = 3 hash. Tanda tangan mainan 123 menjadi 2746.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: alat apa untuk klaim apa",
      prose: [
        "Skenario 1 — 'Buktikan satu transaksi ada di blok ini tanpa mengunduh bloknya.' → Merkle proof. Alasan: bukti sepanjang log n, verifikasi cukup bandingkan root dengan header blok. Contoh nyata: light client memverifikasi pembayaran dengan 20 hash untuk blok sejuta transaksi.",
        "Skenario 2 — 'Buktikan dompet ini milikmu.' → Tanda tangan digital. Alasan: hanya pemegang kunci privat yang bisa menandatangani pesan tantangan (challenge) — tidak ada kata sandi yang dipertukarkan. Contoh nyata: login dengan dompet (sign-in with Ethereum) meminta pengguna menandatangani pesan acak.",
        "Skenario 3 — 'Buktikan file ini tidak diubah sejak kemarin.' → Hash. Alasan: bandingkan hash hari ini dengan hash kemarin — bila sama, isi sama. Contoh nyata: hash commit di laporan audit (BCD30) mengikat laporan ke kode persis yang diperiksa.",
        "Skenario 4 — 'Buktikan jaringan menyepakati urutan transaksi.' → BUKAN ketiganya — itu urusan konsensus di BCD1 (PoW, PoS, BFT). Alasan: hash, Merkle, dan tanda tangan membuktikan integritas dan otentikasi, bukan kesepakatan antar node. Mencampur keduanya adalah kesalahan kategori paling umum dalam membaca whitepaper.",
        "Aturan praktis 10 detik: ada yang mengklaim 'terverifikasi kriptografi'? Tanyakan verifikasi APA: keanggotaan (Merkle), kepemilikan (tanda tangan), atau integritas (hash). Bila jawabannya tidak menyebut salah satu dari ketiganya secara spesifik, klaim itu slogan, bukan bukti.",
      ],
      tasks: [],
      reference: "Merkle untuk keanggotaan, tanda tangan untuk kepemilikan, hash untuk integritas. Konsensus tetap urusan BCD1.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: proof of reserves yang bisa kamu periksa sendiri",
      prose: [
        "Exchange X mengumumkan proof of reserves: root Merkle 9f2c... dipublikasikan, dan setiap nasabah bisa meminta bukti bahwa saldonya termasuk. Kamu nasabah dengan saldo 2,5 ETH. Exchange memberimu daun hash saldomu dan bukti 21 hash. Kamu menghitung jalur itu dan mendapat root yang sama dengan yang dipublikasikan. Apa yang terbukti, dan apa yang tidak?",
        "Yang terbukti: saldomu 2,5 ETH termasuk dalam kumpulan yang di-root-kan — dengan asumsi root yang dipublikasikan adalah root yang benar dan tidak diganti diam-diam. Yang TIDAK terbukti: (1) bahwa total liabilitas exchange sama dengan total cadangan — root hanya membuktikan keanggotaan satu daun, bukan jumlah seluruh daun; (2) bahwa aset cadangan benar-benar ada dan tidak dipinjamkan — itu urusan audit aset, bukan Merkle tree; (3) bahwa tidak ada liabilitas tersembunyi di luar daftar — daftar yang di-hash bisa saja tidak lengkap.",
        "Pembahasan: proof of reserves yang jujur selalu memasangkan bukti Merkle (liabilitas) dengan audit aset independen (cadangan) DAN total liabilitas yang dipublikasikan agar siapa pun bisa menjumlahkan. Analis yang menulis 'exchange terbukti solven karena Merkle proof' sedang mengklaim tiga hal dari satu bukti yang hanya membuktikan satu hal. Tulis batasnya eksplisit: 'keanggotaan terbukti; solvabilitas belum'.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Bukti 21 hash berarti kumpulan berisi sekitar 2 pangkat 21 (2 juta) daun — konsisten dengan 2 juta akun. Root yang cocok membuktikan keanggotaan, bukan solvabilitas. Solvabilitas butuh tiga bukti: keanggotaan (Merkle), total liabilitas (jumlah seluruh daun), dan aset (audit independen).",
      },
      reference: "Merkle membuktikan keanggotaan. Solvabilitas butuh keanggotaan + total liabilitas + audit aset.",
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
        "Hash SHA-256: deterministik, avalanche (62 dari 64 karakter berubah untuk satu huruf), tahan preimage — membuktikan integritas, bukan kejujuran.",
        "Merkle tree: root adalah sidik jari seluruh kumpulan; bukti keanggotaan sepanjang log2(n) — 8 daun menjadi 3 hash, sejuta daun menjadi 20 hash.",
        "Tanda tangan digital: privat menandatangani, publik memverifikasi; alamat = 20 byte terakhir hash kunci publik.",
        "Lab: root 8 transaksi 8c7f26...01e3; tanda tangan mainan 123 menjadi 2746 dan terverifikasi kembali ke 123.",
        "Konsensus (PoW, PoS, BFT, serangan 51 persen) tetap di BCD1 — jangan campur bukti kriptografi dengan kesepakatan jaringan.",
      ],
      next: { label: "BCD32 — Smart Contract dan DApp End-to-End: dari Solidity ke Mainnet", href: "/v2/learn/bcd32-smart-contract-dapp" },
      quiz: [
        {
          q: "Mengapa mengubah satu huruf pada kalimat transfer mengubah 62 dari 64 karakter hash-nya?",
          options: [
            { text: "Karena SHA-256 menambahkan karakter acak setiap kali dipanggil", why: "Salah: SHA-256 deterministik — masukan yang sama selalu memberi hash yang sama. Yang berubah adalah masukan, bukan fungsinya." },
            { text: "Karena sifat avalanche: perubahan kecil pada masukan menyebar ke sebagian besar keluaran", why: "Tepat: avalanche adalah sifat yang dirancang — satu bit berubah, rata-rata separuh bit keluaran berubah.", correct: true },
            { text: "Karena hash menyimpan seluruh isi kalimat di dalamnya", why: "Salah: hash 256 bit tidak menyimpan isi kalimat. Ia sidik jari, bukan salinan — dan dari sidik jari saja isinya praktis tidak bisa dipulihkan." },
            { text: "Karena kalimat yang lebih panjang selalu menghasilkan hash yang lebih acak", why: "Salah: panjang masukan tidak menentukan keacakan. Satu huruf pada kalimat pendek pun memicu avalanche yang sama." },
          ],
        },
        {
          q: "Blok berisi 1.024 transaksi. Berapa panjang bukti Merkle untuk satu transaksi?",
          options: [
            { text: "1.024 hash — satu per transaksi", why: "Salah: itu yang terjadi bila kamu membawa seluruh blok. Bukti Merkle justru menghindari itu." },
            { text: "10 hash — log2(1.024)", why: "Tepat: satu hash saudara per lapis, dan 1.024 daun berarti 10 lapis. Inilah yang membuat light client mungkin.", correct: true },
            { text: "2 hash — satu dari tiap sisi pohon", why: "Salah: pohon punya 10 lapis, bukan 2. Tiap lapis menyumbang satu hash saudara." },
            { text: "32 hash — satu per byte root", why: "Salah: 32 byte adalah panjang root, bukan panjang bukti. Bukti tumbuh dengan log jumlah daun." },
          ],
        },
        {
          q: "Exchange memberi bukti Merkle bahwa saldomu termasuk dalam daftar cadangannya, dan root-nya cocok. Apa yang SUDAH terbukti?",
          options: [
            { text: "Exchange solven — asetnya menutupi seluruh liabilitas", why: "Salah: bukti hanya menunjukkan satu daun ada di kumpulan. Solvabilitas butuh total liabilitas dan audit aset — keduanya tidak dibuktikan Merkle proof." },
            { text: "Saldomu termasuk dalam kumpulan yang di-root-kan — tidak lebih, tidak kurang", why: "Tepat: keanggotaan adalah tepat apa yang dibuktikan Merkle proof. Total liabilitas dan keberadaan aset adalah klaim terpisah.", correct: true },
            { text: "Saldo semua nasabah lain juga benar", why: "Salah: bukti satu daun tidak berkata apa-apa tentang daun lain — saldo lain bisa karangan dan buktimu tetap cocok." },
            { text: "Daftar cadangan itu lengkap — tidak ada liabilitas tersembunyi", why: "Salah: daftar yang di-hash bisa saja tidak lengkap. Merkle tree tidak bisa mendeteksi daun yang sengaja tidak dimasukkan." },
          ],
        },
        {
          q: "Di lab, hash pesan 123 ditandatangani menjadi 2.746 dengan kunci privat 2.753, dan verifikasi mengembalikannya ke 123. Apa yang dibuktikan verifikasi yang berhasil itu?",
          options: [
            { text: "Bahwa pesan 123 itu benar dan jujur isinya", why: "Salah: verifikasi hanya membuktikan pasangan kunci cocok. Pesan penipuan yang ditandatangani pemilik sah tetap terverifikasi." },
            { text: "Bahwa tanda tangan itu dibuat oleh pemegang kunci privat yang berpasangan dengan kunci publik itu", why: "Tepat: hanya pemegang privat yang bisa menghasilkan tanda tangan yang lolos verifikasi publik. Itulah bukti kepemilikan.", correct: true },
            { text: "Bahwa kunci privatnya adalah 2.753", why: "Salah: verifikasi tidak pernah menyentuh kunci privat — justru itulah gunanya. Kunci privat tetap rahasia." },
            { text: "Bahwa pesan itu belum pernah ditandatangani sebelumnya", why: "Salah: tanda tangan yang sama atas pesan yang sama akan selalu lolos. Keunikan pesan dijamin nonce (BCD2), bukan tanda tangan." },
          ],
        },
        {
          q: "Analis menulis: 'Kontrak ini aman karena jaringannya memakai proof-of-stake, jadi tanda tangannya tidak bisa dipalsukan.' Apa yang salah dari kalimat itu?",
          options: [
            { text: "Tidak ada yang salah — PoS memang menjamin tanda tangan", why: "Salah: PoS adalah mekanisme konsensus (BCD1), sedangkan anti-pemalsuan tanda tangan adalah sifat kriptografi kunci — dua lapisan berbeda." },
            { text: "Ia mencampur lapisan: konsensus (kesepakatan jaringan) dengan kriptografi (otentikasi) — dua hal yang dibuktikan alat berbeda", why: "Tepat: PoS menjawab 'siapa boleh menulis blok', tanda tangan menjawab 'siapa yang menandatangani'. Keduanya penting, keduanya berbeda.", correct: true },
            { text: "Proof-of-stake tidak dipakai di blockchain mana pun", why: "Salah: PoS dipakai luas (misal Ethereum pasca-Merge). Kesalahannya bukan soal PoS-nya, melainkan soal apa yang diklaim darinya." },
            { text: "Tanda tangan di blockchain memang bisa dipalsukan dengan mudah", why: "Salah: memalsukan tanda tangan tanpa kunci privat praktis mustahil. Kalimat itu salah karena alasan yang diklaim, bukan karena kesimpulannya." },
          ],
        },
      ],
    },
  ],
};
