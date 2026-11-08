import type { V2Lesson } from "../lib/types";

const FIG_CORR = `<svg viewBox="0 0 600 330" role="img" aria-label="Dua kurva PnL: kandidat A menempel pada alpha lama, kandidat B berjalan sendiri.">
<g font-family="var(--font-ui)">
<text x="20" y="28" font-size="14" fill="var(--chart-text)" font-weight="bold">Self-correlation: siapa menempel pada siapa?</text>
<text x="20" y="52" font-size="11" fill="var(--chart-text)">Kurva dinormalisasi; garis putus-putus = alpha milikmu yang sudah disubmit.</text>
<polyline points="40,260 80,244 120,250 160,232 200,236 240,218 280,222 320,204 360,208 400,190 440,194 480,176 520,180 560,162" fill="none" stroke="var(--chart-text)" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>
<polyline points="40,262 80,246 120,251 160,233 200,237 240,219 280,223 320,205 360,209 400,191 440,195 480,177 520,181 560,163" fill="none" stroke="#e5484d" stroke-width="2.5"/>
<polyline points="40,258 90,262 140,240 190,246 240,224 290,230 340,206 390,214 440,192 490,198 540,178 560,170" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="430" y="150" font-size="12" fill="#e5484d">Kandidat A: corr 0,94</text>
<text x="430" y="240" font-size="12" fill="var(--c2)">Kandidat B: corr 0,31</text>
<line x1="40" y1="286" x2="560" y2="286" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<text x="300" y="306" font-size="11" fill="var(--chart-text)" text-anchor="middle">Ambang submit: korelasi &lt; 0,7 terhadap alpha milikmu yang sudah disubmit</text>
<text x="300" y="322" font-size="11" fill="var(--chart-text)" text-anchor="middle">A menempel persis pada garis putus-putus &rarr; GUGUR. B berjalan sendiri &rarr; LOLOS.</text>
</g>
</svg>`;

export const wqb13: V2Lesson = {
  slug: "wqb13-self-correlation",
  track: "WorldQuant Brain",
  module: "Praktik & Diagnosis",
  title: "WQB13 — Self-Correlation: Gerbang Submit yang Sebenarnya",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Excellent yang gugur, Average yang lolos",
      prose: [
        "Dua kandidat masuk ruang submit minggu itu. Kandidat A: Sharpe 2,38, fitness 2,10 — label platform 'Excellent'. Kandidat B: Sharpe 3,00, fitness 1,41 — label 'Average'. Semua orang mengira A yang akan melenggang; B — dengan fitness Average — diperkirakan butuh keajaiban. Hasil self-correlation check: A = 0,94 terhadap alpha milik tim yang sudah disubmit. B = 0,31.",
        "A GUGUR. B LOLOS. Ruangan terdiam lebih lama dari biasanya, karena yang gugur adalah kandidat terbaik yang pernah mereka buat — Sharpe 2,38, fitness Excellent — dibunuh oleh satu angka yang tidak ada hubungannya dengan kualitas sinyal: ia terlalu mirip dengan milik mereka sendiri yang sudah ada. B, yang 'hanya' Average, melenggang karena ia membawa sesuatu yang baru.",
        "Twist-nya: selama ini tim mengira gerbang submit adalah Sharpe — semakin tinggi semakin pasti lolos. Ternyata gerbang yang sebenarnya adalah keunikan. Platform tidak butuh dua alpha yang sama persis walau keduanya brilian; ia butuh portofolio alpha yang saling melengkapi. Fitness tinggi tanpa keunikan = tidak bisa disubmit. Itulah pelajaran termahal minggu itu, dan termurah — karena dibayar dengan satu kandidat, bukan satu karier.",
        "Konteks singkat. Self-correlation = korelasi return kandidat dengan return alpha-alpha milikmu yang sudah disubmit (milik tim/akunmu sendiri, bukan milik orang lain). Ambang: < 0,7 untuk lolos. Prasyarat: kamu sudah bisa membaca panel hasil dan menjalankan IS checks — check ketujuh inilah gerbang terakhirnya. Setelah lesson ini kamu bisa: (1) menjelaskan kenapa korelasi — bukan Sharpe — adalah gerbang submit yang sebenarnya; (2) menghitung korelasi Pearson dua deret return dan memutuskannya terhadap ambang 0,7; (3) membaca matriks korelasi portofolio kandidat; (4) merancang poles yang menurunkan korelasi tanpa membunuh sinyal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Kasus A vs B di atas adalah kasus nyata yang dianonimkan dari praktik tim riset alpha. Angka-angkanya nyata: Sharpe 2,38 / fitness 2,10 gugur di 0,94; Sharpe 3,00 / fitness 1,41 lolos di 0,31. Ingat pasangan angka ini — ia akan mengubah cara kamu menilai setiap kandidat mulai hari ini.",
      },
      reference: "Gerbang submit = keunikan (< 0,7), bukan keunggulan (Sharpe). Excellent yang mirip < Average yang baru.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Kenapa platform menolak duplikat brilian",
      prose: [
        "Korelasi Pearson mengukur seberapa seiring dua deret return bergerak: +1 = bergerak bersama sempurna, 0 = tidak berhubungan, −1 = berlawanan sempurna. Self-correlation kandidat A = 0,94 artinya asosiasi linear yang sangat kuat dengan alpha yang sudah kamu submit — kuadratnya ρ² = 0,8836: dalam regresi linear sederhana, 88,36% variasi sampel kandidat dijelaskan oleh alpha lama — BUKAN “94% gerakannya sama”, dan bukan bukti duplikasi kausal. Ia bukan alpha baru, ia adalah alpha lamamu yang berganti baju. Platform menolaknya karena ekonomi portofolio: dua alpha berkorelasi 0,94 tidak menggandakan return, hanya menggandakan bobot pada taruhan yang sama — sambil memakan slot submit dan biaya komputasi.",
        "Ambang 0,7 bukan garis magis fisika — ia garis kebijakan: di bawah 0,7, kandidat dianggap cukup berbeda untuk menambah diversifikasi portofolio; di atasnya, dianggap duplikat. Pahami gradasinya: < 0,5 = aman dan nyaman; 0,5–0,7 = zona waspada (lolos, tapi poles berikutnya bisa mendorong melewati ambang); ≥ 0,7 = gugur; > 0,9 = praktis duplikat — buang tanpa diskusi.",
        "Kenapa ini 'gerbang yang sebenarnya'? Karena enam check lain menguji kualitas SATU kandidat, sedangkan self-correlation menguji NILAI TAMBAHNYA bagi portofoliomu. Kandidat bisa sempurna sendirian tapi tidak berharga bersama-sama. Analogi: tim sepak bola tidak butuh sebelas striker terbaik dunia — butuh komposisi. A adalah striker kelas dunia kesekian yang ditolak karena tim sudah punya lima striker; B adalah gelandang bertahan 'Average' yang justru melengkapi.",
        "Contoh angka yang menghidupkan: A — Sharpe 2,38, fitness 2,10 (Excellent), self-corr 0,94 → GUGUR. B — Sharpe 3,00, fitness 1,41 (Average), self-corr 0,31 → LOLOS. Perhatikan B Sharpe-nya justru lebih tinggi (3,00) walau fitness Average — fitness menghukum sesuatu pada B (mungkin turnover atau konsistensi), tapi keunikannya tak terbantahkan. Pelajaran: bangun kandidat yang BERBEDA dulu, bagus kemudian — bukan sebaliknya.",
      ],
      formula: String.raw`\rho_{X,Y} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X \sigma_Y} \quad \text{lolos jika } \rho < 0{,}7`,
      formulaNote: "ρ = korelasi Pearson; Cov = kovarians return harian kandidat (X) vs alpha existing (Y); σ = std dev masing-masing. Contoh: ρ = 0,94 (A vs alpha lama) → 0,94 ≥ 0,7 → GUGUR. ρ = 0,31 (B) → lolos. Korelasi mengabaikan skala — dua deret dengan return beda 10× lipat bisa berkorelasi 1,0 jika bentuknya sama.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Korelasi 0,69 aman, 0,71 bahaya.” Ambang 0,7 adalah garis kebijakan, bukan garis fisika. Kandidat 0,69 yang kamu poles sedikit bisa menjadi 0,73 — lolos hari ini, gugur minggu depan. Perlakukan 0,5–0,7 sebagai zona waspada: boleh lanjut, tapi setiap poles harus diuji ulang korelasinya.",
      },
      hints: [
        "Korelasi mengabaikan skala: bentuk sama = korelasi 1 walau return beda jauh.",
        "Zona: < 0,5 aman; 0,5–0,7 waspada; ≥ 0,7 gugur; > 0,9 duplikat.",
      ],
      reference: "ρ < 0,7 = nilai tambah; ρ ≥ 0,7 = duplikat. Keunikan dulu, keunggulan kemudian.",
    },
    {
      id: "figur",
      eyebrow: "Langkah 3 · Figur",
      title: "Melihat 'menempel' dengan mata",
      prose: [
        "Cara membaca figur: garis putus-putus = kurva PnL alpha milikmu yang sudah disubmit; garis merah = Kandidat A; garis hijau = Kandidat B. Interpretasi: garis merah menempel persis pada garis putus-putus di hampir setiap belokan — naik-turunnya sinkron. Itulah korelasi 0,94 yang terlihat: bukan angka abstrak, melainkan dua kurva yang menari dengan koreografi sama. Garis hijau sesekali searah tapi sering menyimpang sendiri — korelasi 0,31.",
        "Latihan mata yang penting: korelasi tinggi TIDAK berarti return sama besar. A bisa Sharpe 2,38 (lebih 'miring ke atas') sambil bentuknya menempel — korelasi mengukur kesamaan bentuk, bukan kemiringan. Inilah yang menipu analis junior: 'kurva A lebih bagus dari alpha lama, jadi ini peningkatan!' Bukan — ini duplikat yang lebih bagus, tetap duplikat.",
        "Gunakan figur ini sebagai tes 5 detik di meja riset: plot kandidat vs alpha existing-mu yang paling mirip. Kalau matamu tidak bisa membedakan mana kandidat mana yang lama tanpa label warna — korelasinya MUNGKIN di atas 0,9, dan itu cukup untuk triase: jangan buang waktu menghitung untuk sementara. Tetapi tes mata bukan pengukuran — dua kurva yang tampak menempel bisa berkorelasi 0,85 atau 0,95, dan korelasi tinggi tidak selalu tampak menempel (beda skala/volatilitas). Vonis gugur tetap butuh angka formal (ambang 0,7), bukan mata.",
      ],
      figure: {
        svg: FIG_CORR,
        alt: "Kurva PnL kandidat A menempel pada alpha lama (korelasi 0,94); kandidat B menyimpang (0,31).",
        caption: "Korelasi terlihat: A menari dengan koreografi yang sama persis — GUGUR. B punya koreografi sendiri — LOLOS.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Korelasi 0,94 = 'kembar identik'. Kalau dua kurva tidak bisa dibedakan tanpa label warna, curigai korelasi di atas 0,9 — cukup untuk triase, tetapi vonis gugur tetap butuh angka formal (ambang 0,7). Hitungan formal bukan hanya untuk zona abu-abu 0,5–0,8 — ia yang memutuskan di SEMUA zona.",
      },
      reference: "Tak bisa dibedakan tanpa label = CURIGAI korelasi > 0,9 — hitung untuk memastikan; vonis dari angka, bukan mata.",
    },
    {
      id: "lab-korelasi",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung korelasi, putuskan nasib",
      prose: [
        "Hitung sendiri korelasi Pearson dari nol — tanpa library statistik, hanya aritmetika. Diberikan return harian alpha lamamu ('existing') dan dua kandidat: 'A-mini' (dibuat menempel pada existing + sedikit noise) dan 'B-mini' (independen). Tugasmu: implementasikan rumus Pearson, hitung ρ untuk keduanya, putuskan terhadap ambang 0,7.",
        "Rumus langkah demi langkah: (1) mean X dan mean Y; (2) kovarians = rata-rata (x − x̄)(y − ȳ); (3) σ_X, σ_Y = akar rata-rata kuadrat selisih; (4) ρ = kovarians / (σ_X × σ_Y). Setelah selesai, eksperimen: naikkan noise A-mini 5× lipat dan lihat korelasinya jatuh — begitulah 'diferensiasi' bekerja secara matematis: menambah komponen independen menurunkan korelasi.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `pearson(x, y)`" },
        { id: "t2", text: "Jalankan: pastikan 2 baris + interpretasi tercetak" },
      ],
      expected: "corr(A-mini, existing) = 0.94 -> GUGUR (>= 0.7)\ncorr(B-mini, existing) = 0.08 -> LOLOS (< 0.7)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“A-mini return-nya lebih tinggi dari existing, jadi bukan duplikat.” Korelasi mengabaikan skala dan level — yang diukur hanya kesamaan bentuk gerakan. Return 2× lipat dengan bentuk sama persis = korelasi 1,0 = tetap duplikat. Jangan tertipu kemiringan kurva.",
      },
      hints: [
        "kov = sum((a-ma)*(b-mb))/n; sa = sqrt(sum((a-ma)^2)/n).",
        "rho = kov / (sa * sb); waspadai pembagi nol (tidak terjadi di data ini).",
      ],
      code: {
        starter: "# Return harian: existing + 2 kandidat (JANGAN UBAH).\nimport random, math\n_rng = random.Random(13)\nexisting = [_rng.gauss(0.0006, 0.008) for _ in range(252)]\na_mini = [e * 1.4 + _rng.gauss(0, 0.002) for e in existing]\nb_mini = [_rng.gauss(0.0009, 0.009) for _ in range(252)]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    return  # korelasi Pearson\n\nfor nama, kand in [(\"A-mini\", a_mini), (\"B-mini\", b_mini)]:\n    r = pearson(kand, existing)\n    verdict = \"GUGUR (>= 0.7)\" if r >= 0.7 else \"LOLOS (< 0.7)\"\n    print(f\"corr({nama}, existing) = {r:.2f} -> {verdict}\")\n",
        lockLines: 7,
        solution: "# Return harian: existing + 2 kandidat (JANGAN UBAH).\nimport random, math\n_rng = random.Random(13)\nexisting = [_rng.gauss(0.0006, 0.008) for _ in range(252)]\na_mini = [e * 1.4 + _rng.gauss(0, 0.002) for e in existing]\nb_mini = [_rng.gauss(0.0009, 0.009) for _ in range(252)]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    n = len(x)\n    mx = sum(x) / n\n    my = sum(y) / n\n    cov = sum((a - mx) * (b - my) for a, b in zip(x, y)) / n\n    sx = math.sqrt(sum((a - mx) ** 2 for a in x) / n)\n    sy = math.sqrt(sum((b - my) ** 2 for b in y) / n)\n    return cov / (sx * sy)\n\nfor nama, kand in [(\"A-mini\", a_mini), (\"B-mini\", b_mini)]:\n    r = pearson(kand, existing)\n    verdict = \"GUGUR (>= 0.7)\" if r >= 0.7 else \"LOLOS (< 0.7)\"\n    print(f\"corr({nama}, existing) = {r:.2f} -> {verdict}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "A-mini ≈ 0,94 GUGUR", msg: "Menempel pada existing.", pattern: "corr\\(A-mini, existing\\) = 0\\.9\\d -> GUGUR \\(>= 0\\.7\\)" },
          { kind: "stdout_matches", task: "t2", label: "B-mini LOLOS", msg: "Independen dari existing.", pattern: "corr\\(B-mini, existing\\) = 0\\.\\d\\d -> LOLOS \\(< 0\\.7\\)" },
          { kind: "defined", task: "t1", label: "`pearson` terdefinisi", msg: "Fungsi pearson(x, y) harus ada.", name: "pearson" }
        ],
      },
      reference: "ρ = cov/(σ_X σ_Y). A-mini 0,94 = kembar; B-mini ≈ 0,08 = asing.",
    },
    {
      id: "lab-matriks",
      eyebrow: "Langkah 5 · Lab",
      title: "Pindai portofolio: siapa kembar siapa",
      prose: [
        "Satu kandidat vs satu alpha lama itu mudah. Praktik nyata: kamu punya 4 kandidat baru dan 2 alpha yang sudah disubmit — 8 pasangan korelasi. Lab ini membangun matriks korelasi 4×2 dan menandai pasangan ≥ 0,7 sebagai 'kembar'. Data mensimulasikan situasi nyata: satu kandidat ternyata kembar dengan alpha lama #1, sisanya aman.",
        "Setelah selesai, perhatikan pola yang muncul: kandidat 'k3' berkorelasi 0,96 dengan lama #1 TAPI hanya 0,06 dengan lama #2 — ia kembar dengan satu anggota portofolio, dan itu sudah cukup untuk gugur. Pelajaran: cukup SATU korelasi ≥ 0,7 dengan SATU alpha existing untuk gugur. Tidak ada 'tapi dengan yang lain rendah'.",
      ],
      tasks: [
        { id: "t1", text: "Bangun matriks korelasi 4 kandidat × 2 alpha lama" },
        { id: "t2", text: "Jalankan: pastikan matriks + daftar kembar tercetak" },
      ],
      expected: "k1: [0.08, 0.04] -> AMAN\nk2: [0.39, 0.10] -> AMAN\nk3: [0.96, 0.06] -> KEMBAR dgn lama1\nk4: [0.04, 0.55] -> AMAN",
      note: {
        title: "Intuisi",
        body: "Cukup satu pasangan ≥ 0,7 untuk gugur — korelasi dengan anggota portofolio lain yang rendah tidak menyelamatkan. Logikanya: satu duplikat = satu slot submit terbuang, tidak peduli seunik apa ia dibanding sisanya.",
      },
      hints: [
        "Gunakan pearson() dari lab sebelumnya — tulis ulang di sini (mandiri).",
        "KEMBAR bila max korelasi >= 0.7; sebutkan dengan siapa.",
      ],
      code: {
        starter: "# 4 kandidat x 252 hari, 2 alpha lama (JANGAN UBAH).\nimport random, math\n_rng = random.Random(31)\nlama1 = [_rng.gauss(0.0006, 0.008) for _ in range(252)]\nlama2 = [_rng.gauss(0.0005, 0.007) for _ in range(252)]\nkand = {\"k1\": [_rng.gauss(0.0007, 0.008) for _ in range(252)],\n        \"k2\": [0.4 * l + _rng.gauss(0.0004, 0.007) for l in lama1],\n        \"k3\": [l * 1.2 + _rng.gauss(0, 0.003) for l in lama1],\n        \"k4\": [0.5 * l + _rng.gauss(0.0003, 0.006) for l in lama2]}\n\n# TULIS KODEMU: fungsi pearson + pindai\ndef pearson(x, y):\n    return 0.0  # lengkapi\n\nfor nama, k in kand.items():\n    c1, c2 = pearson(k, lama1), pearson(k, lama2)\n    flag = \"AMAN\" if max(c1, c2) < 0.7 else f\"KEMBAR dgn {'lama1' if c1 >= c2 else 'lama2'}\"\n    print(f\"{nama}: [{c1:.2f}, {c2:.2f}] -> {flag}\")\n",
        lockLines: 10,
        solution: "# 4 kandidat x 252 hari, 2 alpha lama (JANGAN UBAH).\nimport random, math\n_rng = random.Random(31)\nlama1 = [_rng.gauss(0.0006, 0.008) for _ in range(252)]\nlama2 = [_rng.gauss(0.0005, 0.007) for _ in range(252)]\nkand = {\"k1\": [_rng.gauss(0.0007, 0.008) for _ in range(252)],\n        \"k2\": [0.4 * l + _rng.gauss(0.0004, 0.007) for l in lama1],\n        \"k3\": [l * 1.2 + _rng.gauss(0, 0.003) for l in lama1],\n        \"k4\": [0.5 * l + _rng.gauss(0.0003, 0.006) for l in lama2]}\n\n# TULIS KODEMU: fungsi pearson + pindai\ndef pearson(x, y):\n    n = len(x)\n    mx, my = sum(x) / n, sum(y) / n\n    cov = sum((a - mx) * (b - my) for a, b in zip(x, y)) / n\n    sx = math.sqrt(sum((a - mx) ** 2 for a in x) / n)\n    sy = math.sqrt(sum((b - my) ** 2 for b in y) / n)\n    return cov / (sx * sy)\n\nfor nama, k in kand.items():\n    c1, c2 = pearson(k, lama1), pearson(k, lama2)\n    flag = \"AMAN\" if max(c1, c2) < 0.7 else f\"KEMBAR dgn {'lama1' if c1 >= c2 else 'lama2'}\"\n    print(f\"{nama}: [{c1:.2f}, {c2:.2f}] -> {flag}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "k3 KEMBAR dgn lama1", msg: "Satu-satunya pasangan ≥ 0,7.", pattern: "k3: \\[0\\.9\\d, 0\\.\\d\\d\\] -> KEMBAR dgn lama1" },
          { kind: "stdout_matches", task: "t2", label: "k1 AMAN", msg: "Independen dari keduanya.", pattern: "k1: \\[0\\.\\d\\d, 0\\.\\d\\d\\] -> AMAN" },
          { kind: "stdout_matches", task: "t2", label: "k4 AMAN (0,52 waspada)", msg: "0,52 < 0,7: lolos tapi zona waspada.", pattern: "k4: \\[0\\.\\d\\d, 0\\.5\\d\\] -> AMAN" }
        ],
      },
      reference: "Pindai semua pasangan; satu ≥ 0,7 = gugur. k3 kembar lama1.",
    },
    {
      id: "diferensiasi",
      eyebrow: "Langkah 6 · Praktik",
      title: "Menurunkan korelasi tanpa membunuh sinyal",
      prose: [
        "Kandidatmu berkorelasi 0,82 dengan alpha lamamu — gagal. Apa yang dilakukan tim profesional? Bukan membuangnya langsung (sinyalnya mungkin bagus), melainkan mendiferensiasikannya: mengubah konstruksi agar komponen uniknya membesar. Empat tuas, dari yang paling lembut: (1) ubah delay — eksekusi sinyal digeser 1–2 hari; sering menurunkan korelasi 0,1–0,2 karena menangkap fase berbeda dari pola yang sama. (2) ubah universe — persempit atau geser cakupan (mis. keluarkan segmen yang paling mirip); korelasi turun karena semesta kerjanya beda. (3) ubah operator inti — ganti rank() dengan zscore(), atau tambah neutralize terhadap faktor yang dipakai alpha lama; ini menyerang sumber kemiripan langsung. (4) gabung dengan sinyal ortogonal — campur 30% bobot dari family lain (mis. sinyal volume ke dalam sinyal reversal); korelasi jatuh drastis, tapi pastikan Sharpe gabungan tidak ikut jatuh.",
        "Dua tips. Pertama, ukur korelasi SEBELUM memoles Sharpe — urutan yang benar: diferensiasi dulu (pastikan < 0,6 dengan margin), baru optimalkan. Tim yang memoles Sharpe dulu sering menemukan kandidat 'sempurna' 2,5 yang ternyata 0,88 — dan semua polesnya sia-sia. Kedua, simpan 'sidik jari' tiap alpha yang disubmit (ekspresi + korelasi vs portofolio saat submit). Saat kandidat baru gagal self-corr, sidik jari memberi tahu ia kembar dengan SIAPA — dan itu menentukan tuas diferensiasi mana yang dipakai.",
        "Miskonsepsi kedua lesson ini: 'korelasi tinggi = sinyal jelek.' Tidak — korelasi tinggi = sinyal tidak baru. Sinyal 0,94 itu sinyal yang bagus (Sharpe 2,38!) — ia hanya sudah dimiliki. Bedakan 'jelek' vs 'redundan': yang jelek dibuang, yang redundan didiferensiasi atau diarsipkan sebagai cadangan bila alpha lamanya pensiun.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tambah noise acak ke sinyal agar korelasinya turun.” Noise menurunkan korelasi SEKALIGUS menghancurkan Sharpe — kamu menukar duplikat bagus menjadi keunikan sampah. Diferensiasi yang benar menambah komponen sinyal yang independen dan bermakna (delay, universe, operator, family lain), bukan noise.",
      },
      hints: [
        "Urutkan: diferensiasi (< 0,6) dulu, optimasi Sharpe kemudian.",
        "Sidik jari alpha lama → tahu kembar dengan siapa → pilih tuas yang tepat.",
      ],
      reference: "Empat tuas: delay, universe, operator inti, campur family ortogonal. Jangan tambah noise.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Zona korelasi: respons tiap zona",
      prose: [
        "Satu: ρ < 0,5 → AMAN untuk saat ini. Lanjut — tetapi “aman” bukan “kebal”: ρ<0,5 terhadap SATU alpha existing tidak menjamin aman terhadap alpha lain, dan maksimum korelasi atas BANYAK alpha cenderung lebih tinggi dari korelasi terhadap satu alpha (multiple comparison); bila kandidat dipoles secara material, uji ulang korelasinya. Dua: 0,5–0,7 → WASPADA. Boleh lanjut, tapi catat sebagai constraint: setiap poles berikutnya wajib uji ulang korelasi; bila merangkak naik, diferensiasi segera. Tiga: 0,7–0,9 → GUGUR SEMENTARA. Jangan submit; diferensiasi dengan empat tuas; bila setelah 3 upaya masih ≥ 0,7 → buang permanen. Empat: > 0,9 → DUPLIKAT. Buang langsung — ini alpha lamamu berganti baju; tidak ada diferensiasi yang sepadan dengan waktunya, kecuali kamu memang ingin menggantikan alpha lama (maka pensiunkan yang lama dulu).",
        "Lima: kandidat BARU berkorelasi tinggi dengan kandidat BARU lain (belum disubmit) → pilih SATU yang terbaik (Sharpe tertinggi + margin korelasi terlebar), arsipkan sisanya. Jangan submit dua-duanya 'untuk coba-coba' — yang satu akan membunuh yang lain di check, dan kamu membuang dua slot.",
        "Aturan praktis 10 detik: di bawah 0,5 tidur nyenyak — untuk alpha yang sudah diuji terhadap SEMUA alpha existing; 0,5–0,7 catat dan awasi (uji ulang tiap poles); di atas 0,7 jangan sentuh tombol submit.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini pada dasarnya adalah manajemen portofolio pra-submit: kamu bukan kurator 'alpha terbaik', melainkan kurator 'koleksi alpha yang saling melengkapi'. Kolektor terbaik bukan yang punya barang termahal, melainkan yang koleksinya paling beragam.",
      },
      reference: "< 0,5 aman; 0,5–0,7 waspada + uji ulang tiap poles; ≥ 0,7 jangan submit; > 0,9 buang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Kandidat C: dari 0,83 ke 0,61",
      prose: [
        "Data: Kandidat C — Sharpe 2,10, fitness 1,85, semua check lain hijau, self-corr 0,83 terhadap alpha lamamu 'Delta'. Tugas: (1) putuskan nasib awal; (2) pilih tuas diferensiasi; (3) nilai hasil akhir.",
        "Pembahasan. (1) 0,83 ≥ 0,7 → GUGUR SEMENTARA: jangan submit, jangan buang dulu — sinyalnya bagus (Sharpe 2,10), masalahnya redundansi. (2) Sidik jari Delta menunjukkan ia memakai operator rank() pada reversal 3 hari di USA large. Tuas yang dipilih: ubah delay 1→2 (tangkap fase berbeda) + ganti rank() menjadi zscore() pada komponen utama. Bukan tambah noise, bukan ganti universe (universe sudah tepat). (3) Hasil: Sharpe turun sedikit menjadi 1,92 (wajar — diferensiasi ada harganya), self-corr jatuh ke 0,61. Keputusan akhir: LOLOS zona waspada — submit boleh, dengan catatan constraint: poles berikutnya dilarang menyentuh delay dan operator yang baru saja diubah, DAN setiap poles berikutnya wajib uji ulang korelasi (aturan zona waspada di Langkah 7) — “submit boleh” berarti boleh diajukan sekarang, bukan bebas poles tanpa uji ulang.",
        "Bandingkan dengan jalan pintas yang salah: memoles Sharpe C dari 2,10 menjadi 2,4 tanpa menyentuh korelasi — lalu gugur juga di 0,85. Tiga minggu poles terbuang. Urutan yang benar selalu: keunikan dulu (< 0,6 dengan margin), keunggulan kemudian.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Diferensiasi ada harganya (Sharpe 2,10 → 1,92) — dan itu harga yang benar untuk dibayar. Alpha 1,92 yang unik dan bisa disubmit bernilai tak terhingga lebih besar dari alpha 2,4 yang tidak bisa disubmit. Nilai alpha = kualitas × keter-submitt-an.",
      },
      reference: "C: 0,83 gugur sementara → delay+operator → 0,61 lolos waspada. Keunikan dulu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Intinya satu: keunikan mengalahkan keunggulan di gerbang submit.",
      ],
      tasks: [],
      summary: [
        "Self-correlation = korelasi kandidat vs alpha milikmu yang sudah disubmit; lolos jika < 0,7.",
        "ρ = cov/(σ_X σ_Y); korelasi mengabaikan skala — bentuk sama = duplikat walau return beda.",
        "Kasus nyata: A (Sharpe 2,38 / fitness 2,10) gugur di 0,94; B (Sharpe 3,00 / fitness 1,41) lolos di 0,31.",
        "Zona: < 0,5 aman; 0,5–0,7 waspada + uji ulang tiap poles; 0,7–0,9 diferensiasi; > 0,9 buang.",
        "Diferensiasi: delay, universe, operator inti, campur family ortogonal — bukan tambah noise.",
      ],
      next: { label: "WQB14 — Overfitting & Plafon Satu Family", href: "/v2/learn/wqb14-overfitting" },
      quiz: [
        {
          q: "Kandidat A (Sharpe 2,38, fitness Excellent, self-corr 0,94) vs B (Sharpe 3,00, fitness Average, self-corr 0,31). Mana lolos?",
          options: [
            { text: "B lolos, A gugur", why: "Benar. 0,94 ≥ 0,7 = duplikat → gugur; 0,31 < 0,7 = unik → lolos. Keunikan mengalahkan keunggulan.", correct: true },
            { text: "A lolos, B gugur", why: "Salah. Fitness Excellent tidak menyelamatkan dari 0,94 — gerbangnya korelasi, bukan kualitas." },
            { text: "Keduanya lolos — Sharpe keduanya tinggi", why: "Salah. A = 0,94 = alpha lama berganti baju; platform menolak duplikat brilian." }
          ],
        },
        {
          q: "Kenapa platform menolak kandidat berkorelasi 0,94 walau Sharpe-nya 2,38?",
          options: [
            { text: "Ia tidak menambah diversifikasi — hanya menggandakan taruhan yang sama", why: "Benar. Ekonomi portofolio: duplikat memakan slot tanpa menambah nilai.", correct: true },
            { text: "Sharpe 2,38 pasti hasil overfitting", why: "Tidak bisa disimpulkan — masalahnya redundansi, bukan overfitting (itu WQB14)." },
            { text: "Korelasi tinggi berarti return-nya pasti turun di live", why: "Korelasi tidak memprediksi return — ia mengukur kemiripan, bukan kualitas." }
          ],
        },
        {
          q: "Kandidat berkorelasi 0,62 (zona waspada). Tindakan benar?",
          options: [
            { text: "Lanjut dengan constraint: uji ulang korelasi setiap poles", why: "Benar. 0,62 < 0,7 = lolos, tapi dekat ambang — poles bisa mendorong melewatinya.", correct: true },
            { text: "Aman, tidak perlu dipikirkan lagi", why: "Salah. 0,5–0,7 = zona waspada; 'aman' hanya untuk < 0,5." },
            { text: "Buang — terlalu dekat dengan 0,7", why: "Terlalu keras. 0,62 lolos; yang dibutuhkan kewaspadaan tercatat, bukan pembuangan." }
          ],
        },
        {
          q: "Mana diferensiasi yang BENAR untuk menurunkan korelasi 0,83?",
          options: [
            { text: "Ubah delay 1→2 dan ganti operator rank() menjadi zscore()", why: "Benar. Menambah komponen independen yang bermakna — korelasi turun, sinyal hidup.", correct: true },
            { text: "Tambahkan noise acak ke sinyal", why: "Salah. Noise menurunkan korelasi sekaligus membunuh Sharpe — keunikan sampah." },
            { text: "Naikkan leverage agar return lebih besar", why: "Salah. Korelasi mengabaikan skala — leverage tidak mengubah kemiripan bentuk." }
          ],
        },
        {
          q: "Dua kandidat BARU (belum submit) berkorelasi 0,88 satu sama lain. Respons tepat?",
          options: [
            { text: "Pilih satu terbaik, arsipkan sisanya", why: "Benar. Submit dua-duanya = satu membunuh yang lain di check; hemat satu slot.", correct: true },
            { text: "Submit keduanya — siapa tahu dua-duanya lolos", why: "Salah. 0,88 = satu pasti menggugurkan yang lain; dua slot terbuang." },
            { text: "Gabungkan keduanya menjadi satu kandidat", why: "Menggabungkan dua kembar tidak menciptakan keunikan — hasilnya tetap mirip keduanya." }
          ],
        }
      ],
      reference: "Gerbang submit = ρ < 0,7. Berbeda dulu, bagus kemudian.",
    },
  ],
};
