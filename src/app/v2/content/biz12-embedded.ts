import type { V2Lesson } from "../lib/types";

// Analitik terbaik tidak terasa seperti analitik: insight di dalam workflow.
const EMBED_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Perbandingan tab Reports terpisah vs insight tertanam di workflow.">
<g font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">
<text x="130" y="22" text-anchor="middle">Portal terpisah</text>
<text x="390" y="22" text-anchor="middle">Tertanam di workflow</text>
</g>
<g font-family="var(--font-ui)">
<rect x="30" y="40" width="200" height="180" rx="10" fill="var(--bg-panel)" stroke="var(--border)" stroke-width="1.5"/>
<text x="130" y="64" text-anchor="middle" font-size="11" fill="var(--text-muted)">Aplikasi TokoKu</text>
<rect x="50" y="80" width="70" height="30" rx="6" fill="var(--bg-app)" stroke="var(--border)"/><text x="85" y="99" text-anchor="middle" font-size="10" fill="var(--text-muted)">Order</text>
<rect x="130" y="80" width="70" height="30" rx="6" fill="var(--bg-app)" stroke="var(--border)"/><text x="165" y="99" text-anchor="middle" font-size="10" fill="var(--text-muted)">Produk</text>
<rect x="50" y="120" width="150" height="30" rx="6" fill="var(--text-muted)" opacity="0.25" stroke="var(--text-muted)" stroke-dasharray="4,3"/>
<text x="125" y="139" text-anchor="middle" font-size="10" fill="var(--text-muted)">📊 Reports (dibuka 4%)</text>
<text x="130" y="175" text-anchor="middle" font-size="11" fill="var(--text-muted)">insight jauh dari</text>
<text x="130" y="192" text-anchor="middle" font-size="11" fill="var(--text-muted)">keputusan → tak dibuka</text>
<rect x="290" y="40" width="200" height="180" rx="10" fill="var(--bg-panel)" stroke="var(--border)" stroke-width="1.5"/>
<text x="390" y="64" text-anchor="middle" font-size="11" fill="var(--text-muted)">Aplikasi TokoKu</text>
<rect x="310" y="80" width="160" height="52" rx="8" fill="var(--success-soft)" stroke="var(--success)" stroke-width="1.5"/>
<text x="390" y="100" text-anchor="middle" font-size="11" fill="var(--success)" font-weight="700">Hari ini: Rp800 rb</text>
<text x="390" y="118" text-anchor="middle" font-size="10" fill="var(--text)">▲ 12% vs kemarin</text>
<rect x="310" y="142" width="160" height="30" rx="6" fill="var(--bg-app)" stroke="var(--border)"/><text x="390" y="161" text-anchor="middle" font-size="10" fill="var(--text-muted)">Order (lanjut kerja)</text>
<text x="390" y="200" text-anchor="middle" font-size="11" fill="var(--text-muted)">insight di titik keputusan</text>
<text x="390" y="217" text-anchor="middle" font-size="11" fill="var(--success)" font-weight="600">→ dibuka 6x lipat</text>
</g>
</svg>`;

export const biz12: V2Lesson = {
  slug: "biz12-embedded",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI12 — Embedded Analytics",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tab Reports yang tak pernah dibuka",
      prose: [
        "TokoKu, SaaS kasir untuk UMKM, membangun tab \u201CReports\u201D yang megah: 12 chart, export PDF, filter lengkap. Setelah 3 bulan, hanya 4% merchant yang pernah membukanya. Tim produk frustrasi: \u201Cpadahal datanya berguna!\u201D",
        "Lalu mereka memindahkan SATU angka ke halaman utama: \u201CHari ini: Rp800 rb, ▲ 12% vs kemarin\u201D — tepat di atas daftar order yang dibuka tiap pagi. Engagement analitik naik 6x lipat dalam sebulan. Tidak ada chart baru, tidak ada fitur baru. Hanya lokasi yang berubah.",
        "Twist-nya: analitik terbaik adalah yang tidak terasa seperti analitik. Merchant tidak \u201Cpergi ke laporan\u201D — laporannya yang datang ke tempat kerja mereka. Jarak antara insight dan keputusan diukur dalam KLIK, dan tiap klik membunuh separuh pengguna.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan prinsip embedded analytics; (2) merancang row-level security multi-tenant; (3) memilih build vs buy vs embed; (4) menghindari jebakan privasi data tenant.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang embedded analytics yang aman dan dipakai.",
        "(1) Menjelaskan kenapa 'bawa insight ke keputusan' mengalahkan 'bawa pengguna ke dashboard';",
        "(2) Menerapkan row-level security: tenant hanya melihat datanya, ditegakkan di API bukan di UI;",
        "(3) Mengaudit access log untuk menemukan filter yang hilang atau salah tenant;",
        "(4) Memilih build vs buy vs embed berdasar kebutuhan: 2 angka kontekstual ≠ portal penuh.",
      ],
      tasks: [],
    },

    {
      id: "prinsip",
      eyebrow: "Langkah 3 · Prinsip",
      title: "Bawa insight ke keputusan, bukan sebaliknya",
      prose: [
        "Prinsip inti embedded: insight hidup DI DALAM workflow pengguna, pada SAAT keputusan dibuat. Contoh: angka penjualan hari ini di halaman kasir (bukan tab Reports), alert stok menipis di halaman gudang, skor kredit di halaman approval.",
        "Tiga pola embedding: (1) KONTEKSTUAL — satu angka di tempat kerja (contoh TokoKu). (2) WORKFLOW — insight memicu aksi langsung (tombol \u201Crestock\u201D di samping alert). (3) WHITE-LABEL — analitik tampil sebagai fitur produkmu (dashboard merchant bermerek TokoKu).",
        "Progressive disclosure: mulai dari 1 angka → klik untuk tren → klik lagi untuk detail. Jangan tumpahkan 12 chart sekaligus; tiap level hanya untuk yang meminta.",
        "Kepribadian: embedded analytics adalah \u201Csi pelayan rahasia\u201D — ia bekerja di latar, muncul tepat saat dibutuhkan, tidak pernah minta perhatian untuk dirinya sendiri.",
        "💡 Intuisi kunci: ukur \u201Cjarak keputusan\u201D — berapa klik dari layar kerja ke insight? Target = 0 (insight sudah di layar kerja). Tiap klik tambahan memangkas adopsi secara drastis.",
      ],
      formula: String.raw`D_{tenant} = \{ r \in D \mid r.tenant = t \} \qquad E_{lift} = \frac{\text{adopsi}_{embed}}{\text{adopsi}_{portal}}`,
      formulaNote:
        "D_tenant = data yang boleh dilihat tenant t: hanya baris dengan tenant = t (row-level security). E_lift = lift adopsi embedded vs portal: di kasus TokoKu, 6x. Scoping yang bocor (tenant A melihat total semua) = pelanggaran privasi sekaligus bug bisnis.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: embedded = iframe dashboard di aplikasi",
        body: "Menempel dashboard 12 chart via iframe ke aplikasi BUKAN embedded — itu portal yang dipindah alamat. Embedded sejati = insight dirancang ulang mengikuti workflow: 1 angka kontekstual, aksi 1 klik, tanpa \u201Cpergi ke laporan\u201D. Iframe adalah jalan pintas teknis, bukan desain.",
      },
    },
    {
      id: "multitenant",
      eyebrow: "Langkah 4 · Multi-tenant",
      title: "Row-level security: tenant hanya melihat miliknya",
      prose: [
        "Cara membaca: kiri — tab Reports terpisah, jauh dari layar kerja, dibuka 4%. Kanan — satu angka tertanam di halaman utama (\u201CHari ini Rp800 rb ▲12%\u201D), di titik keputusan, dibuka 6x lipat.",
        "Interpretasi: lokasi mengalahkan kelengkapan. Insight yang sama, nasib berbeda — hanya karena jarak ke keputusan.",
        "Di balik layar, setiap angka embedded harus di-scope ke tenant: query SELALU memfilter tenant_id = pengguna saat ini. Lupa filter = Merchant A melihat revenue Merchant B = kebocoran data + krisis kepercayaan.",
        "Pola aman: fungsi `metrik_tenant(mid)` yang (1) memfilter baris tenant itu, (2) menghitung di atasnya, (3) tidak pernah mengekspos agregat lintas tenant. Scoping di LAPISAN DATA (bukan di UI) — UI bisa dibypass, query tidak.",
        "💡 Intuisi kunci: uji kebocoran termurah — login sebagai tenant A, cek apakah ada angka yang tidak bisa dijelaskan dari datanya sendiri. Jika ya, ada query yang lupa di-scope.",
      ],
      figure: {
        svg: EMBED_SVG,
        alt: "Perbandingan portal Reports terpisah vs insight tertanam di workflow.",
        caption: "Lokasi mengalahkan kelengkapan: insight yang sama, dibuka 6x lipat karena tinggal di titik keputusan.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: filter di UI cukup untuk keamanan tenant",
        body: "Filter di frontend bisa dibypass (devtools, API langsung). Row-level security harus di lapisan query/data: WHERE tenant_id = :current_tenant di setiap query, atau view per-tenant di database. UI hanya presentasi — bukan penjaga.",
      },
    },
    {
      id: "lab-tenant",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: scope yang bocor vs yang aman",
      prose: [
        "Data order 3 merchant (A, B, C) tersedia. Tugasmu: (1) hitung `rev` dict merchant → revenue (paid only); (2) tulis `metrik_tenant(mid)` yang me-scope dulu baru menghitung, dan hitung `bocor` = total tanpa scope (simulasi bug); (3) tentukan `top` merchant dan cetak.",
        "Coba juga: apa yang dilihat Merchant B jika ia memanggil metrik_tenant('B')? Dan apa yang TERJADI jika ada bug yang memanggil tanpa scope? Selisihnya (600 vs 2100) adalah ukuran kebocoran.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rev`: dict merchant → revenue (paid)" },
        { id: "t2", text: "Tulis `metrik_tenant(mid)` + hitung `bocor`" },
        { id: "t3", text: "Tentukan `top`, cetak hasil" },
      ],
      expected: "rev={'A': 800, 'B': 600, 'C': 700}  bocor=2100  top=A",
      note: {
        title: "Sering salah",
        body: "Menghitung metrik_tenant dengan filter SETELAH agregat (hitung total dulu, baru filter). Urutan yang benar: filter tenant DULU, baru agregat. Agregat dulu = angka lintas tenant sudah tercampur dan tidak bisa diurai lagi.",
      },
      hints: [
        "rev = {m: sum(a untuk order merchant m, status paid)}.",
        "def metrik_tenant(mid): return sum(a for m, _, a, s in orders if m == mid and s == 'paid').",
        "bocor = sum(a for _, _, a, s in orders if s == 'paid') — tanpa filter merchant!",
      ],
      code: {
        starter: `# (merchant, order_id, amount_rb, status)\norders = [("A","O1",500,"paid"),("A","O2",300,"paid"),("A","O3",200,"cancelled"),\n          ("B","O4",450,"paid"),("B","O5",150,"paid"),\n          ("C","O6",700,"paid"),("C","O7",100,"cancelled")]\n\n# TULIS KODEMU\nrev = {}\ndef metrik_tenant(mid):\n    return 0\nbocor = 0\ntop = ""\n\nprint(f"rev={rev}  bocor={bocor}  top={top}")\nprint(f"tenant B melihat: {metrik_tenant('B')} (seharusnya 600, bukan 2100)")`,
        lockLines: 4,
        solution: `# (merchant, order_id, amount_rb, status)\norders = [("A","O1",500,"paid"),("A","O2",300,"paid"),("A","O3",200,"cancelled"),\n          ("B","O4",450,"paid"),("B","O5",150,"paid"),\n          ("C","O6",700,"paid"),("C","O7",100,"cancelled")]\n\n# TULIS KODEMU\ndef metrik_tenant(mid):\n    scoped = [a for m, _, a, s in orders if m == mid and s == "paid"]\n    return sum(scoped)\nrev = {m: metrik_tenant(m) for m in ("A", "B", "C")}\nbocor = sum(a for _, _, a, s in orders if s == "paid")\ntop = max(rev, key=rev.get)\n\nprint(f"rev={rev}  bocor={bocor}  top={top}")\nprint(f"tenant B melihat: {metrik_tenant('B')} (seharusnya 600, bukan 2100)")`,
        checks: [
          { kind: "equal", task: "t1", name: "rev", value: {"A": 800, "B": 600, "C": 700}, label: "`rev` per merchant benar", msg: "A=800, B=600, C=700 (paid only)." },
          { kind: "equal", task: "t2", name: "bocor", value: 2100, tol: 1e-9, label: "`bocor` = 2100", msg: "Total tanpa scope tenant." },
          { kind: "equal", task: "t3", name: "top", value: "A", label: "`top` = A", msg: "Revenue tertinggi = A (800)." },
          { kind: "stdout_matches", task: "t3", pattern: "tenant B melihat: 600", label: "Scoping bekerja", msg: "Tenant B hanya melihat 600." },
        ],
      },
      reference: "Filter tenant DULU, agregat KEMUDIAN. Tidak pernah sebaliknya.",
    },    {
      id: "lab2-audit-tenant",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: audit log — siapa mengintip siapa",
      prose: [
        "Filter di UI tidak cukup — yang menentukan keamanan adalah filter di API. Tugasmu: audit log akses dan temukan setiap baris di mana filter_tenant ≠ merchant_id pemanggil (termasuk filter None = tanpa filter!).",
        "Dua pelanggaran tertangkap: M-101 memanggil tanpa filter (melihat agregat semua tenant — persis bug di cerita pembuka), dan M-102 membaca dengan filter M-101 (melihat data tetangga).",
        "Coba juga: bagaimana desain API yang membuat pelanggaran ini mustahil, bukan sekadar terdeteksi? Jawabannya: tenant diambil dari token autentikasi, bukan dari parameter yang bisa diutak-atik.",
      ],
      tasks: [
        { id: "t1", text: "Isi `pelanggaran`: baris log dengan filter_tenant != merchant_id" },
        { id: "t2", text: "Hitung `n_pelanggaran`" },
        { id: "t3", text: "Isi `merchant_terdampak`: tenant yang datanya terekspos/terlibat" },
      ],
      expected: "n_pelanggaran=2",
      note: {
        title: "Sering salah",
        body: "Menganggap filter None = aman ('tidak filter ya tidak bocor'). Tanpa filter, API mengembalikan agregat SEMUA tenant — itu justru eksposur terbesar.",
      },
      hints: [
        "pelanggaran = [baris for baris in LOG if f != m].",
        "None != 'M-101' → True: tanpa filter ikut tertangkap, memang seharusnya.",
        "merchant_terdampak: gabungan filter yang dipakai + pemanggil tanpa filter.",
      ],
      code: {
        starter: `# Log akses API: (merchant_id, endpoint, filter_tenant)\nLOG = [\n    ("M-101", "/revenue", "M-101"), ("M-102", "/revenue", "M-102"),\n    ("M-101", "/revenue", None),          # tanpa filter!\n    ("M-103", "/orders", "M-103"), ("M-102", "/orders", "M-101"),  # salah tenant!\n    ("M-101", "/revenue", "M-101"),\n]\n# TULIS KODEMU: pelanggaran, n_pelanggaran, merchant_terdampak\npelanggaran = []\nn_pelanggaran = 0\nmerchant_terdampak = []\n`,
        lockLines: 7,
        solution: `# Log akses API: (merchant_id, endpoint, filter_tenant)\nLOG = [\n    ("M-101", "/revenue", "M-101"), ("M-102", "/revenue", "M-102"),\n    ("M-101", "/revenue", None),          # tanpa filter!\n    ("M-103", "/orders", "M-103"), ("M-102", "/orders", "M-101"),  # salah tenant!\n    ("M-101", "/revenue", "M-101"),\n]\n\n# TULIS KODEMU: pelanggaran, n_pelanggaran, merchant_terdampak\npelanggaran = [(m, e, f) for m, e, f in LOG if f != m]\nn_pelanggaran = len(pelanggaran)\nmerchant_terdampak = sorted({f for _, _, f in pelanggaran if f is not None} | {m for m, _, f in pelanggaran if f is None})\n\nprint(f"n_pelanggaran={n_pelanggaran}")\nprint(f"merchant_terdampak={merchant_terdampak}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "n_pelanggaran", value: 2, label: "`n_pelanggaran` = 2", msg: "Tanpa filter + salah tenant." },
          { kind: "equal", task: "t3", name: "merchant_terdampak", value: ["M-101"], label: "`merchant_terdampak` = [M-101]", msg: "Datanya terekspos." },
        ],
      },
      reference: "Tenant isolation: filter wajib = identitas dari token, bukan parameter.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Jarak klik adalah gravitasi adopsi: tiap klik tambahan membunuh sebagian pengguna. Angka yang hidup di homepage 1 klik mengalahkan dashboard lengkap yang butuh 4 klik — selalu.",
        "💡 Keamanan tenant diuji dari API, bukan dari UI. Kalau endpoint mengembalikan data benar saat dipanggil dengan curl tanpa filter, UI secantik apa pun hanya tirai.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tanam insight di titik keputusan, bukan di tab Reports",
        body: "Embedded analytics yang sukses tidak diukur dari berapa orang membuka tab Reports — melainkan dari berapa keputusan yang diambil dengan konteks data TANPA meninggalkan alur kerja. Praktisi embedded tahu hukum gravitasinya: setiap klik menjauh dari titik keputusan membunuh sebagian pengguna. Insight yang hidup di halaman yang sama dengan tombol \"Setujui pengajuan\" akan dipakai; insight yang butuh 4 klik ke tab terpisah tidak akan pernah dibuka, seindah apa pun chart-nya. Heuristik desainnya: untuk setiap chart yang kamu embed, tulis di sebelahnya NAMA TITIK KEPUTUSANNYA — tombol, field, atau layar apa yang dipakai pengambil keputusan saat itu. Tidak bisa menyebutkan titik keputusannya = jangan di-embed, karena kamu sedang membangun museum, bukan alat kerja. Aturan keduanya: ukur \"keputusan berkonteks\", bukan \"kunjungan\". Berapa pengajuan disetujui sambil melihat skor risiko di layar yang sama? Berapa reorder yang memakai forecast di layar purchase order? Itu metrik adopsi yang jujur. Jebakan termahalnya adalah \"dashboard di dalam aplikasi\" — tim memindahkan 20 chart ke dalam produk dan heran kenapa tidak ada yang berubah. Yang berubah bukan lokasi chart-nya, melainkan jaraknya ke keputusan. Tanam insight sedekat mungkin dengan jari yang menekan tombol — di situlah nilainya.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: build vs buy vs embed",
      prose: [
        "Skenario 1 — Analitik adalah pembeda produk (mis. SaaS marketing). → BUILD: tim sendiri, desain mengikuti workflow, jadi fitur premium.",
        "Skenario 2 — Butuh cepat, pola standar (dashboard merchant). → BUY/embed platform: white-label, fokus ke scoping tenant + UX. Jangan bangun chart engine dari nol.",
        "Skenario 3 — Satu-dua angka kontekstual (contoh TokoKu). → EMBED ringan: query + komponen UI sendiri. Termurah, tercepat, paling efektif.",
        "Skenario 4 — Data sangat sensitif (keuangan, kesehatan). → BUILD dengan row-level security di lapisan data + audit log akses. Jangan percayakan scoping ke vendor tanpa verifikasi.",
        "Skenario 5 — Monetisasi analitik. → Tier: angka dasar gratis (adopsi), insight lanjutan berbayar (revenue). Ukur willingness-to-pay sebelum bangun — tanyakan 10 pelanggan.",
        "Aturan praktis 10 detik: mulai dari 1 angka embedded di titik keputusan. Jika dipakai, kembangkan. Jika tidak, 12 chart pun tidak akan dipakai.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: dashboard merchant marketplace",
      prose: [
        "Marketplace \u201CPasarKita\u201D punya 5.000 merchant. Portal analitik merchant dibuka 6% per bulan. Target: 40%. Redesign embedded: (1) di halaman produk: \u201C7 hari terakhir: 120 views, 8 terjual (6,7%)\u201D + tombol \u201Coptimalkan\u201D; (2) di halaman order: \u201CRata-rata kirim 2,1 hari — 0,4 hari lebih lambat dari kategori\u201D; (3) notifikasi: \u201CStok SKU-123 tersisa 5, laju 2/hari\u201D.",
        "Hasil 2 bulan: 43% merchant melihat insight mingguan; merchant yang mengikuti rekomendasi restock naikkan penjualan 18% vs kontrol. Kuncinya: tiap insight menempel pada objek kerja (produk, order, stok) — bukan di tab terpisah.",
        "Scoping: tiap merchant hanya melihat agregat tokonya + benchmark kategori (anonim, min. 10 merchant agar tidak bisa ditebak). Benchmark \u201Crata-rata kategori\u201D dihitung lintas tenant tapi disajikan anonim — pola ini butuh review privasi eksplisit.",
        "💡 Intuisi kunci: benchmark anonim adalah fitur embedded paling kuat (merchant peduli posisi relatifnya) sekaligus paling berisiko privasi. Aturan: agregat min. N tenant + tidak ada drill-down ke tenant lain.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang embedded analytics. Ingat: jarak ke keputusan.",
      ],
      tasks: [],
      summary: [
        "Embedded = insight di dalam workflow, di titik keputusan — bukan portal dipindah alamat.",
        "Ukur jarak keputusan (klik); target 0.",
        "Row-level security di lapisan data: filter tenant dulu, agregat kemudian.",
        "Mulai dari 1 angka; kembangkan jika dipakai.",
        "Benchmark anonim: min. N tenant, tanpa drill-down lintas tenant.",
      ],
      next: { label: "BI13 — AI dalam BI", href: "/v2/learn/biz13-ai" },
      quiz: [
        {
          q: "Tab Reports dibuka 4%; 1 angka di homepage dibuka 6x lipat. Pelajarannya?",
          options: [
            { text: "Merchant tidak butuh data", why: "Tab Reports dibuka 4% tetapi satu angka di homepage dibuka 6x lipat — buktinya bukan 'pengguna malas', melainkan 'pengguna butuh jawabannya, bukan perjalanannya'. Mereka tidak butuh portal; mereka butuh satu angka kontekstual di tempat keputusan dibuat." },
            { text: "Lokasi mengalahkan kelengkapan — insight harus di titik keputusan", why: "Tepat: tiap klik tambahan adalah pajak yang membunuh sebagian pengguna. Angka di homepage (1 klik, dalam konteks kerja) vs tab Reports (4 klik, konteks terpisah) = 6x lipat pemakaian. Pelajarannya: bawa insight ke keputusan, bukan pengguna ke dashboard.", correct: true },
            { text: "Chart harus dihapus semua", why: "Benar — untuk 5% yang mengebor. Tetapi merancang untuk 5% sambil mengorbankan 95% = prioritas terbalik. Solusinya progressive disclosure: satu angka untuk semua, detail selapis di bawah untuk yang meminta. Keduanya dilayani, tidak ada yang dikorbankan." },
            { text: "Homepage harus penuh angka", why: "Menampilkan 12 angka di homepage = memindahkan masalah tab Reports ke alamat baru. Embedded yang baik = SATU angka yang menjawab pertanyaan layar itu ('stok aman?'), bukan hujan angka yang memaksa pengguna menjadi analis dadakan." },
          ],
        },
        {
          q: "Merchant B memanggil API tanpa filter tenant dan melihat 2100 (bukan 600). Ini…",
          options: [
            { text: "Fitur benchmark", why: "Benchmark yang sah = agregat anonim ('rata-rata kategorimu: 75') yang dirancang sebagai fitur. Melihat total mentah 2.100 milik tenant lain karena lupa filter = eksposur data. Bedanya: yang satu dirancang dan disetujui, yang lain kecelakaan." },
            { text: "Kebocoran scoping — filter harus di lapisan data, bukan UI", why: "Tepat: dua bug sekaligus — privasi (melihat data tenant lain) dan bisnis (angka 2.100 menyesatkan keputusan merchant yang seharusnya melihat 60). Satu baris filter yang hilang merusak dua hal: kepercayaan dan kebenaran.", correct: true },
            { text: "Normal untuk admin", why: "Justru itu parahnya: bukan admin, bukan hacker — merchant biasa yang memanggil API normal. Sistem yang aman tidak bergantung pada 'pengguna baik'; ia menegakkan isolasi di backend terlepas dari siapa yang memanggil." },
            { text: "Salah hitung kecil", why: "Angkanya 'benar' secara aritmetika (total semua tenant memang 2.100) tetapi salah secara otorisasi. Kategori bug-nya bukan correctness melainkan confidentiality — dan itu lebih berbahaya karena tidak ada yang komplain ('angkanya keluar, kok') sampai auditor datang." },
          ],
        },
        {
          q: "Butuh 2 angka kontekstual cepat di aplikasi. Pilihan terbaik?",
          options: [
            { text: "Bangun chart engine sendiri 6 bulan", why: "Membangun portal embedded lengkap untuk 2 angka kontekstual = menembak lalat dengan meriam: biaya integrasi, maintenance, dan keamanan yang tidak proporsional. Kebutuhan kecil = solusi kecil (API + komponen UI ringan)." },
            { text: "Embed ringan: query + komponen UI sendiri di titik keputusan", why: "Tepat: untuk 2 angka kontekstual, API ringan + komponen inline adalah solusi termurah (hari, bukan bulan), tercepat (ms, bukan portal), dan paling efektif (di tempat keputusan). Pilih solusi sesuai ukuran masalah — peta keputusan lesson ini.", correct: true },
            { text: "Beli platform termahal", why: "Portal embedded penuh (SSO, navigasi, tema) untuk 2 angka = overkill yang mahal dan lambat. Over-engineering di sini bukan 'bagus untuk masa depan' — ia menunda value berminggu-minggu untuk kebutuhan yang bisa selesai hari ini." },
            { text: "Iframe 12 chart ke aplikasi", why: "Me-load seluruh portal BI di dalam iframe aplikasi = portal yang dipindah alamat, bukan embedded analytics. Pengguna tetap harus 'pergi ke BI' secara mental (login ganda, navigasi asing). Embedded sejati = insight menyatu dalam alur kerja aplikasi." },
          ],
        },
        {
          q: "Benchmark \u201Crata-rata kategori\u201D untuk merchant. Syarat privasi?",
          options: [
            { text: "Tampilkan semua data merchant lain", why: "Menampilkan rata-rata kategori TANPA anonimisasi yang benar (mis. kategori hanya berisi 2 merchant) = pelanggaran privasi: merchant A bisa mengurangkan angkanya sendiri dan menebak angka merchant B. Agregat kecil bukan anonim." },
            { text: "Agregat anonim min. N tenant + tanpa drill-down ke tenant lain", why: "Tepat — tetapi 'tepat' saja tidak cukup di sini, jadi perjelas: syaratnya adalah k-anonymity praktis (kategori cukup besar sehingga tidak ada merchant yang bisa diidentifikasi) DAN agregat yang tidak bisa di-reverse-engineering. Benchmark tanpa syarat ini = fitur yang menuntut ganti rugi.", correct: true },
            { text: "Jangan tampilkan apa-apa", why: "Benar, benchmark mendorong merchant meningkatkan performa — tetapi 'bernilai' tidak membenarkan 'bocor'. Solusinya bukan membuang fitur, melainkan membangunnya dengan benar: agregat anonim + ambang ukuran kategori minimum + audit berkala." },
            { text: "Minta izin tiap merchant manual", why: "Memberi setiap merchant akses ke data mentah kategori 'dengan perjanjian' = tidak scalable (N perjanjian, N risiko) dan tidak bisa diaudit. Agregat anonim melayani kebutuhan benchmark yang sah tanpa membuka data mentah siapa pun." },
          ],
        },
        {
          q: "Progressive disclosure artinya…",
          options: [
            { text: "Semua detail di satu layar", why: "Kebalikannya: progressive disclosure BUKAN menampilkan semuanya lalu menyembunyikan yang 'tidak penting'. Ia melapis: lapisan 1 = jawaban (satu angka), lapisan 2 = konteks (tren), lapisan 3 = detail (tabel) — tiap lapisan hanya dibuka atas permintaan." },
            { text: "1 angka → klik untuk tren → klik lagi untuk detail", why: "Tepat: prinsipnya 'minta dulu, baru diberi'. 95% pengguna berhenti di lapisan 1 (satu angka) — dan itu sukses, bukan kegagalan. 5% yang mengebor mendapat lapisan 2-3. Tidak ada yang dibanjiri, tidak ada yang kekurangan.", correct: true },
            { text: "Sembunyikan semua data", why: "Progressive disclosure bukan sensor: tidak ada informasi yang disembunyikan permanen. Ia arsitektur kedalaman — semua tersedia, tetapi disajikan bertahap sesuai kebutuhan. Bedanya dengan 'menyembunyikan': pengguna selalu bisa mencapai detailnya dalam 1-2 klik." },
            { text: "Tampilkan bertahap tiap hari", why: "Progressive disclosure bukan 'tampilkan detailnya nanti' (waktu) — melainkan 'tampilkan ringkasannya dulu, detailnya selapis di bawah' (kedalaman). Keduanya tersedia SAAT INI; yang berbeda adalah prioritas visualnya." },
          ],
        },
        {
          q: "Merchant memanggil /revenue TANPA parameter tenant dan menerima angka 2.100 (bukan 60 miliknya). Ini bukti...",
          options: [
            { text: "Bug tampilan di UI", why: "UI tidak terlibat: respons API-nya sendiri yang salah. Ini bug keamanan backend, bukan kosmetik." },
            { text: "Filter tenant tidak ditegakkan di API — pelanggaran isolasi", why: "Tepat: tenant diambil dari parameter (yang bisa dikosongkan), bukan dari token autentikasi. Perbaikannya di desain: tenant = identitas dari token, bukan input.", correct: true },
            { text: "Merchant-nya hacker", why: "Merchant hanya memanggil API normal tanpa parameter. Sistem yang aman tidak bergantung pada 'pengguna baik'." },
            { text: "Wajar untuk benchmark", why: "Benchmark = agregat ANONIM eksplisit (fitur), bukan total mentah semua tenant karena lupa filter (bug)." },
          ],
        },
      ],
    },
  ],
};
