import type { V2Lesson } from "../lib/types";

// Goodhart: sebelum insentif (korelasi +) vs sesudah (korelasi runtuh).
const GOODHART_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Dua scatter plot: sebelum insentif korelasi positif, sesudah insentif korelasi hilang.">
<g font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">
<text x="130" y="22" text-anchor="middle">Sebelum insentif</text>
<text x="390" y="22" text-anchor="middle">Sesudah insentif</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="20" y1="200" x2="240" y2="200"/><line x1="20" y1="40" x2="20" y2="200"/>
<line x1="280" y1="200" x2="500" y2="200"/><line x1="280" y1="40" x2="280" y2="200"/>
</g>
<g fill="var(--c1)" opacity="0.75">
<circle cx="60" cy="170" r="3.5"/><circle cx="80" cy="160" r="3.5"/><circle cx="100" cy="150" r="3.5"/><circle cx="120" cy="140" r="3.5"/><circle cx="140" cy="132" r="3.5"/><circle cx="160" cy="120" r="3.5"/><circle cx="180" cy="112" r="3.5"/><circle cx="200" cy="100" r="3.5"/><circle cx="220" cy="92" r="3.5"/><circle cx="90" cy="168" r="3.5"/><circle cx="150" cy="128" r="3.5"/><circle cx="190" cy="106" r="3.5"/>
</g>
<line x1="45" y1="178" x2="230" y2="86" stroke="var(--c1)" stroke-width="2.5"/>
<text x="130" y="224" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">tiket/jam →</text>
<text x="130" y="238" text-anchor="middle" font-size="11" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">korelasi +0,69</text>
<g fill="var(--c4)" opacity="0.75">
<circle cx="320" cy="150" r="3.5"/><circle cx="340" cy="120" r="3.5"/><circle cx="360" cy="170" r="3.5"/><circle cx="380" cy="110" r="3.5"/><circle cx="400" cy="160" r="3.5"/><circle cx="420" cy="130" r="3.5"/><circle cx="440" cy="180" r="3.5"/><circle cx="460" cy="100" r="3.5"/><circle cx="480" cy="150" r="3.5"/><circle cx="350" cy="140" r="3.5"/><circle cx="410" cy="120" r="3.5"/><circle cx="450" cy="170" r="3.5"/>
</g>
<line x1="300" y1="145" x2="490" y2="140" stroke="var(--c4)" stroke-width="2.5"/>
<text x="390" y="224" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">tiket/jam →</text>
<text x="390" y="238" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">korelasi -0,16 (runtuh)</text>
<g font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">
<text x="8" y="120" transform="rotate(-90 8 120)" text-anchor="middle">kualitas</text>
<text x="268" y="120" transform="rotate(-90 268 120)" text-anchor="middle">kualitas</text>
</g>
</svg>`;

export const biz5: V2Lesson = {
  slug: "biz5-kpi",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI5 — KPI yang Tidak Bisa Di-gaming",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "KPI tercapai 98%, pelanggan kabur",
      prose: [
        "Tim CS PT SinarJaya diberi KPI baru: rata-rata waktu penanganan tiket di bawah 5 menit, bonus 20% kalau tercapai. Tiga bulan kemudian KPI tercapai 98%. Direksi puas — sampai melihat CSAT: anjlok dari 4,2 ke 2,9.",
        "Yang terjadi: agen menutup tiket secepatnya tanpa menyelesaikan masalah. Pelanggan harus buka tiket baru 2-3 kali untuk satu masalah. Waktu per tiket turun, jumlah tiket meledak, pelanggan marah.",
        "Twist-nya: tidak ada agen yang \u201Cnakal\u201D. Mereka hanya melakukan persis apa yang diinsentifkan. Sistemnya yang mengajarkan perilaku itu. Inilah Goodhart's law: saat sebuah ukuran menjadi target, ia berhenti menjadi ukuran yang baik.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan Goodhart's law dengan simulasi; (2) merancang KPI dengan counter-metric; (3) membedakan leading vs lagging indicator; (4) memilih North Star dan input metrics yang tahan gaming.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang KPI yang tahan terhadap gaming dan mendeteksi Goodhart sejak dini.",
        "(1) Menjelaskan Hukum Goodhart dengan contoh angka: korelasi metrik-tujuan yang patah setelah insentif;",
        "(2) Memasangkan setiap KPI dengan counter-metric yang tidak diinsentifkan dan membaca divergensinya;",
        "(3) Menghitung penurunan korelasi sebelum vs sesudah intervensi sebagai bukti gaming;",
        "(4) Menolak KPI yang 'bagus di spreadsheet, beracun di lapangan' dengan argumen kuantitatif.",
      ],
      tasks: [],
    },

    {
      id: "goodhart",
      eyebrow: "Langkah 3 · Goodhart's law",
      title: "Goodhart: korelasi yang mati saat diinsentifkan",
      prose: [
        "Sebelum insentif, \u201Ctiket per jam\u201D berkorelasi +0,69 dengan kualitas penyelesaian — agen cepat memang cenderung terampil. Masuk akal menjadikannya KPI. Sesudah insentif, korelasi runtuh ke -0,16: tiket/jam naik 54% (20,1 → 30,9) sementara kualitas anjlok 34% (0,71 → 0,47).",
        "Mekanismenya tiga tahap: (1) proxy — metrik adalah proksi dari outcome yang sulit diukur; (2) tekanan — insentif membuat orang mengoptimalkan proksi, bukan outcome; (3) putus — hubungan proksi-outcome yang dulu alami kini direkayasa.",
        "Kepribadian: Goodhart adalah \u201Cjin lampu\u201D — ia mengabulkan permintaanmu secara harfiah. Minta \u201Ctiket cepat\u201D, dapat tiket cepat — plus pelanggan marah yang tidak kamu minta.",
        "💡 Intuisi kunci: uji KPI sebelum diluncurkan dengan pertanyaan: \u201Cbagaimana orang cerdas tapi malas mencapai target ini TANPA memperbaiki outcome?\u201D Kalau jawabannya mudah ditemukan dalam 2 menit, KPI-nya akan di-gaming dalam 2 bulan.",
        "Cara membaca: dua scatter plot berdampingan — kiri 'sebelum insentif', kanan 'sesudah insentif'. Sumbu X = metrik yang diinsentifkan, sumbu Y = tujuan sebenarnya. Titik-titik kiri membentuk garis naik; titik-titik kanan menyebar acak.",
        "Interpretasi: hubungan yang tadinya kuat (kiri) hancur setelah insentif (kanan) — inilah Hukum Goodhart divisualkan. Metrik yang sama, hubungan yang berbeda: yang berubah bukan datanya, melainkan perilaku manusia terhadap metriknya.",
      ],
      formula: String.raw`\rho(M, O \mid \text{alami}) > 0 \quad\Rightarrow\quad \rho(M, O \mid \text{diinsentifkan}) \approx 0`,
      formulaNote:
        "M = metrik (proksi), O = outcome sebenarnya, ρ = korelasi. Saat alami, metrik berkorelasi positif dengan outcome. Setelah metrik dijadikan target insentif, korelasinya runtuh mendekati nol (atau negatif) — metrik membaik, outcome memburuk.",
      figure: {
        svg: GOODHART_SVG,
        alt: "Dua scatter plot: sebelum insentif korelasi positif 0,69, sesudah insentif korelasi -0,16.",
        caption: "Hukum Goodhart divisualkan: metrik yang sama, hubungan yang berbeda — sebelum vs sesudah dijadikan target.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: gaming = orangnya tidak berintegritas",
        body: "Menyalahkan agen adalah jalan pintas yang salah. Perilaku mengikuti insentif — itu rasional, bukan amoral. Desainer KPI yang harus bertanggung jawab: ia menciptakan permainan, pemain hanya memainkannya. Perbaiki permainannya (tambah counter-metric), bukan pemainnya.",
      },
    },
    {
      id: "counter-metric",
      eyebrow: "Langkah 4 · Counter-metric",
      title: "Counter-metric: rem untuk tiap gas",
      prose: [
        "Setiap KPI butuh pasangan yang mengerem penyalahgunaannya — counter-metric. KPI \u201Ctiket/jam\u201D dipasangkan \u201Creopen rate\u201D (tiket dibuka ulang). Agen yang asal tutup akan terlihat di reopen rate yang meledak.",
        "Pola pasangan klasik: kecepatan ↔ kualitas (waktu tangani ↔ CSAT), volume ↔ nilai (jumlah deal ↔ margin), akuisisi ↔ retensi (user baru ↔ churn 30 hari), efisiensi ↔ risiko (biaya ↔ defect rate).",
        "Leading vs lagging: revenue adalah lagging — ia memberitahu apa yang SUDAH terjadi. Conversion checkout adalah leading — ia memprediksi revenue. Dashboard butuh keduanya: leading untuk bertindak, lagging untuk validasi.",
        "North Star + input metrics: satu North Star (mis. \u201Ctransaksi berhasil per minggu\u201D) ditopang 3-5 input metrics yang bisa dipengaruhi tim (conversion, avg ticket, traffic). Tim mengoptimasi input; North Star dijaga dari gaming dengan counter-metric.",
        "💡 Intuisi kunci: KPI tanpa counter-metric seperti mobil dengan gas tapi tanpa rem. Sebelum presentasi KPI ke direksi, selalu siapkan slide \u201Cbagaimana KPI ini bisa disalahgunakan, dan metrik apa yang akan menangkapnya\u201D.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: satu KPI cukup untuk satu tim",
        body: "Satu KPI tanpa pasangan adalah undangan gaming. Minimal: 1 outcome metric + 1 counter-metric + 1-2 input metrics yang bisa ditindaklanjuti. Paket ini yang membuat \u201Ctercapai 98%\u201D menjadi klaim yang bisa dipercaya.",
      },
    },
    {
      id: "lab-goodhart",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: saksikan korelasi mati",
      prose: [
        "Simulasi 300 agen (seed 13). Tiap agen punya skill; sebelum insentif, tiket/jam berkorelasi dengan kualitas. Sesudah insentif tiket/jam, agen me-gaming: tiket naik, kualitas turun. Tugasmu: (1) implementasikan korelasi Pearson; (2) hitung `corr_pre` dan `corr_post`; (3) hitung `drop` dan cetak ketiganya.",
        "Coba juga: ubah kekuatan gaming (0.022 → 0.04). Pada titik berapa corr_post menjadi negatif? Itulah \u201Ctitik racun\u201D insentif — berguna saat kalibrasi bonus nyata.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `pearson(xs, ys)`, hitung `corr_pre`" },
        { id: "t2", text: "Simulasikan fase gaming, hitung `corr_post`" },
        { id: "t3", text: "Hitung `drop = corr_pre - corr_post`, cetak" },
      ],
      expected: "corr_pre=0.688  corr_post=-0.158  drop=0.847",
      note: {
        title: "Sering salah",
        body: "Lupa bahwa gaming berkorelasi negatif dengan skill (agen kurang terampil gaming lebih agresif). Kalau gaming-nya acak merata, efek Goodhart-nya melemah — padahal di dunia nyata yang paling tertekan target adalah yang paling kreatif mencari jalan pintas.",
      },
      hints: [
        "pearson: cov/(sx*sy) dengan mean dikurangi dulu.",
        "Fase gaming: game = uniform(6,16) - 2*skill; tiket_post = tiket_pre + game; qual_post = max(0.05, qual_pre - 0.022*game).",
        "drop = corr_pre - corr_post.",
      ],
      code: {
        starter: `import random, math\nrandom.seed(13)\nN = 300\n\ndef pearson(xs, ys):\n    # TULIS: korelasi Pearson\n    return 0.0\n\nskill = [random.gauss(0, 1) for _ in range(N)]\ntiket_pre = [20 + 3*s + random.gauss(0, 2) for s in skill]\nqual_pre = [0.70 + 0.08*s + random.gauss(0, 0.05) for s in skill]\n\n# TULIS KODEMU: fase gaming -> tiket_post, qual_post, corr_pre, corr_post, drop\ntiket_post = []\nqual_post = []\ncorr_pre = 0.0\ncorr_post = 0.0\ndrop = 0.0\n\nprint(f"corr_pre={corr_pre:.3f}  corr_post={corr_post:.3f}  drop={drop:.3f}")`,
        lockLines: 10,
        solution: `import random, math\nrandom.seed(13)\nN = 300\n\ndef pearson(xs, ys):\n    n = len(xs)\n    mx = sum(xs) / n\n    my = sum(ys) / n\n    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))\n    vx = sum((x - mx) ** 2 for x in xs)\n    vy = sum((y - my) ** 2 for y in ys)\n    return cov / math.sqrt(vx * vy)\n\nskill = [random.gauss(0, 1) for _ in range(N)]\ntiket_pre = [20 + 3*s + random.gauss(0, 2) for s in skill]\nqual_pre = [0.70 + 0.08*s + random.gauss(0, 0.05) for s in skill]\n\n# TULIS KODEMU: fase gaming -> tiket_post, qual_post, corr_pre, corr_post, drop\ngame = [random.uniform(6, 16) - 2*s for s in skill]\ntiket_post = [t + g for t, g in zip(tiket_pre, game)]\nqual_post = [max(0.05, q - 0.022*g) for q, g in zip(qual_pre, game)]\ncorr_pre = pearson(tiket_pre, qual_pre)\ncorr_post = pearson(tiket_post, qual_post)\ndrop = corr_pre - corr_post\n\nprint(f"corr_pre={corr_pre:.3f}  corr_post={corr_post:.3f}  drop={drop:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "corr_pre", value: 0.688, tol: 0.005, label: "`corr_pre` = 0.688", msg: "Korelasi alami tiket vs kualitas. Cek rumus Pearson." },
          { kind: "equal", task: "t2", name: "corr_post", value: -0.158, tol: 0.01, label: "`corr_post` = -0.158", msg: "Setelah gaming, korelasi runtuh. Cek formula fase gaming." },
          { kind: "equal", task: "t3", name: "drop", value: 0.847, tol: 0.01, label: "`drop` = 0.847", msg: "corr_pre - corr_post." },
          { kind: "stdout_matches", task: "t3", pattern: "corr_pre=0\\.688\\s+corr_post=-0\\.158\\s+drop=0\\.847", label: "`print` menampilkan ketiganya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "Pearson = cov(x,y) / (std_x * std_y). max(0.05, ...) menjaga kualitas tak negatif.",
    },    {
      id: "lab2-counter-metric",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: counter-metric menangkap Goodhart",
      prose: [
        "Skor CS naik dari 84 ke 93 setelah insentif — kemenangan? Counter-metric berkata lain: kepuasan pelanggan sebenarnya TURUN dari 83.8 ke 77.0. Metrik yang diinsentifkan berhenti mengukur dan mulai dimainkan.",
        "Tugasmu: hitung korelasi skor CS vs kepuasan sebelum dan sesudah insentif (minggu 1–10 vs 11–20), plus berapa persen kepuasan yang hilang.",
        "Inilah kenapa tiap KPI butuh counter-metric (pasangannya yang tidak diinsentifkan): kalau keduanya bergerak berlawanan, ada yang sedang di-gaming.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `pearson(xs, ys)`" },
        { id: "t2", text: "Hitung `corr_pre` (minggu 1–10) dan `corr_post` (11–20), 3 desimal" },
        { id: "t3", text: "Hitung `rugi_persen`: penurunan rata-rata kepuasan, 1 desimal" },
      ],
      expected: "corr_pre=0.898  corr_post=-0.206",
      note: {
        title: "Sering salah",
        body: "Menghitung korelasi seluruh 20 minggu sekaligus — hasilnya 'lumayan' dan menyembunyikan patahnya hubungan. Potong tepat di titik insentif dimulai.",
      },
      hints: [
        "pearson = cov / sqrt(var_x * var_y).",
        "Iris: skor_cs[:10] vs kepuasan[:10] untuk pre; [10:] untuk post.",
        "rugi_persen = (rata_pre - rata_post) / rata_pre * 100.",
      ],
      code: {
        starter: `# Skor CS (yang diinsentifkan) vs kepuasan pelanggan sebenarnya (survei), 20 minggu.\n# Insentif "skor CS >= 90" mulai minggu ke-11.\nskor_cs   = [82, 84, 83, 85, 84, 86, 83, 85, 84, 86,\n             91, 92, 93, 91, 94, 92, 93, 95, 92, 94]\nkepuasan  = [81.4, 83.7, 82.9, 85.3, 83.7, 86.3, 80.6, 83.9, 84.3, 85.4,\n             79.6, 76.3, 77.6, 76.5, 77.6, 77.5, 75.2, 75.8, 75.9, 78.3]\n# TULIS KODEMU: corr_pre, corr_post, rugi_persen\ncorr_pre, corr_post = 0.0, 0.0\nrugi_persen = 0.0\n`,
        lockLines: 6,
        solution: `# Skor CS (yang diinsentifkan) vs kepuasan pelanggan sebenarnya (survei), 20 minggu.\n# Insentif "skor CS >= 90" mulai minggu ke-11.\nskor_cs   = [82, 84, 83, 85, 84, 86, 83, 85, 84, 86,\n             91, 92, 93, 91, 94, 92, 93, 95, 92, 94]\nkepuasan  = [81.4, 83.7, 82.9, 85.3, 83.7, 86.3, 80.6, 83.9, 84.3, 85.4,\n             79.6, 76.3, 77.6, 76.5, 77.6, 77.5, 75.2, 75.8, 75.9, 78.3]\n\n# TULIS KODEMU: pearson, corr_pre, corr_post, rugi_persen\ndef pearson(xs, ys):\n    n = len(xs)\n    mx, my = sum(xs) / n, sum(ys) / n\n    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))\n    vx = sum((x - mx) ** 2 for x in xs); vy = sum((y - my) ** 2 for y in ys)\n    return cov / (vx * vy) ** 0.5\n\ncorr_pre = round(pearson(skor_cs[:10], kepuasan[:10]), 3)\ncorr_post = round(pearson(skor_cs[10:], kepuasan[10:]), 3)\nrugi_persen = round((sum(kepuasan[:10]) / 10 - sum(kepuasan[10:]) / 10) / (sum(kepuasan[:10]) / 10) * 100, 1)\n\nprint(f"corr_pre={corr_pre}  corr_post={corr_post}")\nprint(f"rugi_persen={rugi_persen}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "corr_pre=0\\.898", label: "`corr_pre` = 0,898", msg: "Korelasi kuat sebelum insentif." },
          { kind: "stdout_matches", task: "t2", pattern: "corr_post=-0\\.206", label: "`corr_post` = −0,206", msg: "Hubungan hancur setelah insentif." },
          { kind: "equal", task: "t3", name: "rugi_persen", value: 8.0, tol: 0.05, label: "`rugi_persen` = 8,0", msg: "Kepuasan turun 8% setelah insentif." },
        ],
      },
      reference: "Korelasi sebelum vs sesudah intervensi: pola standar deteksi Goodhart.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Setiap KPI yang diinsentifkan butuh 'pasangan pengawas' yang TIDAK diinsentifkan. KPI tanpa counter-metric seperti mobil tanpa rem: makin kencang makin berbahaya.",
        "💡 Waspadai KPI yang tiba-tiba 'membaik' tepat setelah insentif diumumkan. Perilaku manusia beradaptasi lebih cepat dari sistem pengukuran — korelasi yang patah adalah sidik jarinya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: red-team setiap KPI sebelum diumumkan",
        body: "Sebelum KPI baru diumumkan ke tim, luangkan 30 menit untuk permainan ini: kumpulkan 2–3 orang dan tantang mereka menemukan lima cara \"curang\" mencapai target tanpa memperbaiki hal yang benar-benar diinginkan bisnis. Kalau mereka menemukan cara mudah dalam 10 menit, KPI-mu rusak sejak lahir — dan tim yang diinsentifkan akan menemukannya dalam seminggu. Ini bukan sinisme; ini rekayasa insentif. Polanya selalu sama: target \"waktu respons CS <5 menit\" dicurangi dengan menutup tiket lalu membuka tiket baru; target \"penjualan naik 20%\" dicurangi dengan diskon bakar yang menggerus margin; target survei kepuasan dicurangi dengan hanya menyurvei pelanggan yang puas. Heuristik praktisinya: bandingkan \"jalur jujur\" vs \"jalur curang\" — kalau jalur curang lebih mudah DAN tidak terdeteksi, desain ulang KPI-nya sebelum launch, bukan sesudah. Tiga pertanyaan uji: (1) bisakah target dicapai dengan mengorbankan sesuatu yang tidak diukur? (2) apakah datanya berasal dari sistem (log/transaksi) atau laporan manual manusia — karena yang kedua bisa \"dimasak\"; (3) siapa yang mengukur — apakah pengukurnya juga yang diukur? KPI yang lolos red-team biasanya punya dua ciri: diukur dari sistem yang tidak bisa dimanipulasi pelakunya, dan dipasangkan dengan counter-metric yang membuat kecurangan tidak menguntungkan. Tiga puluh menit red-team menghemat tiga bulan damage control.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: merancang paket KPI",
      prose: [
        "Skenario 1 — Tim support (outcome: pelanggan terbantu). → KPI: resolusi sekali sentuh + counter: reopen rate + input: waktu tangani. Jangan pernah waktu tangani sendirian.",
        "Skenario 2 — Tim sales (outcome: revenue berkualitas). → KPI: revenue + counter: margin/diskon rata-rata + input: pipeline coverage. Tanpa counter margin, sales bakar diskon.",
        "Skenario 3 — Tim produk (outcome: retensi). → North Star: WAU/transaksi berhasil + input: activation rate, fitur adoption + counter: churn. Fitur baru yang menaikkan WAU tapi menaikkan churn = gagal.",
        "Skenario 4 — Efisiensi/ops (outcome: biaya turun). → KPI: cost per unit + counter: defect/error rate + input: utilisasi. Efisiensi tanpa counter kualitas = bom waktu.",
        "Skenario 5 — Eksperimen/growth (outcome: belajar cepat). → KPI: kecepatan eksperimen + counter: guardrail metrics (tidak boleh merusak metrik inti). Growth tanpa guardrail = growth hacking yang merusak.",
        "Aturan praktis 10 detik: tiap KPI wajib ditemani counter-metric-nya. Tidak ada pasangan → belum siap diluncurkan.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: sales yang membakar diskon",
      prose: [
        "PT MajuLogistik memberi KPI sales: total nilai kontrak per kuartal. Kuartal 1: tercapai 112% — Rp5,6 miliar dari target Rp5 miliar. Direksi curiga karena margin kotor turun dari 22% ke 14%.",
        "Investigasi: 40% kontrak memakai diskon > 30% (dari biasanya < 10%). Sales menutup deal besar dengan membakar margin. Revenue naik Rp600 juta di atas target, tapi laba kotor turun: 22% × Rp5M = Rp1,10M vs 14% × Rp5,6M = Rp784 juta. Perusahaan \u201Ctumbuh\u201D sambil kehilangan Rp316 juta laba.",
        "Redesain paket KPI: outcome = laba kotor (bukan revenue); counter = rata-rata diskon (alarm jika > 15%); input = pipeline coverage 3x. Sales masih bisa kejar volume — tapi tidak dengan membakar margin.",
        "💡 Intuisi kunci: revenue adalah metrik yang paling mudah di-gaming (diskon, channel stuffing, tarik mundur). Setiap kali melihat revenue sebagai KPI tunggal, tanyakan: \u201Cdengan cara apa revenue ini bisa naik sementara perusahaan merugi?\u201D",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang desain KPI anti-gaming. Setiap opsi menjelaskan jebakannya.",
      ],
      tasks: [],
      summary: [
        "Goodhart: metrik yang jadi target berhenti menjadi ukuran yang baik — korelasi proksi-outcome runtuh.",
        "Uji 2 menit: bagaimana orang cerdas-malasan mencapai target tanpa memperbaiki outcome?",
        "Tiap KPI wajib punya counter-metric (rem untuk tiap gas).",
        "Paket KPI: 1 outcome + 1 counter + 1-2 input yang bisa ditindaklanjuti.",
        "Revenue sebagai KPI tunggal hampir selalu bisa di-gaming — pasangkan dengan margin.",
      ],
      next: { label: "BI6 — Self-Service BI", href: "/v2/learn/biz6-self-service" },
      quiz: [
        {
          q: "KPI tiket/jam tercapai 98% tapi CSAT anjlok 4,2 → 2,9. Diagnosisnya?",
          options: [
            { text: "Agen tidak berintegritas", why: "Menyalahkan pemain, bukan permainan — mereka hanya mengikuti insentif." },
            { text: "Goodhart: proksi dioptimasi, outcome dikorbankan", why: "Tepat: insentif memutus hubungan alami tiket/jam dengan kualitas.", correct: true },
            { text: "Target terlalu rendah", why: "Target rendah tidak menjelaskan anjloknya kualitas." },
            { text: "CSAT salah ukur", why: "CSAT turun konsisten dengan keluhan — ukurannya menangkap realita." },
          ],
        },
        {
          q: "KPI \u201Cwaktu tangani tiket\u201D sendirian. Counter-metric terbaik?",
          options: [
            { text: "Jumlah tiket per agen", why: "Itu metrik volume lain — tidak mengerem gaming kecepatan." },
            { text: "Reopen rate (tiket dibuka ulang)", why: "Tepat: menangkap asal-tutup — tiket yang ditutup prematur akan dibuka lagi.", correct: true },
            { text: "Jumlah agen", why: "Itu input kapasitas, bukan rem kualitas." },
            { text: "Rata-rata gaji agen", why: "Tidak relevan dengan kualitas penanganan." },
          ],
        },
        {
          q: "Revenue naik 12% tapi tiap kohort pelanggan turun. Ini contoh…",
          options: [
            { text: "Goodhart's law", why: "Goodhart soal insentif merusak proksi — bukan ini." },
            { text: "Simpson's paradox (perubahan komposisi)", why: "Tepat: agregat bergerak berlawanan dengan tiap grupnya karena komposisi berubah.", correct: true },
            { text: "Survivorship bias", why: "Berbeda: itu soal sampel yang selamat vs yang hilang." },
            { text: "Regression to the mean", why: "Itu soal nilai ekstrem yang kembali ke rata-rata." },
          ],
        },
        {
          q: "Sebelum meluncurkan KPI baru, uji termurah yang wajib dilakukan?",
          options: [
            { text: "Tanya 2 menit: bagaimana KPI ini bisa dicapai tanpa memperbaiki outcome?", why: "Tepat: uji red-team 2 menit menemukan celah gaming sebelum diluncurkan.", correct: true },
            { text: "Naikkan target 20% untuk keamanan", why: "Target lebih tinggi tidak menutup celah gaming." },
            { text: "Rahasiakan rumus KPI dari tim", why: "KPI rahasia tidak bisa ditindaklanjuti — menghancurkan tujuannya." },
            { text: "Tunggu 6 bulan lalu evaluasi", why: "Terlalu mahal; celah ditemukan saat kerusakan sudah terjadi." },
          ],
        },
        {
          q: "Paket KPI yang paling tahan gaming untuk tim sales?",
          options: [
            { text: "Total kontrak saja", why: "Bisa di-gaming dengan bakar diskon — seperti mini-case." },
            { text: "Laba kotor + counter rata-rata diskon + input pipeline coverage", why: "Tepat: outcome + rem + input yang bisa ditindaklanjuti.", correct: true },
            { text: "Jumlah meeting per minggu", why: "Itu aktivitas, bukan outcome — mudah di-gaming dengan meeting palsu." },
            { text: "Revenue + bonus besar", why: "Bonus besar memperkuat insentif gaming tanpa menambah rem." },
          ],
        },
        {
          q: "Setelah bonus dikaitkan ke 'tiket selesai per hari', tiket selesai naik 40% tapi reopen naik 120%. Diagnosis?",
          options: [
            { text: "Tim support bekerja lebih keras — sukses", why: "Tiket 'selesai' naik karena definisi selesai dilonggarkan (tutup cepat, masalah belum selesai). Reopen 120% adalah sidik jarinya." },
            { text: "Goodhart: metrik di-gaming, counter-metric (reopen) memburuk", why: "Tepat: inilah kenapa tiap KPI butuh pasangan pengawas. Naiknya metrik + buruknya counter-metric = gaming, bukan kinerja.", correct: true },
            { text: "Kebetulan musiman", why: "Kebetulan tidak menghasilkan pola sebesar ini tepat setelah insentif. Waktu adalah bukti." },
            { text: "Butuh target lebih tinggi lagi", why: "Menaikkan target pada metrik yang di-gaming hanya mempercepat kerusakannya." },
          ],
        },
      ],
    },
  ],
};
