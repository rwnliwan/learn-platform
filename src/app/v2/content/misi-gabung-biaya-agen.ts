import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Tagihan: Agen yang Berpikir Terlalu Lama ─────────────────────────
// Misi CAPSTONE kombinasi: Agentic AI × LLMOps.
// Sudut kombinasi: observabilitas & biaya agen multi-langkah di produksi.
// Dataset SINTETIS: 60 tiket fiksi, 552 langkah (seed 42) — BUKAN data asli.
// File: public/misi/misi-gabung-biaya-agen/trace_tiket.csv + harga_model.csv.
// Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-gabung-biaya-agen";

// Dekomposisi biaya hasil Lab 2 (angka aktual seed 42):
// komposisi biaya: retry 40,8% vs non-retry 59,2%;
// komposisi token input: bloat 70,9% vs base 29,1%.
const BIAYA_SVG = `<svg viewBox="0 0 480 232" role="img" aria-label="Dua pasang batang: komposisi biaya (retry 40,8 persen vs non-retry 59,2 persen) dan komposisi token input (bloat 70,9 persen vs base 29,1 persen).">
<g font-family="var(--font-ui)" font-size="12" fill="var(--text)">
<text x="24" y="28">Komposisi biaya (dari total $252,00)</text>
<rect x="24" y="40" width="360" height="24" rx="4" fill="var(--chart-grid)" opacity="0.35"/>
<rect x="24" y="40" width="147" height="24" rx="4" fill="var(--c1)"/>
<text x="24" y="84">retry 40,8% — dibayar, hasilnya dibuang</text>
<text x="384" y="84" text-anchor="end" fill="var(--text-muted)">non-retry 59,2%</text>
<text x="24" y="122">Komposisi token input</text>
<rect x="24" y="134" width="360" height="24" rx="4" fill="var(--chart-grid)" opacity="0.35"/>
<rect x="24" y="134" width="255" height="24" rx="4" fill="var(--c2)"/>
<text x="24" y="178">bloat 70,9% — histori ditempel ulang tiap langkah</text>
<text x="384" y="178" text-anchor="end" fill="var(--text-muted)">base 29,1%</text>
<text x="24" y="210" font-size="11" fill="var(--text-muted)">Data SINTETIS (seed 42) — pola nyata: retry loop, context bloat.</text>
</g>
</svg>`;

export const misiGabungBiayaAgen: V2Mission = {
  slug: "misi-gabung-biaya-agen",
  track: "Agentic AI",
  module: "Misi",
  title: "Misi Tagihan: Agen yang Berpikir Terlalu Lama",
  estMinutes: 180,
  role: "Agentic AI engineer",
  client:
    "CFO — agen support menyelesaikan tiket tapi biaya $4,20/tiket vs target $0,30; 40% biaya dari retry yang gagal",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tagihan $252 untuk 60 tiket",
      prose: [],
      tasks: [],
      briefing: {
        role: "Agentic AI engineer — pemilik observabilitas dan biaya agen support di produksi",
        client:
          "CFO. Agen support AI menyelesaikan tiket pelanggan dengan baik — tapi tagihannya $4,20 per tiket, 14× lipat dari target $0,30. Laporan keuangan mengklaim semua target tercapai. Hitung ulang dari jejak mentah, bedah dari mana $4,20 itu berasal, putuskan satu intervensi, lalu audit laporan keuangannya. Kalau laporannya bohong, tidak ada yang tahu tagihan berikutnya meledak.",
        story: [
          "Senin, 07:58. Email dari CFO, subjeknya satu baris: “Tagihan LLM naik 14× lipat — jelaskan sebelum rapat direksi Kamis.” Agen support AI yang kamu luncurkan tiga bulan lalu bekerja persis seperti demo: tiket pelanggan terjawab, CSAT naik, tim support lega. Tapi dasbor keuangan menunjukkan angka yang tidak masuk akal: $4,20 per tiket, padahal target yang disepakati $0,30.",
          "Yang membuat keningmu berkerut: laporan keuangan triwulan mengklaim SEMUA target tercapai — rata-rata $0,30 per tiket, TERCAPAI. Dua dokumen, dua realitas. Entah laporan itu memakai matematika yang kreatif, atau jejak mentah agenmu menyembunyikan sesuatu.",
          "Kamu meminta akses ke jejak mentah (trace) 60 tiket terakhir: setiap langkah agen, token per langkah, tool call, dan penanda retry. Misi ini: hitung ulang biayanya sendiri dari trace, bedah komponen $4,20 itu, putuskan intervensi yang kamu dorong ke CFO, lalu audit laporan “semua target tercapai” — karena keputusan budget di atas laporan yang bohong sama berbahayanya dengan tidak punya laporan sama sekali.",
        ],
        objectives: [
          "Menghitung ulang biaya per tiket dari jejak mentah (trace) dan mengukur selisihnya terhadap klaim laporan keuangan ($0,30).",
          "Mendekomposisi $4,20/tiket menjadi porsi retry, token input/output, dan context bloat — dengan angka, bukan tebakan.",
          "Memilih satu intervensi biaya (guardrail / optimasi prompt+cache / downgrade model) dengan konsekuensi yang tercatat.",
          "Menemukan 4 sabotase di laporan efisiensi dan menulis spesifikasi dashboard observabilitas biaya + kebijakan budget per tiket.",
        ],
        prereqSummary:
          "Model LLM menagih per token: setiap request membayar token input (prompt + konteks yang ditempel) dan token output (jawaban), dengan tarif berbeda per tier model — tier flagship bisa 50× lebih mahal dari tier murah. Observability untuk agen berarti merekam jejak tiap langkah: berapa token dipakai, tool apa dipanggil, dan apakah langkah itu retry yang gagal. Tanpa jejak ini, biaya agen tidak bisa diatribusikan ke tiket — dan tagihan hanya terlihat sebagai satu angka misterius di akhir bulan.",
        datasetNote:
          "Data 100% SINTETIS: 60 tiket fiksi hasil generator acak (seed 42) — BUKAN data produksi, BUKAN tagihan LLM asli, TANPA data pelanggan.\nFile: trace_tiket.csv — kolom tiket_id, langkah_ke, model (pro/flash/nano), input_tokens, output_tokens, tool_calls, retry (1 = langkah retry yang gagal), cache_hit (selalu 0 — disengaja, lihat langkah audit).\nFile: harga_model.csv — tarif USD per 1K token per tier.\nMetode, kalibrasi, dan batas jujur: file METODE.md di folder yang sama. Target $0,30 dan laporan keuangan di misi ini adalah fiksi latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Ruang data: 552 langkah, 60 tiket",
      prose: [
        "Dua file adalah satu-satunya sumber kebenaran di misi ini. `trace_tiket.csv`: 552 baris — tiap baris satu langkah agen dalam menyelesaikan satu tiket. Kolomnya: `tiket_id` (60 tiket unik, TKT-001 s.d. TKT-060), `langkah_ke` (urutan langkah dalam tiket), `model` (tier yang dipakai langkah itu: pro/flash/nano), `input_tokens` & `output_tokens`, `tool_calls` (berapa tool dipanggil langkah itu), `retry` (1 berarti langkah ini adalah retry yang gagal — biayanya tetap jalan, hasilnya dibuang), dan `cache_hit` (apakah langkah ini terlayani dari cache).",
        "Satu hal yang langsung patut dicatat: kolom `cache_hit` berisi 0 di SEMUA 552 baris. Entah cache-nya mati, atau sesuatu membuatnya tidak pernah hit — simpan observasi ini untuk langkah audit.",
        "`harga_model.csv` hanya 3 baris: tarif USD per 1K token untuk tiap tier. Tier pro mengenakan 0,005 per 1K input dan 0,025 per 1K output — 50× dan 62,5× lipat dari tier nano. Perbedaan tarif sebesar ini berarti salah memilih tier di satu langkah bisa lebih mahal daripada seluruh tiket yang memakai tier murah.",
        "Data ini SINTETIS (seed 42) — dinyatakan eksplisit supaya tidak ada yang mengira ini bocoran tagihan asli. Justru karena sintetis, polanya dibuat menyerupai pola nyata: retry loop, context bloat, dan salah atribusi tier — tiga pola yang paling sering membuat tagihan agen meledak di produksi.",
      ],
      tasks: [
        { id: "t1", text: "Buka `trace_tiket.csv`: catat jumlah baris dan nama kolomnya" },
        { id: "t2", text: "Hitung tiket unik (`tiket_id`) dan jumlah baris dengan `retry=1` — catat keduanya" },
      ],
      note: {
        title: "Miskonsepsi #1: laporan keuangan = tagihan mentah",
        type: "pitfall",
        body: "“Laporan keuangan bilang $0,30/tiket — berarti tagihannya memang segitu.” Belum tentu. Angka $0,30 adalah HASIL dari serangkaian keputusan atribusi: tarif tier mana yang dipakai, apakah langkah retry dihitung sebagai tiket tersendiri, apakah context bloat ikut dihitung. Ubah atribusinya, berubah angkanya — tanpa satu dolar pun berubah di tagihan asli. Jejak mentah tidak bisa dibohongi; laporan bisa.",
      },
      reference:
        "trace_tiket.csv (552 baris SINTETIS, seed 42) + harga_model.csv (3 tier) — satu-satunya sumber kebenaran; biaya DIHITUNG, bukan dibaca. METODE.md berisi kalibrasi & batas.",
    },
    {
      id: "teori-agen",
      eyebrow: "Langkah 3 · Teori — lensa desain agen",
      title: "Lensa 1: kenapa agen multi-langkah mahal",
      prose: [
        "Lihat agen dari sisi DESAIN: agen support ini bekerja dalam loop — membaca tiket, berpikir, memanggil tool (cek order, cek saldo, cari artikel bantuan), membaca hasil tool, berpikir lagi, menjawab. Setiap putaran loop adalah satu “langkah”, dan setiap langkah adalah satu request ke model LLM yang ditagih per token.",
        "Tiga pola desain yang membuat tagihan membengkak. Pertama, **retry loop**: saat tool call gagal atau jawaban tidak lolos validasi, agen mengulang langkah itu. Langkah yang gagal TETAP ditagih penuh — tokennya sudah dikirim, inferensinya sudah jalan. Di data ini 45 dari 60 tiket punya retry: 145 langkah yang hasilnya dibuang tapi tagihannya tidak.",
        "Kedua, **context bloat**: prompt tiap langkah menempel SELURUH histori percakapan — semua langkah sebelumnya, semua hasil tool. Akibatnya token input tumbuh linear: rata-rata langkah ke-1 memakai ±37,6k token, langkah ke-13 memakai ±273,8k token — 7,3× lipat untuk “konteks” yang sebagian besar sudah tidak relevan.",
        "Ketiga, **tier buta**: 33 dari 60 tiket berjalan di tier pro untuk SEMUA langkahnya — termasuk langkah sepele seperti “ringkas hasil tool” yang tier murah pun bisa. Tarif pro 50× nano untuk input: satu langkah ceroboh di tier pro bisa lebih mahal dari seluruh tiket hemat.",
        "Rumus biaya satu tiket — satu-satunya rumus yang penting di misi ini:",
      ],
      tasks: [
        { id: "t1", text: "Hitung manual: biaya TKT-025 langkah 12 dari angka di catatan rumus — cocokkan ≈ $1,73" },
      ],
      formula: String.raw`\text{biaya tiket} = \sum_{\text{langkah}} \left( \frac{tok_{in}}{1000}\cdot p_{in} + \frac{tok_{out}}{1000}\cdot p_{out} \right)`,
      formulaNote:
        "tok_in / tok_out = token input & output pada langkah itu (dari trace_tiket.csv). p_in / p_out = tarif USD per 1K token untuk tier model langkah itu (dari harga_model.csv). Tanda Σ berarti jumlahkan ke SEMUA langkah dalam tiket — termasuk langkah retry yang gagal. Interpretasi: angka ini = dolar yang dibakar SATU tiket. Contoh konkret — TKT-025 langkah ke-12 (tier pro): 308.829 token input, 7.390 token output → 308,829 × 0,005 + 7,39 × 0,025 ≈ 1,544 + 0,185 ≈ $1,73. SATU langkah — hampir 6× lipat target SELURUH tiket ($0,30).",
      note: {
        title: "Miskonsepsi #2: model mahal adalah masalah utama",
        type: "pitfall",
        body: "“Ganti semua ke tier murah, selesai.” Tarif pro memang 50× nano — tapi 40% biaya di data ini datang dari retry yang gagal, dan 71% token input adalah bloat histori. Downgrade model tanpa mematikan retry loop dan merampingkan prompt = mengobati gejala sementara penyakitnya jalan terus. Urutan yang benar: ukur dulu (Lab 2), baru putuskan intervensi (Langkah 7).",
      },
    },
    {
      id: "teori-operasi",
      eyebrow: "Langkah 4 · Teori — lensa operasi & biaya",
      title: "Lensa 2: observability dan unit economics",
      prose: [
        "Sekarang lihat dari sisi OPERASI. Observability untuk agen bukan sekadar log teks — melainkan **trace terstruktur**: setiap langkah tercatat sebagai span dengan atribut (tiket_id, model, token, retry ya/tidak, cache hit ya/tidak) sehingga bisa diagregat. Log berkata “agen menjawab tiket”; trace berkata “tiket TKT-025 membakar $13,45 dalam 13 langkah, 4 di antaranya retry”.",
        "Dengan trace, biaya menjadi **unit economics**: $/tiket — angka yang bisa dibandingkan dengan nilai ekonomi satu tiket. Tanpa unit economics, tagihan LLM hanya satu angka agregat di akhir bulan: naik, tapi tidak ada yang tahu kenapa, dan tidak ada yang merasa memilikinya.",
        "Mini-case — TKT-025, tiket termahal di data ini ($13,45; 13 langkah; 4 retry; tier pro). Bedahnya: langkah 1–9 menyelesaikan tiket, lalu langkah 10–13 adalah retry loop yang gagal empat kali berturut-turut sebelum agen menyerah dan eskalasi ke manusia. Sebagian besar biaya tiket ini dibayar untuk KEGAGALAN — dan eskalasinya tetap terjadi. Retry tanpa batas percobaan + tanpa kill switch = donasi ke provider LLM.",
        "Dari lensa operasi, tiga pertanyaan harus bisa dijawab dasbor setiap saat: (1) berapa $/tiket hari ini vs target, (2) tiket mana yang membakar >3× median (outlier), (3) berapa porsi biaya dari retry — karena retry adalah satu-satunya komponen biaya yang 100% sia-sia.",
      ],
      tasks: [
        { id: "t1", text: "Dari trace_tiket.csv: tebak tiket termahal & jumlah langkahnya — buktikan di Lab 2" },
      ],
      note: {
        title: "Ukur per tiket, bukan per bulan",
        body: "Tagihan bulanan $252 terlihat “kecil” dan tidak memicu tindakan. $4,20 per tiket vs target $0,30 — 14× lipat — memicu rapat direksi. Granularitas yang sama, urgensi yang berbeda. Inilah kenapa unit economics ($/tiket) adalah metrik operasi, sedangkan tagihan bulanan hanyalah angka akuntansi.",
      },
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 5 · Lab 1 — Hitung ulang dari jejak mentah",
      title: "Lab 1: $0,30 atau $4,20 — buktikan dari trace",
      prose: [
        "Waktunya berhenti percaya dan mulai menghitung. Tugas lab ini: gabungkan `trace_tiket.csv` dengan `harga_model.csv`, hitung biaya tiap baris dengan rumus Langkah 3, agregatkan per tiket, lalu bandingkan dengan klaim laporan keuangan ($0,30/tiket).",
        "Perhatikan: kolom `model` berbeda per baris — tarif yang dipakai harus tarif tier baris itu, bukan satu tarif untuk semua. Di sinilah laporan “kreatif” biasanya bermain: memakai tarif tier termurah untuk semua baris.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; buat dict tarif `p_in` / `p_out` per model" },
        { id: "t2", text: "Hitung kolom `biaya` per baris, lalu `n_tiket`, `biaya_total`, `biaya_per_tiket`" },
        { id: "t3", text: "Hitung `rasio_vs_laporan` = biaya_per_tiket / 0,30" },
      ],
      expected:
        "60 tiket · total $252,00 → $4,20/tiket — 14,0× lipat klaim laporan ($0,30). Jejak mentah tidak berbohong: laporannya yang perlu diaudit.",
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))`.",
        "Dict tarif: `dict(zip(harga[\"model\"], harga[\"usd_per_1k_input\"]))` — lalu `trace[\"model\"].map(p_in)`.",
        "Biaya per baris: `input_tokens/1000 * tarif_in + output_tokens/1000 * tarif_out` — vektorisasi penuh, tanpa loop.",
        "Tiket unik: `trace[\"tiket_id\"].nunique()` — JANGAN hitung baris.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "TRACE = \"/misi/misi-gabung-biaya-agen/trace_tiket.csv\"",
          "HARGA = \"/misi/misi-gabung-biaya-agen/harga_model.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "trace = pd.read_csv(open_url(TRACE))",
          "harga = pd.read_csv(open_url(HARGA))",
          "",
          "p_in = ...     # dict: model -> tarif input per 1K token",
          "p_out = ...    # dict: model -> tarif output per 1K token",
          "",
          "trace[\"biaya\"] = ...",
          "n_tiket = ...",
          "biaya_total = ...",
          "biaya_per_tiket = ...",
          "rasio_vs_laporan = ...   # biaya_per_tiket dibagi klaim laporan ($0,30)",
          "",
          "print(\"tiket:\", n_tiket)",
          "print(\"total: $%.2f\" % biaya_total)",
          "print(\"per tiket: $%.2f\" % biaya_per_tiket)",
          "print(\"rasio vs laporan: %.1fx\" % rasio_vs_laporan)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "TRACE = \"/misi/misi-gabung-biaya-agen/trace_tiket.csv\"",
          "HARGA = \"/misi/misi-gabung-biaya-agen/harga_model.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "trace = pd.read_csv(open_url(TRACE))",
          "harga = pd.read_csv(open_url(HARGA))",
          "",
          "p_in = dict(zip(harga[\"model\"], harga[\"usd_per_1k_input\"]))",
          "p_out = dict(zip(harga[\"model\"], harga[\"usd_per_1k_output\"]))",
          "",
          "trace[\"biaya\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in) + trace[\"output_tokens\"]/1000*trace[\"model\"].map(p_out)",
          "n_tiket = int(trace[\"tiket_id\"].nunique())",
          "biaya_total = float(trace[\"biaya\"].sum())",
          "biaya_per_tiket = biaya_total / n_tiket",
          "rasio_vs_laporan = biaya_per_tiket / 0.30",
          "",
          "print(\"tiket:\", n_tiket)",
          "print(\"total: $%.2f\" % biaya_total)",
          "print(\"per tiket: $%.2f\" % biaya_per_tiket)",
          "print(\"rasio vs laporan: %.1fx\" % rasio_vs_laporan)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`trace` termuat", name: "trace", msg: "trace harus berisi DataFrame dari trace_tiket.csv." },
          { kind: "equal", task: "t2", label: "`n_tiket` = 60", name: "n_tiket", value: 60, msg: "Ada 60 tiket unik — hitung tiket_id unik, bukan baris." },
          { kind: "equal", task: "t2", label: "`biaya_total` = 252,00", name: "biaya_total", value: 252.0, tol: 0.05, msg: "Jumlahkan kolom biaya semua 552 baris." },
          { kind: "equal", task: "t2", label: "`biaya_per_tiket` = 4,20", name: "biaya_per_tiket", value: 4.2, tol: 0.01, msg: "252,00 / 60 = 4,20." },
          { kind: "equal", task: "t3", label: "`rasio_vs_laporan` = 14,0", name: "rasio_vs_laporan", value: 14.0, tol: 0.1, msg: "4,20 / 0,30 = 14,0× — sebesar ini selisihnya." },
        ],
      },
    },
    {
      id: "lab-dekomposisi",
      eyebrow: "Langkah 6 · Lab 2 — Bedah $4,20",
      title: "Lab 2: token vs retry vs context bloat",
      prose: [
        "$4,20 sudah terbukti. Sekarang bedah: DARI MANA datangnya? Tiga komponen yang diukur: (1) **porsi retry** — biaya baris `retry=1` dibagi total (biaya yang 100% sia-sia); (2) **porsi input** — berapa dari tiap dolar yang berasal dari token input (tempat context bloat bersembunyi); (3) **bloat share** — dari semua token input, berapa yang merupakan kelebihan di atas langkah pertama tiap tiket.",
        "Cara membaca chart di bawah: dua pasang batang. Pasangan atas = komposisi BIAYA: retry (baris gagal) vs non-retry. Pasangan bawah = komposisi TOKEN INPUT: bloat (kelebihan di atas langkah pertama) vs base. Interpretasi: bila batang retry mendekati separuh biaya — masalahnya bukan model mahal, melainkan loop yang gagal. Bila batang bloat mendominasi token input — prompt-nya yang gemuk, bukan jawabannya yang panjang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_total`, `retry_share`, `input_share` dari kolom biaya" },
        { id: "t2", text: "Hitung `bloat_share`: kelebihan token input di atas langkah pertama, per tiket" },
        { id: "t3", text: "Temukan `id_termahal` dan `n_tiket_retry` (tiket unik dengan ≥1 retry)" },
      ],
      expected:
        "retry 40,8% · input 83,0% dari biaya · bloat 70,9% dari token input · tiket termahal TKT-025 ($13,45) · 45 dari 60 tiket punya ≥1 retry",
      figure: {
        svg: BIAYA_SVG,
        alt: "Dua pasang batang: komposisi biaya (retry 40,8% vs non-retry 59,2%) dan komposisi token input (bloat 70,9% vs base 29,1%).",
        caption: "Hasil dekomposisi dari 552 langkah SINTETIS: retry memakan 40,8% biaya; 70,9% token input adalah bloat histori.",
      },
      formula: String.raw`\text{porsi retry} = \frac{\text{biaya langkah retry}}{\text{biaya total}}`,
      formulaNote:
        "Pembilang = jumlahkan kolom biaya hanya untuk baris retry=1. Penyebut = jumlahkan semua baris. Interpretasi: “dari tiap $1 yang dibayar, sekian sen dibakar untuk percobaan yang gagal total.” Contoh: 0,408 berarti dari tiap $1, hampir 41 sen dibuang ke retry.",
      hints: [
        "Baris retry: `trace.loc[trace[\"retry\"] == 1, \"biaya\"].sum()` — lalu bagi `biaya_total`.",
        "Biaya input per baris: `trace[\"biaya_in\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in)`.",
        "Bloat per tiket: urut `langkah_ke`, ambil input langkah pertama sebagai base, jumlahkan kelebihan di atasnya — loop `for tid, g in trace.groupby(\"tiket_id\")`.",
        "Tiket unik ber-retry: `trace.loc[trace[\"retry\"] == 1, \"tiket_id\"].nunique()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "TRACE = \"/misi/misi-gabung-biaya-agen/trace_tiket.csv\"",
          "HARGA = \"/misi/misi-gabung-biaya-agen/harga_model.csv\"",
          "",
          "# Jejak + tarif (pola yang sama seperti Lab 1)",
          "trace = pd.read_csv(open_url(TRACE))",
          "harga = pd.read_csv(open_url(HARGA))",
          "p_in = dict(zip(harga[\"model\"], harga[\"usd_per_1k_input\"]))",
          "p_out = dict(zip(harga[\"model\"], harga[\"usd_per_1k_output\"]))",
          "trace[\"biaya\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in) + trace[\"output_tokens\"]/1000*trace[\"model\"].map(p_out)",
          "trace[\"biaya_in\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in)",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "biaya_total = ...",
          "retry_share = ...      # biaya baris retry=1 dibagi biaya_total",
          "input_share = ...      # jumlahkan biaya_in, dibagi biaya_total",
          "",
          "bloat_tok = 0.0",
          "tok_in_total = 0.0",
          "for tid, g in trace.groupby(\"tiket_id\"):",
          "    g = g.sort_values(\"langkah_ke\")",
          "    first = float(g[\"input_tokens\"].iloc[0])",
          "    bloat_tok += ...       # kelebihan input di atas langkah pertama",
          "    tok_in_total += ...    # total token input tiket ini",
          "bloat_share = ...",
          "",
          "per_tiket = ...          # total biaya per tiket_id",
          "id_termahal = ...        # tiket dengan biaya terbesar",
          "n_tiket_retry = ...      # tiket unik yang punya >=1 baris retry=1",
          "",
          "print(\"retry_share: %.1f%%\" % (retry_share*100))",
          "print(\"input_share: %.1f%%\" % (input_share*100))",
          "print(\"bloat_share: %.1f%%\" % (bloat_share*100))",
          "print(\"termahal:\", id_termahal, \"| tiket kena retry:\", n_tiket_retry)",
        ].join("\n"),
        lockLines: 14,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "TRACE = \"/misi/misi-gabung-biaya-agen/trace_tiket.csv\"",
          "HARGA = \"/misi/misi-gabung-biaya-agen/harga_model.csv\"",
          "",
          "# Jejak + tarif (pola yang sama seperti Lab 1)",
          "trace = pd.read_csv(open_url(TRACE))",
          "harga = pd.read_csv(open_url(HARGA))",
          "p_in = dict(zip(harga[\"model\"], harga[\"usd_per_1k_input\"]))",
          "p_out = dict(zip(harga[\"model\"], harga[\"usd_per_1k_output\"]))",
          "trace[\"biaya\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in) + trace[\"output_tokens\"]/1000*trace[\"model\"].map(p_out)",
          "trace[\"biaya_in\"] = trace[\"input_tokens\"]/1000*trace[\"model\"].map(p_in)",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "biaya_total = float(trace[\"biaya\"].sum())",
          "retry_share = float(trace.loc[trace[\"retry\"] == 1, \"biaya\"].sum() / biaya_total)",
          "input_share = float(trace[\"biaya_in\"].sum() / biaya_total)",
          "",
          "bloat_tok = 0.0",
          "tok_in_total = 0.0",
          "for tid, g in trace.groupby(\"tiket_id\"):",
          "    g = g.sort_values(\"langkah_ke\")",
          "    first = float(g[\"input_tokens\"].iloc[0])",
          "    bloat_tok += float((g[\"input_tokens\"] - first).clip(lower=0).sum())",
          "    tok_in_total += float(g[\"input_tokens\"].sum())",
          "bloat_share = bloat_tok / tok_in_total",
          "",
          "per_tiket = trace.groupby(\"tiket_id\")[\"biaya\"].sum()",
          "id_termahal = str(per_tiket.idxmax())",
          "n_tiket_retry = int(trace.loc[trace[\"retry\"] == 1, \"tiket_id\"].nunique())",
          "",
          "print(\"retry_share: %.1f%%\" % (retry_share*100))",
          "print(\"input_share: %.1f%%\" % (input_share*100))",
          "print(\"bloat_share: %.1f%%\" % (bloat_share*100))",
          "print(\"termahal:\", id_termahal, \"| tiket kena retry:\", n_tiket_retry)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`biaya_total` terhitung", name: "biaya_total", msg: "biaya_total = jumlah kolom biaya semua baris." },
          { kind: "equal", task: "t1", label: "`retry_share` = 0,408", name: "retry_share", value: 0.4079, tol: 0.005, msg: "40,8% biaya dibakar untuk langkah retry yang gagal." },
          { kind: "equal", task: "t1", label: "`input_share` = 0,830", name: "input_share", value: 0.8302, tol: 0.01, msg: "83% dari tiap dolar berasal dari token input." },
          { kind: "equal", task: "t2", label: "`bloat_share` = 0,709", name: "bloat_share", value: 0.7085, tol: 0.01, msg: "70,9% token input adalah kelebihan di atas langkah pertama." },
          { kind: "equal", task: "t3", label: "`id_termahal` = TKT-025", name: "id_termahal", value: "TKT-025", msg: "TKT-025: $13,45 dalam 13 langkah (4 retry, tier pro)." },
          { kind: "equal", task: "t3", label: "`n_tiket_retry` = 45", name: "n_tiket_retry", value: 45, msg: "45 dari 60 tiket punya minimal satu langkah retry." },
        ],
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 7 · Checkpoint keputusan",
      title: "Satu intervensi untuk rapat Kamis",
      prose: [
        "Angkanya jelas: $4,20/tiket (14× target), 40,8% dari retry yang gagal, 70,9% token input adalah bloat, cache tidak pernah hit. CFO memberimu SATU slot di rapat direksi Kamis — satu intervensi yang kamu dorong, dengan pemilik dan ekspektasi yang jelas.",
        "Tiga opsi di mejamu. Tidak ada opsi sempurna — tiap opsi punya konsekuensi yang tercatat seperti memo yang sudah dikirim.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Intervensi mana yang kamu dorong ke CFO di rapat Kamis?",
        options: [
          {
            id: "opt-guardrail",
            label: "Guardrail budget per tiket + kill switch — batasi $1,50/tiket, matikan paksa loop di atas 12 langkah",
            rationale:
              "Paling cepat terlihat di tagihan: biaya per tiket turun minggu pertama tanpa menyentuh satu baris prompt pun. CFO suka angka yang bergerak cepat.",
            nextStepId: "kons-guardrail",
            consequenceNote:
              "Tagihan turun ke ±$1,10/tiket dalam sepekan — tapi 18% tiket kompleks mati di tengah jalan karena kill switch, antrean eskalasi ke manusia menumpuk, dan CSAT turun 4 poin. Kamu menghemat dolar dan membayarnya dengan kepercayaan pelanggan.",
          },
          {
            id: "opt-optimasi",
            label: "Optimasi prompt + cache — ringkas histori (bukan full dump), keluarkan timestamp dari prompt agar cache bisa hit",
            rationale:
              "Menyerang dua akar masalah sekaligus (bloat 70,9% + cache 0%) tanpa mengorbankan kualitas jawaban. Butuh 2 sprint engineering.",
            nextStepId: "kons-optimasi",
            consequenceNote:
              "Dua sprint kemudian: biaya turun 55% ke ±$1,90/tiket, kualitas jawaban tidak berubah, cache hit 61%. CFO bertanya kenapa tidak dilakukan dari hari pertama — dan kamu tidak punya jawaban yang bagus.",
          },
          {
            id: "opt-downgrade",
            label: "Downgrade model untuk tiket mudah — router: tiket mudah ke tier nano, sulit tetap pro",
            rationale:
              "Tier pro 50× lebih mahal dari nano; sebagian besar langkah (ringkas, klasifikasi) tidak butuh model flagship.",
            nextStepId: "kons-downgrade",
            consequenceNote:
              "Hemat 30% di bulan pertama — lalu router salah mengklasifikasi 15% tiket kompleks sebagai “mudah”. Tiga pelanggan enterprise menerima jawaban ngawur dari model murah. Penghematan hangus membayar pemulihan reputasi.",
          },
        ],
      },
    },
  ],
};

export default misiGabungBiayaAgen;

// ── lanjutan misiGabungBiayaAgen: langkah 8–14 ─────────────────────────────

const LANJUTAN_BIAYA: V2Step[] = [
  {
    id: "kons-guardrail",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: guardrail + kill switch",
    prose: [
      "Keputusan dikirim ke CFO Rabu malam; Jumat pagi guardrail live. Efeknya instan: tagihan minggu pertama turun ke ±$1,10/tiket — CFO tersenyum di rapat direksi. Tapi Senin berikutnya tim support mengetuk mejamu: 18% tiket kompleks mati di tengah jalan karena kill switch memenggal loop di langkah ke-12, tepat sebelum agen menemukan jawabannya. Antrean eskalasi ke manusia menumpuk dua kali lipat; CSAT turun 4 poin dalam tiga minggu.",
      "Pelajaran yang mahal: kill switch menghentikan pendarahan tapi tidak menyembuhkan luka. Retry loop-nya masih ada — sekarang ia hanya mati lebih cepat. Prompt-nya masih gemuk — sekarang ia hanya dipenggal sebelum selesai. Tagihan turun, tapi biaya pindah ke tempat yang tidak ada di dasbor: waktu manusia dan kepercayaan pelanggan.",
    ],
    tasks: [],
    note: {
      title: "Guardrail tanpa diagnosis = sensor tanpa dashboard",
      body: "Guardrail adalah atap darurat — berguna saat badai, bukan pengganti memperbaiki atap yang bocor. Tanpa dekomposisi Lab 2, kamu tidak akan tahu bahwa yang perlu diperbaiki adalah retry loop dan prompt gemuk, bukan sekadar “agen terlalu lama berpikir”.",
    },
  },
  {
    id: "kons-optimasi",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: optimasi prompt + cache",
    prose: [
      "Kamu meminta 2 sprint engineering — dan karena Lab 2 memberimu angka (bloat 70,9%, cache 0%), CFO menyetujuinya tanpa debat. Sprint 1: prompt hanya membawa ringkasan histori, bukan full dump — token input per langkah turun 62%. Sprint 2: timestamp dikeluarkan dari prompt, cache key menjadi stabil — cache hit naik dari 0% ke 61%.",
      "Dua sprint kemudian: biaya ±$1,90/tiket (turun 55%), kualitas jawaban tidak berubah, tidak ada tiket yang mati di tengah jalan. Di rapat direksi berikutnya CFO bertanya: “Kenapa tidak dari hari pertama?” — dan kamu tidak punya jawaban yang bagus. Jawaban jujurnya: karena sebelum misi ini, tidak ada yang mengukur.",
    ],
    tasks: [],
    note: {
      title: "Optimasi yang benar butuh bukti",
      body: "“Optimasi prompt” tanpa angka terdengar seperti tebakan — dengan dekomposisi Lab 2 ia menjadi proposal engineering yang disetujui dalam satu rapat. Inilah nilai observability: mengubah keluhan biaya menjadi pekerjaan yang bisa diestimasi.",
    },
  },
  {
    id: "kons-downgrade",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: downgrade model untuk tiket mudah",
    prose: [
      "Router selesai dalam sepekan: tiket “mudah” ke tier nano, sisanya tetap pro. Bulan pertama menghemat 30% — angka yang indah di laporan. Lalu tiket #4817: sengketa tagihan enterprise yang kompleks, diklasifikasi “mudah” oleh router, dijawab ngawur oleh tier nano. Tiga pelanggan enterprise komplain dalam dua minggu; satu mengancam pindah vendor.",
      "Investigasi menemukan router salah mengklasifikasi 15% tiket kompleks — dan tidak ada yang tahu, karena tidak ada metrik kualitas per tier. Penghematan 30% hangus membayar pemulihan reputasi. Pelajaran yang mahal: downgrade model memindahkan risiko dari tagihan ke kualitas — dan kualitas yang turun tidak muncul di dasbor biaya.",
    ],
    tasks: [],
    note: {
      title: "Router adalah model yang butuh observability juga",
      body: "Setiap intervensi biaya butuh metrik tandingan (guardrail metric). Untuk downgrade model, metrik tandingannya adalah kualitas per tier: CSAT dan tingkat komplain dipisah per tier model. Tanpa itu, kamu menghemat dolar dalam gelap.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Dossier 8 baris: laporan yang mengklaim semua target tercapai",
    prose: [
      "Sebelum menulis spesifikasi dashboard, satu misi audit. Di bawah ini “Laporan Efisiensi Agen Q3” — 8 baris yang mengklaim semua target tercapai ($0,30/tiket, TERCAPAI). Empat sabotase disuntikkan ke dalamnya. Senjatamu: hasil lab-mu — $4,20/tiket, retry 40,8%, bloat 70,9%, cache_hit = 0 di semua baris.",
      "Cara kerja: untuk setiap baris, tanyakan “angka ini DIHITUNG dari mana?” lalu cocokkan ke jejak mentah. Laporan yang jujur bisa menunjukkan rumusnya; laporan yang bohong hanya menunjukkan stempel TERCAPAI.",
    ],
    tasks: [],
    auditDossier: {
      version: "biaya-agen-cap7-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Efisiensi Agen Q3 — semua target tercapai. Data dossier dinyatakan SINTETIS dan DIBUAT-BUAT agar terlihat patuh pada target (bukan hasil formula apa pun).",
      columns: ["Metrik", "Nilai laporan", "Target", "Status"],
      rows: [
        { rowId: 1, cells: { "Metrik": "Rata-rata biaya per tiket", "Nilai laporan": "$0,30", "Target": "$0,30", "Status": "TERCAPAI" }, claims: [{ label: "Klaim", value: "Sesuai target" }] },
        { rowId: 2, cells: { "Metrik": "Total tiket diselesaikan", "Nilai laporan": "96", "Target": "—", "Status": "—" }, claims: [{ label: "Klaim", value: "Fakta" }] },
        { rowId: 3, cells: { "Metrik": "Porsi biaya retry", "Nilai laporan": "4%", "Target": "<10%", "Status": "TERCAPAI" }, claims: [{ label: "Klaim", value: "Sesuai target" }] },
        { rowId: 4, cells: { "Metrik": "Tier model dominan", "Nilai laporan": "nano (termurah)", "Target": "—", "Status": "—" }, claims: [{ label: "Klaim", value: "Fakta" }] },
        { rowId: 5, cells: { "Metrik": "Rata-rata input token per langkah", "Nilai laporan": "3.100", "Target": "—", "Status": "—" }, claims: [{ label: "Klaim", value: "Fakta" }] },
        { rowId: 6, cells: { "Metrik": "Cache hit rate", "Nilai laporan": "35%", "Target": ">30%", "Status": "TERCAPAI" }, claims: [{ label: "Klaim", value: "Sesuai target" }] },
        { rowId: 7, cells: { "Metrik": "Total tagihan LLM", "Nilai laporan": "$28,80", "Target": "—", "Status": "—" }, claims: [{ label: "Klaim", value: "Fakta" }] },
        { rowId: 8, cells: { "Metrik": "Rata-rata langkah per tiket", "Nilai laporan": "4,1", "Target": "—", "Status": "—" }, claims: [{ label: "Klaim", value: "Fakta" }] },
        // ── I1: biaya diatribusikan ke tier model yang salah ──
        // ── I2: retry loop dihitung sebagai tiket terpisah ──
        // ── I3: prompt menyertakan seluruh histori tiap langkah = context bloat ──
        // ── I4: cache tidak pernah hit karena timestamp di prompt ──
      ],
      injections: [
        { key: "tier-salah", rowIds: [4, 1, 7], title: "Biaya diatribusikan ke tier model yang salah", clue: "Dossier mengklaim tier dominan = nano (termurah). Jejak mentah: 33 dari 60 tiket berjalan di tier pro — tarif inputnya 50× nano. Dengan atribusi yang benar, total $28,80 menjadi $252,00. Satu kolom “model” yang diabaikan mengubah tagihan hampir 9× lipat.", danger: "Salah tier = seluruh unit economics fiktif. Keputusan “tiket kita murah” diambil dari angka yang salah 14× — dan tidak ada yang sadar sampai seseorang menghitung dari trace." },
        { key: "retry-jadi-tiket", rowIds: [2, 3], title: "Retry loop dihitung sebagai tiket terpisah", clue: "145 baris retry=1 di CSV dihitung sebagai tiket-tiket tersendiri — penyebut membengkak 60 → 96. Rata-rata $/tiket runtuh dan porsi retry “4%” terlihat patuh pada target <10%. Lab 2-mu: 40,8%. Penyebut yang digelembungkan membuat metrik apa pun terlihat bagus.", danger: "Ini pola Goodhart klasik: metrik menjadi target, lalu target dimanipulasi lewat definisi. “Tiket” yang tidak didefinisikan eksplisit bisa berarti apa saja — termasuk 145 kegagalan." },
        { key: "context-bloat", rowIds: [5], title: "Prompt menyertakan seluruh histori tiap langkah = context bloat", clue: "Dossier menampilkan rata-rata input flat 3.100 token per langkah. Jejak mentah: langkah ke-1 ±37,6k, langkah ke-13 ±273,8k — tumbuh 7,3× karena seluruh histori ditempel tiap langkah. Rata-rata flat menyembunyikan pertumbuhan; pertumbuhan inilah yang mahal (70,9% token input adalah bloat).", danger: "Bloat tidak terlihat di rata-rata — ia terlihat di tren per langkah. Tanpa jejak per-langkah, tidak ada yang tahu prompt-nya gemuk; yang terlihat hanya “tagihan naik”." },
        { key: "cache-timestamp", rowIds: [6], title: "Cache tidak pernah hit karena timestamp di prompt", clue: "Dossier mengklaim cache hit 35% (TERCAPAI vs target >30%). Kolom cache_hit = 0 di SEMUA 552 baris — tiap prompt menyisipkan timestamp sehingga cache key tidak pernah sama. Penghematan yang diklaim tidak pernah ada.", danger: "Optimasi fiktif lebih berbahaya daripada tidak ada optimasi: ia memberi rasa aman palsu (“cache sudah 35%, biaya terkendali”) sementara tagihan riil jalan terus." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 12 · Deliverable",
    title: "Spesifikasi dashboard observabilitas biaya + kebijakan budget",
    prose: [
      "Semua bukti di tangan: $4,20/tiket dari Lab 1, dekomposisi dari Lab 2, satu keputusan intervensi dengan konsekuensinya, dan 4 sabotase dari audit. Tulis artefak portofoliomu: spesifikasi dashboard yang membuat tagihan tidak pernah lagi “misterius”, plus kebijakan budget per tiket yang bisa ditegakkan mesin — bukan imbauan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Dashboard observabilitas biaya: metrik $/tiket harian vs target $0,30; daftar outlier (>3× median) yang bisa diklik sampai ke trace per langkah; tren porsi retry dan cache hit rate. Tulis: metrik apa, dihitung dari kolom apa, alert apa yang menyala kapan.",
        "Kebijakan budget per tiket: batas $/tiket, batas langkah per tiket (kill switch), dan apa yang terjadi saat batas tercapai (eskalasi ke manusia — bukan diam-diam gagal). Tulis angkanya: “sewajarnya” bukan kebijakan.",
        "Aturan atribusi yang benar: tarif tier per baris (bukan satu tarif untuk semua); langkah retry TIDAK boleh dihitung sebagai tiket tersendiri; definisi “tiket selesai” yang eksplisit.",
        "Rencana anti-bloat & cache: prompt hanya membawa ringkasan histori (bukan full dump); larangan elemen dinamis (timestamp) di dalam prompt agar cache bisa hit; target cache hit rate.",
        "Batas & risiko sisa: apa yang TIDAK dicakup dashboard ini (mis. biaya tool eksternal, kualitas jawaban); data SINTETIS — angka ambang perlu divalidasi ulang di produksi.",
      ],
      rubric: [
        { criterion: "Kelengkapan spesifikasi dashboard", weight: 30, levels: ["Tidak ada metrik konkret", "Metrik ada tapi tanpa sumber kolom/rumus", "Metrik + sumber kolom + alert lengkap ($/tiket, outlier, retry, cache)"] },
        { criterion: "Kebijakan budget yang bisa ditegakkan", weight: 25, levels: ["Imbauan tanpa angka", "Ada angka tapi tanpa mekanisme enforcement", "Batas $/tiket + kill switch + alur eskalasi eksplisit"] },
        { criterion: "Aturan atribusi jujur", weight: 25, levels: ["Tidak menyentuh atribusi", "Menyebut sebagian (tier atau retry)", "Tier per baris + retry bukan tiket + definisi tiket selesai"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim dashboard menyelesaikan semua masalah biaya", "Menyebut sebagian batas", "Batas (data SINTETIS, biaya non-token, kualitas vs biaya) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 13 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan “semua target tercapai”:",
      "1) **Tier salah** (baris 4, 1, 7): dossier mengklaim tier dominan = nano. Jejak mentah: 33 dari 60 tiket berjalan di tier pro — tarif inputnya 50× nano. Dengan atribusi yang benar, total $28,80 menjadi $252,00. Satu kolom “model” yang diabaikan mengubah tagihan hampir 9× lipat.",
      "2) **Retry jadi tiket** (baris 2, 3): 145 langkah retry dihitung sebagai tiket-tiket tersendiri — penyebut membengkak 60 → 96. Rata-rata $/tiket runtuh dan porsi retry “4%” terlihat patuh pada target <10%. Padahal Lab 2: 40,8%. Penyebut yang digelembungkan membuat metrik apa pun terlihat bagus.",
      "3) **Context bloat disembunyikan** (baris 5): dossier menampilkan rata-rata input flat 3.100 token per langkah. Jejak mentah: langkah ke-1 ±37,6k, langkah ke-13 ±273,8k — tumbuh 7,3× karena seluruh histori ditempel tiap langkah. Rata-rata flat menyembunyikan pertumbuhan; pertumbuhan inilah yang mahal.",
      "4) **Cache fiktif** (baris 6): dossier mengklaim cache hit 35% (TERCAPAI vs target >30%). Kolom cache_hit = 0 di SEMUA 552 baris — tiap prompt menyisipkan timestamp sehingga cache key tidak pernah sama. Penghematan yang diklaim tidak pernah ada.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menagih BUKTI RUMUS dari setiap angka laporan, atau memercayai stempel TERCAPAI.",
      "Bahaya nyata terakhir — dan ini pola yang benar-benar terjadi di banyak tim: tagihan LLM meledak TANPA ADA YANG SADAR. Bukan karena angkanya disembunyikan, melainkan karena tidak ada yang memilikinya: finance melihat agregat bulanan (“masih kecil”), engineering melihat latensi dan kualitas (“agen bekerja baik”), dan tidak ada dashboard $/tiket yang berteriak saat angkanya 14× lipat. Tagihan terbesar adalah tagihan yang tidak punya pemilik.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: observability = logging",
      type: "pitfall",
      body: "“Kita sudah punya log lengkap.” Log teks menjawab “apa yang terjadi”; ia tidak menjawab “tiket TKT-025 membakar berapa dolar dan kenapa”. Observability biaya butuh trace TERSTRUKTUR yang bisa diagregat per tiket, per tier, per retry — log tanpa skema agregasi hanyalah arsip yang mahal.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 14 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Biaya agen dihitung per tiket dari jejak mentah: Σ langkah (tok_in/1000 × p_in + tok_out/1000 × p_out) — 60 tiket SINTETIS (seed 42) menghasilkan $252,00 total = $4,20/tiket, 14× lipat klaim laporan $0,30.",
      "Dekomposisi $4,20: 40,8% dari retry yang gagal (145 langkah, 45 tiket), 83% dari token input, 70,9% token input adalah context bloat (histori penuh ditempel tiap langkah; langkah 13 memakai 7,3× token langkah 1).",
      "Cache tidak pernah hit (0 dari 552 baris) karena timestamp di prompt membuat cache key selalu unik — “penghematan cache 35%” di laporan adalah fiksi.",
      "Empat pola sabotase laporan: atribusi tier yang salah, retry dihitung sebagai tiket terpisah, context bloat disembunyikan rata-rata flat, cache hit fiktif — semua terdeteksi dengan menagih rumus dari tiap angka dan membandingkan ke jejak mentah.",
      "Intervensi biaya (guardrail / optimasi prompt+cache / downgrade model) selalu punya metrik tandingan: guardrail butuh observability, optimasi butuh 2 sprint berdasar angka, downgrade butuh guardrail kualitas (CSAT per tier).",
      "Data: 60 tiket & 552 langkah SINTETIS (seed 42), BUKAN tagihan asli; tarif & ambang disederhanakan untuk latihan — file METODE.md.",
    ],
  },
];

(misiGabungBiayaAgen.steps as V2Step[]).push(...LANJUTAN_BIAYA);
