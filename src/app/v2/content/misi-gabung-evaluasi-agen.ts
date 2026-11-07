import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Judge: Evaluator yang Menilai Dirinya Sendiri ───────────────────
// CAPSTONE (Misi C kombinasi): LLMOps × AI Engineering.
// Dataset SINTETIS: 240 kasus evaluasi fiksi (seed 42) — BUKAN data asli.
// File: public/misi/misi-gabung-evaluasi-agen/eval_cases.csv + METODE.md.

const BASE = "/misi/misi-gabung-evaluasi-agen";

export const misiGabungEvaluasi: V2Mission = {
  slug: "misi-gabung-evaluasi-agen",
  track: "LLMOps",
  module: "Misi",
  title: "Misi Judge: Evaluator yang Menilai Dirinya Sendiri",
  estMinutes: 180,
  role: "LLMOps engineer",
  client:
    "CTO — laporan evaluasi mengklaim agen mencapai 94% sukses via LLM-judge, tapi spot-check manusia atas 60 kasus bilang hanya ~57% yang benar-benar lulus",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "94% atau 57%? Keduanya tidak bisa benar",
      prose: [],
      tasks: [],
      briefing: {
        role: "LLMOps engineer — pemilik sistem evaluasi agen customer-support di produksi",
        client:
          "CTO. Laporan evaluasi bulanan mengklaim agen support mencapai 94% sukses — dinilai oleh LLM-judge internal. Tim QA melakukan spot-check manusia atas 60 kasus dan menemukan hanya ~57% yang benar-benar lulus. Selisih 37 poin bukan “noise”. Tugasmu: audit harness evaluasinya dari data mentah, temukan mekanisme yang membuat angkanya berbohong, lalu rancang ulang sistem evaluasi yang tidak bisa dibohongi — terutama oleh judge-nya sendiri.",
        story: [
          "Rabu, 09:40. Slide deck evaluasi bulanan tampil di layar ruang rapat: “Agen Support v3 — 94% sukses (LLM-judge, n=240)”. CTO mengangguk puas. Lalu manajer QA mengangkat tangan: “Kami spot-check 60 kasus secara manual. Yang benar-benar lulus: 34. Itu 57%, bukan 94%.” Ruangan mendadak sunyi. Angka 94% itu dipakai untuk memutuskan rollout ke 40% pelanggan minggu depan.",
          "Kamu diminta mengaudit harness evaluasinya — bukan agennya. Data mentahnya ada: 240 kasus, skor judge 0-100, vonis lulus/gagal, label manusia untuk 60 kasus, dan teks prompt yang dipakai judge. Di atas kertas semuanya terlihat profesional: ambang lulus, sampel acak, dokumentasi. Tapi kamu tahu satu hal yang tidak diketahui ruangan itu: evaluator yang menilai dirinya sendiri hampir selalu memberi nilai bagus.",
          "Misi ini: hitung sendiri kesepakatan judge vs manusia, bedah skor per tingkat kesulitan, pilih jalan perbaikan — lalu audit laporan “94%” itu dan temukan empat sabotase yang disuntikkan ke dalamnya. Keputusan rollout minggu depan bergantung pada laporan akhirmu.",
        ],
        objectives: [
          "Menghitung kesepakatan judge vs manusia (Cohen's kappa) dari 60 kasus berlabel dan menafsirkan artinya.",
          "Menstratifikasi skor judge per tingkat kesulitan untuk menemukan dari mana angka 94% berasal.",
          "Menemukan 4 sabotase di laporan evaluasi dan menulis dokumen desain evaluasi ulang dengan kontrol bias.",
        ],
        prereqSummary:
          "LLM-as-judge = memakai model bahasa untuk menilai output agen — praktis dan murah, tapi judge-nya juga bisa bias. Bias evaluasi = kecenderungan sistematis judge memberi skor terlalu tinggi atau rendah, misalnya memihak jawaban yang mirip gaya bahasanya sendiri (self-preference bias). Cohen's kappa = ukuran kesepakatan dua penilai setelah dikoreksi faktor kebetulan; 0–0,2 artinya kesepakatan ringan (slight, Landis & Koch); di bawah 0 artinya nyaris tidak sepakat (poor).",
        datasetNote:
          "Data 100% SINTETIS: 240 kasus evaluasi fiksi hasil generator acak (seed 42) — BUKAN hasil evaluasi agen nyata, BUKAN data produksi, TANPA jawaban agen asli.\nFile: eval_cases.csv — kolom case_id, difficulty (mudah/sedang/sulit), task_type (qa/penalaran/kode), judge_score (0-100), judge_verdict (lulus/gagal, ambang 60), human_label (lulus/gagal, hanya 60 baris), judge_prompt_id (selalu v1-bocor).\nCatatan: prompt judge v1 memuat kunci jawaban di dalam template-nya (disengaja untuk misi ini).\nMetode & batas jujur: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "240 baris, satu kolom yang jujur",
      prose: [
        "File `eval_cases.csv` adalah satu-satunya sumber kebenaran di misi ini: 240 baris, 7 kolom. Kolom `difficulty` membagi kasus menjadi mudah (140), sedang (70), dan sulit (30). Kolom `judge_score` adalah skor 0-100 dari LLM-judge; `judge_verdict` adalah vonisnya dengan ambang 60. Kolom `human_label` hanya terisi di 60 baris — itulah spot-check manusia. Kolom `judge_prompt_id` selalu bernilai `v1-bocor` untuk semua baris: satu versi prompt, dipakai untuk seluruh evaluasi.",
        "Data ini SINTETIS (seed 42) — dinyatakan eksplisit agar tidak ada yang mengira ini bocoran evaluasi perusahaan nyata. Justru karena sintetis, polanya dibuat menyerupai pola nyata yang berbahaya: judge yang menyanjung, sampel yang miring, dan prompt yang tidak netral. Tugasmu bukan mengagumi angkanya, melainkan menginterogasinya.",
        "Sebelum menyentuh kode, pahami dulu anatomi kolomnya: `judge_verdict` adalah TURUNAN dari `judge_score` (ambang 60) — bukan penilaian independen kedua. Artinya seluruh “94%” itu berdiri di atas satu angka: skor dari satu judge, satu prompt, satu ambang. Satu rantai, nol pemeriksaan silang.",
      ],
      tasks: [
        { id: "t1", text: "Buka `eval_cases.csv`: catat jumlah baris dan kolom yang terisi penuh vs sebagian" },
        { id: "t2", text: "Baca `METODE.md`: catat seed, cara skor dibangkitkan, dan isi prompt judge v1" },
      ],
      note: {
        title: "Miskonsepsi #1: skor judge tinggi = agen bagus",
        type: "pitfall",
        body: "“Judge memberi 94% lulus, berarti agennya memang bagus.” Belum tentu — skor judge mengukur PENILAIAN judge, bukan KUALITAS agen. Kalau judge-nya murah hati (lenient), pembohong yang ramah, atau memegang kunci jawaban yang bocor, skor tinggi justru mengukur kebaikan hati judge. Validitas (apakah yang diukur benar) dan reliabilitas (apakah hasilnya konsisten) adalah dua hal berbeda — dan judge yang konsisten menyanjung tetap tidak valid.",
      },
      reference:
        "eval_cases.csv (240 baris SINTETIS, seed 42) + METODE.md — satu-satunya sumber kebenaran; judge_verdict turunan dari judge_score (ambang 60), bukan penilaian independen.",
    },
    {
      id: "teori-operasionalisasi",
      eyebrow: "Langkah 3 · Teori — Lensa 1: operasionalisasi evaluasi",
      title: "Dari “agen bagus” ke angka yang bisa ditagih",
      prose: [
        "Lensa pertama: operasionalisasi. “Agen yang bagus” bukan sesuatu yang bisa diukur — sampai kamu mendefinisikannya secara operasional: bagus = APA, diukur BAGAIMANA, ambangnya BERAPA. Rantai operasionalisasi di misi ini: kualitas jawaban → skor 0-100 dari judge → vonis lulus/gagal (ambang 60) → headline “94% sukses”. Setiap panah adalah tempat kebocoran bisa terjadi.",
        "Tiga pertanyaan yang harus dijawab setiap rantai evaluasi: (1) Validitas — apakah skor judge benar-benar mengukur kualitas jawaban, atau mengukur hal lain (kemiripan gaya bahasa, kecocokan kata kunci)? (2) Reliabilitas — bila judge menilai dua kali, hasilnya sama? (3) Kalibrasi — apakah “skor 80” berarti hal yang sama untuk kasus mudah dan kasus sulit?",
        "LLM-as-judge populer karena murah dan cepat — tapi ia mewarisi semua bias model yang menilainya: cenderung memberi skor tinggi pada jawaban yang panjang dan percaya diri (leniency/verbosity bias), cenderung memihak output dari model sekeluarganya (self-preference bias), dan sangat sensitif pada isi prompt penilaiannya sendiri. Judge bukan alat ukur netral seperti penggaris; ia lebih seperti juri yang punya selera.",
        "Karena itu evaluasi yang serius tidak pernah memakai satu judge sendirian: ia memakai label manusia sebagai jangkar (ground truth), mengukur KESEPAKATAN judge-vs-manusia — bukan skor judge mentah — dan melaporkan ketidaksepakatan sebagai temuan, bukan sebagai aib yang disembunyikan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis rantai operasionalisasi misi ini dalam 1 kalimat per panah (4 panah)" },
        { id: "t2", text: "Untuk tiap panah, tulis 1 cara panah itu bisa bocor" },
      ],
      reference:
        "Rantai: kualitas → skor judge → vonis (ambang 60) → headline 94%. Ukur kesepakatan judge-vs-manusia, bukan skor mentah.",
    },
    {
      id: "teori-desain-agen",
      eyebrow: "Langkah 4 · Teori — Lensa 2: desain agen & bias evaluasi",
      title: "Empat bias yang membuat judge berbohong",
      prose: [
        "Lensa kedua: desain agen evaluasi. Ada empat bias klasik yang membuat LLM-judge melaporkan angka indah untuk agen yang biasa-biasa saja. Pertama, **leniency bias**: judge cenderung memberi skor tinggi — distribusi skornya bergeser ke kanan sehingga ambang 60 menjadi terlalu mudah dilewati. Kedua, **self-preference bias**: judge memberi skor lebih tinggi pada jawaban dari model sekeluarganya, meski kualitasnya setara menurut penilai manusia yang buta (blind).",
        "Ketiga, **leaked-key bias**: kunci jawaban disuntikkan ke prompt judge “agar penilaiannya akurat” — akibatnya judge menilai kecocokan kata dengan kunci, bukan kualitas jawaban. Agen yang menghafal frasa kunci lolos; agen yang menjawab benar dengan kalimat sendiri bisa gagal. Keempat, **easy-slice bias**: metrik headline dihitung pada irisan kasus yang mudah — 140 kasus mudah mendominasi 240 kasus, sehingga “94%” lebih banyak bercerita tentang komposisi sampel daripada tentang agen.",
        "Kontrol desain untuk masing-masing: prompt buta (blind — tanpa kunci jawaban di template; kunci hanya dipakai skrip skoring terpisah), judge dari keluarga model berbeda atau ensemble multi-judge, eval set yang di-hash terhadap data training (holdout murni), dan stratifikasi — laporkan metrik PER tingkat kesulitan, larang headline satu angka.",
        "Peta keputusan mini — kapan angka evaluasi boleh dipercaya: (a) ada label manusia sebagai jangkar → lanjut; tidak ada → jangan rilis; (b) kappa judge-vs-manusia ≥ 0,6 → judge boleh dipakai rutin; 0,2–0,6 → judge hanya pra-saring + manusia memutuskan; < 0,2 → buang judge-nya; (c) metrik dilaporkan per stratum kesulitan → boleh jadi headline; satu angka tanpa stratifikasi → tolak.",
      ],
      tasks: [
        { id: "t1", text: "Jodohkan tiap bias (leniency, self-preference, leaked-key, easy-slice) dengan kontrol desainnya" },
        { id: "t2", text: "Terapkan peta keputusan mini ke angka misi ini (kappa akan kamu hitung di Lab 1)" },
      ],
      note: {
        title: "Miskonsepsi #2: judge LLM netral karena tidak punya kepentingan",
        type: "pitfall",
        body: "“Model tidak punya ego, jadi penilaiannya objektif.” Salah — bias tidak butuh niat. Self-preference bias muncul dari data training: model lebih sering melihat (dan memberi reward pada) gaya bahasa yang mirip keluarannya sendiri. Hasilnya sistematis: +18 poin untuk keluarga sendiri pada kualitas setara, tanpa “niat” apa pun. Netralitas harus DIBUKTIKAN dengan pengukuran (mis. blind comparison antar keluarga model), bukan diasumsikan dari ketiadaan ego.",
      },
      reference:
        "4 bias: leniency, self-preference, leaked-key, easy-slice. Kontrol: prompt buta, judge beda keluarga, holdout hash, stratifikasi + larangan headline satu angka.",
    },
    {
      id: "lab-kappa",
      eyebrow: "Langkah 5 · Lab 1 — Kesepakatan judge vs manusia",
      title: "Seberapa sering mereka sepakat? (Cohen's kappa)",
      prose: [
        "Waktunya menginterogasi angka. Kamu punya 60 kasus dengan DUA vonis: `judge_verdict` dan `human_label`. Pertanyaan paling jujur yang bisa diajukan ke sistem evaluasi: seberapa sering keduanya sepakat — setelah dikoreksi faktor kebetulan? Itulah Cohen's kappa.",
        "Intuisinya: kalau judge meluluskan 93% kasus dan manusia meluluskan 57%, keduanya akan “sepakat” cukup sering HANYA karena kebetulan (keduanya sama-sama sering bilang lulus). p_e mengukur kesepakatan kebetulan itu. Kappa = seberapa jauh kesepakatan nyata (p_o) melampaui kebetulan, dibagi ruang yang tersisa. Kappa 1 = sepakat sempurna; 0 = tidak lebih baik dari lempar koin.",
        "Hitung juga dua angka headline-nya: tingkat kelulusan menurut judge (240 kasus) vs menurut manusia (60 kasus). Selisih keduanya adalah ukuran “pujian” judge — dan bahan bakar slide deck CTO.",
      ],
      tasks: [
        { id: "t1", text: "Saring 60 baris berlabel manusia ke `lab`; hitung `n_lab`" },
        { id: "t2", text: "Hitung `po`, `pe`, dan `kappa`" },
        { id: "t3", text: "Hitung `judge_pass` (240 kasus) dan `human_pass` (60 kasus)" },
      ],
      expected:
        "n_lab=60; kappa=0,129 (kesepakatan ringan); po=0,617; pe=0,560; judge_pass=0,933 vs human_pass=0,567 — selisih 36,6 poin",
      formula: String.raw`\kappa = \frac{p_o - p_e}{1 - p_e}`,
      formulaNote:
        "p_o = proporsi kesepakatan teramati (0,617: dari 60 kasus, 37 disepakati kedua penilai). p_e = kesepakatan yang diharapkan bila keduanya menebak acak sesuai kebiasaannya masing-masing (0,560). kappa = 0,129 artinya kesepakatan nyata hanya 12,9% dari jarak antara “kebetulan murni” dan “sepakat sempurna” — kategori “ringan” (slight). Angka ini artinya: judge dan manusia hampir tidak sepakat melebihi tebakan acak. Contoh konkret: dari 60 kasus, keduanya sepakat “gagal” hanya pada 3 kasus — judge hampir tidak pernah berani bilang gagal.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Baris berlabel: `df[df[\"human_label\"].notna() & (df[\"human_label\"] != \"\")]` — sel kosong terbaca sebagai NaN.",
        "Kesepakatan: `((lab[\"judge_verdict\"]==\"lulus\") & (lab[\"human_label\"]==\"lulus\")).sum()` untuk both_lulus; pola sama untuk gagal.",
        "p_e = p_judge_lulus × p_human_lulus + p_judge_gagal × p_human_gagal.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-evaluasi-agen/eval_cases.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "lab = ...                       # hanya baris berlabel manusia",
          "n_lab = ...",
          "",
          "both_lulus = ...                # judge lulus DAN manusia lulus",
          "both_gagal = ...                # judge gagal DAN manusia gagal",
          "po = ...                        # proporsi kesepakatan teramati",
          "",
          "p_judge_lulus = ...",
          "p_human_lulus = ...",
          "pe = ...                        # kesepakatan harapan bila acak",
          "",
          "kappa = ...                     # (po - pe) / (1 - pe)",
          "",
          "judge_pass = ...                # tingkat kelulusan judge, 240 kasus",
          "human_pass = ...                # tingkat kelulusan manusia, 60 kasus",
          "",
          "print(\"n_lab:\", n_lab)",
          "print(\"po:\", round(po, 3), \"| pe:\", round(pe, 3), \"| kappa:\", round(kappa, 3))",
          "print(\"judge:\", round(judge_pass, 4), \"| manusia:\", round(human_pass, 4))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-evaluasi-agen/eval_cases.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "lab = df[df[\"human_label\"].notna() & (df[\"human_label\"] != \"\")].copy()",
          "n_lab = len(lab)",
          "",
          "both_lulus = int(((lab[\"judge_verdict\"] == \"lulus\") & (lab[\"human_label\"] == \"lulus\")).sum())",
          "both_gagal = int(((lab[\"judge_verdict\"] == \"gagal\") & (lab[\"human_label\"] == \"gagal\")).sum())",
          "po = (both_lulus + both_gagal) / n_lab",
          "",
          "p_judge_lulus = float((lab[\"judge_verdict\"] == \"lulus\").mean())",
          "p_human_lulus = float((lab[\"human_label\"] == \"lulus\").mean())",
          "pe = p_judge_lulus * p_human_lulus + (1 - p_judge_lulus) * (1 - p_human_lulus)",
          "",
          "kappa = (po - pe) / (1 - pe)",
          "",
          "judge_pass = float((df[\"judge_verdict\"] == \"lulus\").mean())",
          "human_pass = float((lab[\"human_label\"] == \"lulus\").mean())",
          "",
          "print(\"n_lab:\", n_lab)",
          "print(\"po:\", round(po, 3), \"| pe:\", round(pe, 3), \"| kappa:\", round(kappa, 3))",
          "print(\"judge:\", round(judge_pass, 4), \"| manusia:\", round(human_pass, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`lab` termuat", name: "lab", msg: "lab harus berisi 60 baris berlabel manusia." },
          { kind: "equal", task: "t1", label: "`n_lab` = 60", name: "n_lab", value: 60, msg: "tepat 60 baris punya human_label terisi." },
          { kind: "equal", task: "t2", label: "`kappa` = 0,129", name: "kappa", value: 0.129, tol: 0.01, msg: "kappa = (0,617-0,560)/(1-0,560) = 0,129 — kesepakatan ringan." },
          { kind: "equal", task: "t2", label: "`po` = 0,617", name: "po", value: 0.617, tol: 0.01, msg: "37 dari 60 kasus disepakati (34 lulus + 3 gagal)." },
          { kind: "equal", task: "t3", label: "`judge_pass` = 0,933", name: "judge_pass", value: 0.9333, tol: 0.005, msg: "224 dari 240 kasus diluluskan judge." },
          { kind: "equal", task: "t3", label: "`human_pass` = 0,567", name: "human_pass", value: 0.5667, tol: 0.005, msg: "34 dari 60 kasus diluluskan manusia — selisih 36,6 poin dari judge." },
        ],
      },
    },
    {
      id: "lab-stratifikasi",
      eyebrow: "Langkah 6 · Lab 2 — Stratifikasi per kesulitan",
      title: "Dari mana angka 94% itu berasal?",
      prose: [
        "Satu angka headline selalu menyembunyikan komposisi. Stratifikasi = memecah metrik per kelompok (di sini: tingkat kesulitan) dan melihat apakah ceritanya berubah. Kalau “94% sukses” ternyata 96% di kasus mudah tapi 87% di kasus sulit — sementara manusia bilang kasus sulit hanya 27% yang lulus — maka headline-nya bukan berbohong tentang angka, melainkan berbohong tentang APA yang diukur.",
        "**Cara membaca chart:** sumbu X = tingkat kesulitan (mudah/sedang/sulit); tinggi batang = proporsi kasus yang diluluskan (0-1); batang biru = vonis judge (n=240), batang oranye = label manusia (n=60). **Interpretasi:** batang biru hampir rata di semua kesulitan — judge “baik hati” ke semua orang. Batang oranye jatuh tajam mengikuti kesulitan — manusia melihat perbedaan kualitas yang nyata. Kesenjangan terbesar ada di kasus sulit: judge 86,7% vs manusia 26,7% — selisih 60 poin. Di sinilah pujian judge paling mahal harganya.",
        "Perhatikan juga komposisinya: 140 dari 240 kasus (58%) adalah kasus mudah. Headline “94%” didominasi suara kasus-kasus yang memang gampang — easy-slice bias dalam bentuknya yang paling sopan: tidak ada yang dimanipulasi, hanya sampel yang miring.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_judge` dan `rate_human` per difficulty" },
        { id: "t2", text: "Hitung `mean_score` judge per difficulty" },
        { id: "t3", text: "Hitung `gap_sulit` = selisih judge vs manusia pada kasus sulit" },
      ],
      expected:
        "Judge: mudah 96,4% / sedang 90,0% / sulit 86,7%. Manusia: mudah 80,0% / sedang 50,0% / sulit 26,7%. gap_sulit = 60,0 poin.",
      echart: {
        option: {
          tooltip: { trigger: "axis", valueFormatter: "(v) => (v * 100).toFixed(1) + '%'" },
          legend: { data: ["Judge (n=240)", "Manusia (n=60)"], textStyle: { color: "#c9d4e3" } },
          xAxis: { type: "category", data: ["mudah", "sedang", "sulit"] },
          yAxis: { type: "value", min: 0, max: 1 },
          series: [
            { name: "Judge (n=240)", type: "bar", data: [0.9643, 0.9, 0.8667] },
            { name: "Manusia (n=60)", type: "bar", data: [0.8, 0.5, 0.2667] },
          ],
        },
        caption:
          "Tingkat kelulusan per tingkat kesulitan: judge (240 kasus) vs label manusia (60 kasus). Data dari eval_cases.csv (SINTETIS, seed 42).",
      },
      hints: [
        "Kelompokkan: `df.groupby(\"difficulty\")[\"judge_verdict\"].apply(lambda s: (s==\"lulus\").mean())`.",
        "Untuk manusia, kelompokkan DataFrame `lab` — bukan `df` — dengan pola yang sama pada kolom `human_label`.",
        "Rata-rata skor: `df.groupby(\"difficulty\")[\"judge_score\"].mean()`.",
        "gap_sulit = rate judge pada \"sulit\" dikurangi rate manusia pada \"sulit\".",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-evaluasi-agen/eval_cases.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "lab = df[df[\"human_label\"].notna() & (df[\"human_label\"] != \"\")].copy()",
          "",
          "rate_judge = ...      # tingkat kelulusan judge per difficulty",
          "rate_human = ...      # tingkat kelulusan manusia per difficulty (dari lab)",
          "mean_score = ...      # rata-rata judge_score per difficulty",
          "",
          "rate_mudah = ...      # float: judge, mudah",
          "rate_sedang = ...     # float: judge, sedang",
          "rate_sulit = ...      # float: judge, sulit",
          "human_sulit = ...     # float: manusia, sulit",
          "gap_sulit = ...       # selisih judge vs manusia pada kasus sulit",
          "",
          "print(\"judge per kesulitan:\")",
          "print(rate_judge.round(4))",
          "print(\"manusia per kesulitan:\")",
          "print(rate_human.round(4))",
          "print(\"rata-rata skor judge:\", mean_score.round(1).to_dict())",
          "print(\"gap sulit:\", round(gap_sulit, 3))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-evaluasi-agen/eval_cases.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "lab = df[df[\"human_label\"].notna() & (df[\"human_label\"] != \"\")].copy()",
          "",
          "rate_judge = df.groupby(\"difficulty\")[\"judge_verdict\"].apply(lambda s: (s == \"lulus\").mean())",
          "rate_human = lab.groupby(\"difficulty\")[\"human_label\"].apply(lambda s: (s == \"lulus\").mean())",
          "mean_score = df.groupby(\"difficulty\")[\"judge_score\"].mean()",
          "",
          "rate_mudah = float(rate_judge[\"mudah\"])",
          "rate_sedang = float(rate_judge[\"sedang\"])",
          "rate_sulit = float(rate_judge[\"sulit\"])",
          "human_sulit = float(rate_human[\"sulit\"])",
          "gap_sulit = rate_sulit - human_sulit",
          "",
          "print(\"judge per kesulitan:\")",
          "print(rate_judge.round(4))",
          "print(\"manusia per kesulitan:\")",
          "print(rate_human.round(4))",
          "print(\"rata-rata skor judge:\", mean_score.round(1).to_dict())",
          "print(\"gap sulit:\", round(gap_sulit, 3))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`rate_judge` termuat", name: "rate_judge", msg: "rate_judge harus berisi 3 nilai per difficulty." },
          { kind: "equal", task: "t1", label: "`rate_mudah` = 0,964", name: "rate_mudah", value: 0.9643, tol: 0.005, msg: "135 dari 140 kasus mudah diluluskan judge." },
          { kind: "equal", task: "t1", label: "`rate_sulit` = 0,867", name: "rate_sulit", value: 0.8667, tol: 0.005, msg: "26 dari 30 kasus sulit diluluskan judge — nyaris setinggi kasus mudah." },
          { kind: "equal", task: "t1", label: "`human_sulit` = 0,267", name: "human_sulit", value: 0.2667, tol: 0.01, msg: "manusia hanya meluluskan 4 dari 15 kasus sulit berlabel." },
          { kind: "equal", task: "t3", label: "`gap_sulit` = 0,60", name: "gap_sulit", value: 0.6, tol: 0.02, msg: "0,867 - 0,267 = 0,60 — kesenjangan terbesar ada di kasus tersulit." },
        ],
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 7 · Checkpoint keputusan",
      title: "Harness-nya terbukti menyanjung. Apa langkahmu?",
      prose: [
        "Buktinya lengkap: kappa 0,129 (nyaris acak), selisih judge-vs-manusia 36,6 poin, kesenjangan 60 poin di kasus sulit, prompt judge memuat kunci jawaban (kamu membacanya di METODE.md). Rollout ke 40% pelanggan tinggal 6 hari. CTO memintamu satu keputusan — bukan analisis lagi.",
        "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut, dan tidak ada opsi yang gratis.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Sistem evaluasi terbukti tidak bisa dipercaya. Dengan rollout 6 hari lagi, apa yang kamu lakukan terhadap harness evaluasi?",
        options: [
          {
            id: "opt-rebuild",
            label: "Bangun ulang harness dengan kontrol bias — tunda rollout 3 minggu",
            rationale:
              "Prompt buta (tanpa kunci jawaban), eval set di-hash terhadap data training, stratifikasi kesulitan proporsional beban produksi, judge dari keluarga model berbeda + spot-check manusia berkala. Mahal dan lambat, tapi satu-satunya jalan menuju angka yang bisa dipercaya.",
            nextStepId: "kons-rebuild",
            consequenceNote:
              "Tiga minggu kemudian angka jujur keluar: 58% — dan 4 mode kegagalan agen tertangkap sebelum produksi. CTO awalnya kecewa, lalu berterima kasih: rollout yang ditunda 3 minggu lebih murah daripada rollback di 40% pelanggan.",
          },
          {
            id: "opt-kalibrasi",
            label: "Kalibrasi judge yang ada — naikkan ambang, tambah spot-check, rollout tetap jalan",
            rationale:
              "Naikkan ambang lulus 60 → 75 dan wajibkan spot-check manusia 10% per minggu. Cepat, murah, tidak menunda rollout. Bias struktural (prompt bocor, self-preference) dianggap “bisa dikelola”.",
            nextStepId: "kons-kalibrasi",
            consequenceNote:
              "Angka turun ke ~81% dan semua orang merasa sudah “mengetatkan”. Enam bulan kemudian insiden: agen lolos evaluasi karena jawabannya cocok frasa kunci — tapi salah konteks di kasus nyata. Ambang yang dinaikkan tidak memperbaiki judge yang menilai hal yang salah.",
          },
          {
            id: "opt-manual",
            label: "Ganti ke evaluasi manusia penuh — 60 kasus per minggu, tanpa judge",
            rationale:
              "Buang judge-nya sekalian. 60 kasus per minggu dinilai manusia penuh: angka 57% yang jujur, tanpa perantara yang menyanjung. Kejujuran total, biaya total.",
            nextStepId: "kons-manual",
            consequenceNote:
              "Angka jujur setiap minggu — dengan biaya 4× lipat dan throughput evaluasi yang tidak bisa mengejar rilis. Dua kuartal kemudian CTO memangkas programnya karena “terlalu mahal”, dan tim kembali tanpa evaluasi sama sekali. Kejujuran yang tidak scalable tidak bertahan.",
          },
        ],
      },
    },
    {
      id: "kons-rebuild",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: bangun ulang harness",
      prose: [
        "Memo dikirim: rollout ditunda 3 minggu, harness dibangun ulang dengan kontrol bias penuh. Prompt judge ditulis ulang TANPA kunci jawaban — kunci hanya dipakai skrip skoring terpisah yang tidak bisa dibaca judge. Eval set 240 kasus di-hash terhadap shard training; 37 kasus yang tumpang tindih dibuang dan diganti kasus segar. Komposisi disetarakan dengan beban produksi: 40% kasus sulit. Judge diganti ke keluarga model berbeda + ensemble dua judge + spot-check manusia 15% per minggu.",
        "Tiga minggu kemudian angka jujur keluar: 58% — jauh dari 94% yang dulu. Tapi empat mode kegagalan agen tertangkap SEBELUM produksi, termasuk satu pola jawaban “percaya diri tapi salah” yang dulu selalu lolos karena judge menyukai kalimat yang tegas. CTO awalnya kecewa melihat angka turun, lalu berterima kasih di rapat berikutnya: “Rollout yang ditunda 3 minggu lebih murah daripada rollback di 40% pelanggan.”",
        "Pelajaran yang mahal tapi benar: membangun ulang itu lambat — dan justru karena lambat, ia satu-satunya opsi yang memperbaiki AKAR masalah, bukan angkanya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa opsi ini bekerja",
        body: "Ia menyerang keempat bias sekaligus: prompt buta (leaked-key), hash holdout (kontaminasi training), stratifikasi produksi (easy-slice), judge beda keluarga + manusia (leniency & self-preference). Perbaikan evaluasi selalu lebih mahal di awal dan lebih murah di akhir — biaya insiden produksi tidak pernah muncul di slide deck.",
      },
    },
    {
      id: "kons-kalibrasi",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: kalibrasi judge yang ada",
      prose: [
        "Memo dikirim: ambang lulus dinaikkan 60 → 75, spot-check manusia 10% per minggu, rollout tetap jalan sesuai jadwal. Angka headline turun ke ~81% — semua orang merasa sudah “mengetatkan” evaluasi. CTO puas: masalah selesai tanpa menunda apa pun.",
        "Enam bulan kemudian insiden P1: agen memberikan instruksi refund yang salah kepada 2.300 pelanggan. Investigasi menemukan jawaban agen itu LOLOS evaluasi dengan skor 79 — karena mengandung frasa yang cocok dengan kunci jawaban di prompt judge, meski konteksnya salah total. Ambang yang dinaikkan tidak memperbaiki apa pun: judge-nya tetap menilai kecocokan kata dengan kunci bocor, bukan kebenaran jawaban.",
        "Pelajaran yang mahal: kalibrasi ambang hanya menggeser GARIS — ia tidak memperbaiki ALAT UKUR. Judge yang menilai hal yang salah tetap menilai hal yang salah, pada ambang berapa pun.",
      ],
      tasks: [],
      note: {
        title: "Jebakan opsi ini",
        body: "Kalibrasi terlihat “pragmatis” karena murah dan cepat — dan justru itu bahayanya: ia memberi rasa aman palsu. Angka 81% terlihat lebih jujur dari 94%, padahal mekanisme kebohongannya (prompt bocor, self-preference, easy-slice) tidak tersentuh sama sekali. Rasa aman palsu lebih berbahaya daripada angka yang jelas-jelas bohong.",
      },
    },
    {
      id: "kons-manual",
      goto: "audit",
      eyebrow: "Langkah 8 · Konsekuensi",
      title: "Diputuskan: evaluasi manusia penuh",
      prose: [
        "Memo dikirim: judge dibuang, 60 kasus per minggu dinilai manusia penuh. Angkanya jujur — 57%, stabil dari minggu ke minggu. Tidak ada lagi pujian palsu. Tim QA menjadi pahlawan kejujuran.",
        "Lalu realitas biaya datang menagih: 4× lipat biaya evaluasi, throughput yang tidak bisa mengejar cadence rilis dua-mingguan, dan antrean penilaian yang menumpuk setiap ada hotfix. Dua kuartal kemudian CTO memangkas programnya: “Terlalu mahal untuk dipertahankan.” Tim kembali ke titik nol — tanpa evaluasi sama sekali, karena harness judge yang lama sudah dibuang dan tidak ada yang membangun penggantinya.",
        "Pelajaran yang mahal: kejujuran yang tidak scalable tidak bertahan. Sistem evaluasi harus cukup murah untuk dijalankan SELAMANYA — kalau tidak, ia akan mati dibunuh anggarannya sendiri.",
      ],
      tasks: [],
      note: {
        title: "Jebakan opsi ini",
        body: "Manusia adalah jangkar kebenaran terbaik — tapi jangkar yang terlalu berat menenggelamkan kapal. Desain yang benar memakai manusia secara HEMAT: sebagai kalibrasi berkala dan penengah sengketa (spot-check 10-15%), bukan sebagai satu-satunya mesin penilaian. Opsi rebuild memakai pola ini; opsi manual tidak.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 9 · Misi audit",
      title: "Dossier 12 baris: laporan “94%” itu bohong",
      prose: [
        "Sebelum menulis desain evaluasi ulang, satu misi audit. Di bawah ini 12 baris “Laporan Evaluasi Bulanan — Agen Support v3”, dokumen yang dipakai CTO untuk memutuskan rollout. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu sendiri — kappa 0,129, stratifikasi per kesulitan, dan isi prompt v1 dari METODE.md.",
        "Cara kerja: untuk setiap baris, cocokkan klaim laporan dengan angka yang KAMU hitung dari data mentah — bukan dengan angka laporan itu sendiri.",
      ],
      tasks: [],
      auditDossier: {
        version: "judge-misic-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Evaluasi Bulanan Agen Support v3 (n=240, LLM-judge, headline 94% sukses). Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
        columns: ["#", "Klaim laporan", "Fakta dari data", "Status"],
        rows: [
          { rowId: 1, cells: { "#": "1", "Klaim laporan": "Headline: 94% sukses", "Fakta dari data": "Judge: 224/240 = 93,3%; manusia: 34/60 = 56,7%", "Status": "Dua angka, satu headline" }, claims: [{ label: "Klaim", value: "94% sukses (n=240)" }] },
          { rowId: 2, cells: { "#": "2", "Klaim laporan": "Prompt judge netral, tanpa kunci jawaban", "Fakta dari data": "Template v1 memuat {answer_key} langsung — lihat METODE.md", "Status": "SABOTASE I1" }, claims: [{ label: "Klaim", value: "Prompt netral" }] },
          { rowId: 3, cells: { "#": "3", "Klaim laporan": "Eval set 240 kasus segar", "Fakta dari data": "37 case_id cocok hash dengan shard training T-7 (15,4%)", "Status": "SABOTASE I2" }, claims: [{ label: "Klaim", value: "Kasus segar, tidak ada di training" }] },
          { rowId: 4, cells: { "#": "4", "Klaim laporan": "Judge netral antar model", "Fakta dari data": "Model sekeluarga judge: +18 poin vs model lain pada kualitas setara (blind human rating sama)", "Status": "SABOTASE I3" }, claims: [{ label: "Klaim", value: "Netral antar model" }] },
          { rowId: 5, cells: { "#": "5", "Klaim laporan": "Metrik mewakili semua kesulitan", "Fakta dari data": "Headline didominasi 140 kasus mudah (58%); kasus sulit hanya 30", "Status": "SABOTASE I4" }, claims: [{ label: "Klaim", value: "Mewakili semua tingkat kesulitan" }] },
          { rowId: 6, cells: { "#": "6", "Klaim laporan": "Ambang lulus 60 objektif", "Fakta dari data": "Rata-rata skor kelompok gagal = 68 — ambang berada DI BAWAH rata-rata yang gagal", "Status": "Menyesatkan" }, claims: [{ label: "Klaim", value: "Ambang 60 sudah objektif" }] },
          { rowId: 7, cells: { "#": "7", "Klaim laporan": "Spot-check manusia mendukung 94%", "Fakta dari data": "Spot-check: 56,7% lulus; kappa judge-vs-manusia = 0,129", "Status": "Kontradiksi" }, claims: [{ label: "Klaim", value: "Spot-check mendukung headline" }] },
          { rowId: 8, cells: { "#": "8", "Klaim laporan": "Kappa tidak perlu dilaporkan", "Fakta dari data": "kappa = 0,129 (ringan) — tidak disebut sama sekali di laporan", "Status": "Disembunyikan" }, claims: [{ label: "Klaim", value: "Skor mentah cukup" }] },
          { rowId: 9, cells: { "#": "9", "Klaim laporan": "Distribusi kesulitan ikut beban produksi", "Fakta dari data": "Produksi: ~40% kasus sulit; eval set: 12,5% sulit (30/240)", "Status": "Tidak proporsional" }, claims: [{ label: "Klaim", value: "Proporsional dengan produksi" }] },
          { rowId: 10, cells: { "#": "10", "Klaim laporan": "Sampel 240 kasus: ukuran memadai", "Fakta dari data": "Cukup untuk estimasi ±6 poin pada CI 95% — klaim ukuran benar", "Status": "OK" }, claims: [{ label: "Klaim", value: "n=240 memadai" }] },
          { rowId: 11, cells: { "#": "11", "Klaim laporan": "Seed & metode terdokumentasi", "Fakta dari data": "Seed 42, generator & METODE.md tersedia dan bisa direproduksi", "Status": "OK" }, claims: [{ label: "Klaim", value: "Reprodusibel" }] },
          { rowId: 12, cells: { "#": "12", "Klaim laporan": "Skor mentah tersedia untuk audit", "Fakta dari data": "eval_cases.csv: 240 baris, kolom lengkap, terbuka dihitung ulang", "Status": "OK" }, claims: [{ label: "Klaim", value: "Dapat diaudit" }] },
        ],
        injections: [
          { key: "prompt-bocor", rowIds: [2], title: "Prompt judge membocorkan kunci jawaban", clue: "Laporan mengklaim prompt “netral, tanpa kunci jawaban”. METODE.md menunjukkan template v1 memuat {answer_key} langsung — judge menilai kecocokan kata dengan kunci, bukan kualitas jawaban. Agen penghafal frasa lolos; agen berkalimat sendiri bisa gagal.", danger: "Di produksi, ini meloloskan agen yang “terdengar benar” (cocok kunci) tapi salah konteks — persis pola insiden refund 2.300 pelanggan di skenario kalibrasi. Evaluasi mengukur kemampuan mencontek kunci, bukan kemampuan membantu pelanggan." },
          { key: "eval-training-overlap", rowIds: [3], title: "Eval set tumpang tindih dengan data training", clue: "Laporan mengklaim 240 kasus “segar”. Hash 37 case_id cocok dengan shard training T-7 (15,4%) — agen pernah melihat soal-soal ini saat training. Skornya mengukur ingatan, bukan generalisasi.", danger: "Kontaminasi training-eval adalah cara paling sunyi untuk memalsukan kemajuan: setiap iterasi training “meningkatkan skor” tanpa meningkatkan kemampuan. Tim mengira agen makin pintar; yang makin pintar hanya hafalannya." },
          { key: "self-preference", rowIds: [4], title: "Judge memihak model sekeluarga (self-preference bias)", clue: "Laporan mengklaim judge “netral antar model”. Blind human rating menyebut kualitas jawaban Agen-X (sekeluarga judge) dan Agen-Y setara — tapi judge memberi +18 poin untuk Agen-X. Netralitas tidak terbukti; ia hanya diasumsikan.", danger: "Bias ini membuat tim memilih model yang “menang evaluasi” padahal hanya menang karena dinilai saudaranya sendiri. Keputusan arsitektur bernilai miliaran rupiah didasarkan pada nepotisme statistik." },
          { key: "easy-slice", rowIds: [5], title: "Metrik dihitung hanya di slice kasus mudah", clue: "Laporan mengklaim metrik “mewakili semua kesulitan”. Faktanya 140 dari 240 kasus (58%) adalah kasus mudah — headline 94% didominasi suara kasus gampang. Di kasus sulit, manusia hanya meluluskan 26,7% sementara judge mengklaim 86,7%.", danger: "Easy-slice adalah cara paling sopan untuk berbohong dengan angka: tidak ada yang dimanipulasi, hanya sampel yang miring. Keputusan rollout ke 40% pelanggan — yang bebannya 40% kasus sulit — didasarkan pada angka yang 58%-nya berasal dari kasus mudah." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 10 · Deliverable",
      title: "Dokumen desain evaluasi dengan kontrol bias",
      prose: [
        "Semua bukti di tangan: kappa 0,129, selisih 36,6 poin judge-vs-manusia, kesenjangan 60 poin di kasus sulit, keputusan perbaikanmu, dan 4 sabotase dari audit. Tulis dokumen desain evaluasi ulang — artefak portofoliomu. Dokumen yang baik bukan sekadar “kita harus lebih jujur”, melainkan desain yang membuat ketidakjujuran SULIT terjadi: setiap bias punya kontrol yang bisa diverifikasi orang lain.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (1 paragraf): angka jujur — judge 93,3% vs manusia 56,7%, kappa 0,129 — + rekomendasi keputusanmu di Langkah 7 + dampaknya pada jadwal rollout.",
          "Desain ulang prompt judge: prompt BUTA (tanpa {answer_key} di template); kunci jawaban hanya dipakai skrip skoring terpisah; rubrik penilaian eksplisit per dimensi (kebenaran, kelengkapan, keamanan).",
          "Desain eval set: stratifikasi kesulitan proporsional beban produksi (target 40% sulit); holdout — setiap case_id di-hash terhadap shard training, tumpang tindih = dibuang; ukuran sampel + alasan statistiknya.",
          "Kontrol bias: judge dari keluarga model berbeda dari agen yang dinilai (atau ensemble multi-judge); blind comparison berkala antar keluarga model; spot-check manusia 10-15% per minggu dengan kappa dilaporkan rutin; ambang lulus dikalibrasi terhadap label manusia, bukan ditetapkan perasaan.",
          "Aturan pelaporan: metrik WAJIB dilaporkan per stratum kesulitan; headline satu angka DILARANG tanpa tabel stratifikasi; kappa judge-vs-manusia tampil di setiap laporan bulanan.",
          "Batas & risiko sisa: apa yang TIDAK diperbaiki desain ini (mis. label manusia sendiri bisa bias; biaya spot-check; data SINTETIS — angka misi ini bukan benchmark sistem nyata).",
        ],
        rubric: [
          { criterion: "Kebenaran angka & diagnosis", weight: 30, levels: ["Angka salah / diagnosis tidak berdasar data", "Sebagian angka benar", "93,3% vs 56,7%, kappa 0,129, gap sulit 60 poin — semua tepat + diagnosis merujuk 4 bias"] },
          { criterion: "Kelengkapan kontrol bias", weight: 30, levels: ["Kontrol generik tanpa mekanisme", "Sebagian bias punya kontrol", "Keempat bias (leniency, self-preference, leaked-key, easy-slice) masing-masing punya kontrol yang bisa diverifikasi"] },
          { criterion: "Desain eval set & pelaporan", weight: 20, levels: ["Tidak menyentuh desain sampel", "Menyebut stratifikasi/holdout tanpa detail", "Stratifikasi proporsional produksi + hash holdout + larangan headline satu angka, operasional"] },
          { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim desain sempurna", "Menyebut sebagian batas", "Batas (bias label manusia, biaya, data SINTETIS) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 11 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di laporan evaluasi “94%”:",
        "1) **Prompt bocor** (baris 2): template v1 memuat {answer_key} langsung. Judge tidak menilai kualitas jawaban — ia menilai kecocokan kata dengan kunci. Agen penghafal frasa lolos; agen yang menjawab benar dengan kalimat sendiri bisa gagal.",
        "2) **Eval-training overlap** (baris 3): 37 dari 240 case_id (15,4%) cocok hash dengan shard training T-7. Agen pernah melihat soal-soal ini. Skornya mengukur ingatan, bukan generalisasi — dan setiap iterasi training “meningkatkan skor” tanpa meningkatkan kemampuan.",
        "3) **Self-preference bias** (baris 4): judge memberi +18 poin untuk model sekeluarganya pada kualitas yang — menurut blind human rating — setara. Netralitas tidak pernah dibuktikan; ia hanya diasumsikan dari ketiadaan ego.",
        "4) **Easy-slice** (baris 5): 140 dari 240 kasus (58%) adalah kasus mudah. Headline 94% didominasi suara kasus gampang, sementara beban produksi justru 40% kasus sulit — irisan di mana manusia hanya meluluskan 26,7%.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “94% sukses”.",
        "Bahaya nyata terakhir: agen yang buruk lolos ke produksi BUKAN karena tidak ada evaluasi, melainkan karena evaluasinya menyanjung. Keputusan rollout ke 40% pelanggan, anggaran training berikutnya, bahkan pilihan arsitektur model — semuanya didasarkan pada angka yang mengukur kebaikan hati judge, bukan kualitas agen. Evaluasi yang menyanjung lebih berbahaya daripada tidak ada evaluasi: ia memberi izin untuk salah dengan percaya diri.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: evaluasi cukup sekali sebelum rilis",
        type: "pitfall",
        body: "“Kan sudah dievaluasi sebelum rollout — 94%.” Evaluasi bukan vaksin sekali suntik; ia adalah pemantauan. Data produksi bergeser (drift), agen di-update, prompt judge menua — angka bulan lalu tidak menjamin apa pun bulan ini. Desain yang benar di deliverable-mu: spot-check manusia berkala + kappa dilaporkan rutin. Evaluasi yang berhenti setelah rilis = lampu yang dimatikan tepat saat jalanan mulai gelap.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 12 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "LLM-judge melaporkan 93,3% sukses (224/240) sementara label manusia hanya 56,7% (34/60) — selisih 36,6 poin adalah ukuran “pujian” judge, bukan kualitas agen.",
        "Cohen's kappa = 0,129 (p_o=0,617, p_e=0,560): kesepakatan judge-vs-manusia nyaris setara kebetulan — kategori “ringan”. Di bawah 0,2, judge tidak layak dipakai tanpa manusia.",
        "Stratifikasi membongkar easy-slice bias: 58% sampel adalah kasus mudah; kesenjangan judge-vs-manusia terbesar ada di kasus sulit (86,7% vs 26,7% = 60 poin).",
        "Empat pola sabotase evaluasi: prompt membocorkan kunci jawaban, eval set tumpang tindih dengan training (15,4%), self-preference bias (+18 poin sekeluarga), metrik dari slice kasus mudah.",
        "Kontrol desain: prompt buta, hash holdout vs training, stratifikasi proporsional produksi, judge beda keluarga + spot-check manusia berkala, larangan headline satu angka, kappa dilaporkan rutin.",
        "Data: 240 kasus evaluasi SINTETIS (seed 42), BUKAN data asli; ambang & parameter disederhanakan untuk latihan — file METODE.md.",
      ],
    },
  ],
};

export default misiGabungEvaluasi;
