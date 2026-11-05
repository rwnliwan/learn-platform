#!/usr/bin/env python3
"""Health Data Scientist lessons HD6-HD10."""
from render import qa_scan

TRACK = "Health Data Scientist"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ HD6
HD6 = {
    "slug": "hd6-survival",
    "code": "HD6",
    "track": TRACK,
    "cover_title": "Kaplan-Meier &amp; Cox:<br />Analisis Waktu Kejadian",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Pasien yang \u201cHilang\u201d"),
        ("sensor", "Sensor &amp; Kurva Kaplan-Meier"),
        ("logrank", "Log-Rank Test"),
        ("cox", "Model Cox Proportional Hazards"),
        ("competing", "Competing Risks"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Hitung Kurva KM Manual"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Hazard Ratio"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>sensor kanan</strong> dan mengapa menghapus pasien tersensor merusak analisis.",
        "Menghitung <strong>estimasi Kaplan-Meier</strong> langkah-demi-langkah dari data kecil.",
        "Menafsirkan <strong>kurva survival, median survival, dan hazard ratio Cox</strong> dengan bahasa sendiri.",
        "Mengenali kapan <strong>competing risks</strong> membuat KM standar menipu.",
    ],
    "story_title": "Cerita Pembuka: Pasien yang \u201cHilang\u201d",
    "story": [
        "<p>Uji obat kanker: 100 pasien, follow-up 2 tahun. Di akhir, 30 meninggal, 20 <strong>hilang follow-up</strong> (pindah kota, berhenti kontrol), 50 masih hidup. Analis junior menghitung \u201cmortalitas = 30/80 = 37,5%\u201d dengan membuang yang hilang. Salah fatal: 20 pasien itu <em>hidup selama mereka terpantau</em> \u2014 membuangnya sama dengan menghapus bukti bahwa obat menahan mereka hidup selama itu.</p>",
        "<p>Data waktu-kejadian selalu punya \u201cpasien yang hilang\u201d \u2014 dan statistik punya cara elegan memakainya: <strong>analisis survival</strong>. Lesson ini mengajarkan cara membaca waktu, bukan sekadar menghitung mayat.</p>",
    ],
    "konsep": [
        {
            "id": "sensor",
            "title": "Sensor &amp; Kurva Kaplan-Meier \u2014 Si Akuntan Waktu",
            "definisi": "<strong>Sensor kanan</strong>: waktu kejadian tidak teramati penuh \u2014 pasien masih hidup saat studi berakhir atau hilang follow-up. <strong>Kaplan-Meier (KM)</strong>: estimasi probabilitas survival yang memakai informasi \u201cselamat sampai waktu t\u201d dari pasien tersensor.",
            "rumus": r"\hat{S}(t) = \prod_{t_i \leq t} \left(1 - \frac{d_i}{n_i}\right)",
            "simbol": [
                (r"\hat{S}(t)", "estimasi probabilitas bertahan hidup melewati waktu t"),
                (r"d_i", "jumlah kejadian (kematian) pada waktu t_i"),
                (r"n_i", "jumlah yang masih berisiko tepat sebelum t_i (termasuk yang lalu tersensor)"),
                (r"\prod", "kalikan peluang bertahan di tiap titik kejadian \u2014 seperti rantai"),
            ],
            "interpretasi": "Kurva KM turun hanya saat ada kejadian; pasien tersensor <em>mengurangi n_i</em> setelahnya tanpa menurunkan kurva. Tiap anak tangga = peluang bersyarat bertahan melewati titik itu.",
            "worked": (
                "\U0001f4d0 Contoh: KM 5 pasien",
                "<p>Waktu (bulan): 3 (meninggal), 5 (tersensor), 6 (meninggal), 8 (tersensor), 12 (meninggal).<br />"
                "<strong>t=3:</strong> n=5, d=1 \u2192 S = 1\u2212(1/5) = <strong>0,80</strong>.<br />"
                "<strong>t=5:</strong> sensor \u2014 kurva tetap 0,80, tapi n turun jadi 3.<br />"
                "<strong>t=6:</strong> n=3, d=1 \u2192 S = 0,80 \u00d7 (1\u22121/3) = <strong>0,533</strong>.<br />"
                "<strong>t=12:</strong> n=1, d=1 \u2192 S = 0,533 \u00d7 0 = <strong>0</strong>.<br />"
                "Perhatikan: pasien tersensor di bulan 5 <em>ikut menyangga</em> estimasi sampai bulan 5, lalu keluar dari pembagi.</p>",
            ),
            "kepribadian": "KM itu akuntan yang jujur: ia tidak mengarang nasib pasien yang hilang, tapi juga tidak menghapus kontribusi mereka. Setiap anak tangga kurva adalah kesaksian: \u201csejauh ini, yang bertahan sebanyak ini\u201d.",
            "kapan": "Deskripsi survival satu/dua kelompok: survival kanker 5 tahun, waktu sampai readmission, durasi remisi. Selalu tampilkan jumlah berisiko (number at risk) di bawah kurva.",
            "chart": {
                "var": "hd6KmData",
                "data": [{"x": [0, 3, 3, 6, 6, 12, 12], "y": [1.0, 1.0, 0.8, 0.8, 0.533, 0.533, 0.0], "type": "scatter", "mode": "lines", "name": "KM", "line": {"color": "#2a7de1", "shape": "hv"}},
                        {"x": [5, 8], "y": [0.8, 0.533], "type": "scatter", "mode": "markers", "name": "Tersensor", "marker": {"color": "#e8a838", "symbol": "x", "size": 10}}],
                "title": "Kurva Kaplan-Meier \u2014 Contoh 5 Pasien",
                "layout": {"xaxis": {"title": "Bulan"}, "yaxis": {"title": "Probabilitas survival", "range": [0, 1.05]}, "showlegend": True},
                "cara": "Garis biru tangga = estimasi survival; turun hanya di bulan 3, 6, 12 (ada kematian). Tanda X kuning = pasien tersensor (bulan 5 dan 8): kurva tidak turun di sana.",
                "interpretasi": "Visual dari rumus: anak tangga di tiap kejadian, datar saat sensor. Median survival = waktu saat kurva menyentuh 0,5 (di sini ~7 bulan). Perhatikan kurva makin \u201cgoyah\u201d di kanan karena n_i mengecil \u2014 ekor kurva paling tidak bisa dipercaya.",
            },
        },
        {
            "id": "logrank",
            "title": "Log-Rank Test \u2014 Si Wasit Dua Kurva",
            "definisi": "<strong>Uji log-rank</strong> membandingkan dua (atau lebih) kurva survival secara keseluruhan: apakah perbedaan yang terlihat lebih besar dari yang diharapkan secara acak.",
            "kepribadian": "Log-rank itu wasit yang menonton seluruh pertandingan, bukan skor akhir saja. Ia bertanya di tiap titik waktu: \u201ckematian yang terjadi vs yang diharapkan bila kedua tim sama kuat \u2014 selisihnya konsisten ke satu arah?\u201d",
            "kapan": "Bandingkan survival dua kelompok (obat vs kontrol) tanpa asumsi distribusi. Untuk estimasi BESAR efek, lanjut ke Cox.",
            "worked": (
                "\U0001f4d0 Contoh: membaca hasil log-rank",
                "<p>Trial 200 pasien: kurva obat di atas kurva kontrol sepanjang 2 tahun. Uji log-rank: <strong>p = 0,03</strong>.<br />"
                "Artinya: jika obat sebenarnya tidak berpengaruh, perbedaan sebesar ini hanya terjadi 3% secara kebetulan \u2014 cukup bukti untuk menyatakan beda.<br />"
                "Tapi p tidak memberi tahu <em>seberapa besar</em> bedanya \u2014 untuk itu lihat selisih kurva atau HR dari Cox.</p>",
            ),
            "warning": "<strong>Batasan:</strong> log-rank paling kuat saat kurva tidak bersilangan (proportional hazards). Jika kurva bersilangan (obat buruk di awal, bagus belakangan \u2014 mis. imunoterapi), log-rank bisa gagal mendeteksi beda yang nyata. Selalu plot kurvanya!",
        },
        {
            "id": "cox",
            "title": "Model Cox \u2014 Si Penimbang Banyak Faktor",
            "definisi": "<strong>Model Cox proportional hazards</strong>: regresi untuk data survival yang mengestimasi pengaruh tiap variabel terhadap <em>laju kejadian</em> (hazard), tanpa perlu menentukan bentuk baseline hazard.",
            "rumus": r"h(t|X) = h_0(t) \cdot e^{\beta_1 X_1 + \beta_2 X_2 + \cdots}",
            "simbol": [
                (r"h(t|X)", "hazard: laju kejadian sesaat pada waktu t untuk pasien berkarakteristik X"),
                (r"h_0(t)", "baseline hazard: laju dasar saat semua X = 0 (tidak perlu dispesifikasi!)"),
                (r"\beta_j", "koefisien variabel j; HR = e^\u03b2"),
                (r"e^{\beta_1 X_1 + \cdots}", "pengali risiko relatif \u2014 jantung model Cox"),
            ],
            "interpretasi": "HR = 0,7 untuk obat artinya: pada setiap saat, laju kematian kelompok obat 70% dari kontrol (risiko turun 30%), <em>setelah mengontrol variabel lain</em>. HR = 2 untuk merokok = laju kejadian 2x lipat.",
            "worked": (
                "\U0001f4d0 Contoh: membaca tabel Cox",
                "<p>Output: obat \u03b2 = \u22120,36 (HR = e^\u22120,36 = 0,70; p=0,02); usia (per 10 tahun) HR = 1,4 (p<0,001); diabetes HR = 1,8 (p=0,01).<br />"
                "Bacaan: obat menurunkan laju kematian 30% setelah mengontrol usia dan diabetes. Usia +10 tahun menaikkan laju 40%.<br />"
                "<strong>Cek asumsi:</strong> plot Schoenfeld residuals \u2014 jika HR berubah seiring waktu (kurva bersilangan), asumsi proportional hazards dilanggar \u2192 pakai model stratified/time-varying.</p>",
            ),
            "kepribadian": "Cox itu seperti regresi logistik yang sabar: ia tidak bertanya \u201cmati atau hidup?\u201d melainkan \u201cseberapa cepat?\u201d \u2014 dan ia cerdik: tidak perlu tahu bentuk baseline hazard, cukup rasio antar pasien.",
            "kapan": "Analisis multivariabel waktu-kejadian: faktor prognostik kanker, efektivitas obat terkontrol confounder, risiko readmission (lihat HD20 capstone).",
        },
        {
            "id": "competing",
            "title": "Competing Risks \u2014 Si Pengingat Kematian Lain",
            "definisi": "<strong>Competing risk</strong>: kejadian yang mencegah kejadian utama teramati \u2014 mis. pasien meninggal karena stroke sebelum sempat kambuh kankernya. KM standar yang menyensor kematian lain <strong>melebih-lebihkan</strong> risiko kejadian utama.",
            "kepribadian": "Competing risk itu seperti menghitung \u201cpeluang promosi\u201d sambil mengabaikan bahwa karyawan bisa resign dulu. KM standar berandai-andai \u201cseandainya tidak ada yang mati duluan\u201d \u2014 dunia fantasi yang membengkakkan angka.",
            "kapan": "Populasi tua/multi-komorbid: risiko kekambuhan kanker (vs kematian lain), risiko readmission (vs kematian). Pakai cumulative incidence function (CIF) / model Fine-Gray.",
            "worked": (
                "\U0001f4d0 Contoh: kekambuhan kanker prostat pada lansia",
                "<p>KM standar: risiko kekambuhan 5 tahun = <strong>25%</strong> (kematian non-kanker disensor).<br />"
                "CIF (competing risk): risiko kekambuhan = <strong>18%</strong> \u2014 karena 7% pasien meninggal duluan karena sebab lain.<br />"
                "Selisih 7 poin = pasien yang KM \u201changatkan\u201d seolah masih berisiko kambuh padahal sudah meninggal. Untuk konseling pasien, angka 18% yang jujur.</p>",
            ),
        },
    ],
    "myths": [
        ("Pasien yang hilang follow-up (tersensor) sebaiknya dibuang dari analisis",
         "Membuang = menghapus informasi \u201cmereka bertahan selama terpantau\u201d dan biasanya bias (yang hilang sering berbeda dari yang bertahan). KM justru dirancang untuk memakai kontribusi parsial mereka. Yang wajib dicek: apakah sensornya <em>informatif</em> (mis. yang memburuk berhenti kontrol \u2192 sensor terkait prognosis \u2192 asumsi violated)."),
        ("Median survival = rata-rata umur pasien",
         "Median survival = waktu saat kurva KM menyentuh 50%: separuh pasien mengalami kejadian sebelum titik itu. Bukan rata-rata, bukan harapan hidup individu. Dan bila kurva tidak pernah turun sampai 0,5 (follow-up pendek), median <em>tidak terdefinisi</em> \u2014 laporkan survival rate di titik waktu tertentu sebagai gantinya."),
        ("HR = 2 artinya peluang kejadiannya dua kali lipat",
         "HR adalah rasio <em>laju sesaat</em> (hazard), bukan rasio probabilitas kumulatif. Pada follow-up panjang, rasio probabilitas bisa menyimpang dari HR. Baca HR sebagai \u201ckecepatan kejadian relatif\u201d, bukan \u201crisiko dua kali lipat\u201d mentah-mentah."),
    ],
    "tips": [
        "Selalu tampilkan <strong>number at risk</strong> di bawah kurva KM. Kurva tanpa itu seperti peta tanpa skala \u2014 ekor kanan bisa didasarkan pada 3 pasien.",
        "Cek <strong>asumsi proportional hazards</strong> sebelum percaya HR: plot log-minus-log atau Schoenfeld. Kurva yang bersilangan = HR tunggal menipu.",
        "Untuk outcome non-kematian pada populasi tua, tanya: <strong>\u201capa competing risk-nya?\u201d</strong> sebelum memakai KM standar. Kebanyakan analisis readmission/kekambuhan mengabaikan ini.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Hitung Kurva Kaplan-Meier Manual",
            "intro": "Implementasi rumus KM langkah-demi-langkah. Data: list (waktu, status) dengan 1=kejadian, 0=tersensor. Ubah data dan lihat bagaimana sensor memengaruhi n_i tanpa menurunkan kurva.",
            "hint": "Coba ubah status pasien bulan 5 dari 0 (sensor) menjadi 1 (kejadian). Bandingkan kurvanya \u2014 sensor vs kejadian di titik yang sama memberi hasil sangat beda.",
            "code": (
                "data = [(3,1),(5,0),(6,1),(8,0),(12,1)]  # (waktu, 1=kejadian/0=sensor)\n"
                "data.sort()\n"
                "n = len(data)\n"
                "S = 1.0\n"
                "print(f\"{'waktu':>6} {'status':>8} {'n_risiko':>9} {'S(t)':>7}\")\n"
                "berisiko = n\n"
                "for t, status in data:\n"
                "    if status == 1:\n"
                "        S *= (1 - 1/berisiko)\n"
                "        print(f'{t:>6}  kejadian {berisiko:>9} {S:>7.3f}')\n"
                "    else:\n"
                "        print(f'{t:>6}  tersensor {berisiko:>9} {S:>7.3f}  <- kurva tidak turun')\n"
                "    berisiko -= 1\n"
                "print()\n"
                "print(f'Survival akhir = {S:.3f}')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Simulasi Hazard Ratio Dua Kelompok",
            "intro": "Bangkitkan waktu kejadian eksponensial untuk kontrol (hazard \u03bb) dan obat (hazard \u03bb\u00d7HR). Estimasi HR dari rasio median, dan lihat efek sensor acak.",
            "hint": "Ubah HR dari 0.7 ke 1.0 (obat tidak manjur). Apakah estimasimu mendekati 1? Sekarang naikkan sensor ke 60% \u2014 apa yang terjadi pada presisi?",
            "code": (
                "import random, statistics as st\n"
                "random.seed(3)\n"
                "lam, HR, n = 0.1, 0.7, 500  # hazard kontrol, HR obat, n per kelompok\n"
                "p_sensor = 0.3\n"
                "def bangkitkan(hazard):\n"
                "    out = []\n"
                "    for _ in range(n):\n"
                "        t = random.expovariate(hazard)          # waktu kejadian\n"
                "        c = random.expovariate(0.05)            # waktu sensor\n"
                "        out.append((min(t, c), 1 if t <= c else 0))\n"
                "    return out\n"
                "kontrol = bangkitkan(lam); obat = bangkitkan(lam*HR)\n"
                "med = lambda d: st.median([t for t, s in d if s == 1])\n"
                "hr_est = med(kontrol)/med(obat)  # utk eksponensial: HR = median_kontrol/median_obat\n"
                "print(f'median kontrol = {med(kontrol):.1f}, median obat = {med(obat):.1f}')\n"
                "print(f'estimasi HR = {hr_est:.2f} (sebenarnya {HR})')\n"
                "print(f'proporsi tersensor: kontrol {sum(1-s for _,s in kontrol)/n:.0%}, '\n"
                "      f'obat {sum(1-s for _,s in obat)/n:.0%}')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Deskripsi survival satu/dua kelompok \u2192 KM + log-rank",
            "kondisi": "Pertanyaan deskriptif/komparatif sederhana tanpa banyak kovariat.",
            "alasan": "Nonparametrik, visual, standar pelaporan klinis.",
            "contoh": "Survival 5 tahun kanker serviks per stadium.",
        },
        {
            "title": "Banyak faktor prognostik \u2192 Cox",
            "kondisi": "Butuh efek bersih tiap variabel sambil mengontrol yang lain.",
            "alasan": "Regresi untuk waktu-kejadian; HR mudah diinterpretasi; cek proportional hazards.",
            "contoh": "Faktor risiko kematian TB: usia, HIV, resistansi obat.",
            "chart": {
                "var": "hd6HrData",
                "data": [{"y": ["Obat baru", "Usia (+10 thn)", "Diabetes", "Merokok"], "x": [0.70, 1.40, 1.80, 2.10], "type": "bar", "orientation": "h", "marker": {"color": ["#2a7de1", "#e8a838", "#e8a838", "#e8a838"]}, "text": ["0.70", "1.40", "1.80", "2.10"], "textposition": "outside"}],
                "title": "Forest Plot Sederhana: Hazard Ratio Model Cox",
                "layout": {"xaxis": {"title": "Hazard Ratio (garis 1 = netral)"}, "shapes": [{"type": "line", "x0": 1, "x1": 1, "y0": -0.5, "y1": 3.5, "line": {"dash": "dash", "color": "#94a3b8"}}], "showlegend": False},
                "cara": "Batang horizontal = HR tiap variabel. Garis putus-putus di 1 = netral. Kiri garis = protektif, kanan = berbahaya.",
                "interpretasi": "Obat baru (HR 0,7) satu-satunya yang protektif. Diabetes (1,8) dan merokok (2,1) menaikkan laju kejadian. Inilah cara standar melaporkan Cox: forest plot dengan garis netral 1.",
            },
        },
        {
            "title": "Ada competing risk besar \u2192 CIF / Fine-Gray",
            "kondisi": "Kejadian lain mencegah outcome utama (populasi tua/komorbid).",
            "alasan": "KM standar melebih-lebihkan risiko kumulatif kejadian utama.",
            "contoh": "Risiko kekambuhan kanker pada lansia (vs kematian lain).",
        },
        {
            "title": "Kejadian berulang (reinfeksi, readmission ganda) \u2192 model recurrent event",
            "kondisi": "Satu pasien bisa mengalami kejadian berkali-kali.",
            "alasan": "KM/Cox standar untuk kejadian pertama saja; recurrent butuh Andersen-Gill/frailty.",
            "contoh": "Kekambuhan malaria berulang per pasien per tahun.",
        },
    ],
    "aturan10": [
        "Jangan buang yang tersensor \u2014 pakai KM.",
        "Tampilkan number at risk di bawah kurva.",
        "HR = laju relatif, bukan peluang 2x lipat.",
        "Populasi tua \u2192 cek competing risk.",
    ],
    "case": {
        "title": "RS Mengklaim \u201cProgram DM Menurunkan Kematian 40%\u201d",
        "body": [
            "<p>RS meluncurkan program pengelolaan diabetes. Setahun kemudian: mortalitas pasien program <strong>8%</strong> vs pasien non-program <strong>13%</strong>. Manajemen mengklaim program menurunkan kematian 40% dan minta anggaran diperbesar.</p>",
            "<p>Kamu tarik data: pasien program rata-rata <strong>10 tahun lebih muda</strong> dan dirujuk dari skrining (lebih sehat). Analisis yang dipakai: perbandingan proporsi mentah, tanpa survival, tanpa adjustment.</p>",
        ],
        "pertanyaan": "Apa yang salah dari klaim ini dan analisis apa yang seharusnya dilakukan?",
        "pembahasan": "Klaim mengabaikan confounding by indication: yang masuk program lebih muda dan lebih sehat sejak awal \u2014 selisih 8% vs 13% bisa murni seleksi. Analisis benar: (1) Cox dengan adjustment usia, komorbid, keparahan awal \u2192 HR program yang sesungguhnya; (2) cek proportional hazards; (3) kalau ingin kausal lebih kuat, pertimbangkan propensity score (HD10) karena ini observasional. Kemungkinan besar HR terkoreksi jauh lebih dekat ke 1. Pelajaran: perbandingan mentah program sukarela hampir selalu memuji programnya sendiri.",
    },
    "quiz": [
        ("Sensor kanan artinya\u2026",
         ["Pasien meninggal tepat saat studi berakhir", "Waktu kejadian tidak teramati penuh (masih hidup/hilang saat follow-up berakhir)", "Data pasien dihapus", "Pasien menolak berobat"],
         1,
         "Benar: sensor = informasi parsial (\u201cbertahan setidaknya sampai t\u201d). Inilah yang membuat analisis survival istimewa."),
        ("Pada kurva KM, pasien tersensor menyebabkan\u2026",
         ["Kurva turun", "Kurva tetap, tapi n_i (berisiko) berkurang setelahnya", "Kurva naik", "Tidak ada efek sama sekali"],
         1,
         "Benar: sensor tidak menurunkan kurva \u2014 ia hanya mengeluarkan pasien dari pembagi berikutnya. Kontribusi \u201cbertahan sampai t\u201d tetap dipakai."),
        ("Median survival adalah\u2026",
         ["Rata-rata waktu hidup pasien", "Waktu saat kurva KM menyentuh 0,5", "Waktu follow-up terpanjang", "Setengah dari total pasien"],
         1,
         "Benar: titik saat separuh mengalami kejadian. Bukan rata-rata, dan tak terdefinisi bila kurva tak mencapai 0,5."),
        ("HR = 0,7 pada model Cox untuk obat berarti\u2026",
         ["Peluang sembuh 70%", "Laju kejadian kelompok obat 70% dari kontrol (turun 30%), setelah dikontrol kovariat", "70% pasien sembuh", "Obat gagal"],
         1,
         "Benar: HR = rasio hazard (laju sesaat), bukan probabilitas. Baca sebagai kecepatan relatif."),
        ("Kapan KM standar menipu dan butuh competing risks?",
         ["Selalu", "Ketika kejadian lain (mis. kematian sebab lain) mencegah outcome utama teramati", "Ketika sampel kecil", "Tidak pernah"],
         1,
         "Benar: KM menyensor competing event seolah \u201ctidak terjadi\u201d \u2192 melebih-lebihkan risiko kumulatif. Pakai CIF/Fine-Gray."),
        ("Dua kurva KM bersilangan (obat buruk di awal, bagus belakangan). Masalahnya?",
         ["Tidak ada, log-rank tetap optimal", "Asumsi proportional hazards dilanggar; log-rank melemah, HR tunggal menipu", "Data harus dibuang", "Median tidak bisa dihitung"],
         1,
         "Benar: efek yang berubah seiring waktu butuh model time-varying/stratified. Selalu plot kurvanya dulu."),
    ],
    "rangkuman": [
        "<strong>Sensor kanan</strong> = info parsial yang tetap dipakai KM; jangan dibuang.",
        "<strong>KM</strong>: S(t) = produk peluang bertahan; turun hanya saat kejadian.",
        "<strong>Median survival</strong>: waktu kurva menyentuh 0,5. Tampilkan number at risk.",
        "<strong>Log-rank</strong>: bandingkan kurva (uji beda); <strong>Cox</strong>: kuantifikasi efek (HR) multivariabel.",
        "<strong>HR</strong> = rasio laju sesaat; cek asumsi proportional hazards.",
        "<strong>Competing risks</strong>: KM standar melebih-lebihkan bila ada kejadian pencegah.",
        "Kejadian berulang butuh model recurrent, bukan KM biasa.",
        "Lesson ini fondasi HD12 (prediksi), HD16 (waktu wabah), dan HD20 (capstone).",
    ],
    "prev": ("hd5-uji-klinis", "HD5"),
    "next": ("hd7-longitudinal", "HD7"),
}

# ================================================================ HD7
HD7 = {
    "slug": "hd7-longitudinal",
    "code": "HD7",
    "track": TRACK,
    "cover_title": "Mixed Models &amp; GEE:<br />Data yang Diukur Berulang",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 1.000 Pengukuran, 100 Pasien"),
        ("korelasi", "Korelasi Intra-Subjek \u2014 Si Kembar dalam Data"),
        ("mixed", "Linear Mixed Models"),
        ("gee", "GEE \u2014 Si Pragmatis Populasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Regresi Naif vs Rata-rata Subjek"),
        ("lab2", "\U0001f52c Lab 2: Efek Desain &amp; n Efektif"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan mengapa pengukuran berulang <strong>tidak independen</strong> dan apa akibatnya bila diabaikan.",
        "Membedakan <strong>efek tetap vs efek acak</strong> serta kapan memakai mixed model vs GEE.",
        "Menafsirkan <strong>ICC</strong> dan menghitung <strong>n efektif</strong> data berklaster.",
        "Memilih metode yang tepat untuk 4 skenario data longitudinal kesehatan.",
    ],
    "story_title": "Cerita Pembuka: 1.000 Pengukuran, 100 Pasien",
    "story": [
        "<p>Studi tekanan darah: 100 pasien, masing-masing diukur <strong>10 kali</strong> = 1.000 data. Analis junior menjalankan regresi biasa dengan n=1.000, dapat p < 0,001, dan merayakan. Reviewer menolak: \u201cAnda tidak punya 1.000 observasi independen \u2014 Anda punya 100 orang yang masing-masing diukur 10 kali. Tekanan darah saya jam 8 dan jam 9 <em>bukan dua orang berbeda</em>.\u201d</p>",
        "<p>Regresi naif mengira punya 1.000 saksi independen, padahal 10 kesaksian dari orang yang sama saling membenarkan. Hasilnya: standar error kekecilan, keyakinan kebesaran. Lesson ini tentang cara menghitung yang jujur saat data berkelompok.</p>",
    ],
    "konsep": [
        {
            "id": "korelasi",
            "title": "Korelasi Intra-Subjek \u2014 Si Kembar dalam Data",
            "definisi": "Pengukuran berulang pada subjek yang sama <strong>berkorelasi</strong>: nilai seseorang cenderung mirip dirinya sendiri dibanding orang lain. <strong>ICC (Intraclass Correlation)</strong> mengukur seberapa besar kemiripan itu (0\u20131).",
            "rumus": r"ICC = \frac{\sigma^2_{antar}}{\sigma^2_{antar} + \sigma^2_{dalam}}",
            "simbol": [
                (r"\sigma^2_{antar}", "variansi ANTAR subjek (beda orang)"),
                (r"\sigma^2_{dalam}", "variansi DALAM subjek (fluktuasi pengukuran orang yang sama)"),
            ],
            "interpretasi": "ICC = 0,7 artinya 70% variasi berasal dari perbedaan antar orang \u2014 pengukuran satu orang sangat mirip dirinya. Makin tinggi ICC, makin \u201cpalsu\u201d n besar dari pengukuran berulang.",
            "worked": (
                "\U0001f4d0 Contoh: ICC tekanan darah",
                "<p>Variansi antar pasien = 140, variansi dalam pasien (antar kunjungan) = 60.<br />"
                "ICC = 140/(140+60) = <strong>0,70</strong>.<br />"
                "Artinya pengukuran ulang satu pasien 70% mencerminkan \u201csiapa dia\u201d, hanya 30% info baru. "
                "n efektif jauh di bawah 1.000 (lihat lab 2).</p>",
            ),
            "kepribadian": "ICC itu meter kejujuran n: mendekati 1 berarti pengukuran ulang hampir tidak menambah informasi independen; mendekati 0 berarti tiap pengukuran seperti orang baru.",
            "kapan": "Langkah pertama SETIAP data longitudinal/berklaster: hitung ICC dulu untuk tahu seberapa parah masalahnya.",
            "chart": {
                "var": "hd7IccData",
                "data": [{"x": [1, 2, 3, 4, 5], "y": [150, 148, 152, 149, 151], "type": "scatter", "mode": "lines+markers", "name": "Pasien A", "line": {"color": "#2a7de1"}},
                        {"x": [1, 2, 3, 4, 5], "y": [110, 112, 109, 111, 110], "type": "scatter", "mode": "lines+markers", "name": "Pasien B", "line": {"color": "#e8a838"}},
                        {"x": [1, 2, 3, 4, 5], "y": [135, 128, 142, 131, 139], "type": "scatter", "mode": "lines+markers", "name": "Pasien C", "line": {"color": "#94a3b8"}}],
                "title": "Tekanan Darah Sistolik: 3 Pasien \u00d7 5 Kunjungan",
                "layout": {"xaxis": {"title": "Kunjungan ke-"}, "yaxis": {"title": "Sistolik (mmHg)"}, "showlegend": True},
                "cara": "Tiga garis = tiga pasien, lima titik = lima kunjungan. Perhatikan jarak ANTAR garis vs goyangan DALAM satu garis.",
                "interpretasi": "Garis-garis terpisah jauh (beda orang besar) tapi tiap garis relatif datar (fluktuasi kecil) \u2014 inilah ICC tinggi secara visual. Regresi naif yang menganggap 15 titik ini independen sedang berhalusinasi punya 15 pasien.",
            },
        },
        {
            "id": "mixed",
            "title": "Linear Mixed Models \u2014 Si Adil per Individu",
            "definisi": "<strong>Mixed model</strong> memisahkan <strong>efek tetap</strong> (fixed: efek populasi, mis. pengaruh obat) dari <strong>efek acak</strong> (random: perbedaan baseline tiap subjek/klaster). Tiap subjek boleh punya intersep (bahkan slope) sendiri.",
            "rumus": r"Y_{ij} = \beta_0 + \beta_1 X_{ij} + u_i + \varepsilon_{ij}",
            "simbol": [
                (r"Y_{ij}", "pengukuran ke-j pada subjek i"),
                (r"\beta_0, \beta_1", "efek tetap: intersep & kemiringan populasi"),
                (r"u_i", "efek acak subjek i: simpangan baseline orang itu dari rata-rata populasi"),
                (r"\varepsilon_{ij}", "residu pengukuran individual"),
            ],
            "interpretasi": "u_i menangkap \u201ckepribadian\u201d tiap subjek (ada yang tensinya memang tinggi bawaan). \u03b2 menjawab pertanyaan populasi; u_i memastikan standar error jujur.",
            "worked": (
                "\U0001f4d0 Contoh: efek obat antihipertensi",
                "<p>Model: sistolik_ij = 140 \u2212 8\u00b7obat_ij + u_i + \u03b5_ij, dengan SD(u_i) = 12.<br />"
                "\u03b2_1 = \u22128: obat menurunkan 8 mmHg <strong>rata-rata populasi</strong>.<br />"
                "u_A = +15: pasien A tensinya 15 mmHg di atas rata-rata secara bawaan (efek acak).<br />"
                "Tanpa u_i, model mengira 1.000 pengukuran independen \u2192 SE kekecilan \u2192 p-value palsu signifikan.</p>",
            ),
            "kepribadian": "Mixed model itu guru yang adil: ia menilai kemajuan tiap murid relatif terhadap baseline murid itu sendiri, bukan memukul rata. Efek tetap = kurikulum untuk semua; efek acak = mengakui tiap murid beda titik awal.",
            "kapan": "Fokus pada efek individu/subjek, data hierarkis (pasien dalam RS dalam provinsi), atau ingin prediksi per subjek. Butuh asumsi distribusi efek acak (biasanya normal).",
        },
        {
            "id": "gee",
            "title": "GEE \u2014 Si Pragmatis Populasi",
            "definisi": "<strong>GEE (Generalized Estimating Equations)</strong> mengestimasi efek <strong>rata-rata populasi</strong> sambil mengoreksi korelasi intra-subjek via \u201cworking correlation\u201d \u2014 tanpa memodelkan tiap individu.",
            "kepribadian": "GEE itu pragmatis: \u201cSaya tidak peduli tiap orang seperti apa; saya mau jawaban populasi yang SE-nya jujur.\u201d Ia memakai sandwich estimator \u2014 roti lapis yang tetap kokoh walau tebakan struktur korelasinya salah.",
            "kapan": "Fokus pada efek populasi (kebijakan!), outcome tidak normal (biner/count), atau tidak ingin asumsi distribusi efek acak. Standar untuk uji klinis longitudinal dan surveilans.",
            "worked": (
                "\U0001f4d0 Contoh: kapan GEE mengalahkan mixed model",
                "<p>Program: apakah posyandu menurunkan diare balita (ya/tidak, diukur 6x)?<br />"
                "<strong>GEE:</strong> \u201cRata-rata populasi, peluang diare turun OR=0,7\u201d \u2014 jawaban untuk Dinkes.<br />"
                "<strong>Mixed model:</strong> \u201cUntuk balita tertentu dengan frailty u_i\u2026\u201d \u2014 jawaban untuk dokter anak.<br />"
                "Pertanyaan kebijakan \u2192 GEE. Pertanyaan individual \u2192 mixed.</p>",
            ),
            "callout": "<strong>Aturan praktis:</strong> efek <strong>populasi</strong> (policy, program) \u2192 GEE; efek <strong>subjek-spesifik</strong> atau prediksi individual \u2192 mixed model. Untuk data normal dan pertanyaan populasi, keduanya sering memberi \u03b2 mirip \u2014 beda di interpretasi dan asumsi.",
        },
    ],
    "myths": [
        ("Pengukuran berulang = n besar = power besar, selalu menguntungkan",
         "Power naik, tapi tidak sebesar yang dikira n mentah \u2014 n efektif = n/(1+(m\u22121)\u00d7ICC). Dengan ICC 0,7 dan 10 pengukuran, 1.000 data hanya setara ~150 independen. Yang lebih berbahaya: analisis naif memberi SE palsu kecil \u2192 temuan palsu signifikan."),
        ("Mixed model dan GEE selalu memberi jawaban sama",
         "Untuk outcome linear dan pertanyaan populasi, sering mirip. Untuk outcome biner, koefisien mixed (subjek-spesifik) dan GEE (populasi) punya <em>interpretasi berbeda</em> dan nilainya bisa jauh beda (non-collapsibility OR). Pilih berdasarkan pertanyaan, bukan kebiasaan."),
        ("Cukup tambahkan ID pasien sebagai variabel dummy (fixed effect)",
         "Itu menghabiskan 99 derajat bebas untuk 100 pasien, tidak bisa generalisasi ke pasien baru, dan gagal untuk klaster bertingkat. Efek acak (random) justru dirancang untuk ini: hemat parameter + generalisasi ke populasi klaster."),
    ],
    "tips": [
        "Urutkan kerja: <strong>plot dulu</strong> (spaghetti plot per subjek) \u2192 <strong>hitung ICC</strong> \u2192 baru pilih model. Plot 3 pasien di chart atas sudah memberi tahu ICC tinggi sebelum satu baris kode model.",
        "Tanya <strong>\u201cefek untuk siapa?\u201d</strong> sebelum pilih: rata-rata populasi (GEE) vs individu spesifik (mixed). Kebanyakan keputusan kesehatan masyarakat = populasi = GEE.",
        "Waspadai <strong>missing tidak acak</strong> pada longitudinal: pasien yang memburuk berhenti kontrol (lihat HD8). Mixed model tahan terhadap MAR; GEE standar butuh MCAR kecuali dibobot (IPW).",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Regresi Naif vs Kebenaran Berklaster",
            "intro": "Bangkitkan data 50 pasien \u00d7 8 kunjungan dengan efek obat NOL. Jalankan regresi naif (abaikan klaster) vs agregat per pasien. Lihat berapa sering regresi naif \u201cmenemukan\u201d efek palsu.",
            "hint": "Jalankan beberapa kali (seed berbeda). Hitung: dari 20 ulangan, berapa kali p naif < 0.05 padahal efek sebenarnya NOL? Itulah harga mengabaikan korelasi.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(21)\n"
                "n_pasien, m = 50, 8\n"
                "semua_x, semua_y = [], []\n"
                "rata = []  # rata-rata per pasien\n"
                "for i in range(n_pasien):\n"
                "    u = random.gauss(0, 12)          # efek acak pasien (baseline)\n"
                "    obat = 1 if i % 2 == 0 else 0     # acak per pasien\n"
                "    ys = [140 + 0*obat + u + random.gauss(0, 5) for _ in range(m)]\n"
                "    semua_x += [obat]*m; semua_y += ys\n"
                "    rata.append((obat, st.mean(ys)))\n"
                "# regresi naif: anggap 400 independen\n"
                "mx = st.mean(semua_x)\n"
                "b_naif = sum((x-mx)*(y-st.mean(semua_y)) for x, y in zip(semua_x, semua_y))/sum((x-mx)**2 for x in semua_x)\n"
                "# agregat per pasien (n=50, pendekatan jujur sederhana)\n"
                "g1 = [y for o, y in rata if o == 1]; g0 = [y for o, y in rata if o == 0]\n"
                "print(f'efek sebenarnya: 0 mmHg')\n"
                "print(f'regresi naif (n=400): b = {b_naif:+.2f}  <- terlihat \u201ceksak\u201d tapi menipu')\n"
                "print(f'beda rata2 pasien (n=50): {st.mean(g1)-st.mean(g0):+.2f} mmHg')\n"
                "print()\n"
                "print('Naif memakai n=400 -> SE kekecilan -> mudah \u201csignifikan\u201d palsu.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: n Efektif \u2014 Berapa Saksi Aslimu?",
            "intro": "Hitung n efektif = n / (1 + (m-1)\u00d7ICC) untuk berbagai ICC dan jumlah pengukuran. Lihat kapan menambah pengukuran sudah tidak worth it.",
            "hint": "Coba ICC=0.9 (pengukuran sangat mirip). Berapa n efektif dari 1.000 data? Sekarang ICC=0.1. Pelajaran: redundansi membunuh nilai tambah pengukuran ulang.",
            "code": (
                "n_total = 1000\n"
                "print(f\"{'ICC':>5} {'m (ukur/pasien)':>16} {'n efektif':>10} {'info baru':>10}\")\n"
                "for icc in [0.1, 0.5, 0.7, 0.9]:\n"
                "    for m in [2, 5, 10, 20]:\n"
                "        n_eff = n_total / (1 + (m-1)*icc)\n"
                "        print(f'{icc:>5} {m:>16} {n_eff:>10.0f} {n_eff/n_total:>9.0%}')\n"
                "    print()\n"
                "print('Aturan: ICC tinggi -> tambah pengukuran nyaris tak menambah info.')\n"
                "print('Desain lebih baik: tambah PASIEN, bukan tambah pengukuran.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Efek rata-rata populasi, outcome apapun \u2192 GEE",
            "kondisi": "Pertanyaan kebijakan/program; tidak butuh prediksi individual.",
            "alasan": "Robust terhadap salah spesifikasi korelasi (sandwich SE); natural untuk biner/count.",
            "contoh": "Efek program posyandu terhadap diare balita (biner, 6 pengukuran).",
        },
        {
            "title": "Butuh prediksi/efek per subjek atau klaster bertingkat \u2192 Mixed model",
            "kondisi": "Pertanyaan individual atau hierarki (pasien < RS < provinsi).",
            "alasan": "Efek acak menangkap heterogenitas tiap level; bisa prediksi untuk subjek baru.",
            "contoh": "Prediksi tekanan darah pasien spesifik; variasi antar RS.",
            "chart": {
                "var": "hd7NeffData",
                "data": [{"x": [2, 5, 10, 20], "y": [870, 625, 417, 244], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "ICC=0.1", "text": [870, 625, 417, 244], "textposition": "outside"},
                        {"x": [2, 5, 10, 20], "y": [526, 270, 137, 55], "type": "bar", "marker": {"color": "#e8a838"}, "name": "ICC=0.7", "text": [526, 270, 137, 55], "textposition": "outside"}],
                "title": "n Efektif dari 1.000 Pengukuran (50 pasien)",
                "layout": {"barmode": "group", "xaxis": {"title": "Pengukuran per pasien"}, "yaxis": {"title": "n efektif"}, "showlegend": True},
                "cara": "Sumbu X = berapa kali tiap pasien diukur. Biru = ICC rendah (0,1), kuning = ICC tinggi (0,7). Tinggi batang = n efektif.",
                "interpretasi": "Dengan ICC 0,7, menaikkan pengukuran dari 2 ke 20 (10x biaya!) hanya menaikkan n efektif dari 526 ke 55?? \u2014 tunggu, justru TURUN relatif karena n total tetap 1.000 (pasien berkurang). Pelajaran desain: pada ICC tinggi, uang paling baik dibelanjakan untuk <strong>menambah pasien</strong>, bukan menambah pengukuran.",
            },
        },
        {
            "title": "Hanya 2 waktu (pre-post) \u2192 ANCOVA / change score",
            "kondisi": "Desain sebelum-sesudah sederhana.",
            "alasan": "Mixed model overkill; ANCOVA (kontrol baseline) paling powerful.",
            "contoh": "Tekanan darah sebelum vs sesudah 3 bulan obat.",
        },
        {
            "title": "Tren waktu per individu \u2192 Random slope mixed model",
            "kondisi": "Tidak hanya baseline beda, kecepatan perubahan pun beda antar subjek.",
            "alasan": "Random intercept saja meremehkan heterogenitas tren.",
            "contoh": "Laju penurunan eGFR (ginjal) tiap pasien CKD berbeda.",
        },
    ],
    "aturan10": [
        "Plot spaghetti dulu, hitung ICC, baru pilih model.",
        "Populasi \u2192 GEE; individu \u2192 mixed.",
        "ICC tinggi \u2192 tambah pasien, bukan pengukuran.",
        "Missing longitudinal jarang MCAR \u2014 cek polanya.",
    ],
    "case": {
        "title": "Aplikasi Diet: \u201cTurun 5 kg, p<0,001!\u201d",
        "body": [
            "<p>Startup aplikasi diet mengklaim: 2.000 pengguna, berat ditimbang tiap minggu selama 12 minggu (24.000 data), rata-rata turun <strong>5 kg, p < 0,001</strong> (uji-t biasa pada 24.000 data). Investor tertarik.</p>",
            "<p>Kamu audit: 40% pengguna berhenti menimbang setelah minggu ke-4 (kemungkinan yang gagal), analisis memakai semua titik tanpa koreksi klaster, tanpa kelompok kontrol.</p>",
        ],
        "pertanyaan": "Sebutkan minimal 3 cacat analisis dan apa analisis yang benar.",
        "pembahasan": "(1) n palsu: 24.000 titik dari 2.000 orang diperlakukan independen \u2192 SE kekecilan, p-value tidak valid (butuh mixed/GEE). (2) Drop-out informatif: yang berhenti kemungkinan gagal \u2014 analisis completers melebih-lebihkan (bias seleksi; butuh asumsi MAR + sensitivitas MNAR, lihat HD8). (3) Tanpa kontrol: penurunan bisa regresi ke mean atau musiman, bukan efek aplikasi. Analisis benar: mixed model/GEE dengan semua data (bukan completers saja), laporkan n efektif, dan \u2014 untuk klaim kausal \u2014 butuh pembanding. p<0,001 dari n palsu adalah angka hiburan, bukan bukti.",
    },
    "quiz": [
        ("100 pasien \u00d7 10 pengukuran dianalisis dengan regresi biasa (n=1.000). Masalah utama?",
         ["Tidak ada, n besar = bagus", "Observasi tidak independen \u2192 SE kekecilan \u2192 p-value palsu signifikan", "Komputer lambat", "Harus selalu pakai n=100 saja"],
         1,
         "Benar: korelasi intra-subjek dilanggar. n=1.000 adalah ilusi; n efektif jauh lebih kecil."),
        ("ICC = 0,8 artinya\u2026",
         ["80% pasien sembuh", "80% variasi berasal dari perbedaan antar subjek \u2014 pengukuran ulang sangat redundan", "Korelasi 80% dengan outcome", "Model 80% akurat"],
         1,
         "Benar: ICC tinggi = \u201csiapa orangnya\u201d mendominasi. Tambah pengukuran nyaris tak menambah info independen."),
        ("Penelitian ingin efek RATA-RATA POPULASI program posyandu (outcome biner, diukur 6x). Pilihan paling natural?",
         ["Mixed model dengan random slope", "GEE", "Regresi biasa", "Uji-t"],
         1,
         "Benar: pertanyaan populasi + outcome biner = habitat alami GEE (sandwich SE robust)."),
        ("Kapan mixed model lebih tepat dari GEE?",
         ["Selalu", "Butuh prediksi/efek per subjek atau data hierarkis bertingkat", "Data kecil", "Tidak pernah"],
         1,
         "Benar: efek acak menangkap heterogenitas tiap level dan memungkinkan prediksi individual."),
        ("Menambahkan ID pasien sebagai 99 variabel dummy fixed effect adalah\u2026",
         ["Solusi terbaik", "Boros derajat bebas dan tak bisa generalisasi ke pasien baru \u2014 pakai random effect", "Wajib untuk semua model", "Hanya untuk data kecil"],
         1,
         "Benar: fixed effect per subjek = mahal + tidak generalisasi. Random effect dirancang untuk ini."),
        ("n=1.000 (50 pasien \u00d7 20 pengukuran), ICC=0,7. n efektif sekitar\u2026",
         ["1.000", "500", "70", "20"],
         2,
         "Benar: 1000/(1+19\u00d70,7) = 1000/14,3 \u2248 70. Inilah \u201cn palsu\u201d secara kuantitatif."),
    ],
    "rangkuman": [
        "Pengukuran berulang <strong>tidak independen</strong> \u2014 abaikan = SE palsu.",
        "<strong>ICC</strong> mengukur redundansi; <strong>n efektif</strong> = n/(1+(m\u22121)ICC).",
        "<strong>Mixed model</strong>: efek tetap (populasi) + efek acak (subjek) \u2014 untuk pertanyaan individual/hierarkis.",
        "<strong>GEE</strong>: efek rata-rata populasi dengan SE robust \u2014 untuk pertanyaan kebijakan.",
        "Untuk biner, koefisien mixed vs GEE beda interpretasi (non-collapsibility).",
        "ICC tinggi \u2192 belanjakan anggaran untuk <strong>tambah subjek</strong>.",
        "Waspadai drop-out informatif pada data longitudinal (sambung ke HD8).",
        "Alur kerja: plot spaghetti \u2192 ICC \u2192 pilih model sesuai pertanyaan.",
    ],
    "prev": ("hd6-survival", "HD6"),
    "next": ("hd8-missing-data", "HD8"),
}

# ================================================================ HD8
HD8 = {
    "slug": "hd8-missing-data",
    "code": "HD8",
    "track": TRACK,
    "cover_title": "MICE &amp; MNAR:<br />Ketika Data Klinis Berlubang",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Kolom yang Hilang Justru Berbicara"),
        ("mekanisme", "MCAR, MAR, MNAR \u2014 Tiga Cara Hilang"),
        ("mice", "Multiple Imputation (MICE)"),
        ("mnar", "MNAR: Lubang yang Tidak Bisa Ditambal Sempurna"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Imputasi Mean Merusak Variansi"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Mekanisme MAR vs MNAR"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Mengklasifikasikan pola missing ke <strong>MCAR/MAR/MNAR</strong> dari skenario nyata.",
        "Menjelaskan mengapa <strong>imputasi mean tunggal</strong> merusak variansi dan mengapa <strong>MICE</strong> lebih baik.",
        "Menjalankan logika <strong>multiple imputation + Rubin's rules</strong> secara konseptual.",
        "Merancang <strong>analisis sensitivitas MNAR</strong> sederhana untuk temuan kunci.",
    ],
    "story_title": "Cerita Pembuka: Kolom yang Hilang Justru Berbicara",
    "story": [
        "<p>RS menganalisis faktor risiko readmission. Kolom \u201cskor nyeri saat pulang\u201d kosong pada 30% pasien. Analis menghapus 30% itu dan melanjutkan. Reviewer bertanya satu kalimat: \u201cBagaimana kalau yang tidak mengisi justru yang nyerinya paling parah \u2014 karena terlalu sakit untuk mengisi formulir?\u201d Hening.</p>",
        "<p>Data yang hilang bukan ketiadaan informasi \u2014 ia <em>adalah</em> informasi, hanya saja terenkripsi oleh alasannya hilang. Lesson ini mengajarkan tiga jenis enkripsi itu, dan kapan kamu bisa mendekripsinya.</p>",
    ],
    "konsep": [
        {
            "id": "mekanisme",
            "title": "MCAR, MAR, MNAR \u2014 Tiga Cara Hilang",
            "definisi": "<strong>MCAR</strong>: hilang murni acak (sensor rusak). <strong>MAR</strong>: hilang terkait variabel <em>teramati</em> (lansia lebih sering skip kuesioner online). <strong>MNAR</strong>: hilang terkait <em>nilai yang hilang itu sendiri</em> (yang paling sakit tidak mengisi skor nyeri).",
            "kepribadian": "MCAR itu amplop hilang di kantor pos \u2014 sial tapi adil. MAR itu amplop hilang karena alamatnya di gang sempit (pola bisa dilacak dari data lain). MNAR itu surat yang sengaja tidak dikirim karena isinya memalukan \u2014 tidak ada cara melacak dari luar.",
            "kapan": "Diagnosis dulu sebelum terapi: MCAR \u2192 hapus masih OK; MAR \u2192 imputasi cerdas valid; MNAR \u2192 waspada + sensitivitas.",
            "worked": (
                "\U0001f4d0 Contoh: tiga mekanisme di satu RS",
                "<p><strong>MCAR:</strong> 2% hasil lab hilang karena server down acak semalam.<br />"
                "<strong>MAR:</strong> kolom pendapatan kosong 40% \u2014 tapi pola terkait <em>pekerjaan</em> yang tercatat (wiraswasta enggan mengisi). Bisa diprediksi dari pekerjaan.<br />"
                "<strong>MNAR:</strong> skor depresi kosong pada yang paling depresi \u2014 nilai yang hilang itulah penyebab hilangnya. Tidak bisa diprediksi penuh dari variabel lain.</p>",
            ),
            "chart": {
                "var": "hd8MechData",
                "data": [{"x": ["MCAR", "MAR", "MNAR"], "y": [85, 60, 25], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["85%", "60%", "25%"], "textposition": "outside"}],
                "title": "Seberapa Baik Imputasi Bisa Memulihkan? (ilustratif)",
                "layout": {"xaxis": {"title": "Mekanisme"}, "yaxis": {"title": "% bias yang bisa dikoreksi", "range": [0, 100]}, "showlegend": False},
                "cara": "Tinggi batang = seberapa besar bias yang bisa dikoreksi imputasi cerdas pada tiap mekanisme.",
                "interpretasi": "MCAR hampir pulih penuh; MAR sebagian besar bisa dikoreksi (karena polanya terlacak); MNAR hanya sedikit \u2014 sisanya butuh asumsi yang tidak bisa diuji dari data. Inilah kenapa diagnosis mekanisme adalah langkah pertama, bukan imputasi.",
            },
        },
        {
            "id": "mice",
            "title": "Multiple Imputation (MICE) \u2014 Si Jujur yang Ragu",
            "definisi": "<strong>MICE</strong>: buat <em>banyak</em> (m) versi dataset lengkap dengan imputasi berbeda (mencerminkan ketidakpastian), analisis tiap versi, lalu gabungkan dengan <strong>Rubin's rules</strong>.",
            "rumus": r"\bar{Q} = \frac{1}{m}\sum_{j=1}^{m} \hat{Q}_j \quad ; \quad Var = W + \left(1+\frac{1}{m}\right)B",
            "simbol": [
                (r"\hat{Q}_j", "estimasi (mis. koefisien) dari dataset imputasi ke-j"),
                (r"\bar{Q}", "gabungan: rata-rata m estimasi"),
                (r"W", "variansi DALAM imputasi (rata-rata SE\u00b2 tiap dataset)"),
                (r"B", "variansi ANTAR imputasi (seberapa beda hasil antar versi)"),
            ],
            "interpretasi": "Rumus variansi punya dua suku: W (ketidakpastian biasa) + B (ketidakpastian <em>akibat missing itu sendiri</em>). Imputasi tunggal (mean) menyembunyikan suku B \u2014 MICE menampakkannya dengan jujur.",
            "worked": (
                "\U0001f4d0 Contoh: MICE 5 imputasi untuk efek obat",
                "<p>Estimasi efek dari 5 dataset: 8,2; 7,5; 9,1; 8,8; 7,9.<br />"
                "Gabungan = rata-rata = <strong>8,3</strong>.<br />"
                "W = rata-rata variansi tiap analisis; B = variansi antar lima angka (0,42).<br />"
                "SE akhir = akar(W + 1,2\u00d7B) \u2014 <strong>lebih besar</strong> dari SE imputasi tunggal. Itulah kejujuran: mengakui kita tidak tahu nilai yang hilang.</p>",
            ),
            "kepribadian": "MICE itu ilmuwan yang berkata \u201csaya tidak tahu persis, tapi kemungkinannya berkisar ini\u201d \u2014 lalu mengulang analisis di tiap kemungkinan. Imputasi mean tunggal itu dukun yang pede: satu angka, nol keraguan, salah dengan yakin.",
            "kapan": "Standar untuk MAR dengan missing substansial (>5%). Sertakan <strong>semua variabel analisis + outcome</strong> dalam model imputasi (mengeluarkan outcome = melemahkan hubungan yang ingin diestimasi!).",
        },
        {
            "id": "mnar",
            "title": "MNAR: Lubang yang Tidak Bisa Ditambal Sempurna",
            "definisi": "Pada <strong>MNAR</strong>, mekanisme hilang terkait nilai tak teramati \u2014 tidak bisa diuji atau dikoreksi penuh dari data. Senjata yang tersisa: <strong>analisis sensitivitas</strong> (tipping-point): seberapa ekstrem MNAR harus terjadi agar kesimpulan berbalik?",
            "kepribadian": "MNAR itu lubang hitam: kamu bisa mengorbitinya (sensitivitas), tapi tidak bisa melihat ke dalam (tidak teridentifikasi dari data). Ilmuwan jujur melaporkan seberapa dekat kesimpulanmu dengan tepi lubang.",
            "kapan": "Setiap temuan kunci dengan missing >10%: laporkan analisis sensitivitas MNAR. Khususnya outcome yang <em>self-reported</em> (nyeri, depresi, kepuasan).",
            "worked": (
                "\U0001f4d0 Contoh: tipping-point untuk skor nyeri",
                "<p>Temuan: obat menurunkan nyeri 2 poin (MICE, MAR). Sensitivitas: asumsikan yang missing di kelompok obat sebenarnya 1, 2, 3 poin <em>lebih buruk</em> dari imputasi MAR.<br />"
                "Hasil: kesimpulan bertahan sampai asumsi +2,5 poin; berbalik pada +3.<br />"
                "Laporan jujur: \u201cTemuan robust kecuali bila pasien missing 3+ poin lebih buruk dari prediksi \u2014 skenario yang kami nilai tidak plausibel karena\u2026\u201d</p>",
            ),
            "warning": "<strong>Jangan</strong> lakukan complete-case analysis diam-diam lalu berharap reviewer tidak bertanya. Laporkan: % missing per variabel kunci, mekanisme yang diasumsikan + alasannya, metode penanganan, dan sensitivitas. Transparansi > kesempurnaan.",
        },
    ],
    "myths": [
        ("Missing 5% boleh diabaikan, missing 30% tinggal dihapus saja yang bolong",
         "Ambang persen bukan penentunya \u2014 <em>mekanisme</em>lah. 5% MNAR pada outcome utama bisa membalik kesimpulan; 30% MCAR pada kovariat minor hampir tidak masalah. Hapus yang bolong (complete-case) valid hanya untuk MCAR \u2014 yang paling jarang terjadi di data klinis."),
        ("Imputasi = mengarang data, jadi tidak ilmiah",
         "Imputasi yang benar tidak mengarang <em>fakta</em> \u2014 ia memodelkan <em>ketidakpastian</em> secara eksplisit (lihat suku B di Rubin's rules). Yang tidak ilmiah adalah complete-case diam-diam: ia mengarang asumsi \u201cMCAR\u201d tanpa mengatakannya."),
        ("MICE menyelesaikan masalah MNAR",
         "MICE mengasumsikan MAR. Pada MNAR, MICE tetap bias \u2014 hanya biasnya lebih kecil dan SE-nya lebih jujur. MNAR butuh model seleksi/pattern-mixture + sensitivitas, bukan MICE yang lebih banyak."),
    ],
    "tips": [
        "Buat <strong>indikator missing</strong> (kolom 1/0) untuk variabel kunci dan cek hubungannya dengan outcome. Kadang \u201chilangkan\u201d itu sendiri prediktor kuat (pasien tanpa skor nyeri = lebih parah).",
        "Aturan praktis jumlah imputasi: <strong>m \u2248 % missing</strong> (missing 30% \u2192 m=30). Komputasi murah dibanding malu di review.",
        "Dokumentasikan <strong>asumsi mekanisme per variabel</strong> dalam satu tabel metode. Reviewer klinis menghargai kejujuran ini lebih dari teknik canggih.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Imputasi Mean Merusak Variansi",
            "intro": "Bangkitkan data normal, hilangkan 30% secara MCAR, lalu bandingkan: hapus vs imputasi mean vs kebenaran. Lihat SD menyusut pada imputasi mean.",
            "hint": "Ubah proporsi missing 0.3 \u2192 0.5. Perhatikan SD imputasi-mean makin menyusut sementara SE-nya terlihat makin \u201cpresisi\u201d \u2014 presisi palsu!",
            "code": (
                "import random, statistics as st\n"
                "random.seed(5)\n"
                "n, p_miss = 1000, 0.3\n"
                "asli = [random.gauss(100, 15) for _ in range(n)]\n"
                "teramati = [x for x in asli if random.random() > p_miss]\n"
                "mean_obs = st.mean(teramati)\n"
                "imput_mean = teramati + [mean_obs]*(n - len(teramati))\n"
                "print(f'data asli      : mean={st.mean(asli):.1f}  SD={st.stdev(asli):.1f}')\n"
                "print(f'hapus (MCAR)   : mean={st.mean(teramati):.1f}  SD={st.stdev(teramati):.1f}  n={len(teramati)}')\n"
                "print(f'imputasi mean  : mean={st.mean(imput_mean):.1f}  SD={st.stdev(imput_mean):.1f}  n={n}')\n"
                "print()\n"
                "print('Imputasi mean: SD menyusut (data palsu tak bervariasi)')\n"
                "print('-> SE kekecilan -> p-value terlalu optimis. Jangan!')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: MAR Bisa Dipulihkan, MNAR Tidak",
            "intro": "Simulasikan pendapatan yang hilang karena (a) MAR: terkait pekerjaan teramati; (b) MNAR: terkait pendapatan itu sendiri. Bandingkan mean teramati vs kebenaran.",
            "hint": "Pada skenario MAR, coba koreksi dengan rata-rata per pekerjaan (stratifikasi). Pada MNAR, tidak ada stratifikasi yang bisa \u2014 rasakan bedanya.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(9)\n"
                "n = 5000\n"
                "data = []\n"
                "for _ in range(n):\n"
                "    kerja = random.choice(['buruh', 'kantor'])\n"
                "    gaji = random.gauss(8 if kerja == 'buruh' else 15, 2)\n"
                "    data.append((kerja, gaji))\n"
                "true_mean = st.mean(g for _, g in data)\n"
                "# MAR: wiraswasta/buruh lebih sering missing, terkait variabel TERAMATI\n"
                "mar = [g for k, g in data if not (k == 'buruh' and random.random() < 0.5)]\n"
                "# MNAR: gaji tinggi lebih sering missing, terkait NILAI ITU SENDIRI\n"
                "mnar = [g for k, g in data if random.random() > (g/25)]\n"
                "print(f'kebenaran        : {true_mean:.2f}')\n"
                "print(f'MAR  teramati    : {st.mean(mar):.2f} (bias, tapi bisa dikoreksi via pekerjaan)')\n"
                "print(f'MNAR teramati    : {st.mean(mnar):.2f} (bias, tak terlacak dari variabel lain)')\n"
                "# koreksi MAR via stratifikasi pekerjaan\n"
                "import collections\n"
                "obs_kerja = collections.defaultdict(list)\n"
                "for k, g in data:\n"
                "    if not (k == 'buruh' and random.random() < 0.5):\n"
                "        obs_kerja[k].append(g)\n"
                "print(f'MAR terkoreksi   : {st.mean([st.mean(v) for v in obs_kerja.values()]):.2f} <- pulih!')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Missing <5%, MCAR \u2192 Complete-case OK",
            "kondisi": "Sedikit, acak, bukan variabel kunci.",
            "alasan": "Bias minimal; kesederhanaan menang.",
            "contoh": "2% tanggal lahir hilang karena typo acak.",
        },
        {
            "title": "MAR, missing substansial \u2192 MICE",
            "kondisi": "Pola terkait variabel teramati; variabel penting untuk analisis.",
            "alasan": "Gold standard: koreksi bias + SE jujur via Rubin's rules.",
            "contoh": "Pendapatan 30% hilang terkait pekerjaan tercatat.",
            "chart": {
                "var": "hd8MiceData",
                "data": [{"x": ["Imputasi mean", "MICE (m=20)"], "y": [11.2, 14.8], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "text": ["11.2", "14.8"], "textposition": "outside"}],
                "title": "SD Estimasi: Imputasi Tunggal vs MICE (data asli SD=15)",
                "layout": {"xaxis": {"title": "Metode"}, "yaxis": {"title": "SD"}, "showlegend": False},
                "cara": "Batang kuning = SD setelah imputasi mean; biru = SD gabungan MICE. Garis acuan: SD asli 15.",
                "interpretasi": "Imputasi mean menyusutkan SD ke 11,2 (palsu presisi); MICE mengembalikannya ke 14,8 \u2014 dekat kebenaran. Visual dari suku B Rubin's rules: ketidakpastian yang diakui, bukan disembunyikan.",
            },
        },
        {
            "title": "Diduga MNAR \u2192 Sensitivitas tipping-point",
            "kondisi": "Missing terkait nilai itu sendiri (self-reported, drop-out sakit).",
            "alasan": "Tidak teridentifikasi dari data; yang bisa dilakukan = uji ketahanan kesimpulan.",
            "contoh": "Skor nyeri 30% hilang; uji sampai seberapa buruk skenario yang membalik hasil.",
        },
        {
            "title": "Missing pada outcome longitudinal \u2192 Mixed model / IPW-GEE",
            "kondisi": "Drop-out seiring waktu (HD7).",
            "alasan": "Mixed model valid di bawah MAR; GEE butuh pembobotan IPW.",
            "contoh": "Pasien berhenti kontrol setelah memburuk.",
        },
    ],
    "aturan10": [
        "Diagnosis mekanisme dulu (MCAR/MAR/MNAR), terapi kemudian.",
        "Jangan imputasi mean tunggal. Jangan hapus diam-diam.",
        "MICE: sertakan outcome di model imputasi; m \u2248 % missing.",
        "MNAR \u2192 tipping-point sensitivity, laporkan jujur.",
    ],
    "case": {
        "title": "Survei Kepuasan RS: 92% Puas?",
        "body": [
            "<p>RS mengklaim \u201ckepuasan pasien 92%\u201d dari survei pulang: 5.000 dari 8.000 pasien mengisi (response 62,5%). Manajemen ingin memakai angka ini untuk akreditasi.</p>",
            "<p>Kamu cek: pengisi survei rata-rata rawat inap <strong>2 hari</strong>; yang tidak mengisi rata-rata <strong>6 hari</strong> (lebih kompleks/berat). Tidak ada data kepuasan dari yang tidak mengisi.</p>",
        ],
        "pertanyaan": "Apakah angka 92% bisa dipercaya? Rancang respons analis yang tepat.",
        "pembahasan": "Tidak. Ini MNAR yang klasik: kepuasan (nilai yang hilang) terkait alasan tidak mengisi (pengalaman lebih berat/kurang puas). 92% adalah estimasi pada subpopulasi yang puas-cenderung-mengisi. Respons: (1) jangan laporkan 92% sebagai kepuasan RS; (2) bandingkan karakteristik pengisi vs bukan (sudah terlihat beda); (3) lakukan tipping-point: seberapa tidak puaskah kelompok non-responden agar angka gabungan turun di bawah standar akreditasi? (4) perbaiki desain: survei singkat di tempat tidur sebelum pulang + insentif, bukan link pasca-pulang. Pelajaran: response rate 62% dengan MNAR lebih berbahaya dari response 40% yang MCAR.",
    },
    "quiz": [
        ("Skor depresi kosong justru pada yang paling depresi. Ini\u2026",
         ["MCAR", "MAR", "MNAR", "Bukan missing"],
         2,
         "Benar: hilangnya terkait nilai yang hilang itu sendiri = MNAR. Tidak bisa dipulihkan penuh dari variabel lain."),
        ("Imputasi mean tunggal berbahaya karena\u2026",
         ["Mean selalu salah", "Menyusutkan variansi \u2192 SE kekecilan \u2192 p-value terlalu optimis", "Terlalu lambat", "Tidak bisa untuk data besar"],
         1,
         "Benar: semua tambalan = angka sama \u2192 variasi palsu rendah. Lihat lab 1: SD 15 \u2192 11,2."),
        ("Suku B dalam Rubin's rules mengukur\u2026",
         ["Bias", "Ketidakpastian akibat missing itu sendiri (variansi antar imputasi)", "Jumlah imputasi", "Kecepatan komputer"],
         1,
         "Benar: B = seberapa beda hasil antar versi imputasi. Inilah kejujuran MICE yang disembunyikan imputasi tunggal."),
        ("Variabel apa yang WAJIB masuk model imputasi MICE?",
         ["Hanya variabel bebas", "Semua variabel analisis TERMASUK outcome", "Hanya yang lengkap", "Tidak ada aturan"],
         1,
         "Benar: mengeluarkan outcome melemahkan hubungan yang ingin diestimasi (bias menuju nol). Masukkan semua."),
        ("Aturan praktis jumlah imputasi m?",
         ["Selalu 5", "m \u2248 % missing", "m = ukuran sampel", "1 cukup"],
         1,
         "Benar: missing 30% \u2192 m\u224830. Dulu 5 karena komputer lambat; sekarang murah."),
        ("Untuk temuan kunci dengan dugaan MNAR, langkah tepat?",
         ["Abaikan saja", "Analisis sensitivitas tipping-point: seberapa ekstrem skenario yang membalik kesimpulan", "Tambah imputasi sampai hilang", "Hapus variabelnya"],
         1,
         "Benar: MNAR tak teridentifikasi \u2014 yang bisa dilakukan adalah menguji ketahanan kesimpulan terhadap skenario terburuk yang plausibel."),
    ],
    "rangkuman": [
        "<strong>MCAR</strong>: acak (hapus OK). <strong>MAR</strong>: terlacak via variabel teramati (MICE). <strong>MNAR</strong>: terkait nilai hilang (sensitivitas).",
        "Jangan imputasi mean tunggal; jangan complete-case diam-diam.",
        "<strong>MICE</strong>: m dataset \u2192 analisis \u2192 gabung via Rubin's rules (W + B).",
        "Sertakan <strong>outcome</strong> dalam model imputasi; m \u2248 % missing.",
        "Buat <strong>indikator missing</strong> \u2014 kadang hilangnya sendiri adalah sinyal.",
        "<strong>MNAR</strong> butuh tipping-point sensitivity, bukan MICE lebih banyak.",
        "Laporkan: % missing, asumsi mekanisme + alasan, metode, sensitivitas.",
        "Prasyarat untuk HD11 (EHR kotor) dan HD12 (model dengan missing).",
    ],
    "prev": ("hd7-longitudinal", "HD7"),
    "next": ("hd9-uji-diagnostik", "HD9"),
}

# ================================================================ HD9
HD9 = {
    "slug": "hd9-uji-diagnostik",
    "code": "HD9",
    "track": TRACK,
    "cover_title": "Sensitivitas, Spesifisitas, ROC:<br />Seberapa Bagus Tes Diagnostik",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Tes 99% Akurat yang Menyesatkan"),
        ("sens", "Sensitivitas &amp; Spesifisitas \u2014 Si Penangkap dan Si Penjaga"),
        ("ppv", "PPV/NPV: Base Rate Mengubah Segalanya"),
        ("roc", "ROC, AUC &amp; Likelihood Ratio"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: PPV vs Prevalensi"),
        ("lab2", "\U0001f52c Lab 2: Trade-off Sens-Spes &amp; Kurva ROC"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menghitung <strong>sensitivitas, spesifisitas, PPV, NPV, LR+, LR\u2212</strong> dari tabel 2\u00d72.",
        "Menjelaskan mengapa <strong>PPV anjlok saat prevalensi rendah</strong> walau tesnya \u201cakurat\u201d.",
        "Membaca <strong>kurva ROC/AUC</strong> dan memilih threshold sesuai konteks klinis.",
        "Memilih metrik yang tepat untuk 4 skenario (skrining vs konfirmasi).",
    ],
    "story_title": "Cerita Pembuka: Tes 99% Akurat yang Menyesatkan",
    "story": [
        "<p>Sebuah startup menjual tes kanker darah: \u201c<strong>99% akurat!</strong>\u201d (sensitivitas 99%, spesifisitas 99%). Seorang pejabat tertarik untuk skrining massal 1 juta penduduk, prevalensi kanker 0,1% (1.000 penderita). Hitungannya: dari 1.000 penderita, 990 terdeteksi. Dari 999.000 sehat, 1% = <strong>9.990 positif palsu</strong>. Setiap hasil positif, peluang benar-benar kanker hanya 990/(990+9.990) = <strong>9%</strong>.</p>",
        "<p>\u201c99% akurat\u201d menghasilkan 10 orang panik untuk setiap 1 yang benar-benar sakit. Inilah base rate fallacy \u2014 dan alasan kenapa evaluasi tes diagnostik adalah salah satu skill paling praktis di lesson ini.</p>",
    ],
    "konsep": [
        {
            "id": "sens",
            "title": "Sensitivitas &amp; Spesifisitas \u2014 Si Penangkap dan Si Penjaga",
            "definisi": "<strong>Sensitivitas</strong> = peluang tes positif bila benar-benar sakit (penangkap: jangan sampai lolos). <strong>Spesifisitas</strong> = peluang tes negatif bila benar-benar sehat (penjaga: jangan tuduh sembarangan). Keduanya <strong>sifat tes</strong>, tidak tergantung prevalensi.",
            "rumus": r"\text{Sens} = \frac{TP}{TP+FN} \quad ; \quad \text{Spes} = \frac{TN}{TN+FP}",
            "simbol": [
                (r"TP", "true positive: sakit dan tes positif"),
                (r"FN", "false negative: sakit tapi tes negatif (yang lolos!)"),
                (r"TN", "true negative: sehat dan tes negatif"),
                (r"FP", "false positive: sehat tapi tes positif (tuduhan palsu)"),
            ],
            "interpretasi": "Sens 99% = dari 100 orang sakit, 99 tertangkap, 1 lolos. Spes 99% = dari 100 sehat, 99 dibebaskan, 1 dituduh. Keduanya menjawab \u201cseberapa bagus tesnya\u201d \u2014 bukan \u201cseberapa percaya hasil tes saya\u201d (itu PPV/NPV).",
            "worked": (
                "\U0001f4d0 Contoh: rapid test DBD",
                "<p>200 pasien demam: 100 benar DBD (NS1+PCR), 100 bukan.<br />"
                "Rapid: TP=90, FN=10, TN=85, FP=15.<br />"
                "<strong>Sens</strong> = 90/100 = <strong>90%</strong> (10% kasus lolos).<br />"
                "<strong>Spes</strong> = 85/100 = <strong>85%</strong> (15% sehat dituduh).<br />"
                "Untuk DBD yang berbahaya bila terlambat, sens 90% masih menyisakan 10% lolos \u2014 perlu tes konfirmasi.</p>",
            ),
            "kepribadian": "Sensitivitas itu jaring ikan: makin rapat, makin sedikit ikan lolos \u2014 tapi makin banyak sampah ikut terjaring. Spesifisitas itu satpam: makin galak, makin sedikit penyusup lolos \u2014 tapi makin banyak tamu sah ditahan.",
            "kapan": "Skrining penyakit berbahaya/menular \u2192 utamakan sensitivitas (jangan sampai lolos). Tes konfirmasi sebelum terapi berisiko \u2192 utamakan spesifisitas (jangan tuduh sembarangan).",
            "chart": {
                "var": "hd9TradeData",
                "data": [{"x": ["Sens 99% / Spes 70%", "Sens 90% / Spes 90%", "Sens 70% / Spes 99%"], "y": [99, 90, 70], "type": "bar", "name": "Sensitivitas", "marker": {"color": "#2a7de1"}, "text": ["99%", "90%", "70%"], "textposition": "outside"},
                        {"x": ["Sens 99% / Spes 70%", "Sens 90% / Spes 90%", "Sens 70% / Spes 99%"], "y": [70, 90, 99], "type": "bar", "name": "Spesifisitas", "marker": {"color": "#e8a838"}, "text": ["70%", "90%", "99%"], "textposition": "outside"}],
                "title": "Trade-off Sensitivitas vs Spesifisitas (3 Threshold)",
                "layout": {"barmode": "group", "xaxis": {"title": "Pilihan threshold"}, "yaxis": {"title": "%", "range": [0, 115]}, "showlegend": True},
                "cara": "Tiga pilihan threshold. Biru = sensitivitas, kuning = spesifisitas. Perhatikan: saat satu naik, yang lain turun.",
                "interpretasi": "Tidak ada threshold yang memberi 99% keduanya \u2014 menaikkan sensitivitas (tangkap semua) selalu dibayar dengan spesifisitas (banyak tuduhan palsu). Memilih threshold = memilih <em>jenis kesalahan mana yang lebih bisa diterima</em> secara klinis.",
            },
        },
        {
            "id": "ppv",
            "title": "PPV/NPV: Base Rate Mengubah Segalanya",
            "definisi": "<strong>PPV</strong> = peluang benar-benar sakit bila tes positif. <strong>NPV</strong> = peluang benar-benar sehat bila tes negatif. Keduanya <strong>tergantung prevalensi</strong> \u2014 inilah yang dirasakan pasien.",
            "rumus": r"PPV = \frac{\text{Sens} \times P}{\text{Sens} \times P + (1-\text{Spes})(1-P)}",
            "simbol": [
                (r"P", "prevalensi (base rate) pada populasi yang dites"),
                (r"\text{Sens}, \text{Spes}", "sifat tes (tetap)"),
            ],
            "interpretasi": "Rumus Bayes ini menjelaskan cerita pembuka: Sens=Spes=99% tapi P=0,1% \u2192 PPV hanya 9%. Tes yang sama pada populasi berisiko tinggi (P=20%) \u2192 PPV 96%. <strong>Tes tidak berubah; audiensnya yang berubah.</strong>",
            "worked": (
                "\U0001f4d0 Contoh: PPV rapid DBD di dua setting",
                "<p>Sens 90%, Spes 85%.<br />"
                "<strong>Musim DBD</strong> (prevalensi 40%): PPV = (0,9\u00d70,4)/(0,9\u00d70,4 + 0,15\u00d70,6) = 0,36/0,45 = <strong>80%</strong>.<br />"
                "<strong>Di luar musim</strong> (prevalensi 5%): PPV = (0,9\u00d70,05)/(0,9\u00d70,05 + 0,15\u00d70,95) = 0,045/0,1875 = <strong>24%</strong>.<br />"
                "Tes yang sama, hasil positif yang sama \u2014 kepercayaan 80% vs 24%. Konteks adalah segalanya.</p>",
            ),
            "kepribadian": "PPV itu seperti nilai gosip: kebenarannya tergantung seberapa umum rumor itu beredar. Di musim DBD, \u201cpositif\u201d kemungkinan besar benar; di luar musim, kemungkinan besar false alarm.",
            "kapan": "Komunikasi hasil ke pasien/klinisi: selalu pakai PPV/NPV (bukan sens/spes). Desain program skrining: hitung PPV pada prevalensi target dulu.",
            "warning": "<strong>Mnemonic legendaris:</strong> <strong>SnNout</strong> \u2014 tes Sensitif tinggi, hasil Negatif menyingkirkan penyakit (rule OUT). <strong>SpPin</strong> \u2014 tes Spesifik tinggi, hasil Positif memastikan penyakit (rule IN).",
        },
        {
            "id": "roc",
            "title": "ROC, AUC &amp; Likelihood Ratio \u2014 Si Kurva Lengkap",
            "definisi": "<strong>Kurva ROC</strong>: plot sensitivitas vs (1\u2212spesifisitas) di semua threshold. <strong>AUC</strong>: luas di bawahnya (0,5 = tebak koin, 1,0 = sempurna). <strong>LR+</strong> = Sens/(1\u2212Spes): seberapa kali lipat hasil positif menaikkan odds penyakit.",
            "rumus": r"LR^+ = \frac{\text{Sens}}{1-\text{Spes}} \quad ; \quad \text{odds post} = LR \times \text{odds pre}",
            "simbol": [
                (r"LR^+", "likelihood ratio positif: kekuatan bukti dari hasil positif"),
                (r"\text{odds pre}", "odds penyakit sebelum tes (dari prevalensi/klinik)"),
                (r"\text{odds post}", "odds sesudah melihat hasil tes"),
            ],
            "interpretasi": "LR+ = 10: hasil positif membuat penyakit 10x lebih mungkin (odds). AUC 0,85 = jika ambil 1 sakit + 1 sehat acak, 85% skor si sakit lebih tinggi. AUC merangkum <em>diskriminasi di semua threshold</em>.",
            "worked": (
                "\U0001f4d0 Contoh: memilih threshold dari ROC",
                "<p>Skor AI kanker kulit: threshold A \u2192 Sens 95%, Spes 80% (LR+ = 4,75). Threshold B \u2192 Sens 80%, Spes 95% (LR+ = 16).<br />"
                "<strong>Skrining</strong> (jangan sampai lolos): pilih A.<br />"
                "<strong>Konfirmasi sebelum operasi</strong> (jangan tuduh sembarangan): pilih B.<br />"
                "AUC keduanya sama (0,93) \u2014 AUC tidak memilihkan threshold untukmu; konteks klinislah yang memilih.</p>",
            ),
            "kepribadian": "ROC itu peta seluruh medan perang threshold; AUC itu nilai rapor keseluruhan. Tapi rapor tidak memenangkan pertempuran \u2014 komandan (konteks klinis) yang memilih posisi (threshold).",
            "kapan": "Bandingkan model/skor diagnostik \u2192 AUC. Terapkan ke pasien individual \u2192 LR + odds pre (Fagan nomogram). Pilih threshold \u2192 timbang biaya FN vs FP.",
        },
    ],
    "myths": [
        ("Tes dengan akurasi 99% pasti bisa dipakai skrining massal",
         "Akurasi (TP+TN)/total didominasi mayoritas sehat saat prevalensi rendah \u2014 99% bisa berarti PPV 9% (cerita pembuka). Untuk skrining, hitung PPV pada prevalensi target dan biaya tindak lanjut false positive. Akurasi tanpa konteks prevalensi adalah angka hiburan."),
        ("AUC tinggi = tes siap dipakai klinis",
         "AUC mengukur diskriminasi, bukan utilitas klinis. Tes dengan AUC 0,9 bisa tidak berguna bila: threshold operasionalnya buruk, tidak ada terapi untuk yang terdeteksi, atau biaya false positive menghancurkan (lihat decision curve analysis \u2014 HD12). Validasi klinis > angka diskriminasi."),
        ("Sensitivitas dan spesifisitas berubah-ubah tergantung rumah sakit",
         "Keduanya sifat tes (dengan catatan spektrum pasien mirip). Yang berubah antar setting adalah PPV/NPV \u2014 karena prevalensi beda. Kalau sens/spes terlihat beda antar RS, curigai spectrum bias (populasi terlalu beda) atau verification bias."),
    ],
    "tips": [
        "Hafalkan <strong>SnNout/SpPin</strong> \u2014 dua kata ini menjawab 80% pertanyaan ujian dan visite tentang interpretasi tes.",
        "Setiap kali vendor mengklaim akurasi, minta <strong>tabel 2\u00d72 + prevalensi studi</strong>. Tanpa itu, klaim tidak bisa dinilai \u2014 dan penolakan memberi data adalah jawaban tersendiri.",
        "Untuk AI diagnostik: tanyakan <strong>threshold operasionalnya</strong>, bukan AUC-nya. Model dengan AUC 0,95 yang dioperasikan di threshold salah bisa lebih buruk dari model AUC 0,85 yang di-threshold benar.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: PPV Anjlok Saat Prevalensi Rendah",
            "intro": "Hitung PPV untuk Sens=Spes=99% pada berbagai prevalensi. Saksikan sendiri base rate fallacy: tes yang sama, kepercayaan beda langit-bumi.",
            "hint": "Cari prevalensi di mana PPV tepat 50% (hasil positif = lempar koin). Itulah titik di mana tes \u201c99% akurat\u201d menjadi tidak informatif untuk skrining.",
            "code": (
                "sens, spes = 0.99, 0.99\n"
                "print(f\"{'prevalensi':>10} {'PPV':>7} {'makna':>40}\")\n"
                "for p in [0.5, 0.2, 0.05, 0.01, 0.001]:\n"
                "    ppv = (sens*p)/(sens*p + (1-spes)*(1-p))\n"
                "    fp_per_tp = (1-spes)*(1-p)/(sens*p)\n"
                "    print(f'{p:>9.1%} {ppv:>6.1%}  {fp_per_tp:>5.1f} positif palsu per 1 benar')\n"
                "print()\n"
                "print('Tes TIDAK berubah. Yang berubah: seberapa langka penyakitnya.')\n"
                "print('Skrining massal penyakit langka -> banjir false positive.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Kurva ROC dari Skor (Manual)",
            "intro": "Diberikan skor 10 pasien (5 sakit, 5 sehat), hitung Sens/Spes di tiap threshold, lalu estimasi AUC dengan aturan trapesium. Rasakan trade-off-nya.",
            "hint": "Ubah skor pasien sehat #3 dari 0.75 menjadi 0.35 (kurangi overlap). Lihat AUC naik \u2014 itulah arti diskriminasi yang lebih baik.",
            "code": (
                "# (skor, sakit? 1/0)\n"
                "data = [(0.95,1),(0.85,1),(0.75,0),(0.70,1),(0.60,0),\n"
                "        (0.55,1),(0.45,0),(0.30,1),(0.20,0),(0.10,0)]\n"
                "n_sakit = sum(s for _, s in data); n_sehat = len(data)-n_sakit\n"
                "titik = []\n"
                "for thr in [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0]:\n"
                "    tp = sum(1 for skor, s in data if s == 1 and skor >= thr)\n"
                "    fp = sum(1 for skor, s in data if s == 0 and skor >= thr)\n"
                "    sens = tp/n_sakit; fpr = fp/n_sehat\n"
                "    titik.append((fpr, sens))\n"
                "    print(f'threshold {thr:.1f}: sens={sens:.0%}  1-spes={fpr:.0%}')\n"
                "# AUC via trapesium pada titik terurut\n"
                "titik.sort()\n"
                "auc = sum((x2-x1)*(y1+y2)/2 for (x1,y1),(x2,y2) in zip(titik, titik[1:]))\n"
                "print(f'\\nAUC = {auc:.2f}')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Skrining (jangan sampai lolos) \u2192 Sensitivitas tinggi",
            "kondisi": "Penyakit berbahaya/menular; lolos = bencana; false positive bisa ditindaklanjuti murah.",
            "alasan": "FN mahal (kematian/penularan), FP murah (tes konfirmasi).",
            "contoh": "Skrining TB pada kontak erat; skrining HIV pada donor darah.",
        },
        {
            "title": "Konfirmasi (jangan tuduh sembarangan) \u2192 Spesifisitas tinggi",
            "kondisi": "Hasil positif memicu terapi berisiko/mahal atau stigma.",
            "alasan": "FP mahal (operasi sia-sia, stigma HIV).",
            "contoh": "Western blot konfirmasi HIV; biopsi sebelum kemoterapi.",
            "chart": {
                "var": "hd9PpvData",
                "data": [{"x": ["0,1% (skrining massal)", "5% (klinik umum)", "20% (rujukan)", "40% (musim wabah)"], "y": [9, 50, 96, 99], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["9%", "50%", "96%", "99%"], "textposition": "outside"}],
                "title": "PPV Tes 99/99% pada Berbagai Prevalensi",
                "layout": {"xaxis": {"title": "Setting (prevalensi)"}, "yaxis": {"title": "PPV (%)", "range": [0, 115]}, "showlegend": False},
                "cara": "Empat setting dengan prevalensi naik. Tinggi batang = PPV: peluang benar-benar sakit bila tes positif.",
                "interpretasi": "Tes yang sama persis: di skrining massal hanya 9% hasil positif yang benar, di klinik rujukan 96%. Inilah kenapa tes bagus bisa menjadi program buruk \u2014 PPV adalah sifat <em>tes + populasi</em>, bukan tes saja.",
            },
        },
        {
            "title": "Bandingkan dua skor/AI \u2192 AUC + decision curve",
            "kondisi": "Memilih model diagnostik terbaik.",
            "alasan": "AUC untuk diskriminasi; decision curve untuk utilitas klinis (net benefit).",
            "contoh": "Skor AI vs skor klinis untuk prediksi sepsis.",
        },
        {
            "title": "Terapkan ke pasien individual \u2192 LR + pre-test odds",
            "kondisi": "Dokter menghadapi satu pasien dengan probabilitas awal tertentu.",
            "alasan": "LR menerjemahkan hasil tes menjadi update odds yang personal.",
            "contoh": "D-dimer positif pada pasien dengan skor Wells rendah vs tinggi.",
        },
    ],
    "aturan10": [
        "Sens/spes = sifat tes; PPV/NPV = sifat tes + populasi.",
        "SnNout (rule out), SpPin (rule in).",
        "Skrining \u2192 sens; konfirmasi \u2192 spes.",
        "Minta tabel 2\u00d72 + prevalensi sebelum percaya klaim.",
    ],
    "case": {
        "title": "AI Kanker Kulit: AUC 0,95, Siap Deploy?",
        "body": [
            "<p>Startup mengklaim AI deteksi melanoma: <strong>AUC 0,95</strong> pada 10.000 foto. Dinkes tertarik untuk skrining di puskesmas. Kamu diminta due diligence.</p>",
            "<p>Detail: dataset 50% melanoma (prevalensi artifisial!), foto dari klinik kulit tersier (kasus jelas), threshold operasional tidak dilaporkan, belum ada uji prospektif.</p>",
        ],
        "pertanyaan": "Sebutkan minimal 4 masalah dan syarat sebelum deploy.",
        "pembahasan": "(1) Prevalensi 50% artifisial \u2192 PPV studi tidak berlaku untuk puskesmas (prevalensi <1%); hitung ulang PPV. (2) Spectrum bias: foto kasus jelas dari tersier \u2192 performa anjlok pada lesi samar di puskesmas. (3) Tanpa threshold operasional, AUC 0,95 tidak memberi tahu sens/spes yang dipakai. (4) Tanpa uji prospektif: belum tahu alur kerja, waktu baca, dan efek pada rujukan. Syarat: validasi eksternal prospektif di puskesmas, laporkan sens/spes pada threshold yang dipilih + PPV/NPV lokal, decision curve analysis, dan monitoring drift pasca-deploy (HD12).",
    },
    "quiz": [
        ("Tes: Sens 99%, Spes 99%, prevalensi 0,1%. PPV sekitar\u2026",
         ["99%", "50%", "9%", "0,1%"],
         2,
         "Benar: (0,99\u00d70,001)/(0,99\u00d70,001+0,01\u00d70,999) \u2248 9%. \u201c99% akurat\u201d \u2192 9% kepercayaan. Base rate fallacy."),
        ("Untuk skrining donor darah (HIV), yang diutamakan?",
         ["Spesifisitas", "Sensitivitas", "PPV", "Akurasi"],
         1,
         "Benar (SnNout): jangan sampai ada yang lolos. False positive ditangani dengan tes konfirmasi."),
        ("Sebelum kemoterapi berdasarkan hasil tes, yang diutamakan?",
         ["Sensitivitas", "Spesifisitas", "NPV", "Kecepatan"],
         1,
         "Benar (SpPin): jangan tuduh sembarangan \u2014 terapi berisiko butuh kepastian."),
        ("LR+ = 10 artinya\u2026",
         ["Peluang sakit 10%", "Hasil positif membuat odds penyakit 10x lipat dari sebelum tes", "Tes 10x lebih mahal", "10% false positive"],
         1,
         "Benar: odds post = LR \u00d7 odds pre. LR menerjemahkan hasil tes ke update keyakinan personal."),
        ("AUC = 0,5 artinya model\u2026",
         ["Sempurna", "Setara tebak koin", "Buruk tapi berguna", "Tidak bisa dihitung"],
         1,
         "Benar: diagonal ROC = tidak ada diskriminasi. AUC 1,0 = sempurna."),
        ("Dua tes punya AUC sama (0,9). Untuk skrining dipilih yang\u2026",
         ["Sensitivitas lebih tinggi pada threshold operasional", "Spesifisitas lebih tinggi", "Lebih murah selalu", "AUC tidak relevan"],
         0,
         "Benar: AUC sama \u2260 threshold sama. Konteks memilih titik di kurva ROC \u2014 skrining butuh sens tinggi."),
    ],
    "rangkuman": [
        "<strong>Sens</strong> = TP/(TP+FN) \u2014 sifat tes. <strong>Spes</strong> = TN/(TN+FP) \u2014 sifat tes.",
        "<strong>PPV/NPV</strong> = yang dirasakan pasien; tergantung prevalensi (Bayes).",
        "<strong>SnNout</strong>: sens tinggi untuk rule out. <strong>SpPin</strong>: spes tinggi untuk rule in.",
        "<strong>ROC/AUC</strong>: diskriminasi di semua threshold; threshold dipilih oleh konteks.",
        "<strong>LR</strong>: update odds pre \u2192 post untuk pasien individual.",
        "Akurasi tanpa prevalensi = angka hiburan. Minta tabel 2\u00d72.",
        "Validasi AI diagnostik: prospektif, populasi target, threshold operasional, decision curve.",
        "Fondasi untuk HD12 (evaluasi model klinis) dan HD14 (NLP ekstraksi).",
    ],
    "prev": ("hd8-missing-data", "HD8"),
    "next": ("hd10-kausal-observasional", "HD10"),
}

# ================================================================ HD10
HD10 = {
    "slug": "hd10-kausal-observasional",
    "code": "HD10",
    "track": TRACK,
    "cover_title": "Target Trial &amp; Propensity:<br />Kausalitas dari Data Observasional",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Obat yang Terlihat Membunuh"),
        ("target", "Target Trial Emulation \u2014 Si Peniru RCT"),
        ("propensity", "Propensity Score &amp; IPTW"),
        ("dag", "DAG &amp; Immortal Time Bias"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Confounding by Indication"),
        ("lab2", "\U0001f52c Lab 2: Stratifikasi Propensity Sederhana"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>confounding by indication</strong> dan mengapa ia merajalela di data EHR/klaim.",
        "Merancang <strong>target trial emulation</strong>: eligibility, time zero, dan perlakuan yang jelas.",
        "Menjelaskan logika <strong>propensity score, matching, dan IPTW</strong> serta asumsi no-unmeasured-confounding.",
        "Mengenali <strong>immortal time bias</strong> dan collider bias dari DAG.",
    ],
    "story_title": "Cerita Pembuka: Obat yang Terlihat Membunuh",
    "story": [
        "<p>Analisis klaim BPJS: pasien yang menerima obat jantung X punya mortalitas <strong>lebih tinggi</strong> dari yang tidak. Kesimpulan naif: \u201cobat X membunuh!\u201d Lalu apoteker menjelaskan: obat X hanya diresepkan untuk pasien <strong>paling parah</strong> \u2014 yang memang lebih mungkin meninggal apapun obatnya.</p>",
        "<p>Inilah <strong>confounding by indication</strong>: alasan diberi obat (keparahan) juga menyebabkan outcome. Di data observasional, obat selalu terlihat \u201cbersalah\u201d karena ia diberikan kepada yang paling sakit. Lesson ini mengajarkan cara meniru RCT dari data observasional \u2014 sedekat mungkin dengan kebenaran tanpa mengacak pasien sungguhan.</p>",
    ],
    "konsep": [
        {
            "id": "target",
            "title": "Target Trial Emulation \u2014 Si Peniru RCT",
            "definisi": "<strong>Target trial emulation</strong>: sebelum menyentuh data, tulis protokol RCT hipotetis yang <em>akan</em> menjawab pertanyaanmu (eligibility, perlakuan, time zero, outcome, follow-up) \u2014 lalu tiru sedekat mungkin dengan data observasional.",
            "kepribadian": "Target trial itu sutradara yang memaksa analis observasional berakting seperti RCT: \u201cKalau ini RCT, siapa yang boleh ikut? Kapan jam mulai dihitung? Apa perlakuannya tepat?\u201d Tanpa naskah ini, analisis observasional improvisasi \u2014 dan improvisasi melahirkan bias.",
            "kapan": "Setiap pertanyaan kausal dari EHR/klaim: efek obat, efek kebijakan, efek program. Tulis protokol dulu, query kemudian.",
            "worked": (
                "\U0001f4d0 Contoh: efek statin pada stroke dari klaim",
                "<p><strong>Target trial:</strong> dewasa 40\u201375, tanpa stroke sebelumnya, LDL tinggi; perlakuan = mulai statin dalam 30 hari vs tidak; <strong>time zero</strong> = tanggal memenuhi eligibility; outcome = stroke 5 tahun.<br />"
                "<strong>Emulasi:</strong> tiru kriteria dari klaim; yang \u201cmulai statin\u201d = initiator; time zero SAMA untuk kedua kelompok (tanggal eligibility!).<br />"
                "Tanpa time zero yang sinkron, kelompok obat mendapat \u201cwaktu abadi\u201d gratis (lihat immortal time bias).</p>",
            ),
            "warning": "<strong>Tiga dosa emulation:</strong> (1) time zero beda antar kelompok; (2) eligibility memakai info masa depan (mis. \u201cpasien yang bertahan 1 tahun\u201d); (3) perlakuan didefinisikan dari perilaku pasca-time-zero (mis. \u201cminum obat minimal 6 bulan\u201d \u2192 yang mati cepat otomatis jadi kontrol!).",
        },
        {
            "id": "propensity",
            "title": "Propensity Score &amp; IPTW \u2014 Si Penyeimbang",
            "definisi": "<strong>Propensity score</strong> e(X) = peluang menerima perlakuan given karakteristik X. <strong>Matching</strong>: pasangkan yang diobati dengan yang tidak ber-skor mirip. <strong>IPTW</strong>: bobot tiap pasien dengan 1/e(X) (diobati) atau 1/(1\u2212e(X)) (tidak) \u2014 menciptakan populasi pseudo-acak.",
            "rumus": r"e(X) = P(T=1|X) \quad ; \quad w_i = \frac{T_i}{e(X_i)} + \frac{1-T_i}{1-e(X_i)}",
            "simbol": [
                (r"e(X)", "propensity score: peluang diobati given X"),
                (r"T_i", "perlakuan aktual pasien i (1/0)"),
                (r"w_i", "bobot IPTW: pasien langka di kelompoknya dibobot besar"),
            ],
            "interpretasi": "IPTW membuat kelompok seimbang: pasien yang \u201cseharusnya tidak diobati tapi diobati\u201d (e kecil, T=1) dapat bobot besar \u2014 ia paling informatif tentang efek kausal. Setelah dibobot, cek: apakah karakteristik seimbang (standardized mean difference < 0,1)?",
            "worked": (
                "\U0001f4d0 Contoh: IPTW untuk obat jantung X",
                "<p>Pasien parah: e(X)=0,9 diobati. Pasien ringan: e(X)=0,1.<br />"
                "Pasien ringan yang diobati: w = 1/0,1 = <strong>10</strong>. Pasien parah yang diobati: w = 1/0,9 = 1,11.<br />"
                "Setelah pembobotan, distribusi keparahan kedua kelompok setara \u2014 seolah diacak.<br />"
                "<strong>Asumsi kunci:</strong> tidak ada confounder tak terukur (unconfoundedness) + setiap pasien punya peluang >0 diobati/tidak (positivity). Keduanya <strong>tidak bisa diuji dari data</strong> \u2014 harus diargumenkan dari pengetahuan domain.</p>",
            ),
            "kepribadian": "Propensity itu mak comblang: memasangkan yang mirip agar perbandingan adil. IPTW itu timbangan keadilan: memberi suara lebih besar pada yang jarang. Keduanya jujur soal satu hal: mereka hanya menyeimbangkan yang <em>terukur</em>.",
            "kapan": "Efek perlakuan dari observasional dengan banyak confounder terukur. Selalu laporkan balance diagnostik + analisis sensitivitas unmeasured confounding (E-value).",
            "chart": {
                "var": "hd10PsData",
                "data": [{"x": [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], "y": [2, 5, 9, 14, 18, 22, 25, 30, 38, 45], "type": "bar", "name": "Diobati", "marker": {"color": "#e8a838"}},
                        {"x": [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], "y": [48, 42, 35, 28, 22, 16, 10, 6, 3, 1], "type": "bar", "name": "Tidak diobati", "marker": {"color": "#2a7de1"}}],
                "title": "Distribusi Propensity Score per Kelompok (sebelum balancing)",
                "layout": {"barmode": "stack", "xaxis": {"title": "Propensity score"}, "yaxis": {"title": "Jumlah pasien"}, "showlegend": True},
                "cara": "Sumbu X = skor peluang diobati. Kuning = yang benar-benar diobati, biru = tidak. Lihat di mana massa masing-masing menumpuk.",
                "interpretasi": "Yang diobati menumpuk di skor tinggi, yang tidak di skor rendah \u2014 bukti confounding by indication: dokter memilih yang parah. Area overlap (tengah) adalah \u201cwilayah perbandingan adil\u201d; ujung tanpa overlap = positivity dilanggar (tidak ada pembanding) \u2192 batasi/truncate. Setelah IPTW/matching, dua distribusi ini harus bertumpuk.",
            },
        },
        {
            "id": "dag",
            "title": "DAG &amp; Immortal Time Bias \u2014 Si Peta dan Si Hantu",
            "definisi": "<strong>DAG</strong>: graf panah sebab-akibat untuk memutuskan variabel apa dikontrol (tutup backdoor path, jangan sentuh mediator/collider). <strong>Immortal time bias</strong>: periode follow-up yang <em>wajib selamat</em> untuk bisa masuk kelompok perlakuan \u2014 membuat perlakuan terlihat protektif.",
            "kepribadian": "DAG itu peta sebelum berlayar: tanpanya kamu mengontrol apa saja yang terlihat \u2018berbeda\u2019 dan menabrak karang collider. Immortal time itu hantu: waktu yang tidak nyata tapi ikut dihitung \u2014 pasien \u201charus hidup\u201d 6 bulan untuk dikategorikan \u2018minum obat 6 bulan\u2019, lalu 6 bulan keabadian itu dikreditkan ke obat.",
            "kapan": "Selalu gambar DAG sebelum analisis kausal. Selalu curigai immortal time bila definisi perlakuan memakai durasi/kejadian pasca-time-zero.",
            "worked": (
                "\U0001f4d0 Contoh: \u201cOlahraga menurunkan kematian 50%\u201d yang palsu",
                "<p>Studi: kelompok \u201crajin olahraga\u201d = yang tercatat ikut program gym minimal 1 tahun. Untuk ikut 1 tahun, mereka <strong>harus hidup 1 tahun</strong> \u2014 yang mati di bulan 3 otomatis jadi \u201ctidak olahraga\u201d.<br />"
                "Hasil: olahraga terlihat protektif 50%, padahal sebagian adalah artefak keabadian.<br />"
                "<strong>Perbaikan:</strong> time zero sinkron + perlakuan = \u201cmulai program\u201d (bukan \u201cbertahan 1 tahun\u201d) + analisis time-varying.</p>",
            ),
            "callout": "<strong>Aturan DAG 10 detik:</strong> kontrol <strong>confounder</strong> (panah ke paparan DAN outcome) \u2713 &nbsp;|&nbsp; jangan kontrol <strong>mediator</strong> (di jalur kausal) \u2717 &nbsp;|&nbsp; jangan kontrol <strong>collider</strong> (panah dari dua arah masuk) \u2717 \u2014 mengontrol collider MEMBUKA bias baru!",
        },
    ],
    "myths": [
        ("Propensity score \u201cmemperbaiki\u201d confounding seperti randomisasi",
         "Tidak. Randomisasi menyeimbangkan yang tak terukur; propensity hanya yang terukur dan dimasukkan model. Asumsi unconfoundedness tidak bisa diuji \u2014 ia diargumenkan dari pengetahuan klinis + diuji ketahanannya via E-value/sensitivitas. Klaim \u201cseolah RCT\u201d tanpa caveat adalah overselling."),
        ("Semakin banyak variabel dikontrol, semakin kausal",
         "Mengontrol mediator menghilangkan efek yang ingin diukur; mengontrol collider MEMBUAT bias baru; mengontrol variabel yang dipengaruhi perlakuan merusak. DAG dulu, baru pilih \u2014 jumlah bukan kualitas."),
        ("Immortal time bias hanya masalah studi obat",
         "Ia muncul di mana saja definisi kelompok memakai masa depan: \u201cpekerja yang bertahan 5 tahun lebih sehat\u201d (healthy worker), \u201cpasien yang menyelesaikan program\u201d, \u201cRS yang terakreditasi\u201d. Polanya sama: syarat bertahan hidup dikreditkan sebagai efek."),
    ],
    "tips": [
        "Tulis <strong>protokol target trial satu halaman</strong> sebelum query apapun. Dokumen ini adalah perisai terbaikmu saat reviewer bertanya \u201ckenapa time zero di sini?\u201d",
        "Setelah IPTW/matching, selalu tampilkan <strong>tabel balance</strong> (SMD sebelum vs sesudah). Tanpa bukti seimbang, angka efek tidak ada artinya.",
        "Hitung <strong>E-value</strong> untuk temuan kunci: seberapa kuat confounder tak terukur harus ada untuk menjelaskan habis efekmu. E-value kecil = temuan rapuh, katakan dengan jujur.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Confounding by Indication \u2014 Obat Terlihat Membunuh",
            "intro": "Simulasikan: obat TIDAK berpengaruh, tapi hanya diresepkan ke yang parah. Hitung mortalitas mentah per kelompok, lalu stratifikasi keparahan. Saksikan vonis palsu runtuh.",
            "hint": "Ubah probabilitas resep pada yang parah dari 0.8 ke 0.5. Perhatikan bias mentah menyusut \u2014 confounding by indication melemah saat resep kurang selektif.",
            "code": (
                "import random\n"
                "random.seed(13)\n"
                "n = 10000\n"
                "hasil = {'obat': [0, 0], 'tanpa': [0, 0]}  # [meninggal, total]\n"
                "strata = {}\n"
                "for _ in range(n):\n"
                "    parah = random.random() < 0.3\n"
                "    # dokter meresepkan ke yang parah (confounding by indication)\n"
                "    obat = random.random() < (0.8 if parah else 0.2)\n"
                "    r_mati = 0.40 if parah else 0.05   # obat: NOL efek\n"
                "    mati = random.random() < r_mati\n"
                "    k = 'obat' if obat else 'tanpa'\n"
                "    hasil[k][0] += mati; hasil[k][1] += 1\n"
                "    s = (obat, parah)\n"
                "    strata.setdefault(s, [0, 0])\n"
                "    strata[s][0] += mati; strata[s][1] += 1\n"
                "m_obat = hasil['obat'][0]/hasil['obat'][1]\n"
                "m_tanpa = hasil['tanpa'][0]/hasil['tanpa'][1]\n"
                "print(f'mortalitas mentah: obat {m_obat:.1%} vs tanpa {m_tanpa:.1%}')\n"
                "print('-> obat TERLIHAT membunuh! (padahal efek NOL)')\n"
                "print('Setelah stratifikasi keparahan:')\n"
                "for parah in [False, True]:\n"
                "    a = strata[(True, parah)]; b = strata[(False, parah)]\n"
                "    print(f\"  parah={parah}: obat {a[0]/a[1]:.1%} vs tanpa {b[0]/b[1]:.1%} -> SAMA\")\n"
                "print()\n"
                "print('Pelajaran: di data observasional, obat selalu diberikan ke yang sakit.')\n"
                "print('Tanpa adjustment, semua obat terlihat buruk.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Stratifikasi Propensity (5 Strata)",
            "intro": "Bagi pasien ke 5 strata propensity score, hitung efek per strata, lalu rata-ratakan berbobot. Ini versi sederhana dari IPTW/matching.",
            "hint": "Bandingkan efek mentah vs efek terstratifikasi. Selisihnya = besar confounding yang berhasil dikoreksi. Coba tambah confounder tak terukur (acak) \u2014 stratifikasi tak bisa mengoreksinya.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(17)\n"
                "n = 8000\n"
                "data = []\n"
                "for _ in range(n):\n"
                "    usia = random.gauss(60, 12)\n"
                "    parah = random.random() < 1/(1+2.718**(-(usia-60)/10))  # usia->parah\n"
                "    ps = 0.1 + 0.7*(1 if parah else 0) + (usia-60)/200      # propensity\n"
                "    ps = min(0.95, max(0.05, ps))\n"
                "    obat = random.random() < ps\n"
                "    # outcome: obat menurunkan risiko 5 poin (efek sebenarnya)\n"
                "    r = 0.30 + (0.25 if parah else 0) - (0.05 if obat else 0)\n"
                "    mati = random.random() < r\n"
                "    data.append((ps, obat, mati))\n"
                "data.sort()\n"
                "m = len(data)//5\n"
                "efek_strata, bobot = [], []\n"
                "for i in range(5):\n"
                "    s = data[i*m:(i+1)*m]\n"
                "    o = [x for x in s if x[1]]; t = [x for x in s if not x[1]]\n"
                "    e = st.mean(x[2] for x in o) - st.mean(x[2] for x in t)\n"
                "    efek_strata.append(e); bobot.append(len(s))\n"
                "efek_adj = sum(e*w for e, w in zip(efek_strata, bobot))/sum(bobot)\n"
                "o_all = [x for x in data if x[1]]; t_all = [x for x in data if not x[1]]\n"
                "efek_mentah = st.mean(x[2] for x in o_all) - st.mean(x[2] for x in t_all)\n"
                "print(f'efek sebenarnya : -0.050')\n"
                "print(f'efek mentah      : {efek_mentah:+.3f} (bias: obat diberikan ke yg parah)')\n"
                "print(f'efek terstratifikasi: {efek_adj:+.3f} <- jauh lebih dekat kebenaran')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Banyak confounder terukur, overlap baik \u2192 IPTW",
            "kondisi": "Distribusi propensity kedua kelompok bertumpuk; ingin estimasi populasi.",
            "alasan": "Memakai semua data; balance bisa dicek via SMD.",
            "contoh": "Efek statin dari klaim dengan puluhan kovariat.",
        },
        {
            "title": "Overlap buruk di ujung \u2192 Matching + trim",
            "kondisi": "Ada wilayah propensity tanpa pembanding (positivity lemah).",
            "alasan": "Fokus pada wilayah yang benar-benar comparable; jujur soal generalisasi.",
            "contoh": "Obat baru yang hampir selalu untuk kasus berat.",
        },
        {
            "title": "Definisi perlakuan pakai masa depan \u2192 Perbaiki desain dulu",
            "kondisi": "Dugaan immortal time bias.",
            "alasan": "Tidak ada metode statistik yang memperbaiki time zero yang salah.",
            "contoh": "Ulangi dengan time zero sinkron + perlakuan time-varying.",
        },
        {
            "title": "Butuh argumen kausal ke pembuat kebijakan \u2192 Triangulasi",
            "kondisi": "Satu metode tak cukup meyakinkan.",
            "alasan": "IPTW + matching + outcome negatif kontrol + E-value: bila semua searah, argumen kuat.",
            "contoh": "Evaluasi program JKN terhadap mortalitas.",
        },
    ],
    "aturan10": [
        "Tulis protokol target trial dulu, query kemudian.",
        "Time zero harus sama untuk semua kelompok.",
        "Cek balance (SMD < 0,1) setelah IPTW/matching.",
        "Laporkan E-value: seberapa rapuh temuanmu.",
    ],
    "case": {
        "title": "\u201cVaksin Meningkatkan Risiko Autoimun\u201d?",
        "body": [
            "<p>Analisis EHR 500.000 orang: yang divaksinasi punya diagnosis autoimun <strong>lebih tinggi</strong> (HR=1,3) dalam 1 tahun. Grup antivaksin menyebarkan: \u201cbukti vaksin berbahaya!\u201d Kamu diminta verifikasi cepat.</p>",
            "<p>Cek desain: time zero = tanggal vaksinasi untuk kelompok vaksin, tapi <strong>tanggal awal studi</strong> untuk kontrol. Kelompok vaksin rata-rata 15 tahun lebih tua (program prioritas lansia). Tidak ada adjustment.</p>",
        ],
        "pertanyaan": "Identifikasi minimal 3 cacat fatal dan desain ulang yang benar.",
        "pembahasan": "(1) Time zero tidak sinkron: kelompok vaksin memulai \u201cjam\u201d lebih lambat \u2192 immortal time + seleksi. (2) Confounding by indication: vaksin diprioritaskan untuk lansia/komorbid \u2014 yang memang berisiko autoimun lebih tinggi. (3) Tanpa adjustment apapun: HR mentah tidak bermakna. Desain ulang: target trial emulation \u2014 eligibility sama (mis. usia 18+, tanpa autoimun sebelumnya), time zero = tanggal eligibility untuk SEMUA, perlakuan = vaksinasi dalam 90 hari (time-varying), lalu Cox + IPTW dengan usia/komorbid, plus kontrol negatif (outcome yang tak mungkin dipengaruhi vaksin). Prediksi: HR terkoreksi mendekati 1. Pelajaran: HR mentah dari EHR adalah bahan hoaks yang sempurna.",
    },
    "quiz": [
        ("Confounding by indication artinya\u2026",
         ["Obat menyebabkan indikasinya", "Alasan pemberian obat (keparahan) juga memengaruhi outcome \u2014 membuat obat terlihat buruk", "Indikasi obat selalu salah", "Pasien menolak obat"],
         1,
         "Benar: dokter memberi obat ke yang paling sakit. Tanpa adjustment, semua obat di data observasional terlihat membunuh."),
        ("Langkah PERTAMA yang benar untuk pertanyaan kausal dari EHR?",
         ["Langsung regresi", "Tulis protokol target trial (eligibility, time zero, perlakuan)", "Hapus outlier", "Pilih model ML"],
         1,
         "Benar: naskah dulu, query kemudian. Sebagian besar bias observasional lahir dari desain yang improvisasi."),
        ("IPTW memberi bobot besar kepada\u2026",
         ["Pasien termahal", "Pasien yang \u201cjarang\u201d di kelompoknya (mis. ringan tapi diobati) \u2014 paling informatif", "Pasien terbaru", "Pasien yang sembuh"],
         1,
         "Benar: w=1/e(X). Mereka menciptakan keseimbangan semu; tapi hanya untuk confounder terukur."),
        ("Asumsi propensity yang TIDAK bisa diuji dari data?",
         ["Positivity", "Tidak ada confounder tak terukur (unconfoundedness)", "Ukuran sampel", "Distribusi normal"],
         1,
         "Benar: unconfoundedness adalah asumsi iman \u2014 diargumenkan dari pengetahuan domain + diuji via sensitivitas (E-value)."),
        ("Immortal time bias terjadi ketika\u2026",
         ["Pasien abadi", "Definisi kelompok perlakuan mensyaratkan selamat selama periode tertentu \u2014 waktu \u201cabadi\u201d itu dikreditkan ke perlakuan", "Follow-up terlalu lama", "Obat kedaluwarsa"],
         1,
         "Benar: \u201cminum obat 6 bulan\u201d mensyaratkan hidup 6 bulan. Perbaiki: time zero sinkron + perlakuan time-varying."),
        ("Mengontrol collider dalam DAG akan\u2026",
         ["Mengurangi bias", "MEMBUKA bias baru (jangan lakukan!)", "Tidak ada efek", "Menambah power"],
         1,
         "Benar: collider = dua panah masuk. Dikontrol \u2192 membuka jalur palsu. Inilah kenapa \u201ckontrol semua\u201d berbahaya."),
    ],
    "rangkuman": [
        "<strong>Confounding by indication</strong>: obat diberikan ke yang paling sakit \u2014 vonis palsu default data observasional.",
        "<strong>Target trial emulation</strong>: tulis protokol RCT hipotetis dulu (eligibility, time zero sinkron, perlakuan jelas).",
        "<strong>Propensity/matching/IPTW</strong>: seimbangkan yang terukur; cek SMD < 0,1.",
        "Asumsi tak teruji: <strong>unconfoundedness + positivity</strong> \u2014 argumenkan, lalu E-value.",
        "<strong>DAG</strong>: kontrol confounder; JANGAN sentuh mediator (efek total) dan collider.",
        "<strong>Immortal time bias</strong>: definisi kelompok dari masa depan = waktu hantu.",
        "Triangulasi (multi-metode + kontrol negatif) untuk argumen kebijakan.",
        "Fondasi untuk HD12 (evaluasi model) dan membaca literatur observasional apa pun.",
    ],
    "prev": ("hd9-uji-diagnostik", "HD9"),
    "next": ("hd11-wrangling-ehr", "HD11"),
}

LESSONS = [HD6, HD7, HD8, HD9, HD10]
for L in LESSONS:
    qa_scan(L)
