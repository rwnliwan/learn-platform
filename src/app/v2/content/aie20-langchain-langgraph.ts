import type { V2Lesson } from "../lib/types";

// Biaya loop agen: n iterasi x rata-rata token per iterasi x harga per token.
const FIG_LOOP_COST = `<svg viewBox="0 0 520 280" role="img" aria-label="Biaya meledak linear dengan jumlah iterasi loop agen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="56" y1="240" x2="500" y2="240"/><line x1="56" y1="185" x2="500" y2="185"/><line x1="56" y1="130" x2="500" y2="130"/><line x1="56" y1="75" x2="500" y2="75"/><line x1="56" y1="20" x2="500" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="50" y="244">0</text><text x="50" y="189">45 rb</text><text x="50" y="134">90 rb</text><text x="50" y="79">135 rb</text><text x="50" y="24">180 rb</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="56" y="258">0</text><text x="167" y="258">10</text><text x="278" y="258">20</text><text x="389" y="258">30</text><text x="500" y="258">40</text></g>
<text x="278" y="274" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">jumlah iterasi tool call</text>
<text x="56" y="14" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">biaya (Rp, ilustrasi)</text>
<line x1="56" y1="240" x2="500" y2="20" stroke="var(--c1)" stroke-width="3"/>
<circle cx="500" cy="20" r="6" fill="var(--c2)" stroke="var(--text)" stroke-width="2"/>
<text x="330" y="60" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">40 iterasi = Rp180 rb</text>
<text x="330" y="78" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">untuk SATU pertanyaan</text>
</svg>`;

export const aie20: V2Lesson = {
  slug: "aie20-langchain-langgraph",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE20 — LangChain & LangGraph Hands-On: Agen yang Bisa Di-debug",
  estMinutes: 70,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan chain (alur tetap) dari graph (alur bersyarat dengan state); (2) menjelaskan tiga kata kunci LangGraph — state, node, edge — dan kapan memakainya; (3) memasang tool binding yang aman (skema argumen + deskripsi); (4) merancang memory/checkpointer dan human-in-the-loop untuk agen produksi; (5) menghitung biaya loop agen dan memasang guard rail iterasi.",
        "🗺️ Isi lesson: Langkah 1 · Peta — Langkah 2 · Cerita demo Rp180 ribu — Langkah 3 · Chain vs graph — Langkah 4 · State, node, edge — Langkah 5 · Memory & human-in-the-loop — Langkah 6 · Lab graph mini — Langkah 7 · Kapan framework membantu — Langkah 8 · Ekonomi loop — Langkah 9 · Peta keputusan — Langkah 10 · Mini-case — Checkpoint.",
        "Bekal yang diringkas (F2): LangChain = library untuk merangkai komponen LLM (prompt, model, tool, memory) menjadi aplikasi; LangGraph = framework di dalam ekosistem LangChain untuk membangun agen sebagai graph ber-state yang bisa bercabang, mengulang, dan dijeda. Kamu tidak perlu pernah memakainya untuk mengikuti lesson ini — lab memakai Python murni dengan pola 1:1.",
      ],
      tasks: [],
      reference: "Chain = kereta api (rel tetap). Graph = peta kota (bisa belok, bisa putar balik, selalu tahu posisi). Agen yang bisa di-debug adalah agen yang posisinya selalu bisa dibaca.",
    },
    {
      id: "cerita-demo-mahal",
      eyebrow: "Langkah 2 · Cerita",
      title: "Demo Rp180 ribu untuk satu pertanyaan",
      prose: [
        "Tim CS 'DanaCepat' membangun chatbot pelacakan paket dengan LangChain: satu agent, satu tool `cek_resi`, prompt 'jawab pertanyaan pelanggan'. Hari demo ke direksi, CEO bertanya langsung: 'Di mana paket saya?' Layar menampilkan spinner. Satu menit. Dua menit. Lalu jawaban muncul — benar, sopan, lengkap.",
        "Tepuk tangan berhenti saat engineer membuka dashboard tagihan. Agent itu memanggil tool `cek_resi` SEBANYAK 40 KALI dengan argumen yang persis sama. Tool-nya mengembalikan dictionary, parser agent mengharapkan string — setiap observasi 'gagal dipahami', jadi agent mencoba lagi. Dan lagi. 40 iterasi × 2.500 token ≈ 100 ribu token untuk satu pertanyaan 'di mana paket saya' — sekitar Rp180 ribu (ilustrasi Rp1.800 per 1.000 token).",
        "Twist-nya: yang rusak bukan modelnya. Model melakukan persis yang diperintahkan: 'coba sampai berhasil'. Yang hilang ada tiga: (1) tidak ada yang MELIHAT trace — 40 panggilan identik baru ketahuan setelah tagihan datang; (2) tidak ada batas iterasi — agent boleh mencoba selamanya; (3) tidak ada state yang bisa diinspeksi — tidak ada yang tahu 'sekarang agent sedang di langkah apa'. Dengan LangGraph, ketiganya terpasang dari hari pertama: state selalu terbaca, iterasi dibatasi, dan graph bisa dijeda di tengah untuk diperiksa manusia.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Agent tanpa observability seperti karyawan tanpa CCTV di gudang: kamu baru tahu ada masalah saat stok hilang. Trace BUKAN fitur premium — ia sabuk pengaman. Setiap agent produksi wajib bisa menjawab: langkah apa yang sedang berjalan, dengan state apa, sudah berapa kali mengulang.",
      },
      reference: "Loop 40x bukan bug model — ia bug arsitektur: tanpa trace, tanpa batas iterasi, tanpa state yang terbaca.",
    },
    {
      id: "chain-vs-graph",
      eyebrow: "Langkah 3 · Chain vs graph",
      title: "Chain: Si Kereta Api. Graph: Si Peta Kota.",
      prose: [
        "Chain (LangChain klasik) adalah kereta api: prompt → model → parser → selesai, relnya tetap, tidak ada belokan. Cocok untuk pekerjaan yang alurnya pasti: ringkas dokumen, ekstrak field, terjemahkan. Kelebihannya: mudah ditebak, mudah di-test, murah. Kelemahannya: begitu dunia nyata butuh 'kalau gagal, coba cara lain', rel kereta tidak bisa belok.",
        "Graph (LangGraph) adalah peta kota: node = persimpangan (langkah kerja: panggil model, panggil tool, validasi), edge = jalan (aturan pindah: 'kalau jawaban lengkap → selesai; kalau tidak → ulangi, maksimal 3x'), state = posisi kendaraan saat ini (dict yang dibawa dari node ke node). Agent pada dasarnya adalah graph yang boleh mengulang: ia memutuskan sendiri jalan mana yang diambil berdasarkan state.",
        "Perbedaan yang paling terasa saat debug: pada chain yang gagal, kamu dapat tumpukan error di ujung; pada graph yang gagal, kamu dapat PETA — node mana yang dikunjungi, berapa kali, dengan state apa. Inilah kenapa demo Rp180 ribu tadi tidak akan terjadi pada graph yang dirancang benar: iterasi ke-4 yang identik langsung terlihat di peta.",
        "Aturan memilih yang jujur: alur tetap dan deterministik → chain atau bahkan fungsi biasa (jangan bayar kompleksitas yang tidak dipakai). Ada cabang bersyarat, pengulangan, atau keputusan 'coba lagi dengan cara lain' → graph. Butuh tool + perencanaan multi-langkah → agent di atas graph.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Agent = LangChain AgentExecutor, selesai.' AgentExecutor menyembunyikan loop di dalam kotak hitam: kamu tidak bisa menyisipkan validasi di tengah, tidak bisa menjeda untuk persetujuan manusia, dan state-nya sulit diinspeksi. Untuk produksi, bangun agent sebagai graph eksplisit (LangGraph) — kotaknya transparan, setiap node bisa diuji dan dijeda sendiri-sendiri.",
      },
      reference: "Alur pasti → chain. Ada cabang/ulangan → graph. Agent produksi = graph eksplisit, bukan kotak hitam.",
    },
    {
      id: "state-node-edge",
      eyebrow: "Langkah 4 · State, node, edge",
      title: "Tiga kata yang menyelamatkan debug",
      prose: [
        "State adalah 'papan tulis' bersama: sebuah dict (atau objek bertipe) yang dibawa dari node ke node — berisi pertanyaan user, hasil tool, jawaban sementara, dan penghitung iterasi. Semua keputusan routing MEMBACA state, semua node MENULIS ke state. Kalau ada yang aneh, buka papan tulisnya: di situlah kebenarannya.",
        "Node adalah satu unit kerja: fungsi yang menerima state dan mengembalikan perubahan state. Contoh: `node_klasifikasi` (tentukan tujuan dari pertanyaan), `tool_cari_resi` (panggil API), `node_jawab` (susun jawaban). Satu node = satu tanggung jawab = satu unit test. Node yang melakukan tiga hal sekaligus adalah calon bug yang belum ketahuan.",
        "Edge adalah aturan pindah: 'setelah klasifikasi, kalau tujuan = lacak_paket → ke tool_cari_resi; kalau tidak → ke eskalasi'. Edge bersyarat inilah yang membuat graph 'hidup' — alurnya ditentukan data, bukan di-hardcode. Dan guard rail iterasi hanyalah edge khusus: 'kalau penghitung > 3 → ke node_hentikan, jangan ke node_coba_lagi'.",
        "Tool binding yang aman punya tiga syarat: (1) skema argumen eksplisit (tipe + wajib/opsional + batasan, mis. JSON Schema) — tool yang menerima 'string bebas' adalah undangan untuk argumen ngawur; (2) deskripsi yang jujur tentang KAPAN tool dipakai dan kapan TIDAK — model memilih tool dari deskripsinya; (3) validasi di sisi server — jangan pernah percaya argumen dari model tanpa divalidasi ulang. Bug demo Rp180 ribu berakar di sini: tidak ada validasi format observasi tool.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Deskripsi tool yang penting jelas, skema tidak perlu detail.' Model memilih tool BERDASARKAN deskripsi, tetapi ia mengisi argumen berdasarkan skema. Deskripsi bagus + skema longgar = tool yang sering dipanggil dengan argumen salah. Tulis skema seketat API publik: tipe, required, enum, dan contoh — karena bagi model, tool-mu ADALAH api publik.",
      },
      reference: "State = papan tulis bersama. Node = satu kerja, satu test. Edge = aturan pindah. Tool aman = skema ketat + deskripsi jujur + validasi server.",
    },
    {
      id: "memory-hitl",
      eyebrow: "Langkah 5 · Memory & human-in-the-loop",
      title: "Agen yang ingat — dan tahu kapan harus bertanya",
      prose: [
        "Memory pada agent ada dua lapis. Lapis pendek (working memory): isi state dalam satu run — riwayat tool call, jawaban sementara. Lapis panjang (checkpointer): snapshot state yang DISIMPAN antar-run, sehingga percakapan kemarin bisa dilanjutkan hari ini tanpa mengulang dari nol. LangGraph menyebutnya checkpointer: setiap node selesai, state ditulis; bila proses mati di tengah, ia lanjut dari checkpoint terakhir, bukan dari awal.",
        "Human-in-the-loop (HITL) adalah jeda yang disengaja: graph berhenti di node tertentu dan menunggu persetujuan manusia sebelum lanjut. Pola klasik: agent menyiapkan draf balasan refund — BERHENTI — manusia menyetujui — baru terkirim. Tanpa HITL, agent adalah karyawan yang boleh menandatangani cek sendiri; dengan HITL, ia menyiapkan semuanya tetapi pena tetap di tangan manusia.",
        "Kapan HITL wajib: aksi yang tidak bisa dibatalkan (kirim uang, hapus data, kirim email ke pelanggan), ambang nilai (di atas Rp500 ribu butuh approve), dan kepercayaan rendah (model ragu-ragu, skor keyakinan di bawah ambang). Kapan HITL berlebihan: setiap langkah butuh klik — itu bukan agent, itu wizard dengan langkah ekstra. Aturannya: otomatisasi yang reversibel, manusia untuk yang ireversibel.",
        "💡 Intuisi: checkpointer membuat agent tahan mati lampu; HITL membuat agent tahan salah langkah. Satu menjaga KELANGSUNGAN, satu menjaga KEAMANAN. Agent produksi butuh keduanya — seperti mobil butuh ban serep DAN rem.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Memory tanpa batas adalah bom: state yang tumbuh tanpa henti (seluruh riwayat chat 3 bulan) membuat setiap panggilan model makin mahal dan lambat. Praktik yang sehat: ringkas (summarize) riwayat lama menjadi fakta-fakta kunci, simpan yang ringkas di checkpointer, buang detailnya. Ingat seperti manusia: fakta penting diingat, kalimat per kalimat dilupakan.",
      },
      reference: "Checkpointer = lanjutkan dari checkpoint bila mati. HITL = jeda untuk aksi ireversibel. Ringkas memory, jangan menimbun.",
    },
    {
      id: "lab-graph-mini",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: graph mini dengan guard iterasi",
      prose: [
        "Lab ini membangun ulang inti cerita demo Rp180 ribu dalam Python murni — pola 1:1 dengan LangGraph, tanpa library-nya (tidak tersedia di Pyodide; logikanya identik sehingga bisa disalin ke LangGraph tanpa perubahan alur). Node-node sudah disediakan sebagai SEED; tugasmu menulis `run_graph`: orkestrasi klasifikasi → tool → jawab, dengan guard: ulangi maksimal `max_iter` kali bila jawaban INCOMPLETE, lalu set flag GUARD.",
        "Dua kasus diuji. Kasus 1 (normal): 'Di mana paket saya?' → 1 tool call, jawaban lengkap. Kasus 2 (bug disimulasikan): node jawab yang rusak selalu mengembalikan INCOMPLETE → loop harus berhenti di batas, bukan berjalan 40 kali seperti di cerita. Coba ubah setelah berhasil: naikkan `max_iter` menjadi 5 dan amati `tool_calls` kasus 2 berubah — guard rail adalah parameter, bukan sihir.",
        "Perhatikan pola for-else pada solusi: `else` pada loop `for` dieksekusi hanya bila loop selesai TANPA break — tempat yang pas untuk menandai 'guard terpicu'. Ini idiom Python yang jarang dipakai, tetapi di sinilah ia bersinar.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `run_graph(pertanyaan, max_iter=3, jawab_fn=node_jawab)` yang mengorkestrasi node-node" },
        { id: "t2", text: "Jalankan dua kasus dan cetak jawaban + jumlah tool call + status guard" },
      ],
      expected: "kasus1: Paket DCP88231 dalam perjalanan, tiba ±2 hari. | tool_calls=1\nkasus2: GUARD: iterasi habis, hentikan loop | tool_calls=4",
      hints: [
        "Mulai: state = {'pertanyaan': pertanyaan, 'tool_calls': 0}; lalu state = node_klasifikasi(state)",
        "Jika state['tujuan'] == 'lacak_paket': panggil tool_cari_resi dan tambah tool_calls",
        "Loop max_iter kali: jawab = jawab_fn(state); jika jawaban != 'INCOMPLETE': break; jika tidak, panggil tool lagi",
        "Gunakan for-else: else di for = loop selesai tanpa break → set state['guard']",
      ],
      code: {
        starter: `# SEED — jangan ubah
def node_klasifikasi(state):
    q = state["pertanyaan"].lower()
    if "paket" in q or "resi" in q:
        state["tujuan"] = "lacak_paket"
    else:
        state["tujuan"] = "eskalasi"
    return state

def tool_cari_resi(state):
    state["data_resi"] = {"resi": "DCP88231", "status": "dalam perjalanan", "eta_hari": 2}
    return state

def node_jawab(state):
    if state.get("tujuan") == "lacak_paket" and "data_resi" in state:
        d = state["data_resi"]
        state["jawaban"] = f"Paket {d['resi']} {d['status']}, tiba ±{d['eta_hari']} hari."
    else:
        state["jawaban"] = "INCOMPLETE"
    return state

def node_jawab_rusak(state):
    state["jawaban"] = "INCOMPLETE"
    return state

# TULIS KODEMU: orkestrasi graph dengan guard iterasi
def run_graph(pertanyaan, max_iter=3, jawab_fn=node_jawab):
    state = {"pertanyaan": pertanyaan, "tool_calls": 0}

    return state

hasil1 = run_graph("Di mana paket saya?")
hasil2 = run_graph("Di mana paket saya?", jawab_fn=node_jawab_rusak)

print(f"kasus1: {hasil1['jawaban']} | tool_calls={hasil1['tool_calls']}")
print(f"kasus2: {hasil2.get('guard', '-')} | tool_calls={hasil2['tool_calls']}")`,
        lockLines: 26,
        solution: `# SEED — jangan ubah
def node_klasifikasi(state):
    q = state["pertanyaan"].lower()
    if "paket" in q or "resi" in q:
        state["tujuan"] = "lacak_paket"
    else:
        state["tujuan"] = "eskalasi"
    return state

def tool_cari_resi(state):
    state["data_resi"] = {"resi": "DCP88231", "status": "dalam perjalanan", "eta_hari": 2}
    return state

def node_jawab(state):
    if state.get("tujuan") == "lacak_paket" and "data_resi" in state:
        d = state["data_resi"]
        state["jawaban"] = f"Paket {d['resi']} {d['status']}, tiba ±{d['eta_hari']} hari."
    else:
        state["jawaban"] = "INCOMPLETE"
    return state

def node_jawab_rusak(state):
    state["jawaban"] = "INCOMPLETE"
    return state

# TULIS KODEMU: orkestrasi graph dengan guard iterasi
def run_graph(pertanyaan, max_iter=3, jawab_fn=node_jawab):
    state = {"pertanyaan": pertanyaan, "tool_calls": 0}
    state = node_klasifikasi(state)
    if state["tujuan"] == "lacak_paket":
        state = tool_cari_resi(state)
        state["tool_calls"] += 1
    for _ in range(max_iter):
        state = jawab_fn(state)
        if state["jawaban"] != "INCOMPLETE":
            break
        state = tool_cari_resi(state)
        state["tool_calls"] += 1
    else:
        state["guard"] = "GUARD: iterasi habis, hentikan loop"
    return state

hasil1 = run_graph("Di mana paket saya?")
hasil2 = run_graph("Di mana paket saya?", jawab_fn=node_jawab_rusak)
tool_calls2 = hasil2["tool_calls"]

print(f"kasus1: {hasil1['jawaban']} | tool_calls={hasil1['tool_calls']}")
print(f"kasus2: {hasil2.get('guard', '-')} | tool_calls={hasil2['tool_calls']}")`,
        checks: [
          { kind: "defined", task: "t1", name: "run_graph", label: "`run_graph` terdefinisi", msg: "Fungsi orkestrasi graph belum ditulis." },
          { kind: "equal", task: "t1", name: "hasil1", value: {"pertanyaan": "Di mana paket saya?", "tool_calls": 1, "tujuan": "lacak_paket", "data_resi": {"resi": "DCP88231", "status": "dalam perjalanan", "eta_hari": 2}, "jawaban": "Paket DCP88231 dalam perjalanan, tiba ±2 hari."}, label: "State kasus 1 lengkap", msg: "Jawaban kasus normal harus lengkap dengan 1 tool call." },
          { kind: "equal", task: "t2", name: "tool_calls2", value: 4, label: "`tool_calls` kasus 2 = 4", msg: "1 panggilan awal + 3 percobaan ulang = 4, lalu guard menghentikan." },
          { kind: "stdout_matches", task: "t2", pattern: "GUARD: iterasi habis", label: "Guard terpicu di kasus 2", msg: "Loop tanpa batas harus dihentikan guard, seperti pelajaran demo Rp180 ribu." },
          { kind: "stdout_matches", task: "t2", pattern: "kasus1: Paket DCP88231 dalam perjalanan", label: "Cetak kasus 1 benar", msg: "Format: kasus1: Paket DCP88231 dalam perjalanan, tiba ±2 hari. | tool_calls=1" },
        ],
      },
      reference: "Guard iterasi = edge 'kalau sudah N kali → berhenti'. Tanpa guard, bug kecil menjadi tagihan besar.",
    },
    {
      id: "kapan-framework",
      eyebrow: "Langkah 7 · Kapan framework",
      title: "Kapan framework membantu, kapan ia menjadi beban",
      prose: [
        "Framework membantu saat masalahnya cocok dengan abstraksinya: multi-langkah dengan cabang, butuh memory antar-run, butuh jeda manusia, tim besar yang butuh pola bersama. Di titik itu LangChain/LangGraph menghemat minggu kerja: routing, retry, streaming, dan observability tidak perlu ditulis dari nol.",
        "Framework menjadi beban saat masalahnya lebih sederhana dari abstraksinya: satu prompt + satu tool call tidak butuh agent — ia butuh fungsi. Tanda-tandanya: kamu menghabiskan lebih banyak waktu melawan framework (konfigurasi, versi, perilaku default yang misterius) daripada menyelesaikan masalah user. Aturan praktis: mulai dari kode paling sederhana yang bisa bekerja; naik ke framework saat rasa sakitnya nyata, bukan saat hype-nya nyata.",
        "Jebakan 'framework-first' yang klasik: membangun agent untuk tugas yang deterministik (validasi format, lookup database, hitung pajak) — lalu heran kenapa kadang jawabannya berbeda-beda untuk input yang sama. LLM di tengah alur deterministik adalah sumber flakiness yang dibayar mahal. Pisahkan: logika pasti = kode biasa; yang butuh penalaran = LLM; yang butuh keduanya = graph dengan node deterministik dan node LLM yang jelas.",
        "💡 Intuisi: framework adalah pinjaman — ia mempercepat hari ini dengan bunga kompleksitas besok. Pinjamlah untuk masalah yang memang butuh, lunasi dengan memahami apa yang terjadi di dalamnya (itulah gunanya lab graph mini tadi: kamu sekarang tahu persis apa yang dilakukan framework untukmu).",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Pakai agent framework supaya terlihat canggih.' Kompleksitas yang tidak dipakai adalah bug yang menunggu waktu. Setiap node LLM menambah latensi, biaya, dan peluang halusinasi. Desain terbaik untuk kebanyakan kasus produksi: graph kecil dengan sedikit node LLM dan banyak node deterministik — bukan agent raksasa yang 'bisa apa saja' tetapi tidak bisa diandalkan untuk apa pun.",
      },
      reference: "Mulai dari yang paling sederhana. Naik ke framework saat sakitnya nyata. Pisahkan logika pasti (kode) dari penalaran (LLM).",
    },
    {
      id: "ekonomi-loop",
      eyebrow: "Langkah 8 · Ekonomi loop",
      title: "Guard rail yang menghemat token",
      prose: [
        "Setiap iterasi agent membakar token: prompt sistem + riwayat + observasi tool, dikali jumlah putaran. Rumusnya jujur dan linear — tidak ada yang misterius, hanya perkalian yang tidak diawasi.",
        "Contoh dari cerita: n = 40 iterasi, T̄ = 2.500 token per iterasi, p = Rp1.800 per 1.000 token (ilustrasi) → C = 40 × 2.500 × 1,8 = Rp180.000 untuk satu pertanyaan. Dengan guard max_iter = 3: C = 3 × 2.500 × 1,8 = Rp13.500 — dan bug-nya ketahuan di menit pertama, bukan di tagihan akhir bulan.",
        "Tiga guard rail ekonomi yang murah: (1) max_iterations — batas putaran per run; (2) max_tokens per run — batas token total, agent yang boros dimatikan paksa; (3) circuit breaker pola — tiga observasi identik berturut-turut = hentikan dan eskalasi, karena 'mencoba hal yang sama dan berharap hasil beda' adalah definisi yang tidak perlu disebutkan namanya. Ketiganya satu baris kode, menghemat potensi jutaan rupiah.",
      ],
      formula: String.raw`C = n \times \bar{T} \times p`,
      formulaNote: "C = total biaya satu run agent (Rp). n = jumlah iterasi (tool call). T̄ = rata-rata token per iterasi (prompt + observasi). p = harga per token (Rp). Contoh: n=40, T̄=2.500, p=Rp1,8/1.000 token = Rp0,0018/token → C = 40 × 2.500 × 0,0018 = Rp180.000. Dengan guard n=3: C = Rp13.500.",
      figure: {
        svg: FIG_LOOP_COST,
        alt: "Grafik garis: biaya naik linear dari 0 ke Rp180 ribu seiring iterasi 0 ke 40.",
        caption: "Cara membaca: sumbu X = jumlah iterasi tool call; sumbu Y = biaya dalam Rp (ilustrasi Rp1.800/1.000 token, 2.500 token per iterasi); garis naik linear. Interpretasi: biaya loop agen tumbuh linear dan tanpa batas alami — guard max_iter adalah satu-satunya rem. Titik di 40 iterasi = Rp180 ribu, persis tagihan demo di cerita.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Anggaran token per run seperti anggaran belanja: tetapkan pagu SEBELUM agent berjalan, bukan dihitung sesudah. Agent yang tidak tahu ia punya anggaran akan belanja seperti tidak ada hari esok — karena baginya memang tidak ada.",
      },
      reference: "C = n × T̄ × p. Pasang max_iterations + max_tokens + circuit breaker pola identik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: chain, graph, atau tulis sendiri",
      prose: [
        "Satu, alur tetap tanpa cabang (ringkas → ekstrak → simpan) → chain sederhana atau fungsi biasa. Jangan bayar kompleksitas graph untuk rel kereta api.",
        "Dua, ada cabang bersyarat atau pengulangan ('kalau gagal, coba cara lain, maksimal 3x') → graph (LangGraph). State membuat keputusan bisa dilacak, edge membuat aturan eksplisit.",
        "Tiga, butuh tool + perencanaan multi-langkah + prototipe cepat → agent di atas graph, DENGAN max_iterations, observability trace, dan skema tool yang ketat sejak hari pertama. Demo Rp180 ribu adalah harga pelajaran bila ketiganya ditunda.",
        "Empat, latensi ketat atau logika deterministik (validasi, lookup, hitung) → tulis sendiri tanpa LLM di tengah alur. LLM di sini = flakiness berbayar.",
        "Lima, multi-agen yang berkolaborasi (peneliti + penulis + reviewer) → graph dengan pola supervisor: satu node orkestrator mendelegasikan ke sub-graph. Aturan praktis 10 detik: tanya 'apakah alurnya bisa bercabang?' — tidak → chain/fungsi; ya → graph; 'apakah butuh tool otonom?' — ya → agent di atas graph + guard.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Keputusan framework bukan soal gengsi, melainkan soal bentuk masalah. Gambar alur di kertas dulu: kalau gambarnya garis lurus, pakai chain; kalau ada belokan dan putaran, pakai graph. Kertas tidak pernah berbohong soal kompleksitas.",
      },
      reference: "Bercabang? tidak → chain/fungsi; ya → graph. Butuh tool otonom? → agent di atas graph + guard.",
    },
    {
      id: "minicase-klaim",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: klaim Rp4,2 miliar yang tertahan agen",
      prose: [
        "Asuransi 'AmanSentosa' memakai agent untuk pra-persetujuan klaim kesehatan: rantai ekstraksi dokumen → verifikasi polis → rekomendasi keputusan. Suatu Senin, 312 klaim menumpuk 'menunggu'. Investigasi: node verifikasi memanggil API polis yang timeout, agent me-retry tanpa batas dengan backoff yang rusak (tidur 0 detik), dan tidak ada HITL — 312 klaim × ratusan retry = 41 ribu panggilan API dalam 2 jam. Provider API menagih overage Rp18 juta dan memblokir key.",
        "Pertanyaan analisis: (1) Sebutkan tiga kegagalan arsitektur dari cerita ini dan pasangkan dengan konsep lesson ini. (2) Rancang ulang sebagai graph: gambar node dan edge-nya, tentukan di mana checkpointer dan HITL dipasang. (3) Klaim di atas Rp500 juta wajib persetujuan manusia — bagaimana edge bersyaratnya ditulis dalam kata-kata?",
        "Pembahasan: (1) Retry tanpa batas & backoff rusak → butuh max_iterations + backoff eksponensial yang benar; tidak ada observability → 41 ribu panggilan baru ketahuan setelah tagihan; tidak ada HITL → tidak ada rem darurat. (2) Node: ekstrak → verifikasi (dengan retry maks 3x, backoff) → [gagal 3x → antrean manusia] → rekomendasi → HITL untuk >Rp500jt → putusan. Checkpointer di tiap node (lanjutkan bila mati), HITL sebelum node putusan final. (3) 'Setelah node rekomendasi: jika nilai_klaim > 500.000.000 → edge ke node_tunggu_persetujuan; jika tidak → edge ke node_terbitkan_keputusan.' Syarat dalam kata-kata adalah syarat yang bisa diuji.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Agent yang memanggil API pihak ketiga tanpa batas adalah risiko operasional + finansial: overage billing dan pemblokiran key bisa melumpuhkan SELURUH layanan yang memakai key itu, bukan hanya agent-nya. Rate limit dan circuit breaker di setiap tool call eksternal adalah kontrol wajib, setara dengan validasi input pada API publik.",
      },
      reference: "Retry butuh batas + backoff benar. Tool eksternal butuh circuit breaker. Keputusan ireversibel butuh HITL.",
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
        "Chain = alur tetap (kereta api); graph = alur bersyarat dengan state (peta kota). Agent produksi = graph eksplisit.",
        "State = papan tulis bersama; node = satu kerja; edge = aturan pindah. Tool aman = skema ketat + deskripsi jujur + validasi server.",
        "Checkpointer = lanjutkan dari checkpoint; HITL = jeda untuk aksi ireversibel; ringkas memory, jangan menimbun.",
        "Guard ekonomi: max_iterations + max_tokens + circuit breaker pola identik; C = n × T̄ × p.",
        "Mulai dari yang paling sederhana; naik ke framework saat sakitnya nyata; pisahkan logika pasti dari penalaran LLM.",
        "Keputusan: tidak bercabang → chain/fungsi; bercabang → graph; butuh tool otonom → agent di atas graph + guard.",
      ],
      quiz: [
        {
          q: "Perbedaan paling penting antara chain dan graph untuk agent adalah…",
          options: [
            { text: "Graph membawa state antar-node dan mengizinkan edge bersyarat (termasuk pengulangan), chain alurnya tetap", why: "Tepat: state + edge bersyarat = kemampuan 'coba lagi dengan cara lain' dan kemampuan di-debug via peta.", correct: true },
            { text: "Graph selalu lebih cepat dari chain", why: "Kecepatan tergantung desain; graph justru menambah overhead state.", correct: false },
            { text: "Chain tidak bisa memanggil tool", why: "Chain bisa memanggil tool; yang tidak bisa ia lakukan adalah bercabang berdasarkan hasil.", correct: false },
            { text: "Graph hanya untuk multi-agen", why: "Satu agent pun mendapat manfaat dari state dan guard; multi-agen hanya salah satu pola.", correct: false },
          ],
        },
        {
          q: "Demo 40x tool call identik paling tepat dicegah dengan…",
          options: [
            { text: "max_iterations + trace yang dipantau + validasi format observasi tool", why: "Tepat: tiga lapis — batas putaran menghentikan, trace membuat terlihat, validasi mencegah pemicu.", correct: true },
            { text: "Model yang lebih besar dan lebih pintar", why: "Model lebih besar justru mempermahal tiap iterasi yang sia-sia.", correct: false },
            { text: "Prompt yang lebih panjang dan detail", why: "Prompt tidak menghentikan loop yang disebabkan bug parsing observasi.", correct: false },
            { text: "Menghapus tool cek_resi", why: "Menghapus tool = menghapus fungsinya; masalahnya di guard, bukan di tool.", correct: false },
          ],
        },
        {
          q: "Kapan human-in-the-loop WAJIB dipasang?",
          options: [
            { text: "Aksi ireversibel: kirim uang, hapus data, keputusan di atas ambang nilai", why: "Tepat: yang tidak bisa dibatalkan harus lewat manusia; otomatisasi untuk yang reversibel.", correct: true },
            { text: "Setiap langkah agent, agar aman", why: "Itu membuat agent menjadi wizard manual — latensi dan biaya manusia meledak.", correct: false },
            { text: "Hanya saat model sedang down", why: "HITL adalah desain, bukan rencana darurat.", correct: false },
            { text: "Tidak pernah, agent harus otonom penuh", why: "Otonomi penuh atas aksi ireversibel adalah risiko yang tidak bisa dipertahankan.", correct: false },
          ],
        },
        {
          q: "Dengan n=40, T̄=2.500 token, p=Rp0,0018/token, biaya loop adalah…",
          options: [
            { text: "Rp180.000", why: "Tepat: 40 × 2.500 × 0,0018 = 100.000 × 0,0018 × ... = Rp180.000.", correct: true },
            { text: "Rp18.000", why: "Kurang satu nol: 40 × 2.500 = 100.000 token; 100.000 × 0,0018 = 180.000.", correct: false },
            { text: "Rp1.800.000", why: "Kelebihan satu nol — cek lagi perkaliannya.", correct: false },
            { text: "Rp13.500", why: "Itu biaya dengan guard n=3, bukan n=40.", correct: false },
          ],
        },
        {
          q: "Tugas deterministik (validasi format, lookup DB) sebaiknya…",
          options: [
            { text: "Ditulis sebagai kode biasa tanpa LLM di tengah alur", why: "Tepat: LLM di alur deterministik = flakiness berbayar; graph memisahkan node deterministik dan node LLM.", correct: true },
            { text: "Diberikan ke agent agar fleksibel", why: "Fleksibilitas di sini berarti jawaban bisa beda-beda untuk input sama.", correct: false },
            { text: "Dibungkus chain LangChain agar rapi", why: "Chain tidak menambah determinisme; ia menambah lapisan.", correct: false },
            { text: "Diserahkan ke tool tanpa validasi", why: "Tanpa validasi = tanpa jaminan; validasi adalah intinya.", correct: false },
          ],
        },
        {
          q: "Fungsi checkpointer pada LangGraph adalah…",
          options: [
            { text: "Menyimpan snapshot state tiap node agar run bisa dilanjutkan dari titik terakhir bila terputus", why: "Tepat: tahan mati lampu — lanjut dari checkpoint, bukan dari awal.", correct: true },
            { text: "Mengecek ejaan pada output model", why: "Itu spell-checker, bukan checkpointer.", correct: false },
            { text: "Menghitung jumlah token yang dipakai", why: "Itu callback/metering terpisah.", correct: false },
            { text: "Menyetujui aksi agent secara otomatis", why: "Itu kebalikan HITL; checkpointer soal kelangsungan, bukan persetujuan.", correct: false },
          ],
        },
      ],
      next: { label: "AIE21 — Eval & Observability dalam Praktik Engineer", href: "/v2/learn/aie21-eval-observability-praktik" },
    },
  ],
};
