#!/usr/bin/env python3
"""Health Data Scientist lessons HD1-HD5."""
from render import qa_scan

TRACK = "Health Data Scientist"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ HD1
HD1 = {
    "slug": "hd1-sistem-kesehatan",
    "code": "HD1",
    "track": TRACK,
    "cover_title": "EHR, Klaim &amp; Registri:<br />Dari Mana Data Kesehatan Berasal",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Satu Pasien, Lima Versi Cerita"),
        ("ehr", "EHR \u2014 Si Pencatat Sibuk"),
        ("klaim", "Data Klaim \u2014 Si Tukang Tagih"),
        ("registri", "Registri, Surveilans &amp; Wearable"),
        ("skala", "Skala Data: Kenapa Butuh Spark"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Kelengkapan Data EHR"),
        ("lab2", "\U0001f52c Lab 2: Grain Klaim vs EHR"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menyebutkan 6 sumber data kesehatan utama (EHR, klaim, registri, trial, wearable, imaging) beserta <strong>tujuan aslinya</strong> dikumpulkan.",
        "Menjelaskan mengapa data yang dikumpulkan untuk <strong>layanan/billing</strong> berbahaya jika langsung dipakai untuk <strong>riset</strong> tanpa penyesuaian.",
        "Menghitung <strong>kelengkapan data</strong> per field dan mengaitkannya dengan bias analisis.",
        "Memilih sumber data yang tepat untuk 5 skenario analisis (peta keputusan).",
    ],
    "story_title": "Cerita Pembuka: Satu Pasien, Lima Versi Cerita",
    "story": [
        "<p>Pak Budi, 58 tahun, diabetes. Di <strong>EHR</strong> puskesmas, tercatat: gula darah 240, diberi metformin. Di <strong>klaim BPJS</strong>, tercatat: satu kunjungan rawat jalan, tarif INA-CBG sekian rupiah \u2014 tanpa angka gula darahnya. Di <strong>registri diabetes</strong> (kalau ia terdaftar), tercatat: HbA1c tiap 6 bulan selama 5 tahun. Di <strong>smartwatch</strong>-nya: detak jantung dan langkah harian. Di <strong>hasil lab</strong>: file PDF terpisah.</p>",
        "<p>Lima sumber, lima versi cerita tentang <em>orang yang sama</em> \u2014 dan tidak ada satupun yang lengkap sendirian. Inilah realitas data kesehatan: <strong>terfragmentasi sejak lahir</strong>, karena tiap sumber dibuat untuk tujuan berbeda. Analis yang tidak paham tujuan asli tiap sumber akan menarik kesimpulan dari cerita yang salah.</p>",
    ],
    "konsep": [
        {
            "id": "ehr",
            "title": "EHR \u2014 Si Pencatat Sibuk",
            "definisi": "Electronic Health Record (di Indonesia: RME/Rekam Medis Elektronik, mis. SATUSEHAT) adalah catatan klinis digital: diagnosis, tindakan, obat, hasil lab, dan catatan narasi dokter. Tujuan aslinya: <strong>melayani pasien</strong>, bukan untuk dianalisis.",
            "rumus": r"\text{Kelengkapan} = \frac{\text{field terisi}}{\text{field wajib}} \times 100\%",
            "simbol": [
                (r"\text{field terisi}", "jumlah field yang benar-benar ada nilainya pada satu record"),
                (r"\text{field wajib}", "jumlah field yang seharusnya diisi menurut SOP"),
            ],
            "interpretasi": "Kelengkapan 60% artinya 40% informasi hilang \u2014 dan hilangnya jarang acak: dokter sibuk cenderung melewatkan field yang tidak memengaruhi tindakan.",
            "worked": (
                "\U0001f4d0 Contoh langkah-demi-langkah (klik untuk buka)",
                "<p>100 record pasien rawat jalan. Field &ldquo;riwayat merokok&rdquo; terisi di 35 record.<br />"
                "<strong>Langkah 1</strong> \u2014 field terisi = 35.<br />"
                "<strong>Langkah 2</strong> \u2014 field wajib = 100.<br />"
                "<strong>Langkah 3</strong> \u2014 kelengkapan = 35/100 \u00d7 100% = <strong>35%</strong>.</p>"
                "<p>Kesimpulan: analisis &ldquo;pengaruh merokok&rdquo; dari EHR ini berbahaya \u2014 65% data hilang, kemungkinan besar bukan acak.</p>",
            ),
            "kepribadian": "EHR itu seperti buku harian dokter yang ditulis sambil lari: kaya detail klinis, tapi berantakan, tidak konsisten antar dokter, dan penuh singkatan. Ia paling jujur soal <em>apa yang terjadi di ruang periksa</em> \u2014 dan paling berisik soal sisanya.",
            "kapan": "Butuh perjalanan klinis detail per pasien: urutan diagnosis, respons obat, catatan gejala. Syarat: siap membersihkan data narasi dan inkonsistensi.",
            "chart": {
                "var": "hd1CompleteData",
                "data": [{"x": ["Diagnosis (ICD)", "Obat diresepkan", "Hasil lab", "Riwayat merokok", "Catatan gejala", "Alergi"], "y": [98, 92, 70, 35, 55, 40], "type": "bar", "marker": {"color": "#2a7de1"}, "text": [98, 92, 70, 35, 55, 40], "textposition": "outside"}],
                "title": "Kelengkapan Field EHR \u2014 Puskesmas X (n=1.000 record)",
                "layout": {"xaxis": {"title": "Field"}, "yaxis": {"title": "Kelengkapan (%)", "range": [0, 110]}, "showlegend": False},
                "cara": "Sumbu horizontal = nama field, tinggi batang = persen record yang field-nya terisi. Bandingkan tinggi antar batang: makin pendek, makin banyak yang hilang.",
                "interpretasi": "Field administratif/penagihan (diagnosis, obat) hampir 100% terisi \u2014 karena memengaruhi pembayaran. Field perilaku (merokok, alergi) jeblok di 35\u201340%. Pola ini universal: <strong>data terisi mengikuti insentif pengisinya</strong>, bukan kebutuhan analismu. Inilah kenapa analisis faktor risiko dari EHR mentah sering bias.",
            },
        },
        {
            "id": "klaim",
            "title": "Data Klaim \u2014 Si Tukang Tagih",
            "definisi": "Data klaim (di Indonesia: BPJS Kesehatan) mencatat <strong>apa yang ditagihkan</strong>: kode diagnosis (ICD-10), tindakan, dan tarif INA-CBG per episode perawatan. Tujuan aslinya: <strong>pembayaran</strong>, bukan kebenaran klinis.",
            "kepribadian": "Data klaim itu seperti struk belanja: rapi, terstandar, mencakup hampir seluruh populasi peserta \u2014 tapi hanya mencatat yang <em>dibayar</em>. Obat yang dibeli sendiri di apotek? Tidak ada. Pasien yang tidak berobat? Tidak ada. Ia jujur soal uang, bisu soal kesehatan yang sebenarnya.",
            "kapan": "Butuh gambaran utilisasi layanan dan biaya di level populasi: tren kunjungan, beban biaya per penyakit, perbandingan antar wilayah. Jangan pakai untuk prevalensi penyakit yang sebenarnya.",
            "warning": "<strong>Jebakan klasik:</strong> menghitung prevalensi diabetes dari klaim BPJS hanya menangkap <em>diabetes yang terdiagnosis dan berobat</em>. Riskesdas 2018 menemukan sebagian besar diabetes di Indonesia <strong>tidak terdiagnosis</strong> \u2014 klaim akan meremehkan prevalensi sebenarnya secara sistematis.",
        },
        {
            "id": "registri",
            "title": "Registri, Surveilans &amp; Wearable \u2014 Para Spesialis",
            "definisi": "<strong>Registri</strong> mengikuti kohort penyakit spesifik dari waktu ke waktu (mis. registri kanker, TB). <strong>Surveilans</strong> (mis. SKDR/EWARS) memantau sinyal wabah secara rutin. <strong>Trial klinis</strong> menghasilkan data paling bersih karena protokolnya ketat. <strong>Wearable/imaging</strong> memberi data fisiologis kontinu dan citra.",
            "kepribadian": "Mereka spesialis: registri dalam tapi sempit (satu penyakit), surveilans cepat tapi kasar (sinyal, bukan diagnosis), trial bersih tapi artifisial (populasi terpilih), wearable kontinu tapi berisik (artefak gerakan). Pilih sesuai pertanyaan \u2014 jangan pukul paku dengan obeng.",
            "kapan": "Registri untuk outcome jangka panjang satu penyakit; surveilans untuk deteksi dini wabah; trial untuk efikasi obat; wearable untuk monitoring kontinu; imaging untuk diagnosis berbasis citra.",
            "code_display": ("text",
                "Sumber data        | Grain (1 baris =)      | Kekuatan utama\n"
                "-------------------|------------------------|---------------------------\n"
                "EHR / RME          | 1 kunjungan / 1 pasien | Detail klinis longitudinal\n"
                "Klaim BPJS         | 1 episode penagihan    | Cakupan populasi, biaya\n"
                "Registri penyakit  | 1 pasien terdaftar     | Follow-up outcome spesifik\n"
                "Surveilans (EWARS) | 1 laporan mingguan     | Kecepatan sinyal wabah\n"
                "Trial klinis       | 1 peserta              | Data bersih, terstandar\n"
                "Wearable           | 1 pengukuran sensor    | Kontinu, real-world"),
        },
        {
            "id": "skala",
            "title": "Skala Data: Kenapa Lowongan Minta Spark",
            "definisi": "Satu RS besar menghasilkan jutaan record EHR per tahun; klaim BPJS mencakup ratusan juta peserta. Volume + heterogenitas ini membuat laptop dan pandas kewalahan \u2014 di sinilah <strong>komputasi terdistribusi (Apache Spark)</strong> dan cloud menjadi syarat di lowongan Health Data Scientist.",
            "rumus": r"\text{Waktu} \approx \frac{\text{Volume data}}{\text{Jumlah worker} \times \text{kecepatan per worker}}",
            "simbol": [
                (r"\text{Volume data}", "ukuran data, mis. 500 GB klaim 5 tahun"),
                (r"\text{Jumlah worker}", "mesin paralel di cluster Spark"),
            ],
            "interpretasi": "Rumus kasar ini menjelaskan intuisi paralelisme: 10 worker memproses kira-kira 10x lebih cepat (minus overhead). Skill-nya bukan menghafal Spark, tapi berpikir dalam <em>partisi dan agregasi terdistribusi</em>.",
            "kepribadian": "Data kesehatan itu 4V: volume besar, variety (teks, citra, kode, sinyal), velocity (streaming ICU/wearable), veracity (kualitas dipertanyakan). Analis yang hanya bisa Excel akan tenggelam di V pertama.",
            "kapan": "Data di atas ~10 GB, join multi-tabel ratusan juta baris, atau agregasi nasional: pikirkan Spark/pandas-terdistribusi, bukan loop Python.",
        },
    ],
    "myths": [
        ("Data EHR bisa langsung dipakai untuk riset karena digital dan lengkap",
         "EHR dikumpulkan untuk layanan, bukan riset: field penting untuk analis (gaya hidup, outcome jangka panjang) justru yang paling sering kosong, dan pengisiannya mengikuti insentif klinis/billing. Selalu audit kelengkapan dan pahami alur kerja pengisi sebelum percaya."),
        ("Data klaim BPJS = potret kesehatan populasi Indonesia",
         "Klaim hanya menangkap yang berobat dan terdiagnosis di faskes. Penyakit yang tidak terdiagnosis (banyak, menurut Riskesdas), berobat mandiri, atau di luar cakupan tidak tercatat. Klaim = potret <em>utilisasi layanan</em>, bukan potret <em>kesehatan</em>."),
        ("Makin besar data kesehatan, makin benar kesimpulannya",
         "Big data memperkecil <em>sampling error</em> tapi tidak menyentuh <em>bias sistematis</em>. Satu juta record klaim tetap meremehkan prevalensi diabetes yang tidak terdiagnosis \u2014 biasnya justru makin \u201cpresisi\u201d (salah dengan keyakinan tinggi)."),
    ],
    "tips": [
        "Selalu tanya dulu: <strong>untuk apa data ini dikumpulkan?</strong> Jawabannya memprediksi kolom mana yang bisa dipercaya, kolom mana yang jebakan \u2014 sebelum kamu buka satu file pun.",
        "Dokumentasikan <strong>grain</strong> tiap sumber dalam satu kalimat (\u201csatu baris = satu episode klaim\u201d). Sebagian besar kesalahan analisis data kesehatan berakar dari salah grain, bukan salah model.",
        "Untuk tiap proyek, buat <strong>kamus data mini</strong>: definisi tiap field, siapa pengisinya, insentif pengisiannya. Ini membedakan analis senior dari junior di mata hiring manager kesehatan.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Audit Kelengkapan Data EHR (Live Python)",
            "intro": "Simulasikan 1.000 record EHR dengan pola missing yang realistis (field billing rapi, field perilaku bolong), lalu hitung kelengkapannya. Ubah probabilitasnya dan lihat field mana yang paling berbahaya untuk analisis faktor risiko.",
            "hint": "Coba ubah prob_isi 'riwayat_merokok' dari 0.35 ke 0.9. Apakah masalahnya hilang? Sekarang ubah polanya: buat missing-nya bergantung pada usia (bukan acak) \u2014 apa yang terjadi pada interpretasimu?",
            "code": (
                "import random\n"
                "random.seed(42)\n"
                "n = 1000\n"
                "prob_isi = {'diagnosis_icd': 0.98, 'obat': 0.92, 'hasil_lab': 0.70,\n"
                "            'riwayat_merokok': 0.35, 'alergi': 0.40}\n"
                "print(f\"{'field':<18} {'terisi':>7} {'kelengkapan':>12}\")\n"
                "for field, p in prob_isi.items():\n"
                "    terisi = sum(1 for _ in range(n) if random.random() < p)\n"
                "    print(f\"{field:<18} {terisi:>7} {terisi/n*100:>10.1f}%\")\n"
                "print()\n"
                "print('Aturan: field < 70% -> JANGAN dipakai untuk analisis faktor risiko')\n"
                "print('tanpa investigasi mekanisme missing-nya (lihat HD8).')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Grain Klaim vs EHR \u2014 Jebakan Double Counting",
            "intro": "Satu pasien bisa punya 3 kunjungan EHR tapi 1 episode klaim (rawat inap). Agregasikan ke level pasien dan lihat bagaimana salah grain mengubah angka \u201cbiaya rata-rata per pasien\u201d.",
            "hint": "Ubah jumlah kunjungan pasien ke-3. Perhatikan: rata-rata per *kunjungan* vs per *pasien* vs per *episode klaim* memberi tiga angka berbeda dari data yang sama.",
            "code": (
                "# grain: 1 baris = 1 kunjungan EHR; klaim menggabungkan kunjungan rawat inap\n"
                "kunjungan = [  # (pasien, jenis, biaya_jt)\n"
                "    ('P1','rajal',0.5), ('P1','rajal',0.4),\n"
                "    ('P2','ranap',8.0), ('P2','ranap',7.5), ('P2','kontrol',0.3),\n"
                "    ('P3','rajal',0.6),\n"
                "]\n"
                "n_kunj = len(kunjungan)\n"
                "pasien = set(p for p,_,_ in kunjungan)\n"
                "episode_klaim = 4  # 2 rajal P1+P3, 1 ranap gabungan P2, 1 kontrol P2\n"
                "tot = sum(b for _,_,b in kunjungan)\n"
                "print(f'total biaya        = Rp{tot:.1f} jt')\n"
                "print(f'per kunjungan EHR  = Rp{tot/n_kunj:.2f} jt  (n={n_kunj})')\n"
                "print(f'per pasien         = Rp{tot/len(pasien):.2f} jt  (n={len(pasien)})')\n"
                "print(f'per episode klaim  = Rp{tot/episode_klaim:.2f} jt  (n={episode_klaim})')\n"
                "print()\n"
                "print('Satu data, tiga jawaban. Tulis grain-mu SEBELUM lapor angka.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh perjalanan klinis detail \u2192 EHR/RME",
            "kondisi": "Pertanyaan soal urutan kejadian klinis: gejala \u2192 diagnosis \u2192 obat \u2192 respons, per pasien.",
            "alasan": "Hanya EHR yang mencatat narasi dan hasil klinis longitudinal. Klaim tidak punya angka lab.",
            "contoh": "Membangun fenotipe \u201cpasien TB resisten obat\u201d dari riwayat hasil lab dan regimen.",
        },
        {
            "title": "Butuh biaya & utilisasi populasi \u2192 Klaim BPJS",
            "kondisi": "Pertanyaan soal beban sistem: berapa biaya, berapa kunjungan, di mana menumpuk.",
            "alasan": "Cakupan populasi terluas, terstandar INA-CBG, siap agregasi nasional.",
            "contoh": "Proyeksi beban biaya komplikasi diabetes per provinsi untuk perencanaan anggaran.",
            "chart": {
                "var": "hd1DmData",
                "data": [{"x": ["EHR", "Klaim", "Registri", "Surveilans", "Wearable"], "y": [9, 4, 8, 2, 6], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Detail klinis"},
                        {"x": ["EHR", "Klaim", "Registri", "Surveilans", "Wearable"], "y": [5, 10, 4, 7, 3], "type": "bar", "marker": {"color": "#e8a838"}, "name": "Cakupan populasi"}],
                "title": "Kekuatan Sumber Data (skor ilustratif 1\u201310)",
                "layout": {"barmode": "group", "xaxis": {"title": "Sumber"}, "yaxis": {"title": "Skor"}, "showlegend": True},
                "cara": "Dua kelompok batang per sumber: biru = kedalaman klinis, kuning = cakupan populasi. Tidak ada sumber yang menang di keduanya.",
                "interpretasi": "Trade-off fundamental: EHR dalam tapi sempit, klaim luas tapi dangkal. Pilih berdasarkan pertanyaan, bukan berdasarkan data yang paling gampang diakses.",
            },
        },
        {
            "title": "Butuh outcome jangka panjang satu penyakit \u2192 Registri",
            "kondisi": "Pertanyaan soal prognosis: survival 5 tahun kanker, kekambuhan TB.",
            "alasan": "Registri dirancang untuk follow-up terstandar pada satu kondisi.",
            "contoh": "Analisis faktor yang memprediksi kekambuhan TB paru dalam 2 tahun.",
        },
        {
            "title": "Butuh sinyal cepat wabah \u2192 Surveilans",
            "kondisi": "Pertanyaan soal deteksi dini: apakah kasus DBD naik di suatu kabupaten minggu ini.",
            "alasan": "EWARS/SKDR dirancang untuk kecepatan, bukan akurasi diagnosis.",
            "contoh": "Alert otomatis kenaikan kasus demam berdarah per kecamatan (lihat HD16).",
        },
        {
            "title": "Butuh data fisiologis kontinu \u2192 Wearable / IoT klinis",
            "kondisi": "Pertanyaan soal monitoring: deteksi dini perburukan pasien rawat jalan.",
            "alasan": "Satu-satunya sumber dengan resolusi menit/jam di dunia nyata.",
            "contoh": "Prediksi dekompensasi gagal jantung dari tren detak jantung dan aktivitas harian.",
        },
    ],
    "aturan10": [
        "Tanya tujuan asli pengumpulan data \u2014 sebelum buka file.",
        "Tulis grain dalam satu kalimat.",
        "Cek kelengkapan per field; < 70% = lampu kuning.",
        "Klaim = utilisasi, bukan kesehatan sebenarnya.",
    ],
    "case": {
        "title": "Prevalensi Diabetes: Klaim vs Riskesdas",
        "body": [
            "<p>Dinkes sebuah provinsi memintamu menghitung <strong>prevalensi diabetes</strong> penduduk dewasa. Kamu punya dua angka:</p>",
            "<ul><li><strong>Data klaim BPJS 2025:</strong> 4,2% peserta punya klaim dengan diagnosis diabetes (ICD-10 E10\u2013E14).</li>",
            "<li><strong>Riskesdas 2018</strong> (survei dengan pemeriksaan gula darah): prevalensi diabetes 10,9%, dan <strong>mayoritas tidak terdiagnosis</strong>.</li></ul>",
        ],
        "pertanyaan": "Angka mana yang kamu laporkan sebagai prevalensi, dan bagaimana kamu menjelaskan selisihnya ke Kepala Dinkes yang awam statistik?",
        "pembahasan": "Laporkan 10,9% (Riskesdas) sebagai estimasi prevalensi sebenarnya, karena survei memeriksa langsung sampel populasi \u2014 menangkap yang tidak terdiagnosis. Angka klaim 4,2% = prevalensi <em>terdiagnosis dan berobat</em>. Selisihnya justru insight: kesenjangan diagnosis ~6,7 poin persen = peluang program skrining. Penjelasan ke Kadinkes: \u201cKlaim itu seperti menghitung ikan dengan jala \u2014 yang tidak kena jala bukan berarti tidak ada ikannya.\u201d Jangan pernah sajikan angka klaim sebagai prevalensi tanpa kualifikasi ini.",
    },
    "quiz": [
        ("Tujuan asli data klaim BPJS dikumpulkan adalah\u2026",
         ["Mendukung riset epidemiologi nasional", "Dasar pembayaran layanan kesehatan (billing)", "Surveilans wabah real-time", "Skrining penyakit tidak menular"],
         1,
         "Benar: klaim = struk pembayaran. Konsekuensinya: ia rapi dan luas, tapi hanya mencatat yang ditagihkan \u2014 bukan potret kesehatan sebenarnya."),
        ("Field EHR dengan kelengkapan 35% (mis. riwayat merokok) dipakai untuk analisis faktor risiko tanpa investigasi. Masalah utamanya?",
         ["Tidak ada \u2014 35% dari 1.000 record masih 350 data", "Missing-nya kemungkinan tidak acak sehingga menimbulkan bias sistematis", "Komputer tidak bisa memproses data tidak lengkap", "Harus selalu dihapus saja"],
         1,
         "Benar: bahayanya bukan jumlah, tapi mekanisme. Dokter mencatat merokok saat relevan klinis \u2014 missing-nya terkait kondisi pasien (MNAR, lihat HD8). Analisis naif akan bias."),
        ("Untuk proyeksi beban biaya komplikasi diabetes per provinsi, sumber terbaik?",
         ["Catatan narasi EHR satu RS", "Data klaim BPJS", "Data smartwatch pasien", "Hasil trial klinis obat diabetes"],
         1,
         "Benar: klaim unggul di cakupan populasi + biaya terstandar INA-CBG. EHR satu RS tidak mewakili provinsi; trial terlalu terseleksi."),
        ("Satu pasien: 5 kunjungan EHR, 2 episode klaim. \u201cBiaya rata-rata per pasien\u201d yang benar memakai pembagi\u2026",
         ["5 (kunjungan)", "2 (episode)", "1 (pasien)", "Tergantung definisi grain yang dilaporkan"],
         3,
         "Benar: tidak ada jawaban tunggal yang selalu benar \u2014 ketiganya valid untuk pertanyaan berbeda. Yang wajib: tulis grain yang kamu pakai. Salah grain = salah cerita."),
        ("Lowongan Health Data Scientist meminta PySpark. Alasan paling masuk akal?",
         ["Spark membuat visualisasi lebih cantik", "Data klaim/EHR nasional berukuran ratusan GB\u2013TB, melebihi kapasitas pandas di satu mesin", "Spark wajib untuk semua analisis kesehatan", "Python biasa dilarang di RS"],
         1,
         "Benar: ini soal skala. Skill intinya berpikir terdistribusi (partisi, agregasi). Untuk data kecil, pandas tetap lebih praktis \u2014 jangan pakai meriam untuk nyamuk."),
        ("Riskesdas menemukan prevalensi diabetes 10,9% sementara klaim BPJS 4,2%. Interpretasi tepat?",
         ["Data klaim salah input", "Riskesdas melebih-lebihkan", "Klaim hanya menangkap yang terdiagnosis & berobat; selisihnya = kesenjangan diagnosis", "Keduanya tidak bisa dipakai"],
         2,
         "Benar: keduanya benar untuk tujuannya masing-masing. Selisihnya bukan error \u2014 melainkan temuan kebijakan: banyak kasus belum terjaring layanan."),
    ],
    "rangkuman": [
        "Enam sumber utama: <strong>EHR, klaim, registri, surveilans, trial, wearable/imaging</strong> \u2014 masing-masing lahir untuk tujuan berbeda.",
        "<strong>Tujuan asli pengumpulan</strong> memprediksi kolom mana yang bisa dipercaya.",
        "<strong>Klaim = utilisasi layanan</strong>, bukan potret kesehatan populasi.",
        "Kelengkapan field mengikuti <strong>insentif pengisi</strong>, bukan kebutuhan analis.",
        "Big data mengecilkan sampling error, <strong>tidak</strong> menghilangkan bias sistematis.",
        "Tulis <strong>grain</strong> dalam satu kalimat sebelum melaporkan angka apapun.",
        "Skala nasional butuh pola pikir <strong>terdistribusi</strong> (Spark); data kecil tetap pakai pandas.",
        "Setiap lesson berikutnya mengasumsikan kamu paham peta sumber data ini \u2014 tidak perlu dibaca ulang, cukup ingat trade-off-nya.",
    ],
    "prev": None,
    "next": ("hd2-standar", "HD2"),
}

# ================================================================ HD2
HD2 = {
    "slug": "hd2-standar",
    "code": "HD2",
    "track": TRACK,
    "cover_title": "ICD, SNOMED, FHIR:<br />Bahasa Bersama Data Kesehatan",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: \u201cDM\u201d yang Berarti Tiga Hal"),
        ("icd", "ICD \u2014 Si Kode Tagihan Sejuta Umat"),
        ("snomed", "SNOMED CT \u2014 Si Perfeksionis Klinis"),
        ("loinc", "LOINC, RxNorm &amp; OMOP"),
        ("fhir", "HL7 FHIR &amp; SATUSEHAT"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Mapping Kode Berantakan"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Pertukaran FHIR"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membedakan peran <strong>ICD, SNOMED CT, LOINC, RxNorm</strong>: apa yang dikodekan masing-masing dan kapan dipakai.",
        "Menjelaskan konsep <strong>interoperabilitas</strong> (FHIR/SATUSEHAT) dan <strong>common data model</strong> (OMOP CDM) dengan bahasa sendiri.",
        "Melakukan <strong>mapping kode lokal ke standar</strong> dan mengidentifikasi kode yang ambigu.",
        "Menilai risiko analisis yang memakai kode billing (ICD) sebagai proksi diagnosis klinis.",
    ],
    "story_title": "Cerita Pembuka: \u201cDM\u201d yang Berarti Tiga Hal",
    "story": [
        "<p>Di RS A, kolom diagnosis menulis &ldquo;DM&rdquo;. Di RS B, menulis &ldquo;Diabetes Mellitus&rdquo;. Di puskesmas C, menulis &ldquo;kencing manis&rdquo;. Analis junior menggabungkan tiga file dan menghitung pasien diabetes \u2014 hasilnya kacau: ada yang kehitung tiga kali, ada yang lolos. Padahal ketiganya maksudnya sama: <strong>E11</strong> (ICD-10: diabetes tipe 2).</p>",
        "<p>Standar kode kesehatan lahir untuk masalah sepele tapi mematikan ini: <strong>manusia menulis dengan bahasa, mesin butuh kode</strong>. Lesson ini memetakan siapa melakukan apa \u2014 karena memakai kode yang salah untuk pertanyaan yang salah adalah sumber bias paling sunyi di analitik kesehatan.</p>",
    ],
    "konsep": [
        {
            "id": "icd",
            "title": "ICD \u2014 Si Kode Tagihan Sejuta Umat",
            "definisi": "<strong>ICD (International Classification of Diseases)</strong>, kini ICD-10 (Indonesia) dan ICD-11 (WHO), mengklasifikasikan diagnosis untuk statistik dan billing. Satu kode = satu kategori penyakit, mis. E11 = diabetes melitus tipe 2, A15 = TB paru terkonfirmasi.",
            "kepribadian": "ICD itu seperti kode pos: cukup untuk mengantar surat (tagihan) ke kota yang benar, tapi tidak tahu isi rumahnya. Ia menjawab <em>kategori penyakit untuk dibayar</em> \u2014 bukan keparahan, bukan kepastian diagnosis.",
            "kapan": "Analisis utilisasi/biaya, statistik morbiditas nasional, grouping INA-CBG. Waspada saat dipakai sebagai label diagnosis pasti untuk model klinis.",
            "worked": (
                "\U0001f4d0 Contoh: membaca kode ICD-10",
                "<p>Kode <strong>J18.9</strong> (pneumonia, unspecified):<br />"
                "Huruf <strong>J</strong> = bab penyakit pernapasan; <strong>18</strong> = pneumonia; <strong>.9</strong> = tidak dirinci.<br />"
                "Untuk analisis &ldquo;pneumonia&rdquo;, kamu agregasi J12\u2013J18. Tapi J18.9 (&ldquo;unspecified&rdquo;) bisa jadi dokter tidak yakin \u2014 memakai semua J18.9 sebagai &ldquo;pasti pneumonia&rdquo; berisiko salah label.</p>",
            ),
            "warning": "<strong>Jebakan:</strong> kode ICD dipilih untuk <strong>maksimalkan klaim yang disetujui</strong>, bukan akurasi klinis. Fenomena &ldquo;upcoding&rdquo; (memilih kode berbayar lebih tinggi) nyata di sistem pembayaran prospektif seperti INA-CBG. Tren kenaikan suatu diagnosis di data klaim bisa berarti perubahan coding, bukan wabah.",
        },
        {
            "id": "snomed",
            "title": "SNOMED CT \u2014 Si Perfeksionis Klinis",
            "definisi": "<strong>SNOMED CT</strong> adalah terminologi klinis dengan 350.000+ konsep yang saling terhubung (ontologi): bukan sekadar kode, tapi jaringan makna \u2014 mis. &ldquo;diabetes tipe 2&rdquo; terkait dengan &ldquo;gangguan metabolik&rdquo;, &ldquo;pankreas&rdquo;, dan obat-obatnya.",
            "kepribadian": "Kalau ICD itu kode pos, SNOMED itu peta lengkap dengan setiap gang dan nomor rumah. Ia menjawab <em>apa yang sebenarnya terjadi secara klinis</em> \u2014 dengan harga: kompleksitas implementasi yang jauh lebih tinggi.",
            "kapan": "Fenotipe presisi untuk riset/model (mis. definisi kohort &ldquo;gagal jantung dengan fraksi ejeksi rendah&rdquo;), dokumentasi klinis terstruktur. Di Indonesia adopsinya masih bertahap \u2014 kenali, tapi jangan asumsikan datamu memakainya.",
            "chart": {
                "var": "hd2GranData",
                "data": [{"x": ["ICD-10", "SNOMED CT", "Teks bebas dokter"], "y": [14000, 350000, 1000000], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#94a3b8"]}, "text": ["14 rb", "350 rb+", "~tak hingga"], "textposition": "outside"}],
                "title": "Granularitas: Jumlah Konsep per Sistem (skala logaritmik konseptual)",
                "layout": {"xaxis": {"title": "Sistem"}, "yaxis": {"title": "Jumlah konsep", "type": "log"}, "showlegend": False},
                "cara": "Sumbu vertikal memakai skala logaritmik: tiap garis = kelipatan 10x. Bandingkan tinggi batang \u2014 makin tinggi, makin rinci kosakatanya.",
                "interpretasi": "Lompatan granularitasnya masif: ICD 14 ribu kategori vs SNOMED 350 ribu konsep vs teks bebas yang tak terbatas. Trade-off-nya: makin rinci makin ekspresif, tapi makin sulit diisi konsisten oleh dokter sibuk. Inilah kenapa ICD tetap merajai data operasional.",
            },
        },
        {
            "id": "loinc",
            "title": "LOINC, RxNorm &amp; OMOP \u2014 Spesialis dan Penerjemah",
            "definisi": "<strong>LOINC</strong> menstandarkan nama tes lab dan pengukuran (mis. HbA1c punya satu kode LOINC walau tiap RS menyebutnya beda). <strong>RxNorm</strong> menstandarkan nama obat. <strong>OMOP CDM</strong> (OHDSI) adalah <em>common data model</em>: skema database standar agar data banyak RS bisa dianalisis dengan query yang sama.",
            "kepribadian": "LOINC/RxNorm adalah kamus untuk hal yang paling berantakan di RS: nama tes dan obat lokal. OMOP adalah penerjemah PBB-nya: sekali datamu diterjemahkan ke OMOP, analis di negara lain bisa menjalankan analisismu tanpa mengubah query.",
            "kapan": "Harmonisasi multi-sumber: gabung data 5 RS dengan nama lab berbeda \u2192 map ke LOINC; riset kolaboratif multi-situs \u2192 OMOP CDM.",
            "code_display": ("text",
                "Nama lokal RS          ->  Standar\n"
                "----------------------------------------\n"
                "Gula darah puasa       ->  LOINC 1558-6 (glukosa puasa)\n"
                "HbA1c                  ->  LOINC 4548-4 (HbA1c)\n"
                "Metformin 500mg       ->  RxNorm 6809 (metformin)\n"
                "DM tipe 2              ->  ICD-10 E11 / SNOMED 44054006"),
        },
        {
            "id": "fhir",
            "title": "HL7 FHIR &amp; SATUSEHAT \u2014 Tukang Pos Antar Sistem",
            "definisi": "<strong>HL7 FHIR</strong> adalah standar pertukaran data kesehatan berbasis API modern (REST + JSON): data dipecah jadi &ldquo;resources&rdquo; (Patient, Observation, Medication). <strong>SATUSEHAT</strong> adalah platform Indonesia yang mewajibkan faskes bertukar data via FHIR.",
            "rumus": r"\text{Interoperabilitas} = \text{standar sintaks (FHIR)} + \text{standar makna (terminologi)}",
            "simbol": [
                (r"\text{standar sintaks}", "format pertukaran: FHIR resources, JSON"),
                (r"\text{standar makna}", "kode yang dipakai di dalamnya: ICD/SNOMED/LOINC"),
            ],
            "interpretasi": "FHIR tanpa terminologi standar = amplop rapi berisi surat bahasa alien: terkirim, tapi tidak dimengerti. Interoperabilitas butuh keduanya.",
            "kepribadian": "FHIR itu seperti protokol pos modern: amplop standar, alamat standar, bisa dilacak. Ia tidak peduli isi suratnya bahasa apa \u2014 itu urusan ICD/SNOMED. Jangan tertukar antara &ldquo;datanya sampai&rdquo; dengan &ldquo;datanya bermakna sama&rdquo;.",
            "kapan": "Integrasi antar sistem (RS \u2194 puskesmas \u2192 SATUSEHAT), aplikasi yang butuh data pasien real-time. Untuk analis: pahami strukturnya agar bisa query API, bukan sekadar file.",
            "code_display": ("json",
                '{\n  "resourceType": "Observation",\n  "code": { "coding": [{ "system": "LOINC", "code": "4548-4" }] },\n  "subject": { "reference": "Patient/123" },\n  "valueQuantity": { "value": 8.2, "unit": "%" }\n}'),
        },
    ],
    "myths": [
        ("Kalau datanya sudah pakai ICD-10 berarti diagnosisnya pasti benar",
         "ICD-10 di data operasional dioptimasi untuk billing. Kode bisa dipilih agar klaim lolos (upcoding), diagnosis kerja yang belum pasti tetap diberi kode, dan &ldquo;unspecified&rdquo; (.9) sering berarti ketidakpastian. Untuk label model klinis, validasi silang dengan data lab/obat (lihat HD11 fenotipe)."),
        ("FHIR/SATUSEHAT menyelesaikan masalah kualitas data",
         "FHIR menyelesaikan masalah <em>pertukaran</em> (sintaks), bukan masalah <em>makna dan kelengkapan</em>. Data yang terkirim rapi via FHIR tetap bisa salah kode, tidak lengkap, atau tidak sebanding antar faskes. Interoperabilitas \u2260 kualitas."),
        ("SNOMED CT selalu lebih baik dari ICD, jadi semua harus pakai SNOMED",
         "Lebih rinci \u2260 lebih baik untuk semua keperluan. SNOMED butuh dokumentasi klinis yang disiplin; di faskes sibuk, memaksanya menghasilkan kode asal-asalan yang lebih buruk dari ICD sederhana yang diisi benar. Pilih sesuai kapasitas pengisi."),
    ],
    "tips": [
        "Saat menerima dataset baru, hal pertama: <strong>identifikasi sistem kodenya</strong> (ICD-10? lokal? campuran?) sebelum menghitung apapun. Satu kolom &ldquo;diagnosis&rdquo; bisa berisi tiga sistem kode sekaligus.",
        "Bedakan <strong>kode billing vs kode klinis</strong> di kepalamu setiap saat. Kalau analisismu soal uang \u2192 ICD cukup. Kalau soal kebenaran medis \u2192 butuh validasi berlapis.",
        "Untuk proyek multi-RS, tanyakan: &ldquo;apakah ada <strong>mapping ke OMOP/LOINC</strong>?&rdquo; Kalau belum ada, alokasikan 30\u201350% waktu proyek untuk harmonisasi \u2014 ini normal, bukan kegagalan perencanaan.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Mapping Kode Diagnosis Berantakan",
            "intro": "Diberikan daftar diagnosis teks bebas dari tiga faskes, petakan ke ICD-10 dengan kamus sederhana. Lihat berapa yang ambigu dan butuh adjudikasi manusia.",
            "hint": "Tambahkan varian tulisanmu sendiri (mis. 'kencing manis', 'DM2'). Hitung: berapa persen yang tidak ke-mapping? Itulah biaya tidak adanya standar di titik input.",
            "code": (
                "kamus = {'diabetes melitus': 'E11', 'dm tipe 2': 'E11', 'dm': 'E11?',\n"
                "         'tb paru': 'A15', 'tbc': 'A15', 'hipertensi': 'I10',\n"
                "         'darah tinggi': 'I10', 'pneumonia': 'J18.9'}\n"
                "data = ['DM', 'diabetes melitus', 'kencing manis', 'TBC', 'tb paru',\n"
                "        'Hipertensi', 'darah tinggi', 'pneumonia', 'batuk pilek']\n"
                "ok, ambigu, gagal = 0, 0, 0\n"
                "for d in data:\n"
                "    kode = kamus.get(d.lower(), None)\n"
                "    if kode is None:\n"
                "        gagal += 1; status = 'GAGAL -> butuh manusia'\n"
                "    elif kode.endswith('?'):\n"
                "        ambigu += 1; status = f'AMBIGU ({kode})'\n"
                "    else:\n"
                "        ok += 1; status = f'OK ({kode})'\n"
                "    print(f'{d:<18} {status}')\n"
                "print()\n"
                "print(f'OK {ok}/{len(data)}, ambigu {ambigu}, gagal {gagal}')\n"
                "print('Pelajaran: kamus tidak menyelesaikan ambiguitas singkatan.')\n"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Simulasi Resource FHIR Observation",
            "intro": "Bangun dict JSON ala FHIR Observation untuk hasil HbA1c, lalu validasi: apakah code memakai sistem standar? Ubah system jadi teks bebas dan lihat validasi gagal.",
            "hint": "Ganti 'system': 'http://loinc.org' menjadi 'system': 'lokal-rs'. Fungsi validasi harus menolaknya \u2014 itulah beda sintaks valid vs makna standar.",
            "code": (
                "obs = {'resourceType': 'Observation',\n"
                "       'code': {'coding': [{'system': 'http://loinc.org',\n"
                "                             'code': '4548-4',\n"
                "                             'display': 'HbA1c'}]},\n"
                "       'subject': {'reference': 'Patient/123'},\n"
                "       'valueQuantity': {'value': 8.2, 'unit': '%'}}\n"
                "STANDAR = {'http://loinc.org', 'http://snomed.info/sct',\n"
                "           'http://hl7.org/fhir/sid/icd-10'}\n"
                "def validasi(o):\n"
                "    codings = o['code']['coding']\n"
                "    sistem = {c['system'] for c in codings}\n"
                "    if not sistem & STANDAR:\n"
                "        return 'GAGAL: tidak memakai terminologi standar'\n"
                "    if o['valueQuantity']['value'] <= 0:\n"
                "        return 'GAGAL: nilai tidak masuk akal'\n"
                "    return 'LOLOS: sintaks + terminologi standar'\n"
                "print(validasi(obs))\n"
                "obs['code']['coding'][0]['system'] = 'kode-lokal-rs'\n"
                "print(validasi(obs), '<- ubah system, langsung gagal')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Analisis biaya/utilisasi \u2192 ICD-10 + INA-CBG",
            "kondisi": "Pertanyaan tentang uang dan volume layanan.",
            "alasan": "ICD adalah bahasa billing; grouping INA-CBG sudah terstandar nasional.",
            "contoh": "Rata-rata tarif klaim stroke per kelas RS.",
        },
        {
            "title": "Definisi kohort presisi \u2192 SNOMED CT + LOINC + RxNorm",
            "kondisi": "Pertanyaan klinis yang butuh kepastian: siapa benar-benar gagal jantung.",
            "alasan": "Butuh granularitas dan validasi silang antar domain (diagnosis + lab + obat).",
            "contoh": "Kohort \u201cCKD stage 3\u201d: eGFR (LOINC) + kode CKD, bukan sekadar ICD N18.",
        },
        {
            "title": "Gabung data multi-RS \u2192 OMOP CDM",
            "kondisi": "Banyak sumber, skema berbeda, analisis harus konsisten.",
            "alasan": "Sekali mapping ke OMOP, satu query jalan di semua situs (jaringan OHDSI).",
            "contoh": "Studi multi-RS: efek obat antihipertensi terhadap stroke.",
        },
        {
            "title": "Integrasi real-time antar sistem \u2192 FHIR / SATUSEHAT",
            "kondisi": "Data harus mengalir antar aplikasi/faskes, bukan file bulanan.",
            "alasan": "API standar, resources terdokumentasi, didukung regulasi nasional.",
            "contoh": "Aplikasi rujukan: puskesmas kirim ringkasan pasien ke RS via SATUSEHAT.",
        },
    ],
    "aturan10": [
        "Identifikasi sistem kode dulu, hitung kemudian.",
        "ICD = bahasa uang; SNOMED = bahasa klinis.",
        "FHIR = amplop; terminologi = isi surat.",
        "Multi-situs? Tanya OMOP sebelum nulis query.",
    ],
    "case": {
        "title": "Tren TB \u201cNaik\u201d Setelah Pelatihan Coding",
        "body": [
            "<p>Dinkes melaporkan: kasus TB (ICD A15\u2013A19) di klaim naik <strong>40%</strong> dalam 6 bulan setelah pelatihan coding untuk petugas klaim. Media menulis \u201cwabah TB\u201d. Kamu diminta verifikasi sebelum anggaran darurat digelontorkan.</p>",
            "<p>Data yang kamu tarik: (a) klaim A15\u2013A19 naik 40%; (b) <strong>resep OAT (obat anti-TB)</strong> di data farmasi naik hanya 5%; (c) <strong>hasil lab BTA positif</strong> di EHR naik 3%.</p>",
        ],
        "pertanyaan": "Apakah ini wabah TB? Apa penjelasan paling masuk akal dan apa rekomendasi aksimu?",
        "pembahasan": "Bukan wabah \u2014 ini artefak coding. Tiga sumber yang lebih dekat ke klinis (resep OAT, BTA positif) hampir datar, sementara kode billing melonjak tepat setelah pelatihan coding. Penjelasan: petugas kini memberi kode TB lebih agresif/lengkap (dulu mungkin terkode sebagai \u201cbatuk\u201d atau ISPA). Rekomendasi: (1) batalkan narasi wabah; (2) tetapkan definisi kasus TB untuk surveilans berbasis BTA/resep, bukan klaim mentah; (3) catat periode pelatihan sebagai <em>breakpoint</em> di semua tren diagnosis ke depan. Pelajaran abadi: perubahan administratif meniru wabah di data klaim.",
    },
    "quiz": [
        ("E11 dalam ICD-10 adalah\u2026",
         ["Kode billing untuk diabetes tipe 2", "Kode LOINC untuk HbA1c", "Resource FHIR untuk observasi", "Konsep SNOMED untuk pankreas"],
         0,
         "Benar: E11 = diabetes melitus tipe 2 di ICD-10. Ingat: ini kategori billing/statistik, bukan vonis klinis final."),
        ("Perbedaan utama SNOMED CT vs ICD?",
         ["SNOMED untuk billing, ICD untuk klinis", "SNOMED adalah ontologi klinis 350rb+ konsep yang saling terkait; ICD adalah klasifikasi statistik ~14rb kategori", "Keduanya identik, hanya nama beda", "ICD lebih rinci dari SNOMED"],
         1,
         "Benar. Analogi: ICD = kode pos, SNOMED = peta lengkap. Pilih sesuai kebutuhan: uang vs kebenaran klinis."),
        ("LOINC dipakai untuk menstandarkan\u2026",
         ["Diagnosis penyakit", "Nama tes laboratorium dan pengukuran klinis", "Nama obat", "Struktur database"],
         1,
         "Benar: LOINC = lab & observasi (HbA1c = 4548-4). Obat = RxNorm, diagnosis = ICD/SNOMED."),
        ("FHIR menyelesaikan masalah interoperabilitas sintaks. Apa yang TIDAK diselesaikannya?",
         ["Format pertukaran antar sistem", "Makna/kualitas kode di dalam resource (butuh terminologi standar)", "Pengiriman data real-time", "Struktur resource"],
         1,
         "Benar: FHIR = amplop standar. Kalau isinya kode lokal ngawur, penerima tetap tidak paham. Butuh ICD/SNOMED/LOINC di dalamnya."),
        ("OMOP CDM paling bernilai ketika\u2026",
         ["Satu RS menganalisis datanya sendiri", "Banyak RS dengan skema berbeda ingin menjalankan analisis yang sama", "Mengirim data via API", "Menghitung tarif INA-CBG"],
         1,
         "Benar: OMOP = common data model untuk riset multi-situs (jaringan OHDSI). Sekali mapping, satu query untuk semua."),
        ("Klaim TB naik 40% pasca pelatihan coding, tapi resep OAT datar. Kesimpulan?",
         ["Wabah TBConfirmed", "Artefak perubahan perilaku coding, bukan kenaikan kasus sebenarnya", "Resep OAT tidak relevan", "Pelatihan coding menyebabkan TB"],
         1,
         "Benar: triangulasi dengan sumber yang lebih dekat ke klinis (resep, lab) membatalkan hipotesis wabah. Selalu curigai breakpoint administratif."),
    ],
    "rangkuman": [
        "<strong>ICD</strong>: klasifikasi diagnosis untuk billing/statistik (~14rb kategori).",
        "<strong>SNOMED CT</strong>: ontologi klinis 350rb+ konsep untuk dokumentasi presisi.",
        "<strong>LOINC</strong>: standar nama tes lab/pengukuran. <strong>RxNorm</strong>: standar nama obat.",
        "<strong>FHIR/SATUSEHAT</strong>: standar <em>pertukaran</em> (sintaks); <strong>OMOP CDM</strong>: standar <em>model data</em> untuk riset multi-situs.",
        "Interoperabilitas = sintaks standar + makna standar. Satu saja tidak cukup.",
        "Kode billing (ICD) dioptimasi untuk pembayaran \u2014 validasi silang sebelum jadi label klinis.",
        "Perubahan administratif (pelatihan coding, ganti tarif) meniru wabah/tren di data klaim.",
        "Alokasikan 30\u201350% waktu proyek multi-RS untuk harmonisasi \u2014 itu normal.",
    ],
    "prev": ("hd1-sistem-kesehatan", "HD1"),
    "next": ("hd3-epidemiologi", "HD3"),
}

# ================================================================ HD3
HD3 = {
    "slug": "hd3-epidemiologi",
    "code": "HD3",
    "track": TRACK,
    "cover_title": "Insidens, Prevalensi, RR:<br />Bahasa Angka Epidemiologi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Desa A vs Desa B"),
        ("insidens", "Insidens &amp; Prevalensi \u2014 Si Kembar yang Tertukar"),
        ("rr", "RR, OR, HR \u2014 Si Pembanding Risiko"),
        ("nnt", "NNT &amp; Standardisasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Hitung Insidens &amp; Prevalensi"),
        ("lab2", "\U0001f52c Lab 2: RR vs OR \u2014 Kapan Beda Jauh"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menghitung <strong>insidens, prevalensi, RR, OR, ARR, NNT</strong> dari tabel 2\u00d72 dengan benar.",
        "Menjelaskan dengan bahasa sendiri kapan memakai RR vs OR vs HR.",
        "Menghitung <strong>angka terstandardisasi</strong> untuk membandingkan dua populasi berstruktur umur beda.",
        "Mendeteksi kesalahan umum: memakai prevalensi untuk klaim kausal, OR sebagai RR pada penyakit umum.",
    ],
    "story_title": "Cerita Pembuka: Desa A vs Desa B",
    "story": [
        "<p>Dua desa, masing-masing 1.000 penduduk. Desa A melaporkan <strong>50 kasus TB tahun ini</strong>, Desa B <strong>30 kasus</strong>. Kepala dinas menyimpulkan: \u201cDesa A dua kali lebih parah, kirim tim ke sana!\u201d Tapi epidemiolog meminta data mentah: ternyata di Desa A, 40 dari 50 kasus adalah <strong>kasus lama yang masih berobat</strong> (prevalensi), kasus <em>baru</em> hanya 10. Di Desa B, 25 dari 30 adalah kasus <strong>baru</strong> (insidens).</p>",
        "<p>Penularan aktif justru lebih panas di Desa B. Satu kata yang tertukar \u2014 insidens vs prevalensi \u2014 nyaris membuat intervensi salah sasaran. Lesson ini memastikan kamu tidak pernah menukar keduanya, plus seluruh kosakata angka epidemiologi yang dipakai di jurnal, laporan Dinkes, dan brosur obat.</p>",
    ],
    "konsep": [
        {
            "id": "insidens",
            "title": "Insidens &amp; Prevalensi \u2014 Si Kembar yang Tertukar",
            "definisi": "<strong>Insidens</strong> = kasus <em>baru</em> per populasi berisiko per periode (mengukur kecepatan penularan/kejadian). <strong>Prevalensi</strong> = <em>seluruh</em> kasus (baru + lama) per populasi pada satu titik waktu (mengukur beban).",
            "rumus": r"\text{Insidens} = \frac{\text{kasus baru}}{\text{populasi berisiko}} \quad ; \quad \text{Prevalensi} = \frac{\text{semua kasus}}{\text{total populasi}}",
            "simbol": [
                (r"\text{kasus baru}", "orang yang pertama kali didiagnosis dalam periode amatan"),
                (r"\text{populasi berisiko}", "orang yang <em>bisa</em> terkena (yang sudah sakit dikeluarkan dari pembagi!)"),
                (r"\text{semua kasus}", "kasus baru + kasus lama yang masih ada"),
            ],
            "interpretasi": "Insidens menjawab \u201cseberapa cepat penyakit menyebar\u201d; prevalensi menjawab \u201cberapa beban yang harus ditanggung sistem saat ini\u201d. Keduanya benar \u2014 untuk pertanyaan berbeda.",
            "worked": (
                "\U0001f4d0 Contoh: stunting di sebuah kecamatan",
                "<p>Populasi balita 2.000. Survei menemukan 400 balita stunting (200 kasus lama, 200 terdeteksi baru tahun ini).<br />"
                "<strong>Prevalensi</strong> = 400/2.000 = <strong>20%</strong> (beban saat ini).<br />"
                "Untuk insidens: populasi berisiko = 2.000 \u2212 200 (yang sudah stunting tidak \u201cberisiko jadi stunting\u201d) = 1.800.<br />"
                "<strong>Insidens</strong> = 200/1.800 = <strong>11,1%</strong> per tahun (kecepatan kasus baru).</p>",
            ),
            "kepribadian": "Insidens itu speedometer \u2014 mengukur laju. Prevalensi itu foto tangki bensin \u2014 mengukur isi saat ini. Kamu tidak menilai kecepatan mobil dari foto tangki, dan tidak menilai beban BBM dari speedometer.",
            "kapan": "Evaluasi penularan/intervensi pencegahan \u2192 insidens. Perencanaan kebutuhan layanan/obat \u2192 prevalensi.",
            "chart": {
                "var": "hd3IpData",
                "data": [{"x": ["2019", "2020", "2021", "2022", "2023"], "y": [8.2, 9.1, 10.5, 9.8, 8.9], "type": "scatter", "mode": "lines+markers", "name": "Insidens TB/100rb", "line": {"color": "#e8a838"}},
                        {"x": ["2019", "2020", "2021", "2022", "2023"], "y": [42, 48, 55, 58, 56], "type": "scatter", "mode": "lines+markers", "name": "Prevalensi DM/1.000", "yaxis": "y2", "line": {"color": "#2a7de1"}}],
                "title": "Insidens TB vs Prevalensi Diabetes (ilustratif, per 100rb / per 1.000)",
                "layout": {"xaxis": {"title": "Tahun"}, "yaxis": {"title": "Insidens TB per 100rb"}, "yaxis2": {"title": "Prevalensi DM per 1.000", "overlaying": "y", "side": "right"}, "showlegend": True},
                "cara": "Dua garis dengan sumbu kiri (kuning, insidens TB) dan kanan (biru, prevalensi DM). Baca tren masing-masing garis terhadap sumbunya sendiri \u2014 jangan bandingkan tinggi antar garis (satuannya beda!).",
                "interpretasi": "Insidens TB naik-turun mengikuti dinamika penularan dan penemuan kasus; prevalensi diabetes bergerak lambat naik karena penyakit kronis menumpuk (kasus lama tidak sembuh). Inilah sifatnya: <strong>insidens lincah, prevalensi lembam</strong>. Program pencegahan dinilai dari insidens; kebutuhan layanan dari prevalensi.",
            },
        },
        {
            "id": "rr",
            "title": "RR, OR, HR \u2014 Si Pembanding Risiko",
            "definisi": "<strong>RR (Relative Risk)</strong> = rasio risiko terpapar vs tidak terpapar. <strong>OR (Odds Ratio)</strong> = rasio odds (bukan risiko). <strong>HR (Hazard Ratio)</strong> = versi RR untuk data waktu-kejadian (survival).",
            "rumus": r"RR = \frac{a/(a+b)}{c/(c+d)} \quad ; \quad OR = \frac{a/b}{c/d} = \frac{ad}{bc}",
            "simbol": [
                (r"a", "terpapar dan sakit"),
                (r"b", "terpapar dan sehat"),
                (r"c", "tidak terpapar dan sakit"),
                (r"d", "tidak terpapar dan sehat"),
                (r"ad/bc", "rumus cepat OR dari tabel 2\u00d72"),
            ],
            "interpretasi": "RR = 2 artinya risiko kelompok terpapar <strong>dua kali lipat</strong>. OR \u2248 RR hanya jika penyakitnya <strong>jarang</strong> (<10%); pada penyakit umum OR melebih-lebihkan.",
            "worked": (
                "\U0001f4d0 Contoh: merokok dan TB (tabel 2\u00d72)",
                "<p>Tabel: perokok sakit 40 (a), perokok sehat 160 (b); bukan perokok sakit 10 (c), bukan perokok sehat 190 (d).<br />"
                "Risiko perokok = 40/200 = 0,20. Risiko bukan perokok = 10/200 = 0,05.<br />"
                "<strong>RR</strong> = 0,20/0,05 = <strong>4,0</strong> (risiko 4x lipat).<br />"
                "<strong>OR</strong> = (40\u00d7190)/(160\u00d710) = 7600/1600 = <strong>4,75</strong>.<br />"
                "Karena TB relatif jarang di sampel ini, OR (4,75) dekat dengan RR (4,0) \u2014 tapi tidak sama.</p>",
            ),
            "kepribadian": "RR itu jujur dan intuitif (\u201crisiko dua kali lipat\u201d). OR itu akuntan yang licin \u2014 muncul karena matematika regresi logistik, lalu disalahartikan sebagai RR. HR adalah RR yang sabar: membandingkan kecepatan kejadian sepanjang waktu.",
            "kapan": "Kohort/RCT \u2192 RR (risiko bisa dihitung langsung). Case-control \u2192 OR (hanya OR yang valid). Data survival \u2192 HR.",
            "warning": "<strong>Jebakan brosur obat:</strong> \u201cMenurunkan risiko 50%!\u201d (RRR = 50%) terdengar hebat \u2014 tapi jika risiko awal 2% menjadi 1%, penurunan absolutnya hanya <strong>1 poin persen</strong>. Selalu tanya risiko absolutnya (lihat NNT di bawah).",
        },
        {
            "id": "nnt",
            "title": "NNT &amp; Standardisasi \u2014 Si Penerjemah Keputusan",
            "definisi": "<strong>ARR</strong> (Absolute Risk Reduction) = selisih risiko absolut. <strong>NNT</strong> (Number Needed to Treat) = 1/ARR: berapa pasien harus diobati agar 1 pasien terbantu. <strong>Standardisasi</strong>: menyesuaikan angka agar dua populasi berstruktur umur beda bisa dibandingkan adil.",
            "rumus": r"NNT = \frac{1}{ARR} = \frac{1}{R_{kontrol} - R_{obat}}",
            "simbol": [
                (r"R_{kontrol}", "risiko kejadian pada kelompok kontrol (angka absolut, mis. 0,02)"),
                (r"R_{obat}", "risiko kejadian pada kelompok obat"),
                (r"ARR", "selisih absolut \u2014 fondasi NNT"),
            ],
            "interpretasi": "NNT = 50 artinya obati 50 pasien agar 1 terhindar dari kejadian. Makin kecil NNT, makin \u201cworth it\u201d intervensinya. NNT menerjemahkan statistik ke bahasa anggaran.",
            "worked": (
                "\U0001f4d0 Contoh: NNT obat pencegah stroke",
                "<p>Risiko stroke 5 tahun: kontrol 4% (0,04), obat 3% (0,03).<br />"
                "ARR = 0,04 \u2212 0,03 = 0,01.<br />"
                "<strong>NNT</strong> = 1/0,01 = <strong>100</strong>.<br />"
                "Artinya: obati 100 pasien selama 5 tahun untuk mencegah 1 stroke. Klaim \u201cefikasi 25%\u201d (relatif) vs realita \u201c100 orang diobati untuk 1 yang terbantu\u201d \u2014 keduanya benar, yang kedua jujur untuk pengambil keputusan.</p>",
            ),
            "kepribadian": "NNT adalah penerjemah: mengubah bahasa relatif ilmuwan (\u201c50%!\u201d) menjadi bahasa absolut bendahara (\u201c100 orang, sekian miliar\u201d). Standardisasi adalah wasit: memastikan pertandingan antar populasi adil walau komposisi umurnya beda.",
            "kapan": "Menilai kelayakan intervensi/program \u2192 NNT. Membandingkan angka kematian antar daerah dengan struktur umur beda \u2192 standardisasi (mis. AKI antar provinsi).",
        },
    ],
    "myths": [
        ("OR = RR, jadi bisa dibaca \u201crisiko X kali lipat\u201d",
         "Hanya jika penyakit jarang (<10%). Pada penyakit umum (mis. hipertensi 30%), OR bisa jauh lebih besar dari RR. Jurnal yang teliti menulis \u201codds\u201d, bukan \u201crisiko\u201d, saat melaporkan OR. Kalau kamu membaca OR sebagai RR pada penyakit umum, kamu melebih-lebihkan efek."),
        ("Prevalensi tinggi = penularan sedang tinggi",
         "Prevalensi tinggi bisa berarti: (a) banyak kasus baru, (b) kasus lama menumpuk karena tidak sembuh-sembuh (kronis), atau (c) skrining gencar menemukan kasus lama. Diabetes prevalensinya naik terus bukan karena penularannya meledak, tapi karena penderitanya hidup lama dengan penyakitnya."),
        ("Angka kematian kasar antar daerah bisa langsung dibandingkan",
         "Daerah dengan penduduk lebih tua otomatis angka kematian kasarnya lebih tinggi \u2014 walau layanan kesehatannya sama baik. Bandingkan dengan angka terstandardisasi umur (atau stratifikasi), иначе kamu menghukum daerah tua dan memuji daerah muda secara tidak adil."),
    ],
    "tips": [
        "Setiap kali melihat klaim \u201cX% lebih rendah/tinggi\u201d, tanya: <strong>relatif terhadap berapa absolutnya?</strong> 50% dari 2% dan 50% dari 40% adalah dunia yang berbeda.",
        "Hafalkan jembatan ini: <strong>insidens \u2192 kecepatan, prevalensi \u2192 beban, RR \u2192 kohort, OR \u2192 case-control, HR \u2192 waktu, NNT \u2192 keputusan</strong>. Enam kata kunci, satu peta.",
        "Untuk data Indonesia: biasakan baca angka dalam satuan baku \u2014 insidens TB per 100.000, AKI per 100.000 kelahiran hidup, prevalensi stunting dalam persen. Satuan yang salah = salah tafsir orde besarnya.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Kalkulator Epidemiologi 2\u00d72",
            "intro": "Masukkan a, b, c, d dari tabel 2\u00d72 (lihat konsep RR). Kode menghitung risiko, RR, OR, ARR, dan NNT sekaligus. Coba data merokok-TB di atas, lalu coba penyakit umum dan lihat OR vs RR.",
            "hint": "Coba skenario penyakit UMUM: a=60,b=40,c=30,d=70. Bandingkan OR vs RR \u2014 selisihnya jauh! Itulah kenapa OR tidak boleh dibaca sebagai \u201crisiko\u201d.",
            "code": (
                "a, b, c, d = 40, 160, 10, 190  # ubah sesukamu\n"
                "r1 = a/(a+b); r0 = c/(c+d)\n"
                "RR = r1/r0\n"
                "OR = (a*d)/(b*c)\n"
                "ARR = r1 - r0\n"
                "NNT = 1/abs(ARR) if ARR != 0 else float('inf')\n"
                "print(f'risiko terpapar     = {r1:.3f}')\n"
                "print(f'risiko tak terpapar = {r0:.3f}')\n"
                "print(f'RR  = {RR:.2f}  <- \u201crisiko {RR:.1f}x lipat\u201d')\n"
                "print(f'OR  = {OR:.2f}  <- hanya \u2248 RR bila penyakit jarang')\n"
                "print(f'ARR = {ARR:.3f} ({ARR*100:.1f} poin persen)')\n"
                "print(f'NNT = {NNT:.0f}  <- cegah paparan pada NNT orang = 1 kasus dicegah')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Standardisasi Umur \u2014 Wasit yang Adil",
            "intro": "Dua kabupaten: A (penduduk tua) dan B (penduduk muda). Angka kematian kasar A lebih tinggi. Hitung angka terstandardisasi dengan populasi standar dan buktikan siapa yang sebenarnya lebih baik.",
            "hint": "Ubah angka kematian kelompok tua di A. Pada titik berapa kesimpulan berbalik? Itulah sensitivitas perbandingan tanpa standardisasi.",
            "code": (
                "# kematian per kelompok umur (kasus, populasi)\n"
                "A = {'muda': (20, 8000), 'tua': (180, 2000)}\n"
                "B = {'muda': (30, 9000), 'tua': (90, 1000)}\n"
                "std_pop = {'muda': 8500, 'tua': 1500}  # populasi standar\n"
                "def kasar(d):\n"
                "    k = sum(v[0] for v in d.values()); p = sum(v[1] for v in d.values())\n"
                "    return k/p*1000\n"
                "def standar(d):\n"
                "    return sum(v[0]/v[1]*std_pop[k] for k,v in d.items())/sum(std_pop.values())*1000\n"
                "print(f'kasar  A={kasar(A):.1f}  B={kasar(B):.1f} per 1000  <- A terlihat lebih buruk')\n"
                "print(f'standar A={standar(A):.1f}  B={standar(B):.1f} per 1000  <- setelah disetarakan umur')\n"
                "print()\n"
                "print('Kesimpulan: A hanya \u2018terlihat\u2019 buruk karena penduduknya lebih tua.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Nilai kecepatan penularan \u2192 Insidens",
            "kondisi": "Butuh tahu apakah wabah meluas atau program pencegahan bekerja.",
            "alasan": "Hanya kasus baru yang mencerminkan dinamika saat ini.",
            "contoh": "Insidens TB per 100.000 untuk menilai program penemuan kasus aktif.",
        },
        {
            "title": "Rencanakan kebutuhan layanan \u2192 Prevalensi",
            "kondisi": "Butuh tahu beban yang harus ditanggung sistem sekarang.",
            "alasan": "Mencakup semua kasus yang butuh layanan, baru + lama.",
            "contoh": "Prevalensi diabetes untuk proyeksi kebutuhan insulin dan klinik.",
        },
        {
            "title": "Data kohort/RCT \u2192 RR",
            "kondisi": "Mengikuti kelompok dari paparan ke outcome; risiko terhitung langsung.",
            "alasan": "RR intuitif dan valid karena pembagi (populasi berisiko) diketahui.",
            "contoh": "Kohort: apakah merokok menaikkan risiko TB (RR=4).",
        },
        {
            "title": "Data case-control \u2192 OR",
            "kondisi": "Berangkat dari outcome (kasus vs kontrol), menengok ke belakang.",
            "alasan": "Risiko tidak bisa dihitung (sampling berbasis outcome); hanya OR yang valid.",
            "contoh": "Case-control: riwayat kontak TB pada kasus vs kontrol.",
            "chart": {
                "var": "hd3OrRrData",
                "data": [{"x": ["Penyakit jarang (2%)", "Penyakit umum (30%)"], "y": [2.1, 2.0], "type": "bar", "name": "RR", "marker": {"color": "#2a7de1"}},
                        {"x": ["Penyakit jarang (2%)", "Penyakit umum (30%)"], "y": [2.14, 3.5], "type": "bar", "name": "OR", "marker": {"color": "#e8a838"}}],
                "title": "OR vs RR: Dekat saat Jarang, Jauh saat Umum",
                "layout": {"barmode": "group", "xaxis": {"title": ""}, "yaxis": {"title": "Nilai"}, "showlegend": True},
                "cara": "Dua skenario (kiri: penyakit jarang, kanan: penyakit umum). Biru = RR, kuning = OR. Bandingkan tinggi biru vs kuning dalam tiap skenario.",
                "interpretasi": "Saat penyakit jarang, OR (2,14) hampir sama dengan RR (2,1) \u2014 aman dibaca mirip. Saat penyakit umum, OR (3,5) jauh melebih-lebihkan RR (2,0). Inilah visual dari aturan \u201cOR \u2248 RR hanya bila jarang\u201d.",
            },
        },
        {
            "title": "Data waktu-kejadian \u2192 HR",
            "kondisi": "Outcome berupa waktu sampai kejadian dengan sensor (lihat HD6).",
            "alasan": "HR membandingkan laju kejadian sepanjang kurun follow-up.",
            "contoh": "Uji klinis: HR kematian obat baru vs standar = 0,7.",
        },
    ],
    "aturan10": [
        "Kecepatan \u2192 insidens; beban \u2192 prevalensi.",
        "Kohort \u2192 RR; case-control \u2192 OR; survival \u2192 HR.",
        "OR dibaca sebagai \u201crisiko\u201d hanya bila penyakit jarang.",
        "Klaim relatif selalu tanyakan absolutnya (NNT).",
    ],
    "case": {
        "title": "Brosur Obat: \u201cTurunkan Risiko 50%!\u201d",
        "body": [
            "<p>Seorang sales farmasi menunjukkan brosur: obat baru menurunkan risiko kejadian jantung <strong>50%</strong> (RRR). Harganya Rp500 ribu/bulan. Kamu diminta Dinkes menilai apakah layak masuk formularium.</p>",
            "<p>Dari jurnalnya: risiko kejadian 5 tahun pada kontrol <strong>4%</strong>, pada obat <strong>2%</strong>. Efek samping serius: 1%.</p>",
        ],
        "pertanyaan": "Hitung ARR dan NNT. Apakah klaim 50% menyesatkan, dan apa rekomendasi formulariummu?",
        "pembahasan": "ARR = 4% \u2212 2% = 2% = 0,02. NNT = 1/0,02 = 50: obati 50 pasien 5 tahun untuk mencegah 1 kejadian. Klaim \u201c50%\u201d benar secara relatif tapi menyesatkan untuk keputusan: biaya = 50 \u00d7 Rp500rb \u00d7 60 bulan = Rp1,5 miliar per kejadian dicegah, plus 1% efek samping serius (\u2248 0,5 kasus per kejadian dicegah). Rekomendasi: batasi untuk pasien risiko tinggi saja (risiko basal besar \u2192 NNT kecil), bukan populasi umum. Pelajaran: analis yang hanya membaca relatif akan meloloskan obat mahal yang tidak cost-effective.",
    },
    "quiz": [
        ("Insidens mengukur\u2026",
         ["Total beban penyakit saat ini", "Kecepatan munculnya kasus baru per populasi berisiko", "Jumlah kematian", "Efektivitas obat"],
         1,
         "Benar: insidens = kasus baru / populasi berisiko / periode. Untuk beban saat ini pakai prevalensi."),
        ("Dalam tabel 2\u00d72 (a=40,b=160,c=10,d=190), RR adalah\u2026",
         ["4,75", "4,0", "0,25", "2,0"],
         1,
         "Benar: RR = (40/200)/(10/200) = 0,20/0,05 = 4,0. Yang 4,75 adalah OR = (40\u00d7190)/(160\u00d710)."),
        ("OR boleh dibaca sebagai \u201crisiko X kali lipat\u201d ketika\u2026",
         ["Selalu boleh", "Penyakitnya jarang (<10%)", "Sampelnya besar", "Penelitinnya RCT"],
         1,
         "Benar: hanya saat jarang OR \u2248 RR. Pada penyakit umum, OR melebih-lebihkan \u2014 baca sebagai odds, bukan risiko."),
        ("Risiko kontrol 4%, obat 3%. NNT adalah\u2026",
         ["25", "33", "100", "75"],
         2,
         "Benar: ARR = 0,01 \u2192 NNT = 100. Klaim relatif \u201c25%\u201d vs realita \u201c100 diobati untuk 1 terbantu\u201d."),
        ("Dua kabupaten dibandingkan angka kematian kasarnya. Kabupaten A (penduduk tua) lebih tinggi. Langkah benar?",
         ["Langsung simpulkan layanan A lebih buruk", "Hitung angka terstandardisasi umur dulu", "Pakai prevalensi saja", "Abaikan perbedaan umur"],
         1,
         "Benar: struktur umur mengacaukan perbandingan kasar. Standardisasi = wasit yang adil."),
        ("Studi case-control meneliti rokok dan kanker paru. Ukuran asosiasi yang valid?",
         ["RR", "OR", "HR", "NNT"],
         1,
         "Benar: case-control sampling berbasis outcome \u2014 risiko tak terhitung, hanya OR yang valid. (Untuk penyakit jarang, OR \u2248 RR.)"),
    ],
    "rangkuman": [
        "<strong>Insidens</strong> = kecepatan kasus baru; <strong>prevalensi</strong> = beban total saat ini.",
        "<strong>RR</strong> untuk kohort/RCT; <strong>OR</strong> untuk case-control; <strong>HR</strong> untuk data waktu-kejadian.",
        "OR \u2248 RR hanya bila penyakit <strong>jarang</strong>.",
        "<strong>ARR & NNT</strong> menerjemahkan klaim relatif ke bahasa keputusan.",
        "Bandingkan populasi dengan <strong>standardisasi</strong> (umur) agar adil.",
        "Populasi berisiko = keluarkan yang sudah sakit dari pembagi insidens.",
        "Selalu tanya angka absolut di balik persen relatif.",
        "Kosakata ini dipakai di semua lesson HD berikutnya \u2014 di luar kepala, bukan di catatan.",
    ],
    "prev": ("hd2-standar", "HD2"),
    "next": ("hd4-desain-studi", "HD4"),
}

# ================================================================ HD4
HD4 = {
    "slug": "hd4-desain-studi",
    "code": "HD4",
    "track": TRACK,
    "cover_title": "Kohort vs Case-Control:<br />Desain Studi dan Jebakan Bias",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Kopi, Rokok, dan Kanker"),
        ("desain", "Empat Desain \u2014 Empat Cara Bertanya"),
        ("bias", "Tiga Bias Besar: Seleksi, Informasi, Confounding"),
        ("hill", "Bradford Hill: Kapan Asosiasi Jadi Kausal"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi Confounding"),
        ("lab2", "\U0001f52c Lab 2: OR Terkoreksi vs Mentah"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membedakan <strong>kohort, case-control, cross-sectional, RCT</strong>: arah pertanyaan, ukuran efek yang valid, kekuatan dan kelemahan.",
        "Mengidentifikasi <strong>bias seleksi, bias informasi, dan confounding</strong> dalam skenario nyata.",
        "Menjelaskan mengapa <strong>adjustment</strong> (stratifikasi/regresi) bisa membalik kesimpulan.",
        "Menerapkan <strong>kriteria Bradford Hill</strong> untuk menilai klaim kausal dari studi observasional.",
    ],
    "story_title": "Cerita Pembuka: Kopi, Rokok, dan Kanker",
    "story": [
        "<p>Tahun 1980-an, studi observasional menemukan peminum kopi berisiko lebih tinggi terkena kanker pankreas. Media heboh. Lalu seseorang mengecek: peminum kopi berat ternyata juga <strong>lebih banyak merokok</strong> \u2014 dan rokoklah penyebab sebenarnya. Setelah memperhitungkan rokok, asosiasi kopi-kanker <strong>lenyap total</strong>.</p>",
        "<p>Inilah confounding: variabel ketiga yang menari di belakang layar, membuat dua hal yang tidak berhubungan terlihat berhubungan. Lesson ini melatih matamu melihat penari latar itu \u2014 skill yang membedakan analis yang dipercaya dokter dari analis yang ditertawakan di journal club.</p>",
    ],
    "konsep": [
        {
            "id": "desain",
            "title": "Empat Desain \u2014 Empat Cara Bertanya",
            "definisi": "<strong>Kohort</strong>: dari paparan \u2192 maju ke outcome (hitung RR). <strong>Case-control</strong>: dari outcome \u2192 mundur ke paparan (hitung OR). <strong>Cross-sectional</strong>: potret satu titik waktu (prevalensi). <strong>RCT</strong>: paparan diacak peneliti (standar emas kausalitas).",
            "kepribadian": "Kohort itu dokumenter yang mengikuti tokoh bertahun-tahun (mahal, lama, tapi alur jelas). Case-control itu detektif yang merekonstruksi masa lalu dari TKP (cepat, murah, tapi ingatan saksi bisa bias). Cross-sectional itu foto selfie (cepat, tapi tidak tahu mana dulu: ayam atau telur). RCT itu eksperimen lab (paling meyakinkan, paling mahal).",
            "kapan": "Penyakit jarang \u2192 case-control. Paparan jarang \u2192 kohort. Butuh cepat/murah/prevalensi \u2192 cross-sectional. Butuh bukti kausal kuat dan etis \u2192 RCT.",
            "worked": (
                "\U0001f4d0 Contoh: memilih desain untuk \u201crokok vs TB\u201d",
                "<p><strong>Kohort:</strong> rekrut 2.000 perokok + 2.000 bukan perokok sehat, ikuti 5 tahun, hitung insidens TB \u2192 RR. Mahal tapi temporal jelas.<br />"
                "<strong>Case-control:</strong> ambil 200 pasien TB + 200 kontrol sehat, tanya riwayat merokok \u2192 OR. Selesai 3 bulan, tapi ingatan bisa bias.<br />"
                "<strong>Cross-sectional:</strong> survei 5.000 orang sekaligus: status merokok + TB saat ini \u2192 prevalensi. Tidak bisa pastikan rokok dulu atau TB dulu.<br />"
                "<strong>RCT:</strong> acak orang jadi perokok?? <strong>Tidak etis</strong> \u2014 di sinilah observasional tak tergantikan.</p>",
            ),
            "chart": {
                "var": "hd4DesignData",
                "data": [{"x": ["Cross-sectional", "Case-control", "Kohort", "RCT"], "y": [2, 5, 8, 10], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Kekuatan bukti kausal", "text": [2, 5, 8, 10], "textposition": "outside"},
                        {"x": ["Cross-sectional", "Case-control", "Kohort", "RCT"], "y": [9, 7, 4, 2], "type": "bar", "marker": {"color": "#e8a838"}, "name": "Kecepatan/murah", "text": [9, 7, 4, 2], "textposition": "outside"}],
                "title": "Trade-off Desain Studi (skor ilustratif 1\u201310)",
                "layout": {"barmode": "group", "xaxis": {"title": "Desain"}, "yaxis": {"title": "Skor"}, "showlegend": True},
                "cara": "Biru = kekuatan bukti kausal, kuning = kecepatan/biaya murah. Baca per desain: tidak ada yang tinggi di keduanya.",
                "interpretasi": "Hierarki bukti berbanding terbalik dengan kepraktisan: RCT paling meyakinkan tapi paling lambat/mahal; cross-sectional tercepat tapi paling lemah. Inilah kenapa dunia nyata didominasi observasional \u2014 dan kenapa skill membaca bias observasional sangat mahal harganya.",
            },
        },
        {
            "id": "bias",
            "title": "Tiga Bias Besar: Seleksi, Informasi, Confounding",
            "definisi": "<strong>Bias seleksi</strong>: sampel tidak mewakili (mis. healthy worker effect). <strong>Bias informasi</strong>: pengukuran salah (recall bias, misclassification). <strong>Confounding</strong>: variabel ketiga terkait paparan dan outcome, mengacaukan asosiasi.",
            "rumus": r"\text{Asosiasi teramati} = \text{efek sebenarnya} + \text{bias}",
            "simbol": [
                (r"\text{efek sebenarnya}", "hubungan kausal yang ingin diukur"),
                (r"\text{bias}", "distorsi dari seleksi/pengukuran/confounding \u2014 bisa positif atau negatif"),
            ],
            "interpretasi": "Rumus konseptual ini mengingatkan: angka yang kamu hitung selalu campuran efek + bias. Tugas analis adalah memperkecil suku kedua, bukan berpura-pura ia nol.",
            "worked": (
                "\U0001f4d0 Contoh: tiga bias dalam satu studi \u201cHP vs sakit kepala\u201d",
                "<p><strong>Seleksi:</strong> survei online hanya diisi yang peduli kesehatan \u2192 sampel tidak mewakili.<br />"
                "<strong>Informasi:</strong> responden sakit kepala melebih-lebihkan durasi main HP (recall bias).<br />"
                "<strong>Confounding:</strong> begadang terkait main HP <em>dan</em> sakit kepala \u2014 tanpa mengontrol begadang, HP terlihat bersalah.</p>",
            ),
            "kepribadian": "Bias seleksi itu penjaga pintu yang pilih-pilih tamu. Bias informasi itu saksi yang ingatannya kabur. Confounding itu dalang di balik tirai \u2014 yang paling berbahaya karena hasilnya terlihat meyakinkan.",
            "kapan": "Kritik studi/jurnal: cek ketiganya berurutan \u2014 siapa yang masuk studi, bagaimana diukur, apa yang tidak dikontrol.",
        },
        {
            "id": "hill",
            "title": "Bradford Hill: Kapan Asosiasi Boleh Naik Kelas",
            "definisi": "Sembilan kriteria untuk menilai apakah asosiasi observasional layak dianggap kausal: <strong>kekuatan, konsistensi, spesifisitas, temporalitas, gradien dosis-respons, plausibilitas, koherensi, eksperimen, analogi</strong>. Bukan checklist kaku \u2014 melainkan kerangka argumen.",
            "kepribadian": "Bradford Hill itu seperti dewan juri: tidak ada satu saksi yang memutuskan, tapi sembilan kesaksian yang saling menguatkan. Temporalitas (paparan mendahului outcome) adalah saksi kunci \u2014 tanpanya, kasusnya lemah.",
            "kapan": "Menilai klaim \u201cX menyebabkan Y\u201d dari media/jurnal observasional sebelum merekomendasikan kebijakan.",
            "worked": (
                "\U0001f4d0 Contoh: rokok \u2192 kanker paru (kasus Hill yang asli)",
                "<p><strong>Kekuatan:</strong> RR ~10\u201320 (sangat besar). <strong>Konsistensi:</strong> ditemukan di banyak negara. "
                "<strong>Temporalitas:</strong> merokok mendahului kanker puluhan tahun. <strong>Dosis-respons:</strong> makin banyak batang, makin tinggi risiko. "
                "<strong>Eksperimen:</strong> berhenti merokok menurunkan risiko. Lima kriteria kuat \u2192 vonis kausal, walau tanpa RCT (yang tidak etis).</p>",
            ),
            "callout": "<strong>Mnemonic 9 kriteria:</strong> \u201c<strong>S</strong>emua <strong>T</strong>eman <strong>S</strong>uka <strong>T</strong>anya, <strong>G</strong>imana <strong>P</strong>rosesnya? <strong>K</strong>ok <strong>E</strong>ksperimen <strong>A</strong>da?\u201d \u2014 Strength, Temporalitas, Spesifisitas, konsisTensi, Gradien, Plausibilitas, Koherensi, Eksperimen, Analogi.",
        },
    ],
    "myths": [
        ("Studi observasional tidak ada gunanya karena tidak bisa membuktikan kausalitas",
         "Banyak kausalitas terpenting (rokok-kanker, asbestos-mesothelioma) TIDAK PERNAH diuji dengan RCT karena tidak etis. Observasional yang dirancang baik + kriteria Hill + replikasi = bukti yang cukup untuk kebijakan. Yang tidak berguna adalah observasional yang dibaca naif."),
        ("Kalau sudah dikontrol banyak variabel, pasti bebas confounding",
         "Kontrol hanya bekerja untuk confounder yang <em>diukur dengan benar</em>. Confounding residual (variabel tak terukur/salah ukur) selalu tersisa. Klaim \u201csudah di-adjust\u201d bukan sertifikat bebas bias \u2014 tanyakan: apa yang TIDAK diukur?"),
        ("Cross-sectional bisa menentukan sebab-akibat kalau sampelnya besar",
         "Tidak. Masalahnya bukan ukuran sampel, melainkan <em>waktu</em>: paparan dan outcome diukur bersamaan, jadi tidak tahu mana yang dulu (temporalitas gagal). Sampel 1 juta tidak memperbaiki ini."),
    ],
    "tips": [
        "Gambar <strong>DAG</strong> (directed acyclic graph) sebelum analisis: panah paparan \u2192 outcome, lalu tambahkan semua variabel ketiga. Confounder = panah masuk ke paparan DAN outcome. Latihan ini mencegah 80% kesalahan interpretasi.",
        "Bedakan <strong>confounder vs mediator</strong>: confounder (rokok) harus dikontrol; mediator (tekanan darah di jalur obat\u2192stroke) JANGAN dikontrol kalau ingin efek total. Mengontrol mediator = bunuh efek yang ingin diukur.",
        "Saat membaca jurnal, lompat ke <strong>metode rekrutmen dan pengukuran</strong> dulu, baru hasil. Bias lahir di desain, bukan di tabel hasil.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Confounding \u2014 Kopi yang Tidak Bersalah",
            "intro": "Simulasikan populasi di mana kopi TIDAK berpengaruh ke penyakit, tapi perokok lebih suka kopi dan rokok menyebabkan penyakit. Hitung asosiasi mentah vs terkontrol rokok.",
            "hint": "Ubah efek rokok (risk_rokok) dari 0.30 ke 0.10. Perhatikan asosiasi mentah kopi ikut menyusut \u2014 padahal kopi tidak pernah berpengaruh. Itulah confounding.",
            "code": (
                "import random\n"
                "random.seed(7)\n"
                "n = 20000\n"
                "risk_dasar, risk_rokok = 0.05, 0.30  # rokok menaikkan risiko\n"
                "mentah = {'kopi_sakit': 0, 'kopi': 0, 'nokopi_sakit': 0, 'nokopi': 0}\n"
                "strata = {}  # (kopi, rokok) -> [sakit, total]\n"
                "for _ in range(n):\n"
                "    rokok = random.random() < 0.3\n"
                "    kopi = random.random() < (0.7 if rokok else 0.3)  # perokok lbh suka kopi\n"
                "    r = risk_dasar + (risk_rokok if rokok else 0.0)    # kopi: NOL efek\n"
                "    sakit = random.random() < r\n"
                "    k = 'kopi' if kopi else 'nokopi'\n"
                "    mentah[k+'_sakit'] += sakit; mentah[k] += 1\n"
                "    s = (kopi, rokok)\n"
                "    strata.setdefault(s, [0, 0])\n"
                "    strata[s][0] += sakit; strata[s][1] += 1\n"
                "rr_mentah = (mentah['kopi_sakit']/mentah['kopi']) / (mentah['nokopi_sakit']/mentah['nokopi'])\n"
                "print(f'RR mentah kopi = {rr_mentah:.2f}  <- terlihat berbahaya!')\n"
                "print('RR per strata rokok:')\n"
                "for rokok in [False, True]:\n"
                "    a, na = strata[(True, rokok)]; c, nc = strata[(False, rokok)]\n"
                "    print(f\"  rokok={rokok}: RR = {(a/na)/(c/nc):.2f}  <- efek sebenarnya: 1.0\")\n"
                "print()\n"
                "print('Kesimpulan: asosiasi mentah 100% confounding oleh rokok.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Stratifikasi \u2014 Menghitung OR Terkoreksi",
            "intro": "Diberikan dua tabel 2\u00d72 (perokok vs bukan), hitung OR mentah (gabungan) dan OR per strata. Lihat bagaimana penggabungan tanpa stratifikasi menipu (Simpson's paradox versi epidemiologi).",
            "hint": "Coba balik: buat OR per strata SAMA tapi OR mentah berbeda arah. Itulah Simpson's paradox \u2014 agregat berbohong, strata jujur.",
            "code": (
                "# (a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar)\n"
                "strata = {'perokok': (36, 144, 8, 152), 'bukan': (4, 196, 2, 198)}\n"
                "def OR(a, b, c, d):\n"
                "    return (a*d)/(b*c)\n"
                "print('OR per strata:')\n"
                "for nama, (a, b, c, d) in strata.items():\n"
                "    print(f'  {nama:<8} OR = {OR(a,b,c,d):.2f}')\n"
                "A = sum(v[0] for v in strata.values()); B = sum(v[1] for v in strata.values())\n"
                "C = sum(v[2] for v in strata.values()); D = sum(v[3] for v in strata.values())\n"
                "print(f'OR mentah (gabungan): {OR(A,B,C,D):.2f}')\n"
                "print()\n"
                "print('Bila OR mentah jauh dari OR strata -> confounding oleh variabel strata.')\n"
                "print('Solusi: laporkan per strata, atau Mantel-Haenszel / regresi (lihat HD10).')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Penyakit jarang, butuh cepat \u2192 Case-control",
            "kondisi": "Outcome langka, waktu dan dana terbatas.",
            "alasan": "Efisien: mulai dari kasus yang sudah ada, tidak menunggu bertahun-tahun.",
            "contoh": "Faktor risiko kanker nasofaring (jarang) di Indonesia.",
        },
        {
            "title": "Paparan jarang, butuh insidens \u2192 Kohort",
            "kondisi": "Paparan langka tapi teridentifikasi; butuh urutan waktu jelas.",
            "alasan": "Bisa hitung insidens dan RR langsung; temporalitas terjaga.",
            "contoh": "Kohort pekerja tambang: paparan debu silika \u2192 TB paru.",
        },
        {
            "title": "Butuh prevalensi / survei cepat \u2192 Cross-sectional",
            "kondisi": "Pertanyaan \u201cberapa banyak sekarang\u201d, bukan \u201ckenapa\u201d.",
            "alasan": "Murah, cepat; cukup untuk perencanaan layanan.",
            "contoh": "Riskesdas: prevalensi stunting, hipertensi per provinsi.",
        },
        {
            "title": "Butuh bukti kausal terkuat & etis \u2192 RCT",
            "kondisi": "Intervensi bisa diacak tanpa melanggar etik.",
            "alasan": "Randomisasi menyeimbangkan confounder terukur maupun tak terukur.",
            "contoh": "Uji efikasi vaksin DBD baru (lihat HD5).",
        },
        {
            "title": "RCT tidak etis/mungkin \u2192 Observasional + Hill + triangulasi",
            "kondisi": "Paparan berbahaya atau sudah terjadi.",
            "alasan": "Satu studi tak cukup; butuh konsistensi multi-desain dan kriteria Hill.",
            "contoh": "Rokok, polusi udara, diet \u2014 tidak ada RCT-nya, tapi vonis kausal tetap dijatuhkan.",
        },
    ],
    "aturan10": [
        "Tanya dulu: dari paparan maju, atau dari outcome mundur?",
        "Cek tiga bias: siapa masuk, bagaimana diukur, apa tak dikontrol.",
        "Confounder dikontrol; mediator jangan (untuk efek total).",
        "Klaim kausal tanpa temporalitas = jangan percaya.",
    ],
    "case": {
        "title": "\u201cMinum Jamu Menurunkan Risiko Diabetes 40%\u201d",
        "body": [
            "<p>Studi cross-sectional 10.000 orang: peminum jamu rutin punya prevalensi diabetes <strong>40% lebih rendah</strong> (OR=0,6). Produsen jamu ingin memakai hasil ini di iklan. Kamu diminta Dinkes memberi second opinion.</p>",
            "<p>Detail metode: sampel dari pengunjung puskesmas (bukan populasi umum); status jamu dan diabetes diukur <strong>pada hari yang sama</strong> via kuesioner; tidak ada data aktivitas fisik, diet, atau pendapatan.</p>",
        ],
        "pertanyaan": "Sebutkan minimal 3 masalah desain dan kesimpulanmu untuk Dinkes.",
        "pembahasan": "(1) Cross-sectional: tidak tahu mana dulu \u2014 bisa jadi penderita diabetes BERHENTI minum jamu manis setelah diagnosis (reverse causality). (2) Bias seleksi: pengunjung puskesmas \u2260 populasi umum. (3) Confounding tak terkontrol: peminum jamu rutin mungkin lebih aktif, diet lebih baik, atau lebih kaya \u2014 semua terkait diabetes. (4) Bias informasi: kuesioner sekali ukur untuk kebiasaan bertahun-tahun. Kesimpulan: studi ini TIDAK mendukung klaim kausal; melarang klaim iklan tersebut; sarankan kohort prospektif bila produsen serius. Pelajaran: OR 0,6 yang menggiurkan runtuh setelah tiga pertanyaan desain.",
    },
    "quiz": [
        ("Studi merekrut 200 pasien TB dan 200 kontrol sehat, lalu menelusuri riwayat merokok. Ini desain\u2026",
         ["Kohort", "Case-control", "Cross-sectional", "RCT"],
         1,
         "Benar: berangkat dari outcome (kasus vs kontrol), mundur ke paparan = case-control. Ukuran valid: OR."),
        ("Peminum kopi terlihat berisiko kanker pankreas, tapi setelah mengontrol rokok asosiasi hilang. Rokok adalah\u2026",
         ["Mediator", "Confounder", "Collider", "Effect modifier"],
         1,
         "Benar: rokok terkait kopi (paparan) dan kanker (outcome), bukan di jalur kausal kopi\u2192kanker = confounder klasik."),
        ("RCT tidak etis untuk meneliti efek rokok. Alternatif bukti kausal terkuat?",
         ["Satu cross-sectional besar", "Konsistensi multi-studi observasional + kriteria Bradford Hill", "Studi kasus tunggal", "Opini ahli"],
         1,
         "Benar: triangulasi \u2014 banyak desain, banyak populasi, kriteria Hill. Vonis rokok-kanker dijatuhkan persis dengan cara ini."),
        ("Dalam studi obat\u2192tekanan darah\u2192stroke, tekanan darah adalah mediator. Jika ingin efek TOTAL obat, maka\u2026",
         ["Wajib mengontrol tekanan darah", "Jangan mengontrol tekanan darah", "Hapus data tekanan darah", "Ganti outcome"],
         1,
         "Benar: mengontrol mediator memblokir jalur kausal yang ingin diukur (over-adjustment). Kontrol confounder, bukan mediator."),
        ("Kelemahan utama cross-sectional untuk klaim kausal?",
         ["Sampel selalu kecil", "Paparan dan outcome diukur bersamaan \u2014 temporalitas tidak jelas", "Tidak bisa hitung prevalensi", "Terlalu mahal"],
         1,
         "Benar: masalahnya waktu, bukan ukuran. Ayam-telur tidak terselesaikan oleh n besar."),
        ("Recall bias termasuk jenis\u2026",
         ["Bias seleksi", "Bias informasi", "Confounding", "Bukan bias"],
         1,
         "Benar: kesalahan pengukuran/ingatan = bias informasi. Kasus mengingat paparan lebih baik dari kontrol \u2192 OR terdistorsi."),
    ],
    "rangkuman": [
        "<strong>Kohort</strong>: paparan \u2192 outcome (RR). <strong>Case-control</strong>: outcome \u2192 paparan (OR). <strong>Cross-sectional</strong>: potret prevalensi. <strong>RCT</strong>: acak, standar emas.",
        "Tiga bias: <strong>seleksi</strong> (siapa masuk), <strong>informasi</strong> (bagaimana diukur), <strong>confounding</strong> (variabel ketiga).",
        "Asosiasi teramati = efek sebenarnya + bias. Tugasmu mengecilkan suku kedua.",
        "Kontrol <strong>confounder</strong>; jangan kontrol <strong>mediator</strong> untuk efek total.",
        "<strong>Bradford Hill</strong>: 9 kriteria menilai klaim kausal; temporalitas adalah kunci.",
        "RCT tak etis \u2260 tak ada bukti \u2014 triangulasi observasional bisa memvonis.",
        "Baca metode dulu (rekrutmen, pengukuran), baru percaya tabel hasil.",
        "Skill ini prasyarat HD5 (trial), HD6 (survival), HD10 (kausal observasional).",
    ],
    "prev": ("hd3-epidemiologi", "HD3"),
    "next": ("hd5-uji-klinis", "HD5"),
}

# ================================================================ HD5
HD5 = {
    "slug": "hd5-uji-klinis",
    "code": "HD5",
    "track": TRACK,
    "cover_title": "RCT, ITT &amp; Non-Inferiority:<br />Statistik di Balik Uji Klinis",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Obat yang \u201cMenang\u201d karena Curang"),
        ("rct", "RCT &amp; Randomisasi \u2014 Si Pengacak yang Adil"),
        ("itt", "ITT vs Per-Protocol \u2014 Si Jujur vs Si Pilih-pilih"),
        ("ukuran", "Ukuran Sampel, Interim &amp; Non-Inferiority"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi Randomisasi"),
        ("lab2", "\U0001f52c Lab 2: Kalkulator Ukuran Sampel"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan mengapa <strong>randomisasi</strong> menyeimbangkan confounder tak terukur (bukan sekadar \u201cadil\u201d).",
        "Membedakan <strong>ITT vs per-protocol</strong> dan memprediksi arah bias masing-masing.",
        "Menghitung <strong>ukuran sampel</strong> untuk perbandingan dua proporsi dan menjelaskan trade-off power vs biaya.",
        "Menafsirkan uji <strong>non-inferiority</strong> dan analisis <strong>interim</strong> tanpa terjebak klaim \u201ctidak berbeda = sama\u201d.",
    ],
    "story_title": "Cerita Pembuka: Obat yang \u201cMenang\u201d karena Curang",
    "story": [
        "<p>Uji klinis obat diabetes baru vs standar. Hasil: obat baru \u201cmenang\u201d \u2014 gula darah turun lebih banyak. Sponsor merayakan. Lalu statistikawan independen membuka data: <strong>30% peserta kelompok obat baru drop-out</strong> (mual hebat), dan analisis hanya memakai yang bertahan (per-protocol). Yang tidak tahan obat \u2014 kemungkinan yang paling sakit \u2014 hilang dari hitungan.</p>",
        "<p>Analisis ITT (intention-to-treat, semua peserta dihitung sesuai kelompok awalnya) menunjukkan hasil <strong>tidak berbeda</strong>. Kemenangan itu artefak seleksi, bukan efikasi. Lesson ini membedah trik-trik statistik uji klinis \u2014 agar kamu bisa membedakan bukti dari sulap.</p>",
    ],
    "konsep": [
        {
            "id": "rct",
            "title": "RCT &amp; Randomisasi \u2014 Si Pengacak yang Adil",
            "definisi": "<strong>RCT (Randomized Controlled Trial)</strong>: peserta diacak ke kelompok perlakuan vs kontrol. Randomisasi membuat kedua kelompok <strong>setara dalam semua hal kecuali perlakuan</strong> \u2014 termasuk faktor yang tidak kita ketahui.",
            "kepribadian": "Randomisasi itu seperti mengocok kartu sebelum dibagikan: tidak menjamin tiap tangan sempurna, tapi menjamin tidak ada yang curang. Keajaibannya: ia mengontrol confounder yang <em>belum ditemukan sains</em> sekalipun.",
            "kapan": "Menguji efikasi intervensi baru (obat, vaksin, program) ketika etik dan logistik memungkinkan. Endpoint harus didefinisikan SEBELUM trial dimulai.",
            "worked": (
                "\U0001f4d0 Contoh: kenapa observasional bisa kalah oleh RCT",
                "<p>Observasional: pasien yang memilih obat mahal terlihat lebih sehat \u2014 karena mereka lebih kaya, gizi lebih baik (confounding sosioekonomi).<br />"
                "<strong>RCT:</strong> 1.000 pasien diacak: 500 obat baru, 500 standar. Kekayaan, gizi, genetik tersebar merata secara acak ke dua kelompok.<br />"
                "Selisih outcome kini hanya bisa dijelaskan oleh obatnya. Inilah \u201ckeajaiban\u201d randomisasi: bukan keadilan moral, tapi <strong>keseimbangan statistik</strong>.</p>",
            ),
            "callout": "<strong>Istilah kunci:</strong> <em>blinding</em> (peserta/peneliti tidak tahu kelompoknya \u2192 cegah bias perilaku), <em>placebo control</em> (pembanding netral), <em>endpoint primer</em> (satu outcome utama yang menentukan menang/kalah \u2014 didaftarkan sebelum mulai untuk cegah p-hacking).",
        },
        {
            "id": "itt",
            "title": "ITT vs Per-Protocol \u2014 Si Jujur vs Si Pilih-pilih",
            "definisi": "<strong>ITT (intention-to-treat)</strong>: analisis SEMUA peserta sesuai kelompok randomisasi, apapun yang terjadi (drop-out, pindah obat). <strong>Per-protocol</strong>: hanya yang menyelesaikan sesuai protokol.",
            "rumus": r"\text{Estimasi ITT} = \text{efek obat} \times \text{kepatuhan} + \text{bias drop-out yang dipertahankan}",
            "simbol": [
                (r"\text{efek obat}", "efikasi biologis murni"),
                (r"\text{kepatuhan}", "proporsi yang benar-benar minum obat (0\u20131)"),
            ],
            "interpretasi": "ITT mengukur efek <strong>kebijakan meresepkan</strong> di dunia nyata (efektivitas), bukan efek obat di dunia ideal. Ia konservatif: cenderung meremehkan, bukan melebih-lebihkan \u2014 dan itulah yang diinginkan regulator.",
            "worked": (
                "\U0001f4d0 Contoh: ITT membatalkan kemenangan palsu",
                "<p>200 peserta: 100 obat baru, 100 standar. Di kelompok obat, 30 drop-out karena mual (mereka yang paling parah).<br />"
                "<strong>Per-protocol</strong> (70 vs 100): obat terlihat menang besar \u2014 yang gagal sudah dibuang!<br />"
                "<strong>ITT</strong> (100 vs 100, drop-out dihitung gagal): keunggulan hilang.<br />"
                "Regulator (BPOM/FDA) memakai ITT sebagai analisis utama justru karena ia <strong>anti-curang</strong>.</p>",
            ),
            "kepribadian": "ITT itu wasit yang menghitung semua pemain yang didaftarkan, termasuk yang cedera di tengah laga. Per-protocol itu suporter yang hanya menghitung gol timnya. Untuk klaim \u201cobat ini bekerja\u201d, dengarkan wasit.",
            "kapan": "Laporan utama efikasi \u2192 ITT. Analisis pendukung mekanisme biologis \u2192 per-protocol (dengan label jelas).",
            "chart": {
                "var": "hd5IttData",
                "data": [{"x": ["Per-protocol (70 vs 100)", "ITT (100 vs 100)"], "y": [35, 8], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "text": ["35%", "8%"], "textposition": "outside"}],
                "title": "Selisih Keberhasilan Obat Baru vs Standar: Dua Analisis, Dua Cerita",
                "layout": {"xaxis": {"title": "Metode analisis"}, "yaxis": {"title": "Selisih keberhasilan (poin %)"}, "showlegend": False},
                "cara": "Dua batang: kuning = per-protocol (hanya yang bertahan), biru = ITT (semua peserta). Bandingkan tingginya.",
                "interpretasi": "Per-protocol mengklaim keunggulan 35 poin \u2014 ITT menyusutkannya jadi 8 poin yang tidak signifikan. Batang kuning adalah ilusi seleksi: yang drop-out (dan gagal) disembunyikan. Inilah kenapa regulator mewajibkan ITT sebagai analisis primer.",
            },
        },
        {
            "id": "ukuran",
            "title": "Ukuran Sampel, Interim &amp; Non-Inferiority",
            "definisi": "<strong>Ukuran sampel</strong> dihitung dari: efek yang ingin dideteksi, power (biasanya 80%), dan alpha (5%). <strong>Analisis interim</strong>: intip data di tengah jalan (dengan penalti alpha). <strong>Non-inferiority</strong>: membuktikan obat baru <em>tidak lebih buruk</em> dari standar dalam batas margin \u2014 bukan membuktikan sama.",
            "rumus": r"n \approx \frac{2(z_{1-\alpha/2} + z_{1-\beta})^2 \bar{p}(1-\bar{p})}{\Delta^2}",
            "simbol": [
                (r"n", "sampel per kelompok"),
                (r"z_{1-\alpha/2}", "nilai z untuk alpha (1,96 untuk alpha 5%)"),
                (r"z_{1-\beta}", "nilai z untuk power (0,84 untuk power 80%)"),
                (r"\bar{p}", "rata-rata proporsi kejadian dua kelompok"),
                (r"\Delta", "selisih efek yang ingin dideteksi \u2014 makin kecil, n meledak"),
            ],
            "interpretasi": "Rumus ini menjelaskan ekonomi trial: mendeteksi efek kecil butuh sampel besar (n \u221d 1/\u0394\u00b2). Menurunkan \u0394 separuhnya \u2192 butuh 4x sampel. Inilah kenapa trial mahal.",
            "worked": (
                "\U0001f4d0 Contoh: n untuk beda 10% vs 5%",
                "<p>Kontrol 30% sembuh, obat ditarget 40% (\u0394=10%): n \u2248 350 per kelompok.<br />"
                "Jika target hanya \u0394=5% (30% vs 35%): n \u2248 <strong>1.400</strong> per kelompok \u2014 4x lipat.<br />"
                "Keputusan bisnis: apakah efek 5% layak dikejar dengan biaya 4x? Kadang jawabannya tidak \u2014 dan itu keputusan statistik yang valid.</p>",
            ),
            "kepribadian": "Ukuran sampel itu anggaran kebenaran: terlalu kecil = trial buta (tidak bisa melihat efek yang ada); terlalu besar = bakar uang. Interim itu wasit yang boleh menghentikan pertandingan lebih awal kalau satu tim sudah menang telak (atau ada yang cedera parah). Non-inferiority itu bukan \u201cseri\u201d \u2014 melainkan \u201ckalahnya tidak lebih dari selisih yang masih bisa diterima\u201d.",
            "kapan": "Desain trial baru \u2192 hitung n dulu (jangan rekrut \u201csecukupnya\u201d). Obat generik/biosimilar vs orisinal \u2192 non-inferiority. Trial panjang/berisiko \u2192 rencanakan interim dengan alpha-spending.",
            "warning": "<strong>Jebakan non-inferiority:</strong> \u201ctidak terbukti berbeda\u201d \u2260 \u201cter bukti sama\u201d. Trial kecil yang underpowered juga \u201ctidak menemukan perbedaan\u201d \u2014 karena buta, bukan karena setara. Non-inferiority yang valid butuh margin prasetel + power cukup + assay sensitivity (trialnya mampu mendeteksi beda jika ada).",
        },
    ],
    "myths": [
        ("\u201cUji klinis gagal menemukan perbedaan = kedua obat sama efektif\u201d",
         "Tidak. \u201cGagal menolak H0\u201d bisa berarti (a) memang setara, atau (b) trial underpowered (sampel kecil, efek kecil). Kesetaraan butuh desain khusus: non-inferiority/equivalence dengan margin dan power yang cukup. Jangan biarkan \u201ctidak signifikan\u201d diterjemahkan jadi \u201csama\u201d."),
        ("Analisis per-protocol lebih \u201cmurni\u201d karena hanya memakai yang patuh",
         "Justru sebaliknya: membuang yang drop-out merusak randomisasi \u2014 yang bertahan bukan sampel acak lagi, melainkan subkelompok terseleksi (biasanya lebih sehat/patuh). \u201cKemurnian\u201d ini adalah seleksi berkedok metodologi. ITT tetap analisis primer."),
        ("Makin besar sampel makin baik, selalu",
         "Sampel raksasa bisa mendeteksi beda yang <em>signifikan tapi tidak bermakna klinis</em> (mis. turun 0,1% gula darah, p<0,001). Besar sampel menjawab \u201capakah beda?\u201d \u2014 bukan \u201capakah bedanya penting?\u201d Itu tugas effect size dan NNT (HD3)."),
    ],
    "tips": [
        "Saat membaca trial, cek urutan ini: <strong>apakah ITT primer? berapa drop-out per kelompok? apakah endpoint diganti di tengah?</strong> Tiga pertanyaan ini membongkar sebagian besar sulap.",
        "Bedakan <strong>efikasi</strong> (dunia ideal, per-protocol) vs <strong>efektivitas</strong> (dunia nyata, ITT). Pembuat kebijakan butuh yang kedua; brosur obat suka menyajikan yang pertama.",
        "Ingat ekonomi n \u221d 1/\u0394\u00b2: klaim efek kecil dari trial kecil = hampir pasti noise atau p-hacking. Minta replikasi.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Randomisasi Menyeimbangkan yang Tak Terlihat",
            "intro": "Simulasikan 1.000 pasien dengan faktor risiko tak terukur (genetik). Acak ke dua kelompok, lalu bandingkan rata-rata faktor itu. Ulangi dan lihat sebarannya menyempit.",
            "hint": "Ubah n dari 1000 ke 40. Lihat: randomisasi pada sampel kecil bisa gagal seimbang! Itulah kenapa trial kecil memakai stratifikasi/blok.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(11)\n"
                "n = 1000  # coba 40!\n"
                "genetik = [random.gauss(0, 1) for _ in range(n)]  # faktor TAK TERUKUR\n"
                "acak = genetik[:]; random.shuffle(acak)\n"
                "A, B = acak[:n//2], acak[n//2:]\n"
                "print(f'n={n}: rata2 genetik A={st.mean(A):+.3f}, B={st.mean(B):+.3f}')\n"
                "print(f'selisih = {abs(st.mean(A)-st.mean(B)):.3f} (mendekati 0 = seimbang)')\n"
                "print()\n"
                "# tanpa randomisasi: dokter memberi obat baru ke yg lebih sehat\n"
                "terurut = sorted(genetik)\n"
                "A2, B2 = terurut[:n//2], terurut[n//2:]\n"
                "print(f'TANPA acak (seleksi dokter): A={st.mean(A2):+.3f}, B={st.mean(B2):+.3f}')\n"
                "print('-> selisih besar = confounding; obat terlihat manjur padahal tidak')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Kalkulator Ukuran Sampel Trial",
            "intro": "Implementasi rumus ukuran sampel dua proporsi. Coba berbagai selisih efek (\u0394) dan lihat bagaimana n meledak saat efek yang dicari mengecil.",
            "hint": "Coba delta 0.15, 0.10, 0.05, 0.02. Perhatikan polanya: n naik ~4x setiap delta dibagi 2. Sekarang naikkan power ke 90% (z=1.28) \u2014 berapa tambahan biayanya?",
            "code": (
                "import math\n"
                "p_kontrol, p_obat = 0.30, 0.40  # ubah sesukamu\n"
                "z_alpha, z_beta = 1.96, 0.84   # alpha 5%, power 80%\n"
                "delta = abs(p_obat - p_kontrol)\n"
                "p_bar = (p_kontrol + p_obat) / 2\n"
                "n = 2 * (z_alpha + z_beta)**2 * p_bar * (1 - p_bar) / delta**2\n"
                "print(f'delta = {delta:.0%}, n per kelompok = {math.ceil(n)}')\n"
                "print(f'total sampel = {math.ceil(n)*2}')\n"
                "print()\n"
                "print('Aturan: delta dibagi 2 -> n dikali ~4. Efek kecil = trial mahal.')\n"
                "arr = abs(p_obat - p_kontrol)\n"
                "print(f'NNT implisit = {1/arr:.0f} (lihat HD3)')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Laporan efikasi utama \u2192 ITT",
            "kondisi": "Klaim \u201cobat ini bekerja\u201d untuk regulator/publik.",
            "alasan": "Mempertahankan randomisasi; anti seleksi drop-out; mengukur efektivitas dunia nyata.",
            "contoh": "Hasil primer trial vaksin: ITT pada semua yang dirandomisasi.",
        },
        {
            "title": "Eksplorasi mekanisme biologis \u2192 Per-protocol (sekunder)",
            "kondisi": "Pertanyaan \u201capakah obatnya bekerja bila diminum?\u201d",
            "alasan": "Valid sebagai analisis pendukung, dengan label dan caveat jelas.",
            "contoh": "Analisis sensitivitas: hasil konsisten antara ITT dan per-protocol = meyakinkan.",
        },
        {
            "title": "Obat baru vs standar yang sudah bagus \u2192 Non-inferiority",
            "kondisi": "Tujuan: lebih murah/aman/mudah, tidak harus lebih manjur.",
            "alasan": "Superiority tidak realistis; yang dibutuhkan bukti \u201ctidak lebih buruk melewati margin\u201d.",
            "contoh": "Biosimilar insulin vs orisinal; obat generik.",
        },
        {
            "title": "Trial panjang atau berisiko \u2192 Rencanakan interim",
            "kondisi": "Follow-up tahunan, atau ada risiko keamanan.",
            "alasan": "Etis: hentikan lebih awal jika sudah jelas menang/kalah/berbahaya; butuh alpha-spending agar tidak inflasi false positive.",
            "contoh": "Trial vaksin: interim saat separuh kasus terkumpul.",
        },
    ],
    "aturan10": [
        "Analisis primer harus ITT \u2014 titik.",
        "Drop-out beda antar kelompok = lampu merah.",
        "\u201cTidak berbeda\u201d \u2260 \u201csama\u201d (kecuali non-inferiority valid).",
        "n \u221d 1/\u0394\u00b2 \u2014 efek kecil butuh trial besar.",
    ],
    "case": {
        "title": "Vaksin DBD: Efikasi 80% atau 45%?",
        "body": [
            "<p>Trial vaksin DBD 20.000 anak: kelompok vaksin vs plasebo, follow-up 2 tahun. Hasil <strong>per-protocol</strong>: efikasi 80%. Hasil <strong>ITT</strong>: efikasi 45%.</p>",
            "<p>Investigasi: 25% kelompok vaksin tidak melengkapi 3 dosis (jadwal sulit di daerah terpencil); kelompok plasebo drop-out hanya 5%. Tidak ada masalah keamanan serius.</p>",
        ],
        "pertanyaan": "Angka mana yang dipakai untuk keputusan program imunisasi nasional, dan apa implikasi kebijakannya?",
        "pembahasan": "Pakai ITT 45% untuk keputusan program \u2014 karena program nasional akan menghadapi kepatuhan lapangan yang sama buruknya (jadwal 3 dosis di daerah terpencil). Efikasi 80% hanya tercapai di dunia ideal. Implikasi: (1) hitung cost-effectiveness dengan 45%, bukan 80%; (2) investasikan pada sistem pengingat/logistik dosis lanjutan \u2014 menaikkan kepatuhan menggeser efektivitas mendekati 80%; (3) laporkan keduanya dengan jujur: 80% = potensi biologis, 45% = realita program. Analis yang menyajikan 80% ke Menteri sedang menjual harapan palsu.",
    },
    "quiz": [
        ("Keajaiban utama randomisasi adalah\u2026",
         ["Membuat trial lebih murah", "Menyeimbangkan confounder terukur MAUPUN tak terukur antar kelompok", "Menjamin obatnya manjur", "Menghilangkan kebutuhan kontrol"],
         1,
         "Benar: randomisasi menyebar semua faktor \u2014 termasuk yang belum ditemukan sains \u2014 secara acak. Bukan soal murah, soal keseimbangan."),
        ("Analisis primer uji klinis menurut regulator (BPOM/FDA) adalah\u2026",
         ["Per-protocol", "ITT (intention-to-treat)", "Hanya yang patuh", "Yang dipilih sponsor"],
         1,
         "Benar: ITT mempertahankan randomisasi dan anti-curang seleksi drop-out. Per-protocol hanya pendukung."),
        ("Trial kecil \u201ctidak menemukan perbedaan\u201d antara dua obat. Kesimpulan tepat?",
         ["Kedua obat terbukti sama", "Belum tentu \u2014 bisa jadi underpowered; kesetaraan butuh desain non-inferiority", "Obat baru pasti lebih buruk", "Trialnya gagal total"],
         1,
         "Benar: \u201cgagal menolak H0\u201d \u2260 \u201cH0 benar\u201d. Buta (power rendah) juga menghasilkan \u201ctidak signifikan\u201d."),
        ("Selisih efek yang ingin dideteksi (\u0394) dibagi 2. Ukuran sampel menjadi sekitar\u2026",
         ["2x lipat", "4x lipat", "Tetap", "Setengah"],
         1,
         "Benar: n \u221d 1/\u0394\u00b2. Inilah ekonomi trial: efek kecil = biaya meledak."),
        ("Non-inferiority bertujuan membuktikan\u2026",
         ["Obat baru lebih manjur", "Obat baru tidak lebih buruk dari standar melewati margin yang disepakati", "Kedua obat identik", "Obat baru lebih murah"],
         1,
         "Benar: \u201ctidak lebih buruk melewati margin\u201d \u2014 untuk obat yang menawarkan keunggulan lain (harga, keamanan, kemudahan)."),
        ("Drop-out 30% di kelompok obat vs 5% di kontrol. Bahaya terbesar?",
         ["Tidak ada, tinggal analisis yang bertahan", "Seleksi: yang bertahan bukan sampel acak lagi \u2014 ITT wajib, per-protocol menipu", "Trial harus diulang dari nol", "Obatnya pasti berbahaya"],
         1,
         "Benar: drop-out diferensial merusak randomisasi. Analisis hanya-yang-bertahan = membandingkan apel pilihan dengan jeruk acak."),
    ],
    "rangkuman": [
        "<strong>Randomisasi</strong> menyeimbangkan confounder tak terukur \u2014 keajaiban RCT.",
        "<strong>ITT</strong> = analisis primer (semua peserta, sesuai acak). <strong>Per-protocol</strong> = pendukung saja.",
        "Drop-out diferensial antar kelompok = sinyal bahaya seleksi.",
        "<strong>n \u221d 1/\u0394\u00b2</strong>: efek kecil butuh trial besar; hitung sebelum rekrut.",
        "<strong>Interim</strong> butuh alpha-spending; <strong>non-inferiority</strong> butuh margin + power.",
        "\u201cTidak signifikan\u201d \u2260 \u201csama\u201d. \u201cTidak berbeda\u201d \u2260 \u201csetara\u201d.",
        "Bedakan <strong>efikasi</strong> (ideal) vs <strong>efektivitas</strong> (dunia nyata).",
        "Cek: ITT? drop-out? endpoint diganti? \u2014 tiga pertanyaan pembongkar sulap.",
    ],
    "prev": ("hd4-desain-studi", "HD4"),
    "next": ("hd6-survival", "HD6"),
}

LESSONS = [HD1, HD2, HD3, HD4, HD5]
for L in LESSONS:
    qa_scan(L)
