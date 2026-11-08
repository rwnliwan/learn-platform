import type { V2Lesson } from "../lib/types";

// Graph: nodes riset->analisis->tulis dengan checkpoint; bandingkan chain linear.
const GRAPH_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Graf agen: riset bercabang ke analisis dan verifikasi, bergabung di tulis, dengan checkpoint tiap node.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<circle cx="90" cy="125" r="34" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="1.8"/>
<text x="90" y="121" fill="var(--text)" font-weight="600">riset</text><text x="90" y="137" fill="var(--chart-text)" font-size="10">state v1</text>
<circle cx="240" cy="60" r="34" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="1.8"/>
<text x="240" y="56" fill="var(--text)" font-weight="600">analisis</text><text x="240" y="72" fill="var(--chart-text)" font-size="10">state v2a</text>
<circle cx="240" cy="190" r="34" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="1.8"/>
<text x="240" y="186" fill="var(--text)" font-weight="600">verifikasi</text><text x="240" y="202" fill="var(--chart-text)" font-size="10">state v2b</text>
<circle cx="390" cy="125" r="34" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="1.8"/>
<text x="390" y="121" fill="var(--text)" font-weight="600">tulis</text><text x="390" y="137" fill="var(--chart-text)" font-size="10">state v3</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.8" fill="none" marker-end="url(#ah10)">
<defs><marker id="ah10" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<path d="M122 108 C 160 90, 190 75, 210 68"/>
<path d="M122 142 C 160 160, 190 175, 210 182"/>
<path d="M272 68 C 310 80, 340 100, 360 112"/>
<path d="M272 182 C 310 170, 340 150, 360 138"/>
<path d="M240 96 C 240 120, 240 140, 240 154" stroke-dasharray="5,4"/>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)" text-anchor="middle">
<text x="165" y="80">cabang paralel</text>
<text x="330" y="80">gabung (join)</text>
<text x="258" y="128">cek silang</text>
<text x="240" y="232">checkpoint: tiap node simpan state → bisa resume dari mana saja</text>
</g>
</svg>`;

export const aai10: V2Lesson = {
  slug: "aai10-framework",
  track: "Agentic AI Engineer",
  module: "Operasi & Evaluasi",
  title: "AAI10 — Framework: LangChain/LangGraph & Alternatif",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Perang framework yang salah alamat",
      prose: [
        "Tim Dina terbelah dua. Kubu A: \u201Cpakai LangChain, semua orang pakai itu.\u201D Kubu B: \u201CLangGraph lebih modern, state-nya eksplisit.\u201D Kubu C (satu orang): \u201Ckenapa tidak requests + while loop saja?\u201D Rapat 3 jam, nol keputusan.",
        "Dina menghentikan debat dengan pertanyaan: \u201CApa yang sebenarnya kita butuhkan? Loop, state yang bisa di-resume, dan observability.\u201D Tiba-tiba framework bukan soal merek — soal KONSEP. LangChain = rantai langkah + abstraksi tools. LangGraph = graf state eksplisit + checkpoint. Raw API = kontrol penuh, bangun sendiri.",
        "Twist-nya: setahun kemudian LangChain merilis ulang API-nya (breaking changes), tim kubu A refactor 2 pekan. Tim yang paham KONSEP (state, checkpoint, node) pindah framework dalam sehari — karena yang mereka pindahkan adalah desain, bukan hafalan API. Framework mati; konsep abadi.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan perbedaan chain vs graph vs raw; (2) merancang state + checkpoint untuk resume; (3) memutuskan build-vs-buy framework; (4) mengimplementasikan orkestrator graf mini dengan checkpoint.",
        "Perbandingan framework agen (LangChain/LangGraph) diajarkan sebagai modul bersama di AIE20 — LangChain & LangGraph (track AI Engineering); lesson ini fokus pada pemilihan framework untuk agen yang kamu bangun.",
        "Daftar isi: 1) Cerita perang framework · 2) Konsep abadi: state, graf, checkpoint · 3) Lab: graf mini + resume · 4) Peta keputusan build-vs-buy · 5) Mini-case: harga resume · 6) Checkpoint.",
        "Resolusi debat 10 menit setelah pertanyaan Dina: tim memilih LangGraph untuk laporan mingguan (butuh cabang + resume), requests + while loop untuk skrip sekali jalan (linear, sekali pakai). Kubu A dan B sama-sama “menang” — untuk masalah yang berbeda. Yang kalah: debat kusir 3 pekan sebelumnya. Pelajaran: perdebatan framework tanpa KRITERIA = adu merek; dengan kriteria (loop? state? resume? observability?) = keputusan 10 menit. Tulis kriteriamu SEBELUM membuka tab dokumentasi.",
        "Biaya salah pilih — cerita dari tim tetangga. Mereka memilih framework “yang hype” untuk pipeline linear sederhana (ambil → olah → simpan). Tiga pekan kemudian: berjuang melawan konsep graf untuk alur yang tidak punya cabang, debugging state yang tidak dibutuhkan, dan tagihan pelatihan 2 hari. Total: 3 pekan × 2 insinyur × Rp1,5 juta = Rp9 juta untuk kompleksitas yang tidak dipakai. Lalu mereka menulis ulang dengan 60 baris requests + while — selesai 2 hari. Framework yang salah = pajak yang dibayar tiap hari selama sistem hidup.",
        "Framework hopping — penyakit yang lebih mahal. Tim yang ganti framework 3× setahun (LangChain → CrewAI → LangGraph): setiap migrasi = 2–4 pekan + bug baru + pengetahuan lama hangus. Biaya: 3 × 3 pekan × Rp1,5 juta × 2 orang = Rp27 juta/tahun — untuk kemampuan yang SAMA. Akarnya: memilih berdasarkan merek, bukan konsep. Tim yang paham konsep (loop, state, checkpoint) pindah framework dalam SEHARI saat benar-benar perlu — karena yang dipindahkan adalah pemahaman, bukan hafalan API.",
      ],
      note: {
        title: "💡 Intuisi: pilih konsep, bukan merek",
        body: "LangChain vs LangGraph vs CrewAI = perdebatan 2024–2026; loop/state/checkpoint = konsep 2004–sekarang. Insinyur yang paham konsep pindah framework dalam SEHARI (jarak konsep = nol); yang hafal API terkunci pada satu merek dan membayar tiap migrasi dengan berminggu-minggu. Alokasikan 80% waktu belajar ke konsep, 20% ke API — rasio yang membayar selama karier.",
      },
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga pendekatan, satu konsep abadi",
      prose: [
        "CHAIN (LangChain klasik): langkah berurutan A → B → C. Sederhana, mudah dipahami. Kelemahan: cabang (if/else) dan loop canggung — dunia agen penuh cabang.",
        "GRAPH (LangGraph): alur sebagai GRAF — node = langkah, edge = transisi (bisa bersyarat), STATE = dict bersama yang dibawa antar node. Mendukung cabang, paralel, loop, dan — kuncinya — CHECKPOINT: tiap node menyimpan state, sehingga eksekusi bisa di-pause dan di-resume dari titik mana pun.",
        "RAW API (requests + loop sendiri): kontrol penuh, nol dependensi, tidak ada breaking change dari vendor. Harga: kamu membangun ulang roda — retry, state, observability — dan bug-nya milikmu sendiri.",
        "Konsep abadinya ada tiga. STATE EKSPLISIT: satu dict yang jadi \u201Csingle source of truth\u201D antar langkah (bukan variabel tercecer). CHECKPOINT/RESUME: simpan state tiap node; kegagalan = lanjutkan dari checkpoint, bukan dari nol. OBSERVABILITY HOOKS: tiap transisi node memancarkan event untuk tracing (materi AAI11).",
        "Pertumbuhan state antar langkah mengikuti pola sederhana — dan inilah yang membuat checkpoint mahal jika state membengkak.",
        "Chain vs graph — worked decision. Tugas: kumpulkan 5 dokumen → ekstrak → tulis. CHAIN: 7 langkah linear, 0 cabang. Biaya implementasi: 2 jam. GRAPH: sama, tetapi overhead definisi node/edge/state: 6 jam. Pemenang: CHAIN (3× lebih cepat dibangun, lebih mudah dibaca). Sekarang tugas berubah: “jika dokumen tidak ditemukan, cari alternatif; jika 3× gagal, eskalasi”. Chain: cabang = if/else bersarang = spaghetti dalam 2 pekan. Graph: edge bersyarat = 1 baris. Pemenang: GRAPH. Keputusan = fungsi dari KOMPLEKSITAS ALUR, bukan dari gengsi. Alur linear + framework graf = memakai tank untuk belanja ke warung.",
        "State design — worked |S_t|. |S_0| = 5KB (konfigurasi + tujuan). Δ = 2KB/langkah JIKA menyimpan ringkasan observasi; Δ = 50KB/langkah JIKA menyimpan observasi mentah. t = 40 langkah. Desain hemat: 5 + 40×2 = 85KB — checkpoint sepele. Desain boros: 5 + 40×50 = 2.005KB ≈ 2MB — checkpoint 2MB × 1.000 run/hari = 2GB/hari storage + latency tulis. Prinsip: state = RINGKASAN, bukan arsip. Yang butuh detail = baca ulang dari sumber (atau simpan referensi/pointer, bukan konten). Δ kecil = sistem yang scalable; Δ besar = bom waktu storage.",
        "Matematika checkpoint — lengkap dari minicase. 4 node (3+5+4+2 = 14 menit), crash 10% per node. Tanpa checkpoint: P(sukses) = 0,9⁴ = 0,656; expected run = 1/0,656 = 1,52; expected waktu = 21,3 menit. Dengan checkpoint: tiap node yang sukses TERSIMPAN; ekspektasi = 14 + (0,1 × biaya resume 1 menit × 4 node) ≈ 14,4 menit. Hemat 32% — DAN varians turun drastis (tanpa checkpoint: kadang 14 menit, kadang 42; dengan checkpoint: hampir selalu ~14). Checkpoint = bukan sekadar hemat waktu, tetapi PREDIKTABILITAS. Sistem yang prediktabel = SLA yang bisa dijanjikan.",
        "Edge bersyarat — kekuatan graf yang sebenarnya. Contoh: setelah node `analisis`, edge mengevaluasi `risiko_tinggi?` → YA ke `verifikasi_manusia`, TIDAK ke `tulis`. Satu baris kondisi menggantikan 20 baris if/else di chain. Pola lanjutan: edge DINAMIS (tujuan dihitung saat runtime — “ke node yang menangani error X”), edge PARALEL (fan-out ke 3 node, fan-in saat semua selesai). Aturan: jika alurmu punya >2 cabang, chain sudah kalah — pindah ke graf sebelum cabangnya beranak.",
        "Human-in-the-loop sebagai NODE — bukan tempelan. Di graf, approval = node biasa: `tulis_draf` → `tunggu_approval` (menunggu event manusia, state tersimpan) → `kirim` atau `revisi`. Keindahannya: approval yang menunggu 2 HARI tidak menghabiskan resource (state di checkpoint, bukan di memory) dan bisa di-resume kapan saja. Di chain/raw loop, “tunggu manusia” = proses menggantung = rapuh. Graf mengubah manusia menjadi bagian arsitektur — bukan pengecualian yang ditangani dengan `time.sleep` dan doa.",
        "Fan-out/fan-in — paralelisme di dalam graf. Node `riset` fan-out ke 3 node paralel (pasar, regulasi, kompetitor), fan-in di `sintesis` saat ketiganya selesai. Waktu: max(3,5,4) = 5 menit (bukan 12). Syarat: node paralel TIDAK SALING BERGANTUNGBUNGAN dan tidak menulis state yang sama (atau pakai reducer yang benar). Jebakan: 3 node menulis key `hasil` yang sama → race condition → hasil acak. Solusi: namespace per node (`hasil.pasar`, `hasil.regulasi`) + reducer eksplisit di fan-in. Paralelisme tanpa disiplin state = balapan liar.",
        "Konsep abadi vs merek — yang perlu dihafal 10 tahun. LOOP (sense–plan–act–observe): dari 2004 (arsitektur agen klasik) sampai sekarang. STATE eksplisit: dari mesin status hingga LangGraph. CHECKPOINT/RESUME: dari database transaction log. OBSERVABILITY: dari distributed tracing. LangChain/LangGraph/CrewAI = baju 2024–2026; konsepnya = tubuh yang tetap. Belajar baju = ganti tiap 2 tahun; belajar tubuh = relevan selamanya. Alokasikan 80% waktu belajarmu ke konsep, 20% ke API.",
        "Kapan RAW CODE menang — tiga kondisi. (1) Tim 1 orang, deadline 2 hari: overhead framework (belajar API, konfigurasi) > manfaatnya. (2) Alur SANGAT spesifik yang tidak pas di pola framework (protokol biner custom): melawan framework lebih mahal daripada menulis sendiri. (3) Dependensi minimal (lingkungan terkunci): requests + while = 2 dependensi vs framework + 40 transitive deps. Raw code bukan “kuno” — ia adalah pilihan sadar dengan trade-off tertulis. Yang kuno = memilih tanpa alasan.",
      ],
      formula: String.raw`|\mathcal{S}_t| = |\mathcal{S}_0| + t \cdot \Delta`,
      formulaNote: "|S_t| = ukuran state setelah t langkah; |S_0| = state awal (konfigurasi + tujuan); t = jumlah langkah; Δ (delta) = pertumbuhan rata-rata per langkah. Δ kecil (ringkasan, ~2KB) = checkpoint murah dan cepat; Δ besar (observasi mentah, ~50KB) = bom storage. Desain state yang baik = Δ kecil: simpan RINGKASAN atau POINTER, bukan data mentah.",
      tasks: [],
      note: {
        title: "Miskonsepsi: \u201Cpilih framework dulu, desain belakangan\u201D",
        type: "pitfall",
        body: "Yang benar: framework adalah IMPLEMENTASI desain, bukan pengganti desain. Tim yang bisa menggambar graf state-nya di kertas akan produktif di framework apa pun; tim yang tidak bisa akan tersesat di abstraksi framework mana pun. Desain dulu (node, edge, state, checkpoint), pilih alat kemudian.",
      },
      hints: [
        "Intuisi: jika kamu tidak bisa menjelaskan \u201Cstate-mu berisi apa\u201D dalam satu kalimat, state-mu terlalu besar — pangkas sebelum checkpoint-mu menjadi beban.",
        "Intuisi: framework dinilai dari tiga hal: seberapa eksplisit state-nya, seberapa mudah resume-nya, seberapa lengkap hook observability-nya. Sisanya kosmetik.",
      ],
    },
    {
      id: "lab",
      eyebrow: "Langkah 3 · Lab",
      title: "Lab: orkestrator graf mini dengan checkpoint & resume",
      prose: [
        "Kamu membangun `GrafMini` — orkestrator ala LangGraph dalam ~30 baris: node didaftarkan dengan fungsi, edge menentukan node berikut (bisa bersyarat), dan tiap eksekusi node MENYIMPAN state ke `checkpoints`.",
        "Graf uji: `riset` → `analisis` → (`tulis` jika analisis menemukan risiko tinggi, else `selesai`). Node `analisis` mock-nya SENGAJA gagal di percobaan pertama (simulasi crash) — lalu kamu me-resume dari checkpoint terakhir.",
        "Tugasmu: (1) implementasikan `tambah_node`, `tambah_edge`, dan `jalan` — `jalan` mengeksekusi node berurutan mengikuti edge, menyimpan deepcopy state tiap selesai node; (2) implementasikan `resume(dari_checkpoint)` — muat state tersimpan, lanjutkan dari node berikutnya; (3) simulasikan crash lalu resume, buktikan hasil akhir sama tanpa mengulang `riset`.",
        "Coba eksplorasi: apa yang terjadi jika checkpoint menyimpan REFERENSI state (bukan deepcopy)? Ubah dan lihat state \u201Cbocor\u201D antar checkpoint — bug klasik.",
        "Eksperimen: matikan checkpoint (comment-out penyimpanan), jalankan graf dengan crash di node 3. Waktu terbuang: 3+5+4 = 12 menit → ulangi dari awal. Total 26 menit untuk tugas 14 menit. Sekarang nyalakan checkpoint: crash di node 3 → resume dari checkpoint node 2 → total 15 menit. RASAKAN bedanya — bukan sebagai angka, tetapi sebagai pengalaman menunggu. Setiap menit yang terbuang di lab = jam yang terbuang di produksi × 1.000 run.",
        "Resume dari TENGAH — bukan dari awal. Setelah crash di node 3, ubah data (simulasi “perbaikan”), lalu resume dari checkpoint node 2 — BUKAN node 1. Perhatikan: node 1–2 TIDAK dijalankan ulang (hemat 8 menit), tetapi node 3 memakai data BARU. Inilah kekuatan checkpoint yang sebenarnya: bukan sekadar “ulangi yang gagal”, melainkan “lanjutkan dengan perbaikan”. Debugging produksi = perbaiki → resume dari titik gagal → verifikasi. Tanpa checkpoint: perbaiki → ulangi SEMUA → berdoa tidak ada yang berubah di tengah.",
        "Tambah node baru `audit` setelah `tulis` — tanpa merusak graf. Daftarkan node, tambah edge `tulis → audit → selesai`. Perhatikan betapa MURAHNYA menambah langkah di graf (3 baris) vs di raw while loop (ubah logika + state + resume manual). Inilah nilai framework: BIAYA PERUBAHAN rendah. Sistem yang sering berubah (semua sistem produksi!) membutuhkan biaya perubahan rendah — itulah metrik framework yang paling penting, bukan “fitur terbanyak”.",
        "State KECIL vs BESAR — eksperimen. Versi A: state menyimpan ringkasan per node (Δ=2KB). Versi B: menyimpan seluruh observasi mentah (Δ=50KB). Jalankan 40 langkah (simulasi loop), ukur: waktu checkpoint, ukuran storage, waktu resume. B akan 25× lebih lambat dan besar — untuk informasi yang 95% tidak pernah dibaca ulang. Pelajaran yang terasa di tangan: desain state = desain biaya. Setiap byte di state = byte yang ditulis, disimpan, dan dibaca ulang — bayar 3×.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `jalan` dengan penyimpanan checkpoint per node" },
        { id: "t2", text: "Implementasikan `resume`, simulasikan crash, dan cetak buktinya" },
      ],
      expected: "node_dieksekusi=4\nriset_diulang=0\nstatus=selesai",
      note: {
        title: "Miskonsepsi: \u201Cframework = sihir yang menangani semua\u201D",
        type: "pitfall",
        body: "Yang benar: framework hanya mengeksekusi desainmu — graf yang salah tetap salah di LangGraph. Lab ini membuktikan intinya bisa dibangun dalam 30 baris: yang berharga adalah KONSEP (state eksplisit + checkpoint), bukan merek library-nya.",
      },
      hints: [
        "jalan: node = awal; while node: state = fungsi[node](state); checkpoints[node] = deepcopy(state); node = edge[node](state) — edge bisa fungsi bersyarat.",
        "resume: muat state dari checkpoints[node_terakhir]; lanjutkan dari edge[node_terakhir](state).",
        "Hitung riset_diulang: berapa kali fungsi riset dipanggil total (seharusnya 1).",
      ],
      code: {
        starter: `# ===== MOCK — jangan diubah =====\nimport copy\nPANGGILAN = {"riset": 0}\n\ndef node_riset(state):\n    PANGGILAN["riset"] += 1\n    state["fakta"] = "IHSG 7412"\n    return state\n\nCRASH = {"sudah": False}\n\ndef node_analisis(state):\n    if not CRASH["sudah"]:\n        CRASH["sudah"] = True\n        raise RuntimeError("crash simulasi!")\n    state["risiko"] = "tinggi"\n    return state\n\ndef node_tulis(state):\n    state["laporan"] = f"LAPORAN risiko {state['risiko']}: {state['fakta']}"\n    state["status"] = "selesai"\n    return state\n\n# ===== TULIS KODEMU =====\nclass GrafMini:\n    def __init__(self):\n        self.fungsi = {}\n        self.edge = {}\n        self.checkpoints = {}\n    def tambah_node(self, nama, fn):\n        self.fungsi[nama] = fn\n    def tambah_edge(self, dari, ke):\n        self.edge[dari] = ke\n    def jalan(self, awal, state):\n        ...\n    def resume(self, dari_node):\n        ...\n\ng = GrafMini()\ng.tambah_node("riset", node_riset)\ng.tambah_node("analisis", node_analisis)\ng.tambah_node("tulis", node_tulis)\ng.tambah_edge("riset", lambda s: "analisis")\ng.tambah_edge("analisis", lambda s: "tulis" if s.get("risiko") == "tinggi" else None)\ng.tambah_edge("tulis", lambda s: None)\n\n# eksekusi 1: crash di analisis\nnode_terakhir = g.jalan("riset", {})\n# resume dari checkpoint\nnode_dieksekusi = g.resume(node_terakhir)\nriset_total = PANGGILAN["riset"]\nprint(f"node_dieksekusi={node_dieksekusi}")\nprint(f"riset_diulang={PANGGILAN['riset'] - 1}")\nprint(f"status={g.checkpoints['tulis']['status']}")`,
        lockLines: 17,
        solution: `# ===== MOCK — jangan diubah =====\nimport copy\nPANGGILAN = {"riset": 0}\n\ndef node_riset(state):\n    PANGGILAN["riset"] += 1\n    state["fakta"] = "IHSG 7412"\n    return state\n\nCRASH = {"sudah": False}\n\ndef node_analisis(state):\n    if not CRASH["sudah"]:\n        CRASH["sudah"] = True\n        raise RuntimeError("crash simulasi!")\n    state["risiko"] = "tinggi"\n    return state\n\ndef node_tulis(state):\n    state["laporan"] = f"LAPORAN risiko {state['risiko']}: {state['fakta']}"\n    state["status"] = "selesai"\n    return state\n\n# ===== TULIS KODEMU =====\nclass GrafMini:\n    def __init__(self):\n        self.fungsi = {}\n        self.edge = {}\n        self.checkpoints = {}\n    def tambah_node(self, nama, fn):\n        self.fungsi[nama] = fn\n    def tambah_edge(self, dari, ke):\n        self.edge[dari] = ke\n    def jalan(self, awal, state):\n        node, terakhir_ok, n = awal, None, 0\n        while node:\n            try:\n                state = self.fungsi[node](state)\n            except RuntimeError:\n                return terakhir_ok\n            self.checkpoints[node] = copy.deepcopy(state)\n            terakhir_ok, node = node, self.edge[node](state)\n            n += 1\n        return terakhir_ok\n    def resume(self, dari_node):\n        state = copy.deepcopy(self.checkpoints[dari_node])\n        node = self.edge[dari_node](state)\n        n = 0\n        while node:\n            state = self.fungsi[node](state)\n            self.checkpoints[node] = copy.deepcopy(state)\n            node = self.edge[node](state)\n            n += 1\n        return n + 1  # termasuk node checkpoint awal\n\ng = GrafMini()\ng.tambah_node("riset", node_riset)\ng.tambah_node("analisis", node_analisis)\ng.tambah_node("tulis", node_tulis)\ng.tambah_edge("riset", lambda s: "analisis")\ng.tambah_edge("analisis", lambda s: "tulis" if s.get("risiko") == "tinggi" else None)\ng.tambah_edge("tulis", lambda s: None)\n\n# eksekusi 1: crash di analisis\nnode_terakhir = g.jalan("riset", {})\n# resume dari checkpoint\nnode_dieksekusi = g.resume(node_terakhir)\nriset_total = PANGGILAN["riset"]\nprint(f"node_dieksekusi={node_dieksekusi}")\nprint(f"riset_diulang={PANGGILAN['riset'] - 1}")\nprint(f"status={g.checkpoints['tulis']['status']}")`,
        checks: [
          { kind: "defined", task: "t1", name: "GrafMini", label: "`GrafMini` tersedia", msg: "Class sudah disediakan — lengkapi jalan dan resume." },
          { kind: "equal", task: "t2", name: "node_dieksekusi", value: 3, tol: 1e-9, label: "`node_dieksekusi` = 3 saat resume", msg: "Resume mengeksekusi analisis + tulis, dihitung 3 termasuk node checkpoint." },
          { kind: "equal", task: "t2", name: "riset_total", value: 1, tol: 1e-9, label: "`riset` hanya dipanggil 1×", msg: "Checkpoint menghindari pengulangan riset. Cek logika resume." },
          { kind: "stdout_matches", task: "t2", pattern: "node_dieksekusi=3\\nriset_diulang=0\\nstatus=selesai", label: "output tiga baris sesuai format", msg: "Riset hanya dipanggil sekali — checkpoint menghindari pengulangan." },
        ],
      },
      reference: "copy.deepcopy untuk checkpoint, edge sebagai fungsi bersyarat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: chain, graph, atau raw?",
      prose: [
        "Skenario 1 — alur linear tetap (ambil → olah → simpan) → CHAIN. Jangan bayar kompleksitas graf untuk garis lurus.",
        "Skenario 2 — ada cabang/loop/paralel + butuh resume → GRAPH. Inilah 80% kasus agen produksi.",
        "Skenario 3 — latensi ultra-ketat / dependensi dilarang / tim kecil → RAW API. Kontrol penuh, bangun roda sendiri dengan sadar.",
        "Skenario 4 — tim besar, banyak agen, butuh standar → FRAMEWORK MATANG + konvensi tim. Nilai framework = standarisasi, bukan sihir.",
        "Cara membaca: empat node (riset → analisis + verifikasi paralel → tulis). Panah = edge; garis putus-putus = cek silang; tiap node berlabel versi state-nya.",
        "Interpretasi: chain TIDAK BISA menggambar ini — ia tidak punya cabang. Inilah momen \u201Cbutuh graph\u201D: saat whiteboard-mu butuh garis bercabang. Dan label state v1/v2a/v2b/v3 menunjukkan kenapa state eksplisit penting: tanpa itu, node tulis tidak tahu analisis dan verifikasi bisa berbeda versi.",
        "Aturan praktis 10 detik: (1) Linear → chain. (2) Cabang/loop/resume → graph. (3) Kendala ekstrem → raw. (4) Desain di kertas dulu — framework kemudian.",
        "Skenario: tim 1 orang, deadline 2 hari, alur linear → RAW (requests + while). Jangan bayar overhead belajar framework untuk proyek 2 hari. Hitung: belajar API dasar 4 jam + setup 2 jam = 6 jam dari 16 jam tersedia (37%!). Raw code: 0 jam overhead. Keputusan ini bukan “anti-framework” — ia adalah alokasi modal yang rasional. Framework adalah INVESTASI; investasi butuh waktu untuk kembali. Proyek 2 hari tidak memberi waktu itu.",
        "Skenario: multi-tim + compliance (bank) → GRAPH + AUDIT. Alasan: (1) state eksplisit = auditor bisa membaca; (2) checkpoint = bukti proses; (3) edge bersyarat = kebijakan tertulis sebagai kode. Compliance bukan fitur — ia adalah KEBUTUHAN ARSITEKTUR. Framework yang state-nya implisit (tersebar di variabel) = mimpi buruk audit. Pilih yang state-nya bisa DITUNJUKKAN ke auditor.",
        "Skenario: alur linear TETAP (tidak akan berubah 1 tahun) → CHAIN. Jangan bayar kompleksitas graf untuk garis lurus — bukan karena graf “buruk”, tetapi karena setiap konsep yang tidak dipakai = beban kognitif + bug potensial. YAGNI (You Ain’t Gonna Need It) berlaku untuk arsitektur: bangun untuk KEBUTUHAN hari ini + 1 level kompleksitas cadangan, bukan untuk semua kemungkinan masa depan.",
        "Skenario: event-driven (agen bereaksi ke webhook/antrean) → GRAPH + TRIGGER. Node menunggu event (bukan polling!), state di checkpoint saat idle. Raw while + sleep(60) = boros + lambat (latency hingga 60 detik). Graf dengan trigger = bangun saat ada kerja, tidur saat tidak. Untuk 1.000 event/hari yang tersebar: polling = 1.440 cek/hari sia-sia; trigger = 1.000 eksekusi tepat waktu. Arsitektur mengikuti POLA KEDATANGAN kerja.",
      ],
      note: {
        title: "💡 Intuisi: checkpoint = asuransi terhadap waktu",
        body: "Premi: sedikit kode + storage kecil. Klaim: tidak perlu mengulang 13 menit kerja saat crash di menit ke-14. Seperti semua asuransi: bayar saat MURAH (desain awal), bukan saat MAHAL (setelah insiden pertama). Dan seperti semua asuransi: ukur dulu risikonya (failure rate) — premi untuk risiko 1% = pemborosan.",
      },
      figure: {
        svg: GRAPH_SVG,
        alt: "Graf agen: riset bercabang ke analisis dan verifikasi, bergabung di tulis, dengan checkpoint tiap node.",
        caption: "Momen \u201Cbutuh graph\u201D: saat alurmu bercabang dan perlu resume.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Mini-case: harga mengulang dari nol",
      prose: [
        "Agen laporan Dina: 4 node (riset 3 menit, analisis 5 menit, verifikasi 4 menit, tulis 2 menit). Peluang crash per node = 10% (API timeout). Tanpa checkpoint: crash di node mana pun = ulangi SEMUA dari awal.",
        "Expected waktu tanpa checkpoint: tiap run sukses dengan peluang 0,9⁴ = 0,656. Expected jumlah run = 1/0,656 = 1,52. Waktu per run 14 menit → expected 21,3 menit per laporan.",
        "Dengan checkpoint per node: crash di node k = ulangi dari node k saja. Expected waktu = Σ (waktu node i / 0,9) = 14/0,9 = 15,6 menit. Hemat 5,7 menit per laporan (27%).",
        "Untuk 500 laporan/bulan: hemat 2.850 menit = 47,5 jam ≈ Rp4 juta/bulan nilai waktu analis. Biaya checkpoint: state 50KB × 4 node × 500 = 100MB storage/bulan — praktis nol rupiah.",
        "Pembahasan: pelajaran angkanya — checkpoint adalah asuransi termurah di agentic AI. Dan rumus |S_t| mengingatkan: jika state-mu 50MB (bukan 50KB) karena membawa seluruh dokumen, checkpoint menjadi BEBAN — pangkas state (simpan referensi, bukan isi) sebelum mengeluh framework lambat.",
        "Variasi: crash 1% (bukan 10%) — infrastruktur yang bagus. Tanpa checkpoint: P(sukses) = 0,99⁴ = 0,961; expected run = 1,04; expected waktu = 14,6 menit. Dengan checkpoint: ~14,1 menit. Hemat: 0,5 menit (3%). KESIMPULAN: checkpoint TIDAK WORTH IT di bawah ~3% failure rate! Biaya implementasi (2 hari) > penghematan. Pelajaran: ukur dulu failure rate-mu SEBELUM membangun checkpoint. Engineering = bukan “best practice” buta, melainkan “praktik yang tepat untuk angkamu”.",
        "Ukuran state — biaya tersembunyi. State 85KB (hemat) vs 2MB (boros), 1.000 run/hari, retensi 30 hari. Hemat: 85KB × 1.000 × 30 = 2,55GB — sepele. Boros: 2MB × 1.000 × 30 = 60GB — mulai terasa (Rp600 ribu/bulan managed storage) + latency tulis/baca (2MB × 2 detik × 1.000 = 33 menit/hari WAKTU TUNGGU). Desain state yang buruk = pajak harian yang tidak terlihat di demo tetapi membunuh di produksi. Ukur ukuran state-mu SEKARANG: jika >100KB per run, investigasi.",
        "Keputusan framework — matriks 3×4. Baris: RAW / CHAIN / GRAPH. Kolom: biaya bangun (jam), biaya ubah (jam/fitur), butuh resume (ya/tidak), learning curve (hari). RAW: 4 / 8 / tidak / 0. CHAIN: 6 / 3 / terbatas / 1. GRAPH: 12 / 1 / ya / 3. Untuk proyek 2 hari: RAW menang (4 jam). Untuk sistem 1 tahun dengan 20 perubahan: GRAPH menang (12 + 20×1 = 32 jam vs RAW 4 + 20×8 = 164 jam!). Horizon WAKTU membalik keputusan. Pilih framework untuk HORIZON, bukan untuk hari ini.",
        "Migrasi antar framework — biayanya. Dari CHAIN ke GRAPH (alur bertambah cabang): 1 pekan (konsep sama — loop & state — hanya API berbeda). Dari RAW ke GRAPH: 2–3 pekan (konsep baru: state eksplisit, checkpoint). Dari GRAPH A ke GRAPH B (LangGraph → lain): 2–3 HARI (konsep identik!). Pola: biaya migrasi ∝ JARAK KONSEP, bukan jarak API. Tim yang paham konsep = migrasi murah. Investasi di konsep = asuransi terhadap perubahan framework.",
        "Total cost of ownership 1 tahun — angka final. Opsi RAW: bangun 4 jam + 20 perubahan × 8 jam = 164 jam × Rp150.000 = Rp24,6 juta + 0 lisensi. Opsi GRAPH: bangun 12 jam + belajar 24 jam + 20 × 1 jam = 56 jam = Rp8,4 juta. GRAPH menang Rp16,2 juta — UNTUK sistem yang berubah. Untuk sistem yang TIDAK berubah (5 perubahan): RAW = 4+40 = 44 jam = Rp6,6 juta vs GRAPH = 12+24+5 = 41 jam = Rp6,15 juta — SERI. Kesimpulan: frekuensi perubahan adalah VARIABEL PENENTU. Tanyakan: “berapa kali sistem ini akan berubah setahun?” — jawabannya memilih framework-mu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di pipeline risk batch, resume dari checkpoint = idempotensi operasional. Job 6 jam yang crash di jam ke-5 tanpa checkpoint = 5 jam terbuang + jendela SLA terlewat. Checkpoint bukan fitur — ia kontrol kelangsungan operasi.",
      },
    },    {
      id: "llamaindex-vendor-sdk",
      eyebrow: "Langkah 6 · LlamaIndex & SDK vendor",
      title: "LlamaIndex dan SDK vendor: peta framework yang belum lengkap",
      prose: [
        "Langkah konsep lesson ini membandingkan LangChain, LangGraph, CrewAI, dan kode polos — tetapi spec AG6 juga menyebut dua keluarga yang belum ada: LlamaIndex dan SDK agent dari vendor model. Keduanya mengubah jawaban “framework apa” untuk sebagian tim.",
        "LlamaIndex adalah data framework: index, retriever, dan query engine sebagai warga kelas satu — kuat bila agenmu RAG-heavy (banyak dokumen, banyak query, banyak reranking). Ia tidak menggantikan LangGraph: LlamaIndex mengatur DATA, LangGraph mengatur ALUR. Tim yang RAG-nya rumit tetapi alurnya linear sering lebih cocok LlamaIndex; tim yang alurnya bercabang dan butuh resume lebih cocok LangGraph.",
        "SDK agent dari vendor model — OpenAI Agents SDK, Bedrock Agents, Vertex AI Agent Builder, Azure AI Agent Service — terintegrasi dengan cloud masing-masing: mulai tercepat, dokumentasi dan dukungan satu atap. Harganya adalah lock-in tertinggi: agenmu terikat model, billing, dan fitur cloud itu. Pilih bila timmu sudah hidup di cloud tersebut; hindari bila strategimu multi-cloud atau vendor bisa berganti tahun depan.",
        "Kriteria pilih yang jujur: butuh RAG berat — LlamaIndex; butuh graf dan resume — LangGraph; butuh delegasi multi-agen dengan peran — CrewAI; sudah di cloud X — SDK vendor X; tim kecil dan kebutuhan sederhana — kode polos. Dan cap waktu yang jujur seperti lesson ini: perdebatan framework 2024–2026 bergerak cepat — verifikasi dokumentasi resmi terbaru sebelum memilih, karena nama yang populer tahun lalu bisa jadi sudah berganti rekomendasi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: “framework terbaik = yang paling populer”",
        type: "pitfall",
        body: "Yang benar: framework terbaik = yang cocok dengan BENTUK masalahmu. LlamaIndex untuk RAG-heavy, LangGraph untuk graf, SDK vendor untuk cloud tunggal, kode polos untuk sederhana. Popularitas adalah sinyal lemah; bentuk masalah adalah sinyal kuat.",
      },
      reference: "LlamaIndex = data/RAG-heavy; LangGraph = alur/graf; SDK vendor = mulai cepat, lock-in tertinggi.",
    },

    {
      id: "lab-skor-framework",
      eyebrow: "Langkah 7 · Lab framework",
      title: "Lab: skor framework dengan matriks keputusan",
      prose: [
        "Tim Dina membangun agen RAG-heavy atas SOP bank: banyak dokumen, alur linear, tim kecil. Empat kandidat dinilai 1–5 pada empat kriteria berbobot: RAG (0,3), graf/resume (0,3), lock-in rendah (0,2), mulai cepat (0,2). Tugasmu: implementasikan `skor_tertimbang` dan hitung total tiap kandidat, lalu tentukan pemenangnya.",
        "Skornya: LangGraph 3/5/4/3; LlamaIndex 5/3/4/4; SDK vendor 3/3/2/5; kode polos 2/4/5/2. Perhatikan: LlamaIndex menang BUKAN karena ia “terbaik secara umum”, melainkan karena bobot RAG 0,3 cocok dengan masalah tim — ubah bobotnya (misal graf lebih penting dari RAG), pemenangnya berubah. Matriks keputusan tidak memilihkan framework untukmu; ia memaksa alasanmu tertulis.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `skor_tertimbang(skor, bobot)` (jumlah skor x bobot)" },
        { id: "t2", text: "Hitung total keempat kandidat dan tentukan `pemenang` (skor tertinggi)" },
      ],
      expected: "langgraph=3.8\nllamaindex=4.0\nvendor=3.2\npolos=3.2\npemenang=llamaindex",
      note: {
        title: "💡 Intuisi",
        body: "Matriks yang sama dengan bobot berbeda memberi pemenang berbeda — dan itulah gunanya. Bila dua tim memakai matriks sama tetapi bobot berbeda lalu berdebat, mereka tidak berdebat tentang framework; mereka berdebat tentang prioritas. Selesaikan prioritasnya dulu.",
      },
      hints: [
        "Total = sum(s * b untuk s, b dalam zip(skor, bobot)).",
        "Bulatkan 1 desimal saat mencetak.",
        "Pemenang = kunci dengan total tertinggi (max dengan key).",
      ],
      code: {
        starter: `# DATA — jangan diubah
BOBOT = [0.3, 0.3, 0.2, 0.2]  # RAG, graf/resume, lock-in rendah, mulai cepat
KANDIDAT = {
    "langgraph": [3, 5, 4, 3],
    "llamaindex": [5, 3, 4, 4],
    "vendor": [3, 3, 2, 5],
    "polos": [2, 4, 5, 2],
}

# TULIS KODEMU
def skor_tertimbang(skor, bobot):
    ...

total = {}
for nama, skor in KANDIDAT.items():
    ...

pemenang = ...
for nama in ["langgraph", "llamaindex", "vendor", "polos"]:
    print(f"{nama}={total[nama]:.1f}")
print(f"pemenang={pemenang}")`,
        lockLines: 10,
        solution: `# DATA — jangan diubah
BOBOT = [0.3, 0.3, 0.2, 0.2]  # RAG, graf/resume, lock-in rendah, mulai cepat
KANDIDAT = {
    "langgraph": [3, 5, 4, 3],
    "llamaindex": [5, 3, 4, 4],
    "vendor": [3, 3, 2, 5],
    "polos": [2, 4, 5, 2],
}

# TULIS KODEMU
def skor_tertimbang(skor, bobot):
    return sum(s * b for s, b in zip(skor, bobot))

total = {}
for nama, skor in KANDIDAT.items():
    total[nama] = round(skor_tertimbang(skor, BOBOT), 1)

pemenang = max(total, key=total.get)
for nama in ["langgraph", "llamaindex", "vendor", "polos"]:
    print(f"{nama}={total[nama]:.1f}")
print(f"pemenang={pemenang}")`,
        checks: [
          { kind: "defined", task: "t1", name: "skor_tertimbang", label: "`skor_tertimbang` terdefinisi", msg: "Definisikan skor_tertimbang(skor, bobot)." },
          { kind: "equal", task: "t2", name: "total", value: {"langgraph": 3.8, "llamaindex": 4.0, "vendor": 3.2, "polos": 3.2}, label: "total keempat kandidat benar", msg: "LlamaIndex: 1,5+0,9+0,8+0,8 = 4,0. Cek perkalian tiap kriteria." },
          { kind: "equal", task: "t2", name: "pemenang", value: "llamaindex", label: "`pemenang` = llamaindex", msg: "Skor tertinggi 4,0 — untuk kasus RAG-heavy dengan bobot ini." },
          { kind: "stdout_matches", task: "t2", pattern: "langgraph=3\\.8\\nllamaindex=4\\.0\\nvendor=3\\.2\\npolos=3\\.2\\npemenang=llamaindex", label: "output lima baris sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Matriks keputusan: bobot x skor. Pemenang bergantung pada bobot — itulah gunanya ia tertulis.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang konsep abadi vs merek framework.",
        "Refleksi: framework = keputusan tentang BIAYA PERUBAHAN. Tiga pertanyaan sebelum memilih: (1) “Seberapa sering alur ini akan berubah?” — sering → graph; jarang → chain/raw. (2) “Butuh resume dari tengah?” — ya → graph dengan checkpoint. (3) “Siapa yang akan membaca state-nya?” — auditor → state eksplisit. Jawab ketiganya DENGAN ANGKA (frekuensi, biaya, horizon), bukan dengan “kayaknya”. Keputusan arsitektur tanpa angka = opini mahal.",
        "Satu kalimat untuk dibawa pulang: “Pilih KONSEP, bukan merek — dan pilih konsep berdasarkan FREKUENSI PERUBAHAN, bukan berdasarkan hype.” Loop, state, checkpoint, observability — empat konsep ini cukup untuk mengevaluasi framework apa pun yang muncul 5 tahun ke depan. Yang menghafal API akan belajar ulang tiap 2 tahun; yang memahami konsep akan mengenali “itu kan cuma loop + state” di setiap framework baru — dan benar.",
      ],
      tasks: [],
      summary: [
        "Chain: linear sederhana. Graph: cabang/loop/paralel + state eksplisit. Raw: kontrol penuh, bangun sendiri.",
        "Konsep abadi: state eksplisit, checkpoint/resume, observability hooks.",
        "|S_t| = |S_0| + t·Δ: pangkas state sebelum checkpoint jadi beban.",
        "Desain di kertas dulu (node, edge, state) — pilih framework kemudian.",
        "Framework dinilai dari: eksplisit state, mudah resume, lengkap hooks.",
      ],
      next: { label: "AAI11 — Debugging Agen: Tracing & Observability", href: "/v2/learn/aai11-debugging" },
      quiz: [
        {
          q: "Kapan kamu BENAR-BENAR butuh graph (bukan chain)?",
          options: [
            { text: "Saat alur selalu lurus A → B → C", why: "Itu wilayah chain — graph berlebihan.", },
            { text: "Saat ada cabang bersyarat, loop, atau butuh resume dari tengah", why: "Tepat. Inilah yang tidak bisa diungkapkan chain secara natural.", correct: true },
            { text: "Saat ingin terlihat modern", why: "Bukan alasan arsitektur.", },
            { text: "Saat hanya ada satu tool", why: "Satu tool linear = chain atau bahkan single-shot.", },
          ],
        },
        {
          q: "Kenapa checkpoint harus deepcopy, bukan referensi?",
          options: [
            { text: "Agar lebih cepat", why: "Deepcopy justru lebih lambat.", },
            { text: "Agar mutasi state berikutnya tidak merusak snapshot tersimpan", why: "Tepat. Referensi = checkpoint ikut berubah = resume dari state yang korup.", correct: true },
            { text: "Agar file lebih kecil", why: "Deepcopy tidak mengecilkan.", },
            { text: "Tidak penting, sama saja", why: "Bug klasik — sangat penting.", },
          ],
        },
        {
          q: "Tim terbelah soal merek framework. Saran terbaik Dina?",
          options: [
            { text: "Pilih yang paling populer", why: "Populer ≠ cocok untuk kasusmu.", },
            { text: "Gambar dulu graf state di kertas, lalu pilih alat yang mendukungnya", why: "Tepat. Desain dulu, alat kemudian — konsep abadi, API berubah.", correct: true },
            { text: "Bangun sendiri semuanya", why: "Hanya jika kendala ekstrem membenarkan.", },
            { text: "Voting mayoritas", why: "Arsitektur bukan demokrasi.", },
          ],
        },
        {
          q: "State-mu 50MB per checkpoint karena membawa isi dokumen. Masalahnya?",
          options: [
            { text: "Tidak masalah, storage murah", why: "50MB × ribuan checkpoint × latency tulis/baca = beban nyata.", },
            { text: "Checkpoint menjadi beban — simpan referensi/ID, bukan isi", why: "Tepat. Pelajaran dari rumus |S_t|: pangkas Δ.", correct: true },
            { text: "Harus ganti framework", why: "Bukan salah framework — salah desain state.", },
            { text: "Harus hapus checkpoint", why: "Jangan buang asuransinya; perbaiki isinya.", },
          ],
        },
        {
          q: "Keuntungan utama checkpoint dalam angka mini-case?",
          options: [
            { text: "Menghilangkan crash", why: "Crash tetap terjadi — yang hilang adalah keharusan mengulang dari nol.", },
            { text: "Expected waktu 21,3 → 15,6 menit (hemat 27%)", why: "Tepat. Crash di node k = ulangi dari node k saja.", correct: true },
            { text: "Menambah kecepatan node", why: "Node tidak lebih cepat.", },
            { text: "Mengurangi jumlah node", why: "Jumlah node tetap.", },
          ],
        },
        {
          q: "Tim membangun agen RAG-heavy: banyak dokumen, alur linear, tim kecil. Framework yang paling cocok?",
          options: [
            { text: "LlamaIndex — data framework dengan index/retriever/query engine sebagai warga kelas satu", why: "Benar: masalahnya RAG-heavy dan alurnya linear — kekuatan LlamaIndex tepat di sana.", correct: true },
            { text: "LangGraph — karena paling populer", why: "Popularitas bukan kriteria; LangGraph kuat di graf/resume, bukan kebutuhan utama tim ini.", },
            { text: "SDK vendor — karena mulai tercepat", why: "Mulai cepat benar, tetapi lock-in tertinggi — dan bukan jawaban atas kebutuhan RAG.", },
            { text: "Kode polos — karena paling sederhana", why: "Kode polos memaksa tim membangun index dan retriever sendiri — pekerjaan yang sudah ada di LlamaIndex.", },
          ],
        },
        {
          q: "Kapan SDK agent vendor model (OpenAI Agents, Bedrock, Vertex, Azure) pilihan yang TEPAT?",
          options: [
            { text: "Bila tim sudah hidup di cloud tersebut dan strategi multi-cloud bukan prioritas", why: "Benar: mulai tercepat dan dukungan satu atap — dengan harga lock-in tertinggi yang sudah diterima sadar.", correct: true },
            { text: "Selalu — SDK vendor selalu terbaik", why: "Salah: lock-in dan ketergantungan model adalah harga nyata.", },
            { text: "Bila ingin pindah vendor tiap kuartal", why: "Kebalikannya: SDK vendor justru yang tersulit dipindah.", },
            { text: "Bila tim tidak punya akses cloud sama sekali", why: "Tanpa cloud tersebut, SDK-nya tidak bisa dipakai.", },
          ],
        },
      ],
    },
  ],
};
