import type { V2Lesson } from "../lib/types";

export const a27: V2Lesson = {
  slug: "a27-effect-size",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.7 Effect Size: Signifikan Belum Tentu Penting",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-17m",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kemenangan Rp17 miliar yang hampa",
      prose: [
        "E-commerce BelanjaYuk menjalankan A/B test tombol checkout sebulan: 2 juta pengunjung per varian. Varian B menang — konversi naik dari 3,00% ke 3,10%. p-value < 0,001, sangat signifikan. Proyeksi kenaikan revenue Rp17 miliar/tahun! Namun CFO mengernyit: implementasi butuh migrasi 3 bulan, biaya Rp4 miliar, dan risiko bug. Kenaikan 0,1 poin — seberapa yakin angkanya sebesar itu?",
        "Analis menghitung ulang: CI kenaikannya (0,02 pp, 0,18 pp). Skenario pesimis: kenaikan cuma 0,02 poin → tambahan revenue Rp3,4 miliar — di bawah biaya implementasi. p < 0,001 hanya menjawab apakah efeknya ada — dengan 4 juta pengunjung, bahkan efek debu pun terdeteksi. Pertanyaan yang seharusnya: seberapa besar efeknya, dan apakah cukup besar untuk membenarkan biayanya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kenaikan_pp` = 3,10 − 3,00 (poin persentase)" },
        { id: "t2", text: "Hitung `rasio_pesimis` = 3,4/4 (revenue pesimis vs biaya, dalam miliar Rp)" },
      ],
      expected: "kenaikan_pp=0.1  rasio_pesimis=0.85",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Skenario pesimis memberi rasio 0,85 — di bawah 1, artinya taruhan yang belum tentu untung. Signifikan menjawab pertanyaan yang salah; pertanyaan yang benar adalah apakah nilai harapan bersih > 0 dengan margin aman.",
      },
      hints: [
        "kenaikan_pp = round(3.10 - 3.00, 2).",
        "rasio_pesimis = round(3.4/4, 2).",
        "Rasio < 1 = biaya lebih besar dari revenue pesimis.",
      ],
      code: {
        starter: `# A/B test: 2 juta pengunjung per varian\n\n# TULIS KODEMU\nkenaikan_pp = \nrasio_pesimis = \n\nprint(f"kenaikan_pp={kenaikan_pp}  rasio_pesimis={rasio_pesimis}")`,
        lockLines: 1,
        solution: `# A/B test: 2 juta pengunjung per varian\n\n# TULIS KODEMU\nkenaikan_pp = round(3.10 - 3.00, 2)\nrasio_pesimis = round(3.4/4, 2)\n\nprint(f"kenaikan_pp={kenaikan_pp}  rasio_pesimis={rasio_pesimis}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kenaikan_pp", value: 0.1, tol: 1e-9, label: "`kenaikan_pp` seharusnya 0.1", msg: "Kenaikan cuma 0,1 poin — kecil secara absolut." },
          { kind: "equal", task: "t2", name: "rasio_pesimis", value: 0.85, tol: 0.01, label: "`rasio_pesimis` seharusnya 0.85", msg: "Rp3,4 M / Rp4 M = 0,85 — skenario pesimis merugi." },
          { kind: "stdout_matches", task: "t2", pattern: "kenaikan_pp=0\\.1\\s+rasio_pesimis=0\\.85", label: "`print` menampilkan keduanya", msg: "Format: kenaikan_pp=...  rasio_pesimis=... ." },
        ],
      },
      reference: "p < 0,001 menjawab 'apakah?'; effect size menjawab 'seberapa?'",
    },
    {
      id: "cohens-d",
      eyebrow: "Langkah 2 · Cohen's d",
      title: "Selisih dalam satuan standar",
      prose: [
        "Effect size mengukur besarnya perbedaan dalam satuan yang tidak tergantung ukuran sampel — scale-free dan bebas n. Selisih Rp50 ribu tidak bisa dibandingkan antar konteks; d = 0,5 bisa — artinya sama di Jakarta maupun Tokyo, di n=50 maupun n=50.000. Inilah bahasa universal untuk membandingkan temuan antar studi.",
        "Cohen's d = selisih dua mean dibagi simpangan baku gabungan. Contoh: skor pelatihan — kontrol (n=12, mean 61,7, s=4,5), perlakuan (n=12, mean 69,7, s=4,5). d = 8/4,5 ≈ 1,78 → sangat besar. Pelatihan menggeser skor hampir 2 simpangan baku — efek yang terlihat jelas bahkan tanpa statistik.",
      ],
      formula: String.raw`d = \frac{\bar{x}_1 - \bar{x}_2}{s_{\text{pooled}}}`,
      formulaNote: "d = Cohen's d (effect size); x-bar_1, x-bar_2 = mean dua grup; s_pooled = simpangan baku gabungan kedua grup — pembagi ini membuat d bebas satuan dan bisa dibandingkan antar konteks.",
      tasks: [
        { id: "t1", text: "Hitung `d` = (69,7 − 61,7)/4,5; bulatkan 2 desimal" },
      ],
      expected: "d=1.78",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "d = 0,8 selalu penting; d = 0,2 selalu tidak penting. Salah — patokan Cohen hanya titik awal. d = 0,06 untuk aspirin mencegah serangan jantung menyelamatkan ribuan nyawa (efek kecil × populasi raksasa = dampak raksasa). Penting = effect size × konteks bisnis, bukan effect size saja.",
      },
      hints: [
        "d = (69.7 - 61.7) / 4.5.",
        "Bulatkan 2 desimal.",
        "Hasil ≈ 1.78 — sangat besar.",
      ],
      code: {
        starter: `# skor pelatihan: kontrol mean 61.7, perlakuan mean 69.7, s=4.5\n\n# TULIS KODEMU\nd = \n\nprint(f"d={d}")`,
        lockLines: 1,
        solution: `# skor pelatihan: kontrol mean 61.7, perlakuan mean 69.7, s=4.5\n\n# TULIS KODEMU\nd = round((69.7 - 61.7)/4.5, 2)\n\nprint(f"d={d}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d", value: 1.78, tol: 0.01, label: "`d` seharusnya 1.78", msg: "d ≈ 1,78 — efek sangat besar." },
          { kind: "stdout_matches", task: "t1", pattern: "d=1\\.78", label: "`print` menampilkan d", msg: "Format: d=... ." },
        ],
      },
      reference: "Laporan modern: effect size + interval kepercayaannya, selalu.",
    },
    {
      id: "patokan-bahasa",
      eyebrow: "Langkah 3 · Membaca d",
      title: "Dari angka ke bahasa manusia",
      prose: [
        "Patokan Cohen (1988): d ≈ 0,2 kecil (distribusi hampir tumpang tindih total), 0,5 sedang (pergeseran mulai terlihat), 0,8 besar (dua distribusi jelas terpisah). Bahasa overlap: d = 0,2 → ~85% overlap; d = 0,8 → ~53%; d = 1,2 → ~38%.",
        "Bahasa probabilitas lebih hidup: P(X₁ > X₂) = 56% untuk d = 0,2 vs ~79% untuk d = 0,8 — ambil satu orang acak dari tiap grup, seberapa sering yang perlakuan menang? Untuk d = 0,8, mean perlakuan setara persentil ke-79 kontrol. Jauh lebih komunikatif daripada 0,8 simpangan baku. Contoh beda gaji Jakarta–Surabaya: p = 0,006 (signifikan!) tapi d = 0,55 — efek sedang. p menjawab apakah beda; d menjawab seberapa beda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aspirin (d = 0,06, sangat kecil) mencegah ribuan serangan jantung per tahun — karena dikalikan jutaan pasien. Sebaliknya kenaikan konversi 0,1 pp mungkin tidak menutup biaya implementasi. Penting = d × skala dampak × biaya. Tidak ada angka d yang penting dalam vakum.",
      },
      reference: "d = 0,2/0,5/0,8 — titik awal, bukan vonis.",
    },
    {
      id: "or-rr",
      eyebrow: "Langkah 4 · Effect size untuk proporsi",
      title: "OR, RR, dan jebakan headline",
      prose: [
        "Untuk data kategorikal: Risk Ratio (RR) = rasio peluang kejadian — default 6% vs 3% → RR = 2,0 (risiko 2× lipat), intuitif untuk direksi. Odds Ratio (OR) = rasio odds — untuk tabel 2×2 [[a,b],[c,d]]. OR ≈ RR saat kejadian langka; untuk kejadian umum, OR melebih-lebihkan.",
        "Contoh: p₁ = 40%, p₂ = 20% → RR = 2,0 tapi OR = (0,4/0,6)/(0,2/0,8) = 2,67. Media yang menulis risiko naik 167% dari OR = 2,67 padahal risiko sebenarnya naik 100% (RR = 2,0) sedang melebih-lebihkan. Untuk komunikasi ke non-teknis, RR hampir selalu lebih jujur. Cramér's V untuk tabel r×c: kekuatan asosiasi skala 0–1 (0,1 kecil, 0,3 sedang, 0,5 besar).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rr` = 6/3 (default 6% vs 3%)" },
        { id: "t2", text: "Hitung `or_` = (0,4/0,6)/(0,2/0,8); bulatkan 2 desimal" },
      ],
      expected: "rr=2.0  or=2.67",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Odds ratio 3 berarti risikonya 3× lipat. Salah — hanya jika kejadiannya langka. Untuk kejadian umum OR melebih-lebihkan dibanding RR. Selalu hitung keduanya (RR untuk komunikasi, OR untuk pemodelan — regresi logistik bekerja dalam odds); jika keduanya bercerita sangat beda, kejadiannya tidak langka.",
      },
      hints: [
        "rr = 6 / 3.",
        "or_ = round((0.4/0.6)/(0.2/0.8), 2).",
        "OR 2,67 vs RR 2,0 — beda 67 poin persentase headline!",
      ],
      code: {
        starter: `# default 6% vs 3%; kejadian umum p1=40%, p2=20%\n\n# TULIS KODEMU\nrr = \nor_ = \n\nprint(f"rr={rr}  or={or_}")`,
        lockLines: 1,
        solution: `# default 6% vs 3%; kejadian umum p1=40%, p2=20%\n\n# TULIS KODEMU\nrr = 6/3\nor_ = round((0.4/0.6)/(0.2/0.8), 2)\n\nprint(f"rr={rr}  or={or_}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rr", value: 2.0, tol: 1e-9, label: "`rr` seharusnya 2.0", msg: "RR = 2,0 — risiko 2× lipat, jujur untuk direksi." },
          { kind: "equal", task: "t2", name: "or_", value: 2.67, tol: 0.01, label: "`or_` seharusnya 2.67", msg: "OR = 2,67 — melebih-lebihkan karena kejadian umum." },
          { kind: "stdout_matches", task: "t2", pattern: "rr=2\\.0\\s+or=2\\.67", label: "`print` menampilkan keduanya", msg: "Format: rr=...  or=... ." },
        ],
      },
      reference: "Headline dari OR saat kejadian umum = melebih-lebihkan.",
    },
    {
      id: "signifikan-vs-penting",
      eyebrow: "Langkah 5 · Signifikan vs penting",
      title: "Dua pertanyaan berbeda",
      prose: [
        "Hubungan matematisnya eksplisit: untuk uji-t dua sampel, t ≈ d·√(n/2) — statistik uji = effect size × faktor ukuran sampel. Untuk d > 0 sekecil apapun, n yang cukup besar pasti menghasilkan signifikan. Signifikansi mengukur kekuatan bukti (apakah efeknya ada?), yang tumbuh dengan n. Effect size mengukur besarnya efek (seberapa?), yang tidak tergantung n.",
        "Matriks keputusan: efek besar + signifikan → temuan kuat, rayakan (dengan CI). Efek kecil + signifikan → nyata tapi trivial — hitung ROI sebelum bertindak. Efek besar + tidak signifikan → mungkin underpowered — cek power, jangan simpulkan tidak ada efek. Efek kecil + tidak signifikan → konsisten: tidak ada yang menarik. Efek yang identik (d = 0,2) menjadi signifikan hanya karena n membesar — bukan efeknya yang membesar, buktinya yang menguat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "p sangat kecil berarti temuan kuat. Salah — t = d·√(n/2): n raksasa membuat d mungil pun signifikan. d = 0,02 berarti overlap ~99% — tidak terasa di dunia nyata kecuali dikali skala raksasa dengan biaya nol. Selalu tanya d-nya berapa.",
      },
      reference: "Keputusan = effect size × skala − biaya, bukan p-value.",
    },
    {
      id: "minicase-ab",
      eyebrow: "Langkah 6 · Mini-case",
      title: "A/B test yang menang 0,1 poin",
      prose: [
        "Kembali ke cerita pembuka. Data final: kontrol 3,00% (60.000/2.000.000), varian B 3,10% (62.000/2.000.000). p < 0,001. Biaya implementasi: Rp4 miliar + 3 bulan migrasi berisiko.",
        "(a) Cohen's h ≈ 0,006 — praktis nol. RR = 3,10/3,00 ≈ 1,033 (naik 3,3% relatif — terdengar lumayan, tapi dari basis kecil). (b) Argumen melawan: batas bawah CI (0,02 pp) → tambahan revenue ~Rp3,4 M < biaya Rp4 M. Nilai harapan keputusan harus memperhitungkan risiko bawah yang negatif — dan itu sebelum biaya opportunity 3 bulan tim engineering. (c) 0,1 pp layak jika: implementasi murah & reversibel (ganti warna tombol — ship saja!), efek terakumulasi di banyak eksperimen (50 test × 0,1 pp = 5 pp), atau basis revenue raksasa sehingga 0,02 pp pun > biaya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rr` = 3,10/3,00; bulatkan 3 desimal" },
        { id: "t2", text: "Hitung Cohen's `h` = 2·arcsin(√0,031) − 2·arcsin(√0,030); bulatkan 3 desimal" },
      ],
      expected: "rr=1.033  h=0.006",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "h = 0,006 praktis nol — signifikansi datang murni dari n raksasa. Keputusan implementasi Rp4 miliar dari efek debu adalah taruhan dengan nilai harapan yang belum tentu positif. CI yang menyentuh nol + biaya tinggi = taruhan buruk meski signifikan.",
      },
      hints: [
        "rr = round(3.10/3.00, 3).",
        "h = 2*math.asin(math.sqrt(0.031)) - 2*math.asin(math.sqrt(0.030)).",
        "Bulatkan h 3 desimal.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nrr = \nh = \n\nprint(f"rr={rr}  h={h}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nrr = round(3.10/3.00, 3)\nh = round(2*math.asin(math.sqrt(0.031)) - 2*math.asin(math.sqrt(0.030)), 3)\n\nprint(f"rr={rr}  h={h}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rr", value: 1.033, tol: 0.001, label: "`rr` seharusnya 1.033", msg: "RR = 1,033 — naik 3,3% relatif dari basis kecil." },
          { kind: "equal", task: "t2", name: "h", value: 0.006, tol: 0.001, label: "`h` seharusnya 0.006", msg: "h ≈ 0,006 — praktis nol." },
          { kind: "stdout_matches", task: "t2", pattern: "rr=1\\.033\\s+h=0\\.006", label: "`print` menampilkan keduanya", msg: "Format: rr=...  h=... ." },
        ],
      },
      reference: "Signifikan menjawab ada/tidak, bukan layak/tidak.",
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
        "p-value menjawab apakah; effect size menjawab seberapa — laporkan keduanya.",
        "Cohen's d: selisih dalam satuan SD; 0,2/0,5/0,8 = titik awal.",
        "Untuk proporsi: RR untuk komunikasi, OR untuk pemodelan; OR ≈ RR hanya saat langka.",
        "t = d·√(n/2): n raksasa membuat efek debu pun signifikan.",
        "Keputusan bisnis = effect size × skala − biaya, bukan p-value.",
      ],
      next: { label: "A2.8 — Multiple Testing", href: "/learn/a28-multiple-testing" },
      quiz: [
        {
          q: "Studi n=100.000 menemukan efek 'sangat signifikan' (p < 0,001) dengan d = 0,02. Reaksi tepat?",
          options: [
            { text: "Rayakan — p sangat kecil berarti temuan kuat", why: "p kecil hanya berarti bukti kuat, bukan efek besar." },
            { text: "Skeptis: d = 0,02 praktis nol; signifikansi hanyalah akibat n raksasa — cek pentingnya di konteks", why: "d = 0,02 berarti overlap ~99% — tidak terasa kecuali skala raksasa dengan biaya nol.", correct: true },
            { text: "Minta n lebih besar lagi", why: "n lebih besar hanya membuat p lebih kecil — tidak mengubah d." },
            { text: "Ulangi dengan α = 1%", why: "α lebih ketat tidak mengubah besar efeknya." },
          ],
        },
        {
          q: "d = 0,8. Interpretasi dalam bahasa probabilitas?",
          options: [
            { text: "80% data perlakuan di atas rata-rata kontrol", why: "Bukan 80% — interpretasi persentilnya ~79%." },
            { text: "Individu acak dari grup perlakuan mengalahkan ~79% individu kontrol — pergeseran yang jelas terasa", why: "Mean perlakuan setara persentil ke-79 kontrol.", correct: true },
            { text: "Efeknya 80% signifikan", why: "'80% signifikan' bukan konsep yang bermakna." },
            { text: "80% variansi dijelaskan", why: "Itu bahasa R², bukan d." },
          ],
        },
        {
          q: "OR = 2,67 untuk kejadian dengan p₁=40%, p₂=20%. Headline jujur?",
          options: [
            { text: "'Risiko naik 167%!'", why: "Itu membaca OR sebagai RR — melebih-lebihkan." },
            { text: "'Risiko naik 2× lipat (dari 20% ke 40%)' — pakai RR=2,0; OR melebih-lebihkan saat kejadian umum", why: "OR ≈ RR hanya untuk kejadian langka.", correct: true },
            { text: "'Risiko naik 267%'", why: "Salah baca total — 2,67× bukan 267% kenaikan." },
            { text: "Tidak bisa dilaporkan", why: "Bisa — dengan RR yang jujur." },
          ],
        },
        {
          q: "Chi-square signifikan untuk tabel 4×3 (n=2.000). Laporan lengkap butuh apa?",
          options: [
            { text: "Cukup — sudah signifikan", why: "Signifikan tanpa besaran tidak bisa dinilai." },
            { text: "Cramér's V (+ interpretasi) — 'ada hubungan' tanpa 'seberapa kuat' tidak bisa dinilai; dengan n=2.000, V kecil pun signifikan", why: "χ² tumbuh dengan n; V menstandarkan ke 0–1.", correct: true },
            { text: "Uji-t", why: "Uji-t untuk mean kontinu, bukan tabel kategori." },
            { text: "n lebih besar", why: "n=2.000 sudah besar — masalahnya justru n besar membuat efek kecil signifikan." },
          ],
        },
        {
          q: "Dua obat: A (d=0,9, n=40, p=0,02) vs B (d=0,15, n=20.000, p<0,001). Mana lebih menjanjikan secara klinis?",
          options: [
            { text: "B — p-value jauh lebih kecil", why: "p kecil B hanya karena n raksasa — efeknya kecil." },
            { text: "A — effect size 6× lipat; p-value B kecil hanya karena n raksasa. (Dengan catatan: n=40 butuh replikasi!)", why: "d mengukur janji klinis; p mengukur kekuatan bukti.", correct: true },
            { text: "Sama saja", why: "d 0,9 vs 0,15 — jauh berbeda janji klinisnya." },
            { text: "Tidak bisa dibandingkan", why: "Bisa — dengan d sebagai bahasa universal." },
          ],
        },
      ],
      note: {
        title: "Intuisi: dompetmu peduli effect size, bukan p-value",
        body: "Lima heuristik. Satu: dengan n raksasa, semuanya jadi signifikan — pada titik itu p-value berhenti informatif dan effect size mengambil alih kemudi; signifikansi menjawab “apakah”, dompetmu bertanya “seberapa”. Dua: d = 0,2 berarti dua distribusi 85 persen tumpang tindih — “signifikan” tetapi praktis kembar; patokan Cohen adalah penerjemah, bukan hakim. Tiga: selalu pasangkan effect size dengan interval kepercayaannya — titik tanpa rentang adalah klaim tanpa kejujuran; CI yang lebar berkata “efeknya mungkin besar, mungkin nol”. Empat: untuk kejadian yang umum, odds ratio melebih-lebihkan dibanding risk ratio — OR 2,67 padahal risiko naik 2 kali lipat adalah bahan headline yang menyesatkan. Lima: sebelum bertindak, hitung dalam rupiah — batas bawah CI dikali skala bisnis; bila skenario pesimis tidak menutup biaya, kemenangan statistikmu adalah kekalahan bisnis. Enam: laporkan keduanya, selalu — p-value tanpa effect size adalah klaim tanpa ukuran, effect size tanpa p-value adalah ukuran tanpa kepastian; pembaca yang cerdas menuntut keduanya di kalimat yang sama.",
      },
    },
  ],
};
