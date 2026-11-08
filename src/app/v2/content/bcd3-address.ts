import type { V2Lesson } from "../lib/types";

// Clustering: tiga entitas benar vs satu false merge via hot wallet (garis putus-putus).
const CLUSTER_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Tiga cluster address: Alice, Bob, dan Exchange. Satu garis putus-putus salah menggabungkan Alice ke Exchange.">
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600" text-anchor="middle">
<text x="100" y="30">Alice</text><text x="380" y="30">Exchange</text><text x="240" y="222">Bob</text></g>
<g stroke="var(--c1)" stroke-width="2" fill="none"><ellipse cx="100" cy="110" rx="80" ry="62"/></g>
<g stroke="var(--c4)" stroke-width="2" fill="none"><ellipse cx="380" cy="110" rx="80" ry="62"/></g>
<g stroke="var(--chart-grid)" stroke-width="2" fill="none"><ellipse cx="240" cy="180" rx="70" ry="36"/></g>
<g fill="var(--c1)"><circle cx="70" cy="100" r="10"/><circle cx="110" cy="90" r="10"/><circle cx="130" cy="125" r="10"/></g>
<g fill="var(--c4)"><circle cx="350" cy="100" r="10"/><circle cx="390" cy="90" r="10"/><circle cx="410" cy="125" r="10"/></g>
<g fill="var(--chart-text)"><circle cx="220" cy="175" r="10"/><circle cx="260" cy="185" r="10"/></g>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">
<text x="70" y="104">a1</text><text x="110" y="94">a2</text><text x="130" y="129">a3</text>
<text x="350" y="104">e1</text><text x="390" y="94">e2</text><text x="410" y="129">e3</text>
<text x="220" y="179">b1</text><text x="260" y="189">b2</text></g>
<line x1="138" y1="120" x2="342" y2="105" stroke="var(--c4)" stroke-width="2" stroke-dasharray="7 5"/>
<text x="240" y="98" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">tx t6: a3 + e1 = FALSE MERGE</text>
</svg>`;

const BCD3_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Presisi clustering: heuristik ketat 97 persen, standar 87,5 persen, longgar 75 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><rect x="72.5" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c1)"/><text x="115.7" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">P97/R60</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Ketat</text><rect x="211.8" y="35.7" width="86.4" height="144.3" rx="3" fill="var(--c2)"/><text x="255.0" y="29.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">P87/R82</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Standar</text><rect x="351.1" y="56.3" width="86.4" height="123.7" rx="3" fill="var(--c4)"/><text x="394.3" y="50.3" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">P75/R92</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Longgar</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">P=presisi, R=recall</text></svg>`;

export const bcd3: V2Lesson = {
  slug: "bcd3-address",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD3 — Address Clustering & Entity Labeling",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Paus Rp4 triliun yang ternyata 12.000 orang",
      prose: [
        "2021. Sebuah dashboard 'whale alert' gempar: satu entitas menguasai 120.000 BTC — Rp4 triliun lebih. Media kripto menulis 'paus misterius mengakumulasi'. Tiga minggu kemudian, firma analitik merilis koreksi yang memalukan: itu bukan paus. Itu hot wallet sebuah exchange — 12.000 nasabah yang dananya dikelola satu dompet operasional.",
        "Twist-nya menyakitkan: heuristik clustering yang 'menggabungkan address milik orang yang sama' bekerja TEPAT seperti dirancang — ia menggabungkan semua input yang dibelanjakan bersama. Masalahnya: di hot wallet exchange, 'dibelanjakan bersama' berarti 'milik 12.000 nasabah yang berbeda'. Heuristiknya benar secara mekanis, salah secara makna.",
        "Lesson ini tentang seni menggabungkan address menjadi entitas — dan kapan harus MENOLAK menggabungkan. Tujuan: (1) menerapkan heuristik common-input ownership; (2) mengenali pola exchange/mixer yang merusak clustering; (3) memahami entity labeling sebagai lapisan verifikasi. Peta: cerita → heuristik inti → lab clustering → jebakan hot wallet → labeling → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan heuristik common-input-ownership dengan contoh; (2) menghitung presisi dan recall clustering dan trade-off-nya; (3) mengenali tiga pola yang merusak clustering (CoinJoin, exchange, dusting); (4) memutuskan kapan menggabungkan vs menolak cluster.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Satu address = satu orang, jadi clustering tidak penting.\" Di Bitcoin/UTXO, satu orang memakai RATUSAN address (change address tiap transaksi). Tanpa clustering, 'aktivitas paus' terpecah jadi 500 address kecil yang tak terlihat. Di sisi lain, satu address BISA milik 12.000 orang (hot wallet). Address ≠ orang ke dua arah — clustering adalah jembatan yang rapuh di antara keduanya.",
      },
      reference: "Address ≠ orang (dua arah). Clustering = hipotesis kepemilikan, bukan fakta.",
    },
    {
      id: "heuristik",
      eyebrow: "Langkah 2 · Heuristik inti",
      title: "Common-input ownership: belanja bareng = milik bareng",
      prose: [
        "Heuristik paling terkenal (berasal dari analisis Bitcoin UTXO): semua INPUT dalam satu transaksi diasumsikan milik entitas yang sama. Logikanya: untuk membelanjakan dua UTXO sekaligus, kamu harus memegang private key keduanya — jadi kemungkinan besar satu dompet.",
        "Implementasinya = union-find: tiap address mulai sebagai himpunannya sendiri; tiap transaksi menggabungkan (union) semua address inputnya. Hasilnya: cluster-cluster kandidat entitas. Sederhana, cepat, dan menangkap 70–80% struktur kepemilikan di chain UTXO.",
        "Versi Ethereum (account-based): heuristiknya berbeda — 'deposit address reuse'. Exchange memberi tiap nasabah address deposit unik; dana dari banyak deposit address yang selalu disapu ke SATU address induk = cluster exchange. Pola sapuannya (sweep) adalah sidik jarinya: banyak input kecil → satu output besar, berulang seperti jam.",
        "Cara membaca diagram: tiga elips = tiga entitas hasil clustering (Alice: a1–a3, Exchange: e1–e3, Bob: b1–b2). Garis putus-putus = transaksi t6 yang menggabungkan input a3 (Alice) dan e1 (Exchange) — SATU transaksi ini meruntuhkan dinding antara Alice dan Exchange. Interpretasi: clustering itu rapuh — satu edge yang salah menggabungkan dua dunia.",
      ],
      figure: {
        svg: CLUSTER_SVG,
        alt: "Tiga cluster address: Alice, Bob, dan Exchange. Satu garis putus-putus salah menggabungkan Alice ke Exchange.",
        caption: "Satu transaksi co-spend (t6) cukup untuk melebur cluster Alice ke dalam cluster Exchange — false merge.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: clustering adalah hipotesis, label adalah verifikasi",
        body: "Hasil clustering TANPA label = tebakan berstruktur. 'Cluster #4817' tidak berarti apa-apa sampai kamu menempelkan bukti: address ini pernah diumumkan exchange di Twitter, pola sweep-nya cocok jam operasional Asia, pernah berinteraksi dengan contract KYC. Analis profesional menghabiskan lebih banyak waktu MEMVALIDASI cluster daripada MEMBUATNYA. Aturan: jangan pernah menuduh berdasarkan cluster yang belum dilabeli dua sumber independen.",
      },
      reference: "Common-input (UTXO) / deposit-sweep (account) → union-find → cluster → WAJIB validasi label.",
    },
    {
      id: "lab-cluster",
      eyebrow: "Langkah 3 · Lab",
      title: "Membangun cluster — lalu merusaknya",
      prose: [
        "Enam transaksi sintetis gaya UTXO. Lima di antaranya bersih: Alice (a1–a3), Bob (b1–b2), Exchange (e1–e4). Satu beracun: t6 menggabungkan input a3 + e1 — persis pola 'pengguna menarik dari exchange lalu co-spend dengan dompet pribadinya' ATAU 'campur tangan hot wallet'.",
        "Tugasmu: (1) jalankan union-find dengan SEMUA transaksi → hitung entitas; (2) keluarkan t6 → hitung lagi. Selisihnya adalah harga satu asumsi yang salah.",
      ],
      formula: String.raw`\text{find}(x) = \text{akar himpunan } x \qquad \text{union}(a,b) \Rightarrow \text{find}(a) = \text{find}(b)`,
      formulaNote: "find(x) menelusuri parent pointer sampai akar — akar = identitas cluster. union(a,b) menempelkan akar a ke akar b. Tiap transaksi = union semua pasangan inputnya.",
      tasks: [
        { id: "t1", text: "Bangun `parent`/union-find dari SEMUA transaksi, hitung `n_all`" },
        { id: "t2", text: "Ulangi TANPA t6, hitung `n_clean`" },
        { id: "t3", text: "Cetak `n_all` dan `n_clean`" },
      ],
      expected: "n_all=2  n_clean=3",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Semakin sedikit entitas = clustering semakin bagus.\" Justru sebaliknya yang sering terjadi: false merge MENURUNKAN jumlah entitas (dua entitas berbeda dilebur jadi satu) — metrik 'sedikit = bagus' memberi nilai TERTINGGI pada clustering yang paling rusak. Evaluasi clustering butuh ground truth berlabel (precision/recall per pasangan), bukan jumlah cluster.",
      },
      hints: [
        "find(x): jika parent[x] != x, telusuri terus. union(a,b): parent[find(a)] = find(b).",
        "Tiap transaksi: union-kan input[0] dengan tiap input lainnya.",
        "Hitung akar unik dari semua address yang muncul.",
      ],
      code: {
        starter: `# Transaksi UTXO sintetis: (txid, [input addresses])\ntxs = [("t1",["a1","a2"]),("t2",["a2","a3"]),("t3",["b1","b2"]),("t4",["e1","e2","e3"]),("t5",["e3","e4"]),("t6",["a3","e1"])]\n\ndef count_entities(txlist):\n    parent = {}\n    def find(x):\n        parent.setdefault(x, x)\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for _, ins in txlist:\n        for a in ins[1:]:\n            parent[find(ins[0])] = find(a)\n    roots = {find(a) for _, ins in txlist for a in ins}\n    return len(roots)\n\n# TULIS KODEMU\nn_all = \nn_clean = \n\nprint(f"n_all={n_all}  n_clean={n_clean}")`,
        lockLines: 17,
        solution: `# Transaksi UTXO sintetis: (txid, [input addresses])\ntxs = [("t1",["a1","a2"]),("t2",["a2","a3"]),("t3",["b1","b2"]),("t4",["e1","e2","e3"]),("t5",["e3","e4"]),("t6",["a3","e1"])]\n\ndef count_entities(txlist):\n    parent = {}\n    def find(x):\n        parent.setdefault(x, x)\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    for _, ins in txlist:\n        for a in ins[1:]:\n            parent[find(ins[0])] = find(a)\n    roots = {find(a) for _, ins in txlist for a in ins}\n    return len(roots)\n\n# TULIS KODEMU\nn_all = count_entities(txs)\nn_clean = count_entities([t for t in txs if t[0] != "t6"])\n\nprint(f"n_all={n_all}  n_clean={n_clean}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_all", value: 2, tol: 0, label: "`n_all` = 2 (false merge)", msg: "t6 melebur Alice ke Exchange: {a1,a2,a3,e1..e4} + {b1,b2} = 2." },
          { kind: "equal", task: "t2", name: "n_clean", value: 3, tol: 0, label: "`n_clean` = 3 (benar)", msg: "Tanpa t6: Alice, Bob, Exchange = 3 entitas." },
          { kind: "stdout_matches", task: "t3", pattern: "n_all=2\\s+n_clean=3", label: "Output menampilkan keduanya", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Union-find: tiap tx = union semua input. Satu tx beracun bisa melebur dua entitas.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 4 · Jebakan",
      title: "Tiga pola yang merusak clustering",
      prose: [
        "Satu — Hot wallet exchange: ribuan nasabah, satu dompet operasional. Co-spend di sini = co-spend UANG ORANG LAIN. Mitigasi: labeli dulu address exchange yang diketahui (dari pengumuman resmi, pola sweep), KECUALIKAN dari heuristik umum, perlakukan sebagai entitas khusus.",
        "Dua — Mixer/CoinJoin: transaksi yang SENGAJA dirancang agar banyak orang terlihat 'belanja bareng' untuk mengaburkan jejak. Heuristik common-input di sini bukan sekadar salah — ia dimanipulasi. Mitigasi: deteksi struktur CoinJoin (banyak input + banyak output bernilai sama) dan tandai, jangan cluster.",
        "Tiga — Change address yang tertukar: heuristik 'one-time change' (menebak address kembalian) bisa salah menunjuk address penerima sebagai milik pengirim. Satu tebakan change yang salah = dua entitas asing tergabung permanen. Mitigasi: hanya pakai change heuristic dengan confidence tinggi (address baru, nilai kembalian presisi aneh).",
        "Benang merahnya: setiap heuristik punya 'musuh alami'. Analis yang baik menghafal bukan cuma heuristiknya, tetapi KAPAN ia berbohong.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: false merge lebih mahal daripada missed merge",
        body: "Gagal menggabungkan dua address milik orang yang sama (missed merge) = analisismu kurang lengkap. SALAH menggabungkan address orang berbeda (false merge) = kamu menuduh orang yang salah — dalam konteks AML, itu bisa berarti memblokir dana orang tak bersalah atau menuduh exchange terlibat kejahatan. Asimetri biayanya jelas: saat ragu, JANGAN gabungkan. Precision mengalahkan recall dalam forensik.",
      },
      reference: "Musuh heuristik: hot wallet, mixer/CoinJoin, change address. Saat ragu, jangan gabungkan.",
    },
    {
      id: "labeling",
      eyebrow: "Langkah 5 · Entity labeling",
      title: "Dari cluster anonim ke nama",
      prose: [
        "Labeling = menempelkan identitas ke cluster: 'exchange X', 'mixer Y', 'peretas Z (kasus 2023)'. Sumber label: pengumuman resmi perusahaan, database forensik komersial, pelaporan korban, pola perilaku yang khas (jam operasional, struktur sweep).",
        "Dua prinsip. Satu — provenance: catat SUMBER tiap label dan tanggalnya. Label 'mixer' dari tweet 2021 belum tentu valid untuk address yang baru dipakai 2024. Dua — decay: label bisa kedaluwarsa; exchange bisa menjual/melepas address, peretas bisa menjual private key. Label tanpa timestamp = bom waktu.",
        "Hubungan ke AML tradisional: ini padanan on-chain dari daftar watchlist/sanctions. Bedanya: di bank, nasabah mendaftar dengan KTP; di chain, 'KTP'-nya adalah histori perilaku — dan analis yang menerbitkannya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Label yang salah = keputusan bisnis yang salah: menolak nasabah sah karena dompetnya 'tercemar' label mixer yang kedaluwarsa, atau meloloskan dana peretas karena label belum diperbarui. Kebijakan yang sehat: label butuh dua sumber independen + review berkala. Satu sumber = rumor, bukan intelijen.",
      },
      reference: "Label butuh sumber + timestamp + review berkala. Dua sumber independen minimum.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan gabung, kapan tolak",
      prose: [
        "Skenario 1 — Transaksi UTXO normal, input dari 3 address yang belum berlabel → GABUNG (common-input). Ini kasus standar heuristik.",
        "Skenario 2 — Salah satu input adalah hot wallet exchange yang sudah dilabeli → TOLAK gabung; perlakukan exchange sebagai entitas khusus. Pengecualian ini mencegah 'paus Rp4 triliun' palsu.",
        "Skenario 3 — Struktur CoinJoin (N input, N output bernilai identik) → TOLAK gabung + tandai sebagai aktivitas privasi. Ini mixer, bukan dompet.",
        "Skenario 4 — Deposit sweep: 200 address kecil → 1 address induk dalam pola berulang → GABUNG sebagai cluster exchange, lalu LABELI sebagai exchange (bukan sebagai 'paus').",
        "Skenario 5 — Change address ambigu (dua kandidat kembalian) → TOLAK gabung sampai ada bukti tambahan. False merge lebih mahal daripada missed merge.",
        "Aturan praktis 10 detik: (1) adakah label di antara input? → ikuti aturan label; (2) adakah struktur privasi? → tolak; (3) sisanya → gabung, tapi catat confidence-nya. Clustering tanpa skor confidence = klaim tanpa pertanggungjawaban.",
      ],
      tasks: [],
      reference: "Ada label/privasi → tolak dulu. Selebihnya gabung + catat confidence.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "12.000 nasabah dalam satu 'paus'",
      prose: [
        "Dashboard whale alert menandai cluster 120.000 BTC sebagai 'paus misterius mengakumulasi'. Kamu diminta verifikasi sebelum berita diterbitkan. Data: cluster terbentuk dari 40.000 address input yang co-spend dalam 2.300 transaksi selama 6 bulan; pola: tiap transaksi menggabungkan 15–20 input menjadi 1–2 output besar; output selalu dibulatkan ke kelipatan 100 BTC; jam aktivitas mengikuti jam kerja Asia.",
        "Analisis: (a) 40.000 address co-spend — terlalu banyak untuk satu orang wajar, terlalu teratur untuk peretas; (b) output kelipatan 100 BTC = batching operasional, bukan akumulasi spekulatif; (c) jam kerja Asia = operasi bisnis. Kesimpulan: ini hot wallet/cold storage exchange, BUKAN paus individu.",
        "Pembahasan: tiga sinyal membedakannya dari paus sungguhan — skala input (ribuan, bukan puluhan), kebulatan output (operasional, bukan pasar), dan ritme waktu (jam kerja). Pelajaran: 'paus' adalah klaim tentang ENTITAS, dan entitas tidak bisa disimpulkan dari besarnya angka saja. Verifikasi label sebelum publikasi — biaya koreksinya adalah kredibilitas medianya.",
      ],
      tasks: [],
      reference: "Bedakan paus vs exchange: skala input, kebulatan output, ritme waktu.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Presisi vs recall: dua cara clustering salah",
      prose: [
        "Heuristik common-input-ownership: `input yang dibelanjakan bersama = milik orang yang sama`. Dari 100 transaksi, heuristik menggabungkan 1.000 address menjadi 80 cluster. Audit manual (ground truth dari kasus yang terungkap): 70 cluster BENAR-BENAR satu pemilik (TP), 10 cluster SALAH gabung (FP — dua orang digabung jadi satu), dan 15 pemilik asli TERPECAH menjadi beberapa cluster (FN — satu orang jadi 3 cluster). Presisi = 70/80 = 87,5%. Recall = 70/(70+15) = 82,4%. F1 = 84,9%.",
        "Dua jenis kesalahan, dua bahaya berbeda. FALSE POSITIVE (salah gabung): analis menuduh `paus X` padahal itu exchange dengan 12.000 nasabah (cerita lesson!) — fitnah + kesimpulan salah total. FALSE NEGATIVE (salah pisah): pelaku pencucian terlihat sebagai 15 `orang kecil` yang tidak mencurigakan — lolos dari radar. Untuk INVESTIGASI KRIMINAL, false positive lebih berbahaya (tuduh orang salah). Untuk SURVEILLANCE, false negative lebih berbahaya (penjahat lolos). Tuning heuristik = memilih racunmu.",
        "Trade-off-nya bisa digeser. Heuristik KETAT (gabung hanya jika bukti sangat kuat: common-input + change address + timing): presisi 97%, recall 60% — sedikit tapi akurat (cocok untuk laporan hukum). Heuristik LONGGAR (+ heuristik perilaku: pola jam, nominal): presisi 75%, recall 92% — banyak tapi kotor (cocok untuk triase awal). Aturan: triase BOLEH longgar (recall tinggi, jangan sampai lolos), LAPORAN HARUS ketat (presisi tinggi, jangan sampai fitnah). Dua tahap, dua setting.",
        "Tiga perusak clustering: (1) COINJOIN — banyak orang sengaja belanja bersama untuk MEMATAHKAN heuristik (common-input jadi tidak valid!). Terdeteksi dari: jumlah input besar + output bernominal sama. (2) EXCHANGE — hot wallet menggabungkan ribuan nasabah (cerita `paus Rp4T`). Terdeteksi dari: label + pola deposit/withdrawal. (3) DUSTING — penyerang mengirim recehan ke ribuan address agar terlihat `terhubung`. Terdeteksi dari: nominal sangat kecil + satu sumber. Masing-masing butuh filter KHUSUS sebelum clustering — clustering buta = sampah masuk, fitnah keluar.",
        "Contoh perhitungan dampak CoinJoin: 1.000 address, 200 di antaranya pernah ikut CoinJoin. Tanpa filter: heuristik menggabungkan 200 menjadi 15 `super-cluster` palsu (presisi cluster ini ~20%!). Dengan filter CoinJoin (keluarkan transaksi CoinJoin dari heuristik): 200 address tetap terpisah → presisi keseluruhan naik 87,5% → 94%. Satu filter = +6,5pp presisi. Inilah mengapa langkah `Jebakan` (lesson ini) BUKAN opsional — ia menentukan apakah clustering-mu sains atau gosip.",
        "Validasi clustering tanpa ground truth (yang jarang ada): (1) UJI STABILITAS — jalankan dengan 2 heuristik berbeda; cluster yang muncul di keduanya = confidence tinggi. (2) UJI LABEL — cocokkan dengan label publik (exchange, mixer); cluster berisi 2 label exchange berbeda = PASTI salah gabung. (3) UJI AKAL — cluster dengan 12.000 address dan pola deposit/withdrawal = exchange, bukan paus. Tiga uji ini murah dan menangkap 80% kesalahan tanpa butuh ground truth.",
        "Terakhir, DOKUMENTASIKAN asumsi setiap cluster yang kamu laporkan: `cluster C-77 (14 address) digabung via common-input-ownership, presisi estimasi 85%, BUKAN hasil verifikasi identitas`. Satu kalimat ini membedakan analis profesional dari yang asal klaim. Di pengadilan, di depan regulator, di laporan media — cluster tanpa disclaimer asumsi = bom waktu reputasi.",
      ],
      formula: String.raw`\text{Presisi} = \frac{TP}{TP+FP} \quad ; \quad \text{Recall} = \frac{TP}{TP+FN}`,
      formulaNote: "TP = cluster yang benar satu pemilik; FP = salah gabung (dua orang jadi satu); FN = salah pisah (satu orang jadi banyak). Investigasi kriminal: utamakan presisi (jangan fitnah). Surveillance/triase: utamakan recall (jangan sampai lolos).",
      figure: {
        svg: BCD3_DEEP_SVG,
        alt: "Diagram batang presisi: ketat 97% (recall 60%), standar 87,5% (recall 82%), longgar 75% (recall 92%).",
        caption: "Cara membaca: tinggi batang = presisi; label = pasangan presisi/recall tiap setting heuristik. Interpretasi: tidak ada setting yang sempurna — ketat = akurat tapi banyak lolos (laporan hukum), longgar = menangkap banyak tapi kotor (triase awal). Pilih racunmu sesuai tahap.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: triase boleh kotor, laporan harus bersih",
        body: "Dua setting untuk dua tahap: triase awal = longgar (recall 92%, jangan sampai penjahat lolos) — laporan final = ketat (presisi 97%, jangan sampai fitnah). Kesalahan fatal: memakai setting triase untuk laporan hukum, atau setting laporan untuk triase (penjahat lolos semua).",
      },
      reference: "Filter CoinJoin/exchange/dusting SEBELUM clustering. Dokumentasikan asumsi tiap cluster.",
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
        "Common-input ownership: input yang dibelanjakan bersama ≈ milik entitas sama (hipotesis, bukan fakta).",
        "Union-find = implementasi standar; satu tx beracun bisa melebur dua entitas.",
        "Hot wallet, CoinJoin, change address = tiga perusak heuristik — kenali dan kecualikan.",
        "False merge lebih mahal daripada missed merge: saat ragu, jangan gabungkan.",
        "Label butuh sumber + timestamp + dua sumber independen.",
      ],
      next: { label: "BCD4 — Analisis DeFi", href: "/v2/learn/bcd4-defi" },
      quiz: [
        {
          q: "Transaksi UTXO punya input dari address A, B, C. Menurut heuristik common-input…",
          options: [
            { text: "A, B, C pasti milik satu orang", why: "'Pasti' terlalu kuat — ini hipotesis yang bisa salah (mixer, hot wallet)." },
            { text: "A, B, C kemungkinan milik entitas yang sama, karena butuh ketiga private key untuk co-spend", why: "Logika heuristiknya tepat — tetapi tetap hipotesis yang butuh validasi.", correct: true },
            { text: "Tidak bisa disimpulkan apa-apa", why: "Bisa: co-spend adalah sinyal kepemilikan yang kuat, hanya bukan kepastian." },
            { text: "A, B, C pasti milik tiga orang berbeda", why: "Kebalikannya tidak berdasar — justru kemungkinan besar satu entitas." },
          ],
        },
        {
          q: "Cluster 'paus' 120.000 BTC ternyata hot wallet exchange. Kesalahan analisisnya?",
          options: [
            { text: "Heuristiknya salah total", why: "Heuristik bekerja benar secara mekanis — ia menggabungkan yang co-spend." },
            { text: "Menerapkan heuristik tanpa pengecualian label: co-spend di hot wallet = uang ribuan nasabah, bukan satu paus", why: "Label 'exchange' seharusnya mengecualikan cluster ini dari interpretasi paus.", correct: true },
            { text: "Data blockchain tidak akurat", why: "Datanya akurat — interpretasinya yang keliru." },
            { text: "Seharusnya tidak memakai union-find", why: "Union-find bukan masalahnya; tidak adanya lapisan label yang masalah." },
          ],
        },
        {
          q: "Mengapa false merge lebih berbahaya daripada missed merge dalam forensik?",
          options: [
            { text: "Karena mengurangi jumlah cluster", why: "Jumlah cluster bukan metrik kualitas." },
            { text: "False merge menuduh entitas yang salah (mis. memblokir dana orang tak bersalah); missed merge hanya membuat analisis kurang lengkap", why: "Asimetri biaya: tuduhan salah merusak nyawa/reputasi; kelengkapan bisa dikejar belakangan.", correct: true },
            { text: "Karena missed merge tidak pernah terjadi", why: "Missed merge sering terjadi — hanya dampaknya lebih ringan." },
            { text: "Keduanya sama bahayanya", why: "Tidak sama — satu merusak kebenaran, satu mengurangi kelengkapan." },
          ],
        },
        {
          q: "Transaksi dengan 50 input dan 50 output bernilai sama persis. Tindakan clustering yang benar?",
          options: [
            { text: "Gabungkan semua 50 input jadi satu entitas", why: "Itu struktur CoinJoin — justru dirancang untuk mengalahkan heuristik ini." },
            { text: "Tolak penggabungan dan tandai sebagai aktivitas privasi/mixer", why: "Banyak input + output identik = pola pencampuran yang disengaja.", correct: true },
            { text: "Abaikan transaksi ini sepenuhnya", why: "Jangan abaikan — tandai! Ini sinyal risiko yang berharga." },
            { text: "Gabungkan hanya output-nya", why: "Output CoinJoin juga tidak boleh di-cluster — itu inti perlindungannya." },
          ],
        },
        {
          q: "Label 'mixer' pada sebuah address sebaiknya…",
          options: [
            { text: "Dipakai selamanya — sekali mixer tetap mixer", why: "Address bisa berpindah tangan; label tanpa timestamp = bom waktu." },
            { text: "Dicatat sumber + tanggalnya, didukung sumber kedua, dan direview berkala", why: "Provenance + decay + dua sumber independen = label yang bisa dipertanggungjawabkan.", correct: true },
            { text: "Dihapus agar tidak bias", why: "Menghapus intelijen yang valid sama buruknya dengan label kedaluwarsa." },
            { text: "Hanya dipakai jika dari satu sumber terpercaya", why: "Satu sumber = rumor. Butuh dua sumber independen." },
          ],
        },
        {
          q: "Cluster 12.000 address (pola deposit/withdrawal) dilabeli `paus Rp4T` di laporan. Evaluasi TEPAT?",
          options: [
            { text: "Benar — 12.000 address satu cluster = satu paus besar", why: "12.000 address + pola deposit/withdrawal = SIGNATURE exchange, bukan paus. Ini false positive klasik (cerita lesson ini!)." },
            { text: "Salah — pola menunjukkan exchange; klaim `paus` = false positive tanpa uji label", why: "Tepat. Uji label: cocokkan dengan label publik; uji akal: 12.000 address + deposit/withdrawal = exchange. Melaporkan sebagai `paus` = fitnah + analisis salah total.", correct: true },
            { text: "Benar jika heuristiknya common-input-ownership", why: "Heuristiknya benar, tapi exchange MEMANG membelanjakan input bersama (hot wallet) — heuristik valid, kesimpulannya salah. Heuristik butuh filter exchange." },
            { text: "Tidak bisa dinilai tanpa ground truth", why: "Bisa: uji stabilitas + uji label + uji akal menangkap 80% kesalahan tanpa ground truth. `Tidak bisa dinilai` = tidak mau menilai." },
          ],
        },
      ],
    },
  ],
};
