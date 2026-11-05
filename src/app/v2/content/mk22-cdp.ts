import type { V2Lesson } from "../lib/types";

const FIG_IDGRAPH = `<svg viewBox="0 0 560 340" role="img" aria-label="Identity graph: beberapa identifier terhubung ke satu profil pelanggan.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Identity graph: banyak jejak, satu orang</text>
<circle cx="280" cy="170" r="52" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2.5"/>
<text x="280" y="164" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Profil</text>
<text x="280" y="182" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">tunggal</text>
<text x="280" y="200" font-size="9" fill="var(--chart-text)" text-anchor="middle">ID: cust_8841</text>
<circle cx="90" cy="80" r="34" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="90" y="76" font-size="9" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">email</text>
<text x="90" y="90" font-size="8" fill="var(--chart-text)" text-anchor="middle">s***@gmail</text>
<circle cx="470" cy="80" r="34" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="470" y="76" font-size="9" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">telepon</text>
<text x="470" y="90" font-size="8" fill="var(--chart-text)" text-anchor="middle">0812…</text>
<circle cx="90" cy="260" r="34" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="90" y="256" font-size="9" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">cookie</text>
<text x="90" y="270" font-size="8" fill="var(--chart-text)" text-anchor="middle">web ABC</text>
<circle cx="470" cy="260" r="34" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="470" y="256" font-size="9" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">device</text>
<text x="470" y="270" font-size="8" fill="var(--chart-text)" text-anchor="middle">Android</text>
<circle cx="280" cy="52" r="34" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="280" y="48" font-size="9" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">member</text>
<text x="280" y="62" font-size="8" fill="var(--chart-text)" text-anchor="middle">ID toko</text>
<line x1="115" y1="95" x2="235" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="445" y1="95" x2="325" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="115" y1="245" x2="235" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="445" y1="245" x2="325" y2="190" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="280" y1="86" x2="280" y2="118" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="160" y="130" font-size="9" fill="var(--c1)" font-weight="bold">deterministik ✓</text>
<text x="360" y="130" font-size="9" fill="var(--c1)" font-weight="bold">deterministik ✓</text>
<text x="150" y="222" font-size="9" fill="var(--c2)" font-weight="bold">probabilistik ~</text>
<text x="360" y="222" font-size="9" fill="var(--c2)" font-weight="bold">probabilistik ~</text>
<text x="280" y="300" font-size="11" fill="var(--chart-text)" text-anchor="middle">Tanpa graph ini: 5 jejak = 5 &quot;pelanggan&quot; berbeda.</text>
<text x="280" y="318" font-size="10" fill="var(--chart-text)" text-anchor="middle">Dengan graph: 1 pelanggan dikenali di semua sentuhan.</text>
</g>
</svg>`;

export const mk22: V2Lesson = {
  slug: "mk22-cdp",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK22 — CDP & Identity Resolution: Mengenali Pelanggan Tanpa Cookie",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Ibu Ratna yang menerima tiga promo berbeda — untuk dirinya sendiri",
      prose: [
        "Ibu Ratna pelanggan setia sebuah retail elektronik. Ia belanja via website (login dengan email), via aplikasi (login dengan nomor HP), dan di toko fisik (member dengan KTP). Bulan lalu ia menerima TIGA email promo: 'diskon member baru 10%' (dari data web), 'cashback pengguna aplikasi' (dari data app), dan 'promo pelanggan setia' (dari data toko) — ketiganya untuk orang yang sama, dengan tiga besaran diskon berbeda. Ia memakai yang terbesar, lalu komplain ke CS: 'Saya pelanggan 5 tahun, kenapa ditawari promo member baru?'",
        "Twist-nya: perusahaan itu TIDAK kekurangan data — ia kelebihan data yang tidak saling kenal. Web, app, dan POS masing-masing menyimpan 'Ibu Ratna' sebagai orang berbeda. Biaya nyatanya: diskon ganda Rp180 juta/bulan untuk pelanggan yang sama, kampanye winback yang dikirim ke pelanggan AKTIF (mereka tersinggung: 'saya tidak pernah pergi!'), dan lookalike audience yang dilatih dari 'tiga orang' yang sebenarnya satu. Lesson ini tentang CDP (Customer Data Platform) dan identity resolution: cara mengenali satu manusia di balik banyak jejak — fondasi yang membuat semua analisis (segmentasi, CLV, churn, atribusi) menjadi benar. Ringkas fondasi segmentasi (agar lesson mandiri): segmentasi adalah pengelompokan pelanggan berdasar perilaku/nilai — misal RFM (Recency, Frequency, Monetary) memisahkan 'champion' dari 'at risk'; segmentasi yang baik membuat pesan tepat sasaran. Masalahnya: segmentasi hanya seakurat IDENTITAS di balik datanya — bila satu orang tercatat sebagai tiga pelanggan, ia masuk tiga segmen sekaligus dan seluruh analisis runtuh. CDP memperbaiki lapisan identitas SEBELUM segmentasi bekerja.",
      ],
      tasks: [],
      note: {
        title: "Konteks bisnis",
        type: "risk",
        body: "Biaya identitas yang rusak itu konkret: diskon ganda, frekuensi email berlebih (unsubscribe), dan model lookalike yang dilatih dari data duplikat. CDP bukan proyek IT — ia proyek PENGHEMATAN yang bisa dihitung rupiahnya.",
      },
      reference: "Banyak jejak ≠ banyak pelanggan. CDP = satu kebenaran identitas.",
    },
    {
      id: "cdp-definisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "CDP vs DMP vs CRM: tiga huruf yang sering tertukar",
      prose: [
        "CRM menyimpan data pelanggan yang DIKENAL lewat interaksi langsung (sales, CS) — biasanya B2B, fokus pada akun dan pipeline. DMP (Data Management Platform) menyimpan data ANONIM pihak ketiga (cookie pool) untuk targeting iklan — dan sedang sekarat bersama cookie. CDP berbeda dari keduanya: ia mengumpulkan data pihak PERTAMA dari SEMUA sumber (web, app, POS, CS, email), MENYATUKANNYA ke profil pelanggan persisten, dan MENYALURKANNYA kembali ke semua alat (email, ads, personalisasi).",
        "Tiga ciri yang membuat sesuatu layak disebut CDP: satu — ingest multi-sumber (bukan hanya satu channel). Dua — identity resolution bawaan (menyatukan profil, bukan sekadar menampung). Tiga — aktivasi dua arah (profil yang sudah menyatu bisa dikirim ke Meta/Google Ads sebagai audience, ke ESP sebagai segmen — bukan gudang buntu). Produk yang hanya menampung data tanpa menyatukan identitas = data lake berdandan CDP.",
        "Kepribadian konsep ini: CRM adalah 'buku telepon', DMP adalah 'daftar orang asing di papan iklan', CDP adalah 'resepsionis hotel yang mengenali tamu' — tamu yang check-in via web, memesan spa via app, dan makan di restoran tetap dikenali sebagai satu tamu dengan satu preferensi. Resepsionis yang baik tidak bertanya 'sudah pernah menginap?' tiga kali.",
        "🚨 Mitos: 'Kita sudah punya data warehouse — itu sama dengan CDP.' Yang benar: warehouse menyimpan data untuk ANALISIS (query lambat, batch); CDP menyimpan profil untuk AKTIVASI (API real-time ke alat marketing). Keduanya bisa berbagi data, tetapi fungsinya berbeda — warehouse menjawab 'berapa?', CDP menjawab 'siapa, dan kirim ke mana sekarang?'.",
        "🚨 Mitos: 'CDP hanya untuk perusahaan raksasa.' Yang benar: masalah identitas muncul saat channel KEDUA ditambahkan — artinya UKM omnichannel (web + toko + WA) sudah butuh, hanya skalanya lebih kecil. CDP composable modern bahkan bisa dibangun di atas warehouse yang ada.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membeli lisensi CDP sebelum merapikan sumber data. CDP tidak menyulap data sampah jadi emas — email yang tidak pernah divalidasi tetap tidak bisa di-match. Urutan yang benar: rapikan capture identitas (wajibkan email/HP di checkout) → baru CDP. 'Sampah masuk, profil sampah keluar.'",
      },
      reference: "CRM = akun; DMP = anonim sekarat; CDP = pihak pertama + identitas + aktivasi.",
    },
    {
      id: "identity-resolution",
      eyebrow: "Langkah 3 · Konsep",
      title: "Identity resolution: deterministik vs probabilistik",
      prose: [
        "Identity resolution adalah proses memutuskan 'jejak A dan jejak B milik orang yang sama'. Ada dua cara. Deterministik: cocok berdasar identifier PERSIS yang sama — email yang sama di web dan app, nomor HP yang sama di POS dan CS. Akurat (~100% presisi), tetapi cakupannya terbatas: hanya untuk jejak yang login/memberi data.",
        "Probabilistik: cocok berdasar POLA — device, IP, perilaku browsing, waktu — yang 'kemungkinan besar' satu orang, dengan skor keyakinan (misal 0,85). Cakupannya luas (termasuk pengunjung anonim), tetapi ada false positive: dua orang sekantor dengan IP sama bisa digabung keliru. Inilah wilayah abu-abu yang butuh kebijakan: threshold berapa yang diterima? (0,9 untuk kirim promo sensitif; 0,7 cukup untuk analisis agregat.)",
        "Hasilnya disimpan sebagai identity graph: simpul = identifier (email, cookie, device_id), sisi = relasi 'milik orang yang sama' dengan tipe (deterministik/probabilistik) dan skornya. Satu profil pelanggan = satu connected component dalam graph. Saat cookie mati (tracking server-side memindahkan pengiriman event dari browser ke server brand — cookie pihak ketiga tidak lagi dilibatkan, tetapi match rate turun untuk identifier lemah), sisi probabilistik berbasis cookie melemah — dan nilai identifier deterministik (email/HP ter-hash) MELONJAK. Inilah alasan strategi 'kumpulkan first-party data' menjadi krusial.",
        "Catatan batas: lesson ini membahas identity resolution dari sudut BISNIS dan data — kebijakan matching, threshold, dan tata kelola. Teknik retrieval/embedding skala raksasa (misal arsitektur two-tower) adalah wilayah ML engineering dan tidak dibahas di sini.",
        "🚨 Mitos: 'Probabilistik 0,85 berarti 85% benar untuk setiap orang.' Yang benar: skor adalah keyakinan model per pasangan — dan false positive-nya berkorelasi (satu kantor bisa salah massal). Jangan pakai matching probabilistik untuk keputusan sensitif (penagihan, verifikasi identitas).",
      ],
      tasks: [],
      formula: String.raw`\text{Profil} = \bigcup \text{identifier} \;\; \text{dengan} \;\; P(\text{sama}) \geq \tau`,
      formulaNote: "Profil = gabungan (union) semua identifier; P(sama) = probabilitas dua jejak milik orang yang sama; τ (tau) = threshold keyakinan yang ditetapkan bisnis. Interpretasi: profil terbentuk dari semua identifier yang keyakinan kecocokannya melewati ambang. Contoh: τ = 0,9 untuk promo (ketat, sedikit false positive), τ = 0,7 untuk analisis (longgar, cakupan luas). Threshold adalah KEPUTUSAN BISNIS, bukan konstanta alam — naikkan τ bila false positive mahal, turunkan bila coverage lebih penting.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji cepat kualitas identity graph: ambil 100 profil acak, cek manual 10 — berapa yang benar-benar satu orang? Bila di bawah 9, threshold probabilistikmu terlalu longgar ATAU data deterministikmu kotor. Audit kuartalan ini memakan 2 jam dan menyelamatkan jutaan rupiah promo salah sasaran.",
      },
      reference: "Deterministik = presisi; probabilistik = cakupan + threshold bisnis.",
    },
    {
      id: "cookieless",
      eyebrow: "Langkah 4 · Konsep",
      title: "Identitas tanpa cookie: first-party data & clean room",
      prose: [
        "Cookie mati, tetapi identitas tidak harus mati — ia hanya pindah rumah: dari pelacakan diam-diam ke data yang DIBERIKAN pelanggan. Hierarki nilai first-party data: email/HP terverifikasi (terbaik — deterministik lintas device), login/member ID (kuat di ekosistem sendiri), riwayat transaksi (kaya untuk CLV/churn), preferensi yang dinyatakan (quiz/kuesioner — emas untuk personalisasi). Strategi pengumpulannya: insentif yang wajar (diskon member, bukan 'isi data untuk hadiah iPhone'), dan value exchange yang jelas ('login untuk lacak pesanan').",
        "Hashed email adalah jembatan ke dunia iklan: email di-hash (SHA-256) lalu dicocokkan dengan pengguna Meta/Google TANPA mengirim plaintext — inilah yang menggerakkan CAPI dan Enhanced Conversions. Satu email ter-hash yang konsisten di web, app, dan POS = satu orang yang dikenali di SEMUA platform iklan, tanpa cookie sama sekali.",
        "Data clean room adalah level berikutnya: dua pihak (misal retail + bank) mencocokkan data pelanggan BERSAMA tanpa saling melihat data mentah — enkripsi + agregat. Hasilnya: 'berapa nasabah bank X yang belanja di tokoku?' terjawab tanpa pertukaran PII. Use case klasik: measurement dan audience overlap di era privasi.",
        "🚨 Mitos: 'Tanpa cookie kita kembali ke era gelap tanpa personalisasi.' Yang benar: personalisasi berbasis first-party (riwayat belanja, preferensi) justru LEBIH akurat dari cookie — cookie menebak dari browsing, first-party tahu dari pembelian. Yang mati adalah personalisasi untuk ORANG ASING, bukan untuk pelangganmu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "UU PDP Indonesia: pengumpulan first-party data butuh CONSENT yang jelas dan tujuan yang dinyatakan. 'Centang otomatis' bukan consent. CDP yang baik mencatat consent per tujuan (marketing vs analitik) per pelanggan — dan menghormatinya di aktivasi. Pelanggaran = denda + kehilangan kepercayaan yang tidak bisa dibeli kembali.",
      },
      reference: "Email ter-hash = identitas cookieless; clean room = kolaborasi tanpa PII.",
    },
    {
      id: "figure-graph",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca identity graph",
      prose: [
        "Diagram menunjukkan satu pelanggan (cust_8841) dengan lima identifier: email, telepon, member ID (deterministik — garis berlabel ✓), serta cookie web dan device Android (probabilistik — garis berlabel ~). Tanpa graph, sistem melihat 5 'pelanggan'; dengan graph, 1 pelanggan dengan 5 jejak.",
        "Perhatikan perbedaan garisnya: deterministik menghubungkan dengan keyakinan penuh (email yang sama = orang yang sama, hampir pasti). Probabilistik menghubungkan dengan keyakinan parsial — cookie web ABC 'kemungkinan' milik pemilik email ini berdasar pola login. Saat cookie dihapus pengguna, sisi probabilistik putus — tetapi profil TETAP utuh karena tiga sisi deterministik masih memegangnya. Inilah ketahanan identitas first-party.",
      ],
      figure: {
        svg: FIG_IDGRAPH,
        alt: "Identity graph: beberapa identifier terhubung ke satu profil pelanggan.",
        caption: "Cara membaca: lingkaran tengah = profil tunggal; lingkaran luar = identifier; garis ✓ = cocok deterministik (pasti), garis ~ = probabilistik (skor keyakinan). Interpretasi: profil bertahan selama minimal satu sisi deterministik utuh — hapus cookie (sisi ~ putus), pelanggan tetap dikenali via email/telepon/member. Inilah mengapa first-party data adalah fondasi identitas pasca-cookie.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Tanya ke tim datamu: 'berapa persen profil pelanggan kita yang punya minimal SATU identifier deterministik?' Bila di bawah 40%, identity graph-mu rapuh — prioritas tahun ini adalah menaikkan angka itu (program member, insentif login), bukan membeli alat baru.",
      },
      reference: "Profil utuh = minimal satu sisi deterministik bertahan.",
    },
    {
      id: "lab-match",
      eyebrow: "Langkah 6 · Lab",
      title: "Menyatukan profil: matching deterministik",
      prose: [
        "Diberikan tiga sumber: web (email), app (telepon), POS (member_id + email/telepon). Tugasmu: bangun identity graph sederhana — gabungkan baris yang berbagi email ATAU telepon yang sama (deterministik), beri ID profil tunggal, lalu hitung: berapa 'pelanggan' menurut tiap sumber vs menurut graph, dan berapa rupiah diskon ganda yang dihindari (asumsi tiap duplikat menerima promo Rp50rb yang seharusnya sekali).",
        "Hasil yang benar: 9 baris sumber → 4 profil unik; 5 duplikat × Rp50rb = Rp250rb dihindari DALAM sampel kecil ini. Skalakan ke 1 juta baris dan kamu paham mengapa CDP adalah proyek penghematan. Eksplorasi: tambah aturan probabilistik sederhana (nama sama + kota sama → gabung dengan flag 'review') — berapa profil sekarang, dan mengapa flag review penting?",
      ],
      tasks: [
        { id: "t1", text: "Gabungkan baris dgn email/telepon sama → petakan ke ID profil" },
        { id: "t2", text: "Hitung profil unik & rupiah diskon ganda yg dihindari, cetak" },
      ],
      expected: "baris=9 profil=4 duplikat=5 hemat=Rp250000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Matching hanya pada SATU kunci (misal email saja). Baris POS yang hanya punya telepon + member_id tidak akan tergabung — padahal teleponnya sama dengan baris app. Aturan union (email ATAU telepon) menangkap 30-40% lebih banyak duplikat dibanding kunci tunggal.",
      },
      hints: [
        "Gunakan union-find sederhana atau: petakan tiap email/telepon → id grup, gabungkan grup yang berbagi kunci.",
        "Cara mudah: dict kunci→profil; untuk tiap baris, cari profil dari email-nya atau telepon-nya; bila keduanya menunjuk profil beda → gabungkan.",
        "duplikat = baris − profil; hemat = duplikat × 50000.",
      ],
      code: {
        starter: "# Tiga sumber: (sumber, email, telepon). None = tidak ada. JANGAN UBAH.\nbaris = [\n    (\"web\", \"ratna@gmail.com\", None),\n    (\"app\", None, \"0812\"),\n    (\"pos\", \"ratna@gmail.com\", \"0812\"),\n    (\"web\", \"budi@yahoo.com\", None),\n    (\"app\", None, \"0819\"),\n    (\"pos\", \"budi@yahoo.com\", \"0819\"),\n    (\"web\", \"sinta@gmail.com\", None),\n    (\"app\", \"sinta@gmail.com\", None),\n    (\"pos\", None, \"0821\"),\n]\n\n# TULIS KODEMU: identity resolution deterministik (email ATAU telepon sama)\nparent = {}\ndef find(x):\n    parent.setdefault(x, x)\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\ndef union(a, b):\n    parent[find(a)] = find(b)\n\nkunci_id = {}\nfor i, (src, email, telp) in enumerate(baris):\n    node = f\"r{i}\"\n    for k in (email, telp):\n        if k is None:\n            continue\n        if k in kunci_id:\n            union(node, kunci_id[k])\n        kunci_id[k] = node\n\nprofil = {find(f\"r{i}\") for i in range(len(baris))}\nduplikat = len(baris) - len(profil)\nprint(f\"baris={len(baris)} profil={len(profil)} duplikat={duplikat} hemat=Rp{duplikat*50000}\")\n",
        lockLines: 22,
        solution: "# Tiga sumber: (sumber, email, telepon). None = tidak ada. JANGAN UBAH.\nbaris = [\n    (\"web\", \"ratna@gmail.com\", None),\n    (\"app\", None, \"0812\"),\n    (\"pos\", \"ratna@gmail.com\", \"0812\"),\n    (\"web\", \"budi@yahoo.com\", None),\n    (\"app\", None, \"0819\"),\n    (\"pos\", \"budi@yahoo.com\", \"0819\"),\n    (\"web\", \"sinta@gmail.com\", None),\n    (\"app\", \"sinta@gmail.com\", None),\n    (\"pos\", None, \"0821\"),\n]\n\n# TULIS KODEMU: identity resolution deterministik (email ATAU telepon sama)\nparent = {}\ndef find(x):\n    parent.setdefault(x, x)\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\ndef union(a, b):\n    parent[find(a)] = find(b)\n\nkunci_id = {}\nfor i, (src, email, telp) in enumerate(baris):\n    node = f\"r{i}\"\n    for k in (email, telp):\n        if k is None:\n            continue\n        if k in kunci_id:\n            union(node, kunci_id[k])\n        kunci_id[k] = node\n\nprofil = {find(f\"r{i}\") for i in range(len(baris))}\nduplikat = len(baris) - len(profil)\nprint(f\"baris={len(baris)} profil={len(profil)} duplikat={duplikat} hemat=Rp{duplikat*50000}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "baris=9 profil=4", msg: "9 baris sumber menyatu menjadi 4 profil.", pattern: "baris=9 profil=4" },
          { kind: "stdout_matches", task: "t2", label: "duplikat=5 hemat=Rp250000", msg: "5 duplikat × Rp50rb = Rp250rb dihindari.", pattern: "duplikat=5 hemat=Rp250000" },
        ],
      },
      reference: "Union-find atas kunci email/telepon: 9 baris → 5 profil.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Membangun identitas: mulai dari mana",
      prose: [
        "Skenario satu — baru 1-2 channel, data berantakan: JANGAN beli CDP dulu. Rapikan capture identitas (email/HP wajib di checkout, validasi format), bangun matching deterministik sederhana seperti lab. 80% manfaat dengan 20% biaya.",
        "Skenario dua — omnichannel (web+app+POS+WA) dengan duplikat nyata: adopsi CDP (atau bangun composable di atas warehouse). Hitung business case dari diskon ganda + unsubscribe + efisiensi ads — seperti lab, skalakan ke volume riil.",
        "Skenario tiga — butuh kenali pengunjung anonim untuk personalisasi: tambah sisi probabilistik DENGAN threshold eksplisit (τ tinggi untuk promo, longgar untuk analisis) + audit manual kuartalan. Jangan kirim promo sensitif dari match probabilistik.",
        "Skenario empat — kolaborasi data dengan partner (bank, marketplace): pakai data clean room — cocokkan tanpa bertukar PII mentah. Tetap butuh consent dan perjanjian pengolahan data (UU PDP).",
        "Skenario lima — tim kecil tanpa engineer data: pakai CDP SaaS dengan konektor bawaan (Segment, dst.) + fokus pada SATU identifier (email). Satu kunci yang konsisten mengalahkan lima kunci yang berantakan.",
        "Aturan praktis 10 detik: (1) berapa % profil punya identifier deterministik? (<40% → perbaiki capture dulu); (2) di mana duplikat paling mahal? (promo → CDP segera); (3) apakah consent tercatat per tujuan? (tidak → bereskan legal dulu).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengukur sukses CDP dari 'jumlah profil'. Metrik yang benar: % profil dengan identifier deterministik, % duplikat terresolve, dan RUPIAH yang dihemat (diskon ganda, ads waste). Profil yang banyak tetapi tidak dikenali = vanity metric.",
      },
      reference: "Rapikan dulu → CDP bila omnichannel → probabilistik dgn threshold → clean room utk kolaborasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Business case CDP dalam satu halaman",
      prose: [
        "Retail 'TokoMaju': 1,2 juta 'pelanggan' di database gabungan (web 500rb, app 400rb, POS 300rb). Audit sampel 10.000 baris menemukan 31% duplikat antar sumber. Estimasi tahunan: diskon ganda Rp2,1 miliar, email berlebih → unsubscribe 8% list (penggantian list cost Rp640 juta), ads lookalike dari audience duplikat → waste ~Rp900 juta. Total biaya identitas rusak: ~Rp3,6 miliar/tahun. Penawaran CDP SaaS: Rp1,8 miliar/tahun (lisensi + implementasi).",
        "Pertanyaan: (a) perkirakan jumlah pelanggan UNIK sebenarnya; (b) apakah CDP layak secara finansial? Pembahasan: (a) 1,2 juta × (1 − 0,31) ≈ 828rb pelanggan unik — database '1,2 juta' melebih-lebihkan 45%! (b) Ya: Rp3,6 miliar biaya masalah vs Rp1,8 miliar biaya solusi = payback < 1 tahun, BELUM termasuk manfaat sisi pendapatan (personalisasi → conversion +, winback yang tepat sasaran). Syarat keberhasilannya: program menaikkan % identifier deterministik (target 70% dalam setahun) — tanpa itu CDP hanya memindahkan sampah ke tempat yang lebih mahal. Pelajaran: business case CDP ditulis dalam rupiah yang DIHEMAT, bukan dalam 'profil yang disatukan'.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Template business case satu halaman: (1) % duplikat dari audit sampel; (2) biaya tahunan = diskon ganda + churn list + ads waste; (3) biaya CDP; (4) payback. Empat angka ini mengalahkan 40 slide arsitektur di depan direksi.",
      },
      reference: "CDP = proyek penghematan: biaya masalah vs biaya solusi.",
    },
    {
      id: "adv-composable",
      eyebrow: "Langkah 9 · Arsitektur advanced",
      title: "CDP composable: membangun di atas warehouse",
      prose: [
        "CDP klasik (packaged) menyimpan salinan datanya sendiri — artinya datamu tinggal di DUA tempat (warehouse + CDP) yang bisa berbeda isinya. CDP composable membalik arsitektur: warehouse tetap satu-satunya sumber kebenaran; identity resolution berjalan DI ATAS warehouse (dbt/SQL atau alat matching), dan hasilnya DIKIRIM ke alat marketing via reverse ETL (Census, Hightouch) — 'kirim segmen dari warehouse ke Meta/ESP', kebalikan dari ETL biasa.",
        "Trade-off-nya nyata. Composable: tidak ada duplikasi data, definisi segmen konsisten dengan analisis (satu SQL = satu kebenaran), biaya lisensi lebih rendah. Harganya: latensi (sinkronisasi batch per jam/harian — bukan real-time milidetik) dan butuh tim yang bisa SQL/dbt. Packaged: real-time API, UI ramah non-teknis — tetapi data ganda dan definisi segmen bisa menyimpang dari warehouse.",
        "Aturan pilih: butuh personalisasi real-time di website (milidetik) → packaged. Kebutuhanmu segmen harian untuk ads/email + tim SQL kuat → composable menang telak. Dan jebakan terbesar composable: reverse ETL yang mengirim segmen TANPA menghormati consent per tujuan yang tercatat di warehouse — pastikan kolom consent ikut tersinkron, bukan hanya segmennya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bedanya CDP composable vs packaged dalam satu kalimat?",
          options: [
            { text: "Composable: warehouse = satu sumber kebenaran, segmen dikirim via reverse ETL; packaged: CDP menyimpan salinan datanya sendiri", why: "Inilah pembeda arsitektur: satu kebenaran vs data ganda.", correct: true },
            { text: "Composable lebih mahal lisensinya", why: "Terbalik — composable umumnya lebih murah, memakai warehouse yang ada." },
            { text: "Packaged tidak butuh data sama sekali", why: "Packaged tetap butuh ingest data — hanya disimpan di tempatnya sendiri." },
            { text: "Keduanya identik, hanya istilah vendor", why: "Perbedaan sumber kebenaran dan latensi adalah nyata." },
          ],
        },
        {
          q: "Jebakan terbesar reverse ETL pada CDP composable?",
          options: [
            { text: "Mengirim segmen ke ads/ESP tanpa menyertakan status consent per tujuan dari warehouse", why: "Segmen tanpa consent = aktivasi ilegal; kolom consent wajib ikut tersinkron (UU PDP).", correct: true },
            { text: "Query SQL terlalu cepat", why: "Bukan masalah — latensi batch memang trade-off yang diterima." },
            { text: "Warehouse menjadi terlalu akurat", why: "Tidak masuk akal sebagai jebakan." },
            { text: "Biaya lisensi membengkak", why: "Composable justru menekan biaya lisensi." },
          ],
        },
      ],
      reference: "Satu warehouse = satu kebenaran; reverse ETL kirim segmen + consent.",
    },
    {
      id: "intuisi-pengakuan",
      eyebrow: "Langkah 10 · Intuisi",
      title: "CDP bukan soal data — ia soal pengakuan",
      prose: [
        "Dari Ibu Ratna yang menerima tiga promo hingga business case Rp3,6 miliar — intinya satu: kenali manusia sebelum menyapanya. Tiga heuristiknya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: perusahaan tidak kekurangan data — ia kekurangan pengakuan",
        body: "Heuristik pertama: setiap 'pelanggan baru' di datamu adalah tersangka duplikat sampai terbukti bukan. Database yang tumbuh 20%/tahun tanpa identity resolution bukan tumbuh — ia menggelembung. Tanyakan tiap kuartal: dari 1,2 juta 'pelanggan', berapa manusia? Jawabannya menentukan seluruh budget promomu jujur atau fiktif. Heuristik kedua: identitas deterministik adalah aset, bukan kolom. Email terverifikasi, nomor HP, member ID — setiap identifier deterministik yang kamu kumpulkan hari ini adalah profil yang tetap utuh saat cookie mati, saat ATT mengetat, saat regulasi berubah. Program member bukan 'program loyalitas' — ia program KELANGSUNGAN identitas. Investasi terbaik CDP bukan lisensinya, melainkan insentif agar pelanggan mau dikenali. Heuristik ketiga: ukur rupiah, bukan profil. 'Kami menyatukan 800rb profil' tidak menggerakkan direksi; 'kami menghemat Rp3,6 miliar diskon ganda per tahun' menggerakkan segalanya. CDP adalah proyek penghematan yang menyamar sebagai proyek data — tulis business case-nya dalam bahasa itu, dan ia akan didanai. Kenali dulu, baru sapa — urutan ini tidak pernah terbalik.",
      },
      reference: "Curigai pertumbuhan database; kumpulkan identifier; ukur rupiah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "CDP = platform data pihak pertama multi-sumber + identity resolution + aktivasi dua arah; beda dari CRM (akun B2B) dan DMP (anonim sekarat); warehouse untuk analisis, CDP untuk aktivasi real-time.",
        "Identity resolution: deterministik (identifier sama persis — presisi ~100%, cakupan terbatas) vs probabilistik (pola + skor keyakinan — cakupan luas, butuh threshold τ sebagai keputusan bisnis); hasilnya = identity graph.",
        "Pasca-cookie: identitas pindah ke first-party data (email/HP ter-hash SHA-256 sebagai jembatan ke Meta/Google), clean room untuk kolaborasi tanpa PII; consent per tujuan wajib (UU PDP).",
        "Fondasi: segmentasi (misal RFM) hanya seakurat identitas di baliknya — satu orang di tiga segmen = analisis runtuh; rapikan identitas SEBELUM segmentasi bekerja.",
        "Keputusan: rapikan capture dulu (<40% deterministik = belum siap CDP mahal); business case dalam rupiah dihemat (diskon ganda + ads waste vs biaya CDP); metrik sukses = % deterministik & rupiah, bukan jumlah profil.",
        "Arsitektur: composable (warehouse = kebenaran, reverse ETL) vs packaged (real-time, data ganda) — pilih sesuai latensi dan tim.",
      ],
      next: { label: "MK23 — SQL untuk Marketing Data", href: "/learn/mk23-sql-marketing" },
      quiz: [
        {
          q: "Perbedaan PALING mendasar CDP vs data warehouse:",
          options: [
            { text: "CDP untuk aktivasi real-time (kirim audience ke ads/ESP); warehouse untuk analisis batch", why: "Benar: 'berapa?' vs 'siapa, kirim ke mana sekarang?' — fungsi berbeda, bisa saling melengkapi.", correct: true },
            { text: "Warehouse lebih mahal sehingga hanya untuk korporat", why: "Harga bukan pembeda fungsi; banyak warehouse murah." },
            { text: "CDP tidak menyimpan data historis sama sekali", why: "CDP menyimpan profil persisten — justru butuh histori." },
            { text: "Keduanya identik, hanya istilah marketing berbeda", why: "Fungsi aktivasi real-time + identity resolution bawaan adalah pembeda nyata." },
          ],
        },
        {
          q: "Kapan matching PROBABILISTIK boleh dipakai untuk mengirim promo diskon?",
          options: [
            { text: "Tidak untuk promo sensitif — hanya untuk analisis agregat atau dengan threshold τ sangat tinggi + audit", why: "Benar: false positive berkorelasi; kirim promo ke orang yang salah = biaya + reputasi.", correct: true },
            { text: "Selalu boleh — skor 0,7 sudah cukup untuk semua keperluan", why: "0,7 untuk analisis boleh; untuk promo sensitif terlalu longgar." },
            { text: "Tidak pernah — probabilistik tidak ada gunanya sama sekali", why: "Berlebihan: untuk analisis agregat dan jangkauan anonim ia berguna." },
            { text: "Hanya bila deterministik 100% gagal total", why: "Keduanya bisa dipakai paralel dengan threshold berbeda per kegunaan." },
          ],
        },
        {
          q: "Di lab, 9 baris dari 3 sumber menjadi 5 profil. Apa implikasi bisnisnya bila diabaikan?",
          options: [
            { text: "Diskon/promo ganda, satu orang di banyak segmen, lookalike dilatih dari data duplikat", why: "Benar: tiga biaya konkret identitas rusak — persis kasus Ibu Ratna.", correct: true },
            { text: "Tidak ada — 9 baris tetap 9 pelanggan yang valid", why: "Itulah ilusinya: 9 baris = 5 manusia." },
            { text: "Hanya masalah kerapian laporan, tanpa biaya", why: "Lab menghitung hemat Rp200rb dari 9 baris — biayanya nyata." },
            { text: "Solusinya menghapus semua data duplikat permanen", why: "Jangan hapus — satukan via graph; data historis tiap sumber tetap berharga." },
          ],
        },
        {
          q: "Perusahaan baru 2 channel (web + WA) dengan data berantakan. Langkah pertama yang tepat?",
          options: [
            { text: "Rapikan capture identitas (email/HP wajib + validasi) dan matching deterministik sederhana — bukan beli CDP", why: "Benar: 80% manfaat dengan 20% biaya; CDP di atas data sampah = sampah mahal.", correct: true },
            { text: "Langsung beli CDP termahal agar future-proof", why: "Future-proof di atas fondasi rusak = membuang uang." },
            { text: "Beli data pihak ketiga untuk melengkapi profil", why: "Cookie/DMP sekarat; fokus ke first-party yang dikumpulkan sendiri." },
            { text: "Tunggu sampai 5 channel baru pikirkan identitas", why: "Masalah muncul di channel kedua — menunda = menumpuk utang data." },
          ],
        },
        {
          q: "Mengapa email ter-hash (SHA-256) menjadi kunci identitas pasca-cookie?",
          options: [
            { text: "Deterministik lintas device tanpa cookie, bisa dicocokkan Meta/Google tanpa kirim plaintext", why: "Benar: satu email konsisten = satu orang dikenali di semua platform iklan — jembatan CAPI/Enhanced Conversions.", correct: true },
            { text: "Karena hash tidak bisa dibalik sehingga tidak butuh consent", why: "Salah berbahaya: consent tetap wajib; hash bukan izin." },
            { text: "Karena email lebih murah daripada cookie", why: "Bukan soal harga — soal ketahanan dan determinisme." },
            { text: "Karena semua pengguna pasti punya email yang sama di semua platform", why: "Tidak selalu sama — itu sebabnya ada identity resolution untuk menautkannya." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Keluar dari lesson ini dan langsung pitching CDP ke atasan. Urutan yang benar: (1) audit sampel 10.000 baris hitung % duplikat (2 jam kerja, seperti lab); (2) hitung rupiah biaya masalah; (3) BARU ajukan solusi. Data mengalahkan slide.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa '1,2 juta pelanggan' bisa berarti 828rb manusia — dan kenapa itu kabar buruk untuk budget promo.",
        "Ingat rumus profil: gabungan identifier dengan P(sama) ≥ τ — threshold adalah keputusan bisnis.",
      ],
      reference: "Kenali dulu (identitas), baru sapa (segmentasi & aktivasi).",
    },
  ],
};
