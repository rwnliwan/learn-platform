import type { V2Lesson } from "../lib/types";

// Ilustrasi chunking: 4 chunk besar (1 kalimat terpotong) vs 7 chunk kecil + overlap (utuh).
const FIG_CHUNK = `<svg viewBox="0 0 480 210" role="img" aria-label="Chunk 15 kata memotong satu kalimat; chunk 10 kata dengan overlap menjaga kalimat utuh.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)"><text x="10" y="44">chunk 15 kata,</text><text x="10" y="60">tanpa overlap</text><text x="10" y="124">chunk 10 kata,</text><text x="10" y="140">overlap 3</text></g>
<g><rect x="170" y="24" width="65" height="36" fill="var(--c1)" opacity="0.55"/><rect x="240" y="24" width="65" height="36" fill="var(--c1)" opacity="0.55"/><rect x="310" y="24" width="65" height="36" fill="var(--c1)" opacity="0.55"/><rect x="380" y="24" width="65" height="36" fill="var(--c1)" opacity="0.55"/></g>
<line x1="305" y1="18" x2="305" y2="66" stroke="var(--c4)" stroke-width="3" stroke-dasharray="6 4"/>
<text x="305" y="84" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">kalimat terpotong ✂</text>
<g><rect x="170" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="210" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="250" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="290" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="330" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="370" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/><rect x="410" y="104" width="36" height="36" fill="var(--c1)" opacity="0.55"/></g>
<text x="300" y="164" font-size="12" fill="var(--c1)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">kalimat kunci utuh ✓</text>
<text x="240" y="192" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">tiap balok = satu chunk · garis merah = batas chunk memotong kalimat</text>
</svg>`;

export const aie3: V2Lesson = {
  slug: "aie3-rag",
  track: "AI Engineering",
  module: "RAG & Retrieval",
  title: "AIE3 — RAG: Chunking, Embedding, Retrieval",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-sop",
      eyebrow: "Langkah 1 · Cerita",
      title: "Chatbot yang menjawab ngawur dari dokumen yang benar",
      prose: [
        "NusaBank punya chatbot SOP: jawab pertanyaan karyawan dari 200 halaman kebijakan. Dokumennya benar, modelnya canggih — tetapi chatbot menjawab 'tarif lembur 3x upah', padahal dokumen menulis '1,5x'. Audit menemukan penyebabnya bukan di model, melainkan di chunking: dokumen dipotong tiap 2.000 token tepat di tengah kalimat 'Tarif lembur 1,5x upah per jam', sehingga potongan yang diambil hanya berisi '...per jam' tanpa angkanya.",
        "Tim RAG memotong ulang: chunk 400 kata dengan overlap 50 kata. Recall jawaban benar di uji internal naik dari 41 persen menjadi 87 persen — tanpa mengganti model, tanpa menambah data. Twist-nya: kualitas RAG ditentukan sebelum model dipanggil. Retrieval yang buruk tidak bisa diselamatkan oleh model terbaik sekalipun.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan pipeline RAG (chunk → embed → index → retrieve → generate); (2) memilih strategi chunking per tipe dokumen; (3) menghitung cosine similarity untuk retrieval; (4) mengukur recall@k; (5) menghitung ekonomi token RAG.",
        "🗺️ Isi lesson: Langkah 1 · Cerita SOP — Langkah 2 · Chunking — Langkah 3 · Lab: bandingkan chunking — Langkah 4 · Embedding dan retrieval — Langkah 5 · Lab: retrieval — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "RAG = Retrieval-Augmented Generation: model menjawab dari potongan dokumen yang diambil, bukan dari hafalannya.",
    },
    {
      id: "konsep-chunking",
      eyebrow: "Langkah 2 · Chunking",
      title: "Chunking: keputusan paling menentukan yang paling diremehkan",
      prose: [
        "Pipeline RAG punya lima tahap: chunking (potong dokumen), embedding (ubah jadi vektor), indexing (simpan di vector DB), retrieval (ambil chunk paling mirip pertanyaan), generation (model menyusun jawaban dari chunk). Chunking ada di tahap pertama — dan kesalahan di sini merambat ke semua tahap sesudahnya.",
        "Tiga strategi umum. Fixed-size: potong tiap N kata — sederhana, tetapi memotong kalimat. Recursive: potong per paragraf, gabung sampai penuh — menghormati struktur. Semantic: potong per topik — paling rapi, paling mahal. Overlap (mis. 10–20 persen) adalah asuransi murah: kalimat di perbatasan tetap utuh di salah satu chunk.",
        "Kepribadian chunking: ia seperti memotong kue untuk dibagikan. Potongan terlalu besar — tamu kekenyangan konteks dan mahal. Terlalu kecil — tidak ada yang dapat sepotong utuh. Overlap adalah memastikan tidak ada yang dapat potongan yang terbelah dua.",
      ],
      formula: String.raw`n_{\text{chunk}} \approx \frac{W}{s - o}`,
      formulaNote: "n_chunk = jumlah chunk; W = total kata dokumen; s = ukuran chunk (kata); o = overlap (kata). Contoh: 100.000 kata, chunk 400, overlap 50 → ±286 chunk. Rumus ini dipakai untuk estimasi biaya embedding dan ukuran index.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Chunk makin kecil makin baik, makin presisi.' Salah. Chunk terlalu kecil kehilangan konteks — '1,5x' tanpa kalimatnya tidak menjawab apa-apa. Chunk ideal memuat satu ide utuh, bukan sekadar sedikit kata.",
      },
      reference: "Satu chunk = satu ide utuh. Overlap 10–20 persen sebagai asuransi perbatasan.",
    },
    {
      id: "lab-chunking",
      eyebrow: "Langkah 3 · Lab chunking",
      title: "Lab: melihat kalimat terpotong dengan mata kepala sendiri",
      prose: [
        "Fungsi `chunk_fixed` memotong teks tiap `ukuran` kata dengan `overlap` kata. Kita bandingkan dua strategi pada teks kebijakan yang sama, lalu hitung berapa kalimat kunci ('Tarif lembur 1,5x upah per jam') yang terpotong oleh batas chunk.",
        "Coba ubah: ganti ukuran 15 menjadi 25, jalankan ulang, dan lihat kalimat_terpotong berubah. Itulah sensitivitas yang harus kamu uji untuk setiap koleksi dokumen baru.",
      ],
      tasks: [
        { id: "t1", text: "Buat `c1` (15 kata, overlap 0) dan `c2` (10 kata, overlap 3)" },
        { id: "t2", text: "Hitung `potong`: chunk di `c1` yang memuat '1,5x' tapi tidak memuat 'upah per jam.'" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "chunk15=4  chunk10-ov3=7  kalimat_terpotong=1",
      note: {
        title: "💡 Intuisi",
        body: "Overlap terasa boros (kata yang sama disimpan dua kali), tetapi ia membeli sesuatu yang mahal: kalimat utuh. Dalam RAG, satu kalimat terpotong di tempat yang salah bisa berarti satu jawaban salah di depan direksi.",
      },
      hints: [
        "c1 = chunk_fixed(TEKS, 15, 0); c2 = chunk_fixed(TEKS, 10, 3)",
        "Gunakan generator dengan dua syarat: sum(1 for c in c1 if ...)",
        "Syarat: \"1,5x\" in c and \"upah per jam.\" not in c",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nTEKS = (\n    "Bab 1. Kebijakan cuti. Karyawan berhak atas 12 hari cuti tahunan. "\n    "Cuti diajukan minimal 7 hari sebelumnya. "\n    "Bab 2. Kebijakan lembur. Lembur dihitung per jam. "\n    "Tarif lembur 1,5x upah per jam. Maksimal 3 jam per hari. "\n    "Bab 3. Kebijakan reimbursement. Klaim maksimal Rp500.000 per bulan. "\n    "Bukti kwitansi wajib dilampirkan."\n)\n\ndef chunk_fixed(teks, ukuran, overlap):\n    words = teks.split()\n    chunks, i = [], 0\n    step = ukuran - overlap\n    while i < len(words):\n        chunks.append(" ".join(words[i:i+ukuran]))\n        i += step\n    return chunks\n\n# TULIS KODEMU: bandingkan dua strategi chunking\nc1 = \nc2 = \npotong = \n\nprint(f"chunk15={len(c1)}  chunk10-ov3={len(c2)}  kalimat_terpotong={potong}")`,
        lockLines: 20,
        solution: `# DATA SEED — jangan ubah\nTEKS = (\n    "Bab 1. Kebijakan cuti. Karyawan berhak atas 12 hari cuti tahunan. "\n    "Cuti diajukan minimal 7 hari sebelumnya. "\n    "Bab 2. Kebijakan lembur. Lembur dihitung per jam. "\n    "Tarif lembur 1,5x upah per jam. Maksimal 3 jam per hari. "\n    "Bab 3. Kebijakan reimbursement. Klaim maksimal Rp500.000 per bulan. "\n    "Bukti kwitansi wajib dilampirkan."\n)\n\ndef chunk_fixed(teks, ukuran, overlap):\n    words = teks.split()\n    chunks, i = [], 0\n    step = ukuran - overlap\n    while i < len(words):\n        chunks.append(" ".join(words[i:i+ukuran]))\n        i += step\n    return chunks\n\n# TULIS KODEMU: bandingkan dua strategi chunking\nc1 = chunk_fixed(TEKS, 15, 0)\nc2 = chunk_fixed(TEKS, 10, 3)\npotong = sum(1 for c in c1 if "1,5x" in c and "upah per jam." not in c)\n\nprint(f"chunk15={len(c1)}  chunk10-ov3={len(c2)}  kalimat_terpotong={potong}")`,
        checks: [
          { kind: "defined", task: "t1", name: "c1", label: "`c1` terdefinisi", msg: "Buat c1 = chunk_fixed(TEKS, 15, 0)." },
          { kind: "defined", task: "t1", name: "c2", label: "`c2` terdefinisi", msg: "Buat c2 = chunk_fixed(TEKS, 10, 3)." },
          { kind: "equal", task: "t2", name: "potong", value: 1, tol: 1e-9, label: "`potong` seharusnya 1", msg: "Satu chunk memuat '1,5x' tanpa 'upah per jam.' — kalimat tarif terbelah." },
          { kind: "stdout_matches", task: "t3", pattern: "chunk15=4\\s+chunk10-ov3=7\\s+kalimat_terpotong=1", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Uji sensitivitas ukuran chunk untuk setiap koleksi dokumen baru — jangan pakai angka default buta.",
    },
    {
      id: "konsep-embedding",
      eyebrow: "Langkah 4 · Embedding dan retrieval",
      title: "Embedding: makna menjadi angka, retrieval menjadi perankingan",
      prose: [
        "Embedding mengubah tiap chunk menjadi vektor — daftar ratusan angka yang menangkap makna. 'Tarif lembur' dan 'upah lembur' punya vektor yang berdekatan meski katanya beda; itulah yang tidak bisa dilakukan pencarian kata kunci biasa.",
        "Retrieval = beri skor kemiripan tiap chunk terhadap pertanyaan, ambil k teratas. Skor standar: cosine similarity — cosinus sudut antara dua vektor. Nilai 1 berarti makna identik, 0 berarti tidak berhubungan. Recall@k mengukur: dalam berapa persen kasus, chunk jawaban yang benar ada di k teratas.",
        "Kepribadian retrieval: ia seperti pustakawan yang tidak membaca, hanya mencium bau buku. Cepat dan murah — tetapi butuh diuji: pustakawan yang salah rak membuat profesor (model) menjawab dari buku yang salah.",
      ],
      formula: String.raw`\cos(\theta) = \frac{A \cdot B}{\|A\|\,\|B\|}`,
      formulaNote: "A, B = vektor embedding pertanyaan dan chunk; A·B = dot product (jumlah perkalian elemen seposisi); ||A|| = panjang vektor (akar jumlah kuadrat elemen). Hasil 1 = makna identik; 0 = tidak berhubungan. Di lab, embedding mainan memakai hash kata — prinsipnya sama, kualitasnya jauh di bawah model embedding sungguhan.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Retrieval buruk bisa diperbaiki dengan model yang lebih besar.' Salah. Model hanya bisa menjawab dari chunk yang diberikan; chunk salah = jawaban salah yang terdengar meyakinkan. Perbaiki retrieval dulu (chunking, embedding, k) sebelum menyalahkan model.",
      },
      reference: "Ukur recall@k di golden set. Retrieval adalah fondasi; generation hanya sebaik fondasinya.",
    },
    {
      id: "lab-retrieval",
      eyebrow: "Langkah 5 · Lab retrieval",
      title: "Lab: meranking dokumen dengan cosine similarity",
      prose: [
        "Mock `embed` membuat vektor mainan dari hash kata (dimensi 32); `cos` menghitung cosine similarity. Untuk pertanyaan 'berapa tarif lembur per jam', kita skor semua dokumen, urutkan, dan cek apakah dokumen emas (dok-1, indeks 1) ada di 2 teratas — itulah recall@2.",
        "Coba ubah: ganti QUERY menjadi 'cuti melahirkan', ubah GOLD menjadi 3, jalankan ulang. Retrieval yang baik harus tetap menempatkan dokumen benar di puncak untuk pertanyaan apa pun.",
      ],
      figure: {
        svg: FIG_CHUNK,
        alt: "Chunk 15 kata memotong satu kalimat; chunk 10 kata dengan overlap menjaga kalimat utuh.",
        caption: "Cara membaca: tiap balok = satu chunk; garis merah putus-putus = batas chunk yang memotong kalimat kunci 'Tarif lembur 1,5x upah per jam'. Interpretasi: chunk besar tanpa overlap (atas) membelah kalimat sehingga angka 1,5x terpisah dari konteksnya — retrieval mengambil potongan yang tidak menjawab. Chunk kecil + overlap (bawah) menjaga kalimat utuh dengan harga jumlah chunk lebih banyak.",
      },
      tasks: [
        { id: "t1", text: "Hitung `skor` (list pasangan similarity, indeks) lalu `ranking`" },
        { id: "t2", text: "Hitung `recall_at_2` (1.0 bila GOLD di 2 teratas)" },
        { id: "t3", text: "Cetak top1 dan recall@2" },
      ],
      expected: "top1=dok1  recall@2=100%",
      note: {
        title: "💡 Intuisi",
        body: "Recall@k menjawab pertanyaan yang tepat untuk RAG: 'apakah jawabannya ada di meja model?' Bukan 'apakah model pintar?' — melainkan 'apakah pustakawannya mengambil buku yang benar?' Naikkan k bila recall rendah, tetapi ingat tiap chunk tambahan menambah biaya token.",
      },
      hints: [
        "skor = [(cos(embed(QUERY), embed(d)), i) for i, d in enumerate(DOKS)]",
        "Urutkan menurun: skor.sort(reverse=True); ranking = [i for _, i in skor]",
        "recall_at_2 = 1.0 if GOLD in ranking[:2] else 0.0",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport math, hashlib\n\nDOKS = [\n    "cuti tahunan 12 hari diajukan 7 hari sebelumnya",\n    "lembur maksimal 3 jam tarif 1,5x per jam",\n    "reimbursement maksimal Rp500.000 kwitansi wajib",\n    "cuti melahirkan 3 bulan gaji penuh",\n]\n\ndef embed(teks, dim=32):\n    v = [0.0]*dim\n    for w in teks.lower().split():\n        h = int(hashlib.md5(w.encode()).hexdigest(), 16)\n        v[h % dim] += 1.0\n    return v\n\ndef cos(a, b):\n    dot = sum(x*y for x, y in zip(a, b))\n    na = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(x*x for x in b))\n    return dot/(na*nb) if na and nb else 0.0\n\nQUERY = "berapa tarif lembur per jam"\nGOLD = 1  # dokumen jawaban yang benar\n\n# TULIS KODEMU: ranking dokumen dan recall@2\nskor = \nranking = \nrecall_at_2 = \n\nprint(f"top1=dok{ranking[0]}  recall@2={recall_at_2:.0%}")`,
        lockLines: 26,
        solution: `# DATA SEED — jangan ubah\nimport math, hashlib\n\nDOKS = [\n    "cuti tahunan 12 hari diajukan 7 hari sebelumnya",\n    "lembur maksimal 3 jam tarif 1,5x per jam",\n    "reimbursement maksimal Rp500.000 kwitansi wajib",\n    "cuti melahirkan 3 bulan gaji penuh",\n]\n\ndef embed(teks, dim=32):\n    v = [0.0]*dim\n    for w in teks.lower().split():\n        h = int(hashlib.md5(w.encode()).hexdigest(), 16)\n        v[h % dim] += 1.0\n    return v\n\ndef cos(a, b):\n    dot = sum(x*y for x, y in zip(a, b))\n    na = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(x*x for x in b))\n    return dot/(na*nb) if na and nb else 0.0\n\nQUERY = "berapa tarif lembur per jam"\nGOLD = 1  # dokumen jawaban yang benar\n\n# TULIS KODEMU: ranking dokumen dan recall@2\nskor = [(cos(embed(QUERY), embed(d)), i) for i, d in enumerate(DOKS)]\nskor.sort(reverse=True)\nranking = [i for _, i in skor]\nrecall_at_2 = 1.0 if GOLD in ranking[:2] else 0.0\n\nprint(f"top1=dok{ranking[0]}  recall@2={recall_at_2:.0%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "ranking", label: "`ranking` terdefinisi", msg: "Urutkan skor menurun lalu ambil indeksnya." },
          { kind: "equal", task: "t2", name: "recall_at_2", value: 1.0, tol: 1e-9, label: "`recall_at_2` seharusnya 1.0", msg: "Dokumen emas (indeks 1) ada di 2 teratas." },
          { kind: "stdout_matches", task: "t3", pattern: "top1=dok1\\s+recall@2=100%", label: "`print` menampilkan keduanya", msg: "Format: top1=dok1  recall@2=100%." },
        ],
      },
      reference: "Retrieval yang baik = dokumen benar di puncak untuk pertanyaan apa pun. Uji dengan banyak query, bukan satu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: strategi chunking per tipe dokumen",
      prose: [
        "Satu, dokumen naratif panjang (SOP, laporan tahunan) — chunk 300–500 kata dengan overlap 10–20 persen; cukup untuk satu ide utuh. Dua, tabel atau struktur kaku (tarif, jadwal) — chunk per baris atau bagian logis; JANGAN potong tengah tabel, karena sel tanpa barisnya tidak bermakna.",
        "Tiga, FAQ atau Q&A — satu chunk per pasangan pertanyaan-jawaban; unit alami yang tidak perlu diutak-atik. Empat, kode atau log — chunk per fungsi atau blok, sertakan metadata nama file; tanpa metadata, potongan kode kehilangan alamatnya.",
        "Aturan praktis 10 detik: chunk harus memuat satu ide utuh. Kalau kalimat kunci terpotong, chunk-mu terlalu besar atau overlap-mu nol — bukan modelnya yang bodoh.",
        "Reranking — kapan worth it. Retrieve 50 → rerank ke 5: akurasi top-5 naik 8–12 poin, biaya +Rp30/request. Untuk 10.000 request/hari: +Rp300 ribu/hari. Jika tiap jawaban salah = Rp5 ribu: 8 persen × 10.000 × Rp5 ribu = hemat Rp4 juta/hari — WORTH IT 13x. Jika error murah (Rp100): hemat Rp80 ribu < Rp300 ribu — JANGAN. Rerank = premi asuransi akurasi; bayar jika yang diasuransikan mahal.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Metadata (judul bab, nomor halaman, tanggal dokumen) adalah chunk yang tidak terlihat: ia tidak menambah makna, tetapi menyelamatkan jawaban saat model perlu sitasi atau kamu perlu audit. Simpan selalu.",
      },
      reference: "Naratif → 300–500 kata + overlap. Tabel → per baris. FAQ → per Q&A. Kode → per fungsi + metadata.",
    },
    {
      id: "minicase-sop",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: SOP 200 halaman dan biaya yang tersembunyi",
      prose: [
        "SOP NusaBank: 200 halaman x 500 kata = 100.000 kata. Opsi A: chunk 1.000 kata tanpa overlap → 100 chunk; tiap request mengambil top-5 = 5.000 kata ≈ 6.700 token konteks. Opsi B: chunk 400 kata overlap 50 → ±286 chunk; top-5 = 2.000 kata ≈ 2.700 token.",
        "Biaya konteks per bulan (120.000 request, $0,5 per 1 juta token input): A = 120.000 x 6.700/1e6 x $0,5 = $402 ≈ Rp6,4 juta. B = 120.000 x 2.700/1e6 x $0,5 = $162 ≈ Rp2,6 juta. Hemat Rp3,8 juta per bulan — DAN jawaban lebih tepat karena kalimat tidak terpotong.",
        "Twist: biaya embedding sekali bayar hampir nol — 100.000 kata ≈ 133.000 token x $0,02 per juta = $0,0027, sekitar Rp43. Yang mahal adalah konteks yang dikirim ULANG setiap request. Optimasi RAG = optimasi konteks per request, bukan biaya index.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban SOP yang salah (mis. tarif lembur 3x alih-alih 1,5x) adalah risiko operasional: keputusan HR berbasis angka salah. Chunking di sini adalah kontrol risiko, bukan sekadar tuning performa.",
      },
      reference: "Embedding = sekali bayar (receh). Konteks per request = bayar terus (mahal). Kecilkan konteks tanpa memotong ide.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Pipeline RAG: chunk → embed → index → retrieve → generate; kesalahan chunking merambat ke semua tahap.",
        "Satu chunk = satu ide utuh; overlap 10–20 persen adalah asuransi murah terhadap kalimat terpotong.",
        "Embedding = vektor makna; retrieval = ranking cosine similarity; recall@k mengukur apakah jawaban ada di meja model.",
        "Retrieval buruk tidak bisa diselamatkan model besar — perbaiki retrieval dulu.",
        "Ekonomi RAG: embedding sekali bayar (murah); konteks per request bayar terus (mahal).",
      ],
      next: { label: "AIE4 — Evaluasi LLM", href: "/v2/learn/aie4-eval" },
      quiz: [
        {
          q: "Mengapa chunking menentukan kualitas RAG?",
          options: [
            { text: "Karena retrieval hanya mengembalikan chunk utuh — kalimat terpotong berarti jawaban hilang", why: "Tepat: model tidak bisa menjawab dari potongan yang tidak lengkap, seberapa pintar pun ia.", correct: true },
            { text: "Karena chunk kecil membuat model berpikir lebih cepat", why: "Kecepatan bukan soal ukuran chunk; ini soal kelengkapan informasi.", correct: false },
            { text: "Karena embedding hanya bekerja pada chunk pendek", why: "Embedding bekerja pada berbagai panjang; masalahnya adalah ide yang terbelah.", correct: false },
            { text: "Karena model tidak bisa membaca dokumen panjang", why: "Model modern bisa membaca konteks panjang; masalahnya adalah chunk yang diambil tidak utuh.", correct: false },
          ],
        },
        {
          q: "Apa fungsi embedding dalam RAG?",
          options: [
            { text: "Mengompres dokumen agar file lebih kecil", why: "Kompresi bukan tujuannya; vektor embedding justru menambah penyimpanan.", correct: false },
            { text: "Mengubah teks menjadi vektor makna agar kemiripan bisa dihitung", why: "Tepat: vektor memungkinkan pencarian makna ('upah lembur' vs 'tarif lembur'), bukan sekadar kata sama.", correct: true },
            { text: "Mengenkripsi dokumen agar aman", why: "Embedding bukan enkripsi dan tidak dirancang untuk keamanan.", correct: false },
            { text: "Menerjemahkan dokumen ke bahasa Inggris", why: "Embedding multibahasa memang ada, tetapi fungsinya representasi makna, bukan terjemahan.", correct: false },
          ],
        },
        {
          q: "Cosine similarity = 1 antara vektor pertanyaan dan chunk artinya…",
          options: [
            { text: "Makna keduanya identik (sudut 0 derajat)", why: "Tepat: cosinus 1 = searah penuh = makna paling mirip.", correct: true },
            { text: "Keduanya tidak berhubungan sama sekali", why: "Itu nilai 0, bukan 1.", correct: false },
            { text: "Chunk pasti berisi jawaban yang benar", why: "Kemiripan makna tidak menjamin kebenaran isi — chunk mirip tapi salah tetap mungkin.", correct: false },
            { text: "Pertanyaan dan chunk memakai kata yang persis sama", why: "Cosine mengukur makna, bukan kata identik; parafrase bisa bernilai 1.", correct: false },
          ],
        },
        {
          q: "Kapan chunk kecil + overlap lebih baik daripada chunk besar?",
          options: [
            { text: "Ketika dokumen punya kalimat kunci yang tidak boleh terpotong", why: "Tepat: overlap menjaga kalimat utuh; chunk kecil menjaga satu ide per chunk.", correct: true },
            { text: "Ketika ingin tagihan embedding semurah mungkin", why: "Biaya embedding hampir nol; yang dioptimasi adalah konteks per request dan ketepatan.", correct: false },
            { text: "Ketika dokumen hanya berisi tabel angka", why: "Tabel justru butuh chunk per baris logis, bukan chunk kecil acak.", correct: false },
            { text: "Selalu — chunk kecil selalu lebih baik", why: "Terlalu kecil menghilangkan konteks; tidak ada yang selalu benar.", correct: false },
          ],
        },
        {
          q: "Komponen biaya terbesar dalam operasi RAG jangka panjang?",
          options: [
            { text: "Embedding dokumen (sekali bayar saat index)", why: "Itu sekali bayar dan receh (contoh: Rp43 untuk 200 halaman).", correct: false },
            { text: "Token konteks yang dikirim ulang ke model di setiap request", why: "Tepat: 120.000 request x ribuan token konteks = jutaan rupiah per bulan, terus-menerus.", correct: true },
            { text: "Lisensi vector database", why: "Banyak opsi gratis/open-source; bukan pendorong biaya utama.", correct: false },
            { text: "Gaji engineer yang menulis chunker", why: "Itu biaya satu kali pengembangan, bukan biaya operasi berulang.", correct: false },
          ],
        },
      ],
    },
  ],
};
