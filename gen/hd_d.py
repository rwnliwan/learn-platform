#!/usr/bin/env python3
"""Health Data Scientist lessons HD16-HD20."""
from render import qa_scan

TRACK = "Health Data Scientist"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ HD16
HD16 = {
    "slug": "hd16-surveilans-wabah",
    "code": "HD16",
    "track": TRACK,
    "cover_title": "SIR &amp; Deteksi Wabah:<br />Matematika Penyebaran Penyakit",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 3 Kasus yang Menjadi 3.000"),
        ("surveilans", "Surveilans &amp; Deteksi Sinyal"),
        ("sir", "Model SIR \u2014 Tiga Kompartemen"),
        ("r0", "R0, Rt &amp; Forecasting"),
        ("spasial", "Analisis Spasial Wabah"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi SIR &amp; Dampak Intervensi"),
        ("lab2", "\U0001f52c Lab 2: Deteksi Alert Kenaikan Kasus"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan sistem <strong>surveilans</strong> (indikator vs event-based) dan logika <strong>deteksi alert</strong>.",
        "Menjalankan dan menafsirkan <strong>model SIR</strong>: S, I, R, beta, gamma, dan efek intervensi.",
        "Menghitung dan menafsirkan <strong>R0 dan Rt</strong> serta ambang herd immunity.",
        "Membaca <strong>peta/klaster spasial</strong> kasus dan menghindari jebakan ecological fallacy.",
    ],
    "story_title": "Cerita Pembuka: 3 Kasus yang Menjadi 3.000",
    "story": [
        "<p>Minggu 1: 3 kasus demam berdarah di sebuah kecamatan. Petugas mencatat di buku \u2014 tidak ada alert. Minggu 4: 80 kasus. Minggu 8: 3.000 kasus, RS penuh, fogging darurat yang terlambat. Investigasi: pola kenaikan <strong>sudah terlihat di minggu 2</strong> bila ada yang menghitung.</p>",
        "<p>Surveilans adalah sistem saraf kesehatan masyarakat: ia harus merasakan demam sebelum tubuh terbakar. Lesson ini tentang cara mendengar sinyal itu \u2014 dan matematika sederhana yang memprediksi ke mana wabah bergerak.</p>",
    ],
    "konsep": [
        {
            "id": "surveilans",
            "title": "Surveilans &amp; Deteksi Sinyal \u2014 Si Sistem Saraf",
            "definisi": "<strong>Surveilans indikator</strong>: laporan rutin terstruktur (EWARS/SKDR mingguan). <strong>Event-based</strong>: sinyal tak terstruktur (berita, media sosial, laporan warga). <strong>Deteksi alert</strong>: aturan statistik saat kenaikan dianggap sinyal, bukan noise.",
            "kepribadian": "Surveilans indikator itu cek tensi rutin \u2014 terjadwal, sebanding. Event-based itu tetangga yang lapor \u201cada yang batuk-batuk sekampung\u201d \u2014 cepat tapi berisik. Sistem yang baik punya keduanya: telinga resmi dan telinga jalanan.",
            "kapan": "Monitoring rutin penyakit prioritas (DBD, campak, diare) \u2192 indikator. Ancaman baru/tak terduga \u2192 event-based. Keduanya butuh ambang alert yang dikalibrasi.",
            "worked": (
                "\U0001f4d0 Contoh: aturan alert DBD kabupaten",
                "<p>Data historis 3 tahun: rata-rata kasus mingguan per kecamatan = 5, SD = 3.<br />"
                "<strong>Aturan:</strong> alert bila kasus minggu ini > rata-rata + 2\u00d7SD (= 11) selama 2 minggu berturut.<br />"
                "Minggu 12: 13 kasus. Minggu 13: 15 kasus \u2192 <strong>ALERT</strong> \u2192 investigasi + fogging fokus.<br />"
                "Trade-off: ambang rendah = cepat tapi banyak false alarm (kelelahan petugas); ambang tinggi = tenang tapi terlambat.</p>",
            ),
            "chart": {
                "var": "hd16AlertData",
                "data": [{"x": list(range(1, 21)), "y": [4, 5, 3, 6, 5, 4, 7, 5, 6, 4, 5, 13, 15, 22, 35, 48, 60, 55, 40, 25], "type": "scatter", "mode": "lines+markers", "name": "Kasus mingguan", "line": {"color": "#2a7de1"}},
                        {"x": [1, 20], "y": [11, 11], "type": "scatter", "mode": "lines", "name": "Ambang alert", "line": {"dash": "dash", "color": "#e8a838"}}],
                "title": "Kasus DBD Mingguan \u2014 Alert di Minggu 12\u201313",
                "layout": {"xaxis": {"title": "Minggu"}, "yaxis": {"title": "Kasus"}, "showlegend": True},
                "cara": "Garis biru = kasus per minggu; garis kuning putus-putus = ambang alert (11). Cari kapan biru menembus kuning.",
                "interpretasi": "Minggu 1\u201311: fluktuasi normal di bawah ambang. Minggu 12\u201313: dua minggu berturut di atas ambang \u2192 alert valid, bukan noise sesaat. Respons di minggu 13 (bukan minggu 16 saat RS penuh) adalah seluruh nilai surveilans: <strong>deteksi dini membeli waktu</strong>.",
            },
        },
        {
            "id": "sir",
            "title": "Model SIR \u2014 Tiga Kompartemen",
            "definisi": "<strong>SIR</strong>: populasi dibagi <strong>S</strong> (susceptible/rentan), <strong>I</strong> (infectious/menular), <strong>R</strong> (recovered/kebal). Infeksi mengalir S\u2192I\u2192R dengan laju beta (penularan) dan gamma (kesembuhan).",
            "rumus": r"\frac{dS}{dt} = -\beta \frac{SI}{N}, \quad \frac{dI}{dt} = \beta \frac{SI}{N} - \gamma I, \quad \frac{dR}{dt} = \gamma I",
            "simbol": [
                (r"S, I, R", "jumlah rentan, menular, sembuh/kebal pada waktu t"),
                (r"\beta", "laju penularan (kontak \u00d7 peluang infeksi per kontak)"),
                (r"\gamma", "laju kesembuhan = 1/periode menular"),
                (r"N", "total populasi (S+I+R)"),
            ],
            "interpretasi": "Epidemi tumbuh bila infeksi baru (\u03b2SI/N) melebihi kesembuhan (\u03b3I). Intervensi bekerja via tiga tuas: turunkan \u03b2 (masker, isolasi, fogging), naikkan \u03b3 (obati cepat), kecilkan S (vaksinasi \u2192 langsung ke R).",
            "worked": (
                "\U0001f4d0 Contoh: membaca kurva SIR",
                "<p>Populasi 10.000, I awal 10, \u03b2=0,3, \u03b3=0,1.<br />"
                "Kurva I naik eksponensial dulu (banyak S), mencapai puncak saat S menipis, lalu turun \u2014 membentuk <strong>lengkung epidemik</strong> klasik.<br />"
                "Intervensi: \u03b2 turun 50% (pembatasan) \u2192 puncak <strong>lebih rendah dan lebih lambat</strong> (flatten the curve) \u2014 memberi RS waktu. Total terinfeksi akhir juga turun.</p>",
            ),
            "kepribadian": "SIR itu seperti model kebakaran hutan: S = pohon kering, I = api, R = abu. Api menyebar sebanding dengan (api \u00d7 pohon). Memadamkan = kurangi pohon (sekat bakar/vaksin), siram api (obati), atau hambat angin (batasi kontak).",
            "kapan": "Memahami dinamika wabah, menguji skenario intervensi, komunikasi ke publik/pembuat kebijakan. Bukan untuk prediksi presisi jangka panjang \u2014 perilakunya terlalu sederhana untuk itu.",
        },
        {
            "id": "r0",
            "title": "R0, Rt &amp; Forecasting \u2014 Si Angka Terkenal",
            "definisi": "<strong>R0</strong> = rata-rata kasus sekunder dari 1 kasus pada populasi rentan penuh. <strong>Rt</strong> = versi saat-t (dengan intervensi/kekebalan). <strong>Herd immunity threshold</strong> = 1 \u2212 1/R0.",
            "rumus": r"R_0 = \frac{\beta}{\gamma} \quad ; \quad \text{Herd immunity} = 1 - \frac{1}{R_0}",
            "simbol": [
                (r"R_0", "reproduction number dasar (sifat patogen + kontak normal)"),
                (r"R_t", "reproduction number efektif saat t (bisa < R0 karena intervensi)"),
            ],
            "interpretasi": "Rt > 1 = wabah tumbuh; Rt < 1 = padam. R0=3 \u2192 butuh 67% kebal untuk herd immunity. <strong>R0 bukan vonis mati</strong> \u2014 ia bisa diturunkan menjadi Rt<1 via intervensi.",
            "worked": (
                "\U0001f4d0 Contoh: R0 campak vs influenza",
                "<p>Campak R0 \u2248 12\u201318 \u2192 herd immunity 92\u201394% \u2014 itulah kenapa cakupan imunisasi harus >95%.<br />"
                "Influenza R0 \u2248 1,3 \u2192 threshold ~23%, tapi mutasi membuat kekebalan cepat usang.<br />"
                "DBD: tidak ada R0 tunggal sederhana (vektor nyamuk!) \u2014 butuh model vektor. Pelajaran: angka tanpa konteks biologinya menyesatkan.</p>",
            ),
            "kepribadian": "R0 itu selebritas epidemiologi: terkenal, sering dikutip, sering disalahpahami. Ia bukan kecepatan, bukan keganasan \u2014 melainkan <em>potensi beranak-pinak</em> dalam kondisi ideal. Rt adalah R0 yang sudah bekerja dan membayar pajak intervensi.",
            "kapan": "Komunikasi risiko, target cakupan vaksinasi, evaluasi apakah intervensi cukup (Rt<1?).",
            "warning": "<strong>Forecasting wabah:</strong> model mekanistik (SIR) bagus untuk skenario (\u201cbagaimana jika\u201d), model statistik/time-series bagus untuk jangka pendek (1\u20134 minggu). Keduanya runtuh bila perilaku berubah tiba-tiba. Selalu sajikan <strong>rentang skenario</strong>, bukan satu angka pasti \u2014 peramal wabah yang pede adalah peramal yang salah.",
        },
        {
            "id": "spasial",
            "title": "Analisis Spasial Wabah \u2014 Si Tukang Peta",
            "definisi": "Kasus dipetakan per wilayah/waktu untuk menemukan <strong>klaster</strong> (hotspot) via statistik spasial (scan statistic, Moran's I). Tujuannya: intervensi fokus, bukan semprot merata.",
            "kepribadian": "Peta wabah itu seperti foto termal: menunjukkan di mana apinya, bukan sekadar \u201cada api di kota ini\u201d. Fogging merata saat api hanya di 3 RW = bakar uang + racun sia-sia.",
            "kapan": "Targeting intervensi vektor (DBD), alokasi tim investigasi, evaluasi cakupan per wilayah.",
            "worked": (
                "\U0001f4d0 Contoh: hotspot DBD kota",
                "<p>Scan statistic menemukan klaster 5 kelurahan dengan kasus 3x ekspektasi (p<0,01).<br />"
                "Cek: bukan artefak pelaporan (RS di sana tidak lebih rajin lapor \u2014 diverifikasi).<br />"
                "Aksi: fogging + PSN fokus 5 kelurahan; 20 kelurahan lain cukup monitoring.<br />"
                "<strong>Waspada ecological fallacy:</strong> kelurahan \u201ckotor\u201d tinggi kasus \u2260 setiap rumah kotor berisiko \u2014 jangan stigmatisasi warga.</p>",
            ),
        },
    ],
    "myths": [
        ("R0 tinggi = penyakit lebih mematikan",
         "R0 mengukur penularan, bukan keparahan. Campak R0 15 tapi jarang mematikan dengan gizi baik; Ebola R0 ~2 tapi sangat mematikan. Jangan campuradukkan \u201ccepat menyebar\u201d dengan \u201cmematikan\u201d \u2014 kebijakan untuk keduanya berbeda."),
        ("Model SIR bisa memprediksi puncak wabah dengan tepat",
         "SIR adalah model <em>skenario</em>, bukan kristal. Parameter (\u03b2) berubah saat perilaku berubah; data kasus underreported. Gunakan untuk \u201cjika intervensi X, puncak bergeser seberapa\u201d \u2014 bukan \u201cpuncak tanggal 17 Agustus\u201d."),
        ("Kasus turun = intervensi berhasil (atau sebaliknya)",
         "Kurva epidemik turun sendiri saat S habis ( susceptible depletion) \u2014 bahkan tanpa intervensi. Klaim keberhasilan butuh pembanding: Rt sebelum vs sesudah, atau wilayah kontrol. Post hoc ergo propter hoc adalah fallacy favorit pasca-wabah."),
    ],
    "tips": [
        "Bedakan <strong>tanggal onset vs tanggal lapor</strong>. Kurva berdasarkan tanggal lapor bergeser 1\u20132 minggu dari realita \u2014 keputusan dari kurva lapor = keputusan dari masa lalu.",
        "Selalu tanyakan <strong>\u201cberapa yang tidak tercatat?\u201d</strong> Kasus ringan tidak berobat = underreporting. Estimasi dengan survei serologi atau capture-recapture bila penting.",
        "Untuk komunikasi publik: tunjukkan <strong>Rt dan tren</strong>, bukan R0 dan prediksi titik. \u201cRt 0,8 dan turun\u201d menenangkan tanpa janji palsu.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Simulasi SIR &amp; Efek Intervensi",
            "intro": "Simulasikan SIR diskret 200 hari. Bandingkan tanpa intervensi vs \u03b2 turun 40% di hari 30. Lihat puncak bergeser dan total kasus turun.",
            "hint": "Coba intervensi lebih awal (hari 15) vs terlambat (hari 60). Selisih total kasusnya = harga keterlambatan. Inilah nilai surveilans dini secara kuantitatif.",
            "code": (
                "N, I0 = 10000, 10\n"
                "beta, gamma = 0.3, 0.1\n"
                "def simulasi(hari_intervensi=None, potongan=0.4, hari=200):\n"
                "    S, I, R = N-I0, I0, 0\n"
                "    puncak, t_puncak, total = 0, 0, 0\n"
                "    for t in range(hari):\n"
                "        b = beta*(1-potongan) if (hari_intervensi and t >= hari_intervensi) else beta\n"
                "        baru = b*S*I/N\n"
                "        sembuh = gamma*I\n"
                "        S -= baru; I += baru-sembuh; R += sembuh\n"
                "        if I > puncak: puncak, t_puncak = I, t\n"
                "    return puncak, t_puncak, R\n"
                "p0, t0, tot0 = simulasi()\n"
                "p1, t1, tot1 = simulasi(30)\n"
                "p2, t2, tot2 = simulasi(60)\n"
                "print(f'tanpa intervensi : puncak {p0:.0f} (hari {t0}), total {tot0:.0f}')\n"
                "print(f'intervensi hr-30 : puncak {p1:.0f} (hari {t1}), total {tot1:.0f}')\n"
                "print(f'intervensi hr-60 : puncak {p2:.0f} (hari {t2}), total {tot2:.0f}')\n"
                "print()\n"
                "print(f'Keterlambatan 30 hari menambah {tot2-tot1:.0f} kasus.')\n"
                "print('Flatten the curve = beli waktu untuk RS. Waktu = nyawa.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Aturan Alert \u2014 Sensitivitas vs False Alarm",
            "intro": "Bangkitkan 52 minggu kasus (baseline + satu wabah). Terapkan aturan alert (mean+2SD, 2 minggu berturut) dan ukur: deteksi minggu keberapa? berapa false alarm?",
            "hint": "Ubah ambang ke mean+1SD. Deteksi lebih cepat tapi false alarm naik \u2014 itulah trade-off yang harus dinegosiasikan dengan kapasitas petugas.",
            "code": (
                "import random\n"
                "random.seed(12)\n"
                "baseline = [random.gauss(5, 2) for _ in range(52)]\n"
                "# wabah minggu 30-40\n"
                "for t in range(30, 41):\n"
                "    baseline[t] += (t-29)*4\n"
                "kasus = [max(0, round(x)) for x in baseline]\n"
                "hist = kasus[:26]\n"
                "mean = sum(hist)/len(hist)\n"
                "sd = (sum((x-mean)**2 for x in hist)/len(hist))**0.5\n"
                "ambang = mean + 2*sd\n"
                "print(f'baseline: mean={mean:.1f}, SD={sd:.1f}, ambang={ambang:.1f}')\n"
                "alert, false_alarm, deteksi = 0, 0, None\n"
                "for t in range(26, 52):\n"
                "    if kasus[t] > ambang and kasus[t+1] > ambang if t+1 < 52 else False:\n"
                "        alert += 1\n"
                "        if t < 30:\n"
                "            false_alarm += 1\n"
                "        elif deteksi is None:\n"
                "            deteksi = t\n"
                "print(f'wabah mulai minggu 30; terdeteksi minggu {deteksi}')\n"
                "print(f'false alarm sebelum wabah: {false_alarm}')\n"
                "print()\n"
                "print('Surveilans = seni menyeimbangkan cepat vs akurat.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Monitoring rutin penyakit prioritas \u2192 Surveilans indikator + alert",
            "kondisi": "Penyakit known, butuh tren konsisten.",
            "alasan": "Terstruktur, sebanding antar waktu/wilayah.",
            "contoh": "EWARS mingguan untuk DBD, campak, diare.",
        },
        {
            "title": "Ancaman baru/tak terduga \u2192 Event-based surveillance",
            "kondisi": "Belum ada definisi kasus mapan.",
            "alasan": "Cepat menangkap sinyal aneh.",
            "contoh": "Klaster pneumonia tak jelas penyebabnya (awal COVID).",
        },
        {
            "title": "Uji skenario intervensi \u2192 Model SIR/kompartemen",
            "kondisi": "Pertanyaan \u201cbagaimana jika\u201d untuk kebijakan.",
            "alasan": "Mekanistik, transparan, komunikatif.",
            "contoh": "Dampak cakupan vaksinasi 70% vs 90% terhadap puncak.",
        },
        {
            "title": "Prediksi jangka pendek (1\u20134 minggu) \u2192 Model statistik/time-series",
            "kondisi": "Butuh angka operasional (kebutuhan RS minggu depan).",
            "alasan": "Lebih akurat jangka pendek; SIR terlalu kaku.",
            "contoh": "Proyeksi kebutuhan bed IGD minggu depan.",
            "chart": {
                "var": "hd16RtData",
                "data": [{"x": ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"], "y": [2.1, 1.8, 1.4, 1.1, 0.9, 0.7, 0.6, 0.5], "type": "scatter", "mode": "lines+markers", "name": "Rt", "line": {"color": "#2a7de1"}},
                        {"x": ["M1", "M8"], "y": [1, 1], "type": "scatter", "mode": "lines", "name": "Ambang 1", "line": {"dash": "dash", "color": "#e8a838"}}],
                "title": "Rt Mingguan \u2014 Intervensi Menekan di Bawah 1",
                "layout": {"xaxis": {"title": "Minggu"}, "yaxis": {"title": "Rt"}, "showlegend": True},
                "cara": "Garis biru = Rt per minggu; kuning putus-putus = ambang 1. Perhatikan kapan biru menembus ke bawah kuning.",
                "interpretasi": "Rt turun dari 2,1 ke 0,5 dalam 8 minggu \u2014 intervensi bekerja (atau S habis; bedakan dengan data!). Menembus di bawah 1 = titik balik wabah. Inilah satu grafik yang paling berguna untuk rapat krisis.",
            },
        },
        {
            "title": "Targeting wilayah \u2192 Analisis spasial hotspot",
            "kondisi": "Sumber daya terbatas, sebaran tidak merata.",
            "alasan": "Fokus di mana api menyala.",
            "contoh": "Fogging/PSN fokus 5 kelurahan hotspot DBD.",
        },
    ],
    "aturan10": [
        "Pakai tanggal onset, bukan tanggal lapor, untuk kurva.",
        "Tanya underreporting sebelum percaya angka.",
        "Rt untuk aksi; R0 untuk konteks.",
        "Skenario, bukan ramalan titik.",
    ],
    "case": {
        "title": "Fogging Massal: Berhasil atau Musiman?",
        "body": [
            "<p>Kota melakukan fogging massal DBD di bulan Maret. Kasus turun 60% di April\u2013Mei. Walikota mengklaim sukses dan menganggarkan fogging rutin tiap bulan.</p>",
            "<p>Kamu cek data 5 tahun: kasus DBD selalu turun di April\u2013Mei (musim kemarau, nyamuk berkurang). Tidak ada wilayah kontrol. Rt sudah < 1 sejak Februari (sebelum fogging).</p>",
        ],
        "pertanyaan": "Apakah fogging berhasil? Apa rekomendasi anggarannya?",
        "pembahasan": "Tidak terbukti. Tiga masalah: (1) musiman \u2014 penurunan terjadi tiap tahun tanpa fogging; (2) Rt<1 sebelum intervensi \u2014 wabah sudah padam sendiri (S habis/musim); (3) tanpa kontrol, tak ada pembanding (post hoc fallacy). Rekomendasi: JANGAN anggarkan fogging rutin bulanan (mahal, resistensi insektisida, dampak lingkungan); alihkan ke PSN (pemberantasan sarang nyamuk) + surveilans larva + fogging FOKUS saat alert hotspot (HD16). Uji fogging yang benar butuh desain stepped-wedge atau kontrol. Pelajaran: intervensi yang \u201cberhasil\u201d setiap musim adalah intervensi yang menunggangi musim.",
    },
    "quiz": [
        ("Rt = 0,7 artinya\u2026",
         ["Wabah tumbuh cepat", "Tiap kasus menulari rata-rata 0,7 orang \u2014 wabah menyusut", "70% populasi kebal", "Tidak ada kasus"],
         1,
         "Benar: di bawah 1 = padam. Di atas 1 = tumbuh. Inilah angka aksi."),
        ("Campak R0 ~15. Cakupan imunisasi untuk herd immunity sekitar\u2026",
         ["50%", "93%+", "20%", "100% pasti"],
         1,
         "Benar: 1\u22121/15 \u2248 93%. Itulah kenapa target campak >95% \u2014 R0 tinggi = ambang tinggi."),
        ("Dalam SIR, intervensi masker/isolasi bekerja via\u2026",
         ["Menaikkan gamma", "Menurunkan beta (laju penularan)", "Menambah N", "Menghapus R"],
         1,
         "Benar: \u03b2 = kontak \u00d7 peluang infeksi. Vaksinasi mengecilkan S; pengobatan cepat menaikkan \u03b3."),
        ("Kurva kasus berdasarkan tanggal LAPOR vs tanggal ONSET. Masalahnya?",
         ["Tidak ada", "Kurva lapor terlambat 1\u20132 minggu dari realita \u2014 keputusan dari masa lalu", "Kurva lapor lebih akurat", "Onset tidak penting"],
         1,
         "Benar: lag pelaporan menggeser persepsi. Rt dari data lapor = Rt dua minggu lalu."),
        ("Kasus turun setelah intervensi. Agar klaim \u201cintervensi berhasil\u201d valid, butuh\u2026",
         ["Siaran pers", "Pembanding: Rt sebelum vs sesudah / wilayah kontrol (waspadai penurunan alami & musiman)", "Anggaran lebih", "Tidak butuh apa-apa"],
         1,
         "Benar: kurva turun sendiri saat S habis atau musim berganti. Tanpa kontrol = post hoc fallacy."),
        ("Fogging merata satu kota saat hotspot hanya di 3 RW adalah\u2026",
         ["Paling efektif", "Boros + risiko resistensi \u2014 gunakan analisis spasial untuk fokus", "Wajib regulasi", "Tidak ada alternatif"],
         1,
         "Benar: peta hotspot menghemat sumber daya dan mengurangi dampak lingkungan. Presisi > volume."),
    ],
    "rangkuman": [
        "Surveilans = <strong>indikator</strong> (rutin) + <strong>event-based</strong> (sinyal cepat); alert = trade-off cepat vs false alarm.",
        "<strong>SIR</strong>: S\u2192I\u2192R; tiga tuas: turunkan \u03b2, naikkan \u03b3, kecilkan S.",
        "<strong>R0</strong> = potensi; <strong>Rt</strong> = realita untuk aksi; herd immunity = 1\u22121/R0.",
        "Model untuk <strong>skenario</strong>, bukan ramalan titik; sajikan rentang.",
        "Pakai <strong>tanggal onset</strong>; tanyakan underreporting.",
        "Klaim keberhasilan butuh <strong>pembanding</strong> (kontrol/musiman/Rt).",
        "<strong>Spasial</strong>: fokus di hotspot; waspadai ecological fallacy.",
        "Deteksi dini membeli waktu \u2014 seluruh nilai surveilans ada di kecepatan.",
    ],
    "prev": ("hd15-imaging-medis", "HD15"),
    "next": ("hd17-ekonomi-kesehatan", "HD17"),
}

# ================================================================ HD17
HD17 = {
    "slug": "hd17-ekonomi-kesehatan",
    "code": "HD17",
    "track": TRACK,
    "cover_title": "QALY &amp; ICER:<br />Harga Sebuah Tahun Hidup Sehat",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Rp1,5 Miliar untuk Satu Pasien?"),
        ("qaly", "QALY \u2014 Si Mata Uang Kesehatan"),
        ("icer", "ICER &amp; Cost-Effectiveness"),
        ("operasi", "Operasi RS: LOS, Readmission &amp; Antrean"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Hitung QALY &amp; ICER"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Antrean IGD"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menghitung <strong>QALY</strong> dari profil utilitas dan durasi.",
        "Menghitung <strong>ICER</strong> dan menafsirkannya terhadap <strong>threshold</strong> (WTP).",
        "Membaca <strong>cost-effectiveness plane</strong> dan mengidentifikasi strategi dominan/didominasi.",
        "Menganalisis <strong>LOS, readmission, dan antrean</strong> sebagai masalah operasi RS.",
    ],
    "story_title": "Cerita Pembuka: Rp1,5 Miliar untuk Satu Pasien?",
    "story": [
        "<p>Obat baru kanker: Rp1,5 miliar per pasien per tahun, memperpanjang hidup rata-rata <strong>4 bulan</strong> dengan kualitas hidup sedang. BPJS ditanya: tanggung atau tidak? Dana terbatas \u2014 Rp1,5 miliar yang sama bisa memvaksin 30.000 anak atau mengobati 500 pasien TB sampai sembuh.</p>",
        "<p>Tidak ada jawaban yang tidak menyakitkan. Tapi ada cara <em>transparan</em> untuk memutuskan: <strong>ekonomi kesehatan</strong>. Ia tidak menjawab \u201cnyawa berapa harganya\u201d \u2014 ia menjawab \u201cdengan dana terbatas, mana yang menyelamatkan kesehatan TERBANYAK\u201d. Lesson ini tentang matematika keputusan tersulit di kesehatan.</p>",
    ],
    "konsep": [
        {
            "id": "qaly",
            "title": "QALY \u2014 Si Mata Uang Kesehatan",
            "definisi": "<strong>QALY (Quality-Adjusted Life Year)</strong>: 1 tahun hidup sempurna = 1 QALY; 1 tahun dengan kualitas 0,6 = 0,6 QALY; meninggal = 0. Menggabungkan <em>panjang</em> dan <em>kualitas</em> hidup dalam satu angka.",
            "rumus": r"QALY = \sum_{t} u_t \times \Delta t",
            "simbol": [
                (r"u_t", "utilitas (kualitas hidup 0\u20131) pada periode t"),
                (r"\Delta t", "durasi periode t (tahun)"),
            ],
            "interpretasi": "QALY memungkinkan apel-vs-jeruk: vaksin (panjang hidup) vs obat nyeri (kualitas hidup) bisa dibandingkan dalam mata uang sama. Utilitas diukur via kuesioner standar (EQ-5D).",
            "worked": (
                "\U0001f4d0 Contoh: QALY obat kanker cerita pembuka",
                "<p>Obat menambah 4 bulan (1/3 tahun) hidup dengan utilitas 0,6.<br />"
                "QALY gained = 0,6 \u00d7 (1/3) = <strong>0,2 QALY</strong>.<br />"
                "Biaya Rp1,5 M untuk 0,2 QALY \u2192 Rp7,5 M per QALY.<br />"
                "Bandingkan: vaksinasi anak ~Rp50 juta per QALY. Dana yang sama menyelamatkan 150x lipat QALY bila untuk vaksin. Inilah opportunity cost yang dibuat eksplisit.</p>",
            ),
            "kepribadian": "QALY itu seperti rupiah untuk kesehatan: ia memaksa semua intervensi \u2014 dari vaksin sampai obat kanker \u2014 dinilai dengan mata uang yang sama. Kejam? Ya. Tapi alternatifnya (keputusan tanpa angka) lebih kejam: yang bersuara paling keras yang menang, bukan yang paling membutuhkan.",
            "kapan": "Perbandingan lintas program/penyakit untuk alokasi anggaran: formularium, paket manfaat JKN, prioritas Dinkes.",
            "chart": {
                "var": "hd17QalyData",
                "data": [{"x": ["Vaksinasi anak", "Pengobatan TB", "Obat hipertensi", "Obat kanker baru"], "y": [0.05, 0.1, 0.3, 7.5], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#2a7de1", "#e8a838"]}, "text": ["0,05", "0,1", "0,3", "7,5"], "textposition": "outside"}],
                "title": "Biaya per QALY (Rp miliar) \u2014 Ilustratif",
                "layout": {"xaxis": {"title": "Intervensi"}, "yaxis": {"title": "Rp miliar per QALY"}, "showlegend": False},
                "cara": "Batang = biaya untuk membeli 1 QALY via tiap intervensi. Makin pendek makin efisien.",
                "interpretasi": "Obat kanker (kuning) 150x lebih mahal per QALY dari vaksin. Ini BUKAN vonis \u201cjangan obati kanker\u201d \u2014 melainkan peta opportunity cost: setiap rupiah punya harga dalam nyawa yang tak tertolong di tempat lain. Threshold (mis. 1\u20133x PDB per kapita per QALY, ala WHO) mengubah peta ini menjadi keputusan.",
            },
        },
        {
            "id": "icer",
            "title": "ICER &amp; Cost-Effectiveness \u2014 Si Wasit Anggaran",
            "definisi": "<strong>ICER</strong> = selisih biaya / selisih efek antara dua strategi. <strong>Cost-effective</strong> bila ICER di bawah <strong>threshold</strong> (willingness-to-pay, mis. 1\u20133\u00d7 PDB per kapita per QALY).",
            "rumus": r"ICER = \frac{C_1 - C_0}{E_1 - E_0}",
            "simbol": [
                (r"C_1 - C_0", "selisih biaya (strategi baru minus pembanding)"),
                (r"E_1 - E_0", "selisih efek dalam QALY (atau life-year)"),
            ],
            "interpretasi": "ICER = Rp300 juta/QALY dengan threshold Rp500 juta \u2192 cost-effective (layak). Strategi <strong>dominan</strong>: lebih murah DAN lebih efektif \u2014 langsung pilih. <strong>Didominasi</strong>: lebih mahal dan lebih buruk \u2014 langsung buang.",
            "worked": (
                "\U0001f4d0 Contoh: skrining DM vs tidak skrining",
                "<p>Tanpa skrining: biaya Rp10 jt, efek 8,0 QALY. Dengan skrining: biaya Rp16 jt, efek 8,04 QALY.<br />"
                "ICER = (16\u221210)jt / (8,04\u22128,0) = 6 jt / 0,04 = <strong>Rp150 juta/QALY</strong>.<br />"
                "Threshold Rp500 jt \u2192 <strong>cost-effective</strong>. Keputusan: skrining layak didanai.<br />"
                "Catatan: ICER selalu RELATIF terhadap pembanding \u2014 ganti pembanding, ganti ICER.</p>",
            ),
            "kepribadian": "ICER itu seperti harga per porsi di kantin: bukan \u201cmahal atau murah\u201d absolut, melainkan \u201cworth it dibanding opsi lain?\u201d Threshold adalah budget kantinmu \u2014 di atas itu, seenak apapun, tidak dibeli.",
            "kapan": "Keputusan formularium, paket manfaat, investasi program \u2014 selalu dengan analisis sensitivitas (hasil berubah bila asumsi berubah?).",
        },
        {
            "id": "operasi",
            "title": "Operasi RS: LOS, Readmission &amp; Antrean",
            "definisi": "<strong>LOS</strong> (length of stay): lama rawat. <strong>Readmission</strong>: rawat ulang <30 hari (proksi kualitas). <strong>Teori antrean</strong>: waktu tunggu meledak saat utilisasi mendekati 100% (bukan linear!).",
            "rumus": r"W_q \approx \frac{\rho}{1-\rho} \times \text{(faktor layanan)}",
            "simbol": [
                (r"W_q", "waktu tunggu antrean rata-rata"),
                (r"\rho", "utilisasi (0\u20131): sibuknya sistem"),
            ],
            "interpretasi": "Rumus intuisi: \u03c1=0,5 \u2192 faktor 1; \u03c1=0,9 \u2192 faktor 9; \u03c1=0,95 \u2192 faktor 19. Menaikkan utilisasi dari 90% ke 95% <strong>menggandakan antrean</strong> \u2014 inilah kenapa IGD \u201cpenuh\u201d tiba-tiba macet total.",
            "worked": (
                "\U0001f4d0 Contoh: bed RS dan BOR",
                "<p>RS 100 bed, BOR (okupansi) 95%. Waktu tunggu IGD untuk bed: 8 jam.<br />"
                "Tambah 10 bed (utilisasi turun ke ~86%): waktu tunggu anjlok ke ~2 jam.<br />"
                "Bukan karena 10 bed itu ajaib \u2014 tapi karena keluar dari zona \u03c1\u21921 di mana antrean eksponensial.<br />"
                "<strong>Readmission:</strong> RS dengan readmission 20% vs 10% \u2014 bedakan yang <em>avoidable</em> (pulang terlalu cepat, LOS ditekan) dari yang tak terhindarkan (lihat HD20).</p>",
            ),
            "kepribadian": "Antrean itu seperti balon: ditiup sampai 90% masih kalem, lewat itu menggelembung liar. Manajer yang menarget BOR 100% sedang menargetkan kekacauan \u2014 efisiensi semu yang dibayar dengan waktu tunggu pasien.",
            "kapan": "Perencanaan kapasitas (bed, dokter jaga), evaluasi efisiensi vs kualitas (LOS pendek + readmission naik = false economy).",
        },
    ],
    "myths": [
        ("QALY menilai nyawa orang cacat lebih rendah sehingga diskriminatif",
         "Kritik ini nyata dan diperdebatkan etikawan. Praktik terbaik: QALY untuk <em>perbandingan intervensi</em>, bukan penilaian <em>nilai manusia</em>; banyak pedoman menambahkan bobot keadilan (severity, kelompok rentan). Analis harus tahu kontroversinya \u2014 bukan memakai QALY secara buta."),
        ("Intervensi cost-effective pasti harus didanai",
         "Cost-effectiveness adalah SATU kriteria. Keadilan (siapa yang diuntungkan), kelayakan anggaran total (budget impact), dan nilai sosial ikut menentukan. ICER di bawah threshold = \u201clayak dipertimbangkan\u201d, bukan \u201cwajib\u201d."),
        ("LOS makin pendek selalu makin efisien",
         "LOS pendek + readmission naik = memindahkan biaya ke masa depan (false economy). Efisiensi sejati = outcome per rupiah sepanjang episode, bukan LOS semata. Ukur keduanya bersamaan."),
    ],
    "tips": [
        "Selalu sajikan <strong>budget impact</strong> bersama ICER. \u201cCost-effective tapi butuh Rp2 triliun\u201d adalah informasi yang mengubah keputusan.",
        "Lakukan <strong>analisis sensitivitas</strong> (tornado diagram): parameter apa yang paling menggoyang kesimpulan? Jika threshold dilampaui dalam skenario plausibel, katakan.",
        "Untuk operasi RS: ukur <strong>utilisasi</strong> sebelum menambah kapasitas. Seringkali masalahnya bukan kurang bed, tapi distribusi jadwal operasi yang menumpuk di hari yang sama.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Kalkulator QALY &amp; ICER",
            "intro": "Hitung QALY dua strategi dari profil utilitas, lalu ICER dan keputusan terhadap threshold. Ubah utilitas/biaya dan lihat keputusan berbalik.",
            "hint": "Naikkan biaya obat baru sampai ICER melewati threshold Rp500jt. Itulah harga maksimal yang \u201cmasuk akal\u201d \u2014 dasar negosiasi harga yang kuat.",
            "code": (
                "# profil: [(utilitas, tahun)]\n"
                "standar = [(0.7, 5)]\n"
                "baru = [(0.75, 5.5)]\n"
                "biaya_standar, biaya_baru = 50_000_000, 200_000_000\n"
                "THR = 500_000_000  # threshold Rp per QALY\n"
                "qaly = lambda prof: sum(u*t for u, t in prof)\n"
                "E0, E1 = qaly(standar), qaly(baru)\n"
                "ICER = (biaya_baru-biaya_standar)/(E1-E0)\n"
                "print(f'QALY standar = {E0:.2f}, QALY baru = {E1:.2f} (selisih {E1-E0:.2f})')\n"
                "print(f'ICER = Rp{ICER:,.0f} per QALY')\n"
                "print(f'Threshold = Rp{THR:,.0f} -> {\"COST-EFFECTIVE \u2713\" if ICER < THR else \"TIDAK cost-effective \u2717\"}')\n"
                "# harga maksimal agar tetap cost-effective\n"
                "maks = biaya_standar + THR*(E1-E0)\n"
                "print(f'Harga maks obat baru agar layak: Rp{maks:,.0f}')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Antrean Meledak di Utilisasi Tinggi",
            "intro": "Simulasikan IGD sederhana: pasien datang acak, dilayani acak. Naikkan utilisasi 70%\u219290%\u219295% dan lihat waktu tunggu \u2014 tidak linear!",
            "hint": "Inilah alasan BOR 100% adalah target yang buruk. Coba tambah 1 dokter (kapasitas naik) pada utilisasi 95% \u2014 efeknya dramatis.",
            "code": (
                "import random\n"
                "random.seed(30)\n"
                "def simulasi(tiba_per_jam, layani_per_jam, jam=24*30):\n"
                "    t, antre, tunggu, dilayani = 0.0, 0, [], 0\n"
                "    sibuk_sampai = 0.0\n"
                "    while t < jam:\n"
                "        t += random.expovariate(tiba_per_jam)\n"
                "        if t >= jam: break\n"
                "        mulai = max(t, sibuk_sampai)\n"
                "        tunggu.append(mulai - t)\n"
                "        sibuk_sampai = mulai + random.expovariate(layani_per_jam)\n"
                "        dilayani += 1\n"
                "    return sum(tunggu)/len(tunggu)*60\n"
                "layani = 10  # kapasitas: 10 pasien/jam\n"
                "for tiba in [7, 9, 9.5]:\n"
                "    rho = tiba/layani\n"
                "    w = simulasi(tiba, layani)\n"
                "    print(f'utilisasi {rho:.0%}: rata-rata tunggu {w:.0f} menit')\n"
                "print()\n"
                "print('70% -> 90%: tunggu naik ~4x. 90% -> 95%: naik ~2x lagi.')\n"
                "print('Antrean eksponensial di dekat 100%. Target BOR 100% = target macet.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Banding lintas program \u2192 QALY + ICER vs threshold",
            "kondisi": "Alokasi anggaran antar penyakit/program.",
            "alasan": "Mata uang sama; transparan soal opportunity cost.",
            "contoh": "Vaksin vs obat kanker vs TB dalam satu pagu.",
        },
        {
            "title": "Satu penyakit, banyak opsi \u2192 Dominance check dulu",
            "kondisi": "Pilih strategi terbaik untuk kondisi spesifik.",
            "alasan": "Buang yang didominasi sebelum hitung ICER.",
            "contoh": "Tiga regimen TB: satu dominan (murah+efektif).",
        },
        {
            "title": "Klaim \u201cefisien\u201d \u2192 Cek LOS + readmission bersamaan",
            "kondisi": "Evaluasi efisiensi RS.",
            "alasan": "LOS pendek saja bisa false economy.",
            "contoh": "RS A LOS 3 hari + readmit 18% vs RS B LOS 5 hari + readmit 8%.",
        },
        {
            "title": "IGD/bed penuh \u2192 Analisis utilisasi & antrean",
            "kondisi": "Waktu tunggu meledak.",
            "alasan": "Solusi sering bukan tambah bed, tapi ratakan jadwal/kurangi \u03c1.",
            "contoh": "Jadwal operasi elektif menumpuk Senin \u2192 ratakan.",
            "chart": {
                "var": "hd17QueueData",
                "data": [{"x": [50, 60, 70, 80, 90, 95], "y": [12, 18, 28, 48, 108, 228], "type": "scatter", "mode": "lines+markers", "name": "Waktu tunggu (m)", "line": {"color": "#e8a838"}}],
                "title": "Waktu Tunggu vs Utilisasi \u2014 Ledakan di Ujung",
                "layout": {"xaxis": {"title": "Utilisasi (%)"}, "yaxis": {"title": "Tunggu rata-rata (menit)"}, "showlegend": False},
                "cara": "Sumbu X = utilisasi sistem, Y = waktu tunggu rata-rata hasil simulasi. Perhatikan bentuk kurva.",
                "interpretasi": "Sampai 80% kurva landai; setelah 90% meledak. Inilah visual dari W_q \u221d \u03c1/(1\u2212\u03c1): 5 poin utilisasi terakhir jauh lebih mahal dari 20 poin pertama. Manajer yang bangga BOR 98% sedang memamerkan antrean.",
            },
        },
    ],
    "aturan10": [
        "Bandingkan dengan mata uang sama (QALY).",
        "ICER selalu relatif terhadap pembanding + threshold.",
        "Sajikan budget impact + sensitivitas.",
        "Utilisasi ~95%+ = zona ledakan antrean.",
    ],
    "case": {
        "title": "Skrining Kanker Serviks: IVA vs HPV-DNA",
        "body": [
            "<p>Dinkes memilih metode skrining: <strong>IVA</strong> (murah, Rp50rb, sens 60%) vs <strong>HPV-DNA</strong> (Rp400rb, sens 95%). Anggaran tetap: Rp2 miliar/tahun.</p>",
            "<p>Analisis: IVA menjangkau 40.000 wanita; HPV-DNA hanya 5.000. Kasus terdeteksi: IVA ~ kasus lebih banyak karena jangkauan 8x lipat, walau sens lebih rendah.</p>",
        ],
        "pertanyaan": "Mana yang dipilih? Tunjukkan cara berpikirnya.",
        "pembahasan": "Hitung efek populasi, bukan sens individu: IVA: 40.000 \u00d7 prevalensi \u00d7 60%; HPV-DNA: 5.000 \u00d7 prevalensi \u00d7 95%. Dengan prevalensi lesi 2%: IVA \u2192 480 terdeteksi; HPV-DNA \u2192 95 terdeteksi. IVA memenangkan <strong>efek populasi</strong> 5x lipat dengan anggaran sama \u2014 walau \u201ctesnya lebih jelek\u201d. Inilah pelajaran ekonomi kesehatan: tes terbaik \u00d7 jangkauan kecil bisa kalah dari tes cukup-baik \u00d7 jangkauan massal. (Ideal: strategi hybrid \u2014 HPV-DNA untuk yang IVA positif/risiko tinggi.) Jangan biarkan perfeksionisme tes mengalahkan aritmetika populasi.",
    },
    "quiz": [
        ("1 QALY artinya\u2026",
         ["1 tahun hidup berapa pun kualitasnya", "1 tahun hidup dalam kesehatan sempurna (atau ekuivalennya)", "1 juta rupiah", "1 pasien sembuh"],
         1,
         "Benar: 2 tahun dengan utilitas 0,5 = 1 QALY. Menggabungkan panjang DAN kualitas."),
        ("ICER = Rp150jt/QALY, threshold Rp500jt. Kesimpulan?",
         ["Tidak layak", "Cost-effective \u2014 di bawah willingness-to-pay", "Harus gratis", "Tidak bisa dinilai"],
         1,
         "Benar: di bawah threshold = nilai yang baik untuk uang. Tapi tetap cek budget impact + keadilan."),
        ("Strategi A: biaya Rp10jt, 8,0 QALY. B: Rp12jt, 7,9 QALY. Maka B\u2026",
         ["Cost-effective", "Didominasi (lebih mahal, kurang efektif) \u2014 buang", "Dominan", "Perlu ICER"],
         1,
         "Benar: didominasi = kalah di kedua sisi. Tidak perlu hitung ICER \u2014 langsung eliminasi."),
        ("Utilisasi IGD naik 90% \u2192 95%. Waktu tunggu\u2026",
         ["Naik sedikit (linear)", "Naik ~2x lipat (eksponensial di dekat 100%)", "Turun", "Tetap"],
         1,
         "Benar: W_q \u221d \u03c1/(1\u2212\u03c1). 0,9/0,1=9 vs 0,95/0,05=19. Inilah kenapa BOR 100% = target macet."),
        ("LOS turun tapi readmission naik tajam. Interpretasi?",
         ["Makin efisien", "False economy \u2014 biaya dipindah ke masa depan; ukur episode, bukan LOS", "Pasien makin sehat", "Tidak terkait"],
         1,
         "Benar: efisiensi semu. Pulang terlalu cepat = readmit. Ukur outcome per rupiah sepanjang episode."),
        ("Kritik valid terhadap QALY?",
         ["Tidak ada", "Bisa merugikan kelompok dengan disabilitas kronis bila dipakai buta \u2014 butuh bobot keadilan", "Terlalu sederhana", "Tidak bisa dihitung"],
         1,
         "Benar: kontroversi etiknya nyata. Analis profesional tahu batas alatnya \u2014 pakai dengan penyesuaian keadilan."),
    ],
    "rangkuman": [
        "<strong>QALY</strong> = \u03a3 utilitas \u00d7 waktu \u2014 mata uang pembanding lintas program.",
        "<strong>ICER</strong> = \u0394biaya/\u0394efek; cost-effective bila < threshold WTP.",
        "Cek <strong>dominansi</strong> dulu sebelum ICER.",
        "Sajikan <strong>budget impact + sensitivitas</strong> bersama ICER.",
        "Tes \u201cterj ele k\u201d \u00d7 jangkauan kecil bisa kalah dari tes cukup-baik \u00d7 massal.",
        "<strong>Antrean meledak</strong> di utilisasi ~95%+: W_q \u221d \u03c1/(1\u2212\u03c1).",
        "<strong>LOS pendek + readmit naik</strong> = false economy.",
        "QALY punya kontroversi etik \u2014 pakai transparan dengan bobot keadilan.",
    ],
    "prev": ("hd16-surveilans-wabah", "HD16"),
    "next": ("hd18-privasi-etika", "HD18"),
}

# ================================================================ HD18
HD18 = {
    "slug": "hd18-privasi-etika",
    "code": "HD18",
    "track": TRACK,
    "cover_title": "k-Anonymity &amp; Differential Privacy:<br />Rahasia Pasien di Era Data",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Gubernur yang Teridentifikasi"),
        ("deid", "De-identifikasi &amp; k-Anonymity"),
        ("dp", "Differential Privacy \u2014 Si Matematikawan"),
        ("federated", "Federated Learning &amp; Tata Kelola"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Serangan Re-identifikasi &amp; k-Anonymity"),
        ("lab2", "\U0001f52c Lab 2: Noise Differential Privacy"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>serangan re-identifikasi</strong> via quasi-identifier (kasus nyata).",
        "Menerapkan <strong>k-anonymity, l-diversity</strong> dan mengenali keterbatasannya.",
        "Menjelaskan <strong>differential privacy</strong> (epsilon) secara intuitif + trade-off privasi-utilitas.",
        "Merancang tata kelola: <strong>IRB/komite etik, DUA, UU PDP</strong>, dan kapan memakai <strong>federated learning</strong>.",
    ],
    "story_title": "Cerita Pembuka: Gubernur yang Teridentifikasi",
    "story": [
        "<p>1990-an, Massachusetts merilis data klaim kesehatan yang \u201cdianonimkan\u201d (nama dihapus). Peneliti Latanya Sweeney membeli data pemilih seharga $20, lalu mencocokkan <strong>kode pos + tanggal lahir + jenis kelamin</strong> \u2014 dan menemukan <strong>rekam medis Gubernur</strong>, termasuk diagnosis dan resepnya. Tanpa nama. Hanya tiga kolom \u201cnon-identitas\u201d.</p>",
        "<p>Tiga kolom yang terlihat tidak berbahaya mengidentifikasi 87% populasi AS. Di Indonesia, kombinasi kecamatan + tanggal lahir + diagnosis langka sama mematikannya. Lesson ini tentang cara berbagi data tanpa mengkhianati pasien \u2014 karena kepercayaan publik adalah infrastruktur yang paling mahal untuk dibangun ulang.</p>",
    ],
    "konsep": [
        {
            "id": "deid",
            "title": "De-identifikasi &amp; k-Anonymity \u2014 Si Penyamar",
            "definisi": "<strong>Quasi-identifier</strong>: kolom yang tidak mengidentifikasi sendiri tapi deadly dalam kombinasi (umur, wilayah, tanggal). <strong>k-anonymity</strong>: tiap kombinasi quasi-identifier dimiliki minimal k orang. <strong>l-diversity</strong>: tiap kelompok-k juga beragam nilai sensitifnya.",
            "rumus": r"\text{Setiap pola quasi-identifier muncul} \geq k \text{ kali}",
            "simbol": [
                (r"k", "ambang anonimitas (umum: k=5)"),
            ],
            "interpretasi": "k=5: penyerang yang tahu umur+wilayah+diagnosismu hanya bisa mempersempit ke 5 orang, bukan 1. l-diversity menutup celah: bila kelima-limanya HIV-positif, anonimitasmu semu.",
            "worked": (
                "\U0001f4d0 Contoh: generalisasi mencapai k=3",
                "<p>Data: (35 th, Kec. A, TB), (35, Kec. A, DBD), (36, Kec. A, TB) \u2192 pola (35, Kec.A) hanya 2 orang < k=3.<br />"
                "<strong>Generalisasi:</strong> umur 35\u201336 \u2192 rentang \u201c35\u201339\u201d; Kec. A tetap.<br />"
                "Kini pola (35\u201339, Kec.A) = 3 orang \u2713.<br />"
                "<strong>Harga:</strong> presisi umur hilang \u2014 analisis yang butuh umur tepat melemah. Inilah trade-off abadi privasi-utilitas.</p>",
            ),
            "kepribadian": "k-anonymity itu seperti menyamar di kerumunan: kamu aman bila ada minimal k\u22121 orang berpenampilan sama. l-diversity memastikan kerumunanmu tidak semuanya membawa rahasia yang sama.",
            "kapan": "Rilis dataset untuk riset: generalisasi + supresi hingga k terpenuhi; cek l-diversity untuk atribut sensitif.",
            "chart": {
                "var": "hd18KanData",
                "data": [{"x": ["Data mentah", "k=3", "k=5", "k=10"], "y": [87, 22, 9, 2], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["87%", "22%", "9%", "2%"], "textposition": "outside"}],
                "title": "Risiko Re-identifikasi vs k-Anonymity (ilustratif)",
                "layout": {"xaxis": {"title": "Level proteksi"}, "yaxis": {"title": "% record unik (berisiko)", "range": [0, 100]}, "showlegend": False},
                "cara": "Batang = persen record yang unik (bisa diidentifikasi) pada tiap level. Makin kanan makin protektif.",
                "interpretasi": "Data mentah: 87% unik (kasus Sweeney). k=5 memangkas ke 9%. Tapi perhatikan: tidak pernah nol \u2014 dan utilitas ikut turun. k-anonymity adalah mitigasi, bukan jaminan; untuk jaminan matematis lihat differential privacy.",
            },
        },
        {
            "id": "dp",
            "title": "Differential Privacy \u2014 Si Matematikawan",
            "definisi": "<strong>Differential privacy (DP)</strong>: jaminan bahwa hasil analisis <strong>hampir sama</strong> baik dengan maupun tanpa satu orang dalam data. Dicapai dengan menambah <strong>noise terkalibrasi</strong> (skala 1/epsilon). <strong>Epsilon kecil = privasi kuat, utilitas turun.</strong>",
            "rumus": r"P[M(D) \in S] \leq e^{\epsilon} \cdot P[M(D') \in S]",
            "simbol": [
                (r"M", "mekanisme (query + noise)"),
                (r"D, D'", "dataset yang beda tepat 1 orang"),
                (r"\epsilon", "budget privasi: kecil = ketat (umum 0,1\u20131)"),
            ],
            "interpretasi": "Rumus: kehadiranmu mengubah peluang output maksimal e^epsilon kali. Epsilon 0,1 \u2192 hampir tak terdeteksi kamu ada di data. Berbeda dengan k-anonymity, DP tahan terhadap <em>informasi latar penyerang apapun</em> \u2014 jaminan matematis, bukan harapan.",
            "worked": (
                "\U0001f4d0 Contoh: hitung kasus DBD dengan DP",
                "<p>Kasus sebenarnya: 1.234. Sensitivitas query \u201ccount\u201d = 1 (satu orang mengubah count max 1).<br />"
                "Noise Laplace skala 1/\u03b5; \u03b5=0,5 \u2192 noise ~ \u00b12.<br />"
                "Rilis: 1.236 (atau 1.232 \u2014 acak). Untuk agregat besar, noise tak berarti; untuk sel kecil (<10), noise mendominasi \u2014 <strong>itulah proteksinya bekerja</strong>.</p>",
            ),
            "kepribadian": "DP itu seperti menjawab wartawan sambil berbisik dengan dadu di tangan: jawabannya benar secara statistik, tapi tak pernah cukup presisi untuk mengkhianati satu orang. Epsilon adalah volume bisikanmu.",
            "kapan": "Rilis statistik resmi, dashboard publik, query berulang ke data sensitif \u2014 di mana budget privasi harus dikelola.",
        },
        {
            "id": "federated",
            "title": "Federated Learning &amp; Tata Kelola \u2014 Si Arsitek Kepercayaan",
            "definisi": "<strong>Federated learning</strong>: model dilatih di tiap RS (data tidak pindah); hanya <em>update model</em> yang dikirim ke server pusat. <strong>Tata kelola</strong>: IRB/komite etik, <strong>DUA</strong> (perjanjian penggunaan data), dan <strong>UU PDP Indonesia</strong> (persetujuan, hak hapus, keamanan).",
            "kepribadian": "Federated learning itu seperti ujian nasional tanpa mengumpulkan lembar jawaban: tiap sekolah menilai sendiri, hanya nilai rata-rata yang dikirim ke pusat. Datanya diam, pengetahuannya jalan.",
            "kapan": "Kolaborasi multi-RS tanpa berbagi data mentah (riset, model bersama). Tata kelola: SELALU \u2014 sebelum satu baris data bergerak.",
            "worked": (
                "\U0001f4d0 Contoh: checklist tata kelola proyek",
                "<p>1. <strong>Persetujuan etik</strong> (komite etik RS/universitas) \u2014 untuk data pasien, hampir selalu wajib.<br />"
                "2. <strong>Dasar hukum UU PDP</strong>: persetujuan eksplisit / kepentingan publik / kontrak \u2014 dokumentasikan.<br />"
                "3. <strong>DUA</strong>: siapa akses, untuk apa, berapa lama, larangan re-identifikasi.<br />"
                "4. <strong>Minimisasi</strong>: minta kolom yang dibutuhkan saja.<br />"
                "5. <strong>Keamanan</strong>: enkripsi, akses terbatas, audit log.<br />"
                "6. <strong>Rencana publikasi</strong>: agregat aman (DP/k-anonymity) untuk yang dipublikasi.</p>",
            ),
            "warning": "<strong>Federated learning bukan sihir privasi:</strong> update model bisa membocorkan data (model inversion). Kombinasikan dengan DP pada update + agregasi aman. \u201cData tidak pindah\u201d \u2260 \u201cprivasi terjamin\u201d.",
        },
    ],
    "myths": [
        ("Data sudah anonim sehingga bebas dipakai untuk apa saja",
         "\u201cAnonim\u201d tanpa evaluasi sisa risiko = klaim kosong (kasus Sweeney). Anonimitas adalah spektrum + konteks: data yang anonim untuk publikasi agregat belum tentu anonim untuk dibagikan ke pihak dengan data pembanding. Selalu: ukur, batasi akses, perjanjian."),
        ("Persetujuan pasien (consent) menyelesaikan semua masalah etik",
         "Consent sering tidak informed (formulir panjang tak dibaca) dan tidak mencakup penggunaan sekunder 10 tahun kemudian. Etik butuh lebih: minimisasi, keamanan, akuntabilitas, dan \u2014 untuk kelompok rentan \u2014 pertimbangan keadilan (lihat HD13)."),
        ("Federated learning = tidak perlu izin etik",
         "Tetap butuh! Data dipakai untuk riset = butuh persetujuan etik dan dasar hukum, walau tidak pindah server. Arsitektur teknis tidak menggantikan tata kelola."),
    ],
    "tips": [
        "Terapkan <strong>prinsip minimisasi</strong> secara agresif: untuk tiap kolom, tanya \u201capa yang rusak bila kolom ini tidak ada?\u201d Kolom yang tidak ada = kolom yang tidak bisa bocor.",
        "Pisahkan peran: <strong>data engineer</strong> (lihat teridentifikasi) vs <strong>analis</strong> (hanya de-id). Segregasi akses adalah pertahanan termurah dan paling efektif.",
        "Dokumentasikan keputusan privasi seperti keputusan metode: <strong>apa risikonya, apa mitigasinya, siapa menyetujui</strong>. Jejak audit ini yang ditanya saat insiden \u2014 bukan niat baikmu.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Serangan Re-identifikasi Sederhana",
            "intro": "Diberikan dataset \u201canonim\u201d (tanpa nama) + data pemilih publik. Cocokkan quasi-identifier dan hitung berapa yang teridentifikasi unik.",
            "hint": "Ubah granularitas kode pos (5 digit \u2192 3 digit). Lihat identifikasi unik anjlok \u2014 itulah generalisasi bekerja.",
            "code": (
                "import random\n"
                "random.seed(44)\n"
                "# dataset 'anonim': (kodepos, tgl_lahir, gender, diagnosis)\n"
                "anonim = [(f'90{i%50:02d}', f'{1950+i%40}-{(i%12)+1:02d}', 'L' if i%2 else 'P',\n"
                "           random.choice(['TB','DBD','DM'])) for i in range(200)]\n"
                "# data pemilih publik: (nama, kodepos, tgl_lahir, gender)\n"
                "pemilih = [(f'Orang-{i}', c, t, g) for i,(c,t,g,_) in enumerate(anonim)]\n"
                "cocok_unik = 0\n"
                "for nama, c, t, g in pemilih:\n"
                "    kandidat = [a for a in anonim if a[0]==c and a[1]==t and a[2]==g]\n"
                "    if len(kandidat) == 1:\n"
                "        cocok_unik += 1\n"
                "print(f'Teridentifikasi unik: {cocok_unik}/{len(pemilih)} ({cocok_unik/len(pemilih):.0%})')\n"
                "print('Tanpa nama, hanya 3 kolom \u201cnon-identitas\u201d.')\n"
                "print('-> Inilah serangan Sweeney. Generalisasi kodepos/tanggal = pertahanan.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Noise Differential Privacy",
            "intro": "Tambahkan noise Laplace ke query count dengan berbagai epsilon. Lihat trade-off: privasi kuat (epsilon kecil) = angka goyang.",
            "hint": "Coba count kecil (n=8, mis. kasus langka di kecamatan) vs besar (n=5000). DP melindungi yang kecil dengan \u201cmengaburkan\u201d \u2014 tepat di mana risiko terbesar.",
            "code": (
                "import random\n"
                "random.seed(55)\n"
                "def laplace(skala):\n"
                "    u = random.random() - 0.5\n"
                "    return -skala * (1 if u < 0 else -1) * __import__('math').log(1-2*abs(u))\n"
                "true_count = 1234\n"
                "print(f\"{'epsilon':>8} {'rilis':>8} {'error':>8}\")\n"
                "for eps in [2.0, 1.0, 0.5, 0.1]:\n"
                "    rilis = true_count + laplace(1/eps)\n"
                "    print(f'{eps:>8} {rilis:>8.0f} {abs(rilis-true_count)/true_count:>7.1%}')\n"
                "print()\n"
                "print('Epsilon kecil -> noise besar -> privasi kuat, angka goyang.')\n"
                "print('Untuk n=1234, error <1% bahkan di eps=0.1. Untuk n=8, noise')\n"
                "print('mendominasi -> sel kecil otomatis terlindungi. Itulah DP bekerja.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Rilis dataset riset \u2192 k-anonymity + l-diversity + DUA",
            "kondisi": "Data baris-per-orang dibagikan ke pihak ketiga.",
            "alasan": "Praktis, dipahami reviewer; DUA menutup sisa risiko.",
            "contoh": "Dataset TB untuk peneliti universitas.",
        },
        {
            "title": "Statistik publik berulang \u2192 Differential privacy",
            "kondisi": "Agregat dirilis rutin/publik; query bisa berulang.",
            "alasan": "Jaminan matematis + budget privasi terkontrol.",
            "contoh": "Dashboard kasus mingguan per kecamatan.",
        },
        {
            "title": "Kolaborasi multi-RS tanpa share data \u2192 Federated + DP",
            "kondisi": "Data tidak boleh keluar institusi.",
            "alasan": "Model jalan, data diam; DP pada update cegah inversion.",
            "contoh": "Model prediksi bersama 5 RS.",
        },
        {
            "title": "Setiap proyek data pasien \u2192 Tata kelola dulu",
            "kondisi": "Tanpa kecuali.",
            "alasan": "Kepercayaan publik > kecepatan analisis.",
            "contoh": "Checklist: etik, UU PDP, minimisasi, keamanan, audit.",
        },
    ],
    "aturan10": [
        "Quasi-identifier dalam kombinasi = identifier.",
        "Ukur sisa risiko; jangan klaim \u201canonim\u201d buta.",
        "DP: epsilon kecil = privasi kuat.",
        "Tata kelola dulu, analisis kemudian.",
    ],
    "case": {
        "title": "Dashboard Publik Kasus HIV per Kecamatan",
        "body": [
            "<p>Dinkes ingin dashboard publik: kasus HIV per kecamatan per bulan untuk transparansi. Di kecamatan kecil, ada bulan dengan <strong>1\u20132 kasus</strong>. Tim IT berkata: \u201cnama tidak ditampilkan, jadi aman.\u201d</p>",
            "<p>Kamu diminta review sebelum launch.</p>",
        ],
        "pertanyaan": "Apa risikonya dan rancang solusi 3 lapis.",
        "pembahasan": "Risiko: sel kecil (1\u20132 kasus) + kecamatan + bulan = re-identifikasi mudah bagi warga lokal (\u201csiapa yang ke klinik bulan lalu?\u201d) \u2014 stigma HIV membuat dampaknya devastating. Solusi 3 lapis: (1) <strong>Supresi sel kecil</strong>: tampilkan \u201c<5\u201d untuk count di bawah ambang; (2) <strong>Agregasi</strong>: level kabupaten untuk publik, kecamatan hanya untuk petugas berizin; (3) <strong>DP</strong>: tambahkan noise terkalibrasi pada count publik. Plus: kajian etik + dasar UU PDP sebelum launch. Pelajaran: transparansi tanpa proteksi = membahayakan yang paling rentan. \u201cTidak ada nama\u201d bukan argumen privasi.",
    },
    "quiz": [
        ("Kasus Sweeney (Gubernur teridentifikasi) membuktikan\u2026",
         ["Anonimisasi mustahil", "Quasi-identifier (kodepos+tgl lahir+gender) dalam kombinasi bisa mengidentifikasi unik", "Data pemilih ilegal", "Gubernur ceroboh"],
         1,
         "Benar: 87% populasi AS unik dengan 3 kolom. Hapus nama \u2260 anonim."),
        ("k-anonymity = 5 artinya\u2026",
         ["5 kolom dihapus", "Tiap kombinasi quasi-identifier dimiliki minimal 5 orang", "5% data dibuang", "5 lapis enkripsi"],
         1,
         "Benar: bersembunyi di kerumunan minimal 5. l-diversity menutup celah kerumunan yang homogen."),
        ("Epsilon kecil dalam differential privacy berarti\u2026",
         ["Privasi lemah", "Privasi kuat (noise besar), utilitas turun", "Tidak ada noise", "Komputasi cepat"],
         1,
         "Benar: trade-off fundamental. Epsilon = volume bisikan privasi."),
        ("Keunggulan DP atas k-anonymity?",
         ["Lebih mudah", "Jaminan matematis tahan info latar penyerang apapun", "Tanpa noise", "Gratis"],
         1,
         "Benar: k-anonymity = harapan (bisa jebol dengan info baru); DP = bukti."),
        ("Federated learning tetap butuh persetujuan etik karena\u2026",
         ["Teknisnya sulit", "Data tetap dipakai untuk riset \u2014 arsitektur tidak menggantikan tata kelola", "Server mahal", "Modelnya besar"],
         1,
         "Benar: \u201cdata tidak pindah\u201d \u2260 \u201cprivasi terjamin\u201d (model inversion!) dan \u2260 \u201cbebas etik\u201d."),
        ("Prinsip PERTAMA sebelum proyek data pasien berjalan?",
         ["Pilih model ML", "Tata kelola: persetujuan etik, dasar UU PDP, minimisasi, DUA", "Beli server", "Rekrut analis"],
         1,
         "Benar: kepercayaan publik adalah infrastruktur termahal. Tata kelola dulu, analisis kemudian."),
    ],
    "rangkuman": [
        "<strong>Quasi-identifier</strong> dalam kombinasi = identifier (pelajaran Sweeney).",
        "<strong>k-anonymity</strong>: kerumunan minimal k; <strong>l-diversity</strong>: kerumunan beragam.",
        "<strong>Differential privacy</strong>: jaminan matematis via noise; epsilon kecil = privasi kuat.",
        "<strong>Federated learning</strong>: data diam, model jalan \u2014 tetap butuh DP + etik.",
        "Terapkan <strong>minimisasi</strong> agresif + segregasi akses.",
        "<strong>UU PDP</strong>: dasar hukum, persetujuan, hak subjek, keamanan.",
        "Sel kecil (<5) = bahaya \u2014 supresi/agregasi/DP.",
        "Dokumentasikan keputusan privasi seperti keputusan metode.",
    ],
    "prev": ("hd17-ekonomi-kesehatan", "HD17"),
    "next": ("hd19-pelaporan-klinis", "HD19"),
}

# ================================================================ HD19
HD19 = {
    "slug": "hd19-pelaporan-klinis",
    "code": "HD19",
    "track": TRACK,
    "cover_title": "STROBE &amp; Dashboard Klinis:<br />Melaporkan Sains dengan Benar",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Grafik yang Membunuh Kepercayaan"),
        ("strobe", "STROBE, CONSORT, TRIPOD \u2014 Si Notaris Sains"),
        ("dashboard", "Dashboard untuk Klinisi"),
        ("komunikasi", "Bercerita ke Non-Teknis"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Checklist STROBE Mini"),
        ("lab2", "\U0001f52c Lab 2: Pilih Visualisasi yang Jujur"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan isi kunci <strong>STROBE, CONSORT, TRIPOD(+AI)</strong> dan memilih yang tepat per desain studi.",
        "Merancang <strong>dashboard klinis</strong> yang menjawab keputusan, bukan memamerkan grafik.",
        "Mengomunikasikan temuan statistik ke <strong>audiens non-teknis</strong> (direktur, Kadinkes) tanpa menyesatkan.",
        "Menyusun <strong>laporan reproducible</strong>: kode, data, versi, lingkungan.",
    ],
    "story_title": "Cerita Pembuka: Grafik yang Membunuh Kepercayaan",
    "story": [
        "<p>Analis mempresentasikan ke direktur RS: grafik batang 3D warna-warni menunjukkan \u201cpenurunan kematian 50%\u201d. Direktur terkesan \u2014 sampai dokter senior bertanya: \u201cSumbu Y-nya mulai dari 40%, ya? Dan ini data 2 bulan, bukan setahun?\u201d Ruangan hening. Grafik itu benar secara teknis, menipu secara visual. Kepercayaan direktur ke tim data butuh <strong>2 tahun</strong> untuk pulih.</p>",
        "<p>Analisis terbaik pun mati jika dilaporkan dengan buruk \u2014 atau lebih buruk: dilaporkan dengan menipu. Lesson ini tentang dua keterampilan terakhir analis kesehatan: melaporkan sains dengan standar, dan bercerita dengan jujur.</p>",
    ],
    "konsep": [
        {
            "id": "strobe",
            "title": "STROBE, CONSORT, TRIPOD \u2014 Si Notaris Sains",
            "definisi": "<strong>STROBE</strong>: checklist pelaporan studi observasional. <strong>CONSORT</strong>: untuk RCT (diagram alir peserta wajib). <strong>TRIPOD(+AI)</strong>: untuk model prediksi (lihat HD12). Intinya sama: <strong>laporkan cukup detail hingga orang lain bisa menilai dan mengulang</strong>.",
            "kepribadian": "Checklist ini seperti notaris: membosankan, tapi tanpanya tidak ada yang percaya transaksimu sah. Jurnal top menolak naskah yang tidak mengikutinya \u2014 bukan karena birokrasi, tapi karena terlalu banyak sains buruk lolos tanpa mereka.",
            "kapan": "Setiap laporan studi: observasional \u2192 STROBE; trial \u2192 CONSORT; model prediksi \u2192 TRIPOD. Untuk internal RS: versi ringkasnya tetap berguna.",
            "worked": (
                "\U0001f4d0 Contoh: 5 item STROBE yang paling sering dilanggar",
                "<p>1. <strong>Desain</strong> disebut eksplisit di judul/abstrak (bukan disembunyikan).<br />"
                "2. <strong>Eligibility & rekrutmen</strong>: siapa masuk/keluar, berapa yang hilang di tiap tahap (flow diagram).<br />"
                "3. <strong>Definisi variabel</strong>: outcome/paparan/confounder didefinisikan operasional (lihat HD11 fenotipe!).<br />"
                "4. <strong>Bias</strong>: upaya mengatasi + keterbatasan yang diakui.<br />"
                "5. <strong>Missing data</strong>: berapa % per variabel + cara penanganan (lihat HD8).<br />"
                "Lima ini = 80% pertanyaan reviewer. Jawab sebelum ditanya.</p>",
            ),
            "chart": {
                "var": "hd19CheckData",
                "data": [{"x": ["Desain eksplisit", "Flow peserta", "Definisi variabel", "Bahasa bias", "Missing data", "Generalisasi"], "y": [45, 38, 52, 70, 63, 58], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "38%", "52%", "70%", "63%", "58%"], "textposition": "outside"}],
                "title": "% Laporan yang Melewatkan Item STROBE Kunci (ilustratif, review literatur)",
                "layout": {"xaxis": {"title": "Item STROBE"}, "yaxis": {"title": "% laporan bermasalah", "range": [0, 85]}, "showlegend": False},
                "cara": "Batang = persen laporan observasional yang bermasalah pada tiap item checklist.",
                "interpretasi": "70% tidak membahas bias; 63% diam soal missing data. Artinya: mayoritas laporan gagal di hal yang justru menentukan kepercayaan. Checklist bukan formalitas \u2014 ia adalah tempat sebagian besar sains buruk bersembunyi.",
            },
        },
        {
            "id": "dashboard",
            "title": "Dashboard untuk Klinisi \u2014 Si Asisten Visite",
            "definisi": "Dashboard klinis yang baik: <strong>satu layar, satu keputusan</strong>. Menjawab \u201capa yang harus kulakukan?\u201d \u2014 bukan \u201cdata apa yang ada?\u201d Prinsip: hierarki (ringkasan \u2192 detail), alert yang bisa ditindaklanjuti, dan konteks (pembanding, tren).",
            "kepribadian": "Dashboard yang baik itu seperti asisten visite yang berbisik: \u201cDok, 3 pasien ini memburuk \u2014 yang ini paling mendesak karena\u2026\u201d Dashboard yang buruk itu seperti arsiparis yang menumpuk 50 grafik di meja dokter dan berkata \u201csilakan cari sendiri\u201d.",
            "kapan": "Monitoring operasional (BOR, antrean), kualitas (readmission, infeksi), program (cakupan imunisasi). Desain bersama penggunanya \u2014 bukan untuk mereka.",
            "worked": (
                "\U0001f4d0 Contoh: dashboard sepsis IGD yang dipakai",
                "<p><strong>Atas:</strong> 3 angka besar \u2014 pasien berisiko saat ini, median time-to-antibiotik, kepatuhan bundle.<br />"
                "<strong>Tengah:</strong> daftar pasien terurut risiko + alasan (SHAP ringkas) + tombol aksi.<br />"
                "<strong>Bawah:</strong> tren 30 hari + perbandingan shift.<br />"
                "<strong>Yang dibuang:</strong> 12 grafik \u201cmenarik\u201d yang tidak mengubah tindakan. Uji: observasi 5 dokter memakai 1 minggu \u2014 yang tidak diklik, dihapus.</p>",
            ),
            "warning": "<strong>Alert fatigue</strong> (lihat HD12): alert yang 90% false positive akan diabaikan \u2014 termasuk yang 10% benar. Setiap alert harus: akurat, tepat waktu, dan punya aksi jelas. Kurangi alert, bukan tambah.",
        },
        {
            "id": "komunikasi",
            "title": "Bercerita ke Non-Teknis \u2014 Si Penerjemah Terakhir",
            "definisi": "Komunikasi temuan ke direktur/Kadinkes/publik: <strong>pesan dulu, metode kemudian</strong>; angka absolut (bukan relatif); visual jujur (sumbu dari nol untuk batang); ketidakpastian dinyatakan eksplisit.",
            "rumus": r"\text{Kepercayaan} = \frac{\text{kejujuran tentang ketidakpastian}}{\text{kompleksitas penyajian}}",
            "simbol": [
                (r"\text{kejujuran tentang ketidakpastian}", "interval, keterbatasan, \u201cyang belum kami tahu\u201d"),
            ],
            "interpretasi": "Rumus konseptual: kepercayaan naik saat kamu jujur soal batas analisismu, dan turun saat penyajianmu pamer kompleksitas. \u201cKami 95% yakin efeknya antara 10\u201330%\u201d lebih dipercaya dari \u201cpasti 22,4%\u201d.",
            "worked": (
                "\U0001f4d0 Contoh: menyampaikan NNT ke Kadinkes",
                "<p><strong>Buruk:</strong> \u201cIntervensi menunjukkan RRR 50% dengan p<0,001 pada model Cox multivariabel.\u201d<br />"
                "<strong>Baik:</strong> \u201cDari 100 anak yang divaksin, 2 terhindar dari campak berat. Biayanya Rp5 juta per anak yang terlindungi. Angka ini bisa bergeser 1\u20133 tergantung cakupan.\u201d<br />"
                "Yang kedua: absolut, ada biaya, ada ketidakpastian \u2014 dan bisa dipakai memutuskan.</p>",
            ),
            "kepribadian": "Penerjemah yang baik tidak menerjemahkan kata per kata (p-value, hazard ratio) \u2014 ia menerjemahkan <em>makna keputusan</em>. Kadinkes tidak butuh tahu Cox; ia butuh tahu \u201cberapa anak, berapa rupiah, seberapa yakin\u201d.",
            "kapan": "Setiap presentasi ke non-teknis: 1 pesan utama per slide, visual jujur, rekomendasi eksplisit dengan caveat.",
        },
    ],
    "myths": [
        ("Laporan yang baik = laporan yang lengkap (semua analisis ditampilkan)",
         "Lengkap \u2260 baik. Laporan yang baik = <strong>lengkap tentang yang penting, jujur tentang keterbatasan</strong>. Menampilkan 30 analisis sensitivitas tanpa hierarki = menyembunyikan pesan. Kurasi adalah bagian dari kejujuran."),
        ("Visualisasi yang menarik = visualisasi yang baik",
         "3D, gradien, dan animasi sering <em>mengurangi</em> akurasi baca. Kebaikan visual diukur dari: seberapa cepat dan tepat audiens menangkap pesan yang benar. Uji dengan 5 orang \u2014 bukan dengan selera desainer."),
        ("Ketidakpastian membuat kita terlihat tidak kompeten",
         "Sebaliknya: menyembunyikan ketidakpastian yang lalu terbukti salah = menghancurkan kepercayaan permanen (cerita pembuka). \u201cKami belum tahu X\u201d adalah kalimat profesional, bukan pengakuan kalah."),
    ],
    "tips": [
        "Untuk tiap grafik, tulis <strong>satu kalimat pesan</strong> sebagai judul (\u201cKematian turun setelah program, terutama di wilayah timur\u201d) \u2014 bukan \u201cGrafik kematian 2020\u20132026\u201d. Judul adalah pesanmu.",
        "Simpan <strong>jejak reproducible</strong>: kode + versi data + seed + lingkungan dalam repo. \u201cAngka ini dari mana?\u201d harus terjawab dalam 5 menit, kapan pun.",
        "Akhiri setiap laporan dengan <strong>\u201capa yang belum kami tahu\u201d</strong> (3 bullet). Ini bukan kelemahan \u2014 ini peta jalan riset berikutnya dan tameng dari overclaim.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Audit Laporan dengan Checklist Mini",
            "intro": "Diberikan ringkasan laporan fiktif, nilai 8 item checklist (STROBE ringkas). Lihat berapa yang gagal \u2014 dan tulis perbaikannya.",
            "hint": "Pola umum: laporan internal gagal di bias, missing data, dan generalisasi. Tiga ini = tiga pertanyaan yang harus kamu jawab SEBELUM presentasi.",
            "code": (
                "laporan = \"\"\"Studi: program diet menurunkan berat 5kg (n=2000, p<0.001).\n"
                "Metode: data aplikasi, 12 minggu. Hasil: rata-rata turun 5kg.\n"
                "Kesimpulan: program efektif.\"\"\"\n"
                "checklist = [\n"
                "    ('Desain disebut eksplisit?', 'TIDAK -> observasional tanpa kontrol'),\n"
                "    ('Eligibility & flow peserta?', 'TIDAK -> berapa drop-out?'),\n"
                "    ('Definisi outcome?', 'KURANG -> berat self-report?'),\n"
                "    ('Bias dibahas?', 'TIDAK -> seleksi, confounding'),\n"
                "    ('Missing data?', 'TIDAK -> 40% berhenti nimbang?'),\n"
                "    ('Analisis sesuai desain?', 'TIDAK -> uji-t naif, abaikan klaster'),\n"
                "    ('Keterbatasan diakui?', 'TIDAK'),\n"
                "    ('Generalisasi?', 'TIDAK -> pengguna aplikasi != populasi'),\n"
                "]\n"
                "gagal = sum(1 for _, v in checklist if v.startswith('TIDAK'))\n"
                "for item, nilai in checklist:\n"
                "    print(f'[{\"X\" if nilai.startswith(\"TIDAK\") else \"?\"}] {item} {nilai}')\n"
                "print(f'\\nGagal {gagal}/8 item. Laporan seperti ini = siaran pers, bukan sains.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Sumbu Menipu \u2014 Lihat Bedanya",
            "intro": "Plot mental: dua \u201cversi\u201d grafik batang yang sama (sumbu dari 0 vs dari 40). Hitung rasio visual vs rasio data \u2014 kuantifikasi kebohongan.",
            "hint": "Rasio visual = tinggi batang relatif pada sumbu yang dipakai. Inilah kenapa aturan \u201cbatang dari nol\u201d ada: batang = perbandingan visual tinggi.",
            "code": (
                "a, b = 42, 48  # dua nilai: turun/naik 6 poin\n"
                "rasio_data = b/a\n"
                "# tinggi visual bila sumbu mulai dari 40\n"
                "visual_menipu = (b-40)/(a-40)\n"
                "print(f'data: {a} vs {b} -> rasio sebenarnya {rasio_data:.2f}x')\n"
                "print(f'sumbu dari 40: batang terlihat {visual_menipu:.1f}x lipat!')\n"
                "print(f'Pembesaran visual: {visual_menipu/rasio_data:.1f}x dari realita')\n"
                "print()\n"
                "print('Aturan: bar chart SELALU dari nol.')\n"
                "print('Pengecualian (line chart zoom) -> beri anotasi JELAS.')\n"
                "print('Prinsip: jangan biarkan grafik berkata lebih dari data.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Laporan studi observasional \u2192 STROBE",
            "kondisi": "Desain kohort/case-control/cross-sectional.",
            "alasan": "Standar jurnal; menjawab pertanyaan reviewer duluan.",
            "contoh": "Laporan faktor risiko TB ke jurnal nasional.",
        },
        {
            "title": "Laporan trial \u2192 CONSORT (+ diagram alir)",
            "kondisi": "RCT.",
            "alasan": "Transparansi alur peserta = kredibilitas.",
            "contoh": "Laporan uji vaksin DBD.",
        },
        {
            "title": "Laporan model prediksi \u2192 TRIPOD(+AI)",
            "kondisi": "Model klinis.",
            "alasan": "Populasi, prediktor, validasi, performa terdokumentasi.",
            "contoh": "Laporan model readmission (lihat HD20).",
        },
        {
            "title": "Dashboard operasional \u2192 Satu layar, satu keputusan",
            "kondisi": "Dipakai harian oleh klinisi/manajer.",
            "alasan": "Adopsi = fungsi kegunaan, bukan keindahan.",
            "contoh": "Dashboard BOR + antrean IGD untuk direktur.",
            "chart": {
                "var": "hd19DashData",
                "data": [{"x": ["Kematian", "Readmission", "Kepuasan"], "y": [42, 48, 85], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Versi menipu (sumbu 40)", "text": ["42%", "48%", "85%"], "textposition": "outside"}],
                "title": "Contoh Visual Menipu: Sumbu Tidak dari Nol",
                "layout": {"xaxis": {"title": ""}, "yaxis": {"title": "%", "range": [40, 90]}, "showlegend": False},
                "cara": "Perhatikan sumbu Y: mulai dari 40, bukan 0. Bandingkan tinggi batang \u201ckematian\u201d vs \u201creadmission\u201d.",
                "interpretasi": "Batang readmission terlihat 4x batang kematian \u2014 padahal 48 vs 42 (hanya 14% lebih tinggi). Inilah kebohongan visual dari cerita pembuka. Aturan: bar chart dari nol, atau jangan pakai batang.",
            },
        },
    ],
    "aturan10": [
        "Pilih checklist sesuai desain (STROBE/CONSORT/TRIPOD).",
        "Judul grafik = satu kalimat pesan.",
        "Batang dari nol; ketidakpastian selalu tampil.",
        "Akhiri dengan \u201capa yang belum kami tahu\u201d.",
    ],
    "case": {
        "title": "Laporan ke Gubernur: \u201cStunting Turun 5%!\u201d",
        "body": [
            "<p>Tim menyusun laporan: prevalensi stunting turun dari 30% ke 25% dalam 2 tahun. Slide penuh grafik 3D. Gubernur senang. Kamu diminta review 1 jam sebelum presentasi.</p>",
            "<p>Temuanmu: (1) definisi stunting berubah (standar WHO baru vs lama); (2) sampel survei tahun ke-2 hanya perkotaan; (3) interval kepercayaan tidak ditampilkan; (4) tidak ada pembanding tren nasional.</p>",
        ],
        "pertanyaan": "Apa yang kamu lakukan dalam 1 jam itu?",
        "pembahasan": "Tahan klaim \u201cturun 5%\u201d. (1) Samakan definisi dulu \u2014 hitung ulang tahun 1 dengan standar baru (atau sebaliknya); tanpa ini, perbandingan tidak valid. (2) Selaraskan sampel: bandingkan perkotaan-vs-perkotaan saja, atau beri bobot. (3) Tambahkan CI: 30% (28\u201332) vs 25% (22\u201328) \u2014 overlap = \u201cbelum tentu turun\u201d. (4) Sederhanakan visual: satu grafik garis jujur > 10 grafik 3D. Sampaikan ke Gubernur: \u201cAngka pastinya belum bisa diklaim turun; yang bisa kami katakan...\u201d + rencana pengukuran yang benar. Lebih baik menunda klaim 1 bulan daripada menarik kembali klaim 1 tahun. Inilah harga dan nilai kejujuran analis.",
    },
    "quiz": [
        ("Untuk studi case-control yang dilaporkan ke jurnal, checklist yang tepat?",
         ["CONSORT", "STROBE", "TRIPOD", "Tidak perlu"],
         1,
         "Benar: STROBE = observasional. CONSORT untuk RCT, TRIPOD untuk model prediksi."),
        ("Diagram alir peserta (flow diagram) wajib dalam\u2026",
         ["Semua laporan", "CONSORT (RCT) \u2014 tapi praktik baik untuk semua desain", "Hanya dashboard", "Tidak pernah"],
         1,
         "Benar: CONSORT mewajibkan. Prinsipnya universal: tunjukkan siapa hilang di tiap tahap."),
        ("Judul grafik yang baik?",
         ["Grafik kematian 2020\u20132026", "\u201cKematian turun setelah program, terutama di timur\u201d (satu kalimat pesan)", "Data", "Gambar 1"],
         1,
         "Benar: judul = pesanmu. Pembaca yang hanya baca judul tetap dapat intinya."),
        ("Bar chart dengan sumbu Y mulai dari 40% adalah\u2026",
         ["Kreatif", "Menipu secara visual \u2014 batang menyiratkan perbandingan dari nol", "Standar", "Wajib"],
         1,
         "Benar: tinggi batang dibaca sebagai rasio. Dari nol, atau pakai line chart dengan anotasi."),
        ("Mengakhiri laporan dengan \u201capa yang belum kami tahu\u201d berguna untuk\u2026",
         ["Terlihat lemah", "Kejujuran + peta riset lanjutan + tameng overclaim", "Memperpanjang laporan", "Tidak ada"],
         1,
         "Benar: profesional mengakui batas. Ini membangun kepercayaan jangka panjang."),
        ("Reproducibility laporan berarti\u2026",
         ["PDF yang rapi", "\u201cAngka ini dari mana?\u201d terjawab dalam 5 menit: kode + versi data + seed + lingkungan", "Banyak lampiran", "Ditandatangani"],
         1,
         "Benar: jejak yang bisa diulang. Tanpa ini, angka tidak bisa diaudit \u2014 dan yang tidak bisa diaudit tidak bisa dipercaya."),
    ],
    "rangkuman": [
        "<strong>STROBE</strong> (observasional), <strong>CONSORT</strong> (RCT), <strong>TRIPOD(+AI)</strong> (model) \u2014 pilih sesuai desain.",
        "Lima item yang paling sering gagal: desain eksplisit, flow peserta, definisi variabel, bias, missing data.",
        "Dashboard: <strong>satu layar, satu keputusan</strong>; desain bersama pengguna; waspadai alert fatigue.",
        "Komunikasi: pesan dulu, angka absolut, visual jujur, ketidakpastian eksplisit.",
        "Judul grafik = <strong>satu kalimat pesan</strong>. Batang dari nol.",
        "Akhiri dengan <strong>\u201capa yang belum kami tahu\u201d</strong>.",
        "Reproducible: kode + versi data + seed + lingkungan.",
        "Kepercayaan = kejujuran tentang ketidakpastian dibagi kompleksitas penyajian.",
    ],
    "prev": ("hd18-privasi-etika", "HD18"),
    "next": ("hd20-capstone-readmission", "HD20"),
}

# ================================================================ HD20 (capstone)
HD20 = {
    "slug": "hd20-capstone-readmission",
    "code": "HD20",
    "track": TRACK,
    "cover_title": "Capstone:<br />Model Risiko Readmission End-to-End",
    "meta": "60\u201390 menit \u2022 proyek terbimbing \u2022 4 quiz \u2022 laporan TRIPOD",
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Brief dari Direktur"),
        ("tahap1", "Tahap 1 \u2014 Definisi &amp; Fenotipe"),
        ("tahap2", "Tahap 2 \u2014 Wrangling &amp; Leakage Check"),
        ("tahap3", "Tahap 3 \u2014 Model, Kalibrasi &amp; Fairness"),
        ("tahap4", "Tahap 4 \u2014 Laporan TRIPOD &amp; Presentasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Pipeline Fitur Readmission"),
        ("lab2", "\U0001f52c Lab 2: Audit Fairness &amp; Kalibrasi Model"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Merancang <strong>proyek analitik kesehatan end-to-end</strong>: dari brief sampai laporan.",
        "Menerapkan <strong>fenotipe, cegah leakage, kalibrasi, validasi temporal, audit fairness</strong> dalam satu pipeline.",
        "Menulis <strong>laporan sesuai TRIPOD</strong> + presentasi untuk direktur non-teknis.",
        "Mengintegrasikan seluruh track HD1\u2013HD19 menjadi satu deliverable portofolio.",
    ],
    "story_title": "Cerita Pembuka: Brief dari Direktur",
    "story": [
        "<p>Email Senin pagi: \u201cTim Data, readmission 30-hari kita 18% \u2014 di atas rata-rata nasional 14%. Direksi minta <strong>model prediksi readmission</strong> agar perawat bisa intervensi dini. Deadline 1 bulan. Budget: akses EHR 3 tahun. Tolong presentasikan ke direksi.\u201d</p>",
        "<p>Ini capstone-mu: semua lesson HD1\u2013HD19 dipakai sekaligus. Tidak ada jawaban tunggal yang benar \u2014 yang dinilai adalah <strong>proses yang defensibel</strong>: definisi yang jelas, leakage yang dicegah, kalibrasi yang jujur, fairness yang diaudit, dan laporan yang bisa dipertanggungjawabkan.</p>",
    ],
    "konsep": [
        {
            "id": "tahap1",
            "title": "Tahap 1 \u2014 Definisi &amp; Fenotipe (Minggu 1)",
            "definisi": "Tetapkan: <strong>outcome</strong> (readmission tak terencana <30 hari pasca-pulang), <strong>populasi</strong> (dewasa, rawat inap \u226524 jam, eksklusi meninggal/pindah), <strong>prediction time</strong> (saat discharge), dan <strong>fenotipe kovariat</strong> (komorbid via HD11).",
            "kepribadian": "Tahap ini seperti membuat kontrak sebelum bangun rumah: mahal di awal (diskusi klinisi 1 minggu), murah di akhir (tidak ada bongkar pasang definisi).",
            "kapan": "Selalu mulai di sini. Model yang dibangun di atas definisi kabur = istana pasir.",
            "worked": (
                "\U0001f4d0 Contoh: keputusan definisi kunci",
                "<p><strong>Readmission terencana</strong> (kemoterapi terjadwal) \u2192 eksklusi (bukan kegagalan kualitas).<br />"
                "<strong>Meninggal <30 hari tanpa readmit</strong> \u2192 competing risk (HD6): analisis sensitivitas.<br />"
                "<strong>Prediction time</strong> = jam discharge: fitur hanya yang tersedia SEBELUM itu (cegah leakage, HD11).<br />"
                "Dokumentasikan semua dalam <strong>protokol 2 halaman</strong> ditandatangani klinisi.</p>",
            ),
            "chart": {
                "var": "hd20FlowData",
                "data": [{"x": ["Rawat inap", "Eksklusi: <24 jam", "Eksklusi: meninggal", "Eksklusi: terencana", "Kohort final"], "y": [50000, 42000, 40500, 38000, 38000], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["50.000", "42.000", "40.500", "38.000", "38.000"], "textposition": "outside"}],
                "title": "Flow Kohort: Dari 50.000 ke 38.000 (CONSORT-style)",
                "layout": {"xaxis": {"title": "Tahap"}, "yaxis": {"title": "n"}, "showlegend": False},
                "cara": "Batang menyusut di tiap kriteria eksklusi. Inilah flow diagram yang wajib ada di laporan.",
                "interpretasi": "24% data terekslusi dengan alasan terdokumentasi. Flow seperti ini = transparansi; tanpanya, reviewer curiga kamu membuang yang tidak cocok. Setiap eksklusi harus bisa dipertahankan di depan klinisi.",
            },
        },
        {
            "id": "tahap2",
            "title": "Tahap 2 \u2014 Wrangling &amp; Leakage Check (Minggu 2)",
            "definisi": "Bangun fitur dari EHR (demografi, komorbid, lab terakhir, LOS, riwayat kunjungan), tangani missing (MICE, HD8), harmonisasi unit (HD11), lalu <strong>audit leakage</strong>: pastikan tak ada fitur dari masa depan.",
            "rumus": r"\text{Fitur valid} \iff t_{fitur} < t_{prediction} \quad \forall \text{ fitur}",
            "simbol": [
                (r"t_{fitur}", "waktu ketersediaan fitur"),
                (r"t_{prediction}", "waktu prediksi (discharge)"),
            ],
            "interpretasi": "Satu fitur bocor (mis. \u201cobat pasca-pulang\u201d) bisa menggelembungkan AUC 0,75 \u2192 0,95. Audit ini bukan opsional.",
            "worked": (
                "\U0001f4d0 Contoh: leakage yang tertangkap",
                "<p>Fitur \u201cjumlah diagnosis saat readmission\u201d lolos ke training \u2014 AUC 0,93! Audit: diagnosis itu dicatat <em>saat readmit</em> (masa depan relatif terhadap discharge).<br />"
                "Setelah dibuang: AUC 0,76 \u2014 jujur dan masih berguna.<br />"
                "<strong>Prosedur audit:</strong> untuk tiap fitur, tulis t_ketersediaan; uji ablasi (buang fitur top, lihat AUC anjlok tidak wajar).</p>",
            ),
            "kepribadian": "Tahap ini seperti sterilisasi alat operasi: membosankan, tak terlihat, tapi satu keteledoran = infeksi (leakage) yang membunuh kredibilitas.",
            "kapan": "Sebelum modeling apapun. Leakage check adalah gerbang, bukan hiasan.",
        },
        {
            "id": "tahap3",
            "title": "Tahap 3 \u2014 Model, Kalibrasi &amp; Fairness (Minggu 3)",
            "definisi": "Latih model (regresi logistik baseline + gradient boosting), split <strong>temporal</strong> (2023\u20132024 train, 2025 test), evaluasi: <strong>AUC + kalibrasi + decision curve</strong> (HD12), lalu <strong>audit fairness per grup</strong> (HD13: wilayah, usia, pembiayaan).",
            "kepribadian": "Tahap ini seperti ujian tiga mata: pintar (AUC), jujur (kalibrasi), adil (fairness). Lulus dua saja = tidak lulus.",
            "kapan": "Urutan evaluasi: diskriminasi \u2192 kalibrasi \u2192 utilitas \u2192 fairness. Jangan optimasi threshold sebelum kalibrasi benar.",
            "worked": (
                "\U0001f4d0 Contoh: hasil evaluasi lengkap",
                "<p>AUC temporal 0,78. Calibration slope 0,92 (sedikit overfit, rekalibrasi isotonic \u2192 0,99).<br />"
                "Decision curve: net benefit positif pada threshold 15\u201340% (rentang operasional perawat).<br />"
                "<strong>Fairness:</strong> TPR pasien BPJS 72% vs asuransi swasta 81% \u2014 disparitas 9 poin. Akar: fitur \u201ckunjungan kontrol\u201d bias ke swasta (informed presence). Mitigasi: threshold per grup + tambah fitur klinis murni.<br />"
                "Keputusan: deploy dengan threshold 25% + monitoring bulanan.</p>",
            ),
            "chart": {
                "var": "hd20EvalData",
                "data": [{"x": ["AUC", "Cal. slope", "Net benefit", "TPR gap"], "y": [0.78, 0.99, 1, 0], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#2a7de1", "#2a7de1"]}, "text": ["0,78", "0,99", "positif", "9\u21922%"], "textposition": "outside"}],
                "title": "Ringkasan Evaluasi: Empat Lensa",
                "layout": {"xaxis": {"title": "Metrik"}, "yaxis": {"title": "Nilai", "range": [0, 1.2]}, "showlegend": False},
                "cara": "Empat metrik kunci: diskriminasi, kalibrasi, utilitas, fairness (gap TPR sebelum\u2192sesudah mitigasi).",
                "interpretasi": "Model \u201ccukup pintar\u201d (0,78), terkalibrasi (0,99), berguna (net benefit positif), dan disparitas terpangkas 9%\u21922%. Inilah laporan yang membuat direksi percaya: bukan satu angka, tapi empat lensa.",
            },
        },
        {
            "id": "tahap4",
            "title": "Tahap 4 \u2014 Laporan TRIPOD &amp; Presentasi (Minggu 4)",
            "definisi": "Tulis laporan <strong>TRIPOD</strong> (populasi, prediktor, outcome, validasi, performa, keterbatasan) + <strong>slide direksi</strong> (1 pesan per slide, angka absolut, rekomendasi + caveat) + repo reproducible.",
            "kepribadian": "Tahap ini seperti sidang skripsi + pitching investor digabung: reviewer menilai ketelitianmu, direksi menilai kegunaanmu. Keduanya harus puas dengan dokumen yang sama.",
            "kapan": "Deliverable akhir: laporan + slide + repo + rencana monitoring (drift dashboard bulanan, HD12).",
            "worked": (
                "\U0001f4d0 Contoh: slide 1 untuk direksi",
                "<p><strong>Judul:</strong> \u201cModel menemukan 7 dari 10 pasien berisiko readmit \u2014 menghemat ~Rp3 M/tahun\u201d<br />"
                "<strong>Isi:</strong> Dari 100 pasien risiko tinggi, 35 benar-benar readmit (PPV 35%); intervensi perawat (telepon + kunjungan) mencegah ~30% di antaranya; biaya intervensi Rp50jt/bulan vs penghematan Rp250jt/bulan.<br />"
                "<strong>Caveat jujur:</strong> angka dari validasi 2025 satu RS; butuh monitoring; disparitas BPJS terpantau.<br />"
                "Inilah HD19 dalam aksi: absolut, ada biaya, ada ketidakpastian.</p>",
            ),
            "callout": "<strong>Checklist serah terima:</strong> (1) laporan TRIPOD; (2) repo reproducible (kode+versi data+seed); (3) dashboard monitoring (AUC, kalibrasi, fairness per grup, bulanan); (4) SOP: siapa bertindak saat alert drift; (5) jadwal review 6 bulanan dengan klinisi.",
        },
    ],
    "myths": [
        ("Capstone = dapat AUC tertinggi",
         "Capstone dinilai dari <strong>proses defensibel</strong>: definisi jelas, leakage dicegah, kalibrasi jujur, fairness diaudit, laporan transparan. AUC 0,76 yang jujur > AUC 0,93 yang bocor. Di dunia nyata, yang kedua dipecat setelah audit."),
        ("Satu model untuk semua RS",
         "Model ini valid untuk SATU RS, periode tertentu. Klaim generalisasi butuh validasi eksternal (HD12). Tulis batas ini eksplisit \u2014 itu kekuatan, bukan kelemahan."),
        ("Setelah deploy, proyek selesai",
         "Deploy adalah <em>tengah</em> proyek, bukan akhir. Drift, perubahan protokol, dan EHR baru akan menggerogoti performa. Tanpa monitoring + owner yang jelas, model menjadi fosil dalam 1\u20132 tahun."),
    ],
    "tips": [
        "Kerjakan <strong>berurutan tahap 1\u21924</strong>; jangan loncat ke modeling sebelum definisi dikunci. 80% kegagalan proyek analitik lahir di tahap 1\u20132.",
        "Simpan <strong>decision log</strong>: tiap keputusan penting (definisi, eksklusi, threshold) + alasan + tanggal. Ini yang ditanya direksi 6 bulan kemudian.",
        "Presentasikan <strong>kegagalan</strong> juga (leakage yang tertangkap, disparitas awal). Kejujuran tentang proses = kredibilitas tertinggi.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Pipeline Fitur Readmission (Simulasi)",
            "intro": "Bangkitkan kohort sintetis (n=5.000): usia, komorbid, LOS, lab. Terapkan aturan: fitur hanya dari sebelum discharge; bangun skor sederhana; ukur AUC kasar.",
            "hint": "Coba tambahkan fitur bocor (\u2018obat_pasca_pulang\u2019 yang korelasi dengan outcome). Lihat AUC melonjak \u2014 lalu buang dan rasakan AUC jujur.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(100)\n"
                "n = 5000\n"
                "data = []\n"
                "for _ in range(n):\n"
                "    usia = random.gauss(60, 15)\n"
                "    komorbid = random.randint(0, 5)\n"
                "    los = max(1, random.gauss(6, 3))\n"
                "    # risiko sebenarnya (logit)\n"
                "    logit = -3 + 0.03*usia + 0.4*komorbid + 0.1*los\n"
                "    p = 1/(1+2.718**(-logit))\n"
                "    readmit = random.random() < p\n"
                "    data.append((usia, komorbid, los, readmit))\n"
                "# skor sederhana (bobot asal, untuk demo pipeline)\n"
                "skor = [0.03*u + 0.4*k + 0.1*l for u, k, l, _ in data]\n"
                "y = [r for *_, r in data]\n"
                "# AUC kasar via Mann-Whitney\n"
                "pos = [s for s, yy in zip(skor, y) if yy]\n"
                "neg = [s for s, yy in zip(skor, y) if not yy]\n"
                "auc = sum(1 for a in pos for b in neg if a > b)/len(pos)/len(neg)\n"
                "print(f'n={n}, readmission rate={sum(y)/n:.1%}')\n"
                "print(f'AUC skor sederhana = {auc:.2f}')\n"
                "print()\n"
                "print('Pipeline: definisi -> fitur pre-discharge -> missing -> model -> evaluasi.')\n"
                "print('Di proyek nyata: ganti skor ini dengan logistic/GBM + validasi temporal.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Audit Kalibrasi &amp; Fairness Model",
            "intro": "Diberikan prediksi dan outcome per grup, hitung calibration-in-the-large per grup + disparitas TPR. Tentukan: lolos deploy atau perlu mitigasi?",
            "hint": "Kriteria lolos: |rata prediksi \u2212 rate aktual| < 3% per grup DAN disparitas TPR < 5%. Berapa grup yang gagal? Itulah backlog mitigasimu.",
            "code": (
                "import random\n"
                "random.seed(101)\n"
                "# (grup, prediksi, outcome)\n"
                "data = []\n"
                "for _ in range(3000):\n"
                "    bpjs = random.random() < 0.6\n"
                "    p_true = random.random()*0.3 + 0.05\n"
                "    pred = p_true + (0.04 if bpjs else -0.02)  # miskalibrasi per grup\n"
                "    y = random.random() < p_true\n"
                "    data.append((bpjs, min(0.99, max(0.01, pred)), y))\n"
                "print(f\"{'grup':<8} {'rata_pred':>9} {'rate_aktual':>11} {'gap':>6}\")\n"
                "for bpjs, nama in [(True, 'BPJS'), (False, 'swasta')]:\n"
                "    g = [d for d in data if d[0] == bpjs]\n"
                "    rp = sum(d[1] for d in g)/len(g); ra = sum(d[2] for d in g)/len(g)\n"
                "    print(f'{nama:<8} {rp:>9.1%} {ra:>11.1%} {abs(rp-ra):>5.1%}')\n"
                "print()\n"
                "print('BPJS: prediksi sistematis lebih tinggi dari realita (overestimate).')\n"
                "print('-> Rekalibrasi per grup sebelum deploy. Jangan rata-ratakan masalahnya.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Mulai proyek \u2192 Kunci definisi + prediction time",
            "kondisi": "Selalu, tanpa kecuali.",
            "alasan": "Fondasi semua tahap berikutnya.",
            "contoh": "Protokol 2 halaman ditandatangani klinisi.",
        },
        {
            "title": "Pilih fitur \u2192 Audit t_ketersediaan per fitur",
            "kondisi": "Sebelum modeling.",
            "alasan": "Satu leakage merusak segalanya.",
            "contoh": "Buang fitur pasca-discharge; uji ablasi.",
        },
        {
            "title": "Evaluasi \u2192 Empat lensa (AUC, kalibrasi, utilitas, fairness)",
            "kondisi": "Sebelum klaim apapun.",
            "alasan": "Satu lensa = buta tiga sisi.",
            "contoh": "Decision curve + audit TPR per grup.",
        },
        {
            "title": "Serah terima \u2192 TRIPOD + monitoring + owner",
            "kondisi": "Deploy.",
            "alasan": "Model tanpa monitoring = fosil.",
            "contoh": "Dashboard bulanan + SOP drift + review 6 bulanan.",
        },
    ],
    "aturan10": [
        "Definisi dulu, model kemudian.",
        "Leakage check = gerbang wajib.",
        "Empat lensa evaluasi, selalu.",
        "Deploy = tengah proyek, bukan akhir.",
    ],
    "case": {
        "title": "Direksi Minta Threshold 10% (\u201cTangkap Semua!\u201d)",
        "body": [
            "<p>Model readmission siap. Direksi: \u201cSet threshold 10% \u2014 tangkap semua yang berisiko!\u201d Pada threshold 10%: sensitivitas 90%, PPV 12%. Kapasitas perawat: 50 intervensi/bulan. Pasien risiko >10%: 400/bulan.</p>",
        ],
        "pertanyaan": "Apa masalahnya dan apa rekomendasi threshold-mu?",
        "pembahasan": "400 pasien > kapasitas 50 = 350 tidak terintervensi + alert fatigue (88% false positive \u2192 perawat berhenti percaya). Rekomendasi: threshold 25% \u2192 ~60 pasien/bulan (sesuai kapasitas), PPV 35%, sensitivitas 65%. Jelaskan trade-off dengan decision curve: pada kapasitas terbatas, <strong>presisi mengalahkan recall</strong> \u2014 50 intervensi tepat sasaran > 400 alarm yang diabaikan. Tawarkan bertahap: mulai 25%, tambah perawat bila terbukti hemat, baru turunkan threshold. Pelajaran capstone: model terbaik pun gagal bila threshold buta operasional.",
    },
    "quiz": [
        ("Langkah PERTAMA proyek model klinis yang benar?",
         ["Pilih algoritma ML", "Kunci definisi outcome/populasi/prediction time bersama klinisi", "Kumpulkan semua fitur", "Tuning hyperparameter"],
         1,
         "Benar: kontrak definisi dulu. 80% kegagalan lahir di tahap 1\u20132, bukan di modeling."),
        ("Fitur \u201cjumlah diagnosis saat readmission\u201d untuk prediksi saat discharge adalah\u2026",
         ["Fitur terbaik", "Target leakage \u2014 dari masa depan relatif terhadap prediction time", "Wajib dipakai", "Netral"],
         1,
         "Benar: t_fitur > t_prediction. Audit ketersediaan per fitur adalah gerbang wajib."),
        ("Urutan evaluasi model klinis yang benar?",
         ["AUC saja cukup", "Diskriminasi \u2192 kalibrasi \u2192 utilitas (decision curve) \u2192 fairness", "Fairness dulu", "Tergantung mood"],
         1,
         "Benar: empat lensa berurutan. Satu lensa = buta tiga sisi."),
        ("Disparitas TPR 9 poin antar grup pembiayaan ditemukan. Tindakan?",
         ["Sembunyikan", "Investigasi akar (fitur bias), mitigasi (threshold per grup/fitur adil), laporkan transparan", "Hapus grup minoritas", "Naikkan threshold global"],
         1,
         "Benar: audit \u2192 mitigasi \u2192 lapor. Fairness adalah bagian deliverable, bukan lampiran."),
        ("Setelah deploy, yang WAJIB ada?",
         ["Tidak ada, proyek selesai", "Monitoring drift berkala + owner + SOP + jadwal review klinisi", "Hapus kode lama", "Lupakan"],
         1,
         "Benar: deploy = tengah proyek. Tanpa monitoring, model menjadi fosil dalam 1\u20132 tahun."),
        ("Direksi minta threshold 10% (tangkap semua) tapi kapasitas 50/bulan vs 400 pasien. Rekomendasi?",
         ["Ikuti saja", "Threshold 25% sesuai kapasitas: presisi > recall saat sumber daya terbatas + decision curve", "Threshold 50%", "Tanpa threshold"],
         1,
         "Benar: 400 alarm yang diabaikan < 50 intervensi tepat. Threshold adalah keputusan operasional, bukan statistik."),
    ],
    "rangkuman": [
        "Capstone = <strong>proses defensibel</strong>, bukan AUC tertinggi.",
        "Tahap 1: <strong>definisi + prediction time</strong> dikunci bersama klinisi.",
        "Tahap 2: wrangling + <strong>leakage audit</strong> per fitur.",
        "Tahap 3: <strong>empat lensa</strong> \u2014 diskriminasi, kalibrasi, utilitas, fairness.",
        "Tahap 4: <strong>TRIPOD + slide direksi + repo + monitoring</strong>.",
        "Threshold dari <strong>kapasitas operasional</strong>, bukan default.",
        "Deploy = tengah proyek; <strong>monitoring + owner</strong> wajib.",
        "Selamat \u2014 kamu kini punya <strong>portofolio end-to-end</strong> Health Data Science.",
    ],
    "prev": ("hd19-pelaporan-klinis", "HD19"),
    "next": ("bi1-biologi-molekuler", "BI1"),
}

LESSONS = [HD16, HD17, HD18, HD19, HD20]
for L in LESSONS:
    qa_scan(L)
