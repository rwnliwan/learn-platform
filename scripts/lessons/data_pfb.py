# Track 7 Bagian B — PM-B1..B9 (CFA L2 slice)
LESSONS = [
{
"slug": "pm-b1-regresi", "id": "PM-B1", "track": "Portfolio Management",
"title_html": "Regresi Berganda:<br/>Model & Misspesifikasi",
"title_plain": "Regresi Berganda & Misspesifikasi Model",
"chapter_summary": "CFA L2 quant: regresi berganda (interpretasi parsial, dummy, adjusted R²), empat misspesifikasi klasik — omitted variable, heteroskedastisitas, multikolinearitas, autokorelasi — plus regresi untuk riset investasi. Lab regresi from-scratch & detektor heteroskedastisitas.",
"tujuan": [
"Menjelaskan interpretasi koefisien parsial dan dummy variable.",
"Membedakan R² vs adjusted R² dan kapan memakainya.",
"Mengidentifikasi 4 misspesifikasi: penyebab, deteksi, koreksi.",
"Menjelaskan aplikasi regresi untuk alpha & factor exposure.",
],
"story_title": "Cerita: Model 'Sempurna' yang Hancur di 2008",
"story": """<p><strong>Quant fund</strong> membangun model return saham: R² <strong>0,94</strong>, semua koefisien signifikan. <em>&ldquo;Model terbaik yang pernah kami buat.&rdquo;</em> 2008: model <strong>kolaps</strong> — prediksi meleset total.</p>
<p>Twist-nya: R² 0,94 adalah <strong>artefak</strong>. Model menderita <strong>autokorelasi residual</strong> (error berkorelasi antar-waktu → t-stat <em>palsu</em> signifikan) dan <strong>overfitting</strong> (12 variabel untuk 40 observasi). Ujian diagnostik tidak pernah dijalankan. <strong>Regresi tanpa diagnostik = ramalan cuaca tanpa melihat langit.</strong> Lesson ini: membangun model yang <em>jujur</em>.</p>""",
"concepts": [
{
"id": "berganda", "toc": "Regresi Berganda",
"title": "Regresi Berganda — Ceteris Paribus",
"body": """<p><strong>Definisi.</strong> <strong>Regresi berganda</strong>: Y = b0 + b1X1 + b2X2 + … + ε. <strong>Interpretasi parsial</strong>: b1 = efek X1 <em>dengan X lain konstan</em> (ceteris paribus). <strong>Dummy variable</strong>: 0/1 untuk kategori (mis. krisis = 1). <strong>Adjusted R²</strong> = R² yang <strong>dihukum</strong> tiap tambah variabel — naikkan hanya jika variabel benar-benar membantu.</p>
<p>Aturan: <strong>R² selalu naik</strong> tambah variabel (bahkan sampah!). <strong>Adjusted R²</strong> yang jujur.</p>""",
"formulas": [
{"math": r"Y = b_0 + b_1 X_1 + b_2 X_2 + \epsilon \quad;\quad \bar{R}^2 = 1 - (1-R^2)\frac{n-1}{n-k-1}",
"symbols": [
"<Tex math={String.raw`b_1`} />: efek X1 jika X2, X3, … ditahan konstan",
"<Tex math={String.raw`\\bar{R}^2`} />: adjusted R² — turun jika variabel baru tidak berguna",
"<Tex math={String.raw`k`} />: jumlah variabel independen",
"Dummy: koefisien = selisih rata-rata Y antar-kategori",
]},
],
"intuisi": "Koefisien parsial seperti <strong>menimbang satu bahan kue sambil bahan lain ditahan</strong>: b1 = 'tambah 1 telur, kue mengembang berapa <em>jika tepung &amp; gula tetap</em>'. Tanpa 'ditahan', efek tercampur.",
"kapan": "Model multifaktor return; kontrol variabel di riset.",
"worked": {"title": "📐 Contoh: Return vs 2 faktor (klik untuk buka)",
"body": """<p>R = 0,01 + 1,2×MKT − 0,3×SIZE. <strong>b_MKT = 1,2</strong>: pasar naik 1% → return naik 1,2% (X lain konstan). <strong>b_SIZE = −0,3</strong>: tilt ke big-cap.</p>
<p>R² = 0,72, adjusted = 0,70 (n=60, k=2) — sehat. Tambah 5 variabel sampah: R² → 0,75, <strong>adjusted → 0,68</strong> (turun!). <strong>Keputusan</strong>: tolak variabel sampah.</p>"""},
"charts": [],
},
{
"id": "misspesifikasi", "toc": "4 Misspesifikasi Klasik",
"title": "4 Misspesifikasi — Penyakit Model",
"body": """<p><strong>Definisi.</strong> <strong>(1) Omitted variable</strong>: variabel penting hilang → koefisien <em>bias</em>. <strong>(2) Heteroskedastisitas</strong>: varians residual tidak konstan → SE salah (t-stat tidak valid). <strong>(3) Multikolinearitas</strong>: X saling berkorelasi → koefisien tidak stabil (tanda bisa terbalik!). <strong>(4) Autokorelasi</strong>: residual berkorelasi antar-waktu → t-stat <em>terlalu optimis</em> (dosa fund 2008).</p>
<p><strong>Deteksi</strong>: plot residual vs fitted (corong = hetero), VIF &gt; 10 (multikol), Durbin-Watson ≈ 2 sehat / jauh dari 2 = autokorelasi. <strong>Koreksi</strong>: tambah variabel, White SE, drop/gabung variabel, Newey-West/model AR.</p>""",
"formulas": [],
"intuisi": "Misspesifikasi seperti <strong>penyakit dengan gejala khas</strong>: omitted = <em>demam</em> (bias, model 'panas' salah arah); hetero = <em>tekanan darah tak stabil</em> (SE naik-turun); multikol = <em>kembar siam</em> (tak bisa dipisah); autokorelasi = <em>batuk menular</em> antar-periode. <strong>Diagnosis dulu, obat kemudian.</strong>",
"kapan": "Setiap regresi time series / cross-section: jalankan 4 cek.",
"worked": {"title": "📐 Contoh: Autopsi fund 2008 (klik untuk buka)",
"body": """<p><strong>Gejala:</strong> DW = 0,7 (jauh &lt; 2) → <strong>autokorelasi positif</strong>. t-stat 'signifikan' ternyata <em>inflated</em>.</p>
<p><strong>Koreksi:</strong> Newey-West SE → 3 dari 12 variabel jadi <strong>tidak signifikan</strong>. R² '0,94' runtuh jadi model jujur R² 0,55.</p>
<p><strong>Pelajaran:</strong> signifikansi tanpa SE yang benar = ilusi. Selalu uji DW untuk data time series.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8,9,10], y: [0.5,-0.3,0.8,-1.2,2.1,-2.5,3.2,-3.8,4.5,-5.2], type: "scatter", mode: "markers", marker: {color: "#ef4444"}, name: "residual"}, {x: [1,2,3,4,5,6,7,8,9,10], y: [1,2,3,4,5,6,7,8,9,10], type: "scatter", mode: "markers", marker: {color: "#2a7de1", opacity: 0}, showlegend: false}]""",
"title": "Residual vs fitted: pola corong (heteroskedastisitas)",
"layout": """{xaxis: {title: "Fitted value"}, yaxis: {title: "Residual"}, showlegend: false}""",
"cara": "Titik merah = residual. Perhatikan sebarannya melebar ke kanan (corong).",
"interpretasi": "Corong = <strong>heteroskedastisitas</strong>: varians error membesar dengan fitted. Akibat: SE bias → uji-t tidak valid. Solusi: <strong>White robust SE</strong> atau transformasi (log). Residual yang sehat = awan acak tanpa pola."},
],
},
{
"id": "aplikasi", "toc": "Regresi untuk Investasi",
"title": "Aplikasi — Dari Alpha ke Factor",
"body": """<p><strong>Definisi.</strong> <strong>Event study</strong>: regresi return vs pasar di <em>event window</em> → <strong>abnormal return</strong> = aktual − prediksi. <strong>Factor exposure</strong>: regresi return portofolio ke faktor (MKT, SMB, HML) → koefisien = <em>loading</em>, intersep = <strong>alpha</strong>.</p>
<p>Jembatan ke PM-B8/PM-D3: inilah mesin Fama-French &amp; evaluasi manajer.</p>""",
"formulas": [
{"math": r"AR_t = R_t - (\hat{\alpha} + \hat{\beta} R_{m,t})",
"symbols": [
"<Tex math={String.raw`AR_t`} />: abnormal return — 'kejutan' di luar gerakan pasar",
"<Tex math={String.raw`\\hat{\\alpha}, \\hat{\\beta}`} />: dari estimation window (sebelum event)",
"CAR = Σ AR_t selama event window → uji signifikansi",
]},
],
"intuisi": "Event study seperti <strong>mengukur demam</strong>: suhu normal (prediksi pasar) vs suhu aktual — selisihnya = demam (abnormal) akibat 'infeksi' (event). Tanpa baseline, demam tak terukur.",
"kapan": "Uji dampak merger/kebijakan; ukur alpha manajer.",
"worked": {"title": "📐 Contoh: Merger announcement (klik untuk buka)",
"body": """<p>α̂ = 0,001, β̂ = 1,1. Hari pengumuman: R = 5%, R_m = 1%.</p>
<p><strong>AR</strong> = 5% − (0,1% + 1,1×1%) = 5% − 1,2% = <strong>+3,8%</strong>.</p>
<p>Uji: t = 3,8%/1,5% (SE) = 2,53 &gt; 1,96 → <strong>signifikan</strong>. Pasar menyukai merger ini — bukan sekadar ikut pasar naik.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "R² tinggi = model bagus. Kejar R² setinggi mungkin.",
"benar": "R² 0,94 fund 2008 = <strong>artefak autokorelasi + overfitting</strong>. R² naik otomatis tiap tambah variabel. Yang benar: <strong>adjusted R² + diagnostik residual + validasi out-of-sample</strong>. R² tinggi tanpa itu = make-up."},
{"t": "Koefisien tidak signifikan = variabel tidak penting. Buang saja.",
"benar": "<strong>Multikolinearitas</strong> bisa membuat variabel penting <em>tampak</em> tidak signifikan (SE menggembung). Cek VIF dulu — jika &gt; 10, masalahnya korelasi antar-X, bukan variabelnya. Buang membabi buta = omitted variable bias."},
],
"tips": [
"<strong>Plot residual SELALU.</strong> 30 detik melihat residual vs fitted + Q-Q plot menangkap 80% masalah (corong, pola, outlier). Angka tanpa gambar = buta.",
"<strong>Untuk time series: DW dulu, interpretasi kemudian.</strong> DW jauh dari 2 → SE salah → semua uji-t diragukan. Perbaiki (Newey-West/lag) baru baca hasil.",
],
"labs": [
{"heading": "Regresi Berganda From-Scratch",
"intro": "Estimasi OLS 2 variabel via normal equations (eliminasi Gauss). Lihat koefisien parsial.",
"title": "Lab 1 — OLS From-Scratch",
"hint": "Ubah korelasi X1-X2 (lihat kode). Koefisien jadi tidak stabil — multikolinearitas live!",
"code": """# OLS 2 variabel from scratch (normal equations + eliminasi Gauss)
import random
random.seed(7)
n = 60
# X1, X2 berkorelasi 0.85 -> multikolinearitas!
X1 = [random.gauss(0, 1) for _ in range(n)]
X2 = [0.85*x + random.gauss(0, 0.5) for x in X1]
Y = [1 + 2*x1 - 1*x2 + random.gauss(0, 1) for x1, x2 in zip(X1, X2)]

def solve(A, b):  # eliminasi Gauss
    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        for r in range(n):
            if r != c:
                f = M[r][c]/M[c][c]
                for k in range(c, n+1): M[r][k] -= f*M[c][k]
    return [M[i][n]/M[i][i] for i in range(n)]

cols = [[1]*n, X1, X2]
XtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(3)] for i in range(3)]
XtY = [sum(a*b for a, b in zip(cols[i], Y)) for i in range(3)]
b = solve(XtX, XtY)
print(f"b0={b[0]:.2f} (true 1), b1={b[1]:.2f} (true 2), b2={b[2]:.2f} (true -1)")
yh = [b[0]+b[1]*x1+b[2]*x2 for x1, x2 in zip(X1, X2)]
sse = sum((y-h)**2 for y, h in zip(Y, yh)); sst = sum((y-sum(Y)/n)**2 for y in Y)
r2 = 1-sse/sst
print(f"R2={r2:.3f}, adjR2={1-(1-r2)*(n-1)/(n-3):.3f}")
print("\\nX1-X2 berkorelasi 0.85: SE menggembung (multikolinearitas).")
"""},
{"heading": "Detektor Heteroskedastisitas",
"intro": "Uji pola corong: regresikan |residual| ke fitted (uji Breusch-Pagan sederhana).",
"title": "Lab 2 — Detektor Heteroskedastisitas",
"hint": "Ubah HETERO 1 -> 0 (homoskedastis). Uji jadi tidak signifikan — sehat!",
"code": """# Detektor heteroskedastisitas (Breusch-Pagan sederhana)
import random, math
random.seed(11)
n = 80
HETERO = 1  # 1 = ada hetero, 0 = sehat (ubah!)
X = [random.uniform(0, 10) for _ in range(n)]
sd = [1 + HETERO*0.5*x for x in X]   # varians membesar dengan X
Y = [2 + 3*x + random.gauss(0, s) for x, s in zip(X, sd)]

# OLS sederhana
mx, my = sum(X)/n, sum(Y)/n
b1 = sum((x-mx)*(y-my) for x, y in zip(X, Y))/sum((x-mx)**2 for x in X)
b0 = my - b1*mx
res = [y-(b0+b1*x) for x, y in zip(X, Y)]
yh = [b0+b1*x for x in X]
# regresi |res| ke yh
mr, mh = sum(abs(r) for r in res)/n, sum(yh)/n
g = sum((h-mh)*(abs(r)-mr) for h, r in zip(yh, res))/sum((h-mh)**2 for h in yh)
# t-stat kasar
print(f"slope |res| vs fitted: {g:.3f}")
print("KESIMPULAN:", "HETEROSKEDASTISITAS terdeteksi (corong!) -> pakai White robust SE" if abs(g) > 0.08 else "Homoskedastis (sehat)")
print("\\nPlot mental: residual melebar seperti corong ke kanan.")
"""},
],
"decisions": [
{"kondisi": "Tambah variabel, R² naik tapi adjR² turun", "pakai": "Tolak variabel",
"alasan": "Tidak menambah explanatory power.",
"contoh": "Variabel sampah."},
{"kondisi": "DW jauh dari 2 (time series)", "pakai": "Newey-West SE / tambah lag",
"alasan": "SE bias → uji-t invalid.",
"contoh": "Model return 2008."},
{"kondisi": "VIF &gt; 10", "pakai": "Drop/gabung variabel berkorelasi",
"alasan": "Koefisien tidak stabil.",
"contoh": "X1-X2 korelasi 0,85."},
{"kondisi": "Residual corong", "pakai": "White robust SE / transformasi",
"alasan": "Heteroskedastisitas.",
"contoh": "Regresi cross-section."},
],
"rule10": "<ol><li><strong>Adjusted R²</strong>, bukan R².</li><li><strong>Plot residual</strong> selalu.</li><li><strong>DW ≈ 2</strong> untuk time series.</li><li><strong>VIF &lt; 10</strong>.</li></ol>",
"case": {"toc": "Mini-Case: Fund 2008",
"title": "Model 'Sempurna' R² 0,94",
"body": """<p>Quant fund: R² 0,94, 12 variabel, 40 observasi, semua 'signifikan'. 2008: kolaps. Autopsi: DW 0,7.</p>""",
"q": "(a) Tiga dosa model? (b) Koreksi yang benar? (c) Aturan agar tidak terulang?",
"pembahasan": """<p>(a) <strong>Autokorelasi</strong> (DW 0,7 → t-stat inflated), <strong>overfitting</strong> (12 variabel/40 obs), <strong>tanpa diagnostik</strong> (percaya R²).</p>
<p>(b) <strong>Newey-West SE</strong> → hanya 9 variabel signifikan; <strong>validasi out-of-sample</strong>; sederhanakan model.</p>
<p>(c) <strong>Checklist wajib</strong>: residual plot, DW, VIF, adjusted R², backtest out-of-time — sebelum satu rupiah dipertaruhkan.</p>"""},
"quiz": [
{"q": "Tambah variabel: R² 0,72→0,75, adjusted 0,70→0,68. Keputusan?",
"options": ["Pertahankan (R² naik)", "Tolak — adjusted turun, variabel tidak membantu", "Tambah lagi", "Tidak bisa diputuskan"], "correct": 1,
"why": "Benar: R² selalu naik tambah variabel. Adjusted yang jujur — turun = variabel sampah."},
{"q": "DW = 0,7 pada regresi time series. Artinya?",
"options": ["Sehat", "Autokorelasi positif — SE bias, uji-t terlalu optimis", "Heteroskedastisitas", "Multikolinearitas"], "correct": 1,
"why": "Benar: DW ≈ 2 sehat; jauh di bawah 2 = autokorelasi positif. Dosa fund 2008."},
{"q": "VIF = 15 untuk X1. Masalah & solusi?",
"options": ["Tidak ada", "Multikolinearitas — drop/gabung variabel", "Omitted variable", "Tambah data"], "correct": 1,
"why": "Benar: VIF &gt; 10 = X berkorelasi kuat → koefisien tidak stabil. Solusi: drop atau gabung."},
{"q": "Residual membentuk corong (melebar ke kanan). Ini?",
"options": ["Normal", "Heteroskedastisitas — pakai White robust SE", "Autokorelasi", "Model sempurna"], "correct": 1,
"why": "Benar: varians tidak konstan → SE salah. Koreksi: robust SE atau transformasi."},
{"q": "Event study: AR = +3,8%, SE = 1,5%. Signifikan (5%)?",
"options": ["Tidak", "Ya — t = 2,53 &gt; 1,96", "Butuh R²", "Tidak bisa diuji"], "correct": 1,
"why": "Benar: 3,8/1,5 = 2,53 &gt; 1,96 → tolak H0. Pasar benar-benar bereaksi, bukan noise."},
],
"rangkum": [
"<strong>Parsial</strong>: b1 = efek X1 dengan X lain konstan; dummy = selisih kategori.",
"<strong>Adjusted R²</strong> menghukum variabel sampah.",
"<strong>4 penyakit</strong>: omitted (bias), hetero (SE salah), multikol (tidak stabil), autokorelasi (t inflated).",
"<strong>Deteksi</strong>: residual plot, VIF, DW; <strong>koreksi</strong>: White/Newey-West/drop.",
"<strong>Event study</strong>: AR = aktual − prediksi; CAR untuk window.",
"<strong>Kapan TIDAK percaya regresi</strong>: tanpa diagnostik.",
],
"prev": ["pm-a10-portfolio-mgmt", "PM-A10"],
"next": ["pm-b2-timeseries", "PM-B2"],
},
{
"slug": "pm-b2-timeseries", "id": "PM-B2", "track": "Portfolio Management",
"title_html": "Time Series:<br/>AR, Unit Root & GARCH",
"title_plain": "Time Series: Trend, AR, Unit Root, ARCH/GARCH",
"chapter_summary": "CFA L2 time series: model trend, AR(1)/AR(p) & stationarity, unit root & Dickey-Fuller, dan ARCH/GARCH untuk volatility clustering. Lab simulator AR(1) & GARCH.",
"tujuan": [
"Menjelaskan stationarity dan syarat AR(1) stasioner.",
"Membedakan trend-stationary vs difference-stationary (unit root).",
"Menjelaskan logika uji Dickey-Fuller.",
"Menjelaskan GARCH(1,1) dan volatility clustering.",
],
"story_title": "Cerita: Ramalan yang 'Akurat' Karena Mencontek",
"story": """<p><strong>Analis</strong> membangun model prediksi harga saham: R² <strong>0,98</strong>! <em>&ldquo;Regresi harga hari ini ke harga kemarin — hampir sempurna!&rdquo;</em> Ia trading dengan model itu. Hasil: <strong>rugi besar</strong>.</p>
<p>Twist-nya: harga saham = <strong>random walk</strong> (unit root). Regresi dua random walk menghasilkan <strong>spurious regression</strong> — R² tinggi <em>palsu</em> (Granger &amp; Newbold, 1974). Model 'mencontek' (harga kemarin ≈ harga hari ini) tapi <strong>tidak memprediksi apa-apa</strong> — seperti meramal 'besok cuaca = hari ini' lalu mengklaim jadi meteorolog. Lesson ini: mengenali data yang tidak stasioner.</p>""",
"concepts": [
{
"id": "ar", "toc": "AR & Stationarity",
"title": "AR(1) — Ingatan Satu Langkah",
"body": """<p><strong>Definisi.</strong> <strong>AR(1)</strong>: <Tex math={String.raw`x_t = b_0 + b_1 x_{t-1} + \\epsilon_t`} />. <strong>Stasioner</strong> jika <strong>|b1| &lt; 1</strong>: mean-reverting (kembali ke b0/(1−b1)). <strong>b1 = 1</strong> = <strong>random walk</strong> (tidak stasioner: varians → ∞, shock permanen). <strong>b1 &gt; 1</strong> = eksplosif.</p>
<p>Implikasi: regresi dengan data tidak stasioner → <strong>spurious</strong> (uji-t invalid). Solusi: <strong>difference</strong> dulu (Δx_t stasioner) atau uji kointegrasi.</p>""",
"formulas": [
{"math": r"x_t = b_0 + b_1 x_{t-1} + \epsilon_t \quad;\quad \text{stasioner} \iff |b_1| < 1",
"symbols": [
"<Tex math={String.raw`b_1`} />: persistensi — seberapa 'ingat' masa lalu",
"Mean jangka panjang: <Tex math={String.raw`b_0/(1-b_1)`} /> (hanya jika stasioner!)",
"Random walk (b1=1): harga saham — prediksi terbaik = harga kini (tapi bukan 'model')",
]},
],
"intuisi": "AR(1) seperti <strong>anjing dengan tali</strong>: |b1| &lt; 1 = tali elastis (anjing kembali ke pemilik = mean reversion); b1=1 = tali putus (anjing mengembara = random walk, ke mana-mana tapi tak kembali); b1 &gt; 1 = anjing ditarik roket.",
"kapan": "Model return/volatilitas: pastikan stasioner dulu (plot + uji).",
"worked": {"title": "📐 Contoh: Tiga nasib (klik untuk buka)",
"body": """<p><strong>b1 = 0,8</strong>: shock Rp100 → tersisa 80, 64, 51… → <strong>lenyap</strong> (mean-reverting). <strong>b1 = 1</strong>: shock Rp100 → <strong>menetap selamanya</strong> (harga saham!). <strong>b1 = 1,05</strong>: shock <strong>membesar</strong> eksponensial (bubble).</p>
<p>Regresi harga (b1=1) ke harga: R² 0,98 tapi <strong>spurious</strong>. Regresi <em>return</em> (Δharga, stasioner): R² 0,02 tapi <strong>jujur</strong>. Pilih jujur.</p>"""},
"charts": [
{"data": """[{x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], y: [0,0.5,0.2,0.9,0.4,0.1,0.6,0.3,0.0,0.4,0.2,0.5,0.1,0.3,0.0,0.2,0.4,0.1,0.3,0.2], type: "scatter", mode: "lines", line: {color: "#2a7de1"}, name: "AR(1) b1=0,5"}, {x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], y: [0,0.8,1.5,2.1,1.8,2.9,3.5,3.1,4.2,4.8,4.5,5.3,5.9,5.5,6.4,7.0,6.7,7.5,8.1,8.6], type: "scatter", mode: "lines", line: {color: "#ef4444"}, name: "random walk b1=1"}]""",
"title": "Stasioner vs random walk (ilustrasi)",
"layout": """{xaxis: {title: "Waktu"}, yaxis: {title: "Nilai"}, showlegend: true}""",
"cara": "Biru = AR(1) b1=0,5 (bolak-balik di sekitar 0); merah = random walk (mengembara).",
"interpretasi": "Biru <strong>mean-reverting</strong> — selalu kembali. Merah <strong>mengembara tanpa jangkar</strong> — varians membesar. Regresi dua garis merah = spurious. <strong>Uji stationarity sebelum regresi time series.</strong>"},
],
},
{
"id": "unitroot", "toc": "Unit Root & Dickey-Fuller",
"title": "Unit Root — Akar Persoalan",
"body": """<p><strong>Definisi.</strong> <strong>Unit root</strong>: b1 = 1 (akar karakteristik = 1). <strong>Trend-stationary</strong>: stasioner di sekitar <em>trend deterministik</em> (detrend → stasioner). <strong>Difference-stationary</strong>: butuh <em>differencing</em> (random walk with drift).</p>
<p><strong>Dickey-Fuller</strong>: H0 = ada unit root (tidak stasioner). Tolak H0 (test stat &lt; kritis, negatif besar) → stasioner. <strong>Kointegrasi</strong>: dua series tidak stasioner tapi <em>kombinasinya</em> stasioner → hubungan jangka panjang (pairs trading!).</p>""",
"formulas": [],
"intuisi": "Unit root seperti <strong>tes kewarganegaraan data</strong>: 'apakah kamu warga Stasioner?' Dickey-Fuller = pewawancaranya. H0 = 'bukan warga' (harus dibuktikan sebaliknya). Kointegrasi = 'dua turis yang selalu jalan bareng' — masing-masing mengembara, tapi jaraknya stabil.",
"kapan": "Sebelum regresi time series; pairs trading (kointegrasi).",
"worked": {"title": "📐 Contoh: Prosedur 3 langkah (klik untuk buka)",
"body": """<p><strong>1. Plot</strong>: tren naik tanpa kembali? curiga unit root. <strong>2. DF test</strong>: stat −1,2 &gt; kritis −2,9 → <strong>gagal tolak H0</strong> → tidak stasioner. <strong>3. Difference</strong>: Δx → DF stat −4,5 &lt; −2,9 → <strong>stasioner</strong> → pakai Δx untuk model.</p>
<p><strong>Jangan</strong> regresi level jika DF gagal tolak — kecuali uji kointegrasi lolos.</p>"""},
"charts": [],
},
{
"id": "garch", "toc": "ARCH/GARCH",
"title": "GARCH — Volatilitas Berkelompok",
"body": """<p><strong>Definisi.</strong> <strong>Volatility clustering</strong>: 'hari bergejolak diikuti hari bergejolak' (krisis berkelompok!). <strong>ARCH</strong>: varians kini = f(residual kuadrat lalu). <strong>GARCH(1,1)</strong>: <Tex math={String.raw`\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2`} /> — standar industri.</p>
<p><strong>α + β</strong> = persistensi volatilitas (≈ 0,9+ untuk saham: shock volatilitas <em>awet</em>). GARCH untuk <strong>forecasting risiko</strong>, bukan return.</p>""",
"formulas": [
{"math": r"\sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2",
"symbols": [
"<Tex math={String.raw`\\omega`} />: baseline varians jangka panjang",
"<Tex math={String.raw`\\alpha`} />: reaksi ke shock kemarin (news impact)",
"<Tex math={String.raw`\\beta`} />: ingatan volatilitas (persistensi)",
"Unconditional variance = <Tex math={String.raw`\\omega/(1-\\alpha-\\beta)`} />",
]},
],
"intuisi": "GARCH seperti <strong>prakiraan gempa susulan</strong>: gempa besar kemarin (α) + daerah memang rawan (β) = waspada hari ini. Volatilitas tidak acak — ia <em>menular</em> dari hari ke hari.",
"kapan": "Risk management: VaR besok (PM-B8), option pricing, margin setting.",
"worked": {"title": "📐 Contoh: Setelah crash (klik untuk buka)",
"body": """<p>ω=0,000005, α=0,10, β=0,85. Vol long-run = √(0,000005/0,05) = √(0,0001) = <strong>1%/hari</strong>.</p>
<p><strong>Crash</strong>: return −8% (ε² = 0,0064). σ²_besok = 0,000005 + 0,10×0,0064 + 0,85×0,0001 = <strong>0,00073</strong> → σ = 2,70%/hari (<strong>2,7x normal!</strong>).</p>
<p><strong>VaR besok naik 2,7x</strong> — risk manager yang pakai volatilitas konstan akan <em>underestimate</em> risiko tepat saat paling berbahaya.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "R² 0,98 = model terbaik. Pakai saja.",
"benar": "Regresi harga-ke-harga (random walk) = <strong>spurious regression</strong> (Granger-Newbold): R² tinggi palsu, uji-t invalid. Model 'mencontek' tapi tidak memprediksi. <strong>Stasionerkan dulu</strong> (difference/return), baru nilai R²-nya."},
{"t": "Volatilitas konstan cukup untuk risk management.",
"benar": "<strong>Volatility clustering</strong> = fakta: krisis berkelompok. σ konstan <em>underestimate</em> risiko setelah shock (lihat contoh GARCH: VaR 2,7x!). Risk manager modern memakai <strong>GARCH/EWMA</strong> — bukan σ historis statis."},
],
"tips": [
"<strong>Plot dulu, uji kemudian.</strong> Time series plot 10 detik memberi tahu: tren? musiman? cluster volatilitas? break? Uji formal (DF) mengkonfirmasi, bukan menggantikan, mata.",
"<strong>Bedakan forecast return vs volatilitas.</strong> Return hampir tidak terprediksi (random walk); <strong>volatilitas sangat terprediksi</strong> (GARCH). Fokus risk modeling ke yang bisa diprediksi.",
],
"labs": [
{"heading": "Simulator AR(1): Tiga Nasib",
"intro": "Simulasikan AR(1) dengan b1 = 0,8 / 1,0 / 1,05. Lihat bedanya.",
"title": "Lab 1 — Simulator AR(1)",
"hint": "Ubah B1 1.0 -> 0.5. Series jadi mean-reverting — bandingkan dengan random walk!",
"code": """# Simulator AR(1): stasioner vs random walk vs eksplosif
import random
random.seed(3)
B1 = 1.0   # ubah: 0.8 (stasioner) | 1.0 (random walk) | 1.05 (eksplosif)
N = 40

x, series = 0.0, []
for _ in range(N):
    x = B1 * x + random.gauss(0, 1)
    series.append(x)

print(f"AR(1) b1={B1}:")
print(" ".join(f"{v:6.1f}" for v in series[:20]))
print(" ...")
mn, mx = min(series), max(series)
print(f"\\nrange: [{mn:.1f}, {mx:.1f}]")
if abs(B1) < 1: print("STASIONER: mean-reverting, varians terbatas.")
elif B1 == 1: print("RANDOM WALK: mengembara, varians membesar dgn waktu.")
else: print("EKSPLOSIF: meledak (bubble!).")
print("\\nRegresi dua random walk = spurious (R2 palsu tinggi).")
"""},
{"heading": "Simulator GARCH(1,1)",
"intro": "Simulasikan volatility clustering dan lihat VaR naik setelah shock.",
"title": "Lab 2 — Simulator GARCH",
"hint": "Ubah SHOCK 5.0 -> 8.0. VaR besok makin besar — clustering beraksi!",
"code": """# GARCH(1,1): sigma2_t = w + a*e2_{t-1} + b*sigma2_{t-1}
import random, math
random.seed(5)
W, A, B = 0.000005, 0.10, 0.85   # long-run vol = 1%/hari
SHOCK = 0.08   # return -8% hari ini (ubah sesukamu)

sig2 = W/(1-A-B)   # mulai dari long-run variance
print(f"Vol long-run: {math.sqrt(sig2):.2%}/hari")
e2 = SHOCK**2
sig2_besok = W + A*e2 + B*sig2
print(f"Setelah shock {SHOCK:.0%}: vol besok = {math.sqrt(sig2_besok):.2%}/hari")
print(f"VaR 99% besok: {2.33*math.sqrt(sig2_besok):.2%} (vs normal {2.33*math.sqrt(W/(1-A-B)):.2%})")
print("\\nPelajaran: risiko TIDAK konstan. Setelah crash, siaga!")
"""},
],
"decisions": [
{"kondisi": "Regresi dengan data level tren", "pakai": "Uji DF dulu; difference jika unit root",
"alasan": "Cegah spurious regression.",
"contoh": "Pakai return, bukan harga."},
{"kondisi": "Dua series tidak stasioner tapi bergerak bersama", "pakai": "Uji kointegrasi",
"alasan": "Hubungan jangka panjang = peluang pairs trading.",
"contoh": "Saham kembar (dual listing)."},
{"kondisi": "Forecasting risiko/VaR", "pakai": "GARCH(1,1), bukan σ konstan",
"alasan": "Volatility clustering.",
"contoh": "VaR besok setelah crash."},
{"kondisi": "b1 &gt; 1 terestimasi", "pakai": "Curigai bubble / spesifikasi salah",
"alasan": "Eksplosif tidak sustain.",
"contoh": "Harga kripto 2021."},
],
"rule10": "<ol><li><strong>|b1| &lt; 1</strong> = stasioner.</li><li><strong>DF test</strong> sebelum regresi level.</li><li><strong>Spurious</strong>: R² tinggi bisa palsu.</li><li><strong>GARCH</strong> untuk volatilitas.</li></ol>",
"case": {"toc": "Mini-Case: R² 0,98",
"title": "Model 'Sempurna' yang Mencontek",
"body": """<p>Analis: regresi harga saham hari ini ke kemarin, R² 0,98. Trading dengannya → rugi besar.</p>""",
"q": "(a) Apa yang salah? (b) Kenapa R² tinggi tapi tak berguna? (c) Prosedur benar?",
"pembahasan": """<p>(a) <strong>Spurious regression</strong>: harga = random walk (unit root); regresi level invalid.</p>
<p>(b) <strong>R² mengukur 'kemiripan'</strong>, bukan prediksi. Harga kemarin ≈ hari ini secara mekanis — seperti 'meramal cuaca besok = hari ini'.</p>
<p>(c) <strong>Uji DF</strong> → difference (return) → model return (R² kecil tapi jujur) <strong>atau</strong> uji kointegrasi untuk hubungan level yang valid.</p>"""},
"quiz": [
{"q": "AR(1) dengan b1 = 1. Sifatnya?",
"options": ["Stasioner", "Random walk — tidak stasioner, shock permanen", "Eksplosif", "Mean-reverting cepat"], "correct": 1,
"why": "Benar: b1=1 = unit root. Varians → ∞, shock tidak hilang. Regresi level = spurious."},
{"q": "DF test: stat −1,2, kritis −2,9. Kesimpulan?",
"options": ["Stasioner", "Gagal tolak H0 — ada unit root (tidak stasioner)", "Eksplosif", "Perlu lebih banyak data"], "correct": 1,
"why": "Benar: −1,2 &gt; −2,9 (kurang negatif) → gagal tolak H0. Solusi: difference dulu."},
{"q": "GARCH: ω=0,02, α=0,10, β=0,85. Setelah return −5%, vol besok?",
"options": ["Tetap 0,63%", "≈ 1,69% (2,7x normal) — clustering!", "Turun", "Nol"], "correct": 1,
"why": "Benar: σ² = 0,02+0,10×25+0,85×0,4 = 2,86 → σ=1,69%. VaR ikut naik — risk manager waspada."},
{"q": "α + β = 0,95 pada GARCH. Artinya?",
"options": ["Volatilitas tidak persisten", "Sangat persisten — shock lama hilang", "Model salah", "Tidak ada artinya"], "correct": 1,
"why": "Benar: α+β ≈ 1 = ingatan panjang. Shock volatilitas butuh berminggu-minggu untuk reda (khas pasar saham)."},
{"q": "Dua saham tidak stasioner tapi spread-nya stasioner. Ini?",
"options": ["Spurious", "Kointegrasi — peluang pairs trading", "Kebetulan", "Autokorelasi"], "correct": 1,
"why": "Benar: kombinasi linear stasioner = hubungan ekuilibrium jangka panjang. Spread menyimpang → mean-revert → trading."},
],
"rangkum": [
"<strong>AR(1)</strong>: stasioner jika |b1| &lt; 1 (mean-reverting).",
"<strong>Unit root</strong> (b1=1) = random walk; regresi level = <strong>spurious</strong>.",
"<strong>Dickey-Fuller</strong>: H0 = unit root; tolak jika stat &lt; kritis.",
"<strong>Kointegrasi</strong>: kombinasi stasioner dari series tak stasioner.",
"<strong>GARCH(1,1)</strong>: σ² = ω + αε² + βσ²; clustering volatilitas.",
"<strong>Aturan</strong>: stasionerkan dulu, baru model.",
],
"prev": ["pm-b1-regresi", "PM-B1"],
"next": ["pm-b3-ml-investasi", "PM-B3"],
},
{
"slug": "pm-b3-ml-investasi", "id": "PM-B3", "track": "Portfolio Management",
"title_html": "Machine Learning:<br/>untuk Investasi",
"title_plain": "Machine Learning dalam Investasi",
"chapter_summary": "CFA L2 ML: supervised vs unsupervised, train/test & validasi time series (walk-forward), bias-variance & overfitting, regularisasi (Ridge/Lasso), serta clustering & PCA untuk finance. Lab demo overfitting & k-means from-scratch.",
"tujuan": [
"Membedakan supervised vs unsupervised dan contohnya di investasi.",
"Menjelaskan bias-variance tradeoff dan overfitting.",
"Menjelaskan walk-forward validation untuk time series.",
"Menjelaskan Ridge/Lasso dan kapan memakainya.",
],
"story_title": "Cerita: AI 'Akurat 99%' yang Bangkrut",
"story": """<p><strong>Startup</strong> meluncurkan 'AI prediksi saham akurat <strong>99%</strong>'. Investor antre. Setahun kemudian: <strong>return −40%</strong>.</p>
<p>Twist-nya: 99% adalah <strong>akurasi training</strong> — model menghafal noise historis (<strong>overfitting</strong>). Validasi dilakukan dengan <strong>cross-validation acak</strong> pada time series (= <em>look-ahead bias</em>: 'melihat' masa depan!). Dua dosa fatal: <strong>tidak ada test set yang jujur</strong>. <strong>ML tanpa validasi benar = astrologi dengan GPU.</strong> Lesson ini: disiplin yang membedakan sains dari sulap.</p>""",
"concepts": [
{
"id": "supervised", "toc": "Supervised & Validasi",
"title": "Supervised — Belajar dari Label",
"body": """<p><strong>Definisi.</strong> <strong>Supervised</strong>: prediksi y dari X berlabel — <em>regresi</em> (return kontinu) &amp; <em>klasifikasi</em> (naik/turun, default/tidak). <strong>Train/test split</strong>: latih di masa lalu, uji di 'masa depan' yang belum dilihat. <strong>Untuk time series: walk-forward</strong> (train 2015–20 → test 2021; geser) — <strong>CV acak DILARANG</strong> (look-ahead!).</p>
<p><strong>Metrik</strong>: regresi → RMSE/MAE; klasifikasi → akurasi/precision/recall/AUC (untuk default: <strong>recall</strong> penting!).</p>""",
"formulas": [],
"intuisi": "Validasi ML seperti <strong>ujian sekolah</strong>: train = latihan soal, test = ujian. CV acak di time series = <strong>ujian dengan kunci jawaban bocor</strong> (soal 'masa depan' dipakai latihan). Walk-forward = ujian kenaikan kelas yang jujur.",
"kapan": "Setiap model prediktif: default (PM-A4 ratios → PD), return, churn.",
"worked": {"title": "📐 Contoh: Walk-forward (klik untuk buka)",
"body": """<p>Data 2015–2024. <strong>Fold 1</strong>: train 2015–18, test 2019. <strong>Fold 2</strong>: train 2015–19, test 2020. … <strong>Fold 6</strong>: train 2015–23, test 2024.</p>
<p><strong>6 skor out-of-time</strong> → rata-rata &amp; stabilitas. Model yang bagus di 2019 tapi jeblok 2020 (COVID) = <strong>rapuh rezim</strong> — informasi berharga, bukan kegagalan.</p>"""},
"charts": [
{"data": """[{x: ["2019","2020","2021","2022","2023","2024"], y: [0.62,0.31,0.58,0.55,0.60,0.57], type: "bar", marker: {color: ["#2a7de1","#ef4444","#2a7de1","#2a7de1","#2a7de1","#2a7de1"]}, text: ["0,62","0,31","0,58","0,55","0,60","0,57"], textposition: "outside"}]""",
"title": "Skor walk-forward per tahun (AUC, ilustrasi)",
"layout": """{xaxis: {title: "Tahun test"}, yaxis: {title: "AUC"}, showlegend: false}""",
"cara": "Tinggi batang = AUC model di tahun test (walk-forward).",
"interpretasi": "2020 <strong>anjlok</strong> (COVID = rezim baru) — model rapuh. Rata-rata 0,54 = <strong>nyaris koin</strong>. Walk-forward jujur: ia menunjukkan <em>kapan</em> model gagal, bukan cuma rata-rata. Model '99% akurat' startup itu tidak pernah diuji begini."},
],
},
{
"id": "overfitting", "toc": "Bias-Variance & Overfitting",
"title": "Overfitting — Menghafal vs Memahami",
"body": """<p><strong>Definisi.</strong> <strong>Bias</strong> = error karena model terlalu sederhana (underfit). <strong>Variance</strong> = error karena terlalu sensitif ke training (overfit). <strong>Tradeoff</strong>: kompleksitas ↑ → bias ↓ tapi variance ↑. <strong>Overfitting</strong> = variance dominan: bagus di training, jeblok di test.</p>
<p><strong>Regularisasi</strong>: <strong>Ridge (L2)</strong> = hukum koefisien besar (ciutkan); <strong>Lasso (L1)</strong> = hukum hingga <strong>nol</strong> (seleksi variabel otomatis!).</p>""",
"formulas": [
{"math": r"\text{Ridge:} \min \sum e^2 + \lambda\sum b_j^2 \quad;\quad \text{Lasso:} \min \sum e^2 + \lambda\sum |b_j|",
"symbols": [
"<Tex math={String.raw`\\lambda`} />: kekuatan hukuman — 0 = OLS biasa, besar = model kaku",
"Ridge: semua koefisien mengecil (tetap ada); Lasso: sebagian jadi NOL (seleksi!)",
"Pilih λ via validasi (walk-forward!)",
]},
],
"intuisi": "Overfitting seperti <strong>siswa menghafal kunci jawaban</strong>: nilai latihan 100, ujian 40 (soal beda). Regularisasi = <strong>guru yang melarang hafalan</strong> (λ): 'pahami polanya, jangan hafal angkanya'. Lasso = guru galak (coret yang tidak penting).",
"kapan": "Banyak fitur, sedikit data (khas finance!): selalu regularisasi.",
"worked": {"title": "📐 Contoh: 50 fitur, 100 observasi (klik untuk buka)",
"body": """<p>OLS: R² train 0,92, test <strong>0,15</strong> (overfit parah). <strong>Ridge</strong> (λ optimal): train 0,55, test <strong>0,48</strong>. <strong>Lasso</strong>: 12 dari 50 fitur tersisa, test 0,50.</p>
<p><strong>Pelajaran:</strong> R² train tinggi = <em>warning</em>, bukan prestasi. Finance = small-n-large-p → regularisasi <strong>wajib</strong>, bukan opsi.</p>"""},
"charts": [],
},
{
"id": "unsupervised", "toc": "Unsupervised: Cluster & PCA",
"title": "Unsupervised — Menemukan Struktur",
"body": """<p><strong>Definisi.</strong> <strong>Clustering</strong> (k-means): kelompokkan observasi mirip — <em>regime detection</em> (pasar risk-on/off), segmentasi saham. <strong>PCA</strong>: kompres banyak variabel jadi sedikit <strong>komponen utama</strong> (faktor statistik!) — 100 rasio → 5 faktor.</p>
<p><strong>Hierarchical clustering</strong> untuk <strong>HRP</strong> (Hierarchical Risk Parity, PM-D2): alokasi by struktur korelasi, bukan inverse-vol semata.</p>""",
"formulas": [],
"intuisi": "Clustering seperti <strong>mengelompokkan siswa tanpa daftar kelas</strong>: yang duduk berdekatan &amp; mirip seragamnya = satu kelas (rezim). PCA seperti <strong>meringkas 100 kolom rapor jadi 5 nilai utama</strong> (akademik, olahraga, seni…) — informasi 90% tersimpan.",
"kapan": "Regime detection, diversifikasi by cluster, reduksi fitur.",
"worked": {"title": "📐 Contoh: 2 rezim pasar (klik untuk buka)",
"body": """<p>K-means (k=2) pada (return, volatilitas) harian 10 tahun → <strong>Cluster A</strong>: return +, vol rendah (risk-on, 75% hari); <strong>Cluster B</strong>: return −, vol tinggi (risk-off, 25%).</p>
<p><strong>Strategi</strong>: alokasi agresif di A, defensif di B (regime-switching). Sederhana tapi mengalahkan buy-and-hold statis di backtest — karena <strong>risiko tidak konstan</strong> (ingat GARCH!).</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Model ML 99% akurat = pasti menghasilkan uang.",
"benar": "99% <strong>training</strong> = overfitting; 99% via <strong>CV acak</strong> di time series = look-ahead bias. Yang penting: <strong>out-of-time test + net of cost</strong>. Banyak model 'akurat' gagal karena <strong>biaya transaksi</strong> memakan sinyal kecil."},
{"t": "Makin kompleks (deep learning) makin bagus untuk finance.",
"benar": "Finance = <strong>data sedikit, noise besar, rezim berubah</strong> — kebalikan syarat DL. Model sederhana teregularisasi (Ridge, RF kecil) sering menang. Kompleksitas harus <em>dibayar</em> dengan validasi out-of-time yang jauh lebih baik."},
],
"tips": [
"<strong>Aturan 3 split untuk time series.</strong> Train (fit) → validation (pilih λ/model) → test (sekali saja, di akhir). Test yang diintip berkali-kali = training set baru. Disiplin ini yang memisahkan quant dari penjudi.",
"<strong>Mulai dari baseline bodoh.</strong> 'Prediksi = rata-rata historis' atau 'return besok = 0'. Model ML harus <em>mengalahkan</em> ini secara signifikan — jika tidak, kompleksitasnya sampah.",
],
"labs": [
{"heading": "Demo Overfitting: Polinomial",
"intro": "Fit polinomial derajat 1 vs 9 pada data noisy. Lihat train vs test.",
"title": "Lab 1 — Demo Overfitting",
"hint": "Ubah DERAJAT 9 -> 2. Test error turun drastis — kompleksitas tepat!",
"code": """# Demo overfitting: fit polinomial pada data noisy (from scratch)
import random, math
random.seed(21)
DERAJAT = 9   # ubah: 1 (underfit) | 2-3 (pas) | 9 (overfit!)
N_TRAIN, N_TEST = 15, 100

def data(n):
    xs = [random.uniform(0, 1) for _ in range(n)]
    return xs, [math.sin(2*math.pi*x) + random.gauss(0, 0.25) for x in xs]

def solve(A, b):
    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]
        for r in range(n):
            if r != c:
                f = M[r][c]/M[c][c]
                for k in range(c, n+1): M[r][k] -= f*M[c][k]
    return [M[i][n]/M[i][i] for i in range(n)]

def fit(xs, ys, d):
    cols = [[x**p for x in xs] for p in range(d+1)]
    XtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(d+1)] for i in range(d+1)]
    XtY = [sum(a*b for a, b in zip(cols[i], ys)) for i in range(d+1)]
    return solve(XtX, XtY)

def err(beta, xs, ys):
    return math.sqrt(sum((y - sum(b*x**p for p, b in enumerate(beta)))**2 for x, y in zip(xs, ys))/len(xs))

xtr, ytr = data(N_TRAIN); xte, yte = data(N_TEST)
beta = fit(xtr, ytr, DERAJAT)
print(f"Derajat {DERAJAT}: train RMSE={err(beta,xtr,ytr):.3f}, test RMSE={err(beta,xte,yte):.3f}")
print("OVERFIT!" if err(beta,xte,yte) > 0.45 else "Sehat." if err(beta,xte,yte) < 0.35 else "Bias-variance seimbang.")
print("\\nTrain bagus + test jeblok = menghafal noise.")
"""},
{"heading": "K-Means From-Scratch (Regime Detection)",
"intro": "Cluster (return, vol) jadi 2 rezim pasar dengan k-means manual.",
"title": "Lab 2 — K-Means Rezim",
"hint": "Ubah K 2 -> 3. Lihat cluster ketiga muncul — berapa K yang 'benar'? (elbow method!)",
"code": """# K-means from scratch untuk deteksi rezim pasar
import random, math
random.seed(33)
K = 2   # ubah sesukamu
# data sintetis: (return, vol) — 2 rezim
pts = [(random.gauss(0.08, 0.5), random.gauss(1.0, 0.3)) for _ in range(60)]
pts += [(random.gauss(-0.5, 1.0), random.gauss(3.0, 0.8)) for _ in range(30)]

cent = random.sample(pts, K)
for _ in range(20):
    cl = [[] for _ in range(K)]
    for p in pts:
        j = min(range(K), key=lambda k: (p[0]-cent[k][0])**2 + (p[1]-cent[k][1])**2)
        cl[j].append(p)
    cent = [(sum(x for x, _ in c)/len(c), sum(y for _, y in c)/len(c)) for c in cl]

for i, (c, pts_c) in enumerate(zip(cent, cl)):
    print(f"Cluster {i+1}: n={len(pts_c):3d}, pusat=(ret {c[0]:+.2f}, vol {c[1]:.2f})")
print("\\nInterpretasi: cluster vol tinggi + return negatif = rezim RISK-OFF.")
print("Strategi: kurangi risiko saat di cluster itu.")
"""},
],
"decisions": [
{"kondisi": "Model time series", "pakai": "Walk-forward validation",
"alasan": "CV acak = look-ahead bias.",
"contoh": "6 fold tahunan."},
{"kondisi": "Banyak fitur, sedikit data", "pakai": "Ridge/Lasso + validasi",
"alasan": "Cegah overfitting; Lasso seleksi otomatis.",
"contoh": "50 rasio, 100 observasi."},
{"kondisi": "Train bagus, test jeblok", "pakai": "Sederhanakan / regularisasi",
"alasan": "Overfit: menghafal noise.",
"contoh": "Turunkan derajat polinomial."},
{"kondisi": "Deteksi rezim pasar", "pakai": "Clustering (k-means)",
"alasan": "Unsupervised menemukan struktur.",
"contoh": "Risk-on/off untuk alokasi."},
],
"rule10": "<ol><li><strong>Walk-forward</strong> untuk time series.</li><li><strong>Baseline bodoh</strong> dulu.</li><li><strong>Test sekali</strong>, di akhir.</li><li><strong>Regularisasi</strong> saat fitur banyak.</li></ol>",
"case": {"toc": "Mini-Case: AI 99%",
"title": "AI 'Akurat 99%' −40%",
"body": """<p>Startup: klaim 99% akurat (training), validasi CV acak. Live: −40% setahun.</p>""",
"q": "(a) Dua dosa validasi? (b) Protokol benar? (c) Kenapa 'akurat' ≠ profit?",
"pembahasan": """<p>(a) <strong>Tidak ada test set jujur</strong> (99% = training = overfit) dan <strong>CV acak di time series</strong> = look-ahead bias.</p>
<p>(b) <strong>Walk-forward</strong>: train → validation (pilih model) → test sekali. Lapor <strong>net of cost</strong>.</p>
<p>(c) <strong>Akurasi ≠ edge</strong>: prediksi benar 60% tapi win kecil/loss besar = rugi; <strong>biaya transaksi</strong> memakan sinyal kecil. Metrik = <strong>return bersih risiko</strong>, bukan akurasi.</p>"""},
"quiz": [
{"q": "Validasi benar untuk model time series?",
"options": ["CV acak 5-fold", "Walk-forward (train masa lalu → test masa depan)", "Tidak perlu validasi", "Test = training"], "correct": 1,
"why": "Benar: CV acak 'membocorkan' masa depan ke training (look-ahead). Walk-forward meniru live trading."},
{"q": "Train R² 0,92, test 0,15. Diagnosis?",
"options": ["Model bagus", "Overfitting — sederhanakan/regularisasi", "Data salah", "Tambah fitur"], "correct": 1,
"why": "Benar: gap train-test = menghafal noise. Solusi: Ridge/Lasso, kurangi kompleksitas, atau tambah data."},
{"q": "Lasso vs Ridge. Kelebihan Lasso?",
"options": ["Tidak ada", "L1 membuat koefisien = 0 (seleksi variabel otomatis)", "Lebih cepat", "Tidak butuh λ"], "correct": 1,
"why": "Benar: Lasso = seleksi + estimasi sekaligus. Ridge hanya menciutkan. Untuk 50 fitur → Lasso menemukan yang penting."},
{"q": "K-means pada (return, vol) menemukan cluster vol-tinggi/return-negatif. Gunakan untuk?",
"options": ["Diabaikan", "Regime detection — defensif saat risk-off", "Beli saat risk-off", "Tidak ada gunanya"], "correct": 1,
"why": "Benar: unsupervised menemukan struktur. Rezim risk-off = kurangi eksposur (strategi regime-switching)."},
{"q": "Model 'akurat 80%' tapi live rugi. Penjelasan paling mungkin?",
"options": ["Akurasi salah hitung", "Biaya transaksi + win/loss asymmetry memakan edge", "Pasar jahat", "Komputer lambat"], "correct": 1,
"why": "Benar: akurasi ≠ profit. Sinyal kecil habis di biaya; 80% win kecil vs 20% loss besar = rugi. Ukur net of cost."},
],
"rangkum": [
"<strong>Supervised</strong>: regresi &amp; klasifikasi; <strong>walk-forward</strong> untuk time series.",
"<strong>Bias-variance</strong>: sederhana = bias, kompleks = variance; target = seimbang.",
"<strong>Ridge (L2)</strong> menciutkan; <strong>Lasso (L1)</strong> menyeleksi (→ 0).",
"<strong>Unsupervised</strong>: k-means (rezim), PCA (kompresi faktor).",
"<strong>Metrik</strong>: RMSE, AUC; untuk default: recall.",
"<strong>Aturan</strong>: baseline bodoh dulu; test sekali; lapor net of cost.",
],
"prev": ["pm-b2-timeseries", "PM-B2"],
"next": ["pm-b4-valuasi-ekuitas", "PM-B4"],
},
{
"slug": "pm-b4-valuasi-ekuitas", "id": "PM-B4", "track": "Portfolio Management",
"title_html": "Valuasi Ekuitas:<br/>DDM, FCFF & Multiples",
"title_plain": "Valuasi Ekuitas: DDM, FCFF/FCFE, Residual Income, Multiples",
"chapter_summary": "CFA L2 valuasi: DDM multi-stage, FCFF/FCFE (firm → equity value), residual income, dan multiples relatif (P/E, EV/EBITDA) dengan jebakannya. Lab kalkulator DDM 2-stage & builder FCFF.",
"tujuan": [
"Menghitung nilai saham via DDM Gordon growth & 2-stage.",
"Membangun FCFF/FCFE dari laporan keuangan dan menilai ekuitas.",
"Menjelaskan residual income dan kapan memakainya.",
"Membandingkan multiples dan menjelaskan jebakan P/E rendah.",
],
"story_title": "Cerita: Saham 'Murah' P/E 3x yang Mahal",
"story": """<p><strong>Tono</strong> screening saham: menemukan <strong>P/E 3x</strong> — <em>&ldquo;termurah di bursa!&rdquo;</em> Ia borong. Setahun kemudian: saham <strong>turun 50%</strong>, dividen dipotong, laba anjlok.</p>
<p>Twist-nya: P/E 3x = <strong>value trap</strong>. E (earnings) <em>sementara tinggi</em> (puncak siklus komoditas); E <em>forward</em> kolaps. P/E rendah bukan murah — melainkan <strong>pasar sudah tahu</strong> labanya akan turun. <strong>Multiples tanpa memahami E = membaca harga tanpa membaca barang.</strong> Lesson ini: valuasi absolut sebagai jangkar.</p>""",
"concepts": [
{
"id": "ddm", "toc": "DDM Multi-Stage",
"title": "DDM — Dividen yang Didiskon",
"body": """<p><strong>Definisi.</strong> <strong>Gordon growth</strong>: P0 = D1/(r−g) — untuk growth <em>konstan selamanya</em>. <strong>2-stage</strong>: growth tinggi N tahun → lalu stabil: P0 = PV dividen tahap 1 + PV terminal value (lihat rumus di bawah).</p>
<p>Syarat: perusahaan <strong>bagi dividen</strong> (atau bisa). Tidak cocok untuk startup nir-dividen → pakai FCFE.</p>""",
"formulas": [
{"math": r"P_0 = \sum_{t=1}^{N}\frac{D_t}{(1+r)^t} + \frac{1}{(1+r)^N}\frac{D_{N+1}}{r-g}",
"symbols": [
"<Tex math={String.raw`D_t`} />: dividen tahun t (tumbuh g_tinggi selama N tahun)",
"<Tex math={String.raw`P_N`} />: terminal value — sering 70–80% total nilai!",
"<Tex math={String.raw`g`} />: growth stabil &lt; r (biasanya ≈ GDP nominal)",
"Peringatan: mayoritas nilai di terminal → sensitif ke g &amp; r",
]},
],
"intuisi": "2-stage DDM seperti <strong>menilai pohon buah</strong>: 5 tahun pertama berbuah lebat (hitung satu-satu), setelahnya berbuah 'normal' selamanya (pakai rumus). <strong>Sebagian besar harga = 'selamanya'-nya</strong> — ironis tapi benar.",
"kapan": "Bank/utilitas berdividen stabil; tidak untuk growth nir-dividen.",
"worked": {"title": "📐 Contoh: Bank Dividen (klik untuk buka)",
"body": """<p>D0 = Rp400, g_tinggi = 12% (5 thn), g_stabil = 5%, r = 11%.</p>
<p><strong>Dividen thn 1–5</strong>: 448, 502, 562, 629, 705. PV = 404+413+417+421+418 = <strong>Rp2.073</strong>.</p>
<p><strong>Terminal</strong>: D6 = 705×1,05 = 740; P5 = 740/(0,11−0,05) = Rp12.333; PV = 12.333/1,11^5 = <strong>Rp7.318</strong>.</p>
<p><strong>P0 = Rp9.391</strong> — terminal 78% nilai! Harga pasar Rp11.000 → overvalued (asumsi benar).</p>"""},
"charts": [],
},
{
"id": "fcff", "toc": "FCFF/FCFE",
"title": "FCFF/FCFE — Kas untuk Semua vs Pemilik",
"body": """<p><strong>Definisi.</strong> <strong>FCFF</strong> = kas untuk <em>semua</em> investor (utang + ekuitas): NI + NCC + Int(1−T) − FCInv − WCInv. <strong>FCFE</strong> = untuk <em>pemegang saham</em>: FCFF − Int(1−T) + Net Borrowing. <strong>Nilai perusahaan</strong> = PV(FCFF) @ WACC; <strong>nilai ekuitas</strong> = PV(FCFE) @ r_e = Firm value − utang + kas.</p>
<p>Pilih: <strong>FCFF</strong> jika leverage berubah-ubah; <strong>FCFE</strong> jika struktur modal stabil.</p>""",
"formulas": [
{"math": r"FCFF = NI + NCC + Int(1-T) - FCInv - WCInv",
"symbols": [
"<Tex math={String.raw`NI`} />: laba bersih",
"<Tex math={String.raw`NCC`} />: beban non-kas (depresiasi, amortisasi)",
"<Tex math={String.raw`Int(1-T)`} />: bunga setelah pajak (kembali ditambahkan — milik semua investor)",
"<Tex math={String.raw`FCInv, WCInv`} />: investasi aset tetap &amp; modal kerja",
]},
],
"intuisi": "FCFF seperti <strong>air bersih dari mata air</strong> (untuk semua penduduk desa = semua investor); FCFE = air yang sampai ke <em>rumahmu</em> setelah pipa desa (utang) mengambil bagiannya. Nilai rumahmu = PV air yang sampai.",
"kapan": "Valuasi absolut utama; DCF = standar industri.",
"worked": {"title": "📐 Contoh: FCFF 1 tahun (klik untuk buka)",
"body": """<p>NI Rp200M, depresiasi Rp80M, bunga Rp50M (T=22%), capex Rp150M, ΔWC Rp40M.</p>
<p><strong>FCFF</strong> = 200 + 80 + 50×0,78 − 150 − 40 = 200+80+39−150−40 = <strong>Rp129M</strong>.</p>
<p>Jika FCFF tumbuh 8% 5 thn lalu 4%, WACC 12%: firm value ≈ Rp1,9T. Kurangi utang Rp600M + kas Rp100M → <strong>ekuitas Rp1,4T</strong> → /saham beredar = harga wajar.</p>"""},
"charts": [
{"data": """[{x: ["Firm value<br>(PV FCFF)", "Kurang: utang", "Tambah: kas", "Equity value"], y: [1900, -600, 100, 1400], type: "bar", marker: {color: ["#2a7de1","#ef4444","#16a34a","#2a7de1"]}, text: ["1900","−600","+100","1400"], textposition: "outside"}]""",
"title": "Bridge: firm value → equity value (Rp M)",
"layout": """{yaxis: {title: "Rp M"}, showlegend: false}""",
"cara": "Mulai dari firm value, kurangi utang, tambah kas = equity value.",
"interpretasi": "Equity = <strong>residu</strong> setelah kreditor. Perusahaan 'bernilai' Rp1,9T tapi ekuitas cuma Rp1,4T — <strong>leverage memakan nilai</strong>. Inilah kenapa valuasi ekuitas wajib lewat bridge ini, bukan langsung."},
],
},
{
"id": "ri", "toc": "Residual Income & Multiples",
"title": "Residual Income & Multiples — Dua Lensa",
"body": """<p><strong>Definisi.</strong> <strong>Residual income</strong>: V0 = book value + PV 'laba sisa' (laba <em>di atas</em> biaya ekuitas; lihat rumus di bawah). Cocok saat <strong>FCF negatif</strong> (growth capex besar) tapi <strong>book value</strong> andal. <strong>Multiples</strong>: P/E, EV/EBITDA, P/B, P/S — bandingkan <em>relatif</em> ke peers.</p>
<p><strong>Jebakan multiples</strong>: P/E rendah bisa = value trap (E sementara); EV/EBITDA lebih bersih (netral struktur modal); pastikan <strong>peers sebanding</strong> (growth, risiko, akuntansi!).</p>""",
"formulas": [
{"math": r"V_0 = B_0 + \sum_{t=1}^{\infty}\frac{RI_t}{(1+r)^t} \quad;\quad RI_t = NI_t - r \times B_{t-1}",
"symbols": [
"<Tex math={String.raw`B_0`} />: book value ekuitas kini (jangkar!)",
"<Tex math={String.raw`RI_t`} />: 'laba sisa' — yang melebihi required return",
"RRI positif persisten = moat (return &gt; biaya modal)",
]},
],
"intuisi": "Residual income seperti <strong>menilai kos dari uang muka + 'lebihnya'</strong>: B0 = harga tanah (pasti), RI = sewa di atas bunga deposito (nilai tambah). Multiples seperti <strong>harga pasaran tanah tetangga</strong> — cepat, tapi bisa sekampung salah harga (bubble sektor!).",
"kapan": "RI: bank (book andal), FCF negatif. Multiples: screening & cross-check DCF.",
"worked": {"title": "📐 Contoh: Bedah P/E 3x Tono (klik untuk buka)",
"body": """<p>Saham tambang: P/E 3x (trailing). <strong>EV/EBITDA</strong> 2,5x vs peers 6x — 'murah' juga?</p>
<p><strong>Cek E</strong>: EBITDA trailing Rp800M (puncak siklus); <strong>forward</strong> Rp300M (harga komoditas turun 40%). EV/EBITDA <em>forward</em> = 6,7x — <strong>MAHAL</strong>!</p>
<p><strong>Pelajaran:</strong> multiples trailing = spion. Selalu pakai <strong>forward/normalized earnings</strong>. DCF dengan asumsi siklus = jangkar.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "P/E rendah = murah. Screening P/E terendah = strategi value.",
"benar": "Kasus Tono: P/E 3x = <strong>value trap</strong> (E puncak siklus). P/E rendah sering = <strong>pasar benar</strong> (E akan turun / risiko tinggi). Value investing = beli <em>di bawah nilai intrinsik</em> (butuh DCF), bukan beli P/E rendah."},
{"t": "DCF terlalu sensitif asumsi — tidak berguna. Pakai multiples saja.",
"benar": "Sensitivitas = <strong>fitur, bukan bug</strong>: DCF memaksa eksplisit tentang growth & risiko (di mana keyakinanmu?). Multiples <em>menyembunyikan</em> asumsi yang sama (P/E 15x = implisit growth X%). <strong>Pakai keduanya</strong>: DCF jangkar, multiples cross-check."},
],
"tips": [
"<strong>Terminal value ≤ 80% dari nilai.</strong> Jika 95%, valuasimu = tebakan growth abadi, bukan analisis. Perpanjang explicit period atau akui ketidakpastian (scenario analysis).",
"<strong>Normalisasi earnings siklikal.</strong> Untuk komoditas/siklus: pakai rata-rata 5–10 tahun (atau mid-cycle), bukan trailing peak. Ini satu-satunya obat value trap.",
],
"labs": [
{"heading": "Kalkulator DDM 2-Stage",
"intro": "Hitung nilai wajar saham dividen dengan growth 2 tahap.",
"title": "Lab 1 — DDM 2-Stage",
"hint": "Ubah G_STABIL 0.05 -> 0.07. Nilai meledak — terminal value sangat sensitif!",
"code": """# DDM 2-stage
D0, G_TINGGI, N, G_STABIL, R = 400, 0.12, 5, 0.05, 0.11  # ubah sesukamu

pv_div = 0
d = D0
for t in range(1, N+1):
    d *= (1+G_TINGGI)
    pv_div += d/(1+R)**t
d_next = d*(1+G_STABIL)
pN = d_next/(R-G_STABIL)
pv_term = pN/(1+R)**N
p0 = pv_div + pv_term

print(f"PV dividen 5 thn : Rp{pv_div:,.0f}")
print(f"PV terminal      : Rp{pv_term:,.0f} ({pv_term/p0:.0%} dari nilai!)")
print(f"Nilai wajar P0   : Rp{p0:,.0f}")
print("\\nTerminal mendominasi -> uji sensitivitas g & r selalu!")
"""},
{"heading": "Builder FCFF & Cek Multiples",
"intro": "Bangun FCFF dari komponennya dan bandingkan multiples trailing vs forward.",
"title": "Lab 2 — Builder FCFF",
"hint": "Ubah WC 40 -> 120 (modal kerja membengkak). FCFF anjlok — kas 'dimakan' operasional!",
"code": """# Builder FCFF + jebakan multiples
NI, NCC, BUNGA, TAX = 200, 80, 50, 0.22
CAPEX, WC = 150, 40   # ubah WC sesukamu (Rp M)

fcff = NI + NCC + BUNGA*(1-TAX) - CAPEX - WC
print(f"FCFF = {NI}+{NCC}+{BUNGA*(1-TAX):.0f}-{CAPEX}-{WC} = Rp{fcff:.0f}M")
print()
# Jebakan multiples: trailing vs forward
EV = 2000
EBITDA_TRAIL, EBITDA_FWD = 800, 300
print(f"EV/EBITDA trailing: {EV/EBITDA_TRAIL:.1f}x  <- 'murah'?")
print(f"EV/EBITDA forward : {EV/EBITDA_FWD:.1f}x  <- MAHAL! (value trap)")
print("\\nSelalu pakai earnings ternormalisasi/forward untuk siklikal.")
"""},
],
"decisions": [
{"kondisi": "Dividen stabil & predictible", "pakai": "DDM",
"alasan": "Dividen = kas ke pemegang saham.",
"contoh": "Bank, utilitas."},
{"kondisi": "FCF negatif (growth) tapi book andal", "pakai": "Residual income",
"alasan": "Berjangkar B0; tidak butuh FCF positif.",
"contoh": "Bank ekspansi, asuransi."},
{"kondisi": "Leverage berubah-ubah", "pakai": "FCFF (lalu bridge)",
"alasan": "FCFE tidak stabil jika utang fluktuatif.",
"contoh": "LBO, restrukturisasi."},
{"kondisi": "Screening cepat", "pakai": "Multiples FORWARD + cross-check DCF",
"alasan": "Cepat tapi rawan trap.",
"contoh": "EV/EBITDA forward vs peers."},
],
"rule10": "<ol><li><strong>Absolut dulu</strong> (DCF), relatif kemudian.</li><li><strong>Forward/normalized</strong> untuk siklikal.</li><li><strong>Bridge</strong>: firm → equity.</li><li><strong>Uji sensitivitas</strong> g &amp; r.</li></ol>",
"case": {"toc": "Mini-Case: P/E 3x Tono",
"title": "Saham 'Termurah' P/E 3x",
"body": """<p>Tono: beli saham tambang P/E 3x (trailing). Setahun: −50%, dividen dipotong.</p>""",
"q": "(a) Mekanisme value trap? (b) Tiga cek sebelum beli 'murah'? (c) Valuasi yang benar?",
"pembahasan": """<p>(a) <strong>E puncak siklus</strong> → P/E trailing rendah semu; forward E kolaps → P/E forward tinggi. Pasar <em>sudah</em> mendiskon.</p>
<p>(b) <strong>(1)</strong> EV/EBITDA forward vs peers; <strong>(2)</strong> posisi siklus komoditas (harga vs mid-cycle); <strong>(3)</strong> DCF dengan asumsi siklus.</p>
<p>(c) <strong>DCF dengan normalized earnings</strong> (rata-rata siklus) + scenario (bull/base/bear komoditas). 'Murah' = di bawah nilai, bukan P/E rendah.</p>"""},
"quiz": [
{"q": "D0=400, g=12% 5thn, g_stabil=5%, r=11%. P0?",
"options": ["Rp2.073", "≈ Rp9.391 (terminal 78%!)", "Rp12.333", "Rp7.318"], "correct": 1,
"why": "Benar: PV dividen 2.073 + PV terminal 7.318 = 9.391. Terminal mendominasi — uji sensitivitas wajib."},
{"q": "NI 200, dep 80, bunga 50 (T=22%), capex 150, ΔWC 40. FCFF?",
"options": ["Rp129M", "Rp200M", "Rp90M", "Rp280M"], "correct": 0,
"why": "Benar: 200+80+39−150−40 = 129. Bunga kembali ditambah setelah pajak (milik semua investor)."},
{"q": "Firm value Rp1,9T, utang Rp600M, kas Rp100M. Equity value?",
"options": ["Rp1,9T", "Rp1,4T", "Rp2,5T", "Rp1,2T"], "correct": 1,
"why": "Benar: 1.900 − 600 + 100 = 1.400. Equity = residu setelah kreditor — bridge wajib."},
{"q": "Kapan residual income lebih baik dari DCF?",
"options": ["Selalu", "FCF negatif tapi book value andal (bank ekspansi)", "Tidak pernah", "Hanya startup"], "correct": 1,
"why": "Benar: RI berjangkar B0 — tidak butuh FCF positif. Cocok untuk bank/asuransi dengan book bermakna."},
{"q": "EV/EBITDA trailing 2,5x vs forward 6,7x. Kesimpulan?",
"options": ["Murah — beli", "Value trap: E trailing puncak siklus; forward mahal", "Peers salah", "EV salah hitung"], "correct": 1,
"why": "Benar: trailing = spion. Untuk siklikal selalu pakai forward/normalized. 'Murah' semu = jebakan Tono."},
],
"rangkum": [
"<strong>DDM</strong>: Gordon untuk stabil; 2-stage untuk transisi; terminal dominan.",
"<strong>FCFF</strong> (semua investor) vs <strong>FCFE</strong> (pemegang saham); bridge ke equity.",
"<strong>Residual income</strong>: V0 = B0 + PV(RI); untuk book andal &amp; FCF negatif.",
"<strong>Multiples</strong>: cepat tapi relatif; waspada value trap (pakai forward!).",
"<strong>Aturan</strong>: DCF jangkar, multiples cross-check; sensitivitas selalu.",
"<strong>Kapan TIDAK multiples saja</strong>: siklikal, one-off, peers tak sebanding.",
],
"prev": ["pm-b3-ml-investasi", "PM-B3"],
"next": ["pm-b5-fixed-income-lanjut", "PM-B5"],
},
{
"slug": "pm-b5-fixed-income-lanjut", "id": "PM-B5", "track": "Portfolio Management",
"title_html": "Fixed Income Lanjut:<br/>Kurva, Kredit & MBS",
"title_plain": "Fixed Income Lanjut: Term Structure, Kredit, MBS",
"chapter_summary": "CFA L2 fixed income: term structure (spot/forward, bootstrapping), analisis kredit (model struktural Merton vs reduced-form, CDS), dan MBS (prepayment, PSA, tranche IO/PO). Lab bootstrapping & kalkulator Merton.",
"tujuan": [
"Menjelaskan hubungan spot vs forward rate dan bootstrapping.",
"Membedakan teori term structure (expectations, liquidity).",
"Membandingkan model kredit struktural vs reduced-form.",
"Menjelaskan prepayment risk MBS dan PSA.",
],
"story_title": "Cerita: 'Aman' AAA yang Gagal Bayar",
"story": """<p><strong>2007</strong>: obligasi <strong>AAA</strong> berbasis KPR AS dianggap 'seaman Treasury'. Dana pensiun memborong. <strong>2008</strong>: sebagian <strong>gagal bayar</strong>. Rating AAA ternyata <strong>salah memodelkan korelasi default</strong>.</p>
<p>Twist-nya: bukan <em>probabilitas default</em> tiap KPR yang salah — melainkan <strong>korelasi</strong>-nya (saat harga rumah jatuh <em>nasional</em>, default bergerombol). Model Gaussian copula mengasumsikan korelasi rendah &amp; stabil. <strong>Risiko kredit = risiko korelasi.</strong> Lesson ini: memodelkan kredit dengan benar — dan rendah hati.</p>""",
"concepts": [
{
"id": "kurva", "toc": "Term Structure",
"title": "Term Structure — Harga Waktu per Tenor",
"body": """<p><strong>Definisi.</strong> <strong>Spot rate</strong>: yield untuk <em>satu</em> arus kas di tenor t. <strong>Forward rate</strong>: rate masa depan yang <em>tersirat</em> dari spot kini. <strong>Bootstrapping</strong>: turunkan spot dari harga obligasi par secara berurutan. <strong>Teori</strong>: <em>expectations</em> (forward = ekspektasi spot), <em>liquidity preference</em> (premi untuk tenor panjang → kurva normal naik).</p>
<p>Kurva <strong>normal</strong> (naik), <strong>inverted</strong> (turun → prediktor resesi!), <strong>flat</strong>, <strong>humped</strong>.</p>""",
"formulas": [
{"math": r"(1+S_n)^n = (1+S_{n-1})^{n-1}(1+F_{n-1,n})",
"symbols": [
"<Tex math={String.raw`S_n`} />: spot rate tenor n",
"<Tex math={String.raw`F_{n-1,n}`} />: forward rate tahun ke-(n−1) ke-n",
"No-arbitrage: investasi n tahun = (n−1) tahun + forward 1 tahun",
"Inverted curve: pasar ekspektasi rate TURUN (resesi → pemotongan)",
]},
],
"intuisi": "Spot vs forward seperti <strong>harga tiket sekali jalan vs transit</strong>: spot = tiket langsung JKT-SBY; forward = harga tersirat segmen SBY-MLG dari tiket JKT-MLG vs JKT-SBY. Bootstrapping = menyusun harga segmen dari tiket-tiket terusan.",
"kapan": "Pricing derivatif suku bunga; baca ekspektasi pasar dari kurva.",
"worked": {"title": "📐 Contoh: Forward tersirat (klik untuk buka)",
"body": """<p>S1 = 5%, S2 = 6%. <strong>F_1,2</strong> = (1,06²/1,05) − 1 = (1,1236/1,05) − 1 = <strong>7,01%</strong>.</p>
<p>Pasar 'berkata': rate 1-tahunan, setahun dari kini = 7,01%. Jika kamu yakin rate hanya 6% → <strong>pasang taruhan</strong> via forward/FRA — atau diam jika tidak yakin (ekspektasi ≠ ramalan!).</p>"""},
"charts": [
{"data": """[{x: [1,2,3,5,7,10,20,30], y: [4.5,4.8,5.0,5.3,5.5,5.7,6.0,6.1], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "normal"}, {x: [1,2,3,5,7,10,20,30], y: [6.2,5.9,5.6,5.2,5.0,4.8,4.7,4.6], type: "scatter", mode: "lines+markers", marker: {color: "#ef4444"}, name: "inverted"}]""",
"title": "Kurva yield: normal vs inverted",
"layout": """{xaxis: {title: "Tenor (tahun)"}, yaxis: {title: "Yield (%)"}, showlegend: true}""",
"cara": "Biru = normal (naik), merah = inverted (turun).",
"interpretasi": "<strong>Inverted</strong> = pasar bertaruh resesi (rate akan dipotong). Rekam jejak: hampir semua resesi AS didahului inversi — tapi <em>timing</em>-nya 6–24 bulan (jangan trading buta!). Kurva = <strong>bahasa ekspektasi pasar</strong>."},
],
},
{
"id": "kredit", "toc": "Analisis Kredit",
"title": "Kredit — Dua Cara Memodelkan Default",
"body": """<p><strong>Definisi.</strong> <strong>Model struktural (Merton)</strong>: ekuitas = <em>call option</em> atas aset perusahaan (strike = nilai utang); default jika <strong>aset &lt; utang</strong> saat jatuh tempo. <strong>Distance-to-default</strong> = berapa σ aset di atas titik default. <strong>Reduced-form</strong>: default = <em>kejadian acak</em> dengan <strong>hazard rate</strong> λ (statistik, tanpa 'mengapa').</p>
<p><strong>CDS</strong>: asuransi default — spread CDS = harga pasar risiko kredit <em>murni</em> (tanpa noise suku bunga).</p>""",
"formulas": [
{"math": r"DD = \frac{\ln(V/D) + (\mu - \sigma^2/2)T}{\sigma\sqrt{T}}",
"symbols": [
"<Tex math={String.raw`DD`} />: distance-to-default (dalam σ)",
"<Tex math={String.raw`V`} />: nilai aset; <Tex math={String.raw`D`} />: nilai utang (default point)",
"<Tex math={String.raw`\\sigma`} />: volatilitas aset",
"DD = 3 → default hanya jika aset jatuh 3σ (≈ 0,13% peluang)",
]},
],
"intuisi": "Merton seperti <strong>mengukur jarak mobil ke jurang</strong>: DD = berapa 'standar deviasi' lagi sebelum jatuh. Reduced-form seperti <strong>statistik kecelakaan</strong>: tidak peduli <em>mengapa</em> jatuh, yang penting <em>seberapa sering</em>. CDS = <strong>premi asuransi mobil</strong> itu.",
"kapan": "Analisis obligasi korporasi; monitor kesehatan emiten via DD pasar.",
"worked": {"title": "📐 Contoh: DD emiten (klik untuk buka)",
"body": """<p>V = Rp10T, D = Rp6T, σ = 25%, T = 1, μ = 8%.</p>
<p><strong>DD</strong> = [ln(10/6) + (0,08−0,03125)]/0,25 = (0,5108+0,0488)/0,25 = <strong>2,24σ</strong>.</p>
<p>Probabilitas default ≈ N(−2,24) ≈ <strong>1,25%</strong>. Monitor: jika V turun ke 7T → DD ≈ 0,9σ → PD ≈ 18% → <strong>jual!</strong></p>"""},
"charts": [],
},
{
"id": "mbs", "toc": "MBS & Prepayment",
"title": "MBS — Risiko Pelunasan Dipercepat",
"body": """<p><strong>Definisi.</strong> <strong>MBS</strong>: sekuritisasi KPR. <strong>Prepayment risk</strong>: debitur <em>refinance</em> saat rate turun → investor <strong>menerima kas lebih cepat</strong> (reinvestasi di yield rendah!) — <strong>kebalikan</strong> dari yang diinginkan. <strong>PSA</strong>: benchmark kecepatan prepayment (100 PSA = standar). <strong>Tranche IO/PO</strong>: IO (interest-only) <em>untung</em> jika prepayment <em>lambat</em>; PO sebaliknya.</p>
<p><strong>Negative convexity</strong>: harga MBS naik <em>melambat</em> saat yield turun (prepayment!) — kebalikan obligasi biasa.</p>""",
"formulas": [],
"intuisi": "MBS seperti <strong>menyewakan rumah ke penyewa yang boleh pergi kapan saja</strong>: saat sewa pasar turun (rate turun), penyewa <em>refinance</em> (pindah) — kamu dapat rumah kembali tepat saat sulit cari penyewa baru (reinvestasi rendah). <strong>Heads kamu kalah, tails kamu juga kalah.</strong>",
"kapan": "Investasi MBS/covered bond: model prepayment, bukan cuma yield.",
"worked": {"title": "📐 Contoh: Rate turun 2% (klik untuk buka)",
"body": """<p>MBS yield 7%, PSA 100. Rate → 5%: prepayment melonjak ke <strong>PSA 400</strong> (refinance massal).</p>
<p><strong>Durasi</strong> MBS <em>memendek</em> (kas datang cepat) → harga naik <strong>jauh lebih sedikit</strong> dari obligasi biasa (negative convexity).</p>
<p><strong>IO tranche</strong>: bunga berhenti cepat → <strong>rugi besar</strong>. PO: dapat principal cepat → untung (tapi reinvestasi rendah). Pahami tranche-mu!</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Rating AAA = aman. Rating sudah memperhitungkan semuanya.",
"benar": "2008: AAA MBS gagal — model <strong>korelasi default</strong> salah, bukan probabilitas individual. Rating = <strong>opini berbayar</strong> (issuer-pay conflict!) dengan asumsi yang bisa usang. <strong>Selalu lakukan analisis sendiri</strong>; rating = titik awal, bukan kesimpulan."},
{"t": "Yield MBS 8% vs Treasury 5% = 'diskon 3%'. Beli MBS saja.",
"benar": "3% = <strong>kompensasi prepayment + credit + likuiditas</strong>, bukan makan siang gratis. <em>Option-adjusted spread</em> (OAS) yang adil membandingkan setelah <em>mengeluarkan</em> nilai opsi prepayment. Bandingkan <strong>OAS</strong>, bukan yield nominal."},
],
"tips": [
"<strong>Baca kurva, jangan cuma level.</strong> Inversi 2s10s = sinyal resesi; curam = ekspektasi growth. Shape kurva mengandung lebih banyak informasi daripada level BI rate.",
"<strong>Untuk kredit: ikuti DD pasar, bukan cuma rating.</strong> Distance-to-default dari harga saham (Merton) bergerak <em>real-time</em>; rating bergerak <em>kuartalan</em>. Kombinasikan keduanya.",
],
"labs": [
{"heading": "Bootstrapping Spot Rates",
"intro": "Turunkan spot rate dari harga obligasi par secara berurutan.",
"title": "Lab 1 — Bootstrapping",
"hint": "Ubah harga obligasi 2-thn 100 -> 98 (discount). Spot 2-thn naik — pasar menuntut lebih!",
"code": """# Bootstrapping: par yields -> spot rates
# Obligasi par 1-thn kupon 5%, 2-thn kupon 6% (harga 100)
S1 = 0.05
P2, C2 = 100, 6  # harga & kupon obligasi 2-thn (ubah P2!)

# S1 dari obligasi 1-thn: 105/1.05 = 100 -> S1 = 5%
# Obligasi 2-thn: 6/(1+S1) + 106/(1+S2)^2 = P2
S2 = ((106)/(P2 - C2/(1+S1)))**0.5 - 1
F12 = (1+S2)**2/(1+S1) - 1

print(f"Spot 1-thn: {S1:.2%}")
print(f"Spot 2-thn: {S2:.2%}")
print(f"Forward 1y1y tersirat: {F12:.2%}")
print("\\nBootstrapping = mengupas kurva lapis demi lapis.")
"""},
{"heading": "Kalkulator Merton Distance-to-Default",
"intro": "Hitung DD dan probabilitas default implisit dari nilai pasar.",
"title": "Lab 2 — Kalkulator Merton",
"hint": "Ubah V 10 -> 7 (aset turun). DD anjlok, PD meledak — monitor ini!",
"code": """# Merton distance-to-default (pendekatan, tanpa N(.))
import math
V, D = 10e12, 6e12   # nilai aset & utang (Rp; ubah V!)
SIG, T, MU = 0.25, 1.0, 0.08

dd = (math.log(V/D) + (MU - SIG**2/2)*T)/(SIG*math.sqrt(T))
pd = 0.5*(1+math.erf(-dd/math.sqrt(2)))  # N(-dd)

print(f"Distance-to-default: {dd:.2f} sigma")
print(f"Probabilitas default implisit: {pd:.2%}")
print()
print("Aturan: DD < 1.5 = zona bahaya; DD > 3 = aman.")
print("Ekuitas = call option atas aset (strike = utang).")
"""},
],
"decisions": [
{"kondisi": "Kurva inverted", "pakai": "Defensif; siapkan likuiditas",
"alasan": "Prediktor resesi (6–24 bulan).",
"contoh": "Kurangi durasi kredit."},
{"kondisi": "DD &lt; 1,5", "pakai": "Kurangi/jual eksposur kredit",
"alasan": "Probabilitas default naik tajam.",
"contoh": "Monitor emiten bulanan."},
{"kondisi": "Banding MBS vs Treasury", "pakai": "Bandingkan OAS, bukan yield",
"alasan": "Opsi prepayment harus dikeluarkan.",
"contoh": "OAS 50bps = murah/mahal?"},
{"kondisi": "Butuh lindung nilai rate", "pakai": "FRA/swap dari forward tersirat",
"alasan": "Kurva memberi harga pasar.",
"contoh": "Kunci F_1,2 = 7,01%."},
],
"rule10": "<ol><li><strong>Baca shape kurva</strong>, bukan cuma level.</li><li><strong>Forward = ekspektasi</strong> (bukan janji).</li><li><strong>DD pasar</strong> &gt; rating untuk timing.</li><li><strong>OAS</strong> untuk MBS.</li></ol>",
"case": {"toc": "Mini-Case: AAA 2008",
"title": "'Aman' AAA yang Gagal",
"body": """<p>2007: MBS AAA diborong dana pensiun. 2008: gagal bayar massal. Model korelasi salah.</p>""",
"q": "(a) Apa yang salah dari model? (b) Kenapa rating tidak menyelamatkan? (c) Pelajaran abadi?",
"pembahasan": """<p>(a) <strong>Korelasi default</strong> diasumsikan rendah &amp; stabil; saat harga rumah jatuh <em>nasional</em>, default <strong>bergerombol</strong>. Bukan PD individual yang salah — <strong>dependensinya</strong>.</p>
<p>(b) <strong>Issuer-pay conflict</strong> + asumsi usang + lag. Rating = opini, bukan jaminan.</p>
<p>(c) <strong>Model adalah peta, bukan wilayah.</strong> Stress-test asumsi korelasi; diversifikasi yang bergantung pada korelasi rendah = <strong>diversifikasi semu</strong> (ingat PM-A10!).</p>"""},
"quiz": [
{"q": "S1=5%, S2=6%. Forward 1y1y?",
"options": ["6%", "7,01%", "5,5%", "11%"], "correct": 1,
"why": "Benar: (1,06²/1,05)−1 = 7,01%. Pasar 'berkata' rate tahun depan 7,01% — ekspektasi, bukan janji."},
{"q": "Kurva inverted artinya?",
"options": ["Ekonomi kuat", "Pasar ekspektasi rate turun (risiko resesi)", "Inflasi tinggi", "Tidak ada artinya"], "correct": 1,
"why": "Benar: investor menerima yield rendah di tenor panjang karena yakin rate akan dipotong (resesi). Prediktor andal, timing 6–24 bulan."},
{"q": "V=10T, D=6T, σ=25%, T=1, μ=8%. DD?",
"options": ["1,0σ", "2,24σ (PD ≈ 1,25%)", "3,0σ", "0,5σ"], "correct": 1,
"why": "Benar: [ln(10/6)+(0,08−0,03125)]/0,25 = 2,24. Monitor: V turun → DD anjlok → PD meledak."},
{"q": "Rate turun 2%, MBS PSA 100→400. Efek ke investor MBS?",
"options": ["Untung besar seperti obligasi biasa", "Harga naik terbatas (negative convexity); reinvestasi rendah", "Tidak ada efek", "Rugi pasti"], "correct": 1,
"why": "Benar: prepayment massal → kas datang cepat → durasi memendek → upside terbatas. Heads kalah, tails kalah."},
{"q": "Banding MBS (yield 8%) vs Treasury (5%). Metrik adil?",
"options": ["Selisih yield 3%", "OAS (keluarkan nilai opsi prepayment)", "Kupon", "Rating"], "correct": 1,
"why": "Benar: 3% = kompensasi prepayment/kredit/likuiditas. OAS membandingkan apel-dengan-apel setelah mengeluarkan opsi."},
],
"rangkum": [
"<strong>Spot/forward</strong>: hubungan no-arbitrage antar-tenor (lihat rumus); bootstrapping mengupas kurva.",
"<strong>Teori kurva</strong>: expectations vs liquidity preference; inverted = sinyal resesi.",
"<strong>Merton</strong>: ekuitas = call atas aset; DD = jarak ke default (σ).",
"<strong>Reduced-form</strong>: default = kejadian acak (hazard rate); CDS = harga pasarnya.",
"<strong>MBS</strong>: prepayment risk, PSA, negative convexity; bandingkan via OAS.",
"<strong>Pelajaran 2008</strong>: risiko kredit = risiko korelasi; model ≠ wilayah.",
],
"prev": ["pm-b4-valuasi-ekuitas", "PM-B4"],
"next": ["pm-b6-valuasi-derivatif", "PM-B6"],
},
{
"slug": "pm-b6-valuasi-derivatif", "id": "PM-B6", "track": "Portfolio Management",
"title_html": "Valuasi Derivatif:<br/>Binomial & Black-Scholes",
"title_plain": "Valuasi Derivatif: Binomial, Black-Scholes, Swap",
"chapter_summary": "CFA L2 derivatif: risk-neutral pricing via binomial 1-periode, formula Black-Scholes & intuisi N(d1)/N(d2), Greeks (delta), dan valuasi swap sebagai dua obligasi. Lab binomial pricer & kalkulator Black-Scholes.",
"tujuan": [
"Menjelaskan risk-neutral pricing pada binomial 1-periode.",
"Menghitung harga opsi Eropa via Black-Scholes.",
"Menjelaskan intuisi N(d1) dan N(d2).",
"Menilai interest rate swap sebagai selisih dua obligasi.",
],
"story_title": "Cerita: Formula Rp Nobelis",
"story": """<p><strong>1973</strong>: Black, Scholes &amp; Merton menerbitkan formula harga opsi. <strong>1997</strong>: Nobel Ekonomi. Di antaranya: <strong>LTCM</strong> (didirikan Scholes &amp; Merton!) kolaps 1998 — rugi <strong>USD 4,6 miliar</strong>.</p>
<p>Twist-nya: formula <strong>benar secara matematis</strong> — tapi <strong>asumsinya</strong> (volatilitas konstan, likuiditas selalu ada, return normal) <strong>salah di dunia nyata</strong>. LTCM bertaruh dengan leverage 25:1 pada asumsi itu. <strong>Model hebat + asumsi rapuh + leverage = bencana.</strong> Lesson ini: memakai formula dengan hormat pada batasnya.</p>""",
"concepts": [
{
"id": "binomial", "toc": "Binomial 1-Periode",
"title": "Binomial — Harga Opsi dari Replikasi",
"body": """<p><strong>Definisi.</strong> <strong>Binomial 1-periode</strong>: saham naik ke S_u atau turun ke S_d. <strong>Replikasi</strong>: Δ saham + pinjaman = payoff opsi di <em>kedua</em> state → harga opsi = biaya replikasi. <strong>Risk-neutral probability</strong>: π = [(1+r) − d]/(u − d); harga = [π×C_u + (1−π)×C_d]/(1+r).</p>
<p><strong>Hedge ratio</strong> Δ = (C_u − C_d)/(S_u − S_d) — inilah <strong>delta</strong>!</p>""",
"formulas": [
{"math": r"C = \frac{\pi C_u + (1-\pi) C_d}{1+r} \quad;\quad \pi = \frac{(1+r)-d}{u-d}",
"symbols": [
"<Tex math={String.raw`\\pi`} />: probabilitas risk-neutral (BUKAN probabilitas sebenarnya!)",
"<Tex math={String.raw`u, d`} />: faktor naik/turun (S_u = u×S)",
"Harga = ekspektasi risk-neutral yang didiskon — probabilitas aktual tidak dipakai!",
]},
],
"intuisi": "Binomial seperti <strong>menyalin kunci</strong>: buat portofolio (Δ saham + kas) yang <em>persis</em> meniru payoff opsi di semua skenario. Harga kunci asli = biaya fotokopinya. <strong>Probabilitas aktual tidak penting</strong> — yang penting replikasinya.",
"kapan": "Opsi Amerika/eksotis (pohon multi-periode); fondasi Black-Scholes.",
"worked": {"title": "📐 Contoh: Call 1-periode (klik untuk buka)",
"body": """<p>S = 100, u = 1,2, d = 0,9, r = 5%, X = 105.</p>
<p><strong>C_u</strong> = max(120−105,0) = 15. <strong>C_d</strong> = max(90−105,0) = 0.</p>
<p><strong>π</strong> = (1,05−0,9)/(1,2−0,9) = 0,5. <strong>C</strong> = (0,5×15 + 0,5×0)/1,05 = <strong>7,14</strong>.</p>
<p><strong>Δ</strong> = (15−0)/(120−90) = 0,5 → replikasi: 0,5 saham + pinjam 42,86. Cek: naik → 60−42,86×1,05 = 15 ✓.</p>"""},
"charts": [
{"data": """[{x: [0,1,1], y: [100,120,90], type: "scatter", mode: "lines+markers", marker: {color: "#2a7de1"}, name: "saham"}, {x: [0,1,1], y: [7.14,15,0], type: "scatter", mode: "lines+markers", marker: {color: "#e8a838"}, name: "call"}]""",
"title": "Pohon binomial 1-periode (S=100, C=7,14)",
"layout": """{xaxis: {title: "Waktu"}, yaxis: {title: "Nilai"}, showlegend: true}""",
"cara": "Kiri = hari ini, kanan = dua skenario (naik/turun). Biru = saham, kuning = opsi.",
"interpretasi": "Opsi = <strong>turunan</strong> saham: 100→7,14 hari ini; 120→15 atau 90→0. Replikasi (Δ=0,5 saham + pinjaman) meniru persis — <strong>harga opsi = biaya tiruannya</strong>. Inilah logika semua model opsi."},
],
},
{
"id": "bs", "toc": "Black-Scholes",
"title": "Black-Scholes — Formula Nobel",
"body": """<p><strong>Definisi.</strong> <strong>Black-Scholes</strong> (Eropa, non-dividen): C = S×N(d1) − PV(X)×N(d2). <strong>N(d2)</strong> ≈ probabilitas risk-neutral opsi <em>in-the-money</em> saat expiry. <strong>N(d1)</strong> = delta (hedge ratio). <strong>d1, d2</strong> memuat S/X, r, σ, T.</p>
<p><strong>Asumsi</strong>: volatilitas konstan, trading kontinu, tanpa biaya, return lognormal. <strong>Realita</strong>: vol smile (pasar tidak percaya!), crash (LTCM). Pakai dengan sadar.</p>""",
"formulas": [
{"math": r"C = S N(d_1) - \frac{X}{(1+r)^T} N(d_2)",
"symbols": [
"<Tex math={String.raw`N(d_2)`} />: peluang risk-neutral S_T &gt; X (opsi berakhir ITM)",
"<Tex math={String.raw`N(d_1)`} />: delta — jumlah saham untuk hedge",
"<Tex math={String.raw`\\sigma`} />: volatilitas — SATU-SATUNYA input yang tidak observable (diimplikasikan pasar!)",
"Naik σ → naik harga opsi (call &amp; put): ketidakpastian = mahal",
]},
],
"intuisi": "Black-Scholes seperti <strong>harga asuransi dari tabel aktuaria</strong>: S×N(d1) = 'nilai harapan terima', PV(X)×N(d2) = 'nilai harapan bayar'. Selisihnya = premi wajar. <strong>σ</strong> = 'seberapa ugal-ugalan pengemudinya' — tak terlihat, jadi ditaksir (implied).",
"kapan": "Harga wajar opsi Eropa; implied vol; delta hedging.",
"worked": {"title": "📐 Contoh: Hitung call (klik untuk buka)",
"body": """<p>S=100, X=105, r=5%, σ=30%, T=1. <strong>d1</strong> = [ln(100/105)+(0,05+0,045)]/0,30 = 0,154. <strong>d2</strong> = 0,154−0,30 = −0,146.</p>
<p>N(d1) = 0,561, N(d2) = 0,442. <strong>C</strong> = 100×0,561 − 105×e^(−0,05)×0,442 = 56,1 − 44,1 = <strong>12,0</strong>.</p>
<p><strong>Uji</strong>: σ → 50% → C ≈ 21 (naik!). T → 0 → C → max(S−X,0) = 0 (time value habis).</p>"""},
"charts": [],
},
{
"id": "swapval", "toc": "Valuasi Swap",
"title": "Swap — Dua Obligasi dalam Satu",
"body": """<p><strong>Definisi.</strong> <strong>Valuasi IRS</strong> (bayar fixed): V = PV(floating leg) − PV(fixed leg). Floating leg ≈ <strong>par</strong> (reset tiap periode!) → V = Notional − PV(fixed). <strong>Swap rate</strong> = fixed rate yang membuat V = 0 saat inisiasi.</p>
<p>Intuisi: bayar-fixed = <strong>short obligasi fixed-rate</strong> + <strong>long FRN</strong>.</p>""",
"formulas": [],
"intuisi": "Swap seperti <strong>dua langganan berlawanan</strong>: kamu terima 'koran harian' (floating, selalu harga kini = par) dan bayar 'majalah tahunan' (fixed). Nilai tukaran = selisih PV keduanya.",
"kapan": "Unwind/novasi swap; hitung MTM untuk collateral.",
"worked": {"title": "📐 Contoh: MTM swap (klik untuk buka)",
"body": """<p>Notional Rp100M, bayar fixed 8%, sisa 3 thn. Rate kini: fixed 3-thn = 6%.</p>
<p><strong>PV fixed leg</strong> = 8×2,673 + 100/1,06³ = 21,38 + 83,96 = 105,34. <strong>V</strong> (bayar fixed) = 100 − 105,34 = <strong>−Rp5,34M</strong>.</p>
<p>Rate turun → yang bayar fixed <strong>rugi</strong> (terkunci mahal). MTM negatif = liabilitas → <strong>posting collateral!</strong></p>"""},
"charts": [],
},
],
"myths": [
{"t": "Black-Scholes memberi 'harga benar' opsi. Ikuti saja.",
"benar": "BS = <strong>model</strong>, bukan kebenaran. Asumsi vol konstan &amp; return normal <strong>salah</strong> (vol smile, fat tails — 1987, 2008, LTCM). Gunakan untuk <strong>quote &amp; hedge</strong> (implied vol sebagai bahasa), bukan sebagai ramalan. <strong>Hormati batas model.</strong>"},
{"t": "Delta hedge sekali = aman sampai expiry.",
"benar": "<strong>Delta berubah</strong> (gamma!) seiring harga &amp; waktu — hedge harus <strong>rebalancing dinamis</strong>. Plus biaya transaksi tiap rebalance. 'Hedge sempurna' hanya ada di textbook (trading kontinu tanpa biaya)."},
],
"tips": [
"<strong>Implikasikan, jangan asumsikan, volatilitas.</strong> Ambil σ dari harga pasar (implied), bukan historis. Vol smile/skew memberi tahu <em>apa yang ditakuti pasar</em> — informasi gratis.",
"<strong>Untuk opsi Amerika: binomial, bukan BS.</strong> BS hanya Eropa. Early exercise (dividen besar, put deep ITM) butuh pohon. Pilih alat sesuai jenis opsi.",
],
"labs": [
{"heading": "Pricer Binomial 1-Periode",
"intro": "Hitung harga call via replikasi & probabilitas risk-neutral.",
"title": "Lab 1 — Pricer Binomial",
"hint": "Ubah U 1.2 -> 1.5 (volatilitas naik). Harga opsi naik — ketidakpastian = mahal!",
"code": """# Binomial 1-periode: risk-neutral pricing
S, U, D, R, X = 100, 1.2, 0.9, 0.05, 105  # ubah U sesukamu

Su, Sd = S*U, S*D
Cu, Cd = max(Su-X, 0), max(Sd-X, 0)
pi = ((1+R)-D)/(U-D)
C = (pi*Cu + (1-pi)*Cd)/(1+R)
delta = (Cu-Cd)/(Su-Sd)

print(f"S naik -> {Su:.0f} (call {Cu:.0f}); turun -> {Sd:.0f} (call {Cd:.0f})")
print(f"Prob risk-neutral: {pi:.2f} (bukan probabilitas sebenarnya!)")
print(f"Harga call: {C:.2f}")
print(f"Delta (hedge ratio): {delta:.2f} saham per opsi")
print("\\nReplikasi: beli delta saham + pinjam kas = payoff opsi.")
"""},
{"heading": "Kalkulator Black-Scholes",
"intro": "Harga call Eropa + delta via formula BS (N(x) dari erf).",
"title": "Lab 2 — Kalkulator Black-Scholes",
"hint": "Ubah SIG 0.30 -> 0.50. Harga naik — dan delta berubah. Itulah vega & gamma!",
"code": """# Black-Scholes call Eropa (N(x) via erf)
import math
S, X, R, SIG, T = 100, 105, 0.05, 0.30, 1.0  # ubah SIG!

def N(x): return 0.5*(1+math.erf(x/math.sqrt(2)))

d1 = (math.log(S/X) + (R + SIG**2/2)*T)/(SIG*math.sqrt(T))
d2 = d1 - SIG*math.sqrt(T)
C = S*N(d1) - X*math.exp(-R*T)*N(d2)

print(f"d1={d1:.3f}, d2={d2:.3f}")
print(f"N(d1) [delta] = {N(d1):.3f}, N(d2) [P(ITM)] = {N(d2):.3f}")
print(f"Harga call: {C:.2f}")
print(f"\\nNaikkan SIG -> harga naik (vega). Dekati expiry -> time value habis.")
"""},
],
"decisions": [
{"kondisi": "Opsi Amerika / eksotis", "pakai": "Binomial (pohon)",
"alasan": "BS hanya Eropa.",
"contoh": "Put Amerika deep ITM."},
{"kondisi": "Butuh harga wajar cepat", "pakai": "Black-Scholes + implied vol",
"alasan": "Standar quote pasar.",
"contoh": "Market-making opsi likuid."},
{"kondisi": "Unwind swap", "pakai": "Valuasi dua kaki (floating = par)",
"alasan": "MTM untuk settlement/collateral.",
"contoh": "Novasi ke bank lain."},
{"kondisi": "Hedging opsi", "pakai": "Delta hedge dinamis",
"alasan": "Delta bergerak (gamma).",
"contoh": "Rebalance berkala + biaya."},
],
"rule10": "<ol><li><strong>Replikasi</strong> = logika harga opsi.</li><li><strong>π risk-neutral</strong> ≠ probabilitas aktual.</li><li><strong>σ</strong> = satu-satunya input tak terlihat.</li><li><strong>Hormati asumsi</strong> (LTCM!).</li></ol>",
"case": {"toc": "Mini-Case: LTCM",
"title": "Nobelis yang Kolaps",
"body": """<p>LTCM (Scholes & Merton): model canggih, leverage 25:1, 1998 rugi USD 4,6M (miliar).</p>""",
"q": "(a) Apa yang salah — model atau pemakaian? (b) Tiga asumsi BS yang jebol 1998? (c) Aturan leverage dari kasus ini?",
"pembahasan": """<p>(a) <strong>Pemakaian</strong>: model benar dalam asumsinya; dunia melanggar asumsi (likuiditas kering, korelasi → 1, fat tails).</p>
<p>(b) <strong>Vol konstan</strong> (meledak), <strong>likuiditas selalu ada</strong> (pasar bekU), <strong>return normal</strong> (ekor tebal). Plus <strong>leverage 25:1</strong> = tidak ada ruang salah.</p>
<p>(c) <strong>Leverage ≤ model error.</strong> Jika model bisa salah 10%, leverage 25x = bunuh diri. <strong>Stress-test asumsi, bukan cuma output.</strong></p>"""},
"quiz": [
{"q": "Binomial: S=100, u=1,2, d=0,9, r=5%, X=105. Harga call?",
"options": ["15", "7,14", "10", "5"], "correct": 1,
"why": "Benar: π=0,5, C=(0,5×15)/1,05=7,14. Probabilitas aktual tidak dipakai — hanya replikasi."},
{"q": "N(d2) dalam Black-Scholes ≈ ?",
"options": ["Delta", "Probabilitas risk-neutral opsi ITM saat expiry", "Volatilitas", "Bunga"], "correct": 1,
"why": "Benar: N(d2) = P(S_T &gt; X) risk-neutral. N(d1) = delta (hedge ratio)."},
{"q": "σ naik 30%→50%. Harga call?",
"options": ["Turun", "Naik (vega positif)", "Tetap", "Nol"], "correct": 1,
"why": "Benar: ketidakpastian = mahal (call & put). Inilah kenapa krisis = opsi mahal."},
{"q": "Swap bayar-fixed, rate pasar turun. MTM?",
"options": ["Untung", "Rugi (terkunci bayar mahal) — MTM negatif", "Nol", "Tidak terpengaruh"], "correct": 1,
"why": "Benar: V = PV(floating) − PV(fixed); fixed leg makin mahal relatif → MTM negatif = liabilitas + collateral."},
{"q": "Pelajaran utama LTCM?",
"options": ["Model tidak berguna", "Model benar + asumsi rapuh + leverage = bencana", "Hindari derivatif", "Nobel tidak penting"], "correct": 1,
"why": "Benar: hormati batas model; stress-test asumsi; leverage ≤ toleransi error model."},
],
"rangkum": [
"<strong>Binomial</strong>: C = [πC_u + (1−π)C_d]/(1+r); π = [(1+r)−d]/(u−d); Δ = hedge ratio.",
"<strong>Black-Scholes</strong>: C = S×N(d1) − PV(X)×N(d2); σ = input tak terlihat.",
"<strong>Asumsi BS</strong>: vol konstan, kontinu, tanpa biaya — <strong>salah di dunia nyata</strong>.",
"<strong>Swap</strong>: V = PV(floating) − PV(fixed); floating ≈ par.",
"<strong>Delta hedge</strong> dinamis (gamma); opsi Amerika → binomial.",
"<strong>LTCM</strong>: hormati asumsi; leverage ≤ error model.",
],
"prev": ["pm-b5-fixed-income-lanjut", "PM-B5"],
"next": ["pm-b7-currency", "PM-B7"],
},
{
"slug": "pm-b7-currency", "id": "PM-B7", "track": "Portfolio Management",
"title_html": "Currency:<br/>Paritas & Carry Trade",
"title_plain": "Currency Exchange Rates: Paritas, Carry Trade",
"chapter_summary": "CFA L2 currency: paritas suku bunga tertutup (covered IRP), PPP & Fisher internasional, carry trade & crash risk-nya, serta rezim FX emerging market. Lab kalkulator IRP/carry & PPP.",
"tujuan": [
"Menjelaskan covered interest rate parity dan menghitung forward wajar.",
"Membedakan PPP absolut vs relatif dan international Fisher.",
"Menjelaskan carry trade dan mengapa ia runtuh berkala.",
"Menghitung return carry trade dengan skenario.",
],
"story_title": "Cerita: 'Uang Gratis' Carry Trade Yen",
"story": """<p><strong>2005–2007</strong>: hedge fund meminjam <strong>yen 0,5%</strong>, membeli <strong>AUD 6%</strong> — selisih <strong>5,5% 'gratis'</strong> per tahun. Triliunan dolar mengalir. <em>&ldquo;Uang gratis!&rdquo;</em></p>
<p><strong>Agustus 2007 &amp; 2008</strong>: yen <strong>menguat 20%</strong> dalam minggu — carry trader rugi <strong>4 tahun profit dalam sebulan</strong>. <em>&ldquo;Naik tangga, turun lift.&rdquo;</em> Twist-nya: <strong>uncovered IRP</strong> berkata selisih bunga <em>harusnya</em> dihapus depresiasi — tapi <strong>empiris gagal</strong> (forward premium puzzle): carry <em>profitable</em>… sampai <strong>crash</strong>. Profit kecil stabil + rugi besar jarang = <strong>distribusi miring</strong>. Lesson ini: harga 'uang gratis'.</p>""",
"concepts": [
{
"id": "paritas", "toc": "Paritas Suku Bunga & PPP",
"title": "Paritas — Hukum Satu Harga Global",
"body": """<p><strong>Definisi.</strong> <strong>Covered IRP</strong>: F = S×(1+r_d)/(1+r_f) — <em>pasti</em> berlaku (arbitrase jika tidak). <strong>Uncovered IRP</strong>: E(%ΔS) ≈ r_d − r_f — <em>sering gagal</em> empiris. <strong>PPP relatif</strong>: %ΔS ≈ π_d − π_f (kurs mengikuti inflasi). <strong>International Fisher</strong>: r_d − r_f ≈ E(π_d) − E(π_f).</p>
<p>Rantai: Fisher → PPP → IRP. Semua tentang <strong>ekspektasi</strong>, bukan jaminan.</p>""",
"formulas": [
{"math": r"F = S\frac{1+r_d}{1+r_f} \quad;\quad \%\Delta S \approx \pi_d - \pi_f \ \text{(PPP relatif)}",
"symbols": [
"<Tex math={String.raw`r_d, r_f`} />: suku bunga domestik &amp; asing",
"<Tex math={String.raw`\\pi_d, \\pi_f`} />: inflasi domestik &amp; asing",
"Covered IRP = arbitrase (pasti); uncovered = ekspektasi (sering salah)",
]},
],
"intuisi": "Covered IRP seperti <strong>timbangan digital</strong>: jika miring, arbitrager langsung menyeimbangkan (pasti). Uncovered IRP seperti <strong>ramalan cuaca</strong>: 'harusnya' hujan, tapi sering cerah — berguna sebagai <em>baseline</em>, bukan kebenaran.",
"kapan": "Pricing forward FX; benchmark ekspektasi kurs.",
"worked": {"title": "📐 Contoh: Forward wajar (klik untuk buka)",
"body": """<p>S = Rp16.000/USD, r_IDR = 6%, r_USD = 5%, T = 1 thn.</p>
<p><strong>F</strong> = 16.000 × 1,06/1,05 = <strong>Rp16.152</strong>. Forward <em>wajar</em> = rupiah <strong>depresiasi 0,95%</strong> (selisih bunga).</p>
<p>Jika pasar quote 16.500 → <strong>arbitrase covered</strong>: pinjam USD, konversi, deposito IDR, jual forward. Mesin uang — sampai quote terkoreksi.</p>"""},
"charts": [],
},
{
"id": "carry", "toc": "Carry Trade",
"title": "Carry Trade — Memungut Koin di Rel Kereta",
"body": """<p><strong>Definisi.</strong> <strong>Carry trade</strong>: pinjam mata uang <em>bunga rendah</em> (funding: JPY, CHF), beli <em>bunga tinggi</em> (target: AUD, EM) — kantongi selisih. <strong>Return</strong> = selisih bunga + apresiasi target. <strong>Crash risk</strong>: saat risk-off, funding currency <strong>menguat tajam</strong> (unwind massal) → rugi besar mendadak.</p>
<p><strong>Skew negatif</strong>: menang kecil sering, kalah besar jarang — <strong>seperti jual asuransi</strong> (premi rutin, klaim bencana).</p>""",
"formulas": [],
"intuisi": "Carry trade seperti <strong>memungut koin di rel kereta</strong>: koinnya nyata (selisih bunga), keretanya jarang (crash) — tapi saat datang, <em>kamu masih di rel</em>. Atau: seperti <strong>menjual payung saat kemarau</strong> — laku terus… sampai hujan badai.",
"kapan": "FX overlay (PM-C9): sizing kecil + stop; jangan core strategy.",
"worked": {"title": "📐 Contoh: Matematika 2008 (klik untuk buka)",
"body": """<p>Pinjam JPY 0,5%, beli AUD 6%: <strong>carry +5,5%/thn</strong>. 2005–2007: total +16,5%.</p>
<p><strong>2008</strong>: JPY menguat 20% vs AUD dalam 3 bulan. Return = +5,5% − 20% = <strong>−14,5%</strong> — menghapus <strong>hampir semua</strong> profit 3 tahun.</p>
<p><strong>Pelajaran:</strong> expected return carry = selisih bunga − <strong>expected crash</strong>. Tanpa memodelkan ekor, carry = bom waktu.</p>"""},
"charts": [
{"data": """[{x: ["2005","2006","2007","2008"], y: [5.5,5.5,5.5,-14.5], type: "bar", marker: {color: ["#16a34a","#16a34a","#16a34a","#ef4444"]}, text: ["+5,5%","+5,5%","+5,5%","−14,5%"], textposition: "outside"}]""",
"title": "Carry JPY→AUD: 3 tahun panen, 1 tahun bencana",
"layout": """{xaxis: {title: "Tahun"}, yaxis: {title: "Return (%)"}, showlegend: false}""",
"cara": "Hijau = tahun panen carry; merah = unwind 2008.",
"interpretasi": "<strong>Naik tangga, turun lift.</strong> Tiga tahun +16,5% lenyap dalam satu kuartal. Distribusi carry = <strong>skew negatif</strong>: inilah 'harga' uang gratis. Sizing carry seperti sizing <em>jual opsi</em> — kecil &amp; sadar ekor."},
],
},
{
"id": "em", "toc": "FX Emerging Market",
"title": "FX EM — Intervensi & Kontrol",
"body": """<p><strong>Definisi.</strong> <strong>Managed float</strong> (Indonesia): BI <em>intervensi</em> untuk meredam volatilitas — bukan mematok level. <strong>Cadangan devisa</strong> = amunisi intervensi. <strong>Kontrol modal</strong>: batasi arus keluar/masuk (darurat).</p>
<p><strong>Segitiga mustahil</strong> (trilemma): tidak bisa punya <em>sekaligus</em>: (1) kurs tetap, (2) kebijakan moneter independen, (3) modal bebas — <strong>pilih dua</strong>.</p>""",
"formulas": [],
"intuisi": "Trilemma seperti <strong>pilih 2 dari 3 menu</strong>: kurs stabil + modal bebas = ikut suku bunga AS (korbankan independen); independen + modal bebas = kurs mengambang (Indonesia); kurs tetap + independen = kunci pintu modal (kontrol).",
"kapan": "Analisis risiko negara; hedging EM (biaya carry tinggi!).",
"worked": {"title": "📐 Contoh: Pilihan Indonesia (klik untuk buka)",
"body": """<p>Indonesia: <strong>managed float + modal relatif bebas + BI independen</strong> → pilih (2) &amp; (3), kurs <strong>mengambang terkendali</strong>.</p>
<p>Saat rupiah tertekan: BI <strong>intervensi</strong> (jual USD dari cadangan) + <strong>naikkan rate</strong> — dua alat, satu tujuan: stabilitas. Cadangan menipis = amunisi habis → pasar menguji.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "Selisih bunga = profit pasti carry trade. Arbitrase bebas risiko.",
"benar": "Covered (dengan forward) = <strong>arbitrase, profit nol</strong> (IRP). Uncovered = <strong>spekulasi</strong>: selisih bunga <em>bisa</em> dihapus depresiasi mendadak (2008: −14,5%). 'Uang gratis' = premi risiko crash yang belum ditagih."},
{"t": "Bank sentral bisa mempertahankan kurs berapa pun dengan intervensi.",
"benar": "<strong>Cadangan terbatas</strong> + trilemma: melawan pasar dengan cadangan menipis = <strong>undang spekulan</strong> (Soros vs BoE 1992). Intervensi meredam volatilitas, bukan melawan fundamental selamanya."},
],
"tips": [
"<strong>Untuk carry: ukur skew, bukan cuma mean.</strong> Lihat distribusi historis: jika ekor kiri tebal, sizing ≤ 2% portofolio + stop-loss. Carry tanpa manajemen ekor = bom waktu.",
"<strong>PPP untuk jangka panjang, IRP untuk jangka pendek.</strong> PPP butuh tahunan untuk bekerja (harga kaku); IRP harian via arbitrase. Jangan pakai PPP untuk trading bulanan.",
],
"labs": [
{"heading": "Kalkulator IRP & Carry",
"intro": "Hitung forward wajar (covered IRP) dan simulasikan return carry trade.",
"title": "Lab 1 — Kalkulator Carry",
"hint": "Ubah DEPRESIASI 0.0 -> 0.20 (yen menguat 20%). Carry +5,5% jadi −14,5% — crash!",
"code": """# Covered IRP & simulasi carry trade
S, R_D, R_F = 16000, 0.06, 0.005  # IDR/USD, r_IDR, r_JPY
DEPRESIASI = 0.00   # yen menguat berapa? (ubah! 0.20 = crash)

F = S * (1+R_D)/(1+R_F)
carry_bunga = R_D - R_F
ret_total = carry_bunga - DEPRESIASI  # depresiasi IDR vs JPY

print(f"Forward wajar (covered IRP): Rp{F:,.0f}")
print(f"Carry bunga: {carry_bunga:+.2%}")
print(f"Depresiasi IDR: {DEPRESIASI:.0%}")
print(f"Return carry (uncovered): {ret_total:+.2%}")
print()
print("2008:" if DEPRESIASI > 0.1 else "Tenang:", "tangga naik, lift turun." if DEPRESIASI > 0.1 else "koin terkumpul.")
"""},
{"heading": "Kalkulator PPP",
"intro": "Hitung kurs 'wajar' PPP dari level harga dua negara (ala Big Mac).",
"title": "Lab 2 — Kalkulator PPP",
"hint": "Ubah INFLASI_ID 0.04 -> 0.10. Rupiah 'wajar' melemah — PPP jangka panjang!",
"code": """# PPP: kurs wajar dari rasio harga
HARGA_ID, HARGA_US = 35000, 5.99  # harga burger (Rp, USD)
S_AKTUAL = 16000
INFLASI_ID, INFLASI_US = 0.04, 0.025  # ubah!

ppp = HARGA_ID / HARGA_US
mis = (S_AKTUAL - ppp)/ppp
print(f"Kurs PPP: Rp{ppp:,.0f}/USD vs aktual Rp{S_AKTUAL:,.0f}")
print(f"Rupiah {'undervalued' if mis > 0 else 'overvalued'} {abs(mis):.1%} vs PPP")
print()
# PPP relatif 5 tahun
s_fwd = S_AKTUAL * ((1+INFLASI_ID)/(1+INFLASI_US))**5
print(f"Proyeksi 5 thn (PPP relatif): Rp{s_fwd:,.0f}")
print("\\nPPP = jangkar jangka panjang, BUKAN sinyal trading bulanan.")
"""},
],
"decisions": [
{"kondisi": "Butuh forward FX", "pakai": "Covered IRP (harga pasar)",
"alasan": "Arbitrase memastikan kewajaran.",
"contoh": "Hedging eksportir."},
{"kondisi": "Tertarik carry trade", "pakai": "Sizing kecil + stop; sadar skew",
"alasan": "Naik tangga, turun lift.",
"contoh": "Maks 2% portofolio."},
{"kondisi": "Analisis kurs jangka panjang", "pakai": "PPP relatif",
"alasan": "Harga kaku jangka pendek.",
"contoh": "Valuasi IDR 5-tahunan."},
{"kondisi": "Krisis EM, cadangan menipis", "pakai": "Kurangi eksposur / hedge",
"alasan": "Amunisi intervensi habis.",
"contoh": "1998, 2013 taper tantrum."},
],
"rule10": "<ol><li><strong>Covered = pasti</strong>, uncovered = ekspektasi.</li><li><strong>Carry = jual asuransi</strong> (skew negatif).</li><li><strong>PPP jangka panjang</strong> saja.</li><li><strong>Trilemma</strong>: pilih 2 dari 3.</li></ol>",
"case": {"toc": "Mini-Case: Yen 2008",
"title": "'Uang Gratis' −14,5%",
"body": """<p>Carry JPY (0,5%) → AUD (6%): +5,5%/thn 2005–2007. 2008: yen +20% → −14,5%.</p>""",
"q": "(a) Kenapa uncovered IRP 'gagal'? (b) Hitung return 2008. (c) Desain carry yang bertanggung jawab?",
"pembahasan": """<p>(a) <strong>Forward premium puzzle</strong>: bunga tinggi <em>tidak</em> diimbangi depresiasi rata-rata — karena ada <strong>premi risiko crash</strong> yang jarang terealisasi. Gagal rata-rata, benar saat bencana.</p>
<p>(b) <strong>+5,5% − 20% = −14,5%</strong> — menghapus 3 tahun profit.</p>
<p>(c) <strong>Sizing ≤ 2%</strong>, <strong>stop-loss</strong> (unwind otomatis), <strong>diversifikasi funding/target</strong>, dan <strong>cadangan kas</strong> untuk margin. Carry = strategi <em>pendapatan</em>, bukan core.</p>"""},
"quiz": [
{"q": "S=16.000, r_IDR=6%, r_USD=5%. Forward wajar 1 thn?",
"options": ["16.000", "16.152", "15.850", "16.500"], "correct": 1,
"why": "Benar: 16.000×1,06/1,05 = 16.152. Covered IRP = arbitrase, pasti berlaku."},
{"q": "Carry +5,5%/thn, lalu funding currency menguat 20%. Return tahun itu?",
"options": ["+5,5%", "−14,5%", "+25,5%", "0%"], "correct": 1,
"why": "Benar: 5,5% − 20% = −14,5%. Naik tangga, turun lift — skew negatif carry."},
{"q": "Bedakan covered vs uncovered IRP.",
"options": ["Sama", "Covered = arbitrase pasti; uncovered = ekspektasi, sering gagal", "Uncovered pasti", "Covered untuk saham"], "correct": 1,
"why": "Benar: covered dijamin arbitrase; uncovered = hipotesis yang empiris gagal (forward premium puzzle)."},
{"q": "Trilemma: pilih 2 dari 3. Indonesia memilih?",
"options": ["Kurs tetap + modal bebas", "Moneter independen + modal bebas (managed float)", "Kurs tetap + independen", "Ketiganya"], "correct": 1,
"why": "Benar: BI independen + modal relatif bebas → kurs mengambang terkendali. Tidak bisa ketiganya."},
{"q": "PPP paling berguna untuk?",
"options": ["Trading harian", "Jangkar kurs jangka panjang (tahunan)", "Opsi mingguan", "Tidak berguna"], "correct": 1,
"why": "Benar: harga kaku jangka pendek — PPP butuh waktu bekerja. Untuk trading, pakai IRP/aliran modal."},
],
"rangkum": [
"<strong>Covered IRP</strong>: F = S(1+r_d)/(1+r_f) — arbitrase, pasti.",
"<strong>Uncovered IRP & PPP</strong>: ekspektasi; empiris sering gagal jangka pendek.",
"<strong>Carry trade</strong>: selisih bunga − crash = skew negatif; sizing kecil.",
"<strong>Trilemma</strong>: kurs tetap / moneter independen / modal bebas — pilih 2.",
"<strong>Intervensi</strong> meredam volatilitas, tidak melawan fundamental.",
"<strong>Aturan</strong>: IRP untuk pricing, PPP untuk jangkar panjang.",
],
"prev": ["pm-b6-valuasi-derivatif", "PM-B6"],
"next": ["pm-b8-faktor-risiko", "PM-B8"],
},
{
"slug": "pm-b8-faktor-risiko", "id": "PM-B8", "track": "Portfolio Management",
"title_html": "Faktor & Risiko:<br/>VaR, ES & Greeks",
"title_plain": "Model Faktor & Manajemen Risiko: VaR, ES, Greeks",
"chapter_summary": "CFA L2 risk: model faktor (makro, fundamental/Fama-French, statistik), dekomposisi active return, VaR (parametrik/historis/Monte Carlo), Expected Shortfall, dan Greeks untuk hedging. Lab kalkulator VaR 3 metode & regresi Fama-French.",
"tujuan": [
"Membedakan 3 jenis model faktor dan kegunaannya.",
"Menghitung VaR 3 metode dan menjelaskan keterbatasannya.",
"Menjelaskan Expected Shortfall vs VaR.",
"Menjelaskan delta/gamma/theta/vega untuk hedging portofolio.",
],
"story_title": "Cerita: VaR yang 'Aman' Saat Tsunami",
"story": """<p><strong>2008</strong>: bank-bank melaporkan <strong>VaR harian 'hanya' USD 100jt</strong> — <em>&ldquo;risiko terkendali.&rdquo;</em> Lalu Lehman jatuh: kerugian <strong>USD 600jt sehari</strong> — <strong>6x VaR</strong>, berhari-hari berturut-turut.</p>
<p>Twist-nya: VaR 99% <em>memang</em> berkata '1 hari dari 100, rugi <em>bisa</em> lebih dari ini' — <strong>bank lupa membaca kalimat keduanya</strong>: VaR <strong>tidak berkata <em>berapa</em> lebihnya</strong>. Ditambah VaR dihitung dari <strong>data tenang</strong> (2004–2006) untuk <strong>badai</strong> (2008). <strong>VaR = speedometer yang tidak menunjukkan jurang.</strong> Lesson ini: mengukur risiko dengan jujur.</p>""",
"concepts": [
{
"id": "faktor", "toc": "Model Faktor",
"title": "Model Faktor — DNA Return",
"body": """<p><strong>Definisi.</strong> <strong>Model faktor</strong>: R_i = α + β1×F1 + β2×F2 + … + ε. <strong>Jenis</strong>: <em>makroekonomi</em> (GDP, inflasi, suku bunga), <em>fundamental</em> (<strong>Fama-French</strong>: MKT, SMB/size, HML/value; + momentum, quality), <em>statistik</em> (PCA — faktor tanpa nama).</p>
<p><strong>Active return</strong> = Σ (exposure aktif × return faktor) + <strong>alpha murni</strong> (stock selection). Attribution (PM-C5) memakai ini.</p>""",
"formulas": [
{"math": r"R_i = \alpha + \beta_{MKT}MKT + \beta_{SMB}SMB + \beta_{HML}HML + \epsilon",
"symbols": [
"<Tex math={String.raw`SMB`} />: small minus big (premi ukuran)",
"<Tex math={String.raw`HML`} />: high minus low book-to-market (premi value)",
"<Tex math={String.raw`\\alpha`} />: return di luar faktor = skill (atau luck!)",
"Fama-French menjelaskan ~90% return terdiversifikasi — alpha tersisa sedikit",
]},
],
"intuisi": "Model faktor seperti <strong>tes DNA return</strong>: 'darah' portofoliomu terdiri dari gen pasar (MKT), gen kecil (SMB), gen murah (HML). Alpha = <strong>mutasi unik</strong> — langka &amp; berharga, tapi sering ternyata cuma <em>gen yang belum dites</em>.",
"kapan": "Evaluasi manajer: alpha vs factor exposure (PM-C5); konstruksi smart beta (PM-C8).",
"worked": {"title": "📐 Contoh: 'Alpha' yang ternyata value (klik untuk buka)",
"body": """<p>Manajer klaim alpha 4%/thn. Regresi FF3: β_MKT=1,0, β_SMB=0,6, β_HML=0,8, <strong>α = 0,5%</strong> (tidak signifikan).</p>
<p><strong>3,5% dari 4%</strong> = exposure ke <strong>small-value</strong> — bisa dibeli via ETF <strong>murah</strong>! Alpha murni cuma 0,5%.</p>
<p><strong>Pelajaran:</strong> jangan bayar fee 2% untuk <em>factor exposure</em>. Bayar untuk alpha — jika ada.</p>"""},
"charts": [
{"data": """[{x: ["MKT", "SMB", "HML", "Alpha murni"], y: [6.0, 1.8, 1.4, 0.5], type: "bar", marker: {color: ["#2a7de1","#2a7de1","#2a7de1","#e8a838"]}, text: ["6,0%","1,8%","1,4%","0,5%"], textposition: "outside"}]""",
"title": "Dekomposisi return manajer 9,7%",
"layout": """{xaxis: {title: "Sumber"}, yaxis: {title: "Kontribusi (%)"}, showlegend: false}""",
"cara": "Biru = return dari exposure faktor; kuning = alpha murni.",
"interpretasi": "Dari 9,7%: <strong>9,2% = faktor</strong> (beta berbayar murah via ETF), <strong>0,5% = alpha</strong>. Fee 2% untuk 0,5% alpha = mahal. <strong>Factor lens</strong> mengubah cara menilai manajer: bayar alpha, beli beta murah."},
],
},
{
"id": "var", "toc": "VaR & Expected Shortfall",
"title": "VaR — Speedometer Risiko",
"body": """<p><strong>Definisi.</strong> <strong>VaR 99% harian RpX</strong>: '99% hari, rugi ≤ RpX' — ekuivalen: '1% hari, rugi <em>bisa</em> &gt; RpX'. <strong>Metode</strong>: <em>parametrik</em> (σ×z: cepat, asumsi normal), <em>historis</em> (persentil data lalu: tanpa asumsi distribusi, tapi <em>masa lalu ≠ masa depan</em>), <em>Monte Carlo</em> (simulasi ribuan skenario).</p>
<p><strong>Expected Shortfall (ES)</strong>: <em>rata-rata</em> rugi <strong>jika</strong> VaR terlampaui — menjawab 'seberapa dalam jurangnya'. <strong>Koheren</strong> (subadditive); VaR tidak!</p>""",
"formulas": [
{"math": r"VaR_{99\%} = z_{0,99} \times \sigma \times \sqrt{T} \times \text{Nilai} \quad;\quad ES = E[\text{Loss} | \text{Loss} > VaR]",
"symbols": [
"<Tex math={String.raw`z_{0,99}`} /> = 2,33 (normal)",
"<Tex math={String.raw`\\sqrt{T}`} />: scaling waktu (hanya jika i.i.d.!)",
"VaR bukan kerugian maksimum — itu miskonsepsi paling berbahaya",
]},
],
"intuisi": "VaR seperti <strong>speedometer</strong>: '99% waktu kecepatan ≤ 100'. Tapi speedometer <strong>tidak menunjukkan jurang</strong> di depan (ES = 'jika jatuh, sedalam apa?'). Mengemudi hanya dengan speedometer saat badai = 2008.",
"kapan": "Limit risiko harian; alokasi modal; reporting (PM-D6).",
"worked": {"title": "📐 Contoh: VaR portofolio Rp10M (klik untuk buka)",
"body": """<p>σ harian = 2%. <strong>VaR 99%</strong> = 2,33 × 2% × Rp10M = <strong>Rp466jt</strong>.</p>
<p><strong>Artinya</strong>: 1 hari dari 100, rugi <em>bisa lebih</em> dari Rp466jt — <strong>tanpa batas atas!</strong> <strong>ES</strong> (normal) ≈ 2,67×2%×10M = <strong>Rp534jt</strong> (rata-rata saat jebol).</p>
<p>2008: rugi 6x VaR = <strong>di luar model</strong> (fat tails!) → <strong>stress test</strong> wajib mendampingi VaR.</p>"""},
"charts": [],
},
{
"id": "greeks", "toc": "Greeks & Hedging",
"title": "Greeks — Panel Instrumen Opsi",
"body": """<p><strong>Definisi.</strong> <strong>Delta</strong> (Δ): Δharga opsi / Δharga saham (hedge ratio). <strong>Gamma</strong> (Γ): Δdelta / Δsaham (delta <em>berubah</em> — butuh rebalance!). <strong>Theta</strong> (Θ): <em>time decay</em> per hari (opsi <em>membusuk</em>). <strong>Vega</strong>: sensitivitas ke volatilitas.</p>
<p><strong>Delta-neutral</strong>: saham − Δ×opsi → kebal gerakan <em>kecil</em>; gamma/theta tetap berisik (tidak ada hedge sempurna).</p>""",
"formulas": [],
"intuisi": "Greeks seperti <strong>panel instrumen pesawat</strong>: delta = kemudi (arah), gamma = responsivitas kemudi (makin cepat makin liar), theta = bahan bakar bocor (waktu menggerogoti), vega = sensitivitas ke cuaca (vol). <strong>Terbang buta tanpa panel = trading opsi tanpa Greeks.</strong>",
"kapan": "Market-making & hedging buku opsi; overlay derivatif (PM-C9).",
"worked": {"title": "📐 Contoh: Delta hedge (klik untuk buka)",
"body": """<p>Jual 100 call, Δ = 0,5. <strong>Hedge</strong>: beli 50 saham → delta-netral.</p>
<p>Saham naik Rp1.000: call rugi 100×0,5×1.000 = Rp50jt; saham untung 50×1.000 = Rp50jt → <strong>net ≈ 0</strong> (gerakan kecil).</p>
<p>Tapi <strong>gamma</strong>: delta call naik jadi 0,6 → hedge kurang → <strong>rebalance</strong> (beli 10 lagi). <strong>Theta</strong>: tiap hari opsi <em>meleleh</em> — penjual call <em>menikmati</em> ini.</p>"""},
"charts": [],
},
],
"myths": [
{"t": "VaR 99% Rp466jt berarti rugi maksimal Rp466jt.",
"benar": "<strong>SALAH dan berbahaya.</strong> VaR = <em>ambang</em>: 1% hari rugi <em>melebihi</em> itu — <strong>tanpa batas</strong>. 2008: 6x VaR. Yang menjawab 'berapa parahnya' = <strong>Expected Shortfall + stress test</strong>. VaR tanpa ES = speedometer tanpa rem."},
{"t": "Alpha positif = manajer hebat. Bayar fee mahal tidak apa.",
"benar": "'Alpha' dari regresi <strong>satu faktor</strong> sering = <strong>exposure faktor tersembunyi</strong> (small-value). Uji dengan <strong>multi-faktor</strong>: jika alpha lenyap, itu <em>beta mahal</em>, bukan skill. Bayar fee untuk alpha murni — beli beta via ETF murah."},
],
"tips": [
"<strong>Selalu pasangkan VaR + stress test.</strong> VaR = cuaca normal; stress = skenario badai (2008, COVID, +300bps). Komite risiko yang hanya lihat VaR = pilot yang hanya lihat speedometer.",
"<strong>Untuk evaluasi manajer: FF3 dulu, kagum kemudian.</strong> Regresikan return ke MKT/SMB/HML sebelum memuji alpha. 90% 'alpha' adalah beta yang belum diidentifikasi.",
],
"labs": [
{"heading": "Kalkulator VaR 3 Metode",
"intro": "Hitung VaR parametrik, historis, dan Monte Carlo dari return sintetis berekor tebal.",
"title": "Lab 1 — Kalkulator VaR",
"hint": "Ubah TAIL 3 -> 6 (ekor makin tebal). VaR historis naik, parametrik tetap — model normal meremehkan!",
"code": """# VaR: parametrik vs historis vs Monte Carlo
import random, math, statistics
random.seed(9)
NILAI, SIG = 10_000_000_000, 0.02
TAIL = 3  # derajat kebebasan t-dist (kecil = ekor tebal; ubah!)

def rt():
    # t-dist kasar via campuran normal
    return random.gauss(0, SIG) * math.sqrt(TAIL/max(0.5, random.gauss(TAIL, math.sqrt(2*TAIL))))

rets = [rt() for _ in range(5000)]
rets_sorted = sorted(rets)

var_param = 2.33 * statistics.stdev(rets) * NILAI
var_hist = -rets_sorted[int(0.01*len(rets_sorted))] * NILAI
# Monte Carlo: simulasi 20000 skenario dari distribusi empiris
mc = sorted(random.choice(rets) for _ in range(20000))
var_mc = -mc[int(0.01*len(mc))] * NILAI
# Expected Shortfall (historis)
es = -sum(r for r in rets_sorted[:int(0.01*len(rets_sorted))])/int(0.01*len(rets_sorted)) * NILAI

print(f"VaR 99% parametrik : Rp{var_param/1e9:.2f} M")
print(f"VaR 99% historis   : Rp{var_hist/1e9:.2f} M")
print(f"VaR 99% Monte Carlo: Rp{var_mc/1e9:.2f} M")
print(f"ES 99% (historis)  : Rp{es/1e9:.2f} M  <- rata-rata saat jebol!")
print("\\nEkor tebal: historis > parametrik. Jangan percaya normal!")
"""},
{"heading": "Regresi Fama-French 3 Faktor",
"intro": "Regresi return manajer ke MKT/SMB/HML — pisahkan alpha dari beta.",
"title": "Lab 2 — Regresi FF3",
"hint": "Ubah ALPHA_TRUE 0.005 -> 0.02 (manajer benar-benar skilled). Alpha terdeteksi!",
"code": """# Fama-French 3 faktor from scratch (n kecil, ilustrasi)
import random
random.seed(13)
ALPHA_TRUE = 0.005  # alpha bulanan sebenarnya (ubah!)
N = 60
mkt = [random.gauss(0.008, 0.04) for _ in range(N)]
smb = [random.gauss(0.002, 0.03) for _ in range(N)]
hml = [random.gauss(0.003, 0.03) for _ in range(N)]
ret = [ALPHA_TRUE + 1.0*m + 0.6*s + 0.8*h + random.gauss(0, 0.015)
       for m, s, h in zip(mkt, smb, hml)]

def solve(A, b):
    n = len(A); M = [r[:] + [v] for r, v in zip(A, b)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c])); M[c], M[p] = M[p], M[c]
        for r in range(n):
            if r != c:
                f = M[r][c]/M[c][c]
                for k in range(c, n+1): M[r][k] -= f*M[c][k]
    return [M[i][n]/M[i][i] for i in range(n)]

cols = [[1]*N, mkt, smb, hml]
XtX = [[sum(a*b for a, b in zip(cols[i], cols[j])) for j in range(4)] for i in range(4)]
XtY = [sum(a*b for a, b in zip(cols[i], ret)) for i in range(4)]
b = solve(XtX, XtY)
print(f"alpha={b[0]:.4f}/bln (true {ALPHA_TRUE:.4f}), bMKT={b[1]:.2f}, bSMB={b[2]:.2f}, bHML={b[3]:.2f}")
print(f"Alpha tahunan ~ {b[0]*12:.1%}. Signifikan? Butuh t-stat (SE) - di sini hanya estimasi.")
print("\\nTanpa FF3, return 9.7% terlihat 'alpha'. Dengan FF3: mostly beta!")
"""},
],
"decisions": [
{"kondisi": "Set limit risiko harian", "pakai": "VaR + ES + stress test",
"alasan": "VaR sendiri buta ekor.",
"contoh": "VaR 99% + skenario 2008."},
{"kondisi": "Klaim alpha manajer", "pakai": "Regresi multi-faktor dulu",
"alasan": "Pisahkan beta dari skill.",
"contoh": "FF3 sebelum bayar fee 2%."},
{"kondisi": "Hedging buku opsi", "pakai": "Delta-neutral + monitor gamma/theta",
"alasan": "Delta bergerak; waktu menggerogoti.",
"contoh": "Rebalance berkala."},
{"kondisi": "Data tenang, pasar bergejolak", "pakai": "Naikkan VaR (GARCH) / pakai stressed VaR",
"alasan": "VaR historis basi.",
"contoh": "Setelah crash: kalibrasi ulang."},
],
"rule10": "<ol><li><strong>VaR = ambang</strong>, bukan maksimum.</li><li><strong>ES + stress</strong> selalu mendampingi.</li><li><strong>Alpha diuji multi-faktor.</strong></li><li><strong>Greeks</strong> = panel instrumen.</li></ol>",
"case": {"toc": "Mini-Case: VaR 2008",
"title": "VaR 'Aman' 6x Jebol",
"body": """<p>Bank: VaR 99% USD 100jt ('terkendali'). Lehman: rugi USD 600jt/hari berhari-hari.</p>""",
"q": "(a) Apa yang salah dari pembacaan VaR? (b) Tiga perbaikan framework? (c) Kenapa ES lebih baik?",
"pembahasan": """<p>(a) <strong>Membaca VaR sebagai maksimum</strong> + kalibrasi dari <strong>data tenang</strong> (2004–06) untuk badai. VaR memang berkata 'bisa lebih' — diabaikan.</p>
<p>(b) <strong>(1)</strong> ES + stress test; <strong>(2)</strong> stressed VaR (kalibrasi periode krisis); <strong>(3)</strong> limit + governance (bukan cuma angka).</p>
<p>(c) <strong>ES = rata-rata saat jebol</strong> (koheren, subadditive) — menjawab 'sedalam apa jurangnya', bukan cuma 'di mana pagarnya'.</p>"""},
"quiz": [
{"q": "VaR 99% harian Rp466jt. Artinya?",
"options": ["Rugi maks Rp466jt", "1% hari rugi bisa melebihi Rp466jt (tanpa batas)", "Rugi pasti Rp466jt", "Aman 100%"], "correct": 1,
"why": "Benar: VaR = ambang kuantil, bukan maksimum. 2008: 6x VaR. Untuk 'seberapa parah' lihat ES."},
{"q": "Manajer return 9,7%: dekomposisi FF3 menunjukkan 9,2% faktor + 0,5% alpha. Kesimpulan?",
"options": ["Hebat — bayar fee mahal", "Mostly beta — beli via ETF murah; alpha kecil", "Alpha 9,7%", "Tidak bisa dinilai"], "correct": 1,
"why": "Benar: factor lens — 9,2% = exposure (murah), 0,5% = skill. Fee 2% untuk 0,5% = mahal."},
{"q": "Jual 100 call Δ=0,5. Hedge delta-neutral?",
"options": ["Beli 100 saham", "Beli 50 saham", "Jual 50 saham", "Tidak perlu hedge"], "correct": 1,
"why": "Benar: butuh +50 delta (100×0,5). Tapi gamma → delta bergerak → rebalance dinamis."},
{"q": "Opsi dibiarkan mendekati expiry tanpa pergerakan. Yang terjadi?",
"options": ["Tidak ada", "Theta: time value meleleh (penjual untung)", "Delta naik", "Vega naik"], "correct": 1,
"why": "Benar: theta = time decay. Waktu = musuh pembeli, teman penjual opsi."},
{"q": "Ekor tebal (krisis). Metode VaR terbaik?",
"options": ["Parametrik normal", "Historis/MC yang menangkap ekor + stress test", "Abaikan", "VaR tidak berguna"], "correct": 1,
"why": "Benar: normal meremehkan ekor (lihat lab: historis &gt; parametrik). Pasangkan dengan stress test."},
],
"rangkum": [
"<strong>Model faktor</strong>: makro, fundamental (FF3), statistik; alpha = residu.",
"<strong>VaR</strong>: parametrik/historis/MC — ambang kuantil, <strong>bukan maksimum</strong>.",
"<strong>ES</strong>: rata-rata rugi saat VaR jebol; koheren.",
"<strong>Greeks</strong>: delta (arah), gamma (perubahan delta), theta (waktu), vega (vol).",
"<strong>Aturan</strong>: VaR + ES + stress; FF3 sebelum kagum alpha.",
"<strong>Pelajaran 2008</strong>: kalibrasi tenang untuk badai = bunuh diri.",
],
"prev": ["pm-b7-currency", "PM-B7"],
"next": ["pm-b9-intercorporate", "PM-B9"],
},
{
"slug": "pm-b9-intercorporate", "id": "PM-B9", "track": "Portfolio Management",
"title_html": "Intercorporate:<br/>Investasi Antar-Perusahaan",
"title_plain": "Intercorporate Investments & Multinational Operations",
"chapter_summary": "CFA L2 (opsional): klasifikasi investasi antar-perusahaan (cost, equity method, konsolidasi), akuisisi & goodwill, dan operasi multinasional (translation current-rate vs temporal). Lab equity method & kalkulator translasi.",
"tujuan": [
"Membedakan metode cost, ekuitas, dan konsolidasi by kepemilikan.",
"Menjelaskan mekanisme equity method & goodwill akuisisi.",
"Membedakan current rate vs temporal method.",
"Menjelaskan dampak translasi ke laporan.",
],
"story_title": "Cerita: Laba yang Bukan Laba",
"story": """<p><strong>PT Induk</strong> memiliki <strong>40%</strong> PT Anak. PT Anak untung Rp100M tapi <strong>tidak bagi dividen</strong>. PT Induk melaporkan laba <strong>+Rp40M</strong> dari 'bagian laba asosiasi'. Investor bersorak.</p>
<p>Twist-nya: <strong>Rp40M itu bukan kas</strong> — tidak ada dividen! Itu <strong>equity method</strong>: mengakui bagian laba tanpa menerima sepeser pun. Saat PT Anak butuh kas dan <em>tidak bisa</em> bagi dividen, 'laba' Induk = <strong>angka di kertas</strong>. Investor yang tidak paham metode ini mengira Induk makin kaya tunai. <strong>Metode akuntansi mengubah cerita — tanpa mengubah kas.</strong> Lesson ini: membaca investasi antar-perusahaan.</p>""",
"concepts": [
{
"id": "klasifikasi", "toc": "Klasifikasi Investasi",
"title": "Spektrum Kepemilikan — 0% ke 100%",
"body": """<p><strong>Definisi.</strong> <strong>&lt; 20%</strong> (tidak berpengaruh signifikan): <em>fair value</em> (dividen = pendapatan; perubahan nilai ke OCI/laba). <strong>20–50%</strong> (<em>significant influence</em>): <strong>equity method</strong>. <strong>&gt; 50%</strong> (<em>control</em>): <strong>konsolidasi penuh</strong> (gabung 100% laporan + <em>minority interest</em>).</p>
<p>Ambang = <em>pengaruh</em>, bukan sekadar % (dewan direksi, teknologi kunci bisa = significant influence di bawah 20%).</p>""",
"formulas": [],
"intuisi": "Spektrum seperti <strong>hubungan</strong>: &lt;20% = kenalan (sapa = dividen); 20–50% = pacar serius (ikut merasakan untung-rugi = equity method); &gt;50% = menikah (harta digabung = konsolidasi, dengan 'anak tiri' = minority interest).",
"kapan": "Baca laporan konglomerat: metode menentukan angka yang kamu lihat.",
"worked": {"title": "📐 Contoh: Tiga investasi (klik untuk buka)",
"body": """<p>Induk pegang: <strong>10%</strong> di A (dividen Rp5M) → pendapatan <strong>Rp5M</strong> (fair value). <strong>40%</strong> di B (laba Rp100M, dividen Rp20M) → equity method: <strong>+Rp40M</strong> laba (bukan Rp8M dividen!). <strong>80%</strong> di C → <strong>konsolidasi</strong>: gabung 100% revenue/aset C, kurangi 20% minority.</p>
<p><strong>Laba Induk</strong> mencakup Rp40M 'kertas' dari B — analis kas <strong>mengeluarkannya</strong> dari CFO proxy.</p>"""},
"charts": [
{"data": """[{x: ["<20%", "20-50%", ">50%"], y: [1, 2, 3], type: "bar", marker: {color: ["#94a3b8","#e8a838","#2a7de1"]}, text: ["Fair value", "Equity method", "Konsolidasi"], textposition: "outside"}]""",
"title": "Spektrum metode akuntansi investasi",
"layout": """{xaxis: {title: "Kepemilikan"}, yaxis: {title: "", showticklabels: false}, showlegend: false}""",
"cara": "Kiri ke kanan = pengaruh membesar; warna = metode berbeda.",
"interpretasi": "Metode <strong>melompat</strong> di ambang 20% &amp; 50% — bukan bertahap. Akuisisi 19%→21% = perubahan <em>drastis</em> tampilan laporan (dari dividen ke equity income). <strong>Waspadai transaksi di sekitar ambang!</strong>"},
],
},
{
"id": "ekuitas", "toc": "Equity Method & Goodwill",
"title": "Equity Method — Laba Tanpa Kas",
"body": """<p><strong>Definisi.</strong> <strong>Equity method</strong>: investasi awal at cost; <strong>+ bagian laba</strong>, <strong>− dividen diterima</strong> (dividen = <em>pengembalian modal</em>, bukan pendapatan!). <strong>Akuisisi</strong>: bayar &gt; fair value aset neto → <strong>goodwill</strong> (tidak diamortisasi; <strong>uji impairment</strong> tahunan).</p>
<p><strong>Goodwill impairment</strong> = pengakuan 'bayar kemahalan' — sering raksasa &amp; tiba-tiba.</p>""",
"formulas": [
{"math": r"\text{Investasi}_{t} = \text{Investasi}_{t-1} + \% \times NI - \text{Dividen}",
"symbols": [
"Bagian laba MENAMBAH investasi (bukan kas!)",
"Dividen MENGURANGI investasi (konversi ke kas)",
"Goodwill = harga bayar − fair value aset neto teridentifikasi",
]},
],
"intuisi": "Equity method seperti <strong>saham gabungan warung</strong>: warung untung Rp100M (kamu 40%) → 'jatahmu' Rp40M <em>dicatat</em> — tapi kasnya tetap di laci warung sampai dibagi. Dividen = saat laci dibuka.",
"kapan": "Analisis konglomerat: pisahkan 'laba kertas' asosiasi dari kas.",
"worked": {"title": "📐 Contoh: Investasi PT Induk (klik untuk buka)",
"body": """<p>Beli 40% PT Anak Rp300M. Tahun 1: Anak laba Rp100M, dividen Rp20M.</p>
<p><strong>Investasi akhir</strong> = 300 + 40%×100 − 40%×20 = 300 + 40 − 8 = <strong>Rp332M</strong>. <strong>Laba Induk</strong> +Rp40M (kertas!), <strong>kas masuk</strong> cuma Rp8M.</p>
<p>Akuisisi: bayar Rp500M untuk 80%, FV aset neto Rp400M → <strong>goodwill Rp180M</strong> (500 − 80%×400). Impairment test tiap tahun!</p>"""},
"charts": [],
},
{
"id": "translasi", "toc": "Operasi Multinasional",
"title": "Translasi — Dua Mata Uang, Satu Laporan",
"body": """<p><strong>Definisi.</strong> <strong>Current rate method</strong> (mata uang fungsional ≠ presentasi): semua aset/liabilitas @ <strong>kurs kini</strong>, ekuitas @ historis, IS @ rata-rata → selisih ke <strong>CTA</strong> (OCI, bukan laba!). <strong>Temporal method</strong>: moneter @ kini, non-moneter @ historis → selisih ke <strong>laba rugi</strong> (volatile!).</p>
<p>Pilih by <strong>mata uang fungsional</strong> (lingkungan ekonomi utama), bukan pilihan bebas.</p>""",
"formulas": [],
"intuisi": "Translasi seperti <strong>menerjemahkan novel</strong>: current rate = terjemahan <em>bebas</em> yang mengalir (selisih rasa ke catatan kaki/OCI); temporal = terjemahan <em>harfiah</em> (kaku, selisihnya mengganggu cerita/laba). Pilih sesuai 'bahasa asli' (fungsional).",
"kapan": "Emiten multinasional: pahami dari mana volatilitas kurs muncul di laporan.",
"worked": {"title": "📐 Contoh: Anak usaha di Malaysia (klik untuk buka)",
"body": """<p>Anak: aset MYR 100jt, kurs awal 3.500, kini 3.200 (MYR melemah).</p>
<p><strong>Current rate</strong>: aset Rp320M (vs 350M) → <strong>CTA −Rp30M</strong> di OCI (tidak sentuh laba!).</p>
<p><strong>Temporal</strong> (jika fungsional = IDR): non-moneter @ historis → <strong>selisih ke laba</strong> → laba Induk volatile tiap kuartal. <strong>Metode mengubah volatilitas laba!</strong></p>"""},
"charts": [],
},
],
"myths": [
{"t": "'Bagian laba asosiasi' = kas masuk. Laba naik = makin kaya.",
"benar": "Equity method: <strong>laba diakui tanpa kas</strong> (kas = dividen, sering jauh lebih kecil). PT Induk: +Rp40M laba, kas +Rp8M. Analis <strong>mengeluarkan</strong> equity income saat hitung kualitas laba (PM-A4) — 'laba kertas' ≠ CFO."},
{"t": "Goodwill = aset seperti gedung. Aman di neraca.",
"benar": "Goodwill = <strong>premi bayar</strong> (harapan sinergi) — tidak berwujud, <strong>tidak diamortisasi</strong>, tapi <strong>diuji impairment</strong>. Saat sinergi gagal: impairment <strong>miliaran sekaligus</strong> (contoh: akuisisi media/teknologi). Goodwill besar = <strong>risiko write-down</strong>."},
],
"tips": [
"<strong>Untuk konglomerat: baca 'segment' + pisahkan asosiasi.</strong> Laba konsolidasian campur aduk — segment note memberi tahu unit mana yang benar-benar menghasilkan kas.",
"<strong>Waspadai goodwill &gt; 30% ekuitas.</strong> Akuisisi agresif menumpuk goodwill = bom impairment. Cek track record akuisisi manajemen (serial acquirer = red flag).",
],
"labs": [
{"heading": "Equity Method vs Dividen",
"intro": "Bandingkan laba & kas di bawah equity method vs fair value.",
"title": "Lab 1 — Equity Method",
"hint": "Ubah DIVIDEN 20 -> 0 (tidak bagi dividen). Laba tetap +40, kas 0 — 'laba kertas' murni!",
"code": """# Equity method: laba vs kas
INVESTASI_AWAL, KEPEMILIKAN = 300, 0.40
LABA_ANAK, DIVIDEN = 100, 20  # Rp M (ubah DIVIDEN!)

bagian_laba = KEPEMILIKAN * LABA_ANAK
div_diterima = KEPEMILIKAN * DIVIDEN
investasi_akhir = INVESTASI_AWAL + bagian_laba - div_diterima

print(f"Bagian laba (diakui di IS): +Rp{bagian_laba:.0f}M")
print(f"Dividen kas diterima      :  Rp{div_diterima:.0f}M")
print(f"Investasi akhir           : Rp{investasi_akhir:.0f}M")
print()
print(f"GAP laba vs kas: Rp{bagian_laba - div_diterima:.0f}M <- 'laba kertas'")
print("Analis kas MENGELUARKAN ini dari proksi CFO.")
"""},
{"heading": "Kalkulator Translasi Current-Rate",
"intro": "Translasikan neraca anak usaha asing dan hitung CTA.",
"title": "Lab 2 — Kalkulator Translasi",
"hint": "Ubah KURS_KINI 3200 -> 3800 (MYR menguat). CTA jadi positif — OCI, bukan laba!",
"code": """# Translasi current rate method (Rp M)
ASET_MYR, KURS_AWAL, KURS_KINI = 100, 3500, 3200  # ubah KURS_KINI!

aset_awal = ASET_MYR * KURS_AWAL / 1e6 * 1e3  # sederhanakan: *kurs
# hitung langsung dalam Rp jt
aset_awal_jt = ASET_MYR * KURS_AWAL / 1000
aset_kini_jt = ASET_MYR * KURS_KINI / 1000
cta = aset_kini_jt - aset_awal_jt

print(f"Aset @kurs awal: Rp{aset_awal_jt:,.0f} jt")
print(f"Aset @kurs kini : Rp{aset_kini_jt:,.0f} jt")
print(f"CTA (ke OCI)    : Rp{cta:,.0f} jt")
print()
print("CTA masuk OCI (ekuitas), TIDAK mengganggu laba bersih.")
print("Temporal method: selisih serupa masuk LABA -> volatile!")
"""},
],
"decisions": [
{"kondisi": "Kepemilikan 20–50%", "pakai": "Equity method",
"alasan": "Significant influence.",
"contoh": "Asosiasi 40%."},
{"kondisi": "Akuisisi &gt; 50%", "pakai": "Konsolidasi + goodwill",
"alasan": "Control.",
"contoh": "Anak usaha 80%."},
{"kondisi": "Goodwill &gt; 30% ekuitas", "pakai": "Waspada impairment",
"alasan": "Risiko write-down besar.",
"contoh": "Serial acquirer."},
{"kondisi": "Analisis kas konglomerat", "pakai": "Keluarkan equity income",
"alasan": "'Laba kertas' bukan kas.",
"contoh": "Proksi CFO bersih."},
],
"rule10": "<ol><li><strong>Metode by pengaruh</strong>: &lt;20 / 20–50 / &gt;50.</li><li><strong>Equity income ≠ kas.</strong></li><li><strong>Goodwill</strong> = risiko impairment.</li><li><strong>Translasi</strong>: pahami ke mana selisih pergi.</li></ol>",
"case": {"toc": "Mini-Case: PT Induk",
"title": "Laba Rp40M Tanpa Kas",
"body": """<p>PT Induk (40% PT Anak): Anak laba Rp100M, dividen Rp20M. Induk akui +Rp40M laba.</p>""",
"q": "(a) Berapa kas yang diterima Induk? (b) Penyesuaian analis? (c) Kapan equity method menyesatkan?",
"pembahasan": """<p>(a) <strong>Rp8M</strong> (40% × 20M) — bukan Rp40M!</p>
<p>(b) <strong>Keluarkan Rp32M</strong> (40−8) dari proksi laba kas; nilai Anak via <strong>dividen sustainable</strong>, bukan laba akuntansi.</p>
<p>(c) Saat Anak <strong>tidak pernah bagi dividen</strong> (tumbuh terus / diatur Induk) — 'laba' abadi tanpa kas. <strong>Uji</strong>: bandingkan kumulatif equity income vs dividen 5 tahun.</p>"""},
"quiz": [
{"q": "Kepemilikan 40%, laba anak Rp100M, dividen Rp20M. Diakui Induk?",
"options": ["Rp8M (dividen)", "Rp40M laba (equity method); kas Rp8M", "Rp100M", "Rp0"], "correct": 1,
"why": "Benar: equity method akui 40%×100M = Rp40M di IS; kas = 40%×20M = Rp8M. Selisih Rp32M = 'laba kertas'."},
{"q": "Bayar Rp500M untuk 80%, FV aset neto Rp400M. Goodwill?",
"options": ["Rp100M", "Rp180M", "Rp500M", "Rp0"], "correct": 1,
"why": "Benar: 500 − 80%×400 = 500−320 = 180. Goodwill = premi; uji impairment tahunan."},
{"q": "Current rate vs temporal: selisih kurs ke mana?",
"options": ["Keduanya ke laba", "Current → CTA (OCI); temporal → laba rugi", "Keduanya ke OCI", "Tidak ada selisih"], "correct": 1,
"why": "Benar: current rate 'menampung' di OCI (laba stabil); temporal menghantam laba (volatile). Metode mengubah profil laba!"},
{"q": "Goodwill 50% dari ekuitas. Sikap?",
"options": ["Abaikan", "Waspada impairment — cek track record akuisisi", "Bagus — aset besar", "Jual segera"], "correct": 1,
"why": "Benar: goodwill jumbo = premi besar = risiko write-down. Serial acquirer = red flag governance (PM-A5)."},
{"q": "Investasi 10% dengan dividen Rp5M. Metode & pendapatan?",
"options": ["Equity method Rp5M", "Fair value: pendapatan = dividen Rp5M", "Konsolidasi", "Rp0"], "correct": 1,
"why": "Benar: &lt;20% tanpa pengaruh signifikan = fair value; pendapatan = dividen diterima (+ perubahan FV)."},
],
"rangkum": [
"<strong>Spektrum</strong>: &lt;20% fair value; 20–50% equity method; &gt;50% konsolidasi.",
"<strong>Equity method</strong>: +bagian laba −dividen; laba ≠ kas.",
"<strong>Goodwill</strong> = premi akuisisi; impairment, bukan amortisasi.",
"<strong>Translasi</strong>: current rate → CTA (OCI); temporal → laba (volatile).",
"<strong>Aturan</strong>: pisahkan 'laba kertas' asosiasi; waspadai goodwill jumbo.",
"<strong>Kapan TIDAK percaya</strong>: equity income tanpa dividen bertahun-tahun.",
],
"prev": ["pm-b8-faktor-risiko", "PM-B8"],
"next": ["pm-c1-ips", "PM-C1"],
},
]
