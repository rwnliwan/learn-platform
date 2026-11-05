import type { V2Lesson } from "../lib/types";

// Skor chatbot di benchmark publik vs benchmark sintetis internal: 94 vs 61.
const FIG_GAP = `<svg viewBox="0 0 520 260" role="img" aria-label="Perbandingan skor benchmark publik vs sintetis.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="150" y="20">benchmark publik</text><text x="370" y="20">benchmark sintetis internal</text></g>
<g font-size="13" font-family="var(--font-ui)" text-anchor="middle">
<rect x="70" y="40" width="160" height="150" fill="var(--c4)" opacity="0.55"/><text x="150" y="115" fill="var(--text)">94%</text>
<rect x="290" y="100" width="160" height="90" fill="var(--c1)"/><text x="370" y="150" fill="var(--text)">61%</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text-muted)">
<text x="150" y="215">terlihat hebat…</text><text x="370" y="215">menyakitkan, tetapi jujur</text>
</g>
<text x="260" y="248" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">kasus ilustratif perusahaan logistik — pola kontaminasi evaluasi</text>
</svg>`;

// Distribusi evolusi soal RAGAS: simple 50%, reasoning 25%, multi_context 25%.
const FIG_EVO = `<svg viewBox="0 0 520 240" role="img" aria-label="Distribusi tipe soal sintetis RAGAS.">
<g font-family="var(--font-ui)" font-size="12">
<rect x="40" y="40" width="250" height="34" fill="var(--c3)"/><text x="46" y="62" fill="var(--text)">simple — 50%</text>
<rect x="40" y="82" width="125" height="34" fill="var(--c4)"/><text x="46" y="104" fill="var(--text)">reasoning — 25%</text>
<rect x="40" y="124" width="125" height="34" fill="var(--c2)"/><text x="46" y="146" fill="var(--text)">multi_context — 25%</text>
</g>
<text x="40" y="190" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">simple: 1 fakta, 1 chunk · reasoning: inferensi multi-langkah</text>
<text x="40" y="208" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">multi_context: jawaban butuh &gt; 1 chunk</text>
<text x="40" y="230" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">distribusi default TestsetGenerator (dokumentasi RAGAS) — sesuaikan dengan risiko produksimu</text>
</svg>`;

export const aie15: V2Lesson = {
  slug: "aie15-synthetic-eval-data",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE15 — Membangun Benchmark: Data Sintetis untuk Evaluasi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-ujian-bocor",
      eyebrow: "Langkah 1 · Cerita",
      title: "Benchmark Buatan Sendiri: data sintetis anti-kontaminasi",
      prose: [
        "Tim ML sebuah perusahaan logistik merayakan: chatbot driver mereka mencetak 94% di benchmark publik — papan atas leaderboard. Dua minggu setelah launch ke 500 driver, helpdesk kebanjiran komplain: bot tidak paham 'surat jalan', 'ritase', 'SJ ganda' — istilah gudang yang dipakai setiap hari. Investigasi menemukan pola pahit: pertanyaan-pertanyaan benchmark publik itu kemungkinan besar pernah 'dilihat' model saat pre-training. Skor 94% = ujian yang bocor.",
        "Mereka berhenti mengejar leaderboard dan membangun ujian sendiri. Generator soal sintetis membaca 2.000 dokumen SOP internal, lalu melahirkan 500 pasangan pertanyaan-jawaban yang TIDAK MUNGKIN ada di data latih model mana pun — karena dokumennya privat. Skor di ujian sendiri: 61%. Menyakitkan — tetapi jujur. Dan dari angka jujur itulah perbaikan nyata dimulai: tiga iterasi kemudian, 78%. Kenaikan 17 poin yang benar-benar berarti, bukan 94% yang menipu.",
        "Twist yang perlu dicamkan: masalahnya bukan 'modelnya jelek', melainkan 'ujiannya bocor'. Tim yang mengoptimasi skor benchmark terkontaminasi sedang mengoptimasi ILUSI. Lesson ini: cara membangun benchmark sendiri yang anti-kontaminasi memakai TestsetGenerator dari RAGAS — dari dokumenmu, menjadi soal + konteks + jawaban benar, lengkap dengan gerbang kualitas agar 'sintetis' tidak berarti 'sampah'.",
        "Bekal kilat (agar lesson ini mandiri): lesson evaluasi LLM membangun golden set — kumpulan soal + jawaban benar buatan manusia — lalu memakai LLM-judge untuk menilai jawaban model. Golden set manusia mahal dan lambat dibuat; lesson ini membuatnya secara sintetis dari dokumenmu sendiri dalam hitungan menit. (Golden tasks untuk evaluasi AGEN dibahas di aai8 — di sini fokus ke evaluasi RAG.)",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan kontaminasi evaluasi dan gejalanya; (2) merancang pipeline TestsetGenerator RAGAS (generator, critic, embeddings); (3) memilih distribusi tipe soal simple/reasoning/multi_context; (4) menerapkan gerbang kualitas dedup + coverage + spot-check; (5) memutuskan kapan memakai benchmark sintetis vs publik.",
        "🗺️ Isi lesson (⏱ 46 mnt · 1 lab · 5 kuis · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · Kontaminasi: si ujian bocor — Langkah 3 · RAGAS TestsetGenerator: si pabrik soal — Langkah 4 · Lab: gerbang kualitas — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case logistik — Checkpoint.",
      ],
      tasks: [],
      reference: "Ujian bocor menghasilkan skor palsu. Bangun ujianmu sendiri dari dokumen privat.",
    },
    {
      id: "konsep-kontaminasi",
      eyebrow: "Langkah 2 · Kontaminasi",
      title: "Kontaminasi evaluasi — si ujian bocor",
      prose: [
        "Kontaminasi evaluasi = irisan antara test set dan data latih model. Jika 30% soal ujian pernah dibaca model saat training, skor bukan lagi mengukur kemampuan — melainkan daya ingat. Rumus di bawah mendefinisikannya secara tajam; masalahnya: data latih model-model besar itu TERTUTUP, sehingga C tidak bisa dihitung langsung. Kita hanya bisa memakai proxy.",
        "Proxy paling praktis: canary string — GUID acak unik yang disisipkan ke dalam dataset benchmark saat dipublikasikan. Jika model bisa mereproduksi canary verbatim saat diminta, dataset itu hampir pasti ada di data latihnya. Ini bukti tidak langsung, tetapi kuat: GUID acak 32 karakter tidak mungkin ditebak.",
        "Gejala kontaminasi di lapangan — hafalkan tiga ini. Pertama, skor benchmark publik tinggi tetapi performa nyata jeblok (kasus logistik: 94% vs keluhan massal). Kedua, skor melonjak tajam antar versi model TANPA perubahan arsitektur yang menjelaskan. Ketiga, model menjawab soal benchmark dengan gaya 'menghafal' — jawaban persis kata-per-kata, tetapi gagal pada parafrase soal yang sama. Tes parafrase adalah detektor murah: kemampuan sejati tahan parafrase, hafalan tidak.",
        "Kepribadian kontaminasi: seperti murid yang mencuri kunci jawaban — nilai ujiannya sempurna, tetapi disuruh mengerjakan soal variasi langsung blank. Menilai murid seperti itu dengan ujian yang sama = menipu diri sendiri. Solusinya bukan murid yang lebih jujur, melainkan ujian yang belum pernah bocor.",
        "Batasan yang jujur: benchmark sintetis dari dokumen privat praktis anti-kontaminasi HARI INI — tetapi jika kamu mempublikasikan soal sintetismu, ia bisa terkontaminasi BESOK (masuk data latih model generasi berikut). Karena itu benchmark internal yang serius: jangan dipublikasikan mentah, beri canary, dan regenerate berkala. Anti-kontaminasi adalah praktik berkelanjutan, bukan sekali jadi.",
        "Cara membaca chart: dua batang = skor model yang sama pada dua ujian berbeda. Interpretasi: selisih 33 poin BUKAN berarti model 'kadang pintar kadang bodoh' — melainkan ujian pertama mengukur daya ingat (terkontaminasi), ujian kedua mengukur kemampuan nyata. Selisih besar = alarm kontaminasi, bukan prestasi.",
      ],
      formula: String.raw`C = \frac{|T \cap D_{train}|}{|T|}`,
      formulaNote: "C = tingkat kontaminasi (0-1); T = test set (kumpulan soal ujian); D_train = data latih model; ∩ = irisan (soal yang muncul di keduanya); |·| = banyaknya anggota. Contoh: 30 dari 100 soal pernah dilihat model → C = 0,30 → skor menggembung. Karena D_train tertutup, C diestimasi via proxy canary string, bukan dihitung langsung.",
      figure: {
        svg: FIG_GAP,
        alt: "Perbandingan skor benchmark publik 94 persen vs benchmark sintetis internal 61 persen.",
        caption: "Ujian bocor vs ujian jujur — selisihnya adalah alarm, bukan prestasi.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Tes parafrase adalah detektor kontaminasi termurah: ambil 20 soal benchmark yang dijawab benar, parafrasekan, uji lagi. Jika skor anjlok lebih dari 15 poin, kemampuan itu kemungkinan hafalan — bukan pemahaman. Lima menit kerja, menghemat berbulan-bulan optimasi ilusi.",
      },
      reference: "C = irisan test set dan data latih. Tidak terukur langsung → pakai canary + tes parafrase.",
    },
    {
      id: "konsep-ragas-generator",
      eyebrow: "Langkah 3 · RAGAS TestsetGenerator",
      title: "Si pabrik soal: Question, Context, Ground Truth",
      prose: [
        "RAGAS — framework evaluasi RAG open-source — menyediakan TestsetGenerator: mesin yang mengubah KOLEKSI DOKUMEN menjadi SAMPEL UJIAN. Tiap sampel punya tiga kolom: Question (pertanyaan), Context (chunk dokumen sumbernya), Ground_Truth (jawaban benar). Alur resminya dari dokumentasi: muat dokumen (misalnya via LangChain DirectoryLoader), bangun generator = TestsetGenerator.from_langchain(generator_llm, critic_llm, embeddings), lalu panggil generate_with_langchain_docs(documents, test_size=10, distributions=...). Hasilnya diekspor ke DataFrame via to_pandas().",
        "Tiga peran, tiga model — pahami pembagian kerjanya. generator_llm (di dokumentasi memakai model murah seperti gpt-3.5-turbo-16k): si penulis soal, bekerja cepat dan murah dalam volume besar. critic_llm (di dokumentasi memakai model kuat seperti gpt-4): si editor galak — menilai dan membuang soal yang jelek, ambigu, atau jawabannya tidak didukung konteks. embeddings: dipakai untuk memilih konteks yang relevan saat merakit soal multi-chunk. Filosofinya: penulis boleh murah, editor harus mahal. Kualitas benchmark ditentukan editor, bukan penulis.",
        "Tiga evolusi soal — tingkat kesulitan yang bisa kamu atur via distributions. simple: pertanyaan langsung dari satu fakta dalam satu chunk ('Berapa lama garansi produk elektronik?'). reasoning: butuh inferensi multi-langkah, menggabungkan fakta ('Produk rusak karena air 10 hari setelah dibeli — refund atau garansi?'). multi_context: jawabannya tersebar di LEBIH DARI satu chunk/dokumen ('Syarat klaim garansi + lama garansi' dari dua dokumen). Distribusi default dokumentasi: simple 50%, reasoning 25%, multi_context 25% — titik awal yang waras, bukan hukum alam.",
        "Kepribadian TestsetGenerator: seperti guru les privat yang disuruh membuat tryout dari buku paket muridnya. Guru murah menulis 500 soal dalam sejam; guru senior (mahal) mencoret 150 yang ambigu; hasilnya tryout yang soalnya 100% dari materi murid — tidak mungkin bocor ke murid sekolah lain. Peran critic inilah yang membedakan 'pabrik soal' dari 'pabrik sampah'.",
        "Gerbang kualitas — empat lapis sebelum soal masuk benchmark. (1) Critic LLM: buang soal ambigu / jawaban tak didukung konteks. (2) Dedup: soal yang terlalu mirip dibuang satu (rumus Jaccard di bawah; ambang umum 0,6). (3) Coverage: pastikan semua dokumen sumber terwakili — benchmark yang hanya menguji 3 dari 2.000 dokumen = buta 99,85%. (4) Spot-check manusia: baca manual 10-20% sampel; jika >10% jelek, perketat critic dan regenerate. 'Sintetis' tanpa gerbang = sampah yang rapi.",
        "Catatan metadata dari dokumentasi: tiap objek Document membawa metadata dictionary — pastikan ada kunci 'filename' untuk mengidentifikasi chunk yang berasal dari dokumen yang sama (misalnya halaman-halaman satu publikasi). Tanpa ini, generator multi_context bisa merakit soal dari chunk yang tidak berhubungan.",
        "Cara membaca chart: tiga batang horizontal = porsi tiap tipe soal pada distribusi default. Interpretasi: separuh soal menguji pemahaman fakta dasar (simple); separuhnya menguji penalaran dan sintesis lintas konteks. Jika produksi-mu didominasi pertanyaan multi-langkah, geser distribusi — default 50/25/25 adalah titik awal, bukan target.",
      ],
      formula: String.raw`\mathrm{dup}(q_i, q_j) = \frac{|W_i \cap W_j|}{|W_i \cup W_j|}`,
      formulaNote: "dup = skor kemiripan dua soal (0-1); q_i, q_j = dua pertanyaan; W = himpunan kata unik tiap pertanyaan; ∩ = kata yang sama di keduanya; ∪ = semua kata unik gabungan. Ini Jaccard similarity. Aturan: dup ≥ 0,6 → buang salah satu. Contoh: 'Berapa lama batas waktu pengajuan refund?' vs 'Berapa lama batas waktu untuk mengajukan refund?' → dup = 0,625 → satu dibuang.",
      figure: {
        svg: FIG_EVO,
        alt: "Distribusi tipe soal RAGAS: simple 50 persen, reasoning 25 persen, multi_context 25 persen.",
        caption: "Tiga evolusi soal — distribusi default dokumentasi RAGAS.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Data sintetis = data palsu, tidak valid untuk evaluasi.' Keliru. Validitas benchmark bukan soal 'keaslian' soal, melainkan dua hal: (a) apakah soal mengukur kemampuan pada distribusi nyata — dijamin karena soal lahir dari dokumen produksimu sendiri; (b) apakah soal belum pernah dilihat model — dijamin karena dokumennya privat. Dengan empat gerbang kualitas, benchmark sintetis LEBIH valid daripada benchmark publik yang terkontaminasi. Tanpa gerbang kualitas, memang — itu namanya sampah, bukan sintetis.",
      },
      reference: "TestsetGenerator: penulis murah + editor mahal + embeddings. Question/Context/Ground_Truth dari dokumenmu.",
    },
    {
      id: "lab-gerbang-kualitas",
      eyebrow: "Langkah 4 · Lab gerbang kualitas",
      title: "Lab: dedup + coverage untuk soal sintetis",
      prose: [
        "Sepuluh soal 'hasil generator' (2 di antaranya duplikat yang disengaja) atas 3 dokumen kebijakan. Tugasmu: implementasikan dua gerbang kualitas — `dedupe` (buang soal dengan Jaccard ≥ 0,6 terhadap soal yang sudah diterima) dan `coverage` (pastikan semua dokumen terwakili). Generator boleh ngawur; gerbang yang menentukan.",
        "Coba eksplorasi: (1) turunkan thr ke 0,4 — berapa soal terbuang? Terlalu agresif? (2) naikkan ke 0,9 — duplikat lolos? (3) hapus satu dokumen dari DOCS lalu lihat coverage turun — benchmark buta terhadap dokumen itu. Ambang 0,6 adalah kompromi, bukan kebenaran mutlak: kalibrasi dengan spot-check manusia.",
        "Cara membaca output: `generated` vs `accepted` = hasil kerja editor; `dropped_dupes` = sampah yang dicegat; `coverage` = peta buta benchmark; `per_tipe` = distribusi kesulitan akhir. Interpretasi: benchmark yang baik BUKAN yang soalnya paling banyak, melainkan yang lolos gerbang paling ketat — 8 soal bersih mengalahkan 10 soal berduplikat.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `dedupe(qs, thr)`: pertahankan soal pertama, buang yang Jaccard-nya ≥ thr terhadap yang sudah dipertahankan" },
        { id: "t2", text: "Implementasikan `coverage(kept, docs)`: kembalikan (dokumen_terpakai, total_dokumen)" },
      ],
      expected: "accepted: 8, dropped_dupes: 2, coverage: 3/3",
      note: {
        title: "💡 Intuisi",
        body: "Simpan seed generator + versi dokumen sumber untuk setiap batch soal. Benchmark harus reproducible: dokumen SOP berubah → regenerate batch baru, jangan campur soal lama dan baru dalam satu skor. Skor benchmark = fungsi dari (soal, dokumen) — ubah salah satunya diam-diam dan tren skormu jadi dongeng.",
      },
      hints: [
        "dedupe: for q in qs: if all(jaccard(q[0], k[0]) < thr for k in kept): kept.append(q)",
        "coverage: used = {d for q in kept for d in q[2]}; kembalikan (len(used), len(docs))",
        "q[0] = teks soal, q[1] = tipe, q[2] = daftar doc_ids",
      ],
      code: {
        starter: `# SEED — jangan ubah
import re
DOCS = ["refund", "garansi", "kirim"]

# (soal, tipe, doc_ids, ground_truth) — 10 soal, 2 duplikat disengaja
QUESTIONS = [
    ("Berapa lama batas waktu pengajuan refund?", "simple", ["refund"], "30 hari"),
    ("Berapa lama batas waktu untuk mengajukan refund?", "simple", ["refund"], "30 hari"),
    ("Berapa lama garansi produk elektronik?", "simple", ["garansi"], "2 tahun"),
    ("Apakah garansi mencakup kerusakan akibat air?", "simple", ["garansi"], "tidak"),
    ("Berapa estimasi waktu tiba pengiriman?", "simple", ["kirim"], "2-4 hari kerja"),
    ("Berapa estimasi waktu tiba paket?", "simple", ["kirim"], "2-4 hari kerja"),
    ("Produk elektronik rusak karena air 10 hari setelah dibeli: refund atau garansi?", "reasoning", ["refund", "garansi"], "refund masih bisa (30 hari); garansi tidak mencakup air"),
    ("Paket telat 9 hari: apa hak pelanggan?", "reasoning", ["kirim"], "voucher Rp50 ribu"),
    ("Beli elektronik Rp500 ribu: syarat klaim garansi dan lama garansinya?", "multi_context", ["garansi", "kirim"], "nota pembelian; garansi 2 tahun"),
    ("Minta refund pembelian Rp150 ribu: apakah dapat gratis ongkir berikutnya?", "multi_context", ["refund", "kirim"], "refund 30 hari; gratis ongkir hanya di atas Rp200 ribu"),
]

def tok(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))

def jaccard(a, b):
    ta, tb = tok(a), tok(b)
    return len(ta & tb) / len(ta | tb)

# TULIS KODEMU (di bawah garis ini)
def dedupe(qs, thr=0.6):
    # TODO t1: pertahankan yang pertama; buang yang mirip (jaccard >= thr)
    return list(qs)

def coverage(kept, docs):
    # TODO t2: dokumen unik yang dipakai soal-soal kept
    return 0, len(docs)

# UJI (jangan ubah)
kept = dedupe(QUESTIONS)
cov, total = coverage(kept, DOCS)
types = {}
for q in kept:
    types[q[1]] = types.get(q[1], 0) + 1
print("generated:", len(QUESTIONS))
print("accepted:", len(kept), "| dropped_dupes:", len(QUESTIONS) - len(kept))
print("coverage:", f"{cov}/{total}", "dokumen")
print("per_tipe:", types)`,
        lockLines: 25,
        solution: `# SEED — jangan ubah
import re
DOCS = ["refund", "garansi", "kirim"]

# (soal, tipe, doc_ids, ground_truth) — 10 soal, 2 duplikat disengaja
QUESTIONS = [
    ("Berapa lama batas waktu pengajuan refund?", "simple", ["refund"], "30 hari"),
    ("Berapa lama batas waktu untuk mengajukan refund?", "simple", ["refund"], "30 hari"),
    ("Berapa lama garansi produk elektronik?", "simple", ["garansi"], "2 tahun"),
    ("Apakah garansi mencakup kerusakan akibat air?", "simple", ["garansi"], "tidak"),
    ("Berapa estimasi waktu tiba pengiriman?", "simple", ["kirim"], "2-4 hari kerja"),
    ("Berapa estimasi waktu tiba paket?", "simple", ["kirim"], "2-4 hari kerja"),
    ("Produk elektronik rusak karena air 10 hari setelah dibeli: refund atau garansi?", "reasoning", ["refund", "garansi"], "refund masih bisa (30 hari); garansi tidak mencakup air"),
    ("Paket telat 9 hari: apa hak pelanggan?", "reasoning", ["kirim"], "voucher Rp50 ribu"),
    ("Beli elektronik Rp500 ribu: syarat klaim garansi dan lama garansinya?", "multi_context", ["garansi", "kirim"], "nota pembelian; garansi 2 tahun"),
    ("Minta refund pembelian Rp150 ribu: apakah dapat gratis ongkir berikutnya?", "multi_context", ["refund", "kirim"], "refund 30 hari; gratis ongkir hanya di atas Rp200 ribu"),
]

def tok(s):
    return set(re.findall(r"[a-z0-9]+", s.lower()))

def jaccard(a, b):
    ta, tb = tok(a), tok(b)
    return len(ta & tb) / len(ta | tb)

# TULIS KODEMU (di bawah garis ini)
def dedupe(qs, thr=0.6):
    kept = []
    for q in qs:
        if all(jaccard(q[0], k[0]) < thr for k in kept):
            kept.append(q)
    return kept

def coverage(kept, docs):
    used = {d for q in kept for d in q[2]}
    return len(used), len(docs)

# UJI (jangan ubah)
kept = dedupe(QUESTIONS)
cov, total = coverage(kept, DOCS)
types = {}
for q in kept:
    types[q[1]] = types.get(q[1], 0) + 1
print("generated:", len(QUESTIONS))
print("accepted:", len(kept), "| dropped_dupes:", len(QUESTIONS) - len(kept))
print("coverage:", f"{cov}/{total}", "dokumen")
print("per_tipe:", types)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "accepted: 8 \\| dropped_dupes: 2", label: "Dedup membuang tepat 2 duplikat", msg: "Soal #2 dan #6 mirip ≥ 0,6 dengan #1 dan #5." },
          { kind: "stdout_matches", task: "t2", pattern: "coverage: 3/3 dokumen", label: "Coverage 3/3 dokumen", msg: "Tidak ada dokumen yang buta." },
          { kind: "stdout_matches", task: "t1", pattern: "per_tipe: \\{'simple': 4, 'reasoning': 2, 'multi_context': 2\\}", label: "Distribusi tipe terjaga", msg: "4-2-2: pola 50/25/25." },
        ],
      },
      reference: "Generator boleh ngawur; gerbang kualitas yang menentukan.",
    },
    {
      id: "jebakan-eval-sintetis",
      eyebrow: "Langkah 5 · Kapan eval sintetis menipu",
      title: "Empat cara benchmark sintetis berbohong (dan pertahanannya)",
      prose: [
        "Benchmark sintetis punya musuh yang tidak terlihat: ia dinilai oleh proses yang lahir dari rahim yang sama. Generator menulis soal, critic dari keluarga model yang sama menilai soal — lalu model sekeluarga diuji di atasnya. Ini seperti murid membuat soal ujian sendiri, lalu kakak kelasnya yang memeriksa. Skornya tinggi, maknanya rendah. Empat jebakan di bawah adalah cara benchmark sintetis berbohong dengan wajah jujur.",
        "Jebakan 1 — bias keluarga model. Model cenderung menyukai gaya bahasanya sendiri: frasa, struktur, bahkan 'aksen' penalaran yang khas satu keluarga. Jika generator dan model yang dievaluasi sama-sama dari satu keluarga, skor menggembung 5–15 poin bukan karena kemampuan, melainkan resonansi gaya. Pertahanan: generator, critic, dan model-uji dari keluarga BERBEDA; atau lebih murah — spot-check manusia buta (penilai tidak tahu soal itu sintetis atau tulisan manusia).",
        "Jebakan 2 — kalibrasi kesulitan. Generator menulis soal yang IA SENDIRI bisa jawab — seleksi alamiah menuju soal yang terlalu mudah. Gejala: semua model mencetak di atas 90%, benchmark 'jenuh' dan berhenti membedakan yang bagus dari yang hebat. Pertahanan: kalibrasi terhadap sampel soal tulisan manusia; targetkan 'sabuk diskriminatif' — model terbaik mencetak 60–80%, bukan 95%. Benchmark yang semua lulus = ujian yang gagal.",
        "Jebakan 3 — ilusi cakupan. 500 soal dari 2.000 dokumen terdengar merata — sampai kamu cluster embedding soal dan menemukan 80% soal lahir dari 10% dokumen (yang paling 'mudah ditanya'). 90% korpus tidak teruji sama sekali. Pertahanan: ukur cakupan di ruang embedding (tiap cluster dokumen wajib punya kuota soal), bukan hitungan soal mentah. Kualitas = coverage × agreement × (1 − kontaminasi) — rumus di bawah.",
        "Jebakan 4 — kesenjangan distribusi. Soal sintetis itu 'terlalu sopan': gramatikal, lengkap, jelas. Pengguna nyata menulis 'sj ganda??' — tiga kata, typo, tanpa konteks. Model yang 90% di benchmark sopan bisa 60% di traffic kasar. Pertahanan: ambil sampel query log nyata, ukur distribusinya (panjang, typo rate, bahasa campur), lalu suntikkan noise yang sama ke generator — atau campur 20% query nyata yang dilabeli manusia.",
        "Senjata ukur: kesepakatan manusia. Minta dua analis menilai 100 soal yang sama (bagus/jelek), hitung Cohen's kappa: κ ≥ 0,6 = kesepakatan substansial (critic boleh dipercaya), κ < 0,4 = penilai asal-asalan (perbaiki rubrik dulu). Tanpa angka ini, 'critic menyetujui 82%' tidak berarti apa-apa — 82% dari penilai yang tidak sepakat dengan manusia = 82% sampah yang lolos.",
        "Canary string — recap dua kalimat: selipkan GUID acak unik ke benchmark saat dipublikasikan; bila model bisa mereproduksinya verbatim, dataset itu ada di data latihnya. Untuk data internal yang tidak dipublikasikan, padanannya adalah temporal cutoff: pastikan dokumen sumber benchmark DIBUAT SETELAH tanggal cutoff training model yang diuji. Dokumen yang lebih tua dari cutoff = berpotensi sudah dilihat model.",
        "Kapan eval sintetis MENIPU secara sistematis? Tiga pola: (1) skor naik tiap regenerasi padahal model sama — generator makin 'ramah' (drift generator); kunci seed + versioning soal; (2) ranking model di benchmark sintetis tidak sama dengan ranking di evaluasi manusia atas traffic nyata — divergensi ini wajib diukur berkala (korelasi peringkat Spearman); (3) satu keluarga model selalu menang — kembali ke jebakan 1.",
        "Aturan senior: eval sintetis adalah PELENGKAP, bukan pengganti, evaluasi manusia di atas traffic nyata. Alur yang benar: benchmark sintetis untuk regresi harian (cepat, murah, otomatis) + evaluasi manusia 50–100 query nyata per rilis (lambat, mahal, jujur). Tim yang hanya punya yang pertama sedang mengendarai mobil dengan spion yang digambar — terlihat aman sampai tikungan pertama.",
        "Rotasi benchmark — eval overfitting versi evaluasi. Model yang dievaluasi BERULANG di benchmark yang sama lambat laun 'belajar' soalnya (lewat tuning prompt, pemilihan checkpoint, bahkan arsitektur). Gejala: skor naik stabil tiap kuartal padahal kualitas nyata stagnan. Praktik: simpan 20% soal sebagai holdout yang TIDAK PERNAH dipakai tuning, dan regenerasi/rotasi soal tiap kuartal. Benchmark yang tidak pernah berubah = target yang bisa dihafal.",
        "Kapan eval sintetis TIDAK worth it? Dua kondisi: dokumen sumber di bawah 50 — terlalu sedikit untuk generalisasi, soal-soalnya mengulang pola yang sama; dan domain sangat dinamis (harga, regulasi berubah mingguan) — biaya regenerasi melampaui evaluasi manusia atas 50 query nyata. Aturan: jika setup generator + gerbang kualitas memakan waktu lebih dari 2 hari untuk kebutuhan kurang dari 200 soal, evaluasi manusia sampel kecil lebih murah dan lebih jujur.",
        "Adversarial filtering — teknik AFLite. Buang soal yang bisa dijawab model SEDERHANA tanpa membaca konteks: jika TF-IDF + logistic regression bisa menjawab dengan benar, soal itu bocor (jawabannya ada di pilihan ganda, atau polanya trivial). Soal yang tersisa = yang benar-benar butuh pemahaman dokumen. Filter ini murah (CPU saja) dan menaikkan daya diskriminatif benchmark 10–20 poin tanpa satu pun label manusia tambahan.",
      ],
      formula: String.raw`Q = \text{coverage} \times \text{agreement} \times (1 - C)`,
      formulaNote: "Q = kualitas efektif benchmark (0–1); coverage = proporsi cluster dokumen yang terwakili soal (0–1); agreement = kesepakatan critic vs manusia (mis. Cohen's kappa ternormalisasi); C = tingkat kontaminasi (0–1). Perkalian = satu nol membunuh semua: coverage 1,0 tetapi agreement 0 → Q = 0. Contoh: 0,9 × 0,7 × (1−0,1) = 0,57.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Soal yang lolos critic pasti bagus.' Critic dan generator dari keluarga yang sama itu seperti kakak menilai adik — bias resonansi gaya membuat keduanya saling memuji. Validasi butuh keluarga model BERBEDA atau manusia buta. Critic satu keluarga = satu suara, bukan dua.",
      },
      reference: "Empat jebakan: bias keluarga, kesulitan tak terkalibrasi, ilusi cakupan, kesenjangan distribusi. Pertahanan: keluarga berbeda, kalibrasi manusia, kuota cluster, noise realistis, kappa ≥ 0,6.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: bangun sendiri atau pakai publik?",
      prose: [
        "Skenario 1 — evaluasi RAG di atas dokumen internal/privat (SOP, kebijakan, data pelanggan) → BANGUN SINTETIS. Benchmark publik tidak mengukur domainmu dan rawan kontaminasi; dokumen privat = anti-kontaminasi gratis.",
        "Skenario 2 — membandingkan model untuk kemampuan umum (reasoning, coding, pengetahuan umum) → benchmark publik masih OK. Tujuannya perbandingan relatif antar model, bukan pengukuran absolut kemampuan domain.",
        "Skenario 3 — budget kecil, butuh cepat → test_size 50-100 soal + spot-check manusia 20%. Benchmark kecil yang bersih mengalahkan benchmark besar yang kotor — selalu.",
        "Skenario 4 — produksi didominasi pertanyaan multi-langkah (analisis, investigasi) → geser distributions: naikkan reasoning/multi_context dari default 25% ke 40%. Default 50/25/25 untuk traffic campuran.",
        "Skenario 5 — dokumen sumber sering berubah (kebijakan tiap kuartal) → versioning: simpan (seed, versi dokumen, tanggal) tiap batch; regenerate terjadwal tiap rilis dokumen. Jangan campur soal lama + dokumen baru.",
        "Aturan praktis 10 detik: (1) dokumen privat? sintetis. (2) bandingkan model umum? publik. (3) atur distributions ikut traffic nyata. (4) dedup + coverage + spot-check = wajib. (5) dokumen berubah → regenerate.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Semakin banyak soal sintetis semakin baik.' Salah — diversity mengalahkan volume. 500 soal yang 300 di antaranya duplikat = 200 soal efektif + skor yang menggembung + budget critic terbuang. Ukur dedup rate dan coverage; tambah soal HANYA bila menambah cakupan dokumen atau tipe yang belum terwakili. Benchmark = instrumen ukur, bukan koleksi.",
      },
    },
    {
      id: "minicase-logistik",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 2.000 SOP, 500 soal, 61% yang jujur",
      prose: [
        "Situasi: perusahaan logistik, 2.000 dokumen SOP gudang, chatbot driver. Skor benchmark publik: 94% — tetapi komplain membuktikan angka itu ilusi. Keputusan: bangun benchmark sintetis internal.",
        "Eksekusi (angka biaya ilustratif): generate 500 soal via TestsetGenerator — generator_llm murah 500 × Rp200 = Rp100 ribu; critic_llm kuat 500 × Rp800 = Rp400 ribu; total Rp500 ribu + 3 jam setup. Gerbang kualitas: critic membuang 90 soal (18%), dedup membuang 35 (7%), coverage 1.940/2.000 dokumen (97%), spot-check manusia 50 soal (2,5 jam analis) menemukan 4 jelek (8%) → perketat critic, regenerate 40 soal. Benchmark final: 375 soal bersih.",
        "Hasil: skor di benchmark sendiri = 61%. Tiga iterasi perbaikan retrieval (chunking → hybrid → rerank): 61% → 68% → 73% → 78%. Setiap kenaikan TERUKUR terhadap ujian yang sama dan jujur. Bandingkan: jika mereka terus mengoptimasi angka 94% yang terkontaminasi, ketiga iterasi itu tidak akan pernah terjadi — tidak ada masalah yang terlihat, tidak ada yang diperbaiki.",
        "Pembahasan: biaya total di bawah Rp1 juta + 6 jam kerja untuk instrumen ukur yang mengubah arah tim. Pelajaran untuk manajemen: benchmark bukan 'nilai rapor', melainkan 'termometer'. Termometer yang menunjukkan 36,5° saat pasien demam = alat rusak. 61% yang jujur menyelamatkan; 94% yang palsu menenggelamkan.",
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
        "Kontaminasi = irisan test set dan data latih; gejalanya skor publik tinggi tetapi performa nyata jeblok — deteksi murah via tes parafrase.",
        "TestsetGenerator RAGAS: generator_llm murah menulis soal, critic_llm kuat menyaring, embeddings merakit konteks — output Question/Context/Ground_Truth.",
        "Tiga evolusi soal: simple (1 fakta), reasoning (multi-langkah), multi_context (>1 chunk); default 50/25/25, sesuaikan dengan traffic nyata.",
        "Empat gerbang kualitas: critic, dedup Jaccard ≥ 0,6, coverage dokumen, spot-check manusia 10-20%.",
        "Dokumen privat = anti-kontaminasi; dokumen berubah → versioning + regenerate; benchmark yang dipublikasikan bisa terkontaminasi besok.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Chatbot skor 94% di benchmark publik tetapi gagal total di lapangan. Diagnosis paling mungkin?",
          options: [
            { text: "Kontaminasi evaluasi — soal benchmark kemungkinan ada di data latih model", why: "Tepat: pola klasik — skor tinggi, performa nyata jeblok = ujian bocor.", correct: true },
            { text: "Modelnya terlalu kecil", why: "Ukuran bukan penjelas selisih 94% vs gagal total.", correct: false },
            { text: "Benchmark publiknya terlalu sulit", why: "Terlalu sulit justru menekan skor, bukan menggembungkan.", correct: false },
            { text: "Pengguna salah memakai chatbot", why: "500 driver gagal serempak bukan salah pengguna.", correct: false },
          ],
        },
        {
          q: "Apa peran critic_llm dalam TestsetGenerator RAGAS?",
          options: [
            { text: "Menyaring dan membuang soal yang jelek, ambigu, atau tak didukung konteks", why: "Tepat: penulis boleh murah, editor harus mahal — kualitas ditentukan critic.", correct: true },
            { text: "Menulis soal dalam volume besar", why: "Itu peran generator_llm yang murah.", correct: false },
            { text: "Memilih embedding untuk retrieval", why: "Embeddings adalah komponen terpisah untuk perakitan konteks.", correct: false },
            { text: "Menilai jawaban model saat evaluasi", why: "Itu peran LLM-judge di tahap evaluasi, bukan di pembuatan soal.", correct: false },
          ],
        },
        {
          q: "Kapan tipe soal multi_context WAJIB dipakai?",
          options: [
            { text: "Ketika jawaban benar tersebar di lebih dari satu chunk/dokumen", why: "Tepat: definisi multi_context — menguji sintesis lintas konteks.", correct: true },
            { text: "Ketika dokumennya sangat panjang", why: "Panjang dokumen bukan kriteria — yang penting sebaran jawaban.", correct: false },
            { text: "Ketika butuh banyak soal cepat", why: "Itu alasan memakai simple, bukan multi_context.", correct: false },
            { text: "Selalu — semua soal harus multi_context", why: "Campuran 50/25/25 menguji spektrum kemampuan; semua sulit = buta pada dasar.", correct: false },
          ],
        },
        {
          q: "Mengapa dedup soal penting dalam benchmark sintetis?",
          options: [
            { text: "Soal duplikat menggembungkan skor dan membuang budget critic", why: "Tepat: mengukur hal yang sama berulang = presisi palsu + biaya sia-sia.", correct: true },
            { text: "Duplikat membuat file benchmark terlalu besar", why: "Ukuran file bukan masalahnya — validitas skor yang jadi korban.", correct: false },
            { text: "Model tidak bisa menjawab soal duplikat", why: "Model justru mudah menjawab duplikat — itulah masalahnya.", correct: false },
            { text: "Dedup diwajibkan lisensi RAGAS", why: "Tidak ada kewajiban lisensi; ini praktik kualitas.", correct: false },
          ],
        },
        {
          q: "Dokumen SOP diperbarui besar-besaran tiap kuartal. Praktik benchmark yang benar?",
          options: [
            { text: "Versioning tiap batch (seed + versi dokumen) dan regenerate terjadwal tiap rilis", why: "Tepat: skor = fungsi (soal, dokumen); campur versi = tren skor jadi dongeng.", correct: true },
            { text: "Tetap pakai benchmark lama agar tren skor mulus", why: "Tren mulus dari ujian kedaluwarsa = menipu diri sendiri.", correct: false },
            { text: "Tambahkan soal baru ke benchmark lama tanpa versioning", why: "Campur versi menghancurkan komparabilitas antar periode.", correct: false },
            { text: "Berhenti memakai benchmark sintetis", why: "Justru saat dokumen berubah benchmark segar paling dibutuhkan.", correct: false },
          ],
        },
        {
          q: "Generator dan critic dari keluarga model yang sama; model yang diuji pun sekeluarga. Risiko terbesar?",
          options: [
            { text: "Self-preference bias — skor menggembung karena resonansi gaya bahasa, bukan kemampuan", why: "Tepat: model menyukai 'aksen' keluarganya sendiri; 5–15 poin bisa jadi ilusi.", correct: true },
            { text: "Biaya generate membengkak", why: "Biaya tidak terkait keluarga model — ini soal validitas skor.", correct: false },
            { text: "Soal menjadi terlalu sulit", why: "Biasnya ke arah MENGGEMBUNGKAN skor, bukan menyulitkan.", correct: false },
            { text: "Tidak ada risiko selama critic ketat", why: "Critic sekeluarga = penilai yang biasnya sama dengan penulis soal.", correct: false },
          ],
        },
        {
          q: "Semua model mencetak di atas 95% di benchmark sintetismu. Tindakan senior?",
          options: [
            { text: "Kalibrasi ulang kesulitan — benchmark jenuh tidak lagi membedakan model", why: "Tepat: targetkan sabuk diskriminatif 60–80%; ujian yang semua lulus = ujian yang gagal.", correct: true },
            { text: "Rayakan — model sudah sempurna", why: "95% di ujian yang terlalu mudah = tidak ada informasi.", correct: false },
            { text: "Tambah 1.000 soal lagi dengan generator sama", why: "Soal lebih banyak dari generator yang sama = kesulitan yang sama.", correct: false },
            { text: "Ganti ke benchmark publik", why: "Benchmark publik rawan kontaminasi — masalah yang ingin dihindari sejak awal.", correct: false },
          ],
        },
      ],
    },
  ],
};
