import type { V2Lesson } from "../lib/types";

// ── Figure: kelengkapan metadata 3 tabel ─────────────────────────────────
const COMPLETE_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Diagram batang kelengkapan metadata tiga tabel">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="20" x2="120" y2="190"/><line x1="120" y1="190" x2="530" y2="190"/>
<line x1="120" y1="148" x2="530" y2="148"/><line x1="120" y1="105" x2="530" y2="105"/>
<line x1="120" y1="62" x2="530" y2="62"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="114" y="193" text-anchor="end">0%</text><text x="114" y="151" text-anchor="end">25%</text>
<text x="114" y="108" text-anchor="end">50%</text><text x="114" y="65" text-anchor="end">75%</text>
<text x="114" y="26" text-anchor="end">100%</text>
</g>
<g font-family="var(--font-ui)">
<rect x="150" y="62" width="90" height="128" fill="var(--c1)" opacity="0.9"/>
<text x="195" y="100" text-anchor="middle" font-size="12" fill="#fff">75%</text>
<text x="195" y="206" text-anchor="middle" font-size="11" fill="var(--chart-text)">nasabah</text>
<rect x="280" y="20" width="90" height="170" fill="var(--c2)" opacity="0.9"/>
<text x="325" y="100" text-anchor="middle" font-size="12" fill="#fff">100%</text>
<text x="325" y="206" text-anchor="middle" font-size="11" fill="var(--chart-text)">transaksi</text>
<rect x="410" y="148" width="90" height="42" fill="var(--c3)" opacity="0.9"/>
<text x="455" y="176" text-anchor="middle" font-size="12" fill="#fff">25%</text>
<text x="455" y="206" text-anchor="middle" font-size="11" fill="var(--chart-text)">produk</text>
<line x1="130" y1="62" x2="520" y2="62" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="524" y="58" font-size="10" fill="var(--text)" text-anchor="end">ambang layak pakai 75%</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="120" y="226">skor kelengkapan metadata per tabel (ilustrasi; rata-rata 66,7%)</text>
</g>
</svg>`;

export const dm24: V2Lesson = {
  slug: "dm24-katalog-data-hands-on",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Katalog Data Hands-On: Purview, Collibra, Alation",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Katalog termahal yang pernah dibeli — dan kosong",
      prose: [
        "Sebuah bank menengah membeli lisensi katalog data komersial untuk seluruh tim — investasi sembilan digit rupiah, proyek diresmikan direksi, tim proyek dibentuk. Delapan belas bulan kemudian, katalognya berisi 4.200 aset data. Yang punya deskripsi: 11%. Yang punya owner tercatat: 23%. Yang punya klasifikasi sensitivitas: 7%. Para analis tetap bertanya ke grup chat: “tabel nasabah yang bener yang mana?”. Twist-nya: tool-nya bekerja sempurna — ia meng-harvest seluruh skema database secara otomatis dalam seminggu. Yang gagal bukan teknologinya, melainkan manusianya: tidak ada yang ditugaskan mengisi deskripsi, tidak ada steward yang memverifikasi klasifikasi, tidak ada konsekuensi bila metadata kosong. Katalog adalah cermin: ia hanya memantulkan disiplin metadata yang sudah ada — bukan menciptakannya.",
        "Inilah pelajaran paling mahal di data governance: membeli katalog data tidak memberimu katalog data. Yang memberimu katalog data adalah proses: harvest otomatis + klasifikasi + stewardship + glossary — dijalankan konsisten oleh orang yang jelas pemiliknya. Tool komersial (Microsoft Purview, Collibra, Alation) adalah mesin yang bagus, tetapi mesin tidak mengemudi sendiri.",
        "Di lesson ini kamu belajar anatomi katalog data modern, cara kerja harvest & klasifikasi otomatis, perbedaan jujur tiga tool komersial utama — lalu membangun katalog mini sendiri di lab: mengklasifikasikan kolom PII dan menghitung skor kelengkapan metadata per tabel.",
      ],
      tasks: [],
      note: {
        title: "Bekal dari dm10 (diringkas, lesson ini mandiri)",
        type: "risk",
        body: "Di dm10 kamu sudah kenal tiga jenis metadata: teknis (skema, tipe data, statistik kolom), bisnis (deskripsi, glossary, owner), dan operasional (jadwal refresh, kualitas, lineage). Lesson ini adalah kelanjutannya yang praktis: bagaimana metadata itu dikumpulkan otomatis, diklasifikasikan, dan diukur kelengkapannya — plus cara memilih tool yang mewadahinya. Kalau lupa detail dm10, bekal dua kalimat ini cukup.",
      },
      reference: "Tool katalog memantulkan disiplin metadata — bukan menciptakannya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan estimasi waktu",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan empat fungsi inti katalog data (discovery, klasifikasi, glossary, lineage) dan siapa yang mengonsumsinya; (2) menjelaskan cara kerja harvest otomatis dan klasifikasi PII berbasis pola; (3) membedakan Microsoft Purview, Collibra, dan Alation secara jujur — kekuatan dan batas tiap tool; (4) menghitung skor kelengkapan metadata per aset dan menafsirkannya.",
        "Rutenya: cerita → bekal ringkas → tiga konsep inti (anatomi katalog; harvest & klasifikasi + perbandingan tiga tool; glossary & stewardship) → lab Python (katalog mini: klasifikasi PII + skor kelengkapan) → chart kelengkapan → peta keputusan → mini-case bank → kuis → rangkuman. Estimasi 65 menit; lab-nya ±15 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: katalog data adalah Google untuk data internal — tetapi Google yang setiap halamannya harus ditulis dan diverifikasi manusia. Mesin pencarinya otomatis; isinya tidak.",
      ],
      reference: "Tujuan: paham anatomi katalog, cara kerja harvest/klasifikasi, beda tiga tool, dan bisa mengukur kelengkapan metadata.",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi Katalog — Si Pustakawan, Si Detektif, Si Kamus, Si Silsilah",
      prose: [
        "Definisi: katalog data adalah inventaris terpusat atas seluruh aset data organisasi — tabel, dashboard, pipeline, model — beserta metadata yang menjelaskan apa isinya, siapa pemiliknya, seberapa tepercaya, dan dari mana asalnya. Empat fungsi intinya: (1) Discovery — analis bisa menemukan data yang tepat tanpa bertanya ke grup chat; (2) Klasifikasi — tiap kolom/aset diberi label sensitivitas (publik, internal, rahasia); (3) Business glossary — definisi bisnis yang disepakati (“apa itu ‘nasabah aktif’?”); (4) Lineage — silsilah data: dari sistem sumber, lewat transformasi apa, menjadi laporan apa.",
        "Kepribadiannya: si Pustakawan (discovery) — tahu di rak mana setiap buku, tetapi tidak menulis bukunya. Si Detektif (klasifikasi) — memeriksa setiap kolom dan menempel stiker “ini KTP, ini rahasia”. Si Kamus (glossary) — wasit bahasa: memastikan “pendapatan” di finance dan “pendapatan” di marketing artinya sama. Si Silsilah (lineage) — ahli genealogi yang bisa menelusuri: angka di dashboard ini lahir dari tabel mana, lewat query apa.",
        "Kapan memakai: katalog menjadi wajib ketika (a) analis > 20 orang — biaya “bertanya ke senior” meledak; (b) regulasi menuntut bukti — kamu harus bisa menunjukkan data sensitif ada di mana; (c) ada data mesh/self-service — tanpa katalog, self-service = anarki. Kapan TIDAK: tim 5 orang dengan satu warehouse yang rapi — spreadsheet kamus data cukup; membeli tool enterprise untuk itu seperti membeli truk untuk belanja mingguan.",
      ],
      formula: String.raw`S = \frac{\text{field metadata terisi}}{\text{field metadata wajib}} \times 100\%`,
      formulaNote: "S = skor kelengkapan metadata satu aset, dalam persen. Field wajib biasanya: deskripsi, owner, klasifikasi sensitivitas, lineage sumber. Contoh: tabel nasabah mengisi 3 dari 4 → S = 75%. Interpretasi: di bawah 75% aset belum “layak pakai” untuk analis baru — ia akan tetap bertanya ke orang, bukan ke katalog. Rata-rata S seluruh aset = kesehatan katalogmu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Katalog = dokumentasi yang ditulis sekali”",
        type: "pitfall",
        body: "Yang benar: katalog adalah sistem hidup. Skema berubah tiap sprint, pipeline baru lahir tiap bulan — metadata yang ditulis sekali basi dalam hitungan minggu. Katalog yang sehat meng-harvest ulang otomatis dan menandai metadata yang kedaluwarsa. Dokumentasi statis di wiki bukan katalog; ia kuburan metadata.",
      },
      hints: [
        "💡 Intuisi: ukur katalog dari perilaku, bukan dari jumlah aset. Katalog dengan 4.200 aset dan 11% deskripsi kalah dari katalog 300 aset dengan 95% deskripsi — yang pertama museum, yang kedua alat kerja.",
      ],
      reference: "Empat fungsi: discovery, klasifikasi, glossary, lineage. Ukur dari perilaku pemakaian, bukan jumlah aset.",
    },
    {
      id: "konsep-harvest",
      eyebrow: "Langkah 4 · Konsep",
      title: "Harvest & Klasifikasi Otomatis — dan Tiga Tool yang Jujur Dibedakan",
      prose: [
        "Definisi: harvest adalah pengumpulan metadata otomatis dari sistem sumber — tool memindai database, data lake, dan BI tools, lalu mendaftarkan skema, statistik kolom, dan lineage teknis tanpa campur tangan manusia. Klasifikasi otomatis menempel label sensitivitas dengan dua cara: pola nama kolom (kolom bernama nik, email, no_hp hampir pasti PII) dan pola nilai (regex NIK 16 digit, format email) pada sampel data.",
        "Kepribadiannya: harvester seperti drone pemeta — ia terbang ke semua database dan menggambar petanya dalam semalam. Klasifier seperti anjing pelacak — ia mengendus tiap kolom dan menggonggong “PII!” ketika mencium pola NIK atau email. Tetapi ingat: anjing pelacak kadang menggonggong salah — di lab nanti kamu akan melihat kolom nama_produk ikut ditandai PII padahal itu nama barang, bukan nama orang. Anjing butuh pelatih (steward) yang memverifikasi gonggongannya — false positive klasifikasi sama merusak kepercayaannya dengan false negative.",
        "Tiga tool, dibedakan jujur (tidak ada yang berjalan di browser — ini peta konseptual untuk keputusan pembelian). Microsoft Purview: kekuatan = peta data terpadu + klasifikasi bawaan yang dalam untuk ekosistem Microsoft (Azure, Power BI, Microsoft 365); paling masuk akal bila organisasimu sudah “rumah Microsoft”. Batasnya: di luar ekosistem Microsoft, konektornya lebih tipis. Collibra: kekuatan = data intelligence untuk enterprise besar — glossary bisnis yang kuat, workflow stewardship yang matang, lineage lintas sistem; pilihan umum bank/enterprise global. Batasnya: implementasi berat, butuh tim dan proses yang siap — membeli Collibra tanpa steward seperti membeli orkestra tanpa konduktor. Alation: kekuatan = discovery berbasis machine learning — pencarian natural language dan rekomendasi “pengguna lain juga memakai tabel ini”; disukai analis karena terasa seperti Google. Batasnya: governance workflow-nya lebih ringan dibanding Collibra — cocok untuk budaya self-service, kurang untuk regulasi super ketat.",
        "Kapan memakai: Purview bila Azure/Power BI adalah rumahmu; Collibra bila kamu enterprise teregulasi dengan tim stewardship; Alation bila prioritasnya adopsi analis dan kecepatan discovery. Aturan memilihnya: tool mengikuti arsitektur dan budaya — bukan sebaliknya. Dan ketiganya gagal dengan cara yang sama: tanpa owner metadata yang jelas.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Klasifikasi otomatis = data kami sudah aman”",
        type: "pitfall",
        body: "Yang benar: klasifikasi otomatis adalah tebakan cerdas, bukan vonis. Ia menemukan pola yang dikenalnya — tetapi tidak paham konteks bisnis (“kode_nasabah_internal” bisa jadi identifier tidak langsung) dan tidak tahu data baru yang belum pernah dilihat. Alur yang benar: otomatis mengusulkan → steward manusia memverifikasi → label dikunci. Melewatkan verifikasi manusia = menempel stiker “aman” pada hal yang belum diperiksa.",
      },
      hints: [
        "💡 Intuisi: perlakukan klasifikasi otomatis seperti hasil spell-checker — ia menangkap 90% kesalahan ketik, tetapi dokumen final tetap dibaca manusia. Tidak ada yang menerbitkan kontrak hanya bermodal spell-checker.",
      ],
      reference: "Pilih tool dari arsitektur + budaya organisasimu. Otomatis mengusulkan, manusia memverifikasi.",
    },
    {
      id: "konsep-glossary",
      eyebrow: "Langkah 5 · Konsep",
      title: "Glossary & Stewardship — Si Wasit Bahasa dan Si Penjaga Gerbang",
      prose: [
        "Definisi: business glossary adalah kamus definisi bisnis yang disepakati — satu arti resmi untuk tiap istilah (“nasabah aktif = nasabah dengan ≥1 transaksi 90 hari terakhir”). Stewardship adalah peran manusia yang merawatnya: data steward memverifikasi klasifikasi, menyetujui definisi baru, dan menjadi penanggung jawab kualitas satu domain data. Workflow tipikal: analis mengusulkan istilah atau klasifikasi → steward domain memverifikasi → dewan data mengesahkan bila lintas domain.",
        "Kepribadiannya: glossary seperti wasit bahasa di rapat — ketika finance dan marketing berdebat soal “pendapatan”, wasit meniup peluit dan menunjuk definisi resmi. Steward seperti penjaga gerbang museum — ia memutuskan artefak (definisi, label) mana yang layak dipajang dan mana yang masih perlu restorasi. Tanpa wasit, tiap rapat adalah debat kusir; tanpa penjaga, museum penuh barang palsu.",
        "Kapan memakai: glossary wajib ketika satu istilah dipakai >2 divisi dengan arti berbeda — tanda bahayanya adalah dashboard yang angkanya “tidak cocok” antar tim. Stewardship wajib ketika katalog sudah ada tetapi kualitasnya stagnan — seseorang harus bernama sebagai pemilik tiap domain. Kapan TIDAK: tim kecil satu domain — definisi bisa disepakati di satu dokumen; birokrasi dewan data justru memperlambat.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi: glossary yang baik ditulis dengan contoh dan counter-example, bukan definisi kamus. “Nasabah aktif = nasabah dengan ≥1 transaksi 90 hari terakhir (bukan yang hanya login)” — counter-example-nya yang membuatnya berguna.",
      ],
      reference: "Wasit bahasa + penjaga gerbang: definisi disepakati, diverifikasi manusia bernama.",
    },
    {
      id: "lab-katalog",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun katalog mini: klasifikasi PII + skor kelengkapan",
      prose: [
        "Waktunya jadi steward katalog-nya. Di bawah ada skema tiga tabel sintetis plus metadata yang terisi sebagian. Tugasmu: (1) tulis fungsi klasifikasi kolom — PII bila namanya cocok pola identifier, KUASI bila cocok pola quasi-identifier, NON-PII bila tidak cocok; (2) hitung total kolom PII dan KUASI di seluruh skema; (3) hitung skor kelengkapan metadata per tabel (field terisi / 4 field wajib); (4) cetak laporan katalognya.",
        "Coba: setelah lolos, tambahkan pola \"alamat\" ke daftar PII dan kolom \"alamat_rumah\" ke tabel nasabah — perhatikan total PII berubah. Perhatikan juga: nama_produk ikut terhitung PII — false positive klasik pola-nama (nama barang, bukan nama orang). Inilah alasan alur “otomatis mengusulkan, manusia memverifikasi”: di dunia nyata, steward akan menolak label itu sebelum dikunci. Lalu tanya: kolom id_nasabah bukan PII menurut polamu — tetapi ia bisa me-re-identifikasi bila digabung dengan tabel lain. Apa implikasinya untuk klasifikasi otomatis? (Petunjuk: inilah kenapa steward manusia tidak tergantikan.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `klasifikasi_kolom(nama)`: kembalikan \"PII\" / \"KUASI\" / \"NON-PII\" berdasar pola nama" },
        { id: "t2", text: "Hitung `total_pii` dan `total_kuasi` di seluruh skema" },
        { id: "t3", text: "Hitung `skor` dict per tabel (persen, 1 desimal) dan `skor_rata`" },
        { id: "t4", text: "Jalankan dan pastikan laporan tercetak" },
      ],
      expected: "PII langsung: 4 kolom | Kuasi-identifier: 3 kolom\nKelengkapan: nasabah 75.0% | transaksi 100.0% | produk 25.0% | rata-rata 66.7%",
      code: {
        starter: `# Skema contoh (SINTETIS)
skema = {
    "nasabah": ["id_nasabah", "nik", "nama_lengkap", "email", "tgl_lahir", "kode_pos", "segmen"],
    "transaksi": ["id_trx", "tanggal", "nominal", "id_nasabah"],
    "produk": ["id_produk", "nama_produk", "kategori"],
}
# Metadata terisi: deskripsi, owner, klasifikasi, lineage
meta = {
    "nasabah": {"deskripsi": "Data nasabah bank", "owner": "tim CRM", "klasifikasi": "sebagian", "lineage": ""},
    "transaksi": {"deskripsi": "Mutasi harian", "owner": "tim Ops", "klasifikasi": "lengkap", "lineage": "core banking -> ODS"},
    "produk": {"deskripsi": "", "owner": "tim Produk", "klasifikasi": "", "lineage": ""},
}
FIELD_WAJIB = ["deskripsi", "owner", "klasifikasi", "lineage"]
POLA_PII = ["nik", "ktp", "nama", "email", "telp", "phone", "no_hp"]
POLA_KUASI = ["tgl", "tanggal", "lahir", "kode_pos", "zip", "kelamin", "kota"]

# TULIS KODEMU DI BAWAH INI
def klasifikasi_kolom(nama):
    return

total_pii = 0  # TODO: hitung kolom PII di seluruh skema
total_kuasi = 0  # TODO: hitung kolom KUASI di seluruh skema

skor = {}  # TODO: {tabel: persen kelengkapan 1 desimal}
skor_rata = 0.0  # TODO: rata-rata skor, 1 desimal

print(f"PII langsung: {total_pii} kolom | Kuasi-identifier: {total_kuasi} kolom")
laporan = " | ".join(f"{t} {skor[t]:.1f}%" for t in skema)
print(f"Kelengkapan: {laporan} | rata-rata {skor_rata:.1f}%")`,
        lockLines: 18,
        solution: `# Skema contoh (SINTETIS)
skema = {
    "nasabah": ["id_nasabah", "nik", "nama_lengkap", "email", "tgl_lahir", "kode_pos", "segmen"],
    "transaksi": ["id_trx", "tanggal", "nominal", "id_nasabah"],
    "produk": ["id_produk", "nama_produk", "kategori"],
}
# Metadata terisi: deskripsi, owner, klasifikasi, lineage
meta = {
    "nasabah": {"deskripsi": "Data nasabah bank", "owner": "tim CRM", "klasifikasi": "sebagian", "lineage": ""},
    "transaksi": {"deskripsi": "Mutasi harian", "owner": "tim Ops", "klasifikasi": "lengkap", "lineage": "core banking -> ODS"},
    "produk": {"deskripsi": "", "owner": "tim Produk", "klasifikasi": "", "lineage": ""},
}
FIELD_WAJIB = ["deskripsi", "owner", "klasifikasi", "lineage"]
POLA_PII = ["nik", "ktp", "nama", "email", "telp", "phone", "no_hp"]
POLA_KUASI = ["tgl", "tanggal", "lahir", "kode_pos", "zip", "kelamin", "kota"]

# TULIS KODEMU DI BAWAH INI
def klasifikasi_kolom(nama):
    n = nama.lower()
    if any(p in n for p in POLA_PII):
        return "PII"
    if any(p in n for p in POLA_KUASI):
        return "KUASI"
    return "NON-PII"

total_pii = 0
total_kuasi = 0
for tabel, kolom_list in skema.items():
    for k in kolom_list:
        hasil = klasifikasi_kolom(k)
        if hasil == "PII":
            total_pii += 1
        elif hasil == "KUASI":
            total_kuasi += 1

skor = {}
for tabel in skema:
    terisi = sum(1 for f in FIELD_WAJIB if meta[tabel][f])
    skor[tabel] = round(terisi / len(FIELD_WAJIB) * 100, 1)
skor_rata = round(sum(skor.values()) / len(skor), 1)

print(f"PII langsung: {total_pii} kolom | Kuasi-identifier: {total_kuasi} kolom")
laporan = " | ".join(f"{t} {skor[t]:.1f}%" for t in skema)
print(f"Kelengkapan: {laporan} | rata-rata {skor_rata:.1f}%")`,
        checks: [
          { kind: "equal", task: "t2", name: "total_pii", value: 4, tol: 0, label: "`total_pii` harus 4", msg: "nik, nama_lengkap, email + nama_produk (false positive pola-nama!)." },
          { kind: "equal", task: "t2", name: "total_kuasi", value: 3, tol: 0, label: "`total_kuasi` harus 3", msg: "tgl_lahir, kode_pos, tanggal." },
          { kind: "equal", task: "t3", name: "skor_rata", value: 66.7, tol: 0.05, label: "`skor_rata` harus 66,7", msg: "(75,0 + 100,0 + 25,0) / 3." },
          { kind: "uses", task: "t1", token: "lower", label: "Normalisasi nama kolom", msg: "Pencocokan pola harus case-insensitive." },
          { kind: "stdout_matches", task: "t4", pattern: "Kelengkapan: nasabah 75\\.0%", label: "Laporan kelengkapan tercetak", msg: "Baris kedua diawali 'Kelengkapan: nasabah 75.0%'." },
        ],
      },
      note: {
        title: "Catatan jujur: ini model mental, bukan Purview-nya",
        type: "risk",
        body: "Lab ini mensimulasikan logika klasifikasi pola-nama — cara yang sama dipakai tahap awal tool komersial. Yang tidak disimulasikan: pemindaian nilai aktual (regex NIK pada sampel data), lineage otomatis dari query log, dan workflow verifikasi steward. Logikanya 1:1, skalanya mainan.",
      },
      reference: "Klasifikasi pola-nama + skor kelengkapan = dua metrik kesehatan katalog yang bisa dihitung hari ini juga.",
    },
    {
      id: "chart-kelengkapan",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca skor kelengkapan",
      prose: [
        "Chart di bawah memvisualisasikan skor kelengkapan metadata tiga tabel dari lab — metrik yang sama dipakai dashboard adopsi katalog di dunia nyata.",
        "Cara membaca: sumbu X = tabel; tinggi batang = persen field metadata wajib yang terisi (deskripsi, owner, klasifikasi, lineage). Garis putus-putus = ambang 75%, batas “layak pakai” untuk analis baru.",
        "Interpretasi: transaksi (100%) adalah teladan — lengkap, bisa dipakai tanpa bertanya ke siapa pun. Nasabah (75%) pas di ambang: bisa dipakai, tetapi lineage-nya kosong — analis tidak tahu data ini berasal dari sistem apa. Produk (25%) adalah katalog palsu: terdaftar tetapi tidak menjelaskan apa-apa — lebih buruk daripada tidak terdaftar, karena memberi ilusi “sudah terdokumentasi”. Pelajaran chart ini: kejar 75%+ untuk tabel yang paling sering dipakai dulu — katalogisasi adalah triase, bukan sensus.",
      ],
      figure: {
        svg: COMPLETE_SVG,
        alt: "Diagram batang: nasabah 75%, transaksi 100%, produk 25%; garis ambang 75%.",
        caption: "Skor kelengkapan metadata per tabel — kejar ambang 75% untuk tabel terpakai dulu.",
      },
      tasks: [],
      reference: "Katalogisasi = triase: 75%+ dulu untuk tabel yang paling sering dipakai.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Membangun katalog — mulai dari mana?",
      prose: [
        "Lima skenario keputusan katalog:",
        "Skenario 1 — Perusahaan 300 orang, analis 25, Azure + Power BI di mana-mana, belum ada katalog. → Microsoft Purview: harvest otomatis ekosistem Microsoft dalam minggu pertama, lalu tugaskan steward per domain mengisi deskripsi. Alasan: hambatan adopsi terendah — tool-nya sudah “di rumah”.",
        "Skenario 2 — Bank besar, regulator ketat, tim stewardship 8 orang, multi-cloud. → Collibra: glossary + workflow verifikasi yang kuat, lineage lintas sistem untuk bukti audit. Alasan: kebutuhan governance berat mengalahkan kecepatan discovery.",
        "Skenario 3 — Startup data-driven 80 orang, analis mandiri, tidak ada tim governance. → Alation (atau katalog open-source): pencarian natural language, adopsi analis cepat. Alasan: tanpa adopsi analis, katalog mati — prioritaskan discovery di atas workflow.",
        "Skenario 4 — Sudah beli tool mahal setahun lalu, adopsi 11% deskripsi. → Jangan ganti tool — perbaiki proses: tetapkan owner per domain, jadikan “deskripsi terisi” sebagai definisi selesai (definition of done) tiap pipeline baru, ukur skor kelengkapan mingguan. Alasan: masalahnya bukan mesin, melainkan tidak ada yang mengemudi.",
        "Skenario 5 — Klasifikasi otomatis menandai 40% kolom sebagai PII (banyak false positive). → Turunkan ambang ke mode “usulan”, wajibkan verifikasi steward sebelum label dikunci, dan ukur presisi klasifikasi per pola. Alasan: label yang tidak dipercaya = label yang diabaikan — presisi lebih penting dari recall di sini.",
        "Aturan praktis 10 detik: mau katalog? → (1) siapa steward tiap domain — ada namanya? (2) harvest otomatis jalan? (3) definisi selesai mencakup metadata? (4) skor kelengkapan diukur mingguan? Kalau jawaban (1) “belum ada”, jangan beli tool dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengukur keberhasilan katalog dari jumlah aset ter-harvest. Harvest itu gratis dan otomatis — metrik vanity. Ukur dari: % deskripsi terisi, % query analis yang dimulai dari katalog (bukan dari chat), dan waktu menemukan data yang tepat.",
      },
      reference: "Tool mengikuti arsitektur + budaya. Metrik yang benar: kelengkapan, adopsi, waktu discovery.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bank Nusantara: 4.200 aset, 11% deskripsi",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank Nusantara membeli katalog enterprise 18 bulan lalu. Hari ini: 4.200 aset ter-harvest, 11% punya deskripsi, 23% punya owner, 7% terklasifikasi. Tiga analis senior resign — dan ternyata merekalah “katalog berjalan” yang ditanyai semua orang. Direksi bertanya: beli tool baru atau perbaiki yang ada?",
        "Pertanyaan analisis: (1) Diagnosis akarmu — tool, proses, atau orang? (2) Rencana 90 hari dengan angka target yang konkret. (3) Bagaimana mencegah analis baru mengulangi pola “bertanya ke chat”?",
        "Pembahasan: (1) Proses + orang, bukan tool. Bukti: harvest berhasil (4.200 aset) — mesinnya bekerja; yang gagal adalah pengisian (11%) dan ownership (23%) — tidak ada definisi selesai, tidak ada steward bernama. (2) Rencana 90 hari: minggu 1–2 tetapkan steward per domain (nama + tanggung jawab tertulis); minggu 3–6 kejar 20 tabel terpakai (ukur dari query log) hingga skor kelengkapan ≥ 75% — target konkret: 20 tabel × 75%; minggu 7–12 jadikan metadata sebagai definition of done pipeline baru + dashboard skor mingguan ke manajemen. Target akhir kuartal: 20 tabel inti ≥ 75%, bukan 4.200 aset seadanya. (3) Buat katalog sebagai gerbang: akses tabel inti baru wajib lewat katalog (link katalog di setiap dashboard), dan ukur % discovery via katalog. Orang memakai yang termudah — jadikan katalog jalur termudah.",
        "Catatan implementasi: triase 20 tabel terpakai dari query log warehouse — bukan dari tebakan. Tabel yang tidak pernah di-query tidak perlu dikatalogkan duluan; ia tidak punya pelanggan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Katalog yang kosong adalah risiko regulasi yang tersembunyi: saat regulator bertanya “data nasabah sensitif ada di mana saja?”, jawaban “ada di katalog, tapi klasifikasinya 7%” sama dengan “tidak tahu”. Katalog parsial memberi rasa aman palsu — lebih berbahaya daripada mengaku belum punya.",
      },
      reference: "Perbaiki proses dulu: steward bernama, definition of done, ukur mingguan. Tool kedua.",
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
        "Katalog data = inventaris aset + metadata: discovery, klasifikasi, glossary, lineage.",
        "Harvest otomatis mengumpulkan; klasifikasi otomatis mengusulkan (pola nama + pola nilai); steward manusia memverifikasi.",
        "Purview unggul di ekosistem Microsoft; Collibra di governance enterprise berat; Alation di discovery/adopsi analis.",
        "Skor kelengkapan = field terisi / field wajib; kejar ≥ 75% untuk tabel terpakai dulu.",
        "Katalog memantulkan disiplin metadata — ukur kelengkapan & adopsi, bukan jumlah aset.",
      ],
      next: { label: "DM25 — Great Expectations & Automated Data Quality", href: "/v2/learn/dm25-great-expectations" },
      quiz: [
        {
          q: "Katalog berisi 4.200 aset, 11% berdeskripsi. Diagnosis yang tepat?",
          options: [
            { text: "Proses gagal: tidak ada steward bernama dan metadata bukan definition of done — tool-nya bekerja (harvest sukses)", why: "Benar: harvest otomatis berhasil membuktikan mesinnya jalan; yang kosong adalah kontribusi manusianya.", correct: true },
            { text: "Tool-nya jelek — harus ganti vendor", why: "Salah: mengganti mesin tidak memperbaiki fakta tidak ada yang mengemudi. Masalahnya 11% deskripsi, bukan fitur tool." },
            { text: "Harvest otomatisnya rusak", why: "Salah: 4.200 aset ter-harvest = harvest bekerja. Yang rusak adalah pengisian metadata." },
            { text: "Terlalu banyak aset — hapus sebagian", why: "Salah: jumlah aset bukan masalah; masalahnya kelengkapan. Menghapus aset = menyembunyikan gejala." },
          ],
        },
        {
          q: "Klasifikasi otomatis menandai kolom kode_produk sebagai PII. Respons yang benar?",
          options: [
            { text: "Tolak/usulkan ulang — verifikasi steward sebelum label dikunci; ukur presisi klasifikasi", why: "Benar: klasifikasi otomatis adalah tebakan; false positive yang dibiarkan merusak kepercayaan pada seluruh label.", correct: true },
            { text: "Terima saja — mesin lebih teliti dari manusia", why: "Salah: mesin tidak paham konteks bisnis; kode_produk bukan PII. Kepercayaan buta = label sampah." },
            { text: "Matikan klasifikasi otomatis sepenuhnya", why: "Salah: membuang 90% pekerjaan yang benar karena 10% salah. Yang benar: mode usulan + verifikasi." },
            { text: "Hapus kolomnya dari katalog", why: "Salah: menyembunyikan kolom tidak menyelesaikan klasifikasi; analis tetap butuh kolom itu." },
          ],
        },
        {
          q: "Bank di ekosistem Azure + Power BI, belum ada katalog, analis 25 orang. Pilihan paling masuk akal?",
          options: [
            { text: "Microsoft Purview — harvest otomatis ekosistem Microsoft, hambatan adopsi terendah", why: "Benar: tool mengikuti arsitektur yang sudah ada; Purview paling dalam di rumah Microsoft.", correct: true },
            { text: "Collibra — karena paling mahal berarti paling bagus", why: "Salah: harga bukan kriteria; tanpa tim stewardship, Collibra = orkestra tanpa konduktor." },
            { text: "Bangun katalog sendiri dari nol dengan spreadsheet", why: "Salah: 25 analis butuh discovery serius; spreadsheet tidak punya harvest otomatis dan lineage." },
            { text: "Tidak perlu katalog — analis sudah saling kenal", why: "Salah: “saling kenal” tidak scalable dan runtuh saat orang resign — persis seperti mini-case." },
          ],
        },
        {
          q: "Tabel produk: 1 dari 4 field metadata terisi. Skor kelengkapannya dan artinya?",
          options: [
            { text: "25% — di bawah ambang 75%, tabel ini katalog palsu: terdaftar tapi tak menjelaskan apa-apa", why: "Benar: 1/4 = 25%. Di bawah ambang, analis tetap harus bertanya ke orang.", correct: true },
            { text: "25% — cukup, karena yang penting terdaftar", why: "Salah: terdaftar tanpa isi = ilusi dokumentasi; lebih berbahaya daripada tidak terdaftar." },
            { text: "75% — sudah layak pakai", why: "Salah: 1 dari 4 = 25%, bukan 75%. Hitung dulu sebelum menilai." },
            { text: "Tidak bisa dihitung tanpa tool komersial", why: "Salah: rumusnya field terisi / field wajib — bisa dihitung di spreadsheet hari ini juga." },
          ],
        },
        {
          q: "Mengapa glossary bisnis (kamus definisi) termasuk fungsi inti katalog?",
          options: [
            { text: "Karena “pendapatan” bisa beda arti antar divisi — tanpa definisi bersama, angka yang sama diperdebatkan tiap rapat", why: "Benar: glossary adalah wasit bahasa; tanpanya, lineage teknis pun tidak menyelamatkan makna.", correct: true },
            { text: "Karena regulator mewajibkan kamus", why: "Salah: regulator mewajibkan bukti dan kontrol, bukan kamus secara spesifik. Manfaatnya operasional." },
            { text: "Karena tool katalog tidak laku tanpa fitur kamus", why: "Salah: ini alasan vendor, bukan alasan bisnis. Fungsinya menyelesaikan konflik definisi nyata." },
            { text: "Karena analis suka membaca definisi", why: "Salah: analis tidak suka membaca definisi — mereka benci berdebat soal angka yang definisinya kabur." },
          ],
        },
      ],
    },
  ],
};
