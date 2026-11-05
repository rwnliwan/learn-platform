import type { V2Lesson } from "../lib/types";

// Cosine similarity query-vs-hipotesis untuk 5 dokumen: query pendek gagal, dokumen hipotetis menang.
const FIG_HYDE = `<svg viewBox="0 0 520 260" role="img" aria-label="Perbandingan cosine similarity query pendek vs dokumen hipotetis.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="140" y="20">query pendek</text><text x="380" y="20">dokumen hipotetis (HyDE)</text></g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="40" y="40" width="200" height="30" fill="var(--c4)" opacity="0.45"/><text x="46" y="60" fill="var(--text)">d1 pengecoh: 0,67</text>
<rect x="40" y="74" width="200" height="30" fill="var(--c3)" opacity="0.45"/><text x="46" y="94" fill="var(--text)">d2 target: 0,38 ✗</text>
<rect x="280" y="40" width="200" height="30" fill="var(--c4)" opacity="0.45"/><text x="286" y="60" fill="var(--text)">d1 pengecoh: 0,26</text>
<rect x="280" y="74" width="200" height="30" fill="var(--c1)"/><text x="286" y="94" fill="var(--text)">d2 target: 0,76 ✓</text>
</g>
<text x="260" y="150" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Query pendek memilih pengecoh (d1) — dokumen hipotetis yang</text>
<text x="260" y="168" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">“berisi” menempatkan target (d2) jauh di depan</text>
<text x="260" y="196" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">5 dokumen FAQ bank · query: “berapa bunga deposito tabungan”</text>
<text x="260" y="238" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">angka dari Lab langkah 4 — vektor kata tiruan, pola sesuai temuan HyDE (Gao et al.)</text>
</svg>`;

// Alur CRAG: evaluator ringan -> tiga aksi Correct / Ambiguous / Incorrect.
const FIG_CRAG = `<svg viewBox="0 0 560 330" role="img" aria-label="Diagram alur CRAG dengan tiga aksi korektif.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="210" y="10" width="140" height="36" rx="6" fill="var(--c3)"/><text x="280" y="32" fill="var(--text)">Query + dokumen terambil</text>
<rect x="200" y="66" width="160" height="36" rx="6" fill="var(--c4)"/><text x="280" y="88" fill="var(--text)">Evaluator ringan (T5-large)</text>
<text x="280" y="122" fill="var(--text-muted)">skor relevansi s</text>
<rect x="60" y="140" width="130" height="52" rx="6" fill="var(--c1)"/><text x="125" y="160" fill="var(--text)">Correct</text><text x="125" y="178" fill="var(--text)">s ≥ ambang atas</text>
<rect x="215" y="140" width="130" height="52" rx="6" fill="var(--c2)"/><text x="280" y="160" fill="var(--text)">Ambiguous</text><text x="280" y="178" fill="var(--text)">di antaranya</text>
<rect x="370" y="140" width="130" height="52" rx="6" fill="var(--c5)"/><text x="435" y="160" fill="var(--text)">Incorrect</text><text x="435" y="178" fill="var(--text)">s &lt; ambang bawah</text>
<rect x="60" y="212" width="130" height="56" rx="6" fill="none" stroke="var(--c1)"/><text x="125" y="232" fill="var(--text)">dekomposisi →</text><text x="125" y="248" fill="var(--text)">filter → rekomposisi</text>
<rect x="215" y="212" width="130" height="56" rx="6" fill="none" stroke="var(--c2)"/><text x="280" y="232" fill="var(--text)">gabung: strip</text><text x="280" y="248" fill="var(--text)">kunci + web search</text>
<rect x="370" y="212" width="130" height="56" rx="6" fill="none" stroke="var(--c5)"/><text x="435" y="232" fill="var(--text)">buang semua →</text><text x="435" y="248" fill="var(--text)">web search</text>
<rect x="200" y="288" width="160" height="32" rx="6" fill="var(--c3)"/><text x="280" y="308" fill="var(--text)">Generator menjawab</text>
</g>
</svg>`;

export const aie14: V2Lesson = {
  slug: "aie14-advanced-rag",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE14 — Advanced RAG: HyDE, Multi-Query & Corrective RAG",
  estMinutes: 47,
  steps: [
    {
      id: "cerita-retrieval-gagal",
      eyebrow: "Langkah 1 · Cerita",
      title: "RAG Tingkat Lanjut: ketika retrieval biasa gagal",
      prose: [
        "Awal 2026. Tim RAG sebuah bank meluncurkan chatbot customer service di atas 40.000 dokumen SOP. Pelanggan mengetik: 'kartu saya ketelan mesin ATM, gimana?' Retrieval mengembalikan dokumen 'cara blokir kartu kredit yang hilang' — mirip secara kata, tetapi jawabannya tidak ada di sana. Prosedur kartu tertelan adanya di dokumen lain berjudul 'penanganan insiden perangkat'. LLM menjawab dengan percaya diri dari konteks yang salah: 'silakan hubungi call center untuk blokir kartu'. Pelanggan makin panik; tiket eskalasi meledak.",
        "Tim bereaksi seperti kebanyakan tim: menambah dokumen, menaikkan ukuran chunk, mengganti LLM ke model yang lebih besar. Tidak ada yang berubah. Karena kegagalannya bukan di pengetahuan, bukan di generator — melainkan di RETRIEVAL. Dan retrieval gagal itu sunyi: tidak ada error, tidak ada exception. Hanya jawaban salah yang terdengar benar.",
        "Twist yang mengubah cara mereka bekerja: mereka berhenti memperbaiki jawaban, dan mulai memperbaiki PENCARIAN. Tiga teknik menjadi senjata barunya. HyDE — meminta LLM 'bermimpi' dulu menjadi dokumen jawaban, lalu mencari dokumen nyata yang mirip mimpi itu. Multi-query — menyerang dari banyak arah dengan 3-5 varian query. CRAG — memasang inspektur yang menilai kualitas hasil retrieval dan mengoreksinya sendiri: buang yang busuk, cari di web bila perlu. Wrong-answer rate turun dari 29% ke 8%. Lesson ini membedah ketiganya — diminta eksplisit di job description 'advanced retrieval techniques'.",
        "Bekal kilat (agar lesson ini mandiri): lesson RAG dasar membangun pipeline chunking → embedding → cosine similarity → LLM menjawab dari konteks terambil. Lesson hybrid search menambahkan BM25 untuk istilah spesifik, menggabungkan ranking dengan RRF, dan me-rerank 50 kandidat menjadi 5. (Di track Agentic AI, aai5 hanya membahas KAPAN agen perlu retrieve — bukan teknik retrievalnya — jadi tidak dibahas ulang di sini.)",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) mendiagnosis kegagalan retrieval yang 'sunyi' dari pola wrong-answer; (2) menjelaskan cara kerja HyDE dan kapan ia membantu; (3) merancang multi-query expansion dengan fusion; (4) memetakan tiga aksi CRAG (Correct/Ambiguous/Incorrect) ke kondisi retrieval; (5) memilih teknik berdasarkan budget latensi dan biaya.",
        "🗺️ Isi lesson (⏱ 47 mnt · 1 lab · 5 kuis · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · HyDE: si pemimpi — Langkah 3 · Multi-query & CRAG: penyerang dan inspektur — Langkah 4 · Lab: simulasi HyDE — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case bank — Checkpoint.",
      ],
      tasks: [],
      reference: "Retrieval gagal itu sunyi. Perbaiki pencarian, bukan jawabannya.",
    },
    {
      id: "konsep-hyde",
      eyebrow: "Langkah 2 · HyDE",
      title: "HyDE — si pemimpi yang menemukan kenyataan",
      prose: [
        "Masalah yang diserang HyDE: query manusia itu pendek dan miskin kata ('berapa bunga deposito tabungan'), sementara dokumen jawaban itu panjang dan kaya kata ('suku bunga deposito dua belas bulan terbaru...'). Di ruang vektor, keduanya tinggal di 'lingkungan' yang berbeda — cosine similarity-nya lemah dan rapuh. Paper 'Precise Zero-Shot Dense Retrieval without Relevance Labels' (Gao, Ma, Lin, Callan — arXiv 2212.10496, Desember 2022) mengusulkan jalan memutar yang cerdik: jangan embed query-nya; embed MIMPI jawabannya.",
        "Cara kerja HyDE, tiga langkah. Pertama, sebuah LLM yang mengikuti instruksi (misalnya InstructGPT) diminta menghasilkan dokumen HIPOTETIS dari query — dokumen yang menangkap pola relevansi jawaban. Kedua, encoder yang dilatih kontrasif tanpa label (misalnya Contriever) mengubah dokumen hipotetis itu menjadi vektor embedding. Ketiga, vektor tersebut dipakai untuk mencari tetangga terdekat di ruang embedding korpus — dokumen NYATA yang mirip. Hasil eksperimen paper: HyDE mengungguli Contriever secara signifikan dan setara dengan retriever yang di-fine-tune, diuji pada web search, QA, fact verification, dan tiga bahasa (Swedia, Korea, Jepang).",
        "Kepribadian HyDE: seperti detektif yang membuat sketsa wajah pelaku dari deskripsi saksi ('bermimpi'), lalu mencocokkan sketsa itu dengan foto KTP di database — bukan mencocokkan deskripsi kata-per-katanya. Sketsanya boleh salah detail (warna jaket keliru), tetapi struktur wajahnya menuntun ke orang yang benar.",
        "Kapan HyDE bersinar dan kapan tidak. Bersinar: query pendek, faktual, kosakata query jauh dari kosakata dokumen. Menyusut manfaatnya: query yang sudah panjang dan spesifik (hipotesis tidak menambah informasi baru), atau domain yang LLM-nya tidak kenal sama sekali (mimpinya ngawur total — meski encoder biasanya tetap menyaring bagian ngawurnya). HyDE = zero-shot: tidak butuh label relevansi sama sekali, itulah nilai jualnya dibanding fine-tune retriever.",
        "Biaya yang jujur: satu panggilan LLM per query untuk membuat dokumen hipotetis. Untuk 20.000 query/hari dengan model murah, itu pos biaya nyata — tetapi jauh lebih murah daripada fine-tune + maintain retriever khusus. Cache hipotesis untuk query yang berulang; 30-40% query produksi biasanya repetitif.",
        "Cara membaca chart: sumbu X = lima dokumen, tinggi batang = cosine similarity terhadap query (kiri) vs terhadap dokumen hipotetis (kanan). Interpretasi: query pendek menempatkan pengecoh d1 (0,67) di atas target d2 (0,38) — selisih tipis dan rapuh. Dokumen hipotetis membalik keadaan: d2 (0,76) jauh di atas d1 (0,26). Inilah intuisi HyDE — 'mimpi' yang berisi menggeser titik pencarian ke lingkungan yang benar.",
      ],
      formula: String.raw`\hat{h} = \mathrm{LLM}(q), \quad \mathbf{e} = \mathrm{Enc}(\hat{h}), \quad \mathrm{retrieve} = \underset{d}{\mathrm{arg\,top}}_k \, \cos(\mathbf{e}, \mathbf{d})`,
      formulaNote: "q = query pendek dari pengguna; ĥ ('h topi') = dokumen hipotetis buatan LLM — boleh mengandung detail salah; e = vektor embedding dokumen hipotetis; d = vektor embedding tiap dokumen korpus; cos = cosine similarity; k = jumlah dokumen yang diambil. Intuisi: kita tidak mencari tetangga dari q yang kurus, melainkan dari e yang 'berisi' — peluang tetangganya adalah dokumen jawaban yang benar jauh lebih besar.",
      figure: {
        svg: FIG_HYDE,
        alt: "Perbandingan cosine similarity query pendek vs dokumen hipotetis pada 5 dokumen.",
        caption: "Query pendek gagal, dokumen hipotetis (HyDE) berhasil — pola dari Lab langkah 4.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "HyDE paling membantu ketika query dan dokumen 'berbicara bahasa berbeda' — query pendek sehari-hari vs dokumen formal panjang. Jika query-mu sudah sepanjang paragraf dengan istilah teknis yang tepat, hipotesis LLM hampir tidak menambah sinyal baru: hemat panggilan LLM-nya, pakai retrieval biasa + rerank.",
      },
      reference: "HyDE: bermimpi dulu (LLM), lalu cari kenyataan yang mirip mimpi (encoder). Zero-shot, tanpa label.",
    },
    {
      id: "konsep-multiquery-crag",
      eyebrow: "Langkah 3 · Multi-query & CRAG",
      title: "Multi-query si penyerang, CRAG si inspektur",
      prose: [
        "Multi-query expansion menyerang masalah yang berbeda: AMBIGUITAS. Query 'berapa bunga deposito tabungan' punya banyak tafsir — deposito berjangka? tabungan biasa? pajaknya? Satu arah pencarian bisa meleset total. Solusinya: minta LLM membuat 3-5 varian query dari query asli (parafrase + spesifikasi), tiap varian me-retrieve 20 dokumen, gabungkan 60-100 kandidat, dedup, lalu teruskan ke rerank. Ini sepupu dekat query rewrite di lesson hybrid — bedanya di sini varian dibuat EKSPLISIT dan banyak, bukan satu rewrite.",
        "Kepribadian multi-query: seperti mengirim tiga pencari ke tiga arah berbeda dari titik yang sama, lalu menggabungkan peta mereka. Satu pencari bisa tersesat; tiga pencari yang kembali dengan peta tumpang-tindih = lokasi target hampir pasti benar. Fusion-nya memakai RRF (dari lesson hybrid) — peringkat, bukan skor.",
        "CRAG — Corrective RAG — menyerang masalah ketiga: hasil retrieval yang BUSUK. Paper 'Corrective Retrieval Augmented Generation' (Yan et al. — arXiv 2401.15884, Januari 2024, revisi Oktober 2024) berangkat dari pertanyaan yang jarang ditanyakan: bagaimana jika retrieval-nya salah? Kebanyakan RAG menelan mentah apa pun yang dikembalikan retriever — dokumen tidak relevan ikut 'meracuni' generator dan memperparah halusinasi. CRAG memasang INSPEKTUR: evaluator ringan (diinisialisasi dari T5-large lalu di-fine-tune) yang menilai kualitas keseluruhan dokumen terambil dan mengembalikan derajat kepercayaan.",
        "Dari skor kepercayaan itu, tiga aksi berbeda dipicu. Correct (skor tinggi): dokumen dipercaya, tetapi tetap disuling lewat algoritma decompose-then-recompose — dokumen dipecah menjadi strip-strip pengetahuan, yang tidak relevan dibuang, yang kunci disusun ulang. Incorrect (skor rendah): semua dokumen terambil DIBUANG, diganti dengan hasil web search skala besar sebagai koreksi — karena korpus statis yang terbatas memang tidak bisa memberi yang lebih baik. Ambiguous (di tengah): aksi lunak yang menggabungkan keduanya. CRAG bersifat plug-and-play: diuji menempel pada RAG standar (Lewis et al.) maupun Self-RAG, dengan peningkatan signifikan pada empat dataset — PopQA, Biography, Pub Health, Arc-Challenge — mencakup tugas generasi pendek maupun panjang.",
        "Kepribadian CRAG: seperti editor berita yang memeriksa kiriman reporter sebelum cetak. Kiriman bagus → tetap disunting (buang kalimat sampah). Kiriman ngawur → dibuang, kirim reporter lain (web search). Kiriman meragukan → pakai sebagian + verifikasi silang. Tidak ada koran serius yang mencetak mentah kiriman reporter — RAG-mu juga seharusnya begitu.",
        "Cara membaca diagram: alur turun dari query ke evaluator; tiga kolom = tiga aksi berdasarkan skor s terhadap dua ambang. Interpretasi: Correct murah (hanya suling), Incorrect mahal (web search), Ambiguous di tengah. Desain ini membuat biaya mengikuti kualitas retrieval — retrieval bagus = murah, retrieval busuk = bayar koreksi. Itulah 'corrective': sistem membayar hanya saat perlu dikoreksi.",
      ],
      formula: String.raw`\mathrm{aksi} = \begin{cases} \mathrm{Correct} & s \geq \tau_{hi} \\ \mathrm{Ambiguous} & \tau_{lo} \leq s < \tau_{hi} \\ \mathrm{Incorrect} & s < \tau_{lo} \end{cases}`,
      formulaNote: "s = skor relevansi dari evaluator ringan (0-1); τ_hi dan τ_lo ('tau') = ambang atas dan bawah yang ditentukan saat kalibrasi. Contoh angka: s = 0,9 → Correct (suling dokumen); s = 0,5 → Ambiguous (gabung strip kunci + web search); s = 0,1 → Incorrect (buang semua, andalkan web search). Ambang digeser sesuai toleransi risiko: layanan medis memakai τ_hi tinggi (sulit percaya dokumen).",
      figure: {
        svg: FIG_CRAG,
        alt: "Diagram alur CRAG: evaluator memicu tiga aksi Correct, Ambiguous, Incorrect.",
        caption: "CRAG: inspektur retrieval dengan tiga aksi korektif (Yan et al., arXiv 2401.15884).",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'CRAG selalu lebih baik — pasang saja di semua pipeline RAG.' Salah. Evaluator + web search + rekomposisi = latensi dan biaya per query yang nyata. Jika retrieval-mu sudah sehat (recall@5 di atas 90%), CRAG hampir selalu memicu Correct dan hanya menambah overhead. Aturannya: ukur kualitas retrieval DULU (lesson hybrid: recall@k, MRR); CRAG adalah obat untuk retrieval yang sakit, bukan vitamin harian.",
      },
      reference: "Multi-query = banyak arah, satu target. CRAG = inspektur: Correct disuling, Incorrect dibuang + web search, Ambiguous digabung.",
    },
    {
      id: "lab-hyde",
      eyebrow: "Langkah 4 · Lab HyDE",
      title: "Lab: simulasi 'bermimpi dulu, cari kemudian'",
      prose: [
        "Lima dokumen FAQ, satu query pendek yang ambigu: 'berapa bunga deposito tabungan'. Vektor kata tiruan (bag-of-words + cosine) mensimulasikan ruang embedding. Tugasmu: implementasikan `retrieve` — lalu buktikan bahwa query pendek memilih PENGECOH (d1), sementara dokumen hipotetis 'mimpi LLM' memilih TARGET yang benar (d2) dengan margin lebar.",
        "Coba eksplorasi: (1) ganti HYP dengan mimpi yang lebih ngawur ('bunga deposito itu bunga yang ditanam di tabungan') — apakah top1_hyp tetap d2? (2) ganti QUERY menjadi 'suku bunga deposito dua belas bulan' — query yang sudah spesifik; bandingkan margin-nya dengan margin_hyp. (3) naikkan noise: hapus kata 'suku' dari HYP dan lihat margin menyusut.",
        "Cara membaca output: `cos_query` vs `cos_hyp` = dua 'pendapat' tentang dokumen yang sama; `top1_*` = pemenangnya; `margin_hyp` = selisih pemenang dengan runner-up. Interpretasi: HyDE tidak membuat query 'lebih benar' — ia memindahkan titik pencarian ke lingkungan vektor yang lebih kaya sinyal, sehingga pemenang menang dengan margin meyakinkan, bukan kebetulan.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `retrieve(text, docs)`: bangun vocab gabungan, hitung cosine per dokumen, kembalikan `(sims, ranking)`" },
        { id: "t2", text: "Jalankan untuk QUERY dan HYP, `print` skor + top1 + margin, bandingkan" },
      ],
      expected: "top1_query: d1 (pengecoh menang), top1_hyp: d2 (target menang), margin_hyp: 0.5056",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Lab ini membuktikan HyDE selalu menang.' Tidak. Vektor kata tiruan di sini hanya ilustrasi POLA — bukti kemenangan HyDE yang sebenarnya ada di paper Gao et al.: mengungguli Contriever dan setara retriever yang di-fine-tune pada web search, QA, dan fact verification. Lab = intuisi, paper = bukti.",
      },
      hints: [
        "vocab = sorted({w for d in docs for w in tok(d)} | set(tok(text)))",
        "qv = bow_vec(text, vocab); sims = [cosine(qv, bow_vec(d, vocab)) for d in docs]",
        "ranking = sorted(range(len(docs)), key=lambda i: sims[i], reverse=True)",
      ],
      code: {
        starter: `# SEED — jangan ubah
import math
DOCS = [
    "cara blokir kartu kredit yang hilang",
    "bunga deposito dan pajak tabungan",
    "suku bunga deposito dua belas bulan terbaru",
    "syarat pengajuan kpr rumah pertama",
    "biaya administrasi kartu debit",
]
QUERY = "berapa bunga deposito tabungan"
HYP = "suku bunga deposito dua belas bulan terbaru sekitar lima persen per tahun"

def tok(s):
    return s.lower().split()

def bow_vec(text, vocab):
    ws = tok(text)
    return [ws.count(w) for w in vocab]

def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    return dot/(na*nb) if na and nb else 0.0

# TULIS KODEMU (di bawah garis ini)
def retrieve(text, docs):
    # TODO t1: vocab gabungan -> qv -> sims per dokumen -> ranking menurun
    return [], []

# UJI (jangan ubah)
sims_q, rank_q = retrieve(QUERY, DOCS)
sims_h, rank_h = retrieve(HYP, DOCS)
print("cos_query:", [round(s, 4) for s in sims_q])
print("cos_hyp:", [round(s, 4) for s in sims_h])
print("top1_query:", "d"+str(rank_q[0]))
print("top1_hyp:", "d"+str(rank_h[0]))
print("margin_hyp:", round(sims_h[rank_h[0]]-sims_h[rank_h[1]], 4))`,
        lockLines: 25,
        solution: `# SEED — jangan ubah
import math
DOCS = [
    "cara blokir kartu kredit yang hilang",
    "bunga deposito dan pajak tabungan",
    "suku bunga deposito dua belas bulan terbaru",
    "syarat pengajuan kpr rumah pertama",
    "biaya administrasi kartu debit",
]
QUERY = "berapa bunga deposito tabungan"
HYP = "suku bunga deposito dua belas bulan terbaru sekitar lima persen per tahun"

def tok(s):
    return s.lower().split()

def bow_vec(text, vocab):
    ws = tok(text)
    return [ws.count(w) for w in vocab]

def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    return dot/(na*nb) if na and nb else 0.0

# TULIS KODEMU (di bawah garis ini)
def retrieve(text, docs):
    vocab = sorted({w for d in docs for w in tok(d)} | set(tok(text)))
    qv = bow_vec(text, vocab)
    sims = [cosine(qv, bow_vec(d, vocab)) for d in docs]
    ranking = sorted(range(len(docs)), key=lambda i: sims[i], reverse=True)
    return sims, ranking

# UJI (jangan ubah)
sims_q, rank_q = retrieve(QUERY, DOCS)
sims_h, rank_h = retrieve(HYP, DOCS)
print("cos_query:", [round(s, 4) for s in sims_q])
print("cos_hyp:", [round(s, 4) for s in sims_h])
print("top1_query:", "d"+str(rank_q[0]))
print("top1_hyp:", "d"+str(rank_h[0]))
print("margin_hyp:", round(sims_h[rank_h[0]]-sims_h[rank_h[1]], 4))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "cos_query: \\[0\\.0, 0\\.6708, 0\\.378", label: "Skor query pendek terhitung benar", msg: "Pengecoh d1 (0,67) mengalahkan target d2 (0,38)." },
          { kind: "stdout_matches", task: "t2", pattern: "top1_query: d1", label: "Query pendek memilih pengecoh d1", msg: "Inilah kegagalan retrieval yang 'sunyi'." },
          { kind: "stdout_matches", task: "t2", pattern: "top1_hyp: d2", label: "Dokumen hipotetis memilih target d2", msg: "Mimpi yang berisi menemukan kenyataan." },
          { kind: "stdout_matches", task: "t2", pattern: "margin_hyp: 0\\.5056", label: "Margin hipotesis 0,5056", msg: "Kemenangan meyakinkan, bukan kebetulan." },
        ],
      },
      reference: "HyDE = pindahkan titik pencarian ke lingkungan yang kaya sinyal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: teknik apa untuk kegagalan apa?",
      prose: [
        "Skenario 1 — query pendek, faktual, kosakata sehari-hari ('bunga deposito?') → HyDE. Query kurus adalah makanan empuk dokumen hipotetis: satu panggilan LLM memberi 'daging' pada titik pencarian.",
        "Skenario 2 — query ambigu multi-tafsir ('kartu ketelan gimana?') → multi-query 3-5 varian + fusion RRF. Jangan menebak tafsir pengguna; serang semua tafsir sekaligus.",
        "Skenario 3 — retrieval sering mengembalikan sampah (recall@5 di bawah 70%, keluhan 'jawabannya ngawur') → CRAG. Pasang inspektur: Correct disuling, Incorrect dibuang + web search. Ini satu-satunya teknik yang berani MEMBUANG hasil retriever.",
        "Skenario 4 — latensi ketat di bawah 500ms (chat real-time) → HINDARI CRAG; pakai multi-query ringan (2-3 varian) atau hybrid + rerank saja. Web search + evaluator tidak muat di budget 500ms.",
        "Skenario 5 — budget token ketat, volume tinggi → urutan pasang: multi-query dulu (hampir gratis, hanya retrieve tambahan), HyDE bila query pendek mendominasi log, CRAG terakhir dan hanya untuk segmen query yang terbukti gagal. Tiap lapisan diukur dampaknya sebelum lapisan berikut dipasang.",
        "Aturan praktis 10 detik: (1) query pendek & faktual? HyDE. (2) query ambigu? multi-query. (3) hasil sering busuk? CRAG. (4) latensi < 500ms? tanpa CRAG. (5) selalu ukur recall@5 sebelum dan sesudah — teknik tanpa metrik = dekorasi.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pasang teknik berlapis sesuai kegagalan yang TERUKUR dari log query-mu, bukan semua sekaligus. Urutan termurah: multi-query → HyDE → CRAG. Kebanyakan tim hanya butuh satu lapisan — yang benar. Tiga lapisan tanpa diagnosis = tiga sumber bug baru.",
      },
    },
    {
      id: "minicase-bank",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: chatbot bank, 20.000 query/hari",
      prose: [
        "Situasi: chatbot CS bank, 20.000 query/hari, 40.000 dokumen SOP. Baseline dense retrieval: recall@5 = 71% → 29% query (5.800/hari) tidak menemukan dokumen yang benar. Separuh dari yang gagal itu dijawab LLM dengan percaya diri dari konteks salah → wrong-answer rate 14,5% ≈ 2.900 jawaban salah/hari. Eskalasi ke CS manusia Rp12.000/tiket untuk 5.800 tiket = Rp69,6 juta/hari terbakar.",
        "Intervensi bertahap (angka simulasi kasus, biaya ilustratif). Tahap 1 — multi-query 3 varian + RRF: recall@5 naik ke 79% (+8 poin), biaya tambahan hanya retrieve (diabaikan). Tahap 2 — HyDE untuk query pendek (< 6 kata, 45% traffic): recall@5 ke 84% (+5 poin); biaya 9.000 × Rp150 = Rp1,35 juta/hari. Tahap 3 — CRAG hanya untuk 16% query tersisa yang masih gagal: separuhnya dikoreksi via web search → wrong-answer rate turun ke ~8%.",
        "Hasil akhir: tiket eskalasi 5.800 → ~3.200/hari = Rp38,4 juta/hari (hemat Rp31,2 juta/hari). Total biaya teknik: HyDE Rp1,35 juta + CRAG web search 3.200 × Rp500 = Rp1,6 juta → Rp2,95 juta/hari. Net hemat ≈ Rp28 juta/hari ≈ Rp850 juta/bulan. Perhatikan: 71% → 84% terlihat 'hanya' +13 poin, tetapi dalam rupiah = Rp850 juta/bulan. Persentase menipu; rupiah jujur.",
        "Pembahasan: mengapa tidak langsung CRAG untuk semua? Karena 84% query sudah terjawab baik — membayar web search untuk mereka = Rp10 juta/hari untuk nol perbaikan. Pelajaran desainnya: teknik mahal hanya untuk segmen yang terbukti gagal. Dan selalu konversi metrik retrieval ke biaya operasional saat presentasi — 'recall naik 13 poin' tidak menggerakkan direksi, 'hemat Rp850 juta/bulan' menggerakkan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi menjelaskan alasan benar/salahnya.",
      ],
      tasks: [],
      summary: [
        "Retrieval gagal itu sunyi — tidak ada error, hanya jawaban salah yang terdengar benar; perbaiki pencarian, bukan generator.",
        "HyDE: LLM membuat dokumen hipotetis (boleh salah detail), encoder mengubahnya jadi vektor, lalu cari dokumen nyata terdekat — zero-shot, tanpa label relevansi.",
        "Multi-query: 3-5 varian query untuk ambiguitas, tiap varian retrieve, gabung dengan RRF.",
        "CRAG: evaluator ringan (T5-large) → Correct disuling (decompose-recompose), Incorrect dibuang + web search, Ambiguous digabung.",
        "Urutkan dari murah: multi-query → HyDE → CRAG; ukur recall@5 sebelum/sesudah; konversi ke rupiah.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Mengapa dokumen hipotetis HyDE tidak berbahaya meski bisa mengandung detail salah?",
          options: [
            { text: "Tidak pernah dipakai sebagai jawaban — hanya umpan embedding; bottleneck encoder menyaring detail salah", why: "Tepat: yang diambil dan ditampilkan tetap dokumen nyata dari korpus.", correct: true },
            { text: "LLM tidak pernah salah membuat dokumen hipotetis", why: "Salah: paper-nya eksplisit menyebut dokumen hipotetis 'unreal and may contain false details'.", correct: false },
            { text: "Dokumen hipotetis dihapus otomatis setelah dipakai", why: "Bukan soal dihapus — soal tidak pernah menjadi jawaban.", correct: false },
            { text: "Encoder selalu memperbaiki fakta yang salah", why: "Encoder tidak memverifikasi fakta; ia hanya menyaring via bottleneck dense.", correct: false },
          ],
        },
        {
          q: "Kapan multi-query expansion paling berguna?",
          options: [
            { text: "Query ambigu dengan banyak tafsir yang masuk akal", why: "Tepat: 3-5 varian menyerang tiap tafsir; satu arah bisa meleset total.", correct: true },
            { text: "Query sangat panjang dan spesifik", why: "Query spesifik tidak butuh varian — tafsirnya sudah tunggal.", correct: false },
            { text: "Korpus hanya 100 dokumen", why: "Korpus kecil = retrieval mudah; multi-query tidak menambah nilai.", correct: false },
            { text: "Tidak ada budget untuk retrieve tambahan", why: "Multi-query justru butuh N× retrieve — ini kontraindikasi.", correct: false },
          ],
        },
        {
          q: "Evaluator CRAG memberi skor 0,1 (sangat rendah). Aksi apa yang dipicu dan mengapa?",
          options: [
            { text: "Incorrect: buang semua dokumen, ganti dengan web search", why: "Tepat: skor di bawah ambang bawah = korpus statis tidak bisa dipercaya untuk query ini.", correct: true },
            { text: "Correct: langsung teruskan dokumen ke generator", why: "Itu untuk skor tinggi — kebalikannya.", correct: false },
            { text: "Ambiguous: pakai separuh dokumen", why: "Ambiguous untuk skor tengah; 0,1 = jelas Incorrect.", correct: false },
            { text: "Ulangi retrieval dengan query yang sama", why: "CRAG tidak mengulang; ia beralih ke web search sebagai koreksi.", correct: false },
          ],
        },
        {
          q: "Apa tujuan algoritma decompose-then-recompose pada aksi Correct?",
          options: [
            { text: "Memecah dokumen jadi strip pengetahuan, buang yang tidak relevan, susun ulang yang kunci", why: "Tepat: fokus pada informasi kunci, saring redundansi — sesuai paper.", correct: true },
            { text: "Menggabungkan semua dokumen menjadi satu dokumen panjang", why: "Kebalikannya: ia memecah dan menyaring, bukan menggabung mentah.", correct: false },
            { text: "Menerjemahkan dokumen ke bahasa Inggris", why: "Tidak ada hubungannya dengan terjemahan.", correct: false },
            { text: "Mengompres dokumen agar muat di context window", why: "Kompresi adalah efek samping; tujuannya seleksi informasi kunci.", correct: false },
          ],
        },
        {
          q: "Retrieval-mu sudah sehat (recall@5 = 93%) tetapi latensi ketat. Teknik apa yang TEPAT?",
          options: [
            { text: "Tidak satu pun — ukur dulu segmen yang gagal; jangan pasang teknik mahal untuk masalah yang tidak ada", why: "Tepat: CRAG menambah overhead tanpa hasil saat retrieval sehat; multi-query/HyDE hanya bila ada segmen gagal terukur.", correct: true },
            { text: "CRAG penuh untuk semua query", why: "Overhead evaluator + web search tanpa perbaikan = pemborosan.", correct: false },
            { text: "HyDE untuk semua query", why: "Satu panggilan LLM per query × volume tinggi = biaya tanpa kebutuhan.", correct: false },
            { text: "Multi-query 10 varian", why: "10× retrieve untuk retrieval yang sudah 93% = latensi sia-sia.", correct: false },
          ],
        },
      ],
    },
  ],
};
