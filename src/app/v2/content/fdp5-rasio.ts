import type { V2Lesson } from "../lib/types";

// Diagram: 16 rasio dalam 4 keluarga.
const RASIO_SVG = `<svg viewBox="0 0 640 240" role="img" aria-label="Enam belas rasio dalam empat keluarga: profitabilitas, likuiditas, solvabilitas, efisiensi.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="10" y="30" width="145" height="180" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="82" y="55" font-size="12" font-weight="700" fill="var(--text)">Profitabilitas</text>
<text x="82" y="78" font-size="10" fill="var(--text-muted)">gross margin</text>
<text x="82" y="96" font-size="10" fill="var(--text-muted)">operating margin</text>
<text x="82" y="114" font-size="10" fill="var(--text-muted)">net margin</text>
<text x="82" y="132" font-size="10" fill="var(--text-muted)">ROE · ROA</text>
<text x="82" y="155" font-size="10" fill="var(--text-muted)">tanya: untung?</text>
<rect x="170" y="30" width="145" height="180" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="242" y="55" font-size="12" font-weight="700" fill="var(--text)">Likuiditas</text>
<text x="242" y="78" font-size="10" fill="var(--text-muted)">current ratio</text>
<text x="242" y="96" font-size="10" fill="var(--text-muted)">quick ratio</text>
<text x="242" y="119" font-size="10" fill="var(--text-muted)">tanya: bisa</text>
<text x="242" y="134" font-size="10" fill="var(--text-muted)">bayar besok?</text>
<rect x="330" y="30" width="145" height="180" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="402" y="55" font-size="12" font-weight="700" fill="var(--text)">Solvabilitas</text>
<text x="402" y="78" font-size="10" fill="var(--text-muted)">D/E · D/A</text>
<text x="402" y="96" font-size="10" fill="var(--text-muted)">interest coverage</text>
<text x="402" y="119" font-size="10" fill="var(--text-muted)">tanya: kuat</text>
<text x="402" y="134" font-size="10" fill="var(--text-muted)">menahan badai?</text>
<rect x="490" y="30" width="140" height="180" rx="10" fill="var(--c4)" opacity="0.22" stroke="var(--c4)" stroke-width="2"/>
<text x="560" y="55" font-size="12" font-weight="700" fill="var(--text)">Efisiensi</text>
<text x="560" y="78" font-size="10" fill="var(--text-muted)">asset turnover</text>
<text x="560" y="96" font-size="10" fill="var(--text-muted)">receivable days</text>
<text x="560" y="114" font-size="10" fill="var(--text-muted)">inventory days</text>
<text x="560" y="132" font-size="10" fill="var(--text-muted)">payable days · CCC</text>
<text x="560" y="155" font-size="10" fill="var(--text-muted)">tanya: cepat?</text>
</g>
</svg>`;

export const fdp5: V2Lesson = {
  slug: "fdp5-rasio",
  track: "Financial Data Pipeline",
  module: "Mesin Rasio",
  title: "FDP5 — Mesin Rasio: 16 Rasio Tanpa Sentuh Kalkulator",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Spreadsheet 16 rasio yang tidak pernah selesai",
      prose: [
        "Sinta, analis junior, diberi tugas menghitung 16 rasio untuk 10 emiten — setiap kuartal. Ia membuka 10 filing PDF, copy-paste 160 angka ke spreadsheet, menulis 160 rumus, lalu menghabiskan dua hari memeriksa apakah rumusnya menunjuk sel yang benar. Kuartal berikutnya: ulangi semuanya dari nol, karena filing-nya baru.",
        "Di kuartal ketiga, ia menemukan bahwa dua kuartal lalu ia salah menunjuk satu sel — net margin satu emiten tercatat 9,3% padahal seharusnya 9,9%. Laporan sudah terlanjur dikirim ke direksi. Bukan karena ia bodoh; karena pekerjaannya memang dirancang untuk gagal: 160 titik sentuh manusia, setiap kuartal.",
        "Twist-nya: pekerjaan Sinta sebenarnya hanya dua baris logika — 'ambil angka X' dan 'bagi dengan Y'. Yang membuatnya mahal adalah 160 kali pengulangan manual atas dua baris itu. Lesson ini mengotomasi kedua baris tersebut: sekali tulis, berlaku untuk semua emiten, semua kuartal.",
        "Dan ada bonusnya: mesin tidak pernah salah menunjuk sel.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: rasio dihitung analis, mesin hanya membantu",
        type: "pitfall",
        body: "Untuk rasio standar, yang benar adalah sebaliknya: mesin menghitung, analis menafsirkan. Waktu analis terlalu mahal untuk dihabiskan sebagai kalkulator yang bisa salah menunjuk sel.",
      },
      reference: "Mesin rasio = pemetaan concept→pos + rumus + konvensi. Tulis sekali, pakai selamanya.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun fungsi yang menghitung 16 rasio non-bank dari tabel fakta kanonis secara otomatis.",
        "(1) Memetakan concept XBRL ke 12 pos laporan keuangan yang dibutuhkan 16 rasio;",
        "(2) Mengimplementasikan 16 rumus rasio dengan denominator dan annualisasi yang benar;",
        "(3) Menerapkan konvensi annualisasi interim (bukan ×4 mentah) dan denominator rata-rata;",
        "(4) Menangani concept yang hilang via decision map fallback — tanpa crash, tanpa mengarang.",
      ],
      tasks: [],
    },
    {
      id: "keluarga",
      eyebrow: "Langkah 3 · Konsep",
      title: "16 Rasio, 4 Keluarga",
      prose: [
        "Enam belas rasio non-bank FSA Lab terbagi dalam empat keluarga — masing-masing menjawab satu pertanyaan. Mesin rasio tidak menghafal 16 rumus acak; ia memahami 4 pertanyaan.",
        "Keluarga Profitabilitas — 'untung?': gross margin (laba bruto ÷ penjualan), operating margin (laba usaha ÷ penjualan), net margin (laba bersih ÷ penjualan), ROE (laba bersih atribusional ÷ rata-rata ekuitas induk), ROA (laba bersih ÷ total aset). Keluarga Likuiditas — 'bisa bayar besok?': current ratio, quick ratio. Keluarga Solvabilitas — 'kuat menahan badai?': D/E, D/A, interest coverage (EBIT ÷ beban bunga). Keluarga Efisiensi — 'cepat?': asset turnover, receivable days, inventory days, payable days, dan CCC (siklus konversi kas).",
        "💡 Intuisi: rasio adalah kalimat, bukan angka. 'ROE 14,66%' adalah kalimat 'setiap Rp100 ekuitas menghasilkan Rp14,66 laba'. Mesin yang baik tidak mencetak angka — ia mencetak kalimat yang bisa diaudit: angka + rumus + sumber.",
        "Cara membaca: empat kotak keluarga, masing-masing berisi anggotanya dan pertanyaan yang dijawabnya.",
        "Interpretasi: saat concept hilang, kamu tahu keluarga mana yang lumpuh — dan bisa memutuskan apakah analisis tetap jalan (mis. quick ratio hilang tapi current ratio ada) atau harus berhenti.",
      ],
      figure: {
        svg: RASIO_SVG,
        alt: "Empat keluarga rasio: profitabilitas, likuiditas, solvabilitas, efisiensi, masing-masing dengan anggotanya.",
        caption: "16 rasio = 4 pertanyaan. Mesin memahami pertanyaan, bukan menghafal rumus.",
      },
      tasks: [],
      reference: "4 keluarga: untung? bisa bayar? kuat? cepat? — 16 rasio menjawabnya.",
    },
    {
      id: "annualisasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Annualisasi — Si Konvensi yang Disangka Perkalian",
      prose: [
        "Rasio profitabilitas atas data interim butuh annualisasi: laba 6 bulan tidak bisa dibandingkan langsung dengan ekuitas 12 bulan. Jebakan klasik: mengalikan mentah ×4 untuk data kuartalan — seolah bisnis berjalan linear sepanjang tahun.",
        "Koneksi eksplisit ke M38 FSA Lab: annualisasi adalah KONVENSI, bukan perkalian. Praktik yang benar: flow × (12 ÷ jumlah_bulan_periode) untuk numerator, dan denominator memakai RATA-RATA (mis. rata-rata ekuitas awal–akhir), bukan saldo akhir. Untuk bisnis musiman, annualisasi mekanis bisa menyesatkan — catat sebagai keterbatasan, jangan sembunyikan.",
        "💡 Intuisi: annualisasi seperti memproyeksikan bayangan. Bayangan 6 bulan digambar 2× lipat — tapi kalau bendanya tidak simetris (musiman), gambarnya meleset. Maklumkan kemelesetannya.",
      ],
      formula: String.raw`\text{ROE}_{\text{annual}} = \frac{\text{NI}_{H1} \times \frac{12}{6}}{(\text{Ekuitas}_{awal} + \text{Ekuitas}_{akhir}) / 2}`,
      formulaNote: "NI_H1 = laba bersih 6 bulan; 12/6 = faktor annualisasi untuk semester; denominator = rata-rata ekuitas (bukan saldo akhir) — karena laba mengalir sepanjang periode sementara ekuitas adalah foto sesaat.",
      tasks: [],
      note: {
        title: "🚨 Mitos: 'annualisasi = kali 4 untuk kuartalan'",
        type: "pitfall",
        body: "Rumus '×4' mengasumsikan bisnis datar sepanjang tahun. Ritel yang 40% labanya di Desember akan terlihat 4× lebih hebat di Q4 bila diannualisasi mentah. Konvensi yang benar: sebutkan faktornya, pakai rata-rata untuk denominator, dan akui musiman.",
      },
      reference: "Annualisasi = konvensi (faktor eksplisit) + denominator rata-rata. Bukan ×4 buta.",
    },
    {
      id: "lab-rasio",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: compute_ratios dengan angka KLBF asli",
      prose: [
        "Fakta di bawah adalah angka KLBF FY2024 yang terverifikasi dari filing asli (satuan: Rupiah penuh). Tugasmu: lengkapi `compute_ratios()` yang mengembalikan 5 rasio kunci. Ini angka nyata — gross margin harus keluar 39,71, persis seperti di benchmark.",
        "Instruksi eksplorasi: setelah lolos, coba ubah `beban_bunga` menjadi 0 dan lihat apa yang terjadi pada interest coverage. Lalu kembalikan. Mesin yang baik tidak crash pada input aneh — ia memberi tahu.",
        "Cara membaca output: dict rasio dalam persen (margin ×2, ROE) dan kelipatan (coverage, hari untuk CCC).",
        "Interpretasi: bila angkamu cocok dengan benchmark sampai 2 desimal, pipeline-mu sudah setara spreadsheet analis — tanpa 160 kali sentuh manusia.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi 5 rumus di `compute_ratios` (margin ×2, ROE, coverage, CCC)" },
        { id: "t2", text: "Jalankan dan pastikan cocok dengan benchmark (toleransi 0,01)" },
        { id: "t3", text: "Eksplorasi: ubah beban_bunga=0, catat perilaku interest_coverage" },
      ],
      expected: "gross_margin=39.71 | net_margin=9.93 | roe=14.66 | coverage=58.94 | ccc=139.95",
      note: {
        title: "Angka acuan (benchmark terverifikasi)",
        body: "gross_margin 39,71 · net_margin 9,93 · roe 14,66 · interest_coverage 58,94× · CCC 139,95 hari. Bila angkamu meleset >0,01 — cek rumus, bukan benchmark.",
      },
      hints: [
        "gross_margin = laba_bruto / penjualan_neto * 100",
        "interest_coverage = laba_usaha / beban_bunga (bukan laba bersih!)",
        "ccc = receivable_days + inventory_days − payable_days; masing-masing = pos / denominator * 365",
      ],
      code: {
        starter: `# Angka KLBF FY2024 terverifikasi (Rp penuh, dari filing asli)\nF = {\n    "penjualan_neto": 32627776108026,\n    "laba_bruto": 12957040191898,\n    "laba_usaha": 4080720255919,\n    "laba_bersih": 3240636626331,\n    "ekuitas_awal": 21418856503057,\n    "ekuitas_akhir": 22788879435410,\n    "beban_bunga": 69234366294,\n    "piutang": 4864547027520,\n    "persediaan": 6501631203212,\n    "utang_usaha": 1892169477879,\n    "beban_pokok": 19670735916128,\n}\n\n# TULIS KODEMU: lengkapi 5 rumus (hasil dalam persen, kecuali coverage & ccc)\ndef compute_ratios(f):\n    r = {}\n    r["gross_margin"] = \n    r["net_margin"] = \n    r["roe"] = \n    r["interest_coverage"] = \n    r["ccc"] = \n    return r\n\nR = compute_ratios(F)\nfor k, v in R.items():\n    print(f"{k}={v:.2f}")`,
        lockLines: 14,
        solution: `# Angka KLBF FY2024 terverifikasi (Rp penuh, dari filing asli)\nF = {\n    "penjualan_neto": 32627776108026,\n    "laba_bruto": 12957040191898,\n    "laba_usaha": 4080720255919,\n    "laba_bersih": 3240636626331,\n    "ekuitas_awal": 21418856503057,\n    "ekuitas_akhir": 22788879435410,\n    "beban_bunga": 69234366294,\n    "piutang": 4864547027520,\n    "persediaan": 6501631203212,\n    "utang_usaha": 1892169477879,\n    "beban_pokok": 19670735916128,\n}\n\ndef compute_ratios(f):\n    r = {}\n    r["gross_margin"] = f["laba_bruto"] / f["penjualan_neto"] * 100\n    r["net_margin"] = f["laba_bersih"] / f["penjualan_neto"] * 100\n    r["roe"] = f["laba_bersih"] / ((f["ekuitas_awal"] + f["ekuitas_akhir"]) / 2) * 100\n    r["interest_coverage"] = f["laba_usaha"] / f["beban_bunga"]\n    r["ccc"] = (f["piutang"] / f["penjualan_neto"] * 365\n                 + f["persediaan"] / f["beban_pokok"] * 365\n                 - f["utang_usaha"] / f["beban_pokok"] * 365)\n    return r\n\nR = compute_ratios(F)\nfor k, v in R.items():\n    print(f"{k}={v:.2f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "R", label: "`R` terdefinisi", msg: "Fungsi compute_ratios harus mengembalikan dict R." },
          { kind: "stdout_matches", task: "t2", pattern: "gross_margin=39\\.71", label: "gross_margin = 39.71", msg: "laba_bruto / penjualan_neto × 100 = 39,71." },
          { kind: "stdout_matches", task: "t2", pattern: "net_margin=9\\.93", label: "net_margin = 9.93", msg: "laba_bersih / penjualan_neto × 100 = 9,93." },
          { kind: "stdout_matches", task: "t2", pattern: "roe=14\\.66", label: "roe = 14.66", msg: "laba_bersih atribusional / rata-rata ekuitas induk × 100 = 14,66." },
          { kind: "stdout_matches", task: "t2", pattern: "interest_coverage=58\\.94", label: "coverage = 58.94", msg: "laba_usaha / beban_bunga = 58,94. Ingat: laba USAHA, bukan laba bersih." },
          { kind: "stdout_matches", task: "t2", pattern: "ccc=139\\.95", label: "ccc = 139.95", msg: "receivable_days + inventory_days − payable_days = 139,95 hari." },
        ],
      },
      reference: "Rumus benar + denominator benar + angka cocok benchmark = mesin rasio jadi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Rasio tak terhitung? Peta fallback",
      prose: [
        "Mesin rasio bertemu dunia nyata: concept hilang, denominator nol, angka negatif. Peta ini menentukan kapan mesin tetap jalan dan kapan ia harus berhenti dengan jujur.",
        "Skenario 1 — Semua input ada. Keputusan: hitung normal. Kasus bahagia.",
        "Skenario 2 — Satu concept hilang tapi padanan ada (FDP4). Keputusan: hitung dengan label 'padanan'. Rasio tetap keluar, kepercayaannya turun satu level.",
        "Skenario 3 — Denominator nol atau negatif (ekuitas negatif, beban bunga nol). Keputusan: JANGAN keluarkan angka — keluarkan label ('N/A: ekuitas negatif', 'N/A: tanpa utang berbunga'). Angka dari pembagian aneh adalah kebohongan yang rapi.",
        "Skenario 4 — Input inti hilang total (tidak ada penjualan). Keputusan: seluruh keluarga profitabilitas dinonaktifkan dengan label 'tak tersedia'. Mesin yang baik tahu kapan diam.",
        "Aturan praktis 10 detik: setiap rasio yang keluar harus bisa menjawab 'dari angka apa, dengan label apa'. Rasio tanpa provenance = rumor.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengeluarkan interest coverage = 'tak hingga' saat beban bunga nol, lalu menampilkannya sebagai prestasi. Tanpa utang berbunga, coverage tidak bermakna — labelnya 'N/A: tanpa utang berbunga', bukan angka.",
      },
      reference: "Hitung bila bisa; label bila tidak; diam bila inti hilang. Jangan mengarang.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: ROE BBRI yang 'turun'",
      prose: [
        "Pipeline-mu menghitung ROE BBRI FY2024 = 18,97% (laba atribusional ÷ ekuitas atribusional akhir). Bank melaporkan ROE 19,01%. Selisih 0,04 pp — di dalam toleransi C2 (±0,5 pp), tapi analis bertanya: 'kenapa tidak persis sama?'",
        "Pertanyaan: (1) Apakah 18,97% salah? (2) Apa kemungkinan penyebab selisihnya? (3) Bagaimana pipeline yang baik merespons?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) Tidak salah — ia benar menurut definisinya (ekuitas akhir). (2) Bank kemungkinan memakai rata-rata ekuitas (awal+akhir ÷ 2) — definisi denominator berbeda, persis seperti gap definisi yang didokumentasikan di FSA Lab (ROE [T] 18,97 vs [B] 19,01). (3) Pipeline tidak 'memperbaiki' angkanya agar sama; ia mencatat definisinya di provenance dan membiarkan C2 (±0,5 pp) menjadi wasit. Inilah kenapa toleransi C2 ada: bukan untuk menutupi bug, melainkan untuk menampung perbedaan definisi yang sah.",
      },
      reference: "Selisih kecil + definisi terdokumentasi = bukan bug. Selisih kecil + definisi misterius = bug.",
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
        "16 rasio = 4 keluarga (untung? bisa bayar? kuat? cepat?) — mesin memahami pertanyaan, bukan menghafal rumus.",
        "Annualisasi interim = konvensi (faktor eksplisit) + denominator rata-rata; bukan ×4 buta.",
        "Interest coverage memakai laba USAHA ÷ beban bunga — bukan laba bersih.",
        "Denominator nol/negatif → label N/A yang jujur, bukan angka ajaib.",
        "Tiap rasio keluar dengan provenance: dari angka apa, dengan label kepercayaan apa.",
      ],
      next: { label: "FDP6 — Capstone: Pipeline End-to-End + Laporan Rekonsiliasi", href: "/v2/learn/fdp6-capstone" },
      quiz: [
        {
          q: "Interest coverage yang benar memakai…",
          options: [
            { text: "Laba bersih ÷ beban bunga", why: "Laba bersih sudah dikurangi bunga — membaginya dengan bunga mencampur numerator yang salah." },
            { text: "Laba usaha (EBIT) ÷ beban bunga", why: "Tepat: coverage mengukur kemampuan laba operasi menutup beban bunga — sebelum bunga itu sendiri dikurangkan.", correct: true },
            { text: "EBITDA ÷ total utang", why: "Itu rasio utang (debt/EBITDA), bukan coverage bunga. Pertanyaannya beda." },
            { text: "Arus kas operasi ÷ beban bunga", why: "Itu cash coverage — rasio yang valid tapi berbeda; interest coverage standar memakai EBIT." },
          ],
        },
        {
          q: "Untuk ROE interim H1, denominator yang benar adalah…",
          options: [
            { text: "Ekuitas akhir periode — paling mudah didapat", why: "Mudah tapi salah secara konseptual: laba mengalir 6 bulan, ekuitas akhir adalah foto sesaat." },
            { text: "Rata-rata ekuitas awal–akhir periode", why: "Tepat (konvensi M38): numerator flow disandingkan dengan denominator yang mewakili sepanjang periode.", correct: true },
            { text: "Ekuitas awal periode — konservatif", why: "Konservatif bukan berarti benar; tetap foto sesaat, hanya dari sisi lain." },
            { text: "Tidak perlu denominator, ROE interim = NI H1 × 2 ÷ ekuitas", why: "Itu annualisasi numerator saja; denominatornya tetap harus rata-rata." },
          ],
        },
        {
          q: "Beban bunga = 0. Interest coverage yang jujur adalah…",
          options: [
            { text: "Tak hingga — secara matematis benar", why: "Matematis benar, makna salah: tanpa utang berbunga, 'kemampuan membayar bunga' tidak bermakna." },
            { text: "'N/A: tanpa utang berbunga'", why: "Tepat: label jujur mengalahkan angka ajaib. Pembaca tahu kenapa kosong.", correct: true },
            { text: "0 — karena tidak ada bunga yang dibayar", why: "Nol berarti 'tidak mampu membayar sama sekali' — kebalikan dari faktanya." },
            { text: "Sama dengan ROE sebagai pengganti", why: "Mengganti rasio dengan rasio lain tanpa label adalah fabrikasi." },
          ],
        },
        {
          q: "Pipeline-mu: ROE 18,97% vs bank 19,01%. Respons yang benar?",
          options: [
            { text: "Ubah rumus agar hasilnya 19,01% — benchmark selalu benar", why: "Mengejar angka benchmark dengan mengubah definisi diam-diam adalah overfitting pipeline." },
            { text: "Catat definisi yang dipakai, biarkan C2 (±0,5 pp) menjadi wasit", why: "Tepat: selisih 0,04 pp dalam toleransi; perbedaan definisi (rata-rata vs akhir) didokumentasikan, bukan disembunyikan.", correct: true },
            { text: "Hapus ROE dari output karena tidak cocok persis", why: "Membuang rasio yang benar menurut definisinya hanya karena beda 0,04 pp adalah perfeksionisme yang merusak." },
            { text: "Laporkan sebagai bug ke tim benchmark", why: "Bukan bug — ini gap definisi yang sah dan sudah didokumentasikan." },
          ],
        },
        {
          q: "CCC 139,95 hari untuk KLBF artinya…",
          options: [
            { text: "KLBF butuh 139,95 hari untuk memproduksi satu batch obat", why: "CCC bukan waktu produksi — melainkan waktu kas terikat." },
            { text: "Kas terikat 139,95 hari dari bayar supplier sampai terima dari pelanggan", why: "Tepat: receivable days + inventory days − payable days = lama kas 'diparkir' di modal kerja.", correct: true },
            { text: "KLBF akan bangkrut dalam 139,95 hari", why: "CCC bukan countdown kebangkrutan; farmasi dengan inventory days 120 wajar karena stok obat." },
            { text: "Semakin kecil CCC semakin buruk", why: "Terbalik: CCC kecil = kas cepat kembali = baik (selama tidak mengorbankan penjualan)." },
          ],
        },
      ],
    },
  ],
};
