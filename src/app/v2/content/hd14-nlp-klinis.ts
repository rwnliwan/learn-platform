import type { V2Lesson } from "../lib/types";

export const hd14: V2Lesson = {
  slug: "hd14-nlp-klinis",
  track: "Health Data Science",
  module: "Data Non-Tabular",
  title: "HD14 NER & LLM Klinis: Membaca Catatan Dokter",
  estMinutes: 55,
  steps: [
    {
      id: "gudang-tak-terbaca",
      eyebrow: "Langkah 1 · NER klinis",
      title: "80% data yang tak terbaca mesin",
      prose: [
        "Direktur RS bangga: “Kami punya 2 juta record EHR!” Analis membuka: 80% informasi klinis terkunci dalam catatan narasi bebas — “nyeri dada sejak 3 hari, menjalar ke lengan kiri…”, singkatan, typo, bahasa campuran. Kolom terstruktur hanya berisi kode billing. Semua pertanyaan menarik jawabannya ada di teks yang tak terbaca mesin.",
        "NER (Named Entity Recognition) klinis: menemukan dan mengklasifikasikan entitas di teks — penyakit, gejala, obat, dosis, prosedur — dilanjut normalisasi (petakan ke ICD/SNOMED/RxNorm) dan deteksi negasi/ketidakpastian. Contoh: “Pasien mengeluh nyeri dada sejak 3 hari, tidak ada sesak napas. Diberi aspirin 80 mg.” → nyeri dada (GEJALA, present), sesak napas (GEJALA, negated — jangan hitung sebagai gejala!), aspirin 80 mg (OBAT + dosis). Normalisasi: nyeri dada → SNOMED 29857009; aspirin → RxNorm 1191.",
        "Tanpa deteksi negasi, pasien ini salah tercatat “punya sesak napas” — error klasik NER naif. Dan “DM” bisa berarti diabetes melitus atau dorsum manus; “tidak ada nyeri dada” bisa berarti pasien sehat atau dokter lupa bertanya. Dalam teks klinis, konteks 3 kata di sekitar entitas sering lebih penting dari entitasnya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghitung entitas tanpa deteksi negasi dulu. “Tidak ada sesak napas” yang dihitung sebagai gejala membalik makna klinis dan menghasilkan fenotipe sampah — satu negasi yang terlewat bisa melabeli pasien sehat sebagai sakit jantung.",
        type: "pitfall",
      },
      reference: "Pipeline NER klinis: entitas → negasi → normalisasi → evaluasi per tipe.",
    },
    {
      id: "lab-ner-aturan",
      eyebrow: "Langkah 2 · Lab simulasi",
      title: "NER berbasis aturan (simulasi konsep)",
      prose: [
        "Simulasikan NER berbasis aturan untuk Bahasa Indonesia: dari satu kalimat klinis, ekstrak gejala yang benar-benar dialami (present, tidak dinegasi) dan obat yang disebut. Aturan negasi sederhana: bila kata negasi (“tidak ada”, “tanpa”, “menyangkal”) muncul SEBELUM entitas dalam kalimat, entitas itu dinegasi. Catatan: kode di bawah memakai `t[:i]` — seluruh teks sebelum entitas, bukan hanya kalimatnya. Negasi di kalimat sebelumnya ikut terhitung; sistem nyata membatasi jendela ke kalimat yang sama.",
        "Ini simulasi konsep — bukan model besar. Tujuannya merasakan di mana aturan bekerja dan di mana ia rapuh (itulah kebutuhan ML/LLM nantinya).",
      ],
      tasks: [
        { id: "t1", text: "Ekstrak `gejala_ada` = gejala yang disebut dan TIDAK dinegasi" },
        { id: "t2", text: "Ekstrak `obat_ditemukan` dari kalimat" },
      ],
      expected: "gejala_ada=['nyeri dada']  obat_ditemukan=['aspirin']",
      note: {
        title: "Sering salah",
        body: "Mengecek keberadaan kata tanpa melihat konteks negasi — “sesak napas” ikut tercatat sebagai gejala. Inilah error yang membuat F1 negasi anjlok ke 0,71 sementara obat mencapai 0,9+ (angka ilustratif dari evaluasi per tipe entitas).",
        type: "pitfall",
      },
      hints: [
        "Ubah kalimat ke huruf kecil dulu agar pencocokan konsisten.",
        "Untuk tiap gejala: cek ada di teks DAN tidak ada kata negasi sebelumnya.",
        "def dinegasi(ent):\n    i = t.find(ent)\n    return any(n in t[:i] for n in kata_negasi)",
      ],
      code: {
        starter: `kalimat = "Pasien mengeluh nyeri dada sejak 3 hari, tidak ada sesak napas. Diberi aspirin 80 mg."\ngejala = ["nyeri dada", "sesak napas", "mual", "pusing"]\nobat = ["aspirin", "metformin"]\nkata_negasi = ["tidak ada", "tanpa", "menyangkal"]\n\nt = kalimat.lower()\n\n# TULIS KODEMU: gejala present (tidak dinegasi) dan obat\ndef dinegasi(ent):\n    \n\ngejala_ada = \nobat_ditemukan = \n\nprint(f"gejala_ada={gejala_ada}  obat_ditemukan={obat_ditemukan}")`,
        lockLines: 5,
        solution: `kalimat = "Pasien mengeluh nyeri dada sejak 3 hari, tidak ada sesak napas. Diberi aspirin 80 mg."\ngejala = ["nyeri dada", "sesak napas", "mual", "pusing"]\nobat = ["aspirin", "metformin"]\nkata_negasi = ["tidak ada", "tanpa", "menyangkal"]\n\nt = kalimat.lower()\n\n# TULIS KODEMU: gejala present (tidak dinegasi) dan obat\ndef dinegasi(ent):\n    i = t.find(ent)\n    return any(n in t[:i] for n in kata_negasi)\n\ngejala_ada = [g for g in gejala if g in t and not dinegasi(g)]\nobat_ditemukan = [o for o in obat if o in t]\n\nprint(f"gejala_ada={gejala_ada}  obat_ditemukan={obat_ditemukan}")`,
        checks: [
          { kind: "contains", task: "t1", name: "gejala_ada", value: "nyeri dada", label: "`gejala_ada` memuat 'nyeri dada'", msg: "“nyeri dada” disebut tanpa negasi sebelumnya — ia gejala present." },
          { kind: "contains", task: "t2", name: "obat_ditemukan", value: "aspirin", label: "`obat_ditemukan` memuat 'aspirin'", msg: "Cek tiap nama obat ada di teks (huruf kecil)." },
          { kind: "stdout_matches", task: "t2", pattern: "gejala_ada=\\['nyeri dada'\\]", label: "`print` menampilkan gejala_ada", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Mulai NLP klinis dari aturan + kamus sebagai baseline jujur.",
    },
    {
      id: "deidentifikasi",
      eyebrow: "Langkah 3 · Privasi",
      title: "De-identifikasi: sensor film data pasien",
      prose: [
        "De-identifikasi: menghapus atau menyamarkan 18 identifier HIPAA Safe Harbor (nama, tanggal lahir, alamat, NIK, dsb.) agar teks bisa dipakai riset — di Indonesia padankan dengan UU PDP. Contoh: “Tn. Budi Santoso, 45 th, Jl. Mawar 10 Makassar, dirawat 12 Jan 2026 karena TB.” → “Tn. [NAMA], [45-50] th, [KOTA], dirawat [Jan 2026] karena TB.” Nama dihapus, umur direntang, alamat digeneralisasi, tanggal dibulankan.",
        "Trade-off: makin agresif makin aman tapi makin merusak utilitas riset (tanggal presisi hilang → analisis wabah terganggu). Dan hapus nama saja tidak cukup: kombinasi “laki-laki, 45 th, kecamatan X, TB” bisa mengidentifikasi ulang bila hanya dimiliki 1 orang (quasi-identifier). De-identifikasi teks = NER terbalik: temukan identifier, lalu hapus atau generalisasi — plus evaluasi sisa risiko.",
        "Peringatan LLM: jangan kirim teks teridentifikasi ke API publik. Prompt berisi data pasien bisa tersimpan di vendor, dan model bisa menghafal lalu membocorkan training data. Gunakan deployment on-premise/privat, atau de-identifikasi dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira teks yang sudah dihapus namanya aman dibagikan. Quasi-identifier (umur + wilayah + diagnosis langka + tanggal) bisa mengidentifikasi ulang. De-identifikasi butuh evaluasi sisa risiko (k-anonymity), bukan sekadar hapus nama.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "De-identifikasi yang benar mencakup…",
          options: [
            { text: "18 identifier Safe Harbor + evaluasi sisa risiko quasi-identifier + perjanjian akses", why: "Benar: nama hanyalah satu dari 18. Kombinasi umur+wilayah+diagnosis bisa mengidentifikasi ulang.", correct: true },
            { text: "Hapus nama saja", why: "Tidak cukup: quasi-identifier tetap bisa mengidentifikasi ulang." },
            { text: "Ganti font", why: "Tidak ada hubungannya dengan privasi data." },
            { text: "Enkripsi nama saja", why: "Enkripsi bukan de-identifikasi; identifier lain tetap terbuka." },
          ],
        },
      ],
      reference: "De-id dulu sebelum teks keluar RS atau masuk LLM.",
    },
    {
      id: "lab-deid",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Recall 95% masih membocorkan ratusan",
      prose: [
        "Simulasikan NER de-identifikasi dengan recall 95% pada 1.000 dokumen, masing-masing memuat 6 identifier (nama, NIK, tanggal lahir, alamat, no BPJS, no telepon). Hitung estimasi identifier yang bocor.",
        "Recall 95% terdengar bagus — sampai kamu menghitung sisanya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bocor_per_dokumen` = identifier × (1 − recall)" },
        { id: "t2", text: "Hitung `total_bocor` untuk 1.000 dokumen" },
      ],
      expected: "bocor_per_dokumen=0.30  total_bocor=300",
      note: {
        title: "Sering salah",
        body: "Puas dengan recall “tinggi” tanpa menghitung absolutnya. 5% dari 6.000 identifier = 300 kebocoran — tiap satunya adalah pelanggaran privasi pasien yang nyata.",
        type: "pitfall",
      },
      hints: [
        "Yang bocor = total identifier × (1 − recall).",
        "Kalikan hasil per dokumen dengan jumlah dokumen.",
        "bocor_per_dokumen = 6 * (1 - 0.95)",
      ],
      code: {
        starter: `n_dokumen = 1000\nidentifier_per_dokumen = 6  # nama, NIK, tgl lahir, alamat, no BPJS, no telp\nrecall_ner = 0.95\n\n# TULIS KODEMU: estimasi identifier yang bocor\nbocor_per_dokumen = \ntotal_bocor = \n\nprint(f"bocor_per_dokumen={bocor_per_dokumen:.2f}  total_bocor={total_bocor:.0f}")`,
        lockLines: 3,
        solution: `n_dokumen = 1000\nidentifier_per_dokumen = 6  # nama, NIK, tgl lahir, alamat, no BPJS, no telp\nrecall_ner = 0.95\n\n# TULIS KODEMU: estimasi identifier yang bocor\nbocor_per_dokumen = identifier_per_dokumen * (1 - recall_ner)\ntotal_bocor = bocor_per_dokumen * n_dokumen\n\nprint(f"bocor_per_dokumen={bocor_per_dokumen:.2f}  total_bocor={total_bocor:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bocor_per_dokumen", value: 0.3, tol: 1e-9, label: "`bocor_per_dokumen` seharusnya 0.3", msg: "6 × (1 − 0,95) = 0,3 identifier bocor per dokumen." },
          { kind: "equal", task: "t2", name: "total_bocor", value: 300.0, tol: 1e-9, label: "`total_bocor` seharusnya 300", msg: "0,3 × 1.000 = 300. Recall 95% masih menyisakan ratusan kebocoran." },
          { kind: "stdout_matches", task: "t2", pattern: "total_bocor=300", label: "`print` menampilkan total_bocor", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "De-identifikasi butuh pertahanan berlapis, bukan satu trik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: memproses teks klinis",
      prose: [
        "Lima situasi keputusan yang dihadapi tim data setiap kali catatan dokter menjadi bahan kerja:",
        "Skenario 1 — “Ekstraksi entitas (diagnosis, obat, dosis) dari catatan bebas?” → Mulai dengan NER berbasis aturan/kamus untuk pola terstruktur (dosis, tanggal, kode); naik ke model ML bila variasi bahasanya besar. Evaluasi dengan F1 per tipe entitas — “F1 keseluruhan 0,9” bisa menyembunyikan alergi yang tak pernah tertangkap.",
        "Skenario 2 — “Data teks mau dibagikan atau dianalisis pihak ketiga?” → De-identifikasi DULU: hapus 18 pengenal (nama, tanggal lahir, alamat, nomor RM, dsb. — padanan lokalnya), lalu ukur sisa risiko re-identifikasi. Mengirim teks mentah ke LLM-as-a-service tanpa perjanjian pemrosesan data = kebocoran yang disengaja.",
        "Skenario 3 — “Pakai LLM untuk ringkasan pulang / ekstraksi?” → Boleh — sebagai DRAF untuk dokter, bukan dokumen final otomatis. Datanya: 85% akurat-lengkap, 10% berhalusinasi (alergi yang tidak ada di chart!), 5% menghilangkan info kritis. Hemat 40% waktu dokter dengan harga human-in-the-loop yang tidak bisa ditawar.",
        "Skenario 4 — “LLM untuk tanya-jawab atau triase pasien langsung?” → Hanya dengan RAG dari sumber terkontrol + daftar red-flag yang selalu dieskalasi ke manusia. Contoh kegagalan: chatbot triase menyarankan “istirahat dan minum air hangat” untuk nyeri dada yang ternyata infark — tanpa uji klinis, tanpa uji factuality, riwayat chat plaintext di server vendor. Kecepatan deploy tanpa evaluasi = malapraktik berskala software.",
        "Skenario 5 — “Bagaimana mengevaluasi sistem NLP klinis?” → Ukur yang penting secara klinis: factuality dinilai klinisi untuk LLM (bukan BLEU/ROUGE — kefasihan bukan kebenaran), precision/recall per tipe entitas untuk ekstraksi, dan tingkat halusinasi berkala pasca-deploy. Metrik yang salah mengoptimasi kefasihan sambil membiarkan halusinasi.",
        "Aturan praktis 10 detik: ekstraksi → aturan dulu, F1 per entitas → bagi data → de-identifikasi dulu → LLM = draf + human-in-the-loop → triase langsung = RAG + red-flag + uji klinis → evaluasi = factuality klinisi, bukan BLEU.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira ringkasan LLM yang fasih = ringkasan yang benar — padahal 1 dari 10 mengandung halusinasi dan 1 dari 20 menghilangkan info kritis. Di teks klinis, satu alergi fiktif bukan “kesalahan kecil”: ia adalah resep yang salah menunggu terjadi.",
        type: "pitfall",
      },
      reference: "LLM = asisten berdraf, bukan penanggung jawab. Fasih ≠ benar.",
    },
    {
      id: "llm-klinis",
      eyebrow: "Langkah 6 · LLM & mini-case",
      title: "LLM: residen super-cepat yang kadang ngawur",
      prose: [
        "LLM/foundation model klinis bisa ekstraksi, ringkasan, dan tanya-jawab dari teks klinis dengan sedikit training data — dengan risiko halusinasi. Evaluasi nyata: 100 ringkasan pulang dinilai dokter — 85% akurat-lengkap, 10% ada halusinasi (alergi yang tidak ada di chart!), 5% menghilangkan info kritis. Keputusan: deploy sebagai draf untuk dokter (hemat 40% waktu), BUKAN dokumen final otomatis.",
        "Pola aman memakai LLM klinis: (1) de-identifikasi dulu; (2) retrieval-augmented (RAG) dengan sumber terkontrol untuk tanya-jawab; (3) human-in-the-loop untuk output yang berdampak ke pasien; (4) ukur halusinasi berkala dengan metrik factuality dinilai klinisi — bukan BLEU/ROUGE semata. LLM untuk draf, dokter untuk keputusan.",
        "Mini-case: startup meluncurkan chatbot triase berbasis LLM — pasien chat gejala, bot menyarankan “ke IGD / istirahat di rumah”, tanpa uji klinis, langsung ke publik. Sebulan kemudian: pasien nyeri dada disarankan “istirahat dan minum air hangat” — ternyata infark. Kegagalan per lapisan: klinis (LLM boleh memberi informasi umum, bukan diagnosis definitif — butuh eskalasi red-flag ke manusia); evaluasi (tidak ada uji factuality, tidak ada pengukuran halusinasi); privasi (riwayat chat tersimpan plaintext di server vendor). Kecepatan deploy tanpa evaluasi klinis = malapraktik berskala software.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Chatbot triase yang menyarankan “istirahat” untuk nyeri dada infark bisa membunuh. Untuk setiap proyek LLM klinis, definisikan “apa yang terjadi bila ia salah” dulu — klasifikasi risiko ini menentukan seberapa ketat verifikasi yang dibutuhkan.",
        type: "risk",
      },
      reference: "LLM = asisten berdraf, bukan penanggung jawab.",
    },
    {
      id: "evaluasi-ekstraksi",
      eyebrow: "Langkah 7 · Evaluasi",
      title: "Akurasi menipu — nilai per entitas, per batas",
      prose: [
        "Model NER-mu mencapai akurasi token 97%. Terdengar hebat — sampai kamu sadar 90% token adalah “bukan entitas”, sehingga model yang tidak menandai apa pun sudah dapat 90%. Inilah kenapa evaluasi NER tidak pernah memakai akurasi: ia memakai precision, recall, dan F1 — dihitung PER TIPE ENTITAS, pada level ENTITAS (span utuh), bukan token.",
        "Lapisan kedua: apa artinya “benar”? Ada tiga definisi. Strict: batas span harus PERSIS sama (prediksi “nyeri dada” vs gold “nyeri dada sejak 3 hari” = salah). Lenient/overlap: cukup tumpang tindih + tipe sama = benar. Type-aware: span benar tetapi tipe salah (OBAT vs PENYAKIT) dihitung terpisah. Pilihan definisi mengubah F1 secara dramatis — model yang sama bisa F1 0,50 (strict) dan 0,75 (lenient). Analis yang melaporkan satu angka tanpa menyebut definisinya sedang menyembunyikan separuh cerita.",
        "Lapisan ketiga: kesepakatan anotator. Sebelum melatih model, dua dokter menganotasi 100 catatan yang sama — diukur dengan Cohen's kappa (kesepakatan di atas kebetulan). Kappa < 0,6 berarti definisi entitasnya sendiri ambigu — model yang dilatih di atasnya mewarisi kebingungan itu. Dan lapisan keempat: error analysis taksonomi — kelompokkan kesalahan (batas span salah? negasi terlewat? singkatan ambigu? tipe tertukar?) karena tiap jenis error butuh obat berbeda: error batas → perbaiki tokenisasi/panduan anotasi; negasi terlewat → modul negasi; singkatan → kamus lokal.",
      ],
      formula: String.raw`P = \frac{TP}{TP+FP} \qquad R = \frac{TP}{TP+FN} \qquad F_1 = \frac{2PR}{P+R}`,
      formulaNote: "TP = entitas diprediksi yang benar menurut definisi kecocokan yang dipakai; FP = prediksi yang bukan entitas (atau batas/tipe salah); FN = entitas gold yang terlewat. P (precision) = dari yang diprediksi, berapa yang benar; R (recall) = dari yang seharusnya ditemukan, berapa yang ketemu; F1 = rata-rata harmonik keduanya. Contoh: TP=2, FP=2, FN=2 → P=R=0,5 → F1=0,5. Interpretasi: F1 menghukum model yang hanya pandai satu sisi — precision sempurna dengan recall nol tetap F1 nol.",
      tasks: [],
      note: {
        title: "Intuisi: teks klinis adalah bahasa kedua dokter",
        body: "Praktisi NLP klinis yang baik memperlakukan catatan dokter sebagai dialek tersendiri — bukan Bahasa Indonesia yang rapi. Heuristiknya: pertama, hormati singkatan lokal sebelum memanggil model besar — kamus singkatan RS (“SOB”, “DM”, “tdk”) yang dibangun dari 1.000 catatan sering menaikkan F1 lebih banyak daripada mengganti arsitektur model. Kedua, negasi dan ketidakpastian adalah separuh pekerjaan: “menyangkal nyeri dada”, “curiga TB”, “riwayat DM” — tiga pola ini memutuskan apakah entitasmu bermakna klinis atau sampah. Ketiga, evaluasi seperti auditor, bukan seperti pemasar: laporkan F1 per tipe entitas dengan definisi kecocokan yang eksplisit (strict vs lenient), karena agregat menyembunyikan titik lemah yang justru paling berbahaya — negasi yang F1-nya 0,71 sementara obat 0,94 (angka ilustratif). Keempat, untuk LLM sebagai ekstraktor: jangan percaya klaim “tanpa training” — ukur halusinasi span (entitas yang tidak ada di teks!) dengan metrik factuality yang dinilai klinisi, dan selalu human-in-the-loop untuk output yang menyentuh pasien. Teks klinis tidak memaafkan ekstraksi yang ceroboh — ia mengubahnya menjadi keputusan medis yang salah.",
      },
      reference: "Evaluasi NER: F1 per tipe entitas, definisi kecocokan eksplisit, kappa anotator, taksonomi error.",
    },
    {
      id: "lab-evaluasi",
      eyebrow: "Langkah 8 · Lab simulasi",
      title: "Strict vs lenient: satu model, dua nilai",
      prose: [
        "Hitung F1 entity-level untuk satu set prediksi sintetis (span = (start, end, tipe)) dengan dua definisi kecocokan: strict (span persis sama) dan lenient (tumpang tindih + tipe sama). Rasakan sendiri bagaimana definisi mengubah nilai — dan bayangkan analis yang hanya melaporkan angka yang lebih besar.",
        "Coba: setelah lolos, ubah prediksi keempat dari (80,88,\"PENYAKIT\") menjadi (70,75,\"OBAT\") (duplikat gold) — lalu tambah SATU LAGI prediksi (70,75,\"OBAT\"). Berapa TP strict sekarang? Dengan matching satu-ke-satu, duplikat kedua TIDAK menambah TP (tetap 3) — itulah kenapa evaluasi memakai SET: duplikat tidak dihitung ganda.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `f1(gold, pred, mode)`: TP strict = prediksi yang persis ada di gold; TP lenient = prediksi yang overlap + tipe sama" },
        { id: "t2", text: "Hitung `f1_strict` dan `f1_lenient`; cetak keduanya dengan 3 desimal" },
      ],
      expected: "f1_strict=0.500  f1_lenient=0.750",
      note: {
        title: "Sering salah",
        body: "Melaporkan F1 lenient sebagai “F1 model” tanpa menyebut definisinya. Selalu tulis eksplisit: “F1 strict = 0,50; F1 lenient = 0,75”. Reviewer yang baik langsung bertanya definisinya — analis yang menyembunyikannya kehilangan kepercayaan sekali ketahuan.",
        type: "pitfall",
      },
      hints: [
        "Strict: cocokkan satu-ke-satu — tiap gold hanya boleh dipakai sekali (used-set); duplikat pred tidak menambah TP.",
        "Lenient: overlap bila p[0] < g[1] and g[0] < p[1], plus p[2] == g[2] — juga satu-ke-satu (tandai gold yang sudah terpakai).",
        "F1 = 2*P*R/(P+R); P = tp/(tp+fp); R = tp/(tp+fn).",
      ],
      code: {
        starter: `# Span entitas (start, end, tipe) — DATA SINTETIS untuk latihan\ngold = [(0,10,"GEJALA"), (25,36,"GEJALA"), (50,57,"OBAT"), (70,75,"OBAT")]\npred = [(0,10,"GEJALA"), (25,34,"GEJALA"), (50,57,"OBAT"), (80,88,"PENYAKIT")]\n\n# TULIS KODEMU: F1 entity-level strict vs lenient\ndef f1(gold, pred, mode):\n    \n\nf1_strict = f1(gold, pred, "strict")\nf1_lenient = f1(gold, pred, "lenient")\nprint(f"f1_strict={f1_strict:.3f}  f1_lenient={f1_lenient:.3f}")`,
        lockLines: 3,
        solution: `# Span entitas (start, end, tipe) — DATA SINTETIS untuk latihan\ngold = [(0,10,"GEJALA"), (25,36,"GEJALA"), (50,57,"OBAT"), (70,75,"OBAT")]\npred = [(0,10,"GEJALA"), (25,34,"GEJALA"), (50,57,"OBAT"), (80,88,"PENYAKIT")]\n\n# TULIS KODEMU: F1 entity-level strict vs lenient\ndef f1(gold, pred, mode):\n    used = set()\n    tp = 0\n    for p in pred:\n        for i, g in enumerate(gold):\n            if i in used:\n                continue\n            cocok = (p == g) if mode == "strict" else (p[0] < g[1] and g[0] < p[1] and p[2] == g[2])\n            if cocok:\n                used.add(i)\n                tp += 1\n                break\n    fp = len(pred) - tp\n    fn = len(gold) - tp\n    prec = tp/(tp+fp) if tp+fp else 0\n    rec = tp/(tp+fn) if tp+fn else 0\n    return 2*prec*rec/(prec+rec) if prec+rec else 0\n\nf1_strict = f1(gold, pred, "strict")\nf1_lenient = f1(gold, pred, "lenient")\nprint(f"f1_strict={f1_strict:.3f}  f1_lenient={f1_lenient:.3f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "f1_strict", value: 0.5, tol: 1e-9, label: "`f1_strict` = 0.500", msg: "TP=2 (span persis), FP=2, FN=2 → P=R=0,5 → F1=0,5." },
          { kind: "equal", task: "t2", name: "f1_lenient", value: 0.75, tol: 1e-9, label: "`f1_lenient` = 0.750", msg: "TP=3 (overlap dihitung), FP=1, FN=1 → P=R=0,75 → F1=0,75." },
          { kind: "stdout_matches", task: "t2", pattern: "f1_strict=0\\.500\\s+f1_lenient=0\\.750", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Satu model, dua F1: strict 0,50 vs lenient 0,75. Definisinya wajib dilaporkan.",
    },
    {
          id: "gap-r9-protokol-faktualitas",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P8-G2)",
          title: "Protokol faktualitas LLM: skala, sampel & adjudikasi dua-rater",
          prose: [
            "Lesson ini memperingatkan 'jangan percaya klaim tanpa training — ukur halusinasi span' — tetapi belum memberi PROTOKOL pengukurannya. Protokol operasional punya empat bagian: (1) SKALA — definisikan dulu apa yang dihitung: halusinasi span = entitas yang TIDAK ADA di teks sumber (bukan sekadar salah tipe — itu kesalahan klasifikasi, bukan halusinasi). (2) UKURAN SAMPEL — seperti golden set di aai15: n ≥ 200 span untuk margin ±7% pada CI 95%; di bawah itu, 'tingkat halusinasi 5%' tidak bermakna. (3) ADJUDIKASI DUA-RATER — dua klinisi menilai independen; yang tidak sepakat didiskusikan atau diputus rater ketiga. (4) METRIK — laporkan TIGA angka: tingkat halusinasi (span halusinasi / total span), kesepakatan antar-rater (Cohen's kappa), dan tingkat halusinasi per tipe entitas (obat vs diagnosis bisa jauh berbeda).",
            "Contoh angka (200 span, 2 rater): keduanya sepakat 'halusinasi' pada 12 span, sepakat 'benar' pada 170, tidak sepakat pada 18 (9+9). Kesepakatan teramati Po = (12+170)/200 = 0,91. Kesepakatan harapan Pe = (21×21 + 179×179)/200² = 0,812. Kappa = (0,91 − 0,812)/(1 − 0,812) ≈ 0,52 — 'moderate' (Landis-Koch): cukup untuk pilot, BELUM cukup untuk klaim produksi (target κ ≥ 0,6). Bila kappa rendah, yang diperbaiki adalah RUBRIK-nya (definisi halusinasi diperjelas), bukan rater-nya.",
            "Aturan: jangan pernah melaporkan tingkat halusinasi TANPA kappa — angka tanpa kesepakatan antar-rater adalah angka yang tidak tahu apakah ia bisa dipercaya. Dan halusinasi span diukur pada OUTPUT LLM, bukan pada data latih — ia soal apa yang model TAMBAHKAN, bukan apa yang ia hafal.",
          ],
          formula: String.raw`\kappa = \frac{P_o - P_e}{1 - P_e}`,
          formulaNote: "Protokol faktualitas: definisi halusinasi span, n ≥ 200 span (±7%), dua-rater + adjudikasi, laporkan tingkat halusinasi + kappa + per-tipe. Contoh angka: Po=0,91, Pe=0,812 → κ≈0,52 (moderate; target produksi ≥0,6).",
          tasks: [
            { id: "t1", text: "Hitung `po` (kesepakatan teramati) dan `kappa` dari matriks 2-rater" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "Po=0.91 kappa=0.52",
          hints: [
            "Po = (sepakat_halusinasi + sepakat_benar) / total.",
            "Pe = (baris1×kolom1 + baris2×kolom2) / total²; kappa = (Po−Pe)/(1−Pe).",
          ],
          code: {
            starter: `# matriks 2-rater (200 span): a=dua-duanya halusinasi, d=dua-duanya benar\na, b, c, d = 12, 9, 9, 170\ntotal = a + b + c + d\n\n# TULIS KODEMU: Po + Cohen's kappa\npo = \npe = \nkappa = \n\nprint(f"Po={po:.2f} kappa={kappa:.2f}")`,
            lockLines: 4,
            solution: `# matriks 2-rater (200 span): a=dua-duanya halusinasi, d=dua-duanya benar\na, b, c, d = 12, 9, 9, 170\ntotal = a + b + c + d\n\n# TULIS KODEMU: Po + Cohen's kappa\npo = (a + d) / total\npe = ((a + b) * (a + c) + (c + d) * (b + d)) / total ** 2\nkappa = (po - pe) / (1 - pe)\n\nprint(f"Po={po:.2f} kappa={kappa:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "po", value: 0.91, tol: 0.01, label: "`po` seharusnya 0,91", msg: "(12+170)/200 = 0,91." },
              { kind: "equal", task: "t1", name: "kappa", value: 0.52, tol: 0.02, label: "`kappa` seharusnya ≈0,52", msg: "(0,91−0,812)/(1−0,812) ≈ 0,52." },
              { kind: "stdout_matches", task: "t2", pattern: "Po=0.91\\s+kappa=0.52", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Tingkat halusinasi dilaporkan 5% tetapi kappa antar-rater 0,30. Apa masalahnya?",
              options: [
                { text: "Angkanya tidak bisa dipercaya — rater tidak sepakat apa itu halusinasi; perbaiki rubrik dulu", why: "Benar: κ=0,30 (fair) berarti definisinya kabur; 5% bisa jadi artefak rubrik.", correct: true },
                { text: "Tidak ada masalah — 5% sudah cukup rendah", why: "Salah: tanpa kesepakatan rater, 5% tidak bermakna — rater lain bisa mendapat 15%." },
                { text: "Ganti kedua rater dengan yang lebih teliti", why: "Salah: kappa rendah biasanya soal rubrik yang kabur, bukan rater yang ceroboh." },
              ],
            },
          ],
          reference: "Halusinasi span + n≥200 + dua-rater + kappa ≥0,6; laporkan tingkat + kappa + per-tipe.",
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
        "NER klinis: entitas + normalisasi (SNOMED/RxNorm) + deteksi negasi.",
        "Evaluasi per tipe entitas; negasi biasanya titik lemah.",
        "De-identifikasi: 18 identifier + ukur sisa risiko + lapisan pertahanan.",
        "Jangan kirim teks teridentifikasi ke API LLM publik.",
        "LLM: kuat untuk draf/ekstraksi awal; halusinasi = wajib human-in-the-loop.",
        "Evaluasi NER: F1 per tipe entitas + definisi kecocokan eksplisit (strict vs lenient); akurasi token menipu.",
      ],
      next: { label: "HD15 — DICOM & Klasifikasi Citra", href: "/v2/learn/hd15-imaging-medis" },
      quiz: [
        {
          q: "Kalimat “tidak ada sesak napas”. Kesalahan NER naif?",
          options: [
            { text: "Mencatat “sesak napas” sebagai gejala yang dialami (gagal deteksi negasi)", why: "Benar: negasi membalik arti. NER klinis tanpa deteksi negasi menghasilkan fenotipe sampah.", correct: true },
            { text: "Tidak ada", why: "Ada: inilah error klasik yang membalik makna klinis." },
            { text: "Gagal membaca huruf", why: "Huruf terbaca baik-baik saja; masalahnya adalah makna." },
            { text: "Terlalu lambat", why: "Kecepatan bukan masalahnya — kebenaran yang bermasalah." },
          ],
        },
        {
          q: "Setelah NER, langkah “normalisasi” artinya…",
          options: [
            { text: "Memetakan entitas ke terminologi standar (SNOMED/RxNorm/ICD)", why: "Benar: “aspirin” → RxNorm 1191. Tanpa ini, “aspirin” dan “acetosal” jadi dua obat berbeda.", correct: true },
            { text: "Merapikan huruf", why: "Itu normalisasi teks, bukan normalisasi entitas klinis." },
            { text: "Menghapus data", why: "Normalisasi tidak menghapus — ia memetakan ke kode standar." },
            { text: "Menerjemahkan", why: "Bukan penerjemahan bahasa — pemetaan ke terminologi." },
          ],
        },
        {
          q: "Kapan LLM cocok untuk data klinis?",
          options: [
            { text: "Ringkasan draf + ekstraksi awal dengan human-in-the-loop, setelah de-identifikasi", why: "Benar: asisten yang diawasi, bukan penanggung jawab. Privasi: jangan kirim teridentifikasi ke API publik.", correct: true },
            { text: "Diagnosis otonom", why: "Halusinasi 10% membuat diagnosis otonom berbahaya." },
            { text: "Mengganti dokter", why: "LLM adalah asisten pra-seleksi, bukan pengganti adjudikasi manusia." },
            { text: "Kirim data mentah ke API publik", why: "Pelanggaran privasi: prompt bisa tersimpan di vendor (UU PDP)." },
          ],
        },
        {
          q: "Evaluasi NER yang benar?",
          options: [
            { text: "Precision/recall/F1 PER TIPE ENTITAS (negasi sering paling lemah)", why: "Benar: agregat menyembunyikan kelemahan fatal (negasi F1 0,71 vs obat 0,94 — angka ilustratif).", correct: true },
            { text: "Satu angka F1 agregat", why: "Agregat menyembunyikan titik lemah yang justru paling berbahaya." },
            { text: "Kecepatan saja", why: "Kecepatan tidak mengukur kebenaran ekstraksi." },
            { text: "Jumlah baris kode", why: "Tidak ada hubungannya dengan kualitas." },
          ],
        },
        {
          q: "Catatan Indonesia (“nyeri dada, no SOB”, singkatan lokal). Tantangan utama transfer model Inggris?",
          options: [
            { text: "Campur bahasa + singkatan lokal + struktur longgar — butuh adaptasi data lokal", why: "Benar: domain shift bahasa. Butuh anotasi lokal; evaluasi ulang, jangan asumsi.", correct: true },
            { text: "Tidak ada", why: "Ada: code-switching dan singkatan lokal membuat model Inggris gagal total." },
            { text: "Hanya font", why: "Bukan masalah tampilan — masalah bahasa." },
            { text: "Terlalu cepat", why: "Kecepatan bukan masalahnya." },
          ],
        },
      ],
    },
  ],
};
