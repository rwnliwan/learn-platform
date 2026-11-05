import type { V2Lesson } from "../lib/types";

// ── Figure: proporsi data terstruktur vs tak terstruktur + tingkat terkelola ─
const DOC_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang volume data terstruktur vs tak terstruktur dan porsi yang terkelola">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="46" y="209">0</text><text x="46" y="169">25</text><text x="46" y="129">50</text>
<text x="46" y="89">75</text><text x="46" y="49">100</text>
</g>
<g>
<rect x="110" y="186" width="60" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="110" y="166" width="60" height="20" fill="var(--chart-text)" opacity="0.35"/>
<text x="140" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Terstruktur</text>
<text x="140" y="158" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">20 / 90</text>
<rect x="280" y="86" width="60" height="120" fill="var(--c1)" opacity="0.9"/>
<rect x="280" y="66" width="60" height="20" fill="var(--chart-text)" opacity="0.35"/>
<text x="310" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Tak terstruktur</text>
<text x="310" y="58" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">80 / 15</text>
<rect x="450" y="86" width="60" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="480" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Legenda</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<rect x="430" y="120" width="14" height="14" fill="var(--c1)" opacity="0.9"/>
<text x="450" y="132">volume data (%)</text>
<rect x="430" y="142" width="14" height="14" fill="var(--chart-text)" opacity="0.35"/>
<text x="450" y="154">porsi terkelola (%)</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">volume vs keterkelolaan (ilustrasi)</text>
</g>
</svg>`;

export const dm21: V2Lesson = {
  slug: "dm21-document-management",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Document & Content Management: Mengelola Data Tak Terstruktur",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sengketa Rp4 miliar yang kalah karena satu file tidak ketemu",
      prose: [
        "Sebuah perusahaan logistik digugat mitra atas keterlambatan pengiriman bernilai Rp4 miliar. Tim legal yakin mereka punya bukti kuat: berita acara serah terima bertanda tangan, lengkap dengan foto kondisi barang. Masalahnya — file itu ada di laptop seorang staf yang sudah resign delapan bulan lalu, dengan nama `final_revisi2_fix(1).pdf`, di dalam folder `C:\\Users\\budi\\Desktop\\arsip lama\\penting\\`. Setelah dua minggu pencarian, yang ditemukan hanya fotokopi buram tanpa tanda tangan. Twist-nya: perusahaan ini punya data warehouse rapi, dashboard real-time, dan tim data yang solid. Semua angka operasionalnya sempurna. Yang tidak mereka kelola adalah 80% data mereka yang lain — dokumen, email, foto, kontrak — yang hidup di laptop, WhatsApp, dan email pribadi karyawan.",
        "Itulah wilayah Document & Content Management dalam DAMA DMBOK: mengelola data tak terstruktur — dokumen, gambar, audio, video, email — sepanjang lifecycle-nya: dari pembuatan, klasifikasi, penyimpanan, pencarian, sampai retensi dan pemusnahan. Bedanya dengan database: dokumen tidak punya skema kolom; “kunci pencariannya” adalah metadata (judul, tanggal, pemilik, kategori) yang harus ditempelkan dengan disiplin, atau dokumen itu hilang secara praktis walau filenya ada.",
        "Biaya satu file tidak ketemu: sengketa Rp4 miliar yang kalah berarti Rp4 miliar hilang — ditambah biaya pengacara dua tahun dan reputasi di mata mitra. Bandingkan dengan biaya sistem document management untuk perusahaan logistik menengah: lisensi plus implementasi sekitar Rp500 juta sampai Rp1 miliar, plus disiplin metadata. Satu sengketa yang dimenangkan sudah membayar sistemnya empat kali lipat. Document management bukan biaya administrasi — ia premi asuransi yang jauh lebih murah daripada klaimnya.",
        "Di lesson ini kamu belajar tiga hal: lifecycle dokumen (dari draft sampai arsip/musnah), metadata dan taksonomi yang membuat dokumen bisa ditemukan, serta aturan main kolaborasi — versioning, akses, dan retensi — supaya cerita sengketa di atas tidak terjadi di tempatmu.",
      ],
      tasks: [],
      note: {
        title: "Kenapa tim data perlu peduli dokumen",
        type: "risk",
        body: "Kontrak, SOP, berita acara, dan email persetujuan adalah “data” yang menentukan apakah angka di dashboard bisa dipertahankan saat diaudit atau digugat. Perusahaan yang hanya mengelola data terstruktur sedang menjaga brankas sambil membiarkan pintu gudang terbuka.",
      },
      reference: "Document management = lifecycle + metadata + akses untuk data tak terstruktur. File yang tidak bisa ditemukan = file yang tidak ada.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan lifecycle dokumen (create → review → publish → archive → dispose) dan apa yang terjadi di tiap tahap; (2) merancang skema metadata minimal (judul, pemilik, tanggal, kategori, retensi) agar dokumen bisa ditemukan; (3) membedakan versioning, check-in/check-out, dan audit trail dokumen; (4) menghitung findability rate dan menafsirkannya.",
        "Rutenya: cerita → dua bekal ringkas → dua konsep inti (lifecycle; metadata & taksonomi) → lab Python (pencari dokumen + findability rate) → chart volume vs keterkelolaan → peta keputusan → mini-case audit kontrak → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari metadata & lineage: metadata adalah “data tentang data” — dan untuk dokumen, metadata adalah satu-satunya indeks pencarian (tidak ada kolom yang bisa di-query). Kedua, dari data lifecycle: data punya tahapan hidup (dibuat, dipakai aktif, jarang dipakai, diarsip, dimusnahkan) — dokumen mengikuti pola yang sama, hanya medianya berbeda: bukan baris tabel, melainkan file dengan versi dan status persetujuan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: database menjawab pertanyaan lewat kolom; dokumen menjawab lewat metadata. Kalau metadata-nya “final_revisi2_fix”, dokumen itu sudah kalah sebelum dicari.",
      ],
      reference: "Bekal: (1) metadata = indeks pencarian dokumen; (2) lifecycle data berlaku juga untuk file, bukan cuma baris tabel.",
    },
    {
      id: "konsep-lifecycle",
      eyebrow: "Langkah 3 · Konsep",
      title: "Lifecycle Dokumen — Si Penjaga Gerbang",
      prose: [
        "Definisi: lifecycle dokumen adalah tahapan hidup sebuah dokumen: create (dibuat/diupload), review (ditelaah dan disetujui), publish (diterbitkan sebagai versi resmi), use (dipakai aktif), archive (diarsipkan saat jarang dipakai tetapi wajib disimpan), dispose (dimusnahkan saat masa retensi habis). Setiap tahap punya aturan: siapa boleh mengedit, siapa harus menyetujui, berapa lama disimpan.",
        "Kepribadiannya: lifecycle dokumen itu seperti penjaga gerbang klub malam — ia menentukan siapa boleh masuk ke tahap berikutnya dan siapa harus menunggu di luar. Dokumen tanpa lifecycle adalah pesta tanpa penjaga: semua orang mengedit versi yang berbeda, tidak ada yang tahu mana yang resmi, dan file “final” beranak-pinak menjadi `final(3)_fix`. Ciri dokumen yang dikelola: satu versi resmi (version of truth), status jelas (draft/in review/approved/archived), dan jejak persetujuan yang bisa ditunjukkan ke auditor.",
        "Kapan memakai: setiap dokumen yang punya konsekuensi hukum, finansial, atau operasional — kontrak, SOP, berita acara, laporan audit, kebijakan. Dokumen sekali pakai (catatan rapat internal yang tidak mengikat) boleh hidup di luar sistem — tetapi keputusan “ini dokumen penting atau bukan” harus dibuat sadar, bukan default.",
        "Contoh alur persetujuan yang konkret: SOP baru di-upload sebagai draft oleh penulis, sistem mengunci editing dan mengirim ke reviewer (check-out); reviewer menyetujui atau mengembalikan dengan komentar; setelah disetujui, status berubah menjadi approved v1.0 dan versi draft dikunci permanen. Setiap transisi tercatat: siapa, kapan, komentar apa. Inilah yang dimaksud audit trail — bukan sekadar riwayat versi, melainkan bukti bahwa proses persetujuan benar-benar terjadi. Auditor tidak bertanya apakah SOP-nya bagus; ia bertanya siapa yang menyetujui versi yang berlaku pada tanggal insiden.",
      ],
      formula: String.raw`\text{findability rate} = \frac{\text{dokumen ditemukan < 5 menit}}{\text{total dokumen dicari}} \times 100\%`,
      formulaNote: "Metrik kesehatan document management. Pembilang = dokumen yang berhasil ditemukan dalam waktu wajar (ambang 5 menit untuk arsip aktif); penyebut = semua dokumen yang dicoba dicari dalam periode uji. Contoh: dari 40 dokumen yang dicari tim audit, 22 ketemu < 5 menit → findability 55%. Interpretasi: hampir separuh arsip praktis hilang — bukan karena filenya tidak ada, melainkan karena tidak bisa ditemukan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sudah disimpan di shared drive, berarti sudah dikelola”",
        type: "pitfall",
        body: "Yang benar: menyimpan ≠ mengelola. Shared drive tanpa lifecycle, metadata, dan versioning hanyalah tempat sampah digital yang rapi — file menumpuk, versi bercabang, tidak ada yang tahu mana yang resmi. Pengelolaan = ada aturan main yang ditegakkan: siapa boleh apa, versi mana yang resmi, kapan dimusnahkan.",
      },
      hints: [
        "💡 Intuisi: uji cepatnya — ambil satu kontrak penting dan tanya: versi resmi yang mana? siapa yang menyetujui? di mana disimpannya? Kalau tiga pertanyaan ini butuh > 5 menit untuk dijawab, lifecycle-mu bocor.",
      ],
      reference: "Lifecycle = create → review → publish → use → archive → dispose. Tiap tahap: aturan edit, aturan setuju, aturan simpan.",
    },
    {
      id: "konsep-metadata",
      eyebrow: "Langkah 4 · Konsep",
      title: "Metadata & Taksonomi — Si Pustakawan",
      prose: [
        "Definisi: metadata dokumen adalah atribut deskriptif yang ditempelkan pada file: judul, pemilik/penulis, tanggal, kategori/taksonomi, kata kunci, status, masa retensi. Taksonomi adalah struktur kategorinya — pohon klasifikasi (mis. Legal > Kontrak > Vendor > 2024) yang disepakati organisasi. Tanpa keduanya, pencarian dokumen hanya mengandalkan nama file dan ingatan manusia.",
        "Kepribadiannya: metadata adalah pustakawan yang memberi label punggung setiap buku; taksonomi adalah denah raknya. Perpustakaan tanpa pustakawan = gudang buku — bukunya ada, tetapi menemukan satu judul butuh keberuntungan. Aturan praktis: metadata WAJIB diisi saat upload (bukan “nanti”), taksonomi maksimal 3–4 level (terlalu dalam = tidak ada yang mengisi dengan benar), dan ada controlled vocabulary — daftar kategori baku, bukan teks bebas (kembali ke pelajaran reference data: `Kontrak`, `kontrak`, `KONTRAK` adalah tiga kategori bagi mesin).",
        "Kapan memakai: selalu, untuk setiap dokumen yang masuk sistem. Pengecualian hanya untuk sampah kerja sementara — dan sampah pun harus punya tanggal kedaluwarsa. Versioning melengkapi ini: setiap perubahan versi resmi tercatat (v1.0 → v1.1 → v2.0) dengan check-in/check-out supaya dua orang tidak menimpa pekerjaan satu sama lain, plus audit trail siapa mengubah apa dan kapan.",
        "Pendalaman: metadata tidak harus diketik manual semua. Tanggal, uploader, dan tipe file bisa diekstrak otomatis saat upload; OCR plus klasifikasi teks bisa mengusulkan kategori (kontrak, SOP) yang tinggal dikonfirmasi manusia — konfirmasi satu klik jauh lebih mungkin dilakukan daripada pengisian lima field kosong. Aturannya: otomatisasi untuk yang deterministik (tanggal, ukuran, hash duplikat), manusia untuk yang butuh penilaian (kategori hukum, masa retensi). Yang tidak boleh diotomatisasi penuh: penentuan versi resmi — itu keputusan akuntabilitas, bukan tebak-tebakan model. Dan waspadai jebakan OCR: tanggal 01/02/2024 diekstrak tanpa konteks format berarti metadata salah yang terlihat benar — validasi format di pintu masuk.",
      ],
      formula: String.raw`\text{biaya pencarian} = t \times f \times w`,
      formulaNote: "t = rata-rata waktu mencari satu dokumen (jam), f = frekuensi pencarian per bulan, w = upah per jam pencari. Contoh: 0,5 jam × 200 pencarian × Rp150.000 = Rp15 juta/bulan yang dibakar untuk mencari file. Rumus ini mengubah keluhan “susah cari file” menjadi angka yang bisa dibawa ke direksi — dan menjadi business case sistem document management.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “AI search bisa menemukan apa pun, metadata tidak perlu lagi”",
        type: "pitfall",
        body: "Yang benar: pencarian semantik membantu, tetapi tidak menggantikan metadata untuk kebutuhan tata kelola. AI tidak tahu mana versi resmi kontrak, siapa yang menyetujuinya, atau kapan masa retensinya habis — itu semua metadata yang harus dicatat manusia/sistem saat dokumen dibuat. Search menemukan; metadata membuktikan.",
      },
      hints: [
        "💡 Intuisi: metadata punya dua konsumen — manusia (mencari) dan auditor (membuktikan). Desain skema metadata untuk keduanya: yang membantu pencarian (judul, kategori, kata kunci) DAN yang dibutuhkan pembuktian (penyetuju, tanggal berlaku, retensi).",
      ],
      reference: "Metadata wajib saat upload; taksonomi 3–4 level; controlled vocabulary; versioning + audit trail untuk versi resmi.",
    },
    {
      id: "lab-finder",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Mesin pencari dokumen & findability rate",
      prose: [
        "Waktunya jadi pustakawannya. Di bawah ada arsip dokumen (sintetis) — sebagian punya metadata lengkap, sebagian cuma nama file seperti `final_fix(2).pdf`. Tugasmu: tulis fungsi pencari yang mencocokkan kata kunci ke judul ATAU kategori metadata, hitung findability rate, dan daftarkan dokumen “hantu” (tidak bisa ditemukan lewat metadata).",
        "Coba: setelah lolos, ubah fungsi pencari agar juga mencocokkan nama file (fallback). Berapa findability rate sekarang — dan kenapa fallback nama file berbahaya untuk kebutuhan audit? (Petunjuk: `final_fix(2).pdf` tidak bilang versi resmi yang mana.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `cari(kata)`: kembalikan dokumen yang katanya cocok di judul ATAU kategori (case-insensitive)" },
        { id: "t2", text: "Hitung `ketemu` = dokumen yang ditemukan untuk kata kunci \"kontrak\"" },
        { id: "t3", text: "Hitung `findability` = ketemu / total * 100" },
        { id: "t4", text: "Kumpulkan `hantu` = file dokumen yang metadata-nya kosong (judul dan kategori kosong)" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "findability 'kontrak': 42.9% (3/7)\ndokumen hantu: ['final_fix(2).pdf', 'scan_001.pdf']",
      code: {
        starter: `# Arsip dokumen (SINTETIS — sebagian metadata lengkap, sebagian "hantu")
arsip = [
    {"file": "kontrak_mitra_logistik_2024.pdf", "judul": "Kontrak Mitra Logistik 2024", "kategori": "Kontrak"},
    {"file": "final_fix(2).pdf", "judul": "", "kategori": ""},
    {"file": "sop_gudang_v3.pdf", "judul": "SOP Operasional Gudang v3", "kategori": "SOP"},
    {"file": "kontrak_sewa_kantor.pdf", "judul": "Kontrak Sewa Kantor", "kategori": "Kontrak"},
    {"file": "scan_001.pdf", "judul": "", "kategori": ""},
    {"file": "ba_serah_terima_041.pdf", "judul": "Berita Acara Serah Terima 041", "kategori": "Berita Acara"},
    {"file": "kontrak_asuransi_armada.pdf", "judul": "Kontrak Asuransi Armada", "kategori": "Kontrak"},
]

# TULIS KODEMU DI BAWAH INI
def cari(kata):
    return

ketemu = 0  # TODO: len(cari("kontrak"))

findability = 0.0  # TODO: ketemu / len(arsip) * 100

hantu = []  # TODO: file dokumen kategori Kontrak yang tak ketemu

print(f"findability 'kontrak': {findability:.1f}% ({ketemu}/{len(arsip)})")
print(f"dokumen hantu: {hantu}")`,
        lockLines: 11,
        solution: `# Arsip dokumen (SINTETIS — sebagian metadata lengkap, sebagian "hantu")
arsip = [
    {"file": "kontrak_mitra_logistik_2024.pdf", "judul": "Kontrak Mitra Logistik 2024", "kategori": "Kontrak"},
    {"file": "final_fix(2).pdf", "judul": "", "kategori": ""},
    {"file": "sop_gudang_v3.pdf", "judul": "SOP Operasional Gudang v3", "kategori": "SOP"},
    {"file": "kontrak_sewa_kantor.pdf", "judul": "Kontrak Sewa Kantor", "kategori": "Kontrak"},
    {"file": "scan_001.pdf", "judul": "", "kategori": ""},
    {"file": "ba_serah_terima_041.pdf", "judul": "Berita Acara Serah Terima 041", "kategori": "Berita Acara"},
    {"file": "kontrak_asuransi_armada.pdf", "judul": "Kontrak Asuransi Armada", "kategori": "Kontrak"},
]

# TULIS KODEMU DI BAWAH INI
def cari(kata):
    k = kata.lower()
    return [d for d in arsip if k in d["judul"].lower() or k in d["kategori"].lower()]

ketemu = len(cari("kontrak"))

findability = ketemu / len(arsip) * 100

hantu = [d["file"] for d in arsip if not d["judul"] and not d["kategori"]]

print(f"findability 'kontrak': {findability:.1f}% ({ketemu}/{len(arsip)})")
print(f"dokumen hantu: {hantu}")`,
        checks: [
          { kind: "equal", task: "t2", name: "ketemu", value: 3, tol: 0, label: "`ketemu` harus 3", msg: "3 dokumen berkategori/judul 'kontrak' yang metadata-nya lengkap." },
          { kind: "equal", task: "t3", name: "findability", value: 42.86, tol: 0.01, label: "`findability` harus ±42,86", msg: "3/7 × 100 = 42,86%." },
          { kind: "contains", task: "t4", name: "hantu", value: "final_fix(2).pdf", label: "`hantu` memuat 'final_fix(2).pdf'", msg: "Dokumen tanpa metadata tidak bisa ditemukan lewat pencarian kategori." },
          { kind: "stdout_matches", task: "t5", pattern: "findability 'kontrak': 42\\.9% \\(3/7\\)", label: "Ringkasan findability tercetak", msg: "Format: \"findability 'kontrak': 42.9% (3/7)\"." },
          { kind: "stdout_matches", task: "t5", pattern: "dokumen hantu:", label: "Daftar dokumen hantu tercetak", msg: "Baris kedua harus mencetak daftar dokumen hantu." },
        ],
      },
      reference: "Pencarian metadata = satu-satunya cara menemukan dokumen secara andal. Nama file bukan metadata.",
    },
    {
      id: "chart-volume",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart volume vs keterkelolaan",
      prose: [
        "Chart di bawah membandingkan dua dunia data di perusahaan pada umumnya (ilustrasi): volume data vs porsi yang benar-benar terkelola.",
        "Cara membaca: sumbu Y = persen; tiap kelompok punya dua batang — biru = pangsa volume data, abu = porsi yang terkelola dengan baik. Kelompok “Terstruktur” (database, tabel) vs “Tak terstruktur” (dokumen, email, gambar, video).",
        "Interpretasi: data terstruktur hanya ~20% dari volume, tetapi ~90%-nya terkelola (ada DBA, ada skema, ada backup). Data tak terstruktur ~80% dari volume, tetapi hanya ~15% yang terkelola — inilah “gudang gelap” perusahaan. Pelajaran chart ini: investasi tata kelola selama ini menumpuk di 20% data. Kesenjangan 80 vs 15 adalah tempat risiko hukum, audit, dan operasional bersembunyi — persis seperti sengketa di cerita pembuka.",
      ],
      figure: {
        svg: DOC_SVG,
        alt: "Diagram batang: data terstruktur 20% volume / 90% terkelola; tak terstruktur 80% volume / 15% terkelola.",
        caption: "Volume vs keterkelolaan: 80% data tak terstruktur, hanya 15% terkelola (ilustrasi).",
      },
      tasks: [],
      note: {
        title: "Intuisi: baca chart ini sebagai peta investasi",
        body: "Cara membaca chart ini yang paling berguna: bukan sebagai statistik, melainkan sebagai peta investasi. Batang tak terstruktur 80% volume dengan 15% terkelola berkata bahwa sebagian besar risiko hukummu tinggal di tempat yang paling sedikit kamu urus. Heuristik anggarannya: jangan mulai dari kelola semuanya — mulai dari dokumen bervolume hukum (kontrak, persetujuan, berita acara), karena 1% dokumen itu menanggung 90% risiko sengketa. Kenaikan findability dari 55% ke 95% pada 40 kontrak bernilai jauh lebih besar daripada mengindeks 100 ribu foto lapangan. Chart ini juga alat persuasi: tunjukkan ke direksi bahwa tim data menjaga 20% data dengan porsi besar anggaran tata kelola — ketimpangannya terlihat dalam lima detik, dan merapatkan 80% yang gelap berubah menjadi keputusan bisnis, bukan keluhan IT.",
      },
      reference: "Kelola di mana risikonya berada — dan risikonya ada di 80% yang gelap.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Dokumen baru datang — dikelola seperti apa?",
      prose: [
        "Empat skenario keputusan document management:",
        "Skenario 1 — Kontrak kerja sama baru ditandatangani. → Masuk lifecycle penuh: metadata lengkap, versi resmi v1.0, akses terbatas (legal + direksi), retensi sesuai kebijakan (mis. 10 tahun setelah berakhir). Alasan: dokumen bervolume hukum = bukti di pengadilan; kelalaian di sini berbiaya sengketa.",
        "Skenario 2 — SOP operasional direvisi tiap kuartal. → Versioning ketat + satu versi resmi yang berlaku; versi lama diarsipkan, bukan dihapus. Alasan: saat insiden terjadi, auditor bertanya “SOP mana yang berlaku pada tanggal kejadian?” — tanpa versioning, pertanyaan ini tidak terjawab.",
        "Skenario 3 — Foto dokumentasi lapangan dari ratusan HP karyawan. → Taksonomi sederhana + upload terpusat dengan metadata otomatis (tanggal, lokasi, uploader); retensi pendek. Alasan: volume besar, nilai per file kecil — pengelolaannya harus murah dan otomatis, bukan manual.",
        "Skenario 4 — Email persetujuan direksi atas pengeluaran besar. → Arsipkan sebagai record (tidak bisa diubah/dihapus selama masa retensi) dengan audit trail. Alasan: email persetujuan adalah bukti otorisasi; record yang bisa diedit diam-diam bukan bukti.",
        "Aturan praktis 10 detik: dokumen baru? → (1) ada konsekuensi hukum/finansial? → lifecycle penuh; (2) direvisi berkala? → versioning; (3) volume besar nilai kecil? → otomatisasi metadata; (4) bukti otorisasi? → record terkunci.",
        "Satu skenario yang selalu muncul: dokumen warisan (backlog) — 10 tahun arsip tanpa metadata. Jangan kejar kesempurnaan: prioritaskan 3 kategori bervolume hukum dulu, remediasi metadata-nya 90 hari seperti mini-case; sisanya diarsipkan apa adanya dengan tanggal kedaluwarsa dan dicari manual bila dibutuhkan. Backlog yang ditunda rapi (terkatalog kasar + tanggal kedaluwarsa) jauh lebih baik daripada proyek remediasi total yang tidak pernah selesai karena terlalu ambisius.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyamakan “arsip” dengan “backup”. Backup = salinan untuk pemulihan bencana (bisa ditimpa siklus berikutnya). Arsip = versi resmi yang dipertahankan dengan integritas terjamin untuk jangka panjang (tidak boleh diubah, ada retensi). Memulihkan kontrak dari backup tape bukan document management — itu keputusasaan.",
      },
      reference: "Arsip ≠ backup. Arsip = bukti yang dipertahankan; backup = salinan untuk pemulihan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Audit mengetuk: 40 kontrak, 2 minggu",
      prose: [
        "Skenario (sintetis, untuk latihan): auditor eksternal meminta 40 kontrak vendor aktif beserta bukti persetujuannya, tenggat 2 minggu. Tim legal mencari di shared drive: 22 kontrak ketemu < 5 menit (metadata rapi), 10 ketemu setelah 1–3 jam pencarian manual (nama file ambigu), 8 tidak ketemu sama sekali (di laptop mantan karyawan / email pribadi).",
        "Pertanyaan analisis: (1) Berapa findability rate arsip kontrak ini? (2) Dari 18 yang bermasalah, mana yang masalah metadata vs masalah lifecycle? (3) Rencana 90 hari apa yang paling berdampak?",
        "Pembahasan: (1) Findability = 22/40 = 55% — gagal untuk kebutuhan audit. (2) 10 yang “ketemu setelah berjam-jam” = masalah metadata (file ada, tidak terindeks); 8 yang hilang = masalah lifecycle + kepemilikan (tidak ada aturan serah terima dokumen saat karyawan resign, tidak ada repositori resmi). (3) Rencana 90 hari: minggu 1–2, tetapkan repositori resmi + skema metadata wajib (5 field: judul, pemilik, tanggal, kategori, retensi); minggu 3–6, migrasi dan remediasi metadata 40 kontrak aktif + checklist serah terima dokumen untuk karyawan resign; minggu 7–12, lifecycle untuk kontrak baru (persetujuan tercatat, versioning) dan uji findability bulanan. Target: 95% dalam 90 hari — realistis karena masalahnya proses, bukan teknologi.",
        "Catatan biaya pencarian: 10 kontrak × 2 jam × Rp150.000 = Rp3 juta untuk satu audit — kecil. Yang mahal adalah 8 kontrak hilang: setiap kontrak yang tidak bisa ditunjukkan saat sengketa adalah posisi tawar yang hilang.",
        "Operasionalisasinya: uji findability jangan tahunan — jadikan ritual bulanan. Ambil 20 dokumen acak dari tiap kategori, minta staf yang tidak terlibat pengarsipan mencarinya, catat waktunya. Hasil di bawah 90% berarti remediasi metadata kategori itu bulan berjalan. Ritual dua jam per bulan ini mencegah cerita pembuka terulang — dan memberi angka tren untuk laporan tata kelola: findability kontrak naik dari 55% ke 92% dalam empat bulan. Angka tren seperti ini juga yang membuat anggaran document management lolos direksi: ia menunjukkan kemajuan, bukan sekadar biaya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Auditor tidak menilai “usahamu mencari” — ia menilai “dokumennya ada atau tidak”. Findability 55% dibaca sebagai pengendalian internal yang lemah, dan temuan itu masuk laporan audit. Document management adalah pengendalian internal, bukan kerapian.",
      },
      reference: "Remediasi 90 hari: repositori resmi → metadata wajib → serah terima resign → uji findability bulanan.",
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
        "Document management = mengelola data tak terstruktur (dokumen, email, gambar, video) sepanjang lifecycle: create → review → publish → use → archive → dispose.",
        "Metadata adalah indeks pencarian dokumen; taksonomi 3–4 level dengan controlled vocabulary; wajib diisi saat upload, bukan nanti.",
        "Versioning + check-in/check-out + audit trail menjamin satu versi resmi dan jejak siapa mengubah apa.",
        "Findability rate = dokumen ditemukan < 5 menit / total dicari × 100%; di bawah 90% arsip praktis bermasalah.",
        "Arsip ≠ backup: arsip = bukti berintegritas jangka panjang; backup = salinan pemulihan bencana.",
      ],
      quiz: [
        {
          q: "Perbedaan utama document management vs sekadar “menyimpan file di shared drive”?",
          options: [
            { text: "Ada lifecycle, metadata wajib, versioning, dan aturan akses/retensi yang ditegakkan", why: "Benar: menyimpan = menaruh file; mengelola = ada aturan main yang ditegakkan di setiap tahap hidup dokumen.", correct: true },
            { text: "Kapasitas penyimpanannya lebih besar", why: "Salah: kapasitas bukan pengelolaan. Shared drive 10TB tanpa aturan tetap tempat sampah digital." },
            { text: "File-nya dienkripsi", why: "Salah: enkripsi = keamanan, bukan management. File terenkripsi yang tidak bisa ditemukan tetap hilang." },
            { text: "Hanya IT yang boleh upload", why: "Salah: pembatasan uploader bukan tata kelola dokumen — justru menghambat adopsi." },
          ],
        },
        {
          q: "Findability rate arsip kontrak = 55%. Tindakan paling tepat?",
          options: [
            { text: "Tetapkan metadata wajib + repositori resmi, lalu remediasi metadata kontrak aktif dan uji berkala", why: "Benar: 55% menandakan masalah proses (metadata + lifecycle), bukan sekadar teknologi. Perbaiki prosesnya, ukur ulang.", correct: true },
            { text: "Beli software document management yang mahal", why: "Salah: tool tanpa proses = shared drive yang mahal. 55% tidak diperbaiki oleh lisensi." },
            { text: "Minta karyawan lebih rajin memberi nama file", why: "Salah: mengandalkan disiplin individual tanpa sistem adalah strategi yang sudah terbukti gagal — buktinya 55%." },
            { text: "55% masih wajar untuk arsip besar", why: "Salah: untuk kebutuhan audit/hukum, 55% = pengendalian lemah. Target operasional ≥ 90–95%." },
          ],
        },
        {
          q: "SOP direvisi tiap kuartal. Praktik versioning yang benar?",
          options: [
            { text: "Satu versi resmi berlaku; versi lama diarsipkan (tidak dihapus) dengan nomor versi dan tanggal berlaku", why: "Benar: saat insiden, auditor bertanya SOP mana yang berlaku pada tanggal kejadian — arsip versi menjawabnya.", correct: true },
            { text: "Timpa file lama dengan revisi baru agar tidak membingungkan", why: "Salah: menimpa menghapus sejarah — tidak ada cara membuktikan aturan mana yang berlaku kapan." },
            { text: "Simpan semua revisi dengan nama final_revisi2_fix", why: "Salah: ini tepat masalah yang ingin diselesaikan versioning — versi resmi harus tunggal dan bernama sistematis." },
            { text: "Versi lama dihapus tiap ada revisi agar hemat storage", why: "Salah: storage murah; bukti mahal. Penghapusan versi resmi tanpa masa retensi melanggar prinsip arsip." },
          ],
        },
        {
          q: "Email persetujuan direksi atas pengeluaran Rp2 miliar sebaiknya diperlakukan sebagai?",
          options: [
            { text: "Record terkunci: tidak bisa diubah/dihapus selama masa retensi, dengan audit trail", why: "Benar: ini bukti otorisasi. Record yang bisa diedit diam-diam tidak punya nilai pembuktian.", correct: true },
            { text: "Email biasa yang boleh dihapus setelah dibaca", why: "Salah: menghapus bukti otorisasi = menghilangkan jejak pengendalian internal." },
            { text: "Diteruskan ke grup WhatsApp agar banyak saksi", why: "Salah: saksi chat bukan arsip — tidak terkendali, bisa dihapus, tidak punya retensi." },
            { text: "Di-print dan disimpan di lemari", why: "Salah: kertas tidak searchable, tidak punya audit trail digital, dan rentan hilang/rusak — bukan pengelolaan modern." },
          ],
        },
        {
          q: "Kenapa taksonomi sebaiknya maksimal 3–4 level?",
          options: [
            { text: "Terlalu dalam membuat orang salah/malas mengisi kategori — klasifikasi yang tidak dipakai sama dengan tidak ada", why: "Benar: taksonomi yang tidak diisi dengan benar lebih buruk daripada taksonomi sederhana yang konsisten.", correct: true },
            { text: "Software tidak mendukung lebih dari 4 level", why: "Salah: batasan teknis bukan alasannya — alasannya perilaku manusia." },
            { text: "Agar terlihat rapi di presentasi", why: "Salah: kerapian visual bukan tujuan; keterisian yang konsisten adalah tujuannya." },
            { text: "Karena dokumen tidak sebanyak itu", why: "Salah: volume dokumen justru besar — semakin besar volume, semakin penting kategorinya sederhana dan konsisten." },
          ],
        },
      ],
    },
  ],
};
