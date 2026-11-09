import type { V2Lesson } from "../lib/types";

// Efficient frontier + CAL yang menyinggung di titik T (max Sharpe).
// T dihitung dari angka lesson: 40/40/20 -> E(R) 7,8%, sigma 8,8%,
// Sharpe (7,8-3)/8,8 = 0,54. CAL: dari Rf 3% dengan slope 0,54.
const FRONTIER_CAL_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Efficient frontier dan garis CAL yang menyinggungnya di titik T, portofolio max Sharpe 0,54.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<polyline points="115,157 148,136 192,118 254,90 324,77 412,60" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="60" y1="170" x2="460" y2="5" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<circle cx="254" cy="90" r="5" fill="var(--c1)"/>
<circle cx="60" cy="170" r="4" fill="var(--c2)"/>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">12%</text><text x="54" y="91">8%</text><text x="54" y="157">4%</text><text x="54" y="224">0</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="170" y="240">5%</text><text x="280" y="240">10%</text><text x="390" y="240">15%</text><text x="500" y="240">20%</text></g>
<text x="62" y="36" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">E(R)</text>
<text x="500" y="232" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">risiko (sigma)</text>
<text x="246" y="76" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end" font-weight="600">T: 40/40/20, Sharpe 0,54</text>
<text x="70" y="190" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Rf = 3%</text>
<line x1="300" y1="202" x2="325" y2="202" stroke="var(--c1)" stroke-width="2.5"/><text x="330" y="206" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">frontier</text>
<line x1="300" y1="216" x2="325" y2="216" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/><text x="330" y="220" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">CAL</text>
</svg>`;

export const pmd2: V2Lesson = {
  slug: "pm-d2-optimisasi",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D2 — Optimisasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-quant-fund",
      eyebrow: "Langkah 1 · Cerita",
      title: "Optimisasi yang \u2018sempurna\u2019 dan bangkrut",
      prose: [
        "1990-an: quant fund menjalankan mean-variance murni. Output: 147% leverage di satu saham (E(R) tertinggi hanya 0,3%!). 1998: estimasi meleset sedikit → portofolio hancur. Error maximization (Michaud) memakan korban nyata.",
        "Twist-nya: matematikanya benar, inputnya sampah \u2014 dan optimisasi memperkuat sampah (bobot ekstrem di estimasi paling salah!). Solusinya bukan \u2018jangan optimisasi\u2019 \u2014 melainkan optimisasi yang rendah hati: Black-Litterman + constraints + resampling.",
        "Lesson ini tentang kekuatan dengan rem: mean-variance, Black-Litterman, dan teknik robust.",
      ],
      tasks: [],
      reference: "Robust > optimal. Selalu.",
    },
    {
      id: "mean-variance",
      eyebrow: "Langkah 2 · Mean-variance + chart",
      title: "Mesin balap butuh rem",
      prose: [
        "Mean-variance: pilih bobot yang memaksimalkan Sharpe ratio (bukan return!). Grid search: coba ribuan kombinasi kelipatan 10% → frontier. Rem wajib: long-only, maks 40%/aset, limit turnover. Tanpa constraints = error maximizer.",
        "Contoh 3 aset (saham E(R) 10% σ18%; obligasi 7% σ6%; emas 5% σ15%; ρ saham-obligasi 0,2; Rf 3%): grid search dengan maks 40% → max Sharpe 0,54 pada bobot 40/40/20 (E(R) 7,8%). Tanpa batas (maks 100%): Sharpe 0,72 pada 10/80/10 \u2014 angka lebih tinggi, tetapi 80% di satu aset = jauh lebih rapuh. Sedikit lebih \u2018optimal\u2019, jauh lebih berbahaya. Robust > optimal.",
        "Error maximization: A E(R)=8,3%, B 8,0%, kovarians sama → MV murni: 147% A, −47% B (leverage + short!). Kenapa? Optimizer percaya beda 0,3% = sinyal, padahal itu noise. Jika meleset (A sebenarnya 7%) → hancur. Dengan long-only + maks 60%: 60% A, 40% B \u2014 masuk akal. Uji sensitivitas wajib: ubah E(R) ±1%; jika bobot liar (100% → 0%), tolak. Rapuh = tolak.",
        "Cara membaca: sumbu X = risiko portofolio (σ), sumbu Y = expected return. Kurva biru = efficient frontier: portofolio terbaik yang bisa dicapai untuk tiap tingkat risiko. Garis putus-putus = CAL (capital allocation line): kombinasi aset bebas risiko (Rf 3%) dengan satu portofolio frontier, menyinggung kurva tepat di satu titik.",
        "Interpretasi: titik singgung T = portofolio max Sharpe 0,54 — 40% saham / 40% obligasi / 20% emas dengan E(R) 7,8% — persis hasil grid search ber-constraints di lesson ini. Setiap titik di CAL mendominasi frontier: return lebih tinggi untuk risiko yang sama (atau risiko lebih rendah untuk return yang sama). Tanpa constraints, optimizer memilih titik singgung yang lebih tinggi (Sharpe 0,72) tetapi dengan 80% di satu aset — gambar yang sama, rem yang dilepas. Frontier menunjukkan arah; constraints menentukan apakah kamu selamat sampai tujuan.",
      ],
      figure: {
        svg: FRONTIER_CAL_SVG,
        alt: "Efficient frontier dan garis CAL yang menyinggungnya di titik T, portofolio max Sharpe 0,54.",
        caption: "Frontier + CAL: titik singgung T (40/40/20, Sharpe 0,54) mendominasi semua portofolio frontier lain — dengan rem constraints terpasang.",
      },
      formula: String.raw`\max_w \frac{w^T\mu - r_f}{\sqrt{w^T\Sigma w}}`,
      formulaNote: "Maksimalkan Sharpe (return per unit risiko). Constraints: w_i ≥ 0, w_i ≤ 0,4.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Optimal = terbaik \u2014 ikuti bobotnya persis.\u2019 Salah. Bobot 2 desimal = presisi palsu dari input ±2%. Optimisasi = alat berpikir, bukan mesin jawaban. Round ke 5%, tampilkan sensitivitas, dan jangan pernah tanpa constraints.",
      },
      reference: "Merton (1980): estimasi mean butuh 400 tahun data untuk ±1% \u2014 jangan percaya beda kecil.",
    },
    {
      id: "lab-grid-search",
      eyebrow: "Langkah 3 · Lab grid search",
      title: "Cari max Sharpe dengan rem",
      prose: [
        "Jalankan grid search mean-variance 3 aset dengan batas maks 40%/aset. Coba ubah MAX_W menjadi 1,0 (tanpa batas): bobot ekstrem muncul \u2014 error maximization! Bandingkan Sharpe dan bobotnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi loop grid search (er, var, sharpe)" },
        { id: "t2", text: "Cetak portofolio max Sharpe" },
      ],
      expected: "Max Sharpe 0.54: saham 40%, obligasi 40%, emas 20%  E(R) 7.8%",
      hints: [
        "er = Σ w×ER; var = ΣΣ w_i×w_j×COV[i][j]; sharpe = (er − RF)/√var.",
        "Lewati kombinasi yang jumlahnya ≠ 1 atau ada bobot > MAX_W.",
        "Simpan (sharpe, w, er) terbaik; cetak dengan format :.2f / :.0% / :.1%.",
      ],
      code: {
        starter: `# Grid search mean-variance 3 aset (pure Python)\nimport math, itertools\nER = [0.10, 0.07, 0.05]\nSIG = [0.18, 0.06, 0.15]\nRHO = [[1, 0.2, 0.1], [0.2, 1, 0.0], [0.1, 0.0, 1]]\nRF, MAX_W = 0.03, 0.4   # ubah MAX_W jadi 1.0!\nCOV = [[RHO[i][j]*SIG[i]*SIG[j] for j in range(3)] for i in range(3)]\n\nterbaik = None\nfor w in itertools.product([i/10 for i in range(11)], repeat=3):\n    if abs(sum(w)-1) > 1e-9 or any(x > MAX_W + 1e-9 for x in w):\n        continue\n    # TULIS KODEMU\n    er = \n    var = \n    sharpe = \n    if terbaik is None or sharpe > terbaik[0]:\n        terbaik = (sharpe, w, er)\n\ns, w, er = terbaik\nprint(f"Max Sharpe {s:.2f}: saham {w[0]:.0%}, obligasi {w[1]:.0%}, emas {w[2]:.0%}")\nprint(f"E(R) {er:.1%}")\nprint()\nprint("Tanpa MAX_W: bobot ekstrem (error maximization).")\nprint("Constraints = rem. Round ke 5%!")`,
        lockLines: 6,
        solution: `# Grid search mean-variance 3 aset (pure Python)\nimport math, itertools\nER = [0.10, 0.07, 0.05]\nSIG = [0.18, 0.06, 0.15]\nRHO = [[1, 0.2, 0.1], [0.2, 1, 0.0], [0.1, 0.0, 1]]\nRF, MAX_W = 0.03, 0.4   # ubah MAX_W jadi 1.0!\nCOV = [[RHO[i][j]*SIG[i]*SIG[j] for j in range(3)] for i in range(3)]\n\nterbaik = None\nfor w in itertools.product([i/10 for i in range(11)], repeat=3):\n    if abs(sum(w)-1) > 1e-9 or any(x > MAX_W + 1e-9 for x in w):\n        continue\n    # TULIS KODEMU\n    er = sum(a*b for a, b in zip(w, ER))\n    var = sum(w[i]*w[j]*COV[i][j] for i in range(3) for j in range(3))\n    sharpe = (er - RF)/math.sqrt(var)\n    if terbaik is None or sharpe > terbaik[0]:\n        terbaik = (sharpe, w, er)\n\ns, w, er = terbaik\nprint(f"Max Sharpe {s:.2f}: saham {w[0]:.0%}, obligasi {w[1]:.0%}, emas {w[2]:.0%}")\nprint(f"E(R) {er:.1%}")\nprint()\nprint("Tanpa MAX_W: bobot ekstrem (error maximization).")\nprint("Constraints = rem. Round ke 5%!")`,
        checks: [
          { kind: "equal", task: "t1", name: "s", value: 0.54, tol: 0.01, label: "Sharpe ≈ 0.54", msg: "Max Sharpe grid search (kelipatan 10%, maks 40%) untuk 3 aset ini." },
          { kind: "equal", task: "t1", name: "w", value: [0.4, 0.4, 0.2], tol: 1e-9, label: "Bobot = (40%, 40%, 20%)", msg: "Kombinasi max Sharpe pada grid 10% dengan constraint." },
          { kind: "stdout_matches", task: "t2", pattern: "Max Sharpe 0\\.54: saham 40%, obligasi 40%, emas 20%", label: "`print` menampilkan Max Sharpe 0.54", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tanpa batas: Sharpe 0,72 pada 10/80/10 \u2014 lebih tinggi, jauh lebih rapuh.",
    },
    {
      id: "lab-black-litterman",
      eyebrow: "Langkah 4 · Lab Black-Litterman",
      title: "Musyawarah pasar + analis",
      prose: [
        "Gabungkan equilibrium pasar dengan views analis, dibobot confidence. Coba ubah CONF dari 0,5 menjadi 0,9 (sangat yakin): posterior mendekati views penuh. CONF=0 → ikut pasar; CONF=1 → ikut analis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bl` per aset" },
        { id: "t2", text: "Cetak tabel perbandingan" },
      ],
      expected: "saham: equil 8.0%, view 11.0%, BL 9.5%  obligasi: 5.0%, 5.0%, 5.0%",
      hints: [
        "bl = (1−CONF)×EQ[a] + CONF×VIEW[a] \u2014 rata-rata terbobot confidence.",
        "Loop for a in EQ; cetak dengan format :>7.1% / :>8.1%.",
        "Versi penuh memakai matriks kovarians; intuisinya sama.",
      ],
      code: {
        starter: `# Black-Litterman 2 aset (intuisi: rata-rata terbobot)\nEQ = {"saham": 0.08, "obligasi": 0.05}   # equilibrium (implied)\nVIEW = {"saham": 0.11, "obligasi": 0.05} # views analis\nCONF = 0.5   # confidence 0..1 (ubah jadi 0.9!)\n\nprint(f"{'aset':<10}{'equil':>8}{'view':>8}{'BL':>8}")\nfor a in EQ:\n    # TULIS KODEMU\n    bl = \n    print(f"{a:<10}{EQ[a]:>7.1%}{VIEW[a]:>8.1%}{bl:>8.1%}")\nprint()\nprint("CONF=0 -> ikut pasar. CONF=1 -> ikut analis.")\nprint("BL = musyawarah proporsional keyakinan.")`,
        lockLines: 3,
        solution: `# Black-Litterman 2 aset (intuisi: rata-rata terbobot)\nEQ = {"saham": 0.08, "obligasi": 0.05}   # equilibrium (implied)\nVIEW = {"saham": 0.11, "obligasi": 0.05} # views analis\nCONF = 0.5   # confidence 0..1 (ubah jadi 0.9!)\n\nprint(f"{'aset':<10}{'equil':>8}{'view':>8}{'BL':>8}")\nfor a in EQ:\n    # TULIS KODEMU\n    bl = (1-CONF)*EQ[a] + CONF*VIEW[a]\n    print(f"{a:<10}{EQ[a]:>7.1%}{VIEW[a]:>8.1%}{bl:>8.1%}")\nprint()\nprint("CONF=0 -> ikut pasar. CONF=1 -> ikut analis.")\nprint("BL = musyawarah proporsional keyakinan.")`,
        checks: [
          { kind: "equal", task: "t1", name: "bl", value: 0.05, tol: 1e-9, label: "`bl` terakhir = 0.05 (obligasi)", msg: "0,5×0,05 + 0,5×0,05 = 5% \u2014 view = equilibrium, posterior tetap." },
          { kind: "stdout_matches", task: "t2", pattern: "saham\\s+8\\.0%\\s+11\\.0%\\s+9\\.5%", label: "`print` menampilkan baris saham 8.0% / 11.0% / 9.5%", msg: "BL saham = 0,5×8% + 0,5×11% = 9,5% (bukan 11% \u2014 di-shrink!)." },
        ],
      },
      reference: "BL = kerendahan hati Bayesian: tidak ada bobot 147% dari view lemah.",
    },
    {
      id: "black-litterman",
      eyebrow: "Langkah 5 · Black-Litterman",
      title: "Equilibrium + views",
      prose: [
        "Black-Litterman: mulai dari equilibrium (bobot market-cap → implied return via reverse optimization: Π = δΣw_mkt) + campur views analis dengan confidence (Ω) → posterior return → optimisasi. Hasilnya di antara pasar dan views, proporsional keyakinan.",
        "Contoh: equilibrium saham 8%, obligasi 5%. View: \u2018saham outperform 3%\u2019, confidence sedang → posterior saham ≈ 9% (bukan 8+3=11% \u2014 di-shrink ke equilibrium!). Optimisasi → overweight saham moderat (+10%), bukan ekstrem. Views tanpa BL = 100% saham (bencana jika salah!). Contoh angka: equilibrium A 6%, B 6%; view A 8% (confidence 50%) → BL = 6% + 0,5×(8%−6%) = 7%. Bobot moderat, bukan 147%. Shrink by confidence!",
        "Keunggulannya: intuitif (mulai dari \u2018pasar benar\u2019), views terukur (bukan 0/100), bobot masuk akal. Analoginya musyawarah: pasar = pendapat mayoritas (equilibrium); analis = saksi ahli (views). Keputusan = mayoritas + ahli, dibobot kredibilitas. Bukan \u2018ahli selalu benar\u2019 (MV murni) atau \u2018ahli diabaikan\u2019.",
      ],
      formula: String.raw`\Pi = \delta \Sigma w_{mkt} \quad;\quad \mu_{BL} = [(\tau\Sigma)^{-1} + P^T\Omega^{-1}P]^{-1}[(\tau\Sigma)^{-1}\Pi + P^T\Omega^{-1}Q]`,
      formulaNote: "Π = implied equilibrium return (dari bobot pasar); Q = views; Ω = confidence. Praktisnya software yang hitung \u2014 pahami intuisinya.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Black-Litterman terlalu akademis, tidak praktis.\u2019 Salah. Intuisi BL = musyawarah pasar + analis \u2014 justru paling praktis dan dipakai manajer institusi global. Versi sederhana di lab sudah menangkap 80% manfaat: views terukur + bobot masuk akal.",
      },
      reference: "Black-Litterman (1992): cara optimisasi tanpa bunuh diri.",
    },
    {
      id: "robust",
      eyebrow: "Langkah 6 · Teknik robust",
      title: "Rendah hati kuantitatif",
      prose: [
        "Tiga teknik robust. Resampling (Michaud): optimisasi di banyak simulasi input → rata-ratakan bobot (haluskan ekstrem!). Contoh: E(R) saham 10% ±3% → MV tunggal 60% saham; resampling 1.000 simulasi → bobot rata-rata 45% \u2014 mengakui ketidakpastian. Jika E(R) sebenarnya 7%: MV tunggal rugi besar, resampled selamat. Risk parity (alokasi berbasis kontribusi risiko): bobot ∝ 1/σ \u2014 hanya butuh kovarians (lebih stabil dari mean!). Max diversification: maksimalkan rasio diversifikasi.",
        "Shrinkage (Ledoit-Wolf): kovarians sampel = noisy (terutama jika aset banyak, data sedikit!) → shrink ke target terstruktur: Σ_shrink = δF + (1−δ)S. Selalu shrink kovarians; jangan pakai sampel mentah. Dan benchmark kerendahan hati: DeMiguel et al. (2009) \u2014 14 model vs 1/N, tidak ada yang konsisten menang! Kenapa? Estimasi error: model = banyak parameter = banyak error; 1/N = 0 parameter. Sederhana > canggih (jika input buruk!).",
        "Prinsipnya: diversifikasi antar-model \u2014 tidak ada satu optimisasi yang dipercaya 100%. Checklist sebelum optimisasi: shrink? constraint? BL? sensitivitas ±1%? round 5%? turnover (biaya!)? Enam cek = aman.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "LTCM 1998: fund dengan 2 peraih Nobel, optimisasi canggih, leverage 25× \u2014 bangkrut karena input = masa lalu yang tenang, model tidak siap krisis Rusia. Fed harus menalangi. Kepintaran ≠ kebijaksanaan; Nobel ≠ kebal. Robust > optimal, selalu.",
      },
      reference: "Analogi: tanya 100 dokter (resampling) vs 1 dokter (MV tunggal) \u2014 konsensus = aman.",
    },
    {
      id: "minicase-147",
      eyebrow: "Langkah 7 · Mini-case",
      title: "147% satu saham",
      prose: [
        "Quant fund: MV murni → 147% satu saham (E(R) tertinggi hanya 0,3%!). Estimasi meleset → hancur 1998.",
        "(a) Yang salah: error maximization \u2014 0,3% = noise; optimisasi memperkuat noise jadi 147% leverage. Matematika benar, input sampah. (b) BL mencegah: mulai dari equilibrium (masuk akal) + views di-shrink by confidence → tidak ada bobot 147% dari view lemah. (c) Aturan praktis: constraints + sensitivitas + round 5% + resampling. Optimisasi = alat berpikir, bukan mesin jawaban.",
        "(d) Dengan constraint 60%: kerugian jauh lebih kecil \u2014 60% vs 147%! Constraint = asuransi. (e) 1/N lebih baik jika input buruk (noise > sinyal!) atau tidak yakin \u2014 default = 1/N atau BL; buktikan dulu sebelum canggih.",
      ],
      tasks: [],
      reference: "Indonesia: pasar terkonsentrasi (BBCA, BBRI dominan) + illiquid → constraint likuiditas dulu, optimisasi kemudian.",
    },
    {
      id: "kendala-praktis",
      eyebrow: "Langkah 8 · Kendala praktis",
      title: "Turnover, cardinality, pajak: optimisasi dunia nyata",
      prose: [
        "Optimisasi textbook mengasumsikan kamu mulai dari nol setiap kali. Dunia nyata tidak: kamu SUDAH memegang portofolio, dan setiap perubahan membayar biaya. Karena itu optimisasi praktis menambahkan penalti turnover ke fungsi tujuan: maksimalkan Sharpe − λ × turnover, dengan turnover = Σ|w_i − w_{i,0}| dan λ = biaya riil per 100% turnover (mis. 0,5%: fee + spread + pajak). Efeknya: optimizer memilih portofolio yang bagus DAN tidak jauh dari posisi kini — stabilitas dihargai secara eksplisit.",
        "Contoh angka: dana Rp10M. MV murni: Sharpe 0,72 dengan turnover 80% → drag = 80% × 0,5% = 0,40% → net 0,716. Dengan penalti λ, optimizer menemukan titik di “dataran” optimum: Sharpe 0,719 (hanya 0,001 lebih rendah!) dengan turnover 25% → drag 0,125% → net 0,7178. Portofolio yang “kurang optimal” menang setelah biaya — karena di dekat optimum, Sharpe itu datar tetapi turnover bervariasi liar. Inilah robust optimization versi praktis: optimalkan yang BISA dieksekusi, bukan yang indah di spreadsheet.",
        "Kendala kedua: cardinality — “maksimal 20 saham”. Manajer nyata tidak bisa memantau 200 posisi 0,5%. Ini membuat problem integer (kombinatorial, mahal dihitung). Jalan praktis: optimisasi kontinu dulu, ambil 20 bobot terbesar, normalisasi ulang — lalu UKUR gap-nya: berapa Sharpe hilang akibat pemotongan? Jika gap < 0,03, terima; jika besar, coba ambang berbeda. Kejujuran = melaporkan gap, bukan menyembunyikannya.",
        "Kendala ketiga: pajak. Menjual pemenang memicu pajak capital gain — di akun kena pajak, λ harus mencakup tarif pajak efektif atas gain yang direalisasi. Aturan keputusan: (1) selalu optimisasi NET of costs — Sharpe gross adalah fiksi; (2) turnover constraint eksplisit (mis. maks 30%/kuartal) lebih mudah diaudit daripada penalti λ yang abstrak; (3) cardinality via top-N + ukur gap; (4) di akun kena pajak, pertimbangkan menunda penjualan pemenang ke tahun pajak berikutnya bila turnover constraint masih longgar.",
      ],
      formula: String.raw`\max_w \left( \frac{w^T\mu - r_f}{\sqrt{w^T\Sigma w}} - \lambda \sum_i |w_i - w_{i,0}| \right)`,
      formulaNote: "λ = penalti per unit turnover (mis. 0,005 = 0,5% per 100% turnover: fee + spread + pajak); w_{i,0} = bobot SAAT INI (bukan nol!); Σ|w_i − w_{i,0}| = turnover. Optimisasi memilih portofolio yang bagus DAN dekat posisi kini. Tanpa suku penalti ini, optimizer “lupa” bahwa kamu sudah memegang portofolio.",
      tasks: [],
      note: {
        title: "💡 Intuisi: optimisasi adalah penguat keyakinan — termasuk keyakinan palsu",
        body: "Optimizer mengambil estimasimu yang paling tidak pasti, lalu bertaruh paling besar di sana — itulah error maximization. Tiga heuristik praktisi. Pertama: jika bobot optimal terlihat “terlalu cerdas” (17,3% di sini, 4,7% di sana), ia salah — presisi dua desimal dari input ±2% adalah presisi palsu; bulatkan ke 5% dan lihat apakah ceritanya masih masuk akal. Kedua: uji ±1% — geser semua expected return ±1%; jika bobot jungkir balik (100% → 0%), portofoliomu berdiri di atas pasir, bukan beton; tolak. Ketiga: benchmark 1/N bukan penghinaan, melainkan prior yang jujur — jika optimisasi canggihmu tidak mengalahkan 1/N secara out-of-sample (DeMiguel), kamu tidak punya edge, hanya kompleksitas. Intuisi Michaud resampling: jangan tanya “apa yang optimal untuk tebakan terbaikku?”, tanyakan “apa yang masuk akal di 1.000 tebakan yang masuk akal?” — rata-rata dari 1.000 portofolio yang rendah hati mengalahkan satu portofolio yang arogan.",
      },
      reference: "Optimisasi melayani keputusan — bukan menggantikannya. Net of costs, atau jangan sebut optimal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Tujuh pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Mean-variance: max Sharpe + constraints wajib (long-only, maks bobot, turnover).",
        "Error maximization: optimisasi memperkuat error input \u2014 0,3% noise → 147% leverage.",
        "Black-Litterman: equilibrium + views × confidence → posterior stabil, bobot masuk akal.",
        "Robust: resampling, shrinkage, risk parity; 1/N sering menang saat input buruk (DeMiguel).",
        "Aturan: sensitivitas selalu, round 5%, diversifikasi model. Optimisasi melayani, bukan memerintah.",
      ],
      next: { label: "D3 \u2014 Regresi Faktor", href: "/v2/learn/pm-d3-regresi-faktor" },
      quiz: [
        {
          q: "MV murni memberi 147% satu saham. Diagnosis?",
          options: [
            { text: "Ikuti \u2014 matematika benar", why: "Salah: matematika benar, input sampah \u2014 dan optimisasi memperkuat sampah." },
            { text: "Error maximization \u2014 tambah constraints", why: "Tepat: optimisasi memperkuat error input. Constraints + BL + resampling = rem.", correct: true },
            { text: "Leverage lagi", why: "Salah: menambah leverage pada portofolio rapuh = mempercepat kehancuran." },
            { text: "Ganti data", why: "Salah: masalahnya bukan data spesifik \u2014 melainkan tidak adanya rem atas ketidakpastian input." },
          ],
        },
        {
          q: "Intuisi Black-Litterman?",
          options: [
            { text: "Ikuti analis 100%", why: "Salah: itu MV murni dengan views sebagai input \u2014 rapuh." },
            { text: "Musyawarah: equilibrium pasar + views by confidence", why: "Tepat: posterior = antara pasar dan views, proporsional keyakinan. Bobot masuk akal.", correct: true },
            { text: "Ikuti pasar 100%", why: "Salah: itu mengabaikan views analis sepenuhnya \u2014 bukan BL." },
            { text: "Acak", why: "Salah: BL justru sistematis \u2014 menggabung dua sumber informasi secara Bayesian." },
          ],
        },
        {
          q: "CONF=0 dalam BL artinya?",
          options: [
            { text: "Ikuti analis", why: "Salah: itu CONF=1 \u2014 keyakinan penuh pada views." },
            { text: "Ikuti equilibrium pasar", why: "Tepat: confidence nol → views diabaikan, posterior = prior pasar.", correct: true },
            { text: "Error", why: "Salah: CONF=0 valid \u2014 artinya \u2018saya tidak punya pandangan\u2019." },
            { text: "Acak", why: "Salah: hasilnya deterministik = equilibrium pasar." },
          ],
        },
        {
          q: "Resampling (Michaud) mengatasi?",
          options: [
            { text: "Biaya transaksi", why: "Salah: biaya diatasi turnover constraint/penalty, bukan resampling." },
            { text: "Ketidakpastian input (rata-ratakan banyak optimisasi)", why: "Tepat: 1.000 simulasi input → bobot rata-rata yang robust. Kerendahan hati kuantitatif.", correct: true },
            { text: "Pajak", why: "Salah: pajak = constraint/aturan terpisah, bukan resampling." },
            { text: "Likuiditas", why: "Salah: likuiditas = constraint bobot/volume, bukan resampling." },
          ],
        },
        {
          q: "MV murni → 147% satu saham (beda E(R) 0,3%). Solusi TEPAT?",
          options: [
            { text: "Biarkan \u2014 matematika benar", why: "Salah: 0,3% = noise. Matematika benar di atas input sampah = bencana." },
            { text: "Constraint + BL + sensitivitas \u2014 error maximization!", why: "Tepat: shrink, constrain, BL, uji sensitivitas. Robust > optimal.", correct: true },
            { text: "Tambah leverage", why: "Salah: leverage memperbesar kerapuhan, bukan mengobati." },
            { text: "Ganti model", why: "Salah: model apapun tanpa rem kena error maximization yang sama." },
          ],
        },
        {
          q: "MV: Sharpe 0,72, turnover 80%. Alternatif: Sharpe 0,719, turnover 25%. Biaya 0,5%/100% turnover. Mana menang net?",
          options: [
            { text: "MV murni (net 0,716)", why: "Salah: 0,72 − 80%×0,5% = 0,72 − 0,004 = 0,716. Kalah dari alternatif setelah biaya." },
            { text: "Alternatif (net ≈0,7178)", why: "Tepat: 0,719 − 25%×0,5% = 0,719 − 0,00125 = 0,7178 > 0,716. Di dataran optimum, Sharpe hampir sama tetapi turnover jauh beda.", correct: true },
            { text: "Seri — bedanya noise", why: "Salah: prinsipnya yang penting — selalu bandingkan NET of costs, dan di dataran optimum pilih turnover yang rendah." },
            { text: "Tidak bisa dibandingkan", why: "Salah: bisa — kurangi drag biaya dari Sharpe masing-masing, lalu bandingkan net." },
          ],
        },
        {
          q: "Reksa dana dibatasi maksimal 20 saham (cardinality). Pendekatan praktis yang JUJUR?",
          options: [
            { text: "Optimisasi kontinu → ambil 20 bobot terbesar → normalisasi ulang → ukur & laporkan gap Sharpe", why: "Tepat: heuristik top-N + re-normalisasi, dengan gap yang diukur dan dilaporkan — bukan disembunyikan.", correct: true },
            { text: "Abaikan batasan — 200 saham @0,5% tidak masalah", why: "Salah: manajer tidak bisa memantau 200 posisi; biaya monitoring dan transaksi membunuh return." },
            { text: "Pilih 20 saham acak lalu optimisasi", why: "Salah: acak membuang informasi — top-N dari solusi kontinu jauh lebih baik." },
            { text: "Paksa tepat 20 saham @5% (equal weight)", why: "Salah: itu mengabaikan seluruh hasil optimisasi tanpa alasan yang jelas." },
          ],
        },
      ],
    },
  ],
};
