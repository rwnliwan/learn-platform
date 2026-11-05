# Track 6 — MK7, MK8, MK9
LESSONS = [
{
"slug": "mk7-propensity", "id": "MK7", "track": "Marketing Data Analytics",
"title_html": "Propensity & Next-Best-Action:<br/>Tawaran yang Tepat, ke Orang yang Tepat",
"title_plain": "Propensity & Next-Best-Action",
"chapter_summary": "Propensity modeling: memprediksi P(aksi|X) dengan logistic regression, kalibrasi probabilitas, lalu mengubah skor menjadi keputusan next-best-action via expected value. Termasuk lead scoring B2B dan lookalike audiences.",
"tujuan": [
"Menjelaskan apa itu propensity score dan membedakannya dari prediksi churn/CLV.",
"Membaca kurva kalibrasi dan menjelaskan kenapa ranking bagus belum cukup.",
"Memilih next-best-action per pelanggan dengan expected value (bukan skor tertinggi mentah).",
"Merancang lead scoring B2B dan menjelaskan cara kerja lookalike audience.",
],
"story_title": "Cerita: 100.000 Email, 200 Pembeli — dan yang Salah Sasaran",
"story": """<p>Tim CRM <em>&ldquo;PropertiKu&rdquo;</em> punya model &ldquo;canggih&rdquo;: skor ketertarikan KPR untuk 100.000 leads. Mereka kirim email penawaran ke <strong>10.000 skor tertinggi</strong>. Hasil: 200 pembeli (2%). Direksi kecewa: <em>&ldquo;Modelnya tidak bekerja!&rdquo;</em></p>
<p>Twist-nya: modelnya <strong>bekerja dengan benar</strong> — decile teratas memang konversi 2% vs 0,2% rata-rata (10x lift!). Yang salah: <strong>keputusan</strong>. Mereka menghubungi 10.000 orang padahal hanya 2.000 teratas yang EV-positif (8.000 sisanya: biaya email + unsubscribe &gt; expected revenue). Dan mereka menawarkan KPR ke semua — padahal untuk separuhnya, <em>next-best-action</em> yang benar adalah undangan survei lokasi dulu (EV lebih tinggi). Lesson ini: <strong>skor ≠ keputusan</strong>.</p>""",
"concepts": [
{
"id": "prop", "toc": "Propensity Modeling",
"title": "Propensity — Peluang Seseorang Mau Melakukan Sesuatu",
"body": """<p><strong>Definisi.</strong> <strong>Propensity score</strong> = P(aksi | X): peluang seseorang melakukan aksi tertentu (beli, klik, daftar) given karakteristiknya. Model klasik: <strong>regresi logistik</strong> — memetakan kombinasi linear fitur ke peluang 0–1 via fungsi sigmoid. Output dipakai untuk <strong>ranking</strong> (urutkan: siapa dihubungi duluan) dan — kalau terkalibrasi — untuk <strong>expected value</strong>.</p>
<p><strong>Kalibrasi</strong> = apakah &ldquo;P=0,2&rdquo; benar-benar kejadian 20%? Model bisa ranking bagus (AUC tinggi) tapi kalibrasi jelek (semua skor menumpuk di 0,4–0,6). Untuk keputusan berbasis EV, kalibrasi wajib — cek dengan <strong>reliability curve</strong> (bin skor vs rate aktual).</p>""",
"formulas": [
{"math": r"P(y=1 \mid X) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \cdots + \beta_p X_p)}}",
"symbols": [
"<Tex math={String.raw`P(y=1 \\mid X)`} />: propensity — peluang aksi given fitur",
"<Tex math={String.raw`\\beta_j`} />: bobot fitur j — tanda &amp; besarnya = arah &amp; kuat pengaruh (setelah standardisasi)",
"Fungsi sigmoid memetakan skor linear (−∞ s.d. +∞) ke peluang (0 s.d. 1)",
"Kalibrasi: plot rata-rata prediksi per bin vs rate aktual — idealnya garis diagonal",
]},
],
"intuisi": "Propensity seperti <strong>pramuniaga berpengalaman</strong> yang melirik pengunjung dan menebak &lsquo;yang ini serius mau beli&rsquo;. Ia tidak selalu benar per orang — tapi kalau ia menunjuk 10 orang, 3 beli (vs rata-rata 1 dari 10), instingnya berharga. Kalibrasi = memastikan &lsquo;feeling 30%&rsquo;-nya memang kejadian 30%.",
"kapan": "Lead scoring, targeting kampanye, prioritas sales/audiens iklan. Selalu cek kalibrasi sebelum dipakai untuk EV.",
"worked": {"title": "📐 Contoh: Decile analysis PropertiKu (klik untuk buka)",
"body": """<p>100.000 leads diurutkan by skor, dibagi 10 decile @10.000. Conversion aktual per decile: D10 (teratas) 2,0%, D9 1,1%, D8 0,6%, …, D1 0,05%. Rata-rata 0,4%.</p>
<p><strong>Lift D10</strong> = 2,0/0,4 = <strong>5x</strong>. Model bekerja (monotonik turun).</p>
<p><strong>Tapi</strong>: biaya email Rp2.000/orang, margin per pembeli Rp5jt. EV per orang D10 = 0,02 × 5jt − 2rb = <strong>+Rp98rb</strong> (kirim!). D8: 0,006 × 5jt − 2rb = <strong>+Rp28rb</strong> (masih kirim). D5 (0,2%): 0,002 × 5jt − 2rb = <strong>+Rp8rb</strong> (masih tipis positif). D4 (0,1%): −Rp1.500 → <strong>STOP</strong>. Jadi kirim ke ~60.000 teratas, bukan 10.000 (terlalu sedikit!) dan bukan 100.000 (terlalu banyak).</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8,9,10], y: [0.05,0.08,0.1,0.12,0.2,0.35,0.6,0.8,1.1,2.0], type: "bar", marker: {color: ["#94a3b8","#94a3b8","#94a3b8","#94a3b8","#e8a838","#e8a838","#e8a838","#2a7de1","#2a7de1","#2a7de1"]}, text: ["0,05%","0,08%","0,1%","0,12%","0,2%","0,35%","0,6%","0,8%","1,1%","2,0%"], textposition: "outside"}]""",
"title": "Decile analysis: conversion per decile skor",
"layout": """{xaxis: {title: "Decile (1=skor terendah, 10=tertinggi)"}, yaxis: {title: "Conversion aktual"}, showlegend: false}""",
"cara": "Sumbu X = decile skor (10 = 10.000 skor tertinggi), tinggi batang = conversion aktual decile itu.",
"interpretasi": "Monotonik naik — model me-ranking dengan benar (lift 5x di D10). Tapi keputusan &lsquo;kirim ke berapa?&rsquo; tidak dijawab chart ini — dijawab EV per decile (lihat worked example). Ranking = model; cutoff = bisnis."},
{"data": """[{x: [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95], y: [0.04,0.13,0.22,0.30,0.38,0.48,0.58,0.70,0.82,0.93], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "model"}, {x: [0,1], y: [0,1], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "ideal"}]""",
"title": "Kurva kalibrasi (reliability)",
"layout": """{xaxis: {title: "Rata-rata prediksi per bin"}, yaxis: {title: "Rate aktual"}, showlegend: true}""",
"cara": "Sumbu X = prediksi rata-rata tiap bin, Y = kejadian aktual. Garis hijau = kalibrasi sempurna.",
"interpretasi": "Titik-titik menempel garis diagonal — model <strong>terkalibrasi baik</strong>: &lsquo;P=0,3&rsquo; memang kejadian ~30%. Model seperti ini boleh dipakai untuk EV. Kalau titik jauh dari diagonal (mis. selalu di atas = overconfident), kalibrasi ulang (Platt/isotonic) sebelum dipakai untuk keputusan uang."},
],
},
{
"id": "nba", "toc": "Next-Best-Action",
"title": "Next-Best-Action — Dari Skor ke Keputusan",
"body": """<p><strong>Definisi.</strong> <strong>Next-best-action (NBA)</strong>: untuk tiap pelanggan, pilih <strong>satu aksi</strong> (dari menu: email, telepon, diskon, undangan, diam saja) yang memaksimalkan expected value — dengan <strong>constraints</strong>: frekuensi kontak maksimal (fatigue), kapasitas tim, biaya channel. Formula: NBA = argmax atas aksi dari [P(respons|aksi,X) × nilai − biaya(aksi)].</p>
<p>Poin penting: <strong>aksi &ldquo;diam saja&rdquo; adalah aksi yang valid</strong> — kadang EV tertinggi adalah tidak menghubungi (menghemat biaya + menghindari unsubscribe). Dan P(respons|aksi) ≠ P(respons): butuh data eksperimen atau uplift (MK11), bukan sekadar propensity observasional.</p>""",
"formulas": [
{"math": r"a^* = \arg\max_{a} \left[ P(\text{respons} \mid a, X) \times V - C(a) \right]",
"symbols": [
"<Tex math={String.raw`a^*`} />: aksi terbaik untuk pelanggan ini",
"<Tex math={String.raw`P(\\text{respons} \\mid a, X)`} />: peluang respons JIKA diberi aksi a — ini kausal, bukan propensity biasa",
"<Tex math={String.raw`V`} />: nilai jika berhasil (margin/CLV)",
"<Tex math={String.raw`C(a)`} />: biaya aksi a (uang + risiko fatigue/unsubscribe)",
"Constraints: mis. maks 2 kontak/minggu — optimasi dengan batasan",
]},
],
"intuisi": "Propensity = <strong>&lsquo;dia lapar&rsquo;</strong>. NBA = <strong>&lsquo;kasih dia menu apa?&rsquo;</strong> — nasi goreng (murah, kemungkinan dimakan 60%), steak (mahal, 80%), atau biarkan dulu (tidak lapar-lapar amat, ganggu = kesal). Skor lapar saja tidak menjawab menu apa.",
"kapan": "CRM matang: banyak aksi × banyak pelanggan × kapasitas terbatas. Mulai sederhana: 3–5 aksi, EV per aksi, 1 constraint (frekuensi).",
"worked": {"title": "📐 Contoh: NBA untuk satu lead (klik untuk buka)",
"body": """<p>Lead Andi: P(beli|email)=2%, P(beli|telepon)=8%, P(beli|diam)=0,5%. V=Rp5jt. Biaya: email Rp2rb, telepon Rp50rb.</p>
<p>EV email = 0,02×5jt − 2rb = <strong>Rp98rb</strong>. EV telepon = 0,08×5jt − 50rb = <strong>Rp350rb</strong>. EV diam = 0,005×5jt = Rp25rb.</p>
<p><strong>NBA = telepon</strong> (Rp350rb). Tapi jika kapasitas sales penuh (constraint!), fallback = email. Inilah NBA dengan constraint: bukan sekadar &ldquo;terbaik&rdquo;, tapi &ldquo;terbaik yang feasible&rdquo;.</p>"""},
"charts": [],
},
{
"id": "lookalike", "toc": "Lead Scoring & Lookalike",
"title": "Lead Scoring & Lookalike — Kembaran Pelanggan Terbaikmu",
"body": """<p><strong>Definisi.</strong> <strong>Lead scoring B2B</strong> = propensity + skor fit (kecocokan profil: industri, ukuran perusahaan, jabatan) + skor engagement. <strong>Lookalike audience</strong> = beri platform (Meta/Google/TikTok) <em>seed</em> 1.000–5.000 pelanggan terbaikmu; platform mencari &ldquo;kembaran&rdquo; mereka di populasinya (1–10% mirip). Kamu tidak tahu fiturnya (black box) — yang kamu kontrol: <strong>kualitas seed</strong>.</p>
<p>Aturan seed: <strong>seed = pelanggan terbaik</strong> (CLV tinggi, bukan sekadar &ldquo;pernah beli&rdquo;). Seed 5.000 pembeli diskon = lookalike pemburu diskon. Seed 1.000 Sultan = lookalike Sultan. Kualitas seed = kualitas kembaran.</p>""",
"formulas": [],
"intuisi": "Lookalike seperti <strong>&lsquo;carikan saya 1 juta orang yang mirip 1.000 pelanggan terbaik saya&rsquo;</strong>. Kalau 1.000-nya pemburu diskon, dapatnya 1 juta pemburu diskon — modelnya bekerja sempurna, strateginya bunuh diri.",
"kapan": "Prospecting (cari pelanggan baru) saat kamu punya seed berkualitas ≥1.000. Jangan untuk retensi (itu kerjaan CRM).",
"worked": {"title": "📐 Contoh: Dua seed, dua nasib (klik untuk buka)",
"body": """<p>Brand fashion: Seed A = 2.000 pembeli full-price (CLV Rp3jt). Seed B = 2.000 pembeli diskon 70% (CLV Rp400rb). Lookalike 1% dari keduanya, budget sama.</p>
<p>Hasil 3 bulan: A → CAC Rp450rb, CLV:CAC 6,7. B → CAC Rp180rb (terlihat murah!), CLV:CAC 2,2 — di bawah 3, marginal.</p>
<p><strong>Pelajaran:</strong> CAC murah menipu (lagi!). Seed menentukan segalanya — audit seed sebelum audit kampanye.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Skor propensity tinggi = harus dihubungi. Makin tinggi skor, makin wajib.",
"benar": "Skor menjawab &lsquo;siapa paling mungkin&rsquo;, bukan &lsquo;siapa menguntungkan dihubungi&rsquo;. Kasus PropertiKu: 8.000 dari 10.000 &lsquo;skor tertinggi&rsquo; ternyata EV-negatif (biaya &gt; expected revenue). Keputusan = <strong>EV &gt; 0</strong>, bukan &lsquo;skor &gt; X&rsquo;. Skor tanpa biaya = setengah keputusan."},
{"t": "Propensity tinggi berarti aksi kita yang menyebabkan mereka beli (kausal).",
"benar": "Propensity observasional = <strong>korelasi</strong>: orang berskor tinggi mungkin memang akan beli <em>tanpa</em> dihubungi (<em>sure things</em>). Menghubungi mereka = buang biaya + mengklaim kredit palsu. Efek kausal aksi diukur dengan <strong>uplift modeling</strong> (MK11) — propensity tidak menjawab &lsquo;apakah emailku yang membuat dia beli?&rsquo;"},
],
"tips": [
"<strong>Kalibrasi sebelum EV.</strong> Ranking bagus (AUC 0,85) tapi kalibrasi jelek = EV ngawur. Selalu plot reliability curve. Model yang &lsquo;P=0,5&rsquo; tapi aktualnya 0,2 akan membuatmu menghubungi 2,5x lebih banyak orang dari yang menguntungkan.",
"<strong>Seed lookalike = cermin strategimu.</strong> Audit seed tiap kuartal: masih berisi pelanggan terbaik (CLV), atau sudah terkontaminasi pemburu promo? Satu seed buruk = satu kuartal budget terbakar untuk &lsquo;kembaran&rsquo; yang salah.",
],
"labs": [
{"heading": "Propensity Decile + Cutoff EV",
"intro": "Bangun skor sederhana, buat decile analysis, lalu tentukan cutoff pengiriman berbasis EV — bukan 'top 10.000'.",
"title": "Lab 1 — Decile & Cutoff EV",
"hint": "Ubah BIAYA 2000 → 10000. Cutoff bergeser naik — makin mahal aksi, makin sedikit yang layak dihubungi.",
"code": """import random
random.seed(11)
# 5000 leads: skor + konversi aktual (skor tinggi -> peluang lebih besar)
leads = []
for _ in range(5000):
    skor = random.random()
    p = 0.005 + 0.06 * skor ** 2   # hubungan monotonik
    leads.append((skor, 1 if random.random() < p else 0))
leads.sort(reverse=True)

BIAYA, NILAI = 2000, 5_000_000
print(f"{'decile':>7} {'konv':>7} {'EV/orang (Rp rb)':>16}  keputusan")
for d in range(10):
    grup = leads[d*500:(d+1)*500]
    konv = sum(y for _, y in grup) / len(grup)
    ev = konv * NILAI - BIAYA
    print(f"{d+1:>7} {konv:>6.2%} {ev/1000:>15.0f}  {'KIRIM' if ev > 0 else 'STOP'}")
"""},
{"heading": "Pilih Next-Best-Action",
"intro": "Untuk tiap pelanggan, hitung EV tiap aksi (dengan constraint kapasitas) dan pilih NBA-nya.",
"title": "Lab 2 — Kalkulator NBA",
"hint": "Ubah KAPASITAS_TELEPON 2 → 0. Lihat NBA berubah ke email — constraint mengubah keputusan, bukan cuma skor.",
"code": """# NBA: pilih aksi terbaik per pelanggan (dengan constraint kapasitas)
pelanggan = [
    ("Andi", 0.02, 0.08, 0.005),
    ("Budi", 0.05, 0.06, 0.040),
    ("Cici", 0.01, 0.02, 0.008),
    ("Dodi", 0.03, 0.20, 0.002),
]
NILAI = 5_000_000
BIAYA = {"email": 2_000, "telepon": 50_000, "diam": 0}
KAPASITAS_TELEPON = 2  # ubah sesukamu
prob = {"email": 0, "telepon": 1, "diam": 2}

antre = []
for nama, pe, pt, pd in pelanggan:
    ev = {"email": pe*NILAI-BIAYA["email"], "telepon": pt*NILAI-BIAYA["telepon"], "diam": pd*NILAI}
    antre.append((nama, ev))
# alokasikan telepon ke EV telepon tertinggi dulu
antre.sort(key=lambda x: x[1]["telepon"], reverse=True)
jatah = set(n for n, _ in antre[:KAPASITAS_TELEPON])

for nama, ev in antre:
    pilihan = sorted(ev, key=lambda a: ev[a] if (a != "telepon" or nama in jatah) else -1, reverse=True)
    nba = pilihan[0]
    print(f"{nama:<6} NBA={nba:<8} (EV Rp{ev[nba]/1000:,.0f} rb)" +
          (" [telepon habis -> fallback]" if nba != "telepon" and ev["telepon"] > ev[nba] else ""))
"""},
],
"decisions": [
{"kondisi": "Butuh urutan prioritas (siapa duluan)", "pakai": "Propensity ranking (AUC/decile)",
"alasan": "Ranking cukup untuk alokasi kapasitas terbatas.",
"contoh": "Sales hubungi 100 skor teratas tiap minggu."},
{"kondisi": "Butuh keputusan kirim/tidak + budget", "pakai": "Propensity terkalibrasi + EV cutoff",
"alasan": "Tanpa kalibrasi & biaya, cutoff = tebak-tebakan.",
"contoh": "Email hanya ke decile dengan EV &gt; 0."},
{"kondisi": "Banyak aksi × banyak pelanggan × kapasitas terbatas", "pakai": "Next-best-action",
"alasan": "Satu skor tidak menjawab 'aksi apa'. NBA mengoptimasi aksi + constraint.",
"contoh": "CRM omnichannel: email/telepon/diam per pelanggan."},
{"kondisi": "Cari pelanggan BARU yang mirip terbaik", "pakai": "Lookalike (seed = CLV tertinggi)",
"alasan": "Prospecting efisien; kualitas seed menentukan.",
"contoh": "Seed 2.000 full-price buyers → lookalike 1%."},
],
"rule10": "<ol><li><strong>Skor = ranking.</strong> Keputusan = EV.</li><li><strong>Kalibrasi dulu</strong> sebelum EV.</li><li><strong>&lsquo;Diam&rsquo; adalah aksi valid.</strong></li><li><strong>Seed lookalike = pelanggan terbaik</strong>, bukan terbanyak.</li></ol>",
"case": {"toc": "Mini-Case: 10.000 Email PropertiKu",
"title": "10.000 Email yang Kebanyakan",
"body": """<p>PropertiKu: 100.000 leads, model propensity (D10 konversi 2%, rata-rata 0,4%). Tim kirim ke 10.000 teratas → 200 pembeli. Biaya email Rp2.000, margin Rp5jt/pembeli. Direksi: &ldquo;model tidak bekerja&rdquo;.</p>""",
"q": "(a) Apakah model bekerja? Buktikan. (b) Berapa cutoff pengiriman yang benar secara EV? (c) Satu usulan next-best-action selain 'kirim email'?",
"pembahasan": """<p>(a) <strong>Bekerja.</strong> Lift D10 = 2%/0,4% = 5x, monotonik turun per decile. Model me-ranking dengan benar — yang salah keputusannya, bukan modelnya.</p>
<p>(b) EV/orang per decile: D10 +Rp98rb, D9 +Rp53rb, D8 +Rp28rb, D7 +Rp15,5rb, D6 +Rp8rb, D5 +Rp8rb, D4 −Rp1.500 → <strong>kirim ke ~60.000 teratas (D5–D10)</strong>, bukan 10.000. Ironisnya tim <em>kurang</em> agresif — 50.000 EV-positif tidak dikirimi!</p>
<p>(c) <strong>Undangan survei lokasi</strong> untuk D8–D10 (P datang 15%, biaya Rp100rb, EV = 0,15×5jt−100rb = +Rp650rb — jauh di atas email), dan <strong>diam</strong> untuk D1–D4.</p>"""},
"quiz": [
{"q": "Model AUC 0,85 tapi kurva kalibrasi jauh dari diagonal. Boleh dipakai untuk hitung EV cutoff?",
"options": ["Boleh — AUC tinggi cukup", "Tidak — kalibrasi dulu (Platt/isotonic), EV butuh probabilitas jujur", "Boleh jika datanya besar", "Tidak boleh dipakai sama sekali"], "correct": 1,
"why": "Benar: AUC = ranking, kalibrasi = kejujuran angka. EV = p×V − C memakai p sebagai angka — p yang ngawur → cutoff ngawur. Kalibrasi ulang dulu."},
{"q": "Propensity beli 30% untuk Andi. Artinya?",
"options": ["Email pasti membuatnya beli 30%", "Dari 100 orang seperti Andi, ~30 akan beli (tanpa tahu efek email)", "Andi 30% lebih baik", "Tidak ada artinya"], "correct": 1,
"why": "Benar: propensity = peluang observasional, bukan efek kausal email. Andi mungkin 'sure thing' (beli tanpa email). Efek email diukur via uplift (MK11)."},
{"q": "EV email +Rp98rb, EV telepon +Rp350rb, tapi kapasitas telepon habis. NBA?",
"options": ["Telepon — EV tertinggi", "Email (fallback feasible terbaik)", "Diam saja", "Tunggu kapasitas"], "correct": 1,
"why": "Benar: NBA = terbaik yang feasible. Telepon tidak feasible (constraint) → email. 'Diam' hanya jika semua EV negatif."},
{"q": "Seed lookalike terbaik adalah…",
"options": ["Semua pembeli (makin banyak makin baik)", "1.000–5.000 pelanggan CLV tertinggi", "Semua visitor", "Pembeli diskon terbesar"], "correct": 1,
"why": "Benar: kualitas &gt; kuantitas. Seed pemburu diskon = kembaran pemburu diskon (CAC murah menipu, CLV jeblok)."},
{"q": "Decile D10 konversi 2%, rata-rata 0,4%. Lift?",
"options": ["2%", "5x", "1,6 poin", "Tidak bisa dihitung"], "correct": 1,
"why": "Benar: lift = 2,0/0,4 = 5x. Lift mengukur 'seberapa lebih baik dari acak' — bahasa yang dimengerti stakeholder untuk menilai model ranking."},
],
"rangkum": [
"<strong>Propensity</strong> = P(aksi|X) via (biasanya) regresi logistik; untuk ranking + — jika terkalibrasi — EV.",
"<strong>Kalibrasi</strong> (reliability curve) wajib sebelum probabilitas dipakai untuk keputusan uang.",
"<strong>Decile analysis</strong>: bukti model bekerja (lift) dalam bahasa bisnis.",
"<strong>NBA</strong> = argmax aksi [P(respons|aksi,X)×V − C(aksi)] + constraints; 'diam' adalah aksi valid.",
"<strong>Propensity ≠ kausalitas</strong>: sure things vs persuadable dibedakan di MK11 (uplift).",
"<strong>Lookalike</strong>: seed = pelanggan CLV tertinggi; kualitas seed = kualitas kembaran.",
],
"prev": ["mk6-churn", "MK6"],
"next": ["mk8-rekomendasi", "MK8"],
},
{
"slug": "mk8-rekomendasi", "id": "MK8", "track": "Marketing Data Analytics",
"title_html": "Recommender System:<br/>'Pelanggan Juga Beli...'",
"title_plain": "Recommender: Collaborative, Content-Based, Association Rules",
"chapter_summary": "Tiga mesin rekomendasi: collaborative filtering (user/item-based, cosine similarity), content-based (+ cold start problem), dan association rules (support, confidence, lift). Lab: item-based CF dan Apriori-lite from scratch.",
"tujuan": [
"Menjelaskan cara kerja user-based vs item-based collaborative filtering.",
"Menghitung cosine similarity dan memprediksi rating dengan weighted average.",
"Menghitung support, confidence, lift dan menemukan aturan asosiasi yang berguna.",
"Mengidentifikasi cold start problem dan memilih strateginya.",
],
"story_title": "Cerita: 'Rekomendasi Terlaris' yang Membunuh Toko Buku",
"story": """<p>Toko buku online <em>&ldquo;BacaTerus&rdquo;</em> memasang widget &ldquo;Rekomendasi Untukmu&rdquo; yang isinya… <strong>10 buku terlaris nasional</strong>. Sama untuk semua orang. Click-through 0,3%. Tim produk menyimpulkan: <em>&ldquo;rekomendasi tidak bekerja untuk kami.&rdquo;</em></p>
<p>Twist-nya: yang tidak bekerja bukan rekomendasi — tapi <strong>rekomendasi palsu</strong>. Rekomendasi sejati = personal (&ldquo;karena kamu beli X…&rdquo;). Setelah diganti item-based collaborative filtering sederhana, CTR naik ke 4,1% dan 18% revenue datang dari widget itu. Amazon menghasilkan ~35% revenue dari rekomendasi — bukan dari &ldquo;terlaris nasional&rdquo;. Lesson ini: tiga mesin yang membuat &ldquo;untukmu&rdquo; benar-benar untukmu.</p>""",
"concepts": [
{
"id": "cf", "toc": "Collaborative Filtering",
"title": "Collaborative Filtering — 'Orang Sepertimu Suka...'",
"body": """<p><strong>Definisi.</strong> <strong>Collaborative filtering (CF)</strong> memprediksi kesukaanmu dari <strong>orang lain</strong>: <strong>user-based</strong> — &ldquo;pengguna mirip kamu (cosine similarity tinggi) suka X, jadi kamu mungkin suka X&rdquo;; <strong>item-based</strong> — &ldquo;kamu suka A; orang yang suka A juga suka B; jadi coba B&rdquo;. Item-based lebih stabil (item berubah lebih lambat dari selera user) dan jadi standar industri.</p>
<p><strong>Cosine similarity</strong> mengukur kemiripan dua vektor (user/item) via sudutnya. Prediksi rating = rata-rata tertimbang rating tetangga, bobot = similarity.</p>""",
"formulas": [
{"math": r"\text{sim}(u,v) = \frac{u \cdot v}{\lVert u \rVert \, \lVert v \rVert} \quad;\quad \hat{r}_{u,i} = \frac{\sum_v \text{sim}(u,v)\, r_{v,i}}{\sum_v |\text{sim}(u,v)|}",
"symbols": [
"<Tex math={String.raw`\\text{sim}(u,v)`} />: kemiripan user u dan v (−1 s.d. 1; 1 = selera identik)",
"<Tex math={String.raw`u \\cdot v`} />: dot product vektor rating — besar jika keduanya suka item yang sama",
"<Tex math={String.raw`\\hat{r}_{u,i}`} />: prediksi rating user u untuk item i — rata-rata rating tetangga, dibobot kemiripan",
"Intuisi: tetangga yang sangat mirip (sim 0,9) suaranya 9x tetangga biasa (sim 0,1)",
]},
],
"intuisi": "CF seperti <strong>nongkrong di toko buku dan bertanya ke pembaca yang seleranya mirip</strong>: &lsquo;kamu yang suka Murakami, habis ini baca apa?&rsquo; — jauh lebih tepat dari &lsquo;buku terlaris nasional&rsquo; (yang dibeli semua orang termasuk yang tidak sejenis denganmu).",
"kapan": "Banyak user × banyak item × ada histori interaksi. Item-based untuk katalog stabil; user-based untuk selera berubah cepat (berita, fashion).",
"worked": {"title": "📐 Contoh: Prediksi rating manual (klik untuk buka)",
"body": """<p>Rating (1–5) — Andi: X=5, Y=3; Budi: X=4, Y=2, Z=5; Cici: X=5, Z=4. Prediksi rating Andi untuk Z.</p>
<p><strong>Langkah 1 — similarity:</strong> sim(Andi,Budi): vektor X,Y = (5,3)•(4,2) = 20+6=26; |Andi|=&radic;34≈5,83; |Budi|=&radic;20≈4,47 → sim ≈ 26/26,06 ≈ <strong>1,00</strong>. sim(Andi,Cici): (5)•(5)=25; |Cici| (hanya X) =5 → 25/(5,83×5) ≈ <strong>0,86</strong>.</p>
<p><strong>Langkah 2 — prediksi:</strong> r̂ = (1,00×5 + 0,86×4)/(1,00+0,86) = 8,44/1,86 ≈ <strong>4,5</strong>. Rekomendasikan Z ke Andi (prediksi tinggi).</p>"""},
"charts": [
{"data": """[{z: [[1,0.95,0.2,0.1],[0.95,1,0.25,0.15],[0.2,0.25,1,0.9],[0.1,0.15,0.9,1]], x: ["Andi","Budi","Cici","Dodi"], y: ["Andi","Budi","Cici","Dodi"], type: "heatmap", colorscale: [[0,"#f1f5f9"],[1,"#2a7de1"]], text: [["1","0,95","0,2","0,1"],["0,95","1","0,25","0,15"],["0,2","0,25","1","0,9"],["0,1","0,15","0,9","1"]], texttemplate: "%{text}", showscale: false}]""",
"title": "Matriks similarity antar pengguna",
"layout": """{xaxis: {title: ""}, yaxis: {title: ""}}""",
"cara": "Sel = similarity dua pengguna. Biru tua = sangat mirip, terang = tidak mirip. Diagonal selalu 1.",
"interpretasi": "Dua blok jelas: (Andi,Budi) (0,95) dan (Cici,Dodi) (0,9) — dua &lsquo;geng selera&rsquo;. Rekomendasi Andi diambil dari Budi (bukan Cici). Inilah visual &lsquo;orang sepertimu&rsquo;: blok biru = tetangga yang suaranya didengar."},
],
},
{
"id": "content", "toc": "Content-Based & Cold Start",
"title": "Content-Based — 'Karena Kamu Suka X...'",
"body": """<p><strong>Definisi.</strong> <strong>Content-based</strong> merekomendasikan item yang <strong>mirip dengan yang kamu sukai</strong> — dari <em>fitur item</em> (genre, penulis, kata kunci; TF-IDF untuk teks), bukan dari orang lain. Profil user = rata-rata fitur item yang ia sukai; skor = cosine(profil, item).</p>
<p><strong>Cold start</strong> — masalah klasik: <strong>user baru</strong> (tidak ada histori → CF mati; solusi: content-based dari 3 item onboarding / popularitas tersegmentasi), <strong>item baru</strong> (tidak ada yang rating → solusi: content-based dari fiturnya), dan keduanya. <strong>Hybrid</strong> (campuran CF + content-based) adalah standar produksi.</p>""",
"formulas": [],
"intuisi": "Content-based seperti <strong>pustakawan yang hafal isi buku</strong>: &lsquo;kamu suka novel Jepang bernuansa surealis? Ini 3 yang mirip.&rsquo; Ia tidak butuh tahu orang lain — cukup paham bukunya. Kelemahan: ia tidak akan pernah mengenalkanmu ke genre baru (filter bubble); CF bisa (&lsquo;orang sepertimu ternyata suka jazz!&rsquo;).",
"kapan": "Katalog dengan metadata kaya (film, berita, fashion), item baru terus bermunculan, atau cold start parah. Hybrid untuk produksi serius.",
"worked": {"title": "📐 Contoh: Cold start user baru (klik untuk buka)",
"body": """<p>User baru daftar, pilih 3 genre favorit saat onboarding: [fiksi Jepang, sejarah, sains populer].</p>
<p><strong>Hari 1 (cold):</strong> content-based dari 3 genre → 10 rekomendasi awal. CF belum bisa (vektor user kosong).</p>
<p><strong>Minggu 2:</strong> user sudah rate 15 buku → hybrid: 70% CF (tetangga selera) + 30% content-based (eksplorasi).</p>
<p><strong>Aturan:</strong> jangan tampilkan widget kosong (&ldquo;belum ada rekomendasi&rdquo;) — isi dengan terlaris <em>tersegmentasi</em> (genre pilihannya), bukan terlaris nasional.</p>"""},
"charts": [],
},
{
"id": "assoc", "toc": "Association Rules",
"title": "Association Rules — 'Sering Dibeli Bersamaan'",
"body": """<p><strong>Definisi.</strong> <strong>Association rules</strong> menemukan pola &ldquo;X → Y&rdquo; dari keranjang belanja: <strong>support</strong> = % transaksi mengandung X dan Y (seberapa umum); <strong>confidence</strong> = % keranjang berisi X yang juga berisi Y (seberapa bisa diandalkan); <strong>lift</strong> = confidence / P(Y) (apakah Y benar-benar terkait X, atau cuma laris umum?).</p>
<p>Aturan emas: <strong>lift &gt; 1</strong> = terkait beneran. Confidence tinggi tapi lift ≈ 1 = &ldquo;orang beli X lalu beli Y karena Y dibeli semua orang&rdquo; — bukan insight.</p>""",
"formulas": [
{"math": r"\text{supp}(X \to Y) = P(X \cap Y) \quad;\quad \text{conf} = \frac{P(X \cap Y)}{P(X)} \quad;\quad \text{lift} = \frac{\text{conf}}{P(Y)}",
"symbols": [
"support: seberapa sering pola muncul (filter: support &lt; 1% = anekdot, bukan pola)",
"confidence: jika X dibeli, seberapa sering Y ikut",
"lift: 2,5 = Y 2,5x lebih mungkin dibeli bersama X dibanding acak — inilah angka yang penting",
]},
],
"intuisi": "Association rules seperti <strong>kasir yang hafal kebiasaan</strong>: &lsquo;yang beli popok biasanya beli bir juga&rsquo; (legenda ritel). Tapi kasir yang baik tahu bedanya &lsquo;sering bareng karena terkait&rsquo; (lift tinggi) vs &lsquo;sering bareng karena dua-duanya laris&rsquo; (lift ≈ 1).",
"kapan": "Market basket analysis, bundling, tata letak (online: &lsquo;sering dibeli bersamaan&rsquo;; offline: rak berdekatan), cross-sell.",
"worked": {"title": "📐 Contoh: Aturan mie → telur (klik untuk buka)",
"body": """<p>10.000 transaksi: 3.000 ada mie (P=30%), 4.000 ada telur (P=40%), 2.400 ada keduanya.</p>
<p>support = 2.400/10.000 = <strong>24%</strong>. confidence = 2.400/3.000 = <strong>80%</strong>. lift = 0,8/0,4 = <strong>2,0</strong>.</p>
<p><strong>Baca:</strong> &ldquo;80% pembeli mie juga beli telur, dan itu 2x lipat dari peluang acak.&rdquo; Aksi: bundle mie+telur, atau taruh berdekatan. Bandingkan aturan mie → garam: confidence 90% tapi P(garam)=85% → lift 1,06 — tidak menarik (semua orang beli garam).</p>"""},
"charts": [
{"data": """[{x: ["mie → telur", "kopi → gula", "mie → garam", "popok → bir"], y: [2.0, 1.8, 1.06, 2.4], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#94a3b8","#e8a838"]}, text: ["2,0","1,8","1,06","2,4"], textposition: "outside"}]""",
"title": "Lift empat aturan asosiasi",
"layout": """{yaxis: {title: "Lift"}, showlegend: false}""",
"cara": "Tinggi batang = lift. Di atas 1 = terkait beneran; ≈1 = kebetulan (sama-sama laris).",
"interpretasi": "&lsquo;mie → garam&rsquo; confidence-nya tertinggi tapi lift 1,06 — jebakan klasik (garam dibeli semua orang). &lsquo;Popok → bir&rsquo; lift 2,4 = insight sejati. <strong>Urutkan aturan by lift, bukan confidence.</strong> Inilah bedanya analis dan kasir: analis tahu kapan pola itu ilusi."},
],
},
],
"myths": [
{"t": "Rekomendasi = tampilkan yang paling laris. Simple dan terbukti.",
"benar": "&lsquo;Terlaris nasional&rsquo; sama untuk semua orang = <strong>bukan rekomendasi, itu chart musik</strong>. CTR BacaTerus 0,3% vs 4,1% setelah personalisasi. Yang terlaris berguna hanya untuk <strong>cold start</strong> sementara — dan itupun harus tersegmentasi (terlaris di genre pilihannya), bukan nasional."},
{"t": "Cold start tidak ada solusi — user/item baru ya tidak bisa direkomendasikan.",
"benar": "Ada <strong>strategi per jenis</strong>: user baru → onboarding pilih genre + terlaris tersegmentasi; item baru → content-based dari fiturnya (tidak butuh rating!); keduanya baru → hybrid + eksplorasi (bandit, MK9). Widget kosong &lsquo;belum ada rekomendasi&rsquo; = menyerah sebelum bertanding."},
],
"tips": [
"<strong>Item-based &gt; user-based untuk katalog stabil.</strong> Selera user berubah (hari ini suka horor, tahun depan komedi), tapi kemiripan antar item awet. Matriks item-item bisa dihitung offline semalam; prediksi real-time tinggal lookup. Inilah arsitektur standar industri.",
"<strong>Evaluasi dengan precision@k / recall@k, bukan RMSE.</strong> User tidak peduli prediksimu 4,2 vs aktual 4,0 — ia peduli apakah 5 rekomendasi teratas ada yang diklik. RMSE mengoptimasi angka; precision@k mengoptimasi pengalaman.",
],
"labs": [
{"heading": "Item-Based CF From-Scratch",
"intro": "Hitung similarity antar item dari rating user, lalu rekomendasikan item untuk user target.",
"title": "Lab 1 — Item-Based CF",
"hint": "Ubah rating Budi untuk Z dari 5 → 1. Lihat rekomendasi untuk Andi berubah — sensitivitas terhadap tetangga.",
"code": """import math
# rating: {user: {item: rating}}
R = {"Andi": {"X": 5, "Y": 3},
     "Budi": {"X": 4, "Y": 2, "Z": 5},
     "Cici": {"X": 5, "Z": 4}}

def cos(a, b):
    k = set(a) & set(b)
    if not k: return 0.0
    dot = sum(a[i]*b[i] for i in k)
    na = math.sqrt(sum(a[i]**2 for i in k)); nb = math.sqrt(sum(b[i]**2 for i in k))
    return dot/(na*nb)

items = ["X", "Y", "Z"]
vec = {it: {u: R[u][it] for u in R if it in R[u]} for it in items}
print("Similarity antar item:")
for i in items:
    for j in items:
        if i < j: print(f"  sim({i},{j}) = {cos(vec[i], vec[j]):.2f}")

# rekomendasi untuk Andi: item yg belum di-rate, skor = rata2 tertimbang similarity
target, sudah = "Andi", set(R["Andi"])
print(f"\\nRekomendasi untuk {target}:")
for it in items:
    if it in sudah: continue
    pemb = sum(cos(vec[it], vec[s]) for s in sudah)
    skor = sum(cos(vec[it], vec[s])*R[target][s] for s in sudah)/pemb if pemb else 0
    print(f"  {it}: skor {skor:.2f}")
"""},
{"heading": "Association Rules Lite",
"intro": "Dari daftar keranjang, hitung support, confidence, lift untuk semua pasangan — temukan aturan terbaik.",
"title": "Lab 2 — Apriori-lite",
"hint": "Tambahkan item 'garam' ke semua keranjang — lihat confidence-nya tinggi tapi lift ≈ 1. Itulah jebakan confidence.",
"code": """from itertools import combinations
keranjang = [
    {"mie","telur"},{"mie","telur","kopi"},{"mie","kopi"},
    {"telur","kopi"},{"mie","telur"},{"kopi","gula"},
    {"mie","telur","gula"},{"telur"},{"mie","kopi","gula"},{"popok","bir"},
]
n = len(keranjang)
def p(items): return sum(1 for k in keranjang if items <= k)/n

aturan = []
for a, b in combinations(["mie","telur","kopi","gula","popok","bir"], 2):
    for x, y in [(a,b),(b,a)]:
        sup, conf = p({x,y}), p({x,y})/p({x}) if p({x}) else 0
        lift = conf/p({y}) if p({y}) else 0
        if sup >= 0.15:
            aturan.append((lift, f"{x} -> {y}", sup, conf))
aturan.sort(reverse=True)
print(f"{'aturan':<16}{'support':>8}{'conf':>7}  lift")
for lift, r, sup, conf in aturan:
    print(f"{r:<16}{sup:>8.0%}{conf:>7.0%}  {lift:.2f}")
print("\\nUrut by lift: aturan teratas = insight sejati.")
"""},
],
"decisions": [
{"kondisi": "Katalog stabil, butuh rekomendasi real-time", "pakai": "Item-based CF",
"alasan": "Kemiripan item awet; komputasi offline, serving cepat.",
"contoh": "E-commerce: 'sering dibeli bersamaan'."},
{"kondisi": "Item baru terus bermunculan / metadata kaya", "pakai": "Content-based / hybrid",
"alasan": "Item baru langsung punya fitur → langsung bisa direkomendasikan.",
"contoh": "Berita, fashion, musik."},
{"kondisi": "Butuh bundling / cross-sell taktis", "pakai": "Association rules (lift)",
"alasan": "Aturan 'X→Y' langsung jadi aksi promo/tata letak.",
"contoh": "Bundle mie+telur; rak berdekatan."},
{"kondisi": "User baru total (tidak ada histori)", "pakai": "Onboarding + terlaris tersegmentasi",
"alasan": "CF mati tanpa histori; jangan tampilkan widget kosong.",
"contoh": "Pilih 3 genre saat daftar → rekomendasi awal."},
],
"rule10": "<ol><li><strong>&lsquo;Terlaris&rsquo; bukan rekomendasi</strong> (kecuali cold start sementara).</li><li><strong>Urut aturan by lift</strong>, bukan confidence.</li><li><strong>Evaluasi precision@k</strong>, bukan RMSE.</li></ol>",
"case": {"toc": "Mini-Case: Widget 0,3%",
"title": "Widget 0,3% BacaTerus",
"body": """<p>BacaTerus: widget &ldquo;Rekomendasi Untukmu&rdquo; = 10 terlaris nasional, CTR 0,3%. Setelah item-based CF: CTR 4,1%, 18% revenue dari widget. Data: 50.000 user, 8.000 judul, rata-rata 6 rating/user (sparse!).</p>""",
"q": "(a) Kenapa 'terlaris nasional' gagal? (b) Dengan data sparse (6 rating/user), user-based atau item-based — kenapa? (c) Satu eksperimen untuk validasi sebelum full rollout?",
"pembahasan": """<p>(a) <strong>Tidak personal</strong> — sama untuk semua orang, tidak memakai sinyal selera. &ldquo;Rekomendasi&rdquo; tanpa personalisasi = papan iklan.</p>
<p>(b) <strong>Item-based.</strong> User dengan 6 rating → vektor user pendek &amp; tidak stabil (user-based berisik). Item dengan ratusan rating → vektor item kaya → similarity item-item lebih bisa diandalkan. Plus komputasi offline.</p>
<p>(c) <strong>A/B test</strong>: 50% user lihat CF, 50% lihat terlaris. Metrik: CTR widget + revenue per user (bukan cuma klik — waspadai clickbait). Jalan 2 minggu, cek significance (MK9).</p>"""},
"quiz": [
{"q": "User-based vs item-based CF. Kapan item-based menang?",
"options": ["Selalu", "Katalog stabil — kemiripan item lebih awet dari selera user", "User sedikit", "Tidak pernah"], "correct": 1,
"why": "Benar: selera user berubah, kemiripan item relatif awet. Item-based juga komputasinya offline-friendly. Inilah standar industri untuk e-commerce."},
{"q": "Aturan: support 24%, confidence 80%, P(Y)=40%. Lift dan artinya?",
"options": ["0,5 — tidak terkait", "2,0 — Y 2x lebih mungkin dibeli bersama X", "80% — sangat kuat", "24% — lemah"], "correct": 1,
"why": "Benar: lift = 0,8/0,4 = 2,0. Confidence 80% saja tidak cukup — harus dibagi baseline P(Y). Lift-lah yang membedakan insight dari 'kebetulan laris'."},
{"q": "User baru tanpa histori. Strategi terbaik hari pertama?",
"options": ["Widget kosong 'belum ada rekomendasi'", "Onboarding pilih minat + terlaris tersegmentasi", "Item-based CF langsung", "Tunggu 1 bulan"], "correct": 1,
"why": "Benar: CF mati tanpa histori. Onboarding memberi sinyal awal; terlaris tersegmentasi (genre pilihannya) mengisi kekosongan. Widget kosong = peluang terbuang."},
{"q": "Evaluasi recommender untuk bisnis. Metrik terbaik?",
"options": ["RMSE prediksi rating", "Precision@k / CTR / revenue per user", "Jumlah item", "Kecepatan training"], "correct": 1,
"why": "Benar: user peduli 'apakah 5 teratas ada yang diklik', bukan error 0,2 poin rating. Optimasi metrik pengalaman, bukan metrik statistik."},
{"q": "Confidence 'mie → garam' 90%, lift 1,06. Kesimpulan?",
"options": ["Aturan kuat — bundel!", "Jebakan: garam dibeli semua orang; lift ≈ 1 = tidak ada keterkaitan khusus", "Naikkan confidence", "Data salah"], "correct": 1,
"why": "Benar: confidence tinggi karena P(garam) sudah 85%. Lift 1,06 ≈ acak. Selalu urutkan aturan by lift — confidence tanpa baseline menipu."},
],
"rangkum": [
"<strong>Collaborative filtering</strong>: dari orang lain — user-based ('mirip kamu') vs item-based ('mirip barangmu'); cosine similarity + weighted average.",
"<strong>Content-based</strong>: dari fitur item; solusi cold start item-baru; kelemahan: filter bubble.",
"<strong>Cold start</strong>: user baru → onboarding; item baru → content-based; jangan tampilkan widget kosong.",
"<strong>Association rules</strong>: support (umum), confidence (andal), <strong>lift</strong> (terkait beneran) — urut by lift.",
"<strong>Hybrid</strong> = standar produksi. Evaluasi dengan precision@k/CTR, bukan RMSE.",
"<strong>Kapan TIDAK pakai CF</strong>: interaksi terlalu sedikit per user AND per item (keduanya sparse ekstrem) — mulai dari content-based/rules.",
],
"prev": ["mk7-propensity", "MK7"],
"next": ["mk9-eksperimen", "MK9"],
},
{
"slug": "mk9-eksperimen", "id": "MK9", "track": "Marketing Data Analytics",
"title_html": "Eksperimen:<br/>A/B Testing yang Tidak Menyesatkan",
"title_plain": "Eksperimen: A/B, Power, CUPED, Bandit, Kuasi-Eksperimen",
"chapter_summary": "Eksperimen end-to-end: desain A/B (hipotesis, randomisasi, power & MDE), CUPED untuk variansi, bahaya peeking & sequential testing, lalu naik kelas: multivariate, multi-armed bandit, dan kuasi-eksperimen (DiD, synthetic control) untuk saat randomisasi mustahil.",
"tujuan": [
"Merancang A/B test yang valid: hipotesis, metrik, randomisasi, durasi via power analysis.",
"Menghitung ukuran sampel dari MDE dan menjelaskan tradeoff-nya.",
"Menjelaskan kenapa 'intip tiap hari & berhenti saat signifikan' (peeking) merusak hasil.",
"Memilih metode yang tepat: A/B vs multivariate vs bandit vs DiD/synthetic control.",
],
"story_title": "Cerita: Tombol Hijau yang 'Menang' — Lalu Kalah",
"story": """<p>Tim growth <em>&ldquo;PayKu&rdquo;</em> menguji tombol bayar hijau vs biru. Setiap pagi mereka intip dashboard. Hari ke-5: <strong>p = 0,03 — signifikan!</strong> Tombol hijau dinyatakan menang (+12% conversion), di-rollout ke 100% user. Sebulan kemudian, conversion <em>turun</em> 4%.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: mereka <strong>peeking</strong> — mengintip tiap hari dan berhenti saat signifikan. Peluang false positive bukan 5% lagi, tapi ~25% (seperti lempar koin sampai dapat gambar lalu berhenti). <strong>Kedua</strong>: +12% adalah <strong>noise + novelty effect</strong> (user klik karena baru, bukan karena hijau). <strong>Ketiga</strong>: sampelnya tidak cukup untuk MDE 5% — test-nya <em>underpowered</em> dari awal. Tiga dosa, satu dashboard hijau. Lesson ini: eksperimen yang benar itu <strong>disiplin</strong>, bukan cuma alat.</p>""",
"concepts": [
{
"id": "ab", "toc": "A/B Testing yang Valid",
"title": "A/B Testing — Disiplin Sebelum Statistik",
"body": """<p><strong>Definisi.</strong> <strong>A/B test</strong>: bagi user acak ke kontrol (A) vs perlakuan (B), bandingkan metrik. Valid jika: <strong>hipotesis dulu</strong> (&ldquo;hijau menaikkan conversion checkout 5% karena lebih kontras&rdquo; — bukan &ldquo;coba-coba&rdquo;), <strong>randomisasi benar</strong> (per user, konsisten — user yang sama selalu lihat varian sama; waspadai <em>carryover</em>), <strong>metrik primer satu</strong> (+ guardrail: metrik yang tidak boleh rusak), dan <strong>durasi ditentukan di muka</strong> dari power analysis.</p>
<p><strong>Power & MDE</strong>: <em>power</em> = peluang mendeteksi efek yang benar-benar ada (standar 80%). <strong>MDE</strong> (<em>minimum detectable effect</em>) = efek terkecil yang masih penting secara bisnis. MDE kecil → butuh sampel besar. Rumus kasar: n per grup ≈ 16σ²/MDE².</p>""",
"formulas": [
{"math": r"n_{per\_grup} \approx \frac{16\sigma^2}{MDE^2} \quad;\quad \text{durasi} = \frac{2n}{\text{traffic/hari}}",
"symbols": [
"<Tex math={String.raw`\\sigma^2`} />: variansi metrik (dari data historis)",
"<Tex math={String.raw`MDE`} />: efek terkecil yang penting (dalam satuan metrik, bukan % — hati-hati)",
"16 = konstanta untuk power 80% & alpha 5% (dua sisi)",
"Implikasi: MDE separuh → sampel 4x lipat. Pilih MDE dari bisnis ('di bawah 3% tidak worth effort'), bukan dari 'yang penting signifikan'",
]},
],
"intuisi": "Power analysis seperti <strong>memutuskan seberapa lama memancing</strong>: kalau ikannya kecil (MDE kecil), butuh jaring besar & waktu lama. Berhenti tiap 5 menit untuk cek ('peeking') lalu pulang saat dapat satu ikan = kamu tidak tahu apakah danau ini memang banyak ikan.",
"kapan": "Punya traffic cukup untuk MDE bisnis dalam waktu wajar (2–4 minggu). Jika butuh 6 bulan untuk MDE 2% — pertimbangkan bandit atau terima MDE lebih besar.",
"worked": {"title": "📐 Contoh: Berapa lama test PayKu? (klik untuk buka)",
"body": """<p>Conversion baseline 10% (σ² = 0,1×0,9 = 0,09). MDE bisnis = 1 poin (10% → 11%, relatif 10%). Traffic 20.000 user/hari.</p>
<p><strong>Langkah 1:</strong> n per grup ≈ 16 × 0,09 / 0,01² = 1,44/0,0001 = <strong>14.400</strong>.</p>
<p><strong>Langkah 2:</strong> durasi = 2 × 14.400 / 20.000 ≈ <strong>1,5 hari</strong>. (Traffic besar!)</p>
<p><strong>Tapi</strong> — PayKu berhenti di hari ke-5 dengan &ldquo;p=0,03&rdquo; setelah intip tiap hari. Dengan traffic sebesar ini, hari ke-5 = 100.000 user — jauh di atas 28.800 yang dibutuhkan. Masalahnya bukan durasi, tapi <strong>peeking</strong> + novelty effect. Durasi cukup ≠ valid jika protokol dilanggar.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,7,10,15,20], y: [57600,14400,6400,3600,2304,1176,576,256,144], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "n per grup"}]""",
"title": "Ukuran sampel vs MDE (baseline 10%)",
"layout": """{xaxis: {title: "MDE (poin persentase)"}, yaxis: {title: "n per grup", type: "log"}, showlegend: false}""",
"cara": "Sumbu X = MDE yang ingin dideteksi, Y = sampel per grup (skala log). Baca: makin kecil efek yang dicari, makin besar sampel.",
"interpretasi": "MDE 1 poin butuh 57.600/grup; MDE 5 poin cuma 2.304/grup — <strong>25x lipat</strong> untuk 5x presisi. Inilah kenapa 'MDE dari bisnis' penting: test MDE 1% yang butuh 3 bulan untuk efek yang 'tidak worth effort' = buang waktu. Pilih pertarungan yang worth dimenangkan."},
],
},
{
"id": "cuped", "toc": "CUPED & Bahaya Peeking",
"title": "CUPED & Peeking — Variansi Musuhmu, Kesabaran Senjatamu",
"body": """<p><strong>Definisi.</strong> <strong>CUPED</strong> (<em>Controlled-experiment Using Pre-Experiment Data</em>): kurangi variansi dengan data <em>sebelum</em> eksperimen. Ide: Y_adj = Y − θ(X − X̄), dengan X = metrik pre-eksperimen user yang sama (mis. spending 30 hari sebelum). Karena X berkorelasi dengan Y, variansi Y_adj &lt; variansi Y — <strong>sampel yang sama, power lebih besar</strong> (sering setara 30–50% tambahan sampel, gratis).</p>
<p><strong>Peeking</strong>: mengintip hasil tiap hari dan berhenti saat p &lt; 0,05. Ini <strong>menggelembungkan false positive</strong> dari 5% ke 20–30% (makin sering intip, makin parah). Solusi: <strong>fixed horizon</strong> (tentukan durasi di muka, jangan intip untuk keputusan) atau <strong>sequential testing</strong> (alpha spending / always-valid p-values — boleh intip, dengan aturan berhenti yang memperhitungkan pengintaian).</p>""",
"formulas": [
{"math": r"Y_{adj} = Y - \theta(X - \bar{X}) \quad;\quad \theta = \frac{\text{Cov}(Y,X)}{\text{Var}(X)}",
"symbols": [
"<Tex math={String.raw`Y`} />: metrik saat eksperimen (mis. spending selama test)",
"<Tex math={String.raw`X`} />: metrik pre-eksperimen user yang sama (spending 30 hari sebelum)",
"<Tex math={String.raw`\\theta`} />: koefisien regresi Y atas X — otomatis dari data",
"Efek: variansi turun sebesar (1 − ρ²); ρ=0,7 → variansi tinggal 51% → power naik drastis",
]},
],
"intuisi": "CUPED seperti <strong>menimbang badan dengan mengurangi berat pakaian</strong>: kamu tahu tiap orang pakai baju ~1kg (X), jadi berat terukur (Y) dikoreksi — hasil timbangan lebih presisi tanpa beli timbangan baru. Peeking seperti <strong>menimbang 10x lalu pilih angka terkecil</strong> — bukan berat badanmu yang turun, tapi kejujuranmu.",
"kapan": "CUPED: selalu jika ada data pre-eksperimen (gratis!). Sequential: jika bisnis menuntut keputusan cepat / intip tak terhindarkan — tapi pakai metode yang benar, bukan p-value biasa.",
"worked": {"title": "📐 Contoh: Simulasi peeking (klik untuk buka)",
"body": """<p>Simulasi 1.000 eksperimen A/A (tidak ada efek sungguhan). Aturan berhenti: cek tiap hari selama 14 hari, berhenti saat p &lt; 0,05.</p>
<p><strong>Hasil:</strong> ~230 dari 1.000 &ldquo;signifikan&rdquo; = <strong>false positive 23%</strong>, bukan 5%! Tanpa peeking (cek sekali di akhir): ~50/1.000 = 5% — sesuai teori.</p>
<p><strong>Pelajaran:</strong> dashboard yang bisa diintip tiap hari + budaya &ldquo;berhenti saat hijau&rdquo; = pabrik false positive. Solusi organisasi: kunci tanggal analisis di muka; yang boleh intip cuma <em>health check</em> (SRM, error), bukan hasil.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,5,7,10,14], y: [5,9,12,16,19,22,26], type: "scatter", mode: "lines+markers", marker: {color: "#ef4444"}, name: "dengan peeking"}, {x: [1,2,3,5,7,10,14], y: [5,5,5,5,5,5,5], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "tanpa peeking (5%)"}]""",
"title": "False positive vs frekuensi intip (simulasi A/A)",
"layout": """{xaxis: {title: "Jumlah intipan selama test"}, yaxis: {title: "False positive (%)"}, showlegend: true}""",
"cara": "Sumbu X = berapa kali kamu intip & boleh berhenti, Y = % eksperimen A/A (tanpa efek) yang 'signifikan'. Garis hijau = 5% yang dijanjikan teori.",
"interpretasi": "Makin sering intip, makin jauh dari 5% — 14x intip → 26% false positive. <strong>5x lipat janji teori.</strong> Inilah harga ketidaksabaran. Kalau organisasimu tidak bisa menahan diri, pakai sequential testing yang dirancang untuk diintip."},
],
},
{
"id": "beyond", "toc": "Beyond A/B: Bandit & Kuasi-Eksperimen",
"title": "Beyond A/B — Saat Randomisasi Tak Cukup atau Tak Mungkin",
"body": """<p><strong>Definisi.</strong> Tiga naik kelas: <strong>Multivariate (MVT)</strong> — uji banyak elemen sekaligus (headline × gambar × CTA) secara faktorial; butuh traffic besar (kombinasi meledak). <strong>Multi-armed bandit</strong> — alokasi traffic <em>adaptif</em>: yang menang dapat traffic lebih banyak <em>selama</em> test (explore vs exploit; Thompson sampling). Cocok untuk optimasi berkelanjutan, bukan untuk &ldquo;pembuktian&rdquo; ilmiah. <strong>Kuasi-eksperimen</strong> — saat randomisasi mustahil (harga, kebijakan kota): <strong>DiD</strong> (<em>difference-in-differences</em>: bandingkan perubahan treated vs kontrol) dan <strong>synthetic control</strong> (bangun &ldquo;kembaran sintetis&rdquo; dari banyak kontrol).</p>
<p>DiD butuh <strong>parallel trends</strong> (sebelum intervensi, tren keduanya sejajar) — cek visual, jangan asumsi.</p>""",
"formulas": [
{"math": r"\hat{\tau}_{DiD} = (\bar{Y}_{T,post} - \bar{Y}_{T,pre}) - (\bar{Y}_{C,post} - \bar{Y}_{C,pre})",
"symbols": [
"<Tex math={String.raw`\\hat{\\tau}_{DiD}`} />: estimasi efek kausal intervensi",
"<Tex math={String.raw`T/C`} />: grup treated / kontrol; pre/post: sebelum/sesudah",
"Logika: kurangi perubahan kontrol (tren umum) dari perubahan treated → sisa = efek",
"Asumsi kunci: parallel trends — tanpa intervensi, keduanya bergerak sejajar",
]},
],
"intuisi": "Bandit seperti <strong>penjudi cerdas</strong>: coba semua mesin slot sedikit-sedikit, lalu taruh koin lebih banyak di yang mulai gacor — tidak menunggu 1.000 tarikan untuk memutuskan. DiD seperti <strong>membandingkan dua tanaman</strong>: satu diberi pupuk, satu tidak — yang penting keduanya tumbuh di tanah & cuaca yang sama sebelumnya (parallel trends).",
"kapan": "MVT: traffic raksasa + banyak hipotesis UI. Bandit: optimasi konten/promo berjalan terus. DiD/synthetic: kebijakan/harga/wilayah yang tidak bisa diacak.",
"worked": {"title": "📐 Contoh: DiD promo ongkir kota (klik untuk buka)",
"body": """<p>Promo gratis ongkir di Bandung (treated), Jakarta kontrol. Order/hari: Bandung pre 1.000 → post 1.300 (+300). Jakarta pre 2.000 → post 2.100 (+100, tren umum naik).</p>
<p>DiD = (1.300−1.000) − (2.100−2.000) = 300 − 100 = <strong>+200 order/hari efek promo</strong>. Bukan +300 (itu mencampur tren umum).</p>
<p><strong>Cek parallel trends:</strong> 8 minggu sebelum promo, tren Bandung &amp; Jakarta sejajar? Jika Bandung memang sedang naik lebih cepat (mis. ada festival), DiD overestimate — pakai synthetic control dari banyak kota.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "p &lt; 0,05 berarti efeknya nyata dan penting. Hijau = menang.",
"benar": "p-value menjawab &lsquo;bisakah ini noise?&rsquo; — <strong>bukan</strong> &lsquo;apakah ini penting?&rsquo;. Efek +0,1% bisa p&lt;0,001 dengan sampel raksasa (nyata tapi tidak worth effort). Selalu laporkan <strong>efek + confidence interval</strong>: &lsquo;+2,1% (95% CI: +0,3% s.d. +3,9%)&rsquo; — baru diskusikan penting tidaknya secara bisnis."},
{"t": "Berhenti saat signifikan itu efisien — ngapain nunggu durasi penuh?",
"benar": "Itu <strong>peeking</strong>: false positive 5% → 20–30%. &lsquo;Efisiensi&rsquo; ini membeli keputusan salah. Efisiensi yang benar: <strong>CUPED</strong> (variansi turun gratis), <strong>MDE realistis</strong> (jangan kejar 0,5%), atau <strong>sequential testing</strong> yang memang dirancang boleh intip. Tidak ada jalan pintas dari p-value biasa."},
],
"tips": [
"<strong>Satu metrik primer + guardrail.</strong> Lima metrik primer = lima kesempatan false positive (multiple testing!). Pilih SATU yang menentukan keputusan; sisanya guardrail (tidak boleh rusak) & diagnostik. Kalau semua 'penting', tidak ada yang penting.",
"<strong>Novelty & seasonality effect itu nyata.</strong> Efek minggu pertama sering memudar (user penasaran, bukan suka). Jalankan minimal 1–2 siklus bisnis penuh (termasuk weekend/gajian) dan pertimbangkan 'holdout' pasca-rollout untuk efek jangka panjang.",
],
"labs": [
{"heading": "Kalkulator Power & Durasi",
"intro": "Hitung sampel & durasi dari baseline, MDE, dan traffic. Rasakan tradeoff MDE vs waktu.",
"title": "Lab 1 — Kalkulator Power",
"hint": "Ubah MDE 1.0 → 0.5. Durasi 4x lipat! Tanyakan: apakah efek 0,5 poin worth 4x waktu?",
"code": """import math
# Kalkulator ukuran sampel & durasi A/B test
baseline = 0.10   # conversion kontrol
mde_poin = 1.0    # efek terkecil yg penting (poin persentase)
traffic  = 20000  # user/hari (total, dibagi 2 grup)

p = baseline
var = p * (1 - p)
mde = mde_poin / 100
n_grup = 16 * var / (mde ** 2)   # power 80%, alpha 5%
durasi = 2 * n_grup / traffic

print(f"Baseline   : {p:.0%}")
print(f"MDE        : {mde_poin} poin ({mde_poin/p:.0%} relatif)")
print(f"n per grup : {n_grup:,.0f}")
print(f"Durasi     : {durasi:.1f} hari")
print()
print("Catatan: ini untuk metrik biner tanpa CUPED.")
print("Dengan CUPED (rho=0.7), durasi ~ separuhnya.")
"""},
{"heading": "Simulasi Peeking vs Fixed Horizon",
"intro": "Buktikan sendiri: 500 eksperimen A/A, bandingkan false positive peeking vs sekali-cek.",
"title": "Lab 2 — Simulasi Peeking",
"hint": "Ubah N_INTIP 7 → 14. False positive naik lagi. Inilah 'pajak ketidaksabaran'.",
"code": """import random, math
random.seed(99)

def p_value(n1, x1, n2, x2):
    # uji z dua proporsi (pendekatan)
    p1, p2 = x1/n1, x2/n2
    p_pool = (x1+x2)/(n1+n2)
    se = math.sqrt(p_pool*(1-p_pool)*(1/n1+1/n2))
    z = (p1-p2)/se if se else 0
    # p-value dua sisi via normal CDF (aproksimasi)
    Phi = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))
    return 2*(1-Phi(abs(z)))

N_INTIP = 7
fp_peek = fp_fixed = 0
N_EXP = 500
for _ in range(N_EXP):
    # A/A: tidak ada efek (p=10% kedua grup)
    sig_peek = False
    for hari in range(1, N_INTIP+1):
        n = 2000*hari
        x1 = sum(random.random() < 0.10 for _ in range(n))
        x2 = sum(random.random() < 0.10 for _ in range(n))
        if p_value(n, x1, n, x2) < 0.05:
            sig_peek = True
            break
    fp_peek += sig_peek
    n = 2000*N_INTIP
    x1 = sum(random.random() < 0.10 for _ in range(n))
    x2 = sum(random.random() < 0.10 for _ in range(n))
    fp_fixed += p_value(n, x1, n, x2) < 0.05

print(f"Eksperimen A/A: {N_EXP}")
print(f"False positive (peeking tiap hari): {fp_peek/N_EXP:.1%}")
print(f"False positive (cek sekali akhir) : {fp_fixed/N_EXP:.1%}")
print("Teori menjanjikan 5%. Peeking mengkhianatinya.")
"""},
],
"decisions": [
{"kondisi": "Traffic cukup, butuh bukti kausal yang bersih", "pakai": "A/B fixed-horizon + CUPED",
"alasan": "Standar emas; CUPED memberi power gratis dari data pre-eksperimen.",
"contoh": "Uji checkout, pricing, onboarding."},
{"kondisi": "Organisasi tidak bisa menahan diri untuk tidak intip", "pakai": "Sequential testing (alpha spending)",
"alasan": "Dirancang untuk diintip — aturan berhenti memperhitungkan pengintaian.",
"contoh": "Tim growth yang 'harus lapor tiap hari'."},
{"kondisi": "Optimasi berkelanjutan, bukan pembuktian", "pakai": "Multi-armed bandit",
"alasan": "Traffic mengalir ke pemenang selama test — minim opportunity cost.",
"contoh": "Rotasi kreatif iklan, headline artikel."},
{"kondisi": "Randomisasi mustahil (harga, wilayah, kebijakan)", "pakai": "DiD / synthetic control",
"alasan": "Kausalitas tanpa acak — dengan asumsi parallel trends yang dicek.",
"contoh": "Promo per kota, perubahan harga, regulasi."},
],
"rule10": "<ol><li><strong>Hipotesis + 1 metrik primer</strong> sebelum mulai.</li><li><strong>Durasi dari power analysis</strong> — kunci tanggal analisis.</li><li><strong>Jangan intip untuk keputusan</strong> (atau pakai sequential).</li><li><strong>Laporkan efek + CI</strong>, bukan cuma p-value.</li></ol>",
"case": {"toc": "Mini-Case: Tombol Hijau PayKu",
"title": "Tombol Hijau yang 'Menang'",
"body": """<p>PayKu: tombol hijau vs biru. Intip tiap hari, hari ke-5 p=0,03 (+12%), rollout 100%. Sebulan kemudian conversion −4%. Traffic 20.000/hari, baseline 10%.</p>""",
"q": "(a) Tiga dosa eksperimennya? (b) Jika MDE bisnis = 1 poin, berapa durasi yang benar? (c) Desain ulang test yang valid dalam 3 langkah?",
"pembahasan": """<p>(a) <strong>Peeking</strong> (berhenti saat signifikan → false positive ~25%), <strong>novelty effect</strong> (+12% minggu pertama belum tentu permanen), <strong>tidak ada guardrail</strong> (mungkin metrik lain rusak).</p>
<p>(b) n/grup ≈ 16×0,09/0,01² = 14.400 → durasi ≈ <strong>1,5 hari</strong> (traffic besar!). Ironis: mereka <em>kelebihan</em> durasi tapi tetap salah karena peeking. Durasi cukup ≠ valid.</p>
<p>(c) <strong>(1)</strong> Hipotesis + MDE 1 poin + metrik primer (conversion checkout) + guardrail (drop-off pembayaran). <strong>(2)</strong> Fixed horizon 14 hari (2 siklus mingguan, tangkap novelty decay) + CUPED dari histori user. <strong>(3)</strong> Kunci tanggal analisis; intip hanya untuk health check (SRM). Rollout bertahap 10%→50%→100% dengan holdout 5% untuk efek jangka panjang.</p>"""},
"quiz": [
{"q": "Tim intip dashboard tiap hari dan berhenti saat p &lt; 0,05. False positive menjadi?",
"options": ["Tetap 5%", "~20-30% (peeking inflation)", "0%", "100%"], "correct": 1,
"why": "Benar: tiap intipan = kesempatan tambahan false positive. Simulasi: 7x intip → ~19%, 14x → ~26%. Solusi: fixed horizon atau sequential testing."},
{"q": "Baseline 10%, MDE 1 poin → n/grup 14.400. Jika MDE diperkecil jadi 0,5 poin, n menjadi?",
"options": ["7.200 (separuh)", "14.400 (tetap)", "57.600 (4x lipat)", "28.800 (2x lipat)"], "correct": 2,
"why": "Benar: n ∝ 1/MDE² — MDE separuh → sampel 4x. Inilah kenapa MDE harus dari bisnis ('worth effort'), bukan asal kecil."},
{"q": "CUPED memberi manfaat apa?",
"options": ["Menambah traffic", "Mengurangi variansi via data pre-eksperimen → power naik gratis", "Mengganti randomisasi", "Mempercepat website"], "correct": 1,
"why": "Benar: Y_adj = Y − θ(X−X̄). Dengan ρ=0,7, variansi tinggal ~51% — setara menambah sampel ~2x, tanpa user tambahan."},
{"q": "Kapan memakai DiD dibanding A/B?",
"options": ["Selalu — lebih mudah", "Saat randomisasi mustahil (harga, wilayah, kebijakan)", "Traffic kecil", "Tidak pernah"], "correct": 1,
"why": "Benar: DiD untuk intervensi yang tidak bisa diacak. Syarat: parallel trends (dicek, bukan diasumsi). A/B tetap standar emas jika randomisasi mungkin."},
{"q": "p=0,001 dengan efek +0,1% pada sampel 10 juta. Kesimpulan?",
"options": ["Menang besar — rollout!", "Nyata secara statistik tapi mungkin tidak penting secara bisnis; lihat CI & nilai rupiah", "Pasti false positive", "Ulangi test"], "correct": 1,
"why": "Benar: p-value ≠ penting. +0,1% yang 'signifikan' bisa bernilai Rp0 setelah biaya implementasi. Laporkan efek + CI, lalu tanya: worth effort?"},
],
"rangkum": [
"<strong>A/B valid</strong>: hipotesis dulu, 1 metrik primer + guardrail, randomisasi per user, durasi dari power analysis.",
"<strong>Power & MDE</strong>: n ≈ 16σ²/MDE²; MDE dari bisnis; MDE separuh = sampel 4x.",
"<strong>CUPED</strong>: koreksi dengan data pre-eksperimen → variansi turun (1−ρ²) → power gratis.",
"<strong>Peeking</strong>: intip + berhenti saat signifikan → false positive 5% → 20–30%. Fixed horizon atau sequential.",
"<strong>Beyond A/B</strong>: MVT (banyak elemen, traffic besar), bandit (optimasi berjalan), DiD/synthetic control (randomisasi mustahil).",
"<strong>Laporkan efek + CI</strong>, bukan cuma p-value. Novelty & seasonality: jalankan 1–2 siklus penuh.",
],
"prev": ["mk8-rekomendasi", "MK8"],
"next": ["mk10-incrementality", "MK10"],
},
]
