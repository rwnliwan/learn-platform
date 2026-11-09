import type { V2Lesson } from "../lib/types";

export const a25: V2Lesson = {
  slug: "a25-uji-t-anova",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.5 Uji-t & ANOVA: Membandingkan Rata-rata",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-cabang",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dua cabang, satu pertanyaan",
      prose: [
        "Kepala operasional bank menatap dashboard: rata-rata waktu persetujuan KPR Cabang A = 12,5 hari, Cabang B = 14,8 hari. B 2,3 hari lebih lambat — tegur kepala cabangnya? Analis muda mengangkat tangan: tunggu — selisih 2,3 hari dari berapa sampel? Seberapa bervariasi datanya? Kalau tiap cabang cuma 10 data dan variasinya ±5 hari, selisih 2,3 hari itu noise. Kalau 500 data dengan variasi ±1 hari, itu sinyal.",
        "Apakah dua rata-rata benar-benar beda tidak bisa dijawab dari selisihnya saja. Butuh tiga bahan: selisih, variasi, dan ukuran sampel — yang diramu menjadi satu angka: statistik-t. Dan memilih jenis uji-t yang tepat (Student? Welch? Berpasangan?) sama pentingnya dengan menghitungnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih` = 14,8 − 12,5" },
        { id: "t2", text: "Hitung `se_10` = 5/√10 (SE jika tiap cabang n=10), bulatkan 2 desimal" },
        { id: "t3", text: "Hitung `se_500` = 5/√500 (SE jika tiap cabang n=500), bulatkan 2 desimal" },
      ],
      expected: "selisih=2.3  se_10=1.58  se_500=0.22",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menegur kepala cabang dari selisih 2,3 hari tanpa melihat n dan variasi adalah vonis tanpa bukti. Dengan n=10 dan SE 1,58, selisih itu noise; dengan n=500 dan SE 0,22, itu sinyal. Keputusan operasional butuh ketiganya.",
      },
      hints: [
        "selisih = 14.8 - 12.5.",
        "se_10 = round(5/math.sqrt(10), 2).",
        "se_500 = round(5/math.sqrt(500), 2).",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nselisih = \nse_10 = \nse_500 = \n\nprint(f"selisih={selisih}  se_10={se_10}  se_500={se_500}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nselisih = round(14.8 - 12.5, 1)\nse_10 = round(5/math.sqrt(10), 2)\nse_500 = round(5/math.sqrt(500), 2)\n\nprint(f"selisih={selisih}  se_10={se_10}  se_500={se_500}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih", value: 2.3, tol: 1e-9, label: "`selisih` seharusnya 2.3", msg: "14,8 − 12,5 = 2,3 hari." },
          { kind: "equal", task: "t2", name: "se_10", value: 1.58, tol: 0.01, label: "`se_10` seharusnya 1.58", msg: "SE ≈ 1,58 — selisih 2,3 tenggelam di noise." },
          { kind: "equal", task: "t3", name: "se_500", value: 0.22, tol: 0.01, label: "`se_500` seharusnya 0.22", msg: "SE ≈ 0,22 — selisih 2,3 adalah sinyal kuat." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=2\\.3\\s+se_10=1\\.58\\s+se_500=0\\.22", label: "`print` menampilkan ketiganya", msg: "Format: selisih=...  se_10=...  se_500=... ." },
        ],
      },
      reference: "t = selisih / SE — tiga bahan: selisih, variasi, n.",
    },
    {
      id: "uji-z",
      eyebrow: "Langkah 2 · Uji-z",
      title: "Sang veteran dari dunia ideal",
      prose: [
        "Uji-z menguji mean saat σ populasi diketahui: z = (x̄ − μ0)/(σ/√n), berdistribusi normal standar di bawah H0. Contoh: klaim rata-rata saldo Rp5 jt; σ = Rp2 jt diketahui; n = 100; x̄ = Rp5,4 jt. z = 0,4/0,2 = 2,0; p dua sisi ≈ 0,046 < 0,05 → tolak H0.",
        "Kepribadiannya: hidup di dunia ideal — mengasumsikan kamu tahu persis variasi populasi. Di dunia nyata nyaris tidak pernah terjadi. Peran sebenarnya: fondasi konseptual — semua uji lain adalah uji-z yang disesuaikan karena σ tak diketahui. Praktisnya dipakai saat σ diketahui atau n sangat besar (s ≈ σ, t ≈ z).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Selalu pakai uji-z karena lebih sederhana. Salah — uji-z butuh σ diketahui, yang nyaris tak pernah terjadi. Untuk n kecil dengan σ tak diketahui, wajib uji-t; memakai z membuatmu terlalu gampang mengklaim signifikan.",
      },
      reference: "Uji-z = fondasi; uji-t = versi jujurnya untuk dunia nyata.",
    },
    {
      id: "welch-dua-kota",
      eyebrow: "Langkah 3 · Uji-t Student & Welch",
      title: "Welch: default aman untuk dua sampel",
      prose: [
        "Uji-t Student mengganti σ dengan s — tapi versi dua sampelnya memakai variansi gabungan (pooled), yang mengasumsikan kedua populasi punya variansi SAMA. Uji-t Welch tidak mengasumsikan itu: SE = √(s1²/n1 + s2²/n2).",
        "Contoh: Jakarta n=50, x̄=12 jt, s=3 jt; Surabaya n=60, x̄=10,5 jt, s=2,5 jt. SE = √(9/50 + 6,25/60) ≈ 0,533; t = 1,5/0,533 ≈ 2,81 → p ≈ 0,006 < 0,05 → beda signifikan. Jika variansi memang sama, Welch ≈ Student (tidak ada ruginya); jika beda, Welch tetap valid sementara Student bisa meleset — terutama saat n tak seimbang.",
      ],
      formula: String.raw`t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}} \quad \text{(Welch)}`,
      formulaNote: "t = statistik uji Welch; x-bar_1, x-bar_2 = mean dua sampel; s_1, s_2 = simpangan baku dua sampel; n_1, n_2 = ukuran sampel — variansi tiap grup dipakai sendiri-sendiri, tanpa asumsi sama.",
      tasks: [
        { id: "t1", text: "Hitung `se` = √(9/50 + 6,25/60), bulatkan 3 desimal" },
        { id: "t2", text: "Hitung `t` = 1,5/se (tanpa pembulatan), bulatkan 2 desimal" },
      ],
      expected: "se=0.533  t=2.81",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Uji kesamaan variansi dulu (Levene); kalau lolos baru pakai Student. Salah — prosedur dua tahap ini justru merusak sifat uji (α aktual meleset). Karena Welch tidak kalah apa-apa saat variansi sama, langsung pakai Welch tanpa pre-test.",
      },
      hints: [
        "se = round(math.sqrt(9/50 + 6.25/60), 3).",
        "t = round(1.5 / math.sqrt(9/50 + 6.25/60), 2) — pakai se tanpa pembulatan.",
        "Hasil t ≈ 2.81 → p ≈ 0,006.",
      ],
      code: {
        starter: `import math\n# Jakarta: n=50, mean=12, s=3 | Surabaya: n=60, mean=10.5, s=2.5\n\n# TULIS KODEMU\nse = \nt = \n\nprint(f"se={se}  t={t}")`,
        lockLines: 2,
        solution: `import math\n# Jakarta: n=50, mean=12, s=3 | Surabaya: n=60, mean=10.5, s=2.5\n\n# TULIS KODEMU\nse = round(math.sqrt(9/50 + 6.25/60), 3)\nt = round(1.5 / math.sqrt(9/50 + 6.25/60), 2)\n\nprint(f"se={se}  t={t}")`,
        checks: [
          { kind: "equal", task: "t1", name: "se", value: 0.533, tol: 0.001, label: "`se` seharusnya 0.533", msg: "√(0,18 + 0,104) ≈ 0,533." },
          { kind: "equal", task: "t2", name: "t", value: 2.81, tol: 0.01, label: "`t` seharusnya 2.81", msg: "1,5/0,533 ≈ 2,81 → signifikan pada 5%." },
          { kind: "stdout_matches", task: "t2", pattern: "se=0\\.533\\s+t=2\\.81", label: "`print` menampilkan keduanya", msg: "Format: se=...  t=... ." },
        ],
      },
      reference: "Selalu Welch untuk dua sampel independen — tidak ada ruginya.",
    },
    {
      id: "t-distribusi",
      eyebrow: "Langkah 4 · Mengapa distribusi-t",
      title: "Ekor tebal sebagai kejujuran",
      prose: [
        "Mengapa distribusi-t, bukan normal? Karena s sendiri berfluktuasi antar sampel — ada ketidakpastian ganda (tentang mean DAN tentang sebaran). Distribusi-t mengompensasi dengan ekor lebih tebal: nilai kritisnya lebih besar dari z, sehingga lebih sulit menolak H0. Saat n membesar, s → σ dan t → z.",
        "Contoh harga asumsi yang salah: satu grup variasinya 3× lipat, n tak seimbang. Student memberi p = 0,041 (signifikan!) sementara Welch p = 0,083 (tidak signifikan). Asumsi variansi sama yang dilanggar membuat Student terlalu percaya diri. Dan saat membaca laporan, lirik df-nya: t(8) = 2,1 jauh lebih meyakinkan daripada t(200) = 2,1? Sebaliknya — df besar berarti estimasi stabil. Jangan baca t tanpa df.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai z (bukan t) pada n kecil tidak masalah. Salah — untuk n ≥ 30 beda t vs z bisa diabaikan, tapi untuk n kecil memakai z membuatmu terlalu gampang mengklaim signifikan. Ekor tebal t adalah kejujuran atas ketidaktahuan tentang σ.",
      },
      reference: "t(df) selalu dilaporkan dengan df — df kecil = ambang lebih tinggi.",
    },
    {
      id: "berpasangan",
      eyebrow: "Langkah 5 · Uji-t berpasangan",
      title: "Setiap subjek jadi kontrolnya sendiri",
      prose: [
        "Jika dua pengukuran berpasangan (sebelum–sesudah pada orang yang sama), jangan uji dua grup independen — uji selisihnya: t = d̄/(sd/√n). Ini tak lain uji-t satu sampel pada data selisih dengan H0: mean selisih = 0.",
        "Contoh: 8 nasabah, selisih saldo (jt) sebelum–sesudah program: [2, 3, 1, 4, 2, 5, 3, 4]. d̄ = 3; sd ≈ 1,31; t = 3/(1,31/√8) ≈ 6,48, df = 7 → p < 0,001 → tolak H0. Variasi antar orang (ada yang memang boros, ada yang hemat) hilang karena tiap orang dibandingkan dengan dirinya sendiri — power jauh lebih tinggi untuk n yang sama. Syarat: pasangannya bermakna — memasangkan data yang sebenarnya independen lalu memakai uji berpasangan adalah kesalahan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `d_mean` = rata-rata [2,3,1,4,2,5,3,4]" },
        { id: "t2", text: "Hitung `t` = d_mean/(sd/√8) dengan sd = √(Σ(d−d̄)²/7), bulatkan 2 desimal" },
      ],
      expected: "d_mean=3  t=6.48",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Data sebelum–sesudah dianalisis sebagai dua grup independen — hasilnya sama saja. Salah — uji independen mencampur variasi antar-individu ke dalam error, padahal desain berpasangan bisa menghilangkannya via selisih. Memilih uji yang salah untuk desain yang benar = membuang power gratis.",
      },
      hints: [
        "d_mean = sum(d)/8 = 3.",
        "sd = math.sqrt(12/7) — jumlah kuadrat deviasi = 12.",
        "t = round(3 / (math.sqrt(12/7)/math.sqrt(8)), 2).",
      ],
      code: {
        starter: `import math\nd = [2, 3, 1, 4, 2, 5, 3, 4]\n\n# TULIS KODEMU\nd_mean = \nt = \n\nprint(f"d_mean={d_mean}  t={t}")`,
        lockLines: 2,
        solution: `import math\nd = [2, 3, 1, 4, 2, 5, 3, 4]\n\n# TULIS KODEMU\nd_mean = sum(d)/len(d)\nsd = math.sqrt(sum((x-d_mean)**2 for x in d)/7)\nt = round(d_mean / (sd/math.sqrt(8)), 2)\n\nprint(f"d_mean={d_mean}  t={t}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d_mean", value: 3, tol: 1e-9, label: "`d_mean` seharusnya 3", msg: "Rata-rata selisih = 3 jt." },
          { kind: "equal", task: "t2", name: "t", value: 6.48, tol: 0.01, label: "`t` seharusnya 6.48", msg: "t ≈ 6,48, df=7 → p < 0,001." },
          { kind: "stdout_matches", task: "t2", pattern: "d_mean=3(\\.0)?\\s+t=6\\.48", label: "`print` menampilkan keduanya", msg: "Format: d_mean=...  t=... ." },
        ],
      },
      reference: "Berpasangan = uji-t satu sampel pada selisih.",
    },
    {
      id: "anova",
      eyebrow: "Langkah 6 · ANOVA",
      title: "Satu uji untuk banyak kelompok",
      prose: [
        "ANOVA satu arah menguji H0: μ1 = μ2 = … = μk dengan F = MSB/MSW — variasi antar-kelompok dibagi variasi dalam-kelompok (noise latar). Jika semua mean sama, F ≈ 1; jika kelompok beda jauh relatif terhadap noise, F besar → tolak H0.",
        "Mengapa tidak 3× uji-t? Setiap uji-t pada α=5% punya 5% false positive — tiga uji (A–B, A–C, B–C) → peluang ≥1 false positive ≈ 14%; 10 kelompok (45 pasangan) → 90%! ANOVA menjaga error keseluruhan tetap 5% dengan satu pertanyaan global. Jika signifikan, barulah post-hoc (Tukey HSD) mencari pasangan mana yang beda.",
      ],
      formula: String.raw`F = \frac{MS_B}{MS_W}, \quad H_0: \mu_1 = \mu_2 = \dots = \mu_k`,
      formulaNote: "F = statistik uji ANOVA; MS_B = variansi antar-kelompok (sinyal); MS_W = variansi dalam-kelompok (noise latar); mu_1..mu_k = mean populasi tiap kelompok; H0 = semua mean sama.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "ANOVA signifikan berarti semua kelompok beda. Salah — ANOVA hanya bilang minimal satu pasangan beda, tidak bilang pasangan mana, apalagi semuanya. Melompat dari ANOVA signifikan ke A > B > C adalah lompatan logika. Untuk mananya butuh post-hoc Tukey HSD dengan koreksi multiple comparison.",
      },
      reference: "ANOVA menjawab apakah ada beda; post-hoc menjawab mana yang beda.",
    },
    {
      id: "minicase-3cabang",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Tiga cabang, klaim B paling lambat",
      prose: [
        "Waktu persetujuan KPR (hari), masing-masing 40 aplikasi: A mean 12,5 (s=3,2); B mean 14,8 (s=3,0); C mean 13,1 (s=3,4). Kepala operasional: jelas B paling lambat, tegur!",
        "(a) Uji tepat: ANOVA satu arah. Tiga uji-t berpasangan menaikkan peluang false positive gabungan ke ~14%. (b) ANOVA: F = 4,2, p = 0,017 → minimal satu pasangan cabang berbeda signifikan — bukan B paling lambat. ANOVA tidak bilang pasangan mana. (c) Berikutnya: Tukey HSD untuk pasangan mana yang beda + effect size (selisih 2,3 hari dengan CI-nya — apakah penting secara bisnis?). Dan cek confounder: apakah B menangani aplikasi yang memang lebih kompleks? Beda mean tanpa konteks = vonis tanpa investigasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fpr_3uji` = 1 − 0,95³ (peluang ≥1 false positive dari 3 uji-t), bulatkan 3 desimal" },
        { id: "t2", text: "Catat `f` = 4,2 (statistik F dari ANOVA)" },
      ],
      expected: "fpr_3uji=0.143  f=4.2",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menegur kepala cabang B dari ANOVA signifikan adalah lompatan logika — ANOVA tidak bilang B yang beda. Vonis operasional butuh post-hoc + effect size + cek confounder (kompleksitas aplikasi).",
      },
      hints: [
        "fpr_3uji = round(1 - 0.95**3, 3).",
        "f = 4.2 dari hasil ANOVA.",
        "p = 0,017 < 0,05 → tolak H0 global.",
      ],
      code: {
        starter: `# 3 cabang -> 3 uji-t berpasangan vs 1 ANOVA\n\n# TULIS KODEMU\nfpr_3uji = \nf = \n\nprint(f"fpr_3uji={fpr_3uji}  f={f}")`,
        lockLines: 1,
        solution: `# 3 cabang -> 3 uji-t berpasangan vs 1 ANOVA\n\n# TULIS KODEMU\nfpr_3uji = round(1 - 0.95**3, 3)\nf = 4.2  # dari ANOVA; p = 0.017\n\nprint(f"fpr_3uji={fpr_3uji}  f={f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fpr_3uji", value: 0.143, tol: 0.001, label: "`fpr_3uji` seharusnya 0.143", msg: "1 − 0,95³ ≈ 14% — error menumpuk." },
          { kind: "equal", task: "t2", name: "f", value: 4.2, tol: 1e-9, label: "`f` seharusnya 4.2", msg: "F = 4,2, p = 0,017 → minimal satu pasangan beda." },
          { kind: "stdout_matches", task: "t2", pattern: "fpr_3uji=0\\.143\\s+f=4\\.2", label: "`print` menampilkan keduanya", msg: "Format: fpr_3uji=...  f=... ." },
        ],
      },
      reference: "ANOVA signifikan ≠ B paling lambat. Lanjut post-hoc + effect size.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Uji-z: σ diketahui (atau n sangat besar); praktis jarang.",
        "Welch = default untuk dua sampel independen — tanpa asumsi variansi sama.",
        "Distribusi-t berekor tebal karena s diestimasi; untuk n kecil wajib t.",
        "Data berpasangan → uji-t pada selisih; jangan perlakukan sebagai independen.",
        "Banyak kelompok → ANOVA dulu (jaga error 5%), baru post-hoc Tukey.",
      ],
      next: { label: "A2.6 — Uji Nonparametrik", href: "/v2/learn/a26-nonparametrik" },
      quiz: [
        {
          q: "Kapan uji-z (bukan uji-t) yang tepat dipakai?",
          options: [
            { text: "Selalu — lebih sederhana", why: "Kesederhanaan bukan alasan — uji-z butuh asumsi yang nyaris tak terpenuhi." },
            { text: "Ketika σ populasi diketahui (atau n sangat besar sehingga s ≈ σ)", why: "Untuk n besar t ≈ z; untuk n kecil dengan σ tak diketahui wajib t.", correct: true },
            { text: "Ketika n < 30", why: "Justru untuk n kecil uji-t yang wajib — ekor tebalnya melindungi." },
            { text: "Ketika data tidak normal", why: "Non-normalitas soal asumsi distribusi, bukan soal z vs t." },
          ],
        },
        {
          q: "Dua grup independen, n1=15, n2=60, variansi terlihat beda jauh. Uji terbaik?",
          options: [
            { text: "Uji-t Student (pooled)", why: "Asumsi variansi sama dilanggar + n tak seimbang = Student paling meleset." },
            { text: "Uji-t Welch — tanpa asumsi variansi sama", why: "Welch menangani variansi beda dan n tak seimbang tanpa asumsi tambahan.", correct: true },
            { text: "Uji-t berpasangan", why: "Grup independen — tidak ada pasangan yang bermakna." },
            { text: "ANOVA", why: "ANOVA untuk 3+ kelompok; ini hanya dua." },
          ],
        },
        {
          q: "Mengapa distribusi-t berekor lebih tebal dari normal pada df kecil?",
          options: [
            { text: "Karena rumusnya salah", why: "Rumusnya benar — ekor tebal itu disengaja." },
            { text: "Karena s diestimasi dari data (ketidakpastian ganda) — t mengompensasi dengan lebih sulit menolak H0", why: "Ekor tebal = kejujuran atas ketidaktahuan tentang σ.", correct: true },
            { text: "Karena data selalu miring", why: "Bukan soal kemiringan data — soal s yang diestimasi." },
            { text: "Karena n selalu kurang", why: "Saat n besar t menyatu dengan normal — ekor tebal spesifik df kecil." },
          ],
        },
        {
          q: "Studi sebelum–sesudah pada 30 pasien dianalisis sebagai dua grup independen. Apa akibatnya?",
          options: [
            { text: "Tidak ada — hasilnya sama", why: "Ada: variasi antar-pasien mencemari uji." },
            { text: "Power turun: variasi antar-pasien yang bisa dibuang via selisih berpasangan malah mencemari uji", why: "Memilih uji yang salah untuk desain yang benar = membuang power gratis.", correct: true },
            { text: "p-value jadi terlalu kecil", why: "Sebaliknya — SE membesar, p-value cenderung membesar." },
            { text: "Wajib pakai ANOVA", why: "ANOVA bukan solusi untuk data berpasangan dua waktu." },
          ],
        },
        {
          q: "Membandingkan 5 varian iklan dengan 10 uji-t berpasangan (α=5% tiap uji). Masalahnya?",
          options: [
            { text: "Tidak ada — tiap uji valid", why: "Tiap uji valid sendiri-sendiri, tapi error gabungannya menumpuk." },
            { text: "Peluang ≥1 false positive ≈ 40%. Seharusnya ANOVA dulu, baru post-hoc terkoreksi", why: "1 − 0,95¹⁰ ≈ 40% — error menumpuk multiplikatif.", correct: true },
            { text: "Sampel kurang", why: "Masalahnya jumlah uji, bukan ukuran sampel." },
            { text: "Harus pakai uji-z", why: "Uji-z tidak menyelesaikan masalah multiple testing." },
          ],
        },
      ],
      note: {
        title: "Intuisi: setiap uji beda mean adalah timbangan selisih melawan noise",
        body: "Enam heuristik. Satu: setiap uji beda mean adalah timbangan — selisih di satu piring, noise (standard error) di piring lain; selisih besar tidak ada artinya bila noise-nya raksasa. Dua: jadikan Welch default — asumsi variansi sama jarang sekali gratis, dan Welch hampir tidak kehilangan apa-apa saat asumsi itu benar. Tiga: data berpasangan adalah hadiah — setiap subjek menjadi kontrolnya sendiri sehingga variasi antar orang terbuang dan power naik; jangan sia-siakan dengan uji independen. Empat: ANOVA dulu, baru post-hoc — tiga uji-t tanpa koreksi berarti peluang false positive gabungan 14 persen; satu uji global menjaga gerbangnya. Lima: p kecil plus n besar tidak sama dengan penting — selalu sertakan besar selisih dan intervalnya; dan pastikan mean memang bermakna untuk datamu — untuk distribusi yang sangat miring, pertimbangkan ulang sebelum menguji mean. Enam: cek asumsi sebelum percaya p-value — normalitas (untuk n kecil) dan independensi observasi; pelanggaran independensi (data berklaster) adalah pembunuh diam-diam yang membuat SE terlalu kecil.",
      },
    },
  ],
};
