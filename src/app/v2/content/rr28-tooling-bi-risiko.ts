import type { V2Lesson } from "../lib/types";

// Semantic layer: satu kamus metrik mengalir ke semua dasbor.
const FIG_SEMANTIC = `<svg viewBox="0 0 480 260" role="img" aria-label="Satu kamus metrik mengalirkan definisi NPL yang sama ke tiga dasbor.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="90" y="14" width="300" height="52" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="240" y="36" font-size="12" font-weight="600" fill="#fff">Kamus Metrik v2.1</text>
<text x="240" y="54" font-size="11" fill="#fff">NPL = Kol 3,4,5 / total kredit</text>
<g stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ah2)">
<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--chart-text)"/></marker></defs>
<line x1="140" y1="66" x2="110" y2="110"/>
<line x1="240" y1="66" x2="240" y2="110"/>
<line x1="340" y1="66" x2="370" y2="110"/>
</g>
<rect x="30" y="110" width="130" height="70" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="95" y="134" font-size="11" font-weight="600" fill="#fff">Dasbor Komite</text>
<text x="95" y="156" font-size="14" font-weight="700" fill="#fff">NPL 35,71%</text>
<rect x="175" y="110" width="130" height="70" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="240" y="134" font-size="11" font-weight="600" fill="#fff">Dasbor Bisnis</text>
<text x="240" y="156" font-size="14" font-weight="700" fill="#fff">NPL 35,71%</text>
<rect x="320" y="110" width="130" height="70" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="385" y="134" font-size="11" font-weight="600" fill="#fff">Dasbor Regulator</text>
<text x="385" y="156" font-size="14" font-weight="700" fill="#fff">NPL 35,71%</text>
<text x="240" y="212" font-size="12" fill="var(--chart-text)">Satu definisi → banyak dasbor → satu angka.</text>
<text x="240" y="232" font-size="11" fill="var(--text-muted)">Tanpa kamus: tiga dasbor, tiga angka, satu rapat ribut.</text>
</g>
</svg>`;

export const rr28: V2Lesson = {
  slug: "rr28-tooling-bi-risiko",
  track: "Risk Reporting",
  module: "Tooling BI untuk Risiko",
  title: "RR28 — Tooling BI untuk Pelaporan Risiko",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini tentang perkakas pelaporan risiko: kapan pakai spreadsheet, kapan BI tool, kapan notebook — dan yang lebih penting, bagaimana memastikan semua perkakas itu menampilkan angka yang SAMA. Isi lesson: (1) peta tooling, (2) semantic layer — satu definisi untuk semua dasbor, (3) lab: tiga definisi NPL atas data yang sama, (4) anatomi dasbor risiko yang baik, (5) tata kelola dasbor dan akses.",
        "Setelah lesson ini kamu bisa: (1) memilih perkakas yang tepat untuk tiap jenis laporan risiko; (2) menjelaskan apa itu semantic layer dan kenapa tanpanya tiga dasbor bisa menampilkan tiga angka berbeda; (3) menyebutkan 4 elemen dasbor resmi (pemilik, versi, tanggal data, sumber); (4) merancang hierarki dasbor ringkasan → drill-down dengan pewarnaan berbasis ambang.",
      ],
      tasks: [],
      reference: "Tooling ≠ definisi. Perkakas menampilkan definisi yang ditanam ke dalamnya.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tiga dasbor, tiga angka NPL, satu rapat ribut",
      prose: [
        "Rapat komite risiko, Selasa pagi. Slide direksi: NPL 3,4% — turun, kabar baik. Head of Business mengangkat tangan: “Di dasbor saya 4,1% — naik. Mana yang benar?” Hening. Analis kepatuhan membuka dasbor ketiga di laptopnya: 3,9%. Tiga dasbor resmi bank, tiga angka NPL untuk bulan yang sama, tiga kesimpulan yang saling bertentangan. Rapat 2 jam berubah menjadi debat definisi — dan tidak satu pun keputusan diambil hari itu.",
        "Twist-nya: datanya SAMA. Ketiga dasbor menarik dari data warehouse yang sama, untuk periode yang sama. Yang berbeda adalah definisinya — dan tidak satu pun definisi itu tertulis di mana pun. Dasbor komite memakai definisi klasik (Kol 3,4,5). Dasbor bisnis memasukkan Kol 2 yang direstrukturisasi (“lebih konservatif”). Dasbor kepatuhan memakai definisi lama sebelum hapusbuku dikeluarkan. Ketiganya “benar” menurut definisinya masing-masing — dan ketiganya salah dipakai tanpa label definisi.",
        "Pelajaran lesson ini: masalah tooling pelaporan risiko jarang soal teknologinya. Hampir selalu soal definisi yang tidak ditulis, dasbor yang tidak punya pemilik, dan angka yang beredar tanpa tanggal potong. Perkakas hanya mempercepat — ia mempercepat kekacauan sama cepatnya dengan mempercepat kebenaran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan limit, provisi, dan strategi penagihan memakai angka NPL. Jika angka yang dipakai komite salah definisi 0,7 pp, keputusan modal dan limit ikut meleset — dan tidak ada yang tahu sampai audit datang.",
      },
      reference: "Tiga dasbor tiga angka = tiga definisi tak tertulis. Tulis definisinya dulu.",
    },
    {
      id: "peta-tooling",
      eyebrow: "Langkah 3 · Tooling",
      title: "Spreadsheet, BI tool, notebook: pilih senjata yang tepat",
      prose: [
        "Spreadsheet: raja kecepatan. Cocok untuk laporan sekali pakai, ad-hoc, atau analisis yang butuh fleksibilitas penuh — misalnya jawaban cepat untuk pertanyaan regulator yang spesifik. Kelemahannya: audit trail lemah (siapa mengubah sel apa, kapan?), versi beranak-pinak di email (“final_v7_REVISI.xlsx”), dan rumus tersembunyi yang tidak bisa di-review. Aturan: spreadsheet boleh untuk menjawab pertanyaan, tidak boleh menjadi SISTEM laporan bulanan.",
        "BI tool (dasbor): raja konsistensi. Cocok untuk laporan berulang ke audiens banyak — komite, direksi, cabang. Kekuatannya: satu definisi dipakai semua orang, refresh otomatis, drill-down. Kelemahannya: butuh tata kelola (tanpa pemilik dan versi, BI tool = pabrik dasbor bayangan), dan membangunnya butuh investasi awal. Aturan: laporan yang terbit lebih dari 3x dengan format sama = kandidat BI tool.",
        "Notebook: raja eksplorasi. Cocok untuk analis yang menguji hipotesis baru — “apakah NPL segmen X naik karena musim?” Kelemahannya: bukan alat distribusi. Notebook yang dikirim ke komite sebagai “laporan” = analisis yang belum selesai dikemas sebagai keputusan. Aturan: notebook untuk menemukan, dasbor untuk menyampaikan.",
        "Aturan praktis 10 detik: sekali pakai + butuh besok pagi = spreadsheet terkunci + review sejawat. Berulang + banyak audiens = BI tool + kamus metrik. Masih bertanya-tanya = notebook, jangan buru-buru jadi dasbor.",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap laporan di kantormu, tandai: sekali pakai / berulang / eksplorasi — lalu cocokkan dengan perkakasnya" },
      ],
      expected: "Laporan berulang yang masih dibuat manual di spreadsheet = kandidat migrasi pertama.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Semuanya harus di BI tool biar modern.” Dasbor untuk pertanyaan yang hanya ditanyakan sekali = biaya bangun tanpa manfaat. Modernisasi yang benar = perkakas mengikuti pola pakai, bukan sebaliknya.",
      },
      reference: "Sekali pakai = spreadsheet. Berulang = BI tool. Eksplorasi = notebook.",
    },
    {
      id: "semantic-layer",
      eyebrow: "Langkah 4 · Semantic layer",
      title: "Satu definisi untuk semua dasbor",
      prose: [
        "Semantic layer (metrics layer) = definisi metrik yang ditulis SATU kali di satu tempat, lalu dipakai oleh semua dasbor dan laporan. NPL dihitung sekali — dengan definisi resmi dari kamus metrik — dan dasbor komite, dasbor bisnis, dasbor regulator semuanya memanggil definisi yang sama. Hasilnya: figur di atas — tiga dasbor, satu angka.",
        "Penyakit klasik yang disembuhkan: tiga dasbor tiga angka NPL berbeda (cerita Langkah 2). Akarnya bukan data — melainkan tiga analis menulis rumus NPL sendiri-sendiri di tiga dasbor. Semantic layer memindahkan rumus dari tangan analis ke tangan pemilik definisi: biasanya tim risk methodology, dengan versi dan tanggal berlaku.",
        "Cara membaca figur: kotak atas = kamus metrik (pemilik definisi, versi 2.1). Tiga panah = tiga dasbor memanggil definisi yang sama. Interpretasi: yang distandarkan bukan tampilannya — melainkan RUMUSNYA. Dasbor boleh beda warna dan layout; angkanya tidak boleh beda.",
        "Kamus metrik yang baik memuat per metrik: definisi persis (termasuk perlakuan kasus tepi: hapusbuku? restrukturisasi?), pemilik, versi + tanggal berlaku, dan riwayat perubahan. Tanpa tanggal berlaku, kamu tidak bisa menjawab “kenapa NPL Januari dihitung ulang?” — dan pertanyaan itu PASTI datang dari auditor.",
      ],
      formula: String.raw`\text{NPL} = \frac{\text{plafon Kol 3,4,5}}{\text{total kredit}} \times 100\%`,
      formulaNote: "NPL = rasio kredit bermasalah. Pembilang: total plafon kredit dengan kolektibilitas 3 (kurang lancar), 4 (diragukan), 5 (macet). Penyebut: total plafon kredit. ×100% agar menjadi persen. Interpretasi: “35,71% berarti Rp35,71 dari setiap Rp100 kredit sedang bermasalah.” Jebakan: rumus ini “benar” dalam tiga versi berbeda — yang menentukan versinya adalah definisi resmi di kamus metrik, bukan rumusnya.",
      figure: {
        svg: FIG_SEMANTIC,
        alt: "Satu kamus metrik mengalirkan definisi NPL yang sama ke tiga dasbor.",
        caption: "Semantic layer: satu definisi, banyak dasbor — semua menampilkan angka yang sama.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“BI tool-nya mahal, jadi angkanya pasti benar.” Perkakas tidak menciptakan kebenaran — ia hanya menampilkan definisi yang ditanam ke dalamnya. Definisi salah di tool mahal = angka salah yang terlihat meyakinkan. Yang menentukan benar = kamus metrik, bukan harga lisensi.",
      },
      reference: "Satu metrik, satu definisi, satu pemilik, berversi.",
    },
    {
      id: "lab-npl",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: tiga definisi, tiga angka",
      prose: [
        "Lab ini merekonstruksi rapat ribut di Langkah 2 dalam bentuk kode: 10 debitur dengan kolektibilitas, status restrukturisasi, dan hapusbuku. Kamu menghitung NPL dengan TIGA definisi yang semuanya “masuk akal”: Klasik (Kol 3,4,5 dari kredit aktif), Konservatif (tambah Kol 2 yang direstrukturisasi), dan Versi Lama (sebelum kredit hapusbuku dikeluarkan). Data sama — angkanya berbeda. Lalu kamu tetapkan SATU sebagai definisi resmi.",
        "Perhatikan di mana selisihnya muncul: Konservatif vs Klasik berbeda karena perlakuan restrukturisasi; Versi Lama berbeda karena perlakuan hapusbuku. Inilah dua kasus tepi yang WAJIB tertulis di kamus metrik — karena di sinilah analis paling sering “berkreasi” sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Saring `aktif` (belum dihapusbuku) dan hitung `total_aktif`" },
        { id: "t2", text: "Hitung ketiga definisi NPL, tetapkan `npl_resmi` = versi Klasik" },
      ],
      expected: "Komite (klasik): 35.71% — Bisnis (konservatif): 46.43% — Versi lama: 38.36% — NPL RESMI: 35.71%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“NPL ya NPL, definisinya pasti sama di mana-mana.” Lab ini membuktikan: tiga definisi yang semuanya masuk akal menghasilkan 35,71% vs 46,43% vs 38,36%. “NPL” tanpa label definisi = angka tanpa arti.",
      },
      hints: [
        "aktif = [k for k in kredit if not k[4]] — k[4] adalah flag dihapusbuku.",
        "Kol 3,4,5: k[2] >= 3. Kol 2 yang direstrukturisasi: k[2] == 2 and k[3].",
        "Versi Lama memakai seluruh `kredit` (termasuk hapusbuku), bukan `aktif`.",
      ],
      code: {
        starter: `# Portofolio kredit: (id, plafon Rp miliar, kolektibilitas, direstrukturisasi, dihapusbuku)
# JANGAN UBAH baris ini.
kredit = [
    ("A", 100, 1, False, False),
    ("B", 200, 2, False, False),
    ("C", 150, 2, True,  False),
    ("D", 300, 3, False, False),
    ("E", 120, 4, False, False),
    ("F", 80, 5, False, False),
    ("G", 250, 1, True,  False),
    ("H", 60, 5, False, True),
    ("I", 90, 2, False, False),
    ("J", 110, 1, False, False),
]

# TULIS KODEMU: kredit aktif (belum dihapusbuku) + total plafon aktif
aktif =
total_aktif =

# TULIS KODEMU: NPL Klasik = plafon Kol 3,4,5 aktif / total_aktif * 100
npl_klasik =

# TULIS KODEMU: NPL Konservatif = (Kol 3,4,5 + Kol 2 direstrukturisasi) / total_aktif * 100
npl_konservatif =

# TULIS KODEMU: NPL Versi Lama = Kol 3,4,5 (termasuk hapusbuku) / total bruto * 100
npl_versi_lama =

# TULIS KODEMU: definisi RESMI bank = versi Klasik, bulatkan 2 desimal
npl_resmi =
print(f"Komite (klasik)      : {npl_klasik:.2f}%")
print(f"Bisnis (konservatif) : {npl_konservatif:.2f}%")
print(f"Versi lama           : {npl_versi_lama:.2f}%")
print(f"NPL RESMI            : {npl_resmi:.2f}%")`,
        lockLines: 13,
        solution: `# Portofolio kredit: (id, plafon Rp miliar, kolektibilitas, direstrukturisasi, dihapusbuku)
# JANGAN UBAH baris ini.
kredit = [
    ("A", 100, 1, False, False),
    ("B", 200, 2, False, False),
    ("C", 150, 2, True,  False),
    ("D", 300, 3, False, False),
    ("E", 120, 4, False, False),
    ("F", 80, 5, False, False),
    ("G", 250, 1, True,  False),
    ("H", 60, 5, False, True),
    ("I", 90, 2, False, False),
    ("J", 110, 1, False, False),
]

# TULIS KODEMU: kredit aktif (belum dihapusbuku) + total plafon aktif
aktif = [k for k in kredit if not k[4]]
total_aktif = sum(k[1] for k in aktif)

# TULIS KODEMU: NPL Klasik = plafon Kol 3,4,5 aktif / total_aktif * 100
npl_klasik = sum(k[1] for k in aktif if k[2] >= 3) / total_aktif * 100

# TULIS KODEMU: NPL Konservatif = (Kol 3,4,5 + Kol 2 direstrukturisasi) / total_aktif * 100
npl_konservatif = sum(k[1] for k in aktif if k[2] >= 3 or (k[2] == 2 and k[3])) / total_aktif * 100

# TULIS KODEMU: NPL Versi Lama = Kol 3,4,5 (termasuk hapusbuku) / total bruto * 100
npl_versi_lama = sum(k[1] for k in kredit if k[2] >= 3) / sum(k[1] for k in kredit) * 100

# TULIS KODEMU: definisi RESMI bank = versi Klasik, bulatkan 2 desimal
npl_resmi = round(npl_klasik, 2)
print(f"Komite (klasik)      : {npl_klasik:.2f}%")
print(f"Bisnis (konservatif) : {npl_konservatif:.2f}%")
print(f"Versi lama           : {npl_versi_lama:.2f}%")
print(f"NPL RESMI            : {npl_resmi:.2f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "aktif", label: "`aktif` didefinisikan", msg: "Saring kredit yang belum dihapusbuku: k[4] adalah flag dihapusbuku." },
          { kind: "equal", task: "t2", name: "npl_klasik", value: 35.71, tol: 0.01, label: "NPL Klasik = 35,71%", msg: "500/1400 × 100 = 35,71%." },
          { kind: "equal", task: "t2", name: "npl_konservatif", value: 46.43, tol: 0.01, label: "NPL Konservatif = 46,43%", msg: "(500+150)/1400 × 100 = 46,43%." },
          { kind: "equal", task: "t2", name: "npl_versi_lama", value: 38.36, tol: 0.01, label: "NPL Versi Lama = 38,36%", msg: "560/1460 × 100 = 38,36%." },
          { kind: "stdout_matches", task: "t2", pattern: "NPL RESMI\\s*:\\s*35\\.71%", label: "NPL resmi tercetak", msg: "Definisi resmi bank = Klasik = 35,71%." },
        ],
      },
      reference: "Tiga definisi masuk akal, tiga angka berbeda. Label definisi = bagian dari angka.",
    },
    {
      id: "dasbor-baik",
      eyebrow: "Langkah 6 · Dasbor",
      title: "Dasbor risiko yang dibaca komite",
      prose: [
        "Hierarki dulu: layar pertama = ringkasan untuk pengambil keputusan (5–7 angka kunci, status vs ambang). Klik = drill-down ke segmen (cabang, produk, vintage). Klik lagi = daftar debitur untuk analis. Satu dasbor untuk semua audiens = tidak ada yang paham: komite tenggelam di detail, analis kekurangan data.",
        "Pewarnaan harus berbasis ambang yang disepakati — bukan dekorasi. Merah = melewati ambang yang ditetapkan komite (mis. NPL > 5%), kuning = mendekati, hijau = aman. Warna tanpa ambang tertulis = opini desainer, bukan informasi risiko. Setiap warna di dasbor harus bisa dijawab: “ambang berapa?”",
        "Tanggal potong data wajib terlihat di setiap layar: “Data per 31 Okt 2026, ditarik 1 Nov 06:00.” Tanpa ini, dasbor yang dibuka Senin vs Jumat bisa dibaca sebagai dua fakta berbeda — padahal hanya beda refresh. Ingat checklist RR4: tanggal data adalah cek yang paling sering gagal.",
        "Satu angka, satu tempat: angka yang sama tidak boleh dihitung ulang di dua dasbor dengan rumus berbeda (inilah gunanya semantic layer dari Langkah 4). Jika dasbor menampilkan NPL, ia memanggil kamus — bukan menulis rumusnya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Buka satu dasbor di kantormu: adakah tanggal potong data di layarnya? Adakah warna yang tidak punya ambang tertulis?" },
      ],
      expected: "Daftar temuan: warna tanpa ambang + layar tanpa tanggal data = yang diperbaiki duluan.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Dasbor yang bagus = yang penuh grafik.” Dasbor komite yang baik justru SEPI: 5–7 angka, status vs ambang, satu tanggal data. Kepadatan grafik ≠ kualitas informasi — seringkali sebaliknya.",
      },
      reference: "Hierarki ringkasan → drill-down. Warna = ambang tertulis. Tanggal data selalu terlihat.",
    },
    {
      id: "tata-kelola",
      eyebrow: "Langkah 7 · Governance",
      title: "Dasbor resmi vs dasbor bayangan",
      prose: [
        "Dasbor bayangan = dasbor yang dipakai untuk keputusan tetapi tidak terdaftar, tidak punya pemilik, tidak berversi. Ia lahir dengan niat baik (“saya buatkan versi yang lebih cepat, Pak”) dan mati sebagai sumber angka liar. Aturannya keras: dasbor tanpa pemilik = dasbor yang tidak boleh dipakai untuk keputusan.",
        "Registri dasbor resmi memuat per dasbor: pemilik bernama, versi + tanggal berlaku, sumber data, tanggal refresh, dan audiens yang dituju. Setiap kuartal: rekonsiliasi dasbor vs laporan resmi — angka kunci harus cocok dalam toleransi; yang tidak cocok = insiden definisi, bukan “beda sudut pandang”.",
        "Akses dan keamanan: kebanyakan pengguna cukup melihat AGREGAT. Data baris per nasabah hanya untuk peran yang membutuhkan (penagihan, analis kredit) — dengan pencatatan akses. Ekspor ke spreadsheet dari dasbor = titik bocor klasik: tetapkan siapa boleh ekspor, dan ekspor massal butuh persetujuan. Dasbor yang bisa diakses semua orang + diekspor siapa saja = data nasabah yang menunggu bocor.",
        "Siklus hidup: dasbor yang tidak dibuka 6 bulan = kandidat arsip. Dasbor mati yang tetap tampil = jebakan: seseorang akan mengutip angkanya yang basi dalam rapat. Arsipkan dengan jelas, jangan biarkan menggantung.",
      ],
      tasks: [
        { id: "t1", text: "Susun draf registri untuk 3 dasbor yang paling sering dipakai di kantormu (pemilik, versi, sumber, tanggal refresh)" },
      ],
      expected: "Kolom yang kosong (biasanya: pemilik & versi) = pekerjaan tata kelola minggu ini.",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Data baris nasabah di dasbor yang bisa diakses seluruh kantor + tombol ekspor tanpa kontrol = insiden kebocoran data yang tinggal menunggu waktu. UU PDP membuat ini bukan sekadar masalah IT — ini masalah direksi.",
      },
      reference: "Tanpa pemilik = tanpa keputusan. Rekonsiliasi kuartalan dasbor vs laporan resmi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan pakai apa: peta keputusan tooling",
      prose: [
        "Skenario 1 — laporan sekali pakai, butuh besok pagi: spreadsheet + template terkunci + review sejawat. Jangan bangun dasbor untuk pertanyaan sekali tanya.",
        "Skenario 2 — laporan berulang ke banyak audiens: BI tool + semantic layer + registri dasbor. Investasi awal terbayar di bulan ketiga.",
        "Skenario 3 — analis menguji hipotesis baru: notebook. Promosikan ke dasbor resmi HANYA setelah definisinya masuk kamus metrik dan lolos rekonsiliasi.",
        "Skenario 4 — butuh data baris nasabah: agregat dulu untuk semua orang; akses baris = peran khusus + log akses + larangan ekspor massal tanpa persetujuan.",
        "Skenario 5 — sudah ada 3+ versi angka yang sama beredar: BERHENTI. Daftarkan definisi resmi di kamus metrik dulu, arsipkan dasbor bayangan, baru bangun ulang. Membangun dasbor keempat tanpa membereskan tiga yang lama = menambah kekacauan.",
        "Aturan praktis 10 detik: tanya “berapa kali laporan ini akan terbit dengan format yang sama?” Sekali = spreadsheet. Berkali-kali = BI tool. Belum tahu = notebook. Lalu tanya “definisinya sudah tertulis?” Belum = tulis dulu, bangun belakangan.",
      ],
      tasks: [],
      reference: "Sekali = spreadsheet. Berkali-kali = BI tool. Belum tahu = notebook. Definisi dulu, bangun belakangan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Audit 40 dasbor bayangan",
      prose: [
        "Bank Nusa melakukan audit tooling: ditemukan 43 dasbor aktif. 11 di antaranya tanpa pemilik terdaftar, 6 memakai definisi NPL versi lama (sebelum hapusbuku dikeluarkan). Temuan terparah: NPL cabang Surabaya di dasbor bayangan tercatat 5,2% — sedangkan laporan resmi 3,1%. Selisih 2,1 pp. Masalahnya: bulan lalu komite memotong limit cabang Surabaya Rp40 miliar dengan merujuk angka 5,2% dari dasbor bayangan tersebut.",
        "Analisis: (1) Keputusan Rp40 miliar dibuat dari angka tanpa pemilik dan tanpa versi — tidak bisa dipertanggungjawabkan ke auditor. Apakah keputusan itu salah? Tidak bisa dijawab — karena definisi yang dipakai tidak tercatat. (2) Akar masalah: tidak ada registri, tidak ada rekonsiliasi kuartalan, dan dasbor bayangan diperlakukan setara dengan dasbor resmi. (3) Perbaikan: bekukan dasbor bayangan dari sirkulasi keputusan, daftarkan ulang yang masih dibutuhkan (dengan pemilik + definisi dari kamus), arsipkan sisanya, dan mulai rekonsiliasi kuartalan. Estimasi: 2 minggu untuk registri, 1 kuartal untuk rekonsiliasi pertama.",
        "Pelajaran yang bisa dibawa pulang: audit tooling bukan proyek IT — ini proyek definisi. Yang diaudit bukan servernya, melainkan daftar definisi dan daftar pemiliknya.",
      ],
      tasks: [
        { id: "t1", text: "Jika kamu auditor Bank Nusa: apa 3 pertanyaan pertamamu ke pemilik dasbor bayangan Surabaya?" },
      ],
      expected: "Contoh: (1) definisi NPL apa yang dipakai dasbor ini? (2) siapa pemiliknya dan kapan terakhir divalidasi? (3) keputusan apa saja yang pernah merujuk angka ini?",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan limit Rp40 miliar dari angka tak berversi = keputusan yang tidak bisa dibela di depan auditor maupun regulator. Biaya dasbor bayangan bukan biaya lisensi — melainkan biaya keputusan yang tidak bisa dipertanggungjawabkan.",
      },
      reference: "Audit tooling = audit definisi + audit pemilik, bukan audit server.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan. Lalu satu pekerjaan rumah: daftarkan 3 dasbor yang paling sering dipakai di kantormu — siapa pemiliknya, versi berapa, definisi NPL-nya dari mana?",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Setiap kali melihat angka di dasbor, latih refleks tiga pertanyaan: definisi apa? data per tanggal berapa? siapa pemiliknya? Tiga pertanyaan ini membedakan pembaca dasbor dengan pemakai dasbor.",
      },
      summary: [
        "Sekali pakai = spreadsheet. Berulang = BI tool. Eksplorasi = notebook.",
        "Semantic layer: satu definisi metrik di satu tempat, dipakai semua dasbor.",
        "Tiga definisi masuk akal bisa menghasilkan tiga angka NPL berbeda — label definisi adalah bagian dari angka.",
        "Dasbor baik: hierarki ringkasan → drill-down, warna = ambang tertulis, tanggal data selalu terlihat.",
        "Dasbor tanpa pemilik = dasbor bayangan = tidak boleh dipakai untuk keputusan.",
        "Akses baris nasabah = peran khusus + log; ekspor massal butuh persetujuan.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Tiga dasbor menampilkan tiga angka NPL berbeda untuk bulan yang sama, dari data yang sama. Akar masalah yang paling mungkin?",
          options: [
            { text: "Datanya rusak", why: "Data sama di ketiganya — kerusakan data akan merusak ketiganya dengan cara yang sama." },
            { text: "Definisi NPL yang dipakai ketiganya berbeda dan tidak tertulis", why: "Tepat. Lab Langkah 5 membuktikan: tiga definisi masuk akal → 35,71% vs 46,43% vs 38,36%.", correct: true },
            { text: "BI tool-nya perlu di-upgrade", why: "Perkakas tidak menciptakan definisi — upgrade tool tidak menyatukan tiga definisi berbeda." },
          ],
        },
        {
          q: "Apa itu semantic layer (metrics layer)?",
          options: [
            { text: "Lapisan keamanan login dasbor", why: "Itu autentikasi — penting, tetapi bukan semantic layer." },
            { text: "Definisi metrik yang ditulis sekali di satu tempat lalu dipakai semua dasbor", why: "Benar. Satu definisi → banyak dasbor → satu angka.", correct: true },
            { text: "Template warna dan font untuk dasbor", why: "Itu design system — mengatur tampilan, bukan kebenaran angka." },
          ],
        },
        {
          q: "Laporan bulanan NPL ke komite yang selama ini dibuat manual di spreadsheet. Langkah tooling yang tepat?",
          options: [
            { text: "Tetap di spreadsheet, tapi dibuatkan template yang bagus", why: "Template tidak menyelesaikan audit trail lemah dan rumus tersembunyi untuk laporan berulang." },
            { text: "Pindah ke BI tool + definisi NPL didaftarkan di kamus metrik", why: "Tepat. Laporan berulang + banyak audiens = BI tool + semantic layer.", correct: true },
            { text: "Tulis ulang sebagai notebook Python", why: "Notebook untuk eksplorasi analis — bukan alat distribusi laporan bulanan ke komite." },
          ],
        },
        {
          q: "Dasbor menampilkan NPL cabang berwarna merah. Kapan warna merah itu informatif?",
          options: [
            { text: "Ketika merah berarti melewati ambang yang ditetapkan dan disepakati", why: "Benar. Warna = status vs ambang tertulis, bukan dekorasi.", correct: true },
            { text: "Ketika desainer merasa angkanya mengkhawatirkan", why: "Opini desainer bukan ambang risiko — tidak bisa dipertanggungjawabkan." },
            { text: "Ketika angkanya lebih tinggi dari bulan lalu", why: "Naik belum tentu melewati ambang; merah harus punya definisi yang sama untuk semua pembaca." },
          ],
        },
        {
          q: "Kenapa dasbor bayangan berbahaya untuk pengambilan keputusan?",
          options: [
            { text: "Tampilannya biasanya jelek", why: "Tampilan bukan masalahnya — banyak dasbor bayangan terlihat meyakinkan." },
            { text: "Tidak punya pemilik, versi, dan definisi tercatat sehingga angkanya tidak bisa direkonsiliasi", why: "Tepat. Tanpa ketiganya, angka tidak bisa dipertanggungjawabkan ke auditor.", correct: true },
            { text: "Memakai server yang lambat", why: "Performa bukan inti masalah — definisi dan akuntabilitas yang hilang adalah masalahnya." },
          ],
        },
        {
          q: "Analis junior meminta akses data baris per nasabah lewat dasbor. Respons yang tepat?",
          options: [
            { text: "Berikan saja, toh dia karyawan bank", why: "Prinsip hak akses minimal: berikan sesuai kebutuhan peran, bukan status karyawan." },
            { text: "Mulai dari agregat; akses baris hanya untuk peran yang membutuhkan, tercatat, dan ekspor dibatasi", why: "Benar. Agregat untuk kebanyakan pengguna; baris nasabah = peran khusus + log akses.", correct: true },
            { text: "Tolak semua akses data mentah untuk semua orang", why: "Terlalu ekstrem — penagihan dan analis kredit memang membutuhkan data baris untuk bekerja." },
          ],
        },
      ],
    },
  ],
};
