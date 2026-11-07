import type { V2Lesson } from "../lib/types";

export const bi27: V2Lesson = {
  slug: "bi27-enrichment",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI27 · Gene Ontology dan Pathway Enrichment: dari Daftar Gen ke Makna Biologi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "500 gen naik, dan tidak satu pun bercerita",
      prose: [
        "Analisis RNA-seq selesai. Daftar differential expression: 500 gen naik, 420 gen turun, semua dengan padj di bawah 0,05. Presentasi ke grup riset berjalan lima menit, lalu seseorang bertanya: 'Jadi, apa yang sebenarnya terjadi di sel ini?' Hening. Daftar 500 gen itu benar secara statistik dan bisu secara biologi. Gen BRCA1, MYC, TP53 — nama-nama itu berarti sesuatu bagi yang mengenalnya, tetapi 497 nama lain adalah huruf yang tidak bercerita.",
        "Enrichment analysis adalah penerjemah daftar menjadi cerita: apakah gen-gen yang naik itu kebetulan berkumpul di jalur yang sama — respirasi seluler, siklus sel, respons imun — ataukah tersebar acak di seluruh genom? Bila 35 dari 500 gen DE termasuk jalur respirasi seluler yang hanya berisi 200 dari 20.000 gen, itu bukan kebetulan: harapannya hanya 5. Lesson ini mengajarkan cara menghitung 'bukan kebetulan' itu dengan benar — Gene Ontology sebagai kamusnya, uji hipergeometrik sebagai timbangannya, dan koreksi multipel sebagai remnya. BI9 sudah memberi daftar DE-nya; lesson ini memberi maknanya. Setelah lesson ini kamu bisa: (1) menjelaskan struktur Gene Ontology (tiga ontologi, DAG); (2) menghitung uji hipergeometrik over-representation dengan tangan; (3) menjelaskan GSEA dan kapan memakainya; (4) menerapkan koreksi Benjamini-Hochberg dan membaca jebakan universe yang salah.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada di track ini",
        body: "BI9 berhenti di daftar DE — ia menyebut 'interpretasi: pathway, validasi' dalam satu kalimat tanpa metode. BI18 memakai daftar DE sebagai capstone tanpa enrichment. Lesson ini adalah langkah yang hilang di antara keduanya: dari daftar ke makna.",
      },
      reference: "Daftar DE = apa yang berubah. Enrichment = apakah yang berubah itu berkumpul di jalur yang sama — dan seberapa yakin kita.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca gambar enrichment (dot plot, bar chart) dan menilai apakah klaim 'jalur X aktif' didukung angka atau hanya didukung warna.",
        "(1) Menjelaskan Gene Ontology — tiga ontologi (BP, MF, CC), struktur DAG, dan pewarisan anotasi dari istilah spesifik ke istilah umum;",
        "(2) Menghitung uji hipergeometrik over-representation: universe, harapan, dan nilai p;",
        "(3) Menjelaskan GSEA — enrichment tanpa ambang — dan kapan ia lebih tepat daripada ORA;",
        "(4) Menerapkan koreksi Benjamini-Hochberg dan mengenali jebakan: universe salah, gen duplikat, dan istilah redundan.",
      ],
      tasks: [],
    },
    {
      id: "gene-ontology",
      eyebrow: "Langkah 3 · Teori",
      title: "Gene Ontology: kamus biologi yang berbentuk graf",
      prose: [
        "Gene Ontology (GO) adalah kamus terkontrol yang menjelaskan apa yang dilakukan gen, dalam tiga ontologi terpisah. Biological Process (BP): proses yang diikuti gen itu — misal 'respirasi seluler'. Molecular Function (MF): aktivitas molekulernya — misal 'aktivitas kinase'. Cellular Component (CC): di mana ia berada — misal 'mitokondria'. Satu gen bisa punya banyak istilah di ketiga ontologi: gen yang sama bisa berproses di respirasi seluler, berfungsi sebagai kinase, dan berada di mitokondria.",
        "Struktur GO adalah DAG (directed acyclic graph): istilah disusun dari umum ke spesifik, dan satu istilah bisa punya banyak induk. 'Respirasi seluler' adalah anak dari 'proses metabolik'; 'respirasi aerobik' adalah anak dari 'respirasi seluler'. Aturan pewarisannya (true path rule): gen yang dianotasi ke istilah spesifik OTOMATIS juga dianotasi ke semua leluhurnya. Konsekuensinya: istilah umum seperti 'proses metabolik' berisi ribuan gen — enrichment di istilah umum hampir selalu 'signifikan' dan hampir selalu tidak informatif. Temuan yang bermakna tinggal di istilah yang cukup spesifik untuk bercerita dan cukup besar untuk diuji.",
        "Di luar GO, ada basis jalur lain yang dipakai dengan logika sama: KEGG (jalur metabolik dan sinyal), Reactome (jalur reaksi yang dikurasi manusia), dan g:Profiler sebagai alat yang menggabungkan banyak sumber. Alat berbeda, kamus berbeda — tetapi uji statistik di bawahnya sama. Analis yang paham GO bisa membaca hasil dari alat mana pun; analis yang hanya hafal tombol satu alat akan kebingungan saat alatnya berganti.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melaporkan istilah GO paling umum ('proses metabolik', 'pengikatan protein') sebagai temuan. Istilah umum berisi ribuan gen sehingga hampir selalu 'kaya' secara statistik — tetapi tidak berkata apa-apa. Saring ke istilah yang spesifik, atau laporkan bersama ukuran gen-nya agar pembaca bisa menilai.",
      },
      reference: "GO = BP + MF + CC, berbentuk DAG. Anotasi spesifik mewarisi ke leluhurnya. Temuan bermakna tinggal di istilah spesifik.",
    },
    {
      id: "ora",
      eyebrow: "Langkah 4 · Teori",
      title: "ORA hipergeometrik: apakah 35 dari 500 itu kebetulan",
      prose: [
        "Over-representation analysis (ORA) mengajukan satu pertanyaan: bila saya mengambil 500 gen secara acak dari 20.000 gen, berapa peluang 35 di antaranya jatuh di jalur yang hanya berisi 200 gen? Harapannya sederhana: 500 dikali 200 dibagi 20.000, sama dengan 5. Mendapat 35 saat harapannya 5 adalah 7 kali lipat — dan uji hipergeometrik menghitung peluangnya: 8,2e-20, praktis nol. Jalur itu benar-benar kaya (enriched), bukan kebetulan.",
        "Rumusnya adalah peluang hipergeometrik: dari universe N gen, jalur berisi K gen, daftar DE berisi n gen, dan overlap k gen — peluang mendapat k atau lebih adalah jumlah peluang hipergeometrik dari k sampai batas atas. Tiga angka yang harus benar agar uji ini berarti. Pertama, universe N: seluruh gen yang MUNGKIN masuk daftar DE — yaitu gen yang diuji di DESeq2 (BI9), bukan seluruh genom. Memakai seluruh genom (termasuk gen yang tidak pernah diukur) mengecilkan harapan palsu dan membesarkan klaim palsu. Kedua, daftar DE n: gen yang lolos ambang padj dan fold change yang sudah ditetapkan SEBELUM melihat hasil — mengubah ambang setelah melihat hasil adalah p-hacking. Ketiga, anotasi K: jalur yang terdefinisi dengan baik dan cukup besar (di bawah 10 gen, uji tidak punya daya; di atas 500 gen, istilah terlalu umum).",
        "Contoh lab memakai universe 20.000, daftar 500, dan lima jalur: respirasi seluler (K 200, k 35, p 8,2e-20), siklus sel (K 300, k 28, p 2,5e-09), respons imun (K 150, k 12, p 4,0e-04), metabolisme lipid (K 250, k 9, p 0,18), dan transduksi sinyal (K 400, k 11, p 0,42). Tiga pertama signifikan bahkan setelah koreksi; dua terakhir tidak — walau overlap-nya (9 dan 11) terlihat 'cukup banyak' tanpa pembanding harapan (6,25 dan 10). Tanpa harapan, angka mentah menipu.",
      ],
      tasks: [],
      formula: String.raw`P(X \geq k) = \sum_{i=k}^{\min(K,n)} \frac{\binom{K}{i}\binom{N-K}{n-i}}{\binom{N}{n}}`,
      formulaNote: "Uji hipergeometrik: N = universe (20.000), K = ukuran jalur, n = ukuran daftar DE (500), k = overlap. Contoh: respirasi seluler K 200, k 35, harapan 5, p = 8,2e-20.",
      note: {
        title: "Sering salah",
        body: "Memakai universe yang salah — seluruh genom, bukan gen yang diuji. Gen yang tidak pernah diukur tidak mungkin masuk daftar DE, jadi memasukkannya ke universe mengecilkan harapan dan membesarkan klaim. Universe yang benar adalah gen yang diuji di DESeq2 (BI9).",
      },
      reference: "Harapan = n dikali K dibagi N. Universe = gen yang diuji, bukan seluruh genom.",
    },
    {
      id: "gsea-bh",
      eyebrow: "Langkah 5 · Teori",
      title: "GSEA dan koreksi multipel: tanpa ambang, tanpa klaim palsu",
      prose: [
        "ORA punya satu kelemahan: ia butuh ambang. Gen dengan padj 0,049 masuk daftar, gen dengan padj 0,051 tidak — padahal keduanya hampir sama. Gene Set Enrichment Analysis (GSEA) menghilangkan ambang: semua gen diurutkan berdasarkan fold change (atau statistik uji), lalu untuk tiap jalur dihitung apakah gen-gen jalur itu berkumpul di ujung atas atau bawah daftar — seperti menguji apakah kartu merah berkumpul di atas tumpukan kartu yang sudah diurutkan. Gen dengan efek kecil tetapi searah (misal seluruh jalur naik 20 persen) tidak akan lolos ambang ORA, tetapi tertangkap GSEA. Harganya: GSEA butuh statistik peringkat yang bermakna dan lebih banyak komputasi; dan hasilnya (enrichment score) lebih sulit dijelaskan ke non-ahli daripada '35 dari 500'.",
        "Baik ORA maupun GSEA menguji RATUSAN jalur sekaligus — dan di sinilah koreksi multipel masuk. Menguji 500 jalur pada ambang 0,05 berarti sekitar 25 jalur 'signifikan' hanya karena kebetulan. Koreksi Benjamini-Hochberg (BH) mengendalikan false discovery rate (FDR): urutkan nilai p dari kecil ke besar, lalu kalikan tiap nilai p dengan jumlah tes dibagi peringkatnya (dengan penyesuaian monoton). Pada contoh lab, lima nilai p mentah (8,2e-20, 2,5e-09, 4,0e-04, 0,18, 0,42) menjadi nilai padj (4,1e-19, 6,2e-09, 6,6e-04, 0,22, 0,42) — tiga jalur tetap signifikan pada FDR 0,05, dua tidak. Perhatikan: koreksi menggeser ambang, bukan menghapus temuan yang kuat — temuan dengan p 8,2e-20 tetap signifikan walau dikoreksi 500 kali.",
        "Dua jebakan terakhir sebelum memercayai gambar enrichment. Pertama, istilah redundan: jalur 'respirasi seluler', 'respirasi aerobik', dan 'rantai transpor elektron' berisi gen yang hampir sama — ketiganya signifikan bukan tiga temuan independen, melainkan satu temuan yang dihitung tiga kali. Alat modern mengelompokkan istilah redundan; analis yang baik menyebutkannya. Kedua, gen duplikat: gen yang sama muncul dua kali dalam daftar (misal dua isoform, BI24) dihitung dua kali oleh ORA — daftar harus berisi gen unik.",
      ],
      tasks: [],
      formula: String.raw`p_{adj,(i)} = \min_{j \geq i} \left( p_{(j)} \cdot \frac{m}{j} \right)`,
      formulaNote: "Koreksi Benjamini-Hochberg: m = jumlah tes, j = peringkat nilai p terurut. Contoh lab: 5 jalur, padj = 4,1e-19, 6,2e-09, 6,6e-04, 0,22, 0,42 — 3 signifikan pada FDR 0,05.",
      note: {
        title: "Sering salah",
        body: "Melaporkan nilai p mentah dari 500 jalur tanpa koreksi. Sekitar 25 jalur akan 'signifikan' hanya karena kebetulan pada ambang 0,05. Selalu laporkan padj (FDR), dan sebutkan jumlah jalur yang diuji.",
      },
      reference: "GSEA = tanpa ambang, memakai peringkat semua gen. BH = kendalikan FDR saat menguji ratusan jalur.",
    },
    {
      id: "lab-enrichment",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: uji hipergeometrik dan koreksi Benjamini-Hochberg",
      prose: [
        "Sekarang hitung sendiri angka-angka di teori. Universe N 20.000 gen, daftar DE n 500 gen, lima jalur: respirasi seluler (K 200, k 35), siklus sel (K 300, k 28), respons imun (K 150, k 12), metabolisme lipid (K 250, k 9), transduksi sinyal (K 400, k 11). Untuk tiap jalur, hitung nilai p hipergeometrik (peluang overlap k atau lebih) dan harapan (n dikali K dibagi N): respirasi 5,00; siklus 7,50; imun 3,75; lipid 6,25; sinyal 10,00. Nilai p yang diharapkan: 8,218e-20, 2,477e-09, 3,981e-04, 1,759e-01, 4,169e-01.",
        "Lalu terapkan koreksi Benjamini-Hochberg pada kelima nilai p: padj menjadi 4,109e-19, 6,192e-09, 6,636e-04, 2,199e-01, 4,169e-01. Tiga jalur signifikan pada FDR 0,05. Perhatikan jalur metabolisme lipid: overlap 9 terlihat 'banyak', tetapi harapannya 6,25 — hanya 1,4 kali lipat, dan nilai p-nya 0,18. Tanpa harapan sebagai pembanding, 9 adalah angka yang menipu.",
        "Setelah lolos, coba eksperimen: ubah universe menjadi 30.000 (seluruh genom, termasuk gen yang tidak diuji) dan lihat nilai p respirasi mengecil palsu — itulah kenapa universe yang salah adalah jebakan paling mahal di lesson ini. Lalu kembalikan ke 20.000.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `p_hiper(N, K, n, k)`: jumlah peluang hipergeometrik dari k sampai min(K, n), memakai math.comb" },
        { id: "t2", text: "Hitung nilai p kelima jalur dan simpan di dict `pvals`" },
        { id: "t3", text: "Terapkan koreksi Benjamini-Hochberg dan hitung `signifikan` = jumlah jalur dengan padj di bawah 0,05" },
        { id: "t4", text: "Cetak kelima nilai p (format 3 desimal ilmiah) dan jumlah signifikan" },
      ],
      expected: "p_respirasi=8.218e-20\np_siklus=2.477e-09\np_imun=3.981e-04\np_lipid=1.759e-01\np_sinyal=4.169e-01\nsignifikan=3",
      hints: [
        "Peluang tepat i: comb(K, i) x comb(N-K, n-i) dibagi comb(N, n); jumlahkan i dari k sampai min(K, n).",
        "Harapan tiap jalur = n x K / N — respirasi 5,00; sinyal 10,00. Bandingkan dengan k sebelum percaya nilai p.",
        "BH: urutkan p menaik; padj peringkat j = p x m / j; lalu jalankan dari bawah ke atas dengan min kumulatif agar monoton.",
        "Format: f'{p:.3e}' memberi 8.218e-20 — samakan dengan Hasil yang diharapkan.",
      ],
      code: {
        starter: `import math\n\nN, n = 20000, 500\njalur = [\n    ("respirasi", 200, 35),\n    ("siklus", 300, 28),\n    ("imun", 150, 12),\n    ("lipid", 250, 9),\n    ("sinyal", 400, 11),\n]\n\ndef p_hiper(N, K, n, k):\n    return 0.0  # TULIS KODEMU: jumlah peluang hipergeometrik i=k..min(K,n)\n\npvals = {}  # TULIS KODEMU: nilai p tiap jalur\n\ndef benjamini_hochberg(pvals):\n    return {}  # TULIS KODEMU: dict nama -> padj\n\npadj = benjamini_hochberg(pvals)\nsignifikan = 0  # TULIS KODEMU: jumlah jalur dengan padj < 0,05\n\nfor nama, K, k in jalur:\n    print(f"p_{nama}={pvals[nama]:.3e}")\nprint(f"signifikan={signifikan}")`,
        lockLines: 0,
        solution: `import math\n\nN, n = 20000, 500\njalur = [\n    ("respirasi", 200, 35),\n    ("siklus", 300, 28),\n    ("imun", 150, 12),\n    ("lipid", 250, 9),\n    ("sinyal", 400, 11),\n]\n\ndef p_hiper(N, K, n, k):\n    total = 0.0\n    for i in range(k, min(K, n) + 1):\n        total += math.comb(K, i) * math.comb(N - K, n - i) / math.comb(N, n)\n    return total\n\npvals = {nama: p_hiper(N, K, n, k) for nama, K, k in jalur}\n\ndef benjamini_hochberg(pvals):\n    m = len(pvals)\n    urut = sorted(pvals.items(), key=lambda kv: kv[1])\n    padj = {}\n    terkecil = 1.0\n    for peringkat in range(m, 0, -1):\n        nama, p = urut[peringkat - 1]\n        nilai = p * m / peringkat\n        terkecil = min(terkecil, nilai)\n        padj[nama] = min(terkecil, 1.0)\n    return padj\n\npadj = benjamini_hochberg(pvals)\nsignifikan = sum(1 for v in padj.values() if v < 0.05)\n\nfor nama, K, k in jalur:\n    print(f"p_{nama}={pvals[nama]:.3e}")\nprint(f"signifikan={signifikan}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "p_respirasi=8.218e-20", label: "Nilai p respirasi seluler = 8,218e-20", msg: "Harapan 5, overlap 35 — 7 kali lipat. Jumlahkan peluang hipergeometrik dari i=35 sampai 200." },
          { kind: "stdout_matches", task: "t2", pattern: "p_siklus=2.477e-09", label: "Nilai p siklus sel = 2,477e-09", msg: "Harapan 7,50, overlap 28. Periksa rumus peluang: comb(K,i) x comb(N-K,n-i) / comb(N,n)." },
          { kind: "stdout_matches", task: "t2", pattern: "p_lipid=1.759e-01", label: "Nilai p metabolisme lipid = 0,176 (tidak signifikan)", msg: "Harapan 6,25, overlap 9 — hanya 1,4 kali lipat. Tanpa harapan sebagai pembanding, 9 adalah angka yang menipu." },
          { kind: "equal", task: "t3", name: "signifikan", value: 3, label: "Signifikan pada FDR 0,05 = 3 jalur", msg: "padj: 4,1e-19, 6,2e-09, 6,6e-04, 0,22, 0,42 — tiga pertama di bawah 0,05. BH: urutkan p, kalikan m/peringkat, ambil min kumulatif dari bawah." },
        ],
      },
      reference: "Nilai p: 8,2e-20, 2,5e-09, 4,0e-04, 0,18, 0,42. Setelah BH: 3 signifikan pada FDR 0,05.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: ORA atau GSEA, GO atau KEGG",
      prose: [
        "Skenario 1 — 'Saya punya daftar DE tegas (padj dan fold change sudah ditetapkan) dan ingin tahu jalur apa yang kaya.' → ORA hipergeometrik (GO/KEGG/Reactome). Alasan: sederhana, mudah dijelaskan, dan cukup bila ambangnya sudah ditetapkan sebelum melihat hasil. Contoh nyata: laporan standar RNA-seq pasca-DESeq2.",
        "Skenario 2 — 'Efeknya kecil tetapi searah di seluruh jalur — tidak ada gen yang lolos ambang sendirian.' → GSEA dengan peringkat fold change semua gen. Alasan: ORA buta terhadap efek kecil yang konsisten; GSEA menangkapnya karena memakai seluruh daftar berperingkat. Contoh nyata: jalur metabolik yang naik 20 persen merata.",
        "Skenario 3 — 'Saya ingin tahu jalur metabolik spesifik (bukan istilah GO umum).' → KEGG atau Reactome. Alasan: GO unggul di proses umum, KEGG dan Reactome unggul di jalur reaksi spesifik yang dikurasi. Contoh nyata: jalur biosintesis yang ingin dipetakan ke reaksi enzim.",
        "Skenario 4 — 'Dot plot saya menunjukkan 15 jalur signifikan yang semuanya berisi gen yang hampir sama.' → Kelompokkan istilah redundan, laporkan satu perwakilan per kelompok. Alasan: 15 istilah yang tumpang tindih bukan 15 temuan — melainkan satu temuan yang dihitung 15 kali (DAG GO). Contoh nyata: 'respirasi seluler', 'respirasi aerobik', 'rantai transpor elektron' sebagai satu cerita.",
        "Aturan praktis 10 detik: sebelum percaya gambar enrichment, tanyakan tiga hal — universe-nya apa, nilai p-nya mentah atau padj, dan berapa jalur yang diuji. Bila satu saja tidak terjawab, gambar itu hiasan, bukan bukti.",
      ],
      tasks: [],
      reference: "Daftar tegas → ORA. Efek kecil searah → GSEA. Jalur reaksi spesifik → KEGG/Reactome. Istilah redundan → kelompokkan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: 'jalur kanker' yang signifikan di semua sampel",
      prose: [
        "Sebuah studi melaporkan jalur 'pathways in cancer' (KEGG) signifikan di SEMUA kondisi — kontrol, perlakuan, bahkan di sampel yang ditukar labelnya sebagai kontrol negatif. Penyelidikan menemukan tiga kesalahan sekaligus. Pertama, universe memakai seluruh genom (30.000 gen) bukan gen yang diuji (20.000) — harapan mengecil palsu, nilai p mengecil palsu. Kedua, daftar DE berisi gen duplikat (dua isoform per gen, BI24) — overlap terhitung ganda. Ketiga, 'pathways in cancer' adalah istilah payung berisi 500 lebih gen dari banyak proses — hampir semua daftar DE yang besar akan 'kaya' di sana.",
        "Perbaikan: universe dikembalikan ke gen yang diuji (20.000), daftar dibuat unik per gen, dan istilah payung dikeluarkan dari laporan utama (atau dilaporkan dengan ukuran gen-nya agar pembaca bisa menilai). Setelah perbaikan, jalur itu tidak lagi signifikan di kontrol negatif — dan di perlakuan, jalur yang muncul adalah 'siklus sel' dan 'respirasi seluler', dua jalur yang spesifik dan bisa diceritakan. Pelajaran: enrichment yang signifikan di kontrol negatif adalah alarm — bukan temuan.",
        "Pembahasan: perhatikan pola yang sama dengan lesson lain di track ini — kesalahan bukan di uji statistiknya (rumus hipergeometriknya benar), melainkan di MASUKAN uji itu: universe, daftar, dan definisi jalur. Analis yang hanya memeriksa nilai p akan melewatkan ketiganya; analis yang memeriksa masukan akan menemukan ketiganya sebelum presentasi.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga perbaikan: universe ke gen yang diuji, daftar unik per gen, istilah payung dikeluarkan atau dilaporkan dengan ukurannya. Setelah itu jalur payung tidak signifikan di kontrol negatif — enrichment yang signifikan di kontrol negatif adalah alarm, bukan temuan.",
      },
      reference: "Cek masukan sebelum percaya nilai p: universe, keunikan daftar, dan ukuran istilah.",
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
        "GO = tiga ontologi (BP, MF, CC) berbentuk DAG; anotasi spesifik mewarisi ke leluhur — istilah umum hampir selalu 'signifikan' tetapi tidak informatif.",
        "ORA hipergeometrik: harapan = n dikali K dibagi N; lab: respirasi seluler harapan 5, overlap 35, p 8,2e-20.",
        "Universe yang benar = gen yang diuji di DESeq2, bukan seluruh genom.",
        "GSEA memakai peringkat semua gen tanpa ambang — menangkap efek kecil yang searah di seluruh jalur.",
        "Koreksi BH: lab memberi 3 jalur signifikan pada FDR 0,05; istilah redundan adalah satu temuan yang dihitung berkali-kali.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Respirasi seluler: K 200, k 35, dari daftar 500 gen dan universe 20.000. Berapa harapannya, dan apa artinya?",
          options: [
            { text: "Harapan 35 — overlap sama dengan harapan, jadi tidak ada enrichment", why: "Salah: harapan = 500 x 200 / 20.000 = 5, bukan 35. Overlap 35 adalah 7 kali harapan — itulah enrichment." },
            { text: "Harapan 5 — overlap 35 adalah 7 kali lipat, dan nilai p-nya 8,2e-20: jalur itu benar-benar kaya", why: "Tepat: harapan adalah pembanding yang membuat 35 bermakna. Tanpa harapan, 35 hanyalah angka.", correct: true },
            { text: "Harapan 200 — seluruh jalur masuk daftar DE", why: "Salah: 200 adalah ukuran jalur (K), bukan harapan. Harapan memakai proporsi: daftar 500 dari universe 20.000 hanya mengambil 2,5 persen tiap jalur." },
            { text: "Harapan tidak bisa dihitung tanpa mengetahui nilai p dulu", why: "Salah: harapan dihitung dari N, K, dan n saja — sebelum uji apa pun. Nilai p justru mengukur seberapa jauh overlap menyimpang dari harapan." },
          ],
        },
        {
          q: "Analis memakai seluruh genom (30.000 gen) sebagai universe, padahal hanya 20.000 gen yang diuji. Apa akibatnya?",
          options: [
            { text: "Tidak ada — universe yang lebih besar hanya membuat hitungan lebih lambat", why: "Salah: universe mengubah harapan. Universe lebih besar mengecilkan harapan palsu dan mengecilkan nilai p palsu — klaim menjadi terlalu mudah signifikan." },
            { text: "Harapan mengecil palsu sehingga nilai p mengecil palsu — jalur menjadi 'signifikan' padahal tidak", why: "Tepat: gen yang tidak pernah diukur tidak mungkin masuk daftar DE. Memasukkannya ke universe adalah mengecilkan penyebut dengan gen mustahil.", correct: true },
            { text: "Nilai p membesar sehingga temuan benar ikut hilang", why: "Salah: arahnya kebalik. Universe lebih besar berarti harapan lebih kecil, overlap terlihat lebih ekstrem, nilai p lebih kecil." },
            { text: "Uji hipergeometrik menjadi tidak bisa dihitung", why: "Salah: rumusnya tetap bisa dihitung dengan N berapa pun. Masalahnya bukan hitungan, melainkan makna — universe yang salah memberi jawaban atas pertanyaan yang salah." },
          ],
        },
        {
          q: "Kapan GSEA lebih tepat daripada ORA?",
          options: [
            { text: "Saat daftar DE sudah tegas dan ambangnya ditetapkan sebelum melihat hasil", why: "Salah: itu justru kasus ORA — sederhana dan cukup. GSEA bersinar saat ambang adalah masalah, bukan solusi." },
            { text: "Saat efeknya kecil tetapi searah di seluruh jalur — tidak ada gen yang lolos ambang sendirian", why: "Tepat: ORA buta terhadap efek kecil yang konsisten karena butuh ambang. GSEA memakai peringkat semua gen dan menangkap pola itu.", correct: true },
            { text: "Saat ingin hasil yang lebih cepat dihitung", why: "Salah: GSEA lebih berat komputasinya daripada ORA. Kecepatannya bukan alasan memilihnya." },
            { text: "Saat universe tidak diketahui", why: "Salah: GSEA tetap butuh definisi himpunan gen dan peringkat yang bermakna. Universe yang tidak diketahui adalah masalah untuk kedua metode." },
          ],
        },
        {
          q: "Lima jalur diuji, nilai p mentah 8,2e-20, 2,5e-09, 4,0e-04, 0,18, 0,42. Setelah koreksi BH, berapa yang signifikan pada FDR 0,05?",
          options: [
            { text: "5 — semuanya signifikan karena nilai p-nya kecil", why: "Salah: 0,18 dan 0,42 tidak kecil. Koreksi BH tidak mengubah yang besar menjadi kecil." },
            { text: "3 — respirasi, siklus, dan imun; lipid dan sinyal tidak", why: "Tepat: padj menjadi 4,1e-19, 6,2e-09, 6,6e-04, 0,22, 0,42. Tiga pertama di bawah 0,05.", correct: true },
            { text: "1 — hanya respirasi yang cukup kuat menahan koreksi", why: "Salah: koreksi BH pada 5 tes hanya mengalikan maksimal 5 kali — p 2,5e-09 dan 4,0e-04 tetap jauh di bawah 0,05 setelah dikoreksi." },
            { text: "0 — menguji 5 jalur sekaligus menghapus semua signifikansi", why: "Salah: koreksi multipel menggeser ambang, bukan menghapus temuan kuat. Temuan dengan p 8,2e-20 tetap signifikan walau dikoreksi 500 kali." },
          ],
        },
        {
          q: "Dot plot menunjukkan 15 jalur signifikan, tetapi semuanya berisi gen yang hampir sama. Apa yang harus dilakukan?",
          options: [
            { text: "Melaporkan ke-15 jalur sebagai 15 temuan independen", why: "Salah: itu satu temuan yang dihitung 15 kali — istilah GO yang tumpang tindih karena struktur DAG. Melaporkan 15 berarti menggandakan bukti." },
            { text: "Mengelompokkan istilah redundan dan melaporkan satu perwakilan per kelompok", why: "Tepat: 'respirasi seluler', 'respirasi aerobik', dan 'rantai transpor elektron' adalah satu cerita. Kelompokkan, lalu ceritakan sekali dengan benar.", correct: true },
            { text: "Membuang semua jalur itu karena pasti artefak", why: "Salah: redundan bukan berarti salah — temuannya nyata, hanya dihitung berkali-kali. Membuang berarti kehilangan cerita yang benar." },
            { text: "Menguji ulang dengan universe yang lebih besar agar jalurnya berkurang", why: "Salah: mengubah universe untuk mengubah hasil adalah p-hacking. Redundansi diselesaikan dengan pengelompokan, bukan dengan mengutak-atik masukan." },
          ],
        },
      ],
    },
  ],
};
