import type { V2Lesson } from "../lib/types";

// Diagram: dari JSON berantakan ke tabel kanonis.
const PARSING_SVG = `<svg viewBox="0 0 660 220" role="img" aria-label="Parsing: JSON bertingkat diubah menjadi tabel fakta kanonis berkolom.">
<defs><marker id="fdp3a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="14" y="50" width="200" height="120" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="114" y="80" font-size="12" font-weight="600" fill="var(--text)">JSON bertingkat</text>
<text x="114" y="100" font-size="10" fill="var(--text-muted)">facts → us-gaap →</text>
<text x="114" y="116" font-size="10" fill="var(--text-muted)">Revenues → units →</text>
<text x="114" y="132" font-size="10" fill="var(--text-muted)">USD → [ {...}, {...} ]</text>
<text x="114" y="150" font-size="10" fill="var(--text-muted)">dalam, bersarang,</text>
<text x="114" y="164" font-size="10" fill="var(--text-muted)">susah di-query</text>
<rect x="250" y="70" width="140" height="80" rx="10" fill="none" stroke="var(--chart-text)" stroke-width="1.6" stroke-dasharray="6 4"/>
<text x="320" y="98" font-size="12" font-weight="600" fill="var(--text)">parse</text>
<text x="320" y="118" font-size="10" fill="var(--text-muted)">ratakan +</text>
<text x="320" y="134" font-size="10" fill="var(--text-muted)">beri label kind</text>
<rect x="426" y="50" width="220" height="120" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="536" y="80" font-size="12" font-weight="600" fill="var(--text)">Tabel kanonis</text>
<text x="536" y="100" font-size="10" fill="var(--text-muted)">concept | value | unit |</text>
<text x="536" y="116" font-size="10" fill="var(--text-muted)">period_end | kind | fy |</text>
<text x="536" y="132" font-size="10" fill="var(--text-muted)">fp | form | filed | accn</text>
<text x="536" y="150" font-size="10" fill="var(--text-muted)">datar, seragam,</text>
<text x="536" y="164" font-size="10" fill="var(--text-muted)">siap dianalisis</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" marker-end="url(#fdp3a)">
<line x1="214" y1="110" x2="246" y2="110"/><line x1="390" y1="110" x2="422" y2="110"/>
</g>
</svg>`;

// Diagram: konteks konsolidasi vs segmen.
const KONTEKS_SVG = `<svg viewBox="0 0 660 200" role="img" aria-label="Konteks konsolidasi vs segmen: fakta yang sama bisa muncul untuk grup dan untuk divisi.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="60" y="30" width="240" height="120" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="180" y="58" font-size="13" font-weight="600" fill="var(--text)">Konsolidasian ✅</text>
<text x="180" y="80" font-size="11" fill="var(--text-muted)">seluruh grup usaha</text>
<text x="180" y="98" font-size="11" fill="var(--text-muted)">Revenues FY2024 = 391.035</text>
<text x="180" y="116" font-size="11" fill="var(--text-muted)">yang dipakai analisis</text>
<text x="180" y="134" font-size="11" fill="var(--text-muted)">+ rasio + valuasi</text>
<rect x="360" y="30" width="240" height="120" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="480" y="58" font-size="13" font-weight="600" fill="var(--text)">Segmen ⚠️</text>
<text x="480" y="80" font-size="11" fill="var(--text-muted)">per divisi / wilayah</text>
<text x="480" y="98" font-size="11" fill="var(--text-muted)">Revenues FY2024 = 96.500</text>
<text x="480" y="116" font-size="11" fill="var(--text-muted)">(divisi ritel saja)</text>
<text x="480" y="134" font-size="11" fill="var(--text-muted)">JANGAN dicampur!</text>
</g>
<text x="330" y="180" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Filter default: hanya konteks konsolidasian. Segmen = analisis lanjutan, bukan angka utama.</text>
</svg>`;

export const fdp3: V2Lesson = {
  slug: "fdp3-parsing",
  track: "Financial Data Pipeline",
  module: "Fondasi Data",
  title: "FDP3 — Parsing: Dari JSON Berantakan ke Tabel Kanonis",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Revenue yang turun 75% dalam semalam",
      prose: [
        "Citra baru saja menyelesaikan fetcher EDGAR-nya. Skrip berjalan mulus, JSON 40 MB terunduh, dan deret revenue 5 tahun tampil rapi. Tapi ada yang aneh: revenue 2024 tercatat 95 miliar — turun 75% dari 2023 yang 383 miliar. Sahamnya tidak anjlok, beritanya tidak heboh. Hanya skrip Citra yang panik.",
        "Twist-nya: skrip Citra mengambil fakta PERTAMA yang cocok dengan nama 'Revenues' — dan yang pertama muncul adalah angka segmen divisi ritel, bukan angka konsolidasian grup. Concept-nya sama persis ('Revenues'), nilainya valid, context-nya yang berbeda. Satu concept, puluhan fakta — dan skrip yang tidak memahami context akan memungut yang salah dengan percaya diri.",
        "Lesson ini tentang operasi paling penting setelah fetch: parsing — meratakan JSON bertingkat menjadi tabel fakta kanonis, memberi label jenis period, dan menyaring hanya konteks yang benar. Setelah ini, skripmu tidak akan pernah tertukar antara grup dan divisi lagi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: satu concept = satu angka",
        type: "pitfall",
        body: "Fakta di dunia nyata: satu concept seperti us-gaap:Revenues bisa punya PULUHAN fakta dalam satu companyfacts — angka tahunan, kuartalan, komparatif tahun lalu, restatement, per segmen, per entitas anak. 'Ambil yang pertama cocok' adalah bug, bukan strategi. Parsing yang benar selalu menjawab tiga pertanyaan: concept apa, period apa (instant/duration + kapan), context apa (konsolidasian/segmen).",
      },
      reference: "Parsing = ratakan JSON → tabel kanonis + label kind + saring context yang benar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa mengubah JSON companyfacts mentah menjadi tabel yang siap dianalisis.",
        "(1) Menjelaskan tiga unit utama (USD, shares, pure) dan kapan masing-masing muncul; (2) Memberi label kind (instant/duration) pada setiap fakta dari strukturnya;",
        "(3) Membedakan konteks konsolidasian dari segmen dan menjelaskan kenapa default-nya konsolidasian; (4) Membangun tabel fakta kanonis berkolom lengkap dari JSON sampel;",
        "(5) Mendeteksi duplikat restatement dari atribut filed.",
      ],
      tasks: [],
    },
    {
      id: "units",
      eyebrow: "Langkah 3 · Konsep",
      title: "Units: dolar, lembar, dan 'murni'",
      prose: [
        "Setiap concept punya 'bahasa satuan'-nya sendiri, tersimpan di kunci units. Tiga yang paling sering: USD (iso4217:USD) untuk semua pos moneter — revenue, aset, liabilitas; shares untuk jumlah lembar saham beredar (dei:EntityCommonStockSharesOutstanding); dan pure (tanpa dimensi) untuk rasio dan angka murni seperti jumlah karyawan.",
        "Aturan kerasnya: jangan pernah mencampur unit dalam satu operasi. Menjumlahkan USD dengan shares adalah omong kosong bertipe data — dan JSON tidak akan protes, karena keduanya hanya angka. Satu-satunya yang bisa protes adalah kodemu, kalau kamu menulis validasinya.",
        "💡 Intuisi: units adalah 'mata uang' tiap concept. Analis spreadsheet melakukan konversi ini diam-diam di kepala ('oh ini dalam lembar, bukan dolar'); pipeline yang baik melakukannya eksplisit di kode — assert unit == 'USD' sebelum menjumlahkan. Bug unit adalah bug senyap paling mahal kedua setelah bug context.",
        "Cara membaca units di JSON: data['facts']['us-gaap']['Revenues']['units'] menghasilkan dict seperti {'USD': [...]}. Kunci-kuncinya (USD, shares, pure) adalah daftar satuan yang tersedia untuk concept itu — baca dulu kuncinya, baru pilih.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'semua angka keuangan pasti USD'",
        type: "pitfall",
        body: "Saham beredar memakai shares, jumlah karyawan memakai pure, dan emiten non-AS bisa memakai EUR/JPY/IDR. Kode yang hardcode ['USD'] akan KeyError tepat saat menyentuh concept paling menarik (saham beredar untuk EPS!). Pola amannya: baca daftar unit yang tersedia, pilih yang sesuai kebutuhan analisismu, dan catat pilihanmu di provenance.",
      },
      reference: "USD = moneter, shares = lembar saham, pure = angka murni. Baca kunci units dulu, jangan hardcode.",
    },
    {
      id: "kind-m38",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kind: instant vs duration — dari struktur, bukan hafalan",
      prose: [
        "Di FDP1 kamu belajar instant vs duration dari sisi XBRL. Di sini kamu menerapkannya dari sisi JSON: fakta duration SELALU punya kunci 'start' (awal rentang), fakta instant TIDAK PERNAH punya. Itu saja — satu aturan struktural yang bisa dikodekan, tanpa perlu menghafal concept mana yang stock dan mana yang flow.",
        "Rumus kodenya satu baris: kind = 'duration' if 'start' in fakta else 'instant'. Sederhana, deterministik, dan tidak bergantung pada daftar concept. Inilah kenapa tabel kanonis menyimpan kolom kind — supaya langkah downstream (FDP5: mesin rasio) bisa menolak operasi tak bermakna seperti 'jumlahkan total aset empat kuartal' secara otomatis.",
        "💡 Intuisi — koneksi eksplisit ke FSA Lab M38: aturan 'balance sheet tidak boleh dikurangkan, hanya flow yang boleh' yang kamu pelajari di mekanik interim adalah ATURAN YANG SAMA dengan kind ini. Di FSA Lab ia diajarkan sebagai logika akuntansi; di sini ia muncul sebagai struktur data. Dua sisi koin yang sama — dan pipeline yang baik menegakkannya di kedua sisi: menolak kurangkan instant di kode, seperti analis menolaknya di kepala.",
        "💡 Intuisi: kind adalah 'tipe data semantik'. Sama seperti kamu tidak menjumlahkan tanggal dengan nama, kamu tidak menjumlahkan instant lintas periode. Kolom kind mengubah intuisi akuntansi menjadi constraint yang bisa dieksekusi mesin.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menentukan kind dari nama concept ('Assets pasti instant'). Berhasil 95% — dan 5% sisanya adalah concept ambigu atau custom yang membuat pipeline diam-diam salah. Aturan struktural ('start' in fakta) benar 100% karena ia membaca apa yang EMITEN tulis, bukan apa yang kamu kira.",
      },
      reference: "kind = 'duration' jika ada 'start', else 'instant'. Sama dengan aturan flow-vs-stock M38.",
    },
    {
      id: "konteks",
      eyebrow: "Langkah 5 · Konsep",
      title: "Konteks: grup vs divisi",
      prose: [
        "Inilah pelajaran dari kisah Citra. Dalam companyfacts, fakta konsolidasian (seluruh grup) dan fakta segmen (per divisi/wilayah) hidup berdampingan dengan concept yang SAMA. Pembedanya ada di atribut context: fakta konsolidasian tidak punya dimensi segmen, fakta segmen membawa dimensi seperti srt:ProductOrServiceAxis atau us-gaap:StatementBusinessSegmentsAxis.",
        "Aturan default yang menyelamatkanmu: untuk analisis level perusahaan (rasio, valuasi, tren), pakai HANYA fakta konsolidasian. Fakta segmen adalah bahan analisis lanjutan (profitabilitas per divisi) — bukan angka utama. Mencampur keduanya = menjumlahkan apel grup dengan apel divisi.",
        "Cara membaca: dua kotak — Konsolidasian (seluruh grup, yang dipakai analisis; contoh Revenues FY2024 = 391.035) vs Segmen (per divisi, contoh 96.500 untuk divisi ritel saja — JANGAN dicampur).",
        "Interpretasi: di JSON sampel lesson ini, semua fakta sudah konsolidasian (disederhanakan untuk belajar). Di data real, biasakan memeriksa: kalau satu concept punya fakta 'kembar' dengan nilai jauh lebih kecil, curigai segmen sebelum curigai error.",
      ],
      figure: {
        svg: KONTEKS_SVG,
        alt: "Konteks konsolidasi vs segmen: fakta yang sama bisa muncul untuk grup dan untuk divisi.",
        caption: "Default analisis = konsolidasian. Segmen = lanjutan, bukan angka utama.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'kalau nilainya aneh, datanya yang salah'",
        type: "pitfall",
        body: "Insting pertama saat angka tidak masuk akal biasanya 'data rusak'. Insting yang benar untuk analis XBRL: 'context apa ini?' Revenue 2024 sebesar 95 miliar bukan data rusak — ia data segmen yang valid, hanya bukan angka yang kamu cari. Diagnosis 'context dulu, data kemudian' menghemat jam debugging.",
      },
      reference: "Fakta kembar bernilai jauh lebih kecil = curigai segmen dulu.",
    },
    {
      id: "lab-parsing",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: bangun tabel fakta kanonis",
      prose: [
        "Waktunya meratakan JSON. Tugasmu: tulis fungsi canon(taxonomy, concept) yang mengubah satu concept menjadi list of dict — tiap dict adalah satu baris tabel kanonis dengan kolom: concept, value, unit, period_end, kind, fy, fp, form, filed, accn. Lalu bangun tabel gabungan untuk Revenues dan Assets.",
        "Cara membaca: total_baris = 15 berarti kamu menangkap semua fakta (10 Revenues + 5 Assets). n_duration = 10 berarti label kind-mu benar (semua Revenues ber-start, semua Assets tidak). Kolom yang terurut alfabetis membuktikan skemamu konsisten.",
        "Interpretasi: tabel ini adalah 'bahasa ibu' seluruh sisa track — FDP4 membersihkannya, FDP5 menghitung rasio darinya, FDP6 memverifikasinya. Setiap bug di sini mengalir ke hilir; setiap ketelitian di sini menghemat sepuluh kali lipat di sana.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `canon(taxonomy, concept)` → list of dict 10 kolom" },
        { id: "t2", text: "Bangun `tabel` gabungan untuk Revenues dan Assets" },
        { id: "t3", text: "Hitung `n_duration` (baris dengan kind duration)" },
        { id: "t4", text: "Cetak total baris, n_duration, dan daftar kolom" },
      ],
      expected: "total_baris=15 | n_duration=10 | kolom=['accn', 'concept', 'filed', 'form', 'fp', 'fy', 'kind', 'period_end', 'unit', 'value']",
      note: {
        title: "Sering salah",
        body: "Lupa bahwa satu concept bisa punya BANYAK unit — loop harus atas node['units'].items(), bukan langsung ['USD']. Di sampel ini Revenues hanya punya USD, tapi kode yang hanya menangani satu unit akan pecah di concept saham (shares) pada lesson berikutnya.",
      },
      hints: [
        "from pyodide.http import open_url; import json; data = json.loads(open_url('/v2/data/fdp-sample.json').read())",
        "node = data['facts'][taxonomy][concept]; loop: for unit, facts in node['units'].items():",
        "kind = 'duration' if 'start' in f else 'instant'; kolom: concept, value=f['val'], unit, period_end=f['end'], kind, fy=f['fy'], fp=f['fp'], form=f['form'], filed=f['filed'], accn=f['accn'].",
      ],
      code: {
        starter: `from pyodide.http import open_url\nimport json\n\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\ndef canon(taxonomy, concept):\n    rows = []\n    node = data["facts"][taxonomy][concept]\n    # TULIS KODEMU: loop semua unit & fakta -> dict 10 kolom\n    return rows\n\n# TULIS KODEMU: tabel gabungan Revenues + Assets\ntabel = []\n\n# TULIS KODEMU: hitung baris duration\nn_duration = \n\nprint(f"total_baris={len(tabel)}")\nprint(f"n_duration={n_duration}")\nprint(f"kolom={sorted(tabel[0].keys())}")`,
        lockLines: 6,
        solution: `from pyodide.http import open_url\nimport json\n\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\ndef canon(taxonomy, concept):\n    rows = []\n    node = data["facts"][taxonomy][concept]\n    for unit, facts in node["units"].items():\n        for f in facts:\n            rows.append({\n                "concept": concept,\n                "value": f["val"],\n                "unit": unit,\n                "period_end": f["end"],\n                "kind": "duration" if "start" in f else "instant",\n                "fy": f["fy"],\n                "fp": f["fp"],\n                "form": f["form"],\n                "filed": f["filed"],\n                "accn": f["accn"],\n            })\n    return rows\n\ntabel = []\nfor concept in ["Revenues", "Assets"]:\n    tabel.extend(canon("us-gaap", concept))\n\nn_duration = sum(1 for r in tabel if r["kind"] == "duration")\n\nprint(f"total_baris={len(tabel)}")\nprint(f"n_duration={n_duration}")\nprint(f"kolom={sorted(tabel[0].keys())}")`,
        checks: [
          { kind: "equal", task: "t2", name: "tabel", value: 15, label: "`tabel` 15 baris", msg: "10 fakta Revenues + 5 fakta Assets. Kurang dari itu = ada unit/fakta yang terlewat." },
          { kind: "equal", task: "t3", name: "n_duration", value: 10, label: "`n_duration` = 10", msg: "Semua 10 Revenues ber-kind duration; 5 Assets instant." },
          { kind: "stdout_matches", task: "t4", pattern: "total_baris=15", label: "`print` menampilkan total", msg: "Baris pertama: total_baris=15." },
          { kind: "stdout_matches", task: "t4", pattern: "n_duration=10", label: "`print` menampilkan n_duration", msg: "Baris kedua: n_duration=10." },
        ],
      },
      reference: "Tabel kanonis = 10 kolom seragam. kind dari struktur ('start'), bukan hafalan.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Parsing yang baik tidak 'membersihkan' data — ia 'memberi label' data. Tabel kanonis menyimpan SEMUA fakta termasuk duplikat dan segmen; yang ia tambahkan adalah kolom kind dan context sehingga keputusan 'pakai yang mana' bisa dibuat eksplisit di downstream, bukan terkubur di logika parsing.",
        "💡 Aturan struktural mengalahkan daftar hafalan. 'duration jika ada start' bekerja untuk concept yang belum pernah kamu dengar, dalam taksonomi yang belum pernah kamu buka, untuk emiten yang belum lahir saat kodemu ditulis. Hafalan concept bekerja sampai concept berikutnya berubah nama.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: parser adalah penerjemah, bukan editor",
        body: "Penerjemah yang baik tidak membuang kalimat yang sulit — ia menerjemahkannya setia dan menandai ambiguitasnya. Parser yang membuang 'fakta aneh' diam-diam (duplikat, segmen, restatement) sedang berbohong kepada analisnya. Tugas parser: ratakan semuanya, beri label jujur (kind, context, filed), dan biarkan FDP4 yang memutuskan dengan aturan eksplisit. Kejujuran di hulu = kepercayaan di hilir.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Fakta mana yang dipakai? Peta seleksi",
      prose: [
        "Setelah tabel kanonis jadi, pertanyaan berikutnya selalu sama: dari banyak fakta satu concept, mana yang dipakai? Peta ini menjawabnya — dan FDP4 akan mengotomatiskannya.",
        "Skenario 1 — Butuh deret tahunan untuk tren. Kondisi: analisis 5 tahun. Keputusan: filter form=10-K, fp=FY, kind=duration (untuk flow). Abaikan kuartalan dan fakta tanpa frame.",
        "Skenario 2 — Butuh angka 'terakhir dan paling benar'. Kondisi: satu nilai terkini. Keputusan: di antara fakta yang periodenya sama, pilih filed paling baru (restatement menang). Jangan pilih yang pertama ketemu.",
        "Skenario 3 — Butuh angka kuartal untuk seasonality. Kondisi: analisis kuartalan. Keputusan: filter form=10-Q, fp=Q1..Q4 — dan ingat Q4 sering hanya ada di 10-K tahunan (fp=Q4, form=10-K), bukan di 10-Q.",
        "Skenario 4 — Angka terlihat 'kembar tapi beda jauh'. Kondisi: dua fakta concept sama, nilai beda 4x lipat. Keputusan: cek context — kemungkinan satu konsolidasian, satu segmen. Pilih konsolidasian untuk analisis perusahaan.",
        "Aturan praktis 10 detik: tentukan dulu MAU APA (tren tahunan? angka terkini? kuartalan?), baru filter. Filter tanpa tujuan = mengambil yang pertama ketemu = bug Citra.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memfilter hanya berdasarkan fy dan fp tanpa mengecek form. Fakta FY2023 bisa muncul di 10-K 2023 (asli) dan di 10-K 2024 (restatement komparatif) — fy dan fp-nya sama persis! Pembedanya hanya filed/accn. Inilah kenapa kolom provenance (filed, accn) bukan aksesori, melainkan kunci seleksi.",
      },
      reference: "Tujuan dulu, filter kemudian. filed/accn = kunci memilih di antara fakta kembar.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: buru restatement FY2023",
      prose: [
        "Di tabel kanonismu ada dua fakta Revenues FY2023: satu dari 10-K 2023 (filed 2023-11-03, nilai 383.285.000.000) dan satu dari 10-K 2024 (filed 2024-11-01, nilai 383.300.000.000). Yang kedua adalah restatement — angka komparatif yang dikoreksi setahun kemudian.",
        "Tugas: dari tabel kanonis, saring kandidat (concept Revenues, fy 2023, fp FY), lalu pilih yang filed-nya paling baru dengan max(). Cetak nilai, tanggal filed, dan accn-nya.",
        "Interpretasi: selisihnya kecil (15 juta dari 383 miliar — 0,004%), tapi mekanismenya yang penting. Di dunia nyata, restatement bisa mengubah laba dari positif menjadi negatif. Pipeline yang tidak mengenal filed akan memakai angka basi selamanya — dan tidak ada yang memberi tahu.",
      ],
      tasks: [
        { id: "t1", text: "Saring `kandidat`: Revenues, fy 2023, fp FY" },
        { id: "t2", text: "Pilih `terbaru` dengan `max()` atas kunci `filed`" },
        { id: "t3", text: "Cetak nilai, filed, dan accn" },
      ],
      expected: "val=383300000000 | filed=2024-11-01 | accn=0000320187-24-000070",
      hints: [
        "Bangun tabel dulu dengan fungsi canon dari lab sebelumnya (salin).",
        "kandidat = [r for r in tabel if r['concept']=='Revenues' and r['fy']==2023 and r['fp']=='FY']",
        "terbaru = max(kandidat, key=lambda r: r['filed']) — string tanggal ISO bisa dibandingkan langsung.",
      ],
      code: {
        starter: `from pyodide.http import open_url\nimport json\n\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\ndef canon(taxonomy, concept):\n    rows = []\n    node = data["facts"][taxonomy][concept]\n    for unit, facts in node["units"].items():\n        for f in facts:\n            rows.append({\n                "concept": concept, "value": f["val"], "unit": unit,\n                "period_end": f["end"],\n                "kind": "duration" if "start" in f else "instant",\n                "fy": f["fy"], "fp": f["fp"], "form": f["form"],\n                "filed": f["filed"], "accn": f["accn"],\n            })\n    return rows\n\ntabel = canon("us-gaap", "Revenues")\n\n# TULIS KODEMU: saring kandidat FY2023\nkandidat = \n\n# TULIS KODEMU: pilih filed terbaru\nterbaru = \n\nprint(f"val={terbaru['value']} | filed={terbaru['filed']} | accn={terbaru['accn']}")`,
        lockLines: 20,
        solution: `from pyodide.http import open_url\nimport json\n\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\ndef canon(taxonomy, concept):\n    rows = []\n    node = data["facts"][taxonomy][concept]\n    for unit, facts in node["units"].items():\n        for f in facts:\n            rows.append({\n                "concept": concept, "value": f["val"], "unit": unit,\n                "period_end": f["end"],\n                "kind": "duration" if "start" in f else "instant",\n                "fy": f["fy"], "fp": f["fp"], "form": f["form"],\n                "filed": f["filed"], "accn": f["accn"],\n            })\n    return rows\n\ntabel = canon("us-gaap", "Revenues")\n\n# Saring kandidat FY2023\nkandidat = [r for r in tabel if r["concept"] == "Revenues" and r["fy"] == 2023 and r["fp"] == "FY"]\n\n# Pilih filed terbaru\nterbaru = max(kandidat, key=lambda r: r["filed"])\n\nprint(f"val={terbaru['value']} | filed={terbaru['filed']} | accn={terbaru['accn']}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kandidat", value: 2, label: "`kandidat` = 2 fakta", msg: "Dua fakta FY2023: asli (2023-11-03) dan restatement (2024-11-01)." },
          { kind: "equal", task: "t2", name: "terbaru", value: "0000320187-24-000070", label: "`terbaru` = restatement", msg: "max atas filed memilih accn 2024-11-01 — fakta yang dikoreksi." },
          { kind: "stdout_matches", task: "t3", pattern: "val=383300000000", label: "`print` menampilkan nilai restatement", msg: "Nilai restatement: 383300000000." },
        ],
      },
      reference: "Restatement terdeteksi dari filed, bukan dari nilai. max(filed) = angka paling benar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Satu concept bisa punya puluhan fakta — 'ambil yang pertama cocok' adalah bug, bukan strategi.",
        "Units: USD (moneter), shares (lembar saham), pure (murni). Baca kunci units dulu, jangan hardcode.",
        "kind dari struktur: 'duration' jika ada 'start', else 'instant' — sama dengan aturan flow-vs-stock M38.",
        "Konteks: default analisis = konsolidasian; fakta 'kembar bernilai kecil' = curigai segmen.",
        "Tabel kanonis 10 kolom; filed/accn adalah kunci memilih di antara fakta kembar (restatement).",
      ],
      next: { label: "FDP4 — Cleaning: Restatement, Duplikat, dan Skala", href: "/v2/learn/fdp4-cleaning" },
      quiz: [
        {
          q: "Skrip mengambil fakta 'Revenues' pertama yang ketemu dan mendapat angka 95 miliar (seharusnya 391 miliar). Diagnosis paling mungkin?",
          options: [
            { text: "Tahun fiskalnya salah", why: "Salah tahun mengubah angka sedikit (tren), bukan 4x lipat." },
            { text: "Data EDGAR-nya rusak", why: "Jarang sekali. Insting pertama harus ke context, bukan ke data." },
            { text: "Skrip mengambil fakta segmen, bukan konsolidasian", why: "Tepat: concept sama, context beda — seperti kisah Citra. Nilai jauh lebih kecil = curigai segmen.", correct: true },
            { text: "Unit-nya salah (shares bukan USD)", why: "Mungkin tapi kurang khas: beda unit biasanya beda orde lebih ekstrem atau KeyError." }
          ],
        },
        {
          q: "Aturan struktural menentukan kind (instant/duration) adalah…",
          options: [
            { text: "'duration' jika fakta punya kunci 'start', else 'instant'", why: "Tepat: membaca apa yang emiten tulis, bukan yang kita kira. Berlaku universal.", correct: true },
            { text: "Lihat form: 10-K = duration, 10-Q = instant", why: "Salah total: form menyatakan jenis filing, bukan jenis period." },
            { text: "Lihat unit: USD = duration, shares = instant", why: "Unit menyatakan satuan, bukan dimensi waktu." },
            { text: "Lihat nama concept: 'Assets' pasti instant", why: "Hafalan — gagal untuk concept ambigu/custom." }
          ],
        },
        {
          q: "Dua fakta Revenues FY2023: filed 2023-11-03 (383.285M) dan filed 2024-11-01 (383.300M). Mana yang dipakai untuk 'angka paling benar'?",
          options: [
            { text: "Rata-ratanya", why: "Merata-ratakan dua versi kebenaran menghasilkan versi ketiga yang tidak pernah dilaporkan." },
            { text: "Yang nilainya lebih besar", why: "Kebenaran tidak ditentukan oleh besar-kecilnya angka." },
            { text: "Yang 2023-11-03 — filing aslinya", why: "Itu angka basi; yang lebih baru adalah koreksinya." },
            { text: "Yang 2024-11-01 — restatement dari filing lebih baru", why: "Tepat: max(filed) = angka terkoreksi. Inilah kenapa provenance bukan aksesori.", correct: true }
          ],
        },
        {
          q: "Kenapa tabel kanonis menyimpan SEMUA fakta termasuk duplikat, bukan langsung dibersihkan saat parsing?",
          options: [
            { text: "Karena programmer malas", why: "Bukan kemalasan — ini keputusan desain." },
            { text: "Agar keputusan 'pakai yang mana' dibuat eksplisit di downstream (cleaning), bukan terkubur di parser", why: "Tepat: parser = penerjemah jujur; cleaning = editor beraturan. Mencampur keduanya menyembunyikan keputusan.", correct: true },
            { text: "Karena storage murah", why: "Bukan soal biaya — soal keterlacakan keputusan." },
            { text: "Agar tabel terlihat lengkap", why: "Kelengkapan visual bukan tujuannya; auditabilitas yang menjadi tujuan." }
          ],
        },
        {
          q: "Koneksi lesson ini ke FSA Lab M38 (mekanik interim) adalah…",
          options: [
            { text: "Keduanya memakai Python", why: "Superfisial — koneksinya konseptual, bukan tooling." },
            { text: "Tidak ada — topik berbeda", why: "Ada: keduanya tentang struktur waktu data keuangan." },
            { text: "Aturan 'hanya flow yang boleh dikurangkan/dijumlahkan antar periode' = aturan kind instant vs duration dalam bentuk data", why: "Tepat: M38 mengajarkannya sebagai logika akuntansi, FDP3 sebagai struktur data. Dua sisi koin yang sama.", correct: true },
            { text: "M38 membahas XBRL juga", why: "Tidak — M38 membahas mekanik laporan interim, bukan format data." }
          ],
        },
      ],
    },
  ],
};
