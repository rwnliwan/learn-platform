# Track 6 — MK4, MK5, MK6
LESSONS = [
{
"slug": "mk4-segmentasi", "id": "MK4", "track": "Marketing Data Analytics",
"title_html": "Segmentasi:<br/>K-means, GMM, dan Persona yang Hidup",
"title_plain": "Segmentasi: K-means, GMM, Persona",
"chapter_summary": "Segmentasi pelanggan dengan K-means (WCSS, elbow, standardisasi) dan Gaussian Mixture Model (soft assignment, BIC), lalu mengubah cluster menjadi persona yang bisa dieksekusi tim marketing. Termasuk lab K-means from-scratch dan uji stabilitas.",
"tujuan": [
"Menjelaskan cara kerja K-means dan memilih k dengan elbow + logika bisnis.",
"Menjelaskan kapan GMM lebih tepat dari K-means (soft assignment, bentuk cluster).",
"Melakukan standardisasi yang benar sebelum clustering dan menjelaskan kenapa wajib.",
"Mengubah output cluster menjadi persona: profil, ukuran, nama, dan aksi marketing.",
],
"story_title": "Cerita: Empat Cluster yang Tidak Dipakai Siapa Pun",
"story": """<p>Tim data <em>&ldquo;BankNusa&rdquo;</em> bangga menyerahkan hasil clustering: <strong>7 cluster nasabah</strong> dengan silhouette score 0,62 — bagus secara teknis. Tim marketing menatap slide itu, lalu bertanya: <em>&ldquo;Jadi cluster 4 dikirimi apa? Bedanya dengan cluster 6 apa?&rdquo;</em> Hening. Tidak ada yang bisa menjawab — karena cluster dibentuk dari 40 fitur tanpa profiling, tanpa nama, tanpa aksi.</p>
<p>Twist-nya: <strong>cluster yang benar secara matematis bisa tidak berguna secara bisnis</strong>. Enam bulan kemudian, analis baru mengulang dengan 8 fitur RFM + demografis, k=4, tiap cluster diberi nama (&ldquo;Sultan Sepi&rdquo;, &ldquo;Anak Gajian&rdquo;…) + satu aksi spesifik. Kampanye pertama dari persona itu menaikkan response rate 3x. Lesson ini: clustering bukan soal algoritma tercanggih — soal <strong>cluster yang bisa dieksekusi</strong>.</p>""",
"concepts": [
{
"id": "kmeans", "toc": "K-means — Si Pembagi Wilayah",
"title": "K-means — Si Pembagi Wilayah yang Tegas",
"body": """<p><strong>Definisi.</strong> <strong>K-means</strong> membagi data menjadi k kelompok dengan meminimalkan <strong>WCSS</strong> (<em>within-cluster sum of squares</em>): jumlah kuadrat jarak tiap titik ke pusat cluster-nya. Algoritma Lloyd: (1) pilih k pusat awal, (2) tugaskan tiap titik ke pusat terdekat, (3) geser pusat ke rata-rata anggotanya, (4) ulangi sampai stabil.</p>
<p>Tiga hal yang menentukan hasil: <strong>standardisasi</strong> (fitur dengan skala besar — mis. total belanja jutaan vs frekuensi satuan — akan mendominasi jarak; selalu z-score dulu), <strong>inisisasi</strong> (k-means++ memilih pusat awal yang menyebar — jangan random buta), dan <strong>pemilihan k</strong> (elbow: plot WCSS vs k, pilih &ldquo;siku&rdquo; di mana penurunan melandai — plus akal bisnis).</p>""",
"formulas": [
{"math": r"J = \sum_{k=1}^{K}\sum_{x_i \in C_k} \lVert x_i - \mu_k \rVert^2",
"symbols": [
"<Tex math={String.raw`J`} />: WCSS — total &lsquo;ketidakrapatan&rsquo; yang diminimalkan",
"<Tex math={String.raw`C_k`} />: anggota cluster ke-k",
"<Tex math={String.raw`\\mu_k`} />: pusat (centroid) cluster ke-k",
"<Tex math={String.raw`\\lVert x_i - \\mu_k \\rVert^2`} />: kuadrat jarak Euclidean titik ke pusatnya — K-means hanya paham jarak lurus",
]},
],
"intuisi": "K-means seperti <strong>membagi kota jadi k kecamatan</strong> supaya tiap warga dekat ke kantor kecamatannya. Tegas (satu warga = satu kecamatan), cepat, tapi buta bentuk: ia selalu menggambar kecamatan <strong>melingkar</strong> — kalau permukimanmu memanjang mengikuti sungai, hasilnya aneh.",
"kapan": "Cluster berbentuk bola, butuh hasil cepat &amp; mudah dijelaskan, fitur numerik sudah distandardisasi. Standar awal segmentasi pelanggan (mulai dari RFM).",
"worked": {"title": "📐 Contoh langkah-demi-langkah: 1 iterasi K-means (klik untuk buka)",
"body": """<p>Data (belanja/bln jt, transaksi/bln): A(1,2), B(1,3), C(9,20), D(10,22). k=2. Pusat awal: &mu;1=A(1,2), &mu;2=C(9,20).</p>
<p><strong>Langkah 1 — tugaskan:</strong> jarak B ke &mu;1 = &radic;((1-1)&sup2;+(3-2)&sup2;) = 1; ke &mu;2 = &radic;(64+289) ≈ 18,8 → B ikut cluster 1. D ke &mu;1 ≈ 21,9; ke &mu;2 ≈ 2,2 → cluster 2.</p>
<p><strong>Langkah 2 — geser pusat:</strong> &mu;1 = rata-rata(A,B) = (1, 2,5); &mu;2 = rata-rata(C,D) = (9,5, 21).</p>
<p><strong>Langkah 3 — ulangi</strong> sampai tidak ada titik pindah. Hasil: klaster 1 = A,B vs klaster 2 = C,D — cluster hemat vs cluster boros. Sederhana, tapi perhatikan: tanpa standardisasi, fitur &ldquo;transaksi&rdquo; (2 vs 22) mendominasi &ldquo;belanja&rdquo; (1 vs 10).</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8], y: [980, 520, 310, 220, 180, 160, 150, 145], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "WCSS"}, {x: [3,3], y: [0, 980], type: "scatter", mode: "lines", line: {dash: "dash", color: "#e8a838"}, name: "siku (k=3)"}]""",
"title": "Elbow method: WCSS vs jumlah cluster",
"layout": """{xaxis: {title: "k (jumlah cluster)"}, yaxis: {title: "WCSS"}, showlegend: true}""",
"cara": "Sumbu X = jumlah cluster, Y = WCSS (makin kecil = cluster makin rapat). Cari titik &lsquo;siku&rsquo; — setelahnya penambahan cluster hanya menurunkan WCSS sedikit.",
"interpretasi": "Penurunan tajam 1→3, lalu melandai setelah k=3 (garis kuning). k=3 = titik manis: menambah cluster ke-4 dst. hanya memberi perbaikan marginal. Catatan: siku tidak selalu sejelas ini — kalau landai semua, pakai logika bisnis (berapa persona yang sanggup dilayani tim?)."},
{"data": """[{x: [1,1.2,0.8,2,9,10,9.5,11,5,5.5,4.8], y: [2,3,2.5,3.5,20,22,21,23,12,11,13], mode: "markers", marker: {color: ["#2a7de1","#2a7de1","#2a7de1","#2a7de1","#e8a838","#e8a838","#e8a838","#e8a838","#16a34a","#16a34a","#16a34a"], size: 12}, type: "scatter"}]""",
"title": "Hasil K-means k=3 pada data belanja",
"layout": """{xaxis: {title: "Belanja per bulan (jt)"}, yaxis: {title: "Transaksi per bulan"}, showlegend: false}""",
"cara": "Tiap titik = pelanggan. Warna = cluster. Sumbu X = belanja, Y = frekuensi transaksi.",
"interpretasi": "Tiga kelompok alami: biru (hemat, jarang), kuning (boros, sering), hijau (tengah). Inilah calon persona: &lsquo;Anak Gajian&rsquo; (biru), &lsquo;Sultan&rsquo; (kuning), &lsquo;Kelas Menengah&rsquo; (hijau). Perhatikan cluster hijau — tanpa standardisasi ia bisa tertelan cluster kuning."},
],
},
{
"id": "gmm", "toc": "GMM — Si Diplomat Lunak",
"title": "GMM — Si Diplomat yang Tidak Tegas",
"body": """<p><strong>Definisi.</strong> <strong>Gaussian Mixture Model</strong> menganggap data lahir dari campuran k distribusi Gaussian. Bedanya dengan K-means: assignment-nya <strong>lunak</strong> (<em>soft</em>) — tiap titik punya <em>probabilitas</em> menjadi anggota tiap cluster (mis. 70% cluster A, 30% cluster B), bukan vonis mutlak. Tiap cluster punya bentuk sendiri (kovarians penuh: bisa lonjong, miring, bukan cuma bola).</p>
<p>Parameter: <Tex math={String.raw`\\pi_k`} /> (bobot campuran), <Tex math={String.raw`\\mu_k`} /> (pusat), <Tex math={String.raw`\\Sigma_k`} /> (bentuk sebaran). Dipilih dengan <strong>BIC</strong> (<em>Bayesian Information Criterion</em>): makin kecil makin baik — BIC menghukum kompleksitas, jadi tidak asal tambah cluster.</p>""",
"formulas": [
{"math": r"p(x) = \sum_{k=1}^{K} \pi_k \, \mathcal{N}(x \mid \mu_k, \Sigma_k)",
"symbols": [
"<Tex math={String.raw`p(x)`} />: peluang melihat titik x dari campuran ini",
"<Tex math={String.raw`\\pi_k`} />: proporsi populasi cluster k (jumlah semua = 1)",
"<Tex math={String.raw`\\mathcal{N}(x \\mid \\mu_k, \\Sigma_k)`} />: Gaussian dengan pusat &mu;k dan bentuk &Sigma;k — &Sigma; inilah yang membuat cluster bisa lonjong/miring",
"Output: &gamma;(zik) = probabilitas titik i milik cluster k — bukan 0/1 seperti K-means",
]},
],
"intuisi": "Kalau K-means adalah <strong>hakim yang memvonis</strong> (kamu warga kecamatan A, titik), GMM adalah <strong>diplomat</strong> (kamu 70% A, 30% B). Untuk pelanggan perbatasan — mis. yang belanjanya kadang hemat kadang boros — vonis mutlak itu kejam dan salah.",
"kapan": "Cluster tumpang tindih / bentuk tidak bola (mis. segmen &lsquo;naik kelas&rsquo; yang memanjang), atau kamu butuh skor keanggotaan untuk prioritas (prospek 90% &lsquo;hampir Sultan&rsquo;). Harga: lebih lambat, lebih sulit dijelaskan ke non-teknis.",
"worked": {"title": "📐 Contoh: Kapan GMM menang (klik untuk buka)",
"body": """<p>Dua segmen memanjang: &ldquo;Anak kos naik kelas&rdquo; (belanja naik pelan, transaksi naik cepat — cluster miring) dan &ldquo;Sultan stabil&rdquo; (bola di kanan atas). K-means memotong miring itu jadi dua bola — salah. GMM dengan kovarians penuh mengikuti kemiringan — benar.</p>
<p><strong>Aturan praktis:</strong> jalankan K-means dulu (cepat, baseline). Jika visual 2D menunjukkan cluster lonjong/tumpang tindih, naik ke GMM. Jika hasilnya mirip, tetap di K-means — lebih mudah dijelaskan ke CMO.</p>"""},
"charts": [],
},
{
"id": "persona", "toc": "Dari Cluster ke Persona",
"title": "Dari Cluster ke Persona — Cluster Tanpa Aksi = Dekorasi",
"body": """<p><strong>Definisi.</strong> <strong>Persona</strong> = cluster yang diberi <strong>profil</strong> (rata-rata tiap fitur: umur, belanja, frekuensi), <strong>ukuran</strong> (% populasi + nilai revenue), <strong>nama</strong> yang mudah diingat (&ldquo;Sultan Sepi&rdquo; lebih menempel dari &ldquo;Cluster 3&rdquo;), dan <strong>satu aksi marketing</strong> spesifik. Tanpa keempatnya, cluster = dekorasi slide.</p>
<p><strong>Validasi stabilitas:</strong> jalankan clustering 10x (atau di dua periode) — apakah anggota cluster stabil (&gt;80% tetap)? Cluster yang berganti-ganti anggota tiap run = artefak algoritma, bukan segmen nyata. Juga: uji <strong>actionability</strong> — bisakah tim menjangkau segmen ini secara berbeda? Kalau tidak, gabungkan.</p>""",
"formulas": [],
"intuisi": "Cluster adalah <strong>temuan statistik</strong>, persona adalah <strong>karakter bisnis</strong>. Analis menemukan cluster; analis + marketing melahirkan persona. Nama yang bagus (&ldquo;Anak Gajian&rdquo;) membuat seluruh perusahaan — dari CS sampai direksi — bicara dalam bahasa yang sama.",
"kapan": "Selalu akhiri proyek segmentasi dengan tabel persona 1 halaman: nama, ukuran, profil 3 baris, 1 aksi. Itulah deliverable-nya — bukan silhouette score.",
"worked": {"title": "📐 Contoh: Tabel persona BankNusa (klik untuk buka)",
"body": """<p><strong>1. &ldquo;Sultan Sepi&rdquo;</strong> (8% nasabah, 45% revenue): saldo &gt; Rp500jt, transaksi 2x/bln. Aksi: relationship manager personal + undangan private — JANGAN kirim promo massal (merusak eksklusivitas).</p>
<p><strong>2. &ldquo;Anak Gajian&rdquo;</strong> (45% nasabah, 15% revenue): saldo 1–5jt, transaksi 25x/bln, gaji masuk tiap tanggal 25. Aksi: fitur auto-save &ldquo;sisihkan 10% gajian&rdquo; + cashback merchant makan.</p>
<p><strong>3. &ldquo;Kelas Menengah Naik&rdquo;</strong> (30%): saldo 10–50jt, tren naik. Aksi: penawaran KPR/investasi — mereka dalam perjalanan ke Sultan.</p>
<p><strong>4. &ldquo;Penumpang Gelap&rdquo;</strong> (17%): saldo &lt; Rp500rb, 0 transaksi 6 bulan. Aksi: dormansi — reaktivasi murah atau biarkan (jangan bakar biaya akuisisi ulang).</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Elbow method selalu memberi jawaban jelas — tinggal lihat sikunya.",
"benar": "Elbow sering <strong>landai tanpa siku tegas</strong> (terutama data berdimensi tinggi). Jangan memaksa melihat siku yang tidak ada. Pakai tiga penentu: (1) elbow/BIC sebagai kandidat, (2) stabilitas antar run, (3) <strong>akal bisnis</strong> — berapa segmen yang sanggup dilayani tim marketing dengan pesan berbeda? 7 cluster untuk tim 3 orang = 4 cluster akan diabaikan."},
{"t": "Cluster = persona. Algoritma sudah mengelompokkan, tugas selesai.",
"benar": "Cluster = <strong>bahan mentah</strong>. Kasus BankNusa: 7 cluster benar secara matematis, nol yang bisa dieksekusi. Persona butuh profiling + nama + ukuran + aksi — dan validasi: apakah cluster ini <em>reachable</em> (bisa dijangkau dengan pesan berbeda) dan <em>substantial</em> (cukup besar untuk worth effort)? Kalau tidak, gabungkan atau buang."},
],
"tips": [
"<strong>Standardisasi sebelum clustering — tanpa kecuali.</strong> Fitur &lsquo;total belanja (jutaan)&rsquo; vs &lsquo;frekuensi (satuan)&rsquo;: tanpa z-score, jarak Euclidean 99% ditentukan belanja. Satu baris StandardScaler (atau hitung manual) mengubah hasil total. Cek: bandingkan cluster sebelum/sesudah standardisasi di Lab 1.",
"<strong>Fitur sedikit tapi bermakna &gt; fitur banyak tapi berisik.</strong> 40 fitur mentah memberi cluster yang &lsquo;benar&rsquo; tapi tak terjelaskan (kasus BankNusa). Mulai dari 6–10 fitur RFM + demografis + perilaku kunci. Aturan: tiap fitur harus bisa kamu jelaskan kenapa ia membedakan pelanggan.",
],
"labs": [
{"heading": "K-means From-Scratch + Elbow",
"intro": "Implementasi Lloyd's algorithm murni stdlib pada data RFM sintetis. Lihat WCSS turun per k, dan bandingkan hasil dengan/tanpa standardisasi.",
"title": "Lab 1 — K-means From-Scratch",
"hint": "Ubah STANDARDISASI = False → True. Perhatikan cluster berubah total. Itulah kenapa tips #1 wajib.",
"code": """import random, math
random.seed(7)

# data sintetis: (belanja_jt/bln, transaksi/bln)
data = [(1,2),(1.2,3),(.8,2.5),(2,3.5),(1.5,2),
        (9,20),(10,22),(9.5,21),(11,23),(8.5,19),
        (5,12),(5.5,11),(4.8,13),(5.2,10)]
STANDARDISASI = True  # ubah ke False dan bandingkan!

def stand(d):
    n = len(d); m = [sum(c)/n for c in zip(*d)]
    s = [math.sqrt(sum((r[i]-m[i])**2 for r in d)/n) for i in range(2)]
    return [[(r[i]-m[i])/s[i] for i in range(2)] for r in d]

X = stand(data) if STANDARDISASI else [list(r) for r in data]

def kmeans(X, k, iters=20):
    cent = random.sample(X, k)
    for _ in range(iters):
        cl = [[] for _ in range(k)]
        for x in X:
            j = min(range(k), key=lambda j: sum((x[d]-cent[j][d])**2 for d in range(2)))
            cl[j].append(x)
        baru = [[sum(c[d] for c in g)/len(g) for d in range(2)] if g else cent[j] for j, g in enumerate(cl)]
        if baru == cent: break
        cent = baru
    wcss = sum(sum((x[d]-cent[j][d])**2 for d in range(2)) for j, g in enumerate(cl) for x in g)
    return wcss, cl

print("k   WCSS")
for k in range(1, 7):
    w, _ = kmeans(X, k)
    print(f"{k}   {w:7.1f}")
print("\\nCari 'siku': k di mana penurunan melandai.")
"""},
{"heading": "Profiling Cluster → Persona",
"intro": "Dari hasil cluster, hitung profil tiap cluster (rata-rata fitur + ukuran) — bahan mentah tabel persona.",
"title": "Lab 2 — Profiler Cluster",
"hint": "Tambahkan fitur ketiga (mis. umur) ke data dan lihat profil berubah. Fitur apa yang paling membedakan cluster?",
"code": """# cluster hasil lab 1 (k=3), data asli (belanja_jt, transaksi)
data = [(1,2),(1.2,3),(.8,2.5),(2,3.5),(1.5,2),
        (9,20),(10,22),(9.5,21),(11,23),(8.5,19),
        (5,12),(5.5,11),(4.8,13),(5.2,10)]
# assignment manual sesuai visual (coba ubah!)
anggota = {"Hemat": [0,1,2,3,4], "Sultan": [5,6,7,8,9], "Menengah": [10,11,12,13]}

nama_persona = {"Hemat": "Anak Gajian", "Sultan": "Sultan", "Menengah": "Kelas Menengah Naik"}
aksi = {"Hemat": "auto-save gajian + cashback makan",
        "Sultan": "relationship manager, JANGAN promo massal",
        "Menengah": "tawarkan investasi/KPR"}

print(f"{'cluster':<9}{'n':>4} {'belanja':>9} {'transaksi':>10}  persona -> aksi")
for c, idx in anggota.items():
    b = sum(data[i][0] for i in idx)/len(idx)
    t = sum(data[i][1] for i in idx)/len(idx)
    print(f"{c:<9}{len(idx):>4} {b:>8.1f}jt {t:>9.1f}x  {nama_persona[c]} -> {aksi[c]}")
"""},
],
"decisions": [
{"kondisi": "Butuh segmentasi cepat, mudah dijelaskan ke direksi", "pakai": "K-means pada fitur RFM terstandardisasi",
"alasan": "Cepat, deterministik-ish, tiap pelanggan satu label tegas — mudah jadi tabel persona.",
"contoh": "Segmentasi awal e-commerce untuk kampanye 11.11."},
{"kondisi": "Cluster tumpang tindih / bentuk lonjong, atau butuh skor keanggotaan", "pakai": "GMM + BIC",
"alasan": "Soft assignment menangkap pelanggan perbatasan; kovarians mengikuti bentuk data.",
"contoh": "Segmen 'naik kelas' yang memanjang; scoring prospek prioritas sales."},
{"kondisi": "Tim kecil, butuh aksi minggu ini", "pakai": "RFM rule-based (MK3), bukan clustering",
"alasan": "Clustering butuh waktu validasi. RFM langsung jadi daftar target.",
"contoh": "Win-back campaign kilat: ambil segmen At Risk dari RFM."},
{"kondisi": "Hasil cluster tidak stabil antar run", "pakai": "Kurangi fitur / turunkan k / cek standardisasi",
"alasan": "Ketidakstabilan = sinyal fitur berisik atau k terlalu besar, bukan sinyal 'butuh algoritma canggih'.",
"contoh": "Dari 40 fitur → 8 fitur inti; silhouette & stabilitas naik."},
],
"rule10": "<ol><li><strong>Standardisasi dulu</strong> — selalu.</li><li><strong>Mulai K-means + elbow</strong>, naik ke GMM hanya jika perlu.</li><li><strong>Deliverable = tabel persona</strong> (nama, ukuran, profil, 1 aksi) — bukan skor teknis.</li></ol>",
"case": {"toc": "Mini-Case: 7 Cluster BankNusa",
"title": "7 Cluster yang Tidak Dipakai",
"body": """<p>BankNusa: 7 cluster dari 40 fitur, silhouette 0,62. Marketing tidak bisa menjawab &ldquo;cluster 4 dikirimi apa&rdquo;. Enam bulan terbuang. Analis baru mengulang: 8 fitur (RFM + usia + produk), k=4, tiap cluster punya nama + aksi. Response rate kampanye: <strong>2,1% → 6,4%</strong>.</p>""",
"q": "(a) Apa kesalahan utama pendekatan pertama? (b) Kenapa silhouette 0,62 tidak menyelamatkan? (c) Jika kamu hanya boleh menyimpan 1 cluster untuk kampanye, mana dan kenapa?",
"pembahasan": """<p>(a) <strong>Optimasi metrik teknis tanpa uji actionability.</strong> 40 fitur → cluster tak terjelaskan; tidak ada profiling, nama, aksi; tidak dilibatkan tim marketing sejak awal.</p>
<p>(b) Silhouette mengukur <strong>kerapatan geometris</strong>, bukan <strong>kegunaan bisnis</strong>. Cluster bisa rapat tapi tidak reachable (tidak bisa dijangkau dengan pesan berbeda) atau tidak substantial (terlalu kecil untuk worth effort).</p>
<p>(c) <strong>&ldquo;Kelas Menengah Naik&rdquo;</strong> — terbesar kedua, tren naik, responsif terhadap penawaran (KPR/investasi = revenue besar). Sultan memang paling bernilai per orang, tapi kecil dan butuh sentuhan personal mahal. Untuk kampanye massal, segmen menengah-naik memberi ROI tertinggi.</p>"""},
"quiz": [
{"q": "Fitur: total belanja (0–50 juta) dan frekuensi (1–30x). Tanpa standardisasi, apa yang terjadi di K-means?",
"options": ["Tidak ada masalah", "Jarak didominasi belanja; frekuensi hampir tidak berpengaruh", "Jarak didominasi frekuensi", "K-means error"], "correct": 1,
"why": "Benar: skala belanja (jutaan) vs frekuensi (puluhan) — jarak Euclidean 99% ditentukan belanja. Hasil cluster = 'pengelompokan belanja', bukan 'pengelompokan perilaku'. Z-score dulu, selalu."},
{"q": "Elbow curve landai tanpa siku jelas. Keputusan terbaik?",
"options": ["Paksa pilih titik yang 'kelihatan' siku", "Naikkan k sampai 20", "Pakai BIC/stabilitas + akal bisnis (berapa segmen sanggup dilayani?)", "Batalkan clustering"], "correct": 2,
"why": "Benar: siku yang tidak ada jangan dipaksa. Kombinasikan kriteria statistik (BIC, stabilitas) dengan kendala operasional — 7 cluster untuk tim 3 orang = 4 akan diabaikan."},
{"q": "Kapan GMM lebih tepat dari K-means?",
"options": ["Selalu — lebih canggih", "Cluster tumpang tindih / lonjong, atau butuh probabilitas keanggotaan", "Data kecil", "Tidak pernah"], "correct": 1,
"why": "Benar: keunggulan GMM = soft assignment + kovarians fleksibel. Kalau cluster-mu bola-bola terpisah rapi, K-means sudah cukup dan jauh lebih mudah dijelaskan."},
{"q": "Cluster stabil 95% antar run tapi marketing tidak bisa membuat pesan berbeda untuknya. Tindakan?",
"options": ["Pertahankan — stabil itu bagus", "Gabungkan dengan cluster tetangga / buang — tidak actionable", "Naikkan k", "Ganti ke GMM"], "correct": 1,
"why": "Benar: stabil ≠ berguna. Syarat segmen: reachable (bisa dijangkau berbeda) + substantial (worth effort). Cluster yang tidak bisa di-aksi-kan = dekorasi."},
{"q": "Deliverable akhir proyek segmentasi yang benar?",
"options": ["Silhouette score tertinggi", "Tabel persona: nama, ukuran, profil, 1 aksi per segmen", "Plot cluster 3D", "Jumlah cluster terbanyak"], "correct": 1,
"why": "Benar: yang dieksekusi tim adalah persona + aksinya, bukan metrik teknis. Satu halaman tabel persona &gt; 50 slide plot cluster."},
],
"rangkum": [
"<strong>K-means</strong>: minimalkan WCSS; wajib standardisasi; k-means++ untuk inisiasi; pilih k via elbow + akal bisnis.",
"<strong>GMM</strong>: soft assignment (probabilitas, bukan vonis) + kovarians fleksibel; pilih k via BIC; untuk cluster tumpang tindih/lonjong.",
"<strong>Persona</strong> = cluster + profil + ukuran + nama + 1 aksi. Tanpa aksi = dekorasi.",
"<strong>Validasi</strong>: stabilitas antar run (&gt;80% tetap) + actionability (reachable & substantial).",
"<strong>Fitur sedikit bermakna</strong> mengalahkan fitur banyak berisik.",
"<strong>Kapan TIDAK clustering</strong>: butuh aksi minggu ini (pakai RFM rule-based) atau segmen sudah jelas dari bisnis (pakai aturan).",
],
"prev": ["mk3-deskriptif", "MK3"],
"next": ["mk5-clv", "MK5"],
},
{
"slug": "mk5-clv", "id": "MK5", "track": "Marketing Data Analytics",
"title_html": "CLV:<br/>Menebak Nilai Seumur Hidup Pelanggan",
"title_plain": "CLV: BG/NBD, Gamma-Gamma, ML",
"chapter_summary": "Customer Lifetime Value: rumus dasar (margin, retention, discount), model probabilistik BG/NBD (buy-till-you-die) + Gamma-Gamma untuk monetary, dan pendekatan ML. Termasuk lab kalkulator CLV dan implementasi BG/NBD-lite.",
"tujuan": [
"Menghitung CLV dasar dari margin, retention rate, dan discount rate.",
"Menjelaskan intuisi BG/NBD: kenapa recency & frequency cukup untuk menebak 'masih hidup'.",
"Membedakan kapan memakai rumus sederhana vs BG/NBD vs pendekatan ML.",
"Memakai CLV untuk keputusan alokasi: berapa CAC maksimal per segmen/channel.",
],
"story_title": "Cerita: Dua Pelanggan, Satu 'Nilai' yang Salah",
"story": """<p>Manajer CRM <em>&ldquo;LakuKeras&rdquo;</em> punya dua pelanggan: <strong>Pak Budi</strong> — belanja Rp20 juta total, tapi terakhir beli 2 tahun lalu. <strong>Bu Ani</strong> — belanja Rp8 juta total, tapi beli tiap bulan dan terakhir minggu lalu. Sistem memberi label &ldquo;VIP&rdquo; ke Pak Budi (belanja historis lebih besar) dan tim mengiriminya concierge mahal + diskon besar.</p>
<p>Twist-nya: <strong>nilai historis ≠ nilai masa depan</strong>. Pak Budi sudah &ldquo;mati&rdquo; (tidak akan kembali), Bu Ani masih &ldquo;hidup&rdquo; dan akan belanja Rp8 juta <em>lagi</em> tahun depan. Uang concierge terbuang; Bu Ani tidak dapat apa-apa dan pindah ke kompetitor. <strong>CLV</strong> (<em>Customer Lifetime Value</em>) adalah ilmu menebak nilai <em>masa depan</em> — dan model terbaik untuk itu justru lahir dari dua angka sederhana: <strong>recency & frequency</strong>.</p>""",
"concepts": [
{
"id": "dasar", "toc": "Rumus Dasar CLV",
"title": "Rumus Dasar — Tiga Bahan, Satu Tebakan",
"body": """<p><strong>Definisi.</strong> <strong>CLV</strong> = total profit yang diharapkan dari satu pelanggan selama sisa hubungannya denganmu, didiskon ke nilai sekarang. Tiga bahan: <strong>margin per periode</strong> (m), <strong>retention rate</strong> (r — peluang bertahan tiap periode), <strong>discount rate</strong> (d — nilai waktu uang).</p>
<p>Dua dunia: <strong>kontrak</strong> (langganan — tahu persis kapan churn: tidak perpanjang) vs <strong>non-kontrak</strong> (ritel — pelanggan &ldquo;pergi&rdquo; diam-diam; butuh model probabilistik seperti BG/NBD).</p>""",
"formulas": [
{"math": r"CLV = \sum_{t=0}^{\infty} \frac{m \cdot r^t}{(1+d)^t} = \frac{m \cdot r}{1 + d - r}",
"symbols": [
"<Tex math={String.raw`m`} />: margin kotor per pelanggan per periode (Rp/bln)",
"<Tex math={String.raw`r`} />: retention rate per periode (0,9 = 90% bertahan tiap bulan)",
"<Tex math={String.raw`d`} />: discount rate per periode (0,01 = 1%/bln)",
"Rumus kanan = deret geometri tertutup — berlaku jika r &lt; 1+d (selalu, karena r ≤ 1)",
]},
],
"intuisi": "CLV seperti <strong>menilai pohon buah</strong>: bukan dari buah yang sudah dipetik (historis), tapi dari buah yang <em>akan</em> tumbuh (masa depan) — dikurangi peluang pohon mati (1−r) tiap musim. Pohon yang terakhir berbuah 2 tahun lalu kemungkinan sudah mati; yang berbuah tiap bulan masih subur.",
"kapan": "Kontrak/subscription dengan r stabil. Untuk non-kontrak (ritel), rumus ini hanya kasar — naik ke BG/NBD.",
"worked": {"title": "📐 Contoh: CLV Bu Ani vs Pak Budi (klik untuk buka)",
"body": """<p>Bu Ani: m = Rp400rb/bln, r = 0,95/bln, d = 0,01. CLV = 400.000 × 0,95 / (1 + 0,01 − 0,95) = 400.000 × 0,95 / 0,06 = <strong>Rp6,33 juta</strong>.</p>
<p>Pak Budi: terakhir beli 2 tahun lalu → r efektif ≈ 0 → CLV ≈ <strong>Rp0</strong> (sudah &ldquo;mati&rdquo;).</p>
<p>Sistem lama memberi VIP ke Pak Budi (historis Rp20jt). CLV memberi VIP ke Bu Ani (masa depan Rp6,3jt). <strong>Selisih keputusan = selisih definisi nilai.</strong></p>"""},
"charts": [
{"data": """[{x: ["Pak Budi (mati)", "Rata-rata", "Bu Ani (hidup)"], y: [0, 2.1, 6.33], type: "bar", marker: {color: ["#94a3b8","#e8a838","#2a7de1"]}, text: ["Rp0", "Rp2,1jt", "Rp6,3jt"], textposition: "outside"}]""",
"title": "CLV: historis vs masa depan",
"layout": """{yaxis: {title: "CLV (Rp juta)"}, showlegend: false}""",
"cara": "Tinggi batang = CLV prediksi (nilai masa depan). Bandingkan dengan label &lsquo;VIP historis&rsquo; yang dulu menunjuk Pak Budi.",
"interpretasi": "Pak Budi (belanja historis Rp20jt) CLV-nya nol — ia sudah pergi. Bu Ani (historis Rp8jt) CLV-nya Rp6,3jt — 3x rata-rata. Visual ini = alasan kenapa budget VIP harus pindah dari Budi ke Ani."},
],
},
{
"id": "bgnbd", "toc": "BG/NBD — Buy Till You Die",
"title": "BG/NBD — Tebakan Hidup-Mati dari Dua Angka",
"body": """<p><strong>Definisi.</strong> <strong>BG/NBD</strong> (Beta-Geometric / Negative Binomial Distribution, Fader-Hardie) adalah model untuk dunia <strong>non-kontrak</strong>: pelanggan membeli mengikuti proses Poisson (NBD mengatur beda frekuensi antar orang), dan setelah tiap pembelian ada peluang &ldquo;mati&rdquo; (dropout) yang mengikuti distribusi Beta-Geometric. Input cuma tiga: <strong>frequency</strong> (x), <strong>recency</strong> (t_x — kapan terakhir beli), <strong>umur</strong> (T — sejak pertama beli).</p>
<p>Intuisi kuncinya: <strong>recency mengalahkan frequency</strong> untuk menebak &ldquo;masih hidup&rdquo;. Beli 10x tapi terakhir 2 tahun lalu = kemungkinan besar mati. Beli 2x tapi minggu lalu = kemungkinan besar hidup. Model mengkuantifikasi firasat ini jadi <strong>P(alive)</strong> + prediksi pembelian masa depan.</p>""",
"formulas": [
{"math": r"P(\text{alive} \mid x, t_x, T) \;\; \text{naik jika } t_x \approx T \;\; \text{turun jika } t_x \ll T",
"symbols": [
"<Tex math={String.raw`x`} />: frequency — jumlah pembelian berulang (tidak termasuk pembelian pertama)",
"<Tex math={String.raw`t_x`} />: recency — waktu pembelian terakhir (dari awal observasi)",
"<Tex math={String.raw`T`} />: umur pelanggan — waktu sejak pembelian pertama",
"Aturan baca: t_x dekat T (baru beli) → P(alive) tinggi; t_x jauh dari T (lama tidak beli) → P(alive) rendah, <em>terlepas</em> dari x yang besar",
]},
],
"intuisi": "BG/NBD seperti <strong>dokter yang mendiagnosis dari dua gejala</strong>: &lsquo;kapan terakhir terlihat&rsquo; (recency) lebih menentukan dari &lsquo;berapa kali datang&rsquo; (frequency). Pasien yang 10x kontrol tapi 2 tahun tidak muncul = kemungkinan pindah RS. Yang 2x kontrol tapi minggu lalu datang = pasien aktif.",
"kapan": "Ritel/e-commerce non-kontrak dengan data transaksi (butuh x, t_x, T per pelanggan). Jangan pakai jika pembelian sangat musiman tanpa pola individual.",
"worked": {"title": "📐 Contoh: P(alive) Budi vs Ani (klik untuk buka)",
"body": """<p>Pak Budi: x=15, t_x=bulan ke-2, T=26 bulan → t_x ≪ T → <strong>P(alive) ≈ 3%</strong>. Mati.</p>
<p>Bu Ani: x=8, t_x=bulan ke-25, T=26 bulan → t_x ≈ T → <strong>P(alive) ≈ 92%</strong>. Hidup.</p>
<p>Perhatikan: Budi frequency-nya hampir 2x Ani, tapi recency membunuhnya. Inilah kenapa RFM (MK3) memberi bobot besar pada Recency — BG/NBD adalah versi probabilistik dari intuisi yang sama.</p>"""},
"charts": [],
},
{
"id": "ggml", "toc": "Gamma-Gamma & Pendekatan ML",
"title": "Gamma-Gamma & ML — Dari 'Berapa Kali' ke 'Berapa Rupiah'",
"body": """<p><strong>Definisi.</strong> BG/NBD memprediksi <strong>jumlah transaksi</strong> masa depan. <strong>Gamma-Gamma</strong> memprediksi <strong>nilai per transaksi</strong> (monetary): rata-rata belanja per pelanggan mengikuti Gamma antar individu. CLV = E[transaksi] × E[nilai] (asumsi keduanya independen — cek dulu!). <strong>Pendekatan ML</strong> (gradient boosting pada fitur RFM + tenure + kategori + tren) dipakai saat: banyak fitur non-transaksional (tiket CS, app usage), atau horizon pendek yang spesifik.</p>
<p>Aturan pemilihan: <strong>mulai dari BG/NBD + Gamma-Gamma</strong> (butuh sedikit data, terinterpretasi, benchmark kuat). Naik ke ML hanya jika fitur tambahan terbukti menambah akurasi di validasi out-of-time — kompleksitas harus dibayar dengan performa.</p>""",
"formulas": [
{"math": r"CLV_{12bln} = E[X_{12}] \times E[M] \times \text{margin}",
"symbols": [
"<Tex math={String.raw`E[X_{12}]`} />: ekspektasi jumlah transaksi 12 bulan ke depan (dari BG/NBD)",
"<Tex math={String.raw`E[M]`} />: ekspektasi nilai per transaksi (dari Gamma-Gamma)",
"margin: % yang jadi laba kotor",
"Validasi: bandingkan prediksi vs aktual di periode holdout — MAPE per decile CLV, bukan cuma rata-rata",
]},
],
"intuisi": "BG/NBD menjawab <strong>&lsquo;berapa kali lagi dia datang?&rsquo;</strong>, Gamma-Gamma menjawab <strong>&lsquo;tiap datang bawa berapa?&rsquo;</strong>. Kalikan = CLV. ML menjawab &lsquo;apa lagi yang kutahu tentang dia?&rsquo; — berguna, tapi jangan sampai 50 fitur menutupi sinyal sederhana recency.",
"kapan": "Gamma-Gamma: monetary per transaksi relatif stabil per orang. ML: ada fitur perilaku kaya (app, CS, web) + butuh horizon spesifik (CLV 90 hari untuk kampanye).",
"worked": {"title": "📐 Contoh: CLV 12 bulan Bu Ani (klik untuk buka)",
"body": """<p>BG/NBD: E[X_12] = 9,5 transaksi. Gamma-Gamma: E[M] = Rp850rb. Margin 40%.</p>
<p>CLV_12 = 9,5 × 850.000 × 0,4 = <strong>Rp3,23 juta</strong>.</p>
<p>Keputusan: CAC maksimal untuk segmen &ldquo;seperti Ani&rdquo; = CLV/3 ≈ <strong>Rp1,07 juta</strong> (aturan LTV:CAC ≥ 3 dari MK1). Channel yang CAC-nya Rp1,5jt untuk segmen ini = rugi — potong atau perbaiki.</p>"""},
"charts": [
{"data": """[{x: [0.5,1.5,2.5,3.5,4.5,6,8,12], y: [35,25,15,10,6,4,3,2], type: "bar", marker: {color: "#2a7de1"}, text: ["35%","25%","15%","10%","6%","4%","3%","2%"], textposition: "outside"}]""",
"title": "Distribusi CLV 12 bulan (jt Rp) — miring kanan",
"layout": """{xaxis: {title: "CLV 12 bulan (Rp juta)"}, yaxis: {title: "% pelanggan"}, showlegend: false}""",
"cara": "Sumbu X = nilai CLV, tinggi batang = % pelanggan. Perhatikan bentuknya.",
"interpretasi": "Distribusi <strong>miring kanan</strong>: 60% pelanggan CLV-nya di bawah Rp2,5jt, tapi 5% teratas (ekor kanan) menyumbang porsi revenue raksasa. Inilah kenapa CLV rata-rata menipu (ingat MK1!) — keputusan CAC harus per segmen CLV, bukan rata-rata."},
],
},
],
"myths": [
{"t": "CLV = total belanja historis pelanggan. Yang sudah belanja banyak = bernilai tinggi.",
"benar": "Historis = <strong>masa lalu</strong>, CLV = <strong>masa depan yang didiskon</strong>. Pak Budi (historis Rp20jt, mati) vs Bu Ani (historis Rp8jt, hidup, CLV Rp6,3jt). Keputusan berbasis historis memberi VIP ke orang yang sudah pergi. Selalu tanya: &lsquo;angka ini menebak masa depan, atau mencatat masa lalu?&rsquo;"},
{"t": "Model ML dengan 50 fitur pasti mengalahkan BG/NBD yang cuma pakai 3 angka.",
"benar": "BG/NBD adalah <strong>benchmark yang sangat kuat</strong> — sering menang lawan ML di data transaksi murni, dengan 1% kompleksitas. ML menang saat ada sinyal non-transaksional yang kuat (app usage, CS). Aturan: kalahkan dulu BG/NBD di validasi out-of-time sebelum bangga dengan 50 fitur."},
],
"tips": [
"<strong>Recency mengalahkan frequency untuk P(alive).</strong> Beli 15x tapi 2 tahun lalu = mati. Beli 2x tapi minggu lalu = hidup. Saat stakeholder protes &lsquo;kok dia CLV-nya rendah padahal belanja banyak?&rsquo;, tunjukkan t_x vs T.",
"<strong>CLV bukan angka — CLV adalah batas CAC.</strong> CLV Rp3,2jt artinya CAC maksimal Rp1,07jt (aturan ÷3). Presentasikan CLV selalu berpasangan dengan implikasi budget-nya, bukan sebagai angka pajangan.",
],
"labs": [
{"heading": "Kalkulator CLV + Sensitivitas Retention",
"intro": "Hitung CLV dasar dan lihat betapa sensitifnya ia terhadap retention — naik 5 poin retention bisa 2x lipat CLV.",
"title": "Lab 1 — Kalkulator CLV",
"hint": "Ubah r dari 0.90 → 0.95. Lihat CLV meledak. Inilah kenapa retensi 5 poin lebih berharga dari akuisisi 50%.",
"code": """# Kalkulator CLV dasar + sensitivitas retention
m = 400_000   # margin per pelanggan per bulan (Rp)
d = 0.01      # discount rate per bulan

print(f"{'retention':>10} {'CLV (Rp jt)':>12}  umur(pln)")
for r in [0.80, 0.85, 0.90, 0.95, 0.97]:
    clv = m * r / (1 + d - r)
    umur = 1 / (1 - r)
    print(f"{r:>10.2f} {clv/1e6:>12.2f}  {umur:5.1f} bln")

print("\\nBatas CAC sehat (CLV/3) pada r=0.95:", f"Rp{m*0.95/(1+d-0.95)/3:,.0f}")
"""},
{"heading": "BG/NBD-lite: Estimasi P(alive)",
"intro": "Implementasi sederhana intuisi BG/NBD: P(alive) turun seiring jarak t_x ke T. Bandingkan beberapa profil pelanggan.",
"title": "Lab 2 — Simulator P(alive)",
"hint": "Buat pelanggan dengan x=20 tapi t_x jauh dari T — lihat P(alive)-nya anjlok walau frequency tinggi. Recency wins.",
"code": """import math

def p_alive(x, t_x, T, k=3.0):
    # model sederhana: P(alive) ~ f(jarak t_x ke T, dengan koreksi x)
    # makin jauh t_x dari T -> makin kecil; x besar sedikit menahan
    gap = max(T - t_x, 0) / max(T, 1)
    dasar = math.exp(-k * gap)
    koreksi = min(x / 10, 1) * 0.15  # frequency tinggi sedikit menolong
    return min(dasar + koreksi * dasar, 1.0)

profil = [
    ("Pak Budi (mati?)", 15, 2, 26),
    ("Bu Ani (hidup?)",   8, 25, 26),
    ("Cici (baru)",        1, 26, 26),
    ("Dodi (loyal lama)", 30, 20, 26),
]
print(f"{'nama':<18}{'x':>4}{'t_x':>5}{'T':>4}  P(alive)")
for nama, x, tx, T in profil:
    print(f"{nama:<18}{x:>4}{tx:>5}{T:>4}  {p_alive(x, tx, T):>7.0%}")
print("\\nCatatan: ini versi sederhana untuk intuisi.")
print("BG/NBD asli mengestimasi parameter dari data via MLE.")
"""},
],
"decisions": [
{"kondisi": "Subscription/kontrak, retention stabil", "pakai": "Rumus dasar CLV (m·r/(1+d−r))",
"alasan": "Churn teramati jelas (tidak perpanjang). Sederhana, cukup akurat.",
"contoh": "SaaS, langganan gym, asuransi."},
{"kondisi": "Ritel non-kontrak, data transaksi rapi", "pakai": "BG/NBD + Gamma-Gamma",
"alasan": "Benchmark kuat, butuh sedikit fitur, terinterpretasi (P(alive) bisa dijelaskan).",
"contoh": "E-commerce, FMCG, fashion."},
{"kondisi": "Banyak sinyal non-transaksional + horizon spesifik", "pakai": "ML (GBM) dengan fitur RFM+",
"alasan": "Menangkap pola yang tidak ada di transaksi (app usage, komplain).",
"contoh": "CLV 90 hari untuk targeting kampanye; telco dengan data usage."},
{"kondisi": "Butuh jawaban hari ini untuk alokasi budget", "pakai": "CLV heuristik: segmen RFM × margin × umur",
"alasan": "80% manfaat dengan 20% usaha. Model sempurna bulan depan kalah dari heuristik hari ini.",
"contoh": "Batas CAC per segmen untuk rapat budget minggu ini."},
],
"rule10": "<ol><li><strong>Nilai = masa depan</strong>, bukan historis.</li><li><strong>Recency &gt; frequency</strong> untuk tebak &lsquo;masih hidup&rsquo;.</li><li><strong>CLV selalu berpasangan dengan batas CAC</strong> (÷3).</li></ol>",
"case": {"toc": "Mini-Case: Alokasi CAC per Channel",
"title": "Channel Mana yang Boleh Mahal?",
"body": """<p>LakuKeras: CLV 12 bulan per channel akuisisi — Organik Rp4,2jt; Search Rp3,1jt; Sosmed Rp1,8jt; Agregator diskon Rp0,9jt. CAC aktual: Organik Rp200rb; Search Rp800rb; Sosmed Rp900rb; Agregator Rp400rb. Budget total Rp1M/bln, direksi minta &ldquo;efisiensi&rdquo;.</p>""",
"q": "(a) Hitung rasio CLV:CAC tiap channel — mana yang sehat? (b) Jika harus potong Rp300jt, dari mana? (c) Channel mana yang boleh dinaikkan budget-nya?",
"pembahasan": """<p>(a) <strong>Rasio:</strong> Organik 21,0 (4,2jt/200rb) — sangat sehat; Search 3,9 — sehat; Sosmed 2,0 — marginal; Agregator 2,25 — marginal. Batas CAC sehat (=CLV/3): organik Rp1,4jt; search Rp1,03jt; sosmed Rp600rb; agregator Rp300rb.</p>
<p>(b) <strong>Potong dari agregator diskon</strong> (Rp400rb CAC vs batas Rp300rb = sudah rugi; CLV cuma Rp0,9jt) dan <strong>sosmed</strong> (CAC Rp900rb vs batas Rp600rb). Keduanya di atas batas sehat.</p>
<p>(c) <strong>Organik &amp; search</strong> — masih jauh di bawah batas CAC sehat. Naikkan bertahap sambil pantau CAC marginal (CAC naik saat scale — hukum diminishing return).</p>"""},
"quiz": [
{"q": "Pak Budi: historis Rp20jt, terakhir beli 2 thn lalu. Bu Ani: historis Rp8jt, beli tiap bulan. Siapa VIP menurut CLV?",
"options": ["Pak Budi — historis lebih besar", "Bu Ani — P(alive) tinggi, CLV masa depan besar", "Keduanya sama", "Tidak bisa ditentukan"], "correct": 1,
"why": "Benar: CLV menebak masa depan. Budi P(alive)≈3% → CLV≈0. Ani P(alive)≈92% → CLV Rp6,3jt. VIP berbasis historis = memberi karpet merah ke orang yang sudah pergi."},
{"q": "Dalam BG/NBD, untuk menebak 'masih hidup', yang paling menentukan?",
"options": ["Frequency tinggi", "Recency (t_x dekat T)", "Umur T yang panjang", "Ketiganya sama"], "correct": 1,
"why": "Benar: recency mengalahkan frequency. t_x ≈ T → kemungkinan besar masih hidup, berapa pun x-nya. Inilah intuisi yang dikuantifikasi model."},
{"q": "CLV 12 bulan Rp3,2jt. Berapa CAC maksimal yang sehat?",
"options": ["Rp3,2jt", "Rp1,07jt (CLV/3)", "Rp6,4jt", "Rp320rb"], "correct": 1,
"why": "Benar: aturan LTV:CAC ≥ 3 → CAC ≤ CLV/3 ≈ Rp1,07jt. CLV tanpa batas CAC = angka pajangan."},
{"q": "Kapan pendekatan ML lebih tepat dari BG/NBD?",
"options": ["Selalu — lebih modern", "Ada sinyal non-transaksional kuat + horizon spesifik, dan terbukti menang di validasi out-of-time", "Data sedikit", "Tidak pernah"], "correct": 1,
"why": "Benar: ML menang saat fitur tambahan (app, CS) membawa sinyal baru. Tanpa itu, BG/NBD (3 angka!) sering menang — selalu jadikan benchmark dulu."},
{"q": "Distribusi CLV miring kanan. Implikasi untuk alokasi budget?",
"options": ["Pakai CLV rata-rata untuk semua", "Alokasi per segmen CLV — rata-rata menutupi ekor bernilai", "Fokus ke CLV terendah", "Abaikan CLV"], "correct": 1,
"why": "Benar: rata-rata didominasi segelintir Sultan. Keputusan CAC per segmen menangkap ini; satu angka rata-rata membuat channel 'mahal tapi berisi Sultan' terlihat rugi."},
],
"rangkum": [
"<strong>CLV</strong> = nilai masa depan yang didiskon, bukan total historis. Rumus dasar: m·r/(1+d−r).",
"<strong>Kontrak vs non-kontrak</strong>: churn teramati vs &lsquo;pergi diam-diam&rsquo; (butuh model probabilistik).",
"<strong>BG/NBD</strong>: dari (x, t_x, T) → P(alive) + prediksi transaksi. Recency mengalahkan frequency.",
"<strong>Gamma-Gamma</strong>: prediksi nilai per transaksi. CLV = E[transaksi] × E[nilai] × margin.",
"<strong>ML</strong>: untuk sinyal non-transaksional + horizon spesifik; harus kalahkan BG/NBD dulu di validasi.",
"<strong>CLV selalu berpasangan dengan batas CAC</strong> (÷3) — tanpa itu, CLV cuma pajangan.",
],
"prev": ["mk4-segmentasi", "MK4"],
"next": ["mk6-churn", "MK6"],
},
{
"slug": "mk6-churn", "id": "MK6", "track": "Marketing Data Analytics",
"title_html": "Churn:<br/>Siapa yang Akan Pergi (dan Kenapa)",
"title_plain": "Churn: Klasifikasi vs Survival",
"chapter_summary": "Prediksi churn dua pendekatan: klasifikasi (fitur, imbalance, threshold berbasis biaya) dan survival analysis (Kaplan-Meier, hazard, censoring). Termasuk definisi churn yang operasional, lab KM from-scratch, dan perhitungan ROI kampanye retensi.",
"tujuan": [
"Mendefinisikan churn secara operasional untuk bisnis kontrak vs non-kontrak.",
"Membangun model klasifikasi churn dengan penanganan imbalance dan threshold berbasis biaya.",
"Menghitung dan membaca kurva Kaplan-Meier termasuk data tersensor.",
"Menghitung ROI kampanye retensi: kapan menyelamatkan pelanggan itu menguntungkan.",
],
"story_title": "Cerita: Model 95% Akurat yang Tidak Menyelamatkan Siapa Pun",
"story": """<p>Tim data <em>&ldquo;TelkoNusa&rdquo;</em> merayakan: model churn mereka <strong>akurasi 95%</strong>! Deploy ke produksi, kampanye retensi jalan — diskon Rp50rb untuk 10.000 &ldquo;berisiko churn&rdquo;. Hasilnya? Churn hampir tidak turun, biaya Rp500 juta melayang.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: 95% akurasi = model yang selalu menebak &ldquo;tidak churn&rdquo; (churn rate cuma 5%) — akurasi menipu di data imbalance. <strong>Kedua</strong>: threshold 0,5 salah — biaya salah tebak tidak simetris (kehilangan pelanggan Rp2jt vs diskon sia-sia Rp50rb). <strong>Ketiga</strong>: separuh &ldquo;diselamatkan&rdquo; ternyata memang tidak akan churn (model tidak membedakan <em>persuadable</em> vs <em>sure things</em> — itu wilayah MK11). Lesson ini: prediksi churn bukan soal akurasi — soal <strong>keputusan</strong>.</p>""",
"concepts": [
{
"id": "definisi", "toc": "Definisi Churn yang Operasional",
"title": "Definisi Churn — Satu Kata, Seribu Arti",
"body": """<p><strong>Definisi.</strong> <strong>Churn</strong> = pelanggan berhenti menjadi pelanggan. <strong>Kontrak</strong> (telco pascabayar, SaaS): jelas — tidak perpanjang = churn, tanggalnya pasti. <strong>Non-kontrak</strong> (prabayar, ritel): tidak jelas — butuh definisi operasional, mis. &ldquo;tidak ada transaksi dalam 90 hari&rdquo; (pilih dari distribusi jeda antar-pembelian, bukan asal).</p>
<p><strong>Churn rate</strong> = yang pergi / yang ada di awal periode. Jebakan: pelanggan yang <em>baru</em> di tengah periode — pakai <strong>cohort</strong> (MK3) atau exposure-adjusted. Dan bedakan <strong>voluntary</strong> (pindah kompetitor — bisa dicegah) vs <strong>involuntary</strong> (kartu ditolak, pindah kota — model tidak membantu).</p>""",
"formulas": [
{"math": r"\text{Churn rate} = \frac{N_{\text{pergi}}}{N_{\text{awal periode}}} \quad;\quad S(t) = P(T > t)",
"symbols": [
"<Tex math={String.raw`N_{\\text{pergi}}`} />: yang churn dalam periode",
"<Tex math={String.raw`N_{\\text{awal periode}}`} />: basis awal (cohort yang sama!)",
"<Tex math={String.raw`S(t)`} />: fungsi survival — peluang pelanggan bertahan lebih dari t (jembatan ke analisis survival)",
]},
],
"intuisi": "Definisi churn seperti <strong>definisi &lsquo;putus&rsquo; dalam hubungan</strong>: ada yang jelas (minta putus = kontrak berakhir), ada yang menggantung (tidak ada kabar 3 bulan = non-kontrak). Model apa pun sampah kalau definisinya ngawur — &lsquo;tidak aktif 30 hari&rsquo; untuk produk yang natural-nya dipakai 2 bulan sekali = false alarm massal.",
"kapan": "Sebelum modeling apa pun. Tulis definisi, validasi dengan tim bisnis (&ldquo;apakah orang ini benar-benar hilang?&rdquo;), baru hitung.",
"worked": {"title": "📐 Contoh: Memilih jendela definisi (klik untuk buka)",
"body": """<p>E-commerce: distribusi jeda antar-pembelian — median 45 hari, persentil 90 = 120 hari.</p>
<p><strong>Pilihan:</strong> definisi churn = &ldquo;tidak beli dalam 150 hari&rdquo; (&gt; P90 + buffer). Kenapa bukan 30 hari? Karena 70% pelanggan normalnya jeda &gt; 30 hari — definisi 30 hari menandai 70% basis sebagai &ldquo;churn&rdquo; (false alarm).</p>
<p><strong>Validasi:</strong> ambil 100 &ldquo;churn&rdquo; menurut definisi, cek manual/telepon sampel — berapa % yang benar-benar pergi vs cuma jeda panjang? Target: &gt;80% benar.</p>"""},
"charts": [],
},
{
"id": "klasifikasi", "toc": "Klasifikasi Churn",
"title": "Klasifikasi — Menebak Siapa, Lalu Bertindak",
"body": """<p><strong>Definisi.</strong> Framing <strong>klasifikasi biner</strong>: fitur (RFM, tenure, tiket CS, tren penggunaan, perubahan pola) → probabilitas churn dalam horizon (mis. 90 hari). Tiga hal yang membedakan model churn amatir vs profesional: <strong>imbalance</strong> (churn 5% — akurasi menipu; pakai PR-AUC, recall@precision, bukan akurasi), <strong>fitur tren</strong> (bukan &ldquo;total transaksi&rdquo; tapi &ldquo;penurunan transaksi 3 bulan&rdquo; — churn adalah <em>perubahan</em> perilaku), dan <strong>threshold berbasis biaya</strong>.</p>
<p><strong>Threshold:</strong> jangan 0,5 default. Hitung: selamatkan yang benar = hemat CLV − biaya; ganggu yang salah = biaya + iritasi. Pilih threshold yang memaksimalkan <strong>expected value</strong>.</p>""",
"formulas": [
{"math": r"EV = P(\text{churn}) \cdot P(\text{selamat} \mid \text{aksi}) \cdot CLV - C_{\text{aksi}}",
"symbols": [
"<Tex math={String.raw`EV`} />: expected value menghubungi satu pelanggan",
"<Tex math={String.raw`P(\\text{selamat} \\mid \\text{aksi})`} />: peluang aksi berhasil (dari eksperimen, bukan asumsi!)",
"<Tex math={String.raw`C_{\\text{aksi}}`} />: biaya aksi (diskon + operasional + risiko iritasi)",
"Hubungi jika EV &gt; 0. Inilah &lsquo;threshold&rsquo; yang benar — bukan 0,5",
]},
],
"intuisi": "Model churn seperti <strong>detektor asap</strong>: yang penting bukan &ldquo;akurat 95%&rdquo; tapi &ldquo;bunyi saat ada api, diam saat tidak&rdquo;. Detektor yang tidak pernah bunyi = akurasi 99% di rumah yang jarang kebakaran — dan tidak berguna. Threshold = seberapa sensitif kamu setel, tergantung harga false alarm vs kebakaran.",
"kapan": "Butuh daftar &ldquo;siapa dihubungi minggu ini&rdquo; + butuh aksi segera. Horizon prediksi = horizon aksi (prediksi 90 hari untuk kampanye 90 hari).",
"worked": {"title": "📐 Contoh: Threshold TelkoNusa (klik untuk buka)",
"body": """<p>CLV Rp2jt, biaya aksi Rp50rb, P(selamat|aksi) = 20% (dari pilot). EV = p × 0,2 × 2.000.000 − 50.000.</p>
<p>EV &gt; 0 → p &gt; 50.000 / 400.000 = <strong>12,5%</strong>. Jadi hubungi semua dengan P(churn) &gt; 12,5% — <strong>bukan 50%</strong>! Threshold 0,5 melewatkan pelanggan dengan p=30% yang EV-nya positif (0,3×400rb−50rb = +Rp70rb).</p>
<p>Hasil: daftar &ldquo;berisiko&rdquo; membesar 3x, tapi tiap kontak expected-value positif. Inilah bedanya threshold statistik vs threshold bisnis.</p>"""},
"charts": [
{"data": """[{x: [5,10,15,20,30,40,50,60], y: [120,210,260,280,270,220,150,80], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Total EV (Rp jt)"}]""",
"title": "Total expected value vs threshold",
"layout": """{xaxis: {title: "Threshold P(churn) (%)"}, yaxis: {title: "Total EV kampanye (Rp jt)"}, showlegend: false}""",
"cara": "Sumbu X = threshold yang dipakai, Y = total expected value kampanye. Cari puncak kurva.",
"interpretasi": "Puncak di threshold ~20% (EV Rp280jt). Threshold 50% (default naif) hanya memberi Rp150jt — <strong>hampir separuh nilai hilang</strong> karena terlalu banyak pelanggan EV-positif tidak dihubungi. Threshold bukan parameter statistik — ia parameter bisnis."},
],
},
{
"id": "survival", "toc": "Survival Analysis",
"title": "Survival — Bertahan Hidup sebagai Kurva",
"body": """<p><strong>Definisi.</strong> <strong>Survival analysis</strong> memodelkan <em>waktu sampai churn</em>, bukan cuma ya/tidak. <strong>Fungsi survival S(t)</strong> = peluang bertahan lebih dari t. <strong>Hazard h(t)</strong> = risiko churn <em>saat ini</em> given masih bertahan. <strong>Censoring</strong>: pelanggan yang belum churn saat observasi berakhir — kita tahu ia bertahan <em>minimal</em> selama itu (jangan dibuang! mereka informasi).</p>
<p><strong>Kaplan-Meier</strong>: estimasi S(t) non-parametrik — di tiap waktu kejadian, kalikan peluang lolos: S(t) = Π (1 − d_i/n_i). <strong>Cox PH</strong>: hazard = baseline × exp(β·X) — untuk tahu <em>faktor apa</em> mempercepat churn (β positif = bahaya).</p>""",
"formulas": [
{"math": r"\hat{S}(t) = \prod_{t_i \le t}\left(1 - \frac{d_i}{n_i}\right) \quad;\quad h(t \mid X) = h_0(t)\,e^{\beta_1 X_1 + \cdots}",
"symbols": [
"<Tex math={String.raw`d_i`} />: yang churn tepat di waktu t_i",
"<Tex math={String.raw`n_i`} />: yang masih &lsquo;berisiko&rsquo; (belum churn &amp; belum tersensor) sebelum t_i",
"<Tex math={String.raw`h_0(t)`} />: baseline hazard — risiko dasar seiring waktu",
"<Tex math={String.raw`e^{\\beta_j}`} />: hazard ratio fitur j — 1,5 = risiko 50% lebih tinggi",
]},
],
"intuisi": "Klasifikasi bertanya <strong>&lsquo;siapa yang pergi?&rsquo;</strong>, survival bertanya <strong>&lsquo;kapan mereka pergi?&rsquo;</strong> — dan &lsquo;kapan&rsquo; menentukan <em>kapan bertindak</em>. Kurva KM yang terjun di bulan ke-2 berteriak: &lsquo;perbaiki onboarding!&rsquo; — info yang tidak ada di label ya/tidak.",
"kapan": "Butuh timing intervensi, membandingkan ketahanan cohort (kurva KM per cohort!), atau menganalisis faktor risiko (Cox). Wajib paham censoring — buang data tersensor = bias survivorship.",
"worked": {"title": "📐 Contoh: Membaca kurva KM (klik untuk buka)",
"body": """<p>KM pelanggan baru: S(1)=0,80, S(3)=0,62, S(6)=0,55, S(12)=0,50.</p>
<p><strong>Baca:</strong> 20% hilang di bulan pertama (terjun curam!) — masalah onboarding/ekspektasi. Lalu melandai: yang lolos 3 bulan cenderung setia (S(12)=50%). <strong>Median survival</strong> = 12 bulan (S turun ke 0,5).</p>
<p><strong>Tindakan:</strong> intervensi di minggu 1–4 (di sanalah darah mengucur), bukan kampanye &ldquo;win-back&rdquo; di bulan ke-11.</p>"""},
"charts": [
{"data": """[{x: [0,1,2,3,6,9,12], y: [1,0.8,0.68,0.62,0.55,0.52,0.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Cohort baru"}, {x: [0,1,2,3,6,9,12], y: [1,0.92,0.85,0.8,0.75,0.72,0.7], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "Cohort lama"}]""",
"title": "Kurva Kaplan-Meier: cohort baru vs lama",
"layout": """{xaxis: {title: "Bulan sejak join"}, yaxis: {title: "S(t): peluang bertahan"}, showlegend: true}""",
"cara": "Sumbu X = umur pelanggan, Y = peluang masih bertahan. Dua kurva = dua cohort. Tanda + (jika ada) = titik sensor.",
"interpretasi": "Cohort baru (biru) terjun di bulan 1–2 lalu melandai di 50%; cohort lama (kuning) jauh lebih landai (70% di bulan 12). <strong>Kualitas memburuk</strong> — konsisten dengan temuan cohort table MK3. Keputusan: perbaiki 60 hari pertama, bukan tambah akuisisi."},
],
},
],
"myths": [
{"t": "Model churn akurasi 95% = model bagus, siap deploy.",
"benar": "Di churn rate 5%, model &ldquo;selalu tebak tidak churn&rdquo; dapat <strong>95% gratis</strong>. Metrik yang jujur: <strong>PR-AUC</strong>, recall@k teratas, atau langsung <strong>expected value</strong> (berapa rupiah diselamatkan per rupiah biaya). Selalu tanya: &lsquo;akurasi ini vs baseline tebak-mayoritas berapa?&rsquo;"},
{"t": "Churn = tidak aktif X hari. Definisi universal, tinggal pakai.",
"benar": "X yang salah = false alarm massal atau deteksi terlambat. Definisi harus <strong>diturunkan dari data</strong> (distribusi jeda antar-pembelian, P90+) dan <strong>divalidasi</strong> (sampel manual: benarkah mereka pergi?). Produk beda, X beda — tidak ada angka universal."},
],
"tips": [
"<strong>Fitur terbaik churn = perubahan, bukan level.</strong> &lsquo;Total transaksi 100x&rsquo; kalah dari &lsquo;transaksi turun 60% dalam 2 bulan&rsquo;. Churn adalah <em>proses pergi</em>, bukan <em>keadaan</em>. Selalu buat fitur tren/delta/slope.",
"<strong>Jangan buang data tersensor.</strong> Pelanggan yang belum churn saat observasi berakhir BUKAN &lsquo;tidak churn&rsquo; — ia &lsquo;bertahan minimal selama ini&rsquo;. Membuangnya = bias survivorship (hanya belajar dari yang pergi). Inilah gunanya survival analysis.",
],
"labs": [
{"heading": "Kaplan-Meier From-Scratch",
"intro": "Hitung kurva survival manual dari data waktu-churn (dengan sensor). Lihat S(t) turun di tiap kejadian.",
"title": "Lab 1 — Kaplan-Meier Manual",
"hint": "Ubah beberapa status jadi tersensor (0) — lihat kurva berubah. Sensor ≠ hilang; mereka tetap di n_i sampai waktu sensornya.",
"code": """# Kaplan-Meier from scratch
# (waktu_bulan, churn=1 / tersensor=0)
data = [(1,1),(1,1),(2,0),(2,1),(3,1),(3,0),(4,1),(5,0),(6,1),(8,1),(12,0),(12,0)]

def km(data):
    waktu = sorted(set(t for t, _ in data))
    S, hasil = 1.0, []
    for t in waktu:
        n = sum(1 for tt, c in data if tt >= t)          # at risk
        d = sum(1 for tt, c in data if tt == t and c == 1)  # kejadian
        if n > 0:
            S *= (1 - d / n)
        hasil.append((t, n, d, S))
    return hasil

print(f"{'t':>4}{'at-risk':>9}{'churn':>7}  S(t)")
for t, n, d, s in km(data):
    print(f"{t:>4}{n:>9}{d:>7}  {s:.2f}")
print("\\nMedian survival ~ t di mana S(t) <= 0.5")
"""},
{"heading": "Threshold Berbasis Biaya",
"intro": "Cari threshold yang memaksimalkan expected value — bukan 0,5. Ubah biaya & CLV, lihat threshold optimal bergeser.",
"title": "Lab 2 — Threshold Optimal",
"hint": "Naikkan biaya aksi 50rb → 200rb. Threshold optimal naik — makin mahal aksi, makin yakin kamu harus sebelum menghubungi.",
"code": """# Cari threshold optimal via expected value
import random
random.seed(3)
CLV, BIAYA, P_SELAMAT = 2_000_000, 50_000, 0.20  # ubah sesukamu

# 2000 pelanggan dengan P(churn) terkalibrasi; churn aktual ~ Bernoulli(p)
pop = [random.random() ** 1.5 for _ in range(2000)]

def total_ev(th):
    ev = 0
    for p in pop:
        if p >= th:
            churn = random.random() < p
            ev += (CLV * P_SELAMAT - BIAYA) if churn else (-BIAYA)
    return ev / 1e6

print(f"{'threshold':>10}  {'total EV (Rp jt)':>16}")
terbaik = (0, -1e9)
for th in [0.05, 0.10, 0.15, 0.20, 0.30, 0.50, 0.70]:
    ev = total_ev(th)
    print(f"{th:>10.2f}  {ev:>16.1f}")
    if ev > terbaik[1]:
        terbaik = (th, ev)
print(f"\\nThreshold optimal ~ {terbaik[0]:.2f} (EV Rp{terbaik[1]:.1f} jt), bukan 0.50!")
"""},
],
"decisions": [
{"kondisi": "Butuh daftar 'siapa dihubungi minggu ini'", "pakai": "Klasifikasi + threshold biaya",
"alasan": "Output langsung actionable (skor per pelanggan). Threshold EV memastikan tiap kontak menguntungkan.",
"contoh": "Kampanye win-back: hubungi p &gt; 12,5% (bukan 50%)."},
{"kondisi": "Butuh tahu 'kapan mereka pergi' / bandingkan cohort", "pakai": "Kaplan-Meier",
"alasan": "Kurva menunjukkan timing — bulan ke berapa darah mengucur.",
"contoh": "KM per cohort: cohort baru terjun di bulan 1 → perbaiki onboarding."},
{"kondisi": "Butuh tahu 'faktor apa' mempercepat churn", "pakai": "Cox Proportional Hazards",
"alasan": "Hazard ratio per fitur: tiket CS 3x = risiko 2x lipat, dst.",
"contoh": "Prioritas product fix: faktor dengan HR terbesar & bisa diubah."},
{"kondisi": "Intervensi mahal / hanya untuk yang 'bisa dibujuk'", "pakai": "Lanjut ke Uplift Modeling (MK11)",
"alasan": "Klasifikasi churn menebak siapa pergi; uplift menebak siapa pergi YANG BISA dicegah.",
"contoh": "Diskon Rp200rb hanya untuk persuadable — bukan untuk sure things/lost causes."},
],
"rule10": "<ol><li><strong>Definisi dulu</strong> — dari data, divalidasi.</li><li><strong>Jangan percaya akurasi</strong> di data imbalance.</li><li><strong>Threshold = keputusan bisnis</strong> (EV), bukan 0,5.</li><li><strong>Fitur tren</strong> mengalahkan fitur level.</li></ol>",
"case": {"toc": "Mini-Case: Kampanye Rp500 Juta yang Gagal",
"title": "Kampanye Rp500 Juta yang Gagal",
"body": """<p>TelkoNusa: model &ldquo;akurasi 95%&rdquo;, threshold 0,5, diskon Rp50rb ke 10.000 pelanggan. Churn tidak turun. Investigasi: (1) baseline tebak-mayoritas = 95% (churn 5%); (2) threshold optimal via EV = 12,5%, bukan 50% — 70% pelanggan EV-positif tidak dihubungi; (3) P(selamat|aksi) cuma 8%, bukan asumsi 20%.</p>""",
"q": "(a) Tiga kesalahan berlapisnya? (b) Hitung ulang: dengan P(selamat)=8%, berapa threshold EV-optimal? (c) Satu perbaikan proses sebelum kampanye berikutnya?",
"pembahasan": """<p>(a) <strong>Metrik menipu</strong> (akurasi vs baseline), <strong>threshold statistik</strong> bukan bisnis, <strong>asumsi efektivitas</strong> tanpa pilot (P(selamat) ditebak, bukan diukur).</p>
<p>(b) EV &gt; 0 → p &gt; 50.000/(0,08 × 2.000.000) = 50.000/160.000 = <strong>31,25%</strong>. Dengan efektivitas rendah, threshold naik — hanya hubungi yang sangat berisiko. Atau: perbaiki dulu efektivitas aksinya (pilot A/B) sebelum scale.</p>
<p>(c) <strong>Pilot A/B kecil dulu</strong>: 1.000 pelanggan, ukur P(selamat|aksi) yang sebenarnya + EV, baru scale. Dan ganti metrik sukses model dari akurasi ke <strong>rupiah diselamatkan per rupiah biaya</strong>.</p>"""},
"quiz": [
{"q": "Churn rate 5%. Model 'selalu tebak tidak churn' akurasinya?",
"options": ["50%", "95%", "5%", "Tidak bisa dihitung"], "correct": 1,
"why": "Benar: 95% — gratis, tanpa belajar apa pun. Inilah kenapa akurasi dilarang sebagai metrik churn. Pakai PR-AUC / recall@k / expected value."},
{"q": "CLV Rp2jt, biaya Rp50rb, P(selamat|aksi)=20%. Threshold EV-optimal?",
"options": ["50%", "12,5%", "2,5%", "80%"], "correct": 1,
"why": "Benar: p &gt; 50.000/(0,2×2.000.000) = 12,5%. Jauh di bawah 0,5 — karena menyelamatkan (Rp400rb expected) jauh lebih berharga dari biaya false alarm (Rp50rb)."},
{"q": "Pelanggan belum churn saat observasi berakhir. Perlakuan benar?",
"options": ["Buang — datanya tidak lengkap", "Anggap tidak churn", "Perlakukan sebagai tersensor (bertahan minimal selama itu)", "Duplikasi"], "correct": 2,
"why": "Benar: censoring — ia memberi info 'bertahan ≥ t'. Membuangnya = bias survivorship; menganggap 'tidak churn' = meremehkan risiko. KM menangani ini dengan benar."},
{"q": "Fitur mana yang PALING prediktif untuk churn?",
"options": ["Total transaksi sepanjang masa", "Penurunan transaksi 60% dalam 2 bulan terakhir (tren)", "Umur akun", "Kota"], "correct": 1,
"why": "Benar: churn = proses pergi. Fitur tren/delta menangkap perubahan perilaku — sinyal perginya. Level statis (total 100x) tidak tahu ia sedang pergi."},
{"q": "Kurva KM terjun curam di bulan 1-2 lalu melandai. Tindakan prioritas?",
"options": ["Kampanye win-back bulan ke-11", "Perbaiki onboarding & 60 hari pertama", "Naikkan harga", "Tambah akuisisi"], "correct": 1,
"why": "Benar: darah mengucur di bulan 1-2 — di sanalah intervensi. Win-back bulan 11 menolong sisa yang sudah sedikit. Timing = segalanya di retensi."},
],
"rangkum": [
"<strong>Definisi dulu</strong>: kontrak (jelas) vs non-kontrak (dari distribusi jeda, divalidasi). Bedakan voluntary vs involuntary.",
"<strong>Klasifikasi</strong>: imbalance → jangan percaya akurasi; fitur tren &gt; level; threshold dari expected value, bukan 0,5.",
"<strong>Survival</strong>: S(t) = peluang bertahan; KM = Π(1−d_i/n_i); censoring jangan dibuang; Cox untuk faktor risiko (hazard ratio).",
"<strong>KM menjawab 'kapan'</strong> — timing intervensi. Klasifikasi menjawab 'siapa'.",
"<strong>ROI kampanye</strong>: EV = p × P(selamat) × CLV − biaya. Pilot kecil ukur P(selamat) sebelum scale.",
"<strong>Kapan NAIK ke uplift (MK11)</strong>: intervensi mahal — targetkan yang persuadable, bukan semua yang berisiko.",
],
"prev": ["mk5-clv", "MK5"],
"next": ["mk7-propensity", "MK7"],
},
]
