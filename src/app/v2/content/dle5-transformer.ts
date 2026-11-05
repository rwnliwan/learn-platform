import type { V2Lesson } from "../lib/types";

// Blok attention: Q bertanya ke K, bobot dari softmax, V dirata-rata berbobot.
const ATTN_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram attention: query dikalikan key, softmax, lalu mengalikan value.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="20" y="30" width="100" height="44" rx="8" fill="var(--c1)" opacity="0.9"/><text x="70" y="57" fill="#fff" font-weight="600">Query</text>
<rect x="150" y="30" width="100" height="44" rx="8" fill="var(--c2)" opacity="0.9"/><text x="200" y="57" fill="#fff" font-weight="600">Key</text>
<rect x="280" y="30" width="100" height="44" rx="8" fill="var(--c3)" opacity="0.9"/><text x="330" y="57" fill="#fff" font-weight="600">Value</text>
<rect x="180" y="110" width="140" height="48" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="250" y="130" fill="var(--text)">skor = QK^T / √d</text>
<text x="250" y="148" fill="var(--text-muted)" font-size="11">kecocokan tiap pasangan</text>
<rect x="180" y="180" width="140" height="44" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="250" y="207" fill="#fff" font-weight="600">softmax → bobot</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah3)">
<defs><marker id="ah3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="120" y1="52" x2="180" y2="120"/><line x1="200" y1="74" x2="220" y2="110"/>
<line x1="330" y1="74" x2="290" y2="180"/><line x1="250" y1="158" x2="250" y2="180"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text-muted)" text-anchor="middle">
<text x="250" y="252">output = Σ bobot_i × V_i : rata-rata berbobot dari value</text>
</g>
</svg>`;

export const dle5: V2Lesson = {
  slug: "dle5-transformer",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE5 — Transformer Mendalam",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-chatbot",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Chatbot yang salah paham kata ganti",
      prose: [
        "Bank meluncurkan chatbot CS berbasis model bahasa lama (LSTM). Nasabah menulis: Saya transfer ke rekening tabungan, tapi dananya belum masuk ke sana. Bot menjawab dengan panduan transfer ke rekening giro — ia mengira sana merujuk ke rekening yang salah disebut di awal percakapan, bukan tabungan di kalimat yang sama.",
        "Satu kata ganti yang salah dirujuk, satu nasabah marah, satu komplain viral. Model LSTM-nya membaca kata per kata dan menyimpan makna dalam satu vektor ingatan — saat kata sana tiba, konteks tabungan sudah terkubur di bawah puluhan kata lain.",
        "Twist-nya: masalah ini tidak diselesaikan dengan ingatan yang lebih besar, melainkan dengan menghapus ingatan berantai sama sekali. Transformer membiarkan kata sana langsung bertanya ke semua kata lain: siapa yang paling cocok menjadi rujukanmu? — dan kata tabungan menjawab paling kuat. Lesson ini membedah mekanisme tanya-jawab itu sampai ke angkanya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mekanisme Q, K, V dalam attention; (2) menghitung kompleksitas attention O(n²) dan implikasinya; (3) menjelaskan multi-head attention dan positional encoding; (4) menghitung kebutuhan memori attention untuk kontrak 4.096 token.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Salah rujuk dalam dokumen hukum atau laporan keuangan = risiko operasional. Memahami attention membantumu menilai kapan model bahasa bisa dipercaya untuk ekstraksi presisi — dan kapan butuh verifikasi manusia.",
      },
      reference: "Attention = setiap posisi boleh bertanya langsung ke semua posisi lain.",
    },
    {
      id: "attention",
      eyebrow: "Langkah 2 · Self-attention",
      title: "Q, K, V: rapat di mana semua bicara sekaligus",
      prose: [
        "Setiap posisi membuat tiga vektor dari embedding-nya: Query (apa yang kucari?), Key (apa yang kutawarkan?), Value (apa isi sebenarnya yang kubawa?). Kecocokan query_i dengan key_j = dot product q_i·k_j: semakin sejajar, semakin relevan posisi j bagi posisi i.",
        "Skor dibagi √d_k (d_k = dimensi key), lalu softmax per baris menjadi bobot yang jumlahnya 1. Output posisi i = Σ_j bobot_ij · v_j: rata-rata berbobot dari semua value. Kata sana mendapat bobot besar dari kata tabungan → representasinya ditarik ke makna tabungan. Itulah coreference resolution dalam bentuk aritmetika.",
        "Contoh dari lab (2 posisi, d=2): Q=K=identitas, V=[[1,2],[3,4]]. Skor = [[0,7071, 0],[0, 0,7071]]. Softmax baris 1: [0,6698, 0,3302] — posisi 1 memperhatikan dirinya sendiri 67% dan posisi 2 sebesar 33%. Output baris 1 = 0,6698×[1,2] + 0,3302×[3,4] = [1,6605, 2,6605]. Jumlah bobot tiap baris tepat 1,0000 — selalu, karena softmax.",
        "💡 Intuisi: bagi dengan √d_k bukan kosmetik. Tanpa pembagi, dot product vektor berdimensi besar punya variansi besar → softmax jenuh (satu bobot ≈1, sisanya ≈0) → gradien mati. √d_k menjaga skor dalam rentang sehat. Satu baris kode, perbedaan antara training jalan vs macet.",
        "💡 Intuisi: Q, K, V adalah tiga peran dari satu embedding. Analoginya: di perpustakaan, query = pertanyaanmu, key = judul katalog, value = isi buku. Kamu mencocokkan pertanyaan dengan katalog (Q·K), lalu membaca isi buku yang cocok (V berbobot).",
        "Cara membaca: tiga kotak atas = Query, Key, Value; kotak tengah = skor kecocokan QK^T/√d; kotak ungu = softmax menjadi bobot; panah bawah = bobot dikali Value lalu dijumlahkan.",
        "Interpretasi: alirannya persis rumus Attention(Q,K,V): cocokkan dulu (skor), normalkan (bobot berjumlah 1), lalu kumpulkan isi (rata-rata berbobot dari V).",
        "Contoh angka attention — 3 kata. Kata: “saya makan apel”. Query “makan” vs Key: saya=0,2, makan=1,0, apel=0,8. Softmax: e^0,2=1,22, e^1,0=2,72, e^0,8=2,23 — total 6,17. Bobot: 0,20 / 0,44 / 0,36. Representasi “makan” = 0,20×V(saya) + 0,44×V(makan) + 0,36×V(apel) — 44 persen dirinya sendiri, 36 persen objeknya! Kata kerja “memperhatikan” objeknya. Inilah mengapa attention menangkap relasi: bobot = seberapa relevan tiap kata untuk kata ini.",
        "Mengapa dibagi akar-d? Tanpa scaling, dot product Q·K tumbuh dengan dimensi (d=64: rata-rata |dot|~8) → softmax MENJENUH (satu bobot ~1, sisanya ~0) → gradient nol → tidak belajar. Dibagi akar-64=8: dot kembali ke rentang ~1 → softmax “lunak” → gradient mengalir. Satu pembagian = perbedaan antara model yang belajar dan yang mati. Detail kecil, efek besar — khas deep learning.",
        "Self-attention vs cross-attention — dua peran. Self: Q, K, V dari SUMBER YANG SAMA (kata memperhatikan kata lain dalam kalimat yang sama) — untuk pemahaman. Cross: Q dari decoder, K/V dari encoder (jawaban memperhatikan pertanyaan) — untuk seq2seq/translation. Chatbot CS: self-attention memahami “saya transfer ke rekening tabungan, tapi dananya belum masuk ke sana” (sana = rekening tabungan!), cross-attention tidak diperlukan (bukan translation). Pilih jenis sesuai TUGAS.",
      ],
      formula: String.raw`\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^T}{\sqrt{d_k}}\right) V`,
      formulaNote: "Q = matriks query (n×d_k); K = matriks key (n×d_k); V = matriks value (n×d_v); n = panjang sekuens; d_k = dimensi key. QK^T = matriks skor n×n; softmax per baris → bobot; dikali V = rata-rata berbobot.",
      figure: {
        svg: ATTN_SVG,
        alt: "Diagram alir attention: query dan key menghasilkan skor, softmax menjadi bobot, dikalikan value.",
        caption: "Alur self-attention: cocokkan (Q·K), normalkan (softmax), kumpulkan (×V).",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung matriks bobot attention `A` (softmax per baris)" },
        { id: "t2", text: "Hitung `out = A @ V`" },
        { id: "t3", text: "Ambil `v00` = out[0,0] dibulatkan 4 desimal" },
      ],
      expected: "bobot_baris1=[0.6698, 0.3302]  v00=1.6605",
      note: {
        title: "🚨 Mitos: bobot attention = penjelasan keputusan model",
        type: "pitfall",
        body: "Yang benar: bobot attention menunjukkan ke mana informasi mengalir, bukan mengapa keputusan diambil. Bobot besar ke kata tabungan tidak membuktikan model memakai tabungan untuk keputusannya — value yang dibawa dan lapisan sesudahnya ikut menentukan. Attention sebagai explanation tool masih diperdebatkan di literatur; jangan jual heatmap attention ke auditor sebagai bukti.",
      },
      hints: [
        "skor = Q @ K.T / sqrt(d); softmax: exp(skor)/jumlah per baris.",
        "Gunakan keepdims=True agar pembagian per baris benar.",
        "v00 = round(float(out[0,0]), 4)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(5)\n\nQ = np.array([[1., 0.], [0., 1.]])\nK = np.array([[1., 0.], [0., 1.]])\nV = np.array([[1., 2.], [3., 4.]])\n\n# TULIS KODEMU: scaled dot-product attention\nd = \nskor = \nA = \nout = \nv00 = \n\nprint(f"bobot_baris1={np.round(A[0], 4).tolist()}  v00={v00}")`,
        lockLines: 6,
        solution: `import numpy as np\nnp.random.seed(5)\n\nQ = np.array([[1., 0.], [0., 1.]])\nK = np.array([[1., 0.], [0., 1.]])\nV = np.array([[1., 2.], [3., 4.]])\n\n# TULIS KODEMU: scaled dot-product attention\nd = Q.shape[1]\nskor = Q @ K.T / np.sqrt(d)\nA = np.exp(skor) / np.exp(skor).sum(axis=1, keepdims=True)\nout = A @ V\nv00 = round(float(out[0, 0]), 4)\n\nprint(f"bobot_baris1={np.round(A[0], 4).tolist()}  v00={v00}")`,
        checks: [
          { kind: "defined", task: "t1", name: "A", label: "`A` terdefinisi", msg: "Simpan matriks bobot di A." },
          { kind: "equal", task: "t3", name: "v00", value: 1.6605, tol: 1e-4, label: "`v00` seharusnya 1.6605", msg: "0.6698x1 + 0.3302x3 = 1.6605. Cek softmax per baris (axis=1)." },
          { kind: "stdout_matches", task: "t3", pattern: "bobot_baris1=\\[0\\.6698, 0\\.3302\\]", label: "`print` menampilkan bobot", msg: "Baris 1 softmax dari [0.7071, 0] = [0.6698, 0.3302]." },
          { kind: "stdout_matches", task: "t3", pattern: "v00=1\\.6605", label: "`print` menampilkan v00", msg: "Format: v00=1.6605." },
        ],
      },
      reference: "skor=QK^T/√d; softmax per baris; out=A@V. Bobot tiap baris jumlahnya 1.",
    },
    {
      id: "multihead-posisi",
      eyebrow: "Langkah 3 · Multi-head & posisi",
      title: "Multi-head: delapan rapat paralel, positional: jam dinding",
      prose: [
        "Satu attention head hanya bisa menangkap satu jenis relasi. Multi-head menjalankan h head paralel, masing-masing dengan proyeksi Q/K/V berbeda: head 1 spesialis rujukan kata ganti, head 2 spesialis subjek-verb, head 3 spesialis negasi. Output digabung (concat) lalu diproyeksikan: MultiHead = Concat(head₁..head_h)·W_O. Delapan perspektif lebih kaya dari satu — dengan biaya komputasi yang masih paralel.",
        "Attention sendiri buta urutan: tanpa bantuan, kalimat Saya tidak suka vs Suka tidak saya terlihat sama (hanya kantong kata berbobot). Positional encoding menyuntikkan informasi posisi — versi klasik memakai sinusoid: PE(pos,2i) = sin(pos/10000^(2i/d)), PE(pos,2i+1) = cos(...). Setiap posisi mendapat sidik jari unik yang halus (posisi berdekatan = sidik mirip), ditambahkan ke embedding sebelum attention.",
        "Satu blok Transformer lengkap: attention → residual + norm → feed-forward → residual + norm. Residual (x + Sublayer(x)) membiarkan gradien mengalir langsung — jawaban atas vanishing gradient di network dalam. Layer norm menstabilkan skala. Tumpuk 12–96 blok: itulah GPT, BERT, dan keluarga besarnya.",
        "💡 Intuisi: residual connection adalah jalan tol gradien. Tanpa +x, gradien harus lewat attention dan feed-forward yang dalam; dengan +x, ada jalur langsung. Network 96 lapis bisa dilatih justru karena setiap blok punya jalan pintas ini.",
        "Causal masking — attention untuk decoder. Saat menghasilkan kata ke-5, model TIDAK BOLEH mengintip kata ke-6 (bocoran masa depan!). Solusi: mask segitiga — skor posisi j>i diset −inf sebelum softmax (bobot = 0). Biaya: tidak ada (hanya masking); efek: training paralel TETAP bisa (tidak seperti RNN sekuensial!). Inilah mengapa GPT melatih miliaran token paralel sementara RNN tidak bisa. Satu mask = perbedaan arsitektur generatif modern.",
        "KV-cache — matematika inference. Tanpa cache: tiap token baru menghitung ulang K, V untuk SEMUA token sebelumnya = O(n^2) per token. Dengan cache: simpan K, V lama, hitung hanya token baru = O(n) per token. Kontrak 4.096 token: cache = 2 (K,V) × 4096 × 12 layer × 12 head × 64 dim × 2 byte = 144 MB per sekuens! Batch 32 = 4,6 GB HANYA untuk cache. OOM saat serving sering dari KV-cache, bukan dari bobot. Hitung SEBELUM deploy.",
        "RoPE vs sinusoidal — posisi modern. Sinusoidal (asli): posisi absolut ditambahkan ke embedding. RoPE (dipakai Llama): posisi DIROTASI ke dalam Q, K (relative!) — model belajar “jarak 3 kata”, bukan “posisi 47”. Keuntungan: ekstrapolasi ke konteks LEBIH PANJANG dari training (dengan scaling). Untuk chatbot bank (konteks 4.096): RoPE standar cukup; untuk dokumen 100 ribu token: butuh YaRN scaling. Posisi = bukan detail kosmetik, melainkan penentu batas konteks.",
      ],
      formula: String.raw`\mathrm{head}_i = \mathrm{Attention}(QW_i^Q, KW_i^K, VW_i^V), \quad \mathrm{MultiHead} = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)W^O`,
      formulaNote: "h = jumlah head; W_i^Q, W_i^K, W_i^V = proyeksi khusus head i (agar tiap head melihat subruang berbeda); W^O = proyeksi gabungan kembali ke dimensi model. Concat = tempelkan semua output head.",
      tasks: [],
      note: {
        title: "🚨 Mitos: positional encoding opsional, attention cukup pintar",
        type: "pitfall",
        body: "Yang benar: tanpa informasi posisi, attention adalah operasi himpunan — urutan kata hilang total. Model tetap training (loss turun!) tetapi menjadi bag-of-words mahal yang gagal pada negasi dan urutan. Selalu pastikan positional encoding ada dan benar sebelum menyalahkan data.",
      },
      reference: "Multi-head = h attention paralel di subruang berbeda. Positional = sidik jari urutan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: Transformer kapan, seberapa besar?",
      prose: [
        "Skenario 1 — Teks klasifikasi/generasi, ada pretrained yang cocok (Indonesia: IndoBERT dkk). → Fine-tune, jangan dari nol. Alasan: pretraining = miliaran token pengetahuan; fine-tune 1–10 ribu sampel cukup.",
        "Skenario 2 — Domain/bahasa tanpa pretrained. → Pretrain sendiri hanya bila punya > 1 miliar token; bila tidak, pakai multilingual pretrained + adaptasi. Alasan: Transformer dari nol pada data kecil = overfitting mahal.",
        "Skenario 3 — Sekuens sangat panjang (> 8 ribu token: dokumen hukum). → Varian efisien (sparse/long-range attention) atau chunking hierarkis. Alasan: O(n²) pada 100 ribu token = 10 miliar skor per head — memori tidak muat.",
        "Skenario 4 — Latensi ketat (chatbot real-time). → Model kecil + KV-cache + quantization. Alasan: decoding autoregresif itu sekuensial per token; KV-cache menghindari hitung ulang, quantization memangkas memori.",
        "Skenario 5 — Butuh kepastian rujukan presisi (ekstraksi kontrak). → Jangan andalkan attention heatmap sebagai bukti; tambah verifikasi terstruktur (span extraction + human review). Alasan: mitos attention-sebagai-penjelasan.",
        "Aturan praktis 10 detik: (1) cari pretrained dulu; (2) hitung n² × head × 4 byte sebelum memilih panjang konteks; (3) pastikan positional encoding; (4) heatmap bukan bukti audit.",
      ],
      note: {
        title: "💡 Intuisi: konteks 2x = memori 4x",
        body: "Attention O(n^2): kontrak 4.096 token butuh 16x memori dari 1.024 token. SEBELUM deploy: hitung n^2 × heads × layers × bytes — jika melebihi VRAM, pilih: (1) konteks lebih pendek, (2) model lebih kecil, (3) attention hemat (flash/sliding window). “Coba dulu” dengan O(n^2) = OOM di produksi. Hitung dulu, deploy kemudian.",
      },
      tasks: [],
      reference: "Pretrained > dari nol. Hitung biaya O(n²) sebelum janji panjang konteks.",
    },
    {
      id: "minicase-konteks",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Kontrak 4.096 token: berapa memori attention?",
      prose: [
        "Legal meminta model membaca kontrak 4.096 token sekaligus dengan 12 head. Sebelum menyetujui, hitung memori matriks skor attention: 4.096² = 16.777.216 skor per head; float32 = 4 byte → 67,11 MB per head; ×12 head = 805,32 MB — hanya untuk satu lapisan, satu sampel, belum termasuk value, gradien, dan aktivasi lain.",
        "Dengan 24 lapisan, skor attention saja butuh ~19 GB — melebihi memori banyak GPU. Inilah mengapa panjang konteks adalah keputusan arsitektur termahal: tiap penggandaan n melipatgandakan memori 4×. Solusinya: chunking kontrak per pasal, atau attention efisien.",
        "Pembahasan: hitungan 5 menit ini menghemat eksperimen Rp 50 juta yang gagal OOM di tengah jalan. Aturan: tidak ada janji panjang konteks tanpa hitungan memori di atas kertas.",
        "FlashAttention — mengapa relevan untuk kasus ini. Attention standar: tulis matriks skor n×n ke memori (4.096^2 × 2 byte = 33,5 MB per head!) lalu baca lagi = 2x traffic memori. FlashAttention: hitung dalam blok TANPA menulis matriks penuh = 2–4x lebih cepat, memori O(n) bukan O(n^2). Untuk kontrak 4.096 token × 12 head: hemat ~300 MB traffic per layer. Jika deploy-mu OOM atau lambat: JANGAN kecilkan model dulu — aktifkan FlashAttention (1 baris config di sebagian framework). Optimasi gratis yang sering dilupakan.",
        "Keputusan akhir minicase — rangkuman angka. Kebutuhan: 4.096 token, 12 head, 12 layer, FP16. Memori skor: 805 MB (dihitung di lab). KV-cache: 144 MB. Bobot model (~110M param): 220 MB. Total: ~1,2 GB — muat di GPU 8 GB dengan nyaman (batch 4 = ~2 GB). Kesimpulan: TIDAK PERLU GPU 80 GB; T4 16 GB (Rp8 ribu/jam) cukup. Aritmetika 5 menit menghemat Rp50 ribu/jam × 100 jam = Rp5 juta. Hitung dulu, sewa kemudian — selalu.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `per_head` = memori skor attention per head (MB, 2 desimal)" },
        { id: "t2", text: "Hitung `total` = untuk 12 head (MB, 2 desimal)" },
      ],
      expected: "per_head=67.11MB  total=805.32MB",
      note: {
        title: "💡 Intuisi: O(n²) dalam rupiah",
        type: "risk",
        body: "Menggandakan panjang konteks 4.096 → 8.192 melipatgandakan memori 4×: 805 MB → 3,2 GB per lapisan. Panjang konteks bukan parameter gratis — ia adalah pos biaya terbesar di arsitektur Transformer. Selalu hitung sebelum menjanjikan ke stakeholder.",
      },
      hints: [
        "skor per head = n*n; byte = skor*4; MB = byte/1e6.",
        "total = per_head * 12.",
        "per_head = round(n*n*4/1e6, 2)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(5)\n\nn, head = 4096, 12  # token, jumlah head\n\n# TULIS KODEMU\nper_head = \ntotal = \n\nprint(f"per_head={per_head}MB  total={total}MB")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(5)\n\nn, head = 4096, 12  # token, jumlah head\n\n# TULIS KODEMU\nper_head = round(n*n*4/1e6, 2)\ntotal = round(per_head*head, 2)\n\nprint(f"per_head={per_head}MB  total={total}MB")`,
        checks: [
          { kind: "equal", task: "t1", name: "per_head", value: 67.11, tol: 0.01, label: "`per_head` seharusnya 67.11", msg: "4096^2 x 4 byte / 1e6 = 67.11 MB." },
          { kind: "equal", task: "t2", name: "total", value: 805.32, tol: 0.05, label: "`total` seharusnya 805.32", msg: "67.11 x 12 = 805.32 MB." },
          { kind: "stdout_matches", task: "t2", pattern: "per_head=67\\.11MB\\s+total=805\\.32MB", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Memori skor = n^2 x 4 byte x head. Kuadratik = mahal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang attention, multi-head, dan biayanya.",
      ],
      note: {
        title: "💡 Intuisi: tanpa posisi, kalimat = kantong kata",
        body: "Attention murni tidak tahu URUTAN (“saya makan dia” vs “dia makan saya” = sama!). Positional encoding = “jam dinding” yang memberi tahu posisi tiap kata. Multi-head = 8 “rapat paralel” yang masing-masing memperhatikan aspek berbeda (sintaksis, semantik, ...). Dua komponen ini yang mengubah “kantong kata” menjadi “pemaham bahasa”.",
      },
      tasks: [],
      summary: [
        "Attention(Q,K,V) = softmax(QK^T/√d_k)V: cocokkan, normalkan, kumpulkan berbobot.",
        "√d_k menjaga softmax tidak jenuh — satu baris yang menentukan training jalan atau macet.",
        "Multi-head = h attention paralel di subruang berbeda; concat lalu proyeksi.",
        "Tanpa positional encoding, Transformer buta urutan — bag-of-words yang mahal.",
        "Biaya O(n²): hitung memori n²×head×4 byte sebelum menjanjikan panjang konteks.",
      ],
      next: { label: "DLE6 — Training: Optimizer & Schedule", href: "/v2/learn/dle6-training" },
      quiz: [
        {
          q: "Fungsi pembagi √d_k dalam attention?",
          options: [
            { text: "Mempercepat komputasi", why: "Pembagian skalar tidak mengubah kompleksitas O(n²)." },
            { text: "Mencegah softmax jenuh sehingga gradien tetap mengalir", why: "Tanpa penskalaan, skor berdimensi besar → satu bobot ≈1 → gradien mati.", correct: true },
            { text: "Mengurangi jumlah parameter", why: "Tidak ada parameter yang terlibat dalam pembagi ini." },
            { text: "Hanya konvensi penulisan", why: "Ia krusial secara numerik, bukan kosmetik." },
          ],
        },
        {
          q: "Setelah softmax, jumlah bobot attention tiap baris?",
          options: [
            { text: "Tepat 1", why: "Definisi softmax: distribusi peluang per baris.", correct: true },
            { text: "Tergantung n", why: "Jumlah suku tergantung n, tetapi totalnya selalu 1." },
            { text: "Tepat 0", why: "Itu berarti tidak ada yang diperhatikan — mustahil dari softmax." },
            { text: "Bisa berapa saja", why: "Softmax menormalisasi; tidak bisa berapa saja." },
          ],
        },
        {
          q: "Mengapa multi-head lebih baik dari satu head besar?",
          options: [
            { text: "Lebih sedikit parameter", why: "Total parameter sebanding; keunggulannya bukan di jumlah." },
            { text: "Tiap head bisa spesialis relasi berbeda secara paralel", why: "Rujukan kata ganti, subjek-verb, negasi — dipelajari serentak di subruang berbeda.", correct: true },
            { text: "Tidak butuh positional encoding", why: "Multi-head tetap buta urutan tanpa positional." },
            { text: "Selalu lebih cepat", why: "Komputasi total sebanding; keunggulannya representasional." },
          ],
        },
        {
          q: "Model tanpa positional encoding gagal pada 'Saya tidak suka' vs 'Suka tidak saya' karena?",
          options: [
            { text: "Vocabulary kurang", why: "Kata-katanya sama persis; masalahnya urutan." },
            { text: "Attention tanpa posisi = operasi himpunan, urutan hilang", why: "Bobot hanya dari kecocokan konten; 'tidak' bisa menempel ke kata mana saja.", correct: true },
            { text: "Data training kurang", why: "Data sebanyak apa pun tak mengembalikan informasi yang dibuang arsitektur." },
            { text: "Learning rate salah", why: "Bukan masalah optimasi; ini kehilangan informasi struktural." },
          ],
        },
        {
          q: "Kontrak 4.096 token, 12 head: memori matriks skor per lapisan?",
          options: [
            { text: "≈ 67 MB", why: "Itu per head; ada 12 head." },
            { text: "≈ 805 MB", why: "67,11 × 12 = 805,32 MB — satu lapisan, satu sampel.", correct: true },
            { text: "≈ 16 MB", why: "Terlalu kecil; 4.096² skor × 4 byte saja sudah 67 MB per head." },
            { text: "Tidak bisa dihitung", why: "Justru wajib dihitung: n² × 4 byte × head." },
          ],
        },
      ],
    },
  ],
};
