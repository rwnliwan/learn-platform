import type { V2Lesson } from "../lib/types";

export const fr12: V2Lesson = {
  slug: "fr12-graph-analytics",
  track: "Fraud & AML Analytics",
  module: "Teknik Lanjutan",
  title: "FR12 — Graph Analytics",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jaringan yang tak terlihat di tabel",
      prose: [
        "PPATK menelusuri aliran Rp4,2 miliar. Di tabel transaksi, yang terlihat: 200 rekening, masing-masing bertransaksi \"normal\". Tidak ada satu pun yang melewati ambang. Kasus buntu — sampai seorang analis memvisualisasikannya sebagai graf: 200 rekening itu membentuk 3 komponen raksasa yang terhubung, dengan pola aliran berlapis yang jelas. \"Normal\" satu per satu, jelas-jelas terkoordinasi bersama-sama.",
        "Kasus pinjol \"pabrik pengajuan\": 2.300 pengajuan KTA dalam 30 hari. Skor kredit masing-masing lolos. Tapi graf device sharing menunjukkan: 2.300 pengajuan itu berasal dari 41 device. Rata-rata 56 pengajuan per HP — \"satu HP, 56 orang berbeda mengajukan pinjaman\". Eksposur Rp5,75 miliar, turun 94% dalam 2 minggu setelah device graph dipasang sebagai filter.",
        "Fraud modern jarang solo — ia berjejaring. Dan jejaring tidak terlihat di tabel baris-per-baris. Ia terlihat di graf.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model tabular kami sudah cukup — graph itu overkill akademis.\" 45% kasus fraud terorganisir melibatkan ring kecil 2–5 orang yang tiap anggotanya 'normal' di tabel. Tanpa graph, kamu buta terhadap separuh serangan terorganisir. Graph bukan kemewahan — ia lensa yang berbeda.",
      },
      reference: "Fraud terorganisir = jejaring. Jejaring tak terlihat di tabel — terlihat di graf.",
    },
    {
      id: "konstruksi",
      eyebrow: "Langkah 2 · Membangun graf",
      title: "Node, edge, dan apa yang dihubungkan",
      prose: [
        "Graf fraud: node = rekening / device / IP / merchant / nomor HP; edge = transfer, login bersama, device yang sama, IP yang sama. Jenis graf: device-sharing (siapa pakai device apa — untuk \"pabrik pengajuan\"), transaction network (siapa transfer ke siapa — untuk layering/money mule), bipartite (akun ↔ merchant — untuk merchant fiktif).",
        "Pilihan edge = pilihan lensa. Device-sharing menangkap \"banyak akun, satu device\" (mule herding, fake account). Transaction network menangkap \"uang berputar\" (layering). Keduanya dibutuhkan karena menyerang lapisan yang berbeda dari operasi penipu.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `dev_users`: mapping device → set user" },
        { id: "t2", text: "Temukan 5 device dengan aplikasi terbanyak, cetak" },
      ],
      expected: "5 device devF0-devF4, masing-masing 10 aplikasi — pabrik pengajuan",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu device dipakai 2 orang (suami-istri pinjam HP) = wajar. Satu device dipakai 56 \"orang\" mengajukan pinjaman = pabrik. Ambang device-sharing harus kalibrasi terhadap perilaku wajar (keluarga, warnet, konter HP) — bukan angka asal.",
      },
      hints: [
        "dev_users = defaultdict(set); loop apps: dev_users[d].add(u).",
        "sorted(dev_users.items(), key=lambda x: -len(x[1]))[:5].",
        "print(f'  {d}: {len(us)} aplikasi').",
      ],
      code: {
        starter: `# Device-sharing graph: 'pabrik pengajuan' = banyak aplikasi, sedikit device.\nimport random\nfrom collections import defaultdict\nrandom.seed(41)\napps = []\nfor i in range(250):\n    apps.append((f"user{i}", f"dev{i}", False))\nfor d in range(5):\n    for k in range(10):\n        apps.append((f"fraud{d}_{k}", f"devF{d}", True))\nrandom.shuffle(apps)\n\n# TULIS KODEMU\ndev_users = defaultdict(set)\n\nprint("5 device dengan aplikasi terbanyak:")\nfor d, us in sorted(dev_users.items(), key=lambda x: -len(x[1]))[:5]:\n    print(f"  {d}: {len(us)} aplikasi")`,
        lockLines: 9,
        solution: `# Device-sharing graph: 'pabrik pengajuan' = banyak aplikasi, sedikit device.\nimport random\nfrom collections import defaultdict\nrandom.seed(41)\napps = []\nfor i in range(250):\n    apps.append((f"user{i}", f"dev{i}", False))\nfor d in range(5):\n    for k in range(10):\n        apps.append((f"fraud{d}_{k}", f"devF{d}", True))\nrandom.shuffle(apps)\n\n# TULIS KODEMU\ndev_users = defaultdict(set)\nfor u, d, y in apps:\n    dev_users[d].add(u)\n\nprint("5 device dengan aplikasi terbanyak:")\nfor d, us in sorted(dev_users.items(), key=lambda x: -len(x[1]))[:5]:\n    print(f"  {d}: {len(us)} aplikasi")`,
        checks: [
          { kind: "defined", task: "t1", name: "dev_users", label: "`dev_users` terdefinisi", msg: "Bangun defaultdict(set) device → user." },
          { kind: "stdout_matches", task: "t2", pattern: "devF3: 10 aplikasi", label: "Device fraud terdeteksi", msg: "Device devF* masing-masing dipakai 10 aplikasi — pola pabrik." },
          { kind: "stdout_matches", task: "t2", pattern: "10 aplikasi", label: "Output memuat '10 aplikasi'", msg: "Cetak jumlah aplikasi per device." },
        ],
      },
      reference: "Pilihan edge = pilihan lensa. Device-sharing untuk 'banyak akun satu device'; transaction network untuk 'uang berputar'.",
    },
    {
      id: "pola",
      eyebrow: "Langkah 3 · Pola ring",
      title: "Mendeteksi komunitas terkoordinasi",
      prose: [
        "Tiga pola klasik. Satu: star/burst — satu node pusat terhubung ke banyak node baru (mule herder mengumpulkan rekening). Dua: cycle — uang berputar A→B→C→A (layering, mengaburkan asal). Tiga: dense cluster — sekelompok node saling bertransaksi padat (ring fraud, patungan fiktif).",
        "Teknik sederhana yang kuat: pasangan timbal-balik. Transaksi normal jarang dua arah (kamu transfer ke teman, teman jarang transfer balik nominal serupa). Ring layering penuh dengan pasangan timbal-balik — uang harus \"berputar\". Simulasi: 1.008 rekening, 8 di antaranya ring terkoordinasi. 8 rekening dengan pasangan timbal-balik terbanyak = tepat 8 anggota ring.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `out`: mapping rekening → set tujuan transfer" },
        { id: "t2", text: "Hitung pasangan timbal-balik tiap rekening" },
        { id: "t3", text: "Cetak 8 teratas + berapa anggota ring yang tertangkap" },
      ],
      expected: "8 teratas = tepat 8 anggota ring (rekening 1000-1007)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Graph analytics = harus pakai library graph mahal / GNN.\" 80% nilai graph fraud datang dari 20% teknik sederhana: degree, shared neighbors, pasangan timbal-balik, connected components. GNN hanya setelah yang sederhana terbukti kurang. Mulai dari yang bisa dijelaskan ke investigator.",
      },
      hints: [
        "out = defaultdict(set); loop edges: out[a].add(b).",
        "recip[a] = jumlah b di out[a] yang juga punya a di out[b].",
        "sorted(recip.items(), key=lambda x: -x[1])[:8].",
      ],
      code: {
        starter: `# Ring detection: pasangan timbal-balik = sinyal 'uang berputar'.\nimport random\nfrom collections import defaultdict\nrandom.seed(42)\nedges = []\nfor _ in range(8000):\n    a, b = random.randint(0, 999), random.randint(0, 999)\n    if a != b: edges.append((a, b))\nring = list(range(1000, 1008))\nfor a in ring:\n    for b in ring:\n        if a != b and random.random() < 0.9:\n            edges.append((a, b))\n\n# TULIS KODEMU\nout = defaultdict(set)\n\nrecip = {}\n\ntop = sorted(recip.items(), key=lambda x: -x[1])[:8]\nprint("8 rekening dengan pasangan timbal-balik terbanyak:")\nfor acc, r in top:\n    print(f"  rekening {acc}: {r}")\nprint("ring tertangkap:", sum(1 for acc, _ in top if acc in ring), "dari 8")`,
        lockLines: 11,
        solution: `# Ring detection: pasangan timbal-balik = sinyal 'uang berputar'.\nimport random\nfrom collections import defaultdict\nrandom.seed(42)\nedges = []\nfor _ in range(8000):\n    a, b = random.randint(0, 999), random.randint(0, 999)\n    if a != b: edges.append((a, b))\nring = list(range(1000, 1008))\nfor a in ring:\n    for b in ring:\n        if a != b and random.random() < 0.9:\n            edges.append((a, b))\n\n# TULIS KODEMU\nout = defaultdict(set)\nfor a, b in edges:\n    out[a].add(b)\nrecip = {}\nfor a in out:\n    recip[a] = sum(1 for b in out[a] if a in out.get(b, set()))\n\ntop = sorted(recip.items(), key=lambda x: -x[1])[:8]\nprint("8 rekening dengan pasangan timbal-balik terbanyak:")\nfor acc, r in top:\n    print(f"  rekening {acc}: {r}")\nprint("ring tertangkap:", sum(1 for acc, _ in top if acc in ring), "dari 8")`,
        checks: [
          { kind: "defined", task: "t1", name: "out", label: "`out` terdefinisi", msg: "Bangun mapping rekening → set tujuan." },
          { kind: "defined", task: "t2", name: "recip", label: "`recip` terdefinisi", msg: "Hitung pasangan timbal-balik tiap rekening." },
          { kind: "stdout_matches", task: "t3", pattern: "ring tertangkap: 8 dari 8", label: "8/8 anggota ring tertangkap", msg: "Delapan teratas = tepat delapan anggota ring." },
        ],
      },
      reference: "Mulai dari teknik sederhana (degree, timbal-balik, komponen) — GNN hanya jika terbukti kurang.",
    },
    {
      id: "fitur",
      eyebrow: "Langkah 4 · Fitur graf",
      title: "Dari struktur ke skor",
      prose: [
        "Temuan graf menjadi fitur untuk model tabular: jumlah tetangga (degree), % tetangga yang fraud (guilt by association — \"bergaul dengan penipu\"), jarak ke node fraud terdekat, ukuran komponen tempat node berada, dan skor PageRank dalam jaringan transfer.",
        "Prinsip \"guilt by association\" kuat tapi berbahaya: rekening yang menerima transfer dari mule — apakah ia komplotan atau korban yang ditipu? Fitur graf memberi sinyal, bukan vonis. Selalu pasangkan dengan verifikasi investigator sebelum tindakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Guilt by association bisa salah sasaran: korban penipuan yang 'menerima' dana dari mule terlihat terhubung dengan jaringan fraud. Blokir otomatis berbasis kedekatan graf = risiko memblokir korban. Graf menemukan kandidat; manusia menentukan bersalah atau korban.",
      },
      reference: "Fitur graf: degree, % tetangga fraud, jarak ke fraud, ukuran komponen. Sinyal, bukan vonis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan pakai lensa graf",
      prose: [
        "Satu: aplikasi massal dari sedikit device/IP → device-sharing graph (pabrik pengajuan, fake account). Dua: aliran dana berlapis, mule network → transaction network + deteksi cycle/komponen (AML & layering). Tiga: merchant settlement aneh → bipartite akun-merchant (merchant fiktif). Empat: enrich model tabular → fitur graf sebagai kolom baru (degree, % tetangga fraud).",
        "Batasan jujur: graf butuh data relasional yang lengkap (tanpa data device/IP yang baik, device graph buta); komputasi mahal untuk graf raksasa (jutaan node — butuh sampling atau incremental); dan penipu adaptif (mereka belajar menyebar device, memakai pola yang mirip normal).",
      ],
      tasks: [],
      reference: "Pilih lensa sesuai serangan: device-sharing, transaction network, atau bipartite.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "1.000 rekening, 8.000 transfer, Rp12 miliar, 48 jam",
      prose: [
        "PPATK memberi data: 1.000 rekening, 8.000 transfer, total Rp12 miliar dalam 48 jam. Dugaan layering. Kamu punya 48 jam untuk memberi daftar prioritas. Rancang pendekatan: graf apa yang dibangun, pola apa yang dicari, dan bagaimana daftar prioritas disusun?",
        "Pembahasan: (1) bangun transaction network (node=rekening, edge=transfer, bobot=nominal); (2) cari connected components — komponen raksasa yang tidak wajar = kandidat utama; (3) dalam komponen, hitung pasangan timbal-balik & cycle (sinyal layering); (4) urutkan node by kombinasi: derajat timbal-balik x total nominal x sentralitas; (5) 20 teratas → investigator dengan visualisasi subgrafnya. Yang tidak dilakukan: menuduh dari graf saja — daftar = prioritas investigasi, bukan daftar blokir.",
      ],
      tasks: [],
      reference: "Output graph analytics = daftar prioritas investigasi, bukan daftar vonis.",
    },
    {
      id: "ring-mule",
      eyebrow: "Langkah 7 · Pola ring mule",
      title: "Delapan node, Rp117 juta, satu koreografi",
      prose: [
        "Delapan node, sembilan puluh menit, Rp117 juta pokok — dan tidak satu pun rule yang berbunyi. Ini datanya: S (sumber, diduga dana judol) mengirim ke B Rp45 juta, C Rp32 juta, D Rp28 juta, E Rp12 juta — fan-out, 1 ke 4, dalam 22 menit. B, C, D, E meneruskan semuanya ke A: Rp45 + 32 + 28 + 12 = Rp117 juta — fan-in, 4 ke 1, dalam 35 menit. A memecah ke F: Rp88 juta, lalu Rp29 juta (dua transfer, 18 menit). F meneruskan Rp88 juta ke G — QRIS merchant yang baru terdaftar 11 hari. Setiap transfer di bawah ambang. Setiap rekening 'hanya' punya 1–2 transaksi. Di tabel transaksi, ini 11 baris yang membosankan. Di graf, ini klepsydra — melebar lalu menyempit — tanda tangan klasik money mule ring.",
        "Kenapa rule buta terhadap pola ini? Karena rule menilai transaksi, bukan koreografi. Transfer B→A Rp45 juta: di bawah ambang Rp500 juta, bukan round number yang mencurigakan, rekening B tidak ada di daftar hitam. Rule per-transaksi memeriksa 'apakah baris ini aneh' — dan setiap baris memang tidak aneh. Yang jahat adalah HUBUNGAN antar baris: empat rekening yang tidak saling kenal tiba-tiba bergerak sinkron menuju satu titik dalam 35 menit. Itu bukan sifat transaksi; itu sifat jaringan. Rule adalah mikroskop — hebat untuk spesimen tunggal; graf adalah peta — satu-satunya cara melihat pasukan bergerak.",
        "Empat sinyal graf yang konkret dan bisa dihitung. Satu: fan-in — ≥4 sumber berbeda mengirim ke 1 rekening dalam 1 jam, dan rekening tujuan berumur < 90 hari. Rekening gaji normal menerima dari 1 sumber (perusahaan); menerima dari 4+ sumber acak dalam sejam = bukan gaji. Dua: klepsydra (fan-out lalu fan-in) — pola melebar-menyempit dalam 2 hop; skor = jumlah node di lapisan tengah. Tiga: sinkronisitas waktu — 4 transfer dalam jendela 35 menit; uji: bila transfer acak tersebar 30 hari, probabilitas 4 transfer TERTENTU yang dispesifikasi di muka jatuh dalam 35 menit yang sama ≈ (35/43.200)³ ≈ 1 : 1,9 miliar. 'Kebetulan' lagi-lagi bukan kebetulan — untuk pola yang dispesifikasi di muka (lihat kualifikasi look-elsewhere di bawah). Empat: rasio in/out ≈ 1 — mule tidak menyimpan uang, ia meneruskan; rekening dengan total masuk ≈ total keluar (±10%) dalam 24 jam = pipa, bukan penampung.",
        "Aturan kapan graf melengkapi rule — karena graf mahal dan tidak bisa dipakai untuk semuanya. Arsitekturnya berlapis. Lapisan 1 (murah, real-time): rule per-transaksi menangkap yang 'berani' — nominal besar, pola dikenal. Lapisan 2 (sedang, near-real-time): bila ≥3 alert ringan menunjuk node-node yang terhubung dalam 2 hop, bangun subgraf di sekitarnya (bukan seluruh graf 10 juta node — hanya radius 2 hop dari alert, biasanya < 500 node). Lapisan 3 (mahal, harian): full graph scan untuk pola klepsydra di seluruh jaringan, dijalankan batch malam hari. Graf bukan pengganti rule; graf adalah lensa kedua yang dipasang hanya di tempat rule mencium sesuatu — ditambah sapuan malam untuk yang lolos.",
        "Contoh trigger yang bekerja di produksi. Alert 1: C→A Rp32 juta (rule 'transfer ke rekening muda'). Alert 2: E→A Rp12 juta (rule yang sama, 20 menit kemudian). Alert 3: A→F Rp88 juta (rule 'pecah transfer'). Tiga alert ringan, masing-masing skor 0,3 — tidak ada yang lolos threshold sendirian. Tapi ketiganya berbagi node A dalam 2 hop → trigger subgraf → fan-in 4-dalam-35-menit terdeteksi → skor gabungan 0,92 → eskalasi. Tanpa lapisan graf, tiga alert ini mati sebagai 'false positive' di antrean tier-3. Pelajarannya: alert ringan yang TERHUBUNG lebih berharga dari alert berat yang sendirian.",
        "Batasan yang harus jujur diakui. Satu: mule dengan riwayat legit — rekening gaji 5 tahun yang 'disewa' Rp500 ribu terlihat struktural identik dengan mule profesional; graf melihat struktur, bukan niat. Maka output graf = prioritas investigasi, bukan vonis (seperti minicase langkah 6). Dua: penipu adaptif — jitter waktu (transfer diacak ±3 jam), fan-in dipecah ke 2 collector, 'pemanasan' rekening 6 bulan sebelum dipakai. Jawabannya: cari pola statistik (distribusi waktu bimodal, bukan jendela kaku 1 jam) dan turunkan threshold fan-in untuk rekening yang 'dipanaskan'. Tiga: biaya komputasi — graf 10 juta node × incremental update per jam butuh infrastruktur serius; jangan bangun graf raksasa sebelum membuktikan nilainya di subgraf radius-2.",
        "Kasus kontras: kapan graf SALAH. Lima rekening kos-kosan mengirim ke bendahara kos Rp45 juta total dalam 1 jam (iuran + denda) — fan-in 5-dalam-1-jam, rekening muda (baru dibuka bendahara baru). Semua sinyal graf menyala — tapi ini iuran kos, bukan mule ring. Pembedanya: (1) keterangan transfer ('iuran kos bln 10', bukan kosong); (2) pola berulang bulanan (bukan sekali); (3) bendahara bisa dihubungi dan menjelaskan dalam 5 menit. Maka prosedur: skor graf tinggi → verifikasi ringan dulu (telepon/cek keterangan), baru eskalasi. Graf yang tidak punya jalur 'penjelasan sah 5 menit' akan membakar investigator dengan kos-kosan dan arisan.",
        "Integrasi ke model: fitur graf sebagai input supervised (FR7). Fitur yang terbukti: fan-in 1 jam (count + nominal), rasio in/out 24 jam, umur rekening tujuan, % tetangga yang pernah terlibat fraud (guilt-by-association — dengan hati-hati, lihat langkah 5), panjang rantai (FR15). Satu fitur graf yang baik (fan-in count) sering mengalahkan 20 fitur transaksional — karena ia menangkap dimensi yang tidak ada di tabel: koordinasi. Tapi ingat prinsipnya: fitur graf menaikkan skor, bukan memutuskan; keputusan tetap di tangan threshold ekonomis (FR9) dan investigator (FR14).",
        "Angka bisnisnya. Bank menengah: 2 juta rekening, 8 juta transfer/bulan. Full graph scan harian: ~4 jam komputasi klaster (Rp15 juta/bulan infrastruktur). Hasil: 12 ring terdeteksi per kuartal, rata-rata Rp400 juta per ring = Rp4,8 miliar/kuartal terekspos — TETAPI terekspos ≠ kerugian yang dicegah: sebagian dana sudah berpindah, sebagian bisa dipulihkan, sebagian bukan kerugian bank. 'ROI 100×' di lesson lama salah dua kali: ia membagi Rp4,8 M dengan Rp45 jt (= 106,7×, bukan 100×) DAN membandingkan eksposur dengan biaya — bandingkan KERUGIAN YANG BENAR-BENAR DICEGAH (setelah pemulihan) dengan SEMUA biaya, termasuk 0,5 investigator verifikasi yang belum dihitung biayanya. Dengan biaya investigator itu, rasionya turun lebih jauh. Hitung ROI dengan kerugian dicegah bersih, bukan eksposur kotor. Biaya: Rp45 juta/kuartal + 0,5 investigator untuk verifikasi. Tapi — dan ini penting — 12 ring itu hanya yang polanya 'klasik'. Estimasi dark figure (dari sampling manual): 2–3x lipat. Graf bukan solusi sempurna; ia adalah lensa yang mengubah 'tidak terlihat sama sekali' menjadi 'terlihat sebagian'. Sebagian > nol.",
        "Roadmap implementasi 90 hari untuk tim yang belum punya graf. Hari 1–30: bangun transaction network dari data yang ADA (tanpa beli data baru) — node=rekening, edge=transfer; hitung 3 metrik: fan-in 1 jam, rasio in/out, umur rekening. Hari 31–60: trigger subgraf dari alert rule ringan (radius 2 hop); ukur precision-nya manual. Hari 61–90: 1 fitur graf masuk ke model supervised; ukur lift-nya. Jangan mulai dari 'platform graph analytics enterprise' — mulai dari 3 metrik di notebook. Tiga metrik yang dihitung > platform mahal yang tidak dipakai.",

        "Bedah kedelapan node baris per baris — beginilah berkas kasus dibaca. S: rekening 4 bulan, saldo historis < Rp5 juta, tiba-tiba mengirim Rp117 juta dalam 22 menit — S tampak sebagai distributor (bukan korban) — berdasarkan pola fan-out-nya; tetapi itu hipotesis investigasi, bukan vonis: peran pasti hanya diketahui setelah verifikasi identitas dan niat. B–E: rekening 3–6 minggu ('joki', pola FR15), masing-masing 1 masuk + 1 keluar dalam 1 jam — pipa murni. A: rekening 2 bulan, menerima Rp117 juta lalu memecah 2x — collector yang juga 'memasak' (split untuk mengaburkan). F: rekening 5 minggu, menerima Rp117 juta bertahap, meneruskan Rp88 juta — forwarder. G: QRIS merchant 11 hari, menerima Rp88 juta — exit ke ekonomi 'sah'. Delapan peran, delapan pola hidup berbeda — dan tidak satu pun bisa disimpulkan dari 1 baris transaksi. Berkas kasus yang baik menceritakan PERAN, bukan baris.",
        "Matematika sinkronisitas — kenapa 'kebetulan' bukan penjelasan. Ambil 4 transfer acak yang tersebar uniform dalam 30 hari (43.200 menit). Probabilitas ketiganya jatuh dalam 35 menit setelah yang pertama ≈ (35/43.200)³ ≈ 5,3 × 10⁻¹⁰ — sekitar 1 : 1,9 miliar. Bahkan dengan 8 juta transfer/bulan di bank, ekspektasi kejadian se-ekstrem ini secara acak ≈ 0,004 per bulan — sekali dalam 20 tahun — TETAPI angka itu berlaku untuk SATU pola yang dispesifikasi di muka. Bank tidak menguji satu pola: ia memindai jutaan kombinasi akun, jendela waktu, dan kelompok transfer — peluang menemukan SATU pola sinkron DI MANA SAJA jauh lebih besar (look-elsewhere / multiple comparisons). Jadi 'sekali dalam 20 tahun' adalah batas bawah yang terlalu optimistis untuk pola yang ditemukan lewat pemindaian; gunakan angka ini sebagai bahasa ke manajemen dengan kualifikasi itu, bukan sebagai probabilitas bahwa pola ini kebetulan. Maka ketika kamu melihatnya dua kali dalam seminggu, itu tetap sinyal kuat — tetapi kekuatan buktinya datang dari KONSISTENSI pola (fan-in + klepsydra + exit yang sama), bukan dari satu angka probabilitas. Firasat bisa dibantah; aritmetika tidak — tetapi aritmetika yang benar menghitung juga peluang menemukannya lewat pemindaian.",
        "Dari subgraf ke berkas kasus: visualisasi adalah setengah investigasi. Cetak subgraf 8 node dengan ketebalan edge = nominal dan label waktu — tempel di berkas. Tulis narasi 5 kalimat: siapa S, apa peran tiap node, kapan jendelanya, berapa totalnya, ke mana exit-nya. Berkas seperti ini dibaca analis PPATK dalam 3 menit dan langsung bisa digabung dengan berkas bank lain ('S juga muncul di bank kami!'). Berkas yang hanya berisi 11 baris CSV dibaca 3 menit lalu dilupakan. Di AML, kasus yang tidak bisa diceritakan = kasus yang tidak bisa digabungkan = kasus yang mati sendirian.",
        "Kapan TIDAK perlu graf — kejujuran yang menghemat Rp15 juta/bulan. Bank kecil (< 200 ribu rekening) dengan fraud dominan first-party/opportunistik (bukan terorganisir): 3 metrik sederhana + rule sudah cukup; graf raksasa = overkill. Test-nya: dalam 6 bulan terakhir, berapa kasus fraud yang melibatkan ≥4 rekening terkoordinasi? Bila < 5, tunda investasi graf; bila > 20, graf membayar dirinya sendiri. Dan jangan beli 'platform graph' sebelum 3 metrik notebook terbukti punya precision > 30% — platform tidak memperbaiki metrik yang buruk, ia hanya membuat metrik buruk lebih mahal.",
        "Latihan tim (45 menit, whiteboard). Gambar 8 node kasus ini dari memori — tanpa melihat catatan. Tulis di tiap edge: nominal + menit ke berapa. Lalu jawab: (1) node mana yang di-freeze duluan bila ini kasus FR15? (G — exit; lalu F, A, B–E, S terakhir untuk forensik.) (2) alert rule ringan apa yang bisa men-trigger subgraf ini? (3) apa penjelasan sah yang mungkin, dan bagaimana mematahkannya dalam 5 menit? (Arisan Rp117 juta? Minta daftar anggota.) Latihan ini melatih otot yang paling penting: membaca graf seperti membaca cerita — karena itulah yang ia adalah: cerita tentang uang yang bergerak.",
        "Ringkasnya, pola ring mule. Satu: yang jahat adalah koreografi (fan-in/fan-out sinkron), bukan transaksinya — tiap baris terlihat normal. Dua: 4 sinyal hitung — fan-in ≥4/jam ke rekening muda, klepsydra, sinkronisitas waktu, rasio in/out ≈1. Tiga: arsitektur berlapis — rule (murah) → subgraf dari alert (sedang) → full scan malam (mahal). Empat: alert ringan yang terhubung > alert berat yang sendirian. Lima: output = prioritas investigasi + verifikasi 5 menit untuk penjelasan sah; bukan vonis, bukan auto-block.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: cari koreografinya, bukan penarinya",
        type: "risk",
        body: "Satu rekening mule itu membosankan: satu transfer masuk, satu transfer keluar, nominal wajar. Investigator pemula menghabiskan waktu menginterogasi 'penari' satu per satu — dan tidak menemukan apa-apa, karena memang tidak ada apa-apa di level individu. Kejahatannya ada di level koreografi: lima penari yang tidak saling kenal bergerak sinkron. Latih matamu untuk bertanya 'siapa yang bergerak BERSAMAAN?' bukan 'siapa yang bergerak BESAR?'. Kedua, waktu adalah sidik jari yang tidak bisa dipalsukan dengan mudah — nominal bisa dipecah, rekening bisa diganti, tapi mengoordinasikan 4 orang dalam 35 menit meninggalkan pola sinkronisitas yang mahal untuk disembunyikan. Ketiga, graf adalah mesin hipotesis, bukan mesin vonis: outputnya adalah subgraf berprioritas untuk manusia, karena guilt-by-association bisa menjerat korban — rekening gaji yang disewa Rp500 ribu terlihat struktural identik dengan sarang penjahat. Bedakan 'terhubung' dari 'bersalah'; yang pertama tugas graf, yang kedua tugas investigator. Keempat, curigai kesempurnaan: jaringan yang terlalu rapi (nominal sama persis, jeda waktu sama persis) sering bukan penjahat profesional — melainkan pengujian atau data sintetis; penjahat sungguhan mengacak. Kelima, ingat biaya komputasi sebagai kompas: bila subgraf radius-2 dari alert tidak menemukan apa-apa 10x berturut-turut, trigger-mu terlalu longgar — ketatkan, jangan perbesar graf. Graf yang baik adalah graf yang jarang dipakai tapi selalu tepat saat dipakai.",
      },
      reference: "Rule menangkap transaksi; graf menangkap koreografi. Fan-in ≥4/jam ke rekening muda = bangun subgraf.",
    },
        {
          id: "gap-r7-temporal-leakage",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P5-G2)",
          title: "Temporal leakage: fitur yang mengintip masa depan",
          prose: [
            "Fitur graf (langkah 4) dihitung dari data transaksi — tetapi dari data SAMPAI KAPAN? Bila fitur 'transfer 7 hari terakhir' untuk keputusan di akhir hari ke-5 dihitung dari SEMUA transfer di dataset — termasuk yang terjadi di hari ke-8 dan ke-9 — fitur itu mengintip masa depan. Lab ini mengukurnya: rekening X menerima transfer di hari 1, 2, 3, 8, 9 (Rp10, 20, 15, 50, 60 jt). Yang BENAR (hanya sampai hari ke-5): 3 transfer, Rp45 jt. Yang BOCOR (semua transfer): 5 transfer, Rp155 jt — 3,44× lipat. Model yang dilatih dengan fitur bocor terlihat brilian di backtest (ia 'tahu' masa depan) dan gagal di live (masa depan belum terjadi saat keputusan dibuat).",
            "Leakage punya dua wajah. Satu: fitur yang memakai event SETELAH waktu keputusan (seperti di atas) — obatnya point-in-time correctness: tiap fitur hanya memakai event dengan timestamp ≤ waktu keputusan (as-of join). Dua: label yang memakai informasi masa depan — mis. fitur '% tetangga yang fraud' di mana status 'fraud' tetangga baru diketahui berminggu-minggu SETELAH keputusan; atau split train/test acak yang menaruh transfer masa depan di train dan masa lalu di test. Obatnya: split BERDASARKAN WAKTU (train ≤ hari ke-30, test > hari ke-30) dan audit tiap fitur dengan pertanyaan: 'apakah angka ini sudah ada saat keputusan dibuat?' Bila jawabannya tidak — buang, betapa pun prediktifnya.",
          ],
          formula: String.raw`\text{fitur}(t) = f(\text{event dengan } ts \le t) \qquad \text{bukan } f(\text{semua event})`,
          formulaNote: "Keputusan akhir hari ke-5; transfer hari 1, 2, 3, 8, 9: benar 3 transfer / Rp45 jt; bocor 5 transfer / Rp155 jt (3,44×).",
          tasks: [
            { id: "t1", text: "Hitung fitur BENAR (ts ≤ hari ke-5): `n_benar`, `nom_benar`" },
            { id: "t2", text: "Hitung fitur BOCOR (semua transfer): `n_bocor`, `nom_bocor`, `rasio_bocor`" },
          ],
          expected: "n_benar=3 nom_benar=45 n_bocor=5 nom_bocor=155 rasio_bocor=3.44",
          hints: [
            "Fitur benar hanya menghitung transfer dengan hari ≤ 5.",
            "Rasio bocor = nominal bocor / nominal benar.",
          ],
          code: {
            starter: `# Transfer masuk ke rekening X (hari, Rp jt). Keputusan skor dibuat di AKHIR hari ke-5.\ntransfer = [(1, 10), (2, 20), (3, 15), (8, 50), (9, 60)]\nhari_keputusan = 5\n\n# TULIS KODEMU: fitur "transfer 7 hari terakhir" yang BENAR vs yang BOCOR\nn_benar =\nnom_benar =\nn_bocor =\nnom_bocor =\nrasio_bocor =\n\nprint(f"n_benar={n_benar} nom_benar={nom_benar} n_bocor={n_bocor} nom_bocor={nom_bocor} rasio_bocor={rasio_bocor}")`,
            lockLines: 5,
            solution: `# Transfer masuk ke rekening X (hari, Rp jt). Keputusan skor dibuat di AKHIR hari ke-5.\ntransfer = [(1, 10), (2, 20), (3, 15), (8, 50), (9, 60)]\nhari_keputusan = 5\n\n# TULIS KODEMU: fitur "transfer 7 hari terakhir" yang BENAR vs yang BOCOR\nn_benar = sum(1 for h, _ in transfer if h <= hari_keputusan)\nnom_benar = sum(v for h, v in transfer if h <= hari_keputusan)\nn_bocor = len(transfer)\nnom_bocor = sum(v for _, v in transfer)\nrasio_bocor = round(nom_bocor / nom_benar, 2)\n\nprint(f"n_benar={n_benar} nom_benar={nom_benar} n_bocor={n_bocor} nom_bocor={nom_bocor} rasio_bocor={rasio_bocor}")`,
            checks: [
              { kind: "equal", task: "t1", name: "n_benar", value: 3, tol: 1e-9, label: "`n_benar` = 3", msg: "Hanya transfer hari 1, 2, 3 yang sudah ada saat keputusan." },
              { kind: "equal", task: "t1", name: "nom_benar", value: 45, tol: 1e-9, label: "`nom_benar` = 45", msg: "10 + 20 + 15 = 45." },
              { kind: "equal", task: "t2", name: "n_bocor", value: 5, tol: 1e-9, label: "`n_bocor` = 5", msg: "Semua transfer ikut terhitung — termasuk hari 8 dan 9." },
              { kind: "equal", task: "t2", name: "nom_bocor", value: 155, tol: 1e-9, label: "`nom_bocor` = 155", msg: "45 + 50 + 60 = 155." },
              { kind: "equal", task: "t2", name: "rasio_bocor", value: 3.44, tol: 0.01, label: "`rasio_bocor` = 3,44", msg: "Fitur bocor 3,44× lipat dari yang benar." },
              { kind: "stdout_matches", task: "t2", pattern: "n_benar=3\\s+nom_benar=45\\s+n_bocor=5\\s+nom_bocor=155\\s+rasio_bocor=3\\.44", label: "`print` menampilkan kelimanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Fitur 'transfer 7 hari terakhir' dihitung dari semua transfer di dataset, termasuk setelah tanggal keputusan. Apa yang terjadi?",
              options: [
                { text: "Temporal leakage — fitur memakai masa depan; backtest terlihat bagus, live gagal", why: "Tepat: fitur itu 'tahu' transfer hari 8–9 yang belum terjadi saat keputusan dibuat. Obatnya as-of join (ts ≤ waktu keputusan) + split berdasarkan waktu.", correct: true },
                { text: "Tidak ada masalah — makin banyak data makin bagus fiturnya", why: "Salah: data masa depan bukan 'lebih banyak data' — ia informasi yang tidak tersedia saat keputusan dibuat." },
                { text: "Overfitting biasa — atasi dengan regularisasi", why: "Salah: ini bukan overfitting, melainkan leakage. Regularisasi tidak menghapus informasi masa depan dari fitur." },
                { text: "Hanya masalah bila transfernya besar", why: "Salah: leakage tidak peduli nominal — 3 transfer vs 5 transfer saja sudah mengubah fitur 3,44× lipat." },
              ],
            },
          ],
          reference: "Fitur graf WAJIB point-in-time: hanya event dengan ts ≤ waktu keputusan; split train/test BERDASARKAN WAKTU, bukan acak.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Fraud terorganisir = jejaring; jejaring tak terlihat di tabel — terlihat di graf.",
        "Device-sharing graph: 'banyak aplikasi, sedikit device' = pabrik pengajuan.",
        "Pasangan timbal-balik = sinyal 'uang berputar' (layering).",
        "Fitur graf (degree, % tetangga fraud) = sinyal untuk model, bukan vonis.",
        "Guilt by association bisa salah sasaran — korban terlihat terhubung juga.",
      ],
      next: { label: "FR13 — Real-Time", href: "/v2/learn/fr13-realtime" },
      quiz: [
        {
          q: "2.300 pengajuan pinjaman dari 41 device. Apa kesimpulannya?",
          options: [
            { text: "Normal — banyak orang", why: "56 pengajuan per HP bukan perilaku normal." },
            { text: "'Pabrik pengajuan' — device-sharing graph menangkap yang tak terlihat di tabel: tiap pengajuan 'normal' sendiri-sendiri", why: "Rata-rata 56 pengajuan per device adalah sinyal kuat koordinasi — tetapi itu bukti statistik, bukan bukti niat: verifikasi (apakah device dipakai bergantian oleh satu operator?) tetap diperlukan sebelum menyebutnya 'pabrik'.", correct: true },
            { text: "Kebetulan", why: "2.300 pengajuan / 41 device bukan kebetulan." },
            { text: "Data rusak", why: "Datanya valid — polanya yang jahat." },
          ],
        },
        {
          q: "Mengapa pasangan timbal-balik (A→B dan B→A) adalah sinyal layering?",
          options: [
            { text: "Karena transfer dua arah dilarang", why: "Tidak dilarang — hanya jarang terjadi secara alami." },
            { text: "Transaksi normal jarang dua arah; ring layering penuh pasangan timbal-balik karena uang harus 'berputar' mengaburkan asal", why: "Kamu transfer ke teman; teman jarang transfer balik nominal serupa.", correct: true },
            { text: "Karena mahal", why: "Bukan soal biaya." },
            { text: "Tidak ada hubungannya", why: "Ada: simulasi menunjukkan 8/8 anggota ring tertangkap." },
          ],
        },
        {
          q: "Rekening X menerima transfer dari mule yang diketahui. Apakah X otomatis komplotan?",
          options: [
            { text: "Ya — guilt by association pasti", why: "X bisa jadi korban yang ditipu — guilt by association = sinyal, bukan vonis." },
            { text: "Tidak — X bisa korban; graf memberi kandidat prioritas, manusia menentukan bersalah atau korban", why: "Blokir otomatis berbasis kedekatan graf berisiko memblokir korban.", correct: true },
            { text: "Ya jika nominal besar", why: "Nominal besar tidak mengubah kemungkinan X adalah korban." },
            { text: "Tidak pernah masalah", why: "Tetap masalah — prioritas investigasi, bukan pengabaian." },
          ],
        },
        {
          q: "Dugaan merchant fiktif (toko abal-abal menggesek kartu curian). Graf apa?",
          options: [
            { text: "Device-sharing", why: "Itu untuk pabrik pengajuan / fake account." },
            { text: "Transaction network antar rekening", why: "Itu untuk layering / mule network." },
            { text: "Bipartite akun ↔ merchant — pola 'banyak kartu berbeda ke satu merchant baru dengan ticket seragam'", why: "Merchant fiktif terlihat dari sisi merchant: banyak kartu, ticket seragam, jam aneh.", correct: true },
            { text: "Tidak butuh graf", why: "Pola ini justru paling jelas di graf bipartite." },
          ],
        },
        {
          q: "Kapan GNN (graph neural network) layak dipertimbangkan?",
          options: [
            { text: "Selalu — teknologi terbaru", why: "Terbaru ≠ selalu tepat." },
            { text: "Dari awal", why: "Mulailah dari yang sederhana dan bisa dijelaskan." },
            { text: "Setelah teknik sederhana (degree, timbal-balik, komponen) terbukti kurang — 80% nilai datang dari 20% teknik sederhana", why: "GNN mahal, sulit dijelaskan ke investigator/regulator.", correct: true },
            { text: "Tidak pernah", why: "Ada kasus kompleks di mana GNN membantu — hanya bukan langkah pertama." },
          ],
        },
      ],
    },
  ],
};
