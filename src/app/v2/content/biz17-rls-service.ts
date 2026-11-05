import type { V2Lesson } from "../lib/types";

const RLSVIS_SVG = `<svg viewBox="0 0 520 234" role="img" aria-label="Baris terlihat per user: direksi 4, regional barat 2, dua regional 4, tanpa role 0.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/><line x1="150" y1="136" x2="500" y2="136"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">Bu Ani (Direksi)</text><rect x="150" y="20" width="350.0" height="18" fill="var(--c1)"/><text x="506" y="35">4</text>
<text x="140" y="75" text-anchor="end">Pak Budi (Barat)</text><rect x="150" y="60" width="175.0" height="18" fill="var(--c1)"/><text x="331" y="75">2</text>
<text x="140" y="115" text-anchor="end">Mbak Citra (2 role)</text><rect x="150" y="100" width="350.0" height="18" fill="var(--c1)"/><text x="506" y="115">4</text>
<text x="140" y="155" text-anchor="end">Pak Doni (tanpa role)</text><rect x="150" y="140" width="2.0" height="18" fill="var(--c1)"/><text x="158" y="155">0</text>
</g>
<text x="150" y="228" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="228" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">baris terlihat dari 4</text>
</svg>`;
export const biz17: V2Lesson = {
  slug: "biz17-rls-service",
  track: "Business Intelligence",
  module: "Power BI Mendalam",
  title: "BI17 — RLS + Administrasi Power BI Service",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Merchant yang melihat 2.100 milik tetangganya",
      prose: [
        "Marketplace MajuJaya punya dashboard merchant embedded (pelajaran BI12). Merchant B membuka dashboardnya dan melihat revenue Rp2.100 juta — padahal transaksinya sendiri Rp60 juta. Ia screenshot, kirim ke grup WhatsApp merchant, dan dalam 2 jam, 40 merchant tahu angka satu sama lain. Tim legal menelepon tim BI dengan satu pertanyaan: 'bagaimana ini bisa terjadi?'",
        "Investigasi: dashboard memakai 'filter di UI' — dropdown merchant yang di-set via JavaScript. Merchant B membuka developer tools, menghapus parameter merchant_id dari request API, dan mendapat agregat SEMUA tenant. Tidak ada hacking; hanya tidak ada pertahanan.",
        "Twist yang pahit: tim BI BERSIKERAS sudah 'menguji keamanan' — mereka login sebagai admin dan melihat filter bekerja. Tentu saja bekerja: admin memang boleh melihat semua! Mereka menguji dengan identitas yang salah. RLS yang diuji sebagai admin = tidak diuji.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan RLS sebagai filter di MODEL (DAX), bukan di UI; (2) merancang roles dan menguji sebagai role (bukan sebagai admin); (3) mengelola Power BI Service: workspace, gateway, scheduled refresh, deployment pipeline; (4) memilih incremental vs full refresh dengan hitungan.",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Menjelaskan kenapa filter UI bukan keamanan — dan di mana RLS yang benar ditegakkan;",
        "(2) Menulis role RLS (filter DAX per role) dan memetakan user ke role;",
        "(3) Menguji RLS dengan 'View as role' — menemukan kebocoran sebelum merchant menemukannya;",
        "(4) Merancang administrasi Service: workspace (dev/test/prod), gateway, refresh terjadwal;",
        "(5) Memutuskan full vs incremental refresh dari ukuran data dan SLA kesegaran.",
      ],
      tasks: [],
    },
    {
      id: "rls-model",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "RLS: filter yang tidak bisa dilepas",
      prose: [
        "Row-Level Security = filter DAX yang ditempel pada MODEL, dievaluasi di server untuk SETIAP query — tidak peduli dari mana query datang (dashboard, API, Excel, DAX Studio). Sintaks role: [Region] = \"Barat\" — user dengan role ini HANYA melihat baris Barat, bahkan jika ia menulis DAX manual.",
        "Contoh langkah-demi-langkah (dari lab 1): role 'Regional Barat' = filter (region, Barat). Pak Budi (role itu) melihat 2 dari 4 baris. Mbak Citra (dua role) melihat 4 baris — DAX menggabungkan filter multi-role dengan OR. Pak Doni (tanpa role) melihat 0 baris — default DENY.",
        "Dua pola implementasi: (a) STATIC — role per nilai ('Regional Barat', 'Regional Timur'); cocok untuk sedikit region. (b) DYNAMIC — satu role dengan USERPRINCIPALNAME() dicocokkan ke tabel mapping (user → region); cocok untuk ratusan merchant. Dynamic = 1 role untuk N tenant.",
        "💡 Intuisi kunci: RLS diuji sebagai ROLE, bukan sebagai admin. 'View as role' di Power BI Desktop adalah tombol paling penting di lesson ini — ia mensimulasikan mata tenant. Yang tidak pernah dites sebagai role = tidak aman.",
        "Kapan memakai: SEMUA data multi-tenant (merchant, cabang, region) yang disajikan bersama = RLS wajib. Tidak ada pengecualian 'nanti saja' — 'nanti' = insiden WhatsApp seperti cerita pembuka.",
      ],
      formula: String.raw`\text{Terlihat}(u) = \{d \in D : \bigvee_{r \in R(u)} F_r(d)\}`,
      formulaNote:
        "Baris terlihat oleh user u = baris d di dataset D yang lolos filter F_r dari SALAH SATU role r miliknya (OR antar role). Tanpa role = himpunan kosong (default DENY). Role dengan filter None (seperti Direksi) = semua baris.",
      note: {
        title: "🚨 Miskonsepsi: filter di UI/report sudah cukup untuk keamanan tenant",
        body: "Filter di slicer, dropdown, atau JavaScript = saran tampilan, bukan keamanan. API di belakangnya tetap melayani query tanpa filter jika diminta (bukti: merchant B + developer tools). Keamanan = di MODEL (RLS), ditegakkan server-side untuk semua jalur akses. UI boleh MEMBANTU (preselect filter), tetapi tidak boleh MENJAGA.",
      },
      tasks: [],
    },
    {
      id: "service-admin",
      eyebrow: "Langkah 4 · Service",
      title: "Power BI Service: dari file menjadi layanan",
      prose: [
        "File .pbix di laptopmu bukan layanan. Power BI Service = rumahnya: WORKSPACE (dev/test/prod — jangan campur!), GATEWAY (jembatan ke data on-premise; personal vs enterprise), SCHEDULED REFRESH (kapan data diperbarui), DEPLOYMENT PIPELINE (promosikan dev → test → prod dengan aturan).",
        "Contoh: workspace 'Penjualan-DEV' (analis bebas eksperimen) → 'Penjualan-TEST' (UAT dengan data prod tersamarkan) → 'Penjualan-PROD' (direksi; hanya admin yang publish). Deployment pipeline memindahkan dataset + report antar workspace dengan parameterisasi sumber data (dev menunjuk database dev!).",
        "Refresh: FULL (beban ulang semua — 800 MB = 25 menit) vs INCREMENTAL (hanya partisi baru/berubah — 1 hari = 2 menit; butuh kolom tanggal + kebijakan arsip). Aturan: full untuk < 1 GB atau butuh recompute total; incremental untuk data besar dengan SLA kesegaran ketat.",
        "💡 Intuisi kunci: gateway adalah single point of failure yang dilupakan. Satu gateway personal di laptop analis = refresh mati saat laptop mati. Untuk prod: enterprise gateway + cluster (high availability). Refresh yang gagal diam-diam = dashboard basi yang dipercaya.",
        "Kapan memakai: kapan pun laporan dipakai orang lain = Service (bukan file dishare via email). Email .pbix = versi liar + data basi + tidak ada RLS. Service = satu kebenaran, ter-refresh, terproteksi.",
      ],
      formula: String.raw`\text{Umur}_{\text{maks}} = \frac{24}{\text{refresh/hari}} \text{ jam}`,
      formulaNote:
        "Umur data maksimum = 24 jam dibagi frekuensi refresh. SLA 'tidak lebih tua dari 2 jam' → butuh 12 refresh/hari. Incremental 2 menit × 12 = 24 menit/hari — jauh di bawah jendela; full 25 menit × 12 = 300 menit = tidak muat. Inilah hitungan yang menentukan full vs incremental.",
      note: {
        title: "🚨 Miskonsepsi: publish = selesai",
        body: "Publish ke Service tanpa gateway yang benar (data on-premise), tanpa refresh terjadwal (data basi besok), tanpa RLS (data bocor), tanpa workspace terpisah (eksperimen dev terlihat direksi) = publish yang belum selesai. Checklist publish: gateway ✓, refresh ✓, RLS + test as role ✓, workspace prod ✓, pemilik + tanggal review ✓.",
      },
      tasks: [],
    },
    {
      id: "rls-vis",
      eyebrow: "Langkah 5 · Visual",
      title: "Siapa melihat apa: peta RLS",
      prose: [
        "Cara membaca: batang horizontal = jumlah baris terlihat dari 4 baris data. Bu Ani (Direksi): 4. Pak Budi (Regional Barat): 2. Mbak Citra (2 role): 4. Pak Doni (tanpa role): 0.",
        "Interpretasi: inilah RLS yang benar — tiap identitas melihat irisannya sendiri, ditegakkan di model. Perhatikan Pak Doni: 0 baris. Default DENY berarti 'lupa memberi role' = 'tidak melihat apa-apa' (aman), bukan 'melihat semua' (bencana). Desain yang gagal-aman (fail-safe).",
        "💡 Intuisi kunci: uji matriks ini untuk SETIAP role sebelum publish: buat tabel user × role × baris terlihat. Sel yang salah = kebocoran. Butuh 10 menit; menyelamatkan dari telepon tim legal.",
      ],
      figure: {
        svg: RLSVIS_SVG,
        alt: "Baris terlihat per user di bawah RLS: direksi 4, barat 2, dua role 4, tanpa role 0.",
        caption:
          "Matriks visibilitas RLS — diuji sebagai role, bukan sebagai admin.",
      },
      tasks: [],
    },
    {
      id: "lab-rls",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: evaluator RLS + detektor kebocoran",
      prose: [
        "Kamu adalah auditor keamanan sebelum publish. Diberi definisi ROLES, mapping USERS, dan DATA 4 baris.",
        "Tugasmu: tulis baris_untuk(user) yang menerapkan semantik RLS (OR antar role, default DENY, role tanpa filter = semua baris), hitung baris terlihat per user, dan deteksi role bocor (non-Direksi dengan filter None).",
        "Coba juga: ubah role 'Regional Timur' menjadi None. Siapa yang bocor sekarang? Satu None yang salah tempat = seluruh tenant Timur terlihat semua.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `baris_untuk(user)`: terapkan filter OR antar role (default DENY)" },
        { id: "t2", text: "Bangun `lihat`: dict user -> jumlah baris terlihat" },
        { id: "t3", text: "Isi `bocor`: role non-Direksi yang filternya None" },
      ],
      expected: "lihat={'bu_ani': 4, 'pak_budi': 2, 'mbak_citra': 4, 'pak_doni': 0}",
      note: {
        title: "Sering salah",
        body: "Menggabungkan filter multi-role dengan AND (irisan) alih-alih OR (gabungan). Mbak Citra (Barat + Timur) dengan AND = 0 baris (tidak ada baris yang Barat DAN Timur). DAX memakai OR.",
      },
      hints: [
        "Jika tidak ada role: return [].",
        "Jika ada role dengan filter None: return DATA.",
        "Selain itu: allowed = {filter tiap role}; kembalikan baris yang region-nya di allowed.",
      ],
      code: {
        starter: `# Roles RLS: (role, filter) -- filter None = TANPA filter (semua baris!)\nROLES = {\n    "Direksi": None,\n    "Regional Barat": ("region", "Barat"),\n    "Regional Timur": ("region", "Timur"),\n}\n# User -> roles (satu user bisa banyak role)\nUSERS = {\n    "bu_ani": ["Direksi"],\n    "pak_budi": ["Regional Barat"],\n    "mbak_citra": ["Regional Barat", "Regional Timur"],\n    "pak_doni": [],   # lupa diberi role!\n}\n# Data penjualan: (region, amount_jt)\nDATA = [("Barat", 120), ("Barat", 150), ("Timur", 200), ("Timur", 180)]\n# TULIS KODEMU: lihat, bocor\ndef baris_untuk(user):\n    ...\n\nlihat = {}\nbocor = []\n\nprint(f"lihat={lihat}")\nprint(f"bocor={bocor}")\n`,
        lockLines: 15,
        solution: `# Roles RLS: (role, filter) -- filter None = TANPA filter (semua baris!)\nROLES = {\n    "Direksi": None,\n    "Regional Barat": ("region", "Barat"),\n    "Regional Timur": ("region", "Timur"),\n}\n# User -> roles (satu user bisa banyak role)\nUSERS = {\n    "bu_ani": ["Direksi"],\n    "pak_budi": ["Regional Barat"],\n    "mbak_citra": ["Regional Barat", "Regional Timur"],\n    "pak_doni": [],   # lupa diberi role!\n}\n# Data penjualan: (region, amount_jt)\nDATA = [("Barat", 120), ("Barat", 150), ("Timur", 200), ("Timur", 180)]\n\n# TULIS KODEMU: lihat, bocor\ndef baris_untuk(user):\n    roles = USERS[user]\n    if not roles:\n        return []                      # tanpa role = tidak lihat apa-apa\n    if any(ROLES[r] is None for r in roles):\n        return DATA                    # ada role tanpa filter = semua\n    allowed = {ROLES[r][1] for r in roles}\n    return [d for d in DATA if d[0] in allowed]\n\nlihat = {u: len(baris_untuk(u)) for u in USERS}\n# bocor: role yang SEHARUSNYA memfilter tapi filternya None, atau user tanpa role yang bisa lihat\nbocor = [r for r, f in ROLES.items() if f is None and r != "Direksi"]\n\nprint(f"lihat={lihat}")\nprint(f"bocor={bocor}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "lihat=\\{'bu_ani': 4, 'pak_budi': 2, 'mbak_citra': 4, 'pak_doni': 0\\}", label: "`lihat` benar", msg: "Direksi 4, Barat 2, dua role 4, tanpa role 0." },
          { kind: "equal", task: "t3", name: "bocor", value: [], label: "`bocor` kosong", msg: "Tidak ada role non-Direksi tanpa filter." },
        ],
      },
      reference: "Semantik RLS: OR antar role, default DENY, tanpa filter = semua.",
    },
    {
      id: "lab-refresh",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: full atau incremental?",
      prose: [
        "Dataset 800 MB, SLA umur data <= 2 jam, 8 slot refresh @30 menit/hari.",
        "Tugasmu: cek apakah full refresh (25 mnt) muat di slot, hitung kebutuhan incremental per hari, dan beri saran strategi.",
        "Hasil: full MUAT di slot (25<=30) tetapi 12x sehari = 300 menit = tidak muat di hari. Incremental (2 mnt x 12 = 24 mnt/hari) adalah jawabannya. Inilah hitungan yang membedakan 'bisa refresh' dari 'bisa penuhi SLA'.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan `full_muat`: apakah full refresh muat di 1 slot?" },
        { id: "t2", text: "Hitung `incr_per_hari`: refresh per hari agar umur data <= 2 jam" },
        { id: "t3", text: "Tentukan `saran`: 'incremental' atau 'full'" },
      ],
      expected: "saran=incremental",
      note: {
        title: "Sering salah",
        body: "Menyimpulkan 'full_muat=True berarti full OK'. Muat di SATU slot belum berarti muat 12x sehari. SLA menentukan frekuensi; frekuensi menentukan strategi.",
      },
      hints: [
        "full_muat = FULL_MNT <= SLOT_MNT.",
        "incr_per_hari = 24 // SLA_JAM.",
        "Bandingkan total menit/hari dengan 24*60.",
      ],
      code: {
        starter: `# Dataset 800 MB. Full refresh: 25 menit. Incremental: refresh 1 hari = 2 menit.\n# Jendela refresh: 8 slot/hari @30 menit. SLA: data tidak lebih tua dari 2 jam.\nFULL_MNT, INCR_MNT, SLOT_MNT, SLA_JAM = 25, 2, 30, 2\n# TULIS KODEMU: full_muat, incr_per_hari, saran\nfull_muat = True\nincr_per_hari = 0\nsaran = ''\n\nprint(f"full_muat={full_muat}  incr_per_hari={incr_per_hari}  saran={saran}")\n`,
        lockLines: 3,
        solution: `# Dataset 800 MB. Full refresh: 25 menit. Incremental: refresh 1 hari = 2 menit.\n# Jendela refresh: 8 slot/hari @30 menit. SLA: data tidak lebih tua dari 2 jam.\nFULL_MNT, INCR_MNT, SLOT_MNT, SLA_JAM = 25, 2, 30, 2\n\n# TULIS KODEMU: full_muat, incr_per_hari, saran\nfull_muat = FULL_MNT <= SLOT_MNT\n# berapa kali incremental per hari agar umur data <= 2 jam?\nincr_per_hari = 24 // SLA_JAM\nsaran = "incremental" if (INCR_MNT <= SLOT_MNT and incr_per_hari * INCR_MNT <= 24 * 60) else "full"\n\nprint(f"full_muat={full_muat}  incr_per_hari={incr_per_hari}  saran={saran}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "full_muat", value: true, label: "`full_muat` = True", msg: "25 <= 30." },
          { kind: "equal", task: "t2", name: "incr_per_hari", value: 12, label: "`incr_per_hari` = 12", msg: "24/2." },
          { kind: "equal", task: "t3", name: "saran", value: "incremental", label: "`saran` = incremental", msg: "2 mnt x 12 muat; full 25 mnt x 12 tidak." },
        ],
      },
      reference: "Strategi refresh: umur data maksimum = 24 / frekuensi.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 8 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 RLS yang tidak pernah diuji sebagai role = tidak ada RLS. Jadwalkan 'audit sebagai role' tiap ada perubahan role — 10 menit yang mengalahkan 2 jam krisis WhatsApp.",
        "💡 Gateway prod = enterprise + cluster. Gateway personal di laptop = bom waktu: refresh mati saat laptop sleep, dan tidak ada yang tahu sampai direksi bertanya kenapa angka kemarin tidak berubah.",
        "💡 Satu dataset, banyak laporan > banyak dataset untuk tiap laporan. Dataset kanonis + RLS = satu kebenaran; dataset per laporan = 10 kebenaran yang perlahan berbeda (pelajaran BI11).",
      ],
      tasks: [],
      note: {
        title: "Intuisi: role workspace bukan pengganti RLS",
        body: "Row-Level Security memfilter BARIS — ia tidak mengatur siapa yang bisa MENGUBAH laporan. Dan di sinilah jebakan paling mahal Power BI Service: memberikan seseorang role Member atau Contributor di workspace \"agar bisa bantu\" — padahal RLS hanya ditegakkan penuh untuk Viewer. Member bisa membuat visual baru di atas dataset yang sama dan berpotensi melihat data yang seharusnya tidak ia lihat. Heuristik praktisinya keras: konsumen eksternal (merchant, klien, tenant) SELALU Viewer + RLS, tanpa pengecualian. Butuh mereka \"bisa eksplorasi\"? Beri Viewer dengan izin build di atas dataset yang SUDAH terfilter RLS — bukan Member di workspace. Aturan keduanya: uji sebagai role, bukan sebagai diri sendiri. Kamu sebagai admin tidak pernah melihat apa yang dilihat merchant — RLS tidak berlaku untukmu. Jadwalkan \"audit sebagai role\" setiap kali role berubah: masuk sebagai tiap role, catat baris yang terlihat, bandingkan dengan yang seharusnya. Sepuluh menit ini mengalahkan dua jam krisis pesan singkat saat merchant menelepon \"kok saya bisa lihat data tetangga?\" Jebakan tambahannya: \"View as role\" di Desktop tidak sama dengan RLS di Service — yang satu simulasi, yang satu penegakan. Selalu verifikasi di Service. Ingat asimetrinya: seribu fitur hebat membangun kepercayaan bertahun-tahun; satu kebocoran antar-tenant menghapusnya dalam sehari. RLS adalah kunci pintu — tetapi role workspace yang salah adalah jendela yang terbuka.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: keamanan & operasi",
      prose: [
        "Skenario 1 — Data multi-tenant (merchant/cabang) disajikan bersama. → RLS di MODEL (filter DAX per role). Alasan: ditegakkan server-side untuk semua jalur akses; filter UI bukan keamanan.",
        "Skenario 2 — Ratusan tenant (tidak praktis bikin ratusan role). → DYNAMIC RLS (1 role + USERPRINCIPALNAME dicocokkan ke tabel mapping). Alasan: 1 role untuk N tenant; tambah tenant = tambah baris mapping, bukan role baru.",
        "Skenario 3 — Laporan dipakai direksi (prod). → Workspace PROD terpisah + deployment pipeline + pemilik jelas. Alasan: eksperimen dev tidak boleh terlihat direksi; promosi terkontrol.",
        "Skenario 4 — Dataset besar + SLA kesegaran ketat. → INCREMENTAL refresh (butuh kolom tanggal). Alasan: hitungan umur data (lab 2); full refresh tidak muat di frekuensi yang dibutuhkan.",
        "Skenario 5 — Data on-premise harus di-refresh terjadwal. → ENTERPRISE GATEWAY (cluster). Alasan: personal gateway = single point of failure di laptop seseorang.",
        "Aturan praktis 10 detik: tanya 'siapa yang TIDAK boleh melihat baris ini?' Tidak ada jawaban → tidak butuh RLS. Ada jawaban → RLS di model + test as role. 'Kapan terakhir refresh?' Tidak tahu → scheduled refresh belum beres.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: Rp2.100 juta yang terlihat 40 merchant",
      prose: [
        "Marketplace MajuJaya, Maret 2026. Merchant B melihat Rp2.100 juta (bukan Rp60 juta miliknya), screenshot ke grup WhatsApp 40 merchant. Dampak: 3 merchant besar mengancam pindah platform ('data kami tidak aman'); tim legal menyiapkan surat; estimasi churn: 3 merchant x Rp500 juta/tahun = Rp1,5 M/tahun terancam.",
        "Akar masalah (investigasi 2 jam): filter merchant HANYA di UI (JavaScript set merchant_id). Tidak ada RLS di model. API melayani query tanpa filter dengan senang hati. Pengujian keamanan dilakukan sebagai admin (melihat semua = 'filter bekerja').",
        "Perbaikan (1 minggu): (a) RLS dynamic di model: 1 role + mapping user->merchant_id; (b) matriks uji user x baris terlihat (lab 1) sebagai checklist publish; (c) API tidak lagi menerima merchant_id sebagai parameter (identitas dari token). Biaya perbaikan: 1 minggu engineer (Rp15 juta) vs potensi churn Rp1,5 M/tahun.",
        "Pembahasan: keamanan yang 'diuji sebagai admin' = tidak diuji. RLS = filter di model + test as role + identitas dari token. Tiga lapis; hilangkan satu = insiden.",
        "💡 Intuisi kunci: keamanan data bukan fitur yang 'nanti saja'. Ia seperti rem: tidak terasa saat ada, fatal saat tidak ada. Dan seperti rem, ia harus diuji SEBELUM dibutuhkan.",
      ],
      tasks: [],
    },
    {
      id: "extract-vs-live",
      eyebrow: "Langkah 11 · Koneksi",
      title: "Extract vs live: memilih cara dasbor terhubung ke data",
      prose: [
        "Kantor pusat punya dasbor 'Penjualan real-time' yang dibanggakan direksi. Setiap direktur membukanya 20 kali sehari — dan setiap buka, dasbor itu menembakkan query 40 detik ke database produksi kasir. Senin pagi, kasir cabang mengeluh transaksi lemot. Bukan serangan, bukan bug: 12 direktur × 20 buka × query raksasa = database produksi yang disuruh melayani BI di jam sibuk. Dasbor 'real-time' yang melumpuhkan bisnis real-time.",
        "Dua model koneksi. LIVE (query langsung): dasbor bertanya ke sumber setiap kali dibuka. Datanya paling segar — harganya: beban di sumber, dasbor lambat saat query berat, dan sumber produksi menanggung traffic analis. EXTRACT (salinan terjadwal): satu tarikan besar per jadwal, dasbor membaca salinannya dengan cepat. Datanya sebasi jadwalnya — harganya: kamu memutuskan seberapa basi yang bisa diterima, dan jadwal refresh-nya bisa mati.",
        "Kegagalan khas extract bukan teknis, melainkan DIAM-DIAM: kredensial extract kedaluwarsa Jumat malam, tidak ada yang dapat alert, Senin pagi direksi membahas 'penjualan minggu ini' dari data Kamis. Dasbornya menampilkan angka kemarin dengan tanggal hari ini di slide. Mitigasinya dua lapis: (1) tampilkan 'Data per <timestamp>' yang JELAS di setiap dasbor — staleness yang diakui bukan kebohongan; (2) alert saat refresh gagal, bukan saat direksi bertanya.",
        "Mode campuran per tabel adalah jawaban dewasa: tabel dimensi kecil yang jarang berubah (daftar cabang) cukup extract sekali sehari; tabel fakta transaksi yang dibutuhkan hampir-segar bisa live atau extract tiap 15 menit. Satu dasbor boleh memakai keduanya — keputusan dibuat per TABEL, bukan per dasbor. Tabel yang jarang berubah tidak berhak membebani sumber setiap dibuka.",
        "💡 Intuisi kunci: extract = koran pagi yang diantar ke rumah — dibaca kapan saja, isinya kemarin. Live = menelepon wartawan setiap kali kamu membuka halaman. Keduanya mengabari; yang satu membuat wartawannya tidak bisa bekerja. Pertanyaan keputusannya selalu tiga: seberapa SEGAR data harusnya? Seberapa BERAT query-nya? SIAPA menanggung bebannya — database produksi atau gudang data?",
        "Kapan memakai: laporan operasional harian/bulanan = extract (segarnya cukup, bebannya kecil). Pemantauan insiden/monitoring yang benar-benar butuh menit-terkini = live, itupun ke replika/warehouse — bukan ke database produksi yang melayani pelanggan.",
      ],
      tasks: [
        { id: "t1", text: "Untuk dasbor 'Laporan bulanan direksi', pilih model koneksi dan jelaskan trade-off kesegaran vs bebannya" },
        { id: "t2", text: "Tulis checklist 3 lapis agar kegagalan extract tidak pernah diam-diam: timestamp, alert, dan apa lagi?" },
      ],
      expected: "Laporan bulanan = extract terjadwal; staleness diakui via 'Data per'; alert refresh gagal + pemilik jelas.",
      note: {
        title: "🚨 Miskonsepsi: live selalu lebih baik karena datanya paling baru",
        body: "Data 'paling baru' yang datang dengan harga: database produksi melambat, dasbor butuh 40 detik, dan tagihan komputasi membengkak. Untuk laporan bulanan, kesegaran menit tidak membeli apa-apa — hanya biaya. Yang benar: segar SESUAI KEBUTUHAN KEPUTUSAN. Lebih segar dari kebutuhan = pemborosan yang dibungkus kata 'real-time'.",
        type: "pitfall",
      },
      reference: "Extract: bayar sekali, baca berkali. Live: bayar setiap buka. Pilih per tabel.",
    },
    {
      id: "agregat-cache-biaya",
      eyebrow: "Langkah 12 · Biaya",
      title: "Agregat, caching, dan biaya warehouse",
      prose: [
        "Dasbor 'penjualan per region per bulan' milik direksi men-scan 900 juta baris transaksi setiap kali dibuka — hanya untuk menampilkan 12 angka. Inilah absurditas paling mahal di BI modern: komputasi raksasa untuk jawaban mungil. Tabel AGREGAT pra-hitung adalah obatnya: job malam menghitung ringkasannya sekali, dasbor membaca 400 baris. Kamu menukar RUANG (menyimpan ringkasan) dengan KECEPATAN dan UANG. Harga agregat: ia hanya sebaru job-nya, dan definisinya bisa menyimpang dari sumber jika tidak dijaga.",
        "CACHE adalah saudara agregat: server BI menyimpan hasil query dan menyajikannya ulang selama masa berlakunya. Cache 1 jam = data basi 1 jam SECARA DESAIN — dan itu sah, asal dasbornya JUJUR ('Data per 09:00'). Yang tidak sah: dua orang membuka dasbor yang sama di menit berbeda dan melihat angka berbeda tanpa penjelasan, lalu berdebat di rapat. Kunci cache yang salah = penyakit 'tiga dasbor tiga angka' versi waktu.",
        "Model biaya warehouse modern sederhana dan kejam: bayar per data yang DIPINDAI. Dasbor yang selalu live ke tabel raksasa tanpa agregat = tagihan yang tumbuh tiap buka. Anti-pola biayanya mudah dikenali: auto-refresh 5 menit untuk laporan BULANAN (siapa yang butuh angka bulanan diperbarui 288 kali sehari?); SELECT * dari dasbor (mengambil kolom yang tak pernah ditampilkan); me-refresh direktori seluruh perusahaan hanya untuk menghitung jumlah karyawan.",
        "Obatnya bukan 'jangan pakai dasbor', melainkan UKUR: catat byte terpindai per dasbor per bulan, ubah jadi rupiah, dan tagihkan laporannya ke pemilik dasbor. Bukan untuk menagih uang sungguhan — melainkan agar biayanya TERLIHAT oleh orang yang memilih desainnya. Pemilik dasbor yang melihat 'dasbormu Rp4,2 juta/bulan' tiba-tiba mau mendengar soal agregat.",
        "💡 Intuisi kunci: men-scan 1 TB untuk satu angka = menyetir truk ke seberang kota untuk membeli sebatang korek. Agregat = menyimpan korek di laci dapur. Cache = menulis jawabannya di papan tulis dan menghapusnya tiap jam. Semuanya soal: jangan bayar harga truk untuk urusan laci.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `biaya_live(d)`: tb_scan_live × query_hari × 30 × HARGA_PER_TB" },
        { id: "t2", text: "Tulis `biaya_extract(d)`: query ke agregat (0,01 TB) + extract sumber sekali sehari" },
        { id: "t3", text: "Hitung `total_live`, `total_extract`, dan `hemat` (selisihnya)" },
      ],
      expected: "HEMAT=$ 53,490",
      note: {
        title: "🚨 Miskonsepsi: biaya warehouse = masalah tim data",
        body: "Tagihan warehouse adalah JUMLAH dari keputusan setiap pembuat dasbor: live vs extract, agregat atau tidak, refresh tiap 5 menit atau tiap hari. Tim data hanya membayar tagihannya; yang menandatanganinya adalah desain dasbor. Dasbor tanpa pemilik biaya = biaya tanpa pemilik — dan biaya tanpa pemilik tidak pernah turun.",
        type: "pitfall",
      },
      hints: [
        "biaya_live = d['tb_scan_live'] * d['query_hari'] * 30 * HARGA_PER_TB.",
        "biaya_extract = (TB_AGREGAT * query_hari * 30 * HARGA) + (tb_extract_harian * 30 * HARGA).",
        "total = sum(... for d in DASBOARDS); hemat = total_live - total_extract.",
      ],
      code: {
        starter: `# Model biaya warehouse: bayar per TB data yang dipindai (HARGA = $5 per TB).\n# LIVE: tiap query dashboard memindai tabel penuh.\n# EXTRACT+AGREGAT: sumber dipindai SEKALI sehari (extract), query dashboard hanya menyentuh tabel agregat (0,01 TB).\nHARGA_PER_TB = 5\nTB_AGREGAT = 0.01\nDASBOARDS = [\n    {"nama": "ringkasan-eksekutif", "tb_scan_live": 0.8, "query_hari": 120, "tb_extract_harian": 0.8},\n    {"nama": "operasional-harian", "tb_scan_live": 0.3, "query_hari": 400, "tb_extract_harian": 0.3},\n    {"nama": "penjualan-regional", "tb_scan_live": 2.5, "query_hari": 60, "tb_extract_harian": 2.5},\n]\n# TULIS KODEMU: biaya_live(d), biaya_extract(d), total_live, total_extract, hemat\n`,
        lockLines: 11,
        solution: `# Model biaya warehouse: bayar per TB data yang dipindai (HARGA = $5 per TB).\n# LIVE: tiap query dashboard memindai tabel penuh.\n# EXTRACT+AGREGAT: sumber dipindai SEKALI sehari (extract), query dashboard hanya menyentuh tabel agregat (0,01 TB).\nHARGA_PER_TB = 5\nTB_AGREGAT = 0.01\nDASBOARDS = [\n    {"nama": "ringkasan-eksekutif", "tb_scan_live": 0.8, "query_hari": 120, "tb_extract_harian": 0.8},\n    {"nama": "operasional-harian", "tb_scan_live": 0.3, "query_hari": 400, "tb_extract_harian": 0.3},\n    {"nama": "penjualan-regional", "tb_scan_live": 2.5, "query_hari": 60, "tb_extract_harian": 2.5},\n]\n\n# TULIS KODEMU: biaya_live(d), biaya_extract(d), total_live, total_extract, hemat\ndef biaya_live(d):\n    return d["tb_scan_live"] * d["query_hari"] * 30 * HARGA_PER_TB\n\ndef biaya_extract(d):\n    query = TB_AGREGAT * d["query_hari"] * 30 * HARGA_PER_TB\n    extract = d["tb_extract_harian"] * 30 * HARGA_PER_TB\n    return query + extract\n\ntotal_live = sum(biaya_live(d) for d in DASBOARDS)\ntotal_extract = sum(biaya_extract(d) for d in DASBOARDS)\nhemat = total_live - total_extract\n\nprint(f"total_live=$ {total_live:,.0f}  total_extract=$ {total_extract:,.0f}  HEMAT=$ {hemat:,.0f}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "biaya_live", label: "`biaya_live` terdefinisi", msg: "Definisikan fungsi biaya_live(d)." },
          { kind: "defined", task: "t2", name: "biaya_extract", label: "`biaya_extract` terdefinisi", msg: "Definisikan fungsi biaya_extract(d)." },
          { kind: "equal", task: "t3", name: "total_live", value: 54900, label: "`total_live` = 54900", msg: "Jumlahkan biaya_live untuk ketiga dashboard." },
          { kind: "equal", task: "t3", name: "total_extract", value: 1410, label: "`total_extract` = 1410", msg: "Jumlahkan biaya_extract untuk ketiga dashboard." },
          { kind: "equal", task: "t3", name: "hemat", value: 53490, label: "`hemat` = 53490", msg: "hemat = total_live - total_extract." },
          { kind: "stdout_matches", task: "t3", pattern: "HEMAT=\\$ 53,490", label: "Output menampilkan HEMAT", msg: "Cetak HEMAT dengan format yang sama seperti contoh." },
        ],
      },
      reference: "Ukur biaya per dasbor; pemilik yang tidak tahu biayanya tidak bisa mengelolanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "RLS = filter DAX di MODEL (server-side); filter UI bukan keamanan.",
        "Uji RLS sebagai ROLE (View as role), bukan sebagai admin; default DENY = gagal-aman.",
        "Static role untuk sedikit tenant; dynamic RLS (USERPRINCIPALNAME + mapping) untuk ratusan.",
        "Service: workspace dev/test/prod + deployment pipeline; gateway enterprise bercluster untuk prod.",
        "Umur data maksimum = 24 / frekuensi refresh — hitungan ini menentukan full vs incremental.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Merchant memanggil API tanpa parameter tenant dan menerima agregat semua tenant. Perbaikan yang benar dan TAHAN LAMA?",
          options: [
            { text: "Tambahkan validasi JavaScript agar parameter wajib diisi", why: "JavaScript = client-side = bisa dilepas (developer tools). Validasi client bukan keamanan." },
            { text: "RLS di model (filter DAX per role) + identitas tenant dari token, bukan parameter", why: "Tepat: tiga lapis — filter di MODEL (server-side, semua jalur), identitas dari TOKEN (tidak bisa diutak-atik), test as role. Inilah yang membuat serangan merchant B mustahil, bukan sekadar terdeteksi.", correct: true },
            { text: "Sembunyikan endpoint API", why: "Security by obscurity: endpoint 'tersembunyi' tetap bisa ditemukan. Yang diamankan = otorisasinya, bukan alamatnya." },
            { text: "Minta merchant berjanji tidak mengutak-atik", why: "Keamanan berbasis janji = tidak ada keamanan. Sistem harus aman terhadap pengguna yang penasaran." },
          ],
        },
        {
          q: "Kapan memakai dynamic RLS (USERPRINCIPALNAME) alih-alih static roles?",
          options: [
            { text: "Selalu — dynamic lebih canggih", why: "'Selalu' salah: untuk 3 region, 3 static role lebih mudah dibaca dan diaudit daripada tabel mapping." },
            { text: "Saat tenant banyak (ratusan merchant) — 1 role + tabel mapping", why: "Tepat: static = N role untuk N tenant (tidak scalable); dynamic = 1 role + N baris mapping. Tambah merchant = tambah baris, bukan role. Skalabilitas adalah kriterianya.", correct: true },
            { text: "Saat tidak butuh keamanan", why: "Tidak butuh keamanan = tidak butuh RLS sama sekali. Dynamic vs static = soal skala, bukan soal butuh-tidaknya." },
            { text: "Saat datanya kecil", why: "Ukuran data tidak menentukan pola role. Jumlah tenant yang menentukan." },
          ],
        },
        {
          q: "Dataset 2 GB, SLA umur data <= 1 jam, slot refresh 30 menit, full refresh 45 menit. Keputusan?",
          options: [
            { text: "Full refresh 24x sehari", why: "45 menit > slot 30 menit = tidak muat BAHKAN sekali. 24x = mustahil." },
            { text: "Incremental refresh (butuh kolom tanggal + kebijakan partisi)", why: "Tepat: full tidak muat di slot (45>30) dan tidak muat 24x. Incremental: refresh hanya partisi terbaru (mis. 5 menit) x 24 = muat. Syaratnya kolom tanggal + setup incremental — investasi sekali, hemat selamanya.", correct: true },
            { text: "Naikkan slot jadi 60 menit", why: "Slot 60 menit x 24 = 24 jam penuh untuk refresh = tidak ada jeda + tetap tidak menyelesaikan bahwa 45 menit x 24 = 18 jam/hari terbuang. Mengakali slot, bukan menyelesaikan." },
            { text: "Turunkan SLA jadi 1 hari", why: "Mengubah SLA tanpa persetujuan bisnis = keputusan sepihak. SLA milik bisnis; tugasmu memenuhinya dengan arsitektur yang tepat." },
          ],
        },
        {
          q: "Tim menguji RLS dengan login sebagai admin dan 'filter bekerja'. Kesalahannya?",
          options: [
            { text: "Tidak ada — admin melihat semua berarti RLS jalan", why: "Admin melihat semua = filter TIDAK membatasi admin (atau tidak ada filter yang berlaku untuknya). Tes ini tidak membuktikan apa-apa tentang tenant." },
            { text: "Menguji dengan identitas yang salah — harus 'View as role' per tenant", why: "Tepat: RLS dievaluasi PER IDENTITAS. Admin punya filter None = melihat semua, selalu 'lolos'. Uji yang benar: simulasi sebagai tiap role (View as role) dan verifikasi matriks baris terlihat. Cerita pembuka = harga dari tes yang salah.", correct: true },
            { text: "Seharusnya tidak ada admin", why: "Admin tetap dibutuhkan (mengelola). Masalahnya bukan keberadaan admin, melainkan admin dipakai sebagai proxy uji tenant." },
            { text: "RLS tidak bisa diuji", why: "RLS SANGAT bisa diuji: View as role di Desktop + matriks user x baris (lab 1). 'Tidak bisa diuji' = alasan, bukan fakta." },
          ],
        },
        {
          q: "Workspace DEV, TEST, PROD untuk satu laporan. Alasan utamanya?",
          options: [
            { text: "Agar terlihat profesional", why: "Kosmestik bukan alasan arsitektur." },
            { text: "Isolasi: eksperimen dev tidak terlihat direksi; promosi terkontrol via deployment pipeline", why: "Tepat: DEV = bebas rusak; TEST = UAT dengan data tersamarkan; PROD = yang dilihat direksi. Deployment pipeline memindahkan dengan parameterisasi sumber (dev->db dev). Tanpa isolasi, 'coba-coba' tampil di rapat direksi.", correct: true },
            { text: "Agar bisa pakai 3 lisensi", why: "Lisensi tidak butuh 3 workspace. Alasan = isolasi perubahan, bukan lisensi." },
            { text: "Requirement Microsoft", why: "Bukan requirement — ini praktik terbaik. 'Requirement' bukan argumen; isolasi risiko adalah." },
          ],
        },
      ],
    },
  ],
};
