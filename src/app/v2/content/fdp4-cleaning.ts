import type { V2Lesson } from "../lib/types";

// Timeline restatement: filing 2023 vs filing 2024 melaporkan angka 2022 berbeda.
const RESTATE_SVG = `<svg viewBox="0 0 620 220" role="img" aria-label="Dua filing melaporkan pendapatan 2022 yang berbeda: filing lama 30,2 juta, filing baru 30,5 juta.">
<g font-family="var(--font-ui)">
<line x1="60" y1="170" x2="580" y2="170" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="60" y="190" font-size="11" fill="var(--text-muted)">2022</text>
<text x="300" y="190" font-size="11" fill="var(--text-muted)">2023</text>
<text x="520" y="190" font-size="11" fill="var(--text-muted)">2024</text>
<rect x="80" y="80" width="120" height="90" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="140" y="108" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle">Filing 2023</text>
<text x="140" y="130" font-size="11" fill="var(--text-muted)" text-anchor="middle">Revenue 2022:</text>
<text x="140" y="150" font-size="14" font-weight="700" fill="var(--text)" text-anchor="middle">30,2 jt</text>
<rect x="420" y="80" width="120" height="90" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="480" y="108" font-size="12" font-weight="600" fill="var(--text)" text-anchor="middle">Filing 2024</text>
<text x="480" y="130" font-size="11" fill="var(--text-muted)" text-anchor="middle">Revenue 2022:</text>
<text x="480" y="150" font-size="14" font-weight="700" fill="var(--text)" text-anchor="middle">30,5 jt</text>
<text x="310" y="60" font-size="12" fill="var(--error)" text-anchor="middle" font-weight="600">yang mana yang benar?</text>
<text x="310" y="200" font-size="10" fill="var(--text-muted)" text-anchor="middle">Keduanya "resmi". Yang baru menang — tapi yang lama harus ditandai.</text>
</g>
<line x1="200" y1="125" x2="420" y2="125" stroke="var(--error)" stroke-width="1.6" stroke-dasharray="6 4"/>
</svg>`;

export const fdp4: V2Lesson = {
  slug: "fdp4-cleaning",
  track: "Financial Data Pipeline",
  module: "Pembersihan Data",
  title: "FDP4 — Cleaning: Restatement, Duplikat, dan Skala",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Angka resmi yang berubah tanpa pemberitahuan",
      prose: [
        "Riko menarik data revenue sebuah emiten dari EDGAR untuk 5 tahun terakhir. Deretnya rapi: 28,1 — 30,2 — 32,1 — 33,0 — 34,4 (juta USD). Ia memasukkannya ke model, menghitung pertumbuhan, dan menulis di laporan: 'revenue tumbuh 8% per tahun.'",
        "Seminggu kemudian, seorang kolega menarik data yang sama — dari filing yang sama, emiten yang sama — dan mendapat 28,1 — 30,5 — 32,1 — 33,0 — 34,4. Selisih 0,3 juta di tahun kedua. Koleganya tidak salah ketik. Riko juga tidak salah ketik.",
        "Twist-nya: keduanya benar — dari filing yang berbeda tahun. Filing 2024 me-restate angka 2022 dari 30,2 menjadi 30,5 (koreksi akuntansi kecil). Riko mengambil angka 2022 dari filing 2023 (versi lama); koleganya dari filing 2024 (versi baru). Tidak ada error, tidak ada warning — hanya dua kebenaran resmi yang berbeda.",
        "Lesson ini tentang aturan yang membuat pipeline selalu mengambil 'kebenaran terakhir': filing terbaru menang, yang lama ditandai, dan setiap angka membawa kartu identitasnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: satu concept = satu angka",
        type: "pitfall",
        body: "Satu concept XBRL (mis. us-gaap:Revenues) bisa punya puluhan fakta: per tahun, per segmen, per filing, sebelum dan sesudah restatement. Mengambil 'angka pertama yang ketemu' adalah cara tercepat mendapat angka yang salah dengan percaya diri.",
      },
      reference: "Cleaning = dari banyak fakta menjadi satu deret kebenaran. Aturan: filing terbaru menang — khusus untuk concept + periode + unit yang SAMA dalam konteks restatement (bukan overwrite global); tandai restatement; satukan skala.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membersihkan fakta XBRL mentah menjadi deret kanonis yang siap dihitung.",
        "(1) Menjelaskan perbedaan `end` (periode yang dilaporkan) vs `filed` (kapan dilaporkan) dan kenapa `filed` yang menentukan;",
        "(2) Menerapkan aturan 'filing terbaru menang' untuk menyelesaikan duplikat dan restatement;",
        "(3) Menyeragamkan skala dan mata uang (jebakan satuan by design) tanpa membulatkan angka mentah;",
        "(4) Menambahkan provenance (accn + filed + form) ke setiap angka output — tanpa kecuali.",
      ],
      tasks: [],
    },
    {
      id: "restatement",
      eyebrow: "Langkah 3 · Konsep",
      title: "Restatement — Si Pengubah Masa Lalu",
      prose: [
        "Restatement adalah revisi resmi atas angka periode lalu. Emiten menerbitkan 10-K/A (amendemen) atau menyajikan ulang komparatif di filing tahun berikutnya. Angka 2022 di filing 2024 bisa berbeda dari angka 2022 di filing 2023 — dan keduanya 'resmi'.",
        "Dua tanggal yang wajib dibedakan: `end` = akhir periode yang dilaporkan (31 Des 2022), `filed` = tanggal filing diserahkan ke SEC. Untuk deret waktu, yang menentukan adalah `filed` terbaru — bukan `end`. Analis yang mengurutkan berdasarkan `end` saja akan mencampur versi lama dan baru tanpa sadar.",
        "💡 Intuisi: bayangkan koran. `end` adalah tanggal kejadian beritanya; `filed` adalah tanggal koran terbit. Kalau ada ralat, kamu baca koran terbitan terbaru — bukan koran lama yang memberitakan kejadian yang sama.",
        "Cara membaca: dua kotak filing (2023 dan 2024) melaporkan revenue 2022 yang berbeda — 30,2 vs 30,5 juta. Garis putus-putus merah menandai konfliknya.",
        "Interpretasi: konflik ini normal dan legal. Pipeline yang benar tidak memilih 'yang pertama ketemu' — ia memilih `filed` terbaru dan menandai periode itu sebagai restated, supaya analis tahu angkanya pernah berubah.",
      ],
      figure: {
        svg: RESTATE_SVG,
        alt: "Filing 2023 melaporkan revenue 2022 sebesar 30,2 juta; filing 2024 me-restate menjadi 30,5 juta.",
        caption: "Satu periode, dua kebenaran resmi. Filing terbaru menang.",
      },
      formula: String.raw`\text{clean}(c, p) = \text{fakta dengan } \max(\text{filed}) \text{ untuk concept } c \text{, periode } p`,
      formulaNote: "c = concept (mis. us-gaap:Revenues), p = periode (end). Untuk tiap pasangan concept–periode, ambil fakta dengan filed terbesar. Bila ada >1 fakta untuk pasangan yang sama → tandai is_restated = True.",
      tasks: [],
      note: {
        title: "🚨 Mitos: 'ambil yang pertama' cukup baik",
        type: "pitfall",
        body: "Urutan fakta di companyfacts JSON tidak menjamin apa-apa. Filing lama bisa muncul setelah filing baru. Satu-satunya penentu yang sah adalah perbandingan tanggal `filed` — eksplisit, bukan urutan.",
      },
      reference: "end = kapan periodenya; filed = kapan dilaporkannya. Bersihkan berdasarkan filed.",
    },
    {
      id: "skala",
      eyebrow: "Langkah 4 · Konsep",
      title: "Skala & Mata Uang — Si Pembunuh Diam-Diam",
      prose: [
        "Jebakan paling mahal di pipeline keuangan bukan restatement — melainkan satuan. EDGAR memakai `units`: USD, USD-juta tidak ada (EDGAR memakai USD penuh), tapi shares, pure, dan USD bisa tercampur. Di IDX, filing memakai jutaan Rupiah sementara benchmark bisa memakai Rupiah penuh. Satu angka 32.627.776 vs 32.627.776.108.026 — beda 1.000.000x, keduanya 'benar' di skalanya masing-masing.",
        "Aturan keras: normalisasi SEMUA angka ke satu satuan kanonis (disarankan: satuan penuh, mis. Rupiah penuh / USD penuh) segera setelah parsing — sebelum perbandingan apa pun. Dan jangan pernah membulatkan angka mentah: 32.627.776,11 juta × 1.000.000 ≠ 32.627.776.108.026 persis. Checker C1 menuntut eksak; pembulatan adalah kegagalan yang terlihat seperti ketelitian.",
        "💡 Intuisi: satuan adalah mata uang kedua. Kamu tidak akan menjumlahkan Rp10.000 + $5 tanpa konversi kurs — jangan menjumlahkan 'juta' + 'penuh' tanpa konversi skala.",
        "💡 Gunakan Decimal (bukan float) untuk uang. Fakta pahit Python: 4218874269.523 * 1_000_000 dalam float menghasilkan 4218874269523.0005 — bukan integer eksak. Checker reconcile.py memakai Decimal persis karena pelajaran ini.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membulatkan 'agar rapi' di tengah pipeline. Kerapian adalah urusan presentasi (format di laporan akhir), bukan urusan data mentah. Sekali dibulatkan, presisi hilang permanen — dan C1 akan menghukummu dengan benar.",
      },
      reference: "Normalisasi satuan dulu, hitung kemudian, bulatkan hanya di presentasi. Decimal untuk uang.",
    },
    {
      id: "provenance",
      eyebrow: "Langkah 5 · Konsep",
      title: "Provenance — Kartu Identitas Setiap Angka",
      prose: [
        "Provenance adalah jawaban atas pertanyaan 'angka ini dari mana?' — untuk setiap angka, tanpa kecuali. Di EDGAR: `accn` (nomor akses filing) + `filed` (tanggal) + `form` (10-K/10-Q). Di IDX: nama filing + halaman + tanggal.",
        "Kenapa wajib? Karena tiga bulan dari sekarang, seseorang (mungkin kamu sendiri) akan bertanya 'kenapa revenue 2022 kita 30,5 bukan 30,2?' — dan satu-satunya jawaban yang bisa dipertahankan adalah 'accn 0002, filed 2024-02-09, form 10-K'. Tanpa provenance, angka hanyalah rumor yang diformat rapi.",
        "💡 Intuisi: provenance adalah struk audit untuk data. Akuntan tidak mencatat jurnal tanpa bukti transaksi; pipeline tidak mengeluarkan angka tanpa bukti filing.",
      ],
      tasks: [],
      reference: "Tiap angka output = nilai + accn + filed + form. Tanpa kecuali (C4).",
    },
    {
      id: "lab-clean",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: pembersih deret revenue",
      prose: [
        "Fakta mentah di bawah berantakan: ada duplikat antar filing, satu restatement, dan dua skala berbeda (USD vs juta USD). Tugasmu: tulis `bersihkan()` yang menghasilkan satu deret bersih per periode.",
        "Aturan: (1) untuk tiap `end`, pilih fakta dengan `filed` terbaru; (2) konversi semua ke USD penuh (juta USD × 1.000.000); (3) `is_restated=True` bila suatu periode punya >1 fakta dari filing berbeda; (4) kembalikan juga provenance (accn) tiap periode.",
        "Cara membaca output: dict bersih memetakan end → nilai USD penuh; dict restated menandai mana yang pernah direvisi; dict sumber menunjukkan accn pemenang tiap periode.",
        "Interpretasi: inilah inti FDP4 — dari 6 fakta berantakan menjadi 3 angka kebenaran + 3 kartu identitas. Semua lesson berikutnya berdiri di atas fungsi ini.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `ke_usd_penuh`: konversi (val, unit) ke USD penuh" },
        { id: "t2", text: "Lengkapi `bersihkan`: pilih filed terbaru per end, tandai restatement, catat accn" },
        { id: "t3", text: "Cetak deret bersih + flag restatement + provenance" },
      ],
      expected: "bersih={'2022-12-31': 30500000, '2023-12-31': 32100000, '2024-12-31': 33000000} | restated_2022=True",
      note: {
        title: "Sering salah",
        body: "Membandingkan string tanggal secara leksikografis sebenarnya aman untuk format YYYY-MM-DD (urutan leksikografis = urutan kronologis), tapi jangan mengandalkannya untuk format lain. Di sini formatnya konsisten, jadi max() pada string filed sah.",
      },
      hints: [
        "ke_usd_penuh: jika unit == 'juta USD', kalikan 1_000_000. Gunakan int().",
        "Kelompokkan fakta per 'end' dulu (dict of list), lalu pilih max(f['filed']) per kelompok.",
        "is_restated: len(kelompok) > 1 — bukan soal nilainya berubah, tapi soal ada >1 filing.",
      ],
      code: {
        starter: `FAKTA = [\n    {"concept": "Revenues", "val": 30.2, "unit": "juta USD", "end": "2022-12-31", "filed": "2023-02-10", "form": "10-K", "accn": "0001"},\n    {"concept": "Revenues", "val": 30500000, "unit": "USD", "end": "2022-12-31", "filed": "2024-02-09", "form": "10-K", "accn": "0002"},\n    {"concept": "Revenues", "val": 32.1, "unit": "juta USD", "end": "2023-12-31", "filed": "2024-02-09", "form": "10-K", "accn": "0002"},\n    {"concept": "Revenues", "val": 33.0, "unit": "juta USD", "end": "2024-12-31", "filed": "2025-02-07", "form": "10-K", "accn": "0003"},\n    {"concept": "Revenues", "val": 33.0, "unit": "juta USD", "end": "2024-12-31", "filed": "2025-02-07", "form": "10-K", "accn": "0003"},\n]\n\n# TULIS KODEMU: konversi ke USD penuh (int)\ndef ke_usd_penuh(val, unit):\n    \n\n# TULIS KODEMU: bersihkan -> (bersih, restated, sumber)\n# bersih: {end: nilai_usd_penuh}, restated: {end: bool}, sumber: {end: accn}\ndef bersihkan(fakta):\n    \n\nbersih, restated, sumber = bersihkan(FAKTA)\nprint("bersih:", bersih)\nprint("restated_2022:", restated["2022-12-31"])\nprint("sumber_2022:", sumber["2022-12-31"])`,
        lockLines: 7,
        solution: `FAKTA = [\n    {"concept": "Revenues", "val": 30.2, "unit": "juta USD", "end": "2022-12-31", "filed": "2023-02-10", "form": "10-K", "accn": "0001"},\n    {"concept": "Revenues", "val": 30500000, "unit": "USD", "end": "2022-12-31", "filed": "2024-02-09", "form": "10-K", "accn": "0002"},\n    {"concept": "Revenues", "val": 32.1, "unit": "juta USD", "end": "2023-12-31", "filed": "2024-02-09", "form": "10-K", "accn": "0002"},\n    {"concept": "Revenues", "val": 33.0, "unit": "juta USD", "end": "2024-12-31", "filed": "2025-02-07", "form": "10-K", "accn": "0003"},\n    {"concept": "Revenues", "val": 33.0, "unit": "juta USD", "end": "2024-12-31", "filed": "2025-02-07", "form": "10-K", "accn": "0003"},\n]\n\ndef ke_usd_penuh(val, unit):\n    if unit == "juta USD":\n        return int(round(val * 1_000_000))\n    return int(val)\n\ndef bersihkan(fakta):\n    kelompok = {}\n    for f in fakta:\n        kelompok.setdefault(f["end"], []).append(f)\n    bersih, restated, sumber = {}, {}, {}\n    for end, fs in kelompok.items():\n        pemenang = max(fs, key=lambda f: f["filed"])\n        bersih[end] = ke_usd_penuh(pemenang["val"], pemenang["unit"])\n        restated[end] = len({f["filed"] for f in fs}) > 1\n        sumber[end] = pemenang["accn"]\n    return bersih, restated, sumber\n\nbersih, restated, sumber = bersihkan(FAKTA)\nprint("bersih:", bersih)\nprint("restated_2022:", restated["2022-12-31"])\nprint("sumber_2022:", sumber["2022-12-31"])`,
        checks: [
          { kind: "equal", task: "t1", name: "bersih", value: {"2022-12-31": 30500000, "2023-12-31": 32100000, "2024-12-31": 33000000}, label: "deret bersih tepat", msg: "2022 harus 30.500.000 (versi restatement dari filing terbaru), bukan 30.200.000." },
          { kind: "equal", task: "t2", name: "restated", value: {"2022-12-31": true, "2023-12-31": false, "2024-12-31": false}, label: "flag restatement tepat", msg: "Hanya 2022 yang punya >1 filing berbeda. Duplikat identik (2024, accn sama) bukan restatement." },
          { kind: "equal", task: "t2", name: "sumber", value: {"2022-12-31": "0002", "2023-12-31": "0002", "2024-12-31": "0003"}, label: "provenance tepat", msg: "Tiap periode membawa accn filing pemenang." },
          { kind: "stdout_matches", task: "t3", pattern: "restated_2022: True", label: "print flag restatement", msg: "Baris kedua: restated_2022: True." },
          { kind: "stdout_matches", task: "t3", pattern: "sumber_2022: 0002", label: "print provenance", msg: "Baris ketiga: sumber_2022: 0002." },
        ],
      },
      reference: " filed terbaru menang; skala diseragamkan; restatement ditandai; provenance dicatat.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Concept tidak ada? Peta fallback",
      prose: [
        "Taksonomi berubah antar tahun; tag us-gaap bisa hilang atau diganti. Pipeline produksi tidak boleh crash karena satu concept hilang — ia butuh peta fallback yang eksplisit.",
        "Skenario 1 — Concept utama ada (us-gaap:Revenues). Keputusan: pakai langsung. Tidak perlu kreatif.",
        "Skenario 2 — Concept utama hilang, padanan ada (us-gaap:SalesRevenueNet). Keputusan: pakai padanan, catat di provenance bahwa ini fallback. Contoh nyata: beberapa emiten memakai SalesRevenueNet, bukan Revenues.",
        "Skenario 3 — Keduanya hilang, tapi komponen ada (bisa dijumlah dari segmen). Keputusan: agregasi dengan label 'teragregasi', bukan 'dilaporkan'. Bedakan di output.",
        "Skenario 4 — Tidak ada sama sekali. Keputusan: serahkan dengan label 'tak tersedia' — JANGAN mengarang dari pos lain yang mirip. Angka kosong yang jujur lebih baik dari angka penuh yang bohong.",
        "Aturan praktis 10 detik: fallback boleh, tapi setiap fallback menurunkan tingkat kepercayaan satu level (dilaporkan → padanan → teragregasi → tak tersedia). Turunkan labelnya, jangan sembunyikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Hardcode satu concept lalu heran kenapa pipeline mati tiap Januari (taksonomi baru). Daftar fallback adalah bagian dari kode, bukan catatan tempel.",
      },
      reference: "Fallback berlapis + label kepercayaan. Menyerah itu sah; mengarang tidak.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: revenue KLBF yang 'berubah'",
      prose: [
        "Kamu membangun pipeline untuk KLBF. Dari AR 2024, penjualan neto 2024 = Rp32.627.776.108.026. Tahun depan AR 2025 terbit dan menyajikan ulang komparatif 2024 menjadi Rp32.630.000.000.000 (koreksi kecil). Pipeline-mu yang lama (tanpa logika filed) masih menyimpan 32.627.776.108.026 untuk 2024.",
        "Pertanyaan: (1) Berapa nilai yang benar untuk deret 2024 menurut aturan FDP4? (2) Flag apa yang harus menyertainya? (3) Apa yang harus terjadi pada laporan rekonsiliasi lama yang memakai angka lama?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) Rp32.630.000.000.000 — filed terbaru (AR 2025) menang. (2) is_restated=True untuk 2024, dengan provenance menunjuk AR 2025. (3) Laporan lama TIDAK diubah diam-diam: ia tetap valid sebagai snapshot ('menurut filing yang tersedia saat itu'), tapi benchmark.csv perlu refresh — inilah kenapa desain FDP mencatat 'benchmark statis perlu refresh bila filing diamendemen'.",
      },
      reference: "Kebenaran data ada tanggalnya. Snapshot lama tetap sah sebagai snapshot.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Cleaning = satu deret kebenaran dari banyak fakta: filed terbaru menang, restatement ditandai, skala diseragamkan.",
        "`end` = periodenya; `filed` = kapan dilaporkannya. Keputusan selalu berdasarkan filed.",
        "Normalisasi satuan dulu (Decimal, bukan float); bulatkan hanya di presentasi, bukan di data mentah.",
        "Tiap angka wajib bawa provenance (accn + filed + form) — tanpa kecuali.",
        "Fallback concept berlapis dengan label kepercayaan; menyerah itu sah, mengarang tidak.",
      ],
      next: { label: "FDP5 — Mesin Rasio: 16 Rasio Tanpa Sentuh Kalkulator", href: "/v2/learn/fdp5-rasio" },
      quiz: [
        {
          q: "Filing 2023 melaporkan revenue 2022 = 30,2 jt; filing 2024 me-restate menjadi 30,5 jt. Berapa nilai deret 2022 yang benar?",
          options: [
            { text: "30,2 jt — filing pertama adalah sumber asli", why: "Sumber asli bukan berarti sumber terakhir. Restatement adalah koreksi resmi atas angka lama." },
            { text: "30,5 jt — filed terbaru menang, dengan flag restated", why: "Tepat: aturan FDP4 — max(filed) menentukan, dan periode ditandai is_restated=True.", correct: true },
            { text: "Rata-rata keduanya: 30,35 jt", why: "Tidak ada konsep 'rata-rata kebenaran' — yang ada hanya versi terbaru yang resmi." },
            { text: "Keduanya disimpan sebagai dua deret terpisah", why: "Deret kanonis harus tunggal per periode; versi lama hidup di provenance, bukan sebagai deret tandingan." },
          ],
        },
        {
          q: "Kenapa `filed` (bukan `end`) yang menentukan dalam deduplikasi?",
          options: [
            { text: "Karena `end` sering salah ketik di filing", why: "`end` justru relatif stabil; masalahnya bukan typo melainkan versi." },
            { text: "Karena `filed` menandai versi kebenaran: laporan terbaru merevisi yang lama", why: "Tepat: `end` = periodenya (tetap), `filed` = versinya (bergerak). Kebenaran terakhir = filed terbesar.", correct: true },
            { text: "Karena SEC mengurutkan JSON berdasarkan `filed`", why: "Urutan JSON tidak dijamin; justru itu alasan kita harus membandingkan filed secara eksplisit." },
            { text: "Karena `end` tidak ada di companyfacts", why: "`end` selalu ada — ia bagian dari identitas fakta bersama concept dan unit." },
          ],
        },
        {
          q: "Script-mu menyimpan revenue sebagai 32627776.11 (juta) lalu ×1.000.000 untuk C1. Hasilnya GAGAL padahal 'kelihatannya benar'. Diagnosisnya?",
          options: [
            { text: "Benchmark-nya yang salah", why: "Benchmark terverifikasi dari filing asli; menuduh benchmark adalah jalan terakhir, bukan pertama." },
            { text: "Pembulatan 2 desimal menghancurkan presisi — C1 menuntut eksak", why: "Tepat: 32627776.11 × 1e6 = 32627776110000 ≠ 32627776108026. Jangan bulatkan angka mentah; normalisasi ≠ pembulatan.", correct: true },
            { text: "Harusnya pakai float, bukan Decimal", why: "Terbalik: float justru lebih parah (4218874269.523 × 1e6 tidak eksak dalam float). Decimal yang benar." },
            { text: "C1 terlalu ketat dan harus dilonggarkan", why: "C1 eksak karena membandingkan angka yang dilaporkan, bukan estimasi. Melonggarkannya menyembunyikan bug satuan." },
          ],
        },
        {
          q: "Concept us-gaap:Revenues tidak ada untuk sebuah emiten. Langkah pertama yang benar menurut peta fallback?",
          options: [
            { text: "Langsung pakai pos 'Total revenues' dari laporan laba rugi teks", why: "Itu keluar dari XBRL ke parsing teks — jalur berbeda dengan keandalan berbeda. Fallback XBRL dulu." },
            { text: "Coba padanan taksonomi (mis. SalesRevenueNet), catat sebagai fallback di provenance", why: "Tepat: skenario 2 — padanan resmi dengan label kepercayaan turun satu level.", correct: true },
            { text: "Isi dengan 0 dan lanjutkan pipeline", why: "Nol adalah angka yang berbohong paling rapi. Label 'tak tersedia' jauh lebih jujur." },
            { text: "Ambil dari emiten lain yang se-industri", why: "Itu fabrikasi data — pelanggaran paling fatal dalam pipeline keuangan." },
          ],
        },
        {
          q: "Apa isi provenance minimal untuk satu angka dari EDGAR?",
          options: [
            { text: "Nama emiten dan tahunnya", why: "Terlalu kasar — tidak bisa menjawab 'filing versi mana?' saat ada restatement." },
            { text: "accn + filed + form", why: "Tepat: nomor akses filing (versi persis), tanggal penyerahan, dan jenis form. Tiga ini merekonstruksi 'angka ini dari mana' sepenuhnya.", correct: true },
            { text: "URL halaman SEC", why: "URL bisa berubah; accn adalah identifier permanen yang lebih stabil." },
            { text: "Nama analis yang menarik datanya", why: "Itu provenance proses, bukan provenance data. Yang ditanya C4 adalah asal angka." },
          ],
        },
      ],
    },
  ],
};
