import type { V2Lesson } from "../lib/types";

// ── Figure: scatter SNP-exposure vs SNP-outcome + garis IVW & MR-Egger ────
const MR_SCATTER_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Scatter plot lima SNP: empat titik di garis IVW, satu outlier pleiotropik di atas">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="56" y1="216" x2="500" y2="216"/>
<line x1="56" y1="166" x2="500" y2="166"/><line x1="56" y1="116" x2="500" y2="116"/>
<line x1="56" y1="66" x2="500" y2="66"/><line x1="56" y1="16" x2="500" y2="16"/>
</g>
<line x1="56" y1="206" x2="480" y2="118" stroke="var(--c1)" stroke-width="2.5"/>
<text x="476" y="110" text-anchor="end" font-size="11" fill="var(--c1)" font-family="var(--font-ui)">IVW (slope 0,51)</text>
<line x1="56" y1="150" x2="480" y2="128" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="476" y="146" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">MR-Egger (intercept 0,085)</text>
<g>
<circle cx="188" cy="188" r="6" fill="var(--c1)"/>
<circle cx="156" cy="194" r="6" fill="var(--c1)"/>
<circle cx="252" cy="174" r="6" fill="var(--c1)"/>
<circle cx="124" cy="200" r="6" fill="var(--c1)"/>
<circle cx="156" cy="66" r="7" fill="var(--c2)" stroke="var(--text)" stroke-width="1.5"/>
<text x="170" y="60" font-size="11" fill="var(--text)" font-family="var(--font-ui)">SNP5 (pleiotropik)</text>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="280" y="238">asosiasi SNP–exposure (beta_ZX)</text>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="16" y="120" transform="rotate(-90 16 120)" text-anchor="middle">asosiasi SNP–outcome (beta_ZY)</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="252">data sintetis</text>
</g>
</svg>`;

export const hd24: V2Lesson = {
  slug: "hd24-mendelian-randomization",
  track: "Health Data Science",
  module: "Genetika & Kausalitas",
  title: "Mendelian Randomization: Kausalitas dari Lotre Genetik",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Uji klinis yang sudah dijalankan alam",
      prose: [
        "Selama puluhan tahun, studi observasional menunjukkan orang dengan kolesterol LDL tinggi lebih sering terkena penyakit jantung koroner. Tapi korelasi bukan kausalitas: orang dengan LDL tinggi juga cenderung punya pola makan, olahraga, dan status sosial-ekonomi yang berbeda. Untuk membuktikan LDL benar-benar MENYEBABKAN penyakit jantung, industri farmasi menghabiskan miliaran dolar dan belasan tahun menjalankan uji klinis statin. Hasilnya memang positif — tapi pertanyaannya: bisakah kita tahu lebih cepat, lebih murah, tanpa menunggu 10 tahun?",
        "Twist-nya: jawabannya sudah ada di dalam DNA setiap orang. Saat pembuahan, varian genetik yang menaikkan atau menurunkan LDL dibagikan secara acak — seperti lotre. Orang yang “menang lotre” varian penurun LDL hidup puluhan tahun dengan LDL sedikit lebih rendah, tanpa bisa memilih gaya hidup berbeda karena gennya. Para peneliti menyadari: ini adalah uji klinis yang sudah dijalankan alam. Dengan membandingkan orang berdasarkan lotre genetiknya — bukan berdasarkan LDL yang mereka pilih lewat gaya hidup — mereka mengonfirmasi efek kausal LDL terhadap penyakit jantung hanya dari data observasional yang sudah ada. Teknik ini bernama Mendelian randomization (MR).",
        "Dan MR juga bisa berkata TIDAK — yang sama berharganya. C-reactive protein (CRP) adalah penanda inflamasi yang secara observasional sangat kuat memprediksi penyakit jantung; banyak yang mengira menurunkannya akan mencegah serangan jantung. MR menunjukkan: varian genetik yang menaikkan CRP seumur hidup TIDAK menaikkan risiko penyakit jantung. CRP hanyalah penumpang, bukan sopir. Satu analisis MR menghemat industri dari pengembangan obat penurun CRP yang pasti gagal. Di lesson ini kamu belajar cara kerja lotre genetik ini — tiga asumsinya, estimator Wald, two-sample MR, IVW, dan MR-Egger sebagai pendeteksi kecurangan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa analis kesehatan wajib paham MR",
        type: "risk",
        body: "Setiap minggu ada klaim “X menyebabkan Y” dari studi observasional — kopi, vitamin D, mikrobioma. MR adalah alat tercepat untuk menyaring mana yang kausal sebelum organisasi menginvestasikan sumber daya. Analis yang tidak paham MR akan merekomendasikan intervensi berbasis korelasi; analis yang paham bisa berkata “tunggu — uji lotre genetiknya dulu”.",
      },
      reference: "MR = memanfaatkan pengacakan genetik saat pembuahan sebagai instrumental variable untuk inferensi kausal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga asumsi instrumental variable — relevansi, independensi, exclusion restriction — dengan contoh pelanggaran konkret untuk tiap asumsi; (2) menghitung estimator Wald dari ringkasan statistik GWAS dan menjelaskan arti tiap simbol; (3) menjalankan two-sample MR: menggabungkan beberapa SNP dengan inverse-variance weighting (IVW) dan menguji pleiotropi dengan intercept MR-Egger; (4) memutuskan kapan hasil MR bisa dipercaya dan kapan harus ditolak, memakai kerangka bukti berlapis.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep (lotre genetik + 3 asumsi, two-sample MR + IVW, MR-Egger + pleiotropi) → lab Pyodide (MR dari nol dengan 5 SNP) → scatter plot dengan panduan baca → peta keputusan → mini-case CRP → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, kausalitas observasional: dalam data non-eksperimen, asosiasi antara paparan dan outcome bisa lahir dari tiga sumber — efek kausal sungguhan, confounding (variabel ketiga memengaruhi keduanya), atau kausalitas terbalik. Teknik seperti propensity score matching mencoba menyeimbangkan confounder yang TERUKUR — tetapi confounder yang tidak terukur tetap menjadi ancaman. MR menyerang masalah ini dari arah berbeda: memakai varian genetik sebagai instrumental variable yang “diacak alam”. Kedua, GWAS: genome-wide association study memindai jutaan SNP (varian satu huruf DNA) dan melaporkan, untuk tiap SNP, koefisien efek beta — seberapa besar tiap alel tambahan menggeser suatu sifat — beserta standard error-nya. Ringkasan statistik inilah bahan bakar two-sample MR.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: MR tidak butuh data genetik individu. Ia hanya butuh dua tabel ringkasan: “SNP → paparan” dari satu GWAS dan “SNP → outcome” dari GWAS lain. Itulah kenapa disebut two-sample — dan kenapa ia murah.",
      ],
      reference: "Bekal: (1) confounding tak terukur = batas teknik observasional biasa; (2) GWAS → tabel beta per SNP = bahan bakar MR.",
    },
    {
      id: "konsep-lotre",
      eyebrow: "Langkah 3 · Konsep",
      title: "Lotre genetik dan tiga syarat wasit",
      prose: [
        "Definisi: Mendelian randomization memakai varian genetik (biasanya SNP) sebagai instrumental variable (IV) untuk mengestimasi efek kausal paparan terhadap outcome. Logikanya: alel yang kamu terima saat pembuahan diacak (hukum Mendel) — independen dari gaya hidup, pola makan, dan status sosial yang biasanya mengacaukan studi observasional. Jika SNP yang menaikkan LDL juga menaikkan risiko penyakit jantung secara proporsional, maka LDL-lah yang kausal — karena SNP tidak bisa “memilih” gaya hidup pemiliknya.",
        "Kepribadiannya: bayangkan tiga wasit yang harus setuju sebelum lotre dinyatakan sah. Wasit 1 — Relevansi: SNP harus benar-benar berhubungan dengan paparan (diukur dengan F-statistic; di bawah 10 = instrumen lemah, dilarang). Wasit 2 — Independensi: SNP tidak boleh berhubungan dengan confounder (misalnya, SNP yang juga terkait perilaku merokok). Wasit 3 — Exclusion restriction: SNP hanya boleh memengaruhi outcome MELALUI paparan yang diteliti — tidak lewat jalur lain. Pelanggaran wasit 3 disebut pleiotropi horizontal: SNP yang memengaruhi penyakit jantung lewat jalur inflamasi, bukan lewat LDL, adalah instrumen curang.",
        "Kapan memakai: MR bersinar ketika RCT tidak mungkin (butuh 20 tahun follow-up), tidak etis (paparan berbahaya), atau terlalu mahal — dan ketika tersedia GWAS besar untuk paparan maupun outcome. Ia tidak menggantikan RCT; ia memprioritaskan hipotesis mana yang layak diuji RCT.",
      ],
      formula: String.raw`\hat{\beta}_{XY} = \frac{\hat{\beta}_{ZY}}{\hat{\beta}_{ZX}}`,
      formulaNote: "β̂_ZX (dibaca “beta Z-X”) = efek SNP terhadap paparan, dari GWAS paparan — mis. tiap alel menaikkan LDL 0,30 mmol/L. β̂_ZY = efek SNP yang SAMA terhadap outcome, dari GWAS outcome — mis. tiap alel menaikkan log-odds penyakit jantung 0,12. β̂_XY = estimasi efek kausal paparan terhadap outcome — 0,12/0,30 = 0,40: tiap kenaikan LDL 1 mmol/L menaikkan log-odds penyakit jantung sebesar 0,40. Ini disebut estimator Wald: “seberapa besar SNP menggeser outcome, dibagi seberapa besar SNP menggeser paparan”. Interpretasi: efek kausal per unit paparan yang diprediksi secara genetik.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Gen diacak saat pembuahan, jadi MR = RCT yang sempurna”",
        type: "pitfall",
        body: "Yang benar: pengacakan Mendel tidak sesempurna pengacakan RCT. Stratifikasi populasi (SNP dan penyakit sama-sama lebih umum di satu subpopulasi), assortative mating (orang cenderung berpasangan dengan yang mirip), dan dynastic effects (gen orang tua memengaruhi lingkungan anak) semuanya bisa melanggar independensi. Ditambah pleiotropi yang melanggar exclusion restriction. MR adalah “RCT-nya alam” — dengan tanda kutip yang wajib diuji, bukan diimani.",
      },
      hints: [
        "💡 Intuisi: tiga asumsi itu hierarkis dalam keterujiannya — relevansi BISA diuji langsung (F > 10), dua lainnya TIDAK BISA dibuktikan dan hanya bisa diuji secara tidak langsung (itulah gunanya MR-Egger dan analisis sensitivitas di langkah 5).",
      ],
      reference: "Wald = β_ZY / β_ZX. Tiga wasit: relevansi (F>10), independensi, exclusion restriction.",
    },
    {
      id: "konsep-twosample",
      eyebrow: "Langkah 4 · Konsep",
      title: "Two-sample MR — dua tabel, satu jawaban",
      prose: [
        "Definisi: two-sample MR mengambil β_ZX dari satu GWAS (sampel 1, mis. 400.000 orang dengan data LDL) dan β_ZY dari GWAS lain yang independen (sampel 2, mis. 200.000 orang dengan data penyakit jantung). Kedua sampel harus berasal dari populasi yang sama secara underlying (biasanya ancestry yang sama) dan tidak tumpang tindih — kalau tumpang tindih, biasnya mengarah ke estimasi observasional yang justru ingin dihindari. Dengan satu SNP kita dapat satu estimator Wald; dengan 50 SNP kita dapat 50 estimasi yang digabung lewat inverse-variance weighting (IVW).",
        "Kepribadiannya: IVW adalah rapat dewan 50 SNP — tiap SNP memberi estimasi Wald-nya sendiri, lalu voting dibobot oleh presisi (SNP dengan standard error kecil suaranya lebih berat). Rumus bobotnya w = β_ZX²/se_ZY²: SNP yang kuat memengaruhi paparan DAN presisi outcome-nya tinggi mendapat bobot terbesar. IVW adalah metode utama default: paling efisien secara statistik — TETAPI hanya valid jika semua instrumen valid (atau pleiotropinya seimbang, saling meniadakan). Satu SNP curang yang pleiotropik bisa menarik seluruh rata-rata.",
        "Kapan memakai: IVW selalu dilaporkan sebagai estimasi utama dalam two-sample MR. Ia menjadi fondasi; metode-metode robust (langkah 5) menjadi pemeriksanya. Aturan praktis: mean F-statistic seluruh instrumen harus di atas 10 — di bawah itu, instrumen lemah membuat estimasi bias ke arah nol (pada two-sample tanpa overlap) dan seluruh analisis tidak bisa dipercaya.",
      ],
      formula: String.raw`\hat{\beta}_{IVW} = \frac{\sum_k w_k \, \hat{\beta}_{XY,k}}{\sum_k w_k} \qquad w_k = \frac{\hat{\beta}_{ZX,k}^2}{\text{se}(\hat{\beta}_{ZY,k})^2}`,
      formulaNote: "β̂_XY,k = estimator Wald SNP ke-k (β_ZY,k / β_ZX,k); w_k = bobot SNP ke-k — kuadrat efek terhadap paparan dibagi kuadrat standard error efek terhadap outcome. Contoh 3 SNP: Wald = 0,40; 0,42; 0,38 dengan bobot 100, 70, 90 → IVW = (100×0,40 + 70×0,42 + 90×0,38)/260 = 103,6/260 ≈ 0,398. Interpretasi: gabungan bukti 3 instrumen menunjuk efek kausal ≈ 0,40 per unit paparan — nyaris identik karena ketiganya konsisten. Ketika Wald antar-SNP menyebar liar, itu bukan “variasi alami” — itu alarm heterogenitas yang harus diselidiki.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Makin banyak SNP sebagai instrumen, makin bagus”",
        type: "pitfall",
        body: "Yang benar: tiap SNP tambahan adalah peluang tambahan memasukkan instrumen curang (pleiotropik). SNP yang diambil hanya karena “signifikan di GWAS” tanpa pemahaman biologis adalah kandidat pleiotropi. Kualitas mengalahkan kuantitas: 10 SNP dengan jalur biologis jelas mengalahkan 100 SNP misterius. Selalu sertai uji heterogenitas (Cochran’s Q): jika estimasi antar-SNP lebih menyebar dari yang bisa dijelaskan kebetulan, sebagian instrumen patut dicurigai.",
      },
      hints: [
        "💡 Intuisi: IVW itu seperti rata-rata nilai ujian kelas — satu murid yang mencontek (pleiotropi) dan nilainya ekstrem bisa mengangkat rata-rata kelas. MR-Egger adalah pengawas ujiannya.",
      ],
      reference: "IVW = rata-rata Wald berbobot presisi. Syarat: instrumen valid, F > 10, sampel tak tumpang tindih.",
    },
    {
      id: "konsep-egger",
      eyebrow: "Langkah 5 · Konsep",
      title: "MR-Egger — pengawas yang mengizinkan kecurangan",
      prose: [
        "Definisi: MR-Egger adalah regresi β_ZY terhadap β_ZX lintas SNP — tetapi dengan INTERCEPT yang dibebaskan (tidak dipaksa lewat titik nol). Persamaannya: β_ZY = α + θ·β_ZX. Di sini θ adalah estimasi efek kausal, dan α — intercept-nya — adalah rata-rata efek pleiotropik langsung SNP terhadap outcome. Jika α ≠ 0 secara signifikan, berarti ada pleiotropi directional (kecurangan yang sistematis ke satu arah) dan estimasi IVW bias. Ini satu-satunya metode MR yang sekaligus memberi estimasi kausal DAN tes pleiotropi.",
        "Kepribadiannya: MR-Egger adalah pengawas ujian yang berkata “saya tahu sebagian dari kalian mencontek — silakan, asal pola contekannya tidak berhubungan dengan kepintaran kalian”. Syarat formalnya disebut InSIDE (Instrument Strength Independent of Direct Effect): besarnya efek pleiotropik tidak boleh berkorelasi dengan kekuatan instrumen. Harganya: MR-Egger jauh kurang efisien (butuh lebih banyak SNP untuk presisi yang sama) dan sensitif terhadap outlier. Karena itu ia adalah pemeriksa, bukan pengganti IVW.",
        "Kapan memakai: selalu laporkan berdampingan dengan IVW, plus weighted median (tetap konsisten walau hingga 50% instrumen invalid — asumsi “mayoritas valid”). Kerangka bukti yang dipakai jurnal-jurnal top: bukti KUAT = IVW signifikan + arah konsisten di semua metode + tidak ada heterogenitas berarti (Q p > 0,05) + intercept Egger ≈ 0 + arah Steiger benar + robust terhadap leave-one-out + F > 10. Gagal di satu saja = turunkan klaim menjadi “sugestif” atau “inkonklusif”.",
      ],
      formula: String.raw`\hat{\beta}_{ZY} = \alpha + \theta \, \hat{\beta}_{ZX} \qquad H_0: \alpha = 0`,
      formulaNote: "α (alpha) = intercept: rata-rata efek langsung (pleiotropik) SNP terhadap outcome di luar jalur paparan. θ (theta) = slope: estimasi efek kausal. H_0: α = 0 adalah hipotesis “tidak ada pleiotropi directional”. Contoh: regresi 5 SNP menghasilkan α = 0,085 dengan p < 0,05 → tolak H_0 → ada pleiotropi directional → estimasi IVW tidak bisa dipercaya mentah-mentah; selidiki SNP mana yang menyimpang (leave-one-out) dan pertimbangkan θ dari Egger atau weighted median — dengan catatan keduanya punya asumsi sendiri.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “MR-Egger memperbaiki semua masalah pleiotropi”",
        type: "pitfall",
        body: "Yang benar: MR-Egger menukar satu asumsi tak teruji (tidak ada pleiotropi) dengan asumsi tak teruji lainnya (InSIDE). Jika pleiotropi berkorelasi dengan kekuatan instrumen — misalnya SNP terkuat justru yang paling pleiotropik — maka slope Egger pun bias. Tidak ada metode MR yang “membersihkan” data kotor; yang ada hanya metode dengan asumsi berbeda yang hasilnya harus dibandingkan.",
      },
      hints: [
        "💡 Intuisi: baca scatter plot β_ZX vs β_ZY sebelum percaya angka apa pun. Titik-titik yang mengelompok di satu garis = instrumen akur; satu titik yang melenceng jauh = kandidat pleiotropik yang harus diinvestigasi secara biologis, bukan sekadar dibuang diam-diam.",
        "💡 Intuisi kedua: pleiotropi VERTIKAL (SNP → paparan → outcome → outcome kedua) tidak melanggar apa pun — itu justru jalur kausal yang kita ukur. Yang dilarang hanya pleiotropi HORIZONTAL (SNP → outcome lewat jalur lain).",
      ],
      reference: "Egger: intercept ≠ 0 = pleiotropi directional. Selalu bandingkan IVW vs Egger vs median.",
    },
    {
      id: "lab-mr",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — MR dari nol dengan 5 SNP",
      prose: [
        "Waktunya menjalankan lotre. Di bawah ada ringkasan statistik GWAS sintetis (diberi label jelas — pola meniru data nyata, angkanya dibuat untuk latihan): lima SNP dengan efek terhadap paparan (beta_zx), efek terhadap outcome (beta_zy), dan standard error-nya. Empat SNP konsisten; satu SNP mencurigakan. Tugasmu: hitung rasio Wald tiap SNP, gabungkan dengan IVW, uji pleiotropi lewat intercept MR-Egger (regresi OLS sederhana beta_zy terhadap beta_zx), lalu lakukan leave-one-out dengan membuang SNP yang mencurigakan.",
        "Coba: setelah lolos, ubah beta_zy SNP5 dari 0,25 menjadi 0,10 (seolah ia valid). Bagaimana intercept Egger dan IVW berubah? Itulah bedanya dunia dengan dan tanpa pleiotropi directional — dan kenapa satu SNP bisa meracuni seluruh analisis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `wald_ratios`: list beta_zy[i]/beta_zx[i] untuk tiap SNP" },
        { id: "t2", text: "Lengkapi `ivw(bx, by, se)`: rata-rata Wald berbobot w = bx^2/se^2" },
        { id: "t3", text: "Lengkapi `egger_intercept(bx, by)`: intercept regresi OLS by terhadap bx" },
        { id: "t4", text: "Hitung `ivw_loo` = IVW tanpa SNP5 (indeks 4)" },
        { id: "t5", text: "Jalankan dan pastikan empat baris output + kesimpulan tercetak" },
      ],
      expected: "wald=[0.4, 0.4, 0.4, 0.4, 1.0]\nivw_semua=0.51\nintercept_egger=0.085\nivw_tanpa_SNP5=0.40\nkesimpulan: pleiotropi directional terdeteksi (intercept jauh dari 0); estimasi valid ~0.40",
      code: {
        starter: `# Ringkasan GWAS SINTETIS (pola meniru data nyata; angka dibuat untuk latihan)
snp  = ["SNP1", "SNP2", "SNP3", "SNP4", "SNP5"]
bx   = [0.30, 0.25, 0.40, 0.20, 0.25]   # beta SNP -> paparan
by   = [0.12, 0.10, 0.16, 0.08, 0.25]   # beta SNP -> outcome
se   = [0.03, 0.03, 0.04, 0.03, 0.03]   # se(beta SNP -> outcome)

# TULIS KODEMU
def wald_ratios(bx, by):
    return

def ivw(bx, by, se):
    return

def egger_intercept(bx, by):
    # OLS: by = a + b*bx ; kembalikan intercept a
    return

wald = wald_ratios(bx, by)
ivw_semua = ivw(bx, by, se)
intercept = egger_intercept(bx, by)
ivw_loo = ivw(bx[:4], by[:4], se[:4])

print("wald=" + str([round(v, 2) for v in wald]))
print(f"ivw_semua={ivw_semua:.2f}")
print(f"intercept_egger={intercept:.3f}")
print(f"ivw_tanpa_SNP5={ivw_loo:.2f}")
print("kesimpulan: pleiotropi directional terdeteksi (intercept jauh dari 0); estimasi valid ~0.40")`,
        lockLines: 5,
        solution: `# Ringkasan GWAS SINTETIS (pola meniru data nyata; angka dibuat untuk latihan)
snp  = ["SNP1", "SNP2", "SNP3", "SNP4", "SNP5"]
bx   = [0.30, 0.25, 0.40, 0.20, 0.25]   # beta SNP -> paparan
by   = [0.12, 0.10, 0.16, 0.08, 0.25]   # beta SNP -> outcome
se   = [0.03, 0.03, 0.04, 0.03, 0.03]   # se(beta SNP -> outcome)

# TULIS KODEMU
def wald_ratios(bx, by):
    return [y / x for x, y in zip(bx, by)]

def ivw(bx, by, se):
    wald = wald_ratios(bx, by)
    w = [x ** 2 / s ** 2 for x, s in zip(bx, se)]
    return sum(wi * vi for wi, vi in zip(w, wald)) / sum(w)

def egger_intercept(bx, by):
    # OLS: by = a + b*bx ; kembalikan intercept a
    mx = sum(bx) / len(bx)
    my = sum(by) / len(by)
    sxy = sum((x - mx) * (y - my) for x, y in zip(bx, by))
    sxx = sum((x - mx) ** 2 for x in bx)
    slope = sxy / sxx
    return my - slope * mx

wald = wald_ratios(bx, by)
ivw_semua = ivw(bx, by, se)
intercept = egger_intercept(bx, by)
ivw_loo = ivw(bx[:4], by[:4], se[:4])

print("wald=" + str([round(v, 2) for v in wald]))
print(f"ivw_semua={ivw_semua:.2f}")
print(f"intercept_egger={intercept:.3f}")
print(f"ivw_tanpa_SNP5={ivw_loo:.2f}")
print("kesimpulan: pleiotropi directional terdeteksi (intercept jauh dari 0); estimasi valid ~0.40")`,
        checks: [
          { kind: "contains", task: "t1", name: "wald", value: 1.0, label: "`wald` memuat 1,00 untuk SNP5", msg: "0,25/0,25 = 1,00 — jauh dari 0,40 milik empat SNP lain: kandidat pleiotropik." },
          { kind: "equal", task: "t2", name: "ivw_semua", value: 0.5087, tol: 0.005, label: "`ivw_semua` = 0,51", msg: "Rata-rata Wald berbobot = 0,5087 — tertarik ke atas oleh SNP5." },
          { kind: "equal", task: "t3", name: "intercept", value: 0.0848, tol: 0.002, label: "`intercept` Egger = 0,085", msg: "Intercept OLS = 0,085 — jelas bukan 0: pleiotropi directional." },
          { kind: "equal", task: "t4", name: "ivw_loo", value: 0.4, tol: 0.001, label: "`ivw_loo` = 0,40", msg: "Tanpa SNP5, keempat Wald identik 0,40 — estimasi kembali ke nilai benar." },
          { kind: "stdout_matches", task: "t5", pattern: "kesimpulan: pleiotropi directional terdeteksi", label: "Kesimpulan tercetak", msg: "Samakan kalimat kesimpulan dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: tiga wasit dan satu pengawas ujian",
        body: "Praktisi MR membaca setiap hasil dengan hierarki kecurigaan yang jelas. Pertama: relevansi bisa diuji langsung — F-statistic di bawah 10 berarti instrumen lemah, dan analisisnya berhenti di sini, tidak peduli seindah apa pun hasilnya. Kedua: dua asumsi lainnya (independensi, exclusion restriction) tidak bisa dibuktikan — hanya bisa diuji tak langsung; karena itu jangan pernah melaporkan IVW tanpa pemeriksanya (MR-Egger, weighted median, Cochran's Q, leave-one-out). Ketiga: baca scatter plot sebelum percaya angka — titik-titik yang berbaris rapi di satu garis menenangkan, satu titik yang melenceng adalah kandidat pleiotropik yang butuh investigasi biologis, bukan dibuang diam-diam. Keempat: bedakan pleiotropi horizontal (melanggar — SNP memengaruhi outcome lewat jalur lain) dari vertikal (tidak melanggar — justru jalur kausal yang sedang diukur). Kelima: MR negatif yang kredibel sama berharganya dengan yang positif — ia menghemat ratusan juta dolar riset pada target yang salah. Dan yang terakhir: “RCT-nya alam” selalu dalam tanda kutip — stratifikasi populasi dan assortative mating bisa melanggar independensi; MR adalah alat penyaring hipotesis tercepat yang kita punya, bukan vonis kausal.",
      },
      reference: "Alur: Wald per SNP -> IVW -> intercept Egger -> leave-one-out. Satu SNP curang cukup untuk meracuni IVW.",
    },
    {
      id: "chart-scatter",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca scatter MR seperti reviewer jurnal",
      prose: [
        "Scatter plot di bawah adalah visual diagnostik standar two-sample MR: tiap titik = satu SNP.",
        "Cara membaca: sumbu X = efek SNP terhadap paparan (beta_ZX); sumbu Y = efek SNP terhadap outcome (beta_ZY). Kemiringan garis yang melalui titik-titik = estimasi efek kausal. Garis solid = IVW (dipaksa lewat titik nol — asumsi tidak ada pleiotropi); garis putus-putus = MR-Egger (intercept dibebaskan — mengizinkan pleiotropi rata-rata bukan nol).",
        "Interpretasi: empat titik biru berbaris rapi di sepanjang garis IVW — instrumen yang akur, masing-masing menunjuk efek kausal sekitar 0,40. Titik oranye SNP5 melenceng jauh ke atas: efek terhadap outcome-nya terlalu besar untuk dijelaskan oleh efeknya terhadap paparan — pola klasik pleiotropi horizontal. Akibatnya garis IVW (slope 0,51) tertarik ke atas, sementara garis Egger memotong sumbu Y di 0,085 — intercept yang jauh dari nol adalah vonis statistik: pleiotropi directional terdeteksi. Pelajaran chart: jangan pernah melaporkan IVW tanpa melihat scatter-nya; satu titik bisa mengubah kesimpulan.",
      ],
      figure: {
        svg: MR_SCATTER_SVG,
        alt: "Scatter plot lima SNP: empat titik di garis IVW slope 0,51; SNP5 melenceng ke atas; garis MR-Egger berintercept 0,085.",
        caption: "Scatter plot MR (data sintetis): sumbu X = beta SNP-paparan, sumbu Y = beta SNP-outcome. SNP5 = outlier pleiotropik.",
      },
      tasks: [],
      reference: "Scatter dulu, angka kemudian. Titik yang melenceng = investigasi biologis, bukan buang diam-diam.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan MR bisa dipercaya — dan kapan dibuang",
      prose: [
        "Lima skenario yang menentukan nasib analisis MR:",
        "Skenario 1 — F-statistic rata-rata 6. STOP. Jangan jalankan MR. Alasan: instrumen lemah membuat estimasi bias dan interval kepercayaan menyesatkan; cari instrumen yang lebih kuat atau tambah sampel GWAS dulu.",
        "Skenario 2 — IVW signifikan, arah sama di MR-Egger dan weighted median, Q tidak signifikan, intercept Egger mendekati 0, leave-one-out stabil. Bukti KUAT untuk kausalitas. Alasan: seluruh kerangka bukti berlapis terpenuhi — hasil tidak bergantung pada satu metode atau satu SNP.",
        "Skenario 3 — Intercept Egger tidak sama dengan 0 secara signifikan. Jangan percaya IVW mentah. Investigasi: SNP mana yang menyimpang (leave-one-out, forest plot), apakah ada penjelasan biologis (jalur pleiotropik yang diketahui)? Laporkan slope Egger/median sebagai alternatif — dengan catatan asumsi InSIDE/mayoritas-valid. Alasan: pleiotropi directional adalah pelanggaran asumsi inti.",
        "Skenario 4 — Heterogenitas tinggi (Q signifikan) tetapi intercept mendekati 0. Pleiotropi mungkin seimbang (tidak directional); IVW random-effects masih bisa dipakai, tetapi selidiki outlier dan pertimbangkan weighted median. Alasan: heterogenitas tanpa arah = noise instrumen, bukan bias sistematis — masih bisa dikelola.",
        "Skenario 5 — Dua GWAS tumpang tindih 80% sampelnya, atau ancestry berbeda (paparan dari Eropa, outcome dari Asia Timur). Asumsi two-sample dilanggar. Cari GWAS se-ancestry yang non-overlapping; kalau tidak ada, akui biasnya secara eksplisit. Alasan: overlap menarik estimasi ke arah observasional; beda ancestry membuat efek alel tidak comparable.",
        "Aturan praktis 10 detik: F di atas 10? Hitung IVW. Intercept Egger mendekati 0? Median searah? Leave-one-out stabil? Baru tulis kata kausal — dan tetap dengan kualifikasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Melaporkan hanya IVW yang signifikan lalu mengklaim kausalitas di abstrak. Reviewer yang baik langsung bertanya: mana Egger-nya? mana Q-nya? mana leave-one-out-nya? Analisis MR tanpa sensitivitas = klaim tanpa pengacara pembela — runtuh di pertanyaan pertama.",
      },
      reference: "Klaim kausal butuh: IVW + Egger + median + Q + leave-one-out + F di atas 10. Kurang satu = turunkan klaim.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Kasus CRP: ketika MR berkata tidak",
      prose: [
        "Skenario (berbasis temuan publikasi — angka lab di lesson ini sintetis, tetapi pola hasilnya sesuai literatur): awal 2000-an, CRP — protein penanda inflamasi — adalah bintang observasional. Studi kohort besar menunjukkan orang dengan CRP tertinggi punya risiko penyakit jantung koroner 2–3 kali lipat dibanding yang terendah, bahkan setelah disesuaikan untuk kolesterol, merokok, dan tekanan darah. Beberapa perusahaan farmasi mulai mengembangkan obat penurun CRP dengan harapan mencegah serangan jantung.",
        "Pertanyaan analisis: (1) Mengapa penyesuaian untuk confounder terukur tidak cukup untuk menyimpulkan CRP kausal? (2) Bagaimana desain MR untuk pertanyaan apakah CRP menyebabkan PJK? SNP apa yang menjadi instrumen, dan apa yang dibandingkan? (3) Hasil MR: varian genetik yang menaikkan CRP seumur hidup TIDAK berhubungan dengan risiko PJK. Apa implikasi untuk pengembangan obat — dan apa yang TIDAK bisa disimpulkan dari hasil ini?",
        "Pembahasan: (1) Confounder tak terukur (mis. infeksi kronis ringan, status inflamasi umum, faktor gaya hidup yang tidak tercatat) tetap bisa menjelaskan asosiasi; penyesuaian hanya membersihkan yang diukur. (2) Instrumen: SNP di sekitar gen CRP yang menaikkan CRP seumur hidup (asumsi relevansi kuat — gennya langsung); bandingkan risiko PJK antar genotipe. Karena genotipe diacak saat pembuahan, confounder gaya hidup tidak ikut. (3) Implikasi: menghentikan investasi obat penurun CRP untuk prevensi PJK — menghemat ratusan juta dolar riset yang pasti gagal. Yang TIDAK bisa disimpulkan: CRP tetap berguna sebagai PENANDA risiko (prediktor), dan hasil ini tidak membatalkan obat anti-inflamasi yang bekerja lewat jalur lain. Pelajaran ganda: MR menghemat uang saat berkata tidak, dan tidak kausal tidak sama dengan tidak berguna.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di industri, keputusan menghentikan program obat bernilai ratusan juta dolar — dan MR adalah salah satu dari sedikit alat yang bisa memberi keberanian untuk mengatakannya lebih awal. Analis yang hanya bisa berkata lanjutkan tidak lengkap; analis yang bisa berkata berhenti, dengan bukti, jauh lebih berharga.",
      },
      reference: "MR negatif yang kredibel sama berharganya dengan MR positif — ia mencegah investasi pada target yang salah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "MR memakai varian genetik (diacak saat pembuahan) sebagai instrumental variable untuk efek kausal paparan ke outcome.",
        "Tiga asumsi: relevansi (F di atas 10, bisa diuji), independensi, exclusion restriction (tak bisa dibuktikan — hanya diuji tak langsung).",
        "Estimator Wald = beta_ZY / beta_ZX; two-sample MR menggabungkan banyak SNP via IVW (rata-rata berbobot presisi, asumsi semua instrumen valid).",
        "MR-Egger (beta_ZY = alpha + theta beta_ZX): intercept alpha tidak nol = pleiotropi directional, IVW bias; selalu bandingkan dengan weighted median.",
        "Klaim kausal butuh kerangka berlapis: IVW + Egger + median searah, Q tak signifikan, leave-one-out stabil, F di atas 10. MR negatif yang kredibel menghemat investasi pada target salah.",
      ],
      quiz: [
        {
          q: "Mengapa alel yang diwariskan bisa dipakai sebagai instrumental variable?",
          options: [
            { text: "Karena alel dibagikan secara acak saat pembuahan — independen dari confounder gaya hidup yang biasanya mengacaukan studi observasional", why: "Benar: pengacakan Mendel memutus hubungan antara instrumen dan confounder (asumsi independensi) — inilah fondasi seluruh metode.", correct: true },
            { text: "Karena gen menentukan segalanya sehingga tidak ada confounding", why: "Salah: gen tidak menentukan segalanya; stratifikasi populasi dan assortative mating tetap bisa melanggar independensi." },
            { text: "Karena efek genetik selalu lebih besar dari efek lingkungan", why: "Salah: efek per SNP biasanya KECIL — justru itu kenapa butuh GWAS ratusan ribu orang untuk mengukurnya dengan presisi." },
            { text: "Karena gen tidak pernah memiliki efek pleiotropik", why: "Salah: pleiotropi justru ancaman utamanya — melanggar exclusion restriction. Gen sering memengaruhi banyak sifat sekaligus." },
          ],
        },
        {
          q: "SNP: beta_ZX = 0,25 (LDL, mmol/L per alel), beta_ZY = 0,10 (log-odds PJK per alel). Estimasi Wald efek kausal LDL ke PJK?",
          options: [
            { text: "0,40 log-odds per 1 mmol/L — yaitu 0,10 / 0,25", why: "Benar: Wald = beta_ZY / beta_ZX. Interpretasi: tiap kenaikan LDL 1 mmol/L (yang diprediksi genetik) menaikkan log-odds PJK sebesar 0,40.", correct: true },
            { text: "0,025 — yaitu 0,25 kali 0,10", why: "Salah: Wald memakai pembagian, bukan perkalian — efek terhadap outcome dibagi efek terhadap paparan." },
            { text: "2,50 — yaitu 0,25 / 0,10", why: "Salah: terbalik. Pembilang harus efek terhadap outcome (beta_ZY), penyebut efek terhadap paparan (beta_ZX)." },
            { text: "Tidak bisa dihitung tanpa data individu", why: "Salah: justru keunggulan MR — cukup ringkasan statistik (beta dan SE) dari GWAS, tanpa data individu." },
          ],
        },
        {
          q: "Hasil MR: IVW = 0,51 (p < 0,001), intercept MR-Egger = 0,085 (p = 0,01). Kesimpulan yang tepat?",
          options: [
            { text: "Ada pleiotropi directional — IVW kemungkinan bias; selidiki SNP menyimpang dan bandingkan dengan metode robust sebelum klaim kausal", why: "Benar: intercept tidak sama dengan 0 secara signifikan = pelanggaran asumsi exclusion restriction yang sistematis. IVW tidak bisa dipercaya mentah-mentah.", correct: true },
            { text: "Bukti kuat kausalitas — IVW sangat signifikan", why: "Salah: signifikansi IVW tidak ada artinya jika asumsinya dilanggar. Inilah gunanya Egger sebagai pemeriksa." },
            { text: "Tidak ada efek kausal karena metode tidak sepakat", why: "Salah: Egger bukan menguji ada-tidaknya efek, melainkan ada-tidaknya pleiotropi. Ketidaksepakatan = masalah asumsi, bukan vonis nol." },
            { text: "Buang SNP dengan Wald tertinggi lalu laporkan IVW ulang", why: "Salah: membuang outlier diam-diam tanpa justifikasi biologis adalah cherry-picking. Investigasi dulu, laporkan transparan." },
          ],
        },
        {
          q: "Kapan weighted median lebih dipilih dibanding IVW sebagai estimasi utama?",
          options: [
            { text: "Ketika ada indikasi sebagian instrumen invalid — median tetap konsisten selama setidaknya 50% informasi berasal dari instrumen valid", why: "Benar: asumsi mayoritas-valid lebih lemah dari asumsi IVW (semua valid), sehingga median robust terhadap outlier pleiotropik.", correct: true },
            { text: "Ketika jumlah SNP sedikit (kurang dari 5)", why: "Salah: sedikit SNP justru melemahkan semua metode; median tidak punya keunggulan khusus di sana." },
            { text: "Ketika F-statistic sangat tinggi", why: "Salah: F tinggi = instrumen kuat — itu kabar baik untuk SEMUA metode, bukan alasan memilih median." },
            { text: "Tidak pernah — IVW selalu lebih baik", why: "Salah: IVW paling efisien HANYA jika asumsinya terpenuhi. Dengan pleiotropi, efisiensinya menipu." },
          ],
        },
        {
          q: "MR menunjukkan varian peningkat CRP seumur hidup tidak berhubungan dengan risiko PJK. Implikasi yang TEPAT?",
          options: [
            { text: "CRP kemungkinan bukan kausal untuk PJK — hentikan investasi obat penurun CRP untuk prevensi, tapi CRP tetap valid sebagai penanda risiko", why: "Benar: tidak kausal tidak sama dengan tidak berguna. CRP tetap memprediksi risiko (penumpang yang setia), hanya saja bukan target intervensi yang tepat.", correct: true },
            { text: "Studi observasional tentang CRP semuanya salah dan harus ditarik", why: "Salah: studi observasional benar dalam melaporkan asosiasi — yang dikoreksi MR hanyalah interpretasi kausalnya." },
            { text: "Semua obat anti-inflamasi tidak berguna untuk jantung", why: "Salah: hasil ini spesifik untuk jalur CRP. Anti-inflamasi lewat jalur lain adalah pertanyaan terpisah yang butuh MR tersendiri." },
            { text: "MR gagal karena CRP jelas berhubungan dengan PJK secara observasional", why: "Salah: justru perbedaan hasil observasional vs MR adalah informasinya — ia memisahkan korelasi dari kausalitas." },
          ],
        },
      ],
    },
  ],
};
