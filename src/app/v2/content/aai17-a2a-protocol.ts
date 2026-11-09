import type { V2Lesson } from "../lib/types";

// Task lifecycle A2A: submitted → working → (input-required) → completed / failed / canceled.
const FIG_LIFECYCLE = `<svg viewBox="0 0 560 260" role="img" aria-label="Diagram status task A2A: submitted, working, input-required, completed, failed, canceled.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="20" y="30" width="120" height="40" rx="20" fill="var(--c4)"/><text x="80" y="54" fill="var(--text)">submitted</text>
<rect x="220" y="30" width="120" height="40" rx="20" fill="var(--c3)"/><text x="280" y="54" fill="var(--text)">working</text>
<rect x="220" y="120" width="120" height="40" rx="20" fill="var(--c2)"/><text x="280" y="144" fill="var(--text)">input-required</text>
<rect x="420" y="10" width="120" height="40" rx="20" fill="var(--c1)"/><text x="480" y="34" fill="var(--text)">completed</text>
<rect x="420" y="70" width="120" height="40" rx="20" fill="var(--c5)"/><text x="480" y="94" fill="var(--text)">failed</text>
<rect x="420" y="130" width="120" height="40" rx="20" fill="var(--c4)" opacity="0.6"/><text x="480" y="154" fill="var(--text)">canceled</text>
<g stroke="var(--text-muted)" stroke-width="1.5" fill="none" marker-end="url(#ah)">
<line x1="140" y1="50" x2="218" y2="50"/><line x1="340" y1="50" x2="438" y2="28"/><line x1="340" y1="55" x2="438" y2="88"/>
<line x1="280" y1="70" x2="280" y2="118"/><line x1="300" y1="140" x2="300" y2="72"/>
<line x1="340" y1="140" x2="438" y2="150"/>
</g>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--text-muted)" stroke-width="1.5"/></marker></defs>
</g>
<text x="280" y="200" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">agen boleh JEDA di tengah task (input-required), meminta info,</text>
<text x="280" y="218" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">lalu MELANJUTKAN — kolaborasi, bukan fire-and-forget</text>
<text x="280" y="246" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">status inti A2A (a2aproject.github.io/A2A)</text>
</svg>`;

// Tumpukan protokol agen: MCP (agen↔tool), A2A (agen↔agen), AG-UI (agen↔user).
const FIG_STACK = `<svg viewBox="0 0 560 300" role="img" aria-label="Tumpukan protokol: MCP untuk agen ke tool, A2A untuk agen ke agen, AG-UI untuk agen ke user.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="130" y="20" width="300" height="60" rx="8" fill="var(--c2)"/><text x="280" y="44" fill="var(--text)">AG-UI · agen ↔ user</text><text x="280" y="62" font-size="10" fill="var(--text)">streaming UI, persetujuan manusia</text>
<rect x="130" y="100" width="300" height="60" rx="8" fill="var(--c1)"/><text x="280" y="124" fill="var(--text)">A2A · agen ↔ agen</text><text x="280" y="142" font-size="10" fill="var(--text)">Agent Card · task lifecycle · artifact</text>
<rect x="130" y="180" width="300" height="60" rx="8" fill="var(--c3)"/><text x="280" y="204" fill="var(--text)">MCP · agen ↔ tool</text><text x="280" y="222" font-size="10" fill="var(--text)">function calling, resources, prompts</text>
</g>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">
<text x="80" y="140">komplemen,</text><text x="80" y="156">bukan kompetitor</text>
<text x="480" y="140">satu agen A2A di dalamnya</text><text x="480" y="156">bisa memakai MCP untuk tool-nya</text>
</g>
<text x="280" y="272" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">tiga lapisan, tiga relasi — salah pilih lapisan = salah arsitektur</text>
</svg>`;

export const aai17: V2Lesson = {
  slug: "aai17-a2a-protocol",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI17 — A2A Protocol: Interop Antar-Agen Lintas Framework",
  estMinutes: 48,
  steps: [
    {
      id: "cerita-fragmentasi",
      eyebrow: "Langkah 1 · Cerita",
      title: "A2A: ketika agen bicara dengan agen",
      prose: [
        "Mei 2026. Traveloka-mirip 'NusaTrip' punya tiga agen AI: concierge LangGraph (internal), pricing engine CrewAI (vendor), dan payment agent AutoGen (bank partner). Mimpi besarnya: satu chat — 'rencanakan liburan 3 hari ke Labuan Bajo' — didelegasikan otomatis antar agen. Kenyataannya: tiga integrasi REST custom, tiga format auth, tiga cara melaporkan 'task selesai'. Menambah satu vendor baru = 6 minggu integrasi. Vendor mengganti field JSON = semua rusak diam-diam. CTO-nya menyimpulkan pahit: 'Kita membangun kembali internet tahun 1990 — setiap dua komputer butuh kabel custom.'",
        "Masalahnya bukan agen-nya — ketiganya bagus. Masalahnya adalah TIDAK ADA BAHASA BERSAMA untuk agen bicara dengan agen. Setiap framework punya dialek sendiri untuk 'ini kemampuanku', 'kerjakan ini', 'ini progresnya', 'aku butuh info tambahan'. Hasilnya masalah N×M klasik: N framework × M vendor = N×M integrasi custom yang rapuh.",
        "Twist-nya: Google mengumumkan A2A (Agent2Agent Protocol) pada April 2025 — protokol TERBUKA untuk interop antar-agen, didukung 50+ partner industri, lalu didonasikan ke Linux Foundation pada 23 Juni 2025 agar tidak dikuasai satu vendor. Idenya: seperti HTTP untuk web — agen mana pun, framework apa pun, bisa menemukan agen lain (Agent Card), mendelegasikan task, memantau lifecycle-nya, dan menerima hasilnya (artifact) — tanpa tahu isi perut lawan bicaranya. SDK tersedia untuk Python, Go, JavaScript, Java, .NET, dan Rust.",
        "📝 Poin inti lesson ini (panel 'Poin penting' merangkum seluruhnya di akhir): (1) A2A = bahasa bersama agen↔agen: discovery via Agent Card, delegasi via task, hasil via artifact; (2) task punya lifecycle (submitted → working → input-required → completed/failed) — agen boleh jeda dan bertanya di tengah jalan; (3) transport = JSON-RPC 2.0 over HTTPS + SSE streaming + webhook push; (4) A2A komplemen MCP (agen↔tool), bukan penggantinya; (5) protokol tidak otomatis aman — card harus diverifikasi, auth per skill.",
        "Bekal kilat (agar lesson ini mandiri, 3 kalimat): agen AI modern bekerja dalam loop tool-calling — model memutuskan memanggil FUNGSI (tool), membaca hasilnya, lalu melanjutkan; pola ini disebut ReAct dan dibahas di aai3. MCP (Model Context Protocol, aai13) adalah standar agar SATU agen bisa memakai tool dari banyak server — tetapi MCP hanya mengatur relasi agen↔tool, bukan agen↔agen. Lesson ini = lapisan di ATASNYA: bagaimana agen yang satu mendelegasikan pekerjaan ke agen lain yang dibangun pihak berbeda.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan 4 konsep inti A2A (Agent Card, task, message/part, artifact); (2) memetakan task lifecycle dan kapan input-required dipakai; (3) membedakan peran A2A vs MCP vs AG-UI; (4) merancang discovery + delegasi antar-agen; (5) menilai risiko keamanan interop (card spoofing, auth) dengan benar.",
        "🗺️ Isi lesson (⏱ 48 mnt · 1 lab · 6 kuis · 2 diagram · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · Agent Card & discovery — Langkah 3 · Task lifecycle — Langkah 4 · Lab broker A2A — Langkah 5 · A2A vs MCP vs AG-UI — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case NusaTrip — Checkpoint.",
      ],
      tasks: [],
      reference: "A2A = HTTP-nya dunia agen: bahasa bersama lintas framework dan vendor.",
    },
    {
      id: "kartu-agen",
      eyebrow: "Langkah 2 · Agent Card & discovery",
      title: "Agent Card: kartu nama yang bisa dibaca mesin",
      prose: [
        "Semua interop dimulai dari satu pertanyaan: 'kamu bisa apa, dan bagaimana menghubungimu?' Di dunia manusia jawabannya kartu nama; di A2A jawabannya AGENT CARD — dokumen JSON yang dipublish di URL well-known (`/.well-known/agent.json`), berisi: identitas agen (nama, deskripsi, versi), daftar SKILL (kemampuan bernama: 'cari_hotel', 'bayar' — lengkap dengan deskripsi input/output), endpoint, dan syarat AUTH (api_key, oauth2, mTLS). Client agent men-fetch card ini SEBELUM mengirim apa pun — discovery dulu, delegasi kemudian.",
        "Mengapa card, bukan registry terpusat? Karena web tidak punya 'kantor pusat'. Model A2A meniru DNS + HTTP: siapa pun bisa publish card di domainnya sendiri, siapa pun bisa menemukannya. Desentralisasi ini yang membuatnya skalabel lintas vendor — tetapi juga yang membuatnya butuh verifikasi (lebih lanjut di langkah 5). Kartu nama di dunia nyata juga begitu: berguna, tetapi kamu tetap memverifikasi sebelum transfer uang.",
        "Skill adalah unit terkecil yang diiklankan — BUKAN tool internal. Bedanya penting: tool (MCP) = fungsi yang dipanggil model di dalam satu agen; skill (A2A) = kemampuan yang ditawarkan agen ke DUNIA LUAR. Agen hotel boleh punya 20 tool internal (cek DB, hitung pajak, format struk) tetapi hanya mengiklankan 2 skill: 'cari_hotel' dan 'pesan_kamar'. Skill = API publik agen; tool = dapur pribadinya. Batas ini yang membuat agen tetap OPAQUE: lawan bicara tidak tahu — dan tidak perlu tahu — cara kerjanya di dalam.",
        "Contoh card minimal (bentuk aslinya JSON): name 'HotelBot', url 'https://hotel.example/a2a', skills: [{name: 'cari_hotel', description: 'mencari hotel berdasarkan kota dan tanggal'}], auth: {type: 'api_key'}. Client yang butuh 'cari_hotel' cukup fetch card, cocokkan nama skill, lalu kirim task ke url tersebut dengan auth yang diminta. Tidak ada SDK khusus vendor, tidak ada N×M integrasi — hanya HTTP + JSON yang sudah dipahami semua orang.",
        "Kepribadian Agent Card: seperti papan menu di depan restoran — daftar apa yang BISA dipesan, bukan resep dapurnya. Kamu tidak perlu tahu koki memakai wajan apa untuk memesan nasi goreng; kamu hanya perlu tahu nasi goreng ADA di menu dan berapa harganya. Skill = menu; tool internal = resep.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Agent Card membalik beban integrasi: dulu NusaTrip harus MEMPELAJARI tiap vendor (baca docs, tulis adapter); dengan A2A, vendor yang MENERBITKAN card standar dan NusaTrip cukup membaca satu format. Beban berpindah dari konsumen ke produsen — dan produsen hanya melakukannya SEKALI untuk semua konsumen. Inilah ekonomi protokol terbuka.",
      },
      reference: "Discovery dulu (fetch Agent Card), delegasi kemudian. Skill = menu publik, tool = dapur privat.",
    },
    {
      id: "task-lifecycle",
      eyebrow: "Langkah 3 · Task lifecycle",
      title: "Task lifecycle: delegasi yang bisa jeda dan bertanya",
      prose: [
        "Setelah discovery, client mengirim TASK — unit kerja stateful dengan lifecycle yang terdefinisi: `submitted` (diterima) → `working` (dikerjakan) → `completed` / `failed` / `canceled`. Status `input-required` adalah bintangnya: agen boleh BERHENTI di tengah task, meminta informasi tambahan dari client ('tanggal check-out belum jelas — 21 atau 22?'), lalu MELANJUTKAN setelah dijawab. Ini kolaborasi dua arah, bukan fire-and-forget. Tanpa status ini, setiap ambiguitas = task gagal + delegasi ulang dari nol.",
        "Isi percakapan task dibawa oleh MESSAGE yang terdiri dari PARTS: TextPart (teks biasa), FilePart (file/bytes), DataPart (JSON terstruktur). Hasil kerja dikembalikan sebagai ARTIFACT — output bernama yang bisa dikirim bertahap (incremental): agen hotel bisa me-streaming '3 hotel ditemukan' sebagai artifact parsial, lalu 'booking confirmed' sebagai artifact final. Client tidak menunggu buta; ia melihat progres.",
        "Transportnya sengaja membosankan (dengan pujian): JSON-RPC 2.0 over HTTPS untuk request/response, SSE (Server-Sent Events) untuk streaming update task panjang, dan push notification via webhook untuk task yang berjalan berjam-jam (client tidak perlu polling). Tiga pola interaksi: sinkron (tanya-jawab cepat), streaming (progres real-time), async (webhook saat selesai). 'Membosankan' = setiap engineer sudah paham, setiap firewall sudah mengizinkan, setiap bahasa punya library-nya.",
        "Contoh alur NusaTrip: concierge (client) fetch card HotelBot → kirim task 'cari hotel Labuan Bajo 20-22 Okt' → status working, artifact parsial berisi 5 kandidat → HotelBot menemukan dua opsi butuh konfirmasi budget → status input-required ('budget per malam?') → concierge menjawab 'di bawah 2 juta' → working lagi → completed dengan artifact final 'booking H-123'. Satu task, satu alur, dua jeda kolaboratif — tanpa satu pun integrasi custom.",
        "Cara membaca diagram: lingkaran = status, panah = transisi yang diizinkan. Interpretasi: perhatikan panah BOLAK-BALIK antara working dan input-required — itulah yang membedakan A2A dari API biasa. API biasa: request → response (atau error). A2A: request → kerja → 'tunggu, aku butuh X' → kerja lagi → selesai. Panah bolak-balik itu = pengakuan bahwa pekerjaan nyata itu berantakan dan butuh klarifikasi.",
      ],
      figure: {
        svg: FIG_LIFECYCLE,
        alt: "Diagram status task A2A dengan transisi submitted, working, input-required, completed, failed, canceled.",
        caption: "Task lifecycle A2A — input-required memungkinkan jeda kolaboratif (a2aproject.github.io/A2A).",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'A2A = kirim prompt ke agen lain, terima jawaban.' Bukan. Itu API biasa. Nilai A2A justru pada apa yang TIDAK dimiliki API biasa: lifecycle stateful yang bisa dipantau, jeda input-required untuk klarifikasi, dan artifact bertahap. Kalau interaksimu selalu sinkron tanya-jawab, kamu belum butuh A2A — REST biasa cukup. Adopsi protokol harus mengikuti kebutuhan, bukan tren.",
      },
      reference: "Task = stateful; input-required = jeda kolaboratif; artifact = hasil bertahap.",
    },
    {
      id: "lab-broker",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: broker A2A mini",
      prose: [
        "SIMULASI — kamu membangun broker A2A mini dalam Python murni: tiga agent card terdaftar (HotelBot, FlightBot, PayBot), lima task masuk. Tidak ada network, tidak ada server asli — yang disimulasikan adalah LOGIKA PROTOKOLNYA: discovery skill dan transisi lifecycle.",
        "Tugasmu: implementasikan `discover(skill)` (cari agen yang mengiklankan skill itu di card-nya, kembalikan id-nya atau None) dan `run(task)` (kembalikan daftar status yang dilalui + artifact). Aturan lifecycle yang disimulasikan: agen tak dikenal → langsung `failed`; skill tak dikenal → `failed`; task butuh input user (`needs_input`) → `submitted → working → input-required → working → completed`; sisanya → `submitted → working → completed`. Artifact = dict berisi siapa yang mengerjakan dan ringkasan hasil.",
        "Cara membaca output: `completed/failed/paused` = ringkasan 5 task; `discover_bayar` harus menemukan 'pembayaran' (PayBot mengiklankan skill 'bayar'); `discover_antar` harus None (tidak ada yang mengiklankan). Interpretasi: 3 completed (termasuk 1 yang sempat paused di input-required), 2 failed — satu karena skill tak dikenal ('antar_makanan' tidak ada di card HotelBot), satu karena agen tak dikenal ('kurir' tidak terdaftar). Kegagalan terstruktur (failed dengan sebab jelas) JAUH lebih baik daripada integrasi custom yang rusak diam-diam.",
        "Coba eksplorasi: (1) tambah card 'kuliner' dengan skill 'antar_makanan' — task ke-4 sekarang completed; (2) ubah aturan: skill tak dikenal → coba 'tebak' agen terdekat — rasakan mengapa protokol MELARANG tebakan (ambiguitas = bug); (3) tambah status 'canceled' untuk task yang dibatalkan client di tengah working. Pertanyaan refleksi: di sistem nyata, siapa yang seharusnya memverifikasi bahwa card 'PayBot' benar-benar milik bank — bukan penipu? (Petunjuk: langkah 5.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `discover(skill)`: kembalikan id agen yang mengiklankan skill itu, atau None" },
        { id: "t2", text: "Implementasikan `run(task)`: kembalikan (states, artifact) sesuai 4 aturan lifecycle" },
        { id: "t3", text: "Jalankan 5 task, baca ringkasan & hasil discover, pastikan sesuai ekspektasi" },
      ],
      expected: "tasks: 5 · completed: 3 failed: 2 paused: 1 · discover_bayar: pembayaran · discover_antar: None",
      note: {
        title: "💡 Intuisi",
        body: "Broker ini = 'kantor pos' antar-agen: ia tidak tahu CARA HotelBot mencari hotel (opaque), ia hanya tahu ALAMATNYA (card) dan ATURAN MAINNYA (lifecycle). Itulah seluruh filosofi A2A — standarkan amplop dan perangkonya, biarkan isi surat jadi urusan masing-masing agen.",
      },
      hints: [
        "discover: loop CARDS.items(), cek 'if skill in card[\"skills\"]'",
        "run: cek task['to'] in CARDS dulu -> ['failed']; lalu skill via discover -> ['failed']",
        "needs_input: task.get('needs_input') -> sisipkan 'input-required' lalu 'working' lagi",
        "artifact: {'by': task['to'], 'result': task['text']}",
      ],
      code: {
        starter: `# SEED — jangan ubah
CARDS = {
    "hotel": {"name": "HotelBot", "skills": ["cari_hotel", "pesan_kamar"], "auth": "api_key"},
    "penerbangan": {"name": "FlightBot", "skills": ["cari_penerbangan"], "auth": "oauth2"},
    "pembayaran": {"name": "PayBot", "skills": ["bayar"], "auth": "mtls"},
}

TASKS = [
    {"to": "hotel", "skill": "cari_hotel", "text": "cari hotel di Makassar 20 Okt"},
    {"to": "penerbangan", "skill": "cari_penerbangan", "text": "cari penerbangan CGK-UPG 20 Okt"},
    {"to": "pembayaran", "skill": "bayar", "text": "bayar booking hotel", "needs_input": True},
    {"to": "hotel", "skill": "antar_makanan", "text": "pesan makanan ke kamar"},
    {"to": "kurir", "skill": "antar", "text": "kirim dokumen"},
]

# TULIS KODEMU (di bawah garis ini)
def discover(skill):
    # TODO t1: id agen yang mengiklankan skill, atau None
    return None

def run(task):
    # TODO t2: (states, artifact) sesuai 4 aturan lifecycle
    return [], None

# UJI (jangan ubah)
results = []
for t in TASKS:
    states, artifact = run(t)
    results.append((t["to"], states[-1] if states else "?", "input-required" in states))
n_completed = sum(1 for _, s, _ in results if s == "completed")
n_failed = sum(1 for _, s, _ in results if s == "failed")
n_paused = sum(1 for _, s, p in results if p)
print("tasks:", len(results))
print("completed:", n_completed, "failed:", n_failed, "paused:", n_paused)
print("discover_bayar:", discover("bayar"))
print("discover_antar:", discover("antar"))`,
        lockLines: 15,
        solution: `# SEED — jangan ubah
CARDS = {
    "hotel": {"name": "HotelBot", "skills": ["cari_hotel", "pesan_kamar"], "auth": "api_key"},
    "penerbangan": {"name": "FlightBot", "skills": ["cari_penerbangan"], "auth": "oauth2"},
    "pembayaran": {"name": "PayBot", "skills": ["bayar"], "auth": "mtls"},
}

TASKS = [
    {"to": "hotel", "skill": "cari_hotel", "text": "cari hotel di Makassar 20 Okt"},
    {"to": "penerbangan", "skill": "cari_penerbangan", "text": "cari penerbangan CGK-UPG 20 Okt"},
    {"to": "pembayaran", "skill": "bayar", "text": "bayar booking hotel", "needs_input": True},
    {"to": "hotel", "skill": "antar_makanan", "text": "pesan makanan ke kamar"},
    {"to": "kurir", "skill": "antar", "text": "kirim dokumen"},
]

# TULIS KODEMU (di bawah garis ini)
def discover(skill):
    for aid, card in CARDS.items():
        if skill in card["skills"]:
            return aid
    return None

def run(task):
    aid = task["to"]
    if aid not in CARDS:
        return ["failed"], None
    if discover(task["skill"]) != aid:
        return ["failed"], None
    artifact = {"by": aid, "result": task["text"]}
    if task.get("needs_input"):
        return ["submitted", "working", "input-required", "working", "completed"], artifact
    return ["submitted", "working", "completed"], artifact

# UJI (jangan ubah)
results = []
for t in TASKS:
    states, artifact = run(t)
    results.append((t["to"], states[-1] if states else "?", "input-required" in states))
n_completed = sum(1 for _, s, _ in results if s == "completed")
n_failed = sum(1 for _, s, _ in results if s == "failed")
n_paused = sum(1 for _, s, p in results if p)
print("tasks:", len(results))
print("completed:", n_completed, "failed:", n_failed, "paused:", n_paused)
print("discover_bayar:", discover("bayar"))
print("discover_antar:", discover("antar"))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "tasks: 5", label: "5 task diproses", msg: "Semua task masuk ke broker." },
          { kind: "stdout_matches", task: "t3", pattern: "completed: 3 failed: 2 paused: 1", label: "Ringkasan lifecycle benar", msg: "3 completed (1 sempat paused), 2 failed terstruktur." },
          { kind: "stdout_matches", task: "t1", pattern: "discover_bayar: pembayaran", label: "Discovery menemukan PayBot", msg: "Skill 'bayar' teriklankan di card pembayaran." },
          { kind: "stdout_matches", task: "t1", pattern: "discover_antar: None", label: "Skill tak dikenal → None", msg: "Tidak ada tebakan — protokol melarang ambiguitas." },
        ],
      },
      reference: "Standarkan amplop dan perangko (card + lifecycle); isi surat urusan tiap agen.",
    },
    {
      id: "a2a-vs-mcp",
      eyebrow: "Langkah 5 · A2A vs MCP vs AG-UI",
      title: "A2A vs MCP vs AG-UI: tiga lapisan, tiga relasi",
      prose: [
        "Kebingungan paling umum: 'bukankah ini sama dengan MCP?' Tidak — mereka mengatur RELASI yang berbeda. MCP = agen↔TOOL: satu agen memanggil fungsi, membaca resource, memakai prompt template. A2A = agen↔AGEN: satu agen mendelegasikan task ke agen lain yang otonom. AG-UI = agen↔USER: streaming hasil ke antarmuka, meminta persetujuan manusia. Tiga relasi, tiga protokol — komplemen, bukan kompetitor.",
        "Hubungan praktisnya: satu agen A2A (mis. HotelBot) DI DALAMNYA bisa memakai MCP untuk memanggil tool-nya (cek database kamar, hitung pajak). Dari luar, ia terlihat sebagai satu skill 'cari_hotel' di Agent Card; dari dalam, ia adalah agen ReAct dengan 20 tool MCP. Lapisan tidak bocor ke atas: client A2A tidak pernah tahu HotelBot pakai MCP, SQL, atau spreadsheet.",
        "Kapan pakai yang mana: butuh tool eksternal untuk SATU agen → MCP (aai13). Butuh delegasi antar agen lintas tim/vendor/framework → A2A. Butuh user melihat progres dan menyetujui aksi → AG-UI. NusaTrip memakai ketiganya: concierge pakai MCP untuk kalkulator internal, A2A untuk delegasi ke HotelBot/FlightBot/PayBot, AG-UI untuk menampilkan 'menunggu konfirmasi budget' ke user. Arsitektur yang benar = menumpuk lapisan, bukan memilih satu.",
        "Keamanan interop (jangan dilewatkan): A2A TIDAK otomatis aman. (1) Card spoofing — siapa pun bisa publish card yang mengaku 'PayBot bank'; verifikasi identitas via TLS/mTLS + allowlist domain sebelum delegasi sensitif. (2) Auth per skill — card mengiklankan syarat auth; client WAJIB memenuhinya, dan scope minimum (pelajaran aai16: least privilege berlaku antar-agen juga). (3) Task injection — artifact dari agen luar = input tak terpercaya; validasi sebelum diteruskan ke agen berikut (rantai multi-agent = rantai kepercayaan, sekuat tautan terlemahnya). Protokol memberi amplop standar; isi amplop tetap harus dicurigai.",
        "Cara membaca diagram: tiga balok bertumpuk = tiga relasi. Interpretasi: kalau masalahmu 'agenku butuh data dari API X' → balok bawah (MCP). 'Agenku butuh bantuan agen vendor' → balok tengah (A2A). 'User harus approve dulu' → balok atas (AG-UI). Kebanyakan arsitektur multi-agent yang gagal = mencoba menyelesaikan masalah balok tengah dengan alat balok bawah (mis. 'kita expose agen vendor sebagai MCP tool' — lalu kehilangan lifecycle, jeda, dan artifact).",
      ],
      figure: {
        svg: FIG_STACK,
        alt: "Tumpukan protokol: MCP untuk agen ke tool, A2A untuk agen ke agen, AG-UI untuk agen ke user.",
        caption: "Tiga lapisan, tiga relasi — A2A komplemen MCP, bukan penggantinya.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'A2A menggantikan MCP — satu protokol untuk semua.' Salah total. MCP mengatur BAGAIMANA agen memakai tool; A2A mengatur BAGAIMANA agen bekerja sama. Menghapus MCP demi A2A = agen yang bisa bicara dengan siapa pun tetapi tidak bisa berbuat apa-apa. Dan 'A2A = aman karena standar' juga salah: standar menyeragamkan FORMAT, bukan NIAT — card spoofing dan task injection tetap harus ditangani (lihat aai16 untuk prinsipnya).",
      },
      reference: "MCP = agen↔tool, A2A = agen↔agen, AG-UI = agen↔user. Tumpuk, jangan pilih satu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: kapan A2A, kapan tidak?",
      prose: [
        "Skenario 1 — delegasi lintas framework/vendor (concierge LangGraph + pricing CrewAI + payment vendor): → A2A. Ini habitat aslinya; N×M integrasi custom runtuh menjadi N+M implementasi protokol.",
        "Skenario 2 — semua agen satu framework, satu tim, satu deploy: → framework-native SAJA (LangGraph subgraph, CrewAI crew). A2A menambah overhead card/lifecycle tanpa pembeli manfaat — protokol untuk BATAS organisasi, bukan batas modul.",
        "Skenario 3 — agen butuh tool/fungsi eksternal (API cuaca, database, search): → MCP, bukan A2A. Jangan 'membungkus tool sebagai agen' hanya agar terlihat modern — tool ≠ agen; agen punya otonomi dan lifecycle, tool tidak.",
        "Skenario 4 — task panjang butuh jeda, klarifikasi, dan progres bertahap: → A2A dengan input-required + artifact streaming. Jika selalu sinkron tanya-jawab, REST biasa lebih murah.",
        "Skenario 5 — vendor baru masuk tiap kuartal: → A2A + Agent Card sebagai KONTRAK. Onboarding = 'publish card sesuai skema, lolos conformance test' — bukan 'jadwalkan 6 minggu integrasi'. Card = API contract yang bisa dibaca mesin.",
        "Aturan praktis 10 detik: (1) lintas batas organisasi/framework? A2A. (2) butuh tool? MCP. (3) butuh user approve? AG-UI. (4) semua internal? Native. (5) verifikasi card + auth per skill SEBELUM delegasi sensitif — protokol tanpa verifikasi = amplop tanpa perangko pengaman.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "A2A = perjanjian antar-negara (lintas batas, formal, terverifikasi); framework-native = peraturan rumah tangga (internal, cepat, informal). Kamu tidak butuh perjanjian internasional untuk mengatur siapa mencuci piring di rumahmu — dan kamu tidak bisa mengatur diplomasi dengan peraturan rumah tangga.",
      },
      reference: "Lintas batas → A2A. Internal → native. Butuh tool → MCP. Selalu verifikasi card.",
    },
    {
      id: "minicase-nusatrip",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: NusaTrip memangkas 6 minggu jadi 1",
      prose: [
        "Situasi: NusaTrip, 3 agen (LangGraph internal, CrewAI vendor pricing, AutoGen bank). Setiap integrasi custom: 6 minggu engineer (2 minggu baca docs vendor, 2 minggu tulis adapter + auth, 2 minggu uji + edge case). Total 12 minggu untuk 2 vendor. Maintenance: tiap vendor ganti field JSON ~2×/tahun → 1 minggu perbaikan darurat per insiden. Biaya tahunan integrasi ≈ 16 minggu engineer.",
        "Intervensi (angka ilustrasi): adopsi A2A. Concierge ditulis sekali sebagai A2A client (3 minggu). Tiap vendor: publish Agent Card + implementasi task endpoint sesuai spec (1 minggu per vendor — mereka sudah punya SDK Python/Go/JS). Total: 5 minggu untuk 2 vendor vs 12 minggu sebelumnya. Vendor ketiga (asuransi perjalanan, framework .NET): 1 minggu — card-nya langsung dibaca client yang sama. Tidak ada adapter baru.",
        "Pembahasan: penghematan bukan hanya waktu, tetapi JENIS risiko yang hilang. Dulu: 'vendor ganti field → rusak diam-diam' (kontrak implisit). Sekarang: card = kontrak mesin-terbaca; perubahan skill = versi card baru → client menolak task ke skill yang tidak dikenal dengan `failed` yang JELAS (seperti lab langkah 4), bukan jawaban ngawur. Kegagalan berubah dari silent menjadi loud — dan dalam sistem terdistribusi, loud failure = berkah.",
        "Tetapi (pembahasan jujur): A2A bukan gratis. Biaya yang muncul: (a) conformance testing per vendor (card valid ≠ perilaku benar); (b) observability lintas batas — task yang `working` 2 jam di vendor = siapa yang dihubungi? (c) keamanan: verifikasi card + mTLS per skill (langkah 5). Aturan keputusannya: A2A worth it bila vendor ≥ 2 ATAU churn vendor tinggi; untuk 1 vendor stabil selamanya, integrasi custom yang rapi bisa lebih murah. Protokol = investasi yang baru balik modal di skala.",
      ],
      tasks: [],
      reference: "A2A mengubah kontrak implisit menjadi kontrak mesin-terbaca; kegagalan menjadi loud.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan dari semua langkah. Setiap opsi menjelaskan alasan benar/salahnya.",
      ],
      tasks: [],
      summary: [
        "A2A = protokol terbuka (Google 04/2025 → Linux Foundation 23 Jun 2025; v1.0 Maret 2026) untuk interop agen↔agen lintas framework/vendor; SDK Python/Go/JS/Java/.NET/Rust.",
        "Agent Card (/.well-known/agent.json): kartu nama mesin-terbaca — identitas, skill (menu publik), endpoint, syarat auth. Discovery dulu, delegasi kemudian.",
        "Task lifecycle: submitted → working → input-required → completed/failed/canceled; input-required = jeda kolaboratif; hasil = artifact (bisa bertahap).",
        "Transport: JSON-RPC 2.0 over HTTPS + SSE streaming + webhook push; tiga pola: sinkron, streaming, async.",
        "A2A komplemen MCP (agen↔tool) dan AG-UI (agen↔user) — tiga relasi, tiga protokol; satu agen A2A di dalamnya bisa memakai MCP.",
        "Keamanan tidak otomatis: verifikasi card (anti-spoofing), auth per skill + least privilege, artifact luar = input tak terpercaya.",
      ],
      next: { label: "AAI19 — Cloud Deployment Agen: Dari Laptop ke Produksi", href: "/v2/learn/aai19-cloud-deployment-agen" },
      quiz: [
        {
          q: "Apa perbedaan fundamental skill (A2A) vs tool (MCP)?",
          options: [
            { text: "Skill = kemampuan yang diiklankan agen ke dunia luar; tool = fungsi internal yang dipanggil model di dalam agen", why: "Tepat: skill = menu publik (opaque), tool = dapur privat. Batas ini yang menjaga otonomi agen.", correct: true },
            { text: "Skill lebih canggih dari tool", why: "Bukan soal canggih — soal BATAS: siapa yang boleh memakainya dan seberapa otonom pelaksananya.", correct: false },
            { text: "Tidak ada bedanya, hanya istilah vendor", why: "Salah: tool dieksekusi langsung oleh model; skill didelegasikan sebagai task ke agen otonom dengan lifecycle.", correct: false },
            { text: "Skill hanya untuk agen Google, tool untuk yang lain", why: "A2A vendor-netral (Linux Foundation); siapa pun bisa mengiklankan skill.", correct: false },
          ],
        },
        {
          q: "HotelBot berhenti di tengah task dan bertanya 'budget per malam?'. Status A2A apa ini dan mengapa berharga?",
          options: [
            { text: "input-required — kolaborasi dua arah; tanpa ini ambiguitas = task gagal + delegasi ulang dari nol", why: "Tepat: inilah pembeda A2A dari API biasa — jeda, klarifikasi, lanjutkan.", correct: true },
            { text: "failed — agen seharusnya tidak pernah bertanya", why: "Kebalikannya: bertanya di tengah jalan = fitur, bukan bug. Agen otonom yang baik mengklarifikasi.", correct: false },
            { text: "canceled — task dibatalkan user", why: "Canceled = dihentikan permanen; ini jeda sementara menunggu input.", correct: false },
            { text: "submitted — task dikirim ulang", why: "Task tidak dikirim ulang; ia dijeda dan dilanjutkan dalam lifecycle yang sama.", correct: false },
          ],
        },
        {
          q: "NusaTrip butuh: (a) concierge memakai kalkulator internal, (b) delegasi ke HotelBot vendor, (c) user menyetujui pembayaran. Susunan protokol yang benar?",
          options: [
            { text: "MCP untuk (a), A2A untuk (b), AG-UI untuk (c) — tiga relasi, tiga protokol", why: "Tepat: tool internal = MCP; lintas vendor = A2A; persetujuan manusia = AG-UI.", correct: true },
            { text: "A2A untuk semuanya — satu protokol cukup", why: "A2A tidak mengatur tool internal maupun UI persetujuan; memaksakannya = salah lapisan.", correct: false },
            { text: "MCP untuk semuanya — expose HotelBot sebagai MCP tool", why: "Kehilangan lifecycle, input-required, dan artifact bertahap — mereduksi agen otonom menjadi fungsi.", correct: false },
            { text: "REST custom untuk semuanya — paling fleksibel", why: "Itulah masalah awal NusaTrip: N×M integrasi rapuh. Fleksibel hari ini, utang besok.", correct: false },
          ],
        },
        {
          q: "Di lab, task 'antar_makanan' ke HotelBot menghasilkan failed. Mengapa ini PERILAKU BENAR, bukan bug?",
          options: [
            { text: "Skill tidak ada di Agent Card → penolakan eksplisit; kegagalan loud lebih baik dari tebakan diam-diam", why: "Tepat: protokol melarang ambiguitas. Failed yang jelas > jawaban ngawur.", correct: true },
            { text: "Broker-nya kurang pintar menebak maksud user", why: "Menebak = bug dalam protokol interop. Determinisme > kepintaran di batas organisasi.", correct: false },
            { text: "HotelBot seharusnya otomatis belajar skill baru", why: "Skill = kontrak yang diterbitkan; agen tidak boleh mengarang kemampuan di runtime.", correct: false },
            { text: "Task-nya harus di-retry sampai berhasil", why: "Retry tidak menciptakan skill yang tidak ada. Gagal cepat, perbaiki kontraknya.", correct: false },
          ],
        },
        {
          q: "Sebuah card mengklaim sebagai 'PayBot bank resmi'. Sebelum mendelegasikan pembayaran, apa yang WAJIB dilakukan?",
          options: [
            { text: "Verifikasi identitas (TLS/mTLS, allowlist domain) + penuhi auth per skill dengan scope minimum", why: "Tepat: card spoofing itu nyata; standar menyeragamkan format, bukan niat.", correct: true },
            { text: "Langsung delegasi — card resmi pasti aman", why: "'Resmi' di JSON yang ditulis siapa pun = klaim sepihak. Verifikasi dulu (pelajaran aai16).", correct: false },
            { text: "Minta LLM menilai apakah card-nya terlihat meyakinkan", why: "Model probabilistik bukan verifikasi identitas; butuh kriptografi (mTLS) dan allowlist.", correct: false },
            { text: "Cek jumlah skill-nya — semakin banyak semakin tepercaya", why: "Jumlah skill tidak berkorelasi dengan keaslian. Verifikasi = identitas + auth.", correct: false },
          ],
        },
        {
          q: "Kapan A2A TIDAK worth it?",
          options: [
            { text: "Semua agen satu framework internal dan satu vendor stabil selamanya — overhead protokol tanpa pembeli manfaat", why: "Tepat: A2A investasi yang balik modal di skala lintas-batas; internal = native saja.", correct: true },
            { text: "Ketika ada lebih dari 2 vendor", why: "Kebalikannya: ≥2 vendor atau churn tinggi = kasus terbaik A2A.", correct: false },
            { text: "Ketika task butuh jeda dan klarifikasi", why: "Itu justru alasan TERKUAT memakai A2A (input-required).", correct: false },
            { text: "Ketika butuh verifikasi keamanan", why: "Kebutuhan verifikasi bukan alasan menolak protokol — ia alasan melakukannya dengan benar.", correct: false },
          ],
        },
      ],
    },
  ],
};
