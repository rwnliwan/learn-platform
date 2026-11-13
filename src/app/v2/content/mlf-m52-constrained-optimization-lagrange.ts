import type { V2Lesson } from "../lib/types";

export const mlfM52: V2Lesson = {
  slug: "mlf-m52-constrained-optimization-lagrange",
  track: "Machine Learning Finance",
  module: "Optimization & portfolio construction",
  title: "MLF-M5.2 — Constrained Optimization: Lagrange & KKT",
  estMinutes: 65,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M5 adalah optimization & portfolio construction: dari gradient descent tanpa kendala (M5.1) ke dunia nyata — di mana portofolio tidak pernah bebas begitu saja. Lesson ini adalah jantung modul itu: constrained optimization. Kamu akan belajar mengubah kendala menjadi bagian dari masalah lewat Lagrange multiplier, membaca KKT, dan — yang paling penting — mengenali kapan masalah optimasi TIDAK punya solusi sama sekali.",
        "Tujuan lesson ini:",
        "• Menjelaskan mengapa kendala ada — dari unconstrained ke constrained — dan apa yang berubah saat kendala ditambahkan.",
        "• Menjelaskan kendala kesetaraan Σw = 1 dan Lagrange multiplier: rumus, intuisi «harga» kendala, dan hubungan λ = 2σ²_p untuk GMV.",
        "• Menghitung GMV 2 aset (BBCA + KLBF) dengan rumus tertutup dan memverifikasi KKT-nya angka demi angka.",
        "• Membaca KKT untuk ketidaksamaan w ≥ 0: complementary slackness dan active set — siapa yang mengikat, siapa yang bebas.",
        "• Membandingkan GMV 3 aset closed-form vs SLSQP — dan menyimpulkan kapan keduanya sepakat berarti masalahnya well-posed.",
        "• Memvalidasi Σ sebelum membaliknya: eigenvalue, condition number, determinan, dan Cholesky — Σ lesson ini sehat (cond 3,5), dan demo hampir-singular saat korelasi → 1.",
        "• Menghitung harga kendala realistis — cap bobot, kardinalitas, minimum holding, budget turnover — terhadap GMV bebas, dan mengenali kendala yang tidak mengikat.",
        "• Membuktikan max-Sharpe tak-terkendala adalah ill-posed: SLSQP berhenti di w = [−3154,7; −3786,1; 6941,9] dengan Sharpe 0,6697 — itu artefak titik berhenti, BUKAN solusi; supremumnya 0,6718, didekati hanya bila leverage → tak hingga.",
        "• Menjelaskan mengapa long-only mengubah masalah menjadi well-posed — dengan corner solution 100% UNVR.",
        "• Mengenali kendala praktis lain: batas bobot, turnover, sector — dan jebakan kendala yang terlalu ketat.",
        "• Memahami cara kerja SLSQP secara singkat — bukan black box.",
        "• Menjalankan dua lab: Lagrange 2 aset (hitung tangan + cek numerik) dan SLSQP GMV vs closed-form dari data pin.",
        "Isi lesson: cerita manajer dana yang tidak boleh short → Lagrange multiplier → worked example GMV 2 aset → KKT dan active set → GMV 3 aset (closed-form vs SLSQP) → validasi numerik Σ → max-Sharpe yang meledak → long-only dan corner solution → kendala praktis → harga kendala realistis → SLSQP → 2 lab → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M5.2 (kanonis M5): BBCA.JK + KLBF.JK + UNVR.JK, simple return, 480 hari, 2024-11-04 sampai 2026-11-11 (window unduh 2024-11-01 sampai 2026-11-12; file pin data/m4_prices.csv), rf = 0,05. Return tahunan: BBCA −0,2445, KLBF −0,2570, UNVR 0,0796. Volatilitas tahunan: BBCA 0,3449, KLBF 0,4251, UNVR 0,5014. Korelasi: BBCA-KLBF 0,3488, BBCA-UNVR 0,2774, KLBF-UNVR 0,2897. Konvensi ini SAMA dengan M5.1 — bedanya dengan M4.4: M4.4 memakai LOG return untuk VaR, M5 memakai SIMPLE return untuk mean/variance; keduanya dilabeli di mana pun muncul bersamaan.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Manajer dana yang tidak boleh short — mengapa kendala ada",
      prose: [
        "Bayangkan kamu mengelola dana pensiun kecil. Mandatnya tertulis jelas: tidak boleh short (w ≥ 0), seluruh dana harus terinvestasi (Σw = 1), dan tidak ada satu saham pun boleh melebihi 40 persen portofolio. Kamu sudah tahu dari M5.1 cara meminimalkan varians tanpa kendala — gradient descent menuruni bukit sampai ke lembah. Sekarang bukit itu dipagari: sebagian lembah berada di luar pagar, dan «solusi terbaik» mungkin justru menempel di pagar itu.",
        "Di dunia nyata, kendala bukan hiasan. Regulator melarang short untuk dana pensiun; klien membatasi bobot satu saham karena takut konsentrasi; meja trading membatasi turnover karena biaya; komite investasi membatasi sektor karena mandat. Setiap kendala adalah janji yang harus ditepati — dan setiap janji mengubah bentuk masalahnya.",
        "Nilai: di data kita [notebook], portofolio GMV tak-terkendala adalah [0,5518; 0,2698; 0,1785] (closed-form) — semua bobot positif, jadi kendala w ≥ 0 TIDAK mengikat di sini. Tapi bayangkan bila GMV tak-terkendala meminta short pada satu aset — katakanlah w_KLBF = −0,20 — maka manajer dana pensiun itu TIDAK BOLEH memakainya; ia harus mencari yang terbaik di dalam pagar, dan jawabannya akan berbeda.",
        "Baik atau buruk: kendala bagus karena ia menerjemahkan aturan dunia nyata ke dalam matematika — solusi yang melanggar mandat bukan solusi, betapa pun optimalnya di atas kertas. Buruk bila kendala ditulis tanpa dipahami: tiap kendala yang ditambahkan menyusutkan himpunan feasible — dan bila terlalu ketat, himpunan itu bisa menjadi kosong atau hanya menyisakan portofolio yang buruk (langkah 10 dan checkpoint).",
        "Mitigasi: sebelum menambahkan kendala, tanyakan DUA hal — (1) apakah kendala ini benar-benar mengikat di optimum (bila tidak, ia gratis; bila ya, ia mengubah jawaban), dan (2) berapa «harga»-nya dalam tujuan (langkah 3: itulah yang diukur Lagrange multiplier). Kendala yang tidak mengikat tidak perlu diperdebatkan; kendala yang mengikat harus diperjuangkan dengan angka.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: kendala hanya «membatasi» solusi — jadi ia selalu merugikan",
        type: "pitfall",
        body: "Yang benar: kendala memang tidak pernah MEMPERBAIKI nilai tujuan (feasible set-nya lebih kecil), tapi ia bisa MENYELAMATKAN masalahnya — max-Sharpe tak-terkendala di lesson ini tidak punya solusi berhingga sama sekali (langkah 8); kendala long-only-lah yang membuatnya well-posed. Kendala yang tepat bukan beban — ia adalah bagian dari definisi masalah.",
      },
    },
    {
      id: "lagrange",
      eyebrow: "Langkah 3 · Lagrange multiplier",
      title: "Kendala kesetaraan Σw = 1 dan multiplier λ — «harga» sebuah kendala",
      prose: [
        "Masalah GMV (global minimum variance) adalah: minimkan varians portofolio w'Σw, dengan kendala seluruh dana terinvestasi, 1'w = 1. Tanpa kendala, jawabannya trivial dan tidak berguna: w = 0 (varians nol — dengan memegang tunai semua). Kendala Σw = 1 itulah yang membuat masalahnya menarik: kamu WAJIB memegang sesuatu, dan pertanyaannya adalah kombinasi apa yang paling tenang.",
        "Joseph-Louis Lagrange punya ide yang elegan: jangan perlakukan kendala sebagai tembok — masukkan ia ke dalam fungsi tujuan dengan «harga» λ. Bentuk Lagrangian: L(w, λ) = w'Σw − λ(1'w − 1). Bila kendala dilanggar (1'w ≠ 1), suku λ menghukum atau memberi hadiah sebanding dengan pelanggarannya; di optimum, hukumannya tepat menyeimbangkan keinginan meminimalkan varians.",
        "Syarat orde pertama (FOC): turunan L terhadap w harus nol — 2Σw = λ1. Baca kalimat itu dengan pelan: di optimum, gradien varians (2Σw) harus SEJAJAR dengan vektor satu (1) — artinya, marginal variance per aset harus SAMA di semua aset, dan nilai samanya adalah λ. Bila satu aset punya marginal variance lebih rendah dari yang lain, kamu masih bisa menurunkan varians dengan menggeser bobot ke aset itu — jadi kamu belum optimum.",
        "Nilai: kalikan FOC dari kiri dengan w' — 2w'Σw = λ(w'1) = λ, karena w'1 = 1. Jadi λ = 2σ²_p — multiplier-nya adalah DUA KALI varians portofolio optimum [notebook]. Untuk GMV 2 aset di langkah 4, σ²_p = 0,09566 (tak-dibulatkan) sehingga λ = 2 × 0,09566 ≈ 0,1913. Itulah «harga» kendala Σw = 1 di data ini: melonggarkan kendala sedikit (mengizinkan total bobot 1,01 alih-alih 1,00) akan menaikkan varians sekitar λ × 0,01 — sekitar 0,0019.",
        "Baik atau buruk: multiplier bagus karena ia memberi HARGA pada kendala — bukan sekadar «solusi ini optimal», melainkan «kendala ini berharga sekian». Buruk bila λ dibaca sebagai angka mistis: λ bukan parameter yang kamu pilih — ia muncul dari masalahnya, dan tandanya penting (di sini positif karena kendala «memaksa» varians naik dari nol).",
        "Mitigasi: selalu laporkan λ berdampingan dengan w* — bila seseorang bertanya «berapa biaya mandat Σw = 1?», jawabannya ada di λ, bukan di w*. Dan bila λ = 0, kendalanya tidak mengikat: optimum tak-terkendala sudah memenuhi kendala dengan sendirinya.",
      ],
      formula: String.raw`\mathcal{L}(w, \lambda) = w'\Sigma w - \lambda(\mathbf{1}'w - 1) \quad \Rightarrow \quad 2\Sigma w = \lambda \mathbf{1}, \quad \lambda = 2\sigma_p^2`,
      formulaNote: "Lagrangian GMV: varians w'Σw dikurangi λ kali pelanggaran kendala (1'w − 1). FOC: 2Σw = λ1 — marginal variance sama di semua aset. Mengalikan dengan w' memberi λ = 2σ²_p.",
      tasks: [],
      note: {
        title: "Miskonsepsi: λ adalah parameter tuning seperti learning rate",
        type: "pitfall",
        body: "Yang benar: λ BUKAN dipilih — ia DISELESAIKAN bersama w* dari sistem FOC + kendala. Learning rate kamu yang memilih; λ masalah yang menentukan. Bila kamu «menyetel» λ, kamu sedang menyelesaikan masalah yang berbeda.",
      },
    },
    {
      id: "gmv2",
      eyebrow: "Langkah 4 · Worked example 2 aset",
      title: "GMV 2 aset (BBCA + KLBF): rumus tertutup dan verifikasi KKT",
      prose: [
        "Sekarang hitung dengan tangan. Dua aset: BBCA dan KLBF. Kovarians tahunan [notebook]: σ²_BBCA = 0,1190, σ²_KLBF = 0,1807, σ_BBCA,KLBF = 0,0511. Masalahnya: minimkan w'Σw dengan w_BBCA + w_KLBF = 1. Karena hanya ada satu derajat kebebasan (w_KLBF = 1 − w_BBCA), varians menjadi fungsi satu variabel — dan rumus tertutupnya terkenal:",
        "Masukkan angkanya: w_BBCA = (0,1807 − 0,0511) / (0,1190 + 0,1807 − 2 × 0,0511) = 0,1296 / 0,1974 = 0,6565. Jadi w_KLBF = 0,3435 [notebook]. Perhatikan intuisi rumusnya: pembilangnya adalah «seberapa besar varians aset 2 melebihi kovariansnya» — aset yang lebih tenang dan kurang berkorelasi mendapat bobot lebih besar. BBCA lebih tenang (0,1190 vs 0,1807) dan korelasinya sedang (0,3488), jadi ia mendapat hampir dua pertiga.",
        "Nilai: portofolio GMV 2 aset ini [turunan/derived] — return −0,2488, volatilitas 0,3093, Sharpe −0,9661. Volatilitas 0,3093 LEBIH RENDAH dari volatilitas aset terendah sekalipun (BBCA 0,3449) — itulah diversifikasi bekerja: kombinasi dua aset yang berkorelasi 0,3488 lebih tenang daripada tiap aset sendirian. Tapi return-nya −0,2488: tenang saja tidak cukup bila kedua asetnya sama-sama jatuh — GMV meminimalkan varians, bukan memaksimalkan return.",
        "Verifikasi KKT — langkah yang membedakan «percaya rumus» dari «memeriksa rumus». Hitung 2Σw pada w* = [0,6565; 0,3435]: dengan angka tak-dibulatkan, (Σw*)_BBCA = 0,09566 dan (Σw*)_KLBF = 0,09566 — KEDUA komponen 2Σw* sama, 0,19132 ≈ 0,1913, persis seperti yang dituntut FOC 2Σw = λ1. Dan λ = 2σ²_p = 2 × 0,09566 ≈ 0,1913 — konsisten. (Jangan kalikan angka yang sudah dibulatkan: 2 × 0,0957 = 0,1914 — selisih 0,0001 itu murni artefak pembulatan, bukan kesalahan rumus.) Bila kedua komponen TIDAK sama, w* itu bukan optimum — sesederhana itu pemeriksaannya.",
        "Baik atau buruk: rumus tertutup bagus karena ia instan, eksak, dan bisa diverifikasi dengan satu perkalian matriks. Buruk bila dipakai buta: rumus ini hanya berlaku untuk DUA aset dan SATU kendala kesetaraan — tambah satu aset atau satu kendala ketidaksamaan, dan kamu butuh mesin yang lebih umum (langkah 5, 6, dan 12).",
        "Mitigasi: setiap kali kamu mendapat «solusi optimal» dari mana pun — rumus, solver, atau AI — verifikasi FOC-nya: hitung 2Σw dan periksa apakah semua komponennya sama. Verifikasi satu baris ini menangkap lebih banyak kesalahan daripada seribu baris penjelasan.",
      ],
      formula: String.raw`w_1^* = \frac{\sigma_2^2 - \sigma_{12}}{\sigma_1^2 + \sigma_2^2 - 2\sigma_{12}} = \frac{0{,}1807 - 0{,}0511}{0{,}1190 + 0{,}1807 - 2 \times 0{,}0511} = 0{,}6565`,
      formulaNote: "GMV 2 aset, rumus tertutup [notebook]: w_BBCA = 0,6565, w_KLBF = 0,3435. Verifikasi KKT: 2Σw* = [0,1913; 0,1913] — kedua komponen sama, λ = 2σ²_p = 2 × 0,09566 ≈ 0,1913 (σ²_p tak-dibulatkan).",
      tasks: [],
    },
    {
      id: "kkt",
      eyebrow: "Langkah 5 · KKT untuk ketidaksamaan",
      title: "KKT untuk w ≥ 0: complementary slackness dan active set",
      prose: [
        "Kendala kesetaraan Σw = 1 sudah kamu kuasai lewat Lagrange. Sekarang tambah kendala ketidaksamaan: w ≥ 0 (tidak boleh short). Ketidaksamaan lebih licin daripada kesetaraan — ia bisa AKTIF (w_i = 0, kendala mengikat) atau TIDAK AKTIF (w_i > 0, kendala longgar). Karush-Kuhn-Tucker (KKT) adalah perluasan Lagrange untuk kasus ini: tiap kendala ketidaksamaan mendapat multiplier-nya sendiri, μ_i, dengan empat syarat.",
        "Empat syarat KKT untuk GMV long-only (minimkan w'Σw, kendala 1'w = 1, w ≥ 0): (1) stationarity — 2Σw − λ1 − μ = 0, alias 2Σw = λ1 + μ; (2) primal feasibility — 1'w = 1 dan w ≥ 0; (3) dual feasibility — μ ≥ 0; (4) complementary slackness — μ_i · w_i = 0 untuk tiap aset i. Syarat keempat adalah kuncinya: untuk tiap aset, PALING TIDAK SATU dari μ_i dan w_i harus nol. Bila aset dipegang (w_i > 0), multiplier-nya nol (μ_i = 0) — kendala tidak mengikat, dan FOC kembali ke bentuk Lagrange biasa 2(Σw)_i = λ. Bila aset TIDAK dipegang (w_i = 0), multiplier-nya boleh positif (μ_i > 0) — dan FOC menjadi 2(Σw)_i = λ + μ_i > λ: marginal variance aset itu LEBIH TINGGI dari λ, itulah sebabnya kamu tidak memegangnya.",
        "Nilai: GMV long-only di data ini [notebook] adalah [0,5523; 0,2699; 0,1777] — SAMA PERSIS dengan GMV tak-terkendala SLSQP. Ketiga bobot positif, jadi ketiga kendala w ≥ 0 TIDAK AKTIF: active set-nya KOSONG, semua μ_i = 0, dan KKT runtuh kembali ke Lagrange biasa. Inilah cara membaca «kendala tidak mengikat» dalam bahasa KKT: active set kosong, multiplier nol, solusi tidak berubah.",
        "Bandingkan dengan max-Sharpe long-only (langkah 9): [0; 0; 1] — active set-nya {BBCA, KLBF}, karena kedua bobot itu tepat di batas nol. Di sana complementary slackness bekerja ke arah lain: w_BBCA = w_KLBF = 0 mengizinkan μ_BBCA, μ_KLBF > 0 — «denda» karena kedua aset itu tidak layak dipegang — sementara μ_UNVR = 0 karena UNVR dipegang penuh.",
        "Baik atau buruk: KKT bagus karena ia memberi DAFTAR PERIKSA universal — empat syarat yang bisa dicek untuk solusi apa pun dari masalah konveks (dan GMV adalah konveks: untuk masalah konveks, KKT adalah syarat CUKUP — bila terpenuhi, solusi itu PASTI optimum global). Buruk bila diterapkan buta pada masalah non-konveks: max-Sharpe adalah rasio (non-konveks) — KKT di sana tidak menjamin apa-apa, dan «solusi» SLSQP di langkah 8 adalah buktinya.",
        "Mitigasi: sebelum percaya pada solusi solver, tanyakan: (1) apakah masalahnya konveks? (2) apakah KKT terpenuhi — terutama complementary slackness? Bila masalahnya konveks dan KKT lolos, kamu selesai. Bila tidak konveks, KKT hanyalah cerita — dan kamu butuh bukti lain (langkah 8).",
      ],
      formula: String.raw`2\Sigma w = \lambda \mathbf{1} + \mu, \quad \mu \geq 0, \quad \mu_i \cdot w_i = 0 \;\; \forall i`,
      formulaNote: "KKT untuk GMV long-only: stationarity 2Σw = λ1 + μ, dual feasibility μ ≥ 0, complementary slackness μ_i·w_i = 0. Aset yang dipegang (w_i > 0) → μ_i = 0; aset di batas (w_i = 0) → μ_i boleh > 0.",
      tasks: [],
      note: {
        title: "Miskonsepsi: «KKT terpenuhi» berarti «optimum» — selalu",
        type: "pitfall",
        body: "Yang benar: KKT adalah syarat cukup HANYA untuk masalah konveks. GMV (kuadratik konveks + kendala linear) lolos — KKT di sana adalah bukti optimum global. Max-Sharpe (rasio, non-konveks) tidak — «solusi» SLSQP [−3154,7; −3786,1; 6941,9] di langkah 8 bisa saja lolos pemeriksaan numerik longgar sambil tetap bukan solusi apa-apa.",
      },
    },
    {
      id: "gmv3",
      eyebrow: "Langkah 6 · GMV 3 aset",
      title: "GMV 3 aset: closed-form vs SLSQP — ketika dua jalan sepakat",
      prose: [
        "Tambah UNVR. Sekarang tidak ada lagi rumus satu baris seperti langkah 4 — tapi Lagrange masih memberi rumus tertutup untuk tiga aset (atau berapa pun): w* = Σ⁻¹1 / (1'Σ⁻¹1). Invers matriks kovarians dikali vektor satu, lalu dinormalisasi supaya jumlahnya 1. Inilah «rumus» yang sama dengan langkah 3, ditulis dalam bahasa matriks.",
        "Nilai: closed-form [notebook] memberi [0,5518; 0,2698; 0,1785]. SLSQP (solver numerik, langkah 12) memberi [0,5523; 0,2699; 0,1777]. Selisih maksimumnya 0,0007 dari bobot tak-bulat (0,0008 bila dihitung dari bobot yang dibulatkan ke 4 desimal — lihat lab 2) — ≈0,15% dari bobot terbesar (0,55), atau 0,08% dari total dana. Closed-form memberi return −0,1900, SLSQP −0,1903 (selisih 0,0003); volatilitas keduanya 0,2966 [notebook]. Ketika rumus analitik dan solver numerik yang bekerja dengan cara sama sekali berbeda tiba di tempat yang sama (sampai 4 desimal), itu adalah bukti kuat bahwa masalahnya well-posed: solusinya ada, tunggal, dan stabil.",
        "Gambar di bawah adalah frontier long-only [notebook] — 8 titik dari GMV (return −0,1903, vol 0,2966) sampai 100% UNVR (return 0,0796, vol 0,5014). Perhatikan bentuknya: GMV ada di ujung kiri bawah — titik paling tenang di seluruh frontier. Setiap titik di atasnya menukar volatilitas yang lebih tinggi dengan return yang lebih tinggi. Frontier ini adalah HIMPUNAN solusi dari MASALAH YANG SAMA (min-variance) dengan target return yang berbeda-beda — tiap titiknya adalah satu masalah Lagrange dengan satu kendala tambahan (w'μ = target).",
        "Baik atau buruk: kesepakatan closed-form vs SLSQP bagus sebagai ALAT DIAGNOSIS — bila keduanya berbeda jauh, salah satu (atau masalahnya) bermasalah: mungkin Σ hampir singular, mungkin solver berhenti prematur, mungkin masalahnya ill-posed seperti langkah 8. Buruk bila kesepakatan dibaca sebagai «solver selalu benar»: di sini keduanya benar karena masalahnya baik; di langkah 8, SLSQP «berhasil» (success = True) sambil mengembalikan sampah.",
        "Mitigasi: untuk setiap optimasi portofolio, hitung JUGA closed-form-nya bila ada (GMV selalu punya) dan bandingkan. Selisih di atas ~0,001 adalah bendera merah — selidiki sebelum memakai bobotnya.",
      ],
      formula: String.raw`w^* = \frac{\Sigma^{-1}\mathbf{1}}{\mathbf{1}'\Sigma^{-1}\mathbf{1}} = [0{,}5518;\; 0{,}2698;\; 0{,}1785] \;\; \text{vs SLSQP} \;\; [0{,}5523;\; 0{,}2699;\; 0{,}1777]`,
      formulaNote: "GMV 3 aset [notebook]: closed-form vs SLSQP — selisih maks 0,0007 (0,0008 dari bobot 4 desimal). Closed-form: return −0,1900; SLSQP: return −0,1903; vol 0,2966.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Frontier long-only: dari GMV return -0,1903 vol 0,2966 sampai 100 persen UNVR return 0,0796 vol 0,5014">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Frontier long-only — GMV di ujung kiri bawah</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="86.5" y1="206" x2="86.5" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="86.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="172.7" y1="206" x2="172.7" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="172.7" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,35</text>
<line x1="259.0" y1="206" x2="259.0" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="345.2" y1="206" x2="345.2" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="345.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<line x1="431.5" y1="206" x2="431.5" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="431.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="52" y1="206.0" x2="48" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="52" y1="147.3" x2="48" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,10</text>
<line x1="52" y1="88.7" x2="48" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,00</text>
<line x1="52" y1="30.0" x2="48" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<polyline points="80.6,200.3 90.1,177.7 117.4,155.1 160.3,132.4 215.7,109.8 280.6,87.2 353.5,64.6 433.9,42.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="80.6" cy="200.3" r="5" fill="var(--c4)"/>
<text x="92" y="196" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">GMV (−0,1903; 0,2966)</text>
<circle cx="433.9" cy="42.0" r="5" fill="var(--c2)"/>
<text x="300" y="34" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">100% UNVR (0,0796; 0,5014)</text>
<text x="259" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">volatilitas (tahunan)</text>
<text x="14" y="118" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118)">return (tahunan)</text>
</svg>`,
        alt: "Frontier long-only: dari GMV return -0,1903 vol 0,2966 sampai 100 persen UNVR return 0,0796 vol 0,5014.",
        caption: "Cara membaca: tiap titik = portofolio min-variance long-only untuk satu target return [notebook]; sumbu-x volatilitas, sumbu-y return. Interpretasi: GMV (titik paling kiri bawah) adalah portofolio paling tenang; ujung kanan atas adalah 100% UNVR — return tertinggi yang bisa dicapai tanpa short.",
      },
      tasks: [],
    },
    {
      id: "validasi-numerik",
      eyebrow: "Langkah 7 · Validasi numerik",
      title: "Validasi numerik: periksa Σ sebelum membaliknya",
      prose: [
        "Rumus tertutup GMV (langkah 6) punya satu syarat tersembunyi: Σ⁻¹ harus ADA — dan ada dengan AMAN. Matriks kovarians secara teori selalu positive semi-definite (PSD): x'Σx ≥ 0 untuk semua x. Tapi «secara teori» dan «di angka» adalah dua hal berbeda: Σ yang diestimasi dari 480 hari bisa hampir singular — satu eigenvalue mendekati nol — dan inversnya meledak. Sebelum membalik Σ, periksa DULU kesehatannya.",
        "Nilai: eigenvalue Σ tahunan [notebook] adalah [0,088937; 0,151142; 0,310986] — ketiganya POSITIF, jadi Σ lesson ini definit positif (lebih kuat dari PSD: x'Σx > 0 untuk semua x ≠ 0). Condition number-nya κ = λmaks/λmin = 0,3110/0,0889 = 3,5 — kecil; inversnya aman. Determinannya det(Σ) = 0,004180 — jauh dari nol. Dan dekomposisi Cholesky Σ = LL' BERHASIL — tes PSD yang paling praktis di kode (bila Cholesky gagal, Σ-mu tidak PSD). Kesimpulan: Σ lesson ini SEHAT — GMV closed-form di langkah 6 berdiri di atas fondasi yang kokoh, bukan di atas pasir.",
        "Gambar di bawah adalah ketiga eigenvalue itu: semuanya jauh di atas garis ambang waspada λ = 0,05 — tidak ada yang mendekati nol. Bandingkan dengan demo hampir-singular [ilustrasi]: dua aset dengan vol 0,3449 dan 0,4251 (vol BBCA dan KLBF). Saat korelasinya 0,90, condition number-nya 19,9; saat 0,99, cond-nya 207,9 dan eigenvalue terkecilnya menyusut ke 0,001434; saat 0,999, cond-nya 2.087,8 dengan eigenvalue terkecil 0,000143; saat korelasi tepat 1,0, Σ menjadi SINGULAR — determinan 0, satu eigenvalue tepat 0, invers TIDAK ADA. Polanya jelas: saat korelasi → 1, satu eigenvalue → 0, dan invers meledak — bobot GMV menjadi tidak stabil.",
        "Sensitivitas invers: seberapa tidak stabil? Ubah SATU entri Σ [notebook] — Σ[0,1] (kovarians BBCA-KLBF) ditambah 0,001 — dan GMV bergeser dengan jarak L1 0,0042. Di Σ yang sehat ini, pergeserannya kecil (0,42% dari total dana) — itulah arti cond 3,5. Di Σ yang hampir singular (cond 2.087,8), gangguan yang sama bisa menggeser bobot berkali-kali lipat lebih besar. Condition number adalah PENGALI kesalahan: kesalahan relatif di input dikali cond ≈ kesalahan relatif di invers.",
        "Baik atau buruk: validasi numerik bagus karena ia MURAH — empat baris kode (eigenvalue, cond, det, Cholesky) sebelum optimasi — dan ia menangkap kelas kegagalan yang tidak terlihat dari angka bobotnya. Buruk bila dilewati: Σ yang hampir singular tidak memberi peringatan — SLSQP tetap mengembalikan bobot, closed-form tetap menghitung, dan keduanya tampak normal sampai kamu membandingkan dua estimasi yang sedikit berbeda dan bobotnya melompat.",
        "Mitigasi: checklist sebelum membalik Σ — (1) semua eigenvalue > 0: bila ada yang ≤ 0, Σ-mu bukan definit positif (cek bug estimasi atau data duplikat); (2) condition number: di bawah 100 aman, 100–1000 waspada, di atas 1000 jangan percaya inversnya — pertimbangkan shrinkage (M5.5) atau buang aset yang hampir duplikat; (3) determinan ≠ 0: det yang mendekati nol adalah bau singularitas; (4) Cholesky berhasil: bila `np.linalg.cholesky` gagal, berhenti dan perbaiki Σ dulu. Empat cek ini adalah «sabuk pengaman» tiap optimasi — jalankan sebelum solver, bukan sesudah.",
      ],
      formula: String.raw`\kappa(\Sigma) = \frac{\lambda_{\max}}{\lambda_{\min}} = \frac{0{,}3110}{0{,}0889} = 3{,}5, \quad \det(\Sigma) = 0{,}004180, \quad \lambda = [0{,}0889;\; 0{,}1511;\; 0{,}3110]`,
      formulaNote: "Validasi Σ tahunan [notebook]: eigenvalue [0,088937; 0,151142; 0,310986] — semua > 0 (definit positif); condition number 3,5; det(Σ) = 0,004180; Cholesky berhasil. Demo [ilustrasi]: korelasi 0,99 → cond 207,9; korelasi 1,0 → singular (det 0).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Eigenvalue Sigma tahunan: 0,0889; 0,1511; 0,3110 — ketiganya di atas ambang waspada 0,05">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Eigenvalue Σ tahunan — ketiganya &gt; 0, Σ definit positif</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="180.3" x2="466" y2="180.3" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="174.0" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">ambang waspada λ = 0,05</text>
<line x1="52" y1="206.0" x2="48" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="52" y1="154.5" x2="48" y2="154.5" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="157.5" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="52" y1="103.1" x2="48" y2="103.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="106.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="52" y1="51.6" x2="48" y2="51.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="54.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<rect x="110" y="160.3" width="60" height="45.7" fill="var(--c1)"/>
<text x="140" y="156" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0889</text>
<text x="140" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">λ₁</text>
<rect x="210" y="128.3" width="60" height="77.7" fill="var(--c1)"/>
<text x="240" y="124" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1511</text>
<text x="240" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">λ₂</text>
<rect x="310" y="46.0" width="60" height="160.0" fill="var(--c1)"/>
<text x="340" y="42" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3110</text>
<text x="340" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">λ₃</text>
<text x="259" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">eigenvalue Σ tahunan (urut naik)</text>
</svg>`,
        alt: "Eigenvalue Sigma tahunan: 0,0889; 0,1511; 0,3110 — ketiganya di atas ambang waspada 0,05.",
        caption: "Cara membaca: tiga bar = tiga eigenvalue Σ tahunan [notebook], skala sumbu-y 0–0,3 (0,3110 → 160 px); garis putus-putus = ambang waspada λ = 0,05. Interpretasi: semua eigenvalue jauh di atas ambang — Σ definit positif, condition number 3,5, invers aman. Bila satu bar jatuh mendekati nol, cond meledak (demo korelasi 0,999 → cond 2.087,8) dan bobot GMV menjadi tidak stabil.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: «Σ dari data selalu bisa dibalik»",
        type: "pitfall",
        body: "Yang benar: Σ estimasi bisa singular atau hampir singular — dua aset yang hampir identik (korelasi 0,999) membuat satu eigenvalue ≈ 0,000143 dan cond ≈ 2.087,8 [ilustrasi]. Inversnya ada secara formal tapi tidak bisa dipercaya — bobot GMV-nya liar. Selalu cek eigenvalue sebelum percaya pada Σ⁻¹.",
      },
    },
    {
      id: "illposed",
      eyebrow: "Langkah 8 · Inti lesson: ill-posed",
      title: "Max-Sharpe tak-terkendala meledak — masalah yang tidak punya solusi",
      prose: [
        "Sekarang masalah yang menjadi inti lesson ini. Maksimalkan Sharpe ratio S(w) = (w'μ − rf) / √(w'Σw), dengan SATU-SATUNYA kendala Σw = 1 — shorting BOLEH, leverage TIDAK DIBATASI. Kedengarannya wajar: «cari portofolio dengan Sharpe tertinggi». Tapi masalah ini TIDAK PUNYA solusi berhingga — dan SLSQP akan «menjawab» juga, dengan jawaban yang salah.",
        "Kenapa tidak ada solusi? Perhatikan: Sharpe ratio TIDAK homogen dalam skala bobot bila rf ≠ 0 — mengalikan seluruh w dengan konstanta TIDAK mempertahankan Sharpe, karena rf-nya tetap: S([0; 0; 1]) = 0,0590, tapi S(2·[0; 0; 1]) = 0,1089. Yang homogen adalah versi excess return, (w'(μ − rf·1))/σ — tapi itu bukan Sharpe yang kita hitung. Kendala Σw = 1 hanya mematok skala, bukan leverage: kamu boleh short BBCA −3.154 dan KLBF −3.786, lalu long UNVR 6.941 — jumlahnya tetap 1. Portofolio seperti itu adalah taruhan zero-cost yang diperbesar: ambil arah zero-cost terbaik d (jumlahnya 0 — short dua aset, long satu aset), lalu campur dengan portofolio mana pun yang jumlahnya 1: w(λ) = [0; 0; 1] + λ·d. Makin besar λ, makin besar leverage — dan Sharpe-nya NAIK TERUS mendekati supremum 0,6718 dari bawah, tanpa pernah sampai: di leverage besar, suku rf menjadi kecil relatif terhadap return, sehingga Sharpe mendekati (d'μ)/√(d'Σd) = 0,32985/0,49101 = 0,6718.",
        "Nilai: arah zero-cost terbaik [notebook] adalah d = [−0,5406; −0,4594; 1,0] dengan Sharpe 0,6718 — itu SUPREMUM-nya, batas yang tidak pernah dicapai portofolio berhingga mana pun. Sepanjang ray w(λ) = [0; 0; 1] + λ·d, Sharpe-nya: λ = 0 → 0,0590 (100% UNVR); λ = 1 → 0,3818; λ = 2 → 0,4869; λ = 5 → 0,5845; λ = 10 → 0,6256; λ = 50 → 0,6621; λ = 100 → 0,6669; λ = 1000 → 0,6713 — merangkak mendekati 0,6718 dari bawah, selamanya [notebook]. SLSQP, dijalankan dari equal-weight, «berhenti» di w = [−3154,7; −3786,1; 6941,9] dengan Sharpe 0,6697 dan melaporkan success = True [notebook]. Itu BUKAN portofolio optimal — itu ARTEFAK titik berhenti: solver berhenti karena toleransinya tercapai, bukan karena ia menemukan optimum. Dari titik awal yang berbeda, ia berhenti di tempat yang berbeda pula: dari [0; 0; 1] ia berhenti di [−11003,8; −12512,6; 23517,4] (Sharpe 0,6703); dari [0,6; 0,3; 0,1] di [−3415,7; −3360,3; 6777,0] (Sharpe 0,6714); dari [1; 0; 0] di [−4554,6; −9498,6; 14054,2] (Sharpe 0,6595) [notebook]. «Solusi» yang bergantung pada titik awal bukanlah solusi — ia adalah jejak algoritma.",
        "Gambar di bawah menunjukkan kurva itu: Sharpe naik cepat di awal, lalu mendatar mendekati garis putus-putus supremum 0,6718 — asimtot yang tak pernah disentuh. Titik SLSQP (0,6697) duduk di dekat garis itu, di leverage ≈ 6941 — jauh di luar sumbu grafik. Bayangkan menyajikan w = [−3154,7; −3786,1; 6941,9] ke komite investasi sebagai «portofolio optimal»: short BBCA 315.400 persen dari modal. Itu bukan optimal — itu lelucon yang ditulis solver.",
        "Untuk melengkapi gambaran: DENGAN aset bebas risiko (tanpa kendala Σw = 1), Sharpe maksimum teoritis adalah 1,0517 [notebook] — dari rumus √(μ−rf)'Σ⁻¹(μ−rf). Arah tangency-nya Σ⁻¹(μ−rf·1) = [−2,2448; −1,3644; 0,8814], yang jumlahnya −2,7279 — NET SHORT. Bila arah itu dipaksa dinormalisasi ke jumlah 1 (dibagi −2,7279), arahnya TERBALIK dan Sharpe-nya menjadi −1,0517 [notebook]. Pelajaran ganda: (1) tanpa kendala, «maksimalkan Sharpe» tidak punya jawaban berhingga; (2) jawaban «teoritis» 1,0517 itu sendiri adalah portofolio net-short yang tidak bisa dibeli begitu saja — ia adalah arah, bukan portofolio.",
        "Baik atau buruk: ill-posedness bagus sebagai PELAJARAN — ia mengajarkan bahwa tidak semua masalah optimasi yang bisa ditulis punya jawaban, dan solver tidak akan memberi tahumu bila masalahmu tidak punya jawaban (ia mengembalikan «success» juga). Buruk bila tidak dikenali: satu angka «Sharpe 0,6697» di slide bisa mengunci keputusan alokasi yang mustahil dieksekusi.",
        "Mitigasi: sebelum memaksimalkan rasio apa pun, tanyakan: apakah fungsinya punya maksimum berhingga di feasible set ini? Bila tidak — tambahkan kendala yang membuatnya well-posed (langkah 9: long-only), atau ubah tujuannya (maksimalkan return dengan batas volatilitas, atau minimalkan varians dengan target return — keduanya konveks dan well-posed).",
      ],
      formula: String.raw`S(w) = \frac{w'\mu - r_f}{\sqrt{w'\Sigma w}}, \quad \sup S = 0{,}6718 \;\; \text{(arah zero-cost } [-0{,}5406;\; -0{,}4594;\; 1{,}0]\text{)}, \quad \text{tidak pernah dicapai}`,
      formulaNote: "Max-Sharpe tak-terkendala [notebook]: supremum 0,6718 (arah zero-cost terbaik), SLSQP berhenti di [−3154,7; −3786,1; 6941,9] dengan Sharpe 0,6697 — artefak titik berhenti, bukan solusi. Max Sharpe teoritis dengan aset bebas risiko = 1,0517; arah tangency [−2,2448; −1,3644; 0,8814] jumlah −2,7279 (net short).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Sharpe vs leverage: dari 0,0590 di lambda 0 naik mendekati supremum 0,6718; titik SLSQP (0,6697, λ ≈ 6941) tidak diplot">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sharpe vs leverage λ — mendekati 0,6718, tak pernah sampai</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="37.1" x2="466" y2="37.1" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="30.0" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">supremum 0,6718</text>
<line x1="52.0" y1="206" x2="52.0" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="93.5" y1="206" x2="93.5" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="93.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="217.7" y1="206" x2="217.7" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.7" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<line x1="341.8" y1="206" x2="341.8" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100</text>
<line x1="466.0" y1="206" x2="466.0" y2="202" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1000</text>
<line x1="52" y1="206.0" x2="48" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="52" y1="155.7" x2="48" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="52" y1="105.4" x2="48" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="52" y1="55.1" x2="48" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="52" y1="30.0" x2="48" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,7</text>
<polyline points="52.0,191.2 93.5,110.0 130.9,83.6 180.3,59.0 217.7,48.7 304.4,39.5 341.8,38.3 466.0,37.2" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="52.0" cy="191.2" r="4" fill="var(--c2)"/>
<text x="62" y="196" font-size="10" fill="var(--text)" font-family="var(--font-ui)">λ=0: 100% UNVR, 0,0590</text>
<text x="259" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">leverage λ (skala log) pada w(λ) = [0; 0; 1] + λ·d</text>
<text x="14" y="118" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118)">Sharpe ratio</text>
</svg>`,
        alt: "Sharpe vs leverage: dari 0,0590 di lambda 0 naik mendekati supremum 0,6718; titik SLSQP (0,6697, λ ≈ 6941) tidak diplot.",
        caption: "Cara membaca: sumbu-x leverage λ (skala log untuk λ ≥ 1; λ = 0 diletakkan di tepi kiri) sepanjang ray w(λ) = [0; 0; 1] + λ·[−0,5406; −0,4594; 1,0] [notebook]; sumbu-y Sharpe. Interpretasi: Sharpe naik cepat lalu mendatar mendekati garis putus-putus 0,6718 — supremum yang tak pernah dicapai portofolio berhingga; titik SLSQP (0,6697) tidak diplot — ia berada di λ ≈ 6941, jauh di luar sumbu-x grafik.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: «SLSQP success = True, jadi [−3154,7; −3786,1; 6941,9] adalah portofolio optimal»",
        type: "pitfall",
        body: "Yang benar: success = True hanya berarti solver memenuhi KRITERIA BERHENTINYA sendiri (toleransi langkah/fungsi) — bukan bahwa ia menemukan optimum. Masalah ini tidak punya optimum berhingga: supremumnya 0,6718, dan dari titik awal yang berbeda SLSQP berhenti di tempat yang berbeda ([−11003,8; −12512,6; 23517,4], [−3415,7; −3360,3; 6777,0], [−4554,6; −9498,6; 14054,2]) dengan Sharpe 0,6595–0,6714. JANGAN pernah sajikan bobot-bobot itu sebagai «portofolio optimal».",
      },
    },
    {
      id: "longonly",
      eyebrow: "Langkah 9 · Long-only mengubah masalah",
      title: "Long-only: satu kendala yang mengubah ill-posed menjadi corner solution",
      prose: [
        "Tambahkan SATU kendala ke masalah max-Sharpe yang meledak tadi: w ≥ 0 (tidak boleh short). Seketika masalahnya berubah total — dari ill-posed menjadi well-posed, dan jawabannya adalah corner solution: [0; 0; 1] — 100 persen UNVR [notebook].",
        "Kenapa corner? Lihat excess return-nya (return minus rf = 0,05) [notebook]: BBCA −0,2445 − 0,05 = −0,2945; KLBF −0,2570 − 0,05 = −0,3070; UNVR 0,0796 − 0,05 = +0,0296. UNVR adalah SATU-SATUNYA aset dengan excess return positif. Setiap rupiah yang digeser dari UNVR ke BBCA atau KLBF menurunkan pembilang Sharpe (excess return portofolio) — sambil menambah penyebut (volatilitas) karena korelasinya positif (0,2774 dan 0,2897). Tidak ada campuran yang bisa mengalahkan UNVR murni: Sharpe maksimum long-only adalah Sharpe UNVR sendiri, 0,0590, dengan return 0,0796 dan vol 0,5014 [notebook].",
        "Dalam bahasa KKT (langkah 5): active set-nya {BBCA, KLBF} — kedua bobot tepat di batas nol — dan μ_BBCA, μ_KLBF > 0 («denda» karena kedua aset itu merugikan bila dipegang), sementara μ_UNVR = 0 (UNVR dipegang, kendalanya tidak aktif). Corner solution adalah ciri khas masalah dengan kendala ketidaksamaan: optimum sering menempel di batas, bukan di tengah.",
        "Nilai: bandingkan dengan GMV long-only [notebook] — [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966 — yang SAMA dengan GMV tak-terkendala. Dua masalah, dua nasib kendala yang sama: untuk GMV, long-only tidak mengikat sama sekali (active set kosong); untuk max-Sharpe, long-only mengikat total (dua dari tiga aset di batas). Kendala yang sama bisa gratis di satu masalah dan menentukan di masalah lain — itulah mengapa «apakah kendala ini mengikat?» harus dicek per masalah, bukan diasumsikan.",
        "Baik atau buruk: corner solution bagus karena ia JUJUR — ia berkata «di data ini, dengan kendala ini, jawaban terbaik adalah satu aset» — dan itu adalah informasi, bukan kegagalan. Buruk bila dibaca sebagai «diversifikasi tidak berguna»: corner ini adalah artefak data (dua dari tiga aset punya excess return negatif yang besar) + kendala; di data lain, max-Sharpe long-only bisa jadi interior (ketiga bobot positif). Jangan generalisasi dari satu sampel.",
        "Mitigasi: bila solusimu adalah corner (satu-dua aset 100 persen atau 0 persen), tanyakan: apakah ini sinyal ekonomi yang nyata, atau artefak estimasi μ yang berisik? Mean return adalah input yang paling berisik di optimasi portofolio (M5.5: shrinkage & Black-Litterman) — corner yang didorong oleh μ yang diestimasi dari 480 hari berhak dicurigai sebelum dieksekusi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «max-Sharpe long-only 100% UNVR berarti UNVR adalah saham terbaik»",
        type: "pitfall",
        body: "Yang benar: 100% UNVR adalah jawaban OPTIMASI pada estimasi ini — UNVR satu-satunya aset dengan excess return positif (0,0296) di 480 hari ini. Itu bukan vonis fundamental tentang UNVR, dan bukan rekomendasi. Di periode lain, dengan μ yang berbeda, corner-nya bisa di aset lain — atau tidak ada corner sama sekali.",
      },
    },
    {
      id: "praktis",
      eyebrow: "Langkah 10 · Kendala praktis",
      title: "Kendala praktis lain: batas bobot, turnover, dan sector",
      prose: [
        "Di meja kerja nyata, kendala Σw = 1 dan w ≥ 0 hanyalah permulaan. Tiga keluarga kendala praktis yang paling sering muncul: (1) batas bobot — misal w_i ≤ 0,40 untuk mencegah konsentrasi (GMV kita [notebook] melanggarnya: w_BBCA = 0,5523 > 0,40 — jadi batas ini MENGIKAT dan mengubah jawaban); (2) batas turnover — |w − w_0| ≤ δ, portofolio baru tidak boleh terlalu jauh dari portofolio lama, karena tiap perubahan adalah biaya transaksi; (3) batas sector — misal total bobot perbankan ≤ 0,60, atau bobot saham consumer ≥ 0,20 karena mandat.",
        "Semua kendala ini LINEAR — dan itu kabar baik: masalah GMV dengan kendala linear tetap konveks (quadratic program) dan KKT tetap menjadi bukti optimum global. Mesinnya sama (SLSQP atau solver QP), hanya feasible set-nya yang menyusut. Rumus tertutup langkah 6 tidak lagi berlaku — tidak ada rumus satu baris untuk GMV dengan batas bobot — tapi solver menanganinya dengan cara yang sama (langkah 12).",
        "Nilai: hitung «harga» satu kendala pada data kita [notebook]. Batas w_UNVR ≤ 0,50 [ilustrasi] memotong ujung atas frontier: return maksimum long-only jatuh dari 0,0796 (100% UNVR) menjadi −0,0825 — portofolio [0,5; 0; 0,5] (BBCA + UNVR masing-masing setengah). Satu kendala, satu angka: «harga»-nya adalah 0,1621 poin return tahunan. Tanpa menghitung harga seperti ini, komite investasi tidak bisa memutuskan apakah batas itu layak dipertahankan.",
        "Baik atau buruk: kendala praktis bagus bila ia mencerminkan aturan yang nyata dan harganya dihitung terbuka — komite bisa menimbang «apakah batas 40 persen ini sepadan dengan return yang hilang?». Buruk bila kendala menumpuk tanpa audit: tiap batas baru menyusutkan frontier, dan tumpukan batas yang tidak pernah diuji bisa diam-diam memaksa portofolio ke sudut yang buruk.",
        "Mitigasi: audit kendala secara berkala — hapus satu kendala, hitung ulang optimum, dan lihat berapa harganya. Kendala yang harganya nol (tidak mengikat) bisa tetap sebagai pengaman; kendala yang harganya besar harus dibela dengan alasan bisnis, bukan kebiasaan. Dan ingat jebakan pamungkasnya (checkpoint): kendala yang terlalu ketat tidak hanya menyusutkan frontier — ia bisa membuat feasible set KOSONG (misal w_BBCA ≥ 0,60 dan w_BBCA ≤ 0,40 bersamaan), dan solver akan gagal tanpa solusi sama sekali.",
      ],
      tasks: [],
    },
    {
      id: "kendala-realistis",
      eyebrow: "Langkah 11 · Kendala realistis",
      title: "Kendala realistis: berapa harga tiap aturan?",
      prose: [
        "Langkah 10 menyebut tiga keluarga kendala praktis — batas bobot, turnover, sector — tapi belum menghitung HARGA satu pun. Sekarang hitung: tiap kendala di bawah diterapkan pada GMV 3 aset yang sama (vol bebas 0,2966), dan «harga»-nya adalah kenaikan vol dalam basis poin (bp). Satu tabel, empat harga — dan satu pelajaran: kendala hanya berharga bila ia MENGIKAT.",
        "Nilai: cap bobot BBCA ≤ 0,40 [ilustrasi] — GMV bebas menaruh 0,5523 di BBCA, di atas cap, jadi cap ini mengikat. GMV baru w = [0,4000; 0,3646; 0,2354], vol 0,3026 — naik 60bp dari 0,2966. Kardinalitas ≤ 2 aset (pegang paling banyak 2 dari 3): pasangan terbaik adalah BBCA+KLBF, w = [0,6563; 0,3437; 0], vol 0,3093 — naik 127bp, kendala TERMAHAL di tabel ini. Dua pasangan lain lebih mahal lagi: BBCA+UNVR vol 0,3172, KLBF+UNVR vol 0,3672. Minimum holding 0,10 (aset yang dipegang minimal 10%): TIDAK mengikat — GMV bebas sudah menaruh ≥ 0,10 di tiap aset (bobot terkecil 0,1777) — vol tetap 0,2966, harga 0bp. Budget turnover L1 ≤ 0,10 dari equal-weight: w = [0,3833; 0,3333; 0,2833], vol 0,3048 — naik 82bp. Gambar di bawah merangkum keempat harga itu dalam satu tatapan.",
        "Bagaimana kardinalitas dan minimum holding dihitung? Bukan «solver ajaib» — enumerasi + SLSQP. Untuk kardinalitas ≤ 2 dengan 3 aset, ada 2³ = 8 subset (termasuk himpunan kosong dan singleton); untuk tiap subset yang tak-kosong, jalankan SLSQP GMV yang dibatasi pada aset di subset itu, lalu ambil vol terkecil — itulah BBCA+KLBF (0,3093). Minimum holding dihitung dengan cara yang sama: tiap subset diuji dengan batas bawah 0,10 pada aset yang dipegang — dan subset terbaik tetap ketiganya (0,2966), karena GMV bebas sudah memenuhi batasnya. Enumerasi bekerja untuk 3 aset; untuk 30 aset, 2³⁰ subset tidak mungkin — di sanalah mixed-integer programming (MIP) masuk, dan itu di luar lesson ini.",
        "Baik atau buruk: tabel harga bagus karena ia mengubah debat kendala dari opini menjadi angka — komite bisa menimbang «apakah larangan pegang 3 aset sepadan dengan +127bp vol?». Buruk bila harga dibaca tanpa konteks: +127bp di vol 0,2966 adalah ~4,3% relatif — kecil di satu tahun yang volatil, besar bila dijumlahkan tiap tahun selama satu dekade.",
        "Mitigasi: sebelum mengusulkan kendala baru, hitung harganya dulu (tabel seperti di atas) dan tanyakan apakah ia mengikat: bila tidak mengikat, ia gratis — pertahankan sebagai pengaman tanpa debat; bila mengikat, bela dengan alasan bisnis, bukan kebiasaan. Dan ingat: kendala yang tidak mengikat HARI INI bisa mengikat BESOK bila estimasi bergeser — audit ulang tiap rebalancing.",
      ],
      formula: String.raw`\text{harga} = \sigma_{\text{terkendala}} - \sigma_{\text{bebas}}: \quad \text{cap } 0{,}40 \to +60\,\text{bp}; \quad \text{kardinalitas } \leq 2 \to +127\,\text{bp}; \quad \text{min holding } 0{,}10 \to +0\,\text{bp}; \quad \text{turnover } L_1 \leq 0{,}10 \to +82\,\text{bp}`,
      formulaNote: "Harga kendala = kenaikan vol vs GMV bebas (0,2966): cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026 (+60bp); kardinalitas ≤ 2 → vol 0,3093 (+127bp, termahal); minimum holding 0,10 → vol 0,2966 (+0bp, tidak mengikat); budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Harga kendala: GMV bebas vol 0,2966; cap 0,3026; kardinalitas 0,3093; minimum holding 0,2966; turnover 0,3048">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Harga kendala — vol vs GMV bebas 0,2966</text>
<text x="52" y="44" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV bebas</text>
<rect x="52" y="50" width="91.1" height="18" fill="var(--c4)"/>
<text x="149.1" y="63" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2966</text>
<text x="52" y="76" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Cap BBCA ≤ 0,40 [ilustrasi]</text>
<rect x="52" y="82" width="173.9" height="18" fill="var(--c1)"/>
<text x="231.9" y="95" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,3026 (+60bp)</text>
<text x="52" y="108" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Kardinalitas ≤ 2 aset</text>
<rect x="52" y="114" width="266.3" height="18" fill="var(--c1)"/>
<text x="324.3" y="127" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,3093 (+127bp)</text>
<text x="52" y="140" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Minimum holding 0,10</text>
<rect x="52" y="146" width="91.1" height="18" fill="var(--c1)"/>
<text x="149.1" y="159" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2966 (+0bp)</text>
<text x="52" y="172" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Budget turnover L1 ≤ 0,10</text>
<rect x="52" y="178" width="204.2" height="18" fill="var(--c1)"/>
<text x="262.2" y="191" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,3048 (+82bp)</text>
<line x1="52" y1="200" x2="466" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="200" x2="52" y2="204" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,29</text>
<line x1="190" y1="200" x2="190" y2="204" stroke="var(--chart-text)" stroke-width="1"/>
<text x="190" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="328" y1="200" x2="328" y2="204" stroke="var(--chart-text)" stroke-width="1"/>
<text x="328" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,31</text>
<line x1="466" y1="200" x2="466" y2="204" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,32</text>
<text x="259" y="238" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">volatilitas tahunan</text>
</svg>`,
        alt: "Harga kendala: GMV bebas vol 0,2966; cap 0,3026; kardinalitas 0,3093; minimum holding 0,2966; turnover 0,3048.",
        caption: "Cara membaca: panjang bar = volatilitas tahunan, skala sumbu-x 0,29 → 52 px, 0,32 → 466 px (13.800 px per unit vol); bar GMV bebas (0,2966) sebagai patokan. Interpretasi: kardinalitas ≤ 2 adalah kendala termahal (+127bp) karena memaksa buang satu aset; minimum holding gratis (+0bp) karena GMV bebas sudah memenuhi batasnya — kendala hanya berharga bila mengikat.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: «semua kendala membebani portofolio»",
        type: "pitfall",
        body: "Yang benar: kendala yang TIDAK mengikat harganya NOL — minimum holding 0,10 tidak mengubah apa-apa karena GMV sudah ≥ 0,10 di tiap aset (bobot terkecil 0,1777). Harga kendala bukan sifat kendalanya — ia adalah sifat kendala × data. Uji mengikat-tidaknya dulu, baru debat harganya.",
      },
    },
    {
      id: "slsqp",
      eyebrow: "Langkah 12 · SLSQP cara kerja",
      title: "SLSQP: bukan black box — QP kecil, berulang-ulang",
      prose: [
        "SLSQP (Sequential Least Squares Programming) adalah solver yang dipakai notebook M5 [notebook] — dan ia bukan black box bila kamu tahu idenya. Di tiap iterasi, SLSQP melakukan TIGA hal: (1) hampiri fungsi tujuan dengan model KUADRATIK di sekitar titik saat ini (ekspansi Taylor orde dua — gradien + Hessian, atau hampirannya); (2) LINEARKAN kendala di sekitar titik itu (kendala linear seperti Σw = 1 dan w ≥ 0 sudah linear — tidak berubah); (3) selesaikan masalah QUADRATIC PROGRAM (QP) kecil itu — masalah yang punya solusi cepat dan andal — lalu melangkah ke titik baru, dan ulangi.",
        "Kenapa ini bekerja untuk GMV? Karena tujuan GMV (w'Σw) SUDAH kuadratik dan kendalanya linear — hampiran kuadratiknya EXACT, bukan hampiran. SLSQP menyelesaikan GMV dalam satu-dua iterasi, dan jawabannya cocok dengan closed-form sampai 0,0008 (langkah 6). Untuk max-Sharpe, tujuannya adalah RASIO — hampiran kuadratiknya tidak pernah exact, gradiennya tidak pernah nol di arah zero-cost, dan solver berjalan menjauhi titik awal sampai toleransi menghentikannya — itulah [−3154,7; −3786,1; 6941,9] (langkah 8).",
        "Nilai: dua angka yang perlu kamu periksa dari solver apa pun — (1) `success` (apakah kriteria berhenti terpenuhi) dan (2) APA yang berhenti: gradien? langkah? fungsi? SLSQP berhenti bila perubahan fungsi atau langkah di bawah toleransi (ftol/xtol, default 1e-6) — di masalah ill-posed, «perubahan kecil» terjadi di leverage ribuan, BUKAN karena optimum ditemukan. Selalu cetak juga `nit` (jumlah iterasi) dan periksa KKT secara independen (langkah 4) — jangan pernah menerima `success = True` sebagai bukti.",
        "Baik atau buruk: SLSQP bagus karena ia generalis — satu solver untuk tujuan dan kendala apa pun yang cukup mulus, termasuk yang tidak punya rumus tertutup (GMV + batas bobot). Buruk bila dipakai sebagai orakel: ia tidak tahu apakah masalahmu punya solusi; ia hanya berjalan sampai lelah.",
        "Mitigasi: tiga kebiasaan sebelum memakai hasil solver — (1) jalankan dari DUA titik awal yang berbeda dan bandingkan (bila berbeda jauh, curigai ill-posed); (2) bandingkan dengan closed-form bila ada; (3) verifikasi KKT pada jawabannya. Di lesson ini, (1) sudah membongkar max-Sharpe (tiga titik awal → tiga «solusi» berbeda), dan (2) sudah memvalidasi GMV.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 13 · Lab 1",
      title: "Lab: Lagrange 2 aset — hitung tangan, cek numerik",
      prose: [
        "Sekarang giliranmu memegang Lagrange. Datanya sintetis [ilustrasi] — kecil dan bisa dihitung tangan: dua aset dengan varians 0,04 dan 0,09, kovarians 0,01. Tugasmu: (t1) hitung w1 dari rumus tertutup GMV 2 aset, (t2) hitung multiplier λ = 2 × var_p, (t3) verifikasi bahwa gradien 2Σw sama di kedua komponen — persis seperti verifikasi KKT di langkah 4.",
        "Hasilnya [lab]: w1 = 0,7273, w2 = 0,2727, var portofolio = 0,0318, λ = 0,0636, gradien = [0,0636; 0,0636] — kedua komponen sama, verifikasi KKT lolos. Bandingkan dengan angka kanonis langkah 4 (w_BBCA = 0,6565, λ = 0,1913): angkanya berbeda karena datanya berbeda, tapi POLANYA sama — λ selalu 2 × var_p, dan gradien selalu sama di semua aset yang dipegang.",
        "Bacaan yang jujur: lab ini tidak membuktikan apa-apa tentang pasar — datanya sintetis. Yang ia buktikan adalah kamu bisa MENJALANKAN mesinnya: rumus → bobot → λ → verifikasi. Mesin yang sama, dengan data pin, menghasilkan angka kanonis lesson ini (lab 2).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi w1 dengan rumus tertutup GMV 2 aset: (s2 - s12) / (s1 + s2 - 2*s12)" },
        { id: "t2", text: "Lengkapi lam dengan 2 * var_p (dari FOC 2*Sigma*w = lambda*1)" },
        { id: "t3", text: "Jalankan dan periksa verifikasi KKT: kedua komponen gradien harus sama (= lambda)" },
      ],
      expected: "w1 = 0.7273, w2 = 0.2727\nvar portofolio = 0.0318\nlambda = 0.0636\ngradien = [0.0636, 0.0636]\nverifikasi KKT: gradien sama = True",
      hints: [
        "Rumus tertutup: w1 = (s2 - s12) / (s1 + s2 - 2*s12) — pembilangnya varians aset 2 minus kovarians.",
        "lambda = 2 * var_p — kalikan FOC 2*Sigma*w = lambda*1 dari kiri dengan w' dan pakai w'1 = 1.",
        "Gradien komponen 1: 2 * (s1*w1 + s12*w2); komponen 2: 2 * (s12*w1 + s2*w2) — keduanya harus sama.",
      ],
      code: {
        starter: `# Kovarians [ilustrasi]: dua aset — varians 0,04 dan 0,09, kovarians 0,01
s1, s2, s12 = 0.04, 0.09, 0.01

# TODO (t1): rumus tertutup GMV 2 aset
w1 = 0  # TODO: ganti 0 dengan (s2 - s12) / (s1 + s2 - 2 * s12)
w2 = 1 - w1

# Varians portofolio GMV
var_p = w1**2 * s1 + w2**2 * s2 + 2 * w1 * w2 * s12

# TODO (t2): multiplier Lagrange — dari FOC, lambda = 2 * var_p
lam = 0  # TODO: ganti 0 dengan 2 * var_p

# TODO (t3): verifikasi — gradien 2*Sigma*w, kedua komponen harus sama (= lambda)
g1 = 2 * (s1 * w1 + s12 * w2)
g2 = 2 * (s12 * w1 + s2 * w2)

print(f"w1 = {w1:.4f}, w2 = {w2:.4f}")
print(f"var portofolio = {var_p:.4f}")
print(f"lambda = {lam:.4f}")
print(f"gradien = [{g1:.4f}, {g2:.4f}]")
print(f"verifikasi KKT: gradien sama = {abs(g1 - g2) < 1e-9}")`,
        lockLines: 3,
        solution: `# Kovarians [ilustrasi]: dua aset — varians 0,04 dan 0,09, kovarians 0,01
s1, s2, s12 = 0.04, 0.09, 0.01

# TODO (t1): rumus tertutup GMV 2 aset
w1 = (s2 - s12) / (s1 + s2 - 2 * s12)
w2 = 1 - w1

# Varians portofolio GMV
var_p = w1**2 * s1 + w2**2 * s2 + 2 * w1 * w2 * s12

# TODO (t2): multiplier Lagrange — dari FOC, lambda = 2 * var_p
lam = 2 * var_p

# TODO (t3): verifikasi — gradien 2*Sigma*w, kedua komponen harus sama (= lambda)
g1 = 2 * (s1 * w1 + s12 * w2)
g2 = 2 * (s12 * w1 + s2 * w2)

print(f"w1 = {w1:.4f}, w2 = {w2:.4f}")
print(f"var portofolio = {var_p:.4f}")
print(f"lambda = {lam:.4f}")
print(f"gradien = [{g1:.4f}, {g2:.4f}]")
print(f"verifikasi KKT: gradien sama = {abs(g1 - g2) < 1e-9}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w1", value: 0.7273, tol: 0.0001, label: "`w1` seharusnya 0.7273", msg: "Rumus tertutup GMV 2 aset: (0,09 − 0,01) / (0,04 + 0,09 − 0,02) = 0,7273." },
          { kind: "equal", task: "t2", name: "lam", value: 0.0636, tol: 0.0001, label: "`lam` seharusnya 0.0636", msg: "λ = 2 × var_p = 2 × 0,0318 = 0,0636 — «harga» kendala Σw = 1 di data ilustrasi ini." },
          { kind: "equal", task: "t2", name: "var_p", value: 0.0318, tol: 0.0001, label: "`var_p` seharusnya 0.0318", msg: "Varians portofolio GMV: 0,0318 — di bawah varians aset mana pun (0,04 dan 0,09)." },
          { kind: "stdout_matches", task: "t3", pattern: "verifikasi KKT: gradien sama = True", label: "Output menampilkan verifikasi KKT lolos", msg: "Gradien 2Σw = [0,0636; 0,0636] — kedua komponen sama (= λ), FOC terpenuhi." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 14 · Lab 2",
      title: "Lab: SLSQP GMV vs closed-form dari data pin",
      prose: [
        "Lab kedua memakai data pin yang sesungguhnya [notebook]: matriks kovarians dan mean HARIAN BBCA, KLBF, UNVR (simple return, 480 hari, 2024-11-04 s.d. 2026-11-11) sudah tertanam di kode — dikali 252 menjadi tahunan. Tugasmu: (t1) hitung GMV closed-form dari rumus Lagrange w = Σ⁻¹1 / (1'Σ⁻¹1), (t2) hitung GMV numerik dengan SLSQP (minimkan w'Σw, kendala Σw = 1, tanpa batas — shorting boleh), (t3) bandingkan keduanya.",
        "Hasilnya [lab]: closed-form [0,5518; 0,2698; 0,1785], SLSQP [0,5523; 0,2699; 0,1777], selisih maks 0,0007. Return closed-form −0,1900 vs SLSQP −0,1903 (selisih 0,0003 — murni akibat bobot yang bergeser 0,0007), volatilitas keduanya 0,2966 [notebook]. Ini adalah replikasi langkah 6 dengan tanganmu sendiri: dua jalan yang sama sekali berbeda tiba di tempat yang sama — dan itulah cara kamu tahu masalahnya well-posed.",
        "Bandingkan dengan langkah 8: bila kamu mengganti tujuan lab ini menjadi «maksimalkan Sharpe tanpa batas», SLSQP tidak akan berhenti di angka yang stabil seperti ini — ia akan berlari ke leverage ribuan. Lab ini menunjukkan sisi baik solver; langkah 8 menunjukkan sisi gelapnya. Keduanya adalah SLSQP yang sama — yang berbeda adalah masalahnya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi w_cf dengan rumus Lagrange: inv @ ones / (ones @ inv @ ones)" },
        { id: "t2", text: "Lengkapi pemanggilan SLSQP: minimize varians dengan kendala sum w = 1, tanpa batas" },
        { id: "t3", text: "Jalankan dan bandingkan: selisih maks closed-form vs SLSQP harus 0.0007" },
      ],
      expected: "closed-form: [0.5518, 0.2698, 0.1785]\nSLSQP: [0.5523, 0.2699, 0.1777]\nselisih maks: 0.0007\nclosed-form: return -0.1900 vol 0.2966\nSLSQP: return -0.1903 vol 0.2966",
      hints: [
        "Closed-form: w_cf = inv @ ones / (ones @ inv @ ones) — inv sudah dihitung dari np.linalg.inv(cov).",
        "SLSQP: minimize(lambda w: w @ cov @ w, np.ones(3) / 3, method=\"SLSQP\", bounds=[(None, None)] * 3, constraints=[{\"type\": \"eq\", \"fun\": lambda w: w.sum() - 1.0}]).",
        "Selisih maks: np.max(np.abs(w_cf - w_slsqp)) — bandingkan komponen demi komponen, ambil yang terbesar.",
      ],
      requires: ["scipy", "numpy"],
      code: {
        starter: `import numpy as np
from scipy.optimize import minimize

# Kovarians & mean HARIAN dari data pin [notebook] (BBCA, KLBF, UNVR)
# Simple return, 480 hari, 2024-11-04 s.d. 2026-11-11; x252 = tahunan.
cov_d = np.array([
    [0.0004720457, 0.0002029547, 0.0001903736],
    [0.0002029547, 0.0007171965, 0.0002450454],
    [0.0001903736, 0.0002450454, 0.0009975218],
])
mu_d = np.array([-0.0009703561, -0.0010197664, 0.0003158874])
cov = cov_d * 252
mu = mu_d * 252
ones = np.ones(3)

# TODO (t1): GMV closed-form dari rumus Lagrange — w = Sigma^-1 1 / (1' Sigma^-1 1)
inv = np.linalg.inv(cov)
w_cf = np.zeros(3)  # TODO: ganti dengan inv @ ones / (ones @ inv @ ones)

# TODO (t2): GMV numerik dengan SLSQP — minimkan w' Sigma w, kendala sum w = 1, tanpa batas
res = None  # TODO: minimize(lambda w: w @ cov @ w, np.ones(3) / 3, method="SLSQP", bounds=[(None, None)] * 3, constraints=[{"type": "eq", "fun": lambda w: w.sum() - 1.0}])
w_slsqp = res.x

# TODO (t3): bandingkan closed-form vs SLSQP
w_cf_bbca = float(w_cf[0])
w_slsqp_bbca = float(w_slsqp[0])
diff = float(np.max(np.abs(w_cf - w_slsqp)))
r_cf = float(w_cf @ mu)
v_cf = float(np.sqrt(w_cf @ cov @ w_cf))
r_s = float(w_slsqp @ mu)
v_s = float(np.sqrt(w_slsqp @ cov @ w_slsqp))
print(f"closed-form: [{w_cf[0]:.4f}, {w_cf[1]:.4f}, {w_cf[2]:.4f}]")
print(f"SLSQP: [{w_slsqp[0]:.4f}, {w_slsqp[1]:.4f}, {w_slsqp[2]:.4f}]")
print(f"selisih maks: {diff:.4f}")
print(f"closed-form: return {r_cf:.4f} vol {v_cf:.4f}")
print(f"SLSQP: return {r_s:.4f} vol {v_s:.4f}")`,
        lockLines: 15,
        solution: `import numpy as np
from scipy.optimize import minimize

# Kovarians & mean HARIAN dari data pin [notebook] (BBCA, KLBF, UNVR)
# Simple return, 480 hari, 2024-11-04 s.d. 2026-11-11; x252 = tahunan.
cov_d = np.array([
    [0.0004720457, 0.0002029547, 0.0001903736],
    [0.0002029547, 0.0007171965, 0.0002450454],
    [0.0001903736, 0.0002450454, 0.0009975218],
])
mu_d = np.array([-0.0009703561, -0.0010197664, 0.0003158874])
cov = cov_d * 252
mu = mu_d * 252
ones = np.ones(3)

# TODO (t1): GMV closed-form dari rumus Lagrange — w = Sigma^-1 1 / (1' Sigma^-1 1)
inv = np.linalg.inv(cov)
w_cf = inv @ ones / (ones @ inv @ ones)

# TODO (t2): GMV numerik dengan SLSQP — minimkan w' Sigma w, kendala sum w = 1, tanpa batas
res = minimize(lambda w: w @ cov @ w, np.ones(3) / 3, method="SLSQP",
               bounds=[(None, None)] * 3,
               constraints=[{"type": "eq", "fun": lambda w: w.sum() - 1.0}])
w_slsqp = res.x

# TODO (t3): bandingkan closed-form vs SLSQP
w_cf_bbca = float(w_cf[0])
w_slsqp_bbca = float(w_slsqp[0])
diff = float(np.max(np.abs(w_cf - w_slsqp)))
r_cf = float(w_cf @ mu)
v_cf = float(np.sqrt(w_cf @ cov @ w_cf))
r_s = float(w_slsqp @ mu)
v_s = float(np.sqrt(w_slsqp @ cov @ w_slsqp))
print(f"closed-form: [{w_cf[0]:.4f}, {w_cf[1]:.4f}, {w_cf[2]:.4f}]")
print(f"SLSQP: [{w_slsqp[0]:.4f}, {w_slsqp[1]:.4f}, {w_slsqp[2]:.4f}]")
print(f"selisih maks: {diff:.4f}")
print(f"closed-form: return {r_cf:.4f} vol {v_cf:.4f}")
print(f"SLSQP: return {r_s:.4f} vol {v_s:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_cf_bbca", value: 0.5518, tol: 0.002, label: "`w_cf_bbca` seharusnya 0.5518", msg: "Closed-form GMV: w_BBCA = 0,5518 [notebook]." },
          { kind: "equal", task: "t2", name: "w_slsqp_bbca", value: 0.5523, tol: 0.002, label: "`w_slsqp_bbca` seharusnya 0.5523", msg: "SLSQP GMV: w_BBCA = 0,5523 [notebook] — sepakat dengan closed-form." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih maks: 0\\.0007", label: "Output menampilkan selisih maks 0,0007", msg: "Selisih maks closed-form vs SLSQP: 0,0007 — ≈0,15% dari bobot terbesar (0,55), atau 0,08% dari total dana." },
          { kind: "stdout_matches", task: "t3", pattern: "SLSQP: return -0\\.1903 vol 0\\.2966", label: "Output menampilkan SLSQP return -0,1903 vol 0,2966", msg: "GMV SLSQP: return −0,1903, vol 0,2966 [notebook]." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 15 · Checkpoint",
      title: "Checkpoint: kendala, KKT, dan masalah yang tidak punya solusi",
      prose: [
        "Rangkuman: kendala mengubah masalah — Lagrange mengubah kendala kesetaraan Σw = 1 menjadi «harga» λ (untuk GMV, λ = 2σ²_p; di GMV 2 aset, λ = 0,1913), dan KKT memperluasnya ke ketidaksamaan w ≥ 0 lewat complementary slackness μ_i·w_i = 0 dan active set. GMV 2 aset (BBCA + KLBF): w = [0,6565; 0,3435], return −0,2488, vol 0,3093 — verifikasi KKT: 2Σw = [0,1913; 0,1913]. GMV 3 aset: closed-form [0,5518; 0,2698; 0,1785] vs SLSQP [0,5523; 0,2699; 0,1777] — selisih maks 0,0007 (0,0008 dari bobot 4 desimal); return closed-form −0,1900 vs SLSQP −0,1903, vol 0,2966: masalah well-posed. Max-Sharpe tak-terkendala adalah ill-posed: SLSQP berhenti di [−3154,7; −3786,1; 6941,9] (Sharpe 0,6697) — artefak titik berhenti, BUKAN solusi; supremumnya 0,6718 (arah zero-cost [−0,5406; −0,4594; 1,0]) tak pernah dicapai portofolio berhingga; dari titik awal berbeda, solver berhenti di tempat berbeda. Max Sharpe teoritis dengan aset bebas risiko 1,0517, arah tangency [−2,2448; −1,3644; 0,8814] jumlah −2,7279 (net short — dinormalisasi ke jumlah 1, Sharpe-nya −1,0517). Long-only membuat max-Sharpe well-posed: corner [0; 0; 1] (100% UNVR), return 0,0796, vol 0,5014, Sharpe 0,0590 — karena UNVR satu-satunya aset dengan excess return positif (+0,0296). GMV long-only sama dengan GMV tak-terkendala ([0,5523; 0,2699; 0,1777]) — kendala w ≥ 0 tidak mengikat di sana. Validasi numerik: eigenvalue Σ tahunan [0,088937; 0,151142; 0,310986] — semua > 0, Σ definit positif; condition number 3,5, det(Σ) = 0,004180, Cholesky berhasil — Σ sehat, invers aman. Harga kendala vs GMV bebas (vol 0,2966): cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026 (+60bp); kardinalitas ≤ 2 → vol 0,3093 (+127bp, termahal); minimum holding 0,10 → vol 0,2966 (+0bp, tidak mengikat); budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp). SLSQP bekerja dengan menghampiri tujuan secara kuadratik dan menyelesaikan QP kecil berulang-ulang — ia generalis yang baik dan orakel yang buruk: selalu periksa KKT dan jalankan dari dua titik awal.",
        "Jebakan pamungkas — kendala yang terlalu ketat: tiap kendala menyusutkan frontier. Batas w_UNVR ≤ 0,50 [ilustrasi] memotong ujung atas frontier long-only: return maksimum jatuh dari 0,0796 menjadi −0,0825 (portofolio [0,5; 0; 0,5]) [notebook]. Tumpuk batas tanpa audit — batas bobot + batas turnover + batas sector — dan frontier bisa menyusut sampai hanya menyisakan portofolio yang buruk; tumpuk sampai kontradiktif (misal w_BBCA ≥ 0,60 dan w_BBCA ≤ 0,40 bersamaan) dan feasible set menjadi KOSONG — solver gagal tanpa solusi sama sekali. Audit kendala seperti audit kode: hapus satu, hitung harganya, dan pertahankan hanya yang harganya sepadan dengan alasan bisnisnya.",
        "Guided task di Colab — notebook mlf-m52-guided-task.ipynb (colab/mlf-m52-guided-task.ipynb) mereplikasi angka kanonis lesson ini dari data pin: GMV 2 aset (0,6565/0,3435, λ = 0,1913, verifikasi KKT), GMV 3 aset closed-form vs SLSQP, ray max-Sharpe w(λ) dengan Sharpe mendekati supremum 0,6718, titik berhenti SLSQP dari tiga titik awal yang berbeda, max-Sharpe long-only (corner 100% UNVR), dan harga batas w_UNVR ≤ 0,50 — lengkap dengan checks. Tautan Colab: https://colab.research.google.com/drive/1vdPVnP8Wh4tKx5Egg4ZHseGyE9KzEflV",
        "Jembatan ke M5.3: lesson ini menyelesaikan masalah dengan SATU jawaban optimal (atau membuktikan tidak ada). M5.3 melangkah ke pertanyaan berikutnya: dari SATU titik optimum ke SELURUH frontier — bagaimana bentuk frontier long-only, bagaimana sensitivitasnya terhadap input, dan berapa biaya rebalancing-nya. Shrinkage dan robust optimization — jawaban atas kecurigaanmu terhadap corner 100% UNVR di langkah 9 — ada di M5.5, bukan di M5.3.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Dua aset [ilustrasi]: varians 0,04 dan 0,09, kovarians 0,01. Berapa bobot GMV aset 1?",
          options: [
            { text: "0,7273 (aset 2: 0,2727)", why: "Benar: w1 = (0,09 − 0,01) / (0,04 + 0,09 − 2×0,01) = 0,08/0,11 = 0,7273.", correct: true },
            { text: "0,2727 (aset 2: 0,7273)", why: "Itu w2, bukan w1 — 0,2727 = (0,04 − 0,01)/0,11. Aset 1 yang lebih tenang (varians 0,04) mendapat bobot lebih besar." },
            { text: "0,3333 (bobot sama rata)", why: "Bobot sama rata bukan GMV — GMV membobot berdasarkan varians dan kovarians, bukan membagi rata." },
            { text: "0,6667 (rasio varians 0,09/(0,04+0,09))", why: "Rumus itu mengabaikan kovarians 0,01 — rumus GMV 2 aset yang benar memakai (σ2²−σ12)/(σ1²+σ2²−2σ12)." },
          ],
        },
        {
          q: "Untuk GMV 2 aset (BBCA + KLBF), λ = 0,1913. Apa arti λ di sini?",
          options: [
            { text: "Parameter tuning seperti learning rate — boleh diubah sesuka hati", why: "Salah: λ BUKAN dipilih — ia diselesaikan bersama w* dari FOC + kendala. Menyetel λ berarti menyelesaikan masalah yang berbeda." },
            { text: "«Harga» kendala Σw = 1: λ = 2σ²_p — melonggarkan kendala 0,01 menaikkan varians sekitar 0,0019", why: "Benar: λ = 2 × 0,09566 ≈ 0,1913 — multiplier mengukur harga marginal kendala, bukan parameter bebas.", correct: true },
            { text: "Varians portofolio itu sendiri (σ²_p = 0,1913)", why: "Salah faktor 2: σ²_p = 0,09566, sedangkan λ = 2σ²_p ≈ 0,1913." },
            { text: "λ = 0 berarti kendala Σw = 1 mengikat dengan kuat", why: "Terbalik: λ = 0 berarti kendala TIDAK mengikat — optimum tak-terkendala sudah memenuhi kendala." },
          ],
        },
        {
          q: "GMV long-only adalah [0,5523; 0,2699; 0,1777] — sama dengan GMV tak-terkendala. Apa yang benar tentang KKT di sini?",
          options: [
            { text: "Semua w_i > 0, jadi semua μ_i = 0 — active set kosong, kendala w ≥ 0 tidak mengikat", why: "Benar: complementary slackness μ_i·w_i = 0 — karena w_i > 0 untuk ketiganya, μ_i harus 0; KKT runtuh ke Lagrange biasa.", correct: true },
            { text: "Semua μ_i > 0 karena kendala w ≥ 0 selalu mengikat", why: "Salah: μ_i > 0 hanya untuk aset DI BATAS (w_i = 0). Di sini tidak ada aset di batas." },
            { text: "Active set-nya {UNVR} karena bobot UNVR paling kecil", why: "Salah: active set berisi kendala yang MENGIKAT (w_i = 0) — bobot kecil bukan berarti di batas; 0,1777 > 0." },
            { text: "KKT tidak berlaku karena GMV adalah masalah non-konveks", why: "Terbalik: GMV (kuadratik konveks + kendala linear) adalah konveks — KKT di sana adalah syarat CUKUP untuk optimum global." },
          ],
        },
        {
          q: "GMV 3 aset: closed-form [0,5518; 0,2698; 0,1785] vs SLSQP [0,5523; 0,2699; 0,1777]. Apa kesimpulannya?",
          options: [
            { text: "SLSQP salah karena berbeda dari closed-form", why: "Salah: selisih maks hanya 0,0008 — itu toleransi numerik, bukan kesalahan. Keduanya benar." },
            { text: "Selisih maks 0,0007 (0,0008 dari bobot 4 desimal) — masalah well-posed: solusi ada, tunggal, dan stabil; return closed-form −0,1900 vs SLSQP −0,1903, vol 0,2966", why: "Benar: rumus analitik dan solver numerik yang bekerja dengan cara berbeda tiba di tempat yang sama — bukti masalahnya baik.", correct: true },
            { text: "Closed-form salah karena tidak memakai solver", why: "Salah: closed-form adalah solusi EXACT dari FOC Lagrange — solver-lah yang menghampiri, bukan sebaliknya." },
            { text: "Selisih 0,0008 membuktikan Σ hampir singular", why: "Salah: selisih sebesar itu adalah toleransi SLSQP biasa. Σ singular akan menghasilkan selisih yang jauh lebih besar dan bobot yang liar." },
          ],
        },
        {
          q: "SLSQP max-Sharpe tak-terkendala berhenti di w = [−3154,7; −3786,1; 6941,9] dengan Sharpe 0,6697 dan success = True. Apa itu?",
          options: [
            { text: "Portofolio optimal — Sharpe 0,6697 adalah maksimumnya", why: "Salah: masalah ini TIDAK PUNYA maksimum berhingga. 0,6697 hanya tempat solver berhenti — dari titik awal berbeda ia berhenti di tempat berbeda." },
            { text: "Artefak titik berhenti, BUKAN solusi: supremumnya 0,6718 (arah zero-cost [−0,5406; −0,4594; 1,0]) yang tak pernah dicapai portofolio berhingga", why: "Benar: sepanjang ray w(λ), Sharpe merangkak mendekati 0,6718 dari bawah tanpa pernah sampai; «success» hanya berarti toleransi berhenti tercapai.", correct: true },
            { text: "Bukti solver gagal — success = True berarti ada bug", why: "Salah: tidak ada bug — solver bekerja sesuai desain. Yang «gagal» adalah ASUMSI bahwa masalah ini punya solusi." },
            { text: "Solusi yang valid bila leverage 6941 diizinkan broker", why: "Salah: leverage sebesar itu bukan «solusi yang valid» — dan supremum 0,6718 tetap di atas 0,6697, jadi selalu ada portofolio berhingga lain yang lebih baik." },
          ],
        },
        {
          q: "Arah tangency Σ⁻¹(μ − rf·1) = [−2,2448; −1,3644; 0,8814] jumlahnya −2,7279 (net short). Bila arah ini dinormalisasi ke jumlah 1, berapa Sharpe-nya?",
          options: [
            { text: "1,0517 — max Sharpe teoritis, tidak berubah oleh normalisasi", why: "Salah: normalisasi ke jumlah 1 MEMBAGI arah dengan −2,7279 (negatif) — arahnya TERBALIK, dan Sharpe ikut berbalik tanda." },
            { text: "−1,0517 — arahnya terbalik karena jumlahnya negatif", why: "Benar: membagi dengan jumlah negatif (−2,7279) membalik arah; Sharpe 1,0517 menjadi −1,0517. Arah tangency adalah arah, bukan portofolio.", correct: true },
            { text: "0,6718 — supremum max-Sharpe DENGAN kendala Σw = 1", why: "Salah sebagai jawaban soal ini: 0,6718 adalah supremum sepanjang ray zero-cost DENGAN kendala Σw = 1 (Langkah 8) — bukan Sharpe arah tangency yang dinormalisasi ke jumlah 1, yang jawabannya −1,0517. Keduanya berbeda justru karena Sharpe (w'μ − rf)/σ TIDAK homogen terhadap skala bobot — rf-nya tetap, mis. S([0; 0; 1]) = 0,0590 tapi S(2·[0; 0; 1]) = 0,1089 — sehingga kendala jumlah MENGUBAH supremum (dengan Σw = 1: 0,6718; tanpa kendala jumlah: 0,9283, arah Σ⁻¹μ = [−1,9313; −1,2111; 0,9828], net short)." },
            { text: "0,0590 — Sharpe UNVR, karena normalisasi memaksa long-only", why: "Salah: normalisasi ke jumlah 1 TIDAK memaksa long-only — bobot hasil normalisasi tetap ada yang negatif." },
          ],
        },
        {
          q: "Max-Sharpe long-only adalah [0; 0; 1] (100% UNVR), Sharpe 0,0590. Mengapa corner solution ini muncul?",
          options: [
            { text: "Karena UNVR volatilitasnya paling rendah", why: "Salah: UNVR volatilitasnya TERTINGGI (0,5014 vs BBCA 0,3449 dan KLBF 0,4251) — corner ini bukan soal volatilitas." },
            { text: "Karena UNVR satu-satunya aset dengan excess return positif (+0,0296); BBCA −0,2945 dan KLBF −0,3070", why: "Benar: tiap rupiah yang digeser dari UNVR ke BBCA/KLBF menurunkan excess return portofolio sambil menambah volatilitas — tidak ada campuran yang mengalahkan UNVR murni.", correct: true },
            { text: "Karena GMV dan max-Sharpe selalu menghasilkan portofolio yang sama", why: "Salah: GMV long-only [0,5523; 0,2699; 0,1777] jauh berbeda dari max-Sharpe long-only [0; 0; 1] — tujuannya berbeda, jawabannya berbeda." },
            { text: "Karena korelasi ketiga aset nol sehingga diversifikasi mustahil", why: "Salah: korelasinya positif (0,2774–0,3488), bukan nol — dan diversifikasi tetap bekerja untuk GMV (vol 0,2966 < 0,3449)." },
          ],
        },
        {
          q: "Batas w_UNVR ≤ 0,50 [ilustrasi] diterapkan pada masalah long-only. Apa efeknya?",
          options: [
            { text: "Tidak berpengaruh — UNVR memang tidak pernah di corner", why: "Salah: tanpa batas, return maksimum dicapai di 100% UNVR (0,0796) — batas 0,50 langsung memotong titik itu." },
            { text: "Return maksimum jatuh dari 0,0796 menjadi −0,0825 (portofolio [0,5; 0; 0,5]) — kendala yang terlalu ketat menyusutkan frontier", why: "Benar: «harga» batas ini adalah 0,1621 poin return tahunan — contoh konkret bahwa tiap kendala harus dihitung harganya.", correct: true },
            { text: "Return maksimum NAIK karena portofolio menjadi lebih terdiversifikasi", why: "Salah: menambah kendala tidak pernah memperbaiki nilai tujuan — feasible set hanya bisa menyusut, return maksimum hanya bisa turun atau tetap." },
            { text: "Feasible set menjadi kosong sehingga solver gagal", why: "Salah: feasible set masih berisi banyak portofolio (misal [0,5; 0; 0,5]) — kosong hanya bila kendala saling kontradiktif." },
          ],
        },
        {
          q: "Eigenvalue Σ tahunan adalah [0,088937; 0,151142; 0,310986] — yang terkecil 0,0889. Apa artinya?",
          options: [
            { text: "Σ definit positif — semua eigenvalue > 0 (terkecil 0,0889), inversnya aman", why: "Benar: eigenvalue > 0 semua berarti Σ definit positif; condition number 3,5, det(Σ) = 0,004180, Cholesky berhasil — GMV closed-form berdiri di atas Σ yang sehat.", correct: true },
            { text: "Σ singular — inversnya tidak ada", why: "Salah: singular berarti ada eigenvalue = 0 — di sini yang terkecil 0,0889, jauh dari nol; det(Σ) = 0,004180, bukan 0." },
            { text: "Σ hampir singular — condition number-nya di atas 1000", why: "Salah: cond = 0,3110/0,0889 = 3,5 — jauh di bawah ambang waspada 100. Cond di atas 1000 baru muncul di demo korelasi 0,999 (2.087,8), bukan di Σ lesson ini." },
            { text: "Eigenvalue terkecil tidak berarti apa-apa tanpa melihat bobotnya", why: "Salah: eigenvalue terkecil MENENTUKAN stabilitas invers — saat ia → 0, cond meledak dan bobot GMV menjadi liar (demo korelasi 0,999 → cond 2.087,8; gangguan Σ[0,1] +0,001 saja menggeser GMV sejauh L1 0,0042 di Σ yang sehat ini)." },
          ],
        },
        {
          q: "Empat kendala diterapkan pada GMV bebas (vol 0,2966): cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026; kardinalitas ≤ 2 → vol 0,3093; minimum holding 0,10 → vol 0,2966; budget turnover L1 ≤ 0,10 → vol 0,3048. Mana yang paling mahal dan mana yang gratis — dan kenapa?",
          options: [
            { text: "Paling mahal: kardinalitas ≤ 2 (+127bp, vol 0,3093); gratis: minimum holding (+0bp, vol 0,2966) — karena GMV sudah ≥ 0,10 di tiap aset, jadi kendalanya tidak mengikat", why: "Benar: kardinalitas memaksa buang satu aset (terbaik BBCA+KLBF, vol 0,3093); min holding gratis karena bobot GMV terkecil 0,1777 > 0,10 — kendala hanya berharga bila mengikat.", correct: true },
            { text: "Paling mahal: cap BBCA ≤ 0,40 (+60bp); gratis: kardinalitas ≤ 2", why: "Salah arah: cap hanya +60bp — kardinalitas +127bp yang termahal; kardinalitas justru memaksa buang satu aset (pasangan terbaik BBCA+KLBF, vol 0,3093), bukan gratis." },
            { text: "Paling mahal: budget turnover (+82bp); gratis: cap BBCA ≤ 0,40", why: "Salah: turnover +82bp di bawah kardinalitas +127bp; cap MENGIKAT (GMV menaruh 0,5523 di BBCA > 0,40), jadi tidak gratis." },
            { text: "Semua kendala sama mahalnya karena semuanya menyusutkan feasible set", why: "Salah: menyusutkan feasible set tidak sama dengan menaikkan vol — min holding menyusutkan set secara formal tapi vol tetap 0,2966 karena GMV bebas sudah berada di dalamnya." },
          ],
        },
      ],
      summary: [
        "Kendala mengubah masalah: Lagrange mengubah kendala kesetaraan Σw = 1 menjadi «harga» λ — untuk GMV, λ = 2σ²_p (GMV 2 aset: λ = 0,1913).",
        "KKT memperluas Lagrange ke ketidaksamaan w ≥ 0: complementary slackness μ_i·w_i = 0 + active set — aset yang dipegang → μ_i = 0; aset di batas → μ_i boleh > 0.",
        "GMV 2 aset (BBCA + KLBF) [turunan/derived]: w = [0,6565; 0,3435], return −0,2488, vol 0,3093, Sharpe −0,9661; verifikasi KKT: 2Σw = [0,1913; 0,1913].",
        "GMV 3 aset [notebook]: closed-form [0,5518; 0,2698; 0,1785] vs SLSQP [0,5523; 0,2699; 0,1777] — selisih maks 0,0007 (0,0008 dari bobot 4 desimal); return closed-form −0,1900 vs SLSQP −0,1903, vol 0,2966: well-posed.",
        "Max-Sharpe tak-terkendala adalah ILL-POSED [notebook]: SLSQP berhenti di [−3154,7; −3786,1; 6941,9] (Sharpe 0,6697) — artefak titik berhenti, BUKAN solusi; supremum 0,6718 (arah zero-cost [−0,5406; −0,4594; 1,0]) tak pernah dicapai; titik awal berbeda → titik berhenti berbeda.",
        "Max Sharpe teoritis (dengan aset bebas risiko) = 1,0517; arah tangency [−2,2448; −1,3644; 0,8814] jumlah −2,7279 (net short) — dinormalisasi ke jumlah 1, Sharpe-nya −1,0517.",
        "Max-Sharpe long-only [notebook]: corner [0; 0; 1] (100% UNVR), return 0,0796, vol 0,5014, Sharpe 0,0590 — UNVR satu-satunya aset dengan excess return positif (+0,0296).",
        "GMV long-only = GMV tak-terkendala ([0,5523; 0,2699; 0,1777]) — kendala w ≥ 0 tidak mengikat di sana; kendala yang sama bisa gratis di satu masalah dan menentukan di masalah lain.",
        "Validasi numerik [notebook]: eigenvalue Σ tahunan [0,088937; 0,151142; 0,310986] — semua > 0, Σ definit positif; condition number 3,5, det(Σ) = 0,004180, Cholesky berhasil — Σ sehat, invers aman; demo [ilustrasi]: korelasi 0,99 → cond 207,9; korelasi 1,0 → singular.",
        "Harga kendala vs GMV bebas (vol 0,2966): cap BBCA ≤ 0,40 [ilustrasi] → vol 0,3026 (+60bp); kardinalitas ≤ 2 → vol 0,3093 (+127bp, termahal); minimum holding 0,10 → vol 0,2966 (+0bp, tidak mengikat); budget turnover L1 ≤ 0,10 → vol 0,3048 (+82bp).",
        "SLSQP: hampiri tujuan secara kuadratik + linearkan kendala + selesaikan QP kecil, berulang-ulang — generalis yang baik, orakel yang buruk; selalu verifikasi KKT dan jalankan dari dua titik awal.",
        "Jebakan: kendala terlalu ketat menyusutkan frontier — batas w_UNVR ≤ 0,50 [ilustrasi] memotong return maksimum dari 0,0796 menjadi −0,0825; kendala kontradiktif membuat feasible set kosong.",
        "Lab: Lagrange 2 aset [ilustrasi] — w1 = 0,7273, λ = 0,0636, gradien [0,0636; 0,0636]; SLSQP GMV vs closed-form — selisih maks 0,0007, return −0,1903, vol 0,2966.",
      ],
      next: { label: "Lanjut: MLF-M5.3 — Markowitz & Efficient Frontier", href: "/v2/learn/mlf-m53-markowitz-efficient-frontier" },
    },
  ],
};
