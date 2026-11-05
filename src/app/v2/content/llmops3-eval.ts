import type { V2Lesson } from "../lib/types";

const EVAL_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Bar chart pass rate golden set per kategori: v1 vs v2. Kategori format tanggal dan gaya bahasa turun tajam di v2.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="52" y1="160" x2="460" y2="160"/><line x1="52" y1="120" x2="460" y2="120"/><line x1="52" y1="80" x2="460" y2="80"/><line x1="52" y1="40" x2="460" y2="40"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)"><text x="40" y="163">0%</text><text x="34" y="123">50%</text><text x="28" y="83">100%</text></g>
<g font-family="var(--font-ui)">
<rect x="80" y="52" width="34" height="108" fill="var(--c1)"/><rect x="118" y="56" width="34" height="104" fill="var(--c4)"/>
<rect x="180" y="60" width="34" height="100" fill="var(--c1)"/><rect x="218" y="96" width="34" height="64" fill="var(--c4)"/>
<rect x="280" y="56" width="34" height="104" fill="var(--c1)"/><rect x="318" y="112" width="34" height="48" fill="var(--c4)"/>
<rect x="380" y="64" width="34" height="96" fill="var(--c1)"/><rect x="418" y="68" width="34" height="92" fill="var(--c4)"/>
<g font-size="10" fill="var(--chart-text)" text-anchor="middle">
<text x="116" y="178">faktual</text><text x="216" y="178">format tgl</text><text x="316" y="178">gaya bahasa</text><text x="416" y="178">penolakan</text>
</g>
<rect x="70" y="8" width="10" height="10" fill="var(--c1)"/><text x="84" y="17" font-size="11" fill="var(--text)">v1 (model lama)</text>
<rect x="180" y="8" width="10" height="10" fill="var(--c4)"/><text x="194" y="17" font-size="11" fill="var(--text)">v2 (model baru)</text>
</g></svg>`;

const LLMOPS3_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Cohen's kappa juri: 0,45 dengan rubrik umum vs 0,68 dengan rubrik spesifik dan contoh kalibrasi."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text><rect x="85.7" y="74.1" width="129.6" height="105.9" rx="3" fill="var(--c4)"/><text x="150.5" y="68.1" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">0,45: LEMAH</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Kappa awal</text><rect x="294.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c1)"/><text x="359.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">0,68: KUAT</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Kappa +rubrik</text><line x1="46" y1="38.8" x2="464" y2="38.8" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="32.8" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">syarat 0,60</text></svg>`;

export const llmops3: V2Lesson = {
  slug: "llmops3-eval",
  track: "LLMOps",
  module: "Fondasi",
  title: "LLMOps3 — Evaluasi Berkelanjutan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Benchmark naik, sistem rusak",
      prose: [
        "Maret 2026. Vendor mengumumkan model baru: `lebih pintar 2 poin di benchmark publik`. Tim NusaBank antusias dan menjadwalkan cutover minggu itu juga — tanpa menguji apa pun selain membaca pengumuman. Tiga hari setelah cutover, parser laporan harian rusak (format tanggal berubah), tim CS komplain gaya bahasa jawaban menjadi kaku, dan dua kasus penolakan yang seharusnya sopan berubah menjadi jawaban ngawur.",
        "Twist-nya: benchmark publik memang naik — dan golden set internal NusaBank (200 kasus nyata dari CS) turun dari 94% ke 81%. Kedua angka benar. Benchmark mengukur kemampuan umum model; golden set mengukur kontrak perilaku sistemmu. Tim mengoptimalkan angka yang salah, dan membayarnya dengan 26 kasus regresi.",
        "Lesson ini tentang evaluasi berkelanjutan: membangun golden set, menjalankan regression test setiap ada perubahan (model, prompt, data), dan membaca hasilnya per kategori — bukan sekadar satu angka agregat.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membangun golden set dari produksi nyata dengan 200 kasus; (2) menghitung pass rate dan membedakan regresi sistematis vs flaky; (3) mengukur kesepakatan LLM-as-judge dengan Cohen's kappa; (4) menjadwalkan regression test berlapis (blocking, harian, mingguan).",
      ],
      tasks: [],
      note: {
        title: "Mitos: benchmark publik naik = aman upgrade",
        type: "pitfall",
        body: "Yang benar: benchmark publik tidak tahu format tanggal yang diparsing sistemmu, gaya bahasa yang disukai CS-mu, atau kasus penolakan spesifik bisnismu. Satu-satunya evaluasi yang relevan untuk keputusan deploy adalah golden set yang kamu bangun dari perilakumu sendiri.",
      },
      reference: "Golden set = 50–200 kasus nyata + perilaku yang diharapkan. Diuji setiap ada perubahan.",
    },
    {
      id: "golden-set",
      eyebrow: "Langkah 2 · Konsep",
      title: "Golden set: kontrak perilaku yang bisa dieksekusi",
      prose: [
        "Golden set adalah kumpulan kasus uji yang mewakili kontrak perilakumu: pertanyaan nyata user, dokumen konteks yang relevan, dan `perilaku yang diharapkan` — bukan string jawaban yang harus sama persis. Untuk chatbot bank: `jawaban biaya admin harus memuat angka 6.500`, `format tanggal harus DD Mon YYYY`, `pertanyaan di luar kewenangan harus ditolak sopan`. Setiap kasus punya pemeriksa (checker): aturan sederhana seperti `mengandung substring` atau `tidak mengandung kata terlarang`.",
        "Tiga prinsip membangunnya. Satu: ambil dari produksi nyata — 200 chat terakhir yang gagal + 200 yang sukses, bukan kasus karangan. Dua: kategorikan (faktual, format, gaya bahasa, penolakan, keamanan) agar regresi terlokalisasi. Tiga: rawat seperti kode — kasus basi dihapus, kasus incident baru ditambahkan. Golden set yang tidak dirawat akan basi dalam 3 bulan.",
        "💡 Intuisi: golden set bukan `test akurasi model` — ia `test kontrak sistem`. Pertanyaannya bukan `apakah model pintar?` melainkan `apakah sistem masih berperilaku seperti yang dijanjikan kemarin?`",
      ],
      formula: String.raw`\text{pass rate} = \frac{\text{kasus lolos}}{\text{total kasus}} \times 100\%`,
      formulaNote: "Kasus lolos = semua checker-nya terpenuhi. Hitung per kategori juga, bukan hanya agregat — agregat menyembunyikan regresi kategori.",
      tasks: [],
      note: {
        title: "Mitos: exact string match = evaluasi terbaik",
        type: "pitfall",
        body: "Yang benar: LLM yang sehat hampir tidak pernah menghasilkan string identik. Exact match akan gagal untuk jawaban yang benar tapi berparafrasa — false alarm yang membuat tim mengabaikan hasil test. Pakai checker perilaku (mengandung angka kunci, format valid, tidak mengandung kata terlarang), bukan pencocokan string.",
      },
      reference: "Kasus dari produksi nyata, dikategorikan, diperiksa dengan checker perilaku.",
    },
    {
      id: "regression",
      eyebrow: "Langkah 3 · Konsep",
      title: "Regression test: setiap perubahan, setiap saat",
      prose: [
        "Regression test = jalankan seluruh golden set setiap kali ada perubahan: upgrade model, update prompt, ganti data RAG, bahkan update library. Outputnya bukan sekadar pass rate, melainkan daftar regresi: kasus yang lolos kemarin tapi gagal hari ini. Regresi adalah sinyal paling berharga — ia menunjuk tepat ke perilaku yang rusak.",
        "Jadwalnya berlapis. Regression penuh setiap ada perubahan artefak (blocking untuk deploy). Regression ringan harian (sampel acak 20%) untuk menangkap perubahan diam-diam dari vendor. Dan evaluasi mendalam mingguan dengan juri manusia/LLM untuk kualitas yang tidak bisa di-checker aturan.",
        "💡 Intuisi: untuk LLM, `tidak ada perubahan dari sisiku` bukan berarti `tidak ada yang berubah`. Vendor, data, bahkan waktu (pengetahuan basi) bisa menggeser perilaku. Regression terjadwal adalah radar untuk perubahan yang tidak kamu lakukan.",
        "💡 Intuisi: LLM-as-judge (model menilai model) berguna untuk kualitas nuansa, tapi ia punya bias sendiri — cenderung menyukai jawaban panjang dan gaya modelnya sendiri. Pakai untuk ranking, jangan untuk keputusan lolos/gagal yang kritis.",
      ],
      tasks: [],
      note: {
        title: "Mitos: evaluasi cukup sekali sebelum launch",
        type: "pitfall",
        body: "Yang benar: perilaku LLM melayang seiring waktu — update vendor diam-diam, data RAG menua, prompt diedit rekan tim. Evaluasi satu kali seperti foto: akurat saat diambil, basi seminggu kemudian. Yang dibutuhkan adalah CCTV: regression test terjadwal.",
      },
      reference: "Blocking tiap perubahan, sampling harian, review mendalam mingguan.",
    },
    {
      id: "lab-evaluator",
      eyebrow: "Langkah 4 · Lab",
      title: "Bangun evaluator golden set (mock)",
      prose: [
        "Lab ini mensimulasikan regression test NusaBank: 8 kasus golden dengan checker `must` (substring wajib) dan `forbid` (substring terlarang). Dua versi model (`ans_v1`, `ans_v2`) menjawab 8 pertanyaan yang sama. Tugasmu: hitung pass rate tiap versi dan identifikasi kasus regresi (lolos di v1, gagal di v2).",
        "Coba eksplorasi: kasus mana yang gagal di v2 tapi lolos di v1? Pola apa yang berubah dari model baru — format angka, gaya bahasa, atau kepatuhan? Itulah cara membaca laporan regresi yang sebenarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pass_v1` (persen) model lama" },
        { id: "t2", text: "Hitung `pass_v2` (persen) model baru" },
        { id: "t3", text: "Hitung `n_regresi` = kasus lolos di v1 tapi gagal di v2" },
      ],
      expected: "pass_v1=87.5  pass_v2=62.5  n_regresi=3",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa mengecek `forbid`. Kasus g8 (`apakah ada biaya bulanan`) gagal di v2 bukan karena angka hilang saja, tapi karena jawaban mengandung kata `gratis` yang dilarang — checker perilaku punya dua sisi: yang harus ada DAN yang tidak boleh ada.",
      },
      hints: [
        "Fungsi lolos() sudah disediakan — pakai untuk tiap pasangan kasus-jawaban.",
        "Regresi = lolos di v1 DAN gagal di v2 untuk kasus yang sama.",
        "n_regresi = sum(1 for a, b in zip(r1, r2) if a and not b)",
      ],
      code: {
        starter: `golden = [\n    {"id": "g1", "must": ["6.500"], "forbid": []},\n    {"id": "g2", "must": ["08.00", "15.00"], "forbid": []},\n    {"id": "g3", "must": ["1500"], "forbid": []},\n    {"id": "g4", "must": ["4,25%"], "forbid": []},\n    {"id": "g5", "must": ["50 juta"], "forbid": []},\n    {"id": "g6", "must": ["KTP", "NPWP"], "forbid": []},\n    {"id": "g7", "must": ["7.500"], "forbid": []},\n    {"id": "g8", "must": ["15.000"], "forbid": ["gratis"]},\n]\nans_v1 = [\n    "Biaya admin transfer antarbank Rp6.500 per transaksi.",\n    "Cabang buka pukul 08.00 sampai 15.00 WIB.",\n    "Hubungi 1500 untuk blokir kartu hilang.",\n    "Bunga deposito 12 bulan 4.25% per tahun.",\n    "Limit transfer harian Rp50 juta.",\n    "Syarat: KTP dan NPWP.",\n    "Tarik tunai ATM bank lain kena Rp7.500.",\n    "Biaya bulanan tabungan Rp15.000.",\n]\nans_v2 = [\n    "Biaya admin transfer antarbank Rp6.500 per transaksi.",\n    "Cabang buka 08.00-15.00.",\n    "Untuk blokir kartu, hubungi call center kami.",\n    "Bunga deposito 12 bulan sekitar 4,25% per tahun.",\n    "Limit transfer harian Rp50 juta.",\n    "Syarat: KTP dan NPWP.",\n    "Tarik tunai di ATM bank lain gratis.",\n    "Tidak ada biaya bulanan, gratis!",\n]\n\ndef lolos(case, ans):\n    a = ans.lower()\n    return all(m.lower() in a for m in case["must"]) and not any(f.lower() in a for f in case["forbid"])\n\nr1 = [lolos(c, a) for c, a in zip(golden, ans_v1)]\nr2 = [lolos(c, a) for c, a in zip(golden, ans_v2)]\n\n# TULIS KODEMU: pass rate tiap versi + jumlah regresi\npass_v1 = \npass_v2 = \nn_regresi = \n\nprint(f"pass_v1={pass_v1}  pass_v2={pass_v2}  n_regresi={n_regresi}")`,
        lockLines: 41,
        solution: `golden = [\n    {"id": "g1", "must": ["6.500"], "forbid": []},\n    {"id": "g2", "must": ["08.00", "15.00"], "forbid": []},\n    {"id": "g3", "must": ["1500"], "forbid": []},\n    {"id": "g4", "must": ["4,25%"], "forbid": []},\n    {"id": "g5", "must": ["50 juta"], "forbid": []},\n    {"id": "g6", "must": ["KTP", "NPWP"], "forbid": []},\n    {"id": "g7", "must": ["7.500"], "forbid": []},\n    {"id": "g8", "must": ["15.000"], "forbid": ["gratis"]},\n]\nans_v1 = [\n    "Biaya admin transfer antarbank Rp6.500 per transaksi.",\n    "Cabang buka pukul 08.00 sampai 15.00 WIB.",\n    "Hubungi 1500 untuk blokir kartu hilang.",\n    "Bunga deposito 12 bulan 4.25% per tahun.",\n    "Limit transfer harian Rp50 juta.",\n    "Syarat: KTP dan NPWP.",\n    "Tarik tunai ATM bank lain kena Rp7.500.",\n    "Biaya bulanan tabungan Rp15.000.",\n]\nans_v2 = [\n    "Biaya admin transfer antarbank Rp6.500 per transaksi.",\n    "Cabang buka 08.00-15.00.",\n    "Untuk blokir kartu, hubungi call center kami.",\n    "Bunga deposito 12 bulan sekitar 4,25% per tahun.",\n    "Limit transfer harian Rp50 juta.",\n    "Syarat: KTP dan NPWP.",\n    "Tarik tunai di ATM bank lain gratis.",\n    "Tidak ada biaya bulanan, gratis!",\n]\n\ndef lolos(case, ans):\n    a = ans.lower()\n    return all(m.lower() in a for m in case["must"]) and not any(f.lower() in a for f in case["forbid"])\n\nr1 = [lolos(c, a) for c, a in zip(golden, ans_v1)]\nr2 = [lolos(c, a) for c, a in zip(golden, ans_v2)]\n\n# TULIS KODEMU: pass rate tiap versi + jumlah regresi\npass_v1 = sum(r1) / len(r1) * 100\npass_v2 = sum(r2) / len(r2) * 100\nn_regresi = sum(1 for a, b in zip(r1, r2) if a and not b)\n\nprint(f"pass_v1={pass_v1}  pass_v2={pass_v2}  n_regresi={n_regresi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pass_v1", value: 87.5, tol: 1e-9, label: "`pass_v1` seharusnya 87.5", msg: "7 dari 8 lolos (g4 gagal: 4.25% bukan 4,25%)." },
          { kind: "equal", task: "t2", name: "pass_v2", value: 62.5, tol: 1e-9, label: "`pass_v2` seharusnya 62.5", msg: "5 dari 8 lolos (g3, g7, g8 gagal)." },
          { kind: "equal", task: "t3", name: "n_regresi", value: 3, tol: 1e-9, label: "`n_regresi` seharusnya 3", msg: "g3, g7, g8 lolos di v1 tapi gagal di v2." },
          { kind: "stdout_matches", task: "t3", pattern: "pass_v1=87\\.5\\s+pass_v2=62\\.5\\s+n_regresi=3", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Checker = must + forbid. Regresi = lolos kemarin, gagal hari ini.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Checker apa untuk kasus apa",
      prose: [
        "Lima skenario pemilihan metode evaluasi. Satu: format output yang diparsing mesin (tanggal, JSON, angka) → checker aturan (regex/substring): murah, deterministik, blocking. Dua: kepatuhan kebijakan (tidak boleh menyebut SARA, harus menolak topik terlarang) → checker aturan untuk pola jelas + sampling LLM-judge untuk nuansa. Tiga: kualitas jawaban terbuka (empati CS, kejelasan penjelasan) → LLM-as-judge dengan rubrik + kalibrasi manusia berkala; jangan jadikan blocking otomatis.",
        "Empat: perubahan kecil prompt (typo, contoh) → regression penuh tetap jalan — murah dan cepat, tidak ada alasan dilewat. Lima: tidak ada perubahan apa pun selama sebulan → regression sampling harian tetap jalan — menangkap perubahan diam-diam vendor.",
        "Aturan praktis 10 detik: yang bisa di-check aturan, check dengan aturan (murah + pasti). Yang butuh penilaian nuansa, pakai juri + manusia. Yang tidak diuji sama sekali = risiko yang kamu terima diam-diam — tulis eksplisit.",
      ],
      figure: {
        svg: EVAL_SVG,
        alt: "Bar chart pass rate golden set per kategori: v1 vs v2. Kategori format tanggal dan gaya bahasa turun tajam di v2.",
        caption: "Cara membaca: tiap kategori punya dua batang — v1 (model lama) vs v2 (model baru). Tinggi batang = pass rate kategori. Interpretasi: agregat v2 turun, tapi kategori faktual dan penolakan stabil — regresi terlokalisasi di format tanggal dan gaya bahasa. Tanpa breakdown kategori, tim akan mengira `model baru lebih buruk secara umum` dan melewatkan fix yang sebenarnya sederhana.",
      },
      tasks: [],
      note: {
        title: "Mitos: satu angka pass rate cukup untuk keputusan deploy",
        type: "pitfall",
        body: "Yang benar: agregat 85% bisa berarti `semua kategori 85%` (aman) atau `faktual 100%, keamanan 40%` (bahaya). Selalu tetapkan ambang per kategori kritis — keamanan dan kepatuhan tidak boleh dikompensasi oleh kategori lain.",
      },
      reference: "Aturan untuk yang deterministik, juri+manusia untuk nuansa, sampling untuk perubahan diam-diam.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "26 regresi, Rp2,6 juta investigasi",
      prose: [
        "Golden set NusaBank: 200 kasus. Pass rate turun 94% → 81% = 26 kasus regresi. Setiap regresi butuh investigasi: reproduksi, baca diff perilaku, tentukan apakah bug atau perilaku baru yang bisa diterima. Estimasi 30 menit per kasus × Rp200.000/jam biaya analis → 26 × 0,5 × 200.000 = Rp2.600.000 biaya investigasi — belum termasuk biaya fix dan re-test.",
        "Pertanyaan analisis: (a) 26 regresi — perlukah semuanya diinvestigasi, atau ada triase yang lebih murah? (b) bagaimana membedakan `regresi yang harus di-fix` vs `perilaku baru yang bisa diterima`? (c) jika regression test dijalankan SEBELUM cutover, berapa yang bisa dihemat?",
        "Jawaban yang defensibel: (a) triase per kategori: regresi keamanan/format (blocking, investigasi penuh), regresi gaya bahasa (sampling, batch fix via prompt). Tidak semua regresi setara. (b) bandingkan dengan kontrak: jika perilaku baru melanggar checker yang disepakati = bug; jika checker-nya yang basi (aturan bisnis berubah) = update golden set, bukan fix model. (c) hampir semua Rp2,6 juta + biaya incident — regression test sebelum cutover mengubah incident produksi menjadi temuan staging.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regresi yang tidak diinvestigasi bukan `risiko yang hilang` — ia menjadi `risiko yang tidak tercatat`. 26 kasus regresi yang dibiarkan = 26 perilaku produksi yang tidak kamu pahami. Dalam audit, `tidak tahu` lebih buruk dari `tahu tapi belum fix`.",
      },
      reference: "26 × 0,5 jam × Rp200rb = Rp2,6 jt. Triase per kategori; bedakan bug vs kontrak basi.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Kappa: kapan juri boleh dipercaya",
      prose: [
        "LLM-as-judge menilai 100 jawaban: 80 `bagus`, 20 `buruk`. Manusia menilai set yang sama: 75 `bagus`, 25 `buruk`. Keduanya sepakat pada 70 bagus + 15 buruk = 85% agreement. Terdengar bagus? Belum tentu — karena jika keduanya asal menebak `bagus` 80% waktu, mereka akan sepakat 0,8×0,75 + 0,2×0,25 = 65% HANYA KARENA KEBETULAN. Agreement mentah 85% menipu; yang jujur adalah KAPPA: κ = (p_o − p_e)/(1 − p_e) = (0,85 − 0,65)/(1 − 0,65) = 0,57. Kappa 0,57 = kesepakatan SEDANG, bukan bagus.",
        "Skala kappa yang dipakai industri: < 0,20 buruk (jangan pakai juri ini), 0,21–0,40 lemah, 0,41–0,60 sedang, 0,61–0,80 kuat, > 0,80 sangat kuat. Untuk eval produksi, syarat minimum κ ≥ 0,60 pada 100+ sampel yang dinilai ganda (manusia + juri). Di bawah itu, `LLM-as-judge bilang bagus` tidak lebih terpercaya dari lempar koin yang sedikit bias — dan seluruh regression test-mu berdiri di atasnya.",
        "Contoh jebakan: juri yang SELALU bilang `bagus`. Agreement dengan manusia (75% bagus) = 75% — terlihat lumayan! Tapi p_e = 1,0×0,75 + 0×0,25 = 0,75; κ = (0,75−0,75)/(1−0,75) = 0. Kappa NOL — juri ini tidak memberi informasi apa pun. Agreement mentah tidak bisa menangkap ini; kappa bisa. Inilah mengapa lesson ini bersikeras: JANGAN percaya agreement tanpa kappa.",
        "Cara menaikkan kappa juri: (1) RUBRIK SPESIFIK — `jawab dengan benar` → `sebutkan angka premi yang tepat ± 1%; jika tidak ada di dokumen, jawab TIDAK TAHU`; kappa naik 0,45 → 0,68 pada eksperimen NusaBank. (2) CONTOH KALIBRASI — 5 contoh bagus/buruk dengan alasan di prompt juri. (3) TEMPERATURE 0 untuk juri (kurangi varian penilaian). (4) Ukur kappa PER KATEGORI — juri bisa κ=0,75 untuk format tapi κ=0,35 untuk nuansa; pakai juri hanya untuk kategori yang kuat, sisanya checker aturan atau manusia.",
      ],
      formula: String.raw`\kappa = \frac{p_o - p_e}{1 - p_e}`,
      formulaNote: "κ = Cohen's kappa; p_o = proporsi kesepakatan teramati; p_e = proporsi kesepakatan karena kebetulan (dari distribusi marginal). Syarat pakai LLM-as-judge di produksi: κ ≥ 0,60 pada 100+ sampel dinilai ganda. Di bawah itu, jurinya belum layak.",
      tasks: [],
      note: {
        title: "💡 Intuisi: agreement tanpa kappa = nilai tanpa KKM",
        body: "85% agreement terdengar lulus — sampai tahu KKM-nya (kebetulan) adalah 65%. Kappa mengukur SEBERAPA JAUH di atas kebetulan. Juri yang selalu bilang `bagus` punya agreement 75% dan kappa 0: tidak memberi informasi sama sekali. Selalu hitung kappa sebelum percaya pada juri.",
      },
      reference: "Rubrik spesifik + contoh kalibrasi + temperature 0 = resep kappa ≥0,60.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Matriks kesepakatan: di mana juri salah",
      prose: [
        "Dari 100 sampel: juri & manusia sepakat bagus 70, sepakat buruk 15, juri bilang bagus tapi manusia bilang buruk 10, juri bilang buruk tapi manusia bilang bagus 5. Polanya ASIMETRIS: juri 2x lebih sering terlalu murah hati (10) daripada terlalu keras (5). Ini bias khas LLM-judge: cenderung menyukai jawaban yang panjang dan percaya diri — bahkan jika salah. Matriks ini memberi tahu CARA memperbaikinya: ketatkan rubrik untuk `jawaban panjang tapi salah`.",
        "Angka 10 vs 5 juga menentukan BIAYA kesalahan eval. Jika juri dipakai sebagai gerbang deploy (lolos jika `bagus`), maka 10 false-bagus = 10 jawaban buruk LOLOS ke produksi per 100. Dengan 1.200 sesi/hari, itu 120 jawaban buruk per hari yang `lolos eval`. Solusi: untuk gerbang, pakai ambang konservatif — juri harus bilang `bagus` dengan confidence tinggi, atau kombinasikan juri + checker aturan (LLMOps2). Eval yang longgar = gerbang yang bolong (MLOps5).",
        "Ukur ulang kappa tiap kuartal dan tiap ganti model juri. Kappa bukan sifat permanen — rubrik yang sama pada model juri baru bisa turun 0,68 → 0,52 (perilaku penilaian berubah). NusaBank menjadwalkan `kalibrasi juri` bulanan: 50 sampel dinilai ganda, hitung kappa, jika < 0,60 → perbaiki rubrik atau ganti juri. Juri adalah komponen yang di-ops juga — bukan orakel yang dipasang sekali.",
      ],
      figure: {
        svg: LLMOPS3_DEEP_SVG,
        alt: "Diagram batang kappa: 0,45 (rubrik umum, lemah) vs 0,68 (rubrik spesifik, kuat, di atas syarat 0,60).",
        caption: "Cara membaca: tinggi batang = Cohen's kappa kesepakatan juri vs manusia; garis putus-putus = syarat minimum 0,60 untuk produksi. Interpretasi: rubrik umum memberi 0,45 (tidak layak); rubrik spesifik + 5 contoh kalibrasi + temperature 0 menaikkan ke 0,68 (layak). Kappa adalah KKM bagi juri.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: juri yang murah hati = gerbang yang bolong",
        body: "Bias khas LLM-judge: terlalu suka jawaban panjang dan percaya diri (10 false-bagus vs 5 false-buruk). Untuk gerbang deploy, ini berarti jawaban buruk lolos. Kenali asimetri matriksnya, lalu kompensasi: rubrik lebih ketat untuk kategori yang paling sering salah.",
      },
      reference: "Kalibrasi juri bulanan: 50 sampel ganda, kappa < 0,60 → perbaiki atau ganti.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Golden set = kasus nyata + perilaku yang diharapkan + checker (must/forbid), dikategorikan, dirawat.",
        "Regression test setiap perubahan (blocking), sampling harian (perubahan diam-diam), review mendalam mingguan.",
        "Regresi = lolos kemarin, gagal hari ini — sinyal paling berharga untuk triase.",
        "Baca hasil per kategori; ambang kategori kritis tidak bisa dikompensasi kategori lain.",
        "LLM-as-judge untuk nuansa (ranking), checker aturan untuk yang deterministik (keputusan).",
      ],
      next: { label: "LLMOps4 — Operasional RAG", href: "/learn/llmops4-rag-ops" },
      quiz: [
        {
          q: "Mengapa exact string match buruk sebagai checker golden set?",
          options: [
            { text: "Terlalu lambat dijalankan", why: "Kecepatan bukan masalahnya — string match justru cepat." },
            { text: "Jawaban benar yang berparafrasa akan gagal → false alarm massal", why: "LLM sehat jarang menghasilkan string identik. False alarm membuat tim mengabaikan hasil test.", correct: true },
            { text: "Tidak bisa dipakai di Python", why: "Sangat bisa — masalahnya metodologis, bukan teknis." },
            { text: "Hanya bekerja untuk bahasa Inggris", why: "Tidak ada kaitan dengan bahasa." },
          ],
        },
        {
          q: "Agregat pass rate 85% dengan breakdown: faktual 100%, keamanan 40%. Keputusan deploy?",
          options: [
            { text: "Deploy — 85% sudah bagus", why: "Keamanan 40% tidak bisa dikompensasi kategori lain. Ini contoh agregat menipu." },
            { text: "Tahan — perbaiki kategori keamanan dulu, agregat tidak relevan", why: "Kategori kritis punya ambang sendiri. Deploy dengan keamanan 40% = menerima risiko yang tidak tercatat.", correct: true },
            { text: "Deploy lalu perbaiki bertahap", why: "Regresi keamanan di produksi = incident, bukan tech debt." },
            { text: "Hapus kategori keamanan dari golden set", why: "Menghapus test agar lolos adalah manipulasi metrik, bukan perbaikan." },
          ],
        },
        {
          q: "Kapan regression test harus dijalankan?",
          options: [
            { text: "Hanya sebelum launch pertama", why: "Perilaku LLM melayang seiring waktu — satu kali tidak cukup." },
            { text: "Setiap ada perubahan artefak + sampling harian terjadwal", why: "Blocking tiap perubahan menangkap regresi buatan sendiri; sampling harian menangkap perubahan diam-diam vendor.", correct: true },
            { text: "Hanya saat ganti vendor model", why: "Prompt, data RAG, dan config juga bisa meregresi perilaku." },
            { text: "Setahun sekali saat audit", why: "Setahun = ratusan perubahan tak teruji di antaranya." },
          ],
        },
        {
          q: "Dalam lab, kasus g8 gagal di v2 karena dua alasan. Apa saja?",
          options: [
            { text: "Angka 15.000 hilang dan muncul kata terlarang `gratis`", why: "Checker g8: must=[15.000], forbid=[gratis]. Jawaban v2 melanggar keduanya.", correct: true },
            { text: "Jawabannya terlalu pendek", why: "Panjang jawaban bukan bagian dari checker g8." },
            { text: "Bahasa Inggris tercampur", why: "Tidak ada checker bahasa di kasus ini." },
            { text: "Tidak menyebut nama bank", why: "Bukan ekspektasi kasus g8." },
          ],
        },
        {
          q: "Peran yang tepat untuk LLM-as-judge dalam evaluasi?",
          options: [
            { text: "Pengganti total checker aturan — lebih modern", why: "Juri punya bias (suka jawaban panjang/gayanya sendiri) dan mahal; aturan lebih murah dan pasti untuk yang deterministik." },
            { text: "Menilai nuansa/kualitas untuk ranking, dengan kalibrasi manusia; bukan penentu lolos/gagal kritis", why: "Pembagian kerja yang sehat: aturan untuk kontrak keras, juri untuk kualitas lunak.", correct: true },
            { text: "Tidak boleh dipakai sama sekali", why: "Terlalu ekstrem — untuk kualitas jawaban terbuka, juri jauh lebih baik dari tidak ada evaluasi." },
            { text: "Hanya untuk menghemat biaya manusia 100%", why: "Tanpa kalibrasi manusia, bias juri tidak terdeteksi." },
          ],
        },
        {
          q: "Juri LLM vs manusia: agreement 85%, tapi p_e (kebetulan) = 65%. Berapa kappa dan apa artinya?",
          options: [
            { text: "κ = 0,85 — sangat kuat, juri siap produksi", why: "0,85 adalah agreement MENTAH, bukan kappa. Kappa = (0,85−0,65)/(1−0,65) = 0,57 — hanya SEDANG, di bawah syarat 0,60." },
            { text: "κ = 0,57 — sedang, belum memenuhi syarat produksi 0,60", why: "Tepat. Agreement 85% menipu karena 65% bisa terjadi karena kebetulan. Perbaiki rubrik (spesifik + contoh kalibrasi) lalu ukur ulang sebelum pakai sebagai gerbang.", correct: true },
            { text: "κ = 0,20 — buruk, buang jurinya", why: "Hitungannya salah: (0,85−0,65)/0,35 = 0,57, bukan 0,20. 0,57 = sedang — bisa diperbaiki dengan rubrik lebih baik, belum perlu dibuang." },
            { text: "Kappa tidak penting selama agreement tinggi", why: "Agreement tinggi bisa 100% kebetulan (juri yang selalu bilang `bagus` pada data 75% bagus). Tanpa kappa, kamu tidak tahu jurimu memberi informasi atau hanya menebak." },
          ],
        },
      ],
    },
  ],
};
