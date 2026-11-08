import type { V2Lesson } from "../lib/types";

// Peeking: false positive 5% nominal vs 29% aktual (20x intip).
const PEEK_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Bar chart: false positive nominal 5 persen vs aktual 29 persen saat peeking.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="40" x2="500" y2="40"/><line x1="60" y1="90" x2="500" y2="90"/><line x1="60" y1="140" x2="500" y2="140"/><line x1="60" y1="190" x2="500" y2="190"/>
</g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="54" y="44" text-anchor="end">30%</text><text x="54" y="94" text-anchor="end">20%</text><text x="54" y="144" text-anchor="end">10%</text><text x="54" y="194" text-anchor="end">0%</text>
</g>
<rect x="120" y="178" width="110" height="16" fill="var(--c1)" opacity="0.85"/>
<text x="175" y="170" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">5%</text>
<text x="175" y="212" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">nominal (klaim)</text>
<rect x="310" y="106" width="110" height="88" fill="var(--error)" opacity="0.85"/>
<text x="365" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="var(--error)" font-family="var(--font-ui)">29%</text>
<text x="365" y="212" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">aktual (20x intip)</text>
<text x="270" y="240" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Mengintip tiap hari menaikkan false positive 6x lipat.</text>
</svg>`;

export const biz10: V2Lesson = {
  slug: "biz10-eksperimen",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI10 — Eksperimen & A/B untuk Insight",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kemenangan 8% yang seharusnya tidak dirilis",
      prose: [
        "Tim growth mengumumkan: \u201CVarian B menang 8%! Rilis ke semua user!\u201D Tiga minggu setelah rilis, revenue tidak bergerak. Investigasi menemukan dua dosa: (1) mereka mengintip hasil TIAP HARI dan berhenti saat pertama kali signifikan (peeking); (2) alokasi traffic 60/40, bukan 50/50 (sample ratio mismatch).",
        "Analisis yang benar: lift 10,1% dengan z = 1,59 — TIDAK signifikan pada 95%. Interval kepercayaannya [-0,12%, +1,12%] mencakup nol dan juga mencakup lift 8% yang diklaim. Artinya: data tidak bisa membedakan \u201CB menang\u201D dari \u201Cnoise\u201D.",
        "Twist-nya: eksperimen yang \u201Cmenang\u201D justru menghasilkan keputusan yang salah. Bukan karena ide B buruk — mungkin B memang lebih baik — tapi karena buktinya tidak cukup. Merilis berdasarkan bukti lemah = berjudi dengan brand.",
        "Di lesson ini kamu akan bisa: (1) membaca hasil A/B (lift, z, CI) dengan benar; (2) mendeteksi SRM; (3) menjelaskan bahaya peeking; (4) memilih desain eksperimen sesuai situasi.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjadi juri eksperimen yang tidak bisa dibohongi angka.",
        "(1) Membaca lift, z-score, dan confidence interval sebagai satu kesatuan — tidak pernah lift saja;",
        "(2) Menjalankan uji SRM (chi-square) untuk memvalidasi randomisasi sebelum membaca hasil;",
        "(3) Menjelaskan kenapa peeking tiap hari menggelembungkan false positive dan kapan boleh berhenti;",
        "(4) Menghitung ukuran sampel dari MDE dan menjelaskan kenapa presisi 2x lipat berharga 4x sampel.",
      ],
      tasks: [],
    },

    {
      id: "baca-hasil",
      eyebrow: "Langkah 3 · Membaca hasil",
      title: "Lift, z, CI: tiga angka yang harus dibaca bersamaan",
      prose: [
        "LIFT = (p_treatment - p_control) / p_control: seberapa besar perbaikan relatif. Z = selisih / standard error: seberapa yakin kita itu bukan noise (|z| > 1,96 = signifikan 95%). CI = rentang nilai yang masih konsisten dengan data.",
        "Aturan baca: (1) cek SRM dulu — kalau alokasi rusak, JANGAN baca sisanya; (2) lihat z/CI — signifikan?; (3) baru lihat lift — seberapa besar, dan apakah cukup besar untuk menutup biaya rilis? Lift signifikan tapi 0,1% mungkin tidak worth it.",
        "Empat kuadran: signifikan + besar → rilis. Signifikan + kecil → pertimbangkan biaya. Tidak signifikan + besar → tambah sampel (bukan rilis!). Tidak signifikan + kecil → JANGAN langsung bunuh ide: pakai INTERVAL KEPERCAYAAN (CI) terhadap AMBANG BISNIS — bila CI mencakup efek yang bernilai bisnis, tambah sampel dengan desain yang ditetapkan di awal (tanpa peeking tanpa koreksi — jangan intip hasil lalu tambah sampel berulang tanpa penyesuaian); bila CI sempit dan SELURUHNYA di bawah ambang bisnis, barulah bunuh ide. Dan ingat: 'tidak signifikan' tidak sama dengan 'tidak ada efek' — ia berarti datamu belum cukup untuk membedakan efek dari nol.",
        "Kepribadian: CI adalah \u201Csi jujur\u201D — ia tidak bilang \u201Cmenang/kalah\u201D, ia bilang \u201Cyang masih mungkin adalah rentang ini\u201D. Lebar = belum tahu; mencakup nol = belum terbukti.",
        "💡 Intuisi kunci: \u201Ctidak signifikan\u201D BUKAN \u201Ctidak ada efek\u201D. Itu berarti \u201Cdata belum cukup untuk tahu\u201D. Responsnya tambah sampel atau terima ketidakpastian — bukan rilis diam-diam.",
      ],
      formula: String.raw`z = \frac{p_t - p_c}{\sqrt{\bar{p}(1-\bar{p})\left(\frac{1}{n_t}+\frac{1}{n_c}\right)}} \qquad \chi^2_{SRM} = \sum \frac{(n_i - e_i)^2}{e_i}`,
      formulaNote:
        "z = uji beda dua proporsi: selisih conversion dibagi standard error-nya (p_bar = proporsi gabungan). |z|>1,96 → signifikan 95%. Chi-square SRM: bandingkan alokasi aktual (n_i) vs ekspektasi (e_i = 50/50); > 3,84 → alokasi rusak, eksperimen tidak valid.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: lift besar = pasti menang",
        body: "Lift 10% dengan 100 sampel bisa murni noise; lift 1% dengan 10 juta sampel bisa sangat nyata. Besar efek dan keyakinan adalah dua dimensi berbeda — baca keduanya. Inilah kenapa \u201Cmenang 8%\u201D tanpa z/CI adalah klaim kosong.",
      },
    },
    {
      id: "peeking-srm",
      eyebrow: "Langkah 4 · Peeking & SRM",
      title: "Dua pembunuh senyap: peeking dan SRM",
      prose: [
        "PEEKING: mengintip hasil tiap hari dan berhenti saat signifikan. Masalah: tiap intipan adalah kesempatan false positive. Simulasi 200 eksperimen NULL (tidak ada efek): tanpa peeking, 5% signifikan palsu (sesuai teori). Dengan 20x intip, 29% \u201Cmenang\u201D palsu — 6x lipat!",
        "Solusi: tentukan ukuran sampel dan durasi DI AWAL (power analysis), jangan intip untuk keputusan — intip hanya untuk cek kesehatan (SRM, error teknis). Kalau harus intip, pakai sequential testing yang benar.",
        "SRM (Sample Ratio Mismatch): alokasi 60/40 padahal dirancang 50/50. Chi-square = 400 (jauh di atas 3,84) → randomisasi rusak. Penyebab umum: bot, caching, bug redirect, user tertentu selalu dapat varian sama.",
        "Cara membaca: batang kiri = klaim teori (5% false positive). Batang kanan = realita dengan 20x intip (29%). Jaraknya adalah harga ketidaksabaran.",
        "Interpretasi: peeking mengubah eksperimen dari \u201Cuji hipotesis\u201D menjadi \u201Cmesin konfirmasi\u201D — ia dirancang untuk menemukan kemenangan, bukan kebenaran.",
        "💡 Intuisi kunci: SRM check adalah \u201Ctes kehamilan\u201D eksperimen — murah, cepat, dan jika positif, semua hasil lainnya tidak relevan. Selalu jalankan PERTAMA.",
      ],
      figure: {
        svg: PEEK_SVG,
        alt: "Bar chart false positive: 5 persen nominal vs 29 persen dengan peeking.",
        caption: "Harga ketidaksabaran: 20x intip menaikkan false positive dari 5% menjadi 29%.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: berhenti saat signifikan = efisien",
        body: "Terlihat efisien (hemat sampel), tapi menghancurkan validitas: kamu berhenti tepat saat noise sedang memihakmu. Itu bukan efisiensi — itu seleksi hasil. Efisiensi yang benar = power analysis di awal untuk ukuran sampel minimal.",
      },
    },
    {
      id: "lab-ab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: jadi juri yang tidak bisa dibohongi",
      prose: [
        "Dua hasil eksperimen di mejamu (seed 31). Uji A: 10.000 vs 10.000 user. Uji B: alokasi 6.000 vs 4.000. Tugasmu: (1) hitung `lift`, `z`, `sig_a` untuk Uji A; (2) hitung `chi_srm`, `srm_ok` untuk Uji B; (3) putuskan `keputusan_a` (\u201Crilis\u201D/\u201Ctahan\u201D) dan `keputusan_b` (\u201Cbaca\u201D/\u201Cbuang\u201D), lalu cetak.",
        "Coba juga: naikkan n Uji A menjadi 40.000 per grup (skala z dengan √n). Apakah menjadi signifikan? Itulah gunanya power analysis — tahu SEBELUM mulai berapa sampel yang dibutuhkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lift`, `z`, `sig_a` (Uji A)" },
        { id: "t2", text: "Hitung `chi_srm`, `srm_ok` (Uji B, ambang 3.84)" },
        { id: "t3", text: "Tentukan `keputusan_a`, `keputusan_b`; cetak" },
      ],
      expected: "lift=0.1006 z=1.590 sig=False -> tahan | srm_chi=400.0 -> buang",
      note: {
        title: "Sering salah",
        body: "Memakai standard error dari SATU grup saja. Rumus z untuk beda dua proporsi memakai p gabungan (pooled) dan kedua ukuran sampel. Salah SE = salah z = salah keputusan.",
      },
      hints: [
        "p_pool = (c_c + c_t)/(n_c + n_t); se = sqrt(p_pool*(1-p_pool)*(1/n_c + 1/n_t)); z = (p_t - p_c)/se.",
        "chi_srm = ((6000-5000)^2 + (4000-5000)^2)/5000; srm_ok = chi_srm < 3.84.",
        "keputusan_a = 'rilis' jika sig_a else 'tahan'; keputusan_b = 'baca' jika srm_ok else 'buang'.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(31)\nn_c = n_t = 10000\nc_c = sum(1 for _ in range(n_c) if random.random() < 0.05)\nc_t = sum(1 for _ in range(n_t) if random.random() < 0.054)\n\n# TULIS KODEMU: lift, z, sig_a, chi_srm, srm_ok, keputusan_a, keputusan_b\nlift = 0.0\nz = 0.0\nsig_a = False\nchi_srm = 0.0\nsrm_ok = False\nkeputusan_a = ""\nkeputusan_b = ""\n\nprint(f"Uji A: lift={lift:.4f} z={z:.3f} sig={sig_a} -> {keputusan_a}")\nprint(f"Uji B: srm_chi={chi_srm:.1f} ok={srm_ok} -> {keputusan_b}")`,
        lockLines: 5,
        solution: `import random, math\nrandom.seed(31)\nn_c = n_t = 10000\nc_c = sum(1 for _ in range(n_c) if random.random() < 0.05)\nc_t = sum(1 for _ in range(n_t) if random.random() < 0.054)\n\n# TULIS KODEMU: lift, z, sig_a, chi_srm, srm_ok, keputusan_a, keputusan_b\np_c, p_t = c_c / n_c, c_t / n_t\np_pool = (c_c + c_t) / (n_c + n_t)\nse = math.sqrt(p_pool * (1 - p_pool) * (1/n_c + 1/n_t))\nz = (p_t - p_c) / se\nlift = (p_t - p_c) / p_c\nsig_a = abs(z) > 1.96\nchi_srm = ((6000-5000)**2 + (4000-5000)**2) / 5000\nsrm_ok = chi_srm < 3.84\nkeputusan_a = "rilis" if sig_a else "tahan"\nkeputusan_b = "baca" if srm_ok else "buang"\n\nprint(f"Uji A: lift={lift:.4f} z={z:.3f} sig={sig_a} -> {keputusan_a}")\nprint(f"Uji B: srm_chi={chi_srm:.1f} ok={srm_ok} -> {keputusan_b}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lift", value: 0.1006, tol: 0.002, label: "`lift` = 0.1006", msg: "(p_t - p_c)/p_c." },
          { kind: "equal", task: "t1", name: "z", value: 1.59, tol: 0.02, label: "`z` = 1.59", msg: "Selisih / SE pooled. < 1.96 = tidak signifikan." },
          { kind: "equal", task: "t1", name: "sig_a", value: false, label: "Uji A tidak signifikan", msg: "z < 1.96." },
          { kind: "equal", task: "t2", name: "chi_srm", value: 400.0, tol: 1e-9, label: "`chi_srm` = 400", msg: "((6000-5000)^2+(4000-5000)^2)/5000." },
          { kind: "equal", task: "t3", name: "keputusan_a", value: "tahan", label: "Keputusan A = tahan", msg: "Tidak signifikan → jangan rilis." },
          { kind: "equal", task: "t3", name: "keputusan_b", value: "buang", label: "Keputusan B = buang", msg: "SRM rusak → hasil tidak valid." },
          { kind: "stdout_matches", task: "t3", pattern: "sig=False -> tahan", label: "`print` Uji A benar", msg: "Cek logika keputusan." },
          { kind: "stdout_matches", task: "t3", pattern: "srm_chi=400\\.0 ok=False -> buang", label: "`print` Uji B benar", msg: "Cek logika SRM." },
        ],
      },
      reference: "z = selisih / SE_pooled. SRM: chi-square vs ambang 3.84 (df=1, 95%).",
    },    {
      id: "lab2-ukuran-sampel",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: harga sebuah persen presisi",
      prose: [
        "Mau mendeteksi lift 20% butuh n responden per grup; mau mendeteksi 10% butuh berapa? Intuisi berkata 'dua kali lipat' — matematika berkata 'empat kali lipat'. Tugasmu: implementasikan rumus ukuran sampel dan buktikan sendiri.",
        "Rumus: n = 2·(zα + zβ)² · p(1−p) / δ², dengan δ = p × MDE relatif. Karena δ dikuadratkan di penyebut, memperkecil MDE separuh melipatgandakan sampel empat kali.",
        "Inilah argumen paling ampuh saat stakeholder minta 'MDE sekecil mungkin': tunjukkan tabel n vs MDE dan tanya 'masih mau 5%?'.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `ukuran_sampel(p, mde_rel)` (bulatkan ke atas)" },
        { id: "t2", text: "Hitung `n_20` (MDE 20%) dan `n_10` (MDE 10%)" },
        { id: "t3", text: "Hitung `rasio` = n_10 / n_20 (2 desimal)" },
      ],
      expected: "n_20=3528  n_10=14112  rasio=4.0",
      note: {
        title: "Sering salah",
        body: "Lupa mengkuadratkan (Z_A + Z_B) atau memakai MDE absolut sebagai relatif. δ = p × mde_rel: untuk p=10% dan MDE 20%, δ = 0,02 — bukan 0,20.",
      },
      hints: [
        "delta = p * mde_rel; n = 2*(Z_A+Z_B)**2 * p*(1-p) / delta**2.",
        "Bulatkan ke atas: math.ceil(n) — dan import math di awal (lihat solusi).",
        "rasio ≈ 4: biaya presisi itu kuadratik.",
      ],
      code: {
        starter: `# Konversi baseline 10%. z 95% = 1.96, z power 80% = 0.84.\nZ_A, Z_B, P = 1.96, 0.84, 0.10\n# TULIS KODEMU: n_20, n_10, rasio\nn_20, n_10 = 0, 0\nrasio = 0.0\n`,
        lockLines: 2,
        solution: `# Konversi baseline 10%. z 95% = 1.96, z power 80% = 0.84.\nZ_A, Z_B, P = 1.96, 0.84, 0.10\nimport math\n\n# TULIS KODEMU: ukuran_sampel, n_20, n_10, rasio\ndef ukuran_sampel(p, mde_rel):\n    delta = p * mde_rel\n    n = 2 * (Z_A + Z_B) ** 2 * p * (1 - p) / delta ** 2\n    return math.ceil(n)\n\nn_20 = ukuran_sampel(P, 0.20)\nn_10 = ukuran_sampel(P, 0.10)\nrasio = round(n_10 / n_20, 2)\n\nprint(f"n_20={n_20}  n_10={n_10}  rasio={rasio}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "n_20", value: 3528, label: "`n_20` = 3528", msg: "Sampel per grup untuk MDE 20%." },
          { kind: "equal", task: "t2", name: "n_10", value: 14112, label: "`n_10` = 14112", msg: "Sampel per grup untuk MDE 10%." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio=4\\.0", label: "`rasio` = 4,0", msg: "Pajak kuadratik presisi." },
        ],
      },
      reference: "Rumus ukuran sampel proporsi: n = 2(zα+zβ)²p(1−p)/δ².",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Urutan baca hasil A/B tidak bisa ditawar: SRM dulu (valid?), lalu signifikansi (yakin?), baru lift (seberapa besar?). Membaca lift sebelum SRM seperti membaca nilai ujian sebelum memastikan soalnya tidak bocor.",
        "💡 Peeking itu candu karena 'hampir signifikan' terasa seperti 'sebentar lagi menang'. Tetapkan aturan berhenti SEBELUM eksperimen jalan — saat godaan datang, aturannya yang memutuskan, bukan kamu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tetapkan harga kemenangan sebelum bertanding",
        body: "Sebelum eksperimen dijalankan, tulis satu angka yang jarang ditulis: berapa lift MINIMUM yang membuat kemenangan ini layak dirilis. Bukan \"signifikan secara statistik\" — melainkan \"signifikan secara bisnis\". Fitur yang butuh Rp200 juta untuk dibangun dan dirawat setahun, lalu \"menang\" dengan lift +0,4% yang signifikan secara statistik, adalah kemenangan yang merugikan: kamu membayar Rp200 juta untuk sesuatu yang tidak menutup biayanya. Heuristik praktisinya: hitung break-even lift dari biaya implementasi + maintenance + kompleksitas, tetapkan sebagai ambang rilis SEBELUM data masuk, dan tulis di dokumen eksperimen. Hasil di bawah ambang = tidak rilis, seberapa pun kecil p-value-nya. Aturan keduanya: daftarkan juga guardrail metrics — metrik yang tidak boleh rusak (retensi, refund rate, beban CS). Kemenangan yang menaikkan conversion 3% sambil menaikkan refund 5% bukan kemenangan. Jebakan yang paling mahal adalah \"menang statistik, kalah bisnis\": tim merayakan p<0,05, fitur dirilis, enam bulan kemudian tidak ada yang bisa menjelaskan kenapa revenue tidak bergerak. Maka urutan baca yang lengkap: valid dulu (apakah eksperimennya sah), lalu ambang bisnis (apakah lift-nya cukup membayar biayanya), lalu guardrail (apakah ada yang rusak) — signifikansi statistik hanyalah tiket masuk, bukan vonis. Eksperimen tanpa harga kemenangan yang ditulis di awal adalah undian berhadiah p-value.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: desain eksperimen per situasi",
      prose: [
        "Skenario 1 — Traffic besar, perubahan UI kecil. → A/B klasik 50/50, durasi 1-2 minggu penuh (cakup siklus mingguan). Power analysis di awal.",
        "Skenario 2 — Traffic kecil, efek diharapkan besar. → A/B dengan durasi panjang ATAU sequential testing yang benar. Jangan paksakan signifikansi dari sampel kecil.",
        "Skenario 3 — Tidak bisa randomisasi user (harga, kebijakan). → Quasi-experiment: difference-in-differences, geo-experiment, atau switchback. Akui asumsi paralel-trennya.",
        "Skenario 4 — Ingin belajar cepat banyak ide. → Bandit/experimentasi berurutan untuk eksplorasi; A/B ketat untuk keputusan rilis. Bedakan \u201Cbelajar\u201D vs \u201Cmemutuskan\u201D.",
        "Skenario 5 — Stakeholder menuntut hasil \u201Ccepat\u201D. → Tawarkan guardrail metrics + durasi minimal yang disepakati di awal. Lebih baik menolak eksperimen buruk daripada merilis kebohongan.",
        "Aturan praktis 10 detik: sebelum mulai, tulis di satu kartu: hipotesis, metrik utama, guardrail, ukuran sampel, durasi, kriteria rilis. Tidak ada kartu → tidak ada eksperimen.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: uji gratis ongkir",
      prose: [
        "E-commerce ingin menguji \u201Cgratis ongkir min. belanja Rp150rb\u201D. Desain: 50.000 user per grup, 2 minggu. Hasil: conversion 4,1% → 4,6% (lift 12,2%), z = 3,8 (signifikan), SRM chi = 1,2 (OK). Kelihatannya menang telak.",
        "Tapi guardrail metrics: avg order value turun Rp210rb → Rp165rb (-21,4%) — user memecah belanja agar pas ambang. Margin per order turun Rp18rb. Net: revenue naik 12%, laba turun 8%.",
        "Keputusan: JANGAN rilis versi ini. Kemenangan conversion adalah Goodhart (BI5) — user mengoptimasi ambang, bukan belanja. Redesain: ambang Rp200rb + ongkir parsial; uji ulang dengan guardrail margin sebagai co-primary.",
        "💡 Intuisi kunci: eksperimen tanpa guardrail metrics seperti mobil tanpa rem (lagi). Setiap uji A/B wajib punya 1 metrik utama + 2-3 guardrail yang bisa memveto kemenangan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang eksperimen. Ingat: SRM dulu, baru baca hasil.",
      ],
      tasks: [],
      summary: [
        "Baca tiga angka bersamaan: lift (besar), z/CI (yakin), SRM (valid).",
        "Tidak signifikan ≠ tidak ada efek — tambah sampel, jangan rilis diam-diam.",
        "Peeking menaikkan false positive 6x — tentukan sampel & durasi di awal.",
        "SRM rusak → buang hasil, jangan diinterpretasi.",
        "Tiap eksperimen: 1 metrik utama + guardrail yang bisa memveto.",
      ],
      next: { label: "BI11 — Governance: Satu Definisi Metrik", href: "/v2/learn/biz11-governance" },
      quiz: [
        {
          q: "Lift 10%, z=1,59, CI mencakup nol. Keputusan?",
          options: [
            { text: "Rilis — lift-nya besar", why: "Lift 10% memang menggiurkan, tetapi z=1,59 berarti peluang hasil ini muncul dari noise masih ~11% — jauh di atas ambang 5%. CI yang mencakup nol mengonfirmasi: efek sebenarnya bisa nol atau negatif. Keputusan tanpa bukti = judi berkedok data." },
            { text: "Tahan — belum signifikan; tambah sampel atau terima ketidakpastian", why: "Tepat: tiga angka harus dibaca bersamaan — lift bilang 'seberapa besar', z bilang 'seberapa yakin', CI bilang 'rentang kemungkinannya'. Di sini keyakinan (z=1,59 < 1,96) dan rentang (mencakup nol) sama-sama menolak klaim kemenangan. Tahan rilis, tambah sampel.", correct: true },
            { text: "Rilis ke 10% user saja", why: "Rilis parsial ke 10% pengguna tanpa signifikansi bukan kompromi bijak — ia eksperimen baru tanpa desain: tanpa ukuran sampel yang dihitung, tanpa aturan berhenti. Kamu hanya memindahkan ketidakpastian ke produksi sambil mengklaim 'bertahap'." },
            { text: "Ulangi sampai signifikan", why: "Menunggu hingga 'kelihatan menang' lalu berhenti = peeking dengan langkah kaki. Setiap pengecekan informal adalah kesempatan tambahan bagi noise untuk terlihat signifikan — simulasi di lesson ini menunjukkan inflasi false positive hingga 6x. Aturan berhenti ditetapkan di awal, bukan saat godaan datang." },
          ],
        },
        {
          q: "SRM chi-square = 400 (ambang 3,84). Artinya?",
          options: [
            { text: "Eksperimen sangat signifikan", why: "SRM (Sample Ratio Mismatch) tidak menguji apakah treatment berpengaruh; ia menguji apakah alokasi 50/50 benar-benar terjadi. Chi-square 400 vs ambang 3,84 = randomisasi rusak total (mis. bot, bug bucketing). Hasil dari eksperimen ini tidak bisa diinterpretasi — bukan 'efeknya nol', melainkan 'ujinya tidak sah'." },
            { text: "Randomisasi rusak — hasil tidak valid, buang", why: "Tepat: chi-square 400 berarti alokasi aktual jauh dari 50/50 yang dirancang — contohnya 60/40 karena bug assignment. Ini bukan sekadar 'tidak seimbang sedikit'; ini bukti mekanisme randomisasi bocor, sehingga grup kontrol dan treatment tidak lagi comparable. Perbaiki plumbing, ulangi eksperimen.", correct: true },
            { text: "Perlu sampel lebih besar", why: "Ukuran sampel besar justru memperparah: chi-square tumbuh dengan n, jadi 400 pada sampel besar = penyimpangan alokasi yang nyata dan sistematis, bukan fluktuasi. Jangan 'tambah sampel' untuk memperbaiki SRM — selidiki kenapa alokasinya meleset." },
            { text: "Abaikan, fokus ke lift", why: "Eksperimen berdiri di atas asumsi 'satu-satunya perbedaan antar grup adalah treatment'. SRM menghancurkan asumsi itu: grup-grup terbentuk secara bias (mis. semua pengguna iOS masuk treatment). Angka lift-nya mungkin benar secara aritmetika, tetapi tidak menjawab pertanyaan kausal apa pun." },
          ],
        },
        {
          q: "Kenapa peeking tiap hari berbahaya?",
          options: [
            { text: "Membuang waktu", why: "Kecepatan memang bukan masalah — masalahnya adalah peluang. Setiap kali kamu mengintip dan memutuskan 'lanjut/berhenti', kamu memberi noise satu kesempatan lagi untuk melewati ambang. Peeking harian selama 14 hari ≈ 14 uji, dan false positive terakumulasi jauh di atas 5% yang diklaim." },
            { text: "Tiap intipan = kesempatan false positive; 20x intip → 29% kemenangan palsu", why: "Tepat: simulasi Monte Carlo di lesson ini menunjukkan peeking harian menggelembungkan false positive dari 5% menjadi ~30% (6x). Intuisinya: 'hampir signifikan' bukan 'sebentar lagi menang' — ia adalah noise yang diberi 14 kesempatan. Solusinya: aturan berhenti tetap di awal, atau metode sequential testing yang sah.", correct: true },
            { text: "Membuat server lambat", why: "Justru sangat relevan dengan cara yang berlawanan: peeking tidak membuat eksperimen 'lebih cepat selesai' — ia membuat eksperimen selesai dengan jawaban yang salah. Kecepatan tanpa validitas = tiba lebih cepat di kesimpulan yang keliru." },
            { text: "Dilarang undang-undang", why: "Menghentikan eksperimen lebih awal karena 'sudah kelihatan' tidak menghemat apa pun: estimasi lift dari eksperimen yang dihentikan dini bias ke atas (hanya yang 'beruntung' yang berhenti cepat). Kamu menghemat waktu dan membayar dengan keputusan yang salah." },
          ],
        },
        {
          q: "Urutan baca hasil A/B yang benar?",
          options: [
            { text: "Lift → z → SRM", why: "Urutan baca tidak bisa ditawar: (1) SRM — apakah randomisasinya sah? (2) signifikansi — apakah efeknya nyata? (3) lift — seberapa besar? Membaca lift sebelum SRM seperti membaca nilai ujian sebelum memastikan soalnya tidak bocor: angkanya ada, maknanya tidak." },
            { text: "SRM → z/CI → lift", why: "Tepat: validitas (SRM) → keyakinan (z, CI) → besaran (lift). Tiap tahap adalah gerbang: gagal di SRM = berhenti total; gagal signifikansi = belum boleh klaim; lolos keduanya = lift boleh dibaca sebagai estimasi efek. Urutan ini melindungi dari tiga jenis kesalahan yang berbeda.", correct: true },
            { text: "z → lift → SRM", why: "Inilah jebakan 'lift dulu': angka 10% terasa konkret dan menggoda, sehingga langkah validasi terasa seperti birokrasi. Padahal tanpa SRM, kamu tidak tahu apakah 10% itu efek treatment atau efek bug alokasi — dua hal yang tindak lanjutnya berlawanan arah." },
            { text: "Langsung keputusan bisnis", why: "Langsung ke keputusan = melewati SRM (apakah ujinya sah?), signifikansi (apakah efeknya nyata?), dan CI (seberapa lebar ketidakpastiannya?). Tiga lapis pertahanan dilewati sekaligus — keputusan yang dihasilkan tidak lebih baik dari firasat." },
          ],
        },
        {
          q: "Uji gratis ongkir: conversion menang, margin anjlok. Ini contoh…",
          options: [
            { text: "Eksperimen gagal total", why: "Eksperimennya berhasil memberi informasi — keputusannya yang harus \u201Cjangan rilis\u201D." },
            { text: "Guardrail memveto kemenangan semu (Goodhart pada ambang)", why: "Tepat: ini Goodhart dalam eksperimen — user memecah belanja agar pas ambang, conversion naik tetapi margin per order anjlok. Eksperimennya 'berhasil' mengukur, tetapi metriknya dioptimasi oleh perilaku. Pelajarannya: sertakan counter-metric (margin) SEBELUM eksperimen jalan, bukan setelah kaget.", correct: true },
            { text: "SRM", why: "Chi-square SRM 1,2 < 3,84 berarti randomisasi sah — validitas bukan masalah di sini. Masalahnya ada di desain metrik: conversion naik + margin anjlok = kemenangan semu. Jangan menyalahkan plumbing saat yang bocor adalah definisi suksesnya." },
            { text: "Peeking", why: "Benar, peeking bukan masalah di sini — dan justru itu poinnya: eksperimen bisa valid secara statistik (tidak peeking, tidak SRM) tetapi gagal secara bisnis karena metriknya tidak selaras dengan tujuan. Validitas statistik ≠ keputusan yang benar." },
          ],
        },
        {
          q: "Eksperimen butuh MDE 10% alih-alih 20%. Dampak ke ukuran sampel dan durasi?",
          options: [
            { text: "Sampel 2x, durasi 2x", why: "Salah arah intuisi: karena δ dikuadratkan di penyebut, sampel menjadi 4x — bukan 2x. Inilah 'pajak kuadratik' presisi." },
            { text: "Sampel ~4x, durasi ~4x (traffic tetap)", why: "Tepat: n ∝ 1/δ². Memperkecil MDE separuh = 4x sampel. Keputusan MDE adalah keputusan budget dan waktu, bukan sekadar 'maunya presisi'.", correct: true },
            { text: "Tidak berubah — MDE hanya soal analisis", why: "MDE menentukan n sebelum eksperimen jalan; mengecilkan MDE setelah jalan = peeking dengan topeng." },
            { text: "Sampel tetap, tinggal perpanjang analisis", why: "Sampel ditentukan di desain. 'Analisis lebih lama' tidak menciptakan responden baru." },
          ],
        },
      ],
    },
  ],
};
