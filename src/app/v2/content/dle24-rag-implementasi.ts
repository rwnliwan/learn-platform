import type { V2Lesson } from "../lib/types";

// Pipeline RAG: dokumen dipotong, di-embed, diindeks; query menempuh jalur yang sama.
const RAG_SVG = `<svg viewBox="0 0 640 220" role="img" aria-label="Pipeline RAG: dokumen, chunking, embedding, index, query, jawaban.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="12" y="60" width="92" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="58" y="82" fill="#fff" font-weight="600">Dokumen</text><text x="58" y="100" fill="#fff" font-size="10">400 halaman</text>
<rect x="116" y="60" width="92" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="162" y="82" fill="#fff" font-weight="600">Chunking</text><text x="162" y="100" fill="#fff" font-size="10">potong + overlap</text>
<rect x="220" y="60" width="92" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="266" y="82" fill="#fff" font-weight="600">Embedding</text><text x="266" y="100" fill="#fff" font-size="10">teks → vektor</text>
<rect x="324" y="60" width="92" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="370" y="82" fill="#fff" font-weight="600">Index</text><text x="370" y="100" fill="#fff" font-size="10">ANN (HNSW)</text>
<rect x="428" y="60" width="92" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="474" y="82" fill="#fff" font-weight="600">Retrieval</text><text x="474" y="100" fill="#fff" font-size="10">query → top-k</text>
<rect x="532" y="60" width="92" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="578" y="82" fill="#fff" font-weight="600">Jawaban</text><text x="578" y="100" fill="#fff" font-size="10">LLM + konteks</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5">
<line x1="104" y1="86" x2="114" y2="86"/><line x1="208" y1="86" x2="218" y2="86"/><line x1="312" y1="86" x2="322" y2="86"/><line x1="416" y1="86" x2="426" y2="86"/><line x1="520" y1="86" x2="530" y2="86"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="320" y="160">chunking menentukan APA yang bisa di-retrieve — embedding hanya menentukan seberapa cepat ketemunya</text>
<text x="320" y="182">dua strategi chunking yang sama-sama "benar" bisa memberi jawaban yang berbeda</text>
</g>
</svg>`;

export const dle24: V2Lesson = {
  slug: "dle24-rag-implementasi",
  track: "Deep Learning Engineer",
  module: "RAG & Generatif",
  title: "DLE24 — RAG End-to-End: Implementasi & Evaluasi Retrieval",
  estMinutes: 70,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson dan tujuan",
      prose: [
        "RAG (Retrieval-Augmented Generation) adalah pola paling umum memakai LLM di perusahaan: bukan melatih ulang model, melainkan mengambil potongan dokumen yang relevan lalu memintanya menjawab dari potongan itu. Lesson ini bukan pengantar konsep RAG — melainkan implementasi dan evaluasinya: bagaimana membangun pipelinenya, dan yang lebih penting, bagaimana MENGUKUR apakah retrieval-nya bekerja.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membangun pipeline RAG lengkap (chunking → embedding → index → query) dan menjelaskan peran tiap komponen; (2) menghitung recall@k dan MRR dari hasil ranking dan memutuskan strategi chunking mana yang lebih baik; (3) membedakan kegagalan chunking, kegagalan embedding, dan kegagalan ranking dari gejalanya; (4) merancang evaluasi retrieval sebelum menyentuh model embedding yang lebih besar; (5) memutuskan kapan perlu reranker dan kapan cukup retriever satu tahap.",
        "Prasyarat yang diringkas di sini (lesson ini self-contained): cosine similarity mengukur kesearahan dua vektor, cos θ = (a·b)/(‖a‖‖b‖) — 1,0 berarti searah sempurna, 0 berarti tidak berhubungan; chunk = potongan teks hasil pemotongan dokumen, unit terkecil yang disimpan di index; top-k = k hasil teratas dari ranking berdasarkan skor kemiripan.",
        "Isi lesson: cerita chatbot yang jawabannya terpotong kalimatnya → anatomi pipeline RAG → metrik evaluasi retrieval (recall@k, MRR) → reranker & katalog kegagalan → lab banding dua strategi chunking dengan numpy → peta keputusan → mini-case chatbot asuransi → checkpoint.",
      ],
      tasks: [],
      reference: "RAG = ambil potongan yang relevan, lalu jawab dari potongan itu. Ukur retrieval-nya sebelum menyalahkan modelnya.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Chatbot yang menjawab dengan kalimat terpotong",
      prose: [
        "Perusahaan telekomunikasi meluncurkan “Siaga”, chatbot layanan pelanggan berbasis RAG di atas 400 halaman dokumen produk. Metrik retrieval-nya bagus: recall@5 = 0,94 — hampir selalu ada dokumen yang relevan di 5 hasil teratas. Tim merayakannya.",
        "Tiga minggu kemudian, tiket komplain menumpuk. Contoh: pelanggan bertanya “berapa biaya admin paket DataMax?”, bot menjawab “Rp15.000 sekali bayar”. Dokumen aslinya menulis: “biaya admin Rp15.000 per bulan, dibebankan di awal”. Chunk yang di-retrieve berhenti tepat di “Rp15.000” — sisa kalimatnya jatuh di chunk berikutnya yang tidak ikut terambil. Jawabannya salah bukan karena modelnya bodoh, melainkan karena ia diberi kalimat yang terpotong.",
        "Tim menghabiskan dua bulan mengganti model embedding ke yang lebih besar dan mahal (biaya inferensi naik Rp18 juta/bulan). MRR naik tipis 0,03 — komplain tidak berkurang. Lalu seorang engineer junior mengubah strategi chunking: dari potongan kaku 500 karakter menjadi potongan rekursif dengan overlap 15%. Tiga hari kerja. MRR naik 0,31, komplain turun 70%.",
        "Twist-nya: selama dua bulan, tim mengukur retrieval dengan metrik yang benar (recall@k, MRR) tetapi memperbaiki komponen yang salah. Embedding yang lebih besar menemukan potongan yang terpotong itu LEBIH CEPAT — masalahnya tidak pernah di kecepatan pencarian, melainkan di barang yang disimpan di gudang. Lesson ini mengajarkan urutan perbaikan yang benar: chunking dulu, index kedua, embedding terakhir.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban RAG yang terpotong kalimatnya = misinformasi yang terlihat meyakinkan karena “dikutip dari dokumen”. Di layanan keuangan, satu angka yang terpotong (“per bulan” hilang) bisa menjadi saran produk yang menyesatkan — dan jejak auditnya menunjuk ke dokumen yang benar, membuat kesalahannya sulit dilacak.",
      },
      reference: "Ukur dulu, lalu perbaiki komponen yang rusak — bukan komponen yang paling mahal.",
    },
    {
      id: "pipeline",
      eyebrow: "Langkah 3 · Pipeline RAG",
      title: "Anatomi pipeline: Si Tukang Potong & Si Pustakawan",
      prose: [
        "Pipeline RAG punya lima komponen. Dokumen: sumber mentah (PDF, halaman web, tiket). Chunking — Si Tukang Potong: memotong dokumen menjadi potongan 200–1000 token. Embedding: menerjemahkan tiap chunk menjadi vektor di “ruang makna”. Index — Si Pustakawan: menyimpan vektor dengan struktur pencarian cepat (ANN seperti HNSW). Query: pertanyaan pengguna di-embed dengan model yang SAMA, lalu dicari k tetangga terdekatnya. LLM menerima query + k chunk, lalu menjawab.",
        "Tiga strategi chunking. Fixed-size: potong tiap N karakter/token — sederhana, tetapi memotong kalimat dan tabel di tengah (inilah yang terjadi di cerita Siaga). Recursive: potong di batas alami (paragraf → kalimat → kata) dengan ukuran target — lebih rapi, sedikit lebih lambat. Overlap: tiap chunk mengulang 10–20% dari chunk sebelumnya — asuransi agar kalimat penting tidak terbelah; harganya index lebih besar.",
        "Embedding adalah penerjemah makna: “biaya admin” dan “ongkos layanan” berakhir berdekatan walau katanya beda. Index ANN (HNSW/IVF) mengorbankan sedikit akurasi demi kecepatan di jutaan vektor — untuk kebanyakan RAG perusahaan, akurasinya lebih dari cukup.",
        "💡 Intuisi: chunking menentukan APA yang bisa ditemukan; embedding menentukan seberapa cepat ketemunya; LLM menentukan seberapa bagus jawabannya dari temuan itu. Kalau jawabanmu salah, selidiki dengan urutan yang sama: cek chunk-nya dulu, bukan modelnya.",
        "Cara membaca: enam kotak dibaca kiri ke kanan — dokumen mentah dipotong, diubah jadi vektor, disimpan di index; query menempuh jalur yang sama sebelum LLM menjawab.",
        "Interpretasi: setiap kotak adalah titik kegagalan yang independen — di cerita Siaga, kotak chunking-lah yang gagal, sementara tim memperbaiki kotak embedding.",
      ],
      figure: {
        svg: RAG_SVG,
        alt: "Diagram pipeline RAG: dokumen, chunking, embedding, index, retrieval, jawaban.",
        caption: "Pipeline RAG: chunking menentukan apa yang bisa di-retrieve; embedding hanya menentukan kecepatannya.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: RAG = tempel vector DB ke LLM, selesai",
        type: "pitfall",
        body: "Yang benar: RAG adalah pipeline dengan lima komponen yang masing-masing bisa gagal — chunking yang memotong kalimat, embedding yang tidak cocok domain (model Inggris untuk dokumen Indonesia), index basi setelah dokumen direvisi, dan prompt yang mengabaikan konteks. “Tempel lalu jalan” menghasilkan demo yang bagus dan produk yang rapuh.",
      },
      reference: "Dokumen → chunk → vektor → index → query → jawaban. Perbaiki dari kiri ke kanan.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 4 · Evaluasi retrieval",
      title: "recall@k dan MRR: mengukur pencari, bukan penjawab",
      prose: [
        "Sebelum membandingkan dua strategi chunking, butuh metrik. Dua yang paling dipakai: recall@k dan MRR (Mean Reciprocal Rank). Keduanya mengukur RETRIEVAL — kualitas pencarian — bukan kualitas jawaban akhir. Itu disengaja: kalau retrieval-nya buruk, jawaban pasti buruk; kalau retrieval-nya bagus, jawaban masih bisa buruk (masalah LLM/prompt).",
        "Recall@k menjawab: “dari semua chunk yang relevan, berapa persen yang masuk k teratas?” Nilainya 0 sampai 1. Cocok saat kamu butuh CAKUPAN — misalnya merangkum semua syarat dari banyak dokumen. Kelemahannya: tidak peduli urutan — chunk relevan di posisi 1 dan posisi k dihitung sama.",
        "MRR menjawab: “seberapa tinggi posisi chunk relevan pertama?” Untuk tiap query, ambil 1/(peringkat chunk relevan pertama), lalu rata-ratakan. MRR = 1,0 berarti jawaban selalu di posisi 1; MRR = 0,5 berarti rata-rata di posisi 2. Cocok untuk tanya-jawab satu jawaban — persis kasus chatbot.",
        "Contoh hitung manual. Satu query, chunk relevan = {c2}. Hasil ranking: [c1, c2, c3]. recall@2 = 1/1 = 1,0 (c2 ada di 2 teratas). MRR untuk query ini = 1/2 = 0,5 (c2 di peringkat 2). Kalau ranking-nya [c2, c1, c3]: recall@2 tetap 1,0, tetapi MRR naik menjadi 1,0. Inilah bedanya: recall buta urutan, MRR menghargai posisi.",
      ],
      formula: String.raw`\text{Recall@k} = \frac{|\text{relevan} \cap \text{top-}k|}{|\text{relevan}|} \qquad \text{MRR} = \frac{1}{|Q|}\sum_{i=1}^{|Q|}\frac{1}{\text{rank}_i}`,
      formulaNote: "Recall@k = porsi chunk relevan yang muncul di k teratas (0–1; buta urutan). MRR = rata-rata 1/peringkat chunk relevan pertama lintas semua query Q (1,0 = selalu peringkat 1). rank_i = posisi chunk relevan pertama untuk query ke-i. Gunakan recall@k untuk kebutuhan cakupan, MRR untuk tanya-jawab satu jawaban.",
      tasks: [],
      note: {
        title: "🚨 Mitos: recall@k tinggi berarti RAG-nya bagus",
        type: "pitfall",
        body: "Yang benar: recall@k = 1,0 dengan k = 50 artinya “jawabannya ada di suatu tempat dalam 50 potong teks” — LLM tetap harus menemukannya di tumpukan itu, dan 49 potong noise bisa menyesatkannya. Recall tinggi dengan k besar itu murah; yang mahal adalah MRR tinggi dengan k kecil.",
      },
      reference: "Recall@k = cakupan. MRR = posisi. Ukur keduanya, putuskan berdasarkan kebutuhan.",
    },
    {
      id: "reranker",
      eyebrow: "Langkah 5 · Reranker & kegagalan",
      title: "Reranker — Si Editor — dan katalog kegagalan RAG",
      prose: [
        "Retriever tahap pertama (bi-encoder: query dan chunk di-embed terpisah) itu cepat tetapi dangkal — ia membandingkan vektor, bukan memahami pasangan query-dokumen. Reranker — Si Editor — adalah tahap kedua: model cross-encoder yang membaca query DAN chunk bersamaan, lalu memberi skor relevansi yang jauh lebih teliti. Polanya: ambil 50 dengan retriever murah, saring jadi 5 dengan reranker mahal. Akurat dan tetap cepat, karena yang mahal hanya memproses 50 kandidat.",
        "Katalog kegagalan RAG — hafalkan gejalanya. (1) Chunk boundary: jawaban terpotong kalimat — gejala: kutipan berhenti di tengah angka/klausa. Obat: overlap atau recursive chunking. (2) Stale index: dokumen direvisi, index tidak di-rebuild — gejala: jawaban mengutip versi lama yang sudah tidak berlaku. Obat: versioning index + rebuild terjadwal. (3) Query-chunk mismatch: pengguna bertanya dengan kata yang tidak ada di dokumen (“ongkos” vs “biaya”) dan embedding tidak cukup pintar — gejala: top-k tidak relevan sama sekali. Obat: reranker, atau hyde/query rewriting. (4) Konteks berlebih: k terlalu besar, LLM tenggelam dalam noise — gejala: jawaban mencampur fakta dari chunk yang tidak terkait. Obat: kecilkan k, naikkan kualitas ranking.",
        "💡 Intuisi: reranker tidak memperbaiki recall — ia tidak bisa menemukan chunk yang tidak masuk 50 besar. Reranker memperbaiki PRESISI urutan. Kalau chunk relevan tidak masuk kandidat sama sekali, yang rusak adalah chunking atau embedding, bukan ranking.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: tambah reranker, semua masalah retrieval selesai",
        type: "pitfall",
        body: "Yang benar: reranker hanya mengurutkan ulang apa yang sudah ditemukan. Di cerita Siaga, reranker akan dengan teliti menempatkan chunk “Rp15.000” (yang terpotong) di peringkat 1 — masalahnya tetap kalimat yang terbelah. Urutan perbaikan: chunking → index freshness → retriever → reranker.",
      },
      reference: "Retriever murah mengambil 50, reranker mahal memilih 5. Reranker tak bisa menemukan yang tak terambil.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: duel dua strategi chunking",
      prose: [
        "Waktunya praktik. Kamu diberi 5 chunk dari dua strategi atas dokumen yang sama tentang syarat kredit usaha. Strategi A memotong kaku tanpa overlap; strategi B memakai overlap sehingga satu chunk memuat jawaban utuh. Query: “tenor kredit”. Tugasmu: hitung cosine similarity tiap chunk, ranking, lalu recall@2 dan MRR masing-masing strategi terhadap ground truth (chunk yang memuat jawaban UTUH: “tenor” + “bulan”).",
        "Perhatikan: strategi A TIDAK PUNYA chunk yang memuat jawaban utuh — “tenor” dan “bulan” terbelah di dua chunk berbeda. Itu bukan bug di kodemu; itu inti pelajarannya: recall@2 strategi A = 0,0 bukan karena embedding-nya jelek, melainkan karena index-nya tidak menyimpan jawaban yang utuh. Tidak ada yang bisa di-retrieve dari yang tidak ada.",
        "Cara membaca output: tiap baris strategi = ranking chunk dari paling mirip; baris metrik = recall@2 dan MRR; baris vonis = strateginya. Angka yang benar: A → recall@2 0,0 dan MRR 0,000; B → recall@2 1,0 dan MRR 1,000.",
        "Interpretasi: strategi B menang bukan karena embedding lebih pintar — embedding-nya SAMA PERSIS. Yang berbeda hanya cara memotong dokumen. Inilah mengapa chunking diperbaiki sebelum embedding.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `simA` dan `simB`: dict nama chunk → cosine similarity terhadap `query`, dibulatkan 3 desimal" },
        { id: "t2", text: "Hitung `recA`, `mrrA`, `recB`, `mrrB`: recall@2 dan MRR tiap strategi terhadap `relA`/`relB`" },
        { id: "t3", text: "Cetak ranking, baris metrik, dan `vonis` dengan format persis seperti contoh" },
      ],
      expected: "A: [('A4', 0.5), ('A3', 0.408), ('A1', 0.0), ('A2', 0.0), ('A5', 0.0)]\nB: [('B4', 0.816), ('B3', 0.408), ('B1', 0.0), ('B2', 0.0), ('B5', 0.0)]\nrecall@2 A=0.0 MRR A=0.000 | recall@2 B=1.0 MRR B=1.000\nvonis: strategi B (chunk overlap menjaga jawaban tetap utuh)",
      hints: [
        "cos(a,b) = (a·b) / (‖a‖‖b‖) — fungsi cos() sudah disediakan, pakai np.linalg.norm.",
        "Ranking = sorted(chunks, key=similarity, reverse=True); Python sorted stabil untuk skor imbang.",
        "recall@2 = |top2 ∩ relevan| / |relevan|; bila relevan kosong, recall = 0.0. MRR = 1/peringkat chunk relevan pertama (0 bila tak ada).",
      ],
      code: {
        starter: `import numpy as np

terms = ["syarat","pengajuan","kredit","usaha","ktp","npwp","rekening","koran","jaminan","bunga","tenor","bulan"]
T = {t: i for i, t in enumerate(terms)}

def vec(words):
    v = np.zeros(len(terms))
    for w in words:
        v[T[w]] += 1
    return v

query = vec(["tenor", "kredit"])

# Strategi A: potongan kaku tanpa overlap -> "tenor"+"bulan" terbelah
chunksA = {
    "A1": vec(["syarat", "ktp", "npwp"]),
    "A2": vec(["pengajuan", "rekening", "koran"]),
    "A3": vec(["kredit", "usaha", "jaminan"]),
    "A4": vec(["bunga", "tenor"]),
    "A5": vec(["bulan", "bunga", "usaha"]),
}
# Strategi B: overlap -> satu chunk utuh berisi jawaban
chunksB = {
    "B1": vec(["syarat", "ktp", "npwp"]),
    "B2": vec(["pengajuan", "rekening", "koran"]),
    "B3": vec(["kredit", "usaha", "jaminan"]),
    "B4": vec(["tenor", "bulan", "kredit"]),
    "B5": vec(["usaha", "ktp"]),
}
# Ground truth: chunk yang memuat jawaban UTUH ("tenor"+"bulan")
relA = set()    # strategi A: tidak ada chunk yang utuh
relB = {"B4"}

def cos(a, b):
    d = np.linalg.norm(a) * np.linalg.norm(b)
    return float(a @ b / d) if d else 0.0

# TULIS KODEMU di bawah baris ini
simA = ...
simB = ...
recA = ...
mrrA = ...
recB = ...
mrrB = ...
vonis = ...

print("A:", [(c, simA[c]) for c in sorted(simA, key=lambda c: simA[c], reverse=True)])
print("B:", [(c, simB[c]) for c in sorted(simB, key=lambda c: simB[c], reverse=True)])
print(f"recall@2 A={recA:.1f} MRR A={mrrA:.3f} | recall@2 B={recB:.1f} MRR B={mrrB:.3f}")
print(f"vonis: {vonis}")`,
        lockLines: 38,
        solution: `import numpy as np

terms = ["syarat","pengajuan","kredit","usaha","ktp","npwp","rekening","koran","jaminan","bunga","tenor","bulan"]
T = {t: i for i, t in enumerate(terms)}

def vec(words):
    v = np.zeros(len(terms))
    for w in words:
        v[T[w]] += 1
    return v

query = vec(["tenor", "kredit"])

# Strategi A: potongan kaku tanpa overlap -> "tenor"+"bulan" terbelah
chunksA = {
    "A1": vec(["syarat", "ktp", "npwp"]),
    "A2": vec(["pengajuan", "rekening", "koran"]),
    "A3": vec(["kredit", "usaha", "jaminan"]),
    "A4": vec(["bunga", "tenor"]),
    "A5": vec(["bulan", "bunga", "usaha"]),
}
# Strategi B: overlap -> satu chunk utuh berisi jawaban
chunksB = {
    "B1": vec(["syarat", "ktp", "npwp"]),
    "B2": vec(["pengajuan", "rekening", "koran"]),
    "B3": vec(["kredit", "usaha", "jaminan"]),
    "B4": vec(["tenor", "bulan", "kredit"]),
    "B5": vec(["usaha", "ktp"]),
}
# Ground truth: chunk yang memuat jawaban UTUH ("tenor"+"bulan")
relA = set()    # strategi A: tidak ada chunk yang utuh
relB = {"B4"}

def cos(a, b):
    d = np.linalg.norm(a) * np.linalg.norm(b)
    return float(a @ b / d) if d else 0.0

# TULIS KODEMU di bawah baris ini
simA = {c: round(cos(query, chunksA[c]), 3) for c in chunksA}
simB = {c: round(cos(query, chunksB[c]), 3) for c in chunksB}

def rank(ch):
    return sorted(ch, key=lambda c: cos(query, ch[c]), reverse=True)

def metrik(ch, rel, k=2):
    r = rank(ch)
    rec = len(set(r[:k]) & rel) / len(rel) if rel else 0.0
    mrr = 0.0
    for i, c in enumerate(r, 1):
        if c in rel:
            mrr = 1 / i
            break
    return rec, mrr

recA, mrrA = metrik(chunksA, relA)
recB, mrrB = metrik(chunksB, relB)
vonis = "strategi B (chunk overlap menjaga jawaban tetap utuh)"

print("A:", [(c, simA[c]) for c in sorted(simA, key=lambda c: simA[c], reverse=True)])
print("B:", [(c, simB[c]) for c in sorted(simB, key=lambda c: simB[c], reverse=True)])
print(f"recall@2 A={recA:.1f} MRR A={mrrA:.3f} | recall@2 B={recB:.1f} MRR B={mrrB:.3f}")
print(f"vonis: {vonis}")`,
        checks: [
          { kind: "defined", task: "t1", name: "simA", label: "`simA` terdefinisi", msg: "Hitung cosine similarity tiap chunk strategi A." },
          { kind: "defined", task: "t3", name: "vonis", label: "`vonis` terdefinisi", msg: "Tulis vonis strategi mana yang lebih baik dan alasannya." },
          { kind: "equal", task: "t2", name: "recA", value: 0.0, label: "`recA` = 0,0", msg: "Strategi A tidak punya chunk jawaban utuh — recall@2 = 0." },
          { kind: "equal", task: "t2", name: "mrrA", value: 0.0, label: "`mrrA` = 0,0", msg: "Tidak ada chunk relevan yang ter-retrieve — MRR = 0." },
          { kind: "equal", task: "t2", name: "recB", value: 1.0, label: "`recB` = 1,0", msg: "B4 (jawaban utuh) ada di 2 teratas strategi B." },
          { kind: "equal", task: "t2", name: "mrrB", value: 1.0, label: "`mrrB` = 1,0", msg: "B4 di peringkat 1 → MRR = 1/1 = 1,0." },
          { kind: "stdout_matches", task: "t3", pattern: "vonis: strategi B", label: "Vonis menyebut strategi B", msg: "Strategi B menjaga jawaban tetap utuh." },
          { kind: "stdout_matches", task: "t3", pattern: "recall@2 A=0\\.0 MRR A=0\\.000 \\| recall@2 B=1\\.0 MRR B=1\\.000", label: "Baris metrik tercetak benar", msg: "Samakan formatnya dengan baris print di starter." },
        ],
      },
      note: {
        title: "Bingkai jujur lab ini",
        type: "risk",
        body: "Lab ini memakai vektor kata hitung (bukan embedding neural) agar bisa jalan di browser tanpa model. Logika ranking, recall@k, dan MRR-nya identik dengan produksi — yang berbeda hanya cara vektor dibuat. Di produksi, ganti vec() dengan model embedding (mis. bge-m3 untuk Indonesia) dan dict chunk dengan index ANN.",
      },
      reference: "Chunking menentukan apa yang bisa di-retrieve; embedding hanya menentukan kecepatannya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: strategi retrieval untuk kebutuhanmu",
      prose: [
        "Skenario 1 — chatbot tanya-jawab satu jawaban (berapa biaya admin?). → Optimasi MRR, k kecil (3–5), tambah reranker. Alasan: yang penting jawaban benar ada di peringkat 1–3; 50 kandidat tidak membantu pengguna.",
        "Skenario 2 — merangkum semua syarat dari banyak dokumen. → Optimasi recall@k, k besar (15–20), chunk lebih kecil. Alasan: butuh cakupan, bukan satu jawaban; risiko noise diatasi dengan instruksi ringkas yang ketat di prompt.",
        "Skenario 3 — dokumen sering direvisi (regulasi, price list). → Versioning index + rebuild terjadwal + metadata tanggal di tiap chunk. Alasan: retrieval sempurna atas arsip basi = jawaban salah yang terlihat meyakinkan.",
        "Skenario 4 — latensi ketat (< 300ms) dengan jutaan chunk. → Index ANN agresif (HNSW), embedding kecil, tanpa reranker — atau reranker hanya untuk k=10. Alasan: reranker cross-encoder mahal; jangan bayar untuk tiap query bila SLA tidak mengizinkan.",
        "Skenario 5 — dokumen multibahasa (Indonesia + Inggris). → Model embedding multibahasa + chunking yang sadar bahasa; uji MRR per bahasa terpisah. Alasan: embedding Inggris-sering gagal total pada istilah Indonesia (“ongkos kirim” vs “shipping fee”).",
        "Aturan praktis 10 detik: (1) tentukan dulu MRR atau recall yang penting; (2) perbaiki chunking sebelum embedding; (3) index harus berversi mengikuti revisi dokumen; (4) reranker untuk presisi, bukan untuk menemukan yang hilang.",
      ],
      note: {
        title: "💡 Intuisi: evaluasi retrieval = kontrak dengan masa depan",
        body: "Simpan 50–100 query dengan jawaban benar yang diketahui (golden set) SEBELUM mengubah apa pun. Setiap perubahan chunking/embedding/index diuji terhadap golden set yang sama — tanpa ini, “perbaikan” hanyalah perasaan.",
      },
      tasks: [],
      reference: "Satu jawaban → MRR + reranker. Cakupan → recall@k + k besar. Dokumen hidup → index berversi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Chatbot asuransi: MRR 0,31 dengan recall 0,94",
      prose: [
        "“ProteksiKu”, chatbot asuransi kesehatan, memakai RAG di atas 200 dokumen polis. Angka evaluasinya membingungkan: recall@5 = 0,94 (hampir sempurna) tetapi MRR = 0,31 dan 30% jawaban salah mengutip angka. Tim terbelah: kubu A ingin mengganti model embedding (biaya +Rp18 juta/bulan), kubu B ingin mengubah chunking.",
        "Audit menemukan: dokumen polis memakai fixed-size chunking 500 karakter tanpa overlap. Klausul seperti “manfaat rawat inap Rp500.000 per hari, maksimal 30 hari” terbelah menjadi “manfaat rawat inap Rp500.000” | “per hari, maksimal 30 hari”. Retriever menemukan chunk pertama (recall tinggi — katanya ada), tetapi chunk itu tidak memuat jawaban lengkap (MRR rendah untuk jawaban UTUH, dan LLM mengarang sisanya).",
        "Tim memilih kubu B: recursive chunking dengan overlap 15%, tanpa mengganti embedding. Hasil setelah 3 hari kerja: MRR naik 0,31 → 0,68; jawaban salah turun 30% → 11%; biaya Rp0 tambahan. Kubu A kemudian tetap menguji embedding baru di atas chunking baru: MRR naik lagi 0,68 → 0,74 — bukti bahwa urutan yang benar adalah chunking dulu, embedding kemudian.",
        "Pembahasan: pelajaran umumnya — metrik yang “bagus” (recall@5 0,94) bisa menutupi masalah yang sebenarnya (chunk terbelah). Selalu ukur MRR berdampingan dengan recall, dan selidiki CONTOH jawaban yang salah satu per satu sebelum memutuskan komponen mana yang diperbaiki. Tiga contoh cukup untuk menemukan pola; nol contoh = menebak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di asuransi dan perbankan, jawaban chatbot yang mengutip angka polis secara terpotong = mis-selling. Golden set evaluasi harus mencakup angka-angka kritis (manfaat, premi, denda) — bukan sekadar pertanyaan umum.",
      },
      reference: "recall tinggi + MRR rendah = chunk terbelah. Perbaiki chunking dulu, gratis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang implementasi dan evaluasi RAG — dari chunking sampai urutan perbaikan.",
      ],
      tasks: [],
      summary: [
        "Pipeline RAG: dokumen → chunking → embedding → index → retrieval → jawaban; perbaiki dari kiri ke kanan.",
        "Recall@k mengukur cakupan (buta urutan); MRR mengukur posisi chunk relevan pertama — pilih sesuai kebutuhan.",
        "Chunking menentukan apa yang bisa di-retrieve; embedding hanya menentukan kecepatannya.",
        "Reranker (cross-encoder) memperbaiki presisi urutan, tidak bisa menemukan chunk yang tak terambil.",
        "Kegagalan umum: chunk boundary, stale index, query-chunk mismatch, konteks berlebih — kenali gejalanya.",
      ],
      next: { label: "DLE25 — TensorFlow & Keras untuk Deep Learning Engineer", href: "/learn/dle25-tensorflow-keras" },
      quiz: [
        {
          q: "Strategi A (tanpa overlap) memberi recall@2 = 0,0 sedangkan B (overlap) = 1,0 untuk query yang sama. Kesimpulan yang tepat?",
          options: [
            { text: "Model embedding strategi A lebih buruk", why: "Embedding-nya sama persis di kedua strategi — yang berbeda hanya cara memotong dokumen.", correct: false },
            { text: "Chunking A membelah jawaban sehingga tidak ada chunk utuh yang bisa di-retrieve", why: "“tenor” dan “bulan” jatuh di chunk berbeda; recall 0 bukan kegagalan pencarian melainkan kegagalan penyimpanan.", correct: true },
            { text: "Query-nya salah, harus diganti", why: "Query yang sama berhasil sempurna di strategi B — masalahnya di index, bukan query." },
            { text: "k=2 terlalu kecil; naikkan k sampai recall A bagus", why: "Menaikkan k tidak menciptakan chunk utuh yang tidak ada — A tidak punya jawaban lengkap pada k berapa pun." },
          ],
        },
        {
          q: "Kapan MRR lebih tepat daripada recall@k sebagai metrik utama?",
          options: [
            { text: "Saat butuh merangkum semua syarat dari banyak dokumen", why: "Itu kebutuhan cakupan — recall@k yang tepat.", correct: false },
            { text: "Saat butuh satu jawaban benar di peringkat teratas (chatbot FAQ)", why: "MRR menghargai posisi: jawaban di peringkat 1 jauh lebih berguna daripada di peringkat 5.", correct: true },
            { text: "Saat index-nya sangat besar", why: "Ukuran index tidak menentukan pilihan metrik — kebutuhan pengguna yang menentukan." },
            { text: "Selalu — MRR strictly lebih baik", why: "Untuk kebutuhan cakupan/rangkuman, recall@k memberi sinyal yang MRR tidak punya." },
          ],
        },
        {
          q: "Dokumen polis direvisi tiap bulan, tetapi jawaban chatbot masih mengutip versi lama. Komponen yang rusak?",
          options: [
            { text: "Model embedding — harus diganti yang lebih baru", why: "Embedding tidak menyimpan versi dokumen; masalahnya index tidak di-rebuild setelah revisi.", correct: false },
            { text: "Chunking — potongannya terlalu besar", why: "Ukuran potongan tidak menjelaskan kenapa versi lama yang muncul.", correct: false },
            { text: "Index basi — butuh versioning dan rebuild terjadwal", why: "Vektor lama = dokumen lama; tanpa rebuild, retrieval mengambil arsip kedaluwarsa.", correct: true },
            { text: "LLM — halusinasi", why: "LLM mengutip setia dari konteks yang diberi; konteksnyalah yang basi." },
          ],
        },
        {
          q: "Reranker (cross-encoder) paling tepat dipakai ketika…",
          options: [
            { text: "Chunk relevan tidak masuk 50 besar kandidat", why: "Reranker hanya mengurutkan ulang kandidat yang ada — ia tidak bisa menemukan yang hilang.", correct: false },
            { text: "Retriever sudah menemukan kandidat bagus tetapi urutannya buruk", why: "Itulah gunanya tahap kedua yang teliti: 50 kandidat murah → 5 terbaik.", correct: true },
            { text: "Ingin memperbaiki recall@k secara signifikan", why: "Recall ditentukan tahap pertama; reranker memperbaiki presisi urutan, bukan cakupan." },
            { text: "Latensi harus di bawah 100ms untuk tiap query", why: "Cross-encoder justru mahal — untuk latensi ekstrem, reranker malah dihindari." },
          ],
        },
        {
          q: "Urutan perbaikan RAG yang benar saat jawaban sering salah?",
          options: [
            { text: "Ganti embedding → tambah reranker → cek chunking", why: "Itu urutan termahal dulu — persis kesalahan tim Siaga yang menghabiskan Rp18 juta/bulan.", correct: false },
            { text: "Perbesar k → ganti LLM → audit chunking", why: "Memperbesar k menenggelamkan LLM dalam noise; mengganti LLM tanpa konteks yang benar tidak membantu.", correct: false },
            { text: "Audit contoh jawaban salah → perbaiki chunking → segarkan index → retriever → reranker", why: "Mulai dari bukti (contoh salah), perbaiki dari komponen paling kiri yang rusak — termurah dulu.", correct: true },
            { text: "Latih ulang embedding dengan data sendiri", why: "Fine-tuning embedding mahal dan jarang menjadi akar masalah; 90% kasus ada di chunking/index." },
          ],
        },
      ],
    },
  ],
};
