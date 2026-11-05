import type { V2Lesson } from "../lib/types";

// Arsitektur gabungan semua lesson: komponen + alirannya.
const CAP_SVG = `<svg viewBox="0 0 480 260" role="img" aria-label="Arsitektur agen capstone: planner, executor, memory, tools, guardrail, dan evaluator terhubung dalam loop.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="180" y="8" width="120" height="36" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="1.6"/><text x="240" y="31" fill="var(--text)" font-weight="600">PLANNER</text>
<rect x="180" y="216" width="120" height="36" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.6"/><text x="240" y="239" fill="var(--text)" font-weight="600">EXECUTOR</text>
<rect x="16" y="108" width="120" height="44" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="1.6"/><text x="76" y="126" fill="var(--text)" font-weight="600">MEMORY</text><text x="76" y="143" fill="var(--chart-text)" font-size="10">ringkas + vector</text>
<rect x="344" y="108" width="120" height="44" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.6"/><text x="404" y="126" fill="var(--text)" font-weight="600">TOOLS</text><text x="404" y="143" fill="var(--chart-text)" font-size="10">search·hitung·tulis</text>
<rect x="180" y="108" width="120" height="44" rx="8" fill="var(--c5)" opacity="0.3" stroke="var(--c5)" stroke-width="1.8"/><text x="240" y="126" fill="var(--text)" font-weight="600">GUARDRAIL</text><text x="240" y="143" fill="var(--chart-text)" font-size="10">tier + approval</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" fill="none" marker-end="url(#ah12)">
<defs><marker id="ah12" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<line x1="240" y1="44" x2="240" y2="104"/>
<line x1="240" y1="152" x2="240" y2="212"/>
<path d="M180 120 C 150 118, 140 118, 138 120"/>
<path d="M300 120 C 330 118, 340 118, 342 120"/>
<path d="M136 140 C 120 170, 150 200, 195 214"/>
<path d="M344 140 C 360 170, 330 200, 285 214"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)" text-anchor="middle">
<text x="240" y="70">rencana terstruktur</text>
<text x="240" y="188">aksi tervalidasi</text>
<text x="76" y="170">baca / tulis</text>
<text x="404" y="170">panggil</text>
<text x="150" y="108">evaluator: skor tiap laporan</text>
<text x="330" y="108">trace: tiap span tercatat</text>
</g>
</svg>`;

export const aai12: V2Lesson = {
  slug: "aai12-capstone",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI12 — Capstone: Agen Analisis End-to-End",
  estMinutes: 75,
  steps: [
    {
      id: "brief",
      eyebrow: "Langkah 1 · Brief",
      title: "Brief dari CTO: \u201Cbuatkan agennya\u201D",
      prose: [
        "Jumat sore. CTO memanggil Dina: \u201CTim butuh agen analisis. Tiap Jumat ia meneliti topik risiko, memakai tools yang ada, dan menghasilkan laporan satu halaman. Buatkan.\u201D Dina mengangguk — lalu bertanya: \u201CTopik risikonya ditentukan siapa? Laporannya dikirim ke mana? Kalau datanya tidak ada, agen boleh mengarang?\u201D CTO terdiam. Brief satu kalimat itu menyimpan 10 keputusan desain.",
        "Twist-nya — dan ini pelajaran capstone terpenting: agen yang baik TAHU KAPAN BERTANYA BALIK. Sebelum satu baris kode ditulis, Dina memaksa klarifikasi: (1) topik dipilih analis manusia tiap Kamis; (2) laporan = draf di folder, BUKAN terkirim otomatis (tier-1, bukan tier-2); (3) data kosong → tulis \u201Ctidak ada data\u201D, jangan karang; (4) sukses = skor rubrik ≥ 0,8.",
        "Brief yang diklarifikasi menjadi SPESIFIKASI: input (topik + daftar tools), proses (loop ReAct maks 6 langkah, memory ringkas, guardrail tier), output (laporan terstruktur + sitasi), evaluasi (rubrik skor). Semua yang kamu pelajari di AAI1–AAI11 bertemu di sini.",
        "Tujuan pembelajaran — setelah capstone ini kamu bisa: (1) menerjemahkan brief ambigu menjadi spesifikasi agen; (2) membangun agen end-to-end dengan mock tools; (3) menilai laporan dengan rubrik; (4) memutuskan kesiapan deploy ke produksi.",
        "Daftar isi: 1) Brief & klarifikasi · 2) Arsitektur gabungan · 3) Lab 1: agen end-to-end · 4) Lab 2: evaluasi trajectory · 5) Peta keputusan deploy · 6) Mini-case: nilai vs biaya · 7) Checkpoint.",
        "Checklist klarifikasi Dina — 5 pertanyaan yang ia ajukan SEBELUM coding (dan yang harus kamu ajukan untuk setiap brief ambigu). (1) Siapa yang MEMILIH topik? (2) Apa DEFINISI “selesai”? (3) Apa yang TIDAK BOLEH dilakukan agen? (4) Siapa yang MENILAI hasilnya? (5) Berapa ANGGARAN (langkah, rupiah)? Lima pertanyaan, 15 menit — menghemat 2 pekan membangun yang salah. Brief yang tidak bisa menjawab kelimanya = brief yang belum siap dikerjakan. Berani bertanya balik = skill capstone yang paling berharga.",
      ],
      tasks: [],
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 2 · Arsitektur",
      title: "Menyatukan 11 lesson menjadi satu sistem",
      prose: [
        "Petakan tiap lesson ke komponen. AAI1–AAI2: loop sense–plan–act–observe + tujuan eksplisit. AAI3: tools sebagai kontrak (search, hitung, tulis) dengan validasi + retry. AAI4: memory beranggaran — bukti penting disimpan, riwayat basi diringkas. AAI5: search_kb sebagai tool opsional dengan gerbang confidence. AAI6: satu agen dulu — multi-agent hanya jika spesialisasi menuntut. AAI7: prompt = spesifikasi; output laporan mengikuti skema. AAI8: rubrik skor untuk tiap laporan. AAI9: tulis = tier-1 (draf + audit), kirim = tier-2 (butuh manusia). AAI10: state eksplisit + checkpoint. AAI11: tiap span tercatat untuk debugging.",
        "Rubrik penilaian laporan (skor 0–1): KELENGKAPAN (apakah semua fakta yang diminta terkumpul?), AKURASI (apakah fakta terverifikasi tool, bukan karangan?), SITASI (apakah tiap klaim tertelusur ke sumber?). Bobot: 40/40/20 — karena laporan lengkap tetapi salah lebih berbahaya daripada laporan pendek tetapi jujur.",
        "Keputusan desain yang diambil Dina dari klarifikasi: (1) topik dari manusia — agen tidak memilih topik sendiri (di luar mandat); (2) maks 6 langkah — laporan mingguan tidak butuh eksplorasi dalam; (3) tidak ada tool kirim — agen hanya menulis draf (tier-1), manusia yang mengirim.",
        "Rubrik 40/40/20 dalam praktik — contoh penilaian. Laporan X: kelengkapan 0,9 (semua fakta ada), akurasi 0,7 (2 angka salah), sitasi 0,5 (separuh klaim tanpa sumber). Skor = 0,4×0,9 + 0,4×0,7 + 0,2×0,5 = 0,36 + 0,28 + 0,10 = 0,74 < 0,8 → TIDAK LULUS. Perhatikan: bobot adalah KEBIJAKAN — 40% akurasi berarti “kami memaafkan sitasi buruk tetapi tidak memaafkan angka salah”. Tim lain bisa memilih 30/30/40 (sitasi = kepatuhan). Tidak ada bobot “benar” — ada bobot yang SESUAI RISIKO domainmu. Tulis alasan bobotmu; ia akan ditanya saat audit.",
        "Keputusan “tidak lulus” bukan akhir — ia adalah INPUT. Laporan X (0,74): kirim kembali ke agen dengan feedback terstruktur (“2 angka salah: …; lengkapi sitasi untuk …”) → iterasi 2. Pola ini = SELF-REFINE dengan rubrik sebagai juri (AAI8). Batasi 2 iterasi: yang tidak lulus setelah 2× = eskalasi manusia (bukan iterasi ke-5 yang mahal dan putus asa). Capstone yang baik = sistem yang tahu kapan MENYERAH dengan elegan — bukan yang mencoba selamanya.",
      ],
      formula: String.raw`\text{skor} = 0{,}4 \cdot \text{kelengkapan} + 0{,}4 \cdot \text{akurasi} + 0{,}2 \cdot \text{sitasi}`,
      formulaNote: "skor = 0,4×kelengkapan + 0,4×akurasi + 0,2×sitasi (0–1). Kelengkapan = proporsi fakta yang diminta dan terkumpul; akurasi = proporsi fakta yang terverifikasi benar; sitasi = proporsi klaim yang tertelusur ke sumber. Bobot 40/40/20 = kebijakan: akurasi dan kelengkapan masing-masing 2× lebih penting dari sitasi. Lulus jika skor ≥ 0,8 DAN tidak boros (dua gerbang).",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Ccapstone = gabungkan semua fitur\u201D",
        type: "pitfall",
        body: "Yang benar: capstone = gabungkan semua KEPUTUSAN. Dina justru MEMBUANG fitur: tanpa multi-agent, tanpa tool kirim, tanpa RAG otomatis. Setiap komponen yang tidak dipakai adalah risiko yang tidak diambil. Desain terbaik sering terlihat \u201Clebih kecil\u201D dari yang dibayangkan.",
      },
      hints: [
        "Intuisi: spesifikasi yang bagus menjawab \u201Capa yang TIDAK boleh dilakukan agen\u201D sama tegasnya dengan \u201Capa yang harus dilakukan\u201D.",
        "Intuisi: bobot rubrik adalah kebijakan: 40% akurasi berkata \u201Clebih baik jujur-tak-lengkap daripada lengkap-tapi-salah\u201D. Sesuaikan bobot dengan risikomu.",
      ],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 3 · Lab 1",
      title: "Lab 1: agen analisis end-to-end (mock)",
      prose: [
        "Waktunya membangun. Mock menyediakan: `KB` (knowledge base), `tool_search`, `tool_hitung`, `tool_tulis` (mencatat ke AUDIT — tier-1), dan `mock_rencana` yang mengembalikan 4 langkah untuk topik apa pun.",
        "Tugasmu: (1) implementasikan `agen_capstone(topik, max_steps=6)` — eksekusi rencana langkah per langkah: `search` → simpan ke bukti, `hitung` → simpan sebagai `perubahan_ihsg`, `tulis` → rangkai laporan dan panggil tool_tulis; hormati max_steps; (2) implementasikan `nilai_laporan(hasil)` — kelengkapan = len(bukti)/3, akurasi = 1 jika fakta terverifikasi (bukan \u201Ctidak ada data\u201D), sitasi = 1 jika langkah ≥ 3; kembalikan skor bulat 2 desimal.",
        "Coba eksplorasi: ubah mock_rencana agar satu search mengembalikan \u201Ctidak ada data\u201D. Berapa skornya? Agen tetap \u201Cselesai\u201D tetapi akurasinya jatuh — itulah kenapa rubrik lebih jujur dari sekadar \u201Cberhasil/tidak\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `agen_capstone` dengan loop max_steps dan tiga jenis aksi" },
        { id: "t2", text: "Implementasikan `nilai_laporan` sesuai rubrik dan cetak hasilnya" },
      ],
      expected: "langkah=4\nperubahan_ihsg=0.84\nskor=1.0",
      note: {
        title: "Miskonsepsi: \u201Cskor 1,0 berarti agen sempurna\u201D",
        type: "pitfall",
        body: "Yang benar: skor 1,0 pada mock dengan 3 fakta bukan bukti kesiapan produksi — ia bukti ARSlTEKTUR berjalan. Produksi butuh golden tasks nyata (AAI8), guardrail (AAI9), dan observability (AAI11). Jangan tertukar antara \u201Ckode berjalan\u201D dan \u201Csistem siap\u201D.",
      },
      hints: [
        "Loop: for aksi, arg in mock_rencana(topik): jika langkah >= max_steps: break; langkah += 1; ...",
        "Untuk tulis: isi = f\"Topik: {topik}\" + bukti yang dirangkai; panggil tool_tulis.",
        "nilai: kelengkapan = min(1.0, len(bukti)/3); akurasi dari \"tidak ada data\"; sitasi dari langkah.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nKB = {"suku bunga": "BI 6,25% (Mar 2026)", "ihsg": "IHSG 7412 (+0,8%)"}\nAUDIT = []\n\ndef tool_search(q):\n    return KB.get(q, "tidak ada data")\n\ndef tool_hitung(expr):\n    return round(eval(expr, {"__builtins__": {}}, {}), 2)\n\ndef tool_tulis(nama, isi):\n    AUDIT.append(nama)\n    return f"tersimpan:{nama}"\n\ndef mock_rencana(topik):\n    return [("search", "suku bunga"), ("search", "ihsg"),\n            ("hitung", "(7412-7350)/7350*100"), ("tulis", "laporan")]\n\n# ===== TULIS KODEMU =====\ndef agen_capstone(topik, max_steps=6):\n    ...\n\ndef nilai_laporan(hasil):\n    ...\n\nhasil = agen_capstone("risiko pasar pekan ini")\nskor = nilai_laporan(hasil)\nprint(f"langkah={hasil['langkah']}")\nprint(f"perubahan_ihsg={hasil['bukti']['perubahan_ihsg']}")\nprint(f"skor={skor}")`,
        lockLines: 15,
        solution: `# ===== MOCK — jangan diubah =====\nKB = {"suku bunga": "BI 6,25% (Mar 2026)", "ihsg": "IHSG 7412 (+0,8%)"}\nAUDIT = []\n\ndef tool_search(q):\n    return KB.get(q, "tidak ada data")\n\ndef tool_hitung(expr):\n    return round(eval(expr, {"__builtins__": {}}, {}), 2)\n\ndef tool_tulis(nama, isi):\n    AUDIT.append(nama)\n    return f"tersimpan:{nama}"\n\ndef mock_rencana(topik):\n    return [("search", "suku bunga"), ("search", "ihsg"),\n            ("hitung", "(7412-7350)/7350*100"), ("tulis", "laporan")]\n\n# ===== TULIS KODEMU =====\ndef agen_capstone(topik, max_steps=6):\n    bukti = {}\n    langkah = 0\n    for aksi, arg in mock_rencana(topik):\n        if langkah >= max_steps:\n            break\n        langkah += 1\n        if aksi == "search":\n            bukti[arg] = tool_search(arg)\n        elif aksi == "hitung":\n            bukti["perubahan_ihsg"] = tool_hitung(arg)\n        elif aksi == "tulis":\n            isi = f"Topik: {topik}\\n" + "\\n".join(f"- {k}: {v}" for k, v in bukti.items())\n            tool_tulis("laporan-jumat.txt", isi)\n    return {"langkah": langkah, "bukti": bukti}\n\ndef nilai_laporan(hasil):\n    bukti = hasil["bukti"]\n    kelengkapan = min(1.0, len(bukti) / 3)\n    akurasi = 0.0 if "tidak ada data" in bukti.values() else 1.0\n    sitasi = 1.0 if hasil["langkah"] >= 3 else 0.0\n    return round(0.4 * kelengkapan + 0.4 * akurasi + 0.2 * sitasi, 2)\n\nhasil = agen_capstone("risiko pasar pekan ini")\nskor = nilai_laporan(hasil)\nprint(f"langkah={hasil['langkah']}")\nprint(f"perubahan_ihsg={hasil['bukti']['perubahan_ihsg']}")\nprint(f"skor={skor}")`,
        checks: [
          { kind: "defined", task: "t1", name: "agen_capstone", label: "`agen_capstone` terdefinisi", msg: "Definisikan fungsi agen_capstone(topik, max_steps=6)." },
          { kind: "defined", task: "t2", name: "nilai_laporan", label: "`nilai_laporan` terdefinisi", msg: "Definisikan fungsi nilai_laporan(hasil) sesuai rubrik." },
          { kind: "equal", task: "t2", name: "skor", value: 1.0, tol: 1e-9, label: "`skor` = 1.0", msg: "0,4×1 + 0,4×1 + 0,2×1. Cek tiap komponen rubrik." },
          { kind: "stdout_matches", task: "t2", pattern: "langkah=4\\nperubahan_ihsg=0\\.84\\nskor=1\\.0", label: "output tiga baris sesuai format", msg: "(7412−7350)/7350×100 = 0,84. Samakan format print." },
        ],
      },
      reference: "eval terbatas, dict bukti, rubrik 0,4/0,4/0,2.",
    },
    {
      id: "lab2",
      eyebrow: "Langkah 4 · Lab 2",
      title: "Lab 2: evaluasi 3 trajectory capstone",
      prose: [
        "Tiga analis menguji agenmu dengan topik berbeda. Trajectory-nya (skor, langkah, loop): A = (0,95; 4; tidak), B = (0,55; 6; tidak — satu fakta \u201Ctidak ada data\u201D), C = (0,90; 14; YA — loop search berulang).",
        "Tugasmu: implementasikan `rekap(trajs)` — hitung `rata_skor`, `lulus` (skor ≥ 0,8), dan `boros` (id dengan langkah > 10 ATAU loop). Cetak sesuai format. Pertanyaan kunci: trajectory C skor 0,90 tetapi boros — lulus atau tidak?",
        "Pembahasan: C adalah \u201Ct3 dari AAI8\u201D — keberhasilan yang rapuh. Keputusan Dina: C TIDAK lulus tanpa perbaikan; skor tanpa efisiensi = bom biaya di produksi. Inilah kenapa evaluasi capstone memakai DUA gerbang: skor ≥ 0,8 DAN tidak boros.",
      ],
      note: {
        title: "💡 Intuisi: dua gerbang kelulusan, bukan satu",
        body: "Trajectory C (skor 0,90, 14 langkah + loop) mengajarkan: skor SAJA tidak cukup. Gerbang 1 = kualitas (skor ≥ 0,8); gerbang 2 = efisiensi (langkah ≤ 10, tanpa loop). Lolos keduanya = produksi; lolos satu = perbaikan. Sistem satu gerbang meloloskan “bom biaya yang akurat” — akurat tetapi bangkrut. Dua gerbang = kualitas DAN keberlanjutan.",
      },
      tasks: [
        { id: "t1", text: "Implementasikan `rekap` dengan rata_skor, lulus, dan deteksi boros" },
      ],
      expected: "rata_skor=0.8\nlulus=2\nboros=C",
      hints: [
        "rata_skor = sum skor / n; bulatkan 2 desimal.",
        "lulus = hitung yang skor >= 0.8.",
        "boros = [id untuk t jika t['langkah'] > 10 or t['loop']].",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====\nTRAJS = [\n    {"id": "A", "skor": 0.95, "langkah": 4, "loop": False},\n    {"id": "B", "skor": 0.55, "langkah": 6, "loop": False},\n    {"id": "C", "skor": 0.90, "langkah": 14, "loop": True},\n]\n\n# ===== TULIS KODEMU =====\ndef rekap(trajs):\n    ...\n\nr = rekap(TRAJS)\nrata = r['rata_skor']\nnlulus = r['lulus']\nprint(f"rata_skor={r['rata_skor']}")\nprint(f"lulus={r['lulus']}")\nprint(f"boros={','.join(r['boros'])}")`,
        lockLines: 6,
        solution: `# ===== DATA — jangan diubah =====\nTRAJS = [\n    {"id": "A", "skor": 0.95, "langkah": 4, "loop": False},\n    {"id": "B", "skor": 0.55, "langkah": 6, "loop": False},\n    {"id": "C", "skor": 0.90, "langkah": 14, "loop": True},\n]\n\n# ===== TULIS KODEMU =====\ndef rekap(trajs):\n    n = len(trajs)\n    rata = round(sum(t["skor"] for t in trajs) / n, 2)\n    lulus = sum(1 for t in trajs if t["skor"] >= 0.8)\n    boros = [t["id"] for t in trajs if t["langkah"] > 10 or t["loop"]]\n    return {"rata_skor": rata, "lulus": lulus, "boros": boros}\n\nr = rekap(TRAJS)\nrata = r['rata_skor']\nnlulus = r['lulus']\nprint(f"rata_skor={r['rata_skor']}")\nprint(f"lulus={r['lulus']}")\nprint(f"boros={','.join(r['boros'])}")`,
        checks: [
          { kind: "defined", task: "t1", name: "rekap", label: "`rekap` terdefinisi", msg: "Definisikan fungsi rekap(trajs)." },
          { kind: "equal", task: "t1", name: "rata", value: 0.8, tol: 1e-9, label: "`rata_skor` = 0.8", msg: "(0,95+0,55+0,90)/3 = 0,80." },
          { kind: "equal", task: "t1", name: "nlulus", value: 2, tol: 1e-9, label: "`lulus` = 2 (A dan C)", msg: "Skor >= 0,8: A dan C." },
          { kind: "stdout_matches", task: "t1", pattern: "rata_skor=0\\.8\\nlulus=2\\nboros=C", label: "output tiga baris sesuai format", msg: "(0,95+0,55+0,90)/3 = 0,80. A dan C lulus skor; C boros." },
        ],
      },
      reference: "sum() generator, dua gerbang kelulusan: skor dan efisiensi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: siap deploy ke produksi?",
      prose: [
        "Checklist Dina sebelum agen menyentuh produksi — lima gerbang, semuanya harus hijau.",
        "Gerbang 1 — EVALUASI: ≥50 golden tasks, success rate + CI memenuhi target, tidak ada pola boros sistemik. Gerbang 2 — GUARDRAIL: semua tools terpetakan ke tier; tier-2/3 teruji; kill switch diuji.",
        "Gerbang 3 — OBSERVABILITY: tiap span tercatat; detektor loop aktif; dasbor biaya per tugas. Gerbang 4 — ROLLBACK: checkpoint + versi agen sebelumnya bisa dikembalikan <15 menit.",
        "Gerbang 5 — MANUSIA: ada pemilik yang paham arsitekturnya (bukan hanya vendor), dan analis tahu kapan harus curiga pada output agen.",
        "Cara membaca: enam kotak = enam komponen; panah = aliran data/keputusan; guardrail di tengah mengawasi executor; evaluator dan trace di sisi sebagai pengamat independen.",
        "Interpretasi: perhatikan evaluator dan trace TIDAK berada di jalur utama — mereka pengamat, bukan peserta. Itulah prinsipnya: yang menilai tidak boleh yang menjalankan. Dan guardrail duduk DI ANTARA planner dan executor — bukan sebagai tempelan sesudahnya.",
        "Aturan praktis 10 detik: lima gerbang hijau → deploy bertahap (10% traffic dulu). Satu merah → perbaiki dulu. Tidak ada \u201Cnanti saja\u201D untuk guardrail.",
      ],
      note: {
        title: "💡 Intuisi: checklist sebelum produksi = pre-flight",
        body: "Pilot tidak terbang karena “kayaknya siap” — ia menjalankan checklist. Lima gerbang Dina (evaluasi, guardrail, observability, biaya, rollback) = pre-flight untuk agen. Yang tergoda melewatkan “karena kemarin lancar” = pilot yang skip checklist karena cuaca cerah. Kecelakaan tidak bertanya cuaca — ia bertanya checklist.",
      },
      figure: {
        svg: CAP_SVG,
        alt: "Arsitektur agen capstone: planner, executor, memory, tools, guardrail, dan evaluator terhubung dalam loop.",
        caption: "Arsitektur akhir: guardrail di tengah, evaluator sebagai pengamat independen.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: nilai vs biaya agen produksi",
      prose: [
        "Investasi: membangun agen capstone = 20 hari insinyur (Rp1,5 juta/hari) = Rp30 juta sekali. Operasional: 50 laporan/minggu × Rp2.000 token = Rp100.000/minggu = Rp400.000/bulan. Evaluasi + maintenance: Rp2 juta/bulan.",
        "Nilai: tiap laporan menghemat 3 jam analis (Rp85.000/jam) = Rp255.000. 200 laporan/bulan = Rp51 juta/bulan nilai waktu. Pengurangan kesalahan: dari 2,4 menjadi 0,4 per laporan (AAI1) — 400 kesalahan dihindari/bulan × Rp70.800 biaya klarifikasi = Rp28,3 juta/bulan.",
        "Total nilai: Rp79,3 juta/bulan vs biaya Rp2,4 juta/bulan. ROI = 33×. Payback investasi Rp30 juta: <2 minggu.",
        "TETAPI — skenario gagal: tanpa guardrail (hemat 5 hari build), satu insiden hapus-data per tahun (peluang 20%) berbiaya Rp500 juta (recovery + reputasi). Expected cost = Rp100 juta/tahun = Rp8,3 juta/bulan — menghapus sepertiga ROI. Dan itu SEBELUM denda regulasi.",
        "Pembahasan: pelajaran angka terakhir track ini — ROI agen hampir selalu terlihat fantastis di spreadsheet, dan expected cost kegagalan hampir selalu diremehkan. Hitung keduanya. Agen yang \u201Cmenghemat Rp79 juta\u201D tetapi membawa expected loss Rp8 juta/bulan tetap layak — tetapi KAMU harus tahu angkanya, bukan terkejut.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Analisis ini = risk-adjusted return untuk proyek AI. Sama seperti portofolio: return tanpa ukuran risiko = angka hampa. Biasakan setiap proposal agen membawa dua angka: ROI dan expected loss.",
      },
    },
    {
      id: "domain-kyc-aml",
      eyebrow: "Langkah 7 · KYC & AML",
      title: "Agen untuk KYC/AML: menyaring, bukan memutus",
      prose: [
        "Senin pagi, 1.400 alert transaksi mencurigakan masuk antrean tim AML. Jumat sore, 1.330 di antaranya ditutup sebagai false positive — dan satu alert yang BENAR-BENAR penting tertimbun di tengahnya, baru ditemukan tiga bulan kemudian saat regulator bertanya. Twist-nya: kegagalan terbesar AML bukan gagal mendeteksi, melainkan gagal mentriase. Deteksi tanpa triase = inbox yang membunuh.",
        "Alur KYC/AML berjalan dalam tiga tahap. Pertama, verifikasi identitas: dokumen, data kependudukan, biometrik — “apakah kamu siapa yang kamu klaim”. Kedua, penyaringan sanksi & watchlist: nama nasabah dicocokkan ke daftar terlarang. Ketiga, pemantauan berkelanjutan: profil perilaku transaksi normal dibangun, lalu penyimpangan ditandai. Tiga tahap, tiga jenis bukti, tiga jenis risiko — agen harus paham ketiganya sebelum boleh menyentuh satu pun.",
        "Peran aman agen: asisten berkas, bukan hakim. Agen BOLEH mengumpulkan bukti dari banyak sumber, merangkum profil nasabah, menandai anomali dengan alasan eksplisit, dan menyusun berkas lengkap untuk analis. Agen TIDAK BOLEH memutuskan blokir, menutup rekening, atau menyatakan seseorang “bersih”. Garisnya sederhana: agen menyiapkan, manusia memutuskan.",
        "Jejak bukti per tanda. Setiap penandaan agen wajib menjawab tiga pertanyaan: KENAPA ditandai (aturan atau pola apa yang terpicu), DATA APA yang dilihat (sumber + rentang tanggal), dan SEBERAPA YAKIN (skor + ambang). Tanpa ketiganya, tanda itu = tuduhan tanpa berkas. Dan regulator suatu hari akan bertanya “siapa yang memutuskan ini” — jawabannya harus nama orang yang menandatangani, bukan versi model. Akuntabilitas tidak bisa didelegasikan ke agen.",
        "False positive adalah beban kerja nyata. Agen penanda dengan recall 99% terdengar hebat — sampai kamu hitung: dari 1 juta transaksi, 1% false positive = 10.000 berkas palsu yang harus dibaca manusia. Tim berkapasitas 200 berkas/hari akan tenggelam dalam 50 hari kerja semu. Alert fatigue bukan teori: analis yang lelah melewatkan yang asli. Metrik yang benar untuk agen penanda = recall PADA ambang operasional + false positive rate + beban triase per analis per hari. Agen yang “tidak pernah melewatkan” tetapi melumpuhkan tim = agen yang gagal.",
        "Data nasabah adalah data paling sensitif yang akan disentuh agenmu. Prinsip akses minimum: agen hanya boleh membaca kolom yang ia butuhkan untuk tugasnya — bukan seluruh tabel nasabah “untuk jaga-jaga”. Log agen wajib diredaksi (nama & nomor rekening disamarkan), dan jangan pernah membawa data nasabah ke tool atau prompt pihak ketiga yang tidak terikat perjanjian. Satu kebocoran = insiden privasi + denda regulasi + kepercayaan yang hilang.",
      ],
      tasks: [
        { id: "t1", text: "Petakan tiga tahap KYC/AML ke peran agen: untuk tiap tahap, tulis SATU hal yang boleh dilakukan agen dan SATU yang tidak boleh" },
        { id: "t2", text: "Hitung beban triase: agen menandai 2% dari 500.000 transaksi/bulan; satu analis membaca 400 berkas/bulan. Berapa analis yang dibutuhkan tim?" },
      ],
      note: {
        title: "Miskonsepsi: “akurasi 99% = aman dipakai”",
        type: "pitfall",
        body: "Yang benar: di skala operasional, 1% kesalahan = ribuan berkas palsu per hari. Akurasi tanpa konteks volume dan kapasitas triase = angka hampa. Tanyakan selalu: “99% dari berapa, dan siapa yang membaca 1% sisanya?”",
      },
      hints: [
        "💡 Intuisi: agen KYC = asisten penyidik. Asisten boleh menyusun map kasus setebal apa pun dan menulis ringkasan — tetapi ia tidak menandatangani surat penangkapan. Jaksa yang menandatangani. Begitu pula agen KYC/AML: pekerjaan bukti seluas apa pun boleh diotomasi; keputusan & tanda tangan tetap milik manusia yang bisa ditanyai regulator.",
      ],
      reference: "Agen = penyusun berkas, manusia = penandatangan. Tiga pertanyaan per tanda: kenapa, data apa, seberapa yakin.",
    },
    {
      id: "domain-credit-rekonsiliasi",
      eyebrow: "Langkah 8 · Kredit & Rekonsiliasi",
      title: "Agen untuk credit memo & rekonsiliasi",
      prose: [
        "Analis kredit senior menghabiskan 6 jam menyusun satu credit memo — 4 jam di antaranya hanya mengumpulkan angka dari lima sistem yang tidak bicara satu sama lain. Memo yang akhirnya ditandatangani bagus; prosesnya boros. Twist-nya: nilai analis bukan di mengumpulkan angka, melainkan di MENILAI angka. Agen yang mengambil alih pengumpulan membebaskan 4 jam penilaian. Itu kemenangan sebenarnya.",
        "Credit memo = dokumen keputusan: profil debitur, analisis keuangan, risiko, rekomendasi. Agen menyusun DRAF dari data terstruktur + dokumen (laporan keuangan, legalitas, agunan): angka terkumpul, rasio terhitung, anomali ditandai. Analis memeriksa, menantang asumsi, lalu MENANDATANGANI. Draf bukan keputusan — tanda tangan analis adalah akuntabilitasnya. Agen yang menulis memo “final” tanpa ruang review = agen yang mencuri pekerjaan analis sekaligus akuntabilitasnya.",
        "Rekonsiliasi: dua sumber harus cocok — buku internal vs mutasi bank, sistem gudang vs catatan kustodian. Agen mencocokkan per aturan (jumlah + tanggal ± toleransi), mendaftar yang cocok otomatis, mengusulkan penjelasan untuk tiap selisih (“jumlah sama, tanggal beda 2 hari — kemungkinan kliring”), dan TIDAK PERNAH memaksa cocok. Manusia menyetujui jurnal penyesuaian. Aturan emas: selisih yang tidak bisa dijelaskan agen = pekerjaan manusia, bukan kegagalan agen.",
        "Pola bersama ketiga domain — KYC/AML, credit memo, rekonsiliasi: agen mempercepat pekerjaan BUKTI; manusia memegang KEPUTUSAN dan tanda tangan. Semakin besar dampak keputusan (blokir nasabah, setujui kredit puluhan miliar, tutup buku), semakin tebal jejak bukti yang wajib ada dan semakin senior penandatangannya. Ini bukan kebetulan — ini desain akuntabilitas: otomasi di hulu, manusia di titik keputusan.",
        "Metrik keberhasilan agen domain: (1) waktu susun berkas — dari 6 jam ke berapa? (2) tingkat draf diterima tanpa ubahan besar; (3) selisih rekonsiliasi tertutup dalam SLA; (4) false positive rate penanda; (5) NOL keputusan yang diambil agen sendirian. Metrik kelima bukan lelucon: hitung berapa kali agen melewati batas wewenangnya. Nol = sistem sehat; satu = insiden yang harus diinvestigasi.",
        "Waktunya praktik: bangun agen rekonsiliasi mini di lab. Data: `BUKU` (6 transaksi buku internal) dan `MUTASI` (6 baris mutasi bank). Aturan cocok: jumlah SAMA dan selisih tanggal ≤ 1 hari. Satu baris mutasi hanya boleh dipakai sekali — tanpa aturan ini, satu mutasi bisa “menjelaskan” dua transaksi buku dan selisihnya hilang diam-diam.",
        "Tugasmu: (1) implementasikan `rekonsiliasi(buku, mutasi, toleransi_hari=1)` yang mengembalikan dict berisi `cocok` (list pasangan [id_buku, id_mutasi]), `hanya_buku`, `hanya_mutasi`, dan `usulan` (dict id → penjelasan); (2) jalankan atas data dan cetak rekap empat baris. Coba eksplorasi: naikkan toleransi jadi 3 hari — apa yang berubah pada B6–M7? Apakah perubahan itu benar, atau justru menyembunyikan masalah?",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `rekonsiliasi` — cocokkan per jumlah + tanggal (toleransi 1 hari), tiap mutasi dipakai sekali" },
        { id: "t2", text: "Bangun `usulan` penjelasan untuk tiap yang tidak cocok & cetak rekap empat baris" },
      ],
      expected: "COCOK: 3\nHANYA_BUKU: B3, B5, B6\nHANYA_MUTASI: M5, M6, M7\nUSULAN: 6",
      note: {
        title: "Miskonsepsi: “rekonsiliasi 100% cocok = tidak perlu diperiksa”",
        type: "pitfall",
        body: "Yang benar: justru yang TIDAK cocok adalah bagian terpenting — di sanalah fraud, kesalahan input, dan duplikasi bersembunyi. Agen yang baik membuat yang cocok menjadi senyap dan yang selisih menjadi SANGAT terlihat. Jangan pernah minta agen “membuat semuanya cocok” — itu permintaan untuk menyembunyikan masalah.",
      },
      hints: [
        "💡 Intuisi: agen = magang paling rajin di dunia. Magang terbaik menyusun semuanya: angka terkumpul, dokumen terindeks, draf rapi di meja jam 8 pagi. Tetapi ia tidak pernah — tidak boleh — menandatangani surat keputusan. Kamu tetap yang membaca, menilai, dan bertanggung jawab. Agen domain yang baik persis seperti itu: rajin tak terbatas, wewenang nol.",
        "Untuk tanggal: from datetime import date; date.fromisoformat(\"2026-10-02\") lalu abs((a - b).days).",
        "Loop buku di luar, mutasi di dalam; lewati mutasi yang sudah dipakai (set).",
        "Untuk usulan: lawan berjumlah sama tetapi tanggal beda > toleransi → “verifikasi: salah tanggal atau dua transaksi berbeda”; tidak ada lawan senilai → “cek bukti / belum dicatat”.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
BUKU = [
    {"id": "B1", "tanggal": "2026-10-02", "jumlah": 25000000, "keterangan": "Bayar Supplier A"},
    {"id": "B2", "tanggal": "2026-10-03", "jumlah": 10000000, "keterangan": "Bayar Supplier B"},
    {"id": "B3", "tanggal": "2026-10-04", "jumlah": 5000000, "keterangan": "Biaya listrik"},
    {"id": "B4", "tanggal": "2026-10-06", "jumlah": 12500000, "keterangan": "Bayar Supplier C"},
    {"id": "B5", "tanggal": "2026-10-07", "jumlah": 7000000, "keterangan": "Jasa konsultan"},
    {"id": "B6", "tanggal": "2026-10-08", "jumlah": 3000000, "keterangan": "Biaya notaris"},
]
MUTASI = [
    {"id": "M1", "tanggal": "2026-10-02", "jumlah": 25000000, "keterangan": "TRF SUPPLIER A"},
    {"id": "M2", "tanggal": "2026-10-03", "jumlah": 10000000, "keterangan": "TRF SUPPLIER B"},
    {"id": "M4", "tanggal": "2026-10-06", "jumlah": 12500000, "keterangan": "TRF SUPPLIER C"},
    {"id": "M5", "tanggal": "2026-10-08", "jumlah": 12500000, "keterangan": "TRF SUPPLIER C"},
    {"id": "M6", "tanggal": "2026-10-09", "jumlah": 9500000, "keterangan": "TRF TAK DIKENAL"},
    {"id": "M7", "tanggal": "2026-10-05", "jumlah": 3000000, "keterangan": "BIAYA NOTARIS"},
]

# ===== TULIS KODEMU =====`,
        lockLines: 19,
        solution: `# ===== DATA — jangan diubah =====
BUKU = [
    {"id": "B1", "tanggal": "2026-10-02", "jumlah": 25000000, "keterangan": "Bayar Supplier A"},
    {"id": "B2", "tanggal": "2026-10-03", "jumlah": 10000000, "keterangan": "Bayar Supplier B"},
    {"id": "B3", "tanggal": "2026-10-04", "jumlah": 5000000, "keterangan": "Biaya listrik"},
    {"id": "B4", "tanggal": "2026-10-06", "jumlah": 12500000, "keterangan": "Bayar Supplier C"},
    {"id": "B5", "tanggal": "2026-10-07", "jumlah": 7000000, "keterangan": "Jasa konsultan"},
    {"id": "B6", "tanggal": "2026-10-08", "jumlah": 3000000, "keterangan": "Biaya notaris"},
]
MUTASI = [
    {"id": "M1", "tanggal": "2026-10-02", "jumlah": 25000000, "keterangan": "TRF SUPPLIER A"},
    {"id": "M2", "tanggal": "2026-10-03", "jumlah": 10000000, "keterangan": "TRF SUPPLIER B"},
    {"id": "M4", "tanggal": "2026-10-06", "jumlah": 12500000, "keterangan": "TRF SUPPLIER C"},
    {"id": "M5", "tanggal": "2026-10-08", "jumlah": 12500000, "keterangan": "TRF SUPPLIER C"},
    {"id": "M6", "tanggal": "2026-10-09", "jumlah": 9500000, "keterangan": "TRF TAK DIKENAL"},
    {"id": "M7", "tanggal": "2026-10-05", "jumlah": 3000000, "keterangan": "BIAYA NOTARIS"},
]

# ===== TULIS KODEMU =====
from datetime import date

def rekonsiliasi(buku, mutasi, toleransi_hari=1):
    dipakai = set()
    hasil = {"cocok": [], "hanya_buku": [], "hanya_mutasi": [], "usulan": {}}
    for b in buku:
        tb = date.fromisoformat(b["tanggal"])
        pasangan = None
        for m in mutasi:
            if m["id"] in dipakai:
                continue
            tm = date.fromisoformat(m["tanggal"])
            if m["jumlah"] == b["jumlah"] and abs((tm - tb).days) <= toleransi_hari:
                pasangan = m
                break
        if pasangan is None:
            hasil["hanya_buku"].append(b["id"])
            mirip = [m["id"] for m in mutasi if m["jumlah"] == b["jumlah"]]
            if mirip:
                hasil["usulan"][b["id"]] = (
                    "jumlah sama dengan " + ", ".join(mirip)
                    + " tetapi tanggal beda lebih dari 1 hari — "
                    + "verifikasi: satu transaksi salah tanggal, atau dua transaksi berbeda"
                )
            else:
                hasil["usulan"][b["id"]] = "tidak ada mutasi senilai ini — cek bukti bayar / apakah transaksi sudah dieksekusi"
        else:
            dipakai.add(pasangan["id"])
            hasil["cocok"].append([b["id"], pasangan["id"]])
    tercocok_buku = {p[0] for p in hasil["cocok"]}
    for m in mutasi:
        if m["id"] in dipakai:
            continue
        hasil["hanya_mutasi"].append(m["id"])
        sudah = [b["id"] for b in buku if b["jumlah"] == m["jumlah"]]
        if sudah and all(bid in tercocok_buku for bid in sudah):
            hasil["usulan"][m["id"]] = (
                "jumlah sama dengan " + ", ".join(sudah)
                + " yang sudah tercocokkan — cek kemungkinan duplikat pembayaran"
            )
        elif sudah:
            hasil["usulan"][m["id"]] = (
                "jumlah sama dengan " + ", ".join(sudah)
                + " tetapi tanggal beda lebih dari 1 hari — "
                + "verifikasi: satu transaksi salah tanggal, atau dua transaksi berbeda"
            )
        else:
            hasil["usulan"][m["id"]] = "tidak tercatat di buku — transaksi belum dicatat atau salah alokasi"
    return hasil

hasil = rekonsiliasi(BUKU, MUTASI)
cocok = hasil["cocok"]
hanya_buku = sorted(hasil["hanya_buku"])
hanya_mutasi = sorted(hasil["hanya_mutasi"])
print(f"COCOK: {len(cocok)}")
print("HANYA_BUKU: " + ", ".join(hanya_buku))
print("HANYA_MUTASI: " + ", ".join(hanya_mutasi))
print(f"USULAN: {len(hasil['usulan'])}")`,
        checks: [
          { kind: "defined", task: "t1", name: "rekonsiliasi", label: "`rekonsiliasi` terdefinisi", msg: "Definisikan rekonsiliasi(buku, mutasi, toleransi_hari=1)." },
          { kind: "equal", task: "t1", name: "cocok", value: [["B1", "M1"], ["B2", "M2"], ["B4", "M4"]], label: "`cocok` = 3 pasangan yang benar", msg: "B1–M1, B2–M2, B4–M4. M5 tidak cocok: B4 sudah dipakai M4." },
          { kind: "equal", task: "t1", name: "hanya_buku", value: ["B3", "B5", "B6"], label: "`hanya_buku` = [B3, B5, B6]", msg: "B6 vs M7: jumlah sama tetapi selisih 3 hari > toleransi 1 hari." },
          { kind: "equal", task: "t2", name: "hanya_mutasi", value: ["M5", "M6", "M7"], label: "`hanya_mutasi` = [M5, M6, M7]", msg: "M5: duplikat potensial (B4 sudah tercocokkan). M6: tak dikenal." },
          { kind: "stdout_matches", task: "t2", pattern: "COCOK: 3\\nHANYA_BUKU: B3, B5, B6\\nHANYA_MUTASI: M5, M6, M7\\nUSULAN: 6", label: "rekap empat baris sesuai format", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Aturan emas: selisih yang tak bisa dijelaskan = pekerjaan manusia. Jangan pernah memaksa cocok.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan penutup track",
      prose: [
        "Lima pertanyaan terakhir track ini. Lalu rangkuman perjalananmu dari AAI1.",
      ],
      tasks: [],
      summary: [
        "Brief ambigu → klarifikasi dulu: agen yang baik tahu kapan bertanya balik.",
        "Arsitektur = keputusan: loop + tools + memory + guardrail + evaluasi; buang yang tak perlu.",
        "Rubrik 0,4/0,4/0,2: kelengkapan, akurasi, sitasi — jujur-tak-lengkap > lengkap-tapi-salah.",
        "Dua gerbang kelulusan: skor ≥ 0,8 DAN tidak boros (efisiensi adalah keandalan).",
        "Lima gerbang deploy: evaluasi, guardrail, observability, rollback, manusia.",
        "Seluruh track: dari chatbot ke agen (AAI1), anatomi (AAI2), tools (AAI3), memory (AAI4), RAG (AAI5), multi-agent (AAI6), prompt (AAI7), evaluasi (AAI8), guardrail (AAI9), framework (AAI10), debugging (AAI11) — kini jadi satu sistem.",
      ],
      next: { label: "AAI13 — MCP: Satu Protokol untuk Semua Tool", href: "/v2/learn/aai13-mcp" },
      quiz: [
        {
          q: "Langkah PERTAMA Dina saat menerima brief ambigu adalah…",
          options: [
            { text: "Langsung coding agen", why: "Coding dari brief ambigu = membangun yang salah dengan cepat.", },
            { text: "Memaksa klarifikasi: topik, tujuan laporan, batasan, definisi sukses", why: "Tepat. Spesifikasi sebelum kode — agen yang baik tahu kapan bertanya balik.", correct: true },
            { text: "Memilih framework", why: "Framework adalah keputusan belakangan.", },
            { text: "Menambah lebih banyak tools", why: "Tools tanpa spesifikasi = permukaan risiko tanpa arah.", },
          ],
        },
        {
          q: "Trajectory C: skor 0,90 tetapi 14 langkah + loop. Keputusan Dina?",
          options: [
            { text: "Lulus, skornya tinggi", why: "Skor tanpa efisiensi = bom biaya di produksi.", },
            { text: "Tidak lulus tanpa perbaikan — keberhasilan yang rapuh", why: "Tepat. Dua gerbang: skor ≥ 0,8 DAN tidak boros.", correct: true },
            { text: "Hapus trajectory-nya", why: "Data jangan dihapus — ia sinyal perbaikan.", },
            { text: "Naikkan max_steps", why: "Itu perban, bukan obat: menutupi gejala (skor rendah) tanpa memperbaiki penyebab (arsitektur evaluasi/guardrail yang lemah). Untuk trajectory C: solusinya bukan “naikkan ambang” melainkan perbaiki loop + tambah gerbang efisiensi. Perban untuk darurat; obat untuk sistem.", },
          ],
        },
        {
          q: "Kenapa agen capstone TIDAK diberi tool kirim?",
          options: [
            { text: "Karena lupa", why: "Bukan — opsi ini melewatkan inti capstone: sebelum teknologi, KLARIFIKASI. Agen yang dibangun dari brief ambigu = membangun yang salah dengan cepat. Langkah pertama Dina (bertanya balik) menghemat 2 pekan — tidak ada baris kode yang mengalahkan 15 menit pertanyaan yang tepat.", },
            { text: "Karena di luar mandat: agen menulis draf (tier-1), manusia yang mengirim (tier-2)", why: "Tepat. Keputusan sadar dari klarifikasi brief — bukan keterbatasan teknis.", correct: true },
            { text: "Karena tool kirim mahal", why: "Bukan soal biaya — soal KEPUTUSAN. Opsi ini benar secara akuntansi tetapi salah secara pertanyaan: yang ditanya adalah prinsip (mengapa tidak diberi tool kirim), bukan rupiah. Jawab yang ditanya: keputusan sadar dari klarifikasi brief — keamanan sebagai desain, bukan keterbatasan.", },
            { text: "Karena tidak ada library-nya", why: "Bukan soal teknis — soal KEBIJAKAN. Keterbatasan teknis bisa diatasi (tambah tool); kebijakan keamanan adalah pilihan sadar. Bedakan keduanya: yang teknis = “belum bisa”; yang kebijakan = “memilih tidak”. Capstone Dina penuh dengan pilihan “memilih tidak” — itulah kedewasaan desain.", },
          ],
        },
        {
          q: "ROI 33× tetapi expected loss Rp8,3 juta/bulan. Kesimpulan tepat?",
          options: [
            { text: "Batalkan proyek", why: "Nilai bersih tetap sangat positif.", },
            { text: "Lanjutkan dengan mata terbuka: ROI tinggi DAN risiko terukur — mitigasi dengan guardrail", why: "Tepat. Keputusan dewasa = dua angka di meja, bukan satu.", correct: true },
            { text: "Abaikan expected loss", why: "Itulah cara terkejut saat insiden: tanpa evaluasi berkala dan monitoring, kamu tidak tahu agenmu memburuk sampai direksi yang memberi tahu. Capstone yang matang = evaluasi kontinu (AAI8) + alert (AAI11) sejak hari pertama produksi. “Nanti saja” = “kejutan nanti”.", },
            { text: "Naikkan target ROI", why: "Tidak relevan dengan keputusan capstone: opsi ini tidak menjawab “lulus/tidak” berdasarkan DUA gerbang (skor + efisiensi). Setiap keputusan di lesson ini harus merujuk ke rubrik 40/40/20 dan gerbang efisiensi — jika tidak, ia opini, bukan evaluasi.", },
          ],
        },
        {
          q: "Prinsip \u201Cyang menilai tidak boleh yang menjalankan\u201D diwujudkan dengan…",
          options: [
            { text: "Evaluator dan trace sebagai pengamat independen di luar jalur utama", why: "Tepat — seperti diagram arsitektur.", correct: true },
            { text: "Planner menilai dirinya sendiri", why: "Itu konflik kepentingan: agen yang menilai dirinya sendiri akan selalu “lulus”. Di capstone Dina, penilai = rubrik independen (+ manusia untuk sampel) — bukan agen itu sendiri. Prinsip “yang menilai tidak boleh yang menjalankan” = fondasi kepercayaan seluruh sistem.", },
            { text: "Menghapus evaluator agar cepat", why: "Menghapus rem agar cepat = insiden.", },
            { text: "Skor dari perasaan", why: "\u201CVibes\u201D bukan metrik (AAI8).", },
          ],
        },
      ],
    },
  ],
};
