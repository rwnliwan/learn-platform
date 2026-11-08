import type { V2Lesson } from "../lib/types";

export const hd11: V2Lesson = {
  slug: "hd11-wrangling-ehr",
  track: "Health Data Science",
  module: "Data Science Klinis",
  title: "HD11 Fenotipe & OMOP: Menjinakkan Data EHR Mentah",
  estMinutes: 65,
  steps: [
    {
      id: "tujuhbelas-definisi",
      eyebrow: "Langkah 1 · Fenotipe",
      title: "17 definisi “diabetes”",
      prose: [
        "Sebuah studi multi-RS ingin meneliti diabetes. RS A mendefinisikan: “ada kode E11”. RS B: “HbA1c ≥ 6,5%”. RS C: “ada resep metformin”. Hasil prevalensi: 4%, 11%, 7%. Studi yang sama, penyakit yang sama — tiga jawaban. Bukan karena populasinya beda, tapi karena definisinya beda.",
        "Di data EHR, “pasien diabetes” bukanlah fakta yang tinggal diambil — ia adalah konstruksi yang harus didefinisikan, ditulis sebagai aturan komputabel (fenotipe), dan divalidasi. Fenotipe komputabel: aturan eksplisit yang mengubah data EHR mentah menjadi label klinis. Contoh fenotipe diabetes tipe 2 — inklusi (salah satu): kode ICD E11, HbA1c ≥ 6,5% (LOINC 4548-4), resep metformin/insulin (RxNorm); eksklusi: kode kehamilan O24 (diabetes gestasional), usia < 18; tanggal index: kejadian inklusi pertama. Dua peringatan: (1) metformin juga dipakai untuk PCOS/prediabetes dan insulin juga untuk T1DM — obat saja sebagai inklusi adalah kriteria LEMAH, bukan bukti T2DM; fenotipe nyata butuh kombinasi sumber + validasi. (2) Kehamilan dengan kode E11 BUKAN otomatis diabetes gestasional — gestasional berkode O24, sedangkan T2DM yang sudah ada sebelum hamil tetap E11; “E11 + hamil = gestasional” adalah penyederhanaan yang salah secara klinis.",
        "Tanpa validasi, fenotipe sekadar tebakan berlabel. Validasi standar: ambil 50–200 chart acak, minta dokter menilai buta terhadap aturan, hitung PPV fenotipe (target ≥ 90%). Angka “kode E11 saja PPV ~62%, kombinasi lab+obat+eksklusi → 94%” di lesson ini ILUSTRATIF (contoh pengajaran, bukan hasil studi tertentu) — PPV nyata sangat bergantung pada populasi, cara coding RS, dan definisi gold standard; jangan kutip angka ini sebagai fakta. Yang benar secara umum: kode saja PPV-nya rendah; kombinasi sumber + chart review menaikkannya — SEBERAPA BESAR hanya bisa dijawab validasi di datamu sendiri. Definisi satu baris = label sampah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai kolom diagnosis EHR mentah langsung sebagai label. Kode EHR dibuat untuk billing dan alur kerja, bukan kebenaran — waspadai upcoding (kode diagnosis dilebihkan demi klaim lebih besar) dan rule-out coding (diagnosis tentatif untuk membenarkan pemeriksaan). Label butuh fenotipe: kombinasi kode + lab + obat + eksklusi + validasi chart review.",
        type: "pitfall",
      },
      reference: "Fenotipe = terjemahan klinik → logika boolean yang divalidasi.",
    },
    {
      id: "lab-fenotipe",
      eyebrow: "Langkah 2 · Lab fenotipe",
      title: "Terapkan aturan fenotipe diabetes",
      prose: [
        "Diberikan 8 pasien sintetis (kode, HbA1c, obat, status hamil, usia). Tulis fungsi `fenotipe(p)` yang mengembalikan True bila pasien memenuhi aturan T2DM: inklusi = ada kode E11 ATAU HbA1c ≥ 6,5 ATAU ada obat antidiabetik (metformin/insulin); eksklusi = hamil ATAU usia < 18.",
        "Perhatikan pasien jebakan: P5 punya E11 tapi hamil — dalam aturan SINTETIS lab ini, hamil = eksklusi (penyederhanaan pengajaran: kehamilan mengubah interpretasi glukosa; dalam praktik, E11 pada ibu hamil BUKAN otomatis diabetes gestasional — itu O24 — dan T2DM yang sudah ada sebelum hamil tetap E11); P7 punya E11 tapi usia 16 (eksklusi), P8 HbA1c-nya 6,4 — di bawah ambang 6,5.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `fenotipe(p)` sesuai aturan inklusi/eksklusi" },
        { id: "t2", text: "Bangun `hasil` = daftar id pasien yang lolos, dan `n_masuk` = jumlahnya" },
      ],
      expected: "hasil=['P1', 'P2', 'P3', 'P4']  n_masuk=4",
      note: {
        title: "Sering salah",
        body: "Lupa eksklusi: hanya menulis aturan inklusi lalu P5 (hamil) dan P7 (usia 16) ikut lolos. Eksklusi adalah setengah dari fenotipe. Catatan: dalam aturan sintetis lab ini `hamil` = eksklusi; dalam praktik, E11 pada ibu hamil BUKAN otomatis diabetes gestasional (itu O24) — T2DM yang sudah ada sebelum hamil tetap E11. Lab ini menyederhanakan demi mengajarkan pola inklusi/eksklusi, bukan mendefinisikan fenotipe klinis yang sebenarnya.",
        type: "pitfall",
      },
      hints: [
        "Inklusi memakai OR (atau): salah satu kondisi cukup.",
        "Eksklusi memakai AND NOT: kembalikan False bila hamil atau usia < 18.",
        "def fenotipe(p):\n    if p['hamil'] or p['usia'] < 18:\n        return False\n    return 'E11' in p['kode'] or p['hba1c'] >= 6.5 or any(o in ('metformin','insulin') for o in p['obat'])",
      ],
      code: {
        starter: `pasien = [\n    {"id": "P1", "kode": ["E11"], "hba1c": 7.2, "obat": ["metformin"], "hamil": False, "usia": 55},\n    {"id": "P2", "kode": ["E11"], "hba1c": 5.8, "obat": [], "hamil": False, "usia": 60},\n    {"id": "P3", "kode": [], "hba1c": 7.0, "obat": [], "hamil": False, "usia": 50},\n    {"id": "P4", "kode": [], "hba1c": 6.0, "obat": ["metformin"], "hamil": False, "usia": 45},\n    {"id": "P5", "kode": ["E11"], "hba1c": 8.1, "obat": ["insulin"], "hamil": True, "usia": 29},\n    {"id": "P6", "kode": ["J18.9"], "hba1c": 5.4, "obat": [], "hamil": False, "usia": 40},\n    {"id": "P7", "kode": ["E11"], "hba1c": 6.8, "obat": [], "hamil": False, "usia": 16},\n    {"id": "P8", "kode": [], "hba1c": 6.4, "obat": [], "hamil": False, "usia": 52},\n]\n\n# TULIS KODEMU: fungsi fenotipe T2DM\ndef fenotipe(p):\n    \n\nhasil = [p["id"] for p in pasien if fenotipe(p)]\nn_masuk = len(hasil)\nprint(f"hasil={hasil}  n_masuk={n_masuk}")`,
        lockLines: 11,
        solution: `pasien = [\n    {"id": "P1", "kode": ["E11"], "hba1c": 7.2, "obat": ["metformin"], "hamil": False, "usia": 55},\n    {"id": "P2", "kode": ["E11"], "hba1c": 5.8, "obat": [], "hamil": False, "usia": 60},\n    {"id": "P3", "kode": [], "hba1c": 7.0, "obat": [], "hamil": False, "usia": 50},\n    {"id": "P4", "kode": [], "hba1c": 6.0, "obat": ["metformin"], "hamil": False, "usia": 45},\n    {"id": "P5", "kode": ["E11"], "hba1c": 8.1, "obat": ["insulin"], "hamil": True, "usia": 29},\n    {"id": "P6", "kode": ["J18.9"], "hba1c": 5.4, "obat": [], "hamil": False, "usia": 40},\n    {"id": "P7", "kode": ["E11"], "hba1c": 6.8, "obat": [], "hamil": False, "usia": 16},\n    {"id": "P8", "kode": [], "hba1c": 6.4, "obat": [], "hamil": False, "usia": 52},\n]\n\n# TULIS KODEMU: fungsi fenotipe T2DM\ndef fenotipe(p):\n    if p["hamil"] or p["usia"] < 18:\n        return False\n    inklusi = "E11" in p["kode"] or p["hba1c"] >= 6.5\n    inklusi = inklusi or any(o in ("metformin", "insulin") for o in p["obat"])\n    return inklusi\n\nhasil = [p["id"] for p in pasien if fenotipe(p)]\nn_masuk = len(hasil)\nprint(f"hasil={hasil}  n_masuk={n_masuk}")`,
        checks: [
          { kind: "defined", task: "t1", name: "fenotipe", label: "`fenotipe` terdefinisi", msg: "Tulis fungsi bernama fenotipe yang menerima satu dict pasien." },
          { kind: "equal", task: "t2", name: "n_masuk", value: 4, tol: 0, label: "`n_masuk` seharusnya 4", msg: "Yang lolos: P1–P4. P5 hamil, P6 tidak memenuhi inklusi, P7 usia < 18, P8 HbA1c 6,4." },
          { kind: "contains", task: "t2", name: "hasil", value: "P3", label: "`hasil` memuat P3", msg: "P3 lolos lewat HbA1c 7,0 walau tanpa kode E11 — inklusi memakai OR." },
          { kind: "stdout_matches", task: "t2", pattern: "n_masuk=4", label: "`print` menampilkan n_masuk=4", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Inklusi = OR antar sumber; eksklusi = AND NOT. Versikan fenotipemu.",
    },
    {
      id: "omop-harmonisasi",
      eyebrow: "Langkah 3 · OMOP & harmonisasi",
      title: "Gudang standar dan jebakan satuan",
      prose: [
        "OMOP CDM (OHDSI) adalah skema standar untuk data observasional: tabel person, visit_occurrence, condition_occurrence, drug_exposure, measurement, procedure_occurrence. Semua kode dimapping ke concept_id standar — gudang dengan rak berlabel standar: barang dari RS mana pun ditaruh di rak yang sama. Untuk studi multi-RS yang reproducible, satu query OMOP jalan di semua situs.",
        "Tapi OMOP menstandarkan struktur dan kosakata, bukan kualitas isi. Dua jebakan tetap hidup. Pertama, unit: glukosa 180 mg/dL vs 10 mmol/L (faktor konversi 18) tanpa konversi akan dianggap dua nilai berbeda padahal sama. Aturan: mapping ke LOINC + konversi ke unit standar + simpan unit asli untuk audit.",
        "Kedua, waktu tak beraturan yang informatif (informed presence bias): pasien sakit diukur tiap jam, yang stabil tiap bulan — frekuensi pengukuran berkorelasi dengan keparahan. Data EHR seperti buku harian yang ditulis hanya saat ada drama. Agregasi naif memberi bobot berlebih pada periode krisis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira kalau datanya sudah di OMOP berarti sudah bersih. Kode yang salah tetap salah walau concept_id-nya standar; unit yang tidak dikonversi tetap campur. ETL ke OMOP adalah awal quality control, bukan akhir.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Glukosa 180 mg/dL vs 10 mmol/L tanpa konversi unit akan…",
          options: [
            { text: "Dianggap dua nilai berbeda padahal sama — merusak analisis", why: "Benar: 180/18 = 10. Harmonisasi unit via LOINC adalah langkah wajib, bukan opsional.", correct: true },
            { text: "Baik-baik saja", why: "Salah: tanpa konversi, model melihat dua pasien berbeda." },
            { text: "Otomatis terkonversi", why: "Tidak ada konversi otomatis — analis harus memetakan dan mengonversi eksplisit." },
            { text: "Hanya masalah tampilan", why: "Ini masalah nilai, bukan tampilan: statistiknya ikut salah." },
          ],
        },
      ],
      reference: "Mapping unit via LOINC; simpan unit asli. Frekuensi kunjungan = informasi, bukan noise.",
    },
    {
      id: "lab-agregasi",
      eyebrow: "Langkah 4 · Lab agregasi",
      title: "Rata-rata mentah vs agregasi per pasien",
      prose: [
        "Pasien A (krisis) gula darahnya diukur tiap jam: 24 pengukuran di angka 300. Pasien B (stabil) diukur tiap bulan: 12 pengukuran di angka 120. Hitung rata-rata mentah dari semua baris, lalu bandingkan dengan rata-rata dari agregasi per pasien (rata-rata tiap pasien dulu, baru dirata-ratakan).",
        "Rata-rata mentah memberi bobot berlebih pada pasien A — bukan karena ia lebih penting, melainkan karena ia lebih sering diukur. Inilah informed presence bias dalam bentuk paling sederhana.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata_mentah` dari semua pengukuran" },
        { id: "t2", text: "Hitung `rata_agregat` = rata-rata dari rata-rata tiap pasien" },
      ],
      expected: "rata_mentah=240.0  rata_agregat=210.0",
      note: {
        title: "Sering salah",
        body: "Langsung memakai rata-rata mentah untuk “rata-rata gula darah pasien”. Agregasi naif menggambarkan saat-saat terburuk (periode krisis yang sering diukur), bukan kondisi tipikal. Jika frekuensi pengukuran berkorelasi dengan keparahan, setiap agregasi sederhanamu bias.",
        type: "pitfall",
      },
      hints: [
        "Rata-rata mentah = jumlah semua nilai / jumlah semua baris.",
        "Agregasi per pasien = rata-rata dari (rata-rata A, rata-rata B).",
        "rata_mentah = sum(semua)/len(semua)\nrata_agregat = (sum(A)/len(A) + sum(B)/len(B))/2",
      ],
      code: {
        starter: `A = [300]*24  # pasien krisis: diukur tiap jam\nB = [120]*12  # pasien stabil: diukur tiap bulan\nsemua = A + B\n\n# TULIS KODEMU: rata-rata mentah vs agregasi per pasien\nrata_mentah = \nrata_agregat = \n\nprint(f"rata_mentah={rata_mentah:.1f}  rata_agregat={rata_agregat:.1f}")`,
        lockLines: 3,
        solution: `A = [300]*24  # pasien krisis: diukur tiap jam\nB = [120]*12  # pasien stabil: diukur tiap bulan\nsemua = A + B\n\n# TULIS KODEMU: rata-rata mentah vs agregasi per pasien\nrata_mentah = sum(semua)/len(semua)\nrata_agregat = (sum(A)/len(A) + sum(B)/len(B))/2\n\nprint(f"rata_mentah={rata_mentah:.1f}  rata_agregat={rata_agregat:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata_mentah", value: 240.0, tol: 1e-9, label: "`rata_mentah` seharusnya 240.0", msg: "(24×300 + 12×120)/36 = 240 — tertarik ke pasien yang sering diukur." },
          { kind: "equal", task: "t2", name: "rata_agregat", value: 210.0, tol: 1e-9, label: "`rata_agregat` seharusnya 210.0", msg: "(300 + 120)/2 = 210 — tiap pasien satu suara." },
          { kind: "stdout_matches", task: "t2", pattern: "rata_mentah=240\\.0\\s+rata_agregat=210\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Agregasi per episode/pasien dulu sebelum agregasi populasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: dari EHR mentah ke dataset analisis",
      prose: [
        "Lima situasi keputusan yang dihadapi analis setiap kali data rekam medis elektronik menjadi bahan analisis:",
        "Skenario 1 — “Butuh definisi kasus (fenotipe) untuk analisis?” → Jangan pakai kode ICD mentah — satu penyakit bisa punya 17 definisi operasional yang berbeda. Bangun fenotipe dari kombinasi kode + lab + obat + teks, lalu validasi dengan chart review pada sampel. Fenotipe yang tak divalidasi adalah tebakan yang mahal.",
        "Skenario 2 — “Gabung data dari banyak RS/sistem?” → Harmonisasi ke model data umum (OMOP CDM): petakan kode lokal ke konsep standar, dokumentasikan yang tak terpetakan. Tanpa harmonisasi, “diabetes” di RS A dan RS B adalah dua penyakit yang berbeda secara data.",
        "Skenario 3 — “Satu pasien tercatat di banyak sistem dengan identitas berbeda?” → Entity resolution / record linkage probabilistik (Fellegi-Sunter): bobotkan kecocokan nama, tanggal lahir, alamat — dan UKUR precision/recall linkage-nya. Linkage yang buruk menggandakan pasien atau menggabungkan dua orang menjadi satu.",
        "Skenario 4 — “Bangun model prediksi dari EHR?” → Tetapkan prediction time yang eksplisit, dan izinkan HANYA fitur yang tersedia sebelum titik itu. Curigai target leakage: contoh model sepsis AUC 0,97 yang fitur terkuatnya “kultur darah dipesan” dan “antibiotik diberikan” — keduanya adalah akibat kecurigaan dokter, bukan prediktor. AUC tinggi di EHR lebih sering berarti kebocoran daripada kecerdasan.",
        "Skenario 5 — “Label outcome diambil dari kode billing?” → Kode dibuat untuk penagihan, bukan kebenaran klinis. Fenotipe-kan label via kriteria klinis (mis. Sepsis-3/SOFA, bukan ICD mentah) dan validasi prospektif dalam silent mode sebelum deploy.",
        "Aturan praktis 10 detik: definisi kasus = fenotipe tervalidasi (bukan ICD mentah) → multi-sumber = harmonisasi OMOP → identitas ganda = record linkage terukur → model = prediction time + anti-leakage → label = kriteria klinis, bukan billing.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Percaya pada AUC 0,97 lalu deploy — padahal modelnya memprediksi masa lalu (fitur dari setelah kecurigaan klinis). Atau menggabung dua RS tanpa harmonisasi lalu melaporkan “tren nasional” yang sebenarnya artefak perbedaan coding. EHR menghukum yang malas mendefinisikan.",
        type: "pitfall",
      },
      reference: "Kurasi > kuantitas: 20 fitur yang dipahami mengalahkan 2.000 fitur mentah.",
    },
    {
      id: "minicase-sepsis",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Model sepsis yang “terlalu bagus”",
      prose: [
        "Tim RS membangun model prediksi sepsis dari EHR: prediction time = saat pasien masuk IGD (triase), target = sepsis dalam 24 jam ke depan, AUC 0,97. Semua antusias. Kamu diminta review sebelum deploy. Temuanmu: fitur terkuat adalah “kultur darah dipesan” dan “antibiotik spektrum luas diberikan” — keduanya terjadi SETELAH triase, yaitu setelah prediction time dan setelah dokter mencurigai sepsis. Label sepsis diambil dari kode ICD saat pulang.",
        "Dua cacat fatal. Pertama, target leakage: fitur “kultur darah” dan “antibiotik” adalah akibat kecurigaan klinis — model memprediksi masa lalu, bukan masa depan. AUC 0,97 adalah ilusi. Kedua, label berisik: kode ICD sepsis tidak andal (coding untuk billing; definisi Sepsis-3 butuh kriteria SOFA terfenotipe).",
        "Perbaikan: prediction time sudah dinyatakan di setup (saat triase) — maka auditnya sederhana: hanya pakai fitur yang tersedia SEBELUM triase; “kultur darah dipesan” dan “antibiotik diberikan” terjadi setelah triase, jadi keduanya harus dibuang. Bila tim ingin prediksi “6 jam sebelum kecurigaan”, nyatakan itu sebagai prediction time dan ulangi audit fitur terhadap titik baru itu. Label via kriteria Sepsis-3 terfenotipe (bukan ICD mentah), dan validasi prospektif silent-mode. Pelajaran: AUC tinggi pada data EHR lebih sering berarti kebocoran daripada kecerdasan. Kurasi > kuantitas: 20 fitur yang dipahami mengalahkan 2.000 fitur mentah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Mendeploy model sepsis bocor berarti sistem peringatan yang terlihat hebat di laporan tapi buta di lapangan — pasien sepsis sungguhan terlewat sementara tim percaya sudah terlindungi. Review leakage sebelum deploy adalah tanggung jawab analis, bukan opsional.",
        type: "risk",
      },
      reference: "Waspadai target leakage: fitur dari masa depan relatif terhadap prediction time.",
    },
    {
      id: "entity-resolution",
      eyebrow: "Langkah 7 · Entity resolution",
      title: "Satu pasien, tiga rekam: menyatukan identitas",
      prose: [
        "Pasien yang sama bisa muncul sebagai tiga baris berbeda: “Budi Santoso, 12-03-1978” di RS A; “Budi Santoso, 12-03-1978” di RS B (tanpa NIK); “B. Santoso, 03-12-1978” di lab (tanggal tertukar format). Tanpa NIK tunggal yang konsisten — realita di banyak fasyankes Indonesia — analis harus memutuskan: ini satu orang atau tiga orang? Salah gabung (false match) mencampur riwayat dua pasien; gagal gabung (missed match) memecah satu pasien menjadi “dua orang” — dan kedua kesalahan merusak analisis: duplikat menggelembungkan n, missed match menghilangkan longitudinalitas.",
        "Pendekatan klasiknya bernama Fellegi-Sunter (probabilistic record linkage). Idenya: tiap field yang cocok/tidak memberi BOBOT berbasis dua probabilitas — m = peluang field cocok bila memang pasangan sejati, u = peluang field cocok bila pasangan kebetulan. Bobot kecocokan = log(m/u): field langka yang cocok (NIK sama → m=0,99, u=0,001) memberi bobot raksasa +9,95; field umum yang cocok (nama “Siti” → u besar) bobotnya kecil. Ketidakcocokan pun berbobot: log((1−m)/(1−u)) — NIK beda memberi penalti berat −6,64. Jumlahkan semua bobot → skor pasangan; di atas ambang = match. Sebelum itu, blocking: bandingkan hanya pasangan dalam blok yang sama (mis. kode pos sama) agar 1 juta × 1 juta perbandingan menjadi feasible.",
        "Tiga jebakan praktis. Pertama, temporal alignment: setelah identitas menyatu, selaraskan WAKTU — tentukan index date (mis. diagnosis pertama), lookback window (riwayat 1 tahun sebelum index), dan censoring; dua rekam yang “menyatu” tetapi tanggalnya tumpang tindih tidak masuk akal harus ditandai, bukan didiamkan. Kedua, golden record: untuk tiap pasien gabungan, pilih nilai kanonik per field (aturan: sumber terpercaya menang, atau voting) — dan SIMPAN asal-usulnya untuk audit. Ketiga, evaluasi linkage: ambil sampel pasangan, nilai manual, hitung precision/recall linkage-mu. Linkage tanpa evaluasi = duplikasi yang tidak kamu ketahui — dan analisis di atasnya adalah istana di atas pasir.",
      ],
      formula: String.raw`w_{\text{cocok}} = \log_2\frac{m}{u} \qquad w_{\text{tak cocok}} = \log_2\frac{1-m}{1-u}`,
      formulaNote: "m = P(field cocok | pasangan sejati) — mis. nama pada pasangan sejati cocok 95% (m=0,95); u = P(field cocok | pasangan kebetulan) — dua orang acak bernama sama 2% (u=0,02). Contoh: nama cocok → w = log2(0,95/0,02) ≈ +5,57; NIK tak cocok (m=0,99, u=0,001) → w = log2(0,01/0,999) ≈ −6,64. Interpretasi: bobot mengukur 'kekuatan bukti' tiap field — field langka yang cocok adalah bukti kuat; field penting yang tak cocok adalah bukti kuat sebaliknya. Skor pasangan = jumlah semua bobot; di atas ambang (mis. 10) = match.",
      tasks: [],
      note: {
        title: "Intuisi: data EHR tidak dikumpulkan untukmu",
        body: "Praktisi data kesehatan yang berpengalaman membuka setiap proyek EHR dengan satu asumsi: data ini dikumpulkan untuk billing dan alur kerja, bukan untuk analisismu — dan setiap kolom punya penulis dengan insentif berbeda. Heuristik lapangannya: pertama, jangan percaya kolom diagnosis mentah — ia ditulis agar klaim dibayar (ingat upcoding dan rule-out coding); bangun fenotipe dari kode + lab + obat + eksklusi, lalu validasi dengan chart review. Kedua, perlakukan identitas pasien sebagai hipotesis, bukan fakta — sebelum agregasi apa pun, tanyakan “berapa persen baris di sini adalah duplikat orang yang sama?” dan ukur dengan linkage berevaluasi; satu pasien yang terpecah tiga mengacaukan analisis longitudinal lebih parah daripada 10% missing data. Ketiga, hormati waktu: frekuensi pengukuran adalah informasi (informed presence) — pasien yang diukur tiap jam sedang krisis, dan rata-rata mentahmu akan bercerita tentang krisis, bukan tentang pasien tipikal. Keempat, waspadai fitur dari masa depan — setiap kali AUC-mu terlihat terlalu bagus, cari kebocoran temporal sebelum merayakan; di EHR, kebocoran adalah penjelasan default untuk keajaiban. Empat kewaspadaan ini — fenotipe, identitas, waktu, kebocoran — adalah pembeda analis EHR senior dari yang baru pertama kali membuka dump database.",
      },
      reference: "Linkage: blocking → bobot Fellegi-Sunter → ambang → golden record → evaluasi. Identitas adalah hipotesis.",
    },
    {
      id: "lab-linkage",
      eyebrow: "Langkah 8 · Lab simulasi",
      title: "Beri skor pasangan rekam: match atau bukan?",
      prose: [
        "Implementasikan pembobotan Fellegi-Sunter untuk tiga kandidat pasangan rekam (SINTETIS): tiap field diberi (cocok?, m, u). Tulis fungsi `bobot` dan `skor`, jumlahkan bobot tiap pasangan, lalu klasifikasikan dengan ambang 10.",
        "Perhatikan pasangan C: dua field cocok termasuk NIK, tetapi nama tidak cocok — skornya 9,83, tipis di bawah ambang. Di dunia nyata, inilah pasangan yang dikirim ke review manual — ambang otomatis tidak boleh menjadi hakim tunggal untuk kasus perbatasan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `bobot(cocok, m, u)`: log2(m/u) bila cocok, log2((1−m)/(1−u)) bila tidak" },
        { id: "t2", text: "Lengkapi `skor(fields)`: jumlahkan bobot semua field" },
        { id: "t3", text: "Klasifikasikan tiap pasangan (MATCH bila skor ≥ 10); cetak skor + putusan" },
      ],
      expected: "A: skor=3.10 -> NON-MATCH\nB: skor=19.69 -> MATCH\nC: skor=9.83 -> NON-MATCH (review manual)",
      note: {
        title: "Sering salah",
        body: "Memakai ambang tunggal untuk semua konteks. Ambang linkage adalah keputusan biaya: false match (menggabung dua pasien) vs missed match (memecah satu pasien) — bobot kesalahannya beda untuk riset epidemiologi vs untuk pengiriman tagihan. Kalibrasi ambang pada sampel bervalidasi manual, dan kirim zona abu-abu ke review manusia.",
        type: "pitfall",
      },
      hints: [
        "Gunakan math.log2.",
        "bobot = math.log2(m/u) if cocok else math.log2((1-m)/(1-u))",
        "skor = sum(bobot(c, m, u) for c, m, u in fields)",
      ],
      code: {
        starter: `import math\n# Kandidat pasangan rekam — DATA SINTETIS; field: (cocok?, m, u) = nama, tgl_lahir, NIK\npasangan = [\n    {"id": "A", "field": [(True,0.95,0.02),(True,0.90,0.05),(False,0.99,0.001)]},\n    {"id": "B", "field": [(True,0.95,0.02),(True,0.90,0.05),(True,0.99,0.001)]},\n    {"id": "C", "field": [(False,0.95,0.02),(True,0.90,0.05),(True,0.99,0.001)]},\n]\nAMBANG = 10\n\n# TULIS KODEMU: bobot Fellegi-Sunter + klasifikasi\ndef bobot(cocok, m, u):\n    \n\ndef skor(fields):\n    \n\nfor ps in pasangan:\n    s = skor(ps["field"])\n    putusan = "MATCH" if s >= AMBANG else "NON-MATCH"\n    extra = " (review manual)" if ps["id"] == "C" else ""\n    print(f'{ps["id"]}: skor={s:.2f} -> {putusan}{extra}')`,
        lockLines: 8,
        solution: `import math\n# Kandidat pasangan rekam — DATA SINTETIS; field: (cocok?, m, u) = nama, tgl_lahir, NIK\npasangan = [\n    {"id": "A", "field": [(True,0.95,0.02),(True,0.90,0.05),(False,0.99,0.001)]},\n    {"id": "B", "field": [(True,0.95,0.02),(True,0.90,0.05),(True,0.99,0.001)]},\n    {"id": "C", "field": [(False,0.95,0.02),(True,0.90,0.05),(True,0.99,0.001)]},\n]\nAMBANG = 10\n\n# TULIS KODEMU: bobot Fellegi-Sunter + klasifikasi\ndef bobot(cocok, m, u):\n    return math.log2(m/u) if cocok else math.log2((1-m)/(1-u))\n\ndef skor(fields):\n    return sum(bobot(c, m, u) for c, m, u in fields)\n\nfor ps in pasangan:\n    s = skor(ps["field"])\n    putusan = "MATCH" if s >= AMBANG else "NON-MATCH"\n    extra = " (review manual)" if ps["id"] == "C" else ""\n    print(f'{ps["id"]}: skor={s:.2f} -> {putusan}{extra}')`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "A: skor=3\\.10 -> NON-MATCH", label: "Pasangan A: NON-MATCH", msg: "NIK tak cocok memberi penalti −6,64 — skor total 3,10." },
          { kind: "stdout_matches", task: "t3", pattern: "B: skor=19\\.69 -> MATCH", label: "Pasangan B: MATCH", msg: "Semua cocok termasuk NIK langka → 19,69." },
          { kind: "stdout_matches", task: "t3", pattern: "C: skor=9\\.83 -> NON-MATCH \\(review manual\\)", label: "Pasangan C: zona abu-abu", msg: "9,83 tipis di bawah ambang — kirim ke review manual, bukan keputusan otomatis." },
        ],
      },
      reference: "Field langka yang cocok = bukti kuat; field penting yang tak cocok = penalti berat. Ambang dikalibrasi, bukan ditebak.",
    },
    {
      id: "gap-g31-fenotip-sensitivitas",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G31)",
      title: "Fenotip itu pilihan: sensitivitas terhadap definisi dan ketidakpastiannya",
      prose: [
        "Satu kohort, tiga definisi fenotip, tiga prevalensi — dan ketiganya bisa dipertahankan. Pada 10.000 pasien, definisi longgar (kode ICD saja) menemukan 820 kasus diabetes (8,2%). Definisi sedang (ICD + hasil lab HbA1c) menemukan 650 kasus (6,5%). Definisi ketat (ICD + lab + obat antidiabetik) menemukan 510 kasus (5,1%). Selisih 310 pasien (dari 8,2% ke 5,1%) bukan error — ia adalah ketidakpastian definisi, dan ia lebih besar daripada kebanyakan efek yang ingin kamu ukur. Studi yang melaporkan prevalensi tanpa melaporkan sensitivitas terhadap definisi menyembunyikan ketidakpastian terbesarnya.",
        "Analisis sensitivitas fenotip punya tiga lapis. Lapis satu, definisi bertingkat seperti di atas: laporkan hasil utama pada definisi PRIMER yang ditetapkan sebelum analisis, dan laporkan hasil pada definisi longgar dan ketat sebagai sensitivitas. Bila kesimpulan (misal arah asosiasi) bertahan di ketiganya, ia robust; bila berbalik, kesimpulanmu bergantung pada definisi — dan itu temuan, bukan kegagalan. Lapis dua, validasi chart review: ambil sampel acak dari tiap definisi, baca rekam medisnya manual, hitung PPV. Misal definisi ketat punya PPV 0,91 (dari 100 kasus, 91 benar) sementara definisi longgar PPV-nya 0,78 — selisih itu mengukur harga yang dibayar untuk sensitivitas.",
        "Lapis tiga, ketidakpastian kuantitatif: laporkan prevalensi sebagai rentang antar-definisi (5,1% sampai 8,2%) dan, bila memakai fenotip sebagai outcome atau prediktor dalam model, jalankan quantitative bias analysis — misal dengan PPV dan sensitivitas fenotip yang diketahui, koreksi estimasi asosiasi terhadap misklasifikasi. Aturan yang tidak boleh dilanggar: definisi primer ditetapkan SEBELUM melihat hasil (pre-registration atau protokol tertulis); memilih definisi setelah melihat mana yang memberi hasil signifikan adalah p-hacking dengan baju fenotip.",
      ],
      formula: String.raw`\text{Prevalensi} \in [5{,}1\%,\, 8{,}2\%] \qquad \text{PPV} = \frac{\text{benar}}{\text{teridentifikasi}}`,
      formulaNote: "ICD saja 820 (8,2%); ICD+lab 650 (6,5%); ICD+lab+obat 510 (5,1%). PPV ketat 0,91 vs longgar 0,78.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai definisi fenotip yang sama untuk semua tujuan. Fenotip untuk skrining butuh sensitivitas tinggi (definisi longgar, tangkap semua); fenotip untuk asosiasi genetik butuh PPV tinggi (definisi ketat, sedikit false positive). Definisi yang benar bergantung pada pertanyaan — dan harus ditulis sebelum analisis.",
      },
      quiz: [
        {
          q: "Prevalensi diabetes 8,2% (ICD saja) vs 5,1% (ICD+lab+obat). Asosiasi obat X dengan diabetes signifikan pada definisi longgar, hilang pada definisi ketat. Kesimpulan?",
          options: [
            { text: "Kesimpulan bergantung pada definisi — laporkan keduanya dan selidiki misklasifikasi, jangan pilih yang signifikan", why: "Tepat: hasil yang berbalik antar-definisi adalah temuan sensitivitas; memilih definisi pasca-hoc = p-hacking.", correct: true },
            { text: "Pakai definisi longgar — sampel lebih besar berarti hasil lebih benar", why: "Salah: lebih besar belum tentu lebih benar; definisi longgar punya PPV lebih rendah (0,78) — false positive bisa menciptakan asosiasi palsu." },
            { text: "Pakai definisi ketat — PPV tertinggi selalu yang benar", why: "Salah: ketat kehilangan kasus sejati (sensitivitas lebih rendah); yang benar adalah melaporkan rentang dan PPV keduanya." },
            { text: "Rata-ratakan prevalensinya jadi 6,5% dan laporkan itu", why: "Salah: 6,5% adalah definisi sedang, bukan rata-rata; dan prevalensi bukan angka yang dirata-rata begitu saja." },
          ],
        },
      ],
      reference: "Fenotip = pilihan definisi: laporkan prevalensi per definisi (5,1–8,2%), validasi PPV via chart review, tetapkan definisi primer sebelum analisis.",
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
        "Fenotipe: aturan inklusi/eksklusi multi-sumber, berversi, tervalidasi chart review (target PPV ≥ 90%).",
        "OMOP CDM: skema standar untuk riset multi-situs yang reproducible.",
        "Harmonisasi: LOINC/RxNorm + konversi unit; simpan unit asli.",
        "Informed presence bias: frekuensi ukur ∼ keparahan — agregasi sadar-waktu.",
        "Waspadai target leakage dan label berisik sebelum percaya AUC.",
        "Linkage: bobot Fellegi-Sunter log2(m/u); ambang dikalibrasi + zona abu-abu ke review manual; identitas = hipotesis.",
      ],
      next: { label: "HD12 — TRIPOD & Kalibrasi", href: "/v2/learn/hd12-prediksi-klinis" },
      quiz: [
        {
          q: "Fenotipe komputabel adalah…",
          options: [
            { text: "Aturan eksplisit multi-sumber (kode+lab+obat+eksklusi) yang tervalidasi", why: "Benar: fenotipe = terjemahan klinik → logika boolean yang divalidasi. Kode mentah saja PPV-nya rendah.", correct: true },
            { text: "Kode ICD mentah", why: "Kode mentah PPV-nya rendah (angka 62% di lesson ini ilustratif) — penuh rule-out dan upcoding." },
            { text: "Diagnosis dokter", why: "Diagnosis dokter adalah intuisi klinis; fenotipe adalah versi komputabelnya." },
            { text: "Nama kolom database", why: "Nama kolom bukan definisi klinis." },
          ],
        },
        {
          q: "Informed presence bias artinya…",
          options: [
            { text: "Frekuensi pengukuran terkait keparahan — data lebih tebal untuk yang lebih sakit", why: "Benar: buku harian hanya ditulis saat ada drama. Model yang memakai frekuensi mentah memodelkan perilaku dokter.", correct: true },
            { text: "Dokter selalu benar", why: "Tidak ada hubungannya dengan bias ini." },
            { text: "Pasien informed consent", why: "Itu istilah etik persetujuan, bukan bias pengukuran." },
            { text: "Data selalu lengkap", why: "Terbalik: bias ini justru soal data yang timpang tebal-tipisnya." },
          ],
        },
        {
          q: "Untuk studi multi-RS yang reproducible, pilih…",
          options: [
            { text: "OMOP CDM", why: "Benar: OMOP = skema + kosakata standar → satu query jalan di semua situs.", correct: true },
            { text: "Tiap RS pakai skema sendiri", why: "Itu justru masalah yang ingin diselesaikan harmonisasi." },
            { text: "Kirim screenshot", why: "Bukan format analisis yang bisa diquery." },
            { text: "Gabung manual di Excel", why: "Tidak reproducible dan tidak skalabel untuk multi-RS." },
          ],
        },
        {
          q: "Validasi fenotipe yang tepat?",
          options: [
            { text: "Chart review sampel acak oleh klinisi, hitung PPV", why: "Benar: kebenaran klinis hanya bisa dinilai manusia yang membaca chart. Target PPV ≥ 90%.", correct: true },
            { text: "Percaya saja", why: "Tanpa validasi, fenotipe sekadar tebakan berlabel." },
            { text: "Tanya vendor EHR", why: "Vendor tahu sistemnya, bukan kebenaran klinis chart-mu." },
            { text: "Lihat jumlah kode", why: "Jumlah kode tidak mengukur kebenaran label." },
          ],
        },
        {
          q: "Fitur “antibiotik diberikan” untuk prediksi sepsis SEBELUM kecurigaan klinis adalah…",
          options: [
            { text: "Target leakage — terjadi setelah kecurigaan, memprediksi masa lalu", why: "Benar: fitur yang merupakan akibat dari yang diprediksi = kebocoran. AUC 0,97-nya ilusi.", correct: true },
            { text: "Fitur terbaik", why: "Terbaik secara statistik justru karena bocor — ia “tahu” jawabannya." },
            { text: "Wajib dipakai", why: "Memakainya berarti model memprediksi masa lalu." },
            { text: "Tidak masalah", why: "Ini masalah terbesar: leakage temporal." },
          ],
        },
      ],
    },
  ],
};
