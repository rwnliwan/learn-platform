import type { V2Lesson } from "../lib/types";

const FIG_BUCKET = `<svg viewBox="0 0 520 300" role="img" aria-label="Distribusi outstanding per bucket DPD.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Portofolio Rp1.985 juta: outstanding per bucket DPD</text>
<text x="10" y="70" font-size="11" fill="var(--chart-text)">Current (0 hari)</text>
<rect x="170" y="56" width="400" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="576" y="73" font-size="11" fill="var(--chart-text)">925</text>
<text x="10" y="108" font-size="11" fill="var(--chart-text)">1–30 hari</text>
<rect x="170" y="94" width="121" height="22" fill="var(--c2)" opacity="0.9"/>
<text x="297" y="111" font-size="11" fill="var(--chart-text)">280</text>
<text x="10" y="146" font-size="11" fill="var(--chart-text)">31–60 hari</text>
<rect x="170" y="132" width="177" height="22" fill="var(--c3)" opacity="0.9"/>
<text x="353" y="149" font-size="11" fill="var(--chart-text)">410</text>
<text x="10" y="184" font-size="11" fill="var(--chart-text)">61–90 hari</text>
<rect x="170" y="170" width="78" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="254" y="187" font-size="11" fill="var(--chart-text)">180</text>
<text x="10" y="222" font-size="11" fill="var(--chart-text)">90+ hari (macet)</text>
<rect x="170" y="208" width="82" height="22" fill="var(--c5, #e5484d)" opacity="0.9"/>
<text x="258" y="225" font-size="11" fill="var(--chart-text)">190</text>
<text x="10" y="262" font-size="10" fill="var(--chart-text)" opacity="0.75">Angka = Rp juta outstanding. Bucket 31–60 hari (410) lebih besar dari 90+ (190): antrean macet masa depan.</text>
</g>
</svg>`;

export const cr35: V2Lesson = {
  slug: "cr35-sql-credit-analytics",
  track: "Credit Risk",
  module: "Tooling Analis",
  title: "CR35 — SQL untuk Credit Analytics: Membaca Portofolio Lewat Query",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan NPL naik — tapi ke mana sebenarnya?",
      prose: [
        "Senin pagi, analis kredit Dini menerima email dari direksi: NPL bank naik dari 3,1% ke 3,4% dalam sebulan. Direksi bertanya satu hal: 'Ini masalah underwriting atau masalah penagihan?' Dini membuka dashboard — hanya ada satu angka agregat. Tidak ada jawaban.",
        "Twist-nya: Dini tidak menunggu tim IT. Ia membuka akses read-only ke data warehouse, menulis lima query SQL, dan menemukan cerita yang sama sekali berbeda dari angka tunggal itu: bucket 1–30 hari membengkak dua kali lipat dalam dua bulan (masalah koleksi dini), sementara vintage 2025 justru membaik dari bulan ke bulan (underwriting membaik). Direksi mendapat jawaban dalam 40 menit — bukan 2 minggu.",
        "Lesson ini untuk analis yang tidak mau hanya membaca laporan jadi. SQL adalah syarat eksplisit di lowongan credit risk — dari bank lokal sampai lender remote global — karena analis yang bisa query sendiri tidak bergantung antrean ke tim data saat keputusan mendesak.",
        "Setelah lesson ini kamu bisa: (1) mengelompokkan pinjaman ke bucket DPD dengan CASE WHEN; (2) menghitung NPL ratio per bucket, per vintage, dan per sektor; (3) membaca roll rate sebagai sinyal peringatan dini; (4) memutuskan apakah masalah portofolio berasal dari underwriting, koleksi, atau konsentrasi sektor. Prasyarat ringkas: DPD (days past due) = jumlah hari keterlambatan pembayaran; NPL = kredit dengan DPD > 90 hari (macet). Vintage = kelompok pinjaman berdasarkan bulan pencairan. Kamu diasumsikan bisa SELECT, WHERE, GROUP BY dasar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Query portofolio adalah radar analis: NPL agregat memberitahu 'ada api', bucket DPD dan vintage memberitahu 'di ruangan mana'. Analis yang hanya membaca angka jadi akan selalu terlambat satu sprint dibanding analis yang bisa query.",
      },
      reference: "DPD > 90 hari = macet. Vintage = bulan pencairan. SQL = radar analis.",
    },
    {
      id: "bucket-dpd",
      eyebrow: "Langkah 2 · Konsep",
      title: "Bucket DPD: bahasa pertama portofolio",
      prose: [
        "Bank tidak berbicara 'kredit bagus vs kredit jelek' — ia berbicara bucket: current (0 hari), 1–30, 31–60, 61–90, dan 90+ hari. Setiap bucket adalah ruangan berbeda di rumah yang sama: penghuni bucket 1–30 masih bisa diselamatkan dengan telepon, penghuni 90+ hampir pasti butuh restrukturisasi atau hapus buku.",
        "Di SQL, bucket dibuat dengan CASE WHEN — satu-satunya cara mengelompokkan angka kontinu menjadi kategori bisnis. Polanya selalu sama: CASE WHEN dpd = 0 THEN 'current' WHEN dpd <= 30 THEN '1-30' ... ELSE '90+' END, lalu GROUP BY atas label itu. Hafalkan pola ini; ia muncul di 80% query analitik kredit.",
        "Dari bucket lahir metrik utama portofolio: NPL ratio = outstanding macet (90+) dibagi total outstanding. Ia angka yang dilaporkan ke regulator dan direksi — dan angka yang paling sering disalahpahami, karena ia agregat.",
        "Cara membaca figur: sumbu horizontal = outstanding dalam Rp juta; tiap batang = total outstanding satu bucket DPD; angka di ujung batang = nilainya. Interpretasi: bucket 90+ hanya 190 juta — kecil. Tetapi bucket 31–60 mencapai 410 juta, lebih dari dua kali lipat bucket macet. Itu 'antrean': jika roll rate normal, sebagian besar 410 juta ini akan menjadi macet dua bulan lagi. Analis yang baik khawatir pada 410, bukan pada 190.",
      ],
      formula: String.raw`\text{NPL ratio} = \frac{\text{Outstanding DPD > 90 hari}}{\text{Total outstanding}} \times 100\%`,
      formulaNote: "Pembilang = outstanding bucket 90+ (macet); penyebut = seluruh outstanding. Contoh: 190 / 1.985 × 100% = 9,6%. Interpretasi: dari setiap Rp100 yang dipinjamkan, Rp9,6 macet. Angka ini wajib dibaca bersama komposisinya — NPL 9,6% dengan bucket 1–30 membengkak jauh lebih berbahaya dari NPL 9,6% yang stabil.",
      figure: {
        svg: FIG_BUCKET,
        alt: "Distribusi outstanding per bucket DPD: current 925, 1-30 hari 280, 31-60 hari 410, 61-90 hari 180, 90+ hari 190 (Rp juta).",
        caption: "Bucket 31–60 hari (410) adalah antrean macet — lebih besar dari bucket macet itu sendiri (190).",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: NPL naik = underwriting buruk",
        type: "pitfall",
        body: "Mitos: setiap kenaikan NPL berarti standar pemberian kredit melonggar. Yang benar: NPL agregat tidak tahu sebab. Ia bisa naik karena koleksi melemah (bucket 1–30 membengkak dulu), karena satu sektor terpukul (konsentrasi), atau karena definisi berubah. Jangan vonis underwriting sebelum memecah NPL per vintage — vintage baru yang bersih membuktikan underwriting justru membaik.",
      },
      hints: [
        "Urutan WHEN penting: cek dari yang paling sempit (dpd = 0) ke paling lebar (ELSE '90+').",
        "Selalu agregatkan outstanding (SUM), bukan hanya hitung akun (COUNT) — satu akun Rp500 juta ≠ satu akun Rp5 juta.",
      ],
      reference: "Bucket = ruangan. CASE WHEN = kunci pembuat ruangan. Baca antrean, bukan hanya macet.",
    },
    {
      id: "roll-rate",
      eyebrow: "Langkah 3 · Konsep",
      title: "Roll rate: seberapa cepat yang telat menjadi macet",
      prose: [
        "Roll rate menjawab pertanyaan paling menakutkan analis: dari Rp100 di bucket 1–30 hari bulan ini, berapa yang 'bergulir' ke 31–60 bulan depan? Jika jawabannya Rp40, maka bucket 1–30 hari sebesar 280 juta hari ini adalah janji macet 112 juta dua bulan ke depan.",
        "Cara menghitungnya sederhana secara konsep: ambil akun-akun di bucket X pada akhir bulan t, lihat di bucket apa mereka pada akhir bulan t+1, hitung porsinya. Di SQL ini berarti self-join tabel snapshot bulanan pada kunci akun dengan pergeseran satu bulan — teknik yang terlihat menakutkan tapi polanya selalu sama.",
        "Kepribadiannya: roll rate adalah 'termometer demam', bukan 'hasil lab'. Ia tidak menjelaskan kenapa debitur telat — ia hanya memberitahu seberapa cepat demam naik. Termometer yang naik dua bulan berturut-turut berarti waktunya cari penyebab, bukan waktunya menunggu hasil lab bulan depan.",
        "Kapan memakai: pantau roll rate 1–30 → 31–60 setiap bulan sebagai early warning; roll rate 61–90 → 90+ untuk kalibrasi provisi. Kapan tidak memakai: untuk satu akun individual — roll rate adalah statistik kelompok, vonis individu tetap butuh data debitur.",
      ],
      formula: String.raw`\text{Roll rate}_{A \to B} = \frac{\text{OS akun bucket A di } t \text{ yang pindah ke B di } t+1}{\text{OS bucket A di } t} \times 100\%`,
      formulaNote: "A = bucket asal (mis. 1–30), B = bucket tujuan (mis. 31–60), t = akhir bulan. Contoh: OS bucket 1–30 akhir Januari 280 juta; dari akun-akun itu, 112 juta berada di 31–60 akhir Februari → roll rate 40%. Interpretasi: 40% keterlambatan ringan memburuk dalam sebulan — koleksi dini bermasalah bila angka ini naik tren.",
      tasks: [],
      note: {
        title: "💡 Intuisi: roll rate yang 'baik' pun bisa menipu",
        body: "Roll rate bisa turun bukan karena koleksi membaik, melainkan karena bank menulis hapus (write-off) akun-akun terburuk dari bucket 90+ — penyebut dan pembilang sama-sama berubah. Selalu cek write-off dan restrukturisasi sebelum merayakan penurunan roll rate.",
      },
      reference: "Roll rate = termometer demam portofolio. Naik 2 bulan = cari penyebab, jangan tunggu.",
    },
    {
      id: "vintage-konsentrasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Vintage dan konsentrasi: siapa biang masalahnya",
      prose: [
        "Vintage analysis mengelompokkan pinjaman menurut bulan pencairannya, lalu menelusuri NPL tiap kelompok seiring waktu. Logikanya: jika vintage 2025-03 punya NPL 8,9% sementara vintage 2025-01 punya 10,3%, maka standar underwriting membaik — masalah NPL hari ini adalah warisan masa lalu, bukan kebijakan hari ini.",
        "Ini adalah alat pembelaan diri analis yang paling kuat di depan direksi: ia memisahkan 'dosa lama' dari 'kinerja baru'. Tanpa vintage, setiap kenaikan NPL otomatis dituduhkan ke tim kredit yang sedang bekerja hari ini.",
        "Konsentrasi sektor menjawab pertanyaan kedua: NPL 36,5% di sektor Jasa vs 0% di Manufaktur berarti masalahnya bukan sistemik — ia sektoral. Responsnya pun beda: bukan mengencangkan underwriting untuk semua, melainkan membatasi eksposur ke sektor yang bermasalah dan memeriksa apa yang terjadi di sana.",
        "Miskonsepsi umum kedua: 'portofolio terdiversifikasi = aman'. Diversifikasi di atas kertas (banyak sektor) tidak melindungi dari konsentrasi tersembunyi — misal 60% debitur 'Jasa' ternyata bergantung pada satu pemberi kerja atau satu proyek pemerintah. Selalu tanya: terdiversifikasi menurut apa?",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: vintage baru selalu lebih baik",
        type: "pitfall",
        body: "Mitos: NPL vintage muda yang rendah berarti underwriting hebat. Yang benar: pinjaman butuh waktu untuk macet — vintage berumur 2 bulan hampir selalu terlihat bersih karena cicilan pertamanya belum banyak yang jatuh tempo. Bandingkan vintage pada umur yang sama (mis. semua di umur 6 bulan), atau tunggu sampai 'matang' sebelum memuji.",
      },
      hints: [
        "GROUP BY bulan_cair + metrik NPL di dalamnya = satu query vintage.",
        "Urutkan sektor by NPL DESC — biang masalah selalu di baris pertama.",
      ],
      reference: "Vintage memisahkan dosa lama dari kinerja baru. Konsentrasi menunjukkan di mana api berada.",
    },
    {
      id: "lab-portofolio",
      eyebrow: "Langkah 5 · Lab",
      title: "Query portofolio: 20 pinjaman, 3 pertanyaan direksi",
      prose: [
        "Tabel pinjaman sudah tersedia di memori (20 akun, 3 vintage, 3 sektor). Tiga tugasmu persis tiga pertanyaan direksi: berapa besar yang sudah macet, apakah underwriting membaik, dan sektor mana biang masalahnya. Tulis query-nya, jalankan, pastikan angka tercetak.",
        "Eksplorasi: setelah selesai, coba ubah definisi macet menjadi dpd > 60 — seberapa besar NPL 'naik' hanya karena definisi? Itu pelajaran tentang betapa sensitifnya angka laporan terhadap definisi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_90plus` (jumlah akun) dan `os_90plus` (total outstanding) untuk dpd > 90, lalu cetak" },
        { id: "t2", text: "Hitung NPL (%) per `bulan_cair` ke `npl_202501`, `npl_202502`, `npl_202503`, lalu cetak ketiganya" },
        { id: "t3", text: "Cari `sektor_terburuk` dan `npl_terburuk` (NPL % tertinggi), lalu cetak" },
      ],
      expected: "Akun 90+ DPD: 3, OS macet: 190.0 juta | Vintage NPL: 2025-01=10.3% 2025-02=9.8% 2025-03=8.9% | Sektor terburuk: Jasa (NPL 36.5%)",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pinjaman(id INTEGER PRIMARY KEY, bulan_cair TEXT, sektor TEXT, os REAL, dpd INTEGER)\")\ndata = [(1,\"2025-01\",\"Ritel\",50,0),(2,\"2025-01\",\"Ritel\",80,12),(3,\"2025-01\",\"Manufaktur\",200,45),(4,\"2025-01\",\"Manufaktur\",150,0),(5,\"2025-01\",\"Jasa\",60,95),(6,\"2025-01\",\"Jasa\",40,0),(7,\"2025-02\",\"Ritel\",70,0),(8,\"2025-02\",\"Ritel\",90,25),(9,\"2025-02\",\"Manufaktur\",180,75),(10,\"2025-02\",\"Manufaktur\",120,0),(11,\"2025-02\",\"Jasa\",55,130),(12,\"2025-02\",\"Jasa\",45,5),(13,\"2025-03\",\"Ritel\",60,0),(14,\"2025-03\",\"Ritel\",85,0),(15,\"2025-03\",\"Manufaktur\",210,40),(16,\"2025-03\",\"Manufaktur\",140,0),(17,\"2025-03\",\"Jasa\",50,0),(18,\"2025-03\",\"Jasa\",65,20),(19,\"2025-03\",\"Ritel\",75,110),(20,\"2025-03\",\"Manufaktur\",160,0)]\ncur.executemany(\"INSERT INTO pinjaman VALUES (?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 jumlah & OS bucket 90+\nn_90plus =\nos_90plus =\n\n# t2: NPL (%) per bulan_cair\nnpl_202501 =\nnpl_202502 =\nnpl_202503 =\n\n# t3: sektor dengan NPL tertinggi\nsektor_terburuk =\nnpl_terburuk =\n\nprint(f\"Akun 90+ DPD: {n_90plus}, OS macet: {os_90plus:.1f} juta\")\nprint(f\"Vintage NPL: 2025-01={npl_202501}% 2025-02={npl_202502}% 2025-03={npl_202503}%\")\nprint(f\"Sektor terburuk: {sektor_terburuk} (NPL {npl_terburuk}%)\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pinjaman(id INTEGER PRIMARY KEY, bulan_cair TEXT, sektor TEXT, os REAL, dpd INTEGER)\")\ndata = [(1,\"2025-01\",\"Ritel\",50,0),(2,\"2025-01\",\"Ritel\",80,12),(3,\"2025-01\",\"Manufaktur\",200,45),(4,\"2025-01\",\"Manufaktur\",150,0),(5,\"2025-01\",\"Jasa\",60,95),(6,\"2025-01\",\"Jasa\",40,0),(7,\"2025-02\",\"Ritel\",70,0),(8,\"2025-02\",\"Ritel\",90,25),(9,\"2025-02\",\"Manufaktur\",180,75),(10,\"2025-02\",\"Manufaktur\",120,0),(11,\"2025-02\",\"Jasa\",55,130),(12,\"2025-02\",\"Jasa\",45,5),(13,\"2025-03\",\"Ritel\",60,0),(14,\"2025-03\",\"Ritel\",85,0),(15,\"2025-03\",\"Manufaktur\",210,40),(16,\"2025-03\",\"Manufaktur\",140,0),(17,\"2025-03\",\"Jasa\",50,0),(18,\"2025-03\",\"Jasa\",65,20),(19,\"2025-03\",\"Ritel\",75,110),(20,\"2025-03\",\"Manufaktur\",160,0)]\ncur.executemany(\"INSERT INTO pinjaman VALUES (?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 jumlah & OS bucket 90+\nn_90plus, os_90plus = cur.execute(\"SELECT COUNT(*), SUM(os) FROM pinjaman WHERE dpd > 90\").fetchone()\n\n# t2: NPL (%) per bulan_cair\n_v = dict(cur.execute(\"SELECT bulan_cair, ROUND(100.0*SUM(CASE WHEN dpd>90 THEN os ELSE 0 END)/SUM(os),1) FROM pinjaman GROUP BY bulan_cair\").fetchall())\nnpl_202501 = _v[\"2025-01\"]\nnpl_202502 = _v[\"2025-02\"]\nnpl_202503 = _v[\"2025-03\"]\n\n# t3: sektor dengan NPL tertinggi\nsektor_terburuk, npl_terburuk = cur.execute(\"SELECT sektor, ROUND(100.0*SUM(CASE WHEN dpd>90 THEN os ELSE 0 END)/SUM(os),1) FROM pinjaman GROUP BY sektor ORDER BY 2 DESC LIMIT 1\").fetchone()\n\nprint(f\"Akun 90+ DPD: {n_90plus}, OS macet: {os_90plus:.1f} juta\")\nprint(f\"Vintage NPL: 2025-01={npl_202501}% 2025-02={npl_202502}% 2025-03={npl_202503}%\")\nprint(f\"Sektor terburuk: {sektor_terburuk} (NPL {npl_terburuk}%)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "n_90plus = 3", msg: "Akun dengan dpd > 90: id 5, 11, 19.", name: "n_90plus", value: 3, tol: 0 },
          { kind: "equal", task: "t1", label: "os_90plus = 190", msg: "60 + 55 + 75 = 190 juta.", name: "os_90plus", value: 190.0, tol: 0.01 },
          { kind: "equal", task: "t2", label: "NPL vintage 2025-03 = 8,9%", msg: "Vintage termuda paling bersih: underwriting membaik.", name: "npl_202503", value: 8.9, tol: 0.05 },
          { kind: "equal", task: "t3", label: "sektor_terburuk = Jasa", msg: "NPL Jasa 36,5% vs Ritel 14,7% vs Manufaktur 0%.", name: "sektor_terburuk", value: "Jasa", tol: 0 },
          { kind: "equal", task: "t3", label: "npl_terburuk = 36,5%", msg: "(60+55)/315 = 36,5%.", name: "npl_terburuk", value: 36.5, tol: 0.05 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak lengkap", msg: "Tiga baris: akun macet, vintage, sektor.", pattern: "Sektor terburuk: Jasa" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Dari angka ke aksi: empat skenario",
      prose: [
        "Skenario 1 — NPL naik di SEMUA vintage termasuk yang muda: biang masalahnya underwriting hari ini. Aksi: ketatkan kriteria persetujuan, audit sampel aplikasi 3 bulan terakhir. Jangan salahkan koleksi.",
        "Skenario 2 — NPL naik hanya di vintage lama, vintage baru bersih: underwriting sudah benar, masalahnya koleksi atas warisan lama. Aksi: perkuat tim collection & restrukturisasi, bukan mengubah kebijakan kredit baru.",
        "Skenario 3 — Satu sektor NPL-nya jauh di atas rata-rata (seperti Jasa 36,5% vs portofolio 9,6%): masalah konsentrasi. Aksi: batasi eksposur baru ke sektor itu, stress test skenario sektor, kunjungi debitur terbesarnya.",
        "Skenario 4 — Roll rate 1–30 → 31–60 naik dua bulan berturut-turut sementara NPL masih stabil: peringatan dini. Aksi: intervensi koleksi dini sekarang — telepon, kunjungan, restrukturisasi ringan — sebelum menjadi NPL betulan.",
        "Aturan praktis 10 detik: NPL naik → pecah per vintage → pecah per sektor → cek roll rate. Tiga pecahan itu menjawab 'underwriting, koleksi, atau konsentrasi' dalam waktu kurang dari satu jam query.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: urutan pecahan itu penting",
        body: "Selalu pecah vintage DULU sebelum sektor. Jika vintage baru bersih, masalah sektoral pun kemungkinan besar warisan lama — responsnya koleksi, bukan perubahan kebijakan. Urutan yang salah membuat bank mengencangkan kredit sehat sambil membiarkan koleksi bocor.",
      },
      reference: "Vintage → sektor → roll rate. Tiga pecahan, satu jam, jawaban lengkap.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Bank Cahaya: NPL 4,2% dan direksi yang panik",
      prose: [
        "Bank Cahaya (aset Rp8 triliun) melaporkan NPL 4,2%, naik dari 3,5% kuartal lalu. Direksi mengusulkan moratorium kredit baru selama 3 bulan. Kamu diberi akses data: vintage 6 bulan terakhir menunjukkan NPL 2,1% → 1,9% → 1,8% (membaik); sektor perdagangan NPL-nya 11% sementara sektor lain di bawah 3%; roll rate 1–30 → 31–60 naik dari 22% ke 31% dalam dua bulan. Pertanyaan: (1) Apakah moratorium tepat? (2) Apa tiga aksi prioritasmu?",
        "Pembahasan: (1) Moratorium TIDAK tepat — vintage membaik membuktikan underwriting hari ini sehat; moratorium menghukum bisnis yang sehat karena dosa masa lalu. (2) Aksi: pertama, batasi dan awasi eksposur perdagangan (konsentrasi 11%); kedua, perkuat koleksi dini karena roll rate naik — ini jendela intervensi sebelum menjadi NPL; ketiga, fokus restrukturisasi pada vintage lama, bukan mengubah kebijakan kredit baru. Analis yang hanya membaca NPL 4,2% akan menyetujui moratorium; analis yang memecah data menyelamatkan pertumbuhan bank.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan moratorium vs intervensi terarah bedanya bisa ratusan miliar penyaluran kredit. Nilai analis bukan pada rumusnya — CASE WHEN bisa dipelajari seminggu — melainkan pada keberanian membaca pecahan data dan menyampaikan kesimpulan yang tidak populer ke direksi.",
      },
      reference: "Vintage membaik + satu sektor bermasalah + roll rate naik = koleksi & konsentrasi, bukan moratorium.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — query yang benar lahir dari pertanyaan bisnis yang benar.",
      ],
      tasks: [],
      summary: [
        "Bucket DPD (CASE WHEN): current, 1–30, 31–60, 61–90, 90+; agregatkan outstanding, bukan hanya hitung akun.",
        "NPL ratio = OS 90+ / total OS; agregat tidak tahu sebab — pecah dulu sebelum vonis.",
        "Roll rate = porsi OS yang bergulir ke bucket lebih buruk bulan depan; termometer demam portofolio.",
        "Vintage memisahkan dosa lama dari kinerja baru; bandingkan pada umur yang sama.",
        "Konsentrasi sektor: biang masalah biasanya di satu baris teratas — batasi eksposur, bukan seluruh bank.",
      ],
      next: { label: "CR36 — Python untuk Credit Risk Analytics", href: "/learn/cr36-python-credit-analytics" },
      quiz: [
        {
          q: "NPL bank naik dari 3,1% ke 3,4%. Langkah pertama yang benar adalah…",
          options: [
            { text: "Mengusulkan pengetatan underwriting untuk semua segmen", why: "Salah: NPL agregat tidak tahu sebab — bisa jadi masalah koleksi atau konsentrasi, bukan underwriting.", },
            { text: "Memecah NPL per vintage, per sektor, dan cek roll rate", why: "Benar: tiga pecahan menjawab apakah masalahnya underwriting, koleksi, atau konsentrasi.", correct: true },
            { text: "Menunggu laporan bulan depan untuk memastikan tren", why: "Salah: menunggu = membiarkan roll rate bekerja; intervensi dini justru paling murah.", },
            { text: "Menambah provisi sesuai kenaikan NPL", why: "Salah: provisi adalah akuntansi, bukan diagnosis — masalahnya tetap tidak terpetakan.", },
          ],
        },
        {
          q: "Query mana yang benar menghitung NPL ratio per sektor?",
          options: [
            { text: "SELECT sektor, COUNT(*) FROM pinjaman WHERE dpd > 90 GROUP BY sektor", why: "Salah: menghitung akun macet saja tanpa pembagi total — bukan ratio.", },
            { text: "SELECT sektor, SUM(CASE WHEN dpd>90 THEN os ELSE 0 END)/SUM(os) FROM pinjaman GROUP BY sektor", why: "Benar: pembilang OS macet dibagi total OS per sektor — persis definisi NPL ratio.", correct: true },
            { text: "SELECT sektor, AVG(dpd) FROM pinjaman GROUP BY sektor", why: "Salah: rata-rata DPD bukan NPL ratio dan tidak memakai threshold 90 hari.", },
            { text: "SELECT sektor, SUM(os) FROM pinjaman GROUP BY sektor HAVING dpd > 90", why: "Salah: HAVING tidak bisa dipakai untuk kolom non-agregat seperti ini; logikanya pun keliru.", },
          ],
        },
        {
          q: "Roll rate 1–30 → 31–60 naik dari 22% ke 31% dalam dua bulan. Artinya…",
          options: [
            { text: "Koleksi dini melemah — peringatan dini sebelum NPL naik", why: "Benar: semakin banyak keterlambatan ringan yang memburuk; intervensi sekarang paling murah.", correct: true },
            { text: "Underwriting memburuk pada bulan berjalan", why: "Salah: roll rate mengukur nasib pinjaman lama, bukan kualitas persetujuan baru.", },
            { text: "NPL bulan depan pasti naik 9%", why: "Salah: roll rate bukan ramalan deterministik — ia probabilitas kelompok, bukan kepastian.", },
            { text: "Tidak ada arti — fluktuasi normal bulanan", why: "Salah: kenaikan dua bulan berturut-turut adalah tren, bukan noise; abaikan = mahal.", },
          ],
        },
        {
          q: "Vintage 2025-01 NPL 10,3%, vintage 2025-03 NPL 8,9%. Kesimpulan yang sah…",
          options: [
            { text: "Underwriting membaik — tetapi pastikan membandingkan pada umur yang sebanding", why: "Benar: tren membaik, dengan catatan vintage muda butuh waktu untuk 'matang'.", correct: true },
            { text: "Underwriting membaik secara pasti tanpa catatan", why: "Salah: vintage 2 bulan hampir selalu terlihat bersih — butuh pembanding umur sama.", },
            { text: "Underwriting memburuk karena NPL masih di atas 8%", why: "Salah: level absolut tidak menjawab arah perubahan; tren vintage yang menjawab.", },
            { text: "Tidak bisa disimpulkan apa-apa dari vintage", why: "Salah: vintage adalah alat standar memisahkan dosa lama dari kinerja baru.", },
          ],
        },
        {
          q: "Sektor Jasa NPL 36,5% vs portofolio 9,6%. Respons yang tepat…",
          options: [
            { text: "Moratorium kredit untuk seluruh bank", why: "Salah: menghukum sektor sehat karena satu sektor bermasalah — mahal dan tidak tepat sasaran.", },
            { text: "Batasi eksposur baru ke Jasa + selidiki penyebab sektoralnya", why: "Benar: masalah konsentrasi ditangani di sumbernya, bukan dengan menutup seluruh keran.", correct: true },
            { text: "Naikkan suku bunga untuk semua debitur Jasa yang ada", why: "Salah: menaikkan beban debitur yang sudah kesulitan justru mempercepat default.", },
            { text: "Hapus buku seluruh kredit sektor Jasa", why: "Salah: write-off massal menghancurkan nilai yang masih bisa diselamatkan via restrukturisasi.", },
          ],
        },
      ],
    },
  ],
};
