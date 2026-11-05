import type { V2Lesson } from "../lib/types";

// ── Figure: match rate kode sebelum vs sesudah tata kelola reference data ─
const MATCH_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang match rate kode di tiga sistem, sebelum dan sesudah tata kelola reference data">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="46" y="209">70%</text><text x="46" y="169">80%</text><text x="46" y="129">90%</text>
<text x="46" y="89">100%</text>
</g>
<g>
<rect x="100" y="150" width="46" height="56" fill="var(--chart-text)" opacity="0.55"/>
<rect x="150" y="94" width="46" height="112" fill="var(--c1)" opacity="0.9"/>
<text x="148" y="220" text-anchor="middle" font-size="11" fill="var(--text)">Core Banking</text>
<rect x="252" y="158" width="46" height="48" fill="var(--chart-text)" opacity="0.55"/>
<rect x="302" y="96" width="46" height="110" fill="var(--c1)" opacity="0.9"/>
<text x="324" y="220" text-anchor="middle" font-size="11" fill="var(--text)">Treasury</text>
<rect x="428" y="166" width="46" height="40" fill="var(--chart-text)" opacity="0.55"/>
<rect x="478" y="94" width="46" height="112" fill="var(--c1)" opacity="0.9"/>
<text x="474" y="220" text-anchor="middle" font-size="11" fill="var(--text)">Trade Finance</text>
</g>
<line x1="52" y1="86" x2="528" y2="86" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="524" y="78" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">target ≥ 99%</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">match rate kode (abu = sebelum, biru = sesudah)</text>
<text x="440" y="240">72→96 · 74→95 · 70→96</text>
</g>
</svg>`;

export const dm20: V2Lesson = {
  slug: "dm20-reference-data",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Reference Data Management: Kode Kecil yang Menentukan Nasib Laporan",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan yang angkanya benar semua — tapi ditolak regulator",
      prose: [
        "Bayangkan tim pelaporan sebuah bank di Jakarta, H-2 sebelum tenggat laporan berkala ke regulator. Semua angka sudah direkonsiliasi: total aset klop, laba klop, selisih nol koma nol. Laporan dikirim dengan percaya diri. Dua hari kemudian balasan datang: DITOLAK. Bukan karena angkanya salah — melainkan karena kolom kode mata uang berisi campuran `IDR`, `Rp`, `360`, dan `ID R` dalam satu file yang sama. Sistem regulator hanya menerima kode ISO 4217 tiga huruf. Twist-nya: tidak ada satu pun angka yang keliru. Yang gagal adalah hal terkecil di file itu — tiga huruf yang dianggap “sepele” oleh setiap tim yang menyentuhnya.",
        "Akar masalahnya klasik: setiap sistem di bank itu punya kamus kode sendiri. Core banking memakai `IDR`, sistem treasury memakai `360` (kode numerik ISO), aplikasi trade finance yang lama memakai `Rp`. Selama bertahun-tahun, tim ETL “membereskan” perbedaan ini dengan mapping manual di spreadsheet — sampai seseorang cuti, spreadsheet-nya tidak terupdate, dan satu kode baru lolos tanpa terpetakan. Inilah wilayah reference data: himpunan kecil nilai yang diizinkan — kode negara, kode mata uang, status transaksi, jenis produk — yang dipakai semua sistem untuk berbicara dalam bahasa yang sama.",
        "DAMA DMBOK menempatkan Reference and Master Data sebagai salah satu knowledge area tata kelola data — dan membedakannya dengan tegas. Master data menjawab “siapa” (nasabah, produk, rekening — entitas bisnis yang butuh satu versi kebenaran). Reference data menjawab “pakai kode apa” (klasifikasi dan daftar nilai yang diizinkan). Di lesson ini kamu belajar mengelola yang kedua: dari definisi, standar kode internasional, sampai governance yang membuat satu kode baru tidak bisa muncul diam-diam.",
      ],
      tasks: [],
      note: {
        title: "Kenapa topik “kecil” ini menentukan nasib laporan",
        type: "risk",
        body: "Reference data jarang masuk slide presentasi, tapi ia duduk di setiap JOIN dan setiap GROUP BY laporanmu. Satu kode tak terpetakan = satu baris hilang dari agregat, satu selisih rekonsiliasi yang dikejar tiga hari, atau satu penolakan regulator. Biaya memperbaikinya di hulu (satu tabel referensi terkelola) selalu lebih murah daripada di hilir (debugging laporan).",
      },
      reference: "Master data = “siapa” (entitas bisnis). Reference data = “pakai kode apa” (daftar nilai yang diizinkan).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membedakan reference data dari master data dan transactional data, dengan contoh konkret tiap jenis; (2) memakai standar kode internasional (ISO 3166 untuk negara, ISO 4217 untuk mata uang) dan menjelaskan kapan memakai kode internal vs kode standar; (3) merancang tabel referensi yang aman — dengan effective dating dan proses penambahan kode baru; (4) menghitung match rate kode dan menafsirkannya sebagai metrik kualitas.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (hakikat reference data; standar & mapping kode) → lab Python (validator kode + match rate) → chart sebelum/sesudah tata kelola → peta keputusan → mini-case laporan regulator → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari dunia master data: golden record adalah satu versi kebenaran untuk entitas bisnis (satu nasabah = satu identitas), dibangun lewat pencocokan dan survivorship antar sistem. Reference data lebih sederhana tetapi lebih luas jangkauannya: ia bukan tentang entitas, melainkan tentang kosakata — daftar nilai yang boleh dipakai semua sistem. Bedanya dengan data transaksional: transaksi lahir setiap detik (transfer, order) dan bersifat historis; reference data berubah jarang (kode negara baru muncul mungkin sekali per dekade) tetapi dipakai oleh setiap transaksi.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: kalau sebuah tabel berubah ribuan kali sehari, itu transaksi. Kalau berubah beberapa kali setahun tetapi dibaca jutaan kali sehari, itu reference data. Frekuensi baca-tulisnya terbalik — dan itu menentukan cara mengelolanya.",
      ],
      reference: "Bekal: (1) golden record = satu kebenaran untuk entitas; (2) reference data = kosakata bersama, jarang berubah, dibaca semua sistem.",
    },
    {
      id: "konsep-hakikat",
      eyebrow: "Langkah 3 · Konsep",
      title: "Reference Data — Si Kamus Kecil yang Didikte ke Semua Orang",
      prose: [
        "Definisi: reference data adalah himpunan nilai yang diizinkan (allowed values) yang dipakai untuk mengklasifikasikan atau mengkategorikan data lain — kode negara, kode mata uang, status order (`NEW`, `PAID`, `SHIPPED`), jenis kelamin, kode cabang, kategori produk. Ia bukan data tentang sesuatu yang terjadi (itu transaksi) dan bukan data tentang seseorang/sesuatu yang spesifik (itu master data) — ia adalah kosakatanya.",
        "Kepribadiannya: reference data itu seperti kamus di ruang redaksi koran — kecil, jarang berubah, tetapi setiap wartawan wajib memakainya supaya ejaannya konsisten. Tanpa kamus bersama, tiap redaktur “membetulkan” ejaan seenaknya dan koran terbit dengan lima versi nama yang sama. Di perusahaan, “redakturnya” adalah puluhan sistem dan ratusan analis; kamusnya adalah tabel referensi terpusat. Sifat kuncinya ada tiga: (1) dipakai lintas sistem — satu definisi untuk semua; (2) relatif statis — berubah lewat proses resmi, bukan edit diam-diam; (3) menjadi kunci JOIN — kode adalah jembatan antar tabel, jadi inkonsistensi kode = baris yang hilang dari laporan.",
        "Kapan memakai tabel referensi terkelola: setiap kali sebuah kolom hanya boleh berisi nilai dari daftar tertutup. Contoh nyata: kolom `status_klaim` di asuransi hanya boleh berisi 8 nilai baku; kolom `kode_negara` hanya ISO 3166 alpha-3; kolom `jenis_transaksi` hanya dari daftar yang disetujui tim risiko. Kalau daftarnya “bebas diisi apa saja”, bersiaplah menemukan `Aktif`, `aktif`, `ACTIVE`, `A`, dan `1` untuk hal yang sama.",
      ],
      formula: String.raw`\text{match rate} = \frac{\text{baris dengan kode valid}}{\text{total baris}} \times 100\%`,
      formulaNote: "Metrik kesehatan reference data yang paling jujur. Pembilang = baris yang kodenya ditemukan di tabel referensi resmi; penyebut = semua baris yang diperiksa. Contoh: 9.600 dari 10.000 baris transaksi punya kode mata uang valid → match rate 96%. Interpretasi: 4% baris tidak bisa diagregasi dengan benar — untuk laporan regulator, 4% adalah jurang, bukan selisih.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Reference data = master data, sama saja”",
        type: "pitfall",
        body: "Yang benar: keduanya dikelola bersama dalam DMBOK, tetapi objeknya beda. Master data = entitas bisnis (nasabah Andi, produk TabunganKu) yang butuh pencocokan identitas dan golden record. Reference data = kosakata klasifikasi (kode `ID`, status `PAID`) yang butuh daftar nilai baku dan mapping. Menyamakan keduanya membuat tim membangun entity resolution untuk masalah yang sebenarnya cuma butuh tabel lookup.",
      },
      hints: [
        "💡 Intuisi: uji cepatnya — tanya “apakah baris ini mewakili sesuatu yang nyata di dunia (nasabah, rekening)?” → master data. “Apakah baris ini cuma label/kode untuk mengelompokkan hal lain?” → reference data.",
      ],
      reference: "Reference data = kosakata bersama: daftar nilai yang diizinkan, dipakai lintas sistem, berubah lewat proses resmi.",
    },
    {
      id: "konsep-standar",
      eyebrow: "Langkah 4 · Konsep",
      title: "Standar Kode & Mapping — Si Penerjemah Universal",
      prose: [
        "Definisi: standar kode adalah daftar nilai yang disepakati industri atau dunia — ISO 3166 untuk negara (`ID` alpha-2, `IDN` alpha-3, `360` numerik), ISO 4217 untuk mata uang (`IDR`/`360` untuk Rupiah), SWIFT/BIC untuk bank. Mapping adalah tabel penerjemah antara kode internal perusahaan dan kode standar: `Rp` (internal lama) → `IDR` (ISO).",
        "Kepribadiannya: standar kode itu seperti bahasa Inggris di bandara internasional — bukan bahasa ibu siapa pun, tetapi semua menara kontrol memakainya supaya pesawat tidak tabrakan. Kode internal perusahaan (`CAB-01-JKT`) boleh hidup di dalam sistem operasional, tetapi saat data keluar — ke regulator, ke mitra, ke data warehouse — ia wajib diterjemahkan ke standar. Mapping table adalah kamus dwibahasanya, dan kamus ini harus berversi: kode bisa berubah makna (Sudan terpecah → `SD` dan `SS`), sehingga tabel mapping butuh effective date (berlaku sejak kapan).",
        "Kapan memakai kode internal vs standar: pakai kode internal di dalam sistem operasional bila memang sudah terlanjur (migrasi mahal), TETAPI selalu sediakan mapping resmi ke standar di lapisan integrasi/warehouse. Jangan pernah biarkan tiap tim membuat mapping sendiri di spreadsheet — itu pabrik inkonsistensi. Satu tabel mapping resmi, berversi, dengan pemilik yang jelas.",
      ],
      formula: String.raw`\text{biaya mapping liar} \approx n \times m \times c`,
      formulaNote: "n = jumlah sistem sumber, m = jumlah sistem konsumen, c = biaya memelihara satu mapping per pasangan. Tanpa tabel referensi pusat, tiap pasangan sistem–konsumen butuh mapping sendiri: 6 sistem × 5 konsumen = 30 mapping liar. Dengan hub referensi pusat, cukup n + m = 11 mapping. Rumus ini menjelaskan kenapa “spreadsheet mapping tiap tim” selalu berakhir sebagai tumpukan utang teknis.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Kode internal kita sudah rapi, tidak perlu standar ISO”",
        type: "pitfall",
        body: "Yang benar: kerapian internal tidak membantu saat data harus keluar — laporan regulator, pertukaran data dengan mitra, merger dengan perusahaan lain. Standar ISO adalah kontrak dengan dunia luar. Perusahaan yang hanya punya kode internal akan membayar “pajak penerjemah” setiap kali berkolaborasi, dan pajak itu dibayar dengan lembur tim pelaporan.",
      },
      hints: [
        "💡 Intuisi: simpan BOTH — kode internal (untuk kompatibilitas sistem lama) DAN kode standar (untuk dunia luar) dalam satu tabel referensi. Kolomnya: kode_internal, kode_iso, deskripsi, berlaku_sejak, berlaku_sampai, status. Tidak pernah hapus baris lama — tandai tidak aktif.",
      ],
      reference: "Internal boleh hidup di operasional; standar wajib di pintu keluar. Mapping = tabel resmi berversi, bukan spreadsheet tiap tim.",
    },
    {
      id: "lab-validator",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Validator kode & match rate",
      prose: [
        "Waktunya jadi steward datanya. Di bawah ada daftar transaksi (sintetis) dengan kolom kode mata uang yang “kotor” — campuran kode ISO, kode internal lama, dan salah ketik. Tugasmu: tulis validator yang memeriksa setiap kode terhadap tabel referensi resmi, hitung match rate, dan daftarkan kode-kode liar yang lolos.",
        "Coba: setelah lolos, tambahkan satu kode internal lama yang valid ke tabel referensi (mis. “Rp” → “IDR”) dan lihat match rate naik. Lalu coba sebaliknya: hapus “360” dari referensi — perhatikan berapa banyak baris treasury yang mendadak “liar”. Itulah kenapa tabel referensi tidak boleh diubah diam-diam.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `validasi(kode)`: True bila kode ada di `REF` (kunci) atau di nilai mapping-nya" },
        { id: "t2", text: "Hitung `match` = jumlah transaksi dengan kode valid" },
        { id: "t3", text: "Hitung `match_rate` = match / total * 100" },
        { id: "t4", text: "Kumpulkan `liar` = daftar kode unik yang tidak valid" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "match rate: 70.0% (7/10)\nkode liar: ['Rp', '360', 'ID R']",
      code: {
        starter: `# Tabel referensi resmi (TERKUNCI — ini "kamus" yang disepakati)
REF = {"IDR": "IDR", "USD": "USD", "SGD": "SGD", "EUR": "EUR", "JPY": "JPY"}

# Transaksi harian cabang (SINTETIS — campuran kode benar, internal lama, salah ketik)
transaksi = [
    {"id": "T001", "kode": "IDR"}, {"id": "T002", "kode": "USD"},
    {"id": "T003", "kode": "Rp"},  {"id": "T004", "kode": "IDR"},
    {"id": "T005", "kode": "360"}, {"id": "T006", "kode": "SGD"},
    {"id": "T007", "kode": "ID R"}, {"id": "T008", "kode": "EUR"},
    {"id": "T009", "kode": "IDR"}, {"id": "T010", "kode": "JPY"},
]

# TULIS KODEMU DI BAWAH INI
def validasi(kode):
    return

match = 0  # TODO: hitung jumlah transaksi berkode valid

match_rate = 0.0  # TODO: match / len(transaksi) * 100

liar = []  # TODO: daftar kode unik yang tidak valid

print(f"match rate: {match_rate:.1f}% ({match}/{len(transaksi)})")
print(f"kode liar: {liar}")`,
        lockLines: 13,
        solution: `# Tabel referensi resmi (TERKUNCI — ini "kamus" yang disepakati)
REF = {"IDR": "IDR", "USD": "USD", "SGD": "SGD", "EUR": "EUR", "JPY": "JPY"}

# Transaksi harian cabang (SINTETIS — campuran kode benar, internal lama, salah ketik)
transaksi = [
    {"id": "T001", "kode": "IDR"}, {"id": "T002", "kode": "USD"},
    {"id": "T003", "kode": "Rp"},  {"id": "T004", "kode": "IDR"},
    {"id": "T005", "kode": "360"}, {"id": "T006", "kode": "SGD"},
    {"id": "T007", "kode": "ID R"}, {"id": "T008", "kode": "EUR"},
    {"id": "T009", "kode": "IDR"}, {"id": "T010", "kode": "JPY"},
]

# TULIS KODEMU DI BAWAH INI
def validasi(kode):
    return kode in REF or kode in REF.values()

match = sum(1 for t in transaksi if validasi(t["kode"]))

match_rate = match / len(transaksi) * 100

liar = sorted({t["kode"] for t in transaksi if not validasi(t["kode"])})

print(f"match rate: {match_rate:.1f}% ({match}/{len(transaksi)})")
print(f"kode liar: {liar}")`,
        checks: [
          { kind: "equal", task: "t2", name: "match", value: 7, tol: 0, label: "`match` harus 7", msg: "7 dari 10 transaksi berkode valid (IDR, USD, SGD, EUR, JPY). 'Rp', '360', 'ID R' tidak ada di REF." },
          { kind: "equal", task: "t3", name: "match_rate", value: 70.0, tol: 0.01, label: "`match_rate` harus 70,0", msg: "7/10 × 100 = 70,0%." },
          { kind: "contains", task: "t4", name: "liar", value: "Rp", label: "`liar` memuat 'Rp'", msg: "'Rp' adalah kode internal lama yang tidak ada di tabel referensi resmi." },
          { kind: "stdout_matches", task: "t5", pattern: "match rate: 70\\.0% \\(7/10\\)", label: "Ringkasan match rate tercetak", msg: "Format: 'match rate: 70.0% (7/10)'." },
          { kind: "stdout_matches", task: "t5", pattern: "kode liar:", label: "Daftar kode liar tercetak", msg: "Baris kedua harus mencetak daftar kode liar." },
        ],
      },
      reference: "Validator = penjaga pintu: setiap kode dicek ke tabel referensi SEBELUM masuk warehouse.",
    },
    {
      id: "chart-match",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart match rate seperti data steward",
      prose: [
        "Chart di bawah membandingkan match rate kode di tiga sistem — sebelum (abu-abu) dan sesudah (biru) tabel referensi terpusat diberlakukan.",
        "Cara membaca: sumbu Y = match rate (persen baris dengan kode valid); tiap sistem punya dua batang berdampingan — abu = sebelum tata kelola, biru = sesudah; garis putus-putus = target minimal 99%.",
        "Interpretasi: sebelum tata kelola, ketiga sistem berkisar 70–74% — artinya seperempat baris tidak terpetakan dengan benar, dan tiap tim “menambal” dengan caranya sendiri. Sesudah satu tabel referensi resmi diberlakukan (dengan mapping ISO + proses penambahan kode), ketiganya melonjak ke 95–96% — belum 100% karena selalu ada kode baru yang antre diproses, tetapi gap-nya kini terpantau, bukan misteri. Satu detail yang mudah terlewat: garis target 99% bukan garis finish \u2014 ia garis waspada. Sistem yang bertahan di 99,5% selama setahun tanpa pernah menyentuh 99% mungkin menyembunyikan kode liar di kategori lainnya; sistem yang berfluktuasi 97\u201399% tetapi tiap penurunan diikuti investigasi tercatat justru lebih sehat. Minta juga trennya, bukan snapshot-nya: match rate bulan ini 98% tidak berarti apa-apa tanpa tahu bulan lalu 96% (membaik) atau 99,2% (memburuk). Pelajaran chart ini: reference data governance tidak menghilangkan kode liar — ia mengubahnya dari “tidak diketahui” menjadi “terdaftar dan terpantau”.",
      ],
      figure: {
        svg: MATCH_SVG,
        alt: "Diagram batang: match rate sebelum vs sesudah tata kelola di tiga sistem — Core Banking 72%→96%, Treasury 74%→95%, Trade Finance 70%→96%. Target 99%.",
        caption: "Match rate kode sebelum (abu) vs sesudah (biru) tabel referensi terpusat (ilustrasi). Garis putus-putus = target 99%.",
      },
      tasks: [],
      note: {
        title: "Intuisi: baca chart ini sebagai kurva kepercayaan",
        body: "Cara membaca chart ini yang membedakan steward junior dari senior: batang biru bukan sekadar kualitas \u2014 ia kurva kepercayaan. Heuristiknya: kejar tren, bukan angka absolut. Match rate yang naik dua poin per bulan menuju 99% lebih sehat daripada 99% yang stagnan tetapi rapuh \u2014 karena yang pertama menunjukkan proses penambahan kode yang hidup (kode baru tertangkap, dipetakan, masuk tabel referensi), sedangkan yang kedua sering menyembunyikan kode liar di kategori lainnya. Pertanyaan steward yang tepat saat melihat chart ini bukan berapa angkanya, melainkan: kode apa yang mengisi selisih menuju 100%, siapa pemiliknya, dan kapan ia diproses. Chart yang tidak bisa menjawab tiga pertanyaan itu adalah dekorasi.",
      },
      reference: "Target 99%: 100% tidak realistis (selalu ada kode baru antre), tetapi di bawah 99% berarti kebocoran.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kode baru muncul — apa yang kamu lakukan?",
      prose: [
        "Empat skenario yang dihadapi steward data setiap bulan:",
        "Skenario 1 — Tim produk meluncurkan kategori baru “PayLater Syariah” dan butuh kode minggu ini. → Tambahkan via proses resmi: ajukan kode, cek bentrok dengan daftar existing, tetapkan mapping ISO bila relevan, beri effective date. Alasan: kode yang lahir tanpa registrasi menjadi kode liar permanen — minggu ini “darurat”, tahun depan “kenapa ada 3 kode paylater?”.",
        "Skenario 2 — Sistem lama memakai kode internal yang tidak ada padanannya di ISO (mis. kode cabang historis). → Simpan kode internal + mapping ke standar terdekat di tabel referensi, tandai asal-usulnya. Alasan: menghapus sejarah merusak rekonsiliasi masa lalu; yang benar adalah mendokumentasikan, bukan memusnahkan.",
        "Skenario 3 — Dua tim memakai kode berbeda untuk hal yang sama (`Aktif` vs `ACTIVE`). → Pilih satu sebagai kanonis, mapping yang lain sebagai alias, umumkan tanggal migrasi. Alasan: duplikasi kosakata = duplikasi definisi metrik — dashboard dua tim tidak akan pernah akur.",
        "Skenario 4 — Regulator menerbitkan daftar kode baru (mis. pembaruan kategori laporan). → Perlakukan sebagai rilis: versioning tabel referensi, uji mapping ke data historis, rollback plan. Alasan: perubahan eksternal yang dipaksakan adalah penyebab #1 laporan ditolak — kesiapan diukur dari seberapa cepat mapping baru bisa live.",
        "Aturan praktis 10 detik: kode baru? → (1) sudah ada di tabel referensi? (2) kalau belum, ajukan — jangan hardcode; (3) butuh mapping ISO? (4) beri effective date; (5) umumkan ke semua konsumen.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambah kode langsung di tabel produksi “karena darurat” tanpa melewati tabel referensi. Daruratnya selesai hari ini; kode liarnya hidup selamanya — setiap analis berikutnya harus menebak artinya. Kalau memang darurat, tambahkan ke tabel referensi DENGAN status sementara dan tanggal kedaluwarsa, bukan bypass.",
      },
      reference: "Tidak ada kode yang lahir di luar tabel referensi — bahkan yang darurat sekalipun.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Laporan LBU yang ditolak: 10.000 baris, 3% kode liar",
      prose: [
        "Skenario (sintetis, untuk latihan — angka dan banknya fiktif): Bank Nusantara Syariah menyiapkan laporan berkala 10.000 baris transaksi valas. Validasi internal menemukan 300 baris (3%) memakai kode tidak baku: 120 baris `Rp`, 110 baris `360`, 70 baris salah ketik (`ID R`, `idr`, `USDD`). Tim pelaporan punya dua opsi: (A) kirim apa adanya — “hanya 3%”; (B) tunda 2 hari untuk memetakan dan memvalidasi ulang.",
        "Pertanyaan analisis: (1) Berapa match rate saat ini, dan apa risikonya bila dikirim? (2) Dari 300 baris liar, mana yang bisa dipetakan otomatis vs butuh investigasi? (3) Kebijakan apa yang mencegah kejadian ini terulang bulan depan?",
        "Pembahasan: (1) Match rate = 9.700/10.000 = 97% — di bawah target 99%, dan untuk laporan regulator 3% adalah 300 baris yang berpotensi ditolak atau salah agregat. Risiko opsi A: penolakan file (seperti cerita pembuka) atau — lebih buruk — file diterima tetapi 300 baris masuk kategori “lainnya”, merusak angka cadangan dan rasio. (2) `Rp` → `IDR` dan `360` → `IDR` bisa dipetakan otomatis karena polanya konsisten dan terdokumentasi di sistem sumber; 70 salah ketik butuh investigasi — `idr` kemungkinan besar `IDR`, tetapi `USDD` ambigu (salah ketik `USD`? kode internal lain?). Aturan: mapping otomatis hanya untuk pola yang sudah terdaftar; sisanya investigasi manual, tidak boleh tebak. (3) Pencegahannya: validasi kode di pintu masuk (seperti lab lesson ini) untuk setiap sistem sumber, tabel referensi terpusat dengan proses penambahan kode, dan match rate sebagai KPI bulanan tiap pemilik sistem — bukan KPI tim pelaporan.",
        "Catatan biaya: dua hari penundaan terasa mahal — sampai dibandingkan dengan denda keterlambatan + reputasi + tiga hari debugging bulan depan. Reference data governance adalah asuransi yang preminya dibayar di muka.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "300 baris liar bukan masalah “data quality” abstrak — di laporan keuangan, itu 300 baris yang angkanya bisa salah tempat. Analis risiko yang menandatangani laporan dengan match rate 97% sedang menandatangani ketidakpastian 3%. Tulis angkanya di memo, bukan di perasaan.",
      },
      reference: "97% match rate = 3% ketidakpastian yang ditandatangani. Untuk regulator, itu terlalu besar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Reference data = kosakata bersama: himpunan nilai yang diizinkan (kode negara, kode mata uang, status) yang dipakai lintas sistem untuk klasifikasi.",
        "Beda dari master data (entitas bisnis: siapa) dan data transaksional (kejadian: apa yang terjadi); reference data jarang berubah tetapi dibaca semua sistem.",
        "Standar kode (ISO 3166, ISO 4217) adalah kontrak dengan dunia luar; kode internal boleh hidup di operasional asal ada mapping resmi berversi.",
        "Match rate = baris berkode valid / total baris × 100%; target operasional ≥ 99% — di bawah itu ada kebocoran yang harus dijelaskan.",
        "Governance: tidak ada kode yang lahir di luar tabel referensi; penambahan via proses resmi dengan effective date; kode lama tidak dihapus, ditandai tidak aktif.",
      ],
      quiz: [
        {
          q: "Manakah yang merupakan reference data?",
          options: [
            { text: "Daftar kode status order: NEW, PAID, SHIPPED, CANCELLED", why: "Benar: ini himpunan nilai yang diizinkan untuk mengklasifikasikan order — kosakata, bukan entitas, bukan kejadian.", correct: true },
            { text: "Data nasabah Andi: nama, alamat, nomor KTP", why: "Salah: ini master data — entitas bisnis spesifik yang butuh golden record dan entity resolution." },
            { text: "Riwayat transfer rekening bulan ini", why: "Salah: ini transactional data — kejadian yang lahir setiap detik dan bersifat historis." },
            { text: "Foto KTP yang diunggah saat onboarding", why: "Salah: ini unstructured content/document — wilayah document management, bukan daftar nilai baku." },
          ],
        },
        {
          q: "Match rate kode mata uang = 97%. Interpretasi yang tepat untuk laporan regulator?",
          options: [
            { text: "3% baris tidak terpetakan — terlalu besar untuk laporan regulator; investigasi dan petakan sebelum kirim", why: "Benar: 3% dari 10.000 baris = 300 baris yang agregatnya tidak bisa dipercaya. Target operasional ≥ 99%.", correct: true },
            { text: "97% sudah bagus, kirim saja", why: "Salah: “bagus” bukan standar regulator. 3% ketidakpastian pada angka keuangan adalah risiko penolakan atau salah saji." },
            { text: "Hapus 3% baris liar agar laporan 100% bersih", why: "Salah: menghapus baris = memalsukan laporan. Baris liar harus dipetakan/diperbaiki, bukan dibuang." },
            { text: "97% berarti sistem pelaporan berfungsi normal", why: "Salah: match rate mengukur kualitas kode di SUMBER, bukan kinerja sistem pelaporan. Jangan baca metrik yang salah." },
          ],
        },
        {
          q: "Tim produk butuh kode kategori baru “minggu ini juga, darurat”. Respons steward yang benar?",
          options: [
            { text: "Tambahkan ke tabel referensi via jalur cepat dengan status sementara + tanggal kedaluwarsa, tetap tercatat", why: "Benar: darurat diakomodasi TANPA bypass — kode tetap lahir di dalam tabel referensi, terpantau, dan kedaluwarsa bila tidak dikonfirmasi.", correct: true },
            { text: "Tambahkan langsung di tabel produksi, dokumentasi menyusul", why: "Salah: “menyusul” tidak pernah terjadi. Kode liar yang lahir hari ini menjadi misteri permanen tahun depan." },
            { text: "Tolak — kode baru hanya boleh tiap kuartal", why: "Salah: rigiditas ekstrem membuat tim bypass diam-diam. Governance yang baik punya jalur cepat resmi." },
            { text: "Minta tim produk pakai kode existing yang “mirip”", why: "Salah: memaksa kode yang mirip merusak makna data — “PayLater Syariah” bukan “PayLater”. Klasifikasi yang salah lebih buruk daripada kode baru." },
          ],
        },
        {
          q: "Perusahaan punya kode cabang internal sejak 1990-an tanpa padanan ISO. Perlakuan yang benar?",
          options: [
            { text: "Simpan kode internal + dokumentasikan asal-usulnya di tabel referensi; petakan ke standar terdekat bila ada", why: "Benar: sejarah tidak boleh dihapus (rekonsiliasi masa lalu butuh kode lama), tetapi harus didokumentasikan dan dipetakan, bukan dibiarkan liar.", correct: true },
            { text: "Hapus semua kode lama, ganti dengan kode ISO", why: "Salah: menghapus kode historis merusak kemampuan membaca data lama — arsip 30 tahun menjadi tidak terbaca." },
            { text: "Biarkan tiap sistem memakai versinya masing-masing", why: "Salah: ini kondisi awal masalahnya — n sistem × m konsumen mapping liar." },
            { text: "Kode internal tidak perlu masuk tabel referensi", why: "Salah: justru kode internal yang paling butuh didokumentasikan — ialah sumber utama kode liar." },
          ],
        },
        {
          q: "Kenapa tabel mapping kode butuh effective date (berlaku_sejak, berlaku_sampai)?",
          options: [
            { text: "Karena makna kode bisa berubah (contoh: pemekaran negara) — data historis harus dibaca dengan mapping yang berlaku saat itu", why: "Benar: tanpa versioning, laporan 2010 yang dibaca ulang tahun ini bisa memakai pemetaan yang salah. Effective date membuat mapping bisa time-travel.", correct: true },
            { text: "Agar tabel terlihat profesional", why: "Salah: ini kebutuhan fungsional rekonsiliasi historis, bukan kosmetik." },
            { text: "Karena regulator mewajibkan format tanggal di semua tabel", why: "Salah: tidak ada kewajiban generik semacam itu; kebutuhannya berasal dari perubahan makna kode itu sendiri." },
            { text: "Supaya kode lama bisa dihapus otomatis", why: "Salah: kode lama TIDAK dihapus — ditandai tidak aktif. Effective date justru cara mempertahankannya dengan benar." },
          ],
        },
      ],
    },
  ],
};
