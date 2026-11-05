# Track 6 — MK14..MK19
LESSONS = [
{
"slug": "mk14-pricing", "id": "MK14", "track": "Marketing Data Analytics",
"title_html": "Pricing & Promosi:<br/>Elastisitas, Lift, dan Kanibalisasi",
"title_plain": "Pricing & Promosi: Elastisitas, Promo Lift, Kanibalisasi",
"chapter_summary": "Ekonomi pricing untuk analis: elastisitas harga (arc & point), mengukur promo lift vs baseline, ROI promo yang jujur (forward buying, stockpiling), dan kanibalisasi antar-produk. Lab kalkulator elastisitas & ROI promo.",
"tujuan": [
"Menghitung elastisitas harga (arc) dan mengklasifikasikan elastic vs inelastic.",
"Membedakan penjualan promo vs baseline dan menghitung lift yang benar.",
"Menghitung ROI promo termasuk biaya forward buying & kanibalisasi.",
"Menjelaskan kapan promo menguntungkan vs kapan ia 'membeli' penjualan sendiri.",
],
"story_title": "Cerita: Promo 50% yang 'Sukses' — dan Merugi",
"story": """<p>Brand snack <em>&ldquo;KriukKu&rdquo;</em> mengadakan promo <strong>diskon 50%</strong> seminggu. Penjualan <strong>naik 300%</strong>! Tim trade marketing merayakan: <em>&ldquo;Promo tersukses tahun ini!&rdquo;</em> Lalu finance datang dengan hitungannya: <strong>rugi Rp800 juta</strong>.</p>
<p>Twist-nya berlapis. <strong>Pertama</strong>: separuh &ldquo;kenaikan&rdquo; adalah <strong>forward buying</strong> — pelanggan menyetok untuk 2 bulan, penjualan minggu depan anjlok. <strong>Kedua</strong>: snack varian lain (margin lebih tinggi) <strong>termakan</strong> (kanibalisasi). <strong>Ketiga</strong>: harga referensi pelanggan turun — minggu berikutnya harga normal terasa &ldquo;mahal&rdquo;. <strong>Promo bukan soal volume — soal profit inkremental bersih.</strong> Lesson ini: matematika promo yang jujur.</p>""",
"concepts": [
{
"id": "elastisitas", "toc": "Elastisitas Harga",
"title": "Elastisitas — Seberapa 'Tersinggung' Demand oleh Harga",
"body": """<p><strong>Definisi.</strong> <strong>Elastisitas harga</strong> = % perubahan quantity dibagi % perubahan harga. <strong>|E| &gt; 1</strong> = elastis (demand sensitif — cocok promo); <strong>|E| &lt; 1</strong> = inelastis (tidak sensitif — promo buang margin). <strong>Arc elasticity</strong> memakai rata-rata sebagai basis (untuk perubahan besar); <strong>point elasticity</strong> dari kurva demand (untuk perubahan kecil).</p>
<p>Aturan profit: jika |E| &gt; 1, turunkan harga → revenue naik. Jika |E| &lt; 1, <em>naikkan</em> harga → revenue naik (dan margin naik!). Kebanyakan brand takut menaikkan harga padahal produknya inelastis.</p>""",
"formulas": [
{"math": r"E_{arc} = \frac{(Q_2 - Q_1)/((Q_2+Q_1)/2)}{(P_2 - P_1)/((P_2+P_1)/2)}",
"symbols": [
"<Tex math={String.raw`E_{arc}`} />: elastisitas busur — negatif (harga naik → quantity turun)",
"<Tex math={String.raw`Q_1, Q_2`} />: quantity sebelum &amp; sesudah perubahan harga",
"<Tex math={String.raw`P_1, P_2`} />: harga sebelum &amp; sesudah",
"Basis rata-rata: adil untuk perubahan besar (tidak tergantung arah)",
]},
],
"intuisi": "Elastisitas seperti <strong>mengukur 'baper'-nya pelanggan</strong>: produk elastis = pelanggan baper (naik Rp1.000 langsung pindah merek); inelastis = cuek (bensin, obat — butuh ya beli). Promo untuk yang baper; <em>naikkan harga</em> untuk yang cuek.",
"kapan": "Setiap keputusan harga/promo. Estimasi dari histori (regresi log-log) atau eksperimen harga (MK9).",
"worked": {"title": "📐 Contoh: Elastisitas KriukKu (klik untuk buka)",
"body": """<p>Harga Rp10.000 → Rp8.000 (−20%). Quantity 10.000 → 16.000 (+60%).</p>
<p><strong>Arc:</strong> %ΔQ = 6.000/13.000 = 46,2%; %ΔP = −2.000/9.000 = −22,2%. E = 46,2/−22,2 = <strong>−2,08</strong> → |E| &gt; 1 = <strong>elastis</strong>.</p>
<p><strong>Revenue:</strong> sebelum Rp100jt → sesudah Rp128jt (+28%). Tapi <strong>profit</strong>? Margin/unit Rp3.000 → Rp1.000. Profit: 10.000×3.000 = Rp30jt → 16.000×1.000 = Rp16jt. <strong>Revenue naik, profit anjlok 47%!</strong> Inilah kenapa elastisitas tanpa margin = jebakan.</p>"""},
"charts": [
{"data": """[{x: [8000,9000,10000,11000,12000], y: [16000,13000,10000,7500,5500], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "demand"}]""",
"title": "Kurva demand KriukKu",
"layout": """{xaxis: {title: "Harga (Rp)"}, yaxis: {title: "Quantity"}, showlegend: false}""",
"cara": "Sumbu X = harga, Y = quantity terjual. Kemiringan = sensitivitas.",
"interpretasi": "Kurva landai (elastis): turun harga Rp2.000 → quantity +6.000. Tapi ingat worked example: quantity naik ≠ profit naik. Selalu kalikan dengan margin — kurva profit (bukan demand) yang menentukan keputusan."},
],
},
{
"id": "promo", "toc": "Promo Lift & ROI",
"title": "Promo Lift — Penjualan 'Tambahan' yang Semu",
"body": """<p><strong>Definisi.</strong> <strong>Baseline</strong> = penjualan tanpa promo (dari model/ histori). <strong>Lift</strong> = (promo − baseline)/baseline. <strong>Forward buying</strong>: pelanggan menyetok saat promo → penjualan <em>setelah</em> promo anjlok (dipinjam dari masa depan). <strong>Stockpiling</strong> versi konsumen menimbun.</p>
<p><strong>ROI promo yang jujur</strong> = (margin inkremental − biaya promo) / biaya promo, dengan inkremental = lift − forward buying − kanibalisasi. Promo &ldquo;300%&rdquo; KriukKu setelah koreksi: lift bersih cuma 40%.</p>""",
"formulas": [
{"math": r"\text{Lift}_{bersih} = \frac{Q_{promo} - Q_{base} - Q_{forward} - Q_{kanibal}}{Q_{base}}",
"symbols": [
"<Tex math={String.raw`Q_{promo}`} />: quantity selama promo",
"<Tex math={String.raw`Q_{base}`} />: baseline (tanpa promo)",
"<Tex math={String.raw`Q_{forward}`} />: yang 'dipinjam' dari minggu depan (lihat penurunan pasca-promo)",
"<Tex math={String.raw`Q_{kanibal}`} />: penjualan produk lain yang termakan (lihat MK konsep berikut)",
]},
],
"intuisi": "Promo seperti <strong>meminjam uang dari rentenir waktu</strong>: penjualan minggu ini naik karena 'meminjam' penjualan minggu depan (forward buying) — dan bunganya = margin yang hilang + harga referensi yang rusak. Kadang pinjaman ini worth it (akuisisi pelanggan baru); sering tidak.",
"kapan": "Evaluasi setiap promo: ukur 2–4 minggu SESUDAH promo untuk menangkap forward buying. Jangan nilai promo di hari terakhirnya.",
"worked": {"title": "📐 Contoh: Audit promo KriukKu (klik untuk buka)",
"body": """<p>Promo 1 minggu: Q_promo = 40.000 (vs baseline 10.000/minggu). Minggu setelah promo: 4.000 (baseline 10.000 → forward buying = 6.000). Varian premium turun 3.000 (kanibalisasi, margin Rp5.000/unit).</p>
<p><strong>Lift kotor:</strong> (40.000−10.000)/10.000 = 300%. <strong>Lift bersih:</strong> (40.000−10.000−6.000−3.000)/10.000 = <strong>210%</strong> — masih besar!</p>
<p><strong>Profit:</strong> inkremental bersih 21.000 unit × margin promo Rp1.000 = Rp21jt. Kanibalisasi: 3.000 × Rp5.000 = Rp15jt hilang. Biaya promo (listing, spanduk): Rp10jt. <strong>Net = 21 − 15 − 10 = −Rp4jt.</strong> Ditambah harga referensi rusak. 'Promo tersukses' = rugi.</p>"""},
"charts": [
{"data": """[{x: ["Baseline", "Lift kotor", "Forward buying", "Kanibalisasi", "Lift bersih"], y: [10, 30, -6, -3, 21], type: "bar", marker: {color: ["#94a3b8","#2a7de1","#ef4444","#ef4444","#16a34a"]}, text: ["10rb","30rb","−6rb","−3rb","21rb"], textposition: "outside"}]""",
"title": "Waterfall: dari lift kotor ke lift bersih",
"layout": """{yaxis: {title: "Ribu unit"}, showlegend: false}""",
"cara": "Baca kiri ke kanan: mulai dari baseline, tambah lift kotor, kurangi forward buying & kanibalisasi = lift bersih.",
"interpretasi": "Lift kotor 30rb menyusut jadi 21rb bersih — 30% adalah 'pinjaman' & 'curian'. Waterfall ini = template audit tiap promo. Jika lift bersih masih besar TAPI profit negatif (margin promo tipis), keputusannya tetap: jangan ulangi."},
],
},
{
"id": "kanibal", "toc": "Kanibalisasi",
"title": "Kanibalisasi — Mencuri dari Diri Sendiri",
"body": """<p><strong>Definisi.</strong> <strong>Kanibalisasi</strong>: promo/produk baru memakan penjualan produkmu yang lain (margin lebih tinggi). Lawannya: <strong>halo effect</strong> (promo menarik traffic yang juga beli produk lain — positif). <strong>Net incremental</strong> = inkremental produk promo − kanibalisasi + halo.</p>
<p>Cara ukur: bandingkan penjualan produk <em>saudara</em> selama promo vs baseline (atau vs kontrol wilayah tanpa promo). Kanibalisasi 100% = promo murni memindahkan penjualan (nol tambahan, margin hilang).</p>""",
"formulas": [],
"intuisi": "Kanibalisasi seperti <strong>memindahkan uang dari kantong kiri ke kantong kanan lalu merayakan 'dapat uang'</strong> — kecuali kantong kanan bocor (margin lebih kecil). Satu-satunya yang dirayakan = uang <em>baru</em> dari luar (pelanggan baru / konsumsi tambahan).",
"kapan": "Setiap promo & peluncuran produk baru. Selalu ukur portofolio, bukan SKU.",
"worked": {"title": "📐 Contoh: Varian baru KriukKu (klik untuk buka)",
"body": """<p>Varian 'Pedas' diluncurkan: jual 8.000 unit/minggu. Varian 'Original' turun 5.000 (dari 20.000). Total portofolio: 28.000 → 23.000+8.000 = 31.000.</p>
<p><strong>Kanibalisasi:</strong> 5.000/8.000 = <strong>62,5%</strong> — hampir 2/3 'penjualan baru' adalah pindahan. Net incremental cuma 3.000 unit.</p>
<p><strong>Tapi</strong> — jika varian Pedas marginnya LEBIH TINGGI (Rp4.000 vs Rp3.000): profit = 8.000×4.000 − 5.000×3.000 = Rp32jt − Rp15jt = <strong>+Rp17jt</strong>. Kanibalisasi tidak selalu buruk — <strong>kanibalisasi ke margin lebih tinggi = strategi</strong> (premiumisasi).</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Promo yang menaikkan volume 300% pasti sukses.",
"benar": "Volume ≠ profit. Kasus KriukKu: +300% volume, <strong>rugi Rp4jt + harga referensi rusak</strong> (forward buying + kanibalisasi + margin tipis). Metrik promo = <strong>profit inkremental bersih</strong>, bukan volume. Promo 'sukses' yang merugi = membeli penjualan sendiri dengan harga mahal."},
{"t": "Elastisitas itu angka tetap untuk satu produk.",
"benar": "Elastisitas <strong>berubah</strong>: beda segmen (mahasiswa vs Sultan), beda konteks (promo vs harga reguler), beda waktu (jangka pendek vs panjang — jangka panjang lebih elastis karena sempat cari alternatif). Satu angka untuk semua = penyederhanaan berbahaya. Segmentasikan."},
],
"tips": [
"<strong>Ukur promo 2–4 minggu SETELAH-nya.</strong> Forward buying tidak terlihat di minggu promo — ia terlihat sebagai 'lubang' minggu depan. Evaluasi promo tanpa jendela pasca = menilai pinjaman tanpa melihat tagihan.",
"<strong>Kanibalisasi ke atas = strategi, ke bawah = bunuh diri.</strong> Varian baru yang memakan varian murah (margin naik) = premiumisasi yang bagus. Promo yang memakan varian premium (margin turun) = diskon bunuh diri. Selalu ukur portofolio + margin, bukan SKU + volume.",
],
"labs": [
{"heading": "Kalkulator Elastisitas & Implikasi Profit",
"intro": "Hitung elastisitas arc dari dua titik harga, lalu lihat implikasi ke revenue DAN profit.",
"title": "Lab 1 — Kalkulator Elastisitas",
"hint": "Ubah MARGIN 3000 → 500. Lihat: produk elastis + margin tipis = promo makin merugikan. Elastisitas tanpa margin = setengah cerita.",
"code": """# Kalkulator elastisitas arc + implikasi profit
P1, Q1 = 10000, 10000   # sebelum
P2, Q2 = 8000, 16000    # sesudah promo
MARGIN1, MARGIN2 = 3000, 1000  # margin/unit

dQ = (Q2-Q1)/((Q2+Q1)/2)
dP = (P2-P1)/((P2+P1)/2)
E = dQ/dP
rev1, rev2 = P1*Q1, P2*Q2
prof1, prof2 = MARGIN1*Q1, MARGIN2*Q2

print(f"Elastisitas arc : {E:.2f}  ({'ELASTIS' if abs(E)>1 else 'INELASTIS'})")
print(f"Revenue  : Rp{rev1/1e6:.0f}jt -> Rp{rev2/1e6:.0f}jt ({(rev2-rev1)/rev1:+.0%})")
print(f"Profit   : Rp{prof1/1e6:.0f}jt -> Rp{prof2/1e6:.0f}jt ({(prof2-prof1)/prof1:+.0%})")
print()
if abs(E) > 1 and prof2 < prof1:
    print("Jebakan klasik: elastis tapi margin hancur -> volume naik, profit turun.")
"""},
{"heading": "Audit ROI Promo Lengkap",
"intro": "Hitung lift bersih (koreksi forward buying + kanibalisasi) dan net profit promo.",
"title": "Lab 2 — Audit Promo",
"hint": "Ubah KANIBAL 3000 → 0 (tidak ada kanibalisasi). Kapan promo ini jadi menguntungkan? Itulah 'syarat' promomu.",
"code": """# Audit promo: dari lift kotor ke profit bersih
BASE = 10000          # baseline/minggu
Q_PROMO = 40000       # quantity minggu promo
FORWARD = 6000        # penurunan minggu depan (pinjaman)
KANIBAL = 3000        # unit produk saudara yg hilang
MARGIN_PROMO = 1000   # margin/unit saat promo
MARGIN_SAUDARA = 5000 # margin/unit produk yg termakan
BIAYA = 10_000_000    # biaya promo

inkr_bersih = Q_PROMO - BASE - FORWARD - KANIBAL
lift_kotor = (Q_PROMO - BASE) / BASE
lift_bersih = inkr_bersih / BASE
profit = inkr_bersih * MARGIN_PROMO - KANIBAL * MARGIN_SAUDARA - BIAYA

print(f"Lift kotor  : {lift_kotor:.0%}")
print(f"Lift bersih : {lift_bersih:.0%}")
print(f"Profit promo: Rp{profit/1e6:+.1f} jt")
print()
print("Keputusan:", "ULANGI (profitable)" if profit > 0 else "JANGAN ULANGI (merugi)")
"""},
],
"decisions": [
{"kondisi": "|E| &gt; 1 (elastis) + margin cukup", "pakai": "Promo / turun harga",
"alasan": "Volume merespons kuat; pastikan margin tidak hancur.",
"contoh": "Snack, fashion fast-moving."},
{"kondisi": "|E| &lt; 1 (inelastis)", "pakai": "NAIKKAN harga (jangan promo)",
"alasan": "Quantity tidak turun banyak; revenue & margin naik.",
"contoh": "Bensin, obat, brand premium kuat."},
{"kondisi": "Mau promo tapi takut kanibalisasi", "pakai": "Promo varian/entry-level saja + ukur portofolio",
"alasan": "Arahkan kanibalisasi ke bawah (murah), lindungi premium.",
"contoh": "Diskon ukuran kecil, bukan flagship."},
{"kondisi": "Tidak tahu elastisitas", "pakai": "Eksperimen harga kecil (MK9) sebelum promo besar",
"alasan": "Asumsi elastisitas = judi. Test 5% traffic lebih murah dari promo gagal.",
"contoh": "Uji ±10% harga di 2 kota."},
],
"rule10": "<ol><li><strong>Elastisitas + margin</strong> — selalu berpasangan.</li><li><strong>Ukur pasca-promo</strong> (forward buying).</li><li><strong>Ukur portofolio</strong> (kanibalisasi).</li><li><strong>Metrik = profit bersih</strong>, bukan volume.</li></ol>",
"case": {"toc": "Mini-Case: Diskon 50% KriukKu",
"title": "Diskon 50% yang 'Tersukses'",
"body": """<p>KriukKu: diskon 50% seminggu. Volume +300% (40.000 vs 10.000). Finance: rugi Rp800jt total (termasuk biaya + efek lanjutan). Data: forward buying 6.000, kanibalisasi varian premium 3.000 (margin Rp5.000), margin promo Rp1.000, harga referensi turun (survei: 40% pelanggan 'tunggu promo berikutnya').</p>""",
"q": "(a) Hitung profit bersih promo (asumsi biaya Rp10jt). (b) Tiga kerusakan non-angka? (c) Desain promo alternatif yang lebih sehat?",
"pembahasan": """<p>(a) Inkremental bersih = 40.000−10.000−6.000−3.000 = 21.000 × Rp1.000 = Rp21jt. Kanibalisasi = 3.000 × Rp5.000 = Rp15jt. Net = 21 − 15 − 10 = <strong>−Rp4jt</strong> (belum termasuk kerusakan harga referensi).</p>
<p>(b) <strong>Harga referensi rusak</strong> (pelanggan menunda beli menunggu promo — 'promo trap'), <strong>brand equity</strong> (dari 'enak' jadi 'murah'), <strong>trade expectation</strong> (retailer menuntut promo rutin).</p>
<p>(c) <strong>Promo sehat:</strong> (1) bundling (beli 2 gratis 1 — volume naik tanpa merusak harga referensi per unit); (2) promo varian entry-level saja (lindungi premium); (3) cashback/loyalty (reward repeat, bukan diskon harga); (4) batasi frekuensi (maks 4x/tahun) + ukur pasca selalu.</p>"""},
"quiz": [
{"q": "Harga Rp10rb→Rp8rb, quantity 10rb→16rb. Elastisitas arc?",
"options": ["−0,48 (inelastis)", "−2,08 (elastis)", "−1,0 (uniter)", "+2,08"], "correct": 1,
"why": "Benar: %ΔQ=46,2%, %ΔP=−22,2% → E=−2,08, |E|&gt;1 = elastis. Tapi ingat worked example: elastis + margin hancur = profit turun 47%. Elastisitas tanpa margin = setengah cerita."},
{"q": "Promo: Q=40rb, baseline 10rb, forward buying 6rb, kanibalisasi 3rb. Lift bersih?",
"options": ["300%", "210%", "240%", "150%"], "correct": 1,
"why": "Benar: (40−10−6−3)/10 = 210%. Lift kotor 300% mencampur 'pinjaman' (forward) dan 'curian' (kanibal). Selalu koreksi keduanya."},
{"q": "Produk inelastis (|E|=0,4). Strategi harga terbaik?",
"options": ["Diskon besar", "Naikkan harga", "Harga tetap", "Gratis"], "correct": 1,
"why": "Benar: inelastis = quantity tidak sensitif → naikkan harga: revenue naik (harga naik &gt; quantity turun) DAN margin naik. Promo untuk inelastis = buang margin."},
{"q": "Varian baru mengambil 62,5% penjualannya dari varian lama (margin lebih rendah). Ini?",
"options": ["Sukses — penjualan naik", "Kanibalisasi merugikan — net profit bisa negatif", "Tidak masalah", "Halo effect"], "correct": 1,
"why": "Benar: 62,5% = pindahan, bukan tambahan. Jika margin varian baru &lt; lama, profit portofolio turun. Ukur portofolio + margin, bukan SKU + volume."},
{"q": "Kenapa evaluasi promo harus 2–4 minggu SETELAH promo?",
"options": ["Biar datanya banyak", "Menangkap forward buying (lubang pasca-promo)", "Aturan software", "Tidak perlu"], "correct": 1,
"why": "Benar: forward buying = 'pinjaman' yang baru terlihat sebagai penurunan minggu depan. Menilai promo di hari terakhirnya = menilai pinjaman tanpa melihat tagihan."},
],
"rangkum": [
"<strong>Elastisitas</strong> = %ΔQ/%ΔP; |E|&gt;1 elastis (promo), |E|&lt;1 inelastis (naikkan harga); selalu dengan margin.",
"<strong>Lift bersih</strong> = (promo − baseline − forward − kanibal)/baseline; ukur pasca-promo.",
"<strong>ROI promo</strong> = (margin inkremental − kanibalisasi − biaya)/biaya; metrik = profit, bukan volume.",
"<strong>Kanibalisasi</strong>: ke margin lebih tinggi = strategi; ke bawah = bunuh diri; ukur portofolio.",
"<strong>Promo trap</strong>: harga referensi rusak → pelanggan menunggu promo berikutnya.",
"<strong>Kapan TIDAK promo</strong>: inelastis, margin tipis, atau tanpa jendela ukur pasca.",
],
"prev": ["mk13-mmm", "MK13"],
"next": ["mk15-forecasting", "MK15"],
},
{
"slug": "mk15-forecasting", "id": "MK15", "track": "Marketing Data Analytics",
"title_html": "Forecasting:<br/>Meramal Penjualan Tanpa Kristal Ajaib",
"title_plain": "Forecasting Penjualan & Demand",
"chapter_summary": "Forecasting penjualan: dekomposisi (trend, musiman, holiday), metode (naive, moving average, exponential smoothing/Holt-Winters), evaluasi (WAPE, bias), dan forecasting hierarki (SKU → kategori → total) dengan rekonsiliasi.",
"tujuan": [
"Menguraikan time series menjadi trend, musiman, dan holiday effect.",
"Menjelaskan dan menerapkan seasonal naive, moving average, dan Holt-Winters.",
"Menghitung WAPE & bias dan menjelaskan kenapa MAPE bisa menipu.",
"Menjelaskan forecasting hierarki dan kenapa rekonsiliasi dibutuhkan.",
],
"story_title": "Cerita: Lebaran yang Kehabisan Stok (Lagi)",
"story": """<p>Retailer <em>&ldquo;SegarMart&rdquo;</em> setiap Lebaran kehabisan stok sirup &mdash; dan setiap tahun setelahnya <strong>kelebihan</strong> stok (dibeli panik berlebihan). Model forecasting mereka: <strong>rata-rata 12 bulan terakhir</strong>. Kedengarannya masuk akal.</p>
<p>Twist-nya: rata-rata 12 bulan <strong>menghancurkan musiman</strong> — puncak Lebaran (5x normal) dirata-ratakan dengan bulan sepi, menghasilkan angka yang salah untuk <em>semua</em> bulan (kekurangan saat Lebaran, kelebihan saat sepi). Ditambah Lebaran <strong>bergeser</strong> tiap tahun (kalender Hijriah!) — model yang tidak tahu 'holiday effect' selalu salah 2–4 minggu. Lesson ini: meramal dengan menghormati pola waktu.</p>""",
"concepts": [
{
"id": "dekomposisi", "toc": "Trend, Musiman, Holiday",
"title": "Dekomposisi — Tiga Penari dalam Satu Grafik",
"body": """<p><strong>Definisi.</strong> Time series penjualan = <strong>trend</strong> (arah jangka panjang: naik/turun/datar) + <strong>musiman</strong> (pola berulang: mingguan/bulanan/tahunan) + <strong>holiday/event effect</strong> (Lebaran, Natal, 11.11 — <em>tidak</em> periodik tetap!) + <strong>noise</strong> (sisa). <strong>Dekomposisi</strong> memisahkan ketiganya — langkah pertama sebelum memilih model.</p>
<p>Jebakan Indonesia: <strong>Lebaran/Natal bergeser</strong> (Hijriah/Masehi) — musiman 'bulanan' murni gagal; butuh <strong>regressor holiday</strong> (variabel dummy/event). Juga <strong>efek kalender</strong>: jumlah hari kerja, weekend dalam bulan.</p>""",
"formulas": [
{"math": r"y_t = T_t + S_t + H_t + e_t",
"symbols": [
"<Tex math={String.raw`T_t`} />: trend — arah jangka panjang",
"<Tex math={String.raw`S_t`} />: musiman — pola berulang (periode tetap)",
"<Tex math={String.raw`H_t`} />: holiday/event — efek kalender bergeser (Lebaran, 11.11)",
"<Tex math={String.raw`e_t`} />: noise — yang tidak bisa dijelaskan (target: kecil &amp; acak)",
"Model aditif (untuk musiman stabil) vs multiplikatif (musiman membesar seiring trend)",
]},
],
"intuisi": "Dekomposisi seperti <strong>mengurai orkestra</strong>: biola (trend) main nada naik pelan, drum (musiman) memukul tiap 4 ketuk, simbal (holiday) menghantam sesekali tapi keras. Meramal tanpa mengurai = menebak lagu dari suara campur aduk.",
"kapan": "Selalu langkah pertama. Plot data + dekomposisi sebelum memilih model apa pun.",
"worked": {"title": "📐 Contoh: Kenapa rata-rata 12 bulan gagal (klik untuk buka)",
"body": """<p>Sirup: 11 bulan @100, Lebaran @500. Rata-rata 12 bulan = (11×100 + 500)/12 = <strong>133</strong>.</p>
<p><strong>Ramalan rata-rata:</strong> tiap bulan 133 → Lebaran kurang 367 (kehabisan!), bulan biasa lebih 33 (menumpuk).</p>
<p><strong>Dekomposisi:</strong> baseline 100 + efek Lebaran +400 (hanya di bulan Lebaran, dengan dummy bergeser). Ramalan: 100 biasa, 500 saat Lebaran. <strong>Error turun 80%.</strong> Pelajaran: satu angka untuk pola musiman = salah untuk semua.</p>"""},
"charts": [
{"data": """[{x: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"], y: [100,95,105,500,110,100,95,105,100,110,120,150], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "aktual"}, {x: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"], y: [133,133,133,133,133,133,133,133,133,133,133,133], type: "scatter", mode: "lines", line: {dash: "dash", color: "#ef4444"}, name: "rata-rata 12 bln"}]""",
"title": "Sirup: aktual vs ramalan rata-rata",
"layout": """{xaxis: {title: "Bulan"}, yaxis: {title: "Penjualan"}, showlegend: true}""",
"cara": "Biru = aktual (dengan puncak Lebaran April), merah putus = ramalan rata-rata 133.",
"interpretasi": "Garis merah salah di <strong>semua</strong> titik: terlalu tinggi 11 bulan (overstock), terlalu rendah saat Lebaran (stockout). Inilah 'rata-rata yang adil tapi salah total'. Solusi: model yang menghormati musiman + holiday bergeser."},
],
},
{
"id": "metode", "toc": "Metode Forecasting",
"title": "Metode — Dari Naive hingga Holt-Winters",
"body": """<p><strong>Definisi.</strong> <strong>Seasonal naive</strong>: ramalan = nilai periode yang sama tahun lalu (baseline yang kuat!). <strong>Moving average</strong>: rata-rata k periode terakhir (menghaluskan noise, tapi lag saat trend). <strong>Exponential smoothing (SES)</strong>: rata-rata berbobot eksponensial (data baru lebih berat). <strong>Holt-Winters</strong>: SES + trend + musiman — kuda kerja forecasting ritel.</p>
<p>Aturan: <strong>kalahkan seasonal naive dulu</strong> sebelum bangga dengan model canggih. Banyak model ML kalah dari seasonal naive di data musiman kuat.</p>""",
"formulas": [
{"math": r"\hat{y}_{t+1} = \alpha y_t + (1-\alpha)\hat{y}_t \quad;\quad 0 < \alpha < 1",
"symbols": [
"<Tex math={String.raw`\\hat{y}_{t+1}`} />: ramalan periode depan",
"<Tex math={String.raw`\\alpha`} />: bobot data terbaru (α besar = responsif tapi berisik; α kecil = halus tapi lag)",
"<Tex math={String.raw`y_t`} />: aktual terakhir",
"Holt-Winters menambah komponen trend &amp; musiman dengan α, β, γ masing-masing",
]},
],
"intuisi": "Exponential smoothing seperti <strong>kemudi kapal</strong>: α besar = kemudi sensitif (bereaksi tiap ombak — mabuk), α kecil = kemudi berat (stabil tapi telat belok). Holt-Winters = kemudi + kompas (trend) + peta arus musiman.",
"kapan": "Holt-Winters: data musiman jelas + trend. Seasonal naive: baseline wajib. ARIMA/ML: pola kompleks + data panjang (dengan validasi ketat).",
"worked": {"title": "📐 Contoh: SES manual 3 langkah (klik untuk buka)",
"body": """<p>Data: 100, 110, 105. α = 0,5. Ramalan awal ŷ1 = 100.</p>
<p><strong>Langkah 1:</strong> ŷ2 = 0,5×100 + 0,5×100 = 100. <strong>Langkah 2:</strong> ŷ3 = 0,5×110 + 0,5×100 = 105. <strong>Langkah 3:</strong> ŷ4 = 0,5×105 + 0,5×105 = 105.</p>
<p>Ramalan periode 4 = <strong>105</strong>. Perhatikan: SES 'belajar' — ramalan bergerak mengikuti data, dengan lag yang ditentukan α.</p>"""},
"charts": [],
},
{
"id": "evaluasi", "toc": "Evaluasi & Hierarki",
"title": "Evaluasi & Hierarki — Salah yang Jujur, Angka yang Akur",
"body": """<p><strong>Definisi.</strong> <strong>WAPE</strong> = Σ|aktual − ramalan| / Σ|aktual| (lebih stabil dari MAPE yang meledak saat aktual ≈ 0). <strong>Bias</strong> = rata-rata (ramalan − aktual): positif = over-forecast sistematis (overstock!), negatif = under (stockout). <strong>Hierarki</strong>: ramal di banyak level (SKU → kategori → total); <strong>rekonsiliasi</strong> memastikan jumlah SKU = total kategori (bottom-up, top-down, atau optimal).</p>
<p>Tanpa rekonsiliasi: total 100 SKU diramal 1.000, tapi kategori diramal 1.200 — gudang bingung pakai angka mana.</p>""",
"formulas": [
{"math": r"\text{WAPE} = \frac{\sum |y_t - \hat{y}_t|}{\sum |y_t|} \quad;\quad \text{Bias} = \frac{1}{n}\sum(\hat{y}_t - y_t)",
"symbols": [
"WAPE 10% = rata-rata error 10% dari total volume — bahasa yang dimengerti operasional",
"Bias +5% = ramalan sistematis ketinggian 5% (overstock kronis); bias −5% = stockout kronis",
"Target: WAPE kecil DAN bias ≈ 0 (akurat tapi bias = tetap salah arah)",
]},
],
"intuisi": "WAPE seperti <strong>nilai rapor</strong>, bias seperti <strong>kecenderungan</strong>: murid dengan nilai 70 tapi selalu melebih-lebihkan (bias +) = percaya diri palsu. Rekonsiliasi hierarki seperti <strong>anggaran keluarga</strong>: total belanja anak-anak harus sama dengan total anggaran — tidak bisa masing-masing mengarang.",
"kapan": "Evaluasi: selalu WAPE + bias (bukan cuma satu). Hierarki: operasional multi-level (gudang butuh SKU, direksi butuh total).",
"worked": {"title": "📐 Contoh: Bias yang mahal (klik untuk buka)",
"body": """<p>Dua model, WAPE sama 12%. Model A bias +8% (selalu ketinggian), model B bias −1%.</p>
<p><strong>Biaya:</strong> over-forecast 8% × Rp10M stok = Rp800jt modal menganggur + risiko kadaluarsa. Under-forecast 1% = Rp100jt lost sales.</p>
<p><strong>Pilih B</strong> — WAPE sama, bias beda jauh. Pelajaran: jangan lapor akurasi tanpa bias. Dan bias bisa dikoreksi (kurangi 8%) — gratis!</p>"""},
"charts": [
{"data": """[{x: ["M1","M2","M3","M4","M5","M6"], y: [100,110,105,500,115,108], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "aktual"}, {x: ["M7","M8","M9"], y: [112,108,115], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "ramalan"}, {x: ["M7","M8","M9","M7","M8","M9"], y: [125,121,128,99,95,102], type: "scatter", mode: "lines", fill: "tonexty", fillcolor: "rgba(232,168,56,0.2)", line: {width: 0}, showlegend: false}]""",
"title": "Ramalan + interval (contoh)",
"layout": """{xaxis: {title: "Bulan"}, yaxis: {title: "Penjualan"}, showlegend: true}""",
"cara": "Biru = histori (dengan puncak), kuning = ramalan 3 bulan, pita = interval ketidakpastian.",
"interpretasi": "Ramalan tanpa interval = janji palsu. Pita melebar seiring horizon — ketidakpastian tumbuh. Keputusan stok: pakai <strong>batas atas</strong> interval untuk item kritis (stockout mahal), <strong>tengah</strong> untuk biasa. Interval = bahasa kejujuran forecaster."},
],
},
],
"myths": [
{"t": "Model forecasting tercanggih (deep learning) pasti paling akurat.",
"benar": "Di data musiman kuat, <strong>seasonal naive & Holt-Winters sering menang</strong> lawan ML — dengan 1% usaha. ML menang saat banyak regressor eksternal (harga, promo, cuaca) + data panjang. Aturan: kalahkan seasonal naive dulu; kompleksitas harus dibayar dengan WAPE yang jauh lebih baik di <em>backtest out-of-time</em>."},
{"t": "Forecast = target penjualan. Ramalan 1.000 berarti tim harus jual 1.000.",
"benar": "Forecast = <strong>tebakan terbaik dunia tanpa intervensi</strong>; target = <strong>ambisi dengan intervensi</strong>. Mencampur keduanya merusak keduanya: tim 'memasak' forecast agar target tercapai. Pisahkan: forecast (data) → gap ke target → rencana aksi (marketing) untuk menutup gap."},
],
"tips": [
"<strong>Backtest out-of-time, bukan cross-validation acak.</strong> Time series tidak boleh diacak (leakage masa depan!). Uji: latih s.d. 2024, ramal 2025, bandingkan. Model yang bagus di CV acak tapi jeblok di backtest = overfit pada masa depan.",
"<strong>Holiday bergeser = regressor, bukan musiman.</strong> Lebaran, Imlek, Natal orthodoks: buat dummy 'H-7 s.d. H+7 Lebaran' tiap tahun mengikuti kalender aslinya. Model musiman bulanan murni akan selalu salah 2–4 minggu untuk ini.",
],
"labs": [
{"heading": "Holt-Winters Sederhana From-Scratch",
"intro": "Implementasi SES + trend (Holt) manual. Lihat ramalan mengikuti data dengan lag.",
"title": "Lab 1 — Holt From-Scratch",
"hint": "Ubah ALPHA 0.5 → 0.9. Ramalan jadi 'gugup' mengikuti noise. Itulah tradeoff α.",
"code": """# Holt's linear trend (SES + trend) from scratch
data = [100, 110, 105, 115, 125, 120, 130, 140, 135, 150, 160, 155]
ALPHA, BETA = 0.5, 0.3  # ubah sesukamu

level, trend = data[0], data[1] - data[0]
ramal = []
for y in data[1:]:
    ramal.append(level + trend)
    l_baru = ALPHA * y + (1 - ALPHA) * (level + trend)
    trend = BETA * (l_baru - level) + (1 - BETA) * trend
    level = l_baru

print(f"{'t':>4} {'aktual':>8} {'ramalan':>8}  error")
for i, (y, r) in enumerate(zip(data[1:], ramal), 2):
    print(f"{i:>4} {y:>8} {r:>8.1f}  {y-r:+.1f}")
print(f"\\nRamalan t+1: {level + trend:.1f}")
wape = sum(abs(y-r) for y, r in zip(data[1:], ramal)) / sum(data[1:])
print(f"WAPE in-sample: {wape:.1%}")
"""},
{"heading": "WAPE & Bias: Dua Sisi Akurasi",
"intro": "Bandingkan dua model dengan WAPE sama tapi bias beda — pilih yang benar.",
"title": "Lab 2 — WAPE vs Bias",
"hint": "Ubah err_a menjadi [-0.08]*8 (under-forecast). Untuk produk yang stockout-nya mahal (obat), mana yang lebih buruk?",
"code": """# Bandingkan model: WAPE mirip, bias beda
aktual = [100, 110, 105, 115, 120, 118, 125, 130]
# A: murni bias +8% (selalu ketinggian) | B: noise acak +/-7% (tanpa bias)
err_a = [0.08]*8      # ubah jadi [-0.08]*8 untuk melihat under-forecast
err_b = [0.07, -0.07]*4
model_a = [y*(1+e) for y, e in zip(aktual, err_a)]
model_b = [y*(1+e) for y, e in zip(aktual, err_b)]

def wape(a, f): return sum(abs(x-y) for x, y in zip(a, f))/sum(a)
def bias(a, f): return sum(y-x for x, y in zip(a, f))/len(a)/ (sum(a)/len(a))

for nama, f in [("A", model_a), ("B", model_b)]:
    print(f"Model {nama}: WAPE={wape(aktual,f):.1%}, bias={bias(aktual,f):+.1%}")
print("\\nWAPE mirip (8% vs 7%), tapi A over-forecast sistematis +8% = overstock kronis.")
print("B tanpa bias: kadang lebih, kadang kurang - rata-rata tepat.")
print("Selalu lapor WAPE + bias, bukan satu angka!")
"""},
],
"decisions": [
{"kondisi": "Butuh baseline cepat", "pakai": "Seasonal naive",
"alasan": "Satu baris, sering mengalahkan model rumit; benchmark wajib.",
"contoh": "Ramalan awal tiap SKU baru."},
{"kondisi": "Trend + musiman jelas, data 2+ tahun", "pakai": "Holt-Winters",
"alasan": "Kuda kerja ritel; interpretable; cepat.",
"contoh": "Forecast penjualan SegarMart."},
{"kondisi": "Banyak driver eksternal (harga, promo, cuaca)", "pakai": "Regresi dinamis / ML + backtest ketat",
"alasan": "Menangkap efek yang tidak ada di histori murni.",
"contoh": "Es krim (cuaca), fashion (promo)."},
{"kondisi": "Multi-level (SKU → kategori → total)", "pakai": "Hierarki + rekonsiliasi",
"alasan": "Angka harus akur antar level keputusan.",
"contoh": "Gudang (SKU) vs direksi (total)."},
],
"rule10": "<ol><li><strong>Dekomposisi dulu</strong> (plot!).</li><li><strong>Kalahkan seasonal naive</strong> sebelum bangga.</li><li><strong>Lapor WAPE + bias</strong>, bukan satu angka.</li><li><strong>Backtest out-of-time</strong> — jangan acak.</li></ol>",
"case": {"toc": "Mini-Case: Lebaran SegarMart",
"title": "Lebaran yang (Tidak Lagi) Kehabisan Stok",
"body": """<p>SegarMart: sirup kehabisan tiap Lebaran, kelebihan setelahnya. Model: rata-rata 12 bulan (=133). Data: 11 bulan @100, Lebaran @500 (bergeser tiap tahun).</p>""",
"q": "(a) Tiga cacat model rata-rata? (b) Rancang model yang benar (komponen + metode). (c) Kebijakan stok dengan interval?",
"pembahasan": """<p>(a) <strong>Menghancurkan musiman</strong> (133 salah untuk semua bulan), <strong>buta holiday bergeser</strong> (Lebaran pindah tiap tahun), <strong>tanpa interval</strong> (tidak tahu risiko).</p>
<p>(b) <strong>Dekomposisi:</strong> baseline 100 + dummy Lebaran (H−14 s.d. H+7, ikut kalender Hijriah) + trend ringan. <strong>Metode:</strong> Holt-Winters + regressor holiday, atau regresi dinamis. <strong>Validasi:</strong> backtest 3 Lebaran terakhir.</p>
<p>(c) <strong>Stok = batas atas interval 80%</strong> untuk sirup (stockout mahal: pelanggan pindah), <strong>median</strong> untuk pelengkap. Review: tiap tahun sesuaikan dummy dengan tanggal Lebaran resmi.</p>"""},
"quiz": [
{"q": "Data: 11 bulan @100, Lebaran @500. Ramalan rata-rata 12 bulan untuk bulan Lebaran?",
"options": ["500 (tepat)", "133 (kurang 367 — stockout!)", "100", "600"], "correct": 1,
"why": "Benar: (11×100+500)/12 = 133. Kurang 367 dari kebutuhan 500 = rak kosong saat puncak. Rata-rata menghancurkan musiman."},
{"q": "Dua model WAPE 12%. A bias +8%, B bias −1%. Pilih?",
"options": ["A", "B — bias kecil; bias bisa dikoreksi", "Sama saja", "Tolak keduanya"], "correct": 1,
"why": "Benar: WAPE sama, B tidak punya kecenderungan sistematis. Bias +8% = overstock kronis Rp800jt. Dan bias mudah dikoreksi (kurangi 8%) — gratis."},
{"q": "Kenapa cross-validation acak dilarang untuk time series?",
"options": ["Terlalu lambat", "Leakage: model 'melihat' masa depan saat training", "Tidak ada alasan", "Hanya untuk data kecil"], "correct": 1,
"why": "Benar: CV acak melatih dengan data Desember untuk meramal Januari — di dunia nyata kamu tidak punya Desember. Backtest out-of-time satu-satunya yang jujur."},
{"q": "Lebaran bergeser tiap tahun. Perlakuan benar?",
"options": ["Abaikan — musiman bulanan cukup", "Regressor/dummy holiday mengikuti kalender Hijriah", "Hapus data Lebaran", "Rata-ratakan saja"], "correct": 1,
"why": "Benar: musiman 'April' gagal saat Lebaran jatuh di Maret. Dummy H−14 s.d. H+7 mengikuti tanggal aslinya — model belajar pola relatif terhadap Lebaran, bukan bulan."},
{"q": "Kapan seasonal naive lebih baik dari model kompleks?",
"options": ["Tidak pernah", "Sering — di data musiman kuat ia benchmark yang sulit dikalahkan", "Hanya data kecil", "Hanya tanpa komputer"], "correct": 1,
"why": "Benar: 'nilai tahun lalu periode ini' menangkap musiman sempurna. Banyak model ML gagal mengalahkannya. Kalahkan dulu sebelum klaim canggih."},
],
"rangkum": [
"<strong>Dekomposisi</strong>: trend + musiman + holiday (bergeser!) + noise; selalu plot dulu.",
"<strong>Metode</strong>: seasonal naive (benchmark) → MA → SES/Holt-Winters (kuda kerja) → regresi/ML (banyak driver).",
"<strong>Evaluasi</strong>: WAPE (stabil) + bias (arah salah); target keduanya kecil.",
"<strong>Backtest out-of-time</strong> — CV acak = leakage.",
"<strong>Hierarki + rekonsiliasi</strong>: angka SKU, kategori, total harus akur.",
"<strong>Forecast ≠ target</strong>: forecast = tebakan tanpa intervensi; target = ambisi.",
],
"prev": ["mk14-pricing", "MK14"],
"next": ["mk16-digital-ads", "MK16"],
},
{
"slug": "mk16-digital-ads", "id": "MK16", "track": "Marketing Data Analytics",
"title_html": "Digital Ads:<br/>Lelang, Bid & Alokasi Budget",
"title_plain": "Digital Ads: Auction, CTR/CVR, Bid & Budget",
"chapter_summary": "Mekanika iklan digital: cara kerja lelang (Ad Rank, GSP), funnel CTR/CVR, strategi bidding (manual, tCPA, tROAS), alokasi budget via marginal ROI, frequency capping, dan jebakan view-through.",
"tujuan": [
"Menjelaskan cara kerja lelang iklan (Ad Rank, second-price) dan kenapa bid tertinggi tidak selalu menang.",
"Menghitung CTR, CVR, CPC, CPA dan membaca funnel iklan.",
"Membedakan strategi bid manual vs tCPA vs tROAS dan memilih yang tepat.",
"Mengalokasikan budget antar-kampanye via marginal ROI + frequency cap.",
],
"story_title": "Cerita: Bid Tertinggi yang Kalah (dan Menang)",
"story": """<p>Brand <em>&ldquo;SepatuLari&rdquo;</em> menaikkan bid 3x lipat agar &ldquo;menang lelang&rdquo;. Hasil: posisi naik sedikit, <strong>CPA naik 2,5x</strong> — boncos. Konsultan menyarankan sebaliknya: <strong>turunkan bid 30%, perbaiki kualitas iklan</strong>. Hasil: posisi sama, CPA turun 40%.</p>
<p>Twist-nya: lelang Google/Meta <strong>bukan lelang harga tertinggi</strong> — melainkan <strong>Ad Rank = bid × kualitas</strong>. Bid 3x dengan kualitas jeblok kalah dari bid normal berkualitas tinggi. Dan karena <em>second-price</em>, pemenang membayar <em>semurah mungkin</em> untuk mempertahankan posisi — bukan bid-nya. Lesson ini: fisika lelang yang membuat intuisi 'mahal = menang' runtuh.</p>""",
"concepts": [
{
"id": "lelang", "toc": "Mekanika Lelang",
"title": "Lelang — Bukan Siapa Bayar Termahal",
"body": """<p><strong>Definisi.</strong> Setiap impression dilelang real-time. <strong>Ad Rank</strong> = bid × Quality Score (relevansi, expected CTR, landing page). Urutan tampil by Ad Rank, bukan bid. <strong>Second-price (GSP)</strong>: pemenang membayar secukupnya untuk mengalahkan peringkat di bawahnya — bukan sebesar bid-nya.</p>
<p>Implikasi: <strong>naikkan kualitas = diskon permanen</strong> (bayar lebih murah untuk posisi sama). Menaikkan bid tanpa kualitas = bayar mahal untuk posisi yang sama.</p>""",
"formulas": [
{"math": r"\text{AdRank} = \text{bid} \times \text{Quality} \quad;\quad \text{CPC}_{bayar} = \frac{\text{AdRank}_{bawah}}{\text{Quality}_{kamu}} + \text{Rp}1",
"symbols": [
"<Tex math={String.raw`\\text{bid}`} />: tawaran maksimum per klik",
"<Tex math={String.raw`\\text{Quality`} />: skor kualitas (1–10): relevansi + expected CTR + landing page",
"<Tex math={String.raw`\\text{CPC}_{bayar}`} />: yang benar-benar dibayar — ditentukan pesaing di bawahmu, bukan bid-mu",
"Naikkan Quality 5→8 = CPC turun ~37% untuk AdRank yang sama",
]},
],
"intuisi": "Lelang iklan seperti <strong>lelang lukisan di mana juri juga menilai 'ketampanan' pelukisnya</strong>: pelukis tampan (quality tinggi) bisa menang dengan tawaran lebih rendah. Dan pemenang membayar 'sedikit di atas tawaran pecundang' — bukan tawaran penuhnya. Jadi: dandani dirimu (quality), bukan dompetmu (bid).",
"kapan": "Setiap optimasi search/social ads. Audit quality score sebelum utak-atik bid.",
"worked": {"title": "📐 Contoh: SepatuLari vs kompetitor (klik untuk buka)",
"body": """<p>SepatuLari: bid Rp10.000, quality 4 → AdRank 40.000. Kompetitor: bid Rp6.000, quality 8 → AdRank 48.000.</p>
<p><strong>Kompetitor menang</strong> walau bid 40% lebih rendah! CPC kompetitor = 40.000/8 + 1 = <strong>Rp5.001</strong>.</p>
<p><strong>Setelah perbaiki quality</strong> 4→8: AdRank = 80.000 → menang. CPC = 48.000/8 + 1 = <strong>Rp6.001</strong> (asumsi kompetitor tetap). Posisi 1 dengan CPC <em>lebih murah</em> dari bid awal. Inilah 'diskon kualitas'.</p>"""},
"charts": [
{"data": """[{x: ["Bid 10rb<br>Q=4", "Bid 6rb<br>Q=8", "Bid 10rb<br>Q=8"], y: [40000, 48000, 80000], type: "bar", marker: {color: ["#e8a838","#2a7de1","#16a34a"]}, text: ["40rb","48rb","80rb"], textposition: "outside"}]""",
"title": "Ad Rank: bid × quality",
"layout": """{yaxis: {title: "Ad Rank"}, showlegend: false}""",
"cara": "Tinggi batang = Ad Rank (penentu pemenang & posisi).",
"interpretasi": "Bid 10rb+Q4 (kuning) kalah dari bid 6rb+Q8 (biru). Setelah quality diperbaiki (hijau), AdRank 2x lipat dengan bid sama. <strong>Kualitas = leverage gratis.</strong> Budget iklan terbaik sering = budget bikin iklan bagus."},
],
},
{
"id": "funnel", "toc": "CTR, CVR & Funnel Iklan",
"title": "Funnel Iklan — Dari Tayang ke Beli",
"body": """<p><strong>Definisi.</strong> <strong>Impression</strong> (tayang) → <strong>CTR</strong> (klik/tayang) → <strong>CVR</strong> (konversi/klik) → CPA = spend/konversi. Funnel: 1.000.000 impression × CTR 1% = 10.000 klik × CVR 2% = 200 beli. <strong>Frequency</strong> = rata-rata tayang per orang; <strong>reach</strong> = orang unik.</p>
<p>Jebakan: <strong>CTR tinggi ≠ iklan bagus</strong> (clickbait: CTR 5%, CVR 0,1% — rugi). Optimasi ke <strong>CPA/ROAS</strong>, bukan CTR. Dan waspadai <strong>view-through</strong> (klaim konversi 'karena lihat iklan' tanpa klik — atribusi paling longgar).</p>""",
"formulas": [
{"math": r"\text{CPA} = \frac{\text{Spend}}{\text{Conv}} = \frac{\text{CPC}}{\text{CVR}} \quad;\quad \text{CTR} = \frac{\text{Klik}}{\text{Impression}}",
"symbols": [
"CPA bisa diturunkan dua jalan: CPC turun (lelang/quality) ATAU CVR naik (landing page)",
"CTR mengukur 'menarik diklik'; CVR mengukur 'meyakinkan dibeli' — keduanya harus sehat",
"View-through: konversi ≤24 jam setelah lihat (tanpa klik) — klaim terlemah, jangan jadi metrik utama",
]},
],
"intuisi": "Funnel iklan seperti <strong>corong penjualan di pasar</strong>: teriakan (impression) → orang menoleh (klik) → orang beli (konversi). Teriakan paling keras (CTR tinggi) tidak berguna kalau yang menoleh cuma lihat-lihat (CVR rendah). Yang dihitung = pembeli, bukan penoleh.",
"kapan": "Monitoring harian. Diagnosis: CTR rendah → kreatif/audiens; CVR rendah → landing page/penawaran.",
"worked": {"title": "📐 Contoh: Clickbait vs jujur (klik untuk buka)",
"body": """<p>Iklan A (clickbait): CTR 5%, CVR 0,2%, CPC Rp2.000 → CPA = 2.000/0,002 = <strong>Rp1.000.000</strong>. Iklan B (jujur): CTR 1%, CVR 3%, CPC Rp3.000 → CPA = 3.000/0,03 = <strong>Rp100.000</strong>.</p>
<p><strong>A 'menang' CTR 5x, tapi CPA-nya 10x lebih mahal.</strong> Optimasi CTR = mengoptimasi penoleh, bukan pembeli. Metrik utara = CPA/ROAS.</p>"""},
"charts": [],
},
{
"id": "bid", "toc": "Bid Strategy & Alokasi",
"title": "Bid & Budget — Otomatisasi yang Perlu Disetir",
"body": """<p><strong>Definisi.</strong> <strong>Manual CPC</strong>: kamu setel bid (kontrol penuh, effort besar). <strong>tCPA</strong>: algoritma jaga CPA ≈ target (butuh ≥30 konversi/minggu untuk belajar). <strong>tROAS</strong>: maksimalkan value dengan target ROAS (butuh value tracking rapi). <strong>Budget allocation</strong>: bagi budget antar-kampanye by <strong>marginal ROAS</strong> (samakan seperti MK13).</p>
<p><strong>Frequency capping</strong>: batasi tayang per orang (mis. 3x/minggu) — frequency 50x = spam yang dibayar mahal. <strong>Pacing</strong>: habiskan budget merata (bukan habis jam 10 pagi).</p>""",
"formulas": [],
"intuisi": "Smart bidding seperti <strong>supir taksi berpengalaman</strong>: kasih tahu tujuan (tCPA) dan ia cari jalan terbaik. Tapi ia butuh 'peta' (data konversi cukup) dan kadang nyasar (learning period) — jangan ganti tujuan tiap 2 hari. Manual = nyetir sendiri: capek tapi paham jalan.",
"kapan": "tCPA/tROAS: konversi ≥30/minggu & tracking rapi. Manual: data tipis / testing. Alokasi: review mingguan by marginal ROAS.",
"worked": {"title": "📐 Contoh: Alokasi Rp500jt (klik untuk buka)",
"body": """<p>Kampanye A: spend 300jt, ROAS 4,0 (marginal 2,5). B: spend 150jt, ROAS 6,0 (marginal 5,0). C: spend 50jt, ROAS 2,0 (marginal 1,2).</p>
<p><strong>Geser Rp50jt dari A ke B:</strong> A turun ke 250jt (marginal naik ke ~2,8 — kurva!), B naik ke 200jt (marginal turun ke ~4,2). Total value naik.</p>
<p><strong>Aturan:</strong> alokasikan sampai marginal ROAS sama di semua kampanye (dan ≥ target). Review mingguan — marginal bergeser terus.</p>"""},
"charts": [
{"data": """[{x: [50,100,150,200,250,300], y: [8,6,5,4.2,3.5,2.5], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "marginal ROAS B"}, {x: [50,300], y: [3,3], type: "scatter", mode: "lines", line: {dash: "dash", color: "#16a34a"}, name: "target"}]""",
"title": "Marginal ROAS vs spend (kampanye B)",
"layout": """{xaxis: {title: "Spend (Rp jt)"}, yaxis: {title: "Marginal ROAS"}, showlegend: true}""",
"cara": "Sumbu X = spend, Y = ROAS rupiah berikutnya. Garis hijau = target 3,0.",
"interpretasi": "Marginal ROAS turun 8 → 2,5 seiring spend (saturasi!). Titik temu garis hijau ≈ Rp230jt = <strong>budget optimal B</strong>. Lebih dari itu = rupiah berikutnya di bawah target. Inilah 'kurva saturasi'-nya digital (ingat MK13) — beda baju, prinsip sama."},
],
},
],
"myths": [
{"t": "Bid tertinggi selalu menang lelang. Menaikkan bid = solusi.",
"benar": "Pemenang = <strong>Ad Rank tertinggi</strong> (bid × quality). Kasus SepatuLari: bid 3x tetap kalah dari kompetitor ber-quality tinggi. Menaikkan bid tanpa quality = <strong>bayar lebih untuk posisi sama</strong> (second-price). Audit quality dulu — sering 'diskon 37%' menanti."},
{"t": "CTR tinggi = iklan bagus. Optimasi CTR saja.",
"benar": "Clickbait: CTR 5%, CVR 0,2% → CPA Rp1jt vs iklan jujur CTR 1%, CVR 3% → CPA Rp100rb. <strong>CTR mengukur penoleh, CPA mengukur pembeli.</strong> Metrik utara = CPA/ROAS; CTR hanya diagnostik (kreatif/audiens bermasalah?)."},
],
"tips": [
"<strong>Quality score = diskon permanen.</strong> Naik 5→8 ≈ CPC turun 37% untuk posisi sama — selamanya, di semua lelang. Investasi kreatif & landing page = satu-satunya 'bid' yang tidak habis.",
"<strong>Jangan ganti strategi bid tiap 2 hari.</strong> Smart bidding butuh learning period (±30 konversi). Gonta-ganti target = algoritma tidak pernah lulus 'sekolah'. Komitmen minimal 2 minggu per setting.",
],
"labs": [
{"heading": "Simulator Lelang GSP",
"intro": "Simulasikan lelang: masukkan bid & quality tiap pengiklan, lihat siapa menang & berapa bayar.",
"title": "Lab 1 — Simulator Lelang",
"hint": "Naikkan quality-mu 4 → 9 (bid tetap). Lihat posisimu naik DAN CPC turun — 'diskon kualitas'.",
"code": """# Simulator lelang GSP (Generalized Second Price)
pengiklan = [
    ("Kamu",     10000, 4),   # (nama, bid, quality) — ubah sesukamu
    ("Kompetitor", 6000, 8),
    ("BrandC",     8000, 5),
]
rank = sorted(pengiklan, key=lambda p: p[1]*p[2], reverse=True)
print(f"{'pos':>4} {'nama':<11} {'bid':>7} {'Q':>3} {'adrank':>7}  bayar/klik")
for i, (nama, bid, q) in enumerate(rank):
    adr = bid*q
    bayar = rank[i+1][1]*rank[i+1][2]/q + 1 if i+1 < len(rank) else 1
    print(f"{i+1:>4} {nama:<11} {bid:>7,} {q:>3} {adr:>7,}  Rp{bayar:,.0f}")
print("\\nPemenang = AdRank tertinggi, bayar = secukupnya kalahkan di bawahnya.")
"""},
{"heading": "Alokator Budget Marginal",
"intro": "Bagi budget Rp500jt ke 3 kampanye agar marginal ROAS seimbang.",
"title": "Lab 2 — Alokator Budget",
"hint": "Ubah kurva salah satu kampanye (marginal turun lebih cepat). Lihat alokasi bergeser — alokasi = makhluk hidup, bukan sekali set.",
"code": """# Alokasi budget: samakan marginal ROAS (pendekatan iteratif sederhana)
# marginal ROAS tiap kampanye sebagai fungsi spend (jt)
def mA(s): return max(8 - 0.02*s, 0.5)
def mB(s): return max(10 - 0.03*s, 0.5)
def mC(s): return max(4 - 0.01*s, 0.5)

TOTAL = 500
alokasi = {"A": TOTAL/3, "B": TOTAL/3, "C": TOTAL/3}
m = {"A": mA, "B": mB, "C": mC}
for _ in range(200):  # geser 1jt dari marginal terendah ke tertinggi
    ms = {k: m[k](v) for k, v in alokasi.items()}
    hi = max(ms, key=ms.get); lo = min(ms, key=ms.get)
    if ms[hi] - ms[lo] < 0.05: break
    alokasi[hi] += 1; alokasi[lo] -= 1

print("Alokasi optimal (Rp jt) & marginal ROAS:")
for k in "ABC":
    print(f"  {k}: {alokasi[k]:6.0f} jt  (marginal {m[k](alokasi[k]):.2f})")
print("\\nPrinsip: rupiah terakhir di tiap kampanye harus sama 'produktif'-nya.")
"""},
],
"decisions": [
{"kondisi": "Quality score rendah (&lt;5)", "pakai": "Perbaiki kreatif & landing page DULU",
"alasan": "Diskon permanen 30–40%; bid tidak menutup quality jeblok.",
"contoh": "Audit QS mingguan sebelum utak-atik bid."},
{"kondisi": "Konversi ≥30/minggu, tracking rapi", "pakai": "tCPA/tROAS",
"alasan": "Algoritma optimasi lebih baik dari manusia di skala ini.",
"contoh": "E-commerce mapan."},
{"kondisi": "Data tipis / fase testing", "pakai": "Manual CPC + budget kecil",
"alasan": "Smart bidding butuh data; jangan sekolahkan algoritma dengan uang receh.",
"contoh": "Produk baru, kampanye baru."},
{"kondisi": "Frequency &gt; 10/minggu per orang", "pakai": "Frequency cap + perluas audiens/kreatif",
"alasan": "Spam berbayar: CPA naik, brand turun.",
"contoh": "Cap 3x/minggu; rotasi 3+ kreatif."},
],
"rule10": "<ol><li><strong>Ad Rank = bid × quality.</strong> Quality dulu.</li><li><strong>Optimasi CPA/ROAS</strong>, bukan CTR.</li><li><strong>Samakan marginal ROAS</strong> antar-kampanye.</li><li><strong>Frequency cap</strong> selalu.</li></ol>",
"case": {"toc": "Mini-Case: Boncos SepatuLari",
"title": "Boncos SepatuLari",
"body": """<p>SepatuLari: bid naik 3x → posisi naik sedikit, CPA naik 2,5x. Quality score 4/10 (landing page lambat, relevansi rendah). Kompetitor: bid lebih rendah, QS 8/10.</p>""",
"q": "(a) Jelaskan mekanismenya (rumus). (b) Rencana perbaikan 2 minggu? (c) Kapan boleh menaikkan bid?",
"pembahasan": """<p>(a) <strong>AdRank = 10.000×4 = 40rb &lt; 6.000×8 = 48rb</strong> → kalah walau bid 67% lebih tinggi. CPC yang dibayar ditentukan AdRank bawah/QS sendiri — QS rendah = bayar mahal untuk posisi apa pun.</p>
<p>(b) <strong>Minggu 1:</strong> perbaiki landing (speed, relevansi keyword) + 3 varian kreatif → target QS 7+. <strong>Minggu 2:</strong> uji dengan bid SAMA; ukur CPC & CPA. Ekspektasi: CPC turun ~35%.</p>
<p>(c) <strong>Boleh naik bid jika:</strong> QS sudah sehat (≥7), marginal ROAS masih &gt; target (ada ruang), dan untuk <em>scale</em> — bukan untuk menutup quality jeblok.</p>"""},
"quiz": [
{"q": "A: bid 10rb, Q4. B: bid 6rb, Q8. Siapa menang dan berapa CPC B?",
"options": ["A menang", "B menang, CPC ≈ Rp5.001", "Seri", "Tidak bisa dihitung"], "correct": 1,
"why": "Benar: AdRank B=48rb &gt; A=40rb → B menang. CPC B = 40.000/8+1 = Rp5.001 (second-price: bayar secukupnya kalahkan A)."},
{"q": "Iklan clickbait CTR 5% CVR 0,2% CPC Rp2rb vs jujur CTR 1% CVR 3% CPC Rp3rb. CPA?",
"options": ["Clickbait lebih murah", "Jujur Rp100rb vs clickbait Rp1jt — jujur 10x lebih murah", "Sama", "CTR menentukan"], "correct": 1,
"why": "Benar: CPA = CPC/CVR. Clickbait: 2.000/0,002 = Rp1jt. Jujur: 3.000/0,03 = Rp100rb. CTR tinggi ≠ murah."},
{"q": "Kapan memakai tCPA?",
"options": ["Selalu", "Konversi ≥30/minggu + tracking rapi", "Data tipis", "Tidak pernah"], "correct": 1,
"why": "Benar: smart bidding butuh 'sekolah' (data). Di bawah 30 konversi/minggu, algoritma menebak-nebak — manual lebih baik."},
{"q": "Frequency 50x/minggu per orang. Tindakan?",
"options": ["Naikkan budget", "Frequency cap + perluas audiens/kreatif", "Biarkan", "Naikkan bid"], "correct": 1,
"why": "Benar: 50x = spam berbayar — CPA naik (kelelahan), brand turun. Cap 3x/minggu + rotasi kreatif."},
{"q": "Alokasi optimal antar-kampanye tercapai saat?",
"options": ["Budget sama rata", "Marginal ROAS sama (dan ≥ target)", "ROAS rata-rata sama", "Spend terbesar menang"], "correct": 1,
"why": "Benar: rupiah terakhir harus sama produktifnya di semua kampanye. Rata-rata menipu (ingat saturasi MK13)."},
],
"rangkum": [
"<strong>Ad Rank = bid × quality</strong>; pemenang bayar second-price. Quality = diskon permanen.",
"<strong>Funnel</strong>: impression → CTR → CVR → CPA = CPC/CVR. Optimasi CPA/ROAS, bukan CTR.",
"<strong>Bid strategy</strong>: manual (data tipis) vs tCPA/tROAS (≥30 konversi/minggu); jangan gonta-ganti.",
"<strong>Alokasi</strong>: samakan marginal ROAS; review mingguan.",
"<strong>Frequency cap</strong>: batasi tayang per orang; waspadai view-through.",
"<strong>Kapan TIDAK naikkan bid</strong>: quality jeblok — perbaiki dulu.",
],
"prev": ["mk15-forecasting", "MK15"],
"next": ["mk17-text-analytics", "MK17"],
},
{
"slug": "mk17-text-analytics", "id": "MK17", "track": "Marketing Data Analytics",
"title_html": "Text Analytics:<br/>Mendengar 10.000 Ulasan Sekaligus",
"title_plain": "Text Analytics: Sentimen, Topik, Review Mining",
"chapter_summary": "Mengubah teks menjadi data: sentiment analysis (lexicon vs ML, aspect-based), topic modeling (LDA), review mining, dan memakai LLM untuk klasifikasi — dengan validasi yang benar. Lab: lexicon sentiment & keyword extraction from scratch.",
"tujuan": [
"Menjelaskan cara kerja lexicon vs ML sentiment dan memilih yang tepat.",
"Melakukan aspect-based sentiment (bukan sekadar positif/negatif).",
"Menjelaskan intuisi LDA topic modeling dan membaca outputnya.",
"Memakai LLM untuk klasifikasi teks dengan protokol validasi.",
],
"story_title": "Cerita: Rating 2,1 yang 'Misterius'",
"story": """<p>Aplikasi <em>&ldquo;AntarCepat&rdquo;</em> ratingnya anjlok <strong>4,5 → 2,1</strong> dalam 2 bulan. Tim produk panik dan menebak-nebak: <em>&ldquo;mungkin UI-nya?&rdquo;</em> <em>&ldquo;mungkin kompetitor?&rdquo;</em> Tiga sprint dihabiskan untuk redesign UI — rating tetap 2,1.</p>
<p>Twist-nya: analis junior menambang <strong>12.000 ulasan</strong> dalam 1 hari. Temuannya: 68% ulasan negatif menyebut <strong>&ldquo;driver&rdquo;</strong> dan <strong>&ldquo;lama&rdquo;</strong> — bukan UI! Masalahnya operasional (kepadatan order), bukan produk. Redesign UI = mengobati yang tidak sakit. <strong>Pelanggan sudah memberi tahu masalahnya — tertulis, 12.000 kali — tapi tidak ada yang mendengar.</strong> Lesson ini: cara mendengar dalam skala besar.</p>""",
"concepts": [
{
"id": "sentimen", "toc": "Sentiment Analysis",
"title": "Sentimen — Dari Kata ke Skor",
"body": """<p><strong>Definisi.</strong> <strong>Sentiment analysis</strong>: klasifikasikan teks jadi positif/negatif/netral (atau skor −1 s.d. +1). <strong>Lexicon-based</strong>: kamus kata berbobot ('bagus' +2, 'buruk' −3; tangani negasi: 'tidak bagus' = −2). Cepat, transparan, tanpa training — cukup untuk Bahasa Indonesia dengan kamus yang dirawat. <strong>ML-based</strong>: latih classifier (logistic/GBM/BERT) pada teks berlabel — akurat, tapi butuh data label &amp; validasi.</p>
<p><strong>Aspect-based</strong>: sentimen <em>per aspek</em> ('driver lambat tapi aplikasi bagus' → driver: negatif, aplikasi: positif). Inilah yang actionable — sentimen global 'negatif' tidak memberi tahu apa yang diperbaiki.</p>""",
"formulas": [
{"math": r"\text{skor} = \sum_{w} \text{bobot}(w) \times \text{negasi}(w)",
"symbols": [
"<Tex math={String.raw`w`} />: kata dalam teks (setelah normalisasi: lowercase, stemming sederhana)",
"<Tex math={String.raw`\\text{bobot}(w)`} />: dari lexicon ('cepat' +2, 'lama' −2, 'parah' −3)",
"<Tex math={String.raw`\\text{negasi}(w)`} />: −1 jika didahului 'tidak/jangan/bukan' dalam jendela 3 kata",
"Skor &gt; 0 positif, &lt; 0 negatif; magnitude = intensitas",
]},
],
"intuisi": "Lexicon seperti <strong>menghitung dengan jari</strong>: tiap kata 'bagus' +1, 'buruk' −1. Kasar tapi jujur & cepat. ML seperti <strong>membaca dengan pengalaman</strong>: paham sarkasme & konteks ('bagus banget... telat 2 jam' = negatif) — tapi butuh 'sekolah' (data label) dan bisa salah dengan percaya diri.",
"kapan": "Lexicon: eksplorasi cepat, Bahasa Indonesia, butuh transparansi. ML: volume besar + butuh akurasi + ada data label. Aspect-based: selalu jika ingin aksi.",
"worked": {"title": "📐 Contoh: Skor manual 2 ulasan (klik untuk buka)",
"body": """<p>Lexicon mini — cepat +2, lama −2, bagus +2, parah −3, ramah +2.</p>
<p><strong>U1:</strong> 'driver cepat dan ramah' → +2+2 = <strong>+4 (positif)</strong>.</p>
<p><strong>U2:</strong> 'tidak cepat, lama parah' → negasi('cepat')=−2, 'lama' −2, 'parah' −3 = <strong>−7 (negatif)</strong>.</p>
<p><strong>Aspect:</strong> U2 tentang 'driver' (kata 'driver' tidak ada — jebakan! butuh NER/aspect extraction untuk tahu topiknya). Inilah batas lexicon murni: ia tahu <em>rasanya</em>, belum tentu <em>tentang apa</em>.</p>"""},
"charts": [
{"data": """[{x: ["Driver", "Waktu tunggu", "Aplikasi/UI", "Harga", "CS"], y: [68, 55, 12, 8, 5], type: "bar", marker: {color: ["#ef4444","#ef4444","#e8a838","#94a3b8","#94a3b8"]}, text: ["68%","55%","12%","8%","5%"], textposition: "outside"}]""",
"title": "% ulasan negatif yang menyebut tiap aspek",
"layout": """{xaxis: {title: "Aspek"}, yaxis: {title: "% ulasan negatif"}, showlegend: false}""",
"cara": "Tinggi batang = % ulasan negatif yang menyebut aspek itu (satu ulasan bisa menyebut banyak aspek).",
"interpretasi": "Driver (68%) & waktu tunggu (55%) mendominasi — <strong>bukan UI (12%)</strong>. Tiga sprint redesign UI = mengobati 12% masalah. Inilah kekuatan aspect-based: ia menunjuk <em>di mana</em> darahnya, bukan cuma 'banyak darah'."},
],
},
{
"id": "topik", "toc": "Topic Modeling (LDA)",
"title": "Topic Modeling — Menemukan 'Tentang Apa' Tanpa Label",
"body": """<p><strong>Definisi.</strong> <strong>LDA</strong> (<em>Latent Dirichlet Allocation</em>): tiap dokumen = campuran topik; tiap topik = distribusi kata. Algoritma menemukan topik dari pola kemunculan bersama ('driver', 'lama', 'macet' sering bareng → topik 'keterlambatan'). Output: top words per topik + proporsi topik per dokumen.</p>
<p><strong>Coherence</strong> mengukur 'masuk akal tidaknya' topik (kata-kata yang memang berhubungan). Pilih jumlah topik via coherence + interpretasi manusia — topik 'bagus' = bisa diberi nama dalam 3 kata.</p>""",
"formulas": [],
"intuisi": "LDA seperti <strong>pustakawan yang mengelompokkan 12.000 surat pembaca tanpa membacanya satu-satu</strong>: ia melihat kata-kata yang sering muncul bersama dan menumpuknya jadi 'topik'. Ia tidak tahu nama topiknya ('keterlambatan') — manusia yang memberi nama dari top words.",
"kapan": "Eksplorasi awal korpus besar (apa saja yang dibicarakan?), sebelum membuat kategori manual. Bukan untuk klasifikasi presisi.",
"worked": {"title": "📐 Contoh: 3 topik AntarCepat (klik untuk buka)",
"body": """<p><strong>Topik 1:</strong> driver, lama, tunggu, macet, telat → nama: <em>'keterlambatan'</em> (45% dokumen).</p>
<p><strong>Topik 2:</strong> aplikasi, error, lemot, update, crash → <em>'bug aplikasi'</em> (25%).</p>
<p><strong>Topik 3:</strong> harga, mahal, promo, diskon, murah → <em>'harga'</em> (15%). Sisanya campur.</p>
<p><strong>Validasi:</strong> baca 20 dokumen top per topik — apakah benar tentang itu? Jika topik 1 tercampur 'makanan enak' (noise), turunkan/naikkan jumlah topik atau bersihkan preprocessing.</p>"""},
"charts": [],
},
{
"id": "llm", "toc": "LLM untuk Klasifikasi",
"title": "LLM — Asisten Baca yang Butuh Pengawas",
"body": """<p><strong>Definisi.</strong> <strong>LLM untuk klasifikasi</strong>: prompt terstruktur ('klasifikasikan ulasan ini ke [driver, aplikasi, harga, lain] + sentimen; jawab JSON') → label massal tanpa training. Kekuatan: paham konteks/sarkasme Bahasa Indonesia, setup 1 jam. Kelemahan: <strong>tidak konsisten</strong> (jawaban bisa beda tiap run), <strong>halusinasi label</strong>, biaya &amp; privasi.</p>
<p><strong>Protokol validasi wajib:</strong> (1) label manual 200–500 sampel sebagai gold; (2) ukur agreement (akurasi/F1 LLM vs gold); (3) jika &lt; 85%, perbaiki prompt (few-shot examples) atau turun ke ML klasik; (4) audit berkala (drift bahasa).</p>""",
"formulas": [],
"intuisi": "LLM seperti <strong>magang pintar tapi ceroboh</strong>: baca cepat, paham sarkasme, tapi kadang mengarang dan tidak konsisten. Kamu tidak memecatnya — kamu memberinya SOP (prompt), menguji dengan ujian (gold labels), dan memeriksa kerjanya berkala (audit).",
"kapan": "Klasifikasi multi-aspek Bahasa Indonesia, kategori berubah-ubah, tanpa data label. Jangan untuk keputusan kritis tanpa validasi (medis, hukum).",
"worked": {"title": "📐 Contoh: Protokol validasi (klik untuk buka)",
"body": """<p><strong>Prompt:</strong> 'Ulasan berikut tentang aspek apa? Pilih SATU: [driver, aplikasi, harga, cs, lain]. Lalu sentimen: [positif, negatif, netral]. Jawab dengan format: aspek = ..., sentimen = .... Ulasan: "..."'</p>
<p><strong>Gold:</strong> 300 ulasan dilabel 2 manusia (agreement antar-manusia 88% — ini plafon!).</p>
<p><strong>Hasil:</strong> LLM vs gold = 82% (aspek), 90% (sentimen). <strong>Keputusan:</strong> sentimen boleh otomatis; aspek perlu few-shot (tambah 5 contoh per kategori) → naik ke 87% → lolos.</p>
<p>Aturan: <strong>LLM tidak boleh lebih dipercaya dari agreement manusia.</strong> 82% vs plafon 88% = wajar; 82% vs plafon 98% = prompt buruk.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Sentimen negatif = pelanggan tidak puas. Hitung % negatif, selesai.",
"benar": "'Negatif tentang apa?' jauh lebih penting dari 'berapa % negatif'. AntarCepat: 68% negatif tentang <strong>driver</strong> — redesign UI (12%) = salah sasaran. Selalu pecah per <strong>aspek</strong>; sentimen global hanya untuk tren, bukan aksi."},
{"t": "LLM bisa langsung dipakai untuk klasifikasi — tidak perlu validasi, kan pintar.",
"benar": "LLM <strong>tidak konsisten & bisa halusinasi label</strong>. Tanpa gold labels (200–500 sampel) + metrik agreement, kamu tidak tahu ia 95% atau 55% benar. 'Pintar' ≠ 'terpercaya'. Protokol validasi = harga yang wajib dibayar."},
],
"tips": [
"<strong>Mulai dari yang paling sederhana yang menjawab pertanyaan.</strong> Butuh 'apa topik keluhan?' → keyword counting + LDA dulu (1 hari). Butuh klasifikasi presisi → ML/LLM (1 minggu). Jangan menembak lalat dengan meriam — dan jangan menembak gajah dengan ketapel.",
"<strong>Bahasa Indonesia butuh preprocessing khusus.</strong> Stemming (Sastrawi), slang ('lemot', 'mantul', 'gercep'), negasi ('nggak', 'gak', 'tidak'). Lexicon Inggris yang diterjemahkan mentah = gagal total. Rawat kamusmu seperti aset.",
],
"labs": [
{"heading": "Lexicon Sentiment Bahasa Indonesia",
"intro": "Skor sentimen + deteksi negasi dari kamus mini. Uji dengan ulasanmu sendiri.",
"title": "Lab 1 — Lexicon Sentiment ID",
"hint": "Coba kalimat sarkas: 'bagus banget, telat 2 jam'. Lihat lexicon gagal (skor positif!) — itulah batasnya vs ML/LLM.",
"code": """# Lexicon sentiment Bahasa Indonesia (mini) + negasi
LEX = {"bagus": 2, "cepat": 2, "ramah": 2, "mantap": 2, "puas": 2,
       "lama": -2, "lambat": -2, "buruk": -3, "parah": -3, "kecewa": -3,
       "mahal": -1, "murah": 1, "error": -2, "lemot": -2}
NEGASI = {"tidak", "nggak", "gak", "bukan", "jangan"}

def skor(teks):
    kata = teks.lower().split()
    total = 0
    for i, w in enumerate(kata):
        if w in LEX:
            # cek negasi dalam 2 kata sebelumnya
            neg = any(kata[j] in NEGASI for j in range(max(0, i-2), i))
            total += -LEX[w] if neg else LEX[w]
    return total

uji = [
    "driver cepat dan ramah",
    "tidak cepat, lama parah",
    "aplikasi lemot dan error terus",
    "bagus banget, telat 2 jam",   # sarkasme -> lexicon gagal!
]
for u in uji:
    s = skor(u)
    print(f"{s:+3d}  {'POS' if s>0 else 'NEG' if s<0 else 'NET'}  {u}")
print("\\nSarkasme menipu lexicon — butuh konteks (ML/LLM).")
"""},
{"heading": "Ekstraksi Keyword (TF) per Aspek",
"intro": "Hitung kata tersering di ulasan negatif — temukan topik tanpa ML.",
"title": "Lab 2 — Keyword Mining",
"hint": "Tambahkan 3 ulasan tentang 'harga'. Lihat topik harga muncul — keyword counting = LDA-nya orang sibuk.",
"code": """from collections import Counter
import re
ulasan_negatif = [
    "driver lama banget nunggu 1 jam",
    "driver telat parah macet katanya",
    "aplikasi error tidak bisa order",
    "driver lama tidak ramah",
    "tunggu lama driver muter muter",
    "aplikasi lemot update kemarin",
]
STOP = {"banget", "tidak", "bisa", "katanya", "kemarin", "dan", "yang"}
kata = []
for u in ulasan_negatif:
    kata += [w for w in re.findall(r"[a-z]+", u.lower()) if w not in STOP and len(w) > 3]

print("Kata tersering di ulasan negatif:")
for w, c in Counter(kata).most_common(8):
    print(f"  {w:<10} {c}x")
print("\\n'driver' + 'lama' + 'tunggu' = topik keterlambatan.")
print("Tanpa ML apa pun, masalah utama sudah terlihat.")
"""},
],
"decisions": [
{"kondisi": "Butuh jawaban hari ini: 'apa yang dikeluhkan?'", "pakai": "Keyword counting + lexicon",
"alasan": "1 hari, transparan, cukup untuk prioritas.",
"contoh": "Kasus AntarCepat."},
{"kondisi": "Korpus besar, kategori belum tahu", "pakai": "LDA topic modeling",
"alasan": "Temukan topik tanpa label; validasi manual.",
"contoh": "Eksplorasi 100rb tiket CS."},
{"kondisi": "Butuh klasifikasi presisi, ada data label", "pakai": "ML klasik (logistic/GBM)",
"alasan": "Konsisten, murah, terukur.",
"contoh": "Routing tiket CS otomatis."},
{"kondisi": "Bahasa kompleks / kategori berubah-ubah, tanpa label", "pakai": "LLM + validasi gold",
"alasan": "Paham konteks; tapi wajib protokol validasi.",
"contoh": "Aspek + sentimen ulasan Bahasa Indonesia."},
],
"rule10": "<ol><li><strong>Aspek dulu</strong>, sentimen global kemudian.</li><li><strong>Mulai sederhana</strong> (keyword/lexicon) sebelum ML/LLM.</li><li><strong>LLM wajib divalidasi</strong> (gold labels).</li></ol>",
"case": {"toc": "Mini-Case: Rating 2,1 AntarCepat",
"title": "Rating 2,1 yang 'Misterius'",
"body": """<p>AntarCepat: rating 4,5 → 2,1 dalam 2 bulan. 3 sprint redesign UI — tidak mempan. Mining 12.000 ulasan: 68% negatif menyebut driver/lama, 12% UI.</p>""",
"q": "(a) Apa kesalahan diagnosis awal? (b) Tiga aksi prioritas dari temuan? (c) Sistem monitoring agar tidak terulang?",
"pembahasan": """<p>(a) <strong>Menebak tanpa data teks.</strong> 'Mungkin UI' = hipotesis tanpa bukti; 12.000 ulasan (bukti tertulis) tidak dibaca. Biaya: 3 sprint sia-sia.</p>
<p>(b) <strong>(1)</strong> Operasional driver: insentif ketepatan + redistribusi zona padat. <strong>(2)</strong> Komunikasi: ETA jujur di aplikasi ('driver 25 menit lagi' &gt; diam). <strong>(3)</strong> Kompensasi proaktif untuk tunggu &gt; 45 menit (voucher otomatis).</p>
<p>(c) <strong>Dashboard mingguan:</strong> % negatif per aspek (alert jika aspek naik 10 poin), topik LDA bulanan, dan 'voice of customer' 1 halaman ke leadership tiap sprint. Teks = sensor termurah perusahaan.</p>"""},
"quiz": [
{"q": "68% ulasan negatif tentang driver, 12% tentang UI. Prioritas fix?",
"options": ["Redesign UI", "Operasional driver (ketepatan, distribusi)", "Turunkan harga", "Ganti nama aplikasi"], "correct": 1,
"why": "Benar: aspect-based menunjuk darahnya. UI 12% = bukan prioritas. Inilah kenapa sentimen global ('negatif 40%') tidak actionable tanpa aspek."},
{"q": "'Tidak cepat, lama parah' dengan lexicon (cepat:+2, lama:−2, parah:−3). Skor?",
"options": ["+2", "−7 (negasi membalik 'cepat')", "0", "+4"], "correct": 1,
"why": "Benar: 'tidak' menegasikan 'cepat' (+2→−2), plus lama (−2) + parah (−3) = −7. Tanpa penanganan negasi, skornya +2−2−3 = −3 (masih negatif tapi salah magnitude)."},
{"q": "Kalimat sarkas 'bagus banget, telat 2 jam'. Kelemahan lexicon?",
"options": ["Tidak ada", "Lexicon menghitung 'bagus' positif — butuh konteks (ML/LLM)", "Kata terlalu sedikit", "Harus pakai Inggris"], "correct": 1,
"why": "Benar: lexicon buta konteks & sarkasme. 'Bagus' +2 mengalahkan sinyal. ML/LLM dengan konteks menang di sini — dengan harga kompleksitas."},
{"q": "Memakai LLM untuk klasifikasi 50rb ulasan. Langkah WAJIB pertama?",
"options": ["Langsung jalankan semua", "Label manual 200–500 sampel sebagai gold + ukur agreement", "Pilih model termahal", "Percaya saja"], "correct": 1,
"why": "Benar: tanpa gold, kamu tidak tahu akurasinya (bisa 55%). Agreement vs plafon manusia menentukan 'lolos/tidak'. Validasi = harga wajib."},
{"q": "Kapan LDA lebih tepat dari klasifikasi supervised?",
"options": ["Selalu", "Eksplorasi: kategori belum diketahui, tanpa label", "Butuh presisi tinggi", "Data kecil"], "correct": 1,
"why": "Benar: LDA menemukan topik tanpa label — untuk 'ada apa saja di sini?'. Klasifikasi supervised untuk 'masukkan ke kategori yang sudah ada' dengan presisi."},
],
"rangkum": [
"<strong>Sentiment</strong>: lexicon (cepat, transparan) vs ML (akurat, butuh label); tangani negasi & slang Indonesia.",
"<strong>Aspect-based</strong>: sentimen per aspek = yang actionable; sentimen global hanya tren.",
"<strong>LDA</strong>: temukan topik tanpa label dari kemunculan bersama; validasi manual + coherence.",
"<strong>LLM</strong>: magang pintar tapi ceroboh — prompt + gold labels (200–500) + audit berkala.",
"<strong>Mulai sederhana</strong>: keyword counting sering cukup untuk 'apa masalahnya?'.",
"<strong>Kapan TIDAK text mining</strong>: volume kecil (&lt; 200 teks) — baca manual saja, lebih akurat.",
],
"prev": ["mk16-digital-ads", "MK16"],
"next": ["mk18-etika", "MK18"],
},
{
"slug": "mk18-etika", "id": "MK18", "track": "Marketing Data Analytics",
"title_html": "Etika & Storytelling:<br/>Dipercaya dan Didengar",
"title_plain": "Etika: Consent, UU PDP, Fairness, Storytelling",
"chapter_summary": "Sisi manusiawi marketing analytics: consent & UU PDP (hak subjek, minimisasi), fairness dalam targeting (proxy discrimination, disparate impact), dan storytelling 'what–so what–now what' agar analis didengar — bukan cuma benar.",
"tujuan": [
"Menjelaskan prinsip consent, purpose limitation, dan minimisasi di UU PDP.",
"Menghitung disparate impact ratio dan mengidentifikasi proxy discrimination.",
"Menjelaskan kenapa 'data anonim' belum tentu aman (re-identifikasi).",
"Menyusun narasi 'what–so what–now what' dari temuan analisis.",
],
"story_title": "Cerita: Targeting 'Cerdas' yang Diskriminatif",
"story": """<p>Fintech <em>&ldquo;PinjamBaik&rdquo;</em> memakai model &ldquo;cerdas&rdquo; untuk targeting iklan pinjaman: hindari 'kode pos berisiko'. Hasilnya efisien — CPA turun 30%. Lalu audit menemukan: <strong>kode pos = proxy ras/etnis</strong> — iklan pinjaman berbunga tinggi hanya tampil di wilayah minoritas. Viral. Denda regulator. Boikot.</p>
<p>Twist-nya: <strong>tidak ada yang berniat diskriminatif</strong> — model hanya mengoptimasi CPA. Tapi 'tidak berniat' bukan pembelaan: <strong>dampaknya diskriminatif</strong>, dan di banyak yurisdiksi itu cukup untuk melanggar hukum. Lesson ini: dua sisi yang membuat analis <em>bertahan lama</em> — <strong>etika</strong> (agar tidak menghancurkan perusahaan) dan <strong>storytelling</strong> (agar yang benar didengar).</p>""",
"concepts": [
{
"id": "pdp", "toc": "Consent & UU PDP",
"title": "UU PDP — Aturan Main Data Pribadi",
"body": """<p><strong>Definisi.</strong> <strong>UU PDP Indonesia (UU No. 27/2022)</strong>: data pribadi = info tentang individu teridentifikasi/teridentifikasi-kan. Prinsip kunci: <strong>consent</strong> (persetujuan yang sah untuk tujuan spesifik), <strong>purpose limitation</strong> (pakai hanya untuk tujuan yang disetujui), <strong>minimisasi</strong> (kumpulkan seperlunya), <strong>hak subjek</strong> (akses, koreksi, hapus, tarik consent, portabilitas).</p>
<p>Implikasi marketing: <strong>tidak boleh</strong> memakai data newsletter untuk targeting iklan tanpa consent baru; <strong>wajib</strong> sediakan opt-out yang mudah; <strong>retensi</strong> terbatas (hapus/anonymize setelah tujuan tercapai). Denda & pidana = nyata.</p>""",
"formulas": [],
"intuisi": "UU PDP seperti <strong>aturan bertamu</strong>: izin masuk untuk 'minum teh' (consent spesifik) ≠ izin menggeledah lemari (purpose limitation); jangan bawa koper besar untuk bertamu 10 menit (minimisasi); tuan rumah boleh memintamu pulang kapan saja (tarik consent).",
"kapan": "Setiap pengumpulan & pemakaian data pribadi. Libatkan legal/DPO sejak desain (privacy by design), bukan setelah viral.",
"worked": {"title": "📐 Contoh: Audit consent newsletter (klik untuk buka)",
"body": """<p>Database 500.000 email dari 'newsletter'. Tim ads ingin pakai untuk custom audience.</p>
<p><strong>Cek:</strong> (1) Apakah form newsletter menyebut 'iklan tertarget'? Tidak → <strong>tidak boleh</strong> (purpose limitation). (2) Opt-out tersedia? Ya, tapi tersembunyi → perbaiki. (3) Retensi: email 5 tahun tidak aktif → hapus/anonymize.</p>
<p><strong>Solusi:</strong> kampanye re-consent ('mau dapat promo personal? klik di sini') — dapat 120.000 consent baru yang <em>sah</em>. Lebih sedikit tapi legal & engaged (malah convert lebih baik).</p>"""},
"charts": [],
},
{
"id": "fairness", "toc": "Fairness dalam Targeting",
"title": "Fairness — Diskriminasi Tanpa Niat",
"body": """<p><strong>Definisi.</strong> <strong>Proxy discrimination</strong>: fitur 'netral' (kode pos, nama, device) berkorelasi dengan atribut dilindungi (ras, agama, gender) → model diskriminatif tanpa pernah 'melihat' atributnya. <strong>Disparate impact</strong>: kebijakan netral tapi dampaknya timpang antar-grup. Ukur dengan <strong>disparate impact ratio</strong> = rate grup minoritas / rate grup mayoritas (&lt; 0,8 = red flag, aturan 4/5).</p>
<p>Mitigasi: audit fitur (korelasi dengan proxy), uji per grup, <em>fairness through awareness</em> (ukur, jangan buta), dan batasi atribut sensitif + proxy-nya.</p>""",
"formulas": [
{"math": r"\text{DI Ratio} = \frac{\text{rate}_{\text{minoritas}}}{\text{rate}_{\text{mayoritas}}} \quad (\text{red flag jika } < 0{,}8)",
"symbols": [
"<Tex math={String.raw`\\text{rate}`} />: mis. % yang dapat penawaran baik / % di-target",
"0,8 = aturan 4/5 (EEOC): di bawah ini = bukti awal disparate impact",
"Bukan satu-satunya metrik (ada equalized odds, dll.) — tapi yang paling mudah dijelaskan",
]},
],
"intuisi": "Proxy discrimination seperti <strong>rekrutmen 'buta nama' tapi filter kode pos</strong> — kode pos 'netral', tapi peta tidak berbohong. Model tidak rasis; <strong>datanya</strong> yang membawa sejarah. Tugas analis: menjadi 'auditor peta'.",
"kapan": "Setiap model targeting/skoring yang berdampak ke akses (kredit, pekerjaan, harga, layanan). Audit sebelum deploy, monitor berkala.",
"worked": {"title": "📐 Contoh: Audit PinjamBaik (klik untuk buka)",
"body": """<p>Penawaran bunga rendah: wilayah A (mayoritas) 40% dapat, wilayah B (minoritas) 18% dapat. DI ratio = 18/40 = <strong>0,45 &lt; 0,8</strong> → red flag.</p>
<p><strong>Investigasi:</strong> fitur 'kode pos' + 'riwayat device' = proxy kuat. <strong>Mitigasi:</strong> hapus kode pos granular (pakai kota saja), tambah fairness constraint, atau — paling bersih — <strong>samakan penawaran</strong> (bunga by risiko kredit individual yang sah, bukan wilayah).</p>
<p>Hasil: CPA naik 8% (lebih mahal), tapi lolos audit & tidak viral. <strong>Etika = asuransi termurah.</strong></p>"""},
"charts": [
{"data": """[{x: ["Wilayah A (mayoritas)", "Wilayah B (minoritas)"], y: [40, 18], type: "bar", marker: {color: ["#2a7de1","#ef4444"]}, text: ["40%","18%"], textposition: "outside"}]""",
"title": "Penawaran bunga rendah per wilayah",
"layout": """{yaxis: {title: "% dapat penawaran"}, showlegend: false}""",
"cara": "Tinggi batang = % yang dapat penawaran baik per wilayah.",
"interpretasi": "DI ratio = 18/40 = 0,45 — jauh di bawah 0,8. Visual ini = bukti satu slide untuk direksi: 'model kita diskriminatif'. Tanpa audit, angka ini tersembunyi di balik 'CPA turun 30%' yang dirayakan."},
],
},
{
"id": "story", "toc": "Storytelling Analis",
"title": "Storytelling — Benar Saja Tidak Cukup",
"body": """<p><strong>Definisi.</strong> <strong>Storytelling analis</strong> = menyampaikan temuan agar <em>diingat & dieksekusi</em>. Struktur <strong>'what – so what – now what'</strong>: WHAT (temuan: 'retention cohort baru 18%'), SO WHAT (implikasi: 'kualitas akuisisi memburuk; scale = bakar uang'), NOW WHAT (aksi: 'perbaiki onboarding 7 hari; tahan budget sampai 30%'). <strong>Pyramid principle</strong>: kesimpulan dulu, baru pendukung — bukan sebaliknya.</p>
<p><strong>Experiment readout culture</strong> (dari riset lowongan): tiap eksperimen punya <strong>katalog</strong> — hipotesis, desain, hasil, keputusan (scale/iterate/stop) — yang bisa dibaca siapa pun. Organisasi yang tidak mencatat = mengulang kesalahan yang sama tiap kuartal.</p>""",
"formulas": [],
"intuisi": "Analisis tanpa storytelling seperti <strong>obat yang tidak diminum</strong>: mujarab tapi tidak bekerja. 'What–so what–now what' = sendoknya: what (ini obatnya), so what (tanpa ini kamu sakit), now what (minum 2x sehari). Analis hebat = apoteker yang pasiennya mau minum obat.",
"kapan": "Setiap presentasi, dashboard, dan laporan. Satu slide = satu pesan (ingat A1.8!).",
"worked": {"title": "📐 Contoh: Slide yang didengar (klik untuk buka)",
"body": """<p><strong>Judul slide (kesimpulan dulu):</strong> 'Hentikan scale — perbaiki onboarding dulu'</p>
<p><strong>WHAT:</strong> Cohort Jun M3 = 18% vs Jan 45% (chart cohort table).</p>
<p><strong>SO WHAT:</strong> Tiap 1.000 user baru 'bernilai' setengah dari tahun lalu; LTV:CAC turun ke 1,8.</p>
<p><strong>NOW WHAT:</strong> (1) Tahan budget akuisisi 1 bulan; (2) sprint onboarding 7-hari; (3) target: M3 cohort ≥ 30% sebelum scale.</p>
<p>Bandingkan dengan slide 'Analisis Retention Q2' berisi 12 chart tanpa kesimpulan — yang mana dieksekusi direksi?</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Data sudah dianonimkan (nama dihapus) = aman & bebas aturan.",
"benar": "<strong>Re-identifikasi</strong> itu mudah: kode pos + tanggal lahir + gender = unik untuk 87% populasi AS (penelitian Latanya). 'Anonim' tanpa teknik (k-anonymity, agregasi, noise) = nama yang disamarkan, bukan hilang. UU PDP tetap berlaku untuk data yang <em>dapat</em> diidentifikasi kembali."},
{"t": "Etika & compliance menghambat bisnis — makin patuh makin lambat.",
"benar": "Kasus PinjamBaik: 'efisiensi' 30% → denda + boikot + biaya krisis 100x lipat. <strong>Etika = asuransi termurah.</strong> Dan consent yang benar justru memberi data <em>lebih berkualitas</em> (120rb consent aktif &gt; 500rb email mati). Kepatuhan yang didesain baik = keunggulan kompetitif (kepercayaan)."},
],
"tips": [
"<strong>Privacy by design, bukan by panic.</strong> Libatkan legal/DPO saat merancang tracking (MK2), bukan setelah dashboard jadi. Pertanyaan desain: 'data apa yang TIDAK perlu kita kumpulkan?' — jawaban yang bagus menghemat storage, risiko, dan denda.",
"<strong>Tulis readout 1 halaman untuk tiap eksperimen.</strong> Hipotesis → desain → hasil → keputusan (scale/iterate/stop). Katalog ini = memori organisasi. Tanpa itu, tim mengulang test yang sama 2 tahun kemudian — dan 'belajar' hal yang sama dua kali.",
],
"labs": [
{"heading": "Audit Fairness: Disparate Impact",
"intro": "Hitung DI ratio dari data penawaran per grup. Ubah angka — lihat kapan red flag menyala.",
"title": "Lab 1 — Kalkulator Disparate Impact",
"hint": "Ubah rate minoritas 18 → 35. DI ratio naik ke 0,875 — lolos 0,8. Berapa 'harga' fairness dalam CPA?",
"code": """# Kalkulator disparate impact ratio
# % mendapat penawaran baik per grup
grup = {
    "Wilayah A (mayoritas)": 40,
    "Wilayah B (minoritas)": 18,   # ubah sesukamu
    "Wilayah C": 35,
}
mayor = max(grup.values())
print(f"{'grup':<24}{'rate':>6}  DI ratio")
for g, r in grup.items():
    di = r / mayor
    flag = "RED FLAG" if di < 0.8 else "ok"
    print(f"{g:<24}{r:>5}%  {di:.2f}  {flag}")
print("\\nAturan 4/5: DI < 0.8 = bukti awal disparate impact.")
"""},
{"heading": "Cek K-Anonymity",
"intro": "Uji apakah dataset 'anonim'-mu benar-benar anonim: hitung ukuran tiap kelompok quasi-identifier.",
"title": "Lab 2 — Cek K-Anonymity",
"hint": "Tambahkan baris dengan kombinasi unik (mis. kode pos langka + umur aneh). Lihat k=1 — ia teridentifikasi!",
"code": """from collections import Counter
# data 'anonim' (nama dihapus): (kodepos, umur, gender)
data = [
    ("10110", 34, "P"), ("10110", 34, "P"), ("10110", 35, "P"),
    ("10110", 34, "L"), ("20212", 41, "L"), ("20212", 41, "L"),
    ("99999", 87, "P"),  # kombinasi langka!
]
c = Counter(data)
k = min(c.values())
print(f"k-anonymity = {k}  (syarat umum: k >= 5)")
print("\\nKelompok terkecil:")
for combo, n in c.most_common()[::-1][:3]:
    print(f"  {combo}: {n} orang" + ("  <- TERIDENTIFIKASI!" if n == 1 else ""))
print("\\nHapus nama TIDAK cukup. Butuh generalisasi/supresi.")
"""},
],
"decisions": [
{"kondisi": "Mau pakai data untuk tujuan baru", "pakai": "Cek consent & purpose limitation dulu",
"alasan": "Hukum + kepercayaan. Re-consent lebih murah dari denda.",
"contoh": "Newsletter → custom audience: re-consent."},
{"kondisi": "Model berdampak ke akses/harga/layanan", "pakai": "Audit fairness (DI ratio + proxy check)",
"alasan": "Diskriminasi tanpa niat tetap diskriminasi.",
"contoh": "Targeting kredit, hiring, pricing."},
{"kondisi": "Rilis data 'anonim' ke pihak ketiga", "pakai": "K-anonymity ≥ 5 + agregasi",
"alasan": "Nama dihapus ≠ anonim (re-identifikasi mudah).",
"contoh": "Data riset, dashboard publik."},
{"kondisi": "Presentasi ke direksi", "pakai": "What–so what–now what + 1 pesan/slide",
"alasan": "Benar tapi tidak didengar = tidak bekerja.",
"contoh": "Slide 'Hentikan scale' di atas."},
],
"rule10": "<ol><li><strong>Consent spesifik</strong> — bukan 'sekali untuk semua'.</li><li><strong>Audit fairness</strong> sebelum deploy model berdampak.</li><li><strong>'Anonim' harus dibuktikan</strong> (k-anonymity).</li><li><strong>Ceritakan</strong>: what → so what → now what.</li></ol>",
"case": {"toc": "Mini-Case: Kode Pos PinjamBaik",
"title": "Kode Pos yang 'Netral'",
"body": """<p>PinjamBaik: targeting by kode pos → CPA turun 30%. Audit: DI ratio 0,45 (bunga rendah: A 40%, B 18%). Kode pos = proxy. Viral, denda, boikot.</p>""",
"q": "(a) Kenapa 'tidak berniat' bukan pembelaan? (b) Tiga mitigasi konkret? (c) Bagaimana storytelling yang benar ke direksi SEBELUM viral?",
"pembahasan": """<p>(a) <strong>Disparate impact</strong> menilai <em>dampak</em>, bukan niat. Di banyak yurisdiksi, dampak timpang = pelanggaran terlepas niat. 'Model hanya optimasi CPA' = pengakuan, bukan pembelaan.</p>
<p>(b) <strong>(1)</strong> Hapus kode pos granular (kota saja) + uji proxy tiap fitur. <strong>(2)</strong> Fairness constraint/gate di pipeline (DI ≥ 0,8 sebelum deploy). <strong>(3)</strong> Samakan penawaran berbasis risiko individual yang sah — bukan wilayah.</p>
<p>(c) <strong>Slide 1 halaman SEBELUM deploy:</strong> WHAT: 'model efisien tapi DI 0,45'. SO WHAT: 'risiko viral + denda &gt; hemat CPA 30%'. NOW WHAT: 'tunda deploy 2 minggu untuk mitigasi'. Analis yang bersuara <em>sebelum</em> = pahlawan; yang diam = ikut tenggelam.</p>"""},
"quiz": [
{"q": "Penawaran baik: mayoritas 40%, minoritas 18%. DI ratio dan artinya?",
"options": ["0,45 — red flag (&lt; 0,8)", "2,2 — aman", "0,8 — pas", "Tidak bisa dihitung"], "correct": 0,
"why": "Benar: 18/40 = 0,45 &lt; 0,8 → bukti awal disparate impact. 'Tidak berniat' bukan pembelaan — yang dinilai dampak."},
{"q": "Dataset 'anonim' (nama dihapus) punya 1 orang dengan (kodepos, umur, gender) unik. Status?",
"options": ["Aman — tanpa nama", "Teridentifikasi (k=1) — butuh generalisasi/supresi", "Cukup hapus kodepos", "Tidak masalah"], "correct": 1,
"why": "Benar: k=1 = unik = teridentifikasi. Penelitian: 3 quasi-identifier cukup untuk 87% populasi. 'Anonim' harus dibuktikan (k≥5), bukan diasumsikan."},
{"q": "Tim ingin pakai data newsletter untuk custom audience iklan. Syarat?",
"options": ["Langsung pakai — kan data sendiri", "Cek consent: jika tak mencakup iklan tertarget → re-consent", "Cukup opt-out", "Tidak ada syarat"], "correct": 1,
"why": "Benar: purpose limitation — consent newsletter ≠ consent iklan. Re-consent memberi 120rb yang sah & engaged (malah convert lebih baik)."},
{"q": "Struktur presentasi analis yang dieksekusi?",
"options": ["Metodologi dulu, 20 chart", "Kesimpulan dulu (pyramid) + what–so what–now what", "Data mentah saja", "Tanpa rekomendasi"], "correct": 1,
"why": "Benar: direksi memutuskan dari kesimpulan, bukan metodologi. 'Hentikan scale — perbaiki onboarding dulu' + 3 aksi &gt; 12 chart tanpa pesan."},
{"q": "Fitur 'kode pos' berkorelasi kuat dengan etnis. Tindakan?",
"options": ["Tetap pakai — kan netral", "Audit: uji proxy, hapus/batasi, atau samakan perlakuan", "Sembunyikan dari laporan", "Tambah bobotnya"], "correct": 1,
"why": "Benar: proxy discrimination = diskriminasi via perantara. 'Netral' di nama ≠ netral di dampak. Ukur, mitigasi, dokumentasikan."},
],
"rangkum": [
"<strong>UU PDP</strong>: consent spesifik, purpose limitation, minimisasi, hak subjek (akses/koreksi/hapus/tarik).",
"<strong>Proxy discrimination</strong>: fitur 'netral' bisa jadi perantara atribut dilindungi — audit DI ratio (red flag &lt; 0,8).",
"<strong>'Anonim' harus dibuktikan</strong>: k-anonymity ≥ 5; re-identifikasi mudah dengan 3 quasi-identifier.",
"<strong>Etika = asuransi termurah</strong>: biaya kepatuhan &lt; biaya viral + denda.",
"<strong>Storytelling</strong>: what → so what → now what; pyramid principle; 1 slide 1 pesan.",
"<strong>Readout culture</strong>: katalog eksperimen (hipotesis/desain/hasil/keputusan) = memori organisasi.",
],
"prev": ["mk17-text-analytics", "MK17"],
"next": ["mk19-capstone", "MK19"],
},
{
"slug": "mk19-capstone", "id": "MK19", "track": "Marketing Data Analytics",
"title_html": "Capstone:<br/>Paket Churn + CLV + Uplift + Alokasi Budget",
"title_plain": "Capstone: Proyek Marketing Analytics End-to-End",
"chapter_summary": "Mini-project penutup Track 6: dari data transaksi sintetis → RFM & churn → CLV per segmen → targeting uplift → alokasi budget. Empat fase, dua lab pipeline, dan template laporan 1 halaman untuk direksi.",
"tujuan": [
"Menggabungkan RFM, churn, CLV, uplift, dan alokasi budget dalam satu alur kerja.",
"Menghitung batas CAC per segmen dari CLV dan menerjemahkannya jadi keputusan budget.",
"Merancang targeting kampanye retensi berbasis uplift (bukan sekadar risiko).",
"Menyusun laporan 1 halaman 'what–so what–now what' untuk direksi.",
],
"story_title": "Cerita: Hari Pertama sebagai Marketing Analyst",
"story": """<p>Hari pertama kerja sebagai marketing analyst di <em>&ldquo;MajuMart&rdquo;</em>, atasanmu memberi satu file: <strong>transaksi 2 tahun, 50.000 pelanggan</strong>. Lalu satu kalimat: <em>&ldquo;Minggu depan presentasi ke direksi: pelanggan kita siapa, siapa yang pergi, berapa nilainya, dan ke mana budget Rp2 miliar.&rdquo;</em></p>
<p>Kamu tersenyum. <strong>MK1–MK18 adalah senjatamu.</strong> Funnel untuk diagnosis (MK1), cohort untuk tren (MK3), RFM untuk segmentasi (MK3–MK4), CLV untuk nilai (MK5), churn untuk risiko (MK6), uplift untuk targeting (MK11), MMM/atribusi untuk alokasi (MK12–MK13), dan storytelling agar didengar (MK18). Capstone ini = <strong>gladi bersih</strong> hari pertamamu — dengan data sintetis yang perilakunya mirip asli.</p>""",
"concepts": [
{
"id": "fase1", "toc": "Fase 1–2: Diagnosis & Nilai",
"title": "Fase 1–2: Diagnosis (RFM/Churn) & Nilai (CLV)",
"body": """<p><strong>Definisi.</strong> <strong>Fase 1 — Diagnosis:</strong> bangun funnel &amp; cohort (MK1/MK3): di mana bocor? tren membaik/memburuk? Lalu RFM (MK3) + skor churn sederhana (MK6): siapa berisiko? <strong>Fase 2 — Nilai:</strong> CLV per segmen (MK5): berapa nilai masa depan tiap kelompok? Output fase 2 = <strong>batas CAC per segmen</strong> (CLV/3).</p>
<p>Deliverable fase 1–2: tabel 1 halaman — segmen, ukuran, churn, CLV, batas CAC. Ini fondasi semua keputusan berikutnya.</p>""",
"formulas": [
{"math": r"\text{Batas CAC}_{segmen} = \frac{\text{CLV}_{segmen}}{3}",
"symbols": [
"Aturan LTV:CAC ≥ 3 (MK1) diterapkan <em>per segmen</em> — bukan rata-rata",
"Segmen dengan CLV Rp900rb → batas CAC Rp300rb; channel yang CAC-nya Rp500rb untuk segmen ini = potong",
]},
],
"intuisi": "Fase 1–2 seperti <strong>medical check-up</strong>: diagnosis (apa penyakitnya? siapa kritis?) lalu prognosis (berapa 'nilai hidup' tiap pasien → berapa worth diobati?). Dokter yang langsung operasi tanpa check-up = malpraktik; analis yang langsung alokasi budget tanpa diagnosis = sama.",
"kapan": "Awal setiap proyek/kwartal. Jangan lompat ke targeting sebelum tahu nilai.",
"worked": {"title": "📐 Contoh: Tabel fase 1–2 MajuMart (klik untuk buka)",
"body": """<p><strong>Champions</strong> (8%, churn 5%, CLV Rp6jt) → batas CAC Rp2jt. <strong>Loyal</strong> (20%, churn 12%, CLV Rp2,5jt) → Rp833rb. <strong>At Risk</strong> (15%, churn 45%, CLV Rp1,2jt) → Rp400rb. <strong>Hibernating</strong> (25%, churn 80%, CLV Rp300rb) → Rp100rb. <strong>Lost</strong> (32%, CLV ~0) → Rp0 (jangan akuisisi ulang!).</p>
<p><strong>Keputusan langsung:</strong> channel dengan CAC Rp600rb hanya boleh untuk Champions &amp; Loyal. Untuk At Risk, CAC Rp600rb &gt; batas Rp400rb → cari channel lebih murah atau terima.</p>"""},
"charts": [
{"data": """[{x: ["Champions", "Loyal", "At Risk", "Hibernating", "Lost"], y: [6.0, 2.5, 1.2, 0.3, 0.05], type: "bar", marker: {color: ["#16a34a","#2a7de1","#e8a838","#e8a838","#94a3b8"]}, text: ["Rp6jt","Rp2,5jt","Rp1,2jt","Rp300rb","Rp50rb"], textposition: "outside"}]""",
"title": "CLV per segmen MajuMart",
"layout": """{yaxis: {title: "CLV (Rp jt)"}, showlegend: false}""",
"cara": "Tinggi batang = CLV tiap segmen. Garis imajiner 'batas CAC' = sepertiganya.",
"interpretasi": "Champions 20x lipat Hibernating. Satu strategi untuk semua = membuang uang di Lost & kekurangan investasi di Champions. <strong>Segmentasi bukan teori — ia mesin alokasi.</strong>"},
],
},
{
"id": "fase3", "toc": "Fase 3: Targeting Uplift",
"title": "Fase 3: Targeting — Dari 'Berisiko' ke 'Persuadable'",
"body": """<p><strong>Definisi.</strong> <strong>Fase 3:</strong> untuk segmen At Risk, jangan target semua — bangun <strong>uplift</strong> (MK11) dari data pilot: siapa persuadable? Kebijakan: target jika uplift × CLV − biaya &gt; 0; <em>jangan ganggu</em> sleeping dogs. Pilih <strong>next-best-action</strong> per sub-segmen (MK7): voucher vs telepon vs diam.</p>
<p>Deliverable: daftar target + aksi + expected net value. Inilah bedanya kampanye 'Rp500jt gagal' (MK6) vs 'Rp150jt sukses' (MK11).</p>""",
"formulas": [],
"intuisi": "Fase 3 seperti <strong>triase UGD</strong>: bukan 'siapa paling parah' (risiko), tapi 'siapa yang <em>tertolong</em> dengan sumber daya terbatas' (uplift) — dan 'siapa yang jangan disentuh' (sleeping dogs). Dokter UGD yang mengobati by 'parah' tanpa triase = kekacauan.",
"kapan": "Setiap kampanye retensi/upsell berbiaya. Syarat: data pilot eksperimen (atau mulai dengan heuristik + pilot kecil).",
"worked": {"title": "📐 Contoh: Kebijakan MajuMart (klik untuk buka)",
"body": """<p>At Risk 7.500 orang. Pilot 1.000: uplift voucher = +8% (persuadables ~40%), telepon = +12% tapi biaya 10x.</p>
<p><strong>Kebijakan:</strong> persuadables + CLV tinggi → telepon (net +Rp180rb/orang); persuadables + CLV sedang → voucher (net +Rp90rb); sisanya → diam.</p>
<p><strong>Hasil proyeksi:</strong> biaya Rp85jt, selamat ~450, net <strong>+Rp390jt</strong>. Vs 'blast ke semua At Risk': biaya Rp375jt, net +Rp120jt (plus membangunkan sleeping dogs).</p>"""},
"charts": [],
},
{
"id": "fase4", "toc": "Fase 4: Alokasi Budget",
"title": "Fase 4: Alokasi — Rp2 Miliar Dibagi dengan Matematika",
"body": """<p><strong>Definisi.</strong> <strong>Fase 4:</strong> alokasikan budget Rp2M antar-channel × segmen dengan dua batas: (1) <strong>batas CAC per segmen</strong> (fase 2) — channel-segmen dengan CAC di atas batas = coret; (2) <strong>marginal ROI</strong> (MK13/MK16) — samakan di semua yang lolos. Sisa: <strong>eksperimen budget</strong> 10% untuk channel baru (bandit mindset, MK9).</p>
<p>Deliverable: matriks alokasi + laporan 1 halaman what–so what–now what (MK18).</p>""",
"formulas": [],
"intuisi": "Fase 4 seperti <strong>menyusun tim sepak bola dengan salary cap</strong>: tiap posisi (segmen) punya budget maksimal (batas CAC); pemain (channel) dipilih yang value-nya terbaik di batas itu; 10% untuk pemain muda potensial (eksperimen). Bukan 'beli bintang termahal untuk semua posisi'.",
"kapan": "Perencanaan budget kuartalan/tahunan. Review bulanan dengan data aktual (marginal bergeser).",
"worked": {"title": "📐 Contoh: Matriks alokasi MajuMart (klik untuk buka)",
"body": """<p><strong>Champions</strong> (batas CAC Rp2jt): search (CAC 800rb, marginal ROAS 4) → Rp600jt; referral (CAC 300rb) → Rp200jt. <strong>Loyal</strong> (batas Rp833rb): sosmed (CAC 500rb, marginal 3,5) → Rp500jt. <strong>At Risk</strong>: retensi (voucher, dari fase 3) → Rp300jt. <strong>Eksperimen</strong> (10%): TikTok Shop → Rp200jt. <strong>Hibernating/Lost:</strong> Rp0.</p>
<p><strong>Total Rp1,8M + Rp200jt eksperimen = Rp2M.</strong> Setiap rupiah punya alasan: batas CAC (mengapa boleh) + marginal ROAS (mengapa sebesar ini).</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Capstone = merangkum semua lesson. Baca ulang saja cukup.",
"benar": "Capstone = <strong>memakai</strong> semua lesson untuk <strong>keputusan</strong>. Bedanya: merangkum ('CLV adalah...') vs memutuskan ('batas CAC Champions Rp2jt, jadi search boleh, agregator tidak'). Nilai analis = keputusan, bukan definisi. Kerjakan lab-nya — jangan cuma baca."},
{"t": "Urutan fase kaku: harus selalu 1→2→3→4.",
"benar": "Urutan = <strong>logika ketergantungan</strong>, bukan birokrasi: batas CAC (fase 2) dibutuhkan alokasi (fase 4); uplift (fase 3) butuh data pilot yang bisa jalan paralel. Di dunia nyata fase tumpang tindih — tapi <strong>jangan alokasi sebelum tahu nilai</strong> (fase 2). Itu satu-satunya aturan keras."},
],
"tips": [
"<strong>Satu halaman mengalahkan 50 slide.</strong> Direksi mengingat tabel segmen + 3 keputusan, bukan metodologi. Lampirkan detail sebagai appendix — presentasikan keputusan. (MK18).",
"<strong>Sisakan 10% untuk eksperimen.</strong> Alokasi 'optimal' hari ini = lokal optimum. Bandit mindset: selalu ada budget untuk menemukan channel berikutnya. Organisasi tanpa budget eksperimen = organisasi yang menua.",
],
"labs": [
{"heading": "Pipeline Mini: RFM → Churn → CLV",
"intro": "Dari data transaksi sintetis: hitung RFM, skor churn heuristik, CLV, dan batas CAC per segmen — fondasi fase 1–2.",
"title": "Lab 1 — Pipeline Capstone (1/2)",
"hint": "Ubah CHURN_RISK untuk segmen At Risk. Lihat batas CAC ikut berubah — diagnosis menggerakkan alokasi.",
"code": """import random, math
from datetime import date, timedelta
random.seed(42)
# Data sintetis: 300 pelanggan, transaksi terakhir `rec` hari lalu
pelanggan = []
hari_ini = date(2026,1,1)
for i in range(300):
    tipe = random.choices(["champion","loyal","risk","hiber"], [0.1,0.3,0.3,0.3])[0]
    n = {"champion": 24, "loyal": 12, "risk": 8, "hiber": 3}[tipe]
    rec_true = {"champion": 5, "loyal": 30, "risk": 120, "hiber": 300}[tipe]
    d = hari_ini - timedelta(days=rec_true + random.randint(0, 15))
    trx = []
    for _ in range(n):
        trx.append((d, random.uniform(200, 2000)))
        d = d - timedelta(days=random.randint(10, 90))
    pelanggan.append((tipe, trx))
MARGIN = 0.4
print(f"{'segmen':<9} {'n':>4} {'churn_h':>8} {'CLV_est':>9}  batas_CAC")
for tipe in ["champion","loyal","risk","hiber"]:
    grup = [p for p in pelanggan if p[0]==tipe]
    rec = max(1, sum((hari_ini - max(t for t,_ in trx)).days for _, trx in grup)/len(grup))
    fre = sum(len(trx) for _, trx in grup)/len(grup)
    mon = sum(v for _, trx in grup for _, v in trx)/sum(len(trx) for _, trx in grup)
    churn_m = 1 - math.exp(-rec/90)  # makin lama tidak belanja -> makin mungkin churn
    clv = mon * MARGIN / max(churn_m, 0.02)
    print(f"{tipe:<9} {len(grup):>4} {churn_m:>7.0%} {clv/1000:>8.1f}rb  {clv/3/1000:.1f}rb")
print("\\nFase 1-2 selesai: tiap segmen punya nilai & batas CAC.")
"""},
{"heading": "Targeting Uplift + Alokasi Budget",
"intro": "Simulasikan uplift per segmen, pilih target (net value &gt; 0), alokasikan Rp2M.",
"title": "Lab 2 — Targeting & Alokasi (2/2)",
"hint": "Ubah BIAYA_VOUCHER. Target menyusut saat biaya naik — kebijakan targeting = makhluk hidup.",
"code": """# Fase 3-4: targeting uplift + alokasi budget
import random
random.seed(7)
BUDGET = 2_000_000_000
BIAYA_VOUCHER, BIAYA_TELP = 50_000, 300_000

segmen = {  # (ukuran, uplift_voucher, uplift_telp, CLV)
    "champions": (4000, 0.01, 0.02, 6_000_000),
    "loyal":     (10000, 0.04, 0.06, 2_500_000),
    "risk":      (7500, 0.08, 0.12, 1_200_000),
    "hiber":     (12500, 0.02, 0.03, 300_000),
}
sisa = BUDGET
print(f"{'segmen':<10}{'aksi':<9}{'target':>8}  biaya(Rp jt)  net(Rp jt)")
total_net = 0
for s, (n, uv, ut, clv) in segmen.items():
    net_v = uv*clv - BIAYA_VOUCHER
    net_t = ut*clv - BIAYA_TELP
    aksi, net = ("voucher", net_v) if net_v >= net_t else ("telepon", net_t)
    if net <= 0:
        print(f"{s:<10}{'diam':<9}{0:>8}  {'0':>11}  {'0':>9}")
        continue
    target = min(n, int(sisa / (BIAYA_VOUCHER if aksi=="voucher" else BIAYA_TELP)))
    biaya = target * (BIAYA_VOUCHER if aksi=="voucher" else BIAYA_TELP)
    net_tot = target * net
    sisa -= biaya; total_net += net_tot
    print(f"{s:<10}{aksi:<9}{target:>8}  {biaya/1e6:>11.0f}  {net_tot/1e6:>9.0f}")
print(f"\\nTotal net value: Rp{total_net/1e6:,.0f} jt | Sisa budget: Rp{sisa/1e6:,.0f} jt")
print("Sisa -> eksperimen channel baru (10% mindset, MK9).")
"""},
],
"decisions": [
{"kondisi": "Mulai proyek analytics baru", "pakai": "Urutan fase 1→2→3→4",
"alasan": "Diagnosis → nilai → targeting → alokasi. Jangan alokasi sebelum tahu nilai.",
"contoh": "Template proyek MajuMart ini."},
{"kondisi": "Waktu 1 hari saja", "pakai": "Fase 1–2 heuristik (RFM + CLV sederhana)",
"alasan": "80% keputusan dari diagnosis + nilai; uplift/MMM butuh waktu.",
"contoh": "Batas CAC per segmen untuk rapat besok."},
{"kondisi": "Kampanye berbiaya besar", "pakai": "Tambah fase 3 (uplift) penuh",
"alasan": "Biaya salah target mahal; sleeping dogs nyata.",
"contoh": "Retensi Rp500jt+."},
{"kondisi": "Presentasi direksi", "pakai": "1 halaman what–so what–now what",
"alasan": "Keputusan, bukan metodologi.",
"contoh": "Slide: 3 keputusan + tabel segmen."},
],
"rule10": "<ol><li><strong>Diagnosis → nilai → targeting → alokasi.</strong></li><li><strong>Batas CAC per segmen</strong> = CLV/3.</li><li><strong>Target = persuadable</strong>, bukan berisiko.</li><li><strong>10% untuk eksperimen.</strong> Selalu.</li></ol>",
"case": {"toc": "Mini-Case: Minggu Depan Presentasi",
"title": "Minggu Depan Presentasi ke Direksi",
"body": """<p>Kamu analis baru MajuMart. Data: 50.000 pelanggan, 2 tahun transaksi. Budget Rp2M. Direksi minta: siapa pelanggan kita, siapa pergi, berapa nilainya, ke mana budget.</p>""",
"q": "(a) Susun rencana 5 hari (fase per hari). (b) Tiga angka yang wajib ada di slide 1? (c) Satu risiko terbesar rencanamu?",
"pembahasan": """<p>(a) <strong>H1:</strong> diagnosis — funnel, cohort, RFM. <strong>H2:</strong> nilai — CLV + batas CAC per segmen. <strong>H3:</strong> targeting — uplift heuristik/pilot untuk At Risk. <strong>H4:</strong> alokasi — matriks channel×segmen + 10% eksperimen. <strong>H5:</strong> storytelling — 1 halaman what–so what–now what + appendix.</p>
<p>(b) <strong>(1)</strong> Batas CAC per segmen (aturan main). <strong>(2)</strong> Tiga keputusan alokasi terbesar (ke mana Rp2M). <strong>(3)</strong> Expected net value kampanye retensi (bukti targeting bekerja).</p>
<p>(c) <strong>Data quality</strong> (MK2!) — definisi 'aktif', 'churn', deduplikasi. Satu definisi salah = semua fase salah. Hari 0 (sebelum H1): audit definisi + tracking.</p>"""},
"quiz": [
{"q": "Urutan fase capstone yang benar dan kenapa?",
"options": ["4→3→2→1", "1 diagnosis → 2 nilai → 3 targeting → 4 alokasi (ketergantungan logis)", "Acak", "Hanya fase 4"], "correct": 1,
"why": "Benar: alokasi butuh batas CAC (fase 2); targeting butuh diagnosis (fase 1). Satu-satunya aturan keras: jangan alokasi sebelum tahu nilai."},
{"q": "Segmen CLV Rp1,2jt. Channel A CAC Rp500rb, channel B CAC Rp300rb. Keputusan?",
"options": ["Pakai A — jangkauan luas", "Batas CAC = Rp400rb → hanya B yang lolos", "Pakai keduanya", "Tolak keduanya"], "correct": 1,
"why": "Benar: CLV/3 = Rp400rb. A (Rp500rb) di atas batas = rugi. Batas per segmen &gt; rata-rata."},
{"q": "Kampanye retensi: target 'berisiko' vs 'persuadable'. Pilih?",
"options": ["Berisiko — paling butuh", "Persuadable (uplift) — yang berubah karena aksi", "Semua", "Acak"], "correct": 1,
"why": "Benar: 'berisiko' mencakup lost causes & sleeping dogs. Persuadable = ROI; kasus TelkoNusa membuktikan bedanya (net +Rp450jt vs ~0)."},
{"q": "Sisa budget Rp200jt dari Rp2M. Alokasi terbaik?",
"options": ["Habiskan ke channel terbaik", "Eksperimen channel baru (bandit mindset 10%)", "Simpan", "Bagi rata"], "correct": 1,
"why": "Benar: alokasi 'optimal' hari ini = lokal optimum. 10% eksperimen = premi asuransi menemukan channel berikutnya."},
{"q": "Slide 1 presentasi direksi berisi?",
"options": ["Metodologi lengkap", "3 keputusan + tabel segmen (what–so what–now what)", "50 chart", "Data mentah"], "correct": 1,
"why": "Benar: direksi mengeksekusi keputusan, bukan metodologi. Detail di appendix. (MK18)."},
],
"rangkum": [
"<strong>Fase 1 (Diagnosis)</strong>: funnel, cohort, RFM, churn — di mana bocor, siapa berisiko.",
"<strong>Fase 2 (Nilai)</strong>: CLV per segmen → batas CAC = CLV/3 — aturan main alokasi.",
"<strong>Fase 3 (Targeting)</strong>: uplift → persuadable; net value = uplift×CLV − biaya; jangan ganggu sleeping dogs.",
"<strong>Fase 4 (Alokasi)</strong>: batas CAC + marginal ROI + 10% eksperimen.",
"<strong>Deliverable</strong>: 1 halaman what–so what–now what; detail di appendix.",
"<strong>Hari 0</strong>: audit definisi & tracking (MK2) — fondasi semua fase.",
],
"prev": ["mk18-etika", "MK18"],
"next": ["pm-a1-ethics", "PM-A1"],
},
]
