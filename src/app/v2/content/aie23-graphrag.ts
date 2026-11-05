import type { V2Lesson } from "../lib/types";

// Evaluasi mainan 10 pertanyaan: multi-hop keyword/vector 1/6 vs graph 5/6; faktual 4/4 vs 4/4.
const FIG_EVAL = `<svg viewBox="0 0 560 320" role="img" aria-label="Bar chart akurasi keyword atau vector vs graph pada pertanyaan multi-hop dan faktual.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="70" x2="520" y2="70"/><line x1="56" y1="160" x2="520" y2="160"/><line x1="56" y1="250" x2="520" y2="250"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="74">100%</text><text x="50" y="164">50%</text><text x="50" y="254">0%</text></g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="110" y="220" width="56" height="30" fill="var(--c4)" fill-opacity="0.85"/><text x="138" y="212" fill="var(--text)">1/6</text>
<rect x="176" y="100" width="56" height="150" fill="var(--c1)"/><text x="204" y="92" fill="var(--text)">5/6</text>
<rect x="330" y="70" width="56" height="180" fill="var(--c4)" fill-opacity="0.85"/><text x="358" y="62" fill="var(--text)">4/4</text>
<rect x="396" y="70" width="56" height="180" fill="var(--c1)"/><text x="424" y="62" fill="var(--text)">4/4</text>
<text x="171" y="282" fill="var(--chart-text)">Multi-hop (6 soal)</text>
<text x="391" y="282" fill="var(--chart-text)">Faktual sederhana (4 soal)</text>
<rect x="150" y="296" width="12" height="12" fill="var(--c4)"/><text x="168" y="306" fill="var(--chart-text)" text-anchor="start">keyword / vector</text>
<rect x="310" y="296" width="12" height="12" fill="var(--c1)"/><text x="328" y="306" fill="var(--chart-text)" text-anchor="start">graph (GraphRAG)</text>
</g>
</svg>`;

export const aie23: V2Lesson = {
  slug: "aie23-graphrag",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE23 — GraphRAG: Retrieval Berbasis Knowledge Graph",
  estMinutes: 62,
  steps: [
    {
      id: "cerita-multi-hop-gagal",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jawaban yang ada, tetapi tidak tersambung",
      prose: [
        "Asisten dokumen internal PT NusantaraChip — produsen elektronik dengan ribuan dokumen pengadaan, kontrak, dan daftar sanksi — dipuji selama berbulan-bulan. Pertanyaan faktual sederhana dijawabnya cepat dan tepat: nomor kontrak, tanggal pengiriman, alamat gudang. Sampai suatu pagi manajer pengadaan bertanya: 'Siapa pemasok Sensor S-9, dan apakah pemasok itu sedang kena sanksi?'",
        "Asisten itu menjawab: 'Sensor S-9 dipakai untuk lini produksi utama. Daftar sanksi memuat beberapa perusahaan yang melanggar aturan ekspor.' Terdengar masuk akal, tetapi bukan jawaban. Nama pemasoknya tidak disebut; status sanksinya tidak disimpulkan. Padahal tindak lanjutnya serius: bila pemasok itu benar kena sanksi, pesanan berikutnya harus dihentikan hari itu juga.",
        "Tim memeriksa retrieval-nya. Vector RAG mengembalikan chunk yang mirip kata dengan pertanyaan: dokumen kebutuhan yang menyebut Sensor S-9, dan cuplikan daftar sanksi yang menyebut kata sanksi. Keduanya relevan secara topik, tetapi tidak satu pun chunk yang diambil menyebut pemasok DAN sanksinya sekaligus. LLM akhirnya merangkai jawaban aman dari konteks yang tidak tersambung — kegagalan retrieval yang sunyi, tanpa error apa pun.",
        "TWIST: jawabannya ADA di dokumen, tersebar di tiga tempat. Dokumen A: 'PT NusantaraChip membutuhkan Sensor S-9'. Dokumen B: 'Sensor S-9 dipasok oleh PT SinarKomponen'. Dokumen C: 'PT SinarKomponen kena sanksi OJK karena pelanggaran ekspor'. Yang menghubungkan ketiganya bukan kemiripan teks — tidak ada satu kalimat pun yang memuat seluruh jawaban — melainkan RELASI antar-entitas: Sensor S-9 → dipasok_oleh → PT SinarKomponen → kena_sanksi → Sanksi OJK. Pertanyaan seperti ini disebut multi-hop: jawabannya menuntut dua lompatan relasi atau lebih.",
        "Bekal kilat agar lesson ini mandiri: RAG dasar (dibahas di aie3 dan diperdalam di aie14) bekerja dengan memotong dokumen menjadi chunk, mengubah tiap chunk menjadi embedding, mengambil chunk yang paling mirip dengan pertanyaan, lalu meminta LLM menjawab dari chunk itu. Pola itu kuat untuk fakta yang tinggal di satu tempat. GraphRAG mengganti sebagian logika indeksnya: yang disimpan bukan hanya chunk mirip, melainkan knowledge graph — peta entitas dan relasinya — sehingga retrieval bisa MELOMPAT mengikuti relasi, bukan hanya mencocokkan kemiripan.",
        "Satu detail yang membuat kegagalan ini berbahaya: asisten itu tidak terdengar ragu. Ia menjawab lancar dengan fakta-fakta yang masing-masing benar — Sensor S-9 memang dipakai di lini utama, daftar sanksi memang memuat pelanggar ekspor — hanya saja kesimpulan yang dibutuhkan pengguna tidak pernah dibuat. Di pekerjaan pengadaan dan compliance, jawaban setengah benar seperti ini lebih berisiko daripada jawaban 'tidak tahu', karena ia lolos dari kecurigaan pembacanya.",
        "Pertanyaan yang sama akan kamu jawab sendiri di lab langkah 5 dengan dua cara yang bersaing: pencocokan kata per-dokumen dan penelusuran graph. Kamu tidak diminta percaya pada klaim lesson ini — kamu diminta membuktikannya dari output programmu sendiri.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa vector RAG gagal pada pertanyaan multi-hop dan pertanyaan global; (2) membaca knowledge graph sebagai kumpulan triple (subject, predicate, object); (3) membedakan local search dan global search pada GraphRAG beserta biaya indexing-nya; (4) mengimplementasikan keyword search dan traversal BFS 2-hop, lalu membuktikan sendiri mana yang menemukan rantai jawaban; (5) memilih vector RAG, GraphRAG, atau hybrid dari jenis pertanyaannya — bukan dari tren.",
        "🗺️ Isi lesson (⏱ 62 mnt · 1 lab · 5 kuis · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · Batas vector RAG — Langkah 3 · Knowledge graph — Langkah 4 · Local vs global search — Langkah 5 · Lab: keyword vs BFS — Langkah 6 · Chart evaluasi — Langkah 7 · Peta keputusan — Langkah 8 · Mini-case compliance — Checkpoint.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Simpan pertanyaan gagal itu sebagai spesimen, bukan sebagai aib. Satu pertanyaan multi-hop yang gagal dengan log retrieval yang lengkap — chunk apa saja yang diambil, skor berapa — adalah bahan diagnosis terbaik untuk seluruh lesson ini: ia menunjukkan persis lompatan mana yang hilang, dan lompatan yang hilang itulah yang akan dibeli dengan knowledge graph.",
      },
      reference: "Jawaban multi-hop tidak hilang — ia tersebar, dan hanya relasi yang menyambungkannya.",
    },
    {
      id: "batas-vector-rag",
      eyebrow: "Langkah 2 · Batas vector RAG",
      title: "Kemiripan embedding bukan hubungan",
      prose: [
        "Vector RAG menilai satu hal: seberapa mirip arah vektor pertanyaan dengan arah vektor tiap chunk. Kemiripan itu berguna, tetapi ia buta terhadap hubungan. Chunk 'Sensor S-9 dipasok oleh PT SinarKomponen' dan chunk 'PT SinarKomponen kena sanksi OJK' bisa saja tidak mirip satu sama lain sama sekali — kata-katanya nyaris tidak tumpang tindih — padahal keduanya adalah dua mata rantai dari jawaban yang sama. Retrieval per-chunk tidak punya cara mengetahui bahwa entitas di ujung chunk pertama adalah entitas di awal chunk kedua.",
        "Dua keluarga pertanyaan menabrak batas ini. Pertama, pertanyaan multi-hop: jawabannya adalah gabungan dua fakta atau lebih yang terhubung lewat entitas perantara — pemasok dari komponen, sanksi dari pemasok, pemilik manfaat dari perusahaan, atasan dari manajer proyek. Top-k chunk mirip hampir selalu menangkap satu lompatan dan kehilangan lompatan berikutnya. Kedua, pertanyaan global: 'Apa tema utama seluruh korpus ini?' atau 'Risiko apa yang paling sering muncul di semua kontrak kita?' Tidak ada chunk tunggal yang berisi jawabannya — jawabannya adalah ringkasan atas KESELURUHAN dokumen, dan mengambil 5 chunk termirip untuk pertanyaan se-global itu seperti menebak isi buku dari 5 halaman acak.",
        "Contoh multi-hop lain agar polanya melekat: 'Proyek apa saja yang dikerjakan vendor yang juga memasok komponen untuk pabrik kita di Bekasi?' Lompatan pertama: pabrik Bekasi → komponennya. Lompatan kedua: komponen → vendor pemasoknya. Lompatan ketiga: vendor → proyek-proyek lain yang ia kerjakan. Tiga lompatan, tiga dokumen berbeda, nol dokumen yang memuat jawaban utuh — dan pola yang sama persis muncul di rantai kepemilikan perusahaan, rantai persetujuan, dan rantai dependensi perangkat lunak.",
        "Kegagalan itu struktural, bukan soal tuning. Chunk yang lebih kecil justru memotong relasi yang tadinya satu kalimat menjadi dua potongan terpisah. Embedding yang lebih bagus membuat kemiripan makin akurat, tetapi pertanyaan multi-hop tidak kekurangan kemiripan — ia kekurangan SAMBUNGAN. Bahkan kata-katanya sendiri bisa menipu pencocokan sederhana: 'pemasok' di pertanyaan tidak sama bentuknya dengan 'dipasok' atau 'memasok' di dokumen, seperti yang akan kamu lihat di lab.",
        "Cara membaca formula: cosine similarity mengukur sudut antara dua vektor — nilai 1 berarti searah penuh, 0 berarti tidak berhubungan, dan nilai di antaranya adalah derajat kemiripan topik. Interpretasi untuk GraphRAG: formula ini tidak memiliki tempat untuk menyimpan predicate seperti dipasok_oleh atau kena_sanksi. Relasi bukan sudut; relasi adalah tepi (edge) yang harus disimpan dan ditelusuri secara eksplisit — itulah pekerjaan knowledge graph di langkah berikutnya.",
      ],
      formula: String.raw`\cos(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \, \|\mathbf{b}\|}`,
      formulaNote: "a = vektor embedding pertanyaan; b = vektor embedding sebuah chunk; a · b = dot product (jumlah hasil kali komponen yang sepadan — besar bila banyak arah yang selaras); ||a|| dan ||b|| = panjang (norm) tiap vektor, sebagai penyebut agar hasilnya selalu di rentang -1 sampai 1. Contoh intuisi: pertanyaan dan chunk tentang Sensor S-9 bisa ber-cosine 0,8 (sangat mirip topik), tetapi cosine tidak bisa menyatakan 'pemasok dari Sensor S-9 sedang kena sanksi' — karena pernyataan itu adalah rantai dua relasi, bukan kemiripan satu pasang vektor.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Jawaban multi-hop yang gagal pasti sembuh dengan chunk lebih kecil atau embedding yang lebih bagus.' Tidak. Chunk lebih kecil memutus lebih banyak relasi; embedding lebih bagus hanya mempertajam kemiripan, padahal yang hilang adalah sambungan antar-entitas. Buktinya ada di lab langkah 5: tidak ada satu dokumen pun yang memuat jawaban lengkap, jadi retriever per-dokumen sebaik apa pun tidak bisa mengambil sesuatu yang tidak pernah ada dalam satu dokumen.",
      },
      reference: "Cosine mengukur kemiripan topik. Multi-hop menuntut relasi — dan relasi tidak hidup di dalam sudut antar-vektor.",
    },
    {
      id: "konsep-knowledge-graph",
      eyebrow: "Langkah 3 · Knowledge graph",
      title: "Entitas, relasi, dan triple",
      prose: [
        "Knowledge graph menyimpan pengetahuan sebagai jaringan, bukan sebagai tumpukan teks. Tiga istilah cukup untuk membacanya. Entitas (entity) adalah benda yang bisa ditunjuk: perusahaan, komponen, orang, sanksi, kota — dalam graph ia menjadi node (simpul). Relasi (relation) adalah kata kerja yang menghubungkan dua entitas: memasok, kena_sanksi, berlokasi_di, bekerja_di — dalam graph ia menjadi edge (tepi) berlabel. Pasangan node dan tepinya selalu bisa ditulis sebagai triple: (subject, predicate, object).",
        "Cerita langkah 1 sebagai triple berbunyi begini: (PT NusantaraChip, membutuhkan, Sensor S-9); (Sensor S-9, dipasok_oleh, PT SinarKomponen); (PT SinarKomponen, kena_sanksi, Sanksi OJK); (PT SinarKomponen, berlokasi_di, Jakarta). Empat baris pendek — dan pertanyaan multi-hop yang tadi gagal sekarang tinggal dibaca sebagai jalan di atas peta: mulai dari Sensor S-9, ikuti tepi dipasok_oleh satu lompatan, ikuti tepi kena_sanksi satu lompatan lagi, selesai. Tidak ada tebakan kemiripan; yang ada adalah penelusuran.",
        "Graph ini dibangun saat indexing — dan di sinilah GraphRAG berbeda paling mahal dari vector RAG. Sebuah LLM membaca tiap chunk dan mengekstrak entitas serta relasi di dalamnya (entity extraction dan relation extraction), menormalkan nama yang sama yang ditulis berbeda ('PT SinarKomponen' vs 'SinarKomponen') menjadi satu node — pekerjaan yang disebut entity resolution — lalu menyimpan tiap triple ke graph, sambil tetap menautkan node ke chunk sumbernya. Chunk sumber itu penting: jawaban akhir tetap harus bisa dikutip dari teks asli, bukan dari triple semata.",
        "Graph di sini berperan sebagai INDEKS, bukan pengganti dokumen. Vector index menjawab 'teks apa yang mirip pertanyaan ini'; graph index menjawab 'apa yang terhubung dengan entitas ini'. Keduanya bisa hidup berdampingan di atas korpus yang sama — dan di langkah 7 kamu akan melihat kapan kombinasi keduanya (hybrid) adalah jawaban yang benar.",
        "Entity resolution layak mendapat sorotan sendiri karena di situlah graph produksi paling sering rusak diam-diam. Dokumen nyata menulis entitas yang sama dengan banyak cara: 'PT SinarKomponen', 'SinarKomponen', 'PT Sinar Komponen', bahkan salah ketik. Bila ketiganya menjadi tiga node terpisah, rantai jawaban putus di tengah — traversal berhenti bukan karena relasinya tidak ada, melainkan karena namanya tidak dikenali sebagai entitas yang sama. Ekstraksi yang murah tanpa normalisasi menghasilkan graph yang terlihat besar tetapi bocor di sambungan-sambungannya.",
        "Ukuran graph bukan metrik kualitasnya. Graph dengan 100 ribu triple yang sambungannya bersih mengalahkan graph 1 juta triple yang penuh node duplikat. Yang dihitung saat mengevaluasi indexing bukanlah berapa banyak triple yang dihasilkan, melainkan berapa banyak pertanyaan uji yang rantainya utuh dari ujung ke ujung.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Bayangkan knowledge graph sebagai pohon keluarga yang digambar di papan tulis: nama-nama adalah node, garis berlabel adalah hubungan ('ibu dari', 'bekerja di'). Menjawab 'siapa atasan dari manajer proyek X' di papan itu semudah menarik jari mengikuti garis. Vector RAG seperti mencari di buku telepon berdasarkan nama yang bunyinya mirip — cepat untuk mencari satu nama, tidak berguna untuk mengikuti garis keluarga.",
      },
      reference: "Triple (subject, predicate, object) adalah atom knowledge graph. Graph = indeks relasi; dokumen tetap sumber kutipannya.",
    },
    {
      id: "pencarian-local-global",
      eyebrow: "Langkah 4 · Local vs global search",
      title: "Dua cara mencari di atas graph",
      prose: [
        "Pencarian GraphRAG punya dua mode yang menjawab dua keluarga pertanyaan berbeda. Local search mulai dari entitas yang disebut di pertanyaan, lalu menelusuri tetangganya — traversal 1 sampai 2 hop mengikuti edge — mengumpulkan sub-graph di sekitar entitas itu beserta chunk sumber yang tertaut, lalu menyerahkan semuanya ke LLM untuk disusun menjadi jawaban. Pertanyaan pemasok-dan-sanksi di langkah 1 adalah kasus local search murni: mulai di Sensor S-9, lompat ke pemasoknya, lompat lagi ke sanksinya.",
        "Global search menjawab pertanyaan atas KESELURUHAN korpus — keluarga pertanyaan kedua yang gagal di vector RAG. Pola yang dipopulerkan Microsoft GraphRAG (paper 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization', Edge et al., 2024) bekerja saat indexing: graph besar dipartisi menjadi komunitas (community detection, umumnya algoritma Leiden) — kelompok entitas yang rapat terhubung — lalu LLM menulis ringkasan tiap komunitas (community summary). Saat query global datang, tiap ringkasan komunitas dinilai relevansinya dan dipakai membuat jawaban parsial, lalu jawaban-jawaban parsial itu digabung menjadi jawaban akhir — pola map-reduce di atas ringkasan, bukan di atas chunk mentah.",
        "Harganya jujur dan tidak kecil. Indexing GraphRAG jauh lebih mahal daripada vector RAG: vector RAG cukup satu panggilan embedding per chunk, sedangkan GraphRAG butuh panggilan LLM per chunk untuk ekstraksi entitas-relasi, panggilan lagi untuk ringkasan komunitas, penyimpanan graph, dan pengulangan semua itu setiap dokumen berubah. Pada korpus besar, biaya indexing-nya bisa berkali-kali lipat biaya vector index — belum termasuk waktu bangun yang jauh lebih lama.",
        "Karena itu GraphRAG bukan pengganti default. Kapan TIDAK memakainya: pertanyaan pengguna hampir selalu faktual satu dokumen; korpus berubah sangat cepat sehingga graph selalu basi; korpus kecil yang muat dibaca langsung; atau tim tidak punya anggaran indexing dan evaluasi untuk memeliharanya. GraphRAG dibeli dengan biaya indexing yang nyata — ia hanya sepadan bila pertanyaan relasional dan global benar-benar mendominasi beban kerja.",
        "Urutan pipeline indexing-nya, agar biaya itu terbayang konkret: (1) chunking seperti vector RAG biasa; (2) untuk tiap chunk, satu panggilan LLM mengekstrak entitas dan relasi; (3) entity resolution menggabungkan node yang merujuk entitas sama; (4) graph disimpan beserta tautan node ke chunk sumbernya; (5) community detection mempartisi graph; (6) untuk tiap komunitas, satu panggilan LLM lagi menulis ringkasannya. Langkah 2 dan 6 adalah dua pos yang tidak ada sama sekali di vector RAG — dan keduanya diskalakan oleh ukuran korpus, bukan oleh jumlah pertanyaan.",
        "Konsekuensi praktisnya pada operasi: pertanyaan (query) di GraphRAG tidak selalu lebih lambat — local search bisa sangat cepat karena traversal graph murah — tetapi dokumen BARU tidak bisa ditanya sebelum melewati seluruh rantai ekstraksi. Sistem yang dokumennya berubah tiap jam akan selalu menjawab dari graph yang tertinggal, kecuali tim membayar ekstraksi ulang terus-menerus.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Local search seperti bertanya ke warga setempat: 'dari rumah ini, jalan mana ke rumah sakit?' — jawabannya adalah rute pendek dari satu titik. Global search seperti bertanya ke walikota: 'apa masalah utama kota ini?' — jawabannya butuh ringkasan per kelurahan yang digabung. Dua pertanyaan itu tidak bisa dijawab dengan cara yang sama, dan GraphRAG menyediakan keduanya dengan mesin yang berbeda.",
      },
      reference: "Local = traversal tetangga entitas (untuk multi-hop). Global = community detection + community summaries + map-reduce (untuk tema korpus). Indexing-nya jauh lebih mahal — beli hanya bila pertanyaannya relasional.",
    },
    {
      id: "lab-graphrag",
      eyebrow: "Langkah 5 · Lab GraphRAG",
      title: "Lab: keyword search kalah, BFS 2-hop menang",
      prose: [
        "Lima dokumen pendek dan delapan triple dari cerita yang sama. Pertanyaannya tetap: siapa pemasok Sensor S-9 dan apakah ia kena sanksi. Tugasmu mengimplementasikan dua retrieval dan membandingkan vonisnya sendiri. Cara pertama: keyword match — hitung skor tumpang tindih kata per dokumen, lalu periksa apakah ada SATU dokumen yang memuat jawaban lengkap (menyebut Sensor S-9 dan sanksi sekaligus). Cara kedua: bangun graph dari triple, lalu traversal BFS 2-hop dari Sensor S-9 dengan tetangga yang diurutkan agar hasilnya deterministik, dan rekonstruksi rantai ke Sanksi OJK lewat catatan parent.",
        "Perhatikan mengapa cara pertama gagal secara struktural: skor tertinggi hanya 2 dan diraih dua dokumen berbeda; dokumen pemasok tidak memuat kata sanksi, dokumen sanksi tidak memuat Sensor S-9. Tidak ada dokumen lengkap — bukan karena retriever-nya kurang pintar, melainkan karena jawabannya memang tidak pernah tinggal di satu dokumen.",
        "Coba eksplorasi setelah lolos: (1) ubah START menjadi Baterai B-2 dan TARGET menjadi Tidak ada — rantai apa yang terbentuk dan apa artinya bagi pertanyaan tentang MegaParts. (2) Naikkan batas BFS menjadi 1 hop saja — mengapa Sanksi OJK tidak lagi tercapai. (3) Tambahkan triple (PT SinarKomponen, kena_sanksi, Denda BEI) dan amati mengapa urutan tetangga yang terurut penting agar output tetap stabil.",
        "Dua variabel menjadi bukti utama lab ini dan keduanya diperiksa otomatis: keyword_lengkap harus False (pencocokan per-dokumen memang tidak menemukan jawaban utuh) dan rantai hasil BFS harus persis Sensor S-9 -> PT SinarKomponen -> Sanksi OJK. Bila salah satunya berbeda, periksa kembali definisi dokumen lengkapmu dan urutan tetangga BFS-mu sebelum menyalahkan datanya — datanya sengaja tetap dan deterministik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor_keyword` per dokumen, tentukan `dok_lengkap` dan `keyword_lengkap`" },
        { id: "t2", text: "Bangun `graph` dari TRIPLES, jalankan BFS 2-hop dari START, rekonstruksi `rantai`, isi `pemasok` dan `sanksi`" },
      ],
      expected: "skor_keyword: [(0, 2), (1, 2), (2, 0), (3, 1), (4, 0)]\ndok_lengkap: []\nkeyword_lengkap: False\nvisited_2hop: ['PT SinarKomponen', 'Elektronik', 'Jakarta', 'Sanksi OJK']\nrantai: Sensor S-9 -> PT SinarKomponen -> Sanksi OJK\npemasok: PT SinarKomponen | sanksi: Sanksi OJK\nvonis: GRAPH MENANG UNTUK MULTI-HOP",
      hints: [
        "skor per dokumen = jumlah kata di QUERY_KATA yang muncul di d.lower()",
        "dok_lengkap = dokumen yang memuat 'sensor s-9' DAN 'sanksi' sekaligus — hasilnya daftar kosong",
        "graph[s] berisi daftar (predicate, object); urutkan tiap daftar dengan sorted agar BFS deterministik",
        "BFS: antrean berisi (node, depth); berhenti memperluas node pada depth 2; catat parent tiap node baru",
        "rantai dibangun dengan berjalan mundur dari TARGET mengikuti parent, lalu dibalik",
        "pemasok adalah elemen kedua rantai (indeks 1); sanksi adalah elemen terakhirnya",
      ],
      code: {
        starter: "# SEED — jangan ubah\nDOCS = [\n    \"PT NusantaraChip membutuhkan Sensor S-9 untuk lini produksi utama\",\n    \"Sensor S-9 dipasok oleh PT SinarKomponen sejak tahun 2023\",\n    \"PT MegaParts memasok Baterai B-2 untuk banyak pabrik elektronik\",\n    \"Daftar sanksi OJK: PT SinarKomponen kena sanksi karena pelanggaran ekspor\",\n    \"PT SinarKomponen berlokasi di Jakarta dan memiliki 200 karyawan\",\n]\nTRIPLES = [\n    (\"PT NusantaraChip\", \"membutuhkan\", \"Sensor S-9\"),\n    (\"Sensor S-9\", \"dipasok_oleh\", \"PT SinarKomponen\"),\n    (\"Sensor S-9\", \"kategori\", \"Elektronik\"),\n    (\"PT SinarKomponen\", \"berlokasi_di\", \"Jakarta\"),\n    (\"PT SinarKomponen\", \"kena_sanksi\", \"Sanksi OJK\"),\n    (\"PT NusantaraChip\", \"membutuhkan\", \"Baterai B-2\"),\n    (\"Baterai B-2\", \"dipasok_oleh\", \"PT MegaParts\"),\n    (\"PT MegaParts\", \"kena_sanksi\", \"Tidak ada\"),\n]\nQUERY_KATA = [\"sensor\", \"s-9\", \"pemasok\", \"sanksi\"]\nSTART = \"Sensor S-9\"\nTARGET = \"Sanksi OJK\"\n\n# TULIS KODEMU (di bawah garis ini)\n# TODO t1: skor_keyword, dok_lengkap, keyword_lengkap\nskor_keyword = []\ndok_lengkap = []\nkeyword_lengkap = False\n# TODO t2: graph, BFS 2-hop, rantai, pemasok, sanksi\ngraph = {}\nvisited_2hop = []\nrantai = []\npemasok = \"\"\nsanksi = \"\"\njumlah_visited = 0\n\n# UJI (jangan ubah)\nprint(f\"skor_keyword: {skor_keyword}\")\nprint(f\"dok_lengkap: {dok_lengkap}\")\nprint(f\"keyword_lengkap: {keyword_lengkap}\")\nprint(f\"visited_2hop: {visited_2hop}\")\nprint(\"rantai:\", \" -> \".join(rantai))\nprint(f\"pemasok: {pemasok} | sanksi: {sanksi}\")\nprint(\"vonis: GRAPH MENANG UNTUK MULTI-HOP\" if not keyword_lengkap and sanksi == TARGET else \"vonis: TIDAK JELAS\")",
        lockLines: 21,
        solution: "# SEED — jangan ubah\nDOCS = [\n    \"PT NusantaraChip membutuhkan Sensor S-9 untuk lini produksi utama\",\n    \"Sensor S-9 dipasok oleh PT SinarKomponen sejak tahun 2023\",\n    \"PT MegaParts memasok Baterai B-2 untuk banyak pabrik elektronik\",\n    \"Daftar sanksi OJK: PT SinarKomponen kena sanksi karena pelanggaran ekspor\",\n    \"PT SinarKomponen berlokasi di Jakarta dan memiliki 200 karyawan\",\n]\nTRIPLES = [\n    (\"PT NusantaraChip\", \"membutuhkan\", \"Sensor S-9\"),\n    (\"Sensor S-9\", \"dipasok_oleh\", \"PT SinarKomponen\"),\n    (\"Sensor S-9\", \"kategori\", \"Elektronik\"),\n    (\"PT SinarKomponen\", \"berlokasi_di\", \"Jakarta\"),\n    (\"PT SinarKomponen\", \"kena_sanksi\", \"Sanksi OJK\"),\n    (\"PT NusantaraChip\", \"membutuhkan\", \"Baterai B-2\"),\n    (\"Baterai B-2\", \"dipasok_oleh\", \"PT MegaParts\"),\n    (\"PT MegaParts\", \"kena_sanksi\", \"Tidak ada\"),\n]\nQUERY_KATA = [\"sensor\", \"s-9\", \"pemasok\", \"sanksi\"]\nSTART = \"Sensor S-9\"\nTARGET = \"Sanksi OJK\"\n\n# TULIS KODEMU (di bawah garis ini)\nskor_keyword = [(i, sum(1 for k in QUERY_KATA if k in d.lower())) for i, d in enumerate(DOCS)]\ndok_lengkap = [i for i, d in enumerate(DOCS) if \"sensor s-9\" in d.lower() and \"sanksi\" in d.lower()]\nkeyword_lengkap = len(dok_lengkap) > 0\ngraph = {}\nfor s, p, o in TRIPLES:\n    graph.setdefault(s, []).append((p, o))\nfor s in graph:\n    graph[s] = sorted(graph[s])\nfrom collections import deque\nparent = {START: None}\nvisited_2hop = []\nseen = {START}\nqueue = deque([(START, 0)])\nwhile queue:\n    node, depth = queue.popleft()\n    if depth >= 2:\n        continue\n    for p, nxt in graph.get(node, []):\n        if nxt not in seen:\n            seen.add(nxt)\n            parent[nxt] = node\n            visited_2hop.append(nxt)\n            queue.append((nxt, depth + 1))\nrantai = []\ncur = TARGET if TARGET in parent else None\nwhile cur is not None:\n    rantai.append(cur)\n    cur = parent.get(cur)\nrantai.reverse()\npemasok = rantai[1] if len(rantai) > 1 else \"\"\nsanksi = rantai[-1] if rantai else \"\"\njumlah_visited = len(visited_2hop)\n\n# UJI (jangan ubah)\nprint(f\"skor_keyword: {skor_keyword}\")\nprint(f\"dok_lengkap: {dok_lengkap}\")\nprint(f\"keyword_lengkap: {keyword_lengkap}\")\nprint(f\"visited_2hop: {visited_2hop}\")\nprint(\"rantai:\", \" -> \".join(rantai))\nprint(f\"pemasok: {pemasok} | sanksi: {sanksi}\")\nprint(\"vonis: GRAPH MENANG UNTUK MULTI-HOP\" if not keyword_lengkap and sanksi == TARGET else \"vonis: TIDAK JELAS\")",
        checks: [
          { kind: "equal", task: "t1", name: "keyword_lengkap", value: false, label: "`keyword_lengkap` = False", msg: "Tidak ada satu dokumen pun yang memuat Sensor S-9 dan sanksi sekaligus." },
          { kind: "stdout_matches", task: "t1", pattern: "dok_lengkap: \\[\\]", label: "Daftar dokumen lengkap kosong", msg: "Jawaban lengkap memang tidak tinggal di satu dokumen." },
          { kind: "stdout_matches", task: "t1", pattern: "skor_keyword: \\[\\(0, 2\\), \\(1, 2\\), \\(2, 0\\), \\(3, 1\\), \\(4, 0\\)\\]", label: "Skor keyword per dokumen benar", msg: "Dua dokumen terikat di skor 2 — tidak ada pemenang yang lengkap." },
          { kind: "equal", task: "t2", name: "pemasok", value: "PT SinarKomponen", label: "`pemasok` = PT SinarKomponen", msg: "Hop pertama BFS: Sensor S-9 dipasok_oleh PT SinarKomponen." },
          { kind: "equal", task: "t2", name: "sanksi", value: "Sanksi OJK", label: "`sanksi` = Sanksi OJK", msg: "Hop kedua BFS: PT SinarKomponen kena_sanksi Sanksi OJK." },
          { kind: "equal", task: "t2", name: "jumlah_visited", value: 4, label: "`jumlah_visited` = 4", msg: "BFS 2-hop mengunjungi PT SinarKomponen, Elektronik, Jakarta, Sanksi OJK." },
          { kind: "stdout_matches", task: "t2", pattern: "rantai: Sensor S-9 -> PT SinarKomponen -> Sanksi OJK", label: "Rantai multi-hop tercetak", msg: "Inilah jawaban lengkap yang gagal ditemukan keyword search." },
          { kind: "stdout_matches", task: "t2", pattern: "vonis: GRAPH MENANG UNTUK MULTI-HOP", label: "Vonis tercetak", msg: "Graph menang khusus untuk pertanyaan multi-hop." },
        ],
      },
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Lab ini membuktikan graph selalu lebih baik dari keyword atau vector.' Tidak. Lab ini membuktikan satu hal sempit: untuk pertanyaan yang jawabannya adalah RANTAI relasi, penelusuran relasi menemukan rantai itu sedangkan pencocokan per-dokumen tidak. Untuk pertanyaan satu fakta, kedua cara sama-sama benar — chart di langkah berikutnya menunjukkan persis itu, dengan angka.",
      },
      reference: "Keyword mencari di dalam dokumen. BFS mencari di antara dokumen — mengikuti relasi yang menghubungkannya.",
    },
    {
      id: "chart-evaluasi",
      eyebrow: "Langkah 6 · Chart",
      title: "Angka evaluasinya: menang di multi-hop, seri di faktual",
      prose: [
        "Set uji mainan yang dipakai di seluruh lesson ini berisi 10 pertanyaan atas korpus perusahaan yang sama: 6 pertanyaan multi-hop (pemasok dari komponen, sanksi dari pemasok, kota dari pemasok komponen lain, dan variasinya) dan 4 pertanyaan faktual sederhana (satu fakta, satu dokumen). Tiap pertanyaan dinilai benar hanya bila jawabannya lengkap — untuk multi-hop, lengkap berarti seluruh rantainya benar, bukan separuh.",
        "Cara membaca: tiap kelompok adalah satu keluarga pertanyaan; batang abu adalah keyword/vector, batang berwarna adalah graph. Tinggi batang adalah proporsi jawaban benar, label di atas batang adalah skor mentahnya. Pada kelompok multi-hop, bacalah 1/6 melawan 5/6; pada kelompok faktual, bacalah 4/4 melawan 4/4.",
        "Interpretasi: keunggulan graph terkonsentrasi persis di tempat teorinya menjanjikan — pertanyaan multi-hop melonjak dari 1/6 menjadi 5/6 karena traversal memang dirancang untuk mengikuti rantai. Satu-satunya multi-hop yang masih gagal di graph adalah pertanyaan yang entitas perantaranya diekstrak dengan nama yang tidak konsisten saat indexing, pengingat bahwa kualitas graph ditentukan kualitas ekstraksinya. Pada pertanyaan faktual sederhana keduanya SAMA, 4/4 melawan 4/4: tidak ada rantai untuk ditelusuri, jadi graph tidak menambah apa pun selain biaya indexing. GraphRAG bukan jawaban yang selalu lebih baik — ia jawaban yang lebih baik untuk keluarga pertanyaan tertentu, dan chart ini adalah cara jujur menunjukkannya.",
      ],
      figure: {
        svg: FIG_EVAL,
        alt: "Bar chart: multi-hop keyword/vector 1/6 vs graph 5/6; faktual sederhana 4/4 vs 4/4.",
        caption: "Set uji mainan 10 pertanyaan (6 multi-hop + 4 faktual) — konsisten dengan lab langkah 5: graph menang di multi-hop, seri di faktual.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Satu pertanyaan multi-hop yang masih gagal di graph (5/6, bukan 6/6) sama pentingnya dengan lima yang berhasil: kegagalannya bukan di traversal, melainkan di indexing — nama entitas perantaranya terekstrak tidak konsisten sehingga rantainya putus. Di sistem GraphRAG, sebagian besar kegagalan jawaban adalah kegagalan ekstraksi yang terjadi jauh sebelum pertanyaan diajukan.",
      },
      reference: "Graph menang di multi-hop (5/6 vs 1/6), seri di faktual (4/4 vs 4/4). Beli graph untuk rantainya, bukan untuk faktanya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Vector cukup, GraphRAG, atau hybrid?",
      prose: [
        "Skenario 1 — pertanyaan faktual satu dokumen mendominasi ('berapa nomor kontrak X', 'kapan pengiriman Y') → vector RAG cukup. Tambahkan rerank bila perlu. Membeli GraphRAG untuk beban ini membayar indexing mahal demi keunggulan nol, persis seperti kelompok faktual 4/4 vs 4/4 di chart.",
        "Skenario 2 — pertanyaan multi-hop atas korpus yang relatif stabil (rantai pasok, struktur kepemilikan, relasi nasabah–perusahaan–sanksi) → GraphRAG dengan local search. Rantainya adalah produknya; traversal adalah satu-satunya cara mengambilnya dengan andal.",
        "Skenario 3 — pertanyaan global atas korpus ('tema utama seluruh laporan risiko tahun ini') → GraphRAG dengan global search: community detection dan community summaries. Vector RAG secara struktural tidak bisa menjawab pertanyaan yang jawabannya adalah ringkasan keseluruhan.",
        "Skenario 4 — beban campuran: sebagian faktual, sebagian relasional, sebagian global → hybrid. Router sederhana mengklasifikasikan pertanyaan: faktual ke vector index, relasional ke local search, global ke community summaries. Mulai dari vector sebagai jalur default dan graph sebagai jalur khusus — bukan sebaliknya — agar biaya mengikuti kebutuhan.",
        "Skenario 5 — korpus berubah tiap jam, atau anggaran indexing nyaris nol, atau belum ada bukti pertanyaan relasional mendominasi log → JANGAN GraphRAG dulu. Pakai vector RAG + rerank, catat pertanyaan yang gagal, dan jadikan log kegagalan itu bukti untuk keputusan membeli graph nanti.",
        "Aturan 10 detik: tanyakan tiga hal tentang pertanyaan tipikalmu. (1) Apakah jawabannya melompat antar-entitas? Tidak → vector cukup. (2) Apakah jawabannya ringkasan seluruh korpus? Ya → global search. (3) Apakah korpusnya cukup stabil dan anggaran indexing-nya ada? Tidak → tunda GraphRAG, perkuat vector dulu. Tiga jawaban itu menentukan arsitekturmu lebih jujur daripada daftar tren mana pun.",
        "Cara paling murah menguji aturan itu sebelum membangun apa pun: ambil 50 pertanyaan nyata dari log produksimu, klasifikasikan manual menjadi faktual, multi-hop, dan global, lalu ukur berapa yang gagal di sistem vector yang sudah ada. Bila multi-hop plus global di bawah sekitar sepersepuluh dari total pertanyaan, GraphRAG hampir pasti belum sepadan. Bila keduanya mendekati sepertiga dan kegagalannya terkonsentrasi di sana, kamu baru saja menulis justifikasi anggarannya dari data, bukan dari opini.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pilih retrieval seperti memilih kendaraan: vector RAG adalah motor — murah, cepat, cukup untuk hampir semua perjalanan dalam kota. GraphRAG adalah truk dengan peta sambungan antarkota — mahal dirawat, tetapi satu-satunya yang masuk akal bila perjalananmu memang selalu antarkota. Hybrid adalah garasi yang punya keduanya dan memilih per perjalanan.",
      },
      reference: "Faktual → vector. Multi-hop → local search. Global → community summaries. Campuran → hybrid dengan vector sebagai default.",
    },
    {
      id: "minicase-compliance",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: tim compliance bank dan 40 ribu dokumen",
      prose: [
        "Situasi: tim compliance sebuah bank memelihara 40.000 dokumen — kontrak nasabah, dokumen KYC, daftar sanksi yang diperbarui berkala, dan berita acara pemeriksaan. Pola pertanyaan analisnya relasional: 'Nasabah mana saja yang terhubung ke perusahaan X lewat pemilik manfaat yang sama, dan apakah ada yang terkait entitas kena sanksi?' Anggaran indexing terbatas: tim hanya sanggup menjalankan ekstraksi LLM intensif untuk sebagian korpus pada putaran pertama, dan direksi meminta bukti manfaat sebelum anggaran penuh disetujui.",
        "Pertanyaan 1: arsitektur apa yang kamu usulkan untuk putaran pertama — vector penuh, GraphRAG penuh, atau hybrid bertahap — dan mengapa?",
        "Pertanyaan 2: bila ekstraksi graph hanya mampu mencakup sebagian dokumen dulu, subset mana yang diprioritaskan dan apa risikonya?",
        "Pertanyaan 3: bukti apa yang kamu tunjukkan ke direksi untuk membuka anggaran putaran berikutnya?",
        "Satu batasan tambahan dari situasi ini: daftar sanksi berubah berkala, jadi bagian graph yang menyangkut sanksi menua paling cepat. Jawaban yang mengutip status sanksi dari graph basi bukan sekadar tidak akurat — ia bisa dibaca sebagai keputusan yang diambil dari data yang sudah dicabut. Jadwal ekstraksi ulang untuk subset sanksi harus lebih rapat daripada subset lain, dan tiap jawaban wajib mencantumkan tanggal daftar sanksi yang menjadi sumbernya.",
        "Pembahasan: (1) Hybrid bertahap. Vector RAG tetap menjadi default untuk pertanyaan faktual yang volumenya besar; GraphRAG dibangun hanya sebagai jalur khusus pertanyaan relasional. GraphRAG penuh sejak hari pertama menghabiskan anggaran pada dokumen yang tidak pernah ditanya secara relasional, sedangkan vector penuh membiarkan pertanyaan terpenting tim — rantai kepemilikan dan sanksi — tetap gagal seperti di langkah 1. (2) Prioritaskan dokumen berisiko dan berelasi padat: dokumen KYC dan pemilik manfaat, daftar sanksi terbaru, serta kontrak nasabah bernilai besar. Risikonya jujur: rantai yang melewati dokumen di luar subset akan terputus diam-diam, jadi setiap jawaban graph wajib menampilkan rantai dan sumbernya agar analis bisa melihat hop mana yang hilang — dan cakupan subset harus dicatat sebagai batas sistem, bukan disembunyikan. (3) Bukti yang meyakinkan adalah set uji internal bergaya langkah 6: kumpulkan 30–50 pertanyaan nyata analis (sebagian multi-hop, sebagian faktual), ukur jawaban lengkap vector saja melawan hybrid, dan laporkan selisihnya terutama di multi-hop beserta waktu analis yang dihemat. Angka selisih pada pertanyaan nyata — bukan demo — adalah bahasa yang membuka anggaran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di compliance, jawaban relasional yang setengah benar lebih berbahaya daripada tidak ada jawaban: rantai kepemilikan yang terputus di tengah bisa membuat entitas kena sanksi lolos saringan. Karena itu jawaban GraphRAG di domain ini wajib menyertakan rantainya — entitas, relasi, dan dokumen sumber tiap hop — agar analis bisa mengaudit jalannya, bukan hanya membaca kesimpulannya.",
      },
      reference: "Anggaran terbatas bukan alasan menolak graph — itu alasan membangunnya bertahap, di subset berisiko, dengan bukti selisih yang terukur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi menjelaskan alasan benar atau salahnya.",
      ],
      tasks: [],
      summary: [
        "Vector RAG gagal di multi-hop dan pertanyaan global karena cosine similarity mengukur kemiripan topik per-chunk, bukan hubungan antar-entitas atau ringkasan korpus.",
        "Knowledge graph menyimpan triple (subject, predicate, object); ia dibangun saat indexing lewat ekstraksi entitas-relasi oleh LLM plus entity resolution, dan berperan sebagai indeks di atas dokumen sumber.",
        "Local search = traversal tetangga entitas untuk pertanyaan multi-hop; global search = community detection + community summaries + map-reduce untuk pertanyaan atas seluruh korpus (pola Microsoft GraphRAG).",
        "Di lab, keyword search menemukan nol dokumen lengkap (dok_lengkap kosong), sedangkan BFS 2-hop yang deterministik menemukan rantai Sensor S-9 -> PT SinarKomponen -> Sanksi OJK.",
        "Di set uji mainan, graph menang di multi-hop (5/6 vs 1/6) dan seri di faktual (4/4 vs 4/4) — GraphRAG dibeli untuk pertanyaan relasional, bukan untuk semua pertanyaan.",
        "Keputusan praktis: faktual → vector, multi-hop → local search, global → community summaries, campuran → hybrid; korpus yang berubah cepat atau tanpa anggaran indexing adalah alasan menunda GraphRAG.",
      ],
      quiz: [
        {
          q: "Mengapa vector RAG gagal menjawab 'siapa pemasok Sensor S-9 dan apakah ia kena sanksi' meski semua dokumennya ada?",
          options: [
            { text: "Jawabannya adalah rantai dua relasi yang tersebar di tiga dokumen; tidak ada chunk tunggal yang memuatnya, dan cosine tidak menyimpan relasi", why: "Tepat: retrieval per-chunk mengambil potongan yang mirip topik, tetapi sambungan dipasok_oleh lalu kena_sanksi tidak pernah diambil sebagai satu kesatuan.", correct: true },
            { text: "Embedding-nya kurang bagus sehingga chunk yang benar tidak pernah mirip", why: "Bukan akar masalahnya: chunk yang diambil memang mirip topik — yang hilang adalah sambungan antar-entitas, dan embedding yang lebih bagus tidak menyimpannya.", correct: false },
            { text: "Chunk-nya terlalu besar sehingga LLM kehabisan konteks", why: "Chunk lebih kecil justru memutus lebih banyak relasi; masalahnya struktural, bukan ukuran konteks.", correct: false },
            { text: "LLM-nya terlalu kecil untuk menyimpulkan jawaban", why: "LLM tidak bisa menyimpulkan dari konteks yang rantainya tidak pernah diberikan; mengganti LLM tidak memperbaiki retrieval.", correct: false },
          ],
        },
        {
          q: "Manakah yang merupakan triple yang benar untuk fakta 'PT SinarKomponen kena sanksi OJK'?",
          options: [
            { text: "(PT SinarKomponen, kena_sanksi, Sanksi OJK)", why: "Tepat: subject = PT SinarKomponen, predicate = kena_sanksi, object = Sanksi OJK.", correct: true },
            { text: "(kena_sanksi, PT SinarKomponen, Jakarta)", why: "Predicate menempati posisi subject dan object-nya kota yang tidak berhubungan dengan fakta sanksi.", correct: false },
            { text: "(Sensor S-9, PT SinarKomponen, Sanksi OJK)", why: "Posisi predicate diisi nama perusahaan — predicate harus relasinya, bukan entitas.", correct: false },
            { text: "(PT SinarKomponen, Sanksi OJK, kena_sanksi)", why: "Predicate dan object tertukar: urutan triple adalah (subject, predicate, object).", correct: false },
          ],
        },
        {
          q: "Pertanyaan analis: 'Apa tema risiko utama di seluruh 40 ribu dokumen kita tahun ini?' Mode pencarian GraphRAG yang tepat?",
          options: [
            { text: "Global search — community detection, community summaries, lalu map-reduce atas ringkasan", why: "Tepat: jawabannya adalah ringkasan keseluruhan korpus, dan itulah yang dibangun community summaries saat indexing.", correct: true },
            { text: "Local search — traversal 2-hop dari entitas 'risiko'", why: "Traversal tetangga menjawab pertanyaan tentang satu entitas, bukan tema seluruh korpus.", correct: false },
            { text: "Vector search top-5 chunk termirip", why: "Lima chunk acak tidak mewakili 40 ribu dokumen — persis kegagalan pertanyaan global di vector RAG.", correct: false },
            { text: "Keyword search dengan kata 'risiko utama'", why: "Kecocokan kata tidak menghasilkan ringkasan tema; ia hanya menemukan dokumen yang memuat frasa itu.", correct: false },
          ],
        },
        {
          q: "Kapan GraphRAG sebaiknya TIDAK dipakai meski pertanyaan relasional kadang muncul?",
          options: [
            { text: "Korpus berubah sangat cepat dan anggaran indexing terbatas, sementara mayoritas pertanyaan faktual sederhana", why: "Tepat: graph akan selalu basi dan biaya ekstraksi LLM per chunk tidak terbayar oleh mayoritas pertanyaan yang sudah dijawab vector dengan benar.", correct: true },
            { text: "Korpusnya besar", why: "Korpus besar justru habitat pertanyaan global dan relasional — ukuran saja bukan kontraindikasi.", correct: false },
            { text: "Tim sudah memiliki vector index yang berjalan", why: "Graph adalah indeks tambahan di atas korpus yang sama; keberadaan vector index tidak menghalangi, malah menjadi fondasi hybrid.", correct: false },
            { text: "Pertanyaan relasional adalah beban utama analis", why: "Itu justru alasan terkuat MEMAKAI GraphRAG, bukan menundanya.", correct: false },
          ],
        },
        {
          q: "Di chart evaluasi, graph dan keyword/vector sama-sama 4/4 pada pertanyaan faktual. Kesimpulan yang benar?",
          options: [
            { text: "Untuk pertanyaan satu fakta, graph tidak menambah akurasi — keunggulan GraphRAG spesifik untuk multi-hop, jadi pilih arsitektur dari jenis pertanyaannya", why: "Tepat: 5/6 vs 1/6 di multi-hop dan 4/4 vs 4/4 di faktual berarti graph dibeli untuk rantainya, dan hybrid adalah bentuk jujurnya.", correct: true },
            { text: "Graph selalu lebih baik, chart-nya saja yang kurang besar", why: "Seri di faktual adalah hasil yang informatif, bukan kekurangan data — tidak ada rantai untuk ditelusuri pada pertanyaan satu fakta.", correct: false },
            { text: "Keyword/vector harus selalu diganti graph di semua sistem", why: "Mengganti semuanya membayar biaya indexing graph juga untuk pertanyaan yang tidak membutuhkannya.", correct: false },
            { text: "Evaluasinya salah karena graph seharusnya menang di semua kategori", why: "Harapan bahwa satu metode menang di semua kategori adalah asumsi yang justru dibantah evaluasi ini.", correct: false },
          ],
        },
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      reference: "GraphRAG = retrieval yang mengikuti relasi. Pakai bila jawabannya adalah rantai atau ringkasan korpus — ukur dulu, baru beli.",
    },
  ],
};
