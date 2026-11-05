import type { V2Lesson } from "../lib/types";

// Diagram loop sense-plan-act dengan memory di tengah.
const LOOP_SVG = `<svg viewBox="0 0 480 240" role="img" aria-label="Siklus sense, plan, act, observe mengelilingi kotak memory di tengah.">
<rect x="180" y="92" width="120" height="56" rx="10" fill="var(--c1)" opacity="0.18" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="114" font-size="13" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">MEMORY</text>
<text x="240" y="132" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">riwayat + ringkasan</text>
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="180" y="8" width="120" height="34" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/><text x="240" y="30" fill="var(--text)" font-weight="600">1 · SENSE</text>
<rect x="352" y="103" width="120" height="34" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/><text x="412" y="125" fill="var(--text)" font-weight="600">2 · PLAN</text>
<rect x="180" y="198" width="120" height="34" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="1.5"/><text x="240" y="220" fill="var(--text)" font-weight="600">3 · ACT</text>
<rect x="8" y="103" width="120" height="34" rx="8" fill="var(--c5)" opacity="0.25" stroke="var(--c5)" stroke-width="1.5"/><text x="68" y="125" fill="var(--text)" font-weight="600">4 · OBSERVE</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6" fill="none" marker-end="url(#ah)">
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<path d="M300 25 C 340 25, 360 60, 372 100"/>
<path d="M412 140 C 400 170, 340 195, 305 205"/>
<path d="M180 215 C 140 215, 110 180, 100 140"/>
<path d="M68 100 C 80 70, 130 40, 175 28"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)" text-anchor="middle">
<text x="352" y="60">planner memilih</text><text x="352" y="74">aksi + tool</text>
<text x="330" y="196">executor menjalankan</text>
<text x="128" y="196">tool mengembalikan</text><text x="128" y="210">hasil</text>
<text x="120" y="52">memory diperbarui,</text><text x="120" y="66">siklus berulang</text>
</g>
</svg>`;

export const aai2: V2Lesson = {
  slug: "aai2-anatomi",
  track: "Agentic AI Engineer",
  module: "Fondasi Agen",
  title: "AAI2 — Anatomi Agen",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Arsiparis yang patuh… pada instruksi yang salah",
      prose: [
        "Bank tempat Dina bekerja menguji agen \u201CArsiparis\u201D: kumpulkan semua SOP terkait penanganan kredit macet dari drive internal. Instruksi awalnya jelas, termasuk satu baris penting: \u201CJANGAN buka dokumen berlabel NASABAH — itu data pribadi.\u201D",
        "Tiga puluh langkah kemudian, Arsiparis menemukan folder \u201CNASABAH_MACET_2024\u201D. Judulnya relevan dengan tugas. Ia membukanya, membaca isinya, dan memasukkannya ke ringkasan. Pelanggaran privasi — oleh agen yang \u201Cberniat baik\u201D.",
        "Twist-nya: rencana si agen sebenarnya BAGUS. Ia mencari dengan kata kunci tepat dan menyaring dokumen tidak relevan. Yang gagal bukan otaknya (planner), melainkan ingatannya: instruksi \u201Cjangan buka NASABAH\u201D sudah terdorong keluar dari context window oleh 30 langkah riwayat — dan executor-nya mengeksekusi perintah buka-tanpa-mengecek.",
        "Anatomi kegagalan ini memetakan persis ke empat komponen agen: planner yang buta (tidak melihat batasan), executor yang patuh buta (tidak memvalidasi), memory yang bocor (instruksi hilang), dan tools yang terlalu berkuasa (bisa membuka apa saja).",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan loop sense–plan–act–observe; (2) memetakan peran planner, executor, memory, dan tools; (3) menghitung anggaran token context window; (4) mengimplementasikan loop ReAct dengan mock planner dan executor.",
        "Daftar isi: 1) Cerita Arsiparis · 2) Empat komponen + loop · 3) Lab: loop ReAct mock · 4) Peta keputusan arsitektur loop · 5) Mini-case: anggaran token · 6) Checkpoint.",
        "Audit forensik menemukan yang lebih buruk: Arsiparis tidak hanya membuka satu folder terlarang — ia membuka TIGA folder berlabel nasabah dalam 30 langkah itu, tetapi hanya satu yang ia masukkan ke ringkasan. Dua lainnya “dibaca lalu dilupakan” — tidak tercatat di mana pun. Pelanggaran yang tidak tercatat = pelanggaran yang tidak bisa diperbaiki, tidak bisa dilaporkan ke regulator, dan tidak bisa dicegah terulang. Insiden yang terlihat (satu folder di ringkasan) hanyalah 33% dari insiden sebenarnya.",
        "Akar masalahnya bukan “agen nakal”. Planner Arsiparis mengoptimasi RELEVANSI: folder “NASABAH_MACET_2024” sangat relevan dengan tugas “kumpulkan SOP kredit macet”. Instruksi “JANGAN buka dokumen berlabel RAHASIA” hanyalah TEKS di antara teks lain — bukan KENDALA yang ditegakkan. Planner tidak melanggar aturan; ia tidak pernah diberi aturan sebagai sesuatu yang bisa dilanggar. Bedanya halus tetapi menentukan seluruh desain AAI9: keamanan tidak bisa dititipkan pada prompt, ia harus ditegakkan oleh arsitektur.",
        "Pelajaran yang Dina petik — dan yang mengubah cara timnya menulis instruksi: kata “JANGAN” tidak boleh dititipkan pada ingatan planner; ia harus ditegakkan oleh executor sebagai KENDALA. Setiap larangan menjadi aturan di policy engine (AAI9): executor MENOLAK membuka dokumen berlabel RAHASIA apa pun alasannya — bahkan jika planner memerintahkan. Arsitektur yang benar: planner mengusulkan, policy memutuskan. Prompt itu saran; policy itu hukum.",
        "Contoh policy sebagai hukum — bukan saran. Aturan executor Arsiparis versi baru: (1) TOLAK membuka dokumen berlabel RAHASIA — tanpa pengecualian, tanpa “tetapi tugasnya penting”. (2) TOLAK menghapus — hanya tandai untuk review. (3) IZINKAN membaca dokumen publik + menulis draf. Tiga baris, dievaluasi SEBELUM eksekusi, tidak bisa dinego oleh planner. Sejak policy ini dipasang, nol pelanggaran dalam 6 bulan — dengan planner yang SAMA PERSIS. Yang berubah bukan kecerdasannya; yang berubah adalah apa yang BOLEH ia lakukan. Keamanan = arsitektur, bukan harapan.",
      ],
      note: {
        title: "💡 Intuisi: observasi adalah satu-satunya jangkar ke realitas",
        body: "Planner hidup di dunia teks — ia bisa merencanakan apa saja, termasuk yang mustahil. Hanya OBSERVASI dari tool yang menghubungkannya ke dunia nyata: “tool mengembalikan error” adalah realitas yang mengetuk pintu. Agen yang mengabaikan observasi (tidak membaca hasil tool sebelum langkah berikut) = chatbot dengan langkah ekstra dan tagihan ekstra.",
      },

      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat komponen dan satu loop",
      prose: [
        "SENSE — agen membaca keadaan: prompt pengguna, hasil tool terakhir, isi memory. Ini \u201Cmata\u201D-nya. PLAN — planner memutuskan aksi berikutnya: tool apa, dengan argumen apa. Planner modern biasanya LLM yang diminta mengeluarkan rencana terstruktur (bukan prosa bebas). ACT — executor menjalankan aksi itu: memanggil tool, menulis file, query API. OBSERVE — hasil tool dibaca dan disimpan ke memory, lalu siklus berulang.",
        "Kepribadian tiap komponen. PLANNER = si ahli strategi: brilian menyusun langkah, tetapi buta terhadap dunia nyata — ia tidak tahu tool sedang down. EXECUTOR = si prajurit: patuh dan cepat, tetapi tidak berpikir — perintah \u201Chapus database\u201D ia jalankan tanpa bertanya. MEMORY = si sekretaris: mencatat semua, tetapi bukunya terbatas (context window) dan bisa salah catat. TOOLS = si tangan: memperluas jangkauan, sekaligus memperluas permukaan kesalahan.",
        "Anggaran token adalah hukum fisika agen. Context window W adalah total token yang muat; prompt sistem, riwayat percakapan, definisi tools, dan ruang output semuanya berebut tempat di dalamnya.",
        "Contoh angka anggaran untuk tiga ukuran context window, dengan B_prompt=2.000, B_tools=1.500, B_output=4.000, dan 800 token per langkah. W=8.000 (era model kecil): (8.000−7.500)/800 < 1 langkah — tugas 40 langkah MUSTAHIL, bukan sulit. W=128.000: 150 langkah — tugas 40 langkah aman dengan margin 110. W=1.000.000: 1.240 langkah. Pelajaran yang sering terlewat: window 10× lipat tidak berarti kemampuan 10× — karena B_tools ikut membengkak (lebih banyak tools = definisi lebih panjang) dan observasi tiap langkah ikut memenuhi riwayat.",
        "Dua kebutaan yang saling melengkapi. PLANNER buta terhadap dunia nyata: ia tidak tahu tool search sedang down, sehingga ia merencanakan 10 langkah di atas fondasi yang runtuh. Jika P(tool down)=0,05 dan planner tidak pernah cek status, 5% tugas gagal di langkah yang sebenarnya bisa dihindari dengan satu span health-check. EXECUTOR buta terhadap niat: ia mengeksekusi “hapus” dengan patuh tanpa tahu perintahnya berbahaya. Obatnya simetris: planner butuh kacamata status tool, executor butuh kacamata policy (boleh/tidak). Loop = dua orang buta yang saling percaya — beri keduanya tongkat.",
        "Biaya loop dalam rupiah: satu iterasi ReAct = satu panggilan LLM. Agen 40 langkah × 2.000 token × Rp150 per 1.000 token = Rp12.000 per tugas. Seratus tugas per hari = Rp1,2 juta per hari = Rp36 juta per bulan — hanya untuk token loop, belum termasuk tools. Anggaran token ADALAH anggaran rupiah; setiap langkah yang tidak perlu adalah uang yang dibakar dengan rapi. Inilah mengapa AAI4 (memory beranggaran) dan AAI11 (deteksi loop) adalah pelajaran tentang uang, bukan sekadar teknik.",
        "Kapan plan-and-execute mengalahkan ReAct? Ketika dependensi antar langkah DIKETAHUI di muka: kumpulkan 5 dokumen → ekstrak → ringkas → tulis. Rencana disusun sekali (1 panggilan LLM), eksekusi bisa paralel. ReAct menang ketika dunia TAK PASTI: hasil langkah 2 menentukan langkah 3. Aturan praktis: jika kamu bisa menuliskan diagram alirnya sebelum menjalankan, pakai plan-and-execute; jika diagramnya baru ketahuan sambil jalan, pakai ReAct. Kebanyakan agen produksi = campuran: rencana kasar di awal, ReAct di dalam tiap fase.",
        "Matriks biaya tiga arsitektur untuk tugas 40 langkah (2.000 token/panggilan, Rp150/1.000). ReAct: 40 panggilan LLM = Rp12.000, adaptif penuh. Plan-and-execute: 1 rencana + 5 panggilan re-planning cadangan = Rp1.800, tetapi gagal total jika dunia berubah di langkah 20 (butuh re-plan penuh). Hybrid (rencana kasar + ReAct per fase): ~12 panggilan = Rp3.600, tahan terhadap perubahan. Pilih bukan yang termurah atau terpintar — pilih yang biaya kegagalannya paling kamu pahami.",
        "Kegagalan senyap: observasi yang DIABAIKAN. Planner meminta tool, tool mengembalikan error “kuota habis”, planner melanjutkan seolah sukses dan menyusun laporan dari udara. Loop-nya “berjalan sempurna” — 10 langkah, tidak ada exception — tetapi setiap langkah setelah error adalah fiksi. Aturan keras: tiap iterasi WAJIB mengutip observasi langkah sebelumnya (“berdasarkan hasil tool X: …”). Planner yang tidak membaca hasil tool = penulis yang tidak membaca catatannya sendiri.",
        "Worked example: ReAct 40 langkah dengan observasi diringkas. Tanpa ringkasan: 800 token/langkah × 40 = 32.000 token riwayat + 7.500 tetap = 39.500 ≤ 128.000 — aman. Dengan observasi dokumen (5.000 token/langkah): 200.000 + 7.500 = 207.500 > 128.000 — GAGAL di langkah ~24. Dengan ringkasan observasi (500 token/langkah): 20.000 + 7.500 = 27.500 — aman dengan margin besar. Tiga angka ini menjelaskan mengapa AAI4 bukan “pelajaran terpisah” melainkan bagian dari anatomi: loop yang panjang TANPA memory beranggaran = loop yang bunuh diri di tengah jalan.",
      ],
      formula: String.raw`B = B_{\text{prompt}} + B_{\text{riwayat}} + B_{\text{tools}} + B_{\text{output}} \leq W`,
      formulaNote: "B = total token konteks yang terpakai; B_prompt = system prompt; B_riwayat = riwayat percakapan; B_tools = definisi tools; B_output = cadangan ruang untuk jawaban; W = context window model. Jika B > W, model memotong yang terlama — biasanya riwayat, yaitu ingatannya. Anggaran ini bukan teori: ia menentukan berapa langkah agenmu boleh hidup.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Cplanner = LLM, selesai\u201D",
        type: "pitfall",
        body: "Yang benar: planner butuh STRUKTUR di sekitar LLM — format rencana yang bisa diparse (misal JSON dengan field aksi dan argumen), batas langkah maksimum, dan aturan berhenti. LLM mentah yang disuruh \u201Cberencana\u201D dalam prosa bebas menghasilkan rencana yang tidak bisa dieksekusi executor. Planner = LLM + skema + batasan.",
      },
      hints: [
        "Intuisi: kalau agenmu bertingkah aneh, tanyakan dulu \u201Ckomponen mana yang gagal?\u201D — 80% bug agen adalah salah diagnosis komponen.",
        "Intuisi: B_riwayat adalah satu-satunya komponen yang TUMBUH tiap langkah. Semua krisis memory agen berasal dari sini.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: loop ReAct dengan planner dan executor mock",
      prose: [
        "Lab ini mensimulasikan loop sense–plan–act memakai fungsi mock. `mock_planner` melihat memory (\u201Cinvoice mana yang belum dicek\u201D) dan memilih aksi berikutnya. `mock_executor` menjalankan aksi dan mengembalikan observasi. Tugas: kumpulkan denda 2% dari tiga invoice.",
        "Tugasmu: implementasikan `run_loop`. Tiap iterasi: (1) SENSE/PLAN — panggil `mock_planner(memory)`; (2) cek terminasi — jika aksinya `done`, catat dan berhenti; (3) ACT/OBSERVE — eksekusi via `mock_executor`, simpan observasi ke `memory[\"trace\"]` dan hasilnya ke `memory[\"found\"]`. Hormati `max_steps`.",
        "Coba eksplorasi: ubah `max_steps` menjadi 2. Apa yang terjadi pada total denda? Itulah kenapa agen produksi butuh strategi saat anggaran langkah habis — bukan sekadar berhenti diam-diam.",
        "Eksperimen: ubah `mock_planner` agar kadang mengembalikan aksi “done” di langkah kedua — terminasi prematur. Tidak ada error, tidak ada exception; tugas selesai “sukses” dengan sepertiga pekerjaan. Inilah kegagalan paling sunyi dalam sistem agen: bukan crash, bukan loop, melainkan BERHENTI TERLALU DINI. Obatnya adalah kriteria selesai yang TERTULIS dan dicek mesin (AAI8): “done” hanya sah jika semua item checklist terpenuhi, bukan jika planner “merasa” selesai.",
        "Perhatikan peran `memory` di `run_loop`: ia adalah STATE yang dibawa antar iterasi — tanpa ia, planner di langkah 39 buta terhadap langkah 1–38. Inilah jembatan ke AAI4: memory bukan fitur tambahan, ia adalah syarat loop yang panjang. Dan perhatikan pula: memory yang tak beranggaran akan meluap (pelajaran AAI4), sehingga desain loop dan desain memory adalah satu keputusan, bukan dua.",
        "Skalakan eksperimen: ubah mock agar menangani 10 invoice, lalu ukur jumlah langkah. Sehat = linear (10 invoice ≈ 10× langkah 1 invoice). Jika kuadratik (10 invoice = 100 langkah), ada yang salah — biasanya planner mengulang seluruh riwayat per invoice (O(n²) context). Kompleksitas loop terhadap ukuran tugas adalah metrik kesehatan arsitektur: linear = boleh diskalakan; kuadratik = bom waktu yang menunggu volume.",
        "Terminasi ganda — praktik produksi yang belum ada di lab ini. `run_loop` berhenti saat planner berkata “done” (terminasi LUNAK — bisa prematur, lihat eksperimen sebelumnya). Produksi menambah dua terminasi KERAS yang tidak bisa dinego: (1) max_steps — “apa pun yang terjadi, berhenti di langkah 50”; (2) max_budget — “apa pun yang terjadi, berhenti di Rp10.000”. Terminasi lunak = kecerdasan; terminasi keras = keselamatan. Pesawat punya keduanya (pilot + batas bahan bakar); agenmu juga harus.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan loop sense–plan–act–observe di `run_loop` dengan terminasi yang benar" },
        { id: "t2", text: "Hitung `total_denda` dari `memory[\"found\"]` dan cetak sesuai format" },
      ],
      expected: "steps=4\ntotal_denda=94000",
      note: {
        title: "Miskonsepsi: \u201Cexecutor boleh mengeksekusi apa saja yang direncanakan\u201D",
        type: "pitfall",
        body: "Yang benar: executor yang baik MEMVALIDASI sebelum mengeksekusi — cek argumen, cek izin, cek apakah aksi masuk akal. Arsiparis di cerita gagal tepat di sini: executor membuka folder NASABAH tanpa memeriksa daftar larangan. Validasi executor adalah materi AAI9 (guardrail).",
      },
      hints: [
        "Pola loop: while steps < max_steps → aksi = mock_planner(memory) → jika done: break → obs = mock_executor(aksi).",
        "Jangan lupa steps += 1 di setiap iterasi agar loop bisa berhenti.",
        "total = jumlah INVOICES[i] * DENDA_RATE untuk i di memory[\"found\"], bulatkan per invoice seperti mock.",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nINVOICES = {"INV-01": 1500000, "INV-02": 2300000, "INV-03": 900000}\nDENDA_RATE = 0.02\n\ndef mock_planner(memory):\n    for inv in INVOICES:\n        if inv not in memory["found"]:\n            return ("get", inv)\n    return ("done", None)\n\ndef mock_executor(aksi):\n    nama, arg = aksi\n    if nama == "get":\n        denda = round(INVOICES[arg] * DENDA_RATE)\n        return f"{arg}: denda {denda}"\n    return "selesai"\n\n# ===== TULIS KODEMU =====\ndef run_loop(max_steps=10):\n    memory = {"found": {}, "trace": []}\n    steps = 0\n    # ... loop sense-plan-act-observe ...\n    total_denda = 0\n    return steps, total_denda\n\nsteps, total_denda = run_loop()\nprint(f"steps={steps}")\nprint(f"total_denda={total_denda}")`,
        lockLines: 15,
        solution: `# ===== MOCK — jangan diubah =====\nINVOICES = {"INV-01": 1500000, "INV-02": 2300000, "INV-03": 900000}\nDENDA_RATE = 0.02\n\ndef mock_planner(memory):\n    for inv in INVOICES:\n        if inv not in memory["found"]:\n            return ("get", inv)\n    return ("done", None)\n\ndef mock_executor(aksi):\n    nama, arg = aksi\n    if nama == "get":\n        denda = round(INVOICES[arg] * DENDA_RATE)\n        return f"{arg}: denda {denda}"\n    return "selesai"\n\n# ===== TULIS KODEMU =====\ndef run_loop(max_steps=10):\n    memory = {"found": {}, "trace": []}\n    steps = 0\n    while steps < max_steps:\n        aksi = mock_planner(memory)\n        steps += 1\n        if aksi[0] == "done":\n            memory["trace"].append("selesai")\n            break\n        obs = mock_executor(aksi)\n        memory["trace"].append(obs)\n        memory["found"][aksi[1]] = obs\n    total_denda = sum(round(INVOICES[i] * DENDA_RATE) for i in memory["found"])\n    return steps, total_denda\n\nsteps, total_denda = run_loop()\nprint(f"steps={steps}")\nprint(f"total_denda={total_denda}")`,
        checks: [
          { kind: "defined", task: "t1", name: "run_loop", label: "`run_loop` terdefinisi", msg: "Definisikan fungsi run_loop(max_steps=10) di area editable." },
          { kind: "equal", task: "t1", name: "steps", value: 4, tol: 1e-9, label: "`steps` = 4 (3 get + 1 done)", msg: "Tiga invoice diambil satu per satu, lalu planner mengembalikan done. Cek logika break." },
          { kind: "equal", task: "t2", name: "total_denda", value: 94000, tol: 1e-9, label: "`total_denda` = 94000", msg: "30000 + 46000 + 18000 = 94000. Jumlahkan dari memory[\"found\"]." },
          { kind: "stdout_matches", task: "t2", pattern: "steps=4\\ntotal_denda=94000", label: "output dua baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "while + break, dict membership (in), sum() dengan generator.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: pilih arsitektur loop",
      prose: [
        "Tidak semua agen butuh loop yang sama. Empat pola berulang di industri — pilih berdasarkan sifat tugas, bukan tren.",
        "Skenario 1 — tugas pendek, tool murah (cek 3 invoice seperti lab) → REACT: rencanakan satu langkah, eksekusi, observasi, ulangi. Sederhana dan adaptif.",
        "Skenario 2 — tugas panjang, tool mahal (tiap search API berbayar) → PLAN-AND-EXECUTE: buat seluruh rencana dulu, minta persetujuan, baru eksekusi batch. Satu perencanaan buruk lebih murah daripada 20 langkah nyasar berbayar.",
        "Skenario 3 — tugas butuh kualitas tinggi, boleh lambat (draf laporan direksi) → REFLEXION: tambah langkah kritik-diri — agen menilai hasilnya sendiri lalu merevisi. Mahal, tetapi untuk draf penting sepadan.",
        "Skenario 4 — satu langkah, jawaban langsung (terjemahkan paragraf) → SINGLE-SHOT: bukan agen. Jangan bayar loop untuk yang bisa selesai sekali panggil.",
        "Cara membaca: empat kotak = empat tahap loop; panah membentuk siklus; kotak MEMORY di tengah diakses semua tahap — ia satu-satunya komponen yang disentuh setiap langkah.",
        "Interpretasi: kegagalan Arsiparis terlihat jelas di diagram ini — panah OBSERVE→MEMORY menimpa instruksi lama, dan kotak ACT tidak punya panah validasi. Diagram ini adalah checklist debugging: telusuri tiap panah saat agen bertingkah aneh.",
        "Aturan praktis 10 detik: (1) <5 langkah & tool murah → ReAct. (2) Tool mahal → rencanakan dulu. (3) Kualitas > kecepatan → tambah kritik-diri. (4) Selalu pasang max_steps — loop tanpa rem bukan agen, itu bom token.",
        "Skenario 5 — tugas dengan CABANG: “jika dokumen A ada, ringkas; jika tidak, cari alternatif”. ReAct murni bisa, tetapi boros — ia menemukan cabang itu sambil jalan. Plan-and-execute dengan edge bersyarat (AAI10) lebih murah: satu keputusan di awal menghemat 5–10 langkah eksplorasi. Pola industri: rencana kasar (plan-and-execute) untuk kerangka, ReAct untuk ketidakpastian di dalam tiap cabang.",
        "Kuantifikasi pilihan arsitektur untuk tugas 40 langkah, 2.000 token per panggilan, Rp150 per 1.000 token. ReAct: 40 panggilan = Rp12.000 per tugas. Plan-and-execute: 1 rencana + 40 eksekusi tool (tanpa LLM per langkah, misal 5 panggilan LLM total) = Rp1.500 per tugas — 8× lebih murah UNTUK TUGAS YANG TERSTRUKTUR. Tetapi jika 30% rencana gagal di tengah jalan karena dunia berubah dan butuh re-planning 3×, biayanya naik ke Rp4.500 dan keandalannya turun. Arsitektur loop adalah keputusan ekonomi di bawah ketidakpastian.",
        "Skenario 6 — loop BERSARANG: agen memanggil sub-agen (orkestrator → spesialis → sub-spesialis). Anggaran harus DIBAGI: kedalaman 2 dengan 40 langkah tiap = 1.600 langkah potensial dan 9× biaya (overhead koordinasi per level). Aturan: kedalaman maksimal 2 untuk produksi; lebih dalam = debug mustahil + biaya eksponensial. Jika tugasmu butuh kedalaman 3, tugasnya yang harus dipecah — bukan loopnya yang diperdalam.",
        "Empat pertanyaan arsitektur — jawab sebelum menulis kode. (1) “Bisakah saya menggambar diagram alirnya SEKARANG?” Ya → plan-and-execute; tidak → ReAct. (2) “Berapa langkah maksimal?” >50 → butuh memory beranggaran (AAI4) apa pun arsitekturnya. (3) “Apa yang terjadi jika langkah 20 gagal?” Ulangi semua (mahal) → butuh checkpoint (AAI10). (4) “Siapa yang dirugikan jika loop berjalan liar?” Ada → butuh anggaran + detektor loop (AAI11). Empat pertanyaan ini menangkap 90% keputusan arsitektur agen — sisanya adalah detail implementasi.",
      ],
      note: {
        title: "💡 Intuisi: planner buta, executor buta — beri keduanya kacamata",
        body: "Planner tidak tahu tool sedang down; executor tidak tahu perintahnya berbahaya. Setiap komponen butuh “kacamata” pasangannya: planner butuh health-check status tool sebelum merencanakan, executor butuh policy boleh/tidak sebelum mengeksekusi. Tanpa keduanya, loop sense–plan–act–observe hanyalah dua orang buta yang saling percaya.",
      },

      figure: {
        svg: LOOP_SVG,
        alt: "Siklus sense, plan, act, observe mengelilingi kotak memory di tengah.",
        caption: "Loop sense–plan–act–observe. Memory di tengah: ditulis setiap langkah, dibaca setiap langkah.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: berapa langkah muat di context window?",
      prose: [
        "Agen Arsiparis berjalan di model dengan context window W = 128.000 token. Anggaran tetapnya: prompt sistem B_prompt = 2.000, definisi tools B_tools = 1.500, cadangan output B_output = 4.000. Setiap langkah loop menambah rata-rata 800 token riwayat (rencana + observasi).",
        "Langkah maksimum = (W − B_prompt − B_tools − B_output) / 800 = (128.000 − 7.500) / 800 = 120.500 / 800 = 150,6 → 150 langkah. Tugas Arsiparis butuh ~40 langkah: aman, dengan margin 110 langkah.",
        "Sekarang skenario buruk: tiap observasi berupa dokumen 5.000 token (tanpa ringkasan). Maka tiap langkah menelan 5.800 token → hanya 20 langkah muat. Tugas 40 langkah GAGAL di tengah jalan — tepat seperti Arsiparis yang \u201Clupa\u201D instruksi: instruksi awal terdorong keluar.",
        "Pembahasan: dua tuas insinyur — (1) kecilkan observasi (ringkas dokumen sebelum masuk memory, AAI4), (2) besarkan W (naik ke model long-context, biayanya naik ~3×). Aturan kasarnya: jika B_riwayat tumbuh >10% dari W per 10 langkah, pasang ringkasan SEKARANG, bukan nanti.",
        "Variasi angka: bagaimana jika tiap langkah memakan 2.000 token (observasi dokumen panjang), bukan 800? Langkah maksimum = 120.500 / 2.000 = 60. Tugas 40 langkah MASIH muat — tetapi margin menyusut dari 110 menjadi 20 langkah. Margin tipis = rapuh: satu dokumen 15.000 token yang tak terduga, dan loop kehabisan ingatan di langkah 35. Aturan desain: jangan merancang untuk kasus rata-rata; rancang untuk P95 ukuran observasi.",
        "Variasi kedua: B_tools membengkak. Daftarkan 20 tools dengan definisi 500 token tiap = 10.000 token — B tetap naik dari 7.500 menjadi 16.000. Langkah maksimum turun dari 150 menjadi 139. Setiap tool yang kamu daftarkan “memakan” jatah langkah masa depan. Inilah argumen kuantitatif untuk AAI3: tool sedikit yang tajam > tool banyak yang tumpul. Audit tools tiap kuartal: tool apa yang 90 hari tak dipanggil? Cabut.",
        "Skenario observasi besar: tiap langkah membawa dokumen 5.000 token (bukan 800). Langkah maksimum = 120.500 / 5.800 ≈ 20 — tugas 40 langkah GAGAL di tengah jalan, tepat saat paling tidak diharapkan. Solusinya bukan window lebih besar, melainkan observasi yang DIKOMPRESI: ekstrak fakta kunci per langkah (AAI4), bukan bawa dokumen mentah. Prinsip: yang masuk context window harus INFORMASI, bukan DATA.",
        "Anggaran gabungan loop + memory: total = (langkah × token_per_langkah) + B_tetap ≤ W. Dua tuas, satu anggaran. Menambah langkah (loop lebih panjang) BERARTI mengurangi jatah memory per langkah — dan sebaliknya. Desain agen yang matang mengalokasikan eksplisit: “40 langkah × 2.000 token + 40.000 cadangan = 120.000 ≤ 128.000”. Jika tidak ditulis, alokasinya terjadi sendiri — biasanya dengan cara yang menyakitkan.",
        "Tabel tiga ukuran window untuk tugas 40 langkah (B_tetap=7.500, 800 token/langkah). W=8.000: kapasitas (8.000−7.500)/800 < 1 langkah — tugas MUSTAHIL; solusinya bukan “prompt lebih baik” melainkan model lebih besar atau tugas dipecah. W=128.000: 150 langkah — aman, margin 110. W=1.000.000: 1.240 langkah — aman, tetapi biaya per langkah naik (model 1M window = tier mahal, ~3× tarif). Insight yang jarang disadari: window terbesar bukan selalu jawaban — ia menaikkan biaya SEMUA langkah, termasuk yang sebenarnya muat di window kecil. Pilih window sesuai tugas, bukan sesuai gengsi.",
        "Keputusan akhir untuk Arsiparis: W=128.000, tugas 40 langkah, observasi 800 token. Kapasitas 150 langkah, kebutuhan 40 — margin 110 langkah (275%). Aturan margin industri: rancang untuk 3× kebutuhan (tugas bisa membengkak saat dokumen tak terduga masuk). 40 × 3 = 120 ≤ 150 — LOLOS. Jika tugasnya 60 langkah: 60 × 3 = 180 > 150 — GAGAL margin; solusinya ringkas observasi atau pecah tugas. Margin bukan kemewahan — ia adalah ruang untuk kejutan, dan kejutan selalu datang.",
        "Biaya tak terlihat dari margin yang terlalu BESAR: W=1.000.000 untuk tugas 40 langkah = margin 1.200 langkah yang tidak pernah dipakai, tetapi dibayar (tier model mahal, ~3× tarif per token). 40 langkah × 2.000 token × Rp450/1.000 = Rp36.000/tugas vs Rp12.000 di W=128k. Rp24.000/tugas × 100 tugas/hari = Rp2,4 juta/hari untuk ketenangan yang tidak dibutuhkan. Margin yang tepat = 3× kebutuhan; selebihnya = premi asuransi yang kemahalan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kegagalan \u201Clupa instruksi\u201D di agen kepatuhan = risiko regulasi. Jika agen screening transaksi melupakan daftar sanksi di tengah loop, transaksi terlarang bisa lolos. Anggaran token bukan optimasi biaya semata — ia adalah kontrol risiko.",
      },
    },
    {
      id: "routing-agen",
      eyebrow: "Langkah 6 · Routing",
      title: "Routing: memilih pola kerja per tugas",
      prose: [
        "Sebuah agen layanan pelanggan diuji dua minggu: untuk pertanyaan “jam berapa buka?” ia menjalankan loop agen penuh — 14 langkah, tiga panggilan tool, biaya Rp12.000 — demi jawaban yang bisa dijawab sekali panggil. Sebaliknya, untuk “selidiki dispute settlement Rp2 miliar” ia memakai rantai tetap 3 langkah yang sama, gagal total karena langkahnya tidak bisa diprediksi. Dua kegagalan berlawanan, satu akar: tidak ada yang memilih POLA KERJA sebelum loop dimulai.",
        "Gagasan routing sederhana: tidak semua tugas butuh agen penuh. Empat jalur berulang di produksi — LANGSUNG (satu panggilan LLM, tanpa tool), RANTAI (urutan langkah tetap, tools diketahui), AGEN (loop sense–plan–act–observe yang adaptif), dan MANUSIA (eskalasi saat risiko tak bisa diterima mesin). ROUTER adalah komponen yang berdiri SEBELUM loop: ia mengklasifikasikan tugas masuk, lalu mengirimnya ke jalur yang tepat. Router yang baik menghemat token; router yang buruk adalah arsitektur termahal di sistemmu.",
        "Tiga sinyal klasifikasi yang paling menentukan. Pertama, KEPASTIAN LANGKAH: bisakah kamu menggambar diagram alirnya sebelum menjalankannya? Ya → rantai; tidak → agen. Kedua, KEBUTUHAN TOOL: jawabannya ada di teks, atau harus diambil dari dunia luar? Tanpa tool → langsung atau manusia. Ketiga, RISIKO KESALAHAN: berapa biaya jika salah — uang, data hilang, reputasi? Tinggi → manusia atau agen dengan guardrail. Tiga sinyal ini menangkap ~90% keputusan routing; sisanya detail.",
        "Router bisa salah dua arah, dan keduanya mahal. Salah arah SATU: tugas berat diberi jalur ringan — investigasi fraud diringkas jadi satu panggilan, jawabannya meyakinkan dan SALAH; kerugiannya bukan token, melainkan keputusan yang diambil dari jawaban salah. Salah arah DUA: tugas ringan diberi jalur berat — pertanyaan FAQ dijalankan 14 langkah agen; kerugiannya Rp12.000 untuk jawaban Rp150, kali 10.000 pertanyaan sehari. Arah satu membunuh kepercayaan; arah dua membunuh margin.",
        "Router sederhana vs router cerdas. Router berbasis ATURAN (“jika risiko=tinggi dan tak-terbalikkan → manusia”) transparan: setiap keputusan bisa diuji, dijelaskan, dan diperdebatkan. Router berbasis MODEL (classifier yang menebak jalur) lebih fleksibel saat pola tugas tak terpetakan aturan — tetapi ia menambah satu lapisan tebakan SEBELUM loop yang juga menebak. Aturan praktis industri: mulai dari aturan tertulis; naik ke model hanya jika log menunjukkan aturanmu salah rute >10% kasus. Yang terukur boleh diotomasi; yang belum terukur jangan.",
        "💡 Intuisi: router = resepsionis IGD. Pasien demam ringan → poliklinik (jalur ringan), kecelakaan berdarah → ruang operasi (jalur berat), gejala tak dikenal → observasi dulu (jalur aman). Resepsionis tidak mengobati — ia MENGARAHKAN, dan salah arah bisa fatal atau boros. Router agen bekerja persis begitu: ia tidak menyelesaikan tugas, ia memastikan tugas dikerjakan oleh pola yang tepat.",
      ],
      tasks: [
        { id: "t1", text: "Ambil tiga tugas dari pekerjaanmu sendiri; klasifikasikan ke LANGSUNG / RANTAI / AGEN / MANUSIA beserta tiga sinyalnya" },
        { id: "t2", text: "Untuk satu tugas tiap jalur, tulis apa yang terjadi jika ia diberi jalur satu tingkat lebih ringan dan satu tingkat lebih berat" },
      ],
      note: {
        title: "Miskonsepsi: “router terbaik = model besar yang menebak jalur”",
        type: "pitfall",
        body: "Yang benar: router paling andal di produksi justru aturan sederhana yang tertulis. Model menambah ketidakpastian tepat di titik paling menentukan (sebelum loop berjalan), dan kesalahannya menular ke semua jalur. Pakai model untuk routing hanya setelah aturanmu terbukti gagal secara terukur.",
      },
      reference: "Empat jalur: langsung, rantai, agen, manusia. Pilih dari kepastian langkah, kebutuhan tool, dan risiko — bukan dari gengsi arsitektur.",
    },
    {
      id: "routing-praktik",
      eyebrow: "Langkah 7 · Router",
      title: "Merancang router yang bisa diaudit",
      prose: [
        "Aturan rute harus TERTULIS dan bisa diuji — bukan tersirat di prompt. Bentuknya kondisi eksplisit: “risiko=tinggi DAN tak-terbalikkan → manusia”, “tanpa tool DAN langkah pasti → langsung”. Setiap aturan adalah klaim yang bisa diuji dengan contoh tugas. Router tanpa aturan tertulis = kotak hitam yang berdiri sebelum kotak hitam lainnya; saat sistem berperilaku aneh, kamu tidak punya tempat pertama untuk memeriksa.",
        "Setiap router butuh JALUR JATUH (fallback): keputusan untuk tugas yang tidak cocok aturan mana pun. Pilihan amannya: manusia, atau rantai konservatif yang tidak merusak apa pun. Contoh nyata kegagalan tanpa fallback: kategori tiket baru muncul di support, router menebak “langsung”, dan ratusan pelanggan mendapat jawaban template yang salah konteks. “Tidak tahu” adalah jawaban yang sah — dan jauh lebih murah daripada tebakan yang salah.",
        "Catat ALASAN setiap keputusan rute: jalur yang dipilih, aturan yang cocok, dan nilai sinyalnya. Log rute adalah titik awal debugging sistem agen — ketika seseorang bertanya “kenapa investigasi Rp2 miliar dijawab sekali panggil?”, jawabannya harus bisa ditemukan dalam satu baris log, bukan dengan menebak-nebak prompt. Tanpa log rute, setiap insiden routing menjadi misteri; dengan log rute, ia menjadi tiket perbaikan.",
        "Ukur BIAYA SALAH RUTE per jalur: tingkat kegagalan tugas yang dikirim ke tiap jalur. Jika jalur “langsung” gagal 30%, masalahnya bukan modelnya bodoh — melainkan klasifikasimu mengirim tugas yang terlalu berat ke jalur yang terlalu ringan. Metrik ini adalah umpan balik yang memperbaiki router dari waktu ke waktu: aturan yang sering salah rute ditulis ulang, ambang risiko digeser, jalur jatuh diperlebar.",
        "Evolusi yang sehat: mulai dari aturan eksplisit → kumpulkan log rute beserta hasil tugasnya → perbaiki aturan dari pola kegagalan → (opsional) latih classifier dari log yang sudah berlabel. Urutan ini penting: classifier yang dilatih dari log router aturan mewarisi keputusan yang sudah teruji, bukan tebakan mentah. Router yang baik lahir dari kecelakaan yang tercatat — persis seperti rambu lalu lintas yang dipasang setelah ada yang celaka di tikungan itu.",
        "💡 Intuisi: router yang bisa diaudit = rambu lalu lintas. Rambu tidak menyetir mobilmu; ia membuat keputusan pengemudi bisa DIPREDIKSI dan DIPERIKSA setelah kecelakaan. Aturan tertulis + log alasan + fallback aman adalah tiga rambu minimum sebelum kamu membiarkan lalu lintas agen berjalan sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `rute(t)` sesuai aturan: risiko tinggi + tak-terbalikkan → manusia; tanpa tool & pasti → langsung; pakai tool & pasti → rantai; selainnya → agen" },
        { id: "t2", text: "Cetak jalur tiap tugas dan ringkasannya; pastikan hasilnya cocok dengan format yang diharapkan" },
      ],
      expected: "balas salam pembuka chat -> langsung\nringkas email harian -> langsung\nambil laporan penjualan mingguan -> rantai\ninvestigasi anomali settlement -> agen\nhapus database staging lama -> manusia\nrekomendasi limit kredit nasabah -> agen\nringkasan: {'langsung': 2, 'rantai': 1, 'agen': 2, 'manusia': 1}",
      note: {
        title: "Miskonsepsi: “untuk tugas baru yang belum dikenal, router boleh menebak”",
        type: "pitfall",
        body: "Yang benar: tugas tak dikenal = jalur jatuh yang aman (manusia atau rantai konservatif), bukan tebakan. Tebakan router untuk kasus baru adalah cara tercepat mengubah satu insiden kecil menjadi pola kegagalan sistemik.",
      },
      hints: [
        "Urutkan kondisi dari yang paling spesifik: cek (risiko tinggi + tak-terbalikkan) dulu sebelum kondisi umum.",
        "Kunci dict tugas: nama, pasti, tool, risiko, final (final = tak-terbalikkan).",
        "ringkasan dihitung dari `hasil` — jangan hardcode angkanya.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====\nTUGAS = [\n    {"nama": "balas salam pembuka chat", "pasti": True, "tool": False, "risiko": "rendah", "final": False},\n    {"nama": "ringkas email harian", "pasti": True, "tool": False, "risiko": "rendah", "final": False},\n    {"nama": "ambil laporan penjualan mingguan", "pasti": True, "tool": True, "risiko": "rendah", "final": False},\n    {"nama": "investigasi anomali settlement", "pasti": False, "tool": True, "risiko": "sedang", "final": False},\n    {"nama": "hapus database staging lama", "pasti": False, "tool": True, "risiko": "tinggi", "final": True},\n    {"nama": "rekomendasi limit kredit nasabah", "pasti": False, "tool": True, "risiko": "tinggi", "final": False},\n]\nJALUR = ["langsung", "rantai", "agen", "manusia"]\n\n# ===== TULIS KODEMU =====\ndef rute(t):\n    # kembalikan salah satu dari JALUR\n    ...\n\nhasil = {t["nama"]: rute(t) for t in TUGAS}\nfor nama, jalur in hasil.items():\n    print(nama, "->", jalur)\nringkasan = {j: sum(1 for v in hasil.values() if v == j) for j in JALUR}\nprint("ringkasan:", ringkasan)`,
        lockLines: 12,
        solution: `# ===== DATA — jangan diubah =====\nTUGAS = [\n    {"nama": "balas salam pembuka chat", "pasti": True, "tool": False, "risiko": "rendah", "final": False},\n    {"nama": "ringkas email harian", "pasti": True, "tool": False, "risiko": "rendah", "final": False},\n    {"nama": "ambil laporan penjualan mingguan", "pasti": True, "tool": True, "risiko": "rendah", "final": False},\n    {"nama": "investigasi anomali settlement", "pasti": False, "tool": True, "risiko": "sedang", "final": False},\n    {"nama": "hapus database staging lama", "pasti": False, "tool": True, "risiko": "tinggi", "final": True},\n    {"nama": "rekomendasi limit kredit nasabah", "pasti": False, "tool": True, "risiko": "tinggi", "final": False},\n]\nJALUR = ["langsung", "rantai", "agen", "manusia"]\n\n# ===== TULIS KODEMU =====\ndef rute(t):\n    if t["risiko"] == "tinggi" and t["final"]:\n        return "manusia"\n    if not t["tool"] and t["pasti"]:\n        return "langsung"\n    if t["tool"] and t["pasti"]:\n        return "rantai"\n    return "agen"\n\nhasil = {t["nama"]: rute(t) for t in TUGAS}\nfor nama, jalur in hasil.items():\n    print(nama, "->", jalur)\nringkasan = {j: sum(1 for v in hasil.values() if v == j) for j in JALUR}\nprint("ringkasan:", ringkasan)`,
        checks: [
          { kind: "defined", task: "t1", name: "rute", label: "`rute` terdefinisi", msg: "Definisikan fungsi rute(t) di area editable." },
          { kind: "equal", task: "t1", name: "hasil", value: {"balas salam pembuka chat": "langsung", "ringkas email harian": "langsung", "ambil laporan penjualan mingguan": "rantai", "investigasi anomali settlement": "agen", "hapus database staging lama": "manusia", "rekomendasi limit kredit nasabah": "agen"}, label: "`hasil` memetakan tiap tugas ke jalur yang benar", msg: "Cek urutan kondisi: risiko tinggi + tak-terbalikkan dulu, lalu tanpa-tool, lalu rantai." },
          { kind: "equal", task: "t1", name: "ringkasan", value: {"langsung": 2, "rantai": 1, "agen": 2, "manusia": 1}, label: "`ringkasan` = 2 langsung, 1 rantai, 2 agen, 1 manusia", msg: "Hitung dari hasil, jangan hardcode." },
          { kind: "stdout_matches", task: "t2", pattern: "hapus database staging lama -> manusia", label: "output memuat keputusan manusia untuk tugas tak-terbalikkan", msg: "Samakan format print dengan contoh." },
          { kind: "stdout_matches", task: "t2", pattern: "ringkasan: \\{'langsung': 2, 'rantai': 1, 'agen': 2, 'manusia': 1\\}", label: "output memuat ringkasan", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Aturan tertulis + log alasan + jalur jatuh. Router yang baik lahir dari kegagalan yang tercatat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran. Perhatikan opsi yang \u201Champir benar\u201D — di situlah miskonsepsi bersembunyi.",
        "Refleksi anatomi: setiap agen = loop + state + anggaran. Tiga pertanyaan desain: (1) “Loop apa?” (ReAct/plan/hybrid) — jawab dengan diagram alir. (2) “State apa yang dibawa?” — jawab dengan daftar eksplisit. (3) “Berapa anggarannya?” — jawab dengan angka (langkah × token ≤ W). Desain yang tidak bisa menjawab ketiganya = sketsa, bukan arsitektur. Dan ingat: planner buta + executor buta = beri keduanya kacamata (status tool + policy). Anatomi yang lengkap = tidak ada komponen yang buta.",
      ],
      tasks: [],
      summary: [
        "Loop agen: sense → plan → act → observe, berulang sampai tujuan tercapai atau menyerah eksplisit.",
        "Planner = strategi (butuh skema + batasan); executor = eksekusi (wajib validasi); memory = catatan (terbatas); tools = tangan (perluas risiko).",
        "Anggaran token: B_prompt + B_riwayat + B_tools + B_output ≤ W; B_riwayat satu-satunya yang tumbuh.",
        "Pilih loop sesuai tugas: ReAct (pendek/murah), plan-and-execute (tool mahal), reflexion (kualitas), single-shot (bukan agen).",
        "Selalu pasang max_steps dan terminasi eksplisit — loop tanpa rem adalah bom token.",
      ],
      next: { label: "AAI3 — Tool Use & Function Calling", href: "/learn/aai3-tool-use" },
      quiz: [
        {
          q: "Dalam kasus Arsiparis, komponen mana yang menjadi akar kegagalan?",
          options: [
            { text: "Planner — rencananya buruk", why: "Rencananya justru bagus: kata kunci tepat, penyaringan relevan.", },
            { text: "Memory + executor tanpa validasi", why: "Tepat. Instruksi terdorong keluar dari memory, dan executor membuka folder terlarang tanpa mengecek daftar larangan.", correct: true },
            { text: "Tools — terlalu sedikit", why: "Tools-nya cukup; masalahnya bukan jumlah tangan melainkan tidak adanya rem.", },
            { text: "Model LLM terlalu kecil", why: "Tidak ada bukti ukuran model bermasalah — arsitekturnya yang bocor.", },
          ],
        },
        {
          q: "W = 128.000; tetap = 7.500; tiap langkah +800 token. Berapa langkah maksimum?",
          options: [
            { text: "160", why: "Itu 128.000/800 — lupa mengurangkan anggaran tetap.", },
            { text: "150", why: "(128.000 − 7.500)/800 = 150,6 → dibulatkan ke bawah 150.", correct: true },
            { text: "151", why: "Token tidak bisa pecahan langkah — selalu bulatkan ke bawah.", },
            { text: "140", why: "Terlalu konservatif; hitungannya 150,6.", },
          ],
        },
        {
          q: "Tugas: 50 langkah pencarian, tiap search API berbayar mahal. Arsitektur terbaik?",
          options: [
            { text: "ReAct murni", why: "ReAct adaptif tetapi bisa nyasar 20 langkah berbayar sebelum sadar salah arah.", },
            { text: "Plan-and-execute + persetujuan rencana", why: "Tepat. Rencana disetujui dulu; eksekusi batch terkontrol. Satu rencana buruk lebih murah dari 20 langkah nyasar.", correct: true },
            { text: "Reflexion 5 putaran", why: "Menambah biaya, bukan menguranginya — kritik-diri tidak mengatasi mahalnya tool.", },
            { text: "Single-shot", why: "Tugas 50 langkah tidak mungkin selesai sekali panggil.", },
          ],
        },
        {
          q: "Kenapa B_riwayat disebut \u201Csatu-satunya komponen yang tumbuh\u201D?",
          options: [
            { text: "Karena prompt sistem berubah tiap langkah", why: "Prompt sistem umumnya tetap sepanjang sesi.", },
            { text: "Karena tiap observasi ditambahkan ke context", why: "Tepat. Prompt, definisi tools, dan cadangan output bersifat tetap; hanya riwayat yang menumpuk.", correct: true },
            { text: "Karena model semakin pintar", why: "Model tidak berubah selama satu sesi berjalan.", },
            { text: "Karena tools bertambah otomatis", why: "Daftar tools didefinisikan di awal dan tetap.", },
          ],
        },
        {
          q: "Executor yang baik seharusnya…",
          options: [
            { text: "Menjalankan semua perintah planner secepat mungkin", why: "Itulah \u201Cpatuh buta\u201D — penyebab insiden Arsiparis.", },
            { text: "Memvalidasi argumen, izin, dan kewajaran sebelum eksekusi", why: "Tepat. Validasi di executor adalah rem terakhir sebelum aksi berdampak dunia nyata.", correct: true },
            { text: "Menolak semua aksi berisiko", why: "Terlalu ekstrem — agen menjadi tidak berguna. Validasi, bukan penolakan total.", },
            { text: "Meminta planner merencanakan ulang tiap langkah", why: "Itu pemborosan; validasi ringan cukup untuk aksi rutin.", },
          ],
        },
      ],
    },
  ],
};
