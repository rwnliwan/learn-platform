import type { V2Lesson } from "../lib/types";

export const b6_1: V2Lesson = {
  slug: "b6-distribusi-diskret-1",
  track: "Probabilitas",
  module: "Distribusi",
  title: "B6.1 Distribusi Diskret 1: Bernoulli & Binomial",
  estMinutes: 55,
  steps: [
    {
      id: "bernoulli",
      eyebrow: "Langkah 1 · Bernoulli",
      title: "Satu nasabah, satu ya/tidak",
      prose: [
        "Bank punya 1.000 nasabah baru, masing-masing peluang gagal bayar 5% (independen). \u201CBerapa nasabah yang akan gagal tahun ini?\u201D \u201CEkspektasinya 50,\u201D jawab analis. \u201CTapi bisa 40, bisa 65.\u201D Ekspektasi tidak menjawab \u201Cberapa peluangnya\u201D \u2014 butuh distribusi: peta lengkap peluang untuk tiap kemungkinan jumlah.",
        "Mulai dari atomnya: Bernoulli(p). X = 1 (gagal) dengan peluang p, X = 0 (lancar) dengan peluang 1\u2212p. E[X] = p \u2014 ekspektasi = peluangnya sendiri! Var(X) = p(1\u2212p) \u2014 maksimal di p=0,5 (ketidakpastian terbesar), nol di p=0/1.",
        "Contoh: satu nasabah, gagal (1) p=5% / lancar (0) p=95%. E[X] = 0,05 = PD-nya. Ya \u2014 PD tidak lain adalah parameter Bernoulli! Setiap kali melihat \u201Cya/tidak\u201D, pasang kacamata Bernoulli dulu.",
      ],
      formula: String.raw`P(X=1) = p, \quad P(X=0) = 1-p \qquad E[X] = p \quad \mathrm{Var}(X) = p(1-p)`,
      formulaNote: "X = 1 berarti sukses (atau gagal bayar — labelnya arbitrer), X = 0 berarti sebaliknya; p = peluang X=1 per percobaan; 1−p = peluang X=0. E[X] = p: rata-rata jangka panjangnya tepat p. Var(X) = p(1−p): varians maksimum 0,25 di p = 0,5 (paling tidak pasti), mengecil menuju 0 di p ekstrem. Contoh angka: PD 5% per nasabah → E[X] = 0,05, Var = 0,0475, σ ≈ 0,218 — angka ini artinya tiap nasabah menyumbang 0,05 ke ekspektasi jumlah gagal; untuk 1.000 nasabah independen, ekspektasi 50 dengan σ ≈ √(1.000×0,0475) ≈ 6,9. Bernoulli adalah atomnya — Binomial hanyalah 1.000 atom ini dijumlahkan.",
      tasks: [
        { id: "t1", text: "Hitung `e` = E[X] untuk Bernoulli(p=0,05)" },
        { id: "t2", text: "Hitung `v` = Var(X), cetak keduanya dengan 4 desimal" },
      ],
      expected: "e=0.0500  v=0.0475",
      note: {
        title: "Sering salah",
        body: "Var Bernoulli = p (0,05). Itu rumus Poisson! Bernoulli: p(1\u2212p) = 0,0475. Untuk p kecil keduanya mirip, tapi untuk p=0,5 bedanya 2x lipat.",
      },
      hints: [
        "E[X] = p = 0.05.",
        "Var = p * (1 - p).",
        "print(f\"e={e:.4f}  v={v:.4f}\")",
      ],
      code: {
        starter: `p = 0.05  # PD satu nasabah\n\n# TULIS KODEMU: ekspektasi dan varians Bernoulli\ne = \nv = \n\nprint(f"e={e:.4f}  v={v:.4f}")`,
        lockLines: 1,
        solution: `p = 0.05  # PD satu nasabah\n\n# TULIS KODEMU: ekspektasi dan varians Bernoulli\ne = p\nv = p * (1 - p)\n\nprint(f"e={e:.4f}  v={v:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "e", value: 0.05, tol: 1e-9, label: "`e` seharusnya 0,05", msg: "E[X] = p." },
          { kind: "equal", task: "t2", name: "v", value: 0.0475, tol: 1e-9, label: "`v` seharusnya 0,0475", msg: "p(1\u2212p) = 0,05\u00D70,95 = 0,0475." },
          { kind: "stdout_matches", task: "t2", pattern: "e=0\\.0500\\s+v=0\\.0475", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bernoulli: E=p, Var=p(1\u2212p). PD = parameter Bernoulli.",
    },
    {
      id: "binomial",
      eyebrow: "Langkah 2 · Binomial",
      title: "Jumlah dari n Bernoulli independen",
      prose: [
        "Binomial(n,p): jumlah sukses dari n percobaan Bernoulli independen dengan p yang sama. P(X=k) = C(n,k) \u00D7 p^k \u00D7 (1\u2212p)^(n\u2212k). C(n,k) = banyak cara memilih posisi k sukses (kombinasi \u2014 B2!), p^k(1\u2212p)^(n\u2212k) = peluang satu pola spesifik.",
        "Contoh: 5 nasabah, PD 5% independen. Peluang tepat 2 gagal? n=5, k=2, p=0,05 \u2192 C(5,2) = 10 pola \u2192 P = 10 \u00D7 0,05\u00B2 \u00D7 0,95\u00B3 \u2248 0,0214 \u2248 2,1%.",
        "Syaratnya empat: (1) n tetap, (2) tiap percobaan ya/tidak, (3) p sama, (4) independen. Jebol satu saja \u2192 bukan Binomial. Default saat krisis (tidak independen \u2192 butuh Vasicek/B13), jumlah klaim per bulan (n tidak tetap \u2192 butuh Poisson/B6.2), sampling tanpa pengembalian dari populasi kecil (butuh Hipergeometrik).",
      ],
      formula: String.raw`P(X=k) = \binom{n}{k}\, p^k\, (1-p)^{\,n-k} \qquad E[X]=np \quad \mathrm{Var}(X)=np(1-p)`,
      formulaNote: "n = banyak percobaan; k = jumlah sukses yang ditanya; p = peluang sukses per percobaan (konstan!); C(n,k) = banyak cara memilih posisi k sukses di antara n; p^k = k sukses terjadi; (1−p)^(n−k) = sisanya gagal. E[X] = np, Var = np(1−p). Contoh angka: n = 1.000 nasabah, p = 5% → E = 50, Var = 47,5, σ ≈ 6,9 — angka ini artinya 70 gagal berada (70−50)/6,9 ≈ 2,9σ di atas rata-rata: peluangnya sekitar 0,2%, jadi ini sinyal, bukan noise. Tiga syaratnya — n tetap, p konstan, independen — jika satu dilanggar, interval np ± 2σ ini menjadi dekorasi.",
      tasks: [
        { id: "t1", text: "Hitung `p2` = P(tepat 2 gagal dari 5 nasabah)" },
        { id: "t2", text: "Cetak `p2` dengan 4 desimal" },
      ],
      expected: "p2=0.0214",
      note: {
        title: "Sering salah",
        body: "\u201CBinomial berlaku untuk semua jumlah kejadian.\u201D Hanya jika n tetap, p sama, independen. Soal \u201Cberapa percobaan sampai sukses pertama\u201D bukan Binomial \u2014 itu Geometrik (B6.2).",
      },
      hints: [
        "import math; C = math.comb.",
        "p2 = C(5,2) * 0.05**2 * 0.95**3.",
        "print(f\"p2={p2:.4f}\")",
      ],
      code: {
        starter: `import math\nC = math.comb\n\n# 5 nasabah, PD 5% independen\n# TULIS KODEMU: P(tepat 2 gagal)\np2 = \n\nprint(f"p2={p2:.4f}")`,
        lockLines: 2,
        solution: `import math\nC = math.comb\n\n# 5 nasabah, PD 5% independen\n# TULIS KODEMU: P(tepat 2 gagal)\np2 = C(5, 2) * 0.05**2 * 0.95**3\n\nprint(f"p2={p2:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p2", value: 0.02143, tol: 0.0002, label: "`p2` seharusnya \u2248 0,0214", msg: "10 \u00D7 0,05\u00B2 \u00D7 0,95\u00B3 \u2248 0,0214." },
          { kind: "stdout_matches", task: "t2", pattern: "p2=0\\.0214", label: "`print` menampilkan p2", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Binomial = jumlah n Bernoulli independen. E=np, Var=np(1\u2212p).",
    },
    {
      id: "mean-sd-sinyal",
      eyebrow: "Langkah 3 · Mean, SD, sinyal",
      title: "\u201C70 gagal\u201D: sinyal atau noise?",
      prose: [
        "1.000 nasabah, p=5% \u2192 E=50, SD = \u221A(1000\u00D70,05\u00D70,95) \u2248 6,9. Jadi \u201C50 \u00B1 14\u201D (\u00B12 SD) adalah rentang wajar. Ekspektasi 50 \u2014 tapi peluang tepat 50 yang gagal hanya ~5,8%! Angka rata-rata bukan angka yang paling mungkin terjadi.",
        "Tahun ini terjadi 70 gagal. Sinyal atau noise? z = (70\u221250)/6,9 \u2248 2,90. P(X \u2265 70) \u2248 0,21% \u2014 jika p benar 5%, kejadian ini hanya 2 dari 1.000 tahun. Sangat tidak mungkin \u2192 sinyal: PD kemungkinan naik (atau asumsi independen jebol \u2014 B13!).",
        "Distribusi mengubah \u201C70 vs 50\u201D (terlihat dekat) menjadi \u201C2,9 SD\u201D (sangat jauh). Tanpa distribusi, kamu tidak tahu mana yang dekat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sd` = SD Binomial(1000, 0,05)" },
        { id: "t2", text: "Hitung `z` untuk realisasi 70 gagal" },
        { id: "t3", text: "Cetak `sd` dan `z` dengan 2 desimal" },
      ],
      expected: "sd=6.89  z=2.90",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Realisasi > E + 3 SD = anomali, bukan noise. Inilah logika backtesting model: bandingkan realisasi vs distribusi yang diprediksi model.",
      },
      hints: [
        "sd = (1000*0.05*0.95)**0.5.",
        "z = (70 - 50) / sd.",
        "print(f\"sd={sd:.2f}  z={z:.2f}\")",
      ],
      code: {
        starter: `n, p = 1000, 0.05\n\n# TULIS KODEMU: SD dan z-score realisasi 70\nsd = \nz = \n\nprint(f"sd={sd:.2f}  z={z:.2f}")`,
        lockLines: 1,
        solution: `n, p = 1000, 0.05\n\n# TULIS KODEMU: SD dan z-score realisasi 70\nsd = (n * p * (1 - p)) ** 0.5\nz = (70 - n * p) / sd\n\nprint(f"sd={sd:.2f}  z={z:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd", value: 6.89, tol: 0.01, label: "`sd` seharusnya \u2248 6,89", msg: "\u221A(1000\u00D70,05\u00D70,95) \u2248 6,89." },
          { kind: "equal", task: "t2", name: "z", value: 2.9, tol: 0.02, label: "`z` seharusnya \u2248 2,90", msg: "(70\u221250)/6,89 \u2248 2,90." },
          { kind: "stdout_matches", task: "t3", pattern: "sd=6\\.89\\s+z=2\\.90", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "z = (realisasi \u2212 mean)/SD. > 3 = sinyal.",
    },
    {
      id: "lab-bentuk",
      eyebrow: "Langkah 4 · Lab bentuk",
      title: "Lihat bentuk Binomial berubah dengan p",
      prose: [
        "Hitung pmf Binomial manual dengan rumus B2+B5, lalu cetak sebagai bar teks. Untuk n=10, p=0,2: puncak di k=2 (= np), bentuknya miring kanan karena p kecil.",
        "Coba ubah p: p=0,5 \u2192 simetris (tiap pola dan cerminannya berpeluang sama); p=0,8 \u2192 miring kiri, cerminan p=0,2. Bentuk distribusi bukan dekorasi \u2014 ia menentukan di mana ekornya, dan ekor menentukan risiko.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `pmf(n, p, k)`" },
        { id: "t2", text: "Cetak pmf untuk n=10, p=0,2, k=0..10" },
      ],
      expected: "bar pmf tercetak, puncak di k=2",
      note: {
        title: "Sering salah",
        body: "Binomial selalu simetris. Hanya simetris saat p=0,5. Untuk p kecil (kasus kredit!), distribusi miring kanan \u2014 ekor kanannya yang menentukan unexpected loss.",
      },
      hints: [
        "pmf = math.comb(n,k) * p**k * (1-p)**(n-k).",
        "Loop k dari 0 sampai 10, cetak k dan pmf-nya.",
        "Puncak = k dengan pmf terbesar.",
      ],
      code: {
        starter: `import math\n\ndef pmf(n, p, k):\n    # TULIS KODEMU: rumus pmf Binomial\n    return \n\nfor k in range(11):\n    print(f"k={k:>2}  pmf={pmf(10, 0.2, k):.4f}")`,
        lockLines: 1,
        solution: `import math\n\ndef pmf(n, p, k):\n    # TULIS KODEMU: rumus pmf Binomial\n    return math.comb(n, k) * (p ** k) * ((1 - p) ** (n - k))\n\nfor k in range(11):\n    print(f"k={k:>2}  pmf={pmf(10, 0.2, k):.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pmf(10, 0.2, 2)", value: 0.302, tol: 0.001, label: "pmf(10, 0.2, 2) \u2248 0,302", msg: "C(10,2)\u00D70,2\u00B2\u00D70,8\u2078 \u2248 0,3020 \u2014 puncaknya." },
          { kind: "stdout_matches", task: "t2", pattern: "k=\\s*2\\s+pmf=0\\.3020", label: "`print` menampilkan puncak di k=2", msg: "Loop k=0..10 dan cetak pmf 4 desimal." },
        ],
      },
      reference: "math.comb(n,k). Puncak \u2248 np. p kecil \u2192 miring kanan.",
    },
    {
      id: "minicase-ab",
      eyebrow: "Langkah 5 · Mini-case",
      title: "A/B testing: 55 vs 45 klik",
      prose: [
        "Tim marketing: varian A diklik 45 dari 1.000 tayang, varian B 55 dari 1.000. \u201CB menang 22%!\u201D klaim mereka. Jika sebenarnya A dan B sama (p=0,05): tiap varian ~ Binomial(1000, 0,05) \u2192 Var = 47,5, SD \u2248 6,9. Selisih dua independen: Var = 95, SD \u2248 9,7.",
        "Selisih teramati 10 \u2248 1 SD \u2014 sangat wajar sebagai noise! Klaim \u201Cmenang 22%\u201D adalah ilusi persen dari angka kecil. Butuh selisih ~20 (2 SD) untuk mulai curiga, ~30 untuk yakin.",
        "Tanpa distribusi, \u201C55 vs 45\u201D terlihat meyakinkan; dengan Binomial, ia cuma noise. Ini fondasi A/B testing.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sd_beda` = SD selisih dua Binomial(1000, 0,05)" },
        { id: "t2", text: "Hitung `z` untuk selisih teramati 10, cetak keduanya" },
      ],
      expected: "sd_beda=9.75  z=1.03",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "\u201CMenang 22%\u201D dari angka kecil tanpa uji = keputusan bisnis di atas noise. Selalu bagi selisih dengan standar deviasinya sebelum mengklaim kemenangan.",
      },
      hints: [
        "Var tiap varian = 1000*0.05*0.95 = 47.5.",
        "sd_beda = (47.5 + 47.5)**0.5; z = 10/sd_beda.",
        "print(f\"sd_beda={sd_beda:.2f}  z={z:.2f}\")",
      ],
      code: {
        starter: `# A: 45/1000, B: 55/1000. H0: p sama = 0.05\nvar_satu = 1000 * 0.05 * 0.95\n\n# TULIS KODEMU: SD selisih dan z-score selisih 10\nsd_beda = \nz = \n\nprint(f"sd_beda={sd_beda:.2f}  z={z:.2f}")`,
        lockLines: 1,
        solution: `# A: 45/1000, B: 55/1000. H0: p sama = 0.05\nvar_satu = 1000 * 0.05 * 0.95\n\n# TULIS KODEMU: SD selisih dan z-score selisih 10\nsd_beda = (var_satu + var_satu) ** 0.5\nz = 10 / sd_beda\n\nprint(f"sd_beda={sd_beda:.2f}  z={z:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_beda", value: 9.75, tol: 0.01, label: "`sd_beda` seharusnya \u2248 9,75", msg: "\u221A(47,5+47,5) \u2248 9,75." },
          { kind: "equal", task: "t2", name: "z", value: 1.03, tol: 0.02, label: "`z` seharusnya \u2248 1,03", msg: "10/9,75 \u2248 1,03 \u2014 cuma noise." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_beda=9\\.75\\s+z=1\\.03", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Selisih \u2248 1 SD = noise. Butuh ~2-3 SD untuk klaim.",
    },
    {
      id: "syarat-quiz",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "Kapan Binomial valid?",
      prose: [
        "Dua pertanyaan untuk mengunci syarat dan jebakan Binomial sebelum checkpoint.",
      ],
      tasks: [],
      quiz: [
        {
          q: "X ~ Bernoulli(0,05). E[X] dan Var(X)?",
          options: [
            { text: "0,05 dan 0,05", why: "Salah: Var = 0,05 adalah rumus Poisson, bukan Bernoulli." },
            { text: "0,05 dan 0,0475", why: "Benar: E=p=0,05; Var=p(1\u2212p)=0,0475.", correct: true },
            { text: "0,5 dan 0,25", why: "Salah: tertukar dengan p=0,5." },
          ],
        },
        {
          q: "Kapan Binomial TIDAK valid?",
          options: [
            { text: "n=1000, p=0,05 independen", why: "Salah: ini kasus Binomial yang sempurna." },
            { text: "Default saat krisis (berkorelasi)", why: "Benar: krisis merusak independensi \u2014 butuh model korelasi (Vasicek, B13).", correct: true },
            { text: "100 lemparan koin adil", why: "Salah: n tetap, p sama, independen \u2014 valid." },
          ],
        },
      ],
      note: {
        title: "Intuisi: Binomial punya tiga syarat — langgar satu, angkanya berbohong",
        body: "Binomial(n,p) hanya jujur jika tiga syarat terpenuhi: n tetap, p konstan, percobaan independen. Praktisi tidak menghafal syaratnya — mereka mencurigainya. Apakah p benar-benar konstan? Dalam A/B testing, p bisa meluruh karena kelelahan kampanye; dalam default kredit, p bergerak mengikuti siklus ekonomi. Apakah percobaannya independen? Klaim asuransi dalam satu banjir tidak independen; fraud dalam satu sindikat tidak independen. Satu syarat dilanggar, dan interval np ± 2√(np(1−p)) menjadi sekadar dekorasi. Heuristik keputusan: n kecil dan p kecil — pindah ke Poisson. Varians sampel jauh lebih besar dari mean — curigai overdispersi, pindah ke beta-binomial atau negatif binomial. Dan untuk A/B testing: 55 vs 45 dari 100 klik terlihat seperti kemenangan, tetapi simpangan bakunya sekitar 5 — selisih 10 hanya 2σ, belum cukup untuk merayakan. Aturan praktisnya: sebelum memakai Binomial, tulis tiga syaratnya dan coret yang tidak lolos. Model yang syaratnya tidak diperiksa adalah opini berbaju angka. Satu kalimat untuk dibawa pulang: Binomial menjawab berapa banyak dalam n tetap — jika n-nya tidak tetap, kamu sedang mengerjakan soal yang salah.",
      },

      reference: "n tetap, p sama, independen. Jebol satu \u2192 bukan Binomial.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B6.2.",
      ],
      tasks: [],
      summary: [
        "Bernoulli(p): satu ya/tidak; E=p, Var=p(1\u2212p) \u2014 atom semua distribusi diskret.",
        "Binomial(n,p): jumlah n Bernoulli independen; E=np, Var=np(1\u2212p).",
        "Syarat: n tetap, p sama, independen \u2014 jebol \u2192 bukan Binomial.",
        "Ekor untuk sinyal: realisasi > E+3SD = anomali, bukan noise.",
        "Jangan samakan Var Binomial (np(1\u2212p)) dengan Poisson (\u03BB).",
      ],
      next: { label: "B6.2 \u2014 Distribusi Diskret 2", href: "/learn/b6-distribusi-diskret-2" },
      quiz: [
        {
          q: "Binomial(5; 0,05): P(X=2) memakai suku C(5,2) karena\u2026",
          options: [
            { text: "Ada 10 urutan gagal", why: "Salah: C(5,2) menghitung posisi sukses, bukan urutan gagal." },
            { text: "Ada 10 posisi untuk 2 sukses", why: "Benar: C(5,2)=10 cara menempatkan 2 sukses di 5 posisi \u2014 tiap pola berpeluang p\u00B2(1\u2212p)\u00B3.", correct: true },
            { text: "Ada 10 nasabah", why: "Salah: nasabahnya 5, bukan 10." },
          ],
        },
        {
          q: "Binomial(1000; 0,05): 70 gagal. Kesimpulan tepat?",
          options: [
            { text: "Normal, dekat ekspektasi 50", why: "Salah: 70 = 2,9 SD di atas mean \u2014 jauh dari normal." },
            { text: "Sinyal: ~2,9 SD di atas mean, P(X\u226570) kecil", why: "Benar: ekor tipis \u2192 sinyal kuat ada perubahan. Tapi \u201Cpasti PD naik\u201D terlalu kuat \u2014 bisa juga korelasi.", correct: true },
            { text: "Pasti PD naik", why: "Salah: bisa juga asumsi independen yang jebol, bukan PD." },
          ],
        },
        {
          q: "Binomial(10; 0,5) bentuknya simetris karena\u2026",
          options: [
            { text: "n besar", why: "Salah: n=10 tidak besar." },
            { text: "p=0,5 membuat tiap pola dan cerminannya berpeluang sama", why: "Benar: p=0,5 \u2192 simetris terhadap k\u2194n\u2212k. Untuk p\u22600,5, miring.", correct: true },
            { text: "Selalu simetris", why: "Salah: hanya saat p=0,5." },
          ],
        },
        {
          q: "n=400, p=0,1. Teramati 52 \u201Csukses\u201D. z-score dan kesimpulan?",
          options: [
            { text: "z=2,0 \u2014 sinyal lemah, butuh replikasi", why: "Benar: mean=40, SD=6, z=(52\u221240)/6=2,0 \u2192 p\u22482,3%: menarik tapi belum konklusif.", correct: true },
            { text: "z=0,5 \u2014 noise biasa", why: "Salah: hitung ulang \u2014 (52\u221240)/6 = 2,0." },
            { text: "z=12 \u2014 pasti signifikan", why: "Salah: jauh dari 12." },
          ],
        },
        {
          q: "Koin adil 10x. P(tepat 7 angka)?",
          options: [
            { text: "C(10,7)/1024 \u2248 11,7%", why: "Benar: 120/1024 \u2248 11,7%.", correct: true },
            { text: "7/10 = 70%", why: "Salah: itu proporsi, bukan peluang tepat 7." },
            { text: "1/2", why: "Salah: itu peluang satu lemparan." },
          ],
        },
      ],
    },
  ],
};
