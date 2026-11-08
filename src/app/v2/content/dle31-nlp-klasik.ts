import type { V2Lesson } from "../lib/types";

export const dle31: V2Lesson = {
  slug: "dle31-nlp-klasik",
  track: "Deep Learning Engineer",
  module: "NLP",
  title: "DLE31 — NLP Klasik: Viterbi, Word2Vec & POS Tagging",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu kata 'bisa' yang membingungkan model modern",
      prose: [
        "Tim NLP KirimCepat membangun chatbot dengan transformer — tetapi untuk satu tugas sempit, model klasik 30 tahun lebih tua menang: menandai kelas kata (POS tagging) pada kalimat pendek Bahasa Indonesia. Alasannya: transformer butuh data besar; hidden Markov model dengan algoritma Viterbi hanya butuh tabel probabilitas kecil — dan hasilnya bisa dijelaskan: 'kata ini ditandai verba karena probabilitas transisinya 0,6, bukan 0,4'.",
        "NLP klasik bukan museum — ia fondasi. Word2Vec mengajarkan bahwa makna bisa diukur sebagai jarak vektor; Viterbi mengajarkan bahwa urutan terbaik dicari dengan pemrograman dinamis, bukan tebakan; POS tagging mengajarkan bahwa struktur kalimat adalah informasi. Setiap engineer NLP yang hanya kenal transformer akan kebingungan saat datanya kecil, latensinya ketat, atau hasilnya harus dijelaskan.",
        "Setelah lesson ini kamu bisa: (1) menjalankan Viterbi untuk POS tagging dan menghitung probabilitas jalur terbaik; (2) menghitung cosine similarity antar kata; (3) menjelaskan mengapa embedding statis gagal pada polisemi; (4) membedakan HMM, CRF, dan pendekatan neural; (5) memutuskan kapan klasik cukup dan kapan transformer diperlukan.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "DLE19 (NLP) menyinggung word2vec hanya sebagai kontras — 'embedding statis gagal' — tanpa menghitungnya, dan tidak ada Viterbi atau POS tagging di track (0 hit). Lesson ini membangun NLP klasik sebagai sistem: HMM + Viterbi dengan angka yang dihitung penuh, Word2Vec dengan cosine similarity, dan peta kapan klasik menang atas neural.",
      },
      reference: "Viterbi terbaik N-V-N, probabilitas 0,0350. Cosine raja-ratu 0,9928; raja-mobil 0,2195.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca dan menghitung fondasi NLP — bukan hanya memanggil library.",
        "(1) Menjalankan algoritma Viterbi pada kalimat 3 kata;",
        "(2) Menghitung probabilitas jalur tag terbaik;",
        "(3) Menghitung cosine similarity antar vektor kata;",
        "(4) Menjelaskan analogi vektor (raja - pria + wanita = ratu);",
        "(5) Memilih antara HMM, CRF, dan transformer per kasus.",
      ],
      tasks: [],
    },
    {
      id: "viterbi",
      eyebrow: "Langkah 3 · Teori",
      title: "Viterbi: jalur tag terbaik dicari, bukan ditebak",
      prose: [
        "POS tagging dengan HMM: tiap kata punya tag tersembunyi (nomina, verba, ...), dan kita mencari urutan tag dengan probabilitas tertinggi. Probabilitas satu jalur = probabilitas awal tag pertama x emisi kata pertama x transisi x emisi kata kedua x transisi x emisi kata ketiga. Viterbi menghitung ini dengan pemrograman dinamis: di tiap posisi, simpan probabilitas terbaik untuk tiap tag — 2 tag x 3 kata = 6 sel, bukan 2^3 = 8 jalur yang dihitung satu per satu.",
        "Contoh kalimat 'saya makan nasi', tag N (nomina) dan V (verba). Probabilitas awal: N 0,7, V 0,3. Transisi: N ke N 0,4, N ke V 0,6, V ke N 0,7, V ke V 0,3. Emisi — tiap baris HARUS berjumlah 1, karena tiap tag mendistribusikan probabilitasnya ke seluruh kosakata: 'saya' sebagai N 0,7 / V 0,05; 'makan' sebagai N 0,1 / V 0,85; 'nasi' sebagai N 0,2 / V 0,1. Cek: baris N 0,7 + 0,1 + 0,2 = 1,0; baris V 0,05 + 0,85 + 0,1 = 1,0. Tabel emisi yang barisnya tidak berjumlah 1 bukan distribusi probabilitas — dan angka apa pun yang dihitung darinya tidak berarti.",
        "Tabel Viterbi (delta = probabilitas jalur terbaik sampai posisi itu, 2 tag x 3 kata = 6 sel): posisi 'saya': N 0,49 (0,7 x 0,7), V 0,015 (0,3 x 0,05). Posisi 'makan': N 0,0196 (terbaik dari N: 0,49 x 0,4 x 0,1), V 0,2499 (terbaik dari N: 0,49 x 0,6 x 0,85). Posisi 'nasi': N 0,0350 (terbaik dari V: 0,2499 x 0,7 x 0,2), V 0,0075 (terbaik dari V: 0,2499 x 0,3 x 0,1). Backtracking dari tag terbaik di posisi terakhir: 'nasi' sebagai N datang dari V di 'makan'; 'makan' sebagai V datang dari N di 'saya'; 'saya' sebagai N adalah awal. Telusuri mundur: N-V-N — jalur terbaik 0,0350. Jalur N-N-N hanya 0,0016 (0,7 x 0,7 x 0,4 x 0,1 x 0,4 x 0,2) — 22x lebih kecil, karena 'makan' hampir tidak pernah nomina. Viterbi menemukan 0,0350 tanpa menghitung semua jalur secara naif: 6 sel delta + backpointer, bukan enumerasi 8 jalur.",
        "Kelemahan HMM: asumsi Markov (tag hanya bergantung pada tag sebelumnya) dan emisi hanya bergantung pada kata saat itu — konteks panjang hilang. CRF (conditional random field) memperbaikinya dengan fitur arbitrer (kata sebelumnya, akhiran, kapitalisasi) tanpa asumsi independensi yang kaku. Aturan: data kecil + butuh penjelasan = HMM/Viterbi; butuh fitur kaya + tetap terstruktur = CRF; data besar + konteks panjang = transformer.",
      ],
      tasks: [],
      formula: "\\delta_t(j) = \\max_i \\left[ \\delta_{t-1}(i) \\cdot a_{ij} \\right] \\cdot b_j(w_t)",
      formulaNote: "delta = probabilitas jalur terbaik sampai posisi t dengan tag j; a = transisi; b = emisi kata w_t sebagai tag j.",
      note: {
        title: "Viterbi di luar NLP",
        body: "Algoritma yang sama dipakai di mana-mana: dekoding sinyal komunikasi, pengenalan suara (DLE29), dan bioinformatika (penyelarasan sekuens). Sekali kamu memahami pemrograman dinamis Viterbi, kamu membawanya ke tiga domain. Itulah nilai belajar klasik: algoritmanya abadi, aplikasinya berganti.",
      },
      reference: "Jalur terbaik N-V-N = 0,0350 (delta: saya N 0,49/V 0,015; makan N 0,0196/V 0,2499; nasi N 0,0350/V 0,0075; backpointer N-V-N).",
    },
    {
      id: "word2vec",
      eyebrow: "Langkah 4 · Teori",
      title: "Word2Vec: makna sebagai jarak vektor",
      prose: [
        "Word2Vec (2013) mengubah kata menjadi vektor dari konteksnya: kata yang muncul di konteks serupa mendapat vektor serupa. Kesamaan diukur cosine similarity: cos = (a . b) / (|a| |b|). Contoh 2 dimensi: raja = [0,9; 0,1], ratu = [0,85; 0,2]. Dot product = 0,9 x 0,85 + 0,1 x 0,2 = 0,785. Norma raja = 0,9055, norma ratu = 0,8732. Cosine = 0,785 / (0,9055 x 0,8732) = 0,9928 — hampir 1, sangat mirip. Bandingkan raja vs mobil [0,1; 0,9]: dot = 0,09 + 0,09 = 0,18; norma mobil 0,9055; cosine = 0,18 / 0,82 = 0,2195 — jauh. Angka ini BUKAN opini: ia geometri.",
        "Keajaiban Word2Vec adalah analogi vektor: raja - pria + wanita mendekati ratu. Aritmetika sederhana atas vektor menangkap relasi semantik (gender, ibu kota-negara, jamak-tunggal) yang tidak pernah diajarkan eksplisit — ia muncul dari statistik konteks. Inilah yang membuat embedding menjadi fondasi NLP modern: transformer pun dimulai dari embedding, hanya saja kontekstual.",
        "Batasnya: embedding statis memberi SATU vektor per kata. 'Bisa' dalam 'saya bisa datang' (dapat) dan 'ular berbisa' (racun) mendapat vektor yang sama — DLE19 sudah menjelaskan kegagalan ini. Solusinya embedding kontekstual (ELMo, BERT, transformer): vektor dihitung ulang dari seluruh kalimat. Aturan: tugas yang poliseminya rendah (klasifikasi topik, pencarian) — Word2Vec cukup dan 100x lebih murah; tugas yang poliseminya tinggi (terjemahan, QA) — butuh kontekstual.",
      ],
      tasks: [],
      note: {
        title: "Bias dalam embedding adalah cermin data",
        body: "Word2Vec yang dilatih pada koran lama bisa memberi analogi 'pria - dokter + wanita = perawat' — bukan karena algoritmanya seksis, melainkan karena datanya. Embedding mewarisi bias korpusnya. Sebelum memakai embedding pra-latih, uji biasnya pada kata-kata sensitif di domainmu; jangan mewarisi prasangka koran 1990 ke produk 2026.",
      },
      reference: "Cosine raja-ratu 0,9928; raja-mobil 0,2195.",
    },
    {
      id: "lab-nlp-klasik",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: Viterbi dan cosine similarity",
      prose: [
        "Lab ini menghitung dua mesin NLP klasik dari angka mentah: probabilitas jalur Viterbi terbaik dan cosine similarity Word2Vec.",
        "Hitung dulu di kepala. Tabel delta: 'saya' N 0,49 (0,7 x 0,7), V 0,015 (0,3 x 0,05); 'makan' N 0,0196 (0,49 x 0,4 x 0,1), V 0,2499 (0,49 x 0,6 x 0,85); 'nasi' N 0,0350 (0,2499 x 0,7 x 0,2), V 0,0075 (0,2499 x 0,3 x 0,1). Backtracking dari N di 'nasi' — lewat V di 'makan', N di 'saya' — memberi jalur N-V-N = 0,0350. Cosine raja-ratu: dot 0,785 dibagi (0,9055 x 0,8732 = 0,7907) = 0,9928. Cosine raja-mobil: dot 0,18 dibagi 0,82 = 0,2195.",
        "Tugas lab: jalankan Viterbi sungguhan — pemrograman dinamis dengan delta dan backpointer, bukan menghitung satu jalur yang sudah ditebak — lalu hitung tiga angka dan cetak masing-masing di baris sendiri: viterbi (probabilitas jalur terbaik, 4 desimal), cos_ratu, cos_mobil. Tiga angka ini adalah bukti kamu bisa membaca fondasi NLP — bukan hanya mengimpor library dan berharap.",
        "Setelah lolos, coba eksperimen: geser massa emisi nomina dari 'nasi' ke 'makan' (em 'makan' sebagai N 0,1 menjadi 0,2, em 'nasi' sebagai N 0,2 menjadi 0,1 — baris N tetap berjumlah 1,0) dan lihat jalur terbaik tetap N-V-N tetapi probabilitasnya turun menjadi 0,0175. Lalu tanyakan: seberapa sensitif taggermu terhadap satu angka emisi? Itulah kerapuhan HMM — dan alasan CRF diciptakan.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan Viterbi (DP delta + backpointer) dan hitung `viterbi` = probabilitas jalur terbaik untuk 'saya makan nasi'" },
        { id: "t2", text: "Hitung `cos_ratu` dan `cos_mobil` dari vektor 2D" },
      ],
      expected: "viterbi=0.035\ncos_ratu=0.9928\ncos_mobil=0.2195",
      hints: [
        "Delta per posisi: delta[t][tag] = nilai MAKSIMUM atas tag sebelumnya dari delta[t-1][prev] x transisi x emisi; simpan backpointer-nya.",
        "Telusuri mundur dari tag terbaik di posisi terakhir untuk mendapat jalur terbaik; viterbi = delta terakhir pada tag itu.",
        "Cosine = dot / (norma a x norma b); norma = akar jumlah kuadrat.",
        "Bulatkan ke 4 desimal.",
      ],
      code: {
        starter: `# NLP klasik: Viterbi + cosine similarity.\nimport math\n\n# HMM: awal, transisi, emisi untuk 'saya makan nasi'\npi = {"N": 0.7, "V": 0.3}\ntr = {("N", "N"): 0.4, ("N", "V"): 0.6, ("V", "N"): 0.7, ("V", "V"): 0.3}\nem = {"N": {"saya": 0.7, "makan": 0.1, "nasi": 0.2},\n      "V": {"saya": 0.05, "makan": 0.85, "nasi": 0.1}}\nwords = ["saya", "makan", "nasi"]\n# Word2Vec 2D\nraja = [0.9, 0.1]\nratu = [0.85, 0.2]\nmobil = [0.1, 0.9]\n\n# TULIS KODEMU: jalankan Viterbi (delta + backpointer) dan\n# hitung tiga angka di bawah ini.\nviterbi = \ncos_ratu = \ncos_mobil = \n\nprint(f"viterbi={round(viterbi, 4)}")\nprint(f"cos_ratu={round(cos_ratu, 4)}")\nprint(f"cos_mobil={round(cos_mobil, 4)}")`,
        lockLines: 13,
        solution: `# NLP klasik: Viterbi + cosine similarity.\nimport math\n\n# HMM: awal, transisi, emisi untuk 'saya makan nasi'\npi = {"N": 0.7, "V": 0.3}\ntr = {("N", "N"): 0.4, ("N", "V"): 0.6, ("V", "N"): 0.7, ("V", "V"): 0.3}\nem = {"N": {"saya": 0.7, "makan": 0.1, "nasi": 0.2},\n      "V": {"saya": 0.05, "makan": 0.85, "nasi": 0.1}}\nwords = ["saya", "makan", "nasi"]\n# Word2Vec 2D\nraja = [0.9, 0.1]\nratu = [0.85, 0.2]\nmobil = [0.1, 0.9]\n\n\ndef norma(v):\n    return math.sqrt(v[0] ** 2 + v[1] ** 2)\n\n\ndef cos(a, b):\n    return (a[0] * b[0] + a[1] * b[1]) / (norma(a) * norma(b))\n\n\n# Viterbi sungguhan: delta per posisi + backpointer, top-level.\ndelta = []\npsi = []\ndelta.append({tag: pi[tag] * em[tag][words[0]] for tag in ("N", "V")})\npsi.append({tag: None for tag in ("N", "V")})\nfor t in range(1, len(words)):\n    dt = {}\n    pt = {}\n    for tag in ("N", "V"):\n        best_prev = None\n        best_val = -1.0\n        for prev in ("N", "V"):\n            cand = delta[t - 1][prev] * tr[(prev, tag)] * em[tag][words[t]]\n            if cand > best_val:\n                best_val = cand\n                best_prev = prev\n        dt[tag] = best_val\n        pt[tag] = best_prev\n    delta.append(dt)\n    psi.append(pt)\n# Backtracking dari tag terbaik di posisi terakhir.\ntags = [None] * len(words)\ntags[-1] = "N" if delta[-1]["N"] >= delta[-1]["V"] else "V"\nfor t in range(len(words) - 1, 0, -1):\n    tags[t - 1] = psi[t][tags[t]]\nviterbi = delta[-1][tags[-1]]\ncos_ratu = cos(raja, ratu)\ncos_mobil = cos(raja, mobil)\n\nprint(f"viterbi={round(viterbi, 4)}")\nprint(f"cos_ratu={round(cos_ratu, 4)}")\nprint(f"cos_mobil={round(cos_mobil, 4)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "viterbi", value: 0.035, tol: 0.0001, label: "`viterbi` seharusnya 0.035", msg: "N-V-N = 0,7x0,7x0,6x0,85x0,7x0,2 = 0,0350 — jalur terbaik dari DP + backpointer, bukan satu jalur yang ditebak." },
          { kind: "equal", task: "t2", name: "cos_ratu", value: 0.9928, tol: 0.0001, label: "`cos_ratu` seharusnya 0.9928", msg: "0,785 / 0,7907 = 0,9928." },
          { kind: "equal", task: "t2", name: "cos_mobil", value: 0.2195, tol: 0.0001, label: "`cos_mobil` seharusnya 0.2195", msg: "0,18 / 0,82 = 0,2195." },
        ],
      },
      reference: "Viterbi 0,0350 (N-V-N); cosine ratu 0,9928; mobil 0,2195.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Teori",
      title: "Peta keputusan: klasik, CRF, atau transformer",
      prose: [
        "Skenario 1 — Data kecil (di bawah 10 ribu kalimat berlabel), hasil harus dijelaskan. → HMM/Viterbi atau CRF. Alasan: transformer lapar data; klasik memberi alasan per keputusan.",
        "Skenario 2 — Fitur kaya (akhiran kata, kapitalisasi, kata sekitar) + struktur urutan. → CRF. Alasan: fitur arbitrer tanpa asumsi independensi HMM yang kaku.",
        "Skenario 3 — Data besar, konteks panjang, polisemi tinggi. → Transformer. Alasan: embedding kontekstual menyelesaikan apa yang tidak bisa dipecahkan tabel.",
        "Skenario 4 — Latensi ketat (mikrodetik) atau perangkat edge. → Klasik atau embedding statis + model linear. Alasan: Viterbi dan cosine adalah aritmetika murah; transformer butuh GPU.",
        "Skenario 5 — Pencarian semantik atas jutaan dokumen. → Word2Vec/fastText + ANN (MLE21). Alasan: vektor statis cukup untuk kemiripan topik; transformer hanya untuk reranking 100 teratas.",
        "Aturan praktis: mulai dari yang paling sederhana yang bisa diukur. Bila HMM mencapai 92 persen dan syaratmu 90 persen, berhenti — transformer yang mencapai 94 persen dengan biaya 100x bukan kemenangan.",
      ],
      tasks: [],
      note: {
        title: "Klasik sebagai baseline yang jujur",
        body: "Setiap proyek NLP modern wajib punya baseline klasik: Viterbi/CRF untuk urutan, TF-IDF + regresi logistik untuk klasifikasi, Word2Vec + cosine untuk pencarian. Bila transformer hanya menang 1 poin atas baseline yang 100x lebih murah, keputusan bisnisnya jelas — dan kamu hanya tahu itu bila baseline-nya ada.",
      },
      reference: "Klasik untuk data kecil + penjelasan + latensi; transformer untuk data besar + polisemi.",
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
        "Viterbi: jalur terbaik N-V-N = 0,0350 (DP 6 sel + backtracking).",
        "Cosine raja-ratu 0,9928; raja-mobil 0,2195.",
        "Word2Vec: analogi vektor menangkap relasi semantik.",
        "Batas statis: satu vektor per kata gagal pada polisemi.",
        "Klasik menang: data kecil, penjelasan, latensi ketat.",
      ],
      next: { label: "DLE32 — Data 3D & Video: dari Point Cloud ke Aksi", href: "/v2/learn/dle32-data-3d-video" },
      quiz: [
        {
          q: "Jalur N-V-N 'saya makan nasi' berprobabilitas 0,0350. Mengapa N-N-N jauh lebih kecil (0,0016)?",
          options: [
            { text: "Karena 'makan' hampir tidak pernah nomina (emisi 0,1)", why: "Tepat: emisi rendah menghukum jalur itu; Viterbi menghitung, bukan menebak.", correct: true },
            { text: "Karena 'saya' tidak bisa nomina", why: "Salah: 'saya' sebagai nomina emisinya 0,7 — justru tinggi." },
            { text: "Karena transisi N ke N mustahil", why: "Salah: transisi N ke N 0,4 — mungkin, hanya kurang disukai." },
            { text: "Karena Viterbi selalu memilih jalur terpendek", why: "Salah: Viterbi memilih jalur probabilitas TERTINGGI, bukan terpendek." },
          ],
        },
        {
          q: "Cosine raja-ratu 0,9928 vs raja-mobil 0,2195. Apa artinya?",
          options: [
            { text: "Raja dan ratu hampir identik secara semantik; raja dan mobil jauh", why: "Tepat: cosine mendekati 1 = sangat mirip; mendekati 0 = tidak berhubungan.", correct: true },
            { text: "Raja dan ratu adalah kata yang sama", why: "Salah: cosine 0,9928 bukan 1 — mirip, bukan identik." },
            { text: "Mobil lebih mirip raja daripada ratu", why: "Salah: terbalik — 0,2195 jauh lebih kecil dari 0,9928." },
            { text: "Cosine tidak bisa dibandingkan antar pasangan", why: "Salah: cosine adalah metrik yang sama untuk semua pasangan — justru untuk dibandingkan." },
          ],
        },
        {
          q: "Mengapa embedding statis gagal pada kata 'bisa'?",
          options: [
            { text: "Karena 'bisa' terlalu pendek", why: "Salah: panjang kata tidak relevan; yang relevan adalah polisemi." },
            { text: "Karena satu vektor harus mewakili dua makna ('dapat' dan 'racun')", why: "Tepat: makna bergantung konteks; vektor statis tidak punya konteks.", correct: true },
            { text: "Karena Word2Vec tidak kenal Bahasa Indonesia", why: "Salah: Word2Vec bisa dilatih pada korpus apa pun; masalahnya polisemi, bukan bahasa." },
            { text: "Karena cosine similarity tidak bekerja untuk kata kerja", why: "Salah: cosine bekerja untuk semua kata; masalahnya satu vektor per kata." },
          ],
        },
        {
          q: "Kapan HMM/Viterbi menjadi pilihan yang TEPAT atas transformer?",
          options: [
            { text: "Data besar dan konteks panjang", why: "Salah: itu wilayah transformer." },
            { text: "Data kecil, hasil harus dijelaskan, latensi ketat", why: "Tepat: klasik menang di tiga syarat itu sekaligus.", correct: true },
            { text: "Selalu — klasik tidak pernah kalah", why: "Salah: transformer menang telak di data besar dan polisemi tinggi." },
            { text: "Tidak pernah — klasik sudah usang", why: "Salah: klasik masih menang di data kecil, penjelasan, dan latensi." },
          ],
        },
        {
          q: "Apa keunggulan utama Viterbi dibanding menghitung semua jalur satu per satu?",
          options: [
            { text: "Viterbi memakai pemrograman dinamis — menyimpan yang terbaik per posisi dan tag", why: "Tepat: 2 tag x 3 kata = 6 sel, bukan enumerasi eksponensial.", correct: true },
            { text: "Viterbi tidak butuh probabilitas transisi", why: "Salah: transisi adalah inti perhitungan Viterbi." },
            { text: "Viterbi selalu benar 100 persen", why: "Salah: Viterbi optimal terhadap MODEL-nya; bila modelnya salah, jawabannya salah." },
            { text: "Viterbi bekerja tanpa data training", why: "Salah: probabilitas emisi dan transisi harus diestimasi dari data berlabel." },
          ],
        },
      ],
    },
  ],
};
