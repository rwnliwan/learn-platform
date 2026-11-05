import type { V2Lesson } from "../lib/types";

// Lineage: raw -> clean -> mart, dengan akses per peran.
const LINEAGE_SVG = `<svg viewBox="0 0 600 230" role="img" aria-label="Lineage: raw_orders ke clean_orders ke mart_revenue, dengan akses berbeda per peran.">
<defs><marker id="de12a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="70" width="150" height="80" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="95" y="96" font-size="12" font-weight="600" fill="var(--text)">raw_orders</text>
<text x="95" y="114" font-size="10" fill="var(--text-muted)">berisi PII</text>
<text x="95" y="130" font-size="10" fill="var(--error)">hanya engineer</text>
<rect x="225" y="70" width="150" height="80" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="300" y="96" font-size="12" font-weight="600" fill="var(--text)">clean_orders</text>
<text x="300" y="114" font-size="10" fill="var(--text-muted)">PII ter-masking</text>
<text x="300" y="130" font-size="10" fill="var(--text-muted)">engineer + analyst</text>
<rect x="430" y="70" width="150" height="80" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="505" y="96" font-size="12" font-weight="600" fill="var(--text)">mart_revenue</text>
<text x="505" y="114" font-size="10" fill="var(--text-muted)">agregat, tanpa PII</text>
<text x="505" y="130" font-size="10" fill="var(--text-muted)">semua peran</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.8" marker-end="url(#de12a)">
<line x1="170" y1="110" x2="221" y2="110"/><line x1="375" y1="110" x2="426" y2="110"/>
</g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="195" y="100" fill="var(--text-muted)">bersihkan</text>
<text x="400" y="100" fill="var(--text-muted)">agregasi</text>
</g>
<text x="300" y="190" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">lineage menjawab "dari mana angka ini?" · akses menjawab "siapa boleh lihat?"</text>
<text x="300" y="208" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">keduanya dibangun DI DALAM pipeline, bukan dokumen terpisah</text>
</svg>`;

export const de12: V2Lesson = {
  slug: "de12-governance",
  track: "Data Engineer",
  module: "Operasi & Kualitas",
  title: "DE12 — Governance: Katalog & Lineage",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "'Kolom revenue definisinya apa?' — lima jawaban",
      prose: [
        "Audit internal 'BankMaju' mengajukan satu pertanyaan sederhana ke lima tim: 'definisi kolom revenue di dashboard kalian apa?' Jawabannya lima-limanya berbeda — dan lima-limanya benar... di zamannya masing-masing. Definisi berubah tiga kali dalam dua tahun tanpa ada yang mencatat.",
        "Investigasi lanjutan lebih menyeramkan: seorang analis junior punya akses baca ke tabel mentah berisi NIK dan nomor rekening 2 juta nasabah — 'karena dulu butuh untuk satu proyek'. Proyeknya selesai 8 bulan lalu. Aksesnya tidak pernah dicabut.",
        "Twist-nya: governance yang gagal bukan karena tidak ada aturan, melainkan karena aturan hidup di dokumen PDF sementara data hidup di pipeline. Lesson ini tentang membangun governance DI DALAM pipeline: lineage otomatis, akses sebagai kode, PII masking sejak lapisan clean.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: governance = dokumen kebijakan",
        type: "pitfall",
        body: "Dokumen tidak mengeksekusi apa-apa. Governance yang hidup adalah kode: lineage yang tercatat otomatis tiap run, akses yang didefinisikan sebagai role (bukan chat 'tolong bukakan akses'), masking yang terjadi di pipeline (bukan 'janji tidak akan lihat').",
      },
      reference: "Governance = kode di pipeline: lineage + akses + masking. Bukan PDF.",
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membangun governance data yang ringan tapi nyata.",
        "(1) Menjelaskan kenapa lima tim punya lima definisi 'revenue' (governance mati = makna membusuk);",
        "(2) Membangun lineage tracker dan access control sebagai kode — bukan dokumen;",
        "(3) Menerapkan PII masking dan prinsip least privilege pada akses data;",
        "(4) Memilih governance ringan vs berat berdasar harga kesalahan × jumlah pemakai.",
      ],
      tasks: [],
    },

    {
      id: "katalog-lineage",
      eyebrow: "Langkah 3 · Katalog",
      title: "Katalog & lineage: siapa pakai data apa",
      prose: [
        "Katalog data adalah 'Google untuk data perusahaan': cari 'revenue', dapatkan definisi resmi, pemilik, kualitas, dan siapa saja yang memakainya. Tanpa katalog, setiap analis menemukan versinya sendiri (kasus BankMaju).",
        "Lineage adalah 'silsilah' tiap angka: mart_revenue.total berasal dari clean_orders.amount yang berasal dari raw_orders.amount via fungsi bersihkan. Saat angka dipertanyakan, lineage menjawab dalam detik — bukan dengan investigasi 3 hari.",
        "💡 Intuisi: lineage terbaik ditulis oleh pipeline itu sendiri (decorator mencatat tiap transformasi), bukan oleh manusia mengisi form. Manusia lupa; kode tidak.",
        "💡 Intuisi: katalog tanpa ownership = buku telepon tanpa nama. Setiap dataset wajib punya pemilik yang menjawab 'definisi ini masih berlaku?' — tanpa pemilik, definisi membusuk diam-diam.",
        "Cara membaca: tiga kotak berurutan — raw_orders → clean_orders → mart_revenue — dengan panah lineage. Di samping tiap kotak, label akses per peran: siapa boleh baca apa. Lineage = dari mana; akses = siapa boleh.",
        "Interpretasi: keduanya lahir dari pipeline yang SAMA (efek samping eksekusi, bukan dokumen manual). Lineage menjawab 'kenapa angka ini berubah?'; access control menjawab 'siapa yang boleh tahu?'. Governance tanpa keduanya = teori.",
      ],
      figure: {
        svg: LINEAGE_SVG,
        alt: "Lineage raw ke clean ke mart dengan akses berbeda per peran.",
        caption: "Lineage = dari mana. Akses = siapa boleh. Keduanya dari pipeline.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: lineage cukup di level tabel",
        type: "pitfall",
        body: "Lineage tabel menjawab 'mart_revenue dari clean_orders' — tapi tidak menjawab 'kolom total dari kolom amount via fungsi apa'. Saat definisi berubah di level kolom (kasus Nadia, DE1), lineage tabel buta. Kejar lineage kolom-level untuk metrik kritis.",
      },
      reference: "Katalog = definisi + pemilik. Lineage = silsilah angka. Otomatis dari kode.",
    },
    {
      id: "akses-pii",
      eyebrow: "Langkah 4 · Akses",
      title: "Akses sebagai kode & PII masking",
      prose: [
        "Prinsip least privilege: beri akses minimum yang dibutuhkan, cabut otomatis saat tidak dibutuhkan. Implementasinya: role (analyst, engineer, auditor) didefinisikan sebagai kode, bukan pemberian manual via chat.",
        "PII (data pribadi: NIK, email, rekening) di-masking di lapisan clean — analis tidak pernah melihat email asli, hanya a***@mail.com. Masking di pipeline (bukan di aplikasi) berarti perlindungannya mengikuti data ke mana pun ia direplikasi.",
      ],
      formula: String.raw`E = \frac{T_{pii} \cap T_{akses}}{T_{pii}}`,
      formulaNote: "E = rasio eksposur PII (0–1); T_pii = tabel yang mengandung PII; T_akses = tabel yang bisa diakses peran. Target: E = 0 untuk semua peran non-engineer. Contoh lab: analyst E = 0/1 = 0 ✓.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Masking hanya di dashboard ('tampilan disamarkan') sementara tabel mentahnya bisa di-query langsung. Itu seperti gembok di pintu depan dengan jendela terbuka. Masking harus di lapisan data (clean), bukan di lapisan presentasi.",
      },
      reference: "Least privilege + masking di clean. E = 0 untuk non-engineer.",
    },
    {
      id: "lab-lineage",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: lineage tracker + access control",
      prose: [
        "Lab ini membangun dua fondasi governance sebagai kode: decorator @track yang mencatat lineage tiap transformasi (raw → clean → mart), dan peta AKSES peran → tabel.",
        "Cara membaca: 2 edge lineage tercatat otomatis saat pipeline jalan; boleh() menjawab siapa boleh baca apa. Hanya engineer yang menyentuh raw_orders (ber-PII).",
        "Interpretasi: di produksi, pola ini menjadi tabel lineage di katalog + GRANT/REVOKE di warehouse — tapi logikanya identik.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi decorator `track`: catat edge (dari → via → ke) ke LINEAGE" },
        { id: "t2", text: "Lengkapi `boleh(peran, tabel)`: cek keanggotaan di AKSES" },
        { id: "t3", text: "Jalankan pipeline, cetak lineage + hasil cek akses" },
      ],
      expected: "mart={'total': 300} | jejak=2 edge | analyst_baca_raw=False | akses_pii=['engineer']",
      note: {
        title: "Sering salah",
        body: "Lineage dicatat manual ('nanti saya isi wiki-nya'). Tidak pernah terjadi. Lineage harus efek samping otomatis dari eksekusi pipeline — decorator/wrapper, bukan dokumentasi sukarela.",
      },
      hints: [
        "Di wrap(): jalankan fn dulu, lalu LINEAGE.append({...}).",
        "boleh: return tabel in AKSES.get(peran, set()).",
        "akses_pii: [p for p, ts in AKSES.items() if 'raw_orders' in ts].",
      ],
      code: {
        starter: `LINEAGE = []\n# TULIS KODEMU: decorator pencatat lineage\ndef track(sumber, target):\n    def deco(fn):\n        def wrap(*a, **k):\n            \n            return hasil\n        return wrap\n    return deco\n\n@track("raw_orders", "clean_orders")\ndef bersihkan(rows):\n    return [r for r in rows if r["amount"] and r["amount"] > 0]\n\n@track("clean_orders", "mart_revenue")\ndef agregasi(rows):\n    return {"total": sum(r["amount"] for r in rows)}\n\nAKSES = {\n    "analyst": {"mart_revenue", "clean_orders"},\n    "engineer": {"raw_orders", "clean_orders", "mart_revenue"},\n    "auditor": {"mart_revenue"},\n}\n# TULIS KODEMU: cek akses\ndef boleh(peran, tabel):\n    return \n\nraw = [{"amount": 100}, {"amount": None}, {"amount": 200}]\nmart = agregasi(bersihkan(raw))\nprint(f"mart={mart}")\nprint(f"jejak={len(LINEAGE)} edge")\nfor e in LINEAGE:\n    print(f"  {e['dari']} --{e['via']}--> {e['ke']}")\nprint(f"analyst_baca_raw={boleh('analyst', 'raw_orders')}")\nprint(f"engineer_baca_raw={boleh('engineer', 'raw_orders')}")\npii = [p for p, ts in AKSES.items() if "raw_orders" in ts]\nprint(f"akses_pii={pii}")`,
        lockLines: 1,
        solution: `LINEAGE = []\n# TULIS KODEMU: decorator pencatat lineage\ndef track(sumber, target):\n    def deco(fn):\n        def wrap(*a, **k):\n            hasil = fn(*a, **k)\n            LINEAGE.append({"dari": sumber, "via": fn.__name__, "ke": target})\n            return hasil\n        return wrap\n    return deco\n\n@track("raw_orders", "clean_orders")\ndef bersihkan(rows):\n    return [r for r in rows if r["amount"] and r["amount"] > 0]\n\n@track("clean_orders", "mart_revenue")\ndef agregasi(rows):\n    return {"total": sum(r["amount"] for r in rows)}\n\nAKSES = {\n    "analyst": {"mart_revenue", "clean_orders"},\n    "engineer": {"raw_orders", "clean_orders", "mart_revenue"},\n    "auditor": {"mart_revenue"},\n}\n# TULIS KODEMU: cek akses\ndef boleh(peran, tabel):\n    return tabel in AKSES.get(peran, set())\n\nraw = [{"amount": 100}, {"amount": None}, {"amount": 200}]\nmart = agregasi(bersihkan(raw))\nprint(f"mart={mart}")\nprint(f"jejak={len(LINEAGE)} edge")\nfor e in LINEAGE:\n    print(f"  {e['dari']} --{e['via']}--> {e['ke']}")\nprint(f"analyst_baca_raw={boleh('analyst', 'raw_orders')}")\nprint(f"engineer_baca_raw={boleh('engineer', 'raw_orders')}")\npii = [p for p, ts in AKSES.items() if "raw_orders" in ts]\nprint(f"akses_pii={pii}")`,
        checks: [
          { kind: "equal", task: "t3", name: "mart", value: {"total": 300}, label: "`mart` = {'total': 300}", msg: "100 + 200 (None tersaring)." },
          { kind: "stdout_matches", task: "t3", pattern: "jejak=2 edge", label: "`print` 2 edge lineage", msg: "raw→clean dan clean→mart." },
          { kind: "stdout_matches", task: "t3", pattern: "analyst_baca_raw=False", label: "analyst ditolak dari raw", msg: "Least privilege: analyst cukup clean." },
          { kind: "stdout_matches", task: "t3", pattern: "akses_pii=\\['engineer'\\]", label: "hanya engineer akses PII", msg: "E = 0 untuk non-engineer." },
        ],
      },
      reference: "Lineage = efek samping otomatis. Akses = kode, bukan chat.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 6 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Lineage yang ditulis manual = dokumentasi yang basi minggu depan. Lineage harus efek samping eksekusi pipeline: tercatat otomatis saat data mengalir, bukan saat seseorang ingat mencatat.",
        "💡 Governance mengikuti risiko, bukan sebaliknya. Tabel mainan = wiki cukup; tabel gaji 10.000 karyawan = katalog + steward + audit. Harga kesalahan × pemakai = berat governance.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: lineage adalah peta evakuasi — baru berharga saat kebakaran",
        body: "Tidak ada yang membaca lineage saat semuanya baik-baik saja — nilainya muncul tepat di dua momen: saat kolom berubah arti dan 14 dashboard ikut berubah angka, dan saat auditor bertanya \"data gaji ini mengalir ke mana saja\". Heuristik praktisi: lineage yang ditulis manual adalah dokumentasi yang basi minggu depan; lineage harus efek samping eksekusi — tercatat otomatis saat data mengalir, bukan saat seseorang ingat mencatat. Aturan beratnya proporsional: harga kesalahan dikali jumlah pemakai sama dengan berat governance. Tabel mainan cukup wiki; tabel gaji 10.000 karyawan butuh katalog, steward bernama, dan jejak audit. Jebakan yang paling mahal bernama \"nanti saja di-govern\" — utang teknis dengan bunga legal: PII yang terlanjur tersebar di 30 tabel turunan tidak bisa \"ditarik kembali\", hanya bisa ditambal dengan tokenisasi yang menyakitkan. Maka aturan emasnya: PII ditokenisasi di gerbang ingest, tidak pernah dalam bentuk asli di mart — sekali bocor ke downstream, biaya bersih-bersihnya eksponensial. Dan satu kebiasaan murah yang powerful: setiap perubahan skema tabel kritis wajib memeriksa \"siapa yang terdampak\" dari lineage SEBELUM merge — blast radius yang diketahui sebelum ledakan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: governance ringan vs berat",
      prose: [
        "Skenario 1 — Startup 10 orang, data internal. Kondisi: risiko rendah. Keputusan: governance ringan — definisi di katalog sederhana + akses per peran dasar. Alasan: jangan birokrasi sebelum ada yang dipertaruhkan.",
        "Skenario 2 — Data PII / finansial. Kondisi: NIK, rekening, transaksi. Keputusan: masking di clean + akses ketat + audit log. Alasan: satu kebocoran = denda + reputasi.",
        "Skenario 3 — Laporan ke regulator. Kondisi: angka harus bisa ditelusur. Keputusan: lineage kolom-level + ownership + kontrak. Alasan: 'dari mana angka ini?' harus terjawab detik.",
        "Skenario 4 — 50 tim, 1000 dataset. Kondisi: skala organisasi. Keputusan: katalog terpusat + stewardship + sertifikasi dataset. Alasan: tanpa itu, tiap tim menemukan 'kebenarannya' sendiri.",
        "Aturan praktis 10 detik: skala governance = harga kesalahan × jumlah pemakai. Naikkan saat salah satunya naik.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Governance 'big bang': 6 bulan menyusun framework sempurna sementara data terus mengalir tanpa kendali. Mulai dari luka terbesar (PII terbuka / definisi ganda), bukan dari framework.",
      },
      reference: "Ringan dulu, berat saat harga kesalahan naik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: audit eksposur PII",
      prose: [
        "Audit akses BankMaju: 3 peran, tabel raw_orders mengandung PII. Kebijakan: hanya engineer boleh menyentuh PII; analis bekerja di clean (email ter-masking a***@mail.com); auditor hanya mart agregat.",
        "Hitung eksposur per peran dan pelanggaran least privilege (non-engineer yang bisa baca tabel PII). Target: 0.",
        "Interpretasi: audit seperti ini harus bisa dijalankan sebagai kode tiap minggu — bukan proyek tahunan.",
        "Angka konkretnya: raw_orders berisi 2 juta baris dengan email + NIK. Satu peran non-engineer dengan akses baca = 2 juta record PII terekspos. Setelah kebijakan (analis → clean termasking, auditor → mart agregat), eksposur = 0 record. Denda UU PDP bisa mencapai 2% pendapatan tahunan — audit mingguan sebagai kode adalah premi asuransi termurah.",
      ],
      tasks: [
        { id: "t1", text: "Masking `email` di clean: huruf pertama + ***@domain" },
        { id: "t2", text: "Hitung `terekspos` (non-engineer dengan akses tabel PII), cetak semua" },
      ],
      expected: "clean_email_0=a***@mail.com | pelanggaran_prinsip_least_privilege=0",
      hints: [
        "partition('@') untuk pisah lokal dan domain.",
        "TABEL_PII = {'raw_orders'}.",
        "terekspos = sum(1 for p in non_engineer for t in AKSES[p] if t in TABEL_PII).",
      ],
      code: {
        starter: `raw = [\n    {"id": 1, "email": "andi@mail.com", "amount": 150000},\n    {"id": 2, "email": "budi@mail.com", "amount": 200000},\n]\nAKSES = {"analyst": {"clean_orders"}, "engineer": {"raw_orders", "clean_orders"}, "auditor": {"mart"}}\nTABEL_PII = {"raw_orders"}\n\n# TULIS KODEMU: masking email\ndef mask_email(e):\n    \n\nclean = [{"id": r["id"], "email": mask_email(r["email"]), "amount": r["amount"]} for r in raw]\nprint(f"clean_email_0={clean[0]['email']}")\n\n# TULIS KODEMU: audit pelanggaran\nnon_eng = [p for p in AKSES if p != "engineer"]\nterekspos = \nprint(f"pelanggaran_prinsip_least_privilege={terekspos}")`,
        lockLines: 5,
        solution: `raw = [\n    {"id": 1, "email": "andi@mail.com", "amount": 150000},\n    {"id": 2, "email": "budi@mail.com", "amount": 200000},\n]\nAKSES = {"analyst": {"clean_orders"}, "engineer": {"raw_orders", "clean_orders"}, "auditor": {"mart"}}\nTABEL_PII = {"raw_orders"}\n\n# TULIS KODEMU: masking email\ndef mask_email(e):\n    lokal, _, domain = e.partition("@")\n    return lokal[0] + "***@" + domain\n\nclean = [{"id": r["id"], "email": mask_email(r["email"]), "amount": r["amount"]} for r in raw]\nprint(f"clean_email_0={clean[0]['email']}")\n\n# TULIS KODEMU: audit pelanggaran\nnon_eng = [p for p in AKSES if p != "engineer"]\nterekspos = sum(1 for p in non_eng for t in AKSES[p] if t in TABEL_PII)\nprint(f"pelanggaran_prinsip_least_privilege={terekspos}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "clean_email_0=a\\*\\*\\*@mail\\.com", label: "`print` email ter-masking", msg: "andi@mail.com → a***@mail.com." },
          { kind: "equal", task: "t2", name: "terekspos", value: 0, tol: 0, label: "`terekspos` = 0", msg: "Tidak ada non-engineer yang menyentuh tabel PII." },
        ],
      },
      reference: "Masking di clean, bukan di dashboard. Audit = kode mingguan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang tata kelola yang hidup.",
      ],
      tasks: [],
      summary: [
        "Governance = kode di pipeline (lineage + akses + masking), bukan dokumen PDF.",
        "Katalog = definisi + pemilik; lineage = silsilah angka, otomatis dari kode, idealnya kolom-level.",
        "Least privilege: akses minimum sebagai kode; E = 0 untuk non-engineer pada tabel PII.",
        "Masking PII di lapisan clean, bukan di presentasi.",
        "Skala governance mengikuti harga kesalahan × jumlah pemakai.",
      ],
      next: { label: "DE13 — Real-Time untuk Analitik", href: "/v2/learn/de13-realtime" },
      quiz: [
        {
          q: "Kenapa lima tim punya lima definisi 'revenue'?",
          options: [
            { text: "Datanya kurang", why: "Lima tim, lima definisi — bukan karena datanya kurang, melainkan karena maknanya tidak pernah ditulis. Setiap tim 'tahu' revenue versinya sendiri; tidak ada registry yang mencatat (dataset + filter + agregasi + versi). Governance mati = makna membusuk diam-diam, dan tiap rapat dimulai dari debat definisi." },
            { text: "Definisi berubah tanpa katalog, pemilik, dan lineage yang mencatat", why: "Tepat: tanpa katalog yang mencatat definisi, tiap tim mengembangkan dialeknya sendiri. 'Membusuk diam-diam' karena tidak ada yang error — angkanya keluar, hanya maknanya berbeda. Governance = menuliskan makna sebelum ia sempat membusuk.", correct: true },
            { text: "Tool BI-nya beda", why: "Mengganti warehouse, BI tool, atau format file tidak menyatukan lima definisi — karena akarnya bukan teknologi melainkan tata kelola makna. Tool baru + definisi tak terkelola = lima definisi yang lebih cepat dihitung. Obati akarnya: katalog + pemilik + versi." },
            { text: "Analisnya malas", why: "Lima tim tidak 'bandel'; mereka rasional di dalam sistem yang tidak memberi definisi resmi. Menyalahkan orang menghasilkan kepatuhan semu; memperbaiki sistem (registry + kanonis) menghasilkan keselarasan permanen. Governance = desain sistem, bukan teguran." },
          ],
        },
        {
          q: "Mana implementasi lineage yang benar?",
          options: [
            { text: "Analis mengisi wiki tiap selesai transformasi", why: "Lineage yang ditulis manual bergantung pada ingatan dan kerajinan — dua hal yang tidak scalable. Orang lupa mencatat, mencatatnya telat, atau mencatat yang salah. Satu-satunya lineage yang konsisten = yang tercatat OTOMATIS sebagai efek samping eksekusi pipeline." },
            { text: "Pipeline mencatat otomatis tiap run (decorator/wrapper)", why: "Tepat: lineage yang benar lahir dari pipeline yang berjalan — setiap run mencatat 'input ini → output itu'. Karena ia efek samping eksekusi (bukan dokumen terpisah), ia tidak mungkin basi: selama pipeline jalan, lineage-nya mutakhir. Inilah implementasi yang scalable.", correct: true },
            { text: "Screenshot DAG tiap minggu", why: "Lineage dalam bentuk diagram statis atau wiki tidak bisa di-query ('tabel apa saja yang terdampak jika kolom ini berubah?') dan tidak ter-update otomatis. Governance butuh lineage sebagai DATA (graph yang bisa di-query), bukan sebagai GAMBAR." },
            { text: "Menghafal alur data", why: "Mencatat lineage manual untuk 3 tabel masih mungkin; untuk 300 tabel = mustahil. Yang tidak scalable = utang yang menunggu meledak. Solusi: instrumentasi pipeline (mis. OpenLineage) sejak awal, bukan 'nanti saat sudah besar'." },
          ],
        },
        {
          q: "Analis butuh email pelanggan untuk satu analisis. Kebijakan tepat?",
          options: [
            { text: "Beri akses raw permanen 'biar gampang'", why: "Analis junior BankMaju diberi akses baca tabel pelanggan 'untuk satu analisis' — 2 tahun kemudian aksesnya masih ada, sudah tidak dipakai, tidak ada yang ingat. Akses abadi yang terlupakan = permukaan serangan yang tidak termonitor. Inilah kenapa akses harus time-boxed + tercatat." },
            { text: "Masking di clean; akses raw sementara + tercatat + dicabut otomatis", why: "Tepat: berikan view termasking (email → hash, cukup untuk analisis pola) + akses time-boxed 7 hari + catat di audit log. Tiga lapis ini melayani kebutuhan legitimate TANPA membuka PII mentah selamanya. Least privilege bukan 'tolak', melainkan 'beri secukupnya, tercatat'.", correct: true },
            { text: "Tolak mentah-mentah", why: "Menolak total kebutuhan yang sah = analis mencari jalan pintas (minta ke teman = shadow access). Governance yang bijak melayani kebutuhan legitimate dengan kontrol (masking + time-box), bukan mematikannya. Kaku = dilangkahi; bijak = dipatuhi." },
            { text: "Samarkan di dashboard saja", why: "Memberi view termasking tetapi membiarkan tabel mentah bisa di-query = mengunci pintu depan sambil membuka jendela. Kontrol akses harus di level TABEL (revoke akses mentah untuk peran analis), bukan sekadar 'menyediakan alternatif yang baik'." },
          ],
        },
        {
          q: "Rumus E mengukur…",
          options: [
            { text: "Efisiensi query", why: "Rumus E (eksposur) tidak mengukur seberapa cepat query — ia mengukur seberapa BANYAK data sensitif terekspos ke berapa peran. Kecepatan = masalah performa (DE11); eksposur = masalah keamanan. Jangan menjawab pertanyaan keamanan dengan metrik performa." },
            { text: "Rasio tabel PII yang bisa diakses suatu peran — target 0 untuk non-engineer", why: "Tepat: E = Σ (peran non-engineer × tabel PII yang bisa dibaca) — dihitung dari kode akses, bukan dari klaim. Karena ia kode, ia bisa dijalankan tiap minggu sebagai audit otomatis. Target: 0. Metrik yang bisa diaudit > kebijakan yang hanya ditulis.", correct: true },
            { text: "Error rate pipeline", why: "Akurasi, kelengkapan, validitas = dimensi KUALITAS data (DE8): apakah datanya benar. Rumus E = dimensi KEAMANAN: siapa bisa melihat apa. Data yang 100% akurat tetapi terekspos ke semua orang = kualitas sempurna, keamanan nol." },
            { text: "Estimasi biaya", why: "DE11 = cost & performance tuning: rupiah per query, kecepatan. Rumus E tidak menyebut rupiah atau milidetik — ia menghitung eksposur PII. Beda domain, beda metrik, beda obat." },
          ],
        },
        {
          q: "Kapan governance 'berat' (katalog terpusat + stewardship) dibenarkan?",
          options: [
            { text: "Startup 10 orang", why: "'Berat = birokrasi' hanya benar jika risikonya kecil. Untuk tabel gaji 10.000 karyawan, 'ringan' (wiki + harapan) = negligensi. Berat-ringannya governance mengikuti harga kesalahan × jumlah pemakai — bukan preferensi pribadi engineer." },
            { text: "50 tim, 1000 dataset, laporan ke regulator", why: "Tepat: governance 'berat' (katalog terpusat + steward + audit) dibenarkan saat (harga kesalahan) × (jumlah pemakai) sudah besar — mis. data finansial yang dipakai 5 tim untuk keputusan direksi. Rumusnya kuantitatif, bukan 'terasa penting'.", correct: true },
            { text: "Tidak pernah", why: "'Selalu ringan' atau 'selalu berat' = dua-duanya salah. Governance adalah spektrum yang digeser oleh risiko. Jawaban yang benar selalu menyebut KONDISI — kapan ringan cukup, kapan berat wajib." },
            { text: "Saat ada waktu luang", why: "Governance bukan kesukaan pribadi atau 'best practice' abstrak — ia asuransi yang preminya (usaha) harus sebanding dengan risikonya. Tabel mainan = premi kecil (wiki). Tabel PII 2 juta baris = premi besar (katalog + audit). Ikuti risikonya." },
          ],
        },
        {
          q: "Lima tim punya lima definisi 'revenue'. Upaya pertama yang paling murah?",
          options: [
            { text: "Bentuk komite governance 3 bulan", why: "Komite 3 bulan untuk masalah yang bisa dimulai hari ini = birokrasi. Mulai dari yang murah." },
            { text: "Daftarkan kelima definisi di katalog + tandai satu sebagai kanonis sementara", why: "Tepat: governance dimulai dari visibilitas, bukan komite. Katalog (definisi tertulis + pemilik + versi) + satu kanonis = 80% masalah selesai dalam seminggu. Komite hanya untuk sengketa yang tersisa.", correct: true },
            { text: "Paksa semua pakai definisi finance", why: "Pemaksaan tanpa pencatatan = definisi lain tetap hidup diam-diam (di spreadsheet). Lahirnya shadow BI." },
            { text: "Beli tools katalog mahal", why: "Tools tidak mengkatalogkan sendiri. Lima definisi tertulis di wiki > nol definisi di tools mahal." },
          ],
        },
        {
          q: "Analis junior meminta akses baca ke tabel pelanggan mentah (ada email & NIK) 'untuk analisis'. Kebijakan tepat?",
          options: [
            { text: "Berikan — analis butuh data", why: "Akses abadi ke PII mentah untuk 'satu analisis' = kasus BankMaju di lesson ini: akses yang terlupakan. PII bukan untuk 'nanti siapa tahu butuh'." },
            { text: "Berikan view termasking + akses time-boxed + catat di audit log", why: "Tepat: least privilege + jejak audit. Masking (email → hash) untuk analisis pola; time-boxed (7 hari) agar tidak abadi; tercatat agar bisa diaudit. Kebutuhan legitimate DILAYANI, bukan ditolak mentah-mentah.", correct: true },
            { text: "Tolak total", why: "Menolak total = analis memakai data lain yang lebih buruk (atau minta ke temannya — shadow access). Governance yang terlalu kaku = dilangkahi." },
            { text: "Berikan akses penuh tapi ingatkan baik-baik", why: "'Ingatkan' bukan kontrol. Kebijakan tanpa enforcement = saran." },
          ],
        },
      ],
    },
  ],
};
