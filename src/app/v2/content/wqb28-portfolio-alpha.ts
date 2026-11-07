import type { V2Lesson } from "../lib/types";

const FIG_CORR = `<svg viewBox="0 0 600 340" role="img" aria-label="Bar chart korelasi berpasangan empat alpha.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Korelasi berpasangan 4 alpha (12 periode)</text>
<line x1="80" y1="40" x2="80" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="80" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="46" y="66" font-size="10" fill="var(--chart-text)">1.0</text>
<text x="46" y="160" font-size="10" fill="var(--chart-text)">0</text>
<text x="40" y="254" font-size="10" fill="var(--chart-text)">-0.5</text>
<rect x="110" y="66" width="56" height="94" fill="#e11d48" opacity="0.85"/>
<text x="138" y="58" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.996</text>
<rect x="196" y="160" width="56" height="16" fill="var(--c1)" opacity="0.85"/>
<text x="224" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">-0.171</text>
<rect x="282" y="158" width="56" height="4" fill="var(--c2)" opacity="0.85"/>
<text x="310" y="150" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.000</text>
<rect x="368" y="160" width="56" height="16" fill="var(--c1)" opacity="0.85"/>
<text x="396" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">-0.169</text>
<rect x="454" y="160" width="56" height="2" fill="var(--c2)" opacity="0.85"/>
<text x="482" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">-0.013</text>
<rect x="540" y="160" width="56" height="3" fill="var(--c2)" opacity="0.85"/>
<text x="568" y="272" font-size="10" fill="var(--chart-text)" text-anchor="middle">-0.026</text>
<text x="138" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A-B</text>
<text x="224" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A-C</text>
<text x="310" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A-D</text>
<text x="396" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">B-C</text>
<text x="482" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">B-D</text>
<text x="568" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">C-D</text>
<text x="110" y="310" font-size="11" fill="var(--chart-text)">Merah = hampir identik (diversifikasi semu). Biru = kandidat diversifikasi nyata.</text>
</g>
</svg>`;

export const wqb28: V2Lesson = {
  slug: "wqb28-portfolio-alpha",
  track: "WorldQuant Brain",
  module: "Riset Kuantitatif",
  title: "WQB28 — Portfolio Construction: Ketika Alpha Bertemu Alpha",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Empat alpha lolos, portofolionya gagal",
      prose: [
        "Bagas, konsultan delapan bulan, punya empat alpha yang masing-masing lolos gerbang submit: Sharpe di atas 1,25, fitness di atas 1, turnover aman. Ia menggabungkan keempatnya dengan bobot sama, yakin portofolionya akan terbang. Tiga bulan kemudian performanya datar — jauh di bawah jumlah keempat Sharpe individual.",
        "Autopsinya menyakitkan: keempat alpha itu berkorelasi 0,8 satu sama lain. Mereka pada dasarnya taruhan yang sama dengan empat nama berbeda. Ketika faktor pendorongnya terpukul, keempatnya jatuh bersama — diversifikasi yang hanya ada di spreadsheet, tidak di realitas.",
        "Twist-nya: Bagas tidak kekurangan alpha bagus. Ia kekurangan alpha yang BERBEDA. Lesson ini tentang konstruksi portofolio sinyal: mengukur korelasi antar-alpha, memahami self-correlation sebagai risiko portofolio, dan memilih kombinasi dengan matematika — bukan dengan harapan.",
      ],
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Korelasi: pajak tersembunyi atas setiap alpha tambahan",
      prose: [
        "Dua alpha yang masing-masing bagus bisa menjadi portofolio yang biasa-biasa saja bila mereka bergerak bersama. Rumus varians portofolio dua aset menjelaskannya: suku terakhir — 2·w1·w2·ρ·σ1·σ2 — adalah “pajak korelasi”. Saat ρ mendekati 1, diversifikasi menguap; saat ρ mendekati 0 (atau negatif), portofolio mendapatkan pengurangan risiko gratis.",
        "Self-correlation di Brain mengukur seberapa mirip alpha-mu dengan alpha yang sudah ada di kumpulan alpha milikmu sendiri (pool = kumpulan alpha milikmu sendiri yang sudah disubmit, bukan milik orang lain). Aturan mainnya: self-correlation di atas 0,7 = tidak lolos — dan itu bukan sekadar aturan administratif. Itu pernyataan bahwa alpha yang terlalu mirip tidak menambah diversifikasi, hanya menambah beban risiko yang sama.",
        "Bobot sederhana yang masuk akal: equal weight (semua sama — baseline yang sulit dikalahkan) dan inverse-volatility (bobot ∝ 1/volatilitas — alpha yang lebih tenang dapat porsi lebih besar). Keduanya tidak butuh optimasi; optimasi bobot atas data historis adalah overfitting dengan jas rapi.",
        "Netralisasi keluarga sinyal: sebelum menggabungkan, pastikan alpha-alpha itu datang dari keluarga sinyal yang berbeda (price-volume vs fundamental vs analis, misalnya). Dua alpha “berbeda” dari keluarga yang sama sering berkorelasi tinggi — seperti kasus Bagas.",
      ],
      formula: String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2 \qquad S = \frac{\bar{r}}{\sigma}`,
      formulaNote: "σ_p² = varians portofolio; w1, w2 = bobot; σ1, σ2 = volatilitas tiap alpha; ρ (rho) = korelasi antar-alpha — suku terakhir inilah pajak korelasi. S = Sharpe; r-bar = rata-rata return; σ = volatilitas (simpangan baku). Sharpe portofolio naik bila ρ turun — diversifikasi yang nyata.",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“Empat alpha lolos submit = portofolio yang kuat.” Lolos submit mengukur kualitas INDIVIDU. Portofolio mengukur kualitas GABUNGAN. Empat alpha berkorelasi 0,8 = satu taruhan yang dihitung empat kali — risikonya tidak terbagi, hanya namanya yang banyak.",
      },
      tasks: [],
    },
    {
      id: "lab-portofolio",
      eyebrow: "Langkah 3 · Lab",
      title: "Bangun portofolio yang benar-benar terdiversifikasi",
      prose: [
        "Tulis tiga fungsi: `pearson(x, y)` — korelasi (tanpa library); `sharpe(rs)` — mean dibagi simpangan baku populasi; lalu hitung enam korelasi berpasangan dari empat alpha (A, B, C, D).",
        "Pilih pasangan dengan korelasi TERENDAH, bentuk portofolio equal-weight dari pasangan itu, hitung Sharpe-nya, dan bandingkan dengan Sharpe alpha A saja. Vonis: DIVERSIFIKASI BEKERJA bila Sharpe pasangan > Sharpe A; selain itu TIDAK. Lalu uji kejujuran terakhir: bandingkan Sharpe pasangan dengan ambang submit 1,25.",
        "Eksperimen setelah selesai: bentuk portofolio dari pasangan A-B (korelasi 0,996) dan hitung Sharpe-nya. Bandingkan dengan A+C. Itulah harga diversifikasi semu — dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Tulis pearson & sharpe; hitung 6 korelasi berpasangan" },
        { id: "t2", text: "Pilih pasangan terbaik, hitung Sharpe, cetak vonisnya" },
      ],
      expected: "corr(A,B)=0.996 corr(A,C)=-0.171 corr(A,D)=0.000\ncorr(B,C)=-0.169 corr(B,D)=-0.013 corr(C,D)=-0.026\npasangan terbaik: A+C (corr=-0.171)\nSharpe A saja=0.381 Sharpe A+C=0.397 -> DIVERSIFIKASI BEKERJA (tetapi 0.397 < 1.25: BELUM LAYAK SUBMIT)",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“Sharpe portofolio 0,397 > 0,381 — berarti layak submit.” Tidak. 0,397 adalah Sharpe DATA MAINAN 12 periode tanpa biaya — ambang submit 1,25 berlaku untuk simulasi resmi. Vonis lab ini dua lapis: diversifikasi bekerja (struktur benar) TETAPI belum layak submit (angka belum cukup). Dua kebenaran yang harus dipegang bersamaan.",
      },
      hints: [
        "pearson: (Σ(x-x̄)(y-ȳ)) / sqrt(Σ(x-x̄)² · Σ(y-ȳ)²).",
        "Pasangan terbaik = nilai korelasi TERKECIL (boleh negatif) — min atas keenam nilai.",
      ],
      code: {
        starter: "# Return 12 periode untuk 4 alpha. JANGAN UBAH.\nA = [0.02,-0.01,0.03,0.01,-0.02,0.02,0.01,-0.01,0.03,0.0,-0.02,0.02]\nB = [0.019,-0.012,0.028,0.008,-0.018,0.021,0.012,-0.009,0.031,0.002,-0.021,0.019]\nC = [-0.01,0.02,-0.02,0.03,0.01,-0.03,0.02,0.01,-0.01,0.02,-0.03,0.03]\nD = [-0.01,0.02,0.0,0.02,-0.01,0.01,0.03,-0.02,0.01,0.0,0.02,-0.01]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    return\ndef sharpe(rs):\n    return\n\nnames = [\"A\",\"B\",\"C\",\"D\"]\nrets = [A,B,C,D]\ncorrs = {}\nfor i in range(4):\n    for j in range(i+1, 4):\n        corrs[(names[i],names[j])] = pearson(rets[i], rets[j])\nprint(f\"corr(A,B)={corrs[('A','B')]:.3f} corr(A,C)={corrs[('A','C')]:.3f} corr(A,D)={corrs[('A','D')]:.3f}\")\nprint(f\"corr(B,C)={corrs[('B','C')]:.3f} corr(B,D)={corrs[('B','D')]:.3f} corr(C,D)={corrs[('C','D')]:.3f}\")\nbest = min(corrs, key=lambda k: corrs[k])\nr1 = dict(zip(names, rets))[best[0]]\nr2 = dict(zip(names, rets))[best[1]]\nport = [(a+b)/2 for a, b in zip(r1, r2)]\ns_a, s_p = sharpe(A), sharpe(port)\nprint(f\"pasangan terbaik: {best[0]}+{best[1]} (corr={corrs[best]:.3f})\")\nkerja = \"DIVERSIFIKASI BEKERJA\" if s_p > s_a else \"TIDAK\"\nlayak = \"BELUM LAYAK SUBMIT\" if s_p < 1.25 else \"LAYAK SUBMIT\"\nprint(f\"Sharpe A saja={s_a:.3f} Sharpe {best[0]}+{best[1]}={s_p:.3f} -> {kerja} (tetapi {s_p:.3f} < 1.25: {layak})\")\n",
        lockLines: 5,
        solution: "# Return 12 periode untuk 4 alpha. JANGAN UBAH.\nA = [0.02,-0.01,0.03,0.01,-0.02,0.02,0.01,-0.01,0.03,0.0,-0.02,0.02]\nB = [0.019,-0.012,0.028,0.008,-0.018,0.021,0.012,-0.009,0.031,0.002,-0.021,0.019]\nC = [-0.01,0.02,-0.02,0.03,0.01,-0.03,0.02,0.01,-0.01,0.02,-0.03,0.03]\nD = [-0.01,0.02,0.0,0.02,-0.01,0.01,0.03,-0.02,0.01,0.0,0.02,-0.01]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    n = len(x)\n    mx, my = sum(x)/n, sum(y)/n\n    num = sum((a-mx)*(b-my) for a, b in zip(x, y))\n    den = (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\n    return num/den if den else 0.0\ndef sharpe(rs):\n    n = len(rs)\n    m = sum(rs)/n\n    v = sum((r-m)**2 for r in rs)/n\n    return m/(v**0.5) if v > 0 else 0.0\n\nnames = [\"A\",\"B\",\"C\",\"D\"]\nrets = [A,B,C,D]\ncorrs = {}\nfor i in range(4):\n    for j in range(i+1, 4):\n        corrs[(names[i],names[j])] = pearson(rets[i], rets[j])\ncab = corrs[(\"A\",\"B\")]\ncac = corrs[(\"A\",\"C\")]\ncad = corrs[(\"A\",\"D\")]\ncbc = corrs[(\"B\",\"C\")]\ncbd = corrs[(\"B\",\"D\")]\nccd = corrs[(\"C\",\"D\")]\nprint(f\"corr(A,B)={cab:.3f} corr(A,C)={cac:.3f} corr(A,D)={cad:.3f}\")\nprint(f\"corr(B,C)={cbc:.3f} corr(B,D)={cbd:.3f} corr(C,D)={ccd:.3f}\")\nbest = min(corrs, key=lambda k: corrs[k])\nr1 = dict(zip(names, rets))[best[0]]\nr2 = dict(zip(names, rets))[best[1]]\nport = [(a+b)/2 for a, b in zip(r1, r2)]\ns_a, s_p = sharpe(A), sharpe(port)\nprint(f\"pasangan terbaik: {best[0]}+{best[1]} (corr={corrs[best]:.3f})\")\nkerja = \"DIVERSIFIKASI BEKERJA\" if s_p > s_a else \"TIDAK\"\nlayak = \"BELUM LAYAK SUBMIT\" if s_p < 1.25 else \"LAYAK SUBMIT\"\nprint(f\"Sharpe A saja={s_a:.3f} Sharpe {best[0]}+{best[1]}={s_p:.3f} -> {kerja} (tetapi {s_p:.3f} < 1.25: {layak})\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "cab", value: 0.996, tol: 0.001, label: "`cab` sekitar 0,996", msg: "A dan B hampir identik — diversifikasi semu." },
          { kind: "equal", task: "t1", name: "cac", value: -0.171, tol: 0.001, label: "`cac` sekitar -0,171", msg: "Korelasi terendah — kandidat diversifikasi nyata." },
          { kind: "equal", task: "t2", name: "s_a", value: 0.381, tol: 0.005, label: "`s_a` sekitar 0,381", msg: "Sharpe alpha A saja." },
          { kind: "equal", task: "t2", name: "s_p", value: 0.397, tol: 0.005, label: "`s_p` sekitar 0,397", msg: "Sharpe portofolio A+C — naik berkat korelasi rendah." },
          { kind: "stdout_matches", task: "t2", label: "Pasangan terbaik = A+C", msg: "Korelasi terendah di antara keenam pasangan.", pattern: "pasangan terbaik: A\\+C \\(corr=-0\\.171\\)" },
          { kind: "stdout_matches", task: "t2", label: "Vonis dua lapis tercetak", msg: "Diversifikasi bekerja TETAPI belum layak submit.", pattern: "DIVERSIFIKASI BEKERJA.*BELUM LAYAK SUBMIT" },
        ],
      },
      reference: "Hitung korelasinya dulu, kagumi Sharpe-nya kemudian.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 4 · Chart",
      title: "Membaca peta korelasi: mana yang benar-benar berbeda",
      prose: [
        "Chart batang ini menampilkan keenam korelasi berpasangan dari lab — batang merah untuk korelasi sangat tinggi, biru untuk sisanya.",
        "Cara membaca: sumbu X = pasangan alpha; tinggi batang = korelasi Pearson; batang ke atas = bergerak searah, ke bawah = berlawanan arah.",
        "Interpretasi: hanya A-B yang merah menyala (0,996) — dua alpha yang pada dasarnya satu taruhan. Pasangan A-C (-0,171) dan B-C (-0,169) adalah kandidat diversifikasi terbaik. Pelajaran Bagas dalam satu gambar: menghitung korelasi SEBELUM menggabungkan mengubah 'empat alpha' menjadi 'satu taruhan + tiga diversifier'.",
      ],
      figure: { svg: FIG_CORR, alt: "Bar chart enam korelasi berpasangan; A-B 0,996 tertinggi", caption: "A-B hampir identik; A-C dan B-C kandidat diversifikasi terbaik." },
      tasks: [],
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta: menggabungkan alpha — kapan, dengan siapa, berapa",
      prose: [
        "Skenario 1 — korelasi berpasangan < 0,3 dan tiap alpha lolos gerbang individu: gabungkan dengan bobot equal atau inverse-vol. Ini diversifikasi yang nyata.",
        "Skenario 2 — korelasi > 0,7 antar dua alpha: jangan hitung dua-duanya sebagai diversifikasi. Pilih yang lebih baik (Sharpe lebih tinggi / turnover lebih rendah), atau netralkan faktor bersamanya dulu.",
        "Skenario 3 — Sharpe portofolio naik tetapi masih < 1,25: struktur benar, angka belum cukup. Tambah alpha dari keluarga sinyal BERBEDA, bukan lebih banyak varian keluarga yang sama.",
        "Skenario 4 — self-correlation alpha baru > 0,7 terhadap pool: tolak untuk kombinasi itu — ia tidak menambah diversifikasi, hanya menambah bobot pada risiko yang sudah ada.",
        "Skenario 5 — ingin bobot 'optimal' dari optimizer: tolak godaan. Bobot hasil optimasi atas data historis = overfitting berbaju matematika. Equal atau inverse-vol cukup.",
        "Aturan 10 detik: tiap alpha lolos individu? Korelasi antar mereka rendah? Keluarga sinyal berbeda? Bobot sederhana? Empat ya = gabungkan; satu tidak = perbaiki dulu.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Portofolio tiga alpha milik Bagas",
      prose: [
        "Bagas kembali dengan tiga alpha baru — kali ini ia menghitung dulu. Data: Sharpe P=1,4, Q=1,3, R=1,5 (semua lolos individu); korelasi P-Q=0,85, P-R=0,10, Q-R=0,05; turnover ketiganya di bawah 40%.",
        "Pertanyaan 1: pasangan mana yang memberi diversifikasi terbaik, dan kenapa bukan P-Q?",
        "Pertanyaan 2: bila Bagas memaksa memakai ketiganya dengan bobot equal, apa risikonya?",
        "Pertanyaan 3: alpha keempat seperti apa yang paling berharga ditambahkan ke portofolio ini?",
        "Pembahasan: (1) Q-R (0,05) — terendah; P-Q 0,85 adalah diversifikasi semu meski Sharpe keduanya bagus. (2) Bobot equal atas ketiganya memberi bobot ganda pada faktor bersama P-Q — portofolio terkonsentrasi pada satu taruhan tanpa disadari. (3) Alpha dari keluarga sinyal berbeda dengan korelasi rendah terhadap ketiganya — yang menambah diversifikasi, bukan yang Sharpe individunya tertinggi.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi portofolio",
      prose: [
        "Lima pertanyaan — jawab sebagai manajer portofolio sinyal, bukan kolektor alpha.",
      ],
      tasks: [],
      summary: [
        "Kualitas portofolio ≠ jumlah alpha lolos — korelasi antar-alpha adalah pajak tersembunyi.",
        "Rumus pajaknya: suku 2·w1·w2·ρ·σ1·σ2 — ρ mendekati 1 menghapus manfaat diversifikasi.",
        "Self-correlation > 0,7 = alpha tidak menambah diversifikasi (aturan Brain sekaligus kebenaran statistik).",
        "Bobot sederhana (equal / inverse-vol) mengalahkan optimasi bobot atas data historis.",
        "Vonis dua lapis: struktur benar (diversifikasi bekerja) vs angka cukup (Sharpe ≥ 1,25) — keduanya harus ya.",
        "Alpha paling berharga berikutnya = keluarga sinyal berbeda + korelasi rendah, bukan Sharpe individu tertinggi.",
      ],
      quiz: [
        {
          q: "Empat alpha masing-masing Sharpe 1,4 tetapi korelasi antar mereka 0,85. Apa masalahnya?",
          options: [
            { text: "Diversifikasi semu — pada dasarnya satu taruhan dengan empat nama", why: "Tepat — korelasi 0,85 menghapus hampir semua manfaat penggabungan.", correct: true },
            { text: "Tidak ada masalah — Sharpe individu sudah di atas 1,25", why: "Salah — ambang individu tidak menjamin kualitas gabungan." },
            { text: "Turnover pasti terlalu tinggi", why: "Tidak berhubungan — korelasi tidak menentukan turnover." },
            { text: "Harus dibuang semua dan mulai dari nol", why: "Terlalu jauh — pilih satu yang terbaik, tambah diversifier yang benar-benar berbeda." },
          ],
        },
        {
          q: "Kenapa bobot hasil optimizer atas data historis ditolak?",
          options: [
            { text: "Itu overfitting berbaju matematika — bobotnya menghafal noise masa lalu", why: "Tepat — equal/inverse-vol lebih robust justru karena tidak 'belajar' dari noise.", correct: true },
            { text: "Karena optimizer terlalu lambat untuk dipakai", why: "Bukan soal kecepatan — soal validitas statistik." },
            { text: "Karena Brain melarang optimizer", why: "Tidak ada larangan semacam itu — ini prinsip kehati-hatian, bukan aturan platform." },
            { text: "Karena bobot harus selalu equal", why: "Tidak harus — inverse-vol juga sederhana dan sah; yang ditolak adalah optimasi atas histori." },
          ],
        },
        {
          q: "Alpha baru self-correlation 0,75 terhadap pool. Keputusan?",
          options: [
            { text: "Tolak untuk kombinasi itu — tidak menambah diversifikasi", why: "Tepat — di atas 0,7 ia hanya menambah bobot pada risiko yang sudah ada.", correct: true },
            { text: "Terima — Sharpe individunya yang penting", why: "Salah — Sharpe individu tidak membayar pajak korelasi." },
            { text: "Terima dengan bobot setengah", why: "Bobot setengah dari risiko yang sama tetap risiko yang sama — masalahnya korelasi, bukan ukuran." },
            { text: "Tahan sampai self-correlation turun sendiri", why: "Self-correlation tidak 'turun sendiri' — ia sifat struktural sinyal." },
          ],
        },
        {
          q: "Portofolio A+C: Sharpe 0,397 > Sharpe A 0,381, tetapi ambang submit 1,25. Vonis yang jujur?",
          options: [
            { text: "Diversifikasi bekerja TETAPI belum layak submit — dua kebenaran sekaligus", why: "Tepat — struktur benar, angka belum cukup; vonis dua lapis.", correct: true },
            { text: "Layak submit — Sharpe naik berarti sudah cukup", why: "Salah — 0,397 masih jauh dari 1,25; kenaikan relatif bukan kelolosan absolut." },
            { text: "Gagal total — diversifikasi tidak berguna", why: "Salah — struktur portofolionya benar; yang kurang adalah kekuatan sinyalnya." },
            { text: "Ulangi lab sampai Sharpe di atas 1,25", why: "Mengutak-atik sampai angka cocok = mengarang hasil, bukan riset." },
          ],
        },
        {
          q: "Kamu punya budget menambah satu alpha. Pilihan paling berharga?",
          options: [
            { text: "Alpha keluarga sinyal berbeda, korelasi rendah ke portofolio existing", why: "Tepat — yang dibeli adalah diversifikasi, bukan Sharpe individu tertinggi.", correct: true },
            { text: "Alpha dengan Sharpe individu tertinggi, apa pun korelasinya", why: "Sharpe tinggi yang berkorelasi 0,9 = membayar mahal untuk risiko yang sama." },
            { text: "Alpha yang paling mirip dengan yang sudah ada — biar konsisten", why: "Itu justru definisi diversifikasi semu." },
            { text: "Alpha apa pun asal turnover-nya di bawah 70%", why: "Turnover lolos itu syarat perlu, bukan kriteria pemilihan diversifier." },
          ],
        },
      ],
      reference: "Kolektor alpha menghitung banyaknya; manajer portofolio menghitung bedanya.",
    },
  ],
};
