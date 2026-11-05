import type { V2Lesson } from "../lib/types";

// -- Figure: trade-off cut-off — approval rate vs bad rate (data lab) -----
const B22_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Trade-off cut-off: approval rate dan bad rate"><g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="250.0" x2="500" y2="250.0"/><line x1="60" y1="202.5" x2="500" y2="202.5"/><line x1="60" y1="155.0" x2="500" y2="155.0"/><line x1="60" y1="107.5" x2="500" y2="107.5"/><line x1="60" y1="60.0" x2="500" y2="60.0"/></g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="52" y="254.0">0%</text><text x="52" y="206.5">25%</text><text x="52" y="159.0">50%</text><text x="52" y="111.5">75%</text><text x="52" y="64.0">100%</text></g><polyline points="120,63.3 280,97.9 440,170.6" fill="none" stroke="var(--c1)" stroke-width="2.5"/><circle cx="120" cy="63.3" r="5" fill="var(--c1)"/><text x="120" y="51.3" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">98.2%</text><circle cx="280" cy="97.9" r="5" fill="var(--c1)"/><text x="280" y="85.9" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">80.0%</text><circle cx="440" cy="170.6" r="5" fill="var(--c1)"/><text x="440" y="158.6" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">41.8%</text><polyline points="120,146.9 280,160.9 440,193.2" fill="none" stroke="var(--c2)" stroke-width="2.5" stroke-dasharray="7,4"/><circle cx="120" cy="146.9" r="5" fill="var(--c2)"/><text x="120" y="134.9" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">54.2%</text><circle cx="280" cy="160.9" r="5" fill="var(--c2)"/><text x="280" y="148.9" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">46.9%</text><circle cx="440" cy="193.2" r="5" fill="var(--c2)"/><text x="440" y="181.2" text-anchor="middle" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">29.9%</text><text x="120" y="272" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">cut 520</text><text x="280" y="272" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">cut 560</text><text x="440" y="272" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">cut 600</text><text x="500" y="30" text-anchor="end" font-size="12" font-family="var(--font-ui)" fill="var(--c1)">— approval rate</text><text x="500" y="48" text-anchor="end" font-size="12" font-family="var(--font-ui)" fill="var(--c2)">- - bad rate (gagal bayar)</text></svg>`;

export const b22: V2Lesson = {
  slug: "b22-regresi-scorecard",
  track: "Probabilitas",
  module: "Pemodelan Risiko",
  title: "Dari Regresi Logistik ke Credit Scorecard",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Angka 600 yang menentukan nasib — dan tak ada yang tahu asalnya",
      prose: [
        "Di sebuah bank, ada angka keramat: 600. Skor kredit di bawah 600 = aplikasi ditolak otomatis; di atasnya = lanjut ke analis. Setiap hari ratusan nasib ditentukan angka itu. Suatu hari, Rina — analis risiko yang baru pindah dari tim data — bertanya di rapat: 'Kenapa 600? Kenapa bukan 580 atau 620?' Ruangan hening. Jawaban tertua: 'Dari dulu begitu.' Jawaban kedua: 'Itu standar.' Tidak ada yang bisa menunjukkan hitungan trade-off-nya: berapa approval rate di 600? Berapa bad rate-nya? Berapa rupiah yang hilang tiap 10 poin cut-off digeser?",
        "Twist-nya: masalahnya bukan angkanya — 600 bisa jadi benar. Masalahnya adalah 600 adalah KEPUTUSAN yang didokumentasikan sebagai TAKDIR. Cut-off adalah pilihan bisnis: setiap titik punya harga (approval yang hilang) dan hadiah (bad rate yang turun). Tanpa tabel trade-off, bank itu buta terhadap harga keputusannya sendiri — ia menolak 40% aplikasi tanpa tahu apakah 35% di antaranya sebenarnya nasabah baik yang ditolak sia-sia.",
        "Lesson ini membangun ulang angka keramat itu dari nol: dari regresi logistik (mesin peluangnya), ke log-odds (bahasanya), ke penskalaan skor ala industri (PDO, base score), sampai tabel cut-off vs approval vs bad rate — artefak yang seharusnya ada di meja setiap komite kredit. Di akhir, kamu bisa menjawab pertanyaan Rina dengan angka, bukan dengan 'dari dulu begitu'.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Scorecard adalah jembatan paling langsung dari statistik ke pekerjaan risk analyst: hampir setiap lowongan credit risk meminta 'scorecard development/monitoring'. Memahami log-odds → skor → cut-off → trade-off adalah literasi dasar profesi ini — dan tabel trade-off adalah deliverable yang membedakan analis yang 'bisa modeling' dari yang 'bisa mengambil keputusan'.",
      },
      reference: "Cut-off = keputusan bisnis (harga vs hadiah), bukan konstanta alam. Buktikan dengan tabel trade-off.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan odds, log-odds, dan fungsi sigmoid serta kapan regresi logistik dipakai; (2) menghitung Weight of Evidence (WoE) dan Information Value (IV) untuk seleksi variabel; (3) mengonversi log-odds menjadi skor kredit dengan skala PDO; (4) membangun tabel cut-off vs approval rate vs bad rate; (5) mengevaluasi daya pisah model dengan KS dan Gini serta memutuskan cut-off dari risk appetite.",
        "Rutenya: cerita, bekal ringkas, tiga konsep (log-odds & sigmoid; WoE/IV; penskalaan skor), lab Pyodide (gradient descent → skor → tabel cut-off, studi kasus 2.000 aplikasi), chart trade-off dengan panduan baca, peta keputusan, mini-case bank digital, kuis, rangkuman. Estimasi 62 menit; lab-nya sekitar 20 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Regresi linear memprediksi nilai kontinu via kombinasi linear w·x. Regresi logistik memakai 'mesin' yang sama (kombinasi linear z = w·x) tetapi melewatkannya melalui fungsi sigmoid σ(z) = 1/(1+e^(−z)) sehingga outputnya peluang antara 0 dan 1 — cocok untuk kejadian biner seperti gagal bayar (1) vs lancar (0). Pelatihan = mencari w yang memaksimalkan likelihood data (di lab: via gradient descent).",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: regresi linear menjawab 'berapa besar nilainya'; regresi logistik menjawab 'berapa besar PELUANG kejadiannya'. Mesinnya sama (w·x), 'penerjemahnya' beda (sigmoid). Semua keajaiban scorecard lahir dari penerjemah ini.",
      ],
      reference: "Bekal: z = w·x (linear); p = σ(z) (sigmoid) → peluang. Training = maksimalkan likelihood.",
    },
    {
      id: "konsep-logodds",
      eyebrow: "Langkah 3 · Konsep",
      title: "Log-odds & Sigmoid — Si Penerjemah Dua Bahasa",
      prose: [
        "Definisi: untuk peluang gagal bayar p, ODDS = p/(1−p) — 'banding berapa lawan berapa'. LOG-ODDS = ln(odds) — versi logaritmiknya yang membentang dari −∞ ke +∞. Fungsi SIGMOID σ(z) = 1/(1+e^(−z)) adalah penerjemah bolak-balik: ia mengubah log-odds (bahasa linear model) menjadi peluang (bahasa manusia). Regresi logistik = model linear untuk LOG-ODDS: ln(p/(1−p)) = w₀ + w₁x₁ + w₂x₂ + ...",
        "Kepribadiannya: log-odds seperti penerjemah diplomatik antara dua suku yang tidak saling mengerti — Suku Linear (berbicara dalam penjumlahan tak terbatas) dan Suku Peluang (hanya paham 0 sampai 1). Tanpa penerjemah, model linear akan meramal 'peluang −30%' atau 'peluang 140%' — omong kosong. Sigmoid memastikan apa pun yang dikatakan Suku Linear diterjemahkan menjadi peluang yang sah. Dan seperti penerjemah yang baik, ia bekerja dua arah: koefisien w dibaca dalam bahasa log-odds ('tiap keterlambatan menambah 0,85 log-odds'), lalu diterjemahkan ke peluang untuk manusia.",
        "Kapan memakai: kejadian biner dengan fitur penjelas — gagal bayar, fraud, churn, konversi. Contoh angka: model lab memberi w = (−2,50; 2,98; 0,85) untuk (intersep; utilisasi; keterlambatan). Nasabah A: utilisasi 0,8, telat 2x → log-odds = −2,50 + 2,98×0,8 + 0,85×2 = 1,58 → odds = e^1,58 ≈ 4,85 → p = 4,85/5,85 ≈ 83% peluang gagal bayar. Nasabah B: utilisasi 0,2, telat 0x → log-odds = −1,90 → p ≈ 13%. Satu rumus, dua nasib yang sangat berbeda — dan setiap koefisien bisa diceritakan.",
      ],
      formula: String.raw`p = \sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = w_0 + w_1 x_1 + \cdots + w_k x_k, \qquad \text{odds} = \frac{p}{1-p} = e^{z}`,
      formulaNote: "p = peluang kejadian (gagal bayar); z = skor linear (kombinasi fitur × bobot); w_i = bobot fitur i (dalam satuan log-odds); odds = rasio peluang terjadi vs tidak. Contoh: z = 1,58 → odds = e^1,58 ≈ 4,85 → p = 4,85/(1+4,85) ≈ 0,83. Perhatikan: w_i = 0,85 untuk keterlambatan berarti tiap 1x telat MENGALIKAN odds dengan e^0,85 ≈ 2,34 — interpretasi yang jauh lebih kaya dari 'koefisien 0,85'.",
      tasks: [],
      note: {
        title: "🚨 Mitos: koefisien logistik dibaca seperti koefisien regresi linear",
        type: "pitfall",
        body: "Yang benar: w = 2,98 untuk utilisasi BUKAN berarti 'utilisasi naik 1 → peluang naik 2,98'. Ia berarti log-odds naik 2,98 — efeknya pada PELUANG tergantung posisi awal (di tengah kurva sigmoid efeknya besar, di ujung jenuh). Untuk cerita bisnis, terjemahkan ke odds ratio (e^w) atau hitung contoh dua nasabah seperti di atas.",
      },
      hints: [
        "💡 Intuisi: odds ratio e^w adalah 'bahasa bisnis' koefisien. w = 0,85 → 'tiap keterlambatan melipatgandakan odds gagal bayar ~2,3x'. Komite kredit mengerti kalimat itu; mereka tidak mengerti 'log-odds naik 0,85'.",
      ],
      reference: "ln(odds) = w·x. Baca w sebagai pengali odds (e^w), bukan penambah peluang.",
    },
    {
      id: "konsep-woe",
      eyebrow: "Langkah 4 · Konsep",
      title: "WoE & IV — Si Kurator Variabel",
      prose: [
        "Definisi: sebelum modeling, tiap variabel kategorikal (atau binned numerik) dinilai dengan Weight of Evidence per bin: WoE = ln(%Good / %Bad) — positif berarti bin itu 'lebih baik dari rata-rata'. Information Value merangkum seluruh variabel: IV = Σ (%Good − %Bad) × WoE. Aturan praktis industri: IV < 0,02 (tak berguna), 0,02–0,1 (lemah), 0,1–0,3 (sedang), 0,3–0,5 (kuat), > 0,5 (curigai kebocoran data!).",
        "Kepribadiannya: WoE/IV seperti kurator museum yang memutuskan artefak mana yang layak dipamerkan. WoE menilai tiap RUANG pameran (bin): ruang 'telat 0x' memajang 70% nasabah baik vs 30% gagal — layak sorotan. IV menilai KESELURUHAN KOLEKSI (variabel): 'riwayat keterlambatan' punya IV 0,42 = koleksi masterpiece; 'zodiak nasabah' punya IV 0,003 = gudang sampah. Kurator yang baik juga waspada pada koleksi yang 'terlalu sempurna' — IV > 0,5 biasanya bukan variabel hebat, melainkan KEBOCORAN (variabel yang mengandung informasi masa depan, mis. 'tanggal pelunasan' untuk memprediksi gagal bayar).",
        "Kapan memakai: tahap seleksi variabel scorecard, terutama saat fitur mentah kategorikal/binned. Contoh angka: variabel 'keterlambatan 12 bulan' di-bin 0 / 1–2 / 3+: distribusi Good (60%/30%/10%), Bad (25%/35%/40%). WoE bin '0' = ln(0,60/0,25) = +0,88 (sangat baik); bin '3+' = ln(0,10/0,40) = −1,39 (sangat buruk). IV = 0,35×0,88 + (−0,05)×(−0,29) + (−0,30)×(−1,39)... hitung: (0,60−0,25)×0,88 = 0,308; (0,30−0,35)×ln(0,30/0,35)= (−0,05)×(−0,154) = 0,0077; (0,10−0,40)×(−1,386) = 0,416 → IV ≈ 0,73. Sangat kuat — dan pola WoE yang monoton (makin telat makin negatif) = tanda variabel sehat yang siap masuk model.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: binning boleh diutak-atik sampai IV-nya besar",
        type: "pitfall",
        body: "Yang benar: menggeser batas bin demi memaksimalkan IV = overfitting pada data training (binning yang 'menemukan' pola noise). Bin harus punya LOGIKA BISNIS (0 / 1–2 / 3+ keterlambatan = perilaku berbeda) dan tiap bin butuh sampel cukup (aturan jempol: ≥ 5% populasi). IV besar dari bin hasil utak-atik akan runtuh di data baru — dan kamu tidak akan tahu sampai portofolio berdarah.",
      },
      hints: [
        "💡 Intuisi: WoE yang monoton terhadap urutan bin = lampu hijau (hubungan masuk akal). WoE yang zig-zag (+ − + −) = lampu kuning: mungkin noise, mungkin hubungan non-linear yang butuh perlakuan khusus — jangan telan mentah-mentah.",
      ],
      reference: "WoE = ln(%Good/%Bad) per bin; IV = Σ selisih × WoE. IV > 0,5 → curigai leakage, bukan rayakan.",
    },
    {
      id: "konsep-skor",
      eyebrow: "Langkah 5 · Konsep",
      title: "Penskalaan Skor — Si Penerjemah untuk Direksi",
      prose: [
        "Definisi: log-odds tidak ramah manusia ('log-odds nasabah −1,9' tidak berarti apa-apa di rapat direksi). Industri mengonversinya ke SKOR dengan skala yang disepakati: Skor = Offset − Factor × ln(odds), dengan Factor = PDO / ln(2) dan Offset = SkorDasar + Factor × ln(OddsDasar). PDO (Points to Double the Odds) = berapa poin skor untuk MENGGANDAKAN odds baik:buruk. Konvensi umum: PDO = 20, skor dasar 600 pada odds 1:1.",
        "Kepribadiannya: penskalaan ini seperti menukar mata uang. Log-odds adalah 'mata uang laboratorium' — presisi, tapi tak ada yang memakainya sehari-hari. Skor adalah 'rupiah'-nya credit risk: semua orang paham 'skor 650 lebih baik dari 600', dan PDO memberi nilai tukar yang konsisten — tiap +20 poin SELALU berarti odds baik dua kali lipat, di bagian mana pun skala itu. Tanpa nilai tukar tetap, 'skor naik 30 poin' tidak berarti apa-apa; dengan PDO, ia berarti sesuatu yang presisi.",
        "Kapan memakai: setiap scorecard produksi. Contoh angka (konvensi lab): PDO = 20 → Factor = 20/ln(2) ≈ 28,85. Nasabah A (log-odds 1,58 → odds gagal = e^1,58 ≈ 4,85; odds BAIK = 1/4,85): skor = 600 − 28,85 × ln(4,85) ≈ 600 − 45,5 ≈ 554. Nasabah B (log-odds −1,90 → odds gagal ≈ 0,15): skor = 600 − 28,85 × (−1,90) ≈ 655. Perhatikan tanda minus: skor TINGGI = risiko RENDAH (konvensi standar). Selisih 101 poin ≈ 5 × PDO → odds baik nasabah B ≈ 2^5 = 32x lipat nasabah A. Satu angka, seluruh cerita risiko terkandung di dalamnya.",
      ],
      formula: String.raw`\text{Skor} = \text{Offset} - \frac{\text{PDO}}{\ln 2}\ln(\text{odds}), \qquad \text{Offset} = 600 + \frac{\text{PDO}}{\ln 2}\ln(1) = 600`,
      formulaNote: "odds = peluang gagal / peluang lancar DARI MODEL (odds buruk); PDO = poin untuk menggandakan odds (konvensi 20); Offset = 600 = skor pada odds 1:1 (peluang gagal 50%). Tanda MINUS membuat skor tinggi = aman. Contoh: odds gagal 4,85 → skor ≈ 554; odds gagal 0,15 → skor ≈ 655. Verifikasi PDO: dua nasabah berselisih 20 poin → rasio odds baiknya tepat 2x — selalu, di mana pun pada skala.",
      tasks: [],
      note: {
        title: "🚨 Mitos: skor 650 di bank A sama dengan 650 di bank B",
        type: "pitfall",
        body: "Yang benar: skor hanya bermakna dalam SISTEM penskalaan yang sama (PDO, offset, dan definisi 'bad' yang sama). Bank A (PDO 20, bad = 90+ hari menunggak) vs Bank B (PDO 15, bad = 30+ hari) — angka 650 keduanya tidak bisa dibandingkan. Skor tanpa dokumentasi definisinya = angka tanpa satuan.",
      },
      hints: [
        "💡 Intuisi: dokumentasikan TIGA hal untuk tiap scorecard: definisi bad (mis. 90 DPD dalam 12 bulan), PDO & offset, dan populasi training. Tanpa ketiganya, skor adalah angka yatim yang tidak bisa diaudit.",
      ],
      reference: "Skor = 600 − 28,85×ln(odds gagal) untuk PDO 20. Skor tinggi = aman. Dokumentasikan definisi bad + skala.",
    },
    {
      id: "lab-scorecard",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Dari gradient descent ke tabel cut-off",
      prose: [
        "Waktunya membangun scorecard sungguhan. Data di bawah mensimulasikan 2.000 aplikasi kartu kredit: utilisasi (0–1), keterlambatan 12 bulan (0–3), dan status gagal bayar (y=1). Tugasmu: latih regresi logistik dengan gradient descent manual (4000 iterasi, lr 0,5), konversi log-odds menjadi skor (PDO 20, dasar 600), lalu cetak tabel cut-off vs approval rate vs bad rate — artefak yang ditunggu komite kredit.",
        "Coba: setelah lolos, ubah cut menjadi [500, 580, 660]. Di cut berapa bad rate turun di bawah 40%? Berapa approval yang dikorbankan? Itulah 'harga' keputusan — dan sekarang kamu bisa menghitungnya, bukan menebaknya.",
      ],
      tasks: [
        { id: "t1", text: "Bentuk matriks `X` (kolom 1 + `util` + `late`) dan latih `w` via gradient descent 4000 iterasi" },
        { id: "t2", text: "Hitung `log_odds`, `odds`, lalu `score` (PDO 20, dasar 600; skor tinggi = aman)" },
        { id: "t3", text: "Untuk tiap cut, hitung approval rate dan bad rate di antara yang disetujui" },
        { id: "t4", text: "Hitung `ks`: statistik Kolmogorov-Smirnov dari distribusi skor good vs bad" },
      ],
      requires: ["numpy"],
      expected: "cut=520 approval=0.9825 bad_rate=0.5425\ncut=560 approval=0.8005 bad_rate=0.4691\ncut=600 approval=0.4180 bad_rate=0.2990\nKS=0.4404\nw0=-2.4973 w1=2.9761 w2=0.8495",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(42)
n = 2000
util = rng.uniform(0, 1, n)          # utilisasi kartu kredit (0-1)
late = rng.integers(0, 4, n)         # keterlambatan 12 bulan terakhir
# y=1 berarti gagal bayar. Data sintetis (JANGAN UBAH)
y = (rng.random(n) < 1 / (1 + np.exp(-(-2.5 + 3.0 * util + 0.8 * late)))).astype(int)

# TULIS KODEMU
X = ...
w = ...
for it in range(4000):
    ph = ...
    w = ...
log_odds = ...
odds = ...
factor = ...
score = ...
for cut in [520, 560, 600]:
    appr = ...
    print(f"cut={cut} approval={appr.mean():.4f} bad_rate={y[appr].mean():.4f}")
order = ...
ys = ...
ks = ...
w0, w1, w2 = ...
print(f"KS={ks:.4f}")
print(f"w0={w0:.4f} w1={w1:.4f} w2={w2:.4f}")`,
        lockLines: 8,
        solution: `import numpy as np
rng = np.random.default_rng(42)
n = 2000
util = rng.uniform(0, 1, n)          # utilisasi kartu kredit (0-1)
late = rng.integers(0, 4, n)         # keterlambatan 12 bulan terakhir
# y=1 berarti gagal bayar. Data sintetis (JANGAN UBAH)
y = (rng.random(n) < 1 / (1 + np.exp(-(-2.5 + 3.0 * util + 0.8 * late)))).astype(int)

# TULIS KODEMU
X = np.column_stack([np.ones(n), util, late])
w = np.zeros(3)
for it in range(4000):
    ph = 1 / (1 + np.exp(-(X @ w)))
    w = w - 0.5 * (X.T @ (ph - y) / n)
log_odds = X @ w
odds = np.exp(log_odds)
factor = 20.0 / np.log(2)
score = 600.0 - factor * np.log(odds)
for cut in [520, 560, 600]:
    appr = score >= cut
    print(f"cut={cut} approval={appr.mean():.4f} bad_rate={y[appr].mean():.4f}")
order = np.argsort(score)
ys = y[order]
ks = float(np.abs(np.cumsum(ys) / ys.sum() - np.cumsum(1 - ys) / (1 - ys).sum()).max())
w0, w1, w2 = (float(v) for v in w)
print(f"KS={ks:.4f}")
print(f"w0={w0:.4f} w1={w1:.4f} w2={w2:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w0", value: -2.4973, tol: 0.03, label: "`w0` ≈ −2,50", msg: "Intersep dari gradient descent (4000 iterasi, lr 0,5)." },
          { kind: "equal", task: "t1", name: "w1", value: 2.9761, tol: 0.03, label: "`w1` ≈ 2,98", msg: "Bobot utilisasi — harus positif besar." },
          { kind: "equal", task: "t1", name: "w2", value: 0.8495, tol: 0.03, label: "`w2` ≈ 0,85", msg: "Bobot keterlambatan — tiap telat melipatgandakan odds ~2,3x." },
          { kind: "defined", task: "t2", name: "score", label: "`score` terdefinisi", msg: "Skor = 600 − factor × ln(odds); tinggi = aman." },
          { kind: "stdout_matches", task: "t3", label: "Baris cut=600 benar", msg: "cut 600 → approval 41,8%, bad rate 29,9%.", pattern: "cut=600 approval=0.4180 bad_rate=0.2990" },
          { kind: "equal", task: "t4", name: "ks", value: 0.4404, tol: 0.01, label: "`ks` ≈ 0,44", msg: "KS = jarak maksimum CDF bad vs good." },
        ],
      },
      hints: [
        "💡 Gradient descent untuk logistik: grad = Xᵀ(σ(Xw) − y)/n. Dengan fitur sekecil ini (util 0–1, late 0–3), lr 0,5 dan 4000 iterasi cukup untuk konvergen — gradien akhirmu harus < 1e-6.",
        "💡 Tanda minus pada skor BUKAN opsional: score = 600 − factor×ln(odds_gagal). Terbalik tanda = scorecard terbalik (nasabah terburuk dapat skor tertinggi) — kesalahan yang memalukan di depan komite.",
      ],
      reference: "GD → w; skor = 600 − 28,85·ln(odds); tabel cut-off = harga vs hadiah tiap keputusan.",
    },
    {
      id: "chart-tradeoff",
      eyebrow: "Langkah 7 · Chart",
      title: "Kurva harga sebuah keputusan",
      prose: [
        "Chart di bawah adalah tabel cut-off lab-mu dalam bentuk gambar: garis tegas = approval rate, garis putus-putus = bad rate, untuk cut 520, 560, dan 600.",
        "Cara membaca: sumbu X = cut-off (makin kanan = makin ketat); sumbu Y = persentase. Di cut 520: approval 98,2% tetapi bad rate 54,2% — hampir semua diterima, separuh gagal bayar. Di cut 600: approval tinggal 41,8%, bad rate turun ke 29,9%. Kedua garis TURUN bersama — inilah trade-off yang tak terhindarkan: tidak ada cut yang memberi approval tinggi DAN bad rate rendah sekaligus.",
        "Interpretasi: 'harga' menggeser cut 560 → 600 = mengorbankan 38,2 poin persentase approval (80,0% → 41,8%) untuk menurunkan bad rate 17,0pp (46,9% → 29,9%). Mahal atau murah? Tergantung unit economics: bila margin per nasabah baik Rp2 juta dan loss per gagal bayar Rp15 juta, hitung ekspektasi labanya per cut — cut 'optimal' adalah yang memaksimalkan laba, bukan yang meminimalkan bad rate. Analis junior memilih cut dengan bad rate terendah; analis senior memilih cut dengan laba tertinggi. Chart ini juga menjawab Rina: angka 600 'dari dulu' ternyata punya harga yang bisa dihitung — dan mungkin bukan harga terbaik.",
      ],
      figure: {
        svg: B22_SVG,
        alt: "Grafik trade-off: approval rate dan bad rate sama-sama turun saat cut-off dinaikkan dari 520 ke 600.",
        caption: "Trade-off cut-off: menaikkan cut menurunkan bad rate DENGAN HARGA approval (data sintetis lab).",
      },
      tasks: [],
      reference: "Cut-off optimal = maksimalkan laba ekspektasian, bukan minimalkan bad rate.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan scorecard, kapan bukan?",
      prose: [
        "Empat skenario pemodelan risiko kredit:",
        "Skenario 1 — Butuh model yang bisa DIJELASKAN ke regulator/auditor dan diimplementasikan di core banking lawas. → Scorecard logistik + WoE. Alasan: monotonik, teraudit, koefisien bisa diceritakan; regulator (termasuk OJK) menuntut model yang dapat dijelaskan — black box sulit lolos validasi.",
        "Skenario 2 — Data besar, hubungan non-linear kuat, dan kebutuhan explainability moderat (monitoring internal, bukan pelaporan regulasi). → Gradient boosting (XGBoost/LightGBM) dengan SHAP. Alasan: akurasi biasanya menang; tetapi butuh pipeline explainability dan validasi yang jauh lebih berat.",
        "Skenario 3 — Variabel berperilaku non-monotonik (mis. umur: sangat muda dan sangat tua lebih berisiko). → Binning + WoE dulu (menangkap non-linearitas secara terkontrol), baru logistik. Alasan: logistik murni buta terhadap pola U-shape; binning mengubahnya menjadi pola yang bisa dibaca model linear.",
        "Skenario 4 — Portofolio baru / data sedikit (< 1.000 observasi bad). → Jangan bangun scorecard statistik dulu; pakai expert scorecard (bobot dari judgment + data eksternal) atau model generik. Alasan: IV dan koefisien dari sampel kecil adalah noise yang berdandan sebagai sains — ia akan runtuh di produksi.",
        "Aturan praktis 10 detik: butuh diaudit → logistik+WoE; butuh akurasi & data besar → boosting+SHAP; pola non-linear → binning dulu; data sedikit → expert judgment, bukan statistik.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: mengganti scorecard tiap kali ada model 'lebih akurat'",
        type: "pitfall",
        body: "Kenaikan Gini 0,02 dari model kompleks jarang membayar biaya: revalidasi, redeploy di core banking, edukasi analis, dan risiko model yang tak terjelaskan. Aturan industri: tantang scorecard existing hanya bila challenger menang SIGNIFIKAN dan STABIL di out-of-time sample — bukan sekadar di cross-validation.",
      },
      reference: "Diaudit → logistik; akurasi → boosting; non-linear → binning; data sedikit → expert.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Bank digital: cut 600 atau cut 560?",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank digital punya 50.000 aplikasi/bulan. Model scorecard-nya (Gini 0,55, KS 0,42 — mirip lab ini) memberi tabel: cut 560 → approval 80%, bad rate 46,9%... tetapi angka ini dari data training lama dengan base rate 55% yang sudah usang; setelah kalibrasi ke base rate portofolio kini (8%), tabelnya: cut 560 → approval 80%, bad rate 4,1%; cut 600 → approval 41,8%, bad rate 2,2%. Unit economics: margin per nasabah lancar Rp1,8 juta/tahun; loss per gagal bayar Rp12 juta. Pertanyaan analisis: (1) Hitung laba ekspektasian per 1.000 aplikasi untuk kedua cut. (2) Cut mana yang dipilih? (3) Apa risiko terbesar rekomendasi ini?",
        "Pembahasan: (1) cut 560: 800 disetujui → 767 lancar × Rp1,8 jt = Rp1.380,6 jt; 33 gagal × Rp12 jt = Rp396 jt → laba ≈ Rp984,6 jt per 1.000 aplikasi. cut 600: 418 disetujui → 409 lancar × Rp1,8 jt = Rp736,2 jt; 9 gagal × Rp12 jt = Rp108 jt → laba ≈ Rp628,2 jt. (2) cut 560 menang telak secara laba (+Rp356 jt per 1.000 aplikasi ≈ +Rp17,8 M/bulan untuk 50.000 aplikasi). Inilah kenapa 'minimalkan bad rate' adalah nasihat yang buruk — ia mengorbankan laba. (3) Risiko terbesar: STABILITAS. Tabel ini dari satu periode; bila ekonomi memburuk, bad rate di cut 560 (yang lebih longgar) naik LEBIH CEPAT dari di cut 600 — sensitivitas terhadap siklus (cyclicality) harus di-stress-test. Rekomendasi lengkap: pilih 560 untuk laba, tetapi pasang trigger: bila bad rate realisasi > 5% dua bulan beruntun → review cut otomatis.",
        "Catatan: perhatikan langkah kalibrasi di awal soal — memakai tabel training mentah dengan base rate usang adalah kesalahan klasik yang membuat seluruh analisis laba meleset. Scorecard tanpa kalibrasi ulang = kompas yang menunjuk ke utara yang salah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan cut-off adalah kebijakan risiko, bukan output model. Model memberi TABEL; manajemen (dengan risk appetite tertulis) memilih BARIS. Analis yang menyerahkan 'cut optimal = 600' tanpa menunjukkan tabelnya telah mengambil alih wewenang komite — dan akan disalahkan saat portofolio meleset. Selalu: sajikan tabel + rekomendasi + trigger review, bukan satu angka.",
      },
      reference: "Model → tabel trade-off; komite → pilih baris sesuai risk appetite; analis → sertakan trigger review.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Regresi logistik = model linear untuk log-odds; sigmoid menerjemahkan z menjadi peluang; baca koefisien sebagai pengali odds (e^w).",
        "WoE = ln(%Good/%Bad) per bin; IV merangkum kekuatan variabel; IV > 0,5 → curigai kebocoran data.",
        "Skor = Offset − Factor×ln(odds); PDO = poin untuk menggandakan odds; skor tinggi = aman.",
        "Tabel cut-off vs approval vs bad rate = artefak keputusan; cut optimal = maksimalkan laba, bukan minimalkan bad rate.",
        "KS/Gini mengukur daya pisah; model diaudit → logistik+WoE; validasi harus out-of-time, bukan sekadar cross-validation.",
      ],
      quiz: [
        {
          q: "Odds gagal bayar seorang nasabah adalah 1:4 (1 banding 4). Berapa peluang gagal bayarnya?",
          options: [
            { text: "0,20 — p = odds/(1+odds) = 1/5", why: "Benar: odds 1:4 berarti 1 kejadian per 5 total → p = 0,20.", correct: true },
            { text: "0,25 — 1 dibagi 4", why: "Salah: 1/4 = rasio terhadap yang TIDAK terjadi; peluang = kejadian / total = 1/5." },
            { text: "0,80 — kebalikannya", why: "Salah: 0,80 adalah peluang LANCAR (4/5), bukan gagal bayar." },
            { text: "Tidak bisa dihitung tanpa model", why: "Salah: konversi odds↔peluang adalah aritmetika murni, tidak butuh model." },
          ],
        },
        {
          q: "Scorecard PDO 20 (skor tinggi = aman). Odds baik:buruk seorang nasabah naik 2x lipat. Apa yang terjadi pada skornya?",
          options: [
            { text: "Naik 20 poin — definisi PDO: menggandakan odds baik = +PDO poin", why: "Benar: PDO adalah nilai tukar resmi skala ini.", correct: true },
            { text: "Turun 20 poin", why: "Salah: odds BAIK naik → risiko turun → skor (tinggi=aman) NAIK. Perhatikan odds mana yang digandakan." },
            { text: "Naik 28,85 poin (factor)", why: "Salah: 28,85 adalah factor per ln(odds); menggandakan = ln(2) × factor = 20. Jangan tertukar." },
            { text: "Tidak berubah — PDO hanya untuk kalibrasi awal", why: "Salah: PDO berlaku permanen di seluruh skala; ia definisi, bukan parameter sekali pakai." },
          ],
        },
        {
          q: "Sebuah variabel punya IV = 0,03. Tindakan yang tepat?",
          options: [
            { text: "Lemah — pertimbangkan membuangnya, kecuali ada alasan bisnis kuat", why: "Benar: IV < 0,1 = daya pisah lemah; menyimpan variabel lemah menambah noise dan kompleksitas.", correct: true },
            { text: "Pertahankan — semua variabel berkontribusi", why: "Salah: 'berkontribusi sedikit' ≠ 'berguna'; variabel lemah menambah varians estimasi tanpa manfaat." },
            { text: "Naikkan bobotnya agar IV-nya naik", why: "Salah: IV adalah SIFAT data, bukan parameter yang bisa disetel — seperti mencoba menaikkan suhu dengan mengganti termometer." },
            { text: "IV tidak relevan untuk scorecard", why: "Salah: IV adalah standar industri seleksi variabel scorecard." },
          ],
        },
        {
          q: "cut dinaikkan 560 → 600: approval 80% → 41,8%, bad rate 46,9% → 29,9% (base rate training). Pernyataan benar?",
          options: [
            { text: "Trade-off normal: approval turun 38,2pp 'membeli' penurunan bad rate 17pp — murah/mahalnya dinilai dari laba, bukan dari angkanya", why: "Benar: tidak ada cut yang dominan; keputusan = ekonomi, bukan estetika angka.", correct: true },
            { text: "cut 600 jelas lebih baik karena bad rate lebih rendah", why: "Salah: 'lebih rendah' bukan 'lebih baik' — 38,2pp approval yang hilang mungkin bernilai lebih dari 17pp bad rate yang dihemat." },
            { text: "cut 560 jelas lebih baik karena approval lebih tinggi", why: "Salah: simetris kelirunya — approval tinggi dengan bad rate 46,9% bisa berarti membakar uang." },
            { text: "Modelnya rusak — bad rate seharusnya naik saat cut naik", why: "Salah: cut naik = standar lebih ketat = bad rate TURUN. Arahnya tepat." },
          ],
        },
        {
          q: "Model barumu punya KS = 0,78 di training. Reaksi pertama yang benar?",
          options: [
            { text: "Curigai kebocoran data — KS setinggi itu jarang jujur; audit fitur sebelum merayakan", why: "Benar: KS > 0,7 adalah bendera merah klasik leakage (fitur mengandung informasi masa depan).", correct: true },
            { text: "Langsung deploy — semakin tinggi KS semakin baik", why: "Salah: KS sangat tinggi di training + runtuh di produksi = pola klasik kebocoran; deploy buta = bunuh diri." },
            { text: "KS tidak penting, yang penting akurasi", why: "Salah: pada data imbalance, akurasi menipu (prediksi semua 'lancar' bisa 95% akurat dan 100% tak berguna); KS/Gini mengukur daya pisah." },
            { text: "Turunkan KS dengan mengurangi fitur", why: "Salah: mengobati gejala — bila sumbernya leakage, model tetap bocor dengan KS lebih rendah." },
          ],
        },
      ],
      next: { label: "B23 — Time-Series Terapan: Stationarity, ARIMA, dan GARCH", href: "/learn/b23-time-series-arima-garch" },
    },
  ],
};
