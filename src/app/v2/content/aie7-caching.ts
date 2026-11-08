import type { V2Lesson } from "../lib/types";

// Batang biaya: tanpa cache Rp1,6 jt vs dengan cache Rp1,068 jt per hari.
const FIG_BIAYA = `<svg viewBox="0 0 480 240" role="img" aria-label="Biaya harian tanpa cache Rp1,6 juta vs dengan cache Rp1,068 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="140" x2="460" y2="140"/><line x1="44" y1="80" x2="460" y2="80"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0</text><text x="38" y="144">0,8 jt</text><text x="38" y="84">1,6 jt</text></g>
<rect x="120" y="20" width="100" height="180" fill="var(--c4)"/>
<rect x="300" y="80.1" width="100" height="119.9" fill="var(--c1)"/>
<g fill="var(--text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="12">Rp1,60 jt</text><text x="350" y="72">Rp1,07 jt</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">tanpa cache</text><text x="350" y="222">exact cache 35%</text></g>
<text x="240" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">10.000 request/hari · hemat 33% = Rp532 ribu/hari</text>
</svg>`;

export const aie7: V2Lesson = {
  slug: "aie7-caching",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE7 — Caching, Batching, Optimasi Biaya",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-tagihan",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tagihan $4.200 dan 60 persen prompt yang itu-itu saja",
      prose: [
        "Startup fintech 'ArusKas' kaget melihat tagihan API: $4.200 per bulan. Audit log menunjukkan 60 persen prompt adalah pertanyaan yang sama berulang-ulang: 'berapa saldo saya', 'cara blokir kartu', 'bunga deposito'. Mereka membayar model mahal untuk menjawab pertanyaan yang jawabannya tidak berubah.",
        "Solusinya berlapis: exact cache untuk prompt identik, semantic cache untuk parafrase ('saldo saya berapa' = 'berapa saldo saya'), dan routing — pertanyaan mudah ke model kecil, sulit ke model besar. Tagihan turun 58 persen, kualitas tidak bergerak. Twist-nya: optimasi terbesar bukan dari model yang lebih pintar, melainkan dari tidak memanggil model sama sekali.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung penghematan exact cache; (2) membangun semantic cache dengan ambang kemiripan; (3) menjelaskan trade-off threshold; (4) merancang routing model (cascade); (5) menghitung total biaya bulanan gabungan.",
        "🗺️ Isi lesson: Langkah 1 · Cerita tagihan — Langkah 2 · Ekonomi token dan exact cache — Langkah 3 · Lab: hemat cache — Langkah 4 · Semantic cache dan routing — Langkah 5 · Lab: semantic cache — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Panggilan termurah adalah yang tidak dilakukan: cache dulu, routing kemudian, model besar terakhir.",
    },
    {
      id: "konsep-cache",
      eyebrow: "Langkah 2 · Exact cache",
      title: "Exact cache: jangan bayar dua kali untuk jawaban yang sama",
      prose: [
        "Exact cache menyimpan pasangan (prompt → jawaban). Prompt identik berikutnya dilayani dari cache tanpa memanggil model. Efektif bila banyak pengulangan: sapaan, FAQ, template laporan. Kuncinya: normalisasi prompt (huruf kecil, spasi rapi) agar 'Berapa saldo saya?' dan 'berapa saldo saya?' memakai kunci yang sama.",
        "Dua syarat keamanan: TTL (time-to-live) untuk data yang bisa berubah — saldo kemarin bukan saldo hari ini; dan isolasi per pengguna — jawaban berisi data pribadi tidak boleh disajikan ke pengguna lain. Cache yang bocor antar-pengguna adalah insiden keamanan, bukan optimasi.",
        "Kepribadian exact cache: ia seperti asisten yang hafal jawaban FAQ — cepat dan murah, tetapi harus tahu kapan jawabannya kedaluwarsa.",
        "Matematika hit rate — kapan cache worth it. 1 juta request/hari, 60 persen berulang (dari cerita tagihan). Tanpa cache: 1 juta × Rp150 = Rp150 juta/hari (angka ilustrasi tarif). Dengan exact cache (hit 60 persen): 400 ribu × Rp150 = Rp60 juta/hari — HEMAT Rp90 juta/hari! Biaya cache (Redis): Rp2 juta/bulan ≈ Rp67 ribu/hari. ROI: 1.300x. Syarat: pola berulang >20 persen. Di bawah itu: overhead > hemat. Ukur pola trafikmu DULU (1 hari log cukup).",
        "Memilih TTL — trade-off basi vs hemat. Data saldo: TTL 60 detik (basi 1 menit = Rp0 risiko? atau Rp50 juta jika trading?). Data FAQ: TTL 24 jam (basi = jawaban lama, risiko kecil). Rumus: TTL optimal ≈ (biaya request × frekuensi) vs (biaya kebasian × probabilitas berubah). Praktis: mulai 5 menit; naikkan jika tidak ada komplain basi; turunkan jika ada. TTL = tombol volume antara hemat dan segar.",
        "Cache invalidation — dua pola. Event-driven: data berubah → hapus cache terkait (tepat, butuh plumbing). TTL: kedaluwarsa otomatis (mudah, bisa basi). Untuk saldo: event-driven (transfer sukses → invalidate!). Untuk FAQ: TTL 24 jam. Kombinasi: TTL pendek (5 menit) + event invalidate untuk yang kritis. “Dua hal tersulit: penamaan, cache invalidation, dan off-by-one” — tangani yang kedua dengan serius.",
      ],
      formula: String.raw`C_{\text{eff}} = (1-h)\,C + h\,c`,
      formulaNote: "C_eff = biaya efektif per request; h = hit rate (proporsi dilayani cache); C = biaya request penuh ke model; c = biaya lookup cache. Contoh lab: h=0,35, C=Rp160, c=Rp8 → C_eff = Rp106,8 — hemat 33 persen.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Cache selalu aman karena hanya menyimpan jawaban.' Salah. Cache jawaban personal tanpa isolasi pengguna = kebocoran data. Cache tanpa TTL untuk data dinamis = jawaban basi yang menyesatkan. Cache butuh kebijakan kedaluwarsa dan isolasi seperti database lainnya.",
      },
      reference: "Normalisasi kunci, TTL untuk data dinamis, isolasi per pengguna. Cache = database jawaban.",
    },
    {
      id: "lab-cache",
      eyebrow: "Langkah 3 · Lab cache",
      title: "Lab: menghitung Rp532 ribu per hari",
      prose: [
        "Skenario: 10.000 request per hari, 35 persen prompt identik berulang. Biaya request penuh Rp160, biaya lookup cache Rp8. Hitung biaya harian tanpa dan dengan cache, lalu persentase penghematannya.",
        "Coba ubah: naikkan HIT menjadi 0,6 (seperti cerita ArusKas), jalankan ulang, dan lihat penghematan melonjak. Hit rate adalah satu-satunya angka yang menentukan apakah cache layak dibangun.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tanpa`, `dengan_cache`, dan `hemat_pct`" },
        { id: "t2", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "tanpa=Rp1,600,000  cache=Rp1,068,000  hemat=33%",
      note: {
        title: "💡 Intuisi",
        body: "Cache adalah satu-satunya optimasi yang memangkas biaya DAN latensi sekaligus — jawaban cache datang dalam milidetik. Kebanyakan optimasi lain menukar satu dengan yang lain; cache memberi keduanya, selama hit rate-nya nyata.",
      },
      hints: [
        "tanpa = REQ*C_REQ",
        "dengan_cache = request tak-ter-cache x C_REQ + request ter-cache x C_HIT",
        "hemat_pct = (tanpa-dengan_cache)/tanpa. Format ribuan: f\"{tanpa:,}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# 10.000 request/hari; 35% prompt identik berulang (exact cache)\n# biaya per request Rp160; cache hit biaya Rp8 (lookup)\nREQ = 10_000\nHIT = 0.35\nC_REQ, C_HIT = 160, 8\n\n# TULIS KODEMU: biaya tanpa vs dengan cache\ntanpa = \ndengan_cache = \nhemat_pct = \n\nprint(f"tanpa=Rp{tanpa:,}  cache=Rp{dengan_cache:,.0f}  hemat={hemat_pct:.0%}")`,
        lockLines: 8,
        solution: `# DATA SEED — jangan ubah\n# 10.000 request/hari; 35% prompt identik berulang (exact cache)\n# biaya per request Rp160; cache hit biaya Rp8 (lookup)\nREQ = 10_000\nHIT = 0.35\nC_REQ, C_HIT = 160, 8\n\n# TULIS KODEMU: biaya tanpa vs dengan cache\ntanpa = REQ*C_REQ\ndengan_cache = (REQ*(1-HIT))*C_REQ + (REQ*HIT)*C_HIT\nhemat_pct = (tanpa-dengan_cache)/tanpa\n\nprint(f"tanpa=Rp{tanpa:,}  cache=Rp{dengan_cache:,.0f}  hemat={hemat_pct:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tanpa", value: 1600000, tol: 1e-9, label: "`tanpa` seharusnya 1600000", msg: "10.000 x 160 = 1.600.000." },
          { kind: "equal", task: "t1", name: "dengan_cache", value: 1068000, tol: 1e-9, label: "`dengan_cache` seharusnya 1068000", msg: "6.500 x 160 + 3.500 x 8 = 1.068.000." },
          { kind: "stdout_matches", task: "t2", pattern: "tanpa=Rp1,600,000\\s+cache=Rp1,068,000\\s+hemat=33%", label: "`print` menampilkan ketiganya", msg: "Format: tanpa=Rp1,600,000  cache=Rp1,068,000  hemat=33%." },
        ],
      },
      reference: "Hit rate menentukan segalanya. Ukur dari log nyata sebelum membangun cache.",
    },
    {
      id: "konsep-semantic",
      eyebrow: "Langkah 4 · Semantic cache dan routing",
      title: "Semantic cache: 'saldo saya berapa' = 'berapa saldo saya'",
      prose: [
        "Exact cache gagal pada parafrase. Semantic cache meng-embed query baru, mencari entri cache dengan cosine similarity tertinggi, dan menyajikan jawabannya bila skor melewati ambang (threshold). 'Saldo saya berapa' (skor 1,0) lolos; 'info suku bunga deposito' vs 'bunga deposito 12 bulan' (skor 0,67) tidak — meski maksudnya mirip, ambang 0,999 menolaknya.",
        "Threshold adalah kenop risiko: terlalu rendah → jawaban salah disajikan (false hit); terlalu tinggi → banyak miss. Routing (cascade) adalah lapisan berikutnya: model kecil menjawab dulu; bila kepercayaan rendah, lempar ke model besar. 70 persen kasus mudah x biaya 1/10 = penghematan struktural.",
        "Kepribadian semantic cache: ia seperti pelayan yang mengenali pelanggan dari wajah, bukan KTP — cepat, tetapi kadang salah orang. Threshold adalah seberapa yakin ia harus sebelum menyapa.",
        "Menala threshold — kurva presisi-recall. Threshold 0,95: presisi 99 persen (hampir tak pernah salah) tetapi recall 30 persen (70 persen parafrase lolos). Threshold 0,85: presisi 92 persen, recall 70 persen. Pilih berdasarkan BIAYA SALAH: salah jawab saldo (fatal!) → 0,95; salah jawab FAQ (ringan) → 0,85. Satu threshold untuk semua = malas. Beda domain, beda threshold — ukur di 200 pasang parafrase domainmu.",
        "Biaya false positive semantic — dihitung. “Berapa saldo saya” ≈ “berapa saldo ANDA” (beda subjek!) — similarity 0,91 > threshold 0,85 → cache HIT → jawab saldo ORANG LAIN = bencana privasi! Satu FP semantik bisa = Rp50 juta denda + reputasi. Untuk data sensitif: threshold 0,97 ATAU nonaktifkan semantic cache (exact saja). Semantic cache = kuat untuk FAQ, BERBAHAYA untuk data personal. Klasifikasikan datamu dulu.",
        "Cache warming — isi sebelum ramai. Prediksi 100 query populer dari log kemarin → isi cache jam 6 pagi. Jam 9 (rush): hit rate 80% dari menit pertama. Tanpa warming: 1 jam pertama = cache dingin = bayar penuh. Persiapan > reaksi.",
      ],
      figure: {
        svg: FIG_BIAYA,
        alt: "Biaya harian tanpa cache Rp1,6 juta vs dengan cache Rp1,068 juta.",
        caption: "Cara membaca: tinggi batang = biaya harian 10.000 request; sumbu Y dalam jutaan rupiah. Interpretasi: exact cache 35 persen memangkas Rp532 ribu per hari (Rp16 juta per bulan) — dari satu teknik sederhana. Bayangkan bila ditumpuk semantic cache dan routing: optimasi biaya LLM hampir selalu soal tumpukan, bukan satu trik.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Semantic cache tinggal pakai, threshold default pasti oke.' Salah. Threshold default adalah tebakan vendor untuk kasus umum. Di lab, 0,999 menolak parafrase yang sebenarnya semaksud — di datamu bisa sebaliknya: false hit yang menyajikan jawaban salah. Kalibrasi threshold di golden set paraphrasemu sendiri.",
      },
      reference: "Semantic cache = embed + threshold. Kalibrasi threshold di data sendiri; tidak ada default universal.",
    },
    {
      id: "lab-semantic",
      eyebrow: "Langkah 5 · Lab semantic",
      title: "Lab: threshold yang menolak parafrase",
      prose: [
        "Tiga jawaban di-cache. Enam query diuji: tiga persis sama, dua parafrase dengan susunan kata identik (skor 1,0), satu parafrase beda kata ('info suku bunga deposito', skor 0,67). Dengan ambang 0,999, berapa yang hit?",
        "Coba ubah: turunkan TH menjadi 0,6, jalankan ulang, dan lihat query terakhir ikut hit — beserta risikonya: jawaban '4,5%' disajikan untuk pertanyaan yang sedikit berbeda. Di sinilah false hit lahir.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hits`: jumlah query yang `semantic_hit`-nya tidak None" },
        { id: "t2", text: "Cetak hasilnya" },
      ],
      expected: "semantic_hit=5/6",
      note: {
        title: "💡 Intuisi",
        body: "Skor kemiripan 0,67 vs ambang 0,999 terlihat seperti 'nyaris' — tetapi 'nyaris mirip' dalam embedding bisa berarti beda maksud sepenuhnya. Jangan baca skor sebagai persentase kebenaran; ia hanya jarak geometris yang perlu dikalibrasi.",
      },
      hints: [
        "hits = sum(1 for q in BANK if semantic_hit(q) is not None)",
        "Fungsi semantic_hit sudah tersedia dan memakai TH.",
        "print(f\"semantic_hit={hits}/6\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport math, hashlib\n\nBANK = [\n    "berapa saldo saya", "saldo saya berapa", "cara blokir kartu hilang",\n    "kartu hilang cara blokir", "bunga deposito 12 bulan", "info suku bunga deposito",\n]\n\ndef vec(teks, dim=24):\n    v = [0.0]*dim\n    for w in teks.lower().split():\n        h = int(hashlib.md5(w.encode()).hexdigest(), 16)\n        v[h % dim] += 1.0\n    return v\n\ndef cos(a, b):\n    dot = sum(x*y for x, y in zip(a, b))\n    na = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(x*x for x in b))\n    return dot/(na*nb)\n\nCACHE = {BANK[0]: "Rp1.234.567", BANK[2]: "hubungi 1500", BANK[4]: "4,5%"}\nTH = 0.999  # ambang kemiripan\n\ndef semantic_hit(q):\n    v = vec(q); best, bs = None, 0\n    for k in CACHE:\n        s = cos(v, vec(k))\n        if s > bs: best, bs = k, s\n    return CACHE[best] if bs >= TH else None\n\n# TULIS KODEMU: hit rate semantic cache\nhits = \n\nprint(f"semantic_hit={hits}/6")`,
        lockLines: 31,
        solution: `# DATA SEED — jangan ubah\nimport math, hashlib\n\nBANK = [\n    "berapa saldo saya", "saldo saya berapa", "cara blokir kartu hilang",\n    "kartu hilang cara blokir", "bunga deposito 12 bulan", "info suku bunga deposito",\n]\n\ndef vec(teks, dim=24):\n    v = [0.0]*dim\n    for w in teks.lower().split():\n        h = int(hashlib.md5(w.encode()).hexdigest(), 16)\n        v[h % dim] += 1.0\n    return v\n\ndef cos(a, b):\n    dot = sum(x*y for x, y in zip(a, b))\n    na = math.sqrt(sum(x*x for x in a)); nb = math.sqrt(sum(x*x for x in b))\n    return dot/(na*nb)\n\nCACHE = {BANK[0]: "Rp1.234.567", BANK[2]: "hubungi 1500", BANK[4]: "4,5%"}\nTH = 0.999  # ambang kemiripan\n\ndef semantic_hit(q):\n    v = vec(q); best, bs = None, 0\n    for k in CACHE:\n        s = cos(v, vec(k))\n        if s > bs: best, bs = k, s\n    return CACHE[best] if bs >= TH else None\n\n# TULIS KODEMU: hit rate semantic cache\nhits = sum(1 for q in BANK if semantic_hit(q) is not None)\n\nprint(f"semantic_hit={hits}/6")`,
        checks: [
          { kind: "equal", task: "t1", name: "hits", value: 5, tol: 1e-9, label: "`hits` seharusnya 5", msg: "Lima query hit (3 persis + 2 parafrase identik kata); 'info suku bunga deposito' (0,67) ditolak ambang." },
          { kind: "stdout_matches", task: "t2", pattern: "semantic_hit=5/6", label: "`print` menampilkan hasil", msg: "Format: semantic_hit=5/6." },
        ],
      },
      reference: "Threshold = kenop risiko. Terlalu rendah = false hit; terlalu tinggi = miss. Kalibrasi di data sendiri.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: teknik hemat untuk tiap pola trafik",
      prose: [
        "Satu, banyak prompt identik (sapaan, FAQ, template) — exact cache; murah, deterministik, risiko rendah. Dua, banyak parafrase pertanyaan sama — semantic cache dengan threshold yang dikalibrasi; awas false hit. Tiga, tugas campuran mudah dan sulit — routing/cascade: model kecil dulu, naik ke besar bila ragu; hemat struktural tanpa mengorbankan kasus sulit.",
        "Empat, volume sangat besar pada tugas sempit — model kecil atau fine-tune khusus; capex sekali, opex murah selamanya. Jangan lupa batching: kumpulkan request non-interaktif dan proses bersamaan untuk throughput.",
        "Aturan praktis 10 detik: ukur pola pengulangan di log dulu. >30 persen berulang → cache. Tugas campur → routing. Volume raksasa + tugas sempit → model kecil.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Optimasi biaya LLM seperti diet: tidak ada satu pil ajaib, yang ada tumpukan kebiasaan kecil. Cache 33 persen + routing 40 persen dari sisanya = total ±60 persen. Tumpuk tekniknya, ukur tiap lapisnya.",
      },
      reference: "Berulang → cache. Campur → routing. Raksasa + sempit → model kecil. Batching untuk non-interaktif.",
    },
    {
      id: "minicase-sejuta",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 1 juta request dan tumpukan 70 persen",
      prose: [
        "ArusKas: 1.000.000 request per bulan x Rp160 = Rp160 juta. Lapis 1 — exact cache 35 persen: hemat 33 persen ≈ Rp53 juta (seperti lab). Lapis 2 — routing pada sisanya: 70 persen kasus mudah ke model kecil (Rp16): 700.000 x Rp16 + 300.000 x Rp160 = Rp11,2 juta + Rp48 juta = Rp59,2 juta untuk 1 juta request — hemat Rp100,8 juta (63 persen) dibanding tanpa apa-apa.",
        "Twist: dua lapis yang masing-masing 'biasa saja' bila ditumpuk memangkas lebih dari 70 persen tagihan — dari Rp160 juta ke di bawah Rp48 juta. Tidak ada satu teknik yang melakukan itu sendirian. Engineer biaya berpikir dalam tumpukan, bukan trik tunggal.",
        "Catatan: routing butuh penilai kepercayaan yang jujur — bila model kecil terlalu percaya diri, kasus sulit lolos tanpa naik ke model besar dan kualitas turun diam-diam. Setiap lapis hemat wajib punya metrik kualitas pendamping.",
        "Tumpukan 70 persen — tiga lapis. Exact cache: 40 persen (invoice identik diulang). Semantic: 20 persen (parafrase “status invoice” × 50 variasi). Prompt compression: 10 persen (system prompt di-cache). Total 70 persen × 1 juta request × Rp150 = hemat Rp105 juta/hari. Urutan implementasi: exact (1 hari) → semantic (3 hari) → compression (1 pekan). Jangan mulai dari yang sulit: exact saja = 40 persen = Rp60 juta/hari. Pareto: 20 persen usaha, 57 persen hasil.",
        "Monitoring hit rate — alarm jika turun. Hit rate 70% → 40% tiba-tiba = pola traffic berubah ATAU bug invalidasi! Alert otomatis. Cache tanpa monitoring = tabungan tanpa cek saldo — bocor diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Routing yang salah menempatkan kasus sulit ke model kecil adalah risiko kualitas yang sunyi: tidak ada error, hanya jawaban yang sedikit lebih buruk di ribuan kasus. Monitor pass rate per lapis routing, bukan hanya tagihan.",
      },
      reference: "Tumpuk: cache → routing → model kecil. Tiap lapis hemat wajib ditemani metrik kualitas.",
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
        "Panggilan termurah = yang tidak dilakukan: exact cache untuk prompt identik, semantic cache untuk parafrase.",
        "C_eff = (1-h)C + hc: hit rate menentukan segalanya; ukur dari log nyata.",
        "Threshold semantic cache adalah kenop risiko: rendah = false hit, tinggi = miss; kalibrasi di data sendiri.",
        "Routing/cascade: model kecil dulu, naik bila ragu — hemat struktural untuk tugas campuran.",
        "Cache butuh TTL dan isolasi pengguna; optimasi biaya berpikir dalam tumpukan, bukan trik tunggal.",
      ],
      next: { label: "AIE8 — Observability untuk Aplikasi LLM", href: "/v2/learn/aie8-observability" },
      quiz: [
        {
          q: "Mengapa semantic cache membutuhkan threshold yang dikalibrasi?",
          options: [
            { text: "Terlalu rendah menyajikan jawaban salah; terlalu tinggi melewatkan penghematan", why: "Tepat: threshold adalah trade-off false hit vs miss — tidak ada default universal.", correct: true },
            { text: "Karena embedding tidak bisa menghitung kemiripan tanpa threshold", why: "Kemiripan bisa dihitung; threshold memutuskan kapan dipakai.", correct: false },
            { text: "Karena regulasi mewajibkan threshold 0,999", why: "Tidak ada regulasi semacam itu.", correct: false },
            { text: "Threshold hanya formalitas, nilai berapapun sama", why: "Lab menunjukkan 0,999 vs 0,6 memberi hasil berbeda total.", correct: false },
          ],
        },
        {
          q: "Bedanya exact cache dan semantic cache?",
          options: [
            { text: "Exact untuk prompt identik persis; semantic untuk parafrase mirip makna", why: "Tepat: exact = kunci string sama; semantic = embedding + ambang kemiripan.", correct: true },
            { text: "Exact lebih mahal daripada semantic", why: "Kebalikannya: exact hanya lookup string, jauh lebih murah.", correct: false },
            { text: "Semantic tidak butuh penyimpanan", why: "Semantic tetap menyimpan pasangan query-vektor dan jawaban.", correct: false },
            { text: "Keduanya sama saja", why: "Mekanisme dan risikonya berbeda.", correct: false },
          ],
        },
        {
          q: "Apa itu model routing (cascade)?",
          options: [
            { text: "Model kecil menjawab dulu; bila ragu, lempar ke model besar", why: "Tepat: kasus mudah murah, kasus sulit tetap berkualitas.", correct: true },
            { text: "Memilih model secara acak tiap request", why: "Acak menghancurkan konsistensi kualitas.", correct: false },
            { text: "Menjalankan semua model lalu memilih jawaban termurah", why: "Itu membayar semua model — kebalikan dari hemat.", correct: false },
            { text: "Mengganti model tiap minggu", why: "Itu rotasi, bukan routing.", correct: false },
          ],
        },
        {
          q: "Kapan cache berbahaya?",
          options: [
            { text: "Data berubah cepat (jawaban basi) atau jawaban personal tanpa isolasi pengguna", why: "Tepat: basi menyesatkan, bocor antar-pengguna adalah insiden keamanan.", correct: true },
            { text: "Ketika hit rate tinggi", why: "Hit rate tinggi justru kabar baik.", correct: false },
            { text: "Ketika prompt selalu identik", why: "Itu kasus ideal exact cache.", correct: false },
            { text: "Tidak pernah — cache selalu aman", why: "Miskonsepsi yang dibahas di langkah 2.", correct: false },
          ],
        },
        {
          q: "Pola trafik seperti apa yang paling diuntungkan exact cache?",
          options: [
            { text: "Banyak pengulangan prompt identik (FAQ, sapaan, template)", why: "Tepat: hit rate tinggi = penghematan besar, seperti lab 35 persen.", correct: true },
            { text: "Setiap prompt unik dan tidak pernah berulang", why: "Hit rate nol = cache tidak berguna.", correct: false },
            { text: "Prompt sangat panjang dan kompleks", why: "Panjang tidak masalah; yang penting pengulangan.", correct: false },
            { text: "Request tengah malam saja", why: "Waktu tidak relevan dengan mekanisme cache.", correct: false },
          ],
        },
      ],
    },
  ],
};
