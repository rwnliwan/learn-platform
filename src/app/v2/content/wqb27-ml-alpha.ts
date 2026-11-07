import type { V2Lesson } from "../lib/types";

const FIG_WALKFORWARD = `<svg viewBox="0 0 600 300" role="img" aria-label="Diagram walk-forward dengan embargo.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Walk-forward: latih di masa lalu, uji di masa depan (+ embargo)</text>
<rect x="60" y="60" width="180" height="34" fill="var(--c1)" opacity="0.9"/>
<text x="150" y="82" font-size="11" fill="var(--chart-text)" text-anchor="middle">TRAIN (paruh awal)</text>
<rect x="240" y="60" width="36" height="34" fill="var(--c3)" opacity="0.9"/>
<text x="258" y="82" font-size="9" fill="var(--chart-text)" text-anchor="middle">jeda</text>
<rect x="276" y="60" width="180" height="34" fill="var(--c2)" opacity="0.9"/>
<text x="366" y="82" font-size="11" fill="var(--chart-text)" text-anchor="middle">TEST (paruh akhir)</text>
<rect x="60" y="130" width="396" height="34" fill="var(--c4)" opacity="0.25"/>
<text x="150" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">TRAIN</text>
<text x="366" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">TEST — tanpa jeda</text>
<line x1="258" y1="130" x2="258" y2="164" stroke="#e11d48" stroke-width="2"/>
<text x="258" y="186" font-size="10" fill="#e11d48" text-anchor="middle">bocor: return 5-hari tumpang tindih</text>
<text x="60" y="220" font-size="11" fill="var(--chart-text)">Atas: split jujur — jeda sepanjang horizon return.</text>
<text x="60" y="240" font-size="11" fill="var(--chart-text)">Bawah: split tanpa jeda — “out-of-sample” yang bocor.</text>
<text x="60" y="272" font-size="11" fill="var(--chart-text)" font-style="italic">Parameter HANYA boleh dipilih dari TRAIN. Test disentuh sekali.</text>
</g>
</svg>`;

export const wqb27: V2Lesson = {
  slug: "wqb27-ml-alpha",
  track: "WorldQuant Brain",
  module: "Riset Kuantitatif",
  title: "WQB27 — Machine Learning untuk Alpha: Validasi yang Jujur",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang “mengalahkan” FastExpression — di kertas",
      prose: [
        "Sinta, konsultan dua tahun, frustrasi. FastExpression-nya mentok di Sharpe 1,1 — di bawah ambang 1,25. Seorang teman menyarankan: “Pakai ML saja — gradient boosting bisa menangkap interaksi yang operator biasa tidak bisa.” Sinta melatih model di laptopnya atas 2 tahun data. Hasil in-sample: IC 0,31. Tiga kali lipat sinyal manual terbaiknya. Ia hampir membuka botol sampanye.",
        "Lalu ia melakukan satu hal yang benar: mengunci model itu, lalu mengujinya di 6 bulan data yang belum pernah dipakai memilih apa pun. IC out-of-sample: 0,02. Model “ajaib” itu ternyata menghafal noise dua tahun — dan noise tidak mengulang dirinya.",
        "Twist-nya bukan “ML tidak berguna”. Twist-nya: ML adalah kaca pembesar — ia memperbesar sinyal DAN memperbesar kebohongan. Tanpa validasi yang jujur, ML hanya cara mahal untuk overfitting lebih cepat. Lesson ini tentang kapan ML membantu riset alpha, dan cara membuktikannya sebelum percaya.",
      ],
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Feature engineering dari field Brain — lalu validasi walk-forward",
      prose: [
        "Di Brain, “fitur” untuk ML biasanya berasal dari field yang sama dengan FastExpression: transformasi harga-volume, fundamental, analis, news. Feature engineering yang sehat = fitur yang bisa dihitung point-in-time (tanpa look-ahead) dan punya alasan ekonomi kenapa ia memprediksi — “momentum 20 hari” punya cerita; “kombinasi acak 17 field” tidak.",
        "Model pembanding yang jujur dimulai dari yang paling sederhana: regresi linear. Bobotnya punya rumus tertutup (normal equation) — tidak ada hyperparameter untuk diutak-atik, tidak ada tempat bersembunyi bagi overfitting. Kalau regresi linear saja tidak mengalahkan baseline FastExpression-mu out-of-sample, model kompleks hampir pasti hanya menambah masalah.",
        "Validasi walk-forward: latih di paruh awal, uji di paruh akhir — sekali, tanpa iterasi. Tambahkan embargo (jeda) sepanjang horizon return di batas split agar return multi-hari tidak tumpang tindih. Dan aturan yang paling sering dilanggar: hyperparameter, pilihan fitur, bahkan pilihan model HANYA boleh diputuskan dari data train. Test disentuh tepat sekali — untuk vonis akhir.",
        "Kapan ML membantu? Tiga kondisi: (1) kamu punya hipotesis interaksi non-linear yang spesifik; (2) data cukup banyak relatif terhadap kompleksitas model; (3) validasi out-of-sample bertahan. Kalau satu saja tidak terpenuhi, FastExpression yang sederhana biasanya menang — lebih transparan, lebih cepat diuji, lebih mudah didiagnosis saat gagal.",
      ],
      formula: String.raw`\mathbf{w} = (X^T X)^{-1} X^T \mathbf{y} \qquad \hat{y}_{test} = X_{test}\mathbf{w}`,
      formulaNote: "w = vektor bobot model; X = matriks fitur train (tiap baris satu observasi); y = target (return ke depan); X^T = transpose. Rumus ini = solusi kuadrat terkecil: bobot yang meminimalkan jumlah kuadrat error di data train. y_topi_test = prediksi untuk data uji — yang dinilai IC-nya, bukan IC train.",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“Model kompleks = alpha lebih baik.” Di data keuangan yang noise-nya besar, kompleksitas adalah liabilitas sampai terbukti sebaliknya. Urutan pembuktian yang benar: baseline sederhana dulu, lalu model kompleks harus MENGALAHKANNYA out-of-sample dengan margin yang jelas — bukan sekadar in-sample.",
      },
      tasks: [],
    },
    {
      id: "lab-ml",
      eyebrow: "Langkah 3 · Lab",
      title: "Regresi linear vs dirinya sendiri: uji kejujuran",
      prose: [
        "Tulis tiga fungsi: `ols_weights(X, y)` — bobot regresi via normal equation 2×2 (invers matriks 2×2 eksplisit, tanpa library); `predict(X, w)`; dan pakai `spearman` dari lesson sebelumnya (tulis ulang versi ringkas di sini — lesson ini self-contained).",
        "Latih di 10 observasi, uji di 4 observasi yang belum pernah dipakai. Hitung IC in-sample (prediksi train vs y train) dan IC out-of-sample (prediksi test vs y test). Vonis: MEMBANTU bila IC OOS ≥ setengah IC IS DAN positif; selain itu TIDAK CUKUP.",
        "Eksperimen setelah selesai: latih ulang memakai SEMUA 14 observasi lalu hitung IC “out-of-sample” di 4 yang sama — angkanya membaik. Itulah ilusi yang kamu beli saat memilih model dari data test. (Petunjuk: improvement itu bukan skill — itu kebocoran.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis ols_weights (normal equation 2x2) dan predict" },
        { id: "t2", text: "Hitung IC in-sample & out-of-sample, cetak vonisnya" },
      ],
      expected: "w1=0.6261 w2=-0.3813\nIC_IS=0.9879 IC_OOS=1.0000 -> MEMBANTU",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“IC in-sample 0,99 — modelnya bagus.” In-sample 0,99 pada 10 observasi dengan 2 fitur hampir tidak memberi informasi — model linear SELALU bisa menghafal sedikit data. Satu-satunya angka yang boleh dipercaya adalah IC dari data yang tidak ikut memilih apa pun.",
      },
      hints: [
        "Invers 2x2: untuk [[a,b],[b,c]], determinan = ac-b²; invers = 1/det × [[c,-b],[-b,a]].",
        "spearman: peringkatkan x dan y, lalu korelasi Pearson atas peringkatnya.",
      ],
      code: {
        starter: "# Data latih (10) dan uji (4). JANGAN UBAH.\nX_train = [[-0.5,0.2],[-0.3,-0.4],[-0.1,0.3],[0.1,-0.1],[0.3,0.5],[0.5,-0.3],[-0.4,0.1],[0.2,0.4],[-0.2,-0.5],[0.4,0.0]]\ny_train = [-0.36,-0.05,-0.17,0.14,-0.04,0.45,-0.29,-0.02,0.04,0.25]\nX_test = [[-0.35,0.35],[0.15,-0.2],[0.45,-0.4],[-0.25,0.3]]\ny_test = [-0.3,0.11,0.45,-0.3]\n\n# TULIS KODEMU\ndef ols_weights(X, y):\n    return\ndef predict(X, w):\n    return\ndef spearman(x, y):\n    return\n\nw = ols_weights(X_train, y_train)\nfit = predict(X_train, w)\npred = predict(X_test, w)\nic_is = spearman(fit, y_train)\nic_oos = spearman(pred, y_test)\nvonis = \"MEMBANTU\" if (ic_oos >= 0.5*ic_is and ic_oos > 0) else \"TIDAK CUKUP\"\nprint(f\"w1={w[0]:.4f} w2={w[1]:.4f}\")\nprint(f\"IC_IS={ic_is:.4f} IC_OOS={ic_oos:.4f} -> {vonis}\")\n",
        lockLines: 5,
        solution: "# Data latih (10) dan uji (4). JANGAN UBAH.\nX_train = [[-0.5,0.2],[-0.3,-0.4],[-0.1,0.3],[0.1,-0.1],[0.3,0.5],[0.5,-0.3],[-0.4,0.1],[0.2,0.4],[-0.2,-0.5],[0.4,0.0]]\ny_train = [-0.36,-0.05,-0.17,0.14,-0.04,0.45,-0.29,-0.02,0.04,0.25]\nX_test = [[-0.35,0.35],[0.15,-0.2],[0.45,-0.4],[-0.25,0.3]]\ny_test = [-0.3,0.11,0.45,-0.3]\n\n# TULIS KODEMU\ndef ols_weights(X, y):\n    s11 = sum(r[0]*r[0] for r in X)\n    s12 = sum(r[0]*r[1] for r in X)\n    s22 = sum(r[1]*r[1] for r in X)\n    t1 = sum(r[0]*v for r, v in zip(X, y))\n    t2 = sum(r[1]*v for r, v in zip(X, y))\n    det = s11*s22 - s12*s12\n    w1 = (s22*t1 - s12*t2)/det\n    w2 = (s11*t2 - s12*t1)/det\n    return (w1, w2)\ndef predict(X, w):\n    return [w[0]*r[0] + w[1]*r[1] for r in X]\ndef spearman(x, y):\n    def ranks(v):\n        order = sorted(range(len(v)), key=lambda i: v[i])\n        r = [0]*len(v)\n        for pos, i in enumerate(order):\n            r[i] = pos+1\n        return r\n    rx, ry = ranks(x), ranks(y)\n    n = len(x)\n    mx, my = sum(rx)/n, sum(ry)/n\n    num = sum((a-mx)*(b-my) for a, b in zip(rx, ry))\n    den = (sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))**0.5\n    return num/den if den else 0.0\n\nw = ols_weights(X_train, y_train)\nw1, w2 = w[0], w[1]\nfit = predict(X_train, w)\npred = predict(X_test, w)\nic_is = spearman(fit, y_train)\nic_oos = spearman(pred, y_test)\nvonis = \"MEMBANTU\" if (ic_oos >= 0.5*ic_is and ic_oos > 0) else \"TIDAK CUKUP\"\nprint(f\"w1={w[0]:.4f} w2={w[1]:.4f}\")\nprint(f\"IC_IS={ic_is:.4f} IC_OOS={ic_oos:.4f} -> {vonis}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "w1", value: 0.6261, tol: 0.001, label: "`w1` sekitar 0,6261", msg: "Bobot fitur pertama dari normal equation." },
          { kind: "equal", task: "t1", name: "w2", value: -0.3813, tol: 0.001, label: "`w2` sekitar -0,3813", msg: "Bobot fitur kedua dari normal equation." },
          { kind: "equal", task: "t2", name: "ic_is", value: 0.9879, tol: 0.001, label: "`ic_is` sekitar 0,9879", msg: "IC in-sample — tinggi, tetapi belum berarti apa-apa." },
          { kind: "equal", task: "t2", name: "ic_oos", value: 1.0, tol: 0.001, label: "`ic_oos` = 1,0", msg: "IC out-of-sample bertahan sempurna di data mainan ini." },
          { kind: "stdout_matches", task: "t2", label: "Vonis = MEMBANTU", msg: "IC OOS ≥ setengah IC IS dan positif.", pattern: "IC_IS=0\\.9879 IC_OOS=1\\.0000 -> MEMBANTU" },
        ],
      },
      reference: "Model sederhana yang jujur mengalahkan model canggih yang berbohong.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 4 · Chart",
      title: "Membaca split yang jujur vs yang bocor",
      prose: [
        "Diagram ini membandingkan dua cara split train-test untuk return 5-harian.",
        "Cara membaca: blok biru = data latih, blok ungu = data uji, blok merah muda = jeda (embargo); garis merah menandai titik bocor.",
        "Interpretasi: pada split bawah, return 5-hari dari observasi terakhir train dan observasi pertama test berbagi 4 dari 5 hari yang sama — “out-of-sample”-nya menguji model atas data yang sebagian sudah ia lihat. Embargo sepanjang horizon return (split atas) menutup lubang ini. Aturan praktis: panjang jeda = horizon return yang kamu prediksi.",
      ],
      figure: { svg: FIG_WALKFORWARD, alt: "Diagram walk-forward dengan dan tanpa embargo", caption: "Split jujur memakai embargo sepanjang horizon return." },
      tasks: [],
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta: ML untuk alpha — lanjut atau kembali ke FastExpression?",
      prose: [
        "Skenario 1 — IC OOS ≥ 0,5 × IC IS dan positif, fitur point-in-time: lanjutkan. ML terbukti membantu; sekarang uji di Brain sebagai pembanding FastExpression.",
        "Skenario 2 — IC OOS runtuh (< 0,5 × IC IS) atau negatif: kembali ke FastExpression. Model menghafal noise; sederhanakan fitur atau terima sinyal manual yang lebih jujur.",
        "Skenario 3 — IC OOS bagus TETAPI fitur sulit diterjemahkan ke operator Brain: tahan. Alpha yang tidak bisa diimplementasikan = riset yang tidak bisa disubmit.",
        "Skenario 4 — ragu apakah fitur point-in-time: audit dulu. Geser fitur satu periode; kalau performa runtuh, ada look-ahead. Jangan lanjut sebelum ini bersih.",
        "Skenario 5 — model kompleks hanya sedikit mengalahkan regresi linear OOS: pilih regresi linear. Margin tipis tidak membayar biaya kompleksitas (sulit didiagnosis, lambat diuji).",
        "Aturan 10 detik: fitur jujur? Split ber-embargo? OOS bertahan? Bisa diimplementasikan? Empat ya = ML layak dibawa ke Brain.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Dua model di meja Sinta",
      prose: [
        "Sinta akhirnya menguji dua pendekatan dengan protokol yang benar (train 18 bulan, embargo 5 hari, test 6 bulan, test disentuh sekali). Model P (regresi linear, 3 fitur): IC IS 0,09, IC OOS 0,07. Model Q (gradient boosting, 40 fitur): IC IS 0,34, IC OOS 0,05.",
        "Pertanyaan 1: model mana yang lolos aturan vonis lab (IC OOS ≥ 0,5 × IC IS dan positif)?",
        "Pertanyaan 2: model mana yang sebaiknya dibawa ke Brain, dan kenapa?",
        "Pertanyaan 3: apa yang seharusnya Sinta lakukan terhadap 40 fitur model Q sebelum membuangnya?",
        "Pembahasan: (1) Model P: 0,07 ≥ 0,045 ✓ lolos. Model Q: 0,05 < 0,17 ✗ gagal. (2) Model P — sederhana, jujur, dan bisa diterjemahkan ke operator Brain; Q menghafal noise (IS 0,34 → OOS 0,05 adalah tanda tangan overfitting klasik). (3) Jangan buang mentah-mentah: sederhanakan — pilih 3–5 fitur dengan alasan ekonomi terkuat, latih ulang regresi linear, uji OOS sekali lagi. Kadang 3 fitur terbaik Q mengalahkan P.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi model",
      prose: [
        "Lima pertanyaan — jawab sebagai peneliti yang tidak mau dibohongi modelnya sendiri.",
      ],
      tasks: [],
      summary: [
        "Fitur ML untuk alpha harus point-in-time dan punya alasan ekonomi — bukan kombinasi acak.",
        "Baseline pertama = regresi linear (normal equation, tanpa hyperparameter untuk diutak-atik).",
        "Validasi walk-forward: train paruh awal, embargo sepanjang horizon return, test disentuh sekali.",
        "Hyperparameter, fitur, dan pilihan model HANYA dari train — memilih dari test = selection bias.",
        "Vonis MEMBANTU: IC OOS ≥ 0,5 × IC IS dan positif; model kompleks harus mengalahkan baseline sederhana.",
        "Alpha yang tidak bisa diterjemahkan ke operator Brain = riset yang tidak bisa disubmit.",
      ],
      quiz: [
        {
          q: "Kenapa regresi linear dipakai sebagai baseline pertama sebelum model kompleks?",
          options: [
            { text: "Tidak ada hyperparameter untuk diutak-atik — tidak ada tempat bersembunyi bagi overfitting", why: "Tepat — ia memaksa kejujuran: kalau ini saja gagal OOS, yang kompleks hampir pasti hanya menambah masalah.", correct: true },
            { text: "Karena regresi linear selalu lebih akurat dari model kompleks", why: "Tidak — kadang model kompleks memang menang; baseline soal kejujuran, bukan supremasi akurasi." },
            { text: "Karena Brain hanya menerima model linear", why: "Tidak ada batasan semacam itu — ini soal metodologi validasi." },
            { text: "Karena regresi linear tidak butuh data banyak", why: "Tetap butuh data cukup; keunggulannya adalah tidak ada hyperparameter." },
          ],
        },
        {
          q: "Apa yang salah dari: 'Saya coba 30 kombinasi hyperparameter, pilih yang IC test-nya tertinggi'?",
          options: [
            { text: "Selection bias — test sudah dipakai memilih, jadi bukan validasi yang jujur", why: "Tepat — 30 kesempatan beruntung; angka test itu sudah terkontaminasi keputusanmu.", correct: true },
            { text: "Tidak ada yang salah — itu namanya tuning yang rajin", why: "Rajin tetapi tidak jujur — tuning harus memakai data validasi terpisah, test tetap terkunci." },
            { text: "Salah karena 30 terlalu sedikit — harusnya 300", why: "Lebih banyak kombinasi = selection bias lebih parah, bukan lebih baik." },
            { text: "Salah karena hyperparameter tidak memengaruhi IC", why: "Justru memengaruhi — itulah masalahnya." },
          ],
        },
        {
          q: "Return yang diprediksi adalah return 5-harian. Berapa panjang embargo yang tepat di batas split?",
          options: [
            { text: "5 hari — sepanjang horizon return", why: "Tepat — observasi di kedua sisi batas tidak boleh berbagi hari return yang sama.", correct: true },
            { text: "1 hari — cukup untuk memisahkan train dan test", why: "Tidak cukup — return 5-hari masih tumpang tindih 4 hari." },
            { text: "Tidak perlu embargo bila split-nya acak", why: "Split acak untuk deret waktu justru lebih buruk — itu menghancurkan urutan waktu." },
            { text: "20 hari — semakin panjang semakin aman", why: "Berlebihan membuang data; yang dibutuhkan tepat sepanjang horizon." },
          ],
        },
        {
          q: "Model Q: IC IS 0,34 → IC OOS 0,05. Diagnosis yang paling tepat?",
          options: [
            { text: "Overfitting klasik — menghafal noise train, tidak general", why: "Tepat — keruntuhan IS→OOS sebesar ini adalah tanda tangannya.", correct: true },
            { text: "Underfitting — model kurang kompleks", why: "Terbalik — IS 0,34 menunjukkan model sangat mampu fit; masalahnya generalisasi." },
            { text: "Data test-nya yang rusak", why: "Menyalahkan data adalah pelarian — pola ini 99% masalah model, bukan data." },
            { text: "Pasar berubah — tidak ada yang bisa dilakukan", why: "Mungkin berkontribusi, tetapi diagnosis pertama tetap overfitting; buktinya dengan sederhanakan model." },
          ],
        },
        {
          q: "Kapan ML layak dibawa ke Brain sebagai pembanding FastExpression?",
          options: [
            { text: "Fitur point-in-time, OOS bertahan (≥0,5× IS), dan bisa diterjemahkan ke operator", why: "Tepat — tiga syarat kumulatif: jujur, bertahan, bisa diimplementasikan.", correct: true },
            { text: "Begitu IC in-sample mengalahkan sinyal manual", why: "In-sample bukan bukti — hanya OOS yang jujur yang dihitung." },
            { text: "Ketika FastExpression terasa membosankan", why: "Kebosanan bukan kriteria riset — ini cara mahal membuang waktu." },
            { text: "Selalu — ML modern pasti lebih baik dari operator manual", why: "Di data keuangan yang noisy, 'pasti' adalah kata yang berbahaya." },
          ],
        },
      ],
      reference: "Buktikan dulu di Python yang jujur, baru bicara di Brain.",
    },
  ],
};
