import type { V2Lesson } from "../lib/types";

export const hd9: V2Lesson = {
  slug: "hd9-uji-diagnostik",
  track: "Health Data Science",
  module: "Analisis Klinis Lanjutan",
  title: "HD9 Uji Diagnostik: Sensitivitas, Spesifisitas, dan PPV",
  estMinutes: 50,
  steps: [
    {
      id: "tes-99",
      eyebrow: "Langkah 1 · Paradoks",
      title: "Tes 99% akurat yang salah 91%",
      prose: [
        "Tes HIV dengan sensitivitas 99% dan spesifisitas 99%. Budi positif. Berapa peluang ia benar-benar terinfeksi? Intuisi menjawab 99%. Jawaban benar: sekitar 9%. Kok bisa?",
        "Karena prevalensi. Di populasi dengan prevalensi 0,1%: dari 100.000 orang, 100 terinfeksi → 99 terdeteksi (TP). 99.900 sehat → 1% false positive = 999 (FP). PPV = 99/(99+999) ≈ 9%. Tesnya “99% akurat”, tapi 91% yang positif adalah false alarm. Inilah base-rate fallacy — dan alasan skrining massal butuh tes konfirmasi.",
        "Sensitivitas = P(positif | sakit): menangkap yang sakit (rule-out; SnNout — sensitivitas tinggi, negatif menyingkirkan). Spesifisitas = P(negatif | sehat): tidak salah menuduh (rule-in; SpPin — spesifisitas tinggi, positif memastikan). Tapi yang ditanya pasien selalu PPV/NPV — dan itu tergantung prevalensi.",
      ],
      tasks: [],
      formula: String.raw`\text{PPV} = \frac{\text{Sens} \times P}{\text{Sens} \times P + (1-\text{Spes}) \times (1-P)}`,
      formulaNote: "PPV = positive predictive value — probabilitas benar-benar sakit bila hasil tes positif (inilah yang ditanya pasien). Sens = sensitivitas = P(positif|sakit); Spes = spesifisitas = P(negatif|sehat); P = prevalensi = P(sakit) di populasi yang dites. Pembilang = proporsi true positive; penyebut = semua yang positif (true + false). Interpretasi: PPV bukan sifat tes — ia sifat tes × populasi. Tes yang sama: PPV 9% di prevalensi 0,1%, 92% di prevalensi 10%. Jangan pinjam PPV publikasi untuk populasimu.",
      note: {
        title: "Sering salah",
        body: "Menyamakan sensitivitas dengan PPV (“tes 99% akurat → 99% yang positif benar sakit”). Sensitivitas bicara soal tes pada orang sakit; PPV bicara soal orang positif — dan di antara keduanya ada prevalensi.",
        type: "pitfall",
      },
      reference: "SnNout (rule-out), SpPin (rule-in). PPV selalu butuh prevalensi.",
    },
    {
      id: "lab-ppv",
      eyebrow: "Langkah 2 · Lab",
      title: "PPV di dua prevalensi",
      prose: [
        "Tes dengan sensitivitas 99% dan spesifisitas 99%. Hitung PPV pada (a) prevalensi 0,1% (skrining populasi umum) dan (b) prevalensi 10% (klinik rujukan). Rasakan bagaimana angka yang sama menjadi tes yang berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ppv_rendah` (prevalensi 0,001)" },
        { id: "t2", text: "Hitung `ppv_tinggi` (prevalensi 0,10)" },
      ],
      expected: "ppv_rendah≈0.0902 ppv_tinggi≈0.9167",
      note: {
        title: "Kaitan ke risk",
        body: "Skrining massal tanpa tes konfirmasi pada prevalensi rendah = ribuan false positive → kecemasan, biaya tindak lanjut, dan stigma. Desain program skrining yang mengabaikan PPV adalah malpraktik kesehatan masyarakat.",
        type: "risk",
      },
      hints: [
        "PPV = (sens × p) / (sens × p + (1−spes) × (1−p)).",
        "Untuk (a): p=0,001 — hitung pembilang dan penyebut terpisah.",
        "Untuk (b): p=0,10 — tes yang sama, populasi berbeda.",
      ],
      code: {
        starter: `# Tes: sensitivitas 99%, spesifisitas 99%\nsens, spes = 0.99, 0.99\n# TULIS KODEMU: PPV pada prevalensi 0,1% dan 10%\nppv_rendah = \nppv_tinggi = \nprint(f"ppv_rendah={ppv_rendah:.4f} ppv_tinggi={ppv_tinggi:.4f}")`,
        lockLines: 1,
        solution: `# Tes: sensitivitas 99%, spesifisitas 99%\nsens, spes = 0.99, 0.99\n# TULIS KODEMU: PPV pada prevalensi 0,1% dan 10%\ndef ppv(p):\n    return (sens*p)/(sens*p + (1-spes)*(1-p))\nppv_rendah = ppv(0.001)\nppv_tinggi = ppv(0.10)\nprint(f"ppv_rendah={ppv_rendah:.4f} ppv_tinggi={ppv_tinggi:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ppv_rendah", value: 0.0902, tol: 0.001, label: "`ppv_rendah` seharusnya ≈ 0.0902", msg: "(0,99×0,001)/(0,99×0,001 + 0,01×0,999) — 91% positif adalah false alarm." },
          { kind: "equal", task: "t2", name: "ppv_tinggi", value: 0.9167, tol: 0.001, label: "`ppv_tinggi` seharusnya ≈ 0.9167", msg: "Prevalensi 10%: tes yang sama menjadi jauh lebih bisa dipercaya." },
          { kind: "stdout_matches", task: "t2", pattern: "ppv_rendah=0\\.0902 ppv_tinggi=0\\.9167", label: "`print` menampilkan kedua PPV", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tes yang sama, prevalensi beda = tes yang beda.",
    },
    {
      id: "roc-threshold",
      eyebrow: "Langkah 3 · ROC",
      title: "ROC, AUC, dan memilih threshold",
      prose: [
        "Kurva ROC memetakan trade-off sensitivitas vs 1−spesifisitas di semua threshold. AUC = peluang skor pasien sakit > skor pasien sehat (pasangan acak). AUC 0,5 = tebak acak; 1,0 = sempurna. Tapi AUC tidak memilih threshold — ia merangkum semua threshold.",
        "Threshold dipilih dari konteks klinis, bukan dari Youden index semata. Skrining kanker: prioritaskan sensitivitas (jangan lewatkan yang sakit; false positive ditangani tes konfirmasi). Tes konfirmasi mahal/berisiko: prioritaskan spesifisitas. Aturan: threshold = keputusan, bukan statistik — libatkan biaya false positive vs false negative (lihat HD12 decision curve, HD17).",
        "Likelihood ratio melengkapi: LR+ = sens/(1−spes) — seberapa kuat hasil positif menaikkan odds; LR− = (1−sens)/spes. LR mengubah pre-test odds menjadi post-test odds — cara dokter berpikir secara Bayesian di samping pasien.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih threshold yang memaksimalkan akurasi pada data tidak seimbang. Akurasi 99% pada prevalensi 1% bisa dicapai dengan “selalu negatif” — tes yang tidak berguna. Pilih threshold dari biaya klinis, bukan dari metrik yang enak dilihat.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "AUC 0,92 berarti…",
          options: [
            { text: "Peluang 92% skor pasien sakit > skor pasien sehat (pasangan acak)", why: "Benar: itu definisi AUC. Bukan akurasi, bukan PPV.", correct: true },
            { text: "Akurasi tes 92%", why: "Akurasi tergantung threshold dan prevalensi — AUC tidak." },
            { text: "92% diagnosis benar", why: "AUC merangkum semua threshold; diagnosis butuh satu threshold." },
            { text: "Tes sempurna", why: "Sempurna = 1,0. 0,92 sangat baik, bukan sempurna." },
          ],
        },
      ],
      reference: "AUC merangkum; threshold memutuskan. Konteks klinis memilih threshold.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: menilai dan memakai tes diagnostik",
      prose: [
        "Lima situasi keputusan yang dihadapi klinisi, analis, dan regulator setiap kali sebuah tes diusulkan — dengan hitungan yang tepat untuk tiap situasi:",
        "Skenario 1 — “Tesnya positif — seberapa yakin pasien ini benar sakit?” → Hitung PPV dengan prevalensi POPULASI PASIENMU via Bayes — bukan sens/spes mentah. Contoh: AI melanoma 95%/90% memberi PPV 70% di klinik kulit (prevalensi 20%) tetapi hanya 4,6% sebagai skrining apotek (prevalensi 0,5%) — dari 100 “positif”, 95 rujukan sia-sia.",
        "Skenario 2 — “Di mana menetapkan threshold?” → Baca kurva ROC lalu pilih dari biaya klinis: skrining butuh sensitivitas tinggi (toleransi false positive — SnNout), konfirmasi butuh spesifisitas tinggi (SpPin). Threshold default 0,5 adalah keputusan yang belum dipikirkan.",
        "Skenario 3 — “Tes ini valid untuk dipakai di tempatku?” → Validasi harus di populasi pemakaian — spectrum bias membuat performa di klinik rujukan tidak terbawa ke puskesmas/apotek. Minta laporan PPV/NPV pada prevalensi target, bukan cuma sens/spes.",
        "Skenario 4 — “Standar emas pembandingnya sendiri tidak sempurna?” → Curigai bias verifikasi (hanya yang positif tes yang dirujuk ke standar emas) dan “standar emas berkarat”. Jangan perbaiki dengan discrepant analysis yang naif — ia bias menguntungkan tes baru.",
        "Skenario 5 — “Satu tes belum cukup meyakinkan?” → Rantai tes: mulai dengan tes sensitif untuk menyingkirkan (rule-out), lanjutkan dengan tes spesifik untuk memastikan (rule-in); hitung PPV gabungannya. Dua tes biasa yang dirangkai benar mengalahkan satu tes mahal yang dipakai sembarangan.",
        "Aturan praktis 10 detik: positif → PPV di prevalensimu (Bayes) → threshold dari biaya klinis via ROC → validasi di populasi pemakaian → standar emas berkarat = waspadai bias verifikasi → belum yakin = rantai rule-out lalu rule-in.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengumumkan “tes 99% akurat” lalu deploy ke populasi prevalensi rendah — PPV-nya bisa di bawah 10% dan setiap “positif” justru mostly false alarm. Akurasi tanpa prevalensi adalah angka yatim piatu: benar secara teknis, menipu secara operasional.",
        type: "pitfall",
      },
      reference: "PPV butuh prevalensi; threshold dari biaya klinis; validasi di populasi pakai; rantai SnNout → SpPin.",
    },
    {
      id: "minicase-ai",
      eyebrow: "Langkah 5 · Mini-case",
      title: "AI deteksi kanker kulit: 95% sensitif, lalu?",
      prose: [
        "Startup mengklaim AI deteksi melanoma: sensitivitas 95%, spesifisitas 90%, diuji di klinik kulit (prevalensi 20%). PPV di sana = (0,95×0,2)/(0,95×0,2+0,1×0,8) ≈ 70% — cukup baik untuk alat bantu.",
        "Lalu dipasang sebagai skrining di apotek (prevalensi 0,5%). PPV = (0,95×0,005)/(0,95×0,005+0,1×0,995) ≈ 4,6%. Dari 100 yang “positif”, 95 dirujuk sia-sia — antrean dermatolog penuh, pasien panik, biaya membengkak. Klaim “95% akurat” tetap benar secara teknis — dan menipu secara operasional.",
        "Dua pelajaran: (1) validasi harus di populasi pemakaian (spectrum bias — performa di klinik rujukan ≠ di apotek); (2) laporkan PPV/NPV pada prevalensi target, bukan hanya sens/spes. Regulator yang baik meminta keduanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Deploy AI diagnostik ke populasi berbeda tanpa re-validasi = ribuan rujukan palsu. “Tesnya akurat” bukan pembelaan ketika desain deploy-nya yang salah.",
        type: "risk",
      },
      reference: "Validasi di populasi pemakaian. Laporkan PPV pada prevalensi target.",
    },
    {
      id: "standar-emas-berkarat",
      eyebrow: "Langkah 6 · Bias",
      title: "Ketika standar emas berkarat",
      prose: [
        "Seluruh lesson ini mengasumsikan ada “standar emas” — tes definitif yang menentukan siapa benar-benar sakit. Dunia nyata: standar emas sering berkarat. Biopsi pun punya false negative (sampling error); PCR punya batas deteksi; diagnosis psikiatri bahkan tidak punya standar emas sama sekali. Bila standar emas tak sempurna, sensitivitas/spesifisitas yang kamu hitung bukan sifat tes — melainkan sifat tes RELATIF terhadap standar yang cacat.",
        "Bias verifikasi (workup bias): standar emas yang mahal atau invasif hanya diberikan kepada yang tes awalnya positif. Contoh klasik: skrining kanker → hanya yang positif di-biopsi. Spesifisitas terlihat bagus (yang negatif tak pernah diverifikasi — false negative tak terhitung!), sensitivitas terlihat lebih tinggi dari aslinya. Perbaikan: verifikasi sampel acak dari yang negatif (koreksi Begg-Greenes), atau laporkan dengan kualifikasi eksplisit. Aturan: tanyakan selalu “siapa yang TIDAK mendapat standar emas, dan mengapa?”",
        "Spectrum bias — sudah disinggung di mini-case AI lesson ini, tapi mekanismenya layak ditegaskan: performa di satu spektrum pasien tidak sama dengan di spektrum lain. Tes yang divalidasi di RS rujukan (kasus berat, jelas) tampil lebih baik daripada di puskesmas (kasus ringan, ambigu) — bukan karena tesnya berubah, melainkan karena pasiennya. Solusi: validasi di populasi pemakaian; laporkan karakteristik spektrum (distribusi keparahan) bersama angka sensitivitas.",
        "Ketika standar emas tak ada: (a) composite reference standard — gabungan beberapa tes imperfect dengan aturan eksplisit (mis. 2 dari 3 positif); (b) latent class analysis — model statistik yang mengestimasi status penyakit laten TANPA standar emas, dari pola kesepakatan beberapa tes; (c) discrepant analysis — hanya yang hasilnya bertentangan diuji ulang (hati-hati: bias!). Untuk analis: bila laporan mengklaim “sensitivitas 99%” tanpa menyebut standar emasnya apa dan siapa yang tidak terverifikasi — angka itu belum bisa dipakai.",
        "Terakhir: tes berurutan. Skrining murah (sensitivitas tinggi) → konfirmasi mahal (spesifisitas tinggi). Odds pre untuk tes kedua = odds post tes pertama — kalikan likelihood ratio satu per satu. Contoh HIV: rapid test reaktif (LR+ ~50) pada prevalensi 0,1% (odds 1:999) → odds post 50:999 ≈ 4,8% → tes konfirmasi (LR+ ~100) → odds 5000:999 ≈ 83%. Dua tes mengubah 0,1% menjadi 83% — inilah logika algoritma tes nasional. Syarat: tes harus independen bersyarat (tidak mengukur hal yang sama persis) — bila tidak, perkalian LR melebih-lebihkan.",
      ],
      tasks: [],
      formula: String.raw`\text{odds}_{post} = \text{odds}_{pre} \times LR`,
      formulaNote: "odds_post = odds penyakit SETELAH hasil tes; odds_pre = odds SEBELUM tes = P/(1−P) dari prevalensi atau estimasi klinis; LR = likelihood ratio (LR+ untuk hasil positif = sens/(1−spes); LR− untuk hasil negatif = (1−sens)/spes). Interpretasi: tes tidak memberi probabilitas — ia MENGALIKAN odds. LR+ 50 pada odds pre 1:999 → odds post 50:999 ≈ 4,8% (inilah logika di balik PPV rendah pada prevalensi rendah). Untuk tes berurutan, kalikan LR satu per satu — dengan catatan independensi bersyarat.",
      note: {
        title: "Intuisi: tiga pertanyaan sebelum percaya angka tes",
        body: "Sebelum memakai angka sensitivitas/spesifisitas apa pun, tanyakan tiga hal — dan jangan lanjut sebelum ketiganya terjawab. Pertama: “di populasi seperti apa angka ini diukur?” — angka dari RS rujukan tidak berlaku di puskesmas; spektrum pasien adalah bagian dari spesifikasi tes, bukan catatan kaki. Kedua: “siapa yang tidak mendapat standar emas?” — bila yang negatif tak diverifikasi, spesifisitasnya dongeng; bila standar emasnya sendiri cacat, semua angka relatif. Ketiga: “berapa PPV pada prevalensi SAYA?” — hitung ulang dengan odds dan LR, jangan pinjam PPV publikasi. Heuristik praktisi: hafalkan tiga pasangan — SnNout (sensitivitas tinggi mengeksklusi), SpPin (spesifisitas tinggi mengonfirmasi), dan “prevalensi adalah separuh diagnosis” (tanpa pre-test probability, post-test probability tak berarti). Heuristik terakhir: bila sebuah tes diklaim “99% akurat” tanpa menyebut sensitivitas, spesifisitas, DAN prevalensi validasinya — itu iklan, bukan evidence. Dan bila ragu, gambar tabel 2×2-nya di kertas — angka yang tidak bisa masuk ke tabel 2×2 biasanya angka yang belum dipahami. Tiga pertanyaan + tiga pasangan ini mengubah analis dari pembaca brosur menjadi penilai tes.",
      },
      quiz: [
        {
          q: "Studi melaporkan spesifisitas 99% untuk tes skrining, tapi hanya pasien dengan skrining positif yang mendapat biopsi. Masalahnya?",
          options: [
            { text: "Bias verifikasi — false negative tak terhitung, spesifisitas terlihat lebih baik dari aslinya", why: "Benar: yang negatif tak diverifikasi → penyebut spesifisitas tidak lengkap.", correct: true },
            { text: "Tidak ada masalah — biopsi mahal", why: "Mahal bukan alasan; verifikasi sampel acak dari yang negatif solusinya." },
            { text: "Spectrum bias", why: "Ini soal siapa diverifikasi, bukan soal spektrum pasien." },
            { text: "Sampel terlalu kecil", why: "Bukan soal n — soal desain verifikasi yang timpang." },
          ],
        },
        {
          q: "Dua tes berurutan dengan LR+ 50 lalu 100, masing-masing mengukur antibodi yang berbeda. Odds pre 1:999. Odds post?",
          options: [
            { text: "≈ 5000:999 (≈83%) — kalikan berurutan karena independen bersyarat", why: "Benar: 1×50×100 : 999. Inilah logika algoritma konfirmasi HIV.", correct: true },
            { text: "≈ 50:999 — cukup satu tes", why: "Tes kedua menambah informasi; jangan dibuang." },
            { text: "≈ 150:999 — jumlahkan LR-nya", why: "LR dikalikan pada odds, bukan dijumlahkan." },
            { text: "Tidak bisa dihitung", why: "Bisa — justru ini cara yang benar." },
          ],
        },
      ],
      reference: "Tiga pertanyaan: populasi apa? siapa tak terverifikasi? PPV pada prevalensiku?",
    },
    {
      id: "lab-rantai-tes",
      eyebrow: "Langkah 7 · Lab",
      title: "Rantai dua tes: dari 0,1% ke 96%",
      prose: [
        "Skrining HIV: prevalensi 0,1%. Rapid test (sensitivitas 99%, spesifisitas 98%) reaktif → tes konfirmasi (sensitivitas 99,5%, spesifisitas 99,8%). Tugasmu: tulis fungsi `post_test(odds_pre, sens, spes)` yang mengembalikan probabilitas post-test via LR+, lalu rantai dua tes: `p_setelah_rapid` dan `p_setelah_konfirmasi`. Saksikan 0,1% menjadi 96% dalam dua langkah — tanpa satu pun “keajaiban”, hanya perkalian odds.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_setelah_rapid` (probabilitas setelah rapid reaktif)" },
        { id: "t2", text: "Hitung `p_setelah_konfirmasi` (probabilitas setelah konfirmasi positif)" },
      ],
      expected: "p_setelah_rapid≈0.047 p_setelah_konfirmasi≈0.961",
      note: {
        title: "Kaitan ke risk",
        body: "Konselor yang menyampaikan “rapid reaktif” sebagai “Anda positif HIV” (tanpa menjelaskan 4,7% vs 96%) menciptakan trauma dan stigma yang tidak perlu — sekaligus merusak kepercayaan pada program. Angka post-test tiap tahap adalah etika komunikasi, bukan sekadar matematika.",
        type: "risk",
      },
      hints: [
        "LR+ = sens/(1−spes). odds_pre = prev/(1−prev).",
        "odds_post = odds_pre × LR+; p = odds/(1+odds).",
        "Rapid: LR+ = 0,99/0,02 = 49,5. Konfirmasi: LR+ = 0,995/0,002 = 497,5.",
      ],
      code: {
        starter: `# Prevalensi 0,1%; rapid: sens 99% spes 98%; konfirmasi: sens 99,5% spes 99,8%
# TULIS KODEMU: fungsi post_test, lalu p_setelah_rapid & p_setelah_konfirmasi
p_setelah_rapid = 
p_setelah_konfirmasi = 
print(f"p_setelah_rapid={p_setelah_rapid:.3f} p_setelah_konfirmasi={p_setelah_konfirmasi:.3f}")`,
        lockLines: 1,
        solution: `# Prevalensi 0,1%; rapid: sens 99% spes 98%; konfirmasi: sens 99,5% spes 99,8%
# TULIS KODEMU: fungsi post_test, lalu p_setelah_rapid & p_setelah_konfirmasi
def post_test(odds_pre, sens, spes):
    lr = sens / (1 - spes)
    odds_post = odds_pre * lr
    return odds_post / (1 + odds_post)
odds_pre = 0.001 / 0.999
p_setelah_rapid = post_test(odds_pre, 0.99, 0.98)
odds1 = odds_pre * (0.99 / 0.02)
p_setelah_konfirmasi = post_test(odds1, 0.995, 0.998)
print(f"p_setelah_rapid={p_setelah_rapid:.3f} p_setelah_konfirmasi={p_setelah_konfirmasi:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_setelah_rapid", value: 0.047, tol: 0.002, label: "`p_setelah_rapid` seharusnya ≈ 0.047", msg: "Rapid reaktif pada prevalensi 0,1% = 4,7% — belum vonis." },
          { kind: "equal", task: "t2", name: "p_setelah_konfirmasi", value: 0.961, tol: 0.002, label: "`p_setelah_konfirmasi` seharusnya ≈ 0.961", msg: "Setelah konfirmasi: 96,1% — rantai dua tes mengubah segalanya." },
          { kind: "stdout_matches", task: "t2", pattern: "p_setelah_rapid=0\\.047 p_setelah_konfirmasi=0\\.961", label: "`print` menampilkan kedua probabilitas", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Rapid reaktif (post-test 4,7%) lalu pasien pulang tanpa konfirmasi. Kesalahan sistem apa ini?",
          options: [
            { text: "Rantai tes terputus — diagnosis tidak boleh berhenti di skrining", why: "Benar: algoritma tes berurutan wajib sampai konfirmasi; 4,7% ≠ diagnosis.", correct: true },
            { text: "Rapid test-nya rusak", why: "Rapid bekerja sesuai spesifikasinya — yang rusak alurnya." },
            { text: "Prevalensinya salah", why: "Prevalensi 0,1% benar untuk populasi skrining." },
            { text: "Tidak ada kesalahan", why: "Ada: pasien membawa status “reaktif” yang disalahartikan sebagai vonis." },
          ],
        },
      ],
      reference: "Tes mengalikan odds. Rantai tes = kalikan LR berurutan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Sensitivitas = P(positif|sakit); spesifisitas = P(negatif|sehat).",
        "PPV/NPV tergantung prevalensi — tes yang sama bisa 9% atau 92%.",
        "SnNout (rule-out), SpPin (rule-in).",
        "Threshold = keputusan klinis (biaya FP vs FN), bukan statistik semata.",
      ],
      next: { label: "HD10 — Kausalitas Observasional", href: "/v2/learn/hd10-kausal-observasional" },
      quiz: [
        {
          q: "Tes 99%/99% pada prevalensi 0,1%. PPV ≈ …",
          options: [
            { text: "9%", why: "Benar: 99/(99+999) — base-rate fallacy.", correct: true },
            { text: "99%", why: "Itu sensitivitas, bukan PPV." },
            { text: "50%", why: "Tidak ada dasar 50% — hitung dengan Bayes." },
            { text: "0,1%", why: "Itu prevalensi, bukan PPV." },
          ],
        },
        {
          q: "Untuk menyingkirkan diagnosis (rule-out), pilih tes dengan…",
          options: [
            { text: "Sensitivitas tinggi — hasil negatif bisa dipercaya (SnNout)", why: "Benar: sens tinggi → sedikit false negative.", correct: true },
            { text: "Spesifisitas tinggi", why: "Itu untuk rule-in (SpPin), bukan rule-out." },
            { text: "Akurasi tinggi", why: "Akurasi menyesatkan pada prevalensi ekstrem." },
            { text: "PPV tinggi", why: "PPV tergantung prevalensi — bukan sifat tes." },
          ],
        },
        {
          q: "AI 95%/90% pindah dari klinik (prev 20%) ke apotek (prev 0,5%). Yang terjadi?",
          options: [
            { text: "PPV anjlok (~70% → ~5%): banjir false positive", why: "Benar: spectrum/prevalensi berubah — validasi harus di populasi pemakaian.", correct: true },
            { text: "Sensitivitas turun", why: "Sensitivitas sifat tes — yang berubah PPV." },
            { text: "Tidak ada perubahan", why: "Ada: PPV sangat sensitif terhadap prevalensi." },
            { text: "Spesifisitas naik", why: "Spesifisitas juga sifat tes — tidak berubah." },
          ],
        },
        {
          q: "Memilih threshold skrining kanker sebaiknya…",
          options: [
            { text: "Prioritaskan sensitivitas — jangan lewatkan yang sakit; FP ditangani tes konfirmasi", why: "Benar: biaya false negative (kematian) >> biaya false positive (tes lanjutan).", correct: true },
            { text: "Maksimalkan akurasi", why: "Akurasi menyesatkan pada prevalensi rendah." },
            { text: "Pakai Youden index selalu", why: "Youden mengasumsikan FP=FN sama bobotnya — jarang benar secara klinis." },
            { text: "Threshold 0,5 default", why: "Default model bukan keputusan klinis." },
          ],
        },
      ],
    },
  ],
};
