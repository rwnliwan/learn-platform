# Track 6 — Marketing Data Analytics: MK1..MK6
LESSONS = [
{
"slug": "mk1-funnel-aarrr", "id": "MK1", "track": "Marketing Data Analytics",
"title_html": "Funnel AARRR:<br/>Dari 10.000 Pengunjung ke 100 Pelanggan",
"title_plain": "Funnel AARRR & Unit Economics",
"chapter_summary": "Funnel AARRR (Acquisition-Activation-Retention-Revenue-Referral), STP & 4P, dan unit economics: CAC, LTV, ROAS, payback period. Termasuk aturan LTV:CAC >= 3 dan cara menemukan bottleneck funnel dari data.",
"tujuan": [
"Menjelaskan tiap tahap AARRR beserta metrik kuncinya dengan bahasa sendiri.",
"Menghitung conversion rate antar-tahap dan menemukan bottleneck funnel dari data mentah.",
"Menghitung CAC, LTV, ROAS, dan payback period, lalu menilai sehat tidaknya unit economics.",
"Memutuskan fokus tim (acquisition vs activation vs retention) berdasarkan data funnel, bukan insting.",
],
"story_title": "Cerita: Rp500 Juta Terbakar dalam 3 Bulan",
"story": """<p>Startup kopi <em>&ldquo;KopiKilat&rdquo;</em> bangga: iklan mereka menghasilkan <strong>50.000 install</strong> dalam 3 bulan, bakar Rp500 juta. Deck ke investor penuh angka install yang menanjak. Lalu investor bertanya satu kalimat: <em>&ldquo;Yang pesan kopi kedua kali ada berapa?&rdquo;</em> Hening. Jawabannya: <strong>300 orang</strong>. Dari 50.000 install.</p>
<p>Twist-nya: acquisition <strong>bukan</strong> masalah mereka — 50.000 install itu bagus. Yang membunuh adalah <strong>activation</strong>: dari 8.000 yang daftar, cuma 1.200 yang pernah pesan (15%). Mereka mengoptimalkan tahap yang salah selama 3 bulan — karena tidak pernah mengukur conversion <em>antar-tahap</em>. Lesson ini memastikan kamu tidak mengulanginya.</p>""",
"concepts": [
{
"id": "aarrr", "toc": "Funnel AARRR — Lima Tahap",
"title": "AARRR — Lima Tahap yang Sering Dibaca Terbalik",
"body": """<p><strong>Definisi.</strong> AARRR (Dave McClure, 2007) adalah lima tahap perjalanan pelanggan: <strong>Acquisition</strong> (orang datang), <strong>Activation</strong> (merasakan nilai pertama — <em>aha moment</em>), <strong>Retention</strong> (kembali lagi), <strong>Revenue</strong> (membayar), <strong>Referral</strong> (mengajak orang lain). Tiap tahap punya metrik kunci sendiri.</p>
<ul>
<li><strong>Acquisition:</strong> visitor, install, CAC (biaya per pelanggan baru).</li>
<li><strong>Activation:</strong> <em>activation rate</em> — % yang mencapai aha moment (misal: pesan pertama, buat proyek pertama).</li>
<li><strong>Retention:</strong> <em>N-day retention</em> — % yang masih aktif di hari ke-N.</li>
<li><strong>Revenue:</strong> ARPU, conversion ke paid.</li>
<li><strong>Referral:</strong> <em>K-factor</em> — berapa pelanggan baru dibawa tiap pelanggan lama.</li>
</ul>""",
"formulas": [
{"math": r"CR_{t \to t+1} = \frac{N_{t+1}}{N_t} \quad;\quad CR_{total} = \prod_{t} CR_{t \to t+1}",
"symbols": [
"<Tex math={String.raw`CR_{t \\to t+1}`} />: conversion rate dari tahap t ke tahap berikutnya",
"<Tex math={String.raw`N_t`} />: jumlah orang di tahap t",
"<Tex math={String.raw`CR_{total}`} />: conversion ujung-ke-ujung (hasil kali semua tahap — makanya satu tahap bocor menghancurkan total)",
]},
{"math": r"K = i \times c",
"symbols": [
"<Tex math={String.raw`K`} />: K-factor (viral coefficient)",
"<Tex math={String.raw`i`} />: rata-rata undangan dikirim per pelanggan",
"<Tex math={String.raw`c`} />: conversion undangan menjadi pelanggan baru (K &gt; 1 = tumbuh viral, K &lt; 1 = referral hanya pemanis)",
]},
],
"intuisi": "Bayangkan funnel sebagai <strong>saringan bertingkat yang bocor</strong>. Kebanyakan tim menatap angka paling atas (visitor) dan paling bawah (revenue), padahal uang hilang di <em>sambungan antar-tahap</em>. Satu tahap dengan conversion 15% — bukan 50.000 visitor — yang menentukan nasibmu.",
"kapan": "Setiap produk digital, e-commerce (varian: lihat → keranjang → checkout → bayar), dan SaaS. Selalu mulai analisis marketing dari funnel, bukan dari total revenue.",
"worked": {"title": "📐 Contoh langkah-demi-langkah: Funnel KopiKilat (klik untuk buka)",
"body": """<p>Data: install 50.000 → daftar 8.000 → pesan pertama 1.200 → pesan ulang 300 → langganan 200 → referral 40.</p>
<p><strong>Langkah 1</strong> — conversion antar-tahap: 8.000/50.000 = <strong>16%</strong>; 1.200/8.000 = <strong>15%</strong>; 300/1.200 = <strong>25%</strong>; 200/300 = <strong>67%</strong>; 40/200 = <strong>20%</strong>.</p>
<p><strong>Langkah 2</strong> — bottleneck = tahap dengan conversion terendah: <strong>daftar → pesan pertama (15%)</strong>. Di sinilah 6.800 orang hilang.</p>
<p><strong>Langkah 3</strong> — overall: 200/50.000 = <strong>0,4%</strong> = 0,16 × 0,15 × 0,25 × 0,67. Satu tahap 15% menyeret semuanya.</p>"""},
"charts": [
{"data": """[{y: ["Install", "Daftar", "Pesan pertama", "Pesan ulang", "Langganan", "Referral"], x: [50000, 8000, 1200, 300, 200, 40], type: "bar", orientation: "h", marker: {color: ["#2a7de1","#2a7de1","#e8a838","#2a7de1","#2a7de1","#2a7de1"]}, text: ["50rb","8rb","1,2rb","300","200","40"], textposition: "outside"}]""",
"title": "Funnel KopiKilat: di mana 50.000 orang hilang?",
"layout": """{xaxis: {title: "Jumlah orang"}, yaxis: {autorange: "reversed"}, showlegend: false, margin: {l: 110}}""",
"cara": "Sumbu vertikal = tahap funnel dari atas (akuisisi) ke bawah (referral). Panjang batang = jumlah orang yang lolos ke tahap itu. Bandingkan panjang batang yang bersebelahan — penyusutan terbesar = bottleneck.",
"interpretasi": "Batang menyusut drastis dari &lsquo;Daftar&rsquo; (8.000) ke &lsquo;Pesan pertama&rsquo; (1.200) — batang kuning menandai masalah. Inilah visual dari &lsquo;ember bocor&rsquo;: 85% pendaftar tidak pernah merasakan produk. Budget iklan berikutnya seharusnya dipakai memperbaiki onboarding, bukan menambah install."},
],
},
{
"id": "stp4p", "toc": "STP & 4P — Peta Sebelum Perang",
"title": "STP & 4P — Peta Sebelum Perang",
"body": """<p><strong>Definisi.</strong> Sebelum menghitung apa pun, marketing yang benar menjawab tiga pertanyaan (<strong>STP</strong>): <strong>Segmentation</strong> — kelompok pelanggan apa saja yang ada? <strong>Targeting</strong> — kelompok mana yang kita layani? <strong>Positioning</strong> — apa yang membuat kita beda di benak mereka? Lalu mengeksekusi lewat <strong>4P</strong>: <strong>Product</strong> (apa yang dijual), <strong>Price</strong> (berapa), <strong>Place</strong> (di mana dibeli), <strong>Promotion</strong> (bagaimana orang tahu).</p>
<p>Analis data sering lompat langsung ke dashboard tanpa tahu &ldquo;produk ini untuk siapa&rdquo;. Akibatnya: segmentasi asal-asalan, targeting salah, dan insight yang tidak bisa dieksekusi tim marketing.</p>""",
"formulas": [],
"intuisi": "STP adalah <strong>peta</strong>, 4P adalah <strong>rencana perjalanan</strong>. Data tanpa STP seperti GPS tanpa tujuan: kamu tahu kecepatanmu (metrik), tapi tidak tahu mau ke mana (strategi). Setiap angka funnel harus dibaca <em>per segmen</em> — conversion mahasiswa dan pekerja bisa beda 3x.",
"kapan": "Saat merancang kampanye baru, mengevaluasi kenapa kampanye gagal (salah segmen? salah positioning?), dan sebelum membuat segmentasi di MK4.",
"worked": {"title": "📐 Contoh: STP KopiKilat (klik untuk buka)",
"body": """<p><strong>Segmentation:</strong> (1) mahasiswa — sensitif harga, nongkrong lama; (2) pekerja — butuh cepat, pesan via aplikasi; (3) premium — bayar mahal untuk ambience &amp; biji specialty.</p>
<p><strong>Targeting:</strong> KopiKilat pilih segmen (2) pekerja — ukuran besar, frekuensi beli tinggi, cocok dengan aplikasi pesan-antar.</p>
<p><strong>Positioning:</strong> &ldquo;kopi enak sampai dalam 15 menit&rdquo; — bukan &ldquo;kopi termurah&rdquo;.</p>
<p><strong>4P:</strong> Product = kopi + aplikasi; Price = Rp25rb (di bawah premium, di atas kaki lima); Place = aplikasi + 10 gerai dekat perkantoran; Promotion = iklan jam makan siang di sekitar kantor.</p>
<p>Pelajaran analis: kalau funnel dihitung gabungan tiga segmen, bottleneck tersamarkan. Pisahkan dulu, baru hitung.</p>"""},
"charts": [
{"data": """[{x: [3, 7, 8, 4, 6], y: [9, 6, 8, 3, 5], mode: "markers+text", text: ["Kaki lima", "KopiKilat", "Premium A", "Instan", "Premium B"], textposition: "top center", marker: {size: [14, 22, 18, 12, 16], color: ["#94a3b8","#e8a838","#2a7de1","#94a3b8","#2a7de1"]}}]""",
"title": "Positioning Map: Harga vs Kecepatan Saji",
"layout": """{xaxis: {title: "Harga (1=murah, 10=mahal)"}, yaxis: {title: "Kecepatan saji (1=lambat, 10=kilat)"}, showlegend: false}""",
"cara": "Sumbu X = harga, sumbu Y = kecepatan. Tiap titik = merek, ukuran titik = pangsa pasar. Cari area kosong (peluang) dan area berdesakan (red ocean).",
"interpretasi": "KopiKilat (kuning, titik besar) duduk di kuadran &lsquo;harga menengah + sangat cepat&rsquo; — area yang relatif kosong. Inilah positioning-nya secara visual: tidak adu murah dengan kaki lima, tidak adu gengsi dengan premium. Kalau titiknya menumpuk dengan pesaing, positioning belum tajam."},
],
},
{
"id": "unit", "toc": "Unit Economics — Matematika Bertahan Hidup",
"title": "Unit Economics — Matematika Bertahan Hidup",
"body": """<p><strong>Definisi.</strong> Unit economics menjawab: <strong>apakah satu pelanggan menguntungkan?</strong> Empat angka: <strong>CAC</strong> (<em>Customer Acquisition Cost</em>) = biaya mendapatkan satu pelanggan baru; <strong>LTV</strong> (<em>Lifetime Value</em>) = total profit dari satu pelanggan selama ia bertahan; <strong>ROAS</strong> (<em>Return on Ad Spend</em>) = revenue per rupiah iklan; <strong>Payback period</strong> = berapa lama CAC kembali modal.</p>
<p>Aturan praktis industri: <strong>LTV : CAC ≥ 3 : 1</strong> dan <strong>payback &lt; 12 bulan</strong> (subscription) atau &lt; 3 bulan (e-commerce). Di bawah itu, scale = bakar uang lebih cepat.</p>""",
"formulas": [
{"math": r"CAC = \frac{\text{Biaya akuisisi total}}{\text{Pelanggan baru}} \quad;\quad ROAS = \frac{\text{Revenue dari iklan}}{\text{Biaya iklan}}",
"symbols": [
"Biaya akuisisi total: semua spend marketing/sales pada periode itu (iklan + gaji tim + tools)",
"Pelanggan baru: yang benar-benar jadi pelanggan (bayar/aktif), BUKAN install/visitor",
"ROAS = 4 artinya tiap Rp1 iklan menghasilkan Rp4 revenue (belum dikurangi margin!)",
]},
{"math": r"LTV = ARPU \times \text{margin kotor} \times \frac{1}{\text{churn per periode}} \quad;\quad \text{Payback} = \frac{CAC}{ARPU \times \text{margin kotor}}",
"symbols": [
"<Tex math={String.raw`ARPU`} />: rata-rata revenue per pelanggan per bulan",
"margin kotor: % revenue yang jadi laba kotor (setelah COGS)",
"churn per periode: % pelanggan yang pergi tiap bulan (0,10 = 10%/bulan). Rumus ini untuk model subscription; 1/churn = umur rata-rata pelanggan dalam bulan",
"Payback: berapa bulan profit bulanan menutup CAC",
]},
],
"intuisi": "CAC adalah <strong>&lsquo;harga beli&rsquo;</strong> pelanggan, LTV adalah <strong>&lsquo;nilai jualnya kembali ke kamu&rsquo;</strong>. Bisnis sehat = beli murah, jual mahal. Startup yang bangga &lsquo;CAC kami cuma Rp20rb!&rsquo; tapi LTV-nya Rp30rb sedang rugi — mereka membeli pelanggan seharga Rp20rb untuk dapat Rp30rb <em>kotor</em>. Rasio yang bicara, bukan angka absolut.",
"kapan": "Sebelum menaikkan budget iklan, sebelum lapor ke investor, dan setiap kali ada yang usul &lsquo;scale 10x&rsquo;. Hitung dulu, scale kemudian.",
"worked": {"title": "📐 Contoh: Unit Economics KopiKilat (klik untuk buka)",
"body": """<p>Data: spend Rp500 jt → 200 pelanggan langganan. ARPU Rp120rb/bln, margin 60%, churn 15%/bln.</p>
<p><strong>Langkah 1 — CAC:</strong> 500.000.000 / 200 = <strong>Rp2,5 jt</strong> per pelanggan. (Sudah bau bahaya.)</p>
<p><strong>Langkah 2 — LTV:</strong> 120.000 × 0,6 × (1 / 0,15) = 120.000 × 0,6 × 6,67 = <strong>Rp480rb</strong>.</p>
<p><strong>Langkah 3 — Rasio:</strong> 480rb / 2,5jt = <strong>0,19</strong> — jauh di bawah 3. Tiap pelanggan merugikan Rp2jt.</p>
<p><strong>Langkah 4 — Payback:</strong> 2.500.000 / (120.000 × 0,6) = <strong>34,7 bulan</strong> — hampir 3 tahun, padahal umur rata-rata pelanggan cuma 6,7 bulan. Modal tidak pernah kembali.</p>
<p><strong>Kesimpulan:</strong> model ini mati secara matematis. Scale 10x = rugi 10x lebih cepat.</p>"""},
"charts": [
{"data": """[{x: ["Sehat", "Marginal", "KopiKilat"], y: [4.2, 2.9, 0.19], type: "bar", marker: {color: ["#2a7de1", "#e8a838", "#ef4444"]}, text: ["4,2", "2,9", "0,19"], textposition: "outside"}, {x: ["Sehat", "Marginal", "KopiKilat"], y: [3, 3, 3], type: "scatter", mode: "lines", name: "Batas sehat (3,0)", line: {dash: "dash", color: "#16a34a"}}]""",
"title": "Rasio LTV:CAC — tiga skenario",
"layout": """{yaxis: {title: "LTV : CAC"}, showlegend: true}""",
"cara": "Sumbu X = skenario bisnis, tinggi batang = rasio LTV:CAC. Garis hijau putus-putus = ambang sehat 3,0. Batang di atas garis = boleh scale; di bawah = perbaiki dulu.",
"interpretasi": "Hanya skenario &lsquo;Sehat&rsquo; (4,2) yang lolos ambang. KopiKilat (0,19) bahkan tidak terlihat di skala yang sama — visual betapa jauhnya mereka dari sehat. Inilah kenapa investor menanyakan angka kedua (repeat order), bukan angka install."},
],
},
],
"myths": [
{"t": "Funnel itu garis lurus: orang masuk dari atas, keluar jadi pelanggan di bawah.",
"benar": "Pengguna nyata <strong>loncat-loncat</strong>: install → diam 2 minggu → pesan → hilang → kembali lewat referral teman. Funnel modern dibaca sebagai <strong>loop</strong>: retention yang bagus menghidupkan referral, referral menjadi acquisition gratis. Kalau analisismu memaksa semua orang ke satu garis lurus, kamu akan salah menuduh &lsquo;bocor&rsquo; padahal mereka cuma mampir."},
{"t": "CAC rendah selalu bagus — yang penting murah dapat pelanggan.",
"benar": "CAC Rp20rb dengan churn 30%/bulan (LTV Rp80rb, rasio 4,0) <strong>lebih sehat</strong> daripada CAC Rp10rb dengan churn 5% tapi ARPU kecil (LTV Rp15rb, rasio 1,5). CAC rendah yang membawa pelanggan berkualitas sampah = ember bocor versi murah. Selalu baca CAC <strong>berpasangan</strong> dengan LTV."},
],
"tips": [
"<strong>Ukur conversion antar-tahap, bukan cuma total.</strong> Overall 0,4% tidak memberi tahu apa yang rusak. Lima angka antar-tahap (16%, 15%, 25%, 67%, 20%) langsung menunjuk tersangka: tahap 15%.",
"<strong>Dua angka penentu boleh-tidaknya scale: LTV:CAC ≥ 3 dan payback &lt; 12 bulan.</strong> Hafalkan. Setiap ada yang usul &lsquo;tambah budget 10x&rsquo;, minta dua angka ini dulu. Tidak ada = tidak scale.",
],
"labs": [
{"heading": "Simulasi Funnel: Cari Bocor Terbesar",
"intro": "Ubah conversion tiap tahap (0–1), jalankan, dan lihat: tahap mana yang paling menguntungkan jika diperbaiki 5 poin? Itulah prioritasmu minggu ini.",
"title": "Lab 1 — Simulator Bottleneck Funnel",
"hint": "Coba: naikkan tahap terendah dari 0.15 → 0.20. Bandingkan hasilnya dengan menaikkan tahap tertinggi. Mana yang lebih berdampak?",
"code": """# Simulator funnel: ubah angka conversion sesukamu (0.0 - 1.0)
tahap = ["Install", "Daftar", "Pesan_1", "Repeat", "Langganan"]
conv  = [1.00,     0.16,     0.15,      0.25,     0.67]  # conv[i] = dari tahap i-1 ke i
awal = 50000

n = awal
print(f"{'Tahap':<12} {'Masuk':>8} {'Conv':>7}")
for i, t in enumerate(tahap):
    if i > 0:
        n = int(n * conv[i])
    print(f"{t:<12} {n:>8,} {conv[i]:>6.0%}" if i>0 else f"{t:<12} {n:>8,} {'-':>7}")

print(f"\\nOverall conversion: {n/awal:.2%}")
# Bottleneck = tahap dengan conversion terendah (selain tahap 0)
b = min(range(1, len(conv)), key=lambda i: conv[i])
print(f"Bottleneck: {tahap[b]} ({conv[b]:.0%})")
baru = int(n * (conv[b] + 0.05) / conv[b])
print(f"Jika {tahap[b]} naik 5 poin ({conv[b]:.0%} -> {conv[b]+0.05:.0%}): pelanggan akhir {n:,} -> {baru:,} (+{baru-n:,})")
"""},
{"heading": "Kalkulator Unit Economics",
"intro": "Masukkan angka bisnismu (atau tebak untuk latihan). Kalkulator memberi verdict: SEHAT, MARGINAL, atau MATI.",
"title": "Lab 2 — Kalkulator CAC / LTV / Payback",
"hint": "Coba skenario KopiKilat: spend=500jt, pelanggan=200, arpu=120rb, margin=0.6, churn=0.15. Lalu coba perbaiki churn jadi 0.05 — lihat apa yang terjadi pada LTV.",
"code": """# Kalkulator unit economics — ubah angka sesukamu
spend     = 500_000_000  # total biaya akuisisi (Rp)
pelanggan = 200          # pelanggan baru (bayar)
arpu      = 120_000      # Rp / pelanggan / bulan
margin    = 0.60         # margin kotor (0-1)
churn     = 0.15         # churn per bulan (0-1)

cac = spend / pelanggan
ltv = arpu * margin * (1 / churn)
rasio = ltv / cac
payback = cac / (arpu * margin)

print(f"CAC      = Rp{cac:,.0f}")
print(f"LTV      = Rp{ltv:,.0f}")
print(f"LTV:CAC  = {rasio:.2f}  (syarat sehat >= 3.0)")
print(f"Payback  = {payback:.1f} bulan  (syarat < 12)")
print(f"Umur pelanggan rata-rata = {1/churn:.1f} bulan")
print()
if rasio >= 3 and payback < 12:
    print("Verdict: SEHAT - boleh scale")
elif rasio >= 1:
    print("Verdict: MARGINAL - perbaiki retention/pricing dulu")
else:
    print("Verdict: MATI - tiap pelanggan = rugi. JANGAN scale.")
"""},
],
"decisions": [
{"kondisi": "Acquisition kuat, activation jeblok (banyak datang, sedikit yang coba)", "pakai": "Fokus ACTIVATION",
"alasan": "Orang sudah datang tapi tidak merasakan nilai. Masalahnya di onboarding / aha moment, bukan di iklan.",
"contoh": "Duolingo: streak & lesson pertama 2 menit. E-commerce: voucher first-order + gratis ongkir."},
{"kondisi": "Activation oke, retention anjlok (coba sekali lalu hilang)", "pakai": "Fokus RETENTION",
"alasan": "Produk belum jadi kebiasaan. Acquisition baru hanya menambal ember bocor — mahal dan sia-sia.",
"contoh": "Notifikasi habit loop (Tokopedia: flash sale harian), program loyalitas, email win-back."},
{"kondisi": "Retention bagus, revenue kecil (ramai tapi tidak bayar)", "pakai": "Fokus REVENUE / MONETIZATION",
"alasan": "Nilai sudah dirasakan, tinggal cara menagihnya. Jangan tambah user dulu — naikkan ARPU dari yang ada.",
"contoh": "Freemium → paywall fitur pro; bundling; naikkan harga tier dengan value baru."},
{"kondisi": "Semua tahap sehat + LTV:CAC ≥ 3 + payback &lt; 12 bulan", "pakai": "SCALE ACQUISITION",
"alasan": "Mesin sudah terbukti menghasilkan. Setiap rupiah iklan kembali ≥ 3x. Inilah satu-satunya kondisi scale itu rasional.",
"contoh": "Naikkan budget iklan bertahap (2x, ukur, 2x lagi) sambil pantau CAC tidak naik."},
],
"rule10": "<ol><li><strong>Hitung conversion tiap tahap</strong> — bukan cuma total.</li><li><strong>Cari drop terbesar</strong> — itulah prioritas minggu ini.</li><li><strong>Hitung LTV:CAC</strong> — di bawah 3 = jangan scale.</li><li><strong>Baru tambah budget</strong> kalau dua syarat di atas lolos.</li></ol>",
"case": {"toc": "Mini-Case: KopiKilat — Scale atau Perbaiki?",
"title": "KopiKilat — Scale atau Perbaiki?",
"body": """<p>Kamu analis di KopiKilat. CEO mengusulkan: <em>&ldquo;Funnel kita 0,4% — kecil. Kita scale iklan 5x supaya pelanggan 5x lipat!&rdquo;</em> Data: spend Rp500 jt → 200 pelanggan. ARPU Rp120rb/bln, margin 60%, churn 15%/bln. Conversion antar-tahap: 16% → <strong>15%</strong> → 25% → 67%.</p>""",
"q": "(a) Di tahap mana bottleneck-nya, dan berapa orang hilang di sana? (b) Apakah usul scale 5x rasional? (c) Jika budget perbaikan terbatas, satu intervensi apa yang paling berdampak?",
"pembahasan": """<p>(a) <strong>Daftar → pesan pertama (15%)</strong>: 8.000 daftar, cuma 1.200 pesan — <strong>6.800 orang hilang</strong> di satu sambungan. Ini 85% dari semua yang daftar.</p>
<p>(b) <strong>Tidak rasional.</strong> LTV Rp480rb vs CAC Rp2,5jt → rasio 0,19. Scale 5x = rugi 5x lebih besar (Rp2jt rugi × 1.000 pelanggan = Rp2 miliar). Syarat scale (LTV:CAC ≥ 3) tidak terpenuhi.</p>
<p>(c) <strong>Perbaiki onboarding:</strong> sederhanakan pendaftaran (guest checkout), voucher Rp30rb untuk pesanan pertama, dan tutorial 30 detik. Jika tahap 15% → 25%, pelanggan akhir naik dari 200 → ~333 <em>tanpa tambah budget iklan</em>. Matematika: 8.000 × 0,25 × 0,25 × 0,67 ≈ 335.</p>"""},
"quiz": [
{"q": "Funnel: 10.000 visitor → 2.000 signup → 400 aktif → 100 bayar. Berapa conversion signup → aktif?",
"options": ["20%", "4%", "2%", "40%"], "correct": 0,
"why": "Benar: 400/2.000 = 20%. Yang 4% (400/10.000) itu conversion visitor → aktif — beda tahap, beda arti. Selalu bagi dengan tahap sebelumnya, bukan dengan paling atas."},
{"q": "CAC Rp200rb, ARPU Rp50rb/bln, margin 80%, churn 10%/bln. Berapa LTV dan verdict-nya?",
"options": ["LTV Rp400rb, SEHAT", "LTV Rp400rb, MARGINAL (rasio 2,0)", "LTV Rp500rb, SEHAT", "LTV Rp160rb, MATI"], "correct": 1,
"why": "Benar: LTV = 50.000 × 0,8 × (1/0,10) = Rp400rb. Rasio 400rb/200rb = 2,0 — di bawah 3 tapi di atas 1 → MARGINAL. Boleh jalan, belum boleh scale agresif."},
{"q": "Startup A: CAC 100rb, LTV 500rb. Startup B: CAC 50rb, LTV 120rb. Mana lebih sehat?",
"options": ["B, karena CAC-nya lebih murah", "A, karena rasio LTV:CAC 5,0 vs 2,4", "Sama saja", "Tidak bisa dibandingkan"], "correct": 1,
"why": "Benar: A (5,0) vs B (2,4). CAC murah tidak ada artinya tanpa LTV. B terlihat efisien tapi tiap pelanggannya kurang menguntungkan secara relatif."},
{"q": "K-factor 0,3 artinya…",
"options": ["Tiap 10 pelanggan membawa 3 pelanggan baru; belum viral", "30% pelanggan mereferensikan", "Viral — tumbuh eksponensial", "Churn 30%"], "correct": 0,
"why": "Benar: K = 0,3 &lt; 1 → tiap pelanggan rata-rata membawa 0,3 pelanggan baru. Referral membantu tapi tidak menciptakan pertumbuhan viral (butuh K &gt; 1)."},
{"q": "Activation rate rendah tapi retention tinggi. Fokus tim yang benar?",
"options": ["Tambah budget iklan", "Perbaiki onboarding / aha moment", "Naikkan harga", "Program referral"], "correct": 1,
"why": "Benar: yang bertahan itu setia (retention tinggi) — masalahnya orang tidak sampai merasakan nilai. Perbaiki jembatan daftar → aha moment, bukan menambah orang di pintu masuk."},
],
"rangkum": [
"<strong>AARRR</strong>: lima tahap (Acquisition → Activation → Retention → Revenue → Referral); ukur conversion <em>antar-tahap</em> untuk menemukan bottleneck.",
"<strong>Overall conversion</strong> = hasil kali semua tahap — satu tahap 15% menyeret semuanya.",
"<strong>STP</strong> (siapa yang dilayani) mendahului <strong>4P</strong> (bagaimana melayani); analisis funnel selalu per segmen.",
"<strong>CAC</strong> = biaya/pelanggan baru; <strong>LTV</strong> = ARPU × margin × (1/churn); <strong>ROAS</strong> = revenue/biaya iklan; <strong>Payback</strong> = CAC/(ARPU × margin).",
"<strong>Aturan scale</strong>: LTV:CAC ≥ 3 dan payback &lt; 12 bulan. Di bawah itu, scale = bakar uang lebih cepat.",
"<strong>Kapan TIDAK pakai funnel linear</strong>: produk dengan loop kuat (marketplace, social) — baca sebagai loop retention → referral → acquisition.",
],
"prev": ["a19-eda-end-to-end", "A1.9 EDA"],
"next": ["mk2-tracking", "MK2"],
},
]
