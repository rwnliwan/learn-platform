import type { V2Lesson } from "../lib/types";

export const bcd33: V2Lesson = {
  slug: "bcd33-fabric-corda",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD33 — Blockchain Permissioned: Hyperledger Fabric dan R3 Corda",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lima bank, satu ledger — tetapi tidak semua boleh melihat semuanya",
      prose: [
        "Lima bank membentuk konsorsium pembiayaan perdagangan. Mereka butuh satu catatan bersama yang tidak bisa diubah diam-diam — tetapi Bank A tidak boleh melihat harga yang Bank B tawarkan ke nasabah yang sama. Rantai publik seperti Ethereum memberi mereka yang pertama (tidak bisa diubah) dan merusak yang kedua (semua orang melihat semuanya).",
        "Jawabannya adalah blockchain permissioned: jaringan tertutup di mana peserta dikenal, data dibagi seperlunya, dan konsensus tidak butuh mining. Hyperledger Fabric memakai channel dan endorsement policy; R3 Corda memakai model UTXO dengan notaris dan transaksi yang hanya terlihat oleh pihak yang terlibat. Keduanya menyelesaikan masalah yang sama dengan arsitektur yang berbeda — dan memilih yang salah berarti membangun ulang.",
        "Lesson ini mengajarkan dua platform permissioned utama: Fabric dan Corda — arsitektur, model data, konsensus, dan kapan memakai yang mana. Setelah lesson ini kamu bisa: (1) menjelaskan perbedaan permissioned dan permissionless; (2) membaca arsitektur Fabric — channel, peer, orderer, chaincode, endorsement policy; (3) membaca arsitektur Corda — state, contract, flow, notaris; (4) menghitung kombinasi endorsement yang sah dari sebuah policy; (5) memutuskan Fabric vs Corda vs rantai publik dari kebutuhan privasi dan tata kelola.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "Tidak ada lesson BCD yang membahas blockchain permissioned — grep Fabric, Corda, dan Hyperledger di seluruh track menghasilkan nol. BCD1 membahas struktur rantai publik dan BCD25 membahas regulasi, tetapi arsitektur permissioned sebagai teknologi belum pernah diajarkan. Lesson ini mengisi celah itu dari nol.",
      },
      reference: "Fabric: channel + endorsement policy. Corda: UTXO + notaris, transaksi hanya terlihat pihak terlibat.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca arsitektur permissioned dan menghitung jaminan yang diberikannya.",
        "(1) Membedakan permissioned dan permissionless dari empat sisi: peserta, visibilitas, konsensus, tata kelola;",
        "(2) Menjelaskan alur transaksi Fabric: proposal, endorsement, ordering, validasi, commit;",
        "(3) Menjelaskan model Corda: state, contract, flow, dan peran notaris;",
        "(4) Menghitung kombinasi endorsement yang sah dari policy dan dari kondisi satu org down;",
        "(5) Memilih Fabric, Corda, atau rantai publik dari kebutuhan nyata.",
      ],
      tasks: [],
    },
    {
      id: "permissioned",
      eyebrow: "Langkah 3 · Teori",
      title: "Permissioned vs permissionless: empat perbedaan yang menentukan",
      prose: [
        "Pertama, peserta. Rantai permissionless terbuka: siapa pun bisa menjalankan node dan mengirim transaksi dengan alamat anonim. Rantai permissioned tertutup: peserta dikenal lewat sertifikat identitas (PKI) — bank, regulator, pemasok — dan bergabung lewat undangan serta persetujuan konsorsium. Anonimitas diganti akuntabilitas: bila sebuah transaksi bermasalah, ada nama di balik sertifikatnya.",
        "Kedua, visibilitas. Di rantai publik, semua data terlihat semua orang — transparansi total. Di permissioned, visibilitas adalah keputusan desain: Fabric membatasi lewat channel (hanya anggota channel melihat ledger channel itu) dan private data collection (bahkan di dalam channel, sebagian data hanya untuk sebagian anggota); Corda lebih ketat lagi — transaksi hanya disimpan oleh pihak yang terlibat plus notaris, tidak ada ledger global sama sekali.",
        "Ketiga, konsensus. Tanpa peserta anonim, tidak ada serangan Sybil yang harus dilawan dengan proof-of-work — konsensus bisa memakai crash fault tolerance atau Byzantine fault tolerance klasik (Raft, PBFT) yang final dalam hitungan detik dan hemat energi. Keempat, tata kelola. Perubahan aturan di rantai publik butuh fork dan konsensus komunitas yang lambat; di permissioned, konsorsium menulis peraturannya dalam perjanjian dan mengubahnya lewat voting anggota.",
        "Harga yang dibayar: kepercayaan tidak lagi tanpa pihak ketiga — ia dipindah ke konsorsium dan operatornya. Permissioned bukan 'blockchain yang lebih lemah'; ia adalah alat untuk masalah yang berbeda — ketika peserta saling kenal, privasi adalah syarat, dan regulator harus bisa diaudit. Memakai rantai publik untuk lima bank yang merahasiakan harga adalah kesalahan kategori, bukan kesalahan parameter.",
      ],
      tasks: [],
      note: {
        title: "Bukan database bersama biasa",
        body: "Pertanyaan yang adil: kenapa tidak memakai satu database bersama saja? Jawabannya: database bersama punya satu pemilik yang bisa mengubah isinya — dan kelima bank tidak saling percaya sejauh itu. Blockchain permissioned memberi tiap anggota salinan ledger yang sama, dengan aturan perubahan yang disepakati dan jejak audit yang tidak bisa dihapus satu pihak. Ia adalah database bersama TANPA pemilik tunggal.",
      },
      reference: "Empat beda: peserta dikenal, visibilitas seperlunya, konsensus BFT/Raft, tata kelola konsorsium.",
    },
    {
      id: "fabric",
      eyebrow: "Langkah 4 · Teori",
      title: "Hyperledger Fabric: channel, chaincode, endorsement policy",
      prose: [
        "Fabric memisahkan tiga peran yang di rantai publik tercampur. Peer menyimpan ledger dan menjalankan chaincode (smart contract Fabric). Orderer mengurutkan transaksi ke dalam blok — ia tidak memeriksa isi bisnis, hanya urutan. Certificate Authority menerbitkan identitas. Pemisahan ini memungkinkan Fabric memproses transaksi secara paralel di channel yang berbeda.",
        "Alur satu transaksi punya empat langkah. Pertama, klien mengirim proposal ke peer endorser yang ditentukan endorsement policy. Kedua, peer mengeksekusi chaincode dan mengembalikan hasil plus tanda tangan — belum commit, baru simulasi. Ketiga, klien mengirim transaksi yang sudah di-endorse ke orderer, yang mengurutkannya ke dalam blok. Keempat, semua peer memvalidasi: apakah endorsement memenuhi policy, apakah tidak ada konflik baca-tulis — lalu commit ke ledger. Langkah keempat inilah yang membuat 'sudah di-endorse' belum berarti 'sudah tercatat'.",
        "Endorsement policy adalah jantung tata kelolanya: aturan seperti '3 dari 5 org' atau 'Bank A DAN (Bank B ATAU Bank C)'. Policy ditulis saat chaincode di-deploy dan bisa diubah. Channel adalah unit privasi: tiap channel punya ledger sendiri; dua bank bisa bertransaksi di channel yang tidak dilihat tiga bank lainnya. Private data collection melangkah lebih jauh: hash data masuk ledger, data aslinya hanya dibagikan peer-to-peer ke anggota yang berhak.",
        "Contoh hitungan yang dipakai lab: konsorsium 5 bank dengan policy '3 dari 5'. Kombinasi endorsement yang sah: pilih 3 dari 5 (10 cara), pilih 4 dari 5 (5 cara), pilih 5 dari 5 (1 cara) — total 16 kombinasi. Bila satu bank down, yang tersisa 4 bank: pilih 3 dari 4 (4 cara) dan 4 dari 4 (1 cara) — total 5 kombinasi. Sistem tetap jalan dengan 1 bank down, tetapi marginnya menipis dari 16 menjadi 5 — angka yang harus diketahui SEBELUM insiden, bukan saat insiden.",
      ],
      tasks: [],
      note: {
        title: "Endorsement bukan voting",
        body: "Endorsement sering disalahpahami sebagai voting 'setuju atau tidak'. Yang sebenarnya terjadi: peer endorser mengeksekusi chaincode dan menandatangani HASIL eksekusinya — 'bila transaksi ini dijalankan, hasilnya X'. Peer tidak menilai apakah transaksi itu bagus; ia mensertifikasi hasilnya deterministik. Policy '3 dari 5' berarti tiga eksekusi independen sepakat tentang hasilnya.",
      },
      reference: "Alur Fabric: proposal → endorsement → ordering → validasi + commit. Policy 3 dari 5 = 16 kombinasi sah; 1 org down = 5.",
    },
    {
      id: "corda",
      eyebrow: "Langkah 5 · Teori",
      title: "R3 Corda: tidak ada ledger global — dan itu disengaja",
      prose: [
        "Corda membalik asumsi Fabric: tidak ada ledger global, tidak ada blok yang dibagikan ke semua node. Tiap transaksi hanya disimpan oleh pihak yang terlibat — plus notaris yang mencatat bahwa output-nya belum dipakai. Model datanya adalah UTXO seperti Bitcoin: state adalah fakta (misalnya 'Bank A berutang 10 juta ke Bank B') yang dikonsumsi oleh transaksi dan diganti state baru. Contract adalah kode yang memvalidasi transisi state: 'transaksi ini sah hanya bila jumlahnya cocok dan kedua pihak menandatangani'.",
        "Flow adalah koreografi antar pihak: node A mengusulkan transaksi, node B memeriksa dan menandatangani, lalu keduanya mencatat hasilnya. Notaris adalah satu-satunya pihak ketiga: ia menandatangani bahwa input state belum pernah dipakai sebelumnya — mencegah double-spend tanpa melihat isi transaksi (notaris hanya melihat hash). Karena tidak ada yang melihat transaksi orang lain, privasi adalah sifat bawaan arsitektur, bukan fitur tambahan.",
        "Perbandingan yang jujur. Fabric cocok bila konsorsium butuh ledger bersama yang bisa diaudit banyak pihak — misalnya pelacakan rantai pasok dengan puluhan peserta yang perlu melihat status yang sama. Corda cocok bila transaksi bersifat bilateral dan rahasia — misalnya perjanjian antar dua bank yang tidak boleh diketahui bank ketiga. Fabric berpikir 'ledger bersama dengan privasi seperlunya'; Corda berpikir 'tidak ada ledger bersama, hanya fakta antar pihak'.",
        "Untuk analis data, implikasinya besar: di Fabric kamu bisa mengaudit satu ledger channel; di Corda tidak ada satu tempat untuk mengaudit — audit berarti mengumpulkan jejak dari tiap node yang terlibat plus notaris. Pilihan platform menentukan BENTUK data yang tersedia untuk analisis — keputusan arsitektur adalah keputusan analitik.",
      ],
      tasks: [],
      note: {
        title: "Notaris bukan bank sentral",
        body: "Notaris Corda sering disalahartikan sebagai otoritas pusat yang mengendalikan jaringan. Yang sebenarnya: notaris hanya menjawab satu pertanyaan ya/tidak — 'apakah state ini sudah dipakai?' — dan ia tidak melihat isi transaksi, tidak menyetujui bisnisnya, dan bisa diganti oleh notaris lain. Ia adalah penjaga keunikan, bukan penjaga kebenaran.",
      },
      reference: "Corda: state UTXO + contract + flow + notaris (cek double-spend dari hash). Tanpa ledger global.",
    },
    {
      id: "lab-endorsement",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: menghitung kombinasi endorsement yang sah",
      prose: [
        "Lab ini menghitung ketahanan sebuah endorsement policy: dari 5 organisasi dengan policy '3 dari 5', berapa kombinasi endorsement yang sah — dan berapa yang tersisa bila satu organisasi down.",
        "Hitung dulu di kepala. Kombinasi memilih 3 dari 5: 5 faktorial dibagi (3 faktorial dikali 2 faktorial) sama dengan 10. Memilih 4 dari 5 sama dengan 5. Memilih 5 dari 5 sama dengan 1. Total kombinasi sah: 10 ditambah 5 ditambah 1 sama dengan 16. Bila satu organisasi down, tersisa 4 organisasi: memilih 3 dari 4 sama dengan 4, memilih 4 dari 4 sama dengan 1 — total 5 kombinasi. Penurunan ketahanan: dari 16 menjadi 5, atau 68,75 persen kombinasi hilang — tetapi sistem tetap jalan karena 5 masih lebih besar dari nol.",
        "Tugas lab: tulis fungsi yang menerima jumlah organisasi dan ambang minimum — lalu mencetak empat angka: kombinasi_3, kombinasi_4, kombinasi_5, total_sah, plus total_sah_down untuk satu organisasi down. Lima angka ini adalah jawaban atas pertanyaan konsorsium: seberapa rapuh policy kita saat satu anggota tumbang?",
        "Setelah lolos, coba eksperimen: ubah policy menjadi '4 dari 5' dan lihat total sah menjadi 6, dan dengan satu org down menjadi 1 — satu-satunya kombinasi yang tersisa adalah keempatnya bersama. Lalu tanyakan: policy mana yang kamu pilih untuk konsorsium yang anggotanya sering maintenance?",
      ],
      tasks: [
        { id: "t1", text: "Hitung kombinasi memilih 3, 4, dan 5 dari 5 organisasi" },
        { id: "t2", text: "Hitung total kombinasi endorsement yang sah" },
        { id: "t3", text: "Hitung total kombinasi sah bila satu organisasi down" },
      ],
      expected: "kombinasi_3=10\nkombinasi_4=5\nkombinasi_5=1\ntotal_sah=16\ntotal_sah_down=5",
      hints: [
        "Kombinasi C(n,k) = n! / (k! x (n-k)!). Python punya math.comb.",
        "Total sah = C(5,3) + C(5,4) + C(5,5).",
        "Satu org down berarti n menjadi 4, ambang tetap 3: C(4,3) + C(4,4).",
      ],
      code: {
        starter: `# Endorsement policy: 5 organisasi, ambang minimum 3 dari 5.\nimport math\n\nn_org = 5\nambang = 3\n\n# TULIS KODEMU: hitung kombinasi endorsement yang sah.\n# Cetak, per baris: kombinasi_3, kombinasi_4, kombinasi_5,\n# total_sah, total_sah_down (satu organisasi down).\n\n\nkebijakan_endorsement(n_org, ambang)`,
        lockLines: 4,
        solution: `# Endorsement policy: 5 organisasi, ambang minimum 3 dari 5.\nimport math\n\nn_org = 5\nambang = 3\n\n\ndef kebijakan_endorsement(n_org, ambang):\n    kombinasi_3 = math.comb(n_org, 3)\n    kombinasi_4 = math.comb(n_org, 4)\n    kombinasi_5 = math.comb(n_org, 5)\n    total_sah = kombinasi_3 + kombinasi_4 + kombinasi_5\n    total_sah_down = math.comb(n_org - 1, 3) + math.comb(n_org - 1, 4)\n    print(f"kombinasi_3={kombinasi_3}")\n    print(f"kombinasi_4={kombinasi_4}")\n    print(f"kombinasi_5={kombinasi_5}")\n    print(f"total_sah={total_sah}")\n    print(f"total_sah_down={total_sah_down}")\n\n\nkebijakan_endorsement(n_org, ambang)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "kombinasi_3=10", label: "C(5,3) = 10", msg: "5! / (3! x 2!) = 10 cara memilih 3 endorser dari 5." },
          { kind: "stdout_matches", task: "t1", pattern: "kombinasi_4=5", label: "C(5,4) = 5", msg: "Memilih 4 dari 5 sama dengan memilih 1 yang tidak ikut: 5 cara." },
          { kind: "stdout_matches", task: "t1", pattern: "kombinasi_5=1", label: "C(5,5) = 1", msg: "Kelima organisasi bersama: hanya 1 cara." },
          { kind: "stdout_matches", task: "t2", pattern: "total_sah=16", label: "Total sah 16", msg: "10 + 5 + 1 = 16 kombinasi endorsement memenuhi policy 3 dari 5." },
          { kind: "stdout_matches", task: "t3", pattern: "total_sah_down=5", label: "Satu org down: 5", msg: "C(4,3) + C(4,4) = 4 + 1 = 5. Sistem tetap jalan, margin menipis." },
        ],
      },
      reference: "C(5,3)=10, C(5,4)=5, C(5,5)=1, total 16; satu org down: 5.",
    },
    {
      id: "memilih",
      eyebrow: "Langkah 7 · Teori",
      title: "Memilih: Fabric, Corda, atau rantai publik?",
      prose: [
        "Keputusan memakai tiga pertanyaan. Pertama, apakah peserta saling kenal dan bisa diidentifikasi? Bila ya, permissioned terbuka; bila tidak, rantai publik. Kedua, apakah ada data yang tidak boleh dilihat semua peserta? Bila ya, Fabric dengan channel atau Corda dengan model tanpa ledger global; bila semua data boleh publik, rantai publik lebih sederhana. Ketiga, apakah regulator atau auditor butuh satu tempat memeriksa? Bila ya, Fabric (ledger channel) lebih mudah diaudit daripada Corda (jejak tersebar).",
        "Dua jebakan yang sering terjadi. Jebakan pertama: memilih permissioned karena 'lebih aman' — padahal keamanannya berbeda jenis, bukan lebih tinggi. Rantai publik aman karena ribuan node anonim; permissioned aman karena peserta dikenal dan terikat perjanjian. Bila satu anggota konsorsium jahat dan menguasai cukup endorsement, tidak ada mining yang melindungimu. Jebakan kedua: membangun di Fabric lalu kecewa karena 'tidak terdesentralisasi' — desentralisasi permissioned adalah desentralisasi antar organisasi yang dikenal, bukan tanpa kepercayaan.",
        "Untuk analis, satu nasihat praktis: sebelum menulis satu baris analisis, tanyakan dulu DI MANA datanya tinggal. Di rantai publik, datanya di explorer. Di Fabric, datanya di ledger channel — minta akses channel yang relevan. Di Corda, datanya tersebar di node pihak terlibat — audit berarti mengumpulkan dari tiap node. Arsitektur menentukan akses data; akses data menentukan apa yang bisa kamu buktikan.",
      ],
      tasks: [],
      note: {
        title: "Hybrid itu nyata",
        body: "Banyak konsorsium memakai keduanya: Fabric atau Corda untuk transaksi privat antar anggota, plus jangkar hash berkala ke rantai publik sebagai bukti eksternal yang tidak bisa diubah konsorsium sendiri. Pola ini disebut anchoring — privasi di dalam, akuntabilitas ke luar. Bila ditanya 'apakah konsorsium bisa mengubah sejarahnya diam-diam', jawaban anchoring adalah hash publik yang tidak cocok lagi.",
      },
      reference: "Tiga pertanyaan: peserta dikenal? ada data rahasia? auditor butuh satu tempat? Jawabannya memilih platform.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: konsorsium lima bank memilih Fabric",
      prose: [
        "Kembali ke lima bank. Mereka menilai tiga opsi. Rantai publik gugur di pertanyaan kedua: harga antar bank tidak boleh terlihat semua peserta. Corda menarik untuk transaksi bilateral, tetapi auditor konsorsium butuh satu tempat memeriksa seluruh pembiayaan — dan di Corda jejaknya tersebar. Fabric terpilih: satu channel per koridor perdagangan, private data collection untuk harga, endorsement policy 3 dari 5.",
        "Enam bulan kemudian, satu bank maintenance selama akhir pekan. Transaksi tetap jalan: 5 kombinasi endorsement tersisa dari 16 — cukup untuk operasional normal, dan tim tahu persis marginnya karena sudah dihitung di awal. Audit kuartal pertama selesai dalam dua hari, bukan dua minggu: auditor diberi akses baca ke channel, bukan tumpukan PDF dari lima bank.",
        "Yang membuat keputusan ini bertahan: ia dibuat dari kebutuhan (privasi harga + audit satu tempat), bukan dari merek. Bila kebutuhan berubah — misalnya regulator meminta bukti publik yang tidak bisa diubah konsorsium — jawabannya bukan mengganti platform, melainkan menambah anchoring hash ke rantai publik. Arsitektur yang baik adalah yang bisa ditambah, bukan yang harus diganti.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat mini-case ini berakhir baik. Pertama, pertanyaan privasi diajukan sebelum memilih teknologi. Kedua, ketahanan policy dihitung (16 menjadi 5) sebelum insiden pertama. Ketiga, kebutuhan audit dipenuhi oleh arsitektur — bukan oleh laporan manual sesudahnya. Urutan ini — kebutuhan, hitungan, arsitektur — berlaku untuk setiap pilihan platform.",
      },
      reference: "Fabric terpilih: channel per koridor + private data untuk harga + policy 3 dari 5. Maintenance 1 bank: 5 kombinasi tersisa.",
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
        "Permissioned: peserta dikenal, visibilitas seperlunya, konsensus BFT/Raft, tata kelola konsorsium.",
        "Fabric: proposal → endorsement → ordering → validasi + commit; policy 3 dari 5 = 16 kombinasi.",
        "Corda: state UTXO + contract + flow + notaris; tanpa ledger global.",
        "Lab: C(5,3)=10, C(5,4)=5, C(5,5)=1, total 16; satu org down = 5.",
        "Pilih dari kebutuhan: peserta dikenal? data rahasia? auditor butuh satu tempat?",
      ],
      next: { label: "BCD34 — CBDC: Uang Bank Sentral di Rel Digital", href: "/v2/learn/bcd34-cbdc" },
      quiz: [
        {
          q: "Policy endorsement '3 dari 5' pada 5 organisasi. Berapa total kombinasi endorsement yang sah, dan berapa bila satu org down?",
          options: [
            { text: "16 kombinasi; 5 bila satu org down", why: "Tepat: C(5,3)+C(5,4)+C(5,5) = 10+5+1 = 16; dengan 4 org tersisa C(4,3)+C(4,4) = 4+1 = 5.", correct: true },
            { text: "10 kombinasi; 4 bila satu org down", why: "Salah: 10 hanya C(5,3). Kombinasi 4 dan 5 org juga sah — policy itu minimum, bukan tepat 3." },
            { text: "32 kombinasi; 16 bila satu org down", why: "Salah: 32 adalah semua subset dari 5 org, termasuk subset di bawah ambang (0, 1, 2 org) yang tidak sah." },
            { text: "5 kombinasi; 0 bila satu org down — sistem berhenti", why: "Salah: 5 adalah C(5,4) saja, dan sistem tetap jalan dengan 4 org karena ambang 3 masih terpenuhi." },
          ],
        },
        {
          q: "Apa perbedaan paling mendasar antara Fabric dan Corda soal di mana data disimpan?",
          options: [
            { text: "Fabric memakai database SQL, Corda memakai NoSQL", why: "Salah: keduanya menyimpan state di database lokal node; perbedaannya adalah SIAPA yang menyimpan salinan transaksi." },
            { text: "Fabric punya ledger per channel yang dibagikan anggotanya; Corda tidak punya ledger global — transaksi hanya disimpan pihak terlibat + notaris", why: "Tepat: inilah perbedaan arsitektur yang menentukan privasi dan cara audit.", correct: true },
            { text: "Fabric menyimpan semua data on-chain, Corda menyimpan semuanya off-chain", why: "Salah: Corda tetap menyimpan state dan transaksi di node — hanya saja tidak dibagikan ke semua node." },
            { text: "Tidak ada perbedaan — keduanya ledger global", why: "Salah: justru ketiadaan ledger global adalah ciri pembeda Corda." },
          ],
        },
        {
          q: "Dalam alur Fabric, kapan transaksi dianggap tercatat di ledger?",
          options: [
            { text: "Saat peer endorser menandatangani hasil eksekusi", why: "Salah: endorsement adalah simulasi yang ditandatangani — belum commit." },
            { text: "Saat orderer memasukkan transaksi ke blok", why: "Salah: ordering hanya mengurutkan. Validasi dan commit terjadi sesudahnya di tiap peer." },
            { text: "Setelah semua peer memvalidasi endorsement dan konflik baca-tulis, lalu commit", why: "Tepat: langkah validasi + commit adalah yang membuat transaksi resmi tercatat.", correct: true },
            { text: "Saat klien mengirim proposal pertama", why: "Salah: proposal baru langkah pertama — belum ada eksekusi, endorsement, atau ordering." },
          ],
        },
        {
          q: "Apa peran notaris di Corda?",
          options: [
            { text: "Menyetujui isi bisnis tiap transaksi", why: "Salah: notaris tidak melihat isi transaksi — hanya hash-nya." },
            { text: "Menandatangani bahwa input state belum pernah dipakai — mencegah double-spend — tanpa melihat isi transaksi", why: "Tepat: notaris adalah penjaga keunikan, bukan penjaga kebenaran bisnis.", correct: true },
            { text: "Menyimpan salinan seluruh ledger untuk auditor", why: "Salah: tidak ada ledger global di Corda; notaris hanya mencatat state yang sudah dipakai." },
            { text: "Menentukan harga transaksi antar bank", why: "Salah: harga adalah isi bisnis yang disepakati pihak terlibat, bukan oleh notaris." },
          ],
        },
        {
          q: "Konsorsium butuh ledger bersama yang bisa diaudit satu tempat, dengan harga yang dirahasiakan antar anggota. Pilihan yang paling tepat?",
          options: [
            { text: "Rantai publik — transparansi total memudahkan audit", why: "Salah: transparansi total justru membocorkan harga ke semua peserta — melanggar syarat privasi." },
            { text: "Corda — tanpa ledger global", why: "Salah: Corda unggul untuk bilateral rahasia, tetapi audit satu tempat lebih sulit karena jejak tersebar." },
            { text: "Fabric — channel untuk ledger bersama + private data collection untuk harga", why: "Tepat: channel memberi auditor satu tempat memeriksa; private data menyembunyikan harga dari anggota channel lain.", correct: true },
            { text: "Satu database bersama dengan satu pemilik", why: "Salah: satu pemilik bisa mengubah isinya — kelima bank tidak saling percaya sejauh itu." },
          ],
        },
      ],
    },
  ],
};
