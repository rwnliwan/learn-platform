import type { V2Lesson } from "../lib/types";

// ── Figure: biaya simpan vs risiko hukum seiring waktu ─────────────────────
const RET_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Kurva biaya penyimpanan naik dan risiko hukum turun-naik terhadap masa retensi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<path d="M60,190 C160,185 260,150 360,120 S480,80 520,70" fill="none" stroke="var(--c1)" stroke-width="3"/>
<path d="M60,60 C140,70 200,90 280,150 S420,195 520,200" fill="none" stroke="var(--c2)" stroke-width="3" stroke-dasharray="7 5"/>
<circle cx="280" cy="140" r="5" fill="var(--text)"/>
<text x="292" y="132" font-size="11" fill="var(--text)" font-family="var(--font-ui)">titik retensi optimal</text>
<g font-size="11" font-family="var(--font-ui)">
<rect x="380" y="30" width="14" height="14" fill="none" stroke="var(--c1)" stroke-width="3"/>
<text x="400" y="42" fill="var(--text)">biaya simpan (naik)</text>
<rect x="380" y="52" width="14" height="14" fill="none" stroke="var(--c2)" stroke-width="3"/>
<text x="400" y="64" fill="var(--text)">risiko hukum (U)</text>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="60" y="226">terlalu pendek</text><text x="470" y="226">terlalu lama</text>
<text x="250" y="226">masa retensi →</text>
</g>
</svg>`;

export const dm23: V2Lesson = {
  slug: "dm23-retensi-arsip",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Retensi, Arsip & Penghapusan Defensif: Kebijakan yang Bisa Dipertahankan",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Perusahaan yang menyimpan segalanya — dan kalah karena itu",
      prose: [
        "Dalam sebuah sengketa ketenagakerjaan, perusahaan justru dirugikan oleh kebiasaannya sendiri: menyimpan SEMUA email selamanya “untuk jaga-jaga”. Tim hukum lawan meminta seluruh email manajer selama 7 tahun — dan menemukannya: tiga email lama berisi komentar kasar tentang penggugat, yang sudah tidak relevan dengan kebijakan saat ini tetapi masih tersimpan. Perusahaan kalah, dan denda membengkak. Twist-nya: kalau perusahaan itu punya jadwal retensi yang wajar (mis. email non-esensial dimusnahkan setelah 3 tahun) dan menjalankannya dengan konsisten, email-email itu sudah tidak ada secara sah — dan tidak ada yang bisa diminta. Menyimpan segalanya terasa aman; dalam litigasi, ia justru gudang amunisi untuk lawan.",
        "Inilah inti retensi dan penghapusan defensif (defensible disposition): menyimpan data selama diperlukan — tidak kurang (agar kewajiban hukum dan kebutuhan bisnis terpenuhi), tidak lebih (agar biaya, risiko kebocoran, dan eksposur litigasi terkendali). Arsip adalah tempat data menunggu masa retensinya habis dengan aman; pemusnahan adalah eksekusinya yang terdokumentasi.",
        "Di lesson ini kamu belajar merancang jadwal retensi, membedakan arsip vs backup vs data lake, dan mengeksekusi penghapusan yang bisa dipertahankan di depan auditor maupun pengadilan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa “simpan selamanya” adalah strategi yang kalah",
        type: "risk",
        body: "Setiap byte yang disimpan adalah byte yang bisa bocor, bisa diminta dalam litigasi (e-discovery), dan harus diamankan. “Jaga-jaga” tanpa jadwal retensi bukan kehati-hatian — ia menumpuk risiko sambil membayar biaya storage.",
      },
      reference: "Retensi = simpan selama perlu, tidak kurang, tidak lebih. Penghapusan defensif = musnah terjadwal + terdokumentasi + konsisten.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga pendorong jadwal retensi (kewajiban hukum, kebutuhan bisnis, risiko) dan cara menyeimbangkannya; (2) membedakan arsip, backup, dan data lake — tiga tempat yang sering tertukar; (3) merancang jadwal retensi sederhana per kategori data; (4) menghitung biaya retensi dan menafsirkan trade-off-nya.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (jadwal retensi; arsip vs backup vs penghapusan) → lab Python (mesin jadwal retensi + daftar musnah) → chart biaya vs risiko → peta keputusan → mini-case e-discovery → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari data lifecycle: data lahir, dipakai aktif, menjadi jarang dipakai, lalu seharusnya pensiun — retensi adalah aturan main masa pensiunnya. Dari document management: arsip adalah versi resmi yang dipertahankan dengan integritas terjamin (bukan sekadar “file lama”), dan record yang masuk masa retensi tidak boleh diubah. Prinsipnya sama di level data: yang dijadwalkan musnah harus benar-benar musnah — termasuk dari backup.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: retensi menjawab dua pertanyaan yang berlawanan — “berapa lama WAJIB disimpan?” (hukum/bisnis) dan “berapa lama BOLEH disimpan?” (risiko/privasi). Jadwal yang baik adalah titik temu keduanya.",
      ],
      reference: "Bekal: (1) lifecycle butuh aturan pensiun; (2) arsip = bukti berintegritas, bukan file lama.",
    },
    {
      id: "konsep-jadwal",
      eyebrow: "Langkah 3 · Konsep",
      title: "Jadwal Retensi — Si Wasit Tiga Kepentingan",
      prose: [
        "Definisi: jadwal retensi (retention schedule) adalah tabel resmi yang menetapkan, per kategori data: berapa lama disimpan, di mana (aktif/arsip), dan apa yang terjadi setelahnya (musnahkan/anonymisasi/perpanjang). Tiga pendorongnya: (1) kewajiban hukum — regulasi mewajibkan penyimpanan minimum (catatan keuangan, data nasabah bank, rekam medis punya masa simpan yang diatur); (2) kebutuhan bisnis — data masih dipakai operasional/analitik; (3) risiko — privasi, litigasi, dan biaya menuntut penghapusan tepat waktu.",
        "Contoh pemicu mulai hitung yang konkret: retensi email proyek 3 tahun dihitung sejak proyek ditutup (bukan sejak email dikirim); retensi data nasabah bank 10 tahun sejak akun ditutup (bukan sejak akun dibuka); retensi log keamanan 1 tahun sejak log dibuat. Salah menetapkan pemicu berarti seluruh tanggal musnah bergeser — dan auditor akan menguji justru titik ini: tunjukkan satu dataset dan buktikan tanggal musnahnya dihitung dari pemicu yang benar, bukan dari tanggal yang kebetulan ada di sistem.",
        "Kepribadiannya: jadwal retensi seperti wasit yang menengahi tiga pihak yang selalu bertengkar — Legal (“simpan 10 tahun!”), Bisnis (“datanya masih saya pakai!”), dan Risk/Privacy (“hapus sekarang!”). Tanpa wasit, yang menang adalah yang paling keras suaranya — biasanya “simpan selamanya”. Ciri jadwal yang baik: per kategori data (bukan satu angka untuk semua), ada pemilik tiap kategori, ada pemicu mulai hitung (sejak transaksi? sejak akun ditutup? sejak kontrak berakhir?), dan ada legal hold — penghentian sementara pemusnahan saat ada litigasi/audit berjalan.",
        "Kapan memakai: selalu, untuk setiap kategori data yang dikelola organisasi. Pengecualian: data yang memang diniatkan permanen (arsip sejarah perusahaan) — tetapi “permanen” pun harus keputusan sadar dengan justifikasi, bukan default karena malas memusnahkan.",
      ],
      formula: String.raw`\text{biaya retensi} = v \times s \times t`,
      formulaNote: "v = volume data (TB), s = biaya storage per TB per tahun, t = tahun retensi. Contoh: 50 TB × Rp12 juta/TB/tahun × 10 tahun = Rp6 miliar. Interpretasi: setiap tambahan 1 tahun retensi punya harga — dan harga itu harus dibandingkan dengan nilai/risiko data tersebut, bukan dianggap nol karena “storage murah”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Storage murah, jadi simpan saja selamanya”",
        type: "pitfall",
        body: "Yang benar: biaya storage hanyalah sepertiga cerita. Dua pertiga lainnya: biaya keamanan (data yang disimpan harus diamankan) dan biaya eksposur (data yang ada bisa bocor dan bisa diminta dalam litigasi). “Murah” hanya benar bila kamu mengabaikan dua biaya yang lebih besar.",
      },
      hints: [
        "💡 Intuisi: tanya “pemicu mulai hitung” untuk tiap kategori — retensi “5 tahun” tidak bermakna tanpa titik awal. 5 tahun sejak kapan? Sejak transaksi, sejak akun ditutup, atau sejak kontrak berakhir? Jawaban yang berbeda menghasilkan tanggal musnah yang berbeda.",
      ],
      reference: "Jadwal retensi: kategori → lama simpan → lokasi → aksi akhir → pemicu hitung → pemilik. Plus legal hold.",
    },
    {
      id: "konsep-arsip",
      eyebrow: "Langkah 4 · Konsep",
      title: "Arsip, Backup, dan Pemusnahan — Tiga Saudara yang Sering Tertukar",
      prose: [
        "Definisi: arsip (archive) = penyimpanan jangka panjang data yang jarang diakses tetapi wajib dipertahankan — dengan integritas terjamin, bisa dicari, dan ada masa retensi. Backup = salinan untuk pemulihan bencana — ditimpa bersiklus, bukan untuk pencarian jangka panjang. Penghapusan defensif = pemusnahan terjadwal, terdokumentasi, dan konsisten sesuai jadwal retensi — termasuk menghapus dari backup (atau memastikan backup kedaluwarsa sebelum data dipulihkan kembali).",
        "Kepribadiannya: tiga bersaudara dengan pekerjaan berbeda. Si Arsiparis — rapi, sabar, menyimpan dengan katalog; tugasnya melayani masa depan (audit 5 tahun lagi). Si Pemadam (backup) — sigap, menyimpan salinan apa adanya; tugasnya melayani kemarin (server down tadi malam). Si Algojo (penghapusan) — dingin, mengeksekusi tepat jadwal; tugasnya memastikan tidak ada yang tersisa melewati waktunya. Kekacauan dimulai saat ketiganya tertukar: memulihkan arsip dari backup (tidak terkatalog), menganggap backup sebagai arsip (tertimpa siklus), atau “menghapus” tanpa menyentuh backup (data bangkit lagi saat restore).",
        "Kapan memakai: arsip untuk data retensi panjang yang jarang diakses (laporan keuangan 10 tahun, rekam medis); backup untuk semua sistem aktif dengan RPO/RTO yang jelas; penghapusan defensif untuk SEMUA kategori — tanpa pengecualian “nanti saja”. Aturan keras: legal hold menunda pemusnahan — menghancurkan data yang sedang dalam hold adalah pelanggaran serius di banyak yurisdiksi.",
        "Pendalaman: arsip yang baik memakai penyimpanan immutable — WORM atau object lock: data yang masuk tidak bisa diubah atau dihapus sampai retensinya habis, bahkan oleh admin. Contohnya laporan keuangan 10 tahun dengan object lock mode compliance: CFO sekalipun tidak bisa menghapusnya sebelum waktunya. Biayanya sedikit lebih mahal dan operasionalnya lebih kaku (salah upload berarti menunggu retensi, bukan delete lalu upload ulang) — tetapi untuk data yang berfungsi sebagai bukti, kekakuan itulah fiturnya: ia membuat klaim kami tidak mengubah arsip bisa dibuktikan secara teknis, bukan sekadar dipercaya. Tanpa immutability, arsip hanyalah folder dengan nama yang meyakinkan.",
      ],
      formula: String.raw`\text{risiko litigasi} \propto \text{volume tersimpan} \times \text{melewati masa retensi}`,
      formulaNote: "Kompas kedua lesson ini: eksposur litigasi berbanding lurus dengan volume data yang disimpan MELEWATI masa retensinya. Data dalam masa retensi = kewajiban yang sah; data lewat masa retensi = amunisi gratis untuk lawan. Setiap TB yang “lupa dimusnahkan” adalah liabilitas yang membayar sewa storage.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sudah dihapus dari database, berarti sudah musnah”",
        type: "pitfall",
        body: "Yang benar: data hidup di banyak tempat — database, backup, log, data lake, laptop analis, email. Penghapusan yang defensif memetakan SEMUA salinan dan mengeksekusinya (atau mendokumentasikan mengapa satu salinan dikecualikan, mis. backup yang akan kedaluwarsa alami). “Hapus” yang hanya menyentuh satu tabel adalah teater.",
      },
      hints: [
        "💡 Intuisi: uji “kebangkitan” — setelah penghapusan, lakukan restore dari backup terakhir ke environment uji. Kalau data yang “sudah musnah” muncul kembali, prosesmu bocor. Uji ini murah; kejutan di pengadilan mahal.",
      ],
      reference: "Arsip = untuk masa depan (terkatalog). Backup = untuk kemarin (bersiklus). Hapus = semua salinan, terdokumentasi.",
    },
    {
      id: "lab-retensi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Mesin jadwal retensi",
      prose: [
        "Waktunya jadi arsiparisnya. Di bawah ada jadwal retensi (sintetis) per kategori data dan daftar dataset dengan tanggal “pemicu” (mis. tanggal akun ditutup). Tugasmu: tulis fungsi yang menentukan status tiap dataset — AKTIF, ARSIP, atau MUSNAH — berdasar umur vs masa retensi, dengan aturan legal hold menunda pemusnahan.",
        "Coba: setelah lolos, ubah satu dataset menjadi legal_hold=True dan lihat statusnya berubah. Lalu tanya: dataset yang statusnya MUSNAH tetapi masih ada di backup — apa yang harus terjadi menurut aturan defensif? (Petunjuk: baca lagi mitos kedua.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `umur_hari(pemicu)`: selisih hari antara 2026-10-15 dan tanggal pemicu" },
        { id: "t2", text: "Lengkapi `status(ds)`: 'MUSNAH' bila umur > retensi_hari dan tanpa hold; 'ARSIP' bila umur > 365; selain itu 'AKTIF'" },
        { id: "t3", text: "Hitung `daftar_musnah` = nama dataset berstatus MUSNAH" },
        { id: "t4", text: "Hitung `total_tb_musnah` = jumlah ukuran TB dataset MUSNAH" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "status: {'trx_2021': 'MUSNAH', 'email_2022': 'HOLD', 'nasabah_aktif': 'AKTIF', 'log_2024': 'ARSIP'}\nmusnah: 1 dataset, 4.5 TB dibebaskan",
      code: {
        starter: `from datetime import date

HARI_INI = date(2026, 10, 15)
# Jadwal retensi (SINTETIS — hari sejak pemicu)
JADWAL = {"transaksi": 1825, "email": 1095, "nasabah": 3650, "log": 730}

# Dataset: nama, kategori, tanggal pemicu, ukuran TB, legal hold?
dataset = [
    {"nama": "trx_2021", "kategori": "transaksi", "pemicu": date(2020, 5, 1), "tb": 4.5, "hold": False},
    {"nama": "email_2022", "kategori": "email", "pemicu": date(2022, 1, 10), "tb": 2.0, "hold": True},
    {"nama": "nasabah_aktif", "kategori": "nasabah", "pemicu": date(2026, 6, 1), "tb": 1.2, "hold": False},
    {"nama": "log_2024", "kategori": "log", "pemicu": date(2025, 6, 1), "tb": 8.0, "hold": False},
]

# TULIS KODEMU DI BAWAH INI
def umur_hari(pemicu):
    return

def status(ds):
    return

hasil = {}  # TODO: {ds["nama"]: status(ds) for ds in dataset}

daftar_musnah = []  # TODO: nama dataset berstatus MUSNAH

total_tb_musnah = 0.0  # TODO: jumlah tb dataset MUSNAH

print(f"status: {hasil}")
print(f"musnah: {len(daftar_musnah)} dataset, {total_tb_musnah} TB dibebaskan")`,
        lockLines: 12,
        solution: `from datetime import date

HARI_INI = date(2026, 10, 15)
# Jadwal retensi (SINTETIS — hari sejak pemicu)
JADWAL = {"transaksi": 1825, "email": 1095, "nasabah": 3650, "log": 730}

# Dataset: nama, kategori, tanggal pemicu, ukuran TB, legal hold?
dataset = [
    {"nama": "trx_2021", "kategori": "transaksi", "pemicu": date(2020, 5, 1), "tb": 4.5, "hold": False},
    {"nama": "email_2022", "kategori": "email", "pemicu": date(2022, 1, 10), "tb": 2.0, "hold": True},
    {"nama": "nasabah_aktif", "kategori": "nasabah", "pemicu": date(2026, 6, 1), "tb": 1.2, "hold": False},
    {"nama": "log_2024", "kategori": "log", "pemicu": date(2025, 6, 1), "tb": 8.0, "hold": False},
]

# TULIS KODEMU DI BAWAH INI
def umur_hari(pemicu):
    return (HARI_INI - pemicu).days

def status(ds):
    umur = umur_hari(ds["pemicu"])
    retensi = JADWAL[ds["kategori"]]
    if umur > retensi and not ds["hold"]:
        return "MUSNAH"
    if ds["hold"] and umur > retensi:
        return "HOLD"
    if umur > 365:
        return "ARSIP"
    return "AKTIF"

hasil = {ds["nama"]: status(ds) for ds in dataset}

daftar_musnah = [ds["nama"] for ds in dataset if status(ds) == "MUSNAH"]

total_tb_musnah = sum(ds["tb"] for ds in dataset if status(ds) == "MUSNAH")

print(f"status: {hasil}")
print(f"musnah: {len(daftar_musnah)} dataset, {total_tb_musnah} TB dibebaskan")`,
        checks: [
          { kind: "equal", task: "t1", name: "hasil", value: {"trx_2021": "MUSNAH", "email_2022": "HOLD", "nasabah_aktif": "AKTIF", "log_2024": "ARSIP"}, tol: 0, label: "Status keempat dataset tepat", msg: "trx_2021 lewat 1825 hari; email_2022 lewat retensi tetapi hold; nasabah_aktif masih muda; log_2024 > 365 hari tetapi < 730." },
          { kind: "equal", task: "t3", name: "daftar_musnah", value: ["trx_2021"], tol: 0, label: "`daftar_musnah` = ['trx_2021']", msg: "Hanya trx_2021 yang lewat retensi tanpa hold." },
          { kind: "equal", task: "t4", name: "total_tb_musnah", value: 4.5, tol: 0.01, label: "`total_tb_musnah` = 4,5", msg: "trx_2021 berukuran 4,5 TB." },
          { kind: "stdout_matches", task: "t5", pattern: "musnah: 1 dataset, 4\\.5 TB dibebaskan", label: "Ringkasan pemusnahan tercetak", msg: "Baris kedua: 'musnah: 1 dataset, 4.5 TB dibebaskan'." },
        ],
      },
      note: {
        title: "Intuisi: hold adalah kata yang mengalahkan jadwal",
        body: "Cara berpikir yang membuat legal hold tidak pernah terlewat: ia satu-satunya kata yang mengalahkan jadwal — bahkan mengalahkan sudah waktunya musnah. Heuristiknya: jadwal retensi menjawab kapan boleh musnah; legal hold menjawab apakah sekarang boleh. Keduanya harus dicek berurutan setiap kali eksekusi, bukan sekali saat jadwal dibuat — persis seperti kode lab lesson ini: cek hold dulu sebelum cek umur. Analoginya: jadwal adalah tanggal kedaluwarsa obat; hold adalah dokter yang bilang jangan dibuang dulu, masih dipakai terapi. Dua disiplin operasionalnya: hold harus tercatat (siapa menetapkan, kenapa, sejak kapan) dan harus murah untuk dicabut (review berkala, bukan hold abadi yang dilupakan). Hold yang tidak pernah di-review akan menjadi tempat sampah kedua — data menumpuk dengan alasan litigasi yang sudah selesai dua tahun lalu.",
      },
      reference: "Mesin retensi: umur vs jadwal → AKTIF/ARSIP/MUSNAH; hold selalu menang atas jadwal.",
    },
    {
      id: "chart-tradeoff",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca kurva trade-off retensi",
      prose: [
        "Chart di bawah memplot dua kurva terhadap masa retensi: biaya penyimpanan (biru, naik) dan risiko hukum (oranye putus-putus, berbentuk U).",
        "Cara membaca: sumbu X = masa retensi (kiri = terlalu pendek, kanan = terlalu lama). Kurva biru = biaya simpan yang naik seiring waktu. Kurva oranye = risiko hukum: tinggi di kiri (data dimusnahkan sebelum kewajiban selesai → pelanggaran), turun di tengah, naik lagi di kanan (data lewat masa retensi = amunisi litigasi). Titik bertanda = titik retensi optimal.",
        "Interpretasi: retensi terlalu pendek melanggar kewajiban (denda regulator, tidak bisa membuktikan klaim); retensi terlalu lama menumpuk biaya dan eksposur litigasi (cerita pembuka lesson ini). Titik optimal bukan angka tunggal universal — ia berbeda per kategori data, dan tugas jadwal retensi adalah menemukannya per kategori. Pelajaran chart ini: “simpan selamanya” dan “hapus cepat” SAMA-SAMA mahal — yang murah adalah jadwal yang tepat.",
        "Cara memakai chart ini dalam rapat: gambar ulang dua kurva untuk tiap kategori data — kurva biaya untuk log (murah disimpan, cepat kedaluwarsa) terlihat datar; untuk data nasabah (mahal risikonya) kurva U-nya curam. Titik optimal kategori log mungkin 1 tahun, kategori nasabah 10 tahun. Satu chart generik tidak meyakinkan direksi; lima chart per kategori dengan angkanya sendiri membuat keputusan retensi terasa seperti keputusan bisnis — karena memang begitu.",
      ],
      figure: {
        svg: RET_SVG,
        alt: "Kurva biaya penyimpanan naik dan risiko hukum berbentuk U terhadap masa retensi, dengan titik optimal di tengah.",
        caption: "Trade-off retensi: biaya naik vs risiko berbentuk U. Titik optimal berbeda per kategori data.",
      },
      tasks: [],
      reference: "Terlalu pendek = pelanggaran; terlalu lama = amunisi lawan. Optimal = per kategori, bukan satu angka.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Data mencapai akhir masa retensi — apa yang terjadi?",
      prose: [
        "Empat skenario keputusan retensi:",
        "Skenario 1 — Data transaksi mencapai 5 tahun (batas jadwal), tidak ada hold. → Musnahkan sesuai prosedur: hapus dari produksi, arsip, dan backup (atau pastikan backup kedaluwarsa), dokumentasikan eksekusinya. Alasan: jadwal yang tidak dieksekusi = jadwal hiasan; konsistensi eksekusi adalah inti “defensible”.",
        "Skenario 2 — Data mencapai batas, tetapi ada litigasi berjalan yang menyentuhnya. → Legal hold: tunda pemusnahan, catat siapa menetapkan hold dan kenapa, review berkala. Alasan: memusnahkan data dalam hold bisa dianggap perusakan bukti — jauh lebih mahal daripada biaya simpan tambahan.",
        "Skenario 3 — Tim analitik “masih memakai” data yang sudah lewat retensi. → Jangan perpanjang diam-diam; ajukan amandemen jadwal dengan justifikasi bisnis + persetujuan pemilik data. Alasan: pengecualian yang tidak tercatat merusak defensibilitas seluruh jadwal — “kami musnahkan kecuali kalau ada yang protes” bukan kebijakan.",
        "Skenario 4 — Backup tape berisi data yang sudah dimusnahkan di produksi. → Biarkan tape kedaluwarsa menurut siklusnya (jangan restore), ATAU musnahkan tape bila retensinya menuntut; dokumentasikan pilihannya. Alasan: data yang “bangkit” dari backup saat restore adalah kegagalan penghapusan yang paling memalukan — uji kebangkitan secara berkala.",
        "Aturan praktis 10 detik: masa retensi habis? → (1) ada legal hold? → tunda + catat; (2) tidak ada? → musnahkan semua salinan; (3) ada yang keberatan? → amandemen resmi, bukan pengecualian lisan; (4) dokumentasikan eksekusinya.",
        "Pendalaman yang sering dilompati: kata musnahkan itu sendiri punya tingkatan. Level 1 — hapus logis (flag is_deleted): data masih di disk dan bisa di-restore — ini bukan pemusnahan, hanya disembunyikan. Level 2 — hapus fisik plus timpa (overwrite): cukup untuk HDD, tetapi SSD dengan wear-leveling dan over-provisioning bisa menyimpan salinan di blok yang tidak terjangkau overwrite — forensik masih bisa membacanya. Level 3 — crypto-shredding: musnahkan kunci enkripsinya — data di semua media, termasuk backup tape yang tidak bisa di-overwrite, menjadi derau seketika. Level 4 — destruksi fisik (degauss atau shredder) untuk media yang pensiun.",
        "Aturan keputusannya: data terenkripsi sejak awal berarti crypto-shredding cukup dan termurah; data plaintext di SSD berarti overwrite tidak bisa diandalkan — enkripsi ulang dulu baru musnahkan kuncinya; media fisik yang keluar dari data center berarti destruksi bersertifikat dengan berita acara. Jadwal retensi yang baik mencantumkan metode pemusnahan per kategori — musnahkan tanpa metode adalah janji kosong, dan auditor akan menanyakannya. Ingat: backup tape tidak bisa di-overwrite per file — untuk tape, pilihannya hanya tunggu kedaluwarsa siklus atau musnahkan fisik tape-nya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap “arsip” sebagai tempat pembuangan tanpa tanggal kedaluwarsa. Arsip tanpa jadwal musnah = tempat sampah abadi yang mahal. Setiap data yang masuk arsip harus membawa tanggal keluarnya.",
      },
      reference: "Eksekusi konsisten + dokumentasi = defensible. Pengecualian lisan = tidak defensible.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "E-discovery: 40 TB email diminta pengadilan",
      prose: [
        "Skenario (sintetis, untuk latihan): perusahaan digugat, dan pengadilan memerintahkan penyerahan seluruh email terkait proyek X selama 6 tahun — total 40 TB. Fakta: jadwal retensi perusahaan menetapkan email proyek dimusnahkan setelah 3 tahun, tetapi eksekusinya “tertunda” 2 tahun karena “tim sibuk”. Hasilnya: 40 TB email tersimpan, termasuk 25 TB yang seharusnya sudah musnah.",
        "Pertanyaan analisis: (1) Berapa TB yang seharusnya tidak ada — dan apa konsekuensinya? (2) Siapa yang salah: jadwalnya atau eksekusinya? (3) Apa perbaikan 90 hari yang paling kritis?",
        "Pembahasan: (1) 25 TB seharusnya sudah musnah — dan kini harus diserahkan, ditelaah pengacara (biaya review e-discovery bisa jutaan rupiah per GB), dan berpotensi berisi amunisi lawan. (2) Jadwalnya benar; eksekusinya yang gagal. Ini pelajaran penting: jadwal retensi tanpa eksekusi terjadwal = dokumen hiasan. (3) Perbaikan 90 hari: otomatisasi eksekusi (job terjadwal, bukan “kalau sempat”), dashboard kepatuhan retensi per kategori (berapa % dataset lewat jadwal), dan uji kebangkitan dari backup tiap kuartal. Plus: tetapkan pemilik tiap kategori — jadwal tanpa pemilik = jadwal tanpa eksekutor.",
        "Prioritas perbaikannya berurutan karena ketiganya saling mengunci: tanpa pemilik kategori, tidak ada yang menandatangani eksekusi otomatis; tanpa eksekusi otomatis, dashboard hanya memamerkan masalah; tanpa uji kebangkitan, eksekusi yang terlihat sukses mungkin teater. Mulai dari pemilik — satu nama per kategori, tertulis di jadwal. Itu langkah termurah (nol rupiah) dengan dampak terbesar: akuntabilitas mengubah jadwal dari dokumen menjadi pekerjaan seseorang.",
        "Catatan defensibilitas: pengadilan menilai konsistensi. Perusahaan yang memusnahkan sesuai jadwal secara konsisten berada di posisi kuat; perusahaan yang “baru rajin memusnahkan setelah digugat” berada di posisi sebaliknya. Waktu yang tepat memusnahkan adalah sebelum ada gugatan — bukan sesudah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "25 TB data lewat retensi bukan masalah IT — ia liabilitas hukum yang membayar sewa. Analis risiko yang melihat dashboard storage harus bisa membaca kolom “lewat jadwal” sebagai kolom risiko, bukan kolom kapasitas.",
      },
      reference: "Jadwal tanpa eksekusi = hiasan. Konsistensi sebelum gugatan = defensible.",
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
        "Jadwal retensi menyeimbangkan tiga pendorong: kewajiban hukum (minimum), kebutuhan bisnis, dan risiko/privasi (maksimum) — per kategori data.",
        "Arsip = bukti jangka panjang yang terkatalog; backup = salinan pemulihan bersiklus; keduanya bukan pengganti satu sama lain.",
        "Penghapusan defensif = terjadwal + semua salinan + terdokumentasi + konsisten; legal hold selalu menang atas jadwal.",
        "Biaya retensi = volume × biaya/TB × tahun; risiko litigasi sebanding dengan data yang disimpan melewati masa retensi.",
        "Setiap data yang masuk arsip membawa tanggal keluarnya; uji kebangkitan dari backup tiap kuartal.",
      ],
      next: { label: "DM24 — Katalog Data Hands-On", href: "/learn/dm24-katalog-data-hands-on" },
      quiz: [
        {
          q: "Fungsi utama jadwal retensi?",
          options: [
            { text: "Menyeimbangkan kewajiban simpan (hukum/bisnis) dengan keharusan musnah (risiko/privasi) per kategori data", why: "Benar: retensi adalah titik temu “berapa lama wajib” dan “berapa lama boleh” — bukan sekadar aturan hapus.", correct: true },
            { text: "Menghemat biaya storage", why: "Salah: penghematan adalah efek samping, bukan fungsi utama. Fungsi utamanya kepatuhan + pengendalian risiko." },
            { text: "Menghapus data secepat mungkin", why: "Salah: menghapus sebelum kewajiban selesai = pelanggaran. Kecepatan bukan tujuannya; ketepatan waktunya." },
            { text: "Menyimpan data selamanya dengan rapi", why: "Salah: itu kebalikan retensi — “simpan selamanya” adalah strategi yang kalah seperti di cerita pembuka." },
          ],
        },
        {
          q: "Data mencapai akhir retensi tetapi ada litigasi berjalan. Tindakan benar?",
          options: [
            { text: "Legal hold: tunda pemusnahan, catat penetap dan alasannya, review berkala", why: "Benar: memusnahkan dalam hold bisa dianggap perusakan bukti. Hold selalu menang atas jadwal.", correct: true },
            { text: "Tetap musnahkan sesuai jadwal — jadwal adalah aturan tertinggi", why: "Salah: jadwal tunduk pada hold. “Konsisten” tidak berarti “buta terhadap litigasi”." },
            { text: "Musnahkan diam-diam agar tidak jadi bukti", why: "Salah: ini perusakan bukti — pelanggaran serius dengan konsekuensi pidana di banyak yurisdiksi." },
            { text: "Pindahkan ke arsip pribadi manajer agar aman", why: "Salah: memindahkan data hold ke luar kendali = mengaburkan jejak + melanggar kebijakan." },
          ],
        },
        {
          q: "Perbedaan arsip vs backup yang paling tepat?",
          options: [
            { text: "Arsip = bukti jangka panjang yang terkatalog dan bisa dicari; backup = salinan pemulihan bencana yang ditimpa bersiklus", why: "Benar: beda tujuan, beda perlakuan. Arsip melayani masa depan; backup melayani kemarin.", correct: true },
            { text: "Arsip lebih murah daripada backup", why: "Salah: biaya bukan pembedanya — fungsi dan perlakuanlah yang beda." },
            { text: "Backup bisa menggantikan arsip", why: "Salah: backup tidak terkatalog untuk pencarian jangka panjang dan ditimpa bersiklus — memulihkan arsip dari backup adalah keputusasaan." },
            { text: "Keduanya sama, hanya beda nama", why: "Salah: menyamakan keduanya adalah sumber klasik kegagalan retensi." },
          ],
        },
        {
          q: "Tim analitik masih memakai data yang sudah lewat masa retensi. Respons yang defensible?",
          options: [
            { text: "Ajukan amandemen jadwal resmi dengan justifikasi + persetujuan pemilik data", why: "Benar: kebutuhan baru = jadwal baru yang disahkan, bukan pengecualian lisan. Tercatat = defensible.", correct: true },
            { text: "Biarkan saja — yang penting datanya dipakai", why: "Salah: pengecualian tak tercatat merusak defensibilitas seluruh jadwal." },
            { text: "Perpanjang diam-diam 1 tahun, tidak ada yang tahu", why: "Salah: “tidak ada yang tahu” justru masalahnya — auditor akan tahu, dan tidak ada dokumen pembelaan." },
            { text: "Salin datanya ke laptop analis agar tidak ikut dimusnahkan", why: "Salah: ini sabotase terhadap kebijakan retensi + menciptakan salinan liar tak terkendali." },
          ],
        },
        {
          q: "Uji “kebangkitan” (restore backup ke environment uji setelah penghapusan) bertujuan?",
          options: [
            { text: "Memastikan data yang dimusnahkan tidak muncul kembali dari backup — penghapusan harus menyentuh semua salinan", why: "Benar: penghapusan yang hanya menyentuh produksi adalah teater; backup adalah tempat data bangkit.", correct: true },
            { text: "Menguji kecepatan restore backup", why: "Salah: itu uji DR (ranah dba16), bukan uji penghapusan." },
            { text: "Memastikan backup masih berfungsi", why: "Salah: fungsi backup diuji oleh uji restore DR, bukan oleh uji kebangkitan." },
            { text: "Tidak perlu — backup kedaluwarsa sendiri", why: "Salah: “nanti kedaluwarsa” bukan strategi; sampai kedaluwarsa, data itu masih bisa bangkit dan masih bisa diminta." },
          ],
        },
      ],
    },
  ],
};
