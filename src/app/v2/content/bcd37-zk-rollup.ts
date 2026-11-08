import type { V2Lesson } from "../lib/types";

export const bcd37: V2Lesson = {
  slug: "bcd37-zk-rollup",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD37 — ZK-Proof dan ZK-Rollup: Bukti Tanpa Membuka Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "1.000 transaksi seharga 1.200 gas per transaksi — bukan 21.000",
      prose: [
        "Sebuah bursa kripto memproses 1.000 penarikan sehari di Ethereum. Di L1, tiap penarikan menghabiskan 21.000 gas — 21 juta gas sehari. Pada harga gas 20 gwei dan ETH 3.000 dolar, itu 1.260 dolar sehari, 37.800 dolar sebulan. Lalu mereka pindah ke ZK-rollup: 1.000 transaksi dikemas dalam satu batch seharga 1.200.000 gas — 1.200 gas per transaksi, 0,072 dolar per transaksi, 72 dolar sehari. Penghematan 94,3 persen.",
        "Triknya adalah zero-knowledge proof: rollup membuktikan ke L1 bahwa 1.000 transaksi itu sah — tanpa L1 harus memeriksa satu per satu. Yang dikompresi adalah PEMERIKSAANNYA, bukan datanya: isi transaksi tetap dipublikasikan ke L1 agar siapa pun bisa merekonstruksi state. L1 hanya memverifikasi satu bukti kriptografi singkat — bukti bahwa transisi state-nya sah, bukan bukti yang menyembunyikan transaksinya.",
        "Lesson ini mengajarkan ZK-proof dan ZK-rollup sebagai teknologi: tiga sifat bukti, SNARK vs STARK, cara kerja rollup, dan aritmetika penghematannya. Setelah lesson ini kamu bisa: (1) menjelaskan tiga sifat zero-knowledge proof; (2) membedakan zk-SNARK dan zk-STARK; (3) menjelaskan cara kerja ZK-rollup — sequencer, prover, verifier; (4) menghitung penghematan gas dan biaya per transaksi; (5) menilai kapan ZK-rollup cocok dan kapan tidak.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson BCD yang membahas zero-knowledge proof atau ZK-rollup — grep zero-knowledge, zk-rollup, SNARK, dan STARK di seluruh track menghasilkan nol. BCD19 membahas L2 dan blob, tetapi dari sudut ketersediaan data — bukan dari teknologi bukti. Lesson ini mengisi celah itu dari nol, dari sudut pandang analis: apa yang dibuktikan, berapa biayanya, dan apa yang tetap terlihat di rantai.",
      },
      reference: "Batch 1.000 tx: 1.200.000 gas = 1.200 gas/tx = 0,072 dolar; L1: 21.000 gas/tx = 1,26 dolar. Hemat 94,3 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan bukti tanpa membuka data — dan menghitung harganya.",
        "(1) Menjelaskan tiga sifat ZK-proof: completeness, soundness, zero-knowledge;",
        "(2) Membedakan zk-SNARK dan zk-STARK dari empat sisi: ukuran, setup, asumsi, dan ketahanan kuantum;",
        "(3) Menjelaskan alur ZK-rollup: sequencer, prover, verifier, dan data availability;",
        "(4) Menghitung penghematan gas dan biaya per transaksi dari ukuran batch;",
        "(5) Menilai kapan ZK-rollup cocok — dan apa yang tetap terlihat di rantai.",
      ],
      tasks: [],
    },
    {
      id: "tiga-sifat",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga sifat: lengkap, sehat, dan tanpa bocor",
      prose: [
        "Zero-knowledge proof adalah cara membuktikan sebuah pernyataan benar tanpa mengungkapkan mengapa ia benar. Tiga sifatnya. COMPLETENESS (kelengkapan): bila pernyataan benar dan pembukti jujur, verifier selalu menerima. SOUNDNESS (kesehatan): bila pernyataan salah, pembukti yang curang hampir tidak mungkin meyakinkan verifier — peluang lolosnya bisa dibuat lebih kecil dari satu per miliar. ZERO-KNOWLEDGE: verifier tidak belajar apa pun selain bahwa pernyataan itu benar — tidak ada data tambahan yang bocor.",
        "Analogi klasik: gua Ali Baba. Peggy tahu kata sandi pintu rahasia di gua bercabang dua. Victor ingin yakin Peggy tahu — tanpa Peggy membisikkan kata sandinya. Mereka mengulang 20 kali: Victor menunggu di luar, Peggy masuk lewat satu cabang acak, Victor berteriak 'keluar lewat kiri' atau 'kanan'. Bila Peggy tidak tahu kata sandi, ia hanya bisa keluar lewat cabang yang diminta bila ia masuk lewat cabang itu — peluang 50 persen tiap putaran. Setelah 20 putaran, peluang menebak semuanya adalah 1 per 1.048.576 — Victor yakin tanpa pernah mendengar kata sandinya.",
        "Dalam praktik, pernyataan yang dibuktikan bukan kata sandi, melainkan komputasi: 'transaksi-transaksi ini sah menurut aturan rollup dan saldo akhirnya sekian'. Pembukti (prover) menjalankan komputasi dan menghasilkan bukti singkat; verifier memeriksa bukti itu dalam hitungan milidetik. Yang penting bagi analis: bukti itu bisa diverifikasi siapa pun dari data publik — tanpa akses ke data privat yang dibuktikan.",
        "SNARK vs STARK — dua keluarga utama. zk-SNARK klasik: bukti sangat kecil (ratusan byte), verifikasi sangat cepat, tetapi butuh trusted setup — upacara awal yang menghasilkan parameter; bila upacara itu dikompromikan, bukti palsu bisa dibuat. Catatan: 'SNARK = trusted setup' hanya berlaku untuk varian klasiknya — konstruksi SNARK transparan tanpa trusted setup juga ada. zk-STARK: tanpa trusted setup, memakai hash saja (tahan kuantum secara teori), tetapi buktinya lebih besar (puluhan hingga ratusan kilobyte) dan prover-nya lebih berat. Pilihan praktis: SNARK untuk biaya verifikasi termurah di L1, STARK untuk transparansi setup dan skala terbesar.",
      ],
      tasks: [],
      note: {
        title: "Zero-knowledge bukan anonimitas",
        body: "Kesalahan umum: mengira ZK berarti transaksi tidak terlihat. Yang disembunyikan ZK adalah ISI komputasi yang dibuktikan — bukan keberadaan transaksinya. Di ZK-rollup, data transaksi tetap dipublikasikan ke L1 (agar siapa pun bisa merekonstruksi state); yang dikompresi adalah PEMERIKSAANNYA. Privasi penuh butuh desain tambahan (seperti shielded pool) — bukan hadiah otomatis dari huruf ZK.",
      },
      reference: "Tiga sifat: completeness, soundness, zero-knowledge. SNARK klasik: kecil + trusted setup. STARK: tanpa setup + bukti lebih besar.",
    },
    {
      id: "rollup",
      eyebrow: "Langkah 4 · Teori",
      title: "ZK-rollup: sequencer, prover, verifier",
      prose: [
        "Alur ZK-rollup punya empat peran. SEQUENCER menerima transaksi pengguna, mengurutkannya, dan mengeksekusinya di luar rantai — menghasilkan state baru. PROVER mengambil batch transaksi plus state lama dan baru, lalu menghasilkan ZK-proof bahwa transisi itu sah menurut aturan rollup. VERIFIER — smart contract di L1 — memeriksa bukti itu: bila sah, state root baru dicatat di L1. DATA AVAILABILITY: data transaksi batch dipublikasikan (ke L1 sebagai calldata/blob, atau ke komite) agar siapa pun bisa merekonstruksi state dan menarik dananya sendiri.",
        "Keamanan rollup berasal dari L1, bukan dari kepercayaan pada sequencer. Sequencer yang jahat bisa menunda atau mengurutkan transaksi untuk keuntungan sendiri (MEV) — tetapi ia tidak bisa mencuri dana SELAMA implementasinya benar, karena state root baru hanya diterima L1 bila buktinya sah. Jaminan itu bukan jaminan absolut: bug di contract verifier, kunci upgrade yang disalahgunakan, atau escape hatch yang tidak pernah diuji bisa tetap membuat dana hilang. Bila sequencer berhenti total, pengguna masih bisa menarik dana lewat L1 memakai data yang dipublikasikan — inilah yang disebut escape hatch — ASALKAN data availability terjamin dan escape hatch-nya benar-benar ada dan berfungsi. Rollup yang tidak punya escape hatch dan data availability yang terjamin bukan rollup — ia adalah rantai samping dengan nama lain.",
        "Perbandingan dengan optimistic rollup: optimistic mengasumsikan batch sah dan memberi jendela sengketa — umumnya 7 hari pada implementasi besar — untuk membuktikan sebaliknya; ZK membuktikan sah di muka dan final begitu buktinya diverifikasi L1 — biasanya hitungan menit, tergantung kecepatan prover dan antrean batch. Harganya: prover ZK mahal dan kompleks — menghasilkan bukti untuk 1.000 transaksi butuh komputasi berat dan waktu. Trade-off-nya jelas: optimistic murah membuktikan tetapi lambat final; ZK mahal membuktikan tetapi cepat final.",
        "Untuk analis, tiga angka yang dibaca dari sebuah rollup: biaya per transaksi (alokasi gas L1 dibagi ukuran batch — sebelum prover, blob, dan margin), waktu finalitas (menit untuk ZK pada implementasi yang lancar, umumnya 7 hari untuk optimistic), dan data availability (di mana data batch tinggal — L1 atau komite). Ketiganya menentukan apakah rollup itu murah, cepat, dan aman — atau hanya murah di brosur.",
      ],
      tasks: [],
      note: {
        title: "Validium bukan ZK-rollup",
        body: "Validium memakai ZK-proof seperti rollup, tetapi menyimpan data transaksi di luar L1 (komite data availability). Bila komite itu gagal atau berkolusi, pengguna tidak bisa merekonstruksi state — dan escape hatch mati. Validium lebih murah karena tidak membayar data L1, tetapi keamanannya bergantung pada komite. Saat membaca klaim 'ZK-rollup', periksa dulu di mana datanya tinggal.",
      },
      reference: "Alur: sequencer → prover → verifier L1 → data availability. Finalitas ZK menit (tergantung prover); optimistic umumnya 7 hari. Escape hatch = penarikan via L1.",
    },
    {
      id: "lab-zk",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: menghitung penghematan ZK-rollup",
      prose: [
        "Lab ini membangun kalkulator penghematan rollup: dari gas L1 per transaksi, gas batch, jumlah transaksi per batch, harga gas, dan harga ETH — hitung gas per transaksi di rollup, biaya L1 dan L2 per transaksi dalam dolar, dan persen penghematan.",
        "Hitung dulu di kepala. Gas per transaksi di rollup: 1.200.000 gas dibagi 1.000 transaksi sama dengan 1.200 gas. Biaya L1 per transaksi: 21.000 gas dikali 20 gwei sama dengan 420.000 gwei sama dengan 0,00042 ETH; 0,00042 dikali 3.000 sama dengan 1,26 dolar. Biaya L2 per transaksi: 1.200 dikali 20 sama dengan 24.000 gwei sama dengan 0,000024 ETH; 0,000024 dikali 3.000 sama dengan 0,072 dolar. Penghematan: 21.000 dikurangi 1.200 sama dengan 19.800; 19.800 dibagi 21.000 dikali 100 sama dengan 94,3 persen (tepatnya 94,2857 persen, dibulatkan satu desimal).",
        "Tugas lab: tulis fungsi yang menerima gas_l1, gas_batch, jumlah_tx, gwei, dan harga_eth — lalu mencetak empat angka: gas_per_tx, biaya_l1_usd, biaya_l2_usd, hemat_persen. Empat angka ini adalah jawaban atas pertanyaan bursa: berapa yang kami hemat — dan apakah biaya prover (yang tidak dihitung di sini) memakan seluruh penghematan itu?",
        "Setelah lolos, coba eksperimen: kecilkan batch menjadi 100 transaksi dan lihat gas per transaksi menjadi 12.000 — hemat hanya 42,9 persen. Lalu tanyakan: berapa ukuran batch minimum agar penghematan melewati 90 persen? (Jawaban: gas per transaksi harus di bawah 2.100 — batch di atas 571 transaksi.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung gas per transaksi di rollup dari gas batch" },
        { id: "t2", text: "Hitung biaya L1 dan L2 per transaksi dalam dolar" },
        { id: "t3", text: "Hitung persen penghematan" },
      ],
      expected: "gas_per_tx=1200.0\nbiaya_l1_usd=1.26\nbiaya_l2_usd=0.072\nhemat_persen=94.3",
      hints: [
        "Gas per transaksi = gas_batch dibagi jumlah_tx.",
        "Biaya ETH = gas dikali gwei, dibagi 1.000.000.000; dolar = ETH dikali harga ETH. Bulatkan biaya dolar ke 3 desimal agar 0,072 tampil bersih.",
        "Hemat persen = (gas_l1 - gas_per_tx) / gas_l1 x 100, dibulatkan 1 desimal.",
        "0,072 adalah 1.200 x 20 gwei = 0,000024 ETH x 3.000.",
      ],
      code: {
        starter: `# Kalkulator penghematan ZK-rollup (gas, gwei, ETH 3.000 dolar).\ngas_l1 = 21000  # gas per transaksi di L1\ngas_batch = 1200000  # gas satu batch rollup\njumlah_tx = 1000  # transaksi per batch\ngwei = 20\nharga_eth = 3000\n\n# TULIS KODEMU: hitung empat angka penghematan di bawah ini.\n# Cetak, per baris: gas_per_tx, biaya_l1_usd, biaya_l2_usd,\n# hemat_persen.\n\n\nkalkulator_rollup(gas_l1, gas_batch, jumlah_tx, gwei, harga_eth)`,
        lockLines: 5,
        solution: `# Kalkulator penghematan ZK-rollup (gas, gwei, ETH 3.000 dolar).\ngas_l1 = 21000  # gas per transaksi di L1\ngas_batch = 1200000  # gas satu batch rollup\njumlah_tx = 1000  # transaksi per batch\ngwei = 20\nharga_eth = 3000\n\n\ndef kalkulator_rollup(gas_l1, gas_batch, jumlah_tx, gwei, harga_eth):\n    gas_per_tx = gas_batch / jumlah_tx\n    biaya_l1_usd = gas_l1 * gwei / 1_000_000_000 * harga_eth\n    biaya_l2_usd = gas_per_tx * gwei / 1_000_000_000 * harga_eth\n    hemat_persen = round((gas_l1 - gas_per_tx) / gas_l1 * 100, 1)\n    print(f"gas_per_tx={gas_per_tx}")\n    print(f"biaya_l1_usd={biaya_l1_usd}")\n    print(f"biaya_l2_usd={round(biaya_l2_usd, 3)}")\n    print(f"hemat_persen={hemat_persen}")\n\n\nkalkulator_rollup(gas_l1, gas_batch, jumlah_tx, gwei, harga_eth)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "gas_per_tx=1200.0", label: "Gas per tx 1.200", msg: "1.200.000 / 1.000 = 1.200 gas per transaksi — 17,5 kali lebih murah dari L1." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_l1_usd=1.26", label: "Biaya L1 1,26 dolar", msg: "21.000 x 20 gwei = 0,00042 ETH x 3.000 = 1,26 dolar." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_l2_usd=0.072", label: "Biaya L2 0,072 dolar", msg: "1.200 x 20 gwei = 0,000024 ETH x 3.000 = 0,072 dolar." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat_persen=94.3", label: "Hemat 94,3 persen", msg: "(21.000-1.200)/21.000 x 100 = 94,2857 persen, dibulatkan 94,3." },
        ],
      },
      reference: "Gas per tx 1.200; L1 1,26 dolar; L2 0,072 dolar; hemat 94,3 persen.",
    },
    {
      id: "menilai",
      eyebrow: "Langkah 6 · Teori",
      title: "Menilai rollup: tiga angka dan satu pertanyaan",
      prose: [
        "Tiga angka yang menentukan apakah sebuah ZK-rollup layak dipakai. Pertama, biaya per transaksi pada ukuran batch NYATA — bukan batch maksimum di brosur. Batch 100 transaksi hanya hemat 42,9 persen; batch 1.000 hemat 94,3 persen. Rollup sepi yang jarang mencapai batch besar tidak pernah semurah klaimnya. Kedua, waktu finalitas: dari transaksi dikirim sampai state root diterima L1 — menit untuk ZK bila prover dan batch lancar, hari untuk optimistic. Ketiga, biaya prover: menghasilkan bukti tidak gratis — bila biaya prover per batch melebihi penghematan gas, operator menaikkan fee dan penghematan pengguna menguap.",
        "Satu pertanyaan yang menentukan apakah ia rollup sungguhan: di mana data batch tinggal, dan bisakah saya menarik dana bila sequencer mati? Bila jawabannya 'di L1' dan 'ya, lewat escape hatch', ia rollup. Bila jawabannya 'di komite' — ia validium, dengan keamanan berbeda. Bila jawabannya tidak tertulis — ia janji, bukan produk.",
        "Untuk analis, ZK-rollup adalah contoh sempurna mengapa aritmetika mengalahkan narasi. 'Skala 100x' adalah klaim; '1.200 gas per transaksi pada batch 1.000' adalah fakta yang bisa diperiksa dari data L1 — baca gas batch yang sebenarnya dari explorer, bagi dengan jumlah transaksi di batch itu, dan bandingkan dengan klaim situsnya. Bila angkanya tidak cocok, situsnya yang salah.",
      ],
      tasks: [],
      note: {
        title: "Biaya prover: tagihan yang tidak terlihat",
        body: "Menghasilkan ZK-proof untuk 1.000 transaksi butuh server kuat dan waktu — biaya yang ditanggung operator rollup, bukan L1. Operator yang sehat menutup biaya ini dari fee; operator yang tidak sehat mensubsidi dari modal ventura — dan subsidi itu berakhir. Rumus fee yang dibayar pengguna: alokasi gas L1 per transaksi + biaya data blob + biaya prover per batch + margin operator. Angka 0,072 dolar di lab hanya komponen pertama — fee sebenarnya selalu lebih besar. Saat menilai keberlanjutan sebuah rollup, tanyakan: apakah fee pengguna menutup biaya prover? Bila tidak, model bisnisnya adalah bakar uang.",
      },
      reference: "Tiga angka: biaya per tx pada batch nyata, waktu finalitas, biaya prover. Satu pertanyaan: di mana data batch, dan adakah escape hatch?",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: bursa memilih ZK-rollup — dan memeriksa klaimnya",
      prose: [
        "Kembali ke bursa. Setelah menghitung 94,3 persen penghematan pada batch 1.000, timnya memeriksa klaim situs rollup: 'biaya 0,01 dolar per transaksi'. Mereka membaca data L1 langsung: batch rata-rata sebenarnya 420 transaksi, gas batch 1.100.000 — gas per transaksi 2.619, biaya 0,157 dolar. Bukan 0,01 — tetapi masih 8 kali lebih murah dari L1. Mereka tetap pindah, dengan ekspektasi yang benar.",
        "Tiga bulan kemudian volume naik dan batch rata-rata menjadi 950 transaksi — dengan gas batch 1.200.000, biaya turun ke 0,076 dolar. Karena ekspektasi awal jujur (0,157, bukan 0,01), tidak ada yang kecewa dan tidak ada yang menyalahkan teknologi. Sebaliknya, pesaing yang pindah berdasarkan klaim 0,01 dolar justru kembali ke L1 sambil menyebut rollup 'penipuan' — padahal yang menipu adalah ekspektasi mereka sendiri.",
        "Pelajaran umumnya: periksa klaim dari data — gas batch dibagi jumlah transaksi di batch itu — sebelum memutuskan. Teknologi yang sama bisa terlihat menipu atau jujur tergantung apakah kamu membaca brosur atau membaca rantai.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, penghematan dihitung dari batch nyata (420), bukan batch maksimum brosur (1.000+). Kedua, ekspektasi ditulis jujur sebelum pindah. Ketiga, keberhasilan diukur dengan angka yang sama setelah pindah — dan angkanya membaik seiring volume. Itulah cara analis memakai teknologi baru: hitung, periksa, lalu putuskan.",
      },
      reference: "Klaim situs 0,01 dolar; data L1: batch 420 tx, 2.619 gas/tx = 0,157 dolar. Tetap pindah — 8x lebih murah dari L1.",
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
        "Tiga sifat: completeness, soundness, zero-knowledge.",
        "SNARK klasik: bukti kecil + trusted setup. STARK: tanpa setup + bukti lebih besar.",
        "Alur rollup: sequencer → prover → verifier L1 → data availability.",
        "Lab: gas per tx 1.200; L1 1,26 dolar; L2 0,072 dolar; hemat 94,3 persen.",
        "Periksa klaim dari data L1: gas batch dibagi jumlah transaksi di batch itu.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Batch rollup 1.200.000 gas untuk 1.000 transaksi; L1 21.000 gas per transaksi; 20 gwei; ETH 3.000 dolar. Berapa gas per tx, biaya L2, dan hematnya?",
          options: [
            { text: "1.200 gas; 0,072 dolar; hemat 94,3 persen", why: "Tepat: 1.200.000/1.000 = 1.200 gas; 1.200 x 20 gwei = 0,072 dolar; (21.000-1.200)/21.000 = 94,3 persen.", correct: true },
            { text: "1.200 gas; 0,72 dolar; hemat 94,3 persen", why: "Salah: 0,72 dolar adalah 10 kali lipat — 1.200 gas x 20 gwei = 24.000 gwei = 0,000024 ETH x 3.000 = 0,072, bukan 0,72." },
            { text: "12.000 gas; 0,72 dolar; hemat 42,9 persen", why: "Salah: 12.000 gas adalah batch 100 transaksi, bukan 1.000. Bagi dengan jumlah transaksi yang benar." },
            { text: "1.200 gas; 0,072 dolar; hemat 5,7 persen", why: "Salah: 5,7 persen adalah rasio gas rollup terhadap L1 (1.200/21.000) — hematnya adalah 100 dikurangi itu = 94,3 persen." },
          ],
        },
        {
          q: "Apa yang dimaksud sifat zero-knowledge dalam ZK-proof?",
          options: [
            { text: "Verifier tidak belajar apa pun selain bahwa pernyataan itu benar — tidak ada data tambahan yang bocor", why: "Tepat: itulah definisi zero-knowledge — keyakinan tanpa kebocoran.", correct: true },
            { text: "Transaksi menjadi tidak terlihat di rantai", why: "Salah: ZK menyembunyikan isi komputasi yang dibuktikan, bukan keberadaan transaksi — data batch rollup tetap dipublikasikan." },
            { text: "Pembukti tidak tahu apa yang dibuktikannya", why: "Salah: pembukti tahu persis — ia yang menjalankan komputasi dan menghasilkan bukti." },
            { text: "Bukti tidak bisa diverifikasi siapa pun", why: "Salah: terbalik — bukti ZK bisa diverifikasi siapa pun dari data publik, itulah gunanya." },
          ],
        },
        {
          q: "Apa perbedaan utama zk-SNARK dan zk-STARK?",
          options: [
            { text: "SNARK untuk rantai publik, STARK untuk permissioned", why: "Salah: keduanya dipakai di rantai publik — bedanya ada di ukuran bukti, setup, dan asumsi." },
            { text: "SNARK klasik: bukti kecil, verifikasi cepat, butuh trusted setup. STARK: tanpa trusted setup, bukti lebih besar, tahan kuantum secara teori", why: "Tepat: trade-off inti antara biaya verifikasi dan transparansi setup. Catatan: ada SNARK transparan tanpa trusted setup — klaim ini berlaku untuk SNARK klasik.", correct: true },
            { text: "SNARK lebih aman karena buktinya lebih besar", why: "Salah: terbalik — bukti SNARK lebih KECIL. Keamanan tidak diukur dari ukuran bukti." },
            { text: "STARK tidak butuh prover — buktinya muncul sendiri", why: "Salah: STARK justru prover-nya lebih berat. Tidak ada bukti tanpa prover." },
          ],
        },
        {
          q: "Mengapa sequencer ZK-rollup yang jahat tidak bisa mencuri dana pengguna?",
          options: [
            { text: "Karena sequencer tidak memegang kunci pengguna", why: "Sebagian benar tetapi bukan mekanisme keamanannya: sequencer memang tidak memegang kunci, tetapi jaminan utamanya adalah verifikasi bukti di L1." },
            { text: "Karena state root baru hanya diterima L1 bila ZK-proof-nya sah — sequencer tidak bisa memalsukan transisi state", why: "Tepat: keamanan berasal dari verifikasi L1, bukan dari kepercayaan pada sequencer — dengan catatan implementasi verifier dan escape hatch-nya benar; bug contract atau kunci upgrade tetap bisa meruntuhkan jaminan ini.", correct: true },
            { text: "Karena sequencer dipilih oleh bank sentral", why: "Salah: sequencer dipilih operator rollup, bukan bank sentral — dan tidak ada otoritas yang menjamin kejujurannya." },
            { text: "Karena semua transaksi di rollup bersifat anonim", why: "Salah: transaksi rollup tidak otomatis anonim — dan anonimitas bukan yang mencegah pencurian." },
          ],
        },
        {
          q: "Situs rollup mengklaim 0,01 dolar per transaksi. Data L1 menunjukkan batch rata-rata 420 transaksi dengan gas batch 1.100.000. Apa vonis yang benar?",
          options: [
            { text: "Percaya situs — 0,01 dolar adalah biaya di batch maksimum", why: "Salah: biaya harus dihitung dari batch NYATA (420), bukan maksimum brosur." },
            { text: "Hitung sendiri: 1.100.000/420 = 2.619 gas = 0,157 dolar — klaim salah, tetapi rollup tetap 8x lebih murah dari L1", why: "Tepat: periksa klaim dari data; klaim yang salah tidak berarti teknologi yang buruk.", correct: true },
            { text: "Tolak rollup — klaim yang salah berarti teknologi menipu", why: "Salah: membedakan klaim pemasaran dan teknologi — 0,157 dolar tetap jauh lebih murah dari 1,26 dolar L1." },
            { text: "Abaikan data L1 — gas batch tidak menentukan biaya pengguna", why: "Salah: gas batch dibagi jumlah transaksi adalah ALOKASI gas L1 per transaksi — ilustrasi biaya on-chain, bukan fee sebenarnya yang dibayar pengguna (fee juga menutup biaya prover, data blob, dan margin operator). Tetapi sebagai pembanding klaim situs, alokasi inilah data yang paling menentukan." },
          ],
        },
      ],
    },
  ],
};
