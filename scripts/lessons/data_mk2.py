# Track 6 — MK2, MK3
LESSONS = [
{
"slug": "mk2-tracking", "id": "MK2", "track": "Marketing Data Analytics",
"title_html": "Tracking:<br/>Sampah Masuk, Sampah Keluar",
"title_plain": "Data & Tracking: Event, UTM, Identity Resolution",
"chapter_summary": "Fondasi data marketing: event schema & taxonomy, parameter UTM, first-party data & server-side tracking, identity resolution (deterministik vs probabilistik), dan pipeline ETL + QA. Tanpa tracking yang benar, semua analisis di MK3-MK19 berdiri di atas pasir.",
"tujuan": [
"Merancang event schema & taxonomy yang konsisten (naming, properties wajib, identify).",
"Memakai parameter UTM dengan disiplin dan menjelaskan kenapa 'direct/none' membengkak.",
"Menjelaskan perbedaan first-party vs third-party data dan kapan memakai server-side tracking.",
"Membedakan identity resolution deterministik vs probabilistik dan memilih yang tepat.",
],
"story_title": "Cerita: Promo 11.11 yang 'Sukses' — Menurut Data yang Salah",
"story": """<p>E-commerce <em>&ldquo;BelanjaYuk&rdquo;</em> merayakan promo 11.11: dashboard GA4 menunjukkan <strong>ROAS 8,2</strong> — fantastis. Budget tahun depan digeser besar-besaran ke channel yang &ldquo;menang&rdquo;. Tiga bulan kemudian, finance protes: revenue tidak naik seperti yang diklaim dashboard.</p>
<p>Twist-nya: <strong>41% traffic tercatat sebagai &ldquo;direct/none&rdquo;</strong> karena tim tidak disiplin UTM; event <em>purchase</em> dikirim dua kali (client + server) tanpa deduplikasi sehingga revenue double-count; dan &ldquo;pengguna baru&rdquo; ternyata pelanggan lama yang ganti HP (identity tidak ter-resolve). Dashboard-nya rapi. Datanya sampah. Keputusan budget Rp2 miliar diambil dari sampah itu. Lesson ini tentang fondasi yang tidak terlihat tapi menentukan segalanya.</p>""",
"concepts": [
{
"id": "event", "toc": "Event Schema & Taxonomy",
"title": "Event Schema — Bahasa yang Disepakati Semua Tim",
"body": """<p><strong>Definisi.</strong> Setiap aksi pengguna direkam sebagai <strong>event</strong>: <em>siapa</em> (user_id/device_id), <em>kapan</em> (timestamp), <em>apa</em> (event_name), <em>detailnya</em> (properties). <strong>Taxonomy</strong> adalah kamus resmi: daftar event yang boleh dikirim, nama pastinya, dan properties wajib tiap event. Tanpa taxonomy, tim A kirim <code className="inline">purchase</code>, tim B kirim <code className="inline">Purchase_Success</code>, tim C kirim <code className="inline">bayar_berhasil</code> — analis yang menderita.</p>
<p>Tiga jenis panggilan standar (Segment-style): <strong>identify</strong> (siapa user ini: user_id + traits), <strong>track</strong> (aksi: <code className="inline">order_completed</code>), <strong>screen/page</strong> (halaman dilihat). Aturan penamaan: <code className="inline">snake_case</code>, kata kerja lampau (<code className="inline">order_completed</code> bukan <code className="inline">complete_order</code>), satu bahasa (pilih Inggris, konsisten).</p>""",
"formulas": [],
"intuisi": "Taxonomy adalah <strong>kontrak</strong> antara tim produk dan tim data. Seperti kontrak API: kalau satu pihak ganti nama field diam-diam, pihak lain rusak. Review taxonomy = code review untuk data.",
"kapan": "Sebelum instrumentasi fitur baru apa pun. Event tanpa taxonomy = utang data yang bunganya dibayar analis tiap minggu.",
"worked": {"title": "📐 Contoh: Taxonomy checkout e-commerce (klik untuk buka)",
"body": """<p><strong>Event:</strong> <code className="inline">checkout_started</code> — properties wajib: <code className="inline">cart_id</code>, <code className="inline">cart_value</code>, <code className="inline">currency</code>, <code className="inline">item_count</code>.</p>
<p><strong>Event:</strong> <code className="inline">order_completed</code> — properties wajib: <code className="inline">order_id</code> (unik!), <code className="inline">revenue</code>, <code className="inline">payment_method</code>, <code className="inline">coupon_code</code> (boleh null).</p>
<p><strong>Aturan:</strong> <code className="inline">order_id</code> unik dipakai untuk <strong>deduplikasi</strong> (kasus BelanjaYuk: purchase terkirim 2x). <code className="inline">revenue</code> selalu dalam satuan terkecil (sen) + <code className="inline">currency</code> — jangan campur rupiah dan dollar.</p>"""},
"charts": [
{"data": """[{x: ["Q1", "Q2", "Q3", "Q4"], y: [12, 18, 9, 3], name: "Event duplikat / inkonsisten (%)", type: "bar", marker: {color: ["#ef4444","#ef4444","#e8a838","#2a7de1"]}, text: ["12%","18%","9%","3%"], textposition: "outside"}]""",
"title": "Event bermasalah sebelum vs sesudah taxonomy",
"layout": """{yaxis: {title: "% event bermasalah"}, xaxis: {title: "Q1-Q2: tanpa taxonomy → Q3-Q4: taxonomy + QA"}, showlegend: false}""",
"cara": "Sumbu X = kuartal, tinggi batang = % event yang duplikat/salah nama/salah tipe. Warna merah = parah, biru = sehat.",
"interpretasi": "Setelah taxonomy + QA checklist diterapkan (Q3), event bermasalah turun dari 18% ke 3%. Pola umum: masalah tracking <strong>naik</strong> dulu saat traffic naik (Q2) kalau tidak ada governance. Governance data = investasi yang return-nya sunyi tapi besar."},
],
},
{
"id": "utm", "toc": "UTM, First-Party Data & Server-Side",
"title": "UTM & First-Party — Dari Mana Orang Ini Datang?",
"body": """<p><strong>Definisi.</strong> <strong>UTM</strong> adalah lima parameter di URL iklan yang memberi tahu analytics &ldquo;klik ini dari mana&rdquo;: <code className="inline">utm_source</code> (mis. google, newsletter), <code className="inline">utm_medium</code> (cpc, email, social), <code className="inline">utm_campaign</code> (nama kampanye), <code className="inline">utm_content</code> (varian kreatif), <code className="inline">utm_term</code> (keyword). Tanpa UTM yang disiplin, traffic jatuh ke bucket <strong>&ldquo;direct/none&rdquo;</strong> — kuburan atribusi.</p>
<p><strong>First-party data</strong> = data yang kamu kumpulkan sendiri dari interaksinmu (transaksi, CRM, event situs). <strong>Third-party data</strong> = data pihak lain (cookie iklan lintas situs) — sekarat karena regulasi &amp; browser (Safari/Firefox blokir, Chrome mengetatkan). <strong>Server-side tracking</strong> = event dikirim dari server-mu ke platform (mis. Meta CAPI), bukan dari browser user — lebih tahan ad-blocker &amp; cookie-killer, wajib deduplikasi dengan event browser.</p>""",
"formulas": [],
"intuisi": "UTM adalah <strong>plat nomor</strong> tiap klik iklan. Iklan tanpa UTM = mobil tanpa plat: sampai tujuan, tapi tidak ada yang tahu dari mana. Dan &lsquo;direct/none&rsquo; yang membengkak = parkiran penuh mobil tanpa plat — di situlah budget salah alamat.",
"kapan": "UTM wajib di SEMUA link kampanye (iklan, email, influencer, QR). Server-side untuk event uang (purchase, lead) — event yang kalau hilang/hilang-ganda, keputusannya salah.",
"worked": {"title": "📐 Contoh: URL UTM yang benar vs salah (klik untuk buka)",
"body": """<p><strong>Benar:</strong> <code className="inline">toko.id/promo?utm_source=instagram&amp;utm_medium=cpc&amp;utm_campaign=11_11_flash&amp;utm_content=video_30s</code> — tiap parameter terisi, konsisten lowercase, campaign bisa diagregasi.</p>
<p><strong>Salah:</strong> <code className="inline">toko.id/promo?utm_source=IG&amp;utm_medium=CPC&amp;utm_campaign=Promo11.11!!</code> — &lsquo;IG&rsquo; vs &lsquo;instagram&rsquo; pecah jadi dua source; spasi/tanda seru merusak parsing. <strong>Salah fatal:</strong> tidak pakai UTM sama sekali di iklan TikTok → 100% traffic jadi &lsquo;direct/none&rsquo;.</p>
<p>Aturan: satu <strong>spreadsheet/konvensi UTM</strong> yang dipakai semua tim; validasi otomatis saat deploy (lihat Lab 1).</p>"""},
"charts": [
{"data": """[{x: ["Tanpa disiplin UTM", "Dengan disiplin UTM"], y: [41, 9], name: "direct/none", type: "bar", marker: {color: "#ef4444"}}, {x: ["Tanpa disiplin UTM", "Dengan disiplin UTM"], y: [59, 91], name: "ter-atribusi", type: "bar", marker: {color: "#2a7de1"}}]""",
"title": "Proporsi traffic 'direct/none' — kasus BelanjaYuk",
"layout": """{barmode: "stack", yaxis: {title: "% traffic"}, showlegend: true}""",
"cara": "Dua batang stacked: kiri = sebelum disiplin UTM, kanan = sesudah. Merah = direct/none (tidak diketahui asalnya), biru = ter-atribusi ke channel.",
"interpretasi": "Direct/none susut dari 41% ke 9% — artinya keputusan alokasi budget kini berdiri di atas 91% data yang jelas asalnya, bukan 59%. Sisa 9% wajar (bookmark, ketik langsung). Target realistis: direct/none &lt; 15%."},
],
},
{
"id": "identity", "toc": "Identity Resolution & Pipeline",
"title": "Identity Resolution — Satu Orang, Banyak Jejak",
"body": """<p><strong>Definisi.</strong> Pengguna yang sama muncul sebagai banyak identitas: cookie browser, device_id HP, email, nomor HP, akun login. <strong>Identity resolution</strong> menggabungkannya jadi satu profil. Dua pendekatan: <strong>deterministik</strong> — cocokkan kunci pasti (email, nomor HP, user_id login); presisi tinggi, coverage terbatas. <strong>Probabilistik</strong> — cocokkan pola (device fingerprint, IP + perilaku); coverage luas, ada risiko salah gabung.</p>
<p>Hasilnya disimpan di <strong>CRM/CDP</strong> (<em>Customer Data Platform</em>: profil pelanggan terpadu). Data mengalir lewat <strong>pipeline ETL/ELT</strong> ke warehouse — dan di tiap tahap butuh <strong>QA otomatis</strong>: cek volume (event turun 50% = alarm), null rate, duplikat, schema drift (field baru/hilang).</p>""",
"formulas": [
{"math": r"\text{Match rate} = \frac{\text{identitas berhasil digabung}}{\text{total identitas mentah}}",
"symbols": [
"Match rate deterministik tipikal: 30–60% (hanya yang login/memberi email)",
"Match rate + probabilistik: 70–90%, tapi dengan false-match 2–5% — jangan dipakai untuk hal sensitif (tagih-menagih, kesehatan)",
]},
],
"intuisi": "Identity resolution seperti <strong>menyatukan KTP, SIM, dan paspor</strong> jadi satu orang. Deterministik = cocokkan NIK (pasti). Probabilistik = cocokkan foto + nama (kadang salah orang). Untuk kirim promo, salah gabung = malu-maluin. Untuk analisis agregat, masih oke.",
"kapan": "Deterministik untuk komunikasi personal &amp; transaksi. Probabilistik untuk analisis &amp; iklan. Keduanya butuh aturan retensi &amp; consent (lihat MK18).",
"worked": {"title": "📐 Contoh: Kasus 'pengguna baru' palsu (klik untuk buka)",
"body": """<p>BelanjaYuk menghitung &ldquo;pengguna baru&rdquo; dari device_id. Pelanggan ganti HP → device_id baru → tercatat sebagai pengguna baru, CAC terlihat naik, retention terlihat turun.</p>
<p><strong>Fix deterministik:</strong> saat login, gabungkan device_id lama + baru ke user_id yang sama (tabel mapping). &ldquo;Pengguna baru&rdquo; didefinisikan ulang = user_id pertama kali muncul, bukan device_id pertama kali.</p>
<p>Hasil: pengguna baru &ldquo;turun&rdquo; 22% (angka jujur), CAC terkoreksi, dan retention naik — bukan karena produk membaik, tapi karena pengukuran berhenti berbohong.</p>"""},
"charts": [
{"data": """[{x: ["Deterministik saja", "+ Probabilistik"], y: [45, 82], type: "bar", marker: {color: ["#2a7de1", "#e8a838"]}, text: ["45%", "82%"], textposition: "outside"}]""",
"title": "Match rate: deterministik vs kombinasi",
"layout": """{yaxis: {title: "% identitas ter-resolve"}, showlegend: false}""",
"cara": "Tinggi batang = % identitas mentah yang berhasil digabung jadi satu profil pelanggan.",
"interpretasi": "Deterministik saja hanya me-resolve 45% (yang login). Tambah probabilistik → 82%, tapi ingat harganya: 2–5% salah gabung. Pilih berdasarkan use case: komunikasi personal = deterministik saja; analisis &amp; targeting iklan = kombinasi boleh."},
],
},
],
"myths": [
{"t": "GA4 / dashboard default sudah cukup — tinggal baca angkanya.",
"benar": "Tool default <strong>tidak tahu definisi bisnismu</strong>: apa itu &lsquo;pengguna aktif&rsquo;? Kapan &lsquo;purchase&rsquo; dihitung (klik tombol atau pembayaran sukses)? Tanpa taxonomy &amp; definisi yang disepakati, dua orang baca dashboard yang sama bisa simpulkan hal berlawanan. Dashboard tanpa definisi = ramalan cuaca tanpa satuan."},
{"t": "Last-click attribution = kebenaran: channel terakhir sebelum beli yang berjasa.",
"benar": "Last-click memberi <strong>semua kredit ke penutup</strong> (biasanya search/brand) dan nol ke pembuka (video, influencer, display). Hasilnya: budget dipotong dari channel pembuka → pipeline kering 2 bulan kemudian. Last-click itu <em>satu</em> sudut pandang, bukan kebenaran (lihat MK12 untuk atribusi yang adil)."},
],
"tips": [
"<strong>Event uang wajib server-side + deduplikasi.</strong> Purchase/lead yang dikirim dari browser bisa hilang (ad-blocker) atau ganda (refresh). Kirim dari server dengan ID unik (order_id) dan deduplicate di warehouse. Event baca artikel? Client-side cukup.",
"<strong>QA tracking = unit test untuk data.</strong> Setiap deploy: cek volume event (±20% dari baseline = alarm), null rate field wajib, dan schema drift. Satu jam QA menghemat satu minggu debat &lsquo;datanya aneh&rsquo;.",
],
"labs": [
{"heading": "Validator UTM Otomatis",
"intro": "Fungsi ini mem-parse URL kampanye dan memberi nilai kelayakan tracking. Ubah URL contohnya — coba URL tanpa UTM, UTM berantakan, dan UTM rapi.",
"title": "Lab 1 — Validator UTM",
"hint": "Coba: hapus utm_campaign, atau ganti utm_source=IG vs instagram. Lihat skor berubah. Aturan apa yang paling sering dilanggar tim?",
"code": """from urllib.parse import urlparse, parse_qs

def nilai_utm(url):
    q = parse_qs(urlparse(url).query)
    get = lambda k: q.get(k, [""])[0]
    masalah = []
    for k in ["utm_source", "utm_medium", "utm_campaign"]:
        if not get(k):
            masalah.append(f"Wajib tapi kosong: {k}")
    for k in ["utm_source", "utm_medium", "utm_campaign"]:
        v = get(k)
        if v != v.lower().replace(" ", "_") and v:
            masalah.append(f"Tidak konsisten (pakai lowercase_underscore): {k}={v}")
    skor = max(0, 100 - 30 * len(masalah))
    return skor, masalah

contoh = [
    "https://toko.id/promo?utm_source=instagram&utm_medium=cpc&utm_campaign=11_11",
    "https://toko.id/promo?utm_source=IG&utm_medium=CPC&utm_campaign=Promo 11.11!!",
    "https://toko.id/promo",
]
for u in contoh:
    s, m = nilai_utm(u)
    print(f"skor {s:3d} | {u[:70]}")
    for x in m:
        print(f"           - {x}")
    print()
"""},
{"heading": "Identity Resolution Deterministik",
"intro": "Gabungkan tabel web (cookie) + tabel app (device) lewat email yang sama. Lihat berapa identitas menyusut — dan siapa yang tidak bisa digabung (butuh probabilistik).",
"title": "Lab 2 — Merge Identitas Deterministik",
"hint": "Ubah beberapa email jadi None — lihat match rate turun. Itulah batas deterministik: yang tidak login tidak ter-resolve.",
"code": """# Tabel mentah: (identitas, email)
web = [("cookie_1", "ani@mail.id"), ("cookie_2", "budi@mail.id"),
       ("cookie_3", None), ("cookie_4", "ani@mail.id")]   # ani buka 2 browser
app = [("dev_9", "ani@mail.id"), ("dev_3", None), ("dev_7", "cici@mail.id")]

def resolve(*tabels):
    profil, belum = {}, []
    for t in tabels:
        for ident, email in t:
            if email:
                profil.setdefault(email, []).append(ident)
            else:
                belum.append(ident)
    return profil, belum

profil, belum = resolve(web, app)
total = len(web) + len(app)
print(f"Identitas mentah : {total}")
print(f"Profil ter-resolve: {len(profil)}")
for email, idents in profil.items():
    print(f"  {email} <- {idents}")
print(f"Tidak ter-resolve (butuh probabilistik): {belum}")
ter = total - len(belum)
print(f"Match rate deterministik: {ter}/{total} = {ter/total:.0%} (sisanya butuh login / probabilistik)")
"""},
],
"decisions": [
{"kondisi": "Event bernilai uang (purchase, lead, langganan)", "pakai": "Server-side + ID unik + deduplikasi",
"alasan": "Hilang = revenue tidak tercatat; ganda = revenue double-count. Keduanya merusak ROAS & LTV.",
"contoh": "Meta Conversions API / TikTok Events API dengan order_id sebagai event_id."},
{"kondisi": "Event perilaku ringan (scroll, view_item)", "pakai": "Client-side (browser) cukup",
"alasan": "Volume besar, nilai per-event kecil. Kehilangan 5% tidak mengubah keputusan.",
"contoh": "GA4 otomatis + enhanced measurement."},
{"kondisi": "Butuh kirim pesan personal / hitung LTV per orang", "pakai": "Identity deterministik (email/HP/login)",
"alasan": "Salah gabung = kirim promo orang lain / salah tagih. Presisi &gt; coverage.",
"contoh": "CDP: gabungkan hanya yang match email terverifikasi."},
{"kondisi": "Butuh analisis agregat & targeting iklan", "pakai": "Deterministik + probabilistik",
"alasan": "Coverage penting, salah gabung 2–5% masih bisa ditoleransi di level agregat.",
"contoh": "Segmentasi audiens lookalike untuk prospekting."},
],
"rule10": "<ol><li><strong>Semua link kampanye pakai UTM</strong> — tanpa kecuali.</li><li><strong>Event uang = server-side + ID unik.</strong></li><li><strong>Definisi disepakati tertulis</strong> sebelum dashboard dibaca.</li><li><strong>QA otomatis</strong> tiap deploy: volume, null, duplikat.</li></ol>",
"case": {"toc": "Mini-Case: Misteri ROAS 8,2",
"title": "Misteri ROAS 8,2 BelanjaYuk",
"body": """<p>Dashboard: ROAS kampanye &ldquo;Flash Sale&rdquo; = <strong>8,2</strong>. Finance: revenue naik cuma 12%. Investigasi menemukan: (1) 41% traffic &ldquo;direct/none&rdquo;; (2) event purchase terkirim 2x untuk 18% order (refresh halaman sukses); (3) &ldquo;new user&rdquo; dihitung dari device_id.</p>""",
"q": "(a) Koreksi apa saja yang harus dilakukan sebelum angka dipercaya? (b) Setelah koreksi, ROAS &lsquo;sebenarnya&rsquo; kemungkinan naik atau turun — kenapa? (c) Satu proses agar tidak terulang?",
"pembahasan": """<p>(a) <strong>Tiga koreksi:</strong> (1) disiplin UTM + reklasifikasi direct/none (survei &ldquo;darimana tahu kami&rdquo; untuk sampel); (2) deduplikasi purchase by order_id di warehouse; (3) definisi new user = user_id pertama kali (bukan device_id).</p>
<p>(b) <strong>Turun.</strong> Double-count menggelembungkan revenue tercatat (±18% order), dan sebagian &ldquo;new user&rdquo; adalah pelanggan lama. ROAS 8,2 kemungkinan aslinya 5–6 — masih bagus, tapi tidak sefantastis itu. Keputusan &ldquo;geser semua budget&rdquo; jadi perlu dikalibrasi ulang.</p>
<p>(c) <strong>Tracking QA checklist</strong> yang dijalankan tiap deploy kampanye: validator UTM otomatis (Lab 1), test purchase end-to-end cek duplikat, dan definisi metrik tertulis yang ditandatangani marketing + finance + data.</p>"""},
"quiz": [
{"q": "41% traffic tercatat 'direct/none'. Penyebab paling mungkin?",
"options": ["Bot menguasai situs", "Link kampanye tidak pakai UTM yang disiplin", "GA4 error", "User memang mengetik URL manual semua"], "correct": 1,
"why": "Benar: direct/none membengkak = klik datang tanpa parameter asal. Penyebab klasik: iklan/influencer/email tanpa UTM. Solusinya governance UTM, bukan ganti tool analytics."},
{"q": "Event purchase dikirim dari browser DAN server. Risiko terbesar?",
"options": ["Data terlalu lengkap", "Double-counting revenue jika tanpa deduplikasi", "Server kelebihan beban", "Tidak ada risiko"], "correct": 1,
"why": "Benar: dua sumber = dua kiriman untuk satu pembelian nyata. Wajib satu ID unik (order_id) + deduplikasi di warehouse. Redundansi itu bagus untuk ketahanan, tapi harus di-dedup."},
{"q": "Untuk menghitung LTV per pelanggan dan kirim promo personal, metode identity resolution yang tepat?",
"options": ["Probabilistik saja (coverage luas)", "Deterministik (email/HP/login terverifikasi)", "Tidak perlu resolve", "Tebak dari IP"], "correct": 1,
"why": "Benar: hal personal butuh presisi. Salah gabung probabilistik (2–5%) berarti promo/tagihan nyasar ke orang lain — risiko komplain & privasi. Coverage luas berguna untuk analisis agregat, bukan komunikasi personal."},
{"q": "Manakah praktik taxonomy yang BENAR?",
"options": ["Tiap tim bebas menamai event sesukanya", "snake_case, kata kerja lampau, satu bahasa, terdokumentasi", "Pakai nama Indonesia campur Inggris biar lokal", "Event cukup satu: 'user_action' dengan properties bebas"], "correct": 1,
"why": "Benar: konsistensi penamaan + dokumentasi = kontrak antar tim. 'purchase', 'Purchase_Success', 'bayar_berhasil' sebagai tiga event berbeda adalah mimpi buruk analis."},
{"q": "Kenapa third-party cookie sekarat dan apa penggantinya?",
"options": ["Tidak sekarat, masih baik-baik saja", "Dibatasi browser & regulasi; gantinya first-party data + server-side tracking", "Diganti iklan TV", "Tidak ada pengganti"], "correct": 1,
"why": "Benar: Safari/Firefox memblokir, Chrome mengetatkan, regulasi (UU PDP/GDPR) menuntut consent. Strategi bertahan: kumpulkan first-party data (login, transaksi, event sendiri) + kirim server-side."},
],
"rangkum": [
"<strong>Event schema</strong>: (siapa, kapan, apa, detail). <strong>Taxonomy</strong> = kamus resmi event; tanpa itu, nama berantakan dan analis menderita.",
"<strong>UTM</strong> (source/medium/campaign/content/term) = plat nomor tiap klik; tanpa disiplin UTM, traffic tenggelam di &lsquo;direct/none&rsquo;.",
"<strong>First-party data</strong> (milikmu) &gt; third-party (sekarat). <strong>Server-side tracking</strong> untuk event uang — tahan ad-blocker, wajib deduplikasi.",
"<strong>Identity resolution</strong>: deterministik (presisi, untuk hal personal) vs probabilistik (coverage, untuk agregat/iklan).",
"<strong>Pipeline + QA</strong>: cek volume, null rate, duplikat, schema drift tiap deploy — unit test untuk data.",
"<strong>Kapan TIDAK cukup dashboard default</strong>: selalu — definisikan dulu &lsquo;aktif&rsquo;, &lsquo;purchase&rsquo;, &lsquo;new user&rsquo; secara tertulis.",
],
"prev": ["mk1-funnel-aarrr", "MK1"],
"next": ["mk3-deskriptif", "MK3"],
},
{
"slug": "mk3-deskriptif", "id": "MK3", "track": "Marketing Data Analytics",
"title_html": "Analitik Deskriptif:<br/>Funnel, Cohort, dan RFM",
"title_plain": "Analitik Deskriptif: Funnel, Cohort, RFM",
"chapter_summary": "Tiga lensa deskriptif marketing: funnel analytics (drop-off & time-to-convert), cohort retention (kurva & heatmap retensi), dan segmentasi RFM (Recency-Frequency-Monetary). Lengkap dengan lab cohort table dan RFM scoring dari data transaksi.",
"tujuan": [
"Menghitung drop-off dan time-to-convert antar tahap funnel per segmen/channel.",
"Membangun cohort retention table dan membaca kurva retensi (kapan retensi 'matang').",
"Menghitung skor RFM dan memetakan pelanggan ke segmen aksi (Champions, At Risk, Hibernating...).",
"Memilih lensa yang tepat (funnel vs cohort vs RFM) untuk tiap pertanyaan bisnis.",
],
"story_title": "Cerita: 'Retention Kami 40%' — Benarkah?",
"story": """<p>CEO <em>&ldquo;SehatQ&rsquo;&rdquo;</em> (aplikasi kesehatan) bangga mengumumkan <em>&ldquo;retention kami 40%!&rdquo;</em> ke investor. Analis baru, Dita, mengangguk — lalu malamnya membongkar angka itu. Ternyata 40% adalah <strong>rata-rata</strong> dari: cohort Januari 55% (pengguna awal yang fanatik) dan cohort Juni <strong>18%</strong> (hasil kampanye diskon besar-besaran yang mendatangkan pemburu promo).</p>
<p>Twist-nya: retention <strong>agregat menutupi kemunduran</strong>. Produk sebenarnya makin buruk mempertahankan pengguna baru — tapi angka rata-rata terlihat stabil karena cohort lama yang besar menutupi. Dita mengganti satu angka dengan <strong>cohort table</strong>, dan rapat berikutnya berubah total: fokus dari &ldquo;tambah user&rdquo; menjadi &ldquo;perbaiki onboarding cohort baru&rdquo;. Lesson ini tentang tiga lensa yang membuat angka marketing jujur.</p>""",
"concepts": [
{
"id": "funnel2", "toc": "Funnel Analytics Lanjutan",
"title": "Funnel Analytics — Bukan Sekadar Corong",
"body": """<p><strong>Definisi.</strong> Di MK1 kamu menghitung conversion antar-tahap. Lanjutannya: <strong>drop-off absolut vs relatif</strong> (hilang 6.800 orang vs hilang 85% — keduanya penting), <strong>time-to-convert</strong> (berapa lama dari tahap A ke B; median, bukan mean — distribusinya skew), dan <strong>funnel per segmen</strong> (per channel, per device, per cohort — bottleneck tiap segmen bisa beda).</p>
<p>Dua jebakan: (1) <strong>jendela waktu</strong> — funnel &ldquo;daftar → beli dalam 7 hari&rdquo; vs &ldquo;30 hari&rdquo; memberi conversion beda; pilih jendela sesuai siklus belimu. (2) <strong>urutan longgar</strong> — user boleh lompat tahap (langsung beli tanpa daftar via guest checkout); funnel kaku meremehkan conversion.</p>""",
"formulas": [
{"math": r"\text{Drop-off}_t = N_t - N_{t+1} \quad;\quad \text{Drop-off \%}_t = 1 - CR_{t \to t+1}",
"symbols": [
"Drop-off absolut (orang): untuk sizing masalah — &lsquo;6.800 orang hilang&rsquo; menggerakkan tim",
"Drop-off % : untuk prioritas — tahap dengan % terbesar = bocor terbesar",
"Time-to-convert: median hari dari tahap t ke t+1 (pakai median karena ada yang convert 1 jam, ada yang 90 hari)",
]},
],
"intuisi": "Funnel agregat itu seperti <strong>foto grup</strong>: semua orang terlihat, tidak ada yang jelas. Funnel per segmen = <strong>foto close-up</strong>: baru kelihatan siapa yang tersenyum dan siapa yang mengantuk. Selalu pecah funnel minimal per channel akuisisi — channel diskon vs organik conversion-nya beda dunia.",
"kapan": "Untuk diagnosis &lsquo;di mana hilangnya&rsquo; dan &lsquo;berapa lama mereka mikir&rsquo;. Selalu dengan jendela waktu eksplisit.",
"worked": {"title": "📐 Contoh: Time-to-convert checkout (klik untuk buka)",
"body": """<p>Data 1.000 checkout: 600 convert &lt; 1 hari, 250 convert 1–7 hari, 100 convert 8–30 hari, 50 convert &gt; 30 hari.</p>
<p><strong>Median</strong> time-to-convert ≈ <strong>1 hari</strong> (600 dari 1.000 sudah convert di hari pertama). <strong>Mean</strong> ≈ 6,5 hari — ditarik 50 orang yang mikir 60 hari.</p>
<p>Implikasi: jendela atribusi 7 hari menangkap 850/1.000 = 85%. Email reminder &ldquo;lupa checkout&rdquo; paling efektif dikirim di <strong>hari ke-2</strong> (menangkap 250 yang masih hangat), bukan hari ke-7.</p>"""},
"charts": [
{"data": """[{x: ["Organik", "Iklan search", "Iklan sosmed", "Influencer", "Diskon agregator"], y: [0.32, 0.28, 0.15, 0.12, 0.06], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#e8a838","#e8a838","#ef4444"]}, text: ["32%","28%","15%","12%","6%"], textposition: "outside"}]""",
"title": "Conversion daftar → beli per channel (jendela 30 hari)",
"layout": """{yaxis: {title: "Conversion"}, xaxis: {title: "Channel akuisisi"}, showlegend: false}""",
"cara": "Sumbu X = channel tempat user pertama datang, tinggi batang = % yang akhirnya beli dalam 30 hari. Warna menandai tier kualitas.",
"interpretasi": "Organik &amp; search (28–32%) 5x lipat dari diskon agregator (6%). Funnel agregat (mis. 18%) menyembunyikan ini — dan budget yang &lsquo;rata-rata&rsquo; akan over-invest di channel sampah. Keputusan: potong agregator, tambah search."},
],
},
{
"id": "cohort", "toc": "Cohort Retention",
"title": "Cohort Retention — Satu Angka Berbohong, Tabel Berkata Jujur",
"body": """<p><strong>Definisi.</strong> <strong>Cohort</strong> = sekelompok pengguna yang &ldquo;lahir&rdquo; bersamaan (biasanya bulan install/daftar). <strong>Retention table</strong> = % cohort yang masih aktif di bulan ke-0, 1, 2, … <strong>Kurva retensi</strong> menurun curam di awal lalu <strong>melandai</strong> (<em>flatten</em>) — titik landai = <em>core retained users</em>, pengguna yang benar-benar tinggal.</p>
<p>Metrik: <strong>N-day retention</strong> (masih aktif tepat di hari ke-N), <strong>rolling retention</strong> (pernah aktif dalam N hari terakhir — lebih longgar), <strong>retention berulang</strong> (brazil: Day 1, Day 7, Day 30 — standar industri aplikasi).</p>""",
"formulas": [
{"math": r"R_{c,m} = \frac{\text{aktif dari cohort } c \text{ di bulan } m}{\text{ukuran cohort } c}",
"symbols": [
"<Tex math={String.raw`R_{c,m}`} />: retention cohort c pada bulan ke-m (m=0 selalu 100%)",
"Ukuran cohort: jumlah user cohort itu di awal — retention selalu dibagi ini, bukan dibagi total user aktif",
"Bandingkan R antar cohort di m yang SAMA (bulan ke-3 vs bulan ke-3), bukan bulan kalender yang beda",
]},
],
"intuisi": "Cohort table seperti <strong>rapor per angkatan</strong>: angkatan 2020 vs 2024 nilainya bisa beda jauh walau &lsquo;rata-rata sekolah&rsquo; stabil. Kalau angkatan baru makin buruk, sekolahnya (produkmu) yang bermasalah — bukan muridnya.",
"kapan": "Setiap ada klaim &lsquo;retention naik/turun&rsquo; — pecah per cohort dulu. Juga untuk menilai kualitas channel (cohort diskon vs organik).",
"worked": {"title": "📐 Contoh: Membaca cohort table SehatQ (klik untuk buka)",
"body": """<p>Cohort Jan: 100% → 55% → 48% → 45% (melandai di ~45%). Cohort Jun: 100% → 30% → 20% → 18% (melandai di ~18%).</p>
<p><strong>Baca:</strong> (1) Keduanya melandai — bagus, ada core users. (2) Level landai Jun (18%) jauh di bawah Jan (45%) — kualitas pengguna baru memburuk. (3) &ldquo;Rata-rata 40%&rdquo; CEO = rata-rata berbobot yang didominasi cohort lama yang besar.</p>
<p><strong>Tindakan:</strong> bukan tambah user (memperbesar masalah), tapi perbaiki minggu pertama cohort baru — di sanalah 70%→30% terjadi.</p>"""},
"charts": [
{"data": """[{z: [[100,55,48,45],[100,48,40,37],[100,38,30,27],[100,30,20,18]], x: ["M0","M1","M2","M3"], y: ["Cohort Jan","Cohort Mar","Cohort Mei","Cohort Jun"], type: "heatmap", colorscale: [[0,"#fee2e2"],[0.5,"#e8a838"],[1,"#2a7de1"]], text: [["100%","55%","48%","45%"],["100%","48%","40%","37%"],["100%","38%","30%","27%"],["100%","30%","20%","18%"]], texttemplate: "%{text}", showscale: false}]""",
"title": "Cohort retention heatmap SehatQ",
"layout": """{xaxis: {title: "Bulan sejak install"}, yaxis: {title: ""}}""",
"cara": "Baris = cohort (kapan install), kolom = umur cohort (bulan ke-0 s.d. 3). Warna biru = retensi tinggi, merah = rendah. Baca horizontal = perjalanan satu cohort; baca vertikal (kolom M3) = bandingkan kualitas antar cohort.",
"interpretasi": "Pola jelas: makin ke bawah (cohort makin baru), warna makin merah di kolom M3 — 45% → 37% → 27% → 18%. <strong>Kualitas memburuk sistematis.</strong> Satu angka &lsquo;40%&rsquo; tidak pernah menunjukkan ini. Inilah kenapa cohort table adalah senjata utama analis retensi."},
],
},
{
"id": "rfm", "toc": "Segmentasi RFM",
"title": "RFM — Tiga Angka yang Mengenal Pelangganmu",
"body": """<p><strong>Definisi.</strong> <strong>RFM</strong> menilai pelanggan dari tiga dimensi: <strong>Recency</strong> (kapan terakhir beli — makin baru makin baik), <strong>Frequency</strong> (berapa sering beli), <strong>Monetary</strong> (total belanja). Tiap dimensi di-skor 1–5 (kuintil), menghasilkan 125 kombinasi yang dipetakan ke segmen aksi: <strong>Champions</strong> (555), <strong>Loyal</strong>, <strong>Potential Loyalist</strong>, <strong>At Risk</strong> (baru-baru ini berhenti), <strong>Hibernating</strong>, <strong>Lost</strong>.</p>
<p>RFM itu <strong>deskriptif &amp; sederhana</strong> — kekuatannya: bisa dihitung dengan SQL, dimengerti tim marketing, dan langsung jadi aksi (kirim apa ke siapa). Kelemahannya: tidak melihat <em>tren</em> (R=5 tapi F menurun = bahaya yang tidak tertangkap).</p>""",
"formulas": [],
"intuisi": "RFM seperti <strong>rapor kesehatan 3 panel</strong>: kapan terakhir olahraga (R), seberapa rutin (F), seberapa intens (M). Satu angka &lsquo;total belanja&rsquo; tidak bisa bedakan pelanggan setia yang baru cuti vs pelanggan yang sudah pindah ke kompetitor — RFM bisa.",
"kapan": "Segmentasi cepat untuk kampanye (siapa dikirimi promo win-back?), prioritas CS, dan dasar sebelum clustering canggih (MK4).",
"worked": {"title": "📐 Contoh: Dari skor ke aksi (klik untuk buka)",
"body": """<p>Pelanggan A: R=5, F=5, M=5 → <strong>Champions</strong> — aksi: program referral, early access. Jangan kirimi diskon besar (mereka beli tanpa diskon!).</p>
<p>Pelanggan B: R=2, F=5, M=4 → <strong>At Risk</strong> — dulu rajin, sekarang hilang. Aksi: win-back personal (&ldquo;kami kangen&rdquo; + insentif), BUKAN blast promo generik.</p>
<p>Pelanggan C: R=5, F=1, M=1 → <strong>New</strong> — aksi: onboarding, edukasi produk, bukan upsell agresif.</p>
<p>Aturan: <strong>aksi mengikuti segmen</strong>, bukan sebaliknya. Blast promo yang sama ke Champions (margin bocor) dan Lost (uang terbuang) = dua kerugian sekaligus.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,1,2,3,4,5], y: [1,1,2,2,3,4,4,5,5,3], mode: "markers+text", text: ["Lost","Hibernating","","","At Risk","New","","Potential","Loyal","Champions"], textposition: "top center", marker: {size: [12,14,12,16,18,12,12,14,16,22], color: ["#94a3b8","#94a3b8","#94a3b8","#e8a838","#e8a838","#2a7de1","#2a7de1","#2a7de1","#2a7de1","#16a34a"]}}]""",
"title": "Peta RFM: Recency vs Frequency (ukuran = Monetary)",
"layout": """{xaxis: {title: "Recency score (1=lama, 5=baru)"}, yaxis: {title: "Frequency score (1=jarang, 5=sering)"}, showlegend: false}""",
"cara": "Sumbu X = skor recency, Y = skor frequency, ukuran titik = monetary. Titik hijau besar di kanan atas = Champions; abu-abu kiri bawah = Lost.",
"interpretasi": "Segmen mengelompok alami: Champions (kanan atas, besar), At Risk (kiri atas — dulu sering, sekarang hilang), Lost (kiri bawah). Peta ini = daftar target kampanye: At Risk butuh win-back <em>sekarang</em> (masih hangat), Lost butuh insentif besar atau dilepas."},
],
},
],
"myths": [
{"t": "Cukup laporkan retention rata-rata — satu angka, gampang.",
"benar": "Rata-rata <strong>mencampur cohort bagus (lama) dengan cohort buruk (baru)</strong> dan menyembunyikan tren. Kasus SehatQ: rata-rata 40% menutupi cohort baru yang 18%. Aturan: tidak ada metrik retensi tanpa pecahan cohort — minimal bandingkan 3 cohort terakhir di umur yang sama."},
{"t": "Skor RFM sekali hitung berlaku selamanya.",
"benar": "RFM adalah <strong>foto</strong>, bukan film. Pelanggan At Risk bulan ini bisa jadi Lost bulan depan. Hitung ulang tiap bulan (atau tiap kampanye), dan waspadai tren: R=5 tapi F turun 3 bulan beruntun = early warning yang tidak tertangkap skor statis."},
],
"tips": [
"<strong>Bandingkan cohort di umur yang sama.</strong> Cohort Jan bulan ke-3 vs cohort Jun bulan ke-3 — bukan Jan-M3 vs Jun-M1. Membandingkan umur beda = membandingkan apel dengan bibit apel.",
"<strong>RFM terbaik dipakai untuk memutuskan siapa TIDAK dikirimi promo.</strong> Champions tidak butuh diskon (margin bocor), Lost tidak merespons (uang terbuang). Penghematan terbesar RFM sering dari <em>tidak</em> mengirim, bukan dari mengirim.",
],
"labs": [
{"heading": "Bangun Cohort Table dari Nol",
"intro": "Data transaksi sintetis 6 cohort. Hitung retention per cohort per bulan dan temukan: cohort mana yang bermasalah?",
"title": "Lab 1 — Cohort Retention Table",
"hint": "Coba ubah pola belanja cohort 'jun' (mis. hilangkan repeat) — lihat kolom M3-nya memerah. Itulah yang dirasakan SehatQ.",
"code": """import random
random.seed(42)

# transaksi sintetis: {cohort: [user_id...]}, tiap user belanja di bulan 0..3 dgn prob tertentu
cohorts = {"jan": 200, "mar": 250, "mei": 300, "jun": 350}
prob = {"jan": [1.0, .55, .48, .45], "mar": [1.0, .48, .40, .37],
        "mei": [1.0, .38, .30, .27], "jun": [1.0, .30, .20, .18]}

print(f"{'cohort':<8}" + "".join(f"{'M'+str(m):>7}" for m in range(4)))
for c, n in cohorts.items():
    baris = []
    for m in range(4):
        aktif = sum(1 for _ in range(n) if random.random() < prob[c][m])
        baris.append(f"{aktif/n:>6.0%}")
    print(f"{c:<8}" + "".join(baris))

print("\\nBandingkan kolom M3: jan 45% vs jun 18% -> kualitas cohort baru jatuh.")
print("Satu angka rata-rata akan menyembunyikan ini.")
"""},
{"heading": "RFM Scoring + Segmentasi",
"intro": "Dari data transaksi, hitung skor R/F/M (kuintil 1–5), petakan ke segmen, dan lihat distribusi pelangganmu.",
"title": "Lab 2 — Kalkulator RFM",
"hint": "Ubah data: buat satu pelanggan yang dulu rajin lalu berhenti (R besar hari, F besar). Lihat ia jatuh ke 'At Risk' — target win-back terbaik.",
"code": """from datetime import date
# (nama, tgl_terakhir_beli, jumlah_transaksi, total_belanja_jt)
data = [
    ("Ani",  date(2026,10,10), 24, 18.5),
    ("Budi", date(2026,10,8),  20, 12.0),
    ("Cici", date(2026,6,15),  22, 15.0),
    ("Dodi", date(2026,10,11), 2,  0.8),
    ("Eka",  date(2025,12,1),  15, 9.0),
    ("Fajar",date(2026,10,9),  8,  3.2),
]
hari_ini = date(2026, 10, 13)

def kuintil(vals, terbaik_besar=True):
    s = sorted(vals)
    n = len(s)
    out = []
    for v in vals:
        r = s.index(v) / max(n - 1, 1)
        skor = 1 + int(r * 4.99)
        out.append(skor if terbaik_besar else 6 - skor)
    return out

rec = [(hari_ini - d).days for _, d, _, _ in data]
fre = [f for _, _, f, _ in data]
mon = [m for _, _, _, m in data]
Rs, Fs, Ms = kuintil(rec, False), kuintil(fre, True), kuintil(mon, True)

def segmen(r, f, m):
    if (r, f) == (5, 5) or (r >= 4 and f >= 4 and m >= 4): return "Champions"
    if r <= 2 and f >= 4: return "At Risk"
    if r <= 2 and f <= 2: return "Lost"
    if r == 5 and f <= 2: return "New"
    if r >= 4 and f >= 3: return "Loyal"
    return "Potential"

print(f"{'nama':<7}{'R':>3}{'F':>3}{'M':>3}  segmen")
for (nama, _, _, _), r, f, m in zip(data, Rs, Fs, Ms):
    print(f"{nama:<7}{r:>3}{f:>3}{m:>3}  {segmen(r,f,m)}")
"""},
],
"decisions": [
{"kondisi": "Pertanyaan: 'di mana user hilang?'", "pakai": "Funnel per segmen",
"alasan": "Butuh lokasi bocor + sizing masalah per tahap.",
"contoh": "Funnel checkout per device: mobile drop 70% di pembayaran → perbaiki UX mobile."},
{"kondisi": "Pertanyaan: 'apakah produk makin bagus mempertahankan user?'", "pakai": "Cohort retention table",
"alasan": "Satu-satunya cara jujur melihat tren kualitas dari waktu ke waktu.",
"contoh": "Bandingkan M3 tiga cohort terakhir tiap sprint release."},
{"kondisi": "Pertanyaan: 'siapa dikirimi promo apa?'", "pakai": "RFM",
"alasan": "Cepat, bisa SQL, langsung jadi daftar target + pesan yang sesuai.",
"contoh": "At Risk → win-back; Champions → referral; Lost → dilepas/supresi."},
{"kondisi": "Butuh jawaban dalam 1 hari, data warehouse rapi", "pakai": "Ketiganya berurutan: funnel → cohort → RFM",
"alasan": "Funnel menemukan di mana, cohort menemukan kapan memburuk, RFM menemukan siapa yang diselamatkan.",
"contoh": "Playbook diagnosis standar tiap ada anomali metrik."},
],
"rule10": "<ol><li><strong>Tidak ada metrik tanpa pecahan:</strong> per channel / per cohort / per segmen.</li><li><strong>Bandingkan umur yang sama</strong> (M3 vs M3).</li><li><strong>RFM = daftar aksi</strong>, bukan sekadar label.</li></ol>",
"case": {"toc": "Mini-Case: 5% Champions, 40% Revenue",
"title": "5% Champions, 40% Revenue",
"body": """<p>E-commerce fashion: retention D30 agregat <strong>12%</strong> (terlihat buruk). RFM menemukan: <strong>5% pelanggan (Champions) menyumbang 40% revenue</strong>; 30% adalah &ldquo;Lost&rdquo; (beli sekali saat diskon 70%, tidak pernah kembali); cohort diskon retensi M3-nya 8% vs organik 31%.</p>""",
"q": "(a) Apakah retention 12% berarti produk gagal? (b) Tiga aksi prioritas bulan depan? (c) Apa yang harus DIHENTIKAN?",
"pembahasan": """<p>(a) <strong>Tidak serta-merta.</strong> 12% agregat mencampur organik (31%) dengan pemburu diskon (8%). Produk inti sehat untuk segmen yang tepat; masalahnya di <strong>kualitas akuisisi</strong>, bukan (hanya) produk.</p>
<p>(b) <strong>Tiga aksi:</strong> (1) lindungi Champions — early access koleksi baru + referral reward (mereka 40% revenue!); (2) win-back At Risk organik sebelum jadi Lost; (3) perbaiki onboarding 7 hari pertama (di sanalah cohort baru gugur).</p>
<p>(c) <strong>Hentikan diskon 70% blast ke semua orang.</strong> Ia mencetak &ldquo;pelanggan&rdquo; Lost yang merusak retention agregat, menggerus margin, dan menutupi sinyal produk. Ganti dengan diskon tersegmentasi (hanya New/At Risk organik).</p>"""},
"quiz": [
{"q": "Cohort Jan M3 = 45%, cohort Jun M3 = 18%, rata-rata = 40%. Kesimpulan tepat?",
"options": ["Retention stabil 40%, aman", "Kualitas cohort baru memburuk sistematis — investigasi onboarding/channel Jun", "Hapus cohort Jun dari laporan", "Naikkan budget akuisisi"], "correct": 1,
"why": "Benar: bandingkan umur yang sama (M3 vs M3) — tren turun 45%→18% = sinyal masalah. Rata-rata 40% didominasi cohort lama yang besar dan menyembunyikan ini."},
{"q": "Pelanggan: terakhir beli 120 hari lalu, dulu 22x transaksi, total Rp15jt. Segmen RFM?",
"options": ["Champions", "At Risk", "New", "Loyal"], "correct": 1,
"why": "Benar: R rendah (lama tidak beli) + F/M tinggi (dulu rajin & besar) = At Risk. Ini target win-back paling berharga — jangan perlakukan seperti Lost."},
{"q": "Time-to-convert checkout: median 1 hari, mean 6,5 hari. Email reminder paling efektif dikirim kapan?",
"options": ["Hari ke-7", "Hari ke-2", "Hari ke-30", "Tidak perlu reminder"], "correct": 1,
"why": "Benar: median 1 hari → mayoritas memutuskan cepat. Hari ke-2 menangkap yang masih hangat (1–7 hari). Mean 6,5 hari ditarik segelintir orang yang mikir lama — jangan patok timing ke mean."},
{"q": "Funnel agregat 18%, tapi per channel: organik 32%, agregator diskon 6%. Keputusan budget?",
"options": ["Naikkan semua channel proporsional", "Potong agregator, alihkan ke organik/search", "Fokus perbaiki funnel agregator", "Hentikan semua iklan"], "correct": 1,
"why": "Benar: funnel per segmen menunjukkan kualitas beda 5x. Budget mengikuti kualitas, bukan rata-rata. (Pengecualian: kalau agregator bisa diperbaiki murah — tapi datanya bilang tidak.)"},
{"q": "Kapan memakai rolling retention dibanding N-day retention?",
"options": ["Selalu — lebih ketat", "Untuk produk yang dipakai tidak tiap hari (e-commerce, travel)", "Tidak pernah", "Hanya untuk game"], "correct": 1,
"why": "Benar: N-day (tepat di hari ke-N) terlalu ketat untuk produk yang natural-nya dipakai mingguan/bulanan. Rolling ('pernah aktif dalam 30 hari') lebih adil untuk e-commerce/travel."},
],
"rangkum": [
"<strong>Funnel lanjutan</strong>: drop-off absolut (sizing) + relatif (prioritas) + time-to-convert (median!) + pecah per segmen/channel.",
"<strong>Cohort table</strong>: retention = aktif cohort c di bulan m / ukuran cohort c; bandingkan umur yang sama; waspadai rata-rata agregat.",
"<strong>Kurva retensi melandai</strong> = ada core users; level landai antar cohort = kualitas produk/channel dari waktu ke waktu.",
"<strong>RFM</strong>: skor 1–5 per Recency/Frequency/Monetary → Champions, Loyal, At Risk, Hibernating, Lost → aksi berbeda per segmen.",
"<strong>RFM juga untuk menahan diri</strong>: jangan kirim diskon ke Champions (margin bocor) atau ke Lost (uang terbuang).",
"<strong>Kapan TIDAK cukup deskriptif</strong>: saat butuh sebab-akibat (butuh eksperimen, MK9) atau prediksi individu (MK5/MK6).",
],
"prev": ["mk2-tracking", "MK2"],
"next": ["mk4-segmentasi", "MK4"],
},
]
