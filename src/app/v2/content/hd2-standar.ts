import type { V2Lesson } from "../lib/types";

export const hd2: V2Lesson = {
  slug: "hd2-standar",
  track: "Health Data Science",
  module: "Fondasi Data Kesehatan",
  title: "HD2 ICD, SNOMED, FHIR: Bahasa Bersama Data Kesehatan",
  estMinutes: 50,
  steps: [
    {
      id: "dm-tiga-arti",
      eyebrow: "Langkah 1 · Masalah",
      title: "\u201CDM\u201D yang berarti tiga hal",
      prose: [
        "Di RS A, kolom diagnosis menulis “DM”. Di RS B, menulis “Diabetes Mellitus”. Di puskesmas C, menulis “kencing manis”. Analis junior menggabungkan tiga file dan menghitung pasien diabetes — hasilnya kacau: ada yang kehitung tiga kali, ada yang lolos. Padahal ketiganya maksudnya sama: E11 (ICD-10: diabetes melitus tipe 2).",
        "Standar kode kesehatan lahir untuk masalah sepele tapi mematikan ini: manusia menulis dengan bahasa, mesin butuh kode. Twist-nya: ketiga penulis itu tidak ada yang salah — “DM”, “Diabetes Mellitus”, dan “kencing manis” semuanya benar secara klinis. Yang salah adalah analisnya: ia mengira standarisasi penulisan sama dengan standarisasi makna.",
        "Standar kode (ICD, SNOMED, LOINC) tidak menyamakan bahasa manusia — ia memberi tiap makna sebuah nomor rumah agar mesin bisa membedakan “DM si diabetes” dari “DM si dorsum manus”. Lesson ini tentang peta nomor rumah itu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Langsung menghitung dari kolom diagnosis teks bebas tanpa identifikasi sistem kodenya dulu. Satu kolom “diagnosis” bisa berisi tiga sistem kode sekaligus (lokal, ICD-10, singkatan) — kenali dulu, hitung kemudian.",
        type: "pitfall",
      },
      reference: "Manusia menulis dengan bahasa, mesin butuh kode.",
    },
    {
      id: "icd-snomed",
      eyebrow: "Langkah 2 · ICD & SNOMED",
      title: "ICD: kode pos. SNOMED: peta lengkap.",
      prose: [
        "ICD (International Classification of Diseases) — Indonesia memakai ICD-10, WHO mendorong ICD-11 — mengklasifikasikan diagnosis untuk statistik dan billing. Satu kode = satu kategori penyakit: E11 = diabetes melitus tipe 2, A15 = TB paru terkonfirmasi. Membaca J18.9 (pneumonia, unspecified): huruf J = bab penyakit pernapasan, 18 = pneumonia, .9 = tidak dirinci. ICD itu seperti kode pos: cukup untuk mengantar surat (tagihan) ke kota yang benar, tapi tidak tahu isi rumahnya.",
        "SNOMED CT adalah terminologi klinis dengan 350.000+ konsep yang saling terhubung (ontologi): bukan sekadar kode, tapi jaringan makna. Kalau ICD itu kode pos, SNOMED itu peta lengkap dengan setiap gang dan nomor rumah. Ia menjawab apa yang sebenarnya terjadi secara klinis — dengan harga kompleksitas implementasi yang jauh lebih tinggi.",
        "Lompatan granularitasnya masif: ICD ~14 ribu kategori vs SNOMED 350 ribu konsep vs teks bebas yang tak terbatas. Makin rinci makin ekspresif, tapi makin sulit diisi konsisten oleh dokter sibuk. Inilah kenapa ICD tetap merajai data operasional.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira kalau datanya sudah pakai ICD-10 berarti diagnosisnya pasti benar. ICD-10 di data operasional dioptimasi untuk billing: kode bisa dipilih agar klaim lolos (upcoding), diagnosis kerja yang belum pasti tetap diberi kode, dan “unspecified” (.9) sering berarti ketidakpastian dokter, bukan kepastian.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Perbedaan utama SNOMED CT vs ICD?",
          options: [
            { text: "SNOMED adalah ontologi klinis 350rb+ konsep yang saling terkait; ICD adalah klasifikasi statistik ~14rb kategori", why: "Analogi: ICD = kode pos untuk billing, SNOMED = peta lengkap untuk kebenaran klinis.", correct: true },
            { text: "SNOMED untuk billing, ICD untuk klinis", why: "Terbalik: ICD-lah bahasa billing; SNOMED bahasa klinis." },
            { text: "Keduanya identik, hanya nama beda", why: "Beda fungsi, beda granularitas (14rb vs 350rb+), beda tujuan." },
            { text: "ICD lebih rinci dari SNOMED", why: "Terbalik: SNOMED 350rb+ konsep jauh lebih rinci dari ICD ~14rb kategori." },
          ],
        },
      ],
      reference: "ICD = bahasa uang; SNOMED = bahasa klinis.",
    },
    {
      id: "loinc-fhir",
      eyebrow: "Langkah 3 · LOINC, FHIR & OMOP",
      title: "Kamus lab, amplop pos, dan penerjemah PBB",
      prose: [
        "LOINC menstandarkan nama tes lab dan pengukuran (HbA1c punya satu kode LOINC 4548-4 walau tiap RS menyebutnya beda). RxNorm menstandarkan nama obat (metformin = RxNorm 6809). Mereka adalah kamus untuk hal paling berantakan di RS: nama tes dan obat lokal.",
        "HL7 FHIR adalah standar pertukaran data berbasis API modern (REST + JSON): data dipecah jadi resources (Patient, Observation, Medication). SATUSEHAT adalah implementasi FHIR terbesar di Indonesia: ratusan faskes mengirim resource FHIR ke platform nasional. Tapi ingat: FHIR tanpa terminologi standar = amplop rapi berisi surat bahasa alien. Terkirim, tapi tidak dimengerti.",
        "OMOP CDM (OHDSI) adalah common data model: skema database standar agar data banyak RS bisa dianalisis dengan query yang sama. Sekali datamu diterjemahkan ke OMOP, analis di negara lain bisa menjalankan analisismu tanpa mengubah query — penerjemah PBB-nya data kesehatan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira FHIR/SATUSEHAT menyelesaikan masalah kualitas data. FHIR menyelesaikan masalah pertukaran (sintaks), bukan masalah makna dan kelengkapan. Diagnosis yang salah kode tetap salah — hanya kini salah secara terstandar. Interoperabilitas tidak sama dengan kualitas.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "FHIR menyelesaikan masalah interoperabilitas sintaks. Apa yang TIDAK diselesaikannya?",
          options: [
            { text: "Makna dan kualitas kode di dalam resource — butuh terminologi standar", why: "FHIR = amplop standar. Isinya tetap butuh ICD/SNOMED/LOINC agar bermakna sama.", correct: true },
            { text: "Format pertukaran antar sistem", why: "Itu justru yang diselesaikan FHIR: format dan struktur resource standar." },
            { text: "Pengiriman data real-time", why: "FHIR berbasis API modern memang memungkinkan aliran near real-time." },
            { text: "Struktur resource", why: "Struktur resource (Patient, Observation, dst.) adalah inti FHIR." },
          ],
        },
      ],
      reference: "Interoperabilitas = sintaks standar + makna standar. Satu saja tidak cukup.",
    },
    {
      id: "upcoding",
      eyebrow: "Langkah 4 · Jebakan",
      title: "Ketika pelatihan coding meniru wabah",
      prose: [
        "Dinkes melaporkan: kasus TB (ICD A15–A19) di klaim naik 40% dalam 6 bulan setelah pelatihan coding untuk petugas klaim. Media menulis “wabah TB”. Kamu diminta verifikasi sebelum anggaran darurat digelontorkan.",
        "Kamu tarik tiga sumber: klaim A15–A19 naik 40%; resep OAT (obat anti-TB) di data farmasi naik hanya 5%; hasil lab BTA positif di EHR naik 3%. Dua sumber yang lebih dekat ke klinis hampir datar — hanya kode billing yang melonjak, tepat setelah pelatihan coding. Ini artefak dokumentasi, bukan epidemiologi.",
        "Fenomena ini bernama upcoding: kode ICD dipilih untuk memaksimalkan klaim yang disetujui, bukan akurasi klinis. Sistem INA-CBG BPJS mengelompokkan ribuan kode ICD menjadi sekitar 1.000 grup tarif — pola “epidemi” tertentu di data klaim ternyata peta tarif, bukan peta penyakit. Rekomendasi aksimu: batalkan narasi wabah, tetapkan definisi kasus TB berbasis BTA/resep (bukan klaim mentah), dan catat periode pelatihan sebagai breakpoint di semua tren diagnosis ke depan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan kenaikan 40% kode billing sebagai lonjakan kasus ke Dinkes akan memicu respons kesehatan masyarakat — dan anggaran darurat — untuk masalah yang tidak ada. Selalu triangulasi dengan sumber yang lebih dekat ke klinis (resep, lab) sebelum mengumumkan tren.",
        type: "risk",
      },
      reference: "Perubahan administratif meniru wabah di data klaim. Curigai breakpoint.",
    },
    {
      id: "peta-kode",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kode apa untuk pertanyaan apa",
      prose: [
        "Analisis biaya atau utilisasi → ICD-10 + INA-CBG: ICD adalah bahasa billing dan grouping tarif sudah terstandar nasional. Definisi kohort presisi (“siapa benar-benar gagal jantung”) → SNOMED CT + LOINC + RxNorm: butuh granularitas dan validasi silang antar domain (diagnosis + lab + obat).",
        "Gabung data multi-RS → OMOP CDM: sekali mapping, satu query jalan di semua situs (jaringan OHDSI). Integrasi real-time antar sistem → FHIR/SATUSEHAT: API standar, didukung regulasi nasional.",
        "Aturan praktis 10 detik: identifikasi sistem kode dulu, hitung kemudian. ICD = bahasa uang; SNOMED = bahasa klinis. FHIR = amplop; terminologi = isi surat. Multi-situs? Tanya OMOP sebelum menulis query. Dan untuk proyek multi-RS, alokasikan 30–50% waktu untuk harmonisasi — itu normal, bukan kegagalan perencanaan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai kode level 1 (E11 untuk billing) langsung sebagai definisi kohort level 3 (fenotipe “pasien diabetes untuk studi ini”). E11 mencakup rule-out, salah kode, dan kasus historis. Naiklah minimal satu level dari kode mentah sebelum menjawab pertanyaan klinis — lihat HD11.",
        type: "pitfall",
      },
      reference: "Tiga level makna: kode (billing) → konsep (klinis) → fenotipe (aturan studi).",
    },
    {
      id: "lab-audit-kode",
      eyebrow: "Langkah 6 · Lab",
      title: "Audit kode: ketika pelatihan meniru wabah",
      prose: [
        "Kasus dari lesson ini: setelah pelatihan coding, klaim TB (A15–A19) naik 40% — tapi resep OAT naik 5% dan BTA positif naik 3%. Analis senior tidak percaya satu kolom sendirian; ia memvalidasi silang dengan sumber independen. Rasio validasi silang R = klaim / resep: bila R melonjak tanpa kenaikan resep, yang berubah adalah perilaku coding — bukan epidemiologinya.",
        "Tugasmu: tulis fungsi `audit_kode(klaim_sebelum, klaim_sesudah, oat_sebelum, oat_sesudah)` yang menghitung rasio sebelum/sesudah, persen kenaikan klaim, dan memberi label “ya” bila indikasi upcoding terdeteksi (kenaikan klaim >20% sementara kenaikan resep <10%) — “tidak” bila tidak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio_sesudah` = klaim/resep setelah pelatihan" },
        { id: "t2", text: "Hitung `indikasi_upcoding` (“ya”/“tidak”) dari aturan ambang" },
      ],
      expected: "rasio_sesudah≈1.39 kenaikan=40% upcoding=ya",
      formula: String.raw`R = \frac{\text{klaim A15--A19}}{\text{resep OAT}}`,
      formulaNote: "R = rasio validasi silang: jumlah klaim diagnosis dibagi jumlah resep obat terkait pada periode yang sama. R ≈ 1 = klaim dan farmasi saling mengonfirmasi. R melonjak tanpa kenaikan resep = sinyal perubahan perilaku coding (upcoding) atau definisi — bukan wabah. klaim A15–A19 = klaim dengan kode TB ICD-10 per periode; resep OAT = resep obat anti-TB per periode yang sama. Interpretasi: R naik dari ~1,04 ke ~1,39 sementara resep naik 5% → klaim tumbuh tanpa dukungan klinis.",
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan “wabah TB naik 40%” ke media berdasarkan satu kolom klaim — lalu dikoreksi seminggu kemudian menjadi “salah coding” — menghancurkan kredibilitas Dinkes lebih parah daripada wabah itu sendiri. Validasi silang tiga sumber sebelum bicara ke publik.",
        type: "risk",
      },
      hints: [
        "Rasio = klaim / resep pada periode yang sama. Hitung untuk sebelum dan sesudah.",
        "Kenaikan klaim % = (sesudah − sebelum)/sebelum × 100. Lakukan hal yang sama untuk resep.",
        "Aturan: kenaikan klaim >20% DAN kenaikan resep <10% → “ya”, selain itu “tidak”.",
      ],
      code: {
        starter: `# Klaim TB: 120 -> 168/bln; resep OAT: 115 -> 121/bln\n# TULIS KODEMU: rasio_sesudah dan indikasi_upcoding\nrasio_sesudah = \nindikasi_upcoding = \nprint(f"rasio_sesudah={rasio_sesudah:.2f} upcoding={indikasi_upcoding}")`,
        lockLines: 1,
        solution: `# Klaim TB: 120 -> 168/bln; resep OAT: 115 -> 121/bln\ndef audit_kode(klaim_sebelum, klaim_sesudah, oat_sebelum, oat_sesudah):\n    rasio_sesudah = klaim_sesudah / oat_sesudah\n    naik_klaim = (klaim_sesudah - klaim_sebelum) / klaim_sebelum * 100\n    naik_oat = (oat_sesudah - oat_sebelum) / oat_sebelum * 100\n    flag = "ya" if (naik_klaim > 20 and naik_oat < 10) else "tidak"\n    return rasio_sesudah, naik_klaim, flag\nrasio_sesudah, kenaikan, indikasi_upcoding = audit_kode(120, 168, 115, 121)\nprint(f"rasio_sesudah={rasio_sesudah:.2f} kenaikan={kenaikan:.0f}% upcoding={indikasi_upcoding}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rasio_sesudah", value: 1.39, tol: 0.01, label: "`rasio_sesudah` seharusnya ≈ 1.39", msg: "168/121 — klaim tumbuh tanpa dukungan resep." },
          { kind: "contains", task: "t2", name: "indikasi_upcoding", value: "ya", label: "`indikasi_upcoding` seharusnya “ya”", msg: "Klaim +40%, resep +5% → pola upcoding, bukan wabah." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio_sesudah=1\\.39 kenaikan=40% upcoding=ya", label: "`print` menampilkan hasil audit", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Klaim TB naik 40%, resep OAT naik 5%, BTA positif naik 3%. Kesimpulan analis?",
          options: [
            { text: "Dugaan upcoding — validasi silang tidak mendukung wabah", why: "Benar: dua sumber independen (resep, lab) tidak ikut naik. Perilaku coding yang berubah.", correct: true },
            { text: "Wabah TB — laporkan ke media", why: "Satu kolom klaim tidak cukup untuk klaim wabah; itu cara tercepat kehilangan kredibilitas." },
            { text: "Data farmasi yang salah", why: "Tidak ada bukti farmasi salah; justru klaim yang butuh penjelasan." },
            { text: "Abaikan, fluktuasi biasa", why: "+40% bukan fluktuasi biasa — ia butuh penjelasan, dan penjelasannya administratif." },
          ],
        },
      ],
      reference: "Satu kolom kode tidak pernah cukup. Triangulasi: kode + resep + lab.",
    },
    {
      id: "migrasi-icd11",
      eyebrow: "Langkah 7 · Migrasi",
      title: "ICD-11, SATUSEHAT, dan code drift",
      prose: [
        "ICD-11 bukan sekadar ICD-10 dengan kode baru — ia mengubah cara diagnosis dikodekan: postcoordination, yaitu kode inti digabung kode ekstensi (mis. diabetes + tingkat keparahan + penyebab) sehingga satu konsep lama bisa memecah menjadi banyak kode baru. Migrasi tanpa kamus mapping yang tervalidasi menghasilkan diskontinuitas deret waktu: tren diabetes “naik” padahal yang naik jumlah kodenya, bukan pasiennya.",
        "Tiga pekerjaan analis saat migrasi: (a) bangun crosswalk ICD-10→ICD-11 dan ukur coverage — berapa persen kode lama terpetakan 1-ke-1 vs 1-ke-banyak vs tak terpetakan; (b) uji stabilitas deret waktu — bandingkan tren 12 bulan sebelum/sesudah dengan definisi fenotipe yang diselaraskan; (c) versioning — setiap tabel analisis wajib mencatat versi terminologi (mis. ICD-10 2019 vs ICD-11 2025) seperti mencatat versi library. Tanpanya, angka dua tahun tidak bisa dibandingkan.",
        "Konteks Indonesia: SATUSEHAT memakai HL7 FHIR sebagai amplop pertukaran, dan Kemenkes menerbitkan profil FHIR Indonesia (wajib antara lain NIK sebagai identifier dan kode ICD-10 untuk diagnosis). Artinya analis yang menarik data SATUSEHAT harus paham dua lapisan: struktur resource (Patient, Encounter, Condition) dan isi terminologi (kode apa di dalam Condition.code). Kebanyakan kegagalan integrasi bukan di API-nya — melainkan di kode yang tidak terstandar di dalamnya: “DM”, “Diabetes Mellitus”, “kencing manis” masuk sebagai teks bebas.",
        "Dan ada code drift: makna kode berubah diam-diam seiring waktu — definisi operasional bergeser, insentif klaim berubah, petugas berganti. Praktiknya: plot distribusi kode per kuartal dan pasang alert bila pangsa kode “mahal” bergeser >10% tanpa penjelasan klinis. Kode adalah data administratif yang berpura-pura menjadi data klinis — perlakukan ia sebagaimana mestinya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tanya insentifnya, triangulasi, curigai yang stabil",
        body: "Setiap kali melihat kode diagnosis, tanyakan: siapa yang diuntungkan bila kode INI yang tercatat, bukan kode itu? Kode yang menguntungkan rumah sakit (tarif lebih tinggi), memudahkan petugas (lebih cepat diketik), atau menenangkan pasien (stigma lebih rendah) akan muncul lebih sering daripada kebenaran klinisnya — bukan karena konspirasi, melainkan karena insentif bekerja diam-diam setiap hari. Heuristik kedua: aturan tiga sumber. Jangan percaya satu kolom kode sendirian; pasangkan selalu dengan dua sumber independen — kode diagnosis dengan resep obat dan hasil lab, seperti kasus TB di lesson ini. Bila ketiganya bercerita sama, tidurlah nyenyak; bila satu menyimpang, selidiki yang menyimpang itu dulu sebelum percaya dua yang akur. Heuristik ketiga: kode yang tidak pernah berubah justru mencurigakan — penyakit, insentif, dan petugas selalu berubah; distribusi kode yang datar sempurna selama tiga tahun biasanya berarti tidak ada yang mengawasi kualitasnya, bukan berarti kualitasnya sempurna. Tiga kebiasaan ini — tanya insentifnya, triangulasi tiga sumber, curigai yang terlalu stabil — mengubah kode dari jebakan menjadi kompas.",
      },
      quiz: [
        {
          q: "RS bermigrasi ke ICD-11 dan tren “diabetes dengan komplikasi” naik 22% dalam 3 bulan. Langkah pertama analis?",
          options: [
            { text: "Cek apakah kenaikan berasal dari pemecahan kode (postcoordination), bukan pasien baru", why: "Benar: ICD-11 memecah satu kode lama menjadi beberapa kode baru — tren “naik” bisa murni artefak mapping.", correct: true },
            { text: "Laporkan wabah diabetes ke Dinkes", why: "Jangan klaim epidemiologi dari artefak terminologi." },
            { text: "Tambah anggaran obat diabetes 22%", why: "Anggaran mengikuti pasien nyata, bukan jumlah kode." },
            { text: "Kembali ke ICD-10", why: "Mundur bukan solusi; yang dibutuhkan adalah fenotipe yang diselaraskan." },
          ],
        },
        {
          q: "Integrasi data SATUSEHAT gagal: diagnosis masuk sebagai teks bebas (“kencing manis”, “DM”). Lapisan mana yang bermasalah?",
          options: [
            { text: "Isi terminologi — amplop FHIR-nya benar, kodenya tidak terstandar", why: "Benar: FHIR = amplop; terminologi = isi surat. API jalan, tapi Condition.code berisi teks bebas.", correct: true },
            { text: "API FHIR-nya rusak", why: "Datanya sampai — masalahnya isi, bukan pengiriman." },
            { text: "Server Kemenkes down", why: "Tidak ada indikasi infrastruktur bermasalah." },
            { text: "ICD-11 belum dirilis", why: "Tidak relevan dengan teks bebas yang masuk." },
          ],
        },
      ],
      reference: "Catat versi terminologi seperti versi library. Kode = data administratif berkedok klinis.",
    },
    {
      id: "minicase-migrasi",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case 1: Migrasi ICD-10 → ICD-11 senilai Rp1,8 miliar",
      prose: [
        "RSUD tipe B menyiapkan migrasi ICD-10 ke ICD-11: anggaran Rp1,8 miliar untuk pelatihan 200 coder, update SIMRS, dan konsultan mapping. Direktur bertanya: “apa risiko terbesarnya, dan bagaimana kita tahu migrasinya berhasil?”",
        "Data awal: 14.200 kode ICD-10 aktif dipakai RS. Crosswalk awal: 62% terpetakan 1-ke-1 otomatis, 28% 1-ke-banyak (butuh pilihan coder), 10% tidak terpetakan (kode lokal). Uji coba 3 bulan di 2 poli: coder memilih kode pertama dari daftar dropdown pada 71% kasus (default bias); tren “diabetes dengan komplikasi” naik 22% — bukan karena pasien bertambah, melainkan ICD-11 memecah satu kode lama menjadi 4 kode baru yang semuanya terhitung.",
        "Pertanyaan: (1) metrik sukses migrasi apa yang kamu tetapkan? (2) bagaimana menangani 10% kode tak terpetakan? (3) berapa lama dual-coding (pencatatan kode ganda) dijalankan?",
        "Pembahasan: (1) coverage mapping ≥95% yang tervalidasi klinisi + stabilitas 10 indikator tren (selisih <5% sebelum/sesudah dengan fenotipe diselaraskan) + waktu coding per berkas tidak naik >15%. (2) Bentuk komite klinisi-coder; petakan manual 50 kode tersering dulu (Pareto — 50 kode mencakup ~80% volume), sisanya kode sementara berlabel “migrasi”. (3) Dual-coding minimal 6 bulan — tanpa periode tumpang tindih, deret waktu 2025 vs 2026 tidak bisa dibandingkan dan evaluasi program kesehatan daerah lumpuh setahun. Pelajaran: migrasi terminologi adalah proyek data, bukan proyek IT — yang gagal biasanya bukan servernya, melainkan makna kodenya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Migrasi tanpa dual-coding memutus deret waktu indikator kesehatan daerah selama setahun — Dinkes tidak bisa menjawab “apakah program kita bekerja?” untuk APBD berikutnya. Rp1,8 miliar untuk migrasi menjadi sia-sia bila angka sebelum/sesudah tidak comparable.",
        type: "risk",
      },
      reference: "Migrasi terminologi = proyek data. Dual-coding 6 bulan menjaga deret waktu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "ICD: klasifikasi diagnosis untuk billing/statistik (~14rb kategori).",
        "SNOMED CT: ontologi klinis 350rb+ konsep untuk dokumentasi presisi.",
        "LOINC untuk tes lab, RxNorm untuk obat, FHIR untuk pertukaran, OMOP untuk model data multi-situs.",
        "Kode billing dioptimasi untuk pembayaran — validasi silang sebelum jadi label klinis.",
        "Perubahan administratif (pelatihan coding, ganti tarif) meniru wabah/tren di data klaim.",
      ],
      next: { label: "HD3 — Insidens, Prevalensi, RR", href: "/learn/hd3-epidemiologi" },
      quiz: [
        {
          q: "E11 dalam ICD-10 adalah…",
          options: [
            { text: "Kode billing untuk diabetes tipe 2", why: "Benar: E11 = diabetes melitus tipe 2 di ICD-10. Ingat: ini kategori billing/statistik, bukan vonis klinis final.", correct: true },
            { text: "Kode LOINC untuk HbA1c", why: "HbA1c memakai LOINC 4548-4 — LOINC untuk tes lab, bukan diagnosis." },
            { text: "Resource FHIR untuk observasi", why: "Resource FHIR bernama Observation, bukan E11 — E11 adalah kode ICD." },
            { text: "Konsep SNOMED untuk pankreas", why: "SNOMED punya konsep sendiri (mis. 44054006 untuk DM tipe 2) — E11 adalah ICD." },
          ],
        },
        {
          q: "LOINC dipakai untuk menstandarkan…",
          options: [
            { text: "Nama tes laboratorium dan pengukuran klinis", why: "Benar: LOINC = lab & observasi. Obat = RxNorm, diagnosis = ICD/SNOMED.", correct: true },
            { text: "Diagnosis penyakit", why: "Diagnosis memakai ICD/SNOMED, bukan LOINC." },
            { text: "Nama obat", why: "Nama obat memakai RxNorm, bukan LOINC." },
            { text: "Struktur database", why: "Struktur database standar adalah OMOP CDM, bukan LOINC." },
          ],
        },
        {
          q: "OMOP CDM paling bernilai ketika…",
          options: [
            { text: "Banyak RS dengan skema berbeda ingin menjalankan analisis yang sama", why: "Benar: OMOP = common data model untuk riset multi-situs. Sekali mapping, satu query untuk semua.", correct: true },
            { text: "Satu RS menganalisis datanya sendiri", why: "Satu RS tidak butuh common data model — skemanya sudah satu." },
            { text: "Mengirim data via API", why: "Pengiriman via API adalah ranah FHIR, bukan OMOP." },
            { text: "Menghitung tarif INA-CBG", why: "Tarif memakai grouping INA-CBG dari kode ICD, bukan OMOP." },
          ],
        },
        {
          q: "Klaim TB naik 40% pasca pelatihan coding, tapi resep OAT dan BTA positif datar. Kesimpulan?",
          options: [
            { text: "Artefak perubahan perilaku coding, bukan kenaikan kasus sebenarnya", why: "Benar: triangulasi dengan sumber yang lebih dekat ke klinis (resep, lab) membatalkan hipotesis wabah.", correct: true },
            { text: "Wabah TB terkonfirmasi", why: "Wabah butuh konfirmasi klinis (BTA/resep) — keduanya datar, jadi bukan wabah." },
            { text: "Resep OAT tidak relevan", why: "Resep OAT justru sangat relevan: ia mengukur pengobatan TB yang sebenarnya terjadi." },
            { text: "Pelatihan coding menyebabkan TB", why: "Pelatihan mengubah cara mencatat, bukan menyebabkan penyakit — korelasi administratif, bukan kausal." },
          ],
        },
        {
          q: "Untuk proyek multi-RS, alokasi waktu harmonisasi yang wajar?",
          options: [
            { text: "30–50% waktu proyek — itu normal", why: "Benar: mapping ke LOINC/OMOP antar skema berbeda memang memakan sepertiga hingga setengah proyek.", correct: true },
            { text: "0% — data pasti langsung bisa digabung", why: "Skema, nama kolom, dan sistem kode tiap RS berbeda — penggabungan langsung pasti kacau." },
            { text: "5% — cukup di akhir pekan", why: "Meremehkan: harmonisasi adalah pekerjaan 80/20 yang menentukan kualitas." },
            { text: "100% — analisisnya tidak perlu", why: "Berlebihan: harmonisasi mendukung analisis, bukan menggantikannya." },
          ],
        },
      ],
    },
  ],
};
