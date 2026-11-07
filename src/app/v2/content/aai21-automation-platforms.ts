import type { V2Lesson } from "../lib/types";

// Ilustrasi: corong workflow 10 event → 5 lolos filter → 3 draft dibuat; dan biaya per 1.000 event.
const CORONG_SVG = `<svg viewBox="0 0 480 250" role="img" aria-label="Corong: 10 event masuk, 5 lolos filter, 3 draft dibuat. Biaya per 1.000 event: platform penuh Rp300 ribu vs hybrid Rp170 ribu.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="40" y="30" width="400" height="34" rx="8" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)"/><text x="240" y="52" font-size="12" fill="var(--text)">10 event masuk (trigger)</text>
<polygon points="240,64 200,100 280,100" fill="var(--c2)" fill-opacity="0.35" stroke="var(--c2)"/><text x="240" y="92" font-size="11" fill="var(--text)">5 lolos filter</text>
<rect x="170" y="108" width="140" height="30" rx="8" fill="var(--c3)" fill-opacity="0.3" stroke="var(--c3)"/><text x="240" y="128" font-size="11" fill="var(--text)">3 butuh draft (node AI)</text>
<rect x="195" y="146" width="90" height="30" rx="8" fill="var(--c4)" fill-opacity="0.3" stroke="var(--c4)"/><text x="240" y="166" font-size="11" fill="var(--text)">3 draft dibuat</text>
</g>
<text x="240" y="200" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Biaya per 1.000 event:</text>
<rect x="120" y="208" width="100" height="14" fill="var(--c1)"/><text x="170" y="219" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Rp300 rb</text>
<text x="105" y="219" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">penuh:</text>
<rect x="300" y="208" width="57" height="14" fill="var(--c2)"/><text x="328" y="219" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Rp170 rb</text>
<text x="285" y="219" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">hybrid:</text>
</svg>`;

export const aai21: V2Lesson = {
  slug: "aai21-automation-platforms",
  track: "Agentic AI Engineer",
  module: "Produksi Agen",
  title: "AAI21 — Automation Platforms: n8n, Make, Zapier untuk AI Automation",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Tidak semua otomasi AI harus ditulis sebagai kode — dan tidak semua otomasi boleh selamanya tinggal di platform visual. Lesson ini tentang platform automation (n8n, Make, Zapier): kapan ia alat tercepat di dunia, kapan ia menjadi pajak bulanan, dan bagaimana pola hybrid memberi yang terbaik dari keduanya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan anatomi workflow automation: trigger, filter, node AI, dan aksi; (2) menghitung biaya SEBENARNYA otomasi platform — termasuk biaya ganda node AI (platform + LLM); (3) menerapkan kriteria kapan platform cukup dan kapan harus menulis kode; (4) menjelaskan risiko lock-in dan merancang pola hybrid (platform untuk glue, kode untuk logika inti); (5) membangun simulasi workflow 4 node dan mengestimasi biayanya per 1.000 eksekusi.",
        "Daftar isi: 1) Peta · 2) Cerita: otomasi Rp10 juta/bulan yang diganti 60 baris kode · 3) Anatomi workflow automation · 4) Biaya ganda yang tak terlihat · 5) Kapan platform cukup, kapan tulis kode · 6) Lab: simulasi workflow 4 node · 7) Lock-in dan pola hybrid · 8) Peta keputusan · 9) Mini-case · 10) Checkpoint.",
        "Bekal ringkas (self-contained): kamu tahu agen bekerja dalam loop dan setiap langkah bisa memakan token. Di lesson ini “langkah”-nya adalah node dalam workflow visual — dan setiap node punya harga. Tidak ada prasyarat lain.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Otomasi Rp10 juta/bulan yang diganti 60 baris kode",
      prose: [
        "SapaTim, SaaS helpdesk di Yogyakarta, membangun triase tiket otomatis di platform workflow visual: tiket baru (trigger) → filter bahasa & prioritas → node AI mengklasifikasikan → aksi membuat draft balasan. Dibangun dalam 3 hari tanpa menulis kode — demo ke investor mulus, tim CS menghemat 2 jam per hari. Semua orang senang.",
        "Enam bulan kemudian volume naik 5×: 40.000 tiket per bulan. Tagihan platform: Rp10 juta per bulan — dan naik terus. Tim engineering menatap workflow itu dan menyadari sesuatu: 90% “kecerdasan”-nya hanyalah filter (bahasa Indonesia? prioritas tinggi?) dan satu klasifikasi teks sederhana. Mereka menulis ulang inti logika dalam 60 baris Python di server Rp300 ribu per bulan; platform tinggal dipakai untuk trigger dan aksi (bagian “glue” yang memang keunggulannya). Tagihan turun ke Rp3,2 juta.",
        "Twist-nya: platform itu tidak pernah “salah”. Ia adalah alat prototyping tercepat yang pernah ada — 3 hari dari nol ke produksi adalah keajaiban yang tidak bisa ditandingi kode. Yang salah adalah tidak punya KRITERIA KAPAN PINDAH: tim memperlakukan solusi sementara (prototipe) sebagai arsitektur permanen, dan membayar pajak prototyping setiap bulan selama setengah tahun.",
        "Pelajaran yang lebih tajam: biaya platform bukan hanya tagihannya. Selama 6 bulan itu, setiap perubahan logika harus diklik lewat UI — tidak ada code review, tidak ada test otomatis, tidak ada git blame saat klasifikasi salah. “Tidak menulis kode” ternyata berarti “tidak punya test, tidak punya review, tidak punya sejarah”.",
        "Dua pola yang akan kamu kenali di lesson ini. Pola 1: pajak prototyping — solusi cepat yang tidak pernah “lulus” menjadi permanen. Pola 2: biaya ganda node AI — kamu membayar platform PER EKSEKUSI dan membayar LLM PER TOKEN, dan keduanya naik bersamaan saat volume naik.",
      ],
      note: {
        title: "💡 Intuisi: platform automation itu kontraktor renovasi",
        body: "Butuh dapur jadi dalam seminggu? Panggil kontraktor (platform): cepat, rapi, mahal per proyek. Butuh dapur yang disesuaikan tiap bulan selama 5 tahun? Pekerjakan tukang sendiri (kode): lambat di awal, murah dan fleksibel selamanya. Kebanyakan tim membutuhkan KEDUANYA — kontraktor untuk mulai, tukang untuk menetap. Yang bangkrut adalah yang memakai kontraktor untuk renovasi abadi.",
      },
      tasks: [],
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi workflow automation: trigger, filter, node AI, aksi",
      prose: [
        "Setiap workflow automation — apapun platformnya — punya empat peran yang sama. TRIGGER: “kapan workflow berjalan” — tiket baru masuk, baris baru di spreadsheet, pesan baru di Slack, jadwal tiap jam. Trigger yang buruk (polling tiap menit ke API yang tidak berubah) = membayar untuk tidak terjadi apa-apa.",
        "FILTER: “apakah event ini layak diproses” — bahasa Indonesia? prioritas tinggi? dari pelanggan berbayar? Filter adalah PENJAGA GERBANG termurah: ia berjalan sebelum node mahal (AI), jadi setiap event yang ia tolak = satu panggilan LLM yang tidak dibayar. Urutan filter menentukan tagihan — filter murah dulu, AI terakhir.",
        "NODE AI: “apa keputusan cerdasnya” — klasifikasi, ekstraksi, ringkasan, draf balasan. Node ini unik karena biayanya GANDA: platform menagih eksekusi node, provider LLM menagih token. Ia juga satu-satunya node yang NON-DETERMINISTIK: input sama bisa memberi output beda — maka outputnya butuh validasi (ingat AAI18: skema + tiga lapis).",
        "AKSI: “apa yang terjadi di dunia” — buat draft, kirim email, update CRM, panggil webhook. Aksi adalah satu-satunya node yang BERDAMPAK: salah di sini = email terkirim ke orang yang salah. Maka aksi destruktif butuh gerbang persetujuan manusia — “otomatis penuh” untuk kirim email massal adalah bom waktu.",
        "Kepribadiannya: workflow seperti jalur perakitan pabrik. Trigger adalah ban berjalan yang membawa bahan (event); filter adalah quality control yang membuang bahan cacat SEBELUM masuk mesin mahal; node AI adalah mesin presisi yang kadang salah cetak (butuh inspeksi); aksi adalah gudang pengiriman — sekali barang keluar, tidak bisa ditarik kembali.",
        "Kapan tiap peran menjadi kritis: trigger saat volume > ribuan per hari (polling boros vs webhook); filter saat < 50% event layak diproses (tanpanya kamu membayar AI untuk sampah); validasi output AI saat outputnya dibaca mesin/aksi; gerbang manusia saat aksi tak terbalikkan.",
      ],
      note: {
        title: "Miskonsepsi: “No-code berarti tidak perlu engineering”",
        type: "pitfall",
        body: "Yang benar: no-code menghilangkan KODE, bukan menghilangkan ENGINEERING. Kamu tetap butuh: desain (urutan node), testing (apa yang terjadi bila API down?), observability (node mana yang gagal semalam?), dan versioning (siapa mengubah filter kemarin?). Tanpa itu semua, kamu bukan “tanpa engineering” — kamu engineering tanpa alat keselamatan.",
      },
      tasks: [],
      reference: "Trigger → filter (murah dulu) → node AI (validasi output) → aksi (gerbang manusia untuk yang tak terbalikkan).",
    },
    {
      id: "biaya-ganda",
      eyebrow: "Langkah 4 · Konsep",
      title: "Biaya ganda yang tak terlihat",
      prose: [
        "Tagihan platform terlihat sederhana: RpX per eksekusi. Tetapi node AI menyembunyikan pengganda: setiap eksekusi yang mencapai node AI JUGA membayar token LLM. Total per event = biaya eksekusi platform + (probabilitas mencapai node AI × biaya token). Saat volume naik 5×, KEDUANYA naik 5× — dan tidak ada diskon volume yang otomatis.",
        "Rumus biaya bulanannya:",
        "Contoh dari lab langkah 6: 10 event, biaya eksekusi Rp250, 5 mencapai node AI @ Rp100. Total = 10 × 250 + 5 × 100 = Rp3.000 → Rp300 ribu per 1.000 event. Bila filter diperketat sehingga hanya 2 mencapai node AI: 10 × 250 + 2 × 100 = Rp2.700 → Rp270 ribu. Filter bukan sekadar kerapian — ia tuas biaya langsung.",
        "Cara membaca bagan: corong menunjukkan 10 event → 5 lolos filter → 3 butuh draft. Batang bawah: “penuh” (semua logika di platform) = Rp300 ribu per 1.000 event; “hybrid” (filter + klasifikasi pindah ke kode Rp300 rb/bulan server, platform tinggal trigger+aksi) = Rp170 ribu per 1.000 event. Interpretasi: memindahkan SATU node termahal ke kode memangkas 43% — karena node AI adalah satu-satunya yang biayanya ganda.",
        "Tiga biaya tersembunyi lainnya. (1) Biaya PERCOBAAN: tiap klik “test” di editor = eksekusi berbayar. Tim yang sering trial-and-error di editor production bisa membayar ratusan ribu untuk debugging. (2) Biaya POLLING: trigger polling tiap menit ke API = 43.200 eksekusi per bulan MESKI tidak ada event. (3) Biaya PERUBAHAN: mengubah logika = klik UI manual, tanpa test otomatis — satu klik salah di filter = ribuan event salah proses sebelum ketahuan.",
        "Kepribadiannya: biaya platform seperti tagihan listrik kos. Tarif per kWh (eksekusi) terlihat kecil — sampai kamu sadar AC (node AI) menyala 24 jam, lampu teras (polling) tidak pernah dimatikan, dan kamu tidak punya meteran per kamar (observability). Tagihan besar tidak datang dari tarifnya, melainkan dari tidak adanya saklar.",
      ],
      formula: String.raw`C_{bulan} = V \cdot (c_{eks} + p_{AI} \cdot c_{AI})`,
      formulaNote: "C_bulan = total biaya per bulan (Rp). V = volume event per bulan; c_eks = biaya platform per eksekusi; p_AI = fraksi event yang mencapai node AI (0–1) — DITENTUKAN oleh filtermu; c_AI = biaya token LLM per panggilan node AI. Contoh lab: V=10, c_eks=250, p_AI=0,5, c_AI=100 → 10 × (250 + 50) = Rp3.000.",
      figure: {
        svg: CORONG_SVG,
        alt: "Corong workflow 10 event menjadi 5 lolos filter dan 3 draft; biaya penuh Rp300 ribu vs hybrid Rp170 ribu per 1.000 event.",
        caption: "Cara membaca: corong = aliran event; batang = biaya per 1.000 event. Interpretasi: filter menentukan p_AI — tuas biaya paling murah; memindahkan node AI ke kode (hybrid) memangkas biaya ganda.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: “Platform mengenakan biaya sekali per workflow”",
        type: "pitfall",
        body: "Yang benar: platform menagih per EKSEKUSI (sering per node!), dan node AI menagih token di atasnya. Satu workflow 4 node yang berjalan 40.000×/bulan bisa berarti 160.000 penagihan node + 20.000 panggilan LLM. Selalu hitung dengan V × (c_eks + p_AI × c_AI), bukan dengan “RpX per bulan kayaknya”.",
      },
      reference: "Biaya = volume × (eksekusi + fraksi-ke-AI × token). Filter mengendalikan fraksi — filter adalah tuas biaya.",
    },
    {
      id: "kapan-kode",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan platform cukup, kapan harus menulis kode",
      prose: [
        "Keputusan ini bukan soal gengsi (“tim serius menulis kode”) melainkan soal KRITERIA. Tetap di PLATFORM bila: (1) volume < ~10 ribu eksekusi/bulan (pajak prototyping masih murah); (2) logika sederhana dan stabil (if-then, format ulang); (3) keunggulan platform dipakai penuh — konektor SaaS siap pakai yang butuh berminggu-minggu bila ditulis sendiri; (4) tim non-engineering yang memelihara.",
        "PINDAH KE KODE bila: (1) volume > ~50 ribu/bulan dan naik (pajak > gaji server); (2) logika butuh testing — cabang kompleks, edge case banyak, regresi harus dicegah; (3) butuh code review & git history (kepatuhan, audit, tim > 3 orang); (4) latensi kritis (platform menambah detik per node); (5) data sensitif yang tidak boleh transit di pihak ketiga.",
        "Dan ada jalan ketiga — HYBRID, yang dipakai SapaTim: platform untuk GLUE (trigger dari 20 SaaS, aksi kirim ke Slack/CRM — konektor yang mahal ditulis ulang), kode untuk INTI (filter, klasifikasi, keputusan — logika yang butuh test dan berubah sering). Hybrid memberi kecepatan konektor + kedisiplinan kode.",
        "Aturan migrasi yang aman: JANGAN rewrite big-bang. Pindahkan SATU node termahal/terpenting dulu (biasanya node AI), jalankan paralel 2 minggu dengan perbandingan output (shadow mode), baru alihkan trafik. SapaTim memindahkan klasifikasi dulu — trigger dan aksi tetap di platform selama 3 bulan berikutnya tanpa masalah.",
        "Kepribadiannya: seperti memilih antara sewa apartemen, beli rumah, atau sewa apartemen + bangun workshop di garasi (hybrid). Sewa (platform) fleksibel untuk awal; beli (kode) masuk akal saat menetap; hybrid untuk yang butuh keduanya. Yang rugi adalah penyewa 10 tahun yang tidak pernah menghitung.",
      ],
      note: {
        title: "💡 Intuisi: hitung “titik impas” sebelum memilih",
        body: "Titik impas = (biaya migrasi satu kali) / (penghematan per bulan). Bila migrasi butuh 2 minggu engineer (Rp20 juta) dan menghemat Rp6,8 juta/bulan, impas dalam 3 bulan — setelah itu murni untung. Keputusan “tetap vs pindah” yang tidak memakai angka ini hanyalah opini berbaju arsitektur.",
      },
      tasks: [],
      reference: "Platform untuk glue & volume kecil; kode untuk inti, volume besar, dan yang butuh test; hybrid = konektor platform + logika kode.",
    },
    {
      id: "lab-workflow",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: simulasi workflow 4 node",
      prose: [
        "Kamu membangun workflow SapaTim dalam miniatur: 10 event tiket masuk. Node 1 TRIGGER (semua event lewat), node 2 FILTER (bahasa Indonesia DAN prioritas tinggi), node 3 AI (tiruan: teks mengandung “segera” atau “batal” → “mendesak”, selain itu “biasa”), node 4 AKSI (buat draft balasan hanya untuk yang “mendesak”).",
        "Biaya: tiap event membayar BIAYA_EKSEKUSI (Rp250); tiap event yang mencapai node AI membayar BIAYA_AI (Rp100). Tugasmu: hitung `lolos_ids` (lolos filter), `draft_ids` (dapat draft), dan `biaya_total`, lalu cetak ringkasannya.",
        "Coba eksplorasi setelah selesai: ubah filter menjadi hanya prioritas “tinggi” (tanpa syarat bahasa). Berapa biaya_total kini? (8 × 250 + 8 × 100 = Rp2.800 — filter yang longgar = p_AI naik = tagihan naik.) Eksperimen kedua: naikkan BIAYA_AI menjadi 500 (model lebih besar). Node mana yang paling ingin kamu pindahkan ke kode? (Node AI — satu-satunya yang biayanya ganda.)",
      ],
      tasks: [
        { id: "t1", text: "Terapkan filter (bahasa “id” DAN prioritas “tinggi”) → isi `lolos_ids`" },
        { id: "t2", text: "Klasifikasikan yang lolos (kata “segera”/“batal” → “mendesak” → draft); hitung `biaya_total`; cetak ringkasan" },
      ],
      expected: "lolos=5 draft=3 biaya=Rp3000",
      note: {
        title: "Kaitan ke produksi",
        type: "risk",
        body: "Di produksi, lab ini menjadi kalkulator bisnis: ganti 10 event contoh dengan volume NYATAmu (V), ganti Rp250/Rp100 dengan tarif platform dan token NYATAmu, dan kamu punya estimasi tagihan sebelum menandatangani — plus titik impas migrasi ke hybrid.",
      },
      hints: [
        "Filter: e[1] == \"id\" dan e[2] == \"tinggi\" — event adalah tuple (id, bahasa, prioritas, teks).",
        "Klasifikasi: cek \"segera\" atau \"batal\" di teks.lower() — hanya untuk yang lolos filter.",
        "biaya_total = len(events) × BIAYA_EKSEKUSI + len(lolos_ids) × BIAYA_AI.",
      ],
      code: {
        starter: `# ===== DATA — jangan diubah =====
events = [
    ("E1", "id", "tinggi", "Tolong, pesanan saya belum datang, SEGERA dibantu"),
    ("E2", "id", "rendah", "Terima kasih atas layanannya"),
    ("E3", "en", "tinggi", "Please cancel my order immediately"),
    ("E4", "id", "tinggi", "Mau tanya jam buka toko"),
    ("E5", "id", "tinggi", "Saya mau BATAL langganan, proses segera"),
    ("E6", "id", "sedang", "Ada promo apa bulan ini?"),
    ("E7", "id", "tinggi", "Komplain: barang rusak, minta ganti SEGERA"),
    ("E8", "en", "tinggi", "Urgent: refund now"),
    ("E9", "id", "tinggi", "Kapan restock varian biru?"),
    ("E10", "id", "rendah", "Packing rapi, thanks"),
]
BIAYA_EKSEKUSI = 250  # Rp per event yang masuk workflow
BIAYA_AI = 100        # Rp per panggilan node AI
# TULIS KODEMU di bawah garis ini.
# t1: filter bahasa "id" DAN prioritas "tinggi" -> lolos_ids (list id).
# t2: yang lolos: teks mengandung "segera"/"batal" (abaikan kapital) -> "mendesak"
#     -> draft_ids (list id). biaya_total = len(events)*BIAYA_EKSEKUSI + len(lolos_ids)*BIAYA_AI.
#     Cetak: lolos=X draft=Y biaya=RpZ
# =================================`,
        lockLines: 16,
        solution: `# ===== DATA — jangan diubah =====
events = [
    ("E1", "id", "tinggi", "Tolong, pesanan saya belum datang, SEGERA dibantu"),
    ("E2", "id", "rendah", "Terima kasih atas layanannya"),
    ("E3", "en", "tinggi", "Please cancel my order immediately"),
    ("E4", "id", "tinggi", "Mau tanya jam buka toko"),
    ("E5", "id", "tinggi", "Saya mau BATAL langganan, proses segera"),
    ("E6", "id", "sedang", "Ada promo apa bulan ini?"),
    ("E7", "id", "tinggi", "Komplain: barang rusak, minta ganti SEGERA"),
    ("E8", "en", "tinggi", "Urgent: refund now"),
    ("E9", "id", "tinggi", "Kapan restock varian biru?"),
    ("E10", "id", "rendah", "Packing rapi, thanks"),
]
BIAYA_EKSEKUSI = 250  # Rp per event yang masuk workflow
BIAYA_AI = 100        # Rp per panggilan node AI
# TULIS KODEMU di bawah garis ini.
# t1: filter bahasa "id" DAN prioritas "tinggi" -> lolos_ids (list id).
# t2: yang lolos: teks mengandung "segera"/"batal" (abaikan kapital) -> "mendesak"
#     -> draft_ids (list id). biaya_total = len(events)*BIAYA_EKSEKUSI + len(lolos_ids)*BIAYA_AI.
#     Cetak: lolos=X draft=Y biaya=RpZ
# =================================
lolos_ids = [e[0] for e in events if e[1] == "id" and e[2] == "tinggi"]
draft_ids = []
for e in events:
    if e[0] in lolos_ids and ("segera" in e[3].lower() or "batal" in e[3].lower()):
        draft_ids.append(e[0])
biaya_total = len(events) * BIAYA_EKSEKUSI + len(lolos_ids) * BIAYA_AI
print(f"lolos={len(lolos_ids)} draft={len(draft_ids)} biaya=Rp{biaya_total}")`,
        checks: [
          { kind: "defined", task: "t1", name: "lolos_ids", label: "`lolos_ids` terdefinisi", msg: "Buat list lolos_ids berisi ID event yang lolos filter." },
          { kind: "equal", task: "t1", name: "lolos_ids", value: ["E1", "E4", "E5", "E7", "E9"], label: "5 event lolos filter", msg: "Bahasa id + prioritas tinggi: E1, E4, E5, E7, E9. E3/E8 gugur karena bahasa en." },
          { kind: "equal", task: "t2", name: "draft_ids", value: ["E1", "E5", "E7"], label: "3 draft dibuat", msg: "Yang mengandung “segera”/“batal”: E1 (SEGERA), E5 (BATAL+segera), E7 (SEGERA)." },
          { kind: "equal", task: "t2", name: "biaya_total", value: 3000, label: "biaya total Rp3.000", msg: "10×250 + 5×100 = 3.000." },
          { kind: "stdout_matches", task: "t2", pattern: "lolos=5 draft=3 biaya=Rp3000", label: "ringkasan tercetak sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Filter menentukan p_AI; biaya = V × (c_eks + p_AI × c_AI). Node termahal = kandidat pertama migrasi.",
    },
    {
      id: "lockin",
      eyebrow: "Langkah 7 · Konsep",
      title: "Lock-in dan pola hybrid yang tahan lama",
      prose: [
        "LOCK-IN punya tiga wajah. Wajah 1 — DATA: riwayat eksekusi, log, dan konfigurasi workflow tinggal di platform; pindah berarti kehilangan sejarah (atau ekspor manual yang menyakitkan). Wajah 2 — KONEKTOR: 20 integrasi SaaS yang “tinggal klik” di platform = 20 integrasi yang harus ditulis ulang bila pindah. Wajah 3 — KETERAMPILAN: tim yang hanya bisa klik UI tidak bisa memelihara kode — migrasi berarti melatih ulang orang, bukan sekadar memindahkan workflow.",
        "Mitigasi yang realistis (bukan “hindari platform sama sekali”): (1) simpan KONFIGURASI sebagai kode — n8n mendukung export/import JSON workflow yang bisa di-version di git; (2) bungkus node AI dengan FUNGSI yang bisa dipindah — prompt dan logika klasifikasi tinggal di satu tempat yang terdokumentasi, bukan tersebar di 15 node; (3) pisahkan GLUE dari INTI sejak hari pertama — konektor di platform, keputusan di kode (atau minimal di satu fungsi terpusat).",
        "POLA HYBRID yang dipakai SapaTim, langkah demi langkah: (a) identifikasi node termahal (node AI: Rp6,8 juta/bulan dari total Rp10 juta); (b) tulis ulang node itu sebagai microservice kecil (60 baris Python + FastAPI); (c) ganti node AI di workflow dengan node HTTP call ke service-mu — workflow tetap jalan, hanya satu node yang “menelpon keluar”; (d) jalankan paralel 2 minggu, bandingkan output; (e) alihkan. Risiko big-bang = nol, karena platform tetap menjadi orkestranya.",
        "Kepribadiannya: hybrid seperti restoran yang menyewa gedung (platform) tetapi membawa koki sendiri (kode). Gedungnya standar — siapa pun bisa sewa; kokinya istimewa — resepnya milikmu, bisa pindah gedung kapan saja. Lock-in terjadi bukan karena gedungnya, melainkan karena kamu membiarkan resepmu ditulis di dinding gedung orang.",
        "Kapan hybrid menjadi WAJIB: saat logika inti berubah > 1× per bulan (klik UI tidak ter-version), saat ada > 1 environment (dev/staging/prod tidak bisa di-klik dua kali dengan konsisten), atau saat regulasi menuntut audit trail perubahan (git log = bukti, “saya klik kemarin” bukan bukti).",
      ],
      note: {
        title: "Miskonsepsi: “Nanti saja dipindah kalau sudah besar”",
        type: "pitfall",
        body: "Yang benar: “nanti” adalah saat lock-in PALING kuat — 200 workflow, 3 tahun sejarah, tim yang hanya bisa klik. Biaya migrasi naik eksponensial dengan waktu, sementara penghematan bulanan tetap. Waktu termurah untuk merancang kemampuan pindah adalah HARI PERTAMA: export JSON ke git, pisahkan inti dari glue. Opsi pindah yang tidak dirancang = opsi yang tidak ada.",
      },
      tasks: [],
      reference: "Anti lock-in: konfigurasi di git, inti logika terpusat & terdokumentasi, glue di platform. Migrasi bertahap via HTTP call.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Memilih alat otomasi yang tepat",
      prose: [
        "Skenario 1 — Butuh jalan dalam hitungan hari, volume kecil (< 10 ribu/bulan): platform penuh. Kecepatan mengalahkan segalanya di tahap ini.",
        "Skenario 2 — Volume > 50 ribu/bulan dan naik: hitung titik impas; hampir pasti hybrid atau kode penuh lebih murah dalam 3–6 bulan.",
        "Skenario 3 — Banyak konektor SaaS (20+ integrasi): platform untuk glue — menulis 20 konektor sendiri adalah pekerjaan sia-sia.",
        "Skenario 4 — Logika butuh test, review, dan audit: kode untuk inti — klik UI tidak bisa di-code-review.",
        "Skenario 5 — Data sensitif / regulasi: kode di infrastruktur sendiri; platform hanya bila ada jaminan pemrosesan data yang jelas (DPA) dan node AI tidak melatih model dari datamu.",
        "Aturan praktis 10 detik sebelum membangun otomasi: (1) Berapa V per bulan 6 bulan dari sekarang? → hitung C_bulan. (2) Node mana yang biayanya ganda? → kandidat migrasi pertama. (3) Bisakah konfigurasi ini masuk git? → bila tidak, rancang dari sekarang. (4) Apa yang terjadi bila platform naik harga 2× besok? → bila jawabannya panik, kamu sudah lock-in. Empat pertanyaan, nol SapaTim.",
      ],
      tasks: [],
      reference: "Hitung C_bulan dengan V masa depan; pindahkan node termahal dulu; git sejak hari pertama.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "TokoLaris: 120.000 pesan/bulan, chatbot setengah otomatis",
      prose: [
        "TokoLaris memakai platform untuk chatbot WA: 120.000 pesan per bulan. Workflow: trigger pesan masuk → filter spam → node AI (klasifikasi maksud) → aksi (jawab template / teruskan ke agen manusia). Tarif platform Rp200 per eksekusi; node AI Rp150 per panggilan (token). Filter meloloskan 70% (p_AI = 0,7).",
        "Pertanyaan analisis. (a) Hitung C_bulan dengan rumus langkah 4. (b) Tim mengusulkan hybrid: filter + klasifikasi pindah ke kode (server Rp1 juta/bulan), platform tinggal trigger + aksi @ Rp120 per eksekusi (tanpa node AI di platform). Hitung biaya hybrid per bulan. (c) Bila migrasi butuh 3 minggu engineer senilai Rp30 juta, berapa bulan titik impasnya? (d) Satu risiko hybrid yang harus dimitigasi.",
        "Pembahasan. (a) C = 120.000 × (200 + 0,7 × 150) = 120.000 × 305 = Rp36.600.000 per bulan. (b) Hybrid: 120.000 × 120 + 1.000.000 (server) + biaya token LLM tetap 84.000 panggilan × 150 = 12.600.000 → total = 14.400.000 + 1.000.000 + 12.600.000 = Rp28.000.000. Hemat Rp8,6 juta/bulan. (c) 30.000.000 / 8.600.000 ≈ 3,5 bulan. (d) Risiko: konektor WA tetap di platform — bila platform gangguan, chatbot mati total; mitigasi: health check + fallback antrean, dan kontrak SLA yang jelas. Atau: logika klasifikasi di kode butuh test & monitoring sendiri — jangan pindahkan tanpa observability.",
        "Pelajaran yang lebih dalam: perhatikan bahwa token LLM (Rp12,6 juta) TIDAK hilang dalam hybrid — ia pindah mengikuti node AI. Penghematan murni dari menghapus “pajak platform” atas node termahal. Inilah cara membaca setiap proposal migrasi: pisahkan biaya yang HILANG dari biaya yang PINDAH.",
      ],
      tasks: [],
      note: {
        title: "Pelajaran mini-case",
        type: "risk",
        body: "Migrasi yang jujur membedakan biaya yang hilang vs biaya yang pindah. Token LLM pindah mengikuti node AI ke manapun ia pergi — yang hilang hanyalah margin platform. Proposal migrasi yang mengklaim “menghemat Rp36,6 juta” berbohong; yang benar: menghemat Rp8,6 juta per bulan dengan impas 3,5 bulan.",
      },
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
        "Workflow automation = trigger → filter (murah dulu) → node AI (validasi output) → aksi (gerbang manusia untuk tak-terbalikkan).",
        "Biaya = V × (c_eks + p_AI × c_AI) — node AI biayanya ganda; filter adalah tuas biaya termurah.",
        "Platform untuk glue & volume kecil; kode untuk inti, volume besar, dan yang butuh test; hybrid = konektor platform + logika kode.",
        "Anti lock-in: konfigurasi di git, inti terpusat & terdokumentasi; migrasi bertahap via HTTP call + shadow mode.",
        "Keputusan memakai angka: hitung C_bulan dengan V masa depan + titik impas migrasi.",
        "Aturan 10 detik: V 6 bulan lagi? node termahal? masuk git? siap harga naik 2×?",
      ],
      next: { label: "AAI22 — Katalog Pola Desain Agen: ReAct, Reflection, Routing & Evaluator-Optimizer", href: "/v2/learn/aai22-pola-desain-agen" },
      quiz: [
        {
          q: "SapaTim membayar Rp10 juta/bulan untuk workflow yang intinya hanya filter + satu klasifikasi. Pelajaran utamanya?",
          options: [
            { text: "Platform automation selalu terlalu mahal — hindari sepenuhnya", why: "Platform membangunnya dalam 3 hari — tanpa itu tidak ada validasi pasar secepat itu.", correct: false },
            { text: "Tidak punya kriteria kapan pindah: prototipe diperlakukan sebagai arsitektur permanen", why: "Tepat — pajak prototyping dibayar tiap bulan karena tidak ada titik impas yang dihitung.", correct: true },
            { text: "Timnya kurang pintar memakai platform", why: "Workflow-nya bekerja dengan baik; masalahnya ekonomi, bukan keterampilan.", correct: false },
            { text: "Seharusnya memakai platform yang lebih murah sejak awal", why: "Platform murah pun punya pajak yang sama — masalahnya bukan merek, melainkan ketiadaan kriteria pindah.", correct: false },
          ],
        },
        {
          q: "120.000 event/bulan, c_eks Rp200, p_AI 0,7, c_AI Rp150. C_bulan?",
          options: [
            { text: "Rp24.000.000 (120.000 × 200)", why: "Lupa komponen token: 70% event juga membayar Rp150 ke LLM.", correct: false },
            { text: "Rp36.600.000 = 120.000 × (200 + 0,7 × 150)", why: "Tepat — biaya ganda node AI wajib masuk hitungan.", correct: true },
            { text: "Rp42.000.000 (120.000 × 350)", why: "350 = 200 + 150 mengasumsikan SEMUA event mencapai node AI (p_AI = 1), padahal 0,7.", correct: false },
            { text: "Rp18.000.000 (hanya token LLM)", why: "Lupa biaya eksekusi platform — kedua komponen selalu dijumlahkan.", correct: false },
          ],
        },
        {
          q: "Filter meloloskan 90% event ke node AI padahal hanya 30% yang benar-benar butuh. Dampaknya?",
          options: [
            { text: "Tidak ada — node AI menangani sisanya dengan baik", why: "Setiap event berlebih membayar c_AI penuh tanpa manfaat.", correct: false },
            { text: "Biaya token 3× lipat dari yang seharusnya — filter adalah tuas biaya", why: "Tepat — p_AI 0,9 vs 0,3 = 3× biaya token; memperketat filter adalah penghematan termurah.", correct: true },
            { text: "Hanya latensi yang naik sedikit", why: "Latensi naik, tetapi yang dominan adalah tagihan token yang membengkak.", correct: false },
            { text: "Workflow menjadi lebih akurat", why: "Event yang tidak butuh AI tidak menjadi lebih akurat karena diproses AI.", correct: false },
          ],
        },
        {
          q: "Kapan pindah logika inti ke kode menjadi keputusan yang benar?",
          options: [
            { text: "Sejak hari pertama — kode selalu lebih baik", why: "Hari pertama butuh kecepatan validasi; platform membangun dalam hitungan hari.", correct: false },
            { text: "Saat volume × pajak platform melewati titik impas migrasi, atau saat butuh test/review/audit", why: "Tepat — keputusan memakai angka (titik impas) dan kebutuhan engineering (test, review).", correct: true },
            { text: "Tidak pernah — platform selalu cukup", why: "Pada volume besar dan logika kompleks, pajak + keterbatasan testing menjadi nyata.", correct: false },
            { text: "Hanya bila platform bangkrut", why: "Menunggu krisis = migrasi di bawah tekanan dengan lock-in maksimal.", correct: false },
          ],
        },
        {
          q: "Strategi anti lock-in yang paling murah dan bisa dimulai hari pertama?",
          options: [
            { text: "Jangan pernah memakai platform", why: "Kehilangan kecepatan prototyping — bukan strategi, melainkan fobia.", correct: false },
            { text: "Export konfigurasi workflow ke git + pisahkan inti dari glue sejak awal", why: "Tepat — murah hari ini, menyelamatkan saat migrasi nanti.", correct: true },
            { text: "Negosiasi kontrak tahunan dengan platform", why: "Kontrak mengunci harga, bukan arsitektur — lock-in teknis tetap ada.", correct: false },
            { text: "Pakai dua platform sekaligus sebagai cadangan", why: "Menggandakan kompleksitas dan biaya tanpa menyelesaikan lock-in logika.", correct: false },
          ],
        },
        {
          q: "Node AI mengklasifikasikan tiket lalu workflow langsung mengirim email ke pelanggan. Risikonya?",
          options: [
            { text: "Tidak ada — otomatisasi penuh adalah tujuan", why: "Node AI non-deterministik; output salah + aksi tak terbalikkan = insiden.", correct: false },
            { text: "Aksi tak terbalikkan tanpa gerbang manusia/validasi — butuh validasi output + persetujuan untuk yang berisiko", why: "Tepat — otomatisasi penuh hanya untuk aksi yang aman; email ke pelanggan butuh gerbang.", correct: true },
            { text: "Hanya risiko biaya", why: "Biaya adalah masalah terkecil — reputasi dari email salah jauh lebih mahal.", correct: false },
            { text: "Risiko platform down", why: "Itu risiko operasional umum, bukan risiko spesifik pola ini.", correct: false },
          ],
        },
      ],
    },
  ],
};
