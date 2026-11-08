import type { V2Lesson } from "../lib/types";

export const d8_2: V2Lesson = {
  slug: "d8-visualisasi-2",
  track: "Python",
  module: "Visualisasi",
  title: "D8-2 Plotly: Chart Interaktif untuk Dashboard",
  estMinutes: 55,
  steps: [
    {
      id: "express",
      eyebrow: "Langkah 1 · Plotly express",
      title: "Cerita pembuka: 'angka aneh di bulan Maret'",
      prose: [
        "Direksi menunjuk chart statis: ada lonjakan di Maret — transaksi apa itu? Kamu tidak bisa jawab — chart statis tidak bisa di-zoom, tidak ada detail per titik. Chart yang indah tapi tidak bisa diinterogasi adalah poster, bukan alat analisis.",
        "Plotly = chart interaktif: hover untuk detail, zoom untuk investigasi. `px.bar(df, x='kota', y='n', color='status')` — satu baris menjadi chart interaktif penuh. `color=` menambah dimensi ketiga via warna; `facet_col=` memecah subplot per grup. Catatan: plotly tidak tersedia di runtime browser ini — langkah kode memakai struktur figure (dict) yang bisa dicek tanpa render; render penuhnya di Colab dengan `fig.show()`.",
      ],
      tasks: [],
      reference: "px.<chart>(df, x=..., y=..., color=...) untuk cepat; go untuk kustom penuh.",
    },
    {
      id: "struktur-figure",
      eyebrow: "Langkah 2 · Struktur figure",
      title: "Figure adalah dict",
      prose: [
        "Figure plotly pada dasarnya dict dengan dua kunci: `data` (list trace: tipe, x, y, nama) dan `layout` (judul, sumbu). Struktur ini bisa dibangun dan dicek tanpa me-render — persis yang kita lakukan di sini.",
        "Di Colab, kode yang sama menjadi: `import plotly.express as px; fig = px.bar(df, x='kota', y='n', color='npl', title='Nasabah per Kota (warna=NPL)'); fig.show()`. Pola tercepat eksplorasi: `px.histogram(df, x='gaji')` — 5 detik dari data ke chart interaktif.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `fig_dict` dengan kunci `data` dan `layout`" },
        { id: "t2", text: "Cetak JSON-nya dan `tipe_trace` dari trace pertama" },
      ],
      expected: "tipe_trace=bar",
      note: {
        title: "Sering salah",
        body: "Mengira harus selalu me-render untuk tahu figure benar. Struktur dict bisa di-assert: kunci ada, tipe trace benar, panjang x sama dengan panjang y. Verifikasi struktur dulu, render kemudian.",
      },
      hints: [
        'fig_dict = {"data": [...], "layout": {...}}.',
        'Trace: {"type": "bar", "x": data["kota"], "y": data["n"], "name": "Nasabah"}.',
        'tipe_trace = fig_dict["data"][0]["type"]',
      ],
      code: {
        starter: `import json\n\ndata = {\n    "kota": ["Jakarta", "Bandung", "Surabaya", "Medan"],\n    "n": [4, 2, 2, 2],\n    "npl": [0.02, 0.05, 0.03, 0.08],\n}\n\n# TULIS KODEMU: figure sebagai dict\nfig_dict = \ntipe_trace = \n\nprint(json.dumps(fig_dict)[:200])\nprint(f"tipe_trace={tipe_trace}")`,
        lockLines: 7,
        solution: `import json\n\ndata = {\n    "kota": ["Jakarta", "Bandung", "Surabaya", "Medan"],\n    "n": [4, 2, 2, 2],\n    "npl": [0.02, 0.05, 0.03, 0.08],\n}\n\n# TULIS KODEMU: figure sebagai dict\nfig_dict = {\n    "data": [{"type": "bar", "x": data["kota"], "y": data["n"], "name": "Nasabah"}],\n    "layout": {"title": "Nasabah per Kota"},\n}\ntipe_trace = fig_dict["data"][0]["type"]\n\nprint(json.dumps(fig_dict)[:200])\nprint(f"tipe_trace={tipe_trace}")`,
        checks: [
          { kind: "contains", task: "t1", name: "fig_dict", value: "data", label: "`fig_dict` punya kunci 'data'", msg: "Figure = dict dengan kunci 'data' dan 'layout'." },
          { kind: "contains", task: "t1", name: "fig_dict", value: "layout", label: "`fig_dict` punya kunci 'layout'", msg: "Tambahkan kunci 'layout' (judul, dsb.)." },
          { kind: "equal", task: "t2", name: "tipe_trace", value: "bar", label: "`tipe_trace` = 'bar'", msg: "Trace pertama bertipe bar." },
          { kind: "stdout_matches", task: "t2", pattern: "tipe_trace=bar", label: "`print` menampilkan tipe", msg: "Format: tipe_trace=bar." },
        ],
      },
      reference: "Figure = {'data': [trace...], 'layout': {...}}. px untuk cepat, go untuk kustom.",
    },
    {
      id: "dashboard",
      eyebrow: "Langkah 3 · Dashboard mini",
      title: "Susun chart sebagai cerita",
      prose: [
        "Dashboard bukan tumpukan chart acak — ia narasi: masalah, lokasi, penyebab. Tiga chart kesehatan kredit: (1) line NPL 3 bulan — masalahnya; (2) bar bucket 31-60 — lokasinya; (3) scatter vintage — penyebabnya.",
        "Aturan dashboard: 4-6 chart per layar, tiap chart 1 pesan, judul = kesimpulan ('NPL naik 0.5pp dalam 3 bulan', bukan 'NPL per kuartal'). Judul sebagai kesimpulan langsung memberi insight.",
      ],
      tasks: [
        { id: "t1", text: "Susun list `dashboard` berisi 3 dict, hitung `n_chart`" },
        { id: "t2", text: "Cetak ketiganya bernomor" },
      ],
      expected: "3 chart tercetak bernomor",
      note: {
        title: "Sering salah",
        body: "Memberi judul deskriptif ('Grafik 1', 'NPL per kuartal') alih-alih kesimpulan. Judul yang baik menghemat 30 detik penjelasan per chart — dikali 6 chart dikali audiens, itu signifikan.",
      },
      hints: [
        "Tiap item: {'chart': 'line', 'judul': '...', 'kode': '...'}.",
        "Loop: for i, d in enumerate(dashboard, 1): print(f\"{i}. [{d['chart']}] {d['judul']}\").",
        "Judul = kesimpulan, bukan deskripsi.",
      ],
      code: {
        starter: `# TULIS KODEMU: dashboard 3 chart kesehatan kredit\ndashboard = [\n    \n]\n\nfor i, d in enumerate(dashboard, 1):\n    print(f"{i}. [{d['chart']}] {d['judul']}")\nn_chart = len(dashboard)\nprint(f"n_chart={n_chart}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: dashboard 3 chart kesehatan kredit\ndashboard = [\n    {"chart": "line", "judul": "NPL naik 0.5pp dalam 3 bulan",\n     "kode": "px.line(df, x='bulan', y='npl')"},\n    {"chart": "bar", "judul": "Bucket 31-60 menumpuk: collection kurang agresif",\n     "kode": "px.bar(bucket, x='bucket', y='exposure')"},\n    {"chart": "scatter", "judul": "Vintage Jul-25 konsisten terburuk",\n     "kode": "px.scatter(vintage, x='mob', y='npl', color='vintage')"},\n]\n\nfor i, d in enumerate(dashboard, 1):\n    print(f"{i}. [{d['chart']}] {d['judul']}")\nn_chart = len(dashboard)\nprint(f"n_chart={n_chart}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_chart", value: 3, tol: 1e-9, label: "`n_chart` = 3", msg: "List berisi 3 dict chart." },
          { kind: "stdout_matches", task: "t2", pattern: "1\\. \\[line\\]", label: "chart 1 tercetak", msg: "Cetak bernomor: 1. [line] ...." },
          { kind: "stdout_matches", task: "t2", pattern: "3\\. \\[scatter\\]", label: "chart 3 tercetak", msg: "Tiga chart: line, bar, scatter." },
        ],
      },
      reference: "Narasi: masalah -> lokasi -> penyebab. Judul = kesimpulan.",
    },
    {
      id: "statis-vs-interaktif",
      eyebrow: "Langkah 4 · Pilih medan",
      title: "Statis lawan interaktif — medium menentukan",
      prose: [
        "Laporan PDF atau paper yang dicetak: statis (matplotlib/PNG) — interaktif tidak tercetak. Dashboard, Jupyter, presentasi live: interaktif (plotly) — hover dan zoom menjawab pertanyaan di tempat. Email: PNG statis, karena tidak semua email me-render HTML.",
        "Untuk 1 juta titik di scatter: agregat dulu (resample/binning) — plot semua = lambat dan tidak terbaca. Chart adalah ringkasan, bukan dump data. `fig.write_html('chart.html')` mengirim chart interaktif mandiri tanpa server.",
      ],
      tasks: [],
      reference: "Live -> interaktif; cetak -> statis. Agregat sebelum plot data besar.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Intuisi: interaktif untuk eksplorasi, statis untuk keputusan",
      prose: [
        "Heuristik penutup: medium menentukan senjata — dan kejujuran tidak tergantung mediumnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: interaktif untuk eksplorasi, statis untuk keputusan",
        body: "Heuristik pertama: Plotly (interaktif) untuk EKSPLORASI dan dashboard hidup — hover/zoom menjawab \"ada apa di titik aneh itu\" di tempat; matplotlib (statis) untuk LAPORAN dan keputusan — PNG yang tercetak tidak bisa di-zoom, jadi semua yang penting harus sudah terlihat. Salah medium = chart yang tidak bisa diinterogasi (statis di dashboard) atau chart yang tidak tercetak (interaktif di PDF). Heuristik kedua: ketidakpastian ditampilkan atau disembunyikan secara SADAR — rata-rata tanpa CI/n adalah klaim belum lengkap; bila kamu menyembunyikannya, itu keputusan editorial yang harus bisa dipertanggungjawabkan, bukan kelalaian. Heuristik ketiga: faceting mengalahkan legenda untuk >4 kelompok — dan skala panel harus SELALU sama; small multiples dengan skala bebas lebih buruk daripada tidak ada chart. Heuristik keempat: dashboard adalah narasi (masalah → lokasi → penyebab), bukan tumpukan chart — tiap panel satu pesan, judul panel kesimpulan, maksimal 6 panel per layar. Dan yang paling senior: sebelum mempercayai chart (milikmu atau orang lain), tanyakan \"bagaimana ini terlihat bila digambar jujur\" — sumbu penuh, skala sama, tanpa 3D. Kepercayaan pada chart dibangun dengan skeptisisme, bukan dengan keindahan.",
      },
      reference: "Eksplorasi = interaktif; keputusan = statis. CI/n selalu ada atau disembunyikan sadar. Faceting > legenda; skala sama; dashboard = narasi.",
    },
    {
      id: "advanced-ketidakpastian",
      eyebrow: "Langkah 6 · Advanced",
      requires: ["numpy", "matplotlib"],
      title: "Advanced: visualisasi ketidakpastian — CI, bukan sekadar rata-rata",
      prose: [
        "Rata-rata tanpa ketidakpastian adalah klaim yang belum lengkap: \"rata-rata gaji B lebih tinggi 1,3 juta\" — lebih tinggi secara MEANINGFUL, atau hanya noise sampling? Visualisasi statistik menjawabnya dengan menampilkan ketidakpastian BERSAMA estimasinya. Alat standarnya: ERROR BAR — garis vertikal di atas batang/titik yang menunjukkan rentang kepercayaan 95% (CI): mean ± 1,96 × SE, dengan SE = std / sqrt(n). Aturan bacanya: bila CI dua kelompok TIDAK tumpang tindih, selisihnya signifikan secara statistik pada ~5%; bila tumpang tindih lebar, datamu belum bisa bicara.",
        "Tiga jebakan praktisi. Pertama, TAHU APA YANG KAMU PLOT: error bar bisa berarti SD (sebaran data), SE (ketidakpastian mean), atau CI (rentang kepercayaan) — ketiganya beda makna dan beda lebar; chart tanpa label jenis error bar adalah chart yang berbohong dengan sopan. Selalu tulis di label/keterangan: \"+ 95% CI\". Kedua, DYNAMITE PLOT (bar + error bar) menyembunyikan distribusi — dua kelompok dengan mean dan CI sama bisa punya bentuk sebaran yang SANGAT beda (satu normal, satu bimodal); untuk memahami bentuk, tampilkan distribusinya (violin/box + titik jitter), bukan hanya ringkasannya. Ketiga, n kecil = CI lebar = kejujuran — jangan menyembunyikan n; error bar yang dihitung dari 60 sampel jauh lebih bisa dipercaya dari yang dihitung dari 6.",
        "Praktik di lab: hitung mean, SE, dan 95% CI dua kelompok gaji (n=60, seed 21), tampilkan sebagai bar chart dengan error bar berlabel jelas. Perhatikan: dengan n=60, CI cukup sempit untuk memastikan selisihnya nyata — coba turunkan n menjadi 8 dan lihat CI-nya melebar: itulah harga ketidakpastian yang jujur.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean_a`, `se_a`, `ci_a` (= 1.96*se) untuk kelompok A" },
        { id: "t2", text: "Bar chart 2 batang dengan `yerr` CI, label sumbu memuat '95% CI', cetak ringkasan" },
      ],
      expected: "mean_a_jt sekitar 8.50, ci_a_jt sekitar 0.30, batang=2",
      hints: [
        "mean_a = gaji_a.mean(); se_a = gaji_a.std(ddof=1) / np.sqrt(n); ci_a = 1.96 * se_a.",
        "ax.bar(['A','B'], [mean_a/1e6, mean_b/1e6], yerr=[ci_a/1e6, ci_b/1e6], capsize=6).",
        "Label sumbu: ax.set_ylabel('Rata-rata gaji (juta Rp) + 95% CI').",
      ],
      code: {
        starter: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(21)\nn = 60\ngaji_a = rng.normal(8_500_000, 1_200_000, n)  # kelompok A\ngaji_b = rng.normal(9_800_000, 1_500_000, n)  # kelompok B\n\n# TULIS KODEMU: rata-rata + 95% CI per kelompok, bar chart dengan error bar\nmean_a =\nmean_b =\nse_a =\nse_b =\nci_a =\nci_b =\n\nfig, ax = plt.subplots()\nax.bar(["A", "B"],\n       [mean_a / 1e6, mean_b / 1e6],\n       yerr= ,\n       capsize=6)\nax.set_ylabel("Rata-rata gaji (juta Rp) + 95% CI")\nax.set_ylim(0, (mean_b + ci_b) / 1e6 * 1.15)\nax.set_title("Selisih gaji A vs B — dengan ketidakpastian")\n\nprint(f"mean_a_jt={mean_a / 1e6:.2f} ci_a_jt={ci_a / 1e6:.2f} batang={len(ax.patches)}")\n`,
        lockLines: 9,
        solution: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(21)\nn = 60\ngaji_a = rng.normal(8_500_000, 1_200_000, n)  # kelompok A\ngaji_b = rng.normal(9_800_000, 1_500_000, n)  # kelompok B\n\n# TULIS KODEMU: rata-rata + 95% CI per kelompok, bar chart dengan error bar\nmean_a = gaji_a.mean()\nmean_b = gaji_b.mean()\nse_a = gaji_a.std(ddof=1) / np.sqrt(n)\nse_b = gaji_b.std(ddof=1) / np.sqrt(n)\nci_a = 1.96 * se_a\nci_b = 1.96 * se_b\n\nfig, ax = plt.subplots()\nax.bar(["A", "B"],\n       [mean_a / 1e6, mean_b / 1e6],\n       yerr=[ci_a / 1e6, ci_b / 1e6],\n       capsize=6)\nax.set_ylabel("Rata-rata gaji (juta Rp) + 95% CI")\nax.set_ylim(0, (mean_b + ci_b) / 1e6 * 1.15)\nax.set_title("Selisih gaji A vs B — dengan ketidakpastian")\n\nprint(f"mean_a_jt={mean_a / 1e6:.2f} ci_a_jt={ci_a / 1e6:.2f} batang={len(ax.patches)}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "ci_a", label: "`ci_a` terdefinisi", msg: "ci_a = 1.96 * se_a; se_a = std/sqrt(n)." },
          { kind: "equal", task: "t1", name: "mean_a", value: 8500000, tol: 300000, label: "`mean_a` sekitar 8,5 juta", msg: "Dengan seed 21, mean kelompok A ≈ 8,5 juta." },
          { kind: "stdout_matches", task: "t2", pattern: "batang=2", label: "2 batang terplot", msg: "Bar chart dua kelompok A dan B." },
          { kind: "stdout_matches", task: "t2", pattern: "ci_a_jt=0.3", label: "CI tercetak ±0,3 juta", msg: "Dengan n=60, CI 95% sekitar ±0,3 juta — sempit dan jujur." },
        ],
      },
      reference: "Error bar = CI/SE/SD — labeli jenisnya. CI tak tumpang tindih = selisih signifikan. Dynamite plot sembunyikan distribusi.",
    },
    {
      id: "advanced-faceting",
      eyebrow: "Langkah 7 · Advanced",
      requires: ["numpy", "matplotlib"],
      title: "Advanced: faceting & dashboard multipanel — small multiples",
      prose: [
        "Saat kelompok melebihi 4–5, satu chart dengan 8 garis warna-warni menjadi spageti — solusinya FACETING (small multiples): satu panel per kelompok, disusun grid, masing-masing dengan pesan yang sama. Keunggulannya: mata membandingkan BENTUK antar panel tanpa harus mengurai legenda; tiap panel boleh punya anotasi sendiri. Aturan emasnya ada SATU dan tidak bisa ditawar: SKALA YANG SAMA di semua panel (sharex/sharey=True) — panel dengan skala bebas adalah kebohongan small-multiples: kenaikan 2× di satu panel terlihat sama dengan kenaikan 10% di panel lain.",
        "Pola dashboard multipanel yang benar: 2×2 atau 3×2 panel (lebih dari 6 = dinding yang tidak dibaca), satu metrik per panel atau satu wilayah per panel (jangan campur), judul panel = nama kelompok, dan suptitle = KESIMPULAN keseluruhan (\"NPL naik di semua wilayah — tertinggi di Medan\", bukan \"NPL per wilayah\"). `fig.tight_layout()` mencegah label bertumpuk — detail kecil yang membedakan chart analis dari chart mahasiswa. Dan hierarki narasi dari Langkah 3 tetap berlaku per dashboard: panel 1 = masalah, panel 2–3 = lokasi/perbandingan, panel 4 = penyebab — multipanel adalah cerita, bukan tumpukan.",
        "Praktik di lab: NPL 5 kuartal × 4 kota dalam grid 2×2 dengan sharex/sharey, tiap panel satu kota, suptitle berupa kesimpulan. Verifikasi: 4 panel terbuat dan sumbu Y benar-benar berbagi skala — karena small multiples dengan skala bebas lebih buruk daripada tidak divisualkan sama sekali.",
      ],
      tasks: [
        { id: "t1", text: "Buat grid 2x2 dengan `sharex=True, sharey=True`, plot tiap kota di panelnya" },
        { id: "t2", text: "Beri `suptitle` kesimpulan + `tight_layout`, cetak `n_panel` dan `skala_sama`" },
      ],
      expected: "n_panel=4 skala_sama=True",
      hints: [
        "fig, axs = plt.subplots(2, 2, figsize=(10, 7), sharex=True, sharey=True).",
        "Loop: for ax, (kota, nilai) in zip(axs.flat, npl.items()): ax.plot(...); ax.set_title(kota).",
        "skala_sama = axs[0, 0].get_shared_y_axes().joined(axs[0, 0], axs[1, 1]).",
      ],
      code: {
        starter: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nkuartal = ["Q1", "Q2", "Q3", "Q4", "Q5"]\nnpl = {\n    "Jakarta": [3.1, 3.3, 3.2, 3.6, 4.1],\n    "Bandung": [2.4, 2.6, 2.9, 2.7, 3.0],\n    "Surabaya": [4.2, 4.0, 4.5, 4.8, 5.2],\n    "Medan": [5.1, 5.5, 5.3, 5.9, 6.4],\n}\n\n# TULIS KODEMU: small multiples 2x2 — SATU skala y untuk semua panel\nfig, axs = plt.subplots(2, 2, figsize=(10, 7), sharex=True, sharey=True)\n\nfor ax, (kota, nilai) in zip(axs.flat, npl.items()):\n    ax.plot(kuartal, nilai, marker="o")\n    ax.set_title( )\n    ax.set_ylim( , )\n\nfig.suptitle(" ")\nfig.tight_layout()\n\nn_panel = len(fig.axes)\nskala_sama = axs[0, 0].get_shared_y_axes().joined(axs[0, 0], axs[1, 1])\nprint(f"n_panel={n_panel} skala_sama={skala_sama}")\n`,
        lockLines: 11,
        solution: `import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nkuartal = ["Q1", "Q2", "Q3", "Q4", "Q5"]\nnpl = {\n    "Jakarta": [3.1, 3.3, 3.2, 3.6, 4.1],\n    "Bandung": [2.4, 2.6, 2.9, 2.7, 3.0],\n    "Surabaya": [4.2, 4.0, 4.5, 4.8, 5.2],\n    "Medan": [5.1, 5.5, 5.3, 5.9, 6.4],\n}\n\n# TULIS KODEMU: small multiples 2x2 — SATU skala y untuk semua panel\nfig, axs = plt.subplots(2, 2, figsize=(10, 7), sharex=True, sharey=True)\n\nfor ax, (kota, nilai) in zip(axs.flat, npl.items()):\n    ax.plot(kuartal, nilai, marker="o")\n    ax.set_title(kota)\n    ax.set_ylim(0, 7)\n\nfig.suptitle("NPL naik di semua wilayah — tertinggi di Medan")\nfig.tight_layout()\n\nn_panel = len(fig.axes)\nskala_sama = axs[0, 0].get_shared_y_axes().joined(axs[0, 0], axs[1, 1])\nprint(f"n_panel={n_panel} skala_sama={skala_sama}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "n_panel", value: 4, tol: 1e-09, label: "`n_panel` = 4", msg: "Grid 2x2 menghasilkan 4 panel." },
          { kind: "equal", task: "t2", name: "skala_sama", value: true, tol: 0, label: "`skala_sama` = True", msg: "sharey=True — semua panel satu skala Y." },
          { kind: "stdout_matches", task: "t2", pattern: "n_panel=4 skala_sama=True", label: "Ringkasan tercetak", msg: "Format: n_panel=4 skala_sama=True." },
        ],
      },
      reference: "Small multiples: 1 pesan per panel, skala SELALU sama, suptitle = kesimpulan, tight_layout.",
    },
    {
      id: "minicase-skala-bebas",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: ekspansi ke wilayah yang (tampaknya) stabil",
      prose: [
        "Skenario (angka konkret): dashboard 4 panel NPL per wilayah — tetapi tiap panel memakai skala Y OTOMATIS (bebas). Panel Medan (NPL 5,1% → 6,4%) memakai skala 5–6,5%: garisnya terlihat LANDAI. Panel Jakarta (3,1% → 4,1%) memakai skala 3–4,2%: garisnya terlihat CURAM. Direksi membaca: \"Medan stabil, Jakarta memburuk\" — dan menyetujui ekspansi penyaluran Rp 12 miliar ke Medan, wilayah yang sebenarnya NPL-nya naik 1,3pp (tertinggi!). Enam bulan kemudian NPL Medan 7,8%, cadangan kerugian naik Rp 1,9 miliar.",
        "Pertanyaan analisis: (1) Mengapa dua kenaikan yang berbeda terlihat sebaliknya? (2) Apa aturan faceting yang dilanggar? (3) Bagaimana chart yang jujur seharusnya terlihat?",
        "Pembahasan: (1) Skala bebas menormalkan kemiringan visual per panel — kenaikan 1,3pp di rentang 1,5 terlihat sama landainya dengan kenaikan 1,0pp di rentang 1,2; mata membandingkan KEMIRINGAN, bukan angka. (2) Aturan \"satu skala untuk semua panel\" — small multiples hanya valid bila perbandingan visual = perbandingan angka; sharey=True adalah non-negotiable. (3) Grid 2×2 dengan sumbu Y 0–8% untuk semua: panel Medan langsung terlihat PALING TINGGI dan menanjak paling curam — keputusan ekspansi tidak akan pernah disetujui. Bonus: tambahkan garis referensi ambang batas (mis. 5% = batas perhatian regulator) yang SAMA di semua panel.",
        "Kaitan ke karier: ini bukan bug kode — kode berjalan sempurna. Ini bug KEPUTUSAN VISUAL. Review chart orang lain dengan satu pertanyaan: \"apakah perbandingan visual di sini sama dengan perbandingan angkanya?\"",
      ],
      tasks: [],
      reference: "Faceting tanpa skala sama = perbandingan visual berbohong. sharey=True selalu; garis referensi sama di semua panel.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran. Setiap opsi punya alasan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Plotly express vs graph_objects...",
          options: [
            { text: "Sama saja", why: "Beda level: express cepat, graph_objects kustom." },
            { text: "px = cepat 1 baris; go = kustom penuh", why: "Mulai px, pindah go saat px tidak cukup.", correct: true },
            { text: "go lebih cepat", why: "Bukan soal kecepatan komputasi." },
            { text: "px hanya untuk bar", why: "px punya bar/line/scatter/histogram/box." },
          ],
        },
        {
          q: "Untuk laporan PDF...",
          options: [
            { text: "Plotly interaktif", why: "Interaktif tidak tercetak." },
            { text: "Statis (matplotlib/PNG)", why: "Medium menentukan: cetak butuh statis.", correct: true },
            { text: "Tidak pakai chart", why: "Chart tetap berguna — yang statis." },
            { text: "GIF animasi", why: "Tidak tercetak dengan baik." },
          ],
        },
        {
          q: "Judul chart yang baik...",
          options: [
            { text: "'Grafik 1'", why: "Tidak memberi informasi apa-apa." },
            { text: "'NPL naik 0.5pp dalam 3 bulan' (kesimpulan)", why: "Judul = insight, bukan deskripsi.", correct: true },
            { text: "'NPL per kuartal'", why: "Deskriptif — pembaca masih harus menyimpulkan sendiri." },
            { text: "Tanpa judul", why: "Chart tanpa judul memaksa tebak-tebakan." },
          ],
        },
        {
          q: "1 juta titik di scatter sebaiknya...",
          options: [
            { text: "Plot semua", why: "Lambat dan tidak terbaca." },
            { text: "Agregat/binning dulu", why: "Chart = ringkasan, bukan dump data.", correct: true },
            { text: "Tidak bisa divisualkan", why: "Bisa — setelah agregat atau sampling." },
            { text: "Pakai pie", why: "Pie untuk komposisi sedikit kategori." },
          ],
        },
      ],
      summary: [
        "px = 1 baris interaktif; go = kustom penuh.",
        "Figure = dict {data, layout} — bisa dicek tanpa render.",
        "Dashboard: 4-6 chart, narasi masalah-lokasi-penyebab, judul = kesimpulan.",
        "Medium menentukan: live interaktif, cetak statis.",
        "Agregat sebelum plot data besar.",
      ],
      next: { label: "D9 — EDA", href: "/v2/learn/d9-eda" },
    },
  ],
};
