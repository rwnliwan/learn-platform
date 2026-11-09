import type { V2Lesson } from "../lib/types";

export const a38: V2Lesson = {
  slug: "a38-validasi-model",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.8 Validasi Model: Leakage, Out-of-Time & Audit",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-danakilat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "AUC 0,97 yang runtuh di hari pertama produksi",
      prose: [
        "Startup lending DanaKilat merekrut data scientist top. Tiga minggu kemudian ia menunjukkan model PD dengan AUC 0,97 — nyaris sempurna. Fitur terbaiknya, katanya bangga: rata-rata tunggakan 12 bulan ke depan.",
        "CTO langsung pucat. Rata-rata tunggakan 12 bulan ke depan — informasi yang baru ada 12 bulan setelah prediksi dibuat. Di data historis fitur itu tersedia (karena masa lalu sudah terjadi). Di produksi, saat memprediksi nasabah baru, fitur itu tidak ada — masa depan belum terjadi. Model AUC 0,97 itu pada dasarnya berkata: saya bisa memprediksi masa depan dengan sempurna, asal diberi tahu masa depannya dulu.",
        "Leakage seperti ini tidak terdeteksi oleh metrik apapun — AUC, KS, Brier semuanya terlihat cantik. Satu-satunya pertahanan adalah disiplin berpikir temporal: untuk setiap fitur, tanya kapan nilai ini tersedia di produksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model bocor yang go-live runtuh total di hari pertama — keputusan kredit dari angka fantasi. Tidak ada metrik yang menangkapnya; hanya disiplin temporal.",
      },
      reference: "Uji perangko waktu tiap fitur: kapan tersedia vs kapan diprediksi.",
    },
    {
      id: "lab-leakage",
      eyebrow: "Langkah 2 · Lab: leakage",
      title: "Target leakage vs validasi jujur",
      prose: [
        "Tiga wajah kebocoran informasi: target/temporal leakage — fitur dari masa depan (rata-rata tunggakan 12 bulan ke depan); train-test contamination — statistik test bocor ke training (scaling/imputasi dihitung sebelum split); group leakage — unit yang sama di kedua sisi fold (transaksi satu kartu tersebar di train dan test).",
        "Di bawah: x_leak = target + noise kecil — fitur yang dihitung dari informasi setelah periode prediksi. Bandingkan AUC test model jujur (x1, x2) vs model bocor (+x_leak).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `auc_jujur` model (x1, x2)" },
        { id: "t2", text: "Hitung `auc_bocor` model (+x_leak), lalu `print`" },
      ],
      expected: "auc_jujur=0.796 auc_bocor=0.997",
      note: {
        title: "Sering salah",
        body: "Merayakan AUC fantastis tanpa uji perangko waktu. Selalu curigai angka terlalu bagus — leakage memberi AUC sempurna yang runtuh total di produksi.",
      },
      hints: [
        "fit_predict(fitur_train, y_train, fitur_test) mengembalikan skor test.",
        "Split jujur 70/30: ntr = 1400.",
        "s_jujur = fit_predict([x1[:ntr], x2[:ntr]], y[:ntr], [x1[ntr:], x2[ntr:]])",
      ],
      code: {
        starter: `import random, math\nrandom.seed(17)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 2000\nx1 = [random.gauss(0,1) for _ in range(n)]\nx2 = [random.gauss(0,1) for _ in range(n)]\ny  = [1 if random.random() < sigmoid(-2.5 - 1.2*a + 0.9*b) else 0 for a, b in zip(x1, x2)]\nx_leak = [yi + random.gauss(0, 0.3) for yi in y]  # BOCOR: info masa depan\n\ndef fit_predict(xs_list, y, xs_test):\n    p = len(xs_list); ntr = len(y)\n    X = [[1.0]+[xs[i] for xs in xs_list] for i in range(ntr)]\n    A = [[sum(X[i][a]*X[i][b] for i in range(ntr)) for b in range(p+1)] for a in range(p+1)]\n    bb = [sum(X[i][a]*y[i] for i in range(ntr)) for a in range(p+1)]\n    M = [row[:]+[bi] for row, bi in zip(A, bb)]\n    for c in range(p+1):\n        piv = max(range(c, p+1), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, p+1):\n            f = M[r][c]/M[c][c]\n            for k in range(c, p+2): M[r][k] -= f*M[c][k]\n    beta = [0]*(p+1)\n    for i in range(p, -1, -1):\n        beta[i] = (M[i][p+1]-sum(M[i][j]*beta[j] for j in range(i+1, p+1)))/M[i][i]\n    Xt = [[1.0]+[xs[i] for xs in xs_test] for i in range(len(xs_test[0]))]\n    return [sum(beta[a]*Xt[i][a] for a in range(p+1)) for i in range(len(Xt))]\n\ndef auc_score(y, s):\n    pos=[v for a,v in zip(y,s) if a==1]; neg=[v for a,v in zip(y,s) if a==0]\n    return sum(1 for a in pos for b in neg if a>b)/(len(pos)*len(neg))\n\nntr = 1400\n# TULIS KODEMU: AUC test model jujur vs bocor\ns_jujur = \nauc_jujur = \ns_bocor = \nauc_bocor = \n\nprint(f"auc_jujur={auc_jujur:.3f} auc_bocor={auc_bocor:.3f}")`,
        lockLines: 30,
        solution: `import random, math\nrandom.seed(17)\n\ndef sigmoid(z): return 1/(1+math.exp(-z))\nn = 2000\nx1 = [random.gauss(0,1) for _ in range(n)]\nx2 = [random.gauss(0,1) for _ in range(n)]\ny  = [1 if random.random() < sigmoid(-2.5 - 1.2*a + 0.9*b) else 0 for a, b in zip(x1, x2)]\nx_leak = [yi + random.gauss(0, 0.3) for yi in y]  # BOCOR: info masa depan\n\ndef fit_predict(xs_list, y, xs_test):\n    p = len(xs_list); ntr = len(y)\n    X = [[1.0]+[xs[i] for xs in xs_list] for i in range(ntr)]\n    A = [[sum(X[i][a]*X[i][b] for i in range(ntr)) for b in range(p+1)] for a in range(p+1)]\n    bb = [sum(X[i][a]*y[i] for i in range(ntr)) for a in range(p+1)]\n    M = [row[:]+[bi] for row, bi in zip(A, bb)]\n    for c in range(p+1):\n        piv = max(range(c, p+1), key=lambda r: abs(M[r][c]))\n        M[c], M[piv] = M[piv], M[c]\n        for r in range(c+1, p+1):\n            f = M[r][c]/M[c][c]\n            for k in range(c, p+2): M[r][k] -= f*M[c][k]\n    beta = [0]*(p+1)\n    for i in range(p, -1, -1):\n        beta[i] = (M[i][p+1]-sum(M[i][j]*beta[j] for j in range(i+1, p+1)))/M[i][i]\n    Xt = [[1.0]+[xs[i] for xs in xs_test] for i in range(len(xs_test[0]))]\n    return [sum(beta[a]*Xt[i][a] for a in range(p+1)) for i in range(len(Xt))]\n\ndef auc_score(y, s):\n    pos=[v for a,v in zip(y,s) if a==1]; neg=[v for a,v in zip(y,s) if a==0]\n    return sum(1 for a in pos for b in neg if a>b)/(len(pos)*len(neg))\n\nntr = 1400\n# TULIS KODEMU: AUC test model jujur vs bocor\ns_jujur = fit_predict([x1[:ntr], x2[:ntr]], y[:ntr], [x1[ntr:], x2[ntr:]])\nauc_jujur = auc_score(y[ntr:], s_jujur)\ns_bocor = fit_predict([x1[:ntr], x2[:ntr], x_leak[:ntr]], y[:ntr], [x1[ntr:], x2[ntr:], x_leak[ntr:]])\nauc_bocor = auc_score(y[ntr:], s_bocor)\n\nprint(f"auc_jujur={auc_jujur:.3f} auc_bocor={auc_bocor:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "auc_jujur", value: 0.796, tol: 0.005, label: "`auc_jujur` sekitar 0.796", msg: "AUC jujur dari dua fitur legit — bagus tapi tidak sempurna." },
          { kind: "equal", task: "t2", name: "auc_bocor", value: 0.997, tol: 0.005, label: "`auc_bocor` sekitar 0.997", msg: "Fitur bocor memberi AUC nyaris sempurna — fantasi yang runtuh di produksi." },
          { kind: "stdout_matches", task: "t2", pattern: "auc_jujur=0\\.796\\s+auc_bocor=0\\.997", label: "`print` menampilkan bedanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Deteksi: tanya kapan tiap fitur tersedia. Setelah periode prediksi = leakage.",
    },
    {
      id: "oot-walkforward",
      eyebrow: "Langkah 3 · Out-of-time",
      title: "Validasi harus menghormati panah waktu",
      prose: [
        "Untuk data temporal (pengajuan 2020-2024), random 5-fold CV adalah temporal leakage yang dilembagakan: model belajar dari masa depan lalu diuji di masa lalu. Skema yang benar: time-based split atau walk-forward — train di masa lalu, validasi di masa depan (out-of-time). OOT mensimulasikan persis cara model dipakai: memprediksi masa depan.",
        "Stratifikasi per vintage menjaga proporsi tiap angkatan. Test set tetap dikunci dan dipakai sekali — data uji tidak boleh dipakai untuk memilih fitur, menyetel hyperparameter, atau keputusan pemodelan apapun. Sekali dipakai untuk keputusan, ia berhenti menjadi data uji.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai random CV untuk data temporal karena lebih mudah. Kemudahan itu dibayar dengan angka validasi yang overoptimis dan kejutan di produksi.",
      },
      reference: "Temporal -> OOT walk-forward. Random CV dilarang untuk data waktu.",
    },
    {
      id: "lab-psi",
      eyebrow: "Langkah 4 · Lab: PSI",
      title: "Detektor asap populasi",
      prose: [
        "PSI (population stability index) mengukur pergeseran distribusi skor antara training dan produksi: jumlah dari (aktual% - ekspektasi%) x ln(aktual%/ekspektasi%) per bucket. Ambang: di bawah 0,1 stabil; 0,1-0,25 waspada; di atas 0,25 bergeser signifikan.",
        "PSI adalah alarm, bukan vonis — tapi alarm tidak boleh diabaikan. Menyetel ulang baseline agar PSI turun tanpa memahami penyebab sama dengan mematikan detektor asap.",
        "Di bawah: distribusi skor PD training vs produksi bulan ini. Hitung PSI dan putuskan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `v` = PSI via `psi(train, prod)`" },
        { id: "t2", text: "Tentukan `verdict`, lalu `print`" },
      ],
      expected: "psi=6.2449 BERGESER",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pergeseran populasi tanpa investigasi berarti model menilai dunia yang sudah tidak ada — keputusan dari peta usang.",
      },
      hints: [
        "psi(train, prod) mengembalikan total dan mencetak tabel.",
        "Ambang: <0.1 STABIL, <0.25 WASPADA, selebihnya BERGESER.",
        "v = psi(train, prod)",
      ],
      code: {
        starter: `import math\n\ndef psi(expected_pct, actual_pct):\n    total = 0.0\n    for b, e, a in zip(["<550","550-600","600-650","650-700","700-750",">750"],\n                       expected_pct, actual_pct):\n        e = max(e, 0.0001); a = max(a, 0.0001)\n        total += (a - e) * math.log(a/e)\n    return total\n\ntrain = [12, 18, 25, 22, 15, 8]\nprod  = [8, 14, 22, 24, 20, 12]\n\n# TULIS KODEMU: PSI + verdict\nv = \nverdict = \n\nprint(f"psi={v:.4f} {verdict}")`,
        lockLines: 11,
        solution: `import math\n\ndef psi(expected_pct, actual_pct):\n    total = 0.0\n    for b, e, a in zip(["<550","550-600","600-650","650-700","700-750",">750"],\n                       expected_pct, actual_pct):\n        e = max(e, 0.0001); a = max(a, 0.0001)\n        total += (a - e) * math.log(a/e)\n    return total\n\ntrain = [12, 18, 25, 22, 15, 8]\nprod  = [8, 14, 22, 24, 20, 12]\n\n# TULIS KODEMU: PSI + verdict\nv = psi(train, prod)\nverdict = "STABIL" if v < 0.1 else ("WASPADA" if v < 0.25 else "BERGESER")\n\nprint(f"psi={v:.4f} {verdict}")`,
        checks: [
          { kind: "equal", task: "t1", name: "v", value: 6.2449, tol: 0.01, label: "`v` sekitar 6.2449", msg: "Jumlah kontribusi tiap bucket — jauh di atas 0,25." },
          { kind: "stdout_matches", task: "t2", pattern: "psi=6\\.2449\\s+BERGESER", label: "`print` menampilkan verdict", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "PSI = sum((a-e)*ln(a/e)). <0.1 stabil, 0.1-0.25 waspada, >0.25 bergeser.",
    },
    {
      id: "effective-challenge",
      eyebrow: "Langkah 5 · Effective challenge",
      title: "Challenger: pembanding yang jujur",
      prose: [
        "SR 11-7 menuntut effective challenge: model harus ditantang oleh pihak yang tidak membangunnya, dengan benchmark independen berpendekatan berbeda. Challenger (misal logistik sederhana vs boosting kompleks) menguji apakah kompleksitas model utama justified oleh perbaikan yang material.",
        "Jika model kompleks hanya menang 0,5 poin AUC dari challenger sederhana, kompleksitasnya tidak justified — pilih yang sederhana. Tanpa challenger, tidak ada yang tahu apakah 40 fitur dan 40 menit training membeli sesuatu yang nyata.",
        "Dokumentasi lengkap (asumsi, keterbatasan, hasil challenge) adalah bagian dari model — bukan lampiran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator menanyakan challenger duluan. Model tanpa effective challenge = model tanpa pertahanan saat ditanya kenapa sekompleks ini.",
      },
      reference: "Challenger = benchmark independen. Kompleksitas harus membayar dirinya.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 5. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: validasi adalah auditor yang kamu sewa sendiri",
        body: "Bayangkan validasi sebagai auditor forensik yang kamu bayar untuk menemukan kebohongan modelmu SEBELUM pasar atau regulator menemukannya. Auditor yang baik tidak percaya angka; ia percaya jejak. Tiga heuristik. Pertama: angka validasi yang terlalu bagus adalah tersangka, bukan prestasi. AUC 0,97, error nyaris nol — reaksi pertamamu harus curiga leakage, bukan merayakan. Model jujur jarang terlihat sempurna. Kedua: setiap keputusan yang memakai data uji — memilih fitur, menyetel hyperparameter, memilih arsitektur — menghabiskan kejujuran data itu sedikit demi sedikit. Test set hanya jujur bila buta; sekali dipakai untuk keputusan, ia menjadi data latih yang menyamar. Ketiga: validasi termurah adalah yang paling awal. Uji perangko waktu tiap fitur saat feature engineering (kapan nilai ini tersedia di produksi?) jauh lebih murah daripada menemukan leakage saat audit pra-go-live. Aturan praktis: bila kamu tidak bisa menjelaskan KENAPA metrik membaik setelah suatu perubahan — tidak ada cerita kausalnya — anggap itu noise atau leakage sampai terbukti sebaliknya. Perbaikan nyata selalu punya cerita.",
      },
      quiz: [
        {
          q: "Fitur total_denda_12_bulan_ke_depan untuk prediksi default bulan ini. Masalah?",
          options: [
            { text: "Tidak ada — fitur prediktif kuat", why: "Salah. Kuat justru karena bocor." },
            { text: "Target/temporal leakage — informasi masa depan yang tidak tersedia saat prediksi di produksi", why: "Benar. Uji perangko waktu: kapan tersedia vs kapan diprediksi.", correct: true },
            { text: "Multikolinearitas", why: "Salah. Bukan itu masalahnya." },
            { text: "Heteroskedastisitas", why: "Salah. Tidak relevan." },
          ],
        },
        {
          q: "Untuk model PD dengan data 2020-2024, skema validasi yang benar?",
          options: [
            { text: "Random 5-fold CV", why: "Salah. Itu temporal leakage yang dilembagakan." },
            { text: "Time-based split / walk-forward: train masa lalu, validasi masa depan (OOT)", why: "Benar. Mensimulasikan cara model dipakai.", correct: true },
            { text: "Train di 2024, test di 2020", why: "Salah. Arah waktu terbalik." },
            { text: "Satu split 50:50 acak", why: "Salah. Acak mencampur masa depan ke train." },
          ],
        },
      ],
      reference: "Perangko waktu tiap fitur. Temporal -> OOT.",
    },
    {
      id: "mini-case-golive",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Checklist validasi sebelum go-live",
      prose: [
        "Kamu validator independen untuk model early warning kredit korporat (akan dipakai menentukan CKPN Rp3 triliun). Dokumen pengembang: AUC 0,91 (5-fold CV acak), 40 fitur, tidak ada leakage. Kamu menemukan: (a) fitur restrukturisasi_6m — didefinisikan dari kejadian dalam 6 bulan setelah tanggal observasi; (b) imputasi median dihitung dari seluruh data sebelum split; (c) tidak ada validasi OOT; (d) tidak ada challenger model.",
        "Klasifikasi: (a) target/temporal leakage — fitur dari masa depan, tidak tersedia di produksi, fatal; (b) train-test contamination — imputasi sebelum split membocorkan distribusi test ke train; (c) desain validasi salah — untuk peringatan dini yang temporal, random CV tidak valid, wajib OOT; (d) melanggar effective challenge — tanpa benchmark, tidak tahu apakah kompleksitas 40 fitur justified.",
        "Putusan: tolak go-live. Temuan (a) saja sudah fatal — AUC 0,91 tidak bermakna. Syarat perbaikan: buang fitur bocor, pipeline yang benar (split dulu, fit di train saja), OOT walk-forward, challenger (logistik sederhana), dokumentasi lengkap. Baru kemudian validasi ulang independen.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CKPN Rp3 triliun dari model bocor berarti cadangan salah hitung dalam skala sistemik. Validator yang meloloskan ini ikut bertanggung jawab.",
      },
      reference: "Satu leakage fatal = tolak. Perbaiki, lalu validasi ulang independen.",
    },
    {
      id: "pendalaman-nested-cv",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "CV bersarang: tuning yang jujur & jebakan p-hacking",
      prose: [
        "Ada jebakan yang lebih halus dari leakage: selection bias dalam pemilihan model. Kamu mencoba 100 konfigurasi hyperparameter dengan cross-validation biasa, lalu melaporkan error konfigurasi terbaik sebagai estimasi performa. Masalahnya: dari 100 konfigurasi, yang terbaik hampir pasti beruntung — ia overfit pada noise lipatan validasi. Error yang kamu laporkan bukan estimasi jujur, melainkan hasil terbaik dari 100 undian. Inilah mengapa tuning dan evaluasi harus dipisah.",
        "Solusinya: nested cross-validation — dua loop bersarang. Loop dalam untuk tuning: memilih hyperparameter, seleksi fitur, memilih arsitektur. Loop luar untuk evaluasi: mengestimasi error generalisasi dari prosedur tuning secara keseluruhan, bukan dari satu konfigurasi. Prosedur tuning boleh overfit di dalam; yang dilaporkan adalah performa prosedur itu di data yang belum pernah dipakai untuk keputusan apapun. Mahal secara komputasi — tapi itulah harga kejujuran.",
        "Kembaran masalah ini di dunia uji hipotesis: multiple comparisons. Kamu mencoba 20 threshold berbeda lalu melaporkan yang signifikan pada p=0,03. Tanpa koreksi, peluang minimal satu false positive dari 20 percobaan jauh di atas 3 persen. Koreksi Bonferroni membagi ambang: alpha* = alpha/m — dengan 20 percobaan, klaim harus melewati 0,0025. Aturan keputusan senior: laporkan SEMUA yang dicoba, bukan hanya yang menang. Pembaca yang hanya melihat pemenang tidak bisa menilai peran keberuntungan.",
        "Varian yang lebih licin: garden of forking paths dan HARKing — keputusan analisis dibuat SETELAH melihat data (mengganti metrik karena yang pertama jelek, mencoba transformasi sampai signifikan), lalu dilaporkan seolah direncanakan sejak awal. Hasilnya terlihat signifikan padahal ia produk eksplorasi. Pertahanan: pradaftarkan protokol validasi — metrik, skema split, challenger — SEBELUM eksperimen berjalan, dan catat setiap penyimpangan. Angka yang dilaporkan ke direksi adalah error outer loop atau OOT — bukan error konfigurasi terbaik.",
      ],
      formula: String.raw`\alpha^* = \frac{\alpha}{m}`,
      formulaNote: "alpha* = ambang signifikansi terkoreksi; alpha = ambang awal (biasanya 0,05); m = jumlah perbandingan atau konfigurasi yang dicoba. Contoh: 20 threshold dicoba → alpha* = 0,05/20 = 0,0025. Klaim signifikan harus melewati ambang yang jauh lebih ketat ini.",
      tasks: [],
      reference: "Tuning di dalam, evaluasi di luar. Laporkan semua yang dicoba. Pradaftarkan protokol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Leakage tiga wajah: temporal, train-test contamination, group. Uji perangko waktu tiap fitur.",
        "Data temporal -> OOT walk-forward; random CV = temporal leakage.",
        "PSI: <0,1 stabil, 0,1-0,25 waspada, >0,25 bergeser signifikan. Alarm, bukan vonis.",
        "Effective challenge (SR 11-7): challenger independen menguji apakah kompleksitas justified.",
        "Pipeline benar: split dulu, fit (scaler/imputasi/seleksi) hanya di train.",
      ],
      next: { label: "A3.9 — Time Series", href: "/v2/learn/a39-time-series" },
      quiz: [
        {
          q: "PSI = 0,31 untuk distribusi skor PD bulan ini vs training. Tindakan?",
          options: [
            { text: "Abaikan — model masih jalan", why: "Salah. Alarm tidak boleh diabaikan." },
            { text: "Investigasi wajib: kenapa bergeser, apakah asumsi masih valid; revalidasi OOT sebelum putuskan retraining", why: "Benar. Di atas 0,25 = bergeser signifikan.", correct: true },
            { text: "Setel ulang baseline agar PSI turun", why: "Salah. Itu mematikan detektor asap." },
            { text: "Naikkan threshold", why: "Salah. Tidak menjawab pergeseran populasi." },
          ],
        },
        {
          q: "Scaling dihitung dari seluruh data, baru kemudian split train/test. Ini?",
          options: [
            { text: "Praktik standar yang benar", why: "Salah. Ini contamination." },
            { text: "Train-test contamination — harus fit scaler hanya di train fold", why: "Benar. Statistik test bocor ke training.", correct: true },
            { text: "Target leakage", why: "Salah. Ini contamination, bukan target leakage." },
            { text: "Tidak berpengaruh", why: "Salah. Prinsipnya fatal; untuk imputasi/seleksi efeknya besar." },
          ],
        },
        {
          q: "Apa peran challenger model dalam effective challenge (SR 11-7)?",
          options: [
            { text: "Menggantikan model utama", why: "Salah. Bukan itu perannya." },
            { text: "Benchmark independen berpendekatan berbeda — menguji apakah kompleksitas justified", why: "Benar. Pembanding jujur untuk klaim kecanggihan.", correct: true },
            { text: "Mempercepat training", why: "Salah. Tidak ada hubungan." },
            { text: "Menghitung PSI", why: "Salah. Bukan itu fungsinya." },
          ],
        },
        {
          q: "Model fraud: transaksi satu kartu tersebar di train dan test fold. Risiko?",
          options: [
            { text: "Tidak ada — transaksi independen", why: "Salah. Transaksi satu kartu tidak independen." },
            { text: "Contamination via grup: pola kartu yang sama di kedua sisi. Solusi: group K-fold", why: "Benar. Model menghafal kartu, bukan pola fraud umum.", correct: true },
            { text: "Temporal leakage", why: "Salah. Ini group leakage." },
            { text: "Target leakage", why: "Salah. Bukan target leakage." },
          ],
        },
        {
          q: "Kamu tuning 100 konfigurasi dengan CV biasa, lalu melaporkan error konfigurasi terbaik sebagai estimasi performa ke direksi. Masalahnya?",
          options: [
            { text: "Tidak ada — itu praktik standar", why: "Salah. Itu justru jebakan yang paling umum." },
            { text: "Selection bias: yang terbaik dari 100 hampir pasti beruntung (overfit noise validasi). Butuh nested CV — tuning di loop dalam, evaluasi di loop luar", why: "Benar. Error konfigurasi terbaik bukan estimasi jujur.", correct: true },
            { text: "Harus pakai lebih banyak fold", why: "Salah. Fold lebih banyak tidak memisahkan tuning dari evaluasi." },
            { text: "Konfigurasinya kurang banyak", why: "Salah. Masalahnya bukan jumlah, melainkan pemisahan peran." },
          ],
        },
        {
          q: "Dari 20 threshold yang dicoba, satu signifikan pada p=0,03 dan hanya itu yang dilaporkan. Penilaian?",
          options: [
            { text: "Signifikan — p di bawah 0,05", why: "Salah. Itu tanpa koreksi multiple comparisons." },
            { text: "Tidak signifikan setelah koreksi Bonferroni: alpha* = 0,05/20 = 0,0025. Melaporkan hanya yang menang = p-hacking", why: "Benar. Laporkan semua yang dicoba.", correct: true },
            { text: "Butuh sampel lebih besar", why: "Salah. Masalahnya jumlah percobaan, bukan ukuran sampel." },
            { text: "Ganti ke uji satu arah", why: "Salah. Itu justru memperparah — keputusan dibuat setelah melihat data." },
          ],
        },
        {
          q: "Setelah melihat hasil jelek, kamu mengganti metrik evaluasi lalu melaporkannya sebagai rencana awal. Ini disebut?",
          options: [
            { text: "Iterasi yang sehat", why: "Salah. Iterasi sehat didokumentasikan sebagai iterasi, bukan disamarkan jadi rencana awal." },
            { text: "HARKing / garden of forking paths — keputusan pasca-data yang disajikan sebagai pra-rencana. Pertahanan: pradaftarkan protokol validasi", why: "Benar. Hasil eksplorasi yang disajikan sebagai konfirmasi.", correct: true },
            { text: "Regularisasi", why: "Salah. Tidak ada hubungan." },
            { text: "Cross-validation", why: "Salah. Ini soal integritas pelaporan, bukan teknik validasi." },
          ],
        },
      ],
    },
  ],
};
