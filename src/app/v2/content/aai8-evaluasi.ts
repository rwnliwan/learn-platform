import type { V2Lesson } from "../lib/types";

// CI bars: success rate 3 agen dengan n berbeda.
const EVAL_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Tiga agen dengan success rate dan interval kepercayaan berbeda-beda.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="80" y1="24" x2="440" y2="24"/><line x1="80" y1="64" x2="440" y2="64"/><line x1="80" y1="104" x2="440" y2="104"/><line x1="80" y1="144" x2="440" y2="144"/><line x1="80" y1="184" x2="440" y2="184"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="74" y="28">100%</text><text x="74" y="68">75%</text><text x="74" y="108">50%</text><text x="74" y="148">25%</text><text x="74" y="188">0%</text></g>
<g stroke-width="3">
<line x1="140" y1="52" x2="140" y2="132" stroke="var(--c1)"/><circle cx="140" cy="92" r="6" fill="var(--c1)"/>
<line x1="260" y1="72" x2="260" y2="112" stroke="var(--c2)"/><circle cx="260" cy="92" r="6" fill="var(--c2)"/>
<line x1="380" y1="40" x2="380" y2="180" stroke="var(--c5)"/><circle cx="380" cy="110" r="6" fill="var(--c5)"/>
</g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--text)" text-anchor="middle">
<text x="140" y="208">Agen A</text><text x="140" y="224" font-size="11" fill="var(--chart-text)">78% ± 13 (n=40)</text>
<text x="260" y="208">Agen B</text><text x="260" y="224" font-size="11" fill="var(--chart-text)">72% ± 6 (n=200)</text>
<text x="380" y="208">Agen C</text><text x="380" y="224" font-size="11" fill="var(--chart-text)">90% ± 19 (n=10)</text>
</g>
<text x="260" y="16" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">Titik = estimasi, garis = interval kepercayaan 95%</text>
</svg>`;

export const aai8: V2Lesson = {
  slug: "aai8-evaluasi",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI8 — Evaluasi Agen",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Demo yang memukau, produksi yang memalukan",
      prose: [
        "Vendor mempresentasikan agen analis ke direksi Dina. Demo 15 menit: tiga tugas, tiga jawaban sempurna. Direksi terkesan. Kontrak ditandatangani.",
        "Pekan pertama produksi: dari 60 laporan, 11 mengandung angka salah, 4 tidak selesai (loop hingga max_steps), 2 mengirim draf ke alamat email yang salah. \u201CTingkat keberhasilan demo 100%\u201D berubah menjadi 72% di dunia nyata — dan tidak ada yang tahu KENAPA, karena tidak ada log evaluasi yang tersimpan.",
        "Twist-nya: demo itu BUKAN evaluasi. Tiga tugas yang dipilih vendor, tanpa definisi \u201Cberhasil\u201D yang tertulis, tanpa interval kepercayaan, tanpa jejak trajectory. \u201CVibes\u201D — rasa kagum — dijadikan metrik. Di agentic AI, yang tidak diukur dengan definisi akan gagal dengan percaya diri.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang golden tasks dengan kriteria sukses tertulis; (2) menghitung task success rate + interval kepercayaan; (3) memakai LLM-as-judge dengan benar (dan tahu biasnya); (4) mengimplementasikan evaluator trajectory mock.",
        "Daftar isi: 1) Cerita demo · 2) Piramida evaluasi agen · 3) Lab: evaluator trajectory · 4) Peta keputusan metode evaluasi · 5) Mini-case: n=10 vs n=200 · 6) Checkpoint.",
        "Akuntansi kehancuran: 60 laporan → 11 angka salah + 4 tak selesai + 2 salah kirim = 17 gagal = 28,3% gagal. “Tingkat keberhasilan demo 100%” → 71,7% produksi. Dan yang lebih menyakitkan: KONTRAK sudah ditandatangani berdasarkan demo 3 tugas. Hitung CI untuk 3/3 sukses: p̂=1,0, n=3 → SE=√(1×0/3)=0 — formula Wald gagal di batas; dengan Wilson interval ≈ [0,44, 1,00]. Artinya demo “sempurna” itu kompatibel dengan keberhasilan serendah 44%! Tiga tugas tidak membuktikan apa-apa — kecuali bahwa vendor pandai memilih tugas demo.",
        "Kontrak yang benar: metrik DITETAPKAN SEBELUM demo, bukan sesudah. “Agen dinyatakan lolos jika pada 200 golden tasks: success rate ≥80% (CI 95% tidak di bawah 75%), 0 insiden pengiriman salah, p95 langkah ≤15.” Dengan kriteria tertulis, demo 3 tugas = hiburan, bukan bukti. Pelajaran pengadaan: vendor yang menolak evaluasi terstruktur = vendor yang tahu ia akan gagal. Yang berani diukur = yang layak dibayar.",
        "Setahun kemudian, Dina menolak vendor kedua — dengan DATA. Vendor mengklaim “95% akurat”; evaluasi Dina (n=300, kriteria tertulis): 71% (CI [66, 76]). Vendor protes; Dina menunjukkan metodologi + CI + trajectory 10 sampel gagal. Vendor mundur. “Tahun lalu kami menandatangani kontrak dari demo 3 tugas,” katanya. “Tahun ini kami punya 300 alasan untuk tidak mengulanginya.” Evaluasi bukan birokrasi — ia adalah KEKUATAN NEGOSIASI. Yang bisa mengukur bisa menolak; yang tidak bisa mengukur hanya bisa berharap.",
      ],
      note: {
        title: "💡 Intuisi: n kecil = opini, n besar = bukti",
        body: "Demo 3 tugas, pilot 10 tugas, evaluasi 300 tugas — ketiganya “pengujian”, tetapi hanya yang terakhir bisa membedakan 70% vs 80%. Sebelum percaya angka apa pun, tanyakan: “berapa n, berapa CI-nya?” Pertanyaan 5 detik ini membedakan profesional dari penonton demo. Vendor yang tersinggung ditanya n = vendor yang tidak punya n.",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Piramida evaluasi: dari sukses tugas hingga jejak langkah",
      prose: [
        "Level 1 — TASK SUCCESS RATE: proporsi tugas yang memenuhi kriteria sukses TERTULIS. Kriteria harus operasional: \u201Claporan memuat IHSG benar ±0,1% + sitasi + terkirim sebelum 08.00\u201D — bukan \u201Claporan bagus\u201D.",
        "Level 2 — TRAJECTORY EVAL: bukan hanya hasil akhir, tetapi JALANNYA — berapa langkah? berapa tool call gagal? apakah ada loop? Dua agen bisa sama-sama \u201Cberhasil\u201D tetapi satu butuh 40 langkah boros dan satu 8 langkah efisien.",
        "Level 3 — STEP-LEVEL CHECKS: verifikasi tiap langkah kritis (argumen tool valid? tidak ada aksi terlarang?). Mahal, dipakai untuk tugas berisiko tinggi.",
        "LLM-AS-JUDGE: memakai model lain untuk menilai output (skala 1–5 + rubrik). Murah dan skalabel — tetapi punya BIAS: cenderung suka jawaban panjang (verbosity bias), suka gaya sendiri (self-preference), dan tidak stabil antar versi model. Aturan: judge butuh RUBRIK tertulis + kalibrasi berkala terhadap penilai manusia (ukur agreement).",
        "GOLDEN TASKS: 20–50 tugas representatif yang DIKUNCI — tidak berubah antar versi agen. Tanpa ini, kamu membandingkan apel dan jeruk tiap rilis.",
        "Rumus kunci: estimasi p̂ dari n tugas punya ketidakpastian. Interval kepercayaan 95% di bawah ini menjelaskan kenapa \u201C90% dari 10 tugas\u201D hampir tidak berarti apa-apa.",
        "Contoh angka CI lengkap: p̂=0,72, n=60. SE = √(0,72 × 0,28 / 60) = √(0,00336) = 0,058. CI 95% = 0,72 ± 1,96 × 0,058 = [0,606, 0,834]. Klaim “72% sukses” yang jujur = “61–83%”. Lebar 22 poin = ketidakpastian yang harus diakui. Jika target kontrak 80%: 80% DI DALAM interval → BELUM TERBUKTI memenuhi target (bisa 61%). Keputusan: tambah n atau terima risiko. Statistik bukan birokrasi — ia adalah kejujuran yang diformalkan.",
        "Derivasi n=300 — hafalkan polanya. Untuk membedakan p1−p2 = d di sekitar p: n ≈ 16 × p(1−p) / d². Dengan p=0,75, d=0,10: 16 × 0,1875 / 0,01 = 300. Dari mana 16? (2 × z)² dengan z=1,96 ≈ (3,92)² ≈ 15,4 ≈ 16 — untuk dua sampel dan 95% confidence. Variasikan: d=0,05 → n=1.200 (4× lipat!); p=0,5 (varians maks) → n=400 untuk d=0,10. Aturan praktis: separuh perbedaan yang ingin dideteksi → 4× data. Pilih d sesuai KEPUTUSAN BISNIS: beda 5 poin tidak mengubah keputusan? Jangan bayar 1.200 evaluasi.",
        "Trajectory eval — dua agen, satu skor. Agen A: sukses, 8 langkah, 0 tool gagal, 0 loop. Agen B: sukses, 40 langkah, 12 tool gagal, 1 loop terdeteksi. Success rate: sama (100%). Biaya: B = 5× A. Risiko: B punya pola loop yang di produksi bisa meledak (AAI11). Tanpa trajectory eval, kamu memilih B — karena “hasilnya sama”. Dengan trajectory eval, kamu memilih A — karena kamu melihat MASA DEPANNYA. Skor tanpa jejak = diagnosis tanpa pasien; jangan pernah memilih agen hanya dari skor akhir.",
        "LLM-as-judge — juri yang harus dikalibrasi dulu. mock_judge memberi 1–5; tetapi apakah 4 dari judge = 4 dari manusia? Ukur agreement pada 100 sampel: jika Cohen’s κ < 0,8, judge = “opini mahal”, bukan metrik. Bias tipikal judge: memihak jawaban PANJANG (+0,5 poin), memihak gaya sendiri, dan gagal mendeteksi angka salah yang halus. Aturan: judge untuk SKALA (1.000 sampel), manusia untuk KEBENARAN (100 sampel kalibrasi + audit acak 5%). Otomatisasi evaluasi ≠ menghilangkan manusia — ia memindahkan manusia ke tempat yang paling berharga.",
        "Golden tasks — cara membangun yang benar. (1) Sampel dari DISTRIBUSI PRODUKSI (bukan tugas yang “menarik”): 200 query nyata terakhir. (2) Kriteria sukses TERTULIS per tugas (bukan “bagus”). (3) Stratifikasi: 70% rutin, 20% sulit, 10% adversarial. (4) Refresh tiap kuartal (distribusi bergeser). Golden set yang tidak dirawat = tes yang menguji masa lalu. Dan: JANGAN latih/tune agen di atas golden set — itu seperti mengajar dengan kunci jawaban; skor naik, kemampuan tidak (kontaminasi).",
        "Power analysis SEBELUM evaluasi — jangan kumpulkan data dulu, hitung dulu. Pertanyaan: “perbedaan berapa yang PENTING?” (d), “berapa varians?” (p). n = 16×p(1−p)/d². Contoh: p=0,7, d=0,08 → n = 16×0,21/0,0064 = 525. Tanpa power analysis: kumpulkan 100 (kurang — tidak bisa menyimpulkan), atau 2.000 (boros — Rp4 juta untuk presisi yang tidak dibutuhkan). Power analysis = 5 menit yang menghemat Rp jutaan. “Berapa n?” bukan pertanyaan setelah evaluasi — ia pertanyaan SEBELUMNYA.",
        "Evaluasi TERSTRATIFIKASI — agregat bisa menipu (Simpson’s paradox untuk agen). Agen: 85% sukses di tugas rutin (n=270), 40% di tugas sulit (n=30) → agregat 80,5%. Terlihat “hampir target 80%”! Tetapi tugas sulit = yang paling berharga (dan paling berisiko). Laporkan SELALU per strata: rutin 85% ✓, sulit 40% ✗ — keputusan: JANGAN rilis untuk tugas sulit. Agregat tanpa strata = rata-rata yang menyembunyikan pasien yang sekarat.",
        "Deteksi REGRESI antar rilis — evaluasi sebagai CI/CD. Setiap rilis: jalankan 100 golden tasks, bandingkan vs baseline. Aturan alert: turun >3 poin = investigasi; turun >5 poin = tahan rilis. Tetapi HATI-HATI flakiness: LLM non-deterministik → skor berfluktuasi ±2 poin antar run TANPA perubahan kode. Solusi: (1) seed/temperature=0 untuk eval; (2) ambang alert > flakiness (>3 poin); (3) run 3× untuk keputusan rilis besar. Alarm yang berbunyi karena flakiness = alarm yang akan diabaikan — lalu regresi beneran lolos.",
        "Kontaminasi golden set — musuh dalam selimut. Tanda-tanda: skor naik 15 poin dalam 1 pekan tanpa perubahan arsitektur; agen “hafal” jawaban untuk tugas spesifik; performa anjlok saat golden di-refresh. Pencegahan: (1) JANGAN tune di atas golden (pakai dev set terpisah); (2) simpan golden TERENKRIPSI dengan akses terbatas; (3) refresh 25% tiap kuartal. Golden yang terkontaminasi = speedometer yang rusak: menunjukkan 120 saat sebenarnya 60 — dan kamu melaju dengan percaya diri ke jurang.",
      ],
      formula: String.raw`\hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`,
      formulaNote: "p̂ (p-hat) = proporsi sukses teramati (mis. 43/60 = 0,72); n = jumlah golden tasks; z = 1,96 untuk 95% confidence. Interval = p̂ ± z × SE, dengan SE = √(p̂(1−p̂)/n). Lebar interval menyempit ∝ 1/√n: untuk memangkas lebar menjadi SEPARUH, butuh 4× data. Inilah harga kejujuran statistik — dan mengapa n=300, bukan n=30.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201CLLM judge itu objektif\u201D",
        type: "pitfall",
        body: "Yang benar: judge adalah MODEL dengan preferensi — ia menyukai jawaban panjang, sopan, dan mirip gayanya sendiri. Tanpa rubrik tertulis + kalibrasi manusia, \u201Cskor judge naik\u201D bisa berarti agenmu makin verbose, bukan makin benar. Selalu laporkan human-agreement (mis. Cohen's kappa) di samping skor judge.",
      },
      hints: [
        "Intuisi: n kecil → interval lebar → jangan klaim menang. \u201CAgen C 90%\u201D dari 10 tugas bisa jadi 71%–99% — klaimnya hampir kosong.",
        "Intuisi: simpan TRAJECTORY (jejak langkah), bukan hanya skor. Saat agen gagal 3 bulan kemudian, yang kamu butuhkan adalah replay-nya.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: evaluator trajectory dengan mock judge",
      prose: [
        "Kamu diberi 6 trajectory mock — tiap trajectory = dict {id, langkah, tool_gagal, loop_terdeteksi, sukses}. `mock_judge` memberi skor 1–5 berdasarkan heuristik (sukses + sedikit langkah + tanpa loop = 5).",
        "Tugasmu: implementasikan `evaluasi(trajs)` yang menghitung: (1) `success_rate` = proporsi sukses; (2) `rata_langkah` = rata-rata langkah HANYA untuk yang sukses; (3) `skor_judge` = rata-rata skor mock_judge; (4) `ci` = setengah-lebar interval kepercayaan 95% (z=1,96) dari success_rate; (5) `laporan_risiko` = daftar id trajectory yang sukses TETAPI punya loop_terdeteksi (berhasil yang rapuh!).",
        "Coba eksplorasi: ubah satu trajectory sukses menjadi gagal. Bagaimana success_rate dan ci berubah? Itulah sensitivitas n kecil.",
        "Eksperimen: tambah 1 loop ke trajectory agen TERBAIK di lab, hitung ulang. success_rate tidak berubah (masih sukses!) — tetapi rata_langkah naik dan skor_judge turun. Inilah demonstrasi trajectory eval dalam 2 menit: metrik hasil BUTA terhadap keborosan; metrik jejak MELIHATNYA. Jika evaluasimu hanya success rate, agen boros akan lolos — dan tagihan produksi yang akan “mengevaluasi” sisanya.",
        "Hitung CI untuk 6 trajectory di lab: misal 5 sukses dari 6 → p̂=0,833, SE=√(0,833×0,167/6)=0,152, CI=[0,535, 1,00] (dipotong di 1). Lebar 46 poin! Lab ≠ bukti produksi — ia bukti KONSEP. Jangan pernah menulis di laporan: “agen kami 83% akurat (n=6)”. Tulis: “evaluasi awal n=6 menunjukkan pola yang benar; evaluasi produksi butuh n=300 (lihat minicase).” Kejujuran tentang n adalah pembeda profesional.",
        "Tiga metrik, tiga pertanyaan. success_rate: “apakah ia BISA?” (kemampuan). rata_langkah (hanya yang sukses): “berapa MAHAL?” (efisiensi). skor_judge: “bagaimana KUALITASNYA?” (nuansa). ci: “seberapa YAKIN kita?” (ketidakpastian). Evaluasi yang hanya punya satu = jawaban atas satu pertanyaan. Direksi butuh keempatnya — karena keputusan “lolos produksi” butuh kemampuan DAN efisiensi DAN kualitas DAN kepastian.",
        "Evaluasi yang FLAKY — ukur, jangan asumsi. Jalankan `evaluasi` 5× pada trajectory yang SAMA (mock deterministik → hasil identik). Sekarang bayangkan mock_judge non-deterministik (±1 poin acak): rata-rata 5 run = stabil, 1 run = noise. Pelajaran: untuk judge non-deterministik, LAPORKAN rata-rata 3 run + std. Satu run = anekdot; tiga run = data. Dan untuk keputusan rilis: 5 run. Biaya 5× evaluasi << biaya 1 rilis yang salah.",
        "Sampling audit manusia — 100% otomatis = buta; 100% manusia = bangkrut. Stratified sample: 50 acak + 30 yang judge-nya “ragu” (skor 3) + 20 adversarial. 100 sampel × 5 menit × Rp85.000/60 = Rp708 ribu per ronde. Temukan 3 pola gagal baru = 3 perbaikan = ROI besar. Audit manusia bukan “pengganti otomatisasi” — ia adalah EKSPLORASI yang menemukan apa yang harus diotomatisasi berikutnya. Otomatisasi tanpa eksplorasi = mengoptimasi peta yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `evaluasi` dengan 5 metrik di atas" },
        { id: "t2", text: "Cetak success_rate, ci, dan id berisiko sesuai format" },
      ],
      expected: "success_rate=0.67\nci=0.38\nberisiko=t3",
      note: {
        title: "Miskonsepsi: \u201Csatu metrik cukup\u201D",
        type: "pitfall",
        body: "Yang benar: success_rate 67% menyembunyikan bahwa satu \u201Ckeberhasilan\u201D (t3) dicapai lewat loop yang terdeteksi — rapuh dan boros. Metrik tunggal = titik buta. Paket minimal: success_rate + ci + efisiensi langkah + temuan trajectory.",
      },
      hints: [
        "success_rate = sum(t['sukses'])/len(trajs); ci = 1.96*sqrt(p*(1-p)/n).",
        "rata_langkah hanya dari yang sukses: hindari pembagi nol.",
        "berisiko = [t['id'] untuk t yang sukses dan t['loop_terdeteksi']].",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nimport math\nTRAJS = [\n    {"id": "t1", "langkah": 8,  "tool_gagal": 0, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t2", "langkah": 12, "tool_gagal": 2, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t3", "langkah": 47, "tool_gagal": 5, "loop_terdeteksi": True,  "sukses": True},\n    {"id": "t4", "langkah": 50, "tool_gagal": 9, "loop_terdeteksi": True,  "sukses": False},\n    {"id": "t5", "langkah": 6,  "tool_gagal": 0, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t6", "langkah": 30, "tool_gagal": 4, "loop_terdeteksi": False, "sukses": False},\n]\n\ndef mock_judge(t):\n    if not t["sukses"]:\n        return 1\n    if t["loop_terdeteksi"]:\n        return 2\n    return 5 if t["langkah"] <= 10 else 4\n\n# ===== TULIS KODEMU =====\ndef evaluasi(trajs):\n    ...\n\nhasil = evaluasi(TRAJS)\nsr = round(hasil['success_rate'], 2)\nci_v = round(hasil['ci'], 2)\nn_risiko = len(hasil['laporan_risiko'])\nprint(f"success_rate={hasil['success_rate']:.2f}")\nprint(f"ci={hasil['ci']:.2f}")\nprint(f"berisiko={','.join(hasil['laporan_risiko'])}")`,
        lockLines: 15,
        solution: `# ===== MOCK — jangan diubah =====\nimport math\nTRAJS = [\n    {"id": "t1", "langkah": 8,  "tool_gagal": 0, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t2", "langkah": 12, "tool_gagal": 2, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t3", "langkah": 47, "tool_gagal": 5, "loop_terdeteksi": True,  "sukses": True},\n    {"id": "t4", "langkah": 50, "tool_gagal": 9, "loop_terdeteksi": True,  "sukses": False},\n    {"id": "t5", "langkah": 6,  "tool_gagal": 0, "loop_terdeteksi": False, "sukses": True},\n    {"id": "t6", "langkah": 30, "tool_gagal": 4, "loop_terdeteksi": False, "sukses": False},\n]\n\ndef mock_judge(t):\n    if not t["sukses"]:\n        return 1\n    if t["loop_terdeteksi"]:\n        return 2\n    return 5 if t["langkah"] <= 10 else 4\n\n# ===== TULIS KODEMU =====\ndef evaluasi(trajs):\n    n = len(trajs)\n    sukses = [t for t in trajs if t["sukses"]]\n    p = len(sukses) / n\n    ci = 1.96 * math.sqrt(p * (1 - p) / n)\n    rata_langkah = sum(t["langkah"] for t in sukses) / len(sukses) if sukses else 0\n    skor_judge = sum(mock_judge(t) for t in trajs) / n\n    berisiko = [t["id"] for t in sukses if t["loop_terdeteksi"]]\n    return {"success_rate": p, "ci": ci, "rata_langkah": rata_langkah,\n            "skor_judge": skor_judge, "laporan_risiko": berisiko}\n\nhasil = evaluasi(TRAJS)\nsr = round(hasil['success_rate'], 2)\nci_v = round(hasil['ci'], 2)\nn_risiko = len(hasil['laporan_risiko'])\nprint(f"success_rate={hasil['success_rate']:.2f}")\nprint(f"ci={hasil['ci']:.2f}")\nprint(f"berisiko={','.join(hasil['laporan_risiko'])}")`,
        checks: [
          { kind: "defined", task: "t1", name: "evaluasi", label: "`evaluasi` terdefinisi", msg: "Definisikan fungsi evaluasi(trajs) di area editable." },
          { kind: "equal", task: "t1", name: "sr", value: 0.67, tol: 0.01, label: "`success_rate` = 0.67", msg: "4 dari 6 trajectory sukses. Hitung proporsinya." },
          { kind: "equal", task: "t1", name: "ci_v", value: 0.38, tol: 0.01, label: "`ci` = 0.38", msg: "1,96*sqrt(0,67*0,33/6). Jangan lupa akar dan pembagi n." },
          { kind: "equal", task: "t1", name: "n_risiko", value: 1, tol: 1e-9, label: "1 trajectory berisiko (t3)", msg: "Cari yang sukses TETAPI loop_terdeteksi." },
          { kind: "stdout_matches", task: "t2", pattern: "success_rate=0\\.67\\nci=0\\.38\\nberisiko=t3", label: "output tiga baris sesuai format", msg: "4/6 sukses = 0,67; ci = 1,96*sqrt(0,67*0,33/6) = 0,38; t3 sukses tapi loop." },
        ],
      },
      reference: "math.sqrt, dict comprehension, rata-rata bersyarat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: pilih metode evaluasi",
      prose: [
        "Skenario 1 — rilis mingguan, butuh sinyal cepat → TASK SUCCESS RATE pada golden tasks (n ≥ 50) + CI. Murah, otomatis, cukup untuk regresi.",
        "Skenario 2 — agen berperilaku aneh tetapi \u201Cberhasil\u201D → TRAJECTORY EVAL: bedah langkah, tool_gagal, loop. Skor tanpa jejak = diagnosis tanpa pasien.",
        "Skenario 3 — kualitas tulisan/penalaran (tidak ada jawaban pasti) → LLM-AS-JUDGE + RUBRIK + kalibrasi manusia tiap rilis. Judge tanpa rubrik = opini mahal.",
        "Skenario 4 — keputusan berisiko tinggi (kirim ke nasabah) → STEP-LEVEL CHECKS + human review sampel. Di sini biaya evaluasi < biaya kesalahan.",
        "Cara membaca: tiga agen (A, B, C) dengan titik = estimasi success rate dan garis = interval kepercayaan 95%. Agen A: n=40; Agen B: n=200; Agen C: n=10.",
        "Interpretasi: Agen C terlihat terbaik (90%) — tetapi intervalnya 71%–109% (terpotong 100%): klaimnya tidak berarti. Agen B (72% ± 6) sebenarnya LEBIH BAIK dari A (78% ± 13)? Tidak juga — intervalnya tumpang tindih: perbedaannya tidak signifikan. Satu-satunya kesimpulan valid: C butuh n lebih besar; A vs B butuh uji lanjutan.",
        "Aturan praktis 10 detik: (1) Selalu tampilkan CI. (2) n < 30 → jangan klaim menang. (3) Judge → rubrik + kalibrasi. (4) Simpan trajectory selalu.",
        "Skenario: regresi HARIAN di CI/CD → success rate OTOMATIS pada 50 golden tasks (n kecil, sinyal cepat). Jika turun >5 poin → alert, tahan rilis. Murah (50 × Rp2.000 = Rp100 ribu/hari), otomatis, cukup untuk menangkap regresi besar. Ini BUKAN evaluasi komprehensif — ini alarm asap. Alarm asap tidak memadamkan kebakaran; ia membangunkanmu. Evaluasi penuh (n=300 + trajectory) = kuartalan, bukan harian.",
        "Skenario: investigasi INSIDEN (“mengapa agen mengirim ke alamat salah?”) → trajectory MANUAL, bukan agregat. Buka 5 trajectory gagal, baca langkah per langkah, cari divergensi pertama (AAI11). Agregat menjawab “seberapa sering”; forensik menjawab “mengapa”. Keduanya dibutuhkan; urutannya: agregat untuk DETEKSI, forensik untuk DIAGNOSIS. Tim yang hanya punya agregat = dokter yang hanya bisa membaca statistik kematian.",
        "Kapan evaluasi MANUSIA wajib — tiga kondisi. (1) Keputusan berisiko tinggi (kredit, hukum, medis): otomatis tidak cukup. (2) Judge dan manusia tidak sepakat (κ<0,8): judge-nya yang salah, bukan manusianya. (3) Perilaku BARU yang belum ada di golden set: manusia menjelajah, mesin mengukur. Otomatisasi evaluasi memindahkan manusia dari “menilai 1.000 sampel membosankan” ke “menilai 50 sampel yang paling menentukan” — leverage, bukan penggantian.",
        "Skenario pemilihan VENDOR (kasus Dina): 3 vendor × 200 golden tasks × kriteria tertulis. Vendor A: 82% (CI [76, 87]). Vendor B: 78% (CI [72, 83]). Vendor C: 91% (CI [86, 94]). Interval A dan B BERTUMPUK → tidak bisa dibedakan → pilih yang lebih murah / uji 300 lagi. C terpisah jelas → pemenang. Tanpa CI: “82 vs 78, A menang!” — kesimpulan yang SALAH secara statistik. Pengadaan tanpa statistik = membeli berdasarkan noise.",
        "Skenario evaluasi KONTINU (bukan snapshot): tiap 1.000 tugas produksi, sampel 50 untuk evaluasi. Plot tren mingguan: 82% → 81% → 79% → 76% — PENURUNAN BERTAHAP (drift!). Snapshot kuartalan akan menangkapnya 2 bulan terlambat. Evaluasi kontinu = EKG pasien; snapshot = cek tahunan. Untuk sistem yang hidup (distribusi bergeser), EKG > cek tahunan. Biaya: 50 × Rp2.000 × 4 = Rp400 ribu/bulan — EKG yang murah.",
      ],
      note: {
        title: "💡 Intuisi: ukur perjalanan, bukan cuma tujuan",
        body: "Agen yang sukses dalam 40 langkah boros membawa tiga risiko tersembunyi: biaya (5×), latency, dan peluang loop di produksi. Trajectory eval = rekam medis agen; success rate = foto KTP-nya. KTP tidak memberi tahu kamu ia sakit — rekam medis ya. Jangan pernah memilih agen hanya dari foto KTP-nya.",
      },
      figure: {
        svg: EVAL_SVG,
        alt: "Tiga agen dengan success rate dan interval kepercayaan berbeda-beda.",
        caption: "Tanpa interval kepercayaan, \u201C90%\u201D dari 10 tugas terlihat seperti kemenangan.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: berapa n yang kamu butuhkan?",
      prose: [
        "Dina ingin membuktikan agen barunya (target 80% sukses) lebih baik dari agen lama (70%). Berapa golden tasks yang dibutuhkan agar perbedaan 10 poin signifikan pada 95% confidence?",
        "Aturan kasar: untuk membedakan p1 − p2 = 0,10 di sekitar p ≈ 0,75, dibutuhkan n ≈ 16 × p(1−p) / d² = 16 × 0,1875 / 0,01 = 300 tugas per agen. Tiga ratus! Bukan 10, bukan 30.",
        "Dengan n = 50: CI masing-masing ≈ ±12 poin — interval 70%±12 dan 80%±12 tumpang tindih lebar. Kesimpulan: \u201Cbelum bisa dibedakan\u201D. Inilah kenapa tim yang mengevaluasi dengan 10 tugas selalu \u201Cmenemukan\u201D perbaikan — noise menyamar sebagai sinyal.",
        "Biaya: tiap golden task butuh 5 menit review manusia untuk validasi awal (Rp85.000/jam → Rp7.083). 300 tugas = Rp2,1 juta sekali bangun — murah dibanding keputusan salah pilih agen yang berjalan setahun.",
        "Pembahasan: pelajaran angkanya — evaluasi yang meyakinkan itu MAHAL di awal (bangun golden set) tetapi MURAH selamanya (jalan otomatis tiap rilis). Tim yang pelit di sini membayar dengan keputusan buta setiap pekan.",
        "Jika target bedanya 5 poin (bukan 10): n = 16 × 0,1875 / 0,0025 = 1.200 tugas per agen. Empat kali lipat data untuk setengah perbedaan! Inilah hukum kuadrat yang menyakitkan: presisi 2× = biaya 4×. Implikasi bisnis: TANYAKAN dulu “apakah beda 5 poin mengubah keputusan?” Jika agen 75% vs 80% sama-sama “belum cukup baik untuk rilis”, JANGAN bayar 1.200 evaluasi untuk membedakannya. Evaluasi = uang; belanjakan sesuai nilai keputusannya.",
        "Biaya evaluasi sebagai premi asuransi: 300 tugas × Rp2.000 token = Rp600.000 per agen per rilis. Rilis mingguan = Rp2,4 juta/bulan. Bandingkan dengan kontrak vendor Rp500 juta/tahun yang dievaluasi dengan “demo 3 tugas”. Premi Rp2,4 juta/bulan untuk melindungi keputusan Rp500 juta = 0,5% — asuransi termurah yang pernah ada. Perusahaan yang “tidak sempat” evaluasi selalu punya waktu untuk postmortem kontrak yang gagal.",
        "Jebakan n besar: 1.200 tugas × 40 langkah × Rp150/1.000 × 2.000 token = Rp14,4 juta per evaluasi. Solusi: evaluasi BERTINGKAT. Tingkat 1 (50 tugas, Rp600 ribu): saring — gagal di sini = jangan lanjut. Tingkat 2 (300 tugas): yang lolos tingkat 1. Tingkat 3 (1.200 tugas): hanya untuk keputusan rilis besar. Bertingkat = bayar mahal hanya untuk kandidat yang layak. Seperti rekrutmen: CV dulu (murah), baru assessment center (mahal).",
        "Sequential testing — berhenti lebih awal (hemat!). Daripada fixed n=300, cek tiap 50: jika perbedaan sudah signifikan (p<0,01) → STOP, putuskan. Ekspektasi n turun 30–50% jika perbedaan besar. Untuk kasus Dina (beda 10 poin, besar): mungkin cukup n=150 → hemat Rp300 ribu. Tetapi: sequential testing butuh koreksi statistik (alpha spending) — jangan cek tiap 50 dengan p<0,05 mentah (false positive meledak!). Pakai O’Brien-Fleming atau minta statistikawan. Hemat yang benar > hemat yang salah.",
        "Biaya FALSE POSITIVE evaluasi — yang jarang dihitung. Evaluasi (n=300) salah menyimpulkan “agen baru lebih baik” (padahal tidak): rilis → 2 pekan produksi buruk → rollback. Biaya: 14 hari × 100 laporan × (biaya kesalahan tambahan Rp50.000) = Rp70 juta! vs biaya evaluasi yang “benar” (n=1.200, Rp2,4 juta). Pelajaran: evaluasi yang MURAH tetapi SALAH = mahal. Belanjakan evaluasi sesuai TARUHAN keputusannya (AAI1): taruhan Rp70 juta → evaluasi Rp2,4 juta = premi 3,4% yang wajar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model risk yang \u201Clebih baik 5%\u201D dari 20 observasi = noise. Aturan yang sama berlaku untuk backtest strategi: bedakan sinyal dari noise dengan n yang cukup SEBELUM mengubah limit atau modal.",
      },
    },    {
      id: "lab-interval-kepercayaan",
      eyebrow: "Langkah 6 · Lab interval kepercayaan",
      title: "Lab: interval kepercayaan success rate",
      prose: [
        "Golden set 50 tugas: agen sukses 42 kali. Success rate 0,84 terdengar meyakinkan — tetapi dengan 50 sampel, berapa lebar ketidakpastiannya? Tugasmu: hitung standard error dan interval kepercayaan 95 persen (p ± 1,96 × SE), lalu putuskan: apakah batas bawah CI memenuhi ambang 0,70?",
        "Pelajaran AAI8 yang paling sering dilupakan: success rate tanpa interval adalah klaim, bukan bukti. Agen dengan 42/50 (CI 0,738–0,942) dan agen dengan 840/1000 (CI 0,818–0,862) punya angka yang sama tetapi kepastian yang berbeda — yang pertama bisa jadi 0,74, yang kedua hampir pasti di atas 0,81.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p`, `se` = sqrt(p(1-p)/n), dan batas CI 95%" },
        { id: "t2", text: "Putuskan `lulus` (batas bawah CI >= 0.70) dan cetak semuanya" },
      ],
      expected: "p=0.84\nci_bawah=0.738\nci_atas=0.942\nlulus=True",
      note: {
        title: "💡 Intuisi",
        body: "CI yang lebar (0,738–0,942) berarti keputusan “lulus” bergantung pada ambang: ambang 0,70 lulus, ambang 0,80 tidak. Bila ambangmu 0,80, jangan berdebat — tambah sampel sampai CI menyempit.",
      },
      hints: [
        "p = sukses / n; se = (p*(1-p)/n) ** 0.5.",
        "ci_bawah = p - 1.96*se; ci_atas = p + 1.96*se; bulatkan 3 desimal.",
      ],
      code: {
        starter: `# DATA — jangan diubah
N, SUKSES = 50, 42
AMBANG = 0.70

# TULIS KODEMU
import math
p = ...
se = ...
ci_bawah = ...
ci_atas = ...
lulus = ...

print(f"p={p:.2f}")
print(f"ci_bawah={ci_bawah:.3f}")
print(f"ci_atas={ci_atas:.3f}")
print(f"lulus={lulus}")`,
        lockLines: 5,
        solution: `# DATA — jangan diubah
N, SUKSES = 50, 42
AMBANG = 0.70

# TULIS KODEMU
import math
p = SUKSES / N
se = (p * (1 - p) / N) ** 0.5
ci_bawah = round(p - 1.96 * se, 3)
ci_atas = round(p + 1.96 * se, 3)
lulus = ci_bawah >= AMBANG

print(f"p={p:.2f}")
print(f"ci_bawah={ci_bawah:.3f}")
print(f"ci_atas={ci_atas:.3f}")
print(f"lulus={lulus}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.84, tol: 1e-9, label: "`p` = 0.84", msg: "42/50 = 0,84." },
          { kind: "equal", task: "t1", name: "se", value: 0.05185, tol: 0.0001, label: "`se` sekitar 0.0519", msg: "Akar(0,84 x 0,16 / 50) = 0,05185." },
          { kind: "equal", task: "t2", name: "ci_bawah", value: 0.738, tol: 0.001, label: "`ci_bawah` = 0.738", msg: "0,84 − 1,96 x 0,05185 = 0,738." },
          { kind: "equal", task: "t2", name: "ci_atas", value: 0.942, tol: 0.001, label: "`ci_atas` = 0.942", msg: "0,84 + 1,96 x 0,05185 = 0,942." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.84\\nci_bawah=0\\.738\\nci_atas=0\\.942\\nlulus=True", label: "output empat baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Success rate tanpa interval = klaim. CI 95% = p ± 1,96 x SE.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Hitung CI dengan tenang — rumusnya ada di atas.",
        "Refleksi akhir track evaluasi: semua yang penting harus DIUKUR, semua yang diukur harus JUJUR (CI, n, metodologi), dan semua pengukuran harus BERUJUNG KEPUTUSAN. Evaluasi tanpa keputusan = hobi mahal. Sebelum merancang evaluasi apa pun, tulis dulu: “keputusan apa yang akan saya ambil berdasarkan hasilnya?” Jika jawabannya “tidak ada” — jangan evaluasi; kerjakan yang lain. Pengukuran adalah alat, bukan tujuan.",
      ],
      tasks: [],
      summary: [
        "Task success rate butuh kriteria sukses TERTULIS dan golden tasks yang dikunci.",
        "p̂ ± 1,96√(p̂(1−p̂)/n): n kecil → klaim kosong. Jangan umumkan kemenangan dari n=10.",
        "Trajectory eval: bedah JALANNYA (langkah, tool_gagal, loop), bukan hanya hasilnya.",
        "LLM-as-judge: rubrik tertulis + kalibrasi manusia; waspadai verbosity & self-preference bias.",
        "Simpan trajectory selalu — replay adalah alat diagnosis masa depan.",
      ],
      next: { label: "AAI9 — Guardrail & Human-in-the-Loop", href: "/v2/learn/aai9-guardrail" },
      quiz: [
        {
          q: "Agen C: 9 sukses dari 10 tugas (90%). Klaim \u201Cterbaik\u201D…",
          options: [
            { text: "Valid, 90% > 78%", why: "CI-nya 71%–100%: rentang 29 poin. Klaim \u201Cterbaik\u201D tidak didukung data.", },
            { text: "Tidak valid — interval kepercayaannya terlalu lebar untuk klaim itu", why: "Tepat. n=10 tidak cukup untuk membedakan 90% dari 78%.", correct: true },
            { text: "Valid jika memakai LLM judge", why: "Judge tidak memperbaiki n kecil.", },
            { text: "Tidak valid karena harus 100%", why: "Bukan soal 100% — soal ketidakpastian estimasi.", },
          ],
        },
        {
          q: "p̂ = 0,67, n = 6. Setengah-lebar CI 95%?",
          options: [
            { text: "0,38", why: "1,96 × √(0,67×0,33/6) = 1,96 × 0,192 = 0,377 ≈ 0,38.", correct: true },
            { text: "0,19", why: "Itu standard error-nya saja — belum dikali 1,96.", },
            { text: "0,67", why: "Itu estimasinya, bukan ketidakpastiannya.", },
            { text: "0,05", why: "Terlalu sempit untuk n=6.", },
          ],
        },
        {
          q: "Dua agen sama-sama sukses, tetapi satu 47 langkah dengan loop terdeteksi. Apa artinya?",
          options: [
            { text: "Tidak masalah, yang penting sukses", why: "Itulah jebakan metrik tunggal — t3 di lab membuktikan kerapuhannya.", },
            { text: "Keberhasilan yang rapuh: boros, berisiko gagal di variasi tugas", why: "Tepat. Trajectory eval menangkap yang disembunyikan success rate.", correct: true },
            { text: "Agen itu lebih pintar karena mencoba banyak", why: "47 langkah dengan loop = nyasar, bukan eksplorasi cerdas.", },
            { text: "Harus dihapus dari data", why: "Justru data berharga — masukkan ke laporan_risiko.", },
          ],
        },
        {
          q: "Praktik terbaik memakai LLM-as-judge?",
          options: [
            { text: "Minta judge menilai tanpa rubrik agar natural", why: "Tanpa rubrik, skor = opini tak terkalibrasi.", },
            { text: "Rubrik tertulis + kalibrasi berkala terhadap penilai manusia", why: "Tepat. Inilah yang membedakan judge sebagai instrumen dari judge sebagai hiburan.", correct: true },
            { text: "Pakai model terbesar sebagai judge", why: "Ukuran tidak menghilangkan bias verbosity/self-preference.", },
            { text: "Judge hanya menilai panjang jawaban", why: "Panjang ≠ kualitas — itu justru bias yang harus dilawan.", },
          ],
        },
        {
          q: "Kenapa golden tasks harus DIKUNCI antar rilis?",
          options: [
            { text: "Agar murah", why: "Bukan soal biaya.", },
            { text: "Agar perbandingan antar versi agen valid (apel vs apel)", why: "Tepat. Tugas yang berubah = benchmark yang bergeser = klaim perbaikan yang tak terbukti.", correct: true },
            { text: "Agar agen bisa menghafalnya", why: "Menghafal golden set = overfitting evaluasi, justru harus dihindari.", },
            { text: "Agar tidak perlu CI", why: "CI tetap dibutuhkan.", },
          ],
        },
        {
          q: "Agen sukses 42 dari 50 tugas (p=0,84). Interval kepercayaan 95 persennya dan artinya?",
          options: [
            { text: "0,738–0,942: nilai sebenarnya kemungkinan besar di rentang itu — bukan tepat 0,84", why: "Benar: SE = 0,0519; 1,96 x SE = 0,102; 0,84 ± 0,102. Ambang 0,70 lulus, ambang 0,80 tidak.", correct: true },
            { text: "0,84–0,84: 50 sampel sudah cukup untuk angka pasti", why: "Salah: 50 sampel memberi SE 0,052 — ketidakpastian ±0,10.", },
            { text: "0,70–0,98: asal tebak saja", why: "Salah: rentangnya dihitung dari SE, bukan ditebak.", },
            { text: "Tidak bisa dihitung tanpa 1.000 sampel", why: "Salah: CI bisa dihitung untuk n berapa pun — hanya lebarnya yang berubah.", },
          ],
        },
        {
          q: "Dua agen sama-sama success rate 0,84: A diuji 50 tugas, B diuji 1.000 tugas. Mana yang lebih bisa dipercaya?",
          options: [
            { text: "Sama — angkanya sama", why: "Salah: angka sama, kepastian berbeda — CI A lebar (0,738–0,942), CI B sempit (0,818–0,862).", },
            { text: "B — interval kepercayaannya jauh lebih sempit sehingga nilainya lebih pasti", why: "Benar: n besar menyempitkan SE. Evaluasi yang baik melaporkan n dan CI, bukan hanya persentase.", correct: true },
            { text: "A — sampel kecil lebih jujur", why: "Salah: sampel kecil justru memberi ketidakpastian besar.", },
            { text: "Tidak bisa dibandingkan", why: "Salah: justru CI-lah alat pembandingnya.", },
          ],
        },
      ],
    },
  ],
};
