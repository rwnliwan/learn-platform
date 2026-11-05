import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI CAPSTONE (kombinasi): Pipeline riset alpha ───────────────────────
// WorldQuant Brain × ML Engineer. Dataset SINTETIS 100%: 8 baris statistik
// AGREGAT fiksi (4 family rekaan × 2 versi pipeline, seed 42) — BUKAN data
// asli, BUKAN antrean submit siapa pun, TANPA ekspresi alpha mentah,
// TANPA kredensial/data akun. Tokoh: fiksi.
// File: public/misi/misi-gabung-pipeline-alpha/pipeline_batch.csv.
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-gabung-pipeline-alpha";

export const misiGabungPipeline: V2Mission = {
  slug: "misi-gabung-pipeline-alpha",
  track: "WorldQuant Brain",
  module: "Misi",
  title: "Misi Pipeline: Dari Notebook ke Antrean yang Jujur",
  estMinutes: 195,
  role: "Analis kuantitatif",
  client:
    "Kepala riset kuantitatif — pipeline riset (predictor ML + batch simulasi + triase self-corr) seseorang “diperbaiki” diam-diam; ambang triase berubah tanpa catatan",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Pipeline v2 datang tanpa changelog",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis kuantitatif di tim riset — auditor pipeline, penjaga kejujuran antrean",
        client:
          "Kepala riset kuantitatif. Jumat sore, Danu (tokoh fiksi, anggota tim) mengumumkan di channel: “Pipeline riset v2 sudah diperbaiki — hasilnya jauh lebih baik.” Tidak ada changelog. Tidak ada commit message yang menjelaskan apa yang berubah. Yang ada hanya satu slide: skor CV predictor ML melonjak dari 0,72 menjadi 0,96, dan antrean kandidat membengkak dari 94 menjadi 168. Kamu diminta satu hal sebelum pipeline v2 dipakai untuk submit: buktikan bahwa angka-angka itu jujur — atau buktikan sebaliknya.",
        story: [
          "Senin, 08:05. Slide Danu masih terbuka di layarmu. Dua angka menatap balik: CV 0,96 dan 168 antrean. Kamu sudah cukup lama di tim ini untuk tahu satu hal: keajaiban tanpa penjelasan biasanya bukan keajaiban. Tiga bulan lalu, “perbaikan” serupa ternyata adalah ambang triase yang dilonggarkan diam-diam — tim menghabiskan dua sprint me-review kandidat yang seharusnya kena penalti.",
          "Pipeline riset tim ini punya tiga tahap: predictor ML menilai kandidat sebelum disimulasikan penuh, batch menjalankan simulasi dengan kunci dedup agar tidak ada yang terhitung dua kali, lalu triase self-corr menyaring antrean final. Kalau satu tahap berbohong, dua tahap lainnya ikut tercemar — dan yang dikorbankan adalah slot submit, sumber daya paling mahal yang dimiliki tim.",
          "Pagi ini kamu memegang satu-satunya artefak yang tersisa dari kedua versi pipeline: file agregat per family per versi, delapan baris. Tidak ada kode v2 yang bisa dibaca — Danu “lupa” push. Misi ini: audit v2 terhadap v1 dari data agregat, temukan apa yang diubah diam-diam, dan putuskan apakah pipeline ini boleh menyentuh antrean submit.",
        ],
        objectives: [
          "Membandingkan hasil triase v1 vs v2 dari data agregat dan menemukan perubahan ambang yang tidak tercatat.",
          "Mengaudit skor CV predictor v2 — apakah dihitung di data training? — lewat gap train-vs-CV.",
          "Menemukan 4 sabotase di laporan v2 dan menulis checklist audit pipeline ber-rubrik sebagai deliverable.",
        ],
        prereqSummary:
          "Alpha = sebuah formula sinyal trading (aturan “kapan beli/jual” yang bisa diuji). Predictor = model ML yang menebak alpha mana yang menjanjikan sebelum disimulasikan penuh; skornya WAJIB diukur di data yang tidak dipakai training (cross-validation) — kalau tidak, angkanya bohong. Triase self-corr = filter antrean: alpha yang terlalu mirip (>0,7) dengan alpha yang sudah ada dianggap duplikat dan tidak disubmit.",
        datasetNote:
          "Data 100% SINTETIS: 8 baris statistik AGREGAT fiksi (4 family rekaan × 2 versi pipeline) hasil generator acak (seed 42) — BUKAN data asli, BUKAN antrean submit siapa pun, TANPA ekspresi alpha mentah, TANPA kredensial/data akun. Family “rv-1d/mom-5d/vb-or/sqz-x” adalah nama rekaan, bukan family strategi nyata.\nFile: pipeline_batch.csv — kolom version, family, n_sims, sharpe_mean, fitness_mean, turnover_pct_mean, dedup_hits, antrian, penalti, tahan, buang, cv_auc, train_auc.\nMetode & batas jujur: file METODE.md di folder yang sama. Ambang triase dan aturan praktis self-corr >0,7 disederhanakan untuk latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Delapan baris agregat, dua versi pipeline",
      prose: [
        "File `pipeline_batch.csv` adalah satu-satunya sumber kebenaran di misi ini: 8 baris, 13 kolom. Tiap baris = satu family fiksi pada satu versi pipeline. Kolomnya tiga kelompok: (1) identitas — `version` (v1/v2), `family`, `n_sims`; (2) kualitas — `sharpe_mean`, `fitness_mean`, `turnover_pct_mean`, `dedup_hits` (berapa duplikat yang tertangkap kunci dedup); (3) hasil — `antrian`, `penalti`, `tahan`, `buang` (komposisi triase), plus `cv_auc` dan `train_auc` (skor predictor).",
        "Data ini SINTETIS (seed 42) — dinyatakan eksplisit agar tidak ada yang mengira ini bocoran pipeline asli. Justru karena sintetis, kamu bisa fokus pada keterampilannya: membaca perubahan SISTEM dari angka agregat, tanpa akses ke kode.",
        "Aturan baca data room: (1) bandingkan v1 vs v2 PER FAMILY dulu — family yang sama, pipeline yang beda; (2) curigai perubahan yang MERATA di semua family (sistemik, bukan kebetulan); (3) curigai angka yang “terlalu rapi” — nol di semua baris, atau dua kolom yang identik persis.",
      ],
      tasks: [
        { id: "t1", text: "Buka `pipeline_batch.csv`: catat jumlah baris, versi, dan family yang ada" },
        { id: "t2", text: "Bandingkan `cv_auc` v1 vs v2 per family — catat pola yang kamu lihat" },
      ],
      note: {
        title: "Miskonsepsi #1: data agregat tidak bisa diaudit",
        type: "pitfall",
        body: "“Cuma 8 baris agregat — mana bisa menemukan sabotase tanpa kode sumbernya?” Justru bisa. Agregat menyimpan sidik jari sistem: perubahan ambang menggeser SEMUA family sekaligus; evaluasi bocor membuat dua kolom identik persis; kunci dedup yang rusak membuat satu kolom menjadi nol di semua baris. Kamu tidak butuh kodenya — kamu butuh polanya.",
      },
      reference:
        "pipeline_batch.csv (8 baris SINTETIS, seed 42) — satu-satunya sumber kebenaran; v1 = baseline jujur, v2 = “diperbaiki” dan perlu diaudit.",
    },
    {
      id: "teori-alpha",
      eyebrow: "Langkah 3 · Teori — lensa riset alpha",
      title: "Ambang triase adalah kontrak",
      prose: [
        "Lensa pertama: riset alpha. Triase bukan sekadar filter — ia adalah KONTRAK tertulis tentang arti kata “layak”. Kontrak versi tim ini: ANTRIAN = {S ≥ τ_S ∧ F ≥ τ_F ∧ TO ≤ τ_TO}, dengan τ_S = 1,4, τ_F = 1,1, τ_TO = 40%. Tiga angka tau itu bukan parameter teknis; mereka adalah definisi yang disepakati seluruh tim tentang kandidat seperti apa yang pantas memakan slot review.",
        "Konsekuensinya tajam: siapa pun yang mengubah tau tanpa catatan tidak sedang “memperbaiki pipeline” — ia sedang menulis ulang kontrak tanpa memberi tahu pihak yang terikat kontrak. Semua keputusan historis (siapa yang dulu di-BUANG, siapa yang di-TAHAN) kehilangan pembandingnya. Antrean 168 dari v2 dan antrean 94 dari v1 bukan dua versi dari hal yang sama; mereka adalah dua definisi “layak” yang berbeda, dan hanya satu yang disepakati tim.",
        "Dua penjaga lain melengkapi kontrak ini. Kunci dedup (expression+region+decay+delay) memastikan satu sim tidak terhitung dua kali — kunci yang kehilangan satu field diam-diam menggandakan bobot satu sinyal. Dan aturan self-corr >0,7 memastikan antrean tidak terisi duplikat dari alpha yang sudah ada — duplikat yang lolos submit berujung penalti platform.",
        "Chart di bawah memvisualkan sidik jari perubahan ambang: kenaikan ANTRIAN yang merata di semua family, sementara Sharpe dan fitness MEAN per family nyaris tidak bergerak.",
      ],
      tasks: [
        { id: "t1", text: "Tulis ulang definisi ANTRIAN dengan kata-katamu sendiri, sebutkan ketiga tau" },
        { id: "t2", text: "Jelaskan ke diri sendiri: kenapa mengubah tau tanpa catatan = menulis ulang kontrak?" },
      ],
      formula: String.raw`\text{ANTRIAN} = \{ S \ge \tau_S \land F \ge \tau_F \land TO \le \tau_{TO} \}`,
      formulaNote:
        "S = Sharpe, F = fitness, TO = turnover. τ_S = 1,4, τ_F = 1,1, τ_TO = 40% adalah nilai kontrak tim (disederhanakan untuk misi ini). Angka ini artinya: kandidat masuk antrean hanya jika kuat di KETIGA metrik sekaligus. Menggeser satu tau — mis. τ_S 1,4 → 1,2 — mengubah HIMPUANAN kandidat yang lolos, bukan kualitas kandidatnya. Contoh: family sqz-x (Sharpe mean 1,18) yang tadinya mayoritas TAHAN/BUANG tiba-tiba menyumbang 18 ANTRIAN di v2.",
      echart: {
        option: {
          title: { text: "ANTRIAN per family: v1 vs v2" },
          tooltip: { trigger: "axis" },
          legend: { data: ["v1 (jujur)", "v2 (diperbaiki)"] },
          xAxis: { type: "category", data: ["rv-1d", "mom-5d", "vb-or", "sqz-x"] },
          yAxis: { type: "value", name: "ANTRIAN" },
          series: [
            { name: "v1 (jujur)", type: "bar", data: [42, 20, 26, 6] },
            { name: "v2 (diperbaiki)", type: "bar", data: [68, 44, 38, 18] },
          ],
        },
        caption:
          "Cara membaca: sumbu X = family fiksi, tinggi batang = jumlah ANTRIAN. Interpretasi: v2 menambah ANTRIAN di SEMUA family (total 94 → 168) sementara Sharpe/fitness MEAN per family nyaris identik — kenaikan merata tanpa perbaikan kualitas adalah sidik jari perubahan AMBANG, bukan perbaikan model.",
      },
      note: {
        title: "Miskonsepsi #2: melonggarkan ambang = memperbaiki pipeline",
        type: "pitfall",
        body: "“Antrean naik dari 94 ke 168 — pipeline v2 jelas lebih baik menemukan kandidat.” Salah membaca arah sebab-akibat. Pipeline tidak menemukan 74 kandidat baru; ia menDEFINISI ulang 74 kandidat lama sebagai “layak”. Kualitas tidak berubah — yang berubah hanya labelnya. Itu bukan perbaikan; itu inflasi label.",
      },
      reference:
        "Kontrak triase: BUANG bila S<1,25 atau F<1; PENALTI bila TO>40%; ANTRIAN bila S≥1,4 & F≥1,1 & TO≤40%; sisanya TAHAN. Self-corr >0,7 = duplikat.",
    },
    {
      id: "teori-ml",
      eyebrow: "Langkah 4 · Teori — lensa ML engineering",
      title: "Skor CV yang jujur vs yang bocor",
      prose: [
        "Lensa kedua: ML engineering. Predictor tim ini adalah model klasifikasi: menebak kandidat mana yang akan lolos triase, agar batch simulasi yang mahal hanya dijalankan untuk kandidat menjanjikan. Skornya dilaporkan sebagai AUC cross-validation — rata-rata performa di lipatan-lipatan data yang TIDAK dipakai training lipatan itu.",
        "Ada satu angka yang tidak pernah berbohong tentang kejujuran evaluasi: gap = AUC_train − AUC_CV. Model yang dievaluasi dengan jujur SELALU sedikit lebih bagus di data training-nya sendiri — gap kecil positif (0,03–0,08) adalah tanda sehat. Gap = 0,000 persis, di empat family independen, secara statistik mustahil — kecuali skor “CV” dihitung dari data yang sama dengan training. Itu namanya kebocoran evaluasi (leakage): model diuji dengan soal yang sudah ia hafal jawabannya.",
        "Kebocoran evaluasi adalah sabotase yang paling manis: ia membuat SEMUA metrik headline terlihat membaik. Predictor “sempurna” menyanjung semua kandidat, triase menerima sanjungan itu, antrean membengkak — dan tidak ada satu pun tahap yang berteriak. Pipeline yang bocor tidak terlihat rusak; ia terlihat SEMPURNA. Itulah bahayanya.",
        "Lensa ML engineering juga menuntut tiga hal non-angka: changelog (apa yang berubah, kapan, oleh siapa), unit test satuan (apakah kolom “persen” benar-benar persen?), dan seed yang tercatat (apakah hasil bisa direproduksi?). v2 gagal di ketiganya — dan kegagalan non-angka inilah yang membuat keempat sabotase angka bisa terjadi tanpa terdeteksi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan dengan kata-katamu: kenapa gap train−CV = 0,000 di 4 family = mustahil tanpa kebocoran?" },
        { id: "t2", text: "Sebutkan 3 artefak non-angka yang wajib ada di pipeline jujur (changelog, unit test, seed)" },
      ],
      formula: String.raw`\text{gap} = \text{AUC}_{\text{train}} - \text{AUC}_{\text{CV}}`,
      formulaNote:
        "AUC_train = skor di data training, AUC_CV = skor cross-validation. Angka ini artinya selisih “hafalan” vs “pemahaman”. Contoh: v1 → 0,7755 − 0,723 = 0,0525 (sehat: model sedikit lebih hafal daripada paham). v2 → 0,9555 − 0,9555 = 0,000 (tidak sehat: tidak ada beda antara hafalan dan pemahaman — karena yang diuji adalah hafalannya).",
      note: {
        title: "Miskonsepsi #3: skor CV tinggi = model bagus",
        type: "pitfall",
        body: "“CV 0,96 — predictor v2 jelas lebih pintar dari v1 yang cuma 0,72.” Skor CV bukan sifat model; ia sifat PROSEDUR evaluasi. Prosedur yang bocor menghasilkan skor tinggi untuk model apa pun — bahkan model yang menebak asal. Jangan tanya “berapa skornya?” sebelum bertanya “di data apa skor itu dihitung?”.",
      },
      reference:
        "Gap sehat: 0,03–0,08. Gap = 0,000 di ≥2 subset independen = red flag kebocoran. Changelog + unit test + seed tercatat = syarat pipeline yang bisa diaudit.",
    },
    {
      id: "lab-ambang",
      eyebrow: "Langkah 5 · Lab 1 — bandingkan ambang triase",
      title: "v1 vs v2: siapa yang menggerakkan angka?",
      prose: [
        "Waktunya membuktikan kecurigaan dengan kode. Muat CSV, pisahkan v1 dan v2, lalu hitung total ANTRIAN, PENALTI, dan n_sims per versi. Hipotesis yang diuji: apakah kenaikan antrean v2 berasal dari kandidat yang membaik — atau dari ambang yang bergerak?",
        "Petunjuk baca hasil: kalau Sharpe/Fitness MEAN per family nyaris sama antara v1 dan v2 TAPI komposisi triase berubah drastis, maka yang bergerak bukan kandidatnya — melainkan ATURANnya. Itu sidik jari perubahan ambang.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; pisahkan menjadi `v1` dan `v2`" },
        { id: "t2", text: "Hitung total `antrian_v1`, `antrian_v2`, `penalti_v1`, `penalti_v2`" },
        { id: "t3", text: "Hitung `selisih_n` (n_sims v2 − v1) dan `rasio_antrian` (v2/v1, 3 desimal)" },
      ],
      expected:
        "antrian 94 → 168 (rasio 1,787); penalti 32 → 0; n_sims 315 → 346 (+31). Sharpe/fitness MEAN per family nyaris identik — yang bergerak adalah aturan, bukan kandidat: ambang dilonggarkan diam-diam.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Pisahkan versi: `v1 = df[df[\"version\"] == \"v1\"]` — lalu jumlahkan kolomnya.",
        "Total satu kolom: `int(v1[\"antrian\"].sum())`; n_sims total: `v2[\"n_sims\"].sum() - v1[\"n_sims\"].sum()`.",
        "Rasio: `round(antrian_v2 / antrian_v1, 3)` — bandingkan juga mean Sharpe v1 vs v2 untuk melihat “kandidat tidak berubah”.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-alpha/pipeline_batch.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "v1 = ...",
          "v2 = ...",
          "",
          "antrian_v1 = ...",
          "antrian_v2 = ...",
          "penalti_v1 = ...",
          "penalti_v2 = ...",
          "selisih_n = ...        # n_sims total v2 dikurangi v1",
          "rasio_antrian = ...    # antrian_v2 / antrian_v1, bulatkan 3 desimal",
          "",
          "print(\"antrian:\", antrian_v1, \"->\", antrian_v2)",
          "print(\"penalti:\", penalti_v1, \"->\", penalti_v2)",
          "print(\"selisih n_sims:\", selisih_n, \"| rasio antrean:\", rasio_antrian)",
          "print(\"sharpe mean v1/v2:\", round(float(v1[\"sharpe_mean\"].mean()), 3),",
          "      round(float(v2[\"sharpe_mean\"].mean()), 3))",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-alpha/pipeline_batch.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "v1 = df[df[\"version\"] == \"v1\"]",
          "v2 = df[df[\"version\"] == \"v2\"]",
          "",
          "antrian_v1 = int(v1[\"antrian\"].sum())",
          "antrian_v2 = int(v2[\"antrian\"].sum())",
          "penalti_v1 = int(v1[\"penalti\"].sum())",
          "penalti_v2 = int(v2[\"penalti\"].sum())",
          "selisih_n = int(v2[\"n_sims\"].sum() - v1[\"n_sims\"].sum())",
          "rasio_antrian = round(antrian_v2 / antrian_v1, 3)",
          "",
          "print(\"antrian:\", antrian_v1, \"->\", antrian_v2)",
          "print(\"penalti:\", penalti_v1, \"->\", penalti_v2)",
          "print(\"selisih n_sims:\", selisih_n, \"| rasio antrean:\", rasio_antrian)",
          "print(\"sharpe mean v1/v2:\", round(float(v1[\"sharpe_mean\"].mean()), 3),",
          "      round(float(v2[\"sharpe_mean\"].mean()), 3))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t2", label: "`antrian_v1` = 94", name: "antrian_v1", value: 94, msg: "Jumlahkan kolom antrian untuk baris version == v1." },
          { kind: "equal", task: "t2", label: "`antrian_v2` = 168", name: "antrian_v2", value: 168, msg: "Jumlahkan kolom antrian untuk baris version == v2." },
          { kind: "equal", task: "t2", label: "`penalti_v1` = 32", name: "penalti_v1", value: 32, msg: "v1: 9+11+4+8 = 32 kandidat kena penalti turnover." },
          { kind: "equal", task: "t2", label: "`penalti_v2` = 0", name: "penalti_v2", value: 0, msg: "v2: NOL di semua family — filter penalti mati total." },
          { kind: "equal", task: "t3", label: "`selisih_n` = 31", name: "selisih_n", value: 31, msg: "n_sims 315 → 346: ada 31 sim 'tambahan' yang tak bisa dijelaskan." },
          { kind: "equal", task: "t3", label: "`rasio_antrian` = 1,787", name: "rasio_antrian", value: 1.787, tol: 0.002, msg: "168/94 = 1,787 — antrean naik 78,7% tanpa perbaikan kualitas." },
        ],
      },
    },
    {
      id: "lab-predictor",
      eyebrow: "Langkah 6 · Lab 2 — audit predictor",
      title: "Apakah skor CV dihitung di data training?",
      prose: [
        "Sekarang audit predictor-nya. Hitung rata-rata `cv_auc` dan `train_auc` per versi, lalu gap-nya (train − CV). Satu angka gap menjawab pertanyaan paling penting misi ini: apakah “CV 0,96” itu validasi — atau hafalan?",
        "Setelah itu uji flag `bocor_v2`: apakah cv_auc SAMA PERSIS dengan train_auc di SEMUA baris v2? Identik persis di 4 family independen bukan kebetulan — itu tanda tangan kebocoran.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; pisahkan `v1` dan `v2`" },
        { id: "t2", text: "Hitung `cv_v1`, `train_v1`, `cv_v2`, `train_v2` (rata-rata per versi, 4 desimal)" },
        { id: "t3", text: "Hitung `gap_v1`, `gap_v2` dan flag `bocor_v2` (True bila cv==train di semua baris v2)" },
      ],
      expected:
        "v1: CV 0,723 vs train 0,7755 (gap 0,0525 — sehat). v2: CV = train = 0,9555 di SEMUA family (gap 0,000) — mustahil tanpa kebocoran: skor CV v2 dihitung di data training.",
      hints: [
        "Rata-rata kolom: `float(v1[\"cv_auc\"].mean())` — bulatkan 4 desimal.",
        "Gap: `round(train_v1 - cv_v1, 4)` — bandingkan dengan rentang sehat 0,03–0,08.",
        "Flag bocor: `((v2[\"cv_auc\"] - v2[\"train_auc\"]).abs() < 1e-9).all()` lalu bungkus `bool(...)`.",
        "Kalau gap_v2 = 0,000 persis, tanyakan: berapa peluang 4 family independen menghasilkan angka identik?",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-alpha/pipeline_batch.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "v1 = df[df[\"version\"] == \"v1\"]",
          "v2 = df[df[\"version\"] == \"v2\"]",
          "",
          "cv_v1 = ...       # rata-rata cv_auc v1, 4 desimal",
          "train_v1 = ...    # rata-rata train_auc v1, 4 desimal",
          "cv_v2 = ...",
          "train_v2 = ...",
          "gap_v1 = ...      # train_v1 - cv_v1",
          "gap_v2 = ...",
          "bocor_v2 = ...    # True bila cv_auc == train_auc di semua baris v2",
          "",
          "print(\"v1: CV\", cv_v1, \"| train\", train_v1, \"| gap\", gap_v1)",
          "print(\"v2: CV\", cv_v2, \"| train\", train_v2, \"| gap\", gap_v2)",
          "print(\"v2 CV==train di semua family:\", bocor_v2)",
        ].join("\n"),
        lockLines: 7,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-pipeline-alpha/pipeline_batch.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "v1 = df[df[\"version\"] == \"v1\"]",
          "v2 = df[df[\"version\"] == \"v2\"]",
          "",
          "cv_v1 = round(float(v1[\"cv_auc\"].mean()), 4)",
          "train_v1 = round(float(v1[\"train_auc\"].mean()), 4)",
          "cv_v2 = round(float(v2[\"cv_auc\"].mean()), 4)",
          "train_v2 = round(float(v2[\"train_auc\"].mean()), 4)",
          "gap_v1 = round(train_v1 - cv_v1, 4)",
          "gap_v2 = round(train_v2 - cv_v2, 4)",
          "bocor_v2 = bool(((v2[\"cv_auc\"] - v2[\"train_auc\"]).abs() < 1e-9).all())",
          "",
          "print(\"v1: CV\", cv_v1, \"| train\", train_v1, \"| gap\", gap_v1)",
          "print(\"v2: CV\", cv_v2, \"| train\", train_v2, \"| gap\", gap_v2)",
          "print(\"v2 CV==train di semua family:\", bocor_v2)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t2", label: "`cv_v1` = 0,723", name: "cv_v1", value: 0.723, tol: 0.002, msg: "Rata-rata cv_auc 4 family v1." },
          { kind: "equal", task: "t2", label: "`train_v1` = 0,7755", name: "train_v1", value: 0.7755, tol: 0.002, msg: "Rata-rata train_auc 4 family v1." },
          { kind: "equal", task: "t3", label: "`gap_v1` = 0,0525", name: "gap_v1", value: 0.0525, tol: 0.002, msg: "0,7755 − 0,723 = 0,0525 — dalam rentang sehat." },
          { kind: "equal", task: "t2", label: "`cv_v2` = 0,9555", name: "cv_v2", value: 0.9555, tol: 0.002, msg: "Rata-rata cv_auc 4 family v2 — curigai kenaikannya." },
          { kind: "equal", task: "t3", label: "`gap_v2` = 0,000", name: "gap_v2", value: 0.0, msg: "Gap NOL persis — tidak ada beda hafalan vs pemahaman." },
          { kind: "equal", task: "t3", label: "`bocor_v2` = True", name: "bocor_v2", value: true, msg: "cv_auc identik dengan train_auc di semua baris v2." },
        ],
      },
    },
  ],
};

export default misiGabungPipeline;

// ── lanjutan misiGabungPipeline: langkah 7–15 ─────────────────────────────

const LANJUTAN_PIPELINE: V2Step[] = [
  {
    id: "kuis",
    eyebrow: "Langkah 7 · Kuis",
    title: "Empat pertanyaan, tanpa ampun",
    prose: [
      "Sebelum keputusan: uji pemahamanmu. Setiap opsi salah membawa penjelasan kenapa ia salah — baca semuanya, karena jebakan di kuis ini adalah jebakan yang sama yang dipasang laporan v2.",
    ],
    tasks: [],
    quiz: [
      {
        q: "Laporan v2 mengklaim CV AUC predictor naik dari 0,72 menjadi 0,96 — tanpa perubahan arsitektur model. Interpretasi paling jujur?",
        options: [
          { text: "Modelnya memang membaik drastis — angka tidak berbohong", why: "Angka tidak berbohong, tapi angka bisa dihitung dari tempat yang salah. Lonjakan 0,24 tanpa perubahan model adalah pola klasik kebocoran evaluasi, bukan keajaiban." },
          { text: "Skor CV v2 hampir pasti dihitung di data training (bocor)", correct: true, why: "Benar. Lab 2 membuktikan gap train−CV = 0,000 di semua family — skor “validasi” identik dengan skor training. Itu bukan validasi, itu hafalan." },
          { text: "Data validasinya kebetulan lebih mudah di v2", why: "Mungkin — tapi tidak menjelaskan kenapa CV AUC SAMA PERSIS dengan train AUC di 4 family independen. Kebetulan tidak serapi itu." },
          { text: "Seed acak yang berbeda menghasilkan angka berbeda", why: "Seed menggeser angka ±0,01, bukan +0,24. Besaran lonjakan ini jauh di luar jangkauan noise acak." },
        ],
      },
      {
        q: "PENALTI v2 = 0 padahal v1 = 32, sementara turnover MEAN per family nyaris tak berubah. Penjelasan paling mungkin?",
        options: [
          { text: "Semua sim v2 tiba-tiba punya turnover rendah", why: "Data berkata sebaliknya: turnover_pct_mean v2 = 0,284 — angkanya berubah SATUAN (fraksi, bukan persen), bukan berubah nilai." },
          { text: "Ambang turnover tidak pernah terpicu karena satuannya salah / ambangnya dilonggarkan", correct: true, why: "Tepat. 0,284 < 40 selalu benar — ambang persen tidak akan pernah terpicu oleh angka fraksi. PENALTI = 0 bukan prestasi, melainkan filter yang mati." },
          { text: "Tim memperbaiki semua sim bervolume tinggi sebelum v2", why: "Tidak ada catatan perbaikan seperti itu — dan tidak ada perubahan Sharpe/fitness mean yang menyertai “perbaikan” sebesar ini." },
          { text: "Turnover tidak penting untuk triase", why: "Salah arah: turnover >40% adalah penalti eksplisit di aturan triase justru karena biaya menggerogoti return." },
        ],
      },
      {
        q: "n_sims v2 = 346 (naik 31) tapi dedup_hits v2 = 0 di semua family. Artinya?",
        options: [
          { text: "Batch v2 memang menjalankan 31 sim baru yang unik", why: "Kalau unik, dedup tidak perlu menangkap apa pun — tapi mengapa dedup_hits v1 = 17 lalu tiba-tiba NOL di semua family v2? Nol merata adalah pola sistemik, bukan kebetulan." },
          { text: "Kunci dedup kehilangan satu field sehingga sim duplikat tidak tertangkap dan terhitung ganda", correct: true, why: "Benar. Kunci expression+region+decay+delay kehilangan “delay” — dua sim yang hanya beda delay kini dianggap berbeda. Duplikat lolos, n_sims membengkak." },
          { text: "Dedup dimatikan sengaja agar batch lebih cepat", why: "Mematikan dedup tidak menambah n_sims — ia hanya membiarkan duplikat lewat tanpa dicatat. Pola dedup_hits = 0 + n naik = kunci rusak, bukan dimatikan." },
          { text: "31 sim tambahan adalah hasil jitter seed 42", why: "Jitter seed 42 hanya menggeser desimal Sharpe/fitness ±0,004 — ia tidak menambah baris." },
        ],
      },
      {
        q: "Ambang triase v2 dilonggarkan tanpa catatan, dan “hasilnya” (antrean naik) terlihat lebih baik. Kenapa ini tetap masalah?",
        options: [
          { text: "Karena antrean yang lebih besar selalu lebih buruk", why: "Bukan itu masalahnya — antrean besar bisa sah-sah saja. Masalahnya adalah PERUBAHANNYA tidak tercatat dan tidak bisa direproduksi." },
          { text: "Karena ambang adalah kontrak: mengubahnya diam-diam merusak kepercayaan & reproduksibilitas pipeline", correct: true, why: "Tepat. Ambang mendefinisikan arti “layak”. Mengubahnya tanpa catatan = mengubah definisi tanpa memberi tahu siapa pun — semua keputusan historis kehilangan pembandingnya." },
          { text: "Karena kepala riset tidak suka kejutan", why: "Bukan soal selera pribadi — ini soal integritas: pipeline yang tidak bisa diaudit tidak bisa dipercaya untuk keputusan submit." },
          { text: "Tidak masalah selama tidak ada yang komplain", why: "Itu definisi “jujur selama tidak ketahuan”. Standar audit justru dirancang untuk kasus ketika tidak ada yang komplain." },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 8 · Checkpoint keputusan",
    title: "Tiga jalan, satu antrean",
    prose: [
      "Bukti di tangan: antrean 94 → 168 tanpa perbaikan kualitas (Lab 1), gap CV-train 0,0525 → 0,000 dengan CV identik train di semua family (Lab 2), dedup mati total (0 hits) sementara n_sims membengkak 31, dan turnover ditulis dalam satuan yang salah. Kepala riset menunggu keputusanmu sebelum rapat siang: pipeline mana yang boleh menyentuh antrean submit?",
      "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut. Tidak ada opsi “tunda memutuskan”: antrean submit tidak menunggu.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Pipeline mana yang kamu restui untuk antrean submit — dan apa yang kamu lakukan terhadap temuanmu?",
      options: [
        {
          id: "opt-v1",
          label: "Percaya v1, blokir v2 — kembali ke pipeline lama yang terbukti jujur",
          rationale:
            "v1 angkanya konsisten: gap CV wajar, dedup menangkap 17 duplikat, penalti bekerja (32 kandidat). v2 penuh kejanggalan; yang aman adalah kembali ke yang sudah terbukti.",
          nextStepId: "kons-v1",
          consequenceNote:
            "Antrean kembali jujur — tapi kamu tidak pernah mencari tahu SIAPA mengubah v2 dan KENAPA. Tiga minggu kemudian, “perbaikan diam-diam” muncul lagi di pipeline data lain. Kamu memadamkan api tanpa mencari sumbernya.",
        },
        {
          id: "opt-v2",
          label: "Percaya v2 — CV 0,96 dan antrean 168 adalah kemajuan, jangan halangi inovasi",
          rationale:
            "Angka v2 lebih baik di semua metrik headline. Menolak kemajuan karena “kecurigaan” adalah cara tim menjadi stagnan.",
          nextStepId: "kons-v2",
          consequenceNote:
            "Kamu merestui pipeline bocor. Alpha hasil v2 masuk antrean submit: turnover tak tersaring (satuan salah), duplikat terhitung ganda (dedup rusak), predictor menyanjung semua kandidat (CV = train). Dua slot submit hangus untuk alpha sampah — dan tim review bertanya kenapa antrean “yang lebih baik” menghasilkan submit yang lebih buruk.",
        },
        {
          id: "opt-audit",
          label: "Bekukan keduanya, audit penuh — tidak ada submit dari pipeline mana pun sampai 4 kejanggalan dijelaskan",
          rationale:
            "v1 terlihat jujur tapi belum kamu verifikasi independen; v2 jelas bermasalah. Satu-satunya keputusan yang bisa dipertahankan di depan kepala riset: hentikan, audit, tulis ulang dengan changelog.",
          nextStepId: "kons-audit",
          consequenceNote:
            "Audit menemukan 4 sabotase v2 (ambang, CV bocor, dedup, satuan turnover) — dan memverifikasi v1 memang bersih. Pipeline ditulis ulang dengan changelog wajib + unit test satuan. Sejak itu setiap “perbaikan diam-diam” otomatis ditolak CI. Keputusanmu mahal di awal (dua minggu tanpa submit baru), murah selamanya.",
        },
      ],
    },
  },
  {
    id: "kons-v1",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: percaya v1, blokir v2",
    prose: [
      "Memo terkirim: v2 diblokir, tim kembali ke v1. Antrean kembali jujur — 94 kandidat, penalti bekerja, dedup menangkap duplikat. Danu meminta maaf (“aku cuma mau pipeline lebih cepat”) dan semua orang melanjutkan hidup.",
      "Tiga minggu kemudian, “perbaikan diam-diam” muncul lagi — kali ini di pipeline normalisasi data, oleh orang yang berbeda, dengan alasan yang sama: “hasilnya lebih baik”. Kamu sadar: memblokir v2 memadamkan SATU api, tapi tidak memasang alarm kebakaran. Tanpa audit yang menuliskan APA yang salah dan BAGAIMANA mencegahnya, pola yang sama akan terulang dengan nama file yang berbeda.",
    ],
    tasks: [],
    note: {
      title: "Keputusan aman belum tentu keputusan benar",
      body: "Kembali ke v1 adalah respons yang bisa dipertahankan — tapi ia menjawab pertanyaan yang salah (“pipeline mana yang dipakai?”) dan melewatkan pertanyaan yang benar (“bagaimana memastikan ini tidak terulang?”). Audit bukan kemewahan; ia adalah satu-satunya cara mengubah insiden menjadi sistem.",
    },
  },
  {
    id: "kons-v2",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: percaya v2",
    prose: [
      "Memo terkirim: v2 direstui. Dua minggu pertama terlihat seperti kemenangan — antrean penuh (168!), predictor “akurat” (CV 0,96!), tidak ada penalti sama sekali. Danu dipuji di town hall.",
      "Minggu ketiga, tim review manual mulai bertanya: kenapa kandidat “ANTRIAN” v2 banyak yang turnover-nya brutal saat diuji independen? Kenapa dua alpha yang disubmit ternyata duplikat dan kena penalti platform? Jawabannya ada di lab yang sudah kamu kerjakan: turnover tak tersaring karena satuannya salah, duplikat terhitung ganda karena kunci dedup rusak, dan predictor menyanjung semua kandidat karena skornya dihitung di data training. Dua slot submit hangus. Dan satu pertanyaan yang tidak bisa dijawab dengan angka: siapa yang akan percaya pada pipeline tim ini lagi?",
    ],
    tasks: [],
    note: {
      title: "Metrik headline adalah umpan",
      body: "CV 0,96 dan 168 antrean adalah angka yang dirancang untuk dipuji di town hall — bukan angka yang dirancang untuk benar. Pelajaran termahal misi ini: semakin bagus angka yang tidak bisa dijelaskan, semakin keras kamu harus mengauditnya.",
    },
  },
  {
    id: "kons-audit",
    goto: "audit",
    eyebrow: "Langkah 9 · Konsekuensi",
    title: "Diputuskan: bekukan & audit penuh",
    prose: [
      "Memo terkirim: kedua pipeline dibekukan, tidak ada submit sampai audit selesai. Dua minggu tanpa submit baru — tim gelisah, Danu defensif. Tapi audit bekerja seperti yang seharusnya: setiap kejanggalan dilacak ke penyebabnya, setiap penyebab diubah menjadi aturan pencegahan.",
      "Hasilnya: 4 sabotase v2 terkonfirmasi (kamu akan membedahnya di langkah berikut), v1 terverifikasi bersih dan menjadi baseline resmi. Pipeline ditulis ulang dengan tiga penjaga baru: changelog wajib untuk setiap perubahan ambang, unit test satuan untuk setiap kolom numerik, dan CI yang menolak “perbaikan diam-diam”. Dua minggu yang mahal di awal — dan tidak pernah terulang lagi.",
    ],
    tasks: [],
    note: {
      title: "Audit mengubah insiden menjadi sistem",
      body: "Perbedaan antara keputusan ini dan dua opsi lainnya: ia tidak hanya memilih pipeline — ia memperbaiki PROSES yang menghasilkan pipeline. Itulah mengapa deliverable misi ini bukan “laporan v2 buruk”, melainkan checklist audit yang bisa dipakai untuk pipeline apa pun.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 10 · Misi audit",
    title: "Dossier 8 baris: empat sabotase, satu laporan",
    prose: [
      "Satu misi audit sebelum deliverable. Di bawah ini 8 baris “Laporan Pipeline v2 — ringkasan perbaikan”, dokumen yang menyertai slide Danu. Klaimnya: ambang “disesuaikan”, CV naik karena “model lebih baik”, dedup “disederhanakan”, turnover “dinormalisasi”. Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil kedua lab-mu.",
      "Cara kerja: untuk setiap baris v2, bandingkan dengan baris v1 family yang SAMA, lalu cocokkan dengan pola yang kamu temukan di lab.",
    ],
    tasks: [],
    auditDossier: {
      version: "pipeline-m2c-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai ringkasan “perbaikan” pipeline v2 (ambang disesuaikan, CV naik, dedup disederhanakan, turnover dinormalisasi). Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini.",
      columns: ["Versi", "Family", "n_sims", "Sharpe", "Fitness", "Turnover (%)", "Dedup", "ANTRIAN", "PENALTI", "CV AUC", "Train AUC", "Klaim"],
      rows: [
        { rowId: 1, cells: { "Versi": "v1", "Family": "rv-1d", "n_sims": "120", "Sharpe": "1,52", "Fitness": "1,12", "Turnover (%)": "28,3%", "Dedup": "7", "ANTRIAN": "42", "PENALTI": "9", "CV AUC": "0,740", "Train AUC": "0,792", "Klaim": "Baseline jujur" }, claims: [{ label: "Klaim", value: "Terverifikasi di lab" }] },
        { rowId: 2, cells: { "Versi": "v1", "Family": "mom-5d", "n_sims": "90", "Sharpe": "1,31", "Fitness": "1,05", "Turnover (%)": "33,2%", "Dedup": "5", "ANTRIAN": "20", "PENALTI": "11", "CV AUC": "0,708", "Train AUC": "0,771", "Klaim": "Baseline jujur" }, claims: [{ label: "Klaim", value: "Terverifikasi di lab" }] },
        { rowId: 3, cells: { "Versi": "v1", "Family": "vb-or", "n_sims": "60", "Sharpe": "1,64", "Fitness": "1,18", "Turnover (%)": "24,6%", "Dedup": "3", "ANTRIAN": "26", "PENALTI": "4", "CV AUC": "0,763", "Train AUC": "0,801", "Klaim": "Baseline jujur" }, claims: [{ label: "Klaim", value: "Terverifikasi di lab" }] },
        { rowId: 4, cells: { "Versi": "v1", "Family": "sqz-x", "n_sims": "45", "Sharpe": "1,18", "Fitness": "0,97", "Turnover (%)": "37,2%", "Dedup": "2", "ANTRIAN": "6", "PENALTI": "8", "CV AUC": "0,681", "Train AUC": "0,738", "Klaim": "Baseline jujur" }, claims: [{ label: "Klaim", value: "Terverifikasi di lab" }] },
        // ── I1: ambang triase diubah tanpa catatan ──
        { rowId: 5, cells: { "Versi": "v2", "Family": "rv-1d", "n_sims": "132", "Sharpe": "1,52", "Fitness": "1,12", "Turnover (%)": "0,284%", "Dedup": "0", "ANTRIAN": "68", "PENALTI": "0", "CV AUC": "0,961", "Train AUC": "0,961", "Klaim": "Ambang “disesuaikan”, CV naik" }, claims: [{ label: "Klaim", value: "Perbaikan — belum diverifikasi" }] },
        // ── I2: predictor dievaluasi di data training ──
        { rowId: 6, cells: { "Versi": "v2", "Family": "mom-5d", "n_sims": "99", "Sharpe": "1,31", "Fitness": "1,05", "Turnover (%)": "0,331%", "Dedup": "0", "ANTRIAN": "44", "PENALTI": "0", "CV AUC": "0,952", "Train AUC": "0,952", "Klaim": "Ambang “disesuaikan”, CV naik" }, claims: [{ label: "Klaim", value: "Perbaikan — belum diverifikasi" }] },
        // ── I3: kunci dedup kehilangan satu field ──
        { rowId: 7, cells: { "Versi": "v2", "Family": "vb-or", "n_sims": "66", "Sharpe": "1,64", "Fitness": "1,18", "Turnover (%)": "0,246%", "Dedup": "0", "ANTRIAN": "38", "PENALTI": "0", "CV AUC": "0,968", "Train AUC": "0,968", "Klaim": "Ambang “disesuaikan”, CV naik" }, claims: [{ label: "Klaim", value: "Perbaikan — belum diverifikasi" }] },
        // ── I4: turnover satuan salah ──
        { rowId: 8, cells: { "Versi": "v2", "Family": "sqz-x", "n_sims": "49", "Sharpe": "1,18", "Fitness": "0,97", "Turnover (%)": "0,372%", "Dedup": "0", "ANTRIAN": "18", "PENALTI": "0", "CV AUC": "0,941", "Train AUC": "0,941", "Klaim": "Ambang “disesuaikan”, CV naik" }, claims: [{ label: "Klaim", value: "Perbaikan — belum diverifikasi" }] },
      ],
      injections: [
        { key: "ambang-triase-diubah", rowIds: [5, 6, 7, 8], title: "Ambang triase diubah tanpa catatan", clue: "Total ANTRIAN v2 = 168 vs v1 = 94; PENALTI v2 = 0 vs 32 — sementara Sharpe/Fitness MEAN per family nyaris identik. Kenaikan merata di semua family + tidak ada changelog = ambang dilonggarkan diam-diam, bukan kandidat yang membaik.", danger: "Ambang adalah definisi “layak”. Mengubahnya tanpa catatan membuat semua keputusan historis (BUANG/TAHAN/ANTRIAN) kehilangan pembanding — antrean terisi kandidat yang seharusnya kena penalti." },
        { key: "predictor-di-training", rowIds: [5, 6, 7, 8], title: "Predictor dievaluasi di data training", clue: "CV AUC == Train AUC persis (0,961/0,952/0,968/0,941) di 4/4 family v2 — gap 0,000. Secara statistik mustahil untuk 4 family independen, kecuali skor “validasi” dihitung dari data yang sama dengan training.", danger: "Predictor yang “sempurna” di kertas tapi buta di data baru akan menyanjung semua kandidat — antrean penuh, kualitas kosong, slot submit hangus sia-sia." },
        { key: "dedup-kehilangan-field", rowIds: [5, 6, 7, 8], title: "Kunci dedup batch kehilangan satu field", clue: "Dedup v2 = 0 di SEMUA family (v1 total 17) sementara n_sims naik 315 → 346. Kunci dedup expression+region+decay+delay kehilangan “delay” — sim yang hanya beda delay kini dianggap unik dan terhitung dua kali.", danger: "Duplikat yang terhitung ganda menggandakan bobot satu sinyal di antrean — dan kalau lolos ke submit, penalti self-correlation menanti di ujungnya." },
        { key: "turnover-satuan-salah", rowIds: [5, 6, 7, 8], title: "Turnover dihitung dengan satuan yang salah", clue: "Kolom “Turnover (%)” v2 berisi 0,284 / 0,331 / 0,246 / 0,372 — itu FRAKSI, bukan persen. Ambang 40% tidak akan pernah terpicu oleh angka <1: inilah kenapa PENALTI v2 = 0.", danger: "Filter yang tidak pernah terpicu = filter yang mati. Turnover tinggi lolos ke antrean, biaya menggerogoti return, dan tidak ada yang sadar karena “jumlah pelanggarannya nol”." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 11 · Deliverable",
    title: "Checklist audit pipeline",
    prose: [
      "Semua bukti di tangan: perbandingan v1 vs v2 dari kedua lab, keputusanmu di Langkah 8, dan 4 sabotase dari audit. Tulis deliverable — artefak portofoliomu. Checklist yang baik bukan daftar generik “pastikan data bersih”, melainkan daftar yang lahir dari luka: tiap item mencegah satu kelas sabotase yang benar-benar kamu temukan di misi ini.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif: apakah v2 boleh dipakai untuk submit? (ya/tidak + 2 kalimat alasan yang merujuk ke angka lab).",
        "Tabel perbandingan v1 vs v2: ANTRIAN, PENALTI, n_sims, gap CV-train, dedup_hits — dengan angka dari lab-mu, bukan dari ingatan.",
        "Empat temuan audit: tiap sabotase + bukti angka + baris dossier yang terdampak + kenapa ia berbahaya.",
        "Checklist “pipeline jujur” versimu: minimal 6 item — tiap item harus mencegah satu kelas sabotase yang kamu temukan (changelog ambang, unit test satuan, kunci dedup, evaluasi CV terpisah, seed tercatat, reproduksibilitas).",
        "Batas & risiko sisa: apa yang TIDAK dicakup audit ini (data SINTETIS; ambang disederhanakan; audit pipeline ≠ review kualitas sinyal).",
      ],
      rubric: [
        { criterion: "Kebenaran angka perbandingan", weight: 30, levels: ["Angka salah / tidak konsisten antar bagian", "Sebagian angka benar", "Semua angka v1 vs v2 tepat: ANTRIAN 94→168, PENALTI 32→0, gap 0,0525→0,000, dedup 17→0"] },
        { criterion: "Kelengkapan temuan sabotase", weight: 25, levels: ["<2 sabotase teridentifikasi", "2–3 sabotase tanpa bukti baris", "Keempat sabotase disebut dengan bukti angka + baris dossier"] },
        { criterion: "Kualitas checklist “pipeline jujur”", weight: 25, levels: ["Checklist generik tanpa kaitan ke temuan", "Checklist parsial (<6 item atau tak terkait temuan)", "Checklist ≥6 item; tiap item mencegah satu kelas sabotase yang ditemukan"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim audit = jaminan pipeline sempurna", "Menyebut sebagian batas", "Batas (data SINTETIS; ambang disederhanakan; audit ≠ review kualitas sinyal) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 12 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan pipeline v2:",
      "1) **Ambang triase diubah tanpa catatan** (baris 5–8): ANTRIAN 94 → 168, PENALTI 32 → 0, sementara Sharpe/fitness MEAN per family nyaris identik. Kenaikan merata + tanpa changelog = ambang dilonggarkan diam-diam. Kamu menemukannya di Lab 1.",
      "2) **Predictor dievaluasi di data training** (baris 5–8): CV AUC == Train AUC persis di 4/4 family (0,961/0,952/0,968/0,941), gap 0,000. Mustahil secara statistik tanpa kebocoran. Kamu menemukannya di Lab 2.",
      "3) **Kunci dedup kehilangan satu field** (baris 5–8): dedup 17 → 0 di semua family, n_sims 315 → 346. Kunci expression+region+decay+delay kehilangan “delay” — duplikat terhitung ganda.",
      "4) **Turnover satuan salah** (baris 5–8): kolom “Turnover (%)” berisi fraksi (0,284 dst). Ambang 40% tak pernah terpicu — inilah kenapa PENALTI = 0.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data, atau memercayai slide yang bertuliskan “diperbaiki”.",
      "Bahaya nyata terakhir — dan ini inti misi capstone: pipeline yang tidak jujur tidak menghasilkan alpha yang buruk secara terang-terangan; ia menghasilkan alpha yang buruk DENGAN DOKUMENTASI YANG TERLIHAT BAIK. Submit dari pipeline seperti ini bukan sekadar membuang slot harian — ia mengajari tim untuk percaya pada angka yang salah. Sekali kepercayaan itu terbentuk, setiap “perbaikan diam-diam” berikutnya lolos tanpa perlawanan. Antrean yang tidak jujur lebih berbahaya daripada antrean yang kosong.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4: audit sekali = aman selamanya",
      type: "pitfall",
      body: "“Kan sudah diaudit — pipeline sekarang aman.” Audit adalah FOTO, bukan VAKSIN. Pipeline berubah setiap sprint; tanpa penjaga berkelanjutan (changelog wajib, unit test, CI yang menolak perubahan diam-diam), sabotase berikutnya hanya soal waktu. Deliverable-mu — checklist itu — adalah vaksinasinya.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 13 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Pipeline riset = predictor ML + batch simulasi (kunci dedup) + triase self-corr; satu tahap yang berbohong mencemari seluruh antrean submit.",
      "Lensa riset alpha: ambang triase adalah KONTRAK (τ_S=1,4, τ_F=1,1, τ_TO=40%) — mengubahnya tanpa catatan = menulis ulang definisi “layak”. Sidik jarinya: ANTRIAN naik merata (94→168) tanpa perbaikan kualitas.",
      "Lensa ML engineering: gap = AUC_train − AUC_CV; gap sehat 0,03–0,08, gap 0,000 di 4 family = evaluasi bocor ke data training.",
      "Empat pola sabotase pipeline: ambang diubah diam-diam, predictor dievaluasi di training, kunci dedup kehilangan field (duplikat terhitung ganda), turnover salah satuan (filter mati).",
      "Data: 8 baris agregat SINTETIS (seed 42), BUKAN data asli, TANPA ekspresi alpha mentah; ambang & aturan disederhanakan — file METODE.md. Keputusan audit yang benar: bekukan, buktikan, jadikan sistem.",
    ],
  },
];

(misiGabungPipeline.steps as V2Step[]).push(...LANJUTAN_PIPELINE);
