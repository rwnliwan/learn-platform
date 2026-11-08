import type { V2Lesson } from "../lib/types";

export const b4: V2Lesson = {
  slug: "b4-bayes",
  track: "Probabilitas",
  module: "Fondasi Peluang",
  title: "B4. Teorema Bayes: Membalik Arah Peluang",
  estMinutes: 55,
  steps: [
    {
      id: "tes-menipu",
      eyebrow: "Langkah 1 · Tes 99% akurat",
      title: "Alarm berbunyi \u2014 berapa peluang benar fraud?",
      prose: [
        "Sebuah tes fraud diklaim 99% akurat: jika transaksi fraud, 99% terdeteksi; jika bukan fraud, 99% dinyatakan bersih. Alarm berbunyi untuk transaksimu. \u201CBerapa peluang transaksi ini benar-benar fraud?\u201D Kebanyakan menjawab 99%. Jawaban yang benar: sekitar 9%.",
        "Kok bisa? Karena fraud itu langka \u2014 hanya 1 dari 1.000 transaksi. Dari 1.000 transaksi: 1 fraud (terdeteksi) + 999 bukan fraud (1% salah alarm \u2248 10 alarm palsu). Total 11 alarm, hanya 1 yang benar \u2192 1/11 \u2248 9%. Akurasi tes tidak sama dengan kepercayaan pada hasil positif \u2014 yang menentukan adalah base rate.",
        "Teorema Bayes adalah mesin matematika untuk hitungan seperti ini. Tesnya memang 99% akurat \u2014 dan jawaban 9% juga benar. Keduanya menjawab pertanyaan berbeda: \u201Cseberapa bagus tesnya\u201D vs \u201Cseberapa percaya aku pada alarm ini\u201D. Bayes adalah penerjemah di antara keduanya.",
      ],
      formula: String.raw`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B \mid A)\,P(A) + P(B \mid A^c)\,P(A^c)}`,
      formulaNote: "P(A) = prior (base rate!), P(B|A) = likelihood, penyebut = peluang total melihat bukti, P(A|B) = posterior.",
      tasks: [
        { id: "t1", text: "Hitung `pembilang` = P(alarm|fraud) \u00D7 P(fraud)" },
        { id: "t2", text: "Hitung `penyebut` lalu `posterior = pembilang/penyebut`, cetak" },
      ],
      expected: "posterior=0.0902",
      note: {
        title: "Sering salah",
        body: "\u201CTes 99% akurat \u2192 hasil positif berarti 99% benar.\u201D Akurasi menjawab \u201Cgiven sakit, berapa % terdeteksi\u201D \u2014 bukan \u201Cgiven positif, berapa % sakit\u201D. Yang kedua butuh base rate. Jangan pernah menafsirkan hasil tes tanpa prevalensi.",
      },
      hints: [
        "pembilang = 0.99 * 0.001.",
        "penyebut = pembilang + 0.01 * 0.999.",
        "posterior = pembilang / penyebut; cetak 4 desimal.",
      ],
      code: {
        starter: `base_rate = 0.001   # P(fraud)\nsens = 0.99         # P(alarm | fraud)\nfalse_alarm = 0.01  # P(alarm | bukan fraud)\n\n# TULIS KODEMU: P(fraud | alarm) via Bayes\npembilang = \npenyebut = \nposterior = \n\nprint(f"posterior={posterior:.4f}")`,
        lockLines: 3,
        solution: `base_rate = 0.001   # P(fraud)\nsens = 0.99         # P(alarm | fraud)\nfalse_alarm = 0.01  # P(alarm | bukan fraud)\n\n# TULIS KODEMU: P(fraud | alarm) via Bayes\npembilang = sens * base_rate\npenyebut = pembilang + false_alarm * (1 - base_rate)\nposterior = pembilang / penyebut\n\nprint(f"posterior={posterior:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pembilang", value: 0.00099, tol: 1e-9, label: "`pembilang` seharusnya 0,00099", msg: "0,99 \u00D7 0,001 = 0,00099." },
          { kind: "equal", task: "t2", name: "posterior", value: 0.09016, tol: 0.001, label: "`posterior` seharusnya \u2248 0,090", msg: "0,00099 / 0,01098 \u2248 0,0902." },
          { kind: "stdout_matches", task: "t2", pattern: "posterior=0\\.0902", label: "`print` menampilkan posterior", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Prior \u00D7 likelihood / evidence. Penyebut via hukum peluang total.",
    },
    {
      id: "frekuensi-natural",
      eyebrow: "Langkah 2 · Frekuensi natural",
      title: "Berpikir \u201Cdari 1.000\u2026\u201D, bukan persen",
      prose: [
        "Otak manusia (termasuk dokter dan analis!) jauh lebih akurat menalar frekuensi daripada persen bersyarat. Ulangi hitungan langkah 1 dengan frekuensi natural: dari 1.000 transaksi, 1 fraud \u2192 terdeteksi (99% \u2248 1 alarm benar); 999 bukan fraud \u2192 1% salah alarm \u2248 10 alarm palsu.",
        "Total 11 alarm, 1 benar \u2192 1/11 \u2248 9,1%. Angka yang sama, tapi sekarang intuisimu ikut setuju. Ini juga trik komunikasi: jelaskan Bayes ke direksi dengan \u201Cdari 1.000\u2026\u201D, bukan dengan rumus.",
        "Pelajaran operasional dari grafik lesson lama: alarm menaikkan keyakinan 90x lipat (0,1% \u2192 9%) \u2014 tesnya berguna! Tapi 9% \u2260 99%. Setiap alarm fraud masih 91% false positive \u2192 butuh investigasi, bukan blokir otomatis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `alarm_benar` dan `alarm_palsu` dari 1.000 transaksi" },
        { id: "t2", text: "Hitung `p` = alarm_benar / total alarm, cetak sebagai persen" },
      ],
      expected: "p=9.09%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah mengapa fraud punya tim investigator, bukan sekadar rule: tiap alarm masih 91% palsu. Keputusan proporsional dengan posterior \u2014 investigasi bertingkat, bukan blokir otomatis.",
      },
      hints: [
        "alarm_benar = 1 * 0.99; alarm_palsu = 999 * 0.01.",
        "p = alarm_benar / (alarm_benar + alarm_palsu).",
        "print(f\"p={p:.2%}\")",
      ],
      code: {
        starter: `N = 1000\nfraud = 1\nbersih = 999\n\n# TULIS KODEMU: alarm benar vs palsu, lalu P(fraud|alarm)\nalarm_benar = \nalarm_palsu = \np = \n\nprint(f"p={p:.2%}")`,
        lockLines: 3,
        solution: `N = 1000\nfraud = 1\nbersih = 999\n\n# TULIS KODEMU: alarm benar vs palsu, lalu P(fraud|alarm)\nalarm_benar = fraud * 0.99\nalarm_palsu = bersih * 0.01\np = alarm_benar / (alarm_benar + alarm_palsu)\n\nprint(f"p={p:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "alarm_palsu", value: 9.99, tol: 1e-9, label: "`alarm_palsu` seharusnya 9,99", msg: "999 \u00D7 0,01 = 9,99." },
          { kind: "equal", task: "t2", name: "p", value: 0.99 / 10.98, tol: 0.001, label: "`p` seharusnya \u2248 9,02%", msg: "0,99 / (0,99 + 9,99) \u2248 0,0902." },
          { kind: "stdout_matches", task: "t2", pattern: "p=9\\.0", label: "`print` menampilkan persen", msg: "Format persen, sekitar 9%." },
        ],
      },
      reference: "Frekuensi natural: \u201Cdari 1.000 transaksi, berapa alarm benar vs palsu?\u201D",
    },
    {
      id: "lab-monty-hall",
      eyebrow: "Langkah 3 · Lab Monty Hall",
      title: "\u201CGanti pintu\u201D menang 2/3",
      prose: [
        "Tiga pintu, satu mobil. Kamu pilih pintu 1. Pembawa acara (yang tahu di mana mobil) membuka pintu 3 \u2014 kosong \u2014 lalu bertanya: tetap atau ganti ke pintu 2? Intuisi bilang 50:50. Bayes bilang ganti menang 2/3.",
        "Mengapa? Prior: mobil di pintu 1 = 1/3. Pembuka tidak membuka acak \u2014 jika mobil di pintu 2 (peluang 2/3), ia dipaksa membuka pintu 3. Jadi \u201Cia membuka pintu 3\u201D justru mengonfirmasi pintu 2. Posterior \u221D prior \u00D7 likelihood: pintu 1 \u221D (1/3)(1/2) = 1/6, pintu 2 \u221D (1/3)(1) = 1/3 \u2192 dinormalisasi jadi 2/3 untuk pintu 2.",
        "Simulasi 8.000 ronde membuktikannya: strategi ganti menang sekitar 66,7%, tetap sekitar 33,3%. Intuisimu akan kalah dari angka.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `N=8000` ronde Monty Hall" },
        { id: "t2", text: "Hitung `w_tetap` dan `w_ganti` sebagai proporsi" },
        { id: "t3", text: "Cetak keduanya sebagai persen" },
      ],
      expected: "tetap\u224833.33%  ganti\u224866.67%",
      note: {
        title: "Sering salah",
        body: "\u201CSetelah satu pintu dibuka, peluangnya 50:50.\u201D Hanya benar jika pembuka tidak tahu dan membuka acak. Karena ia tahu dan menghindari mobil, buktinya informatif \u2014 posterior bergeser ke 2/3.",
      },
      hints: [
        "mobil = random.randrange(3); pilih = random.randrange(3).",
        "buka = pilihan acak dari pintu yang bukan pilihanmu dan bukan mobil.",
        "ganti = satu-satunya pintu yang bukan pilihan dan bukan yang dibuka.",
      ],
      code: {
        starter: `import random\nrandom.seed(5)\nN = 8000\nmenang_tetap = menang_ganti = 0\n\nfor _ in range(N):\n    mobil = random.randrange(3)\n    pilih = random.randrange(3)\n    buka = random.choice([p for p in range(3) if p != pilih and p != mobil])\n    # TULIS KODEMU: tentukan pintu "ganti", hitung kemenangan\n    ganti = \n    if pilih == mobil: menang_tetap += 1\n    if ganti == mobil: menang_ganti += 1\n\nw_tetap = menang_tetap / N\nw_ganti = menang_ganti / N\nprint(f"tetap={w_tetap:.2%}  ganti={w_ganti:.2%}")`,
        lockLines: 8,
        solution: `import random\nrandom.seed(5)\nN = 8000\nmenang_tetap = menang_ganti = 0\n\nfor _ in range(N):\n    mobil = random.randrange(3)\n    pilih = random.randrange(3)\n    buka = random.choice([p for p in range(3) if p != pilih and p != mobil])\n    # TULIS KODEMU: tentukan pintu "ganti", hitung kemenangan\n    ganti = [p for p in range(3) if p != pilih and p != buka][0]\n    if pilih == mobil: menang_tetap += 1\n    if ganti == mobil: menang_ganti += 1\n\nw_tetap = menang_tetap / N\nw_ganti = menang_ganti / N\nprint(f"tetap={w_tetap:.2%}  ganti={w_ganti:.2%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "ganti", label: "`ganti` terdefinisi", msg: "Tentukan pintu ganti: yang bukan pilihan dan bukan yang dibuka." },
          { kind: "equal", task: "t2", name: "w_tetap", value: 1 / 3, tol: 0.03, label: "`w_tetap` mendekati 1/3", msg: "Dengan seed 5, strategi tetap menang ~33%." },
          { kind: "equal", task: "t2", name: "w_ganti", value: 2 / 3, tol: 0.03, label: "`w_ganti` mendekati 2/3", msg: "Dengan seed 5, strategi ganti menang ~67%." },
        ],
      },
      reference: "Bukti dari agen yang tahu = informatif. Posterior pintu lain = 2/3.",
    },
    {
      id: "update-sekuensial",
      eyebrow: "Langkah 4 · Update sekuensial",
      title: "Posterior kemarin = prior hari ini",
      prose: [
        "Kasus skrining penyakit: prevalensi 2%, tes sensitivitas 95%, false positive 5%. Tes pertama positif \u2192 posterior = 0,95\u00D70,02 / (0,95\u00D70,02 + 0,05\u00D70,98) = 0,019/0,068 \u2248 27,9%. Tes \u201C95% akurat\u201D \u2192 kepercayaan 28%. Base rate rendah = mayoritas positif adalah false positive.",
        "Sekarang tes kedua (independen, spesifikasi sama) positif lagi. Posterior lama jadi prior baru: pembilang 0,95\u00D70,279 = 0,265; penyebut 0,265 + 0,05\u00D70,721 = 0,301; posterior \u2248 88%. Dua bukti independen yang konsisten melontarkan keyakinan 28% \u2192 88%.",
        "Inilah cara belajar yang benar: inkremental, bukan all-or-nothing. Dan ini fondasi B17 (Bayesian praktis): skor fraud nasabah diupdate tiap transaksi baru.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `post1` = posterior setelah tes pertama positif" },
        { id: "t2", text: "Pakai `post1` sebagai prior, hitung `post2` setelah tes kedua positif" },
        { id: "t3", text: "Cetak keduanya dengan 1 desimal persen" },
      ],
      expected: "post1=27.9%  post2=88.0%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Skor fraud yang baik bekerja persis begini: prior dari histori nasabah, diupdate tiap transaksi baru. Keputusan tidak diambil dari satu alarm mentah.",
      },
      hints: [
        "post1 = 0.95*0.02 / (0.95*0.02 + 0.05*0.98).",
        "post2 = 0.95*post1 / (0.95*post1 + 0.05*(1-post1)).",
        "print(f\"post1={post1:.1%}  post2={post2:.1%}\")",
      ],
      code: {
        starter: `sens, fp = 0.95, 0.05   # sensitivitas & false positive\nprior = 0.02            # prevalensi\n\n# TULIS KODEMU: update dua kali\npost1 = \npost2 = \n\nprint(f"post1={post1:.1%}  post2={post2:.1%}")`,
        lockLines: 2,
        solution: `sens, fp = 0.95, 0.05   # sensitivitas & false positive\nprior = 0.02            # prevalensi\n\n# TULIS KODEMU: update dua kali\npost1 = sens*prior / (sens*prior + fp*(1-prior))\npost2 = sens*post1 / (sens*post1 + fp*(1-post1))\n\nprint(f"post1={post1:.1%}  post2={post2:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "post1", value: 0.2794, tol: 0.002, label: "`post1` seharusnya \u2248 27,9%", msg: "0,019/0,068 \u2248 0,2794." },
          { kind: "equal", task: "t2", name: "post2", value: 0.8804, tol: 0.003, label: "`post2` seharusnya \u2248 88,0%", msg: "Pakai post1 sebagai prior: 0,265/0,301 \u2248 0,880." },
          { kind: "stdout_matches", task: "t3", pattern: "post1=27\\.9%\\s+post2=88", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Posterior kemarin = prior hari ini. Belajar = update inkremental.",
    },
    {
      id: "minicase-blokir",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Blokir otomatis atau investigasi?",
      prose: [
        "Startup paylater memakai rule: \u201Cskor fraud > 0,8 \u2192 blokir otomatis\u201D. Vendor mengklaim sensitivitas 95%, false positive 5%. Base rate fraud aktual: 0,5%. Hitung: P(alarm) = 0,95\u00D70,005 + 0,05\u00D70,995 = 0,00475 + 0,04975 = 0,0545. P(fraud|alarm) = 0,00475/0,0545 \u2248 8,7%.",
        "Blokir otomatis salah: 91% yang diblokir adalah pelanggan sah \u2014 bencana churn dan komplain. Alternatif Bayesian: pakai posterior 8,7% sebagai prior untuk investigasi bertingkat \u2014 verifikasi ringan (OTP/biometrik) dulu, eskalasi hanya jika bukti tambahan menaikkan posterior.",
        "Inilah pola step-up authentication di industri: keputusan proporsional dengan posterior, bukan biner dari alarm mentah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `posterior` = P(fraud | skor > 0,8)" },
        { id: "t2", text: "Cetak `posterior` dengan 1 desimal persen" },
      ],
      expected: "posterior=8.7%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Blokir otomatis dari posterior 8,7% berarti membuang 91 pelanggan sah untuk tiap 9 fraud yang tertangkap. Biaya false positive harus masuk ke keputusan threshold.",
      },
      hints: [
        "pembilang = 0.95 * 0.005.",
        "penyebut = pembilang + 0.05 * 0.995.",
        "print(f\"posterior={posterior:.1%}\")",
      ],
      code: {
        starter: `base_rate, sens, fp = 0.005, 0.95, 0.05\n\n# TULIS KODEMU: P(fraud | skor > 0,8)\nposterior = \n\nprint(f"posterior={posterior:.1%}")`,
        lockLines: 1,
        solution: `base_rate, sens, fp = 0.005, 0.95, 0.05\n\n# TULIS KODEMU: P(fraud | skor > 0,8)\nposterior = sens*base_rate / (sens*base_rate + fp*(1-base_rate))\n\nprint(f"posterior={posterior:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "posterior", value: 0.08716, tol: 0.001, label: "`posterior` seharusnya \u2248 8,7%", msg: "0,00475/0,0545 \u2248 0,0872." },
          { kind: "stdout_matches", task: "t2", pattern: "posterior=8\\.7%", label: "`print` menampilkan posterior", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Keputusan proporsional dengan posterior, bukan biner dari alarm.",
    },
    {
      id: "arah-dan-prior",
      eyebrow: "Langkah 6 · Prior dan arah",
      title: "Prior yang jujur, arah yang tepat",
      prose: [
        "Bayes tidak menciptakan info dari nol; ia mengkombinasikan info lama + baru secara konsisten. Prior yang jujur memakai pengetahuan domain (base rate historis) \u2014 prior \u201Cnetral\u201D seperti uniform bisa menyesatkan untuk kejadian langka.",
        "Dan disiplin bertanya: \u201Cseberapa mungkin saya melihat bukti ini, jika hipotesis saya benar vs salah?\u201D Itulah likelihood ratio \u2014 jantung kepribadian Bayes, bukan sekadar rumusnya.",
        "Peta keputusan: ada hasil tes/alarm \u2192 tanya base rate dulu. Keyakinan + bukti berdatangan \u2192 update sekuensial. Bukti dari agen yang tahu sesuatu \u2192 waspadai seleksi (modelkan prosesnya). Punya P(B|A) tapi butuh P(A|B) \u2192 Bayes menjembatani.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dalam Bayes, \u201Cprior\u201D adalah\u2026",
          options: [
            { text: "Hasil akhir setelah bukti", why: "Salah: itu posterior." },
            { text: "Keyakinan sebelum melihat bukti (base rate)", why: "Benar: prior = P(A) sebelum bukti. Tanpa prior yang jujur, posterior ikut ngawur.", correct: true },
            { text: "Akurasi tes", why: "Salah: akurasi tes adalah likelihood." },
          ],
        },
        {
          q: "Kapan posterior \u2248 prior (bukti tidak mengubah keyakinan)?",
          options: [
            { text: "Bukti sangat kuat", why: "Salah: bukti kuat justru menggeser posterior jauh." },
            { text: "Bukti tidak informatif: P(bukti|A) = P(bukti|bukan A)", why: "Benar: likelihood ratio = 1 \u2192 posterior = prior.", correct: true },
            { text: "Prior = 50%", why: "Salah: prior 50% tetap bisa digeser bukti informatif." },
          ],
        },
      ],
      note: {
        title: "Intuisi: prior dulu, bukti kemudian — urutan berpikir yang anti-panik",
        body: "Saat alarm berbunyi, insting berkata lihat buktinya dulu. Praktisi Bayesian membalik: tanyakan base rate-nya dulu. Alarm fraud 99% akurat di populasi dengan 1 fraud per 10.000 transaksi tetap berarti sebagian besar alarm adalah palsu — bukan karena sensornya buruk, melainkan karena priornya kecil. Heuristiknya: posterior adalah prior yang diperbarui bukti, bukan bukti yang berdiri sendiri. Bukti lemah tidak bisa menggerakkan prior yang kuat terlalu jauh, dan itu fitur, bukan bug — ia yang mencegah kepanikan cabang baru dengan 3 gagal dari 10 nasabah. Aturan keputusan: jika datamu sedikit, pinjamlah kekuatan dari pengalaman populasi; jika datamu banyak, biarkan data berbicara dan prior memudar sendiri. Jebakan yang dirasakan praktisi: memilih prior yang nyaman, bukan yang jujur — prior adalah tempat bias menyelinap masuk dengan baju matematika. Dan ingat sifat sekuensialnya: posterior kemarin adalah prior hari ini. Jangan mulai dari nol setiap pagi; perbarui, jangan reset. Itulah cara berpikir Bayesian yang sebenarnya: bukan rumusnya, melainkan disiplin untuk tidak panik oleh data kecil.",
      },

      reference: "Prior jujur > prior netral. Likelihood ratio = jantung Bayes.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B5.",
      ],
      tasks: [],
      summary: [
        "Bayes = mesin pembalik: dari P(B|A) ke P(A|B) via prior.",
        "Base rate adalah raja: pada kondisi langka, mayoritas alarm positif adalah palsu.",
        "Frekuensi natural (\u201Cdari 1.000\u201D) mengalahkan persen untuk intuisi.",
        "Posterior hari ini = prior besok \u2014 belajar sekuensial (fondasi B17).",
        "Jangan menafsirkan akurasi tes sebagai kepercayaan hasil \u2014 dan jangan blokir otomatis dari posterior 9%.",
      ],
      next: { label: "B5 \u2014 Variabel Acak & Ekspektasi", href: "/v2/learn/b5-variabel-acak-ekspektasi" },
      quiz: [
        {
          q: "Tes 99% akurat, penyakit 0,1%. Hasil positif \u2192 peluang benar-benar sakit sekitar\u2026",
          options: [
            { text: "99%", why: "Salah: itu akurasi tes, bukan kepercayaan hasil positif \u2014 base rate fallacy." },
            { text: "50%", why: "Salah: tidak ada dasarnya." },
            { text: "9%", why: "Benar: ~9%. False positive dari populasi sehat yang besar menenggelamkan true positive.", correct: true },
            { text: "0,1%", why: "Salah: itu prior sebelum tes \u2014 bukti positif menaikkannya 90x lipat." },
          ],
        },
        {
          q: "Monty Hall: strategi optimal dan alasannya\u2026",
          options: [
            { text: "Tetap \u2014 sudah 50:50", why: "Salah: bukan 50:50 karena pembuka tahu letak mobil." },
            { text: "Ganti \u2014 menang 2/3 karena bukti pembawa acara informatif", why: "Benar: pembawa acara yang tahu \u201Cmembocorkan\u201D informasi lewat pilihannya \u2014 posterior pintu lain = 2/3.", correct: true },
            { text: "Acak saja", why: "Salah: strategi acak menang 50%, lebih buruk dari ganti." },
          ],
        },
        {
          q: "Alarm fraud dengan posterior 8,7%. Keputusan bisnis terbaik?",
          options: [
            { text: "Blokir otomatis semua", why: "Salah: 91% yang diblokir pelanggan sah \u2014 bencana churn." },
            { text: "Abaikan alarm", why: "Salah: alarm menaikkan keyakinan 17x dari base rate \u2014 informasinya berharga." },
            { text: "Investigasi bertingkat proporsional dengan posterior", why: "Benar: eskalasi bertingkat = keputusan proporsional risiko.", correct: true },
            { text: "Naikkan threshold sampai 99%", why: "Salah: threshold bukan solusi \u2014 masalahnya base rate, bukan sensitivitas." },
          ],
        },
        {
          q: "Frekuensi natural (\u201Cdari 1.000\u2026\u201D) disarankan karena\u2026",
          options: [
            { text: "Lebih presisi matematis", why: "Salah: presisinya sama dengan persen." },
            { text: "Otak manusia lebih akurat menalar frekuensi daripada persen bersyarat", why: "Benar: riset kognitif menunjukkan dokter/analis jauh lebih tepat dengan frekuensi natural.", correct: true },
            { text: "Disyaratkan regulator", why: "Salah: ini soal kognisi, bukan regulasi." },
          ],
        },
        {
          q: "Tes kedua positif setelah posterior 27,9% (spesifikasi sama). Posterior baru \u2248 88%. Pelajarannya?",
          options: [
            { text: "Tes pertama tidak berguna", why: "Salah: tes pertama menaikkan keyakinan 2% \u2192 28%." },
            { text: "Posterior kemarin = prior hari ini \u2014 belajar inkremental", why: "Benar: dua bukti konsisten melontarkan keyakinan 28% \u2192 88%.", correct: true },
            { text: "Dua tes selalu memberi 88%", why: "Salah: hasilnya tergantung prior awal dan spesifikasi tes." },
          ],
        },
      ],
    },
  ],
};
