import type { V2Lesson } from "../lib/types";

// Empat metrik: kemarin (sehat) vs hari ini (sakit).
const METRIC_SVG = `<svg viewBox="0 0 640 260" role="img" aria-label="Empat metrik observability: kemarin sehat versus hari ini sakit.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="160" y="25" fill="var(--text)">kemarin (sehat)</text>
<text x="480" y="25" fill="var(--text)">hari ini (sakit)</text>
<rect x="110" y="60" width="100" height="150" fill="var(--c2)" fill-opacity="0.7"/>
<rect x="430" y="180" width="100" height="30" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="110" y="222" width="100" height="8" fill="var(--c2)" fill-opacity="0.7"/>
<rect x="430" y="140" width="100" height="90" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="110" y="150" width="100" height="60" fill="var(--c2)" fill-opacity="0.7"/>
<rect x="430" y="80" width="100" height="130" fill="var(--c1)" fill-opacity="0.8"/>
<rect x="110" y="180" width="100" height="30" fill="var(--c2)" fill-opacity="0.7"/>
<rect x="430" y="180" width="100" height="30" fill="var(--c1)" fill-opacity="0.8"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--chart-text)" text-anchor="middle">
<text x="160" y="245">volume: 20 baris</text>
<text x="480" y="245">volume: 6 baris</text>
<text x="160" y="132">stale 1 jam</text>
<text x="480" y="132">stale 72 jam</text>
<text x="160" y="142">mean 5,17</text>
<text x="480" y="72">mean 9,80</text>
<text x="160" y="172">skema utuh</text>
<text x="480" y="172">kolom status hilang</text>
</g>
<text x="320" y="30" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">empat indra, empat alarm — dashboard NPL 'membaik' padahal data sakit</text>
</svg>`;

export const de27: V2Lesson = {
  slug: "de27-data-observability",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE27 — Data Observability: Mengetahui Data Rusak Sebelum Dashboard Berteriak",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Setelah lesson ini, kamu bisa membangun sistem peringatan dini untuk kualitas data — agar 'kabar baik' dari dashboard selalu diverifikasi sebelum dirayakan.",
        "(1) Menjelaskan lima pilar observability data dan apa yang dideteksi masing-masing;",
        "(2) Menulis SLO data: kontrak kualitas yang eksplisit dan bisa diuji mesin;",
        "(3) Menerapkan deteksi anomali sederhana (z-score) pada metrik pipeline;",
        "(4) Membedakan monitoring pipeline (apakah jalan) dari observability data (apakah benar);",
        "(5) Menilai kapan membangun sendiri dan kapan memakai platform seperti Monte Carlo atau Datafold.",
        "Alurnya: NPL yang 'membaik' ternyata data rusak → lima indra → SLO → deteksi anomali → platform → lab vonis kualitas → peta keputusan → mini-case GMV yang 'naik'.",
        "Estimasi 60 menit. Lab memakai Python standar — tanpa install, jalan di browser.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "NPL 0,4%: kabar baik yang harus dibekukan",
      prose: [
        "Senin pagi, April 2026. Dashboard risiko DanaCepat menampilkan angka yang membuat tim bersorak: NPL turun dari 3,2% menjadi 0,4% dalam semalam. Kepala divisi risiko menyiapkan slide untuk direksi — 'keberhasilan program penagihan kuartal ini'.",
        "Sinta, analis data, tidak ikut bersorak. Ia membuka tabel mentah dan menemukan empat hal dalam sepuluh menit. Pertama, volume: 20 baris menjadi 6 baris — 70% data hilang. Kedua, skema: kolom `status` berubah nama menjadi `status_kredit` tanpa pemberitahuan — query NPL yang join ke kolom lama hanya menghitung subset yang kebetulan cocok. Ketiga, freshness: data terakhir 72 jam lalu, bukan tadi malam. Keempat, distribusi: rata-rata nominal melonjak dari 5,17 juta menjadi 9,80 juta — sampel yang tersisa bukan sampel yang acak.",
        "Twist-nya: 'perbaikan' NPL 2,8 poin itu 100% artefak. Pipeline ETL dari core banking gagal parsial: satu job macet di tengah, skema sumber berubah tanpa kontrak, dan tidak ada satu pun alarm yang bunyi — karena monitoring yang ada hanya mengecek 'apakah job selesai', dan job-nya memang 'selesai' (dengan 70% data hilang). Slide direksi dibatalkan; dashboard dibekukan, bukan dirayakan.",
        "Pelajaran yang dibayar mahal: pipeline yang sehat belum tentu datanya sehat. Monitoring menjawab 'apakah mesin jalan'; observability menjawab 'apakah yang keluar dari mesin bisa dipercaya'. DanaCepat punya yang pertama — dan tidak punya yang kedua.",
      ],
      tasks: [],
      reference: "Kabar baik dari dashboard = hipotesis, bukan fakta. Verifikasi lima pilar dulu, rayakan kemudian.",
    },
    {
      id: "lima-indra",
      eyebrow: "Langkah 3 · Lima pilar",
      title: "Lima pilar: si lima indra data",
      prose: [
        "Observability data bertumpu pada lima pilar — anggap mereka Lima Indra yang masing-masing mencium jenis kebusukan berbeda. Freshness (penciuman): seberapa basi data ini — 'data terakhir jam berapa?' Volume (timbangan): berapa banyak baris — anjlok 70% seperti di cerita = alarm. Schema (sidik jari): apakah kolomnya masih sama — kolom hilang atau berubah nama = kontrak dilanggar. Distribution (termometer): apakah sebarannya masih wajar — mean bergeser 90% = sampel berubah. Lineage (silsilah): dari mana data ini datang dan apa yang berubah di hulu.",
        "Di cerita tadi, empat dari lima indra berteriak sekaligus: volume anjlok, skema berubah, basi 72 jam, distribusi bergeser. Hanya lineage yang diam — dan justru itu masalahnya: tidak ada yang tahu job ETL mana yang macet dan siapa mengubah skema sumber.",
        "Setiap pilar butuh ambang yang eksplisit, bukan firasat. 'Volume turun banyak' bukan aturan; 'volume menyimpang lebih dari 10% dari median 7 hari' adalah aturan — bisa diuji mesin, bisa memicu alarm, bisa dipertanggungjawabkan.",
        "Cara membaca diagram: empat pasang batang membandingkan kemarin (sehat) vs hari ini (sakit) — volume, kebasian, rata-rata, dan skema. Satu pilar sakit = periksa; dua pilar sakit = curiga; tiga atau lebih = bekukan dashboard.",
        "Interpretasi: dashboard NPL 'membaik' justru saat keempat indra sakit. Korelasinya terbalik dengan intuisi — data yang rusak sering terlihat LEBIH BAIK (lebih kecil, lebih rapi, lebih sedikit masalah) karena yang hilang adalah bagian yang bermasalah.",
      ],
      figure: {
        svg: METRIC_SVG,
        alt: "Empat metrik observability: kemarin sehat versus hari ini sakit.",
        caption: "Kemarin vs hari ini: volume anjlok, basi 72 jam, mean bergeser, kolom hilang — empat alarm, satu dashboard yang 'membaik'.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: data yang terlihat rapi = data yang sehat",
        type: "pitfall",
        body: "Data rusak sering terlihat LEBIH rapi: lebih sedikit baris (lebih cepat di-query), lebih sedikit nilai aneh (yang aneh tidak masuk), metrik 'membaik' (yang buruk hilang dari perhitungan). Kerapian adalah properti tampilan; kesehatan adalah properti proses. Jangan percaya kerapian — percaya metrik lima pilar.",
      },
      reference: "Lima indra: freshness, volume, schema, distribution, lineage. Sakit 3+ = bekukan dashboard.",
    },
    {
      id: "slo",
      eyebrow: "Langkah 4 · SLO data",
      title: "SLO data: kontrak yang bisa diuji mesin",
      prose: [
        "SLO (service level objective) untuk data adalah janji tertulis tentang kualitas — seperti SLA, tetapi untuk tabel, bukan untuk API. Contoh kontrak untuk tabel `kredit_harian`: segar di bawah 2 jam; volume dalam rentang ±10% dari median 7 hari; skema frozen (perubahan kolom = deploy yang disengaja, bukan kejutan); distribusi kolom kunci dalam batas z-score ±3.",
        "Tanpa SLO, 'data rusak' adalah opini. Dengan SLO, ia adalah fakta yang bisa diuji tiap jam oleh mesin — dan pelanggarannya memicu alarm SEBELUM dashboard dibaca direksi. Inilah bedanya dengan cerita DanaCepat: tidak ada kontrak, sehingga tidak ada pelanggaran, sehingga tidak ada alarm.",
        "SLO yang baik punya tiga sifat: terukur (angka, bukan kata sifat), bertuan (ada pemilik yang bangun saat alarm bunyi), dan berkonsekuensi (pelanggaran = pipeline di-pause atau dashboard diberi watermark 'data belum tervalidasi'). SLO tanpa konsekuensi = dekorasi.",
        "💡 Intuisi: tulis SLO seperti menulis test — 'tabel ini segar < 2 jam' adalah assert. Pipeline tanpa assert = kode tanpa test: berjalan sampai hari ia memalukanmu di depan direksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: SLO data = SLO API yang diganti kata-katanya",
        type: "pitfall",
        body: "SLO API mengukur sistem (latensi, error rate). SLO data mengukur ISI (kebenaran, kelengkapan, kesegaran). API bisa 100% sehat sambil menyajikan data basi 3 hari — seperti di cerita: job 'selesai' dengan sukses sementara datanya sakit. Keduanya dibutuhkan; salah satu tidak menggantikan yang lain.",
      },
      reference: "SLO data: terukur, bertuan, berkonsekuensi. Uji tiap jam, bukan tiap insiden.",
    },
    {
      id: "anomali",
      eyebrow: "Langkah 5 · Deteksi anomali",
      title: "Deteksi anomali: z-score untuk metrik pipeline",
      prose: [
        "Aturan ambang tetap ('volume < 100 = alarm') rapuh: volume normal hari Senin berbeda dengan hari Minggu. Deteksi anomali yang sederhana dan jujur: bandingkan metrik hari ini dengan perilakunya sendiri — z-score.",
      ],
      formula: String.raw`z = \frac{x - \mu}{\sigma}`,
      formulaNote: "z = skor anomali; x = nilai metrik hari ini (mis. volume baris); μ = rata-rata 30 hari terakhir; σ = simpangan bakunya. |z| > 3 = anomali (peluang < 0,3% bila normal). Contoh: volume 6 baris vs μ = 20, σ = 1,5 → z = −9,3 = alarm keras.",
      tasks: [],
      note: {
        title: "🚨 Mitos: anomali = pasti ada yang rusak",
        type: "pitfall",
        body: "Anomali = 'berbeda dari biasanya', bukan 'rusak'. Promo 12.12 memang menaikkan volume 5 kali lipat — itu anomali yang diharapkan. Makanya setiap aturan anomali butuh kalender bisnis (promo, libur, gajian) sebagai konteks, dan setiap alarm butuh tombol 'diharapkan' agar tidak menjadi noise yang diabaikan.",
      },
      reference: "z-score mengalahkan ambang tetap; kalender bisnis mengalahkan z-score buta.",
    },
    {
      id: "platform",
      eyebrow: "Langkah 6 · Platform",
      title: "Platform observability: bangun atau beli",
      prose: [
        "Pasar 2026 punya kategori produk khusus: platform data observability (nama yang sering disebut: Monte Carlo, Datafold, dan sejenisnya). Secara konseptual, yang mereka lakukan: memindai metadata dan statistik tiap tabel otomatis, membangun lineage antar tabel dan pipeline, menjalankan ratusan cek lima-pilar tanpa ditulis manual, dan mengirim alarm ke pemilik tabel.",
        "Kapan membeli: tim kecil, ratusan tabel, butuh cakupan kemarin sore — menulis 500 aturan manual bukan rencana. Kapan membangun: 20 tabel kritis, aturan bisnis spesifik (aturan syariah untuk kolom tertentu, mis.), atau data tidak boleh dipindai pihak ketiga. Pola yang umum: beli platform untuk cakupan luas, tulis aturan kustom untuk 10 tabel paling kritis.",
        "Yang tidak boleh dilakukan platform: menggantikan SLO. Platform memberi mesin; kontrak kualitas tetap ditulis manusia yang paham bisnisnya. Membeli platform lalu tidak menulis SLO = membeli alarm kebakaran tanpa menentukan apa itu 'api'.",
        "💡 Intuisi: anggap platform observability seperti CCTV — ia merekam semuanya, tetapi kamu yang menentukan ruangan mana yang dipantau dan siapa yang dihubungi saat ada gerakan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: platform observability menghilangkan kebutuhan data engineer",
        type: "pitfall",
        body: "Platform mendeteksi GEJALA (volume anjlok); manusia mendiagnosis PENYAKIT (job ETL macet karena skema sumber berubah). Tanpa engineer yang paham lineage dan bisa memperbaiki hulu, alarm hanya menjadi notifikasi yang di-snooze. Platform mengalikan efektivitas engineer — bukan menggantikannya.",
      },
      reference: "Beli untuk cakupan, tulis untuk kekritisan. Kontrak tetap milik manusia.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: vonis kualitas dua snapshot",
      prose: [
        "Waktunya menjadi Sinta. Lab ini memberi dua snapshot tabel `kredit_harian`: kemarin (20 baris, sehat) dan hari ini (6 baris, sakit). Kamu akan mengimplementasikan empat metrik lima-pilar dan satu fungsi vonis — persis seperti yang seharusnya dimiliki DanaCepat.",
        "Perhatikan hasilnya: satu-satunya pilar yang 'sehat' adalah lineage — dan itu karena lab ini tidak menyediakannya, sama seperti DanaCepat yang tidak memilikinya. Vonis akhirnya INSIDEN: skema berubah DAN volume anjlok.",
        "Cara membaca output: tiap baris membandingkan kemarin vs hari ini untuk satu pilar; baris terakhir adalah vonis dengan alasan.",
        "Interpretasi: aturan vonisnya berlapis — skema atau volume yang jebol = INSIDEN langsung; kebasian atau pergeseran = DEGRADASI; sisanya SEHAT. Prioritasnya disengaja: yang merusak kebenaran didahulukan dari yang merusak kesegaran.",
      ],
      formula: String.raw`\text{drop} = \frac{n_{lama} - n_{baru}}{n_{lama}}`,
      formulaNote: "drop = fraksi volume yang hilang; n_lama = jumlah baris kemarin; n_baru = jumlah baris hari ini. Contoh lab: (20 − 6) / 20 = 0,70 = 70% hilang. Ambang INSIDEN di lab ini: drop > 50% atau ada kolom hilang.",
      tasks: [
        { id: "t1", text: "Lengkapi `metrik_volume` (fraksi hilang) dan `metrik_freshness` (jam sejak update terakhir)" },
        { id: "t2", text: "Lengkapi `deteksi_skema` (kolom hilang vs baru) dan `pergeseran` (perubahan relatif rata-rata)" },
        { id: "t3", text: "Lengkapi `vonis` berlapis dan pastikan 5 baris print cocok dengan expected" },
      ],
      expected: "volume: 20 -> 6 (drop 70.0%)\nkolom hilang: ['status'] | kolom baru: ['status_kredit']\nstale: 1 jam -> 72 jam\nrata-rata nominal: 5.17 jt -> 9.80 jt (shift +89.7%)\nvonis: INSIDEN - skema berubah dan volume anjlok, jangan percaya dashboard",
      note: {
        title: "Sering salah",
        body: "Menghitung drop sebagai (baru − lama) / lama sehingga hasilnya negatif (−70%). Fraksi HILANG = (lama − baru) / lama — positif 70% berarti 70% hilang. Tanda negatif di sini bukan 'diskon', melainkan bug.",
      },
      hints: [
        "metrik_volume: (len(a) − len(b)) / len(a).",
        "metrik_freshness: NOW − max(rows).",
        "deteksi_skema: [c for c in lama if c not in baru] dan sebaliknya.",
        "pergeseran: (mean_baru − mean_lama) / mean_lama.",
        "vonis: if vd > 0.5 or hilang: INSIDEN; elif stale > 24 or abs(shift) > 0.3: DEGRADASI; else SEHAT.",
      ],
      code: {
        starter: `# Dua snapshot tabel kredit_harian (angka dalam juta rupiah; waktu = jam)\n` +
`NOW = 1000\n` +
`kolom_A = ["id", "cabang", "status", "nominal", "updated_at"]\n` +
`kolom_B = ["id", "cabang", "status_kredit", "nominal", "updated_at"]\n` +
`nom_A = [5.0, 5.2, 5.1, 5.3, 4.9, 5.4, 5.2, 5.1, 5.3, 5.0, 5.2, 5.4, 4.9, 5.1, 5.3, 5.2, 5.0, 5.4, 5.1, 5.2]\n` +
`upd_A = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999]\n` +
`nom_B = [9.6, 10.0, 9.8, 9.5, 10.1, 9.8]\n` +
`upd_B = [920, 922, 924, 925, 927, 928]\n` +
`\n` +
`# TUGAS 1: metrik volume & freshness\n` +
`def metrik_volume(a, b):\n` +
`    return\n` +
`\n` +
`def metrik_freshness(rows):\n` +
`    return\n` +
`\n` +
`# TUGAS 2: deteksi skema & pergeseran distribusi\n` +
`def deteksi_skema(kolom_lama, kolom_baru):\n` +
`    return [], []\n` +
`\n` +
`def pergeseran(nom_lama, nom_baru):\n` +
`    return\n` +
`\n` +
`# TUGAS 3: vonis berlapis\n` +
`def vonis(vd, hilang, stale, shift):\n` +
`    return\n` +
`\n` +
`vol_drop = metrik_volume(nom_A, nom_B)\n` +
`stale = metrik_freshness(upd_B)\n` +
`hilang, baru = deteksi_skema(kolom_A, kolom_B)\n` +
`shift = pergeseran(nom_A, nom_B)\n` +
`vonis_hasil = vonis(vol_drop, hilang, stale, shift)\n` +
`mean_A = sum(nom_A) / len(nom_A)\n` +
`mean_B = sum(nom_B) / len(nom_B)\n` +
`print(f"volume: {len(nom_A)} -> {len(nom_B)} (drop {vol_drop:.1%})")\n` +
`print(f"kolom hilang: {hilang} | kolom baru: {baru}")\n` +
`print(f"stale: {NOW - max(upd_A)} jam -> {stale} jam")\n` +
`print(f"rata-rata nominal: {mean_A:.2f} jt -> {mean_B:.2f} jt (shift {shift:+.1%})")\n` +
`print(f"vonis: {vonis_hasil} - skema berubah dan volume anjlok, jangan percaya dashboard")\n`,
        lockLines: 8,
        solution: `# Dua snapshot tabel kredit_harian (angka dalam juta rupiah; waktu = jam)\nNOW = 1000\nkolom_A = ["id", "cabang", "status", "nominal", "updated_at"]\nkolom_B = ["id", "cabang", "status_kredit", "nominal", "updated_at"]\nnom_A = [5.0, 5.2, 5.1, 5.3, 4.9, 5.4, 5.2, 5.1, 5.3, 5.0, 5.2, 5.4, 4.9, 5.1, 5.3, 5.2, 5.0, 5.4, 5.1, 5.2]\nupd_A = [990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999]\nnom_B = [9.6, 10.0, 9.8, 9.5, 10.1, 9.8]\nupd_B = [920, 922, 924, 925, 927, 928]\n\n# TUGAS 1: metrik volume & freshness\ndef metrik_volume(a, b):\n    return (len(a) - len(b)) / len(a)\n\ndef metrik_freshness(rows):\n    return NOW - max(rows)\n\n# TUGAS 2: deteksi skema & pergeseran distribusi\ndef deteksi_skema(kolom_lama, kolom_baru):\n    hilang = [c for c in kolom_lama if c not in kolom_baru]\n    baru = [c for c in kolom_baru if c not in kolom_lama]\n    return hilang, baru\n\ndef pergeseran(nom_lama, nom_baru):\n    mean_lama = sum(nom_lama) / len(nom_lama)\n    mean_baru = sum(nom_baru) / len(nom_baru)\n    return (mean_baru - mean_lama) / mean_lama\n\n# TUGAS 3: vonis berlapis\ndef vonis(vd, hilang, stale, shift):\n    if vd > 0.5 or hilang:\n        return "INSIDEN"\n    if stale > 24 or abs(shift) > 0.3:\n        return "DEGRADASI"\n    return "SEHAT"\n\nvol_drop = metrik_volume(nom_A, nom_B)\nstale = metrik_freshness(upd_B)\nhilang, baru = deteksi_skema(kolom_A, kolom_B)\nshift = pergeseran(nom_A, nom_B)\nvonis_hasil = vonis(vol_drop, hilang, stale, shift)\nmean_A = sum(nom_A) / len(nom_A)\nmean_B = sum(nom_B) / len(nom_B)\nprint(f"volume: {len(nom_A)} -> {len(nom_B)} (drop {vol_drop:.1%})")\nprint(f"kolom hilang: {hilang} | kolom baru: {baru}")\nprint(f"stale: {NOW - max(upd_A)} jam -> {stale} jam")\nprint(f"rata-rata nominal: {mean_A:.2f} jt -> {mean_B:.2f} jt (shift {shift:+.1%})")\nprint(f"vonis: {vonis_hasil} - skema berubah dan volume anjlok, jangan percaya dashboard")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "metrik_volume", label: "fungsi `metrik_volume` terdefinisi", msg: "Definisikan metrik_volume(a, b) yang mengembalikan fraksi hilang." },
          { kind: "equal", task: "t1", name: "vol_drop", value: 0.7, tol: 0.001, label: "`vol_drop` = 0,7", msg: "(20 − 6) / 20 = 0,7 — 70% data hilang." },
          { kind: "defined", task: "t2", name: "deteksi_skema", label: "fungsi `deteksi_skema` terdefinisi", msg: "Definisikan deteksi_skema(kolom_lama, kolom_baru) yang mengembalikan (hilang, baru)." },
          { kind: "equal", task: "t2", name: "hilang", value: ["status"], label: "`hilang` = ['status']", msg: "Kolom 'status' berubah nama menjadi 'status_kredit'." },
          { kind: "defined", task: "t3", name: "vonis", label: "fungsi `vonis` terdefinisi", msg: "Definisikan vonis(vd, hilang, stale, shift) yang mengembalikan string vonis." },
          { kind: "equal", task: "t3", name: "vonis_hasil", value: "INSIDEN", label: "`vonis_hasil` = INSIDEN", msg: "Skema berubah dan volume anjlok = insiden, bukan degradasi." },
          { kind: "stdout_matches", task: "t3", pattern: "drop 70\\.0%", label: "`print` drop 70.0%", msg: "Baris volume harus mencetak drop 70.0%." },
          { kind: "stdout_matches", task: "t3", pattern: "vonis: INSIDEN", label: "`print` vonis INSIDEN", msg: "Baris terakhir harus memvonis INSIDEN." },
        ],
      },
      reference: "Ukur lima pilar tiap jam; vonis berlapis; kabar baik = hipotesis sampai terbukti.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: respons atas alarm kualitas",
      prose: [
        "Skenario 1 — Satu pilar sakit ringan (volume −12%, masih dalam SLO). Keputusan: catat, pantau, tidak ada tindakan. Alasan: noise harian itu normal; alarm untuk setiap deviasi kecil = alarm yang diabaikan.",
        "Skenario 2 — Skema berubah (kolom hilang/baru). Keputusan: INSIDEN — pause pipeline downstream, hubungi pemilik sumber. Alasan: skema adalah kontrak; pelanggaran kontrak merusak semua yang di bawahnya.",
        "Skenario 3 — Volume anjlok > 50% seperti di lab. Keputusan: INSIDEN — bekukan dashboard, jangan rilis angka. Alasan: angka dari separuh data bukan 'kurang tepat' — ia salah.",
        "Skenario 4 — Freshness basi 6 jam padahal SLO 2 jam, tapi volume dan skema sehat. Keputusan: DEGRADASI — beri watermark 'data per jam 06:00' di dashboard, perbaiki job. Alasan: data lama yang jujur lebih baik dari data baru yang bohong — tapi kejujurannya harus terlihat.",
        "Skenario 5 — Distribusi bergeser setelah promo besar. Keputusan: tandai 'diharapkan' bila sesuai kalender bisnis, selidiki bila tidak. Alasan: anomali bukan vonis — konteks bisnis yang memutuskan.",
        "Aturan praktis 10 detik: skema atau volume jebol = bekukan. Basi = beri stempel waktu yang jujur. Geser = cek kalender dulu. Kabar baik yang tiba-tiba = curigai dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membuat 200 aturan dengan ambang yang sama untuk semua tabel. Tabel dimensi yang berubah sebulan sekali tidak butuh aturan freshness 2 jam — noise alarm membunuh kepercayaan pada sistem. Aturan mengikuti SLO per tabel, bukan template global.",
      },
      reference: "Respons proporsional: catat, beri stempel, bekukan — sesuai pilar yang sakit.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: GMV LapakKita yang 'naik' 40%",
      prose: [
        "Marketplace LapakKita melaporkan GMV harian naik 40%: dari Rp8,2 miliar menjadi Rp11,5 miliar. Tim growth merayakannya di grup chat. Kamu diminta verifikasi sebelum angka itu masuk laporan investor — dengan lima pilar.",
        "Temuanmu: volume order naik dari 41.000 menjadi 47.000 (naik 15%, bukan 40%) — selisihnya dari mana? Distribusi: rata-rata nilai order melonjak dari Rp200 ribu menjadi Rp245 ribu. Schema: utuh. Freshness: segar. Lineage: semalam ada deploy 'deduplikasi order' yang di-rollback karena bug — dan ternyata rollback-nya tidak sempurna: 18% order_id muncul dua kali di tabel final.",
        "Hitungannya: 18% duplikat × Rp245 ribu × 47.000 ≈ Rp2,07 miliar angka hantu. GMV 'sebenarnya' ≈ Rp9,4 miliar — naik 15% (sesuai volume), bukan 40%. Kabar baiknya nyata tapi jauh lebih kecil; kabar buruknya ada bug duplikasi yang lolos karena tidak ada cek volume-vs-distribusi yang konsisten.",
        "Pertanyaan analisis: (1) Pilar mana yang seharusnya menangkap ini lebih dulu, dan mengapa tidak? (2) Aturan SLO apa yang mencegah terulangnya insiden ini? (3) Angka berapa yang layak dilaporkan ke investor, dan dengan catatan apa?",
        "Pembahasan: (1) Volume vs distribusi yang tidak konsisten: order +15% tetapi GMV +40% = anomali gabungan yang tidak ditangkap karena tiap pilar dipantau sendiri-sendiri tanpa aturan silang. (2) SLO: 'order_id unik 100%' (test dbt unique) + 'GMV / order dalam ±2 z-score dari 30 hari' — keduanya murah dan otomatis. (3) Rp9,4 miliar dengan catatan 'setelah koreksi duplikasi 18% akibat rollback deploy; angka final menunggu audit' — kejujuran yang bisa diaudit mengalahkan presisi yang rapuh.",
      ],
      tasks: [],
      reference: "Pilar yang dipantau sendiri-sendiri buta terhadap inkonsistensi antar-pilar. Aturan silang menangkap yang lolos.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "Lima pilar: freshness (basi?), volume (berapa?), schema (masih sama?), distribution (masih wajar?), lineage (dari mana?).",
        "SLO data = kontrak terukur + bertuan + berkonsekuensi; monitoring menjawab 'jalan?', observability menjawab 'benar?'.",
        "Deteksi anomali: z-score terhadap perilaku sendiri; anomali butuh kalender bisnis sebagai konteks.",
        "Vonis berlapis: skema/volume jebol = INSIDEN (bekukan); basi/geser = DEGRADASI (stempel jujur).",
        "Platform (Monte Carlo/Datafold) memberi cakupan; aturan kritis tetap ditulis; kabar baik = hipotesis.",
      ],
      next: {
        label: "DE28 — Kubernetes untuk Workload Data",
        href: "/v2/learn/de28-kubernetes-data",
      },
      quiz: [
        {
          q: "NPL turun 3,2% menjadi 0,4% dalam semalam. Respons pertama yang benar?",
          options: [
            { text: "Laporkan ke direksi sebagai keberhasilan", why: "Itulah yang hampir terjadi di cerita — merayakan sebelum verifikasi.", },
            { text: "Verifikasi lima pilar (volume, skema, freshness, distribusi, lineage) sebelum memercayai angka", why: "Tepat: perubahan drastis semalam lebih mungkin artefak data daripada keajaiban bisnis — dan di cerita ini memang artefak.", correct: true },
            { text: "Tunggu seminggu, lihat apakah bertahan", why: "Menunggu tanpa verifikasi = membiarkan keputusan diambil dari angka yang mungkin salah selama seminggu.", },
            { text: "Minta tim penagihan menjelaskan metodenya", why: "Mencari penjelasan manusia untuk anomali data — urutannya terbalik: data dulu, manusia kemudian.", },
          ],
        },
        {
          q: "Job ETL berstatus 'sukses' tetapi volume tabel anjlok 70%. Apa yang hilang?",
          options: [
            { text: "Tidak ada — job sukses berarti data baik", why: "Inilah mitos yang memakan DanaCepat: suksesnya job tidak menjamin sehatnya data.", },
            { text: "Observability data (SLO): tidak ada kontrak kualitas yang diuji, sehingga 'sukses' hanya berarti mesinnya jalan", why: "Tepat: monitoring menjawab 'apakah jalan', observability menjawab 'apakah benar' — yang kedua tidak ada.", correct: true },
            { text: "CPU yang lebih besar", why: "Bukan masalah komputasi — masalahnya tidak ada yang memeriksa isi.", },
            { text: "Backup database", why: "Backup melindungi dari kehilangan, bukan dari data yang salah isi.", },
          ],
        },
        {
          q: "Kolom `status` berubah menjadi `status_kredit` tanpa pemberitahuan. Klasifikasi dan respons?",
          options: [
            { text: "Degradasi ringan — biarkan, nanti juga terbiasa", why: "Skema adalah kontrak; pelanggaran kontrak merusak semua query di bawahnya — ini bukan hal kecil.", },
            { text: "INSIDEN skema: pause downstream, hubungi pemilik sumber — pelanggaran kontrak", why: "Tepat: kolom hilang = semua logika yang bergantung padanya (termasuk perhitungan NPL) rusak diam-diam.", correct: true },
            { text: "Bukan masalah data engineer", why: "Justru ini inti pekerjaan DE: kontrak antar sistem.", },
            { text: "Hapus kolom baru agar kembali seperti semula", why: "Menghapus data sumber = menghilangkan bukti dan mungkin melanggar kebutuhan tim lain.", },
          ],
        },
        {
          q: "Volume harian = 6, rata-rata 30 hari = 20, σ = 1,5. Nilai z dan artinya?",
          options: [
            { text: "z = −9,3: anomali keras, selidiki segera", why: "Tepat: (6−20)/1,5 = −9,3 — jauh di luar ±3, peluang terjadi secara acak praktis nol.", correct: true },
            { text: "z = 9,3: anomali positif", why: "Tandanya salah: 6 di BAWAH rata-rata 20, jadi z negatif.", },
            { text: "z = −0,93: masih normal", why: "Salah hitung: (6−20)/1,5 = −9,33, bukan −0,93 — koma desimal yang memakan alarm.", },
            { text: "Tidak bisa dihitung tanpa data mentah", why: "z-score hanya butuh x, μ, σ — ketiganya sudah ada.", },
          ],
        },
        {
          q: "Kapan membeli platform observability (vs membangun sendiri)?",
          options: [
            { text: "Selalu — platform selalu lebih murah", why: "Tidak selalu: untuk 20 tabel kritis dengan aturan spesifik, membangun bisa lebih tepat.", },
            { text: "Saat tim kecil dengan ratusan tabel dan butuh cakupan cepat; aturan 10 tabel terkritis tetap ditulis sendiri", why: "Tepat: beli untuk cakupan luas, tulis untuk kekritisan — dan kontrak (SLO) tetap ditulis manusia.", correct: true },
            { text: "Tidak pernah — semua harus dibangun sendiri", why: "Menulis 500 aturan manual bukan rencana, melainkan penundaan.", },
            { text: "Hanya setelah insiden besar", why: "Reaktif: platform paling berharga SEBELUM insiden, bukan sesudah.", },
          ],
        },
        {
          q: "Data 72 jam basi tetapi volume dan skema sehat. Tindakan yang tepat?",
          options: [
            { text: "Bekukan dashboard total", why: "Berlebihan: datanya benar, hanya basi — pembekuan total untuk masalah kesegaran membuang informasi yang masih berguna.", },
            { text: "DEGRADASI: tampilkan dengan stempel waktu yang jujur ('data per 3 hari lalu'), perbaiki job", why: "Tepat: data lama yang jujur lebih baik dari data baru yang bohong — dan kejujurannya harus terlihat oleh pembaca.", correct: true },
            { text: "Sembunyikan stempel waktu agar tidak panik", why: "Menyembunyikan kebasian = membohongi pembaca — kepercayaan yang hilang lebih mahal dari keterlambatan.", },
            { text: "Hapus data lama agar dashboard terlihat segar", why: "Menghapus riwayat untuk kosmetik = merusak audit dan analisis tren.", },
          ],
        },
      ],
    },
  ],
};
