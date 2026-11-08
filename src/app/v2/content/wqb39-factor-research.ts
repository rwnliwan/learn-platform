import type { V2Lesson } from "../lib/types";

export const wqb39: V2Lesson = {
  slug: "wqb39-factor-research",
  track: "WorldQuant Brain",
  module: "Strategi & Riset",
  title: "WQB39 — Factor Research: Dari Premia ke Alpha di WorldQuant Brain",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga faktor, satu yang signifikan, dan pertanyaan tentang sisanya",
      prose: [
        "Seorang peneliti menguji tiga faktor klasik sebagai kandidat alpha: value dengan premia bulanan 0,8 persen dan t-stat 2,4; momentum dengan premia 0,6 persen dan t-stat 1,8; size dengan premia 0,3 persen dan t-stat 0,9. Hanya value yang signifikan (|t| di atas 2). Premia tahunan sederhananya: value 9,6 persen, momentum 7,2 persen, size 3,6 persen. Tetapi peneliti itu tahu: premia yang signifikan di backtest belum tentu alpha yang bisa disubmit — ia harus bertahan setelah netralisasi, setelah biaya, dan setelah diperiksa korelasinya dengan alpha yang sudah ada.",
        "Lesson ini mengajarkan factor research dari sudut peneliti WorldQuant Brain: cara mengukur premia dan signifikansinya, cara membedakan faktor dari alpha, dan cara menerjemahkan faktor menjadi ekspresi FASTEXPR yang bisa diuji. PM-D7 mengajarkan factor investing dari sudut manajer portofolio; lesson ini mengajarkan riset faktornya — dari data mentah ke kandidat alpha.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "PM-D7 membahas factor investing secara penuh dari sudut portofolio — premia, timing, crowding, momentum crash — dan WQB28 membahas korelasi antar alpha dari sudut portofolio alpha. Tetapi tidak ada lesson WQB tentang riset faktor itu sendiri: mengukur premia, t-stat, IC, dan menerjemahkannya ke FASTEXPR. Lesson ini membangun sudut risetnya.",
      },
      reference: "Premia bulanan: value 0,8 persen (t 2,4), momentum 0,6 persen (t 1,8), size 0,3 persen (t 0,9). Tahunan value 9,6 persen. Signifikan: 1 dari 3.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa melakukan riset faktor dari data mentah sampai kandidat alpha.",
        "(1) Menghitung premia faktor bulanan dan tahunannya;",
        "(2) Membaca t-stat dan menentukan signifikansi faktor;",
        "(3) Menjelaskan information coefficient (IC) sebagai ukuran kekuatan sinyal;",
        "(4) Membedakan faktor dari alpha — premia vs nilai tambah setelah netralisasi;",
        "(5) Menerjemahkan faktor menjadi ekspresi FASTEXPR yang bisa diuji.",
      ],
      tasks: [],
    },
    {
      id: "premia-tstat",
      eyebrow: "Langkah 3 · Teori",
      title: "Premia dan t-stat: berapa, dan apakah nyata?",
      prose: [
        "Premia faktor adalah return rata-rata dari taruhan long-short faktor itu: beli saham dengan karakteristik faktor tertinggi, jual yang terendah. Value: beli murah (book-to-market tinggi), jual mahal — premia bulanan 0,8 persen. Momentum: beli pemenang 12 bulan, jual pecundang — 0,6 persen. Size: beli kecil, jual besar — 0,3 persen. Premia tahunan sederhana (bulanan dikali 12): value 9,6 persen, momentum 7,2 persen, size 3,6 persen.",
        "Tetapi premia tanpa signifikansi adalah angka yang bisa muncul dari kebetulan. t-stat mengukur apakah premia itu berbeda nyata dari nol: t sama dengan premia dibagi standard error-nya. Aturan praktis: |t| di atas 2 berarti signifikan pada tingkat 5 persen DALAM SATU pengujian yang direncanakan sebelumnya. Itu bukan bukti premia itu nyata — t-stat hanya berkata premia itu sulit dijelaskan oleh kebetulan dalam sampel ini; dan setelah banyak pengujian, t di atas 2 muncul dari kebetulan dengan mudah (lihat peringatan data mining di bawah). Value t 2,4: signifikan. Momentum t 1,8: tidak signifikan — premianya mungkin nyata, tetapi bukti belum cukup. Size t 0,9: jauh dari signifikan — premianya tidak bisa dibedakan dari noise.",
        "Satu peringatan: t-stat dari backtest yang sama yang dipakai untuk MENEMUKAN faktor adalah t-stat yang sudah dipilih — data mining. Peneliti yang menguji 100 faktor dan melaporkan satu dengan t 2,4 sedang melaporkan pemenang dari undian yang berulang. Obatnya: validasi out-of-sample (periode atau universe yang berbeda), dan ambang t yang lebih ketat (Harvey, Liu, dan Zhu mengusulkan 3,0 untuk faktor yang ditemukan lewat banyak pengujian).",
      ],
      tasks: [],
      note: {
        title: "Premia tahunan sederhana vs compounding",
        body: "Premia tahunan di lesson ini memakai perkalian sederhana (0,8 persen dikali 12 = 9,6 persen) — konvensi pelaporan faktor yang umum. Compounding (1,008 pangkat 12 dikurangi 1 = 10,0 persen) sedikit lebih besar. Keduanya sah; yang penting adalah konsisten dan menyebut metodenya.",
      },
      reference: "Premia tahunan: value 9,6 persen, momentum 7,2 persen, size 3,6 persen. Signifikan (|t| di atas 2): value saja.",
    },
    {
      id: "ic-alpha",
      eyebrow: "Langkah 4 · Teori",
      title: "IC dan bedanya faktor dengan alpha",
      prose: [
        "Information coefficient (IC) adalah korelasi rank antara skor faktor dan return periode berikut — ukuran seberapa baik faktor itu meramal, bukan seberapa besar return-nya. IC 0,05 berarti korelasi 5 persen — kecil, tetapi di dunia alpha, IC 0,05 yang konsisten adalah sinyal yang berharga, karena ia diterapkan pada ribuan saham setiap hari. IC yang diukur sekali tidak berarti apa-apa; IC yang diukur tiap bulan selama lima tahun dan rata-ratanya 0,05 dengan t-stat tinggi adalah sinyal yang nyata.",
        "Faktor bukan alpha. Faktor adalah premia yang diketahui semua orang — value, momentum, size — dan return-nya adalah kompensasi risiko yang ditanggung. Alpha adalah return di ATAS faktor: apa yang tersisa setelah return dijelaskan oleh faktor-faktor yang diketahui. Di WorldQuant Brain, ini berarti netralisasi: alpha yang berkorelasi tinggi dengan faktor value bukanlah alpha value yang baru — ia adalah faktor value yang dikemas ulang, dan self-correlation-nya akan ketahuan (lihat WQB13).",
        "Menerjemahkan faktor ke FASTEXPR berarti menulis karakteristiknya sebagai data field dan operator. Value: rank dari book-to-market (atau earnings yield). Momentum: rank dari return 12 bulan dikurangi return 1 bulan terakhir (menghindari reversal jangka pendek). Size: rank negatif dari kapitalisasi pasar. Ketiganya adalah satu baris FASTEXPR — tetapi satu baris itu harus diuji seperti alpha lainnya: Sharpe, fitness, turnover, decay, sub-universe, dan self-correlation (lihat WQB11 sampai WQB13). Faktor yang tidak lolos gerbang itu bukan alpha, berapa pun besar premianya di paper.",
      ],
      tasks: [],
      note: {
        title: "Faktor zoo: 400 faktor dan terus bertambah",
        body: "Literatur mencatat lebih dari 400 faktor yang diklaim — 'factor zoo'. Sebagian besar adalah variasi dari sedikit faktor inti, atau hasil data mining. Peneliti yang baik tidak menambah faktor ke-401; ia memeriksa apakah 'faktor baru'-nya berbeda nyata dari yang sudah ada — lewat korelasi dan regresi terhadap faktor inti.\n\nTiga faktor sebagai FASTEXPR (contoh konkret): Value: rank dari book-to-market — rank(book_to_price). Momentum: rank dari return 12 bulan dikurangi 1 bulan terakhir — rank(returns_12m - returns_1m). Size: rank negatif dari kapitalisasi pasar — rank(-market_cap). Ketiganya ilustratif — nama field-nya menyesuaikan data yang tersedia di platformmu — tetapi polanya tetap: satu baris yang mengubah karakteristik menjadi skor yang bisa diuji seperti alpha lainnya (Sharpe, fitness, turnover, decay, sub-universe, self-correlation).\n\nTiga faktor sebagai FASTEXPR (contoh konkret): Value: rank dari book-to-market — rank(book_to_price). Momentum: rank dari return 12 bulan dikurangi 1 bulan terakhir — rank(returns_12m - returns_1m). Size: rank negatif dari kapitalisasi pasar — rank(-market_cap). Ketiganya ilustratif — nama field-nya menyesuaikan data yang tersedia di platformmu — tetapi polanya tetap: satu baris yang mengubah karakteristik menjadi skor yang bisa diuji seperti alpha lainnya (Sharpe, fitness, turnover, decay, sub-universe, self-correlation).",
      },
      reference: "IC 0,05 yang konsisten adalah sinyal berharga. Faktor = premia yang diketahui; alpha = return di atas faktor setelah netralisasi.",
    },
    {
      id: "lab-faktor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: premia tahunan dan signifikansi faktor",
      prose: [
        "Lab ini menghitung tiga angka riset faktor: premia tahunan value, jumlah faktor yang signifikan, dan premia tahunan momentum. Hitung dulu di kepala. Premia tahunan value: 0,8 dikali 12 sama dengan 9,6 persen. Faktor signifikan (|t| di atas 2): value saja (t 2,4) — 1 dari 3. Premia tahunan momentum: 0,6 dikali 12 sama dengan 7,2 persen.",
        "Tugas lab: isi tiga variabel — ann_value, signifikan, ann_mom — lalu cetak ketiganya. Tiga angka ini adalah ringkasan riset faktor: berapa premianya, berapa yang terbukti nyata, dan berapa premia runner-up-nya.",
        "Setelah lolos, coba eksperimen: naikkan t-stat momentum menjadi 2,1 dan lihat signifikan menjadi 2 — lalu tanyakan: apakah momentum tiba-tiba menjadi alpha yang bisa disubmit? Jawabannya: belum — signifikansi adalah gerbang pertama, bukan terakhir. Ia masih harus lolos netralisasi, biaya, dan self-correlation.",
      ],
      tasks: [
        { id: "t1", text: "Hitung premia tahunan value (persen)" },
        { id: "t2", text: "Hitung jumlah faktor signifikan (|t| di atas 2)" },
        { id: "t3", text: "Hitung premia tahunan momentum (persen)" },
      ],
      expected: "ann_value=9.6\nsignifikan=1\nann_mom=7.2",
      hints: [
        "Premia tahunan sederhana = premia bulanan dikali 12.",
        "Signifikan bila nilai absolut t-stat di atas 2.",
        "Hitung satu per satu: value t 2,4; momentum t 1,8; size t 0,9.",
      ],
      code: {
        starter: "# Riset faktor: premia bulanan (persen) dan t-stat. JANGAN UBAH.\npremia = {\"value\": 0.8, \"momentum\": 0.6, \"size\": 0.3}\ntstat = {\"value\": 2.4, \"momentum\": 1.8, \"size\": 0.9}\n\n# TULIS KODEMU: premia tahunan value, jumlah signifikan, premia tahunan momentum\nann_value = \nsignifikan = \nann_mom = \nprint(f\"ann_value={round(ann_value, 1)}\")\nprint(f\"signifikan={signifikan}\")\nprint(f\"ann_mom={round(ann_mom, 1)}\")",
        lockLines: 4,
        solution: "# Riset faktor: premia bulanan (persen) dan t-stat. JANGAN UBAH.\npremia = {\"value\": 0.8, \"momentum\": 0.6, \"size\": 0.3}\ntstat = {\"value\": 2.4, \"momentum\": 1.8, \"size\": 0.9}\n\n# TULIS KODEMU: premia tahunan value, jumlah signifikan, premia tahunan momentum\nann_value = premia[\"value\"] * 12\nsignifikan = sum(1 for t in tstat.values() if abs(t) > 2)\nann_mom = premia[\"momentum\"] * 12\nprint(f\"ann_value={round(ann_value, 1)}\")\nprint(f\"signifikan={signifikan}\")\nprint(f\"ann_mom={round(ann_mom, 1)}\")",
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ann_value=9.6", label: "Premia tahunan value 9,6 persen", msg: "0,8 x 12 = 9,6 (sederhana, bukan compounding)." },
          { kind: "stdout_matches", task: "t2", pattern: "signifikan=1", label: "Signifikan: 1 dari 3", msg: "Hanya value (t 2,4) di atas ambang 2. Momentum 1,8 dan size 0,9 belum cukup bukti." },
          { kind: "stdout_matches", task: "t3", pattern: "ann_mom=7.2", label: "Premia tahunan momentum 7,2 persen", msg: "0,6 x 12 = 7,2. Premia ada, tetapi signifikansinya belum cukup." },
        ],
      },
      reference: "Premia tahunan value 9,6 persen; signifikan 1 dari 3; momentum 7,2 persen.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: faktor ke-401 yang ternyata faktor pertama",
      prose: [
        "Seorang peneliti menemukan 'faktor baru' — rasio kas terhadap utang — dengan premia bulanan 0,7 persen dan t-stat 2,6. Ia hampir submit sebagai alpha. Tetapi sebelum submit, ia menjalankan regresi faktor barunya terhadap value, momentum, dan size — dan menemukan korelasi 0,85 dengan value. 'Faktor baru'-nya adalah value dengan nama lain: perusahaan dengan kas tinggi relatif terhadap utang cenderung perusahaan murah. Self-correlation terhadap alpha value yang sudah disubmitnya adalah 0,82 — di atas gerbang 0,7. Ia membuangnya.",
        "Keputusan itu menghemat satu slot submit dan satu penolakan. Pelajaran yang dicatat: sebelum mengklaim faktor baru, regresikan terhadap faktor yang sudah ada. R-kuadrat di atas 0,5 adalah aturan praktis yang kasar, bukan garis hukum: faktor baru dengan korelasi 0,85 terhadap value tetap value dengan nama lain berapa pun R-kuadratnya, dan faktor dengan R-kuadrat 0,3 tetapi korelasi rendah dengan semua faktor inti masih bisa menarik. Yang menentukan adalah apakah ia menambah penjelasan di luar faktor yang sudah ada — lewat korelasi dan regresi, bukan satu angka ambang. Dan di WorldQuant Brain, alpha yang merupakan faktor lama yang dikemas ulang akan ditolak oleh self-correlation — lebih baik mengetahuinya sendiri sebelum sistem yang memberitahumu.",
        "Sejak itu, tim itu menambahkan satu langkah ke riset faktornya: setiap kandidat baru wajib dilaporkan bersama korelasinya dengan lima faktor inti dan self-correlation terhadap alpha yang sudah ada. Langkah itu memakan waktu satu jam per kandidat — dan menghemat rata-rata tiga slot submit yang sia-sia per kuartal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, klaim baru diuji terhadap yang sudah ada — regresi, bukan antusiasme. Kedua, self-correlation diperiksa sebelum submit, bukan sesudah. Ketiga, prosedur itu dijadikan langkah permanen, bukan pemeriksaan sekali.",
      },
      reference: "Faktor 'baru' korelasi 0,85 dengan value; self-correlation 0,82 — di atas gerbang 0,7. Dibuang.",
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
        "Premia: return long-short faktor; tahunan sederhana = bulanan dikali 12.",
        "Lab: premia tahunan value 9,6 persen; signifikan 1 dari 3; momentum 7,2 persen.",
        "Signifikan bila |t| di atas 2; waspadai data mining dan ambang 3,0.",
        "IC 0,05 yang konsisten adalah sinyal berharga.",
        "Faktor bukan alpha — alpha adalah return di atas faktor setelah netralisasi.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Premia bulanan: value 0,8 persen (t 2,4), momentum 0,6 persen (t 1,8), size 0,3 persen (t 0,9). Berapa premia tahunan value dan berapa faktor yang signifikan?",
          options: [
            { text: "9,6 persen dan 1 dari 3", why: "Tepat: 0,8 x 12 = 9,6; hanya value dengan |t| di atas 2.", correct: true },
            { text: "9,6 persen dan 3 dari 3 — semua premia positif", why: "Salah: premia positif bukan signifikan. Signifikansi diukur t-stat, bukan tanda premia." },
            { text: "10,0 persen dan 1 dari 3 — memakai compounding", why: "Salah: lesson ini memakai annualisasi sederhana (x12) = 9,6. Compounding 10,0 adalah metode lain." },
            { text: "9,6 persen dan 2 dari 3 — momentum ikut", why: "Salah: momentum t 1,8 di bawah ambang 2." },
          ],
        },
        {
          q: "Seorang peneliti menguji 100 faktor dan melaporkan satu dengan t-stat 2,4. Apa masalahnya?",
          options: [
            { text: "Tidak ada — t 2,4 berarti signifikan", why: "Salah: t-stat dari 100 pengujian yang dipilih pemenangnya adalah data mining. Ambang yang benar lebih ketat (sekitar 3,0)." },
            { text: "Data mining — pemenang dari 100 undian tidak sama dengan bukti; butuh validasi out-of-sample dan ambang lebih ketat", why: "Tepat: Harvey, Liu, dan Zhu mengusulkan 3,0 untuk faktor yang ditemukan lewat banyak pengujian.", correct: true },
            { text: "t-stat 2,4 terlalu kecil untuk faktor apa pun", why: "Salah: 2,4 signifikan untuk SATU pengujian yang direncanakan sebelumnya — masalahnya adalah banyaknya pengujian." },
            { text: "Premianya pasti negatif", why: "Salah: tidak ada hubungan antara banyaknya pengujian dan tanda premia." },
          ],
        },
        {
          q: "IC sebuah faktor 0,05 yang konsisten selama lima tahun. Apa bacaan yang benar?",
          options: [
            { text: "Terlalu kecil untuk dipakai", why: "Salah: IC 0,05 yang konsisten pada ribuan saham adalah sinyal berharga." },
            { text: "Sinyal berharga — korelasi kecil yang konsisten diterapkan pada ribuan saham setiap hari", why: "Tepat: IC diukur dari konsistensi, bukan dari besarnya sekali.", correct: true },
            { text: "Sinyal sempurna — IC 0,05 berarti akurasi 95 persen", why: "Salah: IC adalah korelasi, bukan akurasi. 0,05 berarti korelasi 5 persen." },
            { text: "Tidak ada arti tanpa tahu premianya", why: "Salah: IC dan premia mengukur hal berbeda — kekuatan prediksi vs besaran return. Keduanya berguna." },
          ],
        },
        {
          q: "Faktor 'baru' berkorelasi 0,85 dengan value dan self-correlation 0,82 terhadap alpha value yang sudah ada. Apa keputusan yang benar?",
          options: [
            { text: "Submit sebagai alpha baru — premianya berbeda", why: "Salah: korelasi 0,85 berarti ia value dengan nama lain; self-correlation 0,82 di atas gerbang 0,7." },
            { text: "Buang — ia faktor lama yang dikemas ulang", why: "Tepat: R-kuadrat tinggi terhadap faktor inti berarti bukan penemuan baru.", correct: true },
            { text: "Submit dengan nama berbeda agar lolos", why: "Salah: mengganti nama tidak mengubah korelasi — sistem akan menolaknya." },
            { text: "Gabungkan dengan value agar premianya berlipat", why: "Salah: menggabungkan dua hal yang sama tidak melipatgandakan premia — ia melipatgandakan eksposur yang sama." },
          ],
        },
        {
          q: "Apa bedanya faktor dan alpha?",
          options: [
            { text: "Tidak ada bedanya — keduanya return", why: "Salah: faktor adalah premia yang diketahui; alpha adalah return di atas faktor setelah netralisasi." },
            { text: "Faktor adalah premia yang diketahui semua orang; alpha adalah return di atas faktor", why: "Tepat: alpha yang berkorelasi tinggi dengan faktor bukanlah alpha baru.", correct: true },
            { text: "Faktor untuk saham besar; alpha untuk saham kecil", why: "Salah: ukuran bukan pembedanya." },
            { text: "Faktor dihitung bulanan; alpha dihitung harian", why: "Salah: frekuensi bukan pembedanya." },
          ],
        },
      ],
    },
  ],
};
