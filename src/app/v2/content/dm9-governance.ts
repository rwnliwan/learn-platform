import type { V2Lesson } from "../lib/types";

export const dm9: V2Lesson = {
  slug: "dm9-governance",
  track: "Data Management",
  module: "Tata Kelola",
  title: "Data Governance: Siapa Berhak Memutuskan soal Data?",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-denda",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Denda Rp32 miliar karena \"tidak ada yang tahu\"",
      prose: [
        "Sebuah bank multinasional didenda regulator setara Rp32 miliar. Bukan karena fraud — karena saat regulator meminta \"tunjukkan eksposur kalian ke sektor properti dalam 48 jam\", bank butuh 6 minggu. Datanya ada, tersebar di 14 sistem, definisi \"eksposur properti\" beda-beda, tidak ada yang bisa memastikan angkanya benar. Regulator menyimpulkan: bank ini tidak mengendalikan datanya sendiri.",
        "Bank itu punya data engineer terbaik dan warehouse termahal. Yang tidak punya: seseorang yang berwenang memutuskan definisi, pemilik tiap data, dan kebijakan yang ditegakkan. Teknologi tanpa governance = mobil balap tanpa pengemudi.",
      ],
      tasks: [],
      reference: "Governance adalah pertanyaan siapa berhak memutuskan — membosankan sampai dendanya datang.",
    },
    {
      id: "gov-vs-mgmt",
      eyebrow: "Langkah 2 · Definisi",
      title: "Wasit vs pemain",
      prose: [
        "Definisi DAMA: data governance = wewenang dan kontrol atas pengelolaan data (siapa memutuskan, aturan apa). Data management = eksekusinya (membangun pipeline, membersihkan data).",
        "Governance = wasit + pembuat peraturan; management = pemain di lapangan. Wasit tidak menendang bola — tapi tanpa wasit, pertandingan jadi tawuran. Contoh konkret: governance memutuskan \"definisi 'nasabah aktif' = X, owner-nya Bu Rina, retensi 5 tahun\"; management mengeksekusi — engineer membangun pipeline sesuai definisi itu, steward mendokumentasikan.",
        "Kenapa dibedakan: agar keputusan (otoritas) tidak dicampur dengan pelaksana (yang bisa bias ke kepentingan teknis). Owner bisnis memutuskan apa yang benar; engineer memutuskan bagaimana membangunnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: governance diuji saat berkata \"tidak\"",
        body: "Semua orang setuju pada governance saat menulis dokumen; ujian sesungguhnya adalah penolakan pertama — council yang menolak definisi usulan divisi terbesar, owner yang menolak akses untuk atasan yang tidak berhak, steward yang memblokir rilis karena test belum lolos. Kalau council tidak menolak apa pun selama 12 bulan, ia bukan governance — ia humas berseragam rapat. Heuristik pemeriksaannya sederhana: minta notulen tiga keputusan terakhir; kalau semuanya \"disetujui tanpa catatan\", wewenangnya fiktif. Analoginya wasit: wasit yang tidak pernah mengeluarkan kartu bukan wasit yang baik — ia penonton berseragam. Governance pada intinya adalah distribusi hak veto yang sah: siapa boleh bilang tidak, atas apa, dan keputusannya dihormati. Tanpa hak veto yang pernah dipakai, tidak ada governance — hanya ada harapan.",
      },
      reference: "Governance = siapa memutuskan; management = siapa mengeksekusi.",
    },
    {
      id: "dama",
      eyebrow: "Langkah 3 · DAMA-DMBOK",
      title: "Peta 10 wilayah",
      prose: [
        "DAMA-DMBOK (Data Management Body of Knowledge) = kerangka standar industri: 10 area pengetahuan dengan Data Governance di pusat — ia mengarahkan 9 lainnya: Data Architecture (DM14), Modeling & Design (DM2), Storage & Operations (DM3, DM15), Security (DM12), Integration & Interoperability (DM5, DM6), Documents & Content, Warehousing & BI (DM4, DM16), Metadata (DM10), dan Data Quality (DM7).",
        "Cara pakai: bukan untuk dihafal — untuk diagnosis: \"masalah kita di area mana?\" Area metadata dan dokumen biasanya skor terendah — itulah kenapa DM10 ada. DMBOK memberi bahasa bersama lintas tim.",
      ],
      tasks: [],
      reference: "Gunakan DMBOK untuk diagnosis, bukan hafalan.",
    },
    {
      id: "tiga-pilar",
      eyebrow: "Langkah 4 · Peran",
      title: "Owner, steward, council",
      prose: [
        "Data Owner: pemilik akuntabilitas — biasanya pimpinan bisnis (Head of Retail). Wewenang: menyetujui definisi, kebijakan akses, retensi. Disalahkan jika datanya kacau. Satu domain = satu owner.",
        "Data Steward: tangan operasional — menjaga definisi, kualitas, dokumentasi harian. Tahu detail, tapi tidak punya wewenang final. Jembatan bisnis ↔ teknis. Data Council: parlemen — perwakilan tiap domain + TI + legal + risiko, bertemu rutin. Tugas: putuskan hal lintas-domain (\"definisi 'pendapatan' untuk semua divisi\"), selesaikan sengketa, setujui kebijakan.",
        "RACI: untuk tiap keputusan, tetapkan Responsible (mengerjakan), Accountable (tepat 1 orang — yang disalahkan), Consulted (dimintai pendapat), Informed (diberi tahu). Aturan emas: tepat satu A per aktivitas — jika dua, tidak ada yang benar-benar bertanggung jawab.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengisi kolom Accountable dengan dua nama atau tim (\"tim data\"). Itu obat yang gagal: saat masalah datang, tiap orang menunjuk yang lain. Satu A = obat saling lempar.",
        type: "pitfall",
      },
      reference: "Satu A per keputusan. Council memutus sengketa lintas-domain.",
    },
    {
      id: "kebijakan-maturity-lab",
      eyebrow: "Langkah 5 · Kebijakan & maturity · lab",
      title: "Aturan main tertulis, naik satu level setahun",
      prose: [
        "Kebijakan = aturan tertulis yang ditegakkan, bukan imbauan. Contoh isi: akses (\"data nasabah hanya untuk peran X dengan approval tercatat\"), retensi (\"data transaksi 5 tahun, lalu hapus otomatis\"), kualitas (\"tabel Gold wajib lolos 100% test kritis\"), privasi (\"NIK wajib masking untuk analis\"). Siklusnya: rancang (council) → sosialisasi → tegakkan otomatis di pipeline/tool → audit → revisi. Kebijakan yang hanya di PDF = dekorasi.",
        "Maturity model (5 level): Initial (heroik individual — \"tanya Budi kalau mau data\"), Repeatable (ada pola tapi tergantung orang), Defined (proses tertulis dan diikuti), Managed (diukur dengan metrik), Optimizing (perbaikan berkelanjutan otomatis). Sekitar 65% organisasi masih di level 1–2. Aturan main: naik satu level per area per tahun — lompat 1→4 = fantasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` = rata-rata 5 kapabilitas (1 desimal)" },
        { id: "t2", text: "Tentukan `level` dari skor (fungsi `nama_level` sudah tersedia)" },
        { id: "t3", text: "Ambil `prioritas` = 2 kapabilitas berskor terendah, lalu cetak" },
      ],
      expected: "skor=1.4  level=Initial  prioritas=['Kepemilikan', 'Metadata']",
      hints: [
        "skor = round(sum(kapabilitas.values()) / len(kapabilitas), 1)",
        "level = nama_level(skor)",
        "prioritas = sorted(kapabilitas, key=kapabilitas.get)[:2]",
      ],
      code: {
        starter: `# hasil assessment PT Maju Jaya (skala 1-5)\nkapabilitas = {\n    "Kepemilikan": 1,\n    "Kualitas & test": 2,\n    "Metadata": 1,\n    "Keamanan": 2,\n    "Retensi": 1,\n}\n\ndef nama_level(s):\n    if s < 1.5: return "Initial"\n    if s < 2.5: return "Repeatable"\n    if s < 3.5: return "Defined"\n    if s < 4.5: return "Managed"\n    return "Optimizing"\n\n# TULIS KODEMU\nskor = \nlevel = \nprioritas = \n\nprint(f"skor={skor}  level={level}  prioritas={prioritas}")`,
        lockLines: 14,
        solution: `# hasil assessment PT Maju Jaya (skala 1-5)\nkapabilitas = {\n    "Kepemilikan": 1,\n    "Kualitas & test": 2,\n    "Metadata": 1,\n    "Keamanan": 2,\n    "Retensi": 1,\n}\n\ndef nama_level(s):\n    if s < 1.5: return "Initial"\n    if s < 2.5: return "Repeatable"\n    if s < 3.5: return "Defined"\n    if s < 4.5: return "Managed"\n    return "Optimizing"\n\n# TULIS KODEMU\nskor = round(sum(kapabilitas.values()) / len(kapabilitas), 1)\nlevel = nama_level(skor)\nprioritas = sorted(kapabilitas, key=kapabilitas.get)[:2]\n\nprint(f"skor={skor}  level={level}  prioritas={prioritas}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 1.4, tol: 0.01, label: "`skor` seharusnya 1.4", msg: "(1+2+1+2+1)/5 = 1,4." },
          { kind: "equal", task: "t2", name: "level", value: "Initial", label: "`level` seharusnya Initial", msg: "Skor 1,4 < 1,5 → Initial: heroik individual." },
          { kind: "contains", task: "t3", name: "prioritas", value: "Kepemilikan", label: "prioritas memuat Kepemilikan", msg: "Urutkan kapabilitas dari skor terendah, ambil 2." },
          { kind: "contains", task: "t3", name: "prioritas", value: "Metadata", label: "prioritas memuat Metadata", msg: "Urutkan kapabilitas dari skor terendah, ambil 2." },
          { kind: "stdout_matches", task: "t3", pattern: "skor=1\\.4\\s+level=Initial", label: "`print` menampilkan skor dan level", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Assessment mengubah \"kita buruk\" menjadi \"level 1,4, target level 2 via 2 perbaikan\".",
    },
    {
      id: "peta-mulai",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Mulai governance dari mana",
      prose: [
        "Belum ada apa-apa → tunjuk owner + steward untuk 1 domain kritis. Manusia dulu, dokumen kemudian; nama orang nyata > komite abstrak. Definisi berbeda-beda antar tim → glossary bisnis + council mengesahkan; sengketa definisi = sengketa wewenang.",
        "Kebijakan ada tapi dilanggar → tegakkan otomatis di tool/pipeline (RBAC, masking otomatis, test pintu). Tidak tahu mulai dari mana → maturity assessment → 2 prioritas terendah. Regulator/audit datang → lineage + bukti kepatuhan, bukan janji: auditor minta jejak — siapa akses apa, kapan, atas dasar apa.",
      ],
      tasks: [],
      reference: "Mulai kecil: 1 domain, 5 kebijakan, naik 1 level/tahun.",
    },
    {
      id: "minicase-pemilik",
      eyebrow: "Langkah 7 · Mini-case",
      title: "\"Data siapa ini?\"",
      prose: [
        "Tabel nasabah_prioritas dipakai 6 tim. Marketing menggunakannya untuk kampanye; Risiko untuk limit; tiba-tiba Legal meminta hapus 2.000 baris (permintaan hapus data UU PDP). Marketing protes (\"kampanye jalan!\"), Risiko panik (\"model kami pakai itu!\"), Legal mengancam (\"denda!\"). Tidak ada yang tahu siapa berhak memutuskan. Rapat 3 jam tanpa keputusan.",
        "Kegagalannya: tidak ada owner tertulis + tidak ada kebijakan retensi/penghapusan — keputusan ad-hoc saat krisis. Yang seharusnya memutuskan: data owner domain nasabah (dia A di RACI), dengan masukan Legal (C) — karena kewajiban hukum (UU PDP) mengalahkan kepentingan kampanye. Keputusan didokumentasikan.",
        "Struktur pencegah: owner tertulis + kebijakan penghapusan + council untuk sengketa lintas-domain. Krisis berikutnya = eksekusi prosedur, bukan rapat darurat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Permintaan hapus data UU PDP yang tidak dieksekusi karena sengketa internal = denda regulator yang nyata. Tanpa owner tertulis dan kebijakan penghapusan, tiap permintaan hapus menjadi krisis 3 jam — dan krisis yang berulang pasti bocor.",
      },
      reference: "Krisis + prosedur tertulis = insiden terkendali. Krisis tanpa prosedur = rapat darurat.",
    },
    {
      id: "harga-kegagalan",
      eyebrow: "Langkah 8 · Harga & kegagalan",
      title: "Governance yang hidup vs yang mati",
      prose: [
        "Berapa harga membangun governance? Ambil contoh bank digital \"NeoBank\" dengan 150 karyawan. Tahun pertama: satu steward penuh waktu menyusun glossary 200 istilah bisnis selama tiga bulan (wawancara 12 pemilik proses, resolves 40+ konflik definisi); tool katalog dan lineage; lima kebijakan ditulis dan disosialisasikan. Total investasi sekitar tiga orang-tahun kerja. Terdengar mahal — sampai dibandingkan dengan alternatifnya: denda Rp32 miliar di cerita pembuka, atau biaya tersembunyi yang lebih sehari-hari, yaitu 200 kali setahun seorang analis menghabiskan 30 menit \"tanya Budi\" untuk memastikan definisi — 100 jam kerja per tahun per analis, dikali 20 analis, sama dengan satu karyawan penuh yang pekerjaannya hanya bertanya. Governance bukan biaya; ia adalah pembelian kembali waktu dan kepastian. ROI-nya = denda yang tidak terjadi + jam analis yang kembali + keputusan yang tidak lagi diambil atas definisi yang salah.",
        "Mode kegagalan pertama adalah owner tituler: di atas kertas setiap domain punya owner, tetapi owner-nya direktur yang tidak pernah hadir dalam pembahasan data. Keputusan macet berbulan-bulan; steward tidak berani memutuskan karena \"bukan wewenang saya\"; akhirnya keputusan diambil diam-diam oleh siapa pun yang paling mendesak — persis kekacauan yang ingin dihindari. Aturan pemilihannya tegas: owner harus orang yang merasakan sakitnya kalau data salah — pimpinan bisnis yang KPI dan bonusnya bergantung pada data itu — bukan orang paling senior di struktur organisasi. Direktur yang tidak pernah membuka dashboard tidak merasakan sakitnya dashboard yang salah. Uji tiga bulan: kalau owner tidak pernah membatalkan atau mengubah satu keputusan pun terkait datanya, ia tituler — ganti dengan deputinya yang benar-benar bekerja dengan data itu. Satu A yang hidup mengalahkan tiga A yang tidur.",
        "Mode kegagalan kedua adalah kebijakan PDF: dokumen 100 halaman yang ditandatangani direksi, diarsipkan, dan tidak pernah dibaca lagi. Pelanggaran berjalan terus karena tidak ada yang mendeteksi. Aturan yang membedakan kebijakan hidup dari dekorasi: setiap kebijakan wajib punya \"sensor\"-nya — mekanisme otomatis yang mendeteksi pelanggaran. Kebijakan akses (\"data nasabah hanya untuk peran X\") sensornya adalah RBAC di tool plus review akses kuartalan; kebijakan privasi (\"NIK wajib masking\") sensornya adalah scan otomatis yang memeriksa setiap tabel gold; kebijakan kualitas sensornya adalah test pintu di pipeline. Uji satu kalimat untuk setiap kebijakan yang kamu tulis: \"pelanggaran terhadap kebijakan ini terdeteksi dalam berapa menit, oleh apa?\" Kalau jawabannya \"tidak tahu\" atau \"oleh kesadaran karyawan\", kebijakan itu fiksi. Tulis lebih sedikit kebijakan, tetapi setiap satunya punya sensor.",
        "Bandingkan dua perusahaan. Perusahaan A memulai dari satu domain: data nasabah untuk KYC. Satu owner nyata (Head of Retail yang bonusnya bergantung pada akuisisi), satu steward, lima kebijakan, glossary 40 istilah. Satu tahun kemudian domain itu naik dari maturity level 2 ke 3 — terukur, bukan klaim. Domain lain melihat dan meminta diperlakukan sama; governance menular. Perusahaan B memulai big-bang: 14 sistem, 10 area DMBOK sekaligus, konsultan mahal, dokumen setebal kamus. Delapan belas bulan kemudian: perilaku nol, karena tidak ada yang tahu harus mulai dari mana dan tidak ada contoh keberhasilan yang bisa ditiru. Pelajarannya: governance adalah perubahan perilaku, dan perilaku menular dari contoh yang berhasil — bukan dari mandat direksi. Mulai kecil, menangkan satu domain, dokumentasikan kemenangannya dengan angka, lalu replikasi. Strategi \"satu domain, lima kebijakan, satu tahun\" mengalahkan \"semua sekaligus\" hampir setiap saat.",
        "Council yang efektif didesain seperti pengadilan yang efisien, bukan seperti seminar. Aturannya: maksimal tiga keputusan per rapat — lebih dari itu, kualitas keputusan anjlok dan rapat menjadi ritual. Setiap item agenda punya format baku satu halaman: latar belakang dua paragraf, opsi yang dipertimbangkan (minimal dua — satu opsi berarti belum berpikir), rekomendasi steward beserta alasannya, dan keputusan yang diminta. Notulen bukan transkrip pembicaraan melainkan catatan keputusan: apa yang diputuskan, kenapa, siapa pemilik tindak lanjutnya, kapan deadline-nya. Rapat 60 menit sebulan yang menghasilkan tiga keputusan tertulis mengalahkan rapat tiga jam seminggu yang menghasilkan nol keputusan. Dan aturan emasnya: \"rapat tanpa keputusan adalah biaya, bukan governance.\" Kalau tiga rapat berturut-turut tidak menghasilkan keputusan, bubarkan council-nya — ia sudah mati, hanya belum dikuburkan.",
        "Kapan governance \"cukup\" untuk ukuran organisasimu? Tiga uji praktis. Uji auditor: bisakah kamu menyerahkan lineage, definisi, dan bukti akses untuk satu tabel kritis dalam satu hari kerja? Kalau butuh dua minggu dan lima orang, belum cukup. Uji analis baru: bisakah ia memahami definisi \"nasabah aktif\" dan \"pendapatan\" tanpa bertanya ke orang — hanya dari glossary dan katalog? Kalau ia harus \"tanya Budi\", belum cukup. Uji krisis: kalau Legal meminta hapus 2.000 baris data (skenario mini-case langkah 7), apakah ada prosedur tertulis yang langsung dieksekusi, atau rapat darurat tiga jam lagi? Tiga ya berarti cukup untuk sekarang. Governance bukan tujuan akhir yang sempurna; ia adalah tingkat kematangan yang sesuai dengan risiko yang kamu hadapi. Bank sistemik butuh lebih dari startup 20 orang — dan itu wajar.",
        "Keputusan cepat untuk situasi umum — tempel di dinding. Dua tim butuh data yang sama dengan definisi berbeda: owner domain memutuskan, bukan voting, bukan yang paling keras suaranya; voting menghasilkan kompromi definisi yang tidak dipakai siapa pun. Tidak ada yang bisa menjelaskan definisi dalam dua menit: definisinya belum ada — jangan pakai angkanya untuk keputusan sampai ada. Data kritis tanpa owner lebih dari 30 hari: council menunjuk steward sementara dan memberi deadline 14 hari untuk menemukan owner permanen; kekosongan kepemilikan adalah insiden, bukan kondisi normal. Sengketa lintas domain yang tidak selesai dalam dua minggu: naik ke council, dan council wajib memutuskan dalam satu sesi — menunda keputusan adalah keputusan untuk membiarkan kekacauan berlanjut.",
        "Peran steward pantas didalami karena di sinilah governance hidup atau mati sehari-hari. Steward yang baik adalah penerjemah dwibahasa: ia bicara bahasa bisnis dengan owner dan bahasa teknis dengan engineer. Tetapi ada jebakan struktural: steward diberi tanggung jawab menjaga kualitas tanpa diberi wewenang menghentikan apa pun — seperti satpam yang tidak boleh menahan orang. Hasilnya adalah frustrasi dan turnover: steward yang baik pergi, yang bertahan adalah yang tidak peduli. Solusinya: beri steward \"hak veto sementara\" — ia boleh memblokir rilis atau promosi tabel ke gold selama 48 jam sambil eskalasi ke owner. Veto sementara cukup kuat untuk mencegah kerusakan, cukup terbatas untuk tidak disalahgunakan. Dan perlakukan steward sebagai jalur karir, bukan tugas sampingan analis yang \"sambil lalu\" — stewardship yang profesional (dengan pelatihan DMBOK dan sertifikasi seperti CDMP) menghasilkan kualitas yang konsisten, bukan heroik sesekali.",
        "Jangan campuradukkan data council dengan komite IT atau komite risiko yang sudah ada. Komite IT memutuskan investasi teknologi; komite risiko memutuskan selera risiko; data council memutuskan definisi, kepemilikan, dan kebijakan data. Tumpang tindih keanggotaan boleh — ketua council idealnya adalah pemilik bisnis senior, bukan CIO, karena keputusan data adalah keputusan bisnis. Frekuensinya bulanan 60 menit, bukan mingguan — governance yang butuh rapat mingguan berarti pendelegasiannya rusak (terlalu banyak keputusan naik ke atas). Tanda council sehat: 80% keputusan dibuat oleh owner dan steward di level domain tanpa pernah mencapai council; council hanya menangani sengketa lintas-domain dan kebijakan baru. Council yang memutuskan segalanya adalah leher botol berkedok tata kelola.",
        "Untuk startup atau UMKM 20–50 orang, governance versi enterprise adalah racun — tetapi nol governance juga racun. Versi minimal yang bekerja disebut \"governance satu halaman\": satu glossary berisi 20 istilah bisnis paling diperebutkan (mulai dari yang menyebabkan perdebatan di rapat), satu owner bernama untuk setiap domain kritis (biasanya 3–5 domain: pelanggan, produk, transaksi, keuangan), dan tiga kebijakan saja — siapa boleh akses data pelanggan, berapa lama data disimpan, dan tabel apa yang boleh dipakai direksi. Satu halaman, ditempel di wiki, direview tiap kuartal. Ini bukan governance \"mini yang lucu\" — ini fondasi yang sama, hanya disesuaikan dengan blast radius yang lebih kecil. Startup yang tumbuh dari fondasi ini menaikkan level dengan mulus; startup yang \"nanti saja\" biasanya membayar dengan migrasi menyakitkan saat sudah 200 orang dan 14 definisi \"pendapatan\".",
        "Governance yang tidak diukur akan layu. Lima metrik yang terbukti berguna. Satu: persentase tabel gold yang punya owner bernama — target 100%, dan \"tim data\" tidak dihitung sebagai nama. Dua: persentase kolom kritis yang terdefinisi di glossary — ukur tiap kuartal, trennya harus naik. Tiga: waktu menjawab pertanyaan auditor untuk satu tabel sampel — dari permintaan sampai dokumen lengkap; target di bawah satu hari kerja. Empat: jumlah sengketa definisi yang naik ke council per kuartal — paradoksnya, angka ini boleh naik di awal (masalah yang tadinya tersembunyi kini terlihat) lalu harus turun. Lima: jumlah insiden data yang akar masalahnya \"tidak ada owner/definisi\" — harus turun menuju nol. Laporkan lima angka ini ke direksi tiap kuartal dalam satu slide. Governance yang bisa ditunjukkan angkanya mendapat anggaran; yang hanya bisa diceritakan mendapat anggukan.",
        "Kegagalan budaya yang paling halus: governance diposisikan sebagai polisi, bukan pelayanan. Steward datang dengan daftar larangan; council terkenal sebagai tempat proposal mati; tim bisnis belajar bahwa cara tercepat mendapat data adalah menghindari governance — lahirlah shadow data: spreadsheet di laptop, database Access di bawah meja, dashboard liar. Aturan pembaliknya: steward melayani dulu, menegakkan kemudian. Dalam 90 hari pertama, target steward bukan menolak satu pun permintaan, melainkan mempercepatnya — membantu menemukan data yang tepat, menjelaskan definisi, mengurus akses resmi lebih cepat dari jalur gelap. Kepercayaan yang terbangun dari pelayanan membuat penegakan di bulan-bulan berikutnya diterima sebagai perlindungan, bukan hambatan. Governance yang dibenci akan dilewati; governance yang membantu akan dipakai. Pilih yang kedua dengan desain, bukan harapan.",
        "Risiko yang jarang dibicarakan adalah suksesi kepemilikan. Owner pindah divisi, resign, atau promosi — dan tiba-tiba domain kritis menjadi yatim. Tidak ada yang mengumumkan \"saya tidak lagi owner data nasabah\"; kepemilikan menguap diam-diam, dan enam bulan kemudian sengketa muncul tanpa ada yang berwenang memutus. Aturan pencegahannya mekanis: setiap owner wajib menunjuk deputy sejak hari pertama (nama tertulis, bukan \"nanti\"); setiap ada perubahan organisasi, daftar kepemilikan data adalah checklist wajib dalam serah terima jabatan — sama pentingnya dengan serah terima anggaran; dan council mereview daftar owner tiap enam bulan: masih orang yang tepat? masih hidup wewenangnya? Kepemilikan data seperti kepemilikan rumah: harus ada sertifikatnya, dan sertifikat yang tidak pernah dicek akan bermasalah saat dibutuhkan.",
        "Tutup dengan kebenaran yang tidak nyaman: governance tidak pernah \"selesai\". Organisasi berubah, sistem berganti, regulasi baru datang, orang keluar-masuk — setiap perubahan mengikis sedikit ketertiban yang dibangun. Karena itu governance didesain sebagai otot, bukan monumen: council yang bertemu rutin, metrik yang dilaporkan kuartalan, glossary yang direview tahunan, owner yang dievaluasi. Monumen (dokumen 100 halaman) selesai dibangun lalu lapuk; otot (kebiasaan memutuskan dan menegakkan) dilatih terus dan menguat. Mulai dari satu domain minggu ini: tunjuk satu owner bernama untuk data paling kritis di timmu, tulis lima definisi yang paling sering diperdebatkan, dan adakan satu keputusan pertama. Itulah repetisi pertama otot governance-mu. Sisanya adalah konsistensi.",
        "Contoh konkret RACI untuk satu keputusan akan membuat konsep langkah 4 menjadi nyata. Keputusan: \"definisi nasabah aktif diubah dari login 30 hari menjadi transaksi 90 hari.\" Responsible: steward data nasabah (menulis analisis dampak: 12 dashboard terdampak, 3 model ML memakai fitur ini). Accountable: Head of Retail selaku data owner (satu nama — ia yang menandatangani). Consulted: tim risiko (model mereka terdampak), tim marketing (kampanye terdampak), legal (apakah definisi baru melanggar komitmen laporan?). Informed: seluruh analis via changelog, tim BI via notifikasi lineage. Perhatikan: yang memutuskan (A) bukan yang menganalisis (R) — pemisahan ini mencegah analis memaksakan definisi yang nyaman secara teknis tetapi salah secara bisnis. Dan consulted bukan veto: masukan mereka wajib didengar dan dicatat, tetapi keputusan tetap di tangan A. RACI yang ditulis untuk 10 keputusan teratas organisasi (definisi kunci, akses data sensitif, retensi, perubahan skema kritis) menghemat ratusan jam debat kusir per tahun.",
        "Frontier berikutnya adalah model governance: model ML/AI adalah konsumen data yang rakus dan produsen keputusan yang berisiko. Prinsip governance yang sama berlaku dengan penekanan berbeda. Owner model (biasanya pimpinan bisnis pengguna model) bertanggung jawab atas keputusan yang dihasilkan model, bukan tim data science — \"modelnya yang salah\" bukan pembelaan. Setiap model produksi wajib punya model card: tujuan, data training (sumber + versi + tanggal), metrik performa dan batasannya, serta tanggal review ulang. Data training adalah lineage yang harus terdokumentasi: model yang dilatih dengan data berlabel salah (cerita mini-case DM7 tentang NULL menjadi 0) mewarisi kebohongannya. Dan kebijakan retensi model: model yang tidak di-review 12 bulan harus diuji ulang atau dipensiunkan — model yang basi sama berbahayanya dengan dashboard yang basi, hanya lebih sulit dideteksi karena \"masih mengeluarkan angka\".",
        "Glossary bisnis pantas mendapat perhatian khusus karena ia adalah fondasi termurah dari semua fondasi. Satu istilah, satu definisi, satu contoh, satu owner — format empat kolom yang cukup. \"Nasabah aktif: nasabah dengan minimal satu transaksi finansial dalam 90 hari terakhir; contoh: Budi transfer Rp500 ribu pada 1 Oktober; owner: Head of Retail.\" Empat puluh istilah seperti ini menyelesaikan 80% perdebatan definisi di rapat. Aturan pemeliharaannya: setiap definisi yang dipakai direksi direview tahunan (apakah masih relevan?), setiap perubahan definisi punya tanggal berlaku (definisi boleh berubah — yang tidak boleh adalah berubah diam-diam), dan definisi lama diarsipkan bukan dihapus (laporan historis harus bisa direproduksi dengan definisi yang berlaku saat itu). Glossary yang baik dibaca orang; glossary yang buruk ditulis konsultan. Uji: minta lima orang dari divisi berbeda mendefinisikan \"pendapatan\" — kalau lima jawabannya sama dengan glossary, glossary-mu hidup.",
      ],
      tasks: [],
      reference: "Governance hidup = veto yang dipakai, sensor yang bunyi, keputusan yang tertulis.",
    },
    {
      id: "raci-data",
      eyebrow: "Langkah 9 · RACI data: siapa memutuskan apa",
      title: "RACI data: siapa memutuskan apa",
      prose: [
        "Langkah 4 memperkenalkan RACI — sekarang terapkan ke empat peran data. Data Owner (pemilik bisnis, mis. Head of Retail) adalah Accountable: ia menandatangani definisi, akses, dan retensi, dan ia yang disalahkan kalau datanya kacau. Data Steward adalah Responsible: ia mengerjakan — menjaga definisi, kualitas, dan dokumentasi harian. Data Custodian (biasanya tim TI atau platform) adalah Responsible untuk penyimpanan, backup, dan keamanan teknis — ia menjaga mesinnya, bukan maknanya. Data Consumer (analis, tim risiko, marketing) adalah Consulted atau Informed: ia memakai data dan memberi masukan, tetapi tidak memutuskan definisinya.",
        "Matriksnya untuk satu keputusan — mis. mengubah definisi nasabah aktif: Responsible = steward data nasabah (menulis analisis dampak: 12 dashboard terdampak, 3 model ML memakai fitur ini); Accountable = Head of Retail selaku owner (satu nama, ia yang menandatangani); Consulted = tim risiko dan marketing (terdampak) plus legal (apakah definisi baru melanggar komitmen laporan); Informed = seluruh analis via changelog. Perhatikan pemisahannya: yang menganalisis (R) bukan yang memutuskan (A) — analis tidak boleh memaksakan definisi yang nyaman secara teknis tetapi salah secara bisnis. Dan Consulted bukan veto: masukannya wajib didengar dan dicatat, tetapi keputusan tetap di tangan A.",
        "Case konflik kepemilikan: tabel nasabah_prioritas dipakai 6 tim. Marketing mengklaim pemiliknya (\"kami yang paling sering pakai\"), Risiko mengklaim juga (\"model kami bergantung padanya\"), lalu Legal meminta hapus 2.000 baris dan tidak ada yang berani memutuskan. Penyelesaiannya bukan voting — voting menghasilkan kompromi yang tidak dipakai siapa pun. Council menunjuk satu owner berdasarkan siapa yang menanggung risikonya: domain nasabah adalah milik Head of Retail, karena KPI dan bonusnya bergantung pada data nasabah; Marketing dan Risiko menjadi Consulted permanen untuk tabel itu; Legal menjadi Consulted wajib untuk keputusan hapus. Keputusan dicatat dengan tanggal dan nama — krisis berikutnya menjadi eksekusi prosedur, bukan rapat darurat tiga jam.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Custodian (tim TI) ditulis sebagai Accountable untuk definisi bisnis. TI menjaga mesinnya — backup, enkripsi, uptime — bukan maknanya. Definisi \"nasabah aktif\" adalah keputusan bisnis; yang menandatanganinya harus pemilik bisnis yang menanggung risikonya.",
      },
      quiz: [
        {
          q: "Definisi \"nasabah aktif\" diubah. Siapa Accountable (A) — satu-satunya penandatangan?",
          options: [
            { text: "Data steward — ia yang menulis analisis dampaknya", why: "Steward adalah Responsible (mengerjakan analisis), bukan Accountable." },
            { text: "Head of Retail selaku data owner domain nasabah", why: "Satu A: pemilik bisnis yang KPI-nya bergantung pada data itu.", correct: true },
            { text: "Tim TI selaku custodian", why: "Custodian menjaga mesin (storage, backup), bukan makna definisi." },
            { text: "Data council secara kolektif", why: "Council memutus sengketa lintas-domain; keputusan domain ada di owner-nya." },
          ],
        },
        {
          q: "Dua tim mengklaim pemilik tabel yang sama. Penyelesaian yang benar?",
          options: [
            { text: "Voting antar tim — suara terbanyak menang", why: "Voting menghasilkan kompromi definisi yang tidak dipakai siapa pun." },
            { text: "Council menunjuk satu owner berdasarkan siapa menanggung risikonya, tim lain jadi Consulted, keputusan dicatat", why: "Satu A bernama + peran lain jelas + jejak tertulis = konflik selesai permanen.", correct: true },
            { text: "Jadikan keduanya co-owner", why: "Dua A = tidak ada yang benar-benar bertanggung jawab." },
            { text: "Biarkan siapa yang paling sering memakai yang memutuskan", why: "Frekuensi pakai bukan wewenang; pemakai terbanyak bisa jadi bukan penanggung risiko." },
          ],
        },
      ],
      reference: "Owner = A (satu nama). Steward = R. Custodian = mesin. Consumer = C/I. Consulted bukan veto.",
    },
    {
      id: "retensi-klasifikasi",
      eyebrow: "Langkah 10 · Kebijakan retensi & klasifikasi",
      title: "Kebijakan retensi dan klasifikasi data",
      prose: [
        "Klasifikasi menjawab: seberapa sensitif data ini, dan perlakuan apa yang mengikutinya. Tiga tingkat yang umum: Publik — boleh dibagikan ke siapa pun (mis. alamat kantor cabang, suku bunga yang diumumkan); Internal — hanya karyawan yang membutuhkan (mis. laporan kinerja cabang, daftar produk internal); Rahasia — akses ketat, masking atau enkripsi wajib (mis. NIK, nomor rekening, gaji, hasil scoring individu). Aturannya: klasifikasi ditentukan pemilik data saat data dibuat, bukan saat audit datang; dan setiap tingkat punya perlakuan teknis yang otomatis ditegakkan — bukan diingat manusia.",
        "Retensi menjawab: berapa lama data disimpan, lalu dihapus bagaimana. Contoh aturan retensi (ilustratif — angka pastinya mengikuti regulasi dan kebijakan internal): data transaksi 5 tahun lalu hapus otomatis; log akses 1 tahun; data marketing disimpan selama consent berlaku dan dihapus saat consent ditarik; backup mengikuti retensi sumbernya — backup bukan tempat persembunyian data yang seharusnya sudah dihapus. Retensi tanpa penghapusan otomatis adalah janji kosong: manusia tidak akan menghapus 800 TB arsip dengan tangan.",
        "Keduanya bertemu di satu titik: data Rahasia yang sudah melewati masa retensi adalah bom waktu ganda — blast radius kebocoran terbesar untuk data yang bahkan sudah tidak dibutuhkan. Itu sebabnya kebijakan retensi dan klasifikasi ditulis berpasangan di dokumen yang sama, disahkan council, dan ditegakkan otomatis: job penghapusan terjadwal, scan klasifikasi berkala, dan alert kalau ada tabel Rahasia tanpa owner atau tanpa tanggal retensi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menyimpan NIK nasabah yang sudah menutup rekening 5 tahun lalu — tanpa dasar retensi — berarti menanggung risiko denda dan kebocoran untuk data yang tidak menghasilkan apa-apa. Minimisasi adalah pengendalian risiko termurah: data yang tidak ada tidak bisa bocor.",
      },
      quiz: [
        {
          q: "NIK dan nomor rekening nasabah masuk klasifikasi apa, dan perlakuannya?",
          options: [
            { text: "Publik — boleh dibagikan", why: "NIK adalah identifier paling sensitif; publik berarti kebocoran yang dilegalkan." },
            { text: "Internal — cukup karyawan saja", why: "Internal terlalu longgar untuk identifier: butuh akses ketat plus masking/enkripsi." },
            { text: "Rahasia — akses ketat, masking atau enkripsi wajib", why: "Klasifikasi Rahasia memicu perlakuan teknis otomatis yang paling ketat.", correct: true },
            { text: "Tidak perlu diklasifikasi — yang penting dienkripsi", why: "Tanpa klasifikasi tidak ada yang tahu perlakuan apa yang berlaku; enkripsi saja tidak mengatur siapa boleh akses." },
          ],
        },
        {
          q: "Aturan retensi \"data transaksi 5 tahun\" tanpa penghapusan otomatis. Masalahnya?",
          options: [
            { text: "Tidak ada — aturannya sudah tertulis", why: "Kebijakan tanpa sensor dan eksekusi otomatis adalah dekorasi." },
            { text: "Retensi tanpa hapus otomatis = janji kosong; data melewati masa retensi tetap tersimpan dan tetap bisa bocor", why: "Penegakan harus otomatis: job hapus terjadwal + alert tabel tanpa tanggal retensi.", correct: true },
            { text: "Harusnya 10 tahun agar aman", why: "Lebih lama menyimpan justru memperbesar blast radius, bukan memperkecil." },
            { text: "Backup tidak perlu mengikuti retensi", why: "Backup yang menyimpan data kedaluwarsa adalah tempat persembunyian data yang seharusnya sudah dihapus." },
          ],
        },
      ],
      reference: "Klasifikasi (Publik/Internal/Rahasia) + retensi berpasangan, disahkan council, ditegakkan otomatis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah."],
      tasks: [],
      summary: [
        "Governance ≠ management: wasit (keputusan) vs pemain (eksekusi).",
        "DAMA-DMBOK: 10 area, governance di pusat — pakai untuk diagnosis, bukan hafalan.",
        "Tiga pilar: owner (akuntabilitas) + steward (operasional) + council (lintas-domain), dengan nama nyata.",
        "RACI: satu A per keputusan. Kebijakan = kode, bukan PDF.",
        "Maturity: naik 1 level/tahun; mulai dari 1 domain.",
      ],
      next: { label: "DM10 — Metadata & Lineage", href: "/v2/learn/dm10-metadata-lineage" },
      quiz: [
        {
          q: "Bedanya data governance vs data management?",
          options: [
            { text: "Sama saja", why: "Keduanya punya peran berbeda yang konkret." },
            { text: "Governance = wewenang dan keputusan (siapa memutuskan, aturan apa); management = eksekusi", why: "Owner bisnis memutuskan apa yang benar; engineer memutuskan bagaimana membangunnya.", correct: true },
            { text: "Governance = teknis, management = bisnis", why: "Justru sebaliknya: governance adalah wewenang bisnis, management banyak teknisnya." },
            { text: "Management lebih penting", why: "Keduanya butuh; tanpa governance eksekusi tidak punya arah yang sah." },
          ],
        },
        {
          q: "Dalam RACI, aturan emas untuk kolom Accountable (A) adalah…",
          options: [
            { text: "Sebanyak mungkin orang", why: "Banyak A = tidak ada yang benar-benar bertanggung jawab." },
            { text: "Tepat satu orang per aktivitas — jika dua, tidak ada yang benar-benar bertanggung jawab", why: "Satu A = obat saling lempar; A = yang disalahkan jika gagal.", correct: true },
            { text: "Boleh kosong", why: "Kosong = tidak ada pemilik = mini-case langkah 7." },
            { text: "Sama dengan Responsible", why: "R mengerjakan, A menanggung akibat — peran berbeda." },
          ],
        },
        {
          q: "Kebijakan 100 halaman tapi pelanggaran jalan terus. Diagnosis dan obat?",
          options: [
            { text: "Tambah jadi 200 halaman", why: "Masalahnya bukan ketebalan dokumen." },
            { text: "Kebijakan = fiksi jika tak ditegakkan. Obat: tegakkan otomatis di tool/pipeline", why: "Ujiannya: apakah pelanggaran terdeteksi dan ditindak?", correct: true },
            { text: "Hapus semua kebijakan", why: "Kebijakannya dibutuhkan; yang kurang adalah penegakannya." },
            { text: "Salahkan karyawan", why: "Sistem yang mengandalkan ingatan manusia pasti bocor." },
          ],
        },
        {
          q: "Organisasi di maturity level 2 ingin ke level 4 dalam 3 bulan. Penilaianmu?",
          options: [
            { text: "Bisa dengan konsultan mahal", why: "Konsultan tidak membeli perubahan budaya." },
            { text: "Fantasi — naik satu level per area per tahun sudah ambisius", why: "Maturity = perubahan perilaku dan budaya, bukan instalasi tool.", correct: true },
            { text: "Bisa jika lembur", why: "Lembur tidak mempercepat adopsi proses." },
            { text: "Level tidak penting", why: "Level memberi bahasa untuk target yang terukur." },
          ],
        },
        {
          q: "Sengketa definisi \"pendapatan\" antar 4 divisi. Siapa memutus?",
          options: [
            { text: "Divisi yang paling keras suaranya", why: "Volume suara bukan wewenang." },
            { text: "Data council lintas-domain — satu-satunya forum berwenang atas hal lintas-domain", why: "Council memutus, didokumentasikan, disosialisasikan.", correct: true },
            { text: "Data engineer", why: "Engineer mengeksekusi definisi, bukan menetapkannya." },
            { text: "Biarkan beda-beda", why: "Itulah akar cerita DM1: tiga angka berbeda di rapat direksi." },
          ],
        },
        {
          q: "Data council sebuah perusahaan tidak pernah menolak satu pun usulan selama 12 bulan. Kesimpulan yang tepat?",
          options: [
            { text: "Governance-nya sangat harmonis", why: "Harmonis 100% dalam 12 bulan bukan harmoni — itu tanda tidak ada wewenang yang dipakai." },
            { text: "Wewenangnya fiktif — council berfungsi sebagai humas, bukan governance; uji dengan notulen keputusan", why: "Ujian governance adalah penolakan yang pernah ditegakkan.", correct: true },
            { text: "Berarti semua usulan memang bagus", why: "Secara statistik tidak mungkin 12 bulan usulan selalu sempurna." },
            { text: "Council harus dibubarkan saja", why: "Terburu-buru — perbaiki dulu: beri kasus nyata untuk diputus dan lihat." },
          ],
        },
      ],
    },
  ],
};
