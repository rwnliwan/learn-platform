import type { V2Lesson } from "../lib/types";

const FIG_JARINGAN = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram jaringan transfer: siklus B-C-D dan fan-in ke rekening F.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Jejak yang tak terlihat transaksi per transaksi</text>
<circle cx="90" cy="90" r="18" fill="var(--c2)" opacity="0.35" stroke="var(--c2)" stroke-width="2"/>
<text x="90" y="95" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">A</text>
<circle cx="200" cy="70" r="18" fill="var(--c1)" opacity="0.35" stroke="var(--c1)" stroke-width="2"/>
<text x="200" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">B</text>
<circle cx="310" cy="70" r="18" fill="var(--c1)" opacity="0.35" stroke="var(--c1)" stroke-width="2"/>
<text x="310" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">C</text>
<circle cx="255" cy="140" r="18" fill="var(--c1)" opacity="0.35" stroke="var(--c1)" stroke-width="2"/>
<text x="255" y="145" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">D</text>
<circle cx="430" cy="150" r="22" fill="var(--c3)" opacity="0.4" stroke="var(--c3)" stroke-width="3"/>
<text x="430" y="156" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">F</text>
<line x1="106" y1="86" x2="184" y2="74" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ar)"/>
<line x1="218" y1="70" x2="292" y2="70" stroke="var(--c1)" stroke-width="2.5" marker-end="url(#ar)"/>
<line x1="302" y1="86" x2="268" y2="124" stroke="var(--c1)" stroke-width="2.5" marker-end="url(#ar)"/>
<line x1="240" y1="130" x2="214" y2="86" stroke="var(--c1)" stroke-width="2.5" marker-end="url(#ar)"/>
<line x1="108" y1="96" x2="408" y2="142" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ar)"/>
<line x1="380" y1="90" x2="420" y2="130" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ar)"/>
<line x1="470" y1="100" x2="444" y2="132" stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ar)"/>
<circle cx="380" cy="80" r="14" fill="var(--chart-text)" opacity="0.15" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="380" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">E</text>
<circle cx="472" cy="90" r="14" fill="var(--chart-text)" opacity="0.15" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="472" y="95" font-size="11" fill="var(--chart-text)" text-anchor="middle">I</text>
<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/></marker></defs>
<text x="255" y="180" font-size="11" fill="var(--c1)" text-anchor="middle" font-weight="bold">Siklus B → C → D → B: dana berputar, bukan berpindah</text>
<text x="430" y="200" font-size="11" fill="var(--c3)" text-anchor="middle" font-weight="bold">F: fan-in dari 4 rekening — titik kumpul (hub)</text>
<text x="260" y="250" font-size="10" fill="var(--chart-text)" text-anchor="middle">Satu transaksi terlihat biasa. Polanya — siklus &amp; fan-in — hanya muncul saat dilihat sebagai graf.</text>
<text x="260" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">Node = rekening, edge = transfer berarah.</text>
</g>
</svg>`;

export const aml25: V2Lesson = {
  slug: "aml25-graph-analytics-laundering",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML25 — Graph Analytics: Memburu Jaringan Pencucian",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp47 miliar mengalir, nol peringatan berbunyi",
      prose: [
        "Sebuah bank menengah menjalankan monitoring transaksi berbasis aturan: setiap transfer di atas ambang tertentu diperiksa, pola mencurigakan seperti 'smurfing' ditandai otomatis. Suatu hari tim audit internal menemukan sesuatu yang membuat ruang rapat hening: dana senilai Rp47 miliar telah mengalir melalui 214 rekening dalam 11 menit — dan sistem monitoring tidak mengeluarkan SATU pun peringatan. Setiap transfer di bawah ambang. Setiap rekening terlihat normal. Tidak ada yang 'salah' — kecuali semuanya.",
        "Twist-nya: kejahatannya tidak ada di transaksi mana pun. Kejahatannya ada di HUBUNGAN antar-transaksi: 214 rekening itu membentuk rantai berputar — dana dikirim A→B→C→D→B→C, berputar tiga kali sebelum mendarat di rekening penampung. Aturan yang memeriksa transaksi satu per satu mustahil melihat putaran; ia seperti memeriksa tiap mobil di jalan tol tanpa pernah melihat peta kemacetannya.",
        "Setelah lesson ini kamu bisa: (1) memodelkan transfer sebagai graf berarah (node = rekening, edge = transfer); (2) mengenali tiga pola layering — rantai, fan-in/fan-out, siklus; (3) menghitung fan-in, fan-out, dan degree centrality untuk menemukan hub; (4) menjelaskan kapan graph analytics mengalahkan rule-based monitoring dan kapan tidak; (5) menulis temuan jaringan dalam bahasa yang bisa dipakai tim investigasi. Ini studi kasus — pola yang dipakai adalah tipologi layering yang didokumentasikan dalam laporan tipologi pencucian uang internasional.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Graph analytics tidak menggantikan analis — ia menggantikan kebutaan analis. Vonis akhir ('ini pencucian uang') tetap butuh investigasi manusia: hub bisa jadi payment gateway yang sah. Graf memberi tahu ke mana harus melihat, bukan apa kesimpulannya.",
      },
      reference: "Kejahatan di hubungan, bukan di transaksi.",
    },
    {
      id: "node-edge",
      eyebrow: "Langkah 2 · Konsep",
      title: "Node, edge, dan peta yang selama ini hilang",
      prose: [
        "Si Peta Kota. Bayangkan data transfer bank sebagai peta kota: setiap rekening adalah sebuah alamat (node), setiap transfer adalah jalan satu arah dari satu alamat ke alamat lain (edge berarah). Tabel transaksi yang biasa kamu lihat — 'A kirim ke B Rp500 ribu' — sebenarnya adalah daftar jalan. Selama ini analis membaca daftar jalan baris per baris; graph analytics menggambar petanya.",
        "Representasi paling praktis untuk analis adalah adjacency list: dictionary yang memetakan tiap rekening ke daftar rekening tujuan transfernya. Contoh: {\"A\": [\"B\", \"F\"], \"B\": [\"C\"]} artinya A mentransfer ke B dan F, B mentransfer ke C. Dari struktur sesederhana ini, seluruh pola pencucian bisa dihitung — tanpa database graf mahal, tanpa tool khusus.",
        "Satu peringatan jujur: graf hanya sebagus datanya. Rekening atas nama orang lain (nominee), data nasabah yang tidak lengkap, atau transfer antar-bank yang tidak terlihat akan membuat peta berlubang. Analis graf yang baik selalu bertanya dulu: 'bagian peta mana yang gelap?' sebelum percaya pada polanya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Edge berarah itu penting: A→B dan B→A adalah dua cerita berbeda. A→B→C→A (dana kembali ke asal) jauh lebih mencurigakan daripada A→B→C (dana mengalir maju) — dan bedanya hanya terlihat kalau arah panah dicatat.",
      },
      reference: "Node = rekening; edge = transfer berarah.",
    },
    {
      id: "pola-layering",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga koreografi layering",
      prose: [
        "Si Koreografer. Pencuci uang bukan memindahkan dana — ia MENGABURKAN asal-usul dana lewat gerakan. Ada tiga koreografi klasik. Pertama, rantai (chain): A→B→C→D→E — dana dilewatkan banyak rekening agar jejak audit terputus; tiap hop menambah 'jarak' dari kejahatan asal.",
        "Kedua, fan-in dan fan-out: fan-in = banyak rekening mengirim ke SATU rekening (E, I, J, A → F) — pola pengumpulan dana hasil kejahatan ke titik penampung; fan-out = satu rekening menyebar ke banyak rekening (E → F, G, H) — pola pemecahan dana agar terlihat kecil-kecil. Ketiga, siklus (cycle): B→C→D→B — dana berputar kembali ke titik awal; tidak ada alasan bisnis yang sah untuk memutar dana dalam lingkaran, sehingga siklus adalah sinyal paling keras di antara ketiganya.",
        "Kenapa tiga pola ini efektif melawan rule-based: aturan memeriksa BESARAN dan FREKUENSI per rekening, sedangkan ketiga pola ini bermain di STRUKTUR. Seratus transfer Rp9 juta dari 100 rekening berbeda ke satu rekening lolos dari aturan 'transfer > Rp10 juta', tetapi membentuk fan-in yang berteriak di graf.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Fan-in besar = pasti pencucian.” Belum tentu: rekening merchant e-commerce atau payment gateway yang sah juga menerima fan-in raksasa setiap hari. Bedakan dengan konteks: fan-in + rekening baru + dana langsung diteruskan (bukan dipakai usaha) = mencurigakan; fan-in + riwayat usaha jelas = bisnis normal.",
      },
      reference: "Rantai mengaburkan, fan-in mengumpulkan, siklus berputar.",
    },
    {
      id: "centrality",
      eyebrow: "Langkah 4 · Konsep",
      title: "Centrality: menemukan dalang di tengah keramaian",
      prose: [
        "Si Detektif Jaringan. Dari ratusan node, mana yang paling penting? Degree centrality menjawab dengan sederhana: hitung total koneksi (masuk + keluar) sebuah rekening, lalu bagi dengan koneksi maksimum yang mungkin. Rekening dengan centrality tertinggi adalah hub — titik yang paling banyak 'disentuh' dana.",
        "Rumus kerja analis — degree centrality:",
      ],
      formula: String.raw`C_D(v) = \frac{deg(v)}{n-1}`,
      formulaNote: "deg(v) = derajat node v, yaitu fan-in(v) + fan-out(v) — jumlah transfer masuk ditambah transfer keluar; n = jumlah total rekening dalam graf; n−1 = koneksi maksimum yang mungkin dimiliki satu rekening (terhubung ke semua rekening lain); C_D(v) = skor 0 sampai 1 — semakin dekat ke 1, semakin sentral rekening itu. Contoh: rekening F dengan derajat 5 dari 11 rekening → C_D = 5/10 = 0,5 — tertinggi di jaringannya, pantas diperiksa pertama.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Centrality tertinggi = penjahatnya.” Centrality mengukur KETERHUBUNGAN, bukan kesalahan. Bendahara perusahaan yang sah juga bisa jadi hub. Centrality adalah alat PRIORITAS investigasi — siapa diperiksa duluan — bukan alat vonis.",
      },
      reference: "Centrality memprioritaskan, bukan memvonis.",
    },
    {
      id: "graph-vs-rule",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kenapa aturan buta struktur",
      prose: [
        "Si Kacamata Baru. Rule-based monitoring bertanya: 'apakah transaksi INI melanggar ambang?' Graph analytics bertanya: 'pola APA yang dibentuk transaksi-transaksi ini bersama-sama?' Itu dua pertanyaan yang berbeda — dan pencuci uang modern merancang serangannya untuk lolos dari pertanyaan pertama.",
        "Cara membaca figur: lingkaran = rekening, panah = arah transfer. Perhatikan tiga hal: (1) segitiga panah B→C→D→B — dana berputar, sinyal layering klasik; (2) rekening F yang besar — empat panah masuk dari rekening berbeda (fan-in), titik kumpul dana; (3) transfer A→B dan A→F yang sendirian terlihat biasa-biasa saja. Interpretasi: tidak satu pun edge di sini melanggar ambang sendirian — tetapi siklus + fan-in bersama-sama membentuk cerita yang tidak bisa dijelaskan oleh bisnis normal.",
        "Batas kejujuran: graph analytics mahal secara komputasi untuk graf raksasa (jutaan node butuh infrastruktur khusus), dan ia butuh data relasi yang lengkap — transfer antar-bank yang tidak terlihat membuat graf terpotong. Praktik terbaik industri: rule-based untuk penyaringan real-time yang murah, graph analytics untuk investigasi mendalam atas kasus yang lolos saringan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pikirkan seperti ini: rule-based adalah satpam yang memeriksa tiap orang di pintu; graph analytics adalah analis CCTV yang menonton pola gerakan kerumunan. Kamu butuh keduanya — tetapi jangan minta satpam melakukan pekerjaan analis CCTV.",
      },
      figure: {
        svg: FIG_JARINGAN,
        alt: "Diagram jaringan transfer dengan siklus B-C-D dan fan-in ke rekening F.",
        caption: "Siklus dan fan-in: dua pola yang hanya terlihat sebagai graf, bukan sebagai daftar transaksi.",
      },
      reference: "Aturan melihat transaksi; graf melihat hubungan.",
    },
    {
      id: "lab-siklus-hub",
      eyebrow: "Langkah 6 · Lab",
      title: "Temukan siklus & rekening hub",
      prose: [
        "Sebelas rekening (A–K) dengan transfer berarah tertanam di adjacency list. Tugasmu: (1) hitung fan-in (transfer masuk) dan fan-out (transfer keluar) tiap rekening; (2) jalankan fungsi temukan_siklus yang sudah disediakan untuk menemukan putaran dana; (3) tentukan hub — rekening dengan derajat (fan-in + fan-out) tertinggi.",
        "Hasil yang benar: fan-in F = 4 (dari E, I, J, A); fan-out E = 3 (ke F, G, H); hub = F (derajat 5); satu siklus: B → C → D → B. Narasi investigasi yang bisa ditulis analis: 'Ditemukan siklus transfer B-C-D-B yang mengindikasikan layering, serta rekening F sebagai titik kumpul (fan-in dari 4 rekening, derajat tertinggi 5). Rekomendasi: prioritaskan pendalaman atas F dan pemilik rekening B, C, D.'",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fan_in` dan `fan_out` tiap rekening dari adjacency list" },
        { id: "t2", text: "Temukan siklus transfer dengan `temukan_siklus(adj)`" },
        { id: "t3", text: "Tentukan `hub` (derajat tertinggi) dan cetak temuan" },
      ],
      expected: "fan_in F: 4\nfan_out E: 3\nhub: F\nsiklus: [['B', 'C', 'D']]",
      note: {
        title: "💡 Intuisi",
        body: "Fungsi temukan_siklus memakai depth-first search: ia menelusuri tiap jalur dan mencatat saat kembali ke node yang sedang dikunjungi. Itulah definisi siklus — jalan yang kembali ke titik awalnya. Algoritmanya sederhana; kekuatannya ada pada representasi datanya.",
      },
      hints: [
        "fan_in[d] bertambah 1 untuk tiap edge src → d; fan_out[n] = len(adj[n]).",
        "derajat[n] = fan_in[n] + fan_out[n]; hub = max dengan key derajat.",
        "siklus = temukan_siklus(adj) — fungsi di bagian terkunci sudah benar, tinggal panggil.",
      ],
      code: {
        starter: "# Data transfer (adjacency list). JANGAN UBAH.\nadj = {\"A\": [\"B\", \"F\"], \"B\": [\"C\"], \"C\": [\"D\"], \"D\": [\"B\"],\n       \"E\": [\"F\", \"G\", \"H\"], \"F\": [\"K\"], \"G\": [], \"H\": [],\n       \"I\": [\"F\"], \"J\": [\"F\"], \"K\": []}\n\ndef temukan_siklus(adj):\n    hasil = set(); selesai = set()\n    def dfs(node, tumpukan):\n        tumpukan.append(node)\n        for nb in adj[node]:\n            if nb in tumpukan:\n                i = tumpukan.index(nb)\n                inti = tumpukan[i:]\n                m = min(range(len(inti)), key=lambda k: inti[k])\n                hasil.add(tuple(inti[m:] + inti[:m]))\n            elif nb not in selesai:\n                dfs(nb, tumpukan)\n        tumpukan.pop(); selesai.add(node)\n    for n in adj:\n        if n not in selesai:\n            dfs(n, [])\n    return [list(c) for c in sorted(hasil)]\n\n# TULIS KODEMU di bawah.\nfan_in = \nfan_out = \nderajat = \nhub = \nsiklus = \nprint(f\"fan_in F: {fan_in['F']}\")\nprint(f\"fan_out E: {fan_out['E']}\")\nprint(f\"hub: {hub}\")\nprint(f\"siklus: {siklus}\")\n",
        lockLines: 23,
        solution: "# Data transfer (adjacency list). JANGAN UBAH.\nadj = {\"A\": [\"B\", \"F\"], \"B\": [\"C\"], \"C\": [\"D\"], \"D\": [\"B\"],\n       \"E\": [\"F\", \"G\", \"H\"], \"F\": [\"K\"], \"G\": [], \"H\": [],\n       \"I\": [\"F\"], \"J\": [\"F\"], \"K\": []}\n\ndef temukan_siklus(adj):\n    hasil = set(); selesai = set()\n    def dfs(node, tumpukan):\n        tumpukan.append(node)\n        for nb in adj[node]:\n            if nb in tumpukan:\n                i = tumpukan.index(nb)\n                inti = tumpukan[i:]\n                m = min(range(len(inti)), key=lambda k: inti[k])\n                hasil.add(tuple(inti[m:] + inti[:m]))\n            elif nb not in selesai:\n                dfs(nb, tumpukan)\n        tumpukan.pop(); selesai.add(node)\n    for n in adj:\n        if n not in selesai:\n            dfs(n, [])\n    return [list(c) for c in sorted(hasil)]\n\n# TULIS KODEMU di bawah.\nfan_in = {n: 0 for n in adj}\nfan_out = {n: len(v) for n, v in adj.items()}\nfor src, dsts in adj.items():\n    for d in dsts:\n        fan_in[d] += 1\nderajat = {n: fan_in[n] + fan_out[n] for n in adj}\nhub = max(derajat, key=lambda n: (derajat[n], n))\nsiklus = temukan_siklus(adj)\nprint(f\"fan_in F: {fan_in['F']}\")\nprint(f\"fan_out E: {fan_out['E']}\")\nprint(f\"hub: {hub}\")\nprint(f\"siklus: {siklus}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "fan-in F = 4", msg: "Empat rekening mengirim ke F.", pattern: "fan_in F: 4" },
          { kind: "stdout_matches", task: "t1", label: "fan-out E = 3", msg: "E menyebar ke tiga rekening.", pattern: "fan_out E: 3" },
          { kind: "stdout_matches", task: "t3", label: "hub = F", msg: "Derajat tertinggi (5).", pattern: "hub: F" },
          { kind: "equal", task: "t3", name: "hub", value: "F", label: "`hub` = 'F'", msg: "Rekening F." },
          { kind: "equal", task: "t2", name: "siklus", value: [["B", "C", "D"]], label: "siklus B-C-D", msg: "Satu-satunya putaran." },
          { kind: "stdout_matches", task: "t2", label: "siklus tercetak", msg: "Format list-of-list.", pattern: "siklus: \\[\\['B', 'C', 'D'\\]\\]" },
        ],
      },
      reference: "Hitung derajat, panggil pencari siklus, tulis narasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan memakai graph analytics",
      prose: [
        "Skenario 1 — Investigasi kasus yang lolos saringan (transaksi di bawah ambang tetapi volume rekening janggal) → bangun graf 1–2 hop dari rekening terduga; cari siklus & fan-in. Ini kasus 'Rp47 miliar tanpa peringatan' di cerita pembuka.",
        "Skenario 2 — Monitoring real-time transaksi masuk → tetap pakai rule-based (murah, cepat); graph analytics terlalu berat untuk tiap transaksi. Graf dipakai offline/near-real-time, bukan di jalur blokir instan.",
        "Skenario 3 — Ditemukan hub dengan centrality tinggi → JANGAN langsung blokir; prioritaskan pendalaman: siapa pemiliknya, apa usaha yang mendasari, apakah dana diteruskan atau dipakai. Hub = antrean investigasi, bukan vonis.",
        "Skenario 4 — Graf terpotong (banyak transfer antar-bank tak terlihat) → akui batasnya di laporan; pola yang ditemukan adalah batas bawah, bukan gambaran utuh. Jangan membuat klaim lebih kuat dari data.",
        "Aturan 10 detik: (1) butuh kecepatan atau kedalaman? (2) ada pola relasi yang dicurigai? (3) datanya cukup lengkap? Cepat → aturan; dalam + relasional + data cukup → graf.",
      ],
      tasks: [],
      reference: "Cepat = aturan; dalam = graf.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "214 rekening, 11 menit, nol peringatan",
      prose: [
        "Kembali ke cerita pembuka dengan angka konkret. Audit menemukan 214 rekening yang dalam 11 menit memindahkan total Rp47 miliar. Rata-rata per transfer: Rp219 juta — semuanya di bawah ambang pelaporan otomatis Rp500 juta yang dipakai bank itu. Setiap rekening hanya melakukan 2–4 transfer. Secara individual: tidak ada yang salah.",
        "Pertanyaan: (1) Struktur graf apa yang paling mungkin menjelaskan pola ini, dan bagaimana kamu memverifikasinya dari data? (2) Rekening mana yang kamu dalami duluan, dan dengan urutan apa? (3) Apa yang kamu tulis di laporan agar tidak terdengar seperti menuduh tanpa bukti?",
        "Pembahasan: (1) Kombinasi fan-out (pemecahan dari rekening sumber) + rantai (multi-hop) + fan-in (pengumpulan di rekening penampung); verifikasi dengan membangun adjacency list 2 hop dari rekening dengan volume keluar terbesar, lalu jalankan deteksi siklus & hitung centrality. (2) Urutan: hub (centrality tertinggi) → rekening dalam siklus → rekening sumber fan-out; alasannya: hub memberi gambaran terbesar dengan usaha terkecil. (3) Bahasa temuan: 'Ditemukan struktur transfer berputar (siklus) dan titik kumpul (fan-in) yang konsisten dengan tipologi layering; direkomendasikan pendalaman atas rekening X, Y, Z' — fakta struktur dulu, interpretasi kemudian, vonis tidak pernah di laporan analis.",
      ],
      tasks: [],
      reference: "Fakta struktur dulu, vonis tidak pernah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Transfer dimodelkan sebagai graf berarah: node = rekening, edge = transfer; adjacency list adalah representasi kerja analis.",
        "Tiga pola layering: rantai (mengaburkan jejak), fan-in/fan-out (mengumpulkan/memecah dana), siklus (berputar kembali — sinyal paling keras).",
        "Degree centrality C_D(v) = deg(v)/(n−1) memprioritaskan siapa didalami duluan; hub = prioritas, bukan vonis.",
        "Rule-based buta struktur: serangan dirancang lolos ambang per-transaksi; graf melihat hubungan antar-transaksi.",
        "Praktik industri: rule-based untuk saringan real-time yang murah; graph analytics untuk investigasi mendalam.",
      ],
      quiz: [
        {
          q: "Mengapa 214 transfer di bawah ambang bisa lolos dari monitoring berbasis aturan?",
          options: [
            { text: "Aturan memeriksa transaksi satu per satu; polanya ada di hubungan antar-transaksi", why: "Benar: struktur tidak terlihat dari pemeriksaan individual.", correct: true },
            { text: "Ambang pelaporannya terlalu tinggi", why: "Menurunkan ambang hanya menggeser masalah — pola tetap tak terlihat." },
            { text: "Sistem monitoringnya rusak", why: "Sistem bekerja sesuai desain; desainnyalah yang buta struktur." },
            { text: "Rekeningnya terlalu banyak untuk diperiksa", why: "Jumlah bukan masalahnya — 214 rekening mudah diperiksa satu per satu." },
          ],
        },
        {
          q: "Pola fan-in (banyak rekening → satu rekening) paling cocok diinterpretasikan sebagai:",
          options: [
            { text: "Titik pengumpulan dana — kandidat titik penampung hasil kejahatan", why: "Benar: fan-in adalah pola koleksi.", correct: true },
            { text: "Bukti pasti pencucian uang", why: "Salah: merchant sah juga punya fan-in; butuh konteks." },
            { text: "Kesalahan data", why: "Salah: fan-in adalah pola nyata, bukan error." },
            { text: "Aktivitas normal yang bisa diabaikan", why: "Salah: justru pola yang wajib diperiksa konteksnya." },
          ],
        },
        {
          q: "Siklus B→C→D→B dalam graf transfer mengindikasikan:",
          options: [
            { text: "Layering — dana berputar tanpa alasan bisnis yang sah", why: "Benar: dana yang kembali ke titik awal adalah sinyal paling keras.", correct: true },
            { text: "Pembayaran cicilan normal", why: "Salah: cicilan mengalir satu arah ke kreditor, tidak berputar." },
            { text: "Refund antar-merchant", why: "Salah: refund kembali ke pembayar awal, bukan berputar tiga hop." },
            { text: "Tidak ada arti khusus", why: "Salah: siklus hampir tidak pernah terjadi dalam bisnis sah." },
          ],
        },
        {
          q: "Rekening F berderajat 5 dari 11 rekening (C_D = 0,5, tertinggi). Tindakan analis yang benar:",
          options: [
            { text: "Prioritaskan pendalaman atas F — periksa pemilik, usaha, dan arah dana", why: "Benar: centrality = antrean prioritas investigasi.", correct: true },
            { text: "Langsung blokir F sebagai rekening pencucian", why: "Salah: centrality bukan vonis; hub bisa jadi merchant sah." },
            { text: "Abaikan karena centrality hanya teori", why: "Salah: ini ukuran prioritas yang praktis." },
            { text: "Blokir semua rekening yang terhubung ke F", why: "Salah dan berbahaya: menghukum berdasarkan kedekatan graf." },
          ],
        },
        {
          q: "Kapan rule-based monitoring LEBIH tepat daripada graph analytics?",
          options: [
            { text: "Penyaringan real-time tiap transaksi masuk — murah dan cepat", why: "Benar: graf terlalu berat untuk jalur blokir instan.", correct: true },
            { text: "Investigasi kasus yang lolos saringan", why: "Salah: itu justru ranah graph analytics." },
            { text: "Menemukan jaringan pencucian multi-rekening", why: "Salah: itu keunggulan graf." },
            { text: "Tidak pernah — graph selalu lebih baik", why: "Salah: tidak ada alat yang selalu terbaik." },
          ],
        },
        {
          q: "Analis menemukan hub tetapi datanya terpotong (transfer antar-bank tak terlihat). Sikap yang benar:",
          options: [
            { text: "Tulis batasan data di laporan — temuan adalah batas bawah, bukan gambaran utuh", why: "Benar: kejujuran tentang kelengkapan data.", correct: true },
            { text: "Asumsikan bagian yang tak terlihat juga mencurigakan", why: "Salah: mengisi kekosongan data dengan asumsi." },
            { text: "Batalkan investigasi karena data tak lengkap", why: "Salah: temuan parsial tetap bernilai bila dibingkai jujur." },
            { text: "Minta IT 'melengkapi' data yang tidak ada", why: "Salah: data antar-bank memang tidak dimiliki bank." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Graf sudah menemukan polanya, investigasi selesai.” Graf menemukan KANDIDAT. Pekerjaan analis baru mulai: verifikasi pemilik rekening, kaitkan dengan data nasabah (KYC, usaha, riwayat), dan tulis temuan dalam bahasa fakta — bukan bahasa tuduhan.",
      },
      hints: [
        "Uji cepat: gambar graf 5 node dengan satu siklus dan satu fan-in tanpa catatan.",
        "Ingat: centrality = prioritas; siklus = sinyal terkeras; aturan = saringan cepat.",
      ],
      next: { label: "AML26 — Trade-Based Money Laundering: ML untuk Manipulasi Invoice", href: "/learn/aml26-trade-based-ml" },
      reference: "Lihat struktur, bukan transaksi.",
    },
  ],
};
