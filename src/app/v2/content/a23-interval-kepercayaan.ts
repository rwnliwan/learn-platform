import type { V2Lesson } from "../lib/types";

export const a23: V2Lesson = {
  slug: "a23-interval-kepercayaan",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.3 Interval Kepercayaan: Seberapa Yakin Kamu?",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-negatif",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Konversi negatif?",
      prose: [
        "Tim growth meluncurkan landing page baru. Setelah seminggu: 50 pengunjung, 2 mendaftar. Konversi = 4%. Analis menghitung interval kepercayaan 95% dengan rumus sejuta umat (Wald): 4% ± 5,4%. Hasilnya: (−1,4%, 9,4%). Batas bawahnya negatif — pengunjung malah membatalkan pendaftaran yang tidak pernah mereka lakukan?",
        "Rumus Wald memang retak di tepi-tepi: saat proporsi dekat 0 atau 1, atau sampel kecil. Ada rumus yang hampir selalu lebih baik — interval Wilson (1927) — yang ironisnya ditemukan puluhan tahun sebelum Wald populer. Dunia memakai rumus yang lebih buruk karena yang lebih baik terlihat rumit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p` = 2/50" },
        { id: "t2", text: "Hitung `margin` Wald = 1,96·√(p(1−p)/50), bulatkan 3 desimal" },
        { id: "t3", text: "Hitung `bawah` = p − margin (tanpa pembulatan margin), bulatkan 3 desimal" },
      ],
      expected: "p=0.04  margin=0.054  bawah=-0.014",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Data bisnis (konversi, fraud rate, default rate) sering hidup di tepi — persis tempat Wald ngawur. Keputusan berbasis interval Wald untuk metrik langka berarti memakai interval yang sistematis terlalu percaya diri.",
      },
      hints: [
        "p = 2 / 50.",
        "margin = 1.96 * math.sqrt(p*(1-p)/50), bulatkan 3 desimal.",
        "bawah = round(p - 1.96*math.sqrt(p*(1-p)/50), 3) — pakai margin tanpa pembulatan.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\np = \nmargin = \nbawah = \n\nprint(f"p={p}  margin={margin}  bawah={bawah}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\np = 2/50\nmargin = round(1.96*math.sqrt(p*(1-p)/50), 3)\nbawah = round(p - 1.96*math.sqrt(p*(1-p)/50), 3)\n\nprint(f"p={p}  margin={margin}  bawah={bawah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.04, tol: 1e-9, label: "`p` seharusnya 0.04", msg: "2/50 = 4%." },
          { kind: "equal", task: "t2", name: "margin", value: 0.054, tol: 0.001, label: "`margin` seharusnya 0.054", msg: "Margin Wald ≈ 5,4 poin." },
          { kind: "equal", task: "t3", name: "bawah", value: -0.014, tol: 0.001, label: "`bawah` seharusnya -0.014", msg: "Batas bawah negatif — mustahil untuk proporsi." },
          { kind: "stdout_matches", task: "t3", pattern: "p=0\\.04\\s+margin=0\\.054\\s+bawah=-0\\.014", label: "`print` menampilkan ketiganya", msg: "Format: p=...  margin=...  bawah=... ." },
        ],
      },
      reference: "Wald di tepi: overshoot keluar [0,1], zero-width, cakupan anjlok.",
    },
    {
      id: "arti-95",
      eyebrow: "Langkah 2 · Makna 95%",
      title: "Yang 95% itu prosedurnya, bukan intervalmu",
      prose: [
        "CI 95% untuk parameter adalah rentang dari sampel sehingga — jika eksperimen diulang berkali-kali — 95% interval yang dihasilkan mencakup nilai sebenarnya. Yang 95% adalah prosedurnya, bukan interval spesifik yang kamu pegang. Analogi: 100 anak panah (100 interval); ~95 mengenai target. Tapi satu anak panah yang sudah menancap — ia kena atau tidak kena.",
        "Dalam frequentist, nilai benar itu tetap — ia di dalam atau di luar; peluangnya 0 atau 1. Kalimat benar: prosedur ini menghasilkan interval yang mencakup nilai benar dalam 95% pengulangan. Dan CI adalah tentang parameter, bukan data individu: CI (13,4, 16,6) untuk mean TIDAK berarti 95% pelanggan menunggu 13–17 menit.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Ada 95% peluang nilai benar ada di dalam interval ini. Salah — miskonsepsi paling umum, bahkan di kalangan praktisi. Yang acak adalah intervalnya (berbeda tiap sampel); parameternya tetap. Jika kamu ingin pernyataan 95% peluang tentang parameternya, itu wilayah Bayesian (credible interval).",
      },
      reference: "CI ≠ 95% data ada di dalamnya. Untuk observasi individu pakai interval prediksi.",
    },
    {
      id: "wilson",
      eyebrow: "Langkah 3 · Interval Wilson",
      title: "Perbaikan yang hampir selalu menang",
      prose: [
        "Interval skor Wilson membalik logika Wald: alih-alih memakai SE dari p̂ teramati, ia menyelesaikan pertidaksamaan skor untuk p. Intuisinya: Wilson seolah menambahkan observasi semu (≈ 4 untuk 95%) yang terbagi rata antara sukses dan gagal — menarik estimasi sedikit ke 0,5 dan melebarkan interval saat n kecil.",
        "Untuk 2 sukses dari 50: Wilson memberi (1,1%, 13,5%) — seluruhnya di wilayah masuk akal, tidak pernah negatif. Sifatnya: tidak pernah overshoot keluar [0,1]; untuk x = 0 memberi (0, ~7%) — jujur mengakui ketidakpastian, bukan (0, 0); cakupannya mendekati 95% di hampir semua p dan n. Saat n besar, Wilson ≈ Wald — jadi tidak ada ruginya.",
      ],
      formula: String.raw`\text{Wilson: selesaikan } \frac{(\hat{p} - p)^2}{p(1-p)/n} \le z^2 \text{ untuk } p`,
      formulaNote: "p-hat = proporsi teramati; p = proporsi sebenarnya yang dicari; n = ukuran sampel; z = kuantil normal (1,96 untuk 95 persen); selesaikan pertidaksamaan untuk p — hasilnya interval yang tidak pernah keluar [0,1].",
      tasks: [
        { id: "t1", text: "Hitung batas bawah Wilson untuk x=2, n=50, z=1,96; bulatkan 3 desimal" },
        { id: "t2", text: "Hitung batas atasnya; bulatkan 3 desimal" },
      ],
      expected: "wilson_bawah=0.011  wilson_atas=0.135",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Wilson tidak pernah memberi batas negatif karena dibulatkan ke nol. Salah — solusinya memang selalu di dalam [0,1] karena struktur rumusnya: ia mencari himpunan nilai p yang konsisten dengan data, dan p sebagai proporsi memang hidup di [0,1].",
      },
      hints: [
        "den = 1 + z**2/n; center = (p + z**2/(2*n))/den.",
        "half = z*sqrt(p*(1-p)/n + z**2/(4*n**2))/den.",
        "wilson_bawah = round(center - half, 3); wilson_atas = round(center + half, 3).",
      ],
      code: {
        starter: `import math\nz, n, p = 1.96, 50, 2/50\n\n# TULIS KODEMU\nden = \ncenter = \nhalf = \nwilson_bawah = \nwilson_atas = \n\nprint(f"wilson_bawah={wilson_bawah}  wilson_atas={wilson_atas}")`,
        lockLines: 2,
        solution: `import math\nz, n, p = 1.96, 50, 2/50\n\n# TULIS KODEMU\nden = 1 + z**2/n\ncenter = (p + z**2/(2*n))/den\nhalf = z*math.sqrt(p*(1-p)/n + z**2/(4*n**2))/den\nwilson_bawah = round(center - half, 3)\nwilson_atas = round(center + half, 3)\n\nprint(f"wilson_bawah={wilson_bawah}  wilson_atas={wilson_atas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "wilson_bawah", value: 0.011, tol: 0.001, label: "`wilson_bawah` seharusnya 0.011", msg: "Batas bawah ≈ 1,1% — positif dan masuk akal." },
          { kind: "equal", task: "t2", name: "wilson_atas", value: 0.135, tol: 0.001, label: "`wilson_atas` seharusnya 0.135", msg: "Batas atas ≈ 13,5%." },
          { kind: "stdout_matches", task: "t2", pattern: "wilson_bawah=0\\.011\\s+wilson_atas=0\\.135", label: "`print` menampilkan keduanya", msg: "Format: wilson_bawah=...  wilson_atas=... ." },
        ],
      },
      reference: "Brown, Cai & DasGupta (2001): Wilson untuk n ≤ 40; Wald hanya untuk n besar.",
    },
    {
      id: "wald-ok",
      eyebrow: "Langkah 4 · Kapan Wald masih OK",
      title: "Di tengah dengan n besar, Wald baik-baik saja",
      prose: [
        "Wald layak saat n besar dan p jauh dari 0/1 — aproksimasi normal valid dan Wald ≈ Wilson. Contoh: survei n = 1.067, 560 mendukung kandidat A → p̂ ≈ 52,5%. SE ≈ 1,53 poin; margin ≈ 3,0 poin; interval (49,5%, 55,5%). Keretakan hanya muncul di tepi — dan data bisnis (konversi, fraud rate, default rate) sering hidup di tepi.",
        "Aturan praktis: metrik langka (fraud 1%, default 3%, konversi 2%) → Wilson. Survei besar dengan p di tengah (30–70%) → Wald boleh. Ragu? Wilson tidak pernah rugi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p` = 560/1067 dan `se` = √(p(1−p)/1067), bulatkan se 4 desimal" },
        { id: "t2", text: "Hitung `bawah` dan `atas` Wald 95%, bulatkan 3 desimal" },
      ],
      expected: "p=0.5248  se=0.0153  bawah=0.495  atas=0.555",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk metrik langka, Wald sistematis terlalu percaya diri — cakupan aktualnya bisa anjlok ke ~68% saat p kecil. Interval 95% yang sebenarnya hanya 68% membuat keputusan risiko terlihat jauh lebih aman dari kenyataannya.",
      },
      hints: [
        "p = 560 / 1067; se = round(math.sqrt(p*(1-p)/1067), 4).",
        "margin = 1.96 * se (pakai se tanpa pembulatan).",
        "bawah = round(p - 1.96*math.sqrt(p*(1-p)/1067), 3); atas analog.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\np = \nse = \nbawah = \natas = \n\nprint(f"p={round(p,4)}  se={se}  bawah={bawah}  atas={atas}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\np = 560/1067\nse = round(math.sqrt(p*(1-p)/1067), 4)\nbawah = round(p - 1.96*math.sqrt(p*(1-p)/1067), 3)\natas = round(p + 1.96*math.sqrt(p*(1-p)/1067), 3)\n\nprint(f"p={round(p,4)}  se={se}  bawah={bawah}  atas={atas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.5248, tol: 0.0001, label: "`p` seharusnya 0.5248", msg: "560/1067 ≈ 52,5%." },
          { kind: "equal", task: "t1", name: "se", value: 0.0153, tol: 0.0001, label: "`se` seharusnya 0.0153", msg: "SE ≈ 1,53 poin." },
          { kind: "equal", task: "t2", name: "bawah", value: 0.495, tol: 0.001, label: "`bawah` seharusnya 0.495", msg: "Batas bawah ≈ 49,5%." },
          { kind: "equal", task: "t2", name: "atas", value: 0.555, tol: 0.001, label: "`atas` seharusnya 0.555", msg: "Batas atas ≈ 55,5%." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.5248\\s+se=0\\.0153\\s+bawah=0\\.495\\s+atas=0\\.555", label: "`print` menampilkan semuanya", msg: "Format: p=...  se=...  bawah=...  atas=... ." },
        ],
      },
      reference: "Di tengah dengan n besar, Wald ≈ Wilson — masalahnya hanya di tepi.",
    },
    {
      id: "mean-t-pi",
      eyebrow: "Langkah 5 · Interval untuk mean",
      title: "Distribusi-t dan kembarannya yang berbahaya",
      prose: [
        "Untuk mean dengan σ tak diketahui (kasus umum): x̄ ± t·s/√n. Untuk n besar (≈ 30+) t ≈ 1,96; untuk n kecil t lebih besar — ekor lebih tebal = lebih jujur soal ketidakpastian. Contoh: mean 8,2; s = 1,5; n = 10 → t(df=9) = 2,262 → 8,2 ± 1,07 = (7,13; 9,27).",
        "Kembaran yang sering tertukar: interval prediksi menjawab di mana observasi berikutnya akan jatuh — jauh lebih lebar karena mencakup variasi individu. CI sempit menjawab di mana mean populasi. Tertukar keduanya = bencana: melaporkan CI sebagai rentang nilai pelanggan berikutnya meremehkan risiko drastis. Lebar CI menyusut dengan √n — tapi yang menyempit hanya ketidakpastian tentang mean; variasi individu (s) tetap sama.",
      ],
      tasks: [
        { id: "t1", text: "Catat `t` = 2,262 (kuantil-t df=9, 95%)" },
        { id: "t2", text: "Hitung `margin` = t·1,5/√10, bulatkan 2 desimal" },
        { id: "t3", text: "Hitung `bawah` = 8,2 − margin (tanpa pembulatan), bulatkan 2 desimal" },
      ],
      expected: "t=2.262  margin=1.07  bawah=7.13",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Selalu pakai 1,96 untuk CI mean. Salah: 1,96 hanya untuk n besar atau σ diketahui. Untuk n kecil pakai kuantil-t — lebih besar, lebih jujur. Memakai 1,96 pada n=10 membuat interval palsu-sempit.",
      },
      hints: [
        "t = 2.262 dari tabel t df=9.",
        "margin = round(2.262*1.5/math.sqrt(10), 2).",
        "bawah = round(8.2 - 2.262*1.5/math.sqrt(10), 2).",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nt = \nmargin = \nbawah = \n\nprint(f"t={t}  margin={margin}  bawah={bawah}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nt = 2.262\nmargin = round(t*1.5/math.sqrt(10), 2)\nbawah = round(8.2 - t*1.5/math.sqrt(10), 2)\n\nprint(f"t={t}  margin={margin}  bawah={bawah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "t", value: 2.262, tol: 1e-9, label: "`t` seharusnya 2.262", msg: "Kuantil-t df=9 untuk 95%." },
          { kind: "equal", task: "t2", name: "margin", value: 1.07, tol: 0.01, label: "`margin` seharusnya 1.07", msg: "Margin ≈ 1,07." },
          { kind: "equal", task: "t3", name: "bawah", value: 7.13, tol: 0.01, label: "`bawah` seharusnya 7.13", msg: "8,2 − 1,07 = 7,13." },
          { kind: "stdout_matches", task: "t3", pattern: "t=2\\.262\\s+margin=1\\.07\\s+bawah=7\\.13", label: "`print` menampilkan ketiganya", msg: "Format: t=...  margin=...  bawah=... ." },
        ],
      },
      reference: "CI menjawab di mana mean; interval prediksi menjawab di mana observasi berikutnya.",
    },
    {
      id: "minicase-klaim",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Klaim kemenangan yang belum waktunya",
      prose: [
        "Tim growth mengklaim landing page baru menaikkan konversi dari 3% ke 4%. Datanya: halaman lama 15 pendaftar dari 500 (3,0%), halaman baru 2 dari 50 (4,0%). (a) Wilson 95% halaman baru: (1,1%, 13,5%) — selebar 12,4 poin! Halaman lama: (1,8%, 4,9%).",
        "(b) Klaim tidak didukung: interval halaman baru mencakup 3% — bahkan mencakup hampir seluruh interval halaman lama. 4% > 3% hanyalah noise dari n=50. Mengumumkan kemenangan sekarang = merayakan keacakan. (c) Agar margin ≤ 1 poin: n = z²·p(1−p)/m² ≈ 1.476 pengunjung — ~30× dari yang ada. Pelajaran: jangan umumkan hasil sebelum menghitung berapa data yang dibutuhkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lebar_baru` = 13,5 − 1,1 (lebar interval halaman baru, poin)" },
        { id: "t2", text: "Hitung `n_butuh` = ceil(3,8416·0,04·0,96/0,0001) untuk margin ≤ 1 poin" },
      ],
      expected: "lebar_baru=12.4  n_butuh=1476",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mengumumkan kemenangan ke direksi dari n=50 adalah keputusan berbasis noise. Aturan defensibel: hitung dulu berapa sampel yang dibutuhkan untuk margin yang bisa dipertanggungjawabkan — sebelum eksperimen, bukan sesudah.",
      },
      hints: [
        "lebar_baru = 13.5 - 1.1.",
        "n_butuh = math.ceil(3.8416*0.04*0.96/0.0001).",
        "Hasilnya ~1.476 — 30× dari n=50.",
      ],
      code: {
        starter: `import math\n\n# TULIS KODEMU\nlebar_baru = \nn_butuh = \n\nprint(f"lebar_baru={lebar_baru}  n_butuh={n_butuh}")`,
        lockLines: 1,
        solution: `import math\n\n# TULIS KODEMU\nlebar_baru = round(13.5 - 1.1, 1)\nn_butuh = math.ceil(3.8416*0.04*0.96/0.0001)\n\nprint(f"lebar_baru={lebar_baru}  n_butuh={n_butuh}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lebar_baru", value: 12.4, tol: 0.01, label: "`lebar_baru` seharusnya 12.4", msg: "Interval selebar 12,4 poin — klaim 1 poin tenggelam di noise." },
          { kind: "equal", task: "t2", name: "n_butuh", value: 1476, tol: 1, label: "`n_butuh` seharusnya 1476", msg: "Butuh ~1.476 pengunjung untuk margin 1 poin." },
          { kind: "stdout_matches", task: "t2", pattern: "lebar_baru=12\\.4\\s+n_butuh=1476", label: "`print` menampilkan keduanya", msg: "Format: lebar_baru=...  n_butuh=... ." },
        ],
      },
      reference: "Uji formal perbandingan dua proporsi ada di A2.4–A2.5.",
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
        "95% adalah sifat prosedur dalam pengulangan, bukan peluang untuk interval spesifik.",
        "Wald retak di tepi: overshoot, zero-width, cakupan anjlok.",
        "Wilson hampir selalu lebih baik: tidak pernah keluar [0,1], jujur saat x=0.",
        "CI mean pakai t untuk n kecil; jangan tertukar dengan interval prediksi.",
        "Hitung sampel yang dibutuhkan sebelum mengumumkan hasil.",
      ],
      next: { label: "A2.4 — Uji Hipotesis", href: "/v2/learn/a24-uji-hipotesis" },
      quiz: [
        {
          q: "Interval kepercayaan 95% untuk PD adalah (2,1%, 4,3%). Interpretasi yang BENAR?",
          options: [
            { text: "Ada 95% peluang PD sebenarnya ada di antara 2,1% dan 4,3%", why: "Miskonsepsi paling umum — parameter frequentist itu tetap, bukan acak." },
            { text: "95% nasabah punya PD di rentang itu", why: "CI tentang parameter populasi, bukan tentang individu." },
            { text: "Prosedur ini, dalam pengulangan, menghasilkan interval yang mencakup PD sebenarnya 95% dari waktu", why: "95% adalah sifat prosedurnya dalam jangka panjang.", correct: true },
            { text: "PD pasti tepat 3,2% (tengah interval)", why: "Tengah interval bukan estimasi yang dijamin — interval soal rentang." },
          ],
        },
        {
          q: "Dari 40 transaksi, 0 terindikasi fraud. Interval Wald 95% memberi (0%, 0%). Apa masalahnya?",
          options: [
            { text: "Tidak ada masalah — memang tidak ada fraud", why: "Nol kejadian dalam 40 percobaan bukan berarti peluangnya nol." },
            { text: "Zero-width: mengklaim kepastian sempurna dari 40 observasi; Wilson memberi (0%, 8,8%) yang jujur", why: "Wald runtuh karena SE = 0; 'tidak terlihat' ≠ 'tidak ada'.", correct: true },
            { text: "Sampelnya terlalu besar", why: "40 bukan besar — dan masalahnya bukan ukuran sampel." },
            { text: "Harus pakai interval 99%", why: "99% Wald juga memberi (0, 0) — masalahnya rumusnya, bukan levelnya." },
          ],
        },
        {
          q: "Kapan interval Wald masih layak dipakai?",
          options: [
            { text: "Selalu — ia rumus standar", why: "Di tepi ia retak: overshoot, zero-width, cakupan anjlok." },
            { text: "n besar dan p jauh dari 0/1 (misal survei 1.000+ responden, p ~ 30–70%)", why: "Di tengah dengan n besar, aproksimasi normal valid dan Wald ≈ Wilson.", correct: true },
            { text: "n kecil dan p ekstrem", why: "Itu persis kondisi terburuk Wald." },
            { text: "Tidak pernah", why: "Terlalu keras — di tengah dengan n besar ia baik-baik saja." },
          ],
        },
        {
          q: "Mengapa interval Wilson tidak pernah memberi batas negatif?",
          options: [
            { text: "Karena dibulatkan ke nol", why: "Bukan pembulatan — struktur rumusnya yang menjamin." },
            { text: "Karena ia menyelesaikan pertidaksamaan skor untuk p, yang solusinya selalu di dalam [0,1]", why: "Ia mencari nilai p yang konsisten dengan data — dan p hidup di [0,1].", correct: true },
            { text: "Karena n selalu besar", why: "Wilson justru unggul saat n kecil." },
            { text: "Karena memakai distribusi-t", why: "Wilson tidak memakai distribusi-t." },
          ],
        },
        {
          q: "Manajer minta 'rentang waktu penyelesaian tiket berikutnya'. Kamu punya mean 4 jam, s = 2 jam, n = 100. Yang tepat dilaporkan?",
          options: [
            { text: "CI mean: 4 ± 0,39 jam", why: "Itu menjawab di mana rata-ratanya — sangat sempit untuk janji per tiket." },
            { text: "Interval prediksi: 4 ± ~4 jam — karena yang ditanya observasi individual, bukan mean", why: "Interval prediksi mencakup variasi individu; tertukar = SLA mustahil.", correct: true },
            { text: "Median saja", why: "Median satu angka — bukan rentang." },
            { text: "Tidak bisa dihitung", why: "Bisa: interval prediksi ≈ x̄ ± t·s·√(1+1/n)." },
          ],
        },
      ],
      note: {
        title: "Intuisi: interval kepercayaan adalah pengakuan ketidakpastian yang terukur",
        body: "Lima heuristik. Satu: yang 95 persen adalah prosedurnya, bukan intervalmu — kalimat yang benar adalah “prosedur ini mencakup nilai benar dalam 95 persen pengulangan”, bukan “ada 95 persen peluang nilai benar di sini”. Dua: lebar interval adalah ukuran kejujuran — CI yang lebar berkata “dataku belum cukup untuk klaim presisi”; jangan malu pada interval lebar, malulah pada klaim sempit dari data sedikit. Tiga: Wald retak di tepi-tepi — untuk proporsi langka atau n kecil, Wilson hampir selalu menang dan tidak pernah rugi; jadikan default. Empat: interval yang mencakup nol berarti “belum terbukti”, bukan “terbukti nol” — ketiadaan bukti bukan bukti ketiadaan; bedakan keduanya di depan direksi. Lima: jangan tertukar antara interval kepercayaan dan interval prediksi — yang satu menebak di mana mean populasi, yang lain menebak di mana observasi berikutnya jatuh; tertukar berarti janji yang salah kepada pengambil keputusan. Enam: bandingkan interval, bukan titik — dua estimasi yang intervalnya tumpang tindih lebar belum tentu berbeda; klaim kemenangan butuh interval yang terpisah dengan jelas.",
      },
    },
  ],
};
