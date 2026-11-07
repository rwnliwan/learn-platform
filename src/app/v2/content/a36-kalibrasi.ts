import type { V2Lesson } from "../lib/types";

export const a36: V2Lesson = {
  slug: "a36-kalibrasi",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.6 Kalibrasi Probabilitas: PD 10% Harus Berarti 10%",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-cepatcair",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Tarif kompetitif yang rugi Rp200 miliar",
      prose: [
        "Multifinance CepatCair bangga: model PD baru mereka punya AUC 0,86 — tertinggi yang pernah ada. Tim pricing memakai PD model untuk menetapkan bunga: bunga = PD x LGD + margin. Tarif mereka jadi kompetitif — lebih murah dari pesaing. Penyaluran meledak.",
        "Setahun kemudian, audit menemukan lubang Rp200 miliar. Investigasi: model itu memang jago me-ranking (AUC 0,86), tapi probabilitasnya sistematis kekecilan 40 persen — PD 6 persen dari model ternyata default 10 persen di dunia nyata. Tarif yang kompetitif itu sebenarnya tarif bunuh diri: mereka menjual risiko Rp10 dengan harga Rp6.",
        "Tidak ada metrik di dashboard yang menangkap ini — karena dashboard hanya menampilkan AUC. Model yang sempurna me-ranking bisa bencana dalam pricing.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Fraud/ML Analytics, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pricing dari probabilitas yang tidak terkalibrasi adalah mispricing sistematis: setiap kontrak yang ditandatangani merugi sedikit, dikali ribuan kontrak menjadi lubang Rp200 miliar.",
      },
      reference: "AUC = sertifikat ranking. Kalibrasi = kejujuran angka. Pricing butuh yang kedua.",
    },
    {
      id: "lab-kurva",
      eyebrow: "Langkah 2 · Lab: kurva kalibrasi",
      title: "Binning: bandingkan prediksi vs aktual",
      prose: [
        "Model terkalibrasi sempurna jika P(Y=1 | prediksi = p) = p: dari semua yang diprediksi 10 persen, beneran default 10 persen. Kurva kalibrasi memplot rata-rata prediksi vs frekuensi aktual per bucket — diagonal = sempurna.",
        "Titik konsisten di atas diagonal = underconfident ke arah bawah: bilang 6 persen, kenyataan 10 persen — model sistematis meremehkan risiko (kasus CepatCair). Di bawah diagonal = overconfident: melebih-lebihkan.",
        "Di bawah: model sombong yang probabilitasnya dikali 0,6. Hitung bucket 0,1-0,2: rata-rata prediksi vs aktual.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `aktual1` = frekuensi default bucket 1" },
        { id: "t2", text: "Hitung `pred1` = rata-rata prediksi bucket 1, lalu `print`" },
      ],
      expected: "bucket1: pred=0.143 aktual=23.0%",
      note: {
        title: "Sering salah",
        body: "Membaca kurva kalibrasi tanpa memperhatikan n per bucket. Bucket sepi (n kecil) goyang secara alami — jangan diagnosa dari 42 observasi.",
      },
      hints: [
        "buckets[1] berisi pasangan (p, yi) untuk rentang 0,1-0,2.",
        "aktual = rata-rata yi; pred = rata-rata p.",
        "aktual1 = sum(yi for _, yi in buckets[1])/len(buckets[1])",
      ],
      code: {
        starter: `import random, math\nrandom.seed(21)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 5000\nskor = [random.gauss(0, 1) for _ in range(n)]\np_true = [sigmoid(-2.0 - 1.5*s) for s in skor]\ny = [1 if random.random() < p else 0 for p in p_true]\np_pred = [p*0.6 for p in p_true]   # model sombong: sistematis kekecilan\n\nbuckets = [[] for _ in range(10)]\nfor p, yi in zip(p_pred, y):\n    buckets[min(int(p*10), 9)].append((p, yi))\n\n# TULIS KODEMU: bucket 1 (0.1-0.2): rata2 prediksi vs frekuensi aktual\nb1 = buckets[1]\naktual1 = \npred1 = \n\nprint(f"bucket1: pred={pred1:.3f} aktual={aktual1:.1%}")`,
        lockLines: 13,
        solution: `import random, math\nrandom.seed(21)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 5000\nskor = [random.gauss(0, 1) for _ in range(n)]\np_true = [sigmoid(-2.0 - 1.5*s) for s in skor]\ny = [1 if random.random() < p else 0 for p in p_true]\np_pred = [p*0.6 for p in p_true]   # model sombong: sistematis kekecilan\n\nbuckets = [[] for _ in range(10)]\nfor p, yi in zip(p_pred, y):\n    buckets[min(int(p*10), 9)].append((p, yi))\n\n# TULIS KODEMU: bucket 1 (0.1-0.2): rata2 prediksi vs frekuensi aktual\nb1 = buckets[1]\naktual1 = sum(yi for _, yi in b1)/len(b1)\npred1 = sum(p for p, _ in b1)/len(b1)\n\nprint(f"bucket1: pred={pred1:.3f} aktual={aktual1:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "aktual1", value: 0.230, tol: 0.01, label: "`aktual1` sekitar 23.0%", msg: "Frekuensi default di bucket 0,1-0,2." },
          { kind: "equal", task: "t2", name: "pred1", value: 0.143, tol: 0.005, label: "`pred1` sekitar 0.143", msg: "Rata-rata prediksi di bucket yang sama." },
          { kind: "stdout_matches", task: "t2", pattern: "bucket1: pred=0\\.143\\s+aktual=23\\.0%", label: "`print` menampilkan gap kalibrasi", msg: "Aktual jauh di atas prediksi = underconfident." },
        ],
      },
      reference: "Diagonal = sempurna. Di atas = meremehkan. Di bawah = melebihkan.",
    },
    {
      id: "lab-brier-platt",
      eyebrow: "Langkah 3 · Lab: Brier & Platt",
      title: "Ukur miskalibrasi, lalu koreksi",
      prose: [
        "Tiga cara mengukur: ECE (expected calibration error) = rata-rata terbobot selisih prediksi vs aktual per bucket — ECE 0,04 berarti meleset 4 poin; Brier score = rata-rata kuadrat selisih (proper scoring rule — menghukum probabilitas bohong); uji Hosmer-Lemeshow — tapi terlalu sensitif di n raksasa (n=2 juta, ECE=0,008, p<0,001: signifikan tapi tidak material — percayai ECE + kurva).",
        "Platt scaling: fit sigmoid 1D (logit(p_cal) = a + b x logit(p_raw)) di data kalibrasi terpisah. Dua parameter — stabil untuk data sedikit. Keduanya monotonik: ranking dan AUC tidak berubah.",
        "Di bawah, Platt sudah di-fit di data terpisah (a=-1,359, b=0,429). Tugasmu menulis fungsi Brier dan mengukur perbaikan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `brier(ps, ys)`" },
        { id: "t2", text: "Hitung `brier_raw`, `brier_cal`, lalu `print`" },
      ],
      expected: "brier_raw=0.1505 brier_cal=0.1322",
      note: {
        title: "Sering salah",
        body: "Kalibrasi ulang di-fit di data latih model. Itu mencontek dua kali: model sudah overfit di sana sehingga Platt hanya mengoreksi kepedean palsu. Wajib pakai data kalibrasi terpisah.",
      },
      hints: [
        "Brier = rata-rata (p - y)^2.",
        "Bandingkan p_ev (mentah) vs p_cal (Platt) pada y_ev.",
        "def brier(ps, ys):\n    return sum((p-y)**2 for p, y in zip(ps, ys))/len(ps)",
      ],
      code: {
        starter: `import random, math\nrandom.seed(33)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 4000\nskor = [random.gauss(0, 1) for _ in range(n)]\np_true = [sigmoid(-2.0 - 1.5*s) for s in skor]\ny = [1 if random.random() < p else 0 for p in p_true]\np_raw = [min(p*1.7, 0.999) for p in p_true]   # model overconfident\n\np_fit, y_fit = p_raw[:2000], y[:2000]   # data kalibrasi TERPISAH\np_ev, y_ev = p_raw[2000:], y[2000:]\n\ndef logit(p): return math.log(p/(1-p))\na, b = 0.0, 1.0\nfor _ in range(500):\n    ga = gb = 0.0\n    for p, yi in zip(p_fit, y_fit):\n        pc = sigmoid(a + b*logit(p))\n        ga += (yi - pc); gb += (yi - pc)*logit(p)\n    a += 0.3*ga/len(p_fit); b += 0.3*gb/len(p_fit)\np_cal = [sigmoid(a + b*logit(p)) for p in p_ev]\n\n# TULIS KODEMU: fungsi Brier + skor sebelum/sesudah kalibrasi\ndef brier(ps, ys):\n\nbrier_raw = \nbrier_cal = \n\nprint(f"brier_raw={brier_raw:.4f} brier_cal={brier_cal:.4f}")`,
        lockLines: 28,
        solution: `import random, math\nrandom.seed(33)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 4000\nskor = [random.gauss(0, 1) for _ in range(n)]\np_true = [sigmoid(-2.0 - 1.5*s) for s in skor]\ny = [1 if random.random() < p else 0 for p in p_true]\np_raw = [min(p*1.7, 0.999) for p in p_true]   # model overconfident\n\np_fit, y_fit = p_raw[:2000], y[:2000]   # data kalibrasi TERPISAH\np_ev, y_ev = p_raw[2000:], y[2000:]\n\ndef logit(p): return math.log(p/(1-p))\na, b = 0.0, 1.0\nfor _ in range(500):\n    ga = gb = 0.0\n    for p, yi in zip(p_fit, y_fit):\n        pc = sigmoid(a + b*logit(p))\n        ga += (yi - pc); gb += (yi - pc)*logit(p)\n    a += 0.3*ga/len(p_fit); b += 0.3*gb/len(p_fit)\np_cal = [sigmoid(a + b*logit(p)) for p in p_ev]\n\n# TULIS KODEMU: fungsi Brier + skor sebelum/sesudah kalibrasi\ndef brier(ps, ys):\n    return sum((p-y)**2 for p, y in zip(ps, ys))/len(ps)\n\nbrier_raw = brier(p_ev, y_ev)\nbrier_cal = brier(p_cal, y_ev)\n\nprint(f"brier_raw={brier_raw:.4f} brier_cal={brier_cal:.4f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "brier", label: "`brier` terdefinisi", msg: "Tulis fungsi brier(ps, ys) di bagian kode editable." },
          { kind: "equal", task: "t2", name: "brier_raw", value: 0.1505, tol: 0.002, label: "`brier_raw` sekitar 0.1505", msg: "Brier probabilitas mentah pada data evaluasi." },
          { kind: "equal", task: "t2", name: "brier_cal", value: 0.1322, tol: 0.002, label: "`brier_cal` sekitar 0.1322", msg: "Brier setelah Platt — turun, artinya lebih jujur." },
          { kind: "stdout_matches", task: "t2", pattern: "brier_raw=0\\.1505\\s+brier_cal=0\\.1322", label: "`print` menampilkan perbaikan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ECE = meleset rata-rata (poin). Brier = proper scoring rule. Platt di data terpisah.",
    },
    {
      id: "koreksi-prior",
      eyebrow: "Langkah 4 · Koreksi prior",
      title: "Sampel yang diperkaya merusak probabilitas",
      prose: [
        "Model dilatih di sampel 50:50 padahal populasi default 2 persen. Probabilitas mentah 30 persen untuk seorang nasabah — masalahnya: probabilitas sistematis kegedean karena base rate sampel tidak sama dengan populasi. Wajib koreksi prior sebelum dipakai.",
        "Oversampling default 5x tanpa koreksi prior adalah tersangka klasik miskalibrasi: probabilitas mentah dari sampel yang diperkaya pasti bias. Koreksi prior mengembalikannya ke skala populasi.",
        "Aturan validasi: AUC tinggi berarti probabilitasnya bisa langsung dipakai — salah. AUC hanya sertifikat ranking. Aturan yang benar: ranking bagus (AUC) DAN angka jujur (kalibrasi) — keduanya dicek terpisah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Probabilitas tanpa koreksi prior membuat pricing membesar-besarkan atau mengecilkan risiko secara sistematis — mispricing di seluruh portofolio.",
      },
      reference: "Base rate sampel != populasi -> koreksi prior wajib.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kurva kalibrasi menunjukkan titik-titik konsisten di atas diagonal. Artinya?",
          options: [
            { text: "Model overconfident (melebih-lebihkan)", why: "Salah. Itu jika di bawah diagonal." },
            { text: "Model underconfident — aktual lebih tinggi dari prediksi; sistematis meremehkan risiko", why: "Benar. Bilang 6%, kenyataan 10% — kasus CepatCair.", correct: true },
            { text: "Model terkalibrasi sempurna", why: "Salah. Sempurna = menempel diagonal." },
            { text: "AUC pasti rendah", why: "Salah. Ranking bisa tetap bagus." },
          ],
        },
        {
          q: "ECE = 0,04. Interpretasi tepat?",
          options: [
            { text: "Model 96% akurat", why: "Salah. ECE bukan akurasi." },
            { text: "Rata-rata terbobot probabilitas meleset 4 poin dari frekuensi aktual", why: "Benar. Apakah 4 poin besar tergantung konteks bisnis.", correct: true },
            { text: "AUC = 0,96", why: "Salah. Tidak ada hubungan." },
            { text: "Model tidak bisa dipakai", why: "Salah. Tergantung materialitas 4 poin itu." },
          ],
        },
      ],
      reference: "Di atas diagonal = meremehkan. ECE = meleset rata-rata dalam poin.",
    },
    {
      id: "mini-case-ecl",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Validasi kalibrasi untuk ECL",
      prose: [
        "Kamu validator independen. Model PD portofolio KPR (Rp8 triliun) mengklaim: AUC 0,84, terkalibrasi. Kamu minta data dan menemukan: bucket PD 2-4 persen (n=12.000): aktual default 5,8 persen. Bucket PD 8-12 persen (n=3.000): aktual default 9,1 persen. Model dilatih dengan oversampling default 5x; tidak ada koreksi prior yang didokumentasikan. Kalibrasi hanya dilaporkan agregat — tidak per wilayah.",
        "Apakah model terkalibrasi? Tidak. Bucket 2-4 persen: prediksi rata-rata sekitar 3 persen, aktual 5,8 persen — underestimate sekitar 2,8 poin (model minder). Bucket 8-12 persen: prediksi sekitar 10 persen, aktual 9,1 persen — sedikit overestimate. Pola tidak konsisten: bukan sekadar bias level, tapi bentuk yang salah.",
        "Kemungkinan penyebab: oversampling 5x tanpa koreksi prior adalah tersangka utama — probabilitas mentah dari sampel yang diperkaya default pasti bias; kemungkinan juga drift ekonomi sejak training. Rekomendasi: tolak klaim terkalibrasi. Minta koreksi prior + recalibration di data out-of-time terpisah, kurva kalibrasi per wilayah/segmen, dan backtesting kuartalan terjadwal. Dampak rupiah: underestimate 2,8 poin di bucket terbesar berarti cadangan kurang ratusan miliar — temuan material.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ECL = PD x LGD x EAD. PD yang underestimate 2,8 poin di portofolio Rp8 triliun langsung menjadi cadangan yang kurang ratusan miliar.",
      },
      reference: "Lapor kalibrasi per segmen, bukan cuma agregat. Backtesting terjadwal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan pakai apa",
      prose: [
        "Satu, cek kalibrasi: kurva kalibrasi per bucket + ECE. Titik di atas diagonal konsisten = underconfident; di bawah = overconfident. Dua, butuh koreksi halus dengan data sedikit: Platt scaling (2 parameter, stabil). Tiga, data kalibrasi berlimpah dan pola miskalibrasi aneh (non-S): isotonic — fleksibel tapi rakus data dan bisa overfit di bucket sepi.",
        "Empat, sampel training diperkaya (oversampling/undersampling): koreksi prior dulu sebelum kalibrasi. Lima, validasi di n raksasa: jangan tolak model hanya karena uji formal signifikan — percayai ECE + kurva (materialitas, bukan p-value).",
        "Aturan 10 detik: ranking (AUC) dan angka (kalibrasi) dicek terpisah. Kalibrasi ulang selalu di data terpisah. Keduanya monotonik — ranking tidak berubah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kalibrasi adalah kejujuran, ranking adalah bakat",
        body: "Bakat (ranking) tanpa kejujuran (kalibrasi) = penipu yang karismatik — berguna untuk memilah, berbahaya untuk pricing. Tiga heuristik. Pertama: kalibrasi selalu dicek di data yang tidak dipakai training DAN tidak dipakai kalibrasi ulang — tiga kantong data: latih, kalibrasi, uji. Memakai kantong yang sama dua kali = mencontek dua kali. Kedua: miskalibrasi kecil di tengah distribusi bisa jadi bencana di ekor. Untuk keputusan threshold ekstrem (top 1 persen risiko tertinggi), cek kalibrasi lokal di wilayah keputusan — bukan cuma agregat. Model yang kalibrasinya bagus rata-rata bisa bohong tepat di wilayah yang paling penting. Ketiga: kalibrasi yang benar tidak pernah merusak ranking. Platt dan isotonic monotonik — bila ECE membaik tapi AUC turun setelah kalibrasi ulang, ada bug di pipeline (biasanya kebocoran kantong data). Aturan praktis: untuk keputusan pricing atau cadangan, minta dua angka dari validator — AUC untuk bakat, ECE untuk kejujuran. Satu tanpa yang lain = setengah cerita.",
      },
      reference: "Cek: kurva + ECE. Koreksi: Platt (sedikit data) / isotonic (banyak data). Prior: koreksi dulu.",
    },
    {
      id: "pendalaman-ece-batas",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "ECE, dekomposisi Brier & kapan kalibrasi merusak",
      prose: [
        "ECE mengukur besar miskalibrasi, tapi buta terhadap arah: ECE = rata-rata |akurasi − kepercayaan| tertimbang ukuran bucket. ECE 0,04 berarti probabilitas meleset rata-rata 4 poin — tapi tidak memberi tahu apakah model sistematis minder atau sombong. Selalu pasangkan angka ECE dengan kurva kalibrasi: angka untuk ringkasan, kurva untuk diagnosis.",
        "Brier score punya dekomposisi yang lebih dalam: Brier = reliability − resolution + uncertainty. Reliability = kalibrasi (ingin kecil): seberapa jujur angka per bucket. Resolution = daya beda (ingin besar): seberapa jauh prediksi tiap bucket menyebar dari base rate — model yang selalu memprediksi base rate punya reliability sempurna tapi resolution nol. Uncertainty = base rate x (1 − base rate): tak tereduksi, ditentukan masalahnya. Dua model bisa punya Brier identik dengan komposisi berbeda — pilih yang reliability kecil DAN resolution besar.",
        "Kapan kalibrasi ulang justru MERUSAK: isotonic regression di data kalibrasi kecil (n < 1000) = overfit tangga — kurva jadi bergerigi mengikuti noise bucket sepi, tidak generalisasi. Platt scaling mengasumsikan bentuk sigmoid — bila pola miskalibrasi aneh dan non-monotonik, Platt gagal total. Aturan: n kalibrasi kecil → Platt; n besar + pola aneh → isotonic; di antaranya → coba keduanya dan validasi di kantong ketiga.",
        "Satu prinsip yang tidak bisa ditawar: kalibrasi ulang tidak pernah memperbaiki ranking — dan ranking yang bagus tidak menjamin kalibrasi. Keduanya dilaporkan terpisah ke validator independen. Model dengan AUC 0,9 dan ECE 0,08 adalah model yang hebat memilah dan buruk berhitung — untuk pricing, ia tetap butuh koreksi sebelum dipakai.",
      ],
      formula: String.raw`\text{ECE} = \sum_{b=1}^{B} \frac{n_b}{n} \, \big|\text{acc}_b - \text{conf}_b\big|`,
      formulaNote: "ECE = expected calibration error; n_b/n = bobot bucket b; acc_b = frekuensi aktual di bucket b; conf_b = rata-rata prediksi di bucket b. ECE = 0,04 berarti probabilitas meleset rata-rata 4 poin. Selalu pasangkan dengan kurva — ECE buta terhadap arah kesalahan.",
      tasks: [],
      reference: "Angka (ECE/Brier) untuk ringkasan, kurva untuk diagnosis. Kalibrasi ulang: Platt untuk data sedikit, isotonic untuk data berlimpah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Terlibrasi sempurna: P(Y=1|p) = p. Kurva menempel diagonal.",
        "ECE = meleset rata-rata (poin); Brier = proper scoring rule; uji formal terlalu sensitif di n raksasa.",
        "Platt (stabil, data sedikit) vs isotonic (fleksibel, data berlimpah). Keduanya monotonik.",
        "Kalibrasi ulang wajib di data terpisah — bukan data latih.",
        "Oversampling tanpa koreksi prior = probabilitas bias. AUC tinggi bukan izin pakai angka mentah.",
      ],
      next: { label: "A3.7 — Imbalanced Data", href: "/learn/a37-imbalanced-data" },
      quiz: [
        {
          q: "Kenapa kalibrasi ulang tidak boleh di-fit di data latih model?",
          options: [
            { text: "Terlalu lambat", why: "Salah. Bukan soal kecepatan." },
            { text: "Model sudah overfit di data latih — Platt hanya mengoreksi kepedean palsu, bukan kepedean di dunia nyata", why: "Benar. Ini leakage yang halus; wajib data terpisah.", correct: true },
            { text: "Platt butuh data kecil", why: "Salah. Bukan itu alasannya." },
            { text: "Tidak ada alasan", why: "Salah. Ada: mencontek dua kali." },
          ],
        },
        {
          q: "Model dilatih di sampel 50:50 padahal populasi default 2%. Probabilitas mentah 30%. Masalah?",
          options: [
            { text: "Tidak ada — 30% tetap 30%", why: "Salah. Base rate sampel mengubah skala." },
            { text: "Probabilitas sistematis kegedean — wajib koreksi prior sebelum dipakai", why: "Benar. Tanpa ini, pricing membesar-besarkan risiko.", correct: true },
            { text: "Modelnya pasti overfit", why: "Salah. Bukan itu masalahnya." },
            { text: "Threshold harus 50%", why: "Salah. Tidak relevan." },
          ],
        },
        {
          q: "Platt scaling vs isotonic: kapan pilih isotonic?",
          options: [
            { text: "Selalu — lebih fleksibel", why: "Salah. Fleksibel = rakus data." },
            { text: "Saat data kalibrasi berlimpah dan pola miskalibrasi aneh; Platt untuk kasus mulus/data sedikit", why: "Benar. Keduanya monotonik = ranking tidak berubah.", correct: true },
            { text: "Saat butuh mengubah ranking", why: "Salah. Keduanya tidak mengubah ranking." },
            { text: "Saat data sedikit", why: "Salah. Itu kasus Platt." },
          ],
        },
        {
          q: "Uji Hosmer-Lemeshow menolak (p<0,001) pada n=2 juta, tapi ECE=0,008 dan kurva menempel diagonal. Kesimpulan?",
          options: [
            { text: "Model miskalibrasi parah — tolak", why: "Salah. Deviasi 0,8 poin tidak material." },
            { text: "Uji terlalu sensitif di n raksasa: percayai ECE + kurva (materialitas, bukan p-value)", why: "Benar. Signifikansi statistik bukan materialitas.", correct: true },
            { text: "Naikkan jumlah bucket", why: "Salah. Tidak menyelesaikan masalah sensitivitas." },
            { text: "Buang model", why: "Salah. Modelnya baik-baik saja." },
          ],
        },
        {
          q: "ECE turun dari 0,06 ke 0,02, tapi kurva menunjukkan bucket rendah overestimate dan bucket tinggi underestimate. Apa yang hilang?",
          options: [
            { text: "Tidak ada — ECE membaik berarti semua membaik", why: "Salah. ECE buta terhadap arah." },
            { text: "ECE buta arah: ia merata-ratakan |selisih| sehingga over di satu sisi dan under di sisi lain saling menutupi. Kurva wajib dilihat" , why: "Benar. Angka untuk ringkasan, kurva untuk diagnosis.", correct: true },
            { text: "AUC pasti ikut membaik", why: "Salah. Kalibrasi tidak mengubah ranking." },
            { text: "Bucket-nya kurang banyak", why: "Salah. Masalahnya bukan jumlah bucket." },
          ],
        },
        {
          q: "Isotonic regression di-fit pada 300 data kalibrasi menghasilkan kurva bergerigi sempurna di data itu tapi jelek di data baru. Diagnosis?",
          options: [
            { text: "Isotonic selalu buruk", why: "Salah. Isotonic bagus dengan data berlimpah." },
            { text: "Overfit tangga: isotonic terlalu fleksibel untuk n kecil — ia menghafal noise bucket sepi. Untuk n kecil pakai Platt (2 parameter, stabil)", why: "Benar. Fleksibilitas tanpa data = hafalan.", correct: true },
            { text: "Harus pakai lebih banyak bucket", why: "Salah. Itu memperparah overfit." },
            { text: "Data kalibrasinya salah", why: "Salah. Datanya benar; metodenya yang terlalu fleksibel." },
          ],
        },
        {
          q: "Dua model punya Brier identik 0,12. Model X: reliability 0,01, resolution 0,05. Model Y: reliability 0,04, resolution 0,08. Untuk pricing, pilih?",
          options: [
            { text: "Sama saja — Brier sama", why: "Salah. Komposisi Brier berbeda makna." },
            { text: "Model X — reliability (kejujuran angka) jauh lebih kecil; pricing butuh angka jujur. Resolution bisa dikejar belakangan", why: "Benar. Dekomposisi Brier: reliability kecil + resolution besar = ideal; X unggul di reliability.", correct: true },
            { text: "Model Y — resolution lebih besar", why: "Salah. Resolution besar dengan reliability buruk = model yang pede tapi bohong." },
            { text: "Tolak keduanya", why: "Salah. Keduanya usable; X lebih cocok untuk pricing." },
          ],
        },
      ],
    },
  ],
};
