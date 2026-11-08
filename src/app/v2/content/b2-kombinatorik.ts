import type { V2Lesson } from "../lib/types";

export const b2: V2Lesson = {
  slug: "b2-kombinatorik",
  track: "Probabilitas",
  module: "Fondasi Peluang",
  title: "B2. Kombinatorik: Menghitung Tanpa Menghitung Satu per Satu",
  estMinutes: 55,
  steps: [
    {
      id: "birthday-paradox",
      eyebrow: "Langkah 1 · Ulang tahun yang sama",
      title: "23 orang, peluang tabrakan > 50%",
      prose: [
        "Di ruangan berisi 23 orang, berapa peluang dua orang berulang tahun di tanggal yang sama? Kebanyakan menebak kecil \u2014 \u201Ckan ada 365 hari!\u201D Jawabannya: lebih dari 50%.",
        "Ini birthday paradox. Intuisi manusia payah menghitung pasangan: dengan 23 orang ada C(23,2) = 253 pasangan \u2014 253 kesempatan \u201Ctabrakan\u201D. Yang relevan bukan 23 vs 365, melainkan 253 pasangan vs 365. Otak berpikir linear (n) padahal pasangan tumbuh kuadratik (n\u00B2).",
        "Di dunia nyata: tim fraud menghitung pola transaksi mencurigakan, auditor menghitung sampel, tim risiko menghitung skenario \u2014 semuanya kombinatorik. Dan trik komplemen dari B1 muncul lagi: \u201Cminimal satu tabrakan\u201D = 1 \u2212 \u201Cnol tabrakan\u201D.",
      ],
      formula: String.raw`P(\text{tabrakan}) = 1 - \frac{365}{365}\times\frac{364}{365}\times\cdots\times\frac{343}{365} \approx 0{,}507`,
      formulaNote: "365/365, 364/365, …, 343/365 = peluang orang ke-1, ke-2, …, ke-23 TIDAK bertabrakan ulang tahun dengan semua orang sebelumnya; 343/365 adalah orang ke-23 yang harus menghindari 22 tanggal yang sudah terisi. Perkalian semuanya = peluang tidak ada tabrakan sama sekali; 1 minus itu = peluang minimal satu tabrakan. Hasilnya ≈ 0,507 — angka ini artinya dari 100 ruangan berisi 23 orang, sekitar 51 ruangan memiliki sepasang orang berulang tahun di tanggal yang sama. Intuisi yang hilang: yang tumbuh bukan 23 orang, melainkan C(23,2) = 253 pasangan — peluang tabrakan ditentukan jumlah pasangan (≈ n²/2), bukan jumlah orang, itulah mengapa 50% tercapai jauh sebelum 183 orang.",
      tasks: [
        { id: "t1", text: "Hitung `p_beda` = peluang 23 orang semuanya beda ulang tahun" },
        { id: "t2", text: "Hitung `p_tabrak = 1 - p_beda`, cetak dengan 4 desimal" },
      ],
      expected: "p_tabrak=0.5073",
      note: {
        title: "Sering salah",
        body: "Menghitung langsung P(minimal satu pasang sama) dengan menjumlah kasus. Komplemen \u2014 1 \u2212 P(semua beda) \u2014 adalah satu perhitungan, bukan ratusan suku.",
      },
      hints: [
        "Orang ke-2 punya 364 \u201Chari aman\u201D, ke-3 punya 363, dst sampai ke-23.",
        "Kalikan (365-i)/365 untuk i = 0..22.",
        "p_beda = 1\nfor i in range(23): p_beda *= (365-i)/365",
      ],
      code: {
        starter: `# 23 orang, 365 hari, peluang seragam, independen\n\n# TULIS KODEMU: peluang semua beda, lalu komplemennya\np_beda = \np_tabrak = \n\nprint(f"p_tabrak={p_tabrak:.4f}")`,
        lockLines: 1,
        solution: `# 23 orang, 365 hari, peluang seragam, independen\n\n# TULIS KODEMU: peluang semua beda, lalu komplemennya\np_beda = 1.0\nfor i in range(23):\n    p_beda *= (365 - i) / 365\np_tabrak = 1 - p_beda\n\nprint(f"p_tabrak={p_tabrak:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_beda", value: 0.4927, tol: 0.001, label: "`p_beda` seharusnya \u2248 0,493", msg: "Kalikan (365/365) \u00D7 (364/365) \u00D7 \u2026 \u00D7 (343/365), 23 suku." },
          { kind: "equal", task: "t2", name: "p_tabrak", value: 0.5073, tol: 0.001, label: "`p_tabrak` seharusnya \u2248 0,507", msg: "Komplemen: 1 \u2212 p_beda." },
          { kind: "stdout_matches", task: "t2", pattern: "p_tabrak=0\\.5073", label: "`print` menampilkan hasil", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Komplemen: P(minimal satu) = 1 \u2212 P(tidak ada).",
    },
    {
      id: "kaidah-permutasi",
      eyebrow: "Langkah 2 · Kaidah pencacahan",
      title: "Urutan penting: kalikan, jangan daftar",
      prose: [
        "Aturan perkalian: jika ada m cara melakukan A dan n cara melakukan B, total cara berurutan = m \u00D7 n. PIN 4 digit: 10\u00D710\u00D710\u00D710 = 10^4 = 10.000 kemungkinan. Plat nomor 1 huruf + 3 angka: 26 \u00D7 10^3 = 26.000.",
        "Permutasi dipakai saat urutan penting dan tanpa pengulangan: P(n,k) = n!/(n\u2212k)!. Contoh: 5 finalis memperebutkan juara 1-2-3 \u2014 posisi 1 ada 5 pilihan, posisi 2 sisa 4, posisi 3 sisa 3 \u2192 5\u00D74\u00D73 = 60 = 5!/2!.",
        "Kepribadian kaidah pencacahan: ia \u201Cmesin fotokopi\u201D \u2014 tiap tahap menggandakan kemungkinan tahap sebelumnya. Inilah mengapa ruang sampel meledak eksponensial, dan mengapa brute force cepat mustahil.",
      ],
      formula: String.raw`P(n,k) = \frac{n!}{(n-k)!} \qquad n^k \text{ (boleh berulang)}`,
      formulaNote: "n = ukuran pool pilihan; k = banyak posisi yang diisi; n! = n×(n−1)×…×1; (n−k)! = sisa yang tidak terpakai. P(n,k) = n!/(n−k)! = n×(n−1)×…×(n−k+1): posisi pertama punya n pilihan, kedua n−1, dan seterusnya — urutan penting. n^k = tiap dari k posisi bebas memilih n pilihan (boleh berulang): tidak ada pengurangan. Contoh angka: PIN 4 digit = 10^4 = 10.000 — angka ini artinya brute force butuh rata-rata 5.000 tebakan untuk menembus; jika digit tidak boleh berulang, P(10,4) = 10×9×8×7 = 5.040, hampir separuhnya. Salah memilih rumus di sini berarti salah sekitar faktor 2 — perbedaan antara aman dan bobol.",
      tasks: [
        { id: "t1", text: "Hitung `pin` = banyak PIN 4 digit (boleh berulang)" },
        { id: "t2", text: "Hitung `podium` = P(5,3) untuk juara 1-2-3, cetak keduanya" },
      ],
      expected: "pin=10000  podium=60",
      note: {
        title: "Sering salah",
        body: "Memakai permutasi untuk PIN. PIN boleh berulang (1122 valid), jadi rumusnya 10^4, bukan P(10,4) = 5.040. Aturan \u201Ctidak boleh berulang\u201D justru memangkas ruang PIN jadi setengah \u2014 melemahkan, bukan menguatkan.",
      },
      hints: [
        "PIN: tiap posisi 10 pilihan independen \u2192 10**4.",
        "Podium: 5 \u00D7 4 \u00D7 3, atau math.perm(5, 3).",
        "print(f\"pin={pin}  podium={podium}\")",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU: PIN 4 digit boleh berulang; podium 5 finalis, 3 juara\npin = \npodium = \n\nprint(f"pin={pin}  podium={podium}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU: PIN 4 digit boleh berulang; podium 5 finalis, 3 juara\npin = 10 ** 4\npodium = math.perm(5, 3)\n\nprint(f"pin={pin}  podium={podium}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pin", value: 10000, tol: 1e-9, label: "`pin` seharusnya 10.000", msg: "Tiap posisi 10 pilihan: 10^4." },
          { kind: "equal", task: "t2", name: "podium", value: 60, tol: 1e-9, label: "`podium` seharusnya 60", msg: "5 \u00D7 4 \u00D7 3 = 60." },
          { kind: "stdout_matches", task: "t2", pattern: "pin=10000\\s+podium=60", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Boleh ulang \u2192 n^k. Urutan penting tanpa ulang \u2192 P(n,k).",
    },
    {
      id: "kombinasi",
      eyebrow: "Langkah 3 · Kombinasi",
      title: "Urutan tidak penting: bagi dengan k!",
      prose: [
        "Kombinasi dipakai saat urutan tidak penting: C(n,k) = n!/(k!(n\u2212k)!. Contoh: pilih 3 auditor dari 10 \u2014 tim {A,B,C} sama dengan {C,B,A} \u2014 hasilnya (10\u00D79\u00D78)/(3\u00D72\u00D71) = 120.",
        "Tes cepatnya satu pertanyaan: tukar dua objek, apakah hasilnya dianggap beda? Ya \u2192 permutasi. Tidak \u2192 kombinasi. Bedanya faktor k! \u2014 untuk k=10 itu 3,6 juta kali lipat. Salah pilih = salah total.",
        "Pola pikir peluang kombinatorial selalu: favorable/total, masing-masing dihitung dengan aturan yang sama. Contoh: peluang 5 kartu poker mengandung tepat sepasang As = C(4,2)\u00D7C(48,3)/C(52,5) = 103.776/2.598.960 \u2248 4%.",
      ],
      formula: String.raw`C(n,k) = \binom{n}{k} = \frac{n!}{k!(n-k)!}`,
      formulaNote: "n = pool; k = yang dipilih; k! = banyaknya urutan dari k objek terpilih. C(n,k) = n!/(k!(n−k)!): mulai dari permutasi n!/(n−k)!, lalu bagi dengan k! karena k! urutan berbeda dari tim yang sama dihitung sebagai satu. Contoh angka: pilih 3 auditor dari 10 = (10×9×8)/(3×2×1) = 720/6 = 120 — angka ini artinya ada 120 tim berbeda; {A,B,C}, {C,B,A}, {B,A,C} dan tiga urutan lainnya runtuh menjadi satu tim. Pembagi k! inilah harga dari pernyataan urutan tidak penting — tanpanya, 720 tim semu, dengan 600 di antaranya duplikat.",
      tasks: [
        { id: "t1", text: "Hitung `tim` = C(10,3) banyak tim audit" },
        { id: "t2", text: "Hitung `p_pair` = peluang tepat sepasang As, cetak keduanya" },
      ],
      expected: "tim=120  p_pair=0.0399",
      note: {
        title: "Sering salah",
        body: "\u201CUrutan tidak penting = selalu kombinasi\u201D untuk peluang. Kombinasi menghitung cara \u2014 jadi peluang hanya valid jika tiap subset equally likely. Itu asumsi yang harus dicek, bukan default.",
      },
      hints: [
        "Python 3.8+: math.comb(n, k) memberi hasil eksak.",
        "p_pair = comb(4,2)*comb(48,3)/comb(52,5).",
        "print(f\"tim={tim}  p_pair={p_pair:.4f}\")",
      ],
      code: {
        starter: `import math\nC = math.comb\n\n# TULIS KODEMU: tim 3 dari 10; peluang tepat sepasang As di poker\ntim = \np_pair = \n\nprint(f"tim={tim}  p_pair={p_pair:.4f}")`,
        lockLines: 2,
        solution: `import math\nC = math.comb\n\n# TULIS KODEMU: tim 3 dari 10; peluang tepat sepasang As di poker\ntim = C(10, 3)\np_pair = C(4, 2) * C(48, 3) / C(52, 5)\n\nprint(f"tim={tim}  p_pair={p_pair:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tim", value: 120, tol: 1e-9, label: "`tim` seharusnya 120", msg: "C(10,3) = (10\u00D79\u00D78)/6 = 120." },
          { kind: "equal", task: "t2", name: "p_pair", value: 0.03993, tol: 0.001, label: "`p_pair` seharusnya \u2248 0,040", msg: "C(4,2)\u00D7C(48,3)/C(52,5) \u2248 0,0399." },
          { kind: "stdout_matches", task: "t2", pattern: "tim=120\\s+p_pair=0\\.0399", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "math.comb(n, k). Tukar beda hasil \u2192 permutasi; tidak \u2192 kombinasi.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 4 · Lab audit",
      title: "Menemukan fraud dengan komplemen",
      prose: [
        "Populasi 200 transaksi, 10 di antaranya fraud. Auditor mengambil 15 acak. Berapa peluang minimal satu fraud ketemu? Menghitung langsung butuh menjumlah P(1 fraud) + P(2) + \u2026 \u2014 10 suku hipergeometrik.",
        "Komplemen menyelesaikannya dalam satu suku: 1 \u2212 C(190,15)/C(200,15) \u2248 0,55. Lalu verifikasi dengan simulasi: ambil sampel acak 5.000 kali, hitung fraksi yang menemukan \u22651 fraud. Rumus dan simulasi harus sepakat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_rumus` = 1 \u2212 C(190,15)/C(200,15)" },
        { id: "t2", text: "Simulasikan `trials=5000` sampel, hitung `p_sim`" },
        { id: "t3", text: "Cetak keduanya dengan 4 desimal" },
      ],
      expected: "rumus=0.5500  sim\u22480.55",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah cara ukuran sampel audit ditentukan di dunia nyata: komplemen, bukan penjumlahan langsung. n=15 hanya memberi \u224855% \u2014 terlalu kecil untuk keyakinan audit.",
      },
      hints: [
        "math.comb untuk kombinasi eksak; p_rumus = 1 - C(190,15)/C(200,15).",
        "pop = [1]*10 + [0]*190; random.sample(pop, 15).",
        "Hitung sampel yang sum(...) >= 1, bagi trials.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(3)\nC = math.comb\ntrials = 5000\n\n# TULIS KODEMU: rumus komplemen + simulasi\np_rumus = \n\npop = [1]*10 + [0]*190\nketemu = \np_sim = \n\nprint(f"rumus={p_rumus:.4f}  sim={p_sim:.4f}")`,
        lockLines: 3,
        solution: `import random, math\nrandom.seed(3)\nC = math.comb\ntrials = 5000\n\n# TULIS KODEMU: rumus komplemen + simulasi\np_rumus = 1 - C(190, 15) / C(200, 15)\n\npop = [1]*10 + [0]*190\nketemu = sum(1 for _ in range(trials) if sum(random.sample(pop, 15)) >= 1)\np_sim = ketemu / trials\n\nprint(f"rumus={p_rumus:.4f}  sim={p_sim:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_rumus", value: 0.55, tol: 0.001, label: "`p_rumus` seharusnya \u2248 0,55", msg: "1 \u2212 C(190,15)/C(200,15) \u2248 0,54999." },
          { kind: "equal", task: "t2", name: "p_sim", value: 0.55, tol: 0.05, label: "`p_sim` mendekati 0,55", msg: "Dengan seed 3 dan 5000 trials, sim harus dekat 0,55." },
          { kind: "stdout_matches", task: "t3", pattern: "rumus=0\\.55", label: "`print` menampilkan rumus", msg: "Cetak dengan format rumus=...  sim=... ." },
        ],
      },
      reference: "\u201CMinimal satu\u201D \u2192 1 \u2212 P(tidak ada). Verifikasi dengan simulasi.",
    },
    {
      id: "minicase-sampel",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Berapa sampel agar yakin 95%?",
      prose: [
        "Tim audit tahu ~5% transaksi satu cabang terindikasi fraud (10 dari 200). Kepala audit bertanya: \u201CBerapa transaksi harus kami sampel acak agar peluang menemukan minimal satu fraud \u2265 95%?\u201D Dari lab: n=15 \u2192 P \u2248 55%. Terlalu kecil.",
        "Peta keputusannya: (1) tim/sampel \u2192 kombinasi; (2) ada kata \u201Cminimal satu\u201D \u2192 komplemen dulu: P = 1 \u2212 C(190,n)/C(200,n); (3) naikkan n sampai melewati 0,95. Coba dengan kode: n=50 memberi \u2248 94,8%, n=55 memberi \u2248 96,3%. Jadi jawabannya sekitar 52\u201355 sampel.",
        "Tanpa pengembalian, hasilnya sedikit di bawah aproksimasi binomial \u2014 tapi prinsipnya sama: ukuran sampel audit ditentukan oleh komplemen, bukan oleh penjumlahan 10 suku hipergeometrik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p50` = P(minimal 1 fraud) untuk n=50" },
        { id: "t2", text: "Cetak `p50` dengan 4 desimal" },
      ],
      expected: "p50=0.9479",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sampel 15 transaksi memberi rasa aman palsu (cuma 55% peluang menemukan fraud). Keyakinan audit 95% butuh ~55 sampel \u2014 hampir 4x lipat. Biaya audit vs keyakinan adalah keputusan bisnis, tapi angkanya harus jujur.",
      },
      hints: [
        "Rumus yang sama seperti lab, ganti 15 \u2192 50.",
        "p50 = 1 - C(190,50)/C(200,50).",
        "print(f\"p50={p50:.4f}\")",
      ],
      code: {
        starter: `import math\nC = math.comb\n\n# TULIS KODEMU: peluang minimal satu fraud untuk n=50\np50 = \n\nprint(f"p50={p50:.4f}")`,
        lockLines: 2,
        solution: `import math\nC = math.comb\n\n# TULIS KODEMU: peluang minimal satu fraud untuk n=50\np50 = 1 - C(190, 50) / C(200, 50)\n\nprint(f"p50={p50:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p50", value: 0.9479, tol: 0.001, label: "`p50` seharusnya \u2248 0,948", msg: "1 \u2212 C(190,50)/C(200,50) \u2248 0,9479 \u2014 masih di bawah 95%." },
          { kind: "stdout_matches", task: "t2", pattern: "p50=0\\.9479", label: "`print` menampilkan p50", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "n=50 \u2192 94,8% (belum cukup). n=55 \u2192 96,3% (cukup).",
    },
    {
      id: "kombinasi-skenario",
      eyebrow: "Langkah 6 · Kombinasi untuk skenario",
      title: "Berapa skenario stress yang harus diuji?",
      prose: [
        "Kombinatorik bukan hanya soal kartu poker — ia menghitung beban kerja stress test. Bank punya 12 faktor risiko (suku bunga, kurs, harga minyak, dan seterusnya) dan ingin menguji semua skenario \"3 faktor memburuk bersamaan\". Berapa skenarionya? Urutan faktor tidak penting — skenario {suku bunga, kurs, minyak} sama dengan {minyak, kurs, suku bunga} — jadi ini kombinasi: C(12,3) = 220 skenario.",
        "Bandungkan dengan permutasi: kalau urutan dianggap penting, P(12,3) = 12 × 11 × 10 = 1.320 — enam kali lipat lebih banyak, semuanya duplikat dari 220 skenario yang sama. Salah memilih rumus di sini berarti menguji 1.320 skenario padahal 220 sudah mencakup semuanya — atau sebaliknya, mengira 220 skenario sudah mencakup semua urutan padahal soalnya memang butuh urutan (mis. urutan kejadian dalam simulasi Monte Carlo berurutan).",
        "Aturan praktisnya: skenario stress = kombinasi (pilih faktor mana yang memburuk); jalur simulasi = permutasi (urutan kejadian penting). Dan waspadai ledakan kombinatorial: C(20,5) = 15.504 — naik dari 12 ke 20 faktor saja membuat skenario lengkap tidak lagi layak diuji satu per satu. Di situlah sampling cerdas masuk: pilih skenario ekstrem yang paling relevan (berdasarkan korelasi dan dampak), bukan semua kombinasi.",
      ],
      formula: String.raw`C(12,3) = \frac{12!}{3!\,9!} = 220 \qquad P(12,3) = 12 \times 11 \times 10 = 1320`,
      formulaNote: "C(12,3) = 220 skenario stress 3-faktor dari 12 faktor (urutan tidak penting); P(12,3) = 1.320 (urutan penting) — 6x lipat karena 3! = 6 urutan per skenario yang sama.",
      tasks: [
        { id: "t1", text: "Hitung `skenario` = C(12,3) — skenario 3 faktor memburuk" },
        { id: "t2", text: "Hitung `urutan` = P(12,3) — kalau urutan dianggap penting, cetak keduanya" },
      ],
      expected: "skenario=220  urutan=1320",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Stress test yang menguji 1.320 skenario padahal 220 sudah cukup membuang 6x komputasi — dan stress test yang menguji 220 skenario padahal urutan kejadian penting akan melewatkan jalur krisis yang sesungguhnya. Tanyakan dulu: urutannya penting?",
      },
      hints: [
        "math.comb(12, 3) dan math.perm(12, 3).",
        "Selisihnya faktor 3! = 6 — tiap skenario punya 6 urutan.",
        "print(f\"skenario={skenario}  urutan={urutan}\")",
      ],
      code: {
        starter: `import math\n\n# 12 faktor risiko, skenario \"3 faktor memburuk bersamaan\"\n\n# TULIS KODEMU: kombinasi (urutan tak penting) vs permutasi (urutan penting)\nskenario = \nurutan = \n\nprint(f"skenario={skenario}  urutan={urutan}")`,
        lockLines: 1,
        solution: `import math\n\n# 12 faktor risiko, skenario \"3 faktor memburuk bersamaan\"\n\n# TULIS KODEMU: kombinasi (urutan tak penting) vs permutasi (urutan penting)\nskenario = math.comb(12, 3)\nurutan = math.perm(12, 3)\n\nprint(f"skenario={skenario}  urutan={urutan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skenario", value: 220, tol: 1e-9, label: "`skenario` seharusnya 220", msg: "C(12,3) = 220." },
          { kind: "equal", task: "t2", name: "urutan", value: 1320, tol: 1e-9, label: "`urutan` seharusnya 1320", msg: "P(12,3) = 12×11×10 = 1.320." },
          { kind: "stdout_matches", task: "t2", pattern: "skenario=220\\s+urutan=1320", label: "`print` menampilkan keduanya", msg: "Format: skenario=...  urutan=... ." },
        ],
      },
      quiz: [
        {
          q: "12 faktor risiko, skenario \"3 memburuk bersamaan\". Berapa skenario, dan kenapa kombinasi?",
          options: [
            { text: "1.320 — karena urutan memburuk penting", why: "Salah: skenario {A,B,C} sama dengan {C,B,A} — urutan tidak penting." },
            { text: "220 — C(12,3); urutan faktor tidak penting dalam satu skenario", why: "Benar: kombinasi — tukar faktor, skenarionya tetap sama.", correct: true },
            { text: "36 — 12 × 3", why: "Salah: itu bukan rumus pencacahan yang benar." },
          ],
        },
        {
          q: "C(20,5) = 15.504 skenario. Apa implikasinya untuk stress test?",
          options: [
            { text: "Uji semuanya — komputer pasti kuat", why: "Salah: ledakan kombinatorial membuat pengujian lengkap tidak layak." },
            { text: "Sampling cerdas: pilih skenario ekstrem yang paling relevan, bukan semua kombinasi", why: "Benar: prioritaskan berdasarkan korelasi dan dampak.", correct: true },
            { text: "Kurangi faktornya jadi 5", why: "Salah: membuang faktor = membuang risiko yang tidak terlihat." },
          ],
        },
      ],
      reference: "Skenario stress = kombinasi. Jalur berurutan = permutasi. Ledakan kombinatorial → sampling cerdas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B3.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: satu pertanyaan yang memangkas separuh kesalahan — urutannya penting?",
        body: "Setiap soal kombinatorik dimulai dengan satu pertanyaan: apakah urutan penting? Jika ya — PIN, password, ranking — pakai aturan perkalian atau permutasi. Jika tidak — tim audit, sampel, komite — pakai kombinasi, yaitu bagi dengan k! untuk menghapus urutan yang terhitung ganda. Kebanyakan kesalahan bukan di faktorialnya, melainkan di langkah pertama ini: orang menghitung permutasi untuk soal kombinasi, atau sebaliknya. Heuristik kedua: jangan mendaftar, kalikan. Otak ingin menulis semua kemungkinan; praktisi mengalikan slot yang tersedia. Heuristik ketiga datang dari birthday paradox: pasangan tumbuh kuadratik — C(23,2) = 253 pasangan, itulah mengapa tabrakan datang jauh lebih cepat dari intuisi 23/365. Kapan pun kamu melihat interaksi berpasangan — tabrakan, duplikat, tabrakan hash — ingat jumlah pasangan tumbuh sekitar n²/2, bukan n. Dan saat n besar, berhentilah menghitung eksak: aproksimasi atau komplemen hampir selalu cukup untuk mengambil keputusan. Satu jebakan terakhir: soal yang mencampur keduanya — misalnya memilih tim lalu mengurutkan anggotanya. Kerjakan berlapis: kombinasi dulu untuk memilih, permutasi kemudian untuk menyusun. Mencampur keduanya dalam satu langkah adalah sumber klasik jawaban yang salah sekitar faktor k!.",
      },
      summary: [
        "Kaidah perkalian: cara berurutan dikalikan \u2014 fondasi semua pencacahan.",
        "Tukar beda hasil \u2192 permutasi; tukar sama saja \u2192 kombinasi; boleh ulang \u2192 n^k.",
        "\u201CMinimal satu\u201D \u2192 komplemen. Selalu lebih mudah.",
        "Peluang = favorable/total \u2014 hitung keduanya dengan aturan yang sama + asumsi equally likely.",
        "Brute force skenario meledak eksponensial \u2014 butuh sampling cerdas (Monte Carlo, B12).",
      ],
      next: { label: "B3 \u2014 Peluang Bersyarat", href: "/v2/learn/b3-peluang-bersyarat" },
      quiz: [
        {
          q: "PIN 4 digit (boleh ulang). Banyak kemungkinan?",
          options: [
            { text: "4^10", why: "Salah: basis dan pangkat tertukar \u2014 10 pilihan per posisi, 4 posisi." },
            { text: "10^4 = 10.000", why: "Benar: tiap digit 10 pilihan independen \u2192 10^4. P(10,4) salah karena digit boleh berulang.", correct: true },
            { text: "P(10,4) = 5.040", why: "Salah: itu untuk tanpa pengulangan, sedangkan PIN boleh berulang." },
            { text: "C(10,4) = 210", why: "Salah: kombinasi untuk urutan tidak penting \u2014 PIN jelas peduli urutan." },
          ],
        },
        {
          q: "Pilih 3 orang dari 10 untuk tim (urutan tidak penting). Rumus?",
          options: [
            { text: "10^3", why: "Salah: itu untuk pilihan berulang per posisi." },
            { text: "10!/7!", why: "Salah: itu permutasi P(10,3) \u2014 untuk podium, bukan tim." },
            { text: "C(10,3) = 120", why: "Benar: tim {A,B,C} = {C,B,A} \u2192 kombinasi.", correct: true },
            { text: "10!/3!", why: "Salah: bukan rumus kombinasi yang benar." },
          ],
        },
        {
          q: "Peluang minimal satu angka dari 4 lemparan koin paling cepat via\u2026",
          options: [
            { text: "Menjumlah P(1)+P(2)+P(3)+P(4)", why: "Salah: empat suku \u2014 komplemen satu langkah." },
            { text: "1 \u2212 (1/2)^4 = 15/16", why: "Benar: komplemen \u2014 1 \u2212 P(semua gambar).", correct: true },
            { text: "4 \u00D7 1/2 = 2", why: "Salah: peluang tidak bisa 2 \u2014 dan perkalian bukan aturannya." },
            { text: "(1/2)^4", why: "Salah: itu peluang semua gambar, bukan minimal satu angka." },
          ],
        },
        {
          q: "23 orang, peluang ada pasang berulang tahun sama > 50%. Intuisi yang benar:",
          options: [
            { text: "365 hari terlalu sedikit", why: "Salah: 365 hari tidak sedikit \u2014 yang besar adalah banyaknya pasangan." },
            { text: "Yang penting banyaknya pasangan C(23,2) = 253", why: "Benar: 253 pasangan = 253 kesempatan tabrakan. Pertumbuhan kuadratik mengalahkan 365 hari.", correct: true },
            { text: "Orang lahir musiman", why: "Salah: asumsi soalnya peluang seragam, dan musim bukan penjelasannya." },
            { text: "Ulang tahun tidak acak", why: "Salah: keacakan bukan masalahnya \u2014 masalahnya intuisi linear vs kuadratik." },
          ],
        },
        {
          q: "Kombinasi C(n,k) bisa dipakai untuk peluang hanya jika\u2026",
          options: [
            { text: "n besar", why: "Salah: besarnya n tidak relevan." },
            { text: "Setiap subset equally likely", why: "Benar: kombinasi menghitung cara. Jadi peluang hanya valid jika tiap cara equally likely \u2014 asumsi yang harus dicek.", correct: true },
            { text: "k kecil", why: "Salah: besarnya k tidak relevan." },
            { text: "Selalu bisa", why: "Salah: tanpa equally likely, hitungan cara bukan peluang." },
          ],
        },
      ],
    },
  ],
};
