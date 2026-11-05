#!/usr/bin/env python3
"""Health Data Scientist lessons HD11-HD15."""
from render import qa_scan

TRACK = "Health Data Scientist"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ HD11
HD11 = {
    "slug": "hd11-wrangling-ehr",
    "code": "HD11",
    "track": TRACK,
    "cover_title": "Fenotipe &amp; OMOP:<br />Menjinakkan Data EHR Mentah",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 17 Definisi \u201cDiabetes\u201d"),
        ("fenotipe", "Fenotipe \u2014 Si Penerjemah Klinik ke Kode"),
        ("omop", "OMOP CDM &amp; SQL Kohort"),
        ("harmonisasi", "Harmonisasi Unit &amp; Waktu Tak Beraturan"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Aturan Fenotipe Diabetes"),
        ("lab2", "\U0001f52c Lab 2: Agregasi Time Series Tak Beraturan"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menulis <strong>aturan fenotipe</strong> (definisi kohort komputabel) dari definisi klinis, dengan logika inklusi/eksklusi eksplisit.",
        "Menjelaskan struktur <strong>OMOP CDM</strong> (person, condition_occurrence, drug_exposure, measurement) dan menulis query kohort sederhana.",
        "Mengidentifikasi masalah <strong>harmonisasi unit</strong> dan <strong>time series tak beraturan</strong> pada data EHR.",
        "Mengevaluasi kualitas fenotipe via <strong>chart review / validasi silang</strong> sumber.",
    ],
    "story_title": "Cerita Pembuka: 17 Definisi \u201cDiabetes\u201d",
    "story": [
        "<p>Sebuah studi multi-RS ingin meneliti diabetes. RS A mendefinisikan: \u201cada kode E11\u201d. RS B: \u201cHbA1c \u2265 6,5%\u201d. RS C: \u201cada resep metformin\u201d. Hasil prevalensi: 4%, 11%, 7%. Studi yang sama, penyakit yang sama \u2014 tiga jawaban. Bukan karena populasinya beda, tapi karena <strong>definisinya</strong> beda.</p>",
        "<p>Di data EHR, \u201cpasien diabetes\u201d bukanlah fakta yang tinggal diambil \u2014 ia adalah <strong>konstruksi</strong> yang harus didefinisikan, ditulis sebagai aturan komputabel (fenotipe), dan divalidasi. Lesson ini tentang pekerjaan paling underrated dalam analitik kesehatan: mengubah catatan klinis menjadi variabel yang bisa dipercaya.</p>",
    ],
    "konsep": [
        {
            "id": "fenotipe",
            "title": "Fenotipe \u2014 Si Penerjemah Klinik ke Kode",
            "definisi": "<strong>Fenotipe komputabel</strong>: aturan eksplisit yang mengubah data EHR mentah menjadi label klinis (\u201cpasien diabetes\u201d = kode E11 ATAU HbA1c \u2265 6,5% ATAU resep antidiabetik, dengan eksklusi diabetes gestasional).",
            "kepribadian": "Fenotipe itu penerjemah antara dua bahasa: dokter berkata \u201cpasien ini DM\u201d (intuisi klinis), mesin butuh \u201cWHERE ... AND NOT ...\u201d (logika boolean). Penerjemah yang buruk = studi yang meneliti populasi yang salah.",
            "kapan": "Setiap kali mengambil kohort/outcome/kovariat dari EHR: definisikan tertulis, versikan, validasi \u2014 jangan query ad-hoc.",
            "worked": (
                "\U0001f4d0 Contoh: fenotipe \u201cDiabetes Tipe 2\u201d",
                "<p><strong>Inklusi</strong> (salah satu): kode ICD E11; HbA1c \u2265 6,5% (LOINC 4548-4); resep metformin/insulin (RxNorm).<br />"
                "<strong>Eksklusi:</strong> kode kehamilan (O24 = diabetes gestasional); usia < 18.<br />"
                "<strong>Tanggal index:</strong> kejadian inklusi pertama.<br />"
                "<strong>Validasi:</strong> ambil 50 chart acak, minta dokter nilai \u2014 hitung PPV fenotipe (target \u2265 90%).<br />"
                "Tanpa langkah validasi, ini sekadar tebakan berlabel.</p>",
            ),
            "chart": {
                "var": "hd11FenData",
                "data": [{"x": ["Hanya kode E11", "E11 ATAU HbA1c", "E11 ATAU HbA1c ATAU obat", "+ eksklusi gestasional"], "y": [62, 78, 91, 94], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["62%", "78%", "91%", "94%"], "textposition": "outside"}],
                "title": "PPV Fenotipe Diabetes vs Kompleksitas Aturan (ilustratif)",
                "layout": {"xaxis": {"title": "Definisi fenotipe"}, "yaxis": {"title": "PPV vs chart review (%)", "range": [0, 110]}, "showlegend": False},
                "cara": "Empat definisi dari sederhana (kiri) ke lengkap (kanan). Tinggi batang = PPV saat divalidasi dokter via chart review.",
                "interpretasi": "Hanya kode E11: PPV 62% \u2014 banyak salah label (upcoding, rule-out). Menambah lab + obat + eksklusi menaikkan ke 94%. Pelajaran mahal: <strong>definisi satu baris = label sampah</strong>; fenotipe yang baik adalah hasil iterasi validasi.",
            },
        },
        {
            "id": "omop",
            "title": "OMOP CDM &amp; SQL Kohort \u2014 Si Gudang Standar",
            "definisi": "<strong>OMOP CDM</strong> (OHDSI): skema standar untuk data observasional \u2014 tabel person, visit_occurrence, condition_occurrence, drug_exposure, measurement, procedure_occurrence, observation. Semua kode dimapping ke <strong>concept_id</strong> standar.",
            "kepribadian": "OMOP itu gudang dengan rak berlabel standar: barang dari pemasok manapun (RS manapun) ditaruh di rak yang sama. Analis tidak perlu tahu gudang asal \u2014 cukup tahu nomor rak.",
            "kapan": "Riset multi-situs, studi yang harus reproducible lintas institusi, atau membangun pipeline kohort yang tahan lama.",
            "worked": (
                "\U0001f4d0 Contoh: query kohort T2DM di OMOP (konseptual)",
                "<p>1. <strong>person</strong>: usia \u2265 18 saat index.<br />"
                "2. <strong>condition_occurrence</strong>: concept_id diabetes tipe 2 (atau descendant-nya).<br />"
                "3. <strong>measurement</strong>: HbA1c \u2265 6,5.<br />"
                "4. <strong>drug_exposure</strong>: metformin.<br />"
                "Gabungkan dengan logika fenotipe di atas; index date = min(tanggal kejadian).</p>",
            ),
            "code_display": ("sql",
                "-- Kohort T2DM sederhana di OMOP CDM\n"
                "SELECT DISTINCT p.person_id,\n"
                "       MIN(c.condition_start_date) AS index_date\n"
                "FROM person p\n"
                "JOIN condition_occurrence c ON c.person_id = p.person_id\n"
                "JOIN concept_ancestor ca\n"
                "  ON ca.descendant_concept_id = c.condition_concept_id\n"
                "WHERE ca.ancestor_concept_id = 201826  -- T2DM (standar)\n"
                "  AND p.year_of_birth <= EXTRACT(YEAR FROM c.condition_start_date) - 18\n"
                "GROUP BY p.person_id;"),
        },
        {
            "id": "harmonisasi",
            "title": "Harmonisasi Unit &amp; Waktu Tak Beraturan",
            "definisi": "EHR mencatat lab dalam <strong>unit berbeda</strong> (mg/dL vs mmol/L), nama lokal berbeda, dan <strong>waktu tak beraturan</strong> (pasien sakit diukur tiap jam, yang sehat tiap tahun) \u2014 pola kunjungan itu sendiri mengandung informasi (informed presence bias).",
            "rumus": r"x_{mmol/L} = \frac{x_{mg/dL}}{18} \quad \text{(glukosa)}",
            "simbol": [
                (r"x_{mg/dL}", "nilai glukosa dalam mg/dL (umum di Indonesia)"),
                (r"x_{mmol/L}", "nilai dalam mmol/L (standar internasional)"),
                (r"18", "faktor konversi glukosa (beda tiap analit!)"),
            ],
            "interpretasi": "Tanpa konversi, glukosa 180 mg/dL dan 10 mmol/L terlihat sebagai dua pasien berbeda padahal sama. Aturan: mapping ke LOINC + konversi ke unit standar + simpan unit asli untuk audit.",
            "worked": (
                "\U0001f4d0 Contoh: jebakan waktu tak beraturan",
                "<p>Model memprediksi kematian memakai \u201cjumlah pengukuran lab\u201d sebagai fitur \u2014 akurasinya tinggi! Ternyata: pasien sekarat diukur tiap jam, yang stabil tiap bulan. Fitur itu bukan sinyal biologis, melainkan <strong>sinyal perhatian dokter</strong> (informed presence).<br />"
                "Solusi: agregasi per jendela waktu (rata-rata/median per hari), atau jadikan frekuensi sebagai kovariat eksplisit \u2014 jangan biarkan model \u201cmenemukan\u201dnya diam-diam.</p>",
            ),
            "kepribadian": "Data EHR itu seperti buku harian yang ditulis hanya saat ada drama: makin seru hidupmu, makin tebal bukunya. Analis naif mengira tebal = penting; analis waspada tahu tebal = sering sakit.",
            "kapan": "Setiap pipeline EHR: (1) mapping unit via LOINC, (2) agregasi jendela waktu, (3) perlakukan frekuensi kunjungan sebagai informasi, bukan noise.",
            "warning": "<strong>Informed presence bias:</strong> frekuensi data \u223c tingkat keparahan. Model yang memakai \u201cjumlah kunjungan\u201d mentah sebagai fitur sedang memprediksi \u201csiapa yang sering ke dokter\u201d, bukan \u201csiapa yang sakit\u201d \u2014 kecuali itu memang pertanyaanmu.",
        },
    ],
    "myths": [
        ("Kolom diagnosis di EHR bisa langsung dipakai sebagai label",
         "Kode EHR dibuat untuk billing/alur kerja, bukan kebenaran (lihat HD2: upcoding, rule-out coding). Label butuh fenotipe: kombinasi kode + lab + obat + eksklusi + validasi chart review. Label mentah = label berisik = model berisik."),
        ("Kalau datanya sudah di OMOP berarti sudah bersih",
         "OMOP menstandarkan <em>struktur dan kosakata</em>, bukan kualitas isi. Kode yang salah tetap salah walau concept_id-nya standar; unit yang tidak dikonversi tetap campur. ETL ke OMOP adalah awal, bukan akhir, quality control."),
        ("Makin banyak fitur dari EHR makin bagus untuk model",
         "Fitur EHR penuh dengan kebocoran masa depan (lihat HD12: leakage) dan artefak proses (informed presence). 20 fitur yang dipahami > 2.000 fitur mentah. Kurasi > kuantitas."),
    ],
    "tips": [
        "Versikan fenotipemu seperti kode: <strong>\u201cT2DM v1.2 (2026-01-15)\u201d</strong> dengan changelog. Studi yang tidak bisa menyebut versi definisinya tidak reproducible.",
        "Untuk tiap measurement penting, buat <strong>tabel mapping unit</strong>: nama lokal \u2192 LOINC \u2192 unit standar \u2192 faktor konversi \u2192 contoh nilai wajar (range check). Ini mencegah 180 vs 10 tercampur.",
        "Selalu plot <strong>distribusi frekuensi kunjungan</strong> sebelum modeling. Jika prediktor kuatmu berkorelasi dengan frekuensi, kamu mungkin memodelkan perilaku dokter, bukan biologi pasien.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Terapkan Aturan Fenotipe Diabetes",
            "intro": "Diberikan 8 pasien sintetis (kode, HbA1c, obat, hamil). Terapkan aturan fenotipe T2DM dan lihat siapa yang masuk/keluar serta kenapa.",
            "hint": "Ubah threshold HbA1c 6.5 \u2192 7.0. Berapa pasien yang keluar? Itulah sensitivitas definisimu terhadap satu angka \u2014 dokumentasikan!",
            "code": (
                "pasien = [\n"
                "    {'id':'P1','kode':['E11'],'hba1c':7.2,'obat':['metformin'],'hamil':False,'usia':55},\n"
                "    {'id':'P2','kode':['R73.09'],'hba1c':6.8,'obat':[],'hamil':False,'usia':50},\n"
                "    {'id':'P3','kode':['E11'],'hba1c':5.9,'obat':[],'hamil':False,'usia':45},\n"
                "    {'id':'P4','kode':['O24'],'hba1c':7.5,'obat':['insulin'],'hamil':True,'usia':30},\n"
                "    {'id':'P5','kode':[],'hba1c':8.1,'obat':[],'hamil':False,'usia':60},\n"
                "    {'id':'P6','kode':['E10'],'hba1c':9.0,'obat':['insulin'],'hamil':False,'usia':25},\n"
                "    {'id':'P7','kode':['E11'],'hba1c':None,'obat':['metformin'],'hamil':False,'usia':16},\n"
                "    {'id':'P8','kode':['I10'],'hba1c':5.5,'obat':[],'hamil':False,'usia':58},\n"
                "]\n"
                "THR = 6.5\n"
                "for p in pasien:\n"
                "    inklusi = ('E11' in p['kode'] or (p['hba1c'] or 0) >= THR\n"
                "                or 'metformin' in p['obat'])\n"
                "    eksklusi = p['hamil'] or p['usia'] < 18 or 'E10' in p['kode']\n"
                "    status = 'T2DM' if (inklusi and not eksklusi) else 'bukan'\n"
                "    alasan = []\n"
                "    if eksklusi: alasan.append('eksklusi')\n"
                "    print(f\"{p['id']}: {status:<6} {'/'.join(alasan) if alasan else 'memenuhi inklusi' if inklusi else 'tak memenuhi inklusi'}\")\n"
                "print()\n"
                "print('P4: hamil -> eksklusi (gestasional). P6: E10 -> tipe 1, bukan T2DM.')\n"
                "print('P7: usia<18 -> eksklusi. P2: tanpa kode tapi HbA1c tinggi -> MASUK.')\n"
                "print('Fenotipe menangkap yang kode-saja lewatkan (P2, P5).')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Agregasi Time Series Tak Beraturan",
            "intro": "Pasien A (sakit, diukur tiap jam) vs B (stabil, tiap bulan). Agregasikan ke jendela harian (median) dan bandingkan dengan rata-rata mentah yang bias ke A.",
            "hint": "Lihat: rata-rata mentah didominasi pasien A (banyak titik). Agregasi harian + rata-rata per pasien memberi suara setara. Inilah informed presence bias secara kuantitatif.",
            "code": (
                "import statistics as st\n"
                "# (hari, nilai) \u2014 A diukur tiap jam saat krisis, B tiap bulan\n"
                "A = [(0, 180+i) for i in range(24)] + [(1, 150)]           # 25 titik\n"
                "B = [(0, 120), (30, 118), (60, 122)]                        # 3 titik\n"
                "mentah = [v for _, v in A+B]\n"
                "print(f'rata-rata MENTAH semua titik : {st.mean(mentah):.1f} <- didominasi A')\n"
                "# agregasi: median per hari per pasien, lalu rata-rata per pasien\n"
                "def agregasi(data):\n"
                "    harian = {}\n"
                "    for h, v in data:\n"
                "        harian.setdefault(h, []).append(v)\n"
                "    med_harian = [st.median(v) for v in harian.values()]\n"
                "    return st.mean(med_harian)\n"
                "print(f'A agregat harian: {agregasi(A):.1f}')\n"
                "print(f'B agregat harian: {agregasi(B):.1f}')\n"
                "print(f'rata-rata per PASIEN  : {(agregasi(A)+agregasi(B))/2:.1f} <- suara setara')\n"
                "print()\n"
                "print('Tanpa agregasi, model belajar: banyak diukur = sakit.')\n"
                "print('Itu benar secara statistik, menyesatkan secara klinis.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh label dari EHR \u2192 Tulis fenotipe + validasi",
            "kondisi": "Kohort, outcome, atau kovariat dari data operasional.",
            "alasan": "Kode mentah tidak cukup; butuh aturan multi-sumber + chart review.",
            "contoh": "Fenotipe T2DM: E11 ATAU HbA1c\u22656,5 ATAU obat, eksklusi gestasional.",
        },
        {
            "title": "Multi-situs / reproducible \u2192 OMOP CDM",
            "kondisi": "Banyak sumber atau studi harus bisa diulang orang lain.",
            "alasan": "Skema + kosakata standar; query portabel (jaringan OHDSI).",
            "contoh": "Studi efek obat lintas 5 RS dengan satu query.",
        },
        {
            "title": "Lab/obat nama lokal berantakan \u2192 Mapping LOINC/RxNorm + konversi unit",
            "kondisi": "Nilai sama, nama/satuan beda antar sumber.",
            "alasan": "Tanpa ini, 180 mg/dL dan 10 mmol/L jadi dua pasien berbeda.",
            "contoh": "Harmonisasi glukosa 3 RS sebelum analisis.",
        },
        {
            "title": "Pengukuran tak beraturan \u2192 Agregasi jendela + perlakukan frekuensi",
            "kondisi": "Frekuensi ukur terkait keparahan (hampir selalu).",
            "alasan": "Cegah informed presence bias; jadikan frekuensi kovariat eksplisit bila informatif.",
            "contoh": "Median harian untuk data ICU; frekuensi kunjungan sebagai fitur terpisah.",
        },
    ],
    "aturan10": [
        "Definisi kohort = fenotipe tertulis + berversi.",
        "Validasi dengan chart review (target PPV \u226590%).",
        "Mapping unit via LOINC; simpan unit asli.",
        "Frekuensi kunjungan = informasi, bukan noise.",
    ],
    "case": {
        "title": "Model Prediksi Sepsis yang \u201cTerlalu Bagus\u201d",
        "body": [
            "<p>Tim RS membangun model prediksi sepsis dari EHR: <strong>AUC 0,97</strong>. Semua antusias. Kamu diminta review sebelum deploy.</p>",
            "<p>Temuanmu: fitur terkuat adalah <strong>\u201ckultur darah dipesan\u201d</strong> dan <strong>\u201cantibiotik spektrum luas diberikan\u201d</strong> \u2014 keduanya terjadi <em>setelah</em> dokter mencurigai sepsis. Label sepsis diambil dari kode ICD saat pulang.</p>",
        ],
        "pertanyaan": "Apa yang salah dan bagaimana memperbaikinya?",
        "pembahasan": "Leakage temporal + label berisik. (1) Fitur \u201ckultur darah\u201d dan \u201cantibiotik\u201d adalah <em>akibat</em> kecurigaan klinis \u2014 model memprediksi masa lalu, bukan masa depan (target leakage). AUC 0,97 adalah ilusi. (2) Label ICD sepsis tidak andal (lihat HD2: coding untuk billing; definisi Sepsis-3 butuh SOFA). Perbaikan: definisikan prediction time yang jelas (mis. 6 jam sebelum kecurigaan), hanya pakai fitur yang tersedia <em>sebelum</em> titik itu, label via kriteria Sepsis-3 terfenotipe (bukan ICD mentah), dan validasi prospektif silent-mode. Pelajaran: AUC tinggi pada data EHR lebih sering berarti kebocoran daripada kecerdasan.",
    },
    "quiz": [
        ("Fenotipe komputabel adalah\u2026",
         ["Kode ICD mentah", "Aturan eksplisit multi-sumber (kode+lab+obat+eksklusi) yang terv alidasi untuk mendefinisikan kondisi klinis", "Diagnosis dokter", "Nama kolom database"],
         1,
         "Benar: fenotipe = terjemahan klinik \u2192 logika boolean yang divalidasi. Kode mentah saja PPV-nya rendah."),
        ("Glukosa 180 mg/dL vs 10 mmol/L tanpa konversi unit akan\u2026",
         ["Baik-baik saja", "Dianggap dua nilai berbeda padahal sama \u2014 merusak analisis", "Otomatis terkonversi", "Hanya masalah tampilan"],
         1,
         "Benar: 180/18 = 10. Harmonisasi unit via LOINC adalah langkah wajib, bukan opsional."),
        ("Informed presence bias artinya\u2026",
         ["Dokter selalu benar", "Frekuensi pengukuran terkait keparahan \u2014 data lebih tebal untuk yang lebih sakit", "Pasien informed consent", "Data selalu lengkap"],
         1,
         "Benar: buku harian hanya ditulis saat ada drama. Model yang memakai frekuensi mentah memodelkan perilaku dokter."),
        ("Untuk studi multi-RS yang reproducible, pilih\u2026",
         ["Tiap RS pakai skema sendiri", "OMOP CDM", "Kirim screenshot", "Gabung manual di Excel"],
         1,
         "Benar: OMOP = skema + kosakata standar \u2192 satu query jalan di semua situs."),
        ("Validasi fenotipe yang tepat?",
         ["Percaya saja", "Chart review sampel acak oleh klinisi, hitung PPV", "Tanya vendor EHR", "Lihat jumlah kode"],
         1,
         "Benar: kebenaran klinis hanya bisa dinilai manusia yang membaca chart. Target PPV \u2265 90%."),
        ("Fitur \u201cantibiotik diberikan\u201d untuk prediksi sepsis SEBELUM kecurigaan klinis adalah\u2026",
         ["Fitur terbaik", "Target leakage \u2014 terjadi setelah kecurigaan, memprediksi masa lalu", "Wajib dipakai", "Tidak masalah"],
         1,
         "Benar: fitur yang merupakan akibat dari yang diprediksi = kebocoran. AUC 0,97-nya ilusi."),
    ],
    "rangkuman": [
        "<strong>Fenotipe</strong>: aturan inklusi/eksklusi multi-sumber, berversi, tervalidasi chart review.",
        "Kode mentah saja PPV rendah \u2014 kombinasikan kode + lab + obat.",
        "<strong>OMOP CDM</strong>: skema standar untuk riset multi-situs yang reproducible.",
        "Harmonisasi: <strong>LOINC/RxNorm + konversi unit</strong>; simpan unit asli.",
        "<strong>Informed presence bias</strong>: frekuensi ukur \u223c keparahan \u2014 agregasi + perlakukan eksplisit.",
        "Waspadai <strong>target leakage</strong>: fitur dari masa depan relatif terhadap prediction time.",
        "Kurasi > kuantitas: 20 fitur dipahami > 2.000 fitur mentah.",
        "Lesson ini adalah \u201cpekerjaan kotor\u201d yang menentukan kualitas semua lesson pemodelan (HD12, HD20).",
    ],
    "prev": ("hd10-kausal-observasional", "HD10"),
    "next": ("hd12-prediksi-klinis", "HD12"),
}

# ================================================================ HD12
HD12 = {
    "slug": "hd12-prediksi-klinis",
    "code": "HD12",
    "track": TRACK,
    "cover_title": "TRIPOD &amp; Kalibrasi:<br />Model Prediksi yang Dipercaya Dokter",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Model 95% yang Ditolak Dokter"),
        ("kalibrasi", "Kalibrasi \u2014 Si Jujur tentang Keyakinan"),
        ("validasi", "Validasi: Internal, Temporal, Eksternal"),
        ("tripod", "TRIPOD &amp; Utilitas Klinis"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Kalibrasi vs Diskriminasi"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Drift Performa"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membedakan <strong>diskriminasi vs kalibrasi</strong> dan menjelaskan kenapa dokter butuh keduanya.",
        "Membaca <strong>calibration plot</strong> dan menghitung konsep <strong>Brier score</strong>.",
        "Merancang skema <strong>validasi</strong> yang benar (temporal/eksternal) dan menghindari leakage.",
        "Menilai <strong>utilitas klinis</strong> via decision curve dan melapor sesuai <strong>TRIPOD</strong>.",
    ],
    "story_title": "Cerita Pembuka: Model 95% yang Ditolak Dokter",
    "story": [
        "<p>Tim data science membangun model risiko readmission: <strong>akurasi 95%</strong>. Presentasi ke dokter: ditolak mentah-mentah. \u201cModelmu bilang pasien ini risiko 80%,\u201d kata dokter senior, \u201cTapi dari 10 pasien yang kamu bilang 80%, cuma 4 yang benar-benar readmit. <strong>Angkamu tidak bisa dipercaya.</strong>\u201d</p>",
        "<p>Model itu diskriminatif (bisa mengurutkan) tapi tidak terkalibrasi (angkanya bohong). Dokter tidak butuh ranking \u2014 mereka butuh <strong>probabilitas yang jujur</strong> untuk keputusan. Lesson ini tentang membuat model yang dipercaya, bukan sekadar yang menang leaderboard.</p>",
    ],
    "konsep": [
        {
            "id": "kalibrasi",
            "title": "Kalibrasi \u2014 Si Jujur tentang Keyakinan",
            "definisi": "<strong>Kalibrasi</strong>: kesesuaian probabilitas prediksi dengan frekuensi kejadian sebenarnya. Model terkalibrasi: dari semua pasien yang diprediksi 30%, memang ~30% yang kejadian. <strong>Diskriminasi</strong> (AUC): kemampuan mengurutkan (siapa lebih berisiko).",
            "rumus": r"\text{Brier} = \frac{1}{n}\sum_{i=1}^{n}(p_i - y_i)^2",
            "simbol": [
                (r"p_i", "probabilitas prediksi pasien i"),
                (r"y_i", "outcome aktual (1/0)"),
            ],
            "interpretasi": "Brier = rata-rata kuadrat selisih prediksi vs realita (makin kecil makin baik; 0 = sempurna). Ia menghukum <em>overconfidence</em>: prediksi 99% yang salah jauh lebih mahal dari prediksi 60% yang salah.",
            "worked": (
                "\U0001f4d0 Contoh: dua model, AUC sama, kalibrasi beda",
                "<p>Model A dan B: AUC sama 0,80. Pada 100 pasien berisiko prediksi 80%:<br />"
                "A: 78 benar-benar readmit \u2192 terkalibrasi baik.<br />"
                "B: 45 benar-benar readmit \u2192 overconfidence parah.<br />"
                "Dokter memakai B akan menghabiskan intervensi mahal untuk 55 pasien yang tak butuh. <strong>AUC tidak bisa membedakan A dan B \u2014 kalibrasi bisa.</strong></p>",
            ),
            "kepribadian": "Diskriminasi itu peramal yang bisa mengurutkan kuda balap; kalibrasi itu bandar yang jujur soal odds. Dokter butuh bandar jujur \u2014 karena mereka bertaruh dengan nyawa dan anggaran.",
            "kapan": "Setiap model probabilitas klinis: laporkan calibration plot (slope & intercept) + Brier, bukan hanya AUC.",
            "chart": {
                "var": "hd12CalData",
                "data": [{"x": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "y": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "type": "scatter", "mode": "lines", "name": "Ideal", "line": {"dash": "dash", "color": "#94a3b8"}},
                        {"x": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], "y": [0.25, 0.35, 0.42, 0.48, 0.52, 0.58, 0.65, 0.72, 0.8], "type": "scatter", "mode": "lines+markers", "name": "Model B", "line": {"color": "#e8a838"}}],
                "title": "Calibration Plot: Model B Overconfidence",
                "layout": {"xaxis": {"title": "Prediksi model"}, "yaxis": {"title": "Frekuensi aktual", "range": [0, 1]}, "showlegend": True},
                "cara": "Sumbu X = probabilitas yang diprediksi model, Y = proporsi kejadian sebenarnya pada kelompok itu. Garis putus-putus = kalibrasi sempurna.",
                "interpretasi": "Model B (kuning) di atas garis ideal pada prediksi rendah (meremehkan risiko kecil) dan di bawah pada prediksi tinggi (melebih-lebihkan risiko besar) \u2014 pola overconfidence klasik. Model seperti ini butuh rekalibrasi (Platt/isotonic) sebelum dipakai dokter.",
            },
        },
        {
            "id": "validasi",
            "title": "Validasi: Internal, Temporal, Eksternal \u2014 Tiga Ujian",
            "definisi": "<strong>Internal</strong>: split/bootstrapping dalam satu dataset. <strong>Temporal</strong>: latih masa lalu, uji masa depan (satu situs). <strong>Eksternal</strong>: uji di situs/populasi berbeda \u2014 ujian terberat dan paling dipercaya.",
            "kepribadian": "Validasi internal itu ujian di rumah sendiri (soal bocor ke pola lokal). Temporal itu ujian semester depan (populasi bergeser waktu). Eksternal itu pindah sekolah (sistem, dokter, pasien beda) \u2014 yang lulus di sini baru boleh dipamerkan.",
            "kapan": "Minimal: temporal. Ideal sebelum deploy: eksternal. Selalu: hindari leakage (lihat HD11) \u2014 fitur dari masa depan = nilai ujian palsu.",
            "worked": (
                "\U0001f4d0 Contoh: model readmission lolos internal, gagal eksternal",
                "<p>AUC internal 0,82 (RS A). Temporal (tahun berikutnya, RS A): 0,78. Eksternal (RS B): <strong>0,65</strong>.<br />"
                "Penyebab: RS B punya definisi discharge berbeda + populasi lebih tua + EHR beda kelengkapan.<br />"
                "Keputusan: JANGAN deploy di RS B tanpa rekalibrasi/retraining lokal. Inilah kenapa jurnal topik kini mewajibkan validasi eksternal (TRIPOD).<br />"
                "<strong>Drift:</strong> performa menurun seiring waktu karena populasi/protokol berubah \u2014 butuh monitoring berkala (lihat lab 2).</p>",
            ),
            "warning": "<strong>Leakage checklist sebelum validasi:</strong> (1) split berdasarkan WAKTU atau pasien (bukan baris!); (2) imputasi/scaling dihitung dari train saja; (3) tidak ada fitur yang baru tersedia setelah prediction time; (4) label tidak mengandung info masa depan.",
        },
        {
            "id": "tripod",
            "title": "TRIPOD &amp; Utilitas Klinis \u2014 Si Standar Lapor",
            "definisi": "<strong>TRIPOD</strong>: checklist pelaporan model prediksi (populasi, prediktor, outcome, validasi, performa). <strong>Decision curve analysis</strong>: mengukur <em>net benefit</em> model pada berbagai threshold \u2014 apakah memakai model lebih baik dari \u201cobati semua\u201d atau \u201cobati tak satu pun\u201d.",
            "rumus": r"\text{Net Benefit} = \frac{TP}{n} - \frac{FP}{n} \times \frac{p_t}{1-p_t}",
            "simbol": [
                (r"TP, FP", "true/false positive pada threshold p_t"),
                (r"p_t", "threshold probabilitas untuk bertindak"),
                (r"p_t/(1-p_t)", "bobot: seberapa mahal false positive relatif terhadap true positive"),
            ],
            "interpretasi": "Net benefit positif = model berguna pada threshold itu. Jika kurva model di bawah \u201cobati semua\u201d pada threshold operasionalmu, modelmu <em>merugikan</em> walau AUC-nya tinggi.",
            "worked": (
                "\U0001f4d0 Contoh: decision curve mengubah keputusan",
                "<p>Model readmission AUC 0,80. Threshold operasional 20% (intervensi mahal).<br />"
                "Net benefit model pada 20%: 0,05. \u201cObati semua\u201d pada 20%: 0,03. \u201cObati tak satu pun\u201d: 0.<br />"
                "Model menang \u2192 layak deploy. Tapi pada threshold 5% (intervensi murah), \u201cobati semua\u201d menang \u2192 model tidak berguna di sana.<br />"
                "<strong>Utilitas tergantung threshold operasional</strong> \u2014 bukan sifat model semata.</p>",
            ),
            "kepribadian": "TRIPOD itu notaris: memastikan semua yang penting tercatat sehingga orang lain bisa menilai dan mengulang. Decision curve itu akuntan klinis: menerjemahkan AUC menjadi \u201cberapa pasien terbantu per 100\u201d.",
            "kapan": "Setiap publikasi/laporan model klinis: ikuti TRIPOD (+AI untuk ML). Setiap klaim \u201cmodel siap pakai\u201d: tunjukkan decision curve pada threshold operasional.",
        },
    ],
    "myths": [
        ("AUC 0,9 = model siap dipakai dokter",
         "AUC hanya diskriminasi. Tanpa kalibrasi (angka jujur), validasi eksternal (generalisasi), dan decision curve (utilitas pada threshold operasional), AUC 0,9 bisa menjadi model yang merugikan. Dokter butuh probabilitas yang bisa dipercaya, bukan ranking."),
        ("Validasi silang 5-fold sudah cukup untuk klaim generalisasi",
         "CV menguji generalisasi ke <em>sampel baru dari populasi yang sama</em>. Ia buta terhadap pergeseran waktu (drift), perbedaan situs, dan perbedaan definisi. Untuk klaim \u201cberlaku di RS lain\u201d, butuh validasi eksternal sungguhan."),
        ("Model yang dulu bagus akan selamanya bagus",
         "Populasi menua, protokol berubah, EHR berganti, pandemi datang \u2014 performa model klinis meluruh (drift). Tanpa monitoring berkala + rencana retraining/rekalibrasi, model menjadi fosil yang dipercaya."),
    ],
    "tips": [
        "Selalu laporkan <strong>kalibrasi + diskriminasi + utilitas</strong> sebagai paket. Satu saja = setengah cerita. Template kalimat: \u201cAUC 0,80; calibration slope 0,95; net benefit positif pada threshold 10\u201330%.\u201d",
        "Pilih <strong>threshold dari biaya klinis</strong> (berapa mahal FP vs FN), bukan dari Youden index atau 0,5 default. Threshold adalah keputusan klinis-ekonomi, bukan statistik.",
        "Bangun <strong>monitoring drift</strong> sejak hari pertama deploy: tracking AUC/kalibrasi per bulan + alert. Model klinis tanpa monitoring = mobil tanpa spidometer.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Brier Score Menghukum Overconfidence",
            "intro": "Dua model dengan AUC sama: A terkalibrasi, B overconfident. Hitung Brier score keduanya dan buktikan angka menghukum yang sombong.",
            "hint": "Ubah overconfidence B (0.95/0.05) menjadi lebih ekstrem (0.99/0.01). Lihat Brier meledak \u2014 itulah harga keyakinan palsu.",
            "code": (
                "import random\n"
                "random.seed(4)\n"
                "n = 2000\n"
                "# model A: terkalibrasi (prediksi = probabilitas sebenarnya)\n"
                "# model B: overconfident (mendorong ke 0/1)\n"
                "brier = {'A': 0.0, 'B': 0.0}\n"
                "for _ in range(n):\n"
                "    p_true = random.random()*0.6 + 0.1       # risiko sebenarnya 10-70%\n"
                "    y = 1 if random.random() < p_true else 0\n"
                "    pA = p_true\n"
                "    pB = 0.95 if p_true > 0.4 else 0.05      # overconfident\n"
                "    brier['A'] += (pA - y)**2\n"
                "    brier['B'] += (pB - y)**2\n"
                "print(f\"Brier A (terkalibrasi) : {brier['A']/n:.4f}\")\n"
                "print(f\"Brier B (overconfident): {brier['B']/n:.4f}  <- lebih buruk!\")\n"
                "print()\n"
                "print('AUC keduanya bisa sama (urutan mirip), tapi Brier membedakan.')\n"
                "print('Dokter butuh A, bukan B.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Simulasi Drift \u2014 Model Menua",
            "intro": "Model dilatih saat prevalensi 20%. Simulasikan prevalensi naik ke 35% (populasi menua) dan lihat kalibrasi meluruh walau diskriminasi tetap.",
            "hint": "Inilah kenapa monitoring berkala wajib: AUC-mu bisa tetap 0,80 sementara angka yang keluar makin bohong. Solusi: rekalibrasi berkala.",
            "code": (
                "import random\n"
                "random.seed(8)\n"
                "def evaluasi(prevalensi, n=5000):\n"
                "    brier, tp = 0.0, 0\n"
                "    for _ in range(n):\n"
                "        sakit = random.random() < prevalensi\n"
                "        # model lama: skor terkalibrasi untuk prevalensi 20%\n"
                "        skor = 0.5 if sakit else 0.15\n"
                "        p = skor * (prevalensi/0.2) / (skor*(prevalensi/0.2) + (1-skor))\n"
                "        p_model = skor  # model TIDAK tahu prevalensi berubah\n"
                "        brier += (p_model - sakit)**2\n"
                "    return brier/n\n"
                "for prev in [0.20, 0.25, 0.30, 0.35]:\n"
                "    print(f'prevalensi {prev:.0%}: Brier = {evaluasi(prev):.4f}')\n"
                "print()\n"
                "print('Brier memburuk seiring prevalensi bergeser.')\n"
                "print('Diskriminasi (urutan) tetap; kalibrasi (angka) meluruh.')\n"
                "print('-> Jadwalkan rekalibrasi berkala, jangan deploy-dan-lupakan.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh probabilitas untuk keputusan \u2192 Kalibrasi dulu",
            "kondisi": "Output dipakai dokter/manajer untuk ambang tindakan.",
            "alasan": "Angka yang tidak jujur = keputusan yang salah arah.",
            "contoh": "Skor risiko readmission untuk alokasi perawat kunjungan rumah.",
        },
        {
            "title": "Butuh ranking/prioritas \u2192 Diskriminasi (AUC) cukup awal",
            "kondisi": "Hanya urutan yang penting (siapa duluan dikunjungi).",
            "alasan": "AUC mengukur kemampuan mengurutkan.",
            "contoh": "Daftar prioritas skrining dengan kapasitas terbatas.",
        },
        {
            "title": "Klaim siap deploy lintas RS \u2192 Validasi eksternal + decision curve",
            "kondisi": "Generalisasi adalah klaimnya.",
            "alasan": "Hanya eksternal yang menguji beda populasi/sistem; decision curve membuktikan manfaat.",
            "contoh": "Model sepsis untuk 10 RS jaringan.",
            "chart": {
                "var": "hd12DcData",
                "data": [{"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.015], "type": "scatter", "mode": "lines+markers", "name": "Model", "line": {"color": "#2a7de1"}},
                        {"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0.06, 0.045, 0.03, 0.015, 0.0, -0.02, -0.05], "type": "scatter", "mode": "lines+markers", "name": "Obati semua", "line": {"color": "#e8a838"}},
                        {"x": [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], "y": [0, 0, 0, 0, 0, 0, 0], "type": "scatter", "mode": "lines", "name": "Obati tak satu pun", "line": {"dash": "dash", "color": "#94a3b8"}}],
                "title": "Decision Curve: Net Benefit vs Threshold",
                "layout": {"xaxis": {"title": "Threshold probabilitas"}, "yaxis": {"title": "Net benefit"}, "showlegend": True},
                "cara": "Tiga kurva: biru = pakai model, kuning = obati semua orang, putus-putus = obati tak satu pun. Di tiap threshold, yang tertinggi = strategi terbaik.",
                "interpretasi": "Model (biru) menang pada threshold 5\u201330% \u2014 rentang operasional yang masuk akal. Di atas 35%, \u201cobati tak satu pun\u201d lebih baik (intervensi terlalu mahal untuk risiko setinggi itu). Inilah utilitas klinis: bukan \u201cmodel bagus?\u201d tapi \u201cmodel berguna pada threshold KITA?\u201d",
            },
        },
        {
            "title": "Model sudah deploy \u2192 Monitoring drift berkala",
            "kondisi": "Lingkungan berubah (populasi, protokol, EHR).",
            "alasan": "Performa meluruh diam-diam; deteksi dini mencegah kerugian.",
            "contoh": "Dashboard bulanan: AUC, calibration slope, distribusi skor.",
        },
    ],
    "aturan10": [
        "Laporkan kalibrasi + diskriminasi + utilitas, selalu paket.",
        "Threshold dari biaya klinis, bukan 0,5.",
        "Validasi eksternal sebelum klaim generalisasi.",
        "Monitoring drift sejak hari pertama deploy.",
    ],
    "case": {
        "title": "Skor Sepsis: AUC 0,88 Tapi Perawat Protes",
        "body": [
            "<p>Model prediksi sepsis AUC 0,88 dideploy di IGD. Sebulan kemudian perawat protes: \u201calert berbunyi terus, 9 dari 10 ternyata bukan sepsis \u2014 kami mulai mengabaikannya.\u201d (alert fatigue).</p>",
            "<p>Investigasi: threshold default 0,5; prevalensi sepsis di IGD 8%; PPV pada threshold itu hanya 12%.</p>",
        ],
        "pertanyaan": "Diagnosis masalahnya dan rancang perbaikan.",
        "pembahasan": "Masalah = threshold salah + PPV rendah pada prevalensi rendah (HD9!). AUC 0,88 tidak menjamin PPV baik. Perbaikan: (1) pilih threshold dari decision curve dengan bobot biaya alert fatigue (FP mahal karena mengikis kepercayaan); (2) naikkan threshold hingga PPV ~30\u201340% walau sensitivitas turun \u2014 alert yang dipercaya > alert yang sering; (3) tampilkan probabilitas terkalibrasi, bukan biner; (4) ukur outcome operasional: time-to-antibiotik, bukan cuma AUC. Pelajaran: model klinis gagal bukan karena statistiknya jelek, tapi karena thresholdnya buta operasional. Libatkan perawat SEBELUM deploy, bukan setelah protes.",
    },
    "quiz": [
        ("Perbedaan kalibrasi vs diskriminasi?",
         ["Sama saja", "Kalibrasi = kejujuran angka probabilitas; diskriminasi = kemampuan mengurutkan (AUC)", "Kalibrasi untuk regresi saja", "Diskriminasi tidak penting"],
         1,
         "Benar: dokter butuh keduanya \u2014 ranking untuk prioritas, angka jujur untuk keputusan."),
        ("Brier score menghukum terutama\u2026",
         ["Model lambat", "Overconfidence \u2014 prediksi ekstrem yang salah", "Model sederhana", "Data kecil"],
         1,
         "Benar: (p\u2212y)\u00b2 meledak saat p=99% tapi y=0. Kejujuran tentang ketidakpastian dihargai."),
        ("Model AUC 0,85 di RS A, 0,65 di RS B. Tindakan?",
         ["Deploy di B juga", "Jangan deploy di B tanpa investigasi/rekalibrasi \u2014 validasi eksternal gagal", "Rata-ratakan saja", "Buang modelnya"],
         1,
         "Benar: generalisasi tidak terbukti. Cari penyebab (populasi, definisi, EHR) sebelum pakai."),
        ("Decision curve menunjukkan model kalah dari \u201cobati semua\u201d pada threshold operasional. Artinya?",
         ["Model tetap bagus karena AUC tinggi", "Model merugikan pada threshold itu \u2014 jangan pakai di sana", "Threshold salah hitung", "Abaikan saja"],
         1,
         "Benar: utilitas klinis ditentukan threshold operasional, bukan AUC. Model bisa akurat tapi tak berguna."),
        ("Leakage yang paling sering di model EHR?",
         ["Data terlalu sedikit", "Fitur yang baru tersedia SETELAH prediction time (mis. obat yang diberi setelah kecurigaan)", "Model terlalu kompleks", "Terlalu banyak validasi"],
         1,
         "Benar: target leakage \u2014 memprediksi masa lalu. Tetapkan prediction time eksplisit dan bekukan fitur di sana."),
        ("TRIPOD adalah\u2026",
         ["Model machine learning baru", "Checklist pelaporan model prediksi agar transparan dan reproducible", "Tes diagnostik", "Regulasi obat"],
         1,
         "Benar: standar pelaporan (populasi, prediktor, outcome, validasi, performa). TRIPOD+AI untuk model ML."),
    ],
    "rangkuman": [
        "<strong>Kalibrasi</strong> (kejujuran angka) sama pentingnya dengan <strong>diskriminasi</strong> (AUC).",
        "<strong>Brier score</strong> menghukum overconfidence; calibration plot menampakkannya.",
        "Validasi: <strong>internal < temporal < eksternal</strong>. Klaim generalisasi butuh eksternal.",
        "Cegah <strong>leakage</strong>: prediction time eksplisit, fitur dibekukan sebelumnya.",
        "<strong>Decision curve</strong>: net benefit pada threshold operasional = bukti utilitas.",
        "Threshold dari <strong>biaya klinis</strong>, bukan default 0,5.",
        "Waspadai <strong>drift</strong>: monitoring berkala + rencana rekalibrasi.",
        "Lapor sesuai <strong>TRIPOD</strong>; libatkan klinisi sebelum deploy.",
    ],
    "prev": ("hd11-wrangling-ehr", "HD11"),
    "next": ("hd13-fairness-kesehatan", "HD13"),
}

# ================================================================ HD13
HD13 = {
    "slug": "hd13-fairness-kesehatan",
    "code": "HD13",
    "track": TRACK,
    "cover_title": "Fairness di Kesehatan:<br />Ketika AI Memihak",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Skor yang Rasis"),
        ("bias", "Dari Mana Bias Datang"),
        ("metrik", "Metrik Fairness &amp; Trade-off"),
        ("mitigasi", "Mitigasi &amp; Explainability"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Audit Disparitas Model"),
        ("lab2", "\U0001f52c Lab 2: Threshold per Grup vs Satu Threshold"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan 4 sumber bias AI kesehatan (<strong>data, label, representasi, deployment</strong>) dengan contoh nyata.",
        "Menghitung <strong>disparitas metrik antar grup</strong> (TPR, PPV, kalibrasi) dari output model.",
        "Menjelaskan mengapa <strong>metrik fairness bisa saling bertentangan</strong> (impossibility).",
        "Merancang <strong>strategi mitigasi</strong> per tahap (pre/in/post-processing) + explainability untuk klinisi.",
    ],
    "story_title": "Cerita Pembuka: Skor yang Rasis",
    "story": [
        "<p>2019, jurnal Science: algoritma yang dipakai RS AS untuk memprioritaskan perawatan <strong>meremehkan kebutuhan pasien kulit hitam secara sistematis</strong>. Penyebabnya bukan programmer rasis \u2014 melainkan label: model memprediksi <em>biaya kesehatan</em> sebagai proksi <em>kebutuhan kesehatan</em>. Karena pasien kulit hitam secara historis menerima layanan lebih sedikit (biaya lebih rendah), model menyimpulkan mereka \u201ckurang butuh\u201d.</p>",
        "<p>Label yang terlihat netral (\u201cbiaya\u201d) membawa sejarah ketidakadilan ke dalam model. Di Indonesia, versi lokalnya: model yang dilatih di RS swasta Jakarta bisa gagal total untuk pasien puskesmas Papua \u2014 bukan karena AI jahat, tapi karena dunianya beda. Lesson ini tentang cara mengaudit keadilan sebelum AI menyakiti yang paling rentan.</p>",
    ],
    "konsep": [
        {
            "id": "bias",
            "title": "Dari Mana Bias Datang \u2014 Empat Pintu Masuk",
            "definisi": "<strong>Bias data</strong>: siapa yang tercatat (RS swasta \u2260 puskesmas). <strong>Bias label</strong>: proksi yang membawa sejarah (biaya \u2260 kebutuhan). <strong>Bias representasi</strong>: grup minoritas sedikit di training. <strong>Bias deployment</strong>: dipakai di populasi/waktu berbeda.",
            "kepribadian": "Bias itu seperti air: masuk lewat celah terkecil \u2014 celah pengumpulan, celah label, celah sampel, celah pemakaian. Menambal satu celah sambil mengabaikan tiga lainnya = tetap banjir.",
            "kapan": "Audit fairness: periksa keempat pintu BERURUTAN sebelum menyentuh metrik. Kebanyakan kasus nyata (termasuk Science 2019) akarnya di label, bukan di algoritma.",
            "worked": (
                "\U0001f4d0 Contoh: empat pintu di model rujukan Indonesia",
                "<p><strong>Data:</strong> training dari 3 RS swasta Jakarta \u2192 tidak mewakili puskesmas timur Indonesia.<br />"
                "<strong>Label:</strong> \u201crujukan disetujui\u201d sebagai proksi kebutuhan \u2014 padahal persetujuan terkait asuransi & jarak.<br />"
                "<strong>Representasi:</strong> pasien >70 tahun hanya 3% data.<br />"
                "<strong>Deployment:</strong> dipakai di RSUD dengan case-mix beda total.<br />"
                "Hasil: model menolak rujukan yang seharusnya diterima \u2014 merugikan yang paling jauh dari Jakarta.</p>",
            ),
            "chart": {
                "var": "hd13BiasData",
                "data": [{"x": ["Jakarta swasta", "Jawa RSUD", "Luar Jawa RSUD", "Puskesmas timur"], "y": [45, 30, 18, 7], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "30%", "18%", "7%"], "textposition": "outside"}],
                "title": "Komposisi Data Training vs Populasi Target (ilustratif)",
                "layout": {"xaxis": {"title": "Sumber"}, "yaxis": {"title": "% data training", "range": [0, 55]}, "showlegend": False},
                "cara": "Batang = proporsi data training dari tiap sumber. Bandingkan dengan populasi target nasional (yang seharusnya ~merata/demografis).",
                "interpretasi": "45% data dari RS swasta Jakarta yang melayani <10% populasi. Model belajar \u201cnormal\u201d = pasien Jakarta swasta. Saat dipakai di puskesmas timur (7% data), ia buta. Representasi bukan soal politik \u2014 soal validitas statistik.",
            },
        },
        {
            "id": "metrik",
            "title": "Metrik Fairness &amp; Trade-off \u2014 Si Mustahil Sempurna",
            "definisi": "<strong>Demographic parity</strong>: tingkat positif sama antar grup. <strong>Equalized odds</strong>: TPR & FPR sama antar grup. <strong>Kalibrasi per grup</strong>: angka jujur di tiap grup. <strong>Teorema impossibility</strong>: bila base rate beda, ketiganya <strong>tidak bisa</strong> dipenuhi bersamaan (kecuali sempurna/acak).",
            "rumus": r"\text{Disparitas TPR} = |TPR_{grup A} - TPR_{grup B}|",
            "simbol": [
                (r"TPR", "true positive rate: dari yang benar-benar butuh, berapa yang tertangkap"),
                (r"\text{Disparitas}", "selisih antar grup \u2014 makin kecil makin adil menurut metrik ini"),
            ],
            "interpretasi": "Tidak ada metrik tunggal yang benar \u2014 pilih sesuai nilai klinis: untuk alokasi perawatan, equalized odds (kesempatan terdeteksi sama) lebih relevan dari demographic parity.",
            "worked": (
                "\U0001f4d0 Contoh: impossibility dalam angka",
                "<p>Dua grup, base rate butuh-perawatan: A=10%, B=30%. Model sempurna terkalibrasi per grup.<br />"
                "Demographic parity menuntut tingkat rujukan SAMA \u2192 melanggar kalibrasi (salah satu grup dirujuk berlebihan/kurang).<br />"
                "Equalized odds + kalibrasi bisa jalan, tapi parity dikorbankan.<br />"
                "<strong>Pelajaran:</strong> jangan kejar semua metrik \u2014 pilih yang sesuai misi klinis dan nyatakan trade-off-nya eksplisit.</p>",
            ),
            "kepribadian": "Metrik fairness itu seperti tiga orang yang menarik selimut: menutupi satu membuka yang lain. Tugasmu bukan memuaskan ketiganya \u2014 tapi memilih siapa yang boleh kedinginan, dan mempertanggungjawabkannya.",
            "kapan": "Audit model: hitung TPR/FPR/PPV/kalibrasi PER GRUP (etnis, gender, usia, wilayah, asuransi). Pilih metrik primer sesuai konteks klinis.",
        },
        {
            "id": "mitigasi",
            "title": "Mitigasi &amp; Explainability \u2014 Si Tukang Perbaiki",
            "definisi": "<strong>Pre-processing</strong>: perbaiki data/label (reweight, ganti proksi). <strong>In-processing</strong>: fairness constraint saat training. <strong>Post-processing</strong>: threshold per grup. <strong>Explainability</strong> (SHAP): tunjukkan alasan prediksi ke klinisi \u2014 transparansi memungkinkan contestability.",
            "kepribadian": "Mitigasi itu seperti memperbaiki rumah bocor: pre = perbaiki atap (data), in = pasang talang saat bangun (training), post = taruh ember (threshold). SHAP itu jendela kaca: penghuni (klinisi) bisa melihat ke dalam dan protes bila ada yang aneh.",
            "kapan": "Mulai dari pre (akar masalah); post-processing bila model sudah jadi dan terkunci. SHAP selalu untuk model klinis \u2014 dokter berhak tahu \u201ckenapa\u201d.",
            "worked": (
                "\U0001f4d0 Contoh: memperbaiki kasus skor rujukan",
                "<p><strong>Pre:</strong> ganti label \u201cbiaya\u201d \u2192 \u201ckebutuhan klinis\u201d (HbA1c tak terkontrol + komorbid). Tambah data puskesmas.<br />"
                "<strong>In:</strong> constraint equalized odds saat training.<br />"
                "<strong>Post:</strong> threshold rujukan per wilayah agar TPR setara.<br />"
                "<strong>SHAP:</strong> dokter melihat \u201cskor tinggi karena: HbA1c 11% + riwayat stroke\u201d \u2014 masuk akal, dipercaya.<br />"
                "Hasil: disparitas TPR 25% \u2192 4%, dengan penurunan AUC hanya 0,01.</p>",
            ),
            "warning": "<strong>Batasan SHAP:</strong> menjelaskan model, bukan kebenaran kausal. Fitur penting di SHAP bisa jadi proksi bias (mis. \u201ckode pos\u201d sebagai proksi etnis/ekonomi). Explainability membantu menemukan bias \u2014 bukan sertifikat keadilan.",
        },
    ],
    "myths": [
        ("Menghapus variabel sensitif (etnis, gender) membuat model adil",
         "Justru sebaliknya seringnya: model mempelajari proksi (kode pos, nama, bahasa) yang berkorelasi dengan variabel sensitif \u2014 kini tanpa bisa diaudit per grup karena grupnya \u201ctidak ada\u201d. Fairness butuh mengukur per grup, yang butuh datanya. \u201cButa\u201d \u2260 \u201cadil\u201d."),
        ("Fairness hanya soal etnis/gender",
         "Di Indonesia, disparitas paling tajam sering berbentuk <strong>wilayah dan kelas faskes</strong>: model Jakarta vs Papua, RS swasta vs puskesmas. Audit fairness harus mencakup dimensi yang relevan lokal \u2014 bukan template AS."),
        ("Trade-off akurasi vs fairness selalu besar",
         "Pada banyak kasus nyata, mitigasi menurunkan AUC < 0,02 sambil memangkas disparitas drastis. Trade-off besar biasanya tanda masalahnya di label/data (pre-processing) \u2014 perbaiki akarnya, bukan terima trade-off-nya."),
    ],
    "tips": [
        "Audit fairness <strong>sebelum</strong> optimasi akurasi. Menemukan bias setelah deploy = skandal; menemukannya saat development = engineering.",
        "Selalu tampilkan metrik <strong>per grup</strong> di dashboard monitoring, bukan cuma agregat. Agregat menyembunyikan penderitaan minoritas \u2014 secara matematis.",
        "Libatkan <strong>komunitas yang terdampak</strong> dalam menentukan metrik fairness. Pilihan metrik adalah pilihan nilai \u2014 bukan keputusan teknis semata.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Audit Disparitas Model Rujukan",
            "intro": "Model memprediksi butuh-rujukan. Hitung TPR, FPR, PPV per grup (kota vs timur). Buktikan agregat menipu.",
            "hint": "Ubah threshold 0.5 \u2192 0.3. Perhatikan disparitas TPR berubah \u2014 threshold netral tidak netral dampaknya.",
            "code": (
                "# (grup, skor, butuh_rujukan? 1/0)\n"
                "import random\n"
                "random.seed(6)\n"
                "data = []\n"
                "for _ in range(2000):\n"
                "    timur = random.random() < 0.3\n"
                "    butuh = random.random() < (0.30 if timur else 0.15)\n"
                "    # model: sedikit bias \u2014 skor timur diredam (kurang terwakili di training)\n"
                "    skor = (0.7 if butuh else 0.2) + random.gauss(0, 0.15) - (0.12 if timur else 0)\n"
                "    data.append((timur, skor, butuh))\n"
                "THR = 0.5\n"
                "print(f\"{'grup':<8} {'TPR':>6} {'FPR':>6} {'PPV':>6}\")\n"
                "for timur, nama in [(False, 'kota'), (True, 'timur')]:\n"
                "    g = [d for d in data if d[0] == timur]\n"
                "    tp = sum(1 for _, s, b in g if s >= THR and b == 1)\n"
                "    fn = sum(1 for _, s, b in g if s < THR and b == 1)\n"
                "    fp = sum(1 for _, s, b in g if s >= THR and b == 0)\n"
                "    tn = sum(1 for _, s, b in g if s < THR and b == 0)\n"
                "    print(f'{nama:<8} {tp/(tp+fn):>6.0%} {fp/(fp+tn):>6.0%} {tp/(tp+fp):>6.0%}')\n"
                "print()\n"
                "print('TPR timur jauh lebih rendah: yang butuh di timur lebih sering terlewat.')\n"
                "print('Agregat menyembunyikan ini. Audit per grup = wajib.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Threshold per Grup \u2014 Menyamakan TPR",
            "intro": "Cari threshold per grup agar TPR setara (equalized odds). Lihat harga yang dibayar (FPR naik di satu grup) \u2014 trade-off impossibility secara langsung.",
            "hint": "Inilah dilema nyata: keadilan (TPR setara) vs efisiensi (FPR rendah). Tidak ada jawaban teknis \u2014 ini keputusan nilai. Diskusikan dengan klinisi, jangan putuskan sendiri.",
            "code": (
                "import random\n"
                "random.seed(6)\n"
                "data = []\n"
                "for _ in range(4000):\n"
                "    timur = random.random() < 0.3\n"
                "    butuh = random.random() < (0.30 if timur else 0.15)\n"
                "    skor = (0.7 if butuh else 0.2) + random.gauss(0, 0.15) - (0.12 if timur else 0)\n"
                "    data.append((timur, skor, butuh))\n"
                "def metrik(subset, thr):\n"
                "    tp = sum(1 for s, b in subset if s >= thr and b == 1)\n"
                "    fn = sum(1 for s, b in subset if s < thr and b == 1)\n"
                "    fp = sum(1 for s, b in subset if s >= thr and b == 0)\n"
                "    tn = sum(1 for s, b in subset if s < thr and b == 0)\n"
                "    return tp/(tp+fn), fp/(fp+tn)\n"
                "kota = [(s, b) for t, s, b in data if not t]\n"
                "timur = [(s, b) for t, s, b in data if t]\n"
                "tpr_kota, _ = metrik(kota, 0.5)\n"
                "print(f'TPR kota @0.5 = {tpr_kota:.0%}')\n"
                "# cari threshold timur agar TPR menyamai kota\n"
                "for thr in [0.5, 0.45, 0.4, 0.35, 0.3]:\n"
                "    tpr_t, fpr_t = metrik(timur, thr)\n"
                "    print(f'  thr timur={thr}: TPR={tpr_t:.0%}  FPR={fpr_t:.0%}')\n"
                "print()\n"
                "print('TPR setara TERCAPAI, tapi FPR timur naik.')\n"
                "print('Keadilan ada harganya. Siapa yang membayar? -> keputusan klinis, bukan kode.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Dugaan bias label \u2192 Ganti proksi (pre-processing)",
            "kondisi": "Label membawa sejarah (biaya, persetujuan, kunjungan).",
            "alasan": "Akar masalah; tidak ada metrik yang memperbaiki label salah.",
            "contoh": "Biaya \u2192 kebutuhan klinis terukur (HbA1c, skor keparahan).",
        },
        {
            "title": "Training tidak mewakili \u2192 Tambah data + reweight",
            "kondisi": "Grup minoritas kecil di training.",
            "alasan": "Model buta pada yang jarang dilihat.",
            "contoh": "Oversampling puskesmas timur; reweight per wilayah.",
        },
        {
            "title": "Model terkunci, disparitas ada \u2192 Threshold per grup",
            "kondisi": "Tidak bisa retraining (vendor, regulasi).",
            "alasan": "Post-processing: samakan TPR/FPR via threshold berbeda.",
            "contoh": "Threshold rujukan lebih rendah untuk wilayah timur.",
            "chart": {
                "var": "hd13ThrData",
                "data": [{"x": ["Satu threshold (0,5)", "Threshold per grup"], "y": [25, 4], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "name": "Disparitas TPR", "text": ["25%", "4%"], "textposition": "outside"},
                        {"x": ["Satu threshold (0,5)", "Threshold per grup"], "y": [0.82, 0.81], "type": "bar", "marker": {"color": "#94a3b8"}, "name": "AUC", "yaxis": "y2"}],
                "title": "Harga Keadilan: Disparitas Turun, AUC Hampir Tetap",
                "layout": {"xaxis": {"title": "Strategi"}, "yaxis": {"title": "Disparitas TPR (%)"}, "yaxis2": {"title": "AUC", "overlaying": "y", "side": "right", "range": [0.7, 0.9]}, "showlegend": True},
                "cara": "Batang warna = disparitas TPR antar grup (kiri vs kanan strategi). Abu-abu (sumbu kanan) = AUC keseluruhan.",
                "interpretasi": "Threshold per grup memangkas disparitas 25% \u2192 4% dengan AUC turun hanya 0,01. Trade-off akurasi-vs-fairness sering kecil \u2014 alasan \u201cnanti akurasi turun\u201d biasanya mitos untuk menunda audit.",
            },
        },
        {
            "title": "Dokter harus percaya & bisa protes \u2192 SHAP + dokumentasi",
            "kondisi": "Model dipakai dalam keputusan klinis.",
            "alasan": "Contestability: yang terdampak bisa mempertanyakan alasan.",
            "contoh": "Tampilkan 3 alasan utama tiap skor rujukan di dashboard.",
        },
    ],
    "aturan10": [
        "Audit 4 pintu bias sebelum metrik.",
        "Ukur per grup; agregat menipu.",
        "Pilih metrik sesuai misi klinis; nyatakan trade-off.",
        "SHAP untuk transparansi, bukan sertifikat adil.",
    ],
    "case": {
        "title": "Skor Prioritas Vaksin: Siapa Didahulukan?",
        "body": [
            "<p>Dinkes memakai skor AI untuk prioritas vaksin saat stok terbatas. Auditmu: TPR lansia 85%, TPR difabel 55% \u2014 difabel yang berisiko tinggi lebih sering terlewat. Vendor berdalih: \u201cAUC keseluruhan 0,87, sudah bagus.\u201d</p>",
            "<p>Akar: fitur mobilitas (langkah harian dari data) tidak tersedia untuk difabel \u2192 model mengandalkan proksi yang bias.</p>",
        ],
        "pertanyaan": "Susun rekomendasi 4 langkah: diagnosis, mitigasi, komunikasi, monitoring.",
        "pembahasan": "(1) Diagnosis: disparitas TPR 30 poin = kegagalan equalized odds; akar di fitur (bukan label) \u2014 data mobilitas tak representatif untuk difabel. (2) Mitigasi: tambah fitur yang adil untuk difabel (komorbid, usia) + threshold per grup sementara + retraining dengan data difabel. (3) Komunikasi ke Dinkes: jelaskan dengan angka per grup, bukan AUC; nyatakan trade-off (menaikkan TPR difabel menaikkan FPR sedikit). (4) Monitoring: dashboard TPR per grup disabilitas/usia/wilayah bulanan + jalur protes. Tolak argumen \u201cAUC bagus\u201d \u2014 AUC agregat adalah tempat bersembunyi disparitas.",
    },
    "quiz": [
        ("Kasus Science 2019: model memakai BIAYA sebagai proksi KEBUTUHAN. Ini bias\u2026",
         ["Data", "Label", "Representasi", "Deployment"],
         1,
         "Benar: labelnya yang membawa sejarah ketidakadilan. Algoritmanya \u201cbenar\u201d memprediksi label yang salah konsep."),
        ("Menghapus variabel etnis dari fitur membuat model adil. Benar/salah?",
         ["Benar", "Salah \u2014 proksi (kode pos, nama) tetap membawa info itu, kini tanpa bisa diaudit", "Tergantung", "Hanya untuk data kecil"],
         1,
         "Benar: kebutaan \u2260 keadilan. Fairness butuh pengukuran per grup."),
        ("Base rate beda antar grup. Yang BENAR tentang metrik fairness?",
         ["Semua metrik bisa dipenuhi bersamaan", "Demographic parity + equalized odds + kalibrasi tak bisa bersamaan (impossibility) \u2014 pilih sesuai misi", "Cukup pakai akurasi", "Tidak ada metrik yang valid"],
         1,
         "Benar: teorema impossibility. Pilih metrik sesuai nilai klinis dan nyatakan trade-off eksplisit."),
        ("Untuk alokasi perawatan yang adil, metrik paling relevan?",
         ["Demographic parity", "Equalized odds (TPR/FPR setara) \u2014 kesempatan terdeteksi sama", "Akurasi agregat", "Ukuran model"],
         1,
         "Benar: yang penting adalah yang benar-benar butuh punya peluang sama tertangkap, bukan tingkat rujukan sama."),
        ("SHAP pada model klinis berguna untuk\u2026",
         ["Membuktikan model adil", "Transparansi & contestability \u2014 klinisi bisa melihat alasan dan protes", "Mengganti validasi", "Menambah akurasi"],
         1,
         "Benar: SHAP menjelaskan model, bukan mensertifikasi keadilan. Fitur penting bisa jadi proksi bias."),
        ("Di Indonesia, dimensi fairness yang sering paling tajam?",
         ["Hanya etnis", "Wilayah & kelas faskes (model Jakarta vs Papua, swasta vs puskesmas)", "Hanya gender", "Tidak ada disparitas"],
         1,
         "Benar: audit harus relevan lokal. Template AS tidak otomatis cocok \u2014 ukur yang benar-benar timpang di sini."),
    ],
    "rangkuman": [
        "Empat pintu bias: <strong>data, label, representasi, deployment</strong> \u2014 audit berurutan.",
        "Kasus klasik: <strong>proksi label</strong> (biaya \u2260 kebutuhan) membawa sejarah ke model.",
        "Metrik: <strong>parity, equalized odds, kalibrasi per grup</strong> \u2014 tak bisa semua (impossibility).",
        "Ukur <strong>per grup</strong>; agregat menyembunyikan disparitas.",
        "Mitigasi: <strong>pre</strong> (label/data) > <strong>in</strong> (constraint) > <strong>post</strong> (threshold).",
        "<strong>SHAP</strong> untuk transparansi & contestability, bukan sertifikat adil.",
        "\u201cButa\u201d \u2260 adil. Dimensi lokal (wilayah, kelas faskes) wajib diaudit.",
        "Trade-off akurasi-fairness sering kecil \u2014 jangan jadikan alasan menunda.",
    ],
    "prev": ("hd12-prediksi-klinis", "HD12"),
    "next": ("hd14-nlp-klinis", "HD14"),
}

# ================================================================ HD14
HD14 = {
    "slug": "hd14-nlp-klinis",
    "code": "HD14",
    "track": TRACK,
    "cover_title": "NER &amp; LLM Klinis:<br />Membaca Catatan Dokter",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 80% Data yang Tak Terbaca"),
        ("ner", "NER Klinis \u2014 Si Penambang Entitas"),
        ("deid", "De-identifikasi \u2014 Si Penjaga Privasi"),
        ("llm", "LLM untuk Data Klinis \u2014 Si Asisten Baru"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: NER Berbasis Aturan (Bahasa Indonesia)"),
        ("lab2", "\U0001f52c Lab 2: Evaluasi De-identifikasi"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan pipeline <strong>NER klinis</strong>: tokenisasi, pengenalan entitas, normalisasi ke terminologi.",
        "Menerapkan teknik <strong>de-identifikasi</strong> (Safe Harbor) dan mengukur sisa risiko.",
        "Menilai kapan <strong>LLM/foundation model</strong> cocok untuk tugas klinis \u2014 dan batasannya (halusinasi, privasi).",
        "Merancang evaluasi ekstraksi: <strong>precision/recall/F1 per tipe entitas</strong>.",
    ],
    "story_title": "Cerita Pembuka: 80% Data yang Tak Terbaca",
    "story": [
        "<p>Direktur RS bangga: \u201cKami punya 2 juta record EHR!\u201d Analis membuka: 80% informasi klinis terkunci dalam <strong>catatan narasi bebas</strong> \u2014 \u201cnyeri dada sejak 3 hari, menjalar ke lengan kiri\u2026\u201d, singkatan, typo, bahasa campuran. Kolom terstruktur hanya berisi kode billing. Semua pertanyaan menarik (\u201cgejala awal pasien stroke\u201d) jawabannya ada di teks yang tak terbaca mesin.</p>",
        "<p>NLP klinis adalah kunci gudang itu: mengubah narasi menjadi data terstruktur. Tapi kunci ini bergerigi \u2014 singkatan ambigu (\u201cDM\u201d = diabetes melitus atau dorsum manus?), negasi (\u201ctidak ada nyeri dada\u201d), dan privasi. Lesson ini mengajarkan membuka gudang tanpa membocorkan isinya.</p>",
    ],
    "konsep": [
        {
            "id": "ner",
            "title": "NER Klinis \u2014 Si Penambang Entitas",
            "definisi": "<strong>NER (Named Entity Recognition)</strong>: menemukan dan mengklasifikasikan entitas di teks \u2014 penyakit, gejala, obat, dosis, prosedur. Dilanjut <strong>normalisasi</strong> (petakan ke ICD/SNOMED/RxNorm) dan <strong>deteksi negasi/ketidakpastian</strong>.",
            "kepribadian": "NER itu penambang yang memilah bijih (teks) menjadi emas (entitas) \u2014 tapi bijih klinis penuh jebakan: \u201ctidak ada\u201d membalik arti, singkatan bermuka dua, dan konteks menentukan segalanya.",
            "kapan": "Ekstraksi fenotipe dari narasi, pharmacovigilance (efek samping dari catatan), coding otomatis berbantuan.",
            "worked": (
                "\U0001f4d0 Contoh: menambang satu kalimat",
                "<p>Kalimat: \u201cPasien mengeluh <u>nyeri dada</u> sejak 3 hari, <u>tidak ada</u> <u>sesak napas</u>. Diberi <u>aspirin 80 mg</u>.\u201d<br />"
                "<strong>Entitas:</strong> nyeri dada (GEJALA, present), sesak napas (GEJALA, <strong>negated</strong> \u2014 jangan hitung sebagai gejala!), aspirin 80 mg (OBAT+dosis).<br />"
                "<strong>Normalisasi:</strong> nyeri dada \u2192 SNOMED 29857009; aspirin \u2192 RxNorm 1191.<br />"
                "Tanpa deteksi negasi, pasien ini salah tercatat \u201cpunya sesak napas\u201d \u2014 error klasik NER naif.</p>",
            ),
            "chart": {
                "var": "hd14NerData",
                "data": [{"x": ["Penyakit", "Gejala", "Obat", "Dosis", "Negasi"], "y": [0.92, 0.85, 0.94, 0.88, 0.71], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["0,92", "0,85", "0,94", "0,88", "0,71"], "textposition": "outside"}],
                "title": "F1 NER per Tipe Entitas (ilustratif, Bahasa Indonesia)",
                "layout": {"xaxis": {"title": "Tipe entitas"}, "yaxis": {"title": "F1", "range": [0, 1.05]}, "showlegend": False},
                "cara": "Batang = skor F1 ekstraksi per tipe entitas. Makin tinggi makin akurat.",
                "interpretasi": "Obat dan penyakit (pola kaku) mudah \u2014 F1 0,9+. Negasi anjlok ke 0,71: bahasa negasi Indonesia bervariasi (\u201ctidak ada\u201d, \u201cmenyangkal\u201d, \u201cdisangkal\u201d). Inilah kenapa evaluasi HARUS per tipe entitas, bukan satu angka agregat \u2014 agregat menyembunyikan kelemahan fatal.",
            },
        },
        {
            "id": "deid",
            "title": "De-identifikasi \u2014 Si Penjaga Privasi",
            "definisi": "<strong>De-identifikasi</strong>: menghapus/menyamarkan 18 identifier HIPAA Safe Harbor (nama, tanggal lahir, alamat, NIK, dsb.) agar teks bisa dipakai riset. Di Indonesia: padankan dengan <strong>UU PDP</strong>.",
            "rumus": r"\text{Risiko} \approx \frac{1}{\text{ukuran kelompok anonimitas}}",
            "simbol": [
                (r"\text{ukuran kelompok anonimitas}", "jumlah orang dengan kombinasi quasi-identifier sama (k-anonymity, lihat HD18)"),
            ],
            "interpretasi": "Rumus intuisi: bila kombinasi \u201claki-laki, 45 th, kecamatan X, TB\u201d hanya dimiliki 1 orang, ia teridentifikasi walau nama dihapus. De-identifikasi teks = NER terbalik: temukan identifier, lalu hapus/generalisasi.",
            "worked": (
                "\U0001f4d0 Contoh: de-identifikasi satu kalimat",
                "<p>Asli: \u201cTn. Budi Santoso, 45 th, Jl. Mawar 10 Makassar, dirawat 12 Jan 2026 karena TB.\u201d<br />"
                "De-id: \u201cTn. [NAMA], [45-50] th, [KOTA], dirawat [Jan 2026] karena TB.\u201d<br />"
                "Nama \u2192 hapus; umur \u2192 rentang; alamat detail \u2192 kota; tanggal \u2192 bulan.<br />"
                "<strong>Trade-off:</strong> makin agresif makin aman tapi makin merusak utilitas riset (tanggal presisi hilang \u2192 analisis wabah terganggu).</p>",
            ),
            "kepribadian": "De-identifikasi itu sensor film: memblur wajah (nama) tapi cerita (klinis) tetap bisa diikuti. Blur terlalu tebal = film tidak bisa ditonton; terlalu tipis = wajah dikenali.",
            "kapan": "Sebelum teks klinis keluar dari RS untuk riset/analitik. Wajib: evaluasi sisa risiko + perjanjian penggunaan data (DUA).",
            "warning": "<strong>LLM + data klinis = risiko privasi ganda:</strong> (1) prompt berisi data pasien bisa tersimpan di vendor; (2) model bisa menghafal dan membocorkan training data. Jangan kirim teks teridentifikasi ke API publik \u2014 gunakan deployment on-premise/privat atau de-identifikasi dulu.",
        },
        {
            "id": "llm",
            "title": "LLM untuk Data Klinis \u2014 Si Asisten Baru (yang Kadang Ngawur)",
            "definisi": "<strong>LLM/foundation model klinis</strong> (BioClinicalBERT, Med-PaLM, dsb.): model besar yang bisa ekstraksi, ringkasan, dan tanya-jawab dari teks klinis dengan sedikit/no training data \u2014 dengan risiko <strong>halusinasi</strong>.",
            "kepribadian": "LLM itu residen super-cepat yang membaca 1.000 chart per menit \u2014 tapi kadang mengarang temuan dengan percaya diri. Ia asisten, bukan dokter penanggung jawab: semua outputnya butuh verifikasi untuk keputusan klinis.",
            "kapan": "Cocok: ringkasan chart, ekstraksi awal untuk review manusia, coding berbantuan, tanya-jawab pengetahuan. JANGAN: diagnosis otonom, keputusan terapi tanpa verifikasi, memproses data teridentifikasi di API publik.",
            "worked": (
                "\U0001f4d0 Contoh: evaluasi LLM untuk ringkasan pulang",
                "<p>100 ringkasan LLM dinilai dokter: 85% akurat-lengkap, 10% ada <strong>halusinasi</strong> (alergi yang tidak ada di chart!), 5% menghilangkan info kritis.<br />"
                "Keputusan: deploy sebagai <strong>draf untuk dokter</strong> (hemat 40% waktu), BUKAN dokumen final otomatis.<br />"
                "Metrik yang benar: bukan BLEU/ROUGE semata, tapi <strong>factuality</strong> dinilai klinisi + tingkat halusinasi per 100 ringkasan.</p>",
            ),
            "callout": "<strong>Pola aman memakai LLM klinis:</strong> (1) de-identifikasi dulu; (2) retrieval-augmented (RAG) dengan sumber terkontrol untuk tanya-jawab; (3) human-in-the-loop untuk output yang berdampak ke pasien; (4) ukur halusinasi secara berkala, bukan sekali.",
        },
    ],
    "myths": [
        ("LLM bisa menggantikan chart review manusia untuk label",
         "LLM membuat kesalahan yang <em>percaya diri dan halus</em> \u2014 halusinasi alergi, dosis salah. Untuk label gold-standard, LLM adalah asisten pra-seleksi yang mempercepat, bukan pengganti adjudikasi manusia. Validasi: sampel output LLM tetap harus dinilai klinisi."),
        ("Teks sudah dihapus namanya = aman dibagikan",
         "Quasi-identifier (umur+wilayah+diagnosis langka+tanggal) bisa mengidentifikasi ulang (lihat rumus risiko di atas). De-identifikasi butuh evaluasi sisa risiko (k-anonymity), bukan sekadar hapus nama. Teks klinis sangat kaya = sangat berisiko."),
        ("Model NLP Inggris bisa langsung dipakai untuk catatan Indonesia",
         "Catatan Indonesia: campur bahasa (\u201cnyeri dada, no SOB\u201d), singkatan lokal (\u201ctensi\u201d, \u201cKU\u201d), struktur SOAP yang longgar. Transfer langsung anjlok performanya \u2014 butuh adaptasi/fine-tuning dengan data lokal beranotasi."),
    ],
    "tips": [
        "Mulai NLP klinis dari <strong>aturan + kamus</strong> untuk kasus sempit sebelum ML. Aturan untuk \u201cobat + dosis\u201d sering F1 0,9+ dengan 1 hari kerja \u2014 baseline yang jujur sebelum model canggih.",
        "Anotasi sedikit tapi <strong>berkualitas</strong>: 500 kalimat dengan 2 anotator + ukur agreement (kappa) > 5.000 kalimat satu anotator ngawur. Kualitas anotasi = langit-langit modelmu.",
        "Untuk setiap proyek LLM klinis, definisikan <strong>\u201capa yang terjadi bila ia salah\u201d</strong> dulu. Klasifikasi risiko ini menentukan seberapa ketat verifikasi yang dibutuhkan.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: NER Berbasis Aturan (Bahasa Indonesia)",
            "intro": "Ekstraksi gejala/obat/negasi dari kalimat klinis Indonesia dengan kamus + pola sederhana. Lihat di mana aturan gagal (itulah kebutuhan ML).",
            "hint": "Tambahkan kalimatmu sendiri dengan negasi (\u201cmenyangkal nyeri dada\u201d). Apakah aturan menangkapnya? Variasikan pola negasi dan lihat kerapuhannya.",
            "code": (
                "gejala = ['nyeri dada', 'sesak napas', 'demam', 'batuk', 'mual']\n"
                "obat = ['aspirin', 'paracetamol', 'amoxicillin', 'metformin']\n"
                "negasi = ['tidak ada', 'menyangkal', 'disangkal', 'tanpa']\n"
                "kalimat = [\n"
                "    'Pasien mengeluh nyeri dada sejak 3 hari, tidak ada sesak napas.',\n"
                "    'Diberi aspirin 80 mg dan paracetamol.',\n"
                "    'Menyangkal demam dan batuk.',\n"
                "]\n"
                "for k in kalimat:\n"
                "    kl = k.lower()\n"
                "    ada_neg = any(n in kl for n in negasi)\n"
                "    print(f'Kalimat: {k}')\n"
                "    for g in gejala:\n"
                "        if g in kl:\n"
                "            print(f'  GEJALA: {g} -> {\"NEGATED (abaikan!)\" if ada_neg else \"present\"}')\n"
                "    for o in obat:\n"
                "        if o in kl:\n"
                "            print(f'  OBAT: {o}')\n"
                "    print()\n"
                "print('Keterbatasan: negasi kalimat-level kasar; \u201ctidak ada sesak, tapi demam\u201d')\n"
                "print('akan salah menandai demam sebagai negated. Butuh scope detection (ML).')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Evaluasi De-identifikasi",
            "intro": "Simulasikan NER de-identifikasi dengan recall tertentu. Hitung berapa identifier bocor per 1.000 dokumen \u2014 kuantifikasi risiko sisa.",
            "hint": "Recall 99% terdengar hebat \u2014 tapi dengan 20 identifier per dokumen, berapa yang bocor per 1.000 dokumen? Itulah kenapa de-id butuh lapisan pertahanan berlapis.",
            "code": (
                "recall = 0.99       # NER de-id menemukan 99% identifier\n"
                "id_per_dok = 20     # rata-rata identifier per dokumen\n"
                "n_dok = 1000\n"
                "bocor_per_dok = id_per_dok * (1 - recall)\n"
                "print(f'Recall NER de-id : {recall:.0%}')\n"
                "print(f'Identifier bocor : {bocor_per_dok:.1f} per dokumen')\n"
                "print(f'Total bocor      : {bocor_per_dok * n_dok:.0f} per {n_dok} dokumen')\n"
                "print()\n"
                "print('Satu nama bocor bisa cukup untuk re-identifikasi.')\n"
                "print('-> De-id otomatis WAJIB + review sampel + perjanjian akses (DUA).')\n"
                "print('-> Untuk LLM: de-id DULU sebelum kirim ke model manapun.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Ekstraksi sempit & berpola \u2192 Aturan + kamus",
            "kondisi": "Entitas berpola kaku (obat+dosis, kode), butuh cepat.",
            "alasan": "Murah, transparan, F1 tinggi untuk pola kaku.",
            "contoh": "Ekstraksi resep dari catatan rawat jalan.",
        },
        {
            "title": "Ekstraksi luas (gejala, negasi kompleks) \u2192 Model ML/LLM + anotasi lokal",
            "kondisi": "Bahasa bervariasi, butuh konteks.",
            "alasan": "Aturan rapuh untuk variasi bahasa; butuh data anotasi Indonesia.",
            "contoh": "Fenotipe gejala awal stroke dari IGD.",
        },
        {
            "title": "Teks keluar RS \u2192 De-identifikasi + evaluasi risiko",
            "kondisi": "Riset/analitik di luar sistem klinis.",
            "alasan": "Kewajiban privasi (UU PDP); teks kaya = risiko re-identifikasi tinggi.",
            "contoh": "Dataset riset catatan TB untuk universitas.",
            "chart": {
                "var": "hd14RiskData",
                "data": [{"x": ["Hapus nama saja", "+ generalisasi umur/tgl", "+ hapus quasi-id langka", "+ akses terbatas (DUA)"], "y": [45, 18, 6, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "18%", "6%", "1%"], "textposition": "outside"}],
                "title": "Estimasi Risiko Re-identifikasi per Lapisan Pertahanan (ilustratif)",
                "layout": {"xaxis": {"title": "Lapisan"}, "yaxis": {"title": "Risiko sisa (%)", "range": [0, 55]}, "showlegend": False},
                "cara": "Empat lapisan pertahanan berurutan. Tinggi batang = estimasi risiko re-identifikasi yang tersisa.",
                "interpretasi": "Hapus nama saja menyisakan risiko 45% \u2014 quasi-identifier bekerja. Tiap lapisan memangkas risiko; kombinasi mencapai ~1%. Pertahanan berlapis, bukan satu trik, adalah standar.",
            },
        },
        {
            "title": "Tugas bahasa generatif \u2192 LLM dengan human-in-the-loop",
            "kondisi": "Ringkasan, draf surat, tanya-jawab.",
            "alasan": "Kuat tapi berhalusinasi; verifikasi manusia wajib untuk dampak klinis.",
            "contoh": "Draf ringkasan pulang untuk ditinjau dokter.",
        },
    ],
    "aturan10": [
        "Deteksi negasi dulu sebelum hitung entitas.",
        "Evaluasi per tipe entitas, bukan agregat.",
        "De-id dulu sebelum teks keluar RS / masuk LLM.",
        "LLM = asisten berdraf, bukan penanggung jawab.",
    ],
    "case": {
        "title": "Chatbot Triase: \u201cKamu Kena Serangan Jantung!\u201d",
        "body": [
            "<p>Startup meluncurkan chatbot triase berbasis LLM: pasien chat gejala, bot menyarankan \u201c ke IGD / istirahat di rumah\u201d. Tanpa uji klinis, langsung ke publik. Sebulan kemudian: pasien nyeri dada disarankan \u201cistirahat dan minum air hangat\u201d \u2014 ternyata infark.</p>",
            "<p>Investigasi: tidak ada evaluasi factuality, tidak ada batasan (bot boleh mendiagnosis), riwayat chat pasien tersimpan plaintext di server vendor.</p>",
        ],
        "pertanyaan": "Sebutkan kegagalan per lapisan (klinis, evaluasi, privasi) dan desain yang bertanggung jawab.",
        "pembahasan": "(1) Klinis: LLM boleh memberi <em>informasi umum</em>, bukan diagnosis/triase definitif \u2014 butuh disclaimer + eskalasi ke manusia untuk red flags (nyeri dada!). (2) Evaluasi: tidak ada uji factuality oleh klinisi, tidak ada pengukuran halusinasi, tidak ada uji pada kasus red-flag. (3) Privasi: data kesehatan di server vendor plaintext = pelanggaran prinsip UU PDP. Desain benar: de-id + enkripsi, LLM sebagai <em>pendukung</em> perawat triase (bukan pengganti), daftar red-flag berbasis aturan yang selalu eskalasi, audit halusinasi berkala, dan persetujuan etik. Pelajaran: kecepatan deploy tanpa evaluasi klinis = malpraktik berskala software.",
    },
    "quiz": [
        ("Kalimat \u201ctidak ada sesak napas\u201d. Kesalahan NER naif?",
         ["Tidak ada", "Mencatat \u201csesak napas\u201d sebagai gejala yang dialami (gagal deteksi negasi)", "Gagal membaca huruf", "Terlalu lambat"],
         1,
         "Benar: negasi membalik arti. NER klinis tanpa deteksi negasi menghasilkan fenotipe sampah."),
        ("Setelah NER, langkah \u201cnormalisasi\u201d artinya\u2026",
         ["Merapikan huruf", "Memetakan entitas ke terminologi standar (SNOMED/RxNorm/ICD)", "Menghapus data", "Menerjemahkan"],
         1,
         "Benar: \u201caspirin\u201d \u2192 RxNorm 1191. Tanpa ini, \u201caspirin\u201d dan \u201cacetosal\u201d jadi dua obat berbeda."),
        ("De-identifikasi yang benar mencakup\u2026",
         ["Hapus nama saja", "18 identifier Safe Harbor + evaluasi sisa risiko quasi-identifier + perjanjian akses", "Ganti font", "Enkripsi nama saja"],
         1,
         "Benar: nama hanyalah satu dari 18. Kombinasi umur+wilayah+diagnosis bisa mengidentifikasi ulang."),
        ("Kapan LLM cocok untuk data klinis?",
         ["Diagnosis otonom", "Ringkasan draf + ekstraksi awal dengan human-in-the-loop, setelah de-identifikasi", "Mengganti dokter", "Kirim data mentah ke API publik"],
         1,
         "Benar: asisten yang diawasi, bukan penanggung jawab. Privasi: jangan kirim teridentifikasi ke API publik."),
        ("Evaluasi NER yang benar?",
         ["Satu angka F1 agregat", "Precision/recall/F1 PER TIPE ENTITAS (negasi sering paling lemah)", "Kecepatan saja", "Jumlah baris kode"],
         1,
         "Benar: agregat menyembunyikan kelemahan fatal (negasi F1 0,71 vs obat 0,94)."),
        ("Catatan Indonesia (\u201cnyeri dada, no SOB\u201d, singkatan lokal). Tantangan utama transfer model Inggris?",
         ["Tidak ada", "Campur bahasa + singkatan lokal + struktur longgar \u2014 butuh adaptasi data lokal", "Hanya font", "Terlalu cepat"],
         1,
         "Benar: domain shift bahasa. Butuh anotasi lokal; evaluasi ulang, jangan asumsi."),
    ],
    "rangkuman": [
        "<strong>NER klinis</strong>: entitas + normalisasi (SNOMED/RxNorm) + deteksi negasi.",
        "Evaluasi <strong>per tipe entitas</strong>; negasi biasanya titik lemah.",
        "<strong>De-identifikasi</strong>: 18 identifier + ukur sisa risiko + lapisan pertahanan.",
        "Jangan kirim teks teridentifikasi ke <strong>API LLM publik</strong>.",
        "<strong>LLM</strong>: kuat untuk draf/ekstraksi awal; halusinasi = wajib human-in-the-loop.",
        "Mulai dari <strong>aturan + kamus</strong> sebagai baseline jujur.",
        "Anotasi sedikit berkualitas > banyak ngawur (ukur kappa).",
        "Definisikan \u201capa bila salah\u201d sebelum memilih tingkat otonomi.",
    ],
    "prev": ("hd13-fairness-kesehatan", "HD13"),
    "next": ("hd15-imaging-medis", "HD15"),
}

# ================================================================ HD15
HD15 = {
    "slug": "hd15-imaging-medis",
    "code": "HD15",
    "track": TRACK,
    "cover_title": "DICOM &amp; Klasifikasi Citra:<br />Melihat Seperti Radiolog",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Foto yang Bicara Dua Bahasa"),
        ("dicom", "DICOM \u2014 Si Amplop Citra Medis"),
        ("klasifikasi", "Klasifikasi Citra: CNN untuk Diagnosis"),
        ("evaluasi", "Evaluasi &amp; Batasan Klinis"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Baca Metadata DICOM (Simulasi)"),
        ("lab2", "\U0001f52c Lab 2: Confusion Matrix &amp; Sens-Spes Citra"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan struktur <strong>DICOM</strong> (piksel + metadata) dan mengapa metadata sama pentingnya dengan gambar.",
        "Menjelaskan cara kerja <strong>CNN untuk klasifikasi citra</strong> secara konseptual (konvolusi, pooling, transfer learning).",
        "Mengevaluasi model citra dengan <strong>metrik klinis</strong> (sens/spes, bukan cuma akurasi) + validasi eksternal.",
        "Mengidentifikasi jebakan khas: <strong>shortcut learning, label berisik, spectrum bias</strong>.",
    ],
    "story_title": "Cerita Pembuka: Foto yang Bicara Dua Bahasa",
    "story": [
        "<p>Dua foto rontgen dada terlihat identik bagi mata awam. Radiolog membaca yang pertama: \u201cInfiltrat di paru kanan bawah \u2014 curiga pneumonia.\u201d Yang kedua: normal. Bedanya? Pola keabuan halus yang butuh 10 tahun latihan untuk dilihat. Kini AI bisa dilatih melihat pola yang sama \u2014 dalam seminggu, dari 100.000 contoh.</p>",
        "<p>Tapi ada kisah horornya: model pendeteksi COVID dari rontgen yang ternyata hanya membaca <strong>merek mesin rontgen</strong> di sudut gambar (shortcut learning). Akurasinya 95% \u2014 kepintarannya nol. Lesson ini: cara kerja citra medis untuk analis, plus cara tidak tertipu oleh AI yang \u201cpintar\u201d.</p>",
    ],
    "konsep": [
        {
            "id": "dicom",
            "title": "DICOM \u2014 Si Amplop Citra Medis",
            "definisi": "<strong>DICOM</strong>: standar file citra medis \u2014 berisi <strong>piksel</strong> (data gambar) + <strong>metadata</strong> (pasien, modalitas, parameter akuisisi, rumah sakit) dalam tag terstandar.",
            "kepribadian": "DICOM itu amplop pos untuk foto medis: fotonya (piksel) penting, tapi perangko dan alamatnya (metadata: modalitas, tanggal, mesin) sama penting \u2014 tanpanya foto tidak bisa diarsipkan, dicari, atau dipercaya.",
            "kapan": "Setiap pipeline imaging: baca metadata untuk stratifikasi (beda mesin = beda distribusi!), anonimisasi sebelum riset, dan QC.",
            "worked": (
                "\U0001f4d0 Contoh: membaca tag DICOM",
                "<p>Tag (0010,0010) = nama pasien; (0008,0060) = modalitas (CR/DX/MG); (0018,1164) = parameter akuisisi.<br />"
                "Analisis: kelompokkan performa model per <strong>modalitas dan merek mesin</strong> (dari metadata).<br />"
                "Jika model bagus di mesin A tapi jeblok di mesin B \u2014 kamu menemukan shortcut learning sebelum deploy, bukan sesudah.</p>",
            ),
            "code_display": ("text",
                "Tag DICOM        | Isi contoh\n"
                "-----------------+---------------------------\n"
                "(0010,0010)      | PatientName (ANONIMISASI!)\n"
                "(0008,0060)      | Modality = DX (rontgen)\n"
                "(0008,0070)      | Manufacturer = Merek-X\n"
                "(0028,0010/11)   | Rows/Columns = 2048x2048\n"
                "(0028,0103)      | PixelRepresentation"),
            "warning": "<strong>Metadata = PII!</strong> DICOM menyimpan nama, tanggal lahir, bahkan kadang wajah (foto). Anonimisasi DICOM harus membersihkan tag + <em>burned-in annotation</em> (teks terbakar di piksel).",
        },
        {
            "id": "klasifikasi",
            "title": "Klasifikasi Citra: CNN untuk Diagnosis \u2014 Si Mata Bertingkat",
            "definisi": "<strong>CNN</strong>: jaringan yang belajar fitur visual bertingkat \u2014 tepi \u2192 tekstur \u2192 pola \u2192 diagnosis. <strong>Transfer learning</strong>: pakai model pra-latih (ImageNet) lalu fine-tune ke citra medis \u2014 standar karena data medis berlabel mahal.",
            "rumus": r"\text{Konvolusi: } (I * K)(x,y) = \sum_{i,j} I(x+i, y+j) \cdot K(i,j)",
            "simbol": [
                (r"I", "citra input (matriks piksel)"),
                (r"K", "kernel/filter kecil yang dipelajari (pendeteksi pola)"),
                (r"(I*K)(x,y)", "peta fitur: seberapa cocok pola K di posisi (x,y)"),
            ],
            "interpretasi": "Kernel adalah \u201ckaca pembesar pola\u201d yang digeser ke seluruh gambar. Lapisan awal belajar tepi/garis; lapisan dalam mengkombinasikannya menjadi \u201cinfiltrat\u201d atau \u201cnodul\u201d. Inilah kenapa CNN cocok untuk citra: ia memanfaatkan struktur spasial.",
            "worked": (
                "\U0001f4d0 Contoh: pipeline klasifikasi pneumonia",
                "<p>1. Kumpulkan 50.000 rontgen dengan label radiolog (bukan ICD mentah!).<br />"
                "2. Preprocessing: resize, normalisasi, augmentasi (rotasi/crop).<br />"
                "3. Transfer learning: ResNet pra-latih \u2192 fine-tune.<br />"
                "4. Split <strong>per pasien & per RS</strong> (bukan per gambar!) \u2014 cegah leakage.<br />"
                "5. Evaluasi: sens/spes + validasi RS lain + cek shortcut (heatmap Grad-CAM: apakah model melihat paru atau sudut gambar?).</p>",
            ),
            "kepribadian": "CNN itu radiolog magang super: ia belajar dari contoh, bukan dari buku teks. Beri 100.000 contoh bagus \u2192 hebat. Beri contoh berlabel ngawur \u2192 ia belajar ngawur dengan percaya diri.",
            "kapan": "Tugas citra dengan pola visual konsisten: skrining, triase, second reader. Bukan pengganti radiolog untuk kasus kompleks \u2014 melainkan penguat.",
        },
        {
            "id": "evaluasi",
            "title": "Evaluasi &amp; Batasan Klinis \u2014 Si Penguji Ketat",
            "definisi": "Model citra dievaluasi dengan <strong>metrik klinis</strong> (sens/spes/PPV pada prevalensi target \u2014 HD9), <strong>validasi eksternal</strong> (RS/mesin lain), dan <strong>uji shortcut</strong> (apakah keputusan berbasis anatomi?).",
            "kepribadian": "Evaluator model citra itu seperti penguji SIM yang curiga: tidak cukup \u201cbisa jalan lurus\u201d (akurasi) \u2014 harus bisa di jalan becek (RS lain), malam hari (mesin beda), tanpa mencontek rambu (shortcut).",
            "kapan": "Sebelum klaim \u201csiap klinis\u201d apapun: eksternal + analisis kegagalan per subgrup + heatmap interpretasi.",
            "worked": (
                "\U0001f4d0 Contoh: membongkar shortcut learning",
                "<p>Model COVID-rontgen AUC 0,95. Uji: (1) crop sudut gambar (hilangkan teks mesin) \u2192 AUC anjlok ke 0,62. (2) Grad-CAM: heatmap menyala di <strong>sudut kiri atas</strong> (tempat merek mesin), bukan di paru.<br />"
                "Vonis: model mendeteksi <em>RS asal</em> (yang korelasi dengan COVID), bukan COVID. Perbaikan: harmonisasi/hilangkan artefak, training multi-situs, evaluasi per mesin.</p>",
            ),
            "chart": {
                "var": "hd15ShortcutData",
                "data": [{"x": ["Data asli", "Sudut di-crop", "RS lain (eksternal)"], "y": [0.95, 0.62, 0.58], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#e8a838"]}, "text": ["0,95", "0,62", "0,58"], "textposition": "outside"}],
                "title": "AUC Model \u201cCOVID\u201d: Runtuh Saat Artefak Dihilangkan",
                "layout": {"xaxis": {"title": "Kondisi evaluasi"}, "yaxis": {"title": "AUC", "range": [0.4, 1.0]}, "showlegend": False},
                "cara": "Tiga kondisi evaluasi model yang sama. Biru = kondisi training; kuning = kondisi yang menghilangkan jalan pintas.",
                "interpretasi": "AUC 0,95 \u2192 0,62 begitu teks mesin di-crop, dan 0,58 di RS lain. Model tidak belajar COVID \u2014 ia belajar \u201crontgen dari RS wabah vs RS biasa\u201d. Inilah kenapa evaluasi model citra WAJIB di luar distribusi training.",
            },
        },
    ],
    "myths": [
        ("Akurasi 95% pada citra = siap dipakai klinis",
         "Akurasi didominasi kelas mayoritas; yang penting sens/spes pada prevalensi target + validasi eksternal + uji shortcut. Model 95% yang membaca merek mesin = 0% berguna. Klaim klinis butuh bukti klinis, bukan leaderboard."),
        ("Makin dalam network-nya makin bagus untuk citra medis",
         "Data medis kecil \u2192 network raksasa overfit. Transfer learning + augmentasi + regularisasi mengalahkan kedalaman mentah. Arsitektur bukan sihir; data dan evaluasi yang menentukan."),
        ("Heatmap (Grad-CAM) membuktikan model melihat yang benar",
         "Heatmap itu penjelasan pasca-hoc yang bisa menipu: ia menunjukkan <em>korelasi</em> area dengan keputusan, bukan <em>kausalitas</em>. Heatmap di paru tidak menjamin tidak ada shortcut lain. Ia alat investigasi, bukan sertifikat."),
    ],
    "tips": [
        "Split data <strong>per pasien dan per RS</strong>, bukan per gambar. Gambar dari pasien yang sama di train dan test = leakage yang menggelembungkan performa.",
        "Selalu uji <strong>per subgrup</strong>: mesin, RS, usia, keparahan. Performa agregat menyembunyikan kegagalan pada subgrup penting (lihat HD13).",
        "Minta <strong>label dari radiolog</strong> (multi-reader + adjudikasi), bukan dari kode ICD. Label adalah langit-langit modelmu \u2014 label billing = langit-langit rendah.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Baca Metadata DICOM (Simulasi)",
            "intro": "Simulasikan parsing tag DICOM: ekstrak modalitas/merek, deteksi PII yang harus dianonimisasi, dan kelompokkan \u201cpasien\u201d per mesin untuk uji shortcut.",
            "hint": "Ubah proporsi mesin A vs B pada kelas positif. Lihat bagaimana korelasi mesin-label muncul \u2014 itulah bibit shortcut learning.",
            "code": (
                "# simulasi tag DICOM: (patient_id, modality, manufacturer, label)\n"
                "import random\n"
                "random.seed(2)\n"
                "data = []\n"
                "for i in range(1000):\n"
                "    sakit = random.random() < 0.3\n"
                "    # mesin A dipakai di RS wabah -> korelasi mesin-label (shortcut!)\n"
                "    mesin = 'A' if (sakit and random.random() < 0.8) or (not sakit and random.random() < 0.2) else 'B'\n"
                "    data.append((f'P{i:04d}', 'DX', mesin, sakit))\n"
                "# PII check\n"
                "print('Tag (0010,0010) PatientName: ADA -> wajib anonimisasi sebelum riset!')\n"
                "print()\n"
                "# distribusi label per mesin\n"
                "for m in ['A', 'B']:\n"
                "    sub = [d for d in data if d[2] == m]\n"
                "    prev = sum(d[3] for d in sub)/len(sub)\n"
                "    print(f'mesin {m}: n={len(sub)}, prevalensi positif={prev:.0%}')\n"
                "print()\n"
                "print('Model bisa mencapai akurasi tinggi HANYA dengan menebak dari mesin.')\n"
                "print('-> Stratifikasi evaluasi per mesin = wajib.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Dari Confusion Matrix ke Keputusan Klinis",
            "intro": "Diberikan confusion matrix model rontgen, hitung sens/spes/PPV pada dua prevalensi (RS rujukan vs skrining). Tentukan layak deploy atau tidak.",
            "hint": "PPV di skrining (prevalensi 2%) vs rujukan (30%): model yang sama, nasib beda. Inilah HD9 diterapkan ke imaging.",
            "code": (
                "TP, FN, TN, FP = 180, 20, 750, 50  # dari uji internal\n"
                "sens = TP/(TP+FN); spes = TN/(TN+FP)\n"
                "print(f'Sensitivitas = {sens:.0%}, Spesifisitas = {spes:.0%}')\n"
                "for nama, prev in [('skrining', 0.02), ('rujukan', 0.30)]:\n"
                "    ppv = (sens*prev)/(sens*prev + (1-spes)*(1-prev))\n"
                "    npv = (spes*(1-prev))/(spes*(1-prev) + (1-sens)*prev)\n"
                "    print(f'{nama:<8} (prev {prev:.0%}): PPV={ppv:.0%}  NPV={npv:.0%}')\n"
                "print()\n"
                "print('Skrining: PPV rendah -> butuh konfirmasi radiolog (second reader).')\n"
                "print('Rujukan: PPV baik -> bisa untuk triase prioritas.')\n"
                "print('Model yang sama, peran klinis beda. Konteks menentukan.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Skrining/triase bervolume \u2192 AI sebagai second reader",
            "kondisi": "Banyak citra, radiolog terbatas; false negative berbahaya.",
            "alasan": "AI cepat + sens tinggi; manusia konfirmasi positif.",
            "contoh": "Skrining TB dari rontgen dada di puskesmas.",
        },
        {
            "title": "Kasus kompleks/langka \u2192 Tetap radiolog, AI pendukung",
            "kondisi": "Pola atipikal, butuh integrasi klinis.",
            "alasan": "AI rapuh di luar distribusi training.",
            "contoh": "Tumor langka, citra artefak berat.",
        },
        {
            "title": "Klaim siap klinis \u2192 Validasi eksternal + uji shortcut",
            "kondisi": "Generalisasi adalah klaimnya.",
            "alasan": "Shortcut learning adalah mode kegagalan #1 imaging AI.",
            "contoh": "Uji di 3 RS dengan mesin berbeda + Grad-CAM review.",
        },
        {
            "title": "Data kecil berlabel mahal \u2192 Transfer learning + augmentasi",
            "kondisi": "< 10.000 citra berlabel.",
            "alasan": "Pra-latih menangkap fitur visual umum; fine-tune hemat data.",
            "contoh": "Klasifikasi lesi kulit dengan 3.000 foto.",
        },
    ],
    "aturan10": [
        "Split per pasien & per RS, bukan per gambar.",
        "Label dari radiolog, bukan kode billing.",
        "Evaluasi per mesin/RS; curigai shortcut.",
        "Sens/spes + PPV lokal, bukan cuma akurasi.",
    ],
    "case": {
        "title": "AI Retinopati: 97% di Lab, 70% di Puskesmas",
        "body": [
            "<p>Model deteksi retinopati diabetik dari foto fundus: akurasi 97% di data training (kamera mahal, RS tersier). Dideploy ke puskesmas (kamera murah, operator tidak terlatih): akurasi anjlok ke 70%, banyak false negative \u2014 pasien buta yang seharusnya tertangkap.</p>",
            "<p>Tidak ada validasi eksternal sebelum deploy. Tidak ada monitoring.</p>",
        ],
        "pertanyaan": "Analisis akar masalah dan rancang program perbaikan.",
        "pembahasan": "Akar: domain shift (kamera, operator, populasi) tanpa validasi eksternal; metrik akurasi menyembunyikan FN yang fatal untuk skrining (butuh sens tinggi!). Perbaikan: (1) kumpulkan data puskesmas berlabel (multi-reader); (2) fine-tune/adaptasi domain; (3) evaluasi dengan sens sebagai metrik primer (skrining!); (4) alur: AI triase \u2192 yang positif/meragukan ke dokter mata via telemedicine; (5) monitoring bulanan per puskesmas. Pelajaran: performa lab \u2260 performa lapangan. Deploy tanpa validasi eksternal = uji coba pada pasien.",
    },
    "quiz": [
        ("DICOM berisi\u2026",
         ["Hanya piksel gambar", "Piksel + metadata terstandar (pasien, modalitas, mesin)", "Hanya teks", "Hanya video"],
         1,
         "Benar: amplop lengkap. Metadata penting untuk arsip, stratifikasi evaluasi, dan \u2014 awas \u2014 PII yang harus dianonimisasi."),
        ("Shortcut learning pada model COVID-rontgen artinya\u2026",
         ["Model terlalu cepat", "Model memakai artefak (merek mesin di sudut) bukan pola penyakit", "Model curang disengaja", "Data terlalu sedikit"],
         1,
         "Benar: korelasi artefak-label dieksploitasi. Terdeteksi via crop test + Grad-CAM + validasi eksternal."),
        ("Split data citra yang benar?",
         ["Per gambar acak", "Per pasien dan per RS (hindari leakage antar split)", "Per piksel", "Tidak perlu split"],
         1,
         "Benar: gambar pasien yang sama di train+test = bocoran. Selalu split di level pasien/RS."),
        ("Untuk skrining TB dari rontgen, metrik primer?",
         ["Akurasi", "Sensitivitas (jangan sampai lolos) + PPV lokal", "Spesifisitas saja", "Kecepatan"],
         1,
         "Benar (SnNout): skrining butuh tangkap semua; PPV menentukan beban konfirmasi."),
        ("Transfer learning untuk citra medis berguna karena\u2026",
         ["Selalu lebih akurat", "Data berlabel mahal/sedikit \u2014 fitur visual umum dari pra-latih menghemat data", "Wajib regulasi", "Gratis"],
         1,
         "Benar: 3.000 foto + fine-tune sering mengalahkan training dari nol. Bukan sihir, tapi efisiensi data."),
        ("Grad-CAM heatmap menyala di paru. Kesimpulan?",
         ["Terbukti tidak ada shortcut", "Korelasi area-keputusan, bukan bukti kausal \u2014 tetap butuh uji eksternal/crop", "Model sempurna", "Tidak perlu evaluasi lagi"],
         1,
         "Benar: heatmap = alat investigasi, bukan sertifikat. Shortcut lain bisa tetap ada."),
    ],
    "rangkuman": [
        "<strong>DICOM</strong> = piksel + metadata; metadata = PII yang wajib dianonimisasi.",
        "<strong>CNN</strong>: fitur bertingkat via konvolusi; <strong>transfer learning</strong> standar untuk data kecil.",
        "Label dari <strong>radiolog</strong> (multi-reader), bukan kode billing.",
        "Split <strong>per pasien/RS</strong>; evaluasi <strong>per mesin/RS</strong>.",
        "<strong>Shortcut learning</strong> adalah mode gagal #1 \u2014 uji crop + Grad-CAM + eksternal.",
        "Metrik klinis: <strong>sens/spes + PPV</strong> pada prevalensi target.",
        "AI citra = <strong>second reader/triase</strong>, bukan pengganti untuk kasus kompleks.",
        "Performa lab \u2260 lapangan: validasi eksternal + monitoring wajib.",
    ],
    "prev": ("hd14-nlp-klinis", "HD14"),
    "next": ("hd16-surveilans-wabah", "HD16"),
}

LESSONS = [HD11, HD12, HD13, HD14, HD15]
for L in LESSONS:
    qa_scan(L)
