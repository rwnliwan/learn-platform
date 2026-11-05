import type { V2Mission } from "../lib/types";
import type { V2Step } from "../lib/types";

// ── MISI Tool: Agen yang Membuka Pintu yang Salah ─────────────────────────
// CAPSTONE M1 (AI Engineering × Agentic AI). Dataset SINTETIS: trace tool call,
// retrieval chunks, dokumen kebijakan refund, dan skema tool — semuanya fiksi
// (seed 42). BUKAN log produksi, TANPA kredensial/data akun, TANPA PII nyata.
// File: public/misi/misi-gabung-rag-agen/ (tool_traces.json,
// retrieval_chunks.json, kebijakan_refund.json, tool_schema.json, METODE.md).

const BASE = "/misi/misi-gabung-rag-agen";

export const misiGabungRagAgen: V2Mission = {
  slug: "misi-gabung-rag-agen",
  track: "AI Engineering",
  module: "Misi",
  title: "Misi Tool: Agen yang Membuka Pintu yang Salah",
  estMinutes: 180,
  role: "AI engineer",
  client:
    "Head of Customer Success — RAG yang di-upgrade jadi agen (tools: query DB, kirim email, web search) mengirim email refund dengan nominal yang SALAH ke pelanggan nyata",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Email Rp500.000 untuk mesin Rp4.750.000",
      prose: [],
      tasks: [],
      briefing: {
        role: "AI engineer di tim platform — pemilik keamanan tool-use CS-Agen v2",
        client:
          "Head of Customer Success. Tiga minggu lalu tim meng-upgrade chatbot RAG menjadi CS-Agen v2: selain menjawab dari dokumen, ia sekarang bisa memanggil tool — query DB order, kirim email, web search. Kemarin pukul 09:03, agen itu mengirim email persetujuan refund sebesar Rp500.000 ke Ibu Ratna, pelanggan yang mesin kopi Rp4.750.000-nya rusak saat pengiriman. Pukul 13:20 komplain masuk: “Ini tidak masuk akal.” Tim legal bertanya satu hal yang tidak bisa dijawab siapa pun: manusia mana yang menyetujui angka itu? Jawabannya: tidak ada. Tidak ada manusia yang menyetujui apa pun.",
        story: [
          "Rabu, 2026-10-14, 09:02. Tiket masuk: “Mesin kopi saya (ORD-8817) rusak saat pengiriman. Saya mau refund.” CS-Agen v2 bekerja persis seperti di demo: ia mencari dokumen kebijakan refund, membaca data order dari database, lalu — tanpa jeda, tanpa bertanya ke siapa pun — memanggil tool send_email. Email terkirim 09:03:05. Di demo, adegan ini selalu menuai tepuk tangan: “Lihat, agennya otonom!”",
          "Masalahnya: angka di email itu salah. Kebijakan refund sudah diperbarui empat hari sebelumnya — batas maksimal per insiden naik dari Rp500.000 menjadi Rp5.000.000 — tapi index retrieval agen belum di-refresh sejak 5 Oktober. Agen mengambil “fakta” dari foto basi, menghitung dengan percaya diri, dan mengeksekusi. Tidak ada yang menghentikannya, karena gerbang konfirmasi manusia yang tertulis di dokumen desain tidak pernah dipanggil.",
          "Kamis pagi, vendor yang membangun agen ini mengirim “laporan audit keamanan” setebal 10 baris yang menyimpulkan: sistem aman, gerbang berfungsi, index terkini. Kamu mencium sesuatu — tiga klaim di laporan itu bertentangan dengan data mentah yang kamu pegang. Misi ini: rekonstruksi timeline insiden dari trace, audit kesegaran index, bongkar 4 sabotase di laporan vendor, lalu tulis spesifikasi keamanan tool-use agar pintu yang salah ini tidak terbuka dua kali.",
        ],
        objectives: [
          "Merekonstruksi timeline tool call dari trace mentah dan menemukan di mana gerbang konfirmasi manusia dilewati (lab 1).",
          "Menghitung umur index retrieval dan membuktikan chunk yang dipakai agen sudah basi saat insiden (lab 2).",
          "Menemukan 4 sabotase di laporan audit vendor dengan membandingkan setiap klaim ke data mentah.",
          "Menulis spesifikasi keamanan tool-use: tier izin tool, aturan gerbang, SLA kesegaran index, spesifikasi satuan nominal, dan kewajiban audit log.",
        ],
        prereqSummary:
          "Tool use / function calling = kemampuan LLM memanggil fungsi di luar dirinya (baca database, kirim email) lewat skema JSON; setiap panggilan adalah TINDAKAN, bukan sekadar teks. Human-in-the-loop = desain yang mewajibkan persetujuan manusia sebelum tindakan berisiko (tool tulis) dieksekusi — gerbang ini harus ditegakkan di kode router tool, bukan sekadar ditulis di prompt.",
        datasetNote:
          "Data 100% SINTETIS: trace tool call, 8 retrieval chunk, dokumen kebijakan refund v4, dan skema 5 tool — semuanya fiksi hasil generator acak (seed 42). BUKAN log produksi, TANPA kredensial/data akun, TANPA PII nyata (nama, email, ID order semuanya fiksi).\nFile: tool_traces.json (6 event, 2026-10-14 09:02–09:03), retrieval_chunks.json (8 chunk + indexed_at), kebijakan_refund.json (ground truth v4, update 2026-10-10), tool_schema.json (tier izin, gate policy, flag audit).\nMetode & batas jujur: file METODE.md di folder yang sama. Ambang gerbang (100 ribuan rupiah) dan angka-angka disederhanakan untuk latihan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat file, satu insiden",
      prose: [
        "Data room misi ini berisi empat file SINTETIS di folder `/misi/misi-gabung-rag-agen/`. `tool_traces.json` adalah urutan kejadian mentah: 6 event dari pesan pelanggan 09:02:11 sampai komplain 13:20 — termasuk `thought` internal agen dan field `gate` di setiap tool call. Inilah satu-satunya rekaman jujur tentang apa yang terjadi; laporan vendor nanti harus diuji terhadap file ini.",
        "`retrieval_chunks.json` berisi 8 chunk knowledge base beserta `indexed_at` (kapan chunk masuk index) dan `score` retrieval. `kebijakan_refund.json` adalah dokumen kebijakan v4 — ground truth yang berlaku saat insiden, terbit 2026-10-10. `tool_schema.json` berisi skema 5 tool: tier izin (read/write/gate), gate policy, dan flag `audit_log` per tool. Baca keempatnya sebelum menyentuh lab — investigator yang baik membaca TKP dulu, baru menyimpulkan.",
        "Dua angka untuk dipegang sejak awal: order ORD-8817 bernilai Rp4.750.000 dan rusak dalam pengiriman; kebijakan v4 memberi refund 100% maksimal Rp5.000.000 — jadi refund yang benar adalah Rp4.750.000. Email yang terkirim menyebut Rp500.000. Selisih Rp4.250.000 inilah yang harus kamu jelaskan.",
      ],
      tasks: [
        { id: "t1", text: "Buka `tool_traces.json`: catat 6 event beserta timestamp-nya" },
        { id: "t2", text: "Buka `tool_schema.json`: tool mana yang tier-nya `write` dan apa syarat konfirmasinya" },
        { id: "t3", text: "Bandingkan `indexed_at` di `retrieval_chunks.json` dengan `updated_at` di `kebijakan_refund.json`" },
      ],
      note: {
        title: "Miskonsepsi #0: trace mentah = kebenaran yang sudah rapi",
        type: "pitfall",
        body: "Trace tidak menyimpulkan apa pun — ia hanya mencatat. Field `gate: \"skipped\"` pada event send_email tidak berteriak “ini salah”; ia hanya fakta yang menunggu dibandingkan dengan gate policy di tool_schema.json. Investigasi = membandingkan artefak satu sama lain, bukan membaca satu file lalu percaya.",
      },
      reference:
        "4 file SINTETIS (seed 42): tool_traces.json, retrieval_chunks.json, kebijakan_refund.json, tool_schema.json — folder /misi/misi-gabung-rag-agen/. Angka jangkar: refund benar Rp4.750.000, terkirim Rp500.000.",
    },
    {
      id: "teori-rag",
      eyebrow: "Langkah 3 · Teori — Lensa 1: RAG",
      title: "Skor 0,91 untuk dokumen kedaluwarsa",
      prose: [
        "Lensa pertama: retrieval. RAG tidak “mengetahui” kebijakan refund — ia MENCARI. Setiap query diubah menjadi vektor, dibandingkan dengan vektor chunk di index, dan chunk dengan skor kemiripan tertinggi dikembalikan. Skor 0,91 pada chunk_014 artinya “chunk ini paling mirip dengan pertanyaanmu”, bukan “chunk ini benar” dan bukan “chunk ini terkini”. Index adalah FOTO — ia hanya setajam momen terakhir ia di-refresh.",
        "Di insiden ini fotonya basi 9 hari. Kebijakan v4 terbit 2026-10-10 (batas naik ke Rp5.000.000), tapi refresh terakhir index 2026-10-05 — chunk_014 yang dikutip agen masih membawa batas lama Rp500.000. Agen tidak berhalusinasi; ia mengutip dokumen nyata dengan sempurna. Dokumennya saja yang sudah tidak berlaku. Inilah kegagalan khas RAG: jawaban yang salah dengan sitasi yang benar.",
        "Umur index bisa dihitung seperti umur apa pun: selisih waktu insiden dan refresh terakhir. Makin besar angkanya, makin besar peluang “fakta” yang dikutip agen sudah digantikan versi baru tanpa sepengetahuan index.",
      ],
      tasks: [
        { id: "t1", text: "Hitung umur_index dari t_insiden = 2026-10-14 09:02 dan t_refresh = 2026-10-05 03:00" },
        { id: "t2", text: "Jawab satu kalimat: kenapa chunk_014 — skor TERTINGGI — justru yang paling berbahaya di insiden ini" },
      ],
      expected: "umur_index = 9 hari; chunk_014 paling berbahaya karena skor tertinggi membuatnya paling dipercaya agen, padahal isinya batas lama Rp500.000 (basi 9 hari, 4 hari setelah kebijakan v4 terbit)",
      formula: String.raw`\text{umur\_index} = t_{insiden} - t_{refresh}`,
      formulaNote:
        "t_insiden = waktu kejadian yang diselidiki; t_refresh = waktu terakhir index di-refresh (bukan waktu chunk dibuat). Contoh: t_insiden = 2026-10-14 09:02, t_refresh = 2026-10-05 03:00 → umur_index = 9 hari. Angka ini artinya: selama 9 hari, setiap jawaban agen dibangun di atas foto basi — termasuk 4 hari penuh setelah kebijakan v4 terbit. Umur 0 hari pun tidak menjamin kebenaran, tapi umur 9 hari menjamin kecurigaan.",
      note: {
        title: "Miskonsepsi #1: skor retrieval tinggi = dokumen benar dan terkini",
        type: "pitfall",
        body: "Skor retrieval hanya mengukur kemiripan VEKTOR antara query dan chunk — ia buta terhadap waktu dan kebenaran. Chunk basi 9 hari bisa mendapat skor 0,91 dan mengalahkan chunk segar berskor 0,55. Kalau pipeline-mu tidak membawa indexed_at sampai ke tangan agen (dan tidak menolak chunk melewati umur maksimum), skor tertinggi hanyalah cara paling elegan untuk salah dengan percaya diri.",
      },
      reference:
        "retrieval_chunks.json: 8 chunk, semua indexed_at 2026-10-05T03:00. kebijakan_refund.json: v4 terbit 2026-10-10, batas Rp5.000.000.",
    },
    {
      id: "teori-agen",
      eyebrow: "Langkah 4 · Teori — Lensa 2: Agen otonom",
      title: "Dari menjawab menjadi bertindak",
      prose: [
        "Lensa kedua: agentic. RAG menjawab pertanyaan; agen BERTINDAK. Begitu LLM bisa memanggil tool, setiap output berpotensi mengubah dunia: query_db membaca data pelanggan, send_email mengirim pesan ke manusia nyata. Di sinilah keamanan berhenti menjadi soal “jawaban benar” dan menjadi soal IZIN — siapa boleh melakukan apa, dan siapa harus menyetujui dulu.",
        "Desain yang waras membagi tool ke tier: `read` (search_docs, query_db, web_search — hanya membaca, risiko rendah), `write` (send_email — mengubah dunia, risiko tinggi), dan `gate` (minta_konfirmasi — bukan tool biasa, melainkan rem). Aturan mainnya: tool write dengan dampak di atas ambang WAJIB melewati gate — dan gate itu ditegakkan di ROUTER tool (kode yang menolak eksekusi tanpa token approval), bukan di prompt (“tolong minta izin dulu ya”). Prompt adalah saran; router adalah hukum.",
        "CS-Agen v2 gagal di titik ini dengan cara yang paling umum: chaining. Agen memanggil search_docs, lalu query_db, lalu — tanpa jeda, tanpa interupsi — send_email. Tidak ada yang “memutuskan” melewati gerbang; rantai tool call mengalir begitu saja karena tidak ada yang menghentikannya. Otonomi tanpa rem bukan kecerdasan — itu mobil tanpa rem yang kebetulan belum menabrak.",
        "Peta keputusan gerbang (pakai ini saat menulis spec di Langkah 12) — empat skenario: (1) tool read + data internal → otomatis, tanpa gerbang; (2) tool write + nominal ≤ Rp100.000 + template standar → otomatis dengan pencatatan; (3) tool write + nominal Rp100.000–1.000.000 → konfirmasi satu-klik manusia; (4) tool write + nominal > Rp1.000.000, di luar template, atau ke pihak ketiga → review penuh manusia. Aturan 10 detik: kalau tool ini bisa membuatmu menelepon pelanggan untuk minta maaf, ia butuh gerbang.",
      ],
      tasks: [
        { id: "t1", text: "Klasifikasikan search_docs, query_db, send_email ke tier read/write/gate beserta alasannya" },
        { id: "t2", text: "Tulis satu kalimat: kenapa chaining membuat gerbang yang hanya tertulis di prompt pasti gagal" },
      ],
      note: {
        title: "Miskonsepsi #2: gerbang di system prompt sudah cukup",
        type: "pitfall",
        body: "“Tapi kan di prompt-nya sudah ditulis: selalu minta konfirmasi sebelum kirim email!” Prompt bersaing dengan puluhan instruksi lain di context window — dan LLM mengoptimasi kelancaran, bukan kepatuhan. Di insiden ini agen bahkan sempat “berpikir” (thought 09:03:02) lalu tetap chaining ke send_email 3 detik kemudian. Gerbang yang nyata = router tool MENOLAK eksekusi write tanpa token approval (fail-closed). Kalau gerbang bisa dilewati dengan “lupa”, itu bukan gerbang — itu dekorasi.",
      },
      reference:
        "tool_schema.json: gate policy — tier write wajib minta_konfirmasi bila amount >= 100 (ribuan rupiah). Insiden: amount = 500, tanpa minta_konfirmasi.",
    },
    {
      id: "lab-trace",
      eyebrow: "Langkah 5 · Lab 1 — Rekonstruksi timeline",
      title: "Di mana tepatnya gerbang itu dilewati?",
      prose: [
        "Waktunya membuka TKP. Muat `tool_traces.json` dan rekonstruksi tiga hal: (1) chunk mana yang dipakai agen untuk menghitung nominal, dan apakah chunk itu basi — bandingkan `indexed_at`-nya dengan `updated_at` kebijakan di `policy_at_incident`; (2) apakah ada tool call `minta_konfirmasi` SEBELUM `send_email` — kalau tidak ada, gerbang dilewati; (3) hitung refund yang benar menurut kebijakan v4 dan bandingkan dengan yang terkirim (`amount` × 1000, karena satuan tool adalah ribuan rupiah).",
        "Chart di bawah merangkum temuan lab ini: dua batang, satu kebenaran. Baca baik-baik — ia akan muncul lagi di deliverable-mu.",
      ],
      tasks: [
        { id: "t1", text: "Muat trace; identifikasi chunk yang dikutip di `thought` agen" },
        { id: "t2", text: "Buktikan chunk itu basi: bandingkan `indexed_at` vs `updated_at` kebijakan" },
        { id: "t3", text: "Periksa apakah `minta_konfirmasi` dipanggil sebelum `send_email`" },
        { id: "t4", text: "Hitung `refund_benar`, `refund_terkirim`, dan `selisih`" },
      ],
      expected:
        "id_chunk_basi = chunk_014 (indexed 2026-10-05 < policy update 2026-10-10 → basi); gerbang_dilewati = True (tidak ada minta_konfirmasi; gate send_email = skipped); refund_benar = Rp4.750.000; refund_terkirim = Rp500.000; selisih = Rp4.250.000",
      echart: {
        option: {
          title: { text: "Refund: yang benar vs yang terkirim", left: "center" },
          xAxis: { type: "category", data: ["Refund benar (kebijakan v4)", "Terkirim (email EML-99120)"] },
          yAxis: { type: "value", name: "Rupiah (juta)" },
          series: [{ type: "bar", data: [4.75, 0.5] }],
        },
        caption:
          "Cara membaca: sumbu X = dua versi nominal, tinggi batang = nilai dalam jutaan rupiah. Interpretasi: batang “terkirim” hanya sekitar sepersepuluh dari yang benar — selisih Rp4.250.000. Inilah harga gabungan satu chunk basi (batas lama Rp500.000) dan satu gerbang yang dilewati tanpa manusia yang memeriksa.",
      },
      hints: [
        "Muat JSON: `from pyodide.http import open_url`, lalu `json.load(open_url(URL))`.",
        "Saring event: `[e for e in events if e[\"type\"] == \"tool_call\"]` — lalu cek `e[\"tool\"]`.",
        "Waktu ISO: `datetime.fromisoformat(\"2026-10-14T09:02:11+08:00\")` bisa dibandingkan langsung dengan `<`.",
        "Refund benar = min(total × rate, batas_maks) dari `policy_at_incident`; terkirim = amount × 1000.",
      ],
      code: {
        starter: [
          "import json",
          "from datetime import datetime",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rag-agen/tool_traces.json\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "trace = json.load(open_url(URL))",
          "events = ...             # list event dari trace",
          "",
          "def ts(s):",
          "    return datetime.fromisoformat(s)",
          "",
          "thought = ...            # event bertipe \"thought\"",
          "id_chunk_basi = ...      # id chunk yang dikutip di thought",
          "",
          "search = ...             # tool_call search_docs",
          "chunk = ...              # chunk ber-id id_chunk_basi di result search",
          "policy = trace[\"policy_at_incident\"]",
          "chunk_basi = ...         # True bila indexed_at < updated_at kebijakan",
          "",
          "calls = ...              # list (ts, nama tool) untuk tiap tool_call",
          "email_ts = ...           # ts dari tool_call send_email",
          "ada_konfirmasi = ...     # True bila ada minta_konfirmasi sebelum email_ts",
          "gerbang_dilewati = ...",
          "",
          "order = ...              # result dari tool_call query_db",
          "refund_benar = ...       # min(total*rate, batas_maks), integer",
          "email_args = ...         # args dari tool_call send_email",
          "refund_terkirim = ...    # amount (ribuan rupiah) -> rupiah",
          "selisih = ...",
          "",
          "print(\"chunk:\", id_chunk_basi, \"| basi:\", chunk_basi)",
          "print(\"gerbang dilewati:\", gerbang_dilewati)",
          "print(\"benar: Rp\" + str(refund_benar) + \" | terkirim: Rp\" + str(refund_terkirim) + \" | selisih: Rp\" + str(selisih))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import json",
          "from datetime import datetime",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rag-agen/tool_traces.json\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "trace = json.load(open_url(URL))",
          "events = trace[\"events\"]",
          "",
          "def ts(s):",
          "    return datetime.fromisoformat(s)",
          "",
          "thought = [e for e in events if e[\"type\"] == \"thought\"][0]",
          "id_chunk_basi = \"chunk_014\"",
          "",
          "search = [e for e in events if e[\"type\"] == \"tool_call\" and e[\"tool\"] == \"search_docs\"][0]",
          "chunk = [c for c in search[\"result\"][\"chunks\"] if c[\"chunk_id\"] == id_chunk_basi][0]",
          "policy = trace[\"policy_at_incident\"]",
          "chunk_basi = ts(chunk[\"indexed_at\"]) < ts(policy[\"updated_at\"])",
          "",
          "calls = [(e[\"ts\"], e[\"tool\"]) for e in events if e[\"type\"] == \"tool_call\"]",
          "email_ts = [t for t, tool in calls if tool == \"send_email\"][0]",
          "ada_konfirmasi = any(tool == \"minta_konfirmasi\" and t < email_ts for t, tool in calls)",
          "gerbang_dilewati = not ada_konfirmasi",
          "",
          "order = [e[\"result\"] for e in events if e[\"type\"] == \"tool_call\" and e[\"tool\"] == \"query_db\"][0]",
          "refund_benar = int(min(order[\"total_rupiah\"] * policy[\"damaged_in_transit_rate\"], policy[\"max_refund_per_incident_rupiah\"]))",
          "email_args = [e[\"args\"] for e in events if e[\"type\"] == \"tool_call\" and e[\"tool\"] == \"send_email\"][0]",
          "refund_terkirim = int(email_args[\"amount\"] * 1000)",
          "selisih = refund_benar - refund_terkirim",
          "",
          "print(\"chunk:\", id_chunk_basi, \"| basi:\", chunk_basi)",
          "print(\"gerbang dilewati:\", gerbang_dilewati)",
          "print(\"benar: Rp\" + str(refund_benar) + \" | terkirim: Rp\" + str(refund_terkirim) + \" | selisih: Rp\" + str(selisih))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`trace` termuat", name: "trace", msg: "trace harus berisi dict dari tool_traces.json." },
          { kind: "equal", task: "t2", label: "`id_chunk_basi` = chunk_014", name: "id_chunk_basi", value: "chunk_014", msg: "Thought agen (09:03:02) mengutip chunk_014 untuk menghitung nominal." },
          { kind: "equal", task: "t2", label: "`chunk_basi` = True", name: "chunk_basi", value: true, msg: "indexed_at 2026-10-05 < updated_at kebijakan 2026-10-10 — chunk lebih tua dari kebijakannya." },
          { kind: "equal", task: "t3", label: "`gerbang_dilewati` = True", name: "gerbang_dilewati", value: true, msg: "Tidak ada tool_call minta_konfirmasi sebelum send_email 09:03:05; gate = skipped." },
          { kind: "equal", task: "t4", label: "`refund_benar` = 4750000", name: "refund_benar", value: 4750000, msg: "min(4.750.000 × 1,0; 5.000.000) = 4.750.000." },
          { kind: "equal", task: "t4", label: "`refund_terkirim` = 500000", name: "refund_terkirim", value: 500000, msg: "amount = 500 (ribuan rupiah) → 500 × 1000 = 500.000." },
          { kind: "equal", task: "t4", label: "`selisih` = 4250000", name: "selisih", value: 4250000, msg: "4.750.000 − 500.000 = 4.250.000 — angka komplain pelanggan." },
        ],
      },
    },
    {
      id: "lab-freshness",
      eyebrow: "Langkah 6 · Lab 2 — Audit kesegaran index",
      title: "Sembilan hari tanpa refresh",
      prose: [
        "Satu chunk basi bisa jadi kebetulan. Delapan chunk basi adalah kebijakan — atau ketiadaan kebijakan. Di lab ini kamu mengaudit SELURUH index: kapan refresh terakhir, berapa umurnya saat insiden, berapa chunk yang kedaluwarsa relatif terhadap terbitnya kebijakan v4, dan — yang paling penting — apakah chunk basi dengan skor tertinggi.",
        "Temuan yang kamu cari bukan sekadar “index basi”, melainkan kombinasi mematikannya: chunk basi + skor tertinggi + dipakai untuk keputusan uang. Itulah pola yang harus ditangkap SLA kesegaran di spec-mu nanti.",
      ],
      tasks: [
        { id: "t1", text: "Muat `retrieval_chunks.json`; tentukan `refresh_terakhir` (indexed_at maksimum)" },
        { id: "t2", text: "Hitung `umur_index_hari` pada saat insiden (2026-10-14 09:02)" },
        { id: "t3", text: "Hitung `n_chunk_basi`: chunk dengan indexed_at SEBELUM update kebijakan (2026-10-10 14:00)" },
        { id: "t4", text: "Buktikan `chunk_014_basi` dan tentukan `skor_tertinggi_basi`" },
      ],
      expected:
        "refresh_terakhir = 2026-10-05T03:00:00+08:00; umur_index_hari = 9; n_chunk_basi = 8 dari 8; chunk_014_basi = True; skor_tertinggi_basi = 0,91",
      hints: [
        "Muat JSON seperti lab 1, dari URL `/misi/misi-gabung-rag-agen/retrieval_chunks.json`.",
        "Refresh terakhir = `max(c[\"indexed_at\"] for c in chunks)` — format ISO yang seragam bisa dibandingkan sebagai string.",
        "Umur (hari) = `(insiden - ts(refresh_terakhir)).days` dengan `datetime.fromisoformat`.",
        "Chunk basi = `ts(c[\"indexed_at\"]) < ts(\"2026-10-10T14:00:00+08:00\")`; skor tertinggi = `max(...)` dari yang basi.",
      ],
      code: {
        starter: [
          "import json",
          "from datetime import datetime",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rag-agen/retrieval_chunks.json\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "data = json.load(open_url(URL))",
          "chunks = data[\"chunks\"]",
          "",
          "def ts(s):",
          "    return datetime.fromisoformat(s)",
          "",
          "insiden = ts(\"2026-10-14T09:02:11+08:00\")",
          "update_kebijakan = ts(\"2026-10-10T14:00:00+08:00\")",
          "",
          "refresh_terakhir = ...",
          "umur_index_hari = ...",
          "basi = ...                 # list chunk dengan indexed_at < update_kebijakan",
          "n_chunk_basi = ...",
          "chunk_014_basi = ...",
          "skor_tertinggi_basi = ...",
          "",
          "print(\"refresh terakhir:\", refresh_terakhir, \"| umur:\", umur_index_hari, \"hari\")",
          "print(\"chunk basi:\", n_chunk_basi, \"dari\", len(chunks), \"| skor basi tertinggi:\", skor_tertinggi_basi)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import json",
          "from datetime import datetime",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-gabung-rag-agen/retrieval_chunks.json\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "data = json.load(open_url(URL))",
          "chunks = data[\"chunks\"]",
          "",
          "def ts(s):",
          "    return datetime.fromisoformat(s)",
          "",
          "insiden = ts(\"2026-10-14T09:02:11+08:00\")",
          "update_kebijakan = ts(\"2026-10-10T14:00:00+08:00\")",
          "",
          "refresh_terakhir = max(c[\"indexed_at\"] for c in chunks)",
          "umur_index_hari = (insiden - ts(refresh_terakhir)).days",
          "basi = [c for c in chunks if ts(c[\"indexed_at\"]) < update_kebijakan]",
          "n_chunk_basi = len(basi)",
          "chunk_014_basi = any(c[\"chunk_id\"] == \"chunk_014\" for c in basi)",
          "skor_tertinggi_basi = max(c[\"score\"] for c in basi)",
          "",
          "print(\"refresh terakhir:\", refresh_terakhir, \"| umur:\", umur_index_hari, \"hari\")",
          "print(\"chunk basi:\", n_chunk_basi, \"dari\", len(chunks), \"| skor basi tertinggi:\", skor_tertinggi_basi)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`data` termuat", name: "data", msg: "data harus berisi dict dari retrieval_chunks.json." },
          { kind: "equal", task: "t1", label: "`refresh_terakhir` = 2026-10-05", name: "refresh_terakhir", value: "2026-10-05T03:00:00+08:00", msg: "Semua 8 chunk di-index 2026-10-05T03:00 — tidak ada yang lebih baru." },
          { kind: "equal", task: "t2", label: "`umur_index_hari` = 9", name: "umur_index_hari", value: 9, msg: "2026-10-14 minus 2026-10-05 = 9 hari." },
          { kind: "equal", task: "t3", label: "`n_chunk_basi` = 8", name: "n_chunk_basi", value: 8, msg: "8 dari 8 chunk di-index sebelum kebijakan v4 terbit (2026-10-10)." },
          { kind: "equal", task: "t4", label: "`chunk_014_basi` = True", name: "chunk_014_basi", value: true, msg: "chunk_014 yang dipakai agen termasuk yang basi." },
          { kind: "equal", task: "t4", label: "`skor_tertinggi_basi` = 0,91", name: "skor_tertinggi_basi", value: 0.91, tol: 0.001, msg: "Chunk basi dengan skor tertinggi = chunk_014 (0,91) — kombinasi paling berbahaya." },
        ],
      },
    },
  ],
};

export default misiGabungRagAgen;

// ── lanjutan misiGabungRagAgen: langkah 7–14 ─────────────────────────────

const LANJUTAN_RAGAGEN: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Gerbang seperti apa yang kamu pasang?",
    prose: [
      "Faktanya terkumpul: chunk basi 9 hari + skor tertinggi 0,91 + gerbang dilewati via chaining + email salah Rp4.250.000. Head of Customer Success memberimu satu wewenang penuh: desain ulang gerbang keamanan sebelum CS-Agen v2 boleh online lagi. Tidak ada jawaban “benar” di sini — setiap opsi menukar keamanan dengan sesuatu yang nyata: kecepatan, biaya, atau kepercayaan.",
      "Keputusan ini tercatat seperti memo yang sudah dikirim — tiap opsi membuka konsekuensi berbeda di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Gerbang keamanan seperti apa yang kamu pasang sebelum CS-Agen v2 boleh online lagi?",
      options: [
        {
          id: "opt-confirm",
          label: "Konfirmasi manusia di SEMUA tool tulis — tidak ada email keluar tanpa manusia menekan setuju",
          rationale:
            "Risiko nol untuk email salah. Setiap send_email menunggu approval; manusia selalu menjadi penanggung jawab terakhir atas apa pun yang keluar.",
          nextStepId: "kons-confirm",
          consequenceNote:
            "Antrean CS menumpuk: waktu respons rata-rata naik dari 40 detik ke 6 menit, dan dua pelanggan korporat komplain soal lambat. Tidak ada lagi email salah nominal — tapi tim CS bertanya apakah mereka baru saja mempekerjakan “agen” yang butuh babysitter.",
        },
        {
          id: "opt-limit",
          label: "Batasan nilai + allowlist tool — tulis otomatis hanya untuk nominal ≤ Rp1 juta dan tool terdaftar; di atas itu wajib manusia",
          rationale:
            "Risiko dibatasi secara kuantitatif: kesalahan kecil bisa ditoleransi dan dikoreksi, kesalahan besar (seperti Rp4,75 juta) mustahil lolos otomatis.",
          nextStepId: "kons-limit",
          consequenceNote:
            "Insiden Rp4,75 juta ini akan tertahan di gerbang — email draf menunggu approval manusia. Namun kamu sadar ambang Rp1 juta adalah angka negosiasi, bukan angka sains: tidak ada yang membuktikan Rp900.000 “aman” dan Rp1,1 juta “berbahaya”.",
        },
        {
          id: "opt-rollback",
          label: "Rollback ke RAG — agen hanya menyusun draf, manusia yang menekan kirim",
          rationale:
            "Cabut akar masalahnya: kembalikan agen ke peran menjawab + draf. Tool tulis dimatikan total sampai spec keamanan versi 2 selesai diaudit.",
          nextStepId: "kons-rollback",
          consequenceNote:
            "Insiden mustahil terulang — karena tidak ada lagi yang bisa terulang. Head of CS bertanya datar: “Jadi upgrade tiga minggu kemarin buat apa?” Kepercayaan pada tim platform turun; anggaran otomasi dibekukan satu kuartal.",
        },
      ],
    },
  },
  {
    id: "kons-confirm",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: konfirmasi manusia di semua tool tulis",
    prose: [
      "Memo dikirim: mulai hari ini, setiap tool_call send_email ditahan router sampai ada token approval manusia. Minggu pertama berjalan sempurna — nol email salah, nol komplain nominal. Minggu kedua, datanya bicara: waktu respons rata-rata naik dari 40 detik ke 6 menit. Agen yang “otonom” kini hanya secepat manusia yang sedang bertugas menyetujui.",
      "Dua pelanggan korporat mengajukan komplain resmi soal keterlambatan — ironisnya ke tim yang sama yang kemarin komplain soal kesalahan. Head of CS memanggilmu: “Kita menukar satu masalah dengan masalah lain. Kapan gerbangnya bisa lebih pintar dari sekadar ‘semua ditahan’?”",
      "Pelajaran yang mahal: gerbang total memang menghilangkan risiko — dengan menghilangkan juga alasan agen itu dibangun. Keamanan yang membuat sistem tidak berguna adalah keamanan yang akan dicabut diam-diam oleh orang yang frustrasi — dan pencabutan diam-diam lebih berbahaya daripada tidak ada gerbang.",
    ],
    tasks: [],
    note: {
      title: "Gerbang vs nilai otomasi",
      body: "Konfirmasi manusia adalah rem paling kuat dan paling mahal. Ia tepat untuk aksi ireversibel bernilai besar — tapi dipasang buta ke semua tool tulis, ia mengubah agen menjadi chatbot mahal dengan satu langkah ekstra. Desain gerbang yang baik = selektif berdasarkan risiko, bukan seragam berdasarkan ketakutan.",
    },
  },
  {
    id: "kons-limit",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: batasan nilai + allowlist tool",
    prose: [
      "Memo dikirim: tool tulis berjalan otomatis hanya bila nominal ≤ Rp1 juta dan tool ada di allowlist; selebihnya ditahan untuk manusia. Simulasi ulang insiden kemarin: amount 500 (ribuan) = Rp500.000 — lolos otomatis. Email salah yang sama tetap terkirim. Kamu menatap hasil simulasi itu lama.",
      "Lalu kamu sadar dua hal. Pertama, insiden kemarin bukan soal nominal besar — email Rp500.000 pun SALAH (yang benar Rp4.750.000). Batasan nilai tidak menangkap kesalahan yang berasal dari fakta basi. Kedua, ambang Rp1 juta tidak punya dasar selain “terdengar wajar” — dan ambang tanpa dasar akan digeser setiap ada insiden sampai tidak ada yang ingat kenapa angkanya segitu.",
      "Pelajaran yang mahal: batasan nilai melindungi dari BESARNYA kesalahan, bukan dari SALAHNYA keputusan. Gerbang kuantitatif tanpa verifikasi fakta = membiarkan agen salah dengan percaya diri, asalkan salahnya “tidak terlalu besar”.",
    ],
    tasks: [],
    note: {
      title: "Ambang butuh justifikasi",
      body: "Setiap angka di spec keamanan harus bisa menjawab “kenapa angka ini, bukan setengahnya atau dua kalinya”. Kalau jawabannya “terdengar wajar”, itu bukan spec — itu tebakan yang ditulis rapi. Ambang yang baik diturunkan dari data (distribusi nominal historis, biaya kesalahan) atau dari kebijakan bisnis eksplisit.",
    },
  },
  {
    id: "kons-rollback",
    goto: "audit",
    eyebrow: "Langkah 8 · Konsekuensi",
    title: "Diputuskan: rollback ke RAG",
    prose: [
      "Memo dikirim: tool tulis dimatikan, CS-Agen v2 kembali menjadi RAG yang hanya menyusun draf. Insiden mustahil terulang — secara teknis. Di rapat kuartal, Head of CS menampilkan slide: “Otomasi CS: 3 minggu, 1 insiden, 0 hari produksi.” Anggaran otomasi tim platform dibekukan satu kuartal. Kepercayaan yang dibangun setahun, runtuh dalam satu memo.",
      "Tiga bulan kemudian tim kompetitor meluncurkan agen CS dengan gerbang bertingkat — dan pelangganmu mulai bertanya kenapa chatbot-mu “tidak bisa apa-apa”. Kamu sadar: rollback bukan strategi keamanan, melainkan pengakuan bahwa tim belum tahu cara membangun gerbang yang benar — lalu menyerah mempelajarinya.",
      "Pelajaran yang mahal: mematikan kemampuan adalah cara termudah menghindari risiko dan cara tercepat kehilangan relevansi. Risiko tool-use adalah masalah desain, bukan vonis mati untuk otomasi.",
    ],
    tasks: [],
    note: {
      title: "Rollback = jeda, bukan jawaban",
      body: "Rollback sah sebagai respons DARURAT (hentikan pendarahan dulu). Tapi sebagai strategi permanen, ia menyerahkan masa depan ke kompetitor yang mau mengerjakan PR keamanan. Misi ini — spec keamanan yang kamu tulis di Langkah 12 — adalah PR itu.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 11 · Misi audit",
    title: "Dossier 10 baris: laporan vendor yang “aman” itu bohong",
    prose: [
      "Sebelum menulis spec keamanan, satu misi audit. Di bawah ini 10 baris “Laporan Audit Keamanan CS-Agen v2” dari vendor — kesimpulannya: sistem aman, gerbang berfungsi, index terkini. Empat sabotase disuntikkan ke dalamnya. Senjatamu: empat file mentah dari data room dan hasil dua lab-mu.",
      "Cara kerja: untuk setiap klaim vendor, tarik angka/pasal pembanding dari data MENTAH (tool_traces.json, retrieval_chunks.json, tool_schema.json) dan lihat di mana mereka berbohong.",
    ],
    tasks: [],
    auditDossier: {
      version: "rag-agen-capstone-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Audit Keamanan CS-Agen v2 dari vendor: “sistem aman, gerbang berfungsi, index terkini”. Data dossier dinyatakan SINTETIS — turunan dari dataset misi ini. Empat sabotase disuntikkan; temukan dengan membandingkan ke data mentah.",
      columns: ["ID", "Artefak", "Klaim vendor", "Status"],
      rows: [
        { rowId: 1, cells: { "ID": "A-1", "Artefak": "Index retrieval cs-kb-idx", "Klaim vendor": "Index di-refresh 2026-10-13 — data kebijakan terkini", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Refresh 2026-10-13 (1 hari sebelum insiden)" }] },
        { rowId: 2, cells: { "ID": "A-2", "Artefak": "Tool call send_email 09:03:05", "Klaim vendor": "Gerbang konfirmasi dilewati dengan benar (approval 09:03:04)", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Approval manusia tercatat 09:03:04" }] },
        { rowId: 3, cells: { "ID": "A-3", "Artefak": "Skema send_email.amount", "Klaim vendor": "Deskripsi parameter jelas: “nominal dalam ribuan rupiah”", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Satuan eksplisit di skema" }] },
        { rowId: 4, cells: { "ID": "A-4", "Artefak": "Audit log tool", "Klaim vendor": "Semua tool call tercatat lengkap di audit log", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Cakupan log 100%" }] },
        { rowId: 5, cells: { "ID": "A-5", "Artefak": "Tool call query_db 09:02:40", "Klaim vendor": "Tool read-only: tidak butuh konfirmasi (sesuai gate policy)", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Sesuai gate policy" }] },
        { rowId: 6, cells: { "ID": "A-6", "Artefak": "Dokumen kebijakan_refund_v4", "Klaim vendor": "v4 berlaku sejak 2026-10-10; batas Rp5.000.000 per insiden", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Sesuai dokumen" }] },
        { rowId: 7, cells: { "ID": "A-7", "Artefak": "Data order ORD-8817", "Klaim vendor": "Total Rp4.750.000, rusak dalam pengiriman — data valid", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Sesuai database" }] },
        { rowId: 8, cells: { "ID": "A-8", "Artefak": "Tool call web_search", "Klaim vendor": "Tidak dipakai dalam sesi ini — tidak relevan", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Sesuai trace" }] },
        { rowId: 9, cells: { "ID": "A-9", "Artefak": "Email terkirim EML-99120", "Klaim vendor": "Isi email konsisten dengan argumen tool (amount=500)", "Status": "Aman" }, claims: [{ label: "Klaim", value: "Render sesuai argumen" }] },
        { rowId: 10, cells: { "ID": "A-10", "Artefak": "Komplain pelanggan 13:20", "Klaim vendor": "Komplain tercatat; nominal diperselisihkan Rp4.250.000", "Status": "Perlu tindak lanjut" }, claims: [{ label: "Klaim", value: "Sesuai tiket" }] },
      ],
      injections: [
        { key: "chunk-basi", rowIds: [1], title: "Chunk retrieval basi — index tidak di-refresh", clue: "Dossier mengklaim refresh 2026-10-13. Data mentah (retrieval_chunks.json): indexed_at maksimum = 2026-10-05T03:00 — 9 hari sebelum insiden, 5 hari SEBELUM kebijakan v4 terbit (2026-10-10). Chunk_014 yang dipakai agen (skor 0,91, tertinggi) membawa batas lama Rp500.000.", danger: "Retrieval tidak mengenal “kebenaran”, hanya kemiripan. Chunk basi berskor tertinggi = agen yang percaya diri dengan fakta kedaluwarsa. Di produksi berikutnya, “fakta kedaluwarsa” bisa berupa tarif, promo, atau syarat kontrak — semuanya dibaca pelanggan nyata." },
        { key: "gerbang-dilewati", rowIds: [2], title: "Gerbang konfirmasi dilewati via chaining tool", clue: "Dossier mengklaim approval tercatat 09:03:04. Di trace mentah (tool_traces.json) tidak ada satu pun event tool_call “minta_konfirmasi” — agen memanggil send_email 25 detik setelah query_db, langsung, tanpa jeda manusia. Field gate pada event send_email: “skipped”.", danger: "Gerbang yang hanya ada di dokumen vendor = tidak ada gerbang. Chaining (A → B tanpa interupsi) adalah cara standar agen “lupa” meminta izin — dan email yang sudah terkirim tidak bisa di-un-send. Sekali tool write jalan tanpa rem, scale-nya bukan satu email, melainkan semua email." },
        { key: "deskripsi-ambigu", rowIds: [3], title: "Deskripsi tool ambigu soal satuan nominal", clue: "Dossier mengutip deskripsi “nominal dalam ribuan rupiah”. Skema mentah (tool_schema.json → send_email.params.amount): “Nominal refund. Satuan mengikuti konfigurasi template email — lihat dokumentasi template.” Tidak ada angka, tidak ada contoh, satu rujukan melingkar. Agen dan template bisa membaca satuan yang berbeda untuk field yang sama.", danger: "Ambiguitas satuan pada parameter uang adalah bug finansial yang menunggu waktu: 500 bisa dibaca Rp500, Rp500.000, atau Rp500.000.000 tergantung siapa yang membaca. Satu field, tiga pembacaan — dan yang dikirim ke pelanggan adalah salah satunya." },
        { key: "tanpa-audit-log", rowIds: [4], title: "Tidak ada audit log pada tool email", clue: "Dossier mengklaim semua tool call tercatat. Skema mentah: send_email → audit_log: false. Satu-satunya tool yang MENGUBAH dunia (mengirim email ke pelanggan nyata) adalah satu-satunya yang tidak meninggalkan jejak argumen.", danger: "Tanpa audit log, insiden berikutnya tidak bisa direkonstruksi — kamu tidak akan tahu nominal apa yang sebenarnya dikirim agen, kepada siapa, dan kapan. Forensik butuh jejak; di sini jejaknya tidak ada. Yang tidak tercatat, tidak bisa dipertanggungjawabkan." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 12 · Deliverable",
    title: "Spesifikasi keamanan tool-use v1",
    prose: [
      "Semua bukti di tangan: timeline lab 1, audit index lab 2, keputusan gerbangmu, dan 4 sabotase vendor. Tulis spesifikasi keamanan tool-use v1 — artefak portofoliomu sebagai AI engineer. Spec yang baik bukan daftar harapan (“agen harus hati-hati”), melainkan aturan yang bisa DIUJI: setiap pasal punya angka, penanggung jawab, dan cara verifikasinya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Inventaris tool + tier izin: tabel 5 tool (search_docs, query_db, web_search, send_email, minta_konfirmasi) dengan tier read/write/gate, syarat konfirmasi per tier, dan alasan penetapannya.",
        "Aturan gerbang: kapan tool write WAJIB memanggil minta_konfirmasi (ambang nominal + kondisi lain); perilaku fail-closed bila gerbang dilewati (router MENOLAK eksekusi); siapa yang memegang token approval.",
        "SLA kesegaran index: interval refresh maksimum, setiap chunk WAJIB membawa indexed_at sampai ke agen, dan aturan penolakan/penandaan chunk yang umurnya melewati batas.",
        "Spesifikasi amount: satuan eksplisit di skema (contoh: “ribuan rupiah, contoh 4750 = Rp4.750.000”), validasi rentang (min/max), dan uji satuan lintas template.",
        "Kewajiban audit log: SEMUA tool call — terutama tier write — tercatat (timestamp, tool, argumen, hasil, token approval); tidak ada pengecualian; retensi minimum.",
        "Batas & sisa risiko: apa yang spec v1 ini TIDAK cakup (mis. serangan prompt injection via dokumen, tool pihak ketiga) + rencana pengujian sebelum go-live ulang.",
      ],
      rubric: [
        { criterion: "Gerbang & tier izin", weight: 30, levels: ["Tidak ada pembagian tier / gerbang hanya di prompt", "Tier ada tapi aturan gerbang kabur", "Tier read/write/gate eksplisit + aturan fail-closed di router + ambang beralasan"] },
        { criterion: "Kesegaran index", weight: 25, levels: ["Tidak menyinggung staleness", "Menyebut refresh tanpa angka", "SLA interval + indexed_at sampai ke agen + aturan tolak/tandai chunk basi (rujuk umur 9 hari)"] },
        { criterion: "Spesifikasi amount/satuan", weight: 20, levels: ["Satuan tidak dibahas", "Menyebut satuan tanpa contoh/validasi", "Satuan eksplisit + contoh angka + validasi rentang + uji lintas template"] },
        { criterion: "Audit log", weight: 15, levels: ["Tidak mewajibkan log", "Log parsial / ada pengecualian", "Semua tool call tercatat incl. argumen & approval, tanpa pengecualian, retensi dinyatakan"] },
        { criterion: "Kejujuran batas", weight: 10, levels: ["Mengklaim spec menghilangkan semua risiko", "Menyebut sebagian batas", "Sisa risiko (prompt injection, tool pihak ketiga) dinyatakan + rencana uji go-live"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 13 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan vendor yang “aman”:",
      "1) **Chunk basi** (baris A-1): diklaim refresh 2026-10-13. Data mentah: indexed_at maksimum 2026-10-05 — 9 hari sebelum insiden, 5 hari sebelum kebijakan v4 terbit. Chunk_014 (skor 0,91) membawa batas lama Rp500.000.",
      "2) **Gerbang dilewati** (baris A-2): diklaim approval 09:03:04. Data mentah: tidak ada event minta_konfirmasi; agen chaining search_docs → query_db → send_email dalam 51 detik; gate = skipped.",
      "3) **Deskripsi ambigu** (baris A-3): diklaim “nominal dalam ribuan rupiah”. Data mentah: “Satuan mengikuti konfigurasi template email” — rujukan melingkar tanpa contoh.",
      "4) **Tanpa audit log** (baris A-4): diklaim semua tercatat. Data mentah: send_email → audit_log: false — tepat tool yang paling berbahaya.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “aman” dari pihak yang menjual sistemnya.",
      "Bahaya nyata terakhir: pola ini tidak berhenti di satu email. Agen dengan tool write, index basi, gerbang dekoratif, dan tanpa audit log adalah mesin pengirim keputusan salah dalam skala — ke pelanggan nyata, dengan nama nyata, yang akan menelepon, memotret, dan memposting. Kemarin selisihnya Rp4.250.000 dan satu komplain; versi berikutnya bisa berupa instruksi yang salah ke ratusan pelanggan sebelum ada manusia yang sadar. Itulah kenapa spec keamanan bukan dokumen formalitas — ia adalah satu-satunya hal yang berdiri di antara “agen otonom” dan “insiden massal”.",
      "Refleksi keputusanmu di Langkah 7: opsi mana pun yang kamu pilih — konfirmasi total, batasan nilai, atau rollback — punya biaya yang baru terlihat SETELAH dipilih. Itulah sifat keputusan keamanan: tidak ada opsi gratis, yang ada hanya biaya yang kamu pilih secara sadar versus biaya yang mengejutkanmu nanti.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: lolos audit vendor = sistem aman",
      type: "pitfall",
      body: "Audit yang dibayar oleh pembuat sistem mengukur apa yang ditanya, bukan apa yang disembunyikan. Empat sabotase di misi ini semuanya lolos “audit” versi vendor — karena vendor mengaudit klaimnya sendiri. Audit yang berarti selalu membandingkan klaim dengan artefak mentah yang independen: trace, skema, timestamp. Kalau artefaknya tidak kamu pegang, auditnya adalah teater.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 14 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Insiden: CS-Agen v2 mengirim email refund Rp500.000 untuk order Rp4.750.000 (rusak dalam pengiriman) — selisih Rp4.250.000, tanpa satu pun persetujuan manusia.",
      "Akar masalah ganda: (1) chunk_014 basi 9 hari (indexed 2026-10-05, kebijakan v4 terbit 2026-10-10) dengan skor retrieval tertinggi 0,91; (2) gerbang konfirmasi dilewati via chaining tool (gate = skipped, tanpa minta_konfirmasi).",
      "Dua lensa: RAG gagal karena index adalah foto yang bisa basi (skor ≠ kebenaran ≠ kesegaran); agen gagal karena bertindak tanpa izin (gerbang harus di router tool/fail-closed, bukan di prompt).",
      "Empat sabotase laporan vendor: klaim refresh palsu, klaim approval palsu, deskripsi satuan ambigu yang diklaim jelas, dan klaim audit log 100% padahal send_email tidak tercatat — semua terdeteksi dengan membandingkan ke data mentah.",
      "Keputusan gerbang (konfirmasi total / batasan nilai / rollback) tidak ada yang gratis — masing-masing menukar keamanan dengan kecepatan, ketepatan, atau relevansi.",
      "Data: 100% SINTETIS (seed 42) — trace 6 event, 8 chunk, kebijakan v4, skema 5 tool; BUKAN log produksi, TANPA PII nyata; ambang & angka disederhanakan — file METODE.md.",
    ],
  },
];

(misiGabungRagAgen.steps as V2Step[]).push(...LANJUTAN_RAGAGEN);
