# Track 7 Bagian A — PM-A1..A10 (CFA L1 inti)
LESSONS = [
{
"slug": "pm-a1-ethics", "id": "PM-A1", "track": "Portfolio Management",
"title_html": "Ethics:<br/>Code, 7 Standards & GIPS",
"title_plain": "Ethics & Professional Standards: Code, 7 Standards, GIPS",
"chapter_summary": "Fondasi CFA: 6 komponen Code of Ethics, peta 7 Standards of Professional Conduct, cara mengidentifikasi pelanggaran pada vignette, dan pengantar GIPS untuk presentasi kinerja yang jujur. Lab klasifier standar & checker GIPS.",
"tujuan": [
"Menjelaskan 6 komponen Code of Ethics dan struktur 7 Standards.",
"Mengidentifikasi standar yang dilanggar pada skenario vignette umum.",
"Menjelaskan kewajiban dasar GIPS dan bedanya verification vs compliance.",
"Menerapkan framework pengambilan keputusan etis (identifikasi–evaluasi–konsultasi–dokumentasi).",
],
"story_title": "Cerita: Seminar di Bali",
"story": """<p><strong>Sari</strong>, manajer portofolio, diundang broker langganannya ke &ldquo;seminar&rdquo; 3 hari di Bali — hotel bintang 5, plus &ldquo;kenang-kenangan&rdquo; jam tangan mewah. Minggu depannya, broker itu meminta Sari mengarahkan lebih banyak order ke mereka. Sari berpikir: <em>&ldquo;Kan cuma hadiah relasi bisnis. Semua orang juga begitu.&rdquo;</em></p>
<p>Twist-nya: <strong>tidak ada yang dirugikan secara langsung</strong> — tapi objektivitas Sari kini bisa dipertanyakan. Standar CFA tidak menunggu ada korban: <strong>ancaman terhadap independensi</strong> saja sudah masalah. &ldquo;Semua orang begitu&rdquo; bukan pembelaan — justru itulah kenapa profesinya butuh standar tertulis. Lesson ini: peta 7 Standards agar kamu tidak jadi Sari berikutnya.</p>""",
"concepts": [
{
"id": "code", "toc": "Code of Ethics",
"title": "Code of Ethics — 6 Janji Profesional",
"body": """<p><strong>Definisi.</strong> <strong>Code of Ethics</strong> = 6 prinsip aspirasional yang dijanjikan setiap CFA charterholder: (1) bertindak dengan integritas, kompetensi, ketekunan, hormat &amp; etis; (2) menempatkan <strong>integritas profesi dan kepentingan klien di atas kepentingan pribadi</strong>; (3) memakai pertimbangan independen &amp; reasonable care; (4) berpraktik profesional &amp; mendorong orang lain juga; (5) mempromosikan <strong>integritas pasar</strong>; (6) <strong>menjaga &amp; meningkatkan kompetensi</strong> diri.</p>
<p>Bedakan: <strong>Code</strong> = aspirasi (&ldquo;jadilah begini&rdquo;); <strong>Standards</strong> = aturan yang bisa ditegakkan (&ldquo;jangan lakukan ini&rdquo;). Ujian CFA menguji Standards, tapi Code adalah kompasnya.</p>""",
"formulas": [],
"intuisi": "Code seperti <strong>sumpah dokter</strong> versi keuangan: bukan daftar larangan teknis, melainkan identitas — 'orang seperti kita tidak melakukan itu'. Standards adalah pasal-pasalnya.",
"kapan": "Setiap dilema: kembali ke 6 janji sebelum mencari pasal.",
"worked": {"title": "📐 Contoh: Uji 6 janji pada kasus Sari (klik untuk buka)",
"body": """<p><strong>Janji 2</strong> (kepentingan klien di atas pribadi): jam tangan = kepentingan pribadi Sari vs klien (order diarahkan bukan demi eksekusi terbaik). <strong>Gagal.</strong></p>
<p><strong>Janji 3</strong> (independen): hadiah mengancam objektivitas. <strong>Gagal.</strong></p>
<p><strong>Janji 5</strong> (integritas pasar): mengarahkan order demi hadiah merusak fair market. <strong>Gagal.</strong></p>
<p>Kesimpulan 30 detik: 3 dari 6 janji gagal → tolak hadiah, atau terima lalu <strong>ungkapkan tertulis</strong> ke employer &amp; klien dan pastikan tidak memengaruhi keputusan.</p>"""},
"charts": [],
},
{
"id": "standards", "toc": "Peta 7 Standards",
"title": "7 Standards — Peta yang Wajib Hafal",
"body": """<p><strong>Definisi.</strong> <strong>Standards of Professional Conduct</strong> = 7 kelompok aturan: <strong>I. Profesionalisme</strong> (A: Knowledge of Law, B: Independence &amp; Objectivity, C: Misrepresentation, D: Misconduct); <strong>II. Integritas Pasar Modal</strong> (A: Material Nonpublic Information, B: Market Manipulation); <strong>III. Kewajiban ke Klien</strong> (A: Loyalty/Prudence/Care, B: Fair Dealing, C: Suitability, D: Performance Presentation, E: Confidentiality); <strong>IV. Kewajiban ke Employer</strong> (A: Loyalty, B: Additional Compensation, C: Supervisors); <strong>V. Analisis Investasi</strong> (A: Diligence &amp; Reasonable Basis, B: Communication, C: Record Retention); <strong>VI. Conflicts of Interest</strong> (A: Disclosure, B: Priority of Transactions, C: Referral Fees); <strong>VII. Tanggung Jawab sebagai Anggota CFA</strong> (A: Conduct, B: Reference to CFA).</p>
<p><strong>Hierarki loyalitas</strong>: klien &gt; employer &gt; diri sendiri. Konflik klien vs employer → <strong>klien menang</strong> (III(A) mengalahkan IV(A)).</p>""",
"formulas": [],
"intuisi": "7 Standards seperti <strong>rambu lalu lintas profesi</strong>: I = SIM &amp; etika berkendara, II = jangan ugal-ugalan di jalan umum, III = utamakan penumpang, IV = hormati perusahaan taksi, V = pastikan mobil layak jalan, VI = jangan pasang tarif siluman, VII = jaga nama korps sopir.",
"kapan": "Vignette CFA: identifikasi dulu 'siapa dirugikan?' → petakan ke nomor standar.",
"worked": {"title": "📐 Contoh: 3 vignette kilat (klik untuk buka)",
"body": """<p><strong>(1)</strong> Analis tahu klien akan jual besar, ia jual duluan untuk akun pribadi → <strong>VI(B)</strong> Priority of Transactions (klien didahulukan!) + II(A) jika infonya material nonpublic.</p>
<p><strong>(2)</strong> Manajer mengklaim 'return 5 tahun 15% p.a.' padahal itu backtest hipotetis → <strong>I(C)</strong> Misrepresentation + III(D) Performance Presentation.</p>
<p><strong>(3)</strong> Supervisor tahu bawahannya melanggar tapi diam → <strong>IV(C)</strong> Responsibilities of Supervisors.</p>
<p>Pola: tanya <em>'informasi siapa?'</em> (II/III(E)), <em>'siapa didahulukan?'</em> (III/VI), <em>'jujur tidak klaimnya?'</em> (I(C)/V).</p>"""},
"charts": [
{"data": """[{x: ["I", "II", "III", "IV", "V", "VI", "VII"], y: [4, 2, 5, 3, 3, 3, 2], type: "bar", marker: {color: "#2a7de1"}, text: ["4","2","5","3","3","3","2"], textposition: "outside"}]""",
"title": "Jumlah sub-standard per Standard (I–VII)",
"layout": """{xaxis: {title: "Standard"}, yaxis: {title: "Sub-standard"}, showlegend: false}""",
"cara": "Tinggi batang = jumlah sub-standard (mis. III(A)–III(E) = 5).",
"interpretasi": "Standard III (klien) paling gemuk — 5 sub-standard: loyalitas, fair dealing, suitability, presentasi kinerja, kerahasiaan. Wajar: <strong>klien adalah pusat semesta CFA</strong>. Saat ragu di vignette, condongkan jawaban ke perlindungan klien."},
],
},
{
"id": "gips", "toc": "GIPS (Pengantar)",
"title": "GIPS — Iklan Kinerja yang Jujur",
"body": """<p><strong>Definisi.</strong> <strong>GIPS</strong> (<em>Global Investment Performance Standards</em>) = standar sukarela agar klaim kinerja antar-manajer <strong>fair, comparable &amp; fully disclosed</strong>. Kunci: <strong>composites</strong> (semua portofolio diskresioner dengan mandat serupa WAJIB masuk — tidak boleh cherry-pick pemenang), histori <strong>5 tahun → 10 tahun</strong>, total return, <strong>fees diungkapkan</strong> (gross vs net).</p>
<p><strong>Compliance vs verification</strong>: <em>compliance</em> = klaim manajer (&ldquo;kami patuh GIPS&rdquo;); <em>verification</em> = pihak ketiga memverifikasi <strong>proses</strong> klaim itu — <strong>bukan audit angka</strong> per portofolio. &ldquo;Terverifikasi&rdquo; ≠ &ldquo;angkanya benar&rdquo;.</p>""",
"formulas": [],
"intuisi": "GIPS seperti <strong>aturan timbangan di pasar</strong>: semua pedagang wajib pakai timbangan yang sama &amp; menunjukkan semua dagangannya (composite), bukan cuma yang segar. Verifikasi = petugas memeriksa timbangannya, bukan mencicipi buahnya.",
"kapan": "Setiap presentasi kinerja ke prospek: cek composite, periode, fees.",
"worked": {"title": "📐 Contoh: Presentasi yang melanggar (klik untuk buka)",
"body": """<p>Manajer mengklaim 'compliant GIPS' dengan brosur: hanya 3 tahun return, hanya portofolio terbaik, 'net of fees' tanpa definisi.</p>
<p><strong>Pelanggaran:</strong> (1) histori &lt; 5 tahun; (2) cherry-pick = bukan composite; (3) fee tidak dijelaskan. Klaim 'compliant' padahal tidak = juga melanggar <strong>III(D)</strong> &amp; <strong>I(C)</strong>.</p>
<p><strong>Perbaikan:</strong> sertakan SEMUA portofolio mandat-seupa 5 tahun, tampilkan gross &amp; net dengan definisi fee, beri benchmark yang sesuai.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Etika = patuhi hukum. Kalau legal, pasti etis.",
"benar": "Standar CFA <strong>lebih tinggi dari hukum</strong>. Contoh: menerima hadiah kecil dari broker mungkin legal, tapi melanggar I(B) jika mengancam objektivitas. Di vignette, 'tapi kan tidak melanggar hukum' adalah <strong>jawaban pengecoh klasik</strong> — yang diuji adalah standar, bukan KUHP."},
{"t": "'Terverifikasi GIPS' berarti angka kinerjanya sudah diaudit dan dijamin benar.",
"benar": "Verification hanya menguji <strong>proses &amp; klaim compliance</strong> di level perusahaan — bukan audit angka tiap portofolio. Manajer tetap bisa salah hitung. Jangan pakai 'verified' sebagai garansi return; pakai sebagai sinyal <strong>prosesnya serius</strong>."},
],
"tips": [
"<strong>Uji headline.</strong> Sebelum bertindak, tanya: 'nyaman tidak jika ini jadi headline berita besok?' Itu versi praktis dari <em>reasonable person test</em>. Jika perlu dirahasiakan, biasanya memang bermasalah.",
"<strong>Dokumentasikan dilema.</strong> Catat: fakta, standar yang relevan, siapa dikonsultasi, keputusan &amp; alasan. Dokumentasi = tameng saat keputusanmu dipertanyakan 2 tahun kemudian (dan memenuhi V(C) Record Retention).",
],
"labs": [
{"heading": "Klasifier Standar dari Skenario",
"intro": "Pilih skenario vignette — program memetakan ke standar yang dilanggar berdasar kata kunci.",
"title": "Lab 1 — Klasifier Standar",
"hint": "Tambahkan skenario sendiri ke dict SKENARIO (mis. 'menerima fee rahasia dari broker'). Kata kunci apa yang menangkapnya?",
"code": """# Klasifier sederhana: skenario -> standar yang (mungkin) dilanggar
STANDARDS = {
    "I(B)": ["hadiah", "hiburan", "objektivitas", "independen", "jam tangan", "mewah", "gratifikasi"],
    "II(A)": ["nonpublik", "orang dalam", "belum diumumkan", "tipping"],
    "III(A)": ["klien", "loyalitas", "kepentingan klien", "prudent"],
    "III(C)": ["suitability", "cocok", "profil risiko", "tujuan klien"],
    "VI(A)": ["konflik", "ungkapkan", "kepentingan pribadi"],
    "VI(B)": ["duluan", "pribadi", "front-running", "akun sendiri"],
    "I(C)": ["klaim", "melebih-lebihkan", "backtest", "menyesatkan"],
}
SKENARIO = {
    1: "Analis menerima jam tangan mewah dari broker lalu menaikkan rating sahamnya",
    2: "Manajer menjual saham untuk akun pribadi sebelum menjual untuk klien",
    3: "Brosur menampilkan return backtest seolah-olah return aktual",
    4: "Karyawan mendapat info merger yang belum diumumkan lalu membeli sahamnya",
}
def klasifikasi(teks):
    t = teks.lower()
    kena = [s for s, kws in STANDARDS.items() if any(k in t for k in kws)]
    return kena or ["(tidak terdeteksi - analisis manual)"]

for i, s in SKENARIO.items():
    print(f"{i}. {s[:60]}...")
    print(f"   -> Standar: {', '.join(klasifikasi(s))}\\n")
print("Catatan: alat bantu belajar, bukan nasihat hukum.")
"""},
{"heading": "Checker Kepatuhan GIPS",
"intro": "Periksa presentasi kinerja terhadap 5 syarat GIPS dasar.",
"title": "Lab 2 — Checker GIPS",
"hint": "Ubah 'tahun_histori' 3 -> 7 dan 'cherry_pick' True -> False. Lihat status berubah COMPLIANT.",
"code": """# Checker GIPS sederhana (5 syarat dasar)
presentasi = {
    "tahun_histori": 3,      # ubah sesukamu
    "cherry_pick": True,     # hanya portofolio terbaik?
    "total_return": True,    # pakai total return?
    "fee_diungkap": False,   # gross/net dijelaskan?
    "benchmark_sesuai": True,
}
syarat = [
    ("tahun_histori >= 5", presentasi["tahun_histori"] >= 5, "Histori min 5 thn (target 10)"),
    ("composite lengkap", not presentasi["cherry_pick"], "Semua portofolio mandat-seupa masuk"),
    ("total return", presentasi["total_return"], "Return harus total (dividen reinvested)"),
    ("fee disclosure", presentasi["fee_diungkap"], "Gross vs net harus dijelaskan"),
    ("benchmark sesuai", presentasi["benchmark_sesuai"], "Benchmark mencerminkan mandat"),
]
print("Hasil cek GIPS:")
lolos = True
for nama, ok, arti in syarat:
    print(f"  [{'OK' if ok else 'FAIL'}] {nama:<18} ({arti})")
    lolos = lolos and ok
print(f"\\nStatus: {'COMPLIANT' if lolos else 'TIDAK COMPLIANT - perbaiki yang FAIL'}")
"""},
],
"decisions": [
{"kondisi": "Menerima info material nonpublik", "pakai": "Jangan trading, jangan tipping; dorong disclosure publik",
"alasan": "II(A) — info milik publik, bukan milikmu.",
"contoh": "Tahu merger belum diumumkan: diam & tidak trading."},
{"kondisi": "Hadiah/hiburan dari pihak terkait", "pakai": "Tolak jika melebihi batas nominal; jika diterima, ungkapkan tertulis",
"alasan": "I(B) + VI(A) — objektivitas tidak boleh dibeli.",
"contoh": "Seminar Bali Sari: tolak jam tangan."},
{"kondisi": "Konflik klien vs employer", "pakai": "Dahulukan klien",
"alasan": "III(A) di atas IV(A) — hierarki loyalitas.",
"contoh": "Employer minta push produk sendiri yang tidak cocok: tolak."},
{"kondisi": "Kompensasi tambahan dari klien", "pakai": "Boleh, dengan persetujuan tertulis employer",
"alasan": "IV(B) — transparan, tidak mengganggu loyalitas.",
"contoh": "Fee konsultasi dari klien: lapor & minta izin."},
],
"rule10": "<ol><li><strong>Klien &gt; employer &gt; diri sendiri.</strong></li><li><strong>Uji headline</strong> sebelum bertindak.</li><li><strong>Ungkapkan konflik</strong> — tertulis.</li><li><strong>GIPS</strong>: composite, 5→10 thn, fee jelas.</li></ol>",
"case": {"toc": "Mini-Case: Jam Tangan Sari",
"title": "Jam Tangan Sari",
"body": """<p>Sari (fund manager) menerima jam tangan mewah + seminar Bali dari broker, lalu mengarahkan order ke broker itu. Tidak ada kerugian terukur ke klien.</p>""",
"q": "(a) Standar apa yang dilanggar? (b) 'Tidak ada yang dirugikan' — relevan? (c) Tindakan benar Sari sejak awal?",
"pembahasan": """<p>(a) <strong>I(B)</strong> Independence &amp; Objectivity (hadiah mengancam objektivitas), <strong>VI(A)</strong> Disclosure of Conflicts (tidak diungkapkan), potensial <strong>III(A)</strong> jika order bukan demi best execution klien.</p>
<p>(b) <strong>Tidak relevan.</strong> Standar menilai <em>ancaman</em> &amp; <em>proses</em>, bukan menunggu korban. 'Belum ada yang rugi' = pembelaan yang ditolak.</p>
<p>(c) <strong>Tolak</strong> hadiah mewah (atau kembalikan); seminar boleh jika bernilai edukasi wajar &amp; <strong>diungkapkan tertulis</strong> ke employer; keputusan order tetap by best execution, terdokumentasi.</p>"""},
"quiz": [
{"q": "Manajer menjual untuk akun pribadi sebelum order klien dieksekusi. Standar?",
"options": ["I(B) Independence", "VI(B) Priority of Transactions", "VII(A) Conduct", "V(A) Diligence"], "correct": 1,
"why": "Benar: VI(B) — transaksi klien harus didahulukan dari transaksi pribadi/employer. 'Duluan' untuk diri sendiri = pelanggaran klasik."},
{"q": "Konflik antara kepentingan klien dan employer. Siapa menang?",
"options": ["Employer — yang menggaji", "Klien — hierarki III(A) di atas IV(A)", "Diri sendiri", "Siapa yang lebih besar"], "correct": 1,
"why": "Benar: hierarki loyalitas CFA: klien &gt; employer &gt; diri sendiri. Employer tidak boleh memerintahkan hal yang merugikan klien."},
{"q": "Brosur 'compliant GIPS' menampilkan 3 tahun return portofolio terbaik saja. Masalah?",
"options": ["Tidak ada — kan return asli", "Cherry-pick (bukan composite) + histori &lt; 5 tahun", "Hanya masalah desain", "GIPS tidak mengatur brosur"], "correct": 1,
"why": "Benar: GIPS mewajibkan composite lengkap (semua portofolio mandat-seupa) dan histori 5 tahun. Klaim 'compliant' padahal tidak = juga I(C) misrepresentation."},
{"q": "'Terverifikasi GIPS' berarti?",
"options": ["Angka return diaudit & dijamin", "Pihak ketiga memverifikasi proses klaim compliance (bukan audit angka)", "Dijamin tidak rugi", "Sertifikasi pemerintah"], "correct": 1,
"why": "Benar: verification = uji proses di level perusahaan, bukan audit angka per portofolio. Sinyal proses serius, bukan garansi return."},
{"q": "Karyawan tahu merger belum diumumkan, lalu memberi tahu temannya agar membeli. Ini?",
"options": ["Boleh — kan bukan dia yang trading", "Pelanggaran II(A) — tipping info material nonpublik", "Boleh jika teman bukan klien", "Hanya pelanggaran jika profit"], "correct": 1,
"why": "Benar: II(A) melarang trading DAN tipping atas info material nonpublik. 'Cuma cerita' = tipping. Motif & profit tidak relevan."},
],
"rangkum": [
"<strong>Code</strong> = 6 janji aspirasional; <strong>Standards</strong> = 7 kelompok aturan yang ditegakkan.",
"<strong>Hierarki</strong>: klien &gt; employer &gt; diri sendiri.",
"<strong>Standar lebih tinggi dari hukum</strong> — 'legal' belum tentu 'patuh'.",
"<strong>GIPS</strong>: composite lengkap, histori 5→10 tahun, total return, fee diungkapkan; verification ≠ audit angka.",
"<strong>Framework dilema</strong>: identifikasi → evaluasi (uji headline) → konsultasi → dokumentasi.",
"<strong>Kapan TIDAK cukup 'niat baik'</strong>: tanpa disclosure tertulis &amp; dokumentasi.",
],
"prev": ["mk19-capstone", "MK19"],
"next": ["pm-a2-quant-methods", "PM-A2"],
},
{
"slug": "pm-a2-quant-methods", "id": "PM-A2", "track": "Portfolio Management",
"title_html": "Quant Methods:<br/>TVM, Statistik & Regresi Dasar",
"title_plain": "Quantitative Methods: TVM, Statistik, Probabilitas, Regresi",
"chapter_summary": "Matematika CFA: time value of money (PV/FV, anuitas, EAR, NPV/IRR), statistik deskriptif & probabilitas, distribusi normal & hypothesis testing, regresi OLS dasar, dan sekilas big data/fintech. Lab kalkulator TVM & simulator z-test.",
"tujuan": [
"Menghitung PV, FV, anuitas, dan EAR (termasuk keystroke BA II Plus).",
"Menjelaskan mean/median/modus, varians, korelasi, dan distribusi normal.",
"Melakukan langkah hypothesis testing (H0/Ha, test statistic, p-value, keputusan).",
"Menjelaskan intuisi regresi OLS, R², dan jebakan overfitting.",
],
"story_title": "Cerita: Rp1 Miliar Hari Ini atau Rp50 Juta/Tahun Selamanya?",
"story": """<p><strong>Dimas</strong> menang undian: pilih <strong>Rp1 miliar tunai</strong> atau <strong>Rp50 juta per tahun selamanya</strong>. Temannya bilang <em>&ldquo;ambil tahunan dong, selamanya!&rdquo;</em> Dimas ragu.</p>
<p>Twist-nya: dengan discount rate 8%, &ldquo;selamanya&rdquo; itu bernilai <strong>Rp625 juta hari ini</strong> (50jt/0,08) — <strong>kalah</strong> dari Rp1 miliar tunai! Uang punya <strong>nilai waktu</strong>: Rp1 hari ini ≠ Rp1 tahun depan. Kesalahan Dimas hampir saja = kesalahan investor yang tidak mendiskon arus kas masa depan. Lesson ini: TVM — fondasi semua valuasi (PM-B4 memakai ini untuk menilai seluruh perusahaan).</p>""",
"concepts": [
{
"id": "tvm", "toc": "Time Value of Money",
"title": "TVM — Uang Punya Nilai Waktu",
"body": """<p><strong>Definisi.</strong> <strong>FV = PV(1+r)^N</strong> (compounding); <strong>PV = FV/(1+r)^N</strong> (discounting). <strong>Anuitas</strong>: PV = PMT × [1 − (1+r)^−N]/r. <strong>Perpetuitas</strong>: PV = PMT/r. <strong>EAR</strong> = (1 + r/m)^m − 1 (bandingkan bunga beda frekuensi). <strong>NPV</strong> = Σ CF_t/(1+r)^t − investasi; terima jika NPV &gt; 0. <strong>IRR</strong> = r saat NPV = 0; terima jika IRR &gt; required return.</p>
<p><strong>BA II Plus</strong>: N, I/Y, PV, PMT, FV — isi 4, cari 1. Tanda: arus masuk (+), keluar (−).</p>""",
"formulas": [
{"math": r"FV = PV(1+r)^N \quad;\quad PV_{anuitas} = PMT \times \frac{1-(1+r)^{-N}}{r} \quad;\quad EAR = \left(1+\frac{r}{m}\right)^m - 1",
"symbols": [
"<Tex math={String.raw`r`} />: rate per periode (diskon/bunga)",
"<Tex math={String.raw`N`} />: jumlah periode",
"<Tex math={String.raw`PMT`} />: pembayaran per periode (anuitas)",
"<Tex math={String.raw`m`} />: frekuensi compounding per tahun",
]},
],
"intuisi": "TVM seperti <strong>mesin waktu untuk uang</strong>: compounding membawa uang ke masa depan (membesar), discounting membawanya ke hari ini (menyusut). Suku bunga = 'harga sewa' mesin waktu itu.",
"kapan": "Semua valuasi: obligasi (PM-A7), saham (PM-B4), proyek (PM-A5).",
"worked": {"title": "📐 Contoh: Undian Dimas (klik untuk buka)",
"body": """<p><strong>Opsi B</strong> = perpetuitas Rp50jt/thn, r = 8%: PV = 50.000.000/0,08 = <strong>Rp625jt</strong>.</p>
<p><strong>Opsi A</strong> = Rp1M tunai. <strong>A menang telak.</strong></p>
<p><strong>BA II Plus</strong> (cek anuitas 20 thn Rp50jt): N=20, I/Y=8, PMT=50.000.000, FV=0 → CPT PV = −Rp490.907.420. Tanda negatif = arus keluar jika kamu yang membayar.</p>"""},
"charts": [
{"data": """[{x: [0,5,10,15,20,25,30], y: [100,147,179,217,263,318,385], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "FV @8%"}, {x: [0,5,10,15,20,25,30], y: [100,68,46,32,21,15,10], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "PV @8%"}]""",
"title": "Rp100 tumbuh (FV) vs menyusut (PV) @ 8%",
"layout": """{xaxis: {title: "Tahun"}, yaxis: {title: "Rp"}, showlegend: true}""",
"cara": "Biru = Rp100 diinvestasikan (compounding); kuning = nilai hari ini dari Rp100 di masa depan (discounting).",
"interpretasi": "Compounding <strong>eksponensial</strong> — Rp100 jadi Rp385 dalam 30 tahun. Discounting kebalikannya: Rp100 tiga puluh tahun lagi cuma Rp10 hari ini. Inilah kenapa 'growth masa depan' saham harus didiskon berat — dan kenapa suku bunga adalah variabel terpenting valuasi."},
],
},
{
"id": "stat", "toc": "Statistik & Hypothesis Testing",
"title": "Statistik — Dari Rata-rata ke Keputusan",
"body": """<p><strong>Definisi.</strong> <strong>Mean</strong> (sensitif outlier) vs <strong>median</strong> (robust) vs <strong>modus</strong>. <strong>Varians/σ</strong> = sebaran; <strong>CV</strong> = σ/mean (bandingkan risiko relatif). <strong>Korelasi</strong> −1 s.d. +1 (arah &amp; kekuatan hubungan linear). <strong>Distribusi normal</strong>: 68-95-99,7% dalam 1-2-3 σ; <strong>z = (x−μ)/σ</strong>.</p>
<p><strong>Hypothesis testing</strong>: (1) H0 vs Ha; (2) pilih α (biasanya 5%); (3) hitung test statistic; (4) bandingkan dengan critical value / p-value; (5) tolak H0 jika |stat| &gt; kritis atau p &lt; α. <strong>Type I</strong> = tolak H0 yang benar (false alarm); <strong>Type II</strong> = gagal tolak H0 yang salah (miss).</p>""",
"formulas": [
{"math": r"z = \frac{\bar{x}-\mu_0}{s/\sqrt{n}} \quad;\quad \text{tolak } H_0 \text{ jika } |z| > 1{,}96 \ (\alpha=5\%)",
"symbols": [
"<Tex math={String.raw`\\bar{x}`} />: rata-rata sampel",
"<Tex math={String.raw`\\mu_0`} />: nilai hipotesis nol",
"<Tex math={String.raw`s/\\sqrt{n}`} />: standard error — makin besar n, makin presisi",
"1,96 = nilai kritis normal dua sisi pada α = 5%",
]},
],
"intuisi": "Hypothesis testing seperti <strong>sidang pengadilan</strong>: H0 = 'terdakwa tidak bersalah' (tidak ada efek). Bukti (data) harus cukup kuat (p &lt; 5%) untuk memvonis. Type I = menghukum orang tak bersalah; Type II = membebaskan yang bersalah.",
"kapan": "Uji klaim: 'manajer ini skill atau hoki?' (PM-C5), 'strategi ini beda dari benchmark?' (PM-D5).",
"worked": {"title": "📐 Contoh: Uji return manajer (klik untuk buka)",
"body": """<p>H0: return = 0 (tidak ada skill). Sampel: mean 1,2%/bln, s = 4%, n = 36.</p>
<p><strong>z</strong> = 1,2/(4/√36) = 1,2/0,667 = <strong>1,80</strong> &lt; 1,96 → <strong>gagal tolak H0</strong> pada 5%.</p>
<p>Artinya: <em>belum cukup bukti</em> ia skilled — bukan bukti ia tidak skilled! (Kegagalan menolak ≠ penerimaan H0.) Dengan n = 100: z = 3,0 → tolak. <strong>Sampel kecil = sulit membuktikan skill.</strong></p>"""},
"charts": [],
},
{
"id": "regresi", "toc": "Regresi Dasar & Big Data",
"title": "Regresi — Garis yang Menjelaskan",
"body": """<p><strong>Definisi.</strong> <strong>OLS</strong>: cari garis ŷ = b0 + b1x yang meminimalkan Σ residual². <strong>b1</strong> = kemiringan (efek x ke y); <strong>R²</strong> = % variasi y yang dijelaskan model (0–1). <strong>Asumsi klasik</strong>: linearitas, residual acak (homoskedastisitas), independen, normal (untuk inferensi).</p>
<p><strong>Big data (3V)</strong>: volume, velocity, variety — plus veracity. <strong>Fintech</strong>: robo-advisor, blockchain/DLT, crowdfunding. Jebakan: <strong>overfitting</strong> — model menghafal noise (R² tinggi di training, jeblok di data baru). → didalami di PM-B1 &amp; PM-B3.</p>""",
"formulas": [
{"math": r"\hat{y} = b_0 + b_1 x \quad;\quad b_1 = \frac{Cov(x,y)}{Var(x)} \quad;\quad R^2 = 1 - \frac{SSE}{SST}",
"symbols": [
"<Tex math={String.raw`b_1`} />: slope — naik 1 satuan x, y naik b1",
"<Tex math={String.raw`SSE`} />: sum of squared errors (yang diminimalkan OLS)",
"<Tex math={String.raw`SST`} />: total variasi y",
"R² = 0,8: 80% gerakan y 'dijelaskan' x (bukan berarti x menyebabkan y!)",
]},
],
"intuisi": "Regresi seperti <strong>menarik garis tren di awan titik</strong>: OLS mencari garis yang 'paling dekat' ke semua titik sekaligus (kuadrat = menghukum titik jauh ekstra). R² = seberapa rapat awannya di garis.",
"kapan": "Beta saham (PM-A10/PM-D3), forecasting (MK15), attribution (PM-C5).",
"worked": {"title": "📐 Contoh: Beta dari regresi (klik untuk buka)",
"body": """<p>Regresi return saham (y) vs return pasar (x): ŷ = 0,002 + 1,3x, R² = 0,65.</p>
<p><strong>b1 = 1,3 = beta</strong>: pasar naik 1%, saham naik ~1,3% (agresif). <strong>R² = 0,65</strong>: 65% gerakan saham dijelaskan pasar; 35% idiosinkratis.</p>
<p>Pratinjau PM-D3: regresi inilah mesin CAPM &amp; Fama-French.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Rata-rata (mean) selalu mewakili data. Median itu 'versi malas'.",
"benar": "Mean <strong>diseret outlier</strong>: return [5%, 6%, 4%, 5%, −80%] mean-nya −12% — tidak mewakili apa pun. Median (5%) robust. Untuk data return yang skew (banyak strategi!), <strong>laporkan keduanya</strong> atau pakai geometric mean."},
{"t": "p-value &lt; 5% berarti hipotesis alternatif 95% benar.",
"benar": "p-value = P(data seekstrem ini | H0 benar) — <strong>bukan</strong> P(Ha benar). p = 4% artinya: jika H0 benar, data seperti ini muncul 4% dari waktu. Itu saja. '95% yakin' adalah misinterpretasi paling umum di seluruh sains."},
],
"tips": [
"<strong>BA II Plus: tanda arus kas.</strong> Investasi (keluar) = negatif, terima = positif. Hasil negatif bukan 'rugi' — melainkan arah. 90% error TVM di ujian = salah tanda, bukan salah rumus.",
"<strong>Geometric mean untuk return multi-periode.</strong> Return +50% lalu −50% = rugi 25%, bukan 0%! Arithmetic mean (0%) berbohong; geometric (−13,4%) jujur. Untuk kinerja historis, selalu geometric.",
],
"labs": [
{"heading": "Kalkulator TVM Lengkap",
"intro": "Hitung FV, PV, anuitas, perpetuitas, dan EAR. Cek silang dengan BA II Plus.",
"title": "Lab 1 — Kalkulator TVM",
"hint": "Ubah FREQ 1 -> 12 (compounding bulanan). EAR naik — itulah harga 'bunga berbunga lebih sering'.",
"code": """# Kalkulator TVM
PV, R, N, PMT, FREQ = 1_000_000_000, 0.08, 20, 50_000_000, 1  # ubah sesukamu

fv = PV * (1 + R)**N
pv_ann = PMT * (1 - (1 + R)**(-N)) / R
pv_perp = PMT / R
ear = (1 + R/FREQ)**FREQ - 1

print(f"PV Rp{PV/1e9:.2f}M, r={R:.0%}, N={N}, PMT Rp{PMT/1e6:.0f}jt")
print(f"  FV lump sum   : Rp{fv/1e9:.3f} M")
print(f"  PV anuitas    : Rp{pv_ann/1e9:.3f} M")
print(f"  PV perpetuitas: Rp{pv_perp/1e9:.3f} M")
print(f"  EAR (m={FREQ})      : {ear:.4%}")
print("\\nUndian Dimas: perpetuitas Rp50jt @8% = Rp625jt < Rp1M tunai.")
print("Keputusan: ambil tunai!")
"""},
{"heading": "Simulator Z-Test",
"intro": "Bangkitkan dua sampel return, hitung z-stat, dan putuskan: skill atau noise?",
"title": "Lab 2 — Simulator Hypothesis Test",
"hint": "Ubah N 36 -> 144 (12 tahun data). z naik 2x lipat — bukti makin kuat dengan sampel besar.",
"code": """import random, math
random.seed(42)
# H0: mean return = 0. Sampel: mean 1.2%/bln, sd 4%
N, MU, SD = 36, 1.2, 4.0   # ubah N sesukamu
sampel = [random.gauss(MU, SD) for _ in range(N)]

xbar = sum(sampel)/N
s = math.sqrt(sum((x-xbar)**2 for x in sampel)/(N-1))
z = (xbar - 0) / (s/math.sqrt(N))
kritis = 1.96

print(f"n={N}, mean={xbar:.2f}%, s={s:.2f}%")
print(f"z-stat = {z:.2f}  (kritis 5% dua sisi: {kritis})")
print(f"Keputusan: {'TOLAK H0 - ada bukti skill' if abs(z) > kritis else 'GAGAL TOLAK H0 - belum terbukti skill'}")
print("\\nIngat: gagal tolak != H0 benar. Mungkin sampel kurang besar.")
"""},
],
"decisions": [
{"kondisi": "Bunga dikutip beda frekuensi", "pakai": "Bandingkan EAR, bukan nominal",
"alasan": "12% bulanan (EAR 12,68%) &gt; 12% tahunan. Nominal menipu.",
"contoh": "Pilih deposito/KTA termurah."},
{"kondisi": "Return multi-periode", "pakai": "Geometric mean",
"alasan": "Arithmetic mean melebih-lebihkan (volatility drag).",
"contoh": "+50%, −50% = −13,4% p.a., bukan 0%."},
{"kondisi": "Data skew / outlier", "pakai": "Median + mean; laporkan keduanya",
"alasan": "Mean terseret outlier.",
"contoh": "Gaji, return strategi berekor tebal."},
{"kondisi": "Klaim 'strategi mengalahkan pasar'", "pakai": "Hypothesis test (α=5%)",
"alasan": "Bedakan skill vs hoki secara formal.",
"contoh": "Uji alpha manajer (PM-C5)."},
],
"rule10": "<ol><li><strong>Diskon selalu</strong> — bandingkan dalam nilai hari ini.</li><li><strong>EAR</strong> untuk bandingkan bunga.</li><li><strong>Geometric</strong> untuk return multi-periode.</li><li><strong>p &lt; α</strong> baru tolak H0.</li></ol>",
"case": {"toc": "Mini-Case: Tawaran Pensiun Dini",
"title": "Tawaran Pensiun Dini",
"body": """<p>Pak Budi (55 thn) ditawari: <strong>Rp2M lump sum</strong> atau <strong>Rp15jt/bulan selama 20 tahun</strong>. Discount rate 7%/tahun.</p>""",
"q": "(a) Hitung PV anuitas (bulanan!). (b) Mana lebih baik? (c) Kapan jawaban berubah?",
"pembahasan": """<p>(a) <strong>Bulanan:</strong> r = 7%/12 = 0,5833%, N = 240. PV = 15jt × [1 − (1,005833)^−240]/0,005833 = 15jt × 129,33 = <strong>Rp1,94M</strong>.</p>
<p>(b) <strong>Lump sum Rp2M menang</strong> (tipis: +Rp60jt). Plus fleksibilitas &amp; warisan.</p>
<p>(c) Jika <strong>discount rate &lt; ~6,7%</strong> (mis. sangat konservatif) anuitas menang; jika Pak Budi yakin <strong>hidup &gt; 20 tahun</strong> (longevity risk!), anuitas = asuransi umur panjang — nilai non-finansial yang TVM tidak tangkap.</p>"""},
"quiz": [
{"q": "Rp50jt/tahun selamanya, discount 8%. PV?",
"options": ["Rp625 juta", "Rp1 miliar", "Rp400 juta", "Tidak terhingga"], "correct": 0,
"why": "Benar: perpetuitas PV = PMT/r = 50jt/0,08 = Rp625jt. 'Selamanya' terdengar besar, tapi discounting membuatnya terbatas."},
{"q": "Return +50% lalu −50%. Return tahunan yang jujur?",
"options": ["0% (rata-rata)", "−13,4% (geometric)", "+25%", "−25%"], "correct": 1,
"why": "Benar: (1,5×0,5)^0,5 − 1 = −13,4%. Modal Rp100 → Rp150 → Rp75. Arithmetic mean 0% berbohong; geometric mengikuti uangmu."},
{"q": "z-stat 1,80, α=5% dua sisi (kritis 1,96). Keputusan?",
"options": ["Tolak H0 — terbukti", "Gagal tolak H0 — belum cukup bukti", "Terima H0", "Ulangi dengan α=10%"], "correct": 1,
"why": "Benar: 1,80 &lt; 1,96 → gagal tolak. 'Gagal tolak' ≠ 'H0 benar' — mungkin sampel kurang besar (dengan n=100, z=3,0 → tolak)."},
{"q": "Regresi return saham vs pasar: slope 1,3, R² 0,65. Artinya?",
"options": ["Beta 1,3; 65% gerakan dijelaskan pasar", "Alpha 1,3", "Korelasi 0,65", "Saham naik 65%"], "correct": 0,
"why": "Benar: slope = beta (agresif, &gt;1); R² = explanatory power. 35% sisanya = risiko idiosinkratis (bisa didiversifikasi)."},
{"q": "p-value = 0,03. Interpretasi benar?",
"options": ["95% yakin Ha benar", "Jika H0 benar, data seekstrem ini muncul 3% dari waktu", "H0 3% benar", "Efeknya besar"], "correct": 1,
"why": "Benar: p-value = probabilitas data (atau lebih ekstrem) dengan asumsi H0 benar. Bukan probabilitas hipotesis benar, bukan ukuran efek."},
],
"rangkum": [
"<strong>TVM</strong>: FV = PV(1+r)^N; anuitas; perpetuitas PMT/r; EAR; NPV &gt; 0 terima; IRR &gt; hurdle terima.",
"<strong>Statistik</strong>: mean vs median (outlier!); σ; korelasi; z = (x−μ)/σ; 68-95-99,7.",
"<strong>Hypothesis test</strong>: H0/Ha → α → statistik → bandingkan; Type I = false alarm, Type II = miss.",
"<strong>Regresi OLS</strong>: ŷ = b0+b1x; b1 = Cov/Var; R² = explanatory power (bukan kausalitas!).",
"<strong>Big data 3V</strong> + waspada <strong>overfitting</strong>.",
"<strong>Kapan TIDAK pakai mean</strong>: data skew — pakai median/geometric.",
],
"prev": ["pm-a1-ethics", "PM-A1"],
"next": ["pm-a3-economics", "PM-A3"],
},
{
"slug": "pm-a3-economics", "id": "PM-A3", "track": "Portfolio Management",
"title_html": "Economics:<br/>Mikro, Makro & FX",
"title_plain": "Economics: Micro, Macro, Monetary/Fiscal, Trade & FX",
"chapter_summary": "Ekonomi untuk investor: demand-supply & struktur pasar, GDP/inflasi/pengangguran & siklus bisnis, kebijakan moneter & fiskal, keunggulan komparatif, dan rezim nilai tukar. Lab kalkulator GDP/inflasi & cross-rate FX.",
"tujuan": [
"Menjelaskan keseimbangan demand-supply dan 4 struktur pasar.",
"Menghitung GDP (expenditure approach) dan inflasi (CPI).",
"Membedakan kebijakan moneter vs fiskal dan transmisinya ke pasar.",
"Menjelaskan apresiasi/depresiasi dan menghitung cross-rate.",
],
"story_title": "Cerita: Kenapa Kopi Naik Saat Rupiah Melemah?",
"story": """<p><strong>Bu Ratna</strong> punya warung kopi. Tahun ini harga biji kopi naik 20% — padahal panen bagus. Ia menyalahkan tengkulak. Analis muda menjelaskan: <strong>kopi diperdagangkan dalam USD</strong>; rupiah melemah 15% terhadap USD tahun ini. Harga global tetap — yang berubah adalah <strong>nilai tukar</strong>.</p>
<p>Twist-nya: Bu Ratna lalu bertanya <em>&ldquo;kenapa rupiah melemah?&rdquo;</em> — dan jawabannya merambat: suku bunga AS naik → modal keluar → rupiah tertekan → <strong>Bank Indonesia menaikkan suku bunga</strong> → kredit warungnya ikut mahal. Satu keputusan The Fed mengguncang warung kopi di Makassar. <strong>Makroekonomi bukan teori jauh — ia harga kopimu.</strong> Lesson ini: rantai sebab-akibat itu.</p>""",
"concepts": [
{
"id": "mikro", "toc": "Mikro: Pasar & Struktur",
"title": "Mikro — Demand, Supply & Struktur Pasar",
"body": """<p><strong>Definisi.</strong> <strong>Harga keseimbangan</strong>: demand = supply. <strong>Elastisitas</strong> (ingat MK14!): demand elastis → produsen tidak bisa menaikkan harga. <strong>Struktur pasar</strong>: <em>perfect competition</em> (banyak penjual, produk homogen, price taker — mis. beras), <em>monopolistic competition</em> (banyak, diferensiasi — warung kopi), <em>oligopoli</em> (sedikit penjual — semen, telekomunikasi), <em>monopoli</em> (satu penjual, price maker — PLN).</p>
<p>Implikasi investasi: <strong>pricing power</strong> (monopoli/oligopoli) = margin defensif = valuasi premium. Perfect competition = margin tipis selamanya.</p>""",
"formulas": [],
"intuisi": "Struktur pasar seperti <strong>lapangan permainan</strong>: perfect competition = pasar becek (semua jual sama, untung tipis); monopoli = punya kunci stadion (tentukan harga sendiri). Investor membayar mahal untuk 'kunci stadion' (moat).",
"kapan": "Analisis industri (Porter): siapa punya pricing power? → PM-B4 valuasi.",
"worked": {"title": "📐 Contoh: Dua emiten kopi (klik untuk buka)",
"body": """<p><strong>KopiCurah</strong> (perfect competition): 1.000 penjual, margin bersih 3%, ROE 8%. <strong>KopiBrand</strong> (monopolistic + brand kuat): margin 18%, ROE 25%.</p>
<p>Saat biaya biji naik 20%: KopiCurah <strong>tidak bisa</strong> menaikkan harga (pelanggan pindah) → margin → 0%. KopiBrand menaikkan 15% → margin 14%.</p>
<p><strong>Pelajaran:</strong> struktur pasar menentukan siapa yang selamat dari shock biaya. Screening saham: cari pricing power, bukan sekadar growth.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8,9,10], y: [10,9,8,7,6,5,4,3,2,1], type: "scatter", mode: "lines", line: {color: "#2a7de1"}, name: "demand"}, {x: [1,2,3,4,5,6,7,8,9,10], y: [1,2,3,4,5,6,7,8,9,10], type: "scatter", mode: "lines", line: {color: "#e8a838"}, name: "supply"}]""",
"title": "Keseimbangan demand-supply",
"layout": """{xaxis: {title: "Quantity"}, yaxis: {title: "Harga"}, showlegend: true}""",
"cara": "Biru turun = demand, kuning naik = supply. Titik potong = keseimbangan.",
"interpretasi": "Pajak/subsidi/cuaca <strong>menggeser</strong> kurva (bukan bergerak di sepanjangnya). Rupiah melemah = biaya impor naik = supply kopi <strong>bergeser kiri</strong> → harga naik walau panen bagus. Bedakan 'pergerakan' vs 'pergeseran' — 80% kesalahan analisis mikro."},
],
},
{
"id": "makro", "toc": "Makro & Kebijakan",
"title": "Makro — GDP, Siklus & Kebijakan",
"body": """<p><strong>Definisi.</strong> <strong>GDP = C + I + G + (X − M)</strong>. <strong>Inflasi</strong> (CPI): <Tex math={String.raw`\\pi = (CPI_t - CPI_{t-1})/CPI_{t-1}`} />. <strong>Pengangguran</strong>: frictional (cari kerja), structural (skill mismatch), cyclical (resesi). <strong>Siklus bisnis</strong>: ekspansi → puncak → kontraksi → lembah.</p>
<p><strong>Moneter</strong> (bank sentral): naikkan suku bunga → kredit mahal → demand turun → inflasi turun (tapi growth ikut turun). <strong>Fiskal</strong> (pemerintah): belanja naik/pajak turun → stimulus (tapi defisit &amp; utang naik).</p>""",
"formulas": [
{"math": r"GDP = C + I + G + (X-M) \quad;\quad \pi = \frac{CPI_t - CPI_{t-1}}{CPI_{t-1}}",
"symbols": [
"<Tex math={String.raw`C`} />: konsumsi rumah tangga (terbesar di Indonesia, ~55%)",
"<Tex math={String.raw`I`} />: investasi (PMTB)",
"<Tex math={String.raw`G`} />: belanja pemerintah",
"<Tex math={String.raw`X-M`} />: net ekspor",
]},
],
"intuisi": "Kebijakan moneter seperti <strong>keran air</strong>: BI memutar keran suku bunga — air (kredit) mengecil → mesin ekonomi melambat → 'panas' inflasi turun. Fiskal seperti <strong>pompa tambahan</strong>: pemerintah menyuntik belanja langsung ke kolam.",
"kapan": "Setiap keputusan alokasi: rezim suku bunga menentukan winners (bank vs properti vs obligasi).",
"worked": {"title": "📐 Contoh: Rantai The Fed → warung Bu Ratna (klik untuk buka)",
"body": """<p><strong>1.</strong> The Fed naikkan rate → yield US naik → modal keluar dari EM. <strong>2.</strong> Rupiah melemah 15% → harga kopi impor (USD) naik. <strong>3.</strong> BI naikkan BI-Rate → KTA/kredit warung mahal. <strong>4.</strong> Demand melemah → Bu Ratna tidak bisa fully pass-through harga.</p>
<p><strong>Margin terjepit dua sisi</strong>: biaya naik (FX) + demand turun (rate). Inilah <em>stagflationary pressure</em> versi warung kopi — dan alasan investor EM wajib paham kebijakan global.</p>"""},
"charts": [],
},
{
"id": "fx", "toc": "Perdagangan & FX",
"title": "Trade & FX — Keunggulan & Nilai Tukar",
"body": """<p><strong>Definisi.</strong> <strong>Keunggulan komparatif</strong> (Ricardo): berdaganglah yang <em>opportunity cost</em>-nya terendah — bukan yang paling efisien absolut. <strong>Hambatan dagang</strong>: tarif, kuota, subsidi. <strong>FX</strong>: <em>apresiasi</em> (mata uang menguat) vs <em>depresiasi</em>; rezim <em>fixed/managed float/free float</em> (Indonesia: managed float).</p>
<p><strong>Cross-rate</strong>: jika USD/IDR = 16.000 dan USD/JPY = 150, maka JPY/IDR = 16.000/150 = 106,67. <strong>Triangular arbitrage</strong>: jika cross-rate pasar ≠ hitungan → peluang arbitrase (hilang dalam milidetik di era algoritma).</p>""",
"formulas": [
{"math": r"S_{JPY/IDR} = \frac{S_{USD/IDR}}{S_{USD/JPY}}",
"symbols": [
"<Tex math={String.raw`S`} />: spot rate (konvensi: mata uang kedua per satu unit pertama)",
"Cross-rate = pembagian dua rate terhadap mata uang bersama",
"Arbitrase segitiga: eksekusi 3 konversi; profit jika hasil &gt; 1",
]},
],
"intuisi": "Cross-rate seperti <strong>kurs di money changer bertingkat</strong>: tidak ada papan JPY/IDR? Hitung via USD. Jika money changer A kasih rate beda dari hitunganmu → borong (arbitrase) — sebelum ia sadar.",
"kapan": "Eksposur FX emiten (PM-B7), hedging (PM-C9).",
"worked": {"title": "📐 Contoh: Cek arbitrase (klik untuk buka)",
"body": """<p>Pasar: USD/IDR 16.000, USD/JPY 150, JPY/IDR <strong>110</strong> (quote pasar).</p>
<p><strong>Hitungan:</strong> 16.000/150 = <strong>106,67</strong>. Pasar quote 110 → JPY <em>kemahalan</em> di pasar itu.</p>
<p><strong>Arbitrase:</strong> Rp16jt → USD1.000 → JPY150.000 → (jual @110) Rp16,5jt. <strong>Profit Rp500rb/putaran</strong> (minus spread/biaya). Di dunia nyata: spread &amp; latensi membunuh ini — tapi logikanya dipakai untuk <em>pricing</em> derivatif FX.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Inflasi selalu buruk. Bank sentral harus mematok 0%.",
"benar": "Deflasi (inflasi negatif) <strong>lebih berbahaya</strong>: konsumen menunda belanja (besok lebih murah) → demand collapse → spiral. Target BI ~2–4% = 'hangat sehat'. Investor justru takut <strong>deflasi Jepang 1990-an</strong>, bukan inflasi 4%."},
{"t": "Pelemahan rupiah selalu buruk untuk semua emiten Indonesia.",
"benar": "Eksportir (batubara, CPO) <strong>diuntungkan</strong>: pendapatan USD, biaya rupiah. Importir &amp; berutang USD menderita. Net effect = tergantung struktur. Analisis FX = per emiten, bukan per negara."},
],
"tips": [
"<strong>Ikuti rantai, bukan headline.</strong> 'BI naikkan suku bunga' → tanya: siapa menang (bank: NIM naik) vs kalah (properti: KPR mahal; obligasi: harga turun)? Satu kebijakan = peta winners/losers.",
"<strong>Bedakan nominal vs riil.</strong> GDP tumbuh 5% dengan inflasi 4% = riil ~1%. Upah naik 10% saat inflasi 8% = daya beli +2%. Semua keputusan investasi memakai angka <strong>riil</strong>.",
],
"labs": [
{"heading": "Kalkulator GDP & Inflasi",
"intro": "Hitung GDP via expenditure approach dan inflasi dari CPI. Ubah komponen — lihat kontribusinya.",
"title": "Lab 1 — Kalkulator Makro",
"hint": "Ubah NET_EKSPOR -50 -> +100 (surplus dagang). GDP naik — itulah kenapa pemerintah obses dengan ekspor.",
"code": """# Kalkulator GDP (expenditure) & inflasi CPI
C, I, G = 9500, 3200, 1400   # triliun Rp
NET_EKSPOR = -50             # ubah sesukamu
CPI_LALU, CPI_KINI = 108.5, 112.0

gdp = C + I + G + NET_EKSPOR
inflasi = (CPI_KINI - CPI_LALU) / CPI_LALU
print(f"GDP = {C}+{I}+{G}+({NET_EKSPOR}) = Rp{gdp:,.0f} T")
print(f"Kontribusi: C {C/gdp:.0%}, I {I/gdp:.0%}, G {G/gdp:.0%}, NX {NET_EKSPOR/gdp:.1%}")
print(f"Inflasi (CPI): {inflasi:.2%}")
print()
# GDP riil jika inflasi spt di atas dan GDP nominal tumbuh 9%
g_nom, g_riil = 0.09, (1.09)/(1+inflasi) - 1
print(f"GDP nominal +9%, inflasi {inflasi:.1%} -> GDP RIIL {g_riil:.1%}")
print("Selalu pakai angka riil untuk keputusan investasi!")
"""},
{"heading": "Kalkulator Cross-Rate FX",
"intro": "Hitung cross-rate dan deteksi peluang triangular arbitrage.",
"title": "Lab 2 — Kalkulator FX",
"hint": "Ubah QUOTE_PASAR 110 -> 106.67 (sesuai hitungan). Arbitrase hilang — pasar efisien!",
"code": """# Cross-rate & triangular arbitrage
USD_IDR = 16000
USD_JPY = 150
QUOTE_PASAR = 110   # JPY/IDR di money changer (ubah sesukamu)

hitung = USD_IDR / USD_JPY
print(f"Cross-rate hitungan JPY/IDR: {hitung:.2f}")
print(f"Quote pasar JPY/IDR       : {QUOTE_PASAR:.2f}")
print()
modal = 16_000_000  # Rp16jt
usd = modal / USD_IDR
jpy = usd * USD_JPY
kembali = jpy * QUOTE_PASAR
profit = kembali - modal
print(f"Rp{modal/1e6:.0f}jt -> USD{usd:,.0f} -> JPY{jpy:,.0f} -> Rp{kembali/1e6:.2f}jt")
print(f"Profit: Rp{profit:,.0f} ({profit/modal:.2%})")
print("Arbitrase!" if profit > 0 else "Tidak ada arbitrase (wajar - spread membunuh ini).")
"""},
],
"decisions": [
{"kondisi": "Suku bunga naik", "pakai": "Overweight bank (NIM), underweight properti & obligasi long-duration",
"alasan": "Transmisi moneter: kredit mahal, harga obligasi turun.",
"contoh": "Rotasi sektor saat BI hawkish."},
{"kondisi": "Rupiah melemah tajam", "pakai": "Cek eksposur FX per emiten; lindungi utang USD",
"alasan": "Eksportir menang, importir/berutang USD kalah.",
"contoh": "Hedging via forward (PM-C9)."},
{"kondisi": "Inflasi &gt; target", "pakai": "Aset riil (komoditas, properti); hindari cash & obligasi nominal",
"alasan": "Inflasi menggerus daya beli nominal.",
"contoh": "TIPS / obligasi link-inflasi."},
{"kondisi": "Resesi (kontraksi)", "pakai": "Defensif: consumer staples, kesehatan, obligasi pemerintah",
"alasan": "Earnings defensif + flight to quality.",
"contoh": "Rotasi ke akhir siklus."},
],
"rule10": "<ol><li><strong>Ikuti rantai</strong> kebijakan → sektor.</li><li><strong>Riil, bukan nominal.</strong></li><li><strong>FX per emiten</strong>, bukan per negara.</li><li><strong>Pricing power</strong> = moat.</li></ol>",
"case": {"toc": "Mini-Case: Warung Bu Ratna",
"title": "Warung Bu Ratna vs The Fed",
"body": """<p>Rupiah melemah 15% (kopi impor USD), BI menaikkan suku bunga, harga biji naik 20%. Bu Ratna (monopolistic competition — warung kopi diferensiasi rasa) ragu menaikkan harga.</p>""",
"q": "(a) Gambarkan rantai The Fed → warung. (b) Haruskah Bu Ratna menaikkan harga? (c) Pelajaran untuk investor?",
"pembahasan": """<p>(a) <strong>Fed hawkish → modal keluar → IDR melemah → biaya impor naik; BI ikut hawkish → kredit mahal → demand lemah.</strong> Jepitan dua sisi.</p>
<p>(b) <strong>Ya, sebagian</strong> — diferensiasi rasa = pricing power parsial (monopolistic competition). Naikkan 10–12% (tidak full 20%): jaga volume + lindungi margin. KopiCurah (perfect competition) tidak punya opsi ini.</p>
<p>(c) <strong>Makro = mikro yang diagregat.</strong> Setiap emiten punya 'Bu Ratna'-nya: petakan eksposur FX + sensitivitas suku bunga sebelum beli sahamnya.</p>"""},
"quiz": [
{"q": "GDP = C 9500 + I 3200 + G 1400 + NX (−50). GDP?",
"options": ["Rp14.050 T", "Rp14.150 T", "Rp13.100 T", "Rp14.100 T"], "correct": 0,
"why": "Benar: 9500+3200+1400−50 = 14.050. NX negatif (defisit dagang) mengurangi GDP — itulah obsesi pemerintah pada ekspor."},
{"q": "USD/IDR 16.000, USD/JPY 150. Cross-rate JPY/IDR?",
"options": ["106,67", "110", "2.400.000", "0,0094"], "correct": 0,
"why": "Benar: 16.000/150 = 106,67. Jika pasar quote 110 → ada mispricing (arbitrase sebelum spread)."},
{"q": "Bank sentral menaikkan suku bunga. Efek pertama ke pasar?",
"options": ["Saham properti naik", "Harga obligasi turun (yield naik)", "Rupiah pasti menguat", "Inflasi langsung turun"], "correct": 1,
"why": "Benar: harga obligasi ∝ 1/yield — yield naik → harga turun seketika. Efek ke inflasi butuh 12–18 bulan (lag transmisi)."},
{"q": "Rupiah melemah 15%. Emiten paling diuntungkan?",
"options": ["Maskapai (impor avtur)", "Eksportir batubara (pendapatan USD, biaya IDR)", "Ritel impor", "Emiten berutang USD"], "correct": 1,
"why": "Benar: pendapatan USD naik dalam rupiah, biaya tetap rupiah → margin mekar. Analisis FX harus per emiten."},
{"q": "Deflasi 2% vs inflasi 4%. Mana lebih ditakuti investor?",
"options": ["Inflasi 4%", "Deflasi 2% — memicu penundaan belanja & spiral", "Sama saja", "Tidak ada yang takut"], "correct": 1,
"why": "Benar: deflasi = konsumen menunggu (besok lebih murah) → demand collapse. Jepang 1990-an = trauma deflasi. Target sehat ~2–4%."},
],
"rangkum": [
"<strong>Mikro</strong>: keseimbangan demand-supply; struktur pasar → pricing power → margin.",
"<strong>Makro</strong>: GDP = C+I+G+NX; inflasi via CPI; siklus: ekspansi–puncak–kontraksi–lembah.",
"<strong>Moneter</strong> (suku bunga) vs <strong>fiskal</strong> (belanja/pajak) — beda alat, beda lag.",
"<strong>FX</strong>: apresiasi/depresiasi; cross-rate via mata uang bersama; rezim Indonesia = managed float.",
"<strong>Komparatif</strong>: dagang yang opportunity cost-nya terendah.",
"<strong>Selalu riil</strong>: kurangi inflasi sebelum memutuskan.",
],
"prev": ["pm-a2-quant-methods", "PM-A2"],
"next": ["pm-a4-financial-statements", "PM-A4"],
},
{
"slug": "pm-a4-financial-statements", "id": "PM-A4", "track": "Portfolio Management",
"title_html": "Financial Statements:<br/>Membaca 3 Laporan & Rasio",
"title_plain": "Financial Statement Analysis: 3 Laporan, Rasio, Kualitas Laba",
"chapter_summary": "Anatomi laporan keuangan: keterkaitan income statement–balance sheet–cash flow, pilihan akuntansi (FIFO/LIFO, depresiasi, pajak tangguhan), analisis rasio + DuPont, dan red flag kualitas laba. Lab kalkulator rasio & DuPont.",
"tujuan": [
"Menjelaskan keterkaitan tiga laporan keuangan.",
"Membedakan dampak FIFO vs LIFO dan depresiasi terhadap laba.",
"Menghitung rasio likuiditas, solvabilitas, dan profitabilitas + DuPont.",
"Mengidentifikasi red flag kualitas laba (accruals, receivables).",
],
"story_title": "Cerita: Laba Naik 40%, Kas Malah Minus",
"story": """<p><strong>PT MajuJaya</strong> melaporkan laba bersih <strong>naik 40%</strong>. Sahamnya melonjak. Sebulan kemudian: <strong>gagal bayar utang</strong>. Kok bisa?</p>
<p>Twist-nya ada di arus kas: <strong>kas operasi negatif</strong>. Laba 40% itu datang dari <strong>piutang yang membengkak</strong> (penjualan ke distributor 'titip' akhir tahun — channel stuffing) dan <strong>penyusutan diperpanjang</strong> (beban turun, laba naik, kas tidak berubah). Laba = opini; <strong>kas = fakta</strong>. Lesson ini: membaca yang tidak ditulis di headline — kualitas laba.</p>""",
"concepts": [
{
"id": "tiga", "toc": "Tiga Laporan",
"title": "Tiga Laporan — Satu Cerita",
"body": """<p><strong>Definisi.</strong> <strong>Income statement</strong>: kinerja <em>periode</em> (revenue → laba). <strong>Balance sheet</strong>: posisi <em>saat</em> itu (Aset = Liabilitas + Ekuitas). <strong>Cash flow</strong>: kas <em>bergerak</em> (operasi, investasi, pendanaan). Keterkaitan: laba bersih → menambah <strong>retained earnings</strong> di ekuitas; arus kas operasi = laba ± non-kas ± modal kerja.</p>
<p><strong>Aturan emas</strong>: laba tanpa kas = curiga. <strong>Cash flow operasi</strong> adalah laporan yang paling sulit dimanipulasi.</p>""",
"formulas": [
{"math": r"\text{Aset} = \text{Liabilitas} + \text{Ekuitas} \quad;\quad CFO = \text{Laba} \pm \text{Non-kas} \pm \Delta\text{Modal Kerja}",
"symbols": [
"Persamaan dasar akuntansi — selalu seimbang (double-entry)",
"CFO: laba + depresiasi (non-kas) − kenaikan piutang/persediaan + kenaikan utang usaha",
"Laba naik + CFO turun = pola MajuJaya → investigasi",
]},
],
"intuisi": "Tiga laporan seperti <strong>rapor, foto, dan rekening</strong>: income statement = rapor semester (nilai), balance sheet = foto dompet hari ini (isi), cash flow = mutasi rekening (uang beneran masuk-keluar). Rapor bisa 'dipercantik'; mutasi sulit bohong.",
"kapan": "Screening awal setiap emiten: bandingkan laba vs CFO 5 tahun.",
"worked": {"title": "📐 Contoh: Bedah MajuJaya (klik untuk buka)",
"body": """<p><strong>IS:</strong> laba +40% (Rp140M). <strong>BS:</strong> piutang +120% (Rp200M). <strong>CF:</strong> CFO <strong>−Rp30M</strong>.</p>
<p><strong>Rekonsiliasi:</strong> CFO = 140 + depresiasi 50 − Δpiutang 200 − Δpersediaan 20 = −30. Laba 'dimakan' piutang.</p>
<p><strong>Kesimpulan 1 menit:</strong> pertumbuhan tidak berkualitas (channel stuffing). Hindari — atau short jika sudah pegang. Inilah kenapa analis membaca CF <em>dulu</em>.</p>"""},
"charts": [
{"data": """[{x: ["2021","2022","2023","2024","2025"], y: [80,95,100,110,140], type: "bar", marker: {color: "#2a7de1"}, name: "laba bersih"}, {x: ["2021","2022","2023","2024","2025"], y: [70,80,60,20,-30], type: "bar", marker: {color: "#e8a838"}, name: "CFO"}]""",
"title": "MajuJaya: laba vs kas operasi",
"layout": """{xaxis: {title: "Tahun"}, yaxis: {title: "Rp M"}, barmode: "group", showlegend: true}""",
"cara": "Biru = laba bersih, kuning = kas operasi. Seharusnya bergerak searah.",
"interpretasi": "2023–2025: <strong>divergensi melebar</strong> — laba naik, kas anjlok ke negatif. Pola klasik manipulasi akrual. Aturan screening: jika (laba − CFO)/aset &gt; 10% bertahun-tahun → <strong>buang dari watchlist</strong>."},
],
},
{
"id": "pilihan", "toc": "Pilihan Akuntansi",
"title": "Pilihan Akuntansi — Laba yang 'Dimasak' Legal",
"body": """<p><strong>Definisi.</strong> <strong>FIFO vs LIFO</strong> (saat harga naik): FIFO → COGS rendah → laba tinggi, pajak tinggi; LIFO → sebaliknya (dilarang IFRS!). <strong>Depresiasi</strong>: garis lurus (beban rata) vs dipercepat (beban besar di awal → laba awal kecil, pajak kecil). <strong>Pajak tangguhan</strong>: beda laba akuntansi vs fiskal → aset/liabilitas pajak tangguhan.</p>
<p>Prinsip: <strong>bandingkan apel dengan apel</strong> — dua emiten beda metode depresiasi = laba tidak comparable. Normalisasi dulu.</p>""",
"formulas": [],
"intuisi": "Pilihan akuntansi seperti <strong>filter foto</strong>: objeknya sama, tampilannya beda. FIFO = filter cerah (laba kinclong, pajak mahal); depresiasi dipercepat = filter gelap di awal (pajak hemat). Tugas analis: lihat foto aslinya (kas).",
"kapan": "Bandingkan emiten se-industri: samakan asumsi dulu.",
"worked": {"title": "📐 Contoh: FIFO vs LIFO (klik untuk buka)",
"body": """<p>Beli 100 unit @Rp10, lalu 100 unit @Rp14. Jual 100 unit @Rp20.</p>
<p><strong>FIFO</strong> (jual yang lama): COGS = 100×10 = Rp1.000 → laba kotor Rp1.000.</p>
<p><strong>LIFO</strong> (jual yang baru): COGS = 100×14 = Rp1.400 → laba kotor Rp600.</p>
<p><strong>Selisih laba 67%!</strong> — dari transaksi yang <em>identik</em>. IFRS melarang LIFO justru karena ini. Saat baca emiten US (boleh LIFO) vs Indonesia (IFRS): adjust.</p>"""},
"charts": [],
},
{
"id": "rasio", "toc": "Rasio & DuPont",
"title": "Rasio & DuPont — X-Ray Perusahaan",
"body": """<p><strong>Definisi.</strong> <strong>Likuiditas</strong>: current ratio (aset lancar/liabilitas lancar), quick ratio. <strong>Solvabilitas</strong>: DER (utang/ekuitas), interest coverage (EBIT/bunga). <strong>Profitabilitas</strong>: margin (laba/revenue), ROA, ROE. <strong>DuPont 3-langkah</strong>: ROE = margin × asset turnover × leverage.</p>
<p>DuPont membedah <em>dari mana</em> ROE datang: margin tinggi (pricing power), turnover tinggi (efisiensi), atau leverage tinggi (<strong>rapuh!</strong>).</p>""",
"formulas": [
{"math": r"ROE = \frac{\text{Laba}}{\text{Rev}} \times \frac{\text{Rev}}{\text{Aset}} \times \frac{\text{Aset}}{\text{Ekuitas}}",
"symbols": [
"<Tex math={String.raw`\\frac{\\text{Laba}}{\\text{Rev}}`} />: net margin — pricing power",
"<Tex math={String.raw`\\frac{\\text{Rev}}{\\text{Aset}}`} />: asset turnover — efisiensi operasional",
"<Tex math={String.raw`\\frac{\\text{Aset}}{\\text{Ekuitas}}`} />: leverage — pengali yang juga pengali risiko",
"ROE 25% dari leverage 5x ≠ ROE 25% dari margin 20% (yang kedua jauh lebih aman)",
]},
],
"intuisi": "DuPont seperti <strong>tes darah</strong>: ROE = 'sehat' saja tidak cukup — dokter melihat kolesterol (leverage), gula (margin), tekanan darah (turnover). ROE tinggi karena leverage = atlet doping.",
"kapan": "Bandingkan ROE antar-emiten: tolak yang ROE-nya dari utang.",
"worked": {"title": "📐 Contoh: Dua ROE 20% (klik untuk buka)",
"body": """<p><strong>Emiten A:</strong> margin 15% × turnover 1,0 × leverage 1,33 = <strong>20%</strong>. <strong>Emiten B:</strong> margin 4% × turnover 1,0 × leverage 5,0 = <strong>20%</strong>.</p>
<p><strong>A</strong>: ROE dari pricing power (aman). <strong>B</strong>: ROE dari utang 5x (DER 4!) — naikkan suku bunga sedikit → coverage jebol.</p>
<p>Pilih A walau ROE sama. <strong>Kualitas ROE &gt; angka ROE.</strong></p>"""},
"charts": [],
},
],
"myths": [
{"t": "Laba bersih naik = perusahaan sehat. Itu kan intinya.",
"benar": "MajuJaya: laba +40%, <strong>gagal bayar</strong>. Laba = akrual (opini manajemen); CFO = kas (fakta). Selalu bandingkan keduanya — divergensi &gt; 10% dari aset bertahun-tahun = red flag. 'Laba naik' tanpa kas = rapor bagus dari sekolah yang ujian bocor."},
{"t": "ROE tinggi selalu bagus — cari saja ROE terbesar.",
"benar": "ROE = margin × turnover × <strong>leverage</strong>. ROE 20% dari utang 5x = bom waktu (lihat Emiten B). ROE tinggi + DER rendah + CFO sehat = baru berkualitas. Screening buta ROE = membeli doping."},
],
"tips": [
"<strong>Baca arus kas dulu, income statement kemudian.</strong> CFO 5 tahun memberi tahu kualitas; IS memberi tahu cerita. Analis yang mulai dari IS = membaca brosur; yang mulai dari CF = memeriksa dapur.",
"<strong>Normalisasi sebelum bandingkan.</strong> Beda metode depresiasi/inventori = beda laba. Buat kolom 'adjusted' di model Excel-mu — ini yang membedakan analis serius dari screener gratisan.",
],
"labs": [
{"heading": "Kalkulator Rasio Keuangan",
"intro": "Masukkan angka 3 laporan — dapatkan 8 rasio kunci + lampu merah otomatis.",
"title": "Lab 1 — Kalkulator Rasio",
"hint": "Ubah UTANG 400 -> 1200 (DER naik). Lihat coverage jebol — itulah Emiten B.",
"code": """# Kalkulator rasio dari 3 laporan (Rp miliar)
REV, LABA, EBIT, BEBAN_BUNGA = 1000, 120, 180, 40
ASET_LANCAR, LIAB_LANCAR = 400, 250
PERSEDIAAN = 120
TOTAL_UTANG, EKUITAS, TOTAL_ASET = 400, 600, 1000  # ubah UTANG sesukamu
CFO = 90

def cek(nama, v, batas, arah=">="):
    ok = (v >= batas) if arah == ">=" else (v <= batas)
    print(f"  {nama:<22}: {v:>7.2f}  [{'OK' if ok else 'WASPADA'}] (syarat {arah} {batas})")

print("Likuiditas & solvabilitas:")
cek("Current ratio", ASET_LANCAR/LIAB_LANCAR, 1.2)
cek("Quick ratio", (ASET_LANCAR-PERSEDIAAN)/LIAB_LANCAR, 1.0)
cek("DER", TOTAL_UTANG/EKUITAS, 1.0, "<=")
cek("Interest coverage", EBIT/BEBAN_BUNGA, 3.0)
print("Profitabilitas:")
cek("Net margin", LABA/REV, 0.10)
cek("ROE", LABA/EKUITAS, 0.15)
cek("ROA", LABA/TOTAL_ASET, 0.08)
print(f"Kualitas laba (CFO/laba): {CFO/LABA:.0%} {'OK' if CFO/LABA>0.8 else 'WASPADA - pola MajuJaya!'}")
"""},
{"heading": "Dekomposisi DuPont",
"intro": "Bedah ROE jadi margin × turnover × leverage. Lihat dari mana ROE berasal.",
"title": "Lab 2 — Kalkulator DuPont",
"hint": "Ubah LEVERAGE_B 5.0 -> 1.5. ROE B anjlok — bukti ROE-nya 'palsu' (dari utang).",
"code": """# DuPont 3-langkah: ROE = margin x turnover x leverage
def dupont(nama, margin, turnover, leverage):
    roe = margin * turnover * leverage
    print(f"{nama}: {margin:.0%} x {turnover:.1f} x {leverage:.2f} = ROE {roe:.1%}")
    sumber = "PRICING POWER (aman)" if margin >= 0.12 else ("LEVERAGE (rapuh!)" if leverage >= 3 else "efisiensi")
    print(f"   Sumber ROE: {sumber}\\n")
    return roe

print("Dua emiten, ROE 'sama':\\n")
ra = dupont("Emiten A", 0.15, 1.0, 1.33)
LEVERAGE_B = 5.0   # ubah sesukamu
rb = dupont("Emiten B", 0.04, 1.0, LEVERAGE_B)
print(f"Kesimpulan: pilih A (ROE dari margin), waspadai B (ROE dari utang {LEVERAGE_B}x).")
"""},
],
"decisions": [
{"kondisi": "Laba naik tapi CFO turun/divergen", "pakai": "Investigasi / hindari",
"alasan": "Pola MajuJaya: akrual agresif atau channel stuffing.",
"contoh": "Cek Δpiutang vs Δrevenue."},
{"kondisi": "ROE tinggi + DER &gt; 2", "pakai": "Tolak / diskon valuasi",
"alasan": "ROE dari leverage = rapuh terhadap rate shock.",
"contoh": "Cek interest coverage &lt; 3."},
{"kondisi": "Bandingkan 2 emiten beda metode akuntansi", "pakai": "Normalisasi dulu",
"alasan": "Laba tidak comparable (FIFO vs LIFO, depresiasi).",
"contoh": "Samakan ke FIFO + SL."},
{"kondisi": "Piutang tumbuh &gt; revenue 2 tahun", "pakai": "Red flag kolektibilitas",
"alasan": "Penjualan tidak tertagih = laba semu.",
"contoh": "Cek DSO & aging."},
],
"rule10": "<ol><li><strong>Kas = fakta</strong>, laba = opini.</li><li><strong>DuPont</strong> setiap ROE.</li><li><strong>Normalisasi</strong> sebelum bandingkan.</li><li><strong>CFO/laba &gt; 80%</strong> = sehat.</li></ol>",
"case": {"toc": "Mini-Case: MajuJaya",
"title": "Laba +40%, Gagal Bayar",
"body": """<p>PT MajuJaya: laba +40% (Rp140M), piutang +120%, CFO −Rp30M, saham sempat melonjak lalu kolaps saat gagal bayar.</p>""",
"q": "(a) Tiga red flag dari angka? (b) Mekanisme 'channel stuffing'? (c) Screening rule agar tidak kena lagi?",
"pembahasan": """<p>(a) <strong>Divergensi laba vs CFO</strong> (−Rp30M vs +Rp140M); <strong>piutang +120%</strong> jauh di atas revenue; implisit <strong>DSO meledak</strong>.</p>
<p>(b) <strong>Channel stuffing</strong>: paksa distributor ambil barang akhir tahun (revenue diakui, kas belum masuk, retur mengintai). Legal di batas tertentu, tapi kualitas nol.</p>
<p>(c) <strong>Rule:</strong> (laba − CFO)/aset &gt; 10% dua tahun → buang; Δpiutang &gt; Δrevenue → investigasi; selalu baca CF sebelum IS.</p>"""},
"quiz": [
{"q": "Laba Rp140M, depresiasi Rp50M, piutang naik Rp200M, persediaan naik Rp20M. CFO?",
"options": ["Rp140M", "−Rp30M", "Rp190M", "Rp410M"], "correct": 1,
"why": "Benar: 140 + 50 − 200 − 20 = −30. Laba 'dimakan' modal kerja — pola MajuJaya klasik."},
{"q": "Harga naik. FIFO vs LIFO: mana laba lebih tinggi?",
"options": ["LIFO", "FIFO (COGS dari barang lama yang murah)", "Sama", "Tergantung pajak"], "correct": 1,
"why": "Benar: FIFO memakai COGS lama (murah) → laba tinggi → pajak tinggi. IFRS melarang LIFO karena distorsi ini."},
{"q": "ROE 20% dari margin 4% × leverage 5x. Penilaian?",
"options": ["Bagus — ROE tinggi", "Rapuh — ROE dari utang; sensitif rate shock", "Tidak bisa dinilai", "Lebih baik dari margin tinggi"], "correct": 1,
"why": "Benar: DuPont membedah sumber. Leverage 5x = DER 4 — kenaikan bunga sedikit bisa menjebol coverage. Kualitas ROE &gt; angka ROE."},
{"q": "Red flag kualitas laba terkuat?",
"options": ["Revenue naik", "CFO/laba &lt; 50% bertahun-tahun", "DER turun", "Dividen naik"], "correct": 1,
"why": "Benar: laba tanpa kas = akrual agresif. Divergensi persisten adalah prediktor masalah paling andal di laporan."},
{"q": "Interest coverage 1,5x. Artinya?",
"options": ["Aman", "Berbahaya — EBIT hanya 1,5x beban bunga; guncangan kecil = gagal bayar", "Tidak relevan", "Bagus untuk growth"], "correct": 1,
"why": "Benar: &lt; 3x = waspada, &lt; 1,5x = kritis. Coverage tipis + utang besar = kombinasi mematikan saat resesi."},
],
"rangkum": [
"<strong>3 laporan</strong>: IS (kinerja), BS (posisi), CF (kas) — saling terkait via retained earnings &amp; rekonsiliasi.",
"<strong>Kas = fakta</strong>: divergensi laba vs CFO = red flag utama.",
"<strong>Pilihan akuntansi</strong> (FIFO/LIFO, depresiasi, pajak tangguhan) mengubah laba — normalisasi dulu.",
"<strong>DuPont</strong>: ROE = margin × turnover × leverage — bedah sumbernya.",
"<strong>Rasio kunci</strong>: current, quick, DER, coverage, margin, ROE, DSO.",
"<strong>Kapan TIDAK percaya laba</strong>: accruals tinggi + CFO lemah + piutang meledak.",
],
"prev": ["pm-a3-economics", "PM-A3"],
"next": ["pm-a5-corporate-issuers", "PM-A5"],
},
{
"slug": "pm-a5-corporate-issuers", "id": "PM-A5", "track": "Portfolio Management",
"title_html": "Corporate Issuers:<br/>Governance, WACC & Modal Kerja",
"title_plain": "Corporate Issuers: Governance, Capital Budgeting, WACC",
"chapter_summary": "Sisi emiten: governance & ESG, capital budgeting (NPV/IRR/payback/PI), struktur modal & WACC, dan working capital (cash conversion cycle). Lab evaluator proyek & kalkulator WACC.",
"tujuan": [
"Menjelaskan prinsip governance yang baik dan integrasi ESG.",
"Menerapkan NPV, IRR, payback, dan PI untuk keputusan proyek.",
"Menghitung WACC dan menjelaskan trade-off utang vs ekuitas.",
"Menghitung cash conversion cycle dan implikasinya ke kas.",
],
"story_title": "Cerita: Pabrik yang 'Menguntungkan' Tapi Membunuh Kas",
"story": """<p><strong>PT SinarAbadi</strong> membangun pabrik baru: proyeksi akuntansi <strong>untung Rp50M/tahun</strong>. Direksi setuju. Dua tahun kemudian: <strong>krisis likuiditas</strong> — pabrik 'untung' tapi perusahaan kehabisan kas.</p>
<p>Twist-nya berlapis: <strong>(1)</strong> 'untung' itu setelah depresiasi (non-kas) tapi <em>sebelum</em> memperhitungkan <strong>modal kerja</strong> yang membengkak (stok + piutang pabrik baru); <strong>(2)</strong> didanai utang jangka pendek berbunga tinggi — <strong>mismatch tenor</strong>; <strong>(3)</strong> tidak pernah dihitung <strong>NPV</strong>-nya (mungkin negatif sejak awal!). <strong>Keputusan modal tanpa TVM (PM-A2) = judi berdasi.</strong> Lesson ini: disiplin capital budgeting.</p>""",
"concepts": [
{
"id": "governance", "toc": "Governance & ESG",
"title": "Governance — Siapa Mengawasi Siapa",
"body": """<p><strong>Definisi.</strong> <strong>Corporate governance</strong>: sistem pengarahan &amp; pengendalian perusahaan — dewan komisaris/direksi, hak pemegang saham, transparansi, remunerasi. <strong>Prinsip</strong>: board independen, komite audit, one-share-one-vote, related-party transaction diungkapkan. <strong>ESG</strong>: Environmental, Social, Governance — faktor non-finansial yang memengaruhi risiko &amp; return jangka panjang.</p>
<p>Red flag governance: komisaris rangkap berlebihan, transaksi afiliasi jumbo, auditor gonta-ganti, dual-class shares yang mengebiri minoritas.</p>""",
"formulas": [],
"intuisi": "Governance seperti <strong>wasit + aturan main</strong>: tanpa wasit independen, pemain (manajemen) bisa mengutak-atik skor (laba) dan mencuri bola (tunneling ke afiliasi). Investor minoritas = penonton yang bayar tiket — butuh wasit.",
"kapan": "Due diligence: cek governance SEBELUM valuasi. Governance buruk = diskon valuasi atau tolak.",
"worked": {"title": "📐 Contoh: Skor governance 5 menit (klik untuk buka)",
"body": """<p>Cek cepat emiten X: (1) Komisaris independen ≥ 30%? Ya. (2) Transaksi afiliasi &gt; 10% revenue? <strong>Ya — Rp800M ke perusahaan milik direksi.</strong> (3) Auditor 3 tahun sama? Tidak — ganti 2x. (4) Dividen konsisten? Tidak.</p>
<p><strong>2 red flag</strong> (afiliasi + auditor) → <strong>diskon valuasi 20–30%</strong> atau lewati. Governance buruk = laba bisa 'bocor' kapan saja.</p>"""},
"charts": [],
},
{
"id": "budgeting", "toc": "Capital Budgeting",
"title": "Capital Budgeting — Proyek Layak atau Tidak",
"body": """<p><strong>Definisi.</strong> <strong>NPV</strong> = PV arus kas − investasi awal; terima jika &gt; 0. <strong>IRR</strong> = discount rate saat NPV = 0; terima jika &gt; <strong>hurdle rate (WACC)</strong>. <strong>Payback</strong> = waktu balik modal (abaikan TVM — kelemahan!). <strong>PI</strong> = PV/investasi; terima jika &gt; 1.</p>
<p><strong>Aturan konflik</strong>: NPV vs IRR bisa beda untuk proyek mutually exclusive (beda skala/timing) → <strong>NPV menang</strong> (mengukur nilai absolut, bukan %). SinarAbadi: tidak hitung NPV = dosa asal.</p>""",
"formulas": [
{"math": r"NPV = \sum_{t=1}^{N}\frac{CF_t}{(1+r)^t} - I_0 \quad;\quad IRR: NPV = 0",
"symbols": [
"<Tex math={String.raw`CF_t`} />: arus kas <strong>inkremental</strong> (hanya yang berubah karena proyek!)",
"<Tex math={String.raw`r`} />: hurdle rate = WACC (biaya modal perusahaan)",
"<Tex math={String.raw`I_0`} />: investasi awal",
"Pakai arus kas, BUKAN laba akuntansi (depresiasi kembali ditambahkan; modal kerja diperhitungkan)",
]},
],
"intuisi": "NPV seperti <strong>timbangan nilai</strong>: taruh semua kas masa depan (didiskon) di kiri, investasi di kanan. Kiri lebih berat = proyek menambah nilai. IRR = 'bunga implisit' proyek — bandingkan dengan 'bunga pinjamanmu' (WACC).",
"kapan": "Setiap capex: pabrik, akuisisi, ekspansi. Tanpa NPV = spekulasi.",
"worked": {"title": "📐 Contoh: Pabrik SinarAbadi (klik untuk buka)",
"body": """<p>Investasi Rp500M. Arus kas (inkremental, setelah modal kerja!): thn 1–5 = Rp120M/thn. WACC 12%.</p>
<p><strong>NPV</strong> = 120 × [1−1,12^−5]/0,12 − 500 = 120 × 3,6048 − 500 = 432,6 − 500 = <strong>−Rp67,4M</strong>.</p>
<p><strong>TOLAK!</strong> 'Untung akuntansi Rp50M/thn' menipu — setelah TVM + modal kerja, proyek <strong>menghancurkan Rp67M nilai</strong>. Inilah yang tidak dihitung direksi.</p>"""},
"charts": [
{"data": """[{x: [0,5,10,15,20,25,30], y: [-67,-32,0,28,54,76,96], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "NPV (Rp M)"}]""",
"title": "NPV profile pabrik SinarAbadi",
"layout": """{xaxis: {title: "Discount rate (%)"}, yaxis: {title: "NPV (Rp M)"}, showlegend: false}""",
"cara": "Sumbu X = discount rate, Y = NPV. Titik potong nol = IRR.",
"interpretasi": "NPV positif hanya jika r &lt; ~8% (IRR ≈ 8%). WACC perusahaan 12% → NPV negatif → <strong>tolak</strong>. NPV profile menunjukkan <em>margin of safety</em>: makin jauh WACC dari IRR, makin yakin keputusannya."},
],
},
{
"id": "wacc", "toc": "WACC & Modal Kerja",
"title": "WACC & Modal Kerja — Harga Uang & Putarannya",
"body": """<p><strong>Definisi.</strong> <strong>WACC</strong> = w_d×r_d(1−T) + w_e×r_e — rata-rata biaya modal. <strong>Trade-off utang</strong>: bunga <em>tax-deductible</em> (murah) vs risiko financial distress (mahal). <strong>Pecking order</strong>: internal → utang → ekuitas (terakhir karena paling mahal &amp; sinyal negatif).</p>
<p><strong>CCC</strong> (<em>cash conversion cycle</em>) = DIO + DSO − DPO: berapa hari kas 'terikat' di operasional. CCC panjang = butuh modal kerja besar = 'pabrik untung tapi kas kering'.</p>""",
"formulas": [
{"math": r"WACC = w_d r_d(1-T) + w_e r_e \quad;\quad CCC = DIO + DSO - DPO",
"symbols": [
"<Tex math={String.raw`w_d, w_e`} />: bobot utang &amp; ekuitas (nilai pasar!)",
"<Tex math={String.raw`r_d(1-T)`} />: biaya utang setelah pajak (tax shield)",
"<Tex math={String.raw`r_e`} />: biaya ekuitas (via CAPM, PM-A10)",
"DIO: hari persediaan; DSO: hari piutang; DPO: hari utang usaha (makin besar makin bagus)",
]},
],
"intuisi": "WACC seperti <strong>harga pokok 'pinjaman' perusahaan</strong> — proyek harus menghasilkan di atas ini atau menghancurkan nilai. CCC seperti <strong>panjang selang air</strong>: makin panjang, makin banyak air (kas) yang 'nyangkut' di selang sebelum sampai ke ember.",
"kapan": "WACC = hurdle rate semua keputusan; CCC = diagnosis likuiditas.",
"worked": {"title": "📐 Contoh: WACC & CCC SinarAbadi (klik untuk buka)",
"body": """<p>Utang Rp400M @10%, ekuitas Rp600M @16% (CAPM), pajak 22%. <strong>WACC</strong> = 0,4×10%×0,78 + 0,6×16% = 3,12% + 9,6% = <strong>12,72%</strong>.</p>
<p><strong>CCC</strong>: DIO 90 + DSO 75 − DPO 40 = <strong>125 hari</strong> — kas terikat 4 bulan! Tiap Rp1M penjualan harian butuh Rp125M modal kerja.</p>
<p>Dua pembunuh: WACC 12,7% (hurdle tinggi) + CCC 125 hari (kas tersedot). Pabrik 'untung' akuntansi = ilusi.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Proyek dengan IRR tertinggi selalu yang terbaik.",
"benar": "IRR <strong>mengabaikan skala</strong>: proyek Rp10M IRR 50% (+Rp5M) vs Rp1M IRR 30% (+Rp300jt) — IRR pilih yang pertama, <strong>NPV pilih yang kedua</strong> (nilai absolut lebih besar). Untuk mutually exclusive: NPV menang. IRR juga bisa ganda jika arus kas berubah tanda."},
{"t": "Utang selalu buruk — perusahaan terbaik = tanpa utang.",
"benar": "Bunga <strong>tax-deductible</strong> → utang moderat <em>menurunkan</em> WACC &amp; menaikkan nilai (trade-off theory). Yang berbahaya = utang <strong>berlebihan</strong> atau <strong>mismatch tenor</strong> (utang pendek untuk aset panjang — dosa SinarAbadi). Optimal ≠ nol."},
],
"tips": [
"<strong>Arus kas inkremental saja.</strong> Sunk cost (riset yang sudah dibayar) = abaikan; opportunity cost (gudang yang bisa disewakan) = masukkan. 80% error NPV = salah mendefinisikan 'CF yang berubah karena proyek'.",
"<strong>Bobot WACC pakai nilai pasar, bukan buku.</strong> Ekuitas buku Rp600M tapi pasar Rp2M → bobot salah total. Analis malas pakai buku; analis benar hitung market cap + market value of debt.",
],
"labs": [
{"heading": "Evaluator Proyek (NPV/IRR/Payback)",
"intro": "Masukkan arus kas proyek — dapatkan NPV, IRR (biseksi), payback, dan keputusan.",
"title": "Lab 1 — Evaluator Proyek",
"hint": "Ubah CF tahun 1-5 dari 120 -> 150. NPV jadi positif — lihat betapa sensitifnya keputusan ke asumsi kas!",
"code": """# Evaluator capital budgeting
I0 = 500  # investasi awal (Rp M)
CF = [120, 120, 120, 120, 120]  # arus kas thn 1-5 (ubah sesukamu)
WACC = 0.12

npv = sum(cf/(1+WACC)**(t+1) for t, cf in enumerate(CF)) - I0
# IRR via biseksi
lo, hi = -0.5, 1.0
for _ in range(60):
    mid = (lo+hi)/2
    v = sum(cf/(1+mid)**(t+1) for t, cf in enumerate(CF)) - I0
    lo, hi = (mid, hi) if v > 0 else (lo, mid)
irr = (lo+hi)/2
# payback
kum, pb = 0, None
for t, cf in enumerate(CF, 1):
    kum += cf
    if pb is None and kum >= I0: pb = t - 1 + (I0-(kum-cf))/cf

print(f"NPV  @ {WACC:.0%}: Rp{npv:+.1f} M")
print(f"IRR          : {irr:.1%}")
print(f"Payback      : {pb:.1f} tahun")
print(f"\\nKeputusan: {'TERIMA' if npv > 0 else 'TOLAK'} (NPV {'positif' if npv>0 else 'negatif'})")
if irr > WACC and npv < 0: print("Konflik IRR vs NPV? Percaya NPV (skala & timing).")
"""},
{"heading": "Kalkulator WACC & CCC",
"intro": "Hitung biaya modal rata-rata dan cash conversion cycle.",
"title": "Lab 2 — Kalkulator WACC & CCC",
"hint": "Ubah DPO 40 -> 70 (bayar supplier lebih lambat). CCC turun 30 hari — kas bebas Rp besar!",
"code": """# WACC & Cash Conversion Cycle
# --- WACC ---
WD, RD, WE, RE, TAX = 0.4, 0.10, 0.6, 0.16, 0.22  # bobot & biaya
wacc = WD*RD*(1-TAX) + WE*RE
print(f"WACC = {WD:.0%}x{RD:.0%}x{1-TAX:.0%} + {WE:.0%}x{RE:.0%} = {wacc:.2%}")
print(f"  Tax shield menghemat: {WD*RD*TAX:.2%} poin")
# --- CCC ---
DIO, DSO, DPO = 90, 75, 40   # ubah DPO sesukamu
ccc = DIO + DSO - DPO
print(f"\\nCCC = {DIO} + {DSO} - {DPO} = {ccc} hari")
penjualan_harian = 10  # Rp M/hari
print(f"Kas terikat di modal kerja: ~Rp{ccc*penjualan_harian:,.0f} M")
print("\\nAturan: CCC turun 30 hari = kas bebas Rp300 M (pada contoh ini).")
"""},
],
"decisions": [
{"kondisi": "NPV &gt; 0 (independen)", "pakai": "Terima",
"alasan": "Menambah nilai perusahaan.",
"contoh": "Ekspansi yang lolos hurdle."},
{"kondisi": "Proyek mutually exclusive, NPV vs IRR konflik", "pakai": "Ikuti NPV",
"alasan": "NPV mengukur nilai absolut; IRR buta skala.",
"contoh": "Pilih Rp300M @30% atas Rp5M @50%."},
{"kondisi": "CCC &gt; 100 hari", "pakai": "Perketat: tekan DIO/DSO, negosiasi DPO",
"alasan": "Kas terikat = butuh pendanaan mahal.",
"contoh": "Program SCF dengan supplier."},
{"kondisi": "Governance red flag (afiliasi, auditor)", "pakai": "Diskon valuasi / tolak",
"alasan": "Laba bisa bocor via tunneling.",
"contoh": "Skor governance 5 menit."},
],
"rule10": "<ol><li><strong>NPV &gt; 0</strong> = terima; konflik → NPV menang.</li><li><strong>Arus kas inkremental</strong>, bukan laba.</li><li><strong>WACC</strong> = hurdle; bobot pasar.</li><li><strong>CCC pendek</strong> = kas sehat.</li></ol>",
"case": {"toc": "Mini-Case: Pabrik SinarAbadi",
"title": "Pabrik 'Untung' yang Membunuh Kas",
"body": """<p>SinarAbadi: pabrik baru 'untung Rp50M/thn' (akuntansi), didanai utang jangka pendek, modal kerja membengkak. Hasil: krisis likuiditas.</p>""",
"q": "(a) Tiga kesalahan keputusan modal? (b) Hitung ulang dengan benar (asumsi: CF inkremental Rp120M/thn 5 thn, I0 Rp500M, WACC 12%). (c) Pelajaran governance?",
"pembahasan": """<p>(a) <strong>Tidak hitung NPV</strong> (pakai laba akuntansi); <strong>abaikan modal kerja</strong> (CCC 125 hari); <strong>mismatch tenor</strong> (utang pendek untuk aset panjang).</p>
<p>(b) <strong>NPV = −Rp67,4M → TOLAK.</strong> 'Untung Rp50M' = ilusi depresiasi + abaikan TVM.</p>
<p>(c) <strong>Board harus menuntut</strong> NPV + analisis sensitivitas + rencana pendanaan sesuai tenor <em>sebelum</em> setuju capex. Capex tanpa kertas kerja = maladministrasi.</p>"""},
"quiz": [
{"q": "I0 Rp500M, CF Rp120M/thn 5 thn, WACC 12%. NPV?",
"options": ["+Rp67M", "−Rp67M (tolak!)", "Rp0", "+Rp100M"], "correct": 1,
"why": "Benar: 120×3,6048 − 500 = −67,4. 'Untung akuntansi' menipu; NPV jujur. Keputusan: tolak."},
{"q": "Proyek A: Rp10M, IRR 50%. Proyek B: Rp1M, IRR 30%. Mutually exclusive. Pilih?",
"options": ["A (IRR tertinggi)", "Hitung NPV — nilai absolut yang menang", "Keduanya", "Tolak keduanya"], "correct": 1,
"why": "Benar: IRR buta skala. NPV A = +Rp5M vs B = +Rp300jt → B menang. Aturan: konflik NPV vs IRR → NPV."},
{"q": "WACC = 0,4×10%×0,78 + 0,6×16%. Hasil?",
"options": ["13,0%", "12,72%", "10,0%", "16,0%"], "correct": 1,
"why": "Benar: 3,12% + 9,6% = 12,72%. Tax shield (1−T) membuat utang 'murah' — tapi bukan alasan utang ugal-ugalan."},
{"q": "DIO 90, DSO 75, DPO 40. CCC dan artinya?",
"options": ["205 hari", "125 hari — kas terikat ~4 bulan", "25 hari", "90 hari"], "correct": 1,
"why": "Benar: 90+75−40 = 125. Makin panjang = makin banyak kas 'nyangkut'. Perpanjang DPO & tekan DIO/DSO untuk membebaskan kas."},
{"q": "Governance red flag terkuat?",
"options": ["Dividen kecil", "Transaksi afiliasi jumbo ke perusahaan direksi", "Rapat board rutin", "Situs web jelek"], "correct": 1,
"why": "Benar: tunneling via afiliasi = laba 'bocor' ke kantong manajemen. Ini alasan utama diskon valuasi governance."},
],
"rangkum": [
"<strong>Governance</strong>: wasit perusahaan; red flag = afiliasi jumbo, auditor gonta-ganti.",
"<strong>NPV &gt; 0 terima</strong>; konflik dengan IRR → NPV menang.",
"<strong>Arus kas inkremental</strong>: sunk cost abaikan, opportunity cost masukkan.",
"<strong>WACC</strong> = w_d×r_d(1−T) + w_e×r_e (bobot pasar!) = hurdle rate.",
"<strong>CCC</strong> = DIO + DSO − DPO — pendek = kas sehat.",
"<strong>Kapan TIDAK capex</strong>: tanpa NPV + tanpa rencana tenor pendanaan.",
],
"prev": ["pm-a4-financial-statements", "PM-A4"],
"next": ["pm-a6-equity", "PM-A6"],
},
{
"slug": "pm-a6-equity", "id": "PM-A6", "track": "Portfolio Management",
"title_html": "Equity:<br/>Struktur Pasar, Indeks & Efisiensi",
"title_plain": "Equity Investments: Struktur Pasar, Indeks, Efisiensi",
"chapter_summary": "Pasar saham: jenis order & mekanisme (long/short, margin), konstruksi indeks (price/cap/equal-weighted), tiga bentuk efisiensi pasar, dan analisis top-down vs bottom-up. Lab kalkulator indeks & simulator margin call.",
"tujuan": [
"Menjelaskan order market/limit/stop dan mekanisme long/short/margin.",
"Menghitung indeks price-weighted, cap-weighted, dan equal-weighted.",
"Membedakan efisiensi lemah, semi-kuat, dan kuat + implikasinya.",
"Membedakan analisis top-down vs bottom-up.",
],
"story_title": "Cerita: Margin Call di Hari Merah",
"story": """<p><strong>Andi</strong> beli saham Rp100jt dengan <strong>margin 50%</strong> (Rp50jt dana sendiri + Rp50jt pinjaman broker). Saham naik 20% → untung Rp20jt dari modal Rp50jt = <strong>+40%</strong>. <em>&ldquo;Leverage itu indah!&rdquo;</em> Ia tambah posisi. Lalu IHSG <strong>anjlok 15%</strong> sehari.</p>
<p>Twist-nya: broker menelepon — <strong>margin call</strong>. Andi harus setor dana <em>atau</em> posisinya <strong>dijual paksa di harga terendah</strong>. Leverage simetris: +40% kemarin = <strong>−60% + forced selling</strong> hari ini. Ia menjual di bottom — lalu pasar rebound minggu depannya. <strong>Margin tidak memaafkan timing yang salah.</strong> Lesson ini: mekanisme pasar yang harus dipahami sebelum dipakai.</p>""",
"concepts": [
{
"id": "mekanisme", "toc": "Order, Short & Margin",
"title": "Mekanisme — Aturan Main Lantai Bursa",
"body": """<p><strong>Definisi.</strong> <strong>Market order</strong>: eksekusi segera di harga pasar (bayar spread). <strong>Limit order</strong>: eksekusi hanya di harga/better (mungkin tidak tereksekusi). <strong>Stop order</strong>: jadi market order saat harga sentuh level (cut loss otomatis). <strong>Long</strong> = beli dulu (untung saat naik); <strong>short</strong> = pinjam &amp; jual dulu (untung saat turun; risiko <strong>tidak terbatas</strong>).</p>
<p><strong>Margin</strong>: beli dengan pinjaman broker. <strong>Margin call</strong> saat ekuitas &lt; maintenance margin → setor atau <strong>dilikuidasi paksa</strong>.</p>""",
"formulas": [
{"math": r"\text{Margin}_{aktual} = \frac{\text{Nilai posisi} - \text{Pinjaman}}{\text{Nilai posisi}}",
"symbols": [
"Initial margin (mis. 50%): dana sendiri minimum saat buka",
"Maintenance margin (mis. 25–30%): batas minimum; di bawah ini = margin call",
"Contoh Andi: posisi 100, pinjam 50 → margin 50%. Turun 15% → posisi 85 → margin (85−50)/85 = 41% (masih aman); turun 40% → margin 16,7% → call!",
]},
],
"intuisi": "Margin seperti <strong>bermain dengan uang pinjaman rentenir yang jujur</strong>: ia melipatgandakan untung DAN rugi, dan saat kamu kalah ia <strong>menjual barangmu paksa</strong> (tidak menunggu kamu 'sabar'). Short seperti <strong>menjual payung pinjaman saat kemarau</strong> — untung jika hujan, buntung tak terbatas jika kemarau panjang.",
"kapan": "Sebelum pakai leverage: hitung titik margin call-mu.",
"worked": {"title": "📐 Contoh: Titik call Andi (klik untuk buka)",
"body": """<p>Posisi Rp100jt, pinjam Rp50jt, maintenance 30%.</p>
<p><strong>Titik call:</strong> (P − 50)/P = 0,30 → P − 50 = 0,3P → 0,7P = 50 → <strong>P = Rp71,4jt</strong> (−28,6%).</p>
<p>Saham turun 30% → ekuitas tinggal Rp20jt dari modal Rp50jt = <strong>−60%</strong>, plus risiko dilikuidasi di bottom. <strong>Hitung ini SEBELUM buka posisi</strong>, bukan saat broker menelepon.</p>"""},
"charts": [],
},
{
"id": "indeks", "toc": "Indeks & Efisiensi",
"title": "Indeks — Cara Menimbang Pasar",
"body": """<p><strong>Definisi.</strong> <strong>Price-weighted</strong> (Dow): bobot = harga saham (saham Rp1jt 'lebih penting' — aneh tapi nyata). <strong>Cap-weighted</strong> (S&amp;P 500, IHSG): bobot = market cap (standar industri). <strong>Equal-weighted</strong>: semua sama (tilt ke small-cap).</p>
<p><strong>Efisiensi pasar</strong>: <em>lemah</em> (harga lampau tidak berguna → analisis teknikal mati), <em>semi-kuat</em> (semua info publik tercermin → analisis fundamental pun sulit), <em>kuat</em> (bahkan info privat tercermin — hampir tak ada yang percaya penuh).</p>""",
"formulas": [],
"intuisi": "Indeks seperti <strong>rata-rata nilai kelas</strong>: price-weighted = rata-rata nilai <em>tanpa</em> memperhatikan bobot SKS (aneh); cap-weighted = rata-rata berbobot SKS (wajar); equal = semua pelajaran dianggap sama. Efisiensi pasar = klaim 'soal ujian sudah bocor ke semua orang' — makin efisien, makin sulit dapat nilai di atas rata-rata.",
"kapan": "Pilih benchmark (PM-C5): samakan metode dengan mandatmu.",
"worked": {"title": "📐 Contoh: 3 saham, 3 indeks (klik untuk buka)",
"body": """<p>A: harga 100, cap 10T. B: harga 50, cap 30T. C: harga 200, cap 5T.</p>
<p><strong>Price-weighted</strong>: bobot by harga → C dominan (200/350 = 57%!). <strong>Cap-weighted</strong>: B dominan (30/45 = 67%). <strong>Equal</strong>: 33% masing-masing.</p>
<p>Jika C naik 10% sendirian: price-weighted melonjak (+5,7%), cap-weighted diam (+1,1%). <strong>Indeks yang sama, cerita beda</strong> — pahami metodologi benchmark-mu.</p>"""},
"charts": [
{"data": """[{x: ["A", "B", "C"], y: [28.6, 14.3, 57.1], type: "bar", marker: {color: "#2a7de1"}, name: "price-wtd"}, {x: ["A", "B", "C"], y: [22.2, 66.7, 11.1], type: "bar", marker: {color: "#e8a838"}, name: "cap-wtd"}, {x: ["A", "B", "C"], y: [33.3, 33.3, 33.3], type: "bar", marker: {color: "#16a34a"}, name: "equal"}]""",
"title": "Bobot 3 saham di 3 metode indeks (%)",
"layout": """{xaxis: {title: "Saham"}, yaxis: {title: "Bobot (%)"}, barmode: "group", showlegend: true}""",
"cara": "Tiga kelompok batang = tiga metode pembobotan untuk saham yang sama.",
"interpretasi": "C (harga termahal, cap terkecil) <strong>dominan di price-weighted (57%)</strong> tapi mungil di cap-weighted (11%). Pilih benchmark buta metodologi = mengukur dengan penggaris yang salah."},
],
},
{
"id": "analisis", "toc": "Analisis Top-Down vs Bottom-Up",
"title": "Analisis — Dari Langit atau Dari Tanah",
"body": """<p><strong>Definisi.</strong> <strong>Top-down</strong>: ekonomi → industri → perusahaan (PM-A3 → PM-A4 → pilih saham). <strong>Bottom-up</strong>: cari perusahaan bagus dulu, makro belakangan. Keduanya sah; top-down unggul saat <strong>rezim makro</strong> dominan (krisis, rate shock), bottom-up saat <strong>stock-picking</strong> idiosinkratis.</p>
<p><strong>DDM</strong> (pratinjau PM-B4): P0 = D1/(r−g) — nilai = dividen didiskon. Jembatan ke valuasi.</p>""",
"formulas": [
{"math": r"P_0 = \frac{D_1}{r-g}",
"symbols": [
"<Tex math={String.raw`D_1`} />: dividen tahun depan",
"<Tex math={String.raw`r`} />: required return (CAPM, PM-A10)",
"<Tex math={String.raw`g`} />: growth dividen (harus &lt; r!)",
"Naik g 1% ≈ naikkan nilai besar — sensitif; hanya untuk perusahaan dividen stabil",
]},
],
"intuisi": "Top-down seperti <strong>memilih kota dulu baru cari rumah</strong>; bottom-up = <strong>jatuh cinta pada rumah lalu cek kotanya</strong>. DDM seperti <strong>menilai pohon dari buahnya</strong>: buah tahunan (dividen) didiskon = harga pohon.",
"kapan": "Framework analisis: top-down untuk alokasi sektor, bottom-up untuk stock picking.",
"worked": {"title": "📐 Contoh: DDM 10 detik (klik untuk buka)",
"body": """<p>D1 = Rp500, r = 12%, g = 5%. <strong>P0 = 500/(0,12−0,05) = Rp7.143.</strong></p>
<p>Harga pasar Rp9.000 → <strong>overvalued</strong> (asumsi benar). Sensitivitas: g = 6% → P0 = Rp8.333 (+17%!). <strong>1% growth = 17% nilai</strong> — inilah kenapa asumsi g adalah medan perang analis.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Pasar efisien berarti tidak ada yang bisa mengalahkan pasar. Jadi analisis percuma.",
"benar": "Efisiensi <strong>derajat, bukan biner</strong> — dan ironisnya butuh analis aktif untuk <em>menjaga</em> efisiensi (paradoks Grossman-Stiglitz). Bentuk lemah ditolak di banyak pasar (momentum ada); semi-kuat ~berlaku untuk large-cap US, <strong>kurang untuk small-cap/EM</strong> — di situlah analis dibayar."},
{"t": "Short selling = judi; risikonya sama dengan long.",
"benar": "Long: rugi maksimal 100% (ke nol). <strong>Short: rugi tidak terbatas</strong> (harga bisa naik berkali-kali) + <strong>short squeeze</strong> (dipaksa beli saat spike). Berbeda kelas risiko — butuh disiplin &amp; position sizing ketat."},
],
"tips": [
"<strong>Hitung titik margin call sebelum buka posisi.</strong> Tulis di jurnal: 'call di −X%'. Jika X membuatmu tidak bisa tidur, kecilkan leverage. Margin call selalu datang di momen terburuk (likuiditas kering).",
"<strong>Samakan metodologi benchmark.</strong> Portofolio small-cap dibanding IHSG (cap-weighted, didominasi big banks) = salah penggaris. Pilih/buat benchmark yang mencerminkan mandatmu (PM-C5).",
],
"labs": [
{"heading": "Kalkulator Indeks 3 Metode",
"intro": "Hitung bobot price-weighted, cap-weighted, equal-weighted dari 3 saham.",
"title": "Lab 1 — Kalkulator Indeks",
"hint": "Ubah harga C 200 -> 2000 (stock split tidak disesuaikan). Lihat price-weighted kacau — itulah kelemahannya!",
"code": """# Kalkulator indeks: 3 metode pembobotan (ubah harga/cap sesukamu)
saham = {"A": (100, 10), "B": (50, 30), "C": (200, 5)}  # (harga, market cap Rp T)

tot_harga = sum(h for h, _ in saham.values())
tot_cap = sum(c for _, c in saham.values())
print(f"{'saham':<6}{'price-wtd':>10}{'cap-wtd':>10}{'equal':>10}")
for s, (h, c) in saham.items():
    print(f"{s:<6}{h/tot_harga:>9.1%}{c/tot_cap:>10.1%}{1/3:>10.1%}")
print("\\nC (harga termahal) dominan di price-weighted walau cap terkecil.")
"""},
{"heading": "Simulator Margin Call",
"intro": "Simulasikan posisi margin: turunkan harga, lihat kapan broker menelepon.",
"title": "Lab 2 — Simulator Margin Call",
"hint": "Ubah TURUN 0.30 -> 0.50. Ekuitas negatif = bukan cuma margin call, tapi UTANG ke broker!",
"code": """# Simulator margin call ala Andi
POSISI, PINJAM = 100_000_000, 50_000_000
MAINT = 0.30
TURUN = 0.30  # ubah sesukamu (0.30 = -30%)

nilai = POSISI * (1 - TURUN)
ekuitas = nilai - PINJAM
margin = ekuitas / nilai
modal_awal = POSISI - PINJAM

print(f"Harga turun {TURUN:.0%}: posisi Rp{nilai/1e6:.0f}jt, ekuitas Rp{ekuitas/1e6:.0f}jt")
print(f"Margin aktual: {margin:.1%} (maintenance {MAINT:.0%})")
print(f"Return thd modal: {(ekuitas-modal_awal)/modal_awal:+.0%}")
if margin < MAINT:
    print(">>> MARGIN CALL! Setor dana atau dilikuidasi paksa di bottom.")
else:
    call_di = 1 - PINJAM/(POSISI*(1-MAINT))
    print(f"Aman. Margin call baru di penurunan {call_di:.1%}.")
"""},
],
"decisions": [
{"kondisi": "Eksekusi cepat, tidak sensitif harga", "pakai": "Market order",
"alasan": "Kepastian eksekusi &gt; harga.",
"contoh": "Keluar darurat."},
{"kondisi": "Sensitif harga, bisa menunggu", "pakai": "Limit order",
"alasan": "Kontrol harga; risiko tidak tereksekusi.",
"contoh": "Akumulasi bertahap."},
{"kondisi": "Batasi rugi otomatis", "pakai": "Stop order",
"alasan": "Disiplin mekanis anti-serakah.",
"contoh": "Cut loss −8%."},
{"kondisi": "Mau leverage", "pakai": "Hitung titik call + sizing kecil",
"alasan": "Forced selling di bottom = mimpi buruk.",
"contoh": "Maks 20% portofolio di margin."},
],
"rule10": "<ol><li><strong>Short = risiko tak terbatas.</strong></li><li><strong>Hitung titik call</strong> sebelum leverage.</li><li><strong>Samakan metodologi</strong> benchmark.</li><li><strong>Efisiensi = derajat</strong>, bukan biner.</li></ol>",
"case": {"toc": "Mini-Case: Andi & Margin Call",
"title": "Margin Call di Hari Merah",
"body": """<p>Andi: posisi Rp100jt, margin 50% (pinjam Rp50jt), maintenance 30%. IHSG anjlok 15% sehari; ia tambah posisi. Lalu turun total 30%.</p>""",
"q": "(a) Kapan margin call? (b) Return modalnya? (c) Tiga aturan leverage yang dilanggar?",
"pembahasan": """<p>(a) <strong>Call di P = Rp71,4jt (−28,6%)</strong>: (P−50)/P = 30%. Turun 30% → margin 28,6% &lt; 30% → <strong>call</strong>.</p>
<p>(b) <strong>Ekuitas Rp20jt dari modal Rp50jt = −60%</strong>, plus forced selling di bottom sebelum rebound.</p>
<p>(c) <strong>(1)</strong> Tidak hitung titik call; <strong>(2)</strong> menambah posisi saat rugi (averaging down berleverage); <strong>(3)</strong> sizing terlalu besar untuk volatilitas IHSG. Leverage = akselerator, bukan strategi.</p>"""},
"quiz": [
{"q": "Posisi Rp100jt, pinjam Rp50jt, maintenance 30%. Margin call di penurunan?",
"options": ["15%", "28,6%", "50%", "30%"], "correct": 1,
"why": "Benar: (P−50)/P = 0,30 → P = 71,4 → turun 28,6%. Hitung SEBELUM buka posisi."},
{"q": "Risiko short selling vs long?",
"options": ["Sama", "Short: rugi tak terbatas + short squeeze", "Short lebih aman", "Short tidak bisa rugi"], "correct": 1,
"why": "Benar: long rugi maks 100%; short rugi tak terbatas (harga naik tanpa batas) + risiko dipaksa tutup saat spike."},
{"q": "Saham C: harga tertinggi tapi cap terkecil. Dominan di indeks?",
"options": ["Cap-weighted", "Price-weighted (bobot by harga)", "Equal-weighted", "Tidak ada"], "correct": 1,
"why": "Benar: price-weighted menimbang by harga — anomali Dow. Itulah kenapa standar industri = cap-weighted."},
{"q": "Bentuk efisiensi: 'harga lampau tidak berguna'. Ini?",
"options": ["Kuat", "Lemah (teknikal mati)", "Semi-kuat", "Tidak ada"], "correct": 1,
"why": "Benar: lemah = info historis tercermin. Semi-kuat = + info publik (fundamental sulit). Kuat = + privat (hampir tak dipercaya)."},
{"q": "D1 Rp500, r 12%, g 5%. Nilai DDM?",
"options": ["Rp4.167", "Rp7.143", "Rp10.000", "Rp5.000"], "correct": 1,
"why": "Benar: 500/(0,12−0,05) = 7.143. Sensitif: g 6% → 8.333 (+17%). Asumsi growth = medan perang."},
],
"rangkum": [
"<strong>Order</strong>: market (cepat), limit (harga), stop (disiplin).",
"<strong>Short</strong> = untung saat turun, risiko tak terbatas. <strong>Margin</strong> = leverage + margin call.",
"<strong>Indeks</strong>: price-weighted (aneh), cap-weighted (standar), equal-weighted (tilt small).",
"<strong>Efisiensi</strong>: lemah → semi-kuat → kuat; derajat, bukan biner.",
"<strong>DDM</strong>: P0 = D1/(r−g) — untuk dividen stabil.",
"<strong>Kapan TIDAK leverage</strong>: tanpa hitung titik call &amp; tanpa sizing.",
],
"prev": ["pm-a5-corporate-issuers", "PM-A5"],
"next": ["pm-a7-fixed-income", "PM-A7"],
},
{
"slug": "pm-a7-fixed-income", "id": "PM-A7", "track": "Portfolio Management",
"title_html": "Fixed Income:<br/>Pricing, Duration & Kredit",
"title_plain": "Fixed Income: Pricing, Yield, Duration, Risiko Kredit",
"chapter_summary": "Obligasi: pricing sebagai PV arus kas, yield measures (YTM, current, spread), duration & konveksitas sebagai risiko suku bunga, risiko kredit, dan sekuritisasi. Lab pricer obligasi + kalkulator duration.",
"tujuan": [
"Menghitung harga obligasi sebagai PV dan menjelaskan par/premium/discount.",
"Membedakan YTM, current yield, dan spread kredit.",
"Menghitung Macaulay & modified duration dan mengestimasi perubahan harga.",
"Menjelaskan waterfall sekuritisasi dan risiko tiap tranche.",
],
"story_title": "Cerita: Obligasi 'Aman' yang Turun 20%",
"story": """<p><strong>Pak Hendra</strong> membeli obligasi pemerintah 20 tahun karena &ldquo;aman &mdash; pasti dibayar&rdquo;. Kupon 6%. Setahun kemudian BI menaikkan suku bunga 2% — harga obligasinya <strong>anjlok 20%</strong>. Ia panik: <em>&ldquo;katanya aman?!&rdquo;</em></p>
<p>Twist-nya: obligasi <strong>aman dari gagal bayar</strong> ≠ <strong>aman dari risiko harga</strong>. Risiko suku bunga (duration 14 tahun!) menghantam duluan. &ldquo;Aman&rdquo; punya banyak arti — dan investor obligasi yang tidak paham duration sedang memegang <strong>bom waktu berbunga</strong>. Lesson ini: dua risiko obligasi yang berbeda.</p>""",
"concepts": [
{
"id": "pricing", "toc": "Pricing & Yield",
"title": "Pricing — Obligasi = Mesin PV",
"body": """<p><strong>Definisi.</strong> <strong>Harga obligasi</strong> = PV kupon + PV principal, didiskon pada <strong>YTM</strong>. <strong>Par</strong> (kupon = YTM), <strong>premium</strong> (kupon &gt; YTM → harga &gt; 100), <strong>discount</strong> (kupon &lt; YTM → harga &lt; 100). <strong>Current yield</strong> = kupon/harga (abaikan capital gain/loss!). <strong>Spread</strong> = YTM − yield pemerintah setenor (harga risiko kredit).</p>
<p>Aturan: <strong>yield naik → harga turun</strong> (selalu, mekanis). Tidak ada pengecualian.</p>""",
"formulas": [
{"math": r"P = \sum_{t=1}^{N}\frac{C}{(1+y)^t} + \frac{F}{(1+y)^N}",
"symbols": [
"<Tex math={String.raw`C`} />: kupon per periode",
"<Tex math={String.raw`F`} />: nilai nominal (principal)",
"<Tex math={String.raw`y`} />: YTM per periode (discount rate pasar)",
"<Tex math={String.raw`N`} />: jumlah periode hingga jatuh tempo",
]},
],
"intuisi": "Harga obligasi seperti <strong>harga mesin penghasil uang</strong>: pembeli membayar PV dari semua 'cetak uang' masa depan. Suku bunga pasar = 'harga sewa mesin waktu' (PM-A2) — sewa naik → mesin yang sama jadi lebih murah.",
"kapan": "Setiap beli obligasi: hitung YTM (bukan cuma kupon!).",
"worked": {"title": "📐 Contoh: Obligasi Pak Hendra (klik untuk buka)",
"body": """<p>Nominal Rp100jt, kupon 6%/thn, tenor 20 thn. Saat dibeli YTM 6% → <strong>harga 100 (par)</strong>.</p>
<p>YTM naik ke 8%: P = 6 × [1−1,08^−20]/0,08 + 100/1,08^20 = 6 × 9,818 + 21,45 = 58,9 + 21,45 = <strong>Rp80,36jt</strong>.</p>
<p><strong>Turun 19,6%!</strong> — dari obligasi 'aman'. Kupon tetap Rp6jt/thn, tapi harga pasar ambruk. Inilah duration risk.</p>"""},
"charts": [
{"data": """[{x: [2,4,6,8,10,12], y: [163,132,107,80,62,49], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "harga"}]""",
"title": "Harga obligasi 20 thn vs YTM (kupon 6%)",
"layout": """{xaxis: {title: "YTM (%)"}, yaxis: {title: "Harga (Rp jt)"}, showlegend: false}""",
"cara": "Sumbu X = yield pasar, Y = harga. Kurva melengkung (konveks).",
"interpretasi": "Hubungan <strong>non-linear &amp; cembung</strong>: yield 6%→8% harga −20; tapi 8%→10% 'hanya' −18. <strong>Konveksitas</strong> = kabar baik: penurunan melambat. Duration mengukur kemiringan; konveksitas mengukur kelengkungannya."},
],
},
{
"id": "duration", "toc": "Duration & Konveksitas",
"title": "Duration — Pengukur Nyeri Suku Bunga",
"body": """<p><strong>Definisi.</strong> <strong>Macaulay duration</strong> = rata-rata tertimbang waktu arus kas (tahun). <strong>Modified duration</strong> = MacDur/(1+y) → <strong>ΔP/P ≈ −D_mod × Δy</strong>. <strong>Konveksitas</strong> = koreksi orde-2 (kurva, bukan garis).</p>
<p>Aturan praktis: <strong>duration ≈ % perubahan harga per 1% perubahan yield</strong> (tanda negatif). D_mod 14 → yield +1% ≈ harga −14%.</p>""",
"formulas": [
{"math": r"\frac{\Delta P}{P} \approx -D_{mod} \times \Delta y",
"symbols": [
"<Tex math={String.raw`D_{mod}`} />: modified duration (tahun)",
"<Tex math={String.raw`\\Delta y`} />: perubahan yield (desimal: 1% = 0,01)",
"Tanda negatif: yield naik → harga turun (selalu!)",
"Obligasi Pak Hendra: D_mod ≈ 14 → Δy +2% ≈ −28% (aktual −19,6%; sisanya koreksi konveksitas)",
]},
],
"intuisi": "Duration seperti <strong>panjang jungkat-jungkit</strong>: makin panjang tenor/kupon kecil → jungkat-jungkit makin panjang → goyangan suku bunga sedikit membuat ujung (harga) terlempar jauh. Konveksitas = peredam kejutnya.",
"kapan": "Kelola risiko suku bunga: samakan duration dengan horizon (PM-C7 immunization).",
"worked": {"title": "📐 Contoh: Bandingkan 3 obligasi (klik untuk buka)",
"body": """<p>YTM naik 1%. <strong>A</strong> (2 thn, D_mod 1,9): −1,9%. <strong>B</strong> (10 thn, D_mod 7,5): −7,5%. <strong>C</strong> (20 thn, D_mod 14): <strong>−14%</strong>.</p>
<p>Untuk <strong>dana pensiun</strong> (horizon panjang): C cocok (match liabilities). Untuk <strong>dana darurat</strong>: A saja. <strong>Duration = alat, bukan musuh</strong> — cocokkan dengan horizon.</p>"""},
"charts": [],
},
{
"id": "kredit", "toc": "Risiko Kredit & Sekuritisasi",
"title": "Kredit & Sekuritisasi — Siapa Dibayar Duluan",
"body": """<p><strong>Definisi.</strong> <strong>Risiko kredit</strong>: default, downgrade, spread widening. <strong>Rating</strong> (AAA → D): opini kemampuan bayar. <strong>Sekuritisasi</strong>: kumpulkan pinjaman → jual sebagai <strong>tranches</strong>: <em>senior</em> (dibayar pertama, rating tinggi), <em>mezzanine</em>, <em>equity/first-loss</em> (dibayar terakhir, return tertinggi).</p>
<p><strong>Waterfall</strong>: kerugian dimakan dari bawah (equity) ke atas. Senior 'aman' <em>selama</em> kerugian &lt; buffer di bawahnya — 2008 membuktikan buffer bisa jebol.</p>""",
"formulas": [],
"intuisi": "Sekuritisasi seperti <strong>menara gelas sampanye</strong>: dituang dari atas (arus kas masuk), diminum dari... sebenarnya dibayar dari atas (senior) dulu. Kerugian = retakan: mulai dari gelas paling bawah (equity). Retakan besar = merambat ke atas.",
"kapan": "Analisis obligasi korporasi & structured products: selalu tanya 'di tranche mana saya?'",
"worked": {"title": "📐 Contoh: Waterfall Rp100M (klik untuk buka)",
"body": """<p>Pool KPR Rp100M: senior Rp80M, mezz Rp15M, equity Rp5M. Gagal bayar Rp12M.</p>
<p><strong>Equity</strong> (Rp5M) habis total. <strong>Mezz</strong> menanggung Rp7M → sisa Rp8M. <strong>Senior</strong> utuh Rp80M.</p>
<p>Gagal bayar Rp25M → equity habis, mezz habis, <strong>senior rugi Rp5M</strong>. 'Aman' senior = relatif terhadap buffer. <strong>Selalu hitung break-even loss</strong> tiap tranche.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Obligasi pemerintah = investasi aman, tidak bisa rugi.",
"benar": "Aman dari <strong>default</strong> ≠ aman dari <strong>risiko harga &amp; inflasi</strong>. Pak Hendra: −20% karena duration. Plus <strong>risiko reinvestasi</strong> (kupon diinvestasikan di yield lebih rendah) dan <strong>inflasi</strong> (kupon 6% − inflasi 5% = riil 1%). 'Aman' = spesifikasikan dari apa."},
{"t": "Kupon tinggi = return tinggi. Beli saja kupon terbesar.",
"benar": "Return = <strong>YTM</strong>, bukan kupon. Obligasi kupon 12% di harga 130 (premium) bisa YTM-nya 6% — sama dengan kupon 6% di harga 100. Kupon tinggi + harga premium = ilusi. Selalu bandingkan YTM setara tenor &amp; risiko."},
],
"tips": [
"<strong>Duration dulu, kupon kemudian.</strong> Sebelum beli obligasi, tanya: 'berapa D_mod-nya dan cocok tidak dengan horizon saya?' Investor yang hanya lihat kupon = Pak Hendra berikutnya.",
"<strong>Spread adalah harga ketakutan.</strong> Spread melebar 200bps = pasar menuntut kompensasi default lebih besar. Bandingkan spread historis: beli saat spread lebar (takut berlebihan) = strategi credit value.",
],
"labs": [
{"heading": "Pricer Obligasi + Solver YTM",
"intro": "Hitung harga dari YTM, atau cari YTM dari harga (biseksi).",
"title": "Lab 1 — Pricer Obligasi",
"hint": "Ubah YTM 0.06 -> 0.08. Harga jatuh ~20% — rasakan duration 20 tahun!",
"code": """# Pricer obligasi + solver YTM (biseksi)
F, KUPON, N = 100, 6, 20   # nominal Rp jt, kupon/thn, tenor
YTM = 0.06                  # ubah sesukamu

def harga(ytm):
    return sum(KUPON/(1+ytm)**t for t in range(1, N+1)) + F/(1+ytm)**N

p = harga(YTM)
status = "PAR" if abs(p-F) < 0.01 else ("PREMIUM" if p > F else "DISCOUNT")
print(f"YTM {YTM:.0%}: harga Rp{p:.2f}jt [{status}]")

# solver: harga pasar 80.36 -> YTM berapa?
target = 80.36
lo, hi = 0.0, 0.30
for _ in range(60):
    mid = (lo+hi)/2
    lo, hi = (mid, hi) if harga(mid) > target else (lo, mid)
print(f"Harga Rp{target}jt -> YTM {(lo+hi)/2:.2%} (cek: Rp{harga((lo+hi)/2):.2f}jt)")
"""},
{"heading": "Kalkulator Duration",
"intro": "Hitung Macaulay & modified duration, estimasi perubahan harga.",
"title": "Lab 2 — Kalkulator Duration",
"hint": "Ubah N 20 -> 5. D_mod anjlok — itulah kenapa dana pendek pilih tenor pendek.",
"code": """# Duration: Macaulay & modified
F, KUPON, N, YTM = 100, 6, 20, 0.06  # ubah N sesukamu

cf = [(t, KUPON if t < N else KUPON+F) for t in range(1, N+1)]
pv = [(t, c/(1+YTM)**t) for t, c in cf]
P = sum(v for _, v in pv)
mac = sum(t*v for t, v in pv)/P
dmod = mac/(1+YTM)

print(f"Harga: Rp{P:.2f}jt | Macaulay: {mac:.2f} thn | Modified: {dmod:.2f}")
for dy in [0.01, 0.02, -0.01]:
    est = -dmod*dy
    aktual = (sum(c/(1+YTM+dy)**t for t, c in cf)-P)/P
    print(f"Yield {dy:+.0%}: estimasi {est:+.1%}, aktual {aktual:+.1%} (selisih=konveksitas)")
"""},
],
"decisions": [
{"kondisi": "Horizon panjang (pensiun)", "pakai": "Duration panjang (match liabilities)",
"alasan": "Perubahan harga obligasi mengimbangi perubahan nilai liabilities.",
"contoh": "Immunization (PM-C7)."},
{"kondisi": "Butuh likuiditas / takut rate naik", "pakai": "Duration pendek / floating-rate",
"alasan": "Harga stabil saat yield bergerak.",
"contoh": "Dana darurat di obligasi 1–2 thn."},
{"kondisi": "Spread melebar historis", "pakai": "Tambah eksposur kredit berkualitas",
"alasan": "Kompensasi ketakutan berlebihan.",
"contoh": "IG bonds saat krisis."},
{"kondisi": "Beli structured product", "pakai": "Tanya tranche & break-even loss",
"alasan": "'Aman' senior = relatif terhadap buffer.",
"contoh": "Hitung waterfall sendiri."},
],
"rule10": "<ol><li><strong>Yield naik → harga turun.</strong> Selalu.</li><li><strong>Bandingkan YTM</strong>, bukan kupon.</li><li><strong>Duration ≈ sensitivitas</strong> — cocokkan horizon.</li><li><strong>Tanya tranche</strong> di sekuritisasi.</li></ol>",
"case": {"toc": "Mini-Case: Pak Hendra",
"title": "Obligasi 'Aman' −20%",
"body": """<p>Pak Hendra: obligasi 20 thn kupon 6%, beli di par (YTM 6%). Yield naik ke 8% → harga −20%.</p>""",
"q": "(a) Hitung harga baru. (b) Dua risiko yang ia abaikan? (c) Obligasi apa yang cocok untuknya (pensiunan butuh stabil)?",
"pembahasan": """<p>(a) <strong>Rp80,36jt</strong> (−19,6%): 6×9,818 + 21,45.</p>
<p>(b) <strong>Duration risk</strong> (D_mod ~14) dan <strong>inflation risk</strong> (riil return tipis). 'Aman default' ≠ 'aman harga'.</p>
<p>(c) <strong>Laddering tenor pendek-menengah</strong> (1–5 thn, D_mod ~3) atau <strong>reksadana pendapatan tetap</strong> durasi pendek. Prinsip: <strong>duration ≤ horizon kebutuhan kas</strong>.</p>"""},
"quiz": [
{"q": "Obligasi 20 thn kupon 6%, YTM naik 6%→8%. Harga?",
"options": ["Tetap 100", "≈ Rp80,4jt (−20%)", "Rp120jt", "Rp90jt"], "correct": 1,
"why": "Benar: 6×9,818+21,45 = 80,36. Duration panjang = sensitivitas brutal. Inilah pelajaran Pak Hendra."},
{"q": "D_mod = 7,5. Yield naik 1%. Estimasi perubahan harga?",
"options": ["+7,5%", "−7,5%", "−1%", "Tidak berubah"], "correct": 1,
"why": "Benar: ΔP/P ≈ −D_mod × Δy = −7,5%. Tanda negatif selalu — yield naik, harga turun."},
{"q": "Kupon 12% harga 130 vs kupon 6% harga 100, tenor & risiko sama. Mana return lebih tinggi?",
"options": ["Kupon 12%", "Sama (YTM yang menentukan, bukan kupon)", "Kupon 6%", "Tidak bisa tahu"], "correct": 1,
"why": "Benar: harga premium 130 'memakan' kupon besarnya. Bandingkan YTM — kupon tanpa harga = ilusi."},
{"q": "Pool Rp100M: senior 80, mezz 15, equity 5. Loss Rp12M. Yang rugi?",
"options": ["Senior rugi 12", "Equity habis (5) + mezz rugi 7; senior utuh", "Dibagi rata", "Tidak ada yang rugi"], "correct": 1,
"why": "Benar: waterfall — kerugian dimakan dari bawah. Senior aman selama loss &lt; Rp20M (buffer equity+mezz)."},
{"q": "Investor pensiun butuh pembayaran 20 tahun lagi. Strategi duration?",
"options": ["Duration sependek mungkin", "Match: duration panjang ≈ horizon (immunization)", "Tidak peduli duration", "Hanya deposito"], "correct": 1,
"why": "Benar: duration panjang mengimbangi liabilities panjang — kenaikan yield menurunkan harga obligasi TAPI juga menurunkan PV kewajiban. Match = kebal."},
],
"rangkum": [
"<strong>Harga</strong> = PV kupon + principal; par/premium/discount vs YTM.",
"<strong>YTM</strong> = return sebenarnya; current yield menipu; spread = harga risiko kredit.",
"<strong>Duration</strong>: ΔP/P ≈ −D_mod × Δy; konveksitas = koreksi lengkung.",
"<strong>Risiko obligasi</strong>: suku bunga, kredit, inflasi, reinvestasi, likuiditas.",
"<strong>Sekuritisasi</strong>: waterfall — kerugian dari bawah (equity) ke atas.",
"<strong>Aturan</strong>: duration ≤ horizon; tanya tranche; bandingkan YTM.",
],
"prev": ["pm-a6-equity", "PM-A6"],
"next": ["pm-a8-derivatives", "PM-A8"],
},
{
"slug": "pm-a8-derivatives", "id": "PM-A8", "track": "Portfolio Management",
"title_html": "Derivatives:<br/>Forward, Swap & Opsi",
"title_plain": "Derivatives: Forward, Futures, Swap, Opsi",
"chapter_summary": "Derivatif: no-arbitrage pricing forward/futures, marking-to-market futures, interest rate swap, payoff opsi call/put, nilai intrinsik vs waktu, dan put-call parity. Lab forward pricer & payoff opsi.",
"tujuan": [
"Menjelaskan prinsip no-arbitrage dan menghitung harga forward.",
"Membedakan forward vs futures (marking to market).",
"Menjelaskan mekanisme interest rate swap.",
"Menghitung payoff opsi dan memverifikasi put-call parity.",
],
"story_title": "Cerita: Eksportir yang 'Bermain Aman' Malah Spekulasi",
"story": """<p><strong>PT KopiNusa</strong> mengekspor kopi senilai <strong>USD 1 juta</strong>, dibayar 3 bulan lagi. Direktur keuangan <em>&ldquo;bermain aman&rdquo;</em>: tidak hedging — <em>&ldquo;kan rupiah biasanya melemah, malah untung.&rdquo;</em> Tiga bulan kemudian rupiah <strong>menguat 8%</strong> — pendapatan susut Rp1,3 miliar.</p>
<p>Twist-nya: <strong>tidak hedging = keputusan spekulasi</strong>. Ia bertaruh rupiah melemah — tanpa premi, tanpa analisis, tanpa mandat. 'Bermain aman' yang sebenarnya = <strong>mengunci kurs via forward</strong> (biaya diketahui, tidur nyenyak). Derivatif bukan alat judi; <strong>tidak memakainya pun adalah posisi</strong>. Lesson ini: instrumen pengunci risiko.</p>""",
"concepts": [
{
"id": "forward", "toc": "Forward & Futures",
"title": "Forward — Janji Harga Hari Ini",
"body": """<p><strong>Definisi.</strong> <strong>Forward</strong>: kontrak <em>custom</em> (OTC) beli/jual aset di masa depan pada harga yang disepakati kini. <strong>No-arbitrage</strong>: F = S(1+r)^T — jika tidak, arbitrase (pinjam, beli spot, jual forward). <strong>Futures</strong>: forward yang <em>terstandar</em> di bursa + <strong>marking to market harian</strong> (untung/rugi disettle tiap hari → risiko kredit kecil).</p>
<p>KopiNusa: jual USD 1jt forward 3 bulan → kurs terkunci, tidur nyenyak.</p>""",
"formulas": [
{"math": r"F = S(1+r)^T",
"symbols": [
"<Tex math={String.raw`F`} />: harga forward",
"<Tex math={String.raw`S`} />: harga spot kini",
"<Tex math={String.raw`r`} />: risk-free rate per periode",
"<Tex math={String.raw`T`} />: tenor (tahun)",
"Logika: biaya 'membawa' aset ke masa depan (cost of carry); jika F menyimpang → arbitrase",
]},
],
"intuisi": "Forward seperti <strong>memesan tiket dengan harga dikunci</strong>: bayar nanti, harga kini. No-arbitrage = 'tidak ada makan siang gratis': jika tiket forward terlalu murah, calo (arbitrager) borong sampai harganya wajar.",
"kapan": "Hedging FX/komoditas (PM-C9); dasar semua pricing derivatif.",
"worked": {"title": "📐 Contoh: Forward KopiNusa (klik untuk buka)",
"body": """<p>S = Rp16.000/USD, r_IDD = 6% p.a., r_USD = 5% p.a., T = 0,25 thn. (FX forward memakai selisih suku bunga.)</p>
<p><strong>F</strong> = 16.000 × (1,06/1,05)^0,25 ≈ 16.000 × 1,00237 = <strong>Rp16.038</strong>.</p>
<p>KopiNusa mengunci Rp16,038M untuk USD 1jt. Rupiah menguat ke 15.000? <strong>Tidak peduli</strong> — Rp16,038M pasti. Melemah ke 17.000? Juga Rp16,038M — <strong>hedging = melepas upside demi kepastian</strong>.</p>"""},
"charts": [],
},
{
"id": "swap", "toc": "Swap",
"title": "Swap — Tukar Arus Kas",
"body": """<p><strong>Definisi.</strong> <strong>Interest rate swap</strong> (plain vanilla): tukar <strong>bunga tetap ↔ mengambang</strong> atas <em>notional</em> yang sama (notional tidak dipertukarkan!). Pihak bayar-fixed = 'membeli kepastian'; bayar-floating = 'berjudi rate turun'.</p>
<p>Kegunaan: perusahaan berutang floating → swap ke fixed = <strong>kunci biaya bunga</strong> (seperti forward untuk suku bunga).</p>""",
"formulas": [],
"intuisi": "Swap seperti <strong>tukar langganan</strong>: kamu langganan 'harga pasar' (floating, naik-turun), temanmu langganan 'harga tetap' (fixed). Kalian tukar tagihan — masing-masing dapat yang diinginkan. Notional = 'nilai langganan' yang tidak berpindah tangan.",
"kapan": "Kelola risiko suku bunga korporasi; dasar credit default swap (PM-B5).",
"worked": {"title": "📐 Contoh: Swap SinarAbadi (klik untuk buka)",
"body": """<p>SinarAbadi utang Rp400M floating (JIBOR+2%). Takut rate naik → swap: <strong>bayar fixed 8%</strong>, terima floating.</p>
<p><strong>Net:</strong> bayar ke bank (JIBOR+2%), terima dari swap (JIBOR), bayar ke swap (8%) → <strong>net = 10% fixed</strong>. Biaya bunga terkunci Rp40M/thn.</p>
<p>JIBOR naik ke 9%? Tetap bayar 10%. Turun ke 3%? Tetap 10% — <strong>kepastian ada harganya</strong> (upside dilepas).</p>"""},
"charts": [],
},
{
"id": "opsi", "toc": "Opsi: Call & Put",
"title": "Opsi — Hak, Bukan Kewajiban",
"body": """<p><strong>Definisi.</strong> <strong>Call</strong> = hak beli di strike X (untung jika S &gt; X). <strong>Put</strong> = hak jual di X (untung jika S &lt; X). <strong>Payoff call</strong> = max(S−X, 0); <strong>put</strong> = max(X−S, 0). <strong>Nilai opsi</strong> = <em>intrinsic</em> (payoff kini) + <em>time value</em> (peluang masa depan; → 0 saat expiry).</p>
<p><strong>Put-call parity</strong>: C + PV(X) = P + S — hubungan arbitrase call &amp; put Eropa. Jika dilanggar → arbitrase.</p>""",
"formulas": [
{"math": r"C + \frac{X}{(1+r)^T} = P + S",
"symbols": [
"<Tex math={String.raw`C, P`} />: harga call &amp; put Eropa (strike &amp; expiry sama)",
"<Tex math={String.raw`X`} />: strike price",
"<Tex math={String.raw`S`} />: harga spot underlying",
"Parity = 'dua jalan menuju Roma': call + kas = put + saham (portofolio ekuivalen)",
]},
],
"intuisi": "Opsi seperti <strong>uang muka (DP) rumah</strong>: bayar premi kecil untuk <em>hak</em> beli di harga X. Harga naik → eksekusi (untung besar dari modal kecil). Harga turun → tinggalkan (rugi cuma DP). <strong>Rugi terbatas, untung tidak</strong> — kebalikan short selling.",
"kapan": "Proteksi portofolio (protective put, PM-C9); spekulasi terukur; income (covered call).",
"worked": {"title": "📐 Contoh: Protective put (klik untuk buka)",
"body": """<p>Pegang saham Rp10.000. Beli put X=9.000 premi Rp300.</p>
<p><strong>Saham jatuh ke 7.000:</strong> put payoff = 2.000 − premi 300 = +1.700 → net −1.300 (bukan −3.000!). <strong>Asuransi bekerja.</strong></p>
<p><strong>Saham naik ke 12.000:</strong> put hangus (−300), saham +2.000 → net +1.700. <strong>Premi = harga tidur nyenyak.</strong></p>"""},
"charts": [
{"data": """[{x: [7000,8000,9000,10000,11000,12000], y: [0,0,0,1000,2000,3000], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "call X=9000"}, {x: [7000,8000,9000,10000,11000,12000], y: [2000,1000,0,0,0,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "put X=9000"}]""",
"title": "Payoff call & put (strike 9.000)",
"layout": """{xaxis: {title: "Harga saham saat expiry"}, yaxis: {title: "Payoff"}, showlegend: true}""",
"cara": "Sumbu X = harga saham saat jatuh tempo. Biru = call, kuning = put.",
"interpretasi": "Hockey stick: call <strong>datar di bawah strike</strong> (rugi maks = premi) lalu naik 1:1. Put kebalikannya. <strong>Asimetri</strong> inilah yang dibayar via premi — dan kenapa opsi = asuransi, bukan lotre (jika dipakai benar)."},
],
},
],
"myths": [
{"t": "Derivatif = judi / spekulasi. Perusahaan sehat tidak memakainya.",
"benar": "KopiNusa <em>tidak</em> hedging = <strong>spekulasi</strong> (bertaruh pada arah rupiah). Derivatif adalah <strong>alat</strong>: pisau bisa untuk masak atau melukai. Maskapai hedging avtur, eksportir hedging FX — itu <strong>manajemen risiko</strong>, bukan judi. Yang berjudi = yang membiarkan eksposur terbuka."},
{"t": "Beli opsi = rugi pasti sebesar premi jika harga tidak bergerak.",
"benar": "Premi = <strong>harga asuransi + time value</strong>. Protective put yang 'hangus' saat pasar naik = premi asuransi rumah yang tidak kebakaran — <strong>bukan kerugian, melainkan biaya tidur nyenyak</strong>. Nilai opsi dinilai dari <em>proteksi yang diberikan</em>, bukan dari payoff-nya saja."},
],
"tips": [
"<strong>Selalu tanya: 'eksposur apa yang saya kunci, dan upside apa yang saya lepas?'</strong> Hedging sempurna = tidak ada kejutan dua arah. Jika masih bisa 'kejutan enak', itu bukan hedge penuh.",
"<strong>Bedakan American vs European.</strong> American = bisa eksekusi kapan saja (lebih mahal); European = hanya saat expiry (put-call parity hanya untuk European!). Salah jenis = salah harga.",
],
"labs": [
{"heading": "Pricer Forward + Detektor Arbitrase",
"intro": "Hitung harga forward no-arbitrage dan cek apakah quote pasar bisa diarbitrase.",
"title": "Lab 1 — Pricer Forward",
"hint": "Ubah QUOTE 16500 -> 16038 (sesuai hitungan). Arbitrase hilang — harga wajar!",
"code": """# Forward pricing & deteksi arbitrase
S, R, T = 16000, 0.06, 0.25   # spot, risk-free, tenor (tahun)
QUOTE = 16500                  # quote pasar (ubah sesukamu)

F = S * (1 + R)**T
print(f"Harga forward wajar: Rp{F:,.0f}")
print(f"Quote pasar         : Rp{QUOTE:,.0f}")
if QUOTE > F * 1.001:
    print("-> Quote KEMAHALAN: jual forward, beli spot (pinjam dana). Arbitrase!")
elif QUOTE < F * 0.999:
    print("-> Quote KEMURAHAN: beli forward, jual spot. Arbitrase!")
else:
    print("-> Wajar (dalam 0.1%). Tidak ada arbitrase.")
print("\\nPrinsip: harga derivatif = harga 'membawa' aset (cost of carry).")
"""},
{"heading": "Payoff Opsi & Put-Call Parity",
"intro": "Hitung payoff call/put di berbagai harga dan verifikasi put-call parity.",
"title": "Lab 2 — Payoff Opsi",
"hint": "Ubah PUT 83 -> 700 (parity dilanggar). Lihat arbitrase muncul \u2014 pasar akan mengoreksinya!",
"code": """# Payoff opsi & put-call parity
S, X, R, T = 10000, 9000, 0.05, 0.5
CALL, PUT = 1300, 83  # harga pasar (paritas OK; ubah PUT untuk melanggar!)

print("Payoff saat expiry:")
for st in [7000, 9000, 10000, 12000]:
    c = max(st - X, 0); p = max(X - st, 0)
    print(f"  S={st}: call={c}, put={p}")

pvx = X / (1 + R)**T
kiri, kanan = CALL + pvx, PUT + S
print(f"\\nParity: C+PV(X)={kiri:.0f} vs P+S={kanan:.0f}")
print("PARITY OK (tidak ada arbitrase)" if abs(kiri-kanan) < 1 else "PARITY DILANGGAR -> arbitrase!")
"""},
],
"decisions": [
{"kondisi": "Eksposur FX/komoditas pasti (piutang/utang)", "pakai": "Forward (lock)",
"alasan": "Kepastian arus kas &gt; spekulasi arah.",
"contoh": "KopiNusa kunci kurs."},
{"kondisi": "Takut rugi besar tapi mau upside", "pakai": "Beli put (proteksi)",
"alasan": "Asimetri: rugi terbatas premi.",
"contoh": "Protective put portofolio."},
{"kondisi": "Utang floating, takut rate naik", "pakai": "IRS: bayar fixed",
"alasan": "Kunci biaya bunga.",
"contoh": "SinarAbadi swap ke 10% fixed."},
{"kondisi": "Mau income dari saham yang dimiliki", "pakai": "Covered call (jual call)",
"alasan": "Premi = income; upside dibatasi.",
"contoh": "Saham sideways."},
],
"rule10": "<ol><li><strong>Tidak hedge = spekulasi.</strong></li><li><strong>F = S(1+r)^T</strong> — no free lunch.</li><li><strong>Opsi = hak</strong>; rugi maks = premi.</li><li><strong>Parity</strong> hanya European.</li></ol>",
"case": {"toc": "Mini-Case: KopiNusa",
"title": "Eksportir yang 'Bermain Aman'",
"body": """<p>KopiNusa: piutang USD 1jt/3 bulan, tidak hedging ('rupiah biasanya melemah'). Rupiah menguat 8% → rugi Rp1,3M.</p>""",
"q": "(a) Kenapa 'tidak hedging' = spekulasi? (b) Rancang hedge forward (S=16.000, r_IDD 6%, r_USD 5%). (c) Kapan tidak hedging dibenarkan?",
"pembahasan": """<p>(a) <strong>Eksposur terbuka = taruhan arah.</strong> 'Biasanya melemah' = view tanpa mandat/analisis. Keputusan pasif tetap keputusan.</p>
<p>(b) <strong>Jual USD 1jt forward @ ~Rp16.038</strong> → terima Rp16,038M pasti. Biaya = forward points (selisih bunga) + melepas upside.</p>
<p>(c) Jika <strong>kebijakan treasury</strong> menyatakan toleransi (mis. eksposur &lt; Rp5M tidak di-hedge karena biaya &gt; manfaat) — <strong>keputusan sadar by policy</strong>, bukan kelalaian.</p>"""},
"quiz": [
{"q": "S=16.000, r=6%, T=0,25. Harga forward wajar?",
"options": ["16.000", "≈ 16.238", "15.800", "17.000"], "correct": 1,
"why": "Benar: 16.000×1,06^0,25 = 16.238. (Untuk FX pakai selisih dua suku bunga — di sini disederhanakan satu rate.)"},
{"q": "Bedakan forward vs futures.",
"options": ["Sama saja", "Futures: terstandar di bursa + marking to market harian", "Forward diperdagangkan di bursa", "Futures tidak ada risiko"], "correct": 1,
"why": "Benar: futures = forward versi bursa: standar + settlement harian → risiko kredit kecil. Forward = custom OTC, risiko counterparty."},
{"q": "Beli put X=9.000 premi 300, saham jatuh ke 7.000. Net (pegang saham)?",
"options": ["−3.000", "−1.300 (asuransi bekerja)", "+1.700", "−300"], "correct": 1,
"why": "Benar: saham −3.000, put payoff +2.000, premi −300 → net −1.300. Bukan +1.700 (itu jika tidak pegang saham)."},
{"q": "Put-call parity dilanggar (C+PV(X) &gt; P+S). Tindakan?",
"options": ["Diam", "Arbitrase: jual sisi mahal, beli sisi murah", "Beli keduanya", "Jual keduanya"], "correct": 1,
"why": "Benar: parity = hubungan no-arbitrage. Pelanggaran = makan siang gratis sesaat — jual call+kas (mahal), beli put+saham (murah)."},
{"q": "Perusahaan utang floating takut suku bunga naik. Solusi?",
"options": ["Biarkan", "IRS: bayar fixed, terima floating", "Beli call", "Jual saham"], "correct": 1,
"why": "Benar: swap mengubah floating → fixed, mengunci biaya bunga. Seperti forward, tapi untuk suku bunga."},
],
"rangkum": [
"<strong>Forward</strong>: F = S(1+r)^T; custom OTC. <strong>Futures</strong>: standar + marking to market.",
"<strong>Swap</strong>: tukar fixed ↔ floating; notional tidak berpindah.",
"<strong>Opsi</strong>: call = hak beli, put = hak jual; payoff hockey stick; nilai = intrinsic + time.",
"<strong>Put-call parity</strong> (Eropa): C + PV(X) = P + S.",
"<strong>Tidak hedging = spekulasi</strong> — keputusan pasif tetap keputusan.",
"<strong>Kapan TIDAK derivatif</strong>: eksposur kecil &lt; biaya transaksi (by policy).",
],
"prev": ["pm-a7-fixed-income", "PM-A7"],
"next": ["pm-a9-alternatives", "PM-A9"],
},
{
"slug": "pm-a9-alternatives", "id": "PM-A9", "track": "Portfolio Management",
"title_html": "Alternative Investments:<br/>di Luar Saham-Obligasi",
"title_plain": "Alternative Investments: RE, PE, Hedge Fund, Komoditas",
"chapter_summary": "Aset alternatif: karakteristik (illikuiditas, lockup, fee), real estate & private equity (NAV, TVPI/DPI), hedge fund strategies, komoditas (contango/backwardation), dan aset digital. Lab kalkulator PE multiples & fee drag.",
"tujuan": [
"Menjelaskan karakteristik khas alternatif vs tradisional.",
"Menghitung TVPI, DPI, RVPI dan menjelaskan J-curve.",
"Menghitung fee drag struktur 2-and-20.",
"Membedakan contango vs backwardation dan implikasinya.",
],
"story_title": "Cerita: Private Equity yang 'Untung 3x' Tapi Kalah dari Saham",
"story": """<p><strong>Bu Lina</strong> berinvestasi di private equity: <strong>&ldquo;modal kembali 3x lipat!&rdquo;</strong> dalam 10 tahun. Ia pamer ke teman-temannya yang cuma dapat 2x dari reksadana saham.</p>
<p>Twist-nya: <strong>3x dalam 10 tahun = IRR ~11,6%</strong> — sementara reksadana saham temannya 2x dalam <strong>6 tahun</strong> = IRR ~12,2%! Ditambah PE <strong>tidak likuid 10 tahun</strong> (tidak bisa jual saat butuh) dan <strong>fee 2-and-20</strong>. &ldquo;3x&rdquo; terdengar hebat sampai dihitung <strong>per tahun</strong> dan <strong>disesuaikan likuiditas</strong>. Lesson ini: matematika alternatif yang jujur.</p>""",
"concepts": [
{
"id": "karakter", "toc": "Karakteristik Alternatif",
"title": "Karakteristik — Beda Dunia",
"body": """<p><strong>Definisi.</strong> <strong>Alternatif</strong> = di luar saham/obligasi/kas: real estate, PE, hedge fund, komoditas, infrastruktur, aset digital. Ciri: <strong>illikuid</strong> (lockup tahunan), <strong>fee tinggi</strong> (2-and-20: 2% management + 20% performance di atas hurdle), <strong>valuasi appraisal</strong> (tidak mark-to-market harian → volatilitas <em>tampak</em> rendah = <strong>smoothing!</strong>), <strong>J-curve</strong> (rugi di awal: fee + investasi, untung belakangan).</p>
<p><strong>Illiquidity premium</strong>: return ekstra sebagai kompensasi tidak bisa jual — harus &gt; 0 untuk worth it.</p>""",
"formulas": [],
"intuisi": "Alternatif seperti <strong>deposito berjangka 10 tahun</strong>: bunganya harus lebih tinggi dari tabungan (illiquidity premium), tidak bisa diambil mendadak, dan 'bunga' awal negatif (fee dulu). Jika return-nya sama dengan saham likuid — <strong>ngapain dikunci?</strong>",
"kapan": "Alokasi alternatif: hanya jika premium &gt; biaya illikuiditas + fee.",
"worked": {"title": "📐 Contoh: Hitung Bu Lina (klik untuk buka)",
"body": """<p>PE: 3x dalam 10 thn → IRR = 3^(1/10) − 1 = <strong>11,6%</strong>. Saham: 2x dalam 6 thn → 2^(1/6) − 1 = <strong>12,2%</strong>.</p>
<p><strong>Saham menang</strong> — dengan likuiditas penuh! PE harusnya memberi <strong>illiquidity premium</strong> ~3–4% di atas saham. Di sini malah <em>diskon</em>.</p>
<p>Pelajaran: <strong>multiple tanpa waktu = menipu</strong>. Selalu annualize (IRR) dan bandingkan dengan alternatif likuid.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8,9,10], y: [-8,-12,-5,2,10,25,45,70,100,200], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "net cash flow kumulatif (%)"}]""",
"title": "J-curve private equity (ilustrasi)",
"layout": """{xaxis: {title: "Tahun"}, yaxis: {title: "Net cash flow kumulatif (% modal)"}, showlegend: false}""",
"cara": "Sumbu X = tahun, Y = kas kumulatif (negatif = setor modal + fee).",
"interpretasi": "Tahun 1–3 <strong>negatif</strong> (capital call + fee, belum ada exit) — inilah J-curve. Investor yang tidak paham panik di tahun 2 ('kok rugi?!'). <strong>Uji kesabaran</strong>: hanya untuk modal yang benar-benar tidak dibutuhkan 10 tahun."},
],
},
{
"id": "repe", "toc": "RE & Private Equity",
"title": "Real Estate & PE — Aset Nyata, Uang Terkunci",
"body": """<p><strong>Definisi.</strong> <strong>Cap rate</strong> = NOI/harga properti (yield properti). <strong>NAV</strong> = nilai aset − utang (REIT diperdagangkan di diskon/premium ke NAV). <strong>PE multiples</strong>: <strong>TVPI</strong> = (distribusi + NAV sisa)/paid-in; <strong>DPI</strong> = distribusi/paid-in (kas <em>nyata</em> kembali); <strong>RVPI</strong> = NAV sisa/paid-in. TVPI = DPI + RVPI.</p>
<p><strong>DPI &gt; 1</strong> = sudah balik modal tunai. RVPI = 'janji' (belum cair).</p>""",
"formulas": [
{"math": r"TVPI = DPI + RVPI = \frac{\text{Distribusi} + \text{NAV}_{sisa}}{\text{Paid-in}}",
"symbols": [
"<Tex math={String.raw`DPI`} />: distributed — kas yang SUDAH kembali (fakta)",
"<Tex math={String.raw`RVPI`} />: residual — nilai sisa di kertas (opini/appraisal)",
"TVPI 3,0x dengan DPI 0,2x = 'untung di kertas, kas belum kembali'",
]},
],
"intuisi": "PE multiples seperti <strong>rapor proyek kost</strong>: DPI = uang sewa yang sudah masuk kantong; RVPI = 'harga kost naik' menurut makelar; TVPI = totalnya. <strong>Kantong tidak bisa dibohongi</strong> — kejar DPI, bukan TVPI.",
"kapan": "Evaluasi fund PE/VC: DPI + IRR, bukan TVPI saja.",
"worked": {"title": "📐 Contoh: Fund X (klik untuk buka)",
"body": """<p>Paid-in Rp100M. Distribusi Rp40M. NAV sisa Rp160M (appraisal).</p>
<p><strong>DPI</strong> = 0,4x (baru 40% kembali tunai). <strong>RVPI</strong> = 1,6x. <strong>TVPI</strong> = 2,0x.</p>
<p>Marketing fund: 'TVPI 2,0x!' Realita: <strong>kas kembali cuma 40%</strong>, sisanya opini penilai. Tanya: kapan NAV sisa jadi distribusi? (vintage + exit pipeline).</p>"""},
"charts": [],
},
{
"id": "hfkom", "toc": "Hedge Fund & Komoditas",
"title": "Hedge Fund & Komoditas — Strategi & Kurva",
"body": """<p><strong>Definisi.</strong> <strong>Hedge fund strategies</strong>: long/short equity, event-driven (merger arb), relative value, macro/global. <strong>Komoditas</strong>: return dari <em>roll yield</em> — <strong>contango</strong> (futures &gt; spot → roll <em>negatif</em>, 'membayar' tiap gulir) vs <strong>backwardation</strong> (futures &lt; spot → roll positif).</p>
<p><strong>Aset digital</strong>: volatilitas ekstrem, korelasi tidak stabil — <strong>sizing kecil</strong> atau tidak sama sekali untuk mandat konservatif.</p>""",
"formulas": [],
"intuisi": "Contango seperti <strong>parkir berlangganan yang makin mahal perpanjangannya</strong>: tiap gulir kontrak bayar lebih mahal (roll negatif menggerogoti). Backwardation = perpanjangannya <em>diskon</em>. Harga spot bisa naik tapi investor futures tetap rugi jika contango curam!",
"kapan": "Investasi komoditas via futures/ETF: cek kurva dulu, bukan cuma harga spot.",
"worked": {"title": "📐 Contoh: ETF minyak yang 'bocor' (klik untuk buka)",
"body": """<p>Harga minyak spot <strong>naik 10%</strong> setahun. ETF futures: tiap bulan roll ke kontrak yang <strong>2% lebih mahal</strong> (contango).</p>
<p><strong>Roll drag</strong> ≈ 2% × 12 = 24%/thn (kasar). ETF: +10% − 24% = <strong>−14%</strong>!</p>
<p>Spot naik, investor rugi — <strong>bukan salah ETF</strong>, tapi salah paham instrumen. Aturan: komoditas via futures = taruhan pada <em>kurva</em>, bukan cuma harga.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Alternatif pasti diversifikasi portofolio karena 'tidak berkorelasi'.",
"benar": "Korelasi <strong>naik saat krisis</strong> (2008: semua jatuh kecuali Treasury). Plus <strong>appraisal smoothing</strong> membuat korelasi <em>tampak</em> rendah — artefak pengukuran, bukan kenyataan. Diversifikasi sejati diuji di stress, bukan di brosur."},
{"t": "Fee 2-and-20 wajar karena manajernya 'terbaik'.",
"benar": "Hitung <strong>fee drag</strong>: gross 12% → net bisa ~8% setelah 2+20. Dari 8% itu, berapa yang <em>alpha</em> vs beta yang bisa dibeli murah via ETF? <strong>Fee harus dibayar dengan alpha</strong> — jika tidak ada alpha persisten, fee = pajak kebodohan."},
],
"tips": [
"<strong>Annualize semua multiple.</strong> '3x' tanpa waktu = meaningless. Minta IRR + DPI + vintage year. Fund yang hanya pamer TVPI = menyembunyikan sesuatu.",
"<strong>Cek kurva futures sebelum beli komoditas.</strong> Contango curam = ETF 'bocor'. Untuk eksposur komoditas jangka panjang, saham produsen (equity) sering lebih bersih dari futures.",
],
"labs": [
{"heading": "Kalkulator PE Multiples",
"intro": "Hitung TVPI, DPI, RVPI, dan IRR kasar dari arus kas fund.",
"title": "Lab 1 — Kalkulator PE",
"hint": "Ubah NAV_SISA 160 -> 60 (appraisal turun). TVPI anjlok — itulah risiko 'janji di kertas'.",
"code": """# Kalkulator multiples private equity (Rp M)
PAID_IN = 100
DISTRIBUSI = 40
NAV_SISA = 160      # ubah sesukamu
TAHUN = 10

dpi = DISTRIBUSI / PAID_IN
rvpi = NAV_SISA / PAID_IN
tvpi = dpi + rvpi
irr_kasar = tvpi**(1/TAHUN) - 1

print(f"DPI  (kas kembali) : {dpi:.2f}x")
print(f"RVPI (janji kertas): {rvpi:.2f}x")
print(f"TVPI (total)       : {tvpi:.2f}x")
print(f"IRR kasar          : {irr_kasar:.1%} p.a.")
print()
print("DPI < 1.0 = modal tunai BELUM kembali.")
print("Bandingkan IRR dengan saham likuid + illiquidity premium 3-4%.")
"""},
{"heading": "Kalkulator Fee Drag 2-and-20",
"intro": "Lihat berapa return gross yang 'dimakan' fee hedge fund/PE.",
"title": "Lab 2 — Kalkulator Fee Drag",
"hint": "Ubah GROSS 0.12 -> 0.08. Net tinggal ~4.8% — fee memakan 40% return!",
"code": """# Fee drag: 2-and-20 vs 1-and-10
GROSS = 0.12   # return gross fund (ubah sesukamu)
HURDLE = 0.08  # hurdle rate

def net_fee(gross, mgmt, perf, hurdle=0.0):
    setelah_mgmt = gross - mgmt
    bonus = max(0, setelah_mgmt - hurdle) * perf
    return setelah_mgmt - bonus

n1 = net_fee(GROSS, 0.02, 0.20, HURDLE)
n2 = net_fee(GROSS, 0.01, 0.10, HURDLE)
print(f"Gross {GROSS:.0%}:")
print(f"  2-and-20 -> net {n1:.2%} (fee memakan {GROSS-n1:.2%})")
print(f"  1-and-10 -> net {n2:.2%} (fee memakan {GROSS-n2:.2%})")
print(f"\\nETF saham biaya 0.1%: net ~{GROSS-0.001:.2%}")
print("Pertanyaan: apakah manajer memberi alpha > selisih fee?")
"""},
],
"decisions": [
{"kondisi": "Fund pamer TVPI tinggi, DPI &lt; 0,5", "pakai": "Skeptis; tanya exit pipeline",
"alasan": "Untung di kertas, kas belum kembali.",
"contoh": "Minta jadwal distribusi."},
{"kondisi": "Komoditas via ETF futures", "pakai": "Cek contango/backwardation dulu",
"alasan": "Roll yield menentukan return.",
"contoh": "Hindari contango curam."},
{"kondisi": "Alokasi alternatif", "pakai": "Tuntut illiquidity premium 3–4% di atas publik",
"alasan": "Kunci 10 tahun harus dibayar.",
"contoh": "Bandingkan IRR vs saham + premium."},
{"kondisi": "Aset digital di mandat konservatif", "pakai": "Sizing ≤ 1–2% atau tolak",
"alasan": "Volatilitas ekstrem + korelasi tak stabil.",
"contoh": "Anggap sebagai venture bet."},
],
"rule10": "<ol><li><strong>Annualize multiple</strong> (IRR).</li><li><strong>DPI &gt; TVPI</strong> (kas &gt; janji).</li><li><strong>Fee harus dibayar alpha.</strong></li><li><strong>Cek kurva</strong> sebelum futures.</li></ol>",
"case": {"toc": "Mini-Case: Bu Lina",
"title": "'Untung 3x' yang Kalah",
"body": """<p>Bu Lina: PE 3x dalam 10 tahun (IRR 11,6%, illikuid, fee 2-and-20) vs teman: saham 2x dalam 6 tahun (IRR 12,2%, likuid).</p>""",
"q": "(a) Hitung & bandingkan IRR. (b) Tiga biaya tersembunyi PE di sini? (c) Kapan PE tetap layak?",
"pembahasan": """<p>(a) <strong>PE 11,6% &lt; saham 12,2%</strong> — '3x' kalah setelah di-annualize. Teman menang <em>dengan</em> likuiditas.</p>
<p>(b) <strong>Illikuiditas 10 tahun</strong> (tidak bisa rebalance/jual darurat), <strong>fee drag</strong> (~4% poin), <strong>appraisal smoothing</strong> (risiko tampak kecil).</p>
<p>(c) Jika <strong>IRR net &gt; saham + 3–4%</strong> (illiquidity premium), <strong>DPI</strong> terbukti (bukan cuma TVPI), dan modal memang <strong>tidak dibutuhkan 10 tahun</strong>.</p>"""},
"quiz": [
{"q": "PE: 3x dalam 10 tahun. IRR?",
"options": ["30%", "11,6%", "20%", "3%"], "correct": 1,
"why": "Benar: 3^(1/10)−1 = 11,6%. '3x' tanpa waktu menipu — selalu annualize."},
{"q": "Paid-in 100, distribusi 40, NAV sisa 160. DPI & TVPI?",
"options": ["DPI 2,0x", "DPI 0,4x, TVPI 2,0x", "DPI 1,6x", "TVPI 0,4x"], "correct": 1,
"why": "Benar: DPI = 40/100 = 0,4x (kas baru 40% kembali!); TVPI = (40+160)/100 = 2,0x. Marketing pamer TVPI; analis tanya DPI."},
{"q": "Gross 12%, fee 2-and-20, hurdle 8%. Net?",
"options": ["10%", "≈ 9,6%", "12%", "8%"], "correct": 1,
"why": "Benar: (12%−2%) = 10%; bonus = (10%−8%)×20% = 0,4% → net 9,6%. Fee memakan 2,4 poin — harus dibayar dengan alpha."},
{"q": "Spot minyak +10%, tapi ETF futures −14%. Penjelasan?",
"options": ["ETF rusak", "Contango: roll negatif menggerogoti return", "Spot salah", "Tidak mungkin"], "correct": 1,
"why": "Benar: tiap roll ke kontrak lebih mahal (contango) = drag. Investasi komoditas via futures = taruhan pada kurva, bukan harga."},
{"q": "J-curve PE: tahun 1–3 negatif. Artinya?",
"options": ["Fund gagal", "Normal: capital call + fee dulu, exit belakangan", "Harus jual", "Appraisal salah"], "correct": 1,
"why": "Benar: J-curve = pola sehat PE. Yang paham bersabar; yang tidak paham panik di tahun 2. Syarat: modal memang dingin 10 tahun."},
],
"rangkum": [
"<strong>Alternatif</strong>: illikuid + fee tinggi + appraisal smoothing + J-curve.",
"<strong>Multiple</strong>: DPI (kas) &gt; RVPI (janji); TVPI = keduanya; selalu annualize (IRR).",
"<strong>Illiquidity premium</strong>: tuntut +3–4% di atas aset likuid.",
"<strong>Fee 2-and-20</strong>: hitung drag; fee harus dibayar alpha.",
"<strong>Contango</strong> = roll negatif; <strong>backwardation</strong> = roll positif.",
"<strong>Kapan TIDAK alternatif</strong>: butuh likuiditas atau premium tidak terbayar.",
],
"prev": ["pm-a8-derivatives", "PM-A8"],
"next": ["pm-a10-portfolio-mgmt", "PM-A10"],
},
{
"slug": "pm-a10-portfolio-mgmt", "id": "PM-A10", "track": "Portfolio Management",
"title_html": "Portfolio Management:<br/>Diversifikasi, CAPM & IPS",
"title_plain": "Portfolio Management: Risk-Return, CAPM, IPS Intro",
"chapter_summary": "Inti manajemen portofolio: trade-off risk-return, kekuatan diversifikasi (korelasi), CAPM & SML, serta pengantar IPS, behavioral finance, dan ESG — jembatan ke Bagian C. Lab simulator diversifikasi & kalkulator CAPM.",
"tujuan": [
"Menjelaskan trade-off risk-return dan menghitung return portofolio.",
"Menjelaskan mengapa korelasi &lt; 1 menurunkan risiko (diversifikasi).",
"Menghitung expected return via CAPM dan membaca SML.",
"Menjelaskan komponen IPS dan bias behavioral dasar.",
],
"story_title": "Cerita: Dua Saham yang 'Sama' Tapi Beda",
"story": """<p><strong>Rudi</strong> punya Rp100jt di <strong>satu</strong> saham tambang (return harapan 15%, volatilitas 30%). <strong>Sinta</strong> membagi Rp100jt ke <strong>dua</strong> saham: tambang + consumer goods (masing-masing return 15%, vol 30%, <strong>korelasi 0,2</strong>).</p>
<p>Setahun berlalu, pasar bergejolak. Rudi: <strong>−25%</strong>. Sinta: <strong>−8%</strong>. Return harapan <em>sama</em> — hasil jauh beda. Twish-nya: Sinta tidak lebih pintar memilih saham; ia hanya <strong>tidak menaruh semua telur di satu keranjang yang sama goyangnya</strong>. Korelasi 0,2 = saat tambang jatuh, consumer menahan. <strong>Diversifikasi adalah 'makan siang gratis' satu-satunya di keuangan.</strong> Lesson ini: matematikanya.</p>""",
"concepts": [
{
"id": "diversifikasi", "toc": "Diversifikasi",
"title": "Diversifikasi — Satu-satunya Makan Siang Gratis",
"body": """<p><strong>Definisi.</strong> <strong>Return portofolio</strong> = rata-rata tertimbang return. <strong>Risiko portofolio</strong>: σ_p² = w1²σ1² + w2²σ2² + <strong>2w1w2ρσ1σ2</strong> — suku terakhir = <strong>korelasi</strong>. Jika <strong>ρ &lt; 1</strong>, σ_p &lt; rata-rata σ → <strong>diversifikasi bekerja</strong>. Risiko terbagi: <strong>sistematis</strong> (pasar; tidak bisa didiversifikasi) vs <strong>idiosinkratis</strong> (spesifik; bisa).</p>
<p>Batas: ~30 saham menghilangkan hampir semua risiko idiosinkratis — sisanya risiko pasar.</p>""",
"formulas": [
{"math": r"\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2",
"symbols": [
"<Tex math={String.raw`w`} />: bobot tiap aset",
"<Tex math={String.raw`\\sigma`} />: volatilitas (standar deviasi return)",
"<Tex math={String.raw`\\rho`} />: korelasi (−1 s.d. +1) — kunci diversifikasi",
"ρ = 1: tidak ada manfaat; ρ = 0,2 (Sinta): σ_p jauh di bawah 30%; ρ = −1: bisa nol! (teoretis)",
]},
],
"intuisi": "Diversifikasi seperti <strong>tim dayung</strong>: jika semua mendayung seirama (ρ=1), perahu oleng bersama. Jika ritmenya beda (ρ rendah), guncangan saling meniadakan — perahu stabil. Korelasi = 'keseiramaan' dayung.",
"kapan": "Konstruksi portofolio: cari aset return baik + korelasi rendah (bukan cuma return tinggi).",
"worked": {"title": "📐 Contoh: Hitung Sinta (klik untuk buka)",
"body": """<p>w1 = w2 = 0,5; σ1 = σ2 = 30%; ρ = 0,2.</p>
<p><strong>σ_p²</strong> = 0,25×0,09 + 0,25×0,09 + 2×0,25×0,2×0,09 = 0,0225 + 0,0225 + 0,009 = 0,054.</p>
<p><strong>σ_p = 23,2%</strong> — dari 30%! Return harapan tetap 15%. <strong>Risiko turun 23% tanpa mengorbankan return</strong> — inilah makan siang gratis.</p>
<p>Jika ρ = 0,9: σ_p = 29,2% (hampir tidak membantu). <strong>Korelasi menentukan segalanya.</strong></p>"""},
"charts": [
{"data": """[{x: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], y: [23.2,24.4,25.6,26.7,27.8,28.8,29.6,30.0,30.0], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "σ_p (ρ=0,2)"}, {x: [0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], y: [27.6,28.0,28.4,28.8,29.2,29.5,29.8,30.0,30.0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "σ_p (ρ=0,9)"}]""",
"title": "Risiko portofolio vs korelasi (2 aset, σ=30%)",
"layout": """{xaxis: {title: "Bobot aset 1"}, yaxis: {title: "σ portofolio (%)"}, showlegend: true}""",
"cara": "Sumbu X = bobot aset 1 (sisanya aset 2). Biru = korelasi rendah, kuning = tinggi.",
"interpretasi": "Korelasi 0,2 (biru): lembah dalam di tengah (50/50) — <strong>diversifikasi maksimal</strong>. Korelasi 0,9 (kuning): hampir datar — dua saham 'kembar' = satu saham. <strong>Cek korelasi sebelum menambah saham ke-31.</strong>"},
],
},
{
"id": "capm", "toc": "CAPM & SML",
"title": "CAPM — Harga Risiko",
"body": """<p><strong>Definisi.</strong> <strong>CAPM</strong>: E(R_i) = R_f + β_i[E(R_m) − R_f]. <strong>Beta</strong> = risiko sistematis (sensitivitas ke pasar). <strong>SML</strong> (<em>security market line</em>): garis E(R) vs β — aset <em>di atas</em> SML = undervalued (return &gt; wajar untuk risikonya).</p>
<p><strong>CML</strong> vs SML: CML untuk portofolio <em>efisien</em> (risiko total), SML untuk <em>semua</em> aset (risiko sistematis).</p>""",
"formulas": [
{"math": r"E(R_i) = R_f + \beta_i [E(R_m) - R_f]",
"symbols": [
"<Tex math={String.raw`R_f`} />: risk-free rate",
"<Tex math={String.raw`\\beta_i`} />: beta = Cov(R_i,R_m)/Var(R_m) (dari regresi PM-A2!)",
"<Tex math={String.raw`E(R_m)-R_f`} />: market risk premium (kompensasi risiko pasar)",
"β = 1: ikut pasar; β &gt; 1: agresif; β &lt; 1: defensif; β negatif: hedge (langka)",
]},
],
"intuisi": "CAPM seperti <strong>daftar harga risiko</strong>: pasar membayar 'upah' hanya untuk risiko yang <em>tidak bisa</em> didiversifikasi (sistematis). Risiko idiosinkratis = kerja bakti — tidak dibayar, jadi diversifikasikan saja.",
"kapan": "Required return untuk DDM (PM-A6), WACC (PM-A5), evaluasi alpha (PM-C5).",
"worked": {"title": "📐 Contoh: Wajar tidak return 18%? (klik untuk buka)",
"body": """<p>R_f = 6%, E(R_m) = 12%, β saham = 1,5. <strong>E(R) CAPM</strong> = 6% + 1,5×6% = <strong>15%</strong>.</p>
<p>Aktual/forecast 18% → <strong>di atas SML</strong> → undervalued (+3% alpha!). Forecast 12% → di bawah SML → overvalued.</p>
<p><strong>Alpha</strong> = aktual − CAPM. Inilah yang diburu manajer aktif (dan diuji di PM-C5).</p>"""},
"charts": [],
},
{
"id": "ips", "toc": "IPS, Behavioral & ESG",
"title": "IPS, Behavioral & ESG — Manusia di Balik Angka",
"body": """<p><strong>Definisi.</strong> <strong>IPS</strong> (<em>Investment Policy Statement</em>): dokumen tujuan–kendala–kebijakan (return objective, risk tolerance, horizon, likuiditas, pajak, regulasi). <strong>Behavioral</strong>: <em>loss aversion</em> (rugi 2x lebih sakit dari untung), <em>overconfidence</em>, <em>herding</em>, <em>anchoring</em>. <strong>ESG integration</strong>: memasukkan faktor E/S/G ke analisis (bukan sekadar eksklusi).</p>
<p>Pratinjau Bagian C: IPS penuh (PM-C1), behavioral mendalam (PM-C6), ESG (PM-C11).</p>""",
"formulas": [],
"intuisi": "IPS seperti <strong>resep dokter sebelum operasi</strong>: tanpa itu, 'operasi' portofolio mengikuti mood pasar. Behavioral bias = <strong>virus di software otak</strong> — antivirusnya = proses &amp; IPS tertulis.",
"kapan": "Awal setiap relasi klien: IPS dulu, produk kemudian.",
"worked": {"title": "📐 Contoh: IPS 1 paragraf (klik untuk buka)",
"body": """<p><em>'Ibu Lina, 45 thn, horizon 15 thn, toleransi moderat, butuh Rp50jt/thn mulai thn ke-10 (pendidikan anak), pajak progresif, tidak boleh derivatif spekulatif. Target: 9% p.a. dengan volatilitas &lt; 12%.'</em></p>
<p><strong>Semua keputusan</strong> (alokasi, produk, rebalancing) merujuk ke sini. Tanpa IPS = nasihat tanpa diagnosis.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Diversifikasi = punya banyak saham. 50 saham pasti aman.",
"benar": "50 saham <strong>bank semua</strong> (ρ ≈ 0,9) = 1 saham raksasa — diversifikasi <strong>semu</strong>. Yang penting <strong>korelasi rendah antar-kepemilikan</strong>, bukan jumlah. 10 saham tak berkorelasi mengalahkan 50 saham sekeranjang."},
{"t": "Beta tinggi = return pasti tinggi (CAPM kan bilang begitu).",
"benar": "CAPM = <strong>expected</strong> return, bukan janji. Beta 1,5 bisa −30% setahun (risiko = varians!). Plus <strong>low-beta anomaly</strong> empiris: saham beta rendah sering outperform risk-adjusted. CAPM = benchmark, bukan ramalan."},
],
"tips": [
"<strong>Korelasi dihitung, bukan diasumsikan.</strong> 'Saham beda' belum tentu tak berkorelasi (krisis 2008: semua ρ → 1). Hitung matriks korelasi portofoliomu tiap kuartal — kejutan korelasi = kejutan risiko.",
"<strong>Tulis IPS-mu sendiri.</strong> Bahkan untuk portofolio pribadi: 1 halaman tujuan, horizon, batas rugi. Ini 'vaksin' terhadap panic selling — keputusan dibuat saat tenang, dieksekusi saat panik.",
],
"labs": [
{"heading": "Simulator Diversifikasi",
"intro": "Ubah korelasi & bobot dua aset — lihat risiko portofolio berubah.",
"title": "Lab 1 — Simulator Diversifikasi",
"hint": "Ubah RHO 0.2 -> 0.9. Manfaat diversifikasi lenyap — dua saham 'kembar'!",
"code": """import math
# Simulator diversifikasi 2 aset
S1, S2, RHO = 0.30, 0.30, 0.2  # vol aset 1, 2, korelasi (ubah RHO!)
R1, R2 = 0.15, 0.15

print(f"{'w1':>5} {'return':>8} {'risiko':>8}")
terbaik = (1, 1)
for i in range(11):
    w1 = i/10; w2 = 1 - w1
    ret = w1*R1 + w2*R2
    var = w1**2*S1**2 + w2**2*S2**2 + 2*w1*w2*RHO*S1*S2
    sig = math.sqrt(var)
    print(f"{w1:>5.1f} {ret:>7.1%} {sig:>7.1%}")
    if sig < terbaik[1]: terbaik = (w1, sig)
print(f"\\nRisiko minimum di w1={terbaik[0]:.1f}: {terbaik[1]:.1%} (vs 30% single)")
print("Makan siang gratis = risiko turun, return tetap!")
"""},
{"heading": "Kalkulator CAPM & SML",
"intro": "Hitung expected return CAPM dan nilai alpha (di atas/di bawah SML).",
"title": "Lab 2 — Kalkulator CAPM",
"hint": "Ubah BETA 1.5 -> 0.7 (defensif). Expected turun — risiko lebih kecil, 'upah' lebih kecil.",
"code": """# Kalkulator CAPM: E(R) = Rf + beta*(Rm - Rf)
RF, RM = 0.06, 0.12
BETA = 1.5          # ubah sesukamu
FORECAST = 0.18     # return ekspektasi analis

er = RF + BETA*(RM - RF)
alpha = FORECAST - er
print(f"CAPM expected : {er:.1%}")
print(f"Forecast analis: {FORECAST:.1%}")
print(f"Alpha          : {alpha:+.1%}")
print(f"Status: {'UNDERVALUED (di atas SML) - beli' if alpha > 0 else 'OVERVALUED (di bawah SML) - jual/hindari'}")
print("\\nBeta dari regresi return saham vs pasar (PM-A2).")
"""},
],
"decisions": [
{"kondisi": "Menambah saham ke portofolio", "pakai": "Cek korelasi, bukan cuma return",
"alasan": "Manfaat diversifikasi = f(korelasi).",
"contoh": "Tolak saham ke-31 yang ρ=0,9 dengan existing."},
{"kondisi": "Menentukan required return", "pakai": "CAPM (Rf + β × MRP)",
"alasan": "Konsisten untuk DDM, WACC, evaluasi.",
"contoh": "r untuk valuasi PM-B4."},
{"kondisi": "Klien baru", "pakai": "IPS tertulis dulu",
"alasan": "Diagnosis sebelum resep.",
"contoh": "1 halaman: tujuan, horizon, batasan."},
{"kondisi": "Pasar panik", "pakai": "Kembali ke IPS; waspadai loss aversion",
"alasan": "Bias behavioral merusak return.",
"contoh": "Rebalancing mekanis (PM-C4)."},
],
"rule10": "<ol><li><strong>ρ &lt; 1</strong> = diversifikasi bekerja.</li><li><strong>Bayar hanya risiko sistematis</strong> (beta).</li><li><strong>Alpha</strong> = aktual − CAPM.</li><li><strong>IPS dulu</strong>, produk kemudian.</li></ol>",
"case": {"toc": "Mini-Case: Rudi vs Sinta",
"title": "Dua Saham yang 'Sama'",
"body": """<p>Rudi: 100% saham tambang (E(R) 15%, σ 30%). Sinta: 50/50 tambang + consumer (masing-masing 15%, σ 30%, ρ = 0,2). Setahun gejolak: Rudi −25%, Sinta −8%.</p>""",
"q": "(a) Hitung σ portofolio Sinta. (b) Kenapa return harapan sama tapi risiko beda? (c) Kapan diversifikasi gagal?",
"pembahasan": """<p>(a) <strong>σ_p = 23,2%</strong> (vs 30%): 0,25×0,09×2 + 2×0,25×0,2×0,09 = 0,054 → √ = 23,2%.</p>
<p>(b) <strong>Return = rata-rata tertimbang</strong> (tetap 15%); <strong>risiko punya suku korelasi</strong> yang mengecilkan total. Beda rumus, beda hasil.</p>
<p>(c) Saat <strong>krisis sistemik</strong> (ρ → 1: semua jatuh bersama) atau <strong>korelasi semu</strong> (50 saham se-sektor). Diversifikasi ≠ banyak; = tak berkorelasi.</p>"""},
"quiz": [
{"q": "Dua aset σ=30%, w=50/50, ρ=0,2. σ portofolio?",
"options": ["30%", "23,2%", "15%", "42,4%"], "correct": 1,
"why": "Benar: √0,054 = 23,2%. Risiko turun 23% dengan return sama — makan siang gratis diversifikasi."},
{"q": "Rf 6%, Rm 12%, β=1,5. E(R) CAPM?",
"options": ["12%", "15%", "18%", "9%"], "correct": 1,
"why": "Benar: 6% + 1,5×6% = 15%. Forecast 18% → alpha +3% (undervalued, di atas SML)."},
{"q": "Risiko mana yang 'dibayar' pasar menurut CAPM?",
"options": ["Risiko total", "Risiko sistematis (beta) saja", "Risiko idiosinkratis", "Semua risiko"], "correct": 1,
"why": "Benar: idiosinkratis bisa didiversifikasi gratis → tidak dikompensasi. Hanya beta yang punya 'upah'."},
{"q": "50 saham semuanya bank (ρ≈0,9). Diversifikasi?",
"options": ["Sempurna — 50 saham", "Semu — korelasi tinggi = 1 saham raksasa", "Cukup", "Tidak bisa dinilai"], "correct": 1,
"why": "Benar: jumlah tidak penting; korelasi yang penting. 50 saham sekeranjang = konsentrasi terselubung."},
{"q": "Fungsi utama IPS?",
"options": ["Memilih saham terbaik", "Dokumen tujuan–kendala–kebijakan sebagai jangkar keputusan", "Menjamin return", "Syarat legal semata"], "correct": 1,
"why": "Benar: IPS = diagnosis sebelum resep; jangkar saat pasar panik (anti loss-aversion). Tanpa IPS = nasihat tanpa arah."},
],
"rangkum": [
"<strong>Diversifikasi</strong>: σ_p² punya suku korelasi; ρ &lt; 1 → risiko turun tanpa korban return.",
"<strong>Risiko sistematis</strong> (tidak bisa dihindari) vs <strong>idiosinkratis</strong> (bisa).",
"<strong>CAPM</strong>: E(R) = R_f + β(E(R_m) − R_f); alpha = aktual − CAPM.",
"<strong>SML</strong>: di atas = undervalued; CML untuk portofolio efisien.",
"<strong>IPS</strong>: tujuan, toleransi, horizon, likuiditas, pajak, regulasi.",
"<strong>Behavioral</strong>: loss aversion, overconfidence, herding — lawannya proses tertulis.",
],
"prev": ["pm-a9-alternatives", "PM-A9"],
"next": ["pm-b1-regresi", "PM-B1"],
},
]
