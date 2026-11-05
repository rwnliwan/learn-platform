# Track 6 — MK10, MK11, MK12, MK13
LESSONS = [
{
"slug": "mk10-incrementality", "id": "MK10", "track": "Marketing Data Analytics",
"title_html": "Incrementality:<br/>Apakah Iklanmu Benar-Benar Menambah?",
"title_plain": "Incrementality: Holdout, Geo-Experiment, Causal Impact",
"chapter_summary": "Mengukur dampak kausal marketing: beda attributed vs incremental, desain holdout, geo-experiment (DiD) untuk channel yang tak bisa diacak, dan Causal Impact (Bayesian structural time series) untuk membangun counterfactual.",
"tujuan": [
"Membedakan attributed conversion vs incremental lift dengan contoh angka.",
"Merancang holdout experiment (user-level) dan menghitung lift + signifikansinya.",
"Menjelaskan kapan geo-experiment dibutuhkan dan cara memilih matched markets.",
"Membaca output Causal Impact: actual vs counterfactual + interval.",
],
"story_title": "Cerita: Iklan Rp1 Miliar yang 'Menghasilkan' Rp3 Miliar",
"story": """<p>Brand FMCG <em>&ldquo;SegarSari&rdquo;</em> menghabiskan Rp1 miliar untuk iklan TV. Laporan agensi: <strong>&ldquo;Rp3 miliar penjualan teratribusi ke kampanye!&rdquo;</strong> (pemirsa yang melihat iklan lalu membeli). Direksi puas, budget TV dipertahankan.</p>
<p>Twist-nya: analis independen menjalankan <strong>geo-experiment</strong> — 10 kota dapat iklan, 10 kota mirip tidak. Hasil: kota beriklan naik Rp300jt, kota kontrol naik Rp280jt (tren umum). <strong>Lift inkremental = Rp20jt</strong>, bukan Rp3 miliar! Yang Rp3 miliar itu sebagian besar orang yang <em>memang akan beli</em> (loyalis yang kebetulan nonton TV). <strong>Atribusi ≠ inkrementalitas.</strong> Rp1 miliar dibakar untuk Rp20jt tambahan. Lesson ini: cara mengukur apa yang <em>benar-benar</em> disebabkan iklanmu.</p>""",
"concepts": [
{
"id": "inkremen", "toc": "Incrementality & Holdout",
"title": "Incrementality — 'Andai Tidak Ada Iklan...'",
"body": """<p><strong>Definisi.</strong> <strong>Incrementality</strong> = penjualan <em>tambahan</em> yang disebabkan marketing — di atas yang <em>akan terjadi anyway</em> (baseline). <strong>Attributed</strong> = penjualan yang &ldquo;bersentuhan&rdquo; dengan iklan (klik, view). Hubungan: <em>incremental ≤ attributed</em>, selalu. Selisihnya = <strong>kannibalisasi atribusi</strong> (mengklaim penjualan yang memang akan terjadi).</p>
<p><strong>Holdout experiment</strong>: acak user/wilayah ke <em>treated</em> (lihat iklan) vs <em>holdout</em> (tidak). Lift = (treated − holdout)/holdout. Ini standar emas digital (Meta/Google punya fitur holdout bawaan).</p>""",
"formulas": [
{"math": r"\text{Lift} = \frac{\bar{Y}_T - \bar{Y}_C}{\bar{Y}_C} \quad;\quad \text{iROAS} = \frac{\text{Lift} \times \text{Revenue}_T}{\text{Spend}}",
"symbols": [
"<Tex math={String.raw`\\bar{Y}_T`} />: rata-rata outcome grup treated (lihat iklan)",
"<Tex math={String.raw`\\bar{Y}_C`} />: rata-rata outcome grup holdout (tidak lihat)",
"<Tex math={String.raw`\\text{iROAS}`} />: incremental ROAS — return per rupiah dari penjualan <em>tambahan</em> (bandingkan dengan ROAS atribusi yang membengkak)",
]},
],
"intuisi": "Atribusi seperti <strong>memberi medali ke semua orang yang hadir saat gol</strong> — termasuk penonton. Incrementality bertanya: <strong>&lsquo;kalau pemain ini tidak main, apakah gol tetap terjadi?&rsquo;</strong> Holdout = mencadangkan pemain itu di beberapa pertandingan dan melihat skornya.",
"kapan": "Setiap klaim &lsquo;kampanye menghasilkan X&rsquo; — tanya dulu: X ini attributed atau incremental? Untuk budget besar, holdout wajib.",
"worked": {"title": "📐 Contoh: Holdout iklan display (klik untuk buka)",
"body": """<p>1 juta user diacak: 900rb treated (lihat banner), 100rb holdout (tidak). Conversion 30 hari: treated 3,0%, holdout 2,7%.</p>
<p><strong>Lift</strong> = (3,0 − 2,7)/2,7 = <strong>11,1%</strong>. Dari 27.000 pembeli treated (900rb × 3%), yang inkremental = 27.000 × (0,3/3,0) = <strong>2.700</strong>. Sisanya 24.300 = akan beli anyway.</p>
<p><strong>iROAS</strong>: spend Rp500jt, revenue/pembeli Rp1jt → incremental revenue Rp2,7M → iROAS = <strong>5,4</strong>. Platform melaporkan &ldquo;ROAS atribusi&rdquo; 54 (27.000 × Rp1jt / Rp500jt) — <strong>10x lipat lebih besar</strong> dari kenyataan inkremental. Inilah jurang yang memisahkan analis dan agensi.</p>"""},
"charts": [
{"data": """[{x: ["Attributed (klaim platform)", "Incremental (holdout)"], y: [54, 5.4], type: "bar", marker: {color: ["#e8a838", "#2a7de1"]}, text: ["54x", "5,4x"], textposition: "outside"}]""",
"title": "ROAS atribusi vs iROAS — jurang 10x",
"layout": """{yaxis: {title: "ROAS"}, showlegend: false}""",
"cara": "Dua batang: kiri = ROAS versi platform (atribusi), kanan = iROAS dari holdout (inkremental).",
"interpretasi": "Jurang 10x lipat. Keputusan budget berbasis 54x vs 5,4x = keputusan yang beda total. Aturan: <strong>jangan alokasikan budget dari angka atribusi platform</strong> — platform dibayar saat kamu percaya angkanya (conflict of interest!)."},
],
},
{
"id": "geo", "toc": "Geo-Experiment",
"title": "Geo-Experiment — Saat User Tidak Bisa Diacak",
"body": """<p><strong>Definisi.</strong> Channel seperti <strong>TV, radio, OOH (billboard), atau promo toko fisik</strong> tidak bisa diacak per user — iklannya menyebar per wilayah. Solusi: <strong>geo-experiment</strong> — acak <em>wilayah</em> (kota/provinsi) ke treated vs kontrol, lalu estimasi efek dengan <strong>DiD</strong> (MK9): (treated_post − treated_pre) − (kontrol_post − kontrol_pre).</p>
<p>Kunci: <strong>matched markets</strong> — pilih kontrol yang mirip treated (ukuran, tren, musiman) <em>sebelum</em> eksperimen. 10+10 kota lebih baik dari 2+2 (variansi antar-kota besar). Durasi: cukup lama untuk efek (TV butuh 4–8 minggu), cukup singkat agar dunia tidak berubah.</p>""",
"formulas": [
{"math": r"\hat{\tau}_{geo} = (\bar{Y}_{T,post} - \bar{Y}_{T,pre}) - (\bar{Y}_{C,post} - \bar{Y}_{C,pre})",
"symbols": [
"<Tex math={String.raw`\\bar{Y}_{T,pre}`} />: rata-rata penjualan kota treated sebelum kampanye",
"<Tex math={String.raw`\\hat{\\tau}_{geo}`} />: estimasi lift inkremental kampanye",
"Sama seperti DiD di MK9 — bedanya unit randomisasi = kota, bukan user",
"Waspadai <em>spillover</em>: orang kota kontrol nonton TV kota treated (perbatasan) — pakai buffer geografis",
]},
],
"intuisi": "Geo-experiment seperti <strong>uji pupuk per kebun</strong> (bukan per tanaman): satu kebun dipupuk, kebun tetangga yang tanahnya mirip tidak. Kalau kebunmu di lereng dan tetangga di lembah (tidak matched), perbandingannya sampah — pupuk atau tanahnya yang bekerja?",
"kapan": "TV, radio, OOH, promo ritel fisik, atau kapan pun targeting per user mustahil. Standar untuk mengukur 'above the line'.",
"worked": {"title": "📐 Contoh: Geo-experiment SegarSari (klik untuk buka)",
"body": """<p>10 kota treated (iklan TV), 10 kota kontrol (matched: ukuran &amp; tren mirip). Penjualan mingguan rata-rata per kota: treated pre Rp100jt → post Rp130jt (+30). Kontrol pre Rp95jt → post Rp123jt (+28).</p>
<p><strong>DiD</strong> = (130−100) − (123−95) = 30 − 28 = <strong>+Rp2jt/kota/minggu</strong>. Total 10 kota × 8 minggu = <strong>Rp160jt inkremental</strong>. Spend Rp1M → iROAS = 0,16. <strong>Bencana.</strong></p>
<p><strong>Cek validitas:</strong> 8 minggu pre-test, tren treated vs kontrol sejajar? (parallel trends). Jika ya → kesimpulan sahih: TV tidak bekerja untuk brand ini (atau kreatifnya yang salah — test berikutnya: kreatif baru, bukan channel baru).</p>"""},
"charts": [
{"data": """[{x: ["Pre", "Post"], y: [100, 130], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "Treated (TV)"}, {x: ["Pre", "Post"], y: [95, 123], type: "scatter", mode: "lines+markers", marker: {color: "#94a3b8"}, name: "Kontrol"}]""",
"title": "Geo-experiment: dua garis yang (hampir) sejajar",
"layout": """{xaxis: {title: "Periode"}, yaxis: {title: "Penjualan/kota/minggu (Rp jt)"}, showlegend: true}""",
"cara": "Dua garis: biru = kota beriklan, abu = kontrol. Jarak vertikal antar garis = efek. Kalau garis bergerak sejajar, efek ≈ 0.",
"interpretasi": "Kedua garis naik <strong>sejajar</strong> (+30 vs +28) — kenaikan treated hampir seluruhnya tren umum, bukan iklan. DiD cuma +2. Visual ini = Rp1 miliar yang terbakar, digambar dalam dua garis. Inilah kenapa geo-experiment menakutkan bagi yang hidup dari klaim atribusi."},
],
},
{
"id": "causal", "toc": "Causal Impact",
"title": "Causal Impact — Membangun 'Dunia Tanpa Iklan'",
"body": """<p><strong>Definisi.</strong> <strong>Causal Impact</strong> (Google, Bayesian structural time series): saat tidak ada grup kontrol bersih, bangun <strong>counterfactual</strong> — &ldquo;dunia tanpa intervensi&rdquo; — dari data historis + prediktor eksternal (kota kontrol, tren pasar). Bandingkan aktual vs counterfactual + interval kredibel. Output: grafik tiga panel (aktual vs prediksi, selisih pointwise, selisih kumulatif).</p>
<p>Kekuatan: bekerja untuk <strong>satu wilayah</strong> (mis. nasional, tidak bisa di-split) dan menangkap dinamika waktu. Kelemahan: <strong>sebagus prediktornya</strong> — jika tidak ada prediktor yang berkorelasi baik dengan target pre-intervensi, counterfactual-nya ngawur (cek fit pre-period!).</p>""",
"formulas": [],
"intuisi": "Causal Impact seperti <strong>meteorolog yang memprediksi cuaca tanpa badai</strong>: dari pola historis + kota tetangga, ia menggambar &lsquo;seharusnya cerah begini&rsquo; — lalu selisih dengan hujan aktual = efek badai. Kalau modelnya tidak bisa memprediksi cuaca cerah dengan baik (pre-period jelek), jangan percaya efek badainya.",
"kapan": "Intervensi nasional/tunggal (tidak bisa geo-split), atau validasi silang hasil geo-experiment. Selalu cek kecocokan pre-period dulu.",
"worked": {"title": "📐 Contoh: Membaca output Causal Impact (klik untuk buka)",
"body": """<p><strong>Panel 1:</strong> garis aktual (hitam) vs counterfactual (biru, dengan pita). Pre-period: hitam menempel di tengah pita → model bagus.</p>
<p><strong>Panel 2 (pointwise):</strong> selisih harian aktual − counterfactual. Positif konsisten setelah intervensi → efek nyata.</p>
<p><strong>Panel 3 (kumulatif):</strong> total efek + interval. Mis. +Rp160jt (95% CI: +Rp40jt s.d. +Rp280jt). <strong>Jika interval mencakup 0 → tidak signifikan</strong> — jangan klaim efek.</p>
<p>Aturan baca: panel 1 validasi model, panel 2 timing efek, panel 3 keputusan (dengan ketidakpastian jujur).</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Platform melaporkan 'kampanye menghasilkan Rp3 miliar' — itu dampak iklan kami.",
"benar": "Itu <strong>atribusi</strong>, bukan <strong>inkrementalitas</strong>. Sebagian besar (sering 70–90%) adalah orang yang <em>akan beli anyway</em>. Kasus SegarSari: Rp3M atribusi vs Rp160jt inkremental (5%). Tanya selalu: &lsquo;berapa yang <em>tambahan</em>?&rsquo; — dan minta bukti holdout/geo, bukan dashboard platform."},
{"t": "Geo-experiment tidak perlu — kita bisa bandingkan sebelum vs sesudah saja.",
"benar": "Sebelum-vs-sesudah <strong>mencampur efek kampanye dengan tren umum</strong> (musim, ekonomi, kompetitor). SegarSari naik Rp30jt 'sesudah' — tapi kontrol naik Rp28jt tanpa iklan. Tanpa kontrol, kamu akan mengklaim Rp30jt sebagai kemenangan. Kontrol = satu-satunya cara memisahkan sinyal dari cuaca."},
],
"tips": [
"<strong>Incremental ≤ attributed — selalu.</strong> Jadikan ini refleks. Setiap ada angka 'dihasilkan kampanye', bagi mental dengan 5–10x untuk tebak inkremental — lalu minta bukti eksperimennya.",
"<strong>Platform punya conflict of interest.</strong> Mereka dibayar saat kamu percaya ROAS-nya. Holdout independen (atau geo-experiment) adalah satu-satunya angka yang tidak punya insentif untuk berbohong.",
],
"labs": [
{"heading": "Kalkulator Lift Holdout + Signifikansi",
"intro": "Hitung lift, iROAS, dan uji signifikansi sederhana dari data holdout. Ubah angka — lihat kapan lift 'besar' tapi tidak signifikan.",
"title": "Lab 1 — Kalkulator Holdout",
"hint": "Perkecil holdout 100rb → 10rb. Lift sama tapi CI melebar — ukuran holdout menentukan presisi, bukan cuma lift.",
"code": """import math
# Data holdout experiment — ubah sesukamu
n_t, conv_t = 900_000, 0.030   # treated
n_c, conv_c = 100_000, 0.027   # holdout
spend, rev_per = 500_000_000, 1_000_000

lift = (conv_t - conv_c) / conv_c
# SE lift (delta method, pendekatan)
se = math.sqrt(conv_t*(1-conv_t)/n_t + conv_c*(1-conv_c)/n_c) / conv_c
ci = (lift - 1.96*se, lift + 1.96*se)
inkr = n_t * (conv_t - conv_c)
iroas = inkr * rev_per / spend

print(f"Lift            : {lift:.1%}  (95% CI: {ci[0]:.1%} s.d. {ci[1]:.1%})")
print(f"Pembeli inkremental: {inkr:,.0f} dari {n_t*conv_t:,.0f} teratribusi")
print(f"iROAS           : {iroas:.1f}x")
print(f"ROAS atribusi   : {n_t*conv_t*rev_per/spend:.1f}x  <- yang dilaporkan platform")
print()
print("Signifikan!" if ci[0] > 0 else "TIDAK signifikan — jangan klaim efek.")
"""},
{"heading": "Simulasi Geo-Experiment (DiD)",
"intro": "Simulasikan 10 kota treated + 10 kontrol dengan efek sebenarnya Rp2jt. Lihat DiD menemukannya — dan apa yang terjadi jika tren tidak paralel.",
"title": "Lab 2 — Simulator Geo DiD",
"hint": "Ubah EFEK 2 → 0 (tidak ada efek). Lihat DiD ≈ 0 — metode tidak mengada-ada. Lalu buat tren kontrol beda (hilangkan parallel trends) dan lihat biasnya.",
"code": """import random
random.seed(5)
EFEK = 2  # efek sebenarnya (Rp jt/kota/minggu); coba 0!

def kota(base, tren, efek=0, noise=4):
    pre  = [base + tren*t + random.gauss(0, noise) for t in range(8)]
    post = [base + tren*(8+t) + efek + random.gauss(0, noise) for t in range(8)]
    return sum(pre)/8, sum(post)/8

treated = [kota(100, 3.5, EFEK) for _ in range(10)]
kontrol = [kota(95, 3.5, 0) for _ in range(10)]  # tren SAMA -> parallel

def rata(rows, i): return sum(r[i] for r in rows)/len(rows)
did = (rata(treated,1)-rata(treated,0)) - (rata(kontrol,1)-rata(kontrol,0))
print(f"Efek sebenarnya : {EFEK} jt")
print(f"Estimasi DiD    : {did:.1f} jt")
print(f"Treated +{rata(treated,1)-rata(treated,0):.1f} vs kontrol +{rata(kontrol,1)-rata(kontrol,0):.1f}")
print("Tanpa kontrol, kamu akan klaim seluruh kenaikan treated = efek iklan!")
"""},
],
"decisions": [
{"kondisi": "Channel digital, bisa acak per user", "pakai": "Holdout experiment",
"alasan": "Standar emas; platform besar punya fitur bawaan.",
"contoh": "Holdout 10% audiens Meta/Google."},
{"kondisi": "TV/radio/OOH/promo fisik", "pakai": "Geo-experiment (matched markets + DiD)",
"alasan": "Unit acak = wilayah. Satu-satunya kausalitas yang kredibel untuk above-the-line.",
"contoh": "10 kota TV vs 10 kota kontrol."},
{"kondisi": "Intervensi tunggal nasional (tidak bisa split)", "pakai": "Causal Impact (BSTS)",
"alasan": "Bangun counterfactual dari historis + prediktor; cek fit pre-period.",
"contoh": "Peluncuran nasional, perubahan harga nasional."},
{"kondisi": "Butuh angka cepat, budget kecil", "pakai": "Atribusi + diskon mental (÷5–10x) + kalibrasi periodik",
"alasan": "Eksperimen mahal; tapi jangan pernah alokasikan budget besar dari atribusi mentah.",
"contoh": "Review triwulanan: 1 geo-test untuk kalibrasi semua angka atribusi."},
],
"rule10": "<ol><li><strong>Atribusi ≠ inkremental.</strong> Tanya 'berapa yang tambahan?'</li><li><strong>Tanpa kontrol, tidak ada klaim kausal.</strong></li><li><strong>Platform tidak netral</strong> — verifikasi independen.</li></ol>",
"case": {"toc": "Mini-Case: Rp1 Miliar SegarSari",
"title": "Rp1 Miliar untuk Rp160 Juta",
"body": """<p>SegarSari: spend TV Rp1M. Agensi klaim &ldquo;Rp3M teratribusi&rdquo;. Geo-experiment 10+10 kota: DiD = +Rp2jt/kota/minggu × 10 kota × 8 minggu = <strong>Rp160jt inkremental</strong>. iROAS = 0,16.</p>""",
"q": "(a) Jelaskan jurang Rp3M vs Rp160jt. (b) Apakah TV 'tidak bekerja' — atau ada penjelasan lain? (c) Rencana pengukuran tahun depan (budget sama)?",
"pembahasan": """<p>(a) <strong>Rp3M = atribusi</strong> (semua pembeli yang terpapar TV, termasuk loyalis yang akan beli anyway). <strong>Rp160jt = inkremental</strong> (tambahan vs kontrol). Rasio 5% — normal untuk brand FMCG mapan dengan baseline besar.</p>
<p>(b) <strong>Belum tentu.</strong> Bisa jadi: kreatif lemah, frekuensi kurang, atau TV bekerja via brand (jangka panjang, tidak tertangkap 8 minggu). Yang pasti: <em>klaim Rp3M salah</em>. Test berikutnya: kreatif baru + holdout digital + brand tracking (awareness), bukan 'tambah budget TV'.</p>
<p>(c) <strong>Portofolio pengukuran:</strong> (1) geo-experiment tahunan untuk kalibrasi; (2) holdout digital rutin per kuartal; (3) MMM (MK13) untuk alokasi antar-channel; (4) atribusi hanya untuk optimasi taktis harian, bukan keputusan budget.</p>"""},
"quiz": [
{"q": "Treated 3,0%, holdout 2,7%. Lift dan pembeli inkremental dari 900rb treated?",
"options": ["11,1% lift; 2.700 inkremental", "3,0% lift; 27.000 inkremental", "0,3% lift; 270 inkremental", "Tidak bisa dihitung"], "correct": 0,
"why": "Benar: lift = (3,0−2,7)/2,7 = 11,1%. Inkremental = 900rb × 0,3% = 2.700. Yang 27.000 = teratribusi (termasuk yang akan beli anyway)."},
{"q": "Kenapa 'sebelum vs sesudah' tanpa kontrol menyesatkan?",
"options": ["Tidak menyesatkan", "Mencampur efek kampanye dengan tren umum/musim", "Terlalu mahal", "Butuh data banyak"], "correct": 1,
"why": "Benar: kenaikan 'sesudah' bisa murni tren (kontrol SegarSari naik Rp28jt tanpa iklan). Tanpa kontrol, tren umum diklaim sebagai efek kampanye."},
{"q": "Kapan geo-experiment dipilih atas holdout user-level?",
"options": ["Selalu", "Channel tak bisa diacak per user (TV, radio, OOH, promo fisik)", "Budget kecil", "Tidak pernah"], "correct": 1,
"why": "Benar: unit randomisasi mengikuti unit paparan. TV menyebar per wilayah → acak wilayah. Holdout user untuk TV = mustahil (satu rumah beda perlakuan = kontaminasi)."},
{"q": "Output Causal Impact: CI kumulatif mencakup 0. Artinya?",
"options": ["Efek positif kecil", "Tidak signifikan — jangan klaim efek", "Model rusak", "Ulangi dengan data lebih sedikit"], "correct": 1,
"why": "Benar: interval mencakup 0 = efek tidak bisa dibedakan dari noise. Klaim 'ada efek' = overclaim. Perbaiki: perpanjang periode atau terima ketidakpastian."},
{"q": "Platform melaporkan ROAS 54x, holdout menunjukkan iROAS 5,4x. Untuk alokasi budget, pakai?",
"options": ["54x — angka resmi platform", "5,4x (iROAS) — platform punya conflict of interest", "Rata-rata keduanya", "Tidak pakai keduanya"], "correct": 1,
"why": "Benar: platform dibayar saat kamu percaya angkanya. iROAS dari holdout independen = satu-satunya angka kausal. Atribusi platform untuk optimasi taktis, bukan budget."},
],
"rangkum": [
"<strong>Incrementality</strong> = tambahan vs dunia tanpa iklan. <strong>Attributed</strong> = bersentuhan dengan iklan. Incremental ≤ attributed, selalu.",
"<strong>Holdout</strong>: acak treated vs tidak-terpapar; lift = (T−C)/C; iROAS untuk keputusan budget.",
"<strong>Geo-experiment</strong>: untuk TV/radio/OOH; matched markets + DiD; waspadai spillover & parallel trends.",
"<strong>Causal Impact</strong>: counterfactual Bayesian untuk intervensi tunggal; cek fit pre-period; CI mencakup 0 = tidak signifikan.",
"<strong>Platform tidak netral</strong> — verifikasi independen untuk budget besar.",
"<strong>Kapan TIDAK perlu eksperimen</strong>: optimasi taktis harian (pakai atribusi) — tapi kalibrasi periodik dengan eksperimen.",
],
"prev": ["mk9-eksperimen", "MK9"],
"next": ["mk11-uplift", "MK11"],
},
{
"slug": "mk11-uplift", "id": "MK11", "track": "Marketing Data Analytics",
"title_html": "Uplift Modeling:<br/>Siapa yang Bisa Dibujuk (dan Siapa yang Jangan Diganggu)",
"title_plain": "Uplift Modeling",
"chapter_summary": "Melampaui propensity & churn: uplift = P(Y|treated) − P(Y|control). Empat kuadran (sure things, persuadables, lost causes, sleeping dogs), metode two-model & class transformation, evaluasi Qini/AUUC, dan targeting berbasis biaya.",
"tujuan": [
"Menjelaskan empat kuadran respons (sure things, persuadables, lost causes, sleeping dogs).",
"Menghitung uplift score dan membedakannya dari propensity/churn score.",
"Membaca kurva Qini dan menjelaskan kenapa AUUC &gt; AUC untuk evaluasi uplift.",
"Merancang targeting kampanye berbasis uplift + biaya (termasuk 'jangan ganggu').",
],
"story_title": "Cerita: Diskon yang Mengusir Pelanggan",
"story": """<p>TelkoNusa (dari MK6) akhirnya menjalankan kampanye retensi berbasis model churn: 10.000 pelanggan &ldquo;paling berisiko&rdquo; diberi diskon Rp50rb. Hasilnya aneh: churn grup yang didiskon <strong>naik</strong> 2 poin dibanding yang tidak didiskon!</p>
<p>Twist-nya: sebagian &ldquo;berisiko&rdquo; itu adalah <strong>sleeping dogs</strong> — pelanggan yang sebenarnya akan bertahan, tapi <em>diskon mengingatkan mereka bahwa mereka bisa pindah</em> (&ldquo;oh iya, aku bisa dapat lebih murah di tempat lain&rdquo;). Model churn menebak <em>siapa pergi</em>; ia tidak tahu <em>siapa yang pergi TAPI BISA dicegah</em> vs <em>siapa yang justru terusik oleh aksimu</em>. <strong>Uplift modeling</strong> menjawab pertanyaan yang benar: <em>kepada siapa aksi ini benar-benar mengubah perilaku?</em></p>""",
"concepts": [
{
"id": "kuadran", "toc": "Empat Kuadran Respons",
"title": "Empat Kuadran — Peta yang Mengubah Targeting",
"body": """<p><strong>Definisi.</strong> Setiap pelanggan termasuk salah satu: <strong>Sure things</strong> (beli/betahan dengan atau tanpa aksi — menghubunginya = buang biaya), <strong>Persuadables</strong> (berubah karena aksi — <em>mereka</em> targetmu), <strong>Lost causes</strong> (tidak berubah apa pun yang kamu lakukan — buang biaya), <strong>Sleeping dogs</strong> (bertahan jika dibiarkan, <em>pergi jika diganggu</em> — menghubunginya = merusak!).</p>
<p>Model churn/propensity <strong>tidak bisa membedakan</strong> keempatnya — mereka menebak outcome, bukan <em>efek aksi</em>. Hanya eksperimen (treated vs kontrol) + uplift yang bisa.</p>""",
"formulas": [],
"intuisi": "Bayangkan kamu salesman pintu-ke-pintu. <strong>Sure things</strong> = yang memang mau beli (ketuk = buang waktu). <strong>Persuadables</strong> = yang ragu (ketukanmu menentukan). <strong>Lost causes</strong> = yang mengusir siapa pun. <strong>Sleeping dogs</strong> = yang sedang tidur — ketukanmu <em>membangunkannya untuk mengusirmu</em>. Salesman hebat mengetuk pintu persuadables saja.",
"kapan": "Setiap kampanye dengan biaya per kontak &gt; 0 DAN risiko mengganggu (diskon, telepon, push agresif). Jika aksi gratis & tak mengganggu, kuadran tidak penting.",
"worked": {"title": "📐 Contoh: 10.000 'berisiko' TelkoNusa (klik untuk buka)",
"body": """<p>Dari eksperimen: 10.000 pelanggan acak, 5.000 didiskon, 5.000 tidak. Churn: didiskon 8%, tidak 10% — rata-rata diskon &ldquo;menang&rdquo; 2 poin.</p>
<p><strong>Tapi per kuadran</strong> (dari model uplift): persuadables (3.000 orang): churn 15% → 5% (diskon menyelamatkan 300!). Sure things (4.000): 2% → 2% (tidak ngaruh, Rp200jt terbuang). Lost causes (2.000): 40% → 40% (sama saja). Sleeping dogs (1.000): 3% → 8% (diskon <em>menambah</em> 50 churn!).</p>
<p><strong>Net:</strong> +300 − 50 = +250 terselamatkan, tapi biaya Rp500jt untuk 10.000. Targeting hanya persuadables: biaya Rp150jt, selamat 300 → <strong>ROI 3,3x lebih baik</strong> + tidak membangunkan sleeping dogs.</p>"""},
"charts": [
{"data": """[{x: [0.2,0.8,0.2,0.8], y: [0.8,0.8,0.2,0.2], mode: "markers+text", text: ["Sleeping dogs<br>JANGAN ganggu", "Sure things<br>buang biaya", "Lost causes<br>buang biaya", "Persuadables<br>TARGET!"], textposition: "middle center", marker: {size: 60, color: ["#ef4444","#e8a838","#94a3b8","#16a34a"], opacity: 0.7}, type: "scatter"}]""",
"title": "Empat kuadran respons",
"layout": """{xaxis: {title: "P(Y | tanpa aksi)", range: [0,1]}, yaxis: {title: "P(Y | dengan aksi)", range: [0,1]}, showlegend: false}""",
"cara": "Sumbu X = peluang outcome baik TANPA aksi, Y = DENGAN aksi. Diagonal = tidak ada efek. Di atas diagonal = aksi membantu; di bawah = merusak.",
"interpretasi": "Hanya <strong>persuadables</strong> (hijau, kanan atas tapi di atas diagonal) yang layak ditarget. Sure things (kuning, di diagonal atas) = buang biaya. Sleeping dogs (merah, <em>di bawah</em> diagonal) = aksi merusak — zona larangan terbang. Targeting berbasis churn (sumbu X saja) tidak melihat sumbu Y — ia buta terhadap efek aksimu."},
],
},
{
"id": "metode", "toc": "Metode Uplift",
"title": "Metode — Dari Dua Model ke Qini",
"body": """<p><strong>Definisi.</strong> <strong>Uplift</strong> = P(Y|T=1,X) − P(Y|T=0,X): selisih outcome jika diberi vs tidak diberi aksi. Metode: <strong>Two-model</strong> — latih model terpisah di treated & kontrol, kurangkan prediksinya (simple, tapi dua error menumpuk); <strong>Single-model dengan interaksi</strong> — satu model dengan fitur T×X; <strong>Class transformation</strong> — ubah label jadi Z (mis. Z=1 jika (treated & sukses) atau (kontrol & gagal)) lalu satu model klasifikasi.</p>
<p><strong>Evaluasi: Qini curve / AUUC.</strong> Urutkan by uplift prediksi, plot <em>incremental gain</em> kumulatif vs % populasi di-target. AUUC (area under uplift curve) = metrik yang benar. <strong>AUC tidak berlaku</strong> — ia menilai ranking outcome, bukan ranking efek.</p>""",
"formulas": [
{"math": r"\hat{\tau}(x) = \hat{P}(Y=1 \mid T=1, x) - \hat{P}(Y=1 \mid T=0, x)",
"symbols": [
"<Tex math={String.raw`\\hat{\\tau}(x)`} />: uplift prediksi untuk pelanggan x — target yang di-ranking",
"<Tex math={String.raw`\\hat{P}(Y=1 \\mid T=1, x)`} />: peluang sukses JIKA diberi aksi (model treated)",
"<Tex math={String.raw`\\hat{P}(Y=1 \\mid T=0, x)`} />: peluang sukses JIKA TIDAK diberi aksi (model kontrol)",
"Butuh data eksperimen (T diacak)! Dari data observasional, T tidak acak → bias seleksi",
]},
],
"intuisi": "Uplift seperti <strong>menilai guru les</strong>: bukan dari &lsquo;muridnya lulus?&rsquo; (propensity), tapi &lsquo;<em>berapa nilai tambah</em> les ini vs belajar sendiri?&rsquo; Murid jenius lulus tanpa les (sure thing) — lesnya tidak berjasa. Murid yang lulus <em>karena</em> les = persuadable. Butuh kelompok pembanding (kontrol) untuk tahu.",
"kapan": "Ada data eksperimen (A/B dengan outcome), aksi berbiaya/berisiko, dan kamu curiga efek heterogen (tidak semua orang merespons sama).",
"worked": {"title": "📐 Contoh: Two-model manual mini (klik untuk buka)",
"body": """<p>Data: 6 pelanggan (T=1 didiskon, T=0 tidak). Young: T1→bertahan, T0→pergi. Old: T1→bertahan, T0→bertahan.</p>
<p><strong>Model treated:</strong> P(bertahan|T1, young)=1,0; (T1, old)=1,0. <strong>Model kontrol:</strong> P(bertahan|T0, young)=0; (T0, old)=1,0.</p>
<p><strong>Uplift:</strong> young = 1,0 − 0 = <strong>+1,0</strong> (persuadable!). old = 1,0 − 1,0 = <strong>0</strong> (sure thing — jangan buang diskon).</p>
<p>Model churn akan menandai young &ldquo;berisiko&rdquo; (benar) TAPI juga menarget old yang &ldquo;sehat&rdquo;? Tidak — ia menarget young saja. Masalahnya: ia juga menarget <em>semua</em> young termasuk sleeping dogs young. Uplift memisahkan young-persuadable dari young-sleeping-dog.</p>"""},
"charts": [
{"data": """[{x: [0,10,20,30,40,50,60,70,80,90,100], y: [0,45,80,105,120,128,130,128,122,112,100], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "model uplift"}, {x: [0,100], y: [0,100], type: "scatter", mode: "lines", line: {dash: "dash", color: "#94a3b8"}, name: "acak"}]""",
"title": "Kurva Qini: incremental gain kumulatif",
"layout": """{xaxis: {title: "% populasi di-target (by uplift)"}, yaxis: {title: "Incremental gain kumulatif"}, showlegend: true}""",
"cara": "Sumbu X = % populasi teratas by uplift yang di-target, Y = total incremental gain. Bandingkan dengan garis acak.",
"interpretasi": "Kurva naik tajam lalu <strong>melandai di ~60%</strong> — setelah itu menambah target justru menurunkan gain (mulai kena sure things & sleeping dogs). <strong>Titik puncak = ukuran kampanye optimal.</strong> AUUC (luas di atas garis acak) = kualitas model. Inilah 'decile analysis'-nya uplift."},
],
},
{
"id": "policy", "toc": "Dari Uplift ke Kebijakan",
"title": "Kebijakan Targeting — Uplift × Biaya × Risiko",
"body": """<p><strong>Definisi.</strong> Skor uplift saja belum cukup — gabungkan dengan <strong>biaya</strong>: target jika uplift(x) × nilai − biaya(aksi) &gt; 0. Dan dengan <strong>risiko</strong>: jangan pernah target prediksi sleeping dogs (uplift negatif signifikan) — <em>expected harm</em> nyata.</p>
<p>Urutan targeting optimal: urutkan by <strong>net value</strong> = uplift × V − C, ambil dari atas sampai net value ≤ 0. Ini generalisasi dari threshold EV di MK6/MK7 — dengan uplift menggantikan P(churn)/P(respons).</p>""",
"formulas": [],
"intuisi": "Uplift tanpa biaya seperti <strong>resep tanpa harga bahan</strong>: &lsquo;obat ini menyembuhkan!&rsquo; — tapi harganya Rp100jt untuk flu. Kebijakan targeting = resep + apotek: manfaat × peluang − harga &gt; 0, baru tebus.",
"kapan": "Setiap kampanye retensi/upsell berbiaya. Aturan: tidak ada aksi ke uplift negatif; aksi ke uplift positif hanya jika net value positif.",
"worked": {"title": "📐 Contoh: Kebijakan TelkoNusa (klik untuk buka)",
"body": """<p>V = Rp2jt (CLV terselamatkan), C = Rp50rb. Net value = uplift × 2jt − 50rb.</p>
<p>Persuadables (uplift +0,10): 0,10×2jt − 50rb = <strong>+Rp150rb</strong> → TARGET. Sure things (uplift 0): −Rp50rb → JANGAN. Sleeping dogs (uplift −0,05): −Rp150rb → JANGAN (dan catat sebagai harm).</p>
<p><strong>Hasil kebijakan:</strong> target 3.000 persuadables, biaya Rp150jt, selamat ~300 → net +Rp450jt. Vs kampanye lama: biaya Rp500jt, net +Rp0 (bahkan negatif setelah sleeping dogs). <strong>Model yang sama (churn) + kebijakan uplift = hasil beda dunia.</strong></p>"""},
"charts": [],
},
],
"myths": [
{"t": "Targetkan yang paling berisiko churn — mereka yang paling butuh diselamatkan.",
"benar": "&lsquo;Berisiko&rsquo; ≠ &lsquo;bisa diselamatkan&rsquo;. Yang paling berisiko sering = <strong>lost causes</strong> (tidak tertolong) atau <strong>sleeping dogs</strong> (terganggu oleh aksimu). Kasus TelkoNusa: menarget 10.000 'berisiko' justru <em>menaikkan</em> churn. Target = <strong>persuadables</strong> (uplift tinggi), bukan risiko tinggi."},
{"t": "Uplift = propensity yang diganti nama. Sama-sama skor.",
"benar": "Propensity menebak <strong>outcome</strong> (siapa beli/pergi). Uplift menebak <strong>efek aksi</strong> (siapa berubah <em>karena</em> aksi). Sure thing punya propensity tinggi + uplift nol — propensity menargetnya (buang biaya), uplift tidak. Beda pertanyaan, beda model, beda data (uplift butuh eksperimen)."},
],
"tips": [
"<strong>Uplift butuh data eksperimen — tidak bisa dari observasional murni.</strong> Tanpa T yang diacak, 'P(Y|T=1) − P(Y|T=0)' terkontaminasi bias seleksi (yang didiskon memang beda). Investasi satu A/B test yang benar (MK9) = bahan bakar semua model uplift.",
"<strong>Evaluasi dengan Qini/AUUC, bukan AUC.</strong> AUC menilai 'apakah ranking outcome benar' — tidak relevan. Model dengan AUC 0,9 bisa AUUC negatif (ranking outcome sempurna tapi efek nol). Salah metrik = salah model menang.",
],
"labs": [
{"heading": "Two-Model Uplift From-Scratch",
"intro": "Bangun dua model sederhana (treated & kontrol), hitung uplift, dan identifikasi persuadables vs sleeping dogs.",
"title": "Lab 1 — Uplift Two-Model",
"hint": "Ubah efek diskon untuk 'old' jadi negatif (sleeping dogs). Lihat model menangkap uplift negatif — mereka harus DIKECUALIKAN.",
"code": """import random
random.seed(21)
# Simulasi: 2000 pelanggan, T diacak. Efek heterogen by usia.
def hasil(usia, T):
    base = 0.7 if usia == "old" else 0.4      # P(bertahan | tanpa aksi)
    efek = 0.25 if usia == "young" else 0.0   # diskon membantu young saja
    p = base + (efek if T else 0)
    return 1 if random.random() < p else 0

data = []
for _ in range(2000):
    usia = "young" if random.random() < 0.5 else "old"
    T = random.random() < 0.5
    data.append((usia, T, hasil(usia, T)))

def rate(rows):
    return sum(r for _, _, r in rows)/len(rows) if rows else 0

for usia in ["young", "old"]:
    t = [r for r in data if r[0] == usia and r[1] == 1]
    c = [r for r in data if r[0] == usia and r[1] == 0]
    uplift = rate(t) - rate(c)
    print(f"{usia:<6} P(bertahan|diskon)={rate(t):.0%}  P(bertahan|tanpa)={rate(c):.0%}  uplift={uplift:+.0%}")
print("\\nKeputusan: diskon HANYA untuk young (persuadable).")
print("Old = sure things (uplift ~0): diskon = buang biaya.")
"""},
{"heading": "Kurva Qini Sederhana",
"intro": "Urutkan pelanggan by uplift prediksi, plot incremental gain kumulatif — temukan ukuran kampanye optimal.",
"title": "Lab 2 — Kurva Qini",
"hint": "Tambahkan 'sleeping dogs' (efek negatif untuk sebagian young). Lihat kurva TURUN setelah puncak — bukti jangan target semua.",
"code": """import random
random.seed(22)
# uplift 'true' per pelanggan + noise prediksi
true_u = [0.25 if random.random() < 0.3 else (0.0 if random.random() < 0.8 else -0.1) for _ in range(1000)]
pred = [u + random.gauss(0, 0.08) for u in true_u]
order = sorted(range(1000), key=lambda i: pred[i], reverse=True)

kum, terbaik = 0, (0, 0)
print(f"{'%target':>8}  {'gain kumulatif':>14}")
for k in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]:
    n = k * 10
    kum = sum(true_u[i] for i in order[:n])
    print(f"{k:>8}  {kum:>14.1f}")
    if kum > terbaik[1]: terbaik = (k, kum)
print(f"\\nUkuran optimal ~ {terbaik[0]}% populasi (gain {terbaik[1]:.0f}).")
print("Target lebih = mulai kena sure things & sleeping dogs.")
"""},
],
"decisions": [
{"kondisi": "Aksi murah & tidak mengganggu (email biasa)", "pakai": "Propensity + EV cutoff (MK7) cukup",
"alasan": "Risiko sleeping dogs kecil; uplift overkill.",
"contoh": "Newsletter mingguan."},
{"kondisi": "Aksi mahal atau mengganggu (telepon, diskon besar)", "pakai": "Uplift modeling",
"alasan": "Biaya salah target besar; sleeping dogs nyata.",
"contoh": "Diskon retensi Rp50rb+, kunjungan sales."},
{"kondisi": "Tidak ada data eksperimen", "pakai": "Jalankan A/B test dulu (MK9) — jangan uplift dari observasional",
"alasan": "Uplift tanpa T acak = bias seleksi.",
"contoh": "Pilot 5.000 user sebelum model."},
{"kondisi": "Efek homogen (semua merespons sama)", "pakai": "Tetap di A/B + EV; uplift tidak menambah",
"alasan": "Uplift berharga saat efek heterogen. Cek dulu variasi efek per segmen.",
"contoh": "Jika semua segmen lift-nya mirip, pakai rata-rata."},
],
"rule10": "<ol><li><strong>Tanya 'siapa berubah karena aksi',</strong> bukan 'siapa berisiko'.</li><li><strong>Butuh data eksperimen.</strong> Tidak ada jalan pintas.</li><li><strong>Evaluasi Qini/AUUC</strong>, bukan AUC.</li><li><strong>Jangan ganggu sleeping dogs.</strong></li></ol>",
"case": {"toc": "Mini-Case: Diskon yang Mengusir",
"title": "Diskon yang Mengusir Pelanggan",
"body": """<p>TelkoNusa: 10.000 &ldquo;berisiko&rdquo; didiskon Rp50rb. Churn grup diskon NAIK 2 poin vs kontrol. Kuadran: persuadables 3.000 (churn 15%→5%), sure things 4.000, lost causes 2.000, sleeping dogs 1.000 (3%→8%).</p>""",
"q": "(a) Jelaskan kenapa churn naik. (b) Rancang ulang kampanye dengan budget Rp150jt. (c) Metrik sukses yang benar?",
"pembahasan": """<p>(a) <strong>Sleeping dogs:</strong> 1.000 pelanggan yang akan bertahan (3%) terusik diskon menjadi 8% churn (+50 orang). Plus sure things &amp; lost causes membuang biaya tanpa hasil. Efek bersih kampanye lama ≈ nol/negatif.</p>
<p>(b) <strong>Target 3.000 persuadables saja</strong> (biaya Rp150jt): selamat ~300 (10 poin × 3.000). Net value = 300 × Rp2jt − Rp150jt = <strong>+Rp450jt</strong>. Sleeping dogs &amp; sure things: jangan hubungi sama sekali.</p>
<p>(c) <strong>Incremental retained per rupiah</strong> (bukan churn rate grup didiskon mentah — itu tanpa pembanding). Bandingkan vs kontrol yang matched, atau Qini pada holdout.</p>"""},
"quiz": [
{"q": "Pelanggan: P(bertahan|tanpa aksi)=95%, P(bertahan|diskon)=95%. Kuadran?",
"options": ["Persuadable", "Sure thing — jangan buang diskon", "Lost cause", "Sleeping dog"], "correct": 1,
"why": "Benar: outcome baik tanpa aksi, aksi tidak mengubah → sure thing. Diskon = buang Rp50rb. Model churn ('risiko rendah') benar tidak menargetnya — tapi ia juga tidak menarget persuadable berisiko-sedang."},
{"q": "Uplift = P(Y|T=1,X) − P(Y|T=0,X). Data apa yang WAJIB ada?",
"options": ["Data observasional besar", "Eksperimen dengan T diacak", "Data survei", "Cukup data transaksi"], "correct": 1,
"why": "Benar: tanpa T acak, selisihnya terkontaminasi bias seleksi (yang didiskon memang beda). Uplift = metode kausal, butuh desain kausal."},
{"q": "Model AUC 0,9 tapi AUUC negatif. Artinya?",
"options": ["Model bagus", "Ranking outcome bagus tapi ranking efek buruk — model salah untuk targeting", "Data salah", "Qini tidak penting"], "correct": 1,
"why": "Benar: AUC menilai outcome, AUUC menilai efek. Untuk kampanye, yang penting efek. Salah metrik = model 'terbaik' yang merugikan."},
{"q": "Kurva Qini memuncak di 60% lalu turun. Keputusan?",
"options": ["Target 100% — makin banyak makin baik", "Target ~60% teratas; sisanya sure things/sleeping dogs", "Target 10% saja", "Abaikan kurva"], "correct": 1,
"why": "Benar: setelah puncak, menambah target menurunkan gain (kena sure things = buang biaya, sleeping dogs = harm). Puncak Qini = ukuran kampanye optimal."},
{"q": "Bedanya propensity dan uplift dalam satu kalimat?",
"options": ["Tidak ada beda", "Propensity: siapa akan beli/pergi. Uplift: siapa berubah KARENA aksiku", "Uplift lebih akurat", "Propensity butuh eksperimen"], "correct": 1,
"why": "Benar: outcome vs efek. Sure thing: propensity tinggi, uplift nol. Inilah kalimat yang membedakan analis junior dan senior."},
],
"rangkum": [
"<strong>Empat kuadran</strong>: sure things (buang biaya), persuadables (TARGET), lost causes (buang biaya), sleeping dogs (JANGAN ganggu).",
"<strong>Uplift</strong> = P(Y|T=1,X) − P(Y|T=0,X); butuh data eksperimen.",
"<strong>Metode</strong>: two-model (simple), single-model interaksi, class transformation.",
"<strong>Evaluasi</strong>: Qini curve / AUUC — bukan AUC. Puncak Qini = ukuran kampanye optimal.",
"<strong>Kebijakan</strong>: target jika uplift×V − C &gt; 0; tidak pernah ke uplift negatif.",
"<strong>Kapan TIDAK perlu uplift</strong>: aksi murah & tak mengganggu (cukup propensity+EV).",
],
"prev": ["mk10-incrementality", "MK10"],
"next": ["mk12-attribution", "MK12"],
},
{
"slug": "mk12-attribution", "id": "MK12", "track": "Marketing Data Analytics",
"title_html": "Attribution:<br/>Bagi Kredit dengan Adil",
"title_plain": "Attribution: Rule-Based, Markov, Shapley",
"chapter_summary": "Model atribusi: rule-based (first/last/linear/time-decay/position-based), Markov chains (removal effect), dan Shapley value (pembagian adil dari teori permainan). Termasuk kapan memakai apa dan jebakan 'satu model untuk semua'.",
"tujuan": [
"Menghitung kredit per channel dengan 5 model rule-based dan menjelaskan bias masing-masing.",
"Menjelaskan intuisi Markov removal effect untuk atribusi.",
"Menjelaskan kenapa Shapley value dianggap 'adil' (aksioma game theory).",
"Memilih model atribusi sesuai pertanyaan bisnis + menjelaskan keterbatasannya.",
],
"story_title": "Cerita: Perang Budget antara Tim Search dan Tim Sosmed",
"story": """<p>Di <em>&ldquo;GadgetKu&rdquo;</em>, tim Search dan tim Sosmed perang setiap kuartal. Dashboard <strong>last-click</strong>: Search &ldquo;menghasilkan&rdquo; Rp8M, Sosmed Rp1M. Tim Sosmed protes: <em>&ldquo;Tanpa video kami, tidak ada yang search brand kalian!&rdquo;</em> Direksi memotong budget Sosmed 70%. Kuartal berikutnya, Search <strong>anjlok</strong> 40%.</p>
<p>Twist-nya: last-click memberi <strong>semua kredit ke penutup</strong> dan nol ke pembuka — seperti memberi seluruh gaji ke striker dan nol ke gelandang yang memberi assist. Sosmed memang tidak &ldquo;menutup&rdquo;, tapi ia <strong>membuka</strong> 60% perjalanan. Model yang salah bukan cuma tidak adil — ia <strong>menghancurkan mesinnya sendiri</strong> (potong pembuka → penutup kelaparan). Lesson ini: matematika berbagi kredit.</p>""",
"concepts": [
{
"id": "rule", "toc": "Rule-Based Attribution",
"title": "Rule-Based — Aturan Main yang Sederhana (dan Biasnya)",
"body": """<p><strong>Definisi.</strong> Model <strong>rule-based</strong> membagi kredit 1 conversion ke touchpoint dengan aturan tetap: <strong>first-click</strong> (100% ke pertama — menghargai pembuka), <strong>last-click</strong> (100% ke terakhir — menghargai penutup), <strong>linear</strong> (rata ke semua), <strong>time-decay</strong> (makin dekat conversion makin besar), <strong>position-based</strong> (40% pertama + 40% terakhir + 20% tengah).</p>
<p>Setiap aturan punya <strong>bias</strong>: first-click meremehkan penutup, last-click meremehkan pembuka (kasus GadgetKu), linear menyamakan peran yang beda, time-decay menghukum awareness. Tidak ada yang &ldquo;benar&rdquo; — semuanya heuristik.</p>""",
"formulas": [],
"intuisi": "Rule-based seperti <strong>aturan bagi warisan yang kaku</strong>: 'anak sulung dapat semua' (first-click), 'anak bungsu dapat semua' (last-click), 'bagi rata' (linear). Sederhana & transparan — tapi tidak ada yang bertanya siapa yang sebenarnya merawat orang tua (kontribusi nyata).",
"kapan": "Butuh angka cepat, transparan, dan semua stakeholder paham. Jangan untuk keputusan budget besar (biasnya mahal).",
"worked": {"title": "📐 Contoh: Satu journey, lima angka beda (klik untuk buka)",
"body": """<p>Journey: Sosmed → Email → Search → Beli (Rp1jt).</p>
<p><strong>First-click:</strong> Sosmed Rp1jt, lainnya 0. <strong>Last-click:</strong> Search Rp1jt. <strong>Linear:</strong> masing-masing Rp333rb. <strong>Time-decay:</strong> Search 500rb, Email 300rb, Sosmed 200rb. <strong>Position-based:</strong> Sosmed 400rb, Search 400rb, Email 200rb.</p>
<p><strong>Satu journey, lima &lsquo;kebenaran&rsquo;.</strong> Tim Search (last-click) vs tim Sosmed (first-click) = perang yang tidak akan selesai — karena premisnya (&ldquo;satu model benar&rdquo;) salah.</p>"""},
"charts": [
{"data": """[{x: ["Sosmed", "Email", "Search"], y: [0, 0, 8], name: "Last-click", type: "bar", marker: {color: "#e8a838"}}, {x: ["Sosmed", "Email", "Search"], y: [6, 0, 2], name: "First-click", type: "bar", marker: {color: "#2a7de1"}}]""",
"title": "Kredit per channel (Rp jt): last-click vs first-click",
"layout": """{barmode: "group", yaxis: {title: "Kredit (Rp jt)"}, showlegend: true}""",
"cara": "Dua kelompok batang per channel: kuning = last-click, biru = first-click. Bandingkan siapa 'menang' di tiap model.",
"interpretasi": "Last-click: Search 8jt vs Sosmed 0. First-click: Sosmed 6jt vs Search 2jt. <strong>Model menentukan pemenang, bukan data.</strong> Inilah kenapa perang budget GadgetKu tidak akan selesai dengan rule-based — butuh model yang melihat <em>peran</em> tiap channel (Markov/Shapley)."},
],
},
{
"id": "markov", "toc": "Markov Chains",
"title": "Markov — 'Bagaimana Jika Channel Ini Hilang?'",
"body": """<p><strong>Definisi.</strong> Model <strong>Markov</strong> melihat journey sebagai rantai: peluang pindah dari touchpoint A ke B (matriks transisi, termasuk ke <em>conversion</em> dan <em>null</em>/keluar). <strong>Removal effect</strong> channel C = berapa % conversion hilang jika C <em>dihapus</em> dari semua journey. Kredit ∝ removal effect (dinormalisasi).</p>
<p>Keunggulan: <strong>data-driven</strong> (bukan aturan kaku) dan menghargai peran <em>perantara</em> (Email di contoh: removal effect-nya nyata walau tidak pernah first/last). Kelemahan: butuh data journey lengkap; asumsi Markov (masa depan hanya tergantung sekarang) penyederhanaan.</p>""",
"formulas": [
{"math": r"\text{RemovalEffect}(C) = 1 - \frac{P(\text{conv} \mid \text{tanpa } C)}{P(\text{conv})}",
"symbols": [
"<Tex math={String.raw`P(\\text{conv})`} />: peluang conversion dengan semua channel",
"<Tex math={String.raw`P(\\text{conv} \\mid \\text{tanpa } C)`} />: peluang conversion jika channel C dihapus dari graf",
"Removal effect 0,3 = menghilangkan C menurunkan conversion 30% — itulah 'jasa' C",
"Kredit akhir = removal effect dinormalisasi (jumlah = 1)",
]},
],
"intuisi": "Removal effect seperti <strong>&lsquo;uji copot&rsquo; di bengkel</strong>: mau tahu fungsi busi? Copot businya, lihat mesin masih hidup tidak. Channel yang kalau 'dicopot' conversion anjlok = channel penting — <em>terlepas</em> dari posisinya (pembuka/penutup).",
"kapan": "Punya data path-to-conversion lengkap dan butuh pembagian yang data-driven tapi masih bisa dijelaskan ('kalau email hilang, conversion turun X%').",
"worked": {"title": "📐 Contoh: Removal effect Email (klik untuk buka)",
"body": """<p>Journey GadgetKu (disederhanakan): 1.000 journey mulai di Sosmed: 600 → Email → 400 → Search → 300 conversion; 400 langsung Search → 200 conversion. P(conv) = 500/1.000 = 50%.</p>
<p><strong>Tanpa Email:</strong> 600 yang tadinya via Email kini: 300 → Search → 150 conversion (asumsi 50% tetap lanjut). Total conversion = 150 + 200 = 350 → P = 35%.</p>
<p><strong>Removal effect Email</strong> = 1 − 35/50 = <strong>30%</strong>. Email 'berjasa' 30% conversion — padahal di first/last-click ia dapat NOL (tidak pernah pertama/terakhir). Inilah yang tidak terlihat rule-based.</p>"""},
"charts": [],
},
{
"id": "shapley", "toc": "Shapley Value",
"title": "Shapley — Matematika Keadilan",
"body": """<p><strong>Definisi.</strong> <strong>Shapley value</strong> (teori permainan kooperatif, Nobel 2012 untuk Lloyd Shapley): bagi kredit berdasarkan <strong>kontribusi marginal rata-rata</strong> channel di semua urutan kedatangan yang mungkin. Aksioma: efisien (total terbagi habis), simetris (peran sama → kredit sama), dummy (tidak berkontribusi → nol), aditif.</p>
<p>Intuisi: untuk tiap urutan (Sosmed→Email→Search, Email→Sosmed→Search, …), hitung tambahan conversion saat channel <em>bergabung</em>; rata-ratakan. Channel yang selalu menambah banyak saat bergabung = kredit besar — <strong>terlepas posisi</strong>.</p>""",
"formulas": [
{"math": r"\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(|N|-|S|-1)!}{|N|!} \big[ v(S \cup \{i\}) - v(S) \big]",
"symbols": [
"<Tex math={String.raw`\\phi_i`} />: kredit Shapley channel i",
"<Tex math={String.raw`v(S)`} />: conversion yang dihasilkan koalisi channel S",
"<Tex math={String.raw`v(S \\cup \\{i\\}) - v(S)`} />: kontribusi marginal i saat bergabung ke S",
"Bobot = peluang urutan itu terjadi — rata-rata atas semua kemungkinan urutan kedatangan",
"Praktis: untuk channel banyak, pakai aproksimasi (sampling urutan), bukan eksak",
]},
],
"intuisi": "Shapley seperti <strong>membagi tip band</strong>: bukan 'vokalis dapat semua' (last-click) atau 'bagi rata' (linear), tapi 'berapa penonton tambahan saat gitaris ini gabung, dirata-rata atas semua formasi band yang mungkin'. Adil secara aksioma — tapi komputasinya mahal (faktorial!).",
"kapan": "Butuh pembagian yang bisa dipertahankan secara prinsip ('adil'), channel ≤ 8 (atau pakai aproksimasi), dan stakeholder paham konsepnya. Sering jadi 'model kedua' untuk validasi.",
"worked": {"title": "📐 Contoh: Shapley 2 channel (klik untuk buka)",
"body": """<p>Channel A (Sosmed), B (Search). v(kosong) = 0, v(hanya A) = 20, v(hanya B) = 50, v(A dan B) = 100.</p>
<p><strong>Urutan A→B:</strong> A bergabung: 20−0=20; B bergabung: 100−20=80. <strong>Urutan B→A:</strong> B: 50−0=50; A: 100−50=50.</p>
<p><strong>Shapley:</strong> A = (20+50)/2 = <strong>35</strong>; B = (80+50)/2 = <strong>65</strong>. Total 100 ✓.</p>
<p>Bandingin: last-click (jika B selalu terakhir) memberi B=100, A=0. Shapley mengakui A membuka jalan (35) — adil dan data-driven.</p>"""},
"charts": [
{"data": """[{x: ["Last-click", "First-click", "Linear", "Markov", "Shapley"], y: [0, 6, 2.7, 3.5, 3.2], type: "bar", marker: {color: ["#e8a838","#2a7de1","#94a3b8","#16a34a","#2a7de1"]}, text: ["0","6","2,7","3,5","3,2"], textposition: "outside"}]""",
"title": "Kredit Sosmed (Rp jt) menurut 5 model",
"layout": """{yaxis: {title: "Kredit Sosmed (Rp jt)"}, showlegend: false}""",
"cara": "Tinggi batang = kredit yang diterima Sosmed menurut tiap model. Rentang 0–6jt untuk channel yang sama!",
"interpretasi": "Sosmed dapat <strong>0</strong> (last-click) hingga <strong>6jt</strong> (first-click) — Markov (3,5) & Shapley (3,2) sepakat di tengah. Pelajaran: <strong>jangan pernah pakai satu model</strong>. Laporkan 2–3 model (satu rule-based + satu data-driven); jika ketiganya sepakat Sosmed penting, barulah potong/naikkan budget dengan percaya diri."},
],
},
],
"myths": [
{"t": "Last-click adalah standar industri — berarti ia yang paling benar.",
"benar": "&lsquo;Standar&rsquo; ≠ &lsquo;benar&rsquo; — last-click standar karena <strong>mudah</strong>, bukan karena adil. Ia buta terhadap pembuka &amp; perantara (kasus GadgetKu: potong Sosmed → Search anjlok 40%). Standar yang salah tetap salah — ia hanya salah secara berjamaah."},
{"t": "Pilih satu model atribusi 'yang benar', lalu pakai untuk semua keputusan.",
"benar": "Setiap model menjawab <strong>pertanyaan beda</strong>: first-click ('apa yang membuka?'), last-click ('apa yang menutup?'), Shapley ('berapa kontribusi adil?'). Tidak ada yang 'benar' universal. Praktik terbaik: <strong>2–3 model + eksperimen</strong> (MK10) — atribusi untuk <em>diagnosis</em>, eksperimen untuk <em>keputusan budget</em>."},
],
"tips": [
"<strong>Atribusi untuk diagnosis, eksperimen untuk keputusan.</strong> Atribusi (seadil apa pun) = observasional — ia tidak tahu dunia tanpa channel itu. Budget besar (&gt;Rp100jt/bulan/channel) wajib dikalibrasi dengan holdout/geo-experiment (MK10).",
"<strong>Waspadai 'atribusi' yang diberi oleh penjual iklan.</strong> Platform mengatribusi ke dirinya sendiri dengan jendela 28-hari + view-through — tentu angkanya bagus. Minta metodologi tertulis; bandingkan dengan model independenmu.",
],
"labs": [
{"heading": "Kalkulator 5 Model Rule-Based",
"intro": "Satu journey, lima angka. Ubah urutan channel — lihat pemenang berganti.",
"title": "Lab 1 — Rule-Based Attribution",
"hint": "Ubah journey jadi [Search, Email, Sosmed] — lihat last-click kini memihak Sosmed. Model menentukan pemenang!",
"code": """# Kalkulator atribusi rule-based
journey = ["Sosmed", "Email", "Search"]  # ubah urutan / panjangnya
value = 1_000_000
n = len(journey)

def bagi(bobot):
    total = sum(bobot)
    return {ch: value*b/total for ch, b in zip(journey, bobot)}

print(f"Journey: {' -> '.join(journey)} (Rp{value:,})\\n")
model = {
    "first-click":    [1 if i == 0 else 0 for i in range(n)],
    "last-click":     [1 if i == n-1 else 0 for i in range(n)],
    "linear":         [1]*n,
    "time-decay":     [2**i for i in range(n)],
    "position-based": [4 if i in (0, n-1) else 2 for i in range(n)],
}
for nama, bobot in model.items():
    hasil = bagi(bobot)
    print(f"{nama:<14}" + "  ".join(f"{ch}={v/1000:.0f}rb" for ch, v in hasil.items() if v > 0))
"""},
{"heading": "Removal Effect Lite",
"intro": "Hitung removal effect tiap channel dari data journey — siapa yang 'tak tergantikan'?",
"title": "Lab 2 — Removal Effect",
"hint": "Ubah conversion 'tanpa Email' 150 → 280 (Email ternyata tidak penting). Lihat kreditnya anjlok — removal effect jujur pada peran.",
"code": """# Removal effect: P(conv) vs P(conv | tanpa channel)
# Data journey GadgetKu (disederhanakan)
P_conv = 0.50
# P(conv) jika channel dihapus (dari analisis journey)
tanpa = {"Sosmed": 0.20, "Email": 0.35, "Search": 0.10}

print(f"{'channel':<9}{'P(conv|tanpa)':>13}  removal  kredit")
efek = {c: 1 - p/P_conv for c, p in tanpa.items()}
total = sum(efek.values())
for c in tanpa:
    print(f"{c:<9}{tanpa[c]:>13.0%}  {efek[c]:>6.0%}  {efek[c]/total:>5.0%}")
print("\\nKredit ∝ removal effect (dinormalisasi).")
print("Email dapat kredit 30%+ walau tak pernah first/last!")
"""},
],
"decisions": [
{"kondisi": "Butuh angka cepat untuk laporan rutin", "pakai": "Rule-based (position-based)",
"alasan": "Transparan, mudah dijelaskan, cukup untuk monitoring tren.",
"contoh": "Dashboard mingguan channel."},
{"kondisi": "Perang budget antar channel", "pakai": "Markov / Shapley + eksperimen",
"alasan": "Rule-based hanya memindahkan perang (pilih model = pilih pemenang).",
"contoh": "Review budget kuartalan GadgetKu."},
{"kondisi": "Keputusan budget besar per channel", "pakai": "Holdout/geo-experiment (MK10)",
"alasan": "Atribusi = observasional; kausalitas butuh eksperimen.",
"contoh": "Naik/turun budget &gt;Rp100jt/bulan."},
{"kondisi": "Jelaskan ke direksi non-teknis", "pakai": "Analogi + 2 model (1 rule + 1 data-driven)",
"alasan": "Rumus Shapley menakutkan; 'uji copot' Markov intuitif.",
"contoh": "'Kalau email dicopot, conversion turun 30%'."},
],
"rule10": "<ol><li><strong>Tidak ada model yang 'benar'</strong> — tiap model bias.</li><li><strong>Laporkan ≥2 model</strong> (rule + data-driven).</li><li><strong>Atribusi = diagnosis; eksperimen = keputusan.</strong></li></ol>",
"case": {"toc": "Mini-Case: Perang Budget GadgetKu",
"title": "Perang Budget GadgetKu",
"body": """<p>GadgetKu: last-click → Search Rp8M, Sosmed Rp1M. Potong Sosmed 70% → Search anjlok 40% kuartal berikutnya. Data journey: 60% conversion diawali Sosmed.</p>""",
"q": "(a) Jelaskan mekanisme kehancurannya. (b) Model apa yang akan mencegahnya? (c) Rancang resolusi perang budget yang adil?",
"pembahasan": """<p>(a) <strong>Sosmed = pembuka</strong> 60% journey. Last-click memberinya 0 kredit → dipotong → pipeline atas kering → 1–2 kuartal kemudian Search (penutup) kelaparan. <strong>Atribusi yang salah menghancurkan mesinnya sendiri</strong> — dengan jeda waktu yang menyamarkan sebab-akibat.</p>
<p>(b) <strong>Markov/Shapley</strong> akan menunjukkan removal effect Sosmed ~35–40% (bukan 0). Atau position-based (40-20-40) sebagai kompromi cepat.</p>
<p>(c) <strong>Tiga lapis:</strong> (1) dashboard 2 model (position-based + Markov) untuk monitoring; (2) holdout Sosmed 10% wilayah untuk bukti kausal; (3) aturan: perubahan budget &gt;20% wajib lolos 'uji copot' (removal effect) + eksperimen. Perang selesai — angka yang bicara.</p>"""},
"quiz": [
{"q": "Journey: Sosmed → Email → Search → beli Rp1jt. Kredit Email menurut linear?",
"options": ["Rp0", "Rp333rb", "Rp1jt", "Rp500rb"], "correct": 1,
"why": "Benar: linear = bagi rata → Rp1jt/3 ≈ Rp333rb. Tapi ingat: 'rata' bukan 'adil' — Email mungkin hanya perantara pasif atau justru kunci (removal effect yang menjawab)."},
{"q": "Removal effect Email 30%. Artinya?",
"options": ["Email menyebabkan 30% penjualan", "Tanpa Email, conversion turun 30% (ceteris paribus)", "Email dapat 30% budget", "Email dibuka 30%"], "correct": 1,
"why": "Benar: 'uji copot' — hapus Email dari graf, conversion turun 30%. Ini kontribusi kausal-dalam-model (bukan eksperimen sungguhan, tapi jauh lebih jujur dari posisi klik)."},
{"q": "Kenapa Shapley disebut 'adil'?",
"options": ["Selalu memberi rata", "Memenuhi aksioma: kontribusi marginal rata-rata atas semua urutan", "Paling mudah dihitung", "Standar Google"], "correct": 1,
"why": "Benar: aksioma Shapley (efisien, simetris, dummy, aditif) = definisi matematis keadilan. Harganya: komputasi faktorial → aproksimasi untuk channel banyak."},
{"q": "Dua model memberi Sosmed 0 (last-click) vs 6jt (first-click). Sikap benar?",
"options": ["Pilih yang menguntungkan timku", "Rata-ratakan", "Laporkan keduanya + model data-driven (Markov/Shapley); keputusan budget via eksperimen", "Buang keduanya"], "correct": 2,
"why": "Benar: rentang 0–6jt = ketidakpastian model. Analis jujur melaporkan ketidakpastian + mencari bukti kausal (holdout), bukan memilih angka yang nyaman."},
{"q": "Kapan atribusi SAJA cukup untuk keputusan budget?",
"options": ["Selalu", "Tidak pernah untuk budget besar — butuh kalibrasi eksperimen", "Jika pakai Shapley", "Jika datanya besar"], "correct": 1,
"why": "Benar: semua atribusi = observasional. Untuk budget besar, kalibrasi dengan holdout/geo (MK10). Atribusi untuk diagnosis & monitoring, eksperimen untuk keputusan."},
],
"rangkum": [
"<strong>Rule-based</strong>: first/last/linear/time-decay/position — transparan tapi bias; model menentukan pemenang.",
"<strong>Markov</strong>: removal effect = 'uji copot' — menghargai perantara yang tak terlihat rule-based.",
"<strong>Shapley</strong>: kontribusi marginal rata-rata atas semua urutan — adil secara aksioma, mahal komputasi.",
"<strong>Tidak ada model 'benar'</strong> — laporkan ≥2 model; atribusi untuk diagnosis.",
"<strong>Keputusan budget besar</strong> → eksperimen (MK10), bukan atribusi.",
"<strong>Waspadai atribusi platform</strong> (conflict of interest) — minta metodologi, bandingkan independen.",
],
"prev": ["mk11-uplift", "MK11"],
"next": ["mk13-mmm", "MK13"],
},
{
"slug": "mk13-mmm", "id": "MK13", "track": "Marketing Data Analytics",
"title_html": "Marketing Mix Modeling:<br/>Mengukur yang Tak Bisa Di-A/B",
"title_plain": "MMM: Adstock, Saturasi, Bayesian & Kalibrasi",
"chapter_summary": "Marketing Mix Modeling: dekomposisi penjualan (base vs incremental), transformasi adstock (carryover) & saturasi (diminishing return), kontrol musiman/harga, MMM Bayesian dengan prior, dan kalibrasi wajib dengan eksperimen.",
"tujuan": [
"Menjelaskan dekomposisi MMM: base sales vs kontribusi tiap channel.",
"Menerapkan transformasi adstock & saturasi dan menjelaskan intuisinya.",
"Menjelaskan kenapa MMM butuh kontrol (musiman, harga, distribusi) — omitted variable bias.",
"Menjelaskan peran prior dalam Bayesian MMM dan kenapa kalibrasi eksperimen wajib.",
],
"story_title": "Cerita: Model Rp2 Miliar yang Bilang 'Potong TV' — Lalu Menyesal",
"story": """<p>FMCG <em>&ldquo;RasaNusa&rdquo;</em> membayar konsultan Rp2 miliar untuk MMM. Model berkata: <strong>TV ROI-nya 0,8 — potong!</strong> Budget TV dialihkan ke digital. Setahun kemudian, <strong>brand awareness anjlok 15 poin</strong>, dan penjualan ikut turun 8% — digital tidak bisa menutup lubang yang ditinggalkan TV.</p>
<p>Twist-nya: MMM-nya <strong>tidak salah hitung — tapi salah spesifikasi</strong>. Model tidak memasukkan <em>brand equity</em> sebagai variabel (hanya penjualan mingguan), tidak dikalibrasi dengan eksperimen apa pun, dan prior-nya asal. MMM tanpa kalibrasi = <strong>opini mahal berbaju matematika</strong>. Lesson ini: cara membangun (dan tidak dibodohi) MMM.</p>""",
"concepts": [
{
"id": "dekomposisi", "toc": "Dekomposisi MMM",
"title": "Dekomposisi — Memisahkan 'Dasar' dari 'Usaha'",
"body": """<p><strong>Definisi.</strong> <strong>MMM</strong> memodelkan penjualan sebagai: <strong>base sales</strong> (yang terjadi tanpa marketing — loyalis, distribusi, musim) + <strong>incremental</strong> tiap channel (kontribusi iklan) + kontrol. Output: kontribusi % per channel, ROI per channel, dan <strong>kurva respons</strong> untuk alokasi optimal.</p>
<p>Data: agregat mingguan (2–3 tahun!), spend per channel, penjualan, + kontrol (harga, promo, distribusi, musiman, kompetitor bila ada). <strong>Tanpa variasi spend yang cukup</strong>, model tidak bisa memisahkan efek channel (kolinearitas) — ini syarat data yang sering dilanggar.</p>""",
"formulas": [
{"math": r"y_t = \alpha + \sum_{c} \beta_c \cdot f_c(\text{adstock}_c(\text{spend}_{c,t})) + \gamma X_t + \varepsilon_t",
"symbols": [
"<Tex math={String.raw`y_t`} />: penjualan minggu t",
"<Tex math={String.raw`\\alpha`} />: base sales — penjualan tanpa marketing",
"<Tex math={String.raw`f_c`} />: fungsi saturasi channel c (diminishing return)",
"<Tex math={String.raw`X_t`} />: kontrol (harga, musim, distribusi, promo)",
"<Tex math={String.raw`\\beta_c`} />: efektivitas channel c — yang diterjemahkan jadi ROI",
]},
],
"intuisi": "MMM seperti <strong>mengurai sup</strong>: kuah dasar (base sales — merek & distribusi yang sudah ada) + bumbu tiap channel (incremental). Koki yang baik tahu berapa sendok garam (TV) vs merica (digital) yang pas — dan tahu kuahnya tetap ada tanpa bumbu (tapi hambar).",
"kapan": "Alokasi budget antar-channel tahunan, channel tak bisa di-A/B (TV/OOH), butuh 'satu angka' per channel untuk direksi. Butuh 2–3 tahun data mingguan.",
"worked": {"title": "📐 Contoh: Dekomposisi RasaNusa (klik untuk buka)",
"body": """<p>Penjualan Rp100M/minggu: base Rp60M (60%), TV Rp15M, digital Rp12M, promo Rp8M, musiman Rp5M.</p>
<p><strong>ROI:</strong> TV: 15M/10M spend = 1,5. Digital: 12M/6M = 2,0. <strong>Rekomendasi naif:</strong> geser TV → digital.</p>
<p><strong>Tapi:</strong> kurva respons TV masih menanjak di spend saat ini (belum saturasi), digital sudah datar (saturasi!). Rupiah <em>berikutnya</em> lebih baik di TV. <strong>Keputusan alokasi = marginal ROI, bukan rata-rata ROI</strong> — pelajaran yang hanya terlihat dari kurva saturasi, bukan tabel.</p>"""},
"charts": [
{"data": """[{x: ["Base", "TV", "Digital", "Promo", "Musiman"], y: [60, 15, 12, 8, 5], type: "bar", marker: {color: ["#94a3b8","#2a7de1","#e8a838","#16a34a","#94a3b8"]}, text: ["60%","15%","12%","8%","5%"], textposition: "outside"}]""",
"title": "Dekomposisi penjualan RasaNusa (Rp M/minggu)",
"layout": """{yaxis: {title: "Kontribusi (Rp M)"}, showlegend: false}""",
"cara": "Tinggi batang = kontribusi tiap komponen ke penjualan mingguan. Base = abu-abu (bukan hasil marketing).",
"interpretasi": "60% penjualan = base (bukan karena iklan!). Dari 40% yang 'bisa diperebutkan', TV 15M vs digital 12M. Analis yang hanya lapor 'total penjualan naik' mengklaim 60% yang bukan jasanya — dekomposisi memaksa kejujuran."},
],
},
{
"id": "adstock", "toc": "Adstock & Saturasi",
"title": "Adstock & Saturasi — Iklan Punya Gema dan Batas",
"body": """<p><strong>Definisi.</strong> <strong>Adstock</strong>: efek iklan tidak hilang minggu itu juga — ada <strong>carryover</strong> (gema): adstock minggu ini = spend minggu ini + λ × adstock minggu lalu (λ = daya tahan, 0–1). <strong>Saturasi</strong>: <strong>diminishing return</strong> — rupiah ke-100 juta kurang efektif dari rupiah pertama. Bentuk umum: fungsi Hill/log: f(x) = x^α/(x^α + k^α) atau logaritmik.</p>
<p>Tanpa adstock: model meremehkan channel brand-building (TV) yang efeknya menumpuk. Tanpa saturasi: model menyarankan 'tambah terus' sampai tak masuk akal.</p>""",
"formulas": [
{"math": r"\text{adstock}_t = s_t + \lambda \cdot \text{adstock}_{t-1} \quad;\quad f(x) = \frac{x^{\alpha}}{x^{\alpha} + k^{\alpha}}",
"symbols": [
"<Tex math={String.raw`s_t`} />: spend minggu t",
"<Tex math={String.raw`\\lambda`} />: carryover (0,5 = separuh efek terbawa ke minggu depan; TV ~0,7, digital ~0,3)",
"<Tex math={String.raw`f(x)`} />: fungsi saturasi Hill — S-curve: lambat di awal, curam di tengah, datar di puncak",
"<Tex math={String.raw`k`} />: titik tengah saturasi (setengah efek maksimal)",
]},
],
"intuisi": "Adstock seperti <strong>gema di lembah</strong>: teriakan (iklan) minggu ini masih terdengar samar minggu depan. Saturasi seperti <strong>menyiram tanaman</strong>: gelas pertama menyegarkan, gelas ke-10 menggenang sia-sia. Model tanpa keduanya = tuli dan buta.",
"kapan": "Selalu dalam MMM. λ dan α diestimasi dari data (atau prior) — jangan asal 0,5.",
"worked": {"title": "📐 Contoh: Adstock TV vs digital (klik untuk buka)",
"body": """<p>Spend minggu 1: TV Rp10M (λ=0,7), digital Rp10M (λ=0,3). Tidak ada spend lagi.</p>
<p><strong>Adstock minggu 2:</strong> TV = 0 + 0,7×10 = <strong>7,0M</strong>; digital = 0,3×10 = <strong>3,0M</strong>. <strong>Minggu 4:</strong> TV = 3,4M; digital = 0,3M.</p>
<p><strong>Implikasi:</strong> TV 'bekerja' 4+ minggu setelah tayang — evaluasi TV mingguan (tanpa adstock) meremehkannya sistematis. Inilah salah satu alasan MMM RasaNusa yang asal bilang 'TV ROI 0,8'.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8], y: [10,7,4.9,3.4,2.4,1.7,1.2,0.8], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "TV (λ=0,7)"}, {x: [1,2,3,4,5,6,7,8], y: [10,3,0.9,0.27,0.08,0.02,0.01,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "Digital (λ=0,3)"}]""",
"title": "Adstock decay: gema TV vs digital",
"layout": """{xaxis: {title: "Minggu setelah spend"}, yaxis: {title: "Adstock tersisa (Rp M)"}, showlegend: true}""",
"cara": "Sumbu X = minggu setelah spend Rp10M di minggu 1, Y = sisa efek. Biru = TV, kuning = digital.",
"interpretasi": "TV masih 'berbunyi' di minggu ke-8 (0,8M); digital hilang di minggu ke-4. Evaluasi mingguan tanpa adstock = menghukum sistematis channel bergema panjang. Beda λ = beda cara membaca ROI."},
{"data": """[{x: [2,5,10,15,20,30,40], y: [3,7,11,13.5,15,16.2,16.8], type: "scatter", mode: "lines+markers", marker: {color: "#16a34a"}, name: "respons"}]""",
"title": "Kurva saturasi: rupiah berikutnya makin 'mahal'",
"layout": """{xaxis: {title: "Spend (Rp M)"}, yaxis: {title: "Incremental sales (Rp M)"}, showlegend: false}""",
"cara": "Sumbu X = spend, Y = penjualan tambahan. Kemiringan = marginal ROI.",
"interpretasi": "Rp2→5M: +4M sales (miring curam). Rp30→40M: +0,6M (hampir datar). <strong>Alokasi optimal: samakan marginal ROI antar channel</strong> — bukan rata-rata ROI. Inilah grafik yang seharusnya menentukan budget, bukan tabel ROI."},
],
},
{
"id": "bayes", "toc": "Bayesian MMM & Kalibrasi",
"title": "Bayesian & Kalibrasi — Prior yang Jujur, Bukti yang Nyata",
"body": """<p><strong>Definisi.</strong> <strong>Bayesian MMM</strong>: bukan mencari satu angka β, tapi <strong>distribusi</strong> — dengan <strong>prior</strong> (keyakinan awal: 'TV ROI 1–3 dari studi industri', bukan 'bebas 0–100'). Prior mencegah model ngawur saat data tipis (kolinearitas spend TV & digital). Output = interval kredibel ('ROI TV 1,2–2,1'), bukan titik.</p>
<p><strong>Kalibrasi</strong>: <em>wajib</em> — cocokkan MMM dengan <strong>hasil eksperimen</strong> (geo-lift, holdout). Jika MMM bilang TV ROI 0,8 tapi geo-experiment bilang 1,5 → percayai eksperimen, setel prior/model. MMM tanpa kalibrasi = opini mahal (kasus RasaNusa Rp2M).</p>""",
"formulas": [],
"intuisi": "Prior seperti <strong>nasihat mentor</strong>: 'dari 20 studi, TV FMCG ROI-nya 1–3'. Tanpa mentor (prior datar), anak magang (model) dengan data 2 tahun yang berisik bisa menyimpulkan 'TV ROI 0,01 atau 50' — keduanya ngawur. Kalibrasi = 'buktikan nasihatmu dengan eksperimen'.",
"kapan": "Selalu pakai prior informatif (dari eksperimen/studi) untuk channel utama. Kalibrasi minimal 1x/tahun dengan geo/holdout.",
"worked": {"title": "📐 Contoh: Kalibrasi RasaNusa (klik untuk buka)",
"body": """<p>MMM awal: TV ROI 0,8 (prior datar). Geo-experiment: TV ROI 1,5 (inkremental).</p>
<p><strong>Kalibrasi:</strong> set prior TV ~ Normal(1,5; 0,3) dari eksperimen → MMM diestimasi ulang → TV ROI 1,4 (CI 1,1–1,8). <strong>Rekomendasi berubah:</strong> bukan 'potong TV', tapi 'optimasi kreatif TV + alokasi marginal'.</p>
<p><strong>Pelajaran Rp2M:</strong> model termahal pun butuh jangkar realitas. Eksperimen Rp100jt menghemat kesalahan Rp2M + brand awareness 15 poin.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "MMM = kebenaran ilmiah tentang ROI tiap channel. Model mahal = pasti benar.",
"benar": "MMM = <strong>satu estimasi dengan asumsi</strong> (adstock, saturasi, kontrol, prior). Tanpa kalibrasi eksperimen, ia 'opini mahal berbaju matematika' (RasaNusa: Rp2M untuk rekomendasi yang merusak brand). Selalu tanya: 'dik alibrasi dengan eksperimen apa?' — tidak ada = diskon 90% kepercayaannya."},
{"t": "Kalau sudah ada atribusi digital yang detail, MMM tidak perlu.",
"benar": "Atribusi buta terhadap <strong>TV/OOH/brand</strong> dan <strong>baseline</strong> (60% penjualan RasaNusa!). MMM melihat portofolio penuh + base vs incremental. Keduanya komplemen: MMM untuk alokasi strategis tahunan, atribusi untuk optimasi taktis harian, eksperimen untuk kalibrasi."},
],
"tips": [
"<strong>Keputusan alokasi = marginal ROI, bukan rata-rata.</strong> Channel dengan ROI rata-rata 3,0 tapi sudah saturasi (marginal 0,5) kalah dari channel ROI 1,5 yang masih curam (marginal 1,8). Selalu baca kurva saturasi, bukan tabel.",
"<strong>Syarat data MMM: variasi.</strong> Jika spend TV flat Rp10M/minggu selama 3 tahun, model tidak bisa memisahkan efek TV dari waktu (kolinearitas sempurna). Butuh 'goyangan' historis (h Flighting, promo) — atau akui ketidakpastiannya via interval lebar.",
],
"labs": [
{"heading": "Transformasi Adstock + Saturasi",
"intro": "Terapkan adstock lalu saturasi pada data spend — lihat bagaimana 'Rp10M' menjadi 'efek efektif'.",
"title": "Lab 1 — Adstock & Saturasi",
"hint": "Ubah LAMBDA 0.7 → 0.3. Efek 'gema' memendek — channel bergema panjang vs pendek diperlakukan beda.",
"code": """# Adstock + saturasi (Hill)
spend = [10, 10, 0, 0, 10, 0, 0, 0]  # Rp M per minggu
LAMBDA, ALPHA, K = 0.7, 2.0, 8.0     # ubah sesukamu

ad, out = 0, []
for s in spend:
    ad = s + LAMBDA * ad
    sat = (ad ** ALPHA) / (ad ** ALPHA + K ** ALPHA)
    out.append((ad, sat))

print(f"{'mgg':>4} {'spend':>6} {'adstock':>8}  saturasi(0-1)")
for i, (s, (a, f)) in enumerate(zip(spend, out), 1):
    print(f"{i:>4} {s:>6} {a:>8.1f}  {f:.2f}")
print("\\nEfek 'efektif' = adstock -> saturasi, BUKAN spend mentah.")
print("Dua transformasi ini yang membuat MMM realistis.")
"""},
{"heading": "MMM Mini via Regresi Manual",
"intro": "Estimasi kontribusi channel dengan OLS sederhana (persamaan normal) pada data mingguan sintetis.",
"title": "Lab 2 — MMM Mini",
"hint": "Hapus KONTROL harga dari regresi — lihat koefisien TV berubah (omitted variable bias!). Itulah kenapa kontrol wajib.",
"code": """import random
random.seed(8)
# Data sintetis 104 minggu: sales = 60 + 1.5*tv_eff + 2.0*dig_eff - 3*harga + noise
rows = []
for _ in range(104):
    tv, dig = random.uniform(5, 15), random.uniform(3, 9)
    harga = random.uniform(0.9, 1.1)
    sales = 60 + 1.5*tv + 2.0*dig - 30*(harga-1) + random.gauss(0, 3)
    rows.append((1, tv, dig, harga, sales))

# OLS via persamaan normal (X'X)^-1 X'y — implementasi 4x4 sederhana
def ols(rows):
    n, p = len(rows), 4
    XtX = [[sum(r[i]*r[j] for r in rows) for j in range(p)] for i in range(p)]
    Xty = [sum(r[i]*r[4] for r in rows) for i in range(p)]
    # eliminasi Gauss
    M = [XtX[i] + [Xty[i]] for i in range(p)]
    for c in range(p):
        piv = M[c][c]
        for r in range(c+1, p):
            f = M[r][c]/piv
            M[r] = [a - f*b for a, b in zip(M[r], M[c])]
    b = [0]*p
    for c in range(p-1, -1, -1):
        b[c] = (M[c][p] - sum(M[c][j]*b[j] for j in range(c+1, p)))/M[c][c]
    return b

b = ols(rows)
print("Koefisien (true: base=60, tv=1.5, dig=2.0, harga=-30):")
for nama, v in zip(["base", "tv", "digital", "harga"], b):
    print(f"  {nama:<8} {v:7.2f}")
print("\\nROI: tv =", f"{b[1]:.2f}", "| digital =", f"{b[2]:.2f}", "(per Rp1M spend)")
"""},
],
"decisions": [
{"kondisi": "Alokasi budget tahunan antar-channel", "pakai": "MMM (dengan kalibrasi)",
"alasan": "Satu-satunya yang melihat portofolio penuh + base vs incremental.",
"contoh": "Split TV vs digital vs promo tahun depan."},
{"kondisi": "Optimasi taktis harian/mingguan digital", "pakai": "Atribusi + eksperimen (bukan MMM)",
"alasan": "MMM terlalu lambat & agregat untuk bidding harian.",
"contoh": "Alokasi antar ad-set Meta."},
{"kondisi": "Validasi angka MMM", "pakai": "Geo/holdout experiment",
"alasan": "MMM tanpa kalibrasi = opini mahal.",
"contoh": "Kalibrasi tahunan RasaNusa."},
{"kondisi": "Data &lt; 2 tahun / spend flat", "pakai": "Jangan MMM dulu — eksperimen + heuristik",
"alasan": "Syarat data tidak terpenuhi; model akan ngawur dengan percaya diri.",
"contoh": "Startup 1 tahun: geo-test + aturan marginal."},
],
"rule10": "<ol><li><strong>Base vs incremental</strong> — pisahkan dulu.</li><li><strong>Adstock + saturasi</strong> selalu.</li><li><strong>Kontrol wajib</strong> (harga, musim, distribusi).</li><li><strong>Kalibrasi dengan eksperimen</strong> — tanpa kecuali.</li></ol>",
"case": {"toc": "Mini-Case: Konsultan Rp2 Miliar",
"title": "Konsultan Rp2 Miliar RasaNusa",
"body": """<p>RasaNusa: MMM (tanpa kalibrasi, prior datar) → 'TV ROI 0,8, potong!'. Setahun kemudian: awareness −15 poin, sales −8%. Investigasi: model tanpa variabel brand, tanpa eksperimen kalibrasi.</p>""",
"q": "(a) Tiga cacat spesifikasinya? (b) Jika kamu analis internal saat itu, apa yang kamu lakukan sebelum eksekusi 'potong TV'? (c) Desain pengukuran yang benar untuk tahun depan?",
"pembahasan": """<p>(a) <strong>Tanpa brand equity</strong> sebagai outcome (hanya sales mingguan → buta efek jangka panjang), <strong>prior datar</strong> (model bebas ngawur), <strong>tanpa kalibrasi eksperimen</strong> (tidak ada jangkar realitas).</p>
<p>(b) <strong>Tahan eksekusi, minta:</strong> (1) interval kredibel (bukan titik 0,8 — jika CI 0,2–1,6, 'potong' tidak justified); (2) satu geo-experiment TV 8 minggu (Rp100jt) sebagai kalibrasi; (3) skenario 'potong bertahap 20%' + monitor awareness, bukan potong 100%.</p>
<p>(c) <strong>Portofolio:</strong> Bayesian MMM (prior dari eksperimen) + kalibrasi tahunan + brand tracking kuartalan + atribusi digital harian. Biaya total &lt; Rp500jt/tahun vs kerugian 8% sales.</p>"""},
"quiz": [
{"q": "Fungsi adstock dengan λ=0,7. Spend Rp10M minggu 1, nol setelahnya. Adstock minggu 3?",
"options": ["Rp10M", "Rp7M", "Rp4,9M", "Rp0"], "correct": 2,
"why": "Benar: minggu 2 = 0,7×10 = 7; minggu 3 = 0,7×7 = 4,9. Gema meluruh 30%/minggu. Tanpa adstock, model mengira efek TV hilang minggu 2."},
{"q": "Dua channel: TV ROI rata-rata 1,5 (masih curam), digital ROI 3,0 (sudah datar). Rupiah berikutnya ke?",
"options": ["Digital — ROI lebih tinggi", "TV — marginal ROI lebih tinggi", "Bagi rata", "Potong keduanya"], "correct": 1,
"why": "Benar: alokasi optimal menyamakan MARGINAL ROI. Rata-rata menipu (digital 3,0 adalah masa lalu); yang penting rupiah berikutnya."},
{"q": "Kenapa MMM butuh kontrol harga/musim/distribusi?",
"options": ["Biar model rumit", "Omitted variable bias — tanpa kontrol, efeknya 'dicuri' channel", "Syarat software", "Tidak butuh"], "correct": 1,
"why": "Benar: promo harga berbarengan dengan iklan TV → tanpa kontrol harga, model mengira TV yang menjual (padahal diskon). Kontrol memisahkan sebab."},
{"q": "MMM bilang TV ROI 0,8; geo-experiment bilang 1,5. Yang dipercaya?",
"options": ["MMM — lebih canggih", "Eksperimen — kalibrasi MMM ke 1,5 via prior", "Rata-rata", "Buang keduanya"], "correct": 1,
"why": "Benar: eksperimen = bukti kausal langsung. MMM dikalibrasi (prior) ke eksperimen, bukan sebaliknya. Hierarki bukti: eksperimen &gt; model."},
{"q": "Syarat data MMM yang paling sering dilanggar?",
"options": ["Data harus besar", "Butuh variasi spend yang cukup (tidak flat) + 2-3 tahun", "Harus harian", "Harus dari satu sumber"], "correct": 1,
"why": "Benar: spend flat = kolinearitas sempurna dengan waktu → model tidak bisa identifikasi. 'Goyangan' historis (flighting, promo) adalah bahan bakar identifikasi."},
],
"rangkum": [
"<strong>MMM</strong>: y = base + Σ β·f(adstock(spend)) + kontrol; output = kontribusi, ROI, kurva respons.",
"<strong>Adstock</strong> (gema, λ) + <strong>saturasi</strong> (Hill, diminishing return) = realisme.",
"<strong>Alokasi optimal</strong>: samakan marginal ROI, bukan rata-rata.",
"<strong>Bayesian</strong>: prior informatif mencegah ngawur; output = interval, bukan titik.",
"<strong>Kalibrasi eksperimen wajib</strong> — MMM tanpa itu = opini mahal.",
"<strong>Kapan TIDAK MMM</strong>: data &lt; 2 tahun / spend flat → eksperimen + heuristik dulu.",
],
"prev": ["mk12-attribution", "MK12"],
"next": ["mk14-pricing", "MK14"],
},
]
