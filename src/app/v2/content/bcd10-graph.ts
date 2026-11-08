import type { V2Lesson } from "../lib/types";

// Graf aliran: S -> A,B -> C -> D -> E,M ; A -> F (sink).
const FLOW_SVG = `<svg viewBox="0 0 480 240" role="img" aria-label="Graf aliran dana: S ke A dan B, keduanya ke C, C ke D, D ke E dan M, A ke F.">
<g stroke="var(--chart-grid)" stroke-width="2">
<line x1="60" y1="120" x2="140" y2="60"/><line x1="60" y1="120" x2="140" y2="180"/>
<line x1="180" y1="60" x2="260" y2="120"/><line x1="180" y1="180" x2="260" y2="120"/>
<line x1="300" y1="120" x2="380" y2="120"/><line x1="420" y1="120" x2="450" y2="60"/><line x1="420" y1="120" x2="450" y2="180"/>
<line x1="140" y1="60" x2="140" y2="200"/></g>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600" text-anchor="middle">
<circle cx="40" cy="120" r="18" fill="var(--c4)" opacity="0.35" stroke="var(--c4)" stroke-width="2"/><text x="40" y="125">S</text>
<circle cx="160" cy="60" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="160" y="65">A</text>
<circle cx="160" cy="180" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="160" y="185">B</text>
<circle cx="280" cy="120" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="280" y="125">C</text>
<circle cx="400" cy="120" r="18" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/><text x="400" y="125">D</text>
<circle cx="462" cy="55" r="14" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="462" y="60">E</text>
<circle cx="462" cy="185" r="14" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="462" y="190">M</text>
<circle cx="140" cy="212" r="14" fill="var(--c4)" opacity="0.35" stroke="var(--c4)" stroke-width="2"/><text x="140" y="217">F</text></g>
<g font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">
<text x="100" y="82">10</text><text x="100" y="162">5</text><text x="222" y="82">9</text><text x="222" y="162">4</text>
<text x="340" y="110">12</text><text x="448" y="100">11</text><text x="448" y="152">2</text><text x="128" y="200">1</text></g>
<text x="140" y="234" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="middle">sink: F</text>
<text x="240" y="24" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">BFS 3 hop dari S: 6 node terjangkau · outflow S = 15 ETH</text>
</svg>`;

const BCD10_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Taint mengencer per hop: 100, 80, 32, 9,6 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><rect x="65.9" y="20.0" width="64.8" height="160.0" rx="3" fill="var(--c4)"/><text x="98.2" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">100%</text><text x="98.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">S</text><rect x="170.4" y="52.0" width="64.8" height="128.0" rx="3" fill="var(--c4)"/><text x="202.8" y="46.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">80%</text><text x="202.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">A (hop1)</text><rect x="274.9" y="128.8" width="64.8" height="51.2" rx="3" fill="var(--c3)"/><text x="307.2" y="122.8" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">32%</text><text x="307.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">B (hop2)</text><rect x="379.4" y="164.6" width="64.8" height="15.4" rx="3" fill="var(--c2)"/><text x="411.8" y="158.6" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">9,6%</text><text x="411.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">C (hop3)</text><line x1="46" y1="164.0" x2="464" y2="164.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="158.0" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 10%</text></svg>`;

export const bcd10: V2Lesson = {
  slug: "bcd10-graph",
  track: "Blockchain Data Scientist",
  module: "Investigasi & Risiko",
  title: "BCD10 — Graph Analysis Aliran Dana",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "14 dompet dalam 20 menit — semuanya terlihat",
      prose: [
        "Peretasan exchange: 2.000 ETH raib. Tim forensik menelusuri: dalam 20 menit, dana melewati 14 dompet — dipecah, digabung, dipecah lagi. Di tabel transaksi, itu 300 baris acak yang membingungkan. Seorang analis junior memvisualkannya sebagai graf — dan polanya langsung bicara: 14 dompet itu membentuk CORONG. Semua aliran bermuara ke 2 dompet penampung, yang 10 menit kemudian deposit ke exchange.",
        "Twist-nya: pelaku melakukan segalanya dengan BENAR menurut buku teks pencucian — banyak hop, pecah nominal, timing rapat. Tetapi di blockchain, 'benar' pun meninggalkan graf. Corong tidak bisa disembunyikan: uang yang dipecah harus DIGABUNG kembali untuk dipakai — dan titik penggabungan adalah titik terang.",
        "Lesson ini: teknik mengikuti aliran dana hop-per-hop (BFS), membaca struktur corong/kipas, dan menemukan titik terang (sink, exchange, mixer). Tujuan: (1) membangun graf dari edge list; (2) menjalankan BFS berbatas hop; (3) mengidentifikasi pola corong vs kipas vs rantai. Peta: cerita → model graf → lab BFS → tiga pola → titik terang → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memodelkan aliran dana sebagai graf (node, edge, arah); (2) menjalankan BFS 3 hop dan menemukan sink; (3) mengenali tiga pola: corong, kipas, rantai; (4) menghitung taint dan merancang pelacakan berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Semakin banyak hop semakin aman bagi pelaku.\" Salah — setiap hop MENAMBAH jejak, bukan menghilangkannya. Yang menyulitkan analis bukan jumlah hop, melainkan PERCABANGAN yang meledak (1 → 50 → 2.500 address = 2.500 cabang harus diperiksa). Hop banyak + rantai lurus = mudah diikuti. Hop sedikit + kipas lebar = sulit. Kompleksitas analis = lebar cabang, bukan panjang rantai.",
      },
      reference: "Uang dipecah harus digabung kembali — titik penggabungan = titik terang.",
    },
    {
      id: "model",
      eyebrow: "Langkah 2 · Model graf",
      title: "Node, edge, dan arah uang",
      prose: [
        "Modelnya: node = address; edge berarah = transfer (from → to) dengan bobot = nominal dan atribut = blok/waktu. Dari edge list transfers (bcd9), graf dibangun dalam satu pass: untuk tiap transfer, tambahkan edge.",
        "Dua arah analisis. Forward tracing: dari sumber (dompet peretas) mengikuti uang PERGI ke mana — untuk menemukan penampungan/pencairan. Backward tracing: dari tujuan (deposit exchange) menelusuri uang DATANG dari mana — untuk menemukan sumber dana nasabah yang tercemar.",
        "BFS (breadth-first search) berbatas hop adalah workhorse-nya: kunjungi semua tetangga hop-1, lalu hop-2, dst. Batas hop (2–5) WAJIB — tanpa batas, satu dompet yang pernah berinteraksi dengan exchange raksasa 'menjangkau' separuh chain dalam 6 hop (small-world problem).",
      ],
      figure: {
        svg: FLOW_SVG,
        alt: "Graf aliran dana: S ke A dan B, keduanya ke C, C ke D, D ke E dan M, A ke F.",
        caption: "BFS 3 hop dari S menjangkau 6 node. F = sink (tidak ada aliran keluar) = kandidat penampungan akhir. Cara membaca: lingkaran = address, panah = aliran dana, angka = hop dari S; node F tidak punya panah keluar. Interpretasi: F sebagai sink + 15 ETH terkumpul = kandidat penampungan akhir — TAPI cek taint-nya (langkah pendalaman): jika taint < 10%, ia hanya persinggahan, bukan tujuan.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: hop adalah anggaran, bukan kebenaran",
        body: "Batas '3 hop' bukan hukum alam — ia ANGGARAN investigasi. Hop 1–2 = 'sangat terkait' (prioritas interogasi). Hop 3–5 = 'mungkin terkait' (pantau). Hop 6+ dari address aktif = noise small-world. Analis profesional tidak bertanya 'berapa hop yang benar?' melainkan 'dengan anggaran 3 hop, siapa yang paling prioritas?' — lalu MENDOKUMENTASIKAN batasnya di laporan. Hop tanpa dokumentasi = klaim tanpa metodologi.",
      },
      reference: "Forward = ke mana perginya; backward = dari mana datangnya. BFS wajib berbatas hop.",
    },
    {
      id: "lab-bfs",
      eyebrow: "Langkah 3 · Lab",
      title: "Menelusuri 3 hop dari dompet S",
      prose: [
        "Edge list sintetis (from, to, amount ETH, blok): S→A 10, S→B 5, A→C 9, B→C 4, C→D 12, D→E 11, D→M 2, A→F 1.",
        "Tugasmu: (1) BFS dari S maksimal 3 hop → himpunan `reach` (termasuk S); (2) `outflow` = total ETH keluar dari S; (3) `sinks` = node terjangkau yang TIDAK punya aliran keluar (kandidat penampungan akhir).",
      ],
      formula: String.raw`R_{k+1} = R_k \cup \{ t \mid \exists s \in R_k : (s \to t) \in E \} \qquad R_0 = \{S\}`,
      formulaNote: "R_k = himpunan node terjangkau dalam ≤ k hop; E = edge list. Tiap iterasi menambahkan semua tujuan dari node yang sudah terjangkau. Berhenti di k = batas hop.",
      tasks: [
        { id: "t1", text: "Bangun adjacency list, BFS 3 hop → `reach` (list terurut)" },
        { id: "t2", text: "Hitung `outflow` (total keluar dari S)" },
        { id: "t3", text: "Temukan `sinks` (node di reach tanpa outgoing edge)" },
        { id: "t4", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "reach=6 nodes  outflow=15 ETH  sinks=['F']",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa menandai node yang sudah dikunjungi → infinite loop saat graf punya cycle (A→B→A, umum di wash/layering). BFS tanpa visited set pada graf bersiklus = program hang. Aturan: visited ditandai SAAT ditemukan (bukan saat diproses) — ini juga mencegah node yang sama dihitung dua kali di hop berbeda.",
      },
      hints: [
        "adj = defaultdict(list); tiap edge: adj[f].append(t).",
        "frontier = {S}; ulangi 3×: kumpulkan tetangga yang belum di visited.",
        "outflow = jumlah amount edge dengan from == 'S'.",
      ],
      code: {
        starter: `from collections import defaultdict\nedges = [("S","A",10,1),("S","B",5,1),("A","C",9,2),("B","C",4,2),\n          ("C","D",12,3),("D","E",11,4),("D","M",2,4),("A","F",1,2)]\nadj = defaultdict(list)\nfor f, t, a, b in edges:\n    adj[f].append(t)\n\n# TULIS KODEMU: BFS maks 3 hop dari "S"\nvisited = {"S"}\nfrontier = {"S"}\nfor _ in range(3):\n    nxt = set()\n    for n in frontier:\n        for t in adj[n]:\n            if :\n                visited.add(t); nxt.add(t)\n    frontier = nxt\nreach = sorted(visited)\noutflow = \nsinks = sorted([n for n in reach if ])\n\nprint(f"reach={len(reach)} nodes  outflow={outflow} ETH  sinks={sinks}")`,
        lockLines: 6,
        solution: `from collections import defaultdict\nedges = [("S","A",10,1),("S","B",5,1),("A","C",9,2),("B","C",4,2),\n          ("C","D",12,3),("D","E",11,4),("D","M",2,4),("A","F",1,2)]\nadj = defaultdict(list)\nfor f, t, a, b in edges:\n    adj[f].append(t)\n\n# TULIS KODEMU: BFS maks 3 hop dari "S"\nvisited = {"S"}\nfrontier = {"S"}\nfor _ in range(3):\n    nxt = set()\n    for n in frontier:\n        for t in adj[n]:\n            if t not in visited:\n                visited.add(t); nxt.add(t)\n    frontier = nxt\nreach = sorted(visited)\noutflow = sum(a for f, t, a, b in edges if f == "S")\nsinks = sorted([n for n in reach if not adj[n]])\n\nprint(f"reach={len(reach)} nodes  outflow={outflow} ETH  sinks={sinks}")`,
        checks: [
          { kind: "equal", task: "t1", name: "reach", value: ["A", "B", "C", "D", "F", "S"], tol: 0, label: "`reach` = 6 node", msg: "Hop1: A,B; hop2: C,F; hop3: D. E,M di hop 4 — di luar batas." },
          { kind: "equal", task: "t2", name: "outflow", value: 15, tol: 0, label: "`outflow` = 15", msg: "10 + 5 keluar dari S." },
          { kind: "equal", task: "t3", name: "sinks", value: ["F"], tol: 0, label: "`sinks` = ['F']", msg: "F tidak punya outgoing edge. D punya (ke E,M)." },
          { kind: "stdout_matches", task: "t4", pattern: "reach=6 nodes\\s+outflow=15 ETH\\s+sinks=\\['F'\\]", label: "Output sesuai format", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "BFS + visited + batas hop. Sink = kandidat penampungan akhir.",
    },
    {
      id: "pola-struktur",
      eyebrow: "Langkah 4 · Tiga pola",
      title: "Corong, kipas, dan rantai",
      prose: [
        "Pola 1 — Corong (many→one): banyak address mengalir ke SATU penampung. Arti: pengumpulan — bisa gaji massal (sah), bisa penampungan hasil peretasan. Pembedanya: kecepatan + sumber (apakah pengirimnya korban?).",
        "Pola 2 — Kipas (one→many): satu address menyebar ke banyak address. Arti: distribusi — bisa airdrop (sah), bisa pemecahan jejak (layering). Pembedanya: apakah penerima lalu diam (airdrop) atau terus bergerak (layering)?",
        "Pola 3 — Rantai (one→one→one): aliran lurus panjang. Arti: forwarding berlapis — umum di layering dan juga di operasional exchange yang sah (cold wallet rotation). Pembedanya: ritme waktu (otomatis vs manual) dan ujungnya (exchange vs mixer).",
        "Cara membaca diagram lab: S mengipas ke A,B (kipas kecil), A+B mengerucut ke C (corong), C→D→E rantai. Satu graf kecil mengandung KETIGA pola — analis membaca struktur lokal, bukan label global.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: struktur tidak menghakimi, konteks yang menghakimi",
        body: "Corong yang sama persis bisa berarti 'payroll startup' atau 'penampungan peretasan'. Graf memberimu STRUKTUR; vonis butuh KONTEKS: siapa pengirimnya (label), seberapa cepat (timing), ke mana ujungnya (titik terang). Analis yang menuduh dari struktur saja = analis yang akan menuduh divisi HRD sebagai pencuci uang. Struktur → hipotesis → verifikasi konteks → kesimpulan. Urutan ini tidak bisa dibalik.",
      },
      reference: "Corong = pengumpulan; kipas = penyebaran; rantai = forwarding. Struktur → konteks → vonis.",
    },
    {
      id: "titik-terang",
      eyebrow: "Langkah 5 · Titik terang",
      title: "Di mana uang 'keluar' dari kegelapan",
      prose: [
        "Uang kripto hanya 'bernilai' saat bisa dipakai: dicairkan ke fiat (exchange), dibelanjakan (merchant), atau disembunyikan (mixer). Titik-titik ini = titik terang investigasi — tempat analis bisa bertindak (lapor, bekukan, pantau).",
        "Prioritas titik terang: (1) exchange teregulasi — bisa diminta bekukan (butuh kecepatan: dana transit < 1 jam); (2) mixer — pantau pola withdraw berpasangan (bcd7); (3) sink pasif — dompet yang menampung tanpa bergerak: pantau, ia akan bergerak saat pelaku merasa aman.",
        "Aturan waktu: kecepatan > kelengkapan. Laporan ke exchange dalam 1 jam dengan graf 2 hop LEBIH berguna daripada laporan sempurna 48 jam kemudian saat dana sudah cair. Forensik on-chain adalah balapan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk compliance exchange: 'deposit dari address ≤ 2 hop dari peretasan yang diketahui' adalah alasan sah untuk menahan penarikan sementara (dengan dokumentasi). Tetapi ingat bcd3: guilt by association bisa salah sasaran — nasabah yang kebetulan menerima dari address tercemar adalah KORBAN potensial, bukan pelaku. Prosedur: tahan → verifikasi → putuskan. Jangan bekukan permanen atas dasar hop saja.",
      },
      reference: "Titik terang: exchange (bekukan), mixer (pantau), sink (tunggu). Kecepatan > kelengkapan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Merancang pelacakan",
      prose: [
        "Skenario 1 — Dana curian baru keluar (darurat): BFS forward 2–3 hop SECEPATNYA, identifikasi titik terang (exchange), laporkan dalam 1 jam. Kelengkapan menyusul.",
        "Skenario 2 — Due diligence nasabah (deposit besar): backward tracing 2 hop dari address deposit — apakah sumbernya mixer/peretasan yang diketahui? Jika ya → tahan + verifikasi.",
        "Skenario 3 — Investigasi mendalam (kasus hukum): BFS penuh + label + timeline + visualisasi untuk bukti. Di sini kelengkapan > kecepatan; setiap hop didokumentasikan untuk pengadilan.",
        "Skenario 4 — Monitoring rutin: scheduled BFS dari watchlist address (peretas, mixer) tiap jam — alert jika muncul edge baru ke titik terang.",
        "Aturan praktis 10 detik: (1) tentukan arah (forward/backward); (2) tetapkan batas hop + dokumentasikan; (3) tandai visited (anti-cycle); (4) prioritaskan titik terang; (5) catat metodologi. Lima langkah = laporan yang bisa dipertahankan.",
      ],
      tasks: [],
      reference: "Arah → batas hop → visited → titik terang → dokumentasi metodologi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "2.000 ETH, 14 dompet, 20 menit, 1 corong",
      prose: [
        "Data kasus: 2.000 ETH keluar dari exchange yang diretas. Hop 1: 4 dompet (500 ETH tiap). Hop 2: 8 dompet (250 ETH tiap — kipas). Hop 3: 2 dompet penampung (1.000 ETH tiap — corong). 10 menit kemudian: deposit ke 2 exchange (satu teregulasi, satu tidak).",
        "Tindakan: tim forensik melapor ke exchange teregulasi dalam 45 menit dengan graf 3 hop → 620 ETH berhasil dibekukan. 1.380 ETH di exchange tak teregulasi + mixer = hilang. Pelajaran angka: kecepatan membekukan 31% — keterlambatan 1 jam tambahan = estimasi 0% (dana transit rata-rata < 90 menit).",
        "Pembahasan: (a) pola kipas→corong adalah 'tanda tangan' pelaku ini — cocokkan dengan kasus lama untuk atribusi; (b) kegagalan di exchange tak teregulasi = alasan memilih venue + pentingnya travel rule; (c) untuk analis: BANGUN playbook darurat SEBELUM peretasan — daftar kontak compliance exchange, template laporan, dan skrip BFS siap jalan. Krisis bukan waktu untuk menulis skrip.",
      ],
      tasks: [],
      reference: "Playbook darurat: kontak exchange + template + skrip BFS — siap SEBELUM krisis.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Taint: seberapa kotor uang ini",
      prose: [
        "BFS menemukan 6 node terjangkau dari S (lesson ini). Tapi tidak semua node `sama kotornya`. Definisikan TAINT: proporsi dana di sebuah address yang berasal dari sumber kriminal. Contoh: address F menerima 15 ETH dari S (sumber curian) + 85 ETH dari gaji yang sah → taint(F) = 15/100 = 15%. Address G menerima 15 ETH dari F (yang taint-nya 15%) → taint(G) = 15% × (15/50) = 4,5% (proporsional!). Taint MENGENCER seiring bercampur dana bersih — seperti pewarna di air.",
        "Rumus propagasi: taint(v) = Σ taint(u) × (aliran u→v / total_masuk_v). Contoh rantai: S (taint 100%) → A 80 ETH (A juga terima 20 ETH bersih → taint(A) = 80%) → B 40 ETH dari A + 60 ETH bersih → taint(B) = 80% × 40% = 32%. Dalam 2 hop, 100% → 32%. Dalam 5 hop dengan pencampuran tiap hop, taint < 5% — di bawah ambang investigasi banyak tim. Inilah mengapa penjahat SUKA mencampur: bukan menghilangkan jejak, melainkan MENGENCERKAN taint di bawah ambang.",
        "Ambang operasional: taint ≥ 50% = `terkontaminasi langsung` (bekukan/laporkan). 10–50% = `terpapar` (EDD, investigasi lanjut). < 10% = `latar` (catat, jangan kejar — biaya investigasi > nilai). Contoh keputusan: exchange menerima deposit 2 ETH dari address taint 60% → bekukan + lapor (di atas 50%). Deposit 0,1 ETH taint 8% dari 1.000 user (dusting!) → JANGAN bekukan 1.000 user (biaya CS + reputasi > nilai) — tandai dan pantau. Ambang mengubah taint dari angka menjadi KEPUTUSAN.",
        "Jebakan taint: (1) DUSTING — penjahat mengirim 0,001 ETH `kotor` ke 10.000 address agar SEMUANYA taint > 0% — jika ambangmu 0%, 10.000 user innocent ikut dibekukan! Solusi: ambang minimum + abaikan taint dari dust (< $1). (2) TAINT TIDAK = BUKTI HUKUM — taint 80% bukan berarti pemiliknya penjahat (bisa jadi korban yang menerima tanpa tahu). Taint = prioritas investigasi, BUKAN vonis. (3) MIXER me-reset taint secara teknis (taint 0% keluar) — tapi HEURISTIK (bcd12: hop_mixer) tetap menandainya. Taint + heuristik = lengkap; salah satu saja = buta sebelah.",
        "Contoh perhitungan lengkap (kasus bcd12: 80 ETH dari S): hop 1 (A): terima 80 kotor + 20 bersih → 80%. Hop 2 (B): 40 dari A + 60 bersih → 32%. Hop 3 (mixer M): 40 masuk, 38 keluar (fee 2) → taint keluar 0% (mixer) TAPI flag `hop_mixer=3`. Keputusan: kejar via heuristik mixer (bcd13!), bukan via taint (sudah 0%). Inilah mengapa investigasi butuh DUA sistem: taint untuk jalur bersih, heuristik untuk jalur mixer. Satu sistem = setengah peta.",
        "Implementasi 15 menit (sesuai lab lesson ini): setelah BFS, hitung taint per node dengan rumus propagasi (satu loop tambahan!). Output: `F: taint 15% (TERPAPAR), G: 4,5% (latar)`. Satu loop = dari `graf koneksi` menjadi `graf risiko`. Inilah bedanya visualisasi (cantik) dengan analisis (berguna).",
      ],
      formula: String.raw`taint(v) = \sum_u taint(u) \times \frac{aliran_{u \to v}}{masuk_v}`,
      formulaNote: "taint(v) = % dana kotor di address v; taint(sumber kriminal) = 100%. Taint mengencer tiap hop pencampuran. Ambang: ≥50% bekukan, 10–50% investigasi, < 10% catat. Taint = prioritas, BUKAN vonis hukum.",
      figure: {
        svg: BCD10_DEEP_SVG,
        alt: "Diagram batang taint: 100% di sumber, mengencer menjadi 80%, 32%, 9,6% per hop.",
        caption: "Cara membaca: tinggi batang = taint (% dana kotor) per hop dari sumber; garis = ambang investigasi 10%. Interpretasi: taint mengencer eksponensial lewat pencampuran — di hop 3 sudah di bawah ambang. Penjahat tidak menghilangkan jejak; mereka mengencerkannya. Kejar dengan heuristik, bukan taint buta.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: taint itu pewarna di air, bukan cap permanen",
        body: "Setetes tinta di gelas = pekat (100%). Di ember = pudar (32%). Di kolam = tak terlihat (9,6%). Penjahat mencampur bukan untuk menghilangkan — tapi untuk mengencerkan di bawah ambangmu. Jawabannya: dua sistem (taint + heuristik mixer), bukan ambang lebih rendah (yang malah menjerat korban dusting).",
      },
      reference: "Taint = prioritas investigasi, bukan vonis. Dusting: abaikan taint < $1.",
    },
    {
      id: "ml-graph-konsep",
      eyebrow: "Langkah 9 · ML pada graph",
      title: "Dari fitur graph ke machine learning",
      prose: [
        "Sejauh ini lesson ini mengajarkan investigasi MANUAL: BFS, pola corong/kipas, taint. Itu tepat untuk SATU kasus. Tapi exchange memproses ribuan address baru per hari — analis tidak bisa BFS satu per satu. Di sinilah machine learning masuk: bukan menggantikan analis, melainkan MEMERINGKAT. Dari 10.000 address, 50 mana yang paling layak diperiksa duluan? ML menjawab antrean, analis menjawab vonis.",
        "Jalan pertama: fitur buatan tangan (handcrafted) ke model tabular biasa. Ambil ukuran graph yang sudah kamu kenal dari lesson ini — derajat in/out, total aliran masuk/keluar, jarak hop ke label buruk terdekat, porsi tetangga berlabel buruk, pola corong/kipas lokal — jadikan kolom dalam tabel, masukkan ke model klasifikasi standar (logistic regression, random forest, gradient boosting). Keunggulannya: setiap fitur bisa DIJELASKAN. \"Address ini berisiko karena 60% tetangganya berlabel buruk dan jaraknya 1 hop dari mixer\" adalah kalimat yang bisa ditulis di laporan compliance — \"skor model 0,87\" bukan.",
        "Sinyal klasik fraud di dunia on-chain: fitur tetangga. \"Katakan siapa temanmu.\" Address yang rutin bertransaksi dengan address berlabel buruk (mixer, peretas yang diketahui) secara statistik jauh lebih mungkin bermasalah — seringkali ini fitur tunggal paling kuat di sistem AML. TAPI dengan catatan keras: label buruk bukan vonis. Seperti jebakan guilt by association di lesson ini — nasabah innocent bisa kebetulan menerima dari address tercemar. Fitur boleh berkata \"mirip penjahat\", keputusan tetap di manusia.",
        "Tiga penyakit label yang merusak model diam-diam. (1) Label langka: hanya kasus yang sudah diselidiki yang berlabel — 99% data tak berlabel. (2) Label terlambat: stempel \"penjahat\" ditempel berbulan-bulan setelah uangnya bergerak. (3) Kebocoran waktu (time leakage): memakai label yang DIBERIKAN di Desember sebagai fitur untuk transaksi Juni — model terlihat sempurna di uji balik, mati total di produksi karena di dunia nyata label Desember belum ada saat Juni. Obatnya: pisahkan data latih/uji berdasarkan WAKTU (latih Jan–Jun, uji Jul–Des), bukan acak. Split acak pada data transaksi = label masa depan bocor ke pelatihan.",
        "💡 Intuisi: model tabular + fitur graph = anjing pelacak yang dilatih dari catatan investigasi lama. Ia tidak tahu kebenaran — ia tahu POLA dari kasus-kasus yang dulu ditangkap analis. Kualitasnya tidak pernah melebihi kualitas label pelatihnya: label bias (dulu hanya kasus besar yang diselidiki) → model bias (hanya mengenali kasus besar).",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan 3 fitur graph dari lesson ini yang bisa jadi kolom model tabular — dan untuk tiap fitur, tulis satu kalimat penjelasan untuk laporan compliance" },
        { id: "t2", text: "Jelaskan dengan kata-katamu: mengapa split acak train/test berbahaya untuk data transaksi kripto?" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Model ML membuat investigasi objektif.\" Salah — model mengkristalkan bias label lama. Kasus yang dulu DIPILIH untuk diselidiki bukan sampel acak (biasanya kasus besar, kasus mudah, kasus yang viral). Model yang dilatih dari label itu = cermin prioritas masa lalu, bukan kebenaran objektif. Ia akan melewatkan pola baru yang dulu tidak pernah diselidiki. Obatnya: audit berkala atas kasus yang TIDAK ditangkap model (false negative review), bukan hanya yang ditangkap.",
      },
      reference: "Fitur graph → model tabular: bisa dijelaskan, butuh label bersih, split berdasarkan waktu.",
    },
    {
      id: "ml-graph-embedding",
      eyebrow: "Langkah 10 · Embedding & GNN",
      title: "Embedding & GNN pada level gagasan",
      prose: [
        "Jalan kedua: representasi yang dipelajari. Alih-alih manusia yang memutuskan fitur apa, biarkan model BELAJAR vektor untuk tiap address (node embedding): address dengan pola tetangga mirip → vektornya berdekatan. Kesamaan di sini bukan \"saldo mirip\", melainkan \"berperilaku mirip di graph\". Dua address yang sama-sama menerima dari mixer dan mengirim ke exchange dalam 1 jam akan punya vektor mirip — walau keduanya tidak pernah bertransaksi langsung satu sama lain.",
        "Graph neural network (GNN) sebagai gagasan: GNN adalah cara melatih embedding itu. Intuisinya sederhana — tiap node \"mengumpulkan pesan\" dari tetangganya (rata-rata tertimbang fitur tetangga), diulang beberapa lapis, sehingga vektor akhir sebuah node merangkum lingkungan beberapa hop di sekitarnya. Vektor itu lalu dipakai untuk klasifikasi node (berisiko / tidak). Kamu tidak perlu hafal arsitekturnya — yang penting gagasannya: representasi = ringkasan lingkungan.",
        "Kapan pendekatan berat ini layak — dan kapan tidak. Butuh BANYAK label berkualitas (ribuan, bukan puluhan) dan graph besar; hasilnya sulit dijelaskan (\"vektor dimensi 128\" bukan alasan yang bisa ditulis di laporan). Aturan praktis: mulai dari fitur tangan + model pohon. Naik ke embedding/GNN hanya bila (a) label cukup banyak dan bersih, (b) fitur tangan sudah mentok, (c) tim siap membayar biaya penjelasan — atau use case-nya deteksi dini, bukan pelaporan.",
        "Evaluasi yang jujur: analis hanya bisa memeriksa N address teratas (kapasitas investigasi terbatas). Metrik yang relevan = precision@N: dari 50 address teratas versi ranking model, berapa yang benar-benar bermasalah? Akurasi global MENIPU di sini — menebak \"aman\" untuk semua orang memberi akurasi 99% di data yang 99%-nya bersih, dan 0 kasus tertangkap. Laporkan precision@kapasitas-tim, bukan akurasi.",
        "💡 Intuisi: embedding = sidik jari perilaku. Bukan SIAPA address itu, melainkan BAGAIMANA ia bergerak di antara address lain. Dua pelaku yang tak pernah bertemu bisa punya sidik jari mirip — dan itulah yang membuatnya berguna... sekaligus berbahaya bila dipakai tanpa verifikasi manusia.",
      ],
      formula: String.raw`S(v) = w_{tetangga} \cdot p_{buruk}(v) + w_{derajat} \cdot \hat{d}(v) + w_{total} \cdot \hat{t}(v)`,
      formulaNote: "S(v) = skor risiko address v (0–1; makin besar = makin prioritas diperiksa). p_buruk(v) = porsi tetangga keluar yang berlabel buruk. d̂(v) = derajat keluar ternormalisasi (dibagi derajat maksimum). t̂(v) = total nominal keluar ternormalisasi. w = bobot (0,5 / 0,3 / 0,2): bobot terbesar di p_buruk karena sinyal tetangga paling informatif. Contoh: address A di lab punya p=0,33, d̂=1, t̂=1 → S = 0,5×0,33 + 0,3 + 0,2 = 0,67 — tertinggi, maka A diperiksa pertama.",
      tasks: [
        { id: "t1", text: "Bangun adjacency list dari `edges` (dict: node → list (tetangga, nominal))" },
        { id: "t2", text: "Hitung `fitur` per node: derajat keluar, total keluar, dan p_buruk (porsi tetangga berlabel buruk)" },
        { id: "t3", text: "Hitung `skor` dengan rumus di atas (normalisasi derajat & total terhadap maksimum, bulatkan 4 desimal)" },
        { id: "t4", text: "Urutkan `peringkat` dari skor tertinggi, cetak skor + peringkat + top-2" },
      ],
      expected: "skor={'A': 0.6667, 'B': 0.55, 'C': 0.22, 'D': 0.24, 'E': 0.14, 'F': 0.0}  peringkat=['A','B','D','C','E','F']  top-2=['A','B']",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Skor tertinggi = penjahat, tangkap.\" Salah — skor = prioritas ANTREAN investigasi, BUKAN bukti. Bahaya tambahannya: lingkaran umpan balik. Jika tim hanya menyelidiki skor tertinggi, label baru hanya lahir dari yang diselidiki → model makin yakin pada polanya sendiri (bias konfirmasi) dan makin buta pada pola baru. Obatnya: selingi antrean model dengan sampel acak/stratified yang tetap diperiksa manusia — sebagian kecil kapasitas investigasi WAJIB untuk \"yang tidak dicurigai model\".",
      },
      hints: [
        "adj = {}; untuk tiap (f,t,a): adj.setdefault(f, []).append((t, a)).",
        "semua node = gabungan semua f dan t; node tanpa outgoing edge punya fitur 0.",
        "p_buruk = (tetangga dengan labels.get(t)=='buruk') / derajat; 0 bila derajat 0.",
        "Normalisasi: bagi derajat dan total dengan nilai maksimumnya; bobot dari dict W.",
      ],
      code: {
        starter: `edges = [("A","B",5),("A","C",3),("A","D",2),("B","D",4),("B","E",1),\n         ("C","D",6),("D","F",7),("E","F",2)]\nlabels = {"B": "buruk", "E": "buruk"}\nW = {"tetangga": 0.5, "derajat": 0.3, "total": 0.2}\n\n# TULIS KODEMU`,
        lockLines: 6,
        solution: `edges = [("A","B",5),("A","C",3),("A","D",2),("B","D",4),("B","E",1),\n         ("C","D",6),("D","F",7),("E","F",2)]\nlabels = {"B": "buruk", "E": "buruk"}\nW = {"tetangga": 0.5, "derajat": 0.3, "total": 0.2}\n\n# TULIS KODEMU\nadj = {}\nfor f, t, a in edges:\n    adj.setdefault(f, []).append((t, a))\nsemua = sorted({f for f, t, a in edges} | {t for f, t, a in edges})\nfitur = {}\nfor v in semua:\n    tet = adj.get(v, [])\n    derajat = len(tet)\n    total = sum(a for _, a in tet)\n    p_buruk = sum(1 for t, _ in tet if labels.get(t) == "buruk") / derajat if derajat else 0.0\n    fitur[v] = {"derajat": derajat, "total": total, "p_buruk": p_buruk}\nmd = max(f["derajat"] for f in fitur.values())\nmt = max(f["total"] for f in fitur.values())\nskor = {}\nfor v, f in fitur.items():\n    skor[v] = round(W["tetangga"] * f["p_buruk"] + W["derajat"] * f["derajat"] / md + W["total"] * f["total"] / mt, 4)\nperingkat = sorted(skor, key=skor.get, reverse=True)\nprint("skor =", skor)\nprint("peringkat =", peringkat)\nprint("top-2 =", peringkat[:2])`,
        checks: [
          { kind: "defined", task: "t1", name: "fitur", label: "`fitur` terdefinisi", msg: "Bangun dict fitur per node dulu." },
          { kind: "equal", task: "t3", name: "skor", value: { A: 0.6667, B: 0.55, C: 0.22, D: 0.24, E: 0.14, F: 0.0 }, tol: 0, label: "`skor` sesuai rumus", msg: "Cek p_buruk, normalisasi, bobot W, dan round(..., 4)." },
          { kind: "equal", task: "t4", name: "peringkat", value: ["A", "B", "D", "C", "E", "F"], tol: 0, label: "`peringkat` benar", msg: "Urutkan dari skor tertinggi; D (0,24) di atas C (0,22)." },
          { kind: "stdout_matches", task: "t4", pattern: "top-2 = \\['A', 'B'\\]", label: "Output top-2 sesuai format", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Skor = antrean prioritas, bukan vonis. Evaluasi = precision@kapasitas-tim.",
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
        "Graf: node = address, edge berarah = transfer. Forward = ke mana pergi; backward = dari mana datang.",
        "BFS wajib: visited (anti-cycle) + batas hop (anti small-world).",
        "Corong = pengumpulan; kipas = penyebaran; rantai = forwarding. Struktur ≠ vonis.",
        "Titik terang: exchange (bekukan), mixer (pantau), sink (tunggu).",
        "Darurat: kecepatan > kelengkapan; dokumentasikan metodologi hop.",
      ],
      next: { label: "BCD11 — Risk Scoring Wallet & AML On-Chain", href: "/v2/learn/bcd11-risk" },
      quiz: [
        {
          q: "BFS tanpa batas hop dari address yang pernah transaksi dengan exchange besar. Masalahnya?",
          options: [
            { text: "Tidak ada — semakin jauh semakin baik", why: "Small-world: 6 hop dari address aktif menjangkau separuh chain = noise." },
            { text: "Small-world problem: hop jauh menjangkau hampir semua chain — hasil = noise tanpa prioritas", why: "Batas hop = anggaran investigasi yang didokumentasikan.", correct: true },
            { text: "BFS tidak bisa tanpa batas", why: "Bisa — hanya hasilnya tidak berguna." },
            { text: "Hanya lambat, tetap akurat", why: "Bukan soal kecepatan — soal relevansi yang runtuh." },
          ],
        },
        {
          q: "Pola: 50 address → 1 address dalam 10 menit. Interpretasi yang benar?",
          options: [
            { text: "Pasti pencucian uang", why: "Bisa juga payroll/airdrop — struktur saja tidak menghakimi." },
            { text: "Corong = pengumpulan; butuh konteks (siapa pengirim, kecepatan, label) sebelum menyimpulkan", why: "Struktur → hipotesis → verifikasi konteks → kesimpulan.", correct: true },
            { text: "Pasti sah", why: "Tidak bisa dipastikan tanpa konteks juga." },
            { text: "Abaikan — pola umum", why: "Corong cepat 50→1 adalah pola prioritas investigasi, bukan untuk diabaikan." },
          ],
        },
        {
          q: "Mengapa visited set wajib di BFS graf transaksi?",
          options: [
            { text: "Agar lebih cepat saja", why: "Kecepatan bonus — alasan utama kebenaran." },
            { text: "Graf transaksi punya cycle (A→B→A, umum di wash/layering) — tanpa visited = infinite loop / hitung ganda", why: "Tandai saat ditemukan, bukan saat diproses.", correct: true },
            { text: "Tidak wajib — opsional", why: "Wajib untuk graf bersiklus." },
            { text: "Hanya untuk graf besar", why: "Cycle bisa ada di graf 2 node sekalipun." },
          ],
        },
        {
          q: "Dana curian terdeteksi menuju exchange teregulasi. Tindakan terbaik?",
          options: [
            { text: "Tunggu graf 10 hop lengkap dulu (2 hari)", why: "Dana transit < 90 menit — kelengkapan = kehilangan." },
            { text: "Lapor dalam 1 jam dengan graf 2–3 hop — kecepatan membekukan dana", why: "31% vs 0%: kecepatan adalah strateginya.", correct: true },
            { text: "Umumkan di media sosial", why: "Memberi tahu pelaku = membantunya kabur." },
            { text: "Blokir semua nasabah exchange itu", why: "Menghukum orang tak bersalah — bukan pelaku." },
          ],
        },
        {
          q: "Dalam lab, mengapa E dan M TIDAK masuk reach (3 hop)?",
          options: [
            { text: "Karena tidak terhubung ke S", why: "Terhubung — via D di hop 4." },
            { text: "Karena butuh 4 hop (S→A→C→D→E) — di luar anggaran 3 hop", why: "Batas hop memangkas jangkauan; E/M prioritas lebih rendah.", correct: true },
            { text: "Karena nominalnya kecil", why: "BFS tidak memfilter nominal." },
            { text: "Karena BFS salah", why: "BFS benar — batasnyalah yang memangkas." },
          ],
        },
        {
          q: "Exchange menerima 1.000 deposit @0,1 ETH, masing-masing taint 8% (pola dusting dari satu sumber). Tindakan TEPAT?",
          options: [
            { text: "Bekukan semua — taint > 0% = kotor", why: "Ambang 0% + dusting = 1.000 user innocent dibekukan. Biaya CS + reputasi + hukum JAUH di atas nilai 100 ETH. Ini tepat yang diinginkan penyerang dusting." },
            { text: "Jangan bekukan; tandai + pantau. Taint 8% < ambang 10%, pola dusting jelas", why: "Tepat. Di bawah ambang investigasi + pola dusting (< $1 per address dari satu sumber) = abaikan sebagai taint, catat sebagai intel. Bekukan hanya ≥50% atau pola non-dusting ≥10%.", correct: true },
            { text: "Abaikan total — taint kecil tidak penting", why: "`Abaikan total` ≠ `tandai dan pantau`. Pola dusting adalah INTEL (sumbernya mungkin pelaku) — catat untuk investigasi sumbernya, bukan korbannya." },
            { text: "Naikkan ambang menjadi 50% agar tidak ada yang dibekukan", why: "Menaikkan ambang ke 50% membuat taint 32–49% (hop 2!) lolos — penjahat sungguhan bebas. Ambang 10% sudah benar; yang salah adalah ambang 0%." },
          ],
        },
      ],
    },
  ],
};
